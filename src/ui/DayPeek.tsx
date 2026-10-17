import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useFiltered } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats } from '@/core/stats';
import { dayKey } from '@/core/time';
import { pct, timeHM, tone, useMoney } from '@/lib/format';
import { ChartTip, useAxisW, useColors } from './charts';
import { Icon } from './Icon';
import { CountUp, cx, lockScroll, spring, useIsMobile } from './kit';
import { TradeList } from './TradeList';

/**
 * Press-and-hold: fires after `ms` unless the finger moves (a scroll) or lifts first.
 * Returns pointer handlers plus `consumed()`, true once if the press became a hold — so the
 * click that follows a hold doesn't also navigate.
 */
export function useLongPress(ms = 420) {
  const timer = useRef<number>();
  const start = useRef<{ x: number; y: number } | null>(null);
  const fired = useRef(false);
  const clear = () => { window.clearTimeout(timer.current); start.current = null; };
  return {
    bind: (onHold: () => void) => ({
      onPointerDown: (e: React.PointerEvent) => {
        fired.current = false;
        start.current = { x: e.clientX, y: e.clientY };
        timer.current = window.setTimeout(() => { fired.current = true; navigator.vibrate?.(12); onHold(); }, ms);
      },
      onPointerMove: (e: React.PointerEvent) => { if (start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 8) clear(); },
      onPointerUp: clear, onPointerCancel: clear, onPointerLeave: clear,
      onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    }),
    consumed: () => { const f = fired.current; fired.current = false; return f; },
  };
}

/**
 * The day review textarea. Autosaves after a pause and flushes any pending text on unmount,
 * so collapsing a card or closing the peek never drops the last keystrokes.
 */
export function DayNote({ day, rows = 3, autoFocus = false }: { day: string; rows?: number; autoFocus?: boolean }) {
  const stored = useStore(s => s.dayNotes[day]);
  const save = useStore(s => s.saveDayNote);
  const [text, setText] = useState(stored ?? '');
  const [dirty, setDirty] = useState(false);
  const pending = useRef<{ day: string; text: string } | null>(null);
  useEffect(() => { setText(useStore.getState().dayNotes[day] ?? ''); setDirty(false); }, [day]);
  useEffect(() => {
    if (!dirty) return;
    pending.current = { day, text };
    const h = setTimeout(() => { save(day, text); pending.current = null; setDirty(false); }, 700);
    return () => clearTimeout(h);
  }, [text, dirty, day, save]);
  // Flush on unmount (or day change): the debounce above is cancelled by its cleanup.
  useEffect(() => () => { const p = pending.current; if (p) { save(p.day, p.text); pending.current = null; } }, [day, save]);
  const id = `dn-${day}`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium text-ink2">Day review</label>
        <span className="text-xs text-ink3" aria-live="polite">{dirty ? 'Saving…' : text ? 'Saved' : ''}</span>
      </div>
      <textarea id={id} rows={rows} value={text} autoFocus={autoFocus} onChange={e => { setText(e.target.value); setDirty(true); }} placeholder="What went well, what to fix tomorrow…" className="w-full mt-1.5 p-3 text-sm leading-relaxed resize-y" />
    </div>
  );
}

/** Day detail popup: headline, intraday equity line, stats and the day's trades. */
// Where the last tap/click happened, so the day preview can grow out of the cell that opened it (Apple-style zoom from source).
let lastTap = { x: 0, y: 0, t: 0 };
if (typeof window !== 'undefined') window.addEventListener('pointerdown', e => { lastTap = { x: e.clientX, y: e.clientY, t: Date.now() }; }, { capture: true, passive: true });
function fromTap() {
  if (Date.now() - lastTap.t > 1500) return { x: 0, y: 30 };
  // phones: the sheet sits at the bottom (~60% tall), so its centre is lower than the screen's
  const cy = window.innerWidth < 768 ? window.innerHeight * 0.7 : window.innerHeight / 2;
  return { x: lastTap.x - window.innerWidth / 2, y: lastTap.y - cy };
}

export function DayPeek({ day, onClose }: { day: string | null; onClose: () => void }) {
  const origin = useRef({ x: 0, y: 30 });
  const openedFor = useRef<string | null>(null);
  if (day && openedFor.current !== day) { origin.current = fromTap(); }
  openedFor.current = day;
  const mobile = useIsMobile();
  const panel = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const open = !!day;
  // Focus moves into the dialog, Tab stays inside it, and focus returns to the opener on close.
  useEffect(() => {
    if (!open) return;
    const back = document.activeElement as HTMLElement | null;
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 30);
    return () => { window.clearTimeout(t); back?.focus?.(); };
  }, [open]);
  useEffect(() => {
    if (!day) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key !== 'Tab' || !panel.current) return;
      const f = [...panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', k);
    const unlock = lockScroll();
    return () => { window.removeEventListener('keydown', k); unlock(); };
  }, [day, onClose]);
  return createPortal(
    <MotionConfig reducedMotion="user">
    <AnimatePresence>
      {day && (
        <div className="fixed inset-0 z-[80] flex items-end md:items-center justify-center md:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <motion.div className="absolute inset-0 bg-black/55 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.18 } }} onClick={onClose} />
          <motion.div ref={panel}
            className="relative w-full md:max-w-[560px] max-h-sheet md:max-h-[86vh] flex flex-col glass-pop rounded-t-3xl md:rounded-3xl overflow-hidden luxe-border"
            initial={{ opacity: 0, scale: 0.08, ...origin.current }} animate={{ opacity: 1, scale: 1, x: 0, y: 0 }} exit={mobile ? { y: '100%', transition: { duration: 0.22, ease: [0.23, 1, 0.32, 1] } } : { opacity: 0, scale: 0.08, ...origin.current, transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }}
            transition={spring}
            drag={mobile ? 'y' : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 500 || (i.offset.y > 40 && i.velocity.y > 250)) onClose(); }}>
            {mobile && <div className="pt-2.5 pb-1 grid place-items-center"><span className="w-10 h-1.5 rounded-full bg-line2" /></div>}
            <Body day={day} onClose={onClose} titleId={titleId} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </MotionConfig>,
    document.body,
  );
}

function Body({ day, onClose, titleId }: { day: string; onClose: () => void; titleId: string }) {
  const fmt = useMoney();
  const c = useColors();
  const yw = useAxisW();
  const all = useFiltered();
  const trades = useMemo(() => all.filter(t => dayKey(t.close) === day).sort((a, b) => a.close.getTime() - b.close.getTime()), [all, day]);
  const s = useMemo(() => computeStats(trades), [trades]);
  const curve = useMemo(() => {
    if (!trades.length) return [];
    let cum = 0;
    // Start at the first entry, but never before midnight: a trade held for days shouldn't stretch the axis.
    const first = Math.max(new Date(day + 'T00:00').getTime(), Math.min(...trades.map(t => t.open.getTime())));
    return [{ t: Math.min(first, trades[0].close.getTime() - 60_000), cum: 0, sym: 'Start' }, ...trades.map(t => ({ t: t.close.getTime(), cum: (cum += t.net), sym: t.sym }))];
  }, [trades, day]);
  const up = s.net >= 0;
  const col = up ? c.profit : c.loss;
  const date = new Date(day + 'T00:00');
  const best = trades.length ? Math.max(...trades.map(t => t.net)) : null, worst = trades.length ? Math.min(...trades.map(t => t.net)) : null;

  return (
    <>
      <div className="px-5 pt-3 md:pt-5 pb-4 flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[12px] text-ink3">{date.toLocaleDateString(undefined, { weekday: 'long' })}</div>
          <h2 id={titleId} className="text-lg font-semibold tracking-tight">{date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</h2>
        </div>
        <button data-autofocus className="btn-ghost w-9 h-9 px-0 -mr-2" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
      </div>
      <div className="overflow-y-auto overscroll-contain px-5 pb-safe md:pb-5">
        <div className="flex items-end justify-between gap-3">
          <CountUp value={s.net} format={v => fmt(v, { signed: true })} className={cx('num text-[40px] leading-none font-semibold tracking-tight', tone(s.net))} />
          <span className={cx('text-xs font-semibold px-2.5 py-1 rounded-full', up ? 'bg-profit/15 text-profit' : 'bg-loss/15 text-loss')}>{up ? 'Green day' : 'Red day'}</span>
        </div>

        {curve.length > 1 && (
          <motion.div className="mt-4 -mx-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={curve} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
                <defs><linearGradient id="peekFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity={0.32} /><stop offset="100%" stopColor={col} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke={c.line} vertical={false} />
                <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => timeHM(new Date(v))} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={30} />
                <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Inter, system-ui, sans-serif' }} axisLine={false} tickLine={false} width={yw} />
                <ReferenceLine y={0} stroke={c.line2} strokeDasharray="3 4" />
                <Tooltip content={<ChartTip fmt={v => fmt(v, { signed: true })} labelFmt={l => timeHM(new Date(l as number))} />} cursor={{ stroke: c.line2 }} />
                <Area type="stepAfter" dataKey="cum" name="Running P&L" stroke={col} strokeWidth={2.4} fill="url(#peekFill)" animationDuration={1100} dot={{ r: 2.5, fill: col, strokeWidth: 0 }} activeDot={{ r: 5, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        <div className="grid grid-cols-3 gap-2 mt-4">
          {([
            ['Trades', `${s.total}`, `${s.wins}W · ${s.losses}L`],
            ['Win rate', pct(s.winRate, 0), s.profitFactor != null ? `PF ${s.profitFactor.toFixed(2)}` : 'No losses'],
            ['Lots', s.volume.toFixed(2), s.avgR != null ? `Avg ${s.avgR.toFixed(2)}R` : ''],
            ['Best trade', fmt(best, { signed: true }), ''],
            ['Worst trade', fmt(worst, { signed: true }), ''],
            ['Fees', fmt(trades.reduce((a, t) => a + t.commission + t.swap, 0), { signed: true }), 'Commission + swap'],
          ] as [string, string, string][]).map(([k, v, sub], i) => (
            <motion.div key={k} initial={{ opacity: 0, transform: 'translateY(8px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ delay: 0.1 + i * 0.03, duration: 0.25, ease: [0.23, 1, 0.32, 1] }} className="rounded-xl bg-raised/70 border border-line px-3 py-2.5 min-w-0">
              <div className="label truncate">{k}</div>
              <div className={cx('num text-[14px] font-semibold mt-0.5 truncate', k === 'Best trade' ? 'text-profit' : k === 'Worst trade' ? 'text-loss' : '')}>{v}</div>
              {sub && <div className="text-[10.5px] text-ink3 truncate">{sub}</div>}
            </motion.div>
          ))}
        </div>

        <div className="mt-4"><DayNote day={day} rows={3} /></div>

        <div className="mt-4"><div className="label mb-1">Trades</div><TradeList trades={trades} time="range" /></div>
        <Link to={`/journal?day=${day}`} onClick={onClose} className="btn-primary w-full h-11 mt-4 mb-1"><Icon name="journal" size={15} />Open in journal</Link>
      </div>
    </>
  );
}
