// Flashcards with spaced repetition (SM-2, four grades). One deck per lesson, plus a global review across every
// lesson and mentor. Progress is stored by store.ts in localStorage.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { InteractiveLesson } from '@/core/interactive/types';
import { Badge, Bar, Card, cx, ease } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { cardId, getCard, getProgress, gradeCard, intervalLabel, isDue, lessonKey, schedule, useTeachVersion, type Grade } from './store';
import { useInteractiveData } from './data';

export interface DeckCard { id: string; front: string; back: string; source?: string; href?: string }

const GRADES: { g: Grade; label: string; tone: string; key: string }[] = [
  { g: 'again', label: 'Again', tone: 'text-loss border-loss/40 hover:bg-loss/10', key: '1' },
  { g: 'hard', label: 'Hard', tone: 'text-warn border-warn/40 hover:bg-warn/10', key: '2' },
  { g: 'good', label: 'Good', tone: 'text-profit border-profit/40 hover:bg-profit/10', key: '3' },
  { g: 'easy', label: 'Easy', tone: 'text-accent border-accent/40 hover:bg-accent/10', key: '4' },
];

export const deckOf = (il: InteractiveLesson, source?: string, href?: string): DeckCard[] =>
  il.cards.map(c => ({ id: cardId(il.mentor, il.n, c.front), front: c.front, back: c.back, source, href }));

/** Plays a queue of cards. "Again" puts the card back at the end of this session. */
export function FlashDeck({ cards, onFinish, onOpenSource }: { cards: DeckCard[]; onFinish?: () => void; onOpenSource?: (href: string) => void }) {
  const reduce = useReducedMotion();
  const [queue, setQueue] = useState(cards);
  const [flipped, setFlipped] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  useEffect(() => { setQueue(cards); setFlipped(false); setDoneCount(0); }, [cards]);
  const card = queue[0];

  const grade = (g: Grade) => {
    if (!card || !flipped) return;
    gradeCard(card.id, g);
    setFlipped(false);
    setQueue(q => (g === 'again' ? [...q.slice(1), q[0]] : q.slice(1)));
    if (g !== 'again') setDoneCount(n => n + 1);
  };
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select')) return;
      if ((e.key === ' ' || e.key === 'Enter') && !(e.target as HTMLElement).closest('button, a')) { e.preventDefault(); setFlipped(f => !f); }
      const m = GRADES.find(x => x.key === e.key); if (m && flipped) { e.preventDefault(); grade(m.g); }
    };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });
  useEffect(() => { if (!queue.length && cards.length) onFinish?.(); }, [queue.length, cards.length, onFinish]);

  if (!card) {
    return (
      <div className="flex flex-col items-center text-center gap-2 py-8" role="status">
        <span className="w-11 h-11 rounded-full bg-profit/15 text-profit grid place-items-center"><Icon name="check" size={20} /></span>
        <div className="text-[16px] font-semibold">Session done</div>
        <p className="text-[13px] text-ink3">{doneCount} card{doneCount === 1 ? '' : 's'} reviewed. They come back when they are due.</p>
      </div>
    );
  }
  const cur = getCard(card.id);
  const total = doneCount + queue.length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Bar value={doneCount / Math.max(1, total)} className="flex-1" />
        <span className="num text-[12px] text-ink3 shrink-0">{queue.length} left</span>
      </div>
      <div className="relative [perspective:1200px]">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={card.id + queue.length} initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40, scale: 0.97 }} transition={{ duration: 0.3, ease }}>
            <button type="button" onClick={() => setFlipped(f => !f)} aria-label={flipped ? `Answer: ${card.back}. Press to see the question.` : `Question: ${card.front}. Press to show the answer.`}
              className="relative block w-full min-h-[220px] sm:min-h-[240px] text-left rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent">
              <motion.div className="relative w-full min-h-[220px] sm:min-h-[240px] [transform-style:preserve-3d]" animate={reduce ? undefined : { rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.5, ease }}>
                <div className={cx('absolute inset-0 rounded-2xl border border-line2 bg-raised/60 p-5 sm:p-6 flex flex-col [backface-visibility:hidden]', reduce && flipped && 'invisible')}>
                  <div className="flex items-center gap-2"><span className="label">Question</span>{!cur && <Badge tone="accent">New</Badge>}{card.source && <span className="text-[11.5px] text-ink3 truncate ml-auto">{card.source}</span>}</div>
                  <div className="flex-1 grid place-items-center py-4"><p className="text-[18px] sm:text-[20px] font-semibold leading-snug text-center text-balance">{card.front}</p></div>
                  <div className="text-[12px] text-ink3 text-center">Tap or press Space to flip</div>
                </div>
                <div className={cx('absolute inset-0 rounded-2xl border border-accent/40 bg-accent/[0.06] p-5 sm:p-6 flex flex-col [backface-visibility:hidden]', !reduce && '[transform:rotateY(180deg)]', reduce && !flipped && 'invisible')}>
                  <div className="label">Answer</div>
                  <div className="flex-1 grid place-items-center py-4"><p className="text-[16px] sm:text-[17px] leading-relaxed text-center text-ink text-balance">{card.back}</p></div>
                  <div className="text-[12px] text-ink3 text-center line-clamp-1">{card.front}</div>
                </div>
              </motion.div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className={cx('grid grid-cols-4 gap-2 transition-opacity duration-200', !flipped && 'opacity-40')} role="group" aria-label="How well did you remember?">
        {GRADES.map(x => (
          <button key={x.g} type="button" disabled={!flipped} onClick={() => grade(x.g)} aria-keyshortcuts={x.key}
            className={cx('flex flex-col items-center justify-center gap-0.5 h-14 rounded-xl border bg-surface transition-colors disabled:cursor-not-allowed', x.tone)}>
            <span className="text-[13px] font-semibold">{x.label}</span>
            <span className="num text-[11px] text-ink3">{intervalLabel(schedule(cur, x.g))}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-[11.5px] text-ink3 max-sm:hidden">
        <span>Keys: Space flips · 1 Again · 2 Hard · 3 Good · 4 Easy</span>
        {card.href && onOpenSource && <button type="button" className="underline-offset-2 hover:underline" onClick={() => onOpenSource(card.href!)}>Open the lesson</button>}
      </div>
    </div>
  );
}

/** The Flashcards tab inside a lesson: due + new cards first; everything on request. */
export function LessonFlashcards({ il }: { il: InteractiveLesson }) {
  const v = useTeachVersion();
  const all = useMemo(() => deckOf(il), [il]);
  const [mode, setMode] = useState<'due' | 'all' | null>(null);
  const [deck, setDeck] = useState<DeckCard[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const counts = useMemo(() => { const now = Date.now(); let due = 0, fresh = 0, learned = 0; for (const c of all) { const s = getCard(c.id); if (!s) fresh++; else { if (isDue(s, now)) due++; if (s.reps >= 1) learned++; } } return { due, fresh, learned }; }, [all, v]);
  const start = (m: 'due' | 'all') => { const now = Date.now(); setDeck(m === 'all' ? all : all.filter(c => { const s = getCard(c.id); return !s || isDue(s, now); })); setMode(m); };
  useEffect(() => { setMode(null); }, [il]);

  if (mode) return (
    <div className="flex flex-col gap-3">
      <FlashDeck cards={deck} />
      <div><button type="button" className="btn-ghost" onClick={() => setMode(null)}><Icon name="chevronLeft" size={14} />Back to the deck</button></div>
    </div>
  );
  const ready = counts.due + counts.fresh;
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-2">
        {[{ k: 'New', v: counts.fresh }, { k: 'Due now', v: counts.due }, { k: 'Learned', v: counts.learned }].map(x => (
          <div key={x.k} className="rounded-xl border border-line p-3"><div className="label">{x.k}</div><div className="num text-[22px] font-semibold mt-0.5">{x.v}<span className="text-[13px] text-ink3 font-normal">/{all.length}</span></div></div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {ready > 0 ? <button type="button" className="btn-primary" onClick={() => start('due')}><Icon name="layers" size={14} />Study {ready} card{ready > 1 ? 's' : ''}</button>
          : <p className="text-[13.5px] text-ink2 self-center">All caught up for this lesson. Cards come back when they are due.</p>}
        <button type="button" className="btn" onClick={() => start('all')}>Run through all {all.length}</button>
      </div>
      <ul className="flex flex-col divide-y divide-line rounded-xl border border-line">
        {all.map(c => { const s = getCard(c.id); return (
          <li key={c.id} className="flex items-start gap-3 px-3.5 py-2.5 text-[13px]">
            <span className="flex-1 text-ink2">{c.front}</span>
            <span className="num text-[11.5px] text-ink3 shrink-0">{!s ? 'new' : isDue(s) ? 'due' : `in ${intervalLabel({ ...s, seen: Date.now() })}`}</span>
          </li>
        ); })}
      </ul>
    </div>
  );
}

const MENTOR_LABEL: Record<string, { src: string; name: string }> = {
  'kevin-course': { src: 'course', name: 'Kevin · course' }, 'kevin-zoom': { src: 'zoom', name: 'Kevin · Sunday live' },
  seiden: { src: 'seiden', name: 'Sam Seiden' }, raja: { src: 'raja', name: 'Raja' }, baker: { src: 'baker', name: 'Kevin Baker' },
};
const hrefOf = (il: InteractiveLesson) => { const m = MENTOR_LABEL[il.mentor]; return m.src === 'course' ? `/learn?l=${il.n}` : `/learn?src=${m.src}&l=${il.n}`; };

/** Global review across every lesson and mentor. */
export function ReviewMode({ onOpen }: { onOpen: (href: string) => void }) {
  const data = useInteractiveData();
  const v = useTeachVersion();
  const [deck, setDeck] = useState<DeckCard[] | null>(null);
  const stats = useMemo(() => {
    if (!data) return null;
    const now = Date.now();
    const due: DeckCard[] = [], fresh: DeckCard[] = [];
    const perMentor = new Map<string, number>();
    for (const il of data.ALL_INTERACTIVE) {
      const src = `${MENTOR_LABEL[il.mentor]?.name ?? il.mentor} · ${il.n}`;
      const started = !!getProgress(lessonKey(il.mentor, il.n));
      for (const c of deckOf(il, src, hrefOf(il))) {
        const s = getCard(c.id);
        if (s && isDue(s, now)) { due.push(c); perMentor.set(il.mentor, (perMentor.get(il.mentor) ?? 0) + 1); }
        else if (!s && started) fresh.push(c);
      }
    }
    return { due, fresh, perMentor, total: data.ALL_INTERACTIVE.reduce((a, l) => a + l.cards.length, 0) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, v, deck == null]);

  if (!data || !stats) return <Card aria-label="Loading"><div className="h-40 rounded-xl bg-raised/50 animate-pulse" /></Card>;
  const shuffle = <T,>(a: T[]) => a.map(x => [Math.random(), x] as const).sort((p, q) => p[0] - q[0]).map(x => x[1]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="label">Spaced repetition</div>
            <h2 className="text-[22px] font-semibold tracking-tight mt-1">Review flashcards</h2>
            <p className="text-[13.5px] text-ink2 mt-1.5 max-w-[60ch]">Every lesson's cards, from every mentor, in one queue. Cards you know drift further apart; cards you miss come back soon. A few minutes a day is enough.</p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-xl border border-line px-4 py-2.5 text-center"><div className="num text-[26px] font-semibold leading-none">{stats.due.length}</div><div className="label mt-1">Due</div></div>
            <div className="rounded-xl border border-line px-4 py-2.5 text-center"><div className="num text-[26px] font-semibold leading-none">{stats.fresh.length}</div><div className="label mt-1">New</div></div>
          </div>
        </div>
        {!deck && (
          <div className="flex flex-wrap gap-2 mt-4">
            <button type="button" className="btn-primary" disabled={!stats.due.length} onClick={() => setDeck(shuffle(stats.due))}><Icon name="layers" size={14} />Review {stats.due.length} due</button>
            <button type="button" className="btn" disabled={!stats.fresh.length} onClick={() => setDeck(stats.fresh.slice(0, 15))}>Learn {Math.min(15, stats.fresh.length)} new</button>
          </div>
        )}
        {!deck && stats.perMentor.size > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">{[...stats.perMentor].map(([m, n]) => <Badge key={m}>{MENTOR_LABEL[m]?.name ?? m} · <span className="num">{n}</span></Badge>)}</div>
        )}
        {!deck && !stats.due.length && !stats.fresh.length && (
          <p className="text-[13px] text-ink3 mt-3">{stats.total ? 'Nothing due. Open a lesson and use its "Learn it" block to add cards to your queue.' : 'No flashcards yet.'}</p>
        )}
      </Card>
      {deck && (
        <Card>
          <FlashDeck cards={deck} onOpenSource={onOpen} />
          <div className="mt-3"><button type="button" className="btn-ghost" onClick={() => setDeck(null)}><Icon name="chevronLeft" size={14} />Back to review</button></div>
        </Card>
      )}
    </div>
  );
}
