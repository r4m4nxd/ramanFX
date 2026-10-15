import { TickerTape } from '@/ui/TickerTape';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAnalytics, useEnriched } from '@/data/derived';
import { DEFAULT_RISK_RULES, useStore } from '@/data/store';
import { riskStatus } from '@/core/risk';
import { MIN_SCORE_TRADES } from '@/core/stats';
import { dayKey } from '@/core/time';
import { pct, rMult, shortDate, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Bar, Card, CardHead, CountUp, cx, InfoTip, Page, rise, Segmented, useIsMobile } from '@/ui/kit';
import { TradeList } from '@/ui/TradeList';
import { BalanceChart, bucketDays, type DayMetric, DailyBars, DivergingBars, EquityChart, PERIOD_NOUN, PeriodToggle, Sparkline, usePeriod } from '@/ui/charts';
import { MonthCalendar } from '@/ui/MonthCalendar';
import { cardOfDay } from '@/core/coach';
import { Icon, type IconName } from '@/ui/Icon';

function Kpi({ label, children, foot, hint, className, icon, hero }: { label: string; children: React.ReactNode; foot?: React.ReactNode; hint?: string; className?: string; icon?: IconName; hero?: boolean }) {
  return (
    <motion.div variants={rise} className={cx(hero ? 'card-hero' : 'card', 'p-4 min-w-0 flex flex-col', className)}>
      <div className="flex items-center gap-2.5">
        {icon && <span className={cx('w-8 h-8 rounded-full grid place-items-center shrink-0', hero ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent border border-accent/25')}><Icon name={icon} size={15} /></span>}
        <div className={cx('label flex items-center gap-1.5', hero && '!text-white/80')}>{label}{hint && <InfoTip text={hint} />}</div>
      </div>
      <div className="mt-2 flex-1">{children}</div>
      {foot && <div className={cx('text-[11.5px] mt-2.5', hero ? 'text-white/75' : 'text-ink3')}>{foot}</div>}
    </motion.div>
  );
}

/** Key-value grid: risk limits and targets beside today's usage, prop-firm style. */
function RiskGrid({ s }: { s: { winRate: number; profitFactor: number | null; wins: number; losses: number; total: number; days: unknown[] } }) {
  const all = useEnriched();
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(st => st.riskRules) };
  const fmt = useMoney();
  const st = useMemo(() => riskStatus(all, rules), [all, rules]);
  const decided = s.wins + s.losses;
  const rows: [string, React.ReactNode, string?][] = [
    ['Daily loss limit', <>{fmt(st.lossToday)} <span className="text-ink3">/ {fmt(rules.maxDailyLoss)}</span></>, st.lossUsed >= 1 ? 'text-loss' : undefined],
    ['Max risk per trade', fmt(rules.maxSingleTradeRisk)],
    ['Risk per trade', `${rules.riskPercent}%`],
    ['Trades today', <>{st.count} <span className="text-ink3">/ {rules.maxDailyTrades}</span></>, st.tradesUsed >= 1 ? 'text-warn' : undefined],
    ['Losses in a row', <>{st.consecLosses} <span className="text-ink3">/ {rules.maxConsecutiveLosses}</span></>, rules.maxConsecutiveLosses && st.consecLosses >= rules.maxConsecutiveLosses ? 'text-loss' : undefined],
    ['Cooldown after streak', `${rules.cooldownMinutes} min`],
    ['Win rate', pct(s.winRate), 'text-profit'],
    ['Loss rate', decided ? pct(s.losses / decided) : '—', 'text-loss'],
    ['Profit factor', s.profitFactor == null ? '—' : s.profitFactor.toFixed(2), s.profitFactor != null && s.profitFactor < 1 ? 'text-loss' : undefined],
    ['Trading days', String(s.days.length)],
  ];
  return (
    <Card>
      <CardHead title="Risk & targets" sub="Your limits against today, plus the core rates" right={<Link to="/risk" className="text-xs text-accent hover:underline inline-block py-2 -my-2">Edit limits</Link>} />
      <dl className="grid grid-cols-2 lg:grid-cols-5 gap-x-6">
        {rows.map(([k, v, t]) => (
          <div key={k} className="flex items-center justify-between gap-3 py-2.5 border-b border-line/70">
            <dt className="text-[12.5px] text-ink3 truncate">{k}</dt>
            <dd className={cx('num text-[13.5px] font-semibold whitespace-nowrap', t)}>{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}

function TodayStrip() {
  const all = useEnriched();
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const fmt = useMoney();
  const st = useMemo(() => riskStatus(all, rules), [all, rules]);
  const state = st.locked ? (st.breaches[0].level === 'cooldown' ? 'COOLDOWN' : 'STOP TRADING') : st.warnings.length ? 'CAUTION' : 'CLEAR TO TRADE';
  const t = st.locked ? 'loss' : st.warnings.length ? 'warn' : 'profit';
  return (
    <motion.section variants={rise} aria-label="Today" className="card px-4 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-3">
        <Badge tone={t as 'loss'}>{state}</Badge>
        <span className="text-[13px] text-ink2">Today</span>
        <span className={cx('num font-semibold', tone(st.netToday))}>{fmt(st.netToday, { signed: true })}</span>
      </div>
      <div className="flex-1 min-w-[170px]">
        <div className="flex justify-between text-xs text-ink2 mb-1.5"><span>Daily loss limit</span><span className="num">{fmt(st.lossToday)} / {fmt(rules.maxDailyLoss)}</span></div>
        <Bar value={st.lossUsed} tone={st.lossUsed >= 1 ? 'loss' : st.lossUsed >= 0.7 ? 'warn' : 'profit'} />
      </div>
      <div className="flex-1 min-w-[140px]">
        <div className="flex justify-between text-xs text-ink2 mb-1.5"><span>Trades today</span><span className="num">{st.count} / {rules.maxDailyTrades}</span></div>
        <Bar value={st.tradesUsed} tone={st.tradesUsed >= 1 ? 'loss' : 'accent'} />
      </div>
      {(st.breaches[0] || st.warnings[0]) && <div className={cx('text-xs w-full', st.locked ? 'text-loss' : 'text-warn')}>{st.breaches[0]?.text ?? st.warnings[0]}</div>}
    </motion.section>
  );
}

function GuruStrip() {
  const { et } = useAnalytics();
  const card = cardOfDay();
  let streak = 0;
  for (const t of [...et].sort((a, b) => b.close.getTime() - a.close.getTime())) { if (t.outcome === 'loss') streak++; else if (t.outcome === 'win') break; }
  return (
    <motion.section variants={rise} aria-label="Guru" className="card luxe-border p-4 flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name="sparkles" size={18} /></div>
      <Link to="/guru" className="min-w-0 flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-ink3">{streak >= 3 ? `${streak} losses in a row` : `Rule of the day · ${card.topic}`}</div>
        <div className="text-[14px] font-semibold mt-0.5">{streak >= 3 ? 'Half risk, high-odds setups only, no trade within 15 minutes of a loss.' : `${card.title}. `}<span className="font-normal text-ink2">{streak >= 3 ? '' : card.body}</span></div>
      </Link>
      <Link to="/plan/new" className="btn-primary h-10 shrink-0"><Icon name="target" size={15} />Plan a trade</Link>
    </motion.section>
  );
}

function Checklist() {
  const items = useStore(s => s.checklist);
  const days = useStore(s => s.checklistDays);
  const toggle = useStore(s => s.toggleChecklist);
  const today = days[dayKey(new Date())] ?? {};
  const done = items.filter(i => today[i]).length;
  return (
    <Card>
      <CardHead title="Pre-session checklist" sub={`${done} of ${items.length} done today`} right={<Link to="/risk" className="text-xs text-accent hover:underline inline-block py-2 -my-2">Edit</Link>} />
      <Bar value={items.length ? done / items.length : 0} className="mb-3" />
      <ul className="flex flex-col">
        {items.map(it => {
          const on = !!today[it];
          return (
            <li key={it}>
              <button type="button" role="checkbox" aria-checked={on} onClick={() => toggle(it)} className="w-full flex items-center gap-3 py-2 px-1.5 -mx-1.5 rounded-lg hover:bg-raised text-left">
                <motion.span animate={{ scale: on ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.25 }}
                  className={cx('w-[18px] h-[18px] rounded-md border grid place-items-center shrink-0 transition-colors', on ? 'bg-accent border-accent text-[#0A0C0F]' : 'border-line2')}>
                  {on && <Icon name="check" size={12} strokeWidth={3} />}
                </motion.span>
                <span className={cx('text-[13px]', on ? 'text-ink3 line-through' : 'text-ink')}>{it}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

export default function Dashboard() {
  const a = useAnalytics();
  const fmt = useMoney();
  const nav = useNavigate();
  const notes = useStore(s => s.notes);
  const [curve, setCurve] = useState<'pnl' | 'r' | 'balance'>('pnl');
  const [barM, setBarM] = useState<DayMetric>('net');
  const [allSyms, setAllSyms] = useState(false);
  const mobile = useIsMobile();
  const s = a.stats;
  const [curveP, setCurveP] = usePeriod('curve');
  const [barP, setBarP] = usePeriod('bars');
  const buckets = useMemo(() => bucketDays(s.days, barP), [s.days, barP]);
  const shown = barP === 'day' ? buckets.slice(-60) : barP === 'week' ? buckets.slice(-52) : buckets;
  const greenB = shown.filter(b => b.pnl > 0).length, redB = shown.filter(b => b.pnl < 0).length;
  // Cumulative R (trades with a known initial stop) and R per day.
  const rEquity = useMemo(() => { let cum = 0, peak = 0; return a.et.filter(t => t.r != null).map(t => { cum += t.r!; peak = Math.max(peak, cum); return { t: t.close.getTime(), cum, dd: cum - peak }; }); }, [a.et]);
  const rByDay = useMemo(() => { const m = new Map<string, number>(); for (const t of a.et) if (t.r != null) { const k = dayKey(t.close); m.set(k, (m.get(k) ?? 0) + t.r); } return m; }, [a.et]);
  const daysR = useMemo(() => s.days.map(d => ({ ...d, r: rByDay.get(d.date) ?? 0 })), [s.days, rByDay]);
  const recent = [...a.et].reverse().slice(0, 7);
  const lowSample = s.total < MIN_SCORE_TRADES;

  if (!s.total) return (
    <Page>
      <TickerTape />
      <TodayStrip />
      <Card><div className="py-16 text-center text-ink3">No trades in this date range. Pick another range at the top.</div></Card>
    </Page>
  );

  return (
    <Page>
      <TickerTape />
      <TodayStrip />
      <GuruStrip />

      <section aria-label="Key metrics" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        <Kpi hero icon="bolt" className="col-span-2 md:col-span-1" label="Net P&L" foot={`${s.total} trades · ${s.days.length} days`}>
          <CountUp value={s.net} format={v => fmt(v, { signed: true })} className="num text-[28px] font-bold tracking-tight text-white whitespace-nowrap" />
          <Sparkline values={s.equity.map(e => e.cum)} className="mt-2" color="#fff" />
        </Kpi>
        <Kpi icon="target" label="Win rate" hint="Wins ÷ (wins + losses). Breakeven trades are excluded." foot={s.breakevenWinRate != null ? <>Breakeven at your payoff: <span className="num text-ink2">{pct(s.breakevenWinRate)}</span></> : undefined}>
          <div className="flex items-baseline gap-2"><CountUp value={s.winRate * 100} format={v => `${v.toFixed(1)}%`} className="num text-[26px] font-semibold tracking-tight" /><span className="text-xs text-ink3">{s.wins}W · {s.losses}L{s.breakeven ? ` · ${s.breakeven}BE` : ''}</span></div>
          <div className="relative mt-3 h-1.5 rounded-full bg-loss/70 overflow-hidden">
            <motion.div className="absolute inset-y-0 left-0 bg-profit rounded-full" initial={{ width: 0 }} animate={{ width: `${s.winRate * 100}%` }} transition={{ duration: 0.9 }} />
            {s.breakevenWinRate != null && <span className="absolute -top-0.5 -bottom-0.5 w-0.5 bg-ink" style={{ left: `${s.breakevenWinRate * 100}%` }} title="Breakeven win rate" />}
          </div>
        </Kpi>
        <Kpi icon="sliders" label="Profit factor" hint="Gross profit ÷ gross loss." foot={<span className="num">{fmt(s.grossWin, { compact: true })} won · {fmt(s.grossLoss, { compact: true })} lost</span>}>
          {s.profitFactor == null ? <span className="num text-[26px] font-semibold">—</span> : <CountUp value={s.profitFactor} format={v => v.toFixed(2)} className={cx('num text-[26px] font-semibold tracking-tight', s.profitFactor >= 1 ? 'text-ink' : 'text-loss')} />}
        </Kpi>
        <Kpi icon="arrowUp" label="Avg win / loss" hint="Payoff ratio: average winner ÷ average loser." foot={<span className="num flex justify-between"><span className="text-profit">{fmt(s.avgWin)}</span><span className="text-loss">{fmt(s.avgLoss)}</span></span>}>
          {s.payoff == null ? <span className="num text-[26px] font-semibold">—</span> : <div className="flex items-baseline gap-1"><CountUp value={s.payoff} format={v => v.toFixed(2)} className="num text-[26px] font-semibold tracking-tight" /><span className="text-ink3 text-sm">: 1</span></div>}
        </Kpi>
        <Kpi icon="sparkles" label="Expectancy" hint="Average net result per trade. Avg R uses each trade's initial stop." foot={s.avgR != null ? <>Avg <span className="num text-ink2">{rMult(s.avgR)}</span> over {s.rCount} trades with a stop</> : 'Add stops to see R'}>
          <CountUp value={s.expectancy} format={v => fmt(v, { signed: true })} className={cx('num text-[26px] font-semibold tracking-tight', tone(s.expectancy))} />
        </Kpi>
      </section>

      <RiskGrid s={s} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHead title={curve === 'pnl' ? 'Equity curve' : curve === 'r' ? 'Equity in R' : 'Account balance'}
            sub={curve === 'r' ? `Cumulative R over ${rEquity.length} trades with a known stop — the purest read of your edge` : curve === 'pnl' ? <>Cumulative net P&L · max drawdown <span className="num text-loss">{fmt(-s.maxDrawdown)}</span>{a.ddPct != null && <> (<span className="num">{pct(a.ddPct)}</span> of peak)</>}</> : 'Balance through time against net money deposited'}
            right={<div className="flex flex-wrap gap-2"><PeriodToggle value={curveP} onChange={setCurveP} /><Segmented label="Curve" size="sm" value={curve} onChange={setCurve} options={[{ value: 'pnl', label: '$ P&L' }, { value: 'r', label: 'R' }, { value: 'balance', label: 'Balance' }]} /></div>} />
          {curve === 'pnl' ? <EquityChart data={s.equity} fmt={fmt} height={280} period={curveP} /> : curve === 'r' ? <EquityChart data={rEquity} fmt={v => rMult(v, 1)} height={280} period={curveP} /> : a.balance.length ? <BalanceChart data={a.balance} fmt={fmt} height={280} period={curveP} /> : <div className="h-[280px] grid place-items-center text-sm text-ink3">Import a report with an account summary to see balance.</div>}
        </Card>

        <Card>
          {a.score ? (<>
            <CardHead title="Trader score" sub={`Based on ${s.total} trades`} right={<span className={cx('num text-[34px] font-semibold leading-none', a.score.score >= 70 ? 'text-profit' : a.score.score >= 50 ? 'text-warn' : 'text-loss')}><CountUp value={a.score.score} format={v => v.toFixed(0)} /></span>} />
            <ul className="flex flex-col gap-3.5">
              {a.score.axes.map(ax => (
                <li key={ax.key}>
                  <div className="flex justify-between text-[12.5px] mb-1.5"><span className="text-ink2 flex items-center gap-1.5">{ax.label}<InfoTip text={ax.hint} /></span><span className="num">{ax.value.toFixed(0)}</span></div>
                  <Bar value={ax.value / 100} tone={ax.value >= 70 ? 'profit' : ax.value >= 50 ? 'warn' : 'loss'} />
                </li>
              ))}
            </ul>
          </>) : (<>
            <CardHead title="Trader score" sub="Composite of edge, profit factor, payoff, drawdown and consistency" />
            <div className="py-6 text-center">
              <div className="num text-3xl font-semibold text-ink3">{s.total}/{MIN_SCORE_TRADES}</div>
              <p className="text-sm text-ink3 mt-2 max-w-[240px] mx-auto">Score unlocks at {MIN_SCORE_TRADES} trades — smaller samples mostly measure luck.</p>
              <Bar value={s.total / MIN_SCORE_TRADES} className="mt-4 max-w-[220px] mx-auto" />
            </div>
          </>)}
          <div className="grid grid-cols-2 gap-3 mt-5 pt-4 border-t border-line text-xs">
            <div><div className="text-ink3">Sharpe <span className="text-[10px]">(ann.)</span></div><div className="num text-sm mt-0.5">{a.sharpe != null ? a.sharpe.toFixed(2) : <span className="text-ink3">needs 20 days</span>}</div></div>
            <div><div className="text-ink3">Sortino</div><div className="num text-sm mt-0.5">{a.sortino != null ? a.sortino.toFixed(2) : <span className="text-ink3">needs 20 days</span>}</div></div>
            <div><div className="text-ink3">Streak</div><div className={cx('num text-sm mt-0.5', s.currentStreak.kind === 'win' ? 'text-profit' : s.currentStreak.kind === 'loss' ? 'text-loss' : '')}>{s.currentStreak.kind ? `${s.currentStreak.count} ${s.currentStreak.kind === 'win' ? 'win' : 'loss'}${s.currentStreak.count > 1 ? (s.currentStreak.kind === 'win' ? 's' : 'es') : ''}` : '—'}</div></div>
            <div><div className="text-ink3">Recovery factor</div><div className="num text-sm mt-0.5">{s.recoveryFactor?.toFixed(2) ?? '—'}</div></div>
          </div>
          {lowSample && <p className="text-[11px] text-warn mt-3">Small sample: treat every number here as provisional.</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card><MonthCalendar days={s.days} onDay={d => nav(`/journal?day=${d}`)} /></Card>
        <Card>
          <CardHead title="Setup performance" sub="Net result by setup tag — what actually pays you" right={<Link to="/reports?tab=setups" className="text-xs text-accent hover:underline inline-block py-2 -my-2">All setups</Link>} />
          <div>
            <table className="w-full table-fixed">
              <thead className="pillhead"><tr><th className="th pl-4">Setup</th><th className="th text-right w-14">Trades</th><th className="th text-right w-12">Win</th><th className="th text-right w-16 max-sm:hidden">Avg R</th><th className="th text-right w-24 pr-4">Net</th></tr></thead>
              <tbody>
                {a.setups.slice(0, 7).map(g => (
                  <tr key={g.key}>
                    <td className="td truncate"><span className={g.key.startsWith('(') ? 'text-ink3' : ''}>{g.key}</span></td>
                    <td className="td num text-right text-ink2">{g.n}</td>
                    <td className="td num text-right text-ink2">{pct(g.winRate, 0)}</td>
                    <td className="td num text-right text-ink2 max-sm:hidden">{rMult(g.avgR, 1)}</td>
                    <td className={cx('td num text-right font-semibold', tone(g.net))}>{fmt(g.net, { signed: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {a.setups.find(g => g.key === '(not journaled)') && <p className="text-xs text-ink3 mt-3">Tag trades with their setup in the trade view to see which setups carry your edge.</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card>
          <CardHead title="By symbol" sub={a.symbols.length > 12 && !allSyms ? `Best 6 and worst 6 of ${a.symbols.length}` : 'Every symbol, best to worst'}
            right={a.symbols.length > 12 ? <button className="text-xs text-accent hover:underline inline-block py-2 -my-2" onClick={() => setAllSyms(v => !v)}>{allSyms ? 'Show less' : 'Show all'}</button> : undefined} />
          <DivergingBars rows={(a.symbols.length > 12 && !allSyms ? [...a.symbols.slice(0, 6), ...a.symbols.slice(-6)] : a.symbols).map(g => ({ key: g.key, net: g.net, sub: `${g.n} trades · ${pct(g.winRate, 0)}` }))} fmt={v => fmt(v, { signed: true, compact: true })} onRow={k => nav(`/trades?symbol=${encodeURIComponent(k)}`)} />
        </Card>
        <Card>
          <CardHead title="By session" sub="Entry time (UTC): Asia 23–07, London 07–12, New York 12–21" />
          <div className="flex flex-col gap-3">
            {a.sessions.map(g => (
              <div key={g.key} className="grid grid-cols-[84px_1fr_auto] items-center gap-3 text-[13px]">
                <span className="text-ink2">{g.key}</span>
                <div className="h-6 rounded-md bg-raised overflow-hidden relative">
                  <motion.div className={cx('h-full rounded-md', g.net >= 0 ? 'bg-profit/70' : 'bg-loss/70')} initial={{ width: 0 }} animate={{ width: `${(Math.abs(g.net) / Math.max(1, ...a.sessions.map(x => Math.abs(x.net)))) * 100}%` }} transition={{ duration: 0.8 }} />
                  <span className="absolute inset-y-0 left-2 flex items-center text-[11px] text-ink">{g.n} · {pct(g.winRate, 0)}</span>
                </div>
                <span className={cx('num font-semibold w-[78px] text-right', tone(g.net))}>{fmt(g.net, { signed: true, compact: true })}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardHead title="Costly mistakes" sub="Net of trades tagged with each mistake" />
          {a.mistakes.length ? (
            <ul>
              {a.mistakes.slice(0, 5).map(g => (
                <li key={g.key} className="flex items-center justify-between py-2.5 border-t border-line first:border-0 text-[13px]">
                  <div><div>{g.key}</div><div className="text-[11.5px] text-ink3">{g.n} trades</div></div>
                  <span className={cx('num font-semibold', tone(g.net))}>{fmt(g.net, { signed: true })}</span>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-ink3 py-6 text-center">No mistakes tagged yet. Tag them on a trade to see what they cost.</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2">
          <CardHead title={`${PERIOD_NOUN[barP][0]} ${{ net: 'net P&L', r: 'R', win: 'win rate', n: 'trades' }[barM]}`} right={<div className="flex flex-wrap gap-2"><Segmented label="Metric" size="sm" value={barM} onChange={setBarM} options={[{ value: 'net', label: '$' }, { value: 'r', label: 'R' }, { value: 'win', label: 'Win %' }, { value: 'n', label: 'Trades' }]} /><PeriodToggle value={barP} onChange={setBarP} /></div>}
            sub={<>Green {PERIOD_NOUN[barP][2]} {greenB} · red {PERIOD_NOUN[barP][2]} {redB} · {PERIOD_NOUN[barP][1]} win rate <span className="num">{pct(greenB + redB ? greenB / (greenB + redB) : null, 0)}</span>{barP !== 'month' && <> · last {shown.length} {PERIOD_NOUN[barP][2]}</>}</>} />
          <DailyBars days={barP === 'day' ? daysR.slice(-60) : daysR.filter(d => !shown.length || d.date >= shown[0].date)} fmt={fmt} period={barP} metric={barM} />
        </Card>
        <Checklist />
      </div>

      <Card>
        <CardHead title="Recent trades" sub="Open any trade to journal it" right={<Link to="/trades" className="text-xs text-accent hover:underline inline-block py-2 -my-2">All trades</Link>} />
        {mobile ? <TradeList trades={recent} /> : (
        <div>
          <table className="w-full ">
            <thead className="pillhead"><tr><th className="th pl-4">Closed</th><th className="th">Symbol</th><th className="th">Side</th><th className="th">Setup</th><th className="th text-right">Hold</th><th className="th pl-5">Result</th><th className="th text-right">R</th><th className="th text-right pr-4">Net</th></tr></thead>
            <tbody>
              {recent.map(t => (
                <tr key={t.account + t.id} onClick={() => nav(`/trades/${t.id}`)} className="cursor-pointer hover:bg-raised/60 transition-colors">
                  <td className="td pl-4 num text-ink2">{shortDate(t.close)} {timeHM(t.close)}</td>
                  <td className="td"><Link to={`/trades/${t.id}`} className="font-mono font-medium hover:text-accent inline-block py-2 -my-2" onClick={e => e.stopPropagation()}>{t.sym}</Link></td>
                  <td className="td"><Badge tone={t.type === 'buy' ? 'profit' : 'loss'}>{t.type === 'buy' ? 'BUY' : 'SELL'}</Badge></td>
                  <td className="td text-ink2 truncate max-w-[180px]">{notes[t.id]?.tags?.join(', ') || <span className="text-ink3">—</span>}</td>
                  <td className="td num text-right text-ink2">{t.holdSec >= 3600 ? `${(t.holdSec / 3600).toFixed(1)}h` : `${Math.round(t.holdSec / 60)}m`}</td>
                  <td className="td pl-5"><Badge tone={t.net > 0 ? 'profit' : t.net < 0 ? 'loss' : 'neutral'}>{t.net > 0 ? 'WIN' : t.net < 0 ? 'LOSS' : 'BE'}</Badge></td>
                  <td className="td num text-right text-ink2">{rMult(t.r, 1)}</td>
                  <td className={cx('td num text-right font-semibold pr-4', tone(t.net))}>{fmt(t.net, { signed: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </Page>
  );
}
