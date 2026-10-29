// The Telegram bot's commands (supabase/functions/telegram-bot/logic.ts) against the published scanner files.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMMANDS, clock, handle, helpText, lev, parseCommand, shortPct, zoned, esc, NY, type Ctx } from '../../supabase/functions/telegram-bot/logic';

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
    expect(parseCommand('/zones EURUSD')).toEqual({ cmd: 'zones', arg: 'EURUSD' });
    expect(parseCommand('/Zones@RamanFXBot  nvda more')).toEqual({ cmd: 'zones', arg: 'nvda' });
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
    const sat = await handle('/times', ctx('2026-10-31T18:00:00Z'));
    expect(sat.text).toContain('Weekend');
  });

  it('/next: next NFP, CPI, FOMC with unverified marks', async () => {
    const r = await handle('/next', ctx('2026-10-29T15:00:00Z'));
    expect(r.text).toContain('Fed decision (FOMC)');
    expect(r.text).toContain('Dec 9');
    expect(r.text).toContain('Nov 6');           // NFP fallback (not verified)
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
});
