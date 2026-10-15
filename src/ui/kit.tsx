import { AnimatePresence, animate, motion, useDragControls, useMotionValue, useReducedMotion, useTransform } from 'framer-motion';
import { clsx } from 'clsx';
import { createContext, useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode, type RefObject } from 'react';
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
/** Intro motion (count from 0, bars grow) plays only while the app first paints. After that a remount shows the
 *  real value at once, so navigating never flashes a wrong number. */
const bootAt = typeof performance !== 'undefined' ? performance.now() : 0;
const warm = () => typeof performance !== 'undefined' && performance.now() - bootAt > 2500;
const seen = new Map<string, number>();

export function CountUp({ value, format, className, id }: { value: number; format: (n: number) => string; className?: string; /** Stable key: later mounts animate from the last value shown under this id. */ id?: string }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, v => format(v));
  const first = useRef(true);
  useEffect(() => {
    const last = id != null ? seen.get(id) : undefined;
    if (id != null) seen.set(id, value);
    if (reduce) { mv.set(value); return; }
    const from = first.current ? (last ?? (warm() ? value : 0)) : mv.get();
    first.current = false;
    if (from === value) { mv.set(value); return; }
    mv.set(from);
    const c = animate(mv, value, { duration: 0.45, ease });
    return () => c.stop();
  }, [value, reduce, mv, id]);
  return <motion.span className={className}>{text}</motion.span>;
}

// ─── Segmented control with sliding pill ─────────────────────────────
export function Segmented<T extends string>({ value, onChange, options, size = 'md', label }: { value: T; onChange: (v: T) => void; options: { value: T; label: ReactNode }[]; size?: 'sm' | 'md'; label: string }) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex p-[3px] rounded-full bg-raised/60 border border-line">
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} role="radio" aria-checked={on} onClick={() => onChange(o.value)} type="button"
            className={cx('relative rounded-full font-semibold whitespace-nowrap transition-colors', size === 'sm' ? 'h-7 touch:h-9 px-3 touch:px-3.5 text-xs' : 'h-8 touch:h-10 px-3.5 text-[13px]', on ? 'text-ink' : 'text-ink3 hover:text-ink2')}>
            {on && <motion.span layoutId={`seg-${id}`} transition={spring} className="absolute inset-0 rounded-full pill-on" />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** navigator.onLine as live state. */
const onlineSub = (cb: () => void) => { window.addEventListener('online', cb); window.addEventListener('offline', cb); return () => { window.removeEventListener('online', cb); window.removeEventListener('offline', cb); }; };
export function useOnline() { return useSyncExternalStore(onlineSub, () => navigator.onLine, () => true); }

/** True below the md breakpoint (phones). */
const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(max-width: 767px)') : null;
export function useIsMobile() {
  return useSyncExternalStore(cb => { mq?.addEventListener('change', cb); return () => mq?.removeEventListener('change', cb); }, () => !!mq?.matches, () => false);
}

/** Columns for a wrapping tab grid: even rows, never a lonely last item if avoidable. */
const tabCols = (n: number, mobile: boolean) => (mobile ? (n <= 4 ? n : n % 3 === 0 || n === 5 ? 3 : 4) : n <= 10 ? n : Math.ceil(n / 2));

/** Page-level tabs: a segmented bar on desktop, a wrapping pill grid on phones (no sideways scrolling). */
export function Tabs<T extends string>({ value, onChange, options, label }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string }) {
  const mobile = useIsMobile();
  const id = useId();
  if (!mobile && options.length <= 6) return <div><Segmented label={label} value={value} onChange={onChange} options={options} /></div>;
  return (
    <div role="tablist" aria-label={label} className={cx('grid gap-1.5 p-1 rounded-[22px] bg-raised/60 border border-line', options.length > 4 && 'land:![grid-template-columns:repeat(6,minmax(0,1fr))]')}
      style={{ gridTemplateColumns: `repeat(${tabCols(options.length, mobile)}, minmax(0, 1fr))` }}>
      {options.map(o => {
        const on = o.value === value;
        return (
          <button key={o.value} role="tab" aria-selected={on} type="button" onClick={() => onChange(o.value)}
            className={cx('relative min-h-[40px] px-2 rounded-full text-[13px] font-semibold leading-tight transition-colors', on ? 'text-ink' : 'text-ink3 active:bg-surface/60')}>
            {on && <motion.span layoutId={`tab-${id}`} transition={spring} className="absolute inset-0 rounded-full pill-on" />}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** Label/value rows, used where a wide table would scroll sideways on a phone. */
export function Stat({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return <div className="min-w-0"><div className="label truncate">{label}</div><div className={cx('num text-[13px] font-medium mt-0.5 truncate', className)}>{value}</div></div>;
}

// ─── Progress bar ────────────────────────────────────────────────────
export function Bar({ value, tone = 'accent', className }: { value: number; tone?: 'accent' | 'profit' | 'loss' | 'warn'; className?: string }) {
  const bg = { accent: 'bg-accent', profit: 'bg-profit', loss: 'bg-loss', warn: 'bg-warn' }[tone];
  const [grow] = useState(() => !warm());
  return (
    <div className={cx('h-1.5 rounded-full bg-line overflow-hidden', className)}>
      <motion.div className={cx('h-full rounded-full', bg)} initial={grow ? { width: 0 } : false} animate={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} transition={{ duration: 0.45, ease }} />
    </div>
  );
}

export function Badge({ children, tone = 'neutral', className }: { children: ReactNode; tone?: 'neutral' | 'profit' | 'loss' | 'warn' | 'accent' | 'violet'; className?: string }) {
  const t = { neutral: 'bg-raised text-ink2 border-line2', profit: 'bg-profit/10 text-profit border-profit/30', loss: 'bg-loss/10 text-loss border-loss/30', warn: 'bg-warn/10 text-warn border-warn/30', accent: 'bg-accent/10 text-accent border-accent/30', violet: 'bg-violet/10 text-violet border-violet/30' }[tone];
  return <span className={cx('inline-flex items-center gap-1 h-6 px-2.5 rounded-full border text-[11px] font-semibold tracking-wide', t, className)}>{children}</span>;
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

/**
 * Tooltip, portalled to <body> and positioned in the viewport: clamped 8px inside the screen, flipped below
 * when there is no room above. Mouse: hover. Touch: tap to toggle, tap elsewhere or scroll to close.
 * Keyboard: shows on focus-visible.
 */
export function Tip({ text, children }: { text: string; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null), tip = useRef<HTMLSpanElement>(null);
  const kind = useRef('mouse');
  const [at, setAt] = useState<DOMRect | null>(null);
  const show = () => ref.current && setAt(ref.current.getBoundingClientRect());
  const hide = () => setAt(null);
  useLayoutEffect(() => {
    const el = tip.current;
    if (!at || !el) return;
    const vw = document.documentElement.clientWidth, w = el.offsetWidth, h = el.offsetHeight;
    const below = at.top - h - 8 < 8;
    el.style.left = `${Math.round(Math.min(Math.max(8, at.left + at.width / 2 - w / 2), vw - 8 - w))}px`;
    el.style.top = `${Math.round(below ? at.bottom + 8 : at.top - h - 8)}px`;
    el.style.visibility = 'visible';
  }, [at]);
  useEffect(() => {
    if (!at) return;
    const away = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) hide(); };
    window.addEventListener('pointerdown', away);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => { window.removeEventListener('pointerdown', away); window.removeEventListener('scroll', hide, true); window.removeEventListener('resize', hide); };
  }, [at]);
  return (
    <span ref={ref} className="inline-flex"
      onPointerDown={e => { kind.current = e.pointerType; }}
      onPointerEnter={e => { if (e.pointerType === 'mouse') show(); }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') hide(); }}
      onFocus={e => { if ((e.target as HTMLElement).matches?.(':focus-visible')) show(); }}
      onBlur={hide}
      onClick={() => { if (kind.current !== 'mouse') { if (at) hide(); else show(); } }}>
      {children}
      {at && createPortal(
        <span ref={tip} role="tooltip" style={{ left: 0, top: 0, visibility: 'hidden' }}
          className="tip-in fixed z-[200] w-max max-w-[min(260px,calc(100vw-16px))] px-2.5 py-1.5 rounded-lg bg-ink text-bg text-xs leading-snug font-normal normal-case tracking-normal pointer-events-none shadow-pop">
          {text}
        </span>, document.body)}
    </span>
  );
}

export function InfoTip({ text }: { text: string }) {
  return <Tip text={text}><button type="button" aria-label={text} className="text-ink3 hover:text-ink2 p-1.5 -m-1.5 touch:p-2.5 touch:-m-2.5"><Icon name="info" size={13} /></button></Tip>;
}

// ─── Focus management for dialogs ────────────────────────────────────
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
/** While `open`: move focus into `ref` (first [autofocus], else `initial`, else the first control), keep Tab inside it,
 *  and hand focus back to whatever had it when the dialog closes. */
export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement>, initial?: string) {
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => {
      const el = ref.current;
      if (!el || el.contains(document.activeElement)) return;
      const first = el.querySelector<HTMLElement>('[autofocus]') ?? (initial ? el.querySelector<HTMLElement>(initial) : null) ?? el.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus({ preventScroll: true });
    }, 30);
    const onKey = (e: KeyboardEvent) => {
      const el = ref.current;
      if (e.key !== 'Tab' || !el) return;
      const list = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(x => x.offsetParent !== null);
      if (!list.length) return;
      const f = list[0], l = list[list.length - 1];
      if (!el.contains(document.activeElement)) { e.preventDefault(); f.focus(); }
      else if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(t); document.removeEventListener('keydown', onKey); if (prev && document.contains(prev)) prev.focus({ preventScroll: true }); };
  }, [open, ref, initial]);
}

// ─── Sheet (side panel on desktop, bottom sheet on mobile) ───────────
export function Sheet({ open, onClose, title, children, width = 520, bottom = false }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number; /** Always a bottom sheet (centred, max 560px) — for menus. */ bottom?: boolean }) {
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const drag = useDragControls();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, onClose]);
  useDialogFocus(open, panel, '[data-sheet-close]');
  const fromBottom = bottom || (typeof window !== 'undefined' && window.innerWidth < 768);
  const off = reduce ? { opacity: 0 } : fromBottom ? { y: '100%' } : { x: '100%' };
  // Portalled: the blurred sticky header would otherwise trap a fixed sheet inside itself.
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div ref={panel}
            className={cx('absolute bg-surface border-line2 shadow-pop flex flex-col', bottom
              ? 'inset-x-0 bottom-0 mx-auto w-full max-w-[560px] max-h-sheet rounded-t-2xl border-t border-x'
              : 'max-md:inset-x-0 max-md:bottom-0 max-md:max-h-sheet max-md:rounded-t-2xl max-md:border-t md:top-0 md:right-0 md:h-full md:border-l')}
            style={{ width: !bottom && typeof window !== 'undefined' && window.innerWidth >= 768 ? width : undefined }}
            initial={off}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={off}
            transition={reduce ? { duration: 0.12 } : { type: 'spring', stiffness: 380, damping: 38 }}
            // Bottom sheets follow the finger down and dismiss past ~110px or on a quick flick, like a native sheet.
            drag={fromBottom && !reduce ? 'y' : false} dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }} dragListener={false}
            dragControls={drag}
            onDragEnd={(_, i) => { if (i.offset.y > 110 || i.velocity.y > 600) onClose(); }}>
            {fromBottom && <div className="pt-2 pb-1 grid place-items-center touch-none cursor-grab" onPointerDown={e => drag.start(e)} aria-hidden="true"><span className="w-10 h-1.5 rounded-full bg-line2" /></div>}
            <div className={cx('flex items-center justify-between px-5 h-14 border-b border-line shrink-0', fromBottom && 'touch-none')} onPointerDown={e => { if (fromBottom && !(e.target as HTMLElement).closest('button')) drag.start(e); }}>
              <h2 className="font-semibold">{title}</h2>
              <button className="btn-ghost w-9 px-0" onClick={onClose} aria-label="Close" data-sheet-close><Icon name="x" /></button>
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
type ToastAction = { label: string; run: () => void };
type Toast = { id: number; text: string; tone: 'ok' | 'error' | 'info'; action?: ToastAction; ms: number };
type Push = (text: string, tone?: Toast['tone'], opts?: { action?: ToastAction; ms?: number }) => void;
const ToastCtx = createContext<Push>(() => {});
export const useToast = () => useContext(ToastCtx);

/** One toast. Errors stay until dismissed; others pause while hovered or focused. An action (e.g. Undo) gives 6s. */
function ToastItem({ t, onClose }: { t: Toast; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || t.tone === 'error') return;
    const h = setTimeout(onClose, t.ms);
    return () => clearTimeout(h);
  }, [paused, t, onClose]);
  return (
    <motion.div layout initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={spring}
      onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}
      className="pointer-events-auto flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 min-h-[44px] rounded-xl bg-surface border border-line2 shadow-pop text-sm max-w-[min(90vw,480px)]">
      <span className={cx('w-2 h-2 rounded-full shrink-0', t.tone === 'ok' ? 'bg-profit' : t.tone === 'error' ? 'bg-loss' : 'bg-accent')} aria-hidden="true" />
      <span className="py-1 mr-1">{t.text}</span>
      {t.action && <button type="button" className="btn-ghost h-8 px-3 text-accent shrink-0" onClick={() => { t.action!.run(); onClose(); }}>{t.action.label}</button>}
      <button type="button" className="btn-ghost h-8 w-8 px-0 text-ink3 shrink-0 ml-auto" aria-label="Dismiss" onClick={onClose}><Icon name="x" size={14} /></button>
    </motion.div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback<Push>((text, tone = 'ok', opts) => {
    const id = Date.now() + Math.random();
    setList(l => [...l.slice(-3), { id, text, tone, action: opts?.action, ms: opts?.ms ?? (opts?.action ? 6000 : 4500) }]);
  }, []);
  const close = useCallback((id: number) => setList(l => l.filter(t => t.id !== id)), []);
  // Errors go to an assertive region so screen readers interrupt for them; everything else is polite.
  const region = (tone: 'error' | 'other') => (
    <div className="flex flex-col gap-2 items-center" role={tone === 'error' ? 'alert' : 'status'} aria-live={tone === 'error' ? 'assertive' : 'polite'}>
      <AnimatePresence>
        {list.filter(t => (t.tone === 'error') === (tone === 'error')).map(t => <ToastItem key={t.id} t={t} onClose={() => close(t.id)} />)}
      </AnimatePresence>
    </div>
  );
  return (
    <ToastCtx.Provider value={push}>
      {children}
      {/* Clears the phone tab bar (~64px + home indicator); bottom-left in landscape, where the rail sits on the left. */}
      <div className="fixed z-[60] bottom-[calc(76px+env(safe-area-inset-bottom))] lg:bottom-6 land:bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center pointer-events-none">
        {region('error')}{region('other')}
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
