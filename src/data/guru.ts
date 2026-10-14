import { useMemo } from 'react';
import { useStore, DEFAULT_RISK_RULES } from './store';
import { useEnriched } from './derived';
import { balanceSeries, type EnrichedTrade } from '@/core/stats';
import { evaluatePlan, judgeTrade, matchPlan, type Plan, type TradeFacts, type TradeVerdict, type Verdict } from '@/core/strategy';
import type { ExitData } from '@/core/types';

export interface Graded { t: EnrichedTrade; plan: Plan | null; eval: Verdict | null; verdict: TradeVerdict; facts: TradeFacts }

export const usePlans = () => {
  const plans = useStore(s => s.plans);
  return useMemo(() => plans.filter(p => !p.deleted), [plans]);
};

const num = (v: string | number | null | undefined) => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return isFinite(n) && n !== 0 ? n : null; };

/** Excursions in account money for a whole position, from the excursion export. */
export function excursionMoney(e: ExitData | undefined): { mae: number | null; mfe: number | null } {
  if (!e) return { mae: null, mfe: null };
  const dpp = e.dollarPerPt ?? (e.profitDol != null && e.profitPts ? e.profitDol / e.profitPts : null);
  if (!dpp) return { mae: null, mfe: null };
  return { mae: e.mae != null ? Math.abs(e.mae) * Math.abs(dpp) : null, mfe: e.mfe != null ? Math.max(0, e.mfe) * Math.abs(dpp) : null };
}

/** Every trade with its plan (linked or matched), the plan's grade, and the post-trade verdict. */
export function useGraded(): Graded[] {
  const et = useEnriched();
  const plans = usePlans();
  const exitData = useStore(s => s.exitData);
  const trades = useStore(s => s.trades);
  const deposits = useStore(s => s.deposits);
  const accounts = useStore(s => s.accounts);
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const riskPct = rules.riskPercent ?? 1;

  return useMemo(() => {
    // Balance per account just before each entry.
    const series = new Map<string, { t: number; balance: number }[]>();
    const balAt = (acct: string, t: number) => {
      if (typeof accounts[acct]?.snapshot?.balance !== 'number') return null;
      let s = series.get(acct);
      if (!s) { s = balanceSeries(trades, deposits, accounts, acct); series.set(acct, s); }
      let b: number | null = null;
      for (const p of s) { if (p.t <= t) b = p.balance; else break; }
      return b;
    };
    const byOpen = [...et].sort((a, b) => a.open.getTime() - b.open.getTime());
    const losses = byOpen.filter(t => t.outcome === 'loss').map(t => t.close.getTime()).sort((a, b) => a - b);
    const vols = new Map<string, number[]>();
    for (const t of et) vols.set(t.sym, [...(vols.get(t.sym) ?? []), t.volume]);
    const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)] || 0; };
    const med = new Map([...vols].map(([k, v]) => [k, median(v)]));

    return et.map(t => {
      const plan = matchPlan(plans, { id: t.id, sym: t.sym, type: t.type, open: t.open, openPrice: t.openPrice });
      const ex = excursionMoney(exitData[t.id]);
      const open = t.open.getTime();
      let lastLoss: number | null = null;
      for (const l of losses) { if (l <= open) lastLoss = l; else break; }
      const m = med.get(t.sym) || 0;
      const facts: TradeFacts = {
        side: t.type, entry: t.openPrice, exit: t.closePrice, finalStop: num(t.sl), finalTarget: num(t.tp), net: t.net,
        risk: t.risk, r: t.r, balance: balAt(t.account, open), maeMoney: ex.mae, mfeMoney: ex.mfe, holdSec: t.holdSec,
        minutesSinceLastLoss: lastLoss != null ? (open - lastLoss) / 60000 : null,
        sizeVsAvg: m > 0 ? t.volume / m : null,
      };
      return { t, plan, eval: plan ? evaluatePlan(plan, riskPct) : null, verdict: judgeTrade(facts, plan, riskPct), facts };
    });
  }, [et, plans, exitData, trades, deposits, accounts, riskPct]);
}

export function useGradedTrade(id: string | undefined): Graded | null {
  const all = useGraded();
  return useMemo(() => all.find(g => g.t.id === id) ?? null, [all, id]);
}

/** Shape the insight engine reads. */
export function toInsight(g: Graded, exits: Record<string, ExitData>): import('@/core/insights').InsightTrade {
  const ex = excursionMoney(exits[g.t.id]);
  return {
    id: g.t.id, sym: g.t.sym, net: g.t.net, r: g.t.r, volume: g.t.volume, holdSec: g.t.holdSec, open: g.t.open, close: g.t.close,
    outcome: g.t.outcome, session: g.t.session, planned: !!g.plan, odds: g.eval?.odds ?? null, tradeable: g.eval ? g.eval.tradeable : null,
    adherence: g.verdict.adherence, mfeR: g.t.risk && ex.mfe != null ? ex.mfe / g.t.risk : null,
    riskPct: g.t.risk && g.facts.balance ? (g.t.risk / g.facts.balance) * 100 : null, maxRiskPct: g.eval?.mgmt.maxRiskPct ?? null,
  };
}
