// The ZoneVision 2.16 model in the RFX_MODEL (MQL) shape, for the conformance replay (tools/telegram_bot/parity/mql_port.py
// --model): kinds / patterns / reasons as the MQL codes, every number as the TS computes it.
import { zmModel, type ZBarLike, type ZmOpts } from '../../../supabase/functions/telegram-bot/zvModel';
import { toQuarters } from '../../../supabase/functions/telegram-bot/zonecore';

export type Row = [string, number, number, number, number];
const KIND = { trend: 0, momentum: 1, major: 2 } as const;
const WHY: Record<string, number> = { g1: 0, 'g1-shift': 1, c1: 2, chain: 3, rot: 4, mom: 5, major: 6, p1mom: 7 };
const PAT: Record<string, number> = { RBR: 0, DBR: 1, DBD: 2, RBD: 3 };
const RS: Record<string, number> = { break: 1, direction: 2, removal: 4 };
export interface ModelCase { name: string; sym: string; chart: string; price: number; digits: number; bars: Record<string, Row[]>; params?: Record<string, number>; expected: unknown }

export function modelCase(name: string, sym: string, chart: string, bars: Record<string, Row[]>, price: number, digits: number, o: ZmOpts = {}): ModelCase {
  const b: Record<string, Row[]> = { ...bars };
  const zb = (r: Row[]): ZBarLike[] => r.map(([d, oo, h, l, c]) => ({ d, o: oo, h, l, c }));
  if (!b['3M'] && b.MN) b['3M'] = toQuarters(zb(b.MN)).map(x => [x.d, x.o, x.h, x.l, x.c] as Row);
  const m = zmModel({ sym, chart, bars: Object.fromEntries(Object.entries(b).map(([k, v]) => [k, zb(v)])), price, digits, opts: o });
  const expected = {
    tfs: m.tfs.map(t => ({
      tf: t.tf, pivots: t.pivots.map(p => ({ bar: p.bar, p: p.p, t: p.t, conf: p.conf })),
      lines: t.lines.map(l => ({ dir: l.dir, kind: KIND[l.kind], a: l.a, b: l.b, pa: l.pa, pb: l.pb, born: l.born, brokenAt: l.brokenAt, p2: l.p2, touches: l.touches, why: WHY[l.why] })),
      zones: t.zones.map(z => ({ dir: z.dir, prox: z.prox, dist: z.dist, base0: z.base0, base1: z.base1, legBar: z.legBar, pattern: PAT[z.pattern], range: z.range,
        touches: z.touches, removed: z.removed, removedBar: z.removedBar, reasons: z.reasons.reduce((a, r) => a | RS[r], 0), nRemoved: z.removedIds.length })),
      st: { trend: t.st.trend, ext: t.st.ext, extBar: t.st.extBar, sl: t.st.sl, slBar: t.st.slBar, lo: t.st.lo, hi: t.st.hi }, leg: t.leg,
    })),
    structure: m.structure, direction: m.direction, allowed: m.tfs.map(t => m.allowed[t.tf]),
  };
  const params: Record<string, number> = {};
  if (o.q1) params.q1 = { spec: 0, retrace: 1, major: 2 }[o.q1];
  if (o.q2) params.q2 = { a: 0, b: 1, c: 2 }[o.q2];
  return { name, sym, chart, price, digits, bars: b, params, expected };
}
