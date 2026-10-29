// @vitest-environment node
// Trader coach (supabase/functions/trader-coach/core.ts) and the bot's journal writes (telegram-bot/journal.ts).
// The coach runs the app's own src/core code (bundled into app-core.js) in a UTC runtime; the parity tests run the
// app's riskStatus on the Calgary clock (TZ=America/Edmonton, like the owner's browser) and the coach on TZ=UTC.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { riskStatus as appRiskStatus } from './risk';
import { enrich as appEnrich } from './stats';
import { mergeJournal, emptyJournal } from '@/data/merge';
import { DEFAULT_RISK_RULES as STORE_RULES } from '@/data/store';
import {
  askCandidates, askText, calParts, clock, coachRiskStatus, DEFAULT_RISK_RULES, guardEvents, parseTook, planCard, reportCard, reportDue, rmw,
  tookPlan, utcOfWall, wallMs, weekOf, withPlan, withWhyNote, writeLost, type CoachJournal, type Db,
} from '../../supabase/functions/trader-coach/core';
import { journalRoute } from '../../supabase/functions/telegram-bot/journal';

process.env.TZ = 'UTC';
afterEach(() => { process.env.TZ = 'UTC'; });

type Tr = CoachJournal['trades'][number];
let seq = 0;
/** EURUSD 0.1 lot, 1.0 move = $10 000 per lot: a $20 stop. close price matches the profit so the app measures the unit value. */
function T(open: string, close: string, profit: number, o: Partial<Tr> = {}): Tr {
  const openPrice = 1.085;
  return { id: `t${++seq}`, account: 'A1', openTime: open, closeTime: close, symbol: 'EURUSD', type: 'buy', volume: 0.1, openPrice,
    closePrice: +(openPrice + profit / 10000).toFixed(5), sl: 1.083, tp: 1.089, commission: 0, swap: 0, profit, ...o };
}
function J(trades: Tr[], extra: Partial<CoachJournal> = {}): CoachJournal {
  return { trades, notes: {}, exitData: {}, openPositions: [], plans: [], riskRules: { maxDailyLoss: 100, maxDailyTrades: 10, maxConsecutiveLosses: 2, cooldownMinutes: 30 }, accounts: {}, deposits: [], ...extra };
}
/** UTC instant of a Calgary wall time in October 2026 (UTC-6). */
const cal = (s: string) => Date.parse(`${s.replace(/\./g, '-').replace(' ', 'T')}-06:00`);

describe('Calgary clock', () => {
  it('12-hour times, permanent UTC-6 from 2026-11-01, wall <-> UTC', () => {
    expect(clock(cal('2026.10.29 09:15:00'))).toBe('9:15 AM');
    expect(clock(Date.UTC(2026, 11, 1, 8, 0))).toBe('2:00 AM');            // would be 1 AM on the old MST rule
    expect(calParts(Date.UTC(2027, 0, 15, 19, 0)).h).toBe(13);
    const t = cal('2026.10.28 14:05:09');
    expect(new Date(wallMs(t)).toISOString()).toBe('2026-10-28T14:05:09.000Z');
    expect(utcOfWall(wallMs(t))).toBe(t);
  });
  it('week and report due time', () => {
    expect(weekOf(cal('2026.11.01 18:00:00'))).toEqual({ from: '2026-10-26', to: '2026-11-01' });
    expect(weekOf(cal('2026.10.26 00:30:00'))).toEqual({ from: '2026-10-26', to: '2026-11-01' });
    expect(reportDue(Date.UTC(2026, 10, 2, 0, 0))).toBe(true);              // Sun Nov 1, 6:00 PM Calgary
    expect(reportDue(Date.UTC(2026, 10, 1, 23, 50))).toBe(false);           // 5:50 PM
    expect(reportDue(Date.UTC(2026, 10, 2, 6, 10))).toBe(false);            // Monday 12:10 AM
  });
  it('risk defaults match the app', () => expect(DEFAULT_RISK_RULES).toEqual(STORE_RULES));
});

describe('riskStatus parity with the app', () => {
  const day = [
    T('2026.10.28 07:00:00', '2026.10.28 07:20:00', 15),
    T('2026.10.28 07:40:00', '2026.10.28 08:10:00', -20),
    T('2026.10.28 08:20:00', '2026.10.28 08:45:00', -20, { volume: 0.2, closePrice: 1.084 }),
    T('2026.10.27 22:00:00', '2026.10.27 23:50:00', -40),                  // yesterday (Calgary)
    T('2026.10.28 23:10:00', '2026.10.28 23:40:00', -10),                  // late evening, still the 28th in Calgary (05:40 UTC on the 29th)
  ];
  const nows = ['2026.10.28 08:50:00', '2026.10.28 09:30:00', '2026.10.28 23:59:00', '2026.10.29 06:00:00', '2026.10.28 07:30:00'];
  for (const n of nows) it(`same status at ${n} Calgary`, () => {
    const j = J(day);
    process.env.TZ = 'America/Edmonton';
    const app = appRiskStatus(appEnrich(j.trades, {}, {}, j.trades, {}), { ...STORE_RULES, ...j.riskRules }, new Date(cal(n)));
    process.env.TZ = 'UTC';
    const coach = coachRiskStatus(j, cal(n));
    expect(coach).toEqual(app);
  });
});

describe('rule guard', () => {
  it('daily loss limit -> one stop for the day', () => {
    const j = J([T('2026.10.28 07:00:00', '2026.10.28 07:30:00', -60), T('2026.10.28 08:00:00', '2026.10.28 08:30:00', 15), T('2026.10.28 08:40:00', '2026.10.28 09:00:00', -55)]);
    const ev = guardEvents(j, cal('2026.10.28 09:05:00'));
    expect(ev.map(e => e.key)).toEqual(['2026-10-28:stop']);
    expect(ev[0].text).toBe('🛑 <b>Stop trading today</b> — daily loss limit reached ($100 / $100). Next session tomorrow.');
    // dedupe: the same key again later the same day, a new key the next day
    expect(guardEvents(j, cal('2026.10.28 10:00:00')).map(e => e.key)).toEqual(['2026-10-28:stop']);
    expect(guardEvents(j, cal('2026.10.29 08:00:00'))).toEqual([]);
  });
  it('max trades -> stop; stale day (imported in the evening) -> nothing', () => {
    const ts = Array.from({ length: 10 }, (_, i) => T(`2026.10.28 0${i % 9 + 1}:00:00`, `2026.10.28 0${i % 9 + 1}:05:00`, i % 2 ? 2 : -1));
    const j = J(ts);
    expect(guardEvents(j, cal('2026.10.28 10:00:00'))[0].text).toContain('max trades reached (10 / 10)');
    expect(guardEvents(j, cal('2026.10.28 20:00:00'))).toEqual([]);
  });
  it('70% heads-up, once', () => {
    const j = J([T('2026.10.28 07:00:00', '2026.10.28 07:30:00', -45), T('2026.10.28 08:00:00', '2026.10.28 08:30:00', 10), T('2026.10.28 08:40:00', '2026.10.28 09:00:00', -40)]);
    const ev = guardEvents(j, cal('2026.10.28 09:05:00'));
    expect(ev.map(e => e.kind)).toEqual(['heads', 'cool'].slice(0, ev.length));
    expect(ev[0].key).toBe('2026-10-28:heads');
    expect(ev[0].text).toContain('⚠️ <b>Close to your daily limit</b>');
    expect(ev[0].text).toContain('$75 of $100 lost today');
  });
  it('2 losses in a row -> the pause with the next look time', () => {
    const j = J([T('2026.10.28 08:00:00', '2026.10.28 08:20:00', -10), T('2026.10.28 08:30:00', '2026.10.28 08:45:00', -10)]);
    const ev = guardEvents(j, cal('2026.10.28 08:50:00'));
    const cool = ev.find(e => e.kind === 'cool')!;
    expect(cool.text.split('\n')[0]).toBe('⏸ <b>30-min pause</b> (your rule). Next look at 9:15 AM.');
    expect(cool.key).toBe(`2026-10-28:cool:${j.trades[1].id}`);
    expect(guardEvents(j, cal('2026.10.28 09:20:00')).some(e => e.kind === 'cool')).toBe(false);   // pause over
  });
});

describe('why did you take it', () => {
  it('asks about new trades and open positions once, newest first, not when already noted', () => {
    const a = T('2026.10.28 07:00:00', '2026.10.28 07:30:00', 5), b = T('2026.10.20 07:00:00', '2026.10.20 07:30:00', 5), c = T('2026.10.28 06:00:00', '2026.10.28 06:30:00', 5);
    const j = J([a, b, c], {
      notes: { [c.id]: { note: 'already written' } },
      openPositions: [{ id: 'p9', account: 'A1', openTime: '2026.10.28 08:10:00', symbol: 'GBPUSD', type: 'sell', openPrice: 1.2701 }],
    });
    const asks = askCandidates(j, cal('2026.10.28 08:15:00'));
    expect(asks.map(x => x.id)).toEqual(['p9', a.id]);
    expect(askText(asks[0])).toBe('📝 <b>GBPUSD sell 1.2701</b> — why did you take it? Reply to this message.');
  });
  it('the reply is the note; the app merge keeps it; a later app edit wins', () => {
    const remoteNotes = withWhyNote({ t1: { tags: ['zone'], rating: 4, updatedAt: 100 } }, 't1', 'HTF demand + trendline', 5000).notes;
    expect(remoteNotes.t1).toEqual({ tags: ['zone'], rating: 4, note: 'HTF demand + trendline', updatedAt: 5000 });
    const local = { ...emptyJournal(), notes: { t1: { tags: ['zone'], rating: 4, updatedAt: 100 } } };
    expect(mergeJournal(local, { notes: remoteNotes }).notes.t1.note).toBe('HTF demand + trendline');
    const edited = { ...emptyJournal(), notes: { t1: { note: 'my edit', updatedAt: 9000 } } };
    expect(mergeJournal(edited, { notes: remoteNotes }).notes.t1.note).toBe('my edit');
    expect(withWhyNote(remoteNotes, 't1', 'HTF demand + trendline', 6000).changed).toBe(false);
    expect(withWhyNote(remoteNotes, 't1', 'second', 6000).notes.t1.note).toBe('HTF demand + trendline\n\nsecond');
    expect(writeLost({ ...J([]), notes: {} }, { kind: 'note', trade_id: 't1', text: 'x', at: 5 })).toBe(true);
    expect(writeLost({ ...J([]), notes: { t1: { note: 'other', updatedAt: 9 } } }, { kind: 'note', trade_id: 't1', text: 'x', at: 5 })).toBe(false);
  });
});

describe('/took', () => {
  it('parses and validates', () => {
    expect(parseTook('EURUSD buy 1.0850 sl 1.0820 tp 1.0910')).toEqual({ ok: true, v: { symbol: 'EURUSD', side: 'buy', entry: 1.085, sl: 1.082, tp: 1.091 } });
    expect(parseTook('eur/usd SELL @ 1.0850, sl=1.0880 tp:1.0790')).toEqual({ ok: true, v: { symbol: 'EURUSD', side: 'sell', entry: 1.085, sl: 1.088, tp: 1.079 } });
    expect(parseTook('XAUUSD long 2400 stop 2390')).toEqual({ ok: true, v: { symbol: 'XAUUSD', side: 'buy', entry: 2400, sl: 2390, tp: null } });
    for (const bad of ['', 'EURUSD', 'EURUSD buy', 'EURUSD hold 1.08 sl 1.07', 'EURUSD buy 1.0850 tp 1.09', 'EURUSD buy 1.0850 sl 1.0900',
      'EURUSD sell 1.0850 sl 1.0900 tp 1.0900', '<b> buy 1 sl 0.9', 'EURUSD buy 1.0850 sl 0.5', 'EURUSD buy -1 sl 1', 'EURUSD buy 1.0850 sl 1.08 lots 2'])
      expect(parseTook(bad).ok, bad).toBe(false);
    const e = parseTook('<b> buy 1 sl 0.9');
    expect(!e.ok && e.error).not.toContain('<b>');
  });
  it('makes an app Plan and never overwrites other plans', () => {
    const r = parseTook('EURUSD sell 1.0850 sl 1.0880 tp 1.0790');
    if (!r.ok) throw new Error('parse');
    const p = tookPlan(r.v, 1_790_000_000_000, () => 0.5);
    expect(p).toMatchObject({ symbol: 'EURUSD', side: 'sell', entry: 1.085, stop: 1.088, target: 1.079, status: 'planned', createdAt: 1_790_000_000_000, updatedAt: 1_790_000_000_000, htfTrend: 'down' });
    for (const k of ['method', 'combo', 'kind', 'baseCandles', 'moveAway', 'fresh', 'old', 'qualified', 'curve', 'atHtfZone', 'nearOpposing', 'htfTouched', 'signal', 'liquidityTrap', 'structureShift'])
      expect(p, k).toHaveProperty(k);
    expect(p.id).toMatch(/^pl_/);
    const other = { ...p, id: 'pl_other', symbol: 'GBPUSD' };
    expect(withPlan([other], p).map(x => x.id)).toEqual([p.id, 'pl_other']);
    expect(withPlan([p], { ...p, symbol: 'X' })[0].symbol).toBe('EURUSD');
    const m = mergeJournal({ ...emptyJournal(), plans: [other] }, { plans: withPlan([other], p) });
    expect(m.plans.map(x => x.id).sort()).toEqual([p.id, 'pl_other'].sort());
    const card = planCard(p);
    expect(card.text).toContain('📝 <b>Plan saved</b> · EURUSD sell');
    expect(card.text).toContain('Target is 2.0× the stop distance.');
    expect(card.buttons[0][0]).toEqual({ text: 'Open in Planner', url: `https://raman-fx.vercel.app/plan/${p.id}` });
  });
});

describe('safe writes', () => {
  function memDb(row: Record<string, unknown>, conflicts = 0) {
    let ver = 1, left = conflicts;
    const writes: Record<string, unknown>[] = [];
    const db: Db = {
      async read(cols) { return { row: Object.fromEntries(cols.map(c => [c, row[c]])), updatedAt: `v${ver}` }; },
      async write(patch, expect) {
        if (left > 0) { left--; ver++; row.notes = { ...(row.notes as object), other: { note: 'from the app', updatedAt: 1 } }; }
        if (expect !== `v${ver}`) return false;
        Object.assign(row, patch); ver++; writes.push(patch); return true;
      },
    };
    return { db, row, writes };
  }
  it('retries on a concurrent write and keeps both edits', async () => {
    const m = memDb({ notes: { a: { note: 'keep' } }, trades: ['untouched'] }, 2);
    const r = await rmw(m.db, ['notes'], row => ({ notes: withWhyNote(row.notes as never, 't1', 'why', 5).notes }));
    expect(r).toBe('ok');
    expect(m.row.notes).toMatchObject({ a: { note: 'keep' }, other: { note: 'from the app' }, t1: { note: 'why' } });
    expect(m.row.trades).toEqual(['untouched']);
    expect(Object.keys(m.writes[0])).toEqual(['notes']);
  });
  it('gives up after the retries, refuses unread columns', async () => {
    const m = memDb({ notes: {} }, 99);
    expect(await rmw(m.db, ['notes'], () => ({ notes: {} }), 3)).toBe('conflict');
    await expect(rmw(memDb({ notes: {} }).db, ['notes'], () => ({ trades: [] }))).rejects.toThrow(/not read/);
    expect(await rmw(memDb({ notes: {} }).db, ['notes'], () => null)).toBe('nochange');
  });
});

describe('bot journal.ts', () => {
  function fakeSb(row: Record<string, unknown>, prompts: Record<number, { trade_id: string; label: string }>) {
    const calls: { method: string; url: string; body?: unknown }[] = [];
    let ver = '2026-10-29T00:00:58.748+00:00';
    const f = (async (input: string, init: RequestInit = {}) => {
      const url = decodeURIComponent(String(input)), method = init.method ?? 'GET';
      const body = init.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ method, url, body });
      const ok = (v: unknown) => new Response(JSON.stringify(v), { status: 200 });
      if (url.includes('/rfx_coach_prompts?message_id=eq.') && method === 'GET') { const id = Number(/eq\.(\d+)/.exec(url)![1]); return ok(prompts[id] ? [prompts[id]] : []); }
      if (url.includes('/rfx_journal?') && method === 'GET') {
        expect(url).toContain('user_id=eq.67967f02-d6fb-45f1-9edf-d14c3d3fcf12');
        return ok([{ ...row, updated_at: ver }]);
      }
      if (url.includes('/rfx_journal?') && method === 'PATCH') {
        if (!url.includes(`updated_at=eq.${ver}`)) return ok([]);
        Object.assign(row, body); ver = String(body.updated_at); return ok([{ user_id: 'x' }]);
      }
      return new Response(null, { status: 201 });
    }) as typeof fetch;
    return { f, calls, row };
  }
  const env = (f: typeof fetch) => ({ sbUrl: 'https://sb.test', sbKey: 'service', fetch: f, now: () => 1_790_000_000_000 });

  it('a reply to a prompt becomes that trade note, only the notes column is written', async () => {
    const sb = fakeSb({ notes: { t7: { tags: ['zone'] } } }, { 42: { trade_id: 't7', label: 'EURUSD buy 1.085' } });
    const r = await journalRoute({ text: 'Retest of H4 demand', reply_to_message: { message_id: 42 } }, env(sb.f));
    expect(r?.text).toContain('✅ Saved as the note on <b>EURUSD buy 1.085</b>');
    expect(sb.row.notes).toEqual({ t7: { tags: ['zone'], note: 'Retest of H4 demand', updatedAt: 1_790_000_000_000 } });
    const patch = sb.calls.find(c => c.method === 'PATCH' && c.url.includes('rfx_journal'))!;
    expect(Object.keys(patch.body as object).sort()).toEqual(['notes', 'updated_at']);
    expect(sb.calls.some(c => c.method === 'POST' && c.url.includes('rfx_coach_writes'))).toBe(true);
  });
  it('replies to other messages and plain text fall through', async () => {
    const sb = fakeSb({ notes: {} }, {});
    expect(await journalRoute({ text: 'hello', reply_to_message: { message_id: 7 } }, env(sb.f))).toBeNull();
    expect(await journalRoute({ text: 'EURUSD' }, env(sb.f))).toBeNull();
    expect(await journalRoute({ text: '/fx' }, env(sb.f))).toBeNull();
    expect(sb.calls.filter(c => c.url.includes('rfx_journal'))).toEqual([]);
  });
  it('/took adds a plan and shows the card; bad input writes nothing', async () => {
    const sb = fakeSb({ plans: [{ id: 'pl_old', symbol: 'GBPUSD' }] }, {});
    const r = await journalRoute({ text: '/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910' }, env(sb.f));
    expect(r?.text).toContain('📝 <b>Plan saved</b> · EURUSD buy');
    const plans = sb.row.plans as { id: string }[];
    expect(plans).toHaveLength(2);
    expect(plans[1].id).toBe('pl_old');
    const bad = await journalRoute({ text: '/took EURUSD buy 1.0850 sl 1.0900' }, env(sb.f));
    expect(bad?.text).toContain('stop must be below');
    expect((sb.row.plans as unknown[]).length).toBe(2);
  });
});

describe('weekly report card', () => {
  const now = cal('2026.11.01 18:00:00');
  const ts = [
    T('2026.10.26 07:00:00', '2026.10.26 07:30:00', 40), T('2026.10.27 07:00:00', '2026.10.27 07:30:00', -20), T('2026.10.28 07:00:00', '2026.10.28 07:30:00', 30),
    T('2026.10.29 07:00:00', '2026.10.29 07:30:00', -20), T('2026.10.20 07:00:00', '2026.10.20 07:30:00', 99),
  ];
  const notes = {
    [ts[0].id]: { tags: ['Zone-near_Trendline'], rules: { direction: 'y', room: 'y' } }, [ts[1].id]: { tags: ['breakout'], rules: { direction: 'n', room: 'n' } },
    [ts[2].id]: { tags: ['zone near trendline'], rules: { room: 'y' } }, [ts[3].id]: { tags: ['breakout'], rules: { room: 'n' } },
  } as CoachJournal['notes'];
  it('5-7 lines, R multiples, no $ by default, Open journal button', () => {
    const c = reportCard(J(ts, { notes }), now);
    const lines = c.text.split('\n');
    expect(lines.length).toBeGreaterThanOrEqual(5);
    expect(lines.length).toBeLessThanOrEqual(7);
    expect(lines[0]).toBe('📋 <b>Weekly report card</b> · Oct 26 – Nov 1');
    expect(lines[1]).toBe('4 trades · win rate 50% · net +1.5R');
    expect(lines[2]).toMatch(/^Rules followed \d+% \(\d+ of \d+ checks on 4 trades\)$/);
    expect(c.text).toContain("Most expensive habit: breaking 'room of 2× the stop'");
    expect(c.text).toContain('Best setup: zone near trendline (+3.5R · 2 trades)');
    expect(c.text).toContain('Worst setup: breakout (−2.0R · 2 trades)');
    expect(c.text).not.toContain('$');
    expect(c.buttons).toEqual([[{ text: 'Open journal', url: 'https://raman-fx.vercel.app/journal' }]]);
  });
  it('sample header, amounts only when allowed, empty week', () => {
    const c = reportCard(J(ts, { notes }), now, { sample: true, showAmounts: true });
    expect(c.text.split('\n')[0]).toBe('🧪 <b>Sample weekly report</b> · Oct 26 – Nov 1');
    expect(c.text).toContain('net +1.5R · +$30');
    const e = reportCard(J([]), now).text.split('\n');
    expect(e[1]).toBe('No closed trades this week.');
    expect(e.length).toBeGreaterThanOrEqual(4);
  });
});

describe('generated app-core.js', () => {
  it('is up to date with src/core (run: node scripts/build-coach-core.mjs)', async () => {
    const script = path.resolve('scripts/build-coach-core.mjs');
    const mod = await import(/* @vite-ignore */ script);
    expect(readFileSync(path.resolve('supabase/functions/trader-coach/app-core.js'), 'utf8')).toBe(await mod.bundle());
  });
});
