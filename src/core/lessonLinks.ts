// Where each video lesson plugs into the app: Planner steps, Guru rule cards, the mentor checklist and mistake tags.
import { VIDEO_LESSONS } from './videoLessons';
import { ZOOM_SESSIONS } from './zoomSessions';

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

// ---- Sunday live Zoom sessions (kept separate from the recorded course) ----
export const zoomLabel = (n: number) => { const s = ZOOM_SESSIONS.find(z => z.n === n); return s ? `Sunday ${new Date(s.date + 'T12:00:00').toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}` : `Session ${n}`; };
/** Sunday sessions to study for each Planner step: those whose rules feed that step, most rules first. */
export const PLANNER_ZOOM: Record<string, number[]> = Object.fromEntries(['Setup', 'Zone', 'Context', 'Levels', 'Verdict'].map(step => [step,
  ZOOM_SESSIONS.map(s => [s.n, s.botRules.filter(r => r.plannerStep === step).length] as const).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([n]) => n)]));
export const ZOOM_RULE_CARDS = ZOOM_SESSIONS.flatMap(s => s.rules.map(r => ({ topic: `Sunday live · ${zoomLabel(s.n)}`, title: s.title, body: r, zoom: s.n })));
export const ZOOM_CHECKS = ZOOM_SESSIONS.filter(s => s.checklist.length).map(s => ({ n: s.n, title: `${zoomLabel(s.n)} · ${s.title}`, items: s.checklist }));
export const ZOOM_MISTAKE_TAGS = [...new Set(ZOOM_SESSIONS.flatMap(s => s.journalTags.map(t => t.toLowerCase().trim())))];
export const ALL_MISTAKE_TAGS = [...new Set([...LESSON_MISTAKE_TAGS, ...ZOOM_MISTAKE_TAGS])].sort();
