// SVG candle chart for teaching scenes: auto-scaled, responsive (measures its width), themed through the
// colour tokens (fill-* / stroke-* utilities), with zones, lines, trendlines, notes and a highlight band.
// Interactive modes: click candles (spot questions), drag a rectangle (draw a zone), click a price (pick an entry).
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import type { Scene } from '@/core/interactive/types';
import { cx, ease } from '@/ui/kit';

export type LineKind = 'entry' | 'sl' | 'tp' | 'level' | 'proximal' | 'distal';
export interface SceneLine { y: number; label: string; kind: LineKind; from?: number; ghost?: boolean }
export interface SceneZone { from: number; to?: number; top: number; bottom: number; kind: 'demand' | 'supply'; label?: string; faded?: boolean; ghost?: boolean }
export interface DrawnZone { top: number; bottom: number; from: number; to: number }

export interface CandleSceneProps {
  scene: Scene;
  /** Candles drawn (the rest appear, one after another, when this grows). Default: all. */
  visibleCount?: number;
  height?: number;
  label: string;
  /** Spot questions: click (or arrow + Enter) a candle. */
  onCandleClick?: (index: number) => void;
  selected?: number[];
  /** After answering a spot question: the right candles, outlined. */
  correctRange?: { from: number; to: number } | null;
  mode?: 'view' | 'draw-zone' | 'pick-price';
  drawn?: DrawnZone | null;
  onZoneDraw?: (z: DrawnZone) => void;
  onPricePick?: (price: number) => void;
  /** Overlays added by the caller (the learner's picks, the revealed answer). Not used for scaling. */
  extraLines?: SceneLine[];
  extraZones?: SceneZone[];
  /** Hide the scene's highlight band (spot questions, so it doesn't give the answer away). */
  hideHighlight?: boolean;
  /** Seconds between candles as they appear. */
  stagger?: number;
  className?: string;
}

const PAD = { l: 8, r: 52, t: 22, b: 18 };
const LINE_TONE: Record<LineKind, { stroke: string; fill: string; text: string; dash?: string }> = {
  entry: { stroke: 'stroke-accent', fill: 'fill-accent', text: 'fill-on-accent' },
  sl: { stroke: 'stroke-loss', fill: 'fill-loss', text: 'fill-on-status' },
  tp: { stroke: 'stroke-profit', fill: 'fill-profit', text: 'fill-on-status' },
  proximal: { stroke: 'stroke-cyan', fill: 'fill-cyan', text: 'fill-on-status', dash: '5 4' },
  distal: { stroke: 'stroke-warn', fill: 'fill-warn', text: 'fill-on-status', dash: '5 4' },
  level: { stroke: 'stroke-ink3', fill: 'fill-ink3', text: 'fill-surface', dash: '2 4' },
};
export const fmtPrice = (p: number) => (Math.abs(p) >= 1000 ? p.toFixed(0) : p.toFixed(2));

function wrap(text: string, max = 26): string[] {
  const words = text.split(/\s+/); const out: string[] = []; let cur = '';
  for (const w of words) { if ((cur + ' ' + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
  if (cur) out.push(cur);
  return out.slice(0, 4);
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver(e => setW(Math.round(e[0].contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function CandleScene({ scene, visibleCount, height, label, onCandleClick, selected, correctRange, mode = 'view', drawn, onZoneDraw, onPricePick, extraLines, extraZones, hideHighlight, stagger = 0.07, className }: CandleSceneProps) {
  const reduce = !!useReducedMotion();
  const [wrapRef, measured] = useWidth<HTMLDivElement>();
  const W = measured || 640;
  const H = height ?? (W < 480 ? 230 : 290);
  const N = scene.candles.length;
  const shown = Math.max(0, Math.min(N, visibleCount ?? N));
  const descId = useId();

  // Scale over every candle and overlay (not only the visible ones), so revealing never rescales the chart.
  const { lo, hi } = useMemo(() => {
    const ys: number[] = [];
    scene.candles.forEach(c => ys.push(c.h, c.l));
    scene.zones?.forEach(z => ys.push(z.top, z.bottom));
    scene.lines?.forEach(l => ys.push(l.y));
    scene.trendlines?.forEach(t => ys.push(t.y1, t.y2));
    scene.notes?.forEach(n => ys.push(n.y));
    const a = Math.min(...ys), b = Math.max(...ys), pad = (b - a || 1) * 0.07;
    return { lo: a - pad, hi: b + pad };
  }, [scene]);
  const plotW = Math.max(40, W - PAD.l - PAD.r), plotH = H - PAD.t - PAD.b;
  const slot = plotW / Math.max(1, N);
  const cxOf = (i: number) => PAD.l + slot * (i + 0.5);
  const xL = (i: number) => PAD.l + slot * i;
  const py = (p: number) => PAD.t + (hi - p) / (hi - lo) * plotH;
  const priceAt = (y: number) => hi - ((y - PAD.t) / plotH) * (hi - lo);
  const clampY = (y: number) => Math.max(PAD.t, Math.min(PAD.t + plotH, y));
  const bodyW = Math.max(1.5, Math.min(14, slot * 0.62));

  // Candles that mount after the first paint stagger in from where the last reveal stopped.
  const prevShown = useRef(0);
  const first = useRef(true);
  useEffect(() => { prevShown.current = shown; first.current = false; }, [shown]);
  const delayFor = (i: number) => (reduce ? 0 : Math.max(0, i - prevShown.current) * (first.current ? Math.min(0.018, stagger) : stagger));

  // Price ticks
  const ticks = useMemo(() => {
    const span = hi - lo, raw = span / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) ?? raw;
    const out: number[] = []; for (let v = Math.ceil(lo / step) * step; v <= hi; v += step) out.push(+v.toFixed(6));
    return out;
  }, [lo, hi]);

  // Lines (scene + extra) with label collision avoidance on the right edge.
  const lines = useMemo(() => {
    const all = [...(scene.lines ?? []) as SceneLine[], ...(extraLines ?? [])].map(l => ({ ...l, py: py(l.y) }));
    const labels = all.map((l, i) => ({ i, y: l.py })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < labels.length; k++) if (labels[k].y - labels[k - 1].y < 15) labels[k].y = labels[k - 1].y + 15;
    const ly = new Map(labels.map(x => [x.i, x.y]));
    return all.map((l, i) => ({ ...l, ly: ly.get(i)! }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene.lines, extraLines, lo, hi, H]);

  // ─── interaction ───────────────────────────────────────────────
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<number | null>(null);        // keyboard candle cursor
  const [hoverY, setHoverY] = useState<number | null>(null);        // pick-price crosshair (svg y)
  const [drag, setDrag] = useState<{ x0: number; y0: number; x1: number; y1: number } | null>(null);
  const [announce, setAnnounce] = useState('');
  const local = (e: { clientX: number; clientY: number }) => { const r = svgRef.current!.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  const idxAt = (x: number) => Math.max(0, Math.min(N - 1, Math.floor((x - PAD.l) / slot)));
  const interactive = !!onCandleClick || mode !== 'view';

  const onDown = (e: RPointerEvent<SVGSVGElement>) => {
    if (mode === 'draw-zone') { const p = local(e); svgRef.current?.setPointerCapture?.(e.pointerId); setDrag({ x0: p.x, y0: clampY(p.y), x1: p.x, y1: clampY(p.y) }); e.preventDefault(); }
    if (mode === 'pick-price') { setHoverY(clampY(local(e).y)); }
  };
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    if (mode === 'draw-zone' && drag) { const p = local(e); setDrag({ ...drag, x1: p.x, y1: clampY(p.y) }); }
    if (mode === 'pick-price') setHoverY(clampY(local(e).y));
  };
  const onUp = (e: RPointerEvent<SVGSVGElement>) => {
    if (mode === 'draw-zone' && drag) {
      const a = priceAt(drag.y0), b = priceAt(drag.y1);
      if (Math.abs(drag.y1 - drag.y0) > 3) onZoneDraw?.({ top: Math.max(a, b), bottom: Math.min(a, b), from: idxAt(Math.min(drag.x0, drag.x1)), to: idxAt(Math.max(drag.x0, drag.x1)) });
      setDrag(null);
    }
    if (mode === 'pick-price') { const y = clampY(local(e).y); onPricePick?.(+priceAt(y).toFixed(2)); }
    if (onCandleClick && mode === 'view') { const p = local(e); if (p.x >= PAD.l && p.x <= PAD.l + plotW) { const i = idxAt(p.x); if (i < shown) { setCursor(i); onCandleClick(i); } } }
  };
  const onKey = (e: KeyboardEvent<SVGSVGElement>) => {
    if (onCandleClick && mode === 'view') {
      const max = shown - 1; let c = cursor ?? -1;
      if (e.key === 'ArrowRight') c = Math.min(max, c + 1); else if (e.key === 'ArrowLeft') c = Math.max(0, c < 0 ? max : c - 1);
      else if (e.key === 'Home') c = 0; else if (e.key === 'End') c = max;
      else if ((e.key === 'Enter' || e.key === ' ') && cursor != null) { e.preventDefault(); onCandleClick(cursor); return; } else return;
      e.preventDefault(); setCursor(c);
      const k = scene.candles[c]; setAnnounce(`Candle ${c + 1} of ${shown}, ${k.c >= k.o ? 'up' : 'down'}, open ${fmtPrice(k.o)}, close ${fmtPrice(k.c)}${selected?.includes(c) ? ', selected' : ''}`);
    }
    if (mode === 'pick-price') {
      const step = (hi - lo) / 100 * (e.shiftKey ? 10 : 1);
      const cur = hoverY == null ? (lo + hi) / 2 : priceAt(hoverY);
      let p = cur;
      if (e.key === 'ArrowUp') p = cur + step; else if (e.key === 'ArrowDown') p = cur - step;
      else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPricePick?.(+cur.toFixed(2)); return; } else return;
      e.preventDefault(); p = Math.max(lo, Math.min(hi, p)); setHoverY(py(p)); setAnnounce(`Price ${fmtPrice(p)}`);
    }
  };

  const fadeIn = reduce ? { initial: false as const } : { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.35, ease } };
  const plotR = PAD.l + plotW;
  const hl = !hideHighlight ? scene.highlight : undefined;
  const zones: SceneZone[] = [...(scene.zones ?? []), ...(extraZones ?? [])];

  const instructions = onCandleClick ? 'Click a candle, or focus the chart and use the arrow keys and Enter.' : mode === 'draw-zone' ? 'Drag a rectangle over the price range of your zone, or type the prices in the boxes below.' : mode === 'pick-price' ? 'Click a price, or focus the chart, use the up and down arrows and press Enter.' : '';

  return (
    <div ref={wrapRef} className={cx('relative w-full select-none', className)}>
      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} className={cx('block max-w-full rounded-xl', interactive && 'focus-visible:outline-2', mode === 'pick-price' && 'cursor-crosshair', mode === 'draw-zone' && 'cursor-crosshair', onCandleClick && 'cursor-pointer')}
        role={interactive ? 'application' : 'img'} aria-roledescription="candle chart" aria-label={label} aria-describedby={instructions ? descId : undefined}
        tabIndex={interactive ? 0 : undefined} onKeyDown={interactive ? onKey : undefined}
        onPointerDown={interactive ? onDown : undefined} onPointerMove={interactive ? onMove : undefined} onPointerUp={interactive ? onUp : undefined}
        onPointerLeave={() => { if (mode === 'pick-price') setHoverY(null); }}
        style={{ touchAction: mode === 'view' ? 'manipulation' : 'none', fontFamily: 'inherit' }}>
        {/* grid + price axis */}
        {ticks.map(t => (
          <g key={t}>
            <line x1={PAD.l} x2={plotR} y1={py(t)} y2={py(t)} className="stroke-line" strokeWidth={1} />
            <text x={W - 4} y={py(t) + 3.5} textAnchor="end" className="fill-ink3 num" fontSize={10}>{fmtPrice(t)}</text>
          </g>
        ))}

        {/* highlight band */}
        <AnimatePresence>
          {hl && (
            <motion.g key={`hl-${hl.from}-${hl.to}-${hl.label}`} {...fadeIn}>
              <rect x={xL(hl.from)} y={PAD.t - 4} width={slot * (hl.to - hl.from + 1)} height={plotH + 8} rx={6} className="fill-accent/10 stroke-accent/30" strokeWidth={1} />
              {hl.label && <text x={xL(hl.from) + 4} y={PAD.t - 8} className="fill-accent" fontSize={10.5} fontWeight={600}>{hl.label}</text>}
            </motion.g>
          )}
        </AnimatePresence>

        {/* future area (predict-then-reveal) */}
        <AnimatePresence>
          {shown < N && (
            <motion.g key="future" {...fadeIn}>
              <rect x={xL(shown)} y={PAD.t} width={plotR - xL(shown)} height={plotH} className="fill-raised/50" />
              <line x1={xL(shown)} x2={xL(shown)} y1={PAD.t} y2={PAD.t + plotH} className="stroke-ink3/60" strokeDasharray="3 4" />
              <text x={(xL(shown) + plotR) / 2} y={PAD.t + plotH / 2} textAnchor="middle" className="fill-ink3" fontSize={12} fontWeight={600}>What happens next?</text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* zones */}
        <AnimatePresence>
          {zones.map((z, k) => {
            const x1 = xL(z.from), x2 = z.to != null ? xL(z.to) + slot : plotR;
            const tone = z.kind === 'demand' ? 'fill-profit/15 stroke-profit/60' : 'fill-loss/15 stroke-loss/60';
            const y1 = py(z.top), y2 = py(z.bottom);
            return (
              <motion.g key={`z-${k}-${z.top}-${z.bottom}-${z.from}`} {...fadeIn} opacity={z.faded ? 0.45 : 1}>
                <rect x={x1} y={y1} width={Math.max(2, x2 - x1)} height={Math.max(2, y2 - y1)} rx={3} className={tone} strokeWidth={z.ghost ? 1.5 : 1} strokeDasharray={z.faded || z.ghost ? '4 3' : undefined} />
                {z.label && <text x={x1 + 4} y={y1 - 4 < PAD.t ? y2 + 11 : y1 - 4} className={z.kind === 'demand' ? 'fill-profit' : 'fill-loss'} fontSize={10.5} fontWeight={600}>{z.label}</text>}
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* candles */}
        {scene.candles.slice(0, shown).map((c, i) => {
          const up = c.c >= c.o, x = cxOf(i);
          const top = py(Math.max(c.o, c.c)), bot = py(Math.min(c.o, c.c));
          const tone = up ? 'fill-profit stroke-profit' : 'fill-loss stroke-loss';
          return (
            // Keyed by shape: a candle that changes between steps cross-fades in place; unchanged ones stay put.
            <motion.g key={`${i}:${c.o}:${c.h}:${c.l}:${c.c}`} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.35, ease, delay: delayFor(i) }}>
              <line x1={x} x2={x} y1={py(c.h)} y2={py(c.l)} className={tone} strokeWidth={1.2} />
              <rect x={x - bodyW / 2} width={bodyW} y={top} height={Math.max(1, bot - top)} rx={1} className={tone} strokeWidth={0.6} />
            </motion.g>
          );
        })}

        {/* spot: chosen / correct / keyboard cursor */}
        {correctRange && (
          <rect x={xL(correctRange.from) + 1} y={PAD.t - 2} width={slot * (correctRange.to - correctRange.from + 1) - 2} height={plotH + 4} rx={6} className="fill-profit/10 stroke-profit" strokeWidth={1.5} />
        )}
        {selected?.map(i => i < shown && (
          <rect key={`s${i}`} x={xL(i) + 1} y={py(scene.candles[i].h) - 5} width={slot - 2} height={py(scene.candles[i].l) - py(scene.candles[i].h) + 10} rx={4} className="fill-accent/15 stroke-accent" strokeWidth={1.5} />
        ))}
        {cursor != null && onCandleClick && cursor < shown && (
          <rect x={xL(cursor) + 0.5} y={PAD.t} width={slot - 1} height={plotH} rx={4} className="fill-none stroke-ink2" strokeDasharray="3 3" strokeWidth={1} />
        )}

        {/* trendlines */}
        <AnimatePresence>
          {scene.trendlines?.map((t, k) => (
            <motion.g key={`t-${k}-${t.x1}-${t.x2}-${t.broken}`} {...fadeIn}>
              <line x1={cxOf(t.x1)} y1={py(t.y1)} x2={cxOf(t.x2)} y2={py(t.y2)} className={t.broken ? 'stroke-ink3' : 'stroke-ink2'} strokeWidth={1.6} strokeDasharray={t.broken ? '6 5' : undefined} strokeLinecap="round" />
              {t.label && <text x={Math.min(plotR - 4, cxOf(t.x2) + 4)} y={py(t.y2) - 6} textAnchor={cxOf(t.x2) > plotR - 80 ? 'end' : 'start'} className="fill-ink2" fontSize={10.5} fontWeight={600}>{t.label}{t.broken ? ' (broken)' : ''}</text>}
            </motion.g>
          ))}
        </AnimatePresence>

        {/* horizontal lines */}
        <AnimatePresence>
          {lines.map((l, k) => {
            const t = LINE_TONE[l.kind] ?? LINE_TONE.level;
            const x1 = l.from != null ? xL(l.from) : PAD.l;
            const txt = `${l.label} ${fmtPrice(l.y)}`;
            const tw = Math.min(plotW * 0.6, txt.length * 5.9 + 10);
            return (
              <motion.g key={`l-${k}-${l.kind}-${l.y}-${l.ghost ? 'g' : ''}`} {...fadeIn}>
                <line x1={x1} x2={plotR} y1={l.py} y2={l.py} className={t.stroke} strokeWidth={l.ghost ? 1.4 : 1.5} strokeDasharray={l.ghost ? '2 3' : t.dash} opacity={l.ghost ? 0.85 : 1} />
                <g transform={`translate(${plotR - tw}, ${l.ly - 7})`}>
                  <rect width={tw} height={14} rx={7} className={l.ghost ? 'fill-surface stroke-line2' : t.fill} strokeWidth={1} opacity={l.ghost ? 0.95 : 0.92} />
                  <text x={tw / 2} y={10} textAnchor="middle" className={cx('num', l.ghost ? 'fill-ink' : t.text)} fontSize={9.5} fontWeight={600}>{txt}</text>
                </g>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* notes (callouts) */}
        <AnimatePresence>
          {scene.notes?.map((n, k) => {
            const ax = cxOf(Math.min(N - 1, Math.max(0, n.x))), ay = clampY(py(n.y));
            const rows = wrap(n.text, W < 480 ? 20 : 28);
            const bw = Math.max(...rows.map(r => r.length)) * 5.9 + 14, bh = rows.length * 13 + 8;
            const right = ax + 10 + bw <= plotR;
            const bx = right ? ax + 8 : Math.max(PAD.l, ax - 8 - bw);
            const above = ay - bh - 8 >= 2;
            const by = above ? ay - bh - 6 : Math.min(H - bh - 2, ay + 8);
            return (
              <motion.g key={`n-${k}-${n.text}`} {...fadeIn}>
                <line x1={ax} y1={ay} x2={right ? bx : bx + bw} y2={above ? by + bh : by} className="stroke-ink3" strokeWidth={1} />
                <circle cx={ax} cy={ay} r={3} className="fill-ink stroke-surface" strokeWidth={1.5} />
                <rect x={bx} y={by} width={bw} height={bh} rx={7} className="fill-surface stroke-line2" strokeWidth={1} />
                {rows.map((r, j) => <text key={j} x={bx + 7} y={by + 15 + j * 13} className="fill-ink" fontSize={10.5}>{r}</text>)}
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* the learner's zone (drawn or being drawn) */}
        {(drag || drawn) && (() => {
          const r = drag
            ? { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1), w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0), top: priceAt(Math.min(drag.y0, drag.y1)), bottom: priceAt(Math.max(drag.y0, drag.y1)) }
            : { x: xL(drawn!.from), y: py(drawn!.top), w: Math.max(slot, xL(drawn!.to) + slot - xL(drawn!.from)), h: py(drawn!.bottom) - py(drawn!.top), top: drawn!.top, bottom: drawn!.bottom };
          return (
            <g pointerEvents="none">
              <rect x={r.x} y={r.y} width={Math.max(2, r.w)} height={Math.max(2, r.h)} rx={3} className="fill-accent/15 stroke-accent" strokeWidth={1.5} strokeDasharray="5 3" />
              <text x={r.x + 4} y={r.y - 4} className="fill-accent num" fontSize={10} fontWeight={600}>{`You: ${fmtPrice(r.top)} – ${fmtPrice(r.bottom)}`}</text>
            </g>
          );
        })()}

        {/* pick-price crosshair */}
        {mode === 'pick-price' && hoverY != null && (
          <g pointerEvents="none">
            <line x1={PAD.l} x2={plotR} y1={hoverY} y2={hoverY} className="stroke-accent" strokeDasharray="3 3" strokeWidth={1} />
            <rect x={plotR + 2} y={hoverY - 8} width={PAD.r - 4} height={16} rx={8} className="fill-accent" />
            <text x={plotR + PAD.r / 2} y={hoverY + 3.5} textAnchor="middle" className="fill-on-accent num" fontSize={9.5} fontWeight={600}>{fmtPrice(priceAt(hoverY))}</text>
          </g>
        )}
      </svg>
      {instructions && <p id={descId} className="sr-only">{instructions}</p>}
      <div className="sr-only" aria-live="polite">{announce}</div>
    </div>
  );
}
