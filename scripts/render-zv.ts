// ZoneVision 2.16 render harness: draws the structure model (supabase/functions/telegram-bot/zvModel.ts = the MT5
// RFX_MODEL) on qa/bars windows to PNG in an MT5-like light look, for visual QA of what the indicator will draw:
//   candles (white body bull / black body bear), live trend lines (black, width 2 = the realignment target's line), trend
//   lines broken within 20 bars (grey dotted, ending at the breaking candle), the live momentum line (red dashed) and the
//   one broken within 5 bars, the higher-TF live lines (gold dotted) and the target line (purple dashed), the REALIGN
//   target (purple box), zones that have a reason (demand green / supply red, label = pattern + BOS / CHoCH / xN removed +
//   touches), real pivots (dots), the STRUCTURE line (bottom-left) and the DIRECTION message (top).
//
//   QA_BARS_ROOT=<checkout of the data branch's qa/bars> npx tsx scripts/render-zv.ts [--out DIR] [--charts XAUUSD:MN,W1,D1,H4,H1;AUDUSD:MN,W1,D1,H4]
//        [--bars 140] [--to 2026-10-29] [--q1 spec|retrace|major] [--q2 a|b|c] [--json]
// Bars: closed bars per TF up to --to (default: the latest closed bar), all history (the model needs it); the picture
// shows the last --bars bars of the chart TF. Needs python3 + matplotlib (scripts/render_zv.py does the drawing; --json
// keeps the intermediate <out>/<sym>_<tf>.json). Without QA_BARS_ROOT the bars come from git show origin/data:qa/bars.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadQaBars } from './qa-bars.ts';
import { zmAt, zmDrawLines, zmModel, zmReasonTag, zmStale, zmAtr, type ZmLine, type ZmQ1, type ZmQ2, type ZmTf } from '../supabase/functions/telegram-bot/zvModel.ts';
import type { Series } from '../supabase/functions/telegram-bot/zonecore.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = resolve(opt('out', '/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/zv216'));
const CHARTS = opt('charts', 'XAUUSD:MN,W1,D1,H4,H1;AUDUSD:MN,W1,D1,H4').split(';').map(x => { const [s, t] = x.split(':'); return { sym: s, tfs: t.split(',') }; });
const NB = Number(opt('bars', '140')), TO = opt('to', ''), Q1 = opt('q1', 'spec') as ZmQ1, Q2 = opt('q2', 'a') as ZmQ2;
mkdirSync(OUT, { recursive: true });

const TFS = ['MN', 'W1', 'D1', 'H4', 'H1'];
for (const { sym, tfs } of CHARTS) {
  const bars: Record<string, { d: string; o: number; h: number; l: number; c: number }[]> = {};
  for (const tf of TFS) bars[tf] = loadQaBars(sym, tf, { closedOnly: true, ...(TO ? { to: TO } : {}) }).bars;
  for (const chart of tfs) {
    const price = bars[chart][bars[chart].length - 1].c;
    const m = zmModel({ sym, chart, bars, price, opts: { q1: Q1, q2: Q2 } });
    const t = m.tfs.find(x => x.tf === chart)!;
    const S = (t as ZmTf & { S: Series }).S;
    const n = S.n - 1, from = Math.max(1, n - NB + 1);             // shifts shown: from .. 1
    const time = (tf: ZmTf, s: number) => (tf as ZmTf & { S: Series }).S.T[s];
    const lineOut = (tf: ZmTf, l: ZmLine, role: string) => {
      const TS = (tf as ZmTf & { S: Series }).S;
      // the line's value at each chart bar it spans (by time: the HTF bar holding the chart bar's time)
      const pts: [string, number][] = [];
      const t0 = TS.T[l.a], tEnd = l.brokenAt >= 0 ? TS.T[l.brokenAt] : null;
      for (let s = n; s >= 1; s--) {
        const ct = S.T[s];
        if (ct < t0 || (tEnd && ct > tEnd)) continue;
        let hs = 1;
        while (hs < TS.n - 1 && TS.T[hs] > ct) hs++;
        // fraction of the TF bar elapsed at the chart bar's time (an HTF line is straight in HTF bars, not in chart bars)
        const t1 = Date.parse(`${TS.T[hs]}Z`), t2 = hs > 1 ? Date.parse(`${TS.T[hs - 1]}Z`) : t1 + (t1 - Date.parse(`${TS.T[hs + 1]}Z`));
        const fr = t2 > t1 ? Math.min(1, Math.max(0, (Date.parse(`${ct}Z`) - t1) / (t2 - t1))) : 0;
        pts.push([ct, zmAt(l, hs - fr)]);
      }
      if (!tEnd) for (let k = 1; k <= 3; k++) pts.push([`+${k}`, zmAt(l, -k * (tf.tf === chart ? 1 : 0))]);
      return { tf: tf.tf, role, dir: l.dir, kind: l.kind, a: TS.T[l.a], pa: l.pa, b: TS.T[l.b], pb: l.pb, broken: tEnd, touches: l.touches, pts };
    };
    const lines = zmDrawLines(t, m).filter(d => d.role !== 'htf').map(d => lineOut(t, d.line, d.role));
    for (const h of m.tfs) {                                           // the higher TFs' live lines (gold dotted)
      if (h.tf === '3M' || ['3M', 'MN', 'W1', 'D1', 'H4', 'H1'].indexOf(h.tf) >= ['3M', 'MN', 'W1', 'D1', 'H4', 'H1'].indexOf(chart)) continue;
      const atr = zmAtr((h as ZmTf & { S: Series }).S);
      for (const d of [1, -1]) {
        const tg = m.target?.line && m.target.lineTf === h.tf && m.target.line.dir === d ? m.target.line : null;
        const live = h.lines.filter(l => l.kind === 'trend' && l.dir === d && l.brokenAt < 0 && (l === tg || !zmStale((h as ZmTf & { S: Series }).S, l, atr))).sort((a, b) => a.born - b.born)[0];
        if (live) lines.push(lineOut(h, live, live === tg ? 'target' : 'htf'));
        if (tg && tg !== live) lines.push(lineOut(h, tg, 'target'));
      }
    }
    const zones = t.zones.filter(z => z.reasons.length && !z.removed && !z.range && z.legBar <= n - 1)
      .sort((a, b) => Math.abs(price - a.prox) - Math.abs(price - b.prox)).slice(0, 6)
      .map(z => ({ dir: z.dir, prox: z.prox, dist: z.dist, t0: time(t, z.base1), label: `${z.pattern} ${zmReasonTag(z)} T${z.touches}`.replace(/\s+/g, ' ') }));
    const tg = m.target ? { lo: Math.min(m.target.zone.prox, m.target.zone.dist), hi: Math.max(m.target.zone.prox, m.target.zone.dist), tf: m.target.tf,
      t0: time(m.tfs.find(x => x.tf === m.target!.tf)!, m.target.zone.base1), label: `REALIGN ${m.target.tf} ${Math.min(m.target.zone.prox, m.target.zone.dist).toFixed(t.digits)}-${Math.max(m.target.zone.prox, m.target.zone.dist).toFixed(t.digits)}${m.target.line ? ` (${m.target.lineTf} ${m.target.line.dir > 0 ? 'up' : 'down'} line ${m.target.value.toFixed(t.digits)})` : ''}` } : null;
    const pivots = t.pivots.filter(p => p.conf >= 0 && p.bar >= 1 && p.bar <= n - from + 1 + 0 && p.bar <= n).map(p => ({ t: time(t, p.bar), p: p.p, k: p.t }));
    const candles = []; for (let s = n - from + 1; s >= 1; s--) candles.push([S.T[s], S.O[s], S.H[s], S.L[s], S.C[s]]);
    const out = { sym, tf: chart, digits: t.digits, candles, lines, zones, target: tg, pivots, structure: m.structure, direction: m.direction };
    const file = join(OUT, `${sym}_${chart}.json`);
    writeFileSync(file, JSON.stringify(out));
    const r = spawnSync('python3', [join(ROOT, 'scripts/render_zv.py'), file, join(OUT, `${sym}_${chart}.png`)], { encoding: 'utf8' });
    if (r.status !== 0) { console.error(r.stderr); process.exit(1); }
    console.log(join(OUT, `${sym}_${chart}.png`), '|', m.structure);
    if (!args.includes('--json')) spawnSync('rm', ['-f', file]);
  }
}
