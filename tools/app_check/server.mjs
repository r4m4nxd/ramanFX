// A tiny static server for dist/ that behaves like Vercel for this app: the SAME headers as vercel.json (incl. the
// Content-Security-Policy; `upgrade-insecure-requests` and HSTS dropped because it is plain http), the same rewrites
// (SPA fallback to index.html; /fx /scanner /movers ... JSON proxied to raw.githubusercontent.com like production),
// the folders the Vercel build deletes treated as absent, and correct MIME types (nosniff is on: a .mjs served as
// text/plain would fail exactly like on the phone).
//   node tools/app_check/server.mjs [--dir dist] [--port 4317]
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { headersFor, removedByBuild, rewriteFor } from './lib.mjs';

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.pdf': 'application/pdf', '.m4a': 'audio/mp4',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.bin': 'application/octet-stream', '.onnx': 'application/octet-stream',
  '.zip': 'application/zip', '.ex5': 'application/octet-stream', '.mq5': 'text/plain; charset=utf-8', '.csv': 'text/csv; charset=utf-8',
};

export function startServer({ dir = 'dist', vercelPath = 'vercel.json', port = 0, host = '127.0.0.1', log = () => {} } = {}) {
  const root = path.resolve(dir);
  const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  const removed = removedByBuild(vercel);
  const fileFor = p => {
    const rel = decodeURIComponent(p).replace(/^\/+/, '');
    if (removed.some(d => rel === d || rel.startsWith(`${d}/`))) return null;   // deleted by the Vercel build
    const f = path.join(root, rel);
    if (!f.startsWith(root)) return null;
    try {
      const st = fs.statSync(f);
      if (st.isFile()) return f;
      if (st.isDirectory() && fs.statSync(path.join(f, 'index.html')).isFile()) return path.join(f, 'index.html');
    } catch { /* not a file */ }
    return null;
  };
  const send = (res, status, headers, body) => { res.writeHead(status, headers); res.end(body); };

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    const hdr = headersFor(vercel, p, { http: true });
    try {
      // Vercel: the filesystem first, then the rewrites
      let file = fileFor(p);
      if (!file) {
        const dest = rewriteFor(vercel, p);
        if (dest && /^https?:\/\//.test(dest)) {
          try {
            const up = await fetch(dest, { signal: AbortSignal.timeout(15_000) });
            const body = Buffer.from(await up.arrayBuffer());
            log(`${req.method} ${p} -> ${dest} ${up.status}`);
            return send(res, up.status, { ...hdr, 'Content-Type': up.headers.get('content-type') ?? 'application/octet-stream' }, body);
          } catch (e) {
            log(`${req.method} ${p} -> ${dest} failed: ${e.message}`);
            return send(res, 502, { ...hdr, 'Content-Type': 'text/plain', 'X-App-Check-Upstream': 'failed' }, `upstream unreachable: ${e.message}`);
          }
        }
        if (dest) file = fileFor(dest);
      }
      if (!file) { log(`${req.method} ${p} 404`); return send(res, 404, { ...hdr, 'Content-Type': 'text/plain' }, 'not found'); }
      const type = MIME[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
      const body = fs.readFileSync(file);
      // index.html served for an app route: the headers are those of the requested path (as on Vercel)
      return send(res, 200, { ...hdr, 'Content-Type': type, 'Content-Length': body.length, 'Cache-Control': hdr['Cache-Control'] ?? 'no-cache' }, req.method === 'HEAD' ? undefined : body);
    } catch (e) {
      return send(res, 500, { 'Content-Type': 'text/plain' }, String(e));
    }
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve({ server, url: `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${server.address().port}`, close: () => new Promise(r => server.close(() => r())) }));
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i > 0 ? process.argv[i + 1] : d; };
  const s = await startServer({ dir: arg('dir', 'dist'), port: +arg('port', 4317), log: m => console.log(m) });
  console.log(`serving ${arg('dir', 'dist')} with the vercel.json headers at ${s.url}`);
}
