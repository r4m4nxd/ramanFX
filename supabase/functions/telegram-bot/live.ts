// Live candles for the bot (on demand, at request time). OANDA v20 practice API for FX / metals / CFDs (BID candles,
// aligned like tools/fx_scanner/oanda.py: New York 17:00 days, Friday weeks; labels in forex time = New York + 7 h, the
// Pepperstone server clock) and Alpaca Market Data for US stocks (daily: split adjusted, SIP history with IEX as the
// fallback; intraday 1-hour bars and the latest trade: the free real-time IEX feed). A short cache (30 s) per symbol,
// a cap on fresh fetches per minute, every request times out; any failure = null (the caller falls back to the latest
// scan). Tokens come in through the constructor and only ever go into request headers (never logged or returned).
// Pure apart from the injected fetch (tests: src/core/telegramLive.test.ts).
import type { ZBar } from './zonecore.ts';

export type Fetch = (url: string, init?: RequestInit) => Promise<Response>;
export const FX_TFS = ['M15', 'H1', 'H4', 'D1', 'W1', 'MN'] as const;
const GRAN: Record<string, string> = { M15: 'M15', H1: 'H1', H4: 'H4', D1: 'D', W1: 'W', MN: 'M' };
const COUNT: Record<string, number> = { M15: 300, H1: 400, H4: 400, D1: 400, W1: 400, MN: 400 };
export const TTL_MS = 30_000;

export interface LiveFx { closed: Record<string, ZBar[]>; forming: Record<string, ZBar | null>; price: number; at: number; feed: string }
export interface LiveStock { daily: ZBar[]; partial: ZBar | null; h1: ZBar[]; m15?: ZBar[]; h4?: ZBar[]; price: number; at: number; feed: string }
export interface LiveSource {
  /** FX / metals / CFDs by OANDA name (EUR_USD); undefined = no OANDA_API_TOKEN. */
  fx?: (oanda: string) => Promise<LiveFx | null>;
  /** US stocks by ticker (BRK.B); undefined = no Alpaca keys. */
  stock?: (sym: string) => Promise<LiveStock | null>;
}

// ---- forex clock ---------------------------------------------------------------------------------------------------
let nyFmt: Intl.DateTimeFormat | null = null;
/** New York's UTC offset in hours at a UTC instant (-4 EDT / -5 EST). */
export function nyOffset(ms: number): number {
  nyFmt ??= new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' });
  const p: Record<string, string> = {};
  for (const x of nyFmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
  return Math.round((wall - Math.floor(ms / 60000) * 60000) / 3600000);
}
const iso16 = (ms: number) => new Date(ms).toISOString().slice(0, 16);
/** fxcfg.label without the strict grid check: the forex-time (New York + 7 h) label of an OANDA candle start. */
export function fxLabel(utcMs: number, tf: string): string {
  const t = utcMs + (nyOffset(utcMs) + 7) * 3600000;
  if (tf === 'MN') return `${iso16(t + 3 * 86400000).slice(0, 7)}-01T00:00`;
  if (tf === 'W1') {
    const d = new Date(t + 12 * 3600000), wd = (d.getUTCDay() + 6) % 7;
    return `${new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - ((wd - 5 + 7) % 7) * 86400000).toISOString().slice(0, 10)}T00:00`;
  }
  if (tf === 'D1') return `${iso16(t + 12 * 3600000).slice(0, 10)}T00:00`;
  if (tf === 'M15') { const q = Math.round(t / 900000) * 900000; return iso16(q); }
  const u = new Date(t + 30 * 60000);
  const h = tf === 'H4' ? u.getUTCHours() - (u.getUTCHours() % 4) : u.getUTCHours();
  return `${u.toISOString().slice(0, 11)}${String(h).padStart(2, '0')}:00`;
}

// ---- parsing -------------------------------------------------------------------------------------------------------
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
/** OANDA candles (price=B) -> closed bars (oldest first) + the forming candle. */
export function parseOanda(js: J, tf: string): { closed: ZBar[]; forming: ZBar | null } {
  const closed: ZBar[] = [];
  let forming: ZBar | null = null;
  for (const c of Array.isArray(js?.candles) ? js.candles : []) {
    const m = c?.bid ?? c?.mid;
    const t = Date.parse(String(c?.time ?? ''));
    const b = m ? { d: Number.isFinite(t) ? fxLabel(t, tf) : '', o: +m.o, h: +m.h, l: +m.l, c: +m.c } : null;
    if (!b || !b.d || ![b.o, b.h, b.l, b.c].every(Number.isFinite)) continue;
    if (c.complete) closed.push(b); else forming = b;
  }
  return { closed, forming };
}
/** Alpaca /v2/stocks/bars (one symbol) -> bars, labelled with the session date (1Day) or the New York time (1Hour / 15Min). */
export function parseAlpaca(js: J, sym: string, hourly = false): ZBar[] {
  const rows = js?.bars?.[sym];
  return (Array.isArray(rows) ? rows : []).map((r: J) => {
    const t = Date.parse(String(r?.t ?? ''));
    const d = hourly && Number.isFinite(t) ? iso16(t + nyOffset(t) * 3600000) : String(r?.t ?? '').slice(0, 10);
    return { d, o: +r.o, h: +r.h, l: +r.l, c: +r.c };
  }).filter((b: ZBar) => b.d && [b.o, b.h, b.l, b.c].every(Number.isFinite) && b.c > 0);
}
/** Stock 4H candles from New York-labelled 30-minute bars: regular session only, two per day like TradingView
 *  (09:30-13:30 and 13:30-16:00 New York), labelled with their start. */
export function sessionH4(m30: ZBar[]): ZBar[] {
  const out: ZBar[] = [];
  for (const b of m30) {
    const hm = b.d.slice(11, 16);
    if (hm < '09:30' || hm >= '16:00') continue;
    const d = `${b.d.slice(0, 10)}T${hm < '13:30' ? '09:30' : '13:30'}`;
    const cur = out[out.length - 1];
    if (cur && cur.d === d) { cur.h = Math.max(cur.h, b.h); cur.l = Math.min(cur.l, b.l); cur.c = b.c; }
    else out.push({ d, o: b.o, h: b.h, l: b.l, c: b.c });
  }
  return out;
}
/** scan.drop_partial: today's daily bar (New York) is not a closed candle until 16:20 New York. */
export function splitPartial(daily: ZBar[], nowMs: number): { closed: ZBar[]; partial: ZBar | null } {
  if (!daily.length) return { closed: daily, partial: null };
  const ny = nowMs + nyOffset(nowMs) * 3600000;
  const today = new Date(ny).toISOString().slice(0, 10), mins = new Date(ny).getUTCHours() * 60 + new Date(ny).getUTCMinutes();
  const last = daily[daily.length - 1];
  if (last.d >= today && mins < 16 * 60 + 20) return { closed: daily.slice(0, -1), partial: last };
  return { closed: daily, partial: null };
}

// ---- sources -------------------------------------------------------------------------------------------------------
interface Opts { fetch?: Fetch; now?: () => number; maxPerMin?: number; host?: string }
class Limiter {
  private t: number[] = [];
  constructor(private max: number, private now: () => number) {}
  take(): boolean { const n = this.now(); this.t = this.t.filter(x => n - x < 60_000); if (this.t.length >= this.max) return false; this.t.push(n); return true; }
}
function cached<T>(ttl: number, now: () => number, lim: Limiter, load: (k: string) => Promise<T | null>): (k: string) => Promise<T | null> {
  const m = new Map<string, { t: number; v: Promise<T | null> }>();
  return (k: string) => {
    const hit = m.get(k);
    if (hit && now() - hit.t < ttl) return hit.v;
    if (!lim.take()) return hit ? hit.v : Promise.resolve(null);   // over the cap: the last answer (or none)
    const v = load(k).catch(() => null);
    const e = { t: now(), v };
    m.set(k, e);
    v.then(x => { if (x == null) e.t -= ttl; }, () => {});          // failures are not cached
    if (m.size > 200) m.delete(m.keys().next().value as string);
    return v;
  };
}
async function getJson(f: Fetch, url: string, headers: Record<string, string>): Promise<{ status: number; js: J | null }> {
  const r = await f(url, { headers: { Accept: 'application/json', ...headers }, signal: AbortSignal.timeout(7000) });
  if (!r.ok) { await r.body?.cancel(); console.log(JSON.stringify({ ev: 'live_http', host: new URL(url).host, path: new URL(url).pathname.slice(0, 40), status: r.status })); return { status: r.status, js: null }; }
  try { return { status: r.status, js: await r.json() }; } catch { return { status: r.status, js: null }; }
}

export function oandaSource(token: string, o: Opts = {}): (oanda: string) => Promise<LiveFx | null> {
  const f = o.fetch ?? fetch, now = o.now ?? Date.now, host = o.host ?? 'api-fxpractice.oanda.com';
  const auth = { Authorization: `Bearer ${token}` };
  return cached(TTL_MS, now, new Limiter(o.maxPerMin ?? 40, now), async (name: string) => {
    if (!/^[A-Z0-9]{2,12}_[A-Z0-9]{2,12}$/.test(name)) return null;
    const res = await Promise.all(FX_TFS.map(tf => getJson(f, `https://${host}/v3/instruments/${name}/candles?granularity=${GRAN[tf]}&price=B&count=${COUNT[tf]}`
      + '&alignmentTimezone=America%2FNew_York&dailyAlignment=17&weeklyAlignment=Friday', auth)));
    if (res.some((r, i) => !r.js && FX_TFS[i] !== 'M15')) return null;   // 15m is optional (only its own view needs it)
    const closed: Record<string, ZBar[]> = {}, forming: Record<string, ZBar | null> = {};
    FX_TFS.forEach((tf, i) => { const p = parseOanda(res[i].js ?? {}, tf); closed[tf] = p.closed; forming[tf] = p.forming; });
    const price = forming.H1?.c ?? closed.H1[closed.H1.length - 1]?.c;
    if (!(price > 0) || closed.H4.length < 60) return null;
    return { closed, forming, price, at: now(), feed: 'OANDA practice · bid' };
  });
}

export function alpacaSource(keyId: string, secret: string, o: Opts = {}): (sym: string) => Promise<LiveStock | null> {
  const f = o.fetch ?? fetch, now = o.now ?? Date.now;
  const auth = { 'APCA-API-KEY-ID': keyId, 'APCA-API-SECRET-KEY': secret };
  const base = 'https://data.alpaca.markets/v2/stocks';
  let dailyFeed: 'sip' | 'iex' = 'sip';                 // SIP history (15-min delay on the free plan); IEX when refused
  return cached(TTL_MS, now, new Limiter(o.maxPerMin ?? 40, now), async (sym: string) => {
    if (!/^[A-Z][A-Z0-9.]{0,9}$/.test(sym)) return null;
    const s = encodeURIComponent(sym), t = now();
    const daily = async (feed: string) => getJson(f, `${base}/bars?symbols=${s}&timeframe=1Day&start=2006-01-01T00:00:00Z`
      + `&end=${new Date(t - 16 * 60000).toISOString()}&adjustment=split&feed=${feed}&limit=10000&sort=asc`, auth);
    const [d0, h, tr, q, h30] = await Promise.all([
      daily(dailyFeed),
      getJson(f, `${base}/bars?symbols=${s}&timeframe=1Hour&start=${new Date(t - 14 * 86400000).toISOString()}&adjustment=split&feed=iex&limit=1000&sort=asc`, auth),
      getJson(f, `${base}/trades/latest?symbols=${s}&feed=iex`, auth),
      getJson(f, `${base}/bars?symbols=${s}&timeframe=15Min&start=${new Date(t - 10 * 86400000).toISOString()}&adjustment=split&feed=iex&limit=2000&sort=asc`, auth),
      getJson(f, `${base}/bars?symbols=${s}&timeframe=30Min&start=${new Date(t - 120 * 86400000).toISOString()}&adjustment=split&feed=iex&limit=10000&sort=asc`, auth),
    ]);
    let d = d0;
    if (!d.js && d.status === 403 && dailyFeed === 'sip') { dailyFeed = 'iex'; d = await daily('iex'); }
    if (!d.js) return null;
    const bars = parseAlpaca(d.js, sym);
    if (bars.length < 60) { console.log(JSON.stringify({ ev: 'live_short', sym, bars: bars.length })); return null; }
    const { closed, partial } = splitPartial(bars, t);
    const h1 = h.js ? parseAlpaca(h.js, sym, true) : [];
    const last = Number(tr.js?.trades?.[sym]?.p);
    const price = last > 0 ? last : (h1[h1.length - 1]?.c ?? bars[bars.length - 1].c);
    const m15 = q.js ? parseAlpaca(q.js, sym, true) : [];
    const h4 = h30?.js ? sessionH4(parseAlpaca(h30.js, sym, true)) : [];
    return { daily: closed, partial, h1, m15, h4, price, at: t, feed: `Alpaca · ${dailyFeed === 'sip' ? 'SIP daily' : 'IEX daily'} · IEX real-time` };
  });
}
