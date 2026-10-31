import { describe, expect, it } from 'vitest';
import { fundChange, holdersShard, holdersUrl, lastMove, parseHolders, parseMeta, pctText, qty, quarterNote, type Fund } from './holders';

const SHARD = { stocks: { XYZ: {
  n: 'XYZ Corp', so: 180_000_000, so_end: '2026-10-20',
  h5: [{ f: 'Vanguard Group Inc', form: '13G/A', d: '2026-10-14', ev: '2026-09-30', pct: 9.57, sh: 17_220_000, idx: true, url: 'https://www.sec.gov/v', chg: { pct: 0.37, sh: 680_000, prev: '2024-02-13' } },
    { f: 'Evil', pct: 6, url: 'javascript:alert(1)' }, { f: '', pct: 5 }, { f: 'No pct' }],
  h5x: [{ f: 'Small LP', pct: 3.1, d: '2026-05-01' }],
  ins: [{ w: 'Doe Jane', role: 'CEO · Director', own: 480_000, pct: 0.267, d: '2026-10-27', code: 'S', mv: -20_000, px: 120 }, { w: '', own: 5 }, { w: 'No shares' }],
  f13: { top: [{ f: 'Vanguard Group Inc', sh: 24_800_000, v: 3e9, ch: 'add', dsh: 1_800_000, pct: 13.78, idx: true }, { f: 'Acme', sh: 1_080_000, ch: 'new', dsh: 1_080_000 }, { f: 'Odd', sh: 5, ch: 'weird' }],
    tot: 54e6, tot_pct: 30, ex: [{ f: 'Exited Fund LP' }] },
} } };

describe('holders card data', () => {
  it('parses a stock, drops bad rows and non-SEC links', () => {
    const r = parseHolders(SHARD, 'XYZ')!;
    expect(r.name).toBe('XYZ Corp');
    expect(r.sharesOut).toBe(180_000_000);
    expect(r.h5.map(h => [h.name, h.index, h.url])).toEqual([['Vanguard Group Inc', true, 'https://www.sec.gov/v'], ['Evil', false, '']]);
    expect(r.h5[0]).toMatchObject({ pct: 9.57, dPct: 0.37, dShares: 680_000, since: '2024-02-13', form: '13G/A' });
    expect(r.fell).toEqual([{ name: 'Small LP', pct: 3.1, date: '2026-05-01' }]);
    expect(r.insiders).toHaveLength(1);
    expect(r.funds.map(f => [f.name, f.change, f.index])).toEqual([['Vanguard Group Inc', 'add', true], ['Acme', 'new', false], ['Odd', 'same', false]]);
    expect(r.exited).toEqual(['Exited Fund LP']);
    expect(r.fundsAllPct).toBe(30);
    expect(parseHolders(SHARD, 'NOPE')).toBeNull();
    expect(parseHolders(null, 'XYZ')).toBeNull();
  });

  it('shards by first letter (the same rule as tools/holders and the bot)', () => {
    expect(['AAPL', 'brk.b', '3M', '', 'Z'].map(holdersShard)).toEqual(['A', 'B', '_', '_', 'Z']);
    expect(holdersUrl('NVDA')).toBe('/holders/t/N.json');
  });

  it('labels', () => {
    expect([qty(2.2e9), qty(861e6), qty(24.8e6), qty(480e3), qty(950)]).toEqual(['2.2B', '861M', '24.8M', '480K', '950']);
    expect([pctText(9.57), pctText(0.42), pctText(0.004)]).toEqual(['9.6%', '0.42%', '<0.01%']);
    const f = (change: Fund['change'], shares: number, dShares: number): Fund => ({ name: 'x', shares, value: null, pct: null, change, dShares, index: false });
    expect(fundChange(f('add', 24_800_000, 1_800_000))).toBe('added +7.8%');
    expect(fundChange(f('cut', 20_500_000, -1_500_000))).toBe('cut -6.8%');
    expect(fundChange(f('new', 1000, 1000))).toBe('new');
    expect(fundChange(f('same', 1000, 0))).toBe('unchanged');
    const r = parseHolders(SHARD, 'XYZ')!;
    expect(lastMove(r.insiders[0])).toBe('sold 20K @ $120.00');
    expect(lastMove({ ...r.insiders[0], moved: 0 })).toBe('');
    const m = parseMeta({ generated: '2026-10-30T09:23:00Z', f4_days: 180, f13: { q: '2026-06-30', pq: '2026-03-31', lag_days: 45 } });
    expect(m).toEqual({ generated: '2026-10-30T09:23:00Z', quarter: '2026-06-30', prevQuarter: '2026-03-31', lagDays: 45, f4Days: 180 });
    expect(quarterNote(m)).toBe('13F as of Jun 30, 2026, filed by Aug 14, 2026 at the latest');
    expect(quarterNote(null)).toBe('');
    expect(parseMeta({})).toBeNull();
  });
});
