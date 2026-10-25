import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CHECKLISTS, isChecklistMentor, MENTOR_ORDER, type CheckItem, type Checklist, type ChecklistMentor, type Stage } from '@/core/checklists';
import { tradeProgress } from '@/core/checklistProgress';
import { Card, cx, Page, Segmented, Sheet, spring, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { BarPill, Collapsible, ExpandAll, JumpMenu, PillBar, PillTag, scrollToSection, useActiveSection, useOpenSet, type OpenSet } from '@/ui/Collapse';

type Mode = 'check' | 'memorize' | 'read';
type Recall = 'reveal' | 'cloze';
type Score = { b: number; n: number; t: number };
type PrintWhat = ChecklistMentor | 'all';

// ─── Storage (every access guarded: private mode and blocked storage must not break the page) ──────────────
const UI_KEY = 'rfx_checklist_ui';
const SR_KEY = 'rfx_checklist_sr';
const tickKey = (m: ChecklistMentor) => `rfx_checklist_ticks_${m}`;
function read<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, v: unknown) { try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* storage blocked */ } }

function useTicks(m: ChecklistMentor) {
  const [ticks, setTicks] = useState<string[]>(() => read(tickKey(m), []));
  useEffect(() => setTicks(read(tickKey(m), [])), [m]);
  const save = useCallback((next: string[]) => { setTicks(next); write(tickKey(m), next); }, [m]);
  return [ticks, save] as const;
}

function useScores() {
  const [sr, setSr] = useState<Record<string, Score>>(() => read(SR_KEY, {}));
  const grade = useCallback((id: string, knew: boolean) => setSr(prev => {
    const cur = prev[id] ?? { b: 0, n: 0, t: 0 };
    const next = { ...prev, [id]: { b: knew ? Math.min(5, cur.b + 1) : 0, n: cur.n + 1, t: Date.now() } };
    write(SR_KEY, next);
    return next;
  }), []);
  return [sr, grade] as const;
}

/** Lower = weaker. Never-drilled bullets sit between a miss and a first success. */
const weakness = (s: Score | undefined) => (s ? s.b : 0.5);
const known = (s: Score | undefined) => !!s && s.b >= 2;

const MODES: { value: Mode; label: string }[] = [{ value: 'check', label: 'Check' }, { value: 'memorize', label: 'Memorize' }, { value: 'read', label: 'Read' }];
const stageMark = (s: Stage) => (s.kind === 'never' ? '!' : s.kind === 'visual' ? '◉' : String(s.n));

// ─── Shared bits ───────────────────────────────────────────────────────────────────────────────────────
function SrcTag({ it, className }: { it: CheckItem; className?: string }) {
  return (
    <span className={cx('inline-flex flex-wrap gap-x-2 gap-y-0.5 text-[11px] leading-4 text-ink3', className)}>
      <span className="num">{it.src}</span>
      {it.diff && <span className="text-warn font-medium">≠ {it.diff}</span>}
    </span>
  );
}

const stageLabel = (s: Stage) => (s.kind === 'never' ? 'Never list' : s.kind === 'visual' ? s.title : `Stage ${s.n} · ${s.title}`);
const ckId = (id: string) => `ck-${id}`;

function StageMark({ s, small }: { s: Stage; small?: boolean }) {
  return <span className={cx('num rounded-full grid place-items-center font-bold shrink-0', small ? 'w-6 h-6 text-[11px]' : 'w-8 h-8 text-[13px]', s.kind === 'never' ? 'bg-loss/15 text-loss' : s.kind === 'visual' ? 'bg-violet/15 text-violet' : 'bg-accent/15 text-accent')}>{stageMark(s)}</span>;
}

/** Ticked / known count for a stage header: a check and the count once every item is done. */
function StagePill({ done, total, word }: { done: number; total: number; word?: string }) {
  const full = total > 0 && done === total;
  return <PillTag tone={full ? 'profit' : 'neutral'}>{full && <Icon name="check" size={11} strokeWidth={2.8} />}{done}/{total}{word && ` ${word}`}</PillTag>;
}

function StageJump({ list, jump }: { list: Checklist; jump: (id: string) => void }) {
  return (
    <nav aria-label="Jump to stage" className="flex flex-wrap gap-1.5">
      {list.stages.map(s => (
        <button key={s.id} type="button" onClick={() => jump(s.id)} title={s.title}
          className={cx('press h-9 min-w-9 px-2.5 rounded-full text-[12.5px] font-semibold border transition-colors', s.kind === 'never' ? 'border-loss/30 text-loss bg-loss/5' : s.kind === 'visual' ? 'border-violet/30 text-violet bg-violet/5' : 'border-line2 text-ink2 bg-raised/50')}>
          {s.kind === 'never' ? 'Never' : s.kind === 'visual' ? 'See it' : s.n}
        </button>
      ))}
    </nav>
  );
}

// ─── Trade progress (goal gradient) ──────────────────────────────────────────────────────────────────────
function ProgressRing({ value, ready, reduce }: { value: number; ready: boolean; reduce: boolean }) {
  const r = 17, c = 2 * Math.PI * r;
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" className="shrink-0 -rotate-90" aria-hidden="true">
      <circle cx="22" cy="22" r={r} fill="none" strokeWidth="4" className="stroke-line" />
      <motion.circle cx="22" cy="22" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={c}
        className={ready ? 'stroke-profit' : 'stroke-accent'} initial={false}
        animate={{ strokeDashoffset: c * (1 - value) }} transition={reduce ? { duration: 0 } : spring} />
    </svg>
  );
}

function TradeProgress({ list, ticks, onReset }: { list: Checklist; ticks: string[]; onReset: () => void }) {
  const reduce = !!useReducedMotion();
  const pr = useMemo(() => tradeProgress(list, ticks), [list, ticks]);
  const pctTxt = `${Math.round(pr.pct * 100)}%`;
  const stepTitle = pr.cur ? (pr.cur.s.kind === 'never' ? 'Clear every Never' : pr.cur.s.title) : '';
  // Numbers match the stage badges (Raja's stage 0 is the mindset, before a chart is open).
  const lastN = Math.max(0, ...list.stages.map(s => s.n ?? 0));
  const where = pr.cur?.s.kind === 'never' ? 'Last gate · the Never list' : `Stage ${pr.cur?.s.n ?? 0} of ${lastN}`;
  return (
    <div className="mt-4">
      <div className={cx('rounded-2xl border p-3 flex items-center gap-3 transition-colors duration-300', pr.ready ? 'border-profit/40 bg-profit/[0.07]' : 'border-line bg-raised/30')}>
        <div className="relative grid place-items-center">
          <ProgressRing value={pr.done ? pr.pct : 0.04} ready={pr.ready} reduce={reduce} />
          <AnimatePresence initial={false}>
            {pr.ready && (
              <motion.span key="ok" className="absolute inset-0 grid place-items-center text-profit"
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.6)' }} animate={reduce ? { opacity: 1 } : { opacity: 1, transform: 'scale(1)' }} exit={{ opacity: 0 }}
                transition={reduce ? { duration: 0.15 } : { type: 'spring', bounce: 0.35, duration: 0.45 }}>
                <Icon name="check" size={18} strokeWidth={2.8} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="min-w-0 flex-1" aria-live="polite">
          {pr.ready ? (
            <>
              <div className="text-[15px] font-semibold text-profit leading-tight">Ready to place</div>
              <div className="text-[12px] text-ink2 mt-0.5 leading-snug">Every stage and every Never cleared for this trade.</div>
            </>
          ) : pr.done === 0 ? (
            <>
              <div className="label num">{where}</div>
              <div className="text-[14px] font-semibold leading-snug mt-0.5 line-clamp-2">Start with: {stepTitle}</div>
            </>
          ) : (
            <>
              <div className="label num">{where} · {pctTxt}</div>
              <div className="text-[14px] font-semibold leading-snug mt-0.5 line-clamp-2">{stepTitle}</div>
            </>
          )}
        </div>
        {pr.ready
          ? <Link to="/plan/new" className="btn-primary h-10 shrink-0"><Icon name="target" size={14} />Plan it</Link>
          : <button type="button" className="btn-ghost h-9 px-3 text-[12.5px] shrink-0" onClick={onReset} disabled={!ticks.length}><Icon name="refresh" size={13} />Reset</button>}
      </div>
      {/* One segment per stage: the bar fills stage by stage, so the next one always looks within reach. */}
      <div className="flex gap-1 mt-2.5" aria-hidden="true">
        {pr.per.map(x => (
          <span key={x.s.id} className={cx('h-1.5 flex-1 rounded-full overflow-hidden', x.s.kind === 'never' ? 'bg-loss/15' : 'bg-line')} style={{ flexGrow: Math.max(1, x.total) }}>
            <motion.span className={cx('block h-full w-full rounded-full origin-left', pr.ready ? 'bg-profit' : x.done === x.total ? 'bg-profit' : 'bg-accent')} initial={false}
              animate={{ transform: `scaleX(${x.total ? x.done / x.total : 0})` }} transition={reduce ? { duration: 0 } : spring} />
          </span>
        ))}
      </div>
      <div className="flex justify-between mt-1.5 text-[11.5px] text-ink3"><span className="num">{pr.done}/{pr.total} ticked</span>{pr.ready && <button type="button" className="text-ink3 py-1 -my-1" onClick={onReset}>Start the next trade</button>}</div>
    </div>
  );
}

// ─── Check mode ─────────────────────────────────────────────────────────────────────────────────────────
function CheckMode({ list, ticks, setTicks, os, barRef }: { list: Checklist; ticks: string[]; setTicks: (t: string[]) => void; os: OpenSet; barRef: RefObject<HTMLDivElement> }) {
  const on = useMemo(() => new Set(ticks), [ticks]);
  const reduce = !!useReducedMotion();
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const flip = (s: Stage, id: string) => {
    const was = on.has(id);
    const next = was ? ticks.filter(x => x !== id) : [...ticks, id];
    setTicks(next);
    if (was) return;
    const now = new Set(next);
    if (!s.items.every(i => now.has(i.id))) return;
    // Stage complete: a beat to see the last tick land, then it folds away (✓ n/n in its header) and the next open stage opens.
    const open = (x: Stage) => x.items.some(i => !now.has(i.id));
    const idx = list.stages.indexOf(s);
    const nxt = list.stages.slice(idx + 1).find(open) ?? list.stages.slice(0, idx).find(open);
    timers.current.push(window.setTimeout(() => {
      os.set(s.id, false);
      if (!nxt) return;
      os.set(nxt.id, true);
      timers.current.push(window.setTimeout(() => {
        const el = document.getElementById(ckId(nxt.id));
        if (!el) return;
        const top = el.getBoundingClientRect().top, line = barRef.current?.getBoundingClientRect().bottom ?? 120;
        if (top < line || top > window.innerHeight * 0.6) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }, 240));
    }, 320));
  };
  return (
    <>
      {list.stages.map(s => {
        const done = s.items.filter(i => on.has(i.id)).length;
        return (
          <Collapsible key={s.id} id={ckId(s.id)} open={os.isOpen(s.id)} onToggle={() => os.toggle(s.id)} lead={<StageMark s={s} />} title={s.title}
            preview={s.goal} pill={<StagePill done={done} total={s.items.length} />} bodyClassName="pt-0">
            {s.goal && <p className="text-[12px] text-ink3 leading-snug -mt-1.5 mb-1 pl-11">{s.goal}</p>}
            <ul className="flex flex-col">
              {s.items.map(it => {
                const ticked = on.has(it.id);
                return (
                  <li key={it.id}>
                    <button type="button" role="checkbox" aria-checked={ticked} onClick={() => flip(s, it.id)}
                      className="press w-full flex items-start gap-3 text-left py-2.5 px-2 -mx-2 rounded-xl min-h-[52px] active:bg-raised/60 transition-colors">
                      <span className={cx('mt-0.5 w-6 h-6 rounded-full grid place-items-center shrink-0 border-[1.5px] transition-colors', ticked ? 'bg-profit border-profit text-on-status' : s.kind === 'never' ? 'border-loss/50' : 'border-line2')}>
                        {ticked && <Icon name="check" size={14} strokeWidth={2.6} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={cx('block text-[14.5px] leading-snug transition-colors', ticked ? 'text-ink3' : 'text-ink')}>{it.text}</span>
                        <SrcTag it={it} className="mt-1" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </Collapsible>
        );
      })}
    </>
  );
}

// ─── Memorize mode ──────────────────────────────────────────────────────────────────────────────────────
function Cloze({ it, shown, onShow }: { it: CheckItem; shown: boolean; onShow: () => void }) {
  return (
    <span className="text-[15px] leading-relaxed text-ink">
      {it.parts.map((p, i) => p.key && !shown
        ? <button key={i} type="button" onClick={onShow} aria-label="Reveal the hidden words" className="inline-block align-baseline mx-0.5 px-1 rounded-md bg-accent/15 border-b-2 border-accent text-transparent select-none" style={{ minWidth: `${Math.max(3, p.t.length * 0.55)}em` }}>{p.t.replace(/./g, '·')}</button>
        : <span key={i} className={cx(p.key && 'font-semibold text-accent')}>{p.t}</span>)}
    </span>
  );
}

function Dots({ s }: { s: Score | undefined }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={s ? `Recall level ${s.b} of 5` : 'Not drilled yet'}>
      {[1, 2, 3, 4, 5].map(k => <span key={k} className={cx('w-1.5 h-1.5 rounded-full', s && s.b >= k ? 'bg-profit' : s && s.n && s.b === 0 && k === 1 ? 'bg-loss' : 'bg-line2')} />)}
    </span>
  );
}

function GradeRow({ onGrade }: { onGrade: (knew: boolean) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-3">
      <button type="button" className="press h-12 rounded-xl border border-loss/40 bg-loss/10 text-loss font-semibold text-[14px]" onClick={() => onGrade(false)}>Missed</button>
      <button type="button" className="press h-12 rounded-xl border border-profit/40 bg-profit/10 text-profit font-semibold text-[14px]" onClick={() => onGrade(true)}>Knew it</button>
    </div>
  );
}

/** One bullet being recalled: hidden (reveal) or blanked (cloze) until tapped, then graded. */
function RecallCard({ it, recall, score, onGrade, index, total, hint }: { it: CheckItem; recall: Recall; score?: Score; onGrade: (knew: boolean) => void; index: number; total: number; hint?: string }) {
  const [shown, setShown] = useState(false);
  useEffect(() => setShown(false), [it.id, recall]);
  return (
    <div className="rounded-2xl border border-line bg-raised/40 p-4">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="label">{hint ?? `Bullet ${index + 1} of ${total}`}</span>
        <Dots s={score} />
      </div>
      {recall === 'cloze' ? (
        <Cloze it={it} shown={shown} onShow={() => setShown(true)} />
      ) : shown ? (
        <span className="text-[15px] leading-relaxed text-ink">{it.text}</span>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="press w-full min-h-[64px] rounded-xl border border-dashed border-line2 text-[14px] text-ink2 font-medium flex items-center justify-center gap-2">
          <Icon name="eye" size={16} />Say it in your head, then tap
        </button>
      )}
      {shown && <SrcTag it={it} className="!flex mt-1.5" />}
      {shown ? <GradeRow onGrade={onGrade} /> : recall === 'cloze' && <button type="button" className="btn w-full mt-3 h-11" onClick={() => setShown(true)}><Icon name="eye" size={14} />Show the words</button>}
    </div>
  );
}

function MemorizeStage({ s, recall, sr, grade, open, onToggle }: { s: Stage; recall: Recall; sr: Record<string, Score>; grade: (id: string, knew: boolean) => void; open: boolean; onToggle: () => void }) {
  const [step, setStep] = useState(0);
  useEffect(() => { if (!open) setStep(0); }, [open]);
  const knownCount = s.items.filter(i => known(sr[i.id])).length;
  const cur = s.items[step];
  return (
    <Collapsible id={ckId(s.id)} open={open} onToggle={onToggle} lead={<StageMark s={s} />} title={s.title} preview={`${s.items.length} bullets`}
      pill={<StagePill done={knownCount} total={s.items.length} word="known" />}>
      <div className="flex flex-col gap-2">
        {s.items.slice(0, step).map((it, k) => (
          <div key={it.id} className="flex gap-2.5 text-[13.5px] leading-snug text-ink2">
            <span className="num text-[11px] text-ink3 mt-0.5 w-4 shrink-0">{k + 1}</span>
            <span className="min-w-0 flex-1">{it.text}</span>
            <Dots s={sr[it.id]} />
          </div>
        ))}
        {cur ? (
          <RecallCard key={cur.id} it={cur} recall={recall} score={sr[cur.id]} index={step} total={s.items.length} onGrade={knew => { grade(cur.id, knew); setStep(x => x + 1); }} />
        ) : (
          <div className="rounded-2xl border border-profit/30 bg-profit/5 p-4 text-[13.5px] text-ink2 flex items-center justify-between gap-3">
            <span>Stage done. <span className="num font-semibold text-ink">{knownCount}/{s.items.length}</span> known.</span>
            <button type="button" className="btn h-10" onClick={() => setStep(0)}><Icon name="refresh" size={14} />Again</button>
          </div>
        )}
      </div>
    </Collapsible>
  );
}

function Drill({ list, items, recall, sr, grade, onDone }: { list: Checklist; items: CheckItem[]; recall: Recall; sr: Record<string, Score>; grade: (id: string, knew: boolean) => void; onDone: () => void }) {
  const [i, setI] = useState(0);
  const [res, setRes] = useState<boolean[]>([]);
  const cur = items[i];
  const stageOf = (it: CheckItem) => list.stages.find(s => s.items.includes(it));
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }, []);
  return (
    <div ref={ref}>
    <Card className="p-4 sm:p-5 ring-1 ring-accent/30" aria-label="Drill">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[15px] font-semibold">Drill · 5 weakest</h3>
        <button type="button" className="btn-ghost h-9 px-3" onClick={onDone}><Icon name="x" size={14} />Close</button>
      </div>
      <div className="flex gap-1 mb-3" aria-hidden="true">{items.map((_, k) => <span key={k} className={cx('h-1.5 flex-1 rounded-full', k < res.length ? (res[k] ? 'bg-profit' : 'bg-loss') : k === i ? 'bg-accent' : 'bg-line')} />)}</div>
      {cur ? (
        <RecallCard key={cur.id} it={cur} recall={recall} score={sr[cur.id]} index={i} total={items.length}
          hint={`${stageOf(cur)?.kind === 'stage' ? `Stage ${stageOf(cur)?.n} · ` : ''}${stageOf(cur)?.title ?? ''} · ${i + 1}/${items.length}`}
          onGrade={knew => { grade(cur.id, knew); setRes(r => [...r, knew]); setI(x => x + 1); }} />
      ) : (
        <div className="text-[14px] text-ink2">
          <p><span className="num font-semibold text-profit">{res.filter(Boolean).length}</span> knew · <span className="num font-semibold text-loss">{res.filter(x => !x).length}</span> missed. Missed bullets come back first next time.</p>
          <button type="button" className="btn-primary h-11 mt-3" onClick={onDone}>Done</button>
        </div>
      )}
    </Card>
    </div>
  );
}

// One stage open at a time: Memorize reveals bullet by bullet, so the open stage is the one being drilled.
function MemorizeMode({ list, recall, sr, grade, open, setOpen }: { list: Checklist; recall: Recall; sr: Record<string, Score>; grade: (id: string, knew: boolean) => void; open: string | null; setOpen: (f: (o: string | null) => string | null) => void }) {
  const [drill, setDrill] = useState<CheckItem[] | null>(null);
  useEffect(() => { setDrill(null); }, [list.id]);
  const all = useMemo(() => list.stages.flatMap(s => s.items), [list]);
  const knownAll = all.filter(i => known(sr[i.id])).length;
  // Weakest first; among equals the oldest drill, and a random pick among never-drilled ones so every stage gets a turn.
  const startDrill = () => setDrill(all.map(it => ({ it, r: Math.random() })).sort((a, b) => weakness(sr[a.it.id]) - weakness(sr[b.it.id]) || (sr[a.it.id]?.t ?? 0) - (sr[b.it.id]?.t ?? 0) || a.r - b.r).slice(0, 5).map(x => x.it));
  return (
    <>
      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[14px] font-semibold">Carve it in rock</div>
            <p className="text-[12.5px] text-ink3 mt-0.5 leading-snug">Recall each bullet before you see it. <span className="num">{knownAll}/{all.length}</span> known (2+ in a row).</p>
          </div>
          <button type="button" className="btn-primary h-11 shrink-0" onClick={startDrill}><Icon name="bolt" size={14} />Drill 5 weakest</button>
        </div>
        <div className="h-1.5 rounded-full bg-line mt-3 overflow-hidden"><div className="h-full bg-profit rounded-full transition-[width] duration-slow" style={{ width: `${(knownAll / Math.max(1, all.length)) * 100}%` }} /></div>
      </Card>
      {drill && <Drill key={drill.map(d => d.id).join()} list={list} items={drill} recall={recall} sr={sr} grade={grade} onDone={() => setDrill(null)} />}
      {list.stages.map(s => <MemorizeStage key={s.id} s={s} recall={recall} sr={sr} grade={grade} open={open === s.id} onToggle={() => setOpen(o => (o === s.id ? null : s.id))} />)}
    </>
  );
}

// ─── Read mode ──────────────────────────────────────────────────────────────────────────────────────────
function ReadMode({ list, os }: { list: Checklist; os: OpenSet }) {
  return (
    <>
      {list.stages.map(s => (
        <Collapsible key={s.id} id={ckId(s.id)} open={os.isOpen(s.id)} onToggle={() => os.toggle(s.id)} lead={<StageMark s={s} />} title={s.title}
          preview={s.goal ?? s.items[0]?.text} pill={<PillTag>{s.items.length}</PillTag>} bodyClassName="pt-0">
          {s.goal && <p className="text-[12px] text-ink3 leading-snug -mt-1.5 mb-2 pl-11">{s.goal}</p>}
          <ul className="flex flex-col gap-2.5">
            {s.items.map(it => (
              <li key={it.id} className="flex gap-2.5">
                <span className={cx('mt-[8px] w-1.5 h-1.5 rounded-full shrink-0', s.kind === 'never' ? 'bg-loss' : s.kind === 'visual' ? 'bg-violet' : 'bg-accent')} />
                <span className="min-w-0"><span className="text-[14px] leading-snug text-ink">{it.text}</span> <SrcTag it={it} /></span>
              </li>
            ))}
          </ul>
        </Collapsible>
      ))}
      {list.notes.length > 0 && (
        <Card className="p-4 sm:p-5">
          <div className="label mb-2">Where the lessons disagree, and the choice made</div>
          <ul className="flex flex-col gap-2">{list.notes.map((n, k) => <li key={k} className="text-[13px] text-ink2 leading-relaxed">{n}</li>)}</ul>
        </Card>
      )}
    </>
  );
}

// ─── Print sheet (A4, two columns, shown only when printing or in the preview) ────────────────────────────
function PrintSheet({ what }: { what: PrintWhat }) {
  const lists = what === 'all' ? MENTOR_ORDER.map(m => CHECKLISTS[m]) : [CHECKLISTS[what]];
  const today = new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  return createPortal(
    <div className="ck-print" aria-hidden="true">
      {lists.map(l => (
        <section key={l.id} className="ckp-mentor">
          <header className="ckp-head">
            <div>
              <div className="ckp-title">{l.name} · trade checklist</div>
              <div className="ckp-tag">{l.tagline}</div>
            </div>
            <div className="ckp-meta">RamanFX · {today}<br />{l.count} points · cradle to grave</div>
          </header>
          <div className="ckp-cols">
            {l.stages.map(s => (
              <div key={s.id} className={cx('ckp-stage', s.kind !== 'stage' && `ckp-${s.kind}`)}>
                <h3><span className="ckp-n">{stageMark(s)}</span>{s.title}</h3>
                <ul>
                  {s.items.map(it => (
                    <li key={it.id}><span className="ckp-box" />{it.text}<span className="ckp-src"> {it.src}</span>{it.diff && <span className="ckp-diff"> (≠ {it.diff})</span>}</li>
                  ))}
                </ul>
              </div>
            ))}
            {l.notes.length > 0 && (
              <div className="ckp-stage ckp-notes">
                <h3>Notes</h3>
                <ul>{l.notes.map((n, k) => <li key={k}>{n}</li>)}</ul>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>,
    document.body,
  );
}

// ─── PDF file (built from the data by jsPDF, loaded only when the PDF sheet opens) ──────────────────────────
// window.print() does nothing in an iPhone home-screen app, so the sheet hands over a real PDF file instead:
// the share sheet where files can be shared (Save to Files, Print, AirDrop, WhatsApp), a download elsewhere.
type Pdf = import('@/core/checklists/pdf').ChecklistPdf;
const pdfCache = new Map<PrintWhat, Promise<Pdf>>();
function getPdf(what: PrintWhat): Promise<Pdf> {
  let p = pdfCache.get(what);
  if (!p) {
    p = import('@/core/checklists/pdf').then(mod => mod.buildChecklistPdf(what));
    p.catch(() => pdfCache.delete(what));
    pdfCache.set(what, p);
  }
  return p;
}
const isStandalone = () => window.matchMedia?.('(display-mode: standalone)').matches || !!(navigator as Navigator & { standalone?: boolean }).standalone;
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const canShareFile = (f: File) => { try { return typeof navigator.share === 'function' && !!navigator.canShare?.({ files: [f] }); } catch { return false; } };
const canShareFiles = () => { try { return typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && navigator.canShare({ files: [new File(['x'], 'x.pdf', { type: 'application/pdf' })] }); } catch { return false; } };
function downloadPdf(pdf: Pdf) {
  const url = URL.createObjectURL(pdf.blob);
  const a = document.createElement('a');
  a.href = url; a.download = pdf.name; a.rel = 'noopener'; a.style.display = 'none';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
/** Open the PDF in the browser's viewer (it has its own Share and Print). False if a popup blocker said no. */
function openPdf(pdf: Pdf): boolean {
  const url = URL.createObjectURL(pdf.blob);
  setTimeout(() => URL.revokeObjectURL(url), 5 * 60_000);
  return !!window.open(url, '_blank');
}

// ─── Page ───────────────────────────────────────────────────────────────────────────────────────────────
export default function ChecklistPage() {
  const [sp, setSp] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const ui = useMemo(() => read<{ m?: string; mode?: string; recall?: string }>(UI_KEY, {}), []);
  const qm = sp.get('m');
  const m: ChecklistMentor = isChecklistMentor(qm) ? qm : isChecklistMentor(ui.m) ? ui.m : 'raja';
  const qmode = sp.get('mode');
  const mode: Mode = qmode === 'memorize' || qmode === 'read' || qmode === 'check' ? qmode : ui.mode === 'memorize' || ui.mode === 'read' ? ui.mode : 'check';
  const [recall, setRecall] = useState<Recall>(ui.recall === 'cloze' ? 'cloze' : 'reveal');
  const preview = sp.get('view') === 'print';
  const qp = sp.get('print');
  const [printWhat, setPrintWhat] = useState<PrintWhat>(qp === 'all' ? 'all' : isChecklistMentor(qp) ? qp : m);
  const [pdfOpen, setPdfOpen] = useState(false);
  const list = CHECKLISTS[m];
  const [ticks, setTicks] = useTicks(m);
  const [sr, grade] = useScores();

  useEffect(() => { write(UI_KEY, { m, mode, recall }); }, [m, mode, recall]);
  useEffect(() => { if (!preview) setPrintWhat(m); }, [m, preview]);
  useEffect(() => {
    document.documentElement.classList.toggle('ck-preview', preview);
    return () => document.documentElement.classList.remove('ck-preview');
  }, [preview]);

  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => next.set(k, v));
    setSp(next, { replace: true });
  };
  const doPrint = (what: PrintWhat) => {
    setPrintWhat(what);
    setPdfOpen(false);
    // Let the sheet render the chosen mentor(s) and the bottom sheet leave before the print dialog takes over.
    setTimeout(() => window.print(), 350);
  };
  // The PDF is built as soon as the sheet opens (or the choice changes), so the tap that shares it still has the
  // user activation navigator.share needs; the buttons wait for it instead of awaiting inside the tap.
  const [pdfWhat, setPdfWhat] = useState<PrintWhat>(m);
  const [pdf, setPdf] = useState<{ what: PrintWhat; pdf?: Pdf; failed?: boolean } | null>(null);
  const [pdfTry, setPdfTry] = useState(0);
  const [shareOk] = useState(canShareFiles);
  const appMode = useMemo(() => isStandalone() || isIOS(), []);
  useEffect(() => { if (pdfOpen) setPdfWhat(m); }, [pdfOpen, m]);
  const wantPdf = pdfOpen || preview;
  const wantWhat = pdfOpen ? pdfWhat : printWhat;
  useEffect(() => {
    if (!wantPdf) return;
    let live = true;
    setPdf(cur => (cur?.what === wantWhat && cur.pdf ? cur : { what: wantWhat }));
    getPdf(wantWhat).then(p => { if (live) setPdf({ what: wantWhat, pdf: p }); }, () => { if (live) setPdf({ what: wantWhat, failed: true }); });
    return () => { live = false; };
  }, [wantPdf, wantWhat, pdfTry]);
  const ready = pdf?.what === wantWhat ? pdf.pdf : undefined;
  const retryPdf = () => setPdfTry(n => n + 1);
  const sharePdf = (p: Pdf) => {
    if (!canShareFile(p.file)) { downloadPdf(p); toast(`Downloaded ${p.name}`, 'ok'); return; }
    navigator.share({ files: [p.file], title: p.title }).then(() => setPdfOpen(false), (e: unknown) => {
      const name = (e as { name?: string })?.name;
      if (name === 'AbortError') return; // cancelled in the share sheet
      if (name === 'NotAllowedError') { toast('Tap Save or share once more', 'info'); return; }
      downloadPdf(p);
    });
  };
  const viewPdf = (p: Pdf) => { if (!openPdf(p)) { downloadPdf(p); toast(`Downloaded ${p.name}`, 'ok'); } };
  const printPdf = (p: Pdf | undefined, what: PrintWhat) => {
    // Home-screen app / iPhone: window.print() is dead there, so open the PDF; its viewer has Share > Print.
    if (appMode) { if (p) viewPdf(p); return; }
    doPrint(what);
  };
  // Which stages are open, per mentor and mode (remembered). Check opens the stage you're on; Read opens the first.
  const pr = useMemo(() => tradeProgress(list, ticks), [list, ticks]);
  const osCheck = useOpenSet(`rfx_checklist_open_${m}_check`, [pr.cur?.s.id ?? list.stages[0]?.id].filter(Boolean) as string[]);
  const osRead = useOpenSet(`rfx_checklist_open_${m}_read`, list.stages[0] ? [list.stages[0].id] : []);
  const [memOpen, setMemOpen] = useState<string | null>(null);
  useEffect(() => setMemOpen(null), [m]);
  const os = mode === 'check' ? osCheck : mode === 'read' ? osRead : null;
  const stageIds = list.stages.map(s => s.id);
  const openCount = os ? stageIds.filter(os.isOpen).length : 0;
  const allOpen = !!os && openCount === stageIds.length;
  const reduce = !!useReducedMotion();
  const bar = useRef<HTMLDivElement>(null);
  const active = useActiveSection(stageIds.map(ckId), bar);
  const activeStage = list.stages.find(s => ckId(s.id) === active) ?? (mode === 'check' ? pr.cur?.s : undefined) ?? list.stages[0];
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [m, mode]);
  const jump = (id: string) => { if (os) os.set(id, true); else setMemOpen(id); scrollToSection(ckId(id), !reduce); };
  const allItems = useMemo(() => list.stages.flatMap(s => s.items), [list]);
  const knownAll = allItems.filter(i => known(sr[i.id])).length;
  const tickOn = useMemo(() => new Set(ticks), [ticks]);

  const reset = () => {
    const before = ticks;
    setTicks([]);
    toast(`Cleared ${before.length} ticks`, 'info', { action: { label: 'Undo', run: () => setTicks(before) } });
  };

  return (
    <Page className="max-w-[760px] mx-auto w-full">
      <Card className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="label">Cradle to grave</div>
            <h1 className="text-[22px] font-semibold tracking-tight leading-tight mt-1">{list.short} checklist</h1>
            <p className="text-[12.5px] text-ink3 mt-1 leading-snug">{list.tagline}</p>
          </div>
          <button type="button" className="btn h-10 shrink-0" onClick={() => setPdfOpen(true)} aria-haspopup="dialog"><Icon name="download" size={15} />PDF</button>
        </div>
        <div className="mt-4 flex flex-col gap-2.5">
          <div className="max-w-full overflow-hidden"><Segmented label="Mentor" value={m} onChange={v => set({ m: v })} swap="page" options={MENTOR_ORDER.map(k => ({ value: k, label: CHECKLISTS[k].short }))} /></div>
          <div className="flex flex-wrap items-center gap-2.5">
            <Segmented label="Mode" value={mode} onChange={v => set({ mode: v })} swap="page" options={MODES} />
            {mode === 'memorize' && <Segmented size="sm" label="Recall style" value={recall} onChange={setRecall} options={[{ value: 'reveal', label: 'Reveal' }, { value: 'cloze', label: 'Key words' }]} />}
          </div>
        </div>
        {mode === 'check' && <TradeProgress list={list} ticks={ticks} onReset={reset} />}
        {os && (
          <div className="mt-4 flex items-start justify-between gap-2">
            <StageJump list={list} jump={jump} />
            <ExpandAll allOpen={allOpen} onChange={on => os.setMany(stageIds, on)} className="-mr-2 -mt-1" />
          </div>
        )}
      </Card>

      <PillBar barRef={bar} label="Where you are in the checklist" menu={
        <JumpMenu anchor={bar} open={menu} onClose={() => setMenu(false)} active={active} onPick={id => jump(id.slice(3))}
          head={<><span className="label">{list.stages.length} stages{os ? ` · ${openCount} open` : ''}</span>{os ? <ExpandAll allOpen={allOpen} onChange={on => { os.setMany(stageIds, on); setMenu(false); }} className="-mr-1.5" /> : <span className="h-11" />}</>}
          items={list.stages.map(s => ({
            id: ckId(s.id), title: s.title, lead: <StageMark s={s} small />,
            pill: mode === 'memorize' ? <StagePill done={s.items.filter(i => known(sr[i.id])).length} total={s.items.length} /> : mode === 'check' ? <StagePill done={s.items.filter(i => tickOn.has(i.id)).length} total={s.items.length} /> : <PillTag>{s.items.length}</PillTag>,
            open: os ? os.isOpen(s.id) : memOpen === s.id,
          }))} />
      }>
        <BarPill onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })} label={`${list.short} checklist. Back to the top to switch mentor or mode`}>{list.short}</BarPill>
        <BarPill grow menuTrigger tone="accent" onClick={() => setMenu(o => !o)} aria-haspopup="menu" aria-expanded={menu} label={`${activeStage ? stageLabel(activeStage) : ''}. Jump to a stage`}>
          <span className="truncate">{activeStage ? stageLabel(activeStage) : 'Stages'}</span><Icon name="chevronDown" size={13} className={cx('sec-chev shrink-0 -mr-0.5', menu && 'is-open')} />
        </BarPill>
        {mode === 'check'
          ? <BarPill tone={pr.ready ? 'profit' : 'neutral'} onClick={pr.cur ? () => jump(pr.cur!.s.id) : undefined} label={`${pr.done} of ${pr.total} ticked${pr.cur ? '. Go to the stage you are on' : ''}`}><span className="num">{pr.done}/{pr.total}</span><Icon name="check" size={12} strokeWidth={2.8} className={pr.ready ? '' : 'text-ink3'} /></BarPill>
          : mode === 'memorize'
            ? <BarPill label={`${knownAll} of ${allItems.length} known`}><span className="num">{knownAll}/{allItems.length}</span><span className="text-ink3 font-medium">known</span></BarPill>
            : <BarPill label={`${list.count} points`}><span className="num">{list.count}</span><span className="text-ink3 font-medium">points</span></BarPill>}
      </PillBar>

      {mode === 'check' && <CheckMode list={list} ticks={ticks} setTicks={setTicks} os={osCheck} barRef={bar} />}
      {mode === 'memorize' && <MemorizeMode list={list} recall={recall} sr={sr} grade={grade} open={memOpen} setOpen={setMemOpen} />}
      {mode === 'read' && <ReadMode list={list} os={osRead} />}

      <Sheet bottom open={pdfOpen} onClose={() => setPdfOpen(false)} title="Save as PDF">
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-center">
            <Segmented label="Which checklist" value={pdfWhat} onChange={setPdfWhat} options={[{ value: m as PrintWhat, label: `${list.short} only` }, { value: 'all' as PrintWhat, label: 'All four mentors' }]} />
          </div>
          {pdf?.failed && pdf.what === pdfWhat ? (
            <button type="button" className="btn-primary h-12 w-full" onClick={retryPdf}><Icon name="refresh" size={15} />Could not build the PDF. Try again</button>
          ) : (
            <button type="button" className="btn-primary h-12 w-full" disabled={!ready} aria-busy={!ready} onClick={() => ready && sharePdf(ready)}>
              <Icon name={ready ? (shareOk ? 'upload' : 'download') : 'clock'} size={15} />
              {!ready ? 'Preparing PDF…' : shareOk ? 'Save or share PDF' : 'Download PDF'}
            </button>
          )}
          <div className="grid grid-cols-2 gap-2.5">
            <button type="button" className="btn h-11 w-full" disabled={!ready} onClick={() => ready && viewPdf(ready)}><Icon name="eye" size={15} />Open PDF</button>
            <button type="button" className="btn h-11 w-full" disabled={appMode && !ready} onClick={() => printPdf(ready, pdfWhat)}><Icon name="layers" size={15} />Print</button>
          </div>
          <button type="button" className="btn-ghost h-11 w-full" onClick={() => { setPdfOpen(false); navigate(`/checklist?m=${m}&view=print&print=${pdfWhat}`); }}><Icon name="eye" size={15} />Preview the sheet</button>
          <p className="text-[12px] text-ink3 leading-relaxed mt-1">
            A4, two columns, 1-2 pages per mentor{ready ? ` (${ready.pages} ${ready.pages === 1 ? 'page' : 'pages'})` : ''}.{' '}
            {shareOk
              ? 'iPhone: Save or share opens the share sheet. Pick Save to Files, Print, AirDrop or WhatsApp.'
              : 'The PDF downloads to your device. Open PDF shows it in a new tab, with its own Print.'}
          </p>
        </div>
      </Sheet>

      <PrintSheet what={printWhat} />
      {preview && createPortal(
        <div className="ck-preview-bar">
          <button type="button" className="btn h-10" onClick={() => navigate(`/checklist?m=${m}`)}><Icon name="chevronLeft" size={15} />Back</button>
          <Segmented size="sm" label="Sheet" value={printWhat} onChange={setPrintWhat} options={[...MENTOR_ORDER.map(k => ({ value: k as PrintWhat, label: CHECKLISTS[k].short })), { value: 'all' as PrintWhat, label: 'All' }]} />
          <button type="button" className="btn-primary h-10" disabled={appMode && !ready} onClick={() => (appMode ? ready && sharePdf(ready) : window.print())}><Icon name="download" size={15} />{appMode ? 'Save PDF' : 'Print'}</button>
        </div>,
        document.body,
      )}
    </Page>
  );
}
