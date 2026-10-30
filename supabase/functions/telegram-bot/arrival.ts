// ARRIVAL zones (owner-approved Raja / Kevin rules, Oct 2026) for the bot's charts and verdict. Canonical
// implementation: the Python alert side (tools/...) ports it and must give the same results on the shared fixture
// tools/telegram_bot/parity/arrival_fixtures.json (src/core/telegramArrival.test.ts checks this file against it).
//
// Per timeframe, on CLOSED bars (shift convention of zonecore.ts: 0 = phantom bar at the price, 1 = newest closed bar):
//   lines   zvLines (zvTrend.ts): the owner's structure method (the top is not a pivot; the first lower high after it ->
//           the tangent over the later lower highs, clean anchors; kept until a candle CLOSES beyond it); LIVE lines only
//           (the chart's faint "x broken" line is never an arrival line).
//   zones   zonecore.detect(S, p) - every zone, removed ones included (p = RAJA for stocks, FX_PARAMS for FX).
//   ARRIVAL a zone z (dir d: +1 demand, -1 supply) whose leg-out crosses the trend line against it and removes >= 1
//           opposite zone:
//           1. leg-out bars = z.legBar, then the next newer bars (legBar-1, legBar-2: at most 3 bars in all) while each
//              closes in direction d (cdir = d) and is not a basing candle (body < 50% of its range); never shift < 1.
//           2. the line = zvLines on the closed bars OLDER than the leg-out (shifts >= legBar + 1; that series' phantom
//              price = its newest close): its DOWN line for a demand, its UP line for a supply. None = no arrival.
//              Shifts of that series map to the full one by + legBar.
//           3. crossed: the first leg-out bar (oldest first) whose close is beyond the line (demand: C > line; supply:
//              C < line; line value at full shift j = zvAt(line, j - legBar)). None = no arrival.
//           4. removed: the detect() zones of the other side with removed = true and removedBar inside the leg-out
//              bars (legBar >= removedBar >= the newest leg-out bar), in detect order. 0 = no arrival; 2+ = strong.
//   CURRENT the arrival with the smallest legBar (newest) whose zone is not removed; null when none.
// Plan of the current arrival (d = its dir; HTF = the next higher TF's closed bars, LTF = the confirmation TF's):
//   lineNow  the HTF line against d (demand arrival: the HTF DOWN line; supply: the HTF UP line) - zvLines on the HTF
//            closed bars with the live price as phantom - its value now (zvAt(line, 0)); null without that line.
//   ceiling  lineNow when it is beyond price (demand: > price; supply: < price); else null.
//   weak     every not-removed same-TF zone of the other side not wholly on the arrival's side of price (demand arrival:
//            supplies with max(prox, dist) > price; supply arrival: demands with min(prox, dist) < price), departure
//            <= max_zone_age.
//            Drawn dashed: "weak - no limit" (Raja: after a supply arrival there are no limit buys on that TF).
//   realign  the weak zone nearest lineNow (gap 0 when the value is inside the zone; ties: nearer price); null
//            without lineNow.
//   target   realign, else the weak zone nearest price (gap); targetPx = its proximal; null when no weak zone.
//   tp       with a ceiling: demand min(targetPx, ceiling), supply max(targetPx, ceiling) (targetPx null: the ceiling);
//            capped = tp is the ceiling. Without one: the nearest (gap) not-removed HTF zone of the other side wholly
//            beyond price (demand: min(prox, dist) > price; supply: max(prox, dist) < price), departure <= max_zone_age
//            (htfZone; its proximal) when it is further than targetPx (or targetPx is null): tp = that, extended = true;
//            else tp = targetPx.
//   entry    the arrival zone's proximal; stop = the STOP RULE below; rr = (tp - entry) / (entry - stop) (null: no tp
//            or <= 0).
// STOP RULE (owner, Oct 2026; plans, confirmations, alerts, chart SL chip), d = the zone's dir:
//   buffer   max(SL.atrFrac (0.1) x ATR14 of the entry TF at its newest closed bar (Series.atr(1)), the instrument's
//            typical spread in price units (FX: the shard's spread_pips x pip; stocks: SL.stockSpreadBps (5) bps of
//            the price; 0 when unknown)).
//   valley   the low (demand) / high (supply) of the arrival leg's base valley: the extreme wick of the bars from the
//            leg-out candle back through its base and the ZV.swing (2) candles before it (shifts legBar ..
//            legBar + baseN + 2, clipped to the series) = the swing low / high that formed the zone.
//   host     the HIGHER-TF zone of the same side the entry zone sits in: not removed, price ranges overlap; the newest
//            (smallest legBar). Plan: the HTF detect() zones; confirmation: the realignment zone (the LTF zone's
//            higher TF, same side by construction).
//   stop     host: SL.htfBuffers (2) buffers beyond the host's distal (demand: host.dist - 2 x buffer), but never
//            inside the valley stop (demand: min(that, valley - buffer); supply: max) -> basis 'htf'; no host (or
//            the valley stop is further): valley - buffer (supply: + buffer) -> basis 'valley'.
// Confirmation on the LTF (map CONFIRM_TF; only with a realign zone and LTF bars): the LTF arrivals of the other side
//   (after a supply arrival: LTF demand arrivals) whose zone is not removed, overlaps the realign zone's price range
//   and whose leg-out bar time >= the HTF arrival's leg-out bar time (times compared as 'YYYY-MM-DDTHH:MM'); the
//   newest (smallest LTF legBar). Plan: entry its proximal, stop = the STOP RULE on the LTF (host = the realign zone),
//   target = the TF's newest real pivot on the arrival's side (supply arrival: the newest real PEAK's high = the TF's
//   last swing high; demand arrival: the newest real valley's low; null when none), rr on that target. inArea = price
//   inside the realign zone.
// Edge cases (parity): a TF with < 20 closed bars has no reading; detect() runs only when the series (closed bars +
//   phantom) holds > max_base + 4 bars; a leg-out with < 10 older closed bars has no line; HTF readings need >= 10
//   closed HTF bars, LTF ones >= 20. Every sort is stable (ties keep detect order: older departure first).
// Pure (no Deno, no network).
import { detect, Series, type Zone, type ZBar, type ZParams } from './zonecore.ts';
import { zvAt, zvLines, zvPivots, ZV, type ZvLine } from './zvTrend.ts';

/** Confirmation TF per TF (owner: H4 -> 15m, D1 -> 1H, W1 -> H4, MN -> D1, 3M -> W1; H1 -> 15m). */
export const CONFIRM_TF: Record<string, string> = { H1: 'M15', H4: 'M15', D1: 'H1', W1: 'H4', MN: 'D1', '3M': 'W1' };
/** Next higher TF per TF (the ceiling / realignment line). */
export const HIGHER_TF: Record<string, string | null> = { M15: 'H1', H1: 'H4', H4: 'D1', D1: 'W1', W1: 'MN', MN: '3M', '3M': null };

export interface ArrLine { dir: number; a: number; b: number; pa: number; pb: number; ta: string; tb: string }
export interface ArrZone { dir: number; prox: number; dist: number; legBar: number; saBar: number; removed: boolean; removedBar: number; tLeg: string; t0: string; made: string }
export interface Arrival {
  zone: ArrZone; line: ArrLine; legs: number[]; crossBar: number; crossPx: number; removed: ArrZone[]; strong: boolean;
  valley: number;   // the stop rule's valley (demand: low; supply: high) of the zone's base
}
/** The stop rule (header): buffer = max(atrFrac x ATR14 entry TF, spread); host stop = htfBuffers buffers beyond the
 *  same-side HTF zone's distal; stockSpreadBps = a stock's typical spread. */
export const SL = { atrFrac: 0.1, htfBuffers: 2, stockSpreadBps: 5 } as const;
export const stockSpread = (price: number) => (price > 0 ? (price * SL.stockSpreadBps) / 1e4 : 0);
export interface ArrStop { stop: number; buffer: number; atr: number; basis: 'htf' | 'valley'; valley: number; host: ArrZone | null }
export interface ArrPlan {
  dir: number; entry: number; stop: number; buffer: number; atr: number; basis: 'htf' | 'valley'; valley: number; host: ArrZone | null; rr: number | null;
  ceiling: number | null; lineNow: number | null; ceilingLine: ArrLine | null; weak: ArrZone[]; realign: ArrZone | null;
  target: ArrZone | null; targetPx: number | null; htfZone: ArrZone | null; tp: number | null; capped: boolean; extended: boolean;
}
export interface ArrConfirm {
  tf: string; zone: ArrZone; arrival: Arrival; target: number | null; inArea: boolean;
  entry: number; stop: number; buffer: number; atr: number; basis: 'htf' | 'valley'; rr: number | null;
}
export interface ArrivalTf {
  tf: string; htf: string | null; ltf: string | null; arrivals: Arrival[]; current: Arrival | null; plan: ArrPlan | null;
  confirm: ArrConfirm | null; pending: boolean;   // pending = a realign zone waits for an LTF arrival
}

const lo = (z: { prox: number; dist: number }) => Math.min(z.prox, z.dist), hi = (z: { prox: number; dist: number }) => Math.max(z.prox, z.dist);
const gap = (v: number, z: { prox: number; dist: number }) => (v < lo(z) ? lo(z) - v : v > hi(z) ? v - hi(z) : 0);
const t16 = (t: string) => (t.length >= 16 ? t.slice(0, 16) : `${t.slice(0, 10)}T00:00`);

const zOf = (S: Series, z: Zone, off = 0): ArrZone => ({
  dir: z.dir, prox: z.prox, dist: z.dist, legBar: z.legBar + off, saBar: z.saBar + off, removed: z.removed, removedBar: z.removed ? z.removedBar + off : -1,
  tLeg: S.T[z.legBar], t0: z.baseStart, made: z.made,
});
/** The stop rule (header) for a zone of dir d: S = the entry TF's series, valley = its Arrival.valley. */
export function stopOf(S: Series, d: number, valley: number, host: ArrZone | null, spread: number): ArrStop {
  const atr = S.atr(1), buffer = Math.max(SL.atrFrac * atr, spread > 0 ? spread : 0);
  const vs = valley - d * buffer;
  if (host) {
    const hs = host.dist - d * SL.htfBuffers * buffer;
    if (d > 0 ? hs <= vs : hs >= vs) return { stop: hs, buffer, atr, basis: 'htf', valley, host };
  }
  return { stop: vs, buffer, atr, basis: 'valley', valley, host };
}
export const rrOf = (entry: number, stop: number, target: number | null): number | null => {
  if (target == null || entry === stop) return null;
  const r = (target - entry) / (entry - stop);
  return r > 0 ? r : null;
};
const lineOf = (S: Series, t: ZvLine, off: number): ArrLine => ({ dir: t.dir, a: t.a + off, b: t.b + off, pa: t.pa, pb: t.pb, ta: S.T[t.a], tb: S.T[t.b] });

/** Every arrival zone of one TF (closed bars oldest first), newest first. */
export function arrivals(bars: ZBar[], tf: string, p: ZParams): { S: Series; zones: Zone[]; arrivals: Arrival[] } {
  const S = new Series(bars, bars.length ? bars[bars.length - 1].c : 0, tf);
  const zones = S.n > p.max_base + 4 ? detect(S, p) : [];
  const out: Arrival[] = [];
  const n = bars.length;
  for (const z of zones) {
    const L = z.legBar, d = z.dir;
    const legs = [L];
    for (let j = L - 1; j >= 1 && legs.length < 3 && S.cdir(j) === d && !S.basing(j); j--) legs.push(j);
    const older = bars.slice(0, n - L);   // shifts >= L + 1
    if (older.length < 2 * ZV.swing + 6) continue;
    const T = new Series(older, older[older.length - 1].c, tf);
    const r = zvLines(T), t = d > 0 ? r.dn : r.up;
    if (!t) continue;
    const cross = legs.find(j => (d > 0 ? S.C[j] > zvAt(t, j - L) : S.C[j] < zvAt(t, j - L)));
    if (cross == null) continue;
    const newest = legs[legs.length - 1];
    const rem = zones.filter(y => y.dir === -d && y.removed && y.removedBar <= L && y.removedBar >= newest);
    if (!rem.length) continue;
    let valley = d > 0 ? Infinity : -Infinity;
    for (let j = L, j1 = Math.min(L + z.baseN + ZV.swing, S.n - 1); j <= j1; j++) valley = d > 0 ? Math.min(valley, S.L[j]) : Math.max(valley, S.H[j]);
    out.push({ zone: zOf(S, z), line: lineOf(T, t, L), legs, crossBar: cross, crossPx: zvAt(t, cross - L), removed: rem.map(y => zOf(S, y)), strong: rem.length >= 2, valley });
  }
  out.sort((a, b) => a.zone.legBar - b.zone.legBar);
  return { S, zones, arrivals: out };
}

/** The arrival reading of one TF: its arrivals, the current one and its plan, the LTF confirmation. bars / htfBars /
 *  ltfBars = CLOSED bars oldest first; price = the live price; spread = the instrument's typical spread (price units;
 *  the stop rule's buffer floor). */
export function arrivalTf(bars: ZBar[], tf: string, price: number, p: ZParams, htfBars?: ZBar[] | null, ltfBars?: ZBar[] | null,
  htf: string | null = HIGHER_TF[tf] ?? null, ltf: string | null = CONFIRM_TF[tf] ?? null, spread = 0): ArrivalTf {
  const res: ArrivalTf = { tf, htf, ltf, arrivals: [], current: null, plan: null, confirm: null, pending: false };
  if (bars.length < 20) return res;
  const A = arrivals(bars, tf, p);
  res.arrivals = A.arrivals;
  const cur = res.current = A.arrivals.find(a => !a.zone.removed) ?? null;
  if (!cur) return res;
  const d = cur.zone.dir;
  // the HTF line against the arrival, now
  let ceiling: number | null = null, lineNow: number | null = null, ceilingLine: ArrLine | null = null, H: Series | null = null, hz: Zone[] = [];
  if (htf && htfBars && htfBars.length >= 10) {
    H = new Series(htfBars, price, htf);
    const t = d > 0 ? zvLines(H).dn : zvLines(H).up;
    if (t) { lineNow = zvAt(t, 0); ceilingLine = lineOf(H, t, 0); if (d > 0 ? lineNow > price : lineNow < price) ceiling = lineNow; }
    hz = H.n > p.max_base + 4 ? detect(H, p) : [];
  }
  const beyond = (z: { prox: number; dist: number }) => (d > 0 ? lo(z) > price : hi(z) < price);
  const weakZ = A.zones.filter(z => z.dir === -d && !z.removed && z.legBar <= p.max_zone_age && (d > 0 ? hi(z) > price : lo(z) < price));
  const weak = weakZ.map(z => zOf(A.S, z));
  let realign: ArrZone | null = null;
  if (lineNow != null && weak.length) { const v = lineNow; realign = weak.slice().sort((a, b) => gap(v, a) - gap(v, b) || gap(price, a) - gap(price, b))[0]; }
  const target = realign ?? (weak.length ? weak.slice().sort((a, b) => gap(price, a) - gap(price, b))[0] : null);
  const targetPx = target ? target.prox : null;
  let tp: number | null = targetPx, capped = false, extended = false, htfZone: ArrZone | null = null;
  if (ceiling != null) {
    tp = targetPx == null ? ceiling : d > 0 ? Math.min(targetPx, ceiling) : Math.max(targetPx, ceiling);
    capped = tp === ceiling;
  } else if (H) {
    const cand = hz.filter(z => z.dir === -d && !z.removed && z.legBar <= p.max_zone_age && beyond(z)).sort((a, b) => gap(price, a) - gap(price, b))[0];
    if (cand) {
      htfZone = zOf(H, cand);
      if (targetPx == null || (d > 0 ? cand.prox > targetPx : cand.prox < targetPx)) { tp = cand.prox; extended = true; }
    }
  }
  const hostZ = hz.filter(z => z.dir === d && !z.removed && lo(z) <= hi(cur.zone) && hi(z) >= lo(cur.zone)).sort((a, b) => a.legBar - b.legBar)[0];
  const st = stopOf(A.S, d, cur.valley, hostZ && H ? zOf(H, hostZ) : null, spread);
  res.plan = { dir: d, entry: cur.zone.prox, stop: st.stop, buffer: st.buffer, atr: st.atr, basis: st.basis, valley: st.valley, host: st.host,
    rr: rrOf(cur.zone.prox, st.stop, tp), ceiling, lineNow, ceilingLine, weak, realign, target, targetPx, htfZone, tp, capped, extended };
  // LTF confirmation inside the realignment area
  if (realign && ltf) {
    res.pending = true;
    if (ltfBars && ltfBars.length >= 20) {
      const LA = arrivals(ltfBars, ltf, p);
      const t0 = t16(cur.zone.tLeg);
      const c = LA.arrivals.find(a => a.zone.dir === -d && !a.zone.removed && lo(a.zone) <= hi(realign!) && hi(a.zone) >= lo(realign!) && t16(a.zone.tLeg) >= t0);
      if (c) {
        const piv = zvPivots(A.S, Math.min(ZV.lookback, A.S.n - 1 - ZV.swing)).filter(q => q.t === (d < 0 ? 1 : -1));
        const pv = piv.length ? piv[piv.length - 1].p : null;
        const cs = stopOf(LA.S, -d, c.valley, realign, spread);
        res.confirm = { tf: ltf, zone: c.zone, arrival: c, target: pv, inArea: gap(price, realign) === 0,
          entry: c.zone.prox, stop: cs.stop, buffer: cs.buffer, atr: cs.atr, basis: cs.basis, rr: rrOf(c.zone.prox, cs.stop, pv) };
        res.pending = false;
      }
    }
  }
  return res;
}
