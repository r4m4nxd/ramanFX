// "Ask your mentors": the searchable sources. Metadata only (labels, links), so the Ask page stays small.
// The build script (scripts/build-ask-index.mjs -> scripts/ask/collect.ts) loads the lesson modules themselves.
// To add a source: add an id + entry here, then a loader in scripts/ask/collect.ts, then run `npm run ask:index`.
import type { MentorId } from '@/core/interactive/types';

export type AskSourceId = 'course' | 'zoom' | 'daily' | 'raja' | 'seiden' | 'baker' | 'glossary';

export interface AskSourceMeta {
  id: AskSourceId;
  /** Filter chip label. */
  label: string;
  /** Who is speaking, shown on the quote card. */
  mentor: string;
  /** Interactive-layer mentor id whose eli5 / steps / flashcards belong to this source's lessons. */
  interactive?: MentorId;
  /** False while the Learn page cannot open this source's lessons yet (the card then shows no link). */
  linkable?: boolean;
}

export const ASK_SOURCES: AskSourceMeta[] = [
  { id: 'course', label: 'Kevin course', mentor: 'Kevin', interactive: 'kevin-course' },
  { id: 'zoom', label: 'Kevin Sunday', mentor: 'Kevin', interactive: 'kevin-zoom' },
  // Flip linkable to true once src/pages/Learn.tsx opens /learn?src=daily&l=N (today it would fall back to the Kevin course).
  { id: 'daily', label: 'Kevin daily', mentor: 'Kevin', linkable: false },
  { id: 'raja', label: 'Raja', mentor: 'Raja', interactive: 'raja' },
  { id: 'seiden', label: 'Seiden', mentor: 'Sam Seiden', interactive: 'seiden' },
  { id: 'baker', label: 'Baker', mentor: 'Kevin Baker', interactive: 'baker' },
  { id: 'glossary', label: 'Glossary', mentor: 'Glossary' },
];

export const ASK_SOURCE: Record<AskSourceId, AskSourceMeta> = Object.fromEntries(ASK_SOURCES.map(s => [s.id, s])) as Record<AskSourceId, AskSourceMeta>;

/** The Learn page URL that opens one lesson (same URLs the Learn page itself builds). */
export function askHref(src: AskSourceId, n: number): string {
  if (src === 'glossary') return '/learn?src=glossary';
  if (src === 'course') return `/learn?l=${n}`;
  return `/learn?src=${src}&l=${n}`;
}
