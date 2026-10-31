// ZoneVision 2.16 MT5 conformance over the 11 qa/bars symbols: N seeded random windows (end date, length per TF, chart TF),
// each modelled by the canonical TypeScript (zvModel.ts) and replayed by the Python port of the MQL RFX_MODEL block
// (tools/telegram_bot/parity/mql_port.py --model); every pivot / line / zone / state / text must be equal.
//   QA_BARS_ROOT=<checkout of the data branch's qa/bars> npx tsx scripts/zv216-conformance.ts [N=220] [seed=7]
// (without QA_BARS_ROOT the bars are read with git show origin/data:qa/bars/..., see scripts/qa-bars.ts)
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadQaBars, qaBarsIndex } from './qa-bars.ts';
import { modelCase, type ModelCase, type Row } from '../src/core/structure/parity.ts';

const N = Number(process.argv[2] ?? 220), SEED = Number(process.argv[3] ?? 7);
let s = SEED >>> 0 || 1;
const R = () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
const IX = qaBarsIndex().symbols;
const syms = Object.keys(IX).filter(k => ['MN', 'W1', 'D1', 'H4', 'H1'].every(tf => IX[k].tfs[tf]));   // symbols with every chain TF
const cache = new Map<string, Row[]>();
const all = (sym: string, tf: string) => {
  const k = `${sym}/${tf}`;
  if (!cache.has(k)) cache.set(k, loadQaBars(sym, tf, { closedOnly: true }).bars.map(b => [b.d, b.o, b.h, b.l, b.c] as Row));
  return cache.get(k)!;
};
const cases: ModelCase[] = [];
for (let k = 0; k < N; k++) {
  const sym = syms[k % syms.length], bars: Record<string, Row[]> = {};
  for (const tf of ['MN', 'W1', 'D1', 'H4', 'H1']) {
    const a = all(sym, tf), end = a.length - Math.floor(R() * Math.min(400, a.length / 3)), len = 100 + Math.floor(R() * 500);
    bars[tf] = a.slice(Math.max(0, end - len), end);
  }
  const chart = ['MN', 'W1', 'D1', 'H4', 'H1'][Math.floor(R() * 5)];
  const px = bars[chart][bars[chart].length - 1][4];
  cases.push(modelCase(`${k} ${sym} ${chart}`, sym, chart, bars, px, px >= 500 ? 2 : px >= 20 ? 3 : 5));
}
const dir = mkdtempSync(join(tmpdir(), 'rfx-conf-'));
writeFileSync(join(dir, 'cases.json'), JSON.stringify({ cases }));
const r = spawnSync('python3', ['tools/telegram_bot/parity/mql_port.py', join(dir, 'cases.json'), '--model', '--json'], { encoding: 'utf8', maxBuffer: 256 << 20 });
if (r.status !== 0 && !r.stdout) { console.error(r.stderr); process.exit(2); }
const out = JSON.parse(r.stdout) as { bad: number; errors: string[]; cases: number };
const lines = cases.reduce((a, c) => a + (c.expected as { tfs: { lines: unknown[] }[] }).tfs.reduce((b, t) => b + t.lines.length, 0), 0);
console.log(`${out.cases - out.bad}/${out.cases} random models over ${syms.length} symbols match the RFX_MODEL port (${lines} lines compared)`);
if (out.bad) { console.log(out.errors.join('\n')); process.exit(1); }
