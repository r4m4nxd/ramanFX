// "Listen to this lesson": a calm audiobook-style player that reads the lesson notes aloud as a lively script.
// <ListenBar lesson={l} mentor="Kevin" /> at the top of a lesson. Web Speech API only; no audio files.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { buildNarration } from '@/core/narration';
import type { VideoLesson } from '@/core/videoLessons';
import { cx, ease, Segmented, spring } from '../kit';
import { speak, useSpeech, type WordRange } from './useSpeech';
import { currentVoice, isRecommended, safeStorage, sortVoices, voiceLabel } from './voices';

// ─── Icons (player glyphs the shared set doesn't have) ────────────────
const G = {
  play: 'M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z',
  pause: 'M7 5h3.2v14H7zM13.8 5H17v14h-3.2z',
  back: 'M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5',
  fwd: 'M20 12a8 8 0 1 1-2.4-5.7M20 4v4.5h-4.5',
  prevCh: 'M6 5v14M19 5.8v12.4a.8.8 0 0 1-1.25.66L9 12.66a.8.8 0 0 1 0-1.32l8.75-6.2A.8.8 0 0 1 19 5.8Z',
  nextCh: 'M18 5v14M5 5.8v12.4a.8.8 0 0 0 1.25.66L15 12.66a.8.8 0 0 0 0-1.32L6.25 5.14A.8.8 0 0 0 5 5.8Z',
  list: 'M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01',
  text: 'M4 6h16M4 10h16M4 14h10M4 18h7',
  voice: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3ZM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7',
  headphones: 'M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5Z',
  speaker: 'M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11',
  x: 'M6 6l12 12M18 6 6 18',
  up: 'M6 15l6-6 6 6',
};
function Glyph({ d, size = 18, fill = false, className }: { d: string; size?: number; fill?: boolean; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}
      fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const SPEEDS = [0.9, 1, 1.25, 1.5, 1.75, 2];
const nearestSpeed = (r: number) => SPEEDS.reduce((a, b) => (Math.abs(b - r) < Math.abs(a - r) ? b : a), SPEEDS[0]);
const fmtLeft = (sec: number) => (sec >= 3600 ? `${Math.floor(sec / 3600)} h ${Math.round((sec % 3600) / 60)} min` : sec >= 60 ? `${Math.round(sec / 60)} min` : `${Math.max(0, sec)} s`);
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
const K_FOLLOW = 'rfx_listen_follow';
const editable = (el: EventTarget | null) => el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

const HINT = 'Best voices: Microsoft Edge (Natural voices) or Chrome; on iPhone use Settings > Accessibility > Spoken Content > Voices to download an Enhanced voice.';

export function ListenBar({ lesson, mentor = 'Kevin', className }: { lesson: VideoLesson; mentor?: string; className?: string }) {
  const chapters = useMemo(() => buildNarration(lesson, mentor), [lesson, mentor]);
  const id = `${lesson.kind}-${lesson.n}-${slug(lesson.title)}`;
  const sp = useSpeech({ id, chapters, title: lesson.title, artist: mentor, album: lesson.kind === 'zoom' ? `${mentor} · Zoom sessions` : `${mentor} · Lessons` });
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [panel, setPanel] = useState<'none' | 'chapters' | 'voice'>('none');
  const [follow, setFollowState] = useState(() => safeStorage.get(K_FOLLOW) === '1');
  const setFollow = (v: boolean) => { setFollowState(v); safeStorage.set(K_FOLLOW, v ? '1' : '0'); };
  const [offscreen, setOffscreen] = useState(false);
  const [miniClosed, setMiniClosed] = useState(false);
  const playing = sp.status === 'playing';
  const seg = sp.segments[sp.index];

  // Sticky mini-player once the card scrolls out of view.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [sp.supported]);
  useEffect(() => { if (playing) setMiniClosed(false); }, [playing]);

  // Global shortcuts while a lesson is playing or paused and nothing else has focus.
  const spRef = useRef(sp); spRef.current = sp;
  useEffect(() => {
    if (!sp.started) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || editable(e.target)) return;
      const t = e.target as HTMLElement | null;
      if (t && t !== document.body && !rootRef.current?.contains(t) && !t.closest('[data-listen-mini]')) return;
      if (rootRef.current?.contains(t)) return; // the card's own handler runs
      if (handleKey(e, spRef.current)) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sp.started]);

  if (!sp.supported) {
    return (
      <section aria-label="Listen to this lesson" className={cx('card p-4 flex items-start gap-3', className)}>
        <span className="mt-0.5 text-ink3"><Glyph d={G.headphones} /></span>
        <div className="min-w-0">
          <p className="text-ui font-semibold">Listening isn't available in this browser</p>
          <p className="text-cap text-ink3 mt-1">Your browser doesn't support read-aloud (speech synthesis). Try Microsoft Edge, Chrome or Safari, and you can listen to every lesson like an audiobook.</p>
        </div>
      </section>
    );
  }

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (editable(e.target)) return;
    const onButton = e.target instanceof HTMLButtonElement || (e.target as HTMLElement).getAttribute?.('role') === 'slider';
    if (e.key === ' ' && onButton) return; // the focused control handles Space itself
    if (handleKey(e.nativeEvent, sp)) e.preventDefault();
  };

  const statusText = playing ? 'Playing' : sp.status === 'paused' ? 'Paused' : sp.status === 'ended' ? 'Finished' : sp.index > 0 ? 'Pick up where you left off' : `${chapters.length} chapters · about ${fmtLeft(sp.totalSec)}`;
  const chTitle = chapters[sp.chapter]?.title ?? '';

  return (
    <>
      <section ref={rootRef} aria-label="Listen to this lesson" onKeyDown={onKeyDown}
        className={cx('card p-4 sm:p-5 relative overflow-hidden', className)}>
        {/* A soft accent wash that breathes while playing: alive, not loud. */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
          animate={playing && !reduce ? { opacity: [0.35, 0.7, 0.35], scale: [1, 1.08, 1] } : { opacity: 0.25, scale: 1 }}
          transition={playing && !reduce ? { duration: 5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }} />

        <div className="relative flex items-center gap-3.5 sm:gap-4">
          <PlayButton playing={playing} onClick={sp.toggle} size={56} label={playing ? 'Pause lesson' : sp.index > 0 && sp.status !== 'ended' ? 'Resume lesson' : 'Play lesson'} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-micro font-semibold uppercase tracking-[0.08em] text-ink3">
              <Glyph d={G.headphones} size={13} />
              <span>Listen to this lesson</span>
              <Eq playing={playing} />
            </div>
            <p className="text-title font-semibold truncate mt-0.5" aria-live="polite">{sp.started ? chTitle : lesson.title}</p>
            <p className="text-cap text-ink3 truncate">
              {sp.started && sp.status !== 'ended' ? <>Chapter {sp.chapter + 1} of {chapters.length} · {fmtLeft(sp.remainingSec)} left</> : statusText}
            </p>
          </div>
        </div>

        <Progress sp={sp} />

        <div className="relative mt-3 flex flex-wrap items-center gap-x-2 gap-y-2.5">
          <div className="flex items-center gap-0.5" role="group" aria-label="Skip">
            <IconBtn label="Previous chapter" onClick={sp.prevChapter} d={G.prevCh} fill />
            <IconBtn label="Back one sentence" onClick={sp.prev} d={G.back} />
            <IconBtn label="Forward one sentence" onClick={sp.next} d={G.fwd} />
            <IconBtn label="Next chapter" onClick={sp.nextChapter} d={G.nextCh} fill />
          </div>
          <div className="min-w-0 overflow-x-auto [scrollbar-width:none] -my-1 py-1">
            <Segmented size="sm" label="Playback speed" value={String(nearestSpeed(sp.prefs.rate))}
              onChange={v => sp.setRate(Number(v))} options={SPEEDS.map(s => ({ value: String(s), label: `${s}×` }))} />
          </div>
          <div className="flex items-center gap-1 ml-auto">
            <Toggle on={follow} onClick={() => setFollow(!follow)} label="Follow along" d={G.text} />
            <Toggle on={panel === 'chapters'} onClick={() => setPanel(panel === 'chapters' ? 'none' : 'chapters')} label="Chapters" d={G.list} />
            <Toggle on={panel === 'voice'} onClick={() => setPanel(panel === 'voice' ? 'none' : 'voice')} label="Voice" d={G.voice} />
          </div>
        </div>

        <Reveal show={follow}>
          <FollowAlong sp={sp} />
        </Reveal>
        <Reveal show={panel === 'chapters'}>
          <ChapterList sp={sp} />
        </Reveal>
        <Reveal show={panel === 'voice'}>
          <VoicePanel sp={sp} />
        </Reveal>

        {sp.state.blocked && <p role="alert" className="relative mt-3 text-cap text-warn">Tap play to start. Your browser needs a tap before it can speak.</p>}
        <p className="sr-only" aria-live="polite">{seg && sp.status === 'playing' && seg.firstOfChapter ? `Chapter: ${chTitle}` : ''}</p>
      </section>

      <MiniPlayer show={offscreen && sp.started && sp.status !== 'ended' && !miniClosed} sp={sp} title={lesson.title} chTitle={chTitle}
        follow={follow} onBack={() => rootRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })}
        onClose={() => { sp.pause(); setMiniClosed(true); }} />
    </>
  );
}

type SP = ReturnType<typeof useSpeech>;

function handleKey(e: KeyboardEvent, sp: SP) {
  if (e.key === ' ' || e.key === 'k' || e.key === 'K') { sp.toggle(); return true; }
  if (e.key === 'ArrowRight') { if (e.shiftKey) sp.nextChapter(); else sp.next(); return true; }
  if (e.key === 'ArrowLeft') { if (e.shiftKey) sp.prevChapter(); else sp.prev(); return true; }
  return false;
}

// ─── Pieces ───────────────────────────────────────────────────────────

function PlayButton({ playing, onClick, size, label }: { playing: boolean; onClick: () => void; size: number; label: string }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} aria-pressed={playing}
      style={{ width: size, height: size }}
      className="btn-primary !h-auto !px-0 !rounded-full shrink-0 press">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={playing ? 'p' : 'l'} className="grid place-items-center"
          initial={{ opacity: 0, scale: 0.6, filter: 'blur(3px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.6, filter: 'blur(3px)' }}
          transition={{ duration: 0.18, ease }}>
          <Glyph d={playing ? G.pause : G.play} size={Math.round(size * 0.42)} fill className={playing ? '' : 'translate-x-[1.5px]'} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function IconBtn({ label, onClick, d, fill }: { label: string; onClick: () => void; d: string; fill?: boolean }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="h-9 w-9 touch:h-11 touch:w-11 grid place-items-center rounded-full text-ink2 hover:text-ink hover:bg-raised transition-colors press">
      <Glyph d={d} size={fill ? 16 : 18} fill={fill} />
    </button>
  );
}

function Toggle({ on, onClick, label, d }: { on: boolean; onClick: () => void; label: string; d: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} aria-label={label} title={label}
      className={cx('h-8 touch:h-10 inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 text-xs font-semibold border transition-colors press',
        on ? 'pill-on text-ink border-transparent' : 'border-line2 bg-raised/60 text-ink3 hover:text-ink')}>
      <Glyph d={d} size={15} />
      <span className="hidden sm:inline" aria-hidden="true">{label}</span>
    </button>
  );
}

/** Three little bars that dance while the voice is speaking. */
function Eq({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span aria-hidden="true" className={cx('inline-flex items-end gap-[2px] h-3 transition-opacity', playing ? 'opacity-100 text-accent' : 'opacity-0')}>
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-[3px] rounded-full bg-current origin-bottom" style={{ height: 12 }}
          animate={playing && !reduce ? { scaleY: [0.35, 1, 0.5, 0.85, 0.35] } : { scaleY: 0.4 }}
          transition={playing && !reduce ? { duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut', delay: i * 0.12 } : { duration: 0.2 }} />
      ))}
    </span>
  );
}

function Reveal({ show, children }: { show: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div className="relative overflow-hidden"
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }} animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }} exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease }}>
          <div className="pt-3">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Progress({ sp }: { sp: SP }) {
  const ref = useRef<HTMLDivElement>(null);
  const pct = Math.round(sp.progress * 1000) / 10;
  const from = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    sp.seekFraction(Math.min(1, Math.max(0, (clientX - r.left) / r.width)), sp.status === 'playing');
  };
  return (
    <div className="relative mt-4">
      <div ref={ref} role="slider" tabIndex={0} aria-label="Lesson position" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} percent, chapter ${sp.chapter + 1} of ${sp.chapters.length}, ${fmtLeft(sp.remainingSec)} left`}
        onPointerDown={e => from(e.clientX)}
        onKeyDown={e => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); sp.next(); }
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); sp.prev(); }
          else if (e.key === 'PageDown') { e.preventDefault(); e.stopPropagation(); sp.nextChapter(); }
          else if (e.key === 'PageUp') { e.preventDefault(); e.stopPropagation(); sp.prevChapter(); }
          else if (e.key === 'Home') { e.preventDefault(); sp.seek(0); }
          else if (e.key === 'End') { e.preventDefault(); sp.seekChapter(sp.chapters.length - 1); }
          else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); sp.toggle(); }
        }}
        className="group relative h-5 touch:h-7 flex items-center cursor-pointer select-none rounded-full">
        <div className="relative h-1.5 w-full rounded-full bg-raised overflow-hidden border border-line/60">
          <motion.div className="absolute inset-y-0 left-0 rounded-full bg-accent" animate={{ width: `${pct}%` }} transition={{ duration: 0.45, ease }} />
        </div>
        {/* Chapter ticks */}
        {sp.chapters.map((c, i) => i > 0 && (
          <span key={c.id} aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 h-2.5 w-[2px] rounded-full bg-surface/90" style={{ left: `${sp.chapterFraction(i) * 100}%` }} />
        ))}
        <motion.span aria-hidden="true" className="absolute top-1/2 -translate-y-1/2 -ml-[7px] h-3.5 w-3.5 rounded-full bg-ink shadow-[0_1px_4px_rgb(0_0_0/0.35)] opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity"
          animate={{ left: `${pct}%` }} transition={{ duration: 0.45, ease }} />
      </div>
      <div className="mt-1 flex justify-between text-micro text-ink3 tabular-nums">
        <span>{Math.round(sp.progress * 100)}%</span>
        <span>{sp.status === 'ended' ? 'Done. Nice work.' : `${fmtLeft(sp.remainingSec)} left`}</span>
      </div>
    </div>
  );
}

function ChapterList({ sp }: { sp: SP }) {
  return (
    <ol className="grid gap-0.5 max-h-[320px] overflow-y-auto overscroll-contain -mx-1 px-1" aria-label="Chapters">
      {sp.chapters.map((c, i) => {
        const cur = i === sp.chapter && sp.started;
        const done = sp.started && i < sp.chapter;
        return (
          <li key={c.id}>
            <button type="button" onClick={() => sp.seekChapter(i, true)} aria-current={cur ? 'true' : undefined}
              className={cx('w-full flex items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors', cur ? 'bg-accent/10 text-ink' : 'hover:bg-raised text-ink2')}>
              <span className={cx('h-6 w-6 shrink-0 grid place-items-center rounded-full text-micro font-semibold tabular-nums',
                cur ? 'bg-accent text-on-accent' : done ? 'bg-raised text-ink3 line-through' : 'bg-raised text-ink2')}>{i + 1}</span>
              <span className="min-w-0 flex-1 text-body truncate">{c.title}</span>
              {cur && <span className="text-micro font-semibold text-accent">{sp.status === 'playing' ? 'Now playing' : 'Here'}</span>}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Split a sentence into word tokens with their character offsets. */
function tokens(text: string) {
  const out: { w: string; start: number; end: number }[] = [];
  const re = /\S+\s*/g;
  for (let m; (m = re.exec(text));) out.push({ w: m[0], start: m.index, end: m.index + m[0].trimEnd().length });
  return out;
}

function Karaoke({ text, word, live }: { text: string; word: WordRange | null; live: boolean }) {
  const toks = useMemo(() => tokens(text), [text]);
  const at = live && word ? toks.findIndex(t => word.start < t.end + 1 && word.start >= t.start - 1) : -1;
  return (
    <>
      {toks.map((t, k) => (
        <span key={k} className={cx('transition-colors duration-150', at < 0 ? 'text-ink' : k < at ? 'text-ink' : k === at ? 'text-ink' : 'text-ink2')}>
          <span className={cx('rounded-[5px] transition-[background-color,box-shadow] duration-150', k === at && 'bg-accent/25 shadow-[0_0_0_3px_rgb(var(--accent)/0.25)]')}>{t.w.trimEnd()}</span>
          {t.w.slice(t.w.trimEnd().length)}
        </span>
      ))}
    </>
  );
}

function FollowAlong({ sp }: { sp: SP }) {
  const box = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLParagraphElement>(null);
  const userScrollAt = useRef(0);
  const reduce = useReducedMotion();
  const seg = sp.segments[sp.index];
  const ch = seg?.chapter ?? 0;
  const list = useMemo(() => sp.segments.map((s, i) => ({ s, i })).filter(x => x.s.chapter === ch), [sp.segments, ch]);

  useLayoutEffect(() => {
    const b = box.current, c = curRef.current;
    if (!b || !c || performance.now() - userScrollAt.current < 4000) return;
    const top = c.offsetTop - b.clientHeight / 2 + c.clientHeight / 2;
    b.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' });
  }, [sp.index, reduce]);

  const live = sp.status === 'playing';
  return (
    <div className="rounded-2xl border border-line/70 bg-raised/40">
      <div className="flex items-center justify-between px-3.5 pt-2.5 text-micro font-semibold uppercase tracking-[0.08em] text-ink3">
        <span className="truncate">{sp.chapters[ch]?.title}</span>
        <span className="tabular-nums shrink-0">{ch + 1}/{sp.chapters.length}</span>
      </div>
      <div ref={box} onWheel={() => { userScrollAt.current = performance.now(); }} onTouchMove={() => { userScrollAt.current = performance.now(); }}
        className="relative max-h-[300px] sm:max-h-[340px] overflow-y-auto overscroll-contain px-3.5 pb-4 pt-2 scroll-py-8 [mask-image:linear-gradient(to_bottom,transparent,black_24px,black_calc(100%-28px),transparent)]">
        {list.map(({ s, i }) => {
          const cur = i === sp.index;
          return (
            <p key={i} ref={cur ? curRef : undefined} onClick={() => sp.seek(i, true)} aria-current={cur ? 'true' : undefined}
              className={cx('cursor-pointer rounded-lg transition-[color,font-size,opacity] duration-300 ease-out py-1.5',
                cur ? 'text-[19px] sm:text-[22px] leading-[1.35] font-semibold tracking-[-0.01em]' : i < sp.index ? 'text-body text-ink3/80 hover:text-ink2' : 'text-ui text-ink2 hover:text-ink')}>
              {cur ? <Karaoke text={s.text} word={sp.word} live={live} /> : s.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function VoicePanel({ sp }: { sp: SP }) {
  const id = useId();
  const sorted = useMemo(() => sortVoices(sp.voices), [sp.voices]);
  const rec = sorted.filter(isRecommended).slice(0, 8);
  const rest = sorted.filter(v => !rec.includes(v));
  const auto = sorted[0];
  const active = currentVoice();
  const [previewing, setPreviewing] = useState(false);
  const stopRef = useRef<() => void>();
  useEffect(() => () => stopRef.current?.(), []);
  const preview = () => {
    if (previewing) { stopRef.current?.(); return; }
    setPreviewing(true);
    stopRef.current = speak(`Hi! This is how your lessons will sound. Quick question: ready to trade with the big players?`, { onEnd: () => setPreviewing(false) });
  };
  return (
    <div className="rounded-2xl border border-line/70 bg-raised/40 p-3.5 grid gap-3">
      <div className="grid gap-1.5">
        <label htmlFor={id} className="text-cap font-semibold text-ink2">Voice</label>
        <div className="flex gap-2">
          <select id={id} className="field h-9 touch:h-11 px-3 text-[13px] min-w-0 flex-1"
            value={sp.prefs.voiceURI && sorted.some(v => v.voiceURI === sp.prefs.voiceURI) ? sp.prefs.voiceURI : ''}
            onChange={e => sp.setVoice(e.target.value || null)} disabled={!sorted.length}>
            <option value="">{sorted.length ? `Automatic (best: ${auto ? voiceLabel(auto) : 'system'})` : 'Loading voices…'}</option>
            {rec.length > 0 && (
              <optgroup label="Recommended: most natural">
                {rec.map(v => <option key={v.voiceURI} value={v.voiceURI}>★ {voiceLabel(v)}</option>)}
              </optgroup>
            )}
            {rest.length > 0 && (
              <optgroup label="Other English voices">
                {rest.map(v => <option key={v.voiceURI} value={v.voiceURI}>{voiceLabel(v)}</option>)}
              </optgroup>
            )}
          </select>
          <button type="button" className="btn shrink-0 touch:h-11" onClick={preview} aria-pressed={previewing}>
            <Glyph d={previewing ? G.pause : G.speaker} size={15} fill={previewing} />
            {previewing ? 'Stop' : 'Preview'}
          </button>
        </div>
        {active && <p className="text-micro text-ink3">Speaking with {voiceLabel(active)}{isRecommended(active) ? ', a natural voice' : ''}.</p>}
      </div>
      <div className="grid gap-1.5">
        <label htmlFor={`${id}-p`} className="flex justify-between text-cap font-semibold text-ink2"><span>Pitch</span><span className="tabular-nums text-ink3 font-normal">{sp.prefs.pitch.toFixed(2)}</span></label>
        <input id={`${id}-p`} type="range" min={0.8} max={1.2} step={0.05} value={sp.prefs.pitch} onChange={e => sp.setPitch(Number(e.target.value))}
          className="w-full h-6 !bg-transparent !border-0 !ring-0 accent-[rgb(var(--accent))]" />
      </div>
      <p className="text-micro text-ink3 leading-relaxed">{HINT}</p>
      <p className="text-micro text-ink3">Keys: Space play or pause, ← → one sentence, Shift + ← → one chapter.</p>
    </div>
  );
}

function MiniPlayer({ show, sp, title, chTitle, follow, onBack, onClose }: { show: boolean; sp: SP; title: string; chTitle: string; follow: boolean; onBack: () => void; onClose: () => void }) {
  const reduce = useReducedMotion();
  if (typeof document === 'undefined') return null;
  const playing = sp.status === 'playing';
  const seg = sp.segments[sp.index];
  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div data-listen-mini="" role="region" aria-label="Lesson audio player"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
          transition={spring}
          className="glass-pop fixed z-40 inset-x-3 mx-auto max-w-[560px] rounded-[22px] p-2 pr-2.5 flex items-center gap-2.5 shadow-pop
            bottom-[calc(max(12px,env(safe-area-inset-bottom))+76px)] lg:bottom-5 land:bottom-3"
          onKeyDown={e => { if (e.key === ' ' && e.target instanceof HTMLButtonElement) return; if (handleKey(e.nativeEvent, sp)) e.preventDefault(); }}>
          <PlayButton playing={playing} onClick={sp.toggle} size={42} label={playing ? 'Pause lesson' : 'Resume lesson'} />
          <button type="button" onClick={onBack} className="min-w-0 flex-1 text-left" aria-label="Back to the lesson player">
            <p className="text-body font-semibold truncate">{chTitle || title}</p>
            <p className="text-micro text-ink3 truncate">{follow && seg && playing ? seg.text : `${title} · ${fmtLeft(sp.remainingSec)} left`}</p>
            <span aria-hidden="true" className="mt-1 block h-[3px] w-full rounded-full bg-raised overflow-hidden">
              <span className="block h-full bg-accent rounded-full transition-[width] duration-500" style={{ width: `${sp.progress * 100}%` }} />
            </span>
          </button>
          <IconBtn label="Back one sentence" onClick={sp.prev} d={G.back} />
          <IconBtn label="Forward one sentence" onClick={sp.next} d={G.fwd} />
          <IconBtn label="Pause and close player" onClick={onClose} d={G.x} />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default ListenBar;
