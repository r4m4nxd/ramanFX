import { describe, expect, it } from 'vitest';
import { ago, filterActivists, filterClusters, filterPlans, filterSales, holdingsLabel, parseInsiders, usd, zoneLabel } from './insiders';

describe('insiders page data', () => {
  it('parses the file, drops bad rows and non-SEC links', () => {
    const f = parseInsiders({ generated: 'g', days: 30, coverage: { days: 21, done: 5 }, clusters: [
      { sym: 'XYZ', kind: 'cluster', n: 3, star: true, strong: true, value: 2.1e6, px: 12.4, url: 'https://www.sec.gov/a', universe: true, filed: '2026-10-29T19:25:00Z',
        zone: { tf: 'W1', where: 'inside', lo: 11.9, hi: 12.6 }, lead: { role: 'CEO', pct: 18 }, insiders: [{ name: 'A', url: 'javascript:alert(1)' }] },
      { kind: 'solo' }, null, { sym: 'Q', kind: 'solo', n: 1, price: 8, url: 'https://evil.test/' }, { sym: 'E', kind: 'early', n: 1, value: 300000 }] });
    expect(f.clusters.map(c => c.sym)).toEqual(['XYZ', 'Q', 'E']);
    expect(f.clusters[0].insiders[0].url).toBe('');
    expect(f.clusters[1].url).toBe('');
    expect(f.clusters[1].px).toBe(8);
    expect(f.clusters[2].kind).toBe('early');
    expect(f.clusters[0].filed).toBe('2026-10-29T19:25:00Z');
    expect(f.coverage).toEqual({ days: 21, done: 5 });
    expect(zoneLabel(f.clusters[0].zone)).toBe('inside W1 demand 11.90–12.60');
    expect(holdingsLabel(f.clusters[0].lead)).toBe('+18% holdings');
    expect(filterClusters(f.clusters, 'star').map(c => c.sym)).toEqual(['XYZ']);
    expect(filterClusters(f.clusters, 'scanner').map(c => c.sym)).toEqual(['XYZ']);
    expect(usd(2_149_000)).toBe('$2.1M');
    expect(parseInsiders(null).clusters).toEqual([]);
    expect(parseInsiders({}).sells).toEqual([]);                                         // an older file without the new lists
  });

  it('sales, planned sales (Form 144) and activists (13D): parsed, filtered, only SEC links', () => {
    const f = parseInsiders({ generated: 'g', clusters: [],
      sells: [{ sym: 'XYZ', who: 'Doe Jane', role: 'CEO', value: 2.4e6, date: '2026-10-27', filed: '2026-10-29T19:40:00Z', big: true, plan: false, of_mcap: 0.06, pct: -4, url: 'https://www.sec.gov/s' },
        { sym: 'XYZ', who: 'Roe', role: 'CFO', value: 9e5, plan: true, url: 'https://evil.test/' }, { who: '', value: 1 }, { who: 'No value' }],
      plans: [{ sym: 'XYZ', who: 'Doe Jane', role: 'Officer', value: 6.0125e6, shares: 50000, date: '2026-11-02', big: true, plan: true, plan_dates: ['2026-06-12'], of_mcap: 0.15, url: 'https://www.sec.gov/p' }, { sym: 'ABC', who: 'Small', value: 5e5 }],
      activists: [{ sym: 'XYZ', who: 'Activist Capital LP', form: 'SCHEDULE 13D/A', pct: 7, prev_pct: 6.1, shares: 12.6e6, purpose: 'They want a board seat.', universe: true, url: 'https://www.sec.gov/d' },
        { sym: '', name: 'Other Co', who: 'Fund', form: 'SCHEDULE 13D', pct: 5.5, universe: false }] });
    expect(f.sells.map(s => [s.who, s.big, s.plan, s.url])).toEqual([['Doe Jane', true, false, 'https://www.sec.gov/s'], ['Roe', false, true, '']]);
    expect(f.sells[0]).toMatchObject({ ofMcap: 0.06, pct: -4, value: 2.4e6 });
    expect(filterSales(f.sells, 'big').map(s => s.who)).toEqual(['Doe Jane']);
    expect(filterSales(f.sells, 'all')).toHaveLength(2);
    expect(f.plans[0]).toMatchObject({ planDate: '2026-06-12', big: true, ofMcap: 0.15, shares: 50000 });
    expect(filterPlans(f.plans, 'big').map(p => p.who)).toEqual(['Doe Jane']);
    expect(f.activists[0]).toMatchObject({ pct: 7, prevPct: 6.1, universe: true, purpose: 'They want a board seat.' });
    expect(filterActivists(f.activists, true).map(a => a.who)).toEqual(['Activist Capital LP']);
    expect(filterActivists(f.activists, false)).toHaveLength(2);
  });

  it('how long ago a filing was accepted', () => {
    const now = Date.parse('2026-10-29T22:00:00Z');
    expect(ago('2026-10-29T21:59:40Z', now)).toBe('just now');
    expect(ago('2026-10-29T21:25:00Z', now)).toBe('35m ago');
    expect(ago('2026-10-29T19:00:00Z', now)).toBe('3h ago');
    expect(ago('2026-10-26T22:00:00Z', now)).toBe('3d ago');
    expect(ago('', now)).toBe('');
    expect(ago('2026-10-30T22:00:00Z', now)).toBe('');
  });
});
