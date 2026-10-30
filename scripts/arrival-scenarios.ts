// Hand-built arrival scenarios (one per approved rule). Shared by scripts/make-arrival-fixtures.ts (writes
// tools/telegram_bot/parity/arrival_fixtures.json) and src/core/telegramArrival.test.ts.
import { Tape } from './arrival-dsl.ts';
import type { ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';

export interface Scenario {
  about: string; market: 'fx' | 'stock'; tf: string; price: number; bars: ZBar[];
  htfTf?: string | null; htf?: ZBar[] | null; ltfTf?: string | null; ltf?: ZBar[] | null;
}

/** A downtrend: an RBD supply at the top (base at 132), real peaks P1 128 / P2 122 (an RBD supply base at P2), DBD
 *  supplies on the way down (`supplies` of them, not removed until the leg), a demand base at ~96, then the leg up
 *  `legTo` (one candle per close; crosses the down line when high enough), then `after`. */
function downThenLeg(supplies: number, legTo: number[], after: (t: Tape) => void = t => t.move(4, t.close + 2), t0 = '2025-01-01', stepMin = 1440): Tape {
  const t = new Tape(125, t0, stepMin);
  t.move(7, 132).base(2, 1.2).leg(128).move(7, 120).move(8, 128).move(10, 112).move(6, 122).base(2, 1.2).leg(118).move(3, 113);
  if (supplies >= 2) t.base(2, 1.2).leg(108).move(2, 106); else t.move(3, 106);
  t.base(2, 1.2).leg(101).move(2, 99).move(3, 96.5).base(3, 1.2);
  for (const p of legTo) t.leg(p);
  after(t);
  return t;
}
/** Bars mirrored around 100 (a downtrend becomes an uptrend: demand <-> supply). */
const mirror = (bs: ZBar[]): ZBar[] => bs.map(b => ({ d: b.d, o: 200 - b.o, h: 200 - b.l, l: 200 - b.h, c: 200 - b.c }));
/** Bars mapped by v -> a + k (v - 96) (zones and lines are scale-invariant: ATR-relative tests) with new times. */
const affine = (bs: ZBar[], a: number, k: number): ZBar[] => bs.map(b => ({ d: b.d, o: a + k * (b.o - 96), h: a + k * (b.h - 96), l: a + k * (b.l - 96), c: a + k * (b.c - 96) }))
  .map(b => ({ d: b.d, o: +b.o.toFixed(6), h: +b.h.toFixed(6), l: +b.l.toFixed(6), c: +b.c.toFixed(6) }));

/** Weekly HTF bars with a down line through two real peaks (145 at bar 10, 131 at bar 30: -0.7 per bar), ending at `px`. */
function htfDown(px: number, n = 10): ZBar[] {
  const t = new Tape(130, '2023-11-01', 7 * 1440);
  t.move(5, 120).move(5, 145).move(10, 118).move(10, 131).move(6, 108).move(n, px);
  return t.bars;
}
const last = (bs: ZBar[]) => bs[bs.length - 1].c;

const dem2 = downThenLeg(2, [103, 109.5, 116], t => t.base(2, 1.2).leg(112).move(2, 113));
const dem1 = downThenLeg(1, [103, 109.5, 116], t => t.base(2, 1.2).leg(112).move(2, 113));
const noCross = downThenLeg(2, [100.5, 102.5]);
// supply arrival = the mirror of dem2 (price 87): demands weak at 78 (the P2 base), 68 (the top base) and 84 (after)
const sup = mirror(dem2.bars);
// confirmation: the supply-arrival D1, then price falls into the realignment demand; the H1 shows a demand arrival there
const supC = (() => { const t = downThenLeg(2, [103, 109.5, 116], t => t.move(4, 122.3)); return mirror(t.bars); })();
const supCdays = supC.length;
const ltfStart = new Date(Date.parse('2025-01-01T00:00:00Z') + (supCdays - 5) * 86400000).toISOString().slice(0, 16);
const ltf = affine(mirror(mirror(downThenLeg(2, [103, 109.5, 116], () => {}, ltfStart, 60).bars)), 77.6, 0.08);

export const SCEN: Record<string, Scenario> = {
  reanchor: {
    about: 'wick re-anchoring: a candle between the two real peaks pokes above the line - it becomes the older anchor',
    market: 'fx', tf: 'D1', price: 113,
    bars: (() => { const t = new Tape(125, '2025-01-01'); t.move(8, 120).move(8, 132).move(10, 110).move(5, 120).wick(119, 130.5, 118.5).move(3, 116).move(6, 122).move(8, 112).move(3, 113); return t.bars; })(),
  },
  dem2: { about: 'demand arrival: the leg-out crosses the D1 down line and removes 2 supplies (strong); no HTF', market: 'fx', tf: 'D1', price: last(dem2.bars), bars: dem2.bars },
  dem1: { about: 'demand arrival removing 1 supply', market: 'fx', tf: 'D1', price: last(dem1.bars), bars: dem1.bars },
  nocross: { about: 'no arrival: the leg-out removes supplies but never closes above the down line', market: 'fx', tf: 'D1', price: last(noCross.bars), bars: noCross.bars },
  ceiling: { about: 'demand arrival with the W1 down line still intact above: TP capped below the W1 line', market: 'fx', tf: 'D1', price: last(dem2.bars), bars: dem2.bars, htfTf: 'W1', htf: htfDown(last(dem2.bars)) },
  extend: { about: 'demand arrival with the W1 down line crossed: TP extends to the W1 supply', market: 'fx', tf: 'D1', price: last(dem2.bars), bars: dem2.bars, htfTf: 'W1', htf: (() => { const t = new Tape(150, '2023-09-01', 7 * 1440); t.move(8, 140).move(5, 135).base(2, 2).leg(126).move(6, 112).move(8, last(dem2.bars)); return t.bars; })() },
  supply: { about: 'supply arrival at the top of an uptrend: same-TF demands weak, realignment = the demand nearest the W1 up line', market: 'fx', tf: 'D1', price: last(sup), bars: sup, htfTf: 'W1', htf: mirror(htfDown(200 - last(sup))) },
  confirm: { about: 'supply arrival, price inside the realignment demand, a 1H demand arrival there = the confirmed buy', market: 'fx', tf: 'D1', price: last(ltf), bars: supC, htfTf: 'W1', htf: mirror(htfDown(200 - last(supC), 11)), ltfTf: 'H1', ltf },
  pending: { about: 'supply arrival, price inside the realignment demand, no 1H arrival yet = pending', market: 'fx', tf: 'D1', price: last(supC), bars: supC, htfTf: 'W1', htf: mirror(htfDown(200 - last(supC), 11)), ltfTf: 'H1', ltf: ltf.slice(0, -8) },
};
