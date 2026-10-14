import { motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import { Area, AreaChart, CartesianGrid, Line, ComposedChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAnalytics } from '@/data/derived';
import { money, num, pct, price } from '@/lib/format';
import { Card, CardHead, CountUp, cx, ease, Field, Segmented } from '@/ui/kit';
import { ChartTip, useAxisW, useColors } from '@/ui/charts';
import { Result, SourceNote, SymbolPicker, useAccountCcy, useSpec } from './calcShared';

const NumIn = ({ label, value, onChange, hint, step = 'any', suffix }: { label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; step?: string; suffix?: string }) => (
  <Field label={label} hint={hint}>
    <div className="relative">
      <input type="number" inputMode="decimal" step={step} className={cx('field num', suffix && 'pr-10')} value={value} onChange={e => onChange(e.target.value)} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink3 pointer-events-none">{suffix}</span>}
    </div>
  </Field>
);

const MarketToggle = ({ futures, set }: { futures: boolean; set: (f: boolean) => void }) => (
  <Segmented label="Market" size="sm" value={futures ? 'f' : 'c'} onChange={v => set(v === 'f')} options={[{ value: 'c', label: 'Forex / CFD' }, { value: 'f', label: 'Futures' }]} />
);

/** Big headline result that springs when it changes. */
function Hero({ label, value, format, tone, sub }: { label: string; value: number | null; format: (n: number) => string; tone?: string; sub?: ReactNode }) {
  return (
    <div>
      <div className="label">{label}</div>
      {value == null || !isFinite(value) ? <div className="num text-4xl font-semibold text-ink3 mt-1">—</div>
        : <CountUp value={value} format={format} className={cx('num text-4xl md:text-5xl font-semibold tracking-tight block mt-1', tone)} />}
      {sub && <div className="text-xs text-ink3 mt-1.5">{sub}</div>}
    </div>
  );
}

const Grid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">{children}</div>;

// ─── Profit / loss ───────────────────────────────────────────────────
export function PnlCalc() {
  const [futures, setFutures] = useState(false);
  const [symbol, setSymbol] = useState('XAUUSD');
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [lots, setLots] = useState('0.5');
  const [entry, setEntry] = useState('2650');
  const [exit, setExit] = useState('2665');
  const [stop, setStop] = useState('');
  const [fees, setFees] = useState('0');
  const s = useSpec(symbol, futures);
  const { spec, uv, ccy } = s;
  const dir = side === 'buy' ? 1 : -1;
  const move = (+exit - +entry) * dir;
  const gross = +entry && +exit ? move * uv.value * (+lots || 0) : null;
  const net = gross == null ? null : gross - (+fees || 0);
  const risk = +stop && +entry ? Math.abs(+entry - +stop) * uv.value * (+lots || 0) : null;
  const unitWord = futures ? 'ticks' : spec.assetClass === 'forex' || spec.assetClass === 'metal' ? 'pips' : 'points';
  const step = futures ? spec.tickSize : spec.pipSize;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Profit & loss" sub="What a trade made or would make, in your account currency" right={<MarketToggle futures={futures} set={f => { setFutures(f); setSymbol(f ? 'MNQ' : 'XAUUSD'); }} />} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Instrument" hint={spec.name}><SymbolPicker value={symbol} onChange={setSymbol} futures={futures} /></Field>
          <Field label="Direction"><Segmented label="Direction" value={side} onChange={setSide} options={[{ value: 'buy', label: 'Long' }, { value: 'sell', label: 'Short' }]} /></Field>
          <NumIn label={futures ? 'Contracts' : 'Lots'} value={lots} onChange={setLots} />
          <NumIn label={`Commission + swap (${ccy})`} value={fees} onChange={setFees} />
          <NumIn label="Entry price" value={entry} onChange={setEntry} />
          <NumIn label="Exit price" value={exit} onChange={setExit} />
          <NumIn label="Stop (optional, for R)" value={stop} onChange={setStop} />
        </div>
        <div className="mt-4"><SourceNote {...s} /></div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label="Net result" value={net} format={v => money(v, { ccy, signed: true })} tone={net == null ? '' : net >= 0 ? 'text-profit' : 'text-loss'} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Gross" value={money(gross, { ccy, signed: true })} />
          <Result label="Move" value={+entry && +exit ? `${num(move / step, 1)} ${unitWord}` : '—'} sub={+entry && +exit ? `${price(Math.abs(+exit - +entry), spec.digits)} in price` : undefined} />
          <Result label="R multiple" value={risk && net != null ? `${(net / risk).toFixed(2)}R` : '—'} sub={risk ? `Risked ${money(risk, { ccy })}` : 'Add a stop'} />
          <Result label="Return on notional" value={+entry && gross != null ? pct(gross / (uv.value * +entry * (+lots || 1)), 2) : '—'} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Margin ──────────────────────────────────────────────────────────
const LEVERAGE = ['1', '2', '5', '10', '20', '30', '50', '100', '200', '300', '500', '1000'];
export function MarginCalc() {
  const [futures, setFutures] = useState(false);
  const [symbol, setSymbol] = useState('EURUSD');
  const [lots, setLots] = useState('1');
  const [px, setPx] = useState('1.0850');
  const [lev, setLev] = useState('100');
  const [bal, setBal] = useState('10000');
  const s = useSpec(symbol, futures);
  const { spec, uv, ccy } = s;
  // Notional in account currency = value of a 1.0 move × price × size.
  const notional = +px ? uv.value * +px * (+lots || 0) : null;
  const margin = notional != null && +lev ? notional / +lev : null;
  const level = margin && +bal ? (+bal / margin) : null;
  const usedPct = margin && +bal ? margin / +bal : null;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Margin" sub="Collateral your broker holds to open the position" right={<MarketToggle futures={futures} set={f => { setFutures(f); setSymbol(f ? 'ES' : 'EURUSD'); setPx(f ? '5800' : '1.0850'); }} />} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Instrument" hint={spec.name}><SymbolPicker value={symbol} onChange={setSymbol} futures={futures} /></Field>
          <NumIn label={futures ? 'Contracts' : 'Lots'} value={lots} onChange={setLots} />
          <NumIn label="Price" value={px} onChange={setPx} />
          {futures ? <NumIn label={`Account balance (${ccy})`} value={bal} onChange={setBal} /> : (
            <Field label="Leverage">
              <select className="field num" value={lev} onChange={e => setLev(e.target.value)}>{LEVERAGE.map(l => <option key={l} value={l}>1:{l}</option>)}</select>
            </Field>
          )}
          {!futures && <NumIn label={`Account balance (${ccy})`} value={bal} onChange={setBal} />}
        </div>
        <p className="text-[11.5px] text-ink3 mt-4 leading-relaxed">{futures ? 'Futures margin is set by the exchange and your broker (day-trade margins are often far lower). Check your broker for the exact figure; the notional value below is exact.' : 'Prop firms and EU/UK brokers often cap leverage per asset class (e.g. 1:30 majors, 1:20 gold, 1:2 crypto).'}</p>
        <div className="mt-3"><SourceNote {...s} /></div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label={futures ? 'Notional value' : 'Required margin'} value={futures ? notional : margin} format={v => money(v, { ccy })} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          {!futures && <Result label="Notional value" value={money(notional, { ccy })} />}
          {!futures && <Result label="Margin level" value={level ? `${num(level * 100, 0)}%` : '—'} sub="Equity ÷ margin" />}
          {!futures && <Result label="Balance used" value={pct(usedPct, 1)} />}
          <Result label="Effective leverage" value={notional && +bal ? `${num(notional / +bal, 1)}×` : '—'} sub="Notional ÷ balance" />
        </div>
        {usedPct != null && !futures && (
          <div className="mt-5"><div className="h-2 rounded-full bg-line overflow-hidden"><motion.div className={cx('h-full rounded-full', usedPct > 0.5 ? 'bg-loss' : usedPct > 0.2 ? 'bg-warn' : 'bg-profit')} initial={{ width: 0 }} animate={{ width: `${Math.min(100, usedPct * 100)}%` }} transition={{ duration: 0.6, ease }} /></div></div>
        )}
      </Card>
    </Grid>
  );
}

// ─── Risk : reward ───────────────────────────────────────────────────
export function RRCalc() {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [entry, setEntry] = useState('2650');
  const [stop, setStop] = useState('2640');
  const [target, setTarget] = useState('2680');
  const e = +entry, sl = +stop, tp = +target;
  const risk = side === 'buy' ? e - sl : sl - e;
  const reward = side === 'buy' ? tp - e : e - tp;
  const valid = e > 0 && risk > 0 && reward > 0;
  const rr = valid ? reward / risk : null;
  const be = rr ? 1 / (1 + rr) : null;
  const total = valid ? risk + reward : 1;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Risk : reward" sub="Is the trade worth taking at your win rate?" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Direction"><Segmented label="Direction" value={side} onChange={setSide} options={[{ value: 'buy', label: 'Long' }, { value: 'sell', label: 'Short' }]} /></Field>
          <NumIn label="Entry" value={entry} onChange={setEntry} />
          <NumIn label="Stop loss" value={stop} onChange={setStop} />
          <NumIn label="Take profit" value={target} onChange={setTarget} />
        </div>
        {!valid && <p className="text-xs text-warn mt-3">For a {side === 'buy' ? 'long' : 'short'}, the stop must be {side === 'buy' ? 'below' : 'above'} entry and the target {side === 'buy' ? 'above' : 'below'} it.</p>}
        {valid && (
          <div className="mt-6">
            <div className="flex h-11 rounded-xl overflow-hidden text-[12px] font-semibold num">
              <motion.div className="bg-loss/85 text-white grid place-items-center" animate={{ flexGrow: risk / total }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} style={{ flexBasis: 0 }}>1R</motion.div>
              <div className="w-[3px] bg-ink" />
              <motion.div className="bg-profit/85 text-white grid place-items-center" animate={{ flexGrow: reward / total }} transition={{ type: 'spring', stiffness: 200, damping: 26 }} style={{ flexBasis: 0 }}>{rr!.toFixed(2)}R</motion.div>
            </div>
            <div className="flex justify-between text-[11px] text-ink3 mt-1.5 num"><span>{side === 'buy' ? stop : target}</span><span>entry {entry}</span><span>{side === 'buy' ? target : stop}</span></div>
          </div>
        )}
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label="Reward to risk" value={rr} format={v => `${v.toFixed(2)} : 1`} tone={rr == null ? '' : rr >= 2 ? 'text-profit' : rr >= 1 ? 'text-ink' : 'text-loss'} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Breakeven win rate" value={pct(be, 1)} sub="Win more often than this to profit" />
          <Result label="Risk / reward (price)" value={valid ? `${num(risk, 2)} / ${num(reward, 2)}` : '—'} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Compounding growth ──────────────────────────────────────────────
export function GrowthCalc() {
  const c = useColors();
  const yw = useAxisW();
  const ccy = useAccountCcy();
  const [start, setStart] = useState('10000');
  const [rateP, setRateP] = useState('2');
  const [periods, setPeriods] = useState('24');
  const [unit, setUnit] = useState<'day' | 'week' | 'month'>('month');
  const [add, setAdd] = useState('0');
  const [goal, setGoal] = useState('25000');
  const data = useMemo(() => {
    const r = (+rateP || 0) / 100, n = Math.min(1000, Math.max(0, Math.round(+periods || 0)));
    let bal = +start || 0, dep = +start || 0;
    const out = [{ p: 0, bal, dep }];
    for (let i = 1; i <= n; i++) { bal = bal * (1 + r) + (+add || 0); dep += +add || 0; out.push({ p: i, bal, dep }); }
    return out;
  }, [start, rateP, periods, add]);
  const end = data[data.length - 1];
  const r = (+rateP || 0) / 100;
  const toGoal = r > 0 && +goal > +start && !(+add) ? Math.ceil(Math.log(+goal / +start) / Math.log(1 + r)) : (() => { let b = +start || 0, i = 0; if (+goal <= b) return 0; while (b < +goal && i < 5000) { b = b * (1 + r) + (+add || 0); i++; } return i < 5000 ? i : null; })();
  const fmt = (v: number) => money(v, { ccy, compact: true });
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Compounding" sub="What steady returns turn into, with optional deposits" right={<Segmented label="Period" size="sm" value={unit} onChange={setUnit} options={[{ value: 'day', label: 'Daily' }, { value: 'week', label: 'Weekly' }, { value: 'month', label: 'Monthly' }]} />} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumIn label={`Start (${ccy})`} value={start} onChange={setStart} />
          <NumIn label={`Return per ${unit}`} value={rateP} onChange={setRateP} suffix="%" />
          <NumIn label={`${unit[0].toUpperCase() + unit.slice(1)}s`} value={periods} onChange={setPeriods} step="1" />
          <NumIn label={`Deposit per ${unit}`} value={add} onChange={setAdd} />
          <NumIn label={`Goal (${ccy})`} value={goal} onChange={setGoal} />
        </div>
        <div className="mt-6 -mx-1">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs><linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="p" tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis tickFormatter={fmt} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={yw} />
              {+goal > 0 && <ReferenceLine y={+goal} stroke={c.warn} strokeDasharray="4 4" />}
              <Tooltip content={<ChartTip fmt={v => money(v, { ccy })} labelFmt={l => `${unit} ${l}`} />} />
              <Area type="monotone" dataKey="bal" name="Balance" stroke={c.accent} strokeWidth={2.2} fill="url(#gFill)" animationDuration={900} />
              <Area type="monotone" dataKey="dep" name="Deposited" stroke={c.ink3} strokeDasharray="4 4" fill="none" animationDuration={900} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label="Final balance" value={end.bal} format={v => money(v, { ccy })} tone="text-ink" sub={`after ${data.length - 1} ${unit}s`} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Profit" value={money(end.bal - end.dep, { ccy, signed: true })} />
          <Result label="Total growth" value={pct(end.dep ? end.bal / end.dep - 1 : null, 0)} />
          <Result label="Reach goal in" value={toGoal == null ? 'never' : `${toGoal} ${unit}s`} />
          <Result label="Equivalent yearly" value={pct(Math.pow(1 + r, unit === 'month' ? 12 : unit === 'week' ? 52 : 252) - 1, 0)} sub={unit === 'day' ? '252 trading days' : undefined} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Drawdown recovery ───────────────────────────────────────────────
export function DrawdownCalc() {
  const c = useColors();
  const ccy = useAccountCcy();
  const [peak, setPeak] = useState('10000');
  const [now, setNow] = useState('8500');
  const dd = +peak > 0 && +now >= 0 && +now < +peak ? 1 - +now / +peak : 0;
  const need = dd < 1 ? dd / (1 - dd) : null;
  const curve = useMemo(() => Array.from({ length: 19 }, (_, i) => { const d = (i + 1) * 0.05; return { d: Math.round(d * 100), need: (d / (1 - d)) * 100 }; }), []);
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Drawdown recovery" sub="Losses are asymmetric: the deeper the hole, the steeper the climb" />
        <div className="grid grid-cols-2 gap-4">
          <NumIn label={`Peak balance (${ccy})`} value={peak} onChange={setPeak} />
          <NumIn label={`Balance now (${ccy})`} value={now} onChange={setNow} />
        </div>
        <div className="mt-6 -mx-1">
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={curve} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="d" tickFormatter={v => `${v}%`} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={16} />
              <YAxis scale="log" domain={[5, 2000]} allowDataOverflow tickFormatter={v => `${v}%`} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} width={48} ticks={[5, 25, 100, 400, 1900]} />
              <Tooltip content={<ChartTip fmt={v => `${v.toFixed(0)}% gain needed`} labelFmt={l => `${l}% drawdown`} />} />
              {dd > 0 && <ReferenceLine x={Math.min(95, Math.max(5, Math.round(dd * 20) * 5))} stroke={c.warn} strokeDasharray="4 4" />}
              <Line type="monotone" dataKey="need" name="Gain to recover" stroke={c.loss} strokeWidth={2.4} dot={false} animationDuration={900} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 mt-4">
          {[5, 10, 20, 30, 40, 50, 75, 90].map(d => <div key={d} className="rounded-lg bg-raised p-2 text-center"><div className="text-[10px] text-ink3">−{d}%</div><div className="num text-[12.5px] font-semibold text-loss">+{Math.round((d / (100 - d)) * 100)}%</div></div>)}
        </div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label="Gain needed to get back" value={need != null ? need * 100 : null} format={v => `${v.toFixed(1)}%`} tone={need != null && need > 0.25 ? 'text-loss' : 'text-ink'} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Current drawdown" value={pct(dd, 1)} />
          <Result label="Amount to recover" value={money(Math.max(0, +peak - +now), { ccy })} />
          <Result label="At 1% a day" value={need ? `${Math.ceil(Math.log(1 + need) / Math.log(1.01))} days` : '—'} />
          <Result label="At 2% a week" value={need ? `${Math.ceil(Math.log(1 + need) / Math.log(1.02))} weeks` : '—'} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Edge: expectancy, Kelly, risk of ruin (Monte Carlo) ─────────────
function simulate(win: number, payoff: number, riskPct: number, trades: number, ruinAt: number, runs = 1500) {
  const r = riskPct / 100;
  const paths: number[][] = Array.from({ length: trades + 1 }, () => []);
  let ruined = 0;
  let seed = 7;
  const rand = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; // deterministic, so results don't flicker
  for (let k = 0; k < runs; k++) {
    let eq = 1, dead = false;
    paths[0].push(1);
    for (let t = 1; t <= trades; t++) {
      if (!dead) { eq *= rand() < win ? 1 + r * payoff : 1 - r; if (eq <= 1 - ruinAt) { dead = true; ruined++; } }
      paths[t].push(eq);
    }
  }
  const q = (xs: number[], p: number) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(p * (s.length - 1))]; };
  return { ruin: ruined / runs, band: paths.map((xs, t) => ({ t, p5: (q(xs, 0.05) - 1) * 100, p50: (q(xs, 0.5) - 1) * 100, p95: (q(xs, 0.95) - 1) * 100, band: [(q(xs, 0.05) - 1) * 100, (q(xs, 0.95) - 1) * 100] as [number, number] })) };
}

export function EdgeCalc() {
  const c = useColors();
  const { stats } = useAnalytics();
  const [win, setWin] = useState('50');
  const [payoff, setPayoff] = useState('1.5');
  const [risk, setRisk] = useState('1');
  const [n, setN] = useState('200');
  const [ruinAt, setRuinAt] = useState('20');
  const w = Math.min(1, Math.max(0, (+win || 0) / 100)), b = Math.max(0, +payoff || 0);
  const exp = w * b - (1 - w);
  const kelly = b > 0 ? w - (1 - w) / b : null;
  const be = b > 0 ? 1 / (1 + b) : null;
  const sim = useMemo(() => simulate(w, b, Math.max(0, +risk || 0), Math.min(1000, Math.max(10, Math.round(+n || 0))), Math.min(0.99, Math.max(0.01, (+ruinAt || 20) / 100))), [w, b, risk, n, ruinAt]);
  const mine = stats.total >= 10 && stats.payoff != null;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Edge & risk of ruin" sub="1,500 simulated futures of your stats — the band is the middle 90% of outcomes"
          right={mine ? <button className="btn h-8 text-xs" onClick={() => { setWin((stats.winRate * 100).toFixed(1)); setPayoff(stats.payoff!.toFixed(2)); }}>Use my stats</button> : undefined} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumIn label="Win rate" value={win} onChange={setWin} suffix="%" />
          <NumIn label="Avg win ÷ avg loss" value={payoff} onChange={setPayoff} hint="Payoff ratio (R per win)" />
          <NumIn label="Risk per trade" value={risk} onChange={setRisk} suffix="%" />
          <NumIn label="Trades" value={n} onChange={setN} step="10" />
          <NumIn label="Ruin = drawdown of" value={ruinAt} onChange={setRuinAt} suffix="%" hint="e.g. a prop firm's max loss" />
        </div>
        <div className="mt-6 -mx-1">
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={sim.band} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs><linearGradient id="bandFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={exp >= 0 ? c.profit : c.loss} stopOpacity={0.28} /><stop offset="100%" stopColor={exp >= 0 ? c.profit : c.loss} stopOpacity={0.06} /></linearGradient></defs>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis tickFormatter={v => `${Math.round(v)}%`} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} width={48} />
              <ReferenceLine y={0} stroke={c.line2} />
              <ReferenceLine y={-(+ruinAt || 20)} stroke={c.loss} strokeDasharray="4 4" />
              <Tooltip content={<ChartTip fmt={(v, k) => (k === 'band' ? '' : `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`)} labelFmt={l => `After ${l} trades`} />} />
              <Area type="monotone" dataKey="band" name="5–95%" stroke="none" fill="url(#bandFill)" animationDuration={900} />
              <Line type="monotone" dataKey="p50" name="Median" stroke={exp >= 0 ? c.profit : c.loss} strokeWidth={2.4} dot={false} animationDuration={900} />
              <Line type="monotone" dataKey="p5" name="Worst 5%" stroke={c.ink3} strokeWidth={1} strokeDasharray="3 4" dot={false} animationDuration={900} />
              <Line type="monotone" dataKey="p95" name="Best 5%" stroke={c.ink3} strokeWidth={1} strokeDasharray="3 4" dot={false} animationDuration={900} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label="Risk of ruin" value={sim.ruin * 100} format={v => `${v.toFixed(1)}%`} tone={sim.ruin > 0.1 ? 'text-loss' : sim.ruin > 0.02 ? 'text-warn' : 'text-profit'} sub={`Chance of a ${ruinAt}% drawdown within ${n} trades`} />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Expectancy" value={`${exp >= 0 ? '+' : ''}${exp.toFixed(2)}R`} sub="Per trade" />
          <Result label="Breakeven win rate" value={pct(be, 1)} />
          <Result label="Kelly fraction" value={kelly == null ? '—' : kelly <= 0 ? 'No edge' : pct(kelly, 1)} sub={kelly && kelly > 0 ? `Half-Kelly ${pct(kelly / 2, 1)}` : undefined} />
          <Result label="Median outcome" value={`${sim.band[sim.band.length - 1].p50 >= 0 ? '+' : ''}${sim.band[sim.band.length - 1].p50.toFixed(1)}%`} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Pivot points & Fibonacci ────────────────────────────────────────
export function LevelsCalc() {
  const [h, setH] = useState('2672.40');
  const [l, setL] = useState('2638.10');
  const [cl, setCl] = useState('2661.80');
  const [kind, setKind] = useState<'classic' | 'fib' | 'camarilla' | 'woodie'>('classic');
  const [dir, setDir] = useState<'up' | 'down'>('up');
  const H = +h, L = +l, C = +cl, R = H - L;
  const dp = Math.min(5, Math.max(2, (h.split('.')[1] ?? '').length));
  const piv = useMemo(() => {
    if (!(H > L) || !C) return [];
    if (kind === 'camarilla') return [['R4', C + R * 1.1 / 2], ['R3', C + R * 1.1 / 4], ['R2', C + R * 1.1 / 6], ['R1', C + R * 1.1 / 12], ['PP', (H + L + C) / 3], ['S1', C - R * 1.1 / 12], ['S2', C - R * 1.1 / 6], ['S3', C - R * 1.1 / 4], ['S4', C - R * 1.1 / 2]] as [string, number][];
    const P = kind === 'woodie' ? (H + L + 2 * C) / 4 : (H + L + C) / 3;
    if (kind === 'fib') return [['R3', P + R], ['R2', P + 0.618 * R], ['R1', P + 0.382 * R], ['PP', P], ['S1', P - 0.382 * R], ['S2', P - 0.618 * R], ['S3', P - R]] as [string, number][];
    return [['R3', H + 2 * (P - L)], ['R2', P + R], ['R1', 2 * P - L], ['PP', P], ['S1', 2 * P - H], ['S2', P - R], ['S3', L - 2 * (H - P)]] as [string, number][];
  }, [H, L, C, R, kind]);
  const fib = useMemo(() => {
    if (!(H > L)) return [];
    // Retracements measured back from the swing's end; extensions projected past it.
    const ret = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1].map(f => ({ label: `${(f * 100).toFixed(1)}%`, f, p: dir === 'up' ? H - R * f : L + R * f }));
    const ext = [1.272, 1.618, 2.618].map(f => ({ label: `${(f * 100).toFixed(1)}% ext`, f, p: dir === 'up' ? L + R * f : H - R * f }));
    return [...ext, ...ret].sort((a, b) => b.p - a.p);
  }, [H, L, R, dir]);
  const Row = ({ k, v, i, accent }: { k: string; v: number; i: number; accent?: string }) => (
    <motion.li initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="flex items-center justify-between py-2 border-t border-line first:border-0 text-[13px]">
      <span className={cx('font-semibold', accent)}>{k}</span><span className="num">{price(v, dp)}</span>
    </motion.li>
  );
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Card>
        <CardHead title="Pivot points" sub="From the previous session's high, low and close" />
        <div className="grid grid-cols-3 gap-3"><NumIn label="High" value={h} onChange={setH} /><NumIn label="Low" value={l} onChange={setL} /><NumIn label="Close" value={cl} onChange={setCl} /></div>
        <div className="mt-4"><Segmented label="Method" size="sm" value={kind} onChange={setKind} options={[{ value: 'classic', label: 'Classic' }, { value: 'fib', label: 'Fibonacci' }, { value: 'camarilla', label: 'Camarilla' }, { value: 'woodie', label: 'Woodie' }]} /></div>
        <ul key={kind} className="mt-4">{piv.map(([k, v], i) => <Row key={k} k={k} v={v} i={i} accent={k.startsWith('R') ? 'text-loss' : k.startsWith('S') ? 'text-profit' : 'text-accent'} />)}</ul>
      </Card>
      <Card>
        <CardHead title="Fibonacci" sub="Retracements and extensions of the swing above" right={<Segmented label="Swing" size="sm" value={dir} onChange={setDir} options={[{ value: 'up', label: 'Up swing' }, { value: 'down', label: 'Down swing' }]} />} />
        <ul key={dir}>{fib.map(({ label, f, p }, i) => <Row key={label} k={label} v={p} i={i} accent={[0.5, 0.618].includes(f) ? 'text-warn' : label.includes('ext') ? 'text-accent' : f === 0 || f === 1 ? 'text-ink' : 'text-ink2'} />)}</ul>
      </Card>
    </div>
  );
}
