// Chart QA harness: a bot Ctx (logic.ts) on the repo's PUBLISHED files, plus a simulated live source built from them.
// Used by scripts/render-charts.ts (PNG renders) and src/core/chartRender.test.ts (SVG smoke checks). Node only.
//
// Published mode: ctx.load(path) reads public/<path> exactly like index.ts load() maps it to the site (SITE + path,
// fallback RAW public/ + path); 'events.json' = tools/reminders/events.json; news / headlines = null (no network).
//
// Simulated live mode: LiveFx / LiveStock objects (live.ts shapes) built from the same published bars, so the live
// code paths run (zones recomputed by zonecore, forming candles, H4 / H1 / M15 views):
//   FX:     closed[tf] = the shard's H1 / H4 / D1 / W1 / MN bars minus the newest, forming[tf] = the newest one.
//           M15 is SYNTHETIC (each H1 bar split into 4 sub-bars that respect its o/h/l/c).
//   Stocks: daily = the shard's 120 real sessions, split by live.ts splitPartial at ctx.now (so after 16:20 New York
//           the last session is closed, like Alpaca). Older history is SYNTHETIC (hb.W1 weeks -> 5 sessions, hb.MN
//           months before that -> business days) when the shard publishes hb; else only the 120 real sessions.
//           H4 / H1 / M15 are SYNTHETIC (each session split into 26 x 15-minute bars 09:30-16:00 New York).
// Every synthetic series is deterministic (seeded by symbol + TF) and reported in `synthetic` so renders can say so.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Ctx } from '../supabase/functions/telegram-bot/logic.ts';
import { packedBars } from '../supabase/functions/telegram-bot/logic.ts';
import { nyOffset, splitPartial, sessionH4, type LiveFx, type LiveSource, type LiveStock } from '../supabase/functions/telegram-bot/live.ts';
import { weekKey } from '../supabase/functions/telegram-bot/chart.ts';
import type { ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export function readJson(root: string, rel: string): unknown {
  const p = join(root, rel);
  return existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null;
}

/** index.ts load() without the network: public/<path>; events.json from tools/reminders; news + headlines = null. */
export function fileLoader(root: string): (path: string) => Promise<unknown> {
  const memo = new Map<string, unknown>();
  return async (path: string) => {
    if (path.startsWith('headlines/') || path === 'news.json') return null;
    if (memo.has(path)) return memo.get(path);
    const v = path === 'events.json' ? readJson(root, 'tools/reminders/events.json') ?? { kinds: {} } : readJson(root, `public/${path}`);
    memo.set(path, v);
    return v;
  };
}

// ---- deterministic synthetic sub-bars ------------------------------------------------------------------------------
function rng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) { h = Math.imul(h ^ seed.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  let a = h >>> 0;
  return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t + 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** Split one bar into n sub-bars: first open = o, last close = c, the highest high = h, the lowest low = l. */
export function splitBar(b: { o: number; h: number; l: number; c: number }, n: number, r: () => number): { o: number; h: number; l: number; c: number }[] {
  if (n <= 1) return [{ o: b.o, h: b.h, l: b.l, c: b.c }];
  const rangeV = Math.max(b.h - b.l, 1e-12);
  const pts = new Array<number>(n + 1);
  pts[0] = b.o; pts[n] = b.c;
  // the extremes land on interior points (or on the ends when n is small); low first on up bars more often
  let ih = 1 + Math.floor(r() * (n - 1)), il = 1 + Math.floor(r() * (n - 1));
  if (n >= 3) while (il === ih) il = 1 + Math.floor(r() * (n - 1));
  if ((b.c >= b.o) !== (il < ih) && r() < 0.7) [ih, il] = [il, ih];
  const anchors = new Map<number, number>([[0, b.o], [n, b.c]]);
  if (n >= 3 || ih !== il) { anchors.set(ih, b.h); anchors.set(il, b.l); } else anchors.set(ih, r() < 0.5 ? b.h : b.l);
  const ks = [...anchors.keys()].sort((a, z) => a - z);
  for (let s = 0; s < ks.length - 1; s++) {
    const [k0, k1] = [ks[s], ks[s + 1]], [v0, v1] = [anchors.get(k0)!, anchors.get(k1)!];
    for (let k = k0; k <= k1; k++) {
      const f = (k - k0) / (k1 - k0 || 1);
      const noise = k === k0 || k === k1 ? 0 : (r() - 0.5) * rangeV * 0.25;
      pts[k] = Math.min(b.h, Math.max(b.l, v0 + (v1 - v0) * f + noise));
    }
  }
  const out = [];
  for (let k = 0; k < n; k++) {
    const o = pts[k], c = pts[k + 1];
    const w = rangeV * 0.06;
    out.push({ o, c, h: Math.min(b.h, Math.max(o, c) + r() * w), l: Math.max(b.l, Math.min(o, c) - r() * w) });
  }
  // make sure both extremes are reached exactly
  const hi = out.reduce((m, x) => Math.max(m, x.h), -Infinity), lo = out.reduce((m, x) => Math.min(m, x.l), Infinity);
  if (hi < b.h) out[Math.min(ih, n) - 1].h = b.h;
  if (lo > b.l) out[Math.min(il, n) - 1].l = b.l;
  return out;
}

const addDays = (d: string, k: number) => new Date(Date.parse(`${d.slice(0, 10)}T00:00:00Z`) + k * 86400000).toISOString().slice(0, 10);
const dow = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00Z`).getUTCDay();
const pad = (n: number) => String(n).padStart(2, '0');

/** 26 New York 15-minute bars (09:30 .. 15:45) per session. */
function sessionM15(day: ZBar, r: () => number): ZBar[] {
  return splitBar(day, 26, r).map((b, i) => { const m = 9 * 60 + 30 + i * 15; return { d: `${day.d}T${pad(Math.floor(m / 60))}:${pad(m % 60)}`, ...b }; });
}
function group(bars: ZBar[], key: (d: string) => string): ZBar[] {
  const out: ZBar[] = [];
  for (const b of bars) {
    const k = key(b.d), x = out[out.length - 1];
    if (x && x.d === k) { x.h = Math.max(x.h, b.h); x.l = Math.min(x.l, b.l); x.c = b.c; } else out.push({ ...b, d: k });
  }
  return out;
}

export interface SimLive { source: LiveSource; synthetic: Record<string, Set<string>> }

/** A LiveSource whose fx / stock answers are built from the published shards (see the header). */
export function simulatedLive(root: string, now: Date): SimLive {
  const synthetic: Record<string, Set<string>> = {};
  const mark = (sym: string, tf: string) => { (synthetic[sym] ??= new Set()).add(tf); };
  const fxRows = ((readJson(root, 'public/fx/latest.json') as J)?.map ?? []) as J[];
  const stIndex = ((readJson(root, 'public/scanner/index.json') as J)?.tickers ?? []) as J[];
  const memo = new Map<string, unknown>();

  const fx = async (oanda: string): Promise<LiveFx | null> => {
    if (memo.has(oanda)) return memo.get(oanda) as LiveFx | null;
    const row = fxRows.find(r => r.oanda === oanda);
    const d = row ? (readJson(root, `public/fx/d/${row.k ?? row.cls}.json`) as J)?.instruments?.[row.sym] : null;
    let out: LiveFx | null = null;
    if (d?.bars) {
      const closed: Record<string, ZBar[]> = {}, forming: Record<string, ZBar | null> = {};
      for (const tf of ['H1', 'H4', 'D1', 'W1', 'MN']) {
        const bs: ZBar[] = (Array.isArray(d.bars[tf]) ? d.bars[tf] : []).map((x: unknown[]) => ({ d: String(x[0]), o: +x[1]!, h: +x[2]!, l: +x[3]!, c: +x[4]! }));
        closed[tf] = bs.slice(0, -1); forming[tf] = bs[bs.length - 1] ?? null;
      }
      // M15 (synthetic): each H1 bar -> 4 sub-bars; the forming H1 gives 3 closed + the forming 15m
      const r = rng(`${row!.sym}:M15`), m15: ZBar[] = [];
      for (const h of [...closed.H1.slice(-75), ...(forming.H1 ? [forming.H1] : [])]) {
        splitBar(h, 4, r).forEach((b, i) => m15.push({ d: `${h.d.slice(0, 14)}${pad(i * 15)}`, ...b }));
      }
      closed.M15 = forming.H1 ? m15.slice(0, -1) : m15; forming.M15 = forming.H1 ? m15[m15.length - 1] : null;
      mark(row!.sym, 'M15');
      const price = forming.H1?.c ?? closed.H1[closed.H1.length - 1]?.c;
      out = price > 0 ? { closed, forming, price, at: now.getTime(), feed: 'SIMULATED from published shard' } : null;
    }
    memo.set(oanda, out);
    return out;
  };

  const stock = async (sym: string): Promise<LiveStock | null> => {
    if (memo.has(`S:${sym}`)) return memo.get(`S:${sym}`) as LiveStock | null;
    const r0 = stIndex.find(t => t.s === sym);
    const d = r0 ? (readJson(root, `public/scanner/t/${r0.k}.json`) as J)?.tickers?.[sym] : null;
    let out: LiveStock | null = null;
    if (d?.bars?.t0) {
      const real: ZBar[] = packedBars(d.bars).map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c }));
      // older history (synthetic) from hb.W1, then hb.MN before the first week
      const hist: ZBar[] = [];
      const hbW = packedBars(d.hb?.W1).filter(b => weekKey(b.t) < weekKey(real[0].d));
      const hbM = packedBars(d.hb?.MN).filter(b => !hbW.length || b.t.slice(0, 7) < hbW[0].t.slice(0, 7));
      const rd = rng(`${sym}:D1hist`);
      for (const m of hbM) {
        const days: string[] = [];
        for (let x = `${m.t.slice(0, 7)}-01`; x.slice(0, 7) === m.t.slice(0, 7); x = addDays(x, 1)) if (dow(x) % 6 !== 0) days.push(x);
        splitBar(m, days.length, rd).forEach((b, i) => hist.push({ d: days[i], ...b }));
      }
      for (const w of hbW) {
        const mon = weekKey(w.t);
        splitBar(w, 5, rd).forEach((b, i) => hist.push({ d: addDays(mon, i), ...b }));
      }
      if (hist.length) mark(sym, 'D1hist');
      const all = [...hist.filter(b => b.d < real[0].d), ...real];
      const { closed, partial } = splitPartial(all, now.getTime());
      // intraday (synthetic) from the real sessions; today's cut at the New York time of `now`
      const ri = rng(`${sym}:M15`), m15all: ZBar[] = [];
      for (const day of real) m15all.push(...sessionM15(day, ri));
      const nyNow = new Date(now.getTime() + nyOffset(now.getTime()) * 3600000).toISOString().slice(0, 16);
      const m15 = partial ? m15all.filter(b => b.d <= nyNow) : m15all;
      const m30 = group(m15, t => `${t.slice(0, 14)}${t.slice(14, 16) < '30' ? '00' : '30'}`);
      const h1 = group(m15, t => `${t.slice(0, 13)}:00`);
      const lastDay = (real[real.length - 1]).d;
      const since = (k: number) => addDays(lastDay, -k);
      for (const t of ['H4', 'H1', 'M15']) mark(sym, t);
      const price = (partial ? m15[m15.length - 1]?.c : undefined) ?? all[all.length - 1].c;
      out = { daily: closed, partial: partial ? { ...partial, c: price } : null, h1: h1.filter(b => b.d >= since(14)), m15: m15.filter(b => b.d >= since(10)),
        h4: sessionH4(m30).filter(b => b.d >= since(120)), price, at: now.getTime(), feed: 'SIMULATED from published shard' };
    }
    memo.set(`S:${sym}`, out);
    return out;
  };
  return { source: { fx, stock }, synthetic };
}
/** The two contexts a render runs in. */
export function harnessCtx(root: string, now: Date, mode: 'pub' | 'live'): { ctx: Ctx; sim?: SimLive } {
  const load = fileLoader(root);
  if (mode === 'pub') return { ctx: { load, now } };
  const sim = simulatedLive(root, now);
  return { ctx: { load, now, live: sim.source }, sim };
}

/** The views worth rendering per market (unavailable ones make chartData return null and are skipped). */
export const VIEWS = { stock: ['Q', 'QMN', 'D1', 'W1', 'H4', 'M15'], fx: ['Q', 'QW1', 'D1', 'W1', 'H4', 'M15'] } as const;
