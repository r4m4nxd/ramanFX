import { MotionConfig, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { dayKey } from '@/core/time';
import type { DayStat } from '@/core/stats';
import { monthName, pct, useMoney } from '@/lib/format';
import { Icon } from './Icon';
import { cx, ease, useIsMobile } from './kit';
import { useStore } from '@/data/store';
import { DayPeek, useLongPress } from './DayPeek';

/**
 * Month grid, Mon–Sun plus a weekly total column (weekends collapse when untraded).
 * Tap or click a traded day to open its peek (same as the year view); the peek links on to the journal.
 * `onDay` only marks days as interactive. Pass `onMonthChange` to keep the month in the URL.
 */
export function MonthCalendar({ days, onDay, compact = false, initial, onMonthChange }: { days: DayStat[]; onDay?: (date: string) => void; compact?: boolean; initial?: Date; onMonthChange?: (d: Date) => void }) {
  const fmt = useMoney();
  const privacy = useStore(st => st.privacy);
  const [peek, setPeek] = useState<string | null>(null);
  const hold = useLongPress();
  const last = days.length ? new Date(days[days.length - 1].date + 'T00:00') : new Date();
  const [cursor, setCursorState] = useState(() => { const d = initial ?? last; return new Date(d.getFullYear(), d.getMonth(), 1); });
  const setCursor = (d: Date) => { setCursorState(d); onMonthChange?.(d); };
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
  const monthTrades = monthDays.reduce((a, d) => a + d.trades, 0);
  const monthWins = monthDays.reduce((a, d) => a + d.wins, 0), monthLosses = monthDays.reduce((a, d) => a + d.losses, 0);
  const greenDays = monthDays.filter(d => d.pnl > 0).length;
  const maxAbs = Math.max(1, ...monthDays.map(d => Math.abs(d.pnl)));
  const today = dayKey(new Date());
  const heads = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].slice(0, cols);
  const mobile = useIsMobile();
  const small = compact || mobile;
  const weekRows = weeks.map((w, wi) => {
    const ws = w.map(d => map.get(dayKey(d))).filter((d, i) => d && w[i].getMonth() === m) as DayStat[];
    const inM = w.filter(d => d.getMonth() === m);
    return { wi, net: ws.reduce((a, d) => a + d.pnl, 0), n: ws.reduce((a, d) => a + d.trades, 0), from: inM[0], to: inM[inM.length - 1] };
  });
  // Phones: no currency symbol and no cents so every amount fits its square.
  const short = (n: number) => {
    if (privacy) return '•••';
    const a = Math.abs(n), sign = n < 0 ? '−' : '+';
    return sign + (a >= 10_000 ? `${Math.round(a / 1000)}k` : a >= 1000 ? `${(a / 1000).toFixed(1)}k` : Math.round(a).toString());
  };
  const amount = (n: number) => (small ? short(n) : fmt(n, { signed: true, compact: true }));

  return (
    <MotionConfig reducedMotion="user">
    <div>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-[15px]">{monthName(m)} {y}</div>
          <div className="text-xs text-ink3 mt-0.5 num flex flex-wrap gap-x-1.5"><span className={cx('font-semibold', monthNet >= 0 ? 'text-profit' : 'text-loss')}>{fmt(monthNet, { signed: true })}</span>
            <span>· {greenDays}/{monthDays.length} green {monthDays.length === 1 ? 'day' : 'days'}</span>
            {monthTrades > 0 && <span>· {monthTrades} trades · {pct(monthWins + monthLosses ? monthWins / (monthWins + monthLosses) : null, 0)} win</span>}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button className="btn w-9 touch:w-11 touch:h-11 px-0" aria-label="Previous month" onClick={() => setCursor(new Date(y, m - 1, 1))}><Icon name="chevronLeft" size={15} /></button>
          <button className="btn w-9 touch:w-11 touch:h-11 px-0" aria-label="Next month" onClick={() => setCursor(new Date(y, m + 1, 1))}><Icon name="chevronRight" size={15} /></button>
        </div>
      </div>
      <div className={cx('grid', small ? 'gap-1' : 'gap-1.5')} style={{ gridTemplateColumns: `repeat(${cols + (small ? 0 : 1)}, minmax(0, 1fr))` }}>
        {heads.map(h => <div key={h} className="label text-center pb-1 tracking-normal">{small ? h[0] : h}</div>)}
        {!small && <div className="label text-center pb-1">Week</div>}
        {weeks.map((w, wi) => [
          ...w.slice(0, cols).map((d) => {
            const k = dayKey(d), s = map.get(k), inMonth = d.getMonth() === m;
            // Capped tint so the coloured amount on top keeps AA contrast.
            const intensity = s ? 0.06 + 0.16 * Math.min(1, Math.abs(s.pnl) / maxAbs) : 0;
            const Cell = s && onDay && inMonth ? 'button' : 'div';
            return (
              <motion.div key={k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, ease, delay: wi * 0.03 }}>
                <Cell {...(Cell === 'button' ? { type: 'button' as const, ...hold.bind(() => setPeek(k)), onClick: () => { if (!hold.consumed()) setPeek(k); }, 'aria-haspopup': 'dialog' as const, 'aria-label': `${d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}, ${fmt(s!.pnl, { signed: true })}, ${s!.trades} ${s!.trades === 1 ? 'trade' : 'trades'}` } : {})}
                  className={cx('w-full overflow-hidden border text-left flex flex-col transition-transform', small ? 'rounded-md min-h-[50px] p-1 justify-between' : 'rounded-lg min-h-[78px] p-2 justify-between',
                    Cell === 'button' && 'hold-cell md:hover:scale-[1.04] md:hover:z-10 relative',
                    !inMonth ? 'invisible' : s ? (s.pnl >= 0 ? 'border-profit/35' : 'border-loss/40') : 'border-line/70 bg-bg/40', k === today && 'ring-2 ring-accent')}
                  style={s && inMonth ? { background: s.pnl >= 0 ? `rgb(var(--profit) / ${intensity})` : `rgb(var(--loss) / ${intensity})` } : undefined}>
                  <span className={cx('leading-none text-ink3', small ? 'text-[10px]' : 'text-[11px]')}>{d.getDate()}</span>
                  {s && inMonth && (<>
                    <span className={cx('num font-semibold leading-none whitespace-nowrap tracking-tight', small ? 'text-[10.5px] text-center' : 'text-[13px]', s.pnl >= 0 ? 'text-profit' : 'text-loss')}>{amount(s.pnl)}</span>
                    {small ? <span className="text-[10px] text-ink2 num text-center leading-none" aria-hidden="true">{s.trades}×</span>
                      : <span className="text-[10.5px] text-ink3 whitespace-nowrap">{s.trades} {s.trades === 1 ? 'trade' : 'trades'}</span>}
                  </>)}
                </Cell>
              </motion.div>
            );
          }),
          ...(small ? [] : [
            <div key={`w${wi}`} className="rounded-lg border border-line bg-raised flex flex-col justify-between min-h-[78px] p-2 overflow-hidden">
              <span className="text-[11px] text-ink3 leading-none whitespace-nowrap">{weekRows[wi].from ? `${weekRows[wi].from.getDate()}–${weekRows[wi].to.getDate()}` : ''}</span>
              {weekRows[wi].n > 0 && <span className={cx('num font-semibold text-[13px] leading-none whitespace-nowrap', weekRows[wi].net >= 0 ? 'text-profit' : 'text-loss')}>{amount(weekRows[wi].net)}</span>}
              {weekRows[wi].n > 0 && <span className="text-[10.5px] text-ink3 whitespace-nowrap">{weekRows[wi].n} trades</span>}
            </div>,
          ]),
        ])}
      </div>
      {small && (
        <ul className="mt-3 flex flex-col">
          {weekRows.filter(w => w.n > 0).map(w => (
            <li key={w.wi} className="flex items-center gap-3 py-2 border-t border-line text-[13px]">
              <span className="font-medium w-14">Week {w.wi + 1}</span>
              <span className="text-ink3 text-xs flex-1 truncate">{w.from && `${w.from.getDate()}–${w.to.getDate()} ${monthName(m).slice(0, 3)}`} · {w.n} {w.n === 1 ? 'trade' : 'trades'}</span>
              <span className={cx('num font-semibold', w.net >= 0 ? 'text-profit' : 'text-loss')}>{fmt(w.net, { signed: true })}</span>
            </li>
          ))}
        </ul>
      )}
      <DayPeek day={peek} onClose={() => setPeek(null)} />
    </div>
    </MotionConfig>
  );
}
