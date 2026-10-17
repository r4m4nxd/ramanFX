import { animate, motion, useMotionValue, useReducedMotion, useTransform, useVelocity, useSpring } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, type IconName } from './Icon';
import { cx, softNavigate } from './kit';

type Tab = { to: string; label: string; icon: IconName; end?: boolean };

/**
 * Phone tab bar as floating Liquid Glass: a glass capsule of tabs plus a separate search orb.
 * The selection is one glass lens that springs to the chosen tab, stretching along its travel and settling
 * (velocity → scaleX/scaleY), and it can be dragged across the bar; release lands on the nearest tab.
 */
export function GlassTabBar({ tabs, active, onMore, moreActive, onSearch }: { tabs: Tab[]; active: number; onMore: () => void; moreActive: boolean; onSearch: () => void }) {
  const nav = useNavigate();
  const reduce = useReducedMotion();
  const bar = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLElement | null)[]>([]);
  const [w, setW] = useState(0);
  const x = useMotionValue(0);
  // Liquid stretch: the faster the lens travels, the longer and thinner it gets; springs smooth it back to round.
  const v = useVelocity(x);
  const stretch = useSpring(useTransform(v, s => Math.min(0.28, Math.abs(s) / 4200)), { stiffness: 500, damping: 40 });
  const sx = useTransform(stretch, s => 1 + s), sy = useTransform(stretch, s => 1 - s * 0.45);
  const [lift, setLift] = useState(false);
  const drag = useRef<{ id: number; x0: number; lx: number; moved: boolean } | null>(null);
  const count = tabs.length + 1;
  const sel = moreActive ? tabs.length : active;

  const left = (i: number) => { const el = items.current[i], b = bar.current; return el && b ? el.offsetLeft : 0; };
  useLayoutEffect(() => {
    const b = bar.current; if (!b) return;
    const measure = () => { const el = items.current[0]; if (el) setW(el.offsetWidth); if (sel >= 0) x.set(left(sel)); };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(b);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (sel < 0 || drag.current?.moved) return;
    const c = animate(x, left(sel), reduce ? { duration: 0 } : { type: 'spring', duration: 0.5, bounce: 0.25 });
    return () => c.stop();
  }, [sel, w]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (i: number) => { navigator.vibrate?.(6); if (i === tabs.length) onMore(); else { const to = tabs[i].to; softNavigate(() => nav(to)); } };
  const nearest = (lx: number) => { let best = 0, d = Infinity; for (let i = 0; i < count; i++) { const dd = Math.abs(left(i) - lx); if (dd < d) { d = dd; best = i; } } return best; };

  return (
    <nav aria-label="Main" className="vt-bar-bottom lg:hidden land:hidden fixed z-40 inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-2 max-w-[560px] mx-auto pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div ref={bar} className="glass relative flex-1 h-[62px] rounded-full flex items-stretch p-1 touch-pan-y"
        onPointerDown={e => { if (e.pointerType === 'mouse' && e.button) return; const r = bar.current!.getBoundingClientRect(); drag.current = { id: e.pointerId, x0: e.clientX, lx: e.clientX - r.left, moved: false }; }}
        onPointerMove={e => {
          const d = drag.current; if (!d || d.id !== e.pointerId) return;
          if (!d.moved && Math.abs(e.clientX - d.x0) < 10) return;
          if (!d.moved) { d.moved = true; setLift(true); bar.current!.setPointerCapture(e.pointerId); }
          const r = bar.current!.getBoundingClientRect();
          // The lens follows the finger, with rubber-band friction past either end of the bar.
          const raw = e.clientX - r.left - w / 2, max = left(count - 1), min = left(0);
          x.set(raw < min ? min + (raw - min) * 0.25 : raw > max ? max + (raw - max) * 0.25 : raw);
        }}
        onPointerUp={e => { const d = drag.current; drag.current = null; if (!d?.moved) return; setLift(false); const i = nearest(x.get()); animate(x, left(i), { type: 'spring', duration: 0.45, bounce: 0.25 }); if (i !== sel) go(i); e.preventDefault(); }}
        onPointerCancel={() => { if (drag.current?.moved) { setLift(false); animate(x, left(sel), { type: 'spring', duration: 0.45, bounce: 0.2 }); } drag.current = null; }}>
        {sel >= 0 && w > 0 && (
          <motion.span aria-hidden="true" className="glass-lens absolute top-1 bottom-1 left-0 rounded-full pointer-events-none"
            style={{ width: w, x, scaleX: sx, scaleY: sy }} animate={{ scale: lift ? 1.12 : 1 }} transition={{ type: 'spring', duration: 0.35, bounce: 0.3 }} />
        )}
        {[...tabs.map((t, i) => ({ ...t, i })), { to: '', label: 'More', icon: 'more' as IconName, i: tabs.length }].map(t => {
          const on = t.i === sel;
          return (
            <button key={t.label} ref={el => { items.current[t.i] = el; }} type="button" aria-current={on ? 'page' : undefined} aria-haspopup={t.i === tabs.length ? 'dialog' : undefined}
              onClick={() => { if (!drag.current?.moved) go(t.i); }}
              className={cx('relative flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 rounded-full text-[10.5px] leading-none select-none transition-colors duration-200', on ? 'text-ink font-semibold' : 'text-ink2 font-medium')}>
              <Icon name={t.icon} size={21} className={cx('transition-colors duration-200', on && 'text-accent')} />
              <span className="truncate max-w-full px-0.5">{t.label}</span>
            </button>
          );
        })}
      </div>
      <button type="button" onClick={onSearch} aria-label="Search pages, trades and actions" className="glass press w-[62px] h-[62px] shrink-0 rounded-full grid place-items-center text-ink max-[359px]:hidden">
        <Icon name="search" size={22} />
      </button>
    </nav>
  );
}
