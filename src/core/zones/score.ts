/**
 * Zone scorecard statistics over a research Dataset.
 *
 * Trade model (the indicator's, docs/Zone_Research_HowTo.md §4): entry at the proximal, stop at the distal,
 * 1R = zone height + spread. A fixed target of T R pays +T when the touch reached T R before the stop; a stopped
 * trade pays its stop loss; a trade still open at the horizon pays 0 (as analyze.py).
 *  - close stop (default, Raja removes a zone only on a candle close): the loss is the real R of the closing
 *    candle, t1c_loss (min −1R). Touch 1 only: MT5 logs the close-stop model for touch 1 only, so touches 2-3
 *    always use the wick stop and are labelled so.
 *  - wick stop: exactly −1R.
 * Expectancy is per filled trade (untouched zones are not trades). The 95% interval is a percentile bootstrap
 * (seeded, so the page is stable) up to BOOT_MAX trades, and the normal approximation above it.
 */
import { CURVE, RAJA_TYPES, VERDICTS, dayToISO, type Dataset } from './research';

export type Target = 1 | 2 | 3 | 5 | 'opp';
export type StopModel = 'close' | 'wick';
export type Snapshot = 'create' | 'touch';
export type Sample = 'all' | 'is' | 'oos';
export interface Opts {
  target: Target;
  stop: StopModel;
  snap: Snapshot;
  touches: 'fresh' | 'all';
  detector: 'ZV' | 'all';
  drawnOnly: boolean;
  sample: Sample;
  /** First out-of-sample creation day (days since epoch). */
  cutDay: number;
}
/** Raja's template defaults: ZoneVision zones the chart draws, fresh touch, close stop, creation-time context, 2R (InpMinRR = 2). */
export const RAJA_DEFAULTS: Omit<Opts, 'cutDay'> = { target: 2, stop: 'close', snap: 'create', touches: 'fresh', detector: 'ZV', drawnOnly: true, sample: 'all' };

export const MIN_N = 30;
const BOOT_MAX = 1000;
const BOOT_B = 1000;

/** R of trade i, or null when it is not a trade under these options (opp target with nothing opposing). */
export function tradeR(ds: Dataset, i: number, o: Pick<Opts, 'target' | 'stop'>): { r: number; optimistic: boolean } | null {
  const c = ds.cols;
  const useClose = o.stop === 'close' && c.k[i] === 1 && c.resC[i] !== 0;
  const mfe = useClose ? c.mfeC[i] : c.mfeW[i];
  const res = useClose ? c.resC[i] : c.resW[i];
  let T: number;
  if (o.target === 'opp') { T = c.oppR[i]; if (!(T > 0)) return null; } else T = o.target;
  if (mfe >= T) return { r: T, optimistic: false };
  if (res === 1) {
    if (!useClose) return { r: -1, optimistic: false };
    const loss = c.lossC[i];
    return Number.isFinite(loss) ? { r: Math.min(-1, loss), optimistic: false } : { r: -1, optimistic: true }; // older CSV without t1c_loss
  }
  return { r: 0, optimistic: false };
}

/** Default out-of-sample cut: the last 20% of distinct creation dates (analyze.py uses the same rule at 25%). */
export function defaultCut(ds: Dataset): number {
  const days = [...new Set(ds.cols.day)].sort((a, b) => a - b);
  if (!days.length) return 0;
  return days[Math.min(days.length - 1, Math.floor(days.length * 0.8))];
}

export interface Picked { idx: Int32Array; r: Float64Array; optimistic: number }
/** The trades the options keep, in chronological (touch-time) order, with their R. */
export function pick(ds: Dataset, o: Opts): Picked {
  const c = ds.cols;
  const keep: number[] = [];
  const rs: number[] = [];
  let optimistic = 0;
  for (let i = 0; i < ds.n; i++) {
    if (o.touches === 'fresh' && c.k[i] !== 1) continue;
    if (o.detector === 'ZV' && c.alt[i]) continue;
    if (o.drawnOnly && c.draw[i] === 0) continue;
    if (o.sample === 'is' && c.day[i] >= o.cutDay) continue;
    if (o.sample === 'oos' && c.day[i] < o.cutDay) continue;
    const t = tradeR(ds, i, o);
    if (!t) continue;
    keep.push(i); rs.push(t.r);
    if (t.optimistic) optimistic++;
  }
  const ord = keep.map((_, j) => j).sort((a, b) => c.time[keep[a]] - c.time[keep[b]] || keep[a] - keep[b]);
  return { idx: Int32Array.from(ord, j => keep[j]), r: Float64Array.from(ord, j => rs[j]), optimistic };
}

// ─── dimensions ──────────────────────────────────────────────────────────────────────────────────────────────
export type Dim = 'raja' | 'touch' | 'tf' | 'symbol' | 'side' | 'curve' | 'room' | 'tl' | 'verdict';
export const DIMS: { id: Dim; label: string; short: string; hint: string }[] = [
  { id: 'raja', label: 'Raja type', short: 'Type', hint: 'ARR arrival, WOW, STR strong, OVL overlap, INH inherited, FLP flip, OTL out of trendline, TST tested, WK weak' },
  { id: 'verdict', label: 'Raja verdict', short: 'Verdict', hint: 'The Raja lens at the zone: TAKE, WAIT, CONFIRM, SKIP (v2 files only)' },
  { id: 'touch', label: 'Touch #', short: 'Touch', hint: 'Fresh (1st touch) vs tested (2nd, 3rd). Set Touches to "All" to compare' },
  { id: 'curve', label: 'Curve', short: 'Curve', hint: 'Buys low on the curve (≤ 25), sells high (≥ 75); wrong side = the opposite' },
  { id: 'room', label: 'Room', short: 'Room', hint: 'Distance to the nearest opposing level at creation, in R' },
  { id: 'tl', label: 'Trendline', short: 'TL', hint: 'Zone sits near a trendline (v2 files only)' },
  { id: 'tf', label: 'Timeframe', short: 'TF', hint: 'The zone’s own timeframe' },
  { id: 'symbol', label: 'Symbol', short: 'Symbol', hint: 'Per pair' },
  { id: 'side', label: 'Side', short: 'Side', hint: 'Demand (buy) vs supply (sell)' },
];
const TYPE_NAME: Record<string, string> = { ARR: 'Arrival', WOW: 'WOW', STR: 'Strong', OVL: 'Overlap', INH: 'Inherited', FLP: 'Flip', OTL: 'Out of trendline', TST: 'Tested', WK: 'Weak' };
const roomBucket = (r: number) => (!Number.isFinite(r) ? 'Unknown' : r >= 99 ? 'Open (nothing opposing)' : r < 2 ? '< 2R' : r < 3 ? '2–3R' : r < 5 ? '3–5R' : '5R +');

/** Group key of trade i for a dimension (labels are the keys). */
export function groupOf(ds: Dataset, i: number, dim: Dim, snap: Snapshot): string {
  const c = ds.cols, s = snap === 'touch';
  switch (dim) {
    case 'raja': { const t = s ? c.rtS[i] : c.rtC[i]; return t ? `${RAJA_TYPES[t - 1]} · ${TYPE_NAME[RAJA_TYPES[t - 1]]}` : 'No type (v1 file)'; }
    case 'verdict': { const v = s ? c.vS[i] : c.vC[i]; return v ? VERDICTS[v] : 'No lens (v1 file)'; }
    case 'touch': return c.k[i] === 1 ? 'Fresh (touch 1)' : `Tested (touch ${c.k[i]})`;
    case 'curve': { const v = CURVE[s ? c.cvS[i] : c.cvC[i]]; return v === 'right' ? 'Right side of the curve' : v === 'middle' ? 'Middle of the curve' : v === 'wrong' ? 'Wrong side of the curve' : 'Unknown'; }
    case 'room': return roomBucket(s ? c.roomS[i] : c.roomC[i]);
    case 'tl': { const v = s ? c.tlS[i] : c.tlC[i]; return v === 1 ? 'Near a trendline' : v === 0 ? 'Away from trendlines' : 'Unknown (v1 file)'; }
    case 'tf': return ds.tfs[c.tf[i]] || '?';
    case 'symbol': return ds.symbols[c.sym[i]] || '?';
    case 'side': return c.side[i] > 0 ? 'Demand (buy)' : 'Supply (sell)';
  }
}

// ─── statistics ──────────────────────────────────────────────────────────────────────────────────────────────
/** Wilson 95% interval for a proportion. */
export function wilson(wins: number, n: number, z = 1.96): [number, number] {
  if (!n) return [NaN, NaN];
  const p = wins / n, z2 = z * z, d = 1 + z2 / n;
  const c = (p + z2 / (2 * n)) / d, h = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
/** 95% interval for the mean R: seeded percentile bootstrap for n ≤ BOOT_MAX, normal approximation above. */
export function meanCI(r: ArrayLike<number>, seed = 7): [number, number] {
  const n = r.length;
  if (n < 2) return [NaN, NaN];
  let s = 0; for (let i = 0; i < n; i++) s += r[i];
  const m = s / n;
  if (n > BOOT_MAX) {
    let v = 0; for (let i = 0; i < n; i++) v += (r[i] - m) ** 2;
    const se = Math.sqrt(v / (n - 1) / n);
    return [m - 1.96 * se, m + 1.96 * se];
  }
  const rnd = mulberry32(seed + n);
  const means = new Float64Array(BOOT_B);
  for (let b = 0; b < BOOT_B; b++) { let t = 0; for (let i = 0; i < n; i++) t += r[(rnd() * n) | 0]; means[b] = t / n; }
  means.sort();
  return [means[Math.floor(0.025 * BOOT_B)], means[Math.ceil(0.975 * BOOT_B) - 1]];
}
/** Largest peak-to-trough fall of the cumulative R curve, in R (≥ 0). Trades must be in time order. */
export function maxDrawdown(r: ArrayLike<number>): number {
  let eq = 0, peak = 0, dd = 0;
  for (let i = 0; i < r.length; i++) { eq += r[i]; if (eq > peak) peak = eq; if (peak - eq > dd) dd = peak - eq; }
  return dd;
}

export interface Row {
  key: string;
  n: number;
  winRate: number;
  winCI: [number, number];
  avgWin: number;
  /** Mean R of the losing trades (negative). With the close stop this is around −2R, not −1R. */
  avgLoss: number;
  E: number;
  ci: [number, number];
  maxDD: number;
  totalR: number;
  small: boolean;
  /** Share of trades whose R is from the wick-stop model although close-stop was asked (touches 2-3). */
  wickShare: number;
}
export function rowOf(key: string, r: ArrayLike<number>, wickN = 0): Row {
  const n = r.length;
  let wins = 0, sw = 0, nl = 0, sl = 0, s = 0;
  for (let i = 0; i < n; i++) { const x = r[i]; s += x; if (x > 0) { wins++; sw += x; } else if (x < 0) { nl++; sl += x; } }
  return {
    key, n, winRate: n ? wins / n : NaN, winCI: wilson(wins, n), avgWin: wins ? sw / wins : NaN, avgLoss: nl ? sl / nl : NaN,
    E: n ? s / n : NaN, ci: meanCI(r), maxDD: maxDrawdown(r), totalR: s, small: n < MIN_N, wickShare: n ? wickN / n : 0,
  };
}

/** One row per group of a dimension, sorted: groups with n ≥ 30 by expectancy, then the small ones by expectancy. */
export function groupRows(ds: Dataset, p: Picked, dim: Dim, o: Pick<Opts, 'snap' | 'stop'>): Row[] {
  const by = new Map<string, { r: number[]; wick: number }>();
  for (let j = 0; j < p.idx.length; j++) {
    const i = p.idx[j];
    const k = groupOf(ds, i, dim, o.snap);
    let g = by.get(k);
    if (!g) { g = { r: [], wick: 0 }; by.set(k, g); }
    g.r.push(p.r[j]);
    if (o.stop === 'close' && (ds.cols.k[i] !== 1 || ds.cols.resC[i] === 0)) g.wick++;
  }
  const rows = [...by.entries()].map(([k, g]) => rowOf(k, g.r, g.wick));
  return rows.sort((a, b) => Number(a.small) - Number(b.small) || b.E - a.E || b.n - a.n);
}

export function summaryRow(ds: Dataset, p: Picked, o: Pick<Opts, 'stop'>): Row {
  let wick = 0;
  if (o.stop === 'close') for (let j = 0; j < p.idx.length; j++) { const i = p.idx[j]; if (ds.cols.k[i] !== 1 || ds.cols.resC[i] === 0) wick++; }
  return rowOf('All trades', p.r, wick);
}

export interface Callout { dim: Dim; dimLabel: string; row: Row; oos?: Row }
/**
 * "Raja's best setups": groups with n ≥ 30 whose whole 95% interval is above 0 R. "Avoid": whole interval below 0.
 * When a split exists they are chosen on the in-sample trades and checked on the out-of-sample ones (oos row).
 */
export function callouts(ds: Dataset, o: Opts): { best: Callout[]; avoid: Callout[]; chosenOn: 'is' | 'selected' } {
  const split = o.sample === 'all' && hasSplit(ds, o.cutDay);
  const base = pick(ds, split ? { ...o, sample: 'is' } : o);
  const oosP = split ? pick(ds, { ...o, sample: 'oos' }) : null;
  const best: Callout[] = [], avoid: Callout[] = [];
  for (const d of DIMS) {
    const rows = groupRows(ds, base, d.id, o);
    if (rows.length < 2) continue; // a dimension with one group says nothing new
    const oosRows = oosP ? new Map(groupRows(ds, oosP, d.id, o).map(r => [r.key, r])) : null;
    for (const row of rows) {
      if (row.small || !Number.isFinite(row.ci[0])) continue;
      const c: Callout = { dim: d.id, dimLabel: d.label, row, oos: oosRows?.get(row.key) };
      if (row.ci[0] > 0) best.push(c);
      else if (row.ci[1] < 0) avoid.push(c);
    }
  }
  best.sort((a, b) => b.row.ci[0] - a.row.ci[0]);
  avoid.sort((a, b) => a.row.ci[1] - b.row.ci[1]);
  return { best: best.slice(0, 6), avoid: avoid.slice(0, 6), chosenOn: split ? 'is' : 'selected' };
}
export function hasSplit(ds: Dataset, cutDay: number): boolean {
  let a = false, b = false;
  for (let i = 0; i < ds.n && !(a && b); i++) { if (ds.cols.day[i] < cutDay) a = true; else b = true; }
  return a && b;
}

export function dateSpan(ds: Dataset): { from: string; to: string } | null {
  if (!ds.n) return null;
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < ds.n; i++) { const d = ds.cols.day[i]; if (d < lo) lo = d; if (d > hi) hi = d; }
  return { from: dayToISO(lo), to: dayToISO(hi) };
}
