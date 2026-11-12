// App check: opens EVERY page of the app in WebKit with the iPhone 13 profile and in desktop Chromium and reports, in
// plain English, what a visitor would hit: uncaught script errors, console errors, failed requests, CSP violations,
// HTTP >= 400 on our own files (and the Supabase functions), blank pages; plus deep checks: /ask loads the on-device
// search model (fails on "could not load"), and the lesson-audio function streams.
//
//   node tools/app_check/check.mjs --mode preview            # npx vite build, serve dist/ with the vercel.json headers
//   node tools/app_check/check.mjs --mode live [--base URL]  # the deployed site (default https://raman-fx.vercel.app)
// Options: --browsers chromium,webkit  --only /ask,/news  --no-deep  --skip-build [--dist DIR]  --out DIR  --verbose  --state FILE --notify
//          --fail-on-problems  --allow-missing-browser  --ask-timeout 240  --budget-min 22
// Env:     APP_CHECK_EMAIL / APP_CHECK_PASSWORD   optional test account (else a stand-in signed-in session with an
//                                                 empty journal: Supabase auth / table calls answered locally)
//          TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID  with --notify: ONE message when problems appear or all recover
//          APP_CHECK_RUN_URL                      link in the Telegram footer;  GITHUB_STEP_SUMMARY  job summary
//          APP_CHECK_BROWSER_PROXY                route the browsers through this proxy (sandboxes only)
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BROWSERS, decideNotify, expectedReason, groupProblems, nextState, parseRoutes, problemKey, routeTargets, summaryMarkdown, telegramMessage,
} from './lib.mjs';
import { startServer } from './server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/node-tools/node_modules/playwright'); }

// ------------------------------------------------------------------------------------------------------------ args
const argv = process.argv.slice(2);
const flag = n => argv.includes(`--${n}`);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const MODE = opt('mode', 'preview');
if (!['live', 'preview'].includes(MODE)) { console.error('--mode live | preview'); process.exit(2); }
const ENGINES = opt('browsers', 'webkit,chromium').split(',').map(s => s.trim()).filter(Boolean);
const OUT = path.resolve(opt('out', path.join(ROOT, 'tools/app_check/out')));
const ONLY = opt('only', '') ? opt('only').split(',') : null;
const DEEP = !flag('no-deep');
const ASK_TIMEOUT = +opt('ask-timeout', 240) * 1000;
const DEADLINE = Date.now() + +opt('budget-min', 22) * 60_000;
const STATE = opt('state', '');
const DIST = path.resolve(opt('dist', path.join(ROOT, 'dist')));   // preview: an already built dist/ (with --skip-build)
const EMAIL = process.env.APP_CHECK_EMAIL || '', PASSWORD = process.env.APP_CHECK_PASSWORD || '';
const PROXY = process.env.APP_CHECK_BROWSER_PROXY || '';
fs.mkdirSync(OUT, { recursive: true });

const SUPA = /SUPA_URL\s*=\s*'([^']+)'/.exec(fs.readFileSync(path.join(ROOT, 'src/data/cloud.ts'), 'utf8'))?.[1] ?? '';
const SUPA_HOST = SUPA ? new URL(SUPA).host : '';
const routes = routeTargets(parseRoutes(fs.readFileSync(path.join(ROOT, 'src/App.tsx'), 'utf8')));
const targets = ONLY ? routes.filter(r => ONLY.includes(r.route) || ONLY.includes(r.path)) : routes;
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

const raw = [];        // every problem found (kept after the re-check)
const skipped = [];    // checks that could not run, with why
let expectedCount = 0;
const expectedSeen = [];   // the ignored ones, for results.json

// ----------------------------------------------------------------------------------------------------- the target
let base = opt('base', process.env.APP_CHECK_BASE_URL || 'https://raman-fx.vercel.app').replace(/\/+$/, '');
let server = null;
if (MODE === 'preview') {
  if (!flag('skip-build')) {
    log('building: npx vite build');
    const b = spawnSync('npx', ['vite', 'build'], { cwd: ROOT, stdio: 'inherit' });
    if (b.status !== 0) { console.error('vite build failed'); process.exit(1); }
    // like the Vercel buildCommand: the data folders are not deployed (the server also treats them as absent)
  }
  server = await startServer({ dir: DIST, vercelPath: path.join(ROOT, 'vercel.json') });
  base = server.url;
  log(`preview server (vercel.json headers) at ${base}`);
}
const ORIGIN = new URL(base).origin;

async function reachable(url) {
  try { const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10_000) }); return r.status < 500; } catch { return false; }
}
const hfUp = await reachable('https://huggingface.co/');
const siteDown = MODE === 'live' && !(await reachable(base + '/'));
if (siteDown) raw.push({ kind: 'setup', page: 'The site', text: `${base} did not answer (DNS, TLS or the server is down), no page could be checked` });

// ---------------------------------------------------------------------------------------------- stand-in session
const STUB_USER = { id: '00000000-0000-4000-8000-00000000a0c0', email: 'app-check@example.invalid' };
const b64u = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const FAR = Math.floor(Date.now() / 1000) + 30 * 86400;
const STUB_TOKEN = `${b64u({ alg: 'HS256', typ: 'JWT' })}.${b64u({ sub: STUB_USER.id, email: STUB_USER.email, role: 'authenticated', aud: 'authenticated', exp: FAR })}.app-check`;
const STUB_SESSION = {
  access_token: STUB_TOKEN, refresh_token: 'app-check', token_type: 'bearer', expires_in: 30 * 86400, expires_at: FAR,
  user: { ...STUB_USER, aud: 'authenticated', role: 'authenticated', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' },
};
const SESSION_KEY = SUPA_HOST ? `sb-${SUPA_HOST.split('.')[0]}-auth-token` : '';

/** Supabase auth / tables / storage answered locally: an empty journal, nothing ever written to the real backend. */
async function stubSupabase(ctx) {
  await ctx.addInitScript(([k, v]) => { try { if (!localStorage.getItem(k)) localStorage.setItem(k, v); } catch { /* storage off */ } }, [SESSION_KEY, JSON.stringify(STUB_SESSION)]);
  await ctx.route(u => u.host === SUPA_HOST && /^\/(auth|rest|storage)\/v1\//.test(u.pathname), async route => {
    const r = route.request(), p = new URL(r.url()).pathname;
    const json = (status, body) => route.fulfill({ status, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(body) });
    if (r.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*', 'Access-Control-Allow-Methods': '*' } });
    if (p.startsWith('/auth/v1/user')) return json(200, STUB_SESSION.user);
    if (p.startsWith('/auth/v1/token')) return json(200, STUB_SESSION);
    if (p.startsWith('/auth/v1/logout')) return route.fulfill({ status: 204 });
    if (p.startsWith('/rest/v1/')) return r.method() === 'GET' || r.method() === 'HEAD' ? json(200, []) : json(201, []);
    return json(200, []);
  });
}

async function signIn(page) {
  await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  await page.locator('input[type=email]').fill(EMAIL);
  await page.locator('input[autocomplete=current-password]').fill(PASSWORD);
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.locator('main#main').waitFor({ timeout: 30_000 });
}

// ------------------------------------------------------------------------------------------------- one page visit
const CSP_INIT = () => {
  if (window.top !== window) return;   // our document only (third-party frames have their own policies)
  document.addEventListener('securitypolicyviolation', e => {
    try { window.__appCheckCsp?.({ directive: e.effectiveDirective || e.violatedDirective, url: e.blockedURI, source: e.sourceFile, line: e.lineNumber, sample: e.sample }); } catch { /* binding gone */ }
  });
};

const VERBOSE = flag('verbose');
function collect(page, engine, route, probs, state) {
  if (VERBOSE) {
    page.on('response', r => { if (!r.url().startsWith(ORIGIN)) log(`${engine} ${route} ${r.status()} ${r.url().slice(0, 140)}`); });
    page.on('console', m => log(`${engine} ${route} console.${m.type()}: ${m.text().slice(0, 200)}`));
  }
  const push = p => probs.push({ page: route, browser: engine, mode: MODE, ...p });
  page.on('pageerror', e => push({ kind: 'pageerror', text: `${e.name ?? 'Error'}: ${e.message}` }));
  page.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/Content Security Policy|Refused to (load|execute|connect|frame|apply|create)/i.test(t)) return push({ kind: 'csp-console', text: t, source: m.location()?.url });
    push({ kind: 'console', text: t, source: m.location()?.url });
  });
  page.on('requestfailed', r => {
    if (state.closing) return;
    const f = r.failure()?.errorText ?? 'failed';
    push({ kind: /CSP|Content Security/i.test(f) ? 'csp' : 'request', url: r.url(), text: f });
  });
  page.on('response', r => {
    const s = r.status();
    if (s < 400) return;
    let u; try { u = new URL(r.url()); } catch { return; }
    const ours = u.origin === ORIGIN;
    const fn = u.host === SUPA_HOST && u.pathname.startsWith('/functions/') && s >= 500;
    if (ours || fn) push({ kind: 'http', status: s, url: r.url(), upstream: r.headers()['x-app-check-upstream'] });
  });
}

/** Opens one page, waits for <main> to show real content and the network to settle, then runs `deep` if given. */
async function visit(ctx, engine, t, deep) {
  const probs = [], state = { closing: false };
  const page = await ctx.newPage();
  page.__appCheck = { route: t.route, probs, engine };
  collect(page, engine, t.route, probs, state);
  try {
    const resp = await page.goto(base + t.path, { waitUntil: 'domcontentloaded', timeout: 45_000 });
    if (resp && resp.status() >= 400 && new URL(resp.url()).origin !== ORIGIN) probs.push({ page: t.route, browser: engine, kind: 'http', status: resp.status(), url: resp.url() });
    const ok = await page.waitForFunction(() => {
      const m = document.querySelector('main#main');   // the app shell (the sign-in screen has a plain <main>)
      if (!m || m.querySelector('[aria-busy="true"]')) return false;
      // an embedded page (the /practice sandbox) counts as content: innerText does not see inside an iframe
      if ([...m.querySelectorAll('iframe, canvas')].some(f => f.getBoundingClientRect().height > 100)) return true;
      return (m.innerText || '').trim().length > 10;
    }, null, { timeout: 25_000, polling: 250 }).then(() => true, () => false);
    if (!ok) {
      const txt = await page.evaluate(() => (document.body?.innerText || '').trim().slice(0, 120)).catch(() => '');
      probs.push({ page: t.route, browser: engine, kind: 'blank', text: txt ? `only "${txt}"` : 'nothing rendered' });
      await page.screenshot({ path: path.join(OUT, `${engine}${t.path.replace(/[^\w]+/g, '_')}.png`) }).catch(() => {});
    }
    await page.waitForLoadState('networkidle', { timeout: 8_000 }).catch(() => {});
    await page.waitForTimeout(400);
    if (deep) await deep(page, probs);
  } catch (e) {
    probs.push({ page: t.route, browser: engine, kind: 'nav', text: e.message.split('\n')[0] });
  }
  state.closing = true;
  await page.close().catch(() => {});
  // a CSP console line is only reported when the securitypolicyviolation event did not already report it
  const hasCsp = probs.some(p => p.kind === 'csp');
  return probs.filter(p => p.kind !== 'csp-console' || !hasCsp).map(p => (p.kind === 'csp-console' ? cspFromConsole(p) : p));
}

/** A CSP console line (Chromium / WebKit wording) -> { url | text, directive }; inline code has no URL. */
function cspFromConsole(p) {
  const url = /['"]((?:https?|wss?|blob|data):[^'"\s]*)['"]/.exec(p.text)?.[1];
  const directive = /directive:? ["']([a-z-]+)/i.exec(p.text)?.[1] ?? /the ([a-z-]+-src(?:-elem)?) directive/i.exec(p.text)?.[1];
  const inline = /inline (script|style|event handler)/i.exec(p.text)?.[0];
  const where = p.source === 'about:srcdoc' ? ' inside an embedded (srcdoc) frame, which inherits the page CSP' : '';
  return { ...p, kind: 'csp', url, directive, text: url ? p.text : `${inline ?? 'inline code'}${where}` };
}

// ---------------------------------------------------------------------------------------------------- deep checks
/** /ask: type a question, submit, wait until the semantic model is ready or the "could not load" warning shows. */
const askDeep = engine => async (page, probs) => {
  const t0 = Date.now();
  await page.getByLabel('Your question').fill('when do I use a confirmation entry?');
  await page.getByRole('button', { name: 'Ask', exact: true }).click();
  const res = await page.waitForFunction(() => {
    const t = document.querySelector('main')?.innerText || '';
    if (/The search model could not load/.test(t)) return { state: 'error', text: (/could not load \(([^)]*)\)/.exec(t) || [])[1] || 'unknown error' };
    if (/Your question never leaves this browser/.test(t) && /Closest passages/i.test(t)) return { state: 'ready' };
    return false;
  }, null, { timeout: ASK_TIMEOUT, polling: 1000 }).then(h => h.jsonValue(), async () => ({ state: 'timeout', text: await page.locator('main [aria-live=polite]').first().innerText().catch(() => '') }));
  const secs = Math.round((Date.now() - t0) / 1000);
  log(`${engine} /ask model: ${res.state} after ${secs} s${res.text ? ` (${res.text})` : ''}`);
  const offline = MODE === 'preview' && !hfUp && !probs.some(p => p.kind === 'csp');
  if (res.state === 'ready') return;
  if (offline) { skipped.push(`/ask on ${BROWSERS[engine]}: model download not tested (huggingface.co not reachable from here); CSP and imports were still checked`); return; }
  if (res.state === 'error') probs.push({ page: '/ask', browser: engine, kind: 'ask-model', text: res.text });
  else probs.push({ page: '/ask', browser: engine, kind: 'ask-timeout', text: `${Math.round(ASK_TIMEOUT / 60000)} min${res.text ? ` (it said: ${res.text.replace(/\s+/g, ' ').slice(0, 100)})` : ''}` });
};

/** Preview: every .mjs we ship must import under the real CSP and MIME types (the ONNX Runtime engine is one). */
const moduleDeep = async (page, probs) => {
  const dir = path.join(DIST, 'assets');
  const mjs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.mjs')) : [];
  for (const f of mjs) {
    const url = `${base}/assets/${f}`;
    const err = await page.evaluate(u => import(u).then(() => '', e => String(e?.message || e)), url).catch(e => String(e.message));
    if (err) probs.push({ page: '/', browser: page.__appCheck.engine, kind: 'module', url, text: err });
  }
};

/** Signed-in with the real test account: list, sign and stream a few 512 KB ranges of two lessons, from the page. */
const audioDeep = engine => async (page, probs) => {
  const r = await page.evaluate(async ({ fn, key }) => {
    const tok = JSON.parse(localStorage.getItem(key) || 'null')?.access_token || '';
    const H = { Authorization: `Bearer ${tok}` };
    const out = [];
    const l = await fetch(`${fn}?list=course`, { headers: H });
    if (!l.ok) return { list: l.status };
    const nums = Object.keys(await l.json()).slice(0, 2);
    for (const n of nums) {
      const s = await fetch(`${fn}?sign=course:${n}`, { headers: H });
      if (!s.ok) { out.push({ n, step: 'sign', status: s.status }); continue; }
      const { query } = await s.json();
      for (let i = 0; i < 3; i++) {
        const a = await fetch(`${fn}?${query}`, { headers: { Range: `bytes=${i * 524288}-${(i + 1) * 524288 - 1}` } });
        await a.arrayBuffer().catch(() => null);
        out.push({ n, step: `range ${i + 1}`, status: a.status, type: a.headers.get('content-type') });
      }
    }
    return { list: 200, out, nums };
  }, { fn: `${SUPA}/functions/v1/lesson-audio`, key: SESSION_KEY }).catch(e => ({ error: e.message }));
  const P = text => probs.push({ page: 'Lesson audio', browser: engine, kind: 'audio', text });
  if (r.error) return P(`the audio check could not run: ${r.error}`);
  if (r.list === 401) return P('the test account is not allowed to stream lesson audio (add its user id to ALLOWED_USERS of lesson-audio)');
  if (r.list !== 200) return P(`listing the lessons failed with HTTP ${r.list}`);
  if (!r.nums.length) return P('the audio folder lists no lessons');
  for (const x of r.out) if (!(x.status === 206 || x.status === 200) || (x.step !== 'sign' && !/audio/.test(x.type ?? ''))) P(`streaming lesson course:${x.n} failed at ${x.step} with HTTP ${x.status}`);
};

/** Without an account the function can still be checked to be up: an unsigned request must get 401, not 5xx. */
async function audioPing() {
  if (!SUPA) return;
  try {
    const r = await fetch(`${SUPA}/functions/v1/lesson-audio?k=course:1`, { signal: AbortSignal.timeout(20_000) });
    if (r.status >= 500) raw.push({ page: 'Lesson audio', kind: 'audio', text: `the audio server answers HTTP ${r.status} (expected 401 for a visitor without a session)` });
    else log(`lesson-audio unsigned ping: HTTP ${r.status}`);
  } catch (e) { skipped.push(`lesson-audio ping: ${e.message}`); }
}

// --------------------------------------------------------------------------------------------------- one browser
const DEVICE = { webkit: 'iPhone 13', chromium: 'Desktop Chrome' };
async function runEngine(engine) {
  let browser;
  try {
    browser = await pw[engine].launch(PROXY ? { proxy: { server: PROXY, bypass: '127.0.0.1,localhost' } } : {});
  } catch (e) {
    const msg = `${BROWSERS[engine]} (${engine}) could not start: ${e.message.split('\n')[0]}`;
    if (flag('allow-missing-browser')) skipped.push(msg); else raw.push({ page: 'The check', browser: engine, kind: 'setup', text: msg });
    return;
  }
  const ctxOpts = { ...pw.devices[DEVICE[engine]], locale: 'en-CA', timezoneId: 'America/Edmonton' };
  try {
    // 1. signed out: the sign-in screen renders
    {
      const ctx = await browser.newContext(ctxOpts);
      const page = await ctx.newPage(), probs = [];
      collect(page, engine, '/ (signed out)', probs, { closing: false });
      await page.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 45_000 }).catch(e => probs.push({ page: '/ (signed out)', browser: engine, kind: 'nav', text: e.message.split('\n')[0] }));
      const ok = await page.locator('form[aria-label="Sign in"]').waitFor({ timeout: 25_000 }).then(() => true, () => false);
      if (!ok) probs.push({ page: '/ (signed out)', browser: engine, kind: 'blank', text: 'the sign-in form did not show' });
      await page.waitForTimeout(5_000);   // the idle preload of every page chunk runs on the sign-in screen too
      await ctx.close();
      raw.push(...probs.filter(p => keep(p)));
    }
    // 2. signed in (test account, or the stand-in session): every route
    const ctx = await browser.newContext(ctxOpts);
    await ctx.exposeBinding('__appCheckCsp', ({ page }, v) => {
      const a = page?.__appCheck;
      if (a) a.probs.push({ page: a.route, browser: a.engine, mode: MODE, kind: 'csp', directive: v.directive, url: v.url, text: v.sample || v.source || '' });
    });
    await ctx.addInitScript(CSP_INIT);
    if (EMAIL && PASSWORD) {
      const p = await ctx.newPage();
      const ok = await signIn(p).then(() => true, e => { raw.push({ page: 'Sign-in', browser: engine, kind: 'setup', text: `the test account could not sign in: ${e.message.split('\n')[0]}` }); return false; });
      await p.close();
      if (!ok) return;
    } else await stubSupabase(ctx);

    const deepFor = t => {
      if (!DEEP) return null;
      if (t.route === '/ask') return askDeep(engine);
      if (t.route === '/' && MODE === 'preview') return moduleDeep;
      return null;
    };
    const found = new Map();
    for (const t of targets) {
      if (Date.now() > DEADLINE) { skipped.push(`${t.route} on ${BROWSERS[engine]}: time budget used up`); continue; }
      const probs = (await visit(ctx, engine, t, deepFor(t))).filter(keep);
      log(`${engine.padEnd(8)} ${t.path.padEnd(32)} ${probs.length ? `${probs.length} problem(s)` : 'ok'}`);
      if (probs.length) found.set(t, probs);
    }
    // a second look at each page that had problems: only what happens again is reported (third-party blips)
    for (const [t, probs] of found) {
      const deepOnce = probs.filter(p => p.kind.startsWith('ask-') || p.kind === 'module');
      const rest = probs.filter(p => !deepOnce.includes(p));
      if (rest.length && Date.now() < DEADLINE) {
        const again = new Set((await visit(ctx, engine, t, null)).filter(keep).map(problemKey));
        raw.push(...rest.filter(p => again.has(problemKey(p))));
        const gone = rest.filter(p => !again.has(problemKey(p))).length;
        if (gone) log(`${engine} ${t.path}: ${gone} problem(s) did not happen again (ignored)`);
      } else raw.push(...rest);
      raw.push(...deepOnce);
    }
    if (DEEP && EMAIL && PASSWORD && MODE === 'live') {
      const page = await ctx.newPage(), probs = [];
      await page.goto(base + '/learn', { waitUntil: 'domcontentloaded' }).catch(() => {});
      await audioDeep(engine)(page, probs);
      raw.push(...probs);
      await page.close();
    }
    await ctx.close();
  } finally {
    await browser.close();
  }
}

function keep(p) {
  const why = expectedReason(p);
  if (why) { expectedCount++; if (expectedSeen.length < 100) expectedSeen.push({ ...p, why }); return false; }
  return true;
}

// ------------------------------------------------------------------------------------------------------------- run
log(`app check: ${MODE} ${base} · ${targets.length} pages · ${ENGINES.join(' + ')} · ${EMAIL ? 'test account' : 'stand-in session'}`);
if (MODE === 'live' && DEEP && !EMAIL) await audioPing();
if (MODE === 'live' && DEEP && !EMAIL) skipped.push('lesson audio streaming: no APP_CHECK_EMAIL / APP_CHECK_PASSWORD (an account in ALLOWED_USERS), only checked that the audio server is up');
if (MODE === 'preview' && !hfUp) skipped.push('huggingface.co is not reachable from here: the /ask model download may be skipped');
if (!siteDown) await Promise.all(ENGINES.map(e => runEngine(e).catch(err => raw.push({ page: 'The check', browser: e, kind: 'setup', text: `crashed: ${err.message.split('\n')[0]}` }))));
if (server) await server.close();

const groups = groupProblems(raw);
const summary = summaryMarkdown({ mode: MODE, base: MODE === 'preview' ? 'local build with the vercel.json headers' : base, groups, skipped, expected: expectedCount, pages: targets.length, browsers: ENGINES, auth: EMAIL ? 'test account' : 'stand-in session, empty journal' });
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ mode: MODE, base, checked_at: new Date().toISOString(), groups, raw, skipped, expected: expectedCount, expected_seen: expectedSeen }, null, 2));
fs.writeFileSync(path.join(OUT, 'summary.md'), summary);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
console.log('\n' + summary);
for (const g of groups) if (process.env.GITHUB_ACTIONS) console.log(`::error title=App check::${g.text.replace(/\r?\n/g, ' ')}`);

// --------------------------------------------------------------------------------------------- state + Telegram
if (STATE) {
  let prev = null;
  try { prev = JSON.parse(fs.readFileSync(STATE, 'utf8')); } catch { /* first run */ }
  const d = decideNotify(prev, groups);
  log(`notify: ${d.send ? d.kind : 'no (nothing changed)'}`);
  if (d.send && flag('notify')) {
    const tok = process.env.TELEGRAM_BOT_TOKEN, chat = process.env.TELEGRAM_CHAT_ID;
    if (!tok || !chat) log('Telegram: TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set, nothing sent');
    else {
      const text = telegramMessage({ kind: d.kind, groups, fresh: d.fresh, prev, base, runUrl: process.env.APP_CHECK_RUN_URL });
      const r = await fetch(`https://api.telegram.org/bot${tok}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chat, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      }).catch(e => ({ ok: false, status: e.name }));
      log(`Telegram: ${r.ok ? 'sent' : `failed (${r.status})`}`);
    }
  }
  fs.mkdirSync(path.dirname(path.resolve(STATE)), { recursive: true });
  fs.writeFileSync(STATE, JSON.stringify(nextState(prev, groups, { base }), null, 2) + '\n');
}

process.exitCode = groups.length && flag('fail-on-problems') ? 1 : 0;
