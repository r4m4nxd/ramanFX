// The owner's teaching engine (zvReal.ts: real pivots = the end of a real correction, trend + momentum lines, phase)
// on the owner's own marked charts (src/core/training/fixtures/marks.json, AUDUSD MN / W1 / D1 / H4, 2026-10-30) and the
// gold D1 acceptance chart (owner-approved: live down line Sep 3 -> Sep 18).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { Series } from '../../supabase/functions/telegram-bot/zonecore';
import { zvAt } from '../../supabase/functions/telegram-bot/zvTrend';
import { zrLines, zrPhase, zrPhaseText, zrPivots, zrTopDown, ZR } from '../../supabase/functions/telegram-bot/zvReal';

type Row = [string, number, number, number, number];
const ser = (rows: Row[], tf: string, price: number | null = null) => new Series(rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), price, tf);
const F = JSON.parse(readFileSync('src/core/training/fixtures/marks.json', 'utf8')) as { charts: { tf: string; bars: Row[] }[] };
const chart = (tf: string) => F.charts.find(c => c.tf === tf)!.bars;
const lineDays = (rows: Row[], S: Series) => (t: { a: number; b: number; brokenAt?: number }) =>
  `${rows[S.n - 1 - t.a][0].slice(0, 10)}>${rows[S.n - 1 - t.b][0].slice(0, 10)}${(t.brokenAt ?? -1) >= 0 ? `x${rows[S.n - 1 - t.brokenAt!][0].slice(0, 10)}` : ''}`;

describe('zvReal on the owner\'s AUDUSD marks', () => {
  it('D1: the 13 pivots the owner marked are the real pivots (each within 1 bar)', () => {
    const rows = chart('D1'), S = ser(rows, 'D1'), piv = zrPivots(S, Math.min(ZR.lookback, S.n - 1 - ZR.osw));
    const got = piv.map(p => [S.n - 1 - p.bar, p.t > 0 ? 'p' : 'v'] as const);
    const own = [[1, 'v'], [7, 'p'], [13, 'v'], [26, 'p'], [28, 'v'], [35, 'p'], [38, 'v'], [43, 'p'], [48, 'v'], [51, 'p'], [59, 'v'], [68, 'p'], [69, 'v']] as const;
    expect(got.length).toBe(own.length);
    own.forEach(([i, k], n) => { expect(got[n][1]).toBe(k); expect(Math.abs(got[n][0] - i)).toBeLessThanOrEqual(1); });
  });
  it('D1: up line Jul 29 -> Sep 2 (re-anchored from pivot 1, replaces Jul 29 -> Aug 19), down line Sep 21 -> Oct 14 broken Oct 20', () => {
    const rows = chart('D1'), S = ser(rows, 'D1'), r = zrLines(S), day = lineDays(rows, S);
    const tl = r.hist.filter(t => t.kind === 'trend').map(day);
    expect(tl).toContain('2026-07-29>2026-09-02x2026-09-10');
    expect(tl).toContain('2026-09-21>2026-10-14x2026-10-20');
    expect(tl.some(x => x.startsWith('2026-07-29>2026-08-19'))).toBe(false);
  });
  it('MN: momentum lines from the Apr 2022 top (-> Aug 2022, broken Nov 2022) and the Oct 2022 bottom (-> Nov 2022, broken Apr 2023)', () => {
    const rows = chart('MN'), S = ser(rows, 'MN'), r = zrLines(S), day = lineDays(rows, S);
    const mom = r.hist.filter(t => t.kind === 'momentum').map(day);
    expect(mom).toContain('2022-04-01>2022-08-01x2022-11-01');
    expect(mom).toContain('2022-10-01>2022-11-01x2023-04-01');   // owner's break mark: index 18 = Apr 2023
  });
  it('MN: up trend line Oct 2023 -> Aug 2024 broken Dec 2024 (a flat-ish line between two real valleys)', () => {
    const rows = chart('MN'), S = ser(rows, 'MN'), r = zrLines(S);
    expect(r.hist.filter(t => t.kind === 'trend').map(lineDays(rows, S))).toContain('2023-10-01>2024-08-01x2024-12-01');
  });
  it('every trend line: no candle CLOSES beyond it between its anchor 2 and its break (or now)', () => {
    for (const c of F.charts) {
      const S = ser(c.bars, c.tf), r = zrLines(S);
      for (const t of r.hist.filter(x => x.kind === 'trend')) {
        const end = (t.brokenAt ?? -1) >= 0 ? t.brokenAt! : 0;
        for (let j = t.b - 1; j > end; j--) expect(t.dir > 0 ? S.C[j] >= zvAt(t, j) : S.C[j] <= zvAt(t, j), `${c.tf} ${t.a}->${t.b} at ${j}`).toBe(true);
        if (end > 0) expect(t.dir > 0 ? S.C[end] < zvAt(t, end) : S.C[end] > zvAt(t, end)).toBe(true);
      }
    }
  });
  it('top-down (MN / W1 / D1 / H4 are a nested set): MN impulse up, W1 sideways (owner: "no HH or LL forming")', () => {
    const S = ['MN', 'W1', 'D1', 'H4'].map(tf => ser(chart(tf), tf));
    const td = zrTopDown(S);
    expect(td.phases[0]).toMatchObject({ tf: 'MN', trend: 1, phase: 'impulse' });
    expect(td.phases[1]).toMatchObject({ tf: 'W1', trend: 0, phase: 'range' });
    expect(td.text.startsWith('MN impulse up · W1 range')).toBe(true);
  });
  it('a correction names its target: the live trend line, else the HL / LH that holds the trend', () => {
    expect(zrPhaseText({ tf: 'D1', trend: 1, leg: -1, phase: 'correction', target: 0.6912 }, 4)).toBe('D1 correction (down) -> D1 up trend 0.6912');
    const S = ser(chart('W1').slice(0, 34), 'W1'), p = zrPhase(S);   // W1 to Jun 13 2026: the up structure correcting
    expect(['impulse', 'correction', 'range']).toContain(p.phase);
    if (p.phase === 'correction') expect(p.target).not.toBeNull();
  });
});

describe('zvReal on the gold D1 acceptance chart', () => {
  const X = JSON.parse(readFileSync('tools/telegram_bot/parity/xauusd_d1_2026-10-29.json', 'utf8'));
  const rows: Row[] = X.D1.slice(0, -1), S = ser(rows, 'D1', X.price), r = zrLines(S), day = (sh: number) => rows[rows.length - sh][0].slice(0, 10);
  it('owner: the live down line runs Sep 3 (4510.64) -> Sep 18 (4399.48), unbroken (the Aug 25 top led an impulse: no pivot 1)', () => {
    expect(r.dn).not.toBeNull();
    expect([day(r.dn!.a), r.dn!.pa, day(r.dn!.b), r.dn!.pb]).toEqual(['2026-09-03', 4510.64, '2026-09-18', 4399.48]);
    expect(r.dn!.brokenAt).toBe(-1);
    expect(r.hist.some(t => t.kind === 'trend' && day(t.a) === '2026-08-25')).toBe(false);
  });
});
