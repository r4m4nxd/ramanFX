// Telegram bot owner preferences (supabase/functions/telegram-bot/prefs.ts + the /alert ... commands in logic.ts),
// the scanners' prefs key and the setup workflow's Mini App menu button.
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { handle, handleCallback, helpText, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { keyOk, memoryStore, parseClock, parseDuration, parsePrice, parseQuiet, parseTap, restStore, sha256Hex } from '../../supabase/functions/telegram-bot/prefs';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const NOW = '2026-10-29T15:00:00Z';
function ctx(store = memoryStore(), now = NOW): Ctx & { prefs: ReturnType<typeof memoryStore> } {
  return { now: new Date(now), prefs: store, async load(path: string) { return path === 'events.json' ? { kinds: {} } : read(`public/${path}`); } };
}
const fxPx = (sym: string) => (read('public/fx/latest.json').map as { sym: string; px: number }[]).find(r => r.sym === sym)!.px;
const dataOf = (b: unknown) => (b as { callback_data?: string }).callback_data;

describe('prefs parsing', () => {
  it('commands: durations, clocks, quiet windows, prices', () => {
    expect(parseDuration('')).toBe(86400000);
    expect(parseDuration('1w')).toBe(7 * 86400000);
    expect(parseDuration('12h')).toBe(12 * 3600000);
    expect(parseDuration('91d')).toBeNull();
    expect(parseDuration('soon')).toBeNull();
    expect(parseClock('6am')).toBe('06:00');
    expect(parseClock('10:30pm')).toBe('22:30');
    expect(parseClock('12am')).toBe('00:00');
    expect(parseClock('24:00')).toBeNull();
    expect(parseQuiet('22:00-06:00')).toEqual({ from: '22:00', to: '06:00' });
    expect(parseQuiet('10pm - 6am')).toEqual({ from: '22:00', to: '06:00' });
    expect(parseQuiet('22 6')).toEqual({ from: '22:00', to: '06:00' });
    expect(parseQuiet('off')).toBeNull();
    expect(parseQuiet('22:00-22:00')).toBeUndefined();
    expect(parseQuiet('later')).toBeUndefined();
    expect(parsePrice('2,650.5')).toBe(2650.5);
    expect(parsePrice('1.0850')).toBe(1.085);
    expect(parsePrice('-3')).toBeNull();
    expect(parsePrice('zone')).toBeNull();
  });

  it('callback data: m:SYM:7, r:SYM:0.2, d:ID, u:SYM (<= 64 bytes), junk refused', () => {
    expect(parseTap('m:EURUSD:7')).toEqual({ op: 'mute', sym: 'EURUSD', days: 7 });
    expect(parseTap('r:BRK.B:0.2')).toEqual({ op: 'pct', sym: 'BRK.B', pct: 0.2 });
    expect(parseTap('d:12')).toEqual({ op: 'del', id: 12 });
    expect(parseTap('u:XAUUSD')).toEqual({ op: 'unmute', sym: 'XAUUSD' });
    for (const bad of ['m:EURUSD:0', 'm:EURUSD:99', 'r:EURUSD:0', 'r:EURUSD:20', 'd:x', 'm:EUR USD:7', 'z:EURUSD', '']) expect(parseTap(bad)).toBeNull();
  });
});

describe('prefs key', () => {
  it('accepts only the key whose sha256 is stored (hex, constant-time compare)', async () => {
    const token = '123456:TEST-not-a-real-token';
    const key = createHash('sha256').update(`${token}:prefs`).digest('hex');      // what the scanners compute
    const stored = createHash('sha256').update(key).digest('hex');                 // what setup.py registers
    expect(await sha256Hex(key)).toBe(stored);
    expect(await keyOk(key, stored)).toBe(true);
    expect(await keyOk(key.toUpperCase(), stored)).toBe(false);
    expect(await keyOk(stored, stored)).toBe(false);                               // the stored hash is not a key
    expect(await keyOk(`${key.slice(0, 63)}0`, stored)).toBe(false);
    expect(await keyOk(null, stored)).toBe(false);
    expect(await keyOk(key, null)).toBe(false);
    expect(await keyOk(token, stored)).toBe(false);
  });
});

describe('prefs store', () => {
  it('memory store CRUD, prefs JSON shape of the scanner contract', async () => {
    const s = memoryStore(), now = new Date(NOW);
    const a = await s.addAlert({ sym: 'XAUUSD', kind: 'price', level: 2650, dir: 'above' });
    const b = await s.addAlert({ sym: 'NVDA', kind: 'zone' });
    await s.mute('EURUSD', new Date(now.getTime() + 86400000), now);
    await s.mute('GBPUSD', new Date(now.getTime() - 1000), now);
    await s.setQuiet({ from: '22:00', to: '06:00' });
    await s.watch('AUDNZD'); await s.watch('AUDNZD');
    let p = await s.get(now);
    expect(p).toEqual({
      mutes: [{ sym: 'EURUSD', until_utc: '2026-10-30T15:00:00.000Z' }],
      alerts: [{ id: a, sym: 'XAUUSD', kind: 'price', level: 2650, dir: 'above' }, { id: b, sym: 'NVDA', kind: 'zone' }],
      quiet: { from: '22:00', to: '06:00', tz: 'America/Edmonton' },
      watch: ['AUDNZD'],
    });
    expect(await s.fired(a, now)).toBe(true);
    expect(await s.fired(a, now)).toBe(false);
    expect(await s.delAlert(b)).toBe(true);
    expect(await s.unwatch('AUDNZD')).toBe(true);
    expect(await s.unmute('EURUSD')).toBe(true);
    await s.setQuiet(null);
    p = await s.get(now);
    expect(p).toEqual({ mutes: [], alerts: [], quiet: null, watch: [] });
  });

  it('REST store: PostgREST paths, filters and upserts', async () => {
    const calls: { m: string; u: string; b?: unknown; prefer?: string }[] = [];
    const f = async (u: string, i?: { method?: string; headers?: Record<string, string>; body?: string }) => {
      calls.push({ m: i?.method ?? 'GET', u: u.replace('https://x.supabase.co/rest/v1/', ''), b: i?.body ? JSON.parse(i.body) : undefined, prefer: i?.headers?.Prefer });
      const path = u.split('/rest/v1/')[1];
      let body: unknown = [];
      if (path.startsWith('rfx_bot_alerts?fired_at')) body = [{ id: 7, sym: 'NVDA', kind: 'zone', level: null, dir: null, pct: null }];
      else if (path.startsWith('rfx_bot_config')) body = [{ quiet_from: '22:00', quiet_to: '06:00' }];
      else if (path.startsWith('rfx_bot_watch?select')) body = [{ sym: 'AMD' }];
      else if (i?.method === 'POST' && path.startsWith('rfx_bot_alerts')) body = [{ id: 9 }];
      else if (i?.method === 'DELETE' || i?.method === 'PATCH') body = [{ id: 1 }];
      return { ok: true, status: 200, json: async () => body };
    };
    const s = restStore('https://x.supabase.co', { apikey: 'k' }, f);
    expect(await s.get(new Date(NOW))).toEqual({ mutes: [], alerts: [{ id: 7, sym: 'NVDA', kind: 'zone' }], quiet: { from: '22:00', to: '06:00', tz: 'America/Edmonton' }, watch: ['AMD'] });
    expect(calls.map(c => c.u)).toContain(`rfx_bot_mutes?until_utc=gt.${encodeURIComponent('2026-10-29T15:00:00.000Z')}&select=sym,until_utc&order=sym`);
    calls.length = 0;
    expect(await s.addAlert({ sym: 'XAUUSD', kind: 'pct', pct: 0.2, level: 2600 })).toBe(9);
    expect(calls[0]).toMatchObject({ m: 'POST', b: { sym: 'XAUUSD', kind: 'pct', level: 2600, dir: null, pct: 0.2 } });
    expect(await s.fired(9, new Date(NOW))).toBe(true);
    expect(calls[1]).toMatchObject({ m: 'PATCH', u: 'rfx_bot_alerts?id=eq.9&fired_at=is.null&select=id', b: { fired_at: '2026-10-29T15:00:00.000Z' } });
    await s.mute('EURUSD', new Date('2026-11-05T15:00:00Z'), new Date(NOW));
    expect(calls[2]).toMatchObject({ m: 'POST', u: 'rfx_bot_mutes?on_conflict=sym', prefer: 'resolution=merge-duplicates,return=minimal' });
    await expect(restStore('https://x.supabase.co', {}, async () => ({ ok: false, status: 500, json: async () => null })).get(new Date())).rejects.toThrow('prefs');
  });
});

describe('prefs commands', () => {
  it('/alert SYM PRICE: direction from the current price; /alert SYM zone; validation', async () => {
    const c = ctx();
    const px = fxPx('EURUSD');
    const up = await handle(`/alert eurusd ${(px * 1.01).toFixed(5)}`, c);
    expect(up.text).toContain('Alert #1 set');
    expect(up.text).toContain('↑ above');
    const down = await handle(`/alert EURUSD ${(px * 0.99).toFixed(5)}`, c);
    expect(down.text).toContain('↓ below');
    expect((await handle('/alert NVDA zone', c)).text).toContain('enters any strong zone');
    expect((await handle('/alert NVDA zone', c)).text).toContain('Already set');
    expect((await c.prefs.get(c.now)).alerts.map(a => [a.sym, a.kind, a.dir ?? null])).toEqual([['EURUSD', 'price', 'above'], ['EURUSD', 'price', 'below'], ['NVDA', 'zone', null]]);
    expect((await handle('/alert EURUSD', c)).text).toContain('/alert XAUUSD 2650');
    expect((await handle('/alert EURUSD lots', c)).text).toContain('not a price');
    expect((await handle('/alert EURUSD 9', c)).text).toContain('more than 50%');
    expect((await handle('/alert ZZZQQ 1', c)).text).toContain('not found');
  });

  it('/alerts lists with 🗑 buttons; tapping one deletes it and edits the list; /unalert', async () => {
    const c = ctx();
    await handle('/alert NVDA zone', c);
    await handle(`/alert EURUSD ${(fxPx('EURUSD') * 1.02).toFixed(5)}`, c);
    const l = await handle('/alerts', c);
    expect(l.text).toContain('Alerts · 2');
    expect(l.text).toContain('Quiet hours');
    expect(l.buttons!.flat().map(dataOf)).toEqual(['d:1', 'd:2']);
    const tap = await handleCallback('d:1', c);
    expect(tap.edit).toBe(true);
    expect(tap.toast).toContain('#1 deleted');
    expect(tap.text).toContain('Alerts · 1');
    expect((await handle('/unalert 2', c)).text).toContain('deleted');
    expect((await handle('/unalert 2', c)).text).toContain('No open alert');
  });

  it('/mute, /unmute, buttons m:SYM:7 and r:SYM:0.2 on the symbol card', async () => {
    const c = ctx();
    expect((await handle('/mute eurusd 1w', c)).text).toContain('EURUSD</b> muted until Thu Nov 5');
    expect((await c.prefs.get(c.now)).mutes).toEqual([{ sym: 'EURUSD', until_utc: '2026-11-05T15:00:00.000Z' }]);
    expect((await handle('/mute EURUSD forever', c)).text).toContain('not a duration');
    expect((await handle('/unmute EURUSD', c)).text).toContain('unmuted');
    const card = await handle('/zones EURUSD', c);
    expect(card.buttons!.flat().map(dataOf)).toEqual(expect.arrayContaining(['m:EURUSD:7', 'r:EURUSD:0.2']));
    const noDb = await handle('/zones EURUSD', { ...c, prefs: undefined });
    expect(noDb.buttons!.flat().map(dataOf)).not.toContain('m:EURUSD:7');
    const m = await handleCallback('m:EURUSD:7', c);
    expect(m.toast).toBe('EURUSD muted');
    const r = await handleCallback('r:EURUSD:0.2', c);
    expect(r.text).toContain('within 0.2% of the nearest strong zone');
    const a = (await c.prefs.get(c.now)).alerts[0];
    expect(a).toMatchObject({ sym: 'EURUSD', kind: 'pct', pct: 0.2 });
    expect(typeof a.level).toBe('number');
    expect((await handleCallback('r:EURUSD:0.2', c)).text).toContain('Already set');
    for (const b of card.buttons!.flat()) if (dataOf(b)) expect(new TextEncoder().encode(dataOf(b)).length).toBeLessThanOrEqual(64);
  });

  it('/quiet and /watch', async () => {
    const c = ctx();
    expect((await handle('/quiet', c)).text).toContain('off');
    expect((await handle('/quiet 22:00-06:00', c)).text).toContain('22:00–06:00');
    expect((await c.prefs.get(c.now)).quiet).toEqual({ from: '22:00', to: '06:00', tz: 'America/Edmonton' });
    expect((await handle('/quiet nonsense', c)).text).toContain('/quiet off');
    await handle('/quiet off', c);
    expect((await c.prefs.get(c.now)).quiet).toBeNull();
    expect((await handle('/watch audnzd', c)).text).toContain('AUDNZD</b> added');
    expect((await handle('/watch AUDNZD', c)).text).toContain('already');
    expect((await handle('/watch', c)).text).toContain('AUDNZD');
    expect((await handle('/unwatch AUDNZD', c)).text).toContain('removed');
    expect((await c.prefs.get(c.now)).watch).toEqual([]);
  });

  it('no database / a failing one: a calm notice', async () => {
    const c = ctx();
    expect((await handle('/alerts', { ...c, prefs: undefined })).text).toContain('not available');
    const broken = { ...memoryStore(), get: async () => { throw new Error('down'); } };
    expect((await handle('/alerts', ctx(broken as ReturnType<typeof memoryStore>))).text).toContain('not available');
  });

  it('help lists the Alerts group', () => {
    const h = helpText();
    expect(h).toContain('<b>Alerts</b>');
    for (const c of ['/alert', '/alerts', '/mute', '/quiet', '/watch']) expect(h).toContain(c);
  });
});

describe('Mini App setup payload', () => {
  it('menu_button.json: a web_app button opening the site', () => {
    const mb = read('tools/telegram_bot/menu_button.json');
    expect(mb).toEqual({ type: 'web_app', text: 'RamanFX', web_app: { url: 'https://raman-fx.vercel.app/' } });
    const py = readFileSync('tools/telegram_bot/setup.py', 'utf8');
    expect(py).toContain("tg('setChatMenuButton', {'chat_id': chat, 'menu_button': menu_button})");
    expect(py).toContain("'op': 'prefs-key'");
    expect(py).not.toMatch(/print\([^)]*\{key\}[^)]*\)(?<!add-mask::\{key\}'\))/);
  });
});
