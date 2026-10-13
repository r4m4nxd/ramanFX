import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { dayKey } from '@/core/time';
import type { DayStat } from '@/core/stats';
import { monthName, useMoney } from '@/lib/format';
import { Icon } from './Icon';
import { cx, ease } from './kit';

/** Month grid, Mon–Sun plus a weekly total column (weekends collapse when untraded). */
export function MonthCalendar({ days, onDay, compact = false, initial }: { days: DayStat[]; onDay?: (date: string) => void; compact?: boolean; initial?: Date }) {
  const fmt = useMoney();
  const last = days.length ? new Date(days[days.length - 1].date + 'T00:00') : new Date();
  const [cursor, setCursor] = useState(() => { const d = initial ?? last; return new Date(d.getFullYear(), d.getMonth(), 1); });
  const map = useMemo(() => new Map(days.map(d => [d.date, d])), [days]);
  const y = cursor.getFullYear(), m = cursor.getMonth();
  const tradedWeekend = days.some(d => { const dt = new Date(d.date + 'T00:00'); return dt.getFullYear() === y && dt.getMonth() === m && (dt.getDay() === 0 || dt.getDay() === 6); });
  const cols = tradedWeekend ? 7 : 5;
  const start = new Date(y, m, 1); start.setDate(1 - ((start.getDay() + 6) % 7));
  const weeks: Date[][] = [];
  const monthEnd = new Date(y, m + 1, 0);
  for (const d = new Date(start); d <= monthEnd;) {
    const w: Date[] = [];
    for (let i = 0; i < 7; i++) { w.push(new Date(d)); d.setDate(d.getDate() + 1); }
    weeks.push(w);
  }
  const monthDays = days.filter(d => d.date.startsWith(`${y}-${String(m + 1).padStart(2, '0')}`));
  const monthNet = monthDays.reduce((a, d) => a + d.pnl, 0);
  const maxAbs = Math.max(1, ...monthDays.map(d => Math.abs(d.pnl)));
  const today = dayKey(new Date());
  const heads = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, cols);

  return (
    <div>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div>
          <div className="font-semibold text-[15px]">{monthName(m)} {y}</div>
          <div className="text-xs text-ink3 mt-0.5 num">{monthDays.length} days · <span className={monthNet >= 0 ? 'text-profit' : 'text-loss'}>{fmt(monthNet, { signed: true })}</span></div>
        </div>
        <div className="flex gap-1">
          <button className="btn w-9 px-0" aria-label="Previous month" onClick={() => setCursor(new Date(y, m - 1, 1))}><Icon name="chevronLeft" size={15} /></button>
          <button className="btn w-9 px-0" aria-label="Next month" onClick={() => setCursor(new Date(y, m + 1, 1))}><Icon name="chevronRight" size={15} /></button>
        </div>
      </div>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols + 1}, minmax(0, 1fr))` }}>
        {heads.map(h => <div key={h} className="label text-center pb-1">{h}</div>)}
        <div className="label text-center pb-1">Week</div>
        {weeks.map((w, wi) => {
          const ws = w.map(d => map.get(dayKey(d))).filter((d, i) => d && w[i].getMonth() === m) as DayStat[];
          const wNet = ws.reduce((a, d) => a + d.pnl, 0), wN = ws.reduce((a, d) => a + d.trades, 0);
          return [
            ...w.slice(0, cols).map((d, di) => {
              const k = dayKey(d), s = map.get(k), inMonth = d.getMonth() === m;
              const intensity = s ? 0.1 + 0.32 * Math.min(1, Math.abs(s.pnl) / maxAbs) : 0;
              const Cell = s && onDay ? 'button' : 'div';
              return (
                <motion.div key={k} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease, delay: (wi * cols + di) * 0.008 }}>
                  <Cell {...(s && onDay ? { type: 'button' as const, onClick: () => onDay(k), 'aria-label': `${k}: ${fmt(s.pnl, { signed: true })}` } : {})}
                    className={cx('w-full rounded-lg border text-left flex flex-col justify-between transition-transform', compact ? 'min-h-[54px] p-1.5' : 'min-h-[76px] p-2', s && onDay && 'hover:scale-[1.04] hover:z-10 relative',
                      !inMonth ? 'opacity-30 border-transparent' : s ? (s.pnl >= 0 ? 'border-profit/35' : 'border-loss/40') : 'border-line/70 bg-bg/40', k === today && 'ring-2 ring-accent')}
                    style={s && inMonth ? { background: s.pnl >= 0 ? `rgb(var(--profit) / ${intensity})` : `rgb(var(--loss) / ${intensity})` } : undefined}>
                    <span className="text-[11px] text-ink3">{d.getDate()}</span>
                    {s && inMonth && (<>
                      <span className={cx('num font-semibold leading-tight', compact ? 'text-[11px]' : 'text-[12.5px]', s.pnl >= 0 ? 'text-profit' : 'text-loss')}>{fmt(s.pnl, { signed: true, compact: true, dp: 0 })}</span>
                      {!compact && <span className="text-[10.5px] text-ink3">{s.trades} {s.trades === 1 ? 'trade' : 'trades'}</span>}
                    </>)}
                  </Cell>
                </motion.div>
              );
            }),
            <div key={`w${wi}`} className={cx('rounded-lg border border-line bg-raised flex flex-col justify-between', compact ? 'min-h-[54px] p-1.5' : 'min-h-[76px] p-2')}>
              <span className="text-[11px] text-ink3">W{wi + 1}</span>
              {wN > 0 && <span className={cx('num font-semibold', compact ? 'text-[11px]' : 'text-[12.5px]', wNet >= 0 ? 'text-profit' : 'text-loss')}>{fmt(wNet, { signed: true, compact: true, dp: 0 })}</span>}
              {wN > 0 && !compact && <span className="text-[10.5px] text-ink3">{wN} trades</span>}
            </div>,
          ];
        })}
      </div>
    </div>
  );
}
