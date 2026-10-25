// Smart defaults for "Plan a trade": the owner's Raja rules turned into numbers (ZoneVision 2.10, raja checklist stage
// "Plan: entry, stop, target, size"). Pure functions so the Planner can pre-fill and the tests can pin the edge cases.
import { normalizeSymbol } from './instruments';

export type Mentor = 'raja' | 'kevin';
export type Side = 'buy' | 'sell';

/** Minimum stop buffer beyond the distal, in pips, however thin the zone. */
export const MIN_STOP_PIPS = 3;
/** Target sits this many pips before the opposite zone's proximal. */
export const TARGET_BEFORE_PIPS = 7;
/** Room to the opposite zone, as a multiple of the stop: under 2x skip, 3x and more is good. */
export const ROOM_MIN = 2;
export const ROOM_GOOD = 3;

/**
 * Stop buffer as a fraction of the zone height, by the timeframe the zone is drawn on.
 * Accepts the app's combo labels ('1m', '15m', 'H1', '1D', '1W', '1M' = monthly) and MT-style labels
 * ('M1', 'M30', 'H4', 'D1', 'W1', 'MN1'). Minutes are lower-case 'm' or an 'M' prefix; a bare '1M' is a month.
 */
export function bufferPct(tf: string): number {
  const t = tf.trim();
  let m: RegExpExecArray | null;
  if ((m = /^(\d+)m$/.exec(t)) || (m = /^M(\d+)$/.exec(t))) return +m[1] <= 30 ? 0.25 : 0.2;
  if ((m = /^H(\d+)$/i.exec(t)) || (m = /^(\d+)h$/i.exec(t))) return +m[1] <= 3 ? 0.2 : +m[1] <= 12 ? 0.15 : 0.1;
  if (/^(1?D|D1)$/i.test(t)) return 0.1;
  if (/^(1?W|W1|1M|MN1?)$/.test(t) || /^1?w$/.test(t)) return 0.05;
  return 0.2;
}

const round = (x: number, digits: number) => +x.toFixed(digits);

export interface StopCalc { stop: number; bufferPips: number; pct: number; zonePips: number; minApplied: boolean }

/** Raja stop: beyond the distal by a % of |proximal - distal| for the timeframe, never less than 3 pips. */
export function rajaStop(o: { side: Side; proximal: number; distal: number; tf: string; pip: number; digits: number }): StopCalc | null {
  const { side, proximal, distal, tf, pip, digits } = o;
  if (![proximal, distal, pip].every(Number.isFinite) || pip <= 0) return null;
  const height = Math.abs(proximal - distal);
  const pct = bufferPct(tf);
  const raw = height * pct;
  const min = MIN_STOP_PIPS * pip;
  const buf = Math.max(raw, min);
  const dirn = side === 'buy' ? 1 : -1;
  return { stop: round(distal - dirn * buf, digits), bufferPips: buf / pip, pct, zonePips: height / pip, minApplied: raw < min };
}

/** Raja target: 7 pips before the opposite zone's proximal. Null when the opposite zone is on the wrong side of entry. */
export function rajaTarget(o: { side: Side; entry: number | null | undefined; opposite: number; pip: number; digits: number }): number | null {
  const { side, entry, opposite, pip, digits } = o;
  if (!Number.isFinite(opposite) || !(pip > 0)) return null;
  const dirn = side === 'buy' ? 1 : -1;
  const t = opposite - dirn * TARGET_BEFORE_PIPS * pip;
  if (entry != null && Number.isFinite(entry) && dirn * (t - entry) <= 0) return null;
  return round(t, digits);
}

export type RoomVerdict = 'skip' | 'ok' | 'good';
/** Room from entry to the target (or opposite zone) as a multiple of the stop distance. */
export function room(o: { side: Side; entry: number | null | undefined; stop: number | null | undefined; target: number | null | undefined }): { x: number; verdict: RoomVerdict } | null {
  const { side, entry, stop, target } = o;
  if (entry == null || stop == null || target == null) return null;
  const risk = Math.abs(entry - stop);
  if (!risk) return null;
  const dirn = side === 'buy' ? 1 : -1;
  const x = (dirn * (target - entry)) / risk;
  return { x, verdict: x >= ROOM_GOOD ? 'good' : x >= ROOM_MIN ? 'ok' : 'skip' };
}

/** The journal's most-traded symbol (normalised), or the fallback when the journal is empty. */
export function mostTraded(trades: readonly { symbol: string }[], fallback = 'EURUSD'): string {
  const n = new Map<string, number>();
  for (const t of trades) { if (!t.symbol) continue; const s = normalizeSymbol(t.symbol); n.set(s, (n.get(s) ?? 0) + 1); }
  let best = fallback, top = 0;
  for (const [s, c] of n) if (c > top) { best = s; top = c; }
  return best;
}

// ─── Remembered choices (every access guarded: private mode must not break the page) ─────────────────────────
const MENTOR_KEY = 'rfx_plan_mentor';
const COMBO_KEY = 'rfx_plan_combo';
export function readMentor(): Mentor { try { return localStorage.getItem(MENTOR_KEY) === 'kevin' ? 'kevin' : 'raja'; } catch { return 'raja'; } }
export function writeMentor(m: Mentor) { try { localStorage.setItem(MENTOR_KEY, m); } catch { /* storage blocked */ } }
export function readCombo(max: number): number | null {
  try { const v = localStorage.getItem(COMBO_KEY); const n = v == null ? NaN : +v; return Number.isInteger(n) && n >= 0 && n < max ? n : null; } catch { return null; }
}
export function writeCombo(n: number) { try { localStorage.setItem(COMBO_KEY, String(n)); } catch { /* storage blocked */ } }
