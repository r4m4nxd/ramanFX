// Live candles from Pepperstone itself: the cTrader Open API (JSON over WebSocket, port 5036), the owner's own broker
// feed (BID trendbars), used before OANDA for FX / metals / indices / commodities. Same shape as live.ts oandaSource
// (closed bars + the forming one per TF, forex-time labels), so the zones and charts are unchanged.
// Credentials: CTRADER_CLIENT_ID / CTRADER_CLIENT_SECRET (edge-function secrets) and the access token, which the weekly
// ctrader-token workflow refreshes into public.rfx_ctrader_token (read here with the service role). Nothing is logged
// but event names and counts. One socket per fetch (an edge instance is short-lived); history requests paced at 5 / s.
import type { ZBar } from './zonecore.ts';
import { FX_TFS, fxLabel, TTL_MS, type LiveFx } from './live.ts';

const HOST = { live: 'wss://live.ctraderapi.com:5036', demo: 'wss://demo.ctraderapi.com:5036' };
const T = { APP: 2100, APP_RES: 2101, ACC: 2102, ACC_RES: 2103, SYMS: 2114, SYMS_RES: 2115, BARS: 2137, BARS_RES: 2138, LIST: 2149, LIST_RES: 2150, ERR: 2142, HB: 51 };
const PERIOD: Record<string, number> = { M15: 7, H1: 9, H4: 10, D1: 12, W1: 13, MN: 14 };
// history per TF: [days per request, requests] (the API caps the range of one request)
const SPAN: Record<string, [number, number]> = { M15: [5, 1], H1: [20, 1], H4: [90, 1], D1: [360, 2], W1: [1800, 2], MN: [1800, 2] };
const PACE_MS = 210;
const DAY = 86_400_000;

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export interface CtCreds { clientId: string; clientSecret: string; token: () => Promise<string | null> }
type Raw = [number, number, number, number, number];            // start ms, o, h, l, c

/** Is a trendbar that started at `ms` closed at `now`? (weeks: Sunday open -> Friday close; months: the next 1st) */
export function ctClosed(ms: number, tf: string, now: number): boolean {
  if (tf === 'W1') return now >= ms + 5 * DAY;
  if (tf === 'MN') {
    const t = new Date(ms + 3 * DAY);
    return now >= Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 1) - 3 * 3_600_000;
  }
  const len: Record<string, number> = { M15: 900_000, H1: 3_600_000, H4: 14_400_000, D1: DAY };
  return now >= ms + len[tf];
}
/** Trendbars (relative to `low`, 1e-5 units) -> [start ms, o, h, l, c]. */
export function ctBars(p: J): Raw[] {
  const out: Raw[] = [];
  for (const b of Array.isArray(p?.trendbar) ? p.trendbar : []) {
    const lo = +b.low || 0, m = +b.utcTimestampInMinutes;
    if (!Number.isFinite(m) || !lo) continue;
    out.push([m * 60_000, (lo + (+b.deltaOpen || 0)) / 1e5, (lo + (+b.deltaHigh || 0)) / 1e5, lo / 1e5, (lo + (+b.deltaClose || 0)) / 1e5]);
  }
  return out;
}
/** Raw bars of one TF -> closed bars (label order, de-duplicated) + the forming bar. */
export function ctSplit(raw: Raw[], tf: string, now: number): { closed: ZBar[]; forming: ZBar | null } {
  const by = new Map<string, ZBar>();
  let forming: ZBar | null = null;
  for (const [ms, o, h, l, c] of [...raw].sort((a, b) => a[0] - b[0])) {
    const b = { d: fxLabel(ms, tf), o, h, l, c };
    if (ctClosed(ms, tf, now)) by.set(b.d, b); else forming = b;
  }
  return { closed: [...by.keys()].sort().map(k => by.get(k)!), forming };
}

class Conn {
  private ws: WebSocket;
  private n = 0;
  private wait = new Map<string, { res: (p: J) => void; rej: (e: Error) => void }>();
  readonly open: Promise<void>;
  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.open = new Promise((res, rej) => {
      this.ws.onopen = () => res();
      this.ws.onerror = () => rej(new Error('ws error'));
      setTimeout(() => rej(new Error('ws open timeout')), 6000);
    });
    this.ws.onmessage = (e: MessageEvent) => {
      let m: J;
      try { m = JSON.parse(String(e.data)); } catch { return; }
      const w = m?.clientMsgId ? this.wait.get(String(m.clientMsgId)) : undefined;
      if (!w) return;
      this.wait.delete(String(m.clientMsgId));
      if (m.payloadType === T.ERR || m.payload?.errorCode) w.rej(new Error(`cTrader ${m.payload?.errorCode ?? 'error'}`));
      else w.res(m.payload ?? {});
    };
    this.ws.onclose = () => { for (const w of this.wait.values()) w.rej(new Error('ws closed')); this.wait.clear(); };
  }
  call(type: number, payload: J, ms = 8000): Promise<J> {
    const id = String(++this.n);
    return new Promise((res, rej) => {
      const t = setTimeout(() => { this.wait.delete(id); rej(new Error('cTrader timeout')); }, ms);
      this.wait.set(id, { res: p => { clearTimeout(t); res(p); }, rej: e => { clearTimeout(t); rej(e); } });
      this.ws.send(JSON.stringify({ clientMsgId: id, payloadType: type, payload }));
    });
  }
  close() { try { this.ws.close(); } catch { /* closed */ } }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
let acct: { id: number; live: boolean; syms: Map<string, number>; at: number } | null = null;   // warm-instance cache (6 h)

/** FX / CFD source keyed by the Pepperstone symbol (EURUSD, XAUUSD, US500, Soybeans); null = not listed or failed. */
export function ctraderSource(cr: CtCreds, o: { now?: () => number; maxPerMin?: number } = {}): (sym: string) => Promise<LiveFx | null> {
  const now = o.now ?? Date.now, max = o.maxPerMin ?? 20;
  const memo = new Map<string, { t: number; v: Promise<LiveFx | null> }>();
  let hits: number[] = [];
  const load = async (sym: string): Promise<LiveFx | null> => {
    const token = await cr.token();
    if (!token) { console.log(JSON.stringify({ ev: 'ct_no_token' })); return null; }
    let c = new Conn(acct?.live === false ? HOST.demo : HOST.live);
    try {
      await c.open;
      await c.call(T.APP, { clientId: cr.clientId, clientSecret: cr.clientSecret });
      if (!acct || now() - acct.at > 6 * 3_600_000) {
        const list: J[] = (await c.call(T.LIST, { accessToken: token })).ctidTraderAccount ?? [];
        const a = list.find(x => x.isLive) ?? list[0];
        if (!a) return null;
        if (!a.isLive) { c.close(); c = new Conn(HOST.demo); await c.open; await c.call(T.APP, { clientId: cr.clientId, clientSecret: cr.clientSecret }); }
        await c.call(T.ACC, { ctidTraderAccountId: a.ctidTraderAccountId, accessToken: token });
        const syms = new Map<string, number>();
        for (const s of (await c.call(T.SYMS, { ctidTraderAccountId: a.ctidTraderAccountId }, 15000)).symbol ?? [])
          if (s?.symbolName && s.enabled !== false) syms.set(String(s.symbolName).toUpperCase(), +s.symbolId);
        acct = { id: +a.ctidTraderAccountId, live: !!a.isLive, syms, at: now() };
      } else {
        await c.call(T.ACC, { ctidTraderAccountId: acct.id, accessToken: token });
      }
      const sid = acct.syms.get(sym.toUpperCase());
      if (sid === undefined) { console.log(JSON.stringify({ ev: 'ct_not_listed', sym })); return null; }
      const t = now(), closed: Record<string, ZBar[]> = {}, forming: Record<string, ZBar | null> = {};
      for (const tf of FX_TFS) {
        const [days, reqs] = SPAN[tf];
        const raw: Raw[] = [];
        for (let k = 0; k < reqs; k++) {
          const to = t - k * days * DAY, from = to - days * DAY;
          try {
            raw.push(...ctBars(await c.call(T.BARS, { ctidTraderAccountId: acct.id, symbolId: sid, period: PERIOD[tf], fromTimestamp: from, toTimestamp: to })));
          } catch (e) {
            if (tf !== 'M15') throw e;                            // 15m is optional (only its own view needs it)
          }
          await sleep(PACE_MS);
        }
        const p = ctSplit(raw, tf, t);
        closed[tf] = p.closed; forming[tf] = p.forming;
      }
      const price = forming.H1?.c ?? closed.H1[closed.H1.length - 1]?.c;
      if (!(price > 0) || closed.H4.length < 60) { console.log(JSON.stringify({ ev: 'ct_short', sym, h4: closed.H4.length })); return null; }
      console.log(JSON.stringify({ ev: 'ct_ok', sym, h4: closed.H4.length, ms: now() - t }));
      return { closed, forming, price, at: t, feed: 'Pepperstone cTrader · bid' };
    } catch (e) {
      console.log(JSON.stringify({ ev: 'ct_fail', sym, err: String((e as Error)?.message ?? e).slice(0, 80) }));
      if (String((e as Error)?.message).includes('ACCESS_TOKEN')) acct = null;
      return null;
    } finally {
      c.close();
    }
  };
  return (sym: string) => {
    const hit = memo.get(sym);
    if (hit && now() - hit.t < TTL_MS) return hit.v;
    hits = hits.filter(x => now() - x < 60_000);
    if (hits.length >= max) return hit ? hit.v : Promise.resolve(null);
    hits.push(now());
    const v = load(sym).catch(() => null);
    const e = { t: now(), v };
    memo.set(sym, e);
    v.then(x => { if (x == null) e.t -= TTL_MS; }, () => {});
    if (memo.size > 100) memo.delete(memo.keys().next().value as string);
    return v;
  };
}

/** The newest access token from public.rfx_ctrader_token (cached 10 min). */
export function tokenLoader(sbUrl: string, headers: () => Record<string, string>, f: typeof fetch = fetch): () => Promise<string | null> {
  let cache: { t: number; v: string | null } | null = null;
  return async () => {
    if (cache && Date.now() - cache.t < 600_000) return cache.v;
    try {
      const r = await f(`${sbUrl}/rest/v1/rfx_ctrader_token?id=eq.1&select=access_token`, { headers: headers(), signal: AbortSignal.timeout(5000) });
      const js = r.ok ? await r.json() : null;
      cache = { t: Date.now(), v: (Array.isArray(js) && js[0]?.access_token) || null };
    } catch { cache = { t: Date.now() - 540_000, v: cache?.v ?? null }; }  // retry in a minute
    return cache.v;
  };
}
