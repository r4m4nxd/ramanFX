// Drawing layer for the trade chart (lightweight-charts series primitive): horizontal lines, trendlines, zone boxes, notes.
import type { IChartApi, ISeriesApi, ISeriesPrimitive, ISeriesPrimitivePaneView, Logical, SeriesAttachedParameter, Time } from 'lightweight-charts';
import type { Drawing } from '@/core/types';

export interface DrawState { drawings: Drawing[]; pending: Drawing | null; preview: { t: number; p: number } | null }

/** UTC seconds ↔ fractional bar index, so drawings stay put across timeframes and beyond the last bar. */
export function timeAxis(t: number[], tfSec: number) {
  const n = t.length;
  const toLogical = (u: number): number => {
    if (!n) return 0;
    if (u <= t[0]) return (u - t[0]) / tfSec;
    if (u >= t[n - 1]) return n - 1 + (u - t[n - 1]) / tfSec;
    let lo = 0, hi = n - 1;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; if (t[m] <= u) lo = m; else hi = m; }
    return lo + (u - t[lo]) / Math.max(1, t[hi] - t[lo]);
  };
  const toTime = (l: number): number => {
    if (!n) return 0;
    if (l <= 0) return t[0] + l * tfSec;
    if (l >= n - 1) return t[n - 1] + (l - (n - 1)) * tfSec;
    const i = Math.floor(l);
    return Math.round(t[i] + (l - i) * (t[i + 1] - t[i]));
  };
  return { toLogical, toTime };
}

export class DrawLayer implements ISeriesPrimitive<Time> {
  private chart: IChartApi | null = null;
  private series: ISeriesApi<'Candlestick'> | null = null;
  private update: (() => void) | null = null;
  constructor(private st: DrawState, private axis: ReturnType<typeof timeAxis>, private fmt: (p: number) => string) {}
  attached(p: SeriesAttachedParameter<Time>) { this.chart = p.chart; this.series = p.series as ISeriesApi<'Candlestick'>; this.update = p.requestUpdate; }
  detached() { this.chart = this.series = this.update = null; }
  refresh() { this.update?.(); }
  paneViews(): readonly ISeriesPrimitivePaneView[] {
    return [{ zOrder: () => 'top', renderer: () => ({ draw: target => target.useMediaCoordinateSpace(({ context: ctx, mediaSize }) => this.draw(ctx, mediaSize.width)) }) }];
  }
  private xy(pt: { t: number; p: number }) {
    const x = this.chart!.timeScale().logicalToCoordinate(this.axis.toLogical(pt.t) as Logical);
    const y = this.series!.priceToCoordinate(pt.p);
    return x == null || y == null ? null : { x, y };
  }
  private draw(ctx: CanvasRenderingContext2D, width: number) {
    if (!this.chart || !this.series) return;
    const all = [...this.st.drawings];
    const pend = this.st.pending, pv = this.st.preview;
    if (pend) all.push(pend.kind === 'hline' || pend.kind === 'text' ? pend : { ...pend, b: pv ?? pend.a });
    ctx.save();
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    for (const d of all) {
      const a = this.xy(d.a);
      if (!a) continue;
      ctx.strokeStyle = d.color; ctx.fillStyle = d.color; ctx.lineWidth = 1.5; ctx.setLineDash(d === pend ? [4, 4] : []);
      if (d.kind === 'hline') {
        ctx.beginPath(); ctx.moveTo(0, a.y); ctx.lineTo(width, a.y); ctx.stroke();
        this.tag(ctx, `${d.text ? d.text + ' ' : ''}${this.fmt(d.a.p)}`, 6, a.y - 4, d.color);
      } else if (d.kind === 'text') {
        ctx.beginPath(); ctx.arc(a.x, a.y, 3, 0, Math.PI * 2); ctx.fill();
        this.tag(ctx, d.text ?? '', a.x + 6, a.y - 6, d.color);
      } else if (d.b) {
        const b = this.xy(d.b);
        if (!b) continue;
        if (d.kind === 'trend') {
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          for (const q of [a, b]) { ctx.beginPath(); ctx.arc(q.x, q.y, 2.5, 0, Math.PI * 2); ctx.fill(); }
        } else {
          const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(b.x - a.x), h = Math.abs(b.y - a.y);
          ctx.globalAlpha = 0.14; ctx.fillRect(x, y, w, h); ctx.globalAlpha = 1; ctx.strokeRect(x, y, w, h);
          if (d.text) this.tag(ctx, d.text, x + 4, y + 13, d.color);
        }
      }
    }
    ctx.restore();
  }
  private tag(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color: string) {
    if (!text) return;
    ctx.setLineDash([]);
    ctx.fillStyle = color; ctx.fillText(text, x, y);
  }
}
