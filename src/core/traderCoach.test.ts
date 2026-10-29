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
import { covered, dispatchRequest, dueDispatches, fxBarCloses, latestRunMs } from '../../supabase/functions/trader-coach/scheduler';

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

describe('GitHub workflow scheduler', () => {
  const at = (iso: string) => Date.parse(iso);
  const wfs = (iso: string) => dueDispatches(at(iso)).map(d => `${d.wf} ${d.slot}`);
  /** Every 10-min tick over a span: the slots dispatched (deduped like rfx_coach_events). */
  function ticks(fromIso: string, hours: number) {
    const seen = new Map<string, string>();
    for (let t = at(fromIso); t < at(fromIso) + hours * 3600000; t += 600000)
      for (const d of dueDispatches(t)) if (!seen.has(d.slot)) seen.set(d.slot, new Date(t).toISOString().slice(0, 16));
    return seen;
  }

  it('FX: once per H1 close at :05-:25, forex week Sun 17:00 -> Fri 17:00 New York', () => {
    expect(wfs('2026-10-28T14:10:00Z')).toContain('fx-scan.yml fx:2026-10-28T14');
    expect(wfs('2026-10-28T14:20:00Z')).toContain('fx-scan.yml fx:2026-10-28T14');   // same slot: deduped
    expect(wfs('2026-10-28T14:00:00Z').some(x => x.startsWith('fx'))).toBe(false);
    expect(wfs('2026-10-28T14:30:00Z').some(x => x.startsWith('fx'))).toBe(false);
    const day = [...ticks('2026-10-28T00:00:00Z', 24).keys()].filter(k => k.startsWith('fx:'));
    expect(day).toHaveLength(24);
    // EDT week (before 2026-11-01): Friday 17:00 NY = 21:00 UTC is the last close, Sunday 22:00 UTC the first
    expect(fxBarCloses(at('2026-10-30T21:00:00Z'))).toBe(true);
    expect(fxBarCloses(at('2026-10-30T22:00:00Z'))).toBe(false);
    expect(fxBarCloses(at('2026-10-31T12:00:00Z'))).toBe(false);
    // EST from 2026-11-01: the week opens Sunday 17:00 NY = 22:00 UTC (first close 23:00 UTC), closes Friday 22:00 UTC
    expect(fxBarCloses(at('2026-11-01T22:00:00Z'))).toBe(false);
    expect(fxBarCloses(at('2026-11-01T23:00:00Z'))).toBe(true);
    expect(fxBarCloses(at('2026-11-06T22:00:00Z'))).toBe(true);
    expect(fxBarCloses(at('2026-11-06T23:00:00Z'))).toBe(false);
    const weekend = [...ticks('2026-10-31T00:00:00Z', 24).keys()].filter(k => k.startsWith('fx:'));
    expect(weekend).toEqual([]);
    // crypto trades 24/7: every weekend H1 close gets one scheduled-equivalent fx-scan dispatch (crypto-only via --check)
    const crypto = [...ticks('2026-10-31T00:00:00Z', 24).keys()].filter(k => k.startsWith('fxc:'));
    expect(crypto).toHaveLength(24);
    expect([...ticks('2026-10-28T00:00:00Z', 24).keys()].some(k => k.startsWith('fxc:'))).toBe(false);
    const sat = dueDispatches(at('2026-10-31T12:10:00Z')).find(d => d.slot === 'fxc:2026-10-31T12')!;
    expect(sat.wf).toBe('fx-scan.yml');
    expect(sat.inputs).toEqual({ scheduled: 'true' });
    // the Friday close hour itself is still a forex slot; the next hour is the first crypto one
    expect(wfs('2026-10-30T21:10:00Z')).toContain('fx-scan.yml fx:2026-10-30T21');
    expect(wfs('2026-10-30T22:10:00Z')).toContain('fx-scan.yml fxc:2026-10-30T22');
  });

  it('stocks: weekdays 30 min after the US close (20:30 UTC summer, 21:30 UTC winter) + one retry', () => {
    const wed = [...ticks('2026-10-28T12:00:00Z', 18)].filter(([k]) => k.startsWith('stock'));
    expect(wed).toEqual([['stock:2026-10-28:a', '2026-10-28T20:30'], ['stock:2026-10-28:b', '2026-10-28T23:30']]);
    const winter = [...ticks('2026-11-02T12:00:00Z', 18)].filter(([k]) => k.startsWith('stock'));
    expect(winter).toEqual([['stock:2026-11-02:a', '2026-11-02T21:30'], ['stock:2026-11-02:b', '2026-11-03T00:30']]);
    expect([...ticks('2026-10-31T01:00:00Z', 47).keys()].some(k => k.startsWith('stock'))).toBe(false);   // Sat + Sun (New York)
  });

  it('brief at 5:55-6:30 AM Calgary and reminders every 30 min 4 AM-2 PM, weekdays, UTC-6 both sides of 2026-11-01', () => {
    for (const d of ['2026-10-30', '2026-11-02', '2027-01-15']) {
      const s = ticks(`${d}T06:00:00Z`, 18);
      expect(s.get(`brief:${d}`)).toBe(`${d}T12:00`);                // 6:00 AM Calgary = 12:00 UTC all year now
      const rem = [...s].filter(([k]) => k.startsWith('rem:'));
      expect(rem).toHaveLength(20);
      expect(rem[0]).toEqual([`rem:${d}T04:00`, `${d}T10:00`]);
      expect(rem[19][0]).toBe(`rem:${d}T13:30`);
    }
    expect([...ticks('2026-10-31T06:00:00Z', 18).keys()].filter(k => k.startsWith('brief') || k.startsWith('rem'))).toEqual([]);
  });

  it('payloads: scheduled-equivalent inputs, ref main; a GitHub run inside the slot covers it', () => {
    const fx = dueDispatches(at('2026-10-28T14:10:00Z')).find(d => d.wf === 'fx-scan.yml')!;
    const r = dispatchRequest(fx, 'tok');
    expect(r.url).toBe('https://api.github.com/repos/r4m4nxd/ramanFX/actions/workflows/fx-scan.yml/dispatches');
    expect(JSON.parse(String(r.init.body))).toEqual({ ref: 'main', inputs: { scheduled: 'true' } });
    expect((r.init.headers as Record<string, string>).Authorization).toBe('Bearer tok');
    const brief = dueDispatches(at('2026-10-30T12:00:00Z')).find(d => d.wf === 'briefing.yml')!;
    expect(JSON.parse(String(dispatchRequest(brief, 't').init.body)).inputs).toEqual({ test: 'false' });
    const rem = dueDispatches(at('2026-10-30T12:10:00Z')).find(d => d.wf === 'reminders.yml')!;
    expect(JSON.parse(String(dispatchRequest(rem, 't').init.body)).inputs).toEqual({});
    expect(covered(fx, at('2026-10-28T14:07:00Z'))).toBe(true);
    expect(covered(fx, at('2026-10-28T13:57:00Z'))).toBe(false);
    expect(covered(fx, null)).toBe(false);
    expect(covered(rem, at('2026-10-30T12:00:30Z'))).toBe(true);
  });

  it('movers: every hour (:05-:25, weekends too for crypto), no inputs, deduped per hour', () => {
    const due = dueDispatches(at('2026-10-29T14:05:00Z')).find(d => d.wf === 'movers.yml')!;
    expect(due.slot).toBe('movers:2026-10-29T14');
    expect(due.since).toBe(at('2026-10-29T14:00:00Z'));
    expect(JSON.parse(String(dispatchRequest(due, 't').init.body))).toEqual({ ref: 'main', inputs: {} });
    expect(wfs('2026-10-29T14:04:00Z').some(x => x.startsWith('movers'))).toBe(false);
    expect(wfs('2026-10-29T14:30:00Z').some(x => x.startsWith('movers'))).toBe(false);
    const day = [...ticks('2026-10-28T00:00:00Z', 24).keys()].filter(k => k.startsWith('movers:'));
    expect(day).toHaveLength(24);
    const sat = [...ticks('2026-10-31T00:00:00Z', 24)].filter(([k]) => k.startsWith('movers:'));
    expect(sat).toHaveLength(24);                                               // Saturday: crypto 1H / 4H / 1D / 1W
    expect(sat[0]).toEqual(['movers:2026-10-31T00', '2026-10-31T00:10']);      // crypto 1D + 1W close (Saturday 00:00 UTC)
    // the Friday 17:00 New York close (1H + 4H + 1D + 1W, stocks 1D / 1W) is ONE slot, in both DST regimes
    expect(wfs('2026-10-30T21:10:00Z')).toContain('movers.yml movers:2026-10-30T21');
    expect(wfs('2026-11-06T22:10:00Z')).toContain('movers.yml movers:2026-11-06T22');
    expect(dueDispatches(at('2026-10-30T21:20:00Z')).filter(d => d.wf === 'movers.yml')).toHaveLength(1);
    expect(readFileSync('.github/workflows/movers.yml', 'utf8')).toContain('python tools/movers/movers.py');
  });

  it('fundamentals: weekdays 18:00-19:00 New York (22:00 UTC summer, 23:00 UTC winter), scheduled=true', () => {
    const wed = [...ticks('2026-10-28T12:00:00Z', 18)].filter(([k]) => k.startsWith('fund'));
    expect(wed).toEqual([['fund:2026-10-28', '2026-10-28T22:00']]);
    const winter = [...ticks('2026-11-02T12:00:00Z', 18)].filter(([k]) => k.startsWith('fund'));
    expect(winter).toEqual([['fund:2026-11-02', '2026-11-02T23:00']]);
    expect([...ticks('2026-10-31T01:00:00Z', 47).keys()].some(k => k.startsWith('fund'))).toBe(false);   // Sat + Sun (New York)
    const due = dueDispatches(at('2026-10-28T22:10:00Z')).find(d => d.wf === 'fundamentals.yml')!;
    expect(due.since).toBe(at('2026-10-28T22:00:00Z'));
    expect(JSON.parse(String(dispatchRequest(due, 't').init.body))).toEqual({ ref: 'main', inputs: { scheduled: 'true' } });
    const y = readFileSync('.github/workflows/fundamentals.yml', 'utf8');
    expect(y).toMatch(/\n      scheduled:\n/);
    expect(y).toContain('python tools/fundamentals/build.py');
    expect(y).toContain('SEC_CONTACT: ${{ vars.SEC_CONTACT }}');
  });

  it('insiders: every 30 min on weekdays 6:00-20:00 New York (both DST regimes), no inputs', () => {
    const wed = [...ticks('2026-10-28T00:00:00Z', 24)].filter(([k]) => k.startsWith('ins:'));
    expect(wed).toHaveLength(28);
    expect(wed[0]).toEqual(['ins:2026-10-28T06:00', '2026-10-28T10:00']);     // 6:00 AM EDT = 10:00 UTC
    expect(wed[27]).toEqual(['ins:2026-10-28T19:30', '2026-10-28T23:30']);
    const winter = [...ticks('2026-11-02T00:00:00Z', 26)].filter(([k]) => k.startsWith('ins:'));
    expect(winter).toHaveLength(28);
    expect(winter[0]).toEqual(['ins:2026-11-02T06:00', '2026-11-02T11:00']);  // EST
    expect([...ticks('2026-10-31T04:00:00Z', 48).keys()].some(k => k.startsWith('ins:'))).toBe(false);   // weekend
    const due = dueDispatches(at('2026-10-28T14:40:00Z')).find(d => d.wf === 'insiders.yml')!;
    expect(due.slot).toBe('ins:2026-10-28T10:30');
    expect(due.since).toBe(at('2026-10-28T14:30:00Z'));
    expect(JSON.parse(String(dispatchRequest(due, 't').init.body))).toEqual({ ref: 'main', inputs: {} });
    const y = readFileSync('.github/workflows/insiders.yml', 'utf8');
    expect(y).toContain('python tools/insiders/insiders.py');
    expect(y).toContain('SEC_UA: ${{ secrets.SEC_UA }}');
    expect(y).toContain('bash scripts/data-branch.sh push "insiders: $(date -u +%Y-%m-%dT%H:%MZ)" public/insiders');
  });

  it("the bot's on-demand scans never cover a scheduled slot", () => {
    const js = { workflow_runs: [
      { created_at: '2026-10-29T14:07:00Z', display_title: 'FX on-demand scan EURUSD' },
      { created_at: '2026-10-29T13:08:00Z', display_title: 'FX scan' }] };
    expect(latestRunMs(js)).toBe(at('2026-10-29T13:08:00Z'));
    expect(latestRunMs({ workflow_runs: [] })).toBeNull();
    expect(latestRunMs(null)).toBeNull();
    for (const f of ['fx-scan.yml', 'stock-scan.yml']) expect(readFileSync(`.github/workflows/${f}`, 'utf8')).toMatch(/run-name: .*on-demand scan/);
  });

  it('the workflows accept the scheduled input and keep cron semantics for it', () => {
    const fx = readFileSync('.github/workflows/fx-scan.yml', 'utf8'), st = readFileSync('.github/workflows/stock-scan.yml', 'utf8');
    for (const y of [fx, st]) { expect(y).toMatch(/\n      scheduled:\n/); expect(y).toContain('SCHEDULED: ${{ github.event.inputs.scheduled }}'); }
    expect(fx).toContain('if [ "$EVENT" = "workflow_dispatch" ] && [ "$SCHEDULED" != "true" ]; then ARGS+=(--force); fi');
    expect(readFileSync('.github/workflows/briefing.yml', 'utf8')).toMatch(/\n      test:\n/);
  });
});
