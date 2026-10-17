import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState, type ReactNode } from 'react';
import type { MoveAway, Reason, Verdict } from '@/core/strategy';
import { Icon } from './Icon';
import { CountUp, cx, ease, spring } from './kit';

/** Big tappable option card used throughout the planner. */
export function Choice({ on, onClick, title, sub, children, tone = 'accent' }: { on: boolean; onClick: () => void; title: ReactNode; sub?: ReactNode; children?: ReactNode; tone?: 'accent' | 'profit' | 'loss' | 'warn' }) {
  const ring = { accent: 'border-accent bg-accent/10 ring-1 ring-inset ring-accent', profit: 'border-profit bg-profit/10 ring-1 ring-inset ring-profit', loss: 'border-loss bg-loss/10 ring-1 ring-inset ring-loss', warn: 'border-warn bg-warn/10 ring-1 ring-inset ring-warn' }[tone];
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={cx('press relative text-left rounded-xl border p-3 transition-[color,background-color,border-color,box-shadow] duration-150 min-h-[56px] [-webkit-tap-highlight-color:transparent]', on ? ring : 'border-line bg-raised/40 hover:border-line2')}>
      {children}
      <div className="text-[13.5px] font-semibold leading-tight">{title}</div>
      {sub && <div className="text-[11.5px] text-ink3 mt-0.5 leading-snug">{sub}</div>}
      {on && <motion.span initial={{ opacity: 0, transform: 'scale(0.5)' }} animate={{ opacity: 1, transform: 'scale(1)' }} transition={spring} className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent text-on-accent grid place-items-center"><Icon name="check" size={12} strokeWidth={3} /></motion.span>}
    </button>
  );
}

export function YesNo({ value, onChange, yes = 'Yes', no = 'No', good = true }: { value: boolean; onChange: (v: boolean) => void; yes?: string; no?: string; good?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Choice on={value} onClick={() => onChange(true)} title={yes} tone={good ? 'profit' : 'loss'} />
      <Choice on={!value} onClick={() => onChange(false)} title={no} tone={good ? 'loss' : 'profit'} />
    </div>
  );
}

export function Question({ q, hint, children }: { q: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div>
        <div className="text-[14.5px] font-semibold">{q}</div>
        {hint && <div className="text-[12px] text-ink3 mt-0.5 leading-relaxed">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

/** Mini candle drawings of each move-away grade, as in the S&D course. */
export function MoveAwayArt({ grade, side }: { grade: MoveAway; side: 'buy' | 'sell' }) {
  const up = side === 'buy';
  // [open, close, high, low] in a 0..60 space, y grows downward; base first then the move.
  const base: number[][] = [[44, 46, 42, 49], [46, 44, 42, 48]];
  const moves: Record<MoveAway, number[][]> = {
    poor: [[44, 40, 37, 47], [40, 42, 36, 45], [42, 37, 34, 44], [37, 35, 31, 40], [35, 31, 28, 38]],
    decent: [[44, 36, 33, 46], [36, 28, 24, 38], [28, 22, 19, 30]],
    aplus: [[44, 22, 21, 45], [22, 9, 8, 23]],
    gap: [[30, 14, 13, 31], [14, 6, 5, 15]],
  };
  const all = [...base, ...moves[grade]];
  const flip = (y: number) => (up ? y : 60 - y);
  return (
    <svg viewBox="0 0 64 60" className="w-full h-12 mb-1.5" aria-hidden="true">
      {grade === 'gap' && <line x1="16" x2="64" y1={flip(42)} y2={flip(42)} stroke="rgb(var(--ink3))" strokeDasharray="2 2" strokeWidth="0.6" />}
      {all.map(([o, c, h, l], i) => {
        const x = 4 + i * 8.5, bull = c < o, top = Math.min(flip(o), flip(c)), bot = Math.max(flip(o), flip(c));
        const col = i < base.length ? 'rgb(var(--ink3))' : (bull === up ? 'rgb(var(--profit))' : 'rgb(var(--loss))');
        return (
          <motion.g key={i} initial={{ opacity: 0, transform: `translateY(${up ? 6 : -6}px)` }} animate={{ opacity: 1, transform: 'translateY(0px)' }} transition={{ delay: i * 0.05, duration: 0.3, ease }}>
            <line x1={x + 2.5} x2={x + 2.5} y1={Math.min(flip(h), flip(l))} y2={Math.max(flip(h), flip(l))} stroke={col} strokeWidth="0.8" />
            <rect x={x} y={top} width="5" height={Math.max(1, bot - top)} rx="0.6" fill={col} />
          </motion.g>
        );
      })}
    </svg>
  );
}

/**
 * The curve: HTF supply on top, HTF demand at the bottom, 50% mark in the middle.
 * Drag (or tap) to place the ETF zone; the half that counts as high odds for your direction glows.
 */
export function CurveSlider({ value, onChange, side }: { value: number; onChange: (v: number) => void; side: 'buy' | 'sell' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState(false);
  const set = (clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    onChange(Math.round(Math.max(0, Math.min(100, ((r.bottom - clientY) / r.height) * 100))));
  };
  const good = side === 'buy' ? value <= 50 : value >= 50;
  return (
    <div className="flex gap-4 items-stretch">
      <div ref={ref} role="slider" aria-label="Position in the curve" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} tabIndex={0}
        onKeyDown={e => { if (e.key === 'ArrowUp') onChange(Math.min(100, value + 5)); if (e.key === 'ArrowDown') onChange(Math.max(0, value - 5)); }}
        onPointerDown={e => { (e.target as Element).setPointerCapture?.(e.pointerId); setDrag(true); set(e.clientY); }}
        onPointerMove={e => { if (drag) set(e.clientY); }} onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}
        className="relative w-[120px] sm:w-[150px] h-[240px] rounded-2xl overflow-hidden border border-line touch-none cursor-ns-resize select-none shrink-0">
        <div className="absolute inset-x-0 top-0 h-[16%] bg-loss/80 grid place-items-center text-[10px] font-bold text-white tracking-wide">HTF SUPPLY</div>
        <div className="absolute inset-x-0 top-[16%] bottom-[50%] bg-loss/20" />
        <div className="absolute inset-x-0 top-[50%] bottom-[16%] bg-profit/20" />
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-profit/80 grid place-items-center text-[10px] font-bold text-white tracking-wide">HTF DEMAND</div>
        <motion.div className="absolute inset-x-0 pointer-events-none" initial={false}
          animate={{ top: side === 'buy' ? '50%' : '16%', bottom: side === 'buy' ? '16%' : '50%', opacity: 1 }}
          style={{ boxShadow: 'inset 0 0 0 2px rgb(var(--accent) / 0.55)', background: 'rgb(var(--accent) / 0.08)' }} />
        <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-ink/60" />
        <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-semibold bg-surface/90 rounded px-1">50%</span>
        <motion.div className="absolute left-2 right-2 h-3.5 -mb-[7px] rounded-md shadow-pop pointer-events-none"
          // Transform, not `bottom`: dragging moves a composited layer instead of re-laying out the slider every frame (240px track, 68% travel).
          style={{ bottom: '16%', background: side === 'buy' ? 'rgb(var(--profit))' : 'rgb(var(--loss))' }}
          animate={{ transform: `translateY(${-value * 1.632}px) scale(${drag ? 1.08 : 1})` }} transition={spring} />
      </div>
      <div className="flex flex-col justify-center gap-2 text-[12.5px] leading-relaxed">
        <div className={cx('num text-3xl font-semibold', good ? 'text-profit' : 'text-warn')}>{value}%</div>
        <div className="text-ink2">{side === 'buy' ? 'Demand' : 'Supply'} wants to be <b>{side === 'buy' ? 'below' : 'above'} the 50% mark</b>, close to your own HTF zone.</div>
        <div className={good ? 'text-profit' : 'text-warn'}>{good ? 'High-odds half of the curve.' : 'Wrong half — low odds unless it sits at your HTF zone.'}</div>
        <div className="text-[11.5px] text-ink3">Profit margin = distance to the opposing HTF zone.</div>
      </div>
    </div>
  );
}

function ScoreRing({ score, tone }: { score: number; tone: string }) {
  const R = 44, C = 2 * Math.PI * R;
  return (
    <div className="relative w-[108px] h-[108px] shrink-0">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="8" />
        <motion.circle cx="50" cy="50" r={R} fill="none" stroke={`rgb(var(--${tone}))`} strokeWidth="8" strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - score / 100) }} transition={{ duration: 0.9, ease }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center"><div><CountUp value={score} format={v => v.toFixed(0)} className="num text-[28px] font-semibold block leading-none" /><span className="text-[10px] text-ink3">quality</span></div></div>
    </div>
  );
}

export function ReasonList({ items, max }: { items: Reason[]; max?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="flex flex-col gap-1.5">
      {items.slice(0, max).map((r, i) => (
        <motion.li key={r.text} initial={{ opacity: 0, transform: 'translateX(-6px)' }} animate={{ opacity: 1, transform: 'translateX(0px)' }} transition={{ duration: 0.2, ease, delay: Math.min(i, 8) * 0.03 }}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full text-left flex gap-2.5 items-start rounded-lg px-2 py-1.5 -mx-2 hover:bg-raised/60">
            <span className={cx('mt-[3px] w-4 h-4 rounded-full grid place-items-center shrink-0', r.tone === 'good' ? 'bg-profit/20 text-profit' : r.tone === 'bad' ? 'bg-loss/20 text-loss' : 'bg-warn/20 text-warn')}>
              <Icon name={r.tone === 'good' ? 'check' : r.tone === 'bad' ? 'x' : 'alert'} size={10} strokeWidth={3} />
            </span>
            <span className="text-[13px] leading-snug flex-1">{r.text}
              <AnimatePresence>{open === i && <motion.span initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="block overflow-hidden text-[11.5px] text-ink3 italic mt-1">Rule: {r.rule}</motion.span>}</AnimatePresence>
            </span>
          </button>
        </motion.li>
      ))}
    </ul>
  );
}

/** The live verdict: NO TRADE / HIGH ODDS / LOW ODDS with the management it implies. */
export function VerdictPanel({ v, compact }: { v: Verdict; compact?: boolean }) {
  const tone = !v.tradeable ? 'loss' : v.odds === 'high' ? 'profit' : 'warn';
  const label = !v.tradeable ? 'NO TRADE' : v.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS';
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <ScoreRing score={v.score} tone={tone} />
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={label} initial={{ opacity: 0, transform: 'translateY(6px)', filter: 'blur(4px)' }} animate={{ opacity: 1, transform: 'translateY(0px)', filter: 'blur(0px)' }} exit={{ opacity: 0, transform: 'translateY(-6px)' }} transition={{ duration: 0.15, ease }}
              className={cx('text-[22px] font-bold tracking-tight', `text-${tone}`)}>{label}</motion.div>
          </AnimatePresence>
          <div className="text-[12.5px] text-ink2 mt-0.5">{!v.tradeable ? `${v.blockers.length} rule${v.blockers.length > 1 ? 's' : ''} say no. Skip it — opportunities are endless.` : v.mgmt.style === 'aggressive' ? 'Take it, but manage it aggressively.' : 'Let it run. Manage it patiently.'}</div>
          {v.rr != null && <div className="text-[12px] text-ink3 mt-1 num">Planned R:R {v.rr.toFixed(2)} · breakeven win rate {(100 / (1 + v.rr)).toFixed(0)}%</div>}
        </div>
      </div>
      {v.blockers.length > 0 && <div className="rounded-xl border border-loss/40 bg-loss/[0.07] p-3"><ReasonList items={v.blockers} /></div>}
      {v.tradeable && (
        <div className={cx('rounded-xl border p-3 grid grid-cols-2 gap-3', v.odds === 'high' ? 'border-profit/30 bg-profit/[0.06]' : 'border-warn/30 bg-warn/[0.06]')}>
          <div><div className="label">Max risk</div><div className="num text-lg font-semibold">{v.mgmt.maxRiskPct}%</div></div>
          <div><div className="label">Target</div><div className="num text-lg font-semibold">{v.mgmt.targetR === 1 ? '1:1' : '1:3+'}</div></div>
          <div className="col-span-2 text-[12.5px] text-ink2 leading-relaxed"><b className="text-ink">Take profit:</b> {v.mgmt.target}<br /><b className="text-ink">Breakeven:</b> {v.mgmt.breakeven}</div>
        </div>
      )}
      {!compact && <ReasonList items={v.reasons} />}
    </div>
  );
}
