// Headless benchmark of the Kokoro narrator engine: starts Vite, opens scripts/kokoro-harness.html in Chromium,
// synthesises three sentences with WASM q8 and prints the realtime factor.
// Usage: node scripts/kokoro-bench.mjs [--coi] [--gpu] [--dtype=fp32] [--voice=af_heart]
//   --coi  serve with COOP/COEP headers (cross-origin isolated => multi-threaded WASM)
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const coi = process.argv.includes('--coi');
const gpu = process.argv.includes('--gpu');
const dtype = (process.argv.find(a => a.startsWith('--dtype=')) ?? '').slice(8);
const voice = (process.argv.find(a => a.startsWith('--voice=')) ?? '--voice=af_heart').slice(8);
const server = await createServer({
  logLevel: 'warn',
  server: { port: 5199, strictPort: false, hmr: false, watch: null, headers: coi ? { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'credentialless' } : {} },
});
await server.listen();
const url = `${server.resolvedUrls.local[0]}scripts/kokoro-harness.html?auto=1&voice=${voice}${gpu ? '&gpu=1' : ''}${dtype ? '&dtype=' + dtype : ''}`;
const bs = await chromium.launchServer({ args: gpu ? ['--enable-unsafe-webgpu'] : [] });
const browser = await chromium.connect(bs.wsEndpoint());
const ctx = await browser.newContext();
const page = await ctx.newPage();
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[page error]', e.message));

// CPU seconds used by the whole browser process tree: wall-clock RTF is meaningless on a busy shared machine,
// CPU time per audio second is not (for single-threaded WASM it is what an idle core would take).
const tick = 100; // USER_HZ
function treeCpu(root) {
  const stats = new Map();
  for (const d of readdirSync('/proc')) {
    if (!/^\d+$/.test(d)) continue;
    try {
      const f = readFileSync(`/proc/${d}/stat`, 'utf8'); const r = f.slice(f.lastIndexOf(')') + 2).split(' ');
      stats.set(+d, { ppid: +r[1], cpu: (+r[11] + +r[12]) / tick });
    } catch { /* gone */ }
  }
  let sum = 0; const want = new Set([root]);
  for (let changed = true; changed;) { changed = false; for (const [pid, s] of stats) if (!want.has(pid) && want.has(s.ppid)) { want.add(pid); changed = true; } }
  for (const pid of want) sum += stats.get(pid)?.cpu ?? 0;
  return sum;
}
const pid = bs.process().pid;
await page.goto(url);
let cpuAtSynth = null, cpuAtDone = null, wallAtSynth = 0, wallAtDone = 0;
for (;;) {
  const ph = await page.evaluate(() => window.__phase ?? (window.__result ? 'done' : ''));
  if (ph === 'synth' && cpuAtSynth == null) { cpuAtSynth = treeCpu(pid); wallAtSynth = Date.now(); }
  if (ph === 'done') { cpuAtDone = treeCpu(pid); wallAtDone = Date.now(); break; }
  await new Promise(r => setTimeout(r, 200));
}
const result = await page.waitForFunction(() => window.__result, null, { timeout: 60_000 }).then(h => h.jsonValue());
if (!result.error && cpuAtSynth != null) {
  const audioSec = result.samples.reduce((a, s) => a + s.audioMs, 0) / 1000;
  result.cpuSecPerAudioSec = +((cpuAtDone - cpuAtSynth) / audioSec).toFixed(3);
  result.wallSecPerAudioSec = +(((wallAtDone - wallAtSynth) / 1000) / audioSec).toFixed(3);
  result.loadavg = readFileSync('/proc/loadavg', 'utf8').split(' ').slice(0, 3).join(' ');
}
console.log('\nRESULT', JSON.stringify(result));
await ctx.close(); await browser.close(); await bs.close(); await server.close();
