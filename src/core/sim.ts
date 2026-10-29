// Monte Carlo engines for the calculators. Seeded so results stay put while you type.

export function rng(seed = 42) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export const quantile = (xs: ArrayLike<number>, p: number) => {
  const s = Array.from(xs).sort((a, b) => a - b);
  if (!s.length) return NaN;
  const i = (s.length - 1) * p, lo = Math.floor(i), hi = Math.ceil(i);
  return s[lo] + (s[hi] - s[lo]) * (i - lo);
};

// ─── Equity-curve Monte Carlo ────────────────────────────────────────
export interface McInput {
  start: number; trades: number; runs: number; win: number;
  /** 'fixed': every win/loss is avgWin/avgLoss in money. 'pct': risk riskPct of current equity, wins pay riskPct × payoff. */
  mode: 'fixed' | 'pct'; avgWin: number; avgLoss: number; riskPct: number;
  /** Equity level counted as blown (e.g. 0.5 × start). */
  ruinLevel: number; samples?: number; seed?: number;
}
export interface McResult {
  bands: { t: number; p5: number; p25: number; p50: number; p75: number; p95: number }[];
  samples: number[][]; finals: number[]; maxDDs: number[];
  pProfit: number; pRuin: number; expectancy: number; kelly: number | null;
}

export function monteCarlo(i: McInput): McResult {
  const r = rng(i.seed ?? 42);
  const T = Math.max(1, Math.round(i.trades)), N = Math.max(1, Math.round(i.runs)), S = Math.min(N, i.samples ?? 40);
  const payoff = i.avgLoss > 0 ? i.avgWin / i.avgLoss : 0;
  const cols: Float64Array[] = Array.from({ length: T + 1 }, () => new Float64Array(N));
  const finals: number[] = [], maxDDs: number[] = [], samples: number[][] = [];
  let ruined = 0;
  for (let k = 0; k < N; k++) {
    let eq = i.start, peak = eq, dd = 0, dead = false;
    const path = k < S ? [eq] : null;
    cols[0][k] = eq;
    for (let t = 1; t <= T; t++) {
      if (!dead) {
        const w = r() < i.win;
        if (i.mode === 'fixed') eq += w ? i.avgWin : -i.avgLoss;
        else eq *= w ? 1 + i.riskPct * payoff : 1 - i.riskPct;
        if (eq > peak) peak = eq;
        if (peak > 0) dd = Math.max(dd, (peak - eq) / peak);
        if (eq <= i.ruinLevel) { dead = true; ruined++; }
      }
      cols[t][k] = eq;
      path?.push(eq);
    }
    finals.push(eq); maxDDs.push(dd);
    if (path) samples.push(path);
  }
  const bands = cols.map((c, t) => ({ t, p5: quantile(c, 0.05), p25: quantile(c, 0.25), p50: quantile(c, 0.5), p75: quantile(c, 0.75), p95: quantile(c, 0.95) }));
  const expectancy = i.win * i.avgWin - (1 - i.win) * i.avgLoss;
  return { bands, samples, finals, maxDDs, pProfit: finals.filter(f => f > i.start).length / N, pRuin: ruined / N, expectancy, kelly: payoff > 0 ? i.win - (1 - i.win) / payoff : null };
}

// ─── Drawdown recovery ───────────────────────────────────────────────
/** Trades needed to climb from `now` back to `peak`, risking riskPct of equity per trade. */
export function recoverySim(o: { now: number; peak: number; win: number; payoff: number; riskPct: number; maxTrades: number; blowLevel: number; runs: number; seed?: number }) {
  const r = rng(o.seed ?? 7);
  const hits: number[] = [];
  let blown = 0, stuck = 0;
  for (let k = 0; k < o.runs; k++) {
    let eq = o.now, t = 0;
    while (t < o.maxTrades) {
      t++;
      eq *= r() < o.win ? 1 + o.riskPct * o.payoff : 1 - o.riskPct;
      if (eq >= o.peak) { hits.push(t); break; }
      if (eq <= o.blowLevel) { blown++; break; }
    }
    if (t >= o.maxTrades && eq < o.peak && eq > o.blowLevel) stuck++;
  }
  return { pRecover: hits.length / o.runs, pBlow: blown / o.runs, pStuck: stuck / o.runs, median: hits.length ? quantile(hits, 0.5) : null, p90: hits.length ? quantile(hits, 0.9) : null, hits };
}

// ─── Prop firm challenge ─────────────────────────────────────────────
export interface PropPhase {
  /** Profit target as a fraction of the starting balance (0.1 = 10%). 0 for a funded stage. */
  target: number;
  /** Max loss in one day as a fraction of the starting balance; null if the firm has none. */
  dailyLoss: number | null;
  /** Max overall loss as a fraction of the starting balance. */
  maxLoss: number;
  /** Max loss trails the highest end-of-day balance (stops trailing at the starting balance). */
  trailing: boolean;
  minDays: number;
  maxDays: number | null;
}
export interface PropInput { size: number; phases: PropPhase[]; tradesPerDay: number; win: number; payoff: number; riskPct: number; split: number; fee: number; fundedDays: number; runs: number; seed?: number }
export type FailReason = 'daily' | 'max' | 'time';
export interface PropResult {
  pPass: number; phasePass: number[]; medianDays: number | null; ev: number; avgPayout: number;
  fails: Record<FailReason, number>; maxDDPassed: number | null;
}

function runPhase(p: PropPhase, size: number, tpd: number, win: number, payoff: number, riskAmt: number, r: () => number, capDays: number) {
  let bal = size, peakEod = size, dd = 0;
  const target = size * (1 + p.target);
  const days = p.maxDays ?? capDays;
  for (let d = 1; d <= days; d++) {
    const dayStart = bal;
    for (let k = 0; k < tpd; k++) {
      bal += r() < win ? riskAmt * payoff : -riskAmt;
      const floor = p.trailing ? Math.min(size, peakEod - p.maxLoss * size) : size - p.maxLoss * size;
      dd = Math.max(dd, (Math.max(size, peakEod) - bal) / size);
      if (p.dailyLoss != null && dayStart - bal >= p.dailyLoss * size) return { ok: false as const, why: 'daily' as FailReason, days: d, bal, dd };
      if (bal <= floor) return { ok: false as const, why: 'max' as FailReason, days: d, bal, dd };
      if (p.target > 0 && bal >= target) break; // stop for the day once the target is in
    }
    peakEod = Math.max(peakEod, bal);
    if (p.target > 0 && bal >= target && d >= p.minDays) return { ok: true as const, days: d, bal, dd };
  }
  return p.target > 0 ? { ok: false as const, why: 'time' as FailReason, days, bal, dd } : { ok: true as const, days, bal, dd };
}

export function propSim(i: PropInput): PropResult {
  const r = rng(i.seed ?? 11);
  const riskAmt = i.riskPct * i.size;
  const phasePass = i.phases.map(() => 0);
  const fails: Record<FailReason, number> = { daily: 0, max: 0, time: 0 };
  const passDays: number[] = [], dds: number[] = [];
  let payouts = 0;
  for (let k = 0; k < i.runs; k++) {
    let total = 0, passed = true, worst = 0;
    for (let ph = 0; ph < i.phases.length; ph++) {
      const res = runPhase(i.phases[ph], i.size, i.tradesPerDay, i.win, i.payoff, riskAmt, r, 120);
      total += res.days; worst = Math.max(worst, res.dd);
      if (!res.ok) { fails[res.why]++; passed = false; break; }
      phasePass[ph]++;
    }
    if (!passed) continue;
    passDays.push(total); dds.push(worst);
    // One funded period under the last phase's loss rules, no target.
    const last = i.phases[i.phases.length - 1];
    const funded = runPhase({ ...last, target: 0, minDays: 0, maxDays: i.fundedDays }, i.size, i.tradesPerDay, i.win, i.payoff, riskAmt, r, i.fundedDays);
    if (funded.ok) payouts += Math.max(0, funded.bal - i.size) * i.split;
  }
  const n = i.runs;
  return {
    pPass: passDays.length / n, phasePass: phasePass.map(x => x / n), medianDays: passDays.length ? quantile(passDays, 0.5) : null,
    avgPayout: payouts / n, ev: payouts / n - i.fee, fails: { daily: fails.daily / n, max: fails.max / n, time: fails.time / n },
    maxDDPassed: dds.length ? quantile(dds, 0.5) : null,
  };
}

/** Starting points only — firms change rules often; every field stays editable. */
export const PROP_PRESETS: { id: string; name: string; phases: PropPhase[]; split: number; note: string }[] = [
  { id: 'ftmo', name: 'FTMO 2-step', split: 0.8, note: '10% then 5% target, 5% daily, 10% max loss, 4 min days',
    phases: [{ target: 0.1, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 4, maxDays: null }, { target: 0.05, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 4, maxDays: null }] },
  { id: 'fundednext', name: 'FundedNext Stellar 2-step', split: 0.8, note: '8% then 5% target, 5% daily, 10% max loss',
    phases: [{ target: 0.08, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 5, maxDays: null }, { target: 0.05, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 5, maxDays: null }] },
  { id: 'the5ers', name: 'The5%ers High Stakes', split: 0.8, note: '8% then 5% target, 5% daily, 10% max loss',
    phases: [{ target: 0.08, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 3, maxDays: null }, { target: 0.05, dailyLoss: 0.05, maxLoss: 0.1, trailing: false, minDays: 3, maxDays: null }] },
  { id: 'topstep', name: 'Topstep 50K Combine', split: 0.9, note: '$3,000 target, $2,000 trailing max loss (end of day)',
    phases: [{ target: 0.06, dailyLoss: null, maxLoss: 0.04, trailing: true, minDays: 2, maxDays: null }] },
];
