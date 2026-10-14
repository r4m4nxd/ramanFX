import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Area, Bar, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DEFAULT_RISK_RULES, useStore } from '@/data/store';
import { toInsight, useGraded, type Graded } from '@/data/guru';
import { computeStats } from '@/core/stats';
import { dayKey } from '@/core/time';
import { insights } from '@/core/insights';
import { pct, rMult, timeHM, tone, useMoney } from '@/lib/format';
import { Card, cx, Empty, Page, Segmented, Tabs, useIsMobile } from '@/ui/kit';
import { ChartTip, periodStart, useAxisW, useColors } from '@/ui/charts';
import { Icon } from '@/ui/Icon';
import { ReasonList } from '@/ui/PlanParts';
import { TradeList } from '@/ui/TradeList';

type Unit = '$' | 'R';
const useUnit = () => {
  const [u, setU] = useState<Unit>(() => { try { return (localStorage.getItem('rfx_journal_unit') as Unit) || '$'; } catch { return '$'; } });
  return [u, (v: Unit) => { setU(v); try { localStorage.setItem('rfx_journal_unit', v); } catch { /* */ } }] as const;
};

function DayNote({ day }: { day: string }) {
  const dayNotes = useStore(s => s.dayNotes);
  const save = useStore(s => s.saveDayNote);
  const [text, setText] = useState(dayNotes[day] ?? '');
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setText(dayNotes[day] ?? ''); setDirty(false); /* eslint-disable-next-line */ }, [day]);
  useEffect(() => { if (!dirty) return; const h = setTimeout(() => { save(day, text); setDirty(false); }, 700); return () => clearTimeout(h); }, [text, dirty, day, save]);
  return (
    <div>
      <label htmlFor={`dn-${day}`} className="text-xs font-medium text-ink2 flex justify-between">Day review<span className="text-ink3 font-normal">{dirty ? 'Saving…' : text ? 'Saved' : ''}</span></label>
      <textarea id={`dn-${day}`} rows={3} value={text} onChange={e => { setText(e.target.value); setDirty(true); }} placeholder="What went well, what to fix tomorrow…" className="w-full mt-1.5 p-3 text-sm leading-relaxed resize-y" />
    </div>
  );
}

function StatGrid({ items }: { items: [string, string, string?][] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {items.map(([k, v, c], i) => (
        <motion.div key={k} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }} className="rounded-xl bg-raised/60 border border-line px-3 py-2.5 min-w-0">
          <div className="text-[10.5px] uppercase tracking-wide font-semibold text-ink3 truncate">{k}</div>
          <div className={cx('num text-[14px] font-semibold mt-0.5 truncate', c)}>{v}</div>
        </motion.div>
      ))}
    </div>
  );
}

function stats(gs: Graded[], fmt: ReturnType<typeof useMoney>): [string, string, string?][] {
  const s = computeStats(gs.map(g => g.t));
  const adh = gs.filter(g => g.verdict.adherence != null);
  const a = adh.length ? adh.reduce((x, g) => x + g.verdict.adherence!, 0) / adh.length : null;
  const rs = gs.filter(g => g.t.r != null);
  return [
    ['Net P&L', fmt(s.net, { signed: true }), tone(s.net)], ['Trades', `${s.total}`], ['Win / loss', `${s.wins} / ${s.losses}`], ['Win rate', pct(s.winRate, 0)],
    ['Profit factor', s.profitFactor?.toFixed(2) ?? '—'], ['Total R', rs.length ? rMult(rs.reduce((x, g) => x + g.t.r!, 0), 1) : '—', tone(rs.reduce((x, g) => x + (g.t.r ?? 0), 0))],
    ['Lots', s.volume.toFixed(2)], ['Rules kept', a != null ? `${a.toFixed(0)}%` : '—', a == null ? '' : a >= 80 ? 'text-profit' : a >= 50 ? 'text-warn' : 'text-loss'],
  ];
}

/** Running P&L through the day, trade by trade, in $ or R. */
function DayChart({ gs, unit }: { gs: Graded[]; unit: Unit }) {
  const c = useColors();
  const fmt = useMoney();
  const yw = useAxisW();
  const data = useMemo(() => {
    const sorted = [...gs].sort((a, b) => a.t.close.getTime() - b.t.close.getTime());
    let cum = 0;
    const start = Math.max(new Date(dayKey(sorted[0].t.close) + 'T00:00').getTime(), Math.min(...sorted.map(g => g.t.open.getTime())));
    return [{ t: Math.min(start, sorted[0].t.close.getTime() - 60_000), cum: 0, v: 0 }, ...sorted.map(g => { const v = unit === 'R' ? g.t.r ?? 0 : g.t.net; cum += v; return { t: g.t.close.getTime(), cum, v }; })];
  }, [gs, unit]);
  const up = data[data.length - 1].cum >= 0, col = up ? c.profit : c.loss;
  const f = (v: number) => (unit === 'R' ? rMult(v, 1) : fmt(v, { compact: true }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <defs><linearGradient id={`dj${gs[0].t.id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity={0.32} /><stop offset="100%" stopColor={col} stopOpacity={0} /></linearGradient></defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => timeHM(new Date(v))} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={30} />
        <YAxis tickFormatter={f} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={yw} />
        <ReferenceLine y={0} stroke={c.line2} strokeDasharray="3 4" />
        <Tooltip content={<ChartTip fmt={(v, k) => (k === 'v' ? (unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true })) : unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true }))} labelFmt={l => timeHM(new Date(l as number))} />} cursor={{ stroke: c.line2 }} />
        <Bar dataKey="v" name="Trade" barSize={6} radius={[2, 2, 2, 2]} animationDuration={600}>{data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? c.profit : c.loss} fillOpacity={0.45} />)}</Bar>
        <Area type="stepAfter" dataKey="cum" name="Running" stroke={col} strokeWidth={2.2} fill={`url(#dj${gs[0].t.id})`} animationDuration={900} dot={{ r: 2.5, fill: col, strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function DayCard({ day, gs, history, open, onToggle, unit }: { day: string; gs: Graded[]; history: Graded[]; open: boolean; onToggle: () => void; unit: Unit }) {
  const fmt = useMoney();
  const exits = useStore(s => s.exitData);
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const s = useMemo(() => computeStats(gs.map(g => g.t)), [gs]);
  const found = useMemo(() => (open ? insights(gs.map(g => toInsight(g, exits)), history.map(g => toInsight(g, exits)), 'day', { maxDailyTrades: rules.maxDailyTrades, maxDailyLoss: rules.maxDailyLoss }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, gs, history, exits]);
  const d = new Date(day + 'T00:00');
  let cum = 0;
  const pts = [...gs].sort((a, b) => a.t.close.getTime() - b.t.close.getTime()).map(g => (cum += g.t.net));
  const min = Math.min(0, ...pts), max = Math.max(0, ...pts), span = max - min || 1;
  const path = [0, ...pts].map((v, i) => `${i ? 'L' : 'M'}${(i / Math.max(1, pts.length)) * 100} ${((max - v) / span) * 40}`).join(' ');
  const totalR = gs.reduce((a, g) => a + (g.t.r ?? 0), 0);
  const bad = found.filter(f => f.tone === 'bad').length;
  return (
    <motion.article layout className="card overflow-hidden" id={`d-${day}`}>
      <button className="w-full flex items-center gap-3 md:gap-4 p-4 text-left hover:bg-raised/40 transition-colors" onClick={onToggle} aria-expanded={open}>
        <div className={cx('w-1 self-stretch rounded-full', s.net >= 0 ? 'bg-profit' : 'bg-loss')} />
        <div className="min-w-0">
          <div className="font-semibold">{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          <div className="text-xs text-ink3 mt-0.5">{s.total} trades · {pct(s.winRate, 0)} win</div>
        </div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden sm:block h-10 flex-1 max-w-[220px]" aria-hidden="true">
          <line x1="0" x2="100" y1={(max / span) * 40} y2={(max / span) * 40} stroke="rgb(var(--line2))" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          <path d={path} fill="none" stroke={s.net >= 0 ? 'rgb(var(--profit))' : 'rgb(var(--loss))'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="ml-auto flex items-center gap-5">
          <div className="hidden md:block text-right"><div className="label">PF</div><div className="num text-sm">{s.profitFactor?.toFixed(2) ?? '—'}</div></div>
          <div className="text-right"><div className="label">Net</div><div className={cx('num font-semibold', tone(unit === 'R' ? totalR : s.net))}>{unit === 'R' ? rMult(totalR, 1) : fmt(s.net, { signed: true })}</div></div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-ink3"><Icon name="chevronDown" /></motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-line pt-4">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 items-start">
                <DayChart gs={gs} unit={unit} />
                <StatGrid items={stats(gs, fmt)} />
              </div>
              {found.length > 0 && (
                <div className={cx('rounded-xl border p-3', bad ? 'border-loss/30 bg-loss/[0.05]' : 'border-line bg-raised/30')}>
                  <div className="label mb-1.5 flex items-center gap-1.5"><Icon name="sparkles" size={12} />What the day says</div>
                  <ReasonList items={found} />
                </div>
              )}
              <TradeList trades={gs.map(g => g.t)} time="range" />
              <DayNote day={day} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/** Mon–Sun bars with the running total, for one week. */
function WeekChart({ gs, unit, start }: { gs: Graded[]; unit: Unit; start: Date }) {
  const c = useColors();
  const fmt = useMoney();
  const yw = useAxisW();
  const data = useMemo(() => {
    let cum = 0;
    const data = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((n, i) => {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const k = dayKey(d);
      const xs = gs.filter(g => dayKey(g.t.close) === k);
      const v = xs.reduce((a, g) => a + (unit === 'R' ? g.t.r ?? 0 : g.t.net), 0);
      cum += v;
      return { n, v, cum: xs.length || cum ? cum : null as number | null, trades: xs.length, k };
    }).filter((x, i) => i < 5 || x.trades > 0);
    // The running line stops at the last day traded.
    const last = data.map(x => x.trades > 0).lastIndexOf(true);
    return data.map((x, i) => ({ ...x, cum: i <= last ? x.cum : null }));
  }, [gs, unit, start]);
  const f = (v: number) => (unit === 'R' ? rMult(v, 1) : fmt(v, { compact: true }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ComposedChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="n" tick={{ fontSize: 11, fill: c.ink3 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={f} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={yw} />
        <ReferenceLine y={0} stroke={c.line2} />
        <Tooltip content={<ChartTip fmt={v => (unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true }))} />} cursor={{ fill: c.a('ink3', 0.08) }} />
        <Bar dataKey="v" name="Day" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={700}>{data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? c.profit : c.loss} />)}</Bar>
        <Line type="monotone" dataKey="cum" name="Running" stroke={c.accent} strokeWidth={2.2} dot={{ r: 3, fill: c.accent, strokeWidth: 0 }} animationDuration={900} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function WeekCard({ start, gs, history, open, onToggle, unit, onDay }: { start: Date; gs: Graded[]; history: Graded[]; open: boolean; onToggle: () => void; unit: Unit; onDay: (d: string) => void }) {
  const fmt = useMoney();
  const exits = useStore(s => s.exitData);
  const s = useMemo(() => computeStats(gs.map(g => g.t)), [gs]);
  const found = useMemo(() => (open ? insights(gs.map(g => toInsight(g, exits)), history.map(g => toInsight(g, exits)), 'week') : []), [open, gs, history, exits]);
  const end = new Date(start); end.setDate(start.getDate() + 6);
  const totalR = gs.reduce((a, g) => a + (g.t.r ?? 0), 0);
  const best = gs.reduce<Graded | null>((a, g) => (!a || g.t.net > a.t.net ? g : a), null), worst = gs.reduce<Graded | null>((a, g) => (!a || g.t.net < a.t.net ? g : a), null);
  const days = [...new Set(gs.map(g => dayKey(g.t.close)))].sort();
  return (
    <motion.article layout className="card overflow-hidden">
      <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-raised/40 transition-colors" onClick={onToggle} aria-expanded={open}>
        <div className={cx('w-1 self-stretch rounded-full', s.net >= 0 ? 'bg-profit' : 'bg-loss')} />
        <div className="min-w-0">
          <div className="font-semibold">{start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – {end.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="text-xs text-ink3 mt-0.5">{s.total} trades · {days.length} days · {pct(s.winRate, 0)} win</div>
        </div>
        <div className="ml-auto flex items-center gap-5">
          <div className="text-right"><div className="label">Net</div><div className={cx('num font-semibold', tone(unit === 'R' ? totalR : s.net))}>{unit === 'R' ? rMult(totalR, 1) : fmt(s.net, { signed: true })}</div></div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-ink3"><Icon name="chevronDown" /></motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-line pt-4">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 items-start">
                <WeekChart gs={gs} unit={unit} start={start} />
                <StatGrid items={stats(gs, fmt)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {best && <Link to={`/trades/${best.t.id}`} className="rounded-xl border border-profit/30 bg-profit/[0.06] p-3 text-[13px]"><div className="label">Best trade</div><span className="font-mono font-semibold">{best.t.sym}</span> <span className="num text-profit font-semibold">{fmt(best.t.net, { signed: true })}</span></Link>}
                {worst && worst !== best && <Link to={`/trades/${worst.t.id}`} className="rounded-xl border border-loss/30 bg-loss/[0.06] p-3 text-[13px]"><div className="label">Worst trade</div><span className="font-mono font-semibold">{worst.t.sym}</span> <span className="num text-loss font-semibold">{fmt(worst.t.net, { signed: true })}</span></Link>}
              </div>
              {found.length > 0 && (
                <div className="rounded-xl border border-line bg-raised/30 p-3">
                  <div className="label mb-1.5 flex items-center gap-1.5"><Icon name="sparkles" size={12} />What the week says</div>
                  <ReasonList items={found} />
                </div>
              )}
              <ul className="flex flex-col">
                {days.map(k => { const xs = gs.filter(g => dayKey(g.t.close) === k); const n = xs.reduce((a, g) => a + g.t.net, 0); return (
                  <li key={k}><button onClick={() => onDay(k)} className="w-full flex items-center gap-3 py-2.5 border-t border-line first:border-0 text-left text-[13px] hover:bg-raised/40 -mx-1 px-1 rounded-lg">
                    <span className="font-medium w-24">{new Date(k + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</span>
                    <span className="text-ink3 text-xs flex-1">{xs.length} trades</span>
                    <span className={cx('num font-semibold', tone(n))}>{fmt(n, { signed: true })}</span><Icon name="chevronRight" size={14} className="text-ink3" />
                  </button></li>
                ); })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Journal() {
  const graded = useGraded();
  const { from, to } = useStore(s => s.range);
  const [params, setParams] = useSearchParams();
  const focus = params.get('day');
  const view = (params.get('view') as 'day' | 'week') || 'day';
  const [unit, setUnit] = useUnit();
  const mobile = useIsMobile();
  const inRange = useMemo(() => graded.filter(g => { const k = dayKey(g.t.close); return (!from || k >= from) && (!to || k <= to); }), [graded, from, to]);
  const days = useMemo(() => {
    const m = new Map<string, Graded[]>();
    for (const g of inRange) { const k = dayKey(g.t.close); m.set(k, [...(m.get(k) ?? []), g]); }
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [inRange]);
  const weeks = useMemo(() => {
    const m = new Map<number, Graded[]>();
    for (const g of inRange) { const k = periodStart(g.t.close, 'week').getTime(); m.set(k, [...(m.get(k) ?? []), g]); }
    return [...m.entries()].sort((a, b) => b[0] - a[0]);
  }, [inRange]);
  // History before each window: the 60 days before it, for "usual" comparisons.
  const historyBefore = (t: number) => graded.filter(g => g.t.close.getTime() < t && g.t.close.getTime() >= t - 60 * 86_400_000);
  const [open, setOpen] = useState<Set<string>>(() => new Set(focus ? [focus] : days[0] ? [days[0][0]] : []));
  const [openW, setOpenW] = useState<Set<number>>(() => new Set(weeks[0] ? [weeks[0][0]] : []));
  const [limit, setLimit] = useState(20);
  useEffect(() => {
    if (!focus) return;
    setOpen(s => new Set(s).add(focus));
    const i = days.findIndex(d => d[0] === focus);
    if (i >= limit) setLimit(i + 5);
    setTimeout(() => document.getElementById(`d-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  const goDay = (d: string) => setParams({ view: 'day', day: d }, { replace: true });

  if (!days.length) return <Card><Empty icon="journal" title="No trading days in this range" /></Card>;
  return (
    <Page>
      <div className={cx('flex gap-2', mobile ? 'flex-col' : 'items-center justify-between')}>
        <div className={mobile ? '' : 'w-[260px]'}><Tabs label="Journal view" value={view} onChange={v => setParams({ view: v }, { replace: true })} options={[{ value: 'day', label: 'Days' }, { value: 'week', label: 'Weeks' }]} /></div>
        <Segmented label="Unit" size="sm" value={unit} onChange={setUnit} options={[{ value: '$', label: '$ P&L' }, { value: 'R', label: 'R multiple' }]} />
      </div>
      {view === 'day' ? (<>
        {days.slice(0, limit).map(([day, gs]) => (
          <DayCard key={day} day={day} gs={gs} history={historyBefore(new Date(day + 'T00:00').getTime())} unit={unit} open={open.has(day)}
            onToggle={() => setOpen(s => { const n = new Set(s); if (n.has(day)) n.delete(day); else n.add(day); return n; })} />
        ))}
        {days.length > limit && <button className="btn self-center" onClick={() => setLimit(l => l + 20)}>Load older days</button>}
      </>) : (<>
        {weeks.slice(0, limit).map(([w, gs]) => (
          <WeekCard key={w} start={new Date(w)} gs={gs} history={historyBefore(w)} unit={unit} open={openW.has(w)} onDay={goDay}
            onToggle={() => setOpenW(s => { const n = new Set(s); if (n.has(w)) n.delete(w); else n.add(w); return n; })} />
        ))}
        {weeks.length > limit && <button className="btn self-center" onClick={() => setLimit(l => l + 20)}>Load older weeks</button>}
      </>)}
    </Page>
  );
}
