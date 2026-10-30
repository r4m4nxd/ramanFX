// Shared helpers for the ZoneVision 2.16 acceptance tests (docs/training/SPEC.md sections 4-6) and the report script:
// the long-history fixture (qa/bars, scripts/zv216-fixture.ts), the model on it as of a date, and the SPEC matching
// rules: pivot = same kind, bar +-1; line = engine value at the owner's anchors and break within 0.15 ATR, break +-1;
// zone = same side, base bar +-1, box overlap >= 50% of the owner's box.
import { readFileSync } from 'node:fs';
import { Series } from '../../../supabase/functions/telegram-bot/zonecore';
import { zmAt, zmAtr, zmModel, zmTf, type ZmLine, type ZmModel, type ZmOpts, type ZmTf, type ZmZone } from '../../../supabase/functions/telegram-bot/zvModel';

export type Row = [string, number, number, number, number];
const FIX = JSON.parse(readFileSync('src/core/structure/fixtures/qa_bars_2026-10-30.json', 'utf8')) as { bars: Record<string, Record<string, Row[]>> };
export const qaRows = (sym: string, tf: string, to: string, from?: string): Row[] =>
  FIX.bars[sym][tf].filter(r => r[0].slice(0, to.length) <= to && (!from || r[0] >= from));
const zb = (rows: Row[]) => rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c }));

export interface Chart { sym: string; tf: string; rows: Row[]; S: Series; t: ZmTf; atr: (i: number) => number }
/** One TF read on the fixture history up to `to` (closed bars), price = its last close. */
export function chart(sym: string, tf: string, to: string, o: ZmOpts = {}, from?: string): Chart {
  const rows = qaRows(sym, tf, to, from), S = new Series(zb(rows), null, tf), t = zmTf(zb(rows), tf, null, o);
  return { sym, tf, rows, S, t, atr: zmAtr(S) };
}
/** The whole top-down model of a symbol with every TF pinned to its own date. */
export function model(sym: string, chartTf: string, pins: Record<string, string>, price: number | null = null, o: ZmOpts = {}): ZmModel {
  const bars: Record<string, ReturnType<typeof zb>> = {};
  for (const [tf, to] of Object.entries(pins)) bars[tf] = zb(qaRows(sym, tf, to));
  return zmModel({ sym, chart: chartTf, bars, price, opts: o });
}
/** shift of the bar labelled d (prefix match: '2026-09-03' or '2026-10-28T20'). */
export function shiftOf(c: Chart, d: string): number {
  for (let i = c.rows.length - 1; i >= 0; i--) if (c.rows[i][0].startsWith(d)) return c.rows.length - i;
  throw new Error(`${c.sym} ${c.tf}: no bar ${d}`);
}
export const dateOf = (c: Chart, s: number) => (s >= 1 && s <= c.rows.length ? c.rows[c.rows.length - s][0] : s === 0 ? 'now' : `#${s}`);

export function hasPivot(c: Chart, d: string, kind: 'P' | 'V'): boolean {
  const s = shiftOf(c, d), t = kind === 'P' ? 1 : -1;
  return c.t.pivots.some(p => p.conf >= 0 && p.t === t && Math.abs(p.bar - s) <= 1);
}
export interface LineSpec { dir: 1 | -1; a: string; pa: number; b: string; pb: number; brk: string | null; kind?: 'trend' | 'momentum' | 'any' }
/** The engine line matching an owner line (SPEC 4 rule), or null. */
export function findLine(c: Chart, L: LineSpec): ZmLine | null {
  const a = shiftOf(c, L.a), b = shiftOf(c, L.b), k = L.brk ? shiftOf(c, L.brk) : -1;
  const own = { a, b, pa: L.pa, pb: L.pb };
  const tol = (j: number) => 0.15 * c.atr(j);
  const best = c.t.lines.filter(t => t.dir === L.dir && (L.kind === 'any' || (L.kind ?? 'trend') === (t.kind === 'major' ? 'trend' : t.kind)))
    .filter(t => Math.abs(zmAt(t, a) - L.pa) <= tol(a) && Math.abs(zmAt(t, b) - L.pb) <= tol(b))
    .filter(t => (k < 0 ? t.brokenAt < 0 : t.brokenAt >= 0 && Math.abs(t.brokenAt - k) <= 1 && Math.abs(zmAt(t, k) - zmAt(own, k)) <= tol(k)));
  return best[0] ?? null;
}
export interface ZoneSpec { side: 'demand' | 'supply'; s: string; prox: number; dist: number }
export const overlap = (z: { prox: number; dist: number }, o: ZoneSpec) => {
  const lo = Math.max(Math.min(z.prox, z.dist), Math.min(o.prox, o.dist)), hi = Math.min(Math.max(z.prox, z.dist), Math.max(o.prox, o.dist));
  return Math.max(0, hi - lo) / Math.max(1e-12, Math.abs(o.prox - o.dist));
};
export function findZone(c: Chart, Z: ZoneSpec, needReason = false): ZmZone | null {
  const s = shiftOf(c, Z.s), d = Z.side === 'demand' ? 1 : -1;
  return c.t.zones.find(z => z.dir === d && (!needReason || z.reasons.length > 0) && z.base1 >= s - 1 && z.base0 <= s + 1 && overlap(z, Z) >= 0.5) ?? null;
}
export const segOf = (m: ZmModel, tf: string) => m.structure.split('  |  ').find(x => x.startsWith(`${tf} `)) ?? '';
