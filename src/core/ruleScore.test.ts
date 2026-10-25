import { describe, expect, it } from 'vitest';
import { autoMarks, planWarnings, resolveMarks, RULES, scoreRules, SMALL_SAMPLE, type ScoredTrade } from './ruleScore';
import { blankPlan } from './strategy';
import { emptyJournal, mergeJournal } from '@/data/merge';

const t = (id: string, net: number, risk: number | null, marks: ScoredTrade['marks'], r?: number | null): ScoredTrade => ({ id, net, risk, r, marks });
const byId = (s: ReturnType<typeof scoreRules>, id: string) => s.find(x => x.rule.id === id)!;

describe('scoreRules', () => {
  it('no data: every rule empty, no cost, sorted stably', () => {
    const s = scoreRules([]);
    expect(s).toHaveLength(RULES.length);
    for (const r of s) { expect(r.followed.n).toBe(0); expect(r.broken.n).toBe(0); expect(r.cost).toBeNull(); expect(r.followed.winRate).toBeNull(); expect(r.followed.avgR).toBeNull(); }
  });

  it('cost = (avg R broken − avg R followed) × broken trades with R', () => {
    const s = scoreRules([
      t('a', 100, 100, { confirm: 'y' }), // +1R
      t('b', 200, 100, { confirm: 'y' }), // +2R
      t('c', -100, 100, { confirm: 'n' }), // −1R
      t('d', -50, 100, { confirm: 'n' }), // −0.5R
    ]);
    const c = byId(s, 'confirm');
    expect(c.followed.avgR).toBeCloseTo(1.5);
    expect(c.broken.avgR).toBeCloseTo(-0.75);
    expect(c.broken.totalR).toBeCloseTo(-1.5);
    expect(c.cost).toBeCloseTo((-0.75 - 1.5) * 2);
    expect(c.followed.winRate).toBe(1);
    expect(c.broken.winRate).toBe(0);
    expect(s[0].rule.id).toBe('confirm'); // the only rule with a cost sorts first
  });

  it('R comes from net / risk when not given; an explicit R wins; no risk means no R', () => {
    const s = scoreRules([t('a', 50, 25, { risk: 'y' }), t('b', 30, null, { risk: 'y' }, 3), t('c', -10, null, { risk: 'n' }), t('d', -40, 0, { risk: 'n' })]);
    const r = byId(s, 'risk');
    expect(r.followed.rN).toBe(2);
    expect(r.followed.totalR).toBeCloseTo(5);
    expect(r.broken.n).toBe(2);
    expect(r.broken.rN).toBe(0);
    expect(r.broken.winRate).toBe(0);
    expect(r.cost).toBeNull(); // nothing with R on the broken side to compare
  });

  it('N/A is counted apart and never joins either side', () => {
    const s = scoreRules([t('a', 100, 100, { confirm: 'na' }), t('b', -100, 100, { confirm: 'na' }), t('c', 100, 100, { confirm: 'y' })]);
    const c = byId(s, 'confirm');
    expect(c.na).toBe(2);
    expect(c.followed.n).toBe(1);
    expect(c.broken.n).toBe(0);
    expect(c.cost).toBeNull();
  });

  it('all followed: no cost, flagged small sample', () => {
    const s = scoreRules(Array.from({ length: 12 }, (_, i) => t(String(i), i % 2 ? 100 : -100, 100, { revenge: 'y' })));
    const r = byId(s, 'revenge');
    expect(r.followed.n).toBe(12);
    expect(r.cost).toBeNull();
    expect(r.small).toBe(true);
  });

  it('small sample flag clears once both sides reach the threshold', () => {
    const ts = Array.from({ length: SMALL_SAMPLE * 2 }, (_, i) => t(String(i), i < SMALL_SAMPLE ? 100 : -100, 100, { stop: i < SMALL_SAMPLE ? 'y' : 'n' }));
    const r = byId(scoreRules(ts), 'stop');
    expect(r.small).toBe(false);
    expect(r.cost).toBeCloseTo(-2 * SMALL_SAMPLE);
  });

  it('breakeven scratches are not wins', () => {
    const r = byId(scoreRules([t('a', 0.004, 100, { risk: 'y' }), t('b', 5, 100, { risk: 'y' })]), 'risk');
    expect(r.followed.wins).toBe(1);
  });
});

describe('autoMarks', () => {
  it('computes risk %, revenge and nothing it cannot know', () => {
    expect(autoMarks({ side: 'buy', riskPct: 1.5, afterLossSameDay: false })).toEqual({ risk: 'y', revenge: 'y' });
    expect(autoMarks({ side: 'buy', riskPct: 3, afterLossSameDay: true })).toEqual({ risk: 'n', revenge: 'n' });
    expect(autoMarks({ side: 'sell' })).toEqual({});
  });

  it('reads direction and sideways from the trade trend read', () => {
    expect(autoMarks({ side: 'sell', align: { combo: 3, htf: 'up', itf: 'up', etf: 'down' } })).toMatchObject({ direction: 'n', sideways: 'y' });
    expect(autoMarks({ side: 'buy', align: { combo: 3, htf: 'side' } })).toEqual({ sideways: 'n' });
  });

  it('reads zone rules, room, target and stop from a plan', () => {
    const plan = blankPlan({ side: 'buy', fresh: false, method: 'sf', qualified: 'zone', curve: 70, htfTrend: 'up', etfTrend: 'up', combo: 3, proximal: 1.1, distal: 1.099, entry: 1.1, stop: 1.0989, opposingHtf: 1.103, target: 1.1023 });
    const m = autoMarks({ side: 'buy', plan, pip: 0.0001, digits: 5 });
    expect(m).toMatchObject({ direction: 'y', sideways: 'y', strong: 'y', confirm: 'n', curve: 'n', opposite: 'y', wow: 'y', target: 'y', room: 'y' });
    // 10-pip H1 zone → 20% = 2 pips → 3-pip minimum; a 1-pip buffer is too tight.
    expect(m.stop).toBe('n');
    expect(autoMarks({ side: 'buy', plan: { ...plan, stop: 1.0987 }, pip: 0.0001, digits: 5 }).stop).toBe('y');
    // Fresh strong zone: the confirmation rule does not apply.
    expect(autoMarks({ side: 'buy', plan: { ...plan, fresh: true } }).confirm).toBe('na');
  });

  it('the owner’s ticks win over the data', () => {
    expect(resolveMarks({ risk: 'na' }, { risk: 'n', revenge: 'y' })).toEqual({ risk: 'na', revenge: 'y' });
    expect(resolveMarks(undefined, { revenge: 'y' })).toEqual({ revenge: 'y' });
  });
});

describe('planWarnings', () => {
  it('warns only on broken rules with a negative cost', () => {
    const scores = scoreRules([t('a', 100, 100, { confirm: 'y', curve: 'y' }), t('b', -100, 100, { confirm: 'n', curve: 'n' }), t('c', 300, 100, { curve: 'n', confirm: 'y' })]);
    const w = planWarnings({ confirm: 'n', curve: 'n', risk: 'n' }, scores);
    expect(w.map(x => x.rule.id)).toEqual(['confirm']); // curve broken paid more than followed; risk has no data
    expect(w[0].score.cost).toBeCloseTo(-3); // followed avg +2R, broken −1R
  });
});

describe('rule ticks survive sync merge', () => {
  it('keeps the newer note with its rules, and older notes without rules still load', () => {
    const local = { ...emptyJournal(), notes: { a: { note: 'x', rules: { confirm: 'n' as const }, updatedAt: 9 }, b: { note: 'old', updatedAt: 1 } } };
    const m = mergeJournal(local, { notes: { a: { note: 'x', updatedAt: 2 }, b: { note: 'old', rules: { risk: 'y' as const }, updatedAt: 5 } } });
    expect(m.notes.a.rules).toEqual({ confirm: 'n' });
    expect(m.notes.b.rules).toEqual({ risk: 'y' });
  });
});
