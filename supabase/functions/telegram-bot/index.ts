// RamanFX Telegram bot webhook (two-way commands). Telegram POSTs each update here; the reply goes back IN THE HTTP
// RESPONSE BODY ({"method":"sendMessage", ...}), so this function never holds the bot token.
//
// Auth (set up by .github/workflows/telegram-webhook.yml, which owns the bot token and chat id):
//   - header X-Telegram-Bot-Api-Secret-Token = S, where S = HMAC-SHA256(bot token, "ramanfx-webhook:<label>") (hex);
//   - query ?o=<sha256 hex of TELEGRAM_CHAT_ID>.
//   public.rfx_bot_config (one row, service role only) holds sha256(S) and o. Trust on first use, inside a window:
//   while rotate_until > now() and the hashes are empty, the first request (the setup workflow's own ping, sent before
//   setWebhook) stores sha256(S) + o and closes the window. Afterwards any other S or o is refused (401), and a message
//   whose sha256(chat.id) != o is ignored (200, no reply). To rotate S: in the SQL editor run
//     update public.rfx_bot_config set rotate_until = now() + interval '15 minutes' where id = 1;
//   then run the workflow with a new label: its ping (same o, new S) replaces the hash and closes the window.
// Data: the public scanner files (raman-fx.vercel.app, raw GitHub as fallback), cached 60 s per instance.
// Optional secret GITHUB_DISPATCH_TOKEN (fine-grained, Actions: write on r4m4nxd/ramanFX) turns /scan on.
// Optional secret TELEGRAM_BOT_TOKEN: only used to answerCallbackQuery (stops the button spinner at once); everything
// else still goes back in the webhook response, so buttons work without it.
// Inline buttons (callback_query) are checked like messages: sha256(from.id) must equal o.
// Charts: GET ?img=SYM&tf=Q|MN|W1|D1|H4|H1|3M&v=<scan time> renders a PNG from the PUBLIC scanner files only (no
// secret needed: Telegram fetches it for sendPhoto); SVG (chart.ts) -> resvg-wasm with an Inter subset font; cached
// per symbol / view / scan version, at most 30 renders a minute per instance.
// Logs: the command name and timing only, never message text, chat ids or secrets.
import { initWasm, Resvg } from 'npm:@resvg/resvg-wasm@2.6.2';
import { renderSvg } from './chart.ts';
import { chartData, handle, handleCallback, MAIN_KEYBOARD, type Reply } from './logic.ts';

const SB_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const GH_TOKEN = Deno.env.get('GITHUB_DISPATCH_TOKEN') ?? '';
const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') ?? '';
const FN_URL = 'https://dqjzufofmblerslcynzr.supabase.co/functions/v1/telegram-bot';
const WASM = 'https://cdn.jsdelivr.net/npm/@resvg/resvg-wasm@2.6.2/index_bg.wasm';
const FONTS = [
  [`${'https://raw.githubusercontent.com/r4m4nxd/ramanFX/main/'}tools/telegram_bot/fonts/Inter-400Regular-subset.ttf`, 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.4.2/400Regular/Inter_400Regular.ttf'],
  [`${'https://raw.githubusercontent.com/r4m4nxd/ramanFX/main/'}tools/telegram_bot/fonts/Inter-600SemiBold-subset.ttf`, 'https://cdn.jsdelivr.net/npm/@expo-google-fonts/inter@0.4.2/600SemiBold/Inter_600SemiBold.ttf'],
];
const REPO = 'r4m4nxd/ramanFX';
const SITE = 'https://raman-fx.vercel.app/';
const RAW = 'https://raw.githubusercontent.com/r4m4nxd/ramanFX/main/';
const REST = `${SB_URL}/rest/v1/rfx_bot_config`;
const TTL = 60_000;

const dbHeaders = (): Record<string, string> => ({
  apikey: SB_KEY, 'Content-Type': 'application/json',
  ...(SB_KEY.startsWith('eyJ') ? { Authorization: `Bearer ${SB_KEY}` } : {}),
});

async function sha(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
function same(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

// ---- config row ----------------------------------------------------------------------------------------------------
interface Cfg { secret_hash: string; owner_hash: string; rotate_until: string | null; pinned_message_id: number | null; commands_hash: string | null }
let cfgCache: { v: Cfg; t: number } | null = null;

async function getCfg(): Promise<Cfg | null> {
  const r = await fetch(`${REST}?id=eq.1&select=secret_hash,owner_hash,rotate_until,pinned_message_id,commands_hash`, { headers: dbHeaders() });
  if (!r.ok) throw new Error(`config read ${r.status}`);
  const rows = await r.json();
  return Array.isArray(rows) && rows[0] ? rows[0] as Cfg : null;
}
/** PATCH the row (filter: extra PostgREST conditions, e.g. '&secret_hash=is.null'); true when a row changed. */
async function patchCfg(fields: Record<string, unknown>, filter = ''): Promise<boolean> {
  const r = await fetch(`${REST}?id=eq.1${filter}`, { method: 'PATCH', headers: { ...dbHeaders(), Prefer: 'return=representation' }, body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }) });
  if (!r.ok) throw new Error(`config write ${r.status}`);
  cfgCache = null;
  const rows = await r.json();
  return Array.isArray(rows) && rows.length === 1;
}

type AuthState = 'ok' | 'claimed' | 'rotated' | 'deny';
async function authorize(secret: string, o: string): Promise<AuthState> {
  if (!/^[A-Za-z0-9_-]{32,256}$/.test(secret) || !/^[0-9a-f]{64}$/.test(o)) return 'deny';
  const sh = await sha(secret);
  if (cfgCache && Date.now() - cfgCache.t < TTL && same(cfgCache.v.secret_hash, sh) && same(cfgCache.v.owner_hash, o)) return 'ok';
  let cfg = await getCfg();
  if (!cfg) return 'deny';                       // no row: the bot is not set up
  const open = !!cfg.rotate_until && Date.parse(cfg.rotate_until) > Date.now();
  let state: AuthState = 'ok';
  if (!cfg.secret_hash || !cfg.owner_hash) {     // first claim: only inside the window opened with SQL
    if (!open) return 'deny';
    if (!await patchCfg({ secret_hash: sh, owner_hash: o, rotate_until: null }, `&secret_hash=is.null&rotate_until=gt.${encodeURIComponent(new Date().toISOString())}`)) return 'deny';
    cfg = { ...cfg, secret_hash: sh, owner_hash: o, rotate_until: null };
    state = 'claimed';
  } else if (!same(cfg.owner_hash, o)) {
    return 'deny';
  } else if (!same(cfg.secret_hash, sh)) {       // rotation: a new S for the same owner, only inside the window
    if (!open) return 'deny';
    if (!await patchCfg({ secret_hash: sh, rotate_until: null }, `&rotate_until=gt.${encodeURIComponent(new Date().toISOString())}`)) return 'deny';
    cfg = { ...cfg, secret_hash: sh, rotate_until: null };
    state = 'rotated';
  }
  cfgCache = { v: cfg, t: Date.now() };
  return state;
}

// ---- data (public files, 60 s cache) ------------------------------------------------------------------------------
const cache = new Map<string, { t: number; v: Promise<unknown> }>();
async function getJson(url: string): Promise<unknown> {
  const r = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (!r.ok) { await r.body?.cancel(); return null; }
  const t = await r.text();
  try { return JSON.parse(t); } catch { return null; }
}
const TV_CAL = 'https://economic-calendar.tradingview.com/events';
async function tvCalendar(): Promise<unknown> {
  const d = new Date();
  const day = (k: number) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + k)).toISOString();
  const r = await fetch(`${TV_CAL}?from=${day(-1)}&to=${day(2)}&countries=US,EU,GB,JP,AU,NZ,CA,CH,CN`, {
    headers: { Accept: 'application/json', Origin: 'https://www.tradingview.com', Referer: 'https://www.tradingview.com/', 'User-Agent': 'Mozilla/5.0 (compatible; RamanFX-bot/1.0)' },
    signal: AbortSignal.timeout(8000) });
  if (!r.ok) { await r.body?.cancel(); return null; }
  try { return await r.json(); } catch { return null; }
}
// Longer caches: the calendar (15 min; TradingView rate-limits) and the 2.5 MB lesson passages (6 h; the BM25 index is
// rebuilt only when this object changes). A failed load (null) is kept for TTL only, then retried.
const TTL_OF: Record<string, number> = { 'news.json': 15 * 60_000, 'ask/passages.json': 6 * 3600_000 };
function remember(path: string, v: Promise<unknown>): void {
  const e = { t: Date.now(), v };
  cache.set(path, e);
  const long = TTL_OF[path];
  if (long) v.then(x => { if (x == null) e.t -= long - TTL; }, () => {});
}
function load(path: string): Promise<unknown> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.t < (TTL_OF[path] ?? TTL)) return hit.v;
  if (path === 'news.json') {
    const v = tvCalendar().catch(() => null);
    remember(path, v);
    return v;
  }
  const urls = path === 'events.json' ? [`${RAW}tools/reminders/events.json`] : [`${SITE}${path}`, `${RAW}public/${path}`];
  const v = (async () => {
    for (const u of urls) {
      try { const j = await getJson(u); if (j != null) return j; } catch { /* next source */ }
    }
    return null;
  })();
  remember(path, v);
  if (cache.size > 120) cache.delete(cache.keys().next().value as string);
  return v;
}

// ---- /scan (only with GITHUB_DISPATCH_TOKEN) -----------------------------------------------------------------------
let lastScan = 0;
async function dispatchScans(): Promise<boolean> {
  if (Date.now() - lastScan < 10 * 60_000) return true;   // one dispatch per 10 min; a repeat just says "started"
  const go = (wf: string) => fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${wf}/dispatches`, {
    method: 'POST', body: JSON.stringify({ ref: 'main' }),
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ramanfx-bot' },
  }).then(r => r.status === 204).catch(() => false);
  const [a, b] = await Promise.all([go('fx-scan.yml'), go('stock-scan.yml')]);
  if (a || b) lastScan = Date.now();
  return a || b;
}

// ---- charts (PNG) ------------------------------------------------------------------------------------------------
let wasmReady: Promise<void> | null = null;
let fontBufs: Promise<Uint8Array[]> | null = null;
async function fetchBytes(urls: string[]): Promise<Uint8Array> {
  for (const u of urls) {
    try { const r = await fetch(u, { signal: AbortSignal.timeout(8000) }); if (r.ok) return new Uint8Array(await r.arrayBuffer()); await r.body?.cancel(); } catch { /* next */ }
  }
  throw new Error('font fetch failed');
}
const pngCache = new Map<string, Uint8Array>();
let renders: number[] = [];
const imageUrl = (sym: string, view: string, v: string) => `${FN_URL}?img=${encodeURIComponent(sym)}&tf=${encodeURIComponent(view)}&v=${encodeURIComponent(v)}`;

async function chartPng(url: URL): Promise<Response> {
  const sym = (url.searchParams.get('img') ?? '').slice(0, 20), view = (url.searchParams.get('tf') ?? 'Q').toUpperCase();
  if (!/^[A-Za-z0-9._-]{1,20}$/.test(sym) || !/^(Q|MN|W1|D1|H4|H1|3M)$/.test(view)) return empty(400);
  const cd = await chartData(sym, view, { load, now: new Date() });
  if (!cd) return empty(404);
  const key = `${cd.sym}|${view}|${cd.v}`;
  let png = pngCache.get(key);
  if (!png) {
    const now = Date.now();
    renders = renders.filter(t => now - t < 60_000);
    if (renders.length >= 30) return empty(429);
    renders.push(now);
    wasmReady ??= initWasm(fetch(WASM));
    fontBufs ??= Promise.all(FONTS.map(fetchBytes));
    try { await wasmReady; } catch (e) { wasmReady = null; throw e; }
    let fonts: Uint8Array[];
    try { fonts = await fontBufs; } catch (e) { fontBufs = null; throw e; }
    png = new Resvg(renderSvg(cd.model), { font: { fontBuffers: fonts, defaultFontFamily: 'Inter', loadSystemFonts: false } }).render().asPng();
    pngCache.set(key, png);
    if (pngCache.size > 40) pngCache.delete(pngCache.keys().next().value as string);
    console.log(JSON.stringify({ ev: 'img', view, ms: Date.now() - now }));
  }
  return new Response(png, { headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=3600' } });
}

// ---- replies -------------------------------------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function method(reply: Reply, chatId: unknown, tapped?: Record<string, any>): Record<string, unknown> {
  const markup = reply.keyboard ? MAIN_KEYBOARD : reply.buttons?.length ? { inline_keyboard: reply.buttons } : undefined;
  if (reply.photo && reply.edit && tapped && Array.isArray(tapped.photo)) {
    return { method: 'editMessageMedia', chat_id: chatId, message_id: tapped.message_id,
      media: { type: 'photo', media: reply.photo, caption: reply.text.slice(0, 1024), parse_mode: 'HTML' }, ...(markup ? { reply_markup: markup } : {}) };
  }
  if (reply.photo) return { method: 'sendPhoto', chat_id: chatId, photo: reply.photo, caption: reply.text.slice(0, 1024), parse_mode: 'HTML', ...(markup ? { reply_markup: markup } : {}) };
  return { method: 'sendMessage', chat_id: chatId, text: reply.text, parse_mode: 'HTML', disable_web_page_preview: true, ...(markup ? { reply_markup: markup } : {}) };
}
async function answerCallback(id: string): Promise<void> {
  if (!BOT_TOKEN || !id) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: id }), signal: AbortSignal.timeout(2500) }).then(r => r.body?.cancel());
  } catch { /* the spinner times out by itself */ }
}

// ---- handler -------------------------------------------------------------------------------------------------------
const json = (v: unknown, status = 200) => new Response(JSON.stringify(v), { status, headers: { 'Content-Type': 'application/json' } });
const empty = (status = 200) => new Response(null, { status });

Deno.serve(async (req: Request) => {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    if (!url.searchParams.has('img')) return empty(404);
    try { return await chartPng(url); } catch (e) { console.log(JSON.stringify({ ev: 'img_error', err: (e as Error).message.slice(0, 80) })); return empty(503); }
  }
  if (req.method !== 'POST') return empty(405);
  const t0 = Date.now();
  const o = new URL(req.url).searchParams.get('o') ?? '';
  const secret = req.headers.get('x-telegram-bot-api-secret-token') ?? '';
  let state: AuthState;
  try {
    state = await authorize(secret, o);
  } catch (e) {
    console.log(JSON.stringify({ ev: 'auth_error', err: (e as Error).message }));
    return empty(503);
  }
  if (state === 'deny') { console.log(JSON.stringify({ ev: 'denied' })); return empty(401); }
  if (state !== 'ok') console.log(JSON.stringify({ ev: state }));

  let upd: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  try { upd = await req.json(); } catch { return empty(200); }

  // Setup workflow bookkeeping: which list message is pinned (so a re-run replaces the pin instead of stacking).
  const setup = upd?.rfx_setup;
  if (setup && typeof setup === 'object') {
    const cfg = await getCfg();
    if (setup.op === 'swap' && Number.isInteger(setup.pinned)) {
      await patchCfg({ pinned_message_id: setup.pinned, commands_hash: typeof setup.hash === 'string' ? setup.hash.slice(0, 64) : null });
    }
    return json({ ok: true, auth: state, pinned: cfg?.pinned_message_id ?? null, hash: cfg?.commands_hash ?? null });
  }

  const ctx = { load, now: new Date(), dispatch: GH_TOKEN ? dispatchScans : undefined, imageUrl };
  const cq = upd?.callback_query;
  if (cq && typeof cq === 'object') {
    const fromId = cq.from?.id;
    if ((typeof fromId !== 'number' && typeof fromId !== 'string') || !same(await sha(String(fromId)), o)) { console.log(JSON.stringify({ ev: 'other_chat' })); return empty(200); }
    const chat = cq.message?.chat?.id ?? fromId;
    const answered = answerCallback(String(cq.id ?? ''));
    let reply: Reply;
    try {
      reply = await handleCallback(String(cq.data ?? '').slice(0, 64), ctx);
    } catch (e) {
      console.log(JSON.stringify({ ev: 'cmd_error', err: (e as Error).name }));
      reply = { cmd: 'error', text: '⚠️ Something went wrong reading the scanner data. Try again in a minute.' };
    }
    await answered;
    console.log(JSON.stringify({ ev: 'tap', cmd: reply.cmd, ms: Date.now() - t0 }));
    return json(method(reply, chat, cq.message));
  }

  const msg = upd?.message;
  const text = typeof msg?.text === 'string' ? msg.text : '';
  const chatId = msg?.chat?.id;
  if (!text || (typeof chatId !== 'number' && typeof chatId !== 'string')) return empty(200);
  if (!same(await sha(String(chatId)), o)) { console.log(JSON.stringify({ ev: 'other_chat' })); return empty(200); }

  let reply: Reply;
  try {
    reply = await handle(text.slice(0, 200), ctx);
  } catch (e) {
    console.log(JSON.stringify({ ev: 'cmd_error', err: (e as Error).name }));
    reply = { cmd: 'error', text: '⚠️ Something went wrong reading the scanner data. Try again in a minute.' };
  }
  console.log(JSON.stringify({ ev: 'cmd', cmd: reply.cmd, ms: Date.now() - t0 }));
  return json(method(reply, chatId));
});
