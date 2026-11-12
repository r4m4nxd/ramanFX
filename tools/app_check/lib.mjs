// App check: the pure parts (no browser, no network), unit-tested by tools/app_check/lib.test.mjs (npx vitest run).
//   - routes: every <Route path> of src/App.tsx (the paths; src/routes.tsx holds the lazy pages they render), with a
//     sample value for each :param route;
//   - vercel.json: the headers (incl. the Content-Security-Policy) and rewrites Vercel applies to a path, so the local
//     preview server sends exactly what production sends;
//   - problems: plain-English lines, grouped across browsers, a stable key per problem (asset hashes, numbers and
//     query strings stripped), the job summary, the Telegram message and when to send it (only on change).

// ---------------------------------------------------------------------------------------------------------- routes

/** A concrete URL for each route with a parameter. A new :param route without an entry here fails the unit test. */
export const ROUTE_SAMPLES = {
  '/trades/:id': '/trades/app-check-missing-trade',   // unknown id: the page must still render (a "not found" card)
  '/plan/:id': '/plan/app-check-missing-plan',
  '/scanner/:ticker': '/scanner/AAPL',
};

/** Every `<Route path="...">` in App.tsx, in source order, without the catch-all. */
export function parseRoutes(appTsx) {
  const out = [];
  for (const m of appTsx.matchAll(/<Route\s+[^>]*?path=["'{]+([^"'}]+)["'}]+/g)) if (m[1] !== '*' && !out.includes(m[1])) out.push(m[1]);
  return out;
}

/** Route path -> the URL path the check opens. Throws for a :param route with no sample (add it to ROUTE_SAMPLES). */
export function routeTargets(paths) {
  return paths.map(p => {
    if (!p.includes(':')) return { route: p, path: p };
    const s = ROUTE_SAMPLES[p];
    if (!s) throw new Error(`route ${p} has a parameter: add a sample URL for it to ROUTE_SAMPLES in tools/app_check/lib.mjs`);
    return { route: p, path: s };
  });
}

/** The first path segments the lazy-page prefetch map (BY_PATH in src/routes.tsx) knows. */
export function prefetchSegments(routesTsx) {
  const m = /const BY_PATH[^=]*=\s*\{([\s\S]*?)\};/.exec(routesTsx);
  if (!m) return [];
  return [...m[1].matchAll(/(?:'([^']+)'|([A-Za-z][\w-]*))\s*:/g)].map(x => x[1] ?? x[2]);
}

// ----------------------------------------------------------------------------------------------------- vercel.json

/** Vercel `source` patterns here are path-to-regexp strings written as plain regex groups ("/(.*)", "/((?!x).*)"). */
export function sourceRegex(source) {
  // ":name" segments (path-to-regexp params) -> one path segment; everything else is already a regex
  const re = source.replace(/:([A-Za-z_]\w*)(\([^)]*\))?/g, (_, _n, g) => g ?? '([^/]+)');
  return new RegExp(`^${re}$`);
}

/**
 * Headers Vercel sends for `pathname`: every matching block applies, a later block overrides a key set earlier.
 * `http: true` (the local preview server) drops CSP `upgrade-insecure-requests` and HSTS, which only make sense on https.
 */
export function headersFor(vercel, pathname, { http = false } = {}) {
  const out = {};
  for (const b of vercel.headers ?? []) {
    if (!sourceRegex(b.source).test(pathname)) continue;
    for (const h of b.headers) out[h.key] = h.value;
  }
  if (http) {
    delete out['Strict-Transport-Security'];
    if (out['Content-Security-Policy']) out['Content-Security-Policy'] = stripDirective(out['Content-Security-Policy'], 'upgrade-insecure-requests');
  }
  return out;
}

/** CSP string -> { directive: [values] } (lower-case directive names, order kept). */
export function parseCsp(csp) {
  const out = {};
  for (const part of csp.split(';')) {
    const [name, ...vals] = part.trim().split(/\s+/);
    if (name && !(name.toLowerCase() in out)) out[name.toLowerCase()] = vals;
  }
  return out;
}

export function stripDirective(csp, directive) {
  return csp.split(';').map(s => s.trim()).filter(s => s && s.split(/\s+/)[0].toLowerCase() !== directive).join('; ');
}

/** The first rewrite whose source matches, with $1.. filled in; null when none does. */
export function rewriteFor(vercel, pathname) {
  for (const r of vercel.rewrites ?? []) {
    const m = sourceRegex(r.source).exec(pathname);
    if (m) return r.destination.replace(/\$(\d+)/g, (_, i) => m[+i] ?? '');
  }
  return null;
}

/** dist/ folders the Vercel build deletes (buildCommand `rm -rf dist/x ...`): served by rewrites, never from files. */
export function removedByBuild(vercel) {
  return [...String(vercel.buildCommand ?? '').matchAll(/(?:^|\s)dist\/([\w.-]+)/g)].map(m => m[1]);
}

// --------------------------------------------------------------------------------------------------------- problems

export const BROWSERS = {
  webkit: 'iPhone (Safari)',
  chromium: 'desktop Chrome',
};

/**
 * Failures the check expects and ignores, each with the reason. `match(p)` gets a raw problem
 * { kind, page, browser, url?, text?, status? }.
 */
export const EXPECTED = [
  { why: 'the browser cancels requests it no longer needs (navigation, a superseded lazy load, media preload)',
    match: p => p.kind === 'request' && /ERR_ABORTED|cancelled|Load request cancelled|NS_BINDING_ABORTED/i.test(p.text ?? '') },
  { why: 'TradingView widgets (third-party iframes) log their own errors; their failures are not ours',
    match: p => /tradingview(-widget)?\.com/i.test(`${p.url ?? ''} ${p.source ?? ''}`) && p.kind !== 'csp' },
  { why: 'analytics / telemetry pings that browsers and ad blockers drop are not app problems',
    match: p => /google-analytics|googletagmanager|telemetry\./i.test(p.url ?? '') },
  { why: 'console noise duplicated by the request / CSP collectors (same failure, already reported once)',
    match: p => p.kind === 'console' && /^Failed to load resource|^\[Report Only\]/i.test(p.text ?? '') },
  { why: 'the preview server proxies /fx /scanner ... data to raw.githubusercontent.com; offline that is not an app bug',
    match: p => p.mode === 'preview' && p.upstream === 'failed' },
];

export const expectedReason = p => EXPECTED.find(e => e.match(p))?.why ?? null;

const short = (u, max = 90) => {
  if (!u) return '';
  let s = u;
  try { const x = new URL(u); s = `${x.host}${x.pathname}`; } catch { /* not a URL */ }
  return s.length > max ? `${s.slice(0, max - 1)}…` : s;
};
const clip = (s, n = 160) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > n ? `${t.slice(0, n - 1)}…` : t; };

/** The plain-English "what broke" for one problem (without the page / browser). */
export function describe(p) {
  switch (p.kind) {
    case 'pageerror': return `a script crashed: ${clip(p.text)}`;
    case 'console': return `logged an error: ${clip(p.text)}`;
    case 'request': return `could not load ${short(p.url)} (${clip(p.text, 60)})`;
    case 'http': return `got HTTP ${p.status} for ${short(p.url)}`;
    case 'csp': return `the security policy (CSP${p.directive ? ` ${p.directive}` : ''}) blocked ${p.url ? short(p.url) : clip(p.text, 100) || 'a resource'}`;
    case 'blank': return `showed a blank page${p.text ? ` (${clip(p.text, 80)})` : ''}`;
    case 'nav': return `did not open: ${clip(p.text)}`;
    case 'module': return `could not import our own module ${short(p.url)}: ${clip(p.text, 100)}`;
    case 'ask-model': return `the on-device search model could not load (${clip(p.text, 120)})`;
    case 'ask-timeout': return `the search model was still not ready after ${p.text}`;
    case 'audio': return clip(p.text, 200);
    case 'setup': return clip(p.text, 200);
    default: return clip(p.text);
  }
}

/** A stable identity for "the same problem": hashes, numbers, query strings and ports removed. */
export function problemKey(p) {
  const norm = s => String(s ?? '')
    .replace(/https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/g, '')
    .replace(/[?#][^\s)'"]*/g, '')
    .replace(/-[A-Za-z0-9_-]{8}\.(m?js|css|wasm)/g, '-*.$1')
    .replace(/\d+/g, '#')
    .slice(0, 160);
  // a CSP block is reported up to three ways (the event, the console line, the failed request): one problem per URL
  if (p.kind === 'csp') return [p.page, p.kind, '', norm(p.url || p.text)].join('|');
  return [p.page, p.kind, norm(p.directive), norm(p.url), p.kind === 'http' ? p.status : '', norm(p.kind === 'request' ? '' : p.text)].join('|');
}

/** Same page + same problem in several browsers -> one line naming the browsers. */
export function groupProblems(problems) {
  const by = new Map();
  for (const p of problems) {
    const k = problemKey(p);
    const g = by.get(k) ?? { key: k, page: p.page, browsers: [], what: describe(p), sample: p };
    if (p.kind === 'csp' && p.directive && !g.sample.directive) Object.assign(g, { what: describe(p), sample: p });   // name the directive
    if (p.browser && !g.browsers.includes(p.browser)) g.browsers.push(p.browser);
    by.set(k, g);
  }
  return [...by.values()].map(g => ({ ...g, text: lineFor(g) }));
}

function lineFor(g) {
  const where = g.browsers.length === 2 ? 'on iPhone and desktop' : g.browsers.length === 1 ? `on ${BROWSERS[g.browsers[0]] ?? g.browsers[0]}` : '';
  return `${g.page}${where ? ` ${where}` : ''}: ${g.what}`;
}

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Markdown for $GITHUB_STEP_SUMMARY. */
export function summaryMarkdown({ mode, base, groups, skipped = [], expected = 0, pages = 0, browsers = [], auth = '' }) {
  const head = groups.length ? `### App check (${mode}): ${groups.length} problem${groups.length > 1 ? 's' : ''}` : `### App check (${mode}): all good`;
  const lines = [head, '', `${base} · ${pages} pages · ${browsers.map(b => BROWSERS[b] ?? b).join(' + ')}${auth ? ` · ${auth}` : ''}`, ''];
  for (const g of groups) lines.push(`- ${g.text}`);
  if (skipped.length) { lines.push('', '**Skipped**'); for (const s of skipped) lines.push(`- ${s}`); }
  if (expected) lines.push('', `_${expected} expected failures ignored (see EXPECTED in tools/app_check/lib.mjs)._`);
  return lines.join('\n') + '\n';
}

/**
 * Telegram only when something changed: a problem that was not there last time (or the first run that fails), or
 * everything fixed after a failing run. The same problems again tomorrow: silent (the job summary still lists them).
 * Returns { send, kind: 'fail' | 'recover' | null, fresh: [keys] }.
 */
export function decideNotify(prev, groups) {
  const before = new Set((prev?.problems ?? []).map(p => p.key));
  const fresh = groups.map(g => g.key).filter(k => !before.has(k));
  if (groups.length && fresh.length) return { send: true, kind: 'fail', fresh };
  if (!groups.length && before.size) return { send: true, kind: 'recover', fresh: [] };
  return { send: false, kind: null, fresh };
}

const MAX_BULLETS = 10;
/** '<b>App check</b> · 2 problems' + plain-English bullets + an italic footer (HTML parse mode). */
export function telegramMessage({ kind, groups, fresh = [], prev, base, runUrl }) {
  const host = (() => { try { return new URL(base).host; } catch { return base; } })();
  const foot = `<i>Daily check of ${esc(host)} on iPhone and desktop${runUrl ? ` · <a href="${esc(runUrl)}">details</a>` : ''}</i>`;
  if (kind === 'recover') {
    const n = prev?.problems?.length ?? 0;
    return [`<b>App check</b> · all fixed`, '', `The ${n === 1 ? 'problem' : `${n} problems`} from the last check ${n === 1 ? 'is' : 'are'} gone; every page opens cleanly again.`, '', foot].join('\n');
  }
  const n = groups.length;
  const out = [`<b>App check</b> · ${n} problem${n > 1 ? 's' : ''}`, ''];
  const freshSet = new Set(fresh);
  for (const g of groups.slice(0, MAX_BULLETS)) out.push(`• ${esc(g.text)}${freshSet.size < n && freshSet.has(g.key) ? ' <i>(new)</i>' : ''}`);
  if (n > MAX_BULLETS) out.push(`• …and ${n - MAX_BULLETS} more`);
  out.push('', foot);
  return out.join('\n').slice(0, 4000);
}

/** The state file (public/health/app_check.json on the data branch): problems now, and since when each one exists. */
export function nextState(prev, groups, { base, now = new Date().toISOString() } = {}) {
  const since = Object.fromEntries((prev?.problems ?? []).map(p => [p.key, p.since]));
  return {
    checked_at: now,
    base,
    ok: groups.length === 0,
    problems: groups.map(g => ({ key: g.key, text: g.text, since: since[g.key] ?? now })),
  };
}
