import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { spring } from './kit';

export interface LightboxImage { src: string; name?: string }

/**
 * Full-screen image viewer, portalled to <body> so it's always centred on the visible screen —
 * never inside a scrolled or animated page. Swipe or arrow keys to page, tap the image to zoom,
 * tap outside or Esc to close.
 */
export function Lightbox({ images, index, onClose }: { images: LightboxImage[]; index: number | null; onClose: () => void }) {
  const [i, setI] = useState(index ?? 0);
  const [dir, setDir] = useState(0);
  const [zoom, setZoom] = useState(false);
  useEffect(() => { if (index != null) { setI(index); setZoom(false); } }, [index]);
  const open = index != null && images.length > 0;
  const go = useCallback((d: number) => { if (images.length < 2) return; setDir(d); setZoom(false); setI(x => (x + d + images.length) % images.length); }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); };
    window.addEventListener('keydown', k);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = overflow; };
  }, [open, go, onClose]);

  const img = images[Math.min(i, images.length - 1)];
  return createPortal(
    <AnimatePresence>
      {open && img && (
        <motion.div key="lb" role="dialog" aria-modal="true" aria-label={img.name ?? 'Image'}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          style={{ height: '100dvh', padding: 'max(16px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
          <AnimatePresence initial={false} custom={dir} mode="popLayout">
            <motion.img key={img.src} src={img.src} alt={img.name ?? ''} draggable={false} custom={dir}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl select-none touch-pan-y"
              style={{ cursor: zoom ? 'zoom-out' : 'zoom-in' }}
              variants={{ enter: (d: number) => ({ opacity: 0, x: d * 60, scale: 0.94 }), show: { opacity: 1, x: 0, scale: zoom ? 2 : 1 }, leave: (d: number) => ({ opacity: 0, x: d * -60, scale: 0.94 }) }}
              initial="enter" animate="show" exit="leave" transition={spring}
              drag={zoom ? true : images.length > 1 ? 'x' : false} dragSnapToOrigin={!zoom} dragElastic={0.25}
              onDragEnd={(_, info) => { if (!zoom && Math.abs(info.offset.x) > 70) go(info.offset.x < 0 ? 1 : -1); }}
              onClick={e => { e.stopPropagation(); setZoom(z => !z); }} />
          </AnimatePresence>

          <button className="absolute w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center" style={{ top: 'max(12px, env(safe-area-inset-top))', right: 'max(12px, env(safe-area-inset-right))' }}
            onClick={e => { e.stopPropagation(); onClose(); }} aria-label="Close"><Icon name="x" size={18} /></button>
          {images.length > 1 && (<>
            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center max-md:hidden" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Previous image"><Icon name="chevronLeft" /></button>
            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white grid place-items-center max-md:hidden" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Next image"><Icon name="chevronRight" /></button>
            <div className="absolute left-1/2 -translate-x-1/2 flex gap-1.5" style={{ bottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              {images.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out ${k === i ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />)}
            </div>
          </>)}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
