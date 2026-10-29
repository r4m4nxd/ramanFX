// Kevin's Sunday live Zoom sessions with the enrichment from his real recording frames
// (zoomMedia/sNN_<date>.ts) merged in by session date. Same pattern as KEVIN_COURSE in ./index.ts.
import { ZOOM_SESSIONS, type ZoomSession } from '@/core/zoomSessions';
import type { KevinZoomMedia } from './zoomMedia/types';

const MODS = import.meta.glob<Record<string, KevinZoomMedia>>('./zoomMedia/s*.ts', { eager: true });
const MEDIA = new Map<string, KevinZoomMedia>();
for (const m of Object.values(MODS)) for (const v of Object.values(m)) if (v && typeof v === 'object' && 'date' in v) MEDIA.set(v.date, v);

export const KEVIN_ZOOM: ZoomSession[] = ZOOM_SESSIONS.map(l => {
  const m = MEDIA.get(l.date);
  if (!m) return l;
  const sections = [...l.sections, ...m.sections];
  if (m.corrections.length) sections.push({ heading: 'Corrected from his video', points: m.corrections });
  return { ...l, sections, images: [...(l.images ?? []), ...m.images], figures: [...(m.figures ?? []), ...(l.figures ?? [])] };
});
