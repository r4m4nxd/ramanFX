// The ENGINE's answer on a marked chart, in the same shape as the owner's marks (types.ts), so score.ts can compare them.
// Runs the bot's pure chart modules unchanged (read-only imports; they are the source of truth):
//   pivots = zvTrend.zvPivots (ZoneVision real valleys / peaks, swing 2),
//   lines  = zvTrend.zvLines replayed bar by bar (every up / down line the indicator would have drawn at some close,
//            not only today's), each ending at its first break,
//   zones  = zonecore.detect (FX_PARAMS on forex / crypto / CFDs, RAJA on stocks).
// Index conversion: Series shift s (1 = newest closed bar) <-> bar index nb - s.
import { detect, FX_PARAMS, RAJA, Series, type ZBar, type ZParams } from '../../../supabase/functions/telegram-bot/zonecore.ts';
import { zvLines, zvPivots, ZV } from '../../../supabase/functions/telegram-bot/zvTrend.ts';
import { firstCloseBreak, firstFullBreak } from './structure';
import type { Market, Marks, MLine, MPivot, MZone, TBar } from './types';

export interface EngineParams {
  /** zvPivots swing size (ZoneVision InpTLSwing). */
  swing: number;
  /** Which candle ends a line: 'full' = the indicator's RemovedAt (whole candle beyond), 'close' = a close beyond. */
  breakRule: 'full' | 'close';
  /** Fewest bars before the line replay starts (the indicator needs history for its pivots). */
  replayFrom: number;
  /** Zone detection parameters (zonecore); null = by market (FX_PARAMS / RAJA). */
  zone: ZParams | null;
}
export const ENGINE_DEFAULTS: EngineParams = { swing: ZV.swing, breakRule: 'full', replayFrom: 20, zone: null };

const zbars = (bars: TBar[]): ZBar[] => bars.map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c }));

export function enginePivots(bars: TBar[], tf: string, p: EngineParams = ENGINE_DEFAULTS): MPivot[] {
  if (bars.length < 2 * p.swing + 4) return [];
  const S = new Series(zbars(bars), null, tf), nb = bars.length;
  const win = Math.min(ZV.lookback, S.n - 1 - p.swing);
  return zvPivots(S, win, p.swing).map(v => ({ i: nb - v.bar, kind: v.t > 0 ? 'peak' as const : 'valley' as const, p: v.p }));
}

export function engineLines(bars: TBar[], tf: string, p: EngineParams = ENGINE_DEFAULTS): MLine[] {
  const seen = new Map<string, MLine>();
  const zb = zbars(bars);
  for (let k = Math.max(p.replayFrom, 2 * ZV.swing + 6); k <= bars.length; k++) {
    const r = zvLines(new Series(zb.slice(0, k), null, tf));
    for (const t of [r.up, r.dn]) {
      if (!t) continue;
      const a = k - t.a, b = k - t.b, key = `${t.dir}:${a}:${b}`;
      if (seen.has(key)) continue;
      const l: MLine = { id: `e${key}`, a: { i: a, p: t.pa }, b: { i: b, p: t.pb }, dir: t.dir > 0 ? 1 : -1, brk: null };
      l.brk = p.breakRule === 'close' ? firstCloseBreak(bars, l) : firstFullBreak(bars, l);
      seen.set(key, l);
    }
  }
  return [...seen.values()].sort((x, y) => x.a.i - y.a.i || x.b.i - y.b.i);
}

export function engineZones(bars: TBar[], tf: string, market: Market, p: EngineParams = ENGINE_DEFAULTS): MZone[] {
  const S = new Series(zbars(bars), null, tf), nb = bars.length;
  if (S.atr(1) <= 0 || nb < 12) return [];
  const zp = p.zone ?? (market === 'stock' ? RAJA : FX_PARAMS);
  return detect(S, zp).map(z => ({
    id: `e${z.dir}:${z.legBar}`, side: z.dir > 0 ? 'demand' as const : 'supply' as const,
    s: nb - (z.legBar + z.baseN), e: nb - (z.legBar + 1), prox: z.prox, dist: z.dist, end: z.removed ? nb - z.removedBar : null,
  })).sort((x, y) => x.s - y.s);
}

export function engineMarks(bars: TBar[], tf: string, market: Market, p: EngineParams = ENGINE_DEFAULTS): Marks {
  return { v: 1, pivots: enginePivots(bars, tf, p), lines: engineLines(bars, tf, p), zones: engineZones(bars, tf, market, p) };
}
