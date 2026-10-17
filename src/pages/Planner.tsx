import { TickerTape } from '@/ui/TickerTape';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { DEFAULT_RISK_RULES, useStore } from '@/data/store';
import { useEnriched } from '@/data/derived';
import { usePlans } from '@/data/guru';
import { positionSize } from '@/core/instruments';
import { blankPlan, evaluatePlan, formation, SD_COMBOS, trendRel, type ConfSignal, type MoveAway, type Plan, type PlanStatus } from '@/core/strategy';
import { money, num, price } from '@/lib/format';
import { Badge, Card, CardHead, cx, Empty, Field, Page, Segmented, useIsMobile, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { Choice, CurveSlider, MoveAwayArt, Question, VerdictPanel, YesNo } from '@/ui/PlanParts';
import { SymbolPicker, useSpec } from './calcShared';
import { ZoneBoard } from '@/ui/ZoneBoard';
import { PLANNER_LESSONS } from '@/core/lessonLinks';
import { LessonChips, MentorChecks } from '@/ui/LessonLinks';

const STEPS = ['Setup', 'Zone', 'Context', 'Levels', 'Verdict'] as const;
const MOVES: { v: MoveAway; t: string; s: string }[] = [
  { v: 'poor', t: 'Poor', s: 'Drifts away, choppy' },
  { v: 'decent', t: 'Decent', s: 'Clear momentum, several candles' },
  { v: 'aplus', t: 'A+', s: 'Explosive, big bodies, no wicks' },
  { v: 'gap', t: 'Gap', s: 'Gapped away from the zone' },
];
const SIGNALS: { v: ConfSignal; t: string; s: string }[] = [
  { v: 'both', t: 'Zone + trendline', s: 'The best confirmation' },
  { v: 'trendline', t: 'Trendline removed', s: 'Stronger than a zone' },
  { v: 'zone', t: 'Opposing zone removed', s: 'Most common' },
  { v: 'structure', t: 'Structure shift', s: 'Clear high/low broken' },
  { v: 'breakout', t: 'Breakout stop order', s: 'Worse R:R' },
];
export const STATUS: Record<PlanStatus, { t: string; tone: 'neutral' | 'accent' | 'warn' | 'profit' | 'loss' | 'violet' }> = {
  planned: { t: 'Planned', tone: 'neutral' }, waiting: { t: 'Waiting for touch', tone: 'accent' }, touched: { t: 'Touched — confirm', tone: 'warn' },
  ordered: { t: 'Order placed', tone: 'violet' }, filled: { t: 'In trade / done', tone: 'profit' }, skipped: { t: 'Skipped', tone: 'neutral' }, missed: { t: 'Missed', tone: 'loss' },
};

function Wizard({ initial, onDone }: { initial: Plan; onDone: (p: Plan | null) => void }) {
  const save = useStore(s => s.savePlan);
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const accounts = useStore(s => s.accounts);
  const active = useStore(s => s.activeAccount);
  const toast = useToast();
  const mobile = useIsMobile();
  const [p, setP] = useState<Plan>(initial);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  // The first step just appears with the page; only later step changes slide.
  const firstStep = useRef(true);
  useEffect(() => { firstStep.current = false; }, []);
  const set = (patch: Partial<Plan>) => setP(x => ({ ...x, ...patch }));
  const v = useMemo(() => evaluatePlan(p, rules.riskPercent ?? 1), [p, rules.riskPercent]);
  const spec = useSpec(p.symbol || 'EURUSD', false);
  const pip = spec.spec.pipSize, digits = spec.spec.digits;
  const balance = (active !== 'all' ? accounts[active]?.snapshot?.balance : Object.values(accounts)[0]?.snapshot?.balance) ?? null;
  const [buffer, setBuffer] = useState(10);
  const [bal, setBal] = useState(String(balance ?? 10000));
  const combo = SD_COMBOS[p.combo];

  // Levels follow the zone: stop just beyond the distal line, entry at the proximal, target from the prescribed R.
  const dirn = p.side === 'buy' ? 1 : -1;
  const autoStop = p.distal != null ? +(p.distal - dirn * buffer * pip).toFixed(digits) : null;
  useEffect(() => { if (autoStop != null) set({ stop: autoStop }); /* eslint-disable-next-line */ }, [p.distal, buffer, p.side]);
  useEffect(() => { if (p.proximal != null && (p.entry == null || initial.entry == null)) set({ entry: p.proximal }); /* eslint-disable-next-line */ }, [p.proximal]);
  useEffect(() => { if (p.riskPct == null || p.riskPct > v.mgmt.maxRiskPct) set({ riskPct: v.mgmt.maxRiskPct }); /* eslint-disable-next-line */ }, [v.mgmt.maxRiskPct]);
  const riskDist = p.entry != null && p.stop != null ? Math.abs(p.entry - p.stop) : 0;
  const riskAmt = (+bal || 0) * (p.riskPct ?? 0) / 100;
  const size = riskDist ? positionSize({ riskAmount: riskAmt, entry: 0, stop: riskDist, unitValue: spec.uv.value, lotStep: 0.01, minLot: 0.01 }) : null;
  const tpFor = (r: number) => (p.entry != null && riskDist ? +(p.entry + dirn * riskDist * r).toFixed(digits) : null);

  const go = (d: number) => { setDir(d); setStep(s => Math.max(0, Math.min(STEPS.length - 1, s + d))); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const commit = () => {
    const out = { ...p, lots: size?.lots ?? p.lots ?? null, riskAmount: size?.riskAtLots ?? null, account: p.account ?? (active !== 'all' ? active : null) };
    save(out); toast(v.tradeable ? 'Plan saved' : 'Saved as a skipped setup'); onDone(out);
  };

  const body = [
    // 1 ─ Setup
    <div key="setup" className="flex flex-col gap-6">
      <Question q="Instrument and direction">
        <div className="grid sm:grid-cols-[1fr_auto] gap-2">
          <SymbolPicker value={p.symbol} onChange={s => set({ symbol: s })} futures={false} />
          <Segmented label="Direction" value={p.side} onChange={s => set({ side: s })} options={[{ value: 'buy', label: 'Long · demand' }, { value: 'sell', label: 'Short · supply' }]} />
        </div>
      </Question>
      <Question q="Which method?" hint="Confirmation waits for the HTF zone to be touched, then an ETF signal. Set & forget trades ETF zones outside HTF zones with no confirmation.">
        <div className="grid grid-cols-2 gap-2">
          <Choice on={p.method === 'sf'} onClick={() => set({ method: 'sf' })} title="Set & forget" sub="Limit order at the ETF zone" />
          <Choice on={p.method === 'conf'} onClick={() => set({ method: 'conf' })} title="Confirmation" sub="HTF touch → ETF signal → entry" />
        </div>
      </Question>
      <Question q="Timeframes (entry → higher)" hint="No best combo — use the one your life allows. Swing if you work a 9–5.">
        <div className="grid grid-cols-3 gap-2">
          {SD_COMBOS.map((c, i) => <Choice key={i} on={p.combo === i} onClick={() => set({ combo: i })} title={<span className="num">{c.etf} → {c.htf}</span>} sub={c.style} />)}
        </div>
      </Question>
      {combo.style === 'Day' && <Question q="Economic calendar checked?" hint="Lower timeframes get hit by data releases. Wait for the initial spike."><YesNo value={!!p.newsChecked} onChange={x => set({ newsChecked: x })} yes="Checked" no="Not yet" /></Question>}
    </div>,
    // 2 ─ Zone
    <div key="zone" className="flex flex-col gap-6">
      <Question q="What kind of zone?" hint={`On your ${combo.etf} chart.`}>
        <div className="grid grid-cols-2 gap-2">
          <Choice on={p.kind === 'VP'} onClick={() => set({ kind: 'VP' })} title={`${p.side === 'buy' ? 'Valley' : 'Peak'} (VP)`} sub={formation('VP', p.side)} />
          <Choice on={p.kind === 'CP'} onClick={() => set({ kind: 'CP' })} title="Continuation (CP)" sub={formation('CP', p.side)} />
        </div>
      </Question>
      <Question q="The move away" hint="The best zones are created by the best moves away. A Marubozu leaving the base is the strongest sign.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MOVES.map(m => <Choice key={m.v} on={p.moveAway === m.v} onClick={() => set({ moveAway: m.v })} title={m.t} sub={m.s} tone={m.v === 'poor' ? 'loss' : 'accent'}><MoveAwayArt grade={m.v} side={p.side} /></Choice>)}
        </div>
      </Question>
      <Question q="Basing candles" hint="Tight and well structured. 1–2 is his favourite, up to 4 is fine, wide and messy should be avoided.">
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <motion.button key={n} type="button" whileTap={{ scale: 0.97 }} onClick={() => set({ baseCandles: n })}
              className={cx('w-12 h-12 rounded-xl border num text-[15px] font-semibold', p.baseCandles === n ? (n <= 2 ? 'border-profit bg-profit/15 text-profit' : n <= 4 ? 'border-accent bg-accent/15 text-accent' : 'border-loss bg-loss/15 text-loss') : 'border-line bg-raised/40')}>{n === 7 ? '7+' : n}</motion.button>
          ))}
        </div>
      </Question>
      <Question q="Base structure">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Choice on={p.baseType === 'single'} onClick={() => set({ baseType: 'single', baseCandles: 1 })} title="Single candle" sub="His favourite" tone="profit" />
          <Choice on={p.baseType === 'tight'} onClick={() => set({ baseType: 'tight' })} title="Tight, uniform" sub="Clean 2–4 candles" />
          <Choice on={p.baseType === 'doji'} onClick={() => set({ baseType: 'doji' })} title="Doji" sub="Not his favourite" tone="warn" />
          <Choice on={p.baseType === 'messy'} onClick={() => set({ baseType: 'messy' })} title="Messy" sub="Overlapping, wicky" tone="loss" />
        </div>
      </Question>
      <Question q="Did it qualify?" hint="A zone must break an opposing zone OR remove a trendline. Both are not required.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Choice on={p.qualified === 'zone'} onClick={() => set({ qualified: 'zone' })} title="Opposing zone broken" />
          <Choice on={p.qualified === 'trendline'} onClick={() => set({ qualified: 'trendline' })} title="Trendline removed" />
          <Choice on={p.qualified === 'both'} onClick={() => set({ qualified: 'both' })} title="Both" />
          <Choice on={p.qualified === 'none'} onClick={() => set({ qualified: 'none' })} title="Neither" tone="loss" />
        </div>
      </Question>
      <div className="grid sm:grid-cols-2 gap-6">
        <Question q="Is it fresh?" hint="Price has not returned to it yet."><YesNo value={p.fresh} onChange={x => set({ fresh: x })} yes="Fresh" no="Tested" /></Question>
        <Question q="Is it old?" hint="Price ran very far without retracing to it."><YesNo value={p.old} onChange={x => set({ old: x })} yes="Old" no="Recent" good={false} /></Question>
      </div>
    </div>,
    // 3 ─ Context
    <div key="ctx" className="flex flex-col gap-6">
      <Question q={`${combo.htf} trend`} hint="Uptrend = higher highs AND a blatantly obvious trendline. A higher high without a trendline is still sideways.">
        <div className="grid grid-cols-3 gap-2">
          <Choice on={p.htfTrend === 'up'} onClick={() => set({ htfTrend: 'up' })} title="↑ Uptrend" tone={p.side === 'buy' ? 'profit' : 'loss'} />
          <Choice on={p.htfTrend === 'side'} onClick={() => set({ htfTrend: 'side' })} title="✖ Sideways" tone="warn" />
          <Choice on={p.htfTrend === 'down'} onClick={() => set({ htfTrend: 'down' })} title="↓ Downtrend" tone={p.side === 'sell' ? 'profit' : 'loss'} />
        </div>
      </Question>
      <Question q={`${combo.etf} trend (entry timeframe)`} hint="A high-odds set & forget needs this in your direction too.">
        <div className="grid grid-cols-3 gap-2">
          <Choice on={p.etfTrend === 'up'} onClick={() => set({ etfTrend: 'up' })} title="↑ Uptrend" tone={p.side === 'buy' ? 'profit' : 'loss'} />
          <Choice on={p.etfTrend === 'side'} onClick={() => set({ etfTrend: 'side' })} title="✖ Sideways" tone="warn" />
          <Choice on={p.etfTrend === 'down'} onClick={() => set({ etfTrend: 'down' })} title="↓ Downtrend" tone={p.side === 'sell' ? 'profit' : 'loss'} />
        </div>
      </Question>
      {trendRel(p.side, p.htfTrend) === 'with' && <Question q="Is the HTF trend new?" hint="First higher high / lower low after the trendline formed — the highest-odds context."><YesNo value={!!p.newTrend} onChange={x => set({ newTrend: x })} yes="New trend" no="Mature" /></Question>}
      <Question q="Where is the zone in the curve?" hint="Drag the zone between your HTF demand and HTF supply.">
        <CurveSlider value={p.curve} onChange={c => set({ curve: c })} side={p.side} />
      </Question>
      <div className="grid sm:grid-cols-2 gap-6">
        <Question q={`At/near your HTF ${p.side === 'buy' ? 'demand' : 'supply'} in control?`}><YesNo value={p.atHtfZone} onChange={x => set({ atHtfZone: x })} /></Question>
        <Question q={`Near an opposing HTF ${p.side === 'buy' ? 'supply' : 'demand'}?`}><YesNo value={p.nearOpposing} onChange={x => set({ nearOpposing: x })} good={false} /></Question>
      </div>
      {p.method === 'conf' && (<>
        <Question q="Has price ACTUALLY touched the HTF zone?" hint="Not close to it. Touching it. Set an alert just before the zone."><YesNo value={p.htfTouched} onChange={x => set({ htfTouched: x })} yes="Touched" no="Not yet" /></Question>
        <Question q={`Confirmation on the ${combo.etf}`} hint="Then place your order at the zone that gave the signal, on the pullback.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {SIGNALS.map(s => <Choice key={s.v} on={p.signal === s.v} onClick={() => set({ signal: s.v })} title={s.t} sub={s.s} />)}
            <Choice on={p.signal == null} onClick={() => set({ signal: null })} title="No signal yet" tone="loss" />
          </div>
        </Question>
      </>)}
      <Question q="Odds boosters">
        <div className="grid sm:grid-cols-2 gap-2">
          <Choice on={p.liquidityTrap} onClick={() => set({ liquidityTrap: !p.liquidityTrap })} title="Liquidity trap" sub="Clear S/R right before the zone — early traders' stops sit in it" />
          <Choice on={p.structureShift} onClick={() => set({ structureShift: !p.structureShift })} title="Structure shift" sub="An obvious high/low was broken" />
        </div>
      </Question>
    </div>,
    // 4 ─ Levels
    <div key="lvl" className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Proximal line" hint={p.side === 'buy' ? 'Top of the base' : 'Bottom of the base'}><input type="number" step="any" inputMode="decimal" className="field num" value={p.proximal ?? ''} onChange={e => set({ proximal: e.target.value === '' ? null : +e.target.value })} /></Field>
        <Field label="Distal line" hint={p.side === 'buy' ? 'Lowest wick of the base' : 'Highest wick of the base'}><input type="number" step="any" inputMode="decimal" className="field num" value={p.distal ?? ''} onChange={e => set({ distal: e.target.value === '' ? null : +e.target.value })} /></Field>
      </div>
      <Question q="Entry order">
        <div className="grid grid-cols-3 gap-2">
          <Choice on={p.entryType === 'limit'} onClick={() => set({ entryType: 'limit' })} title="Pending limit" sub="At the proximal — best" tone="profit" />
          <Choice on={p.entryType === 'market'} onClick={() => set({ entryType: 'market' })} title="Market" sub="Late — not advised" tone="warn" />
          <Choice on={p.entryType === 'stop'} onClick={() => set({ entryType: 'stop' })} title="Breakout stop" sub="Worse R:R" tone="warn" />
        </div>
      </Question>
      <Question q="Stop beyond the distal line" hint="Standard, wide or very conservative — pick one and stick to it. Your Playbook says 10–15 pips beyond the valley/peak.">
        <div className="flex gap-2 flex-wrap">{[0, 5, 10, 15, 20, 30].map(b => <button key={b} type="button" onClick={() => { setBuffer(b); set({ stopStyle: b <= 10 ? 'standard' : b <= 20 ? 'wide' : 'conservative' }); }} className={cx('chip', buffer === b && 'border-accent text-accent bg-accent/10')}>{b === 0 ? 'At distal' : `${b} pips`}</button>)}<span className="text-[11.5px] text-ink3 self-center capitalize">{p.stopStyle === 'conservative' ? 'very conservative' : p.stopStyle}</span></div>
      </Question>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Entry (limit)"><input type="number" step="any" inputMode="decimal" className="field num" value={p.entry ?? ''} onChange={e => set({ entry: e.target.value === '' ? null : +e.target.value })} /></Field>
        <Field label="Stop"><input type="number" step="any" inputMode="decimal" className="field num" value={p.stop ?? ''} onChange={e => set({ stop: e.target.value === '' ? null : +e.target.value })} /></Field>
        <Field label="Target"><input type="number" step="any" inputMode="decimal" className="field num" value={p.target ?? ''} onChange={e => set({ target: e.target.value === '' ? null : +e.target.value })} /></Field>
      </div>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4].map(r => <button key={r} type="button" disabled={!riskDist} onClick={() => set({ target: tpFor(r) })} className={cx('chip', r === v.mgmt.targetR && 'border-accent text-accent')}>{r}R{r === v.mgmt.targetR ? ' · prescribed' : ''}</button>)}
        <span className="text-[11.5px] text-ink3 self-center">or type the opposing zone's price</span>
      </div>
      <Field label={`Opposing ${combo.htf} zone (proximal)`} hint="Your profit margin — how far price can travel before the HTF pushes back.">
        <input type="number" step="any" inputMode="decimal" className="field num" value={p.opposingHtf ?? ''} onChange={e => set({ opposingHtf: e.target.value === '' ? null : +e.target.value })} />
      </Field>
      <Question q="Take profit">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Choice on={p.tpMethod === 'fixed'} onClick={() => set({ tpMethod: 'fixed', target: tpFor(v.mgmt.targetR) })} title="Fixed R:R" sub={`1:${v.mgmt.targetR}`} />
          <Choice on={p.tpMethod === 'zone'} onClick={() => set({ tpMethod: 'zone', target: p.opposingHtf ?? p.target })} title="Opposing zone" sub="Natural exit" />
          <Choice on={p.tpMethod === 'structure'} onClick={() => set({ tpMethod: 'structure' })} title="Opposing structure" sub="Previous high/low" />
          <Choice on={p.tpMethod === 'trail'} onClick={() => set({ tpMethod: 'trail' })} title="No TP — trail" sub="Room to run" />
        </div>
      </Question>
      <Question q="Stop management once in profit" hint="Never move the stop wider.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Choice on={p.mgmtPlan === 'hold'} onClick={() => set({ mgmtPlan: 'hold' })} title="Don't touch it" sub="Let it play out" />
          <Choice on={p.mgmtPlan === 'be'} onClick={() => set({ mgmtPlan: 'be' })} title="Breakeven" sub={v.odds === 'low' ? 'at 0.5–1R' : 'after a set R:R'} />
          <Choice on={p.mgmtPlan === 'half'} onClick={() => set({ mgmtPlan: 'half' })} title="Half risk" sub="after a set R:R" />
          <Choice on={p.mgmtPlan === 'trail'} onClick={() => set({ mgmtPlan: 'trail' })} title="Trail with price" sub="Below fresh LTF zones" />
        </div>
      </Question>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Balance"><input type="number" inputMode="decimal" className="field num" value={bal} onChange={e => setBal(e.target.value)} /></Field>
        <Field label={`Risk % (max ${v.mgmt.maxRiskPct}%)`}><input type="number" step="0.05" inputMode="decimal" className="field num" value={p.riskPct ?? ''} onChange={e => set({ riskPct: e.target.value === '' ? null : +e.target.value })} /></Field>
      </div>
      <div className="rounded-xl bg-raised/60 border border-line p-4 grid grid-cols-3 gap-3 [&>div]:min-w-0">
        <div><div className="label">Size</div><div className="num text-lg sm:text-2xl font-semibold mt-1 truncate">{size ? size.lots.toFixed(2) : '—'}</div><div className="text-[11px] text-ink3">lots</div></div>
        <div><div className="label">Risk</div><div className="num text-lg sm:text-2xl font-semibold mt-1 truncate">{size ? money(size.riskAtLots) : '—'}</div><div className="text-[11px] text-ink3 num">{riskDist ? `${num(riskDist / pip, 1)} pips` : ''}</div></div>
        <div><div className="label">R:R</div><div className="num text-lg sm:text-2xl font-semibold mt-1 truncate">{v.rr != null ? v.rr.toFixed(2) : '—'}</div><div className="text-[11px] text-ink3">{v.rr ? `needs ${(100 / (1 + v.rr)).toFixed(0)}% wins` : ''}</div></div>
      </div>
    </div>,
    // 5 ─ Verdict
    <div key="ver" className="flex flex-col gap-5">
      <VerdictPanel v={v} />
      {v.tradeable && p.entry != null && p.stop != null && (
        <div className="rounded-xl border border-line2 bg-bg/60 p-4 font-mono text-[13px] leading-relaxed">
          <div className="label mb-2 font-sans">Order ticket</div>
          <div><b className={p.side === 'buy' ? 'text-profit' : 'text-loss'}>{p.side === 'buy' ? 'BUY' : 'SELL'} LIMIT</b> {p.symbol} {size?.lots.toFixed(2) ?? '—'} lots @ {price(p.entry, digits)}</div>
          <div>SL {price(p.stop, digits)}{p.target != null && <> · TP {price(p.target, digits)}</>}</div>
          {v.odds === 'low' && <div className="text-warn">Alert at 1:1 → {tpFor(1) != null ? price(tpFor(1)!, digits) : '—'} · then stop to {price(p.entry, digits)}</div>}
          {v.odds === 'high' && <div className="text-ink3">Keep the TP order in. Never widen the stop.</div>}
        </div>
      )}
      <Field label="Notes (optional)"><textarea rows={2} className="p-3 text-sm" value={p.note ?? ''} onChange={e => set({ note: e.target.value })} placeholder="What you see on the chart…" /></Field>
    </div>,
  ];

  return (
    <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
      <Card className="p-0">
        <div className="px-5 pt-4 pb-3 border-b border-line rounded-t-xl">
          <div className="flex items-center gap-2">
            <button className="btn-ghost h-8 w-8 px-0 -ml-2" onClick={() => onDone(null)} aria-label="Close planner"><Icon name="x" size={16} /></button>
            <div className="font-semibold min-w-0 truncate">{initial.retro ? 'Grade this trade' : 'Plan a trade'}{p.symbol && <span className="text-ink3 font-normal"> · {p.symbol} {p.side === 'buy' ? 'long' : 'short'}</span>}</div>
            <span className="ml-auto text-xs text-ink3 num shrink-0">{step + 1}/{STEPS.length}</span>
          </div>
          <div className="flex gap-1.5 mt-3" role="tablist" aria-label="Steps">
            {STEPS.map((s, i) => (
              <button key={s} role="tab" aria-selected={i === step} onClick={() => { setDir(i > step ? 1 : -1); setStep(i); }} className="flex-1 group text-left py-2 -my-2">
                <div className="h-1.5 rounded-full bg-line overflow-hidden"><motion.div className="h-full w-full bg-accent rounded-full origin-left" initial={false} animate={{ transform: `scaleX(${i < step ? 1 : i === step ? 0.5 : 0})` }} transition={{ duration: 0.3, ease: [0.77, 0, 0.175, 1] }} /></div>
                <div className={cx('text-[11px] mt-1.5 font-medium', i === step ? 'text-ink' : 'text-ink3')}>{s}</div>
              </button>
            ))}
          </div>
        </div>
        <div className="p-5 overflow-hidden">
          {/* Steps are tapped through quickly: the new step slides in at once (no exit-then-enter wait), so Next never stalls. */}
            <motion.div key={step} initial={firstStep.current ? false : { opacity: 0, transform: `translateX(${dir * 16}px)` }} animate={{ opacity: 1, transform: 'translateX(0px)' }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              {body[step]}
              <div className="mt-5 pt-4 border-t border-line flex flex-col gap-3">
                <LessonChips nums={PLANNER_LESSONS[STEPS[step]] ?? []} />
                {STEPS[step] === 'Verdict' && (
                  <details className="group">
                    <summary className="cursor-pointer text-[13px] font-medium text-ink2 hover:text-ink py-1">Mentor's pre-trade checks</summary>
                    <div className="mt-3"><MentorChecks /></div>
                  </details>
                )}
              </div>
            </motion.div>
        </div>
        <div className="px-5 py-3 border-t border-line flex items-center gap-2 bg-surface rounded-b-xl sticky bottom-0 max-lg:bottom-[calc(58px+max(12px,env(safe-area-inset-bottom)))] land:!bottom-0 z-10">
          {step > 0 && <button className="btn h-11 px-4" onClick={() => go(-1)}><Icon name="chevronLeft" size={15} />Back</button>}
          {mobile && step < STEPS.length - 1 && (
            <span className={cx('ml-auto text-xs font-bold', !v.tradeable ? 'text-loss' : v.odds === 'high' ? 'text-profit' : 'text-warn')}>{!v.tradeable ? 'NO TRADE' : v.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS'} · {v.score}</span>
          )}
          {step < STEPS.length - 1
            ? <button className={cx('btn-primary h-11 px-5', !mobile && 'ml-auto')} disabled={step === 0 && !p.symbol} onClick={() => go(1)}>Next<Icon name="chevronRight" size={15} /></button>
            : <button className="btn-primary h-11 px-5 ml-auto" onClick={commit}><Icon name="check" size={15} />{v.tradeable ? 'Save plan' : 'Save as skipped'}</button>}
        </div>
      </Card>
      {!mobile && (
        <Card className="lg:sticky lg:top-20">
          {step < 4 ? (<>
            <CardHead title="Live verdict" sub="Updates as you answer" />
            <VerdictPanel v={v} compact />
          </>) : (<>
            <CardHead title="After the order" sub={v.mgmt.style === 'aggressive' ? 'Aggressive management' : 'Non-aggressive management'} />
            <ol className="flex flex-col gap-2">{v.mgmt.alerts.map((a, i) => <li key={a} className="flex gap-3 text-[13px]"><span className="num text-accent font-semibold">{i + 1}</span>{a}</li>)}</ol>
            <div className="mt-5 pt-4 border-t border-line">
              <div className="label mb-2">Breakeven win rate</div>
              <div className="grid grid-cols-4 gap-1.5 text-center">{[1, 2, 3, 5].map(r => <div key={r} className={cx('rounded-lg p-2', v.rr != null && Math.round(v.rr) === r ? 'bg-accent/15 text-accent' : 'bg-raised')}><div className="text-[10.5px] text-ink3">1:{r}</div><div className="num font-semibold">{Math.round(100 / (1 + r))}%</div></div>)}</div>
              <p className="text-[11.5px] text-ink3 mt-3 leading-relaxed">Losing streaks are part of a probability game. The edge plays out over hundreds of trades, not a handful.</p>
            </div>
          </>)}
        </Card>
      )}
    </div>
  );
}

function PlanCard({ p }: { p: Plan }) {
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const save = useStore(s => s.savePlan), del = useStore(s => s.deletePlan);
  const v = evaluatePlan(p, rules.riskPercent ?? 1);
  const next: Partial<Record<PlanStatus, PlanStatus>> = p.method === 'conf' ? { planned: 'waiting', waiting: 'touched', touched: 'ordered', ordered: 'filled' } : { planned: 'ordered', waiting: 'ordered', ordered: 'filled' };
  const n = next[p.status];
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="card p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className={cx('w-1 self-stretch rounded-full', !v.tradeable ? 'bg-loss' : v.odds === 'high' ? 'bg-profit' : 'bg-warn')} />
        <div className="min-w-0 flex-1">
          <Link to={`/plan/${p.id}`} className="flex items-baseline gap-2 min-w-0"><span className="font-mono font-semibold text-[15px] truncate" title={p.symbol || undefined}>{p.symbol || '—'}</span><span className={cx('text-xs font-semibold shrink-0', p.side === 'buy' ? 'text-profit' : 'text-loss')}>{p.side === 'buy' ? 'LONG' : 'SHORT'}</span></Link>
          <div className="text-[12px] text-ink3 mt-0.5">{p.method === 'sf' ? 'Set & forget' : 'Confirmation'} · {SD_COMBOS[p.combo].etf}→{SD_COMBOS[p.combo].htf} · {formation(p.kind, p.side)}</div>
        </div>
        <div className="text-right shrink-0">
          <div className={cx('text-[11px] font-bold', !v.tradeable ? 'text-loss' : v.odds === 'high' ? 'text-profit' : 'text-warn')}>{!v.tradeable ? 'NO TRADE' : v.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS'}</div>
          <div className="num text-xl font-semibold">{v.score}</div>
        </div>
      </div>
      {p.entry != null && <div className="text-[12px] num text-ink2 [overflow-wrap:anywhere]">@ {p.entry} · SL {p.stop ?? '—'} · TP {p.target ?? '—'}{p.lots ? ` · ${p.lots} lots` : ''}</div>}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge tone={STATUS[p.status].tone}>{STATUS[p.status].t}</Badge>
        {p.tradeId && <Link to={`/trades/${p.tradeId}`} className="text-xs text-accent inline-block py-2 -my-2">Linked trade</Link>}
        <div className="ml-auto flex gap-1.5">
          {n && !p.retro && <button className="btn h-8 text-xs" onClick={() => save({ ...p, status: n })}>→ {STATUS[n].t}</button>}
          {!['filled', 'skipped', 'missed'].includes(p.status) && !p.retro && <button className="btn-ghost h-8 text-xs" onClick={() => save({ ...p, status: 'skipped' })}>Skip</button>}
          <button className="btn-ghost h-8 w-8 px-0 text-ink3" aria-label="Delete plan" onClick={() => { if (confirm('Delete this plan?')) del(p.id); }}><Icon name="trash" size={13} /></button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Planner() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const nav = useNavigate();
  const plans = usePlans();
  const et = useEnriched();
  const [filter, setFilter] = useState<'active' | 'done' | 'all'>('active');

  const editing = useMemo(() => {
    if (id === 'new') {
      const tid = params.get('trade');
      const t = tid ? et.find(x => x.id === tid) : null;
      if (t) {
        const n = (v: string | number) => { const x = typeof v === 'number' ? v : parseFloat(v); return isFinite(x) && x !== 0 ? x : null; };
        return blankPlan({ retro: true, tradeId: t.id, symbol: t.sym, side: t.type, entry: t.openPrice, proximal: t.openPrice, stop: n(t.sl), target: n(t.tp), status: 'filled', createdAt: t.open.getTime() - 60_000, account: t.account });
      }
      return blankPlan({ symbol: params.get('symbol') ?? '' });
    }
    return id ? plans.find(p => p.id === id) ?? null : null;
  }, [id, params, et, plans]);

  if (id) {
    if (!editing) return <Card><Empty icon="target" title="Plan not found" action={<Link className="btn" to="/plan">Back to plans</Link>} /></Card>;
    return <Page><Wizard key={editing.id} initial={editing} onDone={p => nav(p?.retro && p.tradeId ? `/trades/${p.tradeId}` : '/plan')} /></Page>;
  }

  const live = plans.filter(p => !p.retro);
  const shown = live.filter(p => (filter === 'all' ? true : filter === 'active' ? !['filled', 'skipped', 'missed'].includes(p.status) : ['filled', 'skipped', 'missed'].includes(p.status)));
  return (
    <Page>
      <TickerTape />
      <Card className="luxe-border">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold tracking-tight">Plan before you trade</h2>
            <p className="text-[13px] text-ink2 mt-1 leading-relaxed">Grade the zone, read the curve, get the odds — and the exact risk, target and breakeven rule that go with them. No plan, no trade.</p>
          </div>
          <Link to="/plan/new" className="btn-primary h-11 px-5 shrink-0"><Icon name="plus" size={16} />New plan</Link>
        </div>
      </Card>
      <ZoneBoard />
      <div className="flex items-center justify-between gap-2">
        <Segmented label="Show" size="sm" value={filter} onChange={setFilter} options={[{ value: 'active', label: 'Active' }, { value: 'done', label: 'Done' }, { value: 'all', label: 'All' }]} />
        <span className="text-xs text-ink3">{live.length.toLocaleString()} {live.length === 1 ? 'plan' : 'plans'}</span>
      </div>
      {shown.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3"><AnimatePresence>{shown.map(p => <PlanCard key={p.id} p={p} />)}</AnimatePresence></div>
      ) : <Card><Empty icon="target" title={filter === 'active' ? 'No active plans' : 'Nothing here'} action={<Link to="/plan/new" className="btn-primary">Plan a trade</Link>}>Every trade starts here: zone, context, odds, then the order.</Empty></Card>}
    </Page>
  );
}
