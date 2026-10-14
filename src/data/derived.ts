import { useMemo } from 'react';
import { useStore } from './store';
import { balanceSeries, computeStats, enrich, groupStats, maxDrawdownPct, normTag, riskAdjusted, traderScore, type EnrichedTrade } from '@/core/stats';
import { dayKey, parseTs } from '@/core/time';

/** Trades for the active account (before the date filter). */
export function useAccountTrades() {
  const trades = useStore(s => s.trades);
  const acct = useStore(s => s.activeAccount);
  return useMemo(() => (acct === 'all' ? trades : trades.filter(t => t.account === acct)), [trades, acct]);
}

/** Every closed trade enriched (net, R, session…), measured against the full history. */
export function useEnriched(): EnrichedTrade[] {
  const all = useStore(s => s.trades);
  const notes = useStore(s => s.notes);
  const overrides = useStore(s => s.overrides);
  const exits = useStore(s => s.exitData);
  const scoped = useAccountTrades();
  return useMemo(() => enrich(scoped, notes, overrides, all, exits), [scoped, notes, overrides, all, exits]);
}

export function inRange(t: EnrichedTrade, from: string | null, to: string | null) {
  const k = dayKey(t.close);
  return (!from || k >= from) && (!to || k <= to);
}

/** Enriched trades filtered by account AND the global date range. */
export function useFiltered(): EnrichedTrade[] {
  const et = useEnriched();
  const { from, to } = useStore(s => s.range);
  return useMemo(() => (from || to ? et.filter(t => inRange(t, from, to)) : et), [et, from, to]);
}

export function useAnalytics() {
  const et = useFiltered();
  const trades = useStore(s => s.trades);
  const deposits = useStore(s => s.deposits);
  const accounts = useStore(s => s.accounts);
  const acct = useStore(s => s.activeAccount);
  const notes = useStore(s => s.notes);
  const { from, to } = useStore(s => s.range);

  return useMemo(() => {
    const stats = computeStats(et);
    // Balance across the full history, then cut to the range so the curve starts at the real balance.
    const full = balanceSeries(trades, deposits, accounts, acct);
    const hasSnapshot = Object.values(accounts).some(a => (acct === 'all' || a.id === acct) && typeof a.snapshot?.balance === 'number');
    const fromT = from ? parseTs(from.replace(/-/g, '.'))!.getTime() : -Infinity;
    const toT = to ? parseTs(to.replace(/-/g, '.'))!.getTime() + 86_399_999 : Infinity;
    let balance = full.filter(p => p.t >= fromT && p.t <= toT);
    const before = full.filter(p => p.t < fromT).pop();
    if (before) balance = [{ ...before, t: fromT }, ...balance];
    const ddPct = hasSnapshot ? maxDrawdownPct(balance) : null;
    const balAt = (day: string) => {
      const t = parseTs(day.replace(/-/g, '.'))!.getTime();
      let b: number | null = null;
      for (const p of full) { if (p.t < t) b = p.balance; else break; }
      return hasSnapshot ? b : null;
    };
    const ra = riskAdjusted(stats.days, balAt);
    const journaled = et.filter(t => notes[t.id] && ((notes[t.id].tags?.length ?? 0) > 0 || notes[t.id].strategyId || (notes[t.id].mistakes?.length ?? 0) > 0));
    const adherence = journaled.length >= 5 ? journaled.filter(t => !(notes[t.id].mistakes?.length)).length / journaled.length : null;
    const score = traderScore(stats, ddPct, adherence);
    const setups = groupStats(et, t => { const n = notes[t.id]; const tags = [...new Set((n?.tags ?? []).map(normTag))]; return tags.length ? tags : n ? '(no setup tag)' : '(not journaled)'; });
    const mistakes = groupStats(et, t => notes[t.id]?.mistakes?.length ? [...new Set(notes[t.id].mistakes!.map(normTag))] : null).sort((a, b) => a.net - b.net);
    const symbols = groupStats(et, t => t.sym);
    const sessions = groupStats(et, t => t.session);
    return { et, stats, balance, hasSnapshot, ddPct, ...ra, score, setups, mistakes, symbols, sessions };
  }, [et, trades, deposits, accounts, acct, notes, from, to]);
}
