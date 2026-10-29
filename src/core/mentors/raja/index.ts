// Raja: his own course (strong zones, curve, location & momentum, realignment, Zoom sessions), merged from both parts,
// plus the user's private 1:1 sessions (n >= 101).
import type { VideoLesson } from '@/core/videoLessons';
import { RAJA_PARTA } from './partA';
import { RAJA_PARTB } from './partB';
import { RAJA_PRIVATE } from './private';

export const RAJA_LESSONS: VideoLesson[] = [...RAJA_PARTA, ...RAJA_PARTB, ...RAJA_PRIVATE].sort((a, b) => a.n - b.n);
