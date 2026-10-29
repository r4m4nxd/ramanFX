// Kevin's daily market breakdowns (Jul-Oct 2026): one lesson per pre-session plan, newest first.
// Data: tools/kevin_daily (calls.json, notes/). Frames: public/lessons/kevin_daily/<recorded>/.
import type { VideoLesson } from '@/core/videoLessons';
import type { KevinDailyLesson } from './types';
import { KD_2026_07 } from './2026-07';
import { KD_2026_08 } from './2026-08';
import { KD_2026_09 } from './2026-09';
import { KD_2026_10 } from './2026-10';

export type { KevinDailyLesson } from './types';

export const KEVIN_DAILY_LESSONS: KevinDailyLesson[] = [...KD_2026_07, ...KD_2026_08, ...KD_2026_09, ...KD_2026_10].sort((a, b) => b.recorded.localeCompare(a.recorded));

export const KEVIN_DAILY: VideoLesson[] = KEVIN_DAILY_LESSONS;
