// Interactive teaching layer: every mentor's InteractiveLesson[] merged into one lookup.
// This module is heavy (all candle scenes). The UI loads it with a dynamic import (see src/ui/teach/data.ts)
// so the Learn page itself stays small.
import type { InteractiveLesson, MentorId } from './types';
import { IL_KEVINCOURSEA } from './kevinCourseA';
import { IL_KEVINCOURSEB } from './kevinCourseB';
import { IL_KEVINZOOM } from './kevinZoom';
import { IL_BAKER } from './baker';
import { IL_RAJA } from './raja';
import { IL_SEIDENA } from './seidenA';
import { IL_SEIDENB } from './seidenB';
import { IL_SEIDENC } from './seidenC';
// ─── ADD MORE MENTOR FILES HERE ─────────────────────────────────────
// When raja.ts / seidenA.ts / seidenB.ts / seidenC.ts are finished, import them and add them to SOURCES below:
//   import { IL_RAJA } from './raja';
//   import { IL_SEIDENA } from './seidenA';
//   import { IL_SEIDENB } from './seidenB';
//   import { IL_SEIDENC } from './seidenC';
const SOURCES: InteractiveLesson[][] = [
  IL_KEVINCOURSEA,
  IL_KEVINCOURSEB,
  IL_KEVINZOOM,
  IL_BAKER,
  IL_RAJA, IL_SEIDENA, IL_SEIDENB, IL_SEIDENC,
];
// ────────────────────────────────────────────────────────────────────

export type { InteractiveLesson, MentorId } from './types';

export const ALL_INTERACTIVE: InteractiveLesson[] = SOURCES.flat();

const keyOf = (mentor: MentorId, n: number) => `${mentor}:${n}`;
const BY_KEY = new Map<string, InteractiveLesson>(ALL_INTERACTIVE.map(l => [keyOf(l.mentor, l.n), l]));

/** The interactive layer for one lesson, or undefined when that lesson has none yet. */
export function getInteractive(mentor: MentorId, n: number): InteractiveLesson | undefined {
  return BY_KEY.get(keyOf(mentor, n));
}

/** Learn page source id ('course', 'zoom', 'seiden', 'raja', 'baker') to the interactive MentorId. */
export function mentorOfSrc(src: string): MentorId | undefined {
  if (src === 'course') return 'kevin-course';
  if (src === 'zoom') return 'kevin-zoom';
  if (src === 'seiden' || src === 'raja' || src === 'baker') return src;
  return undefined;
}

/** Which lessons have interactive data, per mentor (for list badges and mastery). */
export function interactiveNumbers(mentor: MentorId): number[] {
  return ALL_INTERACTIVE.filter(l => l.mentor === mentor).map(l => l.n);
}
