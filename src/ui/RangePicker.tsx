import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/data/store';
import { dayKey } from '@/core/time';
import { Icon } from './Icon';
import { cx, Sheet, useIsMobile } from './kit';

function presets() {
  const now = new Date();
  const d = (off: number) => { const x = new Date(now); x.setDate(x.getDate() - off); return dayKey(x); };
  const monday = new Date(now); monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const m0 = new Date(now.getFullYear(), now.getMonth(), 1);
  const pm0 = new Date(now.getFullYear(), now.getMonth() - 1, 1), pm1 = new Date(now.getFullYear(), now.getMonth(), 0);
  return [
    { label: 'All time', from: null, to: null },
    { label: 'Today', from: d(0), to: d(0) },
    { label: 'This week', from: dayKey(monday), to: d(0) },
    { label: 'This month', from: dayKey(m0), to: d(0) },
    { label: 'Last month', from: dayKey(pm0), to: dayKey(pm1) },
    { label: 'Last 30 days', from: d(29), to: d(0) },
    { label: 'Last 90 days', from: d(89), to: d(0) },
    { label: 'Year to date', from: `${now.getFullYear()}-01-01`, to: d(0) },
  ];
}

export function RangePicker({ className }: { className?: string }) {
  const range = useStore(s => s.range), setRange = useStore(s => s.setRange);
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(range.from ?? '');
  const [to, setTo] = useState(range.to ?? '');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || mobile) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open, mobile]);
  const body = (
    <>
      <div className={cx('grid grid-cols-2', mobile ? 'gap-2' : 'gap-1')}>
        {presets().map(p => (
          <button key={p.label} className={cx('px-3 rounded-lg text-left', mobile ? 'h-11 text-[14px] border' : 'h-8 text-[13px]', range.label === p.label ? 'bg-accent/15 text-accent font-medium border-accent/40' : 'hover:bg-raised text-ink2 border-line')}
            onClick={() => { setRange(p); setOpen(false); }}>{p.label}</button>
        ))}
      </div>
      <div className={cx('border-t border-line flex flex-col gap-2', mobile ? 'mt-4 pt-4' : 'mt-2 pt-2.5 px-1')}>
        <div className="label">Custom range</div>
        <div className="grid grid-cols-2 gap-2">
          <input type="date" aria-label="From" className={cx('field', mobile ? 'h-11' : 'h-8 text-xs')} value={from} onChange={e => setFrom(e.target.value)} />
          <input type="date" aria-label="To" className={cx('field', mobile ? 'h-11' : 'h-8 text-xs')} value={to} onChange={e => setTo(e.target.value)} />
        </div>
        <button className={cx('btn-primary', mobile ? 'h-11' : 'h-8')} disabled={!from && !to} onClick={() => { setRange({ from: from || null, to: to || null, label: `${from || '…'} → ${to || '…'}` }); setOpen(false); }}>Apply</button>
      </div>
    </>
  );
  return (
    <div className={cx('relative min-w-0', className)} ref={ref}>
      <button className={cx('btn h-9 w-full min-w-0', range.from || range.to ? 'border-accent/50 text-accent' : '')} onClick={() => setOpen(v => !v)} aria-expanded={open} aria-haspopup="dialog">
        <Icon name="calendar" size={14} className="shrink-0" /><span className="truncate">{range.label}</span><Icon name="chevronDown" size={14} className="shrink-0 ml-auto md:ml-0" />
      </button>
      {mobile ? <Sheet open={open} onClose={() => setOpen(false)} title="Date range">{body}</Sheet> : (
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }}
              className="absolute z-50 mt-2 right-0 w-[290px] card shadow-pop p-2">
              {body}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
