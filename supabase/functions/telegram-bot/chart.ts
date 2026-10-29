// Chart images for the Telegram bot: a pure SVG builder (no Deno, no network), rasterised to PNG by index.ts with
// resvg-wasm. Two layouts: 'quad' = ONE 1280x1280 image split 2x2 into four timeframes of the same symbol (highest TF
// top-left, Kevin's top-down view), 'single' = one large TF. Dark theme like the app: bg #0B0C10, violet #8B5CF6
// accent, demand #10B981, supply #EF4444. Text >= 20 px (legible on a phone at 1280 px). Font family 'Inter' (index.ts
// passes the font file; there are no system fonts on the edge). Text is plain ASCII / Latin + a few symbols (no emoji).

export interface Bar { t: string; o: number; h: number; l: number; c: number }
export interface Band {
  tf: string; side: 'demand' | 'supply'; prox: number; dist: number;
  key?: boolean;     // the panel's key zone (named in its header)
  host?: boolean;    // hosts the next-lower panel's key zone: outlined in violet (the nesting chain)
  light?: boolean;   // a higher-TF zone drawn for context (single view)
  label?: string;
}
export interface Lines { entry?: number | null; stop?: number | null; target?: number | null; kind?: string }
/** A trendline to draw (trendcore.ts panelTrendlines): pts = [drawn bar index (centres 0 .. n-1), price]; htf = the next
 *  higher timeframe's line projected onto this panel (gold dots), else the panel's own timeframe (solid lilac). */
export interface TLine { tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][] }
export interface Panel { tf: string; header: string; bars: Bar[]; zones: Band[]; lines?: Lines | null; note?: string; tls?: TLine[] }
export interface ChartModel { sym: string; title: string; digits: number; price: number; panels: Panel[]; layout: 'quad' | 'single' }

export const SIZE = 1280;
const C = { bg: '#0B0C10', panel: '#11131A', border: '#232634', text: '#E5E7EB', mute: '#9CA3AF', violet: '#8B5CF6', demand: '#10B981', supply: '#EF4444', up: '#34D399', down: '#F87171', grid: '#1B1E2A', tl: '#C4B5FD', gold: '#D4AF37' };
const TF_SHORT: Record<string, string> = { M15: '15m', H1: '1H', H4: '4H', D1: 'D1', W1: 'W1', MN: 'MN', '3M': '3M' };
export const tfLabel = (tf: string) => TF_SHORT[tf] ?? tf;

const x = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function dateLabel(t: string, tf: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(t);
  if (!m) return t.slice(0, 10);
  const mon = MON[Number(m[2]) - 1];
  if (tf === 'MN' || tf === '3M') return `${mon} ${m[1].slice(2)}`;
  if (tf === 'M15' && m[4]) return `${mon} ${Number(m[3])} ${m[4]}:${m[5]}`;
  if ((tf === 'H1' || tf === 'H4') && m[4]) return `${mon} ${Number(m[3])} ${m[4]}h`;
  return `${mon} ${Number(m[3])}`;
}
/** Truncate a header so it fits roughly `px` pixels at 20-22 px Inter (about 11 px per character). */
export const clip = (s: string, px: number) => { const n = Math.max(8, Math.floor(px / 11.5)); return s.length > n ? `${s.slice(0, n - 1)}…` : s; };

export interface Box { x: number; y: number; w: number; h: number }
/** Panel boxes: quad = 2x2 under the title strip, single = one box. */
export function boxes(layout: 'quad' | 'single', n: number): Box[] {
  const top = 72, bottom = 44, gap = 12, pad = 12;
  const W = SIZE - 2 * pad, H = SIZE - top - bottom;
  if (layout === 'single' || n === 1) return [{ x: pad, y: top, w: W, h: H }];
  const w = (W - gap) / 2, h = (H - gap) / 2;
  return [0, 1, 2, 3].slice(0, n).map(i => ({ x: pad + (i % 2) * (w + gap), y: top + Math.floor(i / 2) * (h + gap), w, h }));
}

export interface PanelGeom { plot: Box; lo: number; hi: number; y: (p: number) => number }
/** Price range: the bars, the price, the key zone and the trade lines, padded 6%. */
export function geom(p: Panel, b: Box, price: number): PanelGeom {
  const plot = { x: b.x + 14, y: b.y + 50, w: b.w - 14 - 112, h: b.h - 50 - 36 };
  const vals: number[] = [price];
  for (const r of p.bars) vals.push(r.h, r.l);
  for (const z of p.zones) if (z.key || z.host) vals.push(z.prox, z.dist);
  for (const v of [p.lines?.entry, p.lines?.stop, p.lines?.target]) if (typeof v === 'number') vals.push(v);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (!(hi > lo)) { hi = lo * 1.01 + 1e-9; lo = lo * 0.99; }
  const padv = (hi - lo) * 0.06;
  lo -= padv; hi += padv;
  return { plot, lo, hi, y: (v: number) => plot.y + (hi - v) / (hi - lo) * plot.h };
}

function panelSvg(p: Panel, b: Box, m: ChartModel, i: number): string {
  const g = geom(p, b, m.price);
  const { plot } = g;
  const dg = m.digits;
  const fmt = (v: number) => v.toFixed(dg);
  const out: string[] = [];
  const cid = `c${i}`;
  out.push(`<rect x="${f1(b.x)}" y="${f1(b.y)}" width="${f1(b.w)}" height="${f1(b.h)}" rx="14" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>`);
  out.push(`<clipPath id="${cid}"><rect x="${f1(plot.x)}" y="${f1(plot.y)}" width="${f1(plot.w)}" height="${f1(plot.h)}"/></clipPath>`);
  // header: TF in violet, then the key zone + status
  out.push(`<text x="${f1(b.x + 16)}" y="${f1(b.y + 34)}" font-size="${m.layout === 'quad' ? 22 : 26}" font-weight="600" fill="${C.text}"><tspan fill="${C.violet}">${x(tfLabel(p.tf))}</tspan>${p.header ? ` <tspan fill="${C.mute}">·</tspan> ${x(clip(p.header, b.w - 90))}` : ''}</text>`);
  const yPrice = Math.min(Math.max(g.y(m.price), plot.y), plot.y + plot.h);
  // grid + price axis (4 ticks; none under the price label)
  for (let k = 0; k <= 3; k++) {
    const v = g.lo + (g.hi - g.lo) * (0.1 + 0.8 * k / 3);
    const yy = g.y(v);
    out.push(`<line class="grid" x1="${f1(plot.x)}" x2="${f1(plot.x + plot.w)}" y1="${f1(yy)}" y2="${f1(yy)}" stroke="${C.grid}" stroke-width="1"/>`);
    if (Math.abs(yy - yPrice) > 30) out.push(`<text x="${f1(plot.x + plot.w + 8)}" y="${f1(yy + 7)}" font-size="20" fill="${C.mute}">${fmt(v)}</text>`);
  }
  // zone bands (lighter ones first)
  const zs = [...p.zones].sort((a, z) => Number(!!a.key || !!a.host) - Number(!!z.key || !!z.host));
  const parts: string[] = [];
  for (const z of zs) {
    const top = g.y(Math.max(z.prox, z.dist)), bot = g.y(Math.min(z.prox, z.dist));
    if (bot < plot.y || top > plot.y + plot.h) continue;      // fully outside the view
    const col = z.side === 'demand' ? C.demand : C.supply;
    const op = z.light ? 0.10 : z.key || z.host ? 0.26 : 0.16;
    const yt = Math.max(top, plot.y), yb = Math.min(bot, plot.y + plot.h);
    parts.push(`<rect class="zone ${z.side}${z.key ? ' key' : ''}${z.host ? ' host' : ''}" data-tf="${x(z.tf)}" x="${f1(plot.x)}" y="${f1(yt)}" width="${f1(plot.w)}" height="${f1(Math.max(2, yb - yt))}" fill="${col}" fill-opacity="${op}"${z.host ? ` stroke="${C.violet}" stroke-width="3"` : ''}/>`);
    const lab = z.label ?? (z.key || z.host ? `${tfLabel(z.tf)} ${z.side}${z.host ? ' (hosts the lower TF zone)' : ''}` : '');
    if (lab && yb - yt >= 4) parts.push(`<text class="zlabel" x="${f1(plot.x + 8)}" y="${f1(Math.min(yb - 4, yt + 22))}" font-size="20" fill="${col}">${x(clip(lab, plot.w - 20))}</text>`);
  }
  out.push(`<g clip-path="url(#${cid})">${parts.join('')}`);
  const n = Math.max(p.bars.length, 1), step = plot.w / n, cw = Math.max(1.5, step * 0.62);
  // trendlines: the panel's own TF solid lilac, the next higher TF gold dots; a small label at the right end
  const labels: number[] = [], tlText: string[] = [];
  for (const t of [...(p.tls ?? [])].sort((a, z) => Number(z.htf) - Number(a.htf))) {
    const xy = t.pts.map(([k, v]) => [plot.x + step * (k + 0.5), g.y(v)] as const);
    if (xy.length < 2) continue;
    const col = t.htf ? C.gold : C.tl;
    const d = xy.map(([px, py], j) => `${j ? 'L' : 'M'}${f1(px)} ${f1(py)}`).join('');
    out.push(`<path class="tl ${t.htf ? 'htf' : 'ltf'} ${t.dir > 0 ? 'up' : 'down'}" data-tf="${x(t.tf)}" d="${d}" fill="none" stroke="${col}"`
      + (t.htf ? ' stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0.5 11"' : ' stroke-width="2.6"')
      + ` stroke-opacity="${t.crossed ? 0.6 : 0.95}"/>`);
    // label at the rightmost point inside the plot, nudged off the other labels
    const inside = xy.filter(([, py]) => py >= plot.y + 22 && py <= plot.y + plot.h - 8);
    if (!inside.length) continue;
    const [lx0, ly0] = inside[inside.length - 1];
    let ly = ly0 + (t.dir > 0 ? 24 : -10);
    for (let k = 0; k < 3 && labels.some(v => Math.abs(v - ly) < 22); k++) ly += t.dir > 0 ? 22 : -22;
    ly = Math.min(Math.max(ly, plot.y + 22), plot.y + plot.h - 8);
    labels.push(ly);
    tlText.push(`<text class="tllabel" x="${f1(Math.min(lx0, plot.x + plot.w) - 6)}" y="${f1(ly)}" font-size="20" text-anchor="end" fill="${col}" stroke="${C.panel}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${x(`${tfLabel(t.tf)} ${t.dir > 0 ? 'up' : 'down'}${t.crossed ? ' (crossed)' : ''}`)}</text>`);
  }
  // candles
  for (let k = 0; k < p.bars.length; k++) {
    const r = p.bars[k];
    const cx = plot.x + step * (k + 0.5);
    const up = r.c >= r.o, col = up ? C.up : C.down;
    const yo = g.y(r.o), yc = g.y(r.c);
    out.push(`<line class="wick" x1="${f1(cx)}" x2="${f1(cx)}" y1="${f1(g.y(r.h))}" y2="${f1(g.y(r.l))}" stroke="${col}" stroke-width="1.5"/>`);
    out.push(`<rect class="candle" x="${f1(cx - cw / 2)}" y="${f1(Math.min(yo, yc))}" width="${f1(cw)}" height="${f1(Math.max(1.5, Math.abs(yc - yo)))}" fill="${col}"/>`);
  }
  out.push(...tlText);   // trendline labels above the candles
  // trade lines (entry TF only)
  const L = p.lines;
  if (L) {
    for (const [k, v, col] of [['entry', L.entry, C.violet], ['stop', L.stop, C.supply], ['target', L.target, C.demand]] as const) {
      if (typeof v !== 'number') continue;
      const yy = g.y(v);
      out.push(`<line class="trade ${k}" x1="${f1(plot.x)}" x2="${f1(plot.x + plot.w)}" y1="${f1(yy)}" y2="${f1(yy)}" stroke="${col}" stroke-width="2.5" stroke-dasharray="${k === 'entry' ? '0' : '10 6'}"/>`);
      out.push(`<text x="${f1(plot.x + plot.w - 8)}" y="${f1(yy - 6)}" font-size="20" font-weight="600" text-anchor="end" fill="${col}">${x(`${k === 'entry' && L.kind ? `${L.kind} ` : ''}${k} ${fmt(v)}`)}</text>`);
    }
  }
  out.push('</g>');
  // current price line + label on the axis
  const yp = yPrice;
  out.push(`<line class="price" x1="${f1(plot.x)}" x2="${f1(plot.x + plot.w)}" y1="${f1(yp)}" y2="${f1(yp)}" stroke="${C.violet}" stroke-width="2" stroke-dasharray="6 5"/>`);
  out.push(`<rect x="${f1(plot.x + plot.w + 2)}" y="${f1(yp - 15)}" width="108" height="30" rx="6" fill="${C.violet}"/>`);
  out.push(`<text class="plabel" x="${f1(plot.x + plot.w + 8)}" y="${f1(yp + 7)}" font-size="20" font-weight="600" fill="#FFFFFF">${fmt(m.price)}</text>`);
  // time labels: first, middle, last
  if (p.bars.length) {
    const idx = [...new Set([0, Math.floor((p.bars.length - 1) / 2), p.bars.length - 1])];
    idx.forEach((k, j) => {
      const cx = plot.x + step * (k + 0.5);
      const anchor = j === 0 ? 'start' : j === idx.length - 1 ? 'end' : 'middle';
      out.push(`<text x="${f1(j === 0 ? plot.x : j === idx.length - 1 ? plot.x + plot.w : cx)}" y="${f1(plot.y + plot.h + 28)}" font-size="20" text-anchor="${anchor}" fill="${C.mute}">${x(dateLabel(p.bars[k].t, p.tf))}</text>`);
    });
  } else {
    out.push(`<text x="${f1(plot.x + plot.w / 2)}" y="${f1(plot.y + plot.h / 2)}" font-size="22" text-anchor="middle" fill="${C.mute}">no candles published for ${x(tfLabel(p.tf))}</text>`);
  }
  if (p.note) out.push(`<text x="${f1(plot.x + 8)}" y="${f1(plot.y + plot.h - 10)}" font-size="20" fill="${C.mute}">${x(p.note)}</text>`);
  return `<g class="panel" data-tf="${x(p.tf)}">${out.join('')}</g>`;
}

export function renderSvg(m: ChartModel): string {
  const bx = boxes(m.layout, m.panels.length);
  const body = m.panels.map((p, i) => panelSvg(p, bx[i], m, i)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" font-family="Inter">`
    + `<rect width="${SIZE}" height="${SIZE}" fill="${C.bg}"/>`
    + `<text x="16" y="48" font-size="34" font-weight="600" fill="${C.text}">${x(m.title)}</text>`
    + `<text x="${SIZE - 16}" y="48" font-size="22" text-anchor="end" fill="${C.violet}">RamanFX</text>`
    + body
    + `<text x="16" y="${SIZE - 14}" font-size="20" fill="${C.mute}">Shaded = zones · violet outline = hosts lower-TF zone · lilac = trendline · gold dots = higher-TF trendline</text>`
    + `<text x="${SIZE - 16}" y="${SIZE - 14}" font-size="20" text-anchor="end" fill="${C.mute}">not advice</text>`
    + '</svg>';
}

// ---- bar helpers -------------------------------------------------------------------------------------------------
/** Group bars into a higher timeframe by a key of their date ('YYYY-MM' for months, 'YYYY-Qn', ISO-week Monday). */
export function aggregate(bars: Bar[], key: (t: string) => string): Bar[] {
  const out: Bar[] = [];
  let cur: Bar | null = null, ck = '';
  for (const b of bars) {
    const k = key(b.t);
    if (!cur || k !== ck) {
      if (cur) out.push(cur);
      cur = { ...b }; ck = k;
    } else {
      cur.h = Math.max(cur.h, b.h); cur.l = Math.min(cur.l, b.l); cur.c = b.c;
    }
  }
  if (cur) out.push(cur);
  return out;
}
export const monthKey = (t: string) => t.slice(0, 7);
export const quarterKey = (t: string) => `${t.slice(0, 4)}-Q${Math.floor((Number(t.slice(5, 7)) - 1) / 3)}`;
export const weekKey = (t: string) => {
  const d = new Date(`${t.slice(0, 10)}T00:00:00Z`);
  const wd = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - wd * 86400000).toISOString().slice(0, 10);
};
