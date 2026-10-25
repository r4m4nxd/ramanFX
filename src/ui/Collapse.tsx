// Collapsible section cards and the sticky "where am I" pill bar, shared by Learn (lesson sections) and Checklist (stages).
// Motion: the accordion animates height + opacity for 200ms on the strong ease-out (one of the few places height is
// worth its layout cost); reduced motion keeps only a quick fade. The jump menu is a small popover from the pill it
// belongs to: scale 0.97 + fade, 160ms in, 120ms out, origin top-right.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cx, ease } from './kit';
import { Icon } from './Icon';

// ─── Open state (remembered per key in localStorage; every access guarded) ───────────────────────────────────
function readSet(key: string | null, defaults: readonly string[]): Set<string> {
  if (key) {
    try {
      const v = localStorage.getItem(key);
      if (v) { const a: unknown = JSON.parse(v); if (Array.isArray(a)) return new Set(a.filter((x): x is string => typeof x === 'string')); }
    } catch { /* storage blocked */ }
  }
  return new Set(defaults);
}

export interface OpenSet {
  open: ReadonlySet<string>;
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  set: (id: string, on: boolean) => void;
  setMany: (ids: readonly string[], on: boolean) => void;
  /** Replace the whole open set (e.g. "only this one"). */
  only: (ids: readonly string[]) => void;
}

/** Which sections are open. `key` null = not remembered. `defaults` apply when nothing is stored for the key yet. */
export function useOpenSet(key: string | null, defaults: readonly string[]): OpenSet {
  const [state, setState] = useState(() => ({ key, open: readSet(key, defaults) }));
  // A new lesson / mentor: load its own remembered state during render (no flash of the previous one).
  const cur = state.key === key ? state : { key, open: readSet(key, defaults) };
  if (cur !== state) setState(cur);
  const apply = useCallback((f: (s: Set<string>) => Set<string>) => setState(prev => {
    const base = prev.key === key ? prev.open : readSet(key, defaults);
    const next = f(new Set(base));
    if (key) { try { localStorage.setItem(key, JSON.stringify([...next])); } catch { /* storage blocked */ } }
    return { key, open: next };
  }), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const open = cur.open;
  return {
    open,
    isOpen: id => open.has(id),
    toggle: id => apply(s => { if (s.has(id)) s.delete(id); else s.add(id); return s; }),
    set: (id, on) => apply(s => { if (on) s.add(id); else s.delete(id); return s; }),
    setMany: (ids, on) => apply(s => { ids.forEach(id => (on ? s.add(id) : s.delete(id))); return s; }),
    only: ids => apply(() => new Set(ids)),
  };
}

// ─── Collapsible card ──────────────────────────────────────────────────────────────────────────────────────
export function Collapsible({ id, title, lead, pill, preview, open, onToggle, children, className, bodyClassName }: {
  /** DOM id: the jump menu and the pill bar's scroll-spy use it. */
  id: string;
  title: ReactNode;
  /** Optional mark before the title (stage number, icon). */
  lead?: ReactNode;
  /** Summary pill on the right (item count, ticked count, chosen option). */
  pill?: ReactNode;
  /** One quiet line under the title, shown only while collapsed (a preview of what's inside). */
  preview?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  const reduce = useReducedMotion();
  // Bodies mount the first time they open (long lessons stay cheap) and then stay mounted, so state inside survives.
  const [seen, setSeen] = useState(open);
  if (open && !seen) setSeen(true);
  const [settled, setSettled] = useState(open);
  const bodyId = `${id}-body`;
  const headId = `${id}-head`;
  // A closed body stays in the DOM (state survives) but out of the tab order and the accessibility tree.
  const inert = (open ? {} : { inert: '' }) as Record<string, string>;
  return (
    <section id={id} data-sec="" aria-labelledby={headId} className={cx('card min-w-0 jump-target', className)}>
      <h3 className="m-0">
        <button type="button" id={headId} aria-expanded={open} aria-controls={bodyId} onClick={onToggle}
          className="sec-head w-full min-h-[56px] flex items-center gap-3 px-4 sm:px-5 py-3 text-left rounded-[inherit]">
          {lead}
          <span className="min-w-0 flex-1">
            <span className="block text-[15px] font-semibold leading-snug">{title}</span>
            {preview && !open && <span className="block text-[12px] text-ink3 leading-snug mt-0.5 truncate">{preview}</span>}
          </span>
          {pill}
          <Icon name="chevronDown" size={16} className={cx('sec-chev shrink-0 text-ink3', open && 'is-open')} />
        </button>
      </h3>
      <motion.div id={bodyId} role="region" aria-labelledby={headId}
        initial={false}
        animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={reduce ? { height: { duration: 0 }, opacity: { duration: 0.15 } } : { duration: 0.2, ease }}
        onAnimationStart={() => setSettled(false)}
        onAnimationComplete={() => setSettled(open)}
        // Clip only while moving or closed, so focus rings and popovers inside an open section are never cut off.
        style={{ overflow: open && settled ? 'visible' : 'hidden' }}>
        {seen && <div {...inert} className={cx('px-4 sm:px-5 pb-4 sm:pb-5', bodyClassName)}>{children}</div>}
      </motion.div>
    </section>
  );
}

/** "Expand all" / "Collapse all" as one quiet button. */
export function ExpandAll({ allOpen, onChange, className }: { allOpen: boolean; onChange: (open: boolean) => void; className?: string }) {
  return (
    <button type="button" className={cx('btn-ghost h-11 px-3 text-[13px] text-ink2 shrink-0', className)} onClick={() => onChange(!allOpen)} aria-label={allOpen ? 'Collapse all sections' : 'Expand all sections'}>
      <Icon name={allOpen ? 'minus' : 'plus'} size={14} />{allOpen ? 'Collapse all' : 'Expand all'}
    </button>
  );
}

// ─── Scroll spy: the section whose header has passed under the pill bar ───────────────────────────────────────
export function useActiveSection(ids: readonly string[], barRef: RefObject<HTMLElement>): string | null {
  const [active, setActive] = useState<string | null>(null);
  const sig = ids.join('|');
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const line = (barRef.current?.getBoundingClientRect().bottom ?? 120) + 16;
      let cur: string | null = null;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) cur = id; else break;
      }
      // Scrolled to the very end: the last section counts as current even if its top never reached the line.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && ids.length) {
        const last = [...ids].reverse().find(id => document.getElementById(id));
        if (last && (document.getElementById(last)!.getBoundingClientRect().top < window.innerHeight)) cur = last;
      }
      setActive(cur);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(measure); };
    measure();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}

/** Scroll a section's header to just under the pill bar (scroll-margin-top does the offset). */
export function scrollToSection(id: string, smooth: boolean) {
  // Two frames: let an opening section commit first, so nothing above it is still changing height.
  requestAnimationFrame(() => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' })));
}

// ─── Pill bar ────────────────────────────────────────────────────────────────────────────────────────────
type Tone = 'neutral' | 'accent' | 'profit' | 'loss' | 'violet';
const TONE: Record<Tone, string> = {
  neutral: 'bg-raised/80 text-ink2 border-line2',
  accent: 'bg-accent/15 text-ink border-accent/40',
  profit: 'bg-profit/10 text-profit border-profit/40',
  loss: 'bg-loss/10 text-loss border-loss/30',
  violet: 'bg-violet/10 text-violet border-violet/30',
};

/** The visual pill (chip style) for headers and the pill bar. */
export function PillTag({ children, tone = 'neutral', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 h-6 px-2.5 rounded-full border text-[11.5px] font-semibold whitespace-nowrap num shrink-0', TONE[tone], className)}>{children}</span>;
}

/** One pill in the bar: a 44px-tall hit area around a 32px chip. */
export function BarPill({ children, onClick, tone = 'neutral', grow, label, className, menuTrigger, ...aria }: {
  children: ReactNode; onClick?: () => void; tone?: Tone; grow?: boolean; label?: string; className?: string;
  /** Opens a JumpMenu: a tap on it must not count as the menu's "tap outside". */
  menuTrigger?: boolean;
  'aria-haspopup'?: 'menu'; 'aria-expanded'?: boolean;
}) {
  const inner = <span className={cx('inline-flex items-center gap-1.5 h-8 px-3 rounded-full border text-[12.5px] font-semibold min-w-0 max-w-full', TONE[tone])}>{children}</span>;
  return onClick
    ? <button type="button" onClick={onClick} aria-label={label} {...aria} {...(menuTrigger ? { 'data-jump-trigger': '' } : {})} className={cx('bar-pill h-11 flex items-center min-w-0', grow ? 'flex-1' : 'shrink-0', className)}>{inner}</button>
    : <span className={cx('h-11 flex items-center min-w-0', grow ? 'flex-1' : 'shrink-0', className)} aria-label={label}>{inner}</span>;
}

/** Sticky bar under the app header: what's selected, and where you are. Children are BarPills. */
export function PillBar({ barRef, label, children, menu }: { barRef: RefObject<HTMLDivElement>; label: string; children: ReactNode; menu?: ReactNode }) {
  return (
    <div ref={barRef} className="pill-bar" role="navigation" aria-label={label}>
      <div className="glass rounded-full flex items-center gap-1 px-1.5 min-w-0">{children}</div>
      {menu}
    </div>
  );
}

export interface JumpItem { id: string; title: ReactNode; lead?: ReactNode; pill?: ReactNode; open?: boolean }

/** Quick jump list of sections, dropped from the pill bar. Closes on pick, Escape, or a tap outside. */
// Portalled and position: fixed under its bar: an absolute menu inside a sticky bar would add its height to the page's
// scrollable area (and an ancestor's filter/transform would capture a fixed one), throwing off jump scrolling.
export function JumpMenu({ open, onClose, items, active, onPick, head, anchor }: { open: boolean; onClose: () => void; items: JumpItem[]; active: string | null; onPick: (id: string) => void; head?: ReactNode; anchor: RefObject<HTMLElement> }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  useLayoutEffect(() => {
    if (!open) return;
    let raf = 0;
    const place = () => { raf = 0; const r = anchor.current?.getBoundingClientRect(); if (r) setPos({ top: Math.round(r.bottom + 6), right: Math.max(8, Math.round(window.innerWidth - r.right)) }); };
    const on = () => { if (!raf) raf = requestAnimationFrame(place); };
    place();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [open, anchor]);
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (ref.current?.contains(t) || (t instanceof Element && t.closest('[data-jump-trigger]'))) return; onClose(); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('pointerdown', down);
    document.addEventListener('keydown', key);
    // Focus the current section's row so keyboard users land where they are.
    requestAnimationFrame(() => (ref.current?.querySelector<HTMLElement>('[aria-current="true"]') ?? ref.current?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true }));
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); };
  }, [open, onClose]);
  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && pos && (
        <motion.div ref={ref} role="menu" aria-label="Jump to section"
          style={{ top: pos.top, right: pos.right, ['--jm-top' as string]: `${pos.top}px` }}
          initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.97) translateY(-4px)' }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, transform: 'scale(1) translateY(0px)' }}
          exit={reduce ? { opacity: 0, transition: { duration: 0.1 } } : { opacity: 0, transform: 'scale(0.97) translateY(-4px)', transition: { duration: 0.12, ease } }}
          transition={{ duration: 0.16, ease }}
          className="jump-menu fixed glass-pop shadow-pop rounded-[20px] p-1.5">
          {head && <div className="flex items-center justify-between gap-2 px-2.5 pb-1 border-b border-line mb-1">{head}</div>}
          {items.map(it => (
            <button key={it.id} type="button" role="menuitem" aria-current={it.id === active ? 'true' : undefined} onClick={() => { onPick(it.id); onClose(); }}
              className={cx('jump-row w-full min-h-[44px] flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left', it.id === active && 'bg-accent/10')}>
              {it.lead}
              <span className={cx('min-w-0 flex-1 text-[13.5px] leading-snug', it.id === active ? 'font-semibold text-ink' : 'text-ink2')}>{it.title}</span>
              {it.pill}
              {it.open !== undefined && <span aria-label={it.open ? 'open' : 'collapsed'} className={cx('w-1.5 h-1.5 rounded-full shrink-0', it.open ? 'bg-accent' : 'bg-line2')} />}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
