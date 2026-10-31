// Leave-one-chart-out check of the ZoneVision tunables on the owner's 9 marked charts (full-history reading, scripts/zv-score.ts
// fullMarks): for each held-out chart, every tunable group is re-fitted on the other 8 charts (best micro F1 of the group's
// element type), then the held-out chart is scored with the re-fitted values. Reports the held-out score vs the score with
// the shipped defaults (the spread).   npx tsx scripts/zv-loo.ts
import { readFileSync } from 'node:fs';
import { scoreChart } from '../src/core/training/score.ts';
import { lineKind, parseMarks, toTBars, type TrainChart } from '../src/core/training/types.ts';
import { ZM } from '../supabase/functions/telegram-bot/zvModel.ts';
import { fullMarks } from './zv-score.ts';

type Row = [string, number, number, number, number];
const FIX = JSON.parse(readFileSync('src/core/structure/fixtures/qa_bars_2026-10-30.json', 'utf8')) as { bars: Record<string, Record<string, Row[]>> };
const charts = (JSON.parse(readFileSync('src/core/training/fixtures/marks.json', 'utf8')) as { charts: TrainChart[] }).charts;
const DEF = { ...ZM };
const cart = (o: Record<string, number[]>) => Object.entries(o).reduce<Record<string, number>[]>((acc, [k, vs]) => acc.flatMap(a => vs.map(v => ({ ...a, [k]: v }))), [{}]);
const GROUPS: { name: string; type: 'lines' | 'momentum' | 'zones'; grid: Record<string, number>[] }[] = [
  { name: 'lines', type: 'lines', grid: cart({ fitTol: [0, 0.02, 0.05, 0.1], vetoClose: [0, 0.3, 0.5, 1], nestGap: [0.5, 0.8, 1.2] }) },
  { name: 'momentum', type: 'momentum', grid: cart({ momShift: [0, 0.25, 0.3], momMin: [0.1, 0.15, 0.25], momTol: [0, 0.03, 0.06] }) },
  { name: 'zones', type: 'zones', grid: cart({ pivZones: [0, 1, 2], zoneSwing: [0, 1, 2, 3] }) },
];
// per combo: per chart (owner, engine, matched) of the group's type
const score = (p: Record<string, number>, type: 'lines' | 'momentum' | 'zones') => {
  Object.assign(ZM, DEF, p);
  return charts.map(c => {
    const bars = toTBars(c.bars), owner = parseMarks(c.marks);
    const has = type === 'zones' ? owner.zones.length > 0 : owner.lines.some(l => lineKind(l) === (type === 'lines' ? 'trend' : 'momentum'));
    const sc = scoreChart(bars, owner, fullMarks(bars, FIX.bars[c.symbol][c.tf], c.tf))[type];
    return has ? sc : { owner: 0, engine: 0, matched: 0 };
  });
};
const f1 = (xs: { owner: number; engine: number; matched: number }[]) => { const o = xs.reduce((a, x) => a + x.owner, 0), e = xs.reduce((a, x) => a + x.engine, 0), m = xs.reduce((a, x) => a + x.matched, 0); return o + e ? (2 * m) / (o + e) : NaN; };
const pct = (v: number) => (Number.isNaN(v) ? '  -' : `${Math.round(v * 100)}`.padStart(3));
for (const g of GROUPS) {
  const res = g.grid.map(p => ({ p, s: score(p, g.type) }));
  const def = score(Object.fromEntries(Object.keys(g.grid[0]).map(k => [k, (DEF as Record<string, number>)[k]])), g.type);
  const allBest = res.reduce((a, b) => (f1(b.s) > f1(a.s) ? b : a));
  console.log(`== ${g.name}: shipped ${pct(f1(def))}, best on all 9 ${pct(f1(allBest.s))} ${JSON.stringify(allBest.p)}`);
  const held: { owner: number; engine: number; matched: number }[] = [];
  for (let i = 0; i < charts.length; i++) {
    const best = res.reduce((a, b) => (f1(b.s.filter((_, k) => k !== i)) > f1(a.s.filter((_, k) => k !== i)) ? b : a));
    held.push(best.s[i]);
    const h = best.s[i], d = def[i];
    if (h.owner + d.owner === 0) continue;
    console.log(`  hold out ${`${charts[i].symbol} ${charts[i].tf}`.padEnd(10)} fit-on-8 ${JSON.stringify(best.p).padEnd(48)} held-out ${pct(h.owner + h.engine ? 2 * h.matched / (h.owner + h.engine) : NaN)} vs shipped ${pct(d.owner + d.engine ? 2 * d.matched / (d.owner + d.engine) : NaN)}`);
  }
  console.log(`  leave-one-out micro F1 ${pct(f1(held))} vs shipped ${pct(f1(def))}`);
}
