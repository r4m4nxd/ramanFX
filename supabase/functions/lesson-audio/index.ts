// Streams a pre-rendered lesson narration from the owner's Google Drive to signed-in app users.
// GET /functions/v1/lesson-audio?k=<source>:<n>&t=<supabase access token>   (Range supported, 4 MB per response)
// GET ...?list=<source>&t=...  -> {"<n>": {bytes}} of what is on Drive for that source.
// Only files inside the fixed "RamanFX Lesson Audio" source folders are reachable; ids never leave the server.
// Secrets: GOOGLE_REFRESH_TOKEN (rclone Drive OAuth refresh token). SUPABASE_URL / SUPABASE_ANON_KEY are built in.
const FOLDERS: Record<string, string> = {
  course: '1W0EIY0bicOg8hP62PFCjmfRBlk5ZDXS3', raja: '1AUMthud0dRk6k6lnRmRf_-2xHQ3N0cfo', zoom: '1dZLrMbCtCAKtii9v31yEcypV2GDWLl9-',
  baker: '1xFM5Yd2f3B_LHrEFyAY46S4pw_pztETg', daily: '1a32VKI-zXl0-hNcESFZmLo0eKcrS0kp2', seiden: '1I9PMI7Kh39-jf_PKpXgmHzGe51CkOCSJ',
};
const CID = '202264815644.apps.googleusercontent.com', CSEC = 'X4Z3ca8xfWDb1Voo-F9a7ZxJ'; // rclone's public client
const CHUNK = 4 * 1024 * 1024;
const ORIGINS = [/^https:\/\/raman-fx(-[a-z0-9-]+)?\.vercel\.app$/, /^http:\/\/localhost(:\d+)?$/];

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

async function signedIn(tok: string): Promise<boolean> {
  if (!tok) return false;
  const r = await fetch(`${Deno.env.get('SUPABASE_URL')}/auth/v1/user`, { headers: { apikey: Deno.env.get('SUPABASE_ANON_KEY')!, Authorization: `Bearer ${tok}` } });
  return r.ok;
}

Deno.serve(async (req) => {
  const h = cors(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: { ...h, 'Access-Control-Allow-Methods': 'GET, OPTIONS' } });
  const u = new URL(req.url);
  const tok = u.searchParams.get('t') ?? (req.headers.get('authorization') ?? '').replace(/^Bearer /, '');
  if (!(await signedIn(tok))) return new Response('sign in', { status: 401, headers: h });
  try {
    const list = u.searchParams.get('list');
    if (list) {
      if (!FOLDERS[list]) return new Response('unknown source', { status: 404, headers: h });
      const out: Record<number, { bytes: number; md5: string }> = {};
      for (const [n, f] of await folder(list)) out[n] = { bytes: f.size, md5: f.md5 };
      return Response.json(out, { headers: { ...h, 'Cache-Control': 'private, max-age=300' } });
    }
    const [src, ns] = (u.searchParams.get('k') ?? '').split(':');
    const f = FOLDERS[src] ? (await folder(src)).get(+ns) : undefined;
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
    return new Response(String((e as Error).message), { status: 500, headers: h });
  }
});
