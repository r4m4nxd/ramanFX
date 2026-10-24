import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CHECKLISTS, isChecklistMentor, MENTOR_ORDER, type CheckItem, type Checklist, type ChecklistMentor, type Stage } from '@/core/checklists';
import { Card, cx, Page, Segmented, Sheet, spring, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

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

function StageHead({ s, right }: { s: Stage; right?: ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className={cx('num w-8 h-8 rounded-full grid place-items-center text-[13px] font-bold shrink-0', s.kind === 'never' ? 'bg-loss/15 text-loss' : s.kind === 'visual' ? 'bg-violet/15 text-violet' : 'bg-accent/15 text-accent')}>{stageMark(s)}</span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-semibold leading-tight">{s.title}</h3>
        {s.goal && <p className="text-[12px] text-ink3 mt-0.5 leading-snug">{s.goal}</p>}
      </div>
      {right}
    </div>
  );
}

function StageJump({ list }: { list: Checklist }) {
  const jump = (id: string) => document.getElementById(`ck-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

// ─── Check mode ─────────────────────────────────────────────────────────────────────────────────────────
function CheckMode({ list, ticks, setTicks }: { list: Checklist; ticks: string[]; setTicks: (t: string[]) => void }) {
  const on = useMemo(() => new Set(ticks), [ticks]);
  const flip = (id: string) => setTicks(on.has(id) ? ticks.filter(x => x !== id) : [...ticks, id]);
  return (
    <>
      {list.stages.map(s => {
        const done = s.items.filter(i => on.has(i.id)).length;
        const full = done === s.items.length;
        return (
          <Card key={s.id} className="p-4 sm:p-5 scroll-mt-24" aria-label={s.title}>
            <div id={`ck-${s.id}`} className="scroll-mt-24" />
            <StageHead s={s} right={<span className={cx('num text-[12px] font-semibold mt-1.5 shrink-0', full ? 'text-profit' : 'text-ink3')}>{done}/{s.items.length}</span>} />
            <ul className="mt-3 flex flex-col">
              {s.items.map(it => {
                const ticked = on.has(it.id);
                return (
                  <li key={it.id}>
                    <button type="button" role="checkbox" aria-checked={ticked} onClick={() => flip(it.id)}
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
          </Card>
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
    <Card className="p-0 overflow-hidden" aria-label={s.title}>
      <button type="button" onClick={onToggle} aria-expanded={open} className="w-full text-left p-4 sm:p-5 active:bg-raised/40 transition-colors">
        <StageHead s={{ ...s, goal: undefined }} right={
          <span className="flex flex-col items-end gap-1 mt-0.5 shrink-0">
            <span className="num text-[12px] font-semibold text-ink2">{s.items.length} bullets</span>
            <span className="num text-[11px] text-ink3">{knownCount} known</span>
          </span>} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} className="overflow-hidden">
            <div className="px-4 sm:px-5 pb-4 sm:pb-5 flex flex-col gap-2">
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
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
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

function MemorizeMode({ list, recall, sr, grade }: { list: Checklist; recall: Recall; sr: Record<string, Score>; grade: (id: string, knew: boolean) => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [drill, setDrill] = useState<CheckItem[] | null>(null);
  useEffect(() => { setOpen(null); setDrill(null); }, [list.id]);
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
function ReadMode({ list }: { list: Checklist }) {
  return (
    <>
      {list.stages.map(s => (
        <Card key={s.id} className="p-4 sm:p-5" aria-label={s.title}>
          <div id={`ck-${s.id}`} className="scroll-mt-24" />
          <StageHead s={s} />
          <ul className="mt-3 flex flex-col gap-2.5">
            {s.items.map(it => (
              <li key={it.id} className="flex gap-2.5">
                <span className={cx('mt-[8px] w-1.5 h-1.5 rounded-full shrink-0', s.kind === 'never' ? 'bg-loss' : s.kind === 'visual' ? 'bg-violet' : 'bg-accent')} />
                <span className="min-w-0"><span className="text-[14px] leading-snug text-ink">{it.text}</span> <SrcTag it={it} /></span>
              </li>
            ))}
          </ul>
        </Card>
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
  const reset = () => {
    const before = ticks;
    setTicks([]);
    toast(`Cleared ${before.length} ticks`, 'info', { action: { label: 'Undo', run: () => setTicks(before) } });
  };

  const total = list.count;
  const pct = total ? ticks.length / total : 0;

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
        {mode === 'check' && (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[12.5px] text-ink2"><span className="num font-semibold text-ink">{ticks.length}</span>/<span className="num">{total}</span> ticked</span>
              <button type="button" className="btn-ghost h-9 px-3 text-[12.5px]" onClick={reset} disabled={!ticks.length}><Icon name="refresh" size={13} />Reset</button>
            </div>
            <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><motion.div className="h-full w-full bg-profit rounded-full origin-left" animate={{ transform: `scaleX(${pct})` }} transition={spring} /></div>
          </div>
        )}
        {mode !== 'memorize' && <div className="mt-4"><StageJump list={list} /></div>}
      </Card>

      {mode === 'check' && <CheckMode list={list} ticks={ticks} setTicks={setTicks} />}
      {mode === 'memorize' && <MemorizeMode list={list} recall={recall} sr={sr} grade={grade} />}
      {mode === 'read' && <ReadMode list={list} />}

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
