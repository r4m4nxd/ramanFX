// Tap-tips for the stock scanner: tap (or click, Enter / Space) a dotted-underlined label or number and a small
// glass blob explains it. Hover and keyboard focus open it on desktop. One open at a time; closes on a tap elsewhere,
// Esc, scroll or resize. Placed in the viewport between the sticky header and the bottom tab bar, flipped above /
// below the trigger, clamped 12px from the sides. Same glass and fade as kit's Tip.
import { cloneElement, isValidElement, useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type PointerEvent as RPointerEvent, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { TipDoc } from '@/core/scannerGlossary';
import { Icon } from './Icon';
import { cx } from './kit';

type Mode = false | 'hover' | 'pin';
let current: { id: string; close: () => void } | null = null;
let lastClosed = 0;
const warm = () => !!current || performance.now() - lastClosed < 400;

/** The free band of the viewport: below the sticky top bar, above the bottom tab bar (when they show). */
function bounds() {
  const vh = window.innerHeight;
  let top = 8, bottom = vh - 8;
  const head = document.querySelector('header.vt-bar-top');
  if (head) { const r = head.getBoundingClientRect(); if (r.height && r.bottom > 0 && r.top <= 1) top = Math.max(top, r.bottom + 6); }
  const nav = document.querySelector('nav.vt-bar-bottom');
  if (nav) { const r = nav.getBoundingClientRect(); if (r.height && r.top < vh) bottom = Math.min(bottom, r.top - 8); }
  return { top, bottom };
}

function TipBody({ doc }: { doc: TipDoc }) {
  return (
    <>
      <span className="block font-semibold text-[13px] text-ink mb-1 [overflow-wrap:anywhere]">{doc.title}</span>
      <span className="block text-ink2 [overflow-wrap:anywhere]">{doc.body}</span>
      {!!doc.lines?.length && (
        <span className="flex flex-col gap-0.5 mt-1.5">
          {doc.lines.map((l, i) => <span key={i} className="flex gap-1.5 text-ink2"><span aria-hidden="true" className="text-ink3">•</span><span className="min-w-0 [overflow-wrap:anywhere]">{l}</span></span>)}
        </span>
      )}
      {doc.ref && <span className="block mt-1.5 text-[11px] text-ink3">{doc.ref}</span>}
    </>
  );
}

const docText = (d: TipDoc) => [d.title, d.body, ...(d.lines ?? []), d.ref].filter(Boolean).join('. ');

/**
 * Wraps a label / number / chip. Modes:
 * - default: the wrapper is the trigger (role=button, focusable, aria-expanded, aria-describedby while open).
 * - `inert`: inside an element that is itself one control (a listbox option, a <summary>): no role, not focusable;
 *   a tap still opens the tip and never reaches the parent.
 * - `control`: the child is a real button / link; hover and keyboard focus show the tip, a long press (450ms) on
 *   touch shows it without firing the control. The child gets aria-describedby to an always-present sr-only copy.
 */
export function Explain({ doc, children, as: Tag = 'span', className, u = true, inert, control, label, style }: {
  doc: TipDoc; children: ReactNode; as?: 'span' | 'div'; className?: string; u?: boolean; inert?: boolean; control?: boolean; label?: string; style?: CSSProperties;
}) {
  const id = useId(), popId = `${id}-tip`, srId = `${id}-sr`;
  const ref = useRef<HTMLElement | null>(null), pop = useRef<HTMLSpanElement>(null);
  const [mode, setMode] = useState<Mode>(false);
  const [instant, setInstant] = useState(false);
  const modeRef = useRef<Mode>(false); modeRef.current = mode;
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const press = useRef<{ t: ReturnType<typeof setTimeout>; x: number; y: number } | null>(null);
  const swallow = useRef(false);
  const kind = useRef('mouse');
  const refocus = useRef(false);
  const escaped = useRef(false);   // Esc dismissed it: no hover reopen until the pointer leaves (WCAG 1.4.13)

  const close = () => { clearTimeout(timer.current); setMode(false); };
  const open = (m: Exclude<Mode, false>) => {
    clearTimeout(timer.current);
    if (current && current.id !== id) current.close();
    setInstant(warm());
    current = { id, close };
    setMode(m);
  };
  useEffect(() => {
    if (!mode) return;
    return () => { if (current?.id === id) current = null; lastClosed = performance.now(); };
  }, [mode, id]);
  useEffect(() => () => { clearTimeout(timer.current); if (press.current) clearTimeout(press.current.t); }, []);

  useLayoutEffect(() => {
    const el = pop.current, t = control ? ref.current?.firstElementChild : ref.current;
    if (!mode || !el || !t) return;
    const a = t.getBoundingClientRect(), vw = document.documentElement.clientWidth;
    const { top, bottom } = bounds();
    el.style.maxHeight = '';
    const w = el.offsetWidth, h = el.offsetHeight, gap = 8;
    const roomUp = a.top - gap - top, roomDown = bottom - (a.bottom + gap);
    const up = roomUp >= h || (roomDown < h && roomUp > roomDown);
    const room = Math.max(80, up ? roomUp : roomDown);
    if (h > room) el.style.maxHeight = `${Math.floor(room)}px`;
    const hh = Math.min(h, room);
    const left = Math.min(Math.max(12, a.left + a.width / 2 - w / 2), vw - 12 - w);
    el.style.left = `${Math.round(Math.max(12, left))}px`;
    el.style.top = `${Math.round(Math.max(top, Math.min(up ? a.top - gap - hh : a.bottom + gap, bottom - hh)))}px`;
    el.style.transformOrigin = `${Math.round(a.left + a.width / 2 - left)}px ${up ? '100%' : '0%'}`;
    el.style.visibility = 'visible';
  }, [mode, control]);

  useEffect(() => {
    if (!mode) return;
    const down = (e: PointerEvent) => { const n = e.target as Node; if (ref.current?.contains(n) || pop.current?.contains(n)) return; close(); };
    const key = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') { const had = ref.current?.contains(document.activeElement); escaped.current = true; close(); if (had && document.activeElement !== ref.current) refocus.current = true; if (had) (ref.current?.querySelector<HTMLElement>('a,button,[tabindex]') ?? ref.current)?.focus(); } };
    const scroll = (e: Event) => { if (pop.current?.contains(e.target as Node)) return; close(); };
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('keydown', key);
    window.addEventListener('scroll', scroll, true);
    window.addEventListener('resize', close);
    return () => { document.removeEventListener('pointerdown', down, true); document.removeEventListener('keydown', key); window.removeEventListener('scroll', scroll, true); window.removeEventListener('resize', close); };
  }, [mode]);

  const hoverIn = (e: RPointerEvent) => { if (e.pointerType !== 'mouse' || modeRef.current === 'pin' || escaped.current) return; clearTimeout(timer.current); if (warm()) open('hover'); else timer.current = setTimeout(() => open('hover'), 220); };
  const hoverOut = (e: RPointerEvent) => { if (e.pointerType !== 'mouse') return; escaped.current = false; clearTimeout(timer.current); if (modeRef.current === 'hover') timer.current = setTimeout(close, 140); };
  const toggle = () => { escaped.current = false; if (modeRef.current === 'pin') close(); else open('pin'); };

  const popEl = mode && typeof document !== 'undefined' ? createPortal(
    <span ref={pop} id={popId} role="tooltip" aria-hidden={control ? true : undefined} style={{ left: 0, top: 0, visibility: 'hidden' }}
      onPointerEnter={() => clearTimeout(timer.current)} onPointerLeave={e => hoverOut(e)} onClick={e => e.stopPropagation()}
      className={cx(!instant && 'tip-in', 'fixed z-[200] block w-max max-w-[min(300px,calc(100vw-24px))] overflow-y-auto overscroll-contain px-3.5 py-3 rounded-2xl glass-pop text-[12.5px] leading-snug font-normal normal-case tracking-normal text-left whitespace-normal')}>
      <TipBody doc={doc} />
    </span>, document.body) : null;

  if (control) {
    const child = isValidElement(children) ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, { 'aria-describedby': srId }) : children;
    return (
      <span ref={el => { ref.current = el; }} className={cx('contents', className)} style={{ WebkitTouchCallout: 'none', ...style }}
        onPointerEnter={hoverIn} onPointerLeave={hoverOut}
        onFocus={e => { if (refocus.current) { refocus.current = false; return; } if ((e.target as HTMLElement).matches?.(':focus-visible')) open('hover'); }}
        onBlur={() => { if (modeRef.current) close(); }}
        onPointerDown={e => {
          if (e.pointerType === 'mouse') return;
          const p = { x: e.clientX, y: e.clientY, t: setTimeout(() => { swallow.current = true; open('pin'); }, 450) };
          press.current = p;
        }}
        onPointerMove={e => { const p = press.current; if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) { clearTimeout(p.t); press.current = null; } }}
        onPointerUp={() => { if (press.current) clearTimeout(press.current.t); press.current = null; }}
        onPointerCancel={() => { if (press.current) clearTimeout(press.current.t); press.current = null; }}
        onContextMenu={e => { if (swallow.current || press.current) e.preventDefault(); }}
        onClickCapture={e => { if (swallow.current) { e.preventDefault(); e.stopPropagation(); swallow.current = false; } }}>
        {child}
        <span id={srId} className="sr-only">{docText(doc)}</span>
        {popEl}
      </span>
    );
  }

  const onClick = (e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (kind.current === 'mouse' && modeRef.current === 'hover') open('pin'); else toggle(); };
  const onKey = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); toggle(); } };
  // Icon triggers (InfoDot, 32px+) are buttons with aria-expanded. Text / number / chip triggers stay in the text
  // flow: focusable (Tab shows the tip, Enter / Space pins it), described by the tip while it is open, but not given a
  // widget role, so a dense row of small numbers is not a row of undersized buttons (WCAG 2.2 target size).
  const a11y = inert ? {} : label
    ? { role: 'button', tabIndex: 0, 'aria-expanded': !!mode, 'aria-describedby': mode ? popId : undefined, 'aria-label': label, onKeyDown: onKey }
    : { tabIndex: 0, 'aria-describedby': mode ? popId : undefined, onKeyDown: onKey };
  return (
    <Tag ref={(el: HTMLElement | null) => { ref.current = el; }} {...a11y} style={style}
      className={cx('tip-t', u && 'tip-u', mode && 'tip-on', className)} data-tip={inert ? undefined : ''}
      onPointerDown={e => { kind.current = e.pointerType; }}
      onPointerEnter={hoverIn} onPointerLeave={hoverOut}
      onFocus={e => { if (refocus.current) { refocus.current = false; return; } if (!inert && (e.target === e.currentTarget) && e.currentTarget.matches(':focus-visible')) open('hover'); }}
      onBlur={e => { if (modeRef.current && !pop.current?.contains(e.relatedTarget as Node) && (modeRef.current === 'hover' || e.relatedTarget)) close(); }}
      onClick={onClick}>
      {children}
      {popEl}
    </Tag>
  );
}

/** A tiny ⓘ trigger for a control that has no text of its own to underline (segmented pills, a chart). */
export function InfoDot({ doc, label, className }: { doc: TipDoc; label: string; className?: string }) {
  return (
    <Explain doc={doc} u={false} label={label} className={cx('inline-grid place-items-center shrink-0 rounded-full text-ink3 hover:text-ink2 w-8 h-8', className)}>
      <Icon name="info" size={14} />
    </Explain>
  );
}
