// Chart image layout (supabase/functions/telegram-bot/chart.ts) after the owner's BABA review (Oct 2026): title clock
// (closed / pre-market / after-hours, MT, DST, weekends), date axis per TF, y-range holds every drawn zone, every zone
// labelled without collisions, demand + supply header, right padding, forming candle, no 'W1 zones shown' note.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { axisTicks, boxes, dateLabel, geom, headerLines, nearestZones, renderSvg, stack, zoneRange, type Bar, type Band, type ChartModel, type Panel } from '../../supabase/functions/telegram-bot/chart';
import { baseIndex, baseStartOf, chartData, chartWhen, type Ctx } from '../../supabase/functions/telegram-bot/logic';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const ctx = (now = '2026-10-29T15:00:00Z'): Ctx => ({ now: new Date(now), imageUrl: () => 'x', async load(p: string) { return p === 'events.json' ? { kinds: {} } : read(`public/${p}`); } });

function bars(n: number, start: string, stepDays: number, base = 100, tf = 'D1'): Bar[] {
  const t0 = Date.parse(`${start}T00:00:00Z`);
  return Array.from({ length: n }, (_, i) => {
    const t = new Date(t0 + i * stepDays * 86400000).toISOString();
    const c = base + Math.sin(i / 5) * 5;
    return { t: tf === 'H4' || tf === 'H1' || tf === 'M15' ? t.slice(0, 16) : t.slice(0, 10), o: c - 1, h: c + 2, l: c - 3, c };
  });
}
const panel = (o: Partial<Panel>): Panel => ({ tf: 'W1', header: '', bars: bars(60, '2025-08-04', 7), zones: [], ...o });
const model = (p: Panel[], o: Partial<ChartModel> = {}): ChartModel => ({ sym: 'BABA', title: 'BABA · test', digits: 2, price: 99.53, panels: p, layout: p.length > 1 ? 'quad' : 'single', ...o });
const panelBody = (svg: string, k: number) => svg.split('<g class="panel"')[k + 1];

describe('chart title clock (issue 5)', () => {
  const st = (now: string, o: Partial<Parameters<typeof chartWhen>[2]> = {}) => chartWhen('stock', new Date(now), { px: '99.53', live: true, ...o });
  it('stocks: live, pre-market, after-hours, closed (MT, DST both sides)', () => {
    expect(st('2026-10-29T17:00:00Z', { sessionToday: true })).toBe('99.53 · live · 11:00 AM MT');          // 13:00 EDT
    expect(st('2026-10-29T12:00:00Z', { sessionToday: true })).toBe('pre-market · last 99.53 · 6:00 AM MT');
    expect(st('2026-10-29T22:40:00Z', { sessionToday: true })).toBe('after-hours · last 99.53 · 4:40 PM MT');
    expect(st('2026-10-30T03:00:00Z', { lastDay: '2026-10-29' })).toBe('closed · last 99.53 · Thu 2:00 PM MT');
    // winter: New York falls back on Nov 1, Alberta stays on UTC-6 (tzdata 2026c) -> the close is 3:00 PM MT
    expect(st('2026-11-06T23:30:00Z', { lastDay: '2026-11-06' })).toBe('after-hours · last 99.53 · 5:30 PM MT');
    expect(st('2026-11-07T18:00:00Z', { lastDay: '2026-11-06' })).toBe('closed · last 99.53 · Fri 3:00 PM MT');
    // weekend: Saturday / Sunday -> Friday's close
    expect(st('2026-05-09T18:00:00Z', { lastDay: '2026-05-08' })).toBe('closed · last 99.53 · Fri 2:00 PM MT');
    // holiday (no session today in the live bars): closed, the last session's close
    expect(st('2026-11-26T17:00:00Z', { sessionToday: false, lastDay: '2026-11-25' })).toBe('closed · last 99.53 · Wed 3:00 PM MT');
    // the scan's data
    expect(chartWhen('stock', new Date('2026-10-29T15:00:00Z'), { px: '99.53', live: false, lastDay: '2026-10-29' })).toBe('last close 99.53 · Thu 2:00 PM MT');
  });
  it('FX: weekend closed from Fri 17:00 New York, crypto never closes, always MT', () => {
    const fx = (now: string, live = true, crypto = false) => chartWhen('fx', new Date(now), { px: '1.11757', live, crypto, scanAt: new Date('2026-10-29T20:00:00Z') });
    expect(fx('2026-10-29T22:40:00Z')).toBe('1.11757 · live · 4:40 PM MT');
    expect(fx('2026-10-31T15:00:00Z')).toBe('closed · last 1.11757 · Fri 3:00 PM MT');                        // Saturday
    expect(fx('2026-11-01T20:00:00Z')).toBe('closed · last 1.11757 · Fri 3:00 PM MT');                        // Sunday before 17:00 EST
    expect(fx('2026-11-01T23:00:00Z')).toBe('1.11757 · live · 5:00 PM MT');                                    // Sunday open (18:00 EST)
    expect(fx('2026-10-31T15:00:00Z', true, true)).toBe('1.11757 · live · 9:00 AM MT');
    expect(fx('2026-10-29T22:40:00Z', false)).toBe('1.11757 · scan 2:00 PM MT');
  });
  it('chartData titles carry the clock with MT', async () => {
    const st2 = await chartData('BABA', 'Q', ctx());
    expect(st2!.model.title).toMatch(/^BABA · last close \d+\.\d\d · Thu 2:00 PM MT$/);
    const fx = await chartData('EURUSD', 'Q', ctx('2026-10-31T15:00:00Z'));
    expect(fx!.model.title).toMatch(/^EURUSD · closed · last [\d.]+ · Fri 3:00 PM MT$/);
  });
});

describe('date axis (issue 6)', () => {
  it('per-TF formats are never ambiguous', () => {
    expect(dateLabel('2016-01-01', 'MN')).toBe('Jan 2016');
    expect(dateLabel('2021-04-01', '3M')).toBe('Apr 2021');
    expect(dateLabel('2024-03-04', 'W1')).toBe('Mar 2024');
    expect(dateLabel('2026-09-17', 'D1')).toBe('Sep 17');
    expect(dateLabel('2026-09-17', 'D1', true)).toBe("Sep 17 '26");
    expect(dateLabel('2026-10-29T09:30', 'H4')).toBe('Oct 29 09:30');
    expect(dateLabel('2026-10-29T13:15', 'M15')).toBe('Oct 29 13:15');
  });
  it('ticks: period starts, year on the first D1 tick and at year changes, labels never overlap', () => {
    const d1 = bars(90, '2025-11-03', 1);
    const t = axisTicks(d1, 'D1', 10, 1000);
    expect(t.length).toBeGreaterThanOrEqual(2);
    expect(t[0][1]).toMatch(/'\d\d$/);
    const jan = t.find(([i]) => d1[i].t.startsWith('2026-01'));
    if (jan) expect(jan[1]).toMatch(/'26$/);
    for (const tf of ['MN', '3M', 'W1']) for (const [, s] of axisTicks(bars(60, '2016-01-01', tf === 'W1' ? 7 : 31), tf, 8, 480)) expect(s).toMatch(/^[A-Z][a-z]{2} \d{4}$/);
    const xs = t.map(([i]) => 10 * (i + 0.5));
    for (let k = 1; k < xs.length; k++) expect(xs[k] - xs[k - 1]).toBeGreaterThan(60);
  });
});

describe('zones: range, labels, header (issues 7-11)', () => {
  const zones: Band[] = [
    { tf: 'W1', side: 'demand', prox: 96.14, dist: 94.36, key: true },
    { tf: 'W1', side: 'demand', prox: 89.14, dist: 84.42 },
    { tf: 'W1', side: 'supply', prox: 120.4, dist: 145.5 },
    { tf: 'W1', side: 'supply', prox: 300, dist: 320 },
  ];
  const p = panel({ bars: bars(60, '2025-08-04', 7, 105), zones });
  it('header: nearest demand below + nearest supply above with % distance', () => {
    const n = nearestZones(zones, 'W1', 99.53);
    expect(n.dem!.z.prox).toBe(96.14);
    expect(n.sup!.z.prox).toBe(120.4);
    expect(headerLines(p, 99.53, 2, 2000, 22)).toEqual(['↓ demand 96.1–94.4 · 3.4% | ↑ supply 120–146 · 21%']);
    expect(headerLines(p, 99.53, 2, 300, 22)).toHaveLength(2);
    expect(zoneRange(120.4, 145.5, 2, 1)).toBe('120.4–145.5');
    expect(zoneRange(1.11281, 1.11121, 5)).toBe('1.1128–1.1112');
  });
  const near: Band[] = [...zones.slice(0, 2), { tf: 'W1', side: 'supply', prox: 114, dist: 118.5 }, zones[3]];
  const pn = panel({ bars: bars(60, '2025-08-04', 7, 105), zones: near });
  it('y-range holds every drawn zone whole (nearest each side) and each one has a label', () => {
    const m = model([pn]);
    const g = geom(pn, boxes('single', 1)[0], m.price, 2);
    const drawn = g.zones.map(d => d.z.prox);
    expect(drawn).toContain(96.14);
    expect(drawn).toContain(114);
    expect(drawn).not.toContain(300);                         // far and not nearest: not drawn
    for (const d of g.zones) { expect(g.lo).toBeLessThanOrEqual(d.lo); expect(g.hi).toBeGreaterThanOrEqual(d.hi); }
    const svg = renderSvg(m);
    const rects = [...svg.matchAll(/class="zone [^"]*"/g)].length;
    const labels = [...svg.matchAll(/class="zlabel [^"]*"/g)].length;
    expect(labels).toBe(rects);
    expect(svg).toContain('>W1 supply 114.00–118.50</text>');   // supply zones labelled like demand
    expect(renderSvg(model([p]))).toContain('>↑ W1 supply 120–146 · 21%</text>');   // too far: an edge chip
  });
  it('a nearest zone too far for the range gets an edge chip instead of a clipped band', () => {
    const far = panel({ bars: bars(60, '2025-08-04', 7, 100), zones: [{ tf: 'W1', side: 'demand', prox: 45, dist: 40 }] });
    const g = geom(far, boxes('single', 1)[0], 99.53, 2);
    expect(g.zones).toHaveLength(0);
    expect(g.edges[0].label).toBe('↓ W1 demand 45.0–40.0 · 55%');
    expect(renderSvg(model([far]))).toContain('zlabel edge demand');
  });
  it('label chips stack without collisions', () => {
    const ys = stack([100, 105, 108, 400, 401], 30, 20, 500);
    const s = [...ys].sort((a, b) => a - b);
    for (let k = 1; k < s.length; k++) expect(s[k] - s[k - 1]).toBeGreaterThanOrEqual(30 - 1e-9);
    const crowd = stack([490, 495, 499], 30, 20, 500);
    expect(Math.max(...crowd)).toBeLessThanOrEqual(500);
    // a crowded real panel: chip boxes never overlap
    const many: Band[] = Array.from({ length: 8 }, (_, i) => ({ tf: 'W1', side: i % 2 ? 'supply' : 'demand', prox: 98 + i * 0.4, dist: 98.2 + i * 0.4 }));
    const svg = renderSvg(model([panel({ zones: many })]));
    const yy = [...svg.matchAll(/class="zlabel[^"]*"><rect x="[\d.]+" y="([\d.]+)"/g)].map(m => +m[1]).sort((a, b) => a - b);
    expect(yy.length).toBeGreaterThan(3);
    for (let k = 1; k < yy.length; k++) expect(yy[k] - yy[k - 1]).toBeGreaterThanOrEqual(28);
  });
  it('zone labels sit on a solid chip with a light text colour (contrast on the dark panel)', () => {
    const svg = renderSvg(model([pn]));
    expect(svg).toMatch(/class="zlabel demand"><rect[^>]*fill="#11131A" fill-opacity="0.92"[^>]*\/><text[^>]*fill="#34D399"/);
    expect(svg).toMatch(/class="zlabel supply"><rect[^>]*\/><text[^>]*fill="#FCA5A5"/);
  });
  it("stock D1: W1 zones light with a 'W1 zones:' header, no 'no D1 zones' note", async () => {
    const cd = await chartData('BABA', 'Q', ctx());
    const svg = renderSvg(cd!.model);
    expect(svg).not.toContain('zones shown');
    const d1 = panelBody(svg, 3);
    expect(d1).toContain('W1 zones:');
    expect(d1).toMatch(/class="zone [^"]*light/);
  });
  it('wide zones lighter + tagged, nesting note and verdict rendered when the model has them', () => {
    const wz = panel({ tf: '3M', zones: [{ tf: '3M', side: 'demand', prox: 132.75, dist: 95.73, key: true, wide: true }], nestNote: 'MN zone outside 3M zone' });
    const svg = renderSvg(model([wz], { verdict: 'Price 3.4% above W1 demand · watch 96.1–94.4' }));
    expect(svg).toMatch(/class="zone demand key wide"[^>]*fill-opacity="0.07"[^>]*stroke-dasharray/);
    expect(svg).toContain('3M demand 132.8–95.7 · wide');
    expect(svg).toContain('(wide)');
    expect(svg).toMatch(/class="nest"[^>]*>MN zone outside 3M zone</);
    expect(svg).toMatch(/class="verdict"[^>]*>Price 3.4% above W1 demand/);
  });
});

describe('candles (issues 12, 14)', () => {
  it('right padding: empty slots between the last candle and the price scale', () => {
    const p = panel({});
    for (const layout of ['single', 'quad'] as const) {
      const m = model(layout === 'quad' ? [p, p, p, p] : [p]);
      const svg = renderSvg(m);
      const b = boxes(layout, m.panels.length)[0];
      const g = geom(p, b, m.price, 2);
      const body = panelBody(svg, 0);
      const all = [...body.matchAll(/class="candle[^"]*" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/g)], last = all[all.length - 1];
      const gap = g.plot.x + g.plot.w - (+last[1] + +last[2]);
      expect(gap).toBeGreaterThanOrEqual(g.plot.w * 0.05);
      expect(gap).toBeGreaterThanOrEqual(3 * g.step - 1);
    }
  });
  it('forming candle hollow with a tick; closed candles solid', () => {
    const svg = renderSvg(model([panel({ forming: true })]));
    expect(svg.match(/class="candle forming"/g)).toHaveLength(1);
    expect(svg).toMatch(/class="candle forming"[^>]*fill-opacity="0.18"[^>]*stroke=/);
    expect(svg).toContain('class="formtick"');
    expect(renderSvg(model([panel({ forming: false })]))).not.toContain('forming"');
  });
  it('chartData marks the forming panels', async () => {
    const cd = await chartData('BABA', 'Q', ctx());
    for (const p of cd!.model.panels) expect(typeof p.forming).toBe('boolean');
    expect(cd!.model.panels.find(p => p.tf === 'D1')!.forming).toBe(false);
  });
});

describe('zone boxes start at the base, like ZoneVision (DrawZones: t1 = oldest base candle, t2 = right edge)', () => {
  const d1 = bars(60, '2026-08-03', 1);
  it('own TF: box x0 = the base candle slot; a base before the window = left edge + an arrow', () => {
    const zone: Band = { tf: 'D1', side: 'demand', prox: 99, dist: 97, key: true, k0: 40 };
    const p = panel({ tf: 'D1', bars: d1, zones: [zone] });
    const g = geom(p, boxes('single', 1)[0], 99.53, 2);
    const svg = renderSvg(model([p]));
    const m = /class="zone demand key"[^>]* x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/.exec(svg)!;
    expect(+m[1]).toBeCloseTo(g.plot.x + g.step * 40, 0);
    expect(+m[1] + +m[2]).toBeCloseTo(g.plot.x + g.plot.w, 0);                // runs to the right edge
    expect(svg).not.toContain('class="offleft"');
    const old = renderSvg(model([panel({ tf: 'D1', bars: d1, zones: [{ ...zone, k0: -1 }] })]));
    expect(/class="zone demand key"[^>]* x="([\d.]+)"/.exec(old)![1]).toBe(String(g.plot.x));
    expect(old).toContain('class="offleft"');
    const none = renderSvg(model([panel({ tf: 'D1', bars: d1, zones: [{ ...zone, k0: undefined }] })]));
    expect(/class="zone demand key"[^>]* x="([\d.]+)"/.exec(none)![1]).toBe(String(g.plot.x));   // unknown base: full width
  });
  it('baseIndex: same TF = the base candle, higher TF = the first panel bar inside the HTF base candle, older = -1', () => {
    expect(baseIndex('2026-08-20', d1)).toBe(17);
    expect(baseIndex('2026-08-20T00:00', d1)).toBe(17);
    expect(baseIndex('2026-07-01', d1)).toBe(-1);
    expect(baseIndex(undefined, d1)).toBeUndefined();
    const w1 = bars(20, '2026-06-01', 7, 100, 'W1');                          // Mondays
    expect(baseIndex('2026-08-17', d1, w1)).toBe(14);                          // week of Mon Aug 17 -> D1 Aug 17
    const mn = bars(6, '2026-05-01', 31);                                         // 05-01, 06-01, 07-02, 08-02, 09-02 ...
    expect(baseIndex(mn[3].t, d1, mn)).toBe(0);                                // the HTF base candle covers the first D1 bar    // a month that covers the first D1 bar: bar 0
    const h4 = Array.from({ length: 30 }, (_, i) => ({ t: new Date(Date.parse('2026-10-26T00:00:00Z') + i * 4 * 3600000).toISOString().slice(0, 16), o: 1, h: 2, l: 0.5, c: 1.5 }));
    expect(baseIndex('2026-10-27', h4, bars(10, '2026-10-20', 1))).toBe(6);   // D1 base on the 4H axis: Oct 27 00:00
  });
  it('baseStartOf mirrors zonecore.detect: stay-away -> leg-out -> the basing candles before it', () => {
    const b: Bar[] = [
      { t: '2026-01-01', o: 10, h: 11, l: 9, c: 10.5 }, { t: '2026-01-02', o: 10, h: 11, l: 9.9, c: 10.9 },     // trend (body 0.9 / range 1.1: not basing)
      { t: '2026-01-05', o: 10.6, h: 11, l: 10.2, c: 10.7 },                                                  // base 1 (body 0.1 / range 0.8)
      { t: '2026-01-06', o: 10.7, h: 11, l: 10.3, c: 10.65 },                                                 // base 2
      { t: '2026-01-07', o: 10.7, h: 13, l: 10.6, c: 12.9 },                                                  // leg-out
      { t: '2026-01-08', o: 12.9, h: 13.5, l: 12.5, c: 13.4 },                                                // stay-away = made
      ...Array.from({ length: 5 }, (_, i) => ({ t: `2026-01-${12 + i}`, o: 13.4, h: 14, l: 13, c: 13.8 })),
    ];
    expect(baseStartOf(b, '2026-01-08', 'D1')).toBe('2026-01-05');
    expect(baseStartOf(b, '2025-01-01', 'D1')).toBeUndefined();
  });
  it('chartData: zones carry their base start and box index (BABA published + EURUSD)', async () => {
    const st = await chartData('BABA', 'Q', ctx());
    const all = st!.model.panels.flatMap(p => p.zones);
    expect(all.some(z => typeof z.t0 === 'string')).toBe(true);
    expect(all.some(z => typeof z.k0 === 'number')).toBe(true);
    const fx = await chartData('EURUSD', 'Q', ctx());
    for (const p of fx!.model.panels) for (const z of p.zones) if (z.k0 != null && z.k0 >= 0 && z.tf === p.tf) expect(p.bars[z.k0].t.slice(0, 16)).toBe((z.t0!.length >= 16 ? z.t0!.slice(0, 16) : `${z.t0}T00:00`.slice(0, 16)).slice(0, p.bars[z.k0].t.length));
  });
});
