// Step-through walkthrough: the scene morphs from one step to the next while the narration changes beside it.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { InteractiveLesson } from '@/core/interactive/types';
import { cx, ease } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { CandleScene } from './CandleScene';
import { markStep } from './store';

export function StepPlayer({ il, onDone }: { il: InteractiveLesson; onDone?: () => void }) {
  const steps = il.steps;
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduce = useReducedMotion();
  const step = steps[i];
  const last = i === steps.length - 1;
  const live = useRef<HTMLDivElement>(null);

  useEffect(() => { markStep(il, i); }, [il, i]);
  useEffect(() => { setI(0); setPlaying(false); }, [il]);
  // Autoplay: reading time from the narration length (min 4.5s); stops on the last step.
  useEffect(() => {
    if (!playing) return;
    if (last) { setPlaying(false); return; }
    const words = step.narration.split(/\s+/).length;
    const t = window.setTimeout(() => setI(x => Math.min(steps.length - 1, x + 1)), Math.max(4500, words * 300));
    return () => window.clearTimeout(t);
  }, [playing, i, last, step, steps.length]);

  const go = (n: number) => { setI(Math.max(0, Math.min(steps.length - 1, n))); };
  const onKey = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input, textarea, [role="application"]')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); setPlaying(false); go(i + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setPlaying(false); go(i - 1); }
  };
  if (!step) return null;

  return (
    <div ref={live} onKeyDown={onKey} className="flex flex-col gap-4" role="group" aria-roledescription="walkthrough" aria-label={`Walkthrough, step ${i + 1} of ${steps.length}`}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] items-start">
        <div className="rounded-xl border border-line bg-bg/40 p-2 sm:p-3">
          <CandleScene scene={step.scene} label={`Chart for step ${i + 1}: ${step.title}`} stagger={0.03} />
        </div>
        <div className="min-h-[140px] lg:pt-1" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} initial={reduce ? false : { opacity: 0, y: 6, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={reduce ? undefined : { opacity: 0, y: -4, filter: 'blur(4px)' }} transition={{ duration: 0.3, ease }}>
              <div className="label mb-1.5"><span className="num">Step {i + 1}</span> of {steps.length}</div>
              <h4 className="text-[17px] font-semibold tracking-tight leading-snug">{step.title}</h4>
              <p className="text-[14px] leading-[1.7] text-ink2 mt-2">{step.narration}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn" onClick={() => { setPlaying(false); go(i - 1); }} disabled={i === 0} aria-label="Previous step"><Icon name="chevronLeft" size={14} /><span className="max-sm:hidden">Back</span></button>
        <div className="flex items-center justify-center gap-1.5 max-sm:order-first max-sm:w-full sm:mx-auto" role="tablist" aria-label="Steps">
          {steps.map((s, k) => (
            <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Step ${k + 1}: ${s.title}`} onClick={() => { setPlaying(false); go(k); }}
              className="group h-8 px-1 grid place-items-center rounded-full">
              <span className={cx('block h-2 rounded-full transition-all duration-300', k === i ? 'w-6 bg-accent' : k < i ? 'w-2 bg-accent/50' : 'w-2 bg-line2 group-hover:bg-ink3')} />
            </button>
          ))}
        </div>
        <button type="button" className="btn-ghost max-sm:ml-auto" onClick={() => { if (last) { go(0); setPlaying(true); } else setPlaying(p => !p); }} aria-pressed={playing} aria-label={playing ? 'Pause autoplay' : 'Autoplay steps'}>
          <Icon name={playing ? 'pause' : 'play'} size={13} /><span className="max-sm:hidden">{playing ? 'Pause' : last ? 'Replay' : 'Autoplay'}</span>
        </button>
        {last
          ? onDone && <button type="button" className="btn-primary" onClick={onDone}>Try it yourself<Icon name="chevronRight" size={14} /></button>
          : <button type="button" className="btn-primary" onClick={() => { setPlaying(false); go(i + 1); }} aria-label="Next step"><span>Next</span><Icon name="chevronRight" size={14} /></button>}
      </div>
      <p className="text-[11.5px] text-ink3 max-sm:hidden">Tip: use the left and right arrow keys to move between steps.</p>
    </div>
  );
}
