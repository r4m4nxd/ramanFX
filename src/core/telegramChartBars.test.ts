// Bot charts use the scanners' real higher-TF bars (FX shard bars.MN, stock shard hb.W1 / hb.MN / hb['3M']) and fall
// back to rebuilding them from lower-TF bars when absent. Runs on the published public/ files.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chartData, dropPartialHead, packedBars, withRecent, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { aggregate, monthKey, quarterKey, weekKey } from '../../supabase/functions/telegram-bot/chart';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const ctx: Ctx = { now: new Date('2026-10-29T15:00:00Z'), async load(p: string) { return p === 'events.json' ? { kinds: {} } : read(`public/${p}`); } };
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
function stockShard(want: (v: J) => boolean): { sym: string; d: J } | null {
  for (const r of read('public/scanner/index.json').tickers as J[]) {
    const d = read(`public/scanner/t/${r.k}.json`)?.tickers?.[r.s];
    if (d && d.bars?.t0 && want(d)) return { sym: r.s, d };
  }
  return null;
}
const ohlc = (b: { o: number; h: number; l: number; c: number }) => [b.o, b.h, b.l, b.c];

describe('chart bars', () => {
  it('withRecent keeps the real bars and adds only later derived periods', () => {
    const b = (t: string, c: number) => ({ t, o: c, h: c, l: c, c });
    expect(withRecent([b('2026-08-01', 1), b('2026-09-01', 2)], [b('2026-08-03', 9), b('2026-09-07', 9), b('2026-10-05', 3)], monthKey).map(x => x.c)).toEqual([1, 2, 3]);
    expect(withRecent([], [b('2026-10-05', 3)], monthKey).map(x => x.c)).toEqual([3]);
    expect(packedBars({ t0: '2026-01-05', dt: [0, 7], b: [[1, 2, 0.5, 1.5], [1.5, 3, 1, 2]] }).map(x => x.t)).toEqual(['2026-01-05', '2026-01-12']);
    expect(packedBars(undefined)).toEqual([]);
  });

  it('FX MN panel = the shard\'s real monthly bars (+ the current month from W1)', async () => {
    const fx = read('public/fx/latest.json');
    const row = fx.map.find((r: J) => r.sym === 'EURUSD');
    const d = read(`public/fx/d/${row.k ?? row.cls}.json`).instruments.EURUSD;
    if (!Array.isArray(d.bars?.MN) || !d.bars.MN.length) return;   // older data: rebuilt from W1 (covered by the bot suite)
    const cd = await chartData('EURUSD', 'MN', ctx);
    const bars = cd!.model.panels[0].bars;
    const real = d.bars.MN as unknown[][];
    expect(bars.length).toBeGreaterThanOrEqual(Math.min(real.length, 90));
    const first = bars.findIndex(b => b.t === String(real[0][0]));
    expect(first).toBeGreaterThanOrEqual(0);
    expect(ohlc(bars[first])).toEqual(real[0].slice(1, 5).map(Number));
    expect(bars.length - first).toBeLessThanOrEqual(real.length + 1);
    const ks = bars.map(b => monthKey(b.t));
    expect(new Set(ks).size).toBe(ks.length);                          // one bar per month
  });

  it('stock W1 / MN / 3M panels use hb when published, else rebuild from D1', async () => {
    const withHb = stockShard(d => !!d.hb?.MN?.b?.length);
    if (withHb) {
      for (const [tf, key] of [['W1', weekKey], ['MN', monthKey], ['3M', quarterKey]] as const) {
        const cd = await chartData(withHb.sym, tf, ctx);
        const real = packedBars(withHb.d.hb[tf]);
        const bars = cd!.model.panels[0].bars;
        expect(real.length).toBeGreaterThan(0);
        expect(bars.map(b => b.t)).toEqual(withRecent(real, aggregate(packedBars(withHb.d.bars), key), key).slice(-90).map(b => b.t));
        expect(ohlc(bars[bars.length - 1])).toEqual(ohlc(real[real.length - 1]));   // hb includes the current period
        expect(new Set(bars.map(b => key(b.t))).size).toBe(bars.length);
      }
    }
    const noHb = stockShard(d => !d.hb);
    if (noHb) {
      const cd = await chartData(noHb.sym, 'MN', ctx);
      const daily = packedBars(noHb.d.bars);   // rebuilt from the daily bars, a partial first month dropped
      expect(cd!.model.panels[0].bars.map(b => b.t)).toEqual(dropPartialHead(aggregate(daily, monthKey), daily, monthKey).slice(-90).map(b => b.t));
    }
    expect(withHb || noHb).toBeTruthy();
  });
});
