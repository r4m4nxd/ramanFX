// Sam Seiden: "5 years of supply and demand teaching" (423 pages), one lesson per article, charts described from the page images.
import type { VideoLesson } from '@/core/videoLessons';
import { SEIDEN_P001 } from './part001';
import { SEIDEN_P081 } from './part081';
import { SEIDEN_P161 } from './part161';
import { SEIDEN_P241 } from './part241';
import { SEIDEN_P321 } from './part321';
import { SEIDEN_P401 } from './part401';

export const SEIDEN_LESSONS: VideoLesson[] = [...SEIDEN_P001, ...SEIDEN_P081, ...SEIDEN_P161, ...SEIDEN_P241, ...SEIDEN_P321, ...SEIDEN_P401].sort((a, b) => a.n - b.n);
