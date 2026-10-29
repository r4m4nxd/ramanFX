import { describe, expect, it } from 'vitest';
import { bucketDays, bucketSeries, periodStart } from './charts';

describe('period buckets', () => {
  const days = [
    { date: '2026-08-03', pnl: 10, trades: 1 }, { date: '2026-08-09', pnl: -4, trades: 2 }, // Mon & Sun, same week
    { date: '2026-08-10', pnl: 5, trades: 1 }, { date: '2026-09-01', pnl: 7, trades: 3 },
  ];
  it('weeks start Monday and include Sunday', () => {
    const w = bucketDays(days, 'week');
    expect(w.map(x => [x.date, x.pnl, x.trades])).toEqual([['2026-08-03', 6, 3], ['2026-08-10', 5, 1], ['2026-08-31', 7, 3]]);
  });
  it('months sum every day in the month', () => {
    expect(bucketDays(days, 'month').map(x => [x.date, x.pnl])).toEqual([['2026-08-01', 11], ['2026-09-01', 7]]);
  });
  it('series keep the last value and the period low', () => {
    const t = (d: string) => new Date(d).getTime();
    const s = bucketSeries([{ t: t('2026-08-03T10:00'), cum: 5, dd: -1 }, { t: t('2026-08-05T10:00'), cum: 2, dd: -4 }, { t: t('2026-08-07T10:00'), cum: 8, dd: 0 }], 'week', ['dd']);
    expect(s).toHaveLength(1);
    expect(s[0]).toEqual({ t: periodStart(new Date('2026-08-03T10:00'), 'week').getTime(), cum: 8, dd: -4 });
  });
});
