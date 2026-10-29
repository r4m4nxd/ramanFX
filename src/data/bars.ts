// Candle storage: IndexedDB on the device (too big for localStorage), mirrored to the cloud per series
// so a file imported on the PC shows on the phone.
import { useEffect, useState } from 'react';
import { mergeSeries, type Series, type Tf, TFS } from '@/core/bars';
import { supa } from './cloud';
import { useStore } from './store';

const DB = 'rfx_bars', STORE = 'series';
let dbp: Promise<IDBDatabase> | null = null;
function db(): Promise<IDBDatabase> {
  return (dbp ??= new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => { dbp = null; rej(r.error); };
  }));
}
function tx<T>(mode: IDBTransactionMode, f: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return db().then(d => new Promise<T>((res, rej) => { const q = f(d.transaction(STORE, mode).objectStore(STORE)); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }));
}
const getLocal = (k: string) => tx<Series | undefined>('readonly', s => s.get(k));
const putLocal = (k: string, v: Series) => tx('readwrite', s => s.put(v, k));
const localKeys = () => tx<IDBValidKey[]>('readonly', s => s.getAllKeys()).then(ks => ks.map(String)).catch(() => [] as string[]);

/** Bumped on every import so open charts reload. */
let version = 0;
const subs = new Set<() => void>();
const bump = () => { version++; subs.forEach(f => f()); };

/** Merge an import into the device store, then mirror it to the cloud in the background. */
export async function saveBars(series: Record<string, Series>): Promise<{ cloud: boolean }> {
  const merged: Record<string, Series> = {};
  for (const [k, s] of Object.entries(series)) { merged[k] = mergeSeries(await getLocal(k), s); await putLocal(k, merged[k]); }
  bump();
  const user = useStore.getState().user;
  if (!user) return { cloud: false };
  void (async () => {
    for (const [key, data] of Object.entries(merged)) {
      try { await supa().from('rfx_bars').upsert({ user_id: user.id, key, data, updated_at: new Date().toISOString() }, { onConflict: 'user_id,key' }); } catch { /* next sync retries on re-import */ }
    }
  })();
  return { cloud: true };
}

/** Rejects after `ms` so a hung IndexedDB open or cloud request can never leave a chart loading forever. */
function within<T>(p: PromiseLike<T>, ms: number, what: string): Promise<T> {
  return new Promise<T>((res, rej) => {
    const id = setTimeout(() => rej(new Error(`${what} timed out`)), ms);
    Promise.resolve(p).then(v => { clearTimeout(id); res(v); }, e => { clearTimeout(id); rej(e); });
  });
}

export type BarsError = 'offline' | 'cloud';

/** Series for a symbol on every timeframe: this account's first, any account's as a fallback; cloud when the device has none. */
async function loadSymbol(account: string, symbol: string): Promise<{ series: Partial<Record<Tf, Series>>; error?: BarsError }> {
  const pick = async (keys: string[], get: (k: string) => Promise<Series | undefined>) => {
    const out: Partial<Record<Tf, Series>> = {};
    for (const tf of TFS) {
      const k = keys.find(x => x === `${account}|${symbol}|${tf}`) ?? keys.find(x => x.endsWith(`|${symbol}|${tf}`));
      const s = k ? await get(k).catch(() => undefined) : undefined;
      if (s?.t.length) out[tf] = s;
    }
    return out;
  };
  const local = await within(pick(await within(localKeys(), 5000, 'device store').catch(() => [] as string[]), getLocal), 8000, 'device store').catch(() => ({}));
  if (Object.keys(local).length) return { series: local };
  const user = useStore.getState().user;
  if (!user) return { series: local };
  // No device copy: the cloud is the only source. Offline, say so instead of waiting on a request that can't finish.
  if (typeof navigator !== 'undefined' && navigator.onLine === false) return { series: local, error: 'offline' };
  try {
    const { data, error } = await within(supa().from('rfx_bars').select('key,data').eq('user_id', user.id).like('key', `%|${symbol}|%`), 12000, 'cloud');
    if (error) return { series: local, error: 'cloud' };
    if (!data?.length) return { series: local };
    const got: Record<string, Series> = {};
    for (const r of data as { key: string; data: Series }[]) { got[r.key] = r.data; await putLocal(r.key, r.data).catch(() => {}); }
    return { series: await pick(Object.keys(got), async k => got[k]) };
  } catch {
    return { series: local, error: typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'cloud' };
  }
}

export function useTradeBars(account: string, symbol: string) {
  const [state, setState] = useState<{ loading: boolean; series: Partial<Record<Tf, Series>>; error?: BarsError }>({ loading: true, series: {} });
  const [v, setV] = useState(version);
  const [attempt, setAttempt] = useState(0);
  const user = useStore(s => s.user?.id);
  useEffect(() => { const f = () => setV(version); subs.add(f); return () => { subs.delete(f); }; }, []);
  // Coming back online retries a load that failed for lack of network.
  useEffect(() => { const f = () => setAttempt(a => a + 1); window.addEventListener('online', f); return () => window.removeEventListener('online', f); }, []);
  useEffect(() => {
    let live = true;
    setState(s => ({ ...s, loading: true, error: undefined }));
    loadSymbol(account, symbol).then(r => live && setState({ loading: false, ...r })).catch(() => live && setState({ loading: false, series: {}, error: 'cloud' }));
    return () => { live = false; };
  }, [account, symbol, v, user, attempt]);
  return { ...state, retry: () => setAttempt(a => a + 1) };
}
