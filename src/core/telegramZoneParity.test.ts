// Parity: the bot's TypeScript zone port (zonecore.ts, used on LIVE candles) against the Python scanners. The fixture
// (tools/telegram_bot/parity/make_fixtures.py) holds synthetic bars and the zones the real Python engines publish on
// them (fxcore.analyse + fxscan.detail; scan.analyse + scan.ticker_detail). Zones must be identical: timeframe, side,
// proximal, distal, pattern, touch count and order.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { closedHtf, detect, fxPeriod, fxZonesOf, isoWeek, RAJA, Series, stockZonesOf, toQuarters, type ZBar } from '../../supabase/functions/telegram-bot/zonecore';

type Row = [string, number, number, number, number];
const fx = JSON.parse(readFileSync('tools/telegram_bot/parity/fixtures.json', 'utf8'));
const bars = (rows: Row[]): ZBar[] => rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c }));
const key = (z: { tf: string; side: string; proximal: number; distal: number; pattern: string; touches: number }) =>
  `${z.tf} ${z.side} ${z.proximal}-${z.distal} ${z.pattern} x${z.touches}`;

describe('zone parity with the Python scanners', () => {
  for (const c of fx.fx) {
    it(`FX ${c.sym}: the zones fxscan.py publishes (${c.zones.length})`, () => {
      const b: Record<string, ZBar[]> = {};
      for (const tf of Object.keys(c.bars)) b[tf] = bars(c.bars[tf]);
      const got = fxZonesOf(b, c.pip, c.nd);
      expect(c.zones.length).toBeGreaterThan(5);
      expect(got.map(key)).toEqual(c.zones.map(key));
      expect(new Set(got.map(z => z.tf)).size).toBeGreaterThanOrEqual(3);   // the fixture covers several drawn TFs
    });
  }
  for (const c of fx.stocks) {
    it(`stock ${c.sym}: the zones scan.py publishes (${c.zones.length})`, () => {
      const got = stockZonesOf(bars(c.daily));
      expect(c.zones.length).toBeGreaterThan(3);
      expect(got.map(key)).toEqual(c.zones.map(key));
    });
  }
  it('fixtures cover fresh and tested zones, both sides', () => {
    const all = [...fx.fx, ...fx.stocks].flatMap((c: { zones: { touches: number; side: string }[] }) => c.zones);
    expect(all.some(z => z.touches === 0) && all.some(z => z.touches > 0)).toBe(true);
    expect(all.some(z => z.side === 'demand') && all.some(z => z.side === 'supply')).toBe(true);
  });
});

describe('zonecore helpers', () => {
  it('a textbook base + departure is a demand zone (proximal on the base bodies, distal on the wicks)', () => {
    const flat: ZBar[] = Array.from({ length: 60 }, (_, i) => ({ d: `2026-01-${String(i).padStart(2, '0')}`, o: i % 2 ? 100.8 : 99.2, h: 101, l: 99, c: i % 2 ? 99.2 : 100.8 }));
    const base: ZBar[] = [{ d: 'b1', o: 100, h: 100.6, l: 99.6, c: 100.2 }, { d: 'b2', o: 100.2, h: 100.7, l: 99.7, c: 100.1 }];
    const dep: ZBar = { d: 'dep', o: 100.1, h: 103, l: 99.9, c: 102.9 };
    const after: ZBar[] = Array.from({ length: 4 }, (_, i) => ({ d: `a${i}`, o: 103 + i, h: 104 + i, l: 102.5 + i, c: 103.8 + i }));
    const zs = detect(new Series([...flat, ...base, dep, ...after], null, 'D1'), RAJA).filter(z => z.made === 'a0');
    expect(zs).toHaveLength(1);
    expect(zs[0]).toMatchObject({ dir: 1, prox: 100.2, dist: 99.6, baseN: 2, removed: false });
  });
  it('periods: ISO weeks, forex weeks start Saturday (server time), quarters from closed months', () => {
    expect(isoWeek('2026-01-01')).toBe('2026-W01');
    expect(isoWeek('2027-01-01')).toBe('2026-W53');
    expect(isoWeek('2026-10-29')).toBe('2026-W44');
    expect(fxPeriod('W1', '2026-10-29T08:00')).toBe('2026-10-24');
    expect(fxPeriod('W1', '2026-10-24T00:00')).toBe('2026-10-24');
    expect(fxPeriod('MN', '2026-10-29T08:00')).toBe('2026-10');
    const mn = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05'].map((m, i) => ({ d: `${m}-01`, o: i, h: i + 1, l: i - 1, c: i + 0.5 }));
    expect(toQuarters(mn)).toEqual([{ d: '2026-01-01', o: 0, h: 3, l: -1, c: 2.5 }]);
    const days = ['2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-11-02'].map((d, i) => ({ d, o: i, h: i + 1, l: i - 1, c: i }));
    expect(closedHtf(days, 'W1').map(b => b.d)).toEqual(['2026-10-26']);          // the forming week dropped
    expect(closedHtf(days.slice(0, 5), 'W1').map(b => b.d)).toEqual(['2026-10-26']);   // Friday close: the week is complete
  });
});
