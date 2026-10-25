import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { VIDEO_LESSONS, type VideoLesson } from '@/core/videoLessons';
import { ZOOM_SESSIONS, type ZoomSession } from '@/core/zoomSessions';
import { SEIDEN_LESSONS } from '@/core/mentors/seiden';
import { RAJA_LESSONS } from '@/core/mentors/raja';
import { BAKER_LESSONS } from '@/core/mentors/baker';
import { KEVIN_COURSE } from '@/core/mentors/kevin';
import { KEVIN_ZOOM } from '@/core/mentors/kevin/zoom';
import { KEVIN_DAILY } from '@/core/mentors/kevin/daily';
import { LessonListen } from '@/ui/listen/RecordedPlayer';
import { GLOSSARY, type GlossaryMentor } from '@/core/glossary';
import { LessonFigures, RealCharts } from '@/ui/LessonMedia';
import { GlossaryView } from '@/ui/GlossaryView';
import { Badge, Card, cx, Page, RevealText, spring } from '@/ui/kit';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@/ui/Icon';
import { hasDiagram, LessonDiagram } from '@/ui/LessonDiagrams';
import { lessonKey, mastery, mentorMastery, mentorOfSrc, useDueCount, useTeachVersion } from '@/ui/teach/store';
import { useInteractiveData } from '@/ui/teach/data';
import { MasteryRing } from '@/ui/teach/Mastery';
// The interactive layer (scenes, quizzes, flashcards) loads as its own chunk, only when a lesson or the review opens.
const LearnIt = lazy(() => import('@/ui/teach/LearnIt'));
const Reader = lazy(() => import('@/ui/reader/Reader'));
const ReviewMode = lazy(() => import('@/ui/teach/Flashcards').then(m => ({ default: m.ReviewMode })));
const TeachFallback = () => <Card aria-label="Loading"><div className="h-6 w-40 rounded bg-raised/60 animate-pulse" /><div className="h-48 mt-4 rounded-xl bg-raised/40 animate-pulse" /></Card>;

type Mentor = 'course' | 'zoom' | 'daily' | 'seiden' | 'raja' | 'baker';
type Src = Mentor | 'glossary' | 'review';
// one entry per mentor source; lessons stay separate per mentor
const SRC: Record<Mentor, { list: VideoLesson[]; key: string; short: string; head: string; title: string; blurb: string; start: string; noun: string; name: string }> = {
  course: { list: KEVIN_COURSE, key: 'rfx_lessons_done', short: 'Kevin · course', head: 'Video course', title: "Your mentor's video course, as notes", blurb: `All ${VIDEO_LESSONS.length} lessons written out with diagrams, his rules, the mistakes he warns about and a pre-trade check for each. Pick a lesson on the left. The Planner, Playbook and Guru link back here.`, start: 'Start lesson 1', noun: 'lessons', name: 'Kevin' },
  zoom: { list: KEVIN_ZOOM, key: 'rfx_zoom_done', short: 'Kevin · Sunday live', head: 'Sunday Zoom sessions', title: 'Sunday live sessions, as notes', blurb: `All ${ZOOM_SESSIONS.length} Sunday Zoom livestreams written out in full: every chart he walked through, every student question, the rules and mistakes, diagrams, and the rules as mechanical checks for the Planner and the bot.`, start: 'Start with the first session', noun: 'sessions', name: 'Kevin' },
  daily: { list: KEVIN_DAILY, key: 'rfx_daily_done', short: 'Kevin · daily plans', head: 'Daily breakdowns', title: 'Daily pre-session plans, as notes', blurb: `${KEVIN_DAILY.length} daily breakdowns Kevin recorded the evening before each session (Jul-Oct 2026): his bias per market, the zones he is watching, the exact conditions to act, and his own reviews of how they played out, with his marked-up charts.`, start: 'Start with the newest plan', noun: 'plans', name: 'Kevin' },
  seiden: { list: SEIDEN_LESSONS, key: 'rfx_seiden_done', short: 'Sam Seiden', head: 'Sam Seiden · 5 years of articles', title: 'Sam Seiden, 5 years of teaching, as notes', blurb: `All ${SEIDEN_LESSONS.length} articles from the 423-page collection: the teaching, every chart described (zones, entries, stops, targets), his rules, novice mistakes, a pre-trade check, and what differs from Kevin's course. Lesson numbers are the PDF page each article starts on.`, start: 'Start with the first article', noun: 'articles', name: 'Sam Seiden' },
  raja: { list: RAJA_LESSONS, key: 'rfx_raja_done', short: 'Raja', head: 'Raja · complete course', title: "Raja's course, as notes", blurb: `All ${RAJA_LESSONS.length} of Raja's lessons and sessions written out from the transcripts: strong zones (CP and arrival zones), change of direction and the curve, location and momentum, realignment, and his live sessions. Each has his rules, the mistakes he warns about and a pre-trade check. Uncertain readings of the captions are marked (likely).`, start: 'Start with the first lesson', noun: 'lessons', name: 'Raja' },
  baker: { list: BAKER_LESSONS, key: 'rfx_baker_done', short: 'Kevin Baker', head: 'Kevin Baker · the book', title: "Kevin Baker's book, as notes", blurb: `All ${BAKER_LESSONS.length} chapters of "We Don't Need No Stinkin' Indicators": candles, plotting zones, zone strength, investing, swing and day trading, gaps and broken zones, risk, stops and targets, the trading plan and options. Real charts from the book plus diagrams. Kevin Baker is a different person from your video-course mentor Kevin.`, start: 'Start with chapter 1', noun: 'chapters', name: 'Kevin Baker' },
};
/** The checklist that goes with each lesson source (all three Kevin sources share his). */
const CHECK_OF: Record<Src, { m: string; name: string }> = { course: { m: 'kevin', name: 'Kevin' }, zoom: { m: 'kevin', name: 'Kevin' }, daily: { m: 'kevin', name: 'Kevin' }, raja: { m: 'raja', name: 'Raja' }, seiden: { m: 'seiden', name: 'Seiden' }, baker: { m: 'baker', name: 'Baker' }, glossary: { m: 'raja', name: 'Raja' }, review: { m: 'raja', name: 'Raja' } };
const srcOf = (v: string | null): Src => v === 'zoom' || v === 'daily' || v === 'seiden' || v === 'raja' || v === 'baker' || v === 'glossary' || v === 'review' ? v : 'course';
const GLOSS_FILTERS: { value: GlossaryMentor | 'all'; label: string }[] = [{ value: 'all', label: 'All' }, { value: 'kevin', label: 'Kevin' }, { value: 'seiden', label: 'Seiden' }, { value: 'baker', label: 'Baker' }, { value: 'bot', label: 'Bot' }];
function useDone(key: string) {
  const [done, setDone] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; } });
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { /* storage blocked */ } }, [key]);
  const toggle = (n: number) => setDone(d => { const next = d.includes(n) ? d.filter(x => x !== n) : [...d, n]; try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage blocked */ } return next; });
  return [done, toggle] as const;
}

/** The last lesson opened per source, so "Continue where you left off" picks up after it. */
const lastKey = (src: string) => `rfx_learn_last_${src}`;
const readLast = (src: string): number | null => { try { const v = Number(localStorage.getItem(lastKey(src))); return v > 0 ? v : null; } catch { return null; } };
const writeLast = (src: string, n: number) => { try { localStorage.setItem(lastKey(src), String(n)); } catch { /* storage blocked */ } };
/** The next unstudied lesson after the last one opened, wrapping to the first unstudied. */
function nextUnstudied(list: VideoLesson[], done: number[], last: number | null): VideoLesson | undefined {
  const at = last == null ? -1 : list.findIndex(l => l.n === last);
  return list.slice(at + 1).find(l => !done.includes(l.n)) ?? list.find(l => !done.includes(l.n));
}

const KIND: Record<VideoLesson['kind'], string> = { video: 'Video', webinar: 'Webinar', podcast: 'Podcast', zoom: 'Zoom', article: 'Article' };
const isZoom = (l: VideoLesson): l is ZoomSession => 'qa' in l;
const fmtDate = (d: string, long = false) => new Date(d + 'T12:00:00').toLocaleDateString(undefined, long ? { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' } : { day: 'numeric', month: 'short' });

function Bullets({ items, tone }: { items: string[]; tone?: 'profit' | 'loss' | 'accent' }) {
  const dot = tone === 'profit' ? 'bg-profit' : tone === 'loss' ? 'bg-loss' : tone === 'accent' ? 'bg-accent' : 'bg-ink3';
  return (
    <ul className="flex flex-col gap-2">
      {items.map((p, i) => <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink2"><span className={cx('mt-[9px] w-1.5 h-1.5 rounded-full shrink-0', dot)} />{p}</li>)}
    </ul>
  );
}

function LessonView({ l, src, list, done, toggle, interactive }: { l: VideoLesson; src: Mentor; list: VideoLesson[]; done: boolean; toggle: () => void; interactive: boolean }) {
  const i = list.findIndex(x => x.n === l.n);
  const prev = list[i - 1], next = list[i + 1];
  const diagrams = l.diagrams.filter(d => hasDiagram(d.key));
  const z = isZoom(l) ? l : null;
  const q = (n: number) => src === 'course' ? `/learn?l=${n}` : `/learn?src=${src}&l=${n}`;
  const [reading, setReading] = useState(false);
  useEffect(() => setReading(false), [src, l.n]);
  const mentor = src === 'seiden' ? 'Sam Seiden' : src === 'raja' ? 'Raja' : src === 'baker' ? 'Kevin Baker' : 'Kevin';
  const label = z ? `Sunday live · ${fmtDate(z.date)}` : src === 'seiden' ? `Page ${l.n}` : src === 'baker' ? `Chapter ${l.n}` : `Lesson ${l.n}`;
  return (
    <article className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {z ? <><Badge tone="violet">Sunday live</Badge><Badge>{fmtDate(z.date, true)}</Badge>{(l.images?.length ?? 0) > 0 && <Badge tone="violet">{l.images!.length} real chart{l.images!.length > 1 ? 's' : ''}</Badge>}</> : <><Badge tone="accent">{src === 'seiden' ? `Page ${l.n}` : `Lesson ${l.n}`}</Badge><Badge>{src === 'seiden' || src === 'raja' || src === 'baker' ? SRC[src].name : KIND[l.kind]}</Badge>{src === 'raja' && <Badge>{KIND[l.kind]}</Badge>}{(l.images?.length ?? 0) > 0 && <Badge tone="violet">{l.images!.length} real chart{l.images!.length > 1 ? 's' : ''}</Badge>}</>}
          {done && <Badge tone="profit">Studied</Badge>}
        </div>
        <RevealText key={src + l.n} as="h2" className="text-[22px] font-semibold tracking-tight" text={l.title} />
        <p className="text-[14px] text-ink2 mt-2 max-w-[75ch] leading-relaxed">{l.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" className={done ? 'btn' : 'btn-primary'} onClick={toggle}><Icon name="check" size={14} />{done ? 'Mark as not studied' : 'Mark as studied'}</button>
          <button type="button" className="btn" onClick={() => setReading(true)} onPointerEnter={() => import('@/ui/reader/Reader')}><Icon name="playbook" size={14} />Read</button>
          <Link to="/plan" className="btn"><Icon name="target" size={14} />Plan a trade</Link>
        </div>
      </Card>
      <LessonListen key={src + l.n} source={src} lesson={l} mentor={mentor} />
      {reading && <Suspense fallback={null}><Reader lesson={l} source={src} mentor={mentor} label={label} onClose={() => setReading(false)} /></Suspense>}

      {interactive && mentorOfSrc(src) && <Suspense fallback={<TeachFallback />}><LearnIt key={src + l.n} mentor={mentorOfSrc(src)!} n={l.n} /></Suspense>}

      {l.figures && l.figures.length > 0 && <LessonFigures figures={l.figures} />}

      {(diagrams.length > 0 || (z && z.newDiagrams.length > 0)) && (
        <div className={cx('grid gap-3', diagrams.length + (z?.newDiagrams.length ?? 0) > 1 && 'md:grid-cols-2')}>
          {diagrams.map((d, k) => hasDiagram(d.key) && <LessonDiagram key={k} k={d.key} caption={d.caption} />)}
          {z?.newDiagrams.map(d => (
            <figure key={d.id} className="rounded-xl border border-line bg-raised/40 p-3">
              <div className="text-[12px] font-semibold text-ink2 mb-1.5">{d.title}</div>
              <svg viewBox="0 0 320 180" className="w-full h-auto" role="img" aria-label={d.title} style={{ fontFamily: 'Inter, system-ui, sans-serif' }} dangerouslySetInnerHTML={{ __html: d.svg }} />
              <figcaption className="text-[12px] text-ink3 mt-2 leading-snug">{d.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {l.rules.length > 0 && <Card><div className="label mb-3">Rules</div><Bullets items={l.rules} tone="accent" /></Card>}

      {l.sections.map((s, k) => (
        <Card key={k}>
          <h3 className="text-[15px] font-semibold mb-3">{s.heading}</h3>
          <Bullets items={s.points} />
        </Card>
      ))}

      {l.images && l.images.length > 0 && <RealCharts images={l.images} />}

      {z && z.examples.length > 0 && (
        <Card>
          <div className="label mb-3">Charts he walked through</div>
          <div className="flex flex-col gap-3">
            {z.examples.map((e, k) => (
              <div key={k} className="rounded-xl border border-line p-3">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">{e.market && <Badge>{e.market}</Badge>}{e.timeframe && <Badge tone="accent">{e.timeframe}</Badge>}</div>
                {e.setup && <p className="text-[13.5px] text-ink leading-relaxed">{e.setup}</p>}
                {e.reasoning && <p className="text-[13px] text-ink2 leading-relaxed mt-1.5"><span className="font-semibold text-ink3">Why: </span>{e.reasoning}</p>}
                {e.outcome && <p className="text-[13px] text-ink2 leading-relaxed mt-1"><span className="font-semibold text-ink3">Result: </span>{e.outcome}</p>}
              </div>
            ))}
          </div>
        </Card>
      )}

      {z && z.qa.length > 0 && (
        <Card>
          <div className="label mb-3">Student questions</div>
          <div className="flex flex-col divide-y divide-line">
            {z.qa.map((x, k) => (
              <details key={k} className="group py-2.5">
                <summary className="cursor-pointer list-none flex gap-2 text-[13.5px] font-medium text-ink"><Icon name="chevronRight" size={14} className="mt-1 shrink-0 transition-transform group-open:rotate-90 text-ink3" />{x.q}</summary>
                <p className="text-[13.5px] text-ink2 leading-relaxed mt-2 pl-6">{x.a}</p>
              </details>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {l.mistakes.length > 0 && <Card><div className="label mb-3">Mistakes he warns about</div><Bullets items={l.mistakes} tone="loss" /></Card>}
        {l.checklist.length > 0 && <Card><div className="label mb-3">Before you trade</div><Bullets items={l.checklist} tone="profit" /></Card>}
      </div>

      {z && z.botRules.length > 0 && (
        <Card>
          <div className="label mb-3">As mechanical rules (used by the Planner and the bot)</div>
          <ul className="flex flex-col gap-2.5">
            {z.botRules.map((r, k) => <li key={k} className="text-[13.5px] leading-relaxed"><span className="font-medium text-ink">{r.rule}</span><span className="text-ink3"> · {r.plannerStep}</span>{r.detail && r.detail !== 'discretionary' && <span className="block text-ink2 text-[13px]">{r.detail}</span>}</li>)}
          </ul>
        </Card>
      )}

      {l.quotes.length > 0 && (
        <Card>
          <div className="label mb-3">In his words</div>
          <div className="flex flex-col gap-3">{l.quotes.map((x, k) => <blockquote key={k} className="border-l-2 border-accent pl-3 text-[14px] italic text-ink2">“{x}”</blockquote>)}</div>
        </Card>
      )}

      {l.newVsPdfs.length > 0 && <Card><div className="label mb-3">{z ? 'New compared with the recorded lessons' : src === 'seiden' || src === 'raja' || src === 'baker' ? "New or different vs Kevin's course" : 'Not in the PDFs'}</div><Bullets items={l.newVsPdfs} /></Card>}

      <nav className="grid grid-cols-2 gap-3" aria-label="Lesson navigation">
        {prev ? <Link to={q(prev.n)} className="card p-3 hover:bg-raised/60 transition-colors"><div className="label">Previous</div><div className="text-[13px] font-medium mt-1 truncate">{isZoom(prev) ? fmtDate(prev.date) : prev.n}. {prev.title}</div></Link> : <span />}
        {next ? <Link to={q(next.n)} className="card p-3 text-right hover:bg-raised/60 transition-colors"><div className="label">Next</div><div className="text-[13px] font-medium mt-1 truncate">{isZoom(next) ? fmtDate(next.date) : next.n}. {next.title}</div></Link> : <span />}
      </nav>
    </article>
  );
}

export default function Learn() {
  const [sp, setSp] = useSearchParams();
  const src = srcOf(sp.get('src'));
  const gloss = src === 'glossary';
  const review = src === 'review';
  const side = gloss || review;
  const navigate = useNavigate();
  const due = useDueCount();
  useTeachVersion();
  const data = useInteractiveData();
  const im = side ? undefined : mentorOfSrc(src);
  const ilNums = useMemo(() => new Set(im && data ? data.interactiveNumbers(im) : []), [im, data]);
  const summary = im && ilNums.size ? mentorMastery(im, [...ilNums]) : null;
  const [gm, setGm] = useState<GlossaryMentor | 'all'>('all');
  const S = SRC[side ? 'course' : (src as Mentor)];
  const LIST: VideoLesson[] = S.list;
  const [done, toggle] = useDone(side ? 'rfx_lessons_done' : S.key);
  const [q, setQ] = useState('');
  const n = Number(sp.get('l')) || 0;
  const lesson = side ? undefined : LIST.find(l => l.n === n);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [n, src]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LIST;
    return LIST.filter(l => [l.title, l.summary, ...l.rules, ...l.sections.flatMap(x => [x.heading, ...x.points]), ...(isZoom(l) ? l.qa.flatMap(x => [x.q, x.a]) : []), ...(l.images ?? []).map(x => x.caption), ...(l.figures ?? []).map(x => x.caption)].join(' ').toLowerCase().includes(s));
  }, [q, LIST]);
  const studied = useMemo(() => LIST.filter(l => done.includes(l.n)).length, [LIST, done]);
  const pct = LIST.length ? studied / LIST.length : 0;
  const reduce = useReducedMotion();
  useEffect(() => { if (lesson && !side) writeLast(src, lesson.n); }, [lesson, side, src]);
  const last = useMemo(() => (side ? null : readLast(src)), [src, side, n]); // eslint-disable-line react-hooks/exhaustive-deps
  const upNext = side ? undefined : nextUnstudied(LIST, done, last);
  const resumed = last != null && studied > 0;
  const go = (p: Record<string, string>) => setSp(src === 'course' ? p : { src, ...p });
  const opts: { k: Src; short: string; count: number }[] = [...(Object.keys(SRC) as Mentor[]).map(k => ({ k: k as Src, short: SRC[k].short, count: SRC[k].list.length })), { k: 'glossary', short: 'Glossary', count: GLOSSARY.length }];

  return (
    <Page>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr] items-start">
        <aside className={cx('min-w-0 flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]', lesson && 'max-lg:hidden')}>
          <Card>
            <div className="label mb-2">Mentor</div>
            <div role="radiogroup" aria-label="Mentor" className="flex flex-col gap-1">
              {opts.map(({ k, short, count }) => (
                <button key={k} type="button" role="radio" aria-checked={k === src} onClick={() => { setQ(''); setSp(k === 'course' ? {} : { src: k }); }}
                  className={cx('flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] text-left transition-colors', k === 'glossary' && 'mt-1 border-t border-line rounded-t-none pt-2.5', k === src ? 'bg-accent/15 text-ink font-semibold ring-1 ring-accent/40' : 'text-ink2 hover:bg-raised/60')}>
                  <span className="inline-flex items-center gap-2">{k === 'glossary' && <Icon name="search" size={13} className="text-ink3" />}{short}</span><span className="num text-[12px] text-ink3">{count}</span>
                </button>
              ))}
              <button type="button" role="radio" aria-checked={review} onClick={() => { setQ(''); setSp({ src: 'review' }); }}
                className={cx('flex items-center justify-between w-full px-3 py-2 rounded-lg text-[13px] text-left transition-colors', review ? 'bg-accent/15 text-ink font-semibold ring-1 ring-accent/40' : 'text-ink2 hover:bg-raised/60')}>
                <span className="inline-flex items-center gap-2"><Icon name="layers" size={13} className="text-ink3" />Review flashcards</span>
                <span className={cx('num text-[11.5px] rounded-full px-2 h-5 inline-flex items-center', due ? 'bg-accent text-on-accent font-semibold' : 'text-ink3')}>{due} due</span>
              </button>
            </div>
            <Link to={`/checklist?m=${CHECK_OF[src].m}`} className="btn w-full mt-3 h-10"><Icon name="check" size={14} />{CHECK_OF[src].name} checklist · PDF</Link>
            {review ? (
              <p className="text-[12.5px] text-ink3 mt-3 leading-relaxed">Flashcards from every lesson you have opened, across all mentors, scheduled by spaced repetition.</p>
            ) : gloss ? (
              <>
                <div className="label mt-3">Glossary · {GLOSSARY.length} terms</div>
                <div className="flex flex-wrap gap-1 mt-2" role="radiogroup" aria-label="Filter by mentor">
                  {GLOSS_FILTERS.map(f => <button key={f.value} type="button" role="radio" aria-checked={gm === f.value} onClick={() => setGm(f.value)} className={cx('px-2.5 h-7 rounded-full text-[12px] font-medium transition-colors', gm === f.value ? 'bg-accent/15 text-ink ring-1 ring-accent/40' : 'text-ink2 hover:bg-raised/60')}>{f.label}</button>)}
                </div>
                <input className="field mt-3" placeholder="Search every term…" aria-label="Search the glossary" value={q} onChange={e => setQ(e.target.value)} />
              </>
            ) : (
              <>
                <div className="label mt-3">{S.head}</div>
                <div className="flex items-baseline justify-between gap-2 mt-1.5">
                  <span className="text-[13px] font-semibold text-ink">{S.name}: <span className="num">{studied}</span> of <span className="num">{LIST.length}</span> studied</span>
                  <span className={cx('num text-[12px] font-semibold', pct >= 1 ? 'text-profit' : 'text-ink3')}>{Math.round(pct * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><motion.div className={cx('h-full w-full rounded-full origin-left', pct >= 1 ? 'bg-profit' : 'bg-accent')} initial={false} animate={{ transform: `scaleX(${pct})` }} transition={reduce ? { duration: 0 } : spring} /></div>
                <input className="field mt-3" placeholder={`Search every ${S.noun.replace(/s$/, '')}…`} aria-label="Search" value={q} onChange={e => setQ(e.target.value)} />
              </>
            )}
          </Card>
          {!side && !lesson && LIST.length > 0 && (upNext ? (
            <button type="button" onClick={() => go({ l: String(upNext.n) })} className="press card p-3.5 flex lg:hidden items-center gap-3 text-left w-full ring-1 ring-accent/25 hover:bg-raised/60 transition-colors">
              <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name="play" size={16} /></span>
              <span className="min-w-0 flex-1">
                <span className="label block">{resumed ? 'Continue where you left off' : studied ? 'Next up' : S.start}</span>
                <span className="block text-[13.5px] font-semibold leading-snug mt-0.5 truncate">{isZoom(upNext) ? fmtDate(upNext.date) : upNext.n}. {upNext.title}</span>
                <span className="block text-[11.5px] text-ink3 mt-0.5 num">{LIST.length - studied} left · {KIND[upNext.kind]} · {upNext.sections.length} sections</span>
              </span>
              <Icon name="chevronRight" size={16} className="text-ink3 shrink-0" />
            </button>
          ) : (
            <div className="card p-3.5 flex lg:hidden items-center gap-3 ring-1 ring-profit/30">
              <span className="w-10 h-10 rounded-xl bg-profit/15 text-profit grid place-items-center shrink-0"><Icon name="check" size={16} /></span>
              <span className="text-[13px] text-ink2 leading-snug"><span className="font-semibold text-ink">All {LIST.length} {S.noun} studied.</span> Review the flashcards to keep them fresh.</span>
            </div>
          ))}
          {/* The list scrolls by itself (desktop), independent of the lesson beside it. */}
          {!side && <Card className="p-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
            {summary && (
              <div className="flex items-center gap-3 px-2.5 pt-1.5 pb-2.5 mb-1 border-b border-line">
                <MasteryRing value={summary.avg} size={34} stroke={3.5} label={`Average mastery ${Math.round(summary.avg * 100)}%`} />
                <div className="min-w-0 text-[12px] leading-snug">
                  <div className="font-semibold text-ink">Learn it mastery <span className="num">{Math.round(summary.avg * 100)}%</span></div>
                  <div className="text-ink3"><span className="num">{summary.started}</span> started · <span className="num">{summary.mastered}</span>/<span className="num">{summary.total}</span> mastered</div>
                </div>
              </div>
            )}
            <ol className="flex flex-col">
              {list.map(l => (
                <li key={l.n}>
                  <button type="button" onClick={() => go({ l: String(l.n) })} aria-current={l.n === n ? 'page' : undefined}
                    className={cx('relative w-full flex items-start gap-3 text-left px-2.5 py-2.5 rounded-lg transition-colors', l.n !== n && 'hover:bg-raised/60')}>
                    {l.n === n && <motion.span layoutId="lesson-pill" transition={spring} className="absolute inset-0 rounded-lg bg-accent/10" />}
                    <span className={cx('relative num min-w-6 h-6 px-1 rounded-full grid place-items-center text-[11px] font-semibold shrink-0', done.includes(l.n) ? 'bg-profit/15 text-profit' : 'bg-raised text-ink2')}>{done.includes(l.n) ? <Icon name="check" size={12} /> : l.n}</span>
                    <span className="relative min-w-0 flex-1"><span className="block text-[13px] font-medium leading-snug">{l.title}</span><span className="block text-[11.5px] text-ink3 mt-0.5">{isZoom(l) ? `${fmtDate(l.date)} · ${l.sections.length} sections · ${l.qa.length} Q&A` : `${KIND[l.kind]} · ${l.sections.length} sections`}</span></span>
                    {im && ilNums.has(l.n) && <MasteryRing value={mastery(lessonKey(im, l.n))} size={18} stroke={2.5} className="relative mt-0.5" label={`Learn it mastery ${Math.round(mastery(lessonKey(im, l.n)) * 100)}%`} />}
                  </button>
                </li>
              ))}
              {!list.length && <li className="p-3 text-[13px] text-ink3">{LIST.length ? `Nothing mentions “${q}”.` : 'Sessions are being written up.'}</li>}
            </ol>
          </Card>}
        </aside>
        <div className="min-w-0">
          {review ? <Suspense fallback={<TeachFallback />}><ReviewMode onOpen={href => navigate(href)} /></Suspense> : gloss ? <GlossaryView q={q} mentor={gm} /> : lesson ? (
            <>
              <button type="button" className="btn-ghost mb-3 lg:hidden" onClick={() => go({})}><Icon name="chevronLeft" size={14} />All {S.noun}</button>
              <LessonView l={lesson} src={src as Mentor} list={LIST} done={done.includes(lesson.n)} toggle={() => toggle(lesson.n)} interactive={!data || ilNums.has(lesson.n)} />
            </>
          ) : (
            <Card className="max-lg:hidden">
              <RevealText key={src} as="h2" className="text-[20px] font-semibold" text={S.title} />
              <p className="text-[14px] text-ink2 mt-2 max-w-[70ch]">{S.blurb}</p>
              {upNext && studied > 0 && <p className="text-[13px] text-ink3 mt-3"><span className="font-medium text-ink2">{resumed ? 'Continue where you left off:' : 'Next up:'}</span> {isZoom(upNext) ? fmtDate(upNext.date) : upNext.n}. {upNext.title} · <span className="num">{LIST.length - studied}</span> left</p>}
              <div className="flex flex-wrap gap-2 mt-4">{LIST.length > 0 && <button type="button" className="btn-primary" onClick={() => go({ l: String((upNext ?? LIST[0]).n) })}>{studied ? 'Continue' : S.start}<Icon name="chevronRight" size={14} /></button>}<Link to={`/checklist?m=${CHECK_OF[src].m}`} className="btn"><Icon name="check" size={14} />Cradle-to-grave checklist</Link></div>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
