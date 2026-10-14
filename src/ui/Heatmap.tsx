import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { pct, rMult, useMoney } from '@/lib/format';
import { cx, spring, useIsMobile } from './kit';

export type HeatMetric = 'net' | 'win' | 'trades' | 'exp' | 'r';
export interface HeatCell { n: number; net: number; wins: number; losses: number; rSum: number; rN: number }
export const emptyCell = (): HeatCell => ({ n: 0, net: 0, wins: 0, losses: 0, rSum: 0, rN: 0 });

export function addTo(c: HeatCell, t: { net: number; outcome: string; r: number | null }) {
  c.n++; c.net += t.net;
  if (t.outcome === 'win') c.wins++; else if (t.outcome === 'loss') c.losses++;
  if (t.r != null) { c.rSum += t.r; c.rN++; }
}

/** The number a metric reads from a cell; null when the cell can't say anything. */
export function metricValue(m: HeatMetric, c: HeatCell | undefined): number | null {
  if (!c || !c.n) return null;
  switch (m) {
    case 'net': return c.net;
    case 'trades': return c.n;
    case 'exp': return c.net / c.n;
    case 'win': return c.wins + c.losses ? c.wins / (c.wins + c.losses) : null;
    case 'r': return c.rN ? c.rSum / c.rN : null;
  }
}

const diverging = (m: HeatMetric) => m !== 'trades';
const centre = (m: HeatMetric) => (m === 'win' ? 0.5 : 0);

/** Robust scale: the 90th percentile of distance from centre, so one outlier day doesn't wash out the rest. */
export function scaleFor(m: HeatMetric, values: (number | null)[]): number {
  const d = values.filter((v): v is number => v != null).map(v => Math.abs(v - centre(m))).sort((a, b) => a - b);
  if (!d.length) return 1;
  return Math.max(d[Math.min(d.length - 1, Math.floor(d.length * 0.9))], m === 'win' ? 0.08 : 1e-9);
}

/** Colour for a value: diverging loss ← surface → profit, or a single accent ramp for counts. */
export function heatColor(m: HeatMetric, v: number | null, scale: number): string {
  if (v == null) return 'rgb(var(--raised) / 0.55)';
  const t = Math.max(-1, Math.min(1, (v - centre(m)) / scale));
  const p = Math.round(14 + 78 * Math.pow(Math.abs(t), 0.72));
  const hue = !diverging(m) ? 'accent' : t >= 0 ? 'profit' : 'loss';
  return `color-mix(in oklab, rgb(var(--${hue})) ${p}%, rgb(var(--surface)))`;
}

/** Text that reads on top of a heat colour. */
export const inkOn = (m: HeatMetric, v: number | null, scale: number) =>
  v != null && Math.abs((v - centre(m)) / scale) > 0.62 ? 'rgb(255 255 255 / 0.95)' : 'rgb(var(--ink2))';

export function useMetricFmt() {
  const fmt = useMoney();
  return (m: HeatMetric, v: number | null, compact = false) => {
    if (v == null) return '—';
    if (m === 'net' || m === 'exp') return fmt(v, { signed: true, compact });
    if (m === 'win') return pct(v, 0);
    if (m === 'r') return rMult(v, compact ? 1 : 2);
    return String(v);
  };
}

export const METRIC_LABEL: Record<HeatMetric, string> = { net: 'Net P&L', win: 'Win rate', trades: 'Trades', exp: 'Expectancy', r: 'Avg R' };

/** Gradient legend with a marker that glides to the hovered value. */
export function HeatLegend({ metric, scale, marker }: { metric: HeatMetric; scale: number; marker?: number | null }) {
  const f = useMetricFmt();
  const c = centre(metric);
  const lo = diverging(metric) ? c - scale : 0, hi = diverging(metric) ? c + scale : scale;
  const stops = Array.from({ length: 9 }, (_, i) => heatColor(metric, lo + ((hi - lo) * i) / 8, scale)).join(', ');
  const pos = marker == null ? null : Math.max(0, Math.min(1, (marker - lo) / (hi - lo || 1)));
  return (
    <div className="flex items-center gap-2.5 text-[10.5px] text-ink3 num">
      <span>{diverging(metric) ? f(metric, lo, true) : '0'}</span>
      <div className="relative flex-1 max-w-[220px] h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${stops})` }}>
        <AnimatePresence>
          {pos != null && (
            <motion.span initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1, left: `${pos * 100}%` }} exit={{ opacity: 0, scale: 0.4 }} transition={spring}
              className="absolute top-1/2 w-3.5 h-3.5 -ml-[7px] -mt-[7px] rounded-full bg-surface border-2 border-ink shadow-pop" />
          )}
        </AnimatePresence>
      </div>
      <span>{diverging(metric) ? `${f(metric, hi, true)}+` : `${f(metric, hi, true)}+`}</span>
    </div>
  );
}

/** Cursor-following glow for cards. Desktop pointers only. */
export function Spotlight({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={cx('spotlight', className)}
      onPointerMove={e => { if (e.pointerType !== 'mouse' || !ref.current) return; const r = ref.current.getBoundingClientRect(); ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`); ref.current.style.setProperty('--my', `${e.clientY - r.top}px`); }}>
      {children}
    </div>
  );
}

/**
 * Matrix heat map. Hovering focuses the row and column (everything else dims) and a tooltip springs
 * to the cell; cells wave in diagonally on first paint. `transposeOnMobile` flips wide grids
 * so phones scroll down, never sideways.
 */
export function Heatmap({ rows, cols, cell, metric, showValues = false, transposeOnMobile = false, rowHead, colLabel, cellH = 34, minN = 1, onHover }: {
  rows: string[]; cols: string[]; cell: (r: string, c: string) => HeatCell | undefined; metric: HeatMetric;
  showValues?: boolean; transposeOnMobile?: boolean; rowHead?: string; colLabel?: (c: string, i: number) => string; cellH?: number; minN?: number;
  onHover?: (v: number | null) => void;
}) {
  const mobile = useIsMobile();
  const flip = transposeOnMobile && mobile;
  const R = flip ? cols : rows, C = flip ? rows : cols;
  const get = (r: string, c: string) => (flip ? cell(c, r) : cell(r, c));
  const f = useMetricFmt();
  const values = useMemo(() => R.flatMap(r => C.map(c => { const x = get(r, c); return x && x.n >= minN ? metricValue(metric, x) : null; })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [R, C, cell, metric, minN, flip]);
  const scale = useMemo(() => scaleFor(metric, values), [metric, values]);
  const [hov, setHov] = useState<{ r: number; c: number } | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number; r: string; c: string; cell: HeatCell; v: number | null } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const label = (c: string, i: number) => (flip ? c : colLabel ? colLabel(c, i) : c);
  const rowLabel = (r: string, i: number) => (flip && colLabel ? colLabel(r, i) : r);

  const enter = (ri: number, ci: number, el: HTMLElement) => {
    const x = get(R[ri], C[ci]);
    setHov({ r: ri, c: ci });
    const v = x && x.n >= minN ? metricValue(metric, x) : null;
    onHover?.(v);
    if (!x || !box.current) { setTip(null); return; }
    const b = box.current.getBoundingClientRect(), e = el.getBoundingClientRect();
    setTip({ x: Math.max(88, Math.min(b.width - 88, e.left - b.left + e.width / 2)), y: e.top - b.top, r: flip ? C[ci] : R[ri], c: flip ? R[ri] : C[ci], cell: x, v });
  };
  const leave = () => { setHov(null); setTip(null); onHover?.(null); };
  const colIndexLabel = (name: string) => { const i = cols.indexOf(name); return colLabel ? colLabel(name, i) : name; };

  return (
    <div ref={box} className="relative select-none" onPointerLeave={leave}>
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `minmax(${flip ? 34 : 44}px, max-content) repeat(${C.length}, minmax(0, 1fr))` }} role="grid" aria-label={`${METRIC_LABEL[metric]} heat map`}>
        <div className="text-[10px] text-ink3 font-semibold uppercase tracking-wider self-end pb-1">{rowHead}</div>
        {C.map((c, ci) => (
          <div key={c} className={cx('text-center text-[10px] num pb-1 transition-colors duration-200 truncate', hov?.c === ci ? 'text-ink font-semibold' : 'text-ink3')}>
            {(C.length > 12 && !flip && ci % (mobile ? 3 : 2)) ? '' : label(c, ci)}
          </div>
        ))}
        {R.map((r, ri) => [
          <div key={`l${r}`} className={cx('text-[11px] pr-2 flex items-center truncate transition-colors duration-200', hov?.r === ri ? 'text-ink font-semibold' : 'text-ink2')}>{rowLabel(r, ri)}</div>,
          ...C.map((c, ci) => {
            const x = get(r, c);
            const v = x && x.n >= minN ? metricValue(metric, x) : null;
            const focus = !hov || hov.r === ri || hov.c === ci;
            const me = hov?.r === ri && hov?.c === ci;
            const style: CSSProperties = { height: cellH, background: heatColor(metric, v, scale), animationDelay: `${(ri + ci) * 14}ms`, opacity: focus ? 1 : 0.38, color: inkOn(metric, v, scale) };
            return (
              <div key={`${r}|${c}`} role="gridcell" aria-label={`${flip ? colIndexLabel(r) : r} ${flip ? c : colIndexLabel(c)}: ${f(metric, v)}`}
                onPointerEnter={e => enter(ri, ci, e.currentTarget)} onClick={e => enter(ri, ci, e.currentTarget)}
                className={cx('heat-cell rounded-[5px] grid place-items-center num text-[10.5px] font-semibold', me && 'is-active', x && x.n < 3 && metric !== 'trades' && 'heat-thin')}
                style={style}>
                {showValues && (!mobile || C.length <= 7) && v != null && <span className="truncate px-0.5">{f(metric, v, true)}</span>}
              </div>
            );
          }),
        ])}
      </div>
      <AnimatePresence>
        {tip && (
          <motion.div key="tip" initial={{ opacity: 0, y: 6, scale: 0.96 }} animate={{ opacity: 1, x: tip.x, y: tip.y, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={spring}
            className="absolute left-0 top-0 z-20 pointer-events-none" style={{ translate: '-50% calc(-100% - 10px)' }}>
            <div className="rounded-xl bg-surface/95 backdrop-blur-md border border-line2 shadow-pop px-3 py-2 text-xs min-w-[150px]">
              <div className="text-ink3 mb-1 whitespace-nowrap">{tip.r} · {colIndexLabel(tip.c)}</div>
              <div className={cx('num text-[15px] font-semibold', tip.cell.net >= 0 ? 'text-profit' : 'text-loss')}>{f('net', tip.cell.net)}</div>
              <div className="flex gap-3 mt-1 text-ink2 num whitespace-nowrap">
                <span>{tip.cell.n} {tip.cell.n === 1 ? 'trade' : 'trades'}</span>
                <span>{f('win', metricValue('win', tip.cell))} win</span>
                {tip.cell.rN > 0 && <span>{f('r', metricValue('r', tip.cell))}</span>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <HeatLegendRow metric={metric} scale={scale} marker={tip?.v} />
    </div>
  );
}

function HeatLegendRow(p: { metric: HeatMetric; scale: number; marker?: number | null }) {
  return <div className="mt-4"><HeatLegend {...p} /></div>;
}
