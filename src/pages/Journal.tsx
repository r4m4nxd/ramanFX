import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
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
import { DayNote } from '@/ui/DayPeek';

type Unit = '$' | 'R';
const useUnit = () => {
  const [u, setU] = useState<Unit>(() => { try { return (localStorage.getItem('rfx_journal_unit') as Unit) || '$'; } catch { return '$'; } });
  return [u, (v: Unit) => { setU(v); try { localStorage.setItem('rfx_journal_unit', v); } catch { /* */ } }] as const;
};

type Tile = [string, string, string?, string?];
function StatGrid({ items }: { items: Tile[] }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(([k, v, c, full]) => (
        <div key={k} title={full} className="rounded-xl bg-raised/60 border border-line px-3 py-2.5 min-w-0">
          <div className="label truncate">{full ? <abbr title={full} className="no-underline">{k}</abbr> : k}</div>
          <div className={cx('num text-[15px] font-semibold mt-0.5 truncate', c)}>{v}</div>
        </div>
      ))}
    </div>
  );
}

/** Detail tiles. Net, trades and win rate are already in the card header, so they aren't repeated here. */
function stats(gs: Graded[], fmt: ReturnType<typeof useMoney>, unit: Unit): Tile[] {
  const s = computeStats(gs.map(g => g.t));
  const adh = gs.filter(g => g.verdict.adherence != null);
  const a = adh.length ? adh.reduce((x, g) => x + g.verdict.adherence!, 0) / adh.length : null;
  const rs = gs.filter(g => g.t.r != null);
  const totR = rs.reduce((x, g) => x + g.t.r!, 0);
  // The tile shows the unit the header does NOT, so both readings are always on screen.
  const other: Tile = unit === 'R' ? ['Net $', fmt(s.net, { signed: true }), tone(s.net), 'Net P&L in money'] : ['Total R', rs.length ? rMult(totR, 1) : '—', tone(totR), `Sum of R multiples (${rs.length} of ${gs.length} trades have a stop)`];
  return [
    ['W / L', `${s.wins} / ${s.losses}`, undefined, 'Wins / losses'], ['PF', s.profitFactor?.toFixed(2) ?? '—', undefined, 'Profit factor'], other,
    ['Lots', s.volume.toFixed(2)], ['Avg R', s.avgR != null ? rMult(s.avgR, 2) : '—', tone(s.avgR), 'Average R per trade'], ['Rules kept', a != null ? `${a.toFixed(0)}%` : '—', a == null ? '' : a >= 80 ? 'text-profit' : a >= 50 ? 'text-warn' : 'text-loss'],
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
  // Colour the running line by its side of zero, not by the day's final result.
  const hi = Math.max(0, ...data.map(d => d.cum)), lo = Math.min(0, ...data.map(d => d.cum));
  const off = hi - lo > 0 ? hi / (hi - lo) : up ? 1 : 0;
  const gid = `dj${gs[0].t.id}`;
  const f = (v: number) => (unit === 'R' ? rMult(v, 1) : fmt(v, { compact: true }));
  return (
    <ResponsiveContainer width="100%" height={180}>
      <ComposedChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={`${gid}s`} x1="0" y1="0" x2="0" y2="1"><stop offset={0} stopColor={c.profit} /><stop offset={off} stopColor={c.profit} /><stop offset={off} stopColor={c.loss} /><stop offset={1} stopColor={c.loss} /></linearGradient>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset={0} stopColor={c.profit} stopOpacity={0.28} /><stop offset={off} stopColor={c.profit} stopOpacity={0.04} /><stop offset={off} stopColor={c.loss} stopOpacity={0.04} /><stop offset={1} stopColor={c.loss} stopOpacity={0.28} /></linearGradient>
        </defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => timeHM(new Date(v))} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={30} />
        <YAxis tickFormatter={f} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Inter, system-ui, sans-serif' }} axisLine={false} tickLine={false} width={yw} />
        <ReferenceLine y={0} stroke={c.line2} strokeDasharray="3 4" />
        <Tooltip content={<ChartTip fmt={(v, k) => (k === 'v' ? (unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true })) : unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true }))} labelFmt={l => timeHM(new Date(l as number))} />} cursor={{ stroke: c.line2 }} />
        <Bar dataKey="v" name="Trade" barSize={6} radius={[2, 2, 2, 2]} animationDuration={400}>{data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? c.profit : c.loss} fillOpacity={0.45} />)}</Bar>
        <Area type="monotone" dataKey="cum" name="Running" baseValue={0} stroke={`url(#${gid}s)`} strokeWidth={2.2} fill={`url(#${gid})`} animationDuration={500} dot={false} activeDot={{ r: 4, fill: col, strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

function DayCard({ day, gs, history, open, onToggle, unit, outlier }: { day: string; gs: Graded[]; history: Graded[]; open: boolean; onToggle: () => void; unit: Unit; outlier?: boolean }) {
  const fmt = useMoney();
  const exits = useStore(s => s.exitData);
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const s = useMemo(() => computeStats(gs.map(g => g.t)), [gs]);
  const found = useMemo(() => (open ? insights(gs.map(g => toInsight(g, exits)), history.map(g => toInsight(g, exits)), 'day', { maxDailyTrades: rules.maxDailyTrades, maxDailyLoss: rules.maxDailyLoss }) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open, gs, history, exits]);
  const reviewed = useStore(st => !!st.dayNotes[day]?.trim());
  const d = new Date(day + 'T00:00');
  let cum = 0;
  const pts = [...gs].sort((a, b) => a.t.close.getTime() - b.t.close.getTime()).map(g => (cum += unit === 'R' ? g.t.r ?? 0 : g.t.net));
  const min = Math.min(0, ...pts), max = Math.max(0, ...pts), span = max - min || 1;
  const path = [0, ...pts].map((v, i) => `${i ? 'L' : 'M'}${(i / Math.max(1, pts.length)) * 100} ${((max - v) / span) * 40}`).join(' ');
  const totalR = gs.reduce((a, g) => a + (g.t.r ?? 0), 0);
  const shown = unit === 'R' ? totalR : s.net;
  return (
    <article className="card overflow-hidden scroll-mt-20" id={`d-${day}`}>
      <button className="w-full flex items-center gap-3 md:gap-4 p-4 text-left hover:bg-raised/40 transition-colors" onClick={onToggle} aria-expanded={open}>
        <div className={cx('w-1 self-stretch rounded-full', shown >= 0 ? 'bg-profit' : 'bg-loss')} />
        <div className="min-w-0">
          <div className="font-semibold flex items-center gap-2">{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}
            {outlier && <span className={cx('text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md', s.net >= 0 ? 'bg-profit/12 text-profit' : 'bg-loss/12 text-loss')}>Outlier</span>}
          </div>
          <div className="text-xs text-ink3 mt-0.5 flex items-center gap-1.5">{s.total} trades · {pct(s.winRate, 0)} win
            {reviewed ? <span className="inline-flex items-center gap-1 text-ink2"><Icon name="notebook" size={11} />Reviewed</span> : null}
          </div>
        </div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden sm:block h-10 flex-1 max-w-[220px]" aria-hidden="true">
          <line x1="0" x2="100" y1={(max / span) * 40} y2={(max / span) * 40} stroke="rgb(var(--line2))" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          <path d={path} fill="none" stroke={shown >= 0 ? 'rgb(var(--profit))' : 'rgb(var(--loss))'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="ml-auto flex items-center gap-5">
          <div className="hidden md:block text-right"><div className="label">PF</div><div className="num text-sm">{s.profitFactor?.toFixed(2) ?? '—'}</div></div>
          <div className="text-right"><div className="label">{unit === 'R' ? 'Net R' : 'Net'}</div><div className={cx('num text-lg font-semibold leading-tight', tone(shown))}>{unit === 'R' ? rMult(totalR, 1) : fmt(s.net, { signed: true })}</div></div>
          <motion.span initial={false} animate={{ transform: `rotate(${open ? 180 : 0}deg)` }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="text-ink3 inline-flex"><Icon name="chevronDown" /></motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-line pt-4">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 items-start">
                <DayChart gs={gs} unit={unit} />
                <div className="flex flex-col gap-4">
                  <StatGrid items={stats(gs, fmt, unit)} />
                  <DayNote day={day} />
                </div>
              </div>
              {found.length > 0 && (
                <div className="rounded-xl border border-line bg-raised/30 p-3">
                  <div className="label mb-1.5 flex items-center gap-1.5"><Icon name="sparkles" size={12} />What the day says</div>
                  <ReasonList items={found} />
                </div>
              )}
              <TradeList trades={gs.map(g => g.t)} time="range" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
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
        <YAxis tickFormatter={f} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Inter, system-ui, sans-serif' }} axisLine={false} tickLine={false} width={yw} />
        <ReferenceLine y={0} stroke={c.line2} />
        <Tooltip content={<ChartTip fmt={v => (unit === 'R' ? rMult(v, 2) : fmt(v, { signed: true }))} />} cursor={{ fill: c.a('ink3', 0.08) }} />
        <Bar dataKey="v" name="Day" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={700}>{data.map((d, i) => <Cell key={i} fill={d.v >= 0 ? c.profit : c.loss} />)}</Bar>
        <Line type="monotone" dataKey="cum" name="Running" stroke={c.ink2} strokeWidth={1.75} dot={{ r: 2.5, fill: c.ink2, strokeWidth: 0 }} animationDuration={500} />
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
  const shown = unit === 'R' ? totalR : s.net;
  const withR = (g: Graded) => (g.t.r != null ? ` · ${rMult(g.t.r, 1)}` : '');
  const days = [...new Set(gs.map(g => dayKey(g.t.close)))].sort();
  return (
    <article className="card overflow-hidden">
      <button className="w-full flex items-center gap-3 p-4 text-left hover:bg-raised/40 transition-colors" onClick={onToggle} aria-expanded={open}>
        <div className={cx('w-1 self-stretch rounded-full', shown >= 0 ? 'bg-profit' : 'bg-loss')} />
        <div className="min-w-0">
          <div className="font-semibold">{start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} – {end.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          <div className="text-xs text-ink3 mt-0.5">{s.total} trades · {days.length} days · {pct(s.winRate, 0)} win</div>
        </div>
        <div className="ml-auto flex items-center gap-5">
          <div className="text-right"><div className="label">{unit === 'R' ? 'Net R' : 'Net'}</div><div className={cx('num text-lg font-semibold leading-tight', tone(shown))}>{unit === 'R' ? rMult(totalR, 1) : fmt(s.net, { signed: true })}</div></div>
          <motion.span initial={false} animate={{ transform: `rotate(${open ? 180 : 0}deg)` }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="text-ink3 inline-flex"><Icon name="chevronDown" /></motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-line pt-4">
              <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-4 items-start">
                <WeekChart gs={gs} unit={unit} start={start} />
                <StatGrid items={stats(gs, fmt, unit)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {best && <Link to={`/trades/${best.t.id}`} className="rounded-xl border border-profit/30 bg-profit/[0.06] p-3 text-[13px]"><div className="label">Best trade</div><span className="font-semibold">{best.t.sym}</span> <span className="num text-profit font-semibold">{fmt(best.t.net, { signed: true })}{withR(best)}</span></Link>}
                {worst && worst !== best && <Link to={`/trades/${worst.t.id}`} className="rounded-xl border border-loss/30 bg-loss/[0.06] p-3 text-[13px]"><div className="label">Worst trade</div><span className="font-semibold">{worst.t.sym}</span> <span className="num text-loss font-semibold">{fmt(worst.t.net, { signed: true })}{withR(worst)}</span></Link>}
              </div>
              {found.length > 0 && (
                <div className="rounded-xl border border-line bg-raised/30 p-3">
                  <div className="label mb-1.5 flex items-center gap-1.5"><Icon name="sparkles" size={12} />What the week says</div>
                  <ReasonList items={found} />
                </div>
              )}
              <ul className="flex flex-col">
                {days.map(k => { const xs = gs.filter(g => dayKey(g.t.close) === k); const n = xs.reduce((a, g) => a + (unit === 'R' ? g.t.r ?? 0 : g.t.net), 0); return (
                  <li key={k}><button onClick={() => onDay(k)} className="w-full flex items-center gap-3 py-2.5 border-t border-line first:border-0 text-left text-[13px] hover:bg-raised/40 -mx-1 px-1 rounded-lg">
                    <span className="font-medium w-24">{new Date(k + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</span>
                    <span className="text-ink3 text-xs flex-1">{xs.length} trades</span>
                    <span className={cx('num font-semibold', tone(n))}>{unit === 'R' ? rMult(n, 1) : fmt(n, { signed: true })}</span><Icon name="chevronRight" size={14} className="text-ink3" />
                  </button></li>
                ); })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

/** Period answer first: how is this range going? */
function Summary({ days, unit, onDay }: { days: [string, Graded[]][]; unit: Unit; onDay: (d: string) => void }) {
  const fmt = useMoney();
  const dayNotes = useStore(s => s.dayNotes);
  const all = days.flatMap(([, gs]) => gs);
  const val = (gs: Graded[]) => gs.reduce((a, g) => a + (unit === 'R' ? g.t.r ?? 0 : g.t.net), 0);
  const net = val(all);
  const green = days.filter(([, gs]) => gs.reduce((a, g) => a + g.t.net, 0) > 0).length;
  const worst = days.reduce<[string, number] | null>((w, [d, gs]) => { const n = gs.reduce((a, g) => a + g.t.net, 0); return !w || n < w[1] ? [d, n] : w; }, null);
  const reviewed = days.filter(([d]) => dayNotes[d]?.trim()).length;
  const f = (v: number) => (unit === 'R' ? rMult(v, 1) : fmt(v, { signed: true }));
  return (
    <div className="card grid grid-cols-2 md:grid-cols-4 gap-px bg-line overflow-hidden p-0" aria-label="Period summary">
      <div className="bg-surface p-3 md:p-4"><div className="label">{unit === 'R' ? 'Net R' : 'Net P&L'}</div><div className={cx('num text-lg md:text-xl font-semibold mt-0.5', tone(net))}>{f(net)}</div><div className="text-[11.5px] text-ink3 num">{all.length} trades</div></div>
      <div className="bg-surface p-3 md:p-4"><div className="label">Green days</div><div className="num text-lg md:text-xl font-semibold mt-0.5">{green}<span className="text-ink3 text-sm">/{days.length}</span></div><div className="text-[11.5px] text-ink3 num">{pct(days.length ? green / days.length : null, 0)} of days</div></div>
      {worst ? <button type="button" onClick={() => onDay(worst[0])} className="bg-surface p-3 md:p-4 text-left hover:bg-raised/60 transition-colors">
        <div className="label flex items-center gap-1">Worst day<Icon name="chevronRight" size={11} /></div><div className={cx('num text-lg md:text-xl font-semibold mt-0.5', tone(worst[1]))}>{fmt(worst[1], { signed: true })}</div>
        <div className="text-[11.5px] text-ink3">{new Date(worst[0] + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
      </button> : <div className="bg-surface" />}
      <div className="bg-surface p-3 md:p-4"><div className="label">Reviewed</div><div className="num text-lg md:text-xl font-semibold mt-0.5">{reviewed}<span className="text-ink3 text-sm">/{days.length}</span></div><div className="text-[11.5px] text-ink3">days with a review</div></div>
    </div>
  );
}

export default function Journal() {
  const graded = useGraded();
  const { from, to } = useStore(s => s.range);
  const setRange = useStore(s => s.setRange);
  const [params, setParams] = useSearchParams();
  const focus = params.get('day');
  const view = (params.get('view') as 'day' | 'week') || 'day';
  const [unit, setUnit] = useUnit();
  const mobile = useIsMobile();
  const reduce = useReducedMotion();
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
    setTimeout(() => document.getElementById(`d-${focus}`)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  const goDay = (d: string) => setParams({ view: 'day', day: d }, { replace: true });
  // Days whose |net| is more than twice the median day stand out while scrolling.
  const outlierCut = useMemo(() => {
    const xs = days.map(([, gs]) => Math.abs(gs.reduce((a, g) => a + g.t.net, 0))).sort((a, b) => a - b);
    return xs.length >= 5 ? 2 * xs[Math.floor(xs.length / 2)] : Infinity;
  }, [days]);

  if (!days.length) return <Page><Card><Empty icon="journal" title="No trading days in this range" action={from || to ? <button className="btn" onClick={() => setRange({ from: null, to: null, label: 'All time' })}>Show all time</button> : undefined}>{from || to ? 'Nothing was traded in the selected dates.' : 'Your trading days appear here once trades are imported.'}</Empty></Card></Page>;
  return (
    <MotionConfig reducedMotion="user">
    <Page>
      <div className="flex items-center justify-between gap-2">
        <div className={mobile ? 'flex-1 min-w-0' : 'w-[260px]'}><Tabs label="Journal view" value={view} onChange={v => setParams({ view: v }, { replace: true })} options={[{ value: 'day', label: 'Days' }, { value: 'week', label: 'Weeks' }]} /></div>
        <Segmented swap="page" label="Unit" size="sm" value={unit} onChange={setUnit} options={[{ value: '$', label: mobile ? '$' : '$ P&L' }, { value: 'R', label: mobile ? 'R' : 'R multiple' }]} />
      </div>
      <Summary days={days} unit={unit} onDay={goDay} />
      {view === 'day' ? (<>
        {days.slice(0, limit).map(([day, gs]) => (
          <DayCard key={day} day={day} gs={gs} outlier={Math.abs(gs.reduce((a, g) => a + g.t.net, 0)) > outlierCut} history={historyBefore(new Date(day + 'T00:00').getTime())} unit={unit} open={open.has(day)}
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
    </MotionConfig>
  );
}
