import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Bar as RBar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts';
import { useAnalytics } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats, groupStats, type EnrichedTrade, type GroupStat } from '@/core/stats';
import { fmtHold } from '@/core/time';
import { pct, rMult, tone, useMoney } from '@/lib/format';
import { Card, CardHead, cx, Page, Segmented } from '@/ui/kit';
import { ChartTip, useColors } from '@/ui/charts';

type Tab = 'overview' | 'time' | 'setups' | 'symbols' | 'risk' | 'compare';

function GroupTable({ rows, label, onRow }: { rows: GroupStat[]; label: string; onRow?: (k: string) => void }) {
  const fmt = useMoney();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px]">
        <thead><tr><th className="th">{label}</th><th className="th text-right">Trades</th><th className="th text-right">Win %</th><th className="th text-right">PF</th><th className="th text-right">Expectancy</th><th className="th text-right">Avg R</th><th className="th text-right">Net</th></tr></thead>
        <tbody>
          {rows.map(g => (
            <tr key={g.key} className={cx(onRow && 'cursor-pointer hover:bg-raised/50')} onClick={() => onRow?.(g.key)}>
              <td className="td">{g.key}</td>
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
    </div>
  );
}

function GroupBars({ rows, height = 220 }: { rows: GroupStat[]; height?: number }) {
  const c = useColors();
  const fmt = useMoney();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="key" tick={{ fontSize: 11, fill: c.ink3 }} axisLine={false} tickLine={false} interval={0} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={64} />
        <Tooltip content={<ChartTip fmt={v => fmt(v)} />} cursor={{ fill: c.a('ink3', 0.08) }} />
        <RBar dataKey="net" name="Net" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={700}>
          {rows.map(r => <Cell key={r.key} fill={r.net >= 0 ? c.profit : c.loss} />)}
        </RBar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function Overview() {
  const a = useAnalytics();
  const fmt = useMoney();
  const s = a.stats;
  const rows: [string, string, string?][] = [
    ['Net P&L', fmt(s.net, { signed: true }), tone(s.net)], ['Total trades', String(s.total)], ['Winning / losing / breakeven', `${s.wins} / ${s.losses} / ${s.breakeven}`],
    ['Win rate', pct(s.winRate)], ['Breakeven win rate', pct(s.breakevenWinRate)], ['Profit factor', s.profitFactor?.toFixed(2) ?? '—'],
    ['Gross profit', fmt(s.grossWin)], ['Gross loss', fmt(-s.grossLoss)], ['Average win', fmt(s.avgWin), 'text-profit'], ['Average loss', fmt(s.avgLoss), 'text-loss'],
    ['Payoff ratio', s.payoff ? `${s.payoff.toFixed(2)} : 1` : '—'], ['Expectancy / trade', fmt(s.expectancy, { signed: true }), tone(s.expectancy)],
    ['Average R', rMult(s.avgR)], ['Total R', rMult(s.totalR, 1)], ['Trades with a usable stop', `${s.rCount} of ${s.total}`],
    ['Largest win', fmt(s.largestWin), 'text-profit'], ['Largest loss', fmt(s.largestLoss), 'text-loss'],
    ['Max consecutive wins', String(s.maxConsecWins)], ['Max consecutive losses', String(s.maxConsecLosses)],
    ['Avg hold — winners', fmtHold(s.avgHoldWin)], ['Avg hold — losers', fmtHold(s.avgHoldLoss)],
    ['Trading days', String(s.days.length)], ['Green / red days', `${s.greenDays} / ${s.redDays}`], ['Day win rate', pct(s.dayWinRate)],
    ['Average daily P&L', fmt(s.avgDailyPnl, { signed: true }), tone(s.avgDailyPnl)], ['Best day', s.bestDay ? fmt(s.bestDay.pnl, { signed: true }) : '—', 'text-profit'], ['Worst day', s.worstDay ? fmt(s.worstDay.pnl, { signed: true }) : '—', 'text-loss'],
    ['Max drawdown', fmt(-s.maxDrawdown), 'text-loss'], ['Max drawdown % of peak', pct(a.ddPct)], ['Recovery factor', s.recoveryFactor?.toFixed(2) ?? '—'],
    ['Sharpe (annualised)', a.sharpe?.toFixed(2) ?? `needs 20 days (${a.n})`], ['Sortino (annualised)', a.sortino?.toFixed(2) ?? '—'], ['Lots traded', s.volume.toFixed(2)],
  ];
  return (
    <Card>
      <CardHead title="Performance summary" sub="Every metric for the selected account and range" />
      <dl className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-8">
        {rows.map(([k, v, cl]) => <div key={k} className="flex justify-between gap-3 py-2.5 border-t border-line text-[13px]"><dt className="text-ink2">{k}</dt><dd className={cx('num font-medium text-right', cl)}>{v}</dd></div>)}
      </dl>
    </Card>
  );
}

function TimeTab({ et }: { et: EnrichedTrade[] }) {
  const wd = useMemo(() => {
    const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const g = groupStats(et, t => names[(t.open.getDay() + 6) % 7]);
    return names.map(n => g.find(x => x.key === n)).filter(Boolean) as GroupStat[];
  }, [et]);
  const hours = useMemo(() => {
    const g = groupStats(et, t => String(t.open.getHours()).padStart(2, '0'));
    return g.sort((a, b) => a.key.localeCompare(b.key)).map(x => ({ ...x, key: `${x.key}:00` }));
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
      <Card><CardHead title="Day of week" sub="By entry day" /><GroupBars rows={wd} /><GroupTable rows={wd} label="Day" /></Card>
      <Card><CardHead title="Session" sub="Entry hour in UTC" /><GroupBars rows={sessions} /><GroupTable rows={sessions} label="Session" /></Card>
      <Card className="lg:col-span-2"><CardHead title="Hour of day" sub="Your local entry hour" /><GroupBars rows={hours} height={240} /></Card>
      <Card className="lg:col-span-2"><CardHead title="Holding time" sub="Do your fast trades or patient trades pay?" /><GroupBars rows={hold} /><GroupTable rows={hold} label="Hold" /></Card>
    </div>
  );
}

function SetupsTab({ et }: { et: EnrichedTrade[] }) {
  const notes = useStore(s => s.notes);
  const strategies = useStore(s => s.strategies);
  const nav = useNavigate();
  const setups = useMemo(() => groupStats(et, t => notes[t.id]?.tags?.length ? notes[t.id].tags! : null), [et, notes]);
  const mistakes = useMemo(() => groupStats(et, t => notes[t.id]?.mistakes?.length ? notes[t.id].mistakes! : null).sort((a, b) => a.net - b.net), [et, notes]);
  const emotions = useMemo(() => groupStats(et, t => notes[t.id]?.emotion ?? null), [et, notes]);
  const grades = useMemo(() => groupStats(et, t => notes[t.id]?.grade ?? null).sort((a, b) => a.key.localeCompare(b.key)), [et, notes]);
  const strat = useMemo(() => groupStats(et, t => { const id = notes[t.id]?.strategyId; return id ? strategies.find(s => s.id === id)?.name ?? null : null; }), [et, notes, strategies]);
  const clean = useMemo(() => groupStats(et, t => (notes[t.id] ? (notes[t.id].mistakes?.length ? 'With mistakes' : 'Clean execution') : null)), [et, notes]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card className="lg:col-span-2"><CardHead title="Setups" sub="Trades can carry several tags; each counts once per tag" />{setups.length ? <GroupTable rows={setups} label="Setup" onRow={k => nav(`/trades?tag=${encodeURIComponent(k)}`)} /> : <p className="text-sm text-ink3">No setup tags yet.</p>}</Card>
      <Card><CardHead title="Clean vs mistakes" sub="What your errors cost on average" />{clean.length ? <GroupTable rows={clean} label="Execution" /> : <p className="text-sm text-ink3">Journal trades to compare.</p>}</Card>
      <Card><CardHead title="Mistakes" sub="Worst first" />{mistakes.length ? <GroupTable rows={mistakes} label="Mistake" /> : <p className="text-sm text-ink3">No mistakes tagged.</p>}</Card>
      <Card><CardHead title="State of mind" />{emotions.length ? <GroupTable rows={emotions} label="Emotion" /> : <p className="text-sm text-ink3">Pick a state of mind on trades to see this.</p>}</Card>
      <Card><CardHead title="Execution grade" />{grades.length ? <GroupTable rows={grades} label="Grade" /> : <p className="text-sm text-ink3">Grade trades A–D to see this.</p>}</Card>
      {strat.length > 0 && <Card className="lg:col-span-2"><CardHead title="Strategies" /><GroupTable rows={strat} label="Strategy" /></Card>}
    </div>
  );
}

function SymbolsTab({ et }: { et: EnrichedTrade[] }) {
  const nav = useNavigate();
  const sym = useMemo(() => groupStats(et, t => t.sym), [et]);
  const side = useMemo(() => groupStats(et, t => (t.type === 'buy' ? 'Long' : 'Short')), [et]);
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2"><CardHead title="Symbols" /><GroupBars rows={sym} /><GroupTable rows={sym} label="Symbol" onRow={k => nav(`/trades?symbol=${k}`)} /></Card>
      <Card><CardHead title="Long vs short" /><GroupBars rows={side} height={180} /><GroupTable rows={side} label="Side" /></Card>
    </div>
  );
}

function RiskTab({ et }: { et: EnrichedTrade[] }) {
  const c = useColors();
  const fmt = useMoney();
  const rDist = useMemo(() => {
    const rs = et.filter(t => t.r != null).map(t => t.r!);
    const bins = new Map<number, number>();
    for (const r of rs) { const b = Math.max(-3, Math.min(6, Math.floor(r * 2) / 2)); bins.set(b, (bins.get(b) ?? 0) + 1); }
    return [...bins.entries()].sort((a, b) => a[0] - b[0]).map(([b, n]) => ({ key: `${b >= 6 ? '≥' : b <= -3 ? '≤' : ''}${b.toFixed(1)}R`, b, n }));
  }, [et]);
  const scatter = useMemo(() => et.map(t => ({ x: Math.max(60, t.holdSec), y: t.net, z: t.volume, win: t.net >= 0 })), [et]);
  const sizes = useMemo(() => groupStats(et, t => (t.volume < 0.05 ? '< 0.05' : t.volume < 0.2 ? '0.05–0.2' : t.volume < 0.5 ? '0.2–0.5' : t.volume < 1 ? '0.5–1' : '≥ 1') + ' lots'), [et]);
  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHead title="R-multiple distribution" sub={`${rDist.reduce((a, b) => a + b.n, 0)} trades with a usable stop`} />
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={rDist} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke={c.line} vertical={false} />
            <XAxis dataKey="key" tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTip fmt={v => `${v} trades`} />} cursor={{ fill: c.a('ink3', 0.08) }} />
            <RBar dataKey="n" name="Trades" radius={[4, 4, 0, 0]} animationDuration={700}>{rDist.map(d => <Cell key={d.key} fill={d.b >= 0 ? c.profit : c.loss} />)}</RBar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CardHead title="P&L vs holding time" sub="Each dot is a trade; size = lots" />
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke={c.line} />
            <XAxis dataKey="x" type="number" scale="log" domain={['auto', 'auto']} tickFormatter={v => fmtHold(v)} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} name="Hold" />
            <YAxis dataKey="y" type="number" tickFormatter={v => fmt(v, { compact: true })} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} width={64} name="Net" />
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
        <thead><tr><th className="th">Metric</th><th className="th text-right text-profit">Winners</th><th className="th text-right text-loss">Losers</th></tr></thead>
        <tbody>{rows.map(([k, a, b]) => <tr key={k}><td className="td text-ink2">{k}</td><td className="td num text-right">{a}</td><td className="td num text-right">{b}</td></tr>)}</tbody>
      </table>
    </Card>
  );
}

export default function Reports() {
  const { et } = useAnalytics();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as Tab) || 'overview';
  return (
    <Page>
      <div className="overflow-x-auto -mx-1 px-1">
        <Segmented label="Report" value={tab} onChange={v => setParams({ tab: v }, { replace: true })} options={[
          { value: 'overview', label: 'Overview' }, { value: 'time', label: 'Days & times' }, { value: 'setups', label: 'Setups & mistakes' },
          { value: 'symbols', label: 'Symbols' }, { value: 'risk', label: 'Risk & R' }, { value: 'compare', label: 'Wins vs losses' },
        ]} />
      </div>
      {tab === 'overview' && <Overview />}
      {tab === 'time' && <TimeTab et={et} />}
      {tab === 'setups' && <SetupsTab et={et} />}
      {tab === 'symbols' && <SymbolsTab et={et} />}
      {tab === 'risk' && <RiskTab et={et} />}
      {tab === 'compare' && <CompareTab et={et} />}
    </Page>
  );
}
