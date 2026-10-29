// Exports the app's mentor lessons as a small JSON for the morning brief (tools/briefing/brief.py):
//   pool        one entry per lesson of every mentor (Kevin course + Sunday live, Raja, Seiden, Baker) with its key points
//   kevinDaily  the newest Kevin daily plans (title, summary, plan points)
// Build + run (no npm install needed):  npx -y esbuild@0.21.5 tools/briefing/export_lessons.ts --bundle --platform=node \
//   --format=esm --tsconfig=tsconfig.json --outfile=tools/briefing/.cache/export.mjs && node tools/briefing/.cache/export.mjs
// Imports only data modules (no Vite import.meta.glob), so it bundles with plain esbuild.
import { writeFileSync, mkdirSync } from 'node:fs';
import { VIDEO_LESSONS, type VideoLesson } from '@/core/videoLessons';
import { ZOOM_SESSIONS } from '@/core/zoomSessions';
import { RAJA_LESSONS } from '@/core/mentors/raja';
import { SEIDEN_LESSONS } from '@/core/mentors/seiden';
import { BAKER_LESSONS } from '@/core/mentors/baker';
import { KEVIN_DAILY_LESSONS } from '@/core/mentors/kevin/daily';

const clip = (s: string, n = 220) => (s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : s);
const keyPoints = (l: VideoLesson): string[] => {
  const pts = (l.rules ?? []).filter(Boolean);
  const more = (l.sections ?? []).flatMap(s => s.points ?? []);
  return [...pts, ...more].slice(0, 6).map(p => clip(p));
};
const entry = (src: string, mentor: string, l: VideoLesson) => ({
  key: `${src}:${l.n}`, src, n: l.n, mentor, title: l.title, kind: l.kind,
  summary: clip(l.summary ?? '', 300), points: keyPoints(l), quote: clip((l.quotes ?? [])[0] ?? '', 200),
});

const pool = [
  ...VIDEO_LESSONS.map(l => entry('course', 'Kevin', l)),
  ...ZOOM_SESSIONS.map(l => entry('zoom', 'Kevin · Sunday live', l)),
  ...RAJA_LESSONS.map(l => entry('raja', 'Raja', l)),
  ...SEIDEN_LESSONS.map(l => entry('seiden', 'Sam Seiden', l)),
  ...BAKER_LESSONS.map(l => entry('baker', 'Kevin Baker', l)),
];
const kevinDaily = KEVIN_DAILY_LESSONS.slice(0, 5).map(l => ({
  n: l.n, planFor: l.planFor, recorded: l.recorded, title: l.title, summary: l.summary,
  points: (l.sections?.[0]?.points ?? []).slice(0, 12), heading: l.sections?.[0]?.heading ?? '',
}));
const out = process.argv[2] ?? 'tools/briefing/.cache/lessons.json';
mkdirSync(out.replace(/\/[^/]*$/, ''), { recursive: true });
writeFileSync(out, JSON.stringify({ generated: new Date().toISOString(), pool, kevinDaily }));
console.log(`lessons export: ${pool.length} lessons, ${kevinDaily.length} daily plans -> ${out}`);
