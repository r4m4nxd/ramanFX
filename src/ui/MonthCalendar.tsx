import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { dayKey } from '@/core/time';
import type { DayStat } from '@/core/stats';
import { monthName, useMoney } from '@/lib/format';
import { Icon } from './Icon';
import { cx, ease, useIsMobile } from './kit';
import { useStore } from '@/data/store';
import { DayPeek, useLongPress } from './DayPeek';

/** Month grid, Mon–Sun plus a weekly total column (weekends collapse when untraded). */
export function MonthCalendar({ days, onDay, compact = false, initial }: { days: DayStat[]; onDay?: (date: string) => void; compact?: boolean; initial?: Date }) {
  const fmt = useMoney();
  const privacy = useStore(st => st.privacy);
  const [peek, setPeek] = useState<string | null>(null);
  const hold = useLongPress();
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
    <div>
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="min-w-0">
          <div className="font-semibold text-[15px]">{monthName(m)} {y}</div>
          <div className="text-xs text-ink3 mt-0.5 num">{monthDays.length} trading {monthDays.length === 1 ? "day" : "days"} · <span className={monthNet >= 0 ? 'text-profit' : 'text-loss'}>{fmt(monthNet, { signed: true })}</span></div>
        </div>
        <div className="flex gap-1 shrink-0">
          <button className="btn w-9 px-0" aria-label="Previous month" onClick={() => setCursor(new Date(y, m - 1, 1))}><Icon name="chevronLeft" size={15} /></button>
          <button className="btn w-9 px-0" aria-label="Next month" onClick={() => setCursor(new Date(y, m + 1, 1))}><Icon name="chevronRight" size={15} /></button>
        </div>
      </div>
      <div className={cx('grid', small ? 'gap-1' : 'gap-1.5')} style={{ gridTemplateColumns: `repeat(${cols + (small ? 0 : 1)}, minmax(0, 1fr))` }}>
        {heads.map(h => <div key={h} className="label text-center pb-1 tracking-normal">{small ? h[0] : h}</div>)}
        {!small && <div className="label text-center pb-1">Week</div>}
        {weeks.map((w, wi) => [
          ...w.slice(0, cols).map((d, di) => {
            const k = dayKey(d), s = map.get(k), inMonth = d.getMonth() === m;
            const intensity = s ? 0.1 + 0.32 * Math.min(1, Math.abs(s.pnl) / maxAbs) : 0;
            const Cell = s && onDay && inMonth ? 'button' : 'div';
            return (
              <motion.div key={k} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease, delay: (wi * cols + di) * 0.008 }}>
                <Cell {...(Cell === 'button' ? { type: 'button' as const, ...hold.bind(() => setPeek(k)), onClick: () => { if (!hold.consumed()) onDay!(k); }, 'aria-label': `${k}: ${fmt(s!.pnl, { signed: true })}, ${s!.trades} trades` } : {})}
                  className={cx('w-full overflow-hidden border text-left flex flex-col transition-transform', small ? 'rounded-md min-h-[50px] p-1 justify-between' : 'rounded-lg min-h-[78px] p-2 justify-between',
                    Cell === 'button' && 'hold-cell md:hover:scale-[1.04] md:hover:z-10 relative',
                    !inMonth ? 'invisible' : s ? (s.pnl >= 0 ? 'border-profit/35' : 'border-loss/40') : 'border-line/70 bg-bg/40', k === today && 'ring-2 ring-accent')}
                  style={s && inMonth ? { background: s.pnl >= 0 ? `rgb(var(--profit) / ${intensity})` : `rgb(var(--loss) / ${intensity})` } : undefined}>
                  <span className={cx('leading-none text-ink3', small ? 'text-[10px]' : 'text-[11px]')}>{d.getDate()}</span>
                  {s && inMonth && (<>
                    <span className={cx('num font-semibold leading-none whitespace-nowrap tracking-tight', small ? 'text-[10.5px] text-center' : 'text-[13px]', s.pnl >= 0 ? 'text-profit' : 'text-loss')}>{amount(s.pnl)}</span>
                    {small ? <span className="flex justify-center gap-[2px] h-1">{Array.from({ length: Math.min(4, s.trades) }, (_, i) => <span key={i} className="w-1 h-1 rounded-full bg-ink3/70" />)}</span>
                      : <span className="text-[10.5px] text-ink3 whitespace-nowrap">{s.trades} {s.trades === 1 ? 'trade' : 'trades'}</span>}
                  </>)}
                </Cell>
              </motion.div>
            );
          }),
          ...(small ? [] : [
            <div key={`w${wi}`} className="rounded-lg border border-line bg-raised flex flex-col justify-between min-h-[78px] p-2 overflow-hidden">
              <span className="text-[11px] text-ink3 leading-none">W{wi + 1}</span>
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
  );
}
