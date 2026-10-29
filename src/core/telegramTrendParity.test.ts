// Parity: the SCANNERS' trendline rule ported to TypeScript (trendcore.ts; the chart images draw the owner's ZoneVision rule, zvTrend.ts) against
// the Python scanners' zones.trendlines(). The fixture (tools/telegram_bot/parity/make_fixtures.py) holds synthetic bars
// and every line the real Python engine builds on each row (FX: the fxcore.analyse rows H1 .. MN + 3M; stocks: D1 / W1 /
// MN / 3M on closed bars), the in-force up / down line and its touches. Lines must be identical.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { closedHtf, Series, toQuarters, type ZBar } from '../../supabase/functions/telegram-bot/zonecore';
import { pickLines, rowTrendlines, tlAt, type TLState } from '../../supabase/functions/telegram-bot/trendcore';

type Row = [string, number, number, number, number];
interface PyLine { dir: number; a: number; b: number; pa: number; pb: number; removed: boolean; removed_bar: number; conf: boolean; cross_bar: number }
interface PyTl { n: number; ok: boolean; lines: PyLine[]; up: number; dn: number; up_touches: number; dn_touches: number }
const fx = JSON.parse(readFileSync('tools/telegram_bot/parity/fixtures.json', 'utf8'));
const bars = (rows: Row[]): ZBar[] => rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c }));
const KEEP: Record<string, number> = { H1: 1500, H4: 1500, D1: 1500, W1: 1500, MN: 600 };

function same(st: TLState, S: Series, py: PyTl) {
  expect(S.n).toBe(py.n);
  expect(st.lines.map(t => [t.dir, t.a, t.b, t.removed, t.removedBar, t.conf, t.crossBar]))
    .toEqual(py.lines.map(t => [t.dir, t.a, t.b, t.removed, t.removed_bar, t.conf, t.cross_bar]));
  st.lines.forEach((t, i) => { expect(t.pa).toBeCloseTo(py.lines[i].pa, 9); expect(t.pb).toBeCloseTo(py.lines[i].pb, 9); });
  expect(st.up ? st.lines.indexOf(st.up) : -1).toBe(py.up);
  expect(st.dn ? st.lines.indexOf(st.dn) : -1).toBe(py.dn);
  expect([st.upTouches, st.dnTouches]).toEqual([py.up_touches, py.dn_touches]);
}

describe('trendline parity with the Python scanners', () => {
  for (const c of fx.fx) {
    it(`FX ${c.sym}: every line of every row`, () => {
      const b: Record<string, ZBar[]> = {};
      for (const tf of Object.keys(c.bars)) b[tf] = bars(c.bars[tf]);
      const rows: Record<string, ZBar[]> = { ...Object.fromEntries(Object.keys(KEEP).map(tf => [tf, (b[tf] ?? []).slice(-KEEP[tf])])), '3M': toQuarters(b.MN) };
      for (const [tf, py] of Object.entries(c.tls as Record<string, PyTl>)) {
        const S = new Series(rows[tf], c.price, tf);
        same(rowTrendlines(S), S, py);
      }
    });
  }
  for (const c of fx.stocks) {
    it(`stock ${c.sym}: every line of D1 / W1 / MN / 3M`, () => {
      const d = bars(c.daily), px = d[d.length - 1].c;
      const rows: Record<string, ZBar[]> = { D1: d, W1: closedHtf(d, 'W1'), MN: closedHtf(d, 'MN'), '3M': closedHtf(d, '3M') };
      for (const [tf, py] of Object.entries(c.tls as Record<string, PyTl>)) {
        const S = new Series(rows[tf], px, tf);
        same(rowTrendlines(S), S, py);
      }
    });
  }
  it('fixtures cover up and down lines, removed and in force, crossed ones', () => {
    const all = [...fx.fx, ...fx.stocks].flatMap((c: { tls: Record<string, PyTl> }) => Object.values(c.tls).flatMap(t => t.lines));
    expect(all.length).toBeGreaterThan(50);
    expect(all.some(t => t.dir > 0) && all.some(t => t.dir < 0)).toBe(true);
    expect(all.some(t => t.removed) && all.some(t => !t.removed)).toBe(true);
    expect(all.some(t => t.cross_bar >= 0)).toBe(true);
  });
});

describe('trendline pick for the charts', () => {
  it('never a removed line, the in-force lines first, at most the max', () => {
    const c = fx.fx[0];
    const S = new Series(bars(c.bars.H4).slice(-1500), c.price, 'H4');
    const st = rowTrendlines(S);
    const got = pickLines(S, st, 2);
    expect(got.length).toBeLessThanOrEqual(2);
    expect(got.every(p => !p.line.removed)).toBe(true);
    for (const t of [st.up, st.dn]) if (t && t.crossBar < 0) expect(got.some(p => p.line === t)).toBe(true);
    expect(Number.isFinite(tlAt(got[0].line, 0.5))).toBe(true);
    expect(pickLines(S, st, 2, () => false)).toEqual([]);
  });
});
