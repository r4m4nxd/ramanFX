// Raja: his own course (strong zones, curve, location & momentum, realignment, Zoom sessions), merged from both parts.
import type { VideoLesson } from '@/core/videoLessons';
import { RAJA_PARTA } from './partA';
import { RAJA_PARTB } from './partB';

export const RAJA_LESSONS: VideoLesson[] = [...RAJA_PARTA, ...RAJA_PARTB].sort((a, b) => a.n - b.n);
