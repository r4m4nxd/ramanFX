// Live progress through a mentor's cradle-to-grave checklist for one trade (the Check mode's goal gradient).
import type { Checklist } from './checklists';

// Every numbered stage plus the Never list gates the trade; "See it on any chart" is recognition practice, not a gate.
export function tradeProgress(list: Checklist, ticks: readonly string[]) {
  const on = new Set(ticks);
  const gates = list.stages.filter(s => s.kind !== 'visual');
  const per = gates.map(s => ({ s, done: s.items.filter(i => on.has(i.id)).length, total: s.items.length }));
  const done = per.reduce((a, x) => a + x.done, 0);
  const total = per.reduce((a, x) => a + x.total, 0);
  const curIdx = per.findIndex(x => x.done < x.total);
  return { per, done, total, pct: total ? done / total : 0, cur: curIdx < 0 ? null : per[curIdx], curIdx, steps: per.length, ready: total > 0 && done === total };
}
