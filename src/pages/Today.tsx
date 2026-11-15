import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHead, cx, Empty, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { useNow } from '@/ui/TradeClock';
import { AreaLine, Lights, MissedMeter, px, VerdictPill, WatchEditor } from '@/ui/DeskParts';
import { useDesk } from '@/data/desk';
import { judge, momentOf, nextChance, planDays, savePlanLine, spanText, type DeskInst, type Judgement, type Chance } from '@/core/desk';

/** One line of plan for one market: saved when you leave the box. */
function PlanBox({ sym, day, dayName, value, onSave }: { sym: string; day: string; dayName: string; value: string; onSave: (text: string) => void }) {
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value, day]);
  const dirty = text.trim() !== value.trim();
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wide text-ink3 font-medium">Your plan for {dayName}</span>
      <input className="field w-full h-11 mt-1 text-[16px]" id={`plan-${sym}-${day}`} type="text" autoComplete="off" maxLength={200} value={text}
        placeholder="buy at …, sell at …, or nothing" onChange={e => setText(e.target.value)} onBlur={() => { if (dirty) onSave(text); }}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
      <span className="text-[11px] text-ink3">{dirty ? 'Saves when you leave the box' : value ? 'Saved' : 'One line is enough'}</span>
    </label>
  );
}

function MarketCard({ i, j, chance, planToday, planNext, days, onSave }: { i: DeskInst; j: Judgement; chance: Chance | null; planToday: string; planNext: string; days: ReturnType<typeof planDays>; onSave: (day: string, text: string) => void }) {
  const same = days.today === days.planFor;
  return (
    <Card aria-label={i.sym}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-baseline gap-2.5 min-w-0"><h3 className="text-[19px] font-semibold tracking-tight">{i.sym}</h3><span className="num text-[14px] text-ink2">{px(i.price, i.digits)}</span></div>
        <div className="flex items-center gap-2.5"><Lights j={j} /><VerdictPill v={j.verdict} /></div>
      </div>
      {!same && planToday && (
        <div className="rounded-xl bg-raised px-3.5 py-2.5 mb-3">
          <div className="text-[11px] uppercase tracking-wide text-ink3 font-medium">The plan you wrote for today</div>
          <div className="text-[14px] font-medium mt-0.5">{planToday}</div>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2 min-w-0">
          <AreaLine a={i.buy} digits={i.digits} word="buy" />
          <AreaLine a={i.sell} digits={i.digits} word="sell" />
          {i.prev && <div className="text-[12.5px] text-ink2">● Yesterday: high <span className="num text-ink">{px(i.prev.high, i.digits)}</span> · low <span className="num text-ink">{px(i.prev.low, i.digits)}</span></div>}
          <div className="text-[12.5px] text-ink2">● {j.rules.title}{j.rules.light !== 'g' && j.fails.length ? <span className="text-ink3"> · {j.rules.text}</span> : null}</div>
          <div className="text-[12.5px] text-ink2">● Next best time: {chance ? <><b className="text-ink">{chance.text}</b> <span className="text-ink3">(in {spanText(chance.inMin)})</span></> : '–'}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wide text-ink3 font-medium mb-2">Have I missed it?</div>
          <MissedMeter i={i} j={j} />
        </div>
      </div>
      <div className="mt-4"><PlanBox sym={i.sym} day={days.planFor} dayName={same ? 'today' : days.planForName} value={same ? planToday : planNext} onSave={t => onSave(days.planFor, t)} /></div>
    </Card>
  );
}

export default function Today() {
  const d = useDesk();
  const now = useNow();
  const minute = Math.floor(now.getTime() / 60_000);
  const at = useMemo(() => new Date(minute * 60_000), [minute]);
  const m = useMemo(() => momentOf(at), [at]);
  const days = useMemo(() => planDays(at), [at]);
  const [editing, setEditing] = useState(false);
  const save = (sym: string) => (day: string, text: string) => d.setDesk({ deskPlans: savePlanLine(d.plans, day, sym, text) });
  const missing = d.watch.filter(s => !d.insts[s]);
  const written = d.watch.filter(s => d.plans[days.planFor]?.[s]).length;

  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">{days.evening ? `Plan for ${days.planForName}` : 'Today'}</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[68ch]">{days.evening
            ? 'Ten minutes tonight. For each market write one line: buy at a price, sell at a price, or nothing. Place the orders, then you are done.'
            : 'One look before work. If last night\'s plan still holds, leave it alone. The move comes back at the same time tomorrow.'}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
            <span className={cx('font-medium', written === d.watch.length ? 'text-profit' : 'text-ink3')}>{written} of {d.watch.length} plans written for {days.today === days.planFor ? 'today' : days.planForName}</span>
            <Link to="/desk" className="text-accent font-medium">Decision desk</Link>
            <Link to="/market-hours" className="text-accent font-medium">Trading clock</Link>
          </div>
        </div>
      </Card>

      <Card>
        <CardHead title="Your markets" sub="Keep it short. Fewer markets, better decisions." right={
          <button type="button" onClick={() => setEditing(x => !x)} className="h-9 px-3.5 rounded-full border border-line text-[12.5px] font-semibold inline-flex items-center gap-1.5 hover:bg-raised"><Icon name={editing ? 'check' : 'edit'} size={14} />{editing ? 'Done' : 'Edit list'}</button>} />
        {editing ? <WatchEditor watch={d.watch} markets={d.markets} onAdd={d.add} onRemove={d.remove} /> : <div className="flex flex-wrap gap-1.5">{d.watch.map(s => <span key={s} className="inline-flex items-center h-8 px-3 rounded-full border border-line text-[12.5px] font-semibold">{s}</span>)}</div>}
      </Card>

      {d.state === 'error' && <Card><Empty icon="info" title="Couldn't load the scan" action={<button type="button" onClick={d.retry} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>Check your connection and try again.</Empty></Card>}
      {d.state === 'loading' && !Object.keys(d.insts).length && <Card><p className="text-[13px] text-ink3">Loading your markets…</p></Card>}

      {d.watch.map(s => d.insts[s]).filter(Boolean).map(i => {
        const j = judge(i, d.weeks[i.sym], d.fallback, m);
        return <MarketCard key={i.sym} i={i} j={j} chance={nextChance(d.weeks[i.sym], d.fallback, m)} days={days}
          planToday={d.plans[days.today]?.[i.sym] ?? ''} planNext={d.plans[days.planFor]?.[i.sym] ?? ''} onSave={save(i.sym)} />;
      })}
      {!!missing.length && d.state === 'ok' && <Card><p className="text-[13px] text-ink3">No scan data yet for: <b className="text-ink2">{missing.join(', ')}</b>.</p></Card>}
      <p className="text-[11.5px] text-ink3 px-1 leading-relaxed">Areas and rule checks come from the last hourly scan; timing from the market-hours study. Conditions only, not a signal. For learning only, not financial advice.</p>
    </Page>
  );
}
