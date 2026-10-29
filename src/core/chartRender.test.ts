// Chart render smoke test: every bot chart view for 3 fixture symbols (published data + the simulated live source of
// scripts/chart-ctx.ts) rendered to SVG through logic.ts chartData + chart.ts renderSvg, then geometry checks on the SVG.
// Checks marked `it.fails` are KNOWN visual bugs (TODO(chart-fix)): they pass while the bug is there. The agent that
// fixes one flips it to `it` (vitest reports an it.fails that starts passing as a failure, so nobody forgets).
// PNG renders of the same views: `npx tsx scripts/render-charts.ts --tag after`.
import { beforeAll, describe, expect, it } from 'vitest';
import { chartData } from '../../supabase/functions/telegram-bot/logic';
import { boxes, geom, renderSvg, type ChartModel } from '../../supabase/functions/telegram-bot/chart';
import { harnessCtx, VIEWS } from '../../scripts/chart-ctx';

const ROOT = process.cwd();
const NOW = new Date('2026-10-29T15:00:00Z');   // a Thursday, during the New York session (forming candles)
const FIXTURES: [string, 'stock' | 'fx'][] = [['BABA', 'stock'], ['EURUSD', 'fx'], ['XAUUSD', 'fx']];
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
/** Text boxes, approximated: Inter at ~0.56 em per character, cap height ~0.75 em above the baseline. */
function texts(svg: string): { s: string; x0: number; x1: number; y0: number; y1: number }[] {
  const out = [];
  for (const m of svg.matchAll(/<text ([^>]*)>(.*?)<\/text>/g)) {
    const a = m[1], s = m[2].replace(/<[^>]+>/g, '').replace(/&[a-z]+;/g, '&');
    const fs = num(a, 'font-size'), x = num(a, 'x'), y = num(a, 'y'), w = s.length * fs * 0.56;
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

  // fixed (owner issue 7): the y-range holds every zone it draws; a zone too far away gets an edge chip, not a band
  it('no drawn zone is cut off by the y-range', () => {
    const bad: string[] = [];
    for (const r of renders) {
      const bx = boxes(r.model.layout, r.model.panels.length);
      r.model.panels.forEach((p, i) => {
        const g = geom(p, bx[i], r.model.price, r.model.digits);
        for (const { z } of g.zones) {
          const top = g.y(Math.max(z.prox, z.dist)), bot = g.y(Math.min(z.prox, z.dist));
          const visible = bot >= g.plot.y && top <= g.plot.y + g.plot.h;
          if (visible && (top < g.plot.y - 0.5 || bot > g.plot.y + g.plot.h + 0.5)) bad.push(`${r.name} ${p.tf} ${z.tf} ${z.side} ${z.prox}`);
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
});
