// The SCANNERS' trendline rule (parity port; NOT what the chart images draw - those use the owner's ZoneVision rule,
// zvTrend.ts): a TypeScript port of the scanners' trendline construction (Kevin's lines, used
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
import { RAJA, rowOk, Series } from './zonecore.ts';

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
