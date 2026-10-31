// ZoneVision owner-marks scorer, two readings of every marked chart (src/core/training/fixtures/marks.json):
//   window = the Train page: the model on the chart's own bars (52-80 bars, engine.ts / score.ts unchanged),
//   full   = MT5: the model on the long history up to the chart's last bar (src/core/structure/fixtures/qa_bars_2026-10-30.json),
//            its pivots / lines / zones mapped onto the window (an element counts when its anchors / base lie inside it).
// Same matching rules (score.ts) in both. Trend lines also report "rows": owner trend lines matched by anchors AND the
// break bar (+-1) or both live.
//   npx tsx scripts/zv-score.ts [--mode window|full|both] [--v] [--charts AUDUSD:D1,...] [--params '{"rc":0.4}'] [--json]
import { readFileSync } from 'node:fs';
import { engineMarks } from '../src/core/training/engine.ts';
import { scoreChart, summarize, type ChartScore } from '../src/core/training/score.ts';
import { lineKind, parseMarks, toTBars, type Marks, type TrainChart, type TBar } from '../src/core/training/types.ts';
import { ZM, zmTf, type ZmOpts } from '../supabase/functions/telegram-bot/zvModel.ts';

type Row = [string, number, number, number, number];
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const MODE = opt('mode', 'both'), V = args.includes('--v'), ONLY = opt('charts', '');
const PARAMS = JSON.parse(opt('params', '{}')) as ZmOpts['params'];
Object.assign(ZM, PARAMS);   // both readings (engine.ts reads ZM)
const FIX = JSON.parse(readFileSync('src/core/structure/fixtures/qa_bars_2026-10-30.json', 'utf8')) as { bars: Record<string, Record<string, Row[]>> };
const file = JSON.parse(readFileSync(opt('marks', 'src/core/training/fixtures/marks.json'), 'utf8')) as { charts: TrainChart[] };
const extraBars = opt('bars', '');
const EXTRA = extraBars ? JSON.parse(readFileSync(extraBars, 'utf8')) as { bars: Record<string, Record<string, Row[]>> } : null;

/** The model's marks on the full history, mapped onto the window bars. */
export function fullMarks(win: TBar[], hist: Row[], tf: string, o: ZmOpts = {}): Marks {
  const last = win[win.length - 1].t, first = win[0].t;
  const rows = hist.filter(r => r[0] <= last);
  const nF = rows.length, w0 = rows.findIndex(r => r[0] === first);
  if (w0 < 0) throw new Error(`no ${first} in the history`);
  const t = zmTf(rows.map(([d, oo, h, l, c]) => ({ d, o: oo, h, l, c })), tf, null, o);
  const wi = (s: number) => nF - s - w0, inW = (i: number) => i >= 0 && i < win.length;
  const pivots = t.pivots.filter(p => p.conf >= 0 && inW(wi(p.bar))).map(p => ({ i: wi(p.bar), kind: p.t > 0 ? 'peak' as const : 'valley' as const, p: p.p }));
  const lines = t.lines.filter(l => inW(wi(l.a)) && inW(wi(l.b))).map(l => ({
    id: `f${l.kind}${l.dir}:${wi(l.a)}:${wi(l.b)}`, a: { i: wi(l.a), p: l.pa }, b: { i: wi(l.b), p: l.pb }, dir: l.dir > 0 ? 1 as const : -1 as const,
    brk: l.brokenAt >= 0 ? wi(l.brokenAt) : null, kind: l.kind === 'momentum' ? 'momentum' as const : 'trend' as const,
  }));
  const zones = t.zones.filter(z => z.reasons.length > 0 && !z.range && inW(wi(z.base1))).map(z => ({
    id: `f${z.dir}:${z.legBar}`, side: z.dir > 0 ? 'demand' as const : 'supply' as const, s: wi(z.base1), e: wi(z.base0), prox: z.prox, dist: z.dist,
    end: z.removed ? wi(z.removedBar) : null,
  }));
  return { v: 1, pivots, lines, zones };
}
/** owner trend-line rows matched by anchors + break (or both live). */
export function lineRows(sc: ChartScore, owner: Marks, eng: Marks) {
  const O = owner.lines.map((l, k) => [l, k] as const).filter(([l]) => lineKind(l) === 'trend');
  let ok = 0;
  for (const [oi, ei] of sc.pairs.lines) {
    const a = owner.lines[oi].brk, b = eng.lines[ei].brk;
    if ((a == null && b == null) || (a != null && b != null && Math.abs(a - b) <= 1)) ok++;
  }
  return { ok, n: O.length };
}
const pct = (v: number | null) => (v == null ? '  -' : `${Math.round(v * 100)}`.padStart(3));
const MAIN = !!process.argv[1] && /zv-score\.ts$/.test(process.argv[1]);
const charts = MAIN ? file.charts.filter(c => !ONLY || ONLY.split(',').includes(`${c.symbol}:${c.tf}`)) : [];
const out: Record<string, unknown> = {};
for (const mode of !MAIN ? [] : MODE === 'both' ? ['window', 'full'] : [MODE]) {
  const rows: { owner: Marks; score: ChartScore }[] = [];
  let lrOk = 0, lrN = 0;
  const per: string[] = [];
  for (const c of charts) {
    const bars = toTBars(c.bars), owner = parseMarks(c.marks);
    const hist = (EXTRA?.bars[c.symbol]?.[c.tf]) ?? FIX.bars[c.symbol]?.[c.tf];
    const eng = mode === 'window' ? engineMarks(bars, c.tf, 'fx') : fullMarks(bars, hist, c.tf);
    const sc = scoreChart(bars, owner, eng);
    rows.push({ owner, score: sc });
    const lr = lineRows(sc, owner, eng); lrOk += lr.ok; lrN += lr.n;
    per.push(`  ${`${c.symbol} ${c.tf}`.padEnd(10)} ov ${pct(sc.overall)} | piv ${pct(sc.pivots.f1)} (${sc.pivots.matched}/${sc.pivots.owner}o/${sc.pivots.engine}e) | lines ${pct(sc.lines.f1)} (${sc.lines.matched}/${sc.lines.owner}o/${sc.lines.engine}e, rows ${lr.ok}/${lr.n}) | mom ${pct(sc.momentum.f1)} (${sc.momentum.matched}/${sc.momentum.owner}o/${sc.momentum.engine}e) | zones ${pct(sc.zones.f1)} (${sc.zones.matched}/${sc.zones.owner}o/${sc.zones.engine}e)`);
    if (V) for (const m of sc.misses) per.push(`      ${m.kind.padEnd(5)} ${m.who.padEnd(6)} ${m.text}`);
  }
  const s = summarize(rows);
  console.log(`== ${mode}: overall ${pct(s.overall)} | pivots ${pct(s.pivots.f1)} (R ${pct(s.pivots.recall)} P ${pct(s.pivots.precision)}) | lines ${pct(s.lines.f1)} (R ${pct(s.lines.recall)} P ${pct(s.lines.precision)}; rows ${lrOk}/${lrN}) | momentum ${pct(s.momentum.f1)} (R ${pct(s.momentum.recall)} P ${pct(s.momentum.precision)}) | zones ${pct(s.zones.f1)} (R ${s.zones.matched}/${s.zones.owner} P ${s.zones.matched}/${s.zones.engine})`);
  console.log(per.join('\n'));
  out[mode] = { s, lrOk, lrN };
}
if (MAIN && args.includes('--json')) console.log(JSON.stringify(out));
