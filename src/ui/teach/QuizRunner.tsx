// Retrieval quiz: multiple choice, true/false, put-in-order (drag or keyboard) and spot-it-on-the-chart.
// Instant feedback with the mentor's explanation, a score, and a round that replays only the misses.
import { AnimatePresence, motion, Reorder, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { InteractiveLesson, Quiz } from '@/core/interactive/types';
import { Bar, cx, ease } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { CandleScene } from './CandleScene';
import { recordQuiz } from './store';

type Verdict = { ok: boolean };

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = arr.slice(); let s = seed || 1;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 16807) % 2147483647; const j = s % (i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function Feedback({ ok, explain, extra }: { ok: boolean; explain: string; extra?: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease }} role="status"
      className={cx('rounded-xl border p-3.5', ok ? 'border-profit/40 bg-profit/[0.07]' : 'border-loss/40 bg-loss/[0.06]')}>
      <div className={cx('flex items-center gap-2 text-[14px] font-semibold', ok ? 'text-profit' : 'text-loss')}><Icon name={ok ? 'check' : 'x'} size={15} />{ok ? 'Correct' : 'Not quite'}</div>
      {extra}
      <p className="text-[13.5px] leading-relaxed text-ink mt-1.5">{explain}</p>
    </motion.div>
  );
}

function Choice({ label, state, onClick, disabled, hint }: { label: string; state: 'idle' | 'right' | 'wrong' | 'dim'; onClick: () => void; disabled: boolean; hint?: string }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-keyshortcuts={hint}
      className={cx('w-full text-left flex items-start gap-3 rounded-xl border px-3.5 py-3 text-[14px] leading-snug transition-colors disabled:cursor-default',
        state === 'idle' && 'border-line2 hover:border-accent/50 hover:bg-raised/50',
        state === 'right' && 'border-profit/60 bg-profit/10 text-ink',
        state === 'wrong' && 'border-loss/60 bg-loss/10 text-ink',
        state === 'dim' && 'border-line text-ink3')}>
      {hint && <span className="num w-5 h-5 shrink-0 rounded-md border border-line2 grid place-items-center text-[11px] text-ink3 mt-px">{hint}</span>}
      <span className="flex-1">{label}</span>
      {state === 'right' && <Icon name="check" size={16} className="text-profit shrink-0" />}
      {state === 'wrong' && <Icon name="x" size={16} className="text-loss shrink-0" />}
    </button>
  );
}

function McqQ({ q, onAnswer }: { q: Extract<Quiz, { type: 'mcq' }>; onAnswer: (v: Verdict) => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const choose = (i: number) => { if (pick != null) return; setPick(i); onAnswer({ ok: i === q.answer }); };
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, select')) return; const n = Number(e.key); if (n >= 1 && n <= q.options.length) choose(n - 1); };
    window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h);
  });
  return (
    <div className="flex flex-col gap-2.5">
      {q.scene && <div className="rounded-xl border border-line bg-bg/40 p-2"><CandleScene scene={q.scene} label="Chart for this question" height={220} /></div>}
      <div className="flex flex-col gap-2" role="group" aria-label="Answers">
        {q.options.map((o, i) => <Choice key={i} label={o} hint={String(i + 1)} disabled={pick != null} onClick={() => choose(i)} state={pick == null ? 'idle' : i === q.answer ? 'right' : i === pick ? 'wrong' : 'dim'} />)}
      </div>
      {pick != null && <Feedback ok={pick === q.answer} explain={q.explain} />}
    </div>
  );
}

function TfQ({ q, onAnswer }: { q: Extract<Quiz, { type: 'tf' }>; onAnswer: (v: Verdict) => void }) {
  const [pick, setPick] = useState<boolean | null>(null);
  const choose = (v: boolean) => { if (pick != null) return; setPick(v); onAnswer({ ok: v === q.answer }); };
  return (
    <div className="flex flex-col gap-2.5">
      {q.scene && <div className="rounded-xl border border-line bg-bg/40 p-2"><CandleScene scene={q.scene} label="Chart for this question" height={220} /></div>}
      <div className="grid grid-cols-2 gap-2" role="group" aria-label="True or false">
        {[true, false].map(v => <Choice key={String(v)} label={v ? 'True' : 'False'} disabled={pick != null} onClick={() => choose(v)} state={pick == null ? 'idle' : v === q.answer ? 'right' : v === pick ? 'wrong' : 'dim'} />)}
      </div>
      {pick != null && <Feedback ok={pick === q.answer} explain={q.explain} />}
    </div>
  );
}

function OrderQ({ q, seed, onAnswer }: { q: Extract<Quiz, { type: 'order' }>; seed: number; onAnswer: (v: Verdict) => void }) {
  const initial = useMemo(() => {
    let s = seededShuffle(q.items, seed + q.items.length * 31);
    if (s.every((x, i) => x === q.items[i])) s = [...s.slice(1), s[0]];
    return s;
  }, [q, seed]);
  const [items, setItems] = useState(initial);
  const [checked, setChecked] = useState<boolean | null>(null);
  const [live, setLive] = useState('');
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const move = (from: number, to: number) => {
    if (checked != null || to < 0 || to >= items.length) return;
    const next = items.slice(); const [x] = next.splice(from, 1); next.splice(to, 0, x); setItems(next);
    setLive(`${x} moved to position ${to + 1} of ${items.length}`);
    requestAnimationFrame(() => refs.current[x]?.focus());
  };
  const check = () => { const ok = items.every((x, i) => x === q.items[i]); setChecked(ok); onAnswer({ ok }); };
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12.5px] text-ink3">Drag the rows into the right order, or focus a row's handle and use the up and down arrow keys.</p>
      <Reorder.Group axis="y" values={items} onReorder={v => checked == null && setItems(v)} className="flex flex-col gap-2" aria-label="Items to order">
        {items.map((it, i) => {
          const state = checked == null ? 'idle' : q.items[i] === it ? 'right' : 'wrong';
          return (
            <Reorder.Item key={it} value={it} dragListener={checked == null} className={cx('flex items-center gap-2 rounded-xl border bg-surface px-2 py-2 text-[14px] leading-snug touch-none',
              state === 'idle' && 'border-line2', state === 'right' && 'border-profit/60 bg-profit/10', state === 'wrong' && 'border-loss/60 bg-loss/10')}
              whileDrag={{ scale: 1.02, boxShadow: '0 10px 30px -10px rgb(0 0 0 / 0.4)' }}>
              <button type="button" ref={el => { refs.current[it] = el; }} disabled={checked != null}
                className="w-8 h-8 shrink-0 rounded-lg grid place-items-center text-ink3 hover:bg-raised cursor-grab active:cursor-grabbing"
                aria-label={`${it}. Position ${i + 1} of ${items.length}. Use up and down arrows to move.`}
                onKeyDown={e => { if (e.key === 'ArrowUp') { e.preventDefault(); move(i, i - 1); } else if (e.key === 'ArrowDown') { e.preventDefault(); move(i, i + 1); } }}>
                <svg width="12" height="16" viewBox="0 0 12 16" aria-hidden="true" className="fill-current"><circle cx="3" cy="3" r="1.4" /><circle cx="9" cy="3" r="1.4" /><circle cx="3" cy="8" r="1.4" /><circle cx="9" cy="8" r="1.4" /><circle cx="3" cy="13" r="1.4" /><circle cx="9" cy="13" r="1.4" /></svg>
              </button>
              <span className="num text-[12px] text-ink3 w-4 shrink-0">{i + 1}</span>
              <span className="flex-1">{it}</span>
              {checked != null && state === 'wrong' && <span className="text-[11.5px] text-ink3 shrink-0 num">→ {q.items.indexOf(it) + 1}</span>}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
      <div className="sr-only" aria-live="polite">{live}</div>
      {checked == null
        ? <div><button type="button" className="btn-primary" onClick={check}>Check order</button></div>
        : <Feedback ok={checked} explain={q.explain} extra={!checked && <ol className="mt-2 list-decimal pl-5 text-[13px] text-ink2 space-y-0.5">{q.items.map(x => <li key={x}>{x}</li>)}</ol>} />}
    </div>
  );
}

function SpotQ({ q, onAnswer }: { q: Extract<Quiz, { type: 'spot' }>; onAnswer: (v: Verdict) => void }) {
  const [sel, setSel] = useState<number[]>([]);
  const [checked, setChecked] = useState<boolean | null>(null);
  const toggle = (i: number) => { if (checked != null) return; setSel(s => (s.includes(i) ? s.filter(x => x !== i) : [...s, i])); };
  const check = () => {
    const { from, to } = q.answer;
    const ok = sel.some(i => i >= from && i <= to) && sel.every(i => i >= from - 1 && i <= to + 1);
    setChecked(ok); onAnswer({ ok });
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border border-line bg-bg/40 p-2">
        <CandleScene scene={q.scene} label="Chart: pick the candles the question asks for" hideHighlight={checked == null}
          onCandleClick={checked == null ? toggle : undefined} selected={sel} correctRange={checked != null ? q.answer : null} />
      </div>
      {checked == null
        ? <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn-primary" onClick={check} disabled={!sel.length}>Check</button>
            <span className="text-[12.5px] text-ink3">{sel.length ? `${sel.length} candle${sel.length > 1 ? 's' : ''} selected · click again to unselect` : 'Click the candle(s) on the chart.'}</span>
          </div>
        : <Feedback ok={checked} explain={q.explain} extra={<p className="text-[12.5px] text-ink3 mt-1">The right candles are outlined in green.</p>} />}
    </div>
  );
}

export function QuizRunner({ il, onDone }: { il: InteractiveLesson; onDone?: () => void }) {
  const all = il.quiz;
  const [round, setRound] = useState(0);                 // bumps on every new round (reshuffles order questions)
  const [queue, setQueue] = useState<number[]>(() => all.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [res, setRes] = useState<Record<number, boolean>>({});
  const [ever, setEver] = useState<Set<number>>(new Set());
  const reduce = useReducedMotion();
  const head = useRef<HTMLHeadingElement>(null);
  useEffect(() => { setQueue(all.map((_, i) => i)); setPos(0); setRes({}); setEver(new Set()); setRound(r => r + 1); }, [all]);

  const finished = pos >= queue.length;
  const qi = queue[pos];
  const q = all[qi];
  const answered = res[qi] != null && !finished;
  const roundRight = queue.filter(i => res[i]).length;
  const wrong = queue.filter(i => res[i] === false);

  useEffect(() => { if (finished && all.length) recordQuiz(il, ever.size / all.length); }, [finished, ever, all.length, il]);
  useEffect(() => { if (pos > 0) head.current?.focus(); }, [pos]);

  if (!all.length) return <p className="text-[13px] text-ink3">No quiz for this lesson yet.</p>;
  const onAnswer = (v: Verdict) => { setRes(r => ({ ...r, [qi]: v.ok })); if (v.ok) setEver(s => new Set(s).add(qi)); };
  const restart = (ids: number[]) => { setQueue(ids); setPos(0); setRes({}); setRound(r => r + 1); if (ids.length === all.length) setEver(new Set()); };

  if (finished) {
    const pct = Math.round((roundRight / queue.length) * 100);
    const best = Math.round((ever.size / all.length) * 100);
    return (
      <div className="flex flex-col items-center text-center gap-3 py-4" role="status">
        <div className="text-[44px] font-semibold tracking-tight num leading-none">{pct}%</div>
        <p className="text-[14px] text-ink2">{roundRight} of {queue.length} right this round{queue.length !== all.length && ` · ${best}% of the whole quiz answered correctly`}.</p>
        <p className="text-[13px] text-ink3 max-w-[48ch]">{pct === 100 ? 'Clean sweep. The flashcards will keep it fresh.' : 'Misses are where the learning is. Run them again while the explanations are fresh.'}</p>
        <div className="flex flex-wrap justify-center gap-2 mt-1">
          {wrong.length > 0 && <button type="button" className="btn-primary" onClick={() => restart(wrong)}><Icon name="refresh" size={13} />Retry the {wrong.length} I missed</button>}
          <button type="button" className="btn" onClick={() => restart(all.map((_, i) => i))}>Start over</button>
          {onDone && <button type="button" className={wrong.length ? 'btn' : 'btn-primary'} onClick={onDone}>Flashcards<Icon name="chevronRight" size={14} /></button>}
        </div>
      </div>
    );
  }

  const kind = q.type === 'mcq' ? 'Multiple choice' : q.type === 'tf' ? 'True or false' : q.type === 'order' ? 'Put in order' : 'Spot it on the chart';
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Bar value={(pos + (answered ? 1 : 0)) / queue.length} className="flex-1" />
        <span className="num text-[12px] text-ink3 shrink-0">{pos + 1}/{queue.length}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={`${round}-${pos}`} initial={reduce ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -12 }} transition={{ duration: 0.25, ease }} className="flex flex-col gap-3">
          <div>
            <div className="label mb-1">{kind}</div>
            <h4 ref={head} tabIndex={-1} className="text-[16px] font-semibold leading-snug outline-none">{q.q}</h4>
          </div>
          {q.type === 'mcq' && <McqQ q={q} onAnswer={onAnswer} />}
          {q.type === 'tf' && <TfQ q={q} onAnswer={onAnswer} />}
          {q.type === 'order' && <OrderQ q={q} seed={qi * 7 + round} onAnswer={onAnswer} />}
          {q.type === 'spot' && <SpotQ q={q} onAnswer={onAnswer} />}
        </motion.div>
      </AnimatePresence>
      <div className="flex justify-end min-h-9">
        {answered && <button type="button" className="btn-primary" onClick={() => setPos(p => p + 1)} autoFocus>{pos === queue.length - 1 ? 'See score' : 'Next question'}<Icon name="chevronRight" size={14} /></button>}
      </div>
    </div>
  );
}
