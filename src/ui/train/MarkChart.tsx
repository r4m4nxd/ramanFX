import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react';
import { candleLevels, labelPivots, lineAt, lineDir, snapPivot, snapWick, zoneEdges, zoneFromDrag } from '@/core/training/structure';
import { lineKind, type Anchor, type Marks, type MLine, type MZone, type TBar } from '@/core/training/types';

export type Tool = 'pivot' | 'line' | 'zone' | 'select';
/** A line being drawn: first anchor placed, or both placed and waiting for the (optional) break tap. */
export type Pending = { stage: 'a'; a: Anchor } | { stage: 'brk'; id: string } | null;

const C = (v: string, a = 1) => `rgb(var(--${v}) / ${a})`;
export const fmtPx = (v: number) => (Math.abs(v) >= 1000 ? v.toFixed(1) : Math.abs(v) >= 100 ? v.toFixed(2) : Math.abs(v) >= 1 ? v.toFixed(4) : v.toPrecision(4));
const GUTTER = 58, PAD_T = 14, PAD_B = 22, LONG_MS = 550, MAGNET_PX = 7;
const OWN = 'cyan', ENG = 'warn';

interface Props {
  bars: TBar[]; marks: Marks; engine: Marks | null; tool: Tool; view: [number, number]; height: number;
  selected: string | null; pending: Pending;
  onChange: (m: Marks) => void; onSelect: (id: string | null) => void; onPending: (p: Pending) => void;
}

/** Fills its container's width; the candlestick + marks, touch and mouse. */
export function MarkChart(props: Props) {
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
  return <div ref={ref} style={{ height: props.height }} className="relative">{w > 0 && props.bars.length > 0 && <ChartSvg {...props} width={w} />}</div>;
}

type Drag =
  | { kind: 'tap'; i: number; p: number; x: number; y: number; alt: boolean; moved: boolean }
  | { kind: 'zone'; i0: number; p0: number; i1: number; p1: number; x: number; y: number; moved: boolean }
  | { kind: 'anchor'; id: string; end: 'a' | 'b' };

function ChartSvg({ bars, marks, engine, tool, view, height, width, selected, pending, onChange, onSelect, onPending }: Props & { width: number }) {
  const [v0, v1] = view;
  const plotW = width - GUTTER;
  const nVis = v1 - v0 + 1;
  const cw = plotW / nVis;
  const g = useMemo(() => {
    let lo = Infinity, hi = -Infinity;
    for (let i = v0; i <= v1; i++) { lo = Math.min(lo, bars[i].l); hi = Math.max(hi, bars[i].h); }
    const pad = (hi - lo) * 0.06 || Math.abs(hi) * 0.01 || 1;
    lo -= pad; hi += pad;
    const y = (v: number) => PAD_T + ((hi - v) / (hi - lo)) * (height - PAD_T - PAD_B);
    const yInv = (py: number) => hi - ((py - PAD_T) / (height - PAD_T - PAD_B)) * (hi - lo);
    const ticks: number[] = [];
    const step = niceStep((hi - lo) / 5);
    for (let t = Math.ceil(lo / step) * step; t <= hi; t += step) ticks.push(t);
    return { y, yInv, ticks, lo, hi };
  }, [bars, v0, v1, height]);
  const x = (i: number) => (i - v0 + 0.5) * cw;
  const bw = Math.max(1, Math.min(11, cw * 0.64));
  const last = bars.length - 1;

  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<Drag | null>(null);
  const timer = useRef<number | null>(null);
  const [hover, setHover] = useState<{ i: number; p: number } | null>(null);
  const [draft, setDraft] = useState<{ i0: number; i1: number; p0: number; p1: number } | null>(null);
  const [, force] = useState(0);

  const toData = (e: { clientX: number; clientY: number }) => {
    const r = svgRef.current!.getBoundingClientRect();
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const i = Math.max(v0, Math.min(v1, Math.floor(px / cw) + v0));
    return { i, p: g.yInv(py), px, py };
  };
  const clearTimer = () => { if (timer.current != null) { clearTimeout(timer.current); timer.current = null; } };

  /** Remove the nearest element of the active tool at candle i (long-press / alt-click). */
  const removeAt = (i: number, p: number) => {
    const near = (j: number) => Math.abs(j - i) <= 1;
    if (tool === 'pivot' || tool === 'select') {
      const c = marks.pivots.filter(v => near(v.i)).sort((a, b) => Math.abs(a.i - i) - Math.abs(b.i - i) || Math.abs(a.p - p) - Math.abs(b.p - p))[0];
      if (c) { onChange({ ...marks, pivots: marks.pivots.filter(v => v !== c) }); return; }
    }
    if (tool === 'line' || tool === 'select') {
      const c = hitLine(i, p);
      if (c) { onChange({ ...marks, lines: marks.lines.filter(l => l.id !== c.id) }); onPending(null); if (selected === c.id) onSelect(null); return; }
    }
    if (tool === 'zone' || tool === 'select') {
      const c = hitZone(i, p);
      if (c) { onChange({ ...marks, zones: marks.zones.filter(z => z.id !== c.id) }); if (selected === c.id) onSelect(null); }
    }
  };
  const hitLine = (i: number, p: number): MLine | null => {
    const tolP = (g.hi - g.lo) * 0.03;
    let best: MLine | null = null, bd = Infinity;
    for (const l of marks.lines) {
      const end = l.brk ?? last;
      if (i < l.a.i - 1 || i > end + 1) continue;
      const d = Math.abs(lineAt(l, i) - p);
      if (d < tolP && d < bd) { bd = d; best = l; }
    }
    return best;
  };
  const hitZone = (i: number, p: number): MZone | null => {
    const inZ = marks.zones.filter(z => i >= z.s - 1 && p <= Math.max(z.prox, z.dist) && p >= Math.min(z.prox, z.dist));
    return inZ.sort((a, b) => Math.abs(a.prox - a.dist) - Math.abs(b.prox - b.dist))[0] ?? null;
  };

  const tapAt = (i: number, p: number, alt: boolean) => {
    if (alt) { removeAt(i, p); return; }
    if (tool === 'pivot') {
      const pv = snapPivot(bars, i, p);
      const same = marks.pivots.find(v => v.i === i && v.kind === pv.kind);
      if (same) { onSelect(`p${same.i}${same.kind}`); return; }
      onChange({ ...marks, pivots: [...marks.pivots, pv].sort((a, b) => a.i - b.i) });
      onSelect(`p${pv.i}${pv.kind}`);
      return;
    }
    if (tool === 'line') {
      if (pending?.stage === 'brk') {
        const l = marks.lines.find(v => v.id === pending.id);
        if (l && i > l.b.i) onChange({ ...marks, lines: marks.lines.map(v => (v.id === l.id ? { ...v, brk: i } : v)) });
        onPending(null);
        return;
      }
      const an = snapWick(bars, i, p);
      if (!pending) { onPending({ stage: 'a', a: an }); return; }
      if (an.i === pending.a.i) { onPending({ stage: 'a', a: an }); return; }
      const [a, b] = an.i > pending.a.i ? [pending.a, an] : [an, pending.a];
      const id = `l${Date.now().toString(36)}`;
      onChange({ ...marks, lines: [...marks.lines, { id, a, b, dir: lineDir(a, b), brk: null, kind: 'trend' }] });
      onSelect(id);
      onPending({ stage: 'brk', id });
      return;
    }
    if (tool === 'zone') {
      // a single tap: that candle is the base, proximal on its body, distal on its wick (switch them in the panel)
      const z0 = zoneFromDrag(bars, i, i, p, p), E = zoneEdges(bars, i, i, z0.side);
      const z = { ...z0, prox: E.proxBody, dist: E.distWick };
      onChange({ ...marks, zones: [...marks.zones, z] });
      onSelect(z.id);
      return;
    }
    // select
    const pv = marks.pivots.filter(v => Math.abs(v.i - i) <= 1).sort((a, b) => Math.abs(g.y(a.p) - g.y(p)) - Math.abs(g.y(b.p) - g.y(p)))[0];
    if (pv && Math.abs(g.y(pv.p) - g.y(p)) < 22) { onSelect(`p${pv.i}${pv.kind}`); return; }
    const l = hitLine(i, p);
    if (l) { onSelect(l.id); return; }
    const z = hitZone(i, p);
    onSelect(z ? z.id : null);
  };

  const down = (e: RPointerEvent<SVGElement>) => {
    if (e.button > 0) return;
    const d = toData(e);
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    const anchor = (e.target as Element).getAttribute?.('data-anchor');
    if (anchor) { const [id, end] = anchor.split(':'); drag.current = { kind: 'anchor', id, end: end as 'a' | 'b' }; return; }
    if (tool === 'zone' && !e.altKey) { drag.current = { kind: 'zone', i0: d.i, p0: d.p, i1: d.i, p1: d.p, x: d.px, y: d.py, moved: false }; }
    else drag.current = { kind: 'tap', i: d.i, p: d.p, x: d.px, y: d.py, alt: e.altKey || e.shiftKey, moved: false };
    clearTimer();
    timer.current = window.setTimeout(() => {
      const dr = drag.current;
      if (dr && dr.kind !== 'anchor' && !dr.moved) { removeAt(dr.kind === 'tap' ? dr.i : dr.i0, dr.kind === 'tap' ? dr.p : dr.p0); drag.current = null; setDraft(null); navigator.vibrate?.(15); }
    }, LONG_MS);
  };
  const move = (e: RPointerEvent<SVGElement>) => {
    const d = toData(e);
    setHover({ i: d.i, p: d.p });
    const dr = drag.current;
    if (!dr) return;
    if (dr.kind === 'anchor') {
      const l = marks.lines.find(v => v.id === dr.id);
      if (!l) return;
      const an = l[dr.end];
      // vertical only; sticks to a wick / body end of that candle when within a few pixels
      let p = d.p;
      for (const lv of candleLevels(bars[an.i])) if (Math.abs(g.y(lv) - d.py) <= MAGNET_PX) p = lv;
      const nl = { ...l, [dr.end]: { i: an.i, p } } as MLine;
      nl.dir = lineDir(nl.a, nl.b);
      onChange({ ...marks, lines: marks.lines.map(v => (v.id === l.id ? nl : v)) });
      return;
    }
    if (Math.hypot(d.px - dr.x, d.py - dr.y) > 8) { dr.moved = true; clearTimer(); }
    if (dr.kind === 'zone' && dr.moved) { dr.i1 = d.i; dr.p1 = d.p; setDraft({ i0: dr.i0, i1: dr.i1, p0: dr.p0, p1: dr.p1 }); }
    force(n => n + 1);
  };
  const up = () => {
    clearTimer();
    const dr = drag.current;
    drag.current = null;
    if (!dr) return;
    if (dr.kind === 'anchor') return;
    if (dr.kind === 'zone') {
      setDraft(null);
      if (dr.moved) {
        const z = zoneFromDrag(bars, dr.i0, dr.i1, dr.p0, dr.p1);
        onChange({ ...marks, zones: [...marks.zones, z] });
        onSelect(z.id);
      } else tapAt(dr.i0, dr.p0, false);
      return;
    }
    if (!dr.moved) tapAt(dr.i, dr.p, dr.alt);
  };

  // ── drawing ──
  const lab = labelPivots(marks.pivots);
  const zig = [...marks.pivots].sort((a, b) => a.i - b.i);
  const vis = (i: number) => i >= v0 - 1 && i <= v1 + 1;
  const clipId = 'mk-clip';
  const zoneRect = (z: MZone, tone: 'own' | 'eng') => {
    const right = z.end != null ? x(z.end) : plotW;
    const xl = x(z.s) - cw / 2;
    if (right < 0 || xl > plotW) return null;
    const yt = g.y(Math.max(z.prox, z.dist)), yb = g.y(Math.min(z.prox, z.dist));
    const t = z.side === 'demand' ? 'profit' : 'loss';
    const sel = selected === z.id;
    return tone === 'own'
      ? <g key={z.id}>
          <rect x={xl} y={yt} width={Math.max(2, right - xl)} height={Math.max(1, yb - yt)} fill={C(t, sel ? 0.26 : 0.16)} stroke={C(t, sel ? 1 : 0.6)} strokeWidth={sel ? 1.6 : 1} />
          <line x1={xl} x2={right} y1={g.y(z.prox)} y2={g.y(z.prox)} stroke={C(t)} strokeWidth="1.4" />
        </g>
      : <rect key={z.id} x={xl} y={yt} width={Math.max(2, right - xl)} height={Math.max(1, yb - yt)} fill="none" stroke={C(ENG, 0.9)} strokeWidth="1.2" strokeDasharray="5 3" />;
  };
  const lineSeg = (l: MLine, tone: 'own' | 'eng') => {
    const end = l.brk ?? last;
    const sel = selected === l.id;
    const mom = lineKind(l) === 'momentum';   // momentum lines: thin red (dashed for the engine), as on the bot's charts
    const col = mom ? C('loss', tone === 'own' ? 1 : 0.85) : tone === 'own' ? C(OWN) : C(ENG, 0.95);
    return (
      <g key={l.id}>
        <line x1={x(l.a.i)} y1={g.y(l.a.p)} x2={x(end)} y2={g.y(lineAt(l, end))} stroke={col} strokeWidth={sel ? 2.4 : mom ? 1.2 : 1.6} strokeDasharray={tone === 'eng' ? '6 4' : mom ? '3 3' : undefined} />
        {l.brk != null && <path d={cross(x(l.brk), g.y(lineAt(l, l.brk)), 5)} stroke={col} strokeWidth="2" />}
        {tone === 'own' && [l.a, l.b].map((an, k) => (
          <g key={k}>
            <circle cx={x(an.i)} cy={g.y(an.p)} r={sel ? 5 : 3.5} fill={C('surface')} stroke={col} strokeWidth="1.6" />
            {sel && <circle data-anchor={`${l.id}:${k ? 'b' : 'a'}`} cx={x(an.i)} cy={g.y(an.p)} r="16" fill="transparent" style={{ cursor: 'ns-resize' }} />}
          </g>
        ))}
      </g>
    );
  };

  const hv = hover && hover.i >= v0 && hover.i <= v1 ? hover : null;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} width={width} height={height} role="img" aria-label="Chart to mark"
      className="block select-none" style={{ touchAction: 'none', cursor: tool === 'select' ? 'pointer' : 'crosshair' }}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { clearTimer(); drag.current = null; setDraft(null); }}
      onPointerLeave={() => setHover(null)} onContextMenu={e => e.preventDefault()}>
      <defs><clipPath id={clipId}><rect x="0" y="0" width={plotW} height={height} /></clipPath></defs>
      {g.ticks.map(t => (
        <g key={t}>
          <line x1="0" x2={plotW} y1={g.y(t)} y2={g.y(t)} stroke={C('line', 0.6)} strokeWidth="0.5" />
          <text x={width - 3} y={g.y(t) + 3.5} textAnchor="end" fontSize="10" fill={C('ink3')} className="num">{fmtPx(t)}</text>
        </g>
      ))}
      {dateTicks(bars, v0, v1, Math.max(2, Math.floor(plotW / 90))).map(i => (
        <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize="9.5" fill={C('ink3')} className="num">{shortDate(bars[i].t)}</text>
      ))}
      <g clipPath={`url(#${clipId})`}>
        {hv && <rect x={x(hv.i) - cw / 2} y="0" width={cw} height={height - PAD_B + 4} fill={C('ink', 0.06)} />}
        {engine?.zones.map(z => zoneRect(z, 'eng'))}
        {marks.zones.map(z => zoneRect(z, 'own'))}
        {draft && (() => {
          const z = zoneFromDrag(bars, draft.i0, draft.i1, draft.p0, draft.p1, undefined, 'draft');
          const t = z.side === 'demand' ? 'profit' : 'loss';
          return <g>
            <rect x={x(z.s) - cw / 2} y={g.y(Math.max(draft.p0, draft.p1))} width={x(z.e) - x(z.s) + cw} height={Math.abs(g.y(draft.p0) - g.y(draft.p1))} fill="none" stroke={C('ink3')} strokeDasharray="3 3" />
            <rect x={x(z.s) - cw / 2} y={g.y(Math.max(z.prox, z.dist))} width={plotW - x(z.s) + cw / 2} height={Math.max(1, Math.abs(g.y(z.prox) - g.y(z.dist)))} fill={C(t, 0.18)} stroke={C(t)} strokeWidth="1" />
          </g>;
        })()}
        {bars.map((b, i) => {
          if (!vis(i)) return null;
          const upC = b.c >= b.o, col = upC ? C('profit', 0.95) : C('loss', 0.95);
          const top = g.y(Math.max(b.o, b.c)), bot = g.y(Math.min(b.o, b.c));
          return (
            <g key={i}>
              <line x1={x(i)} x2={x(i)} y1={g.y(b.h)} y2={g.y(b.l)} stroke={col} strokeWidth="1" />
              <rect x={x(i) - bw / 2} y={top} width={bw} height={Math.max(1, bot - top)} fill={upC ? C('surface') : col} stroke={col} strokeWidth="1" />
            </g>
          );
        })}
        {zig.length > 1 && <polyline points={zig.map(p => `${x(p.i)},${g.y(p.p)}`).join(' ')} fill="none" stroke={C(OWN, 0.35)} strokeWidth="1.2" />}
        {engine?.pivots.map(p => (
          <path key={`e${p.i}${p.kind}`} d={tri(x(p.i), p.kind === 'peak' ? g.y(p.p) - 9 : g.y(p.p) + 9, p.kind === 'peak' ? 1 : -1, 4)} fill={C(ENG)} />
        ))}
        {lab.map(({ p, label }) => {
          const sel = selected === `p${p.i}${p.kind}`, pk = p.kind === 'peak';
          const yy = g.y(p.p);
          return (
            <g key={`${p.i}${p.kind}`}>
              <circle cx={x(p.i)} cy={yy} r={sel ? 5 : 3.5} fill={C(OWN)} stroke={sel ? C('ink') : 'none'} strokeWidth="1.5" />
              <text x={x(p.i)} y={pk ? yy - 8 - (engine ? 9 : 0) : yy + 15 + (engine ? 9 : 0)} textAnchor="middle" fontSize="10" fontWeight={700} fill={C(OWN)}>{label}</text>
            </g>
          );
        })}
        {engine?.lines.map(l => lineSeg(l, 'eng'))}
        {marks.lines.map(l => lineSeg(l, 'own'))}
        {pending?.stage === 'a' && <circle cx={x(pending.a.i)} cy={g.y(pending.a.p)} r="5" fill="none" stroke={C(OWN)} strokeWidth="2" strokeDasharray="2 2" />}
        {pending?.stage === 'a' && hv && <line x1={x(pending.a.i)} y1={g.y(pending.a.p)} x2={x(hv.i)} y2={g.y(snapWick(bars, hv.i, hv.p).p)} stroke={C(OWN, 0.6)} strokeDasharray="4 3" />}
      </g>
      {hv && (
        <g pointerEvents="none">
          <line x1="0" x2={plotW} y1={g.y(hv.p)} y2={g.y(hv.p)} stroke={C('ink3', 0.5)} strokeDasharray="2 3" strokeWidth="0.75" />
          <rect x={plotW + 1} y={g.y(hv.p) - 7} width={GUTTER - 2} height="14" rx="3" fill={C('raised')} />
          <text x={width - 3} y={g.y(hv.p) + 3.5} textAnchor="end" fontSize="10" fontWeight={600} fill={C('ink')} className="num">{fmtPx(hv.p)}</text>
        </g>
      )}
    </svg>
  );
}

const cross = (cx: number, cy: number, r: number) => `M${cx - r},${cy - r}L${cx + r},${cy + r}M${cx - r},${cy + r}L${cx + r},${cy - r}`;
const tri = (cx: number, cy: number, upDown: number, r: number) => (upDown > 0 ? `M${cx - r},${cy - r}L${cx + r},${cy - r}L${cx},${cy + r}Z` : `M${cx - r},${cy + r}L${cx + r},${cy + r}L${cx},${cy - r}Z`);
function niceStep(raw: number) {
  if (!(raw > 0)) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / e;
  return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * e;
}
function dateTicks(_bars: TBar[], v0: number, v1: number, n: number): number[] {
  const out: number[] = [], step = Math.max(1, Math.round((v1 - v0) / n));
  for (let i = v0 + Math.floor(step / 2); i <= v1; i += step) out.push(i);
  return out;
}
export const shortDate = (t: string) => {
  const d = t.slice(0, 10), h = t.slice(11, 16);
  const [y, m, dd] = d.split('-');
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(m) - 1] ?? m;
  return h && h !== '00:00' ? `${dd} ${mon} ${h}` : dd === '01' ? `${mon} ${y.slice(2)}` : `${dd} ${mon}`;
};
