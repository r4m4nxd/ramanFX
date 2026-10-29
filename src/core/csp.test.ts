import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

// vercel.json pins the inline theme script in index.html by hash: editing one without the other blanks that script.
describe('Content-Security-Policy', () => {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8')) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
  const csp = vercel.headers.flatMap(b => b.headers.filter(h => h.key === 'Content-Security-Policy').map(h => ({ source: b.source, value: h.value })));
  const app = csp.find(c => c.source !== '/legacy.html')!.value;

  it('allows exactly the inline scripts in index.html', () => {
    const html = readFileSync('index.html', 'utf8');
    const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
    expect(inline.length).toBeGreaterThan(0);
    for (const s of inline) expect(app).toContain(`'sha256-${createHash('sha256').update(s).digest('base64')}'`);
  });

  it('never allows inline or eval scripts in the app', () => {
    const script = app.split(';').find(d => d.trim().startsWith('script-src'))!;
    expect(script).not.toContain("'unsafe-inline'");
    expect(script).not.toContain("'unsafe-eval'");
    expect(app).toContain("object-src 'none'");
  });

  it('lets Telegram Web frame the app as a Mini App (not legacy.html)', () => {
    const fa = (v: string) => v.split(';').map(d => d.trim()).find(d => d.startsWith('frame-ancestors'))!;
    expect(fa(app)).toBe("frame-ancestors 'self' https://web.telegram.org");
    const legacy = csp.find(c => c.source === '/legacy.html')!.value;
    expect(fa(legacy)).toBe("frame-ancestors 'self'");
    const xfo = vercel.headers.filter(b => b.headers.some(h => h.key === 'X-Frame-Options')).map(b => b.source);
    expect(xfo).toEqual(['/legacy.html']);   // a site-wide X-Frame-Options would block the Mini App
  });
});
