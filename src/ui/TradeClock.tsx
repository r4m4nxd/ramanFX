// The trading clock: a live 24-hour dial (Calgary time) of how busy each half-hour is, for one symbol or the whole
// forex market. Outer bars = activity, rim arcs with numbers = the best times, inner arcs = the four forex sessions,
// the hand = now. Logic: core/tradeClock.
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { fmtX, MH_SLOTS, nyOf, slotLabel } from '@/core/marketHours';
import { clockNow, CLOCK_TZ, nyAheadMin, fmt12, fmtDur, inWindow, LEVEL_HINT, LEVEL_LABEL, levelOf, minutesOf, sessions, zoneTime, type ClockData, type Level, type Session } from '@/core/tradeClock';

const C = 200, R_BAR0 = 104, R_BAR1 = 168, R_RIM = 174, R_NUM = 190;
const FILL: Record<Level, string> = { peak: 'fill-loss', busy: 'fill-warn', normal: 'fill-profit', quiet: 'fill-ink3', closed: 'fill-line' };
const DOT: Record<Level, string> = { peak: 'bg-loss', busy: 'bg-warn', normal: 'bg-profit', quiet: 'bg-ink3', closed: 'bg-line' };
const TEXT: Record<Level, string> = { peak: 'text-loss', busy: 'text-warn', normal: 'text-profit', quiet: 'text-ink2', closed: 'text-ink3' };
const SESSION_STROKE: Record<string, string> = { sydney: 'stroke-cyan', tokyo: 'stroke-violet', london: 'stroke-profit', newyork: 'stroke-ink' };
const SESSION_DOT: Record<string, string> = { sydney: 'bg-cyan', tokyo: 'bg-violet', london: 'bg-profit', newyork: 'bg-ink' };

const DAY_FULL: Record<string, string> = { Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday' };
const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
const pt = (r: number, deg: number) => [C + r * Math.cos(rad(deg)), C + r * Math.sin(rad(deg))] as const;
const f = (n: number) => n.toFixed(2);
/** A ring slice between two angles (degrees, 0 = top, clockwise) and two radii. */
function wedge(r0: number, r1: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r1, a0), [x1, y1] = pt(r1, a1), [x2, y2] = pt(r0, a1), [x3, y3] = pt(r0, a0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M${f(x0)} ${f(y0)}A${r1} ${r1} 0 ${big} 1 ${f(x1)} ${f(y1)}L${f(x2)} ${f(y2)}A${r0} ${r0} 0 ${big} 0 ${f(x3)} ${f(y3)}Z`;
}
function arc(r: number, a0: number, a1: number): string {
  const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1);
  return `M${f(x0)} ${f(y0)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${f(x1)} ${f(y1)}`;
}
const STEP = 360 / MH_SLOTS;
const slotSpan = (from: number, to: number) => ((to - from + MH_SLOTS) % MH_SLOTS) || MH_SLOTS;

/** The current time, once a second (paused while the tab is hidden). */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    let id = 0;
    const start = () => { stop(); setNow(new Date()); id = window.setInterval(() => setNow(new Date()), 1000); };
    const stop = () => { if (id) { window.clearInterval(id); id = 0; } };
    const vis = () => (document.hidden ? stop() : start());
    start();
    document.addEventListener('visibilitychange', vis);
    return () => { stop(); document.removeEventListener('visibilitychange', vis); };
  }, []);
  return now;
}

const HOURS = [0, 3, 6, 9, 12, 15, 18, 21];
const hourLabel = (h: number) => (h === 0 ? '12a' : h === 12 ? '12p' : h < 12 ? `${h}a` : `${h - 12}p`);

export function ClockDial({ data, now, className }: { data: ClockData; now: Date; className?: string }) {
  const [sel, setSel] = useState<number | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => setSel(null), [data.key]);
  const pick = (i: number | null, hold = false) => {
    window.clearTimeout(timer.current);
    setSel(i);
    if (i != null && hold) timer.current = window.setTimeout(() => setSel(null), 6000);
  };

  const t = zoneTime(now);
  const ahead = nyAheadMin(now);
  const state = clockNow(data, now);
  const max = useMemo(() => Math.max(2, ...data.profile.map(v => v ?? 0)), [data]);
  const sess = useMemo(() => (data.roundTheClock ? sessions(now) : []), [data.roundTheClock, t.weekday, t.h]);   // eslint-disable-line react-hooks/exhaustive-deps

  const bars = useMemo(() => data.profile.map((v, i) => {
    const lv = levelOf(v);
    const r1 = lv === 'closed' ? R_BAR0 + 3 : R_BAR0 + 6 + (R_BAR1 - R_BAR0 - 6) * Math.min(1, (v ?? 0) / max);
    return { i, lv, d: wedge(R_BAR0, r1, i * STEP + 0.7, (i + 1) * STEP - 0.7), hit: wedge(R_BAR0 - 22, R_NUM, i * STEP, (i + 1) * STEP) };
  }), [data, max]);

  const handDeg = (minutesOf(t) / 1440) * 360;
  const shown = sel ?? state.slot;
  const shownV = sel != null ? data.profile[sel] : state.activity;
  const shownLv = sel != null ? levelOf(shownV) : state.level;
  const clock = `${t.h % 12 || 12}:${String(t.m).padStart(2, '0')}`;

  return (
    <svg viewBox="0 0 400 400" className={cx('block w-full h-auto select-none touch-manipulation', className)} role="img"
      aria-label={`${data.title} trading clock, Calgary time. ${state.headline}. ${state.detail}.`}
      onPointerLeave={e => { if (e.pointerType === 'mouse') pick(null); }}>
      {/* track */}
      <circle cx={C} cy={C} r={(R_BAR0 + R_BAR1) / 2} fill="none" className="stroke-line" strokeOpacity={0.45} strokeWidth={R_BAR1 - R_BAR0} />
      {/* hour ticks + labels */}
      {Array.from({ length: 24 }, (_, h) => {
        const [x0, y0] = pt(R_RIM + 3, h * 15), [x1, y1] = pt(R_RIM + (h % 3 ? 6 : 9), h * 15);
        return <line key={h} x1={x0} y1={y0} x2={x1} y2={y1} className="stroke-ink3" strokeOpacity={h % 3 ? 0.4 : 0.9} strokeWidth={h % 3 ? 1 : 1.5} strokeLinecap="round" />;
      })}
      {HOURS.map(h => { const [x, y] = pt(R_NUM + 2, h * 15); return <text key={h} x={x} y={y} textAnchor="middle" dominantBaseline="central" className="fill-ink3 num" fontSize={11.5} fontWeight={600}>{hourLabel(h)}</text>; })}

      {/* activity bars */}
      <g>
        {bars.map(b => (
          <path key={b.i} d={b.d} className={cx(FILL[b.lv], 'clock-wedge', b.i === state.slot && !state.closed && sel == null && 'clock-live')}
            style={{ animationDelay: `${b.i * 14}ms` }}
            opacity={b.lv === 'quiet' ? 0.5 : b.lv === 'closed' ? 0.8 : sel != null && sel !== b.i ? 0.55 : 0.95} />
        ))}
      </g>

      {/* the best times: rim arcs with their rank */}
      {data.windows.map(w => {
        const a0 = w.from * STEP + 0.8, a1 = (w.from + slotSpan(w.from, w.to)) * STEP - 0.8;
        const on = state.inside === w;
        const [bx, by] = pt(R_RIM, (a0 + a1) / 2);
        return (
          <g key={w.rank}>
            <path d={arc(R_RIM, a0, a1)} fill="none" className={cx('stroke-accent', on && 'clock-live')} strokeWidth={on ? 4.5 : 3} strokeLinecap="round" />
            <circle cx={bx} cy={by} r={8.5} className="fill-accent" />
            <text x={bx} y={by} textAnchor="middle" dominantBaseline="central" className="fill-on-accent num" fontSize={10.5} fontWeight={700}>{w.rank}</text>
          </g>
        );
      })}

      {/* forex sessions */}
      {sess.map((s, k) => {
        const r = R_BAR0 - 7 - k * 4.6;
        const open = inWindow(s, state.slot) && !state.closed;
        return <path key={s.id} d={arc(r, s.from * STEP, (s.from + slotSpan(s.from, s.to)) * STEP)} fill="none" className={SESSION_STROKE[s.id]} strokeWidth={3} strokeLinecap="round" opacity={open ? 1 : 0.32} />;
      })}

      {/* touch targets */}
      {bars.map(b => (
        <path key={b.i} d={b.hit} fill="transparent" onPointerEnter={e => { if (e.pointerType === 'mouse') pick(b.i); }} onClick={() => pick(sel === b.i ? null : b.i, true)}>
          <title>{`${fmt12(b.i)} Calgary (${fmt12(nyOf(slotLabel(b.i), ahead))} New York): ${LEVEL_LABEL[b.lv]}${b.lv === 'closed' ? '' : `, ${fmtX(data.profile[b.i])} typical`}`}</title>
        </path>
      ))}

      {/* the hand: now */}
      <g className="clock-hand pointer-events-none" style={{ transform: `rotate(${handDeg.toFixed(3)}deg)`, transformOrigin: `${C}px ${C}px` }}>
        <line x1={C} y1={C - 78} x2={C} y2={C - R_RIM + 2} className="stroke-ink" strokeWidth={2} strokeLinecap="round" />
        <circle cx={C} cy={C - R_RIM + 2} r={4} className="fill-ink" />
        <circle cx={C} cy={C - R_RIM + 2} r={4} className="fill-ink clock-ping" style={{ transformOrigin: `${C}px ${C - R_RIM + 2}px` }} />
      </g>
      {/* one lap a minute: the clock is alive */}
      <g className="clock-sweep pointer-events-none" style={{ transformOrigin: `${C}px ${C}px`, animationDelay: `-${t.s}s` }} key={t.m}>
        <circle cx={C} cy={C - 72} r={2.2} className="fill-accent" />
      </g>

      {/* centre */}
      <circle cx={C} cy={C} r={66} className="fill-surface stroke-line" strokeWidth={1} />
      <g className="pointer-events-none" textAnchor="middle">
        {sel == null ? <>
          <text x={C} y={C - 24} className="fill-ink3" fontSize={9.5} fontWeight={600} letterSpacing={1.2}>{state.dayName.toUpperCase()} · CALGARY</text>
          <text x={C} y={C + 6} className="fill-ink num" fontSize={31} fontWeight={700}>{clock}<tspan fontSize={12} dx={3} className="fill-ink3">{t.h < 12 ? 'AM' : 'PM'}</tspan></text>
        </> : <>
          <text x={C} y={C - 24} className="fill-ink3" fontSize={9.5} fontWeight={600} letterSpacing={1.2}>{fmt12(nyOf(slotLabel(shown), ahead)).toUpperCase()} NEW YORK</text>
          <text x={C} y={C + 6} className="fill-ink num" fontSize={26} fontWeight={700}>{fmt12(shown)}</text>
        </>}
        <text x={C} y={C + 26} className={cx(TEXT[shownLv].replace('text-', 'fill-'))} fontSize={12} fontWeight={700}>{sel == null && state.closed ? state.headline : LEVEL_LABEL[shownLv]}</text>
        <text x={C} y={C + 42} className="fill-ink3 num" fontSize={10.5}>{shownLv === 'closed' ? '' : `${fmtX(shownV)} typical`}</text>
      </g>
    </svg>
  );
}

function Legend({ sess, slot, closed }: { sess: Session[]; slot: number; closed: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11.5px] text-ink2">
      {(['peak', 'busy', 'normal', 'quiet'] as Level[]).map(l => <span key={l} className="inline-flex items-center gap-1.5"><i className={cx('w-2.5 h-2.5 rounded-sm', DOT[l], l === 'quiet' && 'opacity-50')} />{LEVEL_LABEL[l]}</span>)}
      <span className="inline-flex items-center gap-1.5"><i className="w-4 h-4 rounded-full bg-accent text-on-accent text-[9px] font-bold grid place-items-center not-italic">1</i>Best times</span>
      {sess.map(s => { const open = inWindow(s, slot) && !closed; return <span key={s.id} className={cx('inline-flex items-center gap-1.5', !open && 'text-ink3')}><i className={cx('w-3 h-1 rounded-full', SESSION_DOT[s.id], !open && 'opacity-40')} />{s.label}{open && <b className="text-profit font-semibold">open</b>}</span>; })}
    </div>
  );
}

/** The dial with its "now / next" read-out and the best times of the day. */
export function TradeClock({ data, now, big }: { data: ClockData; now: Date; big?: boolean }) {
  const state = clockNow(data, now);
  const ahead = nyAheadMin(now);
  const sess = useMemo(() => (data.roundTheClock ? sessions(now) : []), [data.roundTheClock, state.dayName, Math.floor(now.getTime() / 3600_000)]);   // eslint-disable-line react-hooks/exhaustive-deps
  const until = (slot: number) => { const t = zoneTime(now); return (((slot * 30 - minutesOf(t)) % 1440) + 1440) % 1440; };
  return (
    <div className={cx('grid gap-5 items-center', big ? 'lg:grid-cols-[minmax(0,1fr)_340px]' : 'md:grid-cols-[minmax(0,360px)_minmax(0,1fr)]')}>
      <div className={cx('mx-auto w-full', big ? 'clock-big' : 'max-w-[360px]')}>
        <ClockDial data={data} now={now} />
      </div>
      <div className="min-w-0 flex flex-col gap-3.5">
        <div aria-live="polite">
          <div className="text-[11px] uppercase tracking-wide text-ink3 font-medium">{data.title}{data.sub ? ` · ${data.sub}` : ''}</div>
          <div className={cx('font-semibold tracking-tight mt-0.5', big ? 'text-[26px]' : 'text-[20px]', state.inside ? 'text-accent' : TEXT[state.level])}>{state.headline}</div>
          <div className="text-[13.5px] text-ink2 mt-0.5">{state.detail}</div>
          {!state.closed && <div className="text-[12px] text-ink3 mt-1">{LEVEL_HINT[state.level]}{state.activity != null ? ` (${fmtX(state.activity)} typical)` : ''}.</div>}
        </div>
        {!!data.windows.length && (
          <ul className="flex flex-col">
            {data.windows.map(w => {
              const on = state.inside === w;
              return (
                <li key={w.rank} className={cx('grid grid-cols-[22px_minmax(0,1fr)_auto] items-center gap-2.5 py-2 border-t border-line first:border-t-0', on && 'text-accent')}>
                  <span className="w-[22px] h-[22px] rounded-full bg-accent text-on-accent text-[11px] font-bold grid place-items-center num">{w.rank}</span>
                  <span className="min-w-0">
                    <span className="num text-[13.5px] font-semibold text-ink">{fmt12(w.from)} – {fmt12(w.to)}</span>
                    <span className="block text-[11.5px] text-ink3 num">{fmt12(nyOf(slotLabel(w.from), ahead))} New York · {fmtX(w.activity)} typical</span>
                  </span>
                  <span className={cx('num text-[12px] text-right', on ? 'text-accent font-semibold' : 'text-ink2')}>{state.closed && data.roundTheClock && state.headline === 'Market closed' ? '–' : on ? `now · ${fmtDur(state.insideLeftMin)} left` : `in ${fmtDur(until(w.from))}`}</span>
                </li>
              );
            })}
          </ul>
        )}
        {state.dayFactor != null && <div className="text-[12px] text-ink3">{DAY_FULL[state.dayName] ?? state.dayName}s run <b className="text-ink2 num">{fmtX(state.dayFactor)}</b> a normal day for this market.</div>}
        <Legend sess={sess} slot={state.slot} closed={state.closed} />
      </div>
    </div>
  );
}

/** Keeps the screen awake while mounted (where the browser allows it). */
function useWakeLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    type Lock = { release: () => Promise<void> };
    const wl = (navigator as Navigator & { wakeLock?: { request: (t: 'screen') => Promise<Lock> } }).wakeLock;
    if (!wl) return;
    let lock: Lock | null = null, live = true;
    const get = () => { wl.request('screen').then(l => { if (live) lock = l; else void l.release(); }).catch(() => {}); };
    const vis = () => { if (!document.hidden) get(); };
    get();
    document.addEventListener('visibilitychange', vis);
    return () => { live = false; document.removeEventListener('visibilitychange', vis); void lock?.release().catch(() => {}); };
  }, [on]);
}

/** Full-screen clock to leave open while trading: the screen stays awake, the page behind does not scroll. */
export function ClockStage({ data, now, onClose, children }: { data: ClockData; now: Date; onClose: () => void; children?: React.ReactNode }) {
  useWakeLock(true);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', key);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', key); };
  }, [onClose]);
  return createPortal(
    <div role="dialog" aria-modal="true" aria-label="Trading clock" className="fixed inset-0 z-[300] bg-bg overflow-y-auto pt-safe px-safe pb-safe">
      <div className="min-h-full flex flex-col gap-4 p-4 md:p-6 max-w-[1200px] mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1 overflow-x-auto">{children}</div>
          <button type="button" onClick={onClose} aria-label="Close the clock" className="shrink-0 w-11 h-11 rounded-full border border-line grid place-items-center text-ink2 hover:bg-raised"><Icon name="x" size={18} /></button>
        </div>
        <div className="flex-1 grid items-center"><TradeClock data={data} now={now} big /></div>
        <p className="text-[11px] text-ink3 text-center">Times are Calgary ({CLOCK_TZ.split('/')[1]}). The screen stays on while this is open. It shows when the market moves, not which way.</p>
      </div>
    </div>,
    document.body,
  );
}
