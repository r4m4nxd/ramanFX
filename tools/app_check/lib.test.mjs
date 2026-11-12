// @vitest-environment node
// App check (tools/app_check): the route list matches the app, the local preview server sends exactly the vercel.json
// headers (CSP included), and the Telegram message goes out only on change.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  ROUTE_SAMPLES, decideNotify, groupProblems, headersFor, nextState, parseCsp, parseRoutes, prefetchSegments, problemKey,
  removedByBuild, rewriteFor, routeTargets, sourceRegex, stripDirective, telegramMessage, expectedReason,
} from './lib.mjs';
import { startServer } from './server.mjs';

const ROOT = path.resolve(__dirname, '../..');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const vercel = JSON.parse(read('vercel.json'));

describe('routes', () => {
  const app = read('src/App.tsx');
  const paths = parseRoutes(app);

  it('finds every <Route path> of App.tsx (and only those)', () => {
    const n = (app.match(/<Route\s/g) ?? []).length;
    expect(paths.length).toBe(n - 1);                       // all but the catch-all
    expect(paths).toContain('/');
    expect(paths).toContain('/ask');
    expect(paths).toContain('/scanner/fx');
    expect(paths).not.toContain('*');
  });

  it('every :param route has a sample URL, and no stale samples', () => {
    const t = routeTargets(paths);
    expect(t.every(x => !x.path.includes(':'))).toBe(true);
    for (const k of Object.keys(ROUTE_SAMPLES)) expect(paths, `stale sample ${k}`).toContain(k);
    expect(() => routeTargets(['/new/:thing'])).toThrow(/ROUTE_SAMPLES/);
  });

  it('every lazy page of src/routes.tsx is reachable by a route (the prefetch map and the routes agree)', () => {
    const segs = prefetchSegments(read('src/routes.tsx'));
    expect(segs.length).toBeGreaterThan(20);
    const firsts = new Set(paths.map(p => p.split('/')[1]));
    for (const s of segs) expect(firsts, `/${s} is in routes.tsx BY_PATH but not a route in App.tsx`).toContain(s);
    // and every page component App.tsx imports from @/routes is rendered by some <Route>
    const imported = /import \{([^}]+)\} from '@\/routes'/.exec(app)[1].split(',').map(s => s.trim()).filter(s => s && s !== 'PRELOAD');
    for (const c of imported) expect(app, c).toMatch(new RegExp(`element=\\{<${c}\\s*/>\\}`));
  });
});

describe('vercel.json headers', () => {
  it('source patterns behave like Vercel', () => {
    expect(sourceRegex('/(.*)').test('/ask')).toBe(true);
    expect(sourceRegex('/((?!legacy\\.html).*)').test('/legacy.html')).toBe(false);
    expect(sourceRegex('/((?!legacy\\.html).*)').test('/assets/a.js')).toBe(true);
    expect(sourceRegex('/scanner/(.*)\\.json').test('/scanner/latest.json')).toBe(true);
    expect(sourceRegex('/scanner/(.*)\\.json').test('/scanner/AAPL')).toBe(false);
    expect(sourceRegex('/user/:id').test('/user/42')).toBe(true);
  });

  it('the app gets the app CSP; legacy.html its own; later blocks override earlier ones', () => {
    const app = headersFor(vercel, '/ask');
    const csp = parseCsp(app['Content-Security-Policy']);
    expect(csp['script-src']).toContain("'self'");
    expect(csp['script-src']).not.toContain('https://cdn.jsdelivr.net');
    expect(csp['connect-src']).toContain('https://huggingface.co');
    expect('upgrade-insecure-requests' in csp).toBe(true);
    expect(app['X-Content-Type-Options']).toBe('nosniff');
    expect(app['X-Robots-Tag']).toBeUndefined();                          // "/(sandbox|lessons|ask|...)/(.*)": below /ask/ only
    expect(headersFor(vercel, '/ask/passages.json')['X-Robots-Tag']).toBe('noindex, nofollow, noarchive');
    const legacy = headersFor(vercel, '/legacy.html');
    expect(legacy['Content-Security-Policy']).toContain("'unsafe-inline'");
    expect(legacy['X-Frame-Options']).toBe('SAMEORIGIN');
    expect(headersFor(vercel, '/version.json')['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
  });

  it('over plain http: no upgrade-insecure-requests, no HSTS, everything else identical', () => {
    const https = headersFor(vercel, '/');
    const http = headersFor(vercel, '/', { http: true });
    expect(http['Strict-Transport-Security']).toBeUndefined();
    expect(http['Content-Security-Policy']).not.toContain('upgrade-insecure-requests');
    expect(http['Content-Security-Policy']).toBe(stripDirective(https['Content-Security-Policy'], 'upgrade-insecure-requests'));
    const { 'Content-Security-Policy': a, 'Strict-Transport-Security': _h, ...restS } = https;
    const { 'Content-Security-Policy': b, ...restH } = http;
    expect(restH).toEqual(restS);
    expect(Object.keys(parseCsp(b))).toEqual(Object.keys(parseCsp(a)).filter(k => k !== 'upgrade-insecure-requests'));
  });

  it('rewrites: data JSON to the data branch on GitHub, app routes to index.html, files not rewritten', () => {
    expect(rewriteFor(vercel, '/fx/latest.json')).toBe('https://raw.githubusercontent.com/r4m4nxd/ramanFX/data/public/fx/latest.json');
    expect(rewriteFor(vercel, '/scanner/AAPL')).toBe('/index.html');
    expect(rewriteFor(vercel, '/assets/x.js')).toBeNull();
    expect(rewriteFor(vercel, '/version.json')).toBeNull();
    expect(removedByBuild(vercel)).toEqual(expect.arrayContaining(['fx', 'scanner', 'movers', 'insiders', 'holders']));
  });
});

describe('preview server', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'app-check-test-'));
  let s;
  beforeAll(async () => {
    fs.mkdirSync(path.join(dir, 'assets'), { recursive: true });
    fs.mkdirSync(path.join(dir, 'fx'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), '<!doctype html><title>t</title>');
    fs.writeFileSync(path.join(dir, 'assets/ort.mjs'), 'export default 1');
    fs.writeFileSync(path.join(dir, 'assets/ort.wasm'), Buffer.from([0, 97, 115, 109]));
    fs.writeFileSync(path.join(dir, 'fx/latest.json'), '{"stale":true}');
    s = await startServer({ dir, vercelPath: path.join(ROOT, 'vercel.json') });
  });
  afterAll(async () => { await s?.close(); fs.rmSync(dir, { recursive: true, force: true }); });

  it('sends the vercel.json headers (CSP without upgrade-insecure-requests) and real MIME types', async () => {
    const r = await fetch(`${s.url}/assets/ort.mjs`);
    expect(r.status).toBe(200);
    expect(r.headers.get('content-type')).toMatch(/^text\/javascript/);
    expect(r.headers.get('x-content-type-options')).toBe('nosniff');
    expect(r.headers.get('content-security-policy')).toBe(headersFor(vercel, '/assets/ort.mjs', { http: true })['Content-Security-Policy']);
    expect((await fetch(`${s.url}/assets/ort.wasm`)).headers.get('content-type')).toBe('application/wasm');
  });
  it('app routes get index.html with the app CSP; missing assets 404', async () => {
    const r = await fetch(`${s.url}/scanner/AAPL`);
    expect(r.status).toBe(200);
    expect(await r.text()).toContain('<title>t</title>');
    expect(r.headers.get('content-security-policy')).toContain("script-src 'self'");
    expect((await fetch(`${s.url}/assets/missing.js`)).status).toBe(404);
  });
  it('folders the Vercel build deletes are not served from disk', async () => {
    const r = await fetch(`${s.url}/fx/latest.json`);
    expect(await r.text()).not.toContain('"stale"');   // proxied to GitHub (or 502 offline), never the local copy
  }, 20_000);
});

describe('problems, summary and Telegram', () => {
  const p = (o) => ({ page: '/ask', browser: 'webkit', ...o });
  it('one line per problem, browsers merged, asset hashes and ports ignored', () => {
    const g = groupProblems([
      p({ kind: 'csp', directive: 'script-src-elem', url: 'https://cdn.jsdelivr.net/npm/x/ort.mjs' }),
      p({ browser: 'chromium', kind: 'csp', url: 'https://cdn.jsdelivr.net/npm/x/ort.mjs', text: 'Refused…' }),
      p({ page: '/news', kind: 'http', status: 404, url: 'http://127.0.0.1:4100/assets/News-AbC12345.js' }),
      p({ page: '/news', browser: 'chromium', kind: 'http', status: 404, url: 'http://127.0.0.1:4999/assets/News-ZzZ98765.js' }),
    ]);
    expect(g).toHaveLength(2);
    expect(g[0].text).toBe('/ask on iPhone and desktop: the security policy (CSP script-src-elem) blocked cdn.jsdelivr.net/npm/x/ort.mjs');
    expect(g[1].text).toBe('/news on iPhone and desktop: got HTTP 404 for 127.0.0.1:4100/assets/News-AbC12345.js');
    expect(problemKey(p({ kind: 'pageerror', text: 'x at 12:34' }))).toBe(problemKey(p({ kind: 'pageerror', text: 'x at 56:78' })));
  });
  it('expected failures carry a reason', () => {
    expect(expectedReason({ kind: 'request', text: 'net::ERR_ABORTED' })).toMatch(/cancels/);
    expect(expectedReason({ kind: 'console', text: 'x', source: 'https://www.tradingview-widget.com/embed' })).toMatch(/TradingView/);
    expect(expectedReason({ kind: 'csp', url: 'https://s3.tradingview.com/x.js' })).toBeNull();   // a CSP block is ours
    expect(expectedReason({ kind: 'http', status: 404, url: 'http://x/a.js' })).toBeNull();
  });
  it('Telegram only when problems appear or all recover', () => {
    const g = groupProblems([p({ kind: 'ask-model', text: 'no available backend' })]);
    expect(decideNotify(null, [])).toMatchObject({ send: false });
    expect(decideNotify(null, g)).toMatchObject({ send: true, kind: 'fail' });
    const s1 = nextState(null, g, { base: 'https://raman-fx.vercel.app', now: '2026-11-12T13:40:00Z' });
    expect(decideNotify(s1, g)).toMatchObject({ send: false });              // same problem tomorrow: silent
    const g2 = groupProblems([p({ kind: 'ask-model', text: 'no available backend' }), p({ page: 'Lesson audio', kind: 'audio', text: 'streaming lesson course:1 failed at range 1 with HTTP 502' })]);
    expect(decideNotify(s1, g2)).toMatchObject({ send: true, kind: 'fail', fresh: [g2[1].key] });
    expect(decideNotify(s1, [])).toMatchObject({ send: true, kind: 'recover' });
    expect(nextState(s1, g2, { base: 'x', now: '2026-11-13T13:40:00Z' }).problems.map(q => q.since)).toEqual(['2026-11-12T13:40:00Z', '2026-11-13T13:40:00Z']);
  });
  it('message style: bold title · count, plain bullets, italic footer, HTML escaped', () => {
    const g = groupProblems([p({ kind: 'ask-model', text: 'a <b> tag' }), p({ page: 'Lesson audio', browser: undefined, kind: 'audio', text: 'the audio server answers HTTP 502' })]);
    const m = telegramMessage({ kind: 'fail', groups: g, fresh: g.map(x => x.key), base: 'https://raman-fx.vercel.app', runUrl: 'https://github.com/r/actions/runs/1' });
    const lines = m.split('\n');
    expect(lines[0]).toBe('<b>App check</b> · 2 problems');
    expect(lines[2]).toBe('• /ask on iPhone (Safari): the on-device search model could not load (a &lt;b&gt; tag)');
    expect(lines[3]).toBe('• Lesson audio: the audio server answers HTTP 502');
    expect(lines.at(-1)).toMatch(/^<i>Daily check of raman-fx\.vercel\.app.*<\/i>$/);
    const r = telegramMessage({ kind: 'recover', groups: [], prev: { problems: [{}, {}] }, base: 'https://raman-fx.vercel.app' });
    expect(r.split('\n')[0]).toBe('<b>App check</b> · all fixed');
  });
});
