import type { Account, Deposit, InstrumentOverride, Trade, TradeNote } from './types';
import { dayKey, parseTs, sessionOf, type Session } from './time';
import { measuredUnitValues, normalizeSymbol, specFor, unitValue } from './instruments';

export type Outcome = 'win' | 'loss' | 'be';

export interface EnrichedTrade extends Trade {
  net: number;
  open: Date;
  close: Date;
  holdSec: number;
  sym: string;
  session: Session;
  outcome: Outcome;
  /** Initial risk in account currency (stop distance × value × lots), when knowable. */
  risk: number | null;
  r: number | null;
  riskSource: 'override' | 'stop' | null;
}

/** Below this absolute net a trade counts as breakeven (commission-only scratches). */
export const BE_EPS = 0.01;

export const netOf = (t: Pick<Trade, 'profit' | 'commission' | 'swap'>) => (t.profit || 0) + (t.commission || 0) + (t.swap || 0);

export function enrich(trades: Trade[], notes: Record<string, TradeNote> = {}, overrides: Record<string, InstrumentOverride> = {}, allForMeasure: Trade[] = trades): EnrichedTrade[] {
  const measured = measuredUnitValues(allForMeasure);
  const out: EnrichedTrade[] = [];
  for (const t of trades) {
    const open = parseTs(t.openTime), close = parseTs(t.closeTime);
    if (!open || !close) continue;
    const net = netOf(t);
    const sym = normalizeSymbol(t.symbol);
    let risk: number | null = null, riskSource: EnrichedTrade['riskSource'] = null;
    const ov = notes[t.id]?.riskOverride;
    if (ov && ov > 0) { risk = ov; riskSource = 'override'; }
    else {
      const sl = typeof t.sl === 'number' ? t.sl : parseFloat(String(t.sl));
      // Only a stop on the losing side of entry describes initial risk. A stop moved to
      // breakeven or trailed into profit no longer does, so R is left unknown.
      const valid = sl > 0 && (t.type === 'buy' ? sl < t.openPrice : sl > t.openPrice);
      if (valid) {
        const uv = unitValue(specFor(sym, overrides[sym]), measured).value;
        const r = Math.abs(t.openPrice - sl) * uv * t.volume;
        if (r > 0) { risk = r; riskSource = 'stop'; }
      }
    }
    out.push({
      ...t, net, open, close, sym, holdSec: Math.max(0, (close.getTime() - open.getTime()) / 1000),
      session: sessionOf(open), outcome: Math.abs(net) < BE_EPS ? 'be' : net > 0 ? 'win' : 'loss',
      risk, riskSource, r: risk ? net / risk : null,
    });
  }
  return out.sort((a, b) => a.close.getTime() - b.close.getTime());
}

export interface DayStat { date: string; pnl: number; trades: number; wins: number; losses: number; volume: number }

export interface Stats {
  total: number;
  wins: number; losses: number; breakeven: number;
  net: number; grossWin: number; grossLoss: number;
  /** wins ÷ (wins + losses) — breakeven trades excluded, as most journals do. */
  winRate: number;
  profitFactor: number | null;        // null when there are no losses
  avgWin: number; avgLoss: number;
  payoff: number | null;              // avgWin ÷ |avgLoss|
  breakevenWinRate: number | null;    // win rate needed to break even at this payoff
  expectancy: number;                 // net per trade
  avgR: number | null; rCount: number; totalR: number;
  largestWin: number; largestLoss: number;
  avgHoldWin: number; avgHoldLoss: number;
  maxConsecWins: number; maxConsecLosses: number;
  currentStreak: { kind: 'win' | 'loss' | null; count: number };
  days: DayStat[];
  dayWinRate: number; greenDays: number; redDays: number;
  bestDay: DayStat | null; worstDay: DayStat | null;
  avgDailyPnl: number;
  equity: { t: number; date: string; cum: number; dd: number }[];
  maxDrawdown: number;                // on cumulative P&L, account currency
  recoveryFactor: number | null;      // net ÷ max drawdown
  volume: number;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function computeStats(et: EnrichedTrade[]): Stats {
  const wins = et.filter(t => t.outcome === 'win'), losses = et.filter(t => t.outcome === 'loss');
  const grossWin = sum(wins.map(t => t.net)), grossLoss = -sum(losses.map(t => t.net));
  const net = sum(et.map(t => t.net));
  const decided = wins.length + losses.length;
  const avgWin = wins.length ? grossWin / wins.length : 0;
  const avgLoss = losses.length ? -grossLoss / losses.length : 0;
  const payoff = wins.length && losses.length ? avgWin / Math.abs(avgLoss) : null;
  const withR = et.filter(t => t.r != null);

  // Streaks ignore breakeven trades instead of letting them reset or end a streak.
  let cw = 0, cl = 0, maxW = 0, maxL = 0;
  for (const t of et) {
    if (t.outcome === 'win') { cw++; cl = 0; maxW = Math.max(maxW, cw); }
    else if (t.outcome === 'loss') { cl++; cw = 0; maxL = Math.max(maxL, cl); }
  }
  const currentStreak = cw ? { kind: 'win' as const, count: cw } : cl ? { kind: 'loss' as const, count: cl } : { kind: null, count: 0 };

  const dayMap = new Map<string, DayStat>();
  for (const t of et) {
    const k = dayKey(t.close);
    const d = dayMap.get(k) ?? { date: k, pnl: 0, trades: 0, wins: 0, losses: 0, volume: 0 };
    d.pnl += t.net; d.trades++; d.volume += t.volume;
    if (t.outcome === 'win') d.wins++; else if (t.outcome === 'loss') d.losses++;
    dayMap.set(k, d);
  }
  const days = [...dayMap.values()].sort((a, b) => a.date.localeCompare(b.date));
  const greenDays = days.filter(d => d.pnl >= BE_EPS).length, redDays = days.filter(d => d.pnl <= -BE_EPS).length;

  let cum = 0, peak = 0, maxDD = 0;
  const equity = et.map(t => {
    cum += t.net; peak = Math.max(peak, cum);
    const dd = peak - cum; maxDD = Math.max(maxDD, dd);
    return { t: t.close.getTime(), date: dayKey(t.close), cum, dd: -dd };
  });

  const holdAvg = (xs: EnrichedTrade[]) => (xs.length ? sum(xs.map(t => t.holdSec)) / xs.length : 0);
  return {
    total: et.length, wins: wins.length, losses: losses.length, breakeven: et.length - decided,
    net, grossWin, grossLoss,
    winRate: decided ? wins.length / decided : 0,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : null,
    avgWin, avgLoss, payoff,
    breakevenWinRate: payoff != null ? 1 / (1 + payoff) : null,
    expectancy: et.length ? net / et.length : 0,
    avgR: withR.length ? sum(withR.map(t => t.r!)) / withR.length : null,
    rCount: withR.length, totalR: sum(withR.map(t => t.r!)),
    largestWin: wins.length ? Math.max(...wins.map(t => t.net)) : 0,
    largestLoss: losses.length ? Math.min(...losses.map(t => t.net)) : 0,
    avgHoldWin: holdAvg(wins), avgHoldLoss: holdAvg(losses),
    maxConsecWins: maxW, maxConsecLosses: maxL, currentStreak,
    days, greenDays, redDays,
    dayWinRate: greenDays + redDays ? greenDays / (greenDays + redDays) : 0,
    bestDay: days.length ? days.reduce((a, b) => (b.pnl > a.pnl ? b : a)) : null,
    worstDay: days.length ? days.reduce((a, b) => (b.pnl < a.pnl ? b : a)) : null,
    avgDailyPnl: days.length ? net / days.length : 0,
    equity, maxDrawdown: maxDD,
    recoveryFactor: maxDD > 0 ? net / maxDD : null,
    volume: sum(et.map(t => t.volume)),
  };
}

// ─── Grouped breakdowns ────────────────────────────────────────────────
export interface GroupStat {
  key: string; n: number; wins: number; losses: number; net: number;
  winRate: number; profitFactor: number | null; expectancy: number; avgR: number | null;
}

export function groupStats(et: EnrichedTrade[], keyOf: (t: EnrichedTrade) => string | string[] | null): GroupStat[] {
  const m = new Map<string, EnrichedTrade[]>();
  for (const t of et) {
    const k = keyOf(t);
    if (k == null) continue;
    for (const key of Array.isArray(k) ? k : [k]) {
      const arr = m.get(key) ?? [];
      arr.push(t); m.set(key, arr);
    }
  }
  return [...m.entries()].map(([key, xs]) => {
    const w = xs.filter(t => t.outcome === 'win'), l = xs.filter(t => t.outcome === 'loss');
    const gw = sum(w.map(t => t.net)), gl = -sum(l.map(t => t.net));
    const rs = xs.filter(t => t.r != null).map(t => t.r!);
    return {
      key, n: xs.length, wins: w.length, losses: l.length, net: gw - gl + sum(xs.filter(t => t.outcome === 'be').map(t => t.net)),
      winRate: w.length + l.length ? w.length / (w.length + l.length) : 0,
      profitFactor: gl > 0 ? gw / gl : null,
      expectancy: xs.length ? sum(xs.map(t => t.net)) / xs.length : 0,
      avgR: rs.length ? sum(rs) / rs.length : null,
    };
  }).sort((a, b) => b.net - a.net);
}

// ─── Balance reconstruction ────────────────────────────────────────────
/**
 * Rebuild each account's balance through time. When an import carried a balance snapshot we
 * walk BACKWARD from it (exact, needs no starting balance). Otherwise we walk forward from the
 * first deposit. Accounts are combined by summing their balances at every event.
 */
export function balanceSeries(trades: Trade[], deposits: Deposit[], accounts: Record<string, Account>, accountFilter: string | 'all'): { t: number; balance: number; deposits: number }[] {
  const ids = new Set<string>();
  for (const t of trades) ids.add(t.account);
  for (const d of deposits) if (d.account) ids.add(d.account);
  const want = [...ids].filter(id => accountFilter === 'all' || id === accountFilter);
  type Ev = { t: number; acct: string; amount: number; dep: boolean };
  const evs: Ev[] = [];
  for (const t of trades) { if (!want.includes(t.account)) continue; const d = parseTs(t.closeTime); if (d) evs.push({ t: d.getTime(), acct: t.account, amount: netOf(t), dep: false }); }
  for (const d of deposits) { const acct = d.account ?? 'default'; if (!want.includes(acct)) continue; const dt = parseTs(d.time); if (dt) evs.push({ t: dt.getTime(), acct, amount: d.amount || 0, dep: true }); }
  evs.sort((a, b) => a.t - b.t);
  const bal: Record<string, number> = {}, depTot: Record<string, number> = {};
  for (const id of want) {
    const snap = accounts[id]?.snapshot?.balance;
    const total = evs.filter(e => e.acct === id).reduce((a, e) => a + e.amount, 0);
    bal[id] = typeof snap === 'number' ? snap - total : 0; // balance before the first event
    depTot[id] = 0;
  }
  const out: { t: number; balance: number; deposits: number }[] = [];
  if (evs.length) out.push({ t: evs[0].t - 1, balance: sum(Object.values(bal)), deposits: 0 });
  for (const e of evs) {
    bal[e.acct] += e.amount;
    if (e.dep) depTot[e.acct] += e.amount;
    out.push({ t: e.t, balance: sum(Object.values(bal)), deposits: sum(Object.values(depTot)) });
  }
  return out;
}

/** Max drawdown as % of running peak balance. */
export function maxDrawdownPct(series: { balance: number }[]): number | null {
  let peak = -Infinity, dd = 0;
  for (const p of series) {
    peak = Math.max(peak, p.balance);
    if (peak > 0) dd = Math.max(dd, (peak - p.balance) / peak);
  }
  return peak > 0 ? dd : null;
}

// ─── Risk-adjusted returns ─────────────────────────────────────────────
/**
 * Sharpe / Sortino from daily returns over EVERY weekday between the first and last trade day
 * (no-trade days count as 0 — skipping them overstates both ratios). Returns are % of the
 * balance at the start of the day when a balance is known, otherwise raw P&L.
 * Annualised with √252. Needs at least 20 days to mean anything.
 */
export function riskAdjusted(days: DayStat[], balanceAtDay?: (date: string) => number | null): { sharpe: number | null; sortino: number | null; n: number } {
  if (!days.length) return { sharpe: null, sortino: null, n: 0 };
  const byDay = new Map(days.map(d => [d.date, d.pnl]));
  const start = parseTs(days[0].date.replace(/-/g, '.'))!, end = parseTs(days[days.length - 1].date.replace(/-/g, '.'))!;
  const rets: number[] = [];
  for (const d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const wd = d.getDay();
    const k = dayKey(d);
    if ((wd === 0 || wd === 6) && !byDay.has(k)) continue;
    const pnl = byDay.get(k) ?? 0;
    const b = balanceAtDay?.(k);
    rets.push(b && b > 0 ? pnl / b : pnl);
  }
  const n = rets.length;
  if (n < 20) return { sharpe: null, sortino: null, n };
  const mean = sum(rets) / n;
  const sd = Math.sqrt(sum(rets.map(r => (r - mean) ** 2)) / (n - 1));
  const downside = Math.sqrt(sum(rets.map(r => Math.min(0, r) ** 2)) / n);
  return { sharpe: sd > 0 ? (mean / sd) * Math.sqrt(252) : null, sortino: downside > 0 ? (mean / downside) * Math.sqrt(252) : null, n };
}

// ─── Trader score ──────────────────────────────────────────────────────
export const MIN_SCORE_TRADES = 20;

export interface ScoreAxis { key: string; label: string; value: number; hint: string }

const clamp = (v: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));

/**
 * 0–100 composite. Each axis is scored against what makes a strategy profitable, not against
 * a fixed ideal: win rate is judged relative to the breakeven win rate implied by the payoff,
 * so a 35% / 3R trader isn't punished. Returns null below MIN_SCORE_TRADES.
 */
export function traderScore(s: Stats, ddPct: number | null, adherence: number | null): { score: number; axes: ScoreAxis[] } | null {
  if (s.total < MIN_SCORE_TRADES) return null;
  const edge = s.breakevenWinRate != null ? s.winRate - s.breakevenWinRate : s.winRate - 0.5;
  const pf = s.profitFactor ?? (s.grossWin > 0 ? 3 : 0);
  const best = s.bestDay && s.net > 0 ? s.bestDay.pnl / s.net : 1;
  const axes: ScoreAxis[] = [
    { key: 'edge', label: 'Win rate vs breakeven', value: clamp(50 + edge * 250), hint: 'How far your win rate sits above the rate needed to break even at your payoff.' },
    { key: 'pf', label: 'Profit factor', value: clamp(((pf - 1) / 1.5) * 100), hint: '1.0 scores 0, 2.5+ scores 100.' },
    { key: 'payoff', label: 'Avg win ÷ avg loss', value: clamp(((s.payoff ?? 3) / 3) * 100), hint: '3:1 or better scores 100.' },
    ddPct != null
      ? { key: 'dd', label: 'Drawdown control', value: clamp(100 - ddPct * 500), hint: 'Max drawdown as % of peak balance; 20% scores 0.' }
      : { key: 'dd', label: 'Recovery factor', value: clamp(((s.recoveryFactor ?? 0) / 3) * 100), hint: 'Net profit ÷ max drawdown; 3+ scores 100.' },
    { key: 'consistency', label: 'Consistency', value: s.net > 0 ? clamp(100 - Math.max(0, best - 0.2) * 200) : clamp(s.dayWinRate * 50), hint: 'Share of profit from your best day; 20% or less scores 100 (prop-firm style).' },
  ];
  if (adherence != null) axes.push({ key: 'rules', label: 'Plan adherence', value: clamp(adherence * 100), hint: 'Journaled trades with a setup and no mistake tags.' });
  return { score: sum(axes.map(a => a.value)) / axes.length, axes };
}
