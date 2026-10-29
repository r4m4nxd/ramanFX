// Adversarial chart renders (scripts/break-ctx.ts fixtures): every view of every fixture, published + fixture-live, to
// PNG, with the break-checks.ts issues printed per chart. Exit 1 on a crash.
//   npx tsx scripts/render-break.ts [--out DIR] [--tag r1] [--sym SHIBUSD,BRK.B] [--views Q,D1] [--now ISO] [--png none|bad|all]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { chartData } from '../supabase/functions/telegram-bot/logic.ts';
import { renderSvg } from '../supabase/functions/telegram-bot/chart.ts';
import { ALL_FIX, breakCtx, VIEWS_ALL } from './break-ctx.ts';
import { chartIssues } from './break-checks.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = ['Inter-400Regular-subset.ttf', 'Inter-600SemiBold-subset.ttf'].map(f => join(ROOT, 'tools/telegram_bot/fonts', f));
const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = resolve(opt('out', '/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/break/png'));
const TAG = opt('tag', 'r0').replace(/[^A-Za-z0-9-]/g, '');
const NOW = new Date(opt('now', '2026-10-29T15:00:00Z'));
const PNG = opt('png', 'all');
const SYMS = opt('sym', '').split(',').filter(Boolean);
mkdirSync(OUT, { recursive: true });
const png = (svg: string) => new Resvg(svg, { font: { fontFiles: FONTS, defaultFontFamily: 'Inter', loadSystemFonts: false } }).render().asPng();

let crashes = 0, n = 0, slow = 0;
const tally = new Map<string, number>();
for (const mode of ['pub', 'live'] as const) {
  const ctx = breakCtx(NOW, mode === 'live' ? 'ok' : 'none');
  for (const [sym, market] of ALL_FIX) {
    if (SYMS.length && !SYMS.includes(sym)) continue;
    const views = opt('views', '') ? opt('views', '').split(',') : [...VIEWS_ALL[market]];
    for (const view of views) {
      const t0 = Date.now();
      try {
        const cd = await chartData(sym, view, ctx);
        if (!cd) { console.log(`  -   ${sym} ${view} ${mode}: no chart`); continue; }
        const svg = renderSvg(cd.model);
        const bytes = PNG === 'none' ? null : png(svg);
        const ms = Date.now() - t0;
        n++;
        const issues = chartIssues(cd.model, svg);
        if (ms > 1500) { issues.push(`slow: ${ms} ms`); slow++; }
        for (const i of issues) { const k = i.replace(/".*?"|\d+(\.\d+)?/g, '#').slice(0, 70); tally.set(k, (tally.get(k) ?? 0) + 1); }
        const file = `${TAG}_${sym}_${view}_${mode}.png`;
        if (bytes && (PNG === 'all' || issues.length)) writeFileSync(join(OUT, file), bytes);
        console.log(`${String(ms).padStart(5)}ms ${sym} ${view} ${mode}${issues.length ? `\n      ${issues.join('\n      ')}` : ' ok'}`);
      } catch (e) {
        crashes++;
        console.log(`!!! CRASH ${sym} ${view} ${mode}: ${(e as Error)?.stack ?? e}`);
      }
    }
  }
}
console.log(`\n${n} charts, ${crashes} crashes, ${slow} slow -> ${OUT}`);
for (const [k, v] of [...tally.entries()].sort((a, b) => b[1] - a[1])) console.log(`${String(v).padStart(4)}  ${k}`);
if (crashes) process.exit(1);
