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

/** Series for a symbol on every timeframe: this account's first, any account's as a fallback; cloud when the device has none. */
async function loadSymbol(account: string, symbol: string): Promise<Partial<Record<Tf, Series>>> {
  const pick = async (keys: string[], get: (k: string) => Promise<Series | undefined>) => {
    const out: Partial<Record<Tf, Series>> = {};
    for (const tf of TFS) {
      const k = keys.find(x => x === `${account}|${symbol}|${tf}`) ?? keys.find(x => x.endsWith(`|${symbol}|${tf}`));
      const s = k ? await get(k) : undefined;
      if (s?.t.length) out[tf] = s;
    }
    return out;
  };
  const local = await pick(await localKeys(), getLocal);
  if (Object.keys(local).length) return local;
  const user = useStore.getState().user;
  if (!user) return local;
  const { data, error } = await supa().from('rfx_bars').select('key,data').eq('user_id', user.id).like('key', `%|${symbol}|%`);
  if (error || !data?.length) return local;
  const got: Record<string, Series> = {};
  for (const r of data as { key: string; data: Series }[]) { got[r.key] = r.data; await putLocal(r.key, r.data).catch(() => {}); }
  return pick(Object.keys(got), async k => got[k]);
}

export function useTradeBars(account: string, symbol: string) {
  const [state, setState] = useState<{ loading: boolean; series: Partial<Record<Tf, Series>> }>({ loading: true, series: {} });
  const [v, setV] = useState(version);
  const user = useStore(s => s.user?.id);
  useEffect(() => { const f = () => setV(version); subs.add(f); return () => { subs.delete(f); }; }, []);
  useEffect(() => {
    let live = true;
    setState(s => ({ ...s, loading: true }));
    loadSymbol(account, symbol).then(series => live && setState({ loading: false, series })).catch(() => live && setState({ loading: false, series: {} }));
    return () => { live = false; };
  }, [account, symbol, v, user]);
  return state;
}
