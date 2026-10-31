// ZoneVision 2.18 STRUCTURE MODEL: the ONE top-down chart reading of docs/training/SPEC.md, as a pure function of the bars.
// Canonical TypeScript; the MT5 mirror is the RFX_MODEL block of public/tools/RFX_ZoneCore.mqh (ZoneVision 2.18), line by
// line; conformance: tools/telegram_bot/parity/mql_port.py --model (src/core/zvModelParity.test.ts). Every consumer (the
// STRUCTURE line, the DIRECTION message, the HTF lines on lower TFs, the REALIGN box, zone roles, break alerts, export)
// reads THIS object; nothing else recomputes structure. Not used by the Telegram bot / Pine / MT4 yet (owner approval).
//
// Per TF of the chain 3M -> MN -> W1 -> D1 -> H4 -> H1 -> M15 (zmTf), on ALL bars given (no sliding window):
//   1. real pivots (SPEC 1.3, zmPivots): a zig-zag of legs and real corrections. The last pivot P_m is the extreme of the
//      current leg (it moves while price goes beyond it). It is FIXED when the counter-move from it is a real correction of
//      the leg into it: leg >= minLeg ATR AND (retrace >= rc of the leg (R1) OR the counter-move trades back to the leg's
//      origin base (R2: the newest 1-6 candle base on the leg whose run to the extreme is >= minLeg ATR, proximal +- near
//      ATR)); then the counter-move's extreme becomes the new pending pivot. A leg < minLeg ATR whose counter-move runs
//      beyond the previous pivot was no leg: that pivot extends instead. Bars are read as an OHLC path (bullish candle: low
//      then high; bearish: high then low) and a correction must show on a later candle than the extreme it corrects.
//   2. trend lines (SPEC 2.2b, 2.17 default zmDirF; the 2.16 zmDir = lineMode 0): built forward in time. A counter swing is
//      confirmed when price trades past the opposite extreme between it and the nearest further-out swing (Kevin L5); the
//      line drawn then (chain after a break / 3rd-touch line / nested line from the live line's pivot 2 / Line 1 from the
//      local extreme, clean with p1Shift, anchor 2 at the hull touch up to the confirmation) is FIXED; the first CLOSE beyond
//      breaks it (the fake-cross veto only for a close within vetoClose ATR). 2.18 H1 (W1 / MN / 3M): the candle that closes
//      beyond the first swing after a real pivot, when it launches the leg, is a line swing too; Line 1 from a cut local
//      extreme starts at the first higher low after it.
//   3. momentum lines (SPEC 1.6): one per impulse leg from the pivot, plus (2.18 H2) one per one-way run inside the leg that
//      starts with a >= momBody ATR departure candle; the hull over the next momBars bars (all kept).
//   4. zones (SPEC 1.10): zonecore.detect + HTF range bases + reversal zones at the real pivots (2.18 H3: after a leg-in
//      pivot candle, the base candles before the leg-out); pattern, strong, arrival, touches, removed; reasons BOS (nearest
//      zoneSwing-bar swing) / CHoCH / removal.
//   5. trend state (SPEC 1.9): UP / DOWN / SIDEWAYS from HHH + SL (LLL + SH), closes beyond SL / SH.
// Top-down (zmModel): leg + phase vs the PARENT's trend (1.8), bias TF, sideways TF, correcting TF C and its parent P,
// the realignment target (1.11), the STRUCTURE line and ONE DIRECTION message (2.7), the allowed side per TF (2.6).
// Index convention as zonecore.ts Series: shift 0 = phantom (the price), 1 = newest closed bar, larger = older. Pure.
import { detect, FX_PARAMS, Series, tests as zoneTests, toQuarters, type Zone } from './zonecore.ts';

/** The tunables (SPEC section 8) + the two open-question switches. Keep RFX_ZoneCore.mqh ZM_* and mql_port.py in step. */
export const ZM = {
  rc: 0.45, near: 0.25, minLeg: 1.25, p1Shift: 1, fitTol: 0.02, minRise: 0.25, minSlope: 0.015,
  vetoTol: 0.05, vetoBars: 8, brokenShow: 20, rangeBaseMax: 20, rangeBaseATR: 2.5, targetGap: 1.0,
  /** Q1 'retrace' rule (coordinator, 2026-10-30, not yet owner-confirmed): the extreme anchors Line 1 only when the first
   *  correction after it retraces >= this share of the first leg; else extreme -> C1 is a momentum line (lineMode 0 only). */
  p1Retrace: 0.50,
  /** 2.17 lines (SPEC 2.2, owner 2026-10-30): lineMode 1 = the forward-time machine (zmDirF), 0 = the 2.16 machine (zmDir,
   *  Q1 / Q2 options); a close beyond can only be vetoed when it is within vetoClose ATR of the line; a nested line needs its
   *  new swing >= nestGap ATR inside the live line; a swing within touchTol ATR of the live line is a touch (the 3rd touch
   *  starts the next, flatter line). */
  lineMode: 1, vetoClose: 0.5, nestGap: 0.8, touchTol: 0.15,
  /** 2.17 momentum (SPEC 1.6): the hull along the impulse leg from the pivot to the next pivot; the start moves one bar when
   *  the hull touches the next bar flatter than momShift ATR / bar; touches within momTol ATR count; flatter than momMin ATR
   *  per bar is no impulse. */
  momShift: 0, momTol: 0.03, momMin: 0.15,
  /** 2.17 zones: pivZones 1 = each real pivot's candle is a reversal zone (2 = + the basing candles at the turn; 3 = 2.18 H3:
   *  when the pivot candle is the last leg-in candle, a departure INTO the extreme, the zone is the basing candle(s) after it
   *  before the leg-out, distal at their own extreme wick); zoneSwing N = the BOS reason breaks the nearest N-bar swing before
   *  the base (0 = the newest real pivot). */
  pivZones: 3, zoneSwing: 2,
  /** 2.18 H1 (W1 / MN / 3M only; 0 = off): bosN = a trend-line anchor 2 is also the candle that CLOSES beyond the first
   *  bosN-bar swing after a real pivot (Kevin V -> P -> break of P) when that candle launches the leg (the candle before it
   *  is no leg-direction departure) and no real pivot lies between; p1Low 1 = when Line 1 from the local extreme is cut,
   *  anchor 1 = the first higher low after it (the line-side extreme between), clean within fitTol ATR. */
  bosN: 1, p1Low: 1,
  /** 2.18 H2: momRun 1 = also one momentum line per one-way run inside an impulse leg that starts with a leg-direction
   *  departure candle of body >= momBody ATR right after an opposite-coloured or basing candle; momBars = the momentum hull's
   *  window, bars after anchor 1 (0 = up to the next pivot). */
  momRun: 1, momBody: 1.0, momBars: 5,
};
export type ZmParams = typeof ZM;
/** Q1: how Line 1 of a structure starts. 'spec' = the clean-line test (2.2 step 2); 'retrace' = the p1Retrace rule;
 *  'major' = 'spec' + one major line from the absolute extreme to the newest confirmed counter-pivot, Line 1 labelled
 *  momentum. Q2: anchor 1 of Line 1 = (a) the extreme, (b) the first counter-pivot C1, (c) the second C2. */
export type ZmQ1 = 'spec' | 'retrace' | 'major';
export type ZmQ2 = 'a' | 'b' | 'c';
export interface ZmOpts { q1?: ZmQ1; q2?: ZmQ2; params?: Partial<ZmParams> }
export const ZM_DEFAULTS: Required<Omit<ZmOpts, 'params'>> = { q1: 'spec', q2: 'a' };

export interface ZmPivot { bar: number; p: number; t: number; conf: number }      // t +1 peak / -1 valley; conf -1 = pending
export type ZmLineKind = 'trend' | 'momentum' | 'major';
export interface ZmLine {
  dir: number; kind: ZmLineKind; a: number; b: number; pa: number; pb: number;
  born: number;            // the bar the line became known (its confirmation)
  brokenAt: number;        // first close beyond (-1 = live)
  p2: number;              // the real anchor-2 pivot's bar (chain start after a break)
  touches: number;         // touches / fake crosses after anchor 2 (T<n>)
  why: string;             // 'g1' | 'g1-shift' | 'c1' | 'chain' | 'rot' | 'mom' | 'major' | 'p1mom'
}
export interface ZmZone {
  dir: number; prox: number; dist: number; base0: number; base1: number; legBar: number;   // base0 newest base bar, base1 oldest
  pattern: string; range: boolean; strong: boolean; arrival: boolean; touches: number; removed: boolean; removedBar: number;
  /** owner 2026-10-30: a zone is drawn only with a reason its leg-out gives: 'break' (closed beyond the previous swing
   *  high / low = BOS), 'direction' (closed through a live opposite trend line = CHoCH), 'removal' (closed through >= 1
   *  opposite zone). removedIds = legBar of each removed zone, brokePivot = the bar of the broken swing. */
  reasons: string[]; removedIds: number[]; brokePivot: number;
  /** 2.17: a reversal zone built at a real pivot (pivZones), not a zonecore base */
  pivot?: boolean;
}
export type ZmTrendName = 'UP' | 'DOWN' | 'SIDEWAYS';
export interface ZmTrend {
  trend: number;           // +1 UP, -1 DOWN, 0 SIDEWAYS
  ext: number; extBar: number;   // HHH (UP / sideways-from-up) or LLL
  sl: number; slBar: number;     // SL (UP) / SH (DOWN): the pivot that launched the extreme
  lo: number; hi: number;        // SIDEWAYS range edges (SL..HHH or LLL..SH), else 0
  from: number;            // the last directional trend before a sideways (+1 / -1 / 0)
}
export interface ZmTf {
  tf: string; digits: number; n: number; last: string; price: number;
  pivots: ZmPivot[]; lines: ZmLine[]; up: ZmLine | null; dn: ZmLine | null; upX: ZmLine | null; dnX: ZmLine | null;
  mom: ZmLine[];           // every momentum line (history), newest anchor first
  zones: ZmZone[];
  st: ZmTrend; leg: number;
}
export interface ZmTarget {
  tf: string; zone: ZmZone; lineTf: string; line: ZmLine | null; value: number; why: string;
}
export interface ZmPhase { tf: string; trend: ZmTrendName; leg: number; phase: 'impulse' | 'correction' | 'range'; parent: string }
export interface ZmModel {
  sym: string; chart: string; tfs: ZmTf[]; phases: ZmPhase[];
  bias: number; biasTf: string; sideTf: string; cTf: string; pTf: string; target: ZmTarget | null;
  allowed: Record<string, number>;   // per TF: +1 buys, -1 sells, 0 none (2.6)
  structure: string; direction: string; missing: string[];
}

// ---- helpers ----------------------------------------------------------------------------------------------------------
export const zmAt = (t: { a: number; b: number; pa: number; pb: number }, j: number) => t.pb + ((t.pb - t.pa) / Math.max(1, t.a - t.b)) * (t.b - j);
/** ATR(14) at shift i (MT5 iATR; Wilder on the virtual 3M), the oldest valid one where none exists yet; never 0. */
export function zmAtr(S: Series): (i: number) => number {
  const n = S.n, w = new Array<number>(n).fill(0), wil = S.tf === '3M';
  if (wil) {
    let sum = 0, cnt = 0;
    for (let i = n - 1; i >= 0; i--) {
      let tr = S.H[i] - S.L[i];
      if (i < n - 1) tr = Math.max(tr, Math.abs(S.H[i] - S.C[i + 1]), Math.abs(S.L[i] - S.C[i + 1]));
      cnt++;
      if (cnt < 14) { sum += tr; continue; }
      if (cnt === 14) { sum += tr; w[i] = sum / 14; continue; }
      w[i] = (w[i + 1] * 13 + tr) / 14;
    }
  }
  const raw = (i: number) => (i >= 0 && i < n ? (wil ? w[i] : S.atr(i)) : 0);
  let last = 0;
  for (let i = 1; i < n; i++) if (raw(i) > 0) last = i;
  return i => Math.max(raw(Math.min(Math.max(i, 0), last)), 1e-12);
}
/** Debug hook (tests / the render script): receives one line per structure event. */
export const zmDebug: { log: ((s: string) => void) | null } = { log: null };

// ---- 1. real pivots (SPEC 1.3) ------------------------------------------------------------------------------------------
/** The origin base of the leg a (older shift) -> x (newer shift), d = the leg's direction: scanning from the candle before
 *  X back to A, the newest candle k that is a basing candle followed by a leg-direction departure candle (or a candle the
 *  next one gaps away from), extended over up to 6 consecutive basing candles; it counts only when the run from its
 *  distal to X is >= minLeg ATR(X) (the zone that STARTED the move). Returns its proximal, or null. */
export function zmOrigin(S: Series, a: number, x: number, d: number, k: ZmParams, atr: (i: number) => number): number | null {
  const xp = d > 0 ? S.H[x] : S.L[x];
  for (let c = x + 1; c <= a; c++) {
    const gap = d > 0 ? S.L[c - 1] > S.H[c] : S.H[c - 1] < S.L[c];
    const dep = !S.basing(c - 1) && S.cdir(c - 1) === d;
    if (!(gap || (S.basing(c) && dep))) continue;
    let dist = d > 0 ? Infinity : -Infinity, prox = d > 0 ? -Infinity : Infinity;
    for (let i = c; i <= a && i - c < 6; i++) {
      if (i > c && (gap || !S.basing(i))) break;
      dist = d > 0 ? Math.min(dist, S.L[i]) : Math.max(dist, S.H[i]);
      prox = d > 0 ? Math.max(prox, S.O[i], S.C[i]) : Math.min(prox, S.O[i], S.C[i]);
    }
    if (Math.abs(xp - dist) >= k.minLeg * atr(x)) return prox;
  }
  return null;
}

/** Real pivots over all bars, oldest first; conf = the shift that fixed it (-1 = the pending last pivot). */
export function zmPivots(S: Series, k: ZmParams = ZM, atr = zmAtr(S)): ZmPivot[] {
  const H = S.H, L = S.L, out: (ZmPivot & { q: number })[] = [];
  const from = S.n - 1, NP = 2 * from;
  if (from < 3) return [];
  const pBar = (q: number) => from - (q >> 1);
  const pHigh = (q: number) => { const b = pBar(q), lowFirst = S.C[b] >= S.O[b]; return (q & 1) === 1 ? lowFirst : !lowFirst; };
  const pVal = (q: number) => (pHigh(q) ? H[pBar(q)] : L[pBar(q)]);
  let hq = -1, lq = -1, q = 0;
  for (; q < NP; q++) {
    if (pHigh(q)) { if (hq < 0 || pVal(q) > pVal(hq)) hq = q; } else if (lq < 0 || pVal(q) < pVal(lq)) lq = q;
    if (hq >= 0 && lq >= 0 && pVal(hq) - pVal(lq) >= k.minLeg * atr(pBar(q))) break;
  }
  if (q >= NP) return [];
  const mk = (r: number, t: number, conf: number) => ({ bar: pBar(r), p: pVal(r), t, conf, q: r });
  if (lq < hq) { out.push(mk(lq, -1, pBar(q))); out.push(mk(hq, 1, -1)); } else { out.push(mk(hq, 1, pBar(q))); out.push(mk(lq, -1, -1)); }
  let yq = -1, y2 = -1;   // the counter-move's extreme since the last pivot's point (any) / on candles after its candle
  const better = (t: number, r: number, cur: number) => cur < 0 || (t > 0 ? pVal(r) < pVal(cur) : pVal(r) > pVal(cur));
  const scanY = (to: number) => {
    const pm = out[out.length - 1];
    yq = -1; y2 = -1;
    for (let r = pm.q + 1; r <= to; r++) {
      if (pHigh(r) !== (pm.t < 0)) continue;
      if (better(pm.t, r, yq)) yq = r;
      if (pBar(r) < pm.bar && better(pm.t, r, y2)) y2 = r;
    }
  };
  scanY(q);
  for (q = q + 1; q < NP; q++) {
    const hi = pHigh(q), v = pVal(q), j = pBar(q);
    let pm = out[out.length - 1];
    if (hi === (pm.t > 0) && (pm.t > 0 ? v > pm.p : v < pm.p)) { pm.q = q; pm.bar = j; pm.p = v; pm.conf = -1; yq = -1; y2 = -1; continue; }
    if (hi === (pm.t < 0)) { if (better(pm.t, q, yq)) yq = q; if (j < pm.bar && better(pm.t, q, y2)) y2 = q; }
    for (let guard = 0; guard < 64 && yq >= 0; guard++) {
      pm = out[out.length - 1];
      const pa = out[out.length - 2], leg = Math.abs(pm.p - pa.p), legOk = leg >= k.minLeg * atr(pm.bar);
      if (legOk && y2 >= 0) {
        const yp = pVal(y2);
        let ok = Math.abs(pm.p - yp) >= k.rc * leg;
        if (!ok) {
          const o = zmOrigin(S, pa.bar, pm.bar, pm.t, k, atr);
          if (o != null) ok = pm.t > 0 ? yp <= o + k.near * atr(pm.bar) : yp >= o - k.near * atr(pm.bar);
        }
        if (ok) { pm.conf = j; out.push(mk(yq, -pm.t, -1)); scanY(q); continue; }   // at the counter-move's true extreme
      }
      if (!legOk && (pm.t > 0 ? pVal(yq) < pa.p : pVal(yq) > pa.p)) {
        out.pop();
        const x = out[out.length - 1];
        x.q = yq; x.bar = pBar(yq); x.p = pVal(yq);
        if (out.length > 1) x.conf = -1;
        if (out.length === 1) { scanY(q); if (yq >= 0) out.push(mk(yq, -x.t, -1)); }
        scanY(q);
        continue;
      }
      break;
    }
  }
  return out.map(({ bar, p, t, conf }) => ({ bar, p, t, conf }));
}

// ---- 2. trend lines (SPEC 2.2) + 3. momentum lines (SPEC 1.6) ------------------------------------------------------------
const mkLine = (dir: number, kind: ZmLineKind, a: number, b: number, pa: number, pb: number, born: number, p2: number, why: string): ZmLine =>
  ({ dir, kind, a, b, pa, pb, born, brokenAt: -1, p2, touches: 0, why });

/** The momentum line of the impulse leg out of pivot piv[i] (SPEC 1.6, owner 2026-10-30: from the extreme of an impulse
 *  leg along its next bars, one per leg, ending at its first close beyond): anchor 1 = the pivot's extreme (one bar later
 *  when the line to the very next bar is flatter than momShift ATR / bar), anchor 2 = the steepest touch of the leg's
 *  line-side extremes up to the next pivot (the hull, touches within momTol ATR allowed; the next pivot's own candle counts
 *  only when its line-side extreme comes before its extreme: bullish candle low first); an impulse is >= momMin ATR / bar. */
export function zmMomentum(S: Series, piv: ZmPivot[], i: number, k: ZmParams, atr: (i: number) => number): ZmLine | null {
  return zmMomentumAll(S, piv, i, k, atr).find(l => l.why === 'mom') ?? null;
}
/** Every momentum line of the leg out of piv[i]: the pivot's line (zmMomentum), then (2.18 H2, momRun) one line per one-way
 *  run inside the leg: a run starts at a leg-direction departure candle with a body >= momBody ATR right after an
 *  opposite-coloured or basing candle; anchor 1 = that candle's extreme, anchor 2 = the hull over the next momBars bars
 *  (0 = up to the next pivot), touches within momTol, ending at the first close beyond. */
export function zmMomentumAll(S: Series, piv: ZmPivot[], i: number, k: ZmParams, atr: (i: number) => number): ZmLine[] {
  const P = piv[i], Q = piv[i + 1] ?? null, d = -P.t, xBar = Q ? Q.bar : 1;
  if (P.bar - xBar < 1) return [];
  const X = (j: number) => (d > 0 ? S.L[j] : S.H[j]);
  const use = (j: number) => j !== xBar || !Q || (d > 0 ? S.C[j] >= S.O[j] : S.C[j] < S.O[j]);
  const lim = (a: number) => (k.momBars > 0 ? Math.max(xBar, a - k.momBars) : xBar);
  const hull = (a: number) => {
    let b = -1, sl = 0;
    for (let j = a - 1; j >= lim(a); j--) {
      if (!use(j)) continue;
      const v = (X(j) - X(a)) / (a - j);
      if (b < 0 || (d > 0 ? v < sl : v > sl)) { b = j; sl = v; }
    }
    return { b, sl };
  };
  const tol = (a: number, h: { b: number; sl: number }) => {
    let { b, sl } = h;
    if (b < 0) return h;
    for (let j = a - 1; j >= lim(a); j--) {                     // the steepest touch within momTol of every other extreme
      if (!use(j) || j === b) continue;
      const v = (X(j) - X(a)) / (a - j);
      if (!(d > 0 ? v > sl : v < sl)) continue;
      let ok = true;
      for (let h = a - 1; h >= lim(a) && ok; h--) if (h !== j && use(h) && d * (X(a) + v * (a - h) - X(h)) > k.momTol * atr(h)) ok = false;
      if (ok && (d > 0 ? v > sl : v < sl)) { b = j; sl = v; }
    }
    return { b, sl };
  };
  const mk = (a: number, why: string): ZmLine | null => {
    const h = tol(a, hull(a));
    if (h.b < 0 || d * h.sl <= 0 || Math.abs(h.sl) < k.momMin * atr(a)) return null;
    const t = mkLine(d, 'momentum', a, h.b, X(a), X(h.b), h.b, P.bar, why);
    for (let j = h.b - 1; j >= 1; j--) if (d > 0 ? S.C[j] < zmAt(t, j) : S.C[j] > zmAt(t, j)) { t.brokenAt = j; break; }
    return t;
  };
  const out: ZmLine[] = [];
  let a = P.bar;
  const h0 = hull(a);
  if (h0.b === a - 1 && Math.abs(h0.sl) < k.momShift * atr(a) && a - 1 > xBar) a = a - 1;
  const m0 = mk(a, 'mom');
  if (m0) out.push(m0);
  if (k.momRun) {
    const dep = (j: number) => S.cdir(j) === d && !S.basing(j);
    for (let r = P.bar - 1; r > xBar; r--) {
      if (!dep(r) || dep(r + 1) || r === a) continue;
      if (Math.abs(S.C[r] - S.O[r]) < k.momBody * atr(r)) continue;
      const m = mk(r, 'run');
      if (m && !out.some(o => o.a === m.a && o.b === m.b)) out.push(m);
    }
  }
  return out;
}

interface ZmDir { d: number; hist: ZmLine[]; step: (j: number) => boolean; endStructure: () => void }

/** One direction's line machine (d +1 = up lines under lows, -1 = down lines over highs; SPEC 2.2). step(j) runs bar j
 *  (oldest first) and returns true when a NEW structure of this direction was confirmed there (its Line 1 confirmation),
 *  which ends the other direction's structure (the old line stays until its own close beyond, but no chain follows it). */
function zmDir(S: Series, piv: ZmPivot[], d: number, k: ZmParams, q1: ZmQ1, q2: ZmQ2, atr: (i: number) => number): ZmDir {
  const C = S.C;
  const X = (j: number) => (d > 0 ? S.L[j] : S.H[j]), Y = (j: number) => (d > 0 ? S.H[j] : S.L[j]);
  const out = (x: number, y: number) => (d > 0 ? x < y : x > y);          // x further out than y (lower low for an up line)
  const beyond = (t: ZmLine, j: number) => (d > 0 ? C[j] < zmAt(t, j) : C[j] > zmAt(t, j));
  const sideP = piv.filter(p => p.conf >= 0 && p.t === -d).sort((x, y) => y.conf - x.conf || y.bar - x.bar);
  const oppP = piv.filter(p => p.conf >= 0 && p.t === d);
  const hist: ZmLine[] = [];
  // the opposite extreme between bars a > b: the most extreme real opposite pivot there, else the most extreme bar
  const oppBetween = (a: number, b: number): number => {
    let best = NaN;
    for (const p of oppP) if (p.bar < a && p.bar > b && (Number.isNaN(best) || (d > 0 ? p.p > best : p.p < best))) best = p.p;
    if (Number.isNaN(best)) for (let j = a - 1; j > b; j--) if (Number.isNaN(best) || (d > 0 ? Y(j) > best : Y(j) < best)) best = Y(j);
    return best;
  };
  const slopeOk = (a: number, pa: number, b: number, pb: number) => {
    const ab = atr(b), rise = d * (pb - pa);
    return rise > 0 && rise >= k.minRise * ab && rise / Math.max(1, a - b) >= k.minSlope * ab;
  };
  // the line from bar a's extreme to bar b's; anchor 2 moves to the hull touch over (b, to] when a bar there pokes beyond
  // it by more than fitTol ATR; clean = no bar strictly between the final anchors beyond it
  const build = (a: number, b: number, to: number) => {
    const pa = X(a);
    let bb = b, sl = (X(b) - pa) / (a - b), poke = false;
    for (let j = b - 1; j >= to; j--) if (d * (pa + sl * (a - j) - X(j)) > k.fitTol * atr(j)) poke = true;
    if (poke) for (let j = b - 1; j >= to; j--) { const s = (X(j) - pa) / (a - j); if (d > 0 ? s < sl : s > sl) { sl = s; bb = j; } }
    const pb = X(bb);
    let clean = true;
    for (let j = a - 1; j > bb; j--) if (d * (pa + ((pb - pa) / (a - bb)) * (a - j) - X(j)) > 1e-9 * Math.abs(pa)) { clean = false; break; }
    return { a, b: bb, pa, pb, clean };
  };
  // the fake-cross veto (1.7) for a close beyond line t at bar kk: true = rotated about anchor 1, false = broken at kk
  const veto = (t: ZmLine, kk: number): boolean => {
    if (kk - 1 < 1) return false;
    const back = d > 0 ? C[kk - 1] >= zmAt(t, kk - 1) - k.vetoTol * atr(kk - 1) : C[kk - 1] <= zmAt(t, kk - 1) + k.vetoTol * atr(kk - 1);
    if (!back) return false;
    let pv = -1;
    for (const p of sideP) if ((p.bar === kk || p.bar === kk - 1) && d * (zmAt(t, p.bar) - p.p) > 0) { pv = p.bar; break; }
    if (pv < 0) return false;
    let ex = Y(t.a);
    for (let j = t.a - 1; j > kk; j--) ex = d > 0 ? Math.max(ex, Y(j)) : Math.min(ex, Y(j));
    const r = build(t.a, pv, pv);
    const rl = mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, 0, pv, 'rot');
    for (let h = kk - 1; h >= Math.max(1, kk - k.vetoBars); h--) {
      if (h < rl.b && beyond(rl, h)) return false;
      if (d > 0 ? Y(h) > ex : Y(h) < ex) { t.b = rl.b; t.pb = rl.pb; t.p2 = pv; t.why = 'rot'; t.touches++; return true; }
    }
    return false;
  };
  // the first close beyond t in (t.b, to] (vetoed closes rotate it); -1 = none
  const firstBreak = (t: ZmLine, to: number) => { for (let x = t.b - 1; x >= to; x--) if (beyond(t, x) && !veto(t, x)) return x; return -1; };
  const momFrom = (r: { a: number; b: number; pa: number; pb: number }, j: number, p2: number) => {
    const m = mkLine(d, 'momentum', r.a, r.b, r.pa, r.pb, j, p2, 'p1mom');
    for (let x = m.b - 1; x >= 1; x--) if (beyond(m, x)) { m.brokenAt = x; break; }
    hist.push(m);
  };
  // structure (2.2 step 1, Kevin L5): a new side pivot C1 beyond the previous one E (a higher low for up lines) + price
  // trading beyond the opposite pivot between them = a structure from E. Line 1 = E -> C1 (clean, p1Shift; Q1 / Q2 may skip
  // E), else C1 -> C2 (the next counter-pivot). After a break, the next line chains from the broken line's real anchor 2.
  const skip0 = q2 === 'a' ? 0 : q2 === 'b' ? 1 : 2;     // Q2: how many counter-pivots Line 1 skips
  let prev: ZmPivot | null = null;          // the newest confirmed side pivot
  let pends: { e: ZmPivot; c1: ZmPivot }[] = [];       // candidate structures waiting for Kevin's confirmation
  let wait: { a: ZmPivot; skip: number } | null = null;  // Line 1 from a counter-pivot: waiting for the next one
  let live: ZmLine | null = null, major: ZmLine | null = null, majorE: ZmPivot | null = null;
  const orphans: ZmLine[] = [];            // live lines of an ended structure: kept until their own close beyond, no chain
  let chainR = -1, chainP = 0, brkBar = -1, si = 0;
  const brokeAt = (t: ZmLine, x: number) => {
    t.brokenAt = x;
    if (t === live) { live = null; chainR = t.p2; chainP = X(t.p2); brkBar = x; }
  };
  const born = (t: ZmLine, j: number) => {
    if (hist.some(h => h.a === t.a && h.b === t.b)) return;            // the same line already drawn
    hist.push(t);
    const x = firstBreak(t, j);
    if (x < 0) live = t; else brokeAt(t, x);
  };
  const lineFrom = (a: ZmPivot, b: ZmPivot, j: number, why: string) => {   // a counter-pivot line (chain / C1 -> C2)
    const r = build(a.bar, b.bar, j);
    if (!slopeOk(r.a, r.pa, r.b, r.pb)) return false;
    born(mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, j, b.bar, why), j);
    return true;
  };
  const step = (j: number): boolean => {
    let confirmed = false;
    // a) the live line: a close beyond breaks it unless the fake-cross veto rotates it; a poke without a close = a touch
    if (live && j < live.b) {
      if (beyond(live, j)) { if (!veto(live, j)) brokeAt(live, j); }
      else if (d * (zmAt(live, j) - X(j)) > -k.fitTol * atr(j)) live.touches++;
    }
    if (major && major.brokenAt < 0 && j < major.b && beyond(major, j)) major.brokenAt = j;
    for (const o of orphans) if (o.brokenAt < 0 && j < o.b && beyond(o, j) && !veto(o, j)) o.brokenAt = j;
    // b) the line-side pivots confirmed at this bar
    for (; si < sideP.length && sideP[si].conf >= j; si++) {
      const p = sideP[si];
      zmDebug.log?.(`d${d} piv ${S.T[p.bar]} ${p.p} conf ${S.T[j]} prev ${prev ? S.T[prev.bar] : '-'} live ${live ? S.T[live.a] + '>' + S.T[live.b] : '-'} pends ${pends.length} chain ${chainR >= 0 ? S.T[chainR] : '-'}`);
      const pr = prev;
      prev = p;
      if (chainR >= 0 && !live && p.bar < brkBar) {        // after a break: chain from the broken line's real anchor 2
        const R = { bar: chainR, p: chainP, t: -d, conf: j };
        chainR = -1;
        if (out(chainP, p.p)) { if (!lineFrom(R, p, j, 'chain')) wait = { a: p, skip: 0 }; continue; }
      }
      if (live) continue;
      if (wait) {                                          // Line 1 from a counter-pivot: the next one beyond it
        if (out(wait.a.p, p.p)) { if (wait.skip > 0) wait = { a: p, skip: wait.skip - 1 }; else { const w = wait; wait = null; if (!lineFrom(w.a, p, j, 'c1')) wait = { a: p, skip: 0 }; } }
        else wait = null;
        continue;
      }
      // the candidates: a pivot beyond C1 but not beyond E is the new C1; beyond E kills the candidate
      pends = pends.filter(c => { if (out(p.p, c.c1.p)) { if (out(c.e.p, p.p)) c.c1 = p; else return false; } return true; });
      if (pr && out(pr.p, p.p)) pends.push({ e: pr, c1: p });   // a higher low after a low: a candidate structure from pr
      if (q1 === 'major' && majorE && out(majorE.p, p.p) && (!major || major.brokenAt < 0)) {   // Q1 major: one line
        const r = build(majorE.bar, p.bar, j);
        if (slopeOk(r.a, r.pa, r.b, r.pb)) {
          const t = mkLine(d, 'major', r.a, r.b, r.pa, r.pb, j, p.bar, 'major');
          let x = -1;
          for (let y = t.b - 1; y >= j; y--) if (beyond(t, y)) { x = y; break; }
          if (x < 0) { if (major) hist.splice(hist.indexOf(major), 1); major = t; hist.push(t); }
        }
      }
    }
    // c) Kevin's confirmation of the pending structure: price breaks the opposite extreme between E and C1, after C1
    const hit = live ? undefined : pends.find(c => j < c.c1.bar && (d > 0 ? Y(j) > oppBetween(c.e.bar, c.c1.bar) : Y(j) < oppBetween(c.e.bar, c.c1.bar)));
    if (hit) {                                             // the oldest candidate whose opposite pivot is broken
      const e = hit.e, b = hit.c1.bar, v = oppBetween(e.bar, b);
      {
        pends = [];
        confirmed = true;
        if (q1 === 'major' && (!majorE || out(e.p, majorE.p))) { majorE = e; major = null; }
        let made = false;
        if (skip0 === 0) {
          let fromExt = true;
          if (q1 === 'retrace') fromExt = Math.abs(sp1(b) - v) >= k.p1Retrace * Math.abs(e.p - v);
          if (fromExt) {
            for (let s = 0; s <= k.p1Shift && !made; s++) {
              const aa = e.bar - s;
              if (aa <= b) break;
              const r = build(aa, b, j);
              if (!r.clean) continue;
              if (!slopeOk(r.a, r.pa, r.b, r.pb)) break;                         // too flat: Line 1 starts at C1
              made = true;
              if (q1 === 'major') momFrom(r, j, b);                               // Q1 major: Line 1 is labelled momentum
              else born(mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, j, b, s ? 'g1-shift' : 'g1'), j);
            }
          } else { momFrom(build(e.bar, b, j), j, b); }                           // Q1 retrace: E -> C1 = momentum
        }
        if (!made || q1 === 'major') {
          // Line 1 from C1 (or C2 by Q2): the counter-pivots already known after C1 come first
          wait = { a: sideP.find(x => x.bar === b)!, skip: Math.max(0, skip0 - 1) };
          const known = sideP.filter(x => x.bar < b && x.conf >= j).sort((x, y) => y.bar - x.bar);
          for (const p of known) {
            if (!wait || live) break;
            if (out(wait.a.p, p.p)) { if (wait.skip > 0) wait = { a: p, skip: wait.skip - 1 }; else { const w = wait; wait = null; if (!lineFrom(w.a, p, j, 'c1')) wait = { a: p, skip: 0 }; } }
            else wait = null;
          }
        } else wait = null;
      }
    }
    return confirmed;
  };
  const sp1 = (b: number) => X(b);
  const endStructure = () => {             // the other direction confirmed a structure: this one is over
    wait = null; chainR = -1; majorE = null; major = null;
    if (live) { orphans.push(live); live = null; }
  };
  return { d, hist, step, endStructure };
}

/** The forward-time line machine (owner 2026-10-30: lines are built forward in time, as a trader draws them live; once
 *  pivot 2 is confirmed the line is fixed and its first close beyond breaks it). sw = the line swings (zmPivots at the line
 *  scale). A side swing s (a lower high for down lines) is confirmed when price trades beyond the opposite extreme between
 *  it and the nearest further-out swing before it (Kevin L5); at that bar, in order: (1) after a break, the chain from the
 *  broken line's anchor-2 swing; (2) while a line is live, the nested line from the live line's anchor-2 swing (owner
 *  chaining: the next line starts at the previous pivot 2); (3) the waiting Line 1 from a counter swing; (4) a new
 *  structure: Line 1 from the local extreme (clean with p1Shift, hull touch up to the confirmation, too flat or cut -> wait
 *  for the next swing). Breaks: the first close beyond (the fake-cross veto only for a close within vetoClose ATR). */
function zmDirF(S: Series, sw: ZmPivot[], d: number, k: ZmParams, atr: (i: number) => number): ZmDir {
  const C = S.C;
  const X = (j: number) => (d > 0 ? S.L[j] : S.H[j]), Y = (j: number) => (d > 0 ? S.H[j] : S.L[j]);
  const out = (x: number, y: number) => (d > 0 ? x < y : x > y);
  const beyond = (t: ZmLine, j: number) => (d > 0 ? C[j] < zmAt(t, j) : C[j] > zmAt(t, j));
  const hist: ZmLine[] = [];
  const side = sw.filter(p => p.t === -d && p.conf >= 0).sort((a, b) => b.bar - a.bar);    // oldest first
  const htf = HTF_RANGE.includes(S.tf);
  if (k.bosN > 0 && htf) {
    // H1 (2.18, W1 / MN / 3M): after each real side pivot V, the first bosN-bar swing of the other side (a peak for up lines)
    // and the first leg-direction departure candle that CLOSES beyond it; when that candle launches the leg (the candle
    // before it is no leg-direction departure) and no real pivot lies between, its low is a line swing confirmed at itself
    const N = k.bosN, real = side.slice();
    const sw2 = (i: number) => { if (i + N >= S.n - 1 || i - N < 1) return false; for (let h = 1; h <= N; h++) if (out(Y(i), Y(i - h)) || out(Y(i), Y(i + h))) return false; return true; };
    const dep = (j: number) => S.cdir(j) === d && !S.basing(j);
    for (const V of real) {
      let hb = -1, kk = -1;
      for (let j = V.bar - 1; j >= 1 && kk < 0; j--) {
        if (j + N < V.bar && sw2(j + N)) hb = j + N;                       // a swing confirmed at bar j (N bars after it)
        if (hb >= 0 && j < hb && dep(j) && (d > 0 ? C[j] > Y(hb) : C[j] < Y(hb))) kk = j;
      }
      if (kk < 0 || (kk + 1 < V.bar && dep(kk + 1)) || real.some(p => p.bar < V.bar && p.bar > kk)) continue;
      if (!out(V.p, X(kk)) || side.some(p => p.bar === kk)) continue;
      side.push({ bar: kk, p: X(kk), t: -d, conf: kk });
    }
    side.sort((a, b) => b.bar - a.bar);
  }
  // Kevin's confirmation of each side swing: the bar price trades beyond the opposite extreme between it and s0
  const ev: { s: ZmPivot; s0: ZmPivot; e: number }[] = [];
  for (let i = 1; i < side.length; i++) {
    const s = side[i];
    let s0: ZmPivot | null = null;
    for (let h = i - 1; h >= 0; h--) if (out(side[h].p, s.p)) { s0 = side[h]; break; }
    if (!s0 || s0.bar - s.bar < 2) continue;                        // no bar between: no opposite swing to break
    let ox = Y(s0.bar - 1);
    for (let j = s0.bar - 1; j > s.bar; j--) ox = d > 0 ? Math.max(ox, Y(j)) : Math.min(ox, Y(j));
    let kb = -1;
    const thru = (j: number) => (d > 0 ? Y(j) > ox : Y(j) < ox);
    // the swing's own candle counts when its line-side extreme comes first (bullish candle: low, then high)
    if ((d > 0 ? C[s.bar] >= S.O[s.bar] : C[s.bar] < S.O[s.bar]) && thru(s.bar)) kb = s.bar;
    for (let j = s.bar - 1; j >= 1 && kb < 0; j--) if (thru(j)) { kb = j; break; }
    if (kb < 0) continue;
    ev.push({ s, s0, e: Math.min(kb, s.conf) });
  }
  ev.sort((a, b) => b.e - a.e || b.s.bar - a.s.bar);
  const slopeOk = (a: number, pa: number, b: number, pb: number) => {
    const ab = atr(b), rise = d * (pb - pa);
    return rise > 0 && rise >= k.minRise * ab && rise / Math.max(1, a - b) >= k.minSlope * ab;
  };
  const build = (a: number, b: number, to: number, tol = 0) => {
    const pa = X(a);
    let bb = b, sl = (X(b) - pa) / (a - b), poke = false;
    for (let j = b - 1; j >= to; j--) if (d * (pa + sl * (a - j) - X(j)) > k.fitTol * atr(j)) poke = true;
    if (poke) for (let j = b - 1; j >= to; j--) { const s2 = (X(j) - pa) / (a - j); if (d > 0 ? s2 < sl : s2 > sl) { sl = s2; bb = j; } }
    const pb = X(bb);
    let clean = true;
    for (let j = a - 1; j > bb; j--) if (d * (pa + ((pb - pa) / (a - bb)) * (a - j) - X(j)) > (tol > 0 ? tol * atr(j) : 1e-9 * Math.abs(pa))) { clean = false; break; }
    return { a, b: bb, pa, pb, clean };
  };
  // anchor-1 candidates for a line from bar a to swing bar sb, in order, each with its clean tolerance (0 = strict):
  // a .. a - p1Shift; then (2.18 H1 p1Low, W1 / MN / 3M, Line 1 from a local extreme only) a and the first higher low after
  // it (the line-side extreme strictly between), clean within fitTol ATR
  const p1Low = k.p1Low > 0 && htf;
  const cands = (a: number, sb: number, ext: boolean): [number, number][] => {
    const out2: [number, number][] = [];
    for (let sh = 0; sh <= k.p1Shift && a - sh > sb; sh++) out2.push([a - sh, 0]);
    if (ext && p1Low && a - 1 > sb) {
      let lo = a - 1;
      for (let c = a - 1; c > sb; c--) if (out(X(c), X(lo))) lo = c;
      out2.push([a, k.fitTol], [lo, k.fitTol]);
    }
    return out2;
  };
  const slope = (t: { a: number; b: number; pa: number; pb: number }) => (t.pb - t.pa) / Math.max(1, t.a - t.b);
  // the fake-cross veto (1.7), only for a close within vetoClose ATR of the line
  const sideAll = sw.filter(p => p.t === -d);
  const veto = (t: ZmLine, kk: number): boolean => {
    if (kk - 1 < 1 || d * (zmAt(t, kk) - C[kk]) > k.vetoClose * atr(kk)) return false;
    const back = d > 0 ? C[kk - 1] >= zmAt(t, kk - 1) - k.vetoTol * atr(kk - 1) : C[kk - 1] <= zmAt(t, kk - 1) + k.vetoTol * atr(kk - 1);
    if (!back) return false;
    let pv = -1;
    for (const p of sideAll) if ((p.bar === kk || p.bar === kk - 1) && d * (zmAt(t, p.bar) - p.p) > 0) { pv = p.bar; break; }
    if (pv < 0) return false;
    let ex = Y(t.a);
    for (let j = t.a - 1; j > kk; j--) ex = d > 0 ? Math.max(ex, Y(j)) : Math.min(ex, Y(j));
    const r = build(t.a, pv, pv);
    const rl = mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, 0, pv, 'rot');
    for (let h = kk - 1; h >= Math.max(1, kk - k.vetoBars); h--) {
      if (h < rl.b && beyond(rl, h)) return false;
      if (d > 0 ? Y(h) > ex : Y(h) < ex) { t.b = rl.b; t.pb = rl.pb; t.p2 = pv; t.why = 'rot'; t.touches++; return true; }
    }
    return false;
  };
  let live: ZmLine[] = [];
  const orphans: ZmLine[] = [];
  const third = new Map<ZmLine, ZmPivot>();              // a live line's 3rd touch: pivot 1 of the next, flatter line
  let chain: { bar: number; p: number; brk: number } | null = null, wait: ZmPivot | null = null;
  const broke = (t: ZmLine, x: number) => {
    t.brokenAt = x;
    const i = live.indexOf(t);
    if (i >= 0) { live.splice(i, 1); chain = { bar: t.p2, p: X(t.p2), brk: x }; }
  };
  const born = (t: ZmLine, j: number) => {
    if (hist.some(h => h.a === t.a && h.b === t.b)) return;            // the same line already drawn
    hist.push(t);
    for (let x = t.b - 1; x >= j; x--) if (beyond(t, x) && !veto(t, x)) { t.brokenAt = x; chain = { bar: t.p2, p: X(t.p2), brk: x }; return; }
    live.push(t);
  };
  // a line from bar a (or p1Shift bars after it, the first clean one) to swing s, anchor 2 at the hull touch up to j
  const lineFrom = (a: number, s: ZmPivot, j: number, why: string, steeperThan: ZmLine | null = null) => {
    for (const [aa, tl] of cands(a, s.bar, why === 'g1' || why === 'inner')) {
      const r = build(aa, s.bar, j, tl);
      if (!r.clean) continue;
      if (!slopeOk(r.a, r.pa, r.b, r.pb)) return false;
      if (steeperThan && !(d > 0 ? slope(r) > slope(steeperThan) : slope(r) < slope(steeperThan))) return false;
      if (hist.some(t => t.a === r.a && t.b === r.b)) return true;      // the same line already drawn
      born(mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, j, s.bar, aa !== a ? `${why}-shift` : why), j);
      return true;
    }
    return false;
  };
  let ei = 0;
  const step = (j: number): boolean => {
    let confirmed = false;
    for (const t of [...live]) {
      if (j >= t.b) continue;
      if (beyond(t, j)) { if (!veto(t, j)) broke(t, j); }
      else if (d * (zmAt(t, j) - X(j)) > -k.fitTol * atr(j)) t.touches++;
    }
    for (const o of orphans) if (o.brokenAt < 0 && j < o.b && beyond(o, j) && !veto(o, j)) o.brokenAt = j;
    for (; ei < ev.length && ev[ei].e >= j; ei++) {
      const { s, s0 } = ev[ei];
      if (chain && !out(chain.p, s.p)) chain = null;                  // a swing at / beyond the chain anchor ends the chain
      if (wait && !out(wait.p, s.p)) wait = null;
      if (chain && s.bar <= chain.brk) {                               // (1) after a break: chain from the broken anchor 2
        const c = chain; chain = null;
        if (lineFrom(c.bar, s, j, 'chain')) continue;
        if (s0.bar < c.bar && lineFrom(s0.bar, s, j, 'g1')) continue;   // cut by a newer swing: from that swing
        wait = s; continue;
      }
      const L = live.length ? live.reduce((a, b) => (b.born < a.born ? b : a)) : null;
      const gap = L ? d * (s.p - zmAt(L, s.bar)) : 0;                   // > 0: inside the live line
      if (L && s.bar < L.b && gap < k.touchTol * atr(s.bar)) {           // a touch of the live line (or a wick through it)
        if (!third.has(L)) third.set(L, s);
        continue;
      }
      if (L && s.bar < L.b && gap > 0) {
        const t3 = third.get(L);                                         // (2a) after a 3rd touch: the next, flatter line from it
        if (t3 && s.bar < t3.bar && lineFrom(t3.bar, s, j, 'touch3')) { third.delete(L); continue; }
        if (gap >= k.nestGap * atr(s.bar) && lineFrom(L.p2, s, j, 'nest', L)) continue;   // (2b) nested: from the anchor-2 swing
        if (s0.bar < L.b && lineFrom(s0.bar, s, j, 'inner')) continue;   // a new local structure inside the live line
        continue;
      }
      if (L) continue;
      if (wait && s.bar < wait.bar) {                                  // (3) Line 1 from a counter swing
        const w = wait; wait = null;
        if (lineFrom(w.bar, s, j, 'c1')) continue;
        if (s0.bar < w.bar && lineFrom(s0.bar, s, j, 'g1')) continue;
        wait = s; continue;
      }
      // (4) a new structure from the local extreme s0
      let made = false;
      for (const [a, tl] of cands(s0.bar, s.bar, true)) {
        const r = build(a, s.bar, j, tl);
        if (!r.clean) continue;
        if (!slopeOk(r.a, r.pa, r.b, r.pb)) break;
        born(mkLine(d, 'trend', r.a, r.b, r.pa, r.pb, j, s.bar, a !== s0.bar ? 'g1-shift' : 'g1'), j);
        made = true;
        break;
      }
      if (!made) wait = s;
      confirmed = true;
    }
    return confirmed;
  };
  const endStructure = () => { wait = null; chain = null; for (const t of live) orphans.push(t); live = []; };
  return { d, hist, step, endStructure };
}

/** Both directions' trend lines over all bars (SPEC 2.2), oldest bar first. */
export function zmTrendLines(S: Series, piv: ZmPivot[], k: ZmParams, q1: ZmQ1, q2: ZmQ2, atr = zmAtr(S)): { up: ZmLine[]; dn: ZmLine[] } {
  const U = k.lineMode ? zmDirF(S, piv, 1, k, atr) : zmDir(S, piv, 1, k, q1, q2, atr), D = k.lineMode ? zmDirF(S, piv, -1, k, atr) : zmDir(S, piv, -1, k, q1, q2, atr);
  for (let j = S.n - 2; j >= 1; j--) {
    const u = U.step(j), dn = D.step(j);
    if (u) D.endStructure();
    if (dn) U.endStructure();
  }
  return { up: U.hist, dn: D.hist };
}

/** Trend lines (both directions) + every momentum line, newest anchor first; up / dn = the live lines, upX / dnX = the
 *  newest broken ones. */
export function zmLines(S: Series, piv: ZmPivot[], k: ZmParams, q1: ZmQ1, q2: ZmQ2, atr = zmAtr(S)) {
  const { up, dn } = zmTrendLines(S, piv, k, q1, q2, atr);
  const mom: ZmLine[] = [];
  for (let i = 0; i < piv.length; i++) for (const m of zmMomentumAll(S, piv, i, k, atr)) mom.push(m);
  // the live main line of the newest structure (orphans of an ended structure come after it; nested lines after the main)
  const live = (ls: ZmLine[]) => zmMainLine(ls, ls[0]?.dir ?? 1);
  const brk = (ls: ZmLine[]) => ls.filter(t => t.kind === 'trend' && t.brokenAt >= 0).sort((x, y) => x.brokenAt - y.brokenAt)[0] ?? null;
  const lines = [...up, ...dn, ...mom].sort((x, y) => y.a - x.a || y.b - x.b || x.dir - y.dir);
  return { lines, up: live(up), dn: live(dn), upX: brk(up), dnX: brk(dn), mom: [...mom, ...up, ...dn].filter(t => t.kind === 'momentum').sort((x, y) => x.a - y.a) };
}

/** A line drawn inside a live line of its structure (nested / inner / 3rd-touch): the structure's main line is the other. */
export const zmInner = (t: ZmLine) => /^(nest|inner|touch3)/.test(t.why);
/** The live main trend line of direction d (the newest structure's line, not one nested inside it). */
export function zmMainLine(lines: ZmLine[], d: number): ZmLine | null {
  const live = lines.filter(l => l.kind === 'trend' && l.dir === d && l.brokenAt < 0).sort((x, y) => x.born - y.born);
  return live.find(l => !zmInner(l)) ?? live[0] ?? null;
}

/** SPEC 3: a live swing line price left >= 30 bars ago and >= 3 ATR away is stale (hidden; the target line never is). */
export function zmStale(S: Series, t: ZmLine, atr: (i: number) => number): boolean {
  if (t.brokenAt >= 0) return false;
  for (let j = 1; j <= Math.min(30, t.b - 1); j++) {
    const x = t.dir > 0 ? S.L[j] : S.H[j];
    if (Math.abs(x - zmAt(t, j)) < 3 * atr(j)) return false;
  }
  return t.b > 30;
}

// ---- 4. zones (SPEC 1.10) ---------------------------------------------------------------------------------------------
const HTF_RANGE = ['W1', 'MN', '3M'];
/** The TF's zones: zonecore bases (FX rules) + HTF range bases, each with pattern, strong / arrival, touches, removal. */
export function zmZones(S: Series, lines: ZmLine[], piv: ZmPivot[], k: ZmParams, atr: (i: number) => number): ZmZone[] {
  const zs: ZmZone[] = [];
  const base = S.n > 12 && S.atr(1) > 0 ? detect(S, FX_PARAMS) : [];
  for (const z of base) {
    zs.push({ dir: z.dir, prox: z.prox, dist: z.dist, base0: z.legBar + 1, base1: z.legBar + z.baseN, legBar: z.legBar,
      pattern: (z as Zone).dir > 0 ? (z.cont ? 'RBR' : 'DBR') : (z.cont ? 'DBD' : 'RBD'), range: false, strong: false, arrival: false,
      touches: zoneTests(S, z, FX_PARAMS).n, removed: z.removed, removedBar: z.removed ? z.removedBar : -1, reasons: [], removedIds: [], brokePivot: -1 });
  }
  if (HTF_RANGE.includes(S.tf)) {
    // a sideways run of 3..rangeBaseMax candles whose bodies stay in a band <= rangeBaseATR ATR, left by a close beyond the
    // band's far side (demand: above its top); box = the bodies (proximal = the band edge the leg left from)
    let lastL = -1;
    for (let L = S.n - 2; L >= 1; L--) {
      for (const d of [1, -1]) {
        let top = -Infinity, bot = Infinity, cnt = 0;
        for (let i = L + 1; i < S.n - 1 && cnt < k.rangeBaseMax; i++) {
          const t2 = Math.max(top, S.O[i], S.C[i]), b2 = Math.min(bot, S.O[i], S.C[i]);
          if (t2 - b2 > k.rangeBaseATR * atr(L + 1)) break;
          top = t2; bot = b2; cnt++;
        }
        if (cnt < 3) continue;
        if (!(d > 0 ? S.C[L] > top && S.C[L + 1] <= top : S.C[L] < bot && S.C[L + 1] >= bot)) continue;
        if (L === lastL) continue;
        const z: ZmZone = { dir: d, prox: d > 0 ? top : bot, dist: d > 0 ? bot : top, base0: L + 1, base1: L + cnt, legBar: L,
          pattern: d > 0 ? (S.cdir(L + cnt + 1) > 0 ? 'RBR' : 'DBR') : (S.cdir(L + cnt + 1) < 0 ? 'DBD' : 'RBD'), range: true,
          strong: false, arrival: false, touches: 0, removed: false, removedBar: -1, reasons: [], removedIds: [], brokePivot: -1 };
        let away = true, inT = false;
        for (let j = L - 1; j >= 1; j--) {
          if (d > 0 ? S.C[j] < z.dist : S.C[j] > z.dist) { z.removed = true; z.removedBar = j; break; }
          const touch = d > 0 ? S.L[j] <= z.prox : S.H[j] >= z.prox;
          if (touch) { if (!inT && away) { z.touches++; inT = true; away = false; } } else { away = true; inT = false; }
        }
        zs.push(z); lastL = L;
      }
    }
  }
  if (k.pivZones) {
    // owner 2026-10-30: pivots come from reversal zones (RBD = the actual peak, DBR = the proper valley): each real pivot's
    // candle is a zone (proximal = its body edge, distal = its wick) unless a detected base already covers that candle
    for (const p of piv) {
      const b = p.bar, d = -p.t;
      if (b < 2 || p.conf < 0) continue;
      if (k.pivZones !== 3 && zs.some(z => z.dir === d && z.base1 >= b && z.base0 <= b)) continue;
      let b0 = b, b1 = b;                                   // pivZones 2: + the basing candles around it (the turn)
      if (k.pivZones === 3 && !S.basing(b) && S.cdir(b) === -d) {
        // H3 (2.18): the pivot candle is the last leg-in candle (a departure INTO the extreme: bearish into a valley): the
        // zone is the basing candle(s) after it, before the leg-out (none: the pivot candle, as pivZones 2)
        let e = b;
        while (e - 1 >= 2 && S.basing(e - 1) && b - e < 6) e--;
        if (e < b) { b0 = e; b1 = b - 1; }
      } else if (k.pivZones > 1) { while (b1 + 1 < S.n - 1 && S.basing(b1 + 1) && b1 - b0 < 5) b1++; while (b0 - 1 >= 2 && S.basing(b0 - 1) && b1 - b0 < 5) b0--; }
      if (k.pivZones === 3 && zs.some(z => z.dir === d && !z.range && z.base1 >= b1 && z.base0 <= b0)) continue;   // H3: a detected base holds it
      let prox = d > 0 ? -Infinity : Infinity;
      for (let i = b0; i <= b1; i++) prox = d > 0 ? Math.max(prox, S.O[i], S.C[i]) : Math.min(prox, S.O[i], S.C[i]);
      let dist = d > 0 ? S.L[b] : S.H[b];
      if (k.pivZones === 3) { dist = d > 0 ? Infinity : -Infinity; for (let i = b0; i <= b1; i++) dist = d > 0 ? Math.min(dist, S.L[i]) : Math.max(dist, S.H[i]); }
      if (Math.abs(prox - dist) <= 0) continue;
      const z: ZmZone = { dir: d, prox, dist, base0: b0, base1: b1, legBar: b0 - 1, pattern: d > 0 ? 'DBR' : 'RBD', range: false, strong: false,
        arrival: false, touches: 0, removed: false, removedBar: -1, reasons: [], removedIds: [], brokePivot: -1, pivot: true };
      let away = false, inT = false;
      for (let j = b0 - 1; j >= 1; j--) {
        if (d > 0 ? S.C[j] < z.dist : S.C[j] > z.dist) { z.removed = true; z.removedBar = j; break; }
        const touch = d > 0 ? S.L[j] <= z.prox : S.H[j] >= z.prox;
        if (touch) { if (!inT && away) { z.touches++; inT = true; away = false; } } else { away = true; inT = false; }
      }
      zs.push(z);
    }
  }
  zmReasons(S, zs, lines, piv, k);
  return zs.sort((a, b) => b.legBar - a.legBar);
}

// ---- 5. trend state (SPEC 1.9) ----------------------------------------------------------------------------------------
export function zmTrendState(S: Series, piv: ZmPivot[]): ZmTrend {
  const conf = piv.filter(p => p.conf >= 0).sort((a, b) => b.conf - a.conf || b.bar - a.bar);
  const st: ZmTrend = { trend: 0, ext: 0, extBar: -1, sl: 0, slBar: -1, lo: 0, hi: 0, from: 0 };
  let tr = 0, broke = false, beyondSl = false;
  let ext: ZmPivot | null = null, sl: ZmPivot | null = null;
  const seen: ZmPivot[] = [];
  const lastBefore = (t: number, bar: number) => { for (let i = seen.length - 1; i >= 0; i--) if (seen[i].t === t && seen[i].bar > bar) return seen[i]; return null; };
  let ci = 0;
  for (let j = S.n - 2; j >= 1; j--) {
    for (; ci < conf.length && conf[ci].conf >= j; ci++) {
      const p = conf[ci];
      seen.push(p); seen.sort((a, b) => b.bar - a.bar);
      if (tr === 0) {                                     // HH + HL -> UP, LL + LH -> DOWN
        const pk = seen.filter(x => x.t > 0), vl = seen.filter(x => x.t < 0);
        if (pk.length >= 2 && vl.length >= 2) {
          const [p1, p0] = pk.slice(-2), [v1, v0] = vl.slice(-2);
          if (p0.p > p1.p && v0.p > v1.p && p.t > 0) { tr = 1; ext = p; sl = lastBefore(-1, p.bar); broke = false; beyondSl = false; }
          else if (p0.p < p1.p && v0.p < v1.p && p.t < 0) { tr = -1; ext = p; sl = lastBefore(1, p.bar); broke = false; beyondSl = false; }
        }
        continue;
      }
      const d = tr;
      if (p.t === d && (d > 0 ? p.p > ext!.p : p.p < ext!.p)) {          // a new HHH (LLL): the trend goes on / resumes
        ext = p; sl = lastBefore(-d, p.bar); broke = false; beyondSl = false;
        continue;
      }
      if (broke && p.t === -d && sl && (d > 0 ? p.p < sl.p : p.p > sl.p)) beyondSl = true;   // a valley below SL
      if (broke && beyondSl && p.t === d && (d > 0 ? p.p < ext!.p : p.p > ext!.p)) {        // + a lower high: DOWN
        let lll: ZmPivot | null = null;
        for (const x of seen) if (x.t === -d && x.bar > p.bar && x.bar < ext!.bar && (!lll || (d > 0 ? x.p < lll.p : x.p > lll.p))) lll = x;
        if (!lll) continue;
        tr = -d; ext = lll; sl = lastBefore(d, lll.bar) ?? p; broke = false; beyondSl = false;
        zmDebug.log?.(`st flip ${S.T[j]} -> ${tr} ext ${ext?.p} sl ${sl?.p}`);
      }
    }
    if (tr !== 0 && !broke && sl && (tr > 0 ? S.C[j] < sl.p : S.C[j] > sl.p)) { broke = true; zmDebug.log?.(`st broke ${S.T[j]} tr ${tr} sl ${sl.p}`); }
  }
  st.from = tr;
  if (tr === 0 || !ext || !sl) return st;
  st.ext = ext.p; st.extBar = ext.bar; st.sl = sl.p; st.slBar = sl.bar;
  const lo = Math.min(ext.p, sl.p), hi = Math.max(ext.p, sl.p);
  if (broke) { st.trend = 0; st.lo = lo; st.hi = hi; return st; }
  // SIDEWAYS without a break: a counter-pivot after the extreme, the newest same-side pivot still inside, and both the
  // zone at the extreme and the zone at SL used again since the extreme (price runs between two used zones)
  const after = conf.filter(p => p.bar < ext!.bar);
  const extZone = tr > 0 ? Math.min(S.O[ext.bar], S.C[ext.bar]) : Math.max(S.O[ext.bar], S.C[ext.bar]);
  const slZone = tr > 0 ? Math.max(S.O[sl.bar], S.C[sl.bar]) : Math.min(S.O[sl.bar], S.C[sl.bar]);
  const lh = after.some(p => p.t === tr);
  const reExt = after.some(p => p.t === tr && (tr > 0 ? p.p >= extZone : p.p <= extZone));       // a lower high into the top zone
  const reSl = after.some(p => p.t === -tr && (tr > 0 ? p.p <= slZone : p.p >= slZone));          // a low back into the SL zone
  st.trend = lh && reExt && reSl ? 0 : tr;
  if (st.trend === 0) { st.lo = lo; st.hi = hi; }
  return st;
}

// ---- one TF ---------------------------------------------------------------------------------------------------------
export const ZM_CHAIN = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'] as const;
export const zmDigits = (price: number) => (price >= 500 ? 2 : price >= 20 ? 3 : 5);
/** The full reading of one TF from its closed bars (oldest first) and the live price. */
export function zmTf(bars: ZBarLike[], tf: string, price: number | null = null, o: ZmOpts = {}, digits?: number): ZmTf {
  const k: ZmParams = { ...ZM, ...(o.params ?? {}) }, q1 = o.q1 ?? ZM_DEFAULTS.q1, q2 = o.q2 ?? ZM_DEFAULTS.q2;
  const S = new Series(bars, price, tf), atr = zmAtr(S);
  const piv = zmPivots(S, k, atr);
  const L = zmLines(S, piv, k, q1, q2, atr);
  const zones = zmZones(S, L.lines, piv, k, atr);
  const st = zmTrendState(S, piv);
  const last = piv[piv.length - 1];
  return { tf, digits: digits ?? zmDigits(S.price), n: S.n - 1, last: S.T[1] ?? '', price: S.price, pivots: piv, lines: L.lines,
    up: L.up, dn: L.dn, upX: L.upX, dnX: L.dnX, mom: L.mom, zones, st, leg: last ? last.t : 0, S } as ZmTf & { S: Series };
}
export interface ZBarLike { d: string; o: number; h: number; l: number; c: number }

// ---- top-down (SPEC 2.5 - 2.7) ----------------------------------------------------------------------------------------
export interface ZmInput {
  sym: string; chart: string;                       // chart = one of ZM_CHAIN (other TFs: the nearest standard TF)
  bars: Partial<Record<string, ZBarLike[]>>;        // closed bars per TF, oldest first ('3M' optional: built from MN)
  price?: number | null; digits?: number; opts?: ZmOpts;
}
const trendName = (t: number): ZmTrendName => (t > 0 ? 'UP' : t < 0 ? 'DOWN' : 'SIDEWAYS');
const fmt = (v: number, dg: number) => v.toFixed(dg);
const zLo = (z: ZmZone) => Math.min(z.prox, z.dist), zHi = (z: ZmZone) => Math.max(z.prox, z.dist);
const zGap = (v: number, z: ZmZone) => (v < zLo(z) ? zLo(z) - v : v > zHi(z) ? v - zHi(z) : 0);
/** The chain from 3M down to the chart TF (SPEC 2: always the whole chain). */
export const zmChainOf = (chart: string): string[] => { const i = ZM_CHAIN.indexOf(chart as typeof ZM_CHAIN[number]); return ZM_CHAIN.slice(0, i < 0 ? ZM_CHAIN.length : i + 1) as string[]; };

/** The realignment target of the correcting TF C with parent P (SPEC 1.11). */
export function zmTarget(c: ZmTf, p: ZmTf, k: ZmParams = ZM): ZmTarget | null {
  const dirP = p.st.trend;
  if (dirP === 0) return null;
  const cS = (c as ZmTf & { S: Series }).S, atrC = zmAtr(cS)(1);
  const ok = (z: ZmZone) => z.dir === dirP && !z.removed && z.touches <= 1;
  // the P-direction line of the parent's current impulse: the oldest live line of C anchored at / after P's structure low
  // (SL, the pivot that launched P's extreme), else the main live line (owner: the long W1 up line under the MN impulse)
  const pS = (p as ZmTf & { S: Series }).S, slT = p.st.slBar >= 0 ? pS.T[p.st.slBar] : '';
  const liveP = (t: ZmTf) => {
    const tS = (t as ZmTf & { S: Series }).S;
    const own = t.lines.filter(l => l.kind === 'trend' && l.dir === dirP && l.brokenAt < 0 && slT !== '' && tS.T[l.a] >= slT).sort((x, y) => y.born - x.born);
    return own[0] ?? zmMainLine(t.lines, dirP);
  };
  for (const lt of [c, p]) {
    const line = liveP(lt);
    if (!line) continue;
    const v = zmAt(line, 0);
    for (const zt of [c, p]) {
      const zs = zt.zones.filter(ok);
      const inside = zs.filter(z => zGap(v, z) === 0).sort((a, b) => (zHi(a) - zLo(a)) - (zHi(b) - zLo(b)))[0];
      if (inside) return { tf: zt.tf, zone: inside, lineTf: lt.tf, line, value: v, why: 'line' };
    }
    for (const zt of [c, p]) {
      const near = zt.zones.filter(ok).filter(z => zGap(v, z) <= k.targetGap * atrC).sort((a, b) => zGap(v, a) - zGap(v, b))[0];
      if (near) return { tf: zt.tf, zone: near, lineTf: lt.tf, line, value: v, why: 'near line' };
    }
  }
  // no P-direction line: the C zone at C's structure low (UP parent) / high: the nearest P-side zone beyond price
  const px = c.price;
  const zs = c.zones.filter(ok).filter(z => (dirP > 0 ? zHi(z) <= px : zLo(z) >= px)).sort((a, b) => zGap(px, a) - zGap(px, b));
  return zs.length ? { tf: c.tf, zone: zs[0], lineTf: '', line: null, value: NaN, why: 'structure' } : null;
}

/** The ONE top-down model of a symbol (SPEC 2.5 - 2.7): every chart TF of the symbol prints the same DIRECTION. */
export function zmModel(inp: ZmInput): ZmModel {
  // the WHOLE chain is read on every chart (one DIRECTION per symbol, I2); STRUCTURE prints it down to the chart TF
  const o = inp.opts ?? {}, k: ZmParams = { ...ZM, ...(o.params ?? {}) };
  const chain = zmChainOf(inp.bars.M15 && inp.bars.M15.length >= 20 ? 'M15' : 'H1');
  const shown = zmChainOf(inp.chart);
  const bars = { ...inp.bars };
  if (!bars['3M'] && bars.MN) bars['3M'] = toQuarters(bars.MN);
  const missing: string[] = [];
  const tfs: ZmTf[] = [];
  const chartBars = bars[inp.chart] ?? [];
  const price = inp.price ?? (chartBars.length ? chartBars[chartBars.length - 1].c : null);
  const dg = inp.digits ?? zmDigits(price ?? 1);
  for (const tf of chain) {
    const b = bars[tf];
    if (!b || b.length < 20) { if (shown.includes(tf)) missing.push(tf); continue; }
    tfs.push(zmTf(b, tf, price, o, dg));
  }
  const phases: ZmPhase[] = tfs.map((t, i) => {
    const par = i === 0 ? t : tfs[i - 1];
    const pt = par.st.trend;
    const phase = pt === 0 ? 'range' : t.leg === pt ? 'impulse' : 'correction';
    return { tf: t.tf, trend: trendName(t.st.trend), leg: t.leg, phase, parent: par.tf };
  });
  const B = tfs.find(t => t.st.trend !== 0) ?? null;
  const bi = B ? tfs.indexOf(B) : -1;
  // S: the highest SIDEWAYS TF between B and the lowest TF of the chain (an H1 range never overrides the HTF reading)
  const inner = tfs.slice(bi + 1, Math.max(bi + 1, tfs.length - 1));
  const Sd = bi >= 0 ? inner.find(t => t.st.trend === 0) ?? null : null;
  let ci = -1;
  for (let i = 1; i < tfs.length; i++) if (tfs[i].st.trend !== 0 && tfs[i - 1].st.trend !== 0 && tfs[i].st.trend !== tfs[i - 1].st.trend) { ci = i; break; }
  if (ci < 0) for (let i = 1; i < tfs.length; i++) if (phases[i].phase === 'correction') { ci = i; break; }
  const C = ci >= 1 ? tfs[ci] : null, Pp = ci >= 1 ? tfs[ci - 1] : null;
  const target = C && Pp ? zmTarget(C, Pp, k) : null;
  const bias = Sd ? 0 : B ? B.st.trend : 0;
  // 2.6 allowed side per TF
  const allowed: Record<string, number> = {};
  const inTarget = !!target && zGap(price ?? 0, target.zone) === 0;
  for (let i = 0; i < tfs.length; i++) {
    const t = tfs[i];
    let side = 0;
    if (/XAU/.test(inp.sym) && (t.tf === 'M15')) side = 0;
    else if (Sd && i > tfs.indexOf(Sd)) side = 0;              // zone to zone only (no directional side)
    else if (C && i >= ci) side = inTarget ? 0 : phases[i].phase === 'impulse' ? C.st.trend : 0;
    else if (!C && bias !== 0 && phases[i].phase === 'impulse') side = bias;
    allowed[t.tf] = side;
  }
  // A. STRUCTURE
  const seg = (t: ZmTf, i: number) => {
    const ph = phases[i];
    if (t.st.trend === 0) return `${t.tf} SIDEWAYS ${fmt(t.st.lo, dg)}-${fmt(t.st.hi, dg)}`;
    const w = ph.phase === 'range' ? `in ${ph.parent} range` : ph.phase;
    const arrow = i === ci && target ? ` -> ${fmt(zLo(target.zone), dg)}-${fmt(zHi(target.zone), dg)}` : '';
    return `${t.tf} ${ph.trend} ${w}${arrow}`;
  };
  const structure = tfs.map((t, i) => (shown.includes(t.tf) ? seg(t, i) : '')).filter(Boolean)
    .concat(missing.filter(m => shown.includes(m)).map(m => `${m} loading`)).join('  |  ');
  // B. DIRECTION
  const names = (ls: ZmTf[]) => ls.map(t => t.tf).join('/');
  const up: ZmTf[] = [];                                    // the contiguous block of TFs from B that share its trend
  for (let i = Math.max(bi, 0); i < tfs.length && bias !== 0 && tfs[i].st.trend === bias; i++) up.push(tfs[i]);
  const word = bias > 0 ? 'LONG' : bias < 0 ? 'SHORT' : 'NONE';
  const biasTxt = Sd ? `NONE (${Sd.tf} sideways ${fmt(Sd.st.lo, dg)}-${fmt(Sd.st.hi, dg)})` : B ? `${word} (${names(up.length ? up : [B])} ${bias > 0 ? 'up' : 'down'})` : 'NONE (no trend)';
  let now = '', tgt = '-', then = '-', flip = '-';
  const buy = (d: number) => (d > 0 ? 'BUY' : 'SELL');
  if (Sd) {
    const si = tfs.indexOf(Sd), ltf = tfs.slice(si + 1).filter(t => !(/XAU/.test(inp.sym) && t.tf === 'M15'));
    now = `WAIT - zone to zone on ${names(ltf) || Sd.tf} only`;
    const below = Sd.zones.filter(z => z.dir > 0 && !z.removed && zHi(z) < Sd.st.lo).sort((a, b) => zHi(b) - zHi(a))[0];
    const above = Sd.zones.filter(z => z.dir < 0 && !z.removed && zLo(z) > Sd.st.hi).sort((a, b) => zLo(a) - zLo(b))[0];
    then = `${Sd.tf} close < ${fmt(Sd.st.lo, dg)} -> SELL${below ? ` to ${fmt(zHi(below), dg)} (WOW)` : ''}; ${Sd.tf} close > ${fmt(Sd.st.hi, dg)} -> BUY${above ? ` to ${fmt(zLo(above), dg)} (WOW)` : ''}`;
    flip = `a ${Sd.tf} close outside ${fmt(Sd.st.lo, dg)}-${fmt(Sd.st.hi, dg)}`;
  } else if (C && target) {
    const z = target.zone, cd = C.st.trend;
    const edge = cd < 0 ? zHi(z) : zLo(z);
    const corrTfs = tfs.filter((t, i) => i >= ci && allowed[t.tf] === cd);
    const ltfConf = tfs.slice(ci + 2, ci + 4);
    const zt = `${fmt(zLo(z), dg)}-${fmt(zHi(z), dg)}`;
    if (inTarget) now = `WAIT at ${zt}: ${buy(bias)} on ${names(ltfConf.length ? ltfConf : tfs.slice(ci + 1))} confirmation (no ${buy(bias).toLowerCase()} limits)`;
    else now = `${buy(cd)} correction trades only on ${names(corrTfs) || '-'} (${cd < 0 ? 'sell limits at supply, no buy limits' : 'buy limits at demand, no sell limits'}), TP before ${fmt(edge, dg)}`;
    tgt = `${zt} (${target.tf} ${z.pattern}${z.range ? ' base' : ''}${target.line ? ` at the ${target.lineTf} ${target.line.dir > 0 ? 'up' : 'down'} line ${fmt(target.value, dg)}` : ` at the ${C.tf} structure`})`;
    then = `${buy(bias)} at ${zt} on ${names(ltfConf.length ? ltfConf : tfs.slice(ci + 1)) || C.tf} confirmation`;
  } else if (B) {
    const imp = tfs.filter(t => allowed[t.tf] === bias);
    now = imp.length ? `${buy(bias)} impulse on ${names(imp)}` : `WAIT - no TF in a ${bias > 0 ? 'buy' : 'sell'} impulse`;
    then = `${buy(bias)} on ${B.tf} pullbacks to fresh ${bias > 0 ? 'demand' : 'supply'}`;
  } else now = 'WAIT - no trend';
  const F = up.length ? up[up.length - 1] : B;              // the lowest TF of that block: its SL / SH close flips the bias first
  if (!Sd && F) flip = `${F.tf} close ${bias > 0 ? '<' : '>'} ${fmt(F.st.sl, dg)}`;
  const direction = `DIRECTION: ${biasTxt} | NOW: ${now} | TARGET: ${tgt} | THEN: ${then} | FLIP: ${flip}`;
  return { sym: inp.sym, chart: inp.chart, tfs, phases, bias, biasTf: B?.tf ?? '', sideTf: Sd?.tf ?? '', cTf: C?.tf ?? '', pTf: Pp?.tf ?? '',
    target, allowed, structure, direction, missing };
}

/** The leg-out run of a zone: from its leg-out candle until price comes back to the proximal (or removes it), or now. */
export function zmRunEnd(S: Series, z: { dir: number; prox: number; legBar: number }): number {
  for (let j = z.legBar - 1; j >= 1; j--) if (z.dir > 0 ? S.L[j] <= z.prox : S.H[j] >= z.prox) return j;
  return 1;
}
/** Owner 2026-10-30 zone reasons (see ZmZone.reasons); strong = removed >= 1 opposite zone, arrival = all three. */
export function zmReasons(S: Series, zs: ZmZone[], lines: ZmLine[], piv: ZmPivot[], k: ZmParams = ZM): void {
  for (const z of zs) {
    const end = Math.max(1, Math.min(zmRunEnd(S, z), z.legBar));
    const closeBeyond = (lvl: number) => { for (let j = z.legBar; j >= end; j--) if (z.dir > 0 ? S.C[j] > lvl : S.C[j] < lvl) return j; return -1; };
    z.reasons = []; z.removedIds = []; z.brokePivot = -1;
    // R1 break: the newest confirmed swing of the opposite side before the base, closed beyond during the run
    let sw = piv.filter(p => p.conf >= 0 && p.t === z.dir && p.bar > z.base1 && p.conf >= z.legBar).sort((a, b) => a.bar - b.bar)[0]
      ?? piv.filter(p => p.t === z.dir && p.bar > z.base1).sort((a, b) => a.bar - b.bar)[0];
    const N = k.zoneSwing;
    if (N > 0) {   // the nearest swing of the TF before the base (N bars each side, formed before the leg-out)
      sw = undefined as unknown as ZmPivot;
      const X = (j: number) => (z.dir > 0 ? S.H[j] : S.L[j]);
      for (let j = z.base1 + 1; j < S.n - 1 - N; j++) {
        let ok = true;
        for (let h = 1; h <= N && ok; h++) if (z.dir > 0 ? X(j - h) > X(j) || X(j + h) > X(j) : X(j - h) < X(j) || X(j + h) < X(j)) ok = false;
        if (ok) { sw = { bar: j, p: X(j), t: z.dir, conf: j - N }; break; }
      }
    }
    if (sw && closeBeyond(sw.p) >= 0) { z.reasons.push('break'); z.brokePivot = sw.bar; }
    // R2 direction: a live opposite trend line closed through during the run
    if (lines.some(t => t.kind === 'trend' && t.dir === -z.dir && t.b > z.legBar && t.brokenAt >= end && t.brokenAt <= z.legBar)) z.reasons.push('direction');
    // R3 removal: an older opposite zone closed through during the run
    for (const o of zs) if (o.dir === -z.dir && o.legBar > z.legBar && o.removed && o.removedBar <= z.legBar && o.removedBar >= end) z.removedIds.push(o.legBar);
    if (z.removedIds.length) z.reasons.push('removal');
    z.strong = z.removedIds.length > 0;
    z.arrival = z.reasons.length === 3;
  }
}
/** The compact MT5 label of a zone's reasons: "BOS CHoCH x2 removed". */
export const zmReasonTag = (z: ZmZone) => [z.reasons.includes('break') ? 'BOS' : '', z.reasons.includes('direction') ? 'CHoCH' : '',
  z.removedIds.length ? `x${z.removedIds.length} removed` : ''].filter(Boolean).join(' ');

// ---- what the chart draws (SPEC 3): <= 6 lines per chart ---------------------------------------------------------------
export interface ZmDraw { line: ZmLine; tf: string; role: 'live' | 'broken' | 'momentum' | 'htf' | 'momentum-broken' }
/** The lines a chart of TF t shows: per direction the live trend line (not stale, or the target line) and the newest line
 *  broken within brokenShow bars; the live momentum line(s) of the newest impulse and the newest momentum line broken within
 *  5 bars; plus the HTF target line (drawn on every LTF chart of the correcting TF). */
export function zmDrawLines(t: ZmTf, m: ZmModel | null, k: ZmParams = ZM): ZmDraw[] {
  const S = (t as ZmTf & { S: Series }).S, atr = zmAtr(S), out: ZmDraw[] = [];
  const tl = m?.target?.line ?? null;
  for (const d of [1, -1]) {
    // the main live line and the newest line nested inside it (owner 2026-10-30: a new line while the older one is live)
    const lv = t.lines.filter(l => l.kind !== 'momentum' && l.dir === d && l.brokenAt < 0 && (l === tl || !zmStale(S, l, atr))).sort((a, b) => a.born - b.born);
    const main = lv.find(l => !zmInner(l)) ?? lv[0], inner = lv.find(l => zmInner(l) && l !== main && main && l.born < main.born);
    if (main) out.push({ line: main, tf: t.tf, role: 'live' });
    if (inner) out.push({ line: inner, tf: t.tf, role: 'live' });
    const brk = t.lines.filter(l => l.kind === 'trend' && l.dir === d && l.brokenAt >= 0 && l.brokenAt <= k.brokenShow).sort((a, b) => a.brokenAt - b.brokenAt)[0];
    if (brk) out.push({ line: brk, tf: t.tf, role: 'broken' });
  }
  // momentum (owner 2026-10-30): the live one(s) of the last two legs + the most recently broken one
  const mom = t.lines.filter(l => l.kind === 'momentum');
  const cp = t.pivots.filter(p => p.conf >= 0), from = cp.length >= 2 ? cp[cp.length - 2].bar : Infinity;
  for (const l of mom.filter(l => l.brokenAt < 0 && l.p2 <= from).sort((a, b) => a.a - b.a)) out.push({ line: l, tf: t.tf, role: 'momentum' });
  const brkM = mom.filter(l => l.brokenAt >= 0).sort((a, b) => a.brokenAt - b.brokenAt || a.a - b.a)[0];
  if (brkM) out.push({ line: brkM, tf: t.tf, role: 'momentum-broken' });
  if (m?.target?.line && m.target.lineTf !== t.tf && zmChainOf(t.tf).includes(m.target.lineTf)) out.push({ line: m.target.line, tf: m.target.lineTf, role: 'htf' });
  return out;
}
