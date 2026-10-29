// Owner preferences for the RamanFX bot: one-shot alerts, symbol mutes, quiet hours, extra watchlist. Pure apart from
// the injected fetch (no Deno): index.ts builds restStore() over PostgREST with the service role; the vitest suite
// uses memoryStore() and a fake fetch. The scanners read these through the function's ?op=prefs API (README.md).

export type AlertKind = 'price' | 'zone' | 'pct';
export interface Alert { id: number; sym: string; kind: AlertKind; level?: number; dir?: 'above' | 'below'; pct?: number }
export type NewAlert = Omit<Alert, 'id'>;
export interface Quiet { from: string; to: string; tz: string }
export interface Prefs { mutes: { sym: string; until_utc: string }[]; alerts: Alert[]; quiet: Quiet | null; watch: string[] }

export interface PrefsStore {
  get(now: Date): Promise<Prefs>;
  addAlert(a: NewAlert): Promise<number>;
  delAlert(id: number): Promise<boolean>;
  /** Marks an alert fired (it stops being listed); false when unknown or already fired. */
  fired(id: number, now: Date): Promise<boolean>;
  mute(sym: string, until: Date, now: Date): Promise<void>;
  unmute(sym: string): Promise<boolean>;
  setQuiet(q: { from: string; to: string } | null): Promise<void>;
  watch(sym: string): Promise<void>;
  unwatch(sym: string): Promise<boolean>;
}

export const TZ = 'America/Edmonton';
export const MAX_ALERTS = 50, MAX_WATCH = 50;

// ---- parsing -------------------------------------------------------------------------------------------------------
/** '1d' '1w' '12h' '3d' '2w' -> milliseconds (1 h .. 90 days); '' -> 1 day; null when not a duration. */
export function parseDuration(s: string): number | null {
  if (!s) return 86400000;
  const m = /^(\d{1,3})\s*(h|d|w)$/i.exec(s.trim());
  if (!m) return null;
  const ms = Number(m[1]) * { h: 3600000, d: 86400000, w: 7 * 86400000 }[m[2].toLowerCase() as 'h' | 'd' | 'w'];
  return ms >= 3600000 && ms <= 90 * 86400000 ? ms : null;
}

/** '22:00' '6' '6am' '10:30pm' -> 'HH:MM' (24 h), or null. */
export function parseClock(s: string): string | null {
  const m = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i.exec(s.trim());
  if (!m) return null;
  let h = Number(m[1]);
  const mi = Number(m[2] ?? 0), ap = m[3]?.toLowerCase();
  if (mi > 59) return null;
  if (ap) { if (h < 1 || h > 12) return null; h = (h % 12) + (ap === 'pm' ? 12 : 0); }
  if (h > 23) return null;
  return `${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`;
}

/** '22:00-06:00' (also '22-6', '10pm - 6am', '22:00 06:00') -> {from, to}; 'off' -> null; undefined when invalid. */
export function parseQuiet(s: string): { from: string; to: string } | null | undefined {
  const t = s.trim().toLowerCase();
  if (t === 'off' || t === 'none' || t === 'stop') return null;
  const m = /^(\S+?)\s*(?:-|–|to|\s)\s*(\S+)$/.exec(t);
  if (!m) return undefined;
  const from = parseClock(m[1]), to = parseClock(m[2]);
  if (!from || !to || from === to) return undefined;
  return { from, to };
}

/** A price argument: '1.0850', '2,650.5', '2650' -> number > 0, or null. */
export function parsePrice(s: string): number | null {
  if (!/^\d[\d,]*(\.\d+)?$|^\.\d+$/.test(s.trim())) return null;
  const v = Number(s.trim().replace(/,/g, ''));
  return Number.isFinite(v) && v > 0 ? v : null;
}

/** Inline-button callback data for prefs: m:SYM:DAYS mute, r:SYM:PCT pct alert, d:ID delete alert, u:SYM unmute. */
export type PrefsTap = { op: 'mute'; sym: string; days: number } | { op: 'pct'; sym: string; pct: number } | { op: 'del'; id: number } | { op: 'unmute'; sym: string };
export function parseTap(data: string): PrefsTap | null {
  let m = /^m:([A-Za-z0-9._-]{1,20}):(\d{1,2})$/.exec(data);
  if (m) { const days = Number(m[2]); return days >= 1 && days <= 90 ? { op: 'mute', sym: m[1], days } : null; }
  m = /^r:([A-Za-z0-9._-]{1,20}):(\d{1,2}(?:\.\d{1,3})?)$/.exec(data);
  if (m) { const pct = Number(m[2]); return pct > 0 && pct <= 10 ? { op: 'pct', sym: m[1], pct } : null; }
  m = /^d:(\d{1,12})$/.exec(data);
  if (m) return { op: 'del', id: Number(m[1]) };
  m = /^u:([A-Za-z0-9._-]{1,20})$/.exec(data);
  if (m) return { op: 'unmute', sym: m[1] };
  return null;
}

// ---- scanner key -----------------------------------------------------------------------------------------------------
export async function sha256Hex(s: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export function sameHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}
/** The X-RFX-Key header against the stored sha256(key): format check, then a constant-time hash compare. */
export async function keyOk(key: string | null, storedHash: string | null | undefined): Promise<boolean> {
  if (!key || !storedHash || !/^[0-9a-f]{64}$/.test(storedHash) || !/^[0-9a-f]{64}$/.test(key)) return false;
  return sameHex(await sha256Hex(key), storedHash);
}

// ---- stores --------------------------------------------------------------------------------------------------------
const clean = (a: Alert): Alert => {
  const o: Alert = { id: a.id, sym: a.sym, kind: a.kind };
  if (a.level != null) o.level = a.level;
  if (a.dir) o.dir = a.dir;
  if (a.pct != null) o.pct = a.pct;
  return o;
};

/** In-memory store (tests, and a local fallback). */
export function memoryStore(): PrefsStore & { _alerts: (Alert & { fired?: boolean })[] } {
  let next = 1;
  const alerts: (Alert & { fired?: boolean })[] = [];
  const mutes = new Map<string, Date>(), watch: string[] = [];
  let quiet: { from: string; to: string } | null = null;
  return {
    _alerts: alerts,
    async get(now) {
      return {
        mutes: [...mutes].filter(([, u]) => u > now).map(([sym, u]) => ({ sym, until_utc: u.toISOString() })),
        alerts: alerts.filter(a => !a.fired).map(clean),
        quiet: quiet ? { ...quiet, tz: TZ } : null,
        watch: [...watch],
      };
    },
    async addAlert(a) { const id = next++; alerts.push({ ...a, id }); return id; },
    async delAlert(id) { const i = alerts.findIndex(a => a.id === id && !a.fired); if (i < 0) return false; alerts.splice(i, 1); return true; },
    async fired(id) { const a = alerts.find(x => x.id === id && !x.fired); if (!a) return false; a.fired = true; return true; },
    async mute(sym, until) { mutes.set(sym, until); },
    async unmute(sym) { return mutes.delete(sym); },
    async setQuiet(q) { quiet = q; },
    async watch(sym) { if (!watch.includes(sym)) watch.push(sym); },
    async unwatch(sym) { const i = watch.indexOf(sym); if (i < 0) return false; watch.splice(i, 1); return true; },
  };
}

type Fetch = (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

/** PostgREST store over public.rfx_bot_alerts / rfx_bot_mutes / rfx_bot_watch / rfx_bot_config (service role). */
export function restStore(base: string, headers: Record<string, string>, f: Fetch): PrefsStore {
  const call = async (method: string, path: string, body?: unknown, prefer?: string): Promise<unknown[]> => {
    const r = await f(`${base}/rest/v1/${path}`, { method, headers: { ...headers, 'Content-Type': 'application/json', ...(prefer ? { Prefer: prefer } : {}) }, body: body === undefined ? undefined : JSON.stringify(body) });
    if (!r.ok) throw new Error(`prefs ${method} ${path.split('?')[0]} ${r.status}`);
    if (method === 'GET' || prefer?.includes('return=representation')) { const j = await r.json(); return Array.isArray(j) ? j : []; }
    return [];
  };
  const enc = encodeURIComponent;
  return {
    async get(now) {
      const [a, m, w, c] = await Promise.all([
        call('GET', 'rfx_bot_alerts?fired_at=is.null&select=id,sym,kind,level,dir,pct&order=id'),
        call('GET', `rfx_bot_mutes?until_utc=gt.${enc(now.toISOString())}&select=sym,until_utc&order=sym`),
        call('GET', 'rfx_bot_watch?select=sym&order=created_at'),
        call('GET', 'rfx_bot_config?id=eq.1&select=quiet_from,quiet_to'),
      ]) as [Alert[], { sym: string; until_utc: string }[], { sym: string }[], { quiet_from: string | null; quiet_to: string | null }[]];
      const q = c[0];
      return {
        mutes: m.map(x => ({ sym: x.sym, until_utc: new Date(x.until_utc).toISOString() })),
        alerts: a.map(x => clean({ ...x, id: Number(x.id) })),
        quiet: q?.quiet_from && q?.quiet_to ? { from: q.quiet_from, to: q.quiet_to, tz: TZ } : null,
        watch: w.map(x => x.sym),
      };
    },
    async addAlert(a) {
      const rows = await call('POST', 'rfx_bot_alerts?select=id', { sym: a.sym, kind: a.kind, level: a.level ?? null, dir: a.dir ?? null, pct: a.pct ?? null }, 'return=representation');
      return Number((rows[0] as { id: number }).id);
    },
    async delAlert(id) { return (await call('DELETE', `rfx_bot_alerts?id=eq.${id}&fired_at=is.null&select=id`, undefined, 'return=representation')).length === 1; },
    async fired(id, now) { return (await call('PATCH', `rfx_bot_alerts?id=eq.${id}&fired_at=is.null&select=id`, { fired_at: now.toISOString() }, 'return=representation')).length === 1; },
    async mute(sym, until, now) {
      await call('POST', 'rfx_bot_mutes?on_conflict=sym', { sym, until_utc: until.toISOString(), created_at: now.toISOString() }, 'resolution=merge-duplicates,return=minimal');
      await call('DELETE', `rfx_bot_mutes?until_utc=lt.${enc(now.toISOString())}`);
    },
    async unmute(sym) { return (await call('DELETE', `rfx_bot_mutes?sym=eq.${enc(sym)}&select=sym`, undefined, 'return=representation')).length === 1; },
    async setQuiet(q) { await call('PATCH', 'rfx_bot_config?id=eq.1', { quiet_from: q?.from ?? null, quiet_to: q?.to ?? null }); },
    async watch(sym) { await call('POST', 'rfx_bot_watch?on_conflict=sym', { sym }, 'resolution=ignore-duplicates,return=minimal'); },
    async unwatch(sym) { return (await call('DELETE', `rfx_bot_watch?sym=eq.${enc(sym)}&select=sym`, undefined, 'return=representation')).length === 1; },
  };
}
