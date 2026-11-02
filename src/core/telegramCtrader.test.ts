import { describe, expect, it } from 'vitest';
import { ctBars, ctClosed, ctSplit } from '../../supabase/functions/telegram-bot/ctrader';

describe('cTrader live bars (bot)', () => {
  it('decodes relative trendbars', () => {
    const r = ctBars({ trendbar: [{ low: 111045, deltaOpen: 487, deltaHigh: 810, deltaClose: 760, utcTimestampInMinutes: 29_877_420 }] });
    expect(r).toHaveLength(1);
    const [ms, o, h, l, c] = r[0];
    expect(ms).toBe(29_877_420 * 60_000);
    expect([o, h, l, c]).toEqual([1.11532, 1.11855, 1.11045, 1.11805]);
  });
  it('closed vs forming: H1 by length, weeks close on Friday, months on the next 1st', () => {
    const h = Date.UTC(2026, 10, 2, 18);
    expect(ctClosed(h, 'H1', h + 3_599_000)).toBe(false);
    expect(ctClosed(h, 'H1', h + 3_600_000)).toBe(true);
    const w = Date.UTC(2026, 9, 25, 22);                       // Sunday open
    expect(ctClosed(w, 'W1', Date.UTC(2026, 9, 30, 21))).toBe(false);
    expect(ctClosed(w, 'W1', Date.UTC(2026, 9, 30, 22))).toBe(true);
    const m = Date.UTC(2026, 8, 30, 21);                       // October bar opens Sep 30 21:00 UTC
    expect(ctClosed(m, 'MN', Date.UTC(2026, 9, 29))).toBe(false);
    expect(ctClosed(m, 'MN', Date.UTC(2026, 10, 1))).toBe(true);
  });
  it('labels W1 bars (Monday 00:00 server time) on the Saturday week label, last open bar = forming', () => {
    const w1 = Date.UTC(2026, 9, 18, 21), w2 = Date.UTC(2026, 9, 25, 22), now = Date.UTC(2026, 10, 2, 20);
    const s = ctSplit([[w1, 1, 2, 0.5, 1.5], [w2, 1.5, 2, 1, 1.8], [Date.UTC(2026, 10, 1, 22), 1.8, 1.9, 1.7, 1.85]], 'W1', now);
    expect(s.closed.map(b => b.d)).toEqual(['2026-10-17T00:00', '2026-10-24T00:00']);
    expect(s.forming?.d).toBe('2026-10-31T00:00');
  });
});

import { buildForming, floorLabel } from '../../supabase/functions/telegram-bot/ctrader';
describe('cTrader forming bars (bot)', () => {
  it('floors an instant to the bar that contains it (server time = New York + 7 h)', () => {
    const t = Date.UTC(2026, 10, 2, 20, 47);                   // Mon 22:47 server time (EST: UTC+2)
    expect(floorLabel(t, 'H1')).toBe('2026-11-02T22:00');
    expect(floorLabel(t, 'H4')).toBe('2026-11-02T20:00');
    expect(floorLabel(t, 'D1')).toBe('2026-11-02T00:00');
    expect(floorLabel(t, 'W1')).toBe('2026-10-31T00:00');
    expect(floorLabel(t, 'MN')).toBe('2026-11-01T00:00');
    expect(floorLabel(t, 'M15')).toBe('2026-11-02T22:45');
  });
  it('builds H1 from minute bars + the live price, and chains it up', () => {
    const now = Date.UTC(2026, 10, 2, 20, 47);
    const m1: [number, number, number, number, number][] = [
      [Date.UTC(2026, 10, 2, 19, 59), 1, 1, 1, 1],              // previous hour: ignored
      [Date.UTC(2026, 10, 2, 20, 0), 10, 12, 9, 11],
      [Date.UTC(2026, 10, 2, 20, 46), 11, 13, 10.5, 12],
    ];
    const h1Closed: [number, number, number, number, number][] = [[Date.UTC(2026, 10, 2, 18), 8, 9, 7, 8.5], [Date.UTC(2026, 10, 2, 19), 8.5, 10, 8, 10]];
    const f = buildForming({ H1: h1Closed, H4: [], D1: [] }, m1, 12.5, now);
    expect(f.H1).toEqual({ d: '2026-11-02T22:00', o: 10, h: 13, l: 9, c: 12.5 });
    expect(f.H4).toEqual({ d: '2026-11-02T20:00', o: 8, h: 13, l: 7, c: 12.5 });   // 18:00 + 19:00 UTC closed H1 + the forming H1
    expect(f.D1?.c).toBe(12.5);
  });
});
