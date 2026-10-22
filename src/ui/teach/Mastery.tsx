// Mastery ring and summaries. Mastery blends steps seen, best quiz score, practice solved and flashcards learned.
import { motion, useReducedMotion } from 'framer-motion';
import { cx, ease } from '@/ui/kit';
import { masteryParts } from './store';

export function MasteryRing({ value, size = 22, stroke = 2.5, label, className, showText = false }: { value: number; size?: number; stroke?: number; label?: string; className?: string; showText?: boolean }) {
  const reduce = useReducedMotion();
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, v = Math.max(0, Math.min(1, value));
  const tone = v >= 0.9 ? 'stroke-profit' : v > 0 ? 'stroke-accent' : 'stroke-line2';
  return (
    <span className={cx('relative inline-grid place-items-center shrink-0', className)} style={{ width: size, height: size }} role="img" aria-label={label ?? `Mastery ${Math.round(v * 100)}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} className="fill-none stroke-line" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} className={cx('fill-none', tone)} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c}
          initial={reduce ? false : { strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - v) }} transition={{ duration: reduce ? 0 : 0.7, ease }} />
      </svg>
      {showText && <span className="absolute num font-semibold" style={{ fontSize: size * 0.26 }} aria-hidden="true">{Math.round(v * 100)}%</span>}
    </span>
  );
}

/** Breakdown shown in the lesson's "Learn it" header. */
export function MasteryBreakdown({ k, value }: { k: string; value: number }) {
  const p = masteryParts(k), t = p.totals;
  const rows = [
    { label: 'Walkthrough', v: `${p.steps}/${t.steps}` },
    { label: 'Practice', v: `${p.practice}/${t.practice}` },
    { label: 'Quiz best', v: `${Math.round(p.quizBest * 100)}%` },
    { label: 'Cards learned', v: `${p.cards}/${t.cards}` },
  ];
  return (
    <div className="flex items-center gap-3">
      <MasteryRing value={value} size={52} stroke={4} showText />
      <dl className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-[11.5px]">
        {rows.map(r => <div key={r.label} className="flex gap-1.5"><dt className="text-ink3">{r.label}</dt><dd className="num text-ink2 font-medium">{r.v}</dd></div>)}
      </dl>
    </div>
  );
}
