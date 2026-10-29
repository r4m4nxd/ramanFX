// Adversarial fixtures for the Telegram bot (charts + commands): a synthetic published data set (fx/latest.json, fx
// shards, scanner index / shards / latest) with hostile prices, histories, zones, trendlines and symbol names, plus
// synthetic live sources (good, null, throwing, HTTP 401, hanging until the request timeout). Node only; used by
// src/core/botBreak.test.ts and scripts/render-break.ts. Every series is deterministic (seeded by name).
import type { Ctx } from '../supabase/functions/telegram-bot/logic.ts';
import type { LiveFx, LiveSource, LiveStock } from '../supabase/functions/telegram-bot/live.ts';
import type { ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';
import { memoryStore } from '../supabase/functions/telegram-bot/prefs.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

function rng(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  let a = h >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t + 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const pad = (n: number) => String(n).padStart(2, '0');
const iso16 = (ms: number) => new Date(ms).toISOString().slice(0, 16);
const DAY = 86400000;

/** Bar times ending at `now` for a timeframe (FX labels 'YYYY-MM-DDTHH:MM'; weekends skipped below W1). */
export function times(tf: string, n: number, now: Date): string[] {
  const out: string[] = [];
  if (tf === 'MN') {
    let y = now.getUTCFullYear(), m = now.getUTCMonth();
    for (let i = 0; i < n; i++) { out.unshift(`${y}-${pad(m + 1)}-01T00:00`); if (--m < 0) { m = 11; y--; } }
    return out;
  }
  if (tf === 'W1') {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const sat = d.getTime() - ((d.getUTCDay() + 1) % 7) * DAY;   // the Saturday on or before (forex weeks)
    for (let i = 0; i < n; i++) out.unshift(iso16(sat - i * 7 * DAY));
    return out;
  }
  const step = { M15: 900000, H1: 3600000, H4: 4 * 3600000, D1: DAY }[tf] ?? DAY;
  let t = Math.floor(now.getTime() / step) * step;
  while (out.length < n) {
    const wd = new Date(t).getUTCDay();
    if (wd !== 0 && wd !== 6) out.unshift(tf === 'D1' ? `${iso16(t).slice(0, 10)}T00:00` : iso16(t));
    t -= step;
  }
  return out;
}

export type Shape = 'walk' | 'flat' | 'gapUp' | 'gapDown' | 'split' | 'bad' | 'trend';
/** n bars ending near `end`: a random walk (vol = fraction per bar), or a hostile shape. */
export function series(seed: string, ts: string[], end: number, vol: number, shape: Shape = 'walk'): ZBar[] {
  const r = rng(seed), n = ts.length;
  const cl: number[] = new Array(n);
  cl[n - 1] = end;
  for (let i = n - 2; i >= 0; i--) {
    let f = 1 + (r() - 0.5) * 2 * vol;
    if (shape === 'trend') f = 1 - vol * 0.6 + (r() - 0.5) * vol;
    if (shape === 'gapUp' && i === n - 4) f = 1 / 1.6;        // +60% gap three bars ago
    if (shape === 'gapDown' && i === n - 4) f = 1 / 0.4;      // -60%
    if (shape === 'split' && i === n - 6) f = 10;             // price / 10 overnight (an unadjusted split)
    cl[i] = shape === 'flat' ? end : cl[i + 1] * f;
  }
  return ts.map((d, i) => {
    const c = cl[i], o = shape === 'flat' ? end : i ? cl[i - 1] : c * (1 + (r() - 0.5) * vol);
    const w = shape === 'flat' ? 0 : Math.abs(c - o) * 0.3 + c * vol * r() * 0.5;
    const b = { d, o, c, h: Math.max(o, c) + w * r(), l: Math.max(Math.min(o, c) - w * r(), Math.min(o, c) * 0.5) };
    if (shape === 'bad' && i % 7 === 3) return { ...b, o: NaN };
    if (shape === 'bad' && i % 11 === 5) return { ...b, l: 0 };
    if (shape === 'bad' && i % 13 === 6) return { ...b, l: -b.l, c: -1 };
    return b;
  });
}

export type ZoneKind = 'normal' | 'none' | 'many' | 'overlap' | 'far' | 'edge' | 'inside2' | 'tiny';
export function zonesFor(kind: ZoneKind, price: number, tfs: string[]): J[] {
  const z = (tf: string, side: 'demand' | 'supply', a: number, h: number, touches = 0) => {
    const prox = side === 'demand' ? price * (1 - a) : price * (1 + a), dist = side === 'demand' ? prox - price * h : prox + price * h;
    return { tf, side, proximal: prox, distal: dist, touches, fresh: touches === 0 };
  };
  if (kind === 'none') return [];
  if (kind === 'far') return [z(tfs[0], 'supply', 3, 0.2), z(tfs[0], 'demand', 0.97, 0.01), z(tfs[1], 'supply', 0.5, 0.05)];
  if (kind === 'edge') return [{ tf: tfs[0], side: 'demand', proximal: price, distal: price * 0.98, touches: 0, fresh: true }, z(tfs[1], 'supply', 0.02, 0.01)];
  if (kind === 'inside2') return [z(tfs[0], 'demand', -0.01, 0.03), z(tfs[0], 'supply', -0.005, 0.02), z(tfs[1], 'demand', -0.002, 0.004)];
  if (kind === 'tiny') return [z(tfs[0], 'demand', 0.01, 0.00001), z(tfs[1], 'supply', 0.01, 0.00001)];
  if (kind === 'overlap') return tfs.flatMap(tf => [z(tf, 'demand', 0.01, 0.03), z(tf, 'demand', 0.015, 0.03), z(tf, 'supply', 0.012, 0.02), z(tf, 'supply', 0.02, 0.02)]);
  if (kind === 'many') return Array.from({ length: 40 }, (_, i) => z(tfs[i % tfs.length], i % 2 ? 'supply' : 'demand', 0.002 + i * 0.004, 0.003, i % 3));
  return tfs.flatMap((tf, i) => [z(tf, 'demand', 0.01 + i * 0.01, 0.01), z(tf, 'supply', 0.012 + i * 0.01, 0.01, 1)]);
}

export type TlKind = 'none' | 'many' | 'vertical' | 'flat' | 'cross';
/** Published trendlines (zones.tl_export shape) on the newest bar of each TF. */
export function tlsFor(kind: TlKind, bars: Record<string, ZBar[]>): Record<string, J[]> {
  const out: Record<string, J[]> = {};
  for (const [tf, bs] of Object.entries(bars)) {
    if (!bs.length || kind === 'none') { out[tf] = []; continue; }
    const last = bs[bs.length - 1], p = last.c, n = Math.min(60, bs.length - 1);
    const L = (dir: number, pv: number, s: number, touches = 2) => ({ dir, p: pv, s, n, t: last.d, touches, x: false });
    if (kind === 'many') out[tf] = Array.from({ length: 12 }, (_, i) => L(i % 2 ? -1 : 1, p * (1 + (i % 2 ? 1 : -1) * 0.002 * (i + 1)), p * 0.0005 * (i % 2 ? -1 : 1) * (i + 1), 2 + (i % 3)));
    else if (kind === 'vertical') out[tf] = [L(1, p * 0.99, p * 0.3), L(-1, p * 1.01, -p * 0.3)];
    else if (kind === 'flat') out[tf] = [L(1, p * 0.995, 0), L(-1, p * 1.005, -1e-12)];
    else out[tf] = [L(1, p * 1.01, p * 0.002), L(-1, p * 0.99, -p * 0.002)];   // lines through the price
  }
  return out;
}

export interface Fx { sym: string; price: number; digits: number; pip?: number; n?: number | Record<string, number>; shape?: Shape; zones?: ZoneKind; tls?: TlKind; vol?: number; missing?: string[]; cls?: string }
export interface St { sym: string; name?: string; price: number; n?: number; shape?: Shape; zones?: ZoneKind; tls?: TlKind; vol?: number; hb?: boolean; signal?: boolean }

export const FX_FIX: Fx[] = [
  { sym: 'SHIBUSD', price: 0.00001234, digits: 8, pip: 1e-8, vol: 0.03, cls: 'crypto' },
  { sym: 'SHIBLOW', price: 0.00001234, digits: 5, pip: 1e-5, vol: 0.03, cls: 'crypto' },   // digits too coarse for the price
  { sym: 'USDJPY', price: 151.234, digits: 3, pip: 0.01, vol: 0.003, zones: 'many', tls: 'many' },
  { sym: 'BTCUSD', price: 123456.78, digits: 2, pip: 10, vol: 0.02, zones: 'overlap', tls: 'vertical', cls: 'crypto' },
  { sym: 'BTCBIG', price: 1234567.89, digits: 2, pip: 100, vol: 0.02, cls: 'crypto' },
  { sym: 'EURUSD', price: 1.11757, digits: 5, pip: 0.0001, vol: 0.002, zones: 'edge', tls: 'flat' },
  { sym: 'GBPUSD', price: 1.3, digits: 5, pip: 0.0001, vol: 0.002, zones: 'inside2', tls: 'cross' },
  { sym: 'AUDUSD', price: 0.65, digits: 5, pip: 0.0001, n: 1, zones: 'none', tls: 'none' },
  { sym: 'NZDUSD', price: 0.6, digits: 5, pip: 0.0001, n: 3, zones: 'far' },
  { sym: 'USDCAD', price: 1.38, digits: 5, pip: 0.0001, n: 20, zones: 'tiny' },
  { sym: 'USDCHF', price: 0.8, digits: 5, pip: 0.0001, shape: 'flat', zones: 'normal' },
  { sym: 'XAUUSD', price: 2650.5, digits: 2, pip: 0.1, vol: 0.01, shape: 'gapUp', missing: ['MN', 'H1'], cls: 'metal' },
  { sym: 'XAGUSD', price: 30.5, digits: 3, pip: 0.01, shape: 'gapDown', cls: 'metal' },
  { sym: 'US30', price: 42000, digits: 1, pip: 1, shape: 'bad', cls: 'cfd' },
  { sym: 'EURGBP', price: 0.85, digits: 5, pip: 0.0001, n: { MN: 2, W1: 0, D1: 5, H4: 80, H1: 0 } },
];
export const ST_FIX: St[] = [
  { sym: 'PENY', name: 'Penny Stock Corp', price: 0.8, vol: 0.05 },
  { sym: 'BRK.B', name: 'Berkshire Hathaway', price: 5000, vol: 0.01, zones: 'many', tls: 'many', signal: true },
  { sym: 'BRK.A', name: 'Berkshire Hathaway Inc.', price: 817500, vol: 0.01 },
  { sym: 'BIGA', name: 'A very expensive stock', price: 1234567.5, vol: 0.01 },
  { sym: 'HALT', name: 'Halted Holdings', price: 12.34, shape: 'flat' },
  { sym: 'GAPU', name: 'Gap Up Inc', price: 50, shape: 'gapUp', zones: 'far' },
  { sym: 'GAPD', name: 'Gap Down Inc', price: 50, shape: 'gapDown', zones: 'inside2', tls: 'cross' },
  { sym: 'SPLT', name: 'Split Co', price: 25, shape: 'split', zones: 'edge' },
  { sym: 'BADB', name: 'Bad Bars Ltd', price: 40, shape: 'bad', zones: 'overlap' },
  { sym: 'ONE', name: 'One Bar', price: 10, n: 1, zones: 'none', hb: false },
  { sym: 'TRI', name: 'Three Bars', price: 10, n: 3, hb: false },
  { sym: 'TWNTY', name: 'Twenty Bars', price: 10, n: 20, hb: false, tls: 'vertical' },
  { sym: 'NOHB', name: 'No Higher Bars', price: 80, hb: false, tls: 'flat' },
  { sym: 'BF-B.X', name: 'Dash & Dot <Holdings> "Quoted"', price: 30 },
  { sym: 'LONGNAMEXYZ', name: 'The Extremely Long Company Name Incorporated Holdings Group International Worldwide <b>bold</b> &amp; Co', price: 123.45, tls: 'many', zones: 'many' },
];

/** The published data set as ctx.load() serves it. */
export function publishedFiles(now: Date): Map<string, unknown> {
  const files = new Map<string, unknown>();
  const map: J[] = [], instruments: J = {};
  for (const f of FX_FIX) {
    const bars: Record<string, ZBar[]> = {};
    for (const tf of ['H1', 'H4', 'D1', 'W1', 'MN']) {
      if (f.missing?.includes(tf)) continue;
      const n = typeof f.n === 'number' ? f.n : f.n?.[tf] ?? (tf === 'W1' ? 52 : tf === 'MN' ? 60 : 80);
      bars[tf] = n ? series(`${f.sym}:${tf}`, times(tf, n, now), f.price, (f.vol ?? 0.004) * ({ H1: 0.3, H4: 0.6, D1: 1, W1: 2, MN: 4 }[tf] ?? 1), f.shape) : [];
    }
    const zones = zonesFor(f.zones ?? 'normal', f.price, ['MN', 'W1', 'D1', 'H4', 'H1']);
    map.push({ sym: f.sym, oanda: `${f.sym.slice(0, 3)}_${f.sym.slice(3)}`, cls: f.cls ?? 'major', k: 'brk', wl: true, digits: f.digits, pip: f.pip, px: f.price });
    instruments[f.sym] = { sym: f.sym, digits: f.digits, pip: f.pip, price: f.price, tv: `PEPPERSTONE:${f.sym}`, states: { MN: 'UP', W1: 'DOWN', D1: 'PULLBACK', H4: 'UP', H1: 'TURNING UP' },
      zones, hits: [], checks: [], signals: [], bars: Object.fromEntries(Object.entries(bars).map(([tf, bs]) => [tf, bs.map(b => [b.d, b.o, b.h, b.l, b.c])])), tls: tlsFor(f.tls ?? 'normal' as TlKind, bars) };
  }
  const usd = FX_FIX.find(f => f.sym === 'USDJPY')!;
  files.set('fx/latest.json', { generated: now.toISOString(), h1_close_utc: now.toISOString(), map, counts: { BUY: 1, instruments: map.length },
    signals: [{ sym: 'USDJPY', tf: 'H4', kind: 'BUY', entry: usd.price * 0.99, stop: usd.price * 0.98, target: usd.price * 1.03, rr: 3, digits: 3, price: usd.price, side: 'demand', wl: true, score: 9 }],
    watch: [], lists: { demand: { in: [], near: [], left: [] }, supply: { in: [], near: [], left: [] } } });
  files.set('fx/d/brk.json', { instruments });

  const tickers: J[] = [], shard: J = {};
  for (const s of ST_FIX) {
    const n = s.n ?? 120;
    const ts = times('D1', n, new Date(now.getTime() - DAY)).map(t => t.slice(0, 10));
    const daily = series(`${s.sym}:D1`, ts, s.price, s.vol ?? 0.02, s.shape);
    const d0 = Date.parse(`${ts[0]}T00:00:00Z`);
    const pack = (bs: ZBar[]) => ({ t0: bs[0]?.d.slice(0, 10), dt: bs.map(b => Math.round((Date.parse(`${b.d.slice(0, 10)}T00:00:00Z`) - Date.parse(`${bs[0].d.slice(0, 10)}T00:00:00Z`)) / DAY)), b: bs.map(b => [b.o, b.h, b.l, b.c]) });
    const hb = s.hb === false ? undefined : {
      W1: pack(series(`${s.sym}:W1`, times('W1', 100, new Date(d0 - DAY)).map(t => { const x = new Date(`${t.slice(0, 10)}T00:00:00Z`); return new Date(x.getTime() + 2 * DAY).toISOString().slice(0, 10); }), daily[0]?.o ?? s.price, (s.vol ?? 0.02) * 2, s.shape === 'bad' ? 'bad' : 'walk')),
      MN: pack(series(`${s.sym}:MN`, times('MN', 60, new Date(d0 - DAY)).map(t => t.slice(0, 10)), daily[0]?.o ?? s.price, (s.vol ?? 0.02) * 4)),
    };
    const zones = zonesFor(s.zones ?? 'normal', s.price, ['3M', 'MN', 'W1']);
    tickers.push({ s: s.sym, n: s.name, k: 99, px: s.price, ix: ['SPX'] });
    const tlb: Record<string, ZBar[]> = { W1: daily.slice(-20), MN: daily.slice(-5) };
    shard[s.sym] = { symbol: s.sym, name: s.name, date: ts[ts.length - 1], price: s.price, zones, bars: daily.length ? pack(daily) : {}, hb, tls: tlsFor(s.tls ?? 'normal' as TlKind, tlb), w1: 'UP', mn: 'DOWN', m3: 'RANGE', chart: `https://www.tradingview.com/chart/?symbol=${s.sym}`, levels_ccy: 'USD' };
  }
  files.set('scanner/index.json', { tickers });
  files.set('scanner/t/99.json', { tickers: shard });
  const brk = ST_FIX.find(s => s.sym === 'BRK.B')!;
  files.set('scanner/latest.json', { date: isoDay(now), generated_at: now.toISOString(), scanned: tickers.length,
    signals: [{ symbol: 'BRK.B', tf: 'W1', kind: 'BUY', entry: brk.price * 0.99, stop: brk.price * 0.97, target: brk.price * 1.06, rr: 3, score: 8, to_entry_pct: 1 }],
    zone_lists: { demand: { in: [], near: [{ s: 'PENY', tf: 'W1', pct: 0.4 }], left: [] }, supply: { in: [], near: [], left: [] } } });
  files.set('events.json', { kinds: {} });
  return files;
}
const isoDay = (t: Date) => t.toISOString().slice(0, 10);

/** Live answers built from the same fixtures (more history, forming candles). */
export function fixtureLive(now: Date): Required<LiveSource> {
  const fx = async (oanda: string): Promise<LiveFx | null> => {
    const f = FX_FIX.find(x => `${x.sym.slice(0, 3)}_${x.sym.slice(3)}` === oanda);
    if (!f) return null;
    const closed: Record<string, ZBar[]> = {}, forming: Record<string, ZBar | null> = {};
    for (const tf of ['M15', 'H1', 'H4', 'D1', 'W1', 'MN']) {
      const n = typeof f.n === 'number' ? f.n : f.n?.[tf] ?? 300;
      const bs = n ? series(`L${f.sym}:${tf}`, times(tf, n, now), f.price, (f.vol ?? 0.004) * ({ M15: 0.15, H1: 0.3, H4: 0.6, D1: 1, W1: 2, MN: 4 }[tf] ?? 1), f.shape) : [];
      closed[tf] = bs.slice(0, -1); forming[tf] = bs[bs.length - 1] ?? null;
    }
    return { closed, forming, price: f.price, at: now.getTime(), feed: 'FIXTURE' };
  };
  const stock = async (sym: string): Promise<LiveStock | null> => {
    const s = ST_FIX.find(x => x.sym === sym);
    if (!s) return null;
    const n = s.n ?? 1500;
    const daily = series(`L${s.sym}:D1`, times('D1', n, now).map(t => t.slice(0, 10)), s.price, s.vol ?? 0.02, s.shape);
    const intra = (tf: string, k: number) => series(`L${s.sym}:${tf}`, times(tf, k, now), s.price, (s.vol ?? 0.02) * 0.2, s.shape === 'bad' ? 'bad' : s.shape === 'flat' ? 'flat' : 'walk');
    return { daily: daily.slice(0, -1), partial: daily[daily.length - 1] ?? null, h1: intra('H1', Math.min(n * 7, 98)), m15: intra('M15', Math.min(n * 26, 260)), h4: intra('H4', Math.min(n * 2, 240)),
      price: s.price, at: now.getTime(), feed: 'FIXTURE' };
  };
  return { fx, stock };
}

export type LiveMode = 'none' | 'ok' | 'null' | 'throw';
export function breakCtx(now: Date, live: LiveMode = 'none', extra: Partial<Ctx> = {}): Ctx {
  const files = publishedFiles(now);
  const good = fixtureLive(now);
  const src: LiveSource | undefined = live === 'none' ? undefined : live === 'ok' ? good
    : live === 'null' ? { fx: async () => null, stock: async () => null }
      : { fx: async () => { throw new Error('boom'); }, stock: async () => { throw new Error('boom'); } };
  return {
    load: async (p: string) => (files.has(p) ? structuredClone(files.get(p)) : null), now, live: src,
    imageUrl: (sym, view, v) => `https://example.test/?img=${encodeURIComponent(sym)}&tf=${view}&v=${v}`,
    prefs: memoryStore(), dispatch: async () => true, scanOne: async () => 'ok', ...extra,
  };
}
export const ALL_FIX = [...FX_FIX.map(f => [f.sym, 'fx'] as const), ...ST_FIX.map(s => [s.sym, 'stock'] as const)];
export const VIEWS_ALL = { fx: ['Q', 'QMN', 'QW1', 'QD1', 'QH4', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'], stock: ['Q', 'Q3M', 'QMN', 'QW1', 'QD1', '3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'] } as const;
