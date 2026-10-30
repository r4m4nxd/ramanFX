// Renders the hand-built arrival scenarios (scripts/arrival-scenarios.ts) through the bot's chart code, so the rules
// can be seen on clean textbook bars:  npx tsx scripts/arrival-demo.ts [--out DIR]
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { baseIndex, buildPanels, chartArrival, chartVerdict } from '../supabase/functions/telegram-bot/logic.ts';
import { renderSvg, type Bar } from '../supabase/functions/telegram-bot/chart.ts';
import { tfZonesOf, type ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';
import { SCEN } from './arrival-scenarios.ts';
import { chartIssues } from './break-checks.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = ['Inter-400Regular-subset.ttf', 'Inter-600SemiBold-subset.ttf'].map(f => join(ROOT, 'tools/telegram_bot/fonts', f));
const i = process.argv.indexOf('--out');
const OUT = resolve(i > 0 ? process.argv[i + 1] : '/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/arrival_build');
mkdirSync(OUT, { recursive: true });
const cb = (b: ZBar[]): Bar[] => b.map(r => ({ t: r.d, o: r.o, h: r.h, l: r.l, c: r.c }));
for (const name of ['dem2', 'ceiling', 'supply', 'confirm', 'nested']) {
  const s = SCEN[name];
  const bars: Record<string, Bar[]> = { [s.tf]: cb(s.bars) };
  if (s.htfTf && s.htf) bars[s.htfTf] = cb(s.htf);
  if (s.ltfTf && s.ltf) bars[s.ltfTf] = cb(s.ltf);
  const zones = Object.entries(bars).flatMap(([tf, b]) => tfZonesOf(b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c })), tf, 2, s.price)
    .map(z => ({ tf, side: z.side, prox: z.proximal, dist: z.distal, t0: z.base_start, made: z.made })));
  const forming = Object.fromEntries(Object.keys(bars).map(t => [t, false]));
  const htf = { [s.tf]: s.htfTf ?? null, ...(s.ltfTf ? { [s.ltfTf]: s.tf } : {}) };
  const tfs = [s.tf, ...(s.ltfTf ? [s.ltfTf] : [])];
  for (const layout of ['single'] as const) {
    const panels = buildPanels(tfs.slice(0, 1), bars, zones, s.price, 2, null, layout, t => t, { forming, htf, market: s.market, spread: s.spread ?? 0 })
      .map(p => ({ ...p, zones: p.zones.map(z => ({ ...z, k0: baseIndex(z.t0, p.bars), ...(z.t1 ? { k1: baseIndex(z.t1, p.bars) } : {}) })) }));
    const model = { sym: `DEMO ${name}`, title: `DEMO · ${name} (hand-built bars)`, digits: 2, price: s.price, layout, panels,
      verdict: chartVerdict(panels, zones, s.price, 2, s.market, null), arrival: chartArrival(panels, 2, s.market, null) };
    const svg = renderSvg(model as never);
    const iss = chartIssues(model as never, svg);
    const f = join(OUT, `demo_${name}.png`);
    writeFileSync(f, new Resvg(svg, { font: { fontFiles: FONTS, defaultFontFamily: 'Inter', loadSystemFonts: false } }).render().asPng());
    console.log(f, '|', model.arrival, iss.length ? `ISSUES ${iss.join('; ')}` : '');
  }
}
