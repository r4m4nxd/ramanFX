// Guests of the Telegram bot (supabase/functions/telegram-bot/guests.ts): onboarding, owner admin, permissions, and that
// no reply to a guest carries the owner's data (alerts, mutes, quiet hours, watch list, journal, health).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMMANDS, OWNER_COMMANDS, OWNER_ONLY, handle, helpText, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { memoryStore } from '../../supabase/functions/telegram-bot/prefs';
import {
  ALL_MARKETS, DEFAULT_MARKETS, MAX_GUESTS, guestCallback, guestCtx, guestKey, guestMessage, guestStore, limiter, marketsOf, memoryGuests,
  ownerAdmin, strangerReply, type Guest, type GuestEnv, type WelcomeResult,
} from '../../supabase/functions/telegram-bot/guests';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const NOW = new Date('2026-10-29T15:00:00Z');
const OWNER_ID = '111111111', GUEST_ID = 222222222;

async function ownerSetup() {
  const owner = memoryStore();
  await owner.addAlert({ sym: 'XAUUSD', kind: 'price', level: 2633.37, dir: 'below' });
  await owner.mute('QQQZ', new Date(NOW.getTime() + 7 * 86400000), NOW);
  await owner.setQuiet({ from: '21:17', to: '05:43' });
  await owner.watch('ZZWW');
  return owner;
}
function baseCtx(owner: ReturnType<typeof memoryStore>, extra: Partial<Ctx> = {}): Ctx {
  return {
    now: NOW, prefs: owner,
    imageUrl: (sym, view, v) => `https://img.test/?img=${sym}&tf=${view}&v=${v}`,
    health: async () => 'OWNER-HEALTH-SECRET',
    async load(path: string) { return path === 'events.json' ? { kinds: {} } : read(`public/${path}`); },
    ...extra,
  } as Ctx;
}
const guestRow = (prefs = {}): Guest => ({ chat_id: GUEST_ID, name: 'Bro', added_at: NOW.toISOString(), active: true, prefs });

// Strings that would only appear when the owner's data reached a guest reply.
const OWNER_MARKERS = ['2633.37', 'QQQZ', '21:17', '05:43', 'ZZWW', 'OWNER-HEALTH-SECRET', 'Planner'];
const noOwnerData = (t: string, cmd: string) => { for (const m of OWNER_MARKERS) expect(t, `${cmd} leaked ${m}`).not.toContain(m); };

describe('telegram bot guests', () => {
  it('unknown chat: /start answers its ID, rate-limited; anything else is ignored', () => {
    const lim = { chat: limiter(1, 600_000), all: limiter(30, 3600_000) };
    const r = strangerReply('/start', 987654321, lim, 0);
    expect(r?.text).toContain('Ask the owner to add you');
    expect(r?.text).toContain('Your ID: <code>987654321</code>');
    expect(r?.keyboard).toBeFalsy();
    expect(strangerReply('/start', 987654321, lim, 1000)).toBeNull();          // again within 10 min: silent
    expect(strangerReply('/start', 987654321, lim, 700_000)).not.toBeNull();
    expect(strangerReply('/fx', 5555555, lim, 0)).toBeNull();
    expect(strangerReply('EURUSD', 5555555, lim, 0)).toBeNull();
    const all = { chat: limiter(1, 600_000), all: limiter(2, 3600_000) };
    expect(strangerReply('/start', 1000001, all, 0)).not.toBeNull();
    expect(strangerReply('/start', 1000002, all, 0)).not.toBeNull();
    expect(strangerReply('/start', 1000003, all, 0)).toBeNull();               // global cap
  });

  it('owner /adduser /users /removeuser: cap of 5, welcome to the guest, default markets stocks only', async () => {
    const db = memoryGuests();
    const sent: { id: number; text: string; markup: unknown }[] = [];
    const env = { db, isOwner: async (id: string) => id === OWNER_ID, welcome: async (id: number, text: string, markup: unknown): Promise<WelcomeResult> => { sent.push({ id, text, markup }); return 'sent'; } };
    expect(await ownerAdmin('/fx', env)).toBeNull();
    const r = await ownerAdmin(`/adduser ${GUEST_ID} My Brother`, env);
    expect(r?.text).toContain('My Brother');
    expect(r?.text).toContain('welcome');
    expect(db.rows[0]).toMatchObject({ chat_id: GUEST_ID, name: 'My Brother', active: true });
    expect(marketsOf(db.rows[0].prefs)).toEqual(['stocks']);
    expect(sent[0].id).toBe(GUEST_ID);
    expect(sent[0].text).toContain('/markets');
    expect(sent[0].text).not.toContain('/took');
    expect(sent[0].text).not.toContain('/adduser');
    expect(JSON.stringify(sent[0].markup)).toContain('keyboard');
    expect((await ownerAdmin(`/adduser ${OWNER_ID}`, env))?.text).toContain('your own ID');
    expect((await ownerAdmin('/adduser bob', env))?.text).toContain('numeric ID');
    await ownerAdmin('/adduser 300000001 Cousin all', env);
    expect(marketsOf(db.rows[1].prefs)).toEqual(ALL_MARKETS);
    expect(db.rows[1].name).toBe('Cousin');
    for (let i = 2; i < MAX_GUESTS; i++) await ownerAdmin(`/adduser 30000000${i}`, env);
    expect(db.rows.filter(g => g.active)).toHaveLength(MAX_GUESTS);
    expect((await ownerAdmin('/adduser 399999999', env))?.text).toContain('the most');
    const u = await ownerAdmin('/users', env);
    expect(u?.text).toContain(`${MAX_GUESTS}/${MAX_GUESTS}`);
    expect(u?.text).toContain(String(GUEST_ID));
    expect((await ownerAdmin('/removeuser 300000001', env))?.text).toContain('removed');
    expect(db.rows.find(g => g.chat_id === 300000001)).toBeUndefined();
    expect((await ownerAdmin('/removeuser 300000001', env))?.text).toContain('not on the list');
    // re-adding keeps their choice of markets
    await db.setPrefs(GUEST_ID, { markets: ['stocks', 'crypto'] });
    await ownerAdmin(`/adduser ${GUEST_ID}`, env);
    expect(marketsOf(db.rows.find(g => g.chat_id === GUEST_ID)!.prefs)).toEqual(['stocks', 'crypto']);
    const blocked = await ownerAdmin('/adduser 400000001 X', { ...env, welcome: async () => 'blocked' as const });
    expect(blocked?.text).toContain('/start');
    const broken = await ownerAdmin('/users', { ...env, db: { ...db, list: async () => { throw new Error('no table'); } } });
    expect(broken?.text).toContain('not available');
  });

  it('owner-only commands are refused for guests; /help shows guests no owner command', async () => {
    const owner = await ownerSetup();
    const db = memoryGuests([guestRow()]);
    const env: GuestEnv = { db };
    for (const c of OWNER_ONLY) {
      const r = await guestMessage(`/${c} EURUSD buy 1.0850 sl 1.0820 tp 1.0910`, db.rows[0], baseCtx(owner), env);
      expect(r.cmd, c).toBe('owner-only');
      noOwnerData(r.text, c);
    }
    const h = await guestMessage('/help', db.rows[0], baseCtx(owner), env);
    expect(h.keyboard).toBe(true);
    for (const c of COMMANDS) {
      if (OWNER_ONLY.has(c.command)) expect(h.text, c.command).not.toContain(`/${c.command} `);
      else expect(h.text, c.command).toContain(`/${c.command}`);
    }
    for (const c of OWNER_COMMANDS) expect(h.text).not.toContain(`/${c.command}`);
    expect(helpText('owner')).toContain('/adduser');
    const g = await guestMessage('/guide', db.rows[0], baseCtx(owner), env);
    expect(g.text).not.toContain('/took');
  });

  it('every guest command and button answers without the owner data, and never changes the owner prefs', async () => {
    const owner = await ownerSetup();
    const before = JSON.stringify(await owner.get(NOW));
    const db = memoryGuests([guestRow()]);
    const scans: string[] = [];
    const env: GuestEnv = { db, scanOneFor: async (_m, s) => { scans.push(s); return 'ok'; }, dispatch: async () => true, scans: limiter(3, 3600_000) };
    const texts = ['/help', '/start', '/guide', '/fx', '/stocks', '/signals', '/near', '/zones EURUSD', '/chart EURUSD', '/chart EURUSD 15m', '/hours EURUSD',
      '/fund EURUSD', '/times', '/next', '/news', '/ask what is a proximal line', 'what is a proximal line?', 'EURUSD', 'NVDA',
      '/alerts', '/watch', '/quiet', '/alert EURUSD zone', '/alert XAUUSD 2000', '/mute EURUSD 1w', '/unmute EURUSD', '/quiet 22:00-06:00', '/watch NVDA',
      '/unwatch NVDA', '/unalert 1', '/alerts', '/markets', '/scan EURUSD', '/scan', '💱 FX', 'hello'];
    for (const t of texts) {
      const r = await guestMessage(t, db.rows[0], baseCtx(owner), env);
      noOwnerData(r.text, t);
      for (const b of (r.buttons ?? []).flat()) noOwnerData(JSON.stringify(b), `${t} button`);
    }
    for (const d of ['z:EURUSD', 'c:EURUSD', 'c:EURUSD:H4', 'n:EURUSD', 'f:EURUSD', 'n', 'f', 'g', 'h', 't', 'x', 'm:EURUSD:7', 'r:EURUSD:0.2', 'u:EURUSD', 'd:1', 'd:2', 's:EURUSD', 'mk:crypto']) {
      const r = await guestCallback(d, db.rows[0], baseCtx(owner), env);
      noOwnerData(r.text, d);
    }
    expect(JSON.stringify(await owner.get(NOW))).toBe(before);
    expect(scans).toEqual(['EURUSD', 'EURUSD']);       // /scan EURUSD + [s:EURUSD]; /scan (all) took the third
    // the guest's own settings were saved in their row
    const p = db.rows[0].prefs;
    expect(p.quiet).toEqual({ from: '22:00', to: '06:00' });
    expect(marketsOf(p)).toEqual(['stocks', 'crypto']);
  });

  it('a guest sees only their own alerts / mutes / quiet hours / watch list', async () => {
    const owner = await ownerSetup();
    const db = memoryGuests([guestRow({ alerts: [{ id: 7, sym: 'NVDA', kind: 'zone' }], mutes: [{ sym: 'TSLA', until_utc: '2026-11-30T00:00:00Z' }], quiet: { from: '23:00', to: '07:00' }, watch: ['AAPL'], next: 8 })]);
    const r = await guestMessage('/alerts', db.rows[0], baseCtx(owner), { db });
    expect(r.text).toContain('#7 <b>NVDA</b>');
    expect(r.text).toContain('TSLA');
    expect(r.text).toContain('23:00');
    expect(r.text).toContain('AAPL');
    noOwnerData(r.text, '/alerts');
    const o = await handle('/alerts', baseCtx(owner));            // the owner's own view is untouched
    expect(o.text).toContain('XAUUSD');
    expect(o.text).toContain('ZZWW');
    expect(o.text).not.toContain('NVDA</b> · enters');
  });

  it('guest /scan: 3 an hour per guest (the card goes to them); the global cap still applies', async () => {
    const owner = await ownerSetup();
    const db = memoryGuests([guestRow()]);
    let n = 0;
    const env: GuestEnv = { db, scanOneFor: async () => (++n > 2 ? 'limited' : 'ok'), scans: limiter(3, 3600_000) };
    const out: string[] = [];
    for (let i = 0; i < 4; i++) out.push((await guestMessage('/scan EURUSD', db.rows[0], baseCtx(owner), env)).text);
    expect(out[0]).toContain('Scanning EURUSD');
    expect(out[2]).toContain('limit reached');         // global cap answered 'limited'
    expect(out[3]).toContain('3 an hour for you');      // own cap
    expect(n).toBe(3);
  });

  it('guest ctx carries no owner data source', async () => {
    const owner = await ownerSetup();
    const c = guestCtx(baseCtx(owner), guestRow(), { db: memoryGuests([guestRow()]) });
    expect(c.role).toBe('guest');
    expect(c.prefs).not.toBe(owner);
    expect(c.health).toBeUndefined();
    expect(c.scanOne).toBeUndefined();
    expect(c.dispatch).toBeUndefined();
  });

  it('guest prefs store: alerts numbered per guest, fired ones drop out, mutes expire', async () => {
    let p: object = {};
    const s = guestStore(async () => p, async x => { p = x; });
    const a = await s.addAlert({ sym: 'NVDA', kind: 'zone' }), b = await s.addAlert({ sym: 'AAPL', kind: 'price', level: 200, dir: 'above' });
    expect([a, b]).toEqual([1, 2]);
    expect(await s.fired(1, NOW)).toBe(true);
    expect(await s.fired(1, NOW)).toBe(false);
    expect((await s.get(NOW)).alerts.map(x => x.id)).toEqual([2]);
    await s.mute('TSLA', new Date(NOW.getTime() + 3600_000), NOW);
    expect((await s.get(NOW)).mutes).toHaveLength(1);
    expect((await s.get(new Date(NOW.getTime() + 7200_000))).mutes).toHaveLength(0);
    expect(await s.unwatch('X')).toBe(false);
    expect(marketsOf(p)).toEqual(DEFAULT_MARKETS);
  });

  it('/markets toggles in place; unknown markets are ignored', async () => {
    const owner = await ownerSetup();
    const db = memoryGuests([guestRow()]);
    const m = await guestMessage('/markets', db.rows[0], baseCtx(owner), { db });
    expect(m.text).toContain('✅ Stocks');
    expect(m.text).toContain('▫️ Forex &amp; metals');
    expect((m.buttons ?? []).flat().map(b => ('callback_data' in b ? b.callback_data : ''))).toEqual(['mk:stocks', 'mk:crypto', 'mk:fx', 'mk:indices']);
    const t = await guestCallback('mk:fx', db.rows[0], baseCtx(owner), { db });
    expect(t.edit).toBe(true);
    expect(t.toast).toBe('Forex & metals on');
    expect(marketsOf(db.rows[0].prefs)).toEqual(['stocks', 'fx']);
    await guestCallback('mk:stocks', db.rows[0], baseCtx(owner), { db });
    expect(marketsOf(db.rows[0].prefs)).toEqual(['fx']);
    expect(marketsOf({ markets: ['bogus', 'crypto'] })).toEqual(['crypto']);
    expect((await handle('/markets', baseCtx(owner))).text).toContain('You get everything');
  });

  it('guest key: 12 hex of sha256(chat id), same as tools/stock_scanner/guests.py', async () => {
    expect(await guestKey(GUEST_ID)).toMatch(/^[0-9a-f]{12}$/);
    expect(await guestKey('222222222')).toBe(await guestKey(GUEST_ID));
    expect(await guestKey(222222222)).toBe('342e489174cc');
  });

  it('owner menu file lists the admin commands; the public menu has no owner-only command', () => {
    const own = read('supabase/functions/telegram-bot/commands_owner.json');
    expect(own.commands).toEqual(OWNER_COMMANDS.map(c => ({ command: c.command, description: c.description })));
    for (const c of OWNER_COMMANDS) expect(OWNER_ONLY.has(c.command)).toBe(true);
    // tools/telegram_bot/setup.py hides these from the default (guests') menu: every owner-only command of the menu
    expect([...own.hide_from_guests].sort()).toEqual(COMMANDS.map(c => c.command).filter(c => OWNER_ONLY.has(c)).sort());
  });
});
