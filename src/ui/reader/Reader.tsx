// Kindle-style book reader for one lesson: serif type, horizontal pages (one CSS column per page), tap / swipe /
// arrow keys to turn, Aa settings, contents, "min left in chapter", and immersion reading with the recorded narration.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { VideoLesson } from '@/core/videoLessons';
import type { ZoomSession } from '@/core/zoomSessions';
import { cx, ease, lockScroll, useDialogFocus } from '@/ui/kit';
import { Lightbox } from '@/ui/Lightbox';
import { safeSvg } from '@/ui/LessonMedia';
import { Eq, G, Glyph } from '@/ui/listen/ListenBar';
import { recordedIndex, type Recorded } from '@/ui/listen/recorded';
import { useRecordedAudio } from '@/ui/listen/useRecordedAudio';
import { safeStorage } from '@/ui/listen/voices';
import './reader.css';

// ─── Preferences ──────────────────────────────────────────────────────
type Theme = 'white' | 'sepia' | 'black' | 'app';
interface Prefs { theme: Theme; size: number; font: 'serif' | 'sans'; lh: number; mg: number }
const K_PREFS = 'rfx_reader_prefs', K_POS = 'rfx_reader_pos:';
const SIZES = [15, 16.5, 18, 19.5, 21, 23, 26];
const LHS = [1.4, 1.55, 1.75];
const MGS = [14, 24, 40];
const WPM = 230;
const DEF: Prefs = { theme: 'app', size: 2, font: 'serif', lh: 1, mg: 1 };
const loadPrefs = (): Prefs => { try { return { ...DEF, ...JSON.parse(safeStorage.get(K_PREFS) ?? '{}') }; } catch { return DEF; } };
const SERIF = "Literata, 'Iowan Old Style', Georgia, 'Times New Roman', serif";
const SANS = "Inter, -apple-system, system-ui, 'Segoe UI', sans-serif";
// bg, text, muted, line, panel, accent
const THEMES: Record<Theme, { label: string; v: [string, string, string, string, string, string]; meta?: string }> = {
  white: { label: 'White', v: ['#FFFFFF', '#1C1C1C', '#6B6B6B', 'rgb(0 0 0 / 0.1)', '#F7F7F7', '#C2441F'], meta: '#FFFFFF' },
  sepia: { label: 'Sepia', v: ['#FBF0D9', '#5F4B32', '#8C7556', 'rgb(95 75 50 / 0.16)', '#F3E5C6', '#A0522D'], meta: '#FBF0D9' },
  black: { label: 'Black', v: ['#000000', '#CFCFCF', '#8A8A8A', 'rgb(255 255 255 / 0.12)', '#141414', '#D9A35B'], meta: '#000000' },
  app: { label: 'App', v: ['rgb(var(--bg))', 'rgb(var(--ink))', 'rgb(var(--ink3))', 'rgb(var(--line2))', 'rgb(var(--surface))', 'rgb(var(--accent))'] },
};
const FONT_HREF = 'https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,400;0,7..72,600;1,7..72,400&display=swap';
const loadFont = () => {
  if (document.getElementById('rfx-literata')) return;
  const l = document.createElement('link'); l.id = 'rfx-literata'; l.rel = 'stylesheet'; l.href = FONT_HREF; document.head.appendChild(l);
};

// ─── Book content ─────────────────────────────────────────────────────
interface Part { id: string; title: string }
const isZoom = (l: VideoLesson): l is ZoomSession => 'qa' in l;
const words = (s: string) => (s.match(/\S+/g) ?? []).length;
/** Narration chapter title -> reader part id (sections are whatever isn't a fixed title, in order). */
const FIXED: Record<string, string | null> = { Intro: 'title', 'The rules': 'rules', 'Mistakes to avoid': 'mistakes', 'In his words': 'quotes', 'On the charts': 'charts', 'Pre-trade countdown': 'checklist', 'Wrap-up': null, 'Live examples': 'examples', 'Student questions': 'qa' };
const audioMap = (rec: Recorded) => { let s = 0; return rec.c.map(([, t]) => (t in FIXED ? FIXED[t] : `s${s++}`)); };

function useBook(l: VideoLesson, source: string) {
  return useMemo(() => {
    const z = isZoom(l) ? l : null;
    const figs = (l.figures ?? []).map(f => ({ ...f, html: safeSvg(f.svg) })).filter(f => f.html);
    const imgs = l.images ?? [];
    const parts: Part[] = [{ id: 'title', title: 'Summary' }];
    l.sections.forEach((s, i) => parts.push({ id: `s${i}`, title: s.heading.replace(/^more from the (lesson|session)\s*:\s*/i, '') || `Part ${i + 1}` }));
    if (z?.examples.length) parts.push({ id: 'examples', title: 'Live examples' });
    if (z?.qa.length) parts.push({ id: 'qa', title: 'Student questions' });
    if (l.rules.length) parts.push({ id: 'rules', title: 'Rules' });
    if (l.mistakes.length) parts.push({ id: 'mistakes', title: 'Common mistakes' });
    if (l.quotes.length) parts.push({ id: 'quotes', title: 'Quotes' });
    if (l.checklist.length) parts.push({ id: 'checklist', title: 'Checklist' });
    if (imgs.length || figs.length) parts.push({ id: 'charts', title: parts.some(p => /^charts?$/i.test(p.title)) ? 'Chart images' : 'Charts' });
    if (l.newVsPdfs.length) parts.push({ id: 'diff', title: z ? 'New vs the recorded lessons' : source === 'seiden' || source === 'raja' || source === 'baker' ? "Different from Kevin's course" : 'Not in the PDFs' });
    const all = [l.summary, ...l.sections.flatMap(s => [s.heading, ...s.points]), ...l.rules, ...l.mistakes, ...l.quotes, ...l.checklist, ...imgs.flatMap(i => [i.caption, ...(i.notes ?? [])]), ...l.newVsPdfs, ...(z ? [...z.examples.flatMap(e => [e.setup, e.reasoning, e.outcome]), ...z.qa.flatMap(q => [q.q, q.a])] : [])];
    return { parts, figs, imgs, z, minutes: Math.max(1, Math.round(all.reduce((a, s) => a + words(s ?? ''), 0) / WPM)) };
  }, [l, source]);
}

// ─── Reader ───────────────────────────────────────────────────────────
interface Layout { W: number; pages: number; start: Record<string, number>; blocks: { page: number; words: number; ch: string }[] }

export default function Reader({ lesson: l, source, mentor, label, onClose }: { lesson: VideoLesson; source: string; mentor: string; label: string; onClose: () => void }) {
  const reduce = useReducedMotion();
  const key = `${source}:${l.n}`;
  const book = useBook(l, source);
  const [prefs, setPrefsS] = useState(loadPrefs);
  const prefsRef = useRef(prefs); prefsRef.current = prefs;
  const setPrefs = (p: Partial<Prefs>) => setPrefsS(o => { const n = { ...o, ...p }; safeStorage.set(K_PREFS, JSON.stringify(n)); return n; });
  const [page, setPage] = useState(0);
  const [lay, setLay] = useState<Layout | null>(null);
  const [chrome, setChrome] = useState(true);
  const [panel, setPanel] = useState<'none' | 'aa' | 'toc'>('none');
  const [lb, setLb] = useState<number | null>(null);
  const [rec, setRec] = useState<Recorded | null>(null);
  const [live, setLive] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null), vp = useRef<HTMLDivElement>(null), content = useRef<HTMLDivElement>(null);
  const layRef = useRef<Layout | null>(null), pageRef = useRef(0);
  const anchor = useRef<number>(-1);
  const saved = useRef<{ b: number; f: number } | null>((() => { try { return JSON.parse(safeStorage.get(K_POS + key) ?? 'null'); } catch { return null; } })());

  useEffect(() => { let on = true; recordedIndex().then(i => on && setRec(i[key] ?? null), () => {}); return () => { on = false; }; }, [key]);
  useEffect(() => { loadFont(); }, []);
  useDialogFocus(true, root, '[data-close]');
  useEffect(() => {
    const unlock = lockScroll(), h = document.documentElement.style, g = h.scrollbarGutter;
    h.scrollbarGutter = 'auto'; // the reserved gutter would show as a stripe beside the page
    return () => { h.scrollbarGutter = g; unlock(); };
  }, []);

  // Browser back closes the reader.
  const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    if (!history.state?.rfxReader) history.pushState({ ...(history.state ?? {}), rfxReader: 1 }, '');
    const pop = () => closeRef.current();
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const close = useCallback(() => { if (history.state?.rfxReader) history.back(); else closeRef.current(); }, []);

  // Status bar colour follows the page.
  useEffect(() => {
    const m = document.querySelector<HTMLMetaElement>('meta[name=theme-color]'), was = m?.content;
    const c = THEMES[prefs.theme].meta;
    if (m && c) m.content = c;
    return () => { if (m && was) m.content = was; };
  }, [prefs.theme]);

  // ── Layout: measure columns, map blocks and chapters to pages ──
  const measure = useCallback(() => {
    const v = vp.current, c = content.current;
    if (!v || !c) return;
    const m = MGS[prefsRef.current.mg], W = c.getBoundingClientRect().width;
    c.style.padding = `0 ${m}px`; c.style.columnGap = `${2 * m}px`; c.style.columnWidth = `${W - 2 * m}px`;
    c.style.setProperty('--ph', `${c.clientHeight}px`);
    const cr = c.getBoundingClientRect();
    const pg = (el: Element) => Math.max(0, Math.floor((el.getBoundingClientRect().left - cr.left + 1) / W));
    const end = c.querySelector('[data-end]');
    const pages = end ? pg(end) + 1 : 1;
    const start: Record<string, number> = {};
    c.querySelectorAll<HTMLElement>('section[data-ch]').forEach(s => { start[s.dataset.ch!] = pg(s.firstElementChild ?? s); });
    const blocks = Array.from(c.querySelectorAll<HTMLElement>('[data-blk]')).map(b => ({ page: pg(b), words: words(b.textContent ?? ''), ch: b.closest<HTMLElement>('section[data-ch]')?.dataset.ch ?? 'title' }));
    const L = { W, pages, start, blocks };
    layRef.current = L; setLay(L);
    // keep the reader's place: the anchored block, else the saved spot, else the fraction
    let p = pageRef.current;
    if (anchor.current >= 0 && blocks[anchor.current]) p = blocks[anchor.current].page;
    else if (saved.current) { const s = saved.current; p = blocks[s.b] ? blocks[s.b].page : Math.round(s.f * (pages - 1)); }
    p = Math.min(pages - 1, Math.max(0, p));
    pageRef.current = p; setPage(p); place(p, false);
    if (anchor.current < 0) anchor.current = anchorOf(p);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const anchorOf = (p: number) => {
    const b = layRef.current?.blocks ?? [];
    let a = b.findIndex(x => x.page === p);
    if (a < 0) for (let i = 0; i < b.length; i++) if (b[i].page < p) a = i;
    return Math.max(0, a);
  };
  const raf = useRef(0);
  const remeasure = useCallback(() => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(measure); }, [measure]);
  useLayoutEffect(() => { measure(); }, [measure, prefs.size, prefs.font, prefs.lh, prefs.mg]);
  useEffect(() => {
    const ro = new ResizeObserver(remeasure);
    if (vp.current) ro.observe(vp.current);
    document.fonts?.ready.then(remeasure);
    document.fonts?.addEventListener?.('loadingdone', remeasure);
    return () => { ro.disconnect(); document.fonts?.removeEventListener?.('loadingdone', remeasure); cancelAnimationFrame(raf.current); };
  }, [remeasure]);

  // ── Turning pages ──
  const place = (p: number, anim: boolean, dx = 0) => {
    const c = content.current, W = layRef.current?.W ?? c?.offsetWidth ?? 0;
    if (!c) return;
    c.style.transition = anim && !reduce ? `transform 380ms cubic-bezier(.23,1,.32,1)` : 'none';
    c.style.transform = `translate3d(${-p * W + dx}px,0,0)`;
  };
  const go = useCallback((p: number, anim = true) => {
    const L = layRef.current; if (!L) return;
    p = Math.min(L.pages - 1, Math.max(0, p));
    const moved = p !== pageRef.current;
    pageRef.current = p; setPage(p); place(p, anim);
    if (moved) {
      anchor.current = anchorOf(p);
      saved.current = { b: anchor.current, f: L.pages > 1 ? p / (L.pages - 1) : 0 };
      safeStorage.set(K_POS + key, JSON.stringify(saved.current));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, reduce]);
  const manual = useRef(0); // last time the reader turned a page by hand (narration won't fight it for a moment)
  const turn = useCallback((d: number) => { manual.current = Date.now(); go(pageRef.current + d); setChrome(false); setPanel('none'); }, [go]);

  // Chrome auto-hides after a moment.
  useEffect(() => { if (!chrome || panel !== 'none') return; const t = setTimeout(() => setChrome(false), 3200); return () => clearTimeout(t); }, [chrome, panel, page]);

  // Keys
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (lb !== null || e.metaKey || e.ctrlKey || e.altKey) return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT' && e.key !== 'Escape') return;
      if (e.key === 'Escape') { e.preventDefault(); if (panel !== 'none') setPanel('none'); else close(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !(e.target instanceof HTMLButtonElement))) { e.preventDefault(); turn(e.shiftKey && e.key === ' ' ? -1 : 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(-1); }
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(Infinity);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [lb, panel, close, turn, go]);

  // Touch / mouse: tap thirds, swipe, drag-follow.
  const drag = useRef<{ x: number; y: number; t: number; axis: '' | 'x' | 'y'; dx: number } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest('button,a,input')) return;
    drag.current = { x: e.clientX, y: e.clientY, t: performance.now(), axis: '', dx: 0 };
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (!d.axis && Math.hypot(dx, dy) > 8) d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (d.axis === 'x') {
      const L = layRef.current, p = pageRef.current;
      const edge = (p === 0 && dx > 0) || (L && p === L.pages - 1 && dx < 0);
      d.dx = edge ? dx * 0.25 : dx;
      if (!reduce) place(p, false, d.dx);
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const d = drag.current; drag.current = null; if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y, dt = performance.now() - d.t;
    const W = layRef.current?.W ?? 1;
    if (d.axis === 'x') {
      const fast = Math.abs(dx) / dt > 0.45 && Math.abs(dx) > 24;
      if (Math.abs(dx) > Math.min(90, W * 0.2) || fast) turn(dx < 0 ? 1 : -1);
      else place(pageRef.current, true);
      return;
    }
    if (d.axis || Math.hypot(dx, dy) > 8 || dt > 600) return;
    const img = (e.target as HTMLElement).closest<HTMLElement>('[data-img]');
    if (img) { setLb(Number(img.dataset.img)); return; }
    if (panel !== 'none') { setPanel('none'); return; }
    const r = vp.current!.getBoundingClientRect(), x = (e.clientX - r.left) / r.width;
    if (x < 1 / 3) turn(-1); else if (x > 2 / 3) turn(1); else setChrome(c => !c);
  };
  const wheelAt = useRef(0);
  const onWheel = (e: React.WheelEvent) => {
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 12 || performance.now() - wheelAt.current < 420) return;
    wheelAt.current = performance.now(); turn(d > 0 ? 1 : -1);
  };

  // ── Where are we ──
  const parts = book.parts.filter(p => !lay || p.id in lay.start);
  // the chapter of the first block on the page (what the reader is in, not what starts lower down)
  const curCh = useMemo(() => { if (!lay) return 'title'; let c = 'title'; for (const b of lay.blocks) { if (b.page > page) break; c = b.ch; if (b.page === page) break; } return c; }, [lay, page]);
  const pages = lay?.pages ?? 1;
  const minLeft = useMemo(() => {
    if (!lay) return 0;
    const w = lay.blocks.reduce((a, b) => a + (b.ch === curCh && b.page >= page ? b.words : 0), 0);
    return w / WPM;
  }, [lay, curCh, page]);
  const pct = Math.round(((page + 1) / pages) * 100);
  const curTitle = curCh === 'end' ? l.title : parts.find(p => p.id === curCh)?.title ?? '';

  // ── Immersion reading: follow the narration ──
  const pageRange = (id: string): [number, number] | null => {
    const L = layRef.current; if (!L || !(id in L.start)) return null;
    const s = L.start[id];
    const next = Object.values(L.start).filter(v => v > s);
    return [s, next.length ? Math.max(s, Math.min(...next) - 1) : L.pages - 1];
  };
  const lastAuto = useRef(-1);
  const follow = useCallback((id: string | null, frac: number, playing: boolean) => {
    setLive(playing ? id : null);
    if (!playing || !id) { lastAuto.current = -1; return; }
    const r = pageRange(id); if (!r) return;
    const target = Math.min(r[1], r[0] + Math.floor(frac * (r[1] - r[0] + 1)));
    if (target === lastAuto.current || Date.now() - manual.current < 6000) return;
    lastAuto.current = target;
    if (target !== pageRef.current) go(target);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [go]);

  // Live highlight on the section heading being read aloud.
  useEffect(() => {
    const c = content.current; if (!c) return;
    c.querySelectorAll('h2[data-live]').forEach(h => h.removeAttribute('data-live'));
    if (live) c.querySelector(`section[data-ch="${live}"] h2`)?.setAttribute('data-live', '');
  }, [live, lay]);

  const th = THEMES[prefs.theme].v;
  const m = MGS[prefs.mg];
  const vars = { '--rb': th[0], '--rt': th[1], '--rm': th[2], '--rl': th[3], '--rp': th[4], '--ra': th[5], '--rf': prefs.font === 'serif' ? SERIF : SANS, '--rsans': SANS, '--rs': `${SIZES[prefs.size]}px`, '--rlh': LHS[prefs.lh] } as CSSProperties;
  const shown = chrome || panel !== 'none';
  const lbImages = book.imgs.map(i => ({ src: i.src, name: i.caption }));

  return createPortal(
    <motion.div ref={root} role="dialog" aria-modal="true" aria-label={`Reading: ${l.title}`} lang="en"
      className="rd-root fixed inset-0 z-[85] overflow-hidden select-none" style={{ ...vars, height: '100dvh' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.22, ease }}>

      {/* Running head (Kindle shows the book title quietly up top) */}
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex items-end justify-center px-16 rd-mute text-[11.5px] font-medium tracking-wide"
        style={{ height: 'calc(env(safe-area-inset-top) + 40px)', paddingBottom: 10, fontFamily: SANS }}>
        <span className="truncate">{curTitle}</span>
      </div>

      {/* Page area */}
      <div ref={vp} className="absolute inset-x-0 flex justify-center touch-none"
        style={{ top: 'calc(env(safe-area-inset-top) + 44px)', bottom: 'calc(env(safe-area-inset-bottom) + 48px)', left: 'env(safe-area-inset-left)', right: 'env(safe-area-inset-right)', cursor: 'default' }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { drag.current = null; place(pageRef.current, true); }} onWheel={onWheel}>
        <div className="relative h-full overflow-hidden" style={{ width: `min(100%, ${600 + 2 * m}px)` }}>
          <div ref={content} className={cx('rd-book h-full transition-opacity duration-200', !lay && 'opacity-0')}
            style={{ width: '100%' }}>
            <Book l={l} book={book} label={label} mentor={mentor} onLoad={remeasure} onDone={close} />
          </div>
        </div>
      </div>

      {/* Footer: always on, like Kindle */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 px-4 rd-mute text-[11.5px] tabular-nums"
        style={{ height: 'calc(env(safe-area-inset-bottom) + 48px)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'max(16px, env(safe-area-inset-left))', paddingRight: 'max(16px, env(safe-area-inset-right))', fontFamily: SANS }}>
        <span className="min-w-0 flex-1 truncate" aria-live="polite">{!lay ? '' : curCh === 'end' ? 'End of chapter' : `${Math.max(1, Math.round(minLeft))} min left in chapter`}</span>
        {rec && <Narration k={key} rec={rec} lesson={l} mentor={mentor} source={source} curCh={curCh} onFollow={follow} pageFrac={() => { const r = pageRange(curCh); return r ? (pageRef.current - r[0]) / (r[1] - r[0] + 1) : 0; }} />}
        <span className="min-w-0 flex-1 truncate text-right">Page {page + 1} of {pages} · {pct}%</span>
      </div>

      {/* Chrome */}
      <AnimatePresence>
        {shown && (
          <motion.div key="top" className="rd-bar absolute inset-x-0 top-0 border-b" style={{ borderColor: 'var(--rl)', paddingTop: 'env(safe-area-inset-top)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)', fontFamily: SANS }}
            initial={{ opacity: 0, y: reduce ? 0 : -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -8 }} transition={{ duration: 0.2, ease }}>
            <div className="flex items-center gap-1 h-[52px] px-1.5">
              <button type="button" data-close className="rd-btn" onClick={close} aria-label="Close reader"><Glyph d={G.x} size={20} /></button>
              <div className="min-w-0 flex-1 px-1 text-center">
                <div className="text-[13.5px] font-semibold truncate">{l.title}</div>
                <div className="text-[11px] rd-mute truncate">{label} · {mentor}</div>
              </div>
              <button type="button" className="rd-btn" aria-label="Contents" aria-expanded={panel === 'toc'} onClick={() => setPanel(p => (p === 'toc' ? 'none' : 'toc'))}><Glyph d={G.list} size={20} /></button>
              <button type="button" className={cx('rd-btn !px-2 font-semibold', panel === 'aa' && 'bg-[color-mix(in_srgb,var(--rt)_10%,transparent)]')} aria-label="Reading settings" aria-expanded={panel === 'aa'} onClick={() => setPanel(p => (p === 'aa' ? 'none' : 'aa'))}>
                <span style={{ fontFamily: SERIF }} className="text-[15px] leading-none">A<span className="text-[20px]">a</span></span>
              </button>
            </div>
          </motion.div>
        )}
        {shown && pages > 1 && (
          <motion.div key="bottom" className="rd-bar absolute inset-x-0 border-t" style={{ borderColor: 'var(--rl)', bottom: 'calc(env(safe-area-inset-bottom) + 48px)', fontFamily: SANS }}
            initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : 8 }} transition={{ duration: 0.2, ease }}>
            <div className="mx-auto max-w-[720px] px-5 pt-2.5 pb-1.5">
              <div className="flex justify-between text-[11.5px] rd-mute"><span className="truncate pr-3">{curTitle}</span><span className="tabular-nums shrink-0">{pct}%</span></div>
              <input type="range" className="rd-range" min={0} max={pages - 1} step={1} value={page} aria-label="Page" aria-valuetext={`Page ${page + 1} of ${pages}`}
                style={{ '--fill': `${(page / Math.max(1, pages - 1)) * 100}%` } as CSSProperties}
                onChange={e => { manual.current = Date.now(); go(Number(e.target.value), false); }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panels */}
      <AnimatePresence>
        {panel !== 'none' && <motion.div key="scrim" className="absolute inset-0 bg-black/25" onClick={() => setPanel('none')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />}
        {panel === 'aa' && <AaPanel key="aa" prefs={prefs} set={setPrefs} reduce={!!reduce} />}
        {panel === 'toc' && (
          <TocPanel key="toc" title={l.title} label={label} parts={parts} start={lay?.start ?? {}} cur={curCh} live={live} reduce={!!reduce} onPick={id => { manual.current = Date.now(); go(lay?.start[id] ?? 0, false); setPanel('none'); setChrome(false); }} onClose={() => setPanel('none')} />
        )}
      </AnimatePresence>

      {lbImages.length > 0 && <Lightbox images={lbImages} index={lb} onClose={() => setLb(null)} />}
    </motion.div>,
    document.body,
  );
}

// ─── The chapter as a book ────────────────────────────────────────────
const Sec = ({ id, kicker, h, children, first }: { id: string; kicker?: string; h: string; children: ReactNode; first?: boolean }) => (
  <section data-ch={id} className={first ? 'rd-first' : undefined}>
    {kicker && <span className="rd-kicker">{kicker}</span>}
    <h2 data-blk="">{h}</h2>
    {children}
  </section>
);
/** Memoised: it only re-renders when the lesson changes, so page turns never touch the text. */
const Book = memo(function Book({ l, book, label, mentor, onLoad, onDone }: { l: VideoLesson; book: ReturnType<typeof useBook>; label: string; mentor: string; onLoad: () => void; onDone: () => void }) {
  const { parts, figs, imgs, z, minutes } = book;
  const title = (id: string) => parts.find(p => p.id === id)?.title ?? '';
  return (
    <>
      <section data-ch="title" className="rd-title">
        <span className="rd-kicker" data-blk="">{label} · {mentor}</span>
        <h1>{l.title}</h1>
        <span className="rd-orn" aria-hidden="true" />
        <p className="rd-sum" data-blk="">{l.summary}</p>
        <p className="rd-meta">About {minutes} min read · {parts.length - 1} parts</p>
      </section>
      {l.sections.map((s, i) => (
        <Sec key={i} id={`s${i}`} h={title(`s${i}`)} first={i === 0}>
          {s.points.map((p, k) => <p key={k} data-blk="">{p}</p>)}
        </Sec>
      ))}
      {z && z.examples.length > 0 && (
        <Sec id="examples" h="Charts he walked through">
          {z.examples.map((e, k) => (
            <div key={k} className="rd-ex" data-blk="">
              {(e.market || e.timeframe) && <b>{[e.market, e.timeframe].filter(Boolean).join(' · ')}</b>}
              {e.setup && <p className="rd-noindent">{e.setup}</p>}
              {e.reasoning && <p><i>Why:</i> {e.reasoning}</p>}
              {e.outcome && <p><i>Result:</i> {e.outcome}</p>}
            </div>
          ))}
        </Sec>
      )}
      {z && z.qa.length > 0 && (
        <Sec id="qa" h="Student questions">
          {z.qa.map((x, k) => <div key={k}><p className="rd-q" data-blk="">{x.q}</p><p className="rd-noindent" data-blk="">{x.a}</p></div>)}
        </Sec>
      )}
      {l.rules.length > 0 && <Sec id="rules" kicker="Remember" h="Rules"><ol className="rd-num">{l.rules.map((r, k) => <li key={k} data-blk="">{r}</li>)}</ol></Sec>}
      {l.mistakes.length > 0 && <Sec id="mistakes" kicker="Avoid" h="Common mistakes"><ul className="rd-dash">{l.mistakes.map((r, k) => <li key={k} data-blk="">{r}</li>)}</ul></Sec>}
      {l.quotes.length > 0 && <Sec id="quotes" kicker="In his words" h="Quotes">{l.quotes.map((q, k) => <blockquote key={k} data-blk="">{q}</blockquote>)}</Sec>}
      {l.checklist.length > 0 && <Sec id="checklist" kicker="Before you trade" h="Checklist"><ul className="rd-box">{l.checklist.map((r, k) => <li key={k} data-blk="">{r}</li>)}</ul></Sec>}
      {(imgs.length > 0 || figs.length > 0) && (
        <Sec id="charts" h={title('charts')}>
          {imgs.map((im, k) => (
            <div key={'i' + k}>
              <figure data-blk="" data-img={k}>
                <img src={im.src} alt={im.caption} decoding="async" draggable={false} onLoad={onLoad} />
                <figcaption>{im.caption}</figcaption>
              </figure>
              {im.notes && im.notes.length > 0 && <ul className="rd-dash">{im.notes.map((n, i) => <li key={i} data-blk="">{n}</li>)}</ul>}
            </div>
          ))}
          {figs.map((f, k) => (
            <figure key={'f' + k} data-blk="">
              <div className="rd-plate" role="img" aria-label={f.caption} dangerouslySetInnerHTML={{ __html: f.html! }} />
              <figcaption>{f.caption}</figcaption>
            </figure>
          ))}
        </Sec>
      )}
      {l.newVsPdfs.length > 0 && <Sec id="diff" h={title('diff')}><ul className="rd-dash">{l.newVsPdfs.map((r, k) => <li key={k} data-blk="">{r}</li>)}</ul></Sec>}
      <section data-ch="end" className="rd-end">
        <span className="rd-orn" aria-hidden="true" />
        <p className="rd-kicker" data-blk="">End of {label}</p>
        <p className="rd-endtitle">{l.title}</p>
        <button type="button" className="rd-done" onClick={onDone}>Done reading</button>
        <span data-end="" />
      </section>
    </>
  );
});

// ─── Narration pill (immersion reading) ───────────────────────────────
function Narration({ k, rec, lesson, mentor, source, curCh, onFollow, pageFrac }: { k: string; rec: Recorded; lesson: VideoLesson; mentor: string; source: string; curCh: string; onFollow: (id: string | null, frac: number, playing: boolean) => void; pageFrac: () => number }) {
  const a = useRecordedAudio(k, rec, { title: lesson.title, artist: `${mentor} · RamanFX`, album: source === 'seiden' ? 'Sam Seiden' : mentor });
  const map = useMemo(() => audioMap(rec), [rec]);
  const [c0, c1] = [a.chapters[a.ch]?.[0] ?? 0, a.chapters[a.ch + 1]?.[0] ?? a.dur];
  const frac = Math.min(1, Math.max(0, (a.t - c0) / Math.max(1, c1 - c0)));
  useEffect(() => { onFollow(map[a.ch] ?? null, frac, a.playing); }, [map, a.ch, frac, a.playing, onFollow]);
  useEffect(() => () => onFollow(null, 0, false), [onFollow]);
  const press = () => {
    if (!a.playing) {
      // start the narration where the reader is, unless it's already in this part
      const i = map.indexOf(curCh);
      if (i >= 0 && map[a.ch] !== curCh) {
        const s = a.chapters[i][0], e = a.chapters[i + 1]?.[0] ?? a.dur;
        a.seek(s + Math.max(0, pageFrac()) * (e - s), true);
        return;
      }
    }
    a.toggle();
  };
  return (
    <div className="shrink-0 flex flex-col items-center">
      <button type="button" onClick={press} aria-label={a.playing ? 'Pause narration' : 'Read to me'} aria-pressed={a.playing}
        className="h-11 inline-flex items-center gap-1.5 rounded-full px-3.5 text-[12px] font-semibold border transition-colors"
        style={{ borderColor: 'var(--rl)', color: a.playing ? 'var(--ra)' : 'var(--rt)', background: a.playing ? 'color-mix(in srgb, var(--ra) 12%, transparent)' : 'transparent' }}>
        <span className="relative grid place-items-center">
          <Glyph d={a.playing ? G.pause : G.play} size={13} fill />
          {a.loading && <span aria-hidden="true" className="absolute -inset-1.5 rounded-full border-2 border-transparent border-t-current animate-spin" />}
        </span>
        {a.playing ? <Eq playing /> : <span>Listen</span>}
      </button>
      {a.err && <span role="alert" className="sr-only">{a.err}</span>}
    </div>
  );
}

// ─── Panels ───────────────────────────────────────────────────────────
function Seg<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { value: T; label: ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="rd-seg">
      {options.map(o => <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>)}
    </div>
  );
}
const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-2"><div className="text-[11px] font-semibold uppercase tracking-[0.1em] rd-mute">{label}</div>{children}</div>
);
const lines = (n: number) => <svg width="20" height="16" viewBox="0 0 20 16" aria-hidden="true" className="mx-auto">{[0, 1, 2].map(i => <rect key={i} x="2" y={2 + i * (3 + n * 1.6)} width="16" height="1.6" rx=".8" fill="currentColor" />)}</svg>;
const marg = (n: number) => <svg width="22" height="16" viewBox="0 0 22 16" aria-hidden="true" className="mx-auto"><rect x=".75" y=".75" width="20.5" height="14.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" /><rect x={3 + n * 2} y="5" width={16 - n * 4} height="1.4" rx=".7" fill="currentColor" /><rect x={3 + n * 2} y="8.3" width={16 - n * 4} height="1.4" rx=".7" fill="currentColor" /></svg>;

function AaPanel({ prefs, set, reduce }: { prefs: Prefs; set: (p: Partial<Prefs>) => void; reduce: boolean }) {
  return (
    <motion.div role="group" aria-label="Reading settings"
      className="rd-panel absolute z-10 flex flex-col gap-4 p-4 max-sm:inset-x-0 max-sm:bottom-0 max-sm:rounded-t-[22px] max-sm:border-x-0 max-sm:border-b-0 sm:right-3 sm:top-[calc(env(safe-area-inset-top)+60px)] sm:w-[360px] sm:rounded-2xl"
      style={{ fontFamily: SANS, paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.26, ease }}>
      <span aria-hidden="true" className="sm:hidden mx-auto -mt-1.5 h-1 w-9 rounded-full" style={{ background: 'var(--rl)' }} />
      <Row label="Theme">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-4 gap-2">
          {(Object.keys(THEMES) as Theme[]).map(t => {
            const v = THEMES[t].v, on = prefs.theme === t;
            return (
              <button key={t} type="button" role="radio" aria-checked={on} onClick={() => set({ theme: t })} className="flex flex-col items-center gap-1.5 min-h-[44px] rounded-xl py-1 focus-visible:outline-2" style={{ outlineColor: 'var(--ra)' }}>
                <span className="h-11 w-full rounded-xl grid place-items-center text-[17px] font-semibold transition-shadow"
                  style={{ background: t === 'app' ? 'linear-gradient(135deg, rgb(var(--bg)) 50%, rgb(var(--surface)) 50%)' : v[0], color: v[1], fontFamily: SERIF, boxShadow: on ? '0 0 0 2px var(--ra)' : 'inset 0 0 0 1px var(--rl)' }}>Aa</span>
                <span className={cx('text-[11.5px]', on ? 'font-semibold' : 'rd-mute')}>{THEMES[t].label}</span>
              </button>
            );
          })}
        </div>
      </Row>
      <Row label="Text size">
        <div className="flex items-center gap-3">
          <button type="button" className="rd-btn shrink-0" aria-label="Smaller text" onClick={() => set({ size: Math.max(0, prefs.size - 1) })} style={{ fontFamily: SERIF }}><span className="text-[14px]">A</span></button>
          <input type="range" className="rd-range" min={0} max={SIZES.length - 1} step={1} value={prefs.size} aria-label="Text size" aria-valuetext={`${SIZES[prefs.size]} pixels`}
            style={{ '--fill': `${(prefs.size / (SIZES.length - 1)) * 100}%` } as CSSProperties} onChange={e => set({ size: Number(e.target.value) })} />
          <button type="button" className="rd-btn shrink-0" aria-label="Larger text" onClick={() => set({ size: Math.min(SIZES.length - 1, prefs.size + 1) })} style={{ fontFamily: SERIF }}><span className="text-[22px]">A</span></button>
        </div>
      </Row>
      <Row label="Font">
        <Seg label="Font" value={prefs.font} onChange={v => set({ font: v })} options={[{ value: 'serif', label: <span style={{ fontFamily: SERIF }} className="text-[15px]">Literata</span> }, { value: 'sans', label: <span style={{ fontFamily: SANS }} className="text-[14px]">Sans</span> }]} />
      </Row>
      <div className="grid grid-cols-2 gap-3">
        <Row label="Spacing"><Seg label="Line spacing" value={prefs.lh} onChange={v => set({ lh: v })} options={LHS.map((_, i) => ({ value: i, label: lines(i) }))} /></Row>
        <Row label="Margins"><Seg label="Margins" value={prefs.mg} onChange={v => set({ mg: v })} options={MGS.map((_, i) => ({ value: i, label: marg(i) }))} /></Row>
      </div>
    </motion.div>
  );
}

function TocPanel({ title, label, parts, start, cur, live, reduce, onPick, onClose }: { title: string; label: string; parts: Part[]; start: Record<string, number>; cur: string; live: string | null; reduce: boolean; onPick: (id: string) => void; onClose: () => void }) {
  return (
    <motion.nav aria-label="Contents" className="rd-panel absolute z-10 inset-y-0 left-0 w-[min(88vw,380px)] flex flex-col border-y-0 border-l-0"
      style={{ fontFamily: SANS, paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)' }}
      initial={reduce ? { opacity: 0 } : { x: '-100%' }} animate={reduce ? { opacity: 1 } : { x: 0 }} exit={reduce ? { opacity: 0 } : { x: '-100%' }} transition={{ duration: 0.3, ease }}>
      <div className="flex items-start gap-2 px-5 pt-4 pb-3 border-b" style={{ borderColor: 'var(--rl)' }}>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] rd-mute">Contents · {label}</div>
          <div className="text-[17px] font-semibold leading-snug mt-1" style={{ fontFamily: SERIF }}>{title}</div>
        </div>
        <button type="button" className="rd-btn -mr-2 -mt-1.5" onClick={onClose} aria-label="Close contents"><Glyph d={G.x} size={18} /></button>
      </div>
      <ol className="flex-1 overflow-y-auto overscroll-contain py-2">
        {parts.map((p, i) => {
          const on = p.id === cur;
          return (
            <li key={p.id}>
              <button type="button" onClick={() => onPick(p.id)} aria-current={on ? 'true' : undefined}
                className="relative w-full min-h-[48px] flex items-center gap-3 px-5 py-2.5 text-left transition-colors hover:bg-[color-mix(in_srgb,var(--rt)_6%,transparent)]"
                style={on ? { background: 'color-mix(in srgb, var(--ra) 12%, transparent)' } : undefined}>
                {on && <span aria-hidden="true" className="absolute left-0 inset-y-2 w-[3px] rounded-r-full" style={{ background: 'var(--ra)' }} />}
                <span className={cx('min-w-0 flex-1 text-[14.5px] leading-snug', on ? 'font-semibold' : '', i > 0 && i <= 99 && '')} style={{ fontFamily: SERIF }}>{p.title}</span>
                {live === p.id && <Eq playing />}
                <span className="text-[12px] rd-mute tabular-nums shrink-0">{(start[p.id] ?? 0) + 1}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </motion.nav>
  );
}
