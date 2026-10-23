// Kevin's video course with the enrichment from his real video frames (media/lessonNN.ts) merged in by lesson number.
import { VIDEO_LESSONS, type VideoLesson } from '@/core/videoLessons';
import type { KevinMedia } from './media/types';

const MODS = import.meta.glob<Record<string, KevinMedia>>('./media/lesson*.ts', { eager: true });
const MEDIA = new Map<number, KevinMedia>();
for (const m of Object.values(MODS)) for (const v of Object.values(m)) if (v && typeof v === 'object' && 'n' in v) MEDIA.set(v.n, v);

export const KEVIN_COURSE: VideoLesson[] = VIDEO_LESSONS.map(l => {
  const m = MEDIA.get(l.n);
  if (!m) return l;
  const sections = [...l.sections, ...m.sections];
  if (m.corrections.length) sections.push({ heading: 'Corrected from his video', points: m.corrections });
  return { ...l, sections, images: [...(l.images ?? []), ...m.images], figures: [...(m.figures ?? []), ...(l.figures ?? [])] };
});
