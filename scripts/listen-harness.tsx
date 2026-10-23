import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/index.css';
import { VIDEO_LESSONS } from '../src/core/videoLessons';
import { ListenBar } from '../src/ui/listen/ListenBar';

const n = Number(new URLSearchParams(location.search).get('lesson') ?? 0);
createRoot(document.getElementById('root')!).render(<StrictMode><ListenBar lesson={VIDEO_LESSONS[n]} mentor="Kevin" /></StrictMode>);
