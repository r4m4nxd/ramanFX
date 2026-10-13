import { describe, expect, it } from 'vitest';
import { emptyJournal, mergeJournal } from './merge';

describe('mergeJournal', () => {
  it('keeps the newer note per trade and unions trades', () => {
    const local = { ...emptyJournal(), trades: [{ id: '1' } as never], notes: { a: { note: 'local', updatedAt: 5 }, b: { note: 'old', updatedAt: 1 } } };
    const remote = { trades: [{ id: '2' } as never], notes: { b: { note: 'remote', updatedAt: 9 }, c: { note: 'only remote', updatedAt: 3 } } };
    const m = mergeJournal(local, remote);
    expect(m.trades.map(t => t.id).sort()).toEqual(['1', '2']);
    expect(m.notes.a.note).toBe('local');
    expect(m.notes.b.note).toBe('remote');
    expect(m.notes.c.note).toBe('only remote');
  });
  it('open positions come from whichever side imported the account last', () => {
    const local = { ...emptyJournal(), accounts: { A: { id: 'A', lastImport: 10 } as never }, openPositions: [{ id: 'L', account: 'A' } as never] };
    const remote = { accounts: { A: { id: 'A', lastImport: 20 } as never }, openPositions: [{ id: 'R', account: 'A' } as never] };
    expect(mergeJournal(local, remote).openPositions.map(p => p.id)).toEqual(['R']);
  });
  it('never drops local-only checklist ticks', () => {
    const local = { ...emptyJournal(), checklistDays: { d: { x: true } } };
    expect(mergeJournal(local, { checklistDays: { d: { y: true } } }).checklistDays.d).toEqual({ x: true, y: true });
  });
});
