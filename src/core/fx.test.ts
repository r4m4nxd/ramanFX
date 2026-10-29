import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bucketText, distLabel, feedBadge, feedText, FX_CLASSES, fxClassLabel, groupBySection, OFF_LIST, parseDetail, parseFx, parseSignal, pepperSymbol, tvLink, wideSpread, fxPx } from './fx';

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

  it('keeps the known WATCH kinds only', () => {
    for (const k of ['new', 'tested', 'confirm', 'area', 'context']) expect(parseSignal({ kind: 'WATCH', watch_kind: k }).watch_kind).toBe(k);
    expect(parseSignal({ kind: 'WATCH', watch_kind: 'odd' }).watch_kind).toBeNull();
  });

  it('extra sources: crypto class, feeds, unofficial badge, % distances where pips mean nothing', () => {
    expect(FX_CLASSES).toContain('crypto');
    expect(fxClassLabel('crypto')).toBe('Crypto');
    const vix = parseSignal({ sym: 'VIX', oanda: 'VIX', cls: 'cfd', src: 'yahoo', feed: 'Yahoo ^VIX (unofficial feed)', unofficial: true, pip_mode: 'atr', pip: 0.02, kind: 'WATCH' });
    expect([vix.src, vix.unofficial, vix.pipMode, feedBadge(vix), feedText(vix)]).toEqual(['yahoo', true, 'atr', 'unofficial feed', 'Data: Yahoo ^VIX (unofficial feed)']);
    const btc = parseSignal({ sym: 'BTCUSD', oanda: 'BTC_USD', cls: 'crypto', src: 'crypto', feed: 'Coinbase Exchange BTC-USD spot', pip_mode: 'atr', pip: 40 });
    expect([btc.cls, feedBadge(btc)]).toEqual(['crypto', null]);
    expect(distLabel(25, btc, 100000)).toBe('1.00%');
    const mxn = parseSignal({ sym: 'EURMXN', oanda: 'EUR_MXN', cls: 'exotic', src: 'synthetic', feed: 'synthetic: OANDA EUR_USD x USD_MXN', pip: 0.0001 });
    expect([feedBadge(mxn), distLabel(12.34, mxn, 21.5)]).toEqual(['synthetic', '12.3p']);
    expect(feedBadge(parseSignal({ sym: 'EURX', src: 'synthetic', approx: true }))).toBe('approx. basket');
    const eur = parseSignal({ sym: 'EURUSD', oanda: 'EUR_USD', cls: 'major' });
    expect([eur.src, eur.unofficial, feedBadge(eur), feedText(eur)]).toEqual(['', false, null, 'Data: OANDA EUR_USD']);
  });

  it('tolerates junk and the placeholder', () => {
    expect(parseFx(null)).toBeNull();
    const f = parseFx({ version: 1, generated: '', h4: '', h4_close_utc: null, counts: {}, signals: [], watch: [], map: [], unmapped: [], disclaimer: 'No scan yet.' })!;
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
  it('carries the hourly H1 base and H1 rows', () => {
    expect(f.h1).toMatch(/^\d{4}-\d\d-\d\dT\d\d:00$/);
    expect(f.h1_close_utc).toMatch(/Z$/);
    for (const r of f.map) expect(Object.keys(r.dir)).toEqual(expect.arrayContaining(['H1', 'H4', 'D1', 'W1', 'MN']));
    const js = read(`${SAMPLE}/d/cross.json`);
    const d = parseDetail(js, 'GBPJPY')!;
    expect(d.bars.H1.length).toBeGreaterThan(1);
    expect(d.h4).toBeTruthy();
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
