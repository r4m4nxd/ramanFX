import { describe, expect, it } from 'vitest';
import { filterClusters, holdingsLabel, parseInsiders, usd, zoneLabel } from './insiders';

describe('insiders page data', () => {
  it('parses the file, drops bad rows and non-SEC links', () => {
    const f = parseInsiders({ generated: 'g', days: 30, coverage: { days: 21, done: 5 }, clusters: [
      { sym: 'XYZ', kind: 'cluster', n: 3, star: true, strong: true, value: 2.1e6, px: 12.4, url: 'https://www.sec.gov/a', universe: true,
        zone: { tf: 'W1', where: 'inside', lo: 11.9, hi: 12.6 }, lead: { role: 'CEO', pct: 18 }, insiders: [{ name: 'A', url: 'javascript:alert(1)' }] },
      { kind: 'solo' }, null, { sym: 'Q', kind: 'solo', n: 1, price: 8, url: 'https://evil.test/' }] });
    expect(f.clusters.map(c => c.sym)).toEqual(['XYZ', 'Q']);
    expect(f.clusters[0].insiders[0].url).toBe('');
    expect(f.clusters[1].url).toBe('');
    expect(f.clusters[1].px).toBe(8);
    expect(f.coverage).toEqual({ days: 21, done: 5 });
    expect(zoneLabel(f.clusters[0].zone)).toBe('inside W1 demand 11.90–12.60');
    expect(holdingsLabel(f.clusters[0].lead)).toBe('+18% holdings');
    expect(filterClusters(f.clusters, 'star').map(c => c.sym)).toEqual(['XYZ']);
    expect(filterClusters(f.clusters, 'scanner').map(c => c.sym)).toEqual(['XYZ']);
    expect(usd(2_149_000)).toBe('$2.1M');
    expect(parseInsiders(null).clusters).toEqual([]);
  });
});
