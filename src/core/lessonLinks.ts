// Where each video lesson plugs into the app: Planner steps, Guru rule cards, the mentor checklist and mistake tags.
import { VIDEO_LESSONS } from './videoLessons';

/** Lessons to study for each Planner step (by lesson number). */
export const PLANNER_LESSONS: Record<string, number[]> = {
  Setup: [8, 20, 23, 12],
  Zone: [1, 2, 3, 13, 18, 21],
  Context: [4, 5, 7, 14, 19],
  Levels: [6, 10],
  Verdict: [15, 23, 11, 17],
};
export const lessonsFor = (step: string) => (PLANNER_LESSONS[step] ?? []).map(n => VIDEO_LESSONS.find(l => l.n === n)).filter(Boolean) as typeof VIDEO_LESSONS;

/** Every stated rule as a Guru card, tagged with its lesson. */
export const LESSON_RULE_CARDS = VIDEO_LESSONS.flatMap(l => l.rules.map(r => ({ topic: `Lesson ${l.n}`, title: l.title, body: r, lesson: l.n })));

/** Mentor's pre-trade checks, grouped by lesson (deduped). */
export const MENTOR_CHECKS = VIDEO_LESSONS.filter(l => l.checklist.length).map(l => ({ n: l.n, title: l.title, items: l.checklist }));

/** Mistake tags from the lessons, offered when journaling a trade. */
export const LESSON_MISTAKE_TAGS = [...new Set(VIDEO_LESSONS.flatMap(l => l.journalTags.map(t => t.toLowerCase().trim())))].sort();
