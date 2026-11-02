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
