// Arrival QA over the chart harness (scripts/chart-ctx.ts): for each symbol / view / mode, the arrival line (if any)
// and the break-checks.ts issues of the rendered SVG.
//   npx tsx scripts/arrival-qa.ts [SYM,SYM] [now ISO] [--all]   (--all: print every chart, not only arrivals / issues)
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chartData } from '../supabase/functions/telegram-bot/logic.ts';
import { renderSvg } from '../supabase/functions/telegram-bot/chart.ts';
import { harnessCtx, VIEWS } from './chart-ctx.ts';
import { chartIssues } from './break-checks.ts';
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
const syms = (args[0] ?? 'BABA,EURUSD,XAUUSD,GBPJPY,BTCUSD,AAPL').split(',');
let bad = 0, nA = 0, n = 0;
for (const mode of ['pub', 'live'] as const) {
  const { ctx } = harnessCtx(ROOT, new Date(args[1] ?? '2026-10-29T18:00:00Z'), mode);
  for (const s of syms) for (const v of [...VIEWS.fx, ...VIEWS.stock].filter((x, i, a) => a.indexOf(x) === i)) {
    const cd = await chartData(s, v, ctx);
    if (!cd) continue;
    n++;
    const iss = chartIssues(cd.model, renderSvg(cd.model));
    bad += iss.length;
    if (cd.model.arrival) nA++;
    if (cd.model.arrival || iss.length || process.argv.includes('--all')) console.log(mode, s, v, '|', cd.model.arrival ?? '-', iss.length ? `\n   ISSUES: ${iss.join(' ; ')}` : '');
  }
}
console.log(`${n} charts, ${nA} with an arrival line, ${bad} issues`);
