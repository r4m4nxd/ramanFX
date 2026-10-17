import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { DayStat } from '@/core/stats';
import { dayKey } from '@/core/time';
import { monthName, pct, tone, useMoney } from '@/lib/format';
import { heatColor, HeatLegend, inkOn, scaleFor } from './Heatmap';
import { Icon } from './Icon';
import { CountUp, cx, ease, Segmented } from './kit';
import { DayPeek, useLongPress } from './DayPeek';

/**
 * Twelve mini months for one year, each day tinted by its net P&L. Days ripple in month by month;
 * hovering or tapping a day lifts it and opens its summary in the bar above.
 */
export function YearCalendar({ days, year, onYear, onMonth }: { days: DayStat[]; year: number; onYear: (y: number) => void; onMonth?: (m: number) => void }) {
  const fmt = useMoney();
  const map = useMemo(() => new Map(days.map(d => [d.date, d])), [days]);
  const yearDays = useMemo(() => days.filter(d => d.date.startsWith(`${year}-`)), [days, year]);
  const [metric, setMetric] = useState<'net' | 'win' | 'trades'>('net');
  const mv = (d: DayStat) => (metric === 'net' ? d.pnl : metric === 'trades' ? d.trades : d.wins + d.losses ? d.wins / (d.wins + d.losses) : null);
  const scale = useMemo(() => scaleFor(metric, yearDays.map(mv)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [yearDays, metric]);
  const [sel, setSel] = useState<string | null>(null);
  const selDay = sel ? map.get(sel) : undefined;
  const [peek, setPeek] = useState<string | null>(null);
  const hold = useLongPress();
  const today = dayKey(new Date());

  const net = yearDays.reduce((a, d) => a + d.pnl, 0);
  const green = yearDays.filter(d => d.pnl > 0).length;
  const months = Array.from({ length: 12 }, (_, m) => {
    const pre = `${year}-${String(m + 1).padStart(2, '0')}`;
    const ds = yearDays.filter(d => d.date.startsWith(pre));
    return { m, net: ds.reduce((a, d) => a + d.pnl, 0), n: ds.length };
  });
  const best = [...months].filter(x => x.n).sort((a, b) => b.net - a.net)[0];
  const years = [...new Set(days.map(d => +d.date.slice(0, 4)))];

  return (
    <div className="flex flex-col gap-5">
      {/* Year header */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
        <div className="flex items-center gap-1">
          <button className="btn-ghost w-9 h-9 px-0" aria-label="Previous year" disabled={!years.some(y => y < year)} onClick={() => onYear(year - 1)}><Icon name="chevronLeft" /></button>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.h2 key={year} initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }} transition={{ duration: 0.35, ease }}
              className="text-[34px] leading-none font-semibold tracking-tight num w-[92px] text-center">{year}</motion.h2>
          </AnimatePresence>
          <button className="btn-ghost w-9 h-9 px-0" aria-label="Next year" disabled={!years.some(y => y > year)} onClick={() => onYear(year + 1)}><Icon name="chevronRight" /></button>
        </div>
        <div className="grid grid-cols-3 gap-4 sm:gap-6 flex-1 min-w-[260px]">
          <div><div className="label">Year net</div><CountUp value={net} format={v => fmt(v, { signed: true })} className={cx('num text-[15px] sm:text-lg font-semibold block mt-1 whitespace-nowrap', tone(net))} /></div>
          <div><div className="label">Green days</div><div className="num text-[15px] sm:text-lg font-semibold mt-1 whitespace-nowrap">{green}<span className="text-ink3 text-sm">/{yearDays.length}</span> <span className="text-xs text-ink3">{pct(yearDays.length ? green / yearDays.length : null, 0)}</span></div></div>
          <div><div className="label">Best month</div><div className="text-[15px] sm:text-lg font-semibold mt-1 whitespace-nowrap">{best ? <>{monthName(best.m).slice(0, 3)} <span className={cx('num text-sm', tone(best.net))}>{fmt(best.net, { signed: true, compact: true })}</span></> : '—'}</div></div>
        </div>
      </div>

      <div className="flex justify-end -mb-2"><Segmented swap="card" label="Colour by" size="sm" value={metric} onChange={setMetric} options={[{ value: 'net', label: 'Net $' }, { value: 'win', label: 'Win %' }, { value: 'trades', label: 'Trades' }]} /></div>
      {/* Selected-day bar */}
      <div className="h-[52px] rounded-xl bg-raised/70 border border-line px-4 flex items-center overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {selDay ? (
            <motion.div key={sel} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="flex items-center gap-3 w-full min-w-0">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: heatColor(metric, mv(selDay), scale) }} />
              <span className="text-[13px] font-medium truncate">{new Date(selDay.date + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
              <span className="text-xs text-ink3 num whitespace-nowrap">{selDay.trades} trades · {selDay.wins}W {selDay.losses}L</span>
              <span className={cx('num font-semibold ml-auto whitespace-nowrap', tone(selDay.pnl))}>{fmt(selDay.pnl, { signed: true })}</span>
              <button type="button" onClick={() => setPeek(selDay.date)} className="btn h-8 px-2.5 text-xs shrink-0" aria-label="Day details"><Icon name="reports" size={13} /><span className="max-sm:hidden">Details</span></button>
            </motion.div>
          ) : (
            <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-between gap-3 w-full">
              <span className="text-xs text-ink3 whitespace-nowrap">Hold a day for details</span>
              <div className="flex-1 max-w-[280px]"><HeatLegend metric={metric} scale={scale} /></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Twelve months */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 md:gap-x-6">
        {months.map(({ m, net: mn, n }) => {
          const first = new Date(year, m, 1);
          const lead = (first.getDay() + 6) % 7;
          const len = new Date(year, m + 1, 0).getDate();
          return (
            <motion.section key={`${year}-${m}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease, delay: m * 0.03 }} aria-label={monthName(m)}>
              <button type="button" onClick={() => onMonth?.(m)} className="w-full flex items-baseline justify-between gap-2 mb-2 group">
                <span className="text-[13px] font-semibold group-hover:text-accent transition-colors">{monthName(m).slice(0, 3)}</span>
                <span className={cx('num text-[11.5px] font-medium', n ? tone(mn) : 'text-ink3')}>{n ? fmt(mn, { signed: true, compact: true }) : '—'}</span>
              </button>
              <div className="grid grid-cols-7 gap-[3px]">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((h, i) => <span key={i} className="text-[9px] text-ink3 text-center pb-0.5">{h}</span>)}
                {Array.from({ length: lead }, (_, i) => <span key={`e${i}`} />)}
                {Array.from({ length: len }, (_, i) => {
                  const k = `${year}-${String(m + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                  const s = map.get(k);
                  const on = sel === k;
                  return (
                    <button key={k} type="button" disabled={!s}
                      {...(s ? hold.bind(() => { setSel(k); setPeek(k); }) : {})}
                      onPointerEnter={e => { if (s && e.pointerType === 'mouse') setSel(k); }} onClick={() => { if (s && !hold.consumed()) setSel(k); }}
                      aria-label={s ? `${k}: ${fmt(s.pnl, { signed: true })}` : k}
                      className={cx('heat-cell hold-cell aspect-square rounded-[4px] text-[9px] num leading-none grid place-items-center', on && 'is-active', k === today && 'ring-1 ring-accent', !s && 'cursor-default')}
                      style={{ background: s ? heatColor(metric, mv(s), scale) : 'rgb(var(--raised) / 0.6)', color: s ? inkOn(metric, mv(s), scale) : 'rgb(var(--ink3) / 0.6)', animationDelay: `${m * 45 + i * 9}ms` }}>
                      {i + 1}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>
      <DayPeek day={peek} onClose={() => setPeek(null)} />
    </div>
  );
}
