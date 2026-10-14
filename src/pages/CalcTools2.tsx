import { motion } from 'framer-motion';
import { useMemo, useState, type ReactNode } from 'react';
import { Area, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useAnalytics } from '@/data/derived';
import { blackScholes, payoffAtExpiry, PRESETS, valueNow, type Leg } from '@/core/options';
import { monteCarlo, PROP_PRESETS, propSim, recoverySim, type PropPhase } from '@/core/sim';
import { money, num, pct } from '@/lib/format';
import { Card, CardHead, CountUp, cx, ease, Field, Segmented } from '@/ui/kit';
import { ChartTip, useAxisW, useColors } from '@/ui/charts';
import { Icon } from '@/ui/Icon';
import { Result, useAccountCcy } from './calcShared';

const NumIn = ({ label, value, onChange, hint, step = 'any', suffix }: { label: string; value: string; onChange: (v: string) => void; hint?: ReactNode; step?: string; suffix?: string }) => (
  <Field label={label} hint={hint}>
    <div className="relative">
      <input type="number" inputMode="decimal" step={step} className={cx('field num', suffix && 'pr-10')} value={value} onChange={e => onChange(e.target.value)} />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink3 pointer-events-none">{suffix}</span>}
    </div>
  </Field>
);

function Hero({ label, value, format, tone, sub, small }: { label: string; value: number | null; format: (n: number) => string; tone?: string; sub?: ReactNode; small?: boolean }) {
  return (
    <div>
      <div className="label">{label}</div>
      {value == null || !isFinite(value) ? <div className="num text-4xl font-semibold text-ink3 mt-1">—</div>
        : <CountUp value={value} format={format} className={cx('num font-semibold tracking-tight block mt-1', small ? 'text-2xl md:text-[28px]' : 'text-4xl md:text-5xl', tone)} />}
      {sub && <div className="text-xs text-ink3 mt-1.5">{sub}</div>}
    </div>
  );
}

/** Animated probability ring. */
function Gauge({ value, label, tone }: { value: number; label: string; tone: string }) {
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div className="relative w-[132px] h-[132px] shrink-0">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="9" />
        <motion.circle cx="60" cy="60" r={R} fill="none" stroke={`rgb(var(--${tone}))`} strokeWidth="9" strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - Math.max(0, Math.min(1, value))) }} transition={{ duration: 1.1, ease }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div><CountUp value={value * 100} format={v => `${v.toFixed(0)}%`} className="num text-[28px] font-semibold tracking-tight block leading-none" /><div className="text-[10.5px] text-ink3 mt-1">{label}</div></div>
      </div>
    </div>
  );
}

const Grid = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">{children}</div>;

// ─── Monte Carlo simulator ───────────────────────────────────────────
export function MonteCarloCalc() {
  const c = useColors();
  const yw = useAxisW();
  const ccy = useAccountCcy();
  const { stats } = useAnalytics();
  const [mode, setMode] = useState<'fixed' | 'pct'>('fixed');
  const [start, setStart] = useState('10000');
  const [win, setWin] = useState('50');
  const [avgWin, setAvgWin] = useState('150');
  const [avgLoss, setAvgLoss] = useState('100');
  const [risk, setRisk] = useState('1');
  const [trades, setTrades] = useState('200');
  const [ruin, setRuin] = useState('50');
  const res = useMemo(() => monteCarlo({
    start: +start || 0, trades: Math.min(1000, Math.max(10, +trades || 0)), runs: 1000, win: Math.min(1, Math.max(0, (+win || 0) / 100)),
    mode, avgWin: Math.max(0, +avgWin || 0), avgLoss: Math.max(0, +avgLoss || 0), riskPct: (+risk || 0) / 100, ruinLevel: (+start || 0) * (1 - (+ruin || 50) / 100), samples: 36,
  }), [start, trades, win, mode, avgWin, avgLoss, risk, ruin]);
  const data = useMemo(() => res.bands.map((b, t) => {
    const row: Record<string, number | [number, number]> = { t, p50: b.p50, band: [b.p5, b.p95], iqr: [b.p25, b.p75] };
    res.samples.forEach((s, k) => { row[`s${k}`] = s[t]; });
    return row;
  }), [res]);
  const exp = res.expectancy;
  const fmtC = (v: number) => money(v, { ccy, compact: true });
  const mine = stats.total >= 10;
  const medFinal = res.bands[res.bands.length - 1].p50;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Monte Carlo simulator" sub="1,000 randomised equity curves from your edge. Thin lines are individual runs; the band holds 90% of outcomes."
          right={mine ? <button className="btn h-8 text-xs" onClick={() => { setWin((stats.winRate * 100).toFixed(1)); setAvgWin(stats.avgWin.toFixed(2)); setAvgLoss(Math.abs(stats.avgLoss).toFixed(2)); setMode('fixed'); }}><Icon name="sparkles" size={13} />Use my stats</button> : undefined} />
        <div className="mb-4"><Segmented label="Sizing" size="sm" value={mode} onChange={setMode} options={[{ value: 'fixed', label: `Fixed ${ccy}` }, { value: 'pct', label: '% of balance' }]} /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumIn label={`Starting balance`} value={start} onChange={setStart} />
          <NumIn label="Win rate" value={win} onChange={setWin} suffix="%" />
          <NumIn label="Trades" value={trades} onChange={setTrades} step="10" />
          <NumIn label={`Average win (${ccy})`} value={avgWin} onChange={setAvgWin} />
          <NumIn label={`Average loss (${ccy})`} value={avgLoss} onChange={setAvgLoss} />
          {mode === 'pct' ? <NumIn label="Risk per trade" value={risk} onChange={setRisk} suffix="%" hint="Win/loss sizes set the payoff ratio" /> : <NumIn label="Blown at drawdown" value={ruin} onChange={setRuin} suffix="%" />}
        </div>
        <div className="mt-6 -mx-1">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs><linearGradient id="mcBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={exp >= 0 ? c.profit : c.loss} stopOpacity={0.2} /><stop offset="100%" stopColor={exp >= 0 ? c.profit : c.loss} stopOpacity={0.04} /></linearGradient></defs>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="t" tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis tickFormatter={fmtC} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={yw} domain={['auto', 'auto']} />
              <ReferenceLine y={+start} stroke={c.line2} strokeDasharray="3 4" />
              <Area type="monotone" dataKey="band" stroke="none" fill="url(#mcBand)" isAnimationActive={false} />
              {res.samples.map((_, k) => <Line key={k} type="linear" dataKey={`s${k}`} stroke={c.a(k % 3 ? 'accent' : 'violet', 0.22)} strokeWidth={1} dot={false} isAnimationActive animationDuration={700 + k * 18} />)}
              <Line type="monotone" dataKey="p50" name="Median" stroke={exp >= 0 ? c.profit : c.loss} strokeWidth={2.6} dot={false} animationDuration={1200} />
              <Tooltip content={<ChartTip fmt={(v, k) => (k === 'p50' ? money(v, { ccy }) : '')} labelFmt={l => `After ${l} trades`} />} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <div className="flex items-center gap-5">
          <Gauge value={res.pProfit} label="end in profit" tone={res.pProfit >= 0.6 ? 'profit' : res.pProfit >= 0.4 ? 'warn' : 'loss'} />
          <div className="min-w-0">
            <div className="label">Median balance</div>
            <div className={cx('num text-2xl font-semibold mt-1', medFinal >= +start ? 'text-profit' : 'text-loss')}>{money(medFinal, { ccy })}</div>
            <div className="text-xs text-ink3 mt-1">after {trades} trades</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Expectancy" value={mode === 'fixed' ? money(exp, { ccy, signed: true }) : `${((+win / 100) * (+avgWin / (+avgLoss || 1)) - (1 - +win / 100)).toFixed(2)}R`} sub="Per trade" />
          <Result label="Blow-up risk" value={pct(res.pRuin, 1)} sub={`Falls ${ruin}% below start`} />
          <Result label="Worst 5% ends at" value={money(res.bands[res.bands.length - 1].p5, { ccy })} />
          <Result label="Best 5% ends at" value={money(res.bands[res.bands.length - 1].p95, { ccy })} />
          <Result label="Typical max drawdown" value={pct(res.maxDDs.length ? [...res.maxDDs].sort((a, b) => a - b)[Math.floor(res.maxDDs.length / 2)] : null, 1)} sub="Median of all runs" />
          <Result label="Kelly fraction" value={res.kelly == null ? '—' : res.kelly <= 0 ? 'No edge' : pct(res.kelly, 1)} sub={res.kelly && res.kelly > 0 ? `Half-Kelly ${pct(res.kelly / 2, 1)} risk` : 'Optimal risk per trade'} />
        </div>
      </Card>
    </Grid>
  );
}

// ─── Drawdown recovery (Monte Carlo) ─────────────────────────────────
export function RecoverySim({ now, peak }: { now: number; peak: number }) {
  const c = useColors();
  const [win, setWin] = useState('50');
  const [payoff, setPayoff] = useState('1.5');
  const [risk, setRisk] = useState('1');
  const [blow, setBlow] = useState('50');
  const res = useMemo(() => recoverySim({ now, peak, win: (+win || 0) / 100, payoff: +payoff || 0, riskPct: (+risk || 0) / 100, maxTrades: 2000, blowLevel: now * (1 - (+blow || 50) / 100), runs: 1500 }), [now, peak, win, payoff, risk, blow]);
  const hist = useMemo(() => {
    if (!res.hits.length) return [];
    const max = Math.max(...res.hits), w = Math.max(1, Math.ceil(max / 24));
    const bins = Array.from({ length: Math.ceil(max / w) + 1 }, (_, i) => ({ t: i * w, n: 0 }));
    for (const h of res.hits) bins[Math.floor(h / w)].n++;
    return bins;
  }, [res]);
  if (!(peak > now && now > 0)) return <p className="text-sm text-ink3">Enter a balance below the peak to simulate the climb back.</p>;
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <NumIn label="Win rate" value={win} onChange={setWin} suffix="%" />
        <NumIn label="Payoff (avg win ÷ loss)" value={payoff} onChange={setPayoff} />
        <NumIn label="Risk per trade" value={risk} onChange={setRisk} suffix="%" />
        <NumIn label="Blow-out at a further" value={blow} onChange={setBlow} suffix="%" />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[['Recover', res.pRecover, 'profit'], ['Blow out', res.pBlow, 'loss'], ['Still stuck', res.pStuck, 'warn']].map(([l, v, t]) => (
          <div key={l as string} className="rounded-xl bg-raised/70 border border-line p-3">
            <div className="text-[11px] text-ink3">{l as string}</div>
            <div className={`num text-xl font-semibold text-${t}`}>{pct(v as number, 1)}</div>
            <div className="h-1.5 rounded-full bg-line mt-2 overflow-hidden"><motion.div className={`h-full rounded-full bg-${t}`} initial={{ width: 0 }} animate={{ width: `${(v as number) * 100}%` }} transition={{ duration: 0.8, ease }} /></div>
          </div>
        ))}
      </div>
      {hist.length > 0 && (
        <div className="mt-5">
          <div className="text-xs text-ink3 mb-2">Trades needed to get back to the peak — median <b className="num text-ink">{Math.round(res.median!)}</b>, 9 in 10 within <b className="num text-ink">{Math.round(res.p90!)}</b></div>
          <div className="flex items-end gap-[3px] h-24">
            {hist.map((b, i) => (
              <motion.div key={i} className="flex-1 rounded-t-[3px] bg-accent/70" title={`${b.t}+ trades: ${b.n} runs`} initial={{ height: 0 }} animate={{ height: `${(b.n / Math.max(...hist.map(x => x.n))) * 100}%` }} transition={{ duration: 0.6, ease, delay: i * 0.015 }}
                style={{ background: i * (hist[1]?.t ?? 1) <= (res.median ?? 0) ? c.accent : c.a('accent', 0.4) }} />
            ))}
          </div>
          <div className="flex justify-between text-[10.5px] text-ink3 num mt-1"><span>0</span><span>{hist[hist.length - 1].t} trades</span></div>
        </div>
      )}
    </div>
  );
}

// ─── Prop firm challenge ─────────────────────────────────────────────
export function PropCalc() {
  const ccy = useAccountCcy();
  const { stats } = useAnalytics();
  const [preset, setPreset] = useState(PROP_PRESETS[0].id);
  const base = PROP_PRESETS.find(p => p.id === preset)!;
  const [phases, setPhases] = useState<PropPhase[]>(base.phases);
  const [size, setSize] = useState('100000');
  const [fee, setFee] = useState('540');
  const [split, setSplit] = useState(String(base.split * 100));
  const [win, setWin] = useState('50');
  const [payoff, setPayoff] = useState('1.5');
  const [risk, setRisk] = useState('0.5');
  const [tpd, setTpd] = useState('2');
  const pick = (id: string) => { const p = PROP_PRESETS.find(x => x.id === id)!; setPreset(id); setPhases(p.phases); setSplit(String(p.split * 100)); if (id === 'topstep') { setSize('50000'); setFee('49'); } else if (+size === 50000) setSize('100000'); };
  const res = useMemo(() => propSim({ size: +size || 0, phases, tradesPerDay: Math.max(1, Math.round(+tpd || 1)), win: (+win || 0) / 100, payoff: +payoff || 0, riskPct: (+risk || 0) / 100, split: (+split || 0) / 100, fee: +fee || 0, fundedDays: 20, runs: 500 }),
    [size, phases, tpd, win, payoff, risk, split, fee]);
  const setPh = (i: number, k: keyof PropPhase, v: number | null | boolean) => setPhases(ps => ps.map((p, j) => (j === i ? { ...p, [k]: v } : p)));
  const mine = stats.total >= 10 && stats.payoff != null;
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Would you pass the challenge?" sub="500 simulated attempts under the firm's rules, then one funded month" right={mine ? <button className="btn h-8 text-xs" onClick={() => { setWin((stats.winRate * 100).toFixed(1)); setPayoff(stats.payoff!.toFixed(2)); }}><Icon name="sparkles" size={13} />Use my stats</button> : undefined} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
          {PROP_PRESETS.map(p => (
            <button key={p.id} type="button" onClick={() => pick(p.id)} className={cx('rounded-xl border px-3 py-2.5 text-left transition-colors', preset === p.id ? 'border-accent bg-accent/10' : 'border-line hover:border-line2 bg-raised/40')}>
              <div className="text-[13px] font-semibold leading-tight">{p.name}</div>
              <div className="text-[10.5px] text-ink3 mt-0.5 leading-snug">{p.note}</div>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NumIn label={`Account (${ccy})`} value={size} onChange={setSize} />
          <NumIn label={`Fee (${ccy})`} value={fee} onChange={setFee} />
          <NumIn label="Profit split" value={split} onChange={setSplit} suffix="%" />
          <NumIn label="Trades per day" value={tpd} onChange={setTpd} step="1" />
          <NumIn label="Win rate" value={win} onChange={setWin} suffix="%" />
          <NumIn label="Payoff (R per win)" value={payoff} onChange={setPayoff} />
          <NumIn label="Risk per trade" value={risk} onChange={setRisk} suffix="%" />
        </div>
        <div className="mt-5 flex flex-col gap-2">
          {phases.map((p, i) => (
            <div key={i} className="rounded-xl border border-line bg-raised/40 p-3">
              <div className="label mb-2">{phases.length > 1 ? `Phase ${i + 1}` : 'Evaluation'}</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <NumIn label="Target" value={String(+(p.target * 100).toFixed(2))} onChange={v => setPh(i, 'target', (+v || 0) / 100)} suffix="%" />
                <NumIn label="Daily loss" value={p.dailyLoss == null ? '' : String(+(p.dailyLoss * 100).toFixed(2))} onChange={v => setPh(i, 'dailyLoss', v === '' ? null : (+v || 0) / 100)} suffix="%" hint={p.dailyLoss == null ? 'None' : undefined} />
                <NumIn label={p.trailing ? 'Max loss (trailing)' : 'Max loss'} value={String(+(p.maxLoss * 100).toFixed(2))} onChange={v => setPh(i, 'maxLoss', (+v || 0) / 100)} suffix="%" />
                <NumIn label="Min days" value={String(p.minDays)} onChange={v => setPh(i, 'minDays', Math.max(0, Math.round(+v || 0)))} step="1" />
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11.5px] text-ink3 mt-3">Presets are starting points — firms change rules often, so check yours. Daily loss is measured from each day's starting balance; trailing max loss follows the best end-of-day balance and stops at the starting balance.</p>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20 luxe-border">
        <div className="flex items-center gap-5 min-w-0">
          <Gauge value={res.pPass} label="pass probability" tone={res.pPass >= 0.5 ? 'profit' : res.pPass >= 0.25 ? 'warn' : 'loss'} />
          <Hero small label="Expected value" value={res.ev} format={v => money(v, { ccy, signed: true })} tone={res.ev >= 0 ? 'text-profit' : 'text-loss'} sub="Payout × split − fee, per attempt" />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Days to pass" value={res.medianDays != null ? `${Math.round(res.medianDays)} days` : '—'} sub="Median of passing runs" />
          <Result label="Drawdown on the way" value={pct(res.maxDDPassed, 1)} sub="Median, passing runs" />
          <Result label="Avg first payout" value={money(res.avgPayout, { ccy })} sub="Across all attempts" />
          <Result label="Return on fee" value={+fee ? `${num(res.avgPayout / +fee, 1)}×` : '—'} sub="Avg payout ÷ fee" />
        </div>
        <div className="mt-5 pt-5 border-t border-line">
          <div className="label mb-2">Why attempts fail</div>
          {([['Daily loss limit', res.fails.daily], ['Max loss', res.fails.max], ['Ran out of time', res.fails.time]] as [string, number][]).map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 text-[12.5px] py-1">
              <span className="w-32 text-ink2">{k}</span>
              <div className="flex-1 h-2 rounded-full bg-line overflow-hidden"><motion.div className="h-full bg-loss/80 rounded-full" initial={{ width: 0 }} animate={{ width: `${v * 100}%` }} transition={{ duration: 0.7, ease }} /></div>
              <span className="num w-12 text-right">{pct(v, 0)}</span>
            </div>
          ))}
          {phases.length > 1 && <div className="text-[11.5px] text-ink3 mt-2">Phase pass rates: {res.phasePass.map((p, i) => `P${i + 1} ${pct(p, 0)}`).join(' · ')}</div>}
        </div>
      </Card>
    </Grid>
  );
}

// ─── Options profit ──────────────────────────────────────────────────
export function OptionsCalc() {
  const c = useColors();
  const yw = useAxisW();
  const [spot, setSpot] = useState('100');
  const [days, setDays] = useState('30');
  const [iv, setIv] = useState('25');
  const [rate, setRate] = useState('4');
  const [preset, setPreset] = useState('bcs');
  const [legs, setLegs] = useState<Leg[] | null>(null);
  const S = +spot || 0, T = Math.max(0, +days || 0) / 365, v = Math.max(0.0001, (+iv || 0) / 100), r = (+rate || 0) / 100;
  const width = useMemo(() => { const w = S * 0.05; const mag = Math.pow(10, Math.floor(Math.log10(Math.max(w, 1e-9)))); return Math.max(mag, Math.round(w / mag) * mag); }, [S]);
  const strike0 = useMemo(() => { const m = Math.pow(10, Math.floor(Math.log10(Math.max(S, 1e-9))) - 1); return Math.round(S / m) * m; }, [S]);
  const active: Leg[] = useMemo(() => legs ?? PRESETS.find(p => p.id === preset)!.legs(strike0, width).map(l => ({ ...l, premium: l.kind === 'stock' ? 0 : +blackScholes(l.kind, S, l.strike, T, r, v).price.toFixed(2) })), [legs, preset, strike0, width, S, T, r, v]);
  const pickPreset = (id: string) => { setPreset(id); setLegs(null); };
  const edit = (i: number, patch: Partial<Leg>) => setLegs(active.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  const MULT = 100;
  const curve = useMemo(() => {
    if (!S) return [];
    const strikes = active.filter(l => l.kind !== 'stock').map(l => l.strike);
    const lo = Math.max(0, Math.min(S * 0.7, ...strikes.map(k => k * 0.85))), hi = Math.max(S * 1.3, ...strikes.map(k => k * 1.15));
    return Array.from({ length: 121 }, (_, i) => { const x = lo + ((hi - lo) * i) / 120; return { x, exp: payoffAtExpiry(active, x, S) * MULT, now: valueNow(active, x, S, T, r, v) * MULT }; });
  }, [active, S, T, r, v]);
  const net = active.reduce((a, l) => a + (l.kind === 'stock' ? -l.side * l.qty * S : -l.side * l.qty * l.premium), 0) * MULT;
  const ys = curve.map(p => p.exp);
  const slopeR = curve.length > 2 ? ys[ys.length - 1] - ys[ys.length - 2] : 0;
  // The right tail can run forever (unlimited); the left stops at a price of zero.
  const at0 = S ? payoffAtExpiry(active, 0, S) * MULT : 0;
  const maxP = slopeR > 1e-6 ? Infinity : Math.max(at0, ...ys), maxL = slopeR < -1e-6 ? -Infinity : Math.min(at0, ...ys);
  const bes: number[] = [];
  for (let i = 1; i < curve.length; i++) { const a = curve[i - 1], b = curve[i]; if ((a.exp < 0 && b.exp >= 0) || (a.exp >= 0 && b.exp < 0)) bes.push(a.x + ((0 - a.exp) / (b.exp - a.exp)) * (b.x - a.x)); }
  const g = active.reduce((acc, l) => {
    if (l.kind === 'stock') return { ...acc, delta: acc.delta + l.side * l.qty };
    const x = blackScholes(l.kind, S, l.strike, T, r, v);
    return { delta: acc.delta + l.side * l.qty * x.delta, gamma: acc.gamma + l.side * l.qty * x.gamma, theta: acc.theta + l.side * l.qty * x.theta, vega: acc.vega + l.side * l.qty * x.vega };
  }, { delta: 0, gamma: 0, theta: 0, vega: 0 });
  const fmtUsd = (n: number) => (n === Infinity ? 'Unlimited' : n === -Infinity ? 'Unlimited' : money(n, { signed: true }));
  return (
    <Grid>
      <Card className="lg:col-span-3">
        <CardHead title="Option profit" sub="Black–Scholes pricing, P&L at expiry (solid) and today (dashed). One contract = 100 shares." />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <NumIn label="Underlying price" value={spot} onChange={v2 => { setSpot(v2); setLegs(null); }} />
          <NumIn label="Days to expiry" value={days} onChange={setDays} step="1" />
          <NumIn label="Implied vol" value={iv} onChange={setIv} suffix="%" />
          <NumIn label="Interest rate" value={rate} onChange={setRate} suffix="%" />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-4">
          {PRESETS.map(p => <button key={p.id} type="button" onClick={() => pickPreset(p.id)} className={cx('chip h-8 px-3 text-[12.5px]', preset === p.id && !legs && 'border-accent text-accent bg-accent/10')}>{p.name}</button>)}
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {active.map((l, i) => (
            <div key={i} className="grid grid-cols-[auto_auto_1fr_1fr_1fr] gap-2 items-end">
              <button type="button" className={cx('btn h-9 w-14 px-0 text-xs font-semibold', l.side === 1 ? 'text-profit' : 'text-loss')} onClick={() => edit(i, { side: l.side === 1 ? -1 : 1 })}>{l.side === 1 ? 'BUY' : 'SELL'}</button>
              <span className="h-9 px-2 grid place-items-center rounded-lg bg-raised text-xs font-semibold uppercase w-14">{l.kind}</span>
              {l.kind === 'stock' ? <span className="text-xs text-ink3 self-center col-span-2">100 shares at {spot}</span> : <>
                <NumIn label={i ? '' : 'Strike'} value={String(l.strike)} onChange={x => edit(i, { strike: +x || 0, premium: +blackScholes(l.kind as 'call', S, +x || 0, T, r, v).price.toFixed(2) })} />
                <NumIn label={i ? '' : 'Premium'} value={String(l.premium)} onChange={x => edit(i, { premium: +x || 0 })} />
              </>}
              <NumIn label={i ? '' : 'Contracts'} value={String(l.qty)} onChange={x => edit(i, { qty: Math.max(0, +x || 0) })} step="1" />
            </div>
          ))}
        </div>
        <div className="mt-6 -mx-1">
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={curve} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="optFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={c.profit} stopOpacity={0.3} />
                  <stop offset={`${(Math.max(...ys) / ((Math.max(...ys) - Math.min(...ys)) || 1)) * 100}%`} stopColor={c.profit} stopOpacity={0.05} />
                  <stop offset={`${(Math.max(...ys) / ((Math.max(...ys) - Math.min(...ys)) || 1)) * 100}%`} stopColor={c.loss} stopOpacity={0.05} />
                  <stop offset="100%" stopColor={c.loss} stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={c.line} vertical={false} />
              <XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} tickFormatter={x => num(x, S < 10 ? 2 : 0)} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={30} />
              <YAxis tickFormatter={y => money(y, { compact: true })} tick={{ fontSize: 10.5, fill: c.ink3, fontFamily: 'Geist Mono' }} axisLine={false} tickLine={false} width={yw} />
              <ReferenceLine y={0} stroke={c.line2} />
              <ReferenceLine x={S} stroke={c.accent} strokeDasharray="3 4" />
              {bes.map((b, i) => <ReferenceLine key={i} x={b} stroke={c.warn} strokeDasharray="2 3" />)}
              <Tooltip content={<ChartTip fmt={y => money(y, { signed: true })} labelFmt={x => `At ${num(x as number, 2)}`} />} />
              <Area type="linear" dataKey="exp" name="At expiry" stroke={c.a('ink')} strokeWidth={2.2} fill="url(#optFill)" animationDuration={900} />
              <Line type="monotone" dataKey="now" name="Today" stroke={c.accent} strokeDasharray="5 4" strokeWidth={1.6} dot={false} animationDuration={900} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <Hero label={net >= 0 ? 'Net credit' : 'Net debit'} value={Math.abs(net)} format={x => money(x)} tone={net >= 0 ? 'text-profit' : 'text-ink'} sub="Paid or received to open" />
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Max profit" value={<span className="text-profit">{fmtUsd(maxP)}</span>} />
          <Result label="Max loss" value={<span className="text-loss">{fmtUsd(maxL)}</span>} />
          <Result label="Breakeven" value={bes.length ? bes.map(b => num(b, 2)).join(' / ') : '—'} sub="At expiry" />
          <Result label="P&L if unchanged" value={fmtUsd(payoffAtExpiry(active, S, S) * MULT)} sub="At expiry" />
        </div>
        <div className="mt-5 pt-5 border-t border-line">
          <div className="label mb-2">Greeks (position)</div>
          <div className="grid grid-cols-4 gap-2">
            {([['Delta', g.delta * MULT, 'shares'], ['Gamma', g.gamma * MULT, 'per $1'], ['Theta', g.theta * MULT, '$/day'], ['Vega', g.vega * MULT, '$/vol pt']] as [string, number, string][]).map(([k, x, u]) => (
              <div key={k} className="rounded-xl bg-raised/70 border border-line p-2 text-center min-w-0">
                <div className="text-[10.5px] text-ink3">{k}</div>
                <div className={cx('num text-[14px] font-semibold', x > 0 ? 'text-profit' : x < 0 ? 'text-loss' : '')}>{num(x, Math.abs(x) < 10 ? 2 : 0)}</div>
                <div className="text-[9.5px] text-ink3 truncate">{u}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </Grid>
  );
}
