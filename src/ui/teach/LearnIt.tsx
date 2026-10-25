// "Learn it": the interactive block at the top of a lesson. Story -> Walkthrough -> Practice -> Quiz -> Flashcards.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { MentorId } from '@/core/interactive/types';
import { Card, cx, ease, Tabs } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { useInteractiveData } from './data';
import { StoryCard } from './StoryCard';
import { StepPlayer } from './StepPlayer';
import { PracticeBoard } from './PracticeBoard';
import { QuizRunner } from './QuizRunner';
import { LessonFlashcards } from './Flashcards';
import { MasteryBreakdown } from './Mastery';
import { lessonKey, markOpened, mastery, useTeachVersion } from './store';

type Tab = 'story' | 'walk' | 'practice' | 'quiz' | 'cards';
const TABS: { value: Tab; label: string }[] = [
  { value: 'story', label: 'Story' }, { value: 'walk', label: 'Walkthrough' }, { value: 'practice', label: 'Practice' }, { value: 'quiz', label: 'Quiz' }, { value: 'cards', label: 'Flashcards' },
];
const TAB_KEY = 'rfx_teach_tab';

/** `bare`: drawn inside a collapsible section card (no card or title of its own). */
export default function LearnIt({ mentor, n, bare }: { mentor: MentorId; n: number; bare?: boolean }) {
  const data = useInteractiveData();
  const il = data?.getInteractive(mentor, n);
  const reduce = useReducedMotion();
  useTeachVersion();
  const [tab, setTab] = useState<Tab>(() => { try { const t = localStorage.getItem(TAB_KEY) as Tab | null; return t && TABS.some(x => x.value === t) ? t : 'story'; } catch { return 'story'; } });
  const top = useRef<HTMLDivElement>(null);
  const pick = (t: Tab) => { setTab(t); try { localStorage.setItem(TAB_KEY, t); } catch { /* storage blocked */ } };
  const goto = (t: Tab) => { pick(t); top.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); };
  useEffect(() => { if (il) markOpened(il); }, [il]);

  if (!data) return bare ? <div aria-label="Loading"><div className="h-48 rounded-xl bg-raised/40 animate-pulse" /></div> : <Card aria-label="Loading"><div className="h-6 w-40 rounded bg-raised/60 animate-pulse" /><div className="h-48 mt-4 rounded-xl bg-raised/40 animate-pulse" /></Card>;
  if (!il) return bare ? <p className="text-[13px] text-ink3">No interactive version of this lesson yet.</p> : null;
  const k = lessonKey(mentor, n);
  const Wrap = bare ? 'div' : Card;

  return (
    <Wrap className={bare ? 'jump-target' : 'p-4 sm:p-5 scroll-mt-24'} aria-label="Learn it, interactive lesson">
      <div ref={top} className={cx('flex flex-wrap items-start justify-between gap-3 mb-4', bare ? 'jump-target' : 'scroll-mt-24')}>
        <div className="min-w-0">
          {bare ? <p className="text-[13px] text-ink2">Understand it, see it, try it, keep it.</p> : <>
            <div className="label flex items-center gap-1.5 text-accent"><Icon name="sparkles" size={12} />Learn it</div>
            <h3 className="text-[16px] font-semibold mt-1">Understand it, see it, try it, keep it</h3>
          </>}
        </div>
        <MasteryBreakdown k={k} value={mastery(k)} />
      </div>
      <div className="mb-5">
        <Tabs label="Learn it sections" value={tab} onChange={pick} options={TABS} swap={false} />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={tab} initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -4 }} transition={{ duration: 0.22, ease }}>
          {tab === 'story' && <StoryCard il={il} onStart={() => goto('walk')} />}
          {tab === 'walk' && <StepPlayer il={il} onDone={() => goto('practice')} />}
          {tab === 'practice' && <PracticeBoard il={il} onDone={() => goto('quiz')} />}
          {tab === 'quiz' && <QuizRunner il={il} onDone={() => goto('cards')} />}
          {tab === 'cards' && <LessonFlashcards il={il} />}
        </motion.div>
      </AnimatePresence>
    </Wrap>
  );
}
