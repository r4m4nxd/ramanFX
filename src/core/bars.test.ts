import { describe, expect, it } from 'vitest';
import { mergeSeries, parseBarsCSV, pickTf, wallSec, wallShifter } from './bars';

const csv = ['RamanFX Bars,1,51482759', 'Symbol,TF,Time,Open,High,Low,Close',
  'XAUUSD,M5,2026.07.01 10:00:00,2331.10,2332.40,2330.85,2331.95',
  'XAUUSD,M5,2026.07.01 10:05:00,2331.95,2333.00,2331.50,2332.70',
  'XAUUSD,M5,2026.07.01 10:00:00,2331.10,2332.40,2330.85,2331.95',
  'EURUSD,H1,2026.01.15 10:00:00,1.1000,1.1010,1.0990,1.1005', 'bad,line'].join('\r\n');

describe('bars', () => {
  it('parses, dedupes and converts the broker clock to UTC', () => {
    const r = parseBarsCSV(csv, 'mt-ny');
    const x = r.series['51482759|XAUUSD|M5'];
    expect(x.t.length).toBe(2);
    // July: broker GMT+3 → 10:00 broker = 07:00 UTC
    expect(x.t[0]).toBe(Date.UTC(2026, 6, 1, 7, 0) / 1000);
    // January: broker GMT+2
    expect(r.series['51482759|EURUSD|H1'].t[0]).toBe(Date.UTC(2026, 0, 15, 8, 0) / 1000);
    expect(r.symbols.sort()).toEqual(['EURUSD', 'XAUUSD']);
  });
  it('merges series, newer wins', () => {
    const a = { t: [1, 2], o: [1, 1], h: [1, 1], l: [1, 1], c: [1, 1] }, b = { t: [2, 3], o: [9, 9], h: [9, 9], l: [9, 9], c: [9, 9] };
    const m = mergeSeries(a, b);
    expect(m.t).toEqual([1, 2, 3]); expect(m.c).toEqual([1, 9, 9]);
  });
  it('shifts UTC to wall time and picks a timeframe', () => {
    const sh = wallShifter('America/Edmonton');
    expect(sh(Date.UTC(2026, 6, 1, 7) / 1000)).toBe(Date.UTC(2026, 6, 1, 1) / 1000);
    expect(wallSec('2026.07.01 01:00:00')).toBe(Date.UTC(2026, 6, 1, 1) / 1000);
    expect(pickTf(3600, ['M5', 'H1'])).toBe('M5');
    expect(pickTf(30 * 86400, ['M15', 'H1', 'H4', 'D1'])).toBe('H4');
    expect(pickTf(600, [])).toBeNull();
  });
});
