// The Telegram bot's commands (supabase/functions/telegram-bot/logic.ts) against the published scanner files.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMMANDS, clock, handle, handleCallback, helpText, lev, parseCommand, shortPct, zoned, esc, NY, MAIN_KEYBOARD, chartData, symButtons, parseTf, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { renderSvg, boxes, geom, SIZE } from '../../supabase/functions/telegram-bot/chart';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const EUR_HOURS = {
  s: 'EURUSD', n: 'EUR_USD', k: 'major', g: 'FX MAJORS', d: 'EUR/USD', i: '', wl: true, y: ['2005-01-02', '2026-10-28', 21.8],
  t: [['08:00', '10:00', '06:00', '10:00', 2.01, 41.6], ['01:00', '03:00', '00:30', '02:00', 1.41, 15.8]],
  tr: 'reliable', th: 0.97, w: ['Wed', 'Mon', 1.06, 1.02, 1.1, 'reliable'], dd: [0.97, 0.99, 1.03, 1.02, 1.0],
  e: [0.98, 0.95, '08:00', '07:30', '08:00', false], nfp: [2.75, 250, 79.2, 31.2], f12: [3.1, 160, 87.5, 6.9], f1230: null, p: [],
};
const EVENTS = { kinds: { fomc: { events: [{ date: '2026-10-28', et: '14:00', verified: true }, { date: '2026-12-09', et: '14:00', verified: true }] }, nfp: { events: [] }, cpi: { events: [] } } };

function ctx(now = '2026-10-29T15:00:00Z', extra: Record<string, unknown> = {}, dispatch?: () => Promise<boolean>): Ctx {
  return {
    now: new Date(now),
    dispatch,
    imageUrl: (sym, view, v) => `https://img.test/?img=${sym}&tf=${view}&v=${v}`,
    async load(path: string) {
      if (path in extra) return extra[path];
      if (path === 'events.json') return EVENTS;
      return read(`public/${path}`);
    },
  };
}
const visibleLen = (s: string) => s.length;
const noRawLt = (s: string) => expect(s.replace(/<\/?(b|i|code)>/g, '')).not.toMatch(/<(?!\/)/);

describe('telegram bot', () => {
  it('menu list in commands.json matches the code', () => {
    const json = read('supabase/functions/telegram-bot/commands.json');
    expect(json).toEqual(COMMANDS.map(c => ({ command: c.command, description: c.description })));
    for (const c of COMMANDS) expect(c.description.length).toBeLessThanOrEqual(40);
  });

  it('parses commands, @bot suffixes and arguments', () => {
    expect(parseCommand('/zones EURUSD')).toEqual({ cmd: 'zones', arg: 'EURUSD', arg2: '', rest: 'EURUSD' });
    expect(parseCommand('/Zones@RamanFXBot  nvda more')).toEqual({ cmd: 'zones', arg: 'nvda', arg2: 'more', rest: 'nvda more' });
    expect(parseCommand('EURUSD')).toBeNull();
    expect(lev('EURUDS', 'EURUSD')).toBe(2);
    expect(esc(shortPct(0.01))).toBe('&lt;0.1%');
  });

  it('/help and /start list every command, grouped', async () => {
    for (const t of ['/help', '/start']) {
      const r = await handle(t, ctx());
      for (const c of COMMANDS) expect(r.text).toContain(`/${c.command}`);
      expect(r.text).toContain('<b>Markets</b>');
      expect(r.text).toContain('<b>Symbol lookup</b>');
      expect(r.text).toContain('<b>Times</b>');
    }
    expect(helpText().length).toBeLessThan(4096);
  });

  it('/guide and /howto: a short cheat sheet with link buttons to the app guide', async () => {
    for (const t of ['/guide', '/howto']) {
      const r = await handle(t, ctx());
      expect(r.cmd).toBe('guide');
      expect(r.text.length).toBeLessThan(1500);
      noRawLt(r.text);
      const urls = (r.buttons ?? []).flat().map(b => ('url' in b ? b.url : ''));
      expect(urls).toContain('https://raman-fx.vercel.app/guide');
      for (const u of urls) expect(u).toMatch(/^https:\/\/raman-fx\.vercel\.app\/guide/);
    }
  });

  it('/fx, /stocks, /signals, /near fit one message and use percent, never pips', async () => {
    for (const t of ['/fx', '/stocks', '/signals', '/near']) {
      const r = await handle(t, ctx());
      expect(visibleLen(r.text)).toBeLessThan(4096);
      expect(r.text).not.toMatch(/pips?\b/i);
      expect(r.text).toContain('not advice');
      expect(r.text).not.toContain('unavailable');
      noRawLt(r.text);
    }
    const st = read('public/scanner/latest.json');
    const s = await handle('/stocks', ctx());
    for (const sig of st.signals.slice(0, 3)) expect(s.text).toContain(`<b>${sig.symbol}</b>`);
    const n = await handle('/near', ctx());
    expect(n.text).toMatch(/Within 1% of a zone/);
  });

  it('/zones and a bare symbol show every timeframe with status', async () => {
    const fx = await handle('/zones eurusd', ctx());
    expect(fx.text).toContain('<b>EURUSD</b> · FX');
    expect(fx.text).toMatch(/<b>(MN|W1|D1|4H|1H)<\/b>/);
    expect(fx.text).toMatch(/in it|away|above|below/);
    expect(fx.text.length).toBeLessThan(4096);
    noRawLt(fx.text);
    const bare = await handle('XAUUSD', ctx());
    expect(bare.text).toContain('<b>XAUUSD</b> · FX');
    const nv = await handle('NVDA', ctx());
    expect(nv.text).toContain('<b>NVDA</b>');
    expect(nv.text).toMatch(/<b>(W1|MN|3M)<\/b>/);
    const brk = await handle('/zones brk-b', ctx());
    expect(brk.text).toContain('<b>BRK.B</b>');
    const typo = await handle('/zones EURUDS', ctx());
    expect(typo.text).toContain('not found');
    expect(typo.text).toContain('/zones EURUSD');
    expect((await handle('/zones', ctx())).text).toContain('/zones EURUSD');
  });

  it('/times: New York times on the Calgary clock by zone rules', async () => {
    expect(clock(zoned('2026-10-29', '08:30', NY))).toBe('6:30 AM');
    const r = await handle('/times', ctx('2026-10-29T15:00:00Z'));
    expect(r.text).toContain('Thu Oct 29');
    expect(r.text).toContain('6:30 AM · US data');
    expect(r.text).toContain('7:30 AM · NYSE opens');
    const fomc = await handle('/times', ctx('2026-10-28T15:00:00Z'));
    expect(fomc.text).toContain('Fed decision (FOMC) today · 12:00 PM');
    expect(clock(zoned('2026-11-02', '08:30', NY))).toBe('7:30 AM');   // EST + permanent Alberta UTC-6 (tzdata 2026c)
    expect(clock(zoned('2026-10-30', '09:30', NY))).toBe('7:30 AM');
    const nov = await handle('/times', ctx('2026-11-02T15:00:00Z'));
    expect(nov.text).toContain('7:30 AM · US data');
    const sat = await handle('/times', ctx('2026-10-31T18:00:00Z'));
    expect(sat.text).toContain('Weekend');
  });

  it('/next: next NFP, CPI, FOMC with unverified marks', async () => {
    const r = await handle('/next', ctx('2026-10-29T15:00:00Z'));
    expect(r.text).toContain('Fed decision (FOMC)');
    expect(r.text).toContain('Dec 9');
    expect(r.text).toContain('Fri Nov 6 · 7:30 AM');   // NFP fallback (not verified); Calgary UTC-6 all year from Nov 1
    expect(r.text).toContain('Wed Dec 9 · 1:00 PM');
    expect(r.text).toContain('date not verified');
  });

  it('/hours: study results, or "still running" when absent', async () => {
    const none = await handle('/hours EURUSD', ctx(undefined, { 'research/market_hours_by_symbol.json': null }));
    expect(none.text).toContain('still running');
    const f = { meta: { synthetic: false }, symbols: [EUR_HOURS] };
    const r = await handle('/hours eur/usd', ctx('2026-10-29T15:00:00Z', { 'research/market_hours_by_symbol.json': f }));
    expect(r.text).toContain('<b>EURUSD</b>');
    expect(r.text).toContain('8:00 AM (10:00 New York)');
    expect(r.text).toContain('Best day: Wed');
    const miss = await handle('/hours EURUDS', ctx(undefined, { 'research/market_hours_by_symbol.json': f }));
    expect(miss.text).toContain('/hours EURUSD');
  });

  it('/scan without a token says so; with one it dispatches', async () => {
    expect((await handle('/scan', ctx())).text).toContain('needs a GitHub token');
    let called = 0;
    const r = await handle('/scan', ctx(undefined, {}, async () => { called++; return true; }));
    expect(called).toBe(1);
    expect(r.text).toContain('Scan started');
  });

  it('unknown text gets a short hint; missing data a calm notice', async () => {
    expect((await handle('hello there friend', ctx())).text).toContain('/help');
    expect((await handle('/whatever', ctx())).text).toContain('/help');
    const r = await handle('/fx', ctx(undefined, { 'fx/latest.json': null }));
    expect(r.text).toContain('unavailable');
  });

  it('quick-reply keyboard: persistent, its button texts run the commands', async () => {
    expect(MAIN_KEYBOARD.is_persistent).toBe(true);
    expect(MAIN_KEYBOARD.resize_keyboard).toBe(true);
    const labels = MAIN_KEYBOARD.keyboard.flat().map(b => b.text);
    expect(labels).toEqual(['💱 FX', '📈 Stocks', '⏳ Near', '📋 Signals', '🕐 Times', '📅 Next']);
    expect((await handle('💱 FX', ctx())).cmd).toBe('fx');
    expect((await handle('⏳ Near', ctx())).cmd).toBe('near');
    expect((await handle('next', ctx())).cmd).toBe('next');
    const h = await handle('/start', ctx());
    expect(h.keyboard).toBe(true);
  });

  it('inline buttons: callback_data <= 64 bytes, zones / chart / TF / short codes', async () => {
    const rows = symButtons(['EURUSD', 'BRK.B', 'EURUSD']);
    expect(rows).toHaveLength(2);
    expect(rows[0].map(b => ('callback_data' in b ? b.callback_data : ''))).toEqual(['z:EURUSD', 'c:EURUSD']);
    const fx = await handle('/fx', ctx());
    const all = (fx.buttons ?? []).flat();
    expect(all.some(b => 'callback_data' in b && b.callback_data.startsWith('z:'))).toBe(true);
    expect(all.some(b => 'url' in b)).toBe(true);                       // the app link stays
    for (const b of all) if ('callback_data' in b) expect(new TextEncoder().encode(b.callback_data).length).toBeLessThanOrEqual(64);
    const z = await handle('/zones EURUSD', ctx());
    const zb = (z.buttons ?? []).flat().map(b => ('callback_data' in b ? b.callback_data : ''));
    expect(zb).toEqual(expect.arrayContaining(['c:EURUSD', 'c:EURUSD:MN', 'c:EURUSD:W1', 'c:EURUSD:D1', 'c:EURUSD:H4', 'c:EURUSD:H1']));
    expect((await handleCallback('z:EURUSD', ctx())).text).toContain('<b>EURUSD</b> · FX');
    const q = await handleCallback('c:EURUSD', ctx());
    expect(q.photo).toContain('tf=Q');
    expect(q.edit).toBe(false);
    const one = await handleCallback('c:EURUSD:H4', ctx());
    expect(one.photo).toContain('tf=H4');
    expect(one.edit).toBe(true);
    expect((await handleCallback('n', ctx())).cmd).toBe('near');
    expect((await handleCallback('bogus:data:here:x', ctx())).text).toContain('/help');
    expect(parseTf('4h')).toBe('H4');
    expect(parseTf('w')).toBe('W1');
  });

  it('/chart: 4-timeframe photo by default, one TF with a TF, stocks 3M MN W1 D1', async () => {
    const r = await handle('/chart EURUSD', ctx());
    expect(r.photo).toMatch(/img=EURUSD&tf=Q&v=\d+/);
    expect(r.text).toContain('<b>EURUSD</b>');
    expect(r.text).toContain('not advice');
    const one = await handle('/chart EURUSD 4h', ctx());
    expect(one.photo).toContain('tf=H4');
    const st = await handle('/chart XPEV', ctx());
    expect(st.text).toContain('3M MN W1 D1');
    expect((await handle('/chart EURUSD X9', ctx())).text).toContain('Unknown timeframe');
  });

  it('chart model: 4 panels top-down, nesting host, trade lines on the entry TF only', async () => {
    const fx = await chartData('EURUSD', 'Q', ctx());
    const tfs = fx!.model.panels.map(p => p.tf);
    expect([['MN', 'W1', 'D1', 'H4'], ['W1', 'D1', 'H4', 'H1']]).toContainEqual(tfs);
    for (const p of fx!.model.panels) expect(p.bars.length).toBeGreaterThan(5);
    const st = await chartData('XPEV', 'Q', ctx());
    expect(st!.model.panels.map(p => p.tf)).toEqual(['3M', 'MN', 'W1', 'D1']);
    const sig = read('public/scanner/latest.json').signals.find((x: { symbol: string }) => x.symbol === 'XPEV');
    const withLines = st!.model.panels.filter(p => p.lines);
    expect(withLines.map(p => p.tf)).toEqual([sig.tf]);
    expect(withLines[0].lines!.entry).toBe(sig.entry);
    // nesting: a host zone overlaps the next-lower panel's key zone
    const gold = await chartData('XAUUSD', 'Q', ctx());
    const panels = gold!.model.panels;
    const i = panels.findIndex(p => p.zones.some(z => z.host));
    expect(i).toBeGreaterThanOrEqual(0);
    const host = panels[i].zones.find(z => z.host)!, lowKey = panels[i + 1].zones.find(z => z.key)!;
    expect(Math.max(Math.min(host.prox, host.dist), Math.min(lowKey.prox, lowKey.dist))).toBeLessThanOrEqual(Math.min(Math.max(host.prox, host.dist), Math.max(lowKey.prox, lowKey.dist)));
    expect(host.side).toBe(lowKey.side);
  });

  it('chart SVG: 1280 square, 4 panels, zones inside the plot, labels, price line', async () => {
    const cd = await chartData('EURUSD', 'Q', ctx());
    const svg = renderSvg(cd!.model);
    expect(svg).toContain(`width="${SIZE}" height="${SIZE}"`);
    expect(svg.match(/class="panel"/g)).toHaveLength(4);
    expect(svg.match(/class="price"/g)).toHaveLength(4);
    expect(svg).toContain('not advice');
    expect(svg).toContain(`EURUSD · ${cd!.model.price.toFixed(5)}`);
    const bx = boxes('quad', 4);
    cd!.model.panels.forEach((p, k) => {
      const g = geom(p, bx[k], cd!.model.price);
      const body = svg.split('<g class="panel"')[k + 1];
      expect(body.startsWith(` data-tf="${p.tf}"`)).toBe(true);
      for (const m of body.matchAll(/class="zone[^"]*"[^>]* y="([\d.]+)" width="[\d.]+" height="([\d.]+)"/g)) {
        expect(+m[1]).toBeGreaterThanOrEqual(g.plot.y - 0.1);
        expect(+m[1] + +m[2]).toBeLessThanOrEqual(g.plot.y + g.plot.h + 0.1);
      }
      expect(body).toContain(`>${p.tf === 'H4' ? '4H' : p.tf === 'H1' ? '1H' : p.tf}</tspan>`);
    });
    expect(svg).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u);                  // no emoji (no emoji font on the edge)
    const one = renderSvg((await chartData('EURUSD', 'H4', ctx()))!.model);
    expect(one.match(/class="panel"/g)).toHaveLength(1);
    expect(one).toMatch(/class="zlabel"[^>]*>[^<]*4H (demand|supply) \d/);
  });

  it('chart trendlines: own TF solid lilac + next higher TF gold dots, at most 2 + 2 per panel (shard tls on short bars)', async () => {
    const shard = read('public/fx/d/major.json');
    const eu = shard.instruments.EURUSD;
    const h4 = eu.bars.H4 as [string, number, number, number, number][];
    const last = h4[h4.length - 1], d1 = eu.bars.D1 as [string, number, number, number, number][];
    const lowD1 = Math.min(...d1.slice(-30).map(r => r[3]));
    eu.tls = { H4: [{ dir: -1, p: last[2] + 0.002, s: -0.0001, n: 40, t: last[0], touches: 2, x: false }],
      W1: [{ dir: 1, p: lowD1 - 0.001, s: 0.0005, n: 30, t: eu.bars.W1.at(-1)[0], x: true }], D1: [], MN: [] };
    const c = ctx(undefined, { 'fx/d/major.json': shard });
    const one = renderSvg((await chartData('EURUSD', 'H4', c))!.model);
    expect(one).toMatch(/class="tl ltf down" data-tf="H4"/);
    expect(one).toContain('>4H down</text>');
    const q = renderSvg((await chartData('EURUSD', 'Q', c))!.model);
    expect(q).toContain('>W1 up (crossed)</text>');
    expect(q).toMatch(/class="tl htf up" data-tf="W1"[^>]*stroke="#D4AF37"[^>]*stroke-dasharray/);   // W1 line on the D1 panel
    for (const p of (await chartData('EURUSD', 'Q', c))!.model.panels) {
      expect((p.tls ?? []).filter(t => !t.htf).length).toBeLessThanOrEqual(2);
      expect((p.tls ?? []).filter(t => t.htf).length).toBeLessThanOrEqual(2);
      expect((p.tls ?? []).every(t => t.htf ? t.tf !== p.tf : t.tf === p.tf)).toBe(true);
    }
    expect(q).toContain('gold dots = higher-TF trendline');
  });

  it('/ask and questions ending with ?: lesson quotes (BM25), <= 1500 chars, open-lesson buttons', async () => {
    const r = await handle('/ask what is a proximal line', ctx());
    expect(r.cmd).toBe('ask');
    expect(r.text.length).toBeLessThanOrEqual(1500);
    expect(r.text).toMatch(/<b>1\. /);
    expect(r.text.toLowerCase()).toContain('proximal');
    expect(r.text).toContain('not advice');
    const urls = (r.buttons ?? []).flat().map(b => ('url' in b ? b.url : ''));
    expect(urls.length).toBeGreaterThanOrEqual(2);
    for (const u of urls) expect(u).toMatch(/^https:\/\/raman-fx\.vercel\.app\/learn\?/);
    noRawLt(r.text);
    const q = await handle('How many base candles?', ctx());
    expect(q.cmd).toBe('ask');
    expect(q.text.toLowerCase()).toMatch(/base|candle/);
    expect((await handle('/ask', ctx())).text).toContain('/ask what is a proximal line');
    expect((await handle('/ask zzqqxx', ctx())).text).toContain('Nothing in the lessons');
  });

  it('/news: today\'s high-impact events in Calgary time; calm notice when the calendar is down', async () => {
    const cal = { status: 'ok', result: [
      { title: 'GDP Growth Rate QoQ', country: 'US', importance: 1, date: '2026-10-29T12:30:00.000Z' },
      { title: 'ECB Interest Rate Decision', country: 'EU', importance: 1, date: '2026-10-29T13:15:00.000Z' },
      { title: 'Retail Sales', country: 'AU', importance: 0, date: '2026-10-29T00:30:00.000Z' },
      { title: 'Tomorrow thing', country: 'US', importance: 1, date: '2026-10-30T12:30:00.000Z' },
    ] };
    const r = await handle('/news', ctx('2026-10-29T13:00:00Z', { 'news.json': cal }));
    expect(r.text).toContain('Thu Oct 29');
    expect(r.text).toContain('<s><b>6:30 AM</b> · 🇺🇸 US GDP Growth Rate QoQ</s>');   // passed
    expect(r.text).toContain('<b>7:15 AM</b> · 🇪🇺 EU ECB Interest Rate Decision');
    expect(r.text).toContain('<b>Tomorrow morning · Fri Oct 30</b>');               // 6:30 AM Fri
    expect(r.text).not.toContain('Retail Sales');                                   // Oct 28 6:30 PM Calgary
    expect((await handle('/news', ctx(undefined, { 'news.json': null }))).text).toContain('Calendar unavailable');
  });
});

