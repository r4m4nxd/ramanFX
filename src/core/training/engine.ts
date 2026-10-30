// The ENGINE's answer on a marked chart, in the same shape as the owner's marks (types.ts), so score.ts can compare them.
// Runs the bot's pure chart modules unchanged (read-only imports; they are the source of truth):
//   pivots = zvReal.zrPivots (the owner's real pivots: the end of a real correction),
//   lines  = zvReal.zrLines(...).hist: every trend and momentum line the state machine drew on these bars (it reads the
//            bars in order and takes each pivot when it was confirmed, so the history is what the indicator showed at
//            each close); each line's end = the break zvLines itself reports (brokenAt: a candle CLOSING beyond it, or
//            the structure change that ended it) - one source of truth,
//   zones  = zonecore.detect (FX_PARAMS on forex / crypto / CFDs, RAJA on stocks).
// Index conversion: Series shift s (1 = newest closed bar) <-> bar index nb - s.
import { detect, FX_PARAMS, RAJA, Series, type ZBar, type ZParams } from '../../../supabase/functions/telegram-bot/zonecore.ts';
import { ZV } from '../../../supabase/functions/telegram-bot/zvTrend.ts';
import { zrLines, zrPivots, ZR } from '../../../supabase/functions/telegram-bot/zvReal.ts';
import type { Market, Marks, MLine, MPivot, MZone, TBar } from './types';

export interface EngineParams {
  /** zvPivots swing size (ZoneVision InpTLSwing). */
  swing: number;
  /** Fewest bars before the line replay starts (the indicator needs history for its pivots). */
  replayFrom: number;
  /** Zone detection parameters (zonecore); null = by market (FX_PARAMS / RAJA). */
  zone: ZParams | null;
}
export const ENGINE_DEFAULTS: EngineParams = { swing: ZV.swing, replayFrom: 20, zone: null };

const zbars = (bars: TBar[]): ZBar[] => bars.map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c }));

export function enginePivots(bars: TBar[], tf: string, p: EngineParams = ENGINE_DEFAULTS): MPivot[] {
  if (bars.length < 2 * p.swing + 4) return [];
  const S = new Series(zbars(bars), null, tf), nb = bars.length;
  const win = Math.min(ZR.lookback, S.n - 1 - ZR.osw);
  return zrPivots(S, win).map(v => ({ i: nb - v.bar, kind: v.t > 0 ? 'peak' as const : 'valley' as const, p: v.p }));
}

export function engineLines(bars: TBar[], tf: string, p: EngineParams = ENGINE_DEFAULTS): MLine[] {
  if (bars.length < Math.max(p.replayFrom, 2 * ZV.swing + 6)) return [];
  const nb = bars.length, r = zrLines(new Series(zbars(bars), null, tf));
  return r.hist.map(t => ({
    id: `e${t.kind === 'momentum' ? 'm' : ''}${t.dir}:${nb - t.a}:${nb - t.b}`, a: { i: nb - t.a, p: t.pa }, b: { i: nb - t.b, p: t.pb },
    dir: t.dir > 0 ? 1 as const : -1 as const, brk: (t.brokenAt ?? -1) >= 0 ? nb - t.brokenAt! : null, kind: t.kind ?? 'trend',
  })).sort((x, y) => x.a.i - y.a.i || x.b.i - y.b.i);
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
