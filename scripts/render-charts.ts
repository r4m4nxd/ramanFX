// Chart render / QA harness for the Telegram bot charts: renders real-looking PNGs from the repo's published data
// through the bot's own code (logic.ts chartData -> chart.ts renderSvg -> resvg with the bot's Inter subset fonts).
//
//   npx tsx scripts/render-charts.ts [--out DIR] [--tag before|after] [--sym BABA,EURUSD] [--views Q,D1]
//                                    [--modes pub,live] [--now 2026-10-29T15:00:00Z] [--svg] [--debug-tl]
//
// Modes (scripts/chart-ctx.ts): pub = the published scan (no live source), live = a SIMULATED live source built from the
// published bars (zones recomputed, forming candles, H4 / H1 / M15). A render that uses synthetic bars (FX 15m, stock
// intraday, stock history before the 120 published sessions) is named ..._livesyn.png instead of ..._live.png.
// Output: <out>/<tag>_<sym>_<view>_<mode>.png, <out>/contact_<tag>.png (grid, one row per symbol), <out>/index.html
// (every tag in the folder side by side). Views a symbol does not have (chartData = null) are skipped; any exception
// is printed and the run exits 1.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import { chartData } from '../supabase/functions/telegram-bot/logic.ts';
import { renderSvg } from '../supabase/functions/telegram-bot/chart.ts';
import { ZV_DEBUG } from '../supabase/functions/telegram-bot/zvTrend.ts';
import { harnessCtx, readJson, VIEWS } from './chart-ctx.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const FONTS = ['Inter-400Regular-subset.ttf', 'Inter-600SemiBold-subset.ttf'].map(f => join(ROOT, 'tools/telegram_bot/fonts', f));

const args = process.argv.slice(2);
const opt = (k: string, d: string) => { const i = args.indexOf(`--${k}`); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const OUT = resolve(opt('out', '/tmp/claude-0/-home-user/3ca4625b-e0ba-5998-9044-928583dca530/scratchpad/charts2'));
const TAG = opt('tag', 'before').replace(/[^A-Za-z0-9-]/g, '');
const NOW = new Date(opt('now', new Date().toISOString()));
const MODES = opt('modes', 'pub,live').split(',') as ('pub' | 'live')[];
const SAVE_SVG = args.includes('--svg');
if (args.includes('--debug-tl')) ZV_DEBUG.on = true;   // yellow zigzag of the real pivots + circles on the anchors used

function defaultSyms(): string[] {
  const ix = (readJson(ROOT, 'public/scanner/index.json') as { tickers: { s: string; ix?: string[] }[] }).tickers;
  const have = new Set(ix.map(t => t.s));
  const tsx = ['RY', 'SHOP', 'TD', 'CNQ'].find(s => have.has(s) && ix.find(t => t.s === s)?.ix?.includes('TSX'))
    ?? ix.find(t => t.ix?.includes('TSX'))?.s;
  return [...['BABA', 'INTC', 'AAPL', 'NVDA'].filter(s => have.has(s)), ...(tsx ? [tsx] : []), 'EURUSD', 'GBPJPY', 'XAUUSD', 'US30', 'BTCUSD'];
}
const SYMS = opt('sym', '').split(',').filter(Boolean).map(s => s.toUpperCase());
const syms = SYMS.length ? SYMS : defaultSyms();
const fxSyms = new Set(((readJson(ROOT, 'public/fx/latest.json') as { map: { sym: string }[] }).map).map(r => r.sym));

interface Shot { sym: string; view: string; mode: string; file: string; ms: number }
const shots: Shot[] = [], errors: string[] = [], warnings: string[] = [];
mkdirSync(OUT, { recursive: true });
const png = (svg: string) => new Resvg(svg, { font: { fontFiles: FONTS, defaultFontFamily: 'Inter', loadSystemFonts: false }, fitTo: { mode: 'original' } }).render().asPng();

const t00 = Date.now();
for (const sym of syms) {
  const market = fxSyms.has(sym) ? 'fx' : 'stock';
  const views = opt('views', '') ? opt('views', '').split(',') : [...VIEWS[market]];
  for (const mode of MODES) {
    const { ctx, sim } = harnessCtx(ROOT, NOW, mode);
    for (const view of views) {
      const t0 = Date.now();
      try {
        const cd = await chartData(sym, view, ctx);
        if (!cd) { console.log(`  -      ${sym.padEnd(7)} ${view.padEnd(4)} ${mode.padEnd(7)} n/a (no data for this view)`); continue; }
        if (mode === 'live' && !cd.live) throw new Error('simulated live source not used (chartData fell back to the scan)');
        const syn = sim?.synthetic[cd.sym] ?? new Set<string>();
        const tfs = cd.model.panels.map(p => p.tf);
        const usesSyn = mode === 'live' && (syn.has('D1hist') || tfs.some(t => syn.has(t)));
        const m = mode === 'live' ? (usesSyn ? 'livesyn' : 'live') : 'pub';
        const svg = renderSvg(cd.model);
        if (/NaN|undefined|Infinity/.test(svg)) warnings.push(`${sym} ${view} ${m}: SVG contains NaN / undefined / Infinity`);
        const file = `${TAG}_${cd.sym}_${view}_${m}.png`;
        writeFileSync(join(OUT, file), png(svg));
        if (SAVE_SVG) writeFileSync(join(OUT, file.replace(/\.png$/, '.svg')), svg);
        const ms = Date.now() - t0;
        shots.push({ sym: cd.sym, view, mode: m, file, ms });
        console.log(`${String(ms).padStart(5)}ms ${sym.padEnd(7)} ${view.padEnd(4)} ${m.padEnd(7)} ${file}`);
      } catch (e) {
        const msg = `${sym} ${view} ${mode}: ${(e as Error)?.stack ?? e}`;
        errors.push(msg);
        console.error(`\n!!! FAILED ${msg}\n`);
      }
    }
  }
}

// ---- contact sheet: one row per symbol, one column per (mode, view slot) ---------------------------------------------
const slot = (v: string) => (v === 'QMN' || v === 'QW1' ? 'Q<TF>' : v);
const cols = [...new Set(shots.map(s => `${s.mode.replace('syn', '')}|${slot(s.view)}`))]
  .sort((a, z) => (a.startsWith('pub') ? 0 : 1) - (z.startsWith('pub') ? 0 : 1) || ORDER(a) - ORDER(z));
function ORDER(c: string) { return ['Q', 'Q<TF>', 'D1', 'W1', 'H4', 'H1', 'M15'].indexOf(c.split('|')[1]); }
const rows = [...new Set(shots.map(s => s.sym))];
if (shots.length) {
  const T = 300, LW = 120, HH = 40, LH = 22;
  const W = LW + cols.length * T, H = HH + rows.length * (T + LH);
  const parts: string[] = [`<rect width="${W}" height="${H}" fill="#000"/>`];
  cols.forEach((c, j) => parts.push(`<text x="${LW + j * T + T / 2}" y="28" font-size="20" fill="#E5E7EB" text-anchor="middle">${c.replace('|', ' ').replace('<', '&lt;').replace('>', '&gt;')}</text>`));
  rows.forEach((sym, i) => {
    const y = HH + i * (T + LH);
    parts.push(`<text x="10" y="${y + T / 2}" font-size="22" font-weight="600" fill="#E5E7EB">${sym}</text>`);
    cols.forEach((c, j) => {
      const s = shots.find(x => x.sym === sym && `${x.mode.replace('syn', '')}|${slot(x.view)}` === c);
      if (!s) return;
      const b64 = readFileB64(join(OUT, s.file));
      parts.push(`<image x="${LW + j * T + 2}" y="${y}" width="${T - 4}" height="${T - 4}" href="data:image/png;base64,${b64}"/>`);
      parts.push(`<text x="${LW + j * T + 4}" y="${y + T + 14}" font-size="14" fill="#9CA3AF">${s.view} ${s.mode}</text>`);
    });
  });
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" font-family="Inter">${parts.join('')}</svg>`;
  writeFileSync(join(OUT, `contact_${TAG}.png`), png(sheet));
}
function readFileB64(p: string): string { return readFileSync(p).toString('base64'); }

// ---- index.html: every tag found in the folder, side by side ---------------------------------------------------------
const all = readdirSync(OUT).map(f => /^([A-Za-z0-9-]+)_([A-Z0-9.]+)_([A-Z0-9]+)_(pub|live|livesyn)\.png$/.exec(f)).filter((m): m is RegExpExecArray => !!m);
const tags = [...new Set(all.map(m => m[1]))].sort((a, z) => (a === 'before' ? -1 : z === 'before' ? 1 : a.localeCompare(z)));
const keys = [...new Set(all.map(m => `${m[2]}|${m[3]}|${m[4]}`))].sort();
const html = `<!doctype html><meta charset="utf-8"><title>RamanFX chart QA</title>
<style>body{background:#0B0C10;color:#E5E7EB;font:14px Inter,system-ui,sans-serif;margin:16px}table{border-collapse:collapse}td,th{padding:6px;vertical-align:top;border-bottom:1px solid #232634}
img{width:min(640px,45vw);display:block}a{color:#C4B5FD}th{position:sticky;top:0;background:#0B0C10}</style>
<h1>Chart QA: ${tags.join(' vs ')}</h1><p>${tags.map(t => `<a href="contact_${t}.png">contact_${t}.png</a>`).join(' · ')} · generated ${new Date().toISOString()}</p>
<table><tr><th>chart</th>${tags.map(t => `<th>${t}</th>`).join('')}</tr>
${keys.map(k => { const [s, v, m] = k.split('|'); return `<tr><td><b>${s}</b><br>${v}<br>${m}</td>${tags.map(t => { const f = `${t}_${s}_${v}_${m}.png`; return `<td>${all.some(x => x[0] === f) ? `<a href="${f}"><img loading="lazy" src="${f}"></a>` : '-'}</td>`; }).join('')}</tr>`; }).join('\n')}
</table>`;
writeFileSync(join(OUT, 'index.html'), html);

const total = shots.reduce((a, s) => a + s.ms, 0);
console.log(`\n${shots.length} images in ${((Date.now() - t00) / 1000).toFixed(1)} s (render avg ${shots.length ? Math.round(total / shots.length) : 0} ms) -> ${OUT}`);
console.log(`contact sheet: ${join(OUT, `contact_${TAG}.png`)}\nindex: ${join(OUT, 'index.html')}`);
for (const w of warnings) console.warn(`WARN ${w}`);
if (errors.length) { console.error(`\n${errors.length} RENDER(S) FAILED:\n${errors.join('\n')}`); process.exit(1); }
