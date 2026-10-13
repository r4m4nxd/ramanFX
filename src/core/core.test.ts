import { describe, expect, it } from 'vitest';
import { normalizeSymbol, positionSize, specFor, measuredUnitValues, unitValue, pipValuePerLot } from './instruments';
import { LIBRARY, findFuture, pipValueInQuote, tickValueInQuote } from './library';
import { balanceSeries, computeStats, dedupeDeposits, enrich, maxDrawdownPct, riskAdjusted, traderScore } from './stats';
import { alignmentPlays, TIMEFRAME_COMBOS } from './playbook';
import { brokerToLocal, parseTs } from './time';
import type { Trade } from './types';

let seq = 0;
const T = (o: Partial<Trade>): Trade => ({
  id: String(++seq), account: 'A', openTime: '2026.10.01 10:00:00', closeTime: '2026.10.01 11:00:00', symbol: 'EURUSD', type: 'buy',
  volume: 1, openPrice: 1.1, closePrice: 1.101, sl: '0', tp: '0', commission: 0, swap: 0, profit: 100, ...o,
});

describe('instrument library', () => {
  it('has unique symbols per venue group', () => {
    const keys = LIBRARY.map(i => (i.venue === 'CFD' ? i.symbol : 'F:' + i.symbol));
    expect(new Set(keys).size).toBe(keys.length);
  });
  it('standard FX pip values in quote currency', () => {
    expect(pipValueInQuote(LIBRARY.find(i => i.symbol === 'EURUSD')!)).toBeCloseTo(10);
    expect(pipValueInQuote(LIBRARY.find(i => i.symbol === 'USDJPY')!)).toBeCloseTo(1000); // ¥1,000 per pip per lot
    expect(pipValueInQuote(LIBRARY.find(i => i.symbol === 'XAUUSD')!)).toBeCloseTo(10);   // 100oz × $0.10
  });
  it('exchange futures tick values', () => {
    const tv = (s: string) => tickValueInQuote(findFuture(s)!);
    expect(tv('ES')).toBeCloseTo(12.5); expect(tv('MES')).toBeCloseTo(1.25);
    expect(tv('NQ')).toBeCloseTo(5); expect(tv('MNQ')).toBeCloseTo(0.5);
    expect(tv('CL')).toBeCloseTo(10); expect(tv('GC')).toBeCloseTo(10); expect(tv('MGC')).toBeCloseTo(1);
    expect(tv('ZN')).toBeCloseTo(15.625); expect(tv('6E')).toBeCloseTo(6.25); expect(tv('6J')).toBeCloseTo(6.25);
    expect(tv('MBT')).toBeCloseTo(0.5); expect(tv('MET')).toBeCloseTo(0.05);
  });
  it('resolves dated futures codes', () => {
    expect(findFuture('ESZ6')?.symbol).toBe('ES');
    expect(findFuture('/MNQH26')?.symbol).toBe('MNQ');
    expect(findFuture('M6EU2026')?.symbol).toBe('M6E');
  });
});

describe('symbol normalisation', () => {
  it.each([
    ['EURUSD.r', 'EURUSD'], ['XAUUSDm', 'XAUUSD'], ['GBPJPY+', 'GBPJPY'], ['#US30', 'US30'], ['NAS100', 'US100'],
    ['US30.cash', 'US30'], ['GOLD', 'XAUUSD'], ['BTCUSDT', 'BTCUSD'], ['DE40', 'GER40'], ['PLATINUM', 'PLATINUM'],
  ])('%s → %s', (raw, want) => expect(normalizeSymbol(raw)).toBe(want));
  it('JPY pip size', () => expect(specFor('GBPJPY.pro').pipSize).toBe(0.01));
});

describe('value measurement and position sizing', () => {
  it('measures $ per 1.0 move per lot from trades (incl. JPY conversion)', () => {
    // USDJPY 1 lot, 50 pips (0.50) made $333.33 ⇒ unit value ≈ 666.67 $/1.0 move
    const m = measuredUnitValues([T({ symbol: 'USDJPY', openPrice: 150, closePrice: 150.5, profit: 333.33 })]);
    expect(m.USDJPY).toBeCloseTo(666.66, 1);
    const uv = unitValue(specFor('USDJPY'), m).value;
    expect(pipValuePerLot(uv, specFor('USDJPY'))).toBeCloseTo(6.67, 2);
  });
  it('ignores rows whose profit disagrees with direction', () => {
    expect(measuredUnitValues([T({ openPrice: 1.1, closePrice: 1.2, profit: -50 })]).EURUSD).toBeUndefined();
  });
  it('floors lots so risk never exceeds budget', () => {
    // $100 risk, EURUSD 25-pip stop: 100 / (0.0025 × 100000) = 0.4 lots
    const r = positionSize({ riskAmount: 100, entry: 1.1, stop: 1.0975, unitValue: 100000 })!;
    expect(r.lots).toBe(0.4);
    expect(r.riskAtLots).toBeLessThanOrEqual(100.0001);
    const g = positionSize({ riskAmount: 100, entry: 2650, stop: 2646.9, unitValue: 100 })!; // gold 31 pips
    expect(g.lots).toBe(0.32);
  });
});

describe('stats', () => {
  const trades = [
    T({ profit: 200, closePrice: 1.102, closeTime: '2026.10.01 11:00:00', sl: '1.098' }),
    T({ profit: -100, closePrice: 1.099, closeTime: '2026.10.02 11:00:00' }),
    T({ profit: 0, closePrice: 1.1, closeTime: '2026.10.03 11:00:00' }),
    T({ profit: 150, closePrice: 1.1015, closeTime: '2026.10.05 11:00:00' }),
    T({ profit: -50, closePrice: 1.0995, closeTime: '2026.10.06 11:00:00' }),
  ];
  const s = computeStats(enrich(trades));
  it('win rate excludes breakeven', () => { expect(s.wins).toBe(2); expect(s.losses).toBe(2); expect(s.breakeven).toBe(1); expect(s.winRate).toBe(0.5); });
  it('profit factor, payoff, breakeven win rate', () => {
    expect(s.profitFactor).toBeCloseTo(350 / 150);
    expect(s.payoff).toBeCloseTo(175 / 75);
    expect(s.breakevenWinRate).toBeCloseTo(1 / (1 + 175 / 75));
  });
  it('no losses ⇒ profit factor null, not Infinity', () => {
    expect(computeStats(enrich([T({ profit: 10 })])).profitFactor).toBeNull();
  });
  it('drawdown on cumulative P&L', () => { expect(s.maxDrawdown).toBe(100); });
  it('R multiple from a valid stop', () => {
    const e = enrich(trades)[0];
    expect(e.risk).toBeCloseTo(0.002 * 100000 * 1); // measured unit value = 100000
    expect(e.r).toBeCloseTo(1);
  });
  it('stop moved past entry ⇒ R unknown', () => {
    expect(enrich([T({ sl: '1.1005' })])[0].r).toBeNull();
  });
  it('current streak skips breakeven', () => {
    const st = computeStats(enrich([T({ profit: -5 }), T({ profit: 5, closeTime: '2026.10.01 12:00:00' }), T({ profit: 0, closeTime: '2026.10.01 13:00:00' })]));
    expect(st.currentStreak).toEqual({ kind: 'win', count: 1 });
  });
  it('trader score requires a minimum sample', () => { expect(traderScore(s, null, null)).toBeNull(); });
});

describe('balance reconstruction', () => {
  it('walks backward from the snapshot, per account, and sums', () => {
    const tr = [T({ account: 'A', profit: 100 }), T({ account: 'B', profit: -50, closeTime: '2026.10.02 10:00:00' })];
    const deps = [{ time: '2026.09.30 09:00:00', amount: 1000, balance: 1000, comment: '', account: 'A' }];
    const acc = { A: { id: 'A', name: '', broker: '', lastImport: 0, snapshot: { balance: 1100 } }, B: { id: 'B', name: '', broker: '', lastImport: 0, snapshot: { balance: 450 } } };
    const s = balanceSeries(tr, deps, acc, 'all');
    expect(s[0].balance).toBe(500);           // A=0 before deposit, B=500
    expect(s[s.length - 1].balance).toBe(1550); // 1100 + 450
    expect(maxDrawdownPct(s)).toBeCloseTo(50 / 1600);
  });
});

describe('balance edge cases', () => {
  it('applies a same-second transfer between accounts atomically', () => {
    const deps = [
      { time: '2026.06.04 11:43:49', amount: -500, balance: 0, comment: 'Transfer A > B', account: 'A' },
      { time: '2026.06.04 11:43:49', amount: 500, balance: null, comment: 'Transfer A > B', account: 'B' },
      { time: '2026.06.01 10:00:00', amount: 500, balance: 500, comment: 'Deposit', account: 'A' },
    ];
    const acc = { A: { id: 'A', name: '', broker: '', lastImport: 0, snapshot: { balance: 0 } }, B: { id: 'B', name: '', broker: '', lastImport: 0, snapshot: { balance: 500 } } };
    const s = balanceSeries([], deps, acc, 'all');
    expect(s.every(p => p.balance >= 0)).toBe(true);
    expect(maxDrawdownPct(s)).toBe(0);
  });
  it('drops a deposit re-imported under a different broker offset, keeps swaps out of deposits', () => {
    const deps = [
      { time: '2026.08.13 22:30:45', amount: 10000, balance: 10000, comment: 'initial balance', account: 'A' },
      { time: '2026.08.14 07:30:45', amount: 10000, balance: 10000, comment: 'initial balance', account: 'A' },
      { time: '2026.08.15 10:00:00', amount: -2.4, balance: null, comment: 'w_swap_1', account: 'A' },
    ];
    expect(dedupeDeposits(deps)).toHaveLength(2);
    const s = balanceSeries([], deps, { A: { id: 'A', name: '', broker: '', lastImport: 0, snapshot: { balance: 9997.6 } } }, 'A');
    expect(s[s.length - 1].deposits).toBe(10000);
    expect(s[0].balance).toBeCloseTo(0);
  });
});

describe('sharpe', () => {
  it('needs 20 days', () => { expect(riskAdjusted([{ date: '2026-10-01', pnl: 5, trades: 1, wins: 1, losses: 0, volume: 1 }]).sharpe).toBeNull(); });
});

describe('time', () => {
  it('converts broker clock to local', () => {
    const local = brokerToLocal('2026.10.01 12:00:00', 3);
    expect(parseTs(local)!.getTime()).toBe(Date.UTC(2026, 9, 1, 9));
  });
});

describe('playbook alignment', () => {
  const c = TIMEFRAME_COMBOS[3];
  it('full alignment ⇒ set and forget', () => {
    const p = alignmentPlays({ htf: 'up', itf: 'up', etf: 'up' }, c)!;
    expect(p).toHaveLength(1); expect(p[0].setAndForget).toBe(true); expect(p[0].confirmTf).toBe('5m');
  });
  it('all sideways ⇒ both half-risk plays', () => {
    const p = alignmentPlays({ htf: 'side', itf: 'side', etf: 'side' }, c)!;
    expect(p.map(x => x.dir).sort()).toEqual(['long', 'short']); expect(p.every(x => x.halfRisk)).toBe(true);
  });
  it('unlisted combo ⇒ no trade', () => { expect(alignmentPlays({ htf: 'up', itf: 'down', etf: 'up' }, c)).toEqual([]); });
});
