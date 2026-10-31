// The SpotCrude MN HOLDOUT (src/core/training/fixtures/holdout_spotcrude_mn.json; never used to tune anything): the
// owner's MT5 screenshot as transcribed (approximate prices, line anchors snapped to the bar extreme within +-1 bar),
// scored against the model's full-history reading of the same bars with tolerance:
//   trend lines: same direction, both anchors within +-1 bar and 0.25 ATR, break within +-2 bars (or both live);
//   momentum: the owner gives legs (direction + start): a model momentum line of that direction anchored within +-1 bar
//             of the leg start;   zones: same side, base start within +-2 bars, >= 50% of the owner's box covered.
//   npx tsx scripts/zv-holdout.ts [--v]
import { readFileSync } from 'node:fs';
import { zmAt, zmAtr, zmTf } from '../supabase/functions/telegram-bot/zvModel.ts';
import type { Series } from '../supabase/functions/telegram-bot/zonecore.ts';

type Row = [string, number, number, number, number];
const H = JSON.parse(readFileSync('src/core/training/fixtures/holdout_spotcrude_mn.json', 'utf8')) as {
  bars_all: Row[]; bars: Row[];
  marks: { lines: { id: string; a: { i: number; p: number }; b: { i: number; p: number }; brk: number | null; note: string }[];
    momentum_legs: { dir: number; start: number | null; startT: string; note: string }[];
    zones: { side: string; s: number; e: number; prox: number; dist: number; note: string }[] };
};
const V = process.argv.includes('--v');
const t = zmTf(H.bars_all.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), 'MN');
const S = (t as typeof t & { S: Series }).S, atr = zmAtr(S);
const nF = H.bars_all.length, w0 = H.bars_all.findIndex(r => r[0] === H.bars[0][0]);
const wi = (s: number) => nF - s - w0, sh = (i: number) => nF - (i + w0), T = (i: number) => (H.bars[i] ? H.bars[i][0].slice(0, 7) : `#${i}`);
const pct = (m: number, o: number, e: number) => `recall ${m}/${o}, precision ${m}/${e}, F1 ${o + e ? Math.round((200 * m) / (o + e)) : 0}%`;
// trend lines
const E = t.lines.filter(l => l.kind !== 'momentum' && wi(l.a) >= 0 && wi(l.b) >= 0);
const used = new Set<number>();
let lm = 0, lb = 0;
for (const o of H.marks.lines) {
  const d = o.b.p >= o.a.p ? 1 : -1;
  const k = E.findIndex((e, x) => !used.has(x) && e.dir === d && Math.abs(wi(e.a) - o.a.i) <= 1 && Math.abs(wi(e.b) - o.b.i) <= 1
    && Math.abs(e.pa - o.a.p) <= 0.25 * atr(sh(o.a.i)) && Math.abs(e.pb - o.b.p) <= 0.25 * atr(sh(o.b.i)));
  if (k >= 0) {
    used.add(k); lm++;
    const eb = E[k].brokenAt >= 0 ? wi(E[k].brokenAt) : null;
    const bok = (o.brk == null && eb == null) || (o.brk != null && eb != null && Math.abs(o.brk - eb) <= 2);
    if (bok) lb++;
    if (V) console.log(`  line ${o.id} MATCH (break ${o.brk == null ? 'n/a' : T(o.brk)} vs ${eb == null ? 'live' : T(eb)}${bok ? '' : ' DIFFERS'})  ${o.note}`);
  } else if (V) {
    const near = E.filter(e => e.dir === d && Math.abs(wi(e.a) - o.a.i) <= 3).map(e => `${T(wi(e.a))}->${T(wi(e.b))}${e.brokenAt >= 0 ? ` x${T(wi(e.brokenAt))}` : ' live'}`);
    console.log(`  line ${o.id} miss: ${o.note}${near.length ? ` | model near: ${near.join(', ')}` : ''}`);
  }
}
if (V) E.forEach((e, x) => { if (!used.has(x)) console.log(`  model line not in the owner's: ${e.dir > 0 ? 'up' : 'down'} ${T(wi(e.a))} ${e.pa.toFixed(2)} -> ${T(wi(e.b))} ${e.pb.toFixed(2)}${e.brokenAt >= 0 ? ` broken ${T(wi(e.brokenAt))}` : ' live'} (${e.why})`); });
// momentum legs
const M = t.lines.filter(l => l.kind === 'momentum' && wi(l.b) >= 0);
const mu = new Set<number>();
let mm = 0;
for (const o of H.marks.momentum_legs) {
  const k = M.findIndex((e, x) => !mu.has(x) && e.dir === o.dir && (o.start == null ? wi(e.a) <= 1 : Math.abs(wi(e.a) - o.start) <= 1));
  if (k >= 0) { mu.add(k); mm++; }
  if (V) console.log(`  momentum ${o.note}: ${k >= 0 ? `MATCH ${T(wi(M[k].a))} -> ${T(wi(M[k].b))}` : 'miss'}`);
}
// zones
const Z = t.zones.filter(z => z.reasons.length > 0 && !z.range && wi(z.base1) >= 0);
const zu = new Set<number>();
let zm = 0;
for (const o of H.marks.zones) {
  const d = o.side === 'demand' ? 1 : -1, lo = Math.min(o.prox, o.dist), hi = Math.max(o.prox, o.dist);
  const k = Z.findIndex((z, x) => !zu.has(x) && z.dir === d && Math.abs(wi(z.base1) - o.s) <= 2 && (Math.min(hi, Math.max(z.prox, z.dist)) - Math.max(lo, Math.min(z.prox, z.dist))) / (hi - lo) >= 0.5);
  if (k >= 0) { zu.add(k); zm++; }
  if (V) console.log(`  zone ${o.side} ${o.note}: ${k >= 0 ? `MATCH ${Z[k].pattern} ${Z[k].prox.toFixed(2)}-${Z[k].dist.toFixed(2)} [${Z[k].reasons.join(',')}]` : 'miss'}`);
}
console.log(`SpotCrude MN holdout (${H.bars.length} bars ${H.bars[0][0].slice(0, 7)} .. ${H.bars[H.bars.length - 1][0].slice(0, 7)}, model on ${nF} bars):`);
console.log(`  trend lines ${pct(lm, H.marks.lines.length, E.length)}; break agrees on ${lb}/${lm} matched (rows ${lb}/${H.marks.lines.length})`);
console.log(`  momentum    ${pct(mm, H.marks.momentum_legs.length, M.filter(l => wi(l.a) >= -1).length)}`);
console.log(`  zones       ${pct(zm, H.marks.zones.length, Z.length)}`);
console.log(`  STRUCTURE MN: trend ${t.st.trend > 0 ? 'UP' : t.st.trend < 0 ? 'DOWN' : 'SIDEWAYS'}; live lines: ${t.lines.filter(l => l.kind !== 'momentum' && l.brokenAt < 0 && wi(l.b) >= 0).map(l => `${l.dir > 0 ? 'up' : 'down'} ${T(wi(l.a))}->${T(wi(l.b))} (${zmAt(l, 1).toFixed(2)} now)`).join('; ') || 'none'}`);
