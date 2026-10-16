import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { VIDEO_LESSONS, type VideoLesson } from '@/core/videoLessons';
import { Badge, Card, cx, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { hasDiagram, LessonDiagram } from '@/ui/LessonDiagrams';

const DONE_KEY = 'rfx_lessons_done';
function useDone() {
  const [done, setDone] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem(DONE_KEY) ?? '[]'); } catch { return []; } });
  useEffect(() => { try { localStorage.setItem(DONE_KEY, JSON.stringify(done)); } catch { /* storage blocked */ } }, [done]);
  return [done, (n: number) => setDone(d => (d.includes(n) ? d.filter(x => x !== n) : [...d, n]))] as const;
}

const KIND: Record<VideoLesson['kind'], string> = { video: 'Video', webinar: 'Webinar', podcast: 'Podcast', zoom: 'Zoom' };

function Bullets({ items, tone }: { items: string[]; tone?: 'profit' | 'loss' | 'accent' }) {
  const dot = tone === 'profit' ? 'bg-profit' : tone === 'loss' ? 'bg-loss' : tone === 'accent' ? 'bg-accent' : 'bg-ink3';
  return (
    <ul className="flex flex-col gap-2">
      {items.map((p, i) => <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink2"><span className={cx('mt-[9px] w-1.5 h-1.5 rounded-full shrink-0', dot)} />{p}</li>)}
    </ul>
  );
}

function LessonView({ l, done, toggle }: { l: VideoLesson; done: boolean; toggle: () => void }) {
  const prev = VIDEO_LESSONS.find(x => x.n === l.n - 1), next = VIDEO_LESSONS.find(x => x.n === l.n + 1);
  const diagrams = l.diagrams.filter(d => hasDiagram(d.key));
  return (
    <article className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-2"><Badge tone="accent">Lesson {l.n}</Badge><Badge>{KIND[l.kind]}</Badge>{done && <Badge tone="profit">Studied</Badge>}</div>
        <h2 className="text-[22px] font-semibold tracking-tight">{l.title}</h2>
        <p className="text-[14px] text-ink2 mt-2 max-w-[75ch] leading-relaxed">{l.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="button" className={done ? 'btn' : 'btn-primary'} onClick={toggle}><Icon name="check" size={14} />{done ? 'Mark as not studied' : 'Mark as studied'}</button>
          <Link to="/plan" className="btn"><Icon name="target" size={14} />Plan a trade</Link>
        </div>
      </Card>

      {diagrams.length > 0 && (
        <div className={cx('grid gap-3', diagrams.length > 1 && 'md:grid-cols-2')}>
          {diagrams.map((d, i) => hasDiagram(d.key) && <LessonDiagram key={i} k={d.key} caption={d.caption} />)}
        </div>
      )}

      {l.rules.length > 0 && <Card><div className="label mb-3">Rules</div><Bullets items={l.rules} tone="accent" /></Card>}

      {l.sections.map((s, i) => (
        <Card key={i}>
          <h3 className="text-[15px] font-semibold mb-3">{s.heading}</h3>
          <Bullets items={s.points} />
        </Card>
      ))}

      <div className="grid gap-4 md:grid-cols-2">
        {l.mistakes.length > 0 && <Card><div className="label mb-3">Mistakes he warns about</div><Bullets items={l.mistakes} tone="loss" /></Card>}
        {l.checklist.length > 0 && <Card><div className="label mb-3">Before you trade</div><Bullets items={l.checklist} tone="profit" /></Card>}
      </div>

      {l.quotes.length > 0 && (
        <Card>
          <div className="label mb-3">In his words</div>
          <div className="flex flex-col gap-3">{l.quotes.map((q, i) => <blockquote key={i} className="border-l-2 border-accent pl-3 text-[14px] italic text-ink2">“{q}”</blockquote>)}</div>
        </Card>
      )}

      {l.newVsPdfs.length > 0 && <Card><div className="label mb-3">Not in the PDFs</div><Bullets items={l.newVsPdfs} /></Card>}

      <nav className="grid grid-cols-2 gap-3" aria-label="Lesson navigation">
        {prev ? <Link to={`/learn?l=${prev.n}`} className="card p-3 hover:bg-raised/60 transition-colors"><div className="label">Previous</div><div className="text-[13px] font-medium mt-1 truncate">{prev.n}. {prev.title}</div></Link> : <span />}
        {next ? <Link to={`/learn?l=${next.n}`} className="card p-3 text-right hover:bg-raised/60 transition-colors"><div className="label">Next</div><div className="text-[13px] font-medium mt-1 truncate">{next.n}. {next.title}</div></Link> : <span />}
      </nav>
    </article>
  );
}

export default function Learn() {
  const [sp, setSp] = useSearchParams();
  const [done, toggle] = useDone();
  const [q, setQ] = useState('');
  const n = Number(sp.get('l')) || 0;
  const lesson = VIDEO_LESSONS.find(l => l.n === n);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [n]);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return VIDEO_LESSONS;
    return VIDEO_LESSONS.filter(l => [l.title, l.summary, ...l.rules, ...l.sections.flatMap(x => [x.heading, ...x.points])].join(' ').toLowerCase().includes(s));
  }, [q]);
  const pct = VIDEO_LESSONS.length ? done.length / VIDEO_LESSONS.length : 0;

  return (
    <Page>
      <div className="grid gap-4 lg:grid-cols-[300px_1fr] items-start">
        <aside className={cx('flex flex-col gap-3 lg:sticky lg:top-20', lesson && 'max-lg:hidden')}>
          <Card>
            <div className="flex items-baseline justify-between"><div className="label">Video course</div><span className="num text-[12px] text-ink3">{done.length}/{VIDEO_LESSONS.length} studied</span></div>
            <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${pct * 100}%` }} /></div>
            <input className="field mt-3" placeholder="Search every lesson…" aria-label="Search lessons" value={q} onChange={e => setQ(e.target.value)} />
          </Card>
          <Card className="p-2">
            <ol className="flex flex-col">
              {list.map(l => (
                <li key={l.n}>
                  <button type="button" onClick={() => setSp({ l: String(l.n) })} aria-current={l.n === n ? 'page' : undefined}
                    className={cx('w-full flex items-start gap-3 text-left px-2.5 py-2.5 rounded-lg transition-colors', l.n === n ? 'bg-accent/10' : 'hover:bg-raised/60')}>
                    <span className={cx('num w-6 h-6 rounded-full grid place-items-center text-[11px] font-semibold shrink-0', done.includes(l.n) ? 'bg-profit/15 text-profit' : 'bg-raised text-ink2')}>{done.includes(l.n) ? <Icon name="check" size={12} /> : l.n}</span>
                    <span className="min-w-0"><span className="block text-[13px] font-medium leading-snug">{l.title}</span><span className="block text-[11.5px] text-ink3 mt-0.5">{KIND[l.kind]} · {l.sections.length} sections</span></span>
                  </button>
                </li>
              ))}
              {!list.length && <li className="p-3 text-[13px] text-ink3">No lesson mentions “{q}”.</li>}
            </ol>
          </Card>
        </aside>
        <div className="min-w-0">
          {lesson ? (
            <>
              <button type="button" className="btn-ghost mb-3 lg:hidden" onClick={() => setSp({})}><Icon name="chevronLeft" size={14} />All lessons</button>
              <LessonView l={lesson} done={done.includes(lesson.n)} toggle={() => toggle(lesson.n)} />
            </>
          ) : (
            <Card className="max-lg:hidden">
              <h2 className="text-[20px] font-semibold">Your mentor's video course, as notes</h2>
              <p className="text-[14px] text-ink2 mt-2 max-w-[70ch]">All {VIDEO_LESSONS.length} lessons written out with diagrams, his rules, the mistakes he warns about and a pre-trade check for each. Pick a lesson on the left. The Planner, Playbook and Guru link back here.</p>
              <button type="button" className="btn-primary mt-4" onClick={() => setSp({ l: String((VIDEO_LESSONS.find(l => !done.includes(l.n)) ?? VIDEO_LESSONS[0]).n) })}>{done.length ? 'Continue' : 'Start lesson 1'}<Icon name="chevronRight" size={14} /></button>
            </Card>
          )}
        </div>
      </div>
    </Page>
  );
}
