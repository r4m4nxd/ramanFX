// Chart render smoke test: every bot chart view for 3 fixture symbols (published data + the simulated live source of
// scripts/chart-ctx.ts) rendered to SVG through logic.ts chartData + chart.ts renderSvg, then geometry checks on the SVG.
// Checks marked `it.fails` are KNOWN visual bugs (TODO(chart-fix)): they pass while the bug is there. The agent that
// fixes one flips it to `it` (vitest reports an it.fails that starts passing as a failure, so nobody forgets).
// PNG renders of the same views: `npx tsx scripts/render-charts.ts --tag after`.
// Declutter rules (owner, Nov 2026) are checked on every render below: no text over the plot, <= 2 zones, no broken lines
// or labels, one header line per panel, gutter tags clear of each other and of the price tag, candles fill >= 70%.
import { beforeAll, describe, expect, it } from 'vitest';
import { chartData } from '../../supabase/functions/telegram-bot/logic';
import { boxes, geom, renderSvg, textW, topOf, type ChartModel } from '../../supabase/functions/telegram-bot/chart';
import { harnessCtx, VIEWS } from '../../scripts/chart-ctx';

const ROOT = process.cwd();
const NOW = new Date('2026-10-29T15:00:00Z');   // a Thursday, during the New York session (forming candles)
const FIXTURES: [string, 'stock' | 'fx'][] = [['BABA', 'stock'], ['EURUSD', 'fx'], ['XAUUSD', 'fx']];
const SIZE_W = 1280;
const MIN_GAP = 12;   // px between the last candle's right edge and the price scale

interface Render { name: string; model: ChartModel; svg: string }
const renders: Render[] = [];

beforeAll(async () => {
  for (const mode of ['pub', 'live'] as const) {
    const { ctx } = harnessCtx(ROOT, NOW, mode);
    for (const [sym, market] of FIXTURES) {
      for (const view of VIEWS[market]) {
        const cd = await chartData(sym, view, ctx);
        if (!cd) continue;                                    // a view this market / mode does not have
        renders.push({ name: `${sym} ${view} ${mode}`, model: cd.model, svg: renderSvg(cd.model) });
      }
    }
  }
}, 60_000);

const num = (s: string, k: string) => { const m = new RegExp(`\\b${k}="([^"]*)"`).exec(s); return m ? Number(m[1]) : NaN; };
interface P { tf: string; body: string; plot: { x: number; y: number; w: number; h: number } }
function panels(svg: string): P[] {
  return svg.split('<g class="panel"').slice(1).map(body => {
    const r = /<clipPath id="c\d+"><rect ([^>]*)\/>/.exec(body)![1];
    return { tf: /data-tf="([^"]*)"/.exec(body)![1], body, plot: { x: num(r, 'x'), y: num(r, 'y'), w: num(r, 'width'), h: num(r, 'height') } };
  });
}
/** Text boxes: Inter advance widths (chart.textW), cap height ~0.75 em above the baseline. */
function texts(svg: string): { s: string; x0: number; x1: number; y0: number; y1: number }[] {
  const out = [];
  for (const m of svg.matchAll(/<text ([^>]*)>(.*?)<\/text>/g)) {
    const a = m[1], s = m[2].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '&');
    const fs = num(a, 'font-size'), x = num(a, 'x'), y = num(a, 'y'), w = textW(s, fs, /SemiBold/.test(a));
    const anchor = /text-anchor="(\w+)"/.exec(a)?.[1] ?? 'start';
    const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
    out.push({ s, x0, x1: x0 + w, y0: y - fs * 0.75, y1: y + fs * 0.2 });
  }
  return out;
}

describe('chart render smoke', () => {
  it('renders every view of the fixtures (published + simulated live)', () => {
    const names = renders.map(r => r.name);
    expect(names).toEqual(expect.arrayContaining(['BABA Q pub', 'BABA QMN pub', 'BABA D1 pub', 'BABA M15 live', 'BABA H4 live',
      'EURUSD Q pub', 'EURUSD QW1 pub', 'EURUSD H4 pub', 'EURUSD M15 live', 'XAUUSD Q live']));
    for (const r of renders) expect(r.svg.startsWith('<svg')).toBe(true);
  });

  it('no NaN / undefined / Infinity in any SVG', () => {
    const bad = renders.filter(r => /NaN|undefined|Infinity/.test(r.svg)).map(r => r.name);
    expect(bad).toEqual([]);
  });

  it('every zone rect lies inside its panel plot area', () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      for (const m of p.body.matchAll(/<rect class="zone[^"]*"([^>]*)\/>/g)) {
        const [x, y, w, h] = ['x', 'y', 'width', 'height'].map(k => num(m[1], k));
        if (x < p.plot.x - 0.5 || x + w > p.plot.x + p.plot.w + 0.5 || y < p.plot.y - 0.5 || y + h > p.plot.y + p.plot.h + 0.5) bad.push(`${r.name} ${p.tf}`);
      }
    }
    expect(bad).toEqual([]);
  });

  // the y-range shows every drawn zone's proximal edge (a zone may run off the plot, clipped); a zone too far is a strip tag, not a box
  it('no drawn zone is cut off by the y-range', () => {
    const bad: string[] = [];
    for (const r of renders) {
      const bx = boxes(r.model.layout, r.model.panels.length, topOf(r.model));
      r.model.panels.forEach((p, i) => {
        const g = geom(p, bx[i], r.model.price, r.model.digits);
        for (const { z } of g.zones) {
          const prox = z.prox;
          if (prox < g.lo - 1e-9 || prox > g.hi + 1e-9) bad.push(`${r.name} ${p.tf} ${z.tf} ${z.side} ${z.prox}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  // fixed (owner issue 14): empty candle slots on the right
  it(`>= ${MIN_GAP} px between the last candle and the price scale`, () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      const right = Math.max(...[...p.body.matchAll(/<rect class="candle"([^>]*)\/>/g)].map(m => num(m[1], 'x') + num(m[1], 'width')));
      if (Number.isFinite(right) && p.plot.x + p.plot.w - right < MIN_GAP) bad.push(`${r.name} ${p.tf}: ${(p.plot.x + p.plot.w - right).toFixed(1)} px`);
    }
    expect(bad).toEqual([]);
  });

  // fixed (owner issues 7 / 10): zone, trendline and trade labels are stacked / placed clear of each other
  it('no two text labels overlap (bounding-box approximation)', () => {
    const bad: string[] = [];
    for (const r of renders) {
      const ts = texts(r.svg);
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const [a, b] = [ts[i], ts[j]];
        const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ox > 4 && oy > 4) bad.push(`${r.name}: "${a.s}" x "${b.s}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  // ---- the declutter rules ----------------------------------------------------------------------------------------------
  it('no text inside the plot area (zone prices, line names, trade levels live in the gutter / header)', () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      for (const m of p.body.matchAll(/<text ([^>]*)>(.*?)<\/text>/g)) {
        if (/class="nodata"/.test(m[1])) continue;                       // 'no candles published': nothing to cover
        const t = texts(`<text ${m[1]}>${m[2]}</text>`)[0];
        const ox = Math.min(t.x1, p.plot.x + p.plot.w) - Math.max(t.x0, p.plot.x), oy = Math.min(t.y1, p.plot.y + p.plot.h) - Math.max(t.y0, p.plot.y);
        if (ox > 0.5 && oy > 0.5) bad.push(`${r.name} ${p.tf}: "${t.s}"`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('at most 2 zone boxes per panel, one per side', () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      const z = [...p.body.matchAll(/<rect class="zone (demand|supply)[^"]*"/g)].map(m => m[1]);
      if (z.length > 2 || z.filter(s => s === 'demand').length > 1 || z.filter(s => s === 'supply').length > 1) bad.push(`${r.name} ${p.tf}: ${z.join(',')}`);
      if (/class="zone removed/.test(p.body)) bad.push(`${r.name} ${p.tf}: a removed zone is drawn`);
    }
    expect(bad).toEqual([]);
    expect(renders.some(r => panels(r.svg).some(p => /<rect class="zone /.test(p.body)))).toBe(true);   // the check is not vacuous
  });

  it('no broken line is drawn, no \'× broken\' label, <= 1 own line per direction', () => {
    const bad: string[] = [];
    for (const r of renders) {
      if (/broken|×/.test(r.svg.replace(/<title>.*?<\/title>/g, ''))) bad.push(`${r.name}: broken / × in the SVG`);
      for (const p of panels(r.svg)) {
        if (/class="tl [^"]*broken/.test(p.body)) bad.push(`${r.name} ${p.tf}: a broken line`);
        for (const k of ['ltf', 'htf']) for (const d of ['up', 'down']) if ([...p.body.matchAll(new RegExp(`class="tl ${k} ${d}"`, 'g'))].length > 1) bad.push(`${r.name} ${p.tf}: two ${k} ${d} lines`);
        if ([...p.body.matchAll(/class="tl mom /g)].length > 1) bad.push(`${r.name} ${p.tf}: two momentum lines`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('one header line per panel, inside the panel; no nesting note', () => {
    const bad: string[] = [];
    for (const r of renders) {
      const bx = boxes(r.model.layout, r.model.panels.length, topOf(r.model));
      panels(r.svg).forEach((p, i) => {
        const heads = texts(`${[...p.body.matchAll(/<text class="head"[^>]*>.*?<\/text>/g)].map(m => m[0]).join('')}`);
        if (heads.length !== 1) bad.push(`${r.name} ${p.tf}: ${heads.length} header lines`);
        else if (heads[0].x1 > bx[i].x + bx[i].w - 8) bad.push(`${r.name} ${p.tf}: header runs off the panel`);
        if (/class="nest"/.test(p.body)) bad.push(`${r.name} ${p.tf}: nesting note`);
      });
      expect(r.svg.match(/class="title"/g)).toHaveLength(1);
      expect(r.svg.match(/class="verdict"/g)?.length ?? 0).toBeLessThanOrEqual(1);
      const v = texts(r.svg).find(t => t.s === r.model.verdict);
      if (r.model.verdict && v && v.x1 > SIZE_W - 8) bad.push(`${r.name}: verdict does not fit one line`);
    }
    expect(bad).toEqual([]);
  });

  it('gutter tags (zone / trade / line names) sit right of the plot and clear of each other and of the price tag', () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      const right = p.plot.x + p.plot.w, rects: { y0: number; y1: number; what: string }[] = [];
      for (const m of p.body.matchAll(/<g class="((?:ztag|tradelabel)(?! edge)[^"]*)"><rect x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g)) {
        if (+m[2] < right) bad.push(`${r.name} ${p.tf}: ${m[1]} tag left of the gutter`);
        rects.push({ y0: +m[3], y1: +m[3] + +m[5], what: m[1] });
      }
      const pt = /<rect x="([\d.]+)" y="([\d.]+)" width="[\d.]+" height="30" rx="6" fill="#7C3AED"/.exec(p.body);
      if (pt) rects.push({ y0: +pt[2], y1: +pt[2] + 30, what: 'price' });
      for (const m of p.body.matchAll(/<text class="tllabel" x="[\d.]+" y="([\d.]+)"/g)) rects.push({ y0: +m[1] - 17, y1: +m[1] + 5, what: 'line name' });
      for (let a = 0; a < rects.length; a++) for (let c = a + 1; c < rects.length; c++) if (Math.min(rects[a].y1, rects[c].y1) - Math.max(rects[a].y0, rects[c].y0) > 0.5) bad.push(`${r.name} ${p.tf}: ${rects[a].what} x ${rects[c].what}`);
      for (const e of p.body.matchAll(/<g class="ztag edge[^"]*"><rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)"/g)) {
        if (+e[1] + +e[2] > p.plot.y && +e[1] < p.plot.y + p.plot.h) bad.push(`${r.name} ${p.tf}: a far-zone tag inside the plot`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('candles fill >= ~70% of the plot height', () => {
    const bad: string[] = [];
    for (const r of renders) for (const p of panels(r.svg)) {
      const ys = [...p.body.matchAll(/<line class="wick"[^>]* y1="([\d.]+)" y2="([\d.]+)"/g)].flatMap(m => [+m[1], +m[2]]);
      if (ys.length < 6) continue;
      const fill = (Math.max(...ys) - Math.min(...ys)) / p.plot.h;
      if (fill < 0.69) bad.push(`${r.name} ${p.tf}: ${(fill * 100).toFixed(0)}%`);
    }
    expect(bad).toEqual([]);
  });
});
