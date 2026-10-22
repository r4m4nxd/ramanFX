// Predict-then-reveal: the chart stops at the decision point; the learner commits (buy / sell / stay out, draws the zone,
// or places entry/stop/target), then Reveal plays the rest of the candles and shows the mentor's answer and reasoning.
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { InteractiveLesson, Practice } from '@/core/interactive/types';
import { Badge, cx, ease } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { CandleScene, fmtPrice, type DrawnZone, type SceneLine, type SceneZone } from './CandleScene';
import { recordPractice } from './store';

type Side = 'buy' | 'sell' | 'none';
type Slot = 'entry' | 'sl' | 'tp';
interface Attempt { side?: Side; zone?: DrawnZone | null; entry?: number; sl?: number; tp?: number }
interface Check { label: string; ok: boolean; detail?: string }

/** Number box that keeps what you type (no reformatting mid-keystroke) but follows outside changes (chart clicks). */
function PriceInput({ value, onChange, label, className, onFocus }: { value: number | undefined; onChange: (v: number | undefined) => void; label: string; className?: string; onFocus?: () => void }) {
  const [text, setText] = useState(value != null ? value.toFixed(2) : '');
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setText(value != null ? value.toFixed(2) : ''); }, [value]);
  return (
    <input type="number" step="0.01" inputMode="decimal" aria-label={label} className={cx('field num', className)} value={text}
      onFocus={() => { focused.current = true; onFocus?.(); }} onBlur={() => { focused.current = false; setText(value != null ? value.toFixed(2) : ''); }}
      onChange={e => { setText(e.target.value); const v = parseFloat(e.target.value); onChange(isFinite(v) ? v : undefined); }} />
  );
}

const SIDE_LABEL: Record<Side, string> = { buy: 'Buy', sell: 'Sell', none: 'Stay out' };
const SLOT_LABEL: Record<Slot, string> = { entry: 'Entry', sl: 'Stop', tp: 'Target' };

function grade(p: Practice, a: Attempt, range: number): { ok: boolean; checks: Check[] } {
  const ans = p.answer, checks: Check[] = [];
  if (p.task === 'buy-sell-none') {
    checks.push({ label: 'Decision', ok: a.side === ans.side, detail: `You: ${a.side ? SIDE_LABEL[a.side] : '–'} · Answer: ${ans.side ? SIDE_LABEL[ans.side] : '–'}` });
  } else if (p.task === 'draw-zone') {
    const z = a.zone;
    if (z && ans.top != null && ans.bottom != null) {
      const inter = Math.max(0, Math.min(z.top, ans.top) - Math.max(z.bottom, ans.bottom));
      const uni = Math.max(z.top, ans.top) - Math.min(z.bottom, ans.bottom);
      const iou = uni > 0 ? inter / uni : 0;
      checks.push({ label: 'Zone overlap', ok: iou >= 0.5, detail: `${Math.round(iou * 100)}% overlap with the answer (50% or more passes)` });
      const tolE = Math.max((ans.top - ans.bottom) * 0.35, range * 0.006);
      checks.push({ label: 'Proximal line', ok: Math.abs((ans.side === 'sell' ? z.bottom : z.top) - (ans.side === 'sell' ? ans.bottom : ans.top)) <= tolE, detail: `You ${fmtPrice(ans.side === 'sell' ? z.bottom : z.top)} · Answer ${fmtPrice(ans.side === 'sell' ? ans.bottom : ans.top)}` });
    } else checks.push({ label: 'Zone', ok: false, detail: 'No zone drawn' });
  } else {
    if (ans.side) checks.push({ label: 'Direction', ok: a.side === ans.side, detail: `You: ${a.side ? SIDE_LABEL[a.side] : '–'} · Answer: ${SIDE_LABEL[ans.side]}` });
    if (ans.side !== 'none' && ans.entry != null) {
      const risk = ans.sl != null ? Math.abs(ans.entry - ans.sl) : range * 0.04;
      const tol = Math.max(risk * 0.5, range * 0.008);
      checks.push({ label: 'Entry', ok: a.entry != null && Math.abs(a.entry - ans.entry) <= tol, detail: `You ${a.entry != null ? fmtPrice(a.entry) : '–'} · Answer ${fmtPrice(ans.entry)}` });
      if (ans.sl != null) {
        const sideOk = a.sl != null && a.entry != null && Math.sign(a.entry - a.sl) === Math.sign(ans.entry - ans.sl);
        checks.push({ label: 'Stop', ok: sideOk && Math.abs(a.sl! - ans.sl) <= Math.max(risk * 0.75, range * 0.008), detail: `You ${a.sl != null ? fmtPrice(a.sl) : '–'} · Answer ${fmtPrice(ans.sl)}` });
      }
    }
  }
  return { ok: checks.length > 0 && checks.every(c => c.ok), checks };
}

function Exercise({ il, p, idx, onResult }: { il: InteractiveLesson; p: Practice; idx: number; onResult: (ok: boolean) => void }) {
  const reduce = useReducedMotion();
  const N = p.scene.candles.length;
  const shownBefore = Math.min(N, p.scene.reveal ?? N);
  const [a, setA] = useState<Attempt>({});
  const [revealed, setRevealed] = useState(false);
  const [slot, setSlot] = useState<Slot>('entry');
  useEffect(() => { setA({}); setRevealed(false); setSlot('entry'); }, [p]);

  const zoneFrom = p.scene.highlight?.from ?? p.scene.zones?.[0]?.from ?? Math.max(0, shownBefore - 8);
  const range = useMemo(() => { const hs = p.scene.candles.map(c => c.h), ls = p.scene.candles.map(c => c.l); return Math.max(...hs) - Math.min(...ls); }, [p]);
  const needSide = p.task === 'buy-sell-none' || (p.task === 'pick-entry' && !!p.answer.side);
  const slots: Slot[] = p.task === 'pick-entry' ? (['entry', 'sl', 'tp'] as Slot[]).filter(s => s === 'entry' || p.answer[s] != null) : [];
  const ready = p.task === 'buy-sell-none' ? !!a.side : p.task === 'draw-zone' ? !!a.zone : (!needSide || !!a.side) && (a.side === 'none' || a.entry != null);
  const result = useMemo(() => (revealed ? grade(p, a, range) : null), [revealed, p, a, range]);

  const reveal = () => { if (!ready || revealed) return; setRevealed(true); const g = grade(p, a, range); recordPractice(il, idx, g.ok); onResult(g.ok); };
  const reset = () => { setA({}); setRevealed(false); setSlot('entry'); };
  const pick = (price: number) => {
    if (revealed || p.task !== 'pick-entry') return;
    setA(x => ({ ...x, [slot]: price }));
    const k = slots.indexOf(slot); if (k < slots.length - 1) setSlot(slots[k + 1]);
  };

  // Overlays: the learner's picks as ghost lines; after reveal, the answer in full colour.
  const userLines: SceneLine[] = (['entry', 'sl', 'tp'] as Slot[]).flatMap(s => (a[s] != null ? [{ y: a[s]!, label: `You · ${SLOT_LABEL[s]}`, kind: s, ghost: true }] : []));
  const ans = p.answer;
  const answerLines: SceneLine[] = revealed ? [
    ...(ans.entry != null ? [{ y: ans.entry, label: 'Entry', kind: 'entry' as const }] : []),
    ...(ans.sl != null ? [{ y: ans.sl, label: 'Stop', kind: 'sl' as const }] : []),
    ...(ans.tp != null ? [{ y: ans.tp, label: 'Target', kind: 'tp' as const }] : []),
  ] : [];
  const answerZones: SceneZone[] = revealed && ans.top != null && ans.bottom != null && p.task === 'draw-zone'
    ? [{ from: zoneFrom, top: ans.top, bottom: ans.bottom, kind: ans.side === 'sell' ? 'supply' : 'demand', label: 'Answer zone', ghost: true }] : [];

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] leading-relaxed text-ink max-w-[70ch]">{p.prompt}</p>
      <div className="rounded-xl border border-line bg-bg/40 p-2 sm:p-3">
        <CandleScene scene={p.scene} visibleCount={revealed ? N : shownBefore} stagger={0.09}
          label={revealed ? 'Practice chart, outcome revealed' : `Practice chart, ${shownBefore} candles shown, the rest hidden`}
          mode={revealed ? 'view' : p.task === 'draw-zone' ? 'draw-zone' : p.task === 'pick-entry' && a.side !== 'none' ? 'pick-price' : 'view'}
          drawn={a.zone} onZoneDraw={z => setA(x => ({ ...x, zone: z }))} onPricePick={pick}
          extraLines={[...userLines, ...answerLines]} extraZones={answerZones} />
      </div>

      {!revealed && (
        <div className="flex flex-col gap-3">
          {needSide && (
            <div role="radiogroup" aria-label="Your decision" className="flex flex-wrap gap-2">
              {(['buy', 'sell', 'none'] as Side[]).map(s => (
                <button key={s} type="button" role="radio" aria-checked={a.side === s} onClick={() => setA(x => ({ ...x, side: s }))}
                  className={cx('btn min-w-[96px]', a.side === s && (s === 'buy' ? '!border-profit/60 !bg-profit/15 !text-profit' : s === 'sell' ? '!border-loss/60 !bg-loss/15 !text-loss' : '!border-ink3/60 !bg-raised'))}>
                  <Icon name={s === 'buy' ? 'arrowUp' : s === 'sell' ? 'arrowDown' : 'minus'} size={14} />{SIDE_LABEL[s]}
                </button>
              ))}
            </div>
          )}
          {p.task === 'draw-zone' && (
            <div className="flex flex-wrap items-end gap-3">
              <p className="text-[13px] text-ink2 w-full">Drag a box on the chart over the zone (top = proximal, bottom = distal), or type the prices.</p>
              {(['top', 'bottom'] as const).map(k => (
                <div key={k} className="flex flex-col gap-1 text-[12px] text-ink3 font-semibold"><span aria-hidden="true">{k === 'top' ? 'Top (proximal)' : 'Bottom (distal)'}</span>
                  <PriceInput label={k === 'top' ? 'Zone top price' : 'Zone bottom price'} className="w-32" value={a.zone?.[k]}
                    onChange={v => { if (v == null) return; setA(x => { const z = x.zone ?? { top: v, bottom: v, from: zoneFrom, to: shownBefore - 1 }; const nz = { ...z, [k]: v }; return { ...x, zone: { ...nz, top: Math.max(nz.top, nz.bottom), bottom: Math.min(nz.top, nz.bottom) } }; }); }} />
                </div>
              ))}
              {a.zone && <button type="button" className="btn-ghost" onClick={() => setA(x => ({ ...x, zone: null }))}>Clear</button>}
            </div>
          )}
          {p.task === 'pick-entry' && a.side !== 'none' && (
            <div className="flex flex-col gap-2">
              <p className="text-[13px] text-ink2">Click the chart to place each price. Choose which one you are placing:</p>
              <div className="flex flex-wrap items-end gap-3">
                {slots.map(s => (
                  <div key={s} className="flex flex-col gap-1">
                    <button type="button" aria-pressed={slot === s} onClick={() => setSlot(s)}
                      className={cx('chip justify-center', slot === s && '!border-accent !text-ink ring-2 ring-accent/25')}>
                      <span className={cx('w-2 h-2 rounded-full', s === 'entry' ? 'bg-accent' : s === 'sl' ? 'bg-loss' : 'bg-profit')} />{SLOT_LABEL[s]}{s === 'tp' && <span className="text-ink3">(optional)</span>}
                    </button>
                    <PriceInput label={`${SLOT_LABEL[s]} price`} className="w-28 h-8" value={a[s]} onFocus={() => setSlot(s)} onChange={v => setA(x => ({ ...x, [s]: v }))} />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-primary" disabled={!ready} onClick={reveal}><Icon name="eye" size={14} />Reveal what happened</button>
            {!ready && <span className="text-[12px] text-ink3 self-center">{p.task === 'draw-zone' ? 'Draw your zone first.' : 'Make your call first.'}</span>}
          </div>
        </div>
      )}

      <AnimatePresence>
        {revealed && result && (
          <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: reduce ? 0 : Math.min(1.2, (N - shownBefore) * 0.09) }}
            className={cx('rounded-xl border p-4', result.ok ? 'border-profit/40 bg-profit/[0.07]' : 'border-warn/40 bg-warn/[0.07]')} role="status">
            <div className="flex items-center gap-2 mb-2">
              <span className={cx('w-7 h-7 rounded-full grid place-items-center', result.ok ? 'bg-profit text-on-status' : 'bg-warn text-on-status')}><Icon name={result.ok ? 'check' : 'info'} size={15} /></span>
              <span className="text-[15px] font-semibold">{result.ok ? 'Nice read. That is the trade.' : 'Not quite. Here is how the mentor sees it.'}</span>
            </div>
            <ul className="flex flex-wrap gap-2 mb-3">
              {result.checks.map((c, k) => <li key={k}><Badge tone={c.ok ? 'profit' : 'loss'}>{c.ok ? <Icon name="check" size={11} /> : <Icon name="x" size={11} />}{c.label}</Badge>{c.detail && <span className="ml-1.5 text-[12px] text-ink3 num">{c.detail}</span>}</li>)}
            </ul>
            <p className="text-[14px] leading-relaxed text-ink">{p.explain}</p>
            <button type="button" className="btn mt-3" onClick={reset}><Icon name="refresh" size={13} />Try again</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function PracticeBoard({ il, onDone }: { il: InteractiveLesson; onDone?: () => void }) {
  const [k, setK] = useState(0);
  const [results, setResults] = useState<Record<number, boolean>>({});
  useEffect(() => { setK(0); setResults({}); }, [il]);
  const list = il.practice;
  if (!list.length) return <p className="text-[13px] text-ink3">No practice exercises for this lesson yet.</p>;
  const done = Object.keys(results).length;
  const right = Object.values(results).filter(Boolean).length;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div role="tablist" aria-label="Exercises" className="flex gap-1.5">
          {list.map((_, j) => (
            <button key={j} type="button" role="tab" aria-selected={j === k} onClick={() => setK(j)}
              className={cx('h-8 min-w-8 px-3 rounded-full text-[12.5px] font-semibold border transition-colors', j === k ? 'bg-accent/15 border-accent/50 text-ink' : 'border-line2 text-ink2 hover:bg-raised/60')}>
              <span className="inline-flex items-center gap-1.5">{results[j] != null && <span className={cx('w-1.5 h-1.5 rounded-full', results[j] ? 'bg-profit' : 'bg-warn')} />}Exercise {j + 1}</span>
            </button>
          ))}
        </div>
        {done > 0 && <span className="ml-auto text-[12.5px] text-ink3 num">{right}/{list.length} correct this round</span>}
      </div>
      <Exercise key={k} il={il} p={list[k]} idx={k} onResult={ok => setResults(r => ({ ...r, [k]: ok }))} />
      {done > 0 && (
        <div className="flex justify-end gap-2">
          {k < list.length - 1 ? <button type="button" className="btn" onClick={() => setK(k + 1)}>Next exercise<Icon name="chevronRight" size={14} /></button>
            : onDone && <button type="button" className="btn-primary" onClick={onDone}>Take the quiz<Icon name="chevronRight" size={14} /></button>}
        </div>
      )}
    </div>
  );
}
