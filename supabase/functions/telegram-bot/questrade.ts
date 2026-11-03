// Live candles for TSX stocks (RY.TO, BBD-B.TO ...) from the owner's Questrade app (read-only market data), the same
// account as the stock scan's TSX feed (tools/stock_scanner/questrade.py). Alpaca serves US listings only.
// Token: public.rfx_questrade_token (service role). Questrade refresh tokens are SINGLE-USE: a still-valid access token
// in the table is reused; otherwise the refresh token is exchanged and the new pair is written back at once. If the
// daily scan exchanges at the same moment, one of the two exchanges fails and changes nothing (the chain stays intact).
// Any failure = null (the caller shows the latest scan).
import type { ZBar } from './zonecore.ts';
import { nyOffset, sessionH4, splitPartial, TTL_MS, type LiveStock } from './live.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const UA = 'RamanFX/1.0 (personal Questrade app; read-only market data)';

export function questradeSource(sbUrl: string, headers: () => Record<string, string>, f: typeof fetch = fetch): (sym: string) => Promise<LiveStock | null> {
  const rest = `${sbUrl}/rest/v1/rfx_questrade_token`;
  let sess: { access: string; api: string; exp: number } | null = null;
  const ids = new Map<string, number | null>();
  const memo = new Map<string, { t: number; v: Promise<LiveStock | null> }>();

  async function session(force = false): Promise<{ access: string; api: string } | null> {
    if (!force && sess && sess.exp > Date.now() + 120_000) return sess;
    const r = await f(`${rest}?id=eq.1&select=refresh_token,access_token,api_server,expires_at`, { headers: headers(), signal: AbortSignal.timeout(5000) });
    if (!r.ok) { await r.body?.cancel(); return null; }
    const row = ((await r.json()) as J[])[0];
    if (!row) return null;
    const exp = Date.parse(String(row.expires_at ?? ''));
    if (!force && row.access_token && exp > Date.now() + 120_000) { sess = { access: row.access_token, api: row.api_server, exp }; return sess; }
    const t = await f(`https://login.questrade.com/oauth2/token?grant_type=refresh_token&refresh_token=${encodeURIComponent(row.refresh_token)}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
    if (!t.ok) { await t.body?.cancel(); console.log(JSON.stringify({ ev: 'qt_login', status: t.status })); return null; }
    const js = await t.json() as J;
    if (!js.refresh_token || !js.access_token) return null;
    const e = Date.now() + (Number(js.expires_in) || 1800) * 1000;
    const w = await f(rest, { method: 'POST', headers: { ...headers(), Prefer: 'resolution=merge-duplicates,return=minimal' }, signal: AbortSignal.timeout(5000),
      body: JSON.stringify({ id: 1, refresh_token: js.refresh_token, access_token: js.access_token, api_server: js.api_server, expires_at: new Date(e).toISOString(), updated_at: new Date().toISOString() }) });
    await w.body?.cancel();
    if (!w.ok) console.log(JSON.stringify({ ev: 'qt_store_failed', status: w.status }));
    sess = { access: js.access_token, api: js.api_server, exp: e };
    return sess;
  }
  async function get(path: string, retry = true): Promise<J | null> {
    const s = await session();
    if (!s) return null;
    const r = await f(s.api.replace(/\/$/, '') + '/' + path, { headers: { Authorization: `Bearer ${s.access}`, 'User-Agent': UA }, signal: AbortSignal.timeout(8000) });
    if (r.status === 401 && retry) { await r.body?.cancel(); sess = null; await session(true); return get(path, false); }
    if (!r.ok) { await r.body?.cancel(); console.log(JSON.stringify({ ev: 'qt_http', status: r.status, path: path.split('?')[0].slice(0, 30) })); return null; }
    return await r.json() as J;
  }
  async function idOf(sym: string): Promise<number | null> {
    if (ids.has(sym)) return ids.get(sym)!;
    const base = sym.replace(/\.TO$/i, '').replace(/-/g, '.');
    const js = await get(`v1/symbols/search?prefix=${encodeURIComponent(base)}`);
    const want = new Set([`${base}.TO`.toUpperCase(), base.toUpperCase()]);
    const hit = ((js?.symbols ?? []) as J[]).find(x => want.has(String(x.symbol).toUpperCase()));
    const id = hit ? Number(hit.symbolId) : null;
    if (js) ids.set(sym, id);
    return id;
  }
  const iso = (ms: number) => new Date(ms).toISOString().replace(/\.\d+Z$/, '-00:00');
  async function candles(id: number, from: number, to: number, interval: string): Promise<J[]> {
    const js = await get(`v1/markets/candles/${id}?startTime=${encodeURIComponent(iso(from))}&endTime=${encodeURIComponent(iso(to))}&interval=${interval}`);
    return (js?.candles ?? []) as J[];
  }
  const bar = (c: J, d: string): ZBar => ({ d, o: +c.open, h: +c.high, l: +c.low, c: +c.close });
  const nyLabel = (s: string) => { const t = Date.parse(s); return new Date(t + nyOffset(t) * 3600000).toISOString().slice(0, 16); };

  async function load(sym: string): Promise<LiveStock | null> {
    const id = await idOf(sym);
    if (id == null) return null;
    const now = Date.now(), DAY = 86_400_000;
    const [d1, d2, h1, m30, m15] = await Promise.all([
      candles(id, now - 5400 * DAY, now - 2700 * DAY, 'OneDay'), candles(id, now - 2700 * DAY, now, 'OneDay'),
      candles(id, now - 14 * DAY, now, 'OneHour'), candles(id, now - 120 * DAY, now, 'HalfHour'), candles(id, now - 10 * DAY, now, 'FifteenMinutes')]);
    const byDay = new Map<string, ZBar>();
    for (const c of [...d1, ...d2]) byDay.set(String(c.start).slice(0, 10), bar(c, String(c.start).slice(0, 10)));
    const daily = [...byDay.keys()].sort().map(k => byDay.get(k)!).filter(b => [b.o, b.h, b.l, b.c].every(Number.isFinite) && b.c > 0);
    if (daily.length < 60) return null;
    const hb = h1.map(c => bar(c, nyLabel(String(c.start)))), qb = m15.map(c => bar(c, nyLabel(String(c.start))));
    const h4 = sessionH4(m30.map(c => bar(c, nyLabel(String(c.start)))));
    const { closed, partial } = splitPartial(daily, now);
    const price = qb[qb.length - 1]?.c ?? hb[hb.length - 1]?.c ?? daily[daily.length - 1].c;
    return { daily: closed, partial, h1: hb, m15: qb, h4, price, at: now, feed: 'Questrade (TSX) · delayed' };
  }
  return (sym: string) => {
    const hit = memo.get(sym);
    if (hit && Date.now() - hit.t < TTL_MS) return hit.v;
    const v = load(sym).catch(() => null);
    const e = { t: Date.now(), v };
    memo.set(sym, e);
    v.then(x => { if (x == null) e.t -= TTL_MS; }, () => {});
    return v;
  };
}
