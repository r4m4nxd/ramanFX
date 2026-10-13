import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '@/data/derived';
import { monthName, tone, useMoney } from '@/lib/format';
import { Card, CardHead, cx, Page, rise } from '@/ui/kit';
import { MonthCalendar } from '@/ui/MonthCalendar';
import { Icon } from '@/ui/Icon';

export default function CalendarPage() {
  const { stats } = useAnalytics();
  const fmt = useMoney();
  const nav = useNavigate();
  const years = useMemo(() => [...new Set(stats.days.map(d => +d.date.slice(0, 4)))].sort(), [stats.days]);
  const [year, setYear] = useState(years[years.length - 1] ?? new Date().getFullYear());
  const months = useMemo(() => Array.from({ length: 12 }, (_, m) => {
    const ds = stats.days.filter(d => d.date.startsWith(`${year}-${String(m + 1).padStart(2, '0')}`));
    return { m, net: ds.reduce((a, d) => a + d.pnl, 0), days: ds.length, trades: ds.reduce((a, d) => a + d.trades, 0), green: ds.filter(d => d.pnl > 0).length };
  }), [stats.days, year]);
  const maxAbs = Math.max(1, ...months.map(x => Math.abs(x.net)));
  const yearNet = months.reduce((a, x) => a + x.net, 0);
  const [focusMonth, setFocusMonth] = useState<Date | undefined>(undefined);
  return (
    <Page>
      <Card>
        <CardHead title={<span className="flex items-center gap-2">
          <button className="btn-ghost w-8 h-8 px-0" aria-label="Previous year" onClick={() => setYear(y => y - 1)}><Icon name="chevronLeft" size={15} /></button>
          {year}
          <button className="btn-ghost w-8 h-8 px-0" aria-label="Next year" onClick={() => setYear(y => y + 1)}><Icon name="chevronRight" size={15} /></button>
        </span>} sub={<span className="num">Year net <span className={tone(yearNet)}>{fmt(yearNet, { signed: true })}</span></span>} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {months.map(x => (
            <motion.button variants={rise} key={x.m} onClick={() => setFocusMonth(new Date(year, x.m, 1))}
              className={cx('rounded-xl border p-3 text-left transition-transform hover:-translate-y-0.5', x.days ? (x.net >= 0 ? 'border-profit/35' : 'border-loss/40') : 'border-line')}
              style={x.days ? { background: `rgb(var(--${x.net >= 0 ? 'profit' : 'loss'}) / ${0.06 + 0.22 * Math.abs(x.net) / maxAbs})` } : undefined}>
              <div className="text-xs text-ink2">{monthName(x.m).slice(0, 3)}</div>
              <div className={cx('num font-semibold mt-1', x.days ? tone(x.net) : 'text-ink3')}>{x.days ? fmt(x.net, { signed: true, compact: true }) : '—'}</div>
              <div className="text-[10.5px] text-ink3 mt-0.5">{x.days ? `${x.green}/${x.days} green days` : 'no trades'}</div>
            </motion.button>
          ))}
        </div>
      </Card>
      <Card><MonthCalendar key={focusMonth?.getTime()} days={stats.days} initial={focusMonth} onDay={d => nav(`/journal?day=${d}`)} /></Card>
    </Page>
  );
}
