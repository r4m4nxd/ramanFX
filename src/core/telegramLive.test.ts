// Live data for the bot (live.ts + the live paths of logic.ts): OANDA / Alpaca parsing, the 30 s cache, the SIP -> IEX
// fallback, live zones / charts labelled 'live', the no-keys hint, /scan SYM and the [🔄 Live scan] button.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chartData, handle, handleCallback, LIVE_HINT, type Ctx, type ScanResult } from '../../supabase/functions/telegram-bot/logic';
import { alpacaSource, fxLabel, nyOffset, oandaSource, parseOanda, splitPartial, type LiveFx, type LiveStock } from '../../supabase/functions/telegram-bot/live';
import { fxZonesOf, stockZonesOf, type ZBar } from '../../supabase/functions/telegram-bot/zonecore';
import { renderSvg } from '../../supabase/functions/telegram-bot/chart';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const fixture = read('tools/telegram_bot/parity/fixtures.json');
type Row = [string, number, number, number, number];
const bars = (rows: Row[]): ZBar[] => rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c }));
const AT = Date.parse('2026-10-29T13:42:00Z');   // 7:42 AM Calgary

function liveFx(): LiveFx {
  const c = fixture.fx[0], closed: Record<string, ZBar[]> = {};
  for (const tf of Object.keys(c.bars)) closed[tf] = bars(c.bars[tf]);
  // 15m stand-in: the newest 300 H1 candles' shapes, relabelled every 15 minutes up to the newest H1 bar
  const h1 = closed.H1, end = Date.parse(`${h1[h1.length - 1].d}:00Z`);
  closed.M15 = h1.slice(-300).map((b, i) => ({ ...b, d: new Date(end - (299 - i) * 900000).toISOString().slice(0, 16) }));
  const last = closed.H1[closed.H1.length - 1];
  const forming: Record<string, ZBar | null> = { H1: { d: '2026-10-23T19:00', o: last.c, h: last.c, l: last.c, c: last.c }, H4: null, D1: null, W1: null, MN: null };
  return { closed, forming, price: last.c, at: AT, feed: 'test' };
}
function liveStock(): LiveStock {
  const daily = bars(fixture.stocks[0].daily), p = daily[daily.length - 1].c;
  const m15 = daily.slice(-120).map((b, i) => ({ ...b, d: new Date(Date.parse('2026-10-20T13:30:00Z') + i * 900000).toISOString().slice(0, 16) }));
  return { daily, partial: null, h1: [{ d: '2026-10-29T09:00', o: p, h: p + 1, l: p - 1, c: p }], m15, price: p, at: AT, feed: 'test' };
}
function ctx(extra: Partial<Ctx> = {}): Ctx {
  return { now: new Date(AT), imageUrl: (s, v, ver) => `https://img.test/?img=${s}&tf=${v}&v=${ver}`,
    async load(path: string) { return path === 'events.json' ? { kinds: {} } : read(`public/${path}`); }, ...extra };
}
const withLive = (scanOne?: Ctx['scanOne']) => ctx({ live: { fx: async () => liveFx(), stock: async () => liveStock() }, scanOne });

describe('live.ts', () => {
  it('forex-time labels (New York + 7 h) like fxcfg.label', () => {
    expect(nyOffset(Date.parse('2026-10-29T12:00:00Z'))).toBe(-4);
    expect(nyOffset(Date.parse('2026-11-03T12:00:00Z'))).toBe(-5);
    expect(fxLabel(Date.parse('2026-10-29T13:00:00Z'), 'H1')).toBe('2026-10-29T16:00');
    expect(fxLabel(Date.parse('2026-10-29T13:00:00Z'), 'H4')).toBe('2026-10-29T16:00');
    expect(fxLabel(Date.parse('2026-10-28T21:00:00Z'), 'D1')).toBe('2026-10-29T00:00');           // 17:00 New York = the new day
    expect(fxLabel(Date.parse('2026-10-23T21:00:00Z'), 'W1')).toBe('2026-10-24T00:00');           // Friday 17:00 New York = Saturday 00:00
    expect(fxLabel(Date.parse('2026-09-30T21:00:00Z'), 'MN')).toBe('2026-10-01T00:00');
    expect(fxLabel(Date.parse('2026-11-02T22:00:00Z'), 'D1')).toBe('2026-11-03T00:00');           // EST: 22:00 UTC
    expect(fxLabel(Date.parse('2026-10-29T13:45:00Z'), 'M15')).toBe('2026-10-29T16:45');
  });
  it('OANDA candles: bid, closed + the forming one', () => {
    const p = parseOanda({ candles: [
      { complete: true, time: '2026-10-29T12:00:00.000000000Z', bid: { o: '1.1', h: '1.2', l: '1.0', c: '1.15' } },
      { complete: false, time: '2026-10-29T13:00:00.000000000Z', bid: { o: '1.15', h: '1.16', l: '1.14', c: '1.155' } }] }, 'H1');
    expect(p.closed).toEqual([{ d: '2026-10-29T15:00', o: 1.1, h: 1.2, l: 1.0, c: 1.15 }]);
    expect(p.forming?.c).toBe(1.155);
  });
  it('oandaSource: one request per TF, bid + alignment, Bearer header, 30 s cache, failure = null', async () => {
    const urls: string[] = [];
    let t = AT, fail = false, fail15 = false;
    const candle = (i: number, complete = true) => ({ complete, time: new Date(Date.parse('2026-10-01T00:00:00Z') + i * 3600000).toISOString(), bid: { o: '1', h: '1.1', l: '0.9', c: String(1 + i / 1000) } });
    const f = async (u: string, init?: RequestInit) => {
      urls.push(u);
      expect((init?.headers as Record<string, string>).Authorization).toBe('Bearer tok');
      if (fail || (fail15 && u.includes('granularity=M15&'))) return new Response('no', { status: 401 });
      return new Response(JSON.stringify({ candles: [...Array.from({ length: 80 }, (_, i) => candle(i)), candle(80, false)] }));
    };
    const src = oandaSource('tok', { fetch: f, now: () => t });
    const a = await src('EUR_USD');
    expect(a?.price).toBe(1.08);
    expect(urls).toHaveLength(6);
    expect(urls[0]).toContain('/v3/instruments/EUR_USD/candles?granularity=M15&price=B&count=300&');
    expect(urls[1]).toContain('/v3/instruments/EUR_USD/candles?granularity=H1&price=B&count=400&alignmentTimezone=America%2FNew_York&dailyAlignment=17&weeklyAlignment=Friday');
    expect(urls.some(u => u.includes('granularity=M&'))).toBe(true);
    await src('EUR_USD');
    expect(urls).toHaveLength(6);                    // cached
    t += 31_000; fail15 = true;
    const b = await src('EUR_USD');                   // 15m refused: the rest still loads, 15m empty
    expect(b?.price).toBe(1.08);
    expect(b?.closed.M15).toEqual([]);
    t += 31_000; fail = true;
    expect(await src('EUR_USD')).toBeNull();          // expired + refused: null (the bot falls back to the scan)
    expect(await src('bad name')).toBeNull();
  });
  it('alpacaSource: SIP daily (IEX when refused), IEX 1-hour + latest trade, today bar is not closed', async () => {
    const urls: string[] = [];
    const day = (i: number) => ({ t: new Date(Date.parse('2026-06-01T04:00:00Z') + i * 86400000).toISOString(), o: 10, h: 11, l: 9, c: 10 + i / 100 });
    const f = async (u: string) => {
      urls.push(u);
      if (u.includes('feed=sip')) return new Response('forbidden', { status: 403 });
      if (u.includes('trades/latest')) return new Response(JSON.stringify({ trades: { 'BRK.B': { p: 12.34 } } }));
      if (u.includes('15Min')) return new Response(JSON.stringify({ bars: { 'BRK.B': [{ t: '2026-10-29T13:45:00Z', o: 1, h: 2, l: 0.5, c: 1.5 }] } }));
      if (u.includes('1Hour')) return new Response(JSON.stringify({ bars: { 'BRK.B': [{ t: '2026-10-29T13:00:00Z', o: 1, h: 2, l: 0.5, c: 1.5 }] } }));
      return new Response(JSON.stringify({ bars: { 'BRK.B': Array.from({ length: 151 }, (_, i) => day(i)) } }));
    };
    const s = await alpacaSource('id', 'sec', { fetch: f, now: () => Date.parse('2026-10-29T15:00:00Z') })('BRK.B');
    expect(s?.price).toBe(12.34);
    expect(s?.h1[0].d).toBe('2026-10-29T09:00');      // New York hour
    expect(s?.m15?.[0].d).toBe('2026-10-29T09:45');    // New York time, IEX 15-minute bars
    expect(urls.some(u => u.includes('timeframe=15Min') && u.includes('feed=iex'))).toBe(true);
    expect(urls.filter(u => u.includes('1Day')).map(u => /feed=(\w+)/.exec(u)![1])).toEqual(['sip', 'iex']);
    expect(s?.feed).toContain('IEX daily');
    expect(s?.partial?.d).toBe('2026-10-29');         // 11 AM New York: today's bar is still forming
    expect(splitPartial([{ d: '2026-10-29', o: 1, h: 1, l: 1, c: 1 }], Date.parse('2026-10-29T20:30:00Z')).partial).toBeNull();
  });
});

describe('bot with live data', () => {
  it('/zones: live price + zones computed on the live candles, labelled; signals still from the scan', async () => {
    const r = await handle('/zones EURUSD', withLive());
    expect(r.text).toContain('live · 7:42 AM');
    expect(r.text).toContain('zones + price live (OANDA)');
    expect(r.text).not.toContain(LIVE_HINT);
    const z = fxZonesOf(liveFx().closed, 0.0001, 5, liveFx().price)[0];
    expect(r.text).toContain(z.proximal.toFixed(5));
    const st = await handle('/zones XPEV', withLive());
    expect(st.text).toContain('zones + price live (Alpaca)');
    expect(st.text).toContain(stockZonesOf(liveStock().daily, liveStock().price)[0].proximal.toFixed(2));
  });
  it('without keys: as before, plus one hint line', async () => {
    const r = await handle('/zones EURUSD', ctx());
    expect(r.text.trim().endsWith(LIVE_HINT)).toBe(true);
    expect((await handle('/chart EURUSD', ctx())).text).toContain(LIVE_HINT);
    const down = await handle('/zones EURUSD', ctx({ live: { fx: async () => null } }));
    expect(down.text).toContain('latest scan shown');
  });
  it('/chart: live title + version, forming candle, stocks get a 1H view', async () => {
    const cd = (await chartData('EURUSD', 'Q', withLive()))!;
    expect(cd.live).toBe(true);
    expect(cd.model.title).toContain('live · 7:42 AM');
    expect(cd.v).toBe(`L${Math.floor(AT / 30000)}`);
    const h1 = cd.model.panels.find(p => p.tf === 'H4') ?? cd.model.panels[cd.model.panels.length - 1];
    expect(h1.bars.length).toBeGreaterThan(30);
    const one = (await chartData('EURUSD', 'H1', withLive()))!;
    expect(one.model.panels[0].bars[one.model.panels[0].bars.length - 1].t).toBe('2026-10-23T19:00');   // the forming candle
    expect(renderSvg(cd.model)).toContain('class="price"');
    const r = await handle('/chart XPEV 1h', withLive(async () => 'ok'));
    expect(r.photo).toContain('tf=H1');
    expect(JSON.stringify(r.buttons)).toContain('"callback_data":"s:XPEV"');
    expect((await handle('/chart XPEV 1h', ctx())).photo ?? '').not.toContain('tf=H1');   // no Alpaca keys: no 1H stock view
  });
  it('15m view (live only): own 15m zones + trendlines (HTF = 1H, gold), a 15m button; without live the 4 views + why', async () => {
    const cd = (await chartData('EURUSD', 'M15', withLive()))!;
    expect(cd.view).toBe('M15');
    const p = cd.model.panels[0];
    expect(p.tf).toBe('M15');
    expect(p.bars.length).toBeGreaterThan(60);
    expect(p.zones.some(z => z.tf === 'M15')).toBe(true);
    expect((p.tls ?? []).every(t => (t.htf ? t.tf === 'H1' : t.tf === 'M15'))).toBe(true);
    expect((p.tls ?? []).filter(t => t.htf).length).toBeLessThanOrEqual(2);
    expect(renderSvg(cd.model)).toContain('15m');
    const r = await handle('/chart EURUSD 15m', withLive());
    expect(r.photo).toContain('tf=M15');
    expect(JSON.stringify(r.buttons)).toContain('"callback_data":"c:EURUSD:M15"');
    const st = (await chartData('XPEV', 'M15', withLive()))!;
    expect(st.model.panels[0].tf).toBe('M15');
    expect(st.model.panels[0].bars.length).toBeGreaterThan(60);
    // live down: the 15m button answers with the 4 views + the live-down note
    const down = await handleCallback('c:EURUSD:M15', ctx({ live: { fx: async () => null } }));
    expect(down.photo).toContain('tf=Q');
    expect(down.text).toContain('15m needs live candles');
    expect(down.text).toContain('latest scan shown');
    expect(JSON.stringify((await handle('/chart EURUSD', ctx())).buttons)).not.toContain(':M15');   // no keys: no 15m button
  });
  it('/scan SYM + [🔄 Live scan]: dispatches one symbol, says ~1 min, rate-limit and no-token messages', async () => {
    const calls: string[] = [];
    let res: ScanResult = 'ok';
    const c = withLive(async (m, s) => { calls.push(`${m}:${s}`); return res; });
    const r = await handle('/scan eurusd', c);
    expect(r.text).toContain('Scanning EURUSD');
    expect(r.text).toContain('~1 min');
    const b = await handleCallback('s:XPEV', c);
    expect(b.text).toContain('Scanning XPEV');
    expect(calls).toEqual(['fx:EURUSD', 'stock:XPEV']);
    res = 'limited';
    expect((await handle('/scan EURUSD', c)).text).toContain('limit');
    expect((await handle('/scan EURUSD', ctx())).text).toContain('needs a GitHub token');
    expect((await handle('/scan EURUDS', c)).text).toContain('/scan EURUSD');
    const z = await handle('/zones EURUSD', c);
    expect(JSON.stringify(z.buttons)).toContain('"callback_data":"s:EURUSD"');
    expect(JSON.stringify((await handle('/zones EURUSD', ctx())).buttons)).not.toContain('s:EURUSD');
  });
});

describe('stock 4H from 30-minute bars', () => {
  it('two regular-session candles a day, extended hours dropped', async () => {
    const { sessionH4 } = await import('../../supabase/functions/telegram-bot/live.ts');
    const b = (d: string, o: number, h: number, l: number, c: number) => ({ d, o, h, l, c });
    const out = sessionH4([b('2026-10-28T08:00', 1, 9, 0, 1), b('2026-10-28T09:30', 10, 12, 9, 11), b('2026-10-28T13:00', 11, 15, 10, 14),
      b('2026-10-28T13:30', 14, 14, 12, 13), b('2026-10-28T15:30', 13, 16, 13, 15), b('2026-10-28T16:00', 15, 20, 15, 19), b('2026-10-29T09:30', 15, 15, 14, 14)]);
    expect(out).toEqual([b('2026-10-28T09:30', 10, 15, 9, 14), b('2026-10-28T13:30', 14, 16, 12, 15), b('2026-10-29T09:30', 15, 15, 14, 14)]);
  });
});
