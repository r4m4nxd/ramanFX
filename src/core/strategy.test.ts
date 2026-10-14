import { describe, expect, it } from 'vitest';
import { blankPlan, evaluatePlan, judgeTrade, matchPlan, breakevenWinRate } from './strategy';

describe('evaluatePlan', () => {
  it('with-trend demand low in the curve is high odds, non-aggressive management', () => {
    const v = evaluatePlan(blankPlan({ side: 'buy', htfTrend: 'up', curve: 20, moveAway: 'aplus', baseCandles: 1, qualified: 'both' }));
    expect(v.tradeable).toBe(true);
    expect(v.odds).toBe('high');
    expect(v.mgmt.style).toBe('non-aggressive');
    expect(v.mgmt.targetR).toBe(3);
  });
  it('counter-trend is low odds: half risk, 1:1, breakeven early', () => {
    const v = evaluatePlan(blankPlan({ side: 'buy', htfTrend: 'down', curve: 20 }), 1);
    expect(v.odds).toBe('low');
    expect(v.mgmt.maxRiskPct).toBe(0.5);
    expect(v.mgmt.targetR).toBe(1);
  });
  it('demand above the 50% mark of the curve is low odds for set & forget', () => {
    expect(evaluatePlan(blankPlan({ side: 'buy', htfTrend: 'up', curve: 70 })).odds).toBe('low');
    expect(evaluatePlan(blankPlan({ side: 'sell', htfTrend: 'down', curve: 70 })).odds).toBe('high');
  });
  it('blocks what is not a tradeable zone', () => {
    expect(evaluatePlan(blankPlan({ moveAway: 'poor' })).tradeable).toBe(false);
    expect(evaluatePlan(blankPlan({ fresh: false })).tradeable).toBe(false);
    expect(evaluatePlan(blankPlan({ qualified: 'none' })).tradeable).toBe(false);
    expect(evaluatePlan(blankPlan({ baseCandles: 8 })).tradeable).toBe(false);
  });
  it('confirmation needs an actual touch and a signal', () => {
    expect(evaluatePlan(blankPlan({ method: 'conf', htfTouched: false, signal: 'zone' })).tradeable).toBe(false);
    expect(evaluatePlan(blankPlan({ method: 'conf', htfTouched: true, signal: null })).tradeable).toBe(false);
    expect(evaluatePlan(blankPlan({ method: 'conf', htfTouched: true, signal: 'both', atHtfZone: true })).tradeable).toBe(true);
  });
  it('stop inside the zone is blocked; R:R is computed', () => {
    const p = blankPlan({ side: 'buy', proximal: 100, distal: 98, entry: 100, stop: 99, target: 106 });
    const v = evaluatePlan(p);
    expect(v.tradeable).toBe(false);
    const ok = evaluatePlan({ ...p, stop: 97.5 });
    expect(ok.rr).toBeCloseTo(6 / 2.5, 6);
  });
});

describe('judgeTrade', () => {
  const base = { side: 'buy' as const, entry: 100, exit: 99, finalStop: 99, finalTarget: 103, net: -50, risk: 50, r: -1, balance: 10000, holdSec: 600 };
  it('flags a loss that had run to 1R+ (needed breakeven)', () => {
    const v = judgeTrade({ ...base, mfeMoney: 60, maeMoney: 50 }, blankPlan({ side: 'buy', htfTrend: 'down' }));
    expect(v.lines.some(l => l.tone === 'bad' && /\+1\.2R/.test(l.text))).toBe(true);
  });
  it('flags over-risking a low-odds setup', () => {
    const v = judgeTrade({ ...base, risk: 100 }, blankPlan({ side: 'buy', htfTrend: 'down' }), 1);
    expect(v.lines.some(l => /Risked 1\.00%/.test(l.text))).toBe(true);
  });
  it('a planned, rule-following loss is called a good loss', () => {
    const v = judgeTrade(base, blankPlan({ side: 'buy', htfTrend: 'up', curve: 10, stop: 99, entry: 100, proximal: 100, distal: 99.2 }));
    expect(v.headline).toMatch(/good loss/);
    expect(v.adherence).toBe(100);
  });
  it('no plan is always called out', () => {
    expect(judgeTrade({ ...base, net: 80 }, null).headline).toMatch(/luck/);
  });
});

describe('matchPlan', () => {
  it('links the nearest plan for the same symbol and side made before entry', () => {
    const t0 = Date.UTC(2026, 7, 5, 12);
    const plans = [blankPlan({ id: 'a', symbol: 'XAUUSD', side: 'buy', createdAt: t0 - 3600_000, entry: 2650, stop: 2640 }), blankPlan({ id: 'b', symbol: 'XAUUSD', side: 'sell', createdAt: t0 - 3600_000 })];
    expect(matchPlan(plans, { id: '1', sym: 'XAUUSD', type: 'buy', open: new Date(t0), openPrice: 2651 })?.id).toBe('a');
    expect(matchPlan(plans, { id: '1', sym: 'EURUSD', type: 'buy', open: new Date(t0), openPrice: 1 })).toBeNull();
  });
});

it('breakeven win rate table', () => { expect(breakevenWinRate(2)).toBeCloseTo(1 / 3); expect(breakevenWinRate(3)).toBeCloseTo(0.25); });

import { drills } from './coach';
it('every drill has a clear engine answer', () => {
  const d = drills();
  expect(d.length).toBeGreaterThan(10);
  expect(new Set(d.map(x => x.answer))).toEqual(new Set(['NO TRADE', 'HIGH ODDS', 'LOW ODDS']));
  expect(d[0].answer).toBe('HIGH ODDS');
  expect(d[1].answer).toBe('LOW ODDS');
  expect(d[3].answer).toBe('NO TRADE');
});
