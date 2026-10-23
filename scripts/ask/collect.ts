// Collects every searchable passage for "Ask your mentors". Loaded by scripts/build-ask-index.mjs through Vite's SSR
// loader, so `@/` aliases and import.meta.glob in the lesson modules work exactly as in the app.
// Each source loads on its own: one that is missing or fails to load is skipped with a warning, not fatal.
import type { VideoLesson } from '@/core/videoLessons';
import type { ZoomSession } from '@/core/zoomSessions';
import type { InteractiveLesson } from '@/core/interactive/types';
import { ASK_SOURCES, type AskSourceId } from '@/core/ask/sources';
import type { AskLesson, AskPassage } from '@/core/ask/search';

// ─── SOURCE LOADERS: one per AskSourceId (add new sources here and in src/core/ask/sources.ts) ───
const LOADERS: Record<Exclude<AskSourceId, 'glossary'>, () => Promise<VideoLesson[]>> = {
  course: async () => (await import('@/core/mentors/kevin')).KEVIN_COURSE,
  zoom: async () => {
    try { return (await import('@/core/mentors/kevin/zoom')).KEVIN_ZOOM; }
    catch { return (await import('@/core/zoomSessions')).ZOOM_SESSIONS; }
  },
  daily: async () => (await import('@/core/mentors/kevin/daily')).KEVIN_DAILY,
  raja: async () => (await import('@/core/mentors/raja')).RAJA_LESSONS,
  seiden: async () => (await import('@/core/mentors/seiden')).SEIDEN_LESSONS,
  baker: async () => (await import('@/core/mentors/baker')).BAKER_LESSONS,
};
// ─────────────────────────────────────────────────────────────────────────────────────────────

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
const sentences = (s: string) => clean(s).match(/[^.!?]+(?:[.!?]+(?=\s|$)|$)/g)?.map(x => x.trim()).filter(Boolean) ?? [clean(s)];

/** Split a long item into chunks of whole sentences (~1-4 sentences, ≤ MAX chars where possible). */
const MAX = 420, MIN = 90;
function split(s: string): string[] {
  const t = clean(s);
  if (t.length <= MAX) return [t];
  const out: string[] = [];
  let cur = '';
  for (const x of sentences(t)) {
    if (cur && cur.length + x.length + 1 > MAX) { out.push(cur); cur = x; } else cur = cur ? `${cur} ${x}` : x;
  }
  if (cur) out.length && cur.length < MIN ? (out[out.length - 1] += ` ${cur}`) : out.push(cur);
  return out;
}

/** Items under one heading -> passages: long items are split, very short neighbours are merged. */
function chunk(items: string[]): string[] {
  const out: string[] = [];
  let cur = '';
  for (const it of items.flatMap(split).filter(Boolean)) {
    if (!cur) cur = it;
    else if (cur.length < MIN || (it.length < MIN && cur.length + it.length < MAX)) cur = `${cur} ${it}`;
    else { out.push(cur); cur = it; }
  }
  if (cur) out.push(cur);
  return out;
}

export interface Collected { lessons: AskLesson[]; passages: AskPassage[]; report: { src: AskSourceId; lessons: number; passages: number; note?: string }[] }

export async function collectPassages(): Promise<Collected> {
  const lessons: AskLesson[] = [];
  const passages: AskPassage[] = [];
  const report: Collected['report'] = [];
  let interactive: InteractiveLesson[] = [];
  try { interactive = (await import('@/core/interactive')).ALL_INTERACTIVE; } catch (e) { console.warn('[ask] interactive layer skipped:', (e as Error).message); }
  const add = (l: number, h: string, items: (string | undefined)[]) => {
    for (const t of chunk(items.filter((x): x is string => !!x && !!x.trim()))) passages.push({ l, h: clean(h), t });
  };

  for (const meta of ASK_SOURCES) {
    const before = passages.length;
    if (meta.id === 'glossary') {
      const { GLOSSARY } = await import('@/core/glossary');
      const l = lessons.push({ src: 'glossary', n: 0, title: 'Glossary' }) - 1;
      for (const g of GLOSSARY) passages.push({ l, h: clean(g.term), t: clean(`${g.term}: ${g.definition}`) });
      report.push({ src: 'glossary', lessons: GLOSSARY.length, passages: passages.length - before });
      continue;
    }
    let list: VideoLesson[];
    try { list = await LOADERS[meta.id](); }
    catch (e) { report.push({ src: meta.id, lessons: 0, passages: 0, note: `skipped: ${(e as Error).message.split('\n')[0]}` }); continue; }
    if (!Array.isArray(list)) { report.push({ src: meta.id, lessons: 0, passages: 0, note: 'skipped: not a lesson list' }); continue; }
    const il = new Map(interactive.filter(x => meta.interactive && x.mentor === meta.interactive).map(x => [x.n, x]));
    for (const ls of list) {
      const z = 'qa' in ls ? (ls as ZoomSession) : null;
      const title = clean(z?.date ? `${ls.title} (${z.date})` : ls.title);
      const l = lessons.push({ src: meta.id, n: ls.n, title }) - 1;
      add(l, 'Summary', [ls.summary]);
      add(l, 'Rules', ls.rules ?? []);
      for (const s of ls.sections ?? []) add(l, s.heading, s.points ?? []);
      for (const img of ls.images ?? []) add(l, `Chart: ${img.caption}`, img.notes?.length ? img.notes : [img.caption]);
      for (const f of ls.figures ?? []) add(l, 'Diagram', [f.caption]);
      for (const ex of z?.examples ?? []) add(l, `Chart: ${[ex.market, ex.timeframe].filter(Boolean).join(' ')}`, [[ex.setup, ex.reasoning && `Why: ${ex.reasoning}`, ex.outcome && `Result: ${ex.outcome}`].filter(Boolean).join(' ')]);
      for (const qa of z?.qa ?? []) add(l, 'Student question', [`Q: ${qa.q} A: ${qa.a}`]);
      add(l, 'Mistakes he warns about', ls.mistakes ?? []);
      add(l, 'Before you trade', ls.checklist ?? []);
      add(l, 'In his words', (ls.quotes ?? []).map(q => `“${clean(q)}”`));
      add(l, 'New or different', ls.newVsPdfs ?? []);
      const x = il.get(ls.n);
      if (x) {
        add(l, 'Explained simply', [x.eli5.oneLiner, x.eli5.story, x.eli5.analogy]);
        add(l, 'Big ideas', x.bigIdeas);
        for (const st of x.steps) add(l, `Step: ${st.title}`, [st.narration]);
        add(l, 'Flashcards', x.cards.map(c => `${c.front} - ${c.back}`));
      }
    }
    report.push({ src: meta.id, lessons: list.length, passages: passages.length - before });
  }
  return { lessons, passages, report };
}
