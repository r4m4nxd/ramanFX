import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Icon } from './Icon';
import { cx } from './kit';

/** Chip input with suggestions from tags used elsewhere. Lowercases for consistent grouping. */
export function TagInput({ value, onChange, universe, tone = 'accent', placeholder, label }: { value: string[]; onChange: (v: string[]) => void; universe: string[]; tone?: 'accent' | 'warn' | 'violet'; placeholder: string; label: string }) {
  const [q, setQ] = useState('');
  const [focus, setFocus] = useState(false);
  const sugg = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return universe.filter(u => !value.includes(u) && (!ql || u.includes(ql))).slice(0, 8);
  }, [q, universe, value]);
  const add = (t: string) => { const v = t.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim(); if (v && !value.includes(v)) onChange([...value, v]); setQ(''); };
  const chip = { accent: 'bg-accent/12 text-accent border-accent/35', warn: 'bg-warn/12 text-warn border-warn/35', violet: 'bg-violet/12 text-violet border-violet/35' }[tone];
  return (
    <div className="relative">
      <div className="flex flex-wrap gap-1.5 items-center min-h-[38px] p-1.5 rounded-lg border border-line2 bg-bg focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20">
        <AnimatePresence initial={false}>
          {value.map(t => (
            <motion.span key={t} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className={cx('inline-flex items-center gap-1 h-7 pl-2.5 pr-1 rounded-full border text-xs font-medium', chip)}>
              {t}
              <button type="button" aria-label={`Remove ${t}`} className="w-5 h-5 grid place-items-center rounded-full hover:bg-black/20" onClick={() => onChange(value.filter(x => x !== t))}><Icon name="x" size={11} /></button>
            </motion.span>
          ))}
        </AnimatePresence>
        <input aria-label={label} value={q} placeholder={value.length ? '' : placeholder} onChange={e => setQ(e.target.value)} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 120)}
          onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && q.trim()) { e.preventDefault(); add(q); } if (e.key === 'Backspace' && !q && value.length) onChange(value.slice(0, -1)); }}
          className="flex-1 min-w-[100px] h-7 bg-transparent border-0 px-1.5 text-sm focus:ring-0" />
      </div>
      <AnimatePresence>
        {focus && (sugg.length > 0 || q.trim()) && (
          <motion.ul initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-30 mt-1 w-full card shadow-pop p-1 max-h-56 overflow-y-auto">
            {q.trim() && !universe.includes(q.trim().toLowerCase()) && <li><button type="button" className="w-full text-left px-2.5 h-8 rounded-md text-sm hover:bg-raised" onMouseDown={() => add(q)}>Add “{q.trim().toLowerCase()}”</button></li>}
            {sugg.map(s => <li key={s}><button type="button" className="w-full text-left px-2.5 h-8 rounded-md text-sm hover:bg-raised text-ink2" onMouseDown={() => add(s)}>{s}</button></li>)}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
