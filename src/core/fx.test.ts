import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bucketText, groupBySection, OFF_LIST, parseDetail, parseFx, pepperSymbol, tvLink, wideSpread, fxPx } from './fx';

const SAMPLE = 'tools/fx_scanner/fixtures/sample';
const read = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

describe('fx helpers', () => {
  it('normalises symbols and TradingView links', () => {
    expect(pepperSymbol('PEPPERSTONE:EURUSD')).toBe('EURUSD');
    expect(pepperSymbol('EUR_USD')).toBe('EURUSD');
    expect(tvLink('PEPPERSTONE:XAUUSD')).toBe('https://www.tradingview.com/chart/?symbol=PEPPERSTONE:XAUUSD');
    expect(fxPx(122.4921, 3)).toBe('122.492');
    expect(bucketText('AS')).toBe('Approaching supply');
    expect(bucketText('M')).toBe('Middle');
  });

  it('wide spread = exotic or spread > 10% of stop', () => {
    expect(wideSpread({ exotic: true, spread_pips: 1, stop_pips: 100 })).toBe(true);
    expect(wideSpread({ exotic: false, spread_pips: 12, stop_pips: 100 })).toBe(true);
    expect(wideSpread({ exotic: false, spread_pips: 0.6, stop_pips: 32 })).toBe(false);
  });

  it('groups rows by watchlist section in file order, off-list last', () => {
    const rows = [{ group: 'METALS', wl: true }, { group: '', wl: false }, { group: 'FX MAJORS', wl: true }, { group: 'FX CROSSES', wl: true }];
    expect(groupBySection(rows, ['FX MAJORS', 'METALS']).map(g => g.section)).toEqual(['FX MAJORS', 'METALS', 'FX CROSSES', OFF_LIST]);
  });

  it('tolerates junk and the placeholder', () => {
    expect(parseFx(null)).toBeNull();
    const f = parseFx(read('public/fx/latest.json'))!;
    expect(f.generated).toBe('');
    expect(f.signals).toEqual([]);
    expect(f.map).toEqual([]);
  });
});

describe('engine sample (SCHEMA.md)', () => {
  const f = parseFx(read(`${SAMPLE}/latest.json`))!;
  it('parses latest.json', () => {
    expect(f.generated).toMatch(/Z$/);
    expect(f.signals.length).toBe(f.counts.BUY + f.counts.SELL);
    expect(f.watch.length).toBe(f.counts.WATCH);
    expect(f.map.length).toBe(f.counts.instruments);
    for (const s of [...f.signals, ...f.watch]) { expect(s.sym).toMatch(/^[A-Z0-9]+$/); expect(['BUY', 'SELL', 'WATCH']).toContain(s.kind); }
    for (const r of f.map) expect(r.k).toBeTruthy();
  });
  it('parses every detail shard', () => {
    for (const file of readdirSync(`${SAMPLE}/d`)) {
      const js = read(`${SAMPLE}/d/${file}`);
      for (const sym of Object.keys(js.instruments)) {
        const d = parseDetail(js, sym)!;
        expect(d.sym).toBe(sym);
        expect(Object.values(d.bars).some(b => b.length > 0)).toBe(true);
      }
    }
    expect(parseDetail({}, 'EURUSD')).toBeNull();
  });
});
