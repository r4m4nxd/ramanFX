import { describe, expect, it } from 'vitest';
import { specFor } from './instruments';
import { bufferPct, mostTraded, rajaStop, rajaTarget, room } from './plannerDefaults';

const sp = (s: string) => { const x = specFor(s); return { pip: x.pipSize, digits: x.digits }; };

describe('bufferPct by timeframe', () => {
  it('maps every band of the rule', () => {
    expect(['1m', '5m', '15m', 'M1', 'M30'].map(bufferPct)).toEqual([0.25, 0.25, 0.25, 0.25, 0.25]);
    expect(['H1', 'H2', 'H3'].map(bufferPct)).toEqual([0.2, 0.2, 0.2]);
    expect(['H4', 'H8', 'H12'].map(bufferPct)).toEqual([0.15, 0.15, 0.15]);
    expect(['1D', 'D1'].map(bufferPct)).toEqual([0.1, 0.1]);
    expect(['1W', 'W1', '1M', 'MN1'].map(bufferPct)).toEqual([0.05, 0.05, 0.05, 0.05]);
  });
});

describe('rajaStop', () => {
  it('buy: below the distal by 20% of an H1 zone', () => {
    const r = rajaStop({ side: 'buy', proximal: 1.1050, distal: 1.1000, tf: 'H1', ...sp('EURUSD') })!;
    expect(r.zonePips).toBeCloseTo(50);
    expect(r.bufferPips).toBeCloseTo(10);
    expect(r.stop).toBeCloseTo(1.0990, 6);
    expect(r.minApplied).toBe(false);
  });
  it('sell: above the distal', () => {
    const r = rajaStop({ side: 'sell', proximal: 1.1000, distal: 1.1040, tf: 'H4', ...sp('EURUSD') })!;
    expect(r.bufferPips).toBeCloseTo(6);
    expect(r.stop).toBeCloseTo(1.1046, 6);
  });
  it('tiny zones fall back to the 3-pip minimum', () => {
    const r = rajaStop({ side: 'buy', proximal: 1.1005, distal: 1.1000, tf: '1D', ...sp('EURUSD') })!;
    expect(r.minApplied).toBe(true);
    expect(r.bufferPips).toBeCloseTo(3);
    expect(r.stop).toBeCloseTo(1.0997, 6);
    // zero-height zone too
    expect(rajaStop({ side: 'sell', proximal: 1.2, distal: 1.2, tf: 'H1', ...sp('EURUSD') })!.stop).toBeCloseTo(1.2003, 6);
  });
  it('JPY pairs use a 0.01 pip', () => {
    const r = rajaStop({ side: 'buy', proximal: 150.50, distal: 150.00, tf: '15m', ...sp('USDJPY') })!;
    expect(r.zonePips).toBeCloseTo(50);
    expect(r.stop).toBeCloseTo(149.875, 3);
  });
  it('gold uses its own pip size', () => {
    const { pip, digits } = sp('XAUUSD');
    const r = rajaStop({ side: 'sell', proximal: 2400, distal: 2410, tf: '1D', pip, digits })!;
    expect(pip).toBe(0.1);
    expect(r.bufferPips).toBeCloseTo(10);
    expect(r.stop).toBeCloseTo(2411, 2);
    // a thin gold zone: 10% of 0.5 is under 3 pips (0.3), so the minimum wins
    expect(rajaStop({ side: 'buy', proximal: 2400.5, distal: 2400, tf: '1D', pip, digits })!.stop).toBeCloseTo(2399.7, 2);
  });
  it('rejects bad input', () => {
    expect(rajaStop({ side: 'buy', proximal: NaN, distal: 1, tf: 'H1', pip: 0.0001, digits: 5 })).toBeNull();
    expect(rajaStop({ side: 'buy', proximal: 1, distal: 1, tf: 'H1', pip: 0, digits: 5 })).toBeNull();
  });
});

describe('rajaTarget', () => {
  it('7 pips before the opposite proximal, both sides', () => {
    expect(rajaTarget({ side: 'buy', entry: 1.1, opposite: 1.12, ...sp('EURUSD') })).toBeCloseTo(1.1193, 6);
    expect(rajaTarget({ side: 'sell', entry: 1.1, opposite: 1.08, ...sp('EURUSD') })).toBeCloseTo(1.0807, 6);
    expect(rajaTarget({ side: 'buy', entry: 150, opposite: 152, ...sp('USDJPY') })).toBeCloseTo(151.93, 3);
  });
  it('null when the opposite zone is behind the entry or within 7 pips', () => {
    expect(rajaTarget({ side: 'buy', entry: 1.1, opposite: 1.09, ...sp('EURUSD') })).toBeNull();
    expect(rajaTarget({ side: 'buy', entry: 1.1, opposite: 1.1005, ...sp('EURUSD') })).toBeNull();
    expect(rajaTarget({ side: 'sell', entry: 1.1, opposite: 1.11, ...sp('EURUSD') })).toBeNull();
  });
});

describe('room', () => {
  it('multiples and verdicts', () => {
    expect(room({ side: 'buy', entry: 1.1, stop: 1.099, target: 1.1031 })).toEqual({ x: expect.closeTo(3.1, 5), verdict: 'good' });
    expect(room({ side: 'sell', entry: 1.1, stop: 1.101, target: 1.0975 })!.verdict).toBe('ok');
    expect(room({ side: 'buy', entry: 1.1, stop: 1.099, target: 1.1015 })!.verdict).toBe('skip');
    expect(room({ side: 'buy', entry: 1.1, stop: 1.1, target: 1.2 })).toBeNull();
    expect(room({ side: 'buy', entry: 1.1, stop: null, target: 1.2 })).toBeNull();
  });
});

describe('mostTraded', () => {
  it('counts normalised symbols, falls back to EURUSD', () => {
    expect(mostTraded([])).toBe('EURUSD');
    expect(mostTraded([{ symbol: 'GBPUSD' }, { symbol: 'XAUUSD' }, { symbol: 'XAUUSD' }])).toBe('XAUUSD');
  });
});
