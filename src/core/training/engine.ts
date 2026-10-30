// The ENGINE's answer on a marked chart, in the same shape as the owner's marks (types.ts), so score.ts can compare them.
// Runs the ZoneVision 2.16 structure model unchanged (supabase/functions/telegram-bot/zvModel.ts = docs/training/SPEC.md,
// the one model MT5 draws):
//   pivots = zmPivots: the confirmed real pivots (the pending last extreme is not a pivot yet),
//   lines  = every trend / momentum line the model drew on these bars (zmTf().lines: it reads the bars in order and takes
//            each pivot when it was confirmed), each ending at its first close beyond (brokenAt),
//   zones  = the model's zones that have a reason (owner 2026-10-30: break / direction / removal), detection = zonecore
//            (FX_PARAMS on forex / crypto / CFDs; stocks keep RAJA detect without reasons).
// Index conversion: Series shift s (1 = newest closed bar) <-> bar index nb - s.
import { detect, FX_PARAMS, RAJA, Series, type ZBar, type ZParams } from '../../../supabase/functions/telegram-bot/zonecore.ts';
import { ZV } from '../../../supabase/functions/telegram-bot/zvTrend.ts';
import { zmTf } from '../../../supabase/functions/telegram-bot/zvModel.ts';
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
  const nb = bars.length, t = zmTf(zbars(bars), tf);
  return t.pivots.filter(v => v.conf >= 0).map(v => ({ i: nb - v.bar, kind: v.t > 0 ? 'peak' as const : 'valley' as const, p: v.p }));
}

export function engineLines(bars: TBar[], tf: string, p: EngineParams = ENGINE_DEFAULTS): MLine[] {
  if (bars.length < Math.max(p.replayFrom, 2 * ZV.swing + 6)) return [];
  const nb = bars.length, t = zmTf(zbars(bars), tf);
  return t.lines.map(l => ({
    id: `e${l.kind === 'momentum' ? 'm' : ''}${l.dir}:${nb - l.a}:${nb - l.b}`, a: { i: nb - l.a, p: l.pa }, b: { i: nb - l.b, p: l.pb },
    dir: l.dir > 0 ? 1 as const : -1 as const, brk: l.brokenAt >= 0 ? nb - l.brokenAt : null, kind: l.kind === 'momentum' ? 'momentum' as const : 'trend' as const,
  })).sort((x, y) => x.a.i - y.a.i || x.b.i - y.b.i);
}

export function engineZones(bars: TBar[], tf: string, market: Market, p: EngineParams = ENGINE_DEFAULTS): MZone[] {
  const S = new Series(zbars(bars), null, tf), nb = bars.length;
  if (S.atr(1) <= 0 || nb < 12) return [];
  if (market !== 'stock' && !p.zone) {
    return zmTf(zbars(bars), tf).zones.filter(z => z.reasons.length > 0 && !z.range).map(z => ({
      id: `e${z.dir}:${z.legBar}`, side: z.dir > 0 ? 'demand' as const : 'supply' as const,
      s: nb - z.base1, e: nb - z.base0, prox: z.prox, dist: z.dist, end: z.removed ? nb - z.removedBar : null,
    })).sort((x, y) => x.s - y.s);
  }
  const zp = p.zone ?? (market === 'stock' ? RAJA : FX_PARAMS);
  return detect(S, zp).map(z => ({
    id: `e${z.dir}:${z.legBar}`, side: z.dir > 0 ? 'demand' as const : 'supply' as const,
    s: nb - (z.legBar + z.baseN), e: nb - (z.legBar + 1), prox: z.prox, dist: z.dist, end: z.removed ? nb - z.removedBar : null,
  })).sort((x, y) => x.s - y.s);
}

export function engineMarks(bars: TBar[], tf: string, market: Market, p: EngineParams = ENGINE_DEFAULTS): Marks {
  return { v: 1, pivots: enginePivots(bars, tf, p), lines: engineLines(bars, tf, p), zones: engineZones(bars, tf, market, p) };
}
