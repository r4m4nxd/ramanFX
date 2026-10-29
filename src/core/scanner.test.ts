import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { blankPlan } from './strategy';
import { ago, bucketOf, homeChart, indexesOf, indexList, listingText, mapTag, mapZone, marketMap, px, readWatch, reasonsText, seidenText, sortSignals, toggleWatch, WATCH_KEY, writeWatch, checkPlanLink, detailFrom, findBySlug, matches, parseIndex, parseScan, planFromParams, planLink, searchTickers, sectorsOf, slug, stockPath, tvChart, unpackBars, type IndexRow, type ScanSignal } from './scanner';

const sample = JSON.parse(readFileSync(resolve(process.cwd(), 'tools/stock_scanner/fixtures/sample/latest.json'), 'utf8'));
const placeholder = JSON.parse(readFileSync(resolve(process.cwd(), 'public/scanner/latest.json'), 'utf8'));

describe('parseScan', () => {
  it('reads the selftest file', () => {
    const s = parseScan(sample)!;
    expect(s.fixture).toBe(true);
    expect(s.counts.BUY).toBeGreaterThan(0);
    expect(s.counts.WATCH).toBeGreaterThan(0);
    expect(s.exits.every(e => !('entry' in e) && !('shares' in e) && !('stop' in e))).toBe(true);
    expect(s.signals.every(x => x.sector && Array.isArray(x.indexes))).toBe(true);
    for (const x of s.signals) expect(s.bars![x.symbol].length).toBeGreaterThanOrEqual(60);
    for (const b of s.signals.filter(x => x.kind === 'BUY')) expect(b.rules.some(r => r.status === 'fail')).toBe(false);
  });
  it('treats junk as no scan, and reads the committed placeholder', () => {
    expect(parseScan(null)).toBeNull();
    expect(parseScan({ signals: 'x' })).toBeNull();
    const p = parseScan(placeholder)!;
    expect(Array.isArray(p.signals)).toBe(true); // the daily scan commits real signals here now
  });
  it('reads the why-no-signal diagnostics and the session', () => {
    const s = parseScan(sample)!;
    expect(s.blocked!.reasons.reduce((a, r) => a + r.count, 0)).toBe(s.blocked!.candidates);
    expect(s.closest!.every(c => c.fails.includes(c.rule))).toBe(true);
    const j = parseScan({ version: 1, signals: [], exits: [], session: 'intraday-dropped',
      blocked: { candidates: 452, within_pct: 5, reasons: [{ rule: 'curve', label: 'high on curve', count: 312 }, { rule: 'HTF align', label: 'direction not long', count: 140 }, { rule: 'x' }] },
      closest: [{ symbol: 'AAPL', name: 'Apple', tf: 'W1', zone_type: 'STR', proximal: 320, distal: 310, price: 330, to_entry_pct: 3.1, rule: 'curve', label: 'high on curve', fails: ['curve'] }, { symbol: 'BAD' }] })!;
    expect(j.session).toBe('intraday-dropped');
    expect(j.blocked!.reasons).toHaveLength(2);
    expect(reasonsText(j.blocked)).toBe('high on curve (312), direction not long (140)');
    expect(j.closest!.map(c => c.symbol)).toEqual(['AAPL']);
    expect(parseScan({ version: 1, signals: [], exits: [] })!.blocked).toBeUndefined();
  });
  it('drops malformed signals', () => {
    const s = parseScan({ version: 1, signals: [{ kind: 'BUY' }, { kind: 'SELL', symbol: 'X', rules: [] }], exits: [{ symbol: 'A', reasons: ['stop'], entry: 5 }] })!;
    expect(s.signals).toEqual([]);
    expect(s.exits).toEqual([{ symbol: 'A', reasons: ['stop'] }]);
    expect(JSON.stringify(s.exits)).not.toContain('entry');
  });
});

describe('plan link', () => {
  const buy = parseScan(sample)!.signals.find(x => x.kind === 'BUY') as ScanSignal;
  it('round-trips the levels into a plan', () => {
    const url = new URL(planLink(buy), 'https://x.test');
    expect(url.pathname).toBe('/plan/new');
    const p = blankPlan(planFromParams(url.searchParams));
    expect(p.symbol).toBe('');
    expect(p.side).toBe('buy');
    expect(p.entry).toBe(buy.entry);
    expect(p.stop).toBe(buy.stop);
    expect(p.target).toBe(buy.target);
    expect(p.proximal).toBe(buy.proximal);
    expect(p.distal).toBe(buy.distal);
    expect(p.opposingHtf).toBe(buy.next_supply);
    expect(p.curve).toBe(Math.round(buy.curve));
    expect(p.kind).toBe(/RBR/.test(buy.pattern) ? 'CP' : 'VP');
    expect(p.note).toMatch(/scanner/);
  });
  it('ignores bad params', () => {
    expect(planFromParams(new URLSearchParams('side=up&entry=abc&curve=400&base=9'))).toEqual({ curve: 100 });
  });
});

describe('filters', () => {
  const s = parseScan(sample)!;
  it('index and sector', () => {
    const tsx = s.signals.filter(x => matches(x, 'TSX', 'all'));
    expect(tsx.length).toBeGreaterThan(0);
    expect(tsx.every(x => x.indexes!.includes('TSX'))).toBe(true);
    expect(tsx.every(x => listingText(x).startsWith('TSX: ') && x.currency === 'USD')).toBe(true);
    const all = s.signals.filter(x => matches(x, 'all', 'all'));
    expect(all.length).toBe(s.signals.length);
    const sec = sectorsOf(s);
    expect(sec[0].buys).toBeGreaterThanOrEqual(sec[sec.length - 1].buys);
    expect(s.signals.filter(x => matches(x, 'all', sec[0].sector)).every(x => x.sector === sec[0].sector)).toBe(true);
  });
});

describe('helpers', () => {
  it('chart link falls back to the bare symbol', () => {
    expect(tvChart({ symbol: 'BRK.B' })).toBe('https://www.tradingview.com/chart/?symbol=BRK.B');
    expect(tvChart({ symbol: 'A', chart: 'javascript:alert(1)' })).toBe('https://www.tradingview.com/chart/?symbol=A');
    expect(tvChart({ symbol: 'AAPL', chart: 'https://www.tradingview.com/chart/?symbol=NASDAQ:AAPL' })).toContain('NASDAQ:AAPL');
  });
  it('ago', () => {
    const now = Date.parse('2026-10-26T12:00:00Z');
    expect(ago('2026-10-26T11:30:00Z', now)).toBe('30 min ago');
    expect(ago('2026-10-26T02:00:00Z', now)).toBe('10 h ago');
    expect(ago('2026-10-20T12:00:00Z', now)).toBe('6 days ago');
    expect(ago('nope', now)).toBe('');
  });
});

const sampleIndex = JSON.parse(readFileSync(resolve(process.cwd(), 'tools/stock_scanner/fixtures/sample/index.json'), 'utf8'));
const shard = (k: number) => JSON.parse(readFileSync(resolve(process.cwd(), `tools/stock_scanner/fixtures/sample/t/${k}.json`), 'utf8'));

describe('ticker search + detail', () => {
  const idx = parseIndex(sampleIndex)!;
  it('index lists every ticker with its shard', () => {
    expect(idx.tickers.length).toBeGreaterThan(5);
    for (const r of idx.tickers) expect(detailFrom(shard(r.k), r.s)?.symbol).toBe(r.s);
    // the committed public index is whatever the last daily scan wrote (placeholder or real): it must parse
    expect(Array.isArray(parseIndex(JSON.parse(readFileSync(resolve(process.cwd(), 'public/scanner/index.json'), 'utf8')))!.tickers)).toBe(true);
    expect(parseIndex({ nope: 1 })).toBeNull();
  });
  it('searches by ticker and name', () => {
    const rows: IndexRow[] = [
      { s: 'AAPL', n: 'Apple Inc.', sec: 'Information Technology', ix: ['SPX'], px: 1, k: 0 },
      { s: 'AA', n: 'Alcoa', sec: 'Materials', ix: ['NDX'], px: 1, k: 1 },
      { s: 'BRK.B', n: 'Berkshire Hathaway', sec: 'Financials', ix: ['SPX'], px: 1, k: 2 },
      { s: 'PINE', n: 'Alpine Income', sec: 'Real Estate', ix: ['TSX'], px: 1, k: 3 },
    ];
    expect(searchTickers(rows, 'aa').map(r => r.s)).toEqual(['AA', 'AAPL']);
    expect(searchTickers(rows, 'apple').map(r => r.s)).toEqual(['AAPL']);
    expect(searchTickers(rows, 'brk-b').map(r => r.s)).toEqual(['BRK.B']);
    expect(searchTickers(rows, 'pine').map(r => r.s)).toEqual(['PINE']);
    expect(searchTickers(rows, '  ')).toEqual([]);
    expect(slug('BRK.B')).toBe('BRK-B');
    expect(stockPath('BRK.B')).toBe('/scanner/BRK-B');
    expect(findBySlug(rows, 'brk-b')?.s).toBe('BRK.B');
    expect(findBySlug(rows, 'XYZ')).toBeNull();
  });
  it('unpacks bars and builds a plan link', () => {
    const r = idx.tickers.find(t => t.sig === 'BUY')!;
    const d = detailFrom(shard(r.k), r.s)!;
    const bars = unpackBars(d.bars);
    expect(bars.length).toBe(d.bars.b.length);
    expect(bars[0][0]).toBe(d.bars.t0);
    expect(bars.every((b, i) => i === 0 || b[0] > bars[i - 1][0])).toBe(true);
    const link = checkPlanLink(d)!;
    expect(link).toMatch(/^\/plan\/new\?/);
    expect(new URL(link, 'https://x.test').searchParams.get('entry')).toBe(String(d.check!.entry));
    expect(d.check!.kind).toBe('BUY');
  });
});

describe('Pinndx-inspired extras', () => {
  const s = parseScan(sample)!;
  it('signals carry gauge, fair value, PZ and Seiden fields; PZ3 = the Raja target', () => {
    for (const x of s.signals) {
      expect(['demand', 'supply', 'middle']).toContain(x.gauge_state);
      expect(x.pz3).toBe(x.target);
      if (x.pz1 != null) expect(x.pz1).toBeGreaterThan(x.entry);
      if (x.pz1 != null && x.target != null) expect(x.pz1).toBeLessThan(x.target);
      expect(x.seiden_score).toBeGreaterThanOrEqual(0);
      expect(x.seiden_score).toBeLessThanOrEqual(10);
      expect(x.fv_lo).toBeLessThanOrEqual(x.fv_hi!);
      expect(x.rules.some(r => r.status === 'fail' && /Fair value|RFX index/.test(r.text))).toBe(false);
    }
    expect(s.rfx_index?.symbol).toBe('RFX');
    expect(seidenText({ fresh: 2 })).toContain('Freshness');
  });
  it('sorts by score, Seiden, nearest and R:R', () => {
    const mk = (score: number, seiden: number, near: number, rr: number) => ({ score, seiden_score: seiden, to_entry_pct: near, rr } as ScanSignal);
    const l = [mk(8, 9, 3, 2), mk(10, 5, 1, 4), mk(9, 7, -2, 9)];
    expect(sortSignals(l, 'score').map(x => x.score)).toEqual([10, 9, 8]);
    expect(sortSignals(l, 'seiden').map(x => x.seiden_score)).toEqual([9, 7, 5]);
    expect(sortSignals(l, 'near').map(x => x.to_entry_pct)).toEqual([1, -2, 3]);
    expect(sortSignals(l, 'rr').map(x => x.rr)).toEqual([9, 4, 2]);
  });
  it('watchlist toggles and survives storage', () => {
    localStorage.removeItem(WATCH_KEY);
    expect(readWatch()).toEqual([]);
    writeWatch(toggleWatch(toggleWatch([], 'MSFT'), 'AAPL'));
    expect(readWatch()).toEqual(['AAPL', 'MSFT']);
    writeWatch(toggleWatch(readWatch(), 'MSFT'));
    expect(readWatch()).toEqual(['AAPL']);
    localStorage.setItem(WATCH_KEY, '{bad');
    expect(readWatch()).toEqual([]);
  });
  it('details carry the gauge and fair value', () => {
    const idx = parseIndex(sampleIndex)!;
    const r = idx.tickers[0];
    const d = detailFrom(shard(r.k), r.s)!;
    expect(['demand', 'supply', 'middle']).toContain(d.gauge!.state);
    expect(d.fv!.lo).toBeLessThanOrEqual(d.fv!.hi);
    expect(['D', 'S', 'M']).toContain(r.st);
  });
});

describe('px', () => {
  it('keeps sub-dollar prices readable and big prices grouped', () => {
    expect(px(0.0123)).toBe('0.0123');
    expect(px(0.456)).toBe('0.456');
    expect(px(24.3)).toBe('24.30');
    expect(px(4500)).toBe('4,500.00');
    expect(px(null)).toBe('—');
    expect(px(Number.NaN)).toBe('—');
  });
});

describe('index registry and listings', () => {
  it('takes the index labels from the scan file', () => {
    const s = parseScan(sample)!;
    expect(indexesOf(s).map(m => m.code)).toEqual(['SPX', 'NDX', 'DJI', 'TSX60', 'TSX']);
    expect(indexesOf(parseScan({ version: 1, signals: [], exits: [], index_meta: [{ code: 'XYZ', label: 'Xyz 10' }] })).map(m => m.short)).toEqual(['XYZ']);
    expect(indexesOf(null).some(m => m.code === 'TSX60')).toBe(true);
    expect(indexList(indexesOf(s))).toBe('S&P 500, Nasdaq-100, Dow 30, TSX 60 and TSX Composite');
    expect(s.uncovered!.map(u => u.symbol)).toEqual(['SYI']);
    expect(s.coverage!.TSX).toEqual({ covered: 2, total: 3 });
  });
  it('labels an interlisted name', () => {
    expect(listingText({ home: 'TSX:RY' })).toBe('TSX: RY · US listing · USD');
    expect(homeChart({ chart_home: 'https://www.tradingview.com/chart/?symbol=TSX:RY' })).toEqual({ url: 'https://www.tradingview.com/chart/?symbol=TSX:RY', label: 'TSX chart (CAD)' });
    expect(homeChart({})).toBeNull();
    expect(parseScan({ version: 1, signals: [], exits: [], data_warning: 'Data warning: IEX', feed_iex: true })?.data_warning).toBe('Data warning: IEX');
    expect(listingText({ home: '' })).toBe('');
  });
});

describe('market map', () => {
  const row = (s: string, o: Partial<IndexRow>): IndexRow => ({ s, n: s, sec: 'Financials', ix: ['SPX'], px: 10, k: 0, ...o });
  it('buckets by where price sits', () => {
    expect(bucketOf({ st: 'S' })).toBe('in_supply');
    expect(bucketOf({ st: 'D', dd: -0.5 })).toBe('in_demand');
    expect(bucketOf({ st: 'M', dd: 2.5, ds: 9 })).toBe('near_demand');
    expect(bucketOf({ st: 'M', dd: 2.5, ds: 1 })).toBe('near_supply');
    expect(bucketOf({ st: 'M', dd: 3.5, ds: 5 })).toBe('middle');
    expect(bucketOf({ st: 'M' })).toBe('middle');
  });
  it('sorts by zone strength and filters', () => {
    const rows = [
      row('WEAK', { st: 'D', dd: -1, dz: ['D1', 'WK', 3, 0] }),
      row('TESTED', { st: 'D', dd: -1, dz: ['W1', 'ARR', 9, 1], br: 'curve' }),
      row('BEST', { st: 'D', dd: -1, dz: ['W1', 'WOW', 9, 0], br: 'HTF align' }),
      row('GOOD', { st: 'D', dd: -1, dz: ['D1', 'STR', 7, 0], sig: 'WATCH' }),
      row('CA', { st: 'S', ds: -1, sz: ['D1', 'STR', 0], ix: ['TSX'], sec: 'Energy' }),
    ];
    const m = marketMap(rows);
    expect(m.in_demand.map(r => r.s)).toEqual(['BEST', 'GOOD', 'TESTED', 'WEAK']);
    expect(m.in_supply.map(r => r.s)).toEqual(['CA']);
    expect(marketMap(rows, 'TSX').in_demand).toEqual([]);
    expect(marketMap(rows, 'all', 'Energy').in_supply.length).toBe(1);
    expect(mapZone(rows[2], 'in_demand')).toMatchObject({ side: 'demand', type: 'WOW', strong: true, fresh: true, score: 9 });
    expect(mapZone(rows[4], 'in_supply')).toMatchObject({ side: 'supply', type: 'STR', score: null });
    expect(mapTag(rows[2])).toEqual({ text: 'direction not long', tone: 'neutral' });
    expect(mapTag(rows[3])).toEqual({ text: 'WATCH', tone: 'warn' });
    expect(mapTag(rows[0])).toBeNull();
  });
  it('uses the buckets of the scan (mb / mz / mr) when the file has them', () => {
    const rows = [
      row('LD', { st: 'M', dd: 1, mb: 'LD', mz: ['D1', 'ARR', 8, 1, 1.2, 9.9], mr: 'curve' }),
      row('AS', { st: 'M', ds: 2, mb: 'AS', mz: ['MN', 'WOW', 7, 0, 2, 10.2], mr: 'dir' }),
      row('LS', { st: 'M', mb: 'LS', mz: ['W1', 'STR', 5, 1, 0.8, 10.1], mr: 'dir' }),
      row('ID', { st: 'M', mb: 'ID', mz: ['W1', 'WOW', 9, 1, 0, 10.5], mr: 'BUY' }),
      row('ID2', { st: 'M', mb: 'ID', mz: ['D1', 'WK', 3, 0, 0, 10.4], mr: 'ok' }),
      row('M', { st: 'D', mb: 'M' }),
    ];
    const m = marketMap(rows);
    expect(m.left_demand.map(r => r.s)).toEqual(['LD']);
    expect(m.near_supply.map(r => r.s)).toEqual(['AS']);
    expect(m.left_supply.map(r => r.s)).toEqual(['LS']);
    expect(m.in_demand.map(r => r.s)).toEqual(['ID', 'ID2']);
    expect(m.middle.map(r => r.s)).toEqual(['M']);              // mb wins over the old state
    expect(mapZone(rows[1], 'near_supply')).toMatchObject({ side: 'supply', tf: 'MN', type: 'WOW', score: 7, pct: 2 });
    expect(mapTag(rows[0])).toEqual({ text: 'high on curve', tone: 'neutral' });
    expect(mapTag(rows[1])).toBeNull();
    expect(mapTag(rows[3])).toEqual({ text: 'BUY', tone: 'profit' });
    expect(mapTag(rows[4])).toEqual({ text: 'rules pass', tone: 'neutral' });
    const p = parseIndex({ tickers: [{ s: 'A', k: 1, mb: 'XX', mz: ['D1', 'WK', 1, 0, 1, 2] }, { s: 'B', k: 1, mb: 'LD', mz: ['D1'] }] })!;
    expect(p.tickers[0].mb).toBeUndefined();
    expect(p.tickers[0].mz).toBeUndefined();
    expect(p.tickers[1].mb).toBe('LD');
    expect(p.tickers[1].mz).toBeUndefined();
  });
  it('maps the real published index (older format: no left buckets) without losing a stock', () => {
    const real = parseIndex(JSON.parse(readFileSync(resolve(process.cwd(), 'public/scanner/index.json'), 'utf8')))!;
    expect(real.tickers.length).toBeGreaterThan(500);
    const m = marketMap(real.tickers);
    expect(Object.values(m).reduce((a, v) => a + v.length, 0)).toBe(real.tickers.length);
    expect(m.in_demand.length + m.in_supply.length).toBeGreaterThan(0);
    for (const r of m.in_demand.slice(0, 20)) expect(mapZone(r, 'in_demand')?.side).toBe('demand');
  });
  it('reads the compact zone fields of the selftest index, dropping malformed ones', () => {
    expect(parseIndex(sampleIndex)!.tickers.some(r => r.dz && r.dz.length === 4)).toBe(true);
    const p = parseIndex({ tickers: [{ s: 'A', k: 1, dz: ['D1'], sz: ['D1', 'STR', 0] }] })!;
    expect(p.tickers[0].dz).toBeUndefined();
    expect(p.tickers[0].sz).toEqual(['D1', 'STR', 0]);
  });
});
