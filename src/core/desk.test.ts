import { describe, expect, it } from 'vitest';
import { bestSlots, editWatch, judge, momentOf, nextChance, parseDeskInst, planDays, savePlanLine, searchMarkets, studyAt, watchOf, DESK_DEFAULT, type Moment } from './desk';

const D1 = [...Array.from({ length: 28 }, (_, d) => [`2026-10-${String(d + 1).padStart(2, '0')}T00:00`, 1.1, 1.105, 1.095, 1.1]), ['2026-11-12T00:00', 1.1, 1.11, 1.1, 1.105], ['2026-11-13T00:00', 1.105, 1.108, 1.103, 1.104]];
const H1 = [['2026-11-12T23:00', 1.1, 1.2, 1.0, 1.1], ['2026-11-13T00:00', 1.105, 1.106, 1.104, 1.105], ['2026-11-13T09:00', 1.105, 1.108, 1.103, 1.104], ['2026-11-13T15:00', 1.104, 1.1125, 1.1035, 1.104]];
const rule = (short: string, status: string) => ({ short, status, text: '', ref: '' });
const shard = (over: Record<string, unknown> = {}) => ({ instruments: { EURUSD: {
  cls: 'major', price: 1.104, digits: 5, bars: { D1, H1 }, signals: [],
  zones: [{ tf: 'W1', side: 'demand', proximal: 1.096, distal: 1.073 }, { tf: 'H1', side: 'demand', proximal: 1.1035, distal: 1.103 }, { tf: 'D1', side: 'supply', proximal: 1.12, distal: 1.125 }],
  hits: [{ section: 'near', tf: 'W1', side: 'demand', zid: 'A' }],
  checks: [{ zid: 'B', tf: 'H4', side: 'supply', pips: 1, rules: [rule('leg', 'fail')] }, { zid: 'A', tf: 'W1', side: 'demand', pips: 5, rules: [rule('fresh', 'pass'), rule('location', 'fail'), rule('room', 'fail'), rule('curve', 'warn')] }],
  ...over } } });
const week = Array.from({ length: 7 }, (_, d) => Array.from({ length: 48 }, (_, i) => (d > 4 ? null : i === 12 ? 2.5 : i === 30 ? 1.3 : i >= 40 ? 0.4 : 1)));
// a weekday at 8:00 New York = 6:00 on the study clock, New York 2 h ahead of Calgary
const at = (nyMin: number, nyWeekday = 4, brokerHour: number | null = null): Moment => ({ live: true, closed: false, nyWeekday, nyMin, ahead: 120, brokerHour });

describe('decision desk', () => {
  it('reads one market from a shard: areas, the scanner hit and its own rule check', () => {
    const i = parseDeskInst(shard(), 'EURUSD')!;
    expect(i.adr).toBeCloseTo(0.01, 6);
    expect(i.hours.map(h => h[0])).toEqual([0, 9, 15]);
    expect(i.prev).toEqual({ high: 1.11, low: 1.1, close: 1.105 });
    expect(i.buy).toMatchObject({ tf: 'W1', inside: false });
    expect(i.buy!.pct).toBeCloseTo(0.72, 1);
    expect(i.sell).toMatchObject({ tf: 'D1', lo: 1.12 });
    expect(i.place).toEqual({ sec: 'near', tf: 'W1', side: 'D' });
    expect(i.check).toMatchObject({ tf: 'W1', side: 'D' });          // the check of the area price is near, not the one with fewest fails
    expect(i.check!.rules.map(r => r.status)).toEqual(['p', 'f', 'f', 'w']);
    expect(parseDeskInst(shard(), 'NOPE')).toBeNull();
    expect(parseDeskInst({}, 'EURUSD')).toBeNull();
  });
  it('study clock: New York minus 2 h, Monday = row 0', () => {
    expect(studyAt({ nyWeekday: 1, nyMin: 8 * 60 })).toMatchObject({ row: 0, slot: 12, min: 360 });
    expect(studyAt({ nyWeekday: 1, nyMin: 60 })).toMatchObject({ row: 6, weekday: 0 });        // 1:00 Monday New York is still Sunday there
    expect(bestSlots(week[0])).toEqual([12, 30]);
    expect(bestSlots(null)).toEqual([]);
  });
  it('four lights and the verdict', () => {
    const i = parseDeskInst(shard(), 'EURUSD')!;
    const j = judge(i, week, null, at(8 * 60, 4, 10));             // only the candles before broker hour 10
    expect([j.time.light, j.place.light, j.rules.light, j.room.light]).toEqual(['g', 'a', 'a', 'g']);
    expect(j.verdict).toBe('close');
    expect(j.rules.title).toBe('2 of 4 rules pass');
    expect(j.used).toBeCloseTo(0.5, 2);
    expect(judge(i, week, null, at(8 * 60)).used).toBeCloseTo(0.95, 2);            // the whole day so far: 1.1125 - 1.103 against 0.01
    // most of the move done -> "done", whatever else is green
    expect(judge(i, week, null, at(8 * 60, 4, 16)).verdict).toBe('done');
    // a full scanner signal at a good time with room left -> ready
    expect(judge(parseDeskInst(shard({ signals: ['BUY'] }), 'EURUSD')!, week, null, at(8 * 60, 4, 10)).verdict).toBe('ready');
    // quiet hour, and price nowhere near an area -> wait
    const far = parseDeskInst(shard({ hits: [] }), 'EURUSD')!;
    expect(judge(far, week, null, at(23 * 60, 4, 10))).toMatchObject({ verdict: 'wait', why: 'In the middle of nowhere' });
    expect(judge(i, week, null, { ...at(8 * 60), closed: true }).verdict).toBe('closed');
    // no weekday data for this market: the forex average is used
    expect(judge(i, null, week, at(8 * 60)).time.light).toBe('g');
  });
  it('next chance: later today, else the next trading day', () => {
    expect(nextChance(week, null, at(7 * 60))).toMatchObject({ text: 'today 6:00 AM', inMin: 60 });
    expect(nextChance(week, null, at(20 * 60, 4))).toMatchObject({ text: 'tomorrow 6:00 AM' });
    expect(nextChance(week, null, at(20 * 60, 5))!.text).toBe('Monday 6:00 AM');
    expect(nextChance(week, null, { ...at(8 * 60), ahead: 60 })!.text).toBe('today 4:00 PM');       // 6:00 is now; the next one, shown with a 1 h gap
  });
  it('moment: forex closes Friday 17:00 New York', () => {
    expect(momentOf(new Date('2026-07-10T20:59:00Z')).closed).toBe(false);
    expect(momentOf(new Date('2026-07-10T21:00:00Z')).closed).toBe(true);
    expect(momentOf(new Date('2026-07-12T21:00:00Z'))).toMatchObject({ closed: false, ahead: 120 });
  });
  it('watchlist: add, remove, never empty, no duplicates', () => {
    expect(watchOf(undefined)).toEqual(DESK_DEFAULT);
    expect(editWatch(undefined, 'gbp/usd', true)).toEqual([...DESK_DEFAULT, 'GBPUSD']);
    expect(editWatch(['EURUSD'], 'EURUSD', true)).toEqual(['EURUSD']);
    expect(editWatch(['EURUSD', 'XAUUSD'], 'EURUSD', false)).toEqual(['XAUUSD']);
    expect(editWatch(['EURUSD'], 'EURUSD', false)).toEqual(['EURUSD']);
    expect(searchMarkets([{ sym: 'GBPUSD', cls: 'major' }, { sym: 'GBPJPY', cls: 'cross' }, { sym: 'EURGBP', cls: 'cross' }], 'gbp', ['GBPJPY']).map(x => x.sym)).toEqual(['GBPUSD', 'EURGBP']);
  });
  it('plans: one line per market per day, old days dropped; tonight plans the next weekday', () => {
    let p = savePlanLine(undefined, '2026-11-16', 'eurusd', '  buy 1.0960  ');
    expect(p).toEqual({ '2026-11-16': { EURUSD: 'buy 1.0960' } });
    p = savePlanLine(p, '2026-11-16', 'EURUSD', '');
    expect(p).toEqual({});
    for (let d = 1; d <= 25; d++) p = savePlanLine(p, `2026-10-${String(d).padStart(2, '0')}`, 'EURUSD', 'x');
    expect(Object.keys(p)).toHaveLength(21);
    expect(planDays(new Date('2026-07-13T02:00:00Z'))).toMatchObject({ today: '2026-07-12', planFor: '2026-07-13', planForName: 'Monday', evening: true });     // Sunday 8 PM
    expect(planDays(new Date('2026-07-13T12:15:00Z'))).toMatchObject({ today: '2026-07-13', planFor: '2026-07-13', evening: false });                        // Monday 6:15 AM
    expect(planDays(new Date('2026-07-11T02:00:00Z'))).toMatchObject({ planFor: '2026-07-13', planForName: 'Monday' });                                    // Friday evening
  });
});
