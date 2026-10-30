// Pure helpers for the marking page: structure labels, snapping, line price / break, zone edges, chart regime.
import type { Anchor, MLine, MPivot, MZone, PivotKind, TBar } from './types';

/** ATR(14) per bar index (simple mean of the true range over the 14 bars ending at i; the first bars use what exists). */
export function atrSeries(bars: TBar[], period = 14): number[] {
  const tr = bars.map((b, i) => (i ? Math.max(b.h, bars[i - 1].c) - Math.min(b.l, bars[i - 1].c) : b.h - b.l));
  const out: number[] = [];
  let s = 0;
  for (let i = 0; i < tr.length; i++) {
    s += tr[i];
    if (i >= period) s -= tr[i - period];
    out.push(s / Math.min(i + 1, period));
  }
  return out;
}

export type StructLabel = 'HH' | 'HL' | 'LH' | 'LL' | 'EQH' | 'EQL' | 'H' | 'L';
/** HH / LH for peaks, HL / LL for valleys, each against the previous pivot of the same type (first = H / L). */
export function labelPivots(pivots: MPivot[]): { p: MPivot; label: StructLabel }[] {
  const s = [...pivots].sort((a, b) => a.i - b.i);
  let lastPeak: MPivot | null = null, lastValley: MPivot | null = null;
  return s.map(p => {
    let label: StructLabel;
    if (p.kind === 'peak') { label = !lastPeak ? 'H' : p.p > lastPeak.p ? 'HH' : p.p < lastPeak.p ? 'LH' : 'EQH'; lastPeak = p; }
    else { label = !lastValley ? 'L' : p.p > lastValley.p ? 'HL' : p.p < lastValley.p ? 'LL' : 'EQL'; lastValley = p; }
    return { p, label };
  });
}

/** Snap a tap to a pivot: the nearest candle; peak when the tap is nearer its high than its low. */
export function snapPivot(bars: TBar[], i: number, price: number, force?: PivotKind): MPivot {
  const b = bars[i];
  const kind: PivotKind = force ?? (Math.abs(price - b.h) <= Math.abs(price - b.l) ? 'peak' : 'valley');
  return { i, kind, p: kind === 'peak' ? b.h : b.l };
}

/** Snap a line anchor to the nearer wick extreme of candle i. */
export const snapWick = (bars: TBar[], i: number, price: number): Anchor => ({ i, p: Math.abs(price - bars[i].h) <= Math.abs(price - bars[i].l) ? bars[i].h : bars[i].l });

/** Price levels on candle i an anchor drag can stick to (wick and body ends). */
export const candleLevels = (b: TBar) => [b.h, b.l, Math.max(b.o, b.c), Math.min(b.o, b.c)];

export const lineAt = (l: Pick<MLine, 'a' | 'b'>, i: number) => l.a.p + ((l.b.p - l.a.p) * (i - l.a.i)) / Math.max(1e-9, l.b.i - l.a.i);
export const lineDir = (a: Anchor, b: Anchor): 1 | -1 => (b.p >= a.p ? 1 : -1);

/** First bar after the newer anchor whose CLOSE is beyond the line (up line: below it; down line: above it). */
export function firstCloseBreak(bars: TBar[], l: Pick<MLine, 'a' | 'b' | 'dir'>): number | null {
  for (let j = l.b.i + 1; j < bars.length; j++) { const v = lineAt(l, j); if (l.dir > 0 ? bars[j].c < v : bars[j].c > v) return j; }
  return null;
}
/** First bar after the newer anchor fully beyond the line (the engine's RemovedAt: up line = its high below it). */
export function firstFullBreak(bars: TBar[], l: Pick<MLine, 'a' | 'b' | 'dir'>): number | null {
  for (let j = l.b.i + 1; j < bars.length; j++) { const v = lineAt(l, j); if (l.dir > 0 ? bars[j].h < v : bars[j].l > v) return j; }
  return null;
}

/** Candles strictly between the anchors that the line cuts by more than tol (price units). */
export function lineCuts(bars: TBar[], l: Pick<MLine, 'a' | 'b' | 'dir'>, tol: number): number {
  let n = 0;
  for (let j = l.a.i + 1; j < l.b.i; j++) { const v = lineAt(l, j); if (l.dir > 0 ? v - bars[j].l > tol : bars[j].h - v > tol) n++; }
  return n;
}

/** Both edge options of a zone over base candles s..e: proximal on the bodies or the wicks, distal on the wicks or bodies. */
export function zoneEdges(bars: TBar[], s: number, e: number, side: 'demand' | 'supply') {
  const seg = bars.slice(Math.max(0, Math.min(s, e)), Math.max(s, e) + 1);
  const bodyHi = Math.max(...seg.map(b => Math.max(b.o, b.c))), bodyLo = Math.min(...seg.map(b => Math.min(b.o, b.c)));
  const wickHi = Math.max(...seg.map(b => b.h)), wickLo = Math.min(...seg.map(b => b.l));
  return side === 'demand'
    ? { proxBody: bodyHi, proxWick: wickHi, distWick: wickLo, distBody: bodyLo }
    : { proxBody: bodyLo, proxWick: wickLo, distWick: wickHi, distBody: bodyHi };
}
/** Snap a dragged price to the nearer of two options. */
export const nearer = (v: number, a: number, b: number) => (Math.abs(v - a) <= Math.abs(v - b) ? a : b);

/** Demand when the box is below the last close, supply when above (the owner can flip it). */
export function autoSide(bars: TBar[], lo: number, hi: number): 'demand' | 'supply' {
  const px = bars[bars.length - 1]?.c ?? 0;
  return (lo + hi) / 2 <= px ? 'demand' : 'supply';
}

/** Build a zone from a drag: base candles i0..i1, prices y0..y1 snapped to the nearest edge options. */
export function zoneFromDrag(bars: TBar[], i0: number, i1: number, y0: number, y1: number, side?: 'demand' | 'supply', id = `z${Date.now().toString(36)}`): MZone {
  const s = Math.min(i0, i1), e = Math.max(i0, i1), lo = Math.min(y0, y1), hi = Math.max(y0, y1);
  const sd = side ?? autoSide(bars, lo, hi);
  const E = zoneEdges(bars, s, e, sd);
  const proxDrag = sd === 'demand' ? hi : lo, distDrag = sd === 'demand' ? lo : hi;
  return { id, side: sd, s, e, prox: nearer(proxDrag, E.proxBody, E.proxWick), dist: nearer(distDrag, E.distWick, E.distBody) };
}

/** First bar after the base that CLOSES beyond the distal (the zone is gone from there). */
export function zoneRemovedAt(bars: TBar[], z: Pick<MZone, 'side' | 'e' | 'dist'>): number | null {
  for (let j = z.e + 1; j < bars.length; j++) if (z.side === 'demand' ? bars[j].c < z.dist : bars[j].c > z.dist) return j;
  return null;
}

export type Regime = 'up' | 'down' | 'range';
/** Trend of a chart: net move over the window in ATRs and the efficiency of the path (net / sum of |moves|). */
export function regimeOf(bars: TBar[]): Regime {
  if (bars.length < 10) return 'range';
  const a = atrSeries(bars), atr = a[a.length - 1] || 1e-9;
  const net = bars[bars.length - 1].c - bars[0].c;
  let path = 0;
  for (let i = 1; i < bars.length; i++) path += Math.abs(bars[i].c - bars[i - 1].c);
  const eff = path > 0 ? Math.abs(net) / path : 0;
  if (Math.abs(net) > 4 * atr && eff > 0.18) return net > 0 ? 'up' : 'down';
  return 'range';
}
