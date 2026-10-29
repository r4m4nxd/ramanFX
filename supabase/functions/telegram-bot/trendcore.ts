// Trendlines for the bot's chart images: a TypeScript port of the scanners' trendline construction (Kevin's lines, used
// by the Raja rules), line by line from tools/stock_scanner/zones.py trendlines() + line_touches() + cross_bar() (the FX
// scanner calls the same functions through fxcore.analyse -> zones.eval_row). Settings = zones.RAJA: swing 2 (a valley
// = a low below the 2 bars each side, a peak mirrored), lookback 200 bars, a cross = a close beyond the line by a candle
// in the break direction with a body >= 0.6 ATR.
//   1. ZigZag: real valleys / peaks (a swing low counts once price made a higher high than the last swing high before
//      it came back below it; mirrored for peaks).
//   2. Each newer valley (up line) / peak (down line) is the second anchor b; the first anchor a = the lowest low before
//      it (else the previous valley, else the last line's anchor) when lower, refitted so no bar between pierces the
//      line by more than 0.05 ATR. Too flat (< 0.015 ATR per bar, or < 1.5 ATR of rise) = no line. A line counts once
//      CONFIRMED: price ran beyond the swing between the anchors before any bar closed fully on the other side.
//   3. An 'overall' line from the very bottom / top of the window through the flattest swing.
//   4. Removed = a bar entirely beyond the line (high below an up line); touches = separate visits within 0.1 ATR.
// The in-force line each way (st.up / st.dn) is the newest confirmed one when not removed, else the latest overall one;
// the scanners' tl_export publishes those two. (The scanners' 25-pip rule, fxcfg.TL_FAR_PIPS, is a trade rule about a
// zone's gap to its line, not part of the line itself.) Index convention as zonecore.ts: shift 0 = the phantom forming
// bar, 1 = the newest closed bar, larger = older. Parity: src/core/telegramTrendParity.test.ts. Pure.
import { RAJA, rowOk, Series, type ZBar } from './zonecore.ts';

const TL_SWING = 2, DEPART_ATR = 0.6;

export interface TrendLine {
  dir: number;        // +1 up line (under the valleys), -1 down line (over the peaks)
  a: number; b: number; pa: number; pb: number;   // anchors (shifts, a older) and the line's price there
  removed: boolean; removedBar: number; conf: boolean; crossBar: number;
}
export const tlSlope = (t: TrendLine) => (t.pb - t.pa) / Math.max(1, t.a - t.b);
/** The line's price at shift j (fractional shifts allowed: the chart projects lines onto other timeframes). */
export const tlAt = (t: TrendLine, j: number) => t.pb + tlSlope(t) * (t.b - j);
export interface TLState { lines: TrendLine[]; up: TrendLine | null; dn: TrendLine | null; upTouches: number; dnTouches: number }

const lineAt = (p2: number, b: number, sl: number, j: number) => p2 + sl * (b - j);
/** SHighest / SLowest: shift of the highest high / lowest low in [start, start + count) (newest on ties); -1 if empty. */
function highest(S: Series, count: number, start: number): number {
  const end = Math.min(S.n, start + count);
  if (start >= end) return -1;
  let best = start;
  for (let i = start + 1; i < end; i++) if (S.H[i] > S.H[best]) best = i;
  return best;
}
function lowest(S: Series, count: number, start: number): number {
  const end = Math.min(S.n, start + count);
  if (start >= end) return -1;
  let best = start;
  for (let i = start + 1; i < end; i++) if (S.L[i] < S.L[best]) best = i;
  return best;
}

/** zones.trendlines(). */
export function trendlines(S: Series): TLState {
  const sw = TL_SWING, Lo = S.L, Hi = S.H;
  const st: TLState = { lines: [], up: null, dn: null, upTouches: 0, dnTouches: 0 };
  const bars = Math.min(RAJA.lookback, S.n - 20);
  if (bars <= sw + 2) return st;
  const frLow = (i: number) => {
    for (let k = 1; k <= sw; k++) if (i - k < 1 || i + k >= S.n || Lo[i] > Lo[i + k] || Lo[i] >= Lo[i - k]) return false;
    return true;
  };
  const frHigh = (i: number) => {
    for (let k = 1; k <= sw; k++) if (i - k < 1 || i + k >= S.n || Hi[i] < Hi[i + k] || Hi[i] <= Hi[i - k]) return false;
    return true;
  };
  // ZigZag: real valleys / peaks, oldest first
  const piv: [number, number, number][] = [];   // (bar, price, type) type -1 valley, +1 peak
  let fH = -1, fL = -1;
  for (let i = bars; i > sw; i--) {
    const lo = frLow(i), hi = frHigh(i);
    if (lo && fH > 0) {
      for (let j = i - 1; j > 0; j--) {
        if (Lo[j] < Lo[i]) break;
        if (Hi[j] > Hi[fH]) { piv.push([i, Lo[i], -1]); break; }
      }
    }
    if (hi && fL > 0) {
      for (let j = i - 1; j > 0; j--) {
        if (Hi[j] > Hi[i]) break;
        if (Lo[j] < Lo[fL]) { piv.push([i, Hi[i], 1]); break; }
      }
    }
    if (lo) fL = i;
    if (hi) fH = i;
  }
  const atr1 = S.atr(1);
  const fitAnchor = (A: number, b2: number, p2: number, d: number): [number, number] => {
    let a = A, sl = 0;
    const tol = 0.05 * atr1;
    for (let it = 0; it < 50; it++) {
      sl = (p2 - (d > 0 ? Lo[a] : Hi[a])) / (a - b2);
      let worst = -1, ex = tol;
      for (let j = a - 1; j > b2; j--) {
        const lv = lineAt(p2, b2, sl, j);
        const e = d > 0 ? lv - Lo[j] : Hi[j] - lv;
        if (e > ex) { ex = e; worst = j; }
      }
      if (worst < 0) return [a, sl];
      a = worst;
    }
    sl = (p2 - (d > 0 ? Lo[a] : Hi[a])) / (a - b2);
    return [a, sl];
  };
  const removedAt = (b2: number, p2: number, sl: number, d: number) => {
    for (let j = b2 - 1; j > 0; j--) {
      const lv = lineAt(p2, b2, sl, j);
      if ((d > 0 && Hi[j] < lv) || (d < 0 && Lo[j] > lv)) return j;
    }
    return -1;
  };
  const confirmed = (a: number, b2: number, p2: number, sl: number, d: number) => {
    if (a - 1 <= b2) return false;
    let ext = d > 0 ? -Infinity : Infinity;
    for (let j = a - 1; j > b2; j--) ext = d > 0 ? Math.max(ext, Hi[j]) : Math.min(ext, Lo[j]);
    for (let j = b2 - 1; j > 0; j--) {
      const lv = lineAt(p2, b2, sl, j);
      if ((d > 0 && Hi[j] < lv) || (d < 0 && Lo[j] > lv)) return false;
      if ((d > 0 && Hi[j] > ext) || (d < 0 && Lo[j] < ext)) return true;
    }
    return false;
  };
  const tooFlat = (a: number, b2: number, p2: number, sl: number) => {
    const atr = Math.max(S.atr(b2), 1e-9);
    return Math.abs(sl) < 0.015 * atr || Math.abs(p2 - lineAt(p2, b2, sl, a)) < 1.5 * atr;
  };
  const add = (d: number, a: number, b2: number, p2: number, sl: number, overall: boolean) => {
    const rb = removedAt(b2, p2, sl, d);
    st.lines.push({ dir: d, a, b: b2, pb: p2, pa: lineAt(p2, b2, sl, a), removed: rb >= 0, removedBar: rb, conf: !overall, crossBar: -1 });
  };
  for (const d of [-1, 1]) {
    const want = d > 0 ? -1 : 1;
    let prevB = -1, prevP = 0, lastA = -1;
    for (const [b2, p2, t] of piv) {
      if (t !== want) continue;
      const pb = prevB, pp = prevP;
      prevB = b2; prevP = p2;
      let a = -1, sl = 0;
      const A = d > 0 ? lowest(S, bars - b2, b2 + 1) : highest(S, bars - b2, b2 + 1);
      if (A > b2 && (d > 0 ? Lo[A] < p2 : Hi[A] > p2)) {
        [a, sl] = fitAnchor(A, b2, p2, d);
        if (tooFlat(a, b2, p2, sl)) a = -1;
      }
      if (a < 0 && pb > 0 && (d > 0 ? pp < p2 : pp > p2)) {
        [a, sl] = fitAnchor(pb, b2, p2, d);
        if (tooFlat(a, b2, p2, sl)) a = -1;
      }
      if (a < 0 && lastA > b2 && (d > 0 ? Lo[lastA] < p2 : Hi[lastA] > p2)) {
        [a, sl] = fitAnchor(lastA, b2, p2, d);
        if (tooFlat(a, b2, p2, sl)) a = -1;
      }
      if (a < 0) continue;
      if (!confirmed(a, b2, p2, sl, d)) continue;
      const last = st.lines[st.lines.length - 1];
      if (last && last.dir === d && last.a === a) st.lines.pop();
      add(d, a, b2, p2, sl, false);
      lastA = a;
    }
    // overall line from the very bottom / top of the window
    const O = d > 0 ? lowest(S, bars, 1) : highest(S, bars, 1);
    if (O < 0) continue;
    const ov = d > 0 ? Lo[O] : Hi[O];
    let bs = 0, bk = -1;
    piv.forEach(([pbar, pprice, t], k) => {
      if (t !== want || pbar >= O - 1) return;
      const s0 = (pprice - ov) / (O - pbar);
      if ((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) return;
      if (bk < 0 || (d > 0 ? s0 < bs : s0 > bs)) { bk = k; bs = s0; }
    });
    if (bk >= 0) {
      const [b2, p2] = piv[bk];
      const [a, sl] = fitAnchor(O, b2, p2, d);
      const dup = st.lines.some(x => x.dir === d && (x.a === a || x.b === b2));
      if (!dup && !tooFlat(a, b2, p2, sl) && confirmed(a, b2, p2, sl, d)) {
        add(d, a, b2, p2, sl, true);
        if (st.lines[st.lines.length - 1].removed) st.lines.pop();
      }
    }
  }
  // the newest respected line each way (gUpOn / gDnOn)
  for (const d of [-1, 1]) {
    let newest = -1;
    st.lines.forEach((x, i) => { if (x.dir === d && x.conf && (newest < 0 || x.b < st.lines[newest].b)) newest = i; });
    let use = newest >= 0 && !st.lines[newest].removed ? newest : -1;
    if (use < 0) st.lines.forEach((x, i) => { if (x.dir === d && !x.conf && !x.removed) use = i; });
    if (use >= 0) {
      const t = st.lines[use];
      if (d > 0) { st.up = t; st.upTouches = lineTouches(S, t); } else { st.dn = t; st.dnTouches = lineTouches(S, t); }
    }
  }
  for (const t of st.lines) t.crossBar = crossBar(S, t);
  return st;
}

/** RjA_LineTouches: separate visits within 0.1 ATR of the line, from the anchor to the break / last closed bar. */
export function lineTouches(S: Series, t: TrendLine): number {
  const tol = 0.1 * S.atr(1);
  const end = t.removed ? t.removedBar + 1 : 1;
  let n = 0, inT = false;
  for (let j = t.a; j > Math.max(end, 1) - 1; j--) {
    const lv = tlAt(t, j);
    const touch = t.dir > 0 ? S.L[j] <= lv + tol : S.H[j] >= lv - tol;
    if (touch && !inT) n++;
    inT = touch;
  }
  return n;
}

/** DirCrossBar (Raja): a close beyond the line by a candle in the break direction with a body >= 0.6 ATR; -1 = none. */
export function crossBar(S: Series, t: TrendLine): number {
  for (let j = t.b - 1; j > 0; j--) {
    const lv = tlAt(t, j), a = S.atr(j), c = S.C[j];
    const beyond = t.dir > 0 ? c < lv : c > lv;
    if (beyond && S.cdir(j) === -t.dir && a > 0 && S.body(j) >= DEPART_ATR * a) return j;
  }
  return -1;
}

/** zones.eval_row's gate + trendlines: a row with too few bars (or no ATR) has no lines. */
export const rowTrendlines = (S: Series): TLState => (rowOk(S) ? trendlines(S) : { lines: [], up: null, dn: null, upTouches: 0, dnTouches: 0 });

// ---- chart selection ------------------------------------------------------------------------------------------------
/** A line picked for a chart: its price at a fractional shift, touches, crossed or not. */
export interface PickedLine { dir: number; line: TrendLine; touches: number; crossed: boolean; inForce: boolean }
/**
 * The most relevant lines of one row (at most `max`): never a removed one; uncrossed before crossed (a Raja departure
 * close through it), then the row's in-force up / down lines (what the scanners publish and the rules read) before the
 * other unremoved ones, more touches first, then nearest to price. `visible(t)` drops lines that never enter the panel's price range.
 */
export function pickLines(S: Series, st: TLState, max: number, visible: (t: TrendLine) => boolean = () => true): PickedLine[] {
  const cand = st.lines.filter(t => !t.removed && visible(t)).map(t => ({
    dir: t.dir, line: t, touches: t === st.up ? st.upTouches : t === st.dn ? st.dnTouches : lineTouches(S, t), crossed: t.crossBar >= 0,
    inForce: t === st.up || t === st.dn,
  }));
  const gap = (p: PickedLine) => Math.abs(tlAt(p.line, 1) - S.price);
  cand.sort((x, y) => Number(x.crossed) - Number(y.crossed) || Number(y.inForce) - Number(x.inForce) || y.touches - x.touches || gap(x) - gap(y));
  return cand.slice(0, max);
}

// ---- chart lines: the panel's own TF + the next higher TF projected onto the panel's time axis ----------------------
export interface CBar { t: string; o: number; h: number; l: number; c: number }
/** A line the scanner published for this TF (zones.tl_export: price p on the newest closed bar at time t, s = change per
 *  bar, n = bars back to the first anchor, x = crossed). */
export interface PubLine { dir: number; p: number; s: number; n: number; t: string; touches?: number; x?: boolean }
/** One timeframe's bars as the chart has them (oldest first); forming = the last bar is still forming; pub = the
 *  scanner's own lines for it (used when the chart has fewer bars than the scanners' 200-bar lookback). */
export interface TlSeries { tf: string; bars: CBar[]; forming: boolean; pub?: PubLine[] }
/** Closed bars the scanners' trendlines see: the 200-bar lookback + the 20 bars the window keeps clear (+ the phantom). */
export const FULL_TL_BARS = RAJA.lookback + 20;
/** A trendline to draw: pts = [drawn bar index (bar centres at 0 .. n-1, edges -0.5 / n-0.5), price]. */
export interface ChartTl { tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][] }

const tms = (t: string) => Date.parse(t.length >= 16 ? `${t.slice(0, 16)}:00Z` : `${t.slice(0, 10)}T00:00:00Z`);
const toZ = (b: CBar[]): ZBar[] => b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c }));

/** The row's lines: computed here (trendlines()) on the chart's closed bars; with a short history (published shards
 *  carry 80-120 bars) the scanner's own lines for this TF instead, re-anchored on the chart bars by time. */
function rowOf(s: TlSeries, price: number) {
  const closed = s.forming ? s.bars.slice(0, -1) : s.bars;
  const S = new Series(toZ(closed), price, s.tf);
  const nc = closed.length;
  if (!s.pub || nc >= FULL_TL_BARS) return { S, st: rowTrendlines(S), nClosed: nc };
  const st: TLState = { lines: [], up: null, dn: null, upTouches: 0, dnTouches: 0 };
  for (const q of s.pub) {
    if (![q.p, q.s, q.n].every(Number.isFinite) || q.n < 1) continue;
    let it = -1;
    for (let i = 0; i < nc; i++) if (closed[i].t <= q.t) it = i;
    if (it < 0) continue;
    const t: TrendLine = { dir: q.dir > 0 ? 1 : -1, a: nc - (it - q.n), b: nc - it, pb: q.p, pa: q.p - q.s * q.n, removed: false, removedBar: -1,
      conf: true, crossBar: q.x ? 0 : -1 };
    st.lines.push(t);
    if (t.dir > 0 && !st.up) { st.up = t; st.upTouches = q.touches ?? 0; }
    if (t.dir < 0 && !st.dn) { st.dn = t; st.dnTouches = q.touches ?? 0; }
  }
  return { S, st, nClosed: nc };
}
/** The [lo, hi] a line must enter to be worth drawing: the drawn candles' range (padded a little). */
function rangeOf(bars: CBar[]): [number, number] {
  let lo = Infinity, hi = -Infinity;
  for (const b of bars) { lo = Math.min(lo, b.l); hi = Math.max(hi, b.h); }
  const pad = (hi - lo) * 0.03;
  return [lo - pad, hi + pad];
}
const enters = (pts: [number, number][], lo: number, hi: number) =>
  pts.some(([, p], i) => (p >= lo && p <= hi) || (i > 0 && Math.min(p, pts[i - 1][1]) <= hi && Math.max(p, pts[i - 1][1]) >= lo));

/**
 * The trendlines of one chart panel: at most `max` of its own timeframe (from the line's first anchor to the right edge)
 * and at most `max` of the next higher timeframe, projected onto this panel's candles (each higher-TF bar spread evenly
 * over the panel bars inside it, so an HTF anchor sits mid-way through its period). Only lines that enter the drawn
 * candles' price range; the pick is pickLines() (in force, uncrossed, most touches, nearest price).
 */
export function panelTrendlines(own: TlSeries, nDrawn: number, price: number, higher: TlSeries | null, max = 2): ChartTl[] {
  const B = own.bars, nD = Math.min(nDrawn, B.length), i0 = B.length - nD;
  if (nD < 2) return [];
  const [lo, hi] = rangeOf(B.slice(i0));
  const out: ChartTl[] = [];
  // own timeframe: straight from the anchor (or the left edge) to the right edge
  {
    const { S, st, nClosed } = rowOf(own, price);
    const shift = (k: number) => nClosed - (i0 + k);
    const ptsOf = (t: TrendLine): [number, number][] => {
      const ks = Math.max(-0.5, nClosed - t.a - i0), ke = nD - 0.5;
      return ks > ke ? [] : [[ks, tlAt(t, shift(ks))], [ke, tlAt(t, shift(ke))]];
    };
    for (const p of pickLines(S, st, max, t => { const q = ptsOf(t); return q.length > 0 && enters(q, lo, hi); }))
      out.push({ tf: own.tf, htf: false, dir: p.dir, touches: p.touches, crossed: p.crossed, pts: ptsOf(p.line) });
  }
  if (!higher || higher.bars.length < 2) return out;
  // next higher timeframe: map every panel bar to a fractional higher-TF bar index
  const HB = higher.bars, ht = HB.map(b => tms(b.t));
  const kb = new Array<number>(B.length).fill(-1);
  for (let i = 0, k = -1; i < B.length; i++) {
    const t = tms(B[i].t);
    while (k + 1 < HB.length && ht[k + 1] <= t) k++;
    kb[i] = k;
  }
  const cnt = new Map<number, number>();
  for (const k of kb) if (k >= 0) cnt.set(k, (cnt.get(k) ?? 0) + 1);
  const full = [...cnt.entries()].filter(([k]) => k !== kb.find(x => x >= 0) && k !== HB.length - 1).map(([, c]) => c).sort((a, b) => a - b);
  const med = full.length ? full[Math.floor(full.length / 2)] : Math.max(1, ...cnt.values());
  const firstK = kb.find(x => x >= 0) ?? -1;
  const u: number[] = new Array<number>(nD).fill(NaN);
  const pos = new Map<number, number>();
  for (let i = 0; i < B.length; i++) {
    const k = kb[i];
    if (k < 0) continue;
    const c = cnt.get(k) ?? 1, p = pos.get(k) ?? 0;
    pos.set(k, p + 1);
    if (i < i0) continue;
    const n = k === HB.length - 1 || k === firstK ? Math.max(c, med) : c;
    const off = k === firstK && c < med ? med - c : 0;   // a partial first period: the missing bars came before
    u[i - i0] = k + (p + off + 0.5) / n - 0.5;
  }
  const { S, st, nClosed } = rowOf(higher, price);
  // [k, higher-TF shift] at every panel bar + both edges (extrapolated from the neighbours)
  const sp: [number, number][] = [];
  for (let k = 0; k < nD; k++) if (Number.isFinite(u[k])) sp.push([k, nClosed - u[k]]);
  if (sp.length < 2) return out;
  const ext = (a: [number, number], b: [number, number], k: number): [number, number] => [k, a[1] + (b[1] - a[1]) * (k - a[0]) / (b[0] - a[0])];
  if (sp[0][0] === 0) sp.unshift(ext(sp[0], sp[1], -0.5));
  sp.push(ext(sp[sp.length - 2], sp[sp.length - 1], nD - 0.5));
  const ptsOf = (t: TrendLine): [number, number][] => {
    const q: [number, number][] = [];
    sp.forEach(([k, j], i) => {
      if (j > t.a) return;                                  // before the line's first anchor
      if (!q.length && i > 0 && sp[i - 1][1] > t.a) {        // start exactly at the anchor
        const [k0, j0] = sp[i - 1], f = (j0 - t.a) / (j0 - j);
        q.push([k0 + (k - k0) * f, t.pa]);
      }
      q.push([k, tlAt(t, j)]);
    });
    return q.length >= 2 ? q : [];
  };
  for (const p of pickLines(S, st, max, t => { const q = ptsOf(t); return q.length > 0 && enters(q, lo, hi); }))
    out.push({ tf: higher.tf, htf: true, dir: p.dir, touches: p.touches, crossed: p.crossed, pts: ptsOf(p.line) });
  return out;
}
