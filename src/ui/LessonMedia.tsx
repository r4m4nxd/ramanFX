// Lesson media: hand-drawn SVG teaching figures and real chart images (with a zoomable lightbox).
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Card, cx, useDialogFocus, useScrollLock } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

type Figure = { svg: string; caption: string };
type Img = { src: string; caption: string; notes?: string[] };

/** Accept only plain, self-contained SVG markup. Anything scriptable or remote is dropped. */
export function safeSvg(markup: string): string | null {
  const s = markup.trim();
  if (!/^<svg[\s>]/i.test(s) || !/<\/svg>\s*$/i.test(s)) return null;
  if (/<script/i.test(s)) return null;
  if (/\son[a-z]+\s*=/i.test(s)) return null;
  if (/foreignObject/i.test(s)) return null;
  if (/href\s*=\s*["']?\s*(https?:|javascript:|data:|\/\/)/i.test(s)) return null;
  if (/<(iframe|embed|object|use|image|style)\b/i.test(s)) return null;
  return s;
}

export function LessonFigures({ figures }: { figures: Figure[] }) {
  const ok = figures.map(f => ({ ...f, html: safeSvg(f.svg) })).filter((f): f is Figure & { html: string } => !!f.html);
  if (!ok.length) return null;
  return (
    <div className={cx('grid gap-3', ok.length > 1 && 'md:grid-cols-2')}>
      {ok.map((f, k) => (
        <Card key={k} as="div" className="p-3">
          <figure>
            <div className="rounded-lg bg-bg/60 ring-1 ring-line overflow-hidden [&>svg]:block [&>svg]:w-full [&>svg]:h-auto" role="img" aria-label={f.caption} dangerouslySetInnerHTML={{ __html: f.html }} />
            <figcaption className="text-[12.5px] text-ink2 mt-2.5 leading-snug">{f.caption}</figcaption>
          </figure>
        </Card>
      ))}
    </div>
  );
}

export function RealCharts({ images }: { images: Img[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;
  return (
    <Card>
      <div className="flex items-baseline justify-between mb-3"><div className="label">Real charts</div><span className="text-[12px] text-ink3">{images.length} chart{images.length > 1 ? 's' : ''} · tap to zoom</span></div>
      <div className={cx('grid gap-4', images.length > 1 && 'sm:grid-cols-2')}>
        {images.map((im, k) => (
          <figure key={im.src + k} className="flex flex-col gap-2 min-w-0">
            <button type="button" onClick={() => setOpen(k)} aria-label={`Open chart ${k + 1}: ${im.caption}`}
              className="group relative block rounded-xl overflow-hidden ring-1 ring-line bg-raised/40 focus-visible:ring-2 focus-visible:ring-accent outline-none">
              <img src={im.src} alt={im.caption} loading="lazy" decoding="async" className="w-full h-auto max-h-[340px] object-contain transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none" />
              <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-black/55 text-white text-[11px] px-2 py-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"><Icon name="search" size={12} />Zoom</span>
            </button>
            <figcaption className="text-[13px] text-ink leading-snug">{im.caption}</figcaption>
            {im.notes && im.notes.length > 0 && (
              <ul className="flex flex-col gap-1.5">
                {im.notes.map((n, i) => <li key={i} className="flex gap-2 text-[12.5px] leading-relaxed text-ink2"><span className="mt-[7px] w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />{n}</li>)}
              </ul>
            )}
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </Card>
  );
}

const ZMIN = 1, ZMAX = 5;
const LB = 'grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white';
function Lightbox({ images, index, onIndex, onClose }: { images: Img[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollLock(true);
  useDialogFocus(true, ref, '[data-lb-close]');
  const [z, setZ] = useState(1);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number; moved: boolean } | null>(null);
  const im = images[index];
  const many = images.length > 1;
  const zoom = useCallback((f: number) => setZ(v => { const n = Math.min(ZMAX, Math.max(ZMIN, +(v * f).toFixed(2))); if (n === 1) setOff({ x: 0, y: 0 }); return n; }), []);
  const go = useCallback((d: number) => { onIndex((index + d + images.length) % images.length); }, [index, images.length, onIndex]);
  useEffect(() => { setZ(1); setOff({ x: 0, y: 0 }); }, [index]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && many) go(1);
      else if (e.key === 'ArrowLeft' && many) go(-1);
      else if (e.key === '+' || e.key === '=') zoom(1.4);
      else if (e.key === '-') zoom(1 / 1.4);
      else if (e.key === '0') { setZ(1); setOff({ x: 0, y: 0 }); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, go, zoom, many]);
  return createPortal(
    <div ref={ref} className="fixed inset-0 z-[60] flex flex-col bg-black/85 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Chart ${index + 1} of ${images.length}`}>
      <div className="flex items-center gap-2 px-3 sm:px-4 h-14 shrink-0 text-white">
        <span className="num text-[12px] text-white/70">{index + 1} / {images.length}</span>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" className={LB} onClick={() => zoom(1 / 1.4)} aria-label="Zoom out" disabled={z <= ZMIN}><Icon name="minus" size={16} /></button>
          <span className="num text-[12px] w-12 text-center text-white/80">{Math.round(z * 100)}%</span>
          <button type="button" className={LB} onClick={() => zoom(1.4)} aria-label="Zoom in" disabled={z >= ZMAX}><Icon name="plus" size={16} /></button>
          <button type="button" className={LB} onClick={onClose} aria-label="Close" data-lb-close><Icon name="x" size={16} /></button>
        </div>
      </div>
      <div className="relative flex-1 min-h-0 overflow-hidden touch-none select-none"
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        onWheel={e => zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15)}>
        <img src={im.src} alt={im.caption} draggable={false}
          className={cx('absolute inset-0 m-auto max-w-[calc(100%-2rem)] max-h-[calc(100%-1rem)] object-contain', z > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in')}
          style={{ transform: `translate(${off.x}px, ${off.y}px) scale(${z})`, transition: drag.current ? 'none' : 'transform 160ms ease-out' }}
          onPointerDown={e => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, ox: off.x, oy: off.y, moved: false }; }}
          onPointerMove={e => { const d = drag.current; if (!d) return; const dx = e.clientX - d.x, dy = e.clientY - d.y; if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true; if (z > 1) setOff({ x: d.ox + dx, y: d.oy + dy }); }}
          onPointerUp={() => { const d = drag.current; drag.current = null; if (d && !d.moved) { if (z > 1) { setZ(1); setOff({ x: 0, y: 0 }); } else setZ(2.5); } }}
          onPointerCancel={() => { drag.current = null; }} />
        {many && <>
          <button type="button" className={cx(LB, 'absolute left-2 top-1/2 -translate-y-1/2')} onClick={() => go(-1)} aria-label="Previous chart"><Icon name="chevronLeft" size={18} /></button>
          <button type="button" className={cx(LB, 'absolute right-2 top-1/2 -translate-y-1/2')} onClick={() => go(1)} aria-label="Next chart"><Icon name="chevronRight" size={18} /></button>
        </>}
      </div>
      <div className="shrink-0 px-4 py-3 text-white/90 text-[13px] leading-snug max-w-[90ch] mx-auto w-full pb-safe">{im.caption}</div>
    </div>,
    document.body,
  );
}
