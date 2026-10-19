import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VIDEO_LESSONS, type VideoLesson } from '@/core/videoLessons';
import { ZOOM_SESSIONS, type ZoomSession } from '@/core/zoomSessions';
import { Badge, Card, cx, Page, RevealText, Segmented, spring } from '@/ui/kit';
import { motion } from 'framer-motion';
import { Icon } from '@/ui/Icon';
import { hasDiagram, LessonDiagram } from '@/ui/LessonDiagrams';

type Src = 'course' | 'zoom';
function useDone(key: string) {
  const [done, setDone] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem(key) ?? '[]'); } catch { return []; } });
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem(key) ?? '[]')); } catch { /* storage blocked */ } }, [key]);
  const toggle = (n: number) => setDone(d => { const next = d.includes(n) ? d.filter(x => x !== n) : [...d, n]; try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* storage blocked */ } return next; });
  return [done, toggle] as const;
}

const KIND: Record<VideoLesson['kind'], string> = { video: 'Video', webinar: 'Webinar', podcast: 'Podcast', zoom: 'Zoom' };
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

function LessonView({ l, src, list, done, toggle }: { l: VideoLesson; src: Src; list: VideoLesson[]; done: boolean; toggle: () => void }) {
  const i = list.findIndex(x => x.n === l.n);
  const prev = list[i - 1], next = list[i + 1];
  const diagrams = l.diagrams.filter(d => hasDiagram(d.key));
  const z = isZoom(l) ? l : null;
  const q = (n: number) => src === 'zoom' ? `/learn?src=zoom&l=${n}` : `/learn?l=${n}`;
  return (
    <article className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {z ? <><Badge tone="violet">Sunday live</Badge><Badge>{fmtDate(z.date, true)}</Badge></> : <><Badge tone="accent">Lesson {l.n}</Badge><Badge>{KIND[l.kind]}</Badge></>}
          {done && <Badge tone="profit">Studied</Badge>}
        </div>
        <RevealText key={src + l.n} as="h2" className="text-[22px] font-semibold tracking-tight" text={l.title} />
        <p className="text-[14px] text-ink2 mt-2 max-w-[75ch] leading-relaxed">{l.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" className={done ? 'btn' : 'btn-primary'} onClick={toggle}><Icon name="check" size={14} />{done ? 'Mark as not studied' : 'Mark as studied'}</button>
          <Link to="/plan" className="btn"><Icon name="target" size={14} />Plan a trade</Link>
        </div>
      </Card>

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

      {l.newVsPdfs.length > 0 && <Card><div className="label mb-3">{z ? 'New compared with the recorded lessons' : 'Not in the PDFs'}</div><Bullets items={l.newVsPdfs} /></Card>}

      <nav className="grid grid-cols-2 gap-3" aria-label="Lesson navigation">
        {prev ? <Link to={q(prev.n)} className="card p-3 hover:bg-raised/60 transition-colors"><div className="label">Previous</div><div className="text-[13px] font-medium mt-1 truncate">{isZoom(prev) ? fmtDate(prev.date) : prev.n}. {prev.title}</div></Link> : <span />}
        {next ? <Link to={q(next.n)} className="card p-3 text-right hover:bg-raised/60 transition-colors"><div className="label">Next</div><div className="text-[13px] font-medium mt-1 truncate">{isZoom(next) ? fmtDate(next.date) : next.n}. {next.title}</div></Link> : <span />}
      </nav>
    </article>
  );
}

export default function Learn() {
  const [sp, setSp] = useSearchParams();
  const src: Src = sp.get('src') === 'zoom' ? 'zoom' : 'course';
  const LIST: VideoLesson[] = src === 'zoom' ? ZOOM_SESSIONS : VIDEO_LESSONS;
  const [done, toggle] = useDone(src === 'zoom' ? 'rfx_zoom_done' : 'rfx_lessons_done');
  const [q, setQ] = useState('');
  const n = Number(sp.get('l')) || 0;
  const lesson = LIST.find(l => l.n === n);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [n, src]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return LIST;
    return LIST.filter(l => [l.title, l.summary, ...l.rules, ...l.sections.flatMap(x => [x.heading, ...x.points]), ...(isZoom(l) ? l.qa.flatMap(x => [x.q, x.a]) : [])].join(' ').toLowerCase().includes(s));
  }, [q, LIST]);
  const pct = LIST.length ? done.length / LIST.length : 0;
  const go = (p: Record<string, string>) => setSp(src === 'zoom' ? { src: 'zoom', ...p } : p);

  return (
    <Page>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr] items-start">
        <aside className={cx('flex flex-col gap-3 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)]', lesson && 'max-lg:hidden')}>
          <Card>
            <Segmented label="Source" value={src} onChange={v => { setQ(''); setSp(v === 'zoom' ? { src: 'zoom' } : {}); }}
              options={[{ value: 'course', label: `Video course · ${VIDEO_LESSONS.length}` }, { value: 'zoom', label: `Sunday live · ${ZOOM_SESSIONS.length}` }]} />
            <div className="flex items-baseline justify-between mt-3"><div className="label">{src === 'zoom' ? 'Sunday Zoom sessions' : 'Video course'}</div><span className="num text-[12px] text-ink3">{done.length}/{LIST.length} studied</span></div>
            <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${pct * 100}%` }} /></div>
            <input className="field mt-3" placeholder={src === 'zoom' ? 'Search every session…' : 'Search every lesson…'} aria-label="Search" value={q} onChange={e => setQ(e.target.value)} />
          </Card>
          {/* The list scrolls by itself (desktop), independent of the lesson beside it. */}
          <Card className="p-2 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-contain">
            <ol className="flex flex-col">
              {list.map(l => (
                <li key={l.n}>
                  <button type="button" onClick={() => go({ l: String(l.n) })} aria-current={l.n === n ? 'page' : undefined}
                    className={cx('relative w-full flex items-start gap-3 text-left px-2.5 py-2.5 rounded-lg transition-colors', l.n !== n && 'hover:bg-raised/60')}>
                    {l.n === n && <motion.span layoutId="lesson-pill" transition={spring} className="absolute inset-0 rounded-lg bg-accent/10" />}
                    <span className={cx('relative num min-w-6 h-6 px-1 rounded-full grid place-items-center text-[11px] font-semibold shrink-0', done.includes(l.n) ? 'bg-profit/15 text-profit' : 'bg-raised text-ink2')}>{done.includes(l.n) ? <Icon name="check" size={12} /> : l.n}</span>
                    <span className="relative min-w-0"><span className="block text-[13px] font-medium leading-snug">{l.title}</span><span className="block text-[11.5px] text-ink3 mt-0.5">{isZoom(l) ? `${fmtDate(l.date)} · ${l.sections.length} sections · ${l.qa.length} Q&A` : `${KIND[l.kind]} · ${l.sections.length} sections`}</span></span>
                  </button>
                </li>
              ))}
              {!list.length && <li className="p-3 text-[13px] text-ink3">{LIST.length ? `Nothing mentions “${q}”.` : 'Sessions are being written up.'}</li>}
            </ol>
          </Card>
        </aside>
        <div className="min-w-0">
          {lesson ? (
            <>
              <button type="button" className="btn-ghost mb-3 lg:hidden" onClick={() => go({})}><Icon name="chevronLeft" size={14} />All {src === 'zoom' ? 'sessions' : 'lessons'}</button>
              <LessonView l={lesson} src={src} list={LIST} done={done.includes(lesson.n)} toggle={() => toggle(lesson.n)} />
            </>
          ) : (
            <Card className="max-lg:hidden">
              <RevealText key={src} as="h2" className="text-[20px] font-semibold" text={src === 'zoom' ? 'Sunday live sessions, as notes' : "Your mentor's video course, as notes"} />
              <p className="text-[14px] text-ink2 mt-2 max-w-[70ch]">{src === 'zoom'
                ? `All ${ZOOM_SESSIONS.length} Sunday Zoom livestreams written out in full: every chart he walked through, every student question, the rules and mistakes, diagrams, and the rules as mechanical checks for the Planner and the bot.`
                : `All ${VIDEO_LESSONS.length} lessons written out with diagrams, his rules, the mistakes he warns about and a pre-trade check for each. Pick a lesson on the left. The Planner, Playbook and Guru link back here.`}</p>
              {LIST.length > 0 && <button type="button" className="btn-primary mt-4" onClick={() => go({ l: String((LIST.find(l => !done.includes(l.n)) ?? LIST[0]).n) })}>{done.length ? 'Continue' : src === 'zoom' ? 'Start with the first session' : 'Start lesson 1'}<Icon name="chevronRight" size={14} /></button>}
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
