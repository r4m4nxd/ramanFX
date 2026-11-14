import { describe, expect, it } from 'vitest';
import { parseSymbol, type MhSymbol } from './marketHours';
import { clockNow, fmt12, fmtDur, fxWeekend, globalClock, inWindow, levelOf, nyAheadMin, sessions, shiftClock, shiftSlots, shiftSymbol, slotOf, symbolClock, topWindows, zoneTime } from './tradeClock';

const row = (s: string, k: string, peak: number) => parseSymbol({
  s, n: s, k, d: s, wl: true, y: ['2005-01-02', '2026-11-03', 21], t: [['08:00', '10:00', '07:00', '09:30', 2.27], ['01:00', '03:00', '00:00', '02:00', 1.7]],
  dd: [0.9, 1, 1, 1.07, 1.03], p: Array.from({ length: 48 }, (_, i) => (i === peak ? 230 : i >= 26 && i < 36 ? 50 : 100)),
}) as MhSymbol;
const EUR = row('EURUSD', 'major', 16);
// July dates: Calgary is UTC-6 and New York 2 h ahead under every version of the time zone database
const at = (iso: string) => new Date(iso);

describe('trading clock', () => {
  it('levels', () => {
    expect([null, 0, 0.4, 0.7, 1.15, 1.6].map(levelOf)).toEqual(['closed', 'closed', 'quiet', 'normal', 'busy', 'peak']);
  });
  it('Calgary wall time and the gap to New York', () => {
    expect(zoneTime(at('2026-07-09T14:30:00Z'))).toMatchObject({ weekday: 4, h: 8, m: 30 });
    expect(nyAheadMin(at('2026-07-09T14:30:00Z'))).toBe(120);
    expect(shiftSlots(at('2026-07-09T14:30:00Z'))).toBe(0);
    // winter: 2 h (old rule) or 1 h (Alberta keeps summer time since 2026), and the shift follows it
    const w = at('2026-11-12T15:30:00Z');
    expect([60, 120]).toContain(nyAheadMin(w));
    expect(shiftSlots(w)).toBe((120 - nyAheadMin(w)) / 30);
  });
  it('a smaller gap moves everything later on the Calgary clock', () => {
    const c = shiftClock(symbolClock(EUR), 2);
    expect(c.profile[18]).toBeCloseTo(2.3);
    expect(c.windows[0]).toMatchObject({ from: 16, to: 21, peak: 18 });
    const s = shiftSymbol(EUR, 2);
    expect(s.windows[0]).toMatchObject({ mt: '09:00', from: '08:00', to: '10:30', ny: '10:00' });
    expect(shiftSymbol(EUR, 0)).toBe(EUR);
    // whichever rule the device knows, 10:30 New York is inside the best window (9:00-11:30 New York)
    const w = at('2026-11-12T15:30:00Z');
    expect(clockNow(shiftClock(symbolClock(EUR), shiftSlots(w)), w).inside?.rank).toBe(1);
  });
  it('inside the best window: rank and time left', () => {
    const n = clockNow(symbolClock(EUR), at('2026-07-09T14:30:00Z'));
    expect(n.slot).toBe(17);
    expect(n.inside?.rank).toBe(1);
    expect(n.insideLeftMin).toBe(60);
    expect(n.headline).toBe('Best time #1 is on');
    expect(n.dayFactor).toBe(1.07);
    expect(n.next?.rank).toBe(2);
  });
  it('outside: counts down to the next window, across midnight', () => {
    const n = clockNow(symbolClock(EUR), at('2026-07-09T20:00:00Z'));      // 14:00 Calgary, quiet
    expect(n.level).toBe('quiet');
    expect(n.next?.rank).toBe(2);
    expect(n.nextInMin).toBe(600);
    expect(n.detail).toBe('Next best time 12:00 AM, in 10 h');
  });
  it('forex weekend: closed from Friday 17:00 to Sunday 17:00 New York', () => {
    expect(fxWeekend(at('2026-07-10T20:59:00Z'))).toBe(false);
    expect(fxWeekend(at('2026-07-10T21:00:00Z'))).toBe(true);
    expect(fxWeekend(at('2026-07-12T21:00:00Z'))).toBe(false);
    const n = clockNow(symbolClock(EUR), at('2026-07-11T15:30:00Z'));
    expect(n.closed).toBe(true);
    expect(n.headline).toBe('Market closed');
    expect(n.detail).toBe('Forex opens Sunday 3:00 PM');
    expect(n.inside).toBeNull();
  });
  it('a stock: closed outside its session, not on forex rules', () => {
    const s = parseSymbol({ s: 'AAPL', n: 'AAPL', k: 'stock', t: [['07:30', '09:30', '07:30', '08:00', 2.5]], p: Array.from({ length: 48 }, (_, i) => (i >= 15 && i < 28 ? 120 : null)) }) as MhSymbol;
    const c = symbolClock(s);
    expect(c.roundTheClock).toBe(false);
    expect(clockNow(c, at('2026-07-09T10:00:00Z')).headline).toBe('Closed now');
    expect(clockNow(c, at('2026-07-09T13:40:00Z')).inside?.rank).toBe(1);
    expect(clockNow(c, at('2026-07-11T15:00:00Z')).detail).toBe('Stocks open Monday 7:30 AM');
  });
  it('whole market: averages the majors and finds separated best times', () => {
    const g = globalClock([EUR, row('GBPUSD', 'major', 16), row('AAPL', 'stock', 30)])!;
    expect(g.sub).toBe('Average of 2 major markets');
    expect(g.profile[16]).toBeCloseTo(2.3);
    expect(g.windows[0]).toMatchObject({ rank: 1, peak: 16, from: 16, to: 17 });
    expect(globalClock([])).toBeNull();
    const w = topWindows([...Array(10).fill(1), 2, 2.1, 2, ...Array(20).fill(1), 1.5, ...Array(15).fill(0.5)]);
    expect(w.map(x => x.peak)).toEqual([11, 33]);
    expect(w[0]).toMatchObject({ from: 10, to: 13 });
  });
  it('sessions follow each city (London 8:00 = 1:00 Calgary in summer)', () => {
    const s = Object.fromEntries(sessions(at('2026-07-09T14:30:00Z')).map(x => [x.id, x]));
    expect(s.london).toMatchObject({ from: 2, to: 20 });
    expect(s.newyork).toMatchObject({ from: 12, to: 30 });
    // Asia: Sydney 7:00 (15:00 Calgary) to Tokyo 18:00 (3:00 Calgary), one arc across midnight
    expect(s.asia).toMatchObject({ from: 30, to: 6 });
    expect(inWindow(s.asia, 0)).toBe(true);
    expect(inWindow(s.asia, 10)).toBe(false);
    expect(Object.keys(s)).toEqual(['asia', 'london', 'newyork']);
  });
  it('formatting', () => {
    expect([fmt12(0), fmt12(13), fmt12('15:30'), fmt12(24)]).toEqual(['12:00 AM', '6:30 AM', '3:30 PM', '12:00 PM']);
    expect([fmtDur(5), fmtDur(60), fmtDur(134)]).toEqual(['5 min', '1 h', '2 h 14 min']);
    expect(slotOf('23:30')).toBe(47);
  });
});
