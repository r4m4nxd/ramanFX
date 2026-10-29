// Telegram bot headlines (supabase/functions/telegram-bot/headlines.ts + news.ts): parsing untrusted feeds, symbol ->
// keyword mapping, ranking, formatting, the loader with a mocked fetch, and the /news, /news SYM, n:SYM wiring.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { ago, decode, forSymbol, headlineLoader, latestLine, parseAlpaca, parseDate, parseRss, plainText, relevance, similar, symMap, symbolLines, TERMS, topHeadlines, topLines, type Headline } from '../../supabase/functions/telegram-bot/headlines';
import { newsButton, withLatest, withTopHeadlines } from '../../supabase/functions/telegram-bot/news';
import { handle, handleCallback, type Ctx, type Reply } from '../../supabase/functions/telegram-bot/logic';
import { breakingMarkup, breakingText, inQuiet, pickBreaking, watchedTags } from '../../supabase/functions/trader-coach/breaking';

const NOW = Date.parse('2026-10-29T16:30:00Z');     // 10:30 AM Calgary
const H = 3600_000;
const h = (title: string, hoursAgo: number, o: Partial<Headline> = {}): Headline =>
  ({ id: `${o.source ?? 'x'}:${title}`, t: NOW - hoursAgo * H, title, summary: '', url: 'https://example.com/a', source: 'investingLive', syms: [], ...o });

const RSS_IL = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>investingLive</title>
<item><title><![CDATA[ECB holds rates, Lagarde says <b>risks</b> are balanced]]></title><pubDate>Thu, 29 Oct 2026 13:15:12 GMT</pubDate>
<link>https://investinglive.com/news/ecb-holds/</link><description><![CDATA[<ul><li>Deposit rate 2.00%</li></ul><p>The ECB left rates unchanged. More text follows here.</p><script>alert(1)</script>]]></description></item>
<item><title>No date here</title><link>https://investinglive.com/x</link></item>
<item><title>Evil &lt;script&gt;alert(1)&lt;/script&gt; title &amp; more</title><pubDate>Thu, 29 Oct 2026 12:00:00 GMT</pubDate><link>javascript:alert(1)</link></item>
</channel></rss>`;
const RSS_INV = `<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>Forex News</title>
<item><enclosure url="https://x/y.jpg" length="1" type="image/jpeg"/><title>Canadian dollar strengthens as traders assess BoC hike</title>
<pubDate>2026-10-29 15:32:09</pubDate><author>Investing.com</author><link>https://www.investing.com/news/forex-news/cad-1</link></item></channel></rss>`;
const ALPACA = { news: [
  { id: 1, headline: 'Nvidia Shares Jump After Record Data-Center Revenue', summary: '<p>Nvidia beat estimates on data-center demand. Guidance was strong.</p>', created_at: '2026-10-29T15:00:00Z', url: 'https://www.benzinga.com/1', source: 'benzinga', symbols: ['NVDA'] },
  { id: 2, headline: 'Bitcoin Tops $120,000 As ETF Demand Builds', summary: '', created_at: '2026-10-29T14:00:00Z', url: 'https://www.benzinga.com/2', source: 'benzinga', symbols: ['BTCUSD'] },
  { id: 3, headline: '10 Stocks Moving In Thursday\'s Pre-Market Session', summary: '', created_at: '2026-10-29T16:00:00Z', url: 'https://www.benzinga.com/3', source: 'benzinga', symbols: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NVDA'] },
  { id: 4, headline: 'no date', symbols: [] },
] };

describe('headlines: parsing untrusted feeds', () => {
  it('RSS: CDATA, tags and scripts stripped, entities decoded, bad links dropped, undated items skipped', () => {
    const items = parseRss(RSS_IL, 'investingLive');
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe('ECB holds rates, Lagarde says risks are balanced');
    expect(items[0].summary).toBe('Deposit rate 2.00% The ECB left rates unchanged.');
    expect(items[0].url).toBe('https://investinglive.com/news/ecb-holds/');
    expect(items[0].t).toBe(Date.parse('2026-10-29T13:15:12Z'));
    expect(items[1].title).toBe('Evil title & more');      // encoded tags removed after decoding
    expect(items[1].url).toBe('');
    expect(parseRss('<html>Just a moment...</html>', 'x')).toEqual([]);
    expect(parseRss(null, 'x')).toEqual([]);
  });
  it("Investing.com's 'YYYY-MM-DD HH:MM:SS' dates are UTC", () => {
    expect(parseRss(RSS_INV, 'Investing.com')[0].t).toBe(Date.parse('2026-10-29T15:32:09Z'));
    expect(parseDate('Thu, 29 Oct 2026 14:11:31 GMT')).toBe(Date.parse('2026-10-29T14:11:31Z'));
    expect(Number.isNaN(parseDate('soon'))).toBe(true);
  });
  it('Alpaca JSON: headline, first summary sentence, symbol tags, source', () => {
    const a = parseAlpaca(ALPACA);
    expect(a).toHaveLength(3);
    expect(a[0]).toMatchObject({ title: 'Nvidia Shares Jump After Record Data-Center Revenue', summary: 'Nvidia beat estimates on data-center demand.', syms: ['NVDA'], source: 'Benzinga' });
    expect(parseAlpaca({})).toEqual([]);
  });
  it('decode / plainText are safe on odd input', () => {
    expect(decode('&#60;&#x3e;&amp;&bogus;&#0;')).toBe('<>&&bogus;');
    expect(plainText('<a href="x">A</a>\u0000 b   c')).toBe('A b c');
    expect(plainText('x'.repeat(400), 50).length).toBeLessThanOrEqual(50);
  });
});

describe('headlines: symbols -> keywords', () => {
  it('maps FX pairs, metals, indices, crypto and stocks', () => {
    expect(symMap('EURUSD')).toMatchObject({ kind: 'fx', main: ['EUR'], side: ['USD'], tags: [] });
    expect(symMap('XAUUSD')).toMatchObject({ kind: 'metal', main: ['XAU'], tags: ['GLD'] });
    expect(symMap('US30')).toMatchObject({ kind: 'cfd', main: ['US30'], tags: ['DIA'] });
    expect(symMap('BTCUSD')).toMatchObject({ kind: 'crypto', main: ['BTC'], tags: ['BTCUSD'] });
    expect(symMap('AVAXUSD')).toMatchObject({ kind: 'crypto', tags: ['AVAXUSD'] });
    expect(symMap('NVDA')).toMatchObject({ kind: 'stock', tags: ['NVDA'] });
    expect(symMap('BRK.B').tags).toEqual(['BRK.B']);
  });
  it('relevance: tag / pair name 3, base keyword 2+, quote only 1, unrelated 0 (word boundaries)', () => {
    const eu = symMap('EURUSD');
    expect(relevance(h('EUR/USD climbs to 1.10', 1), eu)).toBe(3);
    expect(relevance(h('ECB holds rates, Lagarde cautious', 1), eu)).toBe(2.5);
    expect(relevance(h('Powell says the Fed can wait', 1), eu)).toBe(1);
    expect(relevance(h('Federated Hermes earnings', 1), eu)).toBe(0);           // 'fed' needs a word boundary
    expect(relevance(h('Gold hits a record as yields fall', 1), symMap('XAUUSD'))).toBe(2.5);
    expect(relevance(h('Dow drops 400 points', 1), symMap('US30'))).toBe(2.5);
    expect(relevance(h('Stocks slip', 1, { syms: ['NVDA'] }), symMap('NVDA'))).toBe(3);
    expect(relevance(h('Stocks slip', 1, { syms: ['AAPL'] }), symMap('NVDA'))).toBe(0);
  });
  it('the Python jobs use the same keyword table (tools/news/headline_terms.json)', () => {
    const py = JSON.parse(readFileSync('tools/news/headline_terms.json', 'utf8'));
    expect(py.terms).toEqual(TERMS);
  });
});

describe('headlines: ranking + formatting', () => {
  const list = [
    h('Fed cuts rates by 25 bp, Powell signals pause', 2, { source: 'CNBC' }),
    h('ECB holds rates, Lagarde says risks are balanced', 3),
    h('Nvidia shares jump after record revenue', 1, { source: 'Benzinga', syms: ['NVDA'] }),
    h('10 Stocks Moving In Thursday\'s Pre-Market Session', 0.5, { source: 'Benzinga', syms: ['A', 'B', 'C', 'D', 'E', 'F', 'G'] }),
    h('Fed cuts rates by 25 bp; Powell signals a pause', 2.1, { source: 'Investing.com' }),
    h('Old news about the dollar', 40),
    h('Bitcoin tops $120,000 as ETF demand builds', 2.5, { source: 'Benzinga', syms: ['BTCUSD'] }),
  ];
  it('top: market-moving first, noise and near-duplicates dropped', () => {
    const top = topHeadlines(list, NOW, 5).map(x => x.title);
    expect(top[0]).toBe('Fed cuts rates by 25 bp, Powell signals pause');
    expect(top).toContain('Nvidia shares jump after record revenue');
    expect(top).not.toContain('10 Stocks Moving In Thursday\'s Pre-Market Session');
    expect(top.filter(t => /Fed cuts/.test(t))).toHaveLength(1);
    expect(top).not.toContain('Old news about the dollar');
    expect(similar('Fed cuts rates by 25 bp, Powell signals pause', 'Fed cuts rates by 25 bp; Powell signals a pause')).toBe(true);
  });
  it('per symbol: newest first, base keywords before quote-only, at most n', () => {
    const eu = forSymbol(list, 'EURUSD', NOW, 6).map(x => x.title);
    expect(eu[0]).toBe('ECB holds rates, Lagarde says risks are balanced');
    expect(forSymbol(list, 'NVDA', NOW).map(x => x.title)).toEqual(['Nvidia shares jump after record revenue']);
    expect(forSymbol(list, 'BTCUSD', NOW)[0].title).toMatch(/Bitcoin/);
  });
  it('formats: escaped, linked, time ago, calm', () => {
    const evil = [h('A <b>bold</b> & "quoted" move in gold', 2, { url: 'https://x.test/?a=1&b=2' })];
    const l = latestLine('XAUUSD', evil, NOW);
    expect(l).toBe('📰 latest: <a href="https://x.test/?a=1&amp;b=2">A &lt;b&gt;bold&lt;/b&gt; &amp; "quoted" move in gold</a> · 2h ago');
    expect(latestLine('XAUUSD', [h('Gold slips', 30)], NOW)).toBe('');           // older than 24 h
    expect(latestLine('XAUUSD', [h('Gold up', 1, { url: 'https://x.test/"><script>' })], NOW)).not.toContain('<a href');   // unsafe link dropped
    expect(ago(NOW - 5 * 60_000, NOW)).toBe('5m ago');
    expect(ago(NOW - 50 * H, NOW)).toBe('2d ago');
    const sl = symbolLines('EURUSD', list, NOW).join('\n');
    expect(sl).toContain('📰 <b>EURUSD · latest headlines</b>');
    expect(sl).toContain('3h ago · 7:30 AM · investingLive');                 // Calgary clock (UTC-6)
    expect(symbolLines('EURUSD', null, NOW).join('\n')).toContain('did not load');
    expect(symbolLines('EURUSD', [], NOW).join('\n')).toContain('No headlines');
    const tl = topLines(list, NOW);
    expect(tl[0]).toBe('📰 <b>Top headlines</b>');
    expect(tl.length).toBeLessThanOrEqual(6);
    expect(topLines([], NOW)).toEqual([]);
  });
  it('the top block goes after the key events, before the calendar', () => {
    const lines = withTopHeadlines(['📰 <b>Economic news</b>', '⏰ CPI', '', '<b>Today</b>', 'x'], list, new Date(NOW));
    expect(lines.slice(0, 4)).toEqual(['📰 <b>Economic news</b>', '⏰ CPI', '', '📰 <b>Top headlines</b>']);
    expect(lines.slice(-3)).toEqual(['', '<b>Today</b>', 'x']);
  });
  it('withLatest adds one line before the footer (text) or the last caption line (photo)', async () => {
    const ctx = { now: new Date(NOW), load: async () => [h('Gold jumps as the dollar slides', 2)] } as unknown as Ctx;
    const text: Reply = { cmd: 'zones', text: 'head\nzone 1\n\nfooter' };
    expect((await withLatest('XAUUSD', ctx, Promise.resolve(text))).text).toMatch(/^head\nzone 1\n\n📰 latest: .*Gold jumps.* · 2h ago\n\nfooter$/);
    const photo: Reply = { cmd: 'chart', text: 'title\nfoot', photo: 'https://img' };
    expect((await withLatest('XAUUSD', ctx, Promise.resolve(photo))).text.split('\n')[1]).toMatch(/^📰 latest:/);
    const none = { now: new Date(NOW), load: async () => null } as unknown as Ctx;
    expect((await withLatest('XAUUSD', none, Promise.resolve(text))).text).toBe(text.text);
    expect(newsButton('EURUSD')).toEqual([{ text: '📰 News', callback_data: 'n:EURUSD' }]);
  });
});

describe('headlines: loader (mocked fetch)', () => {
  const resp = (body: string, status = 200) => new Response(body, { status });
  it('merges Alpaca + RSS, sends the Alpaca keys as headers, caches, survives failures', async () => {
    const calls: { url: string; headers: Record<string, string> }[] = [];
    const f = async (url: string, init?: RequestInit) => {
      calls.push({ url, headers: (init?.headers ?? {}) as Record<string, string> });
      if (url.includes('alpaca')) return resp(JSON.stringify(ALPACA));
      if (url.includes('investinglive')) return resp(RSS_IL);
      if (url.includes('news_1.rss')) return resp(RSS_INV);
      return resp('<html>blocked</html>', 403);
    };
    const logs: Record<string, unknown>[] = [];
    const load = headlineLoader({ fetch: f, alpaca: { id: 'kid', secret: 'sec' }, log: o => logs.push(o) });
    const top = (await load('headlines/top'))!;
    expect(top.some(x => x.source === 'Benzinga')).toBe(true);
    expect(top.some(x => x.source === 'investingLive')).toBe(true);
    const a = calls.find(c => c.url.includes('alpaca'))!;
    expect(a.headers['APCA-API-KEY-ID']).toBe('kid');
    expect(a.url).not.toContain('symbols=');
    expect(logs.some(l => l.ev === 'headlines_src' && l.status === 403)).toBe(true);
    expect(JSON.stringify(logs)).not.toContain('sec');
    const n = calls.length;
    await load('headlines/top');
    expect(calls.length).toBe(n);                                                  // cached
    await load('headlines/sym/NVDA');
    expect(calls[calls.length - 1].url).toContain('symbols=NVDA');
    expect(calls.length).toBe(n + 1);                                              // stocks: Alpaca only
    await load('headlines/sym/XAUUSD');
    expect(calls[calls.length - 1].url).toContain('symbols=GLD');
    expect(await load('headlines/../../etc')).toBeNull();
  });
  it('no keys and every feed down -> null', async () => {
    const load = headlineLoader({ fetch: async () => { throw new Error('offline'); } });
    expect(await load('headlines/top')).toBeNull();
    expect(await load('headlines/sym/NVDA')).toBeNull();
  });
});

describe('headlines: bot commands', () => {
  const FX = { map: [{ sym: 'EURUSD', cls: 'major', oanda: 'EUR_USD', k: 'major' }] };
  const IX = { tickers: [{ s: 'NVDA', n: 'NVIDIA', k: 1 }] };
  const list = [h('ECB holds rates, Lagarde says risks are balanced', 3), h('Nvidia shares jump', 1, { source: 'Benzinga', syms: ['NVDA'] }), h('Fed cuts rates, Powell signals pause', 2, { source: 'CNBC' })];
  const ctx = (seen: string[] = []): Ctx => ({ now: new Date(NOW), async load(p: string) {
    seen.push(p);
    if (p === 'fx/latest.json') return FX;
    if (p === 'scanner/index.json') return IX;
    if (p.startsWith('headlines/')) return list;
    return null;
  } });
  it('/news SYM, the n:SYM button and /news with the top block', async () => {
    const seen: string[] = [];
    const r = await handle('/news eurusd', ctx(seen));
    expect(r.cmd).toBe('news');
    expect(r.text).toContain('EURUSD · latest headlines');
    expect(r.text).toContain('ECB holds rates');
    expect(seen).toContain('headlines/sym/EURUSD');
    expect((await handleCallback('n:NVDA', ctx())).text).toContain('Nvidia shares jump');
    const all = await handle('/news', ctx());
    expect(all.text).toContain('📰 <b>Top headlines</b>');
    expect(all.text).toContain('Calendar unavailable');                          // calendar null in this ctx: still shown
    expect((await handle('/near', ctx())).cmd).not.toBe('news');
    expect((await handleCallback('n', ctx())).cmd).not.toBe('news');             // 'n' stays /near
  });
});

describe('breaking news alerts (trader-coach/breaking.ts)', () => {
  const art = (id: number, title: string, minAgo: number, syms: string[]): Headline =>
    ({ id: `alpaca:${id}`, t: NOW - minAgo * 60_000, title, summary: 'One line summary.', url: `https://www.benzinga.com/${id}`, source: 'Benzinga', syms });
  const prefs = { mutes: [{ sym: 'TSLA', until_utc: '2026-11-05T00:00:00Z' }] };
  it('watched + held symbols -> Alpaca tags; muted ones and plain FX pairs left out', () => {
    const t = watchedTags(['NVDA', 'TSLA', 'EURUSD', 'XAUUSD'], ['BTCUSD'], prefs, NOW);
    expect([...t.entries()]).toEqual([['BTCUSD', 'BTCUSD'], ['NVDA', 'NVDA'], ['GLD', 'XAUUSD']]);
  });
  it('only tagged, fresh, non-noise articles; 1 per symbol per 3 h; 6 a day; nothing in quiet hours', () => {
    const tags = watchedTags(['NVDA', 'AMD'], [], prefs, NOW);
    const items = [
      art(1, 'Nvidia Wins Big Government AI Contract', 5, ['NVDA']),
      art(2, 'Nvidia Shares Extend Gains', 8, ['NVDA']),                         // same symbol: within 3 h of #1
      art(3, 'AMD Price Target Raised To $200', 6, ['AMD']),                     // noise
      art(4, 'Chip Stocks Round-Up', 4, ['NVDA', 'AMD', 'INTC', 'MU']),          // too many tags
      art(5, 'AMD Unveils New Data-Center Chip', 50, ['AMD']),                   // not fresh
      art(6, 'AMD Unveils New Data-Center Chip', 10, ['AMD']),
    ];
    expect(pickBreaking(items, tags, [], NOW, false).map(p => [p.sym, p.h.id])).toEqual([['NVDA', 'alpaca:1'], ['AMD', 'alpaca:6']]);
    expect(pickBreaking(items, tags, [{ sym: 'NVDA', at: NOW - 2 * H }], NOW, false).map(p => p.sym)).toEqual(['AMD']);
    expect(pickBreaking(items, tags, [{ sym: 'NVDA', at: NOW - 4 * H }], NOW, false).map(p => p.sym)).toEqual(['NVDA', 'AMD']);
    const six = Array.from({ length: 6 }, (_, i) => ({ sym: `X${i}`, at: NOW - 3 * H }));   // 7:30 AM Calgary: same day
    expect(pickBreaking(items, tags, six, NOW, false)).toEqual([]);
    expect(pickBreaking(items, tags, [], NOW, true)).toEqual([]);
  });
  it('quiet window wraps midnight on the Calgary clock', () => {
    const q = { from: '22:00', to: '06:00', tz: 'America/Edmonton' };
    expect(inQuiet(q, Date.parse('2026-10-29T05:00:00Z'))).toBe(true);       // 11 PM Calgary
    expect(inQuiet(q, NOW)).toBe(false);                                      // 10:30 AM
    expect(inQuiet(null, NOW)).toBe(false);
  });
  it('message: escaped, linked, calm, buttons to the bot', () => {
    const p = pickBreaking([art(1, 'Nvidia <Wins> & more', 5, ['NVDA'])], watchedTags(['NVDA'], [], prefs, NOW), [], NOW, false)[0];
    const t = breakingText(p, NOW, 'watch');
    expect(t).toContain('📰 <b>NVDA · breaking</b>');
    expect(t).toContain('<a href="https://www.benzinga.com/1">Nvidia &lt;Wins&gt; &amp; more</a>');
    expect(t).toContain('<i>5m ago · 10:25 AM · Benzinga</i>');
    expect(t).toContain('One line summary.');
    expect(t).toContain('on your watch list');
    expect(breakingMarkup('NVDA').inline_keyboard[0].map(b => b.callback_data)).toEqual(['n:NVDA', 'c:NVDA']);
  });
});
