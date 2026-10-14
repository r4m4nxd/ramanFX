import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon, type IconName } from './Icon';

export const cx = clsx;

// ─── Motion presets ──────────────────────────────────────────────────
export const spring = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 } as const;
export const ease = [0.22, 1, 0.36, 1] as const;

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.02 } },
};
export const rise = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

/** Page wrapper: children marked with `variants={rise}` cascade in. */
export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className={cx('flex flex-col gap-4', className)}>
      {children}
    </motion.div>
  );
}

export function Card({ children, className, as = 'section', ...rest }: { children: ReactNode; className?: string; as?: 'section' | 'div'; 'aria-label'?: string }) {
  const C = as === 'div' ? motion.div : motion.section;
  // Default padding only when the caller sets none (p-0 can't beat p-5 in Tailwind's order).
  const padded = !/(^|\s)(md:|sm:)?p[xy]?-\d/.test(className ?? '');
  return <C variants={rise} className={cx('card min-w-0', padded && 'p-5', className)} {...rest}>{children}</C>;
}

export function CardHead({ title, sub, right }: { title: ReactNode; sub?: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
      <div className="min-w-0">
        <h2 className="text-[15px] font-semibold leading-tight">{title}</h2>
        {sub && <p className="text-xs text-ink3 mt-1">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ─── Animated number ─────────────────────────────────────────────────
export function CountUp({ value, format, className }: { value: number; format: (n: number) => string; className?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, v => format(v));
  const first = useRef(true);
  useEffect(() => {
    if (reduce) { mv.set(value); return; }
    const from = first.current ? 0 : mv.get();
    first.current = false;
    mv.set(from);
    const c = animate(mv, value, { duration: 0.9, ease });
    return () => c.stop();
  }, [value, reduce, mv]);
  return <motion.span className={className}>{text}</motion.span>;
}

// ─── Segmented control with sliding pill ─────────────────────────────
export function Segmented<T extends string>({ value, onChange, options, size = 'md', label }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; size?: 'sm' | 'md'; label: string }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex p-0.5 rounded-lg bg-raised border border-line">
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} role="radio" aria-checked={on} onClick={() => onChange(o.value)} type="button"
            className={cx('relative rounded-md font-medium transition-colors', size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-[13px]', on ? 'text-ink' : 'text-ink3 hover:text-ink2')}>
            {on && <motion.span layoutId={`seg-${id}`} transition={spring} className="absolute inset-0 rounded-md bg-surface border border-line2 shadow-sm" />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** True below the md breakpoint (phones). */
const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)') : null;
export function useIsMobile() {
  return useSyncExternalStore(cb => { mq?.addEventListener('change', cb); return () => mq?.removeEventListener('change', cb); }, () => !!mq?.matches, () => false);
}

/** Page-level tabs: a segmented bar on desktop, a wrapping pill grid on phones (no sideways scrolling). */
export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  const mobile = useIsMobile();
  const id = useId();
  if (!mobile) return <div><Segmented label={label} value={value} onChange={onChange} options={options} /></div>;
  return (
    <div role="tablist" aria-label={label} className={cx('grid gap-1.5 p-1 rounded-2xl bg-raised border border-line', options.length % 3 === 0 || options.length > 4 ? 'grid-cols-3' : 'grid-cols-2')}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} role="tab" aria-selected={on} type="button" onClick={() => onChange(o.value)}
            className={cx('relative min-h-[40px] px-2 rounded-xl text-[13px] font-semibold leading-tight transition-colors', on ? 'text-ink' : 'text-ink3 active:bg-surface/60')}>
            {on && <motion.span layoutId={`tab-${id}`} transition={spring} className="absolute inset-0 rounded-xl bg-surface border border-line2 shadow-sm" />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Label/value rows, used where a wide table would scroll sideways on a phone. */
export function Stat({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return <div className="min-w-0"><div className="text-[10.5px] uppercase tracking-[0.06em] font-semibold text-ink3 truncate">{label}</div><div className={cx('num text-[13px] font-medium mt-0.5 truncate', className)}>{value}</div></div>;
}

// ─── Progress bar ────────────────────────────────────────────────────
export function Bar({ value, tone = 'accent', className }: { value: number; tone?: 'accent' | 'profit' | 'loss' | 'warn'; className?: string }) {
  const bg = { accent: 'bg-accent', profit: 'bg-profit', loss: 'bg-loss', warn: 'bg-warn' }[tone];
  return (
    <div className={cx('h-1.5 rounded-full bg-line overflow-hidden', className)}>
      <motion.div className={cx('h-full rounded-full', bg)} initial={{ width: 0 }} animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} transition={{ duration: 0.8, ease }} />
    </div>
  );
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'profit' | 'loss' | 'warn' | 'accent' | 'violet'; className?: string }) {
  const t = { neutral: 'bg-raised text-ink2 border-line2', profit: 'bg-profit/10 text-profit border-profit/30', loss: 'bg-loss/10 text-loss border-loss/30', warn: 'bg-warn/10 text-warn border-warn/30', accent: 'bg-accent/10 text-accent border-accent/30', violet: 'bg-violet/10 text-violet border-violet/30' }[tone];
  return <span className={cx('inline-flex items-center gap-1 h-6 px-2 rounded-md border text-[11px] font-semibold tracking-wide', t, className)}>{children}</span>;
}

export function Empty({ icon = 'info', title, children, action }: { icon?: IconName; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 gap-3">
      <div className="w-11 h-11 rounded-xl bg-raised border border-line grid place-items-center text-ink3"><Icon name={icon} size={20} /></div>
      <div className="font-semibold">{title}</div>
      {children && <div className="text-sm text-ink3 max-w-sm leading-relaxed">{children}</div>}
      {action}
    </div>
  );
}

export function Tip({ text, children }: { text: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.span role="tooltip" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.14 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[240px] px-2.5 py-1.5 rounded-lg bg-ink text-bg text-xs leading-snug font-normal normal-case tracking-normal pointer-events-none">
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function InfoTip({ text }: { text: string }) {
  return <Tip text={text}><button type="button" aria-label={text} className="text-ink3 hover:text-ink2"><Icon name="info" size={13} /></button></Tip>;
}

// ─── Sheet (side panel on desktop, bottom sheet on mobile) ───────────
export function Sheet({ open, onClose, title, children, width = 520 }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  // Portalled: the blurred sticky header would otherwise trap a fixed sheet inside itself.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute bg-surface border-line2 shadow-pop flex flex-col max-md:inset-x-0 max-md:bottom-0 max-md:max-h-sheet max-md:rounded-t-2xl max-md:border-t md:top-0 md:right-0 md:h-full md:border-l"
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? width : undefined }}
            initial={typeof window !== 'undefined' && window.innerWidth < 768 ? { y: '100%' } : { x: '100%' }}
            animate={{ x: 0, y: 0 }}
            exit={typeof window !== 'undefined' && window.innerWidth < 768 ? { y: '100%' } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}>
            <div className="flex items-center justify-between px-5 h-14 border-b border-line shrink-0">
              <h2 className="font-semibold">{title}</h2>
              <button className="btn-ghost w-9 px-0" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
            </div>
            <div className="overflow-y-auto overscroll-contain p-5 pb-safe">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

// ─── Toasts ──────────────────────────────────────────────────────────
type Toast = { id: number; text: string; tone: 'ok' | 'error' | 'info' };
const ToastCtx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast['tone'] = 'ok') => {
    const id = Date.now() + Math.random();
    setList(l => [...l, { id, text, tone }]);
    setTimeout(() => setList(l => l.filter(t => t.id !== id)), 4500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed z-[60] bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center pointer-events-none" aria-live="polite">
        <AnimatePresence>
          {list.map(t => (
            <motion.div key={t.id} layout initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={spring}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-surface border border-line2 shadow-pop text-sm max-w-[90vw]">
              <span className={cx('w-2 h-2 rounded-full shrink-0', t.tone === 'ok' ? 'bg-profit' : t.tone === 'error' ? 'bg-loss' : 'bg-accent')} />
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="text-xs font-medium text-ink2">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-ink3">{hint}</span>}
    </label>
  );
}
