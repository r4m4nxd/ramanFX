import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);

// Fade the opening animation out once the app is up and the mark has finished drawing.
const splash = document.getElementById('splash');
if (splash) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const hidden = document.documentElement.classList.contains('no-splash');
  const wait = hidden ? 0 : Math.max(0, (reduce ? 500 : 1950) - performance.now());
  setTimeout(() => { splash.classList.add('out'); setTimeout(() => splash.remove(), 450); }, wait);
}

// iOS Safari ignores :active (the press squeeze on buttons and tabs) unless the page listens for touches.
document.addEventListener('touchstart', () => {}, { passive: true });
