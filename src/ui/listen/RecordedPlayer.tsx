// "Listen to this lesson" with the pre-recorded narration: a real audio file (studio male voice) with chapters,
// lock-screen controls and offline saving. Falls back to <ListenBar> (device / on-device neural voice) when a lesson
// has no recording yet, or when the reader picks "Device voice".
import { motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VideoLesson } from '@/core/videoLessons';
import { cx, ease, Segmented } from '../kit';
import { Eq, fmtLeft, G, Glyph, IconBtn, ListenBar, nearestSpeed, PlayButton, Reveal, SPEEDS, Toggle } from './ListenBar';
import { isSaved, recordedIndex, removeSaved, savedBlob, saveOffline, streamUrl, type Recorded } from './recorded';
import { safeStorage } from './voices';

const K_MODE = 'rfx_listen_mode', K_RATE = 'rfx_rec_rate', K_POS = 'rfx_rec_pos:';
const mbs = (b: number) => `${Math.max(1, Math.round(b / 1e6))} MB`;
const clock = (s: number) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

/** Recorded audio when this lesson has it, otherwise the speech player. */
export function LessonListen({ source, lesson, mentor }: { source: string; lesson: VideoLesson; mentor: string }) {
  const key = `${source}:${lesson.n}`;
  const [rec, setRec] = useState<Recorded | null | undefined>(undefined);
  const [mode, setMode] = useState(() => safeStorage.get(K_MODE) ?? 'recorded');
  useEffect(() => { let on = true; recordedIndex().then(i => on && setRec(i[key] ?? null), () => on && setRec(null)); return () => { on = false; }; }, [key]);
  const pick = (m: string) => { setMode(m); safeStorage.set(K_MODE, m); };
  if (rec === undefined) return <div className="card p-4 sm:p-5 h-[150px] animate-pulse" aria-hidden="true" />;
  if (!rec || mode === 'device') return (
    <div className="flex flex-col gap-1.5">
      <ListenBar lesson={lesson} mentor={mentor} />
      {rec && <button type="button" className="self-end text-cap text-accent hover:underline px-1" onClick={() => pick('recorded')}>Use the recorded voice instead</button>}
    </div>
  );
  return <RecordedPlayer key={key} k={key} rec={rec} lesson={lesson} mentor={mentor} source={source} onDevice={() => pick('device')} />;
}

function RecordedPlayer({ k, rec, lesson, mentor, source, onDevice }: { k: string; rec: Recorded; lesson: VideoLesson; mentor: string; source: string; onDevice: () => void }) {
  const reduce = useReducedMotion();
  const audio = useRef<HTMLAudioElement | null>(null);
  const blobUrl = useRef<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [t, setT] = useState(() => Number(safeStorage.get(K_POS + k)) || 0);
  const [rate, setRateS] = useState(() => nearestSpeed(Number(safeStorage.get(K_RATE)) || 1));
  const [panel, setPanel] = useState<'none' | 'chapters' | 'offline'>('none');
  const [saved, setSaved] = useState(false);
  const [dl, setDl] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const dur = rec.s;
  const chapters = rec.c;
  const ch = useMemo(() => { let i = 0; chapters.forEach(([s], j) => { if (s <= t + 0.25) i = j; }); return i; }, [chapters, t]);

  useEffect(() => { isSaved(k, rec.h).then(setSaved); }, [k, rec.h]);
  useEffect(() => () => {
    audio.current?.pause();
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
    if ('mediaSession' in navigator) navigator.mediaSession.metadata = null;
  }, []);

  /** Creates the <audio> on first play: the saved copy if there is one, else the stream. */
  const ensure = useCallback(async (): Promise<HTMLAudioElement> => {
    if (audio.current) return audio.current;
    const a = new Audio();
    a.preload = 'auto';
    const blob = await savedBlob(k, rec.h);
    if (blob) { blobUrl.current = URL.createObjectURL(blob); a.src = blobUrl.current; } else a.src = await streamUrl(k);
    a.playbackRate = rate;
    let retried = false;
    a.ontimeupdate = () => { setT(a.currentTime); if (Math.round(a.currentTime) % 5 === 0) safeStorage.set(K_POS + k, String(a.currentTime)); };
    a.onplay = () => { setPlaying(true); setErr(null); };
    a.onpause = () => { setPlaying(false); safeStorage.set(K_POS + k, String(a.currentTime)); };
    a.onwaiting = () => setLoading(true);
    a.onplaying = a.oncanplay = () => setLoading(false);
    a.onended = () => { setPlaying(false); safeStorage.set(K_POS + k, '0'); };
    a.onerror = async () => {
      setLoading(false);
      if (blobUrl.current || retried) { setErr(navigator.onLine ? 'Could not play the recording. Try again, or use the device voice.' : 'You are offline and this lesson is not saved on this device.'); setPlaying(false); return; }
      retried = true; // the stream link carries a sign-in token that expires: get a fresh one and carry on
      const at = a.currentTime || t;
      a.src = await streamUrl(k); a.currentTime = at; a.play().catch(() => setPlaying(false));
    };
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: lesson.title, artist: `${mentor} · RamanFX`, album: source === 'seiden' ? 'Sam Seiden' : mentor });
      const ms = navigator.mediaSession;
      ms.setActionHandler('play', () => a.play());
      ms.setActionHandler('pause', () => a.pause());
      ms.setActionHandler('seekbackward', () => { a.currentTime = Math.max(0, a.currentTime - 15); });
      ms.setActionHandler('seekforward', () => { a.currentTime = Math.min(dur, a.currentTime + 30); });
      ms.setActionHandler('previoustrack', () => jumpChapter(-1));
      ms.setActionHandler('nexttrack', () => jumpChapter(1));
    }
    audio.current = a;
    a.currentTime = t >= dur - 2 ? 0 : t;
    return a;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [k, rec.h]);

  const toggle = async () => {
    setErr(null);
    if (!audio.current) setLoading(true);
    const a = await ensure();
    if (a.paused) a.play().catch(e => { setLoading(false); if (e?.name !== 'AbortError') setErr('Tap play again to start.'); });
    else a.pause();
  };
  const seek = async (s: number, play = false) => {
    s = Math.min(Math.max(0, s), dur - 0.5);
    setT(s); safeStorage.set(K_POS + k, String(s));
    if (!audio.current && !play) return;
    const a = await ensure(); a.currentTime = s;
    if (play && a.paused) a.play().catch(() => {});
  };
  const curT = () => audio.current?.currentTime ?? t;
  function jumpChapter(d: number) {
    const now = curT();
    let i = 0; chapters.forEach(([s], j) => { if (s <= now + 0.25) i = j; });
    // "previous" restarts the current chapter unless we're right at its start
    const target = d < 0 && now - chapters[i][0] > 3 ? i : Math.min(chapters.length - 1, Math.max(0, i + d));
    seek(chapters[target][0], true);
  }
  const setRate = (r: number) => { setRateS(r); safeStorage.set(K_RATE, String(r)); if (audio.current) audio.current.playbackRate = r; };

  const save = async () => {
    setErr(null); setDl(0);
    try { await saveOffline(k, rec, setDl); setSaved(true); } catch (e) { setErr((e as Error).message); }
    setDl(null);
  };
  const unsave = async () => { await removeSaved(k); setSaved(false); };

  const pct = dur ? Math.min(100, (t / dur) * 100) : 0;
  const bar = useRef<HTMLDivElement>(null);
  const fromX = (x: number) => { const r = bar.current?.getBoundingClientRect(); if (r) seek(((x - r.left) / r.width) * dur, playing); };
  const started = t > 1;

  return (
    <section aria-label="Listen to this lesson" className="card p-4 sm:p-5 relative overflow-hidden">
      <motion.div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
        animate={playing && !reduce ? { opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] } : { opacity: 0.25, scale: 1 }}
        transition={playing && !reduce ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }} />

      <div className="relative flex items-center gap-3.5 sm:gap-4">
        <div className="relative shrink-0">
          <PlayButton playing={playing} onClick={toggle} size={56} label={playing ? 'Pause lesson' : started ? 'Resume lesson' : 'Play lesson'} />
          {loading && <span aria-hidden="true" className="absolute -inset-1 rounded-full border-2 border-accent/30 border-t-accent animate-spin pointer-events-none" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-[0.08em] text-ink3">
            <Glyph d={G.headphones} size={13} />
            <span>Listen to this lesson</span>
            <Eq playing={playing} />
            {saved && <span className="normal-case tracking-normal font-medium text-profit">· Saved offline</span>}
          </div>
          <p className="text-title font-semibold truncate mt-0.5" aria-live="polite">{started ? chapters[ch][1] : lesson.title}</p>
          <p className="text-cap text-ink3 truncate">
            {started ? <>Chapter {ch + 1} of {chapters.length} · {fmtLeft(Math.round((dur - t) / rate))} left</> : <>Recorded narration · {fmtLeft(Math.round(dur / rate))} · {chapters.length} chapters</>}
          </p>
        </div>
      </div>

      <div className="relative mt-4">
        <div ref={bar} role="slider" tabIndex={0} aria-label="Lesson position" aria-valuemin={0} aria-valuemax={Math.round(dur)} aria-valuenow={Math.round(t)}
          aria-valuetext={`${clock(t)} of ${clock(dur)}, chapter ${ch + 1} of ${chapters.length}`}
          onPointerDown={e => fromX(e.clientX)}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') { e.preventDefault(); seek(curT() + 10, playing); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(curT() - 10, playing); }
            else if (e.key === 'PageDown') { e.preventDefault(); jumpChapter(1); }
            else if (e.key === 'PageUp') { e.preventDefault(); jumpChapter(-1); }
            else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
          }}
          className="group relative h-5 touch:h-7 flex items-center cursor-pointer select-none rounded-full">
          <div className="relative h-1.5 w-full rounded-full bg-raised overflow-hidden border border-line/60">
            <motion.div className="absolute inset-y-0 left-0 rounded-full bg-accent" animate={{ width: `${pct}%` }} transition={{ duration: 0.3, ease }} />
          </div>
          {chapters.map(([s], i) => i > 0 && (
            <span key={i} aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 h-2.5 w-[2px] rounded-full bg-surface/90" style={{ left: `${(s / dur) * 100}%` }} />
          ))}
          <motion.span aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -ml-[7px] h-3.5 w-3.5 rounded-full bg-ink shadow-[0_1px_4px_rgb(0_0_0/0.35)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
            animate={{ left: `${pct}%` }} transition={{ duration: 0.3, ease }} />
        </div>
        <div className="mt-1 flex justify-between text-micro text-ink3 tabular-nums">
          <span>{clock(t)}</span>
          <span>{clock(dur)}</span>
        </div>
      </div>

      <div className="relative mt-3 flex flex-wrap items-center gap-x-2 gap-y-2.5">
        <div className="flex items-center gap-0.5" role="group" aria-label="Skip">
          <IconBtn label="Previous chapter" onClick={() => jumpChapter(-1)} d={G.prevCh} fill />
          <IconBtn label="Back 15 seconds" onClick={() => seek(curT() - 15, playing)} d={G.back} />
          <IconBtn label="Forward 30 seconds" onClick={() => seek(curT() + 30, playing)} d={G.fwd} />
          <IconBtn label="Next chapter" onClick={() => jumpChapter(1)} d={G.nextCh} fill />
        </div>
        <div className="min-w-0 overflow-x-auto [scrollbar-width:none] -my-1 py-1">
          <Segmented size="sm" label="Playback speed" value={String(rate)} onChange={v => setRate(Number(v))} options={SPEEDS.map(s => ({ value: String(s), label: `${s}×` }))} />
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <Toggle on={panel === 'chapters'} onClick={() => setPanel(panel === 'chapters' ? 'none' : 'chapters')} label="Chapters" d={G.list} />
          <Toggle on={panel === 'offline'} onClick={() => setPanel(panel === 'offline' ? 'none' : 'offline')} label="Offline and voice" d={DL} />
        </div>
      </div>

      <Reveal show={panel === 'chapters'}>
        <ol className="grid gap-0.5 max-h-[320px] overflow-y-auto overscroll-contain -mx-1 px-1" aria-label="Chapters">
          {chapters.map(([s, title], i) => {
            const cur = i === ch && started;
            return (
              <li key={i}>
                <button type="button" onClick={() => seek(s, true)} aria-current={cur ? 'true' : undefined}
                  className={cx('w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors', cur ? 'bg-accent/10 text-ink' : 'hover:bg-raised text-ink2')}>
                  <span className={cx('h-6 w-6 shrink-0 grid place-items-center rounded-full text-micro font-semibold tabular-nums', cur ? 'bg-accent text-on-accent' : 'bg-raised text-ink2')}>{i + 1}</span>
                  <span className="min-w-0 flex-1 text-body truncate">{title}</span>
                  <span className="text-micro text-ink3 tabular-nums">{clock(s)}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </Reveal>

      <Reveal show={panel === 'offline'}>
        <div className="grid gap-3 text-body">
          <div className="flex flex-wrap items-center gap-2">
            {dl !== null
              ? <span className="flex-1 min-w-[180px]"><span className="text-cap text-ink2">Saving to this device… {Math.round(dl * 100)}%</span>
                  <span aria-hidden="true" className="mt-1 block h-[3px] w-full rounded-full bg-raised overflow-hidden"><span className="block h-full bg-accent rounded-full transition-[width] duration-300" style={{ width: `${dl * 100}%` }} /></span></span>
              : saved
                ? <><span className="text-cap text-profit flex-1">Saved on this device ({mbs(rec.b)}). Plays without internet.</span><button type="button" className="btn" onClick={unsave}>Remove</button></>
                : <><span className="text-cap text-ink2 flex-1">Save this lesson for offline listening ({mbs(rec.b)}).</span><button type="button" className="btn-primary" onClick={save}><Glyph d={DL} size={14} />Save offline</button></>}
          </div>
          <SaveAll source={source} mentor={mentor} onDone={() => isSaved(k, rec.h).then(setSaved)} />
          <p className="text-cap text-ink3">Narrated by a studio-quality male voice, streamed privately from your Google Drive. <button type="button" className="text-accent hover:underline" onClick={onDevice}>Use the device voice instead</button> (reads the notes live, any lesson).</p>
        </div>
      </Reveal>

      {err && <p role="alert" className="relative mt-3 text-cap text-warn">{err}</p>}
    </section>
  );
}

const DL = 'M12 4v11M7 10.5l5 5 5-5M5 19.5h14';

/** One tap to keep every recorded lesson of this mentor on the device. */
function SaveAll({ source, mentor, onDone }: { source: string; mentor: string; onDone: () => void }) {
  const [items, setItems] = useState<[string, Recorded][]>([]);
  const [missing, setMissing] = useState<number | null>(null);
  const [run, setRun] = useState<{ i: number; n: number } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const stop = useRef<AbortController | null>(null);
  const check = useCallback(async () => {
    const all = Object.entries(await recordedIndex()).filter(([key]) => key.startsWith(source + ':'));
    const miss: [string, Recorded][] = [];
    for (const e of all) if (!(await isSaved(e[0], e[1].h))) miss.push(e);
    setItems(miss); setMissing(miss.length);
  }, [source]);
  useEffect(() => { check(); }, [check]);
  const go = async () => {
    setErr(null); stop.current = new AbortController();
    try {
      for (let i = 0; i < items.length; i++) { setRun({ i, n: items.length }); await saveOffline(items[i][0], items[i][1], undefined, stop.current.signal); }
    } catch (e) { if ((e as Error).name !== 'AbortError') setErr((e as Error).message); }
    setRun(null); check(); onDone();
  };
  if (missing === null) return null;
  const name = source === 'zoom' ? 'Sunday live' : source === 'daily' ? 'daily breakdown' : mentor;
  if (missing === 0) return <p className="text-cap text-ink3">All recorded {name} lessons are saved on this device.</p>;
  const total = items.reduce((a, [, r]) => a + r.b, 0);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {run
        ? <><span className="text-cap text-ink2 flex-1">Saving lesson {run.i + 1} of {run.n}…</span><button type="button" className="btn" onClick={() => stop.current?.abort()}>Stop</button></>
        : <><span className="text-cap text-ink2 flex-1">{missing} {name} lesson{missing > 1 ? 's' : ''} not saved yet ({mbs(total)}).</span><button type="button" className="btn" onClick={go}>Save all</button></>}
      {err && <span role="alert" className="w-full text-cap text-warn">{err}</span>}
    </div>
  );
}
