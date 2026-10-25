// Rule score: which of Raja's key rules the owner breaks, and what each break has cost him in R, from his own
// journal. Rules come from src/core/checklists/raja.ts (stages + the Never list). Pure functions: the Trade page
// pre-fills what the data can prove, the Reports tab scores it, the Planner warns with the owner's own number.
import type { Alignment, Side } from './types';
import { curveDepth, SD_COMBOS, trendRel, type Plan } from './strategy';
import { rajaStop, room, ROOM_MIN } from './plannerDefaults';

/** Followed / broken / not applicable. */
export type RuleMark = 'y' | 'n' | 'na';
export type RuleId = 'direction' | 'sideways' | 'strong' | 'confirm' | 'curve' | 'opposite' | 'trendline' | 'room' | 'stop' | 'target' | 'wow' | 'fourth' | 'risk' | 'revenge';
export type RuleMarks = Partial<Record<RuleId, RuleMark>>;

export interface RuleDef {
  id: RuleId;
  /** The rule as he follows it. */
  text: string;
  /** Short name used in sentences: "Breaking '<name>' cost you …". */
  name: string;
  /** Lesson reference from the checklist. */
  src: string;
  /** From the checklist's Never list. */
  never?: boolean;
}

export const RULES: RuleDef[] = [
  { id: 'direction', name: 'direction from D/W/M', text: 'Traded the direction of the monthly, weekly or daily trend', src: 'L7' },
  { id: 'sideways', name: 'no sideways market', text: 'Market was trending, not sideways or meshing', src: 'L8 · L101', never: true },
  { id: 'strong', name: 'strong or arrival zone', text: 'Zone was strong or arrival: it removed the opposite zone', src: 'L1 · L51' },
  { id: 'confirm', name: 'confirmation on tested zones', text: 'Tested or weak zone: waited for a lower-timeframe confirmation', src: 'L52 · L101', never: true },
  { id: 'curve', name: 'right side of the curve', text: 'Demand below 50% of the curve, supply above it', src: 'L4', never: true },
  { id: 'opposite', name: 'not into an opposite zone', text: 'Price was not sitting in an opposite zone', src: 'L50', never: true },
  { id: 'trendline', name: 'nearest the trendline', text: 'Of stacked zones, took the one nearest the trendline', src: 'L102 · L104' },
  { id: 'room', name: 'room of 2× the stop', text: 'Room to the opposite zone was at least 2× the stop', src: 'L7 · L53', never: true },
  { id: 'stop', name: 'stop % rule', text: 'Stop beyond the distal by the % of zone height (min 3 pips)', src: 'ZV 2.10' },
  { id: 'target', name: 'target before the opposite zone', text: 'Target sat before the opposite zone, not inside it', src: 'L7 · L106' },
  { id: 'wow', name: 'known wow target', text: 'Knew the wow target (opposite zone) before entry', src: 'L101', never: true },
  { id: 'fourth', name: 'no 4th touch', text: 'Not the 4th touch of the zone or trendline', src: 'L102 · L103', never: true },
  { id: 'risk', name: 'risk 1-2% max', text: 'Risked 2% of the balance or less', src: 'L7' },
  { id: 'revenge', name: 'no revenge after a loss', text: 'No trade after a loss the same day', src: 'L7' },
];
export const RULE_BY_ID = Object.fromEntries(RULES.map(r => [r.id, r])) as Record<RuleId, RuleDef>;

/** Risk above this % of the balance breaks the 1-2% rule (a little slack for rounding of lots). */
export const MAX_RISK_PCT = 2.05;
/** A group smaller than this is an early read, not a verdict. */
export const SMALL_SAMPLE = 10;

export interface RuleContext {
  side: Side;
  /** The plan linked or matched to the trade (or the plan being written). */
  plan?: Plan | null;
  /** The trend read stored on the trade (Playbook alignment). */
  align?: Alignment | null;
  /** Risk as % of the balance at entry. */
  riskPct?: number | null;
  /** A losing trade on the same account closed earlier the same day, before this entry. */
  afterLossSameDay?: boolean | null;
  /** Pip size of the instrument (for the stop % rule). */
  pip?: number | null;
  digits?: number;
  /** Entry and the stop the position was opened with, when known (the trade's, not the plan's). */
  entry?: number | null;
  initStop?: number | null;
}

const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/** What the data can prove about each rule. Missing keys mean "can't tell" — the owner ticks those. */
export function autoMarks(c: RuleContext): RuleMarks {
  const m: RuleMarks = {};
  const p = c.plan ?? null;
  const dirn = c.side === 'buy' ? 1 : -1;

  // Direction and sideways: the plan's HTF read first, else the trend read on the trade.
  const htf = p?.htfTrend ?? c.align?.htf ?? null;
  if (htf) {
    const rel = trendRel(c.side, htf);
    if (rel !== 'sideways') m.direction = rel === 'with' ? 'y' : 'n';
  }
  const reads = p ? [p.htfTrend, p.etfTrend] : [c.align?.htf, c.align?.itf, c.align?.etf];
  if (reads.some(t => t === 'side')) m.sideways = 'n';
  else if (reads.every(t => t === 'up' || t === 'down')) m.sideways = 'y';

  if (p) {
    m.strong = p.qualified === 'none' ? 'n' : 'y';
    const weak = !p.fresh || p.qualified === 'none';
    m.confirm = !weak ? 'na' : p.method === 'conf' && p.signal != null ? 'y' : 'n';
    m.curve = curveDepth(p.side, p.curve) <= 50 ? 'y' : 'n';
    m.opposite = p.nearOpposing ? 'n' : 'y';
    m.wow = fin(p.opposingHtf) ? 'y' : 'n';

    const entry = fin(c.entry) ? c.entry : p.entry ?? p.proximal ?? null;
    const stop = fin(c.initStop) ? c.initStop : p.stop ?? null;
    const rm = room({ side: p.side, entry, stop, target: p.opposingHtf ?? p.target });
    if (rm) m.room = rm.x >= ROOM_MIN ? 'y' : 'n';

    if (p.tpMethod === 'trail' && !fin(p.target)) m.target = 'na';
    else if (fin(p.target) && fin(p.opposingHtf)) m.target = dirn * (p.opposingHtf - p.target) >= 0 ? 'y' : 'n';

    // Stop % rule: the buffer beyond the distal must be at least the prescribed one (a little slack for rounding).
    if (fin(p.proximal) && fin(p.distal) && fin(stop) && fin(c.pip) && c.pip > 0) {
      const rs = rajaStop({ side: p.side, proximal: p.proximal, distal: p.distal, tf: SD_COMBOS[p.combo]?.etf ?? 'H1', pip: c.pip, digits: c.digits ?? 5 });
      if (rs) {
        const buf = (dirn * (p.distal - stop)) / c.pip;
        m.stop = buf >= rs.bufferPips * 0.8 - 1e-9 ? 'y' : 'n';
      }
    }
  }

  const risk = fin(c.riskPct) ? c.riskPct : p && !p.retro && fin(p.riskPct) ? p.riskPct : null;
  if (risk != null) m.risk = risk <= MAX_RISK_PCT ? 'y' : 'n';
  if (c.afterLossSameDay != null) m.revenge = c.afterLossSameDay ? 'n' : 'y';
  return m;
}

/** The owner's ticks win; anything he hasn't ticked falls back to what the data shows. */
export const resolveMarks = (stored: RuleMarks | undefined, auto: RuleMarks): RuleMarks => ({ ...auto, ...(stored ?? {}) });

// ─── Scoring ─────────────────────────────────────────────────────────

export interface ScoredTrade {
  id: string;
  net: number;
  /** R multiple; when absent it is net / risk. */
  r?: number | null;
  risk?: number | null;
  marks: RuleMarks;
}

export interface RuleGroup {
  n: number;
  wins: number;
  winRate: number | null;
  /** Trades in the group with a known R. */
  rN: number;
  totalR: number;
  avgR: number | null;
}

export interface RuleScore {
  rule: RuleDef;
  followed: RuleGroup;
  broken: RuleGroup;
  na: number;
  /**
   * What breaking cost, in R, over the broken trades: (avg R broken − avg R followed) × broken trades with R.
   * Null until both groups have at least one trade with R.
   */
  cost: number | null;
  /** Either group under SMALL_SAMPLE trades. */
  small: boolean;
}

const rOf = (t: ScoredTrade): number | null => {
  if (fin(t.r)) return t.r;
  if (fin(t.risk) && t.risk > 0 && fin(t.net)) return t.net / t.risk;
  return null;
};

function group(ts: ScoredTrade[]): RuleGroup {
  const rs = ts.map(rOf).filter(fin);
  const wins = ts.filter(t => t.net > 0.01).length;
  const totalR = rs.reduce((a, b) => a + b, 0);
  return { n: ts.length, wins, winRate: ts.length ? wins / ts.length : null, rN: rs.length, totalR, avgR: rs.length ? totalR / rs.length : null };
}

/** Score every rule over the trades. Sorted by cost, most expensive break first; rules without a cost last. */
export function scoreRules(trades: ScoredTrade[], rules: RuleDef[] = RULES): RuleScore[] {
  const out = rules.map(rule => {
    const f = trades.filter(t => t.marks[rule.id] === 'y');
    const b = trades.filter(t => t.marks[rule.id] === 'n');
    const followed = group(f), broken = group(b);
    const cost = followed.avgR != null && broken.avgR != null ? (broken.avgR - followed.avgR) * broken.rN : null;
    return { rule, followed, broken, na: trades.filter(t => t.marks[rule.id] === 'na').length, cost, small: Math.min(followed.n, broken.n) < SMALL_SAMPLE };
  });
  const order = (s: RuleScore) => (s.cost == null ? (s.broken.n || s.followed.n ? 1e6 : 2e6) : s.cost);
  return out.sort((a, b) => order(a) - order(b) || b.broken.n - a.broken.n);
}

export interface RuleWarning { rule: RuleDef; score: RuleScore }

/** Rules a plan breaks that have cost the owner R before. Worst first. */
export function planWarnings(marks: RuleMarks, scores: RuleScore[]): RuleWarning[] {
  return scores.filter(s => marks[s.rule.id] === 'n' && s.cost != null && s.cost < 0).map(s => ({ rule: s.rule, score: s }));
}

/** "−4.2R" with a real minus sign. */
export const fmtR = (r: number, d = 1) => `${r < 0 ? '−' : r > 0 ? '+' : ''}${Math.abs(r).toFixed(d)}R`;
