// "Explain like I'm 5": the one-liner, a short story, the analogy, the big ideas and the memory hook.
import { motion, useReducedMotion } from 'framer-motion';
import type { InteractiveLesson } from '@/core/interactive/types';
import { ease } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

export function StoryCard({ il, onStart }: { il: InteractiveLesson; onStart?: () => void }) {
  const reduce = useReducedMotion();
  const rise = (d: number) => (reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease, delay: d } });
  return (
    <div className="flex flex-col gap-5">
      <motion.p {...rise(0)} className="text-[22px] sm:text-[26px] leading-[1.25] font-semibold tracking-tight text-ink max-w-[34ch] text-balance">
        {il.eli5.oneLiner}
      </motion.p>
      <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <motion.div {...rise(0.08)}>
          <div className="label mb-2">The story</div>
          <p className="text-[14.5px] leading-[1.7] text-ink2 max-w-[65ch]">{il.eli5.story}</p>
        </motion.div>
        <motion.div {...rise(0.14)} className="rounded-xl border border-line bg-raised/40 p-4">
          <div className="label mb-2 flex items-center gap-1.5"><Icon name="sparkles" size={12} />Think of it like</div>
          <p className="text-[14px] leading-relaxed text-ink">{il.eli5.analogy}</p>
        </motion.div>
      </div>
      {il.bigIdeas.length > 0 && (
        <motion.div {...rise(0.2)}>
          <div className="label mb-2">Big ideas</div>
          <ol className="grid gap-2 sm:grid-cols-3">
            {il.bigIdeas.slice(0, 3).map((b, i) => (
              <li key={i} className="flex gap-3 rounded-xl border border-line p-3">
                <span className="num w-6 h-6 rounded-full bg-accent/15 text-accent grid place-items-center text-[12px] font-bold shrink-0">{i + 1}</span>
                <span className="text-[13.5px] leading-relaxed text-ink">{b}</span>
              </li>
            ))}
          </ol>
        </motion.div>
      )}
      <motion.div {...rise(0.26)} className="flex flex-wrap items-center gap-3">
        {il.mnemonic && (
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 text-violet px-3 py-1.5 text-[13px] font-semibold">
            <Icon name="bolt" size={13} /><span className="sr-only">Memory hook: </span>{il.mnemonic}
          </span>
        )}
        {onStart && <button type="button" className="btn-primary ml-auto" onClick={onStart}>Walk me through it<Icon name="chevronRight" size={14} /></button>}
      </motion.div>
    </div>
  );
}
