// "Train my eye" data: chart bars from the app's published feeds and the owner's marks (Supabase rfx_training_marks,
// RLS owner-only; localStorage when the table can't be reached, with a banner on the page).
//   FX / metals / crypto / CFDs: /fx/latest.json (symbol list) + /fx/d/<class>.json (bars H1 / H4 / D1 / W1 / MN)
//   Stocks: /scanner/index.json (symbol list) + /scanner/t/<k>.json (D1 bars; W1 / MN / 3M when the scan publishes them)
import { supa } from './cloud';
import { unpackBars } from '@/core/scanner';
import { regimeOf, type Regime } from '@/core/training/structure';
import { parseMarks, toTBars, type Market, type TBar, type TrainChart, type TrainTf } from '@/core/training/types';

export interface SymRow { sym: string; market: Market; cls: string; k: string }
type RawBar = [string, number, number, number, number];
const okBar = (b: unknown): b is RawBar => Array.isArray(b) && b.length === 5 && typeof b[0] === 'string' && b.slice(1).every(n => typeof n === 'number' && Number.isFinite(n));

const cache = new Map<string, Promise<unknown>>();
function getJson(url: string): Promise<unknown> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : Promise.reject(new Error(`${url}: ${r.status}`))));
    p.catch(() => cache.delete(url));
    cache.set(url, p);
  }
  return p;
}

export const CLASS_LABEL: Record<string, string> = { major: 'FX majors', cross: 'FX crosses', exotic: 'FX exotics', metal: 'Metals', crypto: 'Crypto', cfd: 'Indices & CFDs', stock: 'Stocks' };
export const CLASS_ORDER = ['major', 'cross', 'exotic', 'metal', 'crypto', 'cfd', 'stock'];

/** Every symbol the feeds publish bars for. */
export async function loadSymbols(): Promise<SymRow[]> {
  const [fx, ix] = await Promise.allSettled([getJson('/fx/latest.json'), getJson('/scanner/index.json')]);
  const out: SymRow[] = [];
  if (fx.status === 'fulfilled') {
    const map = (fx.value as { map?: { sym?: string; cls?: string; k?: string }[] })?.map ?? [];
    for (const r of map) if (r?.sym && r.cls) out.push({ sym: r.sym, market: 'fx', cls: r.cls, k: r.k || r.cls });
  }
  if (ix.status === 'fulfilled') {
    const rows = (ix.value as { tickers?: { s?: string; k?: number }[] })?.tickers ?? [];
    for (const r of rows) if (r?.s && typeof r.k === 'number') out.push({ sym: r.s, market: 'stock', cls: 'stock', k: String(r.k) });
  }
  if (!out.length) throw new Error('No chart feeds reachable');
  return out;
}

/** All timeframes' bars of one symbol (oldest first). */
export async function loadBars(row: SymRow): Promise<Partial<Record<TrainTf, TBar[]>>> {
  if (row.market === 'fx') {
    const js = await getJson(`/fx/d/${encodeURIComponent(row.k)}.json`) as { instruments?: Record<string, { bars?: Record<string, unknown[]> }> };
    const bars = js?.instruments?.[row.sym]?.bars ?? {};
    const out: Partial<Record<TrainTf, TBar[]>> = {};
    for (const [tf, v] of Object.entries(bars)) if (Array.isArray(v)) { const b = v.filter(okBar); if (b.length >= 20) out[tf as TrainTf] = toTBars(b); }
    return out;
  }
  const js = await getJson(`/scanner/t/${row.k}.json`) as { tickers?: Record<string, { bars?: Parameters<typeof unpackBars>[0]; hb?: Record<string, Parameters<typeof unpackBars>[0]> }> };
  const t = js?.tickers?.[row.sym];
  const out: Partial<Record<TrainTf, TBar[]>> = {};
  if (t?.bars) { const b = unpackBars(t.bars).filter(okBar); if (b.length >= 20) out.D1 = toTBars(b); }
  for (const [tf, p] of Object.entries(t?.hb ?? {})) { const b = unpackBars(p).filter(okBar); if (b.length >= 16) out[tf as TrainTf] = toTBars(b); }
  return out;
}

export interface Candidate { row: SymRow; tf: TrainTf; regime: Regime }
const pick = <T,>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/**
 * A random chart that widens the marked set: the market class and the regime (up / down / range) marked least so far
 * are preferred, a symbol + timeframe not marked yet.
 */
export async function randomChart(symbols: SymRow[], marked: TrainChart[]): Promise<Candidate | null> {
  const classes = CLASS_ORDER.filter(c => symbols.some(s => s.cls === c));
  const markedKey = new Set(marked.map(m => `${m.symbol}|${m.tf}`));
  const count = (f: (m: TrainChart) => boolean) => marked.filter(f).length;
  const byClass = [...classes].sort((a, b) => count(m => m.cls === a) - count(m => m.cls === b) || Math.random() - 0.5);
  const regimeCount = (r: Regime) => count(m => regimeOf(toTBars(m.bars)) === r);
  const wantRegime = (['up', 'down', 'range'] as Regime[]).sort((a, b) => regimeCount(a) - regimeCount(b) || Math.random() - 0.5)[0];
  for (const cls of byClass.slice(0, 3)) {
    const pool = symbols.filter(s => s.cls === cls).sort(() => Math.random() - 0.5).slice(0, cls === 'stock' ? 4 : 8);
    const cands: Candidate[] = [];
    for (const row of pool) {
      try {
        const all = await loadBars(row);
        for (const [tf, bars] of Object.entries(all)) if (bars && !markedKey.has(`${row.sym}|${tf}`)) cands.push({ row, tf: tf as TrainTf, regime: regimeOf(bars) });
      } catch { /* skip */ }
    }
    const want = cands.filter(c => c.regime === wantRegime);
    if (want.length) return pick(want);
    if (cands.length) return pick(cands);
  }
  return null;
}

// ─── Storage ──────────────────────────────────────────────────────────────────────────────────────────────
const LOCAL_KEY = 'rfx_training_marks_local';
export type StoreMode = 'cloud' | 'local';

export function readLocal(): TrainChart[] {
  try { const v = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]'); return Array.isArray(v) ? v.map(normalize).filter((x): x is TrainChart => !!x) : []; } catch { return []; }
}
function writeLocal(list: TrainChart[]) { try { localStorage.setItem(LOCAL_KEY, JSON.stringify(list)); } catch { /* storage full / blocked */ } }

export function normalize(v: unknown): TrainChart | null {
  const o = v as Partial<TrainChart> | null;
  if (!o || typeof o.symbol !== 'string' || typeof o.tf !== 'string' || !Array.isArray(o.bars)) return null;
  return {
    id: String(o.id ?? `${o.symbol}|${o.tf}|${o.as_of}`), symbol: o.symbol, tf: o.tf as TrainTf, market: o.market === 'stock' ? 'stock' : 'fx', cls: String(o.cls ?? ''),
    as_of: String(o.as_of ?? ''), bars_hash: String(o.bars_hash ?? ''), bars: o.bars.filter(okBar), marks: parseMarks(o.marks), note: String(o.note ?? ''),
    created_at: String(o.created_at ?? new Date().toISOString()), updated_at: String(o.updated_at ?? new Date().toISOString()),
  };
}

/** The table row <-> TrainChart (market / cls ride inside marks jsonb so the table stays as specified). */
const toRow = (c: TrainChart, userId: string) => ({
  user_id: userId, symbol: c.symbol, tf: c.tf, as_of: c.as_of, bars_hash: c.bars_hash, bars: c.bars,
  marks: { ...c.marks, market: c.market, cls: c.cls }, note: c.note, updated_at: new Date().toISOString(),
});
const fromRow = (r: Record<string, unknown>): TrainChart | null => {
  const m = (r.marks ?? {}) as { market?: string; cls?: string };
  return normalize({ ...r, id: r.id, market: m.market, cls: m.cls });
};

/** Load every marked chart: cloud when the table answers, else this device. */
export async function listCharts(userId: string | null): Promise<{ mode: StoreMode; charts: TrainChart[]; why?: string }> {
  if (!userId) return { mode: 'local', charts: readLocal(), why: 'not signed in' };
  try {
    const { data, error } = await supa().from('rfx_training_marks').select('*').order('updated_at', { ascending: false });
    if (error) throw new Error(error.message);
    return { mode: 'cloud', charts: (data ?? []).map(fromRow).filter((x): x is TrainChart => !!x) };
  } catch (e) {
    return { mode: 'local', charts: readLocal(), why: e instanceof Error ? e.message : String(e) };
  }
}

export async function saveChart(mode: StoreMode, userId: string | null, c: TrainChart): Promise<TrainChart> {
  if (mode === 'cloud' && userId) {
    const { data, error } = await supa().from('rfx_training_marks').upsert(toRow(c, userId), { onConflict: 'user_id,symbol,tf,as_of' }).select().single();
    if (error) throw new Error(error.message);
    return fromRow(data as Record<string, unknown>) ?? c;
  }
  const list = readLocal().filter(x => x.id !== c.id && !(x.symbol === c.symbol && x.tf === c.tf && x.as_of === c.as_of));
  const saved = { ...c, updated_at: new Date().toISOString() };
  writeLocal([saved, ...list]);
  return saved;
}

export async function deleteChart(mode: StoreMode, c: TrainChart): Promise<void> {
  if (mode === 'cloud') {
    const { error } = await supa().from('rfx_training_marks').delete().eq('id', c.id);
    if (error) throw new Error(error.message);
    return;
  }
  writeLocal(readLocal().filter(x => x.id !== c.id));
}

/** Copy charts saved on this device into the cloud table, then clear them locally. */
export async function uploadLocal(userId: string): Promise<number> {
  const local = readLocal();
  let n = 0;
  for (const c of local) { await saveChart('cloud', userId, c); n++; }
  writeLocal([]);
  return n;
}
