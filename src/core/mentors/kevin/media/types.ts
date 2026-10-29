// Per-lesson enrichment of Kevin's video course from his real video frames; merged into VIDEO_LESSONS by n.
import type { VideoLesson } from '@/core/videoLessons';
export interface KevinMedia {
  n: number;
  images: NonNullable<VideoLesson['images']>;
  figures: NonNullable<VideoLesson['figures']>;
  sections: VideoLesson['sections'];      // appended (e.g. "On his charts")
  corrections: string[];                  // where the frames corrected/clarified the transcript-based notes
}
