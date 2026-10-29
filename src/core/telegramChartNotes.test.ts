// Chart data fixes for the bot's chart images (owner review of a live BABA chart, price 99.53): duplicate trendlines,
// missing own-TF / higher-TF lines (fallbackLine), wide zones (+ refine), nesting notes, the verdict line, same-TF zone
// merge, a partial first period, short-history notes. Input: synthetic bars + the BABA shard as published 2026-10-29
// (tools/telegram_bot/parity/baba_2026-10-29.json).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { aggregate, quarterKey, weekKey, monthKey, type Bar } from '../../supabase/functions/telegram-bot/chart';
import { buildPanels, chartData, dropPartialHead, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { Series } from '../../supabase/functions/telegram-bot/zonecore';
import { fallbackLine, panelTrendlines, rowTrendlines, sameLine, tlAt, type ChartTl } from '../../supabase/functions/telegram-bot/trendcore';
import { atrPct, compact, isWide, nestNote, refineOf, structure, verdict, VERDICT_MAX, type NZone } from '../../supabase/functions/telegram-bot/chartnotes';

const BABA = JSON.parse(readFileSync('tools/telegram_bot/parity/baba_2026-10-29.json', 'utf8'));
const babaCtx = (): Ctx => {
  const files: Record<string, unknown> = {
    'scanner/index.json': { tickers: [BABA.row] },
    [`scanner/t/${BABA.row.k}.json`]: { tickers: { BABA: BABA.ticker } },
    'scanner/latest.json': { signals: [] },
  };
  return { now: new Date('2026-10-29T22:00:00Z'), load: async (p: string) => files[p] ?? null, imageUrl: () => 'x' };
};

/** Business days from 2024-11-04: a clear downtrend 200 -> 100 with 25-day swings (lower highs, lower lows). */
function downtrend(n = 500, from = 200, to = 100): Bar[] {
  const out: Bar[] = [];
  const t = new Date('2024-11-04T00:00:00Z');
  let prev = from;
  for (let i = 0; i < n; i++) {
    while (t.getUTCDay() === 0 || t.getUTCDay() === 6) t.setUTCDate(t.getUTCDate() + 1);
    const base = from + (to - from) * i / (n - 1);
    const c = base * (1 + 0.06 * Math.sin(i * 2 * Math.PI / 25));
    const o = prev, h = Math.max(o, c) * 1.006, l = Math.min(o, c) * 0.994;
    out.push({ t: t.toISOString().slice(0, 10), o, h, l, c });
    prev = c;
    t.setUTCDate(t.getUTCDate() + 1);
  }
  return out;
}

describe('trendlines on the chart: duplicates', () => {
  const line = (dir: number, pts: [number, number][], htf = false): ChartTl => ({ tf: htf ? 'W1' : 'D1', htf, dir, touches: 2, crossed: false, pts });
  it('sameLine: same direction and within the tolerance over the overlap; else not', () => {
    expect(sameLine(line(-1, [[10, 130.62], [59.5, 107.63]]), line(-1, [[32, 120.40], [59.5, 107.22]]), 1.5)).toBe(true);   // the owner's BABA D1 pair
    expect(sameLine(line(-1, [[10, 130]], ), line(-1, [[10, 130], [59.5, 107]]), 1.5)).toBe(false);
    expect(sameLine(line(-1, [[10, 130], [59.5, 107]]), line(1, [[10, 130], [59.5, 107]]), 1.5)).toBe(false);
    expect(sameLine(line(-1, [[0, 130], [59.5, 107]]), line(-1, [[0, 125], [59.5, 107]]), 1.5)).toBe(false);
    expect(sameLine(line(-1, [[0, 130], [20, 120]]), line(-1, [[40, 110], [59.5, 100]]), 50)).toBe(false);   // no overlap
  });

  it('two published lines that are the same line are drawn once', () => {
    const d = downtrend(120);
    const last = d[d.length - 1];
    const pub = [{ dir: -1, p: last.h * 1.02, s: -0.4, n: 60, t: last.t, touches: 3 }, { dir: -1, p: last.h * 1.02 + 0.05, s: -0.401, n: 40, t: last.t, touches: 2 }];
    const got = panelTrendlines({ tf: 'D1', bars: d, forming: false, pub }, 60, last.c, null);
    expect(got.filter(t => t.dir < 0 && !t.htf)).toHaveLength(1);
  });

  it('BABA as published: the D1 panel draws its down line once', async () => {
    const cd = await chartData('BABA', 'Q', babaCtx());
    const d1 = cd!.model.panels.find(p => p.tf === 'D1')!;
    const tls = d1.tls ?? [];
    for (let i = 0; i < tls.length; i++) for (let j = i + 1; j < tls.length; j++) expect(sameLine(tls[i], tls[j], 1.0)).toBe(false);
    expect(tls.filter(t => !t.htf && t.dir < 0)).toHaveLength(1);
  });
});

describe('trendlines on the chart: missing lines', () => {
  it('fallbackLine: a clear W1 downtrend gets a down line from a swing high; never crossed, never above a later high', () => {
    const w1 = aggregate(downtrend(), weekKey);
    const S = new Series(w1.map(b => ({ d: b.t, o: b.o, h: b.h, l: b.l, c: b.c })), w1[w1.length - 1].c, 'W1');
    const t = fallbackLine(S, -1)!;
    expect(t).not.toBeNull();
    expect(t.dir).toBe(-1);
    expect(t.fb).toBe(true);
    expect(t.crossBar).toBe(-1);
    expect(t.pb).toBeLessThan(t.pa);
    for (let j = t.a - 3; j >= 1; j--) expect(S.H[j]).toBeLessThanOrEqual(tlAt(t, j) + 1e-9);
    expect(fallbackLine(S, 1)).toBeNull();               // the lowest low is the newest: no up line in a downtrend
    expect(fallbackLine(new Series(S.T.slice(1, 6).map((d, i) => ({ d, o: 1, h: 2, l: 0.5, c: 1 + i })), 1, 'W1'), -1)).toBeNull();   // < 8 bars
  });

  it('BABA W1 as the scanner sees it: the house down line was removed (spike above), the fallback finds the fall from 181', () => {
    const hb = BABA.ticker.hb.W1;
    const d0 = Date.parse(`${hb.t0}T00:00:00Z`);
    const w1 = hb.b.slice(0, -1).map((r: number[], i: number) => ({ d: new Date(d0 + hb.dt[i] * 86400000).toISOString().slice(0, 10), o: r[0], h: r[1], l: r[2], c: r[3] }));
    const S = new Series(w1, BABA.ticker.price, 'W1');
    const st = rowTrendlines(S);
    expect(st.lines.filter(t => t.dir < 0 && !t.removed)).toHaveLength(0);   // the house rule: none in force
    const t = fallbackLine(S, -1)!;
    expect(S.H[t.a]).toBeCloseTo(181.1, 1);
    expect(tlAt(t, 0)).toBeGreaterThan(BABA.ticker.price);
    expect(tlAt(t, 0)).toBeLessThan(130);
  });

  it('a synthetic W1 downtrend with no published W1 line: a gold W1 line on the D1 panel and a W1 line on the W1 panel', () => {
    const d = downtrend();
    const bars = { D1: d, W1: aggregate(d, weekKey), MN: aggregate(d, monthKey), '3M': aggregate(d, quarterKey) };
    const price = d[d.length - 1].c;
    const panels = buildPanels(['MN', 'W1', 'D1'], bars, [], price, 2, null, 'quad', t => t,
      { forming: { D1: false, W1: false, MN: false, '3M': false }, htf: { D1: 'W1', W1: 'MN', MN: '3M' }, pub: { W1: [], MN: [], '3M': [] } });
    const d1 = panels.find(p => p.tf === 'D1')!, w1 = panels.find(p => p.tf === 'W1')!;
    const gold = (d1.tls ?? []).filter(t => t.htf && t.tf === 'W1' && t.dir < 0);
    expect(gold.length).toBe(1);
    expect((w1.tls ?? []).some(t => t.dir < 0)).toBe(true);
    for (const p of panels) for (const t of p.tls ?? []) for (const [, y] of t.pts) expect(Number.isFinite(y)).toBe(true);
  });

  it('BABA as published (scanner tls empty): lines on 3M / MN / W1 and a gold W1 line on D1', async () => {
    const cd = await chartData('BABA', 'Q', babaCtx());
    const p = Object.fromEntries(cd!.model.panels.map(x => [x.tf, x]));
    for (const tf of ['3M', 'MN', 'W1']) expect((p[tf].tls ?? []).length).toBeGreaterThan(0);
    expect((p.D1.tls ?? []).some(t => t.htf && t.tf === 'W1' && t.dir < 0)).toBe(true);
    expect((p.W1.tls ?? []).some(t => t.dir < 0)).toBe(true);
  });
});

describe('zones: wide, refine, nesting, merge', () => {
  it('isWide: % of price or a D1-ATR multiple per TF', () => {
    const z = (tf: string, prox: number, dist: number): NZone => ({ tf, side: 'demand', prox, dist });
    expect(isWide(z('3M', 132.75, 95.73), 99.53, 3)).toBe(true);     // the owner's BABA 3M demand (37% of price)
    expect(isWide(z('W1', 96.14, 94.36), 99.53, 3)).toBe(false);
    expect(isWide(z('MN', 86.94, 80.06), 99.53, 3)).toBe(false);
    expect(isWide(z('H4', 1.1128, 1.1112), 1.1175, 0.6)).toBe(false);
    expect(isWide(z('H4', 1.13, 1.11), 1.1175, 0.6)).toBe(true);
    expect(isWide(z('W1', 70000, 64000), 78000, 0.5)).toBe(true);    // 7.7% > 3%
    expect(isWide(z('W1', 70000, 64000), 78000, 3)).toBe(false);     // volatile: 3 x 3% = 9%
    expect(atrPct([{ t: 'a', o: 100, h: 101, l: 99, c: 100 }])).toBe(0);
  });

  it('refineOf: the nearest lower-TF same-side zone overlapping the wide one', () => {
    const zs: NZone[] = [{ tf: '3M', side: 'demand', prox: 132.75, dist: 95.73 }, { tf: 'MN', side: 'demand', prox: 86.94, dist: 80.06 },
      { tf: 'W1', side: 'demand', prox: 96.14, dist: 94.36 }, { tf: 'W1', side: 'supply', prox: 110, dist: 112 }];
    expect(refineOf(zs[0], zs, 99.53)).toEqual(zs[2]);
    expect(refineOf(zs[1], zs, 99.53)).toBeNull();
  });

  it('nestNote: nested / overlaps / at / outside / none / unknown', () => {
    const z = (tf: string, side: 'demand' | 'supply', prox: number, dist: number): NZone => ({ tf, side, prox, dist });
    const zs = [z('3M', 'demand', 132.75, 95.73), z('MN', 'demand', 86.94, 80.06), z('W1', 'demand', 96.14, 94.36), z('MN', 'supply', 124.22, 146.87)];
    expect(nestNote(zs[1], zs)).toBe('MN demand outside 3M demand (below)');
    expect(nestNote(z('MN', 'demand', 120, 110), zs)).toBe('nested in 3M demand');
    expect(nestNote(z('MN', 'demand', 100, 90), zs)).toBe('overlaps 3M demand');
    expect(nestNote(z('MN', 'demand', 140, 136), zs)).toBe('at 3M demand (just outside)');   // within 25% of its height above the proximal
    expect(nestNote(zs[2], zs)).toBe('W1 demand outside MN demand (above)');
    expect(nestNote(z('MN', 'supply', 130, 140), zs)).toBe('no 3M supply to nest in');
    expect(nestNote(zs[0], zs)).toBeNull();                  // no 6M zones: unknown
    expect(nestNote(z('H4', 'demand', 1, 0.9), zs)).toBeNull();
    expect(nestNote(null, zs)).toBeNull();
  });

  it('BABA chart model: 3M demand wide (refined to the W1 demand), MN nesting note, wide on every zone', async () => {
    const m = (await chartData('BABA', 'Q', babaCtx()))!.model;
    const p = Object.fromEntries(m.panels.map(x => [x.tf, x]));
    const d3 = p['3M'].zones.find(z => z.side === 'demand')!;
    expect([d3.prox, d3.dist, d3.wide]).toEqual([132.75, 95.73, true]);
    expect(d3.refine).toMatchObject({ tf: 'W1', prox: 96.14, dist: 94.36 });
    expect(p.W1.zones.every(z => z.wide === false)).toBe(true);
    for (const x of m.panels) for (const z of x.zones) expect(typeof z.wide).toBe('boolean');
    expect(p.MN.nestNote).toBe('MN demand outside 3M demand (below)');
    expect(p.W1.nestNote).toBe('W1 demand outside MN demand (above)');
    expect(p['3M'].nestNote).toBeNull();
    expect(p.D1.nestNote).toBeNull();                       // shows the W1 zones
  });

  it('same-TF same-side zones covering >= 50% of the smaller one are drawn once (the fresher / stronger kept)', async () => {
    const t = { ...BABA.ticker, zones: [...BABA.ticker.zones,
      { tf: 'W1', side: 'demand', proximal: 96.0, distal: 94.9, type: 'TST', score: 3, fresh: false, touches: 1 },
      { tf: 'W1', side: 'demand', proximal: 97.5, distal: 95.2, type: 'STR', score: 9, fresh: true, touches: 0 },
      { tf: 'W1', side: 'demand', proximal: 93.0, distal: 92.0, type: 'WK', score: 2, fresh: true, touches: 0 }] };
    const files: Record<string, unknown> = { 'scanner/index.json': { tickers: [BABA.row] }, [`scanner/t/${BABA.row.k}.json`]: { tickers: { BABA: t } }, 'scanner/latest.json': { signals: [] } };
    const m = (await chartData('BABA', 'Q', { now: new Date(), load: async (p: string) => files[p] ?? null }))!.model;
    const w1 = m.panels.find(p => p.tf === 'W1')!.zones.filter(z => z.tf === 'W1' && z.side === 'demand');
    // 96.0-94.9 (tested) merges into 96.14-94.36 (fresh, score 6), which then gives way to 97.5-95.2 (fresh, score 9,
    // covers 53% of it); 93-92 touches nothing: kept
    expect(w1.map(z => z.prox)).toEqual([97.5, 93.0, 89.14]);
  });
});

describe('history: partial first period, short-history notes', () => {
  it('dropPartialHead: a quarter that starts before the first daily bar is dropped; a full one kept', () => {
    const d = downtrend(120);                               // starts Mon 2024-11-04: mid-quarter, mid-month, a full week
    expect(dropPartialHead(aggregate(d, quarterKey), d, quarterKey)[0].t.slice(0, 7)).toBe('2025-01');
    expect(dropPartialHead(aggregate(d, monthKey), d, monthKey)[0].t.slice(0, 7)).toBe('2024-12');
    expect(dropPartialHead(aggregate(d, weekKey), d, weekKey)[0].t).toBe('2024-11-04');
    expect(dropPartialHead([], d, quarterKey)).toEqual([]);
  });

  it('published stock without hb: 3M / MN rebuilt from 120 sessions, partial head dropped, short-history note', async () => {
    const { hb: _hb, ...t } = BABA.ticker;
    const files: Record<string, unknown> = { 'scanner/index.json': { tickers: [BABA.row] }, [`scanner/t/${BABA.row.k}.json`]: { tickers: { BABA: t } }, 'scanner/latest.json': { signals: [] } };
    const m = (await chartData('BABA', 'Q', { now: new Date(), load: async (p: string) => files[p] ?? null }))!.model;
    const q = m.panels.find(p => p.tf === '3M')!;
    expect(q.bars[0].t.slice(0, 7)).toBe('2026-07');        // the daily bars start 2026-05-11: Q2 2026 is partial
    expect(q.note).toMatch(/^short history: \d 3M candles$/);
    expect(m.panels.find(p => p.tf === 'W1')!.note).toBeUndefined();
  });
});

describe('verdict', () => {
  const zs: NZone[] = [{ tf: '3M', side: 'demand', prox: 132.75, dist: 95.73 }, { tf: 'MN', side: 'demand', prox: 86.94, dist: 80.06 },
    { tf: 'W1', side: 'demand', prox: 96.14, dist: 94.36 }, { tf: 'W1', side: 'supply', prox: 124.22, dist: 130 }];
  const down: Bar[] = downtrend(60, 130, 100);
  it('the owner\'s BABA reading, deterministic, <= 110 chars', () => {
    const v = verdict({ price: 99.53, digits: 2, market: 'stock', zones: zs, relTf: 'W1', trendTf: 'D1', trendLines: [{ tf: 'D1', htf: false, dir: -1, crossed: false }], trendBars: down });
    expect(v).toBe('Price 3.4% above W1 demand (96.14–94.36), inside 3M demand · D1 downtrend · watch 96.14–94.36');
    expect(v.length).toBeLessThanOrEqual(VERDICT_MAX);
  });
  it('a scanner signal replaces the watch; long parts dropped least important first', () => {
    const v = verdict({ price: 99.53, digits: 2, market: 'stock', zones: zs, relTf: 'W1', trendTf: 'D1', trendLines: [], trendBars: down, sig: { tf: 'W1', kind: 'BUY', entry: 96.14 } });
    expect(v).toContain('scanner: BUY W1 at 96.14');
    expect(v).not.toContain('watch');
    expect(v).toContain('D1 downtrend');                   // from the swing structure (no lines)
    expect(v.length).toBeLessThanOrEqual(VERDICT_MAX);
  });
  it('inside a zone, no zones, FX digits', () => {
    expect(verdict({ price: 95.9, digits: 2, market: 'stock', zones: zs, relTf: 'W1', trendTf: 'D1', trendLines: [], trendBars: [] }))
      .toMatch(/^Price inside W1 demand \(96\.14–94\.36\), inside 3M demand · D1 no clear trend/);
    expect(verdict({ price: 50, digits: 2, market: 'stock', zones: [], relTf: 'W1', trendTf: 'D1', trendLines: [], trendBars: [] })).toBe('Price 50.00: no W1 zone near · D1 no clear trend');
    expect(compact(1.112814, 5, true)).toBe('1.1128');
    expect(compact(78890.57, 2, true)).toBe('78891');
    expect(compact(132.75, 2, false)).toBe('132.8');
    expect(structure(down)).toBe(-1);
  });
  it('BABA chart model carries the verdict', async () => {
    const m = (await chartData('BABA', 'Q', babaCtx()))!.model;
    expect(m.verdict).toMatch(/^Price 3\.\d% above W1 demand \(96\.14–94\.36\), inside 3M demand · D1 downtrend/);
    expect(m.verdict.length).toBeLessThanOrEqual(VERDICT_MAX);
  });
});
