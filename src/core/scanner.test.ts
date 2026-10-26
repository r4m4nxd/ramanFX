import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { blankPlan } from './strategy';
import { ago, matches, parseScan, planFromParams, planLink, sectorsOf, tvChart, type ScanSignal } from './scanner';

const sample = JSON.parse(readFileSync(resolve(process.cwd(), 'tools/stock_scanner/fixtures/latest.sample.json'), 'utf8'));
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
    expect(p.signals).toEqual([]);
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
    const rut = s.signals.filter(x => matches(x, 'RUT', 'all'));
    expect(rut.length).toBeGreaterThan(0);
    expect(rut.every(x => x.indexes!.includes('RUT'))).toBe(true);
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
