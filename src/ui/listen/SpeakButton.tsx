// Small speaker icon that reads one passage aloud (e.g. next to the ELI5 story). Tap again to stop.
import { useEffect, useRef, useState } from 'react';
import { cx } from '../kit';
import { speak, speechSupported } from './useSpeech';

export function SpeakButton({ text, label = 'Read aloud', className }: { text: string; label?: string; className?: string }) {
  const [on, setOn] = useState(false);
  const stop = useRef<() => void>();
  useEffect(() => () => stop.current?.(), []);
  if (!speechSupported()) return null;
  const click = () => {
    if (on) { stop.current?.(); return; }
    setOn(true);
    stop.current = speak(text, { onEnd: () => setOn(false) });
  };
  return (
    <button type="button" onClick={click} aria-pressed={on} aria-label={on ? 'Stop reading' : label} title={on ? 'Stop reading' : label}
      className={cx('inline-grid place-items-center h-8 w-8 touch:h-10 touch:w-10 rounded-full transition-colors press', on ? 'text-accent bg-accent/10' : 'text-ink3 hover:text-ink hover:bg-raised', className)}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {on ? <path d="M7 6h3v12H7zM14 6h3v12h-3z" /> : <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />}
      </svg>
    </button>
  );
}
