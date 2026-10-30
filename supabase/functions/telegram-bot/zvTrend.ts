// Trendlines for the bot's chart images: the owner's STRUCTURE METHOD (owner-approved Oct 2026, from his XAUUSD D1 / W1
// drawings), ported 1:1 to tools/stock_scanner/zvtrend.py, public/tools/RFX_ZoneCore.mqh (the arrival engine zvLines +
// ZoneVision TwoPivotLines), RamanFX_ZoneVision.mq4 and the Pine scripts. NOT the scanners' rule: tools/stock_scanner/
// zones.py trendlines() (trendcore.ts, the Raja signals) keeps its own construction; only the chart and arrivals use these.
//
// Owner: "We draw from real valleys and real peaks. Real valleys are pivot points after which price made a new high;
// real peaks are pivot points after which price made a new lower low, on that timeframe."
//   1. Swing low (FrLow, ZV.swing = 2): a low <= the 2 older lows and < the 2 newer lows (swing high mirrored), within the
//      newest min(ZV.lookback = 200, closed bars - ZV.swing) bars, wicks. A swing high is a REAL PEAK when, before any
//      later high goes above it, a later low goes below the most recent swing low before it (valleys mirrored).
//   2. Down line (up mirrored), a state machine in bar order (zvLines): the TOP (highest high wick) is never a pivot;
//      pivot 1 = the first lower real peak after it; pivot 2 = the tangent from pivot 1 over the lower highs since it
//      (clean anchors: FitAnchor, ZV.fitTol; not too flat: ZV.minSlope / ZV.minRise).
//   3. The line is KEPT (later peaks are touches) until a candle CLOSES beyond it: broken (dnX, drawn faint up to that
//      candle); the next lower high re-anchors from the same pivot 1; a peak at / above pivot 1 ends the structure.
//   4. Momentum line (zvMomentum) only for a direction without a live line. Arrivals read the live lines only.
// The tunable parameters are in ZV (one place; the owner trains them later).
// Index convention as zonecore.ts Series: shift 0 = the phantom forming bar, 1 = the newest closed bar, larger = older
// (MQL index semantics). Pure.
import { Series, type ZBar } from './zonecore.ts';

// The trend-line rule's tunable parameters, in ONE place (the owner trains them later; keep the ports in step:
// zvtrend.py ZV, RFX_ZoneCore.mqh RX_* / ZoneVision Inp*, the Pine RX_* constants). swing / lookback / tlHistory =
// InpTLSwing, InpLookback, InpTLHistory (RamanFX_ZoneVision.mq5); fitTol = how far (x ATR(1)) a candle may poke
// through a line before the anchor moves (clean anchors); minSlope = the least |slope| per bar and minRise = the least
// rise / fall between the anchors (x ATR at the newer pivot), else too flat.
export const ZV = { swing: 2, lookback: 200, tlHistory: 3, fitTol: 0.05, minSlope: 0.015, minRise: 1.0 } as const;

export interface ZvPivot { bar: number; p: number; t: number; conf?: number }   // t: -1 real valley, +1 real peak; bar = shift; conf = shift it became known
export interface ZvLine {
  dir: number;                 // +1 up line (under two valleys), -1 down line (over two peaks)
  a: number; b: number;        // shifts of the older / newer pivot
  pa: number; pb: number;      // the pivots' low (up) / high (down)
  cuts: number;                // candles between the anchors cut by more than 0.05 ATR
  brokenAt?: number;           // shift of the first full closed candle beyond the line (-1 / absent = live)
}
export interface ZvResult {
  pivots: ZvPivot[]; up: ZvLine | null; dn: ZvLine | null; why: { up: string; dn: string };
  upX: ZvLine | null; dnX: ZvLine | null;   // the most recent line a candle CLOSED beyond (brokenAt; drawn faint up to there)
  mom: ZvLine | null;          // at most one momentum line (zvMomentum), only for a direction without a trend line
}

export const zvSlope = (t: ZvLine) => (t.pb - t.pa) / Math.max(1, t.a - t.b);
/** Line price at shift j (fractional allowed). */
export const zvAt = (t: ZvLine, j: number) => t.pb + zvSlope(t) * (t.b - j);

/** ATR(tf, shift) as ZoneVision reads it: MT5 iATR(14) (Series.atr) on real TFs, Wilder ATR(14) on the virtual 3M/6M/12M. */
export function zvAtr(S: Series): (i: number) => number {
  if (!['3M', '6M', '12M'].includes(S.tf)) return i => S.atr(i);
  const n = S.n, a = new Array<number>(n).fill(0);
  let sum = 0, cnt = 0;
  for (let i = n - 1; i >= 0; i--) {       // oldest first
    let tr = S.H[i] - S.L[i];
    if (i < n - 1) tr = Math.max(tr, Math.abs(S.H[i] - S.C[i + 1]), Math.abs(S.L[i] - S.C[i + 1]));
    cnt++;
    if (cnt < 14) { sum += tr; continue; }
    if (cnt === 14) { sum += tr; a[i] = sum / 14; continue; }
    a[i] = (a[i + 1] * 13 + tr) / 14;
  }
  return i => (i >= 0 && i < n ? a[i] : 0);
}

/** MQL ZigZag(bars): real valleys / peaks, oldest first. A swing high (2-bar fractal) is a REAL PEAK when, before any
 *  later high goes above it, a later low goes below the most recent swing low before it (a new lower low); valleys
 *  mirrored. conf = the shift at which it became known: the bar that made the lower low (higher high), never before the
 *  fractal's own InpTLSwing newer bars closed. */
export function zvPivots(S: Series, bars: number, sw: number = ZV.swing): ZvPivot[] {
  const Lo = S.L, Hi = S.H, out: ZvPivot[] = [];
  const frLow = (i: number) => { for (let k = 1; k <= sw; k++) if (i - k < 1 || Lo[i] > Lo[i + k] || Lo[i] >= Lo[i - k]) return false; return true; };
  const frHigh = (i: number) => { for (let k = 1; k <= sw; k++) if (i - k < 1 || Hi[i] < Hi[i + k] || Hi[i] <= Hi[i - k]) return false; return true; };
  let fH = -1, fL = -1;
  for (let i = bars; i > sw; i--) {
    const lo = frLow(i), hi = frHigh(i);
    if (lo && fH > 0) for (let j = i - 1; j >= 1; j--) { if (Lo[j] < Lo[i]) break; if (Hi[j] > Hi[fH]) { out.push({ bar: i, p: Lo[i], t: -1, conf: Math.min(j, i - sw) }); break; } }
    if (hi && fL > 0) for (let j = i - 1; j >= 1; j--) { if (Hi[j] > Hi[i]) break; if (Lo[j] < Lo[fL]) { out.push({ bar: i, p: Hi[i], t: 1, conf: Math.min(j, i - sw) }); break; } }
    if (lo) fL = i;
    if (hi) fH = i;
  }
  return out;
}

/** MQL FitAnchor(A, b2, p2, d): from the older anchor A, while a candle strictly between the anchors pokes through the
 *  line (A's wick -> (b2, p2)) by more than 0.05 x ATR(1), the candle poking furthest (the oldest on a tie) becomes the
 *  new older anchor; at most 50 rounds. Returns the older anchor's shift. */
export function zvFitAnchor(S: Series, A: number, b2: number, p2: number, d: number): number {
  const tol = ZV.fitTol * zvAtr(S)(1);
  let a = A;
  for (let it = 0; it < 50; it++) {
    const sl = (p2 - (d > 0 ? S.L[a] : S.H[a])) / (a - b2);
    let worst = -1, ex = tol;
    for (let j = a - 1; j > b2; j--) { const lv = p2 + sl * (b2 - j), e = d > 0 ? lv - S.L[j] : S.H[j] - lv; if (e > ex) { ex = e; worst = j; } }
    if (worst < 0) return a;
    a = worst;
  }
  return a;
}

/** A line from the real pivot `o` (older) to `n` (newer): FitAnchor re-anchored (clean anchors: no candle between them
 *  cut by more than 0.05 ATR); null when in the wrong order or too flat (< 0.015 ATR per bar, or less than ZV.minRise
 *  ATR between the anchors; ATR(14) at the newer pivot). */
export function zvPair(S: Series, o: ZvPivot, n: ZvPivot, d: number, atr: (i: number) => number = zvAtr(S)): ZvLine | null {
  if (d > 0 ? !(n.p > o.p) : !(n.p < o.p)) return null;
  const a = zvFitAnchor(S, o.bar, n.bar, n.p, d);
  const t: ZvLine = { dir: d, a, b: n.bar, pa: d > 0 ? S.L[a] : S.H[a], pb: n.p, cuts: 0, brokenAt: -1 };
  if (d > 0 ? !(t.pb > t.pa) : !(t.pb < t.pa)) return null;
  const ab = Math.max(atr(t.b), 1e-12);
  if (Math.abs(zvSlope(t)) < ZV.minSlope * ab || Math.abs(t.pb - t.pa) < ZV.minRise * ab) return null;
  return t;
}

/**
 * The owner's lines of one timeframe (closed bars + the phantom in S): a chronological state machine over the real
 * pivots (bar order; only pivots this series' own bars confirmed). Down line (up mirrored):
 *   - the TOP (the highest high wick of the structure, any candle; a higher one is a new top) is never a pivot;
 *   - pivot 1 = the first real peak after the top that is lower (one at / above it but under the top replaces it, one
 *     above the top is the new top: either is a structure change that ends the down line);
 *   - pivot 2 = when a lower high is confirmed: the TANGENT from pivot 1 over the lower highs since it (the line passes
 *     above every one of them, touching the anchor) -> zvPair (clean anchors via FitAnchor, not too flat);
 *   - the line is KEPT (later peaks are touches, never a redraw) until a candle CLOSES beyond it: then it is broken
 *     (brokenAt; drawn faint, stopped there) while the structure stays bearish: the next lower high re-anchors the line
 *     from the SAME pivot 1 (Kevin's re-anchored line).
 * up / dn = the live lines, upX / dnX = the most recent broken one. Arrivals read the live lines only.
 */
export function zvLines(S: Series): ZvResult {
  const res: ZvResult = { pivots: [], up: null, dn: null, upX: null, dnX: null, why: { up: 'too few bars', dn: 'too few bars' }, mom: null };
  // MQL: bars = MathMin(InpLookback, SBars - 20). MT5 always holds far more than 220 bars, so there the 20-bar margin
  // never binds; the bot's charts often have 60-120 bars (published shards), so the window here only keeps the swing
  // test's InpTLSwing older bars inside the series (shift 0 = the phantom forming bar).
  const bars = Math.min(ZV.lookback, S.n - 1 - ZV.swing);
  if (bars <= ZV.swing + 2) return res;
  const atr = zvAtr(S), C = S.C;
  const piv = res.pivots = zvPivots(S, bars);
  for (const d of [1, -1]) {
    // the structure is read in bar order (a pivot is placed at its own bar); the series holds only pivots its own bars
    // confirmed, so a truncated series (arrival.ts: the bars before a leg-out) never sees a later one
    const ps = piv.filter(p => p.t === (d > 0 ? -1 : 1)).sort((x, y) => y.bar - x.bar);
    const beyond = (t: ZvLine, j: number) => (d > 0 ? C[j] < zvAt(t, j) : C[j] > zvAt(t, j));   // a CLOSE beyond the line
    const above = (x: number, y: number) => (d > 0 ? x < y : x > y);                         // further from the line's side (higher peak / lower valley)
    let ext: ZvPivot = null!, p1: ZvPivot | null = null, live: ZvLine | null = null, brk: ZvLine | null = null, k = 0;
    let seen: ZvPivot[] = [];                                         // the lower highs after pivot 1, oldest first
    let why = `no real ${d > 0 ? 'valleys' : 'peaks'}`;
    const kill = (at: number) => { if (live) { live.brokenAt = at; brk = live; live = null; } };
    for (let j = bars; j >= 1; j--) {
      // a CLOSE beyond the live line breaks it; the structure (top, pivot 1) stays: the next lower high re-anchors from pivot 1
      if (live && j < live.b && beyond(live, j)) { kill(j); why = `broken at shift ${j}`; }
      // the TOP = the highest high (wick) of the structure, any candle: a new one ends the down structure
      const xj = d > 0 ? S.L[j] : S.H[j];
      if (!ext || above(xj, ext.p)) { kill(j); ext = { bar: j, p: xj, t: d > 0 ? -1 : 1 }; p1 = null; seen = []; why = `no ${d > 0 ? 'higher low' : 'lower high'} after the ${d > 0 ? 'bottom' : 'top'}`; }
      for (; k < ps.length && ps[k].bar >= j; k++) {
        const p = ps[k];
        if (!above(ext.p, p.p)) continue;                            // at the top's level (the top itself): never a pivot of the line
        if (!p1 || !above(p1.p, p.p)) { kill(p.bar); p1 = p; seen = []; why = `one ${d > 0 ? 'higher low' : 'lower high'} so far`; continue; }   // at / beyond pivot 1: structure change, the line dies
        seen.push(p);
        if (live) continue;                                          // the line is kept: later pivots are touches
        // pivot 2 = the tangent from pivot 1 over the lower highs since it (the line stays above every one of them)
        // (when FitAnchor makes that line too flat, the next one down the tangent order)
        const sl = (x: ZvPivot) => (x.p - p1!.p) / (p1!.bar - x.bar);
        let t: ZvLine | null = null;
        for (const q of [...seen].sort((x, y) => (d > 0 ? sl(x) - sl(y) : sl(y) - sl(x)) || x.bar - y.bar)) if ((t = zvPair(S, p1, q, d, atr))) break;
        if (!t) { why = 'too flat'; continue; }
        let bj = -1;
        for (let x = t.b - 1; x >= j; x--) if (beyond(t, x)) { bj = x; break; }
        if (bj >= 0) { t.brokenAt = bj; brk = t; why = `broken at shift ${bj}`; continue; }
        live = t; why = 'ok';
      }
    }
    if (d > 0) { res.up = live; res.upX = brk; res.why.up = why; } else { res.dn = live; res.dnX = brk; res.why.dn = why; }
  }
  const cands = ([1, -1] as const).filter(d => !(d > 0 ? res.up : res.dn)).map(d => zvMomentum(S, piv, bars, d)).filter((m): m is ZvLine & { e: number } => !!m);
  cands.sort((x, y) => x.e - y.e);                    // the leg whose extreme is the newest
  if (cands.length) { const { e: _e, ...m } = cands[0]; res.mom = m; }
  return res;
}

/**
 * Kevin's MOMENTUM line (lesson 5 "Trend vs Momentum", lesson 14 fig. 3, lesson 19 [00:42-01:06]): a steep, near-
 * straight one-way leg with only tiny pullbacks and no real peak / valley; he draws it in RED from the leg's top through
 * the pullback highs, and its break is often a false breakout that does not end the trend - the BLACK trend line (real
 * pivots, zvLines) is the one he uses. RFX_ZoneCore: "Momentum = no valid trendline on the newest structure". Drawn
 * only for a direction with no trend line, never gold, never read as a trend line.
 * The current leg (down; up mirrored): its end E = the lowest low of the newest 5 closed bars; its start A = the highest
 * high after the last bar that went lower than E - or, when a real peak came after that top, the highest high from the
 * most recent real peak on (a leg holds no real peak after its start). Line = from A's high, the tangent over every
 * later high from A - 3 on (the steepest line none of them rises above; the 2 bars right after A, part of the same top,
 * may pierce it by <= 0.25 ATR; one that pierces more becomes the start, as ZoneVision's FitAnchor). Needs A - E >= 3
 * bars, >= 0.015 ATR per bar and >= 1.5 ATR of fall / rise from A to the newest closed bar. null = none. e = E.
 */
export function zvMomentum(S: Series, piv: ZvPivot[], bars: number, d: number): (ZvLine & { e: number }) | null {
  const P = (j: number) => (d > 0 ? S.L[j] : S.H[j]);          // the line's side: lows for an up line
  const Q = (j: number) => (d > 0 ? S.H[j] : S.L[j]);          // the leg's end side: highs for an up leg
  const more = (x: number, y: number) => (d > 0 ? x > y : x < y);   // further in the leg's direction
  const lim = Math.min(bars, S.n - 1);
  if (lim < 8) return null;
  let E = 1;
  for (let j = 2; j <= Math.min(5, lim); j++) if (more(Q(j), Q(E))) E = j;
  let k = E + 1;
  while (k <= lim && !more(Q(k), Q(E))) k++;                   // the last bar beyond E (or the window's end)
  const lastPiv = [...piv].reverse().find(p => p.t === (d > 0 ? -1 : 1));
  const from = lastPiv && lastPiv.bar < k && lastPiv.bar > E ? lastPiv.bar : k - 1;
  let A = -1;
  for (let j = E + 1; j <= from; j++) if (A < 0 || more(P(A), P(j))) A = j;   // the start: lowest low (up) / highest high (down)
  if (A < 0 || A - E < 3) return null;
  const atr = zvAtr(S), tol = 0.25 * atr(1);
  let b = -1, sl = 0;
  for (let it = 0; it < 10 && A - E >= 3; it++) {
    b = -1;
    for (let j = A - 3; j >= 1; j--) {
      const s = (P(j) - P(A)) / (A - j);
      if (b < 0 || (d > 0 ? s < sl : s > sl)) { b = j; sl = s; }
    }
    let worst = -1, ex = tol;                                  // a bar of the same top piercing it: the line starts there (FitAnchor)
    for (let j = A - 1; j > A - 3; j--) { const e = d > 0 ? P(A) + sl * (A - j) - P(j) : P(j) - P(A) - sl * (A - j); if (e > ex) { ex = e; worst = j; } }
    if (worst < 0) break;
    A = worst; b = -1;
  }
  if (b < 0 || A - E < 3 || d * sl <= 0) return null;
  const pb = P(A) + sl * (A - b), ab = Math.max(atr(b), 1e-12);
  if (Math.abs(sl) < 0.015 * ab || Math.abs(sl) * (A - 1) < 1.5 * ab) return null;   // steep: >= 1.5 ATR over the leg
  return { dir: d, a: A, b, pa: P(A), pb, cuts: 0, brokenAt: -1, e: E };
}

/** RjA_LineTouches: separate visits within 0.1 ATR of the line, from the older anchor to the newest closed bar. */
export function zvTouches(S: Series, t: ZvLine): number {
  const tol = 0.1 * zvAtr(S)(1);
  let n = 0, inT = false;
  for (let j = t.a; j >= 1; j--) {
    const lv = zvAt(t, j), touch = t.dir > 0 ? S.L[j] <= lv + tol : S.H[j] >= lv - tol;
    if (touch && !inT) n++;
    inT = touch;
  }
  return n;
}

// ---- chart panels -----------------------------------------------------------------------------------------------------
export interface CBar { t: string; o: number; h: number; l: number; c: number }
/** A line the scanner published for a TF. Accepted for compatibility, no longer drawn (the scanners' rule). */
export interface PubLine { dir: number; p: number; s: number; n: number; t: string; touches?: number; x?: boolean }
/** One timeframe's bars as the chart has them (oldest first); forming = the last bar is still forming. */
export interface TlSeries { tf: string; bars: CBar[]; forming: boolean; pub?: PubLine[] }
/** A trendline to draw: pts = [drawn bar index (bar centres 0 .. n-1, edges -0.5 / n-0.5), price]; always 2 points
 *  (straight in the panel's bar-index space). crossed is always false (broken lines carry `broken`). */
export interface ChartTl {
  tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][];
  anchors: [number, number][];            // the two anchor points [drawn bar index, price]
  kind: 'trend' | 'momentum';             // momentum = Kevin's red line (zvMomentum): own TF only, never a trend line
  broken?: boolean;                       // own TF's newest valid line a full closed candle broke (zvLines upX / dnX):
                                          // faint dots from the older anchor to the candle that closed beyond it
}

const tms = (t: string) => Date.parse(t.length >= 16 ? `${t.slice(0, 16)}:00Z` : `${t.slice(0, 10)}T00:00:00Z`);
const toZ = (b: CBar[]): ZBar[] => b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c }));
const closedOf = (s: TlSeries) => (s.forming ? s.bars.slice(0, -1) : s.bars);
/** zvLines on a TlSeries' closed bars. */
export function seriesLines(s: TlSeries, price: number) {
  const closed = closedOf(s);
  const S = new Series(toZ(closed), price, s.tf);
  const out = { S, r: zvLines(S), nClosed: closed.length };
  return out;
}

/** Two drawn lines that look like one: same direction, x-ranges overlapping by >= 2 bars, and never further apart
 *  than `tol` over the overlap (sampled at every bar and both ends). */
export function sameLine(a: Pick<ChartTl, 'dir' | 'pts'>, b: Pick<ChartTl, 'dir' | 'pts'>, tol: number): boolean {
  if (a.dir !== b.dir || a.pts.length < 2 || b.pts.length < 2) return false;
  const x0 = Math.max(a.pts[0][0], b.pts[0][0]), x1 = Math.min(a.pts[a.pts.length - 1][0], b.pts[b.pts.length - 1][0]);
  if (x1 - x0 < 2) return false;
  const at = (p: [number, number][], x: number) => {
    for (let i = 1; i < p.length; i++) if (x <= p[i][0] || i === p.length - 1) {
      const [xa, ya] = p[i - 1], [xb, yb] = p[i];
      return xb === xa ? yb : ya + (yb - ya) * (x - xa) / (xb - xa);
    }
    return p[p.length - 1][1];
  };
  for (let x = x0; ; x = Math.min(x1, Math.floor(x) + 1)) {
    if (Math.abs(at(a.pts, x) - at(b.pts, x)) > tol) return false;
    if (x >= x1) return true;
  }
}

function rangeOf(bars: CBar[]): [number, number] {
  let lo = Infinity, hi = -Infinity;
  for (const b of bars) { lo = Math.min(lo, b.l); hi = Math.max(hi, b.h); }
  const pad = (hi - lo) * 0.03;
  return [lo - pad, hi + pad];
}
const enters = (pts: [number, number][], lo: number, hi: number) =>
  pts.some(([, p], i) => (p >= lo && p <= hi) || (i > 0 && Math.min(p, pts[i - 1][1]) <= hi && Math.max(p, pts[i - 1][1]) >= lo));

/** A straight segment through (k1, p1), (k2, p2) in bar-index space, from max(k1, -0.5) to the right edge. */
function segment(k1: number, p1: number, k2: number, p2: number, nD: number): [number, number][] {
  if (!(k2 > k1)) return [];
  const sl = (p2 - p1) / (k2 - k1), ks = Math.max(-0.5, k1), ke = nD - 0.5;
  return ks >= ke ? [] : [[ks, p1 + sl * (ks - k1)], [ke, p1 + sl * (ke - k1)]];
}

/**
 * HTF pivot -> this panel's bar index (index into B): ZoneVision ChartBarIn, the panel bar holding the extreme (lowest
 * low for an up line, highest high for a down line) inside the HTF bar [open time, next HTF open). An HTF bar older than
 * the panel's history: extrapolated from the first covered HTF bar at the median panel bars per HTF bar (mid-period).
 * null = not placeable.
 */
export function htfBarIndex(B: CBar[], HB: CBar[], hi: number, d: number): number | null {
  if (hi < 0 || hi >= HB.length || !B.length) return null;
  // each panel bar belongs to the newest HTF bar that opened at / before it
  const cnt: number[] = HB.map(() => 0), first: number[] = HB.map(() => -1), best: number[] = HB.map(() => -1);
  for (let i = 0, k = -1; i < B.length; i++) {
    const t = tms(B[i].t);
    while (k + 1 < HB.length && tms(HB[k + 1].t) <= t) k++;
    if (k < 0) continue;
    cnt[k]++;
    if (first[k] < 0) first[k] = i;
    const q = best[k];
    if (q < 0 || (d > 0 ? B[i].l < B[q].l : B[i].h > B[q].h)) best[k] = i;
  }
  const kf = cnt.findIndex(c => c > 0);
  if (kf < 0) return null;
  const full = cnt.filter((c, k) => c > 0 && k !== kf && k !== HB.length - 1).sort((a, b) => a - b);
  const med = full.length ? full[Math.floor(full.length / 2)] : Math.max(1, ...cnt);
  if (hi > kf || (hi === kf && cnt[kf] >= med)) return best[hi] >= 0 ? best[hi] : null;   // covered: ChartBarIn
  const startKf = first[kf] + cnt[kf] - med;                                               // older than our history
  return startKf - (kf - hi) * med + (med - 1) / 2;
}

/**
 * The trendlines of one chart panel: this TF's up / down line (zvLines) from its older anchor to the right edge, and the
 * next higher TF's up / down line (computed on the HTF bars) placed on this panel's bars (htfBarIndex for each anchor)
 * and drawn straight in this panel's bar-index space - as MT5 draws an OBJ_TREND between two (time, price) points on a
 * chart that skips weekends / sessions. At most one line per TF and direction (`max` caps each group, default 2).
 * Only lines that enter the drawn candles' price range. A higher-TF line on top of this TF's own line (sameLine within
 * 0.5 ATR or 1.5% of the drawn range) is dropped: this chart's line is kept (ZoneVision DedupeTL).
 */
export function panelTrendlines(own: TlSeries, nDrawn: number, price: number, higher: TlSeries | null, max = 2): ChartTl[] {
  const B = own.bars, nD = Math.min(nDrawn, B.length), i0 = B.length - nD;
  if (nD < 2) return [];
  const [lo, hi] = rangeOf(B.slice(i0));
  const mine: ChartTl[] = [];
  const { S, r, nClosed } = seriesLines(own, price);
  const tol = Math.max(0.015 * (hi - lo), 0.5 * zvAtr(S)(1));
  for (const t of [r.dn, r.up]) {
    if (!t) continue;
    const ka = nClosed - t.a - i0, kb = nClosed - t.b - i0;
    const pts = segment(ka, t.pa, kb, t.pb, nD);
    if (pts.length && enters(pts, lo, hi)) mine.push({ tf: own.tf, htf: false, dir: t.dir, touches: zvTouches(S, t), crossed: false, pts, anchors: [[ka, t.pa], [kb, t.pb]], kind: 'trend' });
  }
  const out = mine.slice(0, max);
  for (const t of [r.dnX, r.upX]) {       // broken lines (information: a possible trend change), own TF only
    if (!t || (t.brokenAt ?? -1) < 0) continue;
    const ka = nClosed - t.a - i0, kb = nClosed - t.b - i0, ke = Math.min(nD - 0.5, nClosed - t.brokenAt! - i0 + 0.5);   // stops at the candle that closed beyond it
    if (!(kb > ka) || ke <= Math.max(-0.5, ka)) continue;
    const sl = (t.pb - t.pa) / (kb - ka), ks = Math.max(-0.5, ka);
    const pts: [number, number][] = [[ks, t.pa + sl * (ks - ka)], [ke, t.pa + sl * (ke - ka)]];
    if (enters(pts, lo, hi)) out.push({ tf: own.tf, htf: false, dir: t.dir, touches: zvTouches(S, t), crossed: false, pts, anchors: [[ka, t.pa], [kb, t.pb]], kind: 'trend', broken: true });
  }
  if (r.mom) {
    const t = r.mom, ka = nClosed - t.a - i0, kb = nClosed - t.b - i0, pts = segment(ka, t.pa, kb, t.pb, nD);
    if (pts.length && enters(pts, lo, hi)) out.push({ tf: own.tf, htf: false, dir: t.dir, touches: zvTouches(S, t), crossed: false, pts, anchors: [[ka, t.pa], [kb, t.pb]], kind: 'momentum' });
  }
  if (higher && higher.bars.length >= 2) {
    const h = seriesLines(higher, price), HB = higher.bars, got: ChartTl[] = [];
    for (const t of [h.r.dn, h.r.up]) {
      if (!t) continue;
      const ia = htfBarIndex(B, HB, h.nClosed - t.a, t.dir), ib = htfBarIndex(B, HB, h.nClosed - t.b, t.dir);
      if (ia == null || ib == null) continue;
      const ka = ia - i0, kb = ib - i0;
      const pts = segment(ka, t.pa, kb, t.pb, nD);
      if (!pts.length || !enters(pts, lo, hi)) continue;
      const c: ChartTl = { tf: higher.tf, htf: true, dir: t.dir, touches: zvTouches(h.S, t), crossed: false, pts, anchors: [[ka, t.pa], [kb, t.pb]], kind: 'trend' };
      if (!mine.some(m => sameLine(m, c, tol)) && got.length < max) got.push(c);
    }
    out.push(...got);
  }
  return out;
}

/** Debug overlay (render harness only, off in production): the real pivots this panel's TF sees (the zigzag, in bar
 *  order) and the anchors of its own lines, as [drawn bar index, price]. */
export const ZV_DEBUG = { on: false };
export function panelZigzag(own: TlSeries, nDrawn: number, price: number): { zz: [number, number][]; used: [number, number][] } {
  const B = own.bars, nD = Math.min(nDrawn, B.length), i0 = B.length - nD;
  const { r, nClosed } = seriesLines(own, price);
  const k = (sh: number) => nClosed - sh - i0;
  const zz = [...r.pivots].sort((a, b) => b.bar - a.bar).map(p => [k(p.bar), p.p] as [number, number]).filter(([x]) => x >= -0.5);
  const used: [number, number][] = [];
  for (const t of [r.up, r.dn, r.upX, r.dnX]) if (t) used.push([k(t.a), t.pa], [k(t.b), t.pb]);
  return { zz, used: used.filter(([x]) => x >= -0.5) };
}
