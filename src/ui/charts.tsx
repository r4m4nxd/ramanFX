import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts';
import { useStore } from '@/data/store';
import { ease } from './kit';
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

const axisTick = { fontSize: 10.5, fontFamily: 'Geist Mono, monospace' };

export function ChartTip({ active, payload, label, fmt, labelFmt }: TooltipProps<number, string> & { fmt: (v: number, name: string) => string; labelFmt?: (l: unknown) => string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg bg-surface border border-line2 shadow-pop px-3 py-2 text-xs">
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
export function EquityChart({ data, height = 260, fmt, showDD = true }: { data: { t: number; cum: number; dd: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean }) => string; showDD?: boolean }) {
  const c = useColors();
  const up = (data[data.length - 1]?.cum ?? 0) >= 0;
  const stroke = up ? c.profit : c.loss;
  const pts = data.length ? [{ t: data[0].t - 1, cum: 0, dd: 0 }, ...data] : data;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={pts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => shortDate(new Date(v))} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={40} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={64} />
        <ReferenceLine y={0} stroke={c.line2} strokeDasharray="3 4" />
        <Tooltip content={<ChartTip fmt={(v, k) => (k === 'dd' ? fmt(v) : fmt(v))} labelFmt={l => new Date(l as number).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} />} cursor={{ stroke: c.line2 }} />
        {showDD && <Area type="monotone" dataKey="dd" name="Drawdown" stroke="none" fill={c.loss} fillOpacity={0.18} isAnimationActive animationDuration={900} />}
        <Area type="monotone" dataKey="cum" name="Net P&L" stroke={stroke} strokeWidth={2.2} fill="url(#eqFill)" isAnimationActive animationDuration={900} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function BalanceChart({ data, height = 240, fmt }: { data: { t: number; balance: number; deposits: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean }) => string }) {
  const c = useColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c.accent} stopOpacity={0.22} /><stop offset="100%" stopColor={c.accent} stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={v => shortDate(new Date(v))} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={40} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={64} domain={['auto', 'auto']} />
        <Tooltip content={<ChartTip fmt={v => fmt(v)} labelFmt={l => new Date(l as number).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })} />} cursor={{ stroke: c.line2 }} />
        <Area type="stepAfter" dataKey="balance" name="Balance" stroke={c.accent} strokeWidth={2} fill="url(#balFill)" animationDuration={900} />
        <Line type="stepAfter" dataKey="deposits" name="Net deposits" stroke={c.ink3} strokeWidth={1.5} strokeDasharray="4 4" dot={false} animationDuration={900} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function DailyBars({ days, height = 220, fmt }: { days: { date: string; pnl: number }[]; height?: number; fmt: (n: number, o?: { compact?: boolean }) => string }) {
  const c = useColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={days} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={c.line} vertical={false} />
        <XAxis dataKey="date" tickFormatter={v => shortDate(new Date(v + 'T00:00'))} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} minTickGap={30} />
        <YAxis tickFormatter={v => fmt(v, { compact: true })} tick={{ ...axisTick, fill: c.ink3 }} axisLine={false} tickLine={false} width={64} />
        <ReferenceLine y={0} stroke={c.line2} />
        <Tooltip content={<ChartTip fmt={v => fmt(v)} labelFmt={l => new Date(String(l) + 'T00:00').toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })} />} cursor={{ fill: c.a('ink3', 0.08) }} />
        <Bar dataKey="pnl" name="Net" radius={[3, 3, 0, 0]} maxBarSize={22} animationDuration={700}>
          {days.map(d => <Cell key={d.date} fill={d.pnl >= 0 ? c.profit : c.loss} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function Sparkline({ values, height = 36, className }: { values: number[]; height?: number; className?: string }) {
  const c = useColors();
  if (values.length < 2) return <div style={{ height }} />;
  const min = Math.min(0, ...values), max = Math.max(0, ...values), span = max - min || 1;
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${((i / (values.length - 1)) * 100).toFixed(2)} ${(((max - v) / span) * 100).toFixed(2)}`).join(' ');
  const col = values[values.length - 1] >= 0 ? c.profit : c.loss;
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
