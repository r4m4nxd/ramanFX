import { motion } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

/** Edge-to-edge portrait chart over the whole app, like the TradingView phone app. */
export function TvFullscreen({ title, onClose, controls, children }: { title: ReactNode; onClose: () => void; controls?: ReactNode; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [onClose]);
  return createPortal(
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }}
      className="fixed inset-0 z-[90] bg-surface flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)]">
      <div className="flex items-center gap-2 h-12 px-2 border-b border-line shrink-0">
        <button className="btn-ghost h-10 w-10 px-0" aria-label="Close chart" onClick={onClose}><Icon name="chevronLeft" size={18} /></button>
        <div className="font-mono font-semibold text-[15px] truncate">{title}</div>
        <div className="ml-auto flex items-center gap-2 min-w-0">{controls}</div>
      </div>
      <div className="flex-1 min-h-0 relative">{children}</div>
    </motion.div>,
    document.body,
  );
}
