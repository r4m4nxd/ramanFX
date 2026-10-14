// Replays closed trades under different trade-management rules using each trade's MAE/MFE in R.
// Exact where the order of the extremes is known (RamanFX export timing); otherwise the
// conservative assumption is used: the adverse extreme came first.

export interface Path {
  /** Realised R as traded. */
  r: number;
  /** Max favourable / adverse excursion, in R (both ≥ 0). */
  mfe: number;
  mae: number;
  /** True when the best price came before the worst; null when unknown. */
  mfeFirst: boolean | null;
}

export type RuleId = 'actual' | 'tp1' | 'tp2' | 'tp3' | 'be1' | 'be05tp1' | 'be1tp3' | 'half';
export const RULES: { id: RuleId; name: string; desc: string; odds: 'low' | 'high' | 'any' }[] = [
  { id: 'actual', name: 'As you traded', desc: 'What really happened', odds: 'any' },
  { id: 'tp1', name: 'Fixed 1:1', desc: 'Stop at 1R, target at 1R', odds: 'low' },
  { id: 'be05tp1', name: 'BE at 0.5R, TP 1:1', desc: 'Low-odds aggressive management', odds: 'low' },
  { id: 'be1', name: 'Alert at 1:1 → breakeven', desc: 'His favourite: risk off at 1R, keep the exit you took', odds: 'low' },
  { id: 'tp2', name: 'Fixed 1:2', desc: 'Stop at 1R, target at 2R', odds: 'any' },
  { id: 'tp3', name: 'Fixed 1:3', desc: 'High-odds non-aggressive', odds: 'high' },
  { id: 'be1tp3', name: 'BE at 1R, TP 1:3', desc: 'High odds, protected', odds: 'high' },
  { id: 'half', name: 'Half risk at 1R', desc: 'Stop to −0.5R once 1R is reached', odds: 'any' },
];

/** Result in R of one trade under a rule. The stop is always 1R (initial risk). */
export function replay(p: Path, rule: RuleId): number {
  const lossFirst = p.mfeFirst === false || p.mfeFirst === null; // conservative when unknown
  const stopped = p.mae >= 1;
  const reached = (x: number) => p.mfe >= x && !(stopped && lossFirst);
  const target = (x: number) => (reached(x) ? x : stopped ? -1 : p.r);
  // After reaching `at`, the stop moves to `to` (in R). Did price come back to it afterwards?
  const protectedAt = (at: number, to: number, fallback: number) => {
    if (!reached(at)) return stopped ? -1 : p.r;
    // Came back below the protected stop after the high: only provable when MAE came after MFE.
    const cameBack = p.mfeFirst === true ? p.mae > -to || p.r <= to : p.r <= to;
    return cameBack ? to : fallback;
  };
  switch (rule) {
    case 'actual': return p.r;
    case 'tp1': return target(1);
    case 'tp2': return target(2);
    case 'tp3': return target(3);
    case 'be1': return protectedAt(1, 0, Math.max(0, p.r));
    case 'be05tp1': return reached(1) ? 1 : protectedAt(0.5, 0, Math.max(0, p.r));
    case 'be1tp3': return reached(3) ? 3 : protectedAt(1, 0, Math.max(0, p.r));
    case 'half': return protectedAt(1, -0.5, Math.max(-0.5, p.r));
  }
}

export interface RuleResult { id: RuleId; name: string; desc: string; totalR: number; avgR: number; winRate: number; n: number }

export function simulate(paths: Path[]): RuleResult[] {
  return RULES.map(r => {
    const xs = paths.map(p => replay(p, r.id));
    const wins = xs.filter(x => x > 0.01).length, losses = xs.filter(x => x < -0.01).length;
    const totalR = xs.reduce((a, b) => a + b, 0);
    return { id: r.id, name: r.name, desc: r.desc, totalR, avgR: xs.length ? totalR / xs.length : 0, winRate: wins + losses ? wins / (wins + losses) : 0, n: xs.length };
  });
}
