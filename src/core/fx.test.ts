import { describe, expect, it } from 'vitest';
import { bucketText, groupBySection, parseFx, pepperSymbol, sortFxSignals, tvLink } from './fx';

describe('fx mapping', () => {
  it('normalises symbols and TradingView links', () => {
    expect(pepperSymbol('PEPPERSTONE:EURUSD')).toBe('EURUSD');
    expect(pepperSymbol('EUR_USD')).toBe('EURUSD');
    expect(tvLink('XAU_USD')).toBe('https://www.tradingview.com/chart/?symbol=PEPPERSTONE:XAUUSD');
  });

  it('parses per-instrument signals, buckets and unmapped symbols', () => {
    const f = parseFx({
      generated_at: '2026-10-26T20:00:00Z', last_h4_close: '2026-10-26T17:00:00Z',
      instruments: [
        { instrument: 'USD_TRY', symbol: 'USDTRY', section: '###FX EXOTICS', cls: 'exotic', price: 34.2, bucket: { tf: 'W1', side: 'demand', section: 'in', type: 'ARR' },
          signals: [{ kind: 'BUY', tf: 'W1', side: 'demand', entry: 34, stop: 33, target: 37, rr: 3, spread_pips: 120 }] },
        { instrument: 'EUR_USD', symbol: 'EURUSD', section: 'FX MAJORS', price: 1.08, signals: [{ kind: 'SELL', tf: 'D1', side: 'supply', rr: 4 }] },
      ],
      unmapped: [{ symbol: 'PEPPERSTONE:CATTLE', section: 'COMMODITIES' }],
    })!;
    expect(f.signals).toHaveLength(2);
    expect(f.signals[0]).toMatchObject({ symbol: 'USDTRY', section: 'FX EXOTICS', exotic: true, wide_spread: true, rr: 3 });
    expect(sortFxSignals(f.signals)[0].symbol).toBe('EURUSD');
    expect(f.unmapped[0]).toEqual({ symbol: 'CATTLE', section: 'COMMODITIES', note: 'not on OANDA' });
    expect(groupBySection(f.instruments).map(g => g.section)).toEqual(['FX MAJORS', 'FX EXOTICS']);
    expect(bucketText(f.instruments[0].bucket)).toBe('In demand');
  });

  it('tolerates junk', () => {
    expect(parseFx(null)).toBeNull();
    const f = parseFx({ status: 'no scan yet' })!;
    expect(f.signals).toEqual([]);
    expect(f.generated_at).toBe('');
  });
});

describe('fxscan.py shape', () => {
  it('reads map / watch / generated / h4_close_utc', () => {
    const f = parseFx({
      generated: '2026-10-26T21:00:00Z', h4_close_utc: '2026-10-26T21:00:00Z',
      signals: [{ sym: 'GBPJPY', oanda: 'GBP_JPY', group: 'FX CROSSES', kind: 'SELL', tf: 'D1', side: 'supply', entry: 195.1, stop: 196, target: 190, rr: 5.6, exotic: false }],
      watch: [{ sym: 'USDZAR', oanda: 'USD_ZAR', group: 'FX EXOTICS', kind: 'WATCH', exotic: true }],
      map: [{ sym: 'GBPJPY', oanda: 'GBP_JPY', group: 'FX CROSSES', px: 194.2, sp: 2.1, z: { tf: 'D1', side: 'supply', sec: 'near', type: 'WOW', pips: 90 } }],
    })!;
    expect(f.generated_at).toBe('2026-10-26T21:00:00Z');
    expect(f.signals.map(s => s.kind)).toEqual(['SELL', 'WATCH']);
    expect(f.signals[1].wide_spread).toBe(true);
    expect(f.instruments[0]).toMatchObject({ symbol: 'GBPJPY', section: 'FX CROSSES', price: 194.2, spread_pips: 2.1 });
    expect(bucketText(f.instruments[0].bucket)).toBe('Approaching supply');
  });
});
