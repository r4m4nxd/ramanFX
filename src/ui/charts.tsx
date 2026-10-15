import { motion, useReducedMotion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts';
import { useStore } from '@/data/store';
import { ease, Segmented, useIsMobile } from './kit';
import { dayKey } from '@/core/time';
import { shortDate } from '@/lib/format';

/** Resolved theme colours (SVG presentation attributes can't read CSS variables). */
export function useColors() {
  const theme = useStore(s => s.theme);
  return useMemo(() => {
    const cs = getComputedStyle(document.documentElement);
    const c = (n: string, a = 1) => {
      const v = cs.getPropertyValue(`--${n}`).trim().split(/\s+/).join(',');
      return a < 1 ? `rgba(${v},${a})` : `rgb(${v})`;
    };
    return { profit: c('profit'), loss: c('loss'), accent: c('accent'), warn: c('warn'), violet: c('violet'), cyan: c('cyan'), ink3: c('ink3'), ink2: c('ink2'), line: c('line'), line2: c('line2'), surface: c('surface'), a: c };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
}

// ─── Period bucketing (days / weeks / months) ────────────────────────
export type Period = 'day' | 'week' | 'month';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** First day of the period containing d (weeks start Monday), local time. */
export function periodStart(d: Date, p: Period): Date {
  if (p === 'month') return new Date(d.getFullYear(), d.getMonth(), 1);
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (p === 'week') x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}
export function prevPeriod(d: Date, p: Period): Date {
  const x = new Date(d);
  if (p === 'month') x.setMonth(x.getMonth() - 1); else x.setDate(x.getDate() - (p === 'week' ? 7 : 1));
  return x;
}
export const periodTick = (t: number, p: Period) => { const d = new Date(t); return p === 'month' ? `${MONTHS[d.getMonth()]} ’${String(d.getFullYear()).slice(2)}` : shortDate(d); };
export const periodLabel = (t: number, p: Period) => {
  const d = new Date(t);
  if (p === 'month') return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  if (p === 'week') return `Week of ${d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};
export const PERIOD_NOUN: Record<Period, [string, string, string]> = { day: ['Daily', 'day', 'days'], week: ['Weekly', 'week', 'weeks'], month: ['Monthly', 'month', 'months'] };

/** Sum day stats into weeks or months. */
export function bucketDays<T extends { date: string; pnl: number; trades?: number; wins?: number; losses?: number; r?: number }>(days: T[], p: Period) {
  const m = new Map<string, { t: number; date: string; pnl: number; trades: number; wins: number; losses: number; n: number; r: number }>();
  for (const d of days) {
    const st = periodStart(new Date(d.date + 'T00:00'), p), k = dayKey(st);
    const b = m.get(k) ?? { t: st.getTime(), date: k, pnl: 0, trades: 0, wins: 0, losses: 0, n: 0, r: 0 };
    b.pnl += d.pnl; b.r += d.r ?? 0; b.trades += d.trades ?? 0; b.wins += d.wins ?? 0; b.losses += d.losses ?? 0; b.n++;
    m.set(k, b);
  }
  return [...m.values()].sort((a, b) => a.t - b.t);
}

/** One point per period: the last value in it, plus `low` fields taking the period's minimum. */
export function bucketSeries<T extends { t: number }>(pts: T[], p: Period, low: (keyof T)[] = []): T[] {
  const out: T[] = [];
  let key = -1;
  for (const pt of pts) {
    const k = periodStart(new Date(pt.t), p).getTime();
    if (k !== key) { out.push({ ...pt, t: k }); key = k; continue; }
    const last = out[out.length - 1], next = { ...pt, t: k } as T;
    for (const f of low) (next[f] as unknown as number) = Math.min(last[f] as unknown as number, pt[f] as unknown as number);
    out[out.length - 1] = next;
  }
  return out;
}

/** Remembered Days / Weeks / Months choice per chart. */
export function usePeriod(id: string, initial: Period = 'day'): [Period, (p: Period) => void] {
  const k = `rfx_period_${id}`;
  const [p, setP] = useState<Period>(() => { try { const v = localStorage.getItem(k); return v === 'day' || v === 'week' || v === 'month' ? v : initial; } catch { return initial; } });
  return [p, (v: Period) => { setP(v); try { localStorage.setItem(k, v); } catch { /* private mode */ } }];
}

export function PeriodToggle({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  return <Segmented label="Group by" size="sm" value={value} onChange={onChange} options={[{ value: 'day', label: 'Days' }, { value: 'week', label: 'Weeks' }, { value: 'month', label: 'Months' }]} />;
}

const axisTick = { fontSize: 10.5, fontFamily: 'Inter, system-ui, sans-serif' };
/** Y-axis gutter: narrower on phones so the plot gets the width. */
export const useAxisW = () => (useIsMobile() ? 44 : 60);

export function ChartTip({ active, payload, label, fmt, labelFmt }: TooltipProps<number, string> & { fmt: (v: number, name: string) => string; labelFmt?: (l: unknown) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl bg-surface/95 backdrop-blur-md border border-accent/30 shadow-card px-3.5 py-2.5 text-xs">
      <div className="text-ink3 mb-1">{labelFmt ? labelFmt(label) : String(label)}</div>
      {payload.filter(p => p.value != null).map(p => (
        <div key={String(p.dataKey)} className="flex items-center gap-2 num">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink2">{p.name}</span>
          <span className="ml-auto pl-3 font-semibold text-ink">{fmt(p.value as number, String(p.dataKey))}</span>
        </div>
      ))}
    </div>
  );
}

/** Cumulative equity on a real time axis, with drawdown beneath the zero line. */
export function EquityChart({ data, height = 260, fmt, showDD = true, period }: { data: { t: number; cum: number; dd: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean }) => string; showDD?: boolean; period?: Period }) {
  const reduce = useReducedMotion();
  const c = useColors();
  const yw = useAxisW();
  const stroke = c.accent;
  const pts = useMemo(() => {
    if (!data.length) return data;
    if (!period) return [{ t: data[0].t - 1, cum: 0, dd: 0 }, ...data];
    const b = bucketSeries(data, period, ['dd']);
    return [{ t: prevPeriod(new Date(b[0].t), period).getTime(), cum: 0, dd: 0 }, ...b];
  }, [data, period]);
  const dots = period && pts.length < 60;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={pts} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.38} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => periodTick(v, period ?? 'day')} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={28} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={yw} />
        <ReferenceLine y={0} stroke={c.line2} strokeDasharray="3 4" />
        <Tooltip content={<ChartTip fmt={v => fmt(v)} labelFmt={l => (period ? periodLabel(l as number, period) : new Date(l as number).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }))} />} cursor={{ stroke: c.line2 }} />
        {showDD && <Area key={`dd${period}`} type="monotone" dataKey="dd" name="Drawdown" stroke="none" fill={c.loss} fillOpacity={0.18} isAnimationActive={!reduce} animationDuration={600} />}
        <Area key={period} type="monotone" dataKey="cum" name="Net P&L" stroke={stroke} strokeWidth={2.4} fill="url(#eqFill)" isAnimationActive={!reduce} animationDuration={600} style={{ filter: `drop-shadow(0 0 6px ${c.a('accent', 0.45)})` }} dot={dots ? { r: 2.5, fill: stroke, strokeWidth: 0 } : false} activeDot={{ r: 6, fill: '#fff', stroke, strokeWidth: 3, style: { filter: `drop-shadow(0 0 8px ${c.a('accent', 0.9)})` } }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function BalanceChart({ data: raw, height = 240, fmt, period }: { data: { t: number; balance: number; deposits: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean }) => string; period?: Period }) {
  const reduce = useReducedMotion();
  const data = useMemo(() => (period ? bucketSeries(raw, period) : raw), [raw, period]);
  const c = useColors();
  const yw = useAxisW();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => periodTick(v, period ?? 'day')} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={28} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={yw} domain={['auto', 'auto']} />
        <Tooltip content={<ChartTip fmt={v => fmt(v)} labelFmt={l => (period ? `End of ${periodLabel(l as number, period).replace(/^Week of/, 'week of')}` : new Date(l as number).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }))} />} cursor={{ stroke: c.line2 }} />
        <Area key={period} type="monotone" dataKey="balance" name="Balance" stroke={c.accent} strokeWidth={2.4} fill="url(#balFill)" isAnimationActive={!reduce} animationDuration={600} style={{ filter: `drop-shadow(0 0 6px ${c.a('accent', 0.45)})` }} activeDot={{ r: 6, fill: '#fff', stroke: c.accent, strokeWidth: 3 }} />
        <Line key={`d${period}`} type="stepAfter" dataKey="deposits" name="Net deposits" stroke={c.ink3} strokeWidth={1.5} strokeDasharray="4 4" dot={false} isAnimationActive={!reduce} animationDuration={600} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

/** Net P&L bars per day, week or month. */
export type DayMetric = 'net' | 'r' | 'win' | 'n';
export function DailyBars({ days, height = 220, fmt, period = 'day', metric = 'net' }: { days: { date: string; pnl: number; trades?: number; wins?: number; losses?: number; r?: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean; signed?: boolean }) => string; period?: Period; metric?: DayMetric }) {
  const reduce = useReducedMotion();
  const c = useColors();
  const yw = useAxisW();
  const data = useMemo(() => bucketDays(days, period).map(d => ({ ...d, v: metric === 'net' ? d.pnl : metric === 'r' ? d.r : metric === 'n' ? d.trades : d.wins + d.losses ? d.wins / (d.wins + d.losses) : 0 })), [days, period, metric]);
  const byT = useMemo(() => new Map(data.map(d => [d.t, d])), [data]);
  const f = (v: number, short = false) => (metric === 'net' ? fmt(v, short ? { compact: true } : { signed: true }) : metric === 'r' ? `${v >= 0 && !short ? '+' : ''}${v.toFixed(short ? 1 : 2)}R` : metric === 'n' ? String(Math.round(v)) : `${Math.round(v * 100)}%`);
  const good = (v: number) => (metric === 'win' ? v >= 0.5 : v >= 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" tickFormatter={v => periodTick(v, period)} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={period === 'month' ? 10 : 30} />
        <YAxis tickFormatter={v => f(v, true)} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={yw} domain={metric === 'win' ? [0, 1] : ['auto', 'auto']} />
        <ReferenceLine y={metric === 'win' ? 0.5 : 0} stroke={c.line2} strokeDasharray={metric === 'win' ? '4 4' : undefined} />
        <Tooltip content={<ChartTip fmt={v => f(v)} labelFmt={l => { const d = byT.get(l as number); return `${periodLabel(l as number, period)}${d?.trades ? ` · ${d.trades} trades` : ''}`; }} />} cursor={{ fill: c.a('accent', 0.06), radius: 8 } as object} />
        <Bar key={period + metric} dataKey="v" name={{ net: 'Net', r: 'R', win: 'Win rate', n: 'Trades' }[metric]} radius={[6, 6, 6, 6]} maxBarSize={period === 'month' ? 44 : period === 'week' ? 30 : 22} isAnimationActive={!reduce} animationDuration={500}
          activeBar={{ fill: c.accent, fillOpacity: 1, style: { filter: `drop-shadow(0 0 10px ${c.a('accent', 0.75)})` } }}>
          {data.map(d => <Cell key={d.t} fill={metric === 'n' ? c.accent : good(d.v) ? c.profit : c.loss} fillOpacity={0.85} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ values, height = 36, className, color }: { values: number[]; height?: number; className?: string; color?: string }) {
  const c = useColors();
  if (values.length < 2) return <div style={{ height }} />;
  const min = Math.min(0, ...values), max = Math.max(0, ...values), span = max - min || 1;
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * 100).toFixed(2)} ${(((max - v) / span) * 100).toFixed(2)}`).join(' ');
  const col = color ?? (values[values.length - 1] >= 0 ? c.profit : c.loss);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height={height} className={className} aria-hidden="true">
      <motion.path d={d} fill="none" stroke={col} strokeWidth={2} vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease }} />
    </svg>
  );
}

/** Ring gauge, value 0..1. */
export function Ring({ value, size = 64, stroke = 7, color, track, children }: { value: number; size?: number; stroke?: number; color: string; track?: string; children?: React.ReactNode }) {
  const c = useColors();
  const r = (size - stroke) / 2, circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track ?? c.line} strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: circ * (1 - Math.max(0, Math.min(1, value))) }} transition={{ duration: 1, ease }} />
      </svg>
      {children && <div className="absolute inset-0 grid place-items-center">{children}</div>}
    </div>
  );
}

/** Diverging horizontal bars (symbols, setups): zero in the middle, every row shown. */
export function DivergingBars({ rows, fmt, onRow }: { rows: { key: string; net: number; sub?: string }[]; fmt: (n: number) => string; onRow?: (k: string) => void }) {
  const max = Math.max(1, ...rows.map(r => Math.abs(r.net)));
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r, i) => {
        const w = (Math.abs(r.net) / max) * 50;
        const pos = r.net >= 0;
        const Row = onRow ? 'button' : 'div';
        return (
          <Row key={r.key} {...(onRow ? { type: 'button' as const, onClick: () => onRow(r.key) } : {})} className={'grid grid-cols-[84px_minmax(0,1fr)_84px] items-center gap-3 text-[13px] text-left ' + (onRow ? 'hover:bg-raised -mx-2 px-2 py-1 rounded-lg' : '')}>
            <span className="truncate font-mono text-ink2" title={r.key}>{r.key}{r.sub && <span className="block text-[10.5px] text-ink3 font-sans">{r.sub}</span>}</span>
            <span className="relative h-2 rounded-full bg-line/60">
              <span className="absolute top-0 bottom-0 left-1/2 w-px bg-line2" />
              <motion.span className={'absolute top-0 h-2 rounded-full ' + (pos ? 'bg-profit' : 'bg-loss')}
                style={pos ? { left: '50%' } : { right: '50%' }} initial={{ width: 0 }} animate={{ width: `${w}%` }} transition={{ duration: 0.7, ease, delay: i * 0.03 }} />
            </span>
            <span className={'num text-right font-semibold ' + (pos ? 'text-profit' : 'text-loss')}>{fmt(r.net)}</span>
          </Row>
        );
      })}
    </div>
  );
}
