import { useStore } from './store';
import { shared } from './derived';
import { useGraded, type Graded } from './guru';
import { specFor } from '@/core/instruments';
import { dayKey } from '@/core/time';
import { autoMarks, resolveMarks, scoreRules, type RuleContext, type RuleMarks, type RuleScore } from '@/core/ruleScore';

export interface RuleCheck {
  g: Graded;
  /** Everything autoMarks needs except the trade's trend read, so the Trade page can recompute it live. */
  ctx: RuleContext;
  auto: RuleMarks;
  stored: RuleMarks;
  marks: RuleMarks;
  /** The owner has ticked at least one rule on this trade: only these count in the score. */
  reviewed: boolean;
}

/** Every trade (active account) with its rule marks: the owner's ticks over what the data proves. */
export function useRuleChecks(): RuleCheck[] {
  const graded = useGraded();
  const notes = useStore(s => s.notes);
  const exitData = useStore(s => s.exitData);
  const overrides = useStore(s => s.overrides);
  return shared('ruleChecks', [graded, notes, exitData, overrides], () => {
    // Losses per account per day, by close time, for the "no trade after a loss the same day" rule.
    const losses = new Map<string, number[]>();
    for (const { t } of graded) if (t.outcome === 'loss') { const k = `${t.account}|${dayKey(t.close)}`; losses.set(k, [...(losses.get(k) ?? []), t.close.getTime()]); }
    return graded.map(g => {
      const { t, plan, facts } = g;
      const spec = specFor(t.sym, overrides[t.sym]);
      const sameDay = losses.get(`${t.account}|${dayKey(t.open)}`) ?? [];
      const initSl = exitData[t.id]?.initSl;
      const ctx: RuleContext = {
        side: t.type, plan,
        riskPct: facts.risk != null && facts.balance && facts.balance > 0 ? (facts.risk / facts.balance) * 100 : null,
        afterLossSameDay: sameDay.some(c => c <= t.open.getTime()),
        pip: spec.pipSize, digits: spec.digits, entry: t.openPrice, initStop: initSl ?? null,
      };
      const note = notes[t.id];
      const stored = (note?.rules ?? {}) as RuleMarks;
      const auto = autoMarks({ ...ctx, align: note?.align ?? null });
      return { g, ctx, auto, stored, marks: resolveMarks(stored, auto), reviewed: Object.keys(stored).length > 0 };
    });
  });
}

const inRange = (k: string, from: string | null, to: string | null) => (!from || k >= from) && (!to || k <= to);

/** Rule-checked trades in the date range and their score. All-time scores (for the Planner) ignore the range. */
export function useRuleScore(opts: { allTime?: boolean } = {}): { checks: RuleCheck[]; reviewed: RuleCheck[]; scores: RuleScore[] } {
  const all = useRuleChecks();
  const { from, to } = useStore(s => s.range);
  const f = opts.allTime ? null : from, tt = opts.allTime ? null : to;
  return shared(`ruleScore${opts.allTime ? ':all' : ''}`, [all, f, tt], () => {
    const checks = f || tt ? all.filter(c => inRange(dayKey(c.g.t.close), f, tt)) : all;
    const reviewed = checks.filter(c => c.reviewed);
    return { checks, reviewed, scores: scoreRules(reviewed.map(c => ({ id: c.g.t.id, net: c.g.t.net, r: c.g.t.r, risk: c.g.t.risk, marks: c.marks }))) };
  });
}
