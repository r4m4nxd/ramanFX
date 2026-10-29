// Guests: up to MAX_GUESTS chats the owner shared the bot with (/adduser ID Name). Pure apart from the injected fetch
// (no Deno): index.ts wires it, src/core/telegramGuests.test.ts tests it with memoryGuests().
//   - a guest gets every market command (logic.ts handle / handleCallback) with ctx.role = 'guest' and ctx.prefs = THEIR
//     OWN store (rfx_bot_guests.prefs json): their alerts / mutes / quiet hours / watch list. The owner's tables are never
//     reached from a guest chat, and owner-only commands (OWNER_ONLY: journal /took, /health, guest admin) are refused.
//   - /scan for a guest: GUEST_SCANS_PER_HOUR per guest, inside the global on-demand cap of index.ts; the on-demand card
//     goes to the guest (workflow input to = guestKey(chat_id), resolved by the scanner through the prefs API).
//   - an unknown chat that sends /start gets 'Ask the owner to add you. Your ID: <id>' (rate-limited); anything else
//     from it is ignored. Its id is never stored or logged.
//   - the prefs API (?op=prefs) lists the active guests for the GitHub jobs' broadcast (tools/stock_scanner/guests.py).
import { handle, handleCallback, helpText, MAIN_KEYBOARD, OWNER_ONLY, parseCommand, esc, type Ctx, type Reply, type ScanResult } from './logic.ts';
import { sha256Hex, TZ, type Alert, type PrefsStore } from './prefs.ts';

export const MAX_GUESTS = 5;
export const GUEST_SCANS_PER_HOUR = 3;
export { OWNER_ONLY };

export interface GuestPrefs {
  alerts?: (Alert & { fired_at?: string })[];
  mutes?: { sym: string; until_utc: string }[];
  quiet?: { from: string; to: string } | null;
  watch?: string[];
  next?: number;
  /** Which markets' automatic messages they get (MARKETS keys); missing = DEFAULT_MARKETS. Commands work for any symbol. */
  markets?: string[];
}
/** Broadcast filter per guest. FX scanner classes: major / cross / exotic / metal = fx, cfd = indices, crypto = crypto. */
export const MARKETS: [string, string][] = [['stocks', 'Stocks'], ['crypto', 'Crypto'], ['fx', 'Forex & metals'], ['indices', 'Indices & commodities']];
export const DEFAULT_MARKETS = ['stocks'];
export const ALL_MARKETS = MARKETS.map(m => m[0]);
export const marketsOf = (p: GuestPrefs | undefined): string[] => {
  const m = Array.isArray(p?.markets) ? p!.markets.filter(x => ALL_MARKETS.includes(x)) : null;
  return m ?? [...DEFAULT_MARKETS];
};
export interface Guest { chat_id: number; name: string | null; added_at: string; active: boolean; prefs: GuestPrefs }

/** The non-secret handle of a guest (workflow input `to`, prefs API ops): the first 12 hex of sha256(chat id). */
export async function guestKey(chatId: number | string): Promise<string> { return (await sha256Hex(String(chatId))).slice(0, 12); }

// ---- the guest's own prefs store (same contract as prefs.ts PrefsStore) ---------------------------------------------
const cleanAlert = (a: Alert): Alert => {
  const o: Alert = { id: a.id, sym: a.sym, kind: a.kind };
  if (a.level != null) o.level = a.level;
  if (a.dir) o.dir = a.dir;
  if (a.pct != null) o.pct = a.pct;
  return o;
};
export function sanitize(p: unknown): Required<GuestPrefs> {
  const o = (p && typeof p === 'object' ? p : {}) as GuestPrefs;
  return {
    alerts: Array.isArray(o.alerts) ? o.alerts.filter(a => a && Number.isInteger(a.id) && typeof a.sym === 'string') : [],
    mutes: Array.isArray(o.mutes) ? o.mutes.filter(m => m && typeof m.sym === 'string' && typeof m.until_utc === 'string') : [],
    quiet: o.quiet && typeof o.quiet.from === 'string' && typeof o.quiet.to === 'string' ? { from: o.quiet.from, to: o.quiet.to } : null,
    watch: Array.isArray(o.watch) ? o.watch.filter(s => typeof s === 'string') : [],
    next: Number.isInteger(o.next) && (o.next as number) > 0 ? o.next as number : 1,
    markets: marketsOf(o),
  };
}

/** A PrefsStore over one guest's json (read-modify-write per call). */
export function guestStore(load: () => Promise<GuestPrefs>, save: (p: GuestPrefs) => Promise<void>): PrefsStore {
  const edit = async <T>(f: (p: Required<GuestPrefs>) => T): Promise<T> => { const p = sanitize(await load()); const r = f(p); await save(p); return r; };
  return {
    async get(now) {
      const p = sanitize(await load());
      return {
        mutes: p.mutes.filter(m => Date.parse(m.until_utc) > now.getTime()).map(m => ({ sym: m.sym, until_utc: new Date(m.until_utc).toISOString() })),
        alerts: p.alerts.filter(a => !a.fired_at).map(cleanAlert),
        quiet: p.quiet ? { ...p.quiet, tz: TZ } : null,
        watch: [...p.watch],
      };
    },
    addAlert: a => edit(p => { const id = p.next++; p.alerts.push(cleanAlert({ ...a, id })); return id; }),
    delAlert: id => edit(p => { const i = p.alerts.findIndex(a => a.id === id && !a.fired_at); if (i >= 0) p.alerts.splice(i, 1); return i >= 0; }),
    fired: (id, now) => edit(p => { const a = p.alerts.find(x => x.id === id && !x.fired_at); if (a) a.fired_at = now.toISOString(); p.alerts = p.alerts.filter(x => !x.fired_at || Date.parse(x.fired_at) > now.getTime() - 30 * 86400000); return !!a; }),
    mute: (sym, until, now) => edit(p => { p.mutes = p.mutes.filter(m => m.sym !== sym && Date.parse(m.until_utc) > now.getTime()); p.mutes.push({ sym, until_utc: until.toISOString() }); }),
    unmute: sym => edit(p => { const n = p.mutes.length; p.mutes = p.mutes.filter(m => m.sym !== sym); return p.mutes.length < n; }),
    setQuiet: q => edit(p => { p.quiet = q; }),
    watch: sym => edit(p => { if (!p.watch.includes(sym)) p.watch.push(sym); }),
    unwatch: sym => edit(p => { const i = p.watch.indexOf(sym); if (i >= 0) p.watch.splice(i, 1); return i >= 0; }),
  };
}

// ---- the guests table ------------------------------------------------------------------------------------------------
export interface GuestDb {
  /** An ACTIVE guest by chat id, else null. */
  get(chatId: string): Promise<Guest | null>;
  list(): Promise<Guest[]>;
  /** Adds (or re-activates, keeping their prefs) a guest. */
  add(chatId: number, name: string | null): Promise<void>;
  remove(chatId: number): Promise<boolean>;
  setPrefs(chatId: number, p: GuestPrefs): Promise<void>;
  deactivate(chatId: number): Promise<boolean>;
}

export function memoryGuests(seed: Guest[] = []): GuestDb & { rows: Guest[] } {
  const rows = seed.map(g => ({ ...g, prefs: JSON.parse(JSON.stringify(g.prefs ?? {})) }));
  return {
    rows,
    async get(id) { return rows.find(g => String(g.chat_id) === id && g.active) ?? null; },
    async list() { return rows.map(g => ({ ...g })); },
    async add(id, name) { const g = rows.find(x => x.chat_id === id); if (g) { g.active = true; g.name = name ?? g.name; } else rows.push({ chat_id: id, name, added_at: new Date().toISOString(), active: true, prefs: {} }); },
    async remove(id) { const i = rows.findIndex(g => g.chat_id === id); if (i >= 0) rows.splice(i, 1); return i >= 0; },
    async setPrefs(id, p) { const g = rows.find(x => x.chat_id === id); if (g) g.prefs = JSON.parse(JSON.stringify(p)); },
    async deactivate(id) { const g = rows.find(x => x.chat_id === id && x.active); if (g) g.active = false; return !!g; },
  };
}

type Fetch = (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;
/** PostgREST over public.rfx_bot_guests (service role). */
export function restGuests(base: string, headers: Record<string, string>, f: Fetch): GuestDb {
  const T = `${base}/rest/v1/rfx_bot_guests`;
  const call = async (method: string, q: string, body?: unknown, prefer?: string): Promise<unknown[]> => {
    const r = await f(`${T}${q}`, { method, headers: { ...headers, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!r.ok) throw new Error(`guests ${method} ${r.status}`);
    if (method === 'GET' || prefer?.includes('return=representation')) { const j = await r.json(); return Array.isArray(j) ? j : []; }
    return [];
  };
  const SEL = 'select=chat_id,name,added_at,active,prefs';
  const row = (x: unknown): Guest => { const g = x as Guest; return { ...g, chat_id: Number(g.chat_id), prefs: g.prefs ?? {} }; };
  return {
    async get(id) { if (!/^-?\d{1,20}$/.test(id)) return null; const r = await call('GET', `?chat_id=eq.${id}&active=is.true&${SEL}`); return r[0] ? row(r[0]) : null; },
    async list() { return (await call('GET', `?${SEL}&order=added_at`)).map(row); },
    async add(id, name) { await call('POST', '?on_conflict=chat_id', { chat_id: id, active: true, ...(name ? { name } : {}) }, 'resolution=merge-duplicates,return=minimal'); },
    async remove(id) { return (await call('DELETE', `?chat_id=eq.${id}&select=chat_id`, undefined, 'return=representation')).length === 1; },
    async setPrefs(id, p) { await call('PATCH', `?chat_id=eq.${id}`, { prefs: p }); },
    async deactivate(id) { return (await call('PATCH', `?chat_id=eq.${id}&active=is.true&select=chat_id`, { active: false }, 'return=representation')).length === 1; },
  };
}

// ---- rate limits -----------------------------------------------------------------------------------------------------
export function limiter(n: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return {
    /** true (and counted) when key is under n hits in the window. */
    take(key: string, now = Date.now()): boolean {
      const h = (hits.get(key) ?? []).filter(t => now - t < windowMs);
      if (h.length >= n) { hits.set(key, h); return false; }
      h.push(now);
      hits.set(key, h);
      if (hits.size > 500) hits.delete(hits.keys().next().value as string);
      return true;
    },
  };
}

// ---- unknown chats ---------------------------------------------------------------------------------------------------
const startPerChat = limiter(1, 10 * 60_000), startGlobal = limiter(30, 3600_000);
/** /start from a chat that is neither the owner nor a guest: its ID (to send to the owner), at most once per 10 min per
 *  chat and 30 an hour overall; null = no reply. */
export function strangerReply(text: string, chatId: number | string, lim = { chat: startPerChat, all: startGlobal }, now = Date.now()): Reply | null {
  const c = parseCommand(text);
  if (!c || c.cmd !== 'start') return null;
  if (!/^-?\d{1,20}$/.test(String(chatId))) return null;
  if (!lim.chat.take(String(chatId), now) || !lim.all.take('all', now)) return null;
  return { cmd: 'stranger', text: `👋 This is a private bot. Ask the owner to add you.\nYour ID: <code>${esc(String(chatId))}</code>` };
}

// ---- guest commands --------------------------------------------------------------------------------------------------
export const OWNER_ONLY_TEXT = "🔒 That one is only for the bot's owner. /help lists what you can use.";
export interface GuestEnv {
  db: GuestDb;
  /** Global on-demand scan of one symbol for THIS guest (the card goes to them); undefined = no GitHub token. */
  scanOneFor?: (market: 'fx' | 'stock', sym: string) => Promise<ScanResult>;
  /** Full scan (all markets); undefined = no GitHub token. */
  dispatch?: () => Promise<boolean>;
  scans?: ReturnType<typeof limiter>;
}
const guestScans = limiter(GUEST_SCANS_PER_HOUR, 3600_000);

/** The context a guest's command runs with: their own prefs store, no owner data sources, a per-guest /scan limit. */
export function guestCtx(base: Ctx, g: Guest, env: GuestEnv): Ctx {
  const scans = env.scans ?? guestScans, key = String(g.chat_id);
  const store = guestStore(async () => (await env.db.get(key))?.prefs ?? g.prefs, p => env.db.setPrefs(g.chat_id, p));
  return {
    load: base.load, now: base.now, imageUrl: base.imageUrl, live: base.live, role: 'guest', prefs: store,
    scanOne: env.scanOneFor ? async (m, s) => (scans.take(key) ? env.scanOneFor!(m, s) : 'limited') : undefined,
    dispatch: env.dispatch ? async () => (scans.take(key) ? env.dispatch!() : false) : undefined,
  };
}

// ---- /markets: which automatic messages a guest gets ----------------------------------------------------------------
export function marketsReply(markets: string[], edit = false): Reply {
  const on = new Set(markets);
  const lines = ['📬 <b>Your automatic messages</b>', 'Tap to switch a market on or off:', '',
    ...MARKETS.map(([k, label]) => `${on.has(k) ? '✅' : '▫️'} ${esc(label)}`), '',
    'Reminders before big US data (jobs, CPI, Fed) and the 6 AM brief come either way (the brief shows only your markets).',
    'Commands work for any symbol whatever you pick here.'];
  return { cmd: 'markets', text: lines.join('\n'), edit, buttons: [MARKETS.slice(0, 2), MARKETS.slice(2)].map(r => r.map(([k, label]) => ({ text: `${on.has(k) ? '✅' : '▫️'} ${label}`, callback_data: `mk:${k}` }))) };
}
async function toggleMarket(k: string, g: Guest, env: GuestEnv): Promise<Reply> {
  const cur = (await env.db.get(String(g.chat_id)))?.prefs ?? g.prefs;
  const p = sanitize(cur);
  p.markets = p.markets.includes(k) ? p.markets.filter(x => x !== k) : ALL_MARKETS.filter(x => x === k || p.markets.includes(x));
  await env.db.setPrefs(g.chat_id, { ...(cur ?? {}), markets: p.markets });
  const label = MARKETS.find(m => m[0] === k)?.[1] ?? k;
  return { ...marketsReply(p.markets, true), toast: `${label} ${p.markets.includes(k) ? 'on' : 'off'}` };
}

export async function guestMessage(text: string, g: Guest, base: Ctx, env: GuestEnv): Promise<Reply> {
  const c = parseCommand(text);
  if (c && OWNER_ONLY.has(c.cmd)) return { cmd: 'owner-only', text: OWNER_ONLY_TEXT };
  if (c?.cmd === 'markets') {
    try { return marketsReply(marketsOf((await env.db.get(String(g.chat_id)))?.prefs ?? g.prefs)); } catch { return { cmd: 'markets', text: '⚠️ Settings did not load. Try again in a minute.' }; }
  }
  const r = await handle(text, guestCtx(base, g, env));
  if (c?.cmd === 'scan' && r.text.includes('limit reached')) r.text = r.text.replace('(6 an hour)', `(${GUEST_SCANS_PER_HOUR} an hour for you)`);
  return r;
}
export async function guestCallback(data: string, g: Guest, base: Ctx, env: GuestEnv): Promise<Reply> {
  const mk = /^mk:([a-z]{2,10})$/.exec(data);
  if (mk && ALL_MARKETS.includes(mk[1])) {
    try { return await toggleMarket(mk[1], g, env); } catch { return { cmd: 'markets', text: '⚠️ Settings did not save. Try again in a minute.', toast: 'not saved' }; }
  }
  const r = await handleCallback(data, guestCtx(base, g, env));
  if (r.text.includes('limit reached')) r.text = r.text.replace('(6 an hour)', `(${GUEST_SCANS_PER_HOUR} an hour for you)`);
  return r;
}

// ---- the owner's admin commands --------------------------------------------------------------------------------------
export type WelcomeResult = 'sent' | 'blocked' | 'no-token' | 'fail';
export interface AdminEnv {
  db: GuestDb;
  /** true when this chat id is the owner's (sha256 compare in index.ts). */
  isOwner(chatId: string): Promise<boolean>;
  /** sendMessage to the new guest (bot token secret); never logged. */
  welcome(chatId: number, text: string, markup: unknown): Promise<WelcomeResult>;
}
export function welcomeText(name: string | null): string {
  return [`👋 <b>Welcome${name ? `, ${esc(name)}` : ''}!</b>`, 'You now get the RamanFX market messages (FX signals, stock scan, big moves, the 6 AM brief, reminders) and can use the commands below.',
    'Your alerts, mutes and quiet hours are your own. /markets picks which markets\' messages you get (stocks to start).', '', helpText('guest')].join('\n');
}
const cleanName = (s: string) => s.replace(/[<>&\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 40);
const fmtDay = (iso: string) => { const t = new Date(iso); return Number.isFinite(t.getTime()) ? t.toISOString().slice(0, 10) : '?'; };

/** /adduser /removeuser /users from the OWNER's chat; null = not an admin command. */
export async function ownerAdmin(text: string, env: AdminEnv): Promise<Reply | null> {
  const c = parseCommand(text);
  if (!c || !['adduser', 'removeuser', 'deluser', 'users', 'guests'].includes(c.cmd)) return null;
  const NO_DB = { cmd: c.cmd, text: '⚠️ <b>Sharing is not available right now</b>\nThe guests table did not answer (is the rfx_bot_guests migration applied?).' };
  try {
    if (c.cmd === 'users' || c.cmd === 'guests') {
      const all = await env.db.list();
      const lines = [`👥 <b>Shared with · ${all.filter(g => g.active).length}/${MAX_GUESTS}</b>`];
      for (const g of all) lines.push(`${g.active ? '✅' : '⛔'} <b>${esc(g.name || 'no name')}</b> · <code>${g.chat_id}</code> · since ${fmtDay(g.added_at)} · ${esc(marketsOf(g.prefs).join(', ') || 'no markets')}${g.active ? '' : ' · inactive (blocked the bot)'}`);
      if (!all.length) lines.push('nobody yet');
      lines.push('', 'Add: <b>/adduser ID Name</b> · remove: <b>/removeuser ID</b>', 'They ask for their ID by sending /start to the bot.');
      return { cmd: 'users', text: lines.join('\n') };
    }
    const idText = c.arg.replace(/^@/, '');
    if (!/^-?\d{5,20}$/.test(idText)) return { cmd: c.cmd, text: `Send their numeric ID, e.g. <b>/${c.cmd === 'adduser' ? 'adduser 123456789 Name' : 'removeuser 123456789'}</b>. They get it by sending /start to the bot.` };
    const id = Number(idText);
    if (!Number.isSafeInteger(id)) return { cmd: c.cmd, text: 'That ID is too long.' };
    if (c.cmd === 'removeuser' || c.cmd === 'deluser') {
      return { cmd: 'removeuser', text: (await env.db.remove(id)) ? `🗑 <code>${id}</code> removed: no more messages or commands for them.` : `<code>${id}</code> was not on the list (/users).` };
    }
    if (await env.isOwner(idText)) return { cmd: 'adduser', text: "That's your own ID: you have everything already." };
    const rows = await env.db.list();
    const existing = rows.find(g => g.chat_id === id);
    if (!existing?.active && rows.filter(g => g.active).length >= MAX_GUESTS) return { cmd: 'adduser', text: `The bot is shared with ${MAX_GUESTS} people already (the most). /removeuser someone first.` };
    let rest = c.rest.slice(c.arg.length).trim();
    const all = /(^|\s)all$/i.test(rest);
    if (all) rest = rest.replace(/(^|\s)all$/i, '');
    const name = cleanName(rest) || existing?.name || null;
    await env.db.add(id, name);
    const prefs = (await env.db.list()).find(g => g.chat_id === id)?.prefs ?? {};
    if (all) await env.db.setPrefs(id, { ...prefs, markets: [...ALL_MARKETS] });
    else if (!existing) await env.db.setPrefs(id, { ...prefs, markets: [...DEFAULT_MARKETS] });
    const mk = all ? ALL_MARKETS : marketsOf(existing && !all ? existing.prefs : { markets: DEFAULT_MARKETS });
    const w = await env.welcome(id, welcomeText(name), MAIN_KEYBOARD);
    const how = w === 'sent' ? 'They got a welcome message with the commands.'
      : w === 'blocked' ? 'They have not started the bot yet (or blocked it): ask them to send /start to it.'
        : w === 'no-token' ? 'No TELEGRAM_BOT_TOKEN secret on the function, so no welcome message: ask them to send /start.'
          : 'The welcome message did not go out: ask them to send /start.';
    return { cmd: 'adduser', text: [`✅ <b>${esc(name || String(id))}</b> added${existing?.active ? ' (already on the list)' : ''}.`, how,
      `Their automatic messages: ${esc(mk.map(k => MARKETS.find(m => m[0] === k)?.[1] ?? k).join(', ') || 'none')} (they change it with /markets${all ? '' : '; /adduser ID Name all = every market'}).`,
      'They get the market commands and messages; your journal, alerts, watch list and positions stay private. /users lists everyone.'].join('\n') };
  } catch {
    return NO_DB;
  }
}
