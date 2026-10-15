import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useGraded, type Graded } from '@/data/guru';
import { curveDepth, formation, SD_COMBOS, trendRel } from '@/core/strategy';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bar as RBar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { useAnalytics } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats, groupStats, normTag, type EnrichedTrade, type GroupStat } from '@/core/stats';
import { fmtHold } from '@/core/time';
import { pct, rMult, tone, useMoney } from '@/lib/format';
import { Card, CardHead, cx, Empty, Page, Stat, Tabs, useIsMobile } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ChartTip, DivergingBars, useAxisW, useColors } from '@/ui/charts';

/** Local UTC offset, e.g. "UTC+05:30", so hour-based views name their clock. */
function utcOffset() {
  const m = -new Date().getTimezoneOffset();
  return `UTC${m >= 0 ? '+' : '−'}${String(Math.floor(Math.abs(m) / 60)).padStart(2, '0')}:${String(Math.abs(m) % 60).padStart(2, '0')}`;
}

type Tab = 'overview' | 'strategy' | 'time' | 'setups' | 'symbols' | 'risk' | 'compare';

/** Width of an element, live. Tables pick their layout from the card they sit in, not the screen. */
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(9999);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function GroupTable(props: { rows: GroupStat[]; label: string; onRow?: (k: string) => void; compact?: boolean }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const mobile = useIsMobile();
  return <div ref={ref}><GroupTableInner {...props} compact={props.compact || mobile || w < 480} /></div>;
}

function GroupTableInner({ rows, label, onRow, compact }: { rows: GroupStat[]; label: string; onRow?: (k: string) => void; compact?: boolean }) {
  const fmt = useMoney();
  if (compact) return (
    <ul className="flex flex-col">
      {rows.map(g => {
        const Row = onRow ? 'button' : 'div';
        return (
          <li key={g.key} className="border-t border-line first:border-0">
            <Row {...(onRow ? { type: 'button' as const, onClick: () => onRow(g.key) } : {})} className="w-full text-left py-3 flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium text-[14px] truncate">{g.key}</span>
                <span className={cx('num font-semibold text-[14px] shrink-0', tone(g.net))}>{fmt(g.net, { signed: true })}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                <Stat label="Trades" value={g.n} />
                <Stat label="Win" value={pct(g.winRate, 0)} />
                <Stat label="PF" value={g.profitFactor?.toFixed(2) ?? '—'} />
                <Stat label="Exp." value={fmt(g.expectancy, { signed: true, compact: true })} className={tone(g.expectancy)} />
                <Stat label="Avg R" value={rMult(g.avgR, 1)} className={tone(g.avgR)} />
              </div>
            </Row>
          </li>
        );
      })}
    </ul>
  );
  return (
    <table className="w-full">
      <thead className="pillhead"><tr><th className="th">{label}</th><th className="th text-right">Trades</th><th className="th text-right">Win %</th><th className="th text-right">PF</th><th className="th text-right">Expectancy</th><th className="th text-right">Avg R</th><th className="th text-right">Net</th></tr></thead>
      <tbody>
        {rows.map(g => (
          <tr key={g.key} className={cx(onRow && 'cursor-pointer hover:bg-raised/50')} onClick={() => onRow?.(g.key)}>
            <td className="td">{onRow
              ? <button type="button" className="text-left inline-flex items-center gap-1 hover:text-accent rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent" onClick={e => { e.stopPropagation(); onRow(g.key); }}>{g.key}<Icon name="chevronRight" size={12} className="text-ink3" /></button>
              : g.key}</td>
            <td className="td num text-right text-ink2">{g.n}</td>
            <td className="td num text-right text-ink2">{pct(g.winRate, 0)}</td>
            <td className="td num text-right text-ink2">{g.profitFactor?.toFixed(2) ?? '—'}</td>
            <td className={cx('td num text-right', tone(g.expectancy))}>{fmt(g.expectancy, { signed: true })}</td>
            <td className={cx('td num text-right', tone(g.avgR))}>{rMult(g.avgR, 2)}</td>
            <td className={cx('td num text-right font-semibold', tone(g.net))}>{fmt(g.net, { signed: true })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

type BarMetric = 'net' | 'exp' | 'win' | 'r' | 'n';
const BAR_METRICS: { v: BarMetric; label: string }[] = [{ v: 'net', label: 'Net $' }, { v: 'exp', label: 'Per trade' }, { v: 'win', label: 'Win %' }, { v: 'r', label: 'Avg R' }, { v: 'n', label: 'Trades' }];
type BarRow = { key: string; net: number; n?: number; winRate?: number; expectancy?: number; avgR?: number | null };

/** Column chart by category with its own metric switch. Long category lists thin their labels instead of overlapping. */
function GroupBars({ rows, height = 220, labelFmt }: { rows: BarRow[]; height?: number; labelFmt?: (k: string) => string }) {
  const c = useColors();
  const fmt = useMoney();
  const mobile = useIsMobile();
  const yw = useAxisW();
  const [m, setM] = useState<BarMetric>('net');
  const val = (r: BarRow) => (m === 'net' ? r.net : m === 'exp' ? r.expectancy ?? (r.n ? r.net / r.n : 0) : m === 'win' ? (r.n ? r.winRate ?? 0 : 0) : m === 'r' ? r.avgR ?? 0 : r.n ?? 0);
  const f = (v: number, short = false) => (m === 'win' ? `${Math.round(v * 100)}%` : m === 'r' ? `${v.toFixed(short ? 1 : 2)}R` : m === 'n' ? String(Math.round(v)) : fmt(v, short ? { compact: true } : { signed: true }));
  const data = rows.map(r => ({ key: r.key, v: val(r), n: r.n ?? 0 }));
  const maxLabels = mobile ? 8 : 24;
  const interval = rows.length > maxLabels ? Math.ceil(rows.length / maxLabels) - 1 : 0;
  const good = (v: number) => (m === 'win' ? v >= 0.5 : v >= 0);
  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2" role="radiogroup" aria-label="Metric">
        {BAR_METRICS.map(x => <button key={x.v} role="radio" aria-checked={m === x.v} onClick={() => setM(x.v)} className={cx('h-7 touch:h-8 px-2.5 rounded-full text-[11.5px] font-medium transition-colors', m === x.v ? 'bg-accent/15 text-accent' : 'text-ink3 hover:text-ink2')}>{x.label}</button>)}
      </div>
      <ResponsiveContainer width="100%" height={mobile ? Math.min(height, 200) : height}>
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={c.line} vertical={false} />
          <XAxis dataKey="key" tick={{ fontSize: 11, fill: c.ink3 }} tickFormatter={labelFmt} axisLine={false} tickLine={false} interval={interval} />
          <YAxis tickFormatter={v => f(v, true)} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Inter, system-ui, sans-serif' }} axisLine={false} tickLine={false} width={yw} domain={m === 'win' ? [0, 1] : ['auto', 'auto']} />
          <ReferenceLine y={m === 'win' ? 0.5 : 0} stroke={c.line2} strokeDasharray={m === 'win' ? '4 4' : undefined} />
          <Tooltip content={<ChartTip fmt={v => f(v)} labelFmt={l => (labelFmt ? labelFmt(String(l)) : String(l))} />} cursor={{ fill: c.a('ink3', 0.08) }} />
          <RBar key={m} dataKey="v" name={BAR_METRICS.find(x => x.v === m)!.label} radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={600}>
            {data.map(r => <Cell key={r.key} fill={m === 'n' ? c.accent : good(r.v) ? c.profit : c.loss} />)}
          </RBar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function Overview() {
  const a = useAnalytics();
  const fmt = useMoney();
  const s = a.stats;
  type Row = [string, string, string?];
  const groups: { title: string; rows: Row[] }[] = [
    { title: 'Result', rows: [
      ['Net P&L', fmt(s.net, { signed: true }), tone(s.net)], ['Gross profit', fmt(s.grossWin)], ['Gross loss', fmt(-s.grossLoss)],
      ['Largest win', fmt(s.largestWin), 'text-profit'], ['Largest loss', fmt(s.largestLoss), 'text-loss'],
      ['Best day', s.bestDay ? fmt(s.bestDay.pnl, { signed: true }) : '—', 'text-profit'], ['Worst day', s.worstDay ? fmt(s.worstDay.pnl, { signed: true }) : '—', 'text-loss'],
      ['Average daily P&L', fmt(s.avgDailyPnl, { signed: true }), tone(s.avgDailyPnl)],
    ] },
    { title: 'Edge', rows: [
      ['Win rate', pct(s.winRate), s.breakevenWinRate != null ? (s.winRate >= s.breakevenWinRate ? 'text-profit' : 'text-loss') : undefined], ['Breakeven win rate', pct(s.breakevenWinRate)],
      ['Profit factor', s.profitFactor?.toFixed(2) ?? '—', s.profitFactor != null ? (s.profitFactor >= 1 ? 'text-profit' : 'text-loss') : undefined],
      ['Payoff ratio', s.payoff ? `${s.payoff.toFixed(2)} : 1` : '—'], ['Average win', fmt(s.avgWin)], ['Average loss', fmt(s.avgLoss)],
      ['Expectancy / trade', fmt(s.expectancy, { signed: true }), tone(s.expectancy)],
      ['Average R', rMult(s.avgR), tone(s.avgR)], ['Total R', rMult(s.totalR, 1), tone(s.totalR)], ['Trades with a usable stop', `${s.rCount} of ${s.total}`],
    ] },
    { title: 'Risk', rows: [
      ['Max drawdown', fmt(-s.maxDrawdown), 'text-loss'], ['Max drawdown % of peak', pct(a.ddPct)], ['Recovery factor', s.recoveryFactor?.toFixed(2) ?? '—'],
      ['Max consecutive wins', String(s.maxConsecWins)], ['Max consecutive losses', String(s.maxConsecLosses)],
      ['Sharpe (annualised)', a.sharpe?.toFixed(2) ?? `needs 20 days (${a.n})`], ['Sortino (annualised)', a.sortino?.toFixed(2) ?? '—'],
    ] },
    { title: 'Activity', rows: [
      ['Total trades', String(s.total)], ['Winning / losing / breakeven', `${s.wins} / ${s.losses} / ${s.breakeven}`],
      ['Trading days', String(s.days.length)], ['Green / red days', `${s.greenDays} / ${s.redDays}`], ['Day win rate', pct(s.dayWinRate)],
      ['Avg hold — winners', fmtHold(s.avgHoldWin)], ['Avg hold — losers', fmtHold(s.avgHoldLoss)], ['Lots traded', s.volume.toFixed(2)],
    ] },
  ];
  const be = s.breakevenWinRate, gap = be != null ? (s.winRate - be) * 100 : null;
  return (
    <div className="flex flex-col gap-4">
      {gap != null && s.payoff != null && (
        <Card aria-label="Verdict">
          <div className="label">Verdict</div>
          <p className="text-[15px] md:text-base font-semibold mt-1.5 leading-snug">
            Win rate <span className="num">{pct(s.winRate)}</span> is{' '}
            <span className={cx('num', gap >= 0 ? 'text-profit' : 'text-loss')}>{Math.abs(gap).toFixed(1)} pts {gap >= 0 ? 'above' : 'below'}</span>{' '}
            the <span className="num">{pct(be)}</span> you need at a <span className="num">{s.payoff.toFixed(2)}</span> payoff.
          </p>
          <p className="text-[13px] text-ink3 mt-1">{gap >= 0 ? 'Your edge is positive: protect it by keeping losers small.' : 'Raise the win rate or the payoff (let winners run, cut losers sooner) to close the gap.'}</p>
        </Card>
      )}
      <div className="grid lg:grid-cols-2 gap-4">
        {groups.map(g => (
          <Card key={g.title}>
            <CardHead title={g.title} />
            <dl>
              {g.rows.map(([k, v, cl]) => <div key={k} className="flex justify-between gap-3 py-2.5 border-t border-line text-[13px]"><dt className="text-ink2">{k}</dt><dd className={cx('num font-medium text-right', cl)}>{v}</dd></div>)}
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TimeTab({ et }: { et: EnrichedTrade[] }) {
  const wd = useMemo(() => {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const g = groupStats(et, t => names[(t.open.getDay() + 6) % 7]);
    return names.map(n => g.find(x => x.key === n)).filter(Boolean) as GroupStat[];
  }, [et]);
  const hours = useMemo(() => {
    const g = new Map(groupStats(et, t => String(t.open.getHours()).padStart(2, '0')).map(x => [x.key, x]));
    return Array.from({ length: 24 }, (_, h) => { const k = String(h).padStart(2, '0'); const x = g.get(k); return { key: k, net: x?.net ?? 0, n: x?.n ?? 0, winRate: x?.winRate ?? 0, expectancy: x?.expectancy ?? 0, avgR: x?.avgR ?? 0 }; });
  }, [et]);
  const hold = useMemo(() => {
    const b = (s: number) => (s < 300 ? '< 5m' : s < 900 ? '5–15m' : s < 3600 ? '15m–1h' : s < 14400 ? '1–4h' : s < 86400 ? '4h–1d' : '> 1d');
    const order = ['< 5m', '5–15m', '15m–1h', '1–4h', '4h–1d', '> 1d'];
    const g = groupStats(et, t => b(t.holdSec));
    return order.map(o => g.find(x => x.key === o)).filter(Boolean) as GroupStat[];
  }, [et]);
  const sessions = useMemo(() => groupStats(et, t => t.session), [et]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card><CardHead title="Day of week" sub="By entry day, your time" /><GroupBars rows={wd} /><GroupTable rows={wd} label="Day" /></Card>
      <Card><CardHead title="Session" sub="Sessions in UTC: Asia 23–07 · London 07–12 · NY 12–21" /><GroupBars rows={sessions} /><GroupTable rows={sessions} label="Session" /></Card>
      <Card className="lg:col-span-2"><CardHead title="Hour of day" sub={`Entry hour, your time (${utcOffset()})`} /><GroupBars rows={hours} height={240} labelFmt={k => `${k}:00`} /></Card>
      <Card className="lg:col-span-2"><CardHead title="Holding time" sub="Do your fast trades or patient trades pay?" /><GroupBars rows={hold} /><GroupTable rows={hold} label="Hold" /></Card>
    </div>
  );
}

function SetupsTab({ et }: { et: EnrichedTrade[] }) {
  const notes = useStore(s => s.notes);
  const strategies = useStore(s => s.strategies);
  const nav = useNavigate();
  const setups = useMemo(() => groupStats(et, t => notes[t.id]?.tags?.length ? [...new Set(notes[t.id].tags!.map(normTag))] : null), [et, notes]);
  const mistakes = useMemo(() => groupStats(et, t => notes[t.id]?.mistakes?.length ? [...new Set(notes[t.id].mistakes!.map(normTag))] : null).sort((a, b) => a.net - b.net), [et, notes]);
  const emotions = useMemo(() => groupStats(et, t => notes[t.id]?.emotion ?? null), [et, notes]);
  const grades = useMemo(() => groupStats(et, t => notes[t.id]?.grade ?? null).sort((a, b) => a.key.localeCompare(b.key)), [et, notes]);
  const ratings = useMemo(() => groupStats(et, t => (notes[t.id]?.rating ? `${'★'.repeat(notes[t.id].rating!)}` : null)).sort((a, b) => b.key.length - a.key.length), [et, notes]);
  const strat = useMemo(() => groupStats(et, t => { const id = notes[t.id]?.strategyId; return id ? strategies.find(s => s.id === id)?.name ?? null : null; }), [et, notes, strategies]);
  const clean = useMemo(() => groupStats(et, t => (notes[t.id] ? (notes[t.id].mistakes?.length ? 'With mistakes' : 'Clean execution') : null)), [et, notes]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="lg:col-span-2"><CardHead title="Setups" sub="Trades can carry several tags; each counts once per tag" />{setups.length ? <GroupTable rows={setups} label="Setup" onRow={k => nav(`/trades?tag=${encodeURIComponent(k)}`)} /> : <p className="text-sm text-ink3">No setup tags yet.</p>}</Card>
      <Card><CardHead title="Clean vs mistakes" sub="What your errors cost on average" />{clean.length ? <GroupTable rows={clean} label="Execution" /> : <p className="text-sm text-ink3">Journal trades to compare.</p>}</Card>
      <Card><CardHead title="Mistakes" sub="Worst first" />{mistakes.length ? <GroupTable rows={mistakes} label="Mistake" /> : <p className="text-sm text-ink3">No mistakes tagged.</p>}</Card>
      <Card><CardHead title="State of mind" />{emotions.length ? <GroupTable rows={emotions} label="Emotion" /> : <p className="text-sm text-ink3">Pick a state of mind on trades to see this.</p>}</Card>
      <Card><CardHead title="Execution grade" />{grades.length ? <GroupTable rows={grades} label="Grade" /> : <p className="text-sm text-ink3">Grade trades A–D to see this.</p>}</Card>
      {ratings.length > 0 && <Card><CardHead title="Your star rating" /><GroupTable rows={ratings} label="Rating" /></Card>}
      {strat.length > 0 && <Card className="lg:col-span-2"><CardHead title="Strategies" /><GroupTable rows={strat} label="Strategy" /></Card>}
    </div>
  );
}

function SymbolsTab({ et }: { et: EnrichedTrade[] }) {
  const nav = useNavigate();
  const mobile = useIsMobile();
  const [all, setAll] = useState(false);
  const sym = useMemo(() => groupStats(et, t => t.sym), [et]);
  const side = useMemo(() => groupStats(et, t => (t.type === 'buy' ? 'Long' : 'Short')), [et]);
  const fmt = useMoney();
  const open = (k: string) => nav(`/trades?symbol=${encodeURIComponent(k)}`);
  // Phone: best 6 and worst 6 first, so the page isn't 40 bars then 40 cards.
  const cut = mobile && sym.length > 12 && !all;
  const shown = cut ? [...sym.slice(0, 6), ...sym.slice(-6)] : sym;
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2"><CardHead title="Symbols" sub={cut ? `Best 6 and worst 6 of ${sym.length}. Tap a symbol to see its trades` : 'Tap a symbol to see its trades'} />
        <DivergingBars rows={shown.map(g => ({ key: g.key, net: g.net, sub: `${g.n} trades · ${pct(g.winRate, 0)}` }))} fmt={v => fmt(v, { signed: true, compact: true })} onRow={open} />
        <div className="mt-5"><GroupTable rows={shown} label="Symbol" onRow={open} /></div>
        {mobile && sym.length > 12 && <button type="button" className="btn w-full h-10 mt-3" onClick={() => setAll(v => !v)}>{all ? 'Show best and worst only' : `Show all ${sym.length}`}</button>}
      </Card>
      <Card><CardHead title="Long vs short" /><GroupBars rows={side} height={180} /><GroupTable rows={side} label="Side" compact /></Card>
    </div>
  );
}

function RiskTab({ et }: { et: EnrichedTrade[] }) {
  const c = useColors();
  const yw = useAxisW();
  const fmt = useMoney();
  const rDist = useMemo(() => {
    const rs = et.filter(t => t.r != null).map(t => t.r!);
    const bins = new Map<number, number>();
    for (const r of rs) { const b = Math.max(-3, Math.min(6, Math.floor(r * 2) / 2)); bins.set(b, (bins.get(b) ?? 0) + 1); }
    return [...bins.entries()].sort((a, b) => a[0] - b[0]).map(([b, n]) => ({ key: `${b >= 6 ? '≥' : b <= -3 ? '≤' : ''}${b.toFixed(1)}R`, b, n }));
  }, [et]);
  const scatter = useMemo(() => et.map(t => ({ x: Math.max(60, t.holdSec), y: t.net, z: t.volume, win: t.net >= 0 })), [et]);
  const sizes = useMemo(() => {
    const order = ['< 0.05', '0.05–0.2', '0.2–0.5', '0.5–1', '≥ 1'].map(x => x + ' lots');
    const g = groupStats(et, t => (t.volume < 0.05 ? '< 0.05' : t.volume < 0.2 ? '0.05–0.2' : t.volume < 0.5 ? '0.2–0.5' : t.volume < 1 ? '0.5–1' : '≥ 1') + ' lots');
    return order.map(o => g.find(x => x.key === o)).filter(Boolean) as GroupStat[];
  }, [et]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHead title="R-multiple distribution" sub={`${rDist.reduce((a, b) => a + b.n, 0)} trades with a usable stop`} />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rDist} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={c.line} vertical={false} />
            <XAxis dataKey="key" tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={4} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip fmt={v => `${v} trades`} />} cursor={{ fill: c.a('ink3', 0.08) }} />
            <RBar dataKey="n" name="Trades" radius={[4, 4, 0, 0]} animationDuration={700}>{rDist.map(d => <Cell key={d.key} fill={d.b > 0 ? c.profit : d.b < 0 ? c.loss : c.ink3} />)}</RBar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CardHead title="P&L vs holding time" sub="Each dot is a trade; size = lots" />
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={c.line} />
            <XAxis dataKey="x" type="number" scale="log" domain={['auto', 'auto']} tickFormatter={v => fmtHold(v)} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} name="Hold" minTickGap={24} />
            <YAxis dataKey="y" type="number" tickFormatter={v => fmt(v, { compact: true })} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} width={yw} name="Net" />
            <ZAxis dataKey="z" range={[20, 160]} />
            <Tooltip content={<ChartTip fmt={(v, k) => (k === 'x' ? fmtHold(v) : k === 'y' ? fmt(v) : `${v} lots`)} labelFmt={() => 'Trade'} />} />
            <Scatter data={scatter.filter(d => d.win)} fill={c.profit} fillOpacity={0.7} />
            <Scatter data={scatter.filter(d => !d.win)} fill={c.loss} fillOpacity={0.7} />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
      <Card className="lg:col-span-2"><CardHead title="Position size" sub="Are your bigger trades your better trades?" /><GroupTable rows={sizes} label="Size" /></Card>
    </div>
  );
}

function CompareTab({ et }: { et: EnrichedTrade[] }) {
  const fmt = useMoney();
  const w = useMemo(() => computeStats(et.filter(t => t.outcome === 'win')), [et]);
  const l = useMemo(() => computeStats(et.filter(t => t.outcome === 'loss')), [et]);
  const avg = (xs: EnrichedTrade[], f: (t: EnrichedTrade) => number) => (xs.length ? xs.reduce((a, t) => a + f(t), 0) / xs.length : 0);
  const ws = et.filter(t => t.outcome === 'win'), ls = et.filter(t => t.outcome === 'loss');
  const rows: [string, string, string][] = [
    ['Trades', String(w.total), String(l.total)],
    ['Total', fmt(w.net, { signed: true }), fmt(l.net, { signed: true })],
    ['Average', fmt(avg(ws, t => t.net)), fmt(avg(ls, t => t.net))],
    ['Average R', rMult(w.avgR), rMult(l.avgR)],
    ['Average lots', avg(ws, t => t.volume).toFixed(2), avg(ls, t => t.volume).toFixed(2)],
    ['Average hold', fmtHold(avg(ws, t => t.holdSec)), fmtHold(avg(ls, t => t.holdSec))],
    ['Longs / shorts', `${ws.filter(t => t.type === 'buy').length} / ${ws.filter(t => t.type === 'sell').length}`, `${ls.filter(t => t.type === 'buy').length} / ${ls.filter(t => t.type === 'sell').length}`],
    ['Max streak', String(w.total ? computeStats(et).maxConsecWins : 0), String(l.total ? computeStats(et).maxConsecLosses : 0)],
  ];
  return (
    <Card>
      <CardHead title="Winners vs losers" sub="If losers are held longer or sized bigger, that's where the leak is" />
      <table className="w-full">
        <thead className="pillhead"><tr><th className="th">Metric</th><th className="th text-right text-profit">Winners</th><th className="th text-right text-loss">Losers</th></tr></thead>
        <tbody>{rows.map(([k, a, b]) => <tr key={k}><td className="td text-ink2">{k}</td><td className="td num text-right">{a}</td><td className="td num text-right">{b}</td></tr>)}</tbody>
      </table>
    </Card>
  );
}

const DIMS: { k: string; label: string; key: (g: Graded) => string | null }[] = [
  { k: 'odds', label: 'Odds', key: g => (g.eval ? (!g.eval.tradeable ? 'No-trade setup' : g.eval.odds === 'high' ? 'High odds' : 'Low odds') : null) },
  { k: 'method', label: 'Method', key: g => (g.plan ? (g.plan.method === 'sf' ? 'Set & forget' : 'Confirmation') : null) },
  { k: 'signal', label: 'Confirmation', key: g => (g.plan?.method === 'conf' ? ({ both: 'Zone + trendline', trendline: 'Trendline removed', zone: 'Zone removed', structure: 'Structure shift', breakout: 'Breakout order' } as Record<string, string>)[g.plan.signal ?? ''] ?? 'No signal' : null) },
  { k: 'kind', label: 'Zone', key: g => (g.plan ? formation(g.plan.kind, g.plan.side) : null) },
  { k: 'move', label: 'Move away', key: g => (g.plan ? ({ poor: 'Poor', decent: 'Decent', aplus: 'A+', gap: 'Gap' })[g.plan.moveAway] : null) },
  { k: 'base', label: 'Base', key: g => (g.plan ? (g.plan.baseCandles <= 2 ? '1–2 candles' : g.plan.baseCandles <= 4 ? '3–4 candles' : '5+ candles') : null) },
  { k: 'trend', label: 'HTF trend', key: g => (g.plan ? ({ with: 'With trend', counter: 'Counter-trend', sideways: 'Sideways' })[trendRel(g.plan.side, g.plan.htfTrend)] : null) },
  { k: 'curve', label: 'Curve', key: g => (g.plan ? (curveDepth(g.plan.side, g.plan.curve) <= 25 ? 'Deep (0–25%)' : curveDepth(g.plan.side, g.plan.curve) <= 50 ? 'Good half (25–50%)' : 'Wrong half (50%+)') : null) },
  { k: 'combo', label: 'Timeframes', key: g => (g.plan ? `${SD_COMBOS[g.plan.combo].etf} → ${SD_COMBOS[g.plan.combo].htf}` : null) },
  { k: 'adh', label: 'Rules kept', key: g => (g.verdict.adherence == null ? null : g.verdict.adherence >= 80 ? 'Kept 80%+' : g.verdict.adherence >= 50 ? 'Kept 50–79%' : 'Kept under 50%') },
  { k: 'planned', label: 'Planned?', key: g => (g.plan ? (g.plan.retro ? 'Graded after' : 'Planned before') : 'No plan') },
];

function StrategyTab() {
  const graded = useGraded();
  const fmt = useMoney();
  const { from, to } = useStore(s => s.range);
  const inR = useMemo(() => graded.filter(g => { const k = g.t.closeTime.slice(0, 10).replace(/\./g, '-'); return (!from || k >= from) && (!to || k <= to); }), [graded, from, to]);
  const [dim, setDim] = useState('odds');
  const d = DIMS.find(x => x.k === dim)!;
  const rows = useMemo(() => { const by = new Map(inR.map(g => [g.t, g])); return groupStats(inR.map(g => g.t), t => d.key(by.get(t)!)); }, [inR, d]);
  const withPlan = inR.filter(g => g.plan).length;
  // "Rules kept" only means something for trades graded against the playbook.
  const adh = inR.filter(g => g.plan && g.verdict.adherence != null);
  const avgAdh = adh.length ? adh.reduce((a, g) => a + g.verdict.adherence!, 0) / adh.length : null;
  const kept = computeStats(adh.filter(g => g.verdict.adherence! >= 80).map(g => g.t)), broke = computeStats(adh.filter(g => g.verdict.adherence! < 80).map(g => g.t));
  const latest = useMemo(() => [...inR].filter(g => !g.plan).sort((a, b) => b.t.close.getTime() - a.t.close.getTime())[0], [inR]);
  if (!withPlan) return (
    <Card>
      <Empty icon="target" title="No graded trades yet"
        action={<div className="flex flex-wrap justify-center gap-2">
          {latest && <Link className="btn-primary h-10" to={`/plan/new?trade=${latest.t.id}`}>Grade your latest trade</Link>}
          <Link className="btn h-10" to="/plan/new">Plan a trade</Link>
        </div>}>
        Grade trades against your playbook to see what pays you: odds, zone, timeframes, trend and how many rules you kept. {inR.length} trades in this range are waiting.
      </Empty>
    </Card>
  );
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          ['Trades with a plan', `${withPlan} / ${inR.length}`, withPlan / Math.max(1, inR.length) >= 0.8 ? 'text-profit' : 'text-warn'],
          ['Rules kept (graded trades)', avgAdh != null ? `${avgAdh.toFixed(0)}%` : '—', avgAdh == null ? '' : avgAdh >= 80 ? 'text-profit' : avgAdh >= 50 ? 'text-warn' : 'text-loss'],
          ['Per trade — rules kept', kept.total ? fmt(kept.expectancy, { signed: true }) : '—', tone(kept.expectancy)],
          ['Per trade — rules broken', broke.total ? fmt(broke.expectancy, { signed: true }) : '—', tone(broke.expectancy)],
        ] as [string, string, string][]).map(([l, v, c]) => <Card key={l} className="p-4"><div className="label">{l}</div><div className={cx('num text-xl font-semibold mt-1.5', c)}>{v}</div></Card>)}
      </div>
      <Card>
        <CardHead title="What pays you" sub={`Your results split by each part of the playbook · ${withPlan} graded trades`} />
        <div className="flex flex-wrap gap-1.5 mb-4" role="radiogroup" aria-label="Split by">{DIMS.map(x => <button key={x.k} type="button" role="radio" aria-checked={dim === x.k} onClick={() => setDim(x.k)} className={cx('chip', dim === x.k && 'border-accent text-accent bg-accent/10 font-semibold')}>{dim === x.k && <Icon name="check" size={12} />}{x.label}</button>)}</div>
        {rows.length ? <><GroupBars rows={rows} height={200} /><div className="mt-4"><GroupTable rows={rows} label={d.label} /></div></> : <p className="text-sm text-ink3 py-6 text-center">No graded trades for this view yet.</p>}
      </Card>
    </div>
  );
}

export default function Reports() {
  const { et } = useAnalytics();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'overview';
  return (
    <Page>
      <Tabs label="Report" value={tab} onChange={v => { setParams({ tab: v }, { replace: true }); window.scrollTo({ top: 0 }); }} options={[
        { value: 'overview', label: 'Overview' }, { value: 'strategy', label: 'Strategy' }, { value: 'time', label: 'Time' }, { value: 'setups', label: 'Setups' },
        { value: 'symbols', label: 'Symbols' }, { value: 'risk', label: 'Risk & R' }, { value: 'compare', label: 'Win/Loss' },
      ]} />
      {tab === 'overview' && <Overview />}
      {tab === 'time' && <TimeTab et={et} />}
      {tab === 'setups' && <SetupsTab et={et} />}
      {tab === 'symbols' && <SymbolsTab et={et} />}
      {tab === 'risk' && <RiskTab et={et} />}
      {tab === 'compare' && <CompareTab et={et} />}
      {tab === 'strategy' && <StrategyTab />}
    </Page>
  );
}
