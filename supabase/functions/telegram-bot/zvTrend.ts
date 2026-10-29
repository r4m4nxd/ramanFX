// Trendlines for the bot's chart images: the owner's ZoneVision indicator rule (public/tools/RFX_ZoneCore.mqh ZigZag /
// LineAt / RemovedAt / Confirmed / TooFlat, cross-checked with public/tools/RamanFX_ZoneVision.pine), with the owner's
// two-pivot rule on top. NOT the scanners' rule: tools/stock_scanner/zones.py trendlines() (ported in trendcore.ts for
// parity, used by the Raja signals) keeps its anchor search and 'overall' line; only the chart draws these.
//
// Owner: "We draw from real valleys and real peaks. Real valleys are pivot points after which price made a new high;
// real peaks are pivot points after which price made a new lower low, on that timeframe." and "We draw a trendline from
// the most recent TWO peaks or TWO valleys only."
//   1. Swing low (FrLow, InpTLSwing = 2): a low <= the 2 older lows and < the 2 newer lows (swing high mirrored), within
//      the newest min(InpLookback = 200, closed bars - InpTLSwing) bars (MQL: SBars - 20, see zvLines), low / high = the candle's wick (SL / SH = iLow / iHigh).
//   2. ZigZag: a swing low is a REAL VALLEY when, before any later low goes below it, a later high goes above the most
//      recent swing high before it (a new higher high). A swing high is a REAL PEAK when, before any later high goes
//      above it, a later low goes below the most recent swing low before it (a new lower low).
//   3. Up line = the two most recent real valleys, the newer one higher; down line = the two most recent real peaks, the
//      newer one lower. The line runs through the two wicks exactly (ZoneVision's FitAnchor / overall line / older
//      anchors are NOT used: they would replace a pivot). Dropped (nothing drawn that way) when the pair is in the
//      wrong order, TooFlat (< 0.015 ATR per bar, or < 1.5 ATR between the anchors; ATR(14) at the newer pivot), not
//      Confirmed (price never went beyond the extreme between the anchors before a full candle crossed the line) or
//      removed (RemovedAt: a full closed candle beyond it - an up line with a later high below it).
//   4. `cuts` = candles between the anchors the straight line cuts by more than 0.05 ATR (where ZoneVision's FitAnchor
//      would have moved the older anchor); reported, never changes the line.
// Index convention as zonecore.ts Series: shift 0 = the phantom forming bar, 1 = the newest closed bar, larger = older
// (MQL index semantics). Pure.
import { Series, type ZBar } from './zonecore.ts';

export const ZV = { swing: 2, lookback: 200, tlHistory: 3 } as const;   // InpTLSwing, InpLookback, InpTLHistory (RamanFX_ZoneVision.mq5)

export interface ZvPivot { bar: number; p: number; t: number }    // t: -1 real valley, +1 real peak; bar = shift
export interface ZvLine {
  dir: number;                 // +1 up line (under two valleys), -1 down line (over two peaks)
  a: number; b: number;        // shifts of the older / newer pivot
  pa: number; pb: number;      // the pivots' low (up) / high (down)
  cuts: number;                // candles between the anchors cut by more than 0.05 ATR
}
export interface ZvResult {
  pivots: ZvPivot[]; up: ZvLine | null; dn: ZvLine | null; why: { up: string; dn: string };
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

/** MQL ZigZag(bars): real valleys / peaks, oldest first. */
export function zvPivots(S: Series, bars: number, sw: number = ZV.swing): ZvPivot[] {
  const Lo = S.L, Hi = S.H, out: ZvPivot[] = [];
  const frLow = (i: number) => { for (let k = 1; k <= sw; k++) if (i - k < 1 || Lo[i] > Lo[i + k] || Lo[i] >= Lo[i - k]) return false; return true; };
  const frHigh = (i: number) => { for (let k = 1; k <= sw; k++) if (i - k < 1 || Hi[i] < Hi[i + k] || Hi[i] <= Hi[i - k]) return false; return true; };
  let fH = -1, fL = -1;
  for (let i = bars; i > sw; i--) {
    const lo = frLow(i), hi = frHigh(i);
    if (lo && fH > 0) for (let j = i - 1; j >= 1; j--) { if (Lo[j] < Lo[i]) break; if (Hi[j] > Hi[fH]) { out.push({ bar: i, p: Lo[i], t: -1 }); break; } }
    if (hi && fL > 0) for (let j = i - 1; j >= 1; j--) { if (Hi[j] > Hi[i]) break; if (Lo[j] < Lo[fL]) { out.push({ bar: i, p: Hi[i], t: 1 }); break; } }
    if (lo) fL = i;
    if (hi) fH = i;
  }
  return out;
}

/** The chart's two lines of one timeframe (closed bars + the phantom in S). */
export function zvLines(S: Series): ZvResult {
  const res: ZvResult = { pivots: [], up: null, dn: null, why: { up: 'too few bars', dn: 'too few bars' }, mom: null };
  // MQL: bars = MathMin(InpLookback, SBars - 20). MT5 always holds far more than 220 bars, so there the 20-bar margin
  // never binds; the bot's charts often have 60-120 bars (published shards), so the window here only keeps the swing
  // test's InpTLSwing older bars inside the series (shift 0 = the phantom forming bar).
  const bars = Math.min(ZV.lookback, S.n - 1 - ZV.swing);
  if (bars <= ZV.swing + 2) return res;
  const Lo = S.L, Hi = S.H, atr = zvAtr(S);
  const piv = res.pivots = zvPivots(S, bars);
  for (const d of [1, -1]) {
    const set = (why: string, t: ZvLine | null = null) => { if (d > 0) { res.why.up = why; res.up = t; } else { res.why.dn = why; res.dn = t; } };
    const ps = piv.filter(p => p.t === (d > 0 ? -1 : 1));
    if (ps.length < 2) { set(`fewer than two real ${d > 0 ? 'valleys' : 'peaks'}`); continue; }
    const o = ps[ps.length - 2], n = ps[ps.length - 1];
    if (d > 0 ? !(n.p > o.p) : !(n.p < o.p)) { set(d > 0 ? 'newer valley not higher' : 'newer peak not lower'); continue; }
    const t: ZvLine = { dir: d, a: o.bar, b: n.bar, pa: o.p, pb: n.p, cuts: 0 };
    const sl = zvSlope(t), at = (j: number) => zvAt(t, j);
    // TooFlat (ATR at the newer pivot)
    const ab = Math.max(atr(t.b), 1e-12);
    if (Math.abs(sl) < 0.015 * ab || Math.abs(t.pb - t.pa) < 1.5 * ab) { set('too flat'); continue; }
    // Confirmed: beyond the extreme between the anchors before a full candle crosses the line
    let ext = d > 0 ? -Infinity : Infinity;
    for (let j = t.a - 1; j > t.b; j--) ext = d > 0 ? Math.max(ext, Hi[j]) : Math.min(ext, Lo[j]);
    let conf = false;
    if (Number.isFinite(ext)) for (let j = t.b - 1; j >= 1; j--) {
      const lv = at(j);
      if ((d > 0 && Hi[j] < lv) || (d < 0 && Lo[j] > lv)) break;
      if ((d > 0 && Hi[j] > ext) || (d < 0 && Lo[j] < ext)) { conf = true; break; }
    }
    if (!conf) { set('not confirmed'); continue; }
    // RemovedAt: a full closed candle beyond the line
    let rm = -1;
    for (let j = t.b - 1; j >= 1; j--) { const lv = at(j); if ((d > 0 && Hi[j] < lv) || (d < 0 && Lo[j] > lv)) { rm = j; break; } }
    if (rm >= 0) { set(`broken at shift ${rm}`); continue; }
    const tol = 0.05 * atr(1);
    for (let j = t.a - 1; j > t.b; j--) if ((d > 0 ? at(j) - Lo[j] : Hi[j] - at(j)) > tol) t.cuts++;
    set('ok', t);
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
  return { dir: d, a: A, b, pa: P(A), pb, cuts: 0, e: E };
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
 *  (straight in the panel's bar-index space). crossed is always false (a broken line is not drawn). */
export interface ChartTl {
  tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][];
  anchors: [number, number][];            // the two anchor points [drawn bar index, price]
  kind: 'trend' | 'momentum';             // momentum = Kevin's red line (zvMomentum): own TF only, never a trend line
}

const tms = (t: string) => Date.parse(t.length >= 16 ? `${t.slice(0, 16)}:00Z` : `${t.slice(0, 10)}T00:00:00Z`);
const toZ = (b: CBar[]): ZBar[] => b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c }));
const closedOf = (s: TlSeries) => (s.forming ? s.bars.slice(0, -1) : s.bars);
/** zvLines on a TlSeries' closed bars. */
export function seriesLines(s: TlSeries, price: number) {
  const closed = closedOf(s);
  const S = new Series(toZ(closed), price, s.tf);
  return { S, r: zvLines(S), nClosed: closed.length };
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
