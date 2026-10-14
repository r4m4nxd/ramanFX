import { describe, expect, it } from 'vitest';
import { insights, type InsightTrade } from './insights';

const T = (o: Partial<InsightTrade>): InsightTrade => ({ id: Math.random().toString(), sym: 'XAUUSD', net: -50, r: -1, volume: 0.1, holdSec: 600, open: new Date('2026-08-05T10:00'), close: new Date('2026-08-05T10:10'), outcome: 'loss', session: 'London', planned: false, odds: null, tradeable: null, adherence: null, mfeR: null, riskPct: null, maxRiskPct: null, ...o });

describe('insights', () => {
  it('calls out revenge trades, no plans and give-backs', () => {
    const a = T({ mfeR: 1.4 });
    const b = T({ open: new Date('2026-08-05T10:15'), close: new Date('2026-08-05T10:30') });
    const xs = insights([a, b], [], 'day');
    expect(xs.some(x => /within 15 minutes/.test(x.text))).toBe(true);
    expect(xs.some(x => /None of the 2 trades had a plan/.test(x.text))).toBe(true);
    expect(xs.some(x => /\+1R first/.test(x.text))).toBe(true);
    expect(xs[0].tone).toBe('bad');
  });
  it('praises a clean green day', () => {
    const xs = insights([T({ net: 80, r: 1.6, outcome: 'win', planned: true, odds: 'high', tradeable: true })], [], 'day');
    expect(xs.some(x => /Clean day/.test(x.text))).toBe(true);
  });
});
