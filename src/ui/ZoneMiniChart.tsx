import { useEffect, useId, useMemo, useRef, useState } from 'react';

/** One daily bar as the scanner writes it: [date, open, high, low, close]. */
export type MiniBar = [string, number, number, number, number];

export interface MiniLevels {
  proximal: number;
  distal: number;
  entry: number;
  stop: number;
  target: number | null;
  supply?: number | null;        // next supply proximal
  supplyDistal?: number | null;  // its distal
  price: number;
}

const LABEL_W = 46;              // right gutter for the price labels, so they never sit on candles
const PAD_T = 6, PAD_B = 6;
const C = (v: string, a = 1) => `rgb(var(--${v}) / ${a})`;
const fmt = (v: number) => (v >= 1000 ? v.toFixed(0) : v >= 100 ? v.toFixed(1) : v.toFixed(2));

/**
 * Inline SVG candlestick for a zone: demand band (green), supply / target band (red), dashed entry / stop / target
 * lines with right-edge labels, and a last-price marker. Colours come from the theme tokens (light and dark).
 * Labels sit in a fixed right gutter, spaced so they never overlap.
 */
/** Fills its container's width (measured), fixed height. */
export function ZoneMiniChart(props: { bars: MiniBar[]; levels: MiniLevels; height?: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const set = () => setW(Math.round(el.clientWidth));
    set();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return <div ref={ref} style={{ height: props.height ?? 120 }}>{w > 0 && <ZoneSvg {...props} width={w} />}</div>;
}

function ZoneSvg({ bars, levels, height = 120, width, label }: { bars: MiniBar[]; levels: MiniLevels; height?: number; width: number; label: string }) {
  const clip = useId().replace(/:/g, '');
  const g = useMemo(() => {
    const L = levels;
    const vals = [L.proximal, L.distal, L.stop, L.price, ...(L.target != null ? [L.target] : []), ...(L.supply != null ? [L.supply] : [])];
    let lo = Math.min(...bars.map(b => b[3]), ...vals);
    let hi = Math.max(...bars.map(b => b[2]), ...vals);
    if (L.supplyDistal != null && L.supply != null) hi = Math.max(hi, Math.min(L.supplyDistal, L.supply + (L.supply - lo) * 0.15));
    const pad = (hi - lo) * 0.04 || 1;
    lo -= pad; hi += pad;
    const plotW = width - LABEL_W;
    const y = (v: number) => PAD_T + (hi - v) / (hi - lo) * (height - PAD_T - PAD_B);
    const step = plotW / Math.max(bars.length, 1);
    const bw = Math.max(1, Math.min(7, step * 0.62));
    // right-edge labels: keep 11px apart so they never overlap
    const raw: { k: string; v: number; tone: string }[] = [
      ...(L.target != null ? [{ k: 'T', v: L.target, tone: 'profit' }] : []),
      { k: 'E', v: L.entry, tone: 'accent' },
      { k: 'S', v: L.stop, tone: 'loss' },
      { k: 'P', v: L.price, tone: 'ink' },
    ];
    const tags = raw.map(t => ({ ...t, y: y(t.v) })).sort((a, b) => a.y - b.y);
    for (let i = 1; i < tags.length; i++) if (tags[i].y - tags[i - 1].y < 11) tags[i].y = tags[i - 1].y + 11;
    const over = tags.length ? tags[tags.length - 1].y - (height - 5) : 0;
    if (over > 0) tags.forEach(t => { t.y -= over; });
    return { y, step, bw, plotW, tags };
  }, [bars, levels, height, width]);

  const L = levels;
  const band = (a: number, b: number) => ({ y: Math.min(g.y(a), g.y(b)), h: Math.max(1, Math.abs(g.y(a) - g.y(b))) });
  const dz = band(L.proximal, L.distal);
  const sz = L.supply != null ? band(L.supply, L.supplyDistal ?? L.supply) : null;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label={label} className="block select-none">
      <defs><clipPath id={clip}><rect x="0" y="0" width={g.plotW} height={height} /></clipPath></defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y={dz.y} width={g.plotW} height={dz.h} fill={C('profit', 0.16)} stroke={C('profit', 0.5)} strokeWidth="0.75" />
        {sz && <rect x="0" y={sz.y} width={g.plotW} height={sz.h} fill={C('loss', 0.14)} stroke={C('loss', 0.45)} strokeWidth="0.75" />}
        {bars.map((b, i) => {
          const x = g.step * i + g.step / 2;
          const up = b[4] >= b[1];
          const col = up ? C('profit', 0.9) : C('loss', 0.9);
          const top = g.y(Math.max(b[1], b[4])), bot = g.y(Math.min(b[1], b[4]));
          return (
            <g key={b[0]}>
              <line x1={x} x2={x} y1={g.y(b[2])} y2={g.y(b[3])} stroke={col} strokeWidth="1" />
              <rect x={x - g.bw / 2} y={top} width={g.bw} height={Math.max(1, bot - top)} fill={up ? C('surface') : col} stroke={col} strokeWidth="1" />
            </g>
          );
        })}
        {L.target != null && <line x1="0" x2={g.plotW} y1={g.y(L.target)} y2={g.y(L.target)} stroke={C('profit')} strokeDasharray="4 3" strokeWidth="1" />}
        <line x1="0" x2={g.plotW} y1={g.y(L.entry)} y2={g.y(L.entry)} stroke={C('accent')} strokeDasharray="4 3" strokeWidth="1" />
        <line x1="0" x2={g.plotW} y1={g.y(L.stop)} y2={g.y(L.stop)} stroke={C('loss')} strokeDasharray="4 3" strokeWidth="1" />
      </g>
      <circle cx={g.plotW - 2} cy={g.y(L.price)} r="2.5" fill={C('ink')} />
      {g.tags.map(t => (
        <text key={t.k} x={width - 2} y={t.y + 3.5} textAnchor="end" fontSize="9.5" fontWeight={t.k === 'P' ? 700 : 600}
          fill={t.tone === 'ink' ? C('ink') : C(t.tone)} className="num">{t.k} {fmt(t.v)}</text>
      ))}
    </svg>
  );
}
