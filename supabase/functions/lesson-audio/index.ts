// Streams a pre-rendered lesson narration from the owner's Google Drive to the app's allowed users only.
// GET /functions/v1/lesson-audio?k=<source>:<n>      Authorization: Bearer <access token>   (Range, 4 MB per response)
// GET ...?list=<source>                              Authorization: Bearer ...  -> {"<n>": {bytes, md5}}
// GET ...?sign=<source>:<n>                          Authorization: Bearer ...  -> a signed query for an <audio> element:
//     {query: 'k=<key>&e=<expiry>&s=<HMAC>'}, valid 6 h for that one file (no access token in URLs, history or logs).
// Only files inside the fixed "RamanFX Lesson Audio" source folders are reachable; ids never leave the server.
// Secrets: GOOGLE_REFRESH_TOKEN (rclone Drive OAuth refresh token); optional ALLOWED_USERS (comma-separated auth
// user ids, default: the owner). SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are built in.
const FOLDERS: Record<string, string> = {
  course: '1W0EIY0bicOg8hP62PFCjmfRBlk5ZDXS3', raja: '1AUMthud0dRk6k6lnRmRf_-2xHQ3N0cfo', zoom: '1dZLrMbCtCAKtii9v31yEcypV2GDWLl9-',
  baker: '1xFM5Yd2f3B_LHrEFyAY46S4pw_pztETg', daily: '1a32VKI-zXl0-hNcESFZmLo0eKcrS0kp2', seiden: '1I9PMI7Kh39-jf_PKpXgmHzGe51CkOCSJ',
};
const CID = '202264815644.apps.googleusercontent.com', CSEC = 'X4Z3ca8xfWDb1Voo-F9a7ZxJ'; // rclone's public client
const CHUNK = 4 * 1024 * 1024;
const ORIGINS = [/^https:\/\/raman-fx\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];
const OWNER = '67967f02-d6fb-45f1-9edf-d14c3d3fcf12';
const ALLOWED = new Set((Deno.env.get('ALLOWED_USERS') || OWNER).split(',').map(x => x.trim()).filter(Boolean));
const SIGN_TTL = 6 * 3600;
const known = (src: string) => Object.hasOwn(FOLDERS, src);

const cors = (req: Request) => {
  const o = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.some(r => r.test(o)) ? o : 'https://raman-fx.vercel.app',
    'Access-Control-Allow-Headers': 'authorization, range, apikey, x-client-info',
    'Access-Control-Expose-Headers': 'content-range, content-length, accept-ranges, x-text-hash',
    Vary: 'Origin',
  };
};

let gTok: { v: string; exp: number } | null = null;
async function google(): Promise<string> {
  if (gTok && gTok.exp > Date.now() + 60_000) return gTok.v;
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    body: new URLSearchParams({ client_id: CID, client_secret: CSEC, grant_type: 'refresh_token', refresh_token: Deno.env.get('GOOGLE_REFRESH_TOKEN') ?? '' }),
  });
  const j = await r.json();
  if (!j.access_token) throw new Error('drive auth failed');
  gTok = { v: j.access_token, exp: Date.now() + j.expires_in * 1000 };
  return gTok.v;
}

type F = { id: string; size: number; md5: string };
const lists = new Map<string, { at: number; files: Map<number, F> }>();
async function folder(src: string): Promise<Map<number, F>> {
  const c = lists.get(src);
  if (c && Date.now() - c.at < 10 * 60_000) return c.files;
  const files = new Map<number, F>();
  let page = '';
  do {
    const q = new URLSearchParams({ q: `'${FOLDERS[src]}' in parents and trashed=false`, fields: 'nextPageToken,files(id,name,size,md5Checksum)', pageSize: '1000' });
    if (page) q.set('pageToken', page);
    const j = await (await fetch(`https://www.googleapis.com/drive/v3/files?${q}`, { headers: { Authorization: `Bearer ${await google()}` } })).json();
    for (const f of j.files ?? []) {
      const m = /^(\d+) - .*\.m4a$/.exec(f.name);
      if (m) files.set(+m[1], { id: f.id, size: +f.size, md5: f.md5Checksum });
    }
    page = j.nextPageToken ?? '';
  } while (page);
  lists.set(src, { at: Date.now(), files });
  return files;
}

/** A signed-in user on the allowlist (any other account on this Supabase project is refused). */
async function allowed(tok: string): Promise<boolean> {
  if (!tok) return false;
  const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: Deno.env.get('SUPABASE_ANON_KEY')!, Authorization: `Bearer ${tok}` } });
  if (!r.ok) return false;
  const u = await r.json().catch(() => null);
  return !!u?.id && ALLOWED.has(u.id);
}

let hmacKey: Promise<CryptoKey> | null = null;
const key = () => (hmacKey ??= crypto.subtle.importKey('raw', new TextEncoder().encode('lesson-audio:' + Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')),
  { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']));
const hex = (b: ArrayBuffer) => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
const sig = async (k: string, e: number) => hex(await crypto.subtle.sign('HMAC', await key(), new TextEncoder().encode(`${k}|${e}`)));
async function validSig(k: string, e: string, s: string): Promise<boolean> {
  const exp = +e;
  if (!Number.isInteger(exp) || exp < Date.now() / 1000 || exp > Date.now() / 1000 + SIGN_TTL + 60 || !/^[0-9a-f]{64}$/.test(s)) return false;
  const want = await sig(k, exp);
  let d = 0;
  for (let i = 0; i < 64; i++) d |= want.charCodeAt(i) ^ s.charCodeAt(i);
  return d === 0;
}

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: { ...h, 'Access-Control-Allow-Methods': 'GET, OPTIONS' } });
  const u = new URL(req.url);
  const k = u.searchParams.get('k') ?? '';
  // a signed link streams its one file only; signing new links and listing always need the allowed user's token
  const fileOnly = !u.searchParams.has('sign') && !u.searchParams.has('list');
  const signedOk = fileOnly && !!k && await validSig(k, u.searchParams.get('e') ?? '', u.searchParams.get('s') ?? '');
  if (!signedOk && !(await allowed((req.headers.get('authorization') ?? '').replace(/^Bearer /, '')))) return new Response('sign in', { status: 401, headers: h });
  try {
    const toSign = u.searchParams.get('sign');
    if (toSign) {
      if (!known(toSign.split(':')[0])) return new Response('unknown source', { status: 404, headers: h });
      const e = Math.floor(Date.now() / 1000) + SIGN_TTL;
      // the query only: behind the gateway req.url is not the public URL, so the app prefixes its own function URL
      const query = String(new URLSearchParams({ k: toSign, e: String(e), s: await sig(toSign, e) }));
      return Response.json({ query, expires: e }, { headers: { ...h, 'Cache-Control': 'no-store' } });
    }
    const list = u.searchParams.get('list');
    if (list) {
      if (!known(list)) return new Response('unknown source', { status: 404, headers: h });
      const out: Record<number, { bytes: number; md5: string }> = {};
      for (const [n, f] of await folder(list)) out[n] = { bytes: f.size, md5: f.md5 };
      return Response.json(out, { headers: { ...h, 'Cache-Control': 'private, max-age=300' } });
    }
    const [src, ns] = k.split(':');
    const f = known(src) ? (await folder(src)).get(+ns) : undefined;
    if (!f) return new Response('not found', { status: 404, headers: h });
    const m = /bytes=(\d*)-(\d*)/.exec(req.headers.get('range') ?? '');
    let a = m && m[1] ? +m[1] : 0;
    let b = m && m[2] ? +m[2] : f.size - 1;
    if (m && !m[1] && m[2]) { a = Math.max(0, f.size - +m[2]); b = f.size - 1; }
    if (a >= f.size) return new Response(null, { status: 416, headers: { ...h, 'Content-Range': `bytes */${f.size}` } });
    b = Math.min(b, a + CHUNK - 1, f.size - 1);
    const d = await fetch(`https://www.googleapis.com/drive/v3/files/${f.id}?alt=media`, { headers: { Authorization: `Bearer ${await google()}`, Range: `bytes=${a}-${b}` } });
    if (!d.ok) return new Response('drive ' + d.status, { status: 502, headers: h });
    return new Response(d.body, {
      status: 206,
      headers: { ...h, 'Content-Type': 'audio/mp4', 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${a}-${b}/${f.size}`,
        'Content-Length': String(b - a + 1), 'Cache-Control': 'private, max-age=86400', 'X-Text-Hash': f.md5 },
    });
  } catch (e) {
    console.error(e);
    return new Response('server error', { status: 500, headers: h });
  }
});
