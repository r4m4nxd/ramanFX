// ZoneVision render harness: draws the structure model (supabase/functions/telegram-bot/zvModel.ts = the MT5 RFX_MODEL)
// on qa/bars windows to PNG in an MT5-like light look, for visual QA of what the indicator will draw:
//   candles (white body bull / black body bear), live trend lines (black; a line nested inside the older live one is drawn
//   too), trend lines broken within 20 bars (grey dotted, ending at the breaking candle), the live momentum lines of the last
//   two legs (red dashed) and the most recently broken one (red dotted), the higher-TF live lines (gold dotted) and the
//   target line (purple dashed), the REALIGN target (purple box), zones that have a reason (demand green / supply red,
//   label = pattern + BOS / CHoCH / xN removed + touches; reversal zones at the real pivots included), real pivots (dots),
//   the STRUCTURE line (bottom-left) and the DIRECTION message (above the chart, wrapped: it never covers price).
// Every line is drawn as MT5 draws it: ONE straight OBJ_TREND between two times on the chart's bar axis, the end at the
// breaking candle or at the last bar + 3 with the line's value there (an HTF line: its HTF value at that time, ZmValueAtTime).
//
//   QA_BARS_ROOT=<checkout of the data branch's qa/bars> npx tsx scripts/render-zv.ts [--out DIR] [--charts XAUUSD:MN,W1,D1,H4,H1;AUDUSD:MN,W1,D1,H4]
//        [--bars 140] [--to 2026-10-29] [--q1 spec|retrace|major] [--q2 a|b|c] [--json]
//        [--owner]            the owner's marked charts (src/core/training/fixtures/marks.json): each chart's own window
//                             (--wide K: K x the window), --overlay adds the owner's marks in blue on top of the model
//        [--bars-file F]      extra bars ({ bars: { SYM: { TF: rows } } }, e.g. the SpotCrude holdout) + --marks-file M
// Bars: closed bars per TF up to --to (default: the latest closed bar), all history (the model needs it); the picture
// shows the last --bars bars of the chart TF. Needs python3 + matplotlib (scripts/render_zv.py does the drawing; --json
// keeps the intermediate <out>/<sym>_<tf>.json). Without QA_BARS_ROOT the bars come from git show origin/data:qa/bars.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadQaBars } from './qa-bars.ts';
import { readFileSync } from 'node:fs';
import { zmAt, zmDrawLines, zmMainLine, zmModel, zmReasonTag, zmStale, zmAtr, type ZmLine, type ZmQ1, type ZmQ2, type ZmTf } from '../supabase/functions/telegram-bot/zvModel.ts';
import type { Series } from '../supabase/functions/telegram-bot/zonecore.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = resolve(opt('out', '/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/zv216'));
const Q1 = opt('q1', 'spec') as ZmQ1, Q2 = opt('q2', 'a') as ZmQ2, OWNER = args.includes('--owner'), OVERLAY = args.includes('--overlay');
const WIDE = Number(opt('wide', '1')), SUFFIX = opt('suffix', '');
type Row = [string, number, number, number, number];
interface OwnerChart { symbol: string; tf: string; bars: Row[]; marks: { pivots: { i: number; kind: string; p: number }[]; lines: { a: { i: number; p: number }; b: { i: number; p: number }; brk: number | null; kind?: string; note?: string }[]; zones: { side: string; s: number; e: number; prox: number; dist: number }[] } }
const EXTRA = opt('bars-file', '') ? JSON.parse(readFileSync(opt('bars-file', ''), 'utf8')) as { bars: Record<string, Record<string, Row[]>> } : null;
const MARKS = JSON.parse(readFileSync(opt('marks-file', join(ROOT, 'src/core/training/fixtures/marks.json')), 'utf8')) as { charts: OwnerChart[] };
const jobs: { sym: string; chart: string; to: string; nb: number; owner: OwnerChart | null }[] = [];
if (OWNER) {
  const only = opt('charts', '');
  for (const c of MARKS.charts) if (!only || only.split(';').some(x => x.startsWith(`${c.symbol}:`) && x.split(':')[1].split(',').includes(c.tf)))
    jobs.push({ sym: c.symbol, chart: c.tf, to: c.bars[c.bars.length - 1][0], nb: Math.round(c.bars.length * WIDE), owner: c });
} else {
  const CHARTS = opt('charts', 'XAUUSD:MN,W1,D1,H4,H1;AUDUSD:MN,W1,D1,H4').split(';').map(x => { const [s, t] = x.split(':'); return { sym: s, tfs: t.split(',') }; });
  for (const { sym, tfs } of CHARTS) for (const chart of tfs) jobs.push({ sym, chart, to: opt('to', ''), nb: Number(opt('bars', '140')), owner: null });
}
mkdirSync(OUT, { recursive: true });

const TFS = ['MN', 'W1', 'D1', 'H4', 'H1'];
const PERIOD: Record<string, number> = { MN: 2592000, W1: 604800, D1: 86400, H4: 14400, H1: 3600, '3M': 7776000 };   // MQL PeriodSeconds
const ms = (t: string) => Date.parse(`${t}Z`);
for (const { sym, chart, to: TO, nb: NB, owner } of jobs) {
  const bars: Record<string, { d: string; o: number; h: number; l: number; c: number }[]> = {};
  for (const tf of TFS) {
    const ex = EXTRA?.bars[sym]?.[tf];
    if (ex) { bars[tf] = ex.filter(r => !TO || r[0].slice(0, TO.length) <= TO).map(([d, o, h, l, c]) => ({ d, o, h, l, c })); continue; }
    try { bars[tf] = loadQaBars(sym, tf, { closedOnly: true, ...(TO ? { to: TO } : {}) }).bars; } catch { /* a TF the set does not have */ }
  }
  {
    const price = bars[chart][bars[chart].length - 1].c;
    const m = zmModel({ sym, chart, bars, price, opts: { q1: Q1, q2: Q2 } });
    const t = m.tfs.find(x => x.tf === chart)!;
    const S = (t as ZmTf & { S: Series }).S;
    const n = S.n - 1, from = Math.max(1, n - NB + 1);             // shifts shown: from .. 1
    const time = (tf: ZmTf, s: number) => (tf as ZmTf & { S: Series }).S.T[s];
    // MT5 ZmDrawLine: OBJ_TREND from (time of anchor 1, pa) to (the breaking candle, its value) or (last bar + 3, the line's
    // value at that time: the TF bar holding it, the forming bar by the elapsed share of its period), straight on the bar axis
    const lineOut = (tf: ZmTf, l: ZmLine, role: string) => {
      const TS = (tf as ZmTf & { S: Series }).S;
      const t0 = TS.T[l.a], brk = l.brokenAt >= 0 ? TS.T[l.brokenAt] : null;
      let pts: [string, number][];
      if (brk) pts = [[t0, l.pa], [brk, zmAt(l, l.brokenAt)]];
      else {
        const when = ms(S.T[1]) + 3 * PERIOD[chart] * 1000, open0 = ms(TS.T[1]) + PERIOD[tf.tf] * 1000;
        let v: number;
        if (tf.tf === chart) v = zmAt(l, -2);                        // x = the last closed bar + 3 = shift -2
        else if (when < open0) { let hs = 1; while (hs < TS.n - 1 && ms(TS.T[hs]) > when) hs++; v = zmAt(l, hs); }
        else v = zmAt(l, -(when - open0) / (PERIOD[tf.tf] * 1000));
        pts = [[t0, l.pa], ['+3', v]];
      }
      // anchor 1 before the window: the segment starts at the first visible bar with the line's value there (MT5 draws the
      // same straight object, its start is just off-screen)
      const first = S.T[n - from + 1];
      if (t0 < first) {
        let hs = 1;
        while (hs < TS.n - 1 && ms(TS.T[hs]) > ms(first)) hs++;
        const fr = tf.tf === chart || hs <= 1 ? 0 : Math.min(1, Math.max(0, (ms(first) - ms(TS.T[hs])) / (ms(TS.T[hs - 1]) - ms(TS.T[hs]))));
        pts[0] = [first, zmAt(l, hs - fr)];
        if (brk && brk < first) pts = [];
      }
      return { tf: tf.tf, role, dir: l.dir, kind: l.kind, a: TS.T[l.a], pa: l.pa, b: TS.T[l.b], pb: l.pb, broken: brk, touches: l.touches, pts };
    };
    const lines = zmDrawLines(t, m).filter(d => d.role !== 'htf').map(d => lineOut(t, d.line, d.role));
    for (const h of m.tfs) {                                           // the higher TFs' live lines (gold dotted)
      if (h.tf === '3M' || ['3M', 'MN', 'W1', 'D1', 'H4', 'H1'].indexOf(h.tf) >= ['3M', 'MN', 'W1', 'D1', 'H4', 'H1'].indexOf(chart)) continue;
      const atr = zmAtr((h as ZmTf & { S: Series }).S);
      for (const d of [1, -1]) {
        const tg = m.target?.line && m.target.lineTf === h.tf && m.target.line.dir === d ? m.target.line : null;
        const ml = zmMainLine(h.lines, d), live = ml && (ml === tg || !zmStale((h as ZmTf & { S: Series }).S, ml, atr)) ? ml : null;
        if (live) lines.push(lineOut(h, live, live === tg ? 'target' : 'htf'));
        if (tg && tg !== live) lines.push(lineOut(h, tg, 'target'));
      }
    }
    const zones = t.zones.filter(z => z.reasons.length && !z.removed && !z.range && z.legBar <= n - 1 && z.base1 <= n - from + 1)
      .sort((a, b) => Math.abs(price - a.prox) - Math.abs(price - b.prox)).slice(0, 6)
      .map(z => ({ dir: z.dir, prox: z.prox, dist: z.dist, t0: time(t, z.base1), label: `${z.pattern} ${zmReasonTag(z)} T${z.touches}`.replace(/\s+/g, ' ') }));
    const tg = m.target ? { lo: Math.min(m.target.zone.prox, m.target.zone.dist), hi: Math.max(m.target.zone.prox, m.target.zone.dist), tf: m.target.tf,
      t0: time(m.tfs.find(x => x.tf === m.target!.tf)!, m.target.zone.base1), label: `REALIGN ${m.target.tf} ${Math.min(m.target.zone.prox, m.target.zone.dist).toFixed(t.digits)}-${Math.max(m.target.zone.prox, m.target.zone.dist).toFixed(t.digits)}${m.target.line ? ` (${m.target.lineTf} ${m.target.line.dir > 0 ? 'up' : 'down'} line ${m.target.value.toFixed(t.digits)})` : ''}` } : null;
    const pivots = t.pivots.filter(p => p.conf >= 0 && p.bar >= 1 && p.bar <= n - from + 1 + 0 && p.bar <= n).map(p => ({ t: time(t, p.bar), p: p.p, k: p.t }));
    const candles = []; for (let s = n - from + 1; s >= 1; s--) candles.push([S.T[s], S.O[s], S.H[s], S.L[s], S.C[s]]);
    // the owner's marks (his window's bar index -> time), drawn in blue on top (--overlay)
    let own: unknown = null;
    if (owner && OVERLAY) {
      const ob = owner.bars, T = (i: number) => ob[Math.max(0, Math.min(ob.length - 1, i))][0];
      own = {
        pivots: owner.marks.pivots.map(p => ({ t: T(p.i), p: p.p, k: p.kind === 'peak' ? 1 : -1 })),
        lines: owner.marks.lines.map(l => ({ a: T(l.a.i), pa: l.a.p, b: T(l.b.i), pb: l.b.p, ia: l.a.i, ib: l.b.i, brk: l.brk == null ? null : T(l.brk), ibrk: l.brk,
          momentum: l.kind === 'momentum' || (!l.kind && /momentum/i.test(l.note ?? '')) })),
        zones: owner.marks.zones.map(z => ({ dir: z.side === 'demand' ? 1 : -1, t0: T(z.s), prox: z.prox, dist: z.dist })),
      };
    }
    const title = `${sym} ${chart}  -  ZoneVision 2.18 model${owner ? ` (owner window ${owner.bars[0][0].slice(0, 10)} .. ${owner.bars[owner.bars.length - 1][0].slice(0, 10)}${WIDE !== 1 ? `, x${WIDE}` : ''})` : ''}${own ? '  |  owner marks in blue' : ''}`;
    const out = { sym, tf: chart, digits: t.digits, candles, lines, zones, target: tg, pivots, structure: m.structure, direction: m.direction, owner: own, title };
    const base = `${sym}_${chart}${SUFFIX}`;
    const file = join(OUT, `${base}.json`);
    writeFileSync(file, JSON.stringify(out));
    const r = spawnSync('python3', [join(ROOT, 'scripts/render_zv.py'), file, join(OUT, `${base}.png`)], { encoding: 'utf8' });
    if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
    console.log(join(OUT, `${base}.png`), '|', m.structure);
    if (!args.includes('--json')) spawnSync('rm', ['-f', file]);
  }
}
