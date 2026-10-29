// Learner state for the interactive teaching layer: lesson progress (mastery) and flashcard spaced repetition.
// Everything lives in localStorage (wrapped in try/catch: private windows and blocked storage just start fresh).
// No lesson data is imported here, so the Learn page can show rings and due counts without loading the scenes.
import { useSyncExternalStore } from 'react';
import type { InteractiveLesson, MentorId } from '@/core/interactive/types';

const PROGRESS_KEY = 'rfx_teach_progress_v1';
const SRS_KEY = 'rfx_teach_srs_v1';

/** Learn page source id -> interactive MentorId. */
export function mentorOfSrc(src: string): MentorId | undefined {
  if (src === 'course') return 'kevin-course';
  if (src === 'zoom') return 'kevin-zoom';
  if (src === 'seiden' || src === 'raja' || src === 'baker') return src;
  return undefined;
}
export const lessonKey = (mentor: MentorId, n: number) => `${mentor}:${n}`;

// ─── tiny external store ─────────────────────────────────────────────
const listeners = new Set<() => void>();
let version = 0;
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === PROGRESS_KEY || e.key === SRS_KEY) { cache.clear(); emit(); } };
  window.addEventListener('storage', onStorage);
  return () => { listeners.delete(cb); window.removeEventListener('storage', onStorage); };
};
/** Re-renders whenever progress or flashcards change (in this tab or another). Returns a version number. */
export const useTeachVersion = () => useSyncExternalStore(subscribe, () => version, () => 0);

const cache = new Map<string, unknown>();
function read<T>(key: string, fallback: T): T {
  if (cache.has(key)) return cache.get(key) as T;
  let v = fallback;
  try { const raw = localStorage.getItem(key); if (raw) v = JSON.parse(raw) as T; } catch { /* storage blocked or corrupt */ }
  cache.set(key, v);
  return v;
}
function write<T>(key: string, v: T) {
  cache.set(key, v);
  try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked: keep it for this session */ }
  emit();
}

// ─── lesson progress ─────────────────────────────────────────────────
export interface LessonProgress {
  steps: number[];          // step indices seen
  quizBest: number;         // 0..1, best quiz score
  practice: number[];       // practice indices answered correctly
  totals: { steps: number; quiz: number; practice: number; cards: number };
  opened: number;           // last opened (ms)
}
type ProgressMap = Record<string, LessonProgress>;
const allProgress = () => read<ProgressMap>(PROGRESS_KEY, {});
export const getProgress = (key: string): LessonProgress | undefined => allProgress()[key];

const totalsOf = (il: InteractiveLesson) => ({ steps: il.steps.length, quiz: il.quiz.length, practice: il.practice.length, cards: il.cards.length });
function patch(il: InteractiveLesson, f: (p: LessonProgress) => LessonProgress) {
  const key = lessonKey(il.mentor, il.n);
  const map = allProgress();
  const cur = map[key] ?? { steps: [], quizBest: 0, practice: [], totals: totalsOf(il), opened: Date.now() };
  const next = f({ ...cur, totals: totalsOf(il) });
  write(PROGRESS_KEY, { ...map, [key]: next });
}
export const markOpened = (il: InteractiveLesson) => patch(il, p => ({ ...p, opened: Date.now() }));
export const markStep = (il: InteractiveLesson, i: number) => { const p = getProgress(lessonKey(il.mentor, il.n)); if (p?.steps.includes(i)) return; patch(il, q => ({ ...q, steps: [...q.steps, i] })); };
export const recordQuiz = (il: InteractiveLesson, score: number) => { const p = getProgress(lessonKey(il.mentor, il.n)); if (p && p.quizBest >= score) return; patch(il, q => ({ ...q, quizBest: Math.max(q.quizBest, score) })); };
export const recordPractice = (il: InteractiveLesson, i: number, correct: boolean) => { if (!correct) return; const p = getProgress(lessonKey(il.mentor, il.n)); if (p?.practice.includes(i)) return; patch(il, q => ({ ...q, practice: [...q.practice, i] })); };

/** Mastery 0..1: steps 20%, quiz 35%, practice 25%, flashcards learned 20%. */
export function mastery(key: string): number {
  const p = getProgress(key);
  if (!p) return 0;
  const t = p.totals;
  const part = (a: number, b: number) => (b ? Math.min(1, a / b) : 1);
  const learned = cardsLearned(key);
  return 0.2 * part(p.steps.length, t.steps) + 0.35 * p.quizBest + 0.25 * part(p.practice.length, t.practice) + 0.2 * part(learned, t.cards);
}
export function masteryParts(key: string) {
  const p = getProgress(key);
  const t = p?.totals ?? { steps: 0, quiz: 0, practice: 0, cards: 0 };
  return { steps: p?.steps.length ?? 0, quizBest: p?.quizBest ?? 0, practice: p?.practice.length ?? 0, cards: cardsLearned(key), totals: t };
}
/** Summary across a mentor's lessons that have interactive data. */
export function mentorMastery(mentor: MentorId, numbers: number[]) {
  const vals = numbers.map(n => mastery(lessonKey(mentor, n)));
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  return { avg, mastered: vals.filter(v => v >= 0.9).length, started: vals.filter(v => v > 0).length, total: vals.length };
}

// ─── flashcards: SM-2 (Anki-style four buttons) ──────────────────────
export interface CardState { ef: number; interval: number; reps: number; due: number; lapses: number; seen: number }
type SrsMap = Record<string, CardState>;
const allSrs = () => read<SrsMap>(SRS_KEY, {});
export type Grade = 'again' | 'hard' | 'good' | 'easy';

function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); }
/** Stable card id: lesson + a hash of the front text (so reordering cards in the data keeps progress). */
export const cardId = (mentor: MentorId, n: number, front: string) => `${lessonKey(mentor, n)}:${hash(front)}`;
export const getCard = (id: string): CardState | undefined => allSrs()[id];

const DAY = 86_400_000, MIN = 60_000;
/** The next state for a grade. Exposed so the buttons can preview the interval. */
export function schedule(cur: CardState | undefined, g: Grade, now = Date.now()): CardState {
  const c = cur ?? { ef: 2.5, interval: 0, reps: 0, due: now, lapses: 0, seen: 0 };
  let { ef, interval, reps, lapses } = c;
  if (g === 'again') { reps = 0; lapses++; interval = 0; ef = Math.max(1.3, ef - 0.2); return { ef, interval, reps, lapses, due: now + MIN, seen: now }; }
  if (g === 'hard') { interval = reps === 0 ? 1 : Math.max(1, interval * 1.2); ef = Math.max(1.3, ef - 0.15); }
  else if (g === 'good') { interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.round(interval * ef); }
  else { interval = reps === 0 ? 4 : Math.round(interval * ef * 1.3); ef = ef + 0.15; }
  reps++;
  return { ef, interval, reps, lapses, due: now + interval * DAY, seen: now };
}
export function gradeCard(id: string, g: Grade) {
  const map = allSrs();
  write(SRS_KEY, { ...map, [id]: schedule(map[id], g) });
}
export function intervalLabel(s: CardState) {
  const ms = s.due - (s.seen || Date.now());
  if (ms < DAY) return `${Math.max(1, Math.round(ms / MIN))}m`;
  const d = Math.round(ms / DAY);
  return d < 30 ? `${d}d` : d < 365 ? `${Math.round(d / 30)}mo` : `${(d / 365).toFixed(1)}y`;
}
export const isDue = (s: CardState | undefined, now = Date.now()) => !!s && s.due <= now;
/** Cards seen before and due now, across every lesson and mentor. Needs no lesson data. */
export function dueCount(now = Date.now()) { return Object.values(allSrs()).filter(s => s.due <= now).length; }
/** Flashcards graded at least once with a passing grade (reps >= 1) for one lesson. */
export function cardsLearned(key: string) {
  const pre = key + ':';
  return Object.entries(allSrs()).filter(([id, s]) => id.startsWith(pre) && s.reps >= 1).length;
}
export const hasAnyCard = (key: string) => { const pre = key + ':'; return Object.keys(allSrs()).some(id => id.startsWith(pre)); };

/** Hook: number of flashcards due now (updates on any grade). */
export function useDueCount() { useTeachVersion(); return dueCount(); }
