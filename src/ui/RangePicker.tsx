import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/data/store';
import { dayKey } from '@/core/time';
import { Icon } from './Icon';
import { cx } from './kit';

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

export function RangePicker() {
  const range = useStore(s => s.range), setRange = useStore(s => s.setRange);
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState(range.from ?? '');
  const [to, setTo] = useState(range.to ?? '');
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <div className="relative" ref={ref}>
      <button className={cx('btn h-9 whitespace-nowrap', range.from || range.to ? 'border-accent/50 text-accent' : '')} onClick={() => setOpen(v => !v)} aria-expanded={open}>
        <Icon name="calendar" size={14} />{range.label}<Icon name="chevronDown" size={14} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }}
            className="absolute z-50 mt-2 right-0 max-md:left-0 max-md:right-auto w-[280px] card shadow-pop p-2">
            <div className="grid grid-cols-2 gap-1">
              {presets().map(p => (
                <button key={p.label} className={cx('h-8 px-2.5 rounded-lg text-[13px] text-left', range.label === p.label ? 'bg-accent/15 text-accent font-medium' : 'hover:bg-raised text-ink2')}
                  onClick={() => { setRange(p); setOpen(false); }}>{p.label}</button>
              ))}
            </div>
            <div className="border-t border-line mt-2 pt-2.5 px-1 flex flex-col gap-2">
              <div className="label">Custom</div>
              <div className="flex gap-2">
                <input type="date" aria-label="From" className="field h-8 text-xs" value={from} onChange={e => setFrom(e.target.value)} />
                <input type="date" aria-label="To" className="field h-8 text-xs" value={to} onChange={e => setTo(e.target.value)} />
              </div>
              <button className="btn-primary h-8" disabled={!from && !to} onClick={() => { setRange({ from: from || null, to: to || null, label: `${from || '…'} → ${to || '…'}` }); setOpen(false); }}>Apply</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
