// @vitest-environment node
// Health watchdog of the trader coach (supabase/functions/trader-coach/health.ts): every rule incl. weekend, NYSE
// holidays, grace windows, dedupe, quiet hours, the daily cap and the one '✅ resolved'.
import { describe, expect, it } from 'vitest';
import {
  appChecks, evaluate, gather, gatherApp, gatherFiles, pendingSince, healthSummary, healthText, needFiles, nyseHolidays, parseExpiry, parseRuns, plan, snapOf, stateOf, stockDue, tickKey,
  APP_URL, DAY, HOUR, MIN, PER_DAY, type AppSnap, type Check, type KeyState, type Open, type Run, type Snapshot, type WfFile,
} from '../../supabase/functions/trader-coach/health';
import { handle, type Ctx } from '../../supabase/functions/telegram-bot/logic';

process.env.TZ = 'UTC';
const at = (iso: string) => Date.parse(iso);
let seq = 0;
const R = (iso: string, o: Partial<Run> = {}): Run => ({ id: ++seq, at: at(iso), status: 'completed', conclusion: 'success', url: `https://github.com/r4m4nxd/ramanFX/actions/runs/${seq}`, ondemand: false, ...o });
const KEYS_OK: Record<'github' | 'oanda' | 'alpaca' | 'telegram', KeyState> = { github: 'ok', oanda: 'ok', alpaca: 'ok', telegram: 'ok' };
const S = (nowIso: string, runs: Partial<Record<WfFile, Run[]>>, extra: Partial<Snapshot> = {}): Snapshot => ({ now: at(nowIso), runs, keys: KEYS_OK, ghExpiry: null, ...extra });
const get = (cs: Check[], id: string) => cs.find(c => c.id === id)!;
const status = (s: Snapshot, id: string) => get(evaluate(s), id).status;

describe('health: FX scan', () => {
  const now = '2026-10-29T15:40:00Z';   // Thursday, forex week; 9:40 AM Calgary
  it('forex week: a good scan within the last 2 H1 closes + 20 min', () => {
    expect(status(S(now, { 'fx-scan.yml': [R('2026-10-29T13:21:00Z')] }), 'fx')).toBe('ok');
    const c = get(evaluate(S(now, { 'fx-scan.yml': [R('2026-10-29T13:10:00Z')] })), 'fx');
    expect(c.status).toBe('problem');
    expect(c.text).toBe('FX scan missed 2 hours — last good scan 7:10 AM. The scheduler keeps retrying.');
    expect(get(evaluate(S(now, { 'fx-scan.yml': [R('2026-10-29T11:30:00Z')] })), 'fx').text).toContain('missed 4 hours');
  });
  it("ignores the bot's on-demand scans and failed runs; latest.json `generated` clears it", () => {
    const runs = [R('2026-10-29T15:30:00Z', { ondemand: true }), R('2026-10-29T15:20:00Z', { conclusion: 'failure' }), R('2026-10-29T12:00:00Z')];
    const cs = evaluate(S(now, { 'fx-scan.yml': runs }));
    expect(get(cs, 'fx').status).toBe('problem');
    expect(needFiles(cs)).toEqual(['fx']);
    expect(status(S(now, { 'fx-scan.yml': runs }, { files: { fx: at('2026-10-29T15:11:00Z') } }), 'fx')).toBe('ok');
    expect(parseRuns({ workflow_runs: [{ id: 1, created_at: '2026-10-29T15:30:00Z', display_title: 'FX on-demand scan EURUSD', status: 'completed', conclusion: 'success', html_url: 'https://github.com/x' }] })[0].ondemand).toBe(true);
  });
  it('weekend: a crypto-only run within 3 h; the switch at the Friday close and the Sunday open', () => {
    const sat = '2026-10-31T18:00:00Z';
    expect(status(S(sat, { 'fx-scan.yml': [R('2026-10-31T15:12:00Z')] }), 'fx')).toBe('ok');
    const c = get(evaluate(S(sat, { 'fx-scan.yml': [R('2026-10-31T14:42:00Z')] })), 'fx');
    expect(c.status).toBe('problem');
    expect(c.text).toMatch(/^Weekend crypto scan missed 3 hours/);
    // Friday 18:30 New York (EDT): weekend rule already, a 2.5 h old run is fine
    expect(status(S('2026-10-30T22:30:00Z', { 'fx-scan.yml': [R('2026-10-30T20:00:00Z')] }), 'fx')).toBe('ok');
    // Sunday (EST): the week opens 22:00 UTC; the forex rule starts only 2 h 20 min after the first close
    expect(status(S('2026-11-02T00:10:00Z', { 'fx-scan.yml': [R('2026-11-01T21:42:00Z')] }), 'fx')).toBe('ok');
    expect(status(S('2026-11-02T01:30:00Z', { 'fx-scan.yml': [R('2026-11-01T22:42:00Z')] }), 'fx')).toBe('problem');
  });
  it('no runs read (no token / API down): skipped, never a false alarm', () => {
    expect(status(S(now, {}), 'fx')).toBe('skip');
  });
});

describe('health: stock scan', () => {
  it('due 2.5 h after the 4 PM New York close of each NYSE trading day', () => {
    // Thu Oct 29 (EDT): close 20:00 UTC, due 22:30 UTC. Before that: Wednesday's scan counts.
    expect(stockDue(at('2026-10-29T22:20:00Z'))!.label).toBe('Wed Oct 28');
    expect(status(S('2026-10-29T22:20:00Z', { 'stock-scan.yml': [R('2026-10-28T20:31:00Z')] }), 'stock')).toBe('ok');
    expect(status(S('2026-10-29T22:40:00Z', { 'stock-scan.yml': [R('2026-10-29T20:31:00Z')] }), 'stock')).toBe('ok');
    const c = get(evaluate(S('2026-10-29T22:40:00Z', { 'stock-scan.yml': [R('2026-10-28T20:31:00Z')] })), 'stock');
    expect(c.status).toBe('problem');
    expect(c.text).toBe('Stock scan missing for Thu Oct 29 — nothing since the US close (2:00 PM).');
    // a run still going is not a problem yet; a fresh latest.json clears it
    expect(status(S('2026-10-29T22:40:00Z', { 'stock-scan.yml': [R('2026-10-29T22:00:00Z', { status: 'in_progress', conclusion: null })] }), 'stock')).toBe('skip');
    expect(status(S('2026-10-29T22:40:00Z', { 'stock-scan.yml': [] }, { files: { stock: at('2026-10-29T20:31:58Z') } }), 'stock')).toBe('ok');
    // US winter (EST from Nov 1): close 21:00 UTC, due 23:30 UTC
    expect(stockDue(at('2026-11-02T23:20:00Z'))!.label).toBe('Fri Oct 30');
    expect(stockDue(at('2026-11-02T23:30:00Z'))!.close).toBe(at('2026-11-02T21:00:00Z'));
  });
  it('weekends and NYSE holidays: no scan expected (the last trading day stays the reference)', () => {
    expect(stockDue(at('2026-10-31T18:00:00Z'))!.label).toBe('Fri Oct 30');
    expect(stockDue(at('2026-11-02T03:00:00Z'))!.label).toBe('Fri Oct 30');
    // Thanksgiving Thu Nov 26 2026: Wednesday's scan is enough all evening
    expect(stockDue(at('2026-11-27T01:00:00Z'))!.label).toBe('Wed Nov 25');
    expect(status(S('2026-11-27T01:00:00Z', { 'stock-scan.yml': [R('2026-11-25T21:31:00Z')] }), 'stock')).toBe('ok');
    expect(stockDue(at('2026-12-26T02:00:00Z'))!.label).toBe('Thu Dec 24');   // Christmas Friday
  });
  it('NYSE holiday rules (same as reminders.py)', () => {
    expect([...nyseHolidays(2026)].sort()).toEqual(['2026-01-01', '2026-01-19', '2026-02-16', '2026-04-03', '2026-05-25', '2026-06-19', '2026-07-03', '2026-09-07', '2026-11-26', '2026-12-25']);
    const h27 = nyseHolidays(2027);
    expect(h27.has('2027-03-26')).toBe(true);    // Good Friday 2027
    expect(h27.has('2027-06-18')).toBe(true);    // Juneteenth on a Saturday -> Friday
    expect(h27.has('2027-12-24')).toBe(true);    // Christmas on a Saturday -> Friday
    expect(nyseHolidays(2028).has('2027-12-31')).toBe(false);   // a Saturday New Year is not observed on Friday
    expect(h27.has('2027-11-25')).toBe(true);
  });
});

describe('health: big moves, morning brief, fundamentals', () => {
  it('big moves within 3 h during the forex week only', () => {
    expect(status(S('2026-10-29T15:40:00Z', { 'movers.yml': [R('2026-10-29T12:50:00Z')] }), 'movers')).toBe('ok');
    expect(get(evaluate(S('2026-10-29T15:40:00Z', { 'movers.yml': [R('2026-10-29T12:30:00Z')] })), 'movers').text).toBe("Big moves didn't run for 3 hours — last run 6:30 AM.");
    expect(status(S('2026-10-31T15:40:00Z', { 'movers.yml': [R('2026-10-30T20:10:00Z')] }), 'movers')).toBe('skip');
  });
  it('morning brief: a run after 5:50 AM Calgary, due 6:45 AM, weekdays', () => {
    const runs = { 'briefing.yml': [R('2026-10-28T12:01:00Z')] };
    expect(status(S('2026-10-29T12:40:00Z', runs), 'brief')).toBe('skip');            // 6:40 AM: not due yet
    expect(status(S('2026-10-29T13:00:00Z', runs), 'brief')).toBe('problem');
    expect(get(evaluate(S('2026-10-29T13:00:00Z', runs)), 'brief').text).toBe("Morning brief didn't run this morning (due 6 AM, latest 6:45 AM).");
    expect(status(S('2026-10-29T13:00:00Z', { 'briefing.yml': [R('2026-10-29T12:01:00Z')] }), 'brief')).toBe('ok');
    expect(status(S('2026-10-29T13:00:00Z', { 'briefing.yml': [R('2026-10-29T11:45:00Z')] }), 'brief')).toBe('problem');   // 5:45: too early to count
    expect(status(S('2026-10-31T13:00:00Z', runs), 'brief')).toBe('skip');            // Saturday
    expect(status(S('2026-11-02T12:50:00Z', { 'briefing.yml': [R('2026-11-02T12:00:00Z')] }), 'brief')).toBe('ok');   // UTC-6 all year
  });
  it('fundamentals: a run (or fx.json) after 18:00 New York, due 21:00 New York, weekdays', () => {
    const old = { 'fundamentals.yml': [R('2026-10-28T22:05:00Z')] };
    expect(status(S('2026-10-30T00:50:00Z', old), 'fund')).toBe('skip');               // Thu 20:50 New York
    const c = get(evaluate(S('2026-10-30T01:10:00Z', old)), 'fund');
    expect(c.status).toBe('problem');
    expect(c.text).toBe('Fundamentals not rebuilt tonight (due by 7:00 PM).');
    expect(status(S('2026-10-30T01:10:00Z', { 'fundamentals.yml': [R('2026-10-29T22:05:00Z')] }), 'fund')).toBe('ok');
    expect(status(S('2026-10-30T01:10:00Z', old, { files: { fund: at('2026-10-29T22:30:00Z') } }), 'fund')).toBe('ok');
    expect(status(S('2026-10-31T01:10:00Z', old), 'fund')).toBe('problem');           // Friday evening too
    expect(status(S('2026-11-01T01:10:00Z', old), 'fund')).toBe('skip');               // Saturday
  });
});

describe('health: failed runs and keys', () => {
  it('the newest finished scheduled run failed -> named with a link (25 min grace); a success clears it', () => {
    const runs = [R('2026-10-29T15:30:00Z', { status: 'in_progress', conclusion: null }), R('2026-10-29T15:25:00Z', { conclusion: 'cancelled' }),
      R('2026-10-29T15:22:00Z', { conclusion: 'failure', ondemand: true }), R('2026-10-29T15:20:00Z', { conclusion: 'failure' }), R('2026-10-29T15:10:00Z')];
    const c = get(evaluate(S('2026-10-29T15:40:00Z', { 'fx-scan.yml': runs })), 'fail:fx-scan');
    expect(c.status).toBe('problem');
    expect(c.graceMs).toBe(25 * MIN);
    expect(c.text).toBe(`FX scan failed at 9:20 AM — <a href="${runs[3].url}">open the run</a>`);
    expect(status(S('2026-10-29T15:40:00Z', { 'fx-scan.yml': [R('2026-10-29T15:30:00Z'), ...runs.slice(3)] }), 'fail:fx-scan')).toBe('ok');
    expect(status(S('2026-10-29T15:40:00Z', { 'stock-scan.yml': [R('2026-10-27T21:00:00Z', { conclusion: 'timed_out' })] }), 'fail:stock-scan')).toBe('skip');   // older than 24 h
    expect(status(S('2026-10-29T15:40:00Z', { 'briefing.yml': [R('2026-10-29T12:00:00Z', { conclusion: 'timed_out' })] }), 'fail:briefing')).toBe('problem');
    expect(parseRuns({ workflow_runs: [{ id: 2, run_started_at: '2026-10-29T15:20:00Z', html_url: 'javascript:alert(1)', conclusion: 'failure', status: 'completed' }] })[0].url).toBe('');
  });
  it('keys: only a rejection (401 / 403) is a problem; missing secrets and hiccups are not', () => {
    const cs = evaluate(S('2026-10-29T15:40:00Z', {}, { keys: { github: 'ok', oanda: 'bad', alpaca: 'absent', telegram: 'error' } }));
    expect(get(cs, 'key:oanda').status).toBe('problem');
    expect(get(cs, 'key:oanda').text).toContain('Renew OANDA_API_TOKEN');
    expect(get(cs, 'key:github').status).toBe('ok');
    expect(get(cs, 'key:alpaca').status).toBe('skip');
    expect(get(cs, 'key:telegram').status).toBe('skip');
  });
  it('GitHub token expiry: one heads-up 14 days before, one 3 days before', () => {
    const now = '2026-10-29T15:40:00Z';
    const e = (days: number) => evaluate(S(now, {}, { ghExpiry: at(now) + days * DAY }));
    expect(get(e(20), 'gh-exp-14').status).toBe('ok');
    expect(get(e(10), 'gh-exp-14').status).toBe('problem');
    expect(get(e(10), 'gh-exp-14').once).toBe(true);
    expect(get(e(10), 'gh-exp-14').text).toBe('GitHub token expires Nov 8 (in 10 days) — renew GITHUB_DISPATCH_TOKEN in Supabase secrets before then.');
    expect(get(e(10), 'gh-exp-3').status).toBe('ok');
    expect(get(e(2), 'gh-exp-3').status).toBe('problem');
    expect(get(e(2), 'gh-exp-14').status).toBe('skip');      // stays open, no resolved message
    expect(get(evaluate(S(now, {}, { ghExpiry: null })), 'gh-exp-14').status).toBe('ok');
    expect(get(evaluate(S(now, {}, { ghExpiry: undefined })), 'gh-exp-14').status).toBe('skip');
    expect(parseExpiry('2026-12-01 05:00:00 UTC')).toBe(at('2026-12-01T05:00:00Z'));
    expect(parseExpiry('2026-12-01 05:00:00 -0800')).toBe(at('2026-12-01T13:00:00Z'));
    expect(parseExpiry(null)).toBeNull();
    expect(parseExpiry('soon')).toBeNull();
  });
});

describe('health: messages (dedupe, grace, resolved, quiet hours, daily cap)', () => {
  const now = at('2026-10-29T15:40:00Z');
  const P = (id: string, o: Partial<Check> = {}): Check => ({ id, label: id === 'fx' ? 'FX scan' : id, status: 'problem', text: id === 'fx' ? 'FX scan missed 2 hours — last good scan 7:10 AM.' : `${id} is broken`, ...o });
  const OK = (id: string, text = ''): Check => ({ id, label: id === 'fx' ? 'FX scan' : id, status: 'ok', text });
  const base = { now, open: [] as Open[], lastAlert: {}, sentToday: 0, quiet: false };

  it('healthy: nothing at all', () => {
    expect(plan({ ...base, checks: [OK('fx'), OK('stock'), { id: 'brief', label: 'b', status: 'skip', text: '' }] })).toEqual({ add: [], close: [], alert: [], resolved: [], text: null });
  });
  it('a new problem: opened and ONE calm message at once', () => {
    const p = plan({ ...base, checks: [P('fx'), OK('stock')] });
    expect(p.add).toEqual(['fx']);
    expect(p.alert).toEqual(['fx']);
    expect(p.text).toBe('⚠️ FX scan missed 2 hours — last good scan 7:10 AM.\n<i>/health for the full status</i>');
  });
  it('grace: a key rejection is sent only when it is still there at the next check', () => {
    const c = P('key:oanda', { graceMs: 25 * MIN });
    const first = plan({ ...base, checks: [c] });
    expect(first.add).toEqual(['key:oanda']);
    expect(first.text).toBeNull();
    const second = plan({ ...base, checks: [c], open: [{ id: 'key:oanda', since: now - 30 * MIN, alerted: false }] });
    expect(second.alert).toEqual(['key:oanda']);
    // healed before the grace ran out: closed silently
    const healed = plan({ ...base, checks: [OK('key:oanda')], open: [{ id: 'key:oanda', since: now - 30 * MIN, alerted: false }] });
    expect(healed).toMatchObject({ close: ['key:oanda'], resolved: [], text: null });
  });
  it('dedupe: one alert per problem per 6 h; a once-problem never repeats', () => {
    const open = [{ id: 'fx', since: now - 7 * HOUR, alerted: true }];
    expect(plan({ ...base, checks: [P('fx')], open, lastAlert: { fx: now - 2 * HOUR } }).text).toBeNull();
    expect(plan({ ...base, checks: [P('fx')], open, lastAlert: { fx: now - 6 * HOUR - MIN } }).alert).toEqual(['fx']);
    const exp = P('gh-exp-14', { once: true });
    expect(plan({ ...base, checks: [exp], open: [{ id: 'gh-exp-14', since: now - 9 * DAY, alerted: true }], lastAlert: {} }).text).toBeNull();
  });
  it("resolved: ONE '✅ resolved' for an alerted problem; problems and resolutions share one message", () => {
    const open = [{ id: 'fx', since: now - HOUR, alerted: true }];
    const p = plan({ ...base, checks: [OK('fx', 'last good scan 9:05 AM')], open, lastAlert: { fx: now - HOUR } });
    expect(p).toMatchObject({ close: ['fx'], resolved: ['fx'], text: '✅ resolved: FX scan — last good scan 9:05 AM' });
    const both = plan({ ...base, checks: [OK('fx', 'last good scan 9:05 AM'), P('stock')], open, lastAlert: { fx: now - HOUR } });
    expect(both.text).toBe('⚠️ stock is broken\n✅ resolved: FX scan — last good scan 9:05 AM\n<i>/health for the full status</i>');
    const many = plan({ ...base, checks: [P('fx'), P('stock'), P('movers')] });
    expect(many.text!.split('\n').slice(0, 4)).toEqual(['⚠️ <b>3 things need a look</b>', '• FX scan missed 2 hours — last good scan 7:10 AM.', '• stock is broken', '• movers is broken']);
  });
  it('quiet hours: nothing sent; what is still broken goes out in one message after them; a night heal stays silent', () => {
    const night = plan({ ...base, quiet: true, checks: [P('fx'), P('stock')] });
    expect(night).toMatchObject({ add: ['fx', 'stock'], alert: [], text: null });
    const open = [{ id: 'fx', since: now - 5 * HOUR, alerted: false }, { id: 'stock', since: now - 5 * HOUR, alerted: false }, { id: 'movers', since: now - 6 * HOUR, alerted: false }];
    const morning = plan({ ...base, checks: [P('fx'), P('stock'), OK('movers')], open });
    expect(morning.alert).toEqual(['fx', 'stock']);
    expect(morning.close).toEqual(['movers']);
    expect(morning.resolved).toEqual([]);
    expect(morning.text).toContain('2 things need a look');
    // an alerted problem that heals during quiet hours: kept open, its '✅ resolved' comes after them
    const held = plan({ ...base, quiet: true, checks: [OK('fx')], open: [{ id: 'fx', since: now - 8 * HOUR, alerted: true }] });
    expect(held).toMatchObject({ close: [], resolved: [], text: null });
  });
  it(`max ${PER_DAY} health messages a Calgary day`, () => {
    expect(plan({ ...base, checks: [P('fx')], sentToday: PER_DAY })).toMatchObject({ add: ['fx'], alert: [], text: null });
    expect(plan({ ...base, checks: [P('fx')], sentToday: PER_DAY - 1 }).alert).toEqual(['fx']);
  });
  it('escapes plain text; state rows -> open / last alert / sent today', () => {
    expect(healthText([], [{ id: 'x', label: 'A<b>', status: 'ok', text: '1 & 2' }])).toBe('✅ resolved: A&lt;b&gt; — 1 &amp; 2');
    const rows = [
      { key: 'hopen:fx', kind: 'health-open', sent: true, created_at: '2026-10-29T10:00:00Z' },
      { key: 'hopen:fail:fx-scan', kind: 'health-open', sent: false, created_at: '2026-10-29T15:10:00Z' },
      { key: `halert:fx:${at('2026-10-29T10:00:00Z')}`, kind: 'health-alert', sent: false, created_at: '2026-10-29T10:00:00Z' },
      { key: `halert:fail:fx-scan:${at('2026-10-29T09:00:00Z')}`, kind: 'health-alert', sent: false, created_at: '2026-10-29T09:00:00Z' },
      { key: 'hmsg:1', kind: 'health-msg', sent: true, created_at: '2026-10-29T10:00:00Z' },
      { key: 'hmsg:2', kind: 'health-msg', sent: true, created_at: '2026-10-29T05:00:00Z' },   // 11 PM yesterday Calgary
    ];
    expect(stateOf(rows, now)).toEqual({
      open: [{ id: 'fx', since: at('2026-10-29T10:00:00Z'), alerted: true }, { id: 'fail:fx-scan', since: at('2026-10-29T15:10:00Z'), alerted: false }],
      lastAlert: { fx: at('2026-10-29T10:00:00Z'), 'fail:fx-scan': at('2026-10-29T09:00:00Z') }, sentToday: 1 });
    expect(tickKey(at('2026-10-29T15:40:00Z'))).toBe('health:2026-10-29T15:1');
    expect(tickKey(at('2026-10-29T15:20:00Z'))).toBe('health:2026-10-29T15:0');
  });
  it('a full healthy day of half-hourly checks sends nothing', () => {
    let open: Open[] = [];
    for (let t = at('2026-10-29T00:00:00Z'); t < at('2026-10-30T06:00:00Z'); t += 30 * MIN) {
      const runs: Partial<Record<WfFile, Run[]>> = {
        'fx-scan.yml': [R(new Date(t - 20 * MIN).toISOString())], 'movers.yml': [R(new Date(t - 30 * MIN).toISOString())],
        'stock-scan.yml': [R('2026-10-29T20:31:00Z'), R('2026-10-28T20:31:00Z')].filter(r => r.at <= t),
        'briefing.yml': [R('2026-10-29T12:01:00Z'), R('2026-10-28T12:01:00Z')].filter(r => r.at <= t),
        'fundamentals.yml': [R('2026-10-29T22:05:00Z'), R('2026-10-28T22:05:00Z')].filter(r => r.at <= t),
      };
      const p = plan({ now: t, checks: evaluate({ now: t, runs, keys: KEYS_OK, ghExpiry: t + 60 * DAY }), open, lastAlert: {}, sentToday: 0, quiet: false });
      expect(p.text, new Date(t).toISOString()).toBeNull();
      open = open.filter(o => !p.close.includes(o.id)).concat(p.add.map(id => ({ id, since: t, alerted: false })));
    }
  });
});

describe('health: probes and /health', () => {
  const TOKENS = { gh: 'ghtok-SECRET', oanda: 'oanda-SECRET', oandaLive: false, alpacaId: 'alp-ID', alpacaSecret: 'alp-SECRET', tg: '123:tg-SECRET' };
  function fake(status: Record<string, number>, headers: Record<string, string> = {}) {
    const calls: string[] = [];
    const f = async (url: string) => {
      calls.push(url);
      const host = new URL(url).host;
      const st = status[host] ?? 200;
      const body = host === 'api.github.com' ? { workflow_runs: [{ id: 9, created_at: '2026-10-29T15:10:00Z', status: 'completed', conclusion: 'success', display_title: 'FX scan', html_url: 'https://github.com/r4m4nxd/ramanFX/actions/runs/9' }] }
        : host === 'raw.githubusercontent.com' ? { generated: '2026-10-29T15:11:05Z', generated_at: '2026-10-29T20:31:58Z' } : { ok: true };
      return new Response(JSON.stringify(body), { status: st, headers: host === 'api.github.com' ? headers : {} });
    };
    return { f, calls };
  }
  it('reads every workflow, the token expiry header and the keys; no secret in the snapshot', async () => {
    const { f, calls } = fake({}, { 'github-authentication-token-expiration': '2026-11-20 06:00:00 UTC' });
    const s = await gather(TOKENS, f, at('2026-10-29T15:40:00Z'));
    expect(Object.keys(s.runs).sort()).toEqual(['briefing.yml', 'fundamentals.yml', 'fx-scan.yml', 'movers.yml', 'stock-scan.yml']);
    expect(s.keys).toEqual({ github: 'ok', oanda: 'ok', alpaca: 'ok', telegram: 'ok' });
    expect(s.ghExpiry).toBe(at('2026-11-20T06:00:00Z'));
    expect(calls.some(u => u.includes('/v3/instruments/EUR_USD/candles?count=1'))).toBe(true);
    expect(calls.some(u => u.includes('/v2/stocks/AAPL/trades/latest'))).toBe(true);
    expect(calls.some(u => u.endsWith('/getMe'))).toBe(true);
    const snap = snapOf(s, evaluate(s));
    expect(JSON.stringify(snap)).not.toMatch(/SECRET|alp-ID/);
    expect(snap.last['fx-scan.yml']).toBe(at('2026-10-29T15:10:00Z'));
  });
  it('rejected keys -> bad; a rate limit or an outage is not a rejection; missing secrets -> absent', async () => {
    const s = await gather(TOKENS, fake({ 'api.github.com': 401, 'api-fxpractice.oanda.com': 401, 'data.alpaca.markets': 403, 'api.telegram.org': 404 }).f, at('2026-10-29T15:40:00Z'));
    expect(s.keys).toEqual({ github: 'bad', oanda: 'bad', alpaca: 'bad', telegram: 'bad' });
    expect(s.runs).toEqual({});
    expect(s.ghExpiry).toBeUndefined();
    const down = await gather(TOKENS, fake({ 'api.github.com': 502, 'api-fxpractice.oanda.com': 503 }).f, at('2026-10-29T15:40:00Z'));
    expect(down.keys.github).toBe('error');
    expect(down.keys.oanda).toBe('error');
    const limited = await gather(TOKENS, fake({ 'api.github.com': 403 }, { 'x-ratelimit-remaining': '0' }).f, at('2026-10-29T15:40:00Z'));
    expect(limited.keys.github).toBe('error');
    const none = await gather({ gh: '', oanda: '', oandaLive: false, alpacaId: '', alpacaSecret: '', tg: '' }, fake({}).f, at('2026-10-29T15:40:00Z'));
    expect(none.keys).toEqual({ github: 'absent', oanda: 'absent', alpaca: 'absent', telegram: 'absent' });
    const thrown = await gather(TOKENS, async () => { throw new Error('net'); }, at('2026-10-29T15:40:00Z'));
    expect(thrown.keys).toEqual({ github: 'error', oanda: 'error', alpaca: 'error', telegram: 'error' });
  });
  it('published files only when needed', async () => {
    const { f, calls } = fake({});
    expect(await gatherFiles(['fx', 'stock'], f)).toEqual({ fx: at('2026-10-29T15:11:05Z'), stock: at('2026-10-29T20:31:58Z') });
    expect(calls).toHaveLength(2);
  });
  it('/health summary: last scans, keys, expiry, problems; stale or missing snapshot said plainly', async () => {
    const now = at('2026-10-29T15:45:00Z');
    const s = S('2026-10-29T15:40:00Z', { 'fx-scan.yml': [R('2026-10-29T15:10:00Z')], 'stock-scan.yml': [R('2026-10-28T20:31:00Z')] }, { ghExpiry: at('2026-11-20T06:00:00Z'), keys: { ...KEYS_OK, oanda: 'absent' } });
    const text = healthSummary(snapOf(s, evaluate(s)), now);
    expect(text).toContain('checked 9:40 AM');
    expect(text).toContain('FX scan: last ok 9:10 AM');
    expect(text).toContain('Stock scan: last ok Wed 2:31 PM');
    expect(text).toContain('Keys: GitHub ✅ · OANDA — · Alpaca ✅ · Telegram ✅');
    expect(text).toContain('GitHub token expires Nov 20 (22 days)');
    expect(text).toContain('All good.');
    expect(healthSummary(null, now)).toContain('No check yet');
    expect(healthSummary(snapOf(s, evaluate(s)), now + 3 * HOUR)).toContain('is the trader coach running?');
    const bad = S('2026-10-29T15:40:00Z', { 'fx-scan.yml': [R('2026-10-29T11:00:00Z')] });
    expect(healthSummary(snapOf(bad, evaluate(bad)), now)).toContain('⚠️ FX scan missed 4 hours');
  });
  it('bot /health (and /status) replies with the snapshot text', async () => {
    const ctx: Ctx = { now: new Date('2026-10-29T15:45:00Z'), load: async () => null, health: async () => '🩺 <b>RamanFX health</b> · ok' };
    for (const t of ['/health', '/status']) {
      const r = await handle(t, ctx);
      expect(r.cmd).toBe('health');
      expect(r.text).toBe('🩺 <b>RamanFX health</b> · ok');
    }
    expect((await handle('/health', { now: new Date(), load: async () => null })).text).toContain('needs the database');
  });
});

describe('health: the web app (Vercel deploys, data through the app)', () => {
  const now = at('2026-10-29T18:00:00Z');   // 12:00 PM Calgary
  const LIVE = 'a'.repeat(40);
  const A = (o: Partial<AppSnap> = {}): Snapshot => ({ ...S('2026-10-29T18:00:00Z', {}), app: { live: LIVE, builtAt: at('2026-10-29T15:00:00Z'), pendingSince: null, data: {}, ...o } });
  const app = (s: Snapshot) => get(appChecks(s), 'app');
  const data = (s: Snapshot) => get(appChecks(s), 'app-data');
  it('deploy: nothing waiting or a change under 90 min is fine; older = App not updating', () => {
    expect(app(A()).status).toBe('ok');
    expect(app(A({ pendingSince: now - 89 * MIN })).status).toBe('ok');
    const c = app(A({ pendingSince: now - 3 * HOUR - 10 * MIN }));
    expect(c.status).toBe('problem');
    expect(c.text).toBe('App not updating — Vercel may be rate-limited; latest app change not live for 3h (live aaaaaaa, waiting since 8:50 AM).');
    expect(app(A({ pendingSince: now - 95 * MIN })).text).toContain('not live for 1.5h');
    expect(get(evaluate(A({ pendingSince: now - 2 * HOUR })), 'app').status).toBe('problem');   // part of evaluate()
  });
  it('deploy: version.json or GitHub unreadable -> skipped, never a false alarm', () => {
    expect(app(A({ live: null })).status).toBe('skip');
    expect(app(A({ pendingSince: undefined })).status).toBe('skip');
    expect(app(S('2026-10-29T18:00:00Z', {})).status).toBe('skip');
    expect(data(S('2026-10-29T18:00:00Z', {})).status).toBe('skip');
  });
  it('data: unreachable, missing time or 30+ min behind GitHub is a problem after two checks; matching is ok', () => {
    const fresh = { app: now - 10 * MIN, raw: now - 10 * MIN };
    expect(data(A({ data: { fx: fresh, movers: { app: now - 40 * MIN, raw: now - 15 * MIN } } })).status).toBe('ok');
    const down = data(A({ data: { fx: { app: undefined, raw: now }, movers: fresh } }));
    expect(down).toMatchObject({ status: 'problem', graceMs: 25 * MIN });
    expect(down.text).toBe('App data not loading — /fx/latest.json unreachable through the app. Check the GitHub rewrites in vercel.json.');
    const stale = data(A({ data: { fx: fresh, movers: { app: at('2026-10-29T15:05:00Z'), raw: at('2026-10-29T17:13:00Z') } } }));
    expect(stale.text).toContain('/movers/latest.json through the app is from 9:05 AM, GitHub has 11:13 AM');
    expect(data(A({ data: { fx: { app: null, raw: now } } })).text).toContain('missing its time');
    expect(data(A({ data: { fx: { app: now - 2 * HOUR, raw: undefined } } })).status).toBe('ok');   // GitHub down: reachability only
    // two checks in a row before a message (grace), same dedupe as every check
    const P = [data(A({ data: { fx: { app: undefined, raw: now } } }))];
    expect(plan({ now, checks: P, open: [], lastAlert: {}, sentToday: 0, quiet: false })).toMatchObject({ add: ['app-data'], alert: [], text: null });
    const second = plan({ now: now + 30 * MIN, checks: P, open: [{ id: 'app-data', since: now, alerted: false }], lastAlert: {}, sentToday: 0, quiet: false });
    expect(second.alert).toEqual(['app-data']);
    expect(second.text).toContain('⚠️ App data not loading');
    expect(plan({ now, checks: [app(A({ pendingSince: now - 2 * HOUR }))], open: [], lastAlert: {}, sentToday: 0, quiet: true }).text).toBeNull();
    const ok = plan({ now, checks: [app(A())], open: [{ id: 'app', since: now - 3 * HOUR, alerted: true }], lastAlert: {}, sentToday: 0, quiet: false });
    expect(ok.text).toBe('✅ resolved: App deploy — live aaaaaaa');
  });
  it('/health shows the live commit, a waiting change and the data state', () => {
    const s = A({ pendingSince: now - 2 * HOUR, data: { fx: { app: now, raw: now } } });
    const t = healthSummary(snapOf(s, evaluate(s)), now);
    expect(t).toContain('App: live aaaaaaa (built 9:00 AM) · app change waiting since 10:00 AM · data ✅');
    expect(t).toContain('⚠️ App not updating');
  });

  // GitHub compare: commits oldest first, files = the whole diff
  const C = (i: number) => String(i).padStart(40, 'c');
  function gh(commits: { files: string[]; at: string }[], o: { live?: unknown; app?: Record<string, unknown>; status?: number } = {}) {
    const calls: string[] = [];
    const f = async (url: string) => {
      calls.push(url);
      if (url === `${APP_URL}/version.json`) return o.live === undefined ? new Response(JSON.stringify({ sha: LIVE, built_at: '2026-10-29T15:00:00Z' })) : new Response(String(o.live));
      if (url.startsWith(APP_URL)) { const k = url.includes('/fx/') ? 'fx' : 'movers'; const v = o.app?.[k]; return v === 404 ? new Response('no', { status: 404 }) : new Response(typeof v === 'string' ? v : JSON.stringify({ generated: '2026-10-29T17:50:00Z' })); }
      if (url.startsWith('https://raw.githubusercontent.com/')) return new Response(JSON.stringify({ generated: '2026-10-29T17:50:00Z' }));
      const m = /compare\/([0-9a-f]{40})\.\.\.(\w+)$/.exec(url);
      if (!m || o.status) return new Response('{}', { status: o.status ?? 404 });
      const upto = m[2] === 'main' ? commits.length : commits.findIndex((_, i) => C(i) === m[2]) + 1;
      const cs = commits.slice(0, upto);
      return new Response(JSON.stringify({ status: cs.length ? 'ahead' : 'identical', commits: cs.map((c, i) => ({ sha: C(i), commit: { committer: { date: c.at } } })), files: [...new Set(cs.flatMap(c => c.files))].map(filename => ({ filename })) }));
    };
    return { f, calls };
  }
  it('pendingSince: data / bot / test commits never wait; the oldest app commit is found', async () => {
    const data = (h: number) => ({ files: ['public/fx/latest.json', 'public/movers/latest.json', 'tools/briefing/state.json'], at: `2026-10-29T${String(h).padStart(2, '0')}:13:00Z` });
    expect(await pendingSince(gh([]).f, 'tok', LIVE)).toBeNull();
    expect(await pendingSince(gh([data(10), data(11), { files: ['supabase/functions/x.ts', 'src/core/a.test.ts', 'docs/x.md', '.github/workflows/a.yml'], at: '2026-10-29T12:00:00Z' }]).f, 'tok', LIVE)).toBeNull();
    const list = [data(9), data(10), { files: ['src/pages/Home.tsx'], at: '2026-10-29T10:40:00Z' }, data(11), { files: ['vercel.json'], at: '2026-10-29T11:30:00Z' }, data(12), data(13)];
    const { f, calls } = gh(list);
    expect(await pendingSince(f, 'tok', LIVE)).toBe(at('2026-10-29T10:40:00Z'));
    expect(calls.length).toBeLessThanOrEqual(1 + Math.ceil(Math.log2(list.length)) + 1);
    expect(await pendingSince(gh(list, { status: 500 }).f, 'tok', LIVE)).toBeUndefined();
  });
  it('gatherApp: version, waiting change and data through the app vs GitHub', async () => {
    const list = [{ files: ['public/index.html'], at: '2026-10-29T15:30:00Z' }];
    const a = await gatherApp(gh(list, { app: { movers: 404 } }).f, 'tok');
    expect(a).toEqual({ live: LIVE, builtAt: at('2026-10-29T15:00:00Z'), pendingSince: at('2026-10-29T15:30:00Z'),
      data: { fx: { app: at('2026-10-29T17:50:00Z'), raw: at('2026-10-29T17:50:00Z') }, movers: { app: undefined, raw: at('2026-10-29T17:50:00Z') } } });
    expect(get(appChecks({ ...S('2026-10-29T18:00:00Z', {}), app: a }), 'app').status).toBe('problem');
    const html = await gatherApp(gh(list, { live: '<!doctype html>', app: { fx: '<!doctype html>' } }).f, 'tok');   // SPA fallback = not JSON
    expect(html).toMatchObject({ live: null, pendingSince: undefined });
    expect(html.data.fx!.app).toBeUndefined();
    const noTok = await gatherApp(gh(list).f, '');
    expect(noTok.pendingSince).toBeUndefined();
  });
});
