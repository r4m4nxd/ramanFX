import { describe, expect, it } from 'vitest';
import { monteCarlo, propSim, recoverySim, PROP_PRESETS } from './sim';
import { blackScholes, normCdf, payoffAtExpiry } from './options';

describe('monte carlo', () => {
  it('a coin flip at 1:1 has ~zero expectancy and ~50% profitable runs', () => {
    const r = monteCarlo({ start: 10000, trades: 100, runs: 4000, win: 0.5, mode: 'fixed', avgWin: 100, avgLoss: 100, riskPct: 0, ruinLevel: 0 });
    expect(r.expectancy).toBe(0);
    expect(r.pProfit).toBeGreaterThan(0.42); expect(r.pProfit).toBeLessThan(0.5); // ties (exactly flat) count as not profitable
    expect(Math.abs(r.bands[100].p50 - 10000)).toBeLessThanOrEqual(200);
  });
  it('mean of fixed-size outcomes matches expectancy × trades', () => {
    const r = monteCarlo({ start: 0, trades: 50, runs: 6000, win: 0.6, mode: 'fixed', avgWin: 150, avgLoss: 100, riskPct: 0, ruinLevel: -1e9 });
    const mean = r.finals.reduce((a, b) => a + b, 0) / r.finals.length;
    expect(mean).toBeGreaterThan(50 * 50 * 0.9); expect(mean).toBeLessThan(50 * 50 * 1.1);
    expect(r.kelly).toBeCloseTo(0.6 - 0.4 / 1.5, 6);
  });
});

describe('recovery', () => {
  it('a positive edge usually recovers a 10% hole', () => {
    const r = recoverySim({ now: 9000, peak: 10000, win: 0.55, payoff: 1.5, riskPct: 0.01, maxTrades: 1000, blowLevel: 5000, runs: 2000 });
    expect(r.pRecover).toBeGreaterThan(0.95);
  });
});

describe('prop sim', () => {
  it('a strong edge passes far more often than a negative one', () => {
    const base = { size: 100000, phases: PROP_PRESETS[0].phases, tradesPerDay: 2, riskPct: 0.005, split: 0.8, fee: 540, fundedDays: 20, runs: 800 };
    const good = propSim({ ...base, win: 0.55, payoff: 1.8 });
    const bad = propSim({ ...base, win: 0.4, payoff: 1.0 });
    expect(good.pPass).toBeGreaterThan(0.6);
    expect(bad.pPass).toBeLessThan(0.1);
    expect(good.ev).toBeGreaterThan(bad.ev);
  });
});

describe('black-scholes', () => {
  it('matches textbook values (S=100,K=100,T=1,r=5%,v=20%)', () => {
    expect(normCdf(0)).toBeCloseTo(0.5, 7);
    const c = blackScholes('call', 100, 100, 1, 0.05, 0.2), p = blackScholes('put', 100, 100, 1, 0.05, 0.2);
    expect(c.price).toBeCloseTo(10.4506, 3); expect(p.price).toBeCloseTo(5.5735, 3);
    expect(c.delta).toBeCloseTo(0.6368, 3);
    // put–call parity
    expect(c.price - p.price).toBeCloseTo(100 - 100 * Math.exp(-0.05), 6);
  });
  it('bull call spread caps at the strike width minus debit', () => {
    const legs = [{ kind: 'call' as const, side: 1 as const, strike: 100, qty: 1, premium: 5 }, { kind: 'call' as const, side: -1 as const, strike: 110, qty: 1, premium: 2 }];
    expect(payoffAtExpiry(legs, 200, 100)).toBeCloseTo(7, 9);
    expect(payoffAtExpiry(legs, 50, 100)).toBeCloseTo(-3, 9);
  });
});
