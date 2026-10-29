import { describe, expect, it } from 'vitest';
import { CHECKLISTS } from './checklists';
import { tradeProgress } from './checklistProgress';

describe('tradeProgress', () => {
  const list = CHECKLISTS.raja;
  const gates = list.stages.filter(s => s.kind !== 'visual');
  it('starts on step 1 with nothing done', () => {
    const p = tradeProgress(list, []);
    expect(p.done).toBe(0);
    expect(p.curIdx).toBe(0);
    expect(p.cur?.s.id).toBe('s0');
    expect(p.steps).toBe(gates.length);
    expect(p.ready).toBe(false);
  });
  it('moves to the first unfinished stage', () => {
    const p = tradeProgress(list, gates[0].items.map(i => i.id));
    expect(p.curIdx).toBe(1);
    expect(p.pct).toBeGreaterThan(0);
  });
  it('is ready only when every stage and every Never is ticked; visual cues are not required', () => {
    const allButNever = gates.filter(s => s.kind !== 'never').flatMap(s => s.items.map(i => i.id));
    expect(tradeProgress(list, allButNever).ready).toBe(false);
    expect(tradeProgress(list, allButNever).cur?.s.kind).toBe('never');
    const p = tradeProgress(list, gates.flatMap(s => s.items.map(i => i.id)));
    expect(p.ready).toBe(true);
    expect(p.pct).toBe(1);
    expect(p.cur).toBeNull();
  });
  it('ignores stale tick ids', () => {
    expect(tradeProgress(list, ['raja.s99.0', 'nope']).done).toBe(0);
  });
});
