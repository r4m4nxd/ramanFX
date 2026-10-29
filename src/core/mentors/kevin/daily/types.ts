import type { VideoLesson } from '@/core/videoLessons';

/** One of Kevin's daily breakdown videos, recorded the evening before the trading day it plans for. */
export interface KevinDailyLesson extends VideoLesson {
  /** Trading day the plan is for (YYYY-MM-DD). */
  planFor: string;
  /** Recording date and start time, YYYY-MM-DD_HHMM (UTC-4). */
  recorded: string;
}
