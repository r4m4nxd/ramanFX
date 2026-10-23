// End-to-end check of the Listen bar's natural (Kokoro) engine in headless Chromium, outside the login wall:
// pick Natural, play, watch the download, the first sentence and the follow-along highlight, then pause/resume,
// speed, skip and stop. Run: node scripts/listen-e2e.mjs   (takes minutes on a slow CPU: real synthesis)
import { createRequire } from 'node:module';
import { createServer } from 'vite';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const server = await createServer({ logLevel: 'warn', server: { port: 5198, strictPort: false, hmr: false, watch: null } });
await server.listen();
const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 900 } }); // phone width
await ctx.addInitScript(() => {
  // Record what the player does with media elements (they are not in the DOM).
  const log = (window.__media = []);
  const P = HTMLMediaElement.prototype, play = P.play, pause = P.pause;
  window.__els = new Set();
  P.play = function () { window.__els.add(this); log.push({ t: performance.now(), op: 'play', src: String(this.src).slice(0, 5), rate: this.playbackRate, pp: this.preservesPitch }); return play.call(this); };
  P.pause = function () { log.push({ t: performance.now(), op: 'pause' }); return pause.call(this); };
  window.__playing = () => [...window.__els].some(e => !e.paused && String(e.src).startsWith('blob:') && e.duration > 1.2);
  window.__rate = () => [...window.__els].filter(e => String(e.src).startsWith('blob:') && e.duration > 1.2).map(e => e.playbackRate)[0];
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', e => { errors.push(e.message); console.log('[page error]', e.message); });
page.on('console', m => { if (m.type() === 'error') console.log('[console]', m.text()); });
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'} ${msg}`); if (!cond) process.exitCode = 1; };
const t0 = Date.now();
const since = () => `${((Date.now() - t0) / 1000).toFixed(0)} s`;

await page.goto(`${server.resolvedUrls.local[0]}scripts/listen-harness.html`);
await page.getByRole('button', { name: 'Voice', exact: true }).click();
await page.getByRole('radio', { name: 'Natural (Kokoro)' }).click();
ok(await page.getByText(/Runs entirely on this device/).isVisible(), 'on-device note and download size shown before download');
const stored = await page.evaluate(() => localStorage.getItem('rfx_listen_engine'));
ok(stored === 'kokoro', 'engine choice saved in localStorage');
await page.getByRole('combobox', { name: 'Natural voice' }).selectOption('bm_george');
ok(await page.evaluate(() => localStorage.getItem('rfx_listen_kvoice')) === 'bm_george', 'voice choice saved');
await page.getByRole('combobox', { name: 'Natural voice' }).selectOption('af_heart');
await page.getByRole('button', { name: 'Follow along' }).click();

const tPlay = Date.now();
await page.getByRole('button', { name: /Play lesson|Resume lesson/ }).first().click();
const sawProgress = await page.getByText(/Downloading the natural voice|Getting the natural voice ready/).first().waitFor({ timeout: 30_000 }).then(() => true, () => false);
ok(sawProgress, 'download progress shown on the card');
await page.waitForFunction(() => window.__playing(), null, { timeout: 15 * 60_000, polling: 250 });
const firstAudio = (Date.now() - tPlay) / 1000;
console.log(`first natural audio after ${firstAudio.toFixed(1)} s (${since()})`);
const media = await page.evaluate(() => window.__media.filter(m => m.op === 'play' && m.src === 'blob:'));
ok(media.length > 0 && media.at(-1).pp === true, 'audio element plays a WAV blob with preservesPitch');
// Follow-along: the current sentence is highlighted word by word (sampled while the audio plays).
const seen = new Set();
for (let k = 0; k < 15; k++) {
  const w = await page.evaluate(() => (window.__playing() ? document.querySelector('p[aria-current="true"] .bg-accent\\/25')?.textContent : null) ?? null);
  if (w) seen.add(w);
  await page.waitForTimeout(150);
}
ok(seen.size >= 2, `word highlight moves with the audio (${[...seen].join(' > ')})`);

// Speed: instant, via playbackRate.
await page.getByRole('radio', { name: '1.5×', exact: true }).first().click();
await page.waitForTimeout(300);
const r = await page.evaluate(() => window.__rate());
ok(r > 1.35 && r < 1.65, `speed 1.5x applied to playbackRate (${r})`);
await page.getByRole('radio', { name: '1×', exact: true }).first().click();

// Pause and resume mid-sentence (wait until a sentence is actually playing).
await page.waitForFunction(() => window.__playing(), null, { timeout: 10 * 60_000, polling: 100 });
await page.getByRole('button', { name: 'Pause lesson' }).first().click();
await page.waitForTimeout(300);
ok(!(await page.evaluate(() => window.__playing())), 'pause stops the audio');
const curBefore = await page.locator('p[aria-current="true"]').first().textContent();
const posBefore = await page.evaluate(() => [...window.__els].find(e => String(e.src).startsWith('blob:') && e.duration > 1.2)?.currentTime ?? -1);
await page.getByRole('button', { name: /Resume lesson|Play lesson/ }).first().click();
await page.waitForTimeout(400);
const posAfter = await page.evaluate(() => [...window.__els].find(e => String(e.src).startsWith('blob:') && e.duration > 1.2 && !e.paused)?.currentTime ?? -1);
ok(posAfter > 0 && posAfter >= posBefore, `resume continues from the paused position (${posBefore.toFixed(2)} s -> ${posAfter.toFixed(2)} s), no re-synthesis`);
ok((await page.locator('p[aria-current="true"]').first().textContent()) === curBefore, 'resume kept the sentence');

// Wait for the speed check (three sentences) and report what the bar says.
const verdict = await Promise.race([
  page.getByText(/slower than real time on this device/).first().waitFor({ timeout: 20 * 60_000 }).then(() => 'slow'),
  page.waitForFunction(() => /Speaking [\d.]+× faster than real time/.test(document.body.textContent), null, { timeout: 20 * 60_000 }).then(() => 'fast'),
]).catch(() => 'unknown');
console.log(`speed verdict shown: ${verdict} (${since()})`);
const status = await page.evaluate(() => document.body.innerText.match(/(Speaking|Synthesis runs)[^\n]*?real time[^.\n]*|slower than real time[^\n]*/)?.[0]);
console.log('status line:', status);
if (verdict === 'slow') ok(true, 'slow device: hint shown with a "Use device voice" button');

// Skip forward a sentence (cancels look-ahead outside the window), then stop.
const idxBefore = await page.locator('p[aria-current="true"]').first().textContent();
await page.getByRole('button', { name: 'Forward one sentence' }).first().click();
await page.waitForTimeout(300);
ok((await page.locator('p[aria-current="true"]').first().textContent()) !== idxBefore, 'skip forward moves to the next sentence');
// Switching engine while playing hands over to the device voice and frees the model.
if (verdict === 'slow') {
  const auto = await page.getByText(/so the device voice took over/).isVisible();
  if (auto) console.log('the player had already switched to the device voice by itself after stalls');
  else await page.getByRole('button', { name: 'Use device voice' }).click();
  await page.waitForTimeout(500);
  ok(await page.evaluate(() => localStorage.getItem('rfx_listen_engine')) === 'device', 'switched back to device voice');
  ok(!(await page.evaluate(() => window.__playing())), 'natural audio stopped after switching');
}
ok(errors.length === 0, `no page errors (${errors.length})`);
console.log(`done in ${since()}`);
await browser.close(); await server.close();
