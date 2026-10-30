// Builds src/core/structure/fixtures/qa_bars_2026-10-30.json: the long-history MT5-labelled BID bars (qa/bars on the data
// branch, scripts/qa-bars.ts) the ZoneVision 2.16 model tests run on, so the acceptance rows of docs/training/SPEC.md and
// the owner's marks are scored on the same history an MT5 chart has (window independence, SPEC X1), without the data branch.
//   npx tsx scripts/zv216-fixture.ts            (QA_BARS_ROOT=<checkout of the data branch's qa/bars> to read a local copy)
import { mkdirSync, writeFileSync } from 'node:fs';
import { loadQaBars } from './qa-bars.ts';

const KEEP: Record<string, { from?: string; last?: number; to: string }> = {
  MN: { to: '2026-09' }, W1: { to: '2026-10-17' }, D1: { from: '2021-01-01', to: '2026-10-29' },
  H4: { last: 1500, to: '2026-10-30T16:00' }, H1: { last: 1500, to: '2026-10-30T22:00' },
};
const out: Record<string, Record<string, [string, number, number, number, number][]>> = {};
for (const sym of ['AUDUSD', 'XAUUSD']) {
  out[sym] = {};
  for (const [tf, k] of Object.entries(KEEP)) {
    const b = loadQaBars(sym, tf, { from: k.from, to: k.to, closedOnly: true }).bars;
    out[sym][tf] = (k.last ? b.slice(-k.last) : b).map(x => [x.d, x.o, x.h, x.l, x.c]);
  }
}
mkdirSync('src/core/structure/fixtures', { recursive: true });
writeFileSync('src/core/structure/fixtures/qa_bars_2026-10-30.json', JSON.stringify({ source: 'origin/data:qa/bars (OANDA BID, MT5 server time; W1 = Saturday labels)', generated: '2026-10-30', bars: out }) + '\n');
console.log(Object.entries(out).map(([s, t]) => `${s}: ${Object.entries(t).map(([tf, b]) => `${tf} ${b.length} ${b[0][0]}..${b[b.length - 1][0]}`).join(', ')}`).join('\n'));
