// Accessibility gate: runs axe-core (WCAG 2.2 AA rules) on the main pages, in both themes.
// Usage: npm run build && npx vite preview --port 4173 & node scripts/a11y.mjs [journal-fixture.json]
// The optional fixture is a localStorage snapshot ({ key: value }) so data-heavy pages render.
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axe = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const data = process.argv[2] ? JSON.parse(readFileSync(process.argv[2], 'utf8')) : {};
const BASE = process.env.A11Y_URL ?? 'http://localhost:4173';
const ROUTES = ['/', '/trades', '/journal', '/calendar', '/reports', '/plan', '/risk', '/settings', '/design'];
const session = { access_token: 'x', refresh_token: 'y', expires_at: 1, user: { id: '00000000-0000-0000-0000-000000000001', email: 'a11y@test.dev' } };

const b = await chromium.launch();
let total = 0;
for (const theme of ['dark', 'light']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.route(/supabase\.co|tradingview|fonts\.g/, r => r.abort());
  await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, 'onLine', { get: () => false }));
  await ctx.addInitScript(([d, s, t]) => {
    try {
      sessionStorage.setItem('rfx_splashed', '1');
      for (const [k, v] of Object.entries(d)) localStorage.setItem(k, JSON.stringify(v));
      localStorage.setItem('ledger_theme', JSON.stringify(t));
      localStorage.setItem('sb-dqjzufofmblerslcynzr-auth-token', JSON.stringify(s));
    } catch { /* about:blank has no storage */ }
  }, [data, session, theme]);
  const p = await ctx.newPage();
  p.on('pageerror', e => console.log('page error:', e.message));
  for (const r of ROUTES) {
    await p.goto(BASE + r); await p.waitForFunction(() => document.querySelector('main')?.innerText.length > 20, null, { timeout: 15000 }); await p.waitForTimeout(1200);
    await p.addScriptTag({ content: axe });
    const res = await p.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'], resultTypes: ['violations'] })).violations
      .map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, help: v.help, eg: v.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary ?? '').split('\n').slice(1, 2).join('')) })));
    total += res.length;
    for (const v of res) console.log(`[${theme}] ${r}  ${v.impact}  ${v.id} ×${v.n} — ${v.help}\n    ${v.eg.join('\n    ')}`);
  }
  await ctx.close();
}
await b.close();
console.log(total ? `\n${total} violation group(s)` : 'No WCAG A/AA violations found');
process.exit(total ? 1 : 0);
