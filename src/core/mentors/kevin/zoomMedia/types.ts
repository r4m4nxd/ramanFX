// Per-session enrichment of Kevin's Sunday live Zoom sessions from his real recording frames;
// merged into ZOOM_SESSIONS by date (see ../zoom.ts). Frames live in public/lessons/kevin_zoom/<date>/.
import type { VideoLesson } from '@/core/videoLessons';
export interface KevinZoomMedia {
  date: string;                           // YYYY-MM-DD, matches ZoomSession.date
  images: NonNullable<VideoLesson['images']>;
  figures: NonNullable<VideoLesson['figures']>;
  sections: VideoLesson['sections'];      // appended (e.g. "On his charts")
  corrections: string[];                  // where the frames corrected/clarified the transcript-based notes
}
