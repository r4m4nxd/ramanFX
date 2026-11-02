import { describe, expect, it } from 'vitest';
import { tfsaRows } from './tfsa';

describe('TFSA list', () => {
  const scan = { zone_lists: { demand: {
    in: [{ s: 'AAA', tf: 'W1', prox: 10, dist: 9, score: 5 }, { s: 'BBB', tf: 'MN', prox: 20, dist: 18, score: 3, cur: 'CAD' }, { s: 'AAA', tf: 'MN', prox: 11, dist: 8 }, { s: 'CCC', tf: 'D1' }],
    left: [{ s: 'DDD', tf: '3M', prox: 5, dist: 4, pct: 1.2 }], near: [{ s: 'BBB', tf: 'W1', pct: 2 }] } } };
  it('one row per stock (its biggest timeframe), biggest first, no D1, insiders on top', () => {
    const r = tfsaRows(scan, { clusters: [{ sym: 'DDD', kind: 'cluster', n: 3, value: 2e6 }] });
    expect(r.insiders.map(x => x.sym)).toEqual(['DDD']);
    expect(r.in.map(x => x.sym)).toEqual(['BBB', 'AAA']);           // both MN: the stronger first
    expect(r.in[1].tf).toBe('MN');
    expect(r.left).toEqual([]);
    expect(r.near).toEqual([]);                                    // BBB already listed
    expect(tfsaRows(scan, null, true).in.map(x => x.sym)).toEqual(['BBB']);
  });
});
