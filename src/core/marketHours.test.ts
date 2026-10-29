import { describe, expect, it } from 'vitest';
import { addMinutes, findSymbol, fmtX, nyOf, parseMarketHours, parseSymbol, searchSymbols, slotLabel } from './marketHours';

const EUR = {
  s: 'EURUSD', n: 'EUR_USD', k: 'major', g: 'FX MAJORS', d: 'EUR/USD', i: '', wl: true, y: ['2005-01-02', '2026-10-28', 21.8],
  t: [['08:00', '10:00', '06:00', '10:00', 2.01, 41.6, 2.31, 1.83], ['01:00', '03:00', '00:30', '02:00', 1.41, 15.8]],
  tr: 'reliable', th: 0.97, w: ['Wed', 'Mon', 1.06, 1.02, 1.1, 'reliable'], dd: [0.97, 0.99, 1.03, 1.02, 1.0],
  e: [0.98, 0.95, '08:00', '07:30', '08:00', false], nfp: [2.75, 250, 79.2, 31.2], f12: [3.1, 160, 87.5, 6.9], f1230: null,
  p: Array.from({ length: 48 }, (_, i) => (i === 16 ? 201 : 100)),
};

describe('market hours parser', () => {
  it('parses a compact symbol row', () => {
    const s = parseSymbol(EUR)!;
    expect(s.sym).toBe('EURUSD');
    expect(s.kind).toBe('major');
    expect(s.windows[0]).toEqual({ mt: '08:00', ny: '10:00', from: '06:00', to: '10:00', activity: 2.01, bigPct: 41.6, volume: 2.31, range: 1.83 });
    expect(s.windows[1].range).toBeNull();
    expect(s.weekday).toEqual({ best: 'Wed', quiet: 'Mon', ratio: 1.06, ciLo: 1.02, ciHi: 1.1, rel: 'reliable' });
    expect(s.nfp).toEqual({ ratio: 2.75, days: 250, bigPct: 79.2, bigCtrlPct: 31.2 });
    expect(s.fomc1230).toBeNull();
    expect(s.profile).toHaveLength(48);
    expect(s.profile[16]).toBeCloseTo(2.01);
    expect(s.era.shifted).toBe(false);
    expect(s.years).toBe(21.8);
  });

  it('is defensive about odd or missing fields', () => {
    expect(parseSymbol({})).toBeNull();
    const s = parseSymbol({ s: 'XYZ', k: 'weird', t: [['bad'], ['13:30']], w: 'x', p: [50], tr: 'maybe' })!;
    expect(s.kind).toBe('other');
    expect(s.windows).toHaveLength(1);
    expect(s.windows[0].mt).toBe('13:30');
    expect(s.weekday).toBeNull();
    expect(s.timesRel).toBe('weak');
    expect(s.profile).toHaveLength(48);
    expect(s.profile[1]).toBeNull();
    const f = parseMarketHours({ meta: { generated: 'g', n_fx: 1, n_stocks: 2 }, symbols: [EUR, null, { s: '' }] });
    expect(f.symbols.map(x => x.sym)).toEqual(['EURUSD']);
    expect(f.fxCount).toBe(1);
    expect(parseMarketHours(null).symbols).toEqual([]);
  });

  it('searches by symbol, OANDA name and company name', () => {
    const list = [parseSymbol(EUR)!, parseSymbol({ ...EUR, s: 'AAPL', n: 'AAPL', k: 'stock', d: 'Apple Inc.', wl: false })!,
      parseSymbol({ ...EUR, s: 'XAUUSD', n: 'XAU_USD', k: 'metal', d: 'Gold' })!];
    expect(searchSymbols(list, 'eur/usd')[0].sym).toBe('EURUSD');
    expect(searchSymbols(list, 'EUR_USD')[0].sym).toBe('EURUSD');
    expect(searchSymbols(list, 'apple')[0].sym).toBe('AAPL');
    expect(searchSymbols(list, 'gold').map(s => s.sym)).toEqual(['XAUUSD']);
    expect(searchSymbols(list, '', 'stock').map(s => s.sym)).toEqual(['AAPL']);
    expect(searchSymbols(list, '', 'fx').map(s => s.sym)).toEqual(['EURUSD']);
    expect(findSymbol(list, 'xau_usd')?.sym).toBe('XAUUSD');
  });

  it('formats clock times', () => {
    expect(nyOf('07:30')).toBe('09:30');
    expect(nyOf('23:00')).toBe('01:00');
    expect(addMinutes('00:15', -30)).toBe('23:45');
    expect(slotLabel(15)).toBe('07:30');
    expect(fmtX(2.014)).toBe('2.01×');
    expect(fmtX(null)).toBe('–');
  });
});
