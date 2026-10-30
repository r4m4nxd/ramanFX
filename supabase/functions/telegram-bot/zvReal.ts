// The owner's TEACHING (docs/training/LEARNED.md, his marked AUDUSD MN / W1 / D1 / H4 on the Train page) as one engine:
// REAL pivots = the end of a REAL correction, trend lines between real pivots, momentum lines along impulses, and the
// top-down phase (impulse / correction) of each timeframe. Canonical TypeScript; the MT5 port is the RFX_STRUCT block of
// public/tools/RFX_ZoneCore.mqh (drawn by RamanFX_ZoneVision.mq5), conformance via tools/telegram_bot/parity/mql_port.py.
// The bot's charts and arrivals still use zvTrend.zvLines (the structure method) until the owner approves this on MT5.
//
// 1. REAL PIVOTS (zrPivots): a zig-zag of impulses and real corrections. The impulse into an extreme X starts at its
//    origin (going back from X, the lowest low once it is an osw-bar swing low: the start of the one-way run). X is a
//    real peak once the impulse is >= minLeg ATR and price corrected >= rc of it, or came back within near ATR of the
//    origin candle's body (the base that started the move). Small pullbacks inside an impulse never qualify: they are
//    CP levels (RBR / DBD), the real turns are RBD peaks / DBR valleys.
// 2. TREND LINES (zrLines; up described, down mirrored), read bar by bar with each pivot taken when it is CONFIRMED:
//    the bottom (lowest low) starts the structure; pivot 1 = the bottom when it is a real valley whose leg out is no
//    impulse (else the momentum line plays that role and pivot 1 = the first higher real valley); pivot 2 = the tangent
//    from pivot 1 under the higher lows since it (FitAnchor clean anchors, not too flat); equal lows (too flat with one
//    candidate) = the newer is the base. The line is kept until the first CLOSE beyond it; while the structure keeps
//    making higher lows the next one re-anchors from pivot 1 and REPLACES the broken one (AUDUSD D1 Jul 29 -> Sep 2);
//    a lower low than the last line's pivot 2 after the break = the structure ended (pivot 1 starts again there).
// 3. MOMENTUM LINES (zrMomentum): out of a real pivot whose leg out is an impulse (>= momEff ATR per bar over its first
//    momBars bars): from the pivot's wick, the tangent over those bars (anchor 2 inside the impulse; AUDUSD MN Apr 2022
//    -> Aug 2022, Oct 2022 -> Nov 2022), drawn alongside any trend line; its break ends the impulse, not the trend.
// 4. PHASE (zrPhase): trend = HH + HL up / LH + LL down / else range (last two peaks and valleys); the current leg
//    (from the last real pivot) is an IMPULSE when it goes with the trend, a CORRECTION when against it - a correction
//    is expected to end at the trend line (target = the live trend line now, else the last HL / LH that holds the
//    trend); a close beyond that last HL / LH = no trend (range). zrTopDown nests the timeframes: trade with
//    the HTF impulse; correction trades only on the LTF and only until the HTF trend line.
// Index convention as zonecore.ts Series: shift 0 = phantom forming bar, 1 = newest closed, larger = older. Pure.
import { Series } from './zonecore.ts';
import { zvAt, zvAtr, zvFitAnchor, zvSlope, type ZvLine, type ZvPivot } from './zvTrend.ts';

/** The tunable parameters (Train page; keep RFX_ZoneCore.mqh RS_* in step). Owner defaults and what the marks chose
 *  (src/core/trainingFixtures.test.ts): rc 0.5 (owner: "about halfway") -> 0.38 (the marked D1: 13 / 13 pivots; MN /
 *  W1 / H4 corrections the owner calls real retrace 36-45%); near 0.25 ATR; minLeg 1.25 ATR; osw 2 (the indicator's
 *  swing size); momBars 4 (owner: anchor 2 within 1-4 bars); momEff 0.6 ATR per bar; minRise 0.25 ATR (the MN Oct 2023
 *  -> Aug 2024 line rises 0.3 ATR; the structure method's 1.0 rejected it); minSlope / fitTol as zvTrend. */
export const ZR = { lookback: 200, rc: 0.38, near: 0.25, minLeg: 1.25, osw: 2, momBars: 4, momEff: 0.6, minSlope: 0.015, minRise: 0.25 };

export interface ZrLine extends ZvLine { kind: 'trend' | 'momentum' }
export type ZrPhaseName = 'impulse' | 'correction' | 'range';
export interface ZrPhase {
  tf: string; trend: number;          // +1 up (HH + HL), -1 down (LH + LL), 0 range
  leg: number;                        // the current leg's direction (from the last real pivot), 0 = none yet
  phase: ZrPhaseName;
  target: number | null;              // a correction's target: the live trend line (in the trend's direction) at shift 0,
                                      // else the last higher low (up) / lower high (down)
}
export interface ZrResult {
  pivots: ZvPivot[]; up: ZrLine | null; dn: ZrLine | null; upX: ZrLine | null; dnX: ZrLine | null;
  mom: ZrLine | null;                 // the newest real pivot's momentum line (its leg out is an impulse), live or broken
  hist: ZrLine[];                     // every line drawn on these bars (trend + momentum), newest anchor first
}

/** ATR at shift i (zvAtr), the oldest valid one where the ATR has no 14 bars yet (never 0). */
export function zrAtr(S: Series): (i: number) => number {
  const a = zvAtr(S);
  let last = 0;
  for (let i = 1; i < S.n; i++) if (a(i) > 0) last = i;
  return i => Math.max(a(Math.min(i, last)), 1e-12);
}

/** The origin of the impulse into the extreme x (up = a high: the leg up from a low): going back from x, not past f
 *  (the last pivot), the lowest low so far once it is an osw-bar swing low (<= the older, < the newer); else the lowest. */
export function zrOrigin(S: Series, x: number, f: number, up: boolean): number {
  const H = S.H, L = S.L, w = ZR.osw;
  let o = x;
  for (let j = x + 1; j <= f; j++) {
    if (up ? L[j] < L[o] : H[j] > H[o]) o = j;
    if (o !== j) continue;
    let sw = true;
    for (let k = 1; k <= w && sw; k++) {
      if (j + k <= f && (up ? L[j] > L[j + k] : H[j] < H[j + k])) sw = false;
      if (j - k >= 1 && (up ? L[j] >= L[j - k] : H[j] <= H[j - k])) sw = false;
    }
    if (sw) return j;
  }
  return o;
}

/** The owner's REAL pivots over the newest `bars` closed bars, oldest first (alternating peak / valley; conf = the
 *  shift whose bar confirmed it). A pending leg that runs beyond the last confirmed pivot moves that pivot. */
export function zrPivots(S: Series, bars: number): ZvPivot[] {
  const H = S.H, L = S.L, O = S.O, C = S.C, atr = zrAtr(S), out: ZvPivot[] = [];
  if (bars < 3) return out;
  const push = (x: number, t: number, j: number) => out.push({ bar: x, p: t > 0 ? H[x] : L[x], t, conf: j });
  let d = 0, hi = bars, lo = bars;
  for (let j = bars - 1; j >= 1; j--) {
    if (d >= 0 && H[j] > H[hi]) hi = j;
    if (d <= 0 && L[j] < L[lo]) lo = j;
    const f = out.length ? out[out.length - 1].bar : bars;
    if (d >= 0 && hi > j) {
      const o = zrOrigin(S, hi, f, true), leg = H[hi] - L[o];
      let m = Infinity;
      for (let k = hi - 1; k >= j; k--) m = Math.min(m, L[k]);
      const need = Math.max(0, Math.min(ZR.rc * leg, H[hi] - Math.max(O[o], C[o]) - ZR.near * atr(hi)));
      if (leg >= ZR.minLeg * atr(hi) && H[hi] - m >= need) {
        if (!out.length && o > hi) push(o, -1, j);
        push(hi, 1, j); d = -1; lo = hi - 1;
        for (let k = hi - 1; k >= j; k--) if (L[k] <= L[lo]) lo = k;
        continue;
      }
    }
    if (d <= 0 && lo > j) {
      const o = zrOrigin(S, lo, f, false), leg = H[o] - L[lo];
      let m = -Infinity;
      for (let k = lo - 1; k >= j; k--) m = Math.max(m, H[k]);
      const need = Math.max(0, Math.min(ZR.rc * leg, Math.min(O[o], C[o]) - L[lo] - ZR.near * atr(lo)));
      if (leg >= ZR.minLeg * atr(lo) && m - L[lo] >= need) {
        if (!out.length && o > lo) push(o, 1, j);
        push(lo, -1, j); d = 1; hi = lo - 1;
        for (let k = lo - 1; k >= j; k--) if (H[k] >= H[hi]) hi = k;
        continue;
      }
    }
    const last = out[out.length - 1];
    if (d === -1 && last && H[j] > last.p) { out.pop(); d = 1; hi = j; }
    else if (d === 1 && last && L[j] < last.p) { out.pop(); d = -1; lo = j; }
  }
  return out;
}

/** A trend line from real pivot o (older) to n (newer): FitAnchor clean older anchor; null when in the wrong order or
 *  too flat (< minSlope ATR per bar or < minRise ATR between the anchors; ATR at the newer pivot). */
export function zrPair(S: Series, o: ZvPivot, n: ZvPivot, d: number, atr: (i: number) => number): ZrLine | null {
  if (d > 0 ? !(n.p > o.p) : !(n.p < o.p)) return null;
  const a = zvFitAnchor(S, o.bar, n.bar, n.p, d);
  const t: ZrLine = { dir: d, a, b: n.bar, pa: d > 0 ? S.L[a] : S.H[a], pb: n.p, cuts: 0, brokenAt: -1, kind: 'trend' };
  if (d > 0 ? !(t.pb > t.pa) : !(t.pb < t.pa)) return null;
  const ab = atr(t.b);
  if (Math.abs(zvSlope(t)) < ZR.minSlope * ab || Math.abs(t.pb - t.pa) < ZR.minRise * ab) return null;
  return t;
}

/** Is the leg out of pivot p an IMPULSE (fast one-way)? From p's wick to the furthest wick of its next momBars bars,
 *  >= momEff ATR per bar. Needs those bars closed. */
export function zrImpulse(S: Series, p: ZvPivot, atr: (i: number) => number): boolean {
  const e = p.bar - ZR.momBars;
  if (e < 1) return false;
  const d = -p.t, ref = d < 0 ? S.H[p.bar] : S.L[p.bar];
  let far = ref;
  for (let j = p.bar - 1; j >= e; j--) far = d < 0 ? Math.min(far, S.L[j]) : Math.max(far, S.H[j]);
  return d * (far - ref) >= ZR.momEff * ZR.momBars * atr(p.bar);
}

/** The MOMENTUM line out of pivot p (null when its leg is no impulse): from p's wick, the tangent over the wicks of its
 *  next momBars bars (the line none of them crosses); brokenAt = the first close beyond it after those bars. */
export function zrMomentum(S: Series, p: ZvPivot, atr: (i: number) => number): ZrLine | null {
  if (!zrImpulse(S, p, atr)) return null;
  const d = -p.t, A = p.bar, e = A - ZR.momBars, P = (j: number) => (d > 0 ? S.L[j] : S.H[j]);
  let b = -1, sl = 0;
  for (let j = A - 1; j >= e; j--) { const s = (P(j) - P(A)) / (A - j); if (b < 0 || (d > 0 ? s < sl : s > sl)) { b = j; sl = s; } }
  if (b < 0 || d * sl <= 0) return null;
  const t: ZrLine = { dir: d, a: A, b, pa: P(A), pb: P(b), cuts: 0, brokenAt: -1, kind: 'momentum' };
  for (let j = e - 1; j >= 1; j--) if (d > 0 ? S.C[j] < zvAt(t, j) : S.C[j] > zvAt(t, j)) { t.brokenAt = j; break; }
  return t;
}

/** The owner's lines of one timeframe (S = closed bars + phantom): see the header (2. / 3.). */
export function zrLines(S: Series): ZrResult {
  const res: ZrResult = { pivots: [], up: null, dn: null, upX: null, dnX: null, mom: null, hist: [] };
  const bars = Math.min(ZR.lookback, S.n - 1 - ZR.osw);
  if (bars <= ZR.osw + 2) return res;
  const atr = zrAtr(S), C = S.C;
  const piv = res.pivots = zrPivots(S, bars);
  const hist: ZrLine[] = [];
  for (const d of [1, -1]) {
    const ps = piv.filter(p => p.t === (d > 0 ? -1 : 1));
    const beyond = (t: ZvLine, j: number) => (d > 0 ? C[j] < zvAt(t, j) : C[j] > zvAt(t, j));   // a CLOSE beyond the line
    const out = (x: number, y: number) => (d > 0 ? x < y : x > y);   // x further out than y (lower low / higher high)
    let ext = { bar: -1, p: 0 }, p1: ZvPivot | null = null, extPend: ZvPivot | null = null, lastB: ZvPivot | null = null;
    let live: ZrLine | null = null, brk: ZrLine | null = null, seen: ZvPivot[] = [], k = 0;
    const kill = (at: number) => { if (live) { live.brokenAt = at; brk = live; live = null; } };
    for (let j = bars; j >= 1; j--) {
      if (live && j < live.b && beyond(live, j)) kill(j);
      const xj = d > 0 ? S.L[j] : S.H[j];
      if (ext.bar < 0 || out(xj, ext.p)) { kill(j); ext = { bar: j, p: xj }; p1 = null; seen = []; lastB = null; extPend = null; }
      // the extreme's own leg out decides (momBars bars after it) whether it is pivot 1 (no impulse) or not
      if (extPend && !p1 && extPend.bar - ZR.momBars >= j) { if (!zrImpulse(S, extPend, atr)) { p1 = extPend; seen = []; lastB = null; } extPend = null; }
      for (; k < ps.length && ps[k].conf! >= j; k++) {
        const p = ps[k];
        if (p.bar === ext.bar) { extPend = p; continue; }
        if (!out(ext.p, p.p)) continue;
        if (!p1 || !out(p1.p, p.p) || (lastB && !live && out(p.p, lastB.p))) { kill(p.bar); p1 = p; seen = []; lastB = null; continue; }
        seen.push(p);
        if (live) continue;
        // pivot 2: the tangent from pivot 1 over the higher lows since it (the next one when FitAnchor makes it too flat)
        const sl = (x: ZvPivot) => (x.p - p1!.p) / (p1!.bar - x.bar);
        let t: ZrLine | null = null;
        for (const q of [...seen].sort((x, y) => (d > 0 ? sl(x) - sl(y) : sl(y) - sl(x)) || x.bar - y.bar)) if ((t = zrPair(S, p1, q, d, atr))) break;
        if (!t) { if (seen.length === 1) { p1 = p; seen = []; } continue; }   // equal lows: the newer is the base
        if (brk && brk.a === t.a) { const i = hist.indexOf(brk); if (i >= 0) hist.splice(i, 1); }   // re-anchored: replaces it
        hist.push(t);
        lastB = p;
        for (const q of seen) if (q.bar === t.b) lastB = q;
        let bj = -1;
        for (let x = t.b - 1; x >= j; x--) if (beyond(t, x)) { bj = x; break; }
        if (bj >= 0) { t.brokenAt = bj; brk = t; continue; }
        live = t;
      }
    }
    if (d > 0) { res.up = live; res.upX = brk; } else { res.dn = live; res.dnX = brk; }
  }
  for (const p of piv) { const m = zrMomentum(S, p, atr); if (m) hist.push(m); }
  res.hist = hist.sort((x, y) => x.a - y.a || x.b - y.b).reverse();
  const lp = piv[piv.length - 1];
  if (lp) res.mom = hist.find(m => m.kind === 'momentum' && m.a === lp.bar) ?? null;
  return res;
}

/** The TF's phase now (header 4.). */
export function zrPhase(S: Series, r: ZrResult = zrLines(S)): ZrPhase {
  const pk = r.pivots.filter(p => p.t > 0), vl = r.pivots.filter(p => p.t < 0);
  const up2 = (a: ZvPivot[]) => a.length >= 2 && a[a.length - 1].p > a[a.length - 2].p;
  const dn2 = (a: ZvPivot[]) => a.length >= 2 && a[a.length - 1].p < a[a.length - 2].p;
  let trend = up2(pk) && up2(vl) ? 1 : dn2(pk) && dn2(vl) ? -1 : 0;
  // a close beyond the last higher low (up) / lower high (down) breaks the structure: no trend until a new one forms
  if (trend > 0 && S.C[1] < vl[vl.length - 1].p) trend = 0;
  if (trend < 0 && S.C[1] > pk[pk.length - 1].p) trend = 0;
  const last = r.pivots[r.pivots.length - 1], leg = last ? -last.t : 0;
  const phase: ZrPhaseName = trend === 0 || leg === 0 ? 'range' : leg === trend ? 'impulse' : 'correction';
  // a correction's target: the live trend line now, else the pivot that holds the trend (the last higher low / lower high)
  const line = trend > 0 ? r.up : trend < 0 ? r.dn : null;
  const hold = trend > 0 ? vl[vl.length - 1] : trend < 0 ? pk[pk.length - 1] : null;
  return { tf: S.tf, trend, leg, phase, target: phase !== 'correction' ? null : line ? zvAt(line, 0) : hold ? hold.p : null };
}

const dirW = (d: number) => (d > 0 ? 'up' : d < 0 ? 'down' : 'sideways');
/** One TF's phase in words: "W1 impulse up", "D1 correction (down) -> D1 up line 0.69120", "H4 range". */
export function zrPhaseText(p: ZrPhase, digits = 5): string {
  if (p.phase === 'range') return `${p.tf} range`;
  if (p.phase === 'impulse') return `${p.tf} impulse ${dirW(p.trend)}`;
  return `${p.tf} correction (${dirW(p.leg)})${p.target != null ? ` -> ${p.tf} ${dirW(p.trend)} trend ${p.target.toFixed(digits)}` : ''}`;
}

/** Top-down (highest TF first): each TF's phase, and for every TF in a correction the note for the next lower TF:
 *  correction trades only on that LTF, only until the correcting TF's trend line. */
export function zrTopDown(series: Series[], digits = 5): { phases: ZrPhase[]; text: string; notes: string[] } {
  const phases = series.map(S => zrPhase(S));
  const notes: string[] = [];
  phases.forEach((p, i) => {
    const ltf = phases[i + 1];
    if (p.phase === 'correction' && ltf) notes.push(`correction trades only on ${ltf.tf}${p.target != null ? ` until ${p.target.toFixed(digits)}` : ''} (${p.tf} trend ${dirW(p.trend)})`);
  });
  return { phases, text: phases.map(p => zrPhaseText(p, digits)).join(' · '), notes };
}
