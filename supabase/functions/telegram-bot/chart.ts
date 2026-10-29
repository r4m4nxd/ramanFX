// Chart images for the Telegram bot: a pure SVG builder (no Deno, no network), rasterised to PNG by index.ts with
// resvg-wasm. Two layouts: 'quad' = ONE 1280x1280 image split 2x2 into four timeframes of the same symbol (highest TF
// top-left, Kevin's top-down view), 'single' = one large TF. Dark theme like the app: bg #0B0C10, violet accent,
// demand green, supply red. Text >= 20 px (legible on a phone at 1280 px). Font family 'Inter' (index.ts passes an
// Inter SUBSET: Latin-1 + – — ’ … ↑ → ↓ − ≤ ≥, so no ▲▼ or emoji). Layout rules (owner review, Oct 2026):
//   - title + an optional one-line verdict under it; each panel header = the nearest demand below AND the nearest
//     supply above with % distance (two lines when one does not fit), an optional amber nesting note under it;
//   - the y-range always holds every zone drawn (the nearest zone each side of price, the key / host zones and the
//     zones crossing the candles, each extended at most 60% of the candle range; a nearest zone further out gets an
//     edge chip '↑ MN supply 124–147 · 25%' instead); every drawn zone has a label chip (solid background, zone
//     colour, stacked so none collide); a zone that cannot get a label is not drawn;
//   - trendline labels sit at the line's end in the right margin; empty candle slots on the right (~8%) keep the last
//     candle clear of the price scale; the forming candle is hollow with a violet tick under it;
//   - date axis per TF: 3M / MN / W1 'Jan 2016', D1 'Sep 17' (+ "'25" on the first tick and at year changes),
//     intraday 'Oct 29 09:30'.

export interface Bar { t: string; o: number; h: number; l: number; c: number }
export interface Band {
  tf: string; side: 'demand' | 'supply'; prox: number; dist: number;
  key?: boolean;     // the panel's key zone (named in its header)
  host?: boolean;    // hosts the next-lower panel's key zone: outlined in violet (the nesting chain)
  light?: boolean;   // a zone of another TF drawn for context (higher TF in the single view, W1 on stock D1 / intraday)
  wide?: boolean;    // too tall to be a precise level: lighter, dashed, tagged 'wide'
  t0?: string;       // base start: time of the zone's oldest base candle (ZoneVision's box start)
  k0?: number;       // drawn bar index where the box starts (-1 = before the first drawn bar); undefined = full width
  label?: string;
}
export interface Lines { entry?: number | null; stop?: number | null; target?: number | null; kind?: string }
/** A trendline to draw (zvTrend.ts panelTrendlines): pts = [drawn bar index (centres 0 .. n-1), price]; htf = the next
 *  higher timeframe's line projected onto this panel (gold dots), else the panel's own timeframe (solid lilac). */
export interface TLine { tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][]; kind?: 'trend' | 'momentum' }
export interface Panel {
  tf: string; header: string; bars: Bar[]; zones: Band[]; lines?: Lines | null; note?: string; tls?: TLine[];
  forming?: boolean;          // the last bar is still forming (drawn hollow)
  nestNote?: string | null;   // e.g. 'MN zone outside 3M zone' (amber, under the header)
}
export interface ChartModel { sym: string; title: string; digits: number; price: number; panels: Panel[]; layout: 'quad' | 'single'; verdict?: string | null }

export const SIZE = 1280;
const C = {
  bg: '#0B0C10', panel: '#11131A', border: '#232634', text: '#E5E7EB', mute: '#9CA3AF', violet: '#8B5CF6', tag: '#7C3AED',
  demand: '#10B981', supply: '#EF4444', demandTxt: '#34D399', supplyTxt: '#FCA5A5', up: '#34D399', down: '#F87171',
  grid: '#1B1E2A', tl: '#C4B5FD', gold: '#D4AF37', momentum: '#F87171', amber: '#FBBF24', verdict: '#D1D5DB',
};
const TF_SHORT: Record<string, string> = { M15: '15m', H1: '1H', H4: '4H', D1: 'D1', W1: 'W1', MN: 'MN', '3M': '3M' };
export const tfLabel = (tf: string) => TF_SHORT[tf] ?? tf;

const x = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Approximate rendered width of Inter text (px) at a font size: per-glyph advance widths in em. */
export function textW(s: string, size: number): number {
  let w = 0;
  for (const ch of s) {
    if (/[0-9]/.test(ch)) w += 0.62;
    else if (/[a-z]/.test(ch)) w += /[ijlft]/.test(ch) ? 0.3 : /[mw]/.test(ch) ? 0.85 : 0.56;
    else if (/[A-Z]/.test(ch)) w += /[MW]/.test(ch) ? 0.88 : /I/.test(ch) ? 0.3 : 0.68;
    else if (ch === ' ') w += 0.28;
    else if (/[.,:;'’·|]/.test(ch)) w += 0.3;
    else if (ch === '%') w += 0.86;
    else if (/[↑↓→]/.test(ch)) w += 0.75;
    else w += 0.6;
  }
  return w * size;
}
/** Truncate text so it fits `px` pixels at a font size. */
export function fitText(s: string, px: number, size: number): string {
  if (textW(s, size) <= px) return s;
  let t = s;
  while (t.length > 4 && textW(`${t}…`, size) > px) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}
/** Truncate a header so it fits roughly `px` pixels at 20-22 px Inter. */
export const clip = (s: string, px: number) => fitText(s, px, 21);

// ---- numbers ---------------------------------------------------------------------------------------------------------
/** A zone's prices with as many decimals as its height needs (2 significant digits of the height + `extra`, at most
 *  `digits`): 96.14–94.36 -> '96.1–94.4' (extra 0), 124.22–146.87 -> '124–147'; labels use extra 1 ('124.2–146.9'). */
export function zoneRange(a: number, b: number, digits: number, extra = 0): string {
  const h = Math.abs(a - b);
  const dec = h > 0 ? Math.min(digits, Math.max(0, Math.ceil(-Math.log10(h)) + 1 + extra)) : digits;
  return `${a.toFixed(dec)}–${b.toFixed(dec)}`;
}
export const pctText = (p: number) => (p < 0.05 ? '<0.1%' : p < 10 ? `${p.toFixed(1)}%` : `${Math.round(p)}%`);
const zlo = (z: Band) => Math.min(z.prox, z.dist), zhi = (z: Band) => Math.max(z.prox, z.dist);

// ---- date axis -------------------------------------------------------------------------------------------------------
const INTRA = new Set(['M15', 'H1', 'H4']);
interface Ymd { y: number; m: number; d: number; hm: string }
function ymd(t: string): Ymd | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/.exec(t);
  return m ? { y: +m[1], m: +m[2], d: +m[3], hm: m[4] ? `${m[4]}:${m[5]}` : '' } : null;
}
/** A date label that can not be misread: '3M' / 'MN' / 'W1' -> 'Jan 2016'; 'D1' -> 'Sep 17' (+ " '25" when `year`);
 *  intraday -> 'Oct 29 09:30'. */
export function dateLabel(t: string, tf: string, year = false): string {
  const p = ymd(t);
  if (!p) return t.slice(0, 10);
  const mon = MON[p.m - 1];
  if (tf === 'MN' || tf === '3M' || tf === 'W1') return `${mon} ${p.y}`;
  if (INTRA.has(tf)) return `${mon} ${p.d}${p.hm ? ` ${p.hm}` : ''}`;
  return `${mon} ${p.d}${year ? ` '${String(p.y).slice(2)}` : ''}`;
}
/** Axis ticks: bars that start a period (year for 3M / MN, quarter then month for W1, month then half-month for D1, day
 *  then 4 / 1 hours intraday), thinned so the labels never touch, 3-7 of them (5+ when the plot is wide); evenly spaced
 *  bars when there are too few boundaries. Returns [bar index, label]. */
export function axisTicks(bars: Bar[], tf: string, slotPx: number, plotW: number, size = 20): [number, string][] {
  const n = bars.length;
  if (!n) return [];
  const levels: ((p: Ymd) => string)[] = tf === 'MN' || tf === '3M' ? [p => `${p.y}`, p => `${p.y}-${Math.floor((p.m - 1) / 6)}`]
    : tf === 'W1' ? [p => `${p.y}-${Math.floor((p.m - 1) / 3)}`, p => `${p.y}-${p.m}`]
      : tf === 'D1' ? [p => `${p.y}-${p.m}`, p => `${p.y}-${p.m}-${p.d < 15 ? 0 : 1}`]
        : [p => `${p.y}-${p.m}-${p.d}`, p => `${p.y}-${p.m}-${p.d}-${Math.floor(+p.hm.slice(0, 2) / 4)}`, p => `${p.y}-${p.m}-${p.d}-${p.hm.slice(0, 2)}`];
  const lab = (i: number, k: number, prev: number | null) => {
    const y = ymd(bars[i].t)?.y, py = prev == null ? null : ymd(bars[prev].t)?.y;
    return dateLabel(bars[i].t, tf, tf === 'D1' && (k === 0 || y !== py));
  };
  const fit = (idx: number[]): [number, string][] => {
    for (let stride = 1; stride <= idx.length; stride++) {
      const pick = idx.filter((_, k) => k % stride === (idx.length - 1) % stride);
      const out: [number, string][] = [];
      let right = -Infinity, ok = true, prev: number | null = null;
      pick.forEach((i, k) => {
        const s = lab(i, k, prev), w = textW(s, size), cx = slotPx * (i + 0.5);
        if (cx - w / 2 < 0 || cx + w / 2 > plotW) return;
        if (cx - w / 2 < right + 14) { ok = false; return; }
        out.push([i, s]); right = cx + w / 2; prev = i;
      });
      if (ok && out.length && out.length <= 7) return out;
    }
    return [];
  };
  const want = plotW > 800 ? 5 : 3;
  let best: [number, string][] = [];
  for (const per of levels) {
    const idx: number[] = [];
    for (let i = 1; i < n; i++) { const a = ymd(bars[i].t), b = ymd(bars[i - 1].t); if (a && b && per(a) !== per(b)) idx.push(i); }
    const t = idx.length >= 2 ? fit(idx) : [];
    if (t.length > best.length) best = t;
    if (best.length >= want) break;
  }
  if (best.length < 2) best = fit([0, Math.floor(n / 4), Math.floor(n / 2), Math.floor(3 * n / 4), n - 1].filter((v, i, a) => a.indexOf(v) === i));
  // a few bars inside one month ('Oct 2026' three times): day labels instead, then no repeats at all
  if (new Set(best.map(b => b[1])).size < best.length) best = best.map(([i]) => [i, INTRA.has(tf) ? dateLabel(bars[i].t, tf) : dateLabel(bars[i].t, 'D1', true)]);
  best = best.filter((b, k) => !best.slice(0, k).some(o => o[1] === b[1]));
  return best.length ? best : [[n - 1, dateLabel(bars[n - 1].t, tf, true)]];
}

// ---- boxes -----------------------------------------------------------------------------------------------------------
export interface Box { x: number; y: number; w: number; h: number }
/** Panel boxes: quad = 2x2 under the title strip, single = one box. `top` = the title strip's height. */
export function boxes(layout: 'quad' | 'single', n: number, top = 72): Box[] {
  const bottom = 44, gap = 12, pad = 12;
  const W = SIZE - 2 * pad, H = SIZE - top - bottom;
  if (layout === 'single' || n === 1) return [{ x: pad, y: top, w: W, h: H }];
  const w = (W - gap) / 2, h = (H - gap) / 2;
  return [0, 1, 2, 3].slice(0, n).map(i => ({ x: pad + (i % 2) * (w + gap), y: top + Math.floor(i / 2) * (h + gap), w, h }));
}

// ---- panel header ------------------------------------------------------------------------------------------------------
interface Near { z: Band; pct: number; inside: boolean }
/** The zone timeframe a panel's header talks about: its own TF, else the TF of its key zone (stock D1 -> W1). */
const zoneTfOf = (p: Panel) => (p.zones.some(z => z.tf === p.tf) ? p.tf : p.zones.find(z => z.key)?.tf ?? p.zones.find(z => !z.light)?.tf ?? p.zones[0]?.tf ?? p.tf);
/** Nearest demand at / below price and nearest supply at / above it among the panel's zones of `tf`. */
export function nearestZones(zones: Band[], tf: string, price: number): { dem: Near | null; sup: Near | null } {
  let dem: Near | null = null, sup: Near | null = null;
  for (const z of zones) {
    if (z.tf !== tf) continue;
    const lo = zlo(z), hi = zhi(z), inside = price >= lo && price <= hi;
    if (z.side === 'demand' && (inside || hi < price)) {
      const pct = inside ? 0 : (price - hi) / price * 100;
      if (!dem || pct < dem.pct) dem = { z, pct, inside };
    }
    if (z.side === 'supply' && (inside || lo > price)) {
      const pct = inside ? 0 : (lo - price) / price * 100;
      if (!sup || pct < sup.pct) sup = { z, pct, inside };
    }
  }
  return { dem, sup };
}
const nearText = (n: Near | null, side: 'demand' | 'supply', digits: number) => {
  if (!n) return side === 'demand' ? '↓ no demand below' : '↑ no supply above';
  const r = zoneRange(n.z.prox, n.z.dist, digits), w = n.z.wide ? ' (wide)' : '';
  return n.inside ? `in ${side} ${r}${w}` : `${side === 'demand' ? '↓' : '↑'} ${side} ${r}${w} · ${pctText(n.pct)}`;
};
/** Header lines (after the TF tag): one line 'demand · | supply ·' when it fits, else demand / supply on two lines. */
export function headerLines(p: Panel, price: number, digits: number, px: number, size: number): string[] {
  if (!p.zones.length) return [p.header || 'no zone in view'];
  const ztf = zoneTfOf(p);
  const { dem, sup } = nearestZones(p.zones, ztf, price);
  const pre = ztf !== p.tf ? `${tfLabel(ztf)} zones: ` : '';
  const d = nearText(dem, 'demand', digits), s = nearText(sup, 'supply', digits);
  const one = `${pre}${d} | ${s}`;
  if (textW(one, size) <= px) return [one];
  return [fitText(`${pre}${s}`, px, size), fitText(d, px, size)];
}

// ---- geometry -------------------------------------------------------------------------------------------------------
interface DrawZone { z: Band; lo: number; hi: number; pri: number; label: string }
interface EdgeChip { z: Band; up: boolean; label: string }
export interface PanelGeom {
  plot: Box; lo: number; hi: number; y: (p: number) => number;
  head: string[]; headSize: number; slots: number; step: number; axisW: number;
  zones: DrawZone[]; edges: EdgeChip[];
}
const RIGHT_PAD = 0.08;      // empty candle slots on the right, share of the drawn bars (>= 3)
/** Right margin (price scale, price tag, trendline labels): sized to the price's digits, at least 108 px. */
export const axisWidth = (price: number, digits: number) => Math.max(108, Math.ceil(textW(price.toFixed(digits), 20) * 1.08 + 22));
const CHIP_H = 28;
/** Plot box, price range and the zones to draw (see the file header for the rules). */
export function geom(p: Panel, b: Box, price: number, digits = 5): PanelGeom {
  const quad = b.w < SIZE / 2;
  const headSize = quad ? 21 : 25;
  const headPx = b.w - 32 - textW(tfLabel(p.tf), headSize) - 20;
  const head = headerLines(p, price, digits, headPx, headSize);
  const nLines = head.length + (p.nestNote ? 1 : 0);
  const top = 16 + nLines * (headSize + 8) + 4;
  const axisW = axisWidth(price, digits);
  const plot = { x: b.x + 14, y: b.y + top, w: b.w - 14 - axisW, h: b.h - top - 36 };
  const n = Math.max(p.bars.length, 1), slots = n + Math.max(3, Math.ceil(n * RIGHT_PAD)), step = plot.w / slots;
  // base range: candles, price, trade lines
  const vals: number[] = [price];
  for (const r of p.bars) vals.push(r.h, r.l);
  for (const v of [p.lines?.entry, p.lines?.stop, p.lines?.target]) if (typeof v === 'number') vals.push(v);
  let lo = Math.min(...vals), hi = Math.max(...vals);
  if (!(hi > lo)) { hi = lo * 1.01 + 1e-9; lo = lo * 0.99; }
  const span = hi - lo, limLo = lo - 0.6 * span, limHi = hi + 0.6 * span;
  const ztf = zoneTfOf(p);
  const { dem, sup } = nearestZones(p.zones, ztf, price);
  const required = new Set<Band>([dem?.z, sup?.z, ...p.zones.filter(z => z.key || z.host)].filter((z): z is Band => !!z));
  const cand: Band[] = [], edges: EdgeChip[] = [];
  let lo2 = lo, hi2 = hi;
  for (const z of p.zones) {
    const crosses = zlo(z) <= hi && zhi(z) >= lo;
    if (!crosses && !required.has(z)) continue;
    // a zone crossing the candles is drawn (extended up to the limit); any other is drawn only when it fits whole,
    // else the nearest one each side gets an edge chip
    if (!crosses && (zlo(z) < limLo || zhi(z) > limHi)) {
      if (z === dem?.z || z === sup?.z || z.key || z.host) {
        const pct = zlo(z) > price ? (zlo(z) - price) / price * 100 : (price - zhi(z)) / price * 100;
        edges.push({ z, up: zlo(z) > price, label: `${zlo(z) > price ? '↑' : '↓'} ${tfLabel(z.tf)} ${z.side} ${zoneRange(z.prox, z.dist, digits)} · ${pctText(pct)}` });
      }
      continue;
    }
    cand.push(z);   // whole (a zone crossing the candles may stretch the range up to 2x the candle range each side)
    lo2 = Math.min(lo2, Math.max(zlo(z), lo - 2 * span));
    hi2 = Math.max(hi2, Math.min(zhi(z), hi + 2 * span));
  }
  const padv = (hi2 - lo2) * 0.06;
  lo2 -= padv; hi2 += padv;
  const yOf = (v: number) => plot.y + (hi2 - v) / (hi2 - lo2) * plot.h;
  // labels: every drawn zone gets one; when the stack can not hold them all the least important zones are not drawn
  const pri = (z: Band) => (required.has(z) ? 0 : 2) + (z.light ? 1 : 0);
  const zl = cand.map(z => ({ z, lo: zlo(z), hi: zhi(z), pri: pri(z),
    label: `${tfLabel(z.tf)} ${z.side} ${zoneRange(z.prox, z.dist, digits, 1)}${z.wide ? ' · wide' : ''}` }));
  const cap = Math.max(1, Math.floor(plot.h / (CHIP_H + 2)) - edges.length);
  const keep = [...zl].sort((a, z) => a.pri - z.pri || Math.abs((a.lo + a.hi) / 2 - price) - Math.abs((z.lo + z.hi) / 2 - price)).slice(0, cap);
  return { plot, lo: lo2, hi: hi2, y: yOf, head, headSize, slots, step, axisW, zones: zl.filter(d => keep.includes(d)), edges };
}

/** Round price-axis values (1 / 2 / 2.5 / 5 x 10^k steps) inside [lo, hi], about `n` of them, and their decimals. */
export function niceTicks(lo: number, hi: number, n: number, digits: number): { values: number[]; dec: number } {
  const raw = (hi - lo) / Math.max(1, n), p = 10 ** Math.floor(Math.log10(raw));
  const m = [1, 2, 2.5, 5, 10].find(k => k * p >= raw) ?? 10, step = m * p;
  const dec = Math.min(digits, Math.max(0, -Math.floor(Math.log10(step)) + (m === 2.5 ? 1 : 0)));
  const values: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9 * step; v += step) values.push(+v.toFixed(10));
  return { values, dec };
}

/** Stack label chips: each wants its centre at `want`; returns centres >= `gap` apart inside [top, bottom]. */
export function stack(want: number[], gap: number, top: number, bottom: number): number[] {
  const order = want.map((w, i) => [w, i] as const).sort((a, b) => a[0] - b[0]);
  const ys = order.map(([w]) => Math.min(Math.max(w, top), bottom));
  for (let k = 1; k < ys.length; k++) ys[k] = Math.max(ys[k], ys[k - 1] + gap);
  if (ys.length && ys[ys.length - 1] > bottom) {
    ys[ys.length - 1] = bottom;
    for (let k = ys.length - 2; k >= 0; k--) ys[k] = Math.min(ys[k], ys[k + 1] - gap);
  }
  const out = new Array<number>(want.length);
  order.forEach(([, i], k) => { out[i] = ys[k]; });
  return out;
}

/** The nearest y to `want` (searching outwards in `gap` steps) at least `gap` from every taken y, inside [top, bottom]. */
export function freeSlot(want: number, taken: number[], gap: number, top: number, bottom: number): number | null {
  for (let k = 0; k < 60; k++) {
    for (const s of k ? [1, -1] : [1]) {
      const y = Math.min(Math.max(want + s * k * gap / 2, top), bottom);
      if (taken.every(u => Math.abs(u - y) >= gap)) return y;
    }
  }
  return null;
}

function chip(xl: number, yc: number, text: string, fg: string, stroke: string, size: number, maxW: number, cls: string, bold = false): string {
  const t = fitText(text, maxW - 16, size), w = textW(t, size) * (bold ? 1.07 : 1) + 16;
  return `<g class="${cls}"><rect x="${f1(xl)}" y="${f1(yc - CHIP_H / 2)}" width="${f1(w)}" height="${CHIP_H}" rx="6" fill="${C.panel}" fill-opacity="0.92" stroke="${stroke}" stroke-width="1.5"/>`
    + `<text x="${f1(xl + 8)}" y="${f1(yc + size * 0.36)}" font-size="${size}"${bold ? ' font-weight="600"' : ''} fill="${fg}">${x(t)}</text></g>`;
}

function panelSvg(p: Panel, b: Box, m: ChartModel, i: number): string {
  const g = geom(p, b, m.price, m.digits);
  const { plot, step } = g;
  const fmt = (v: number) => v.toFixed(m.digits);
  const out: string[] = [];
  const cid = `c${i}`;
  const right = plot.x + plot.w, bottom = plot.y + plot.h;
  out.push(`<rect x="${f1(b.x)}" y="${f1(b.y)}" width="${f1(b.w)}" height="${f1(b.h)}" rx="14" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>`);
  out.push(`<clipPath id="${cid}"><rect x="${f1(plot.x)}" y="${f1(plot.y)}" width="${f1(plot.w)}" height="${f1(plot.h)}"/></clipPath>`);
  // header: TF in violet, the nearest demand / supply; the nesting note in amber
  const hs = g.headSize;
  g.head.forEach((line, k) => {
    const yy = b.y + 16 + hs + k * (hs + 8) - 4;
    const tag = k === 0 ? `<tspan fill="${C.violet}">${x(tfLabel(p.tf))}</tspan> <tspan fill="${C.mute}">·</tspan> ` : '';
    const indent = k === 0 ? 0 : textW(`${tfLabel(p.tf)} · `, hs);
    out.push(`<text class="head" x="${f1(b.x + 16 + indent)}" y="${f1(yy)}" font-size="${hs}" font-weight="600" fill="${C.text}">${tag}${x(line)}</text>`);
  });
  if (p.nestNote) {
    out.push(`<text class="nest" x="${f1(b.x + 16)}" y="${f1(b.y + 16 + hs + g.head.length * (hs + 8) - 4)}" font-size="20" fill="${C.amber}">${x(fitText(p.nestNote, b.w - 32, 20))}</text>`);
  }
  const yPrice = Math.min(Math.max(g.y(m.price), plot.y), bottom);
  // zone boxes start at the zone's base (ZoneVision: the oldest base candle) and run to the right edge
  const boxX = (z: Band) => (z.k0 == null || z.k0 < 0 ? plot.x : Math.min(plot.x + step * z.k0, right - step));
  // zone bands (context zones first, the key / host on top)
  const parts: string[] = [];
  const zs = [...g.zones].sort((a, z) => z.pri - a.pri);
  for (const d of zs) {
    const z = d.z;
    const yt = Math.max(g.y(d.hi), plot.y), yb = Math.min(g.y(d.lo), bottom);
    const col = z.side === 'demand' ? C.demand : C.supply;
    const op = z.wide ? 0.07 : z.light ? 0.10 : z.key || z.host ? 0.28 : 0.15;
    const stroke = z.host ? ` stroke="${C.violet}" stroke-width="3"` : z.key && !z.wide ? ` stroke="${col}" stroke-opacity="0.9" stroke-width="2"` : z.wide ? ` stroke="${col}" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="8 6"` : '';
    const x0 = boxX(z);
    parts.push(`<rect class="zone ${z.side}${z.key ? ' key' : ''}${z.host ? ' host' : ''}${z.wide ? ' wide' : ''}${z.light ? ' light' : ''}" data-tf="${x(z.tf)}" x="${f1(x0)}" y="${f1(yt)}" width="${f1(right - x0)}" height="${f1(Math.max(2, yb - yt))}" fill="${col}" fill-opacity="${op}"${stroke}/>`);
    if (z.k0 != null && z.k0 < 0) {   // the base formed before the first drawn candle: a small arrow at the left edge
      const ym = (yt + yb) / 2, hh = Math.min(7, Math.max(3, (yb - yt) / 2 - 1));
      parts.push(`<path class="offleft" d="M${f1(plot.x + 2)} ${f1(ym)}L${f1(plot.x + 2 + hh * 1.4)} ${f1(ym - hh)}L${f1(plot.x + 2 + hh * 1.4)} ${f1(ym + hh)}Z" fill="${z.side === 'demand' ? C.demandTxt : C.supplyTxt}"/>`);
    }
  }
  out.push(`<g clip-path="url(#${cid})">${parts.join('')}`);
  // grid lines (behind the candles)
  const nt = niceTicks(g.lo, g.hi, m.layout === 'single' ? 7 : 5, m.digits);
  const ticks = nt.values;
  for (const v of ticks) out.push(`<line class="grid" x1="${f1(plot.x)}" x2="${f1(right)}" y1="${f1(g.y(v))}" y2="${f1(g.y(v))}" stroke="${C.grid}" stroke-width="1"/>`);
  const cw = Math.max(1.5, step * 0.62);
  const cx = (k: number) => plot.x + step * (k + 0.5);
  // trendlines: own TF solid lilac, the next higher TF gold dots; extended through the empty slots to the right edge
  const tlLabels: { y: number; text: string; col: string; inside: [number, number] | null }[] = [];
  for (const t of [...(p.tls ?? [])].sort((a, z) => Number(z.htf) - Number(a.htf))) {
    if (t.pts.length < 2) continue;
    const pts = [...t.pts];
    const [k1, v1] = pts[pts.length - 2], [k2, v2] = pts[pts.length - 1];
    const kEnd = g.slots - 0.5;
    if (k2 < kEnd && k2 > k1) pts.push([kEnd, v2 + (v2 - v1) * (kEnd - k2) / (k2 - k1)]);
    const xy = pts.map(([k, v]) => [plot.x + step * (k + 0.5), g.y(v)] as const);
    const mom = t.kind === 'momentum' && !t.htf;   // Kevin's red momentum line: thin red dashes, never gold
    const col = mom ? C.momentum : t.htf ? C.gold : C.tl;
    const dpath = xy.map(([px, py], j) => `${j ? 'L' : 'M'}${f1(px)} ${f1(py)}`).join('');
    out.push(`<path class="tl ${mom ? 'mom' : t.htf ? 'htf' : 'ltf'} ${t.dir > 0 ? 'up' : 'down'}" data-tf="${x(t.tf)}" d="${dpath}" fill="none" stroke="${col}"`
      + (mom ? ' stroke-width="1.8" stroke-dasharray="9 7"' : t.htf ? ' stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0.5 11"' : ' stroke-width="2.6"')
      + ` stroke-opacity="${t.crossed ? 0.6 : 0.95}"/>`);
    const text = mom ? `${tfLabel(t.tf)} momentum` : `${tfLabel(t.tf)} ${t.dir > 0 ? 'up' : 'down'}${t.crossed ? ' ×' : ''}`;
    const yEnd = xy[xy.length - 1][1];
    if (yEnd >= plot.y && yEnd <= bottom) tlLabels.push({ y: yEnd, text, col, inside: null });
    else {   // the line leaves the plot before the right edge: label at its last point inside
      const ins = xy.filter(([, py]) => py >= plot.y + 16 && py <= bottom - 16);
      if (ins.length) tlLabels.push({ y: ins[ins.length - 1][1], text, col, inside: [ins[ins.length - 1][0], ins[ins.length - 1][1]] });
    }
  }
  // candles (the forming one hollow)
  for (let k = 0; k < p.bars.length; k++) {
    const r = p.bars[k];
    const up = r.c >= r.o, col = up ? C.up : C.down;
    const yo = g.y(r.o), yc = g.y(r.c);
    const forming = !!p.forming && k === p.bars.length - 1;
    out.push(`<line class="wick" x1="${f1(cx(k))}" x2="${f1(cx(k))}" y1="${f1(g.y(r.h))}" y2="${f1(g.y(r.l))}" stroke="${col}" stroke-width="1.5"${forming ? ' stroke-opacity="0.7"' : ''}/>`);
    out.push(`<rect class="candle${forming ? ' forming' : ''}" x="${f1(cx(k) - cw / 2)}" y="${f1(Math.min(yo, yc))}" width="${f1(cw)}" height="${f1(Math.max(1.5, Math.abs(yc - yo)))}" `
      + (forming ? `fill="${col}" fill-opacity="0.18" stroke="${col}" stroke-width="2"/>` : `fill="${col}"/>`));
  }
  // trade lines (entry TF only); their labels are chips placed with the zone chips below
  const trades: { y: number; text: string; fg: string; col: string }[] = [];
  const L = p.lines;
  if (L) {
    for (const [k, v, col] of [['entry', L.entry, C.violet], ['stop', L.stop, C.supply], ['target', L.target, C.demand]] as const) {
      if (typeof v !== 'number') continue;
      const yy = g.y(v);
      out.push(`<line class="trade ${k}" x1="${f1(plot.x)}" x2="${f1(right)}" y1="${f1(yy)}" y2="${f1(yy)}" stroke="${col}" stroke-width="2.5" stroke-dasharray="${k === 'entry' ? '0' : '10 6'}"/>`);
      trades.push({ y: yy, text: `${k === 'entry' && L.kind ? `${L.kind} ` : ''}${k} ${fmt(v)}`, fg: k === 'entry' ? C.tl : k === 'stop' ? C.supplyTxt : C.demandTxt, col });
    }
  }
  // current price line
  out.push(`<line class="price" x1="${f1(plot.x)}" x2="${f1(right)}" y1="${f1(yPrice)}" y2="${f1(yPrice)}" stroke="${C.violet}" stroke-width="2" stroke-dasharray="6 5"/>`);
  // zone label chips: left edge, solid background, stacked; the edge chips for far zones at the top / bottom
  const fsz = 20, maxW = Math.min(plot.w - 12, 420);
  const want = g.zones.map(d => {
    const yt = Math.max(g.y(d.hi), plot.y), yb = Math.min(g.y(d.lo), bottom);
    return yb - yt > CHIP_H + 6 ? yt + CHIP_H / 2 + 3 : (yt + yb) / 2;
  });
  // the panel note ('short history: 5 MN candles') sits at the plot's bottom-left: the chips stay above it
  const note = p.note && p.bars.length && !/^no .* zones: .* zones shown$/.test(p.note) ? p.note : '';
  const chipBottom = bottom - CHIP_H / 2 - 2 - (note ? 30 : 0);
  const all = [...want, ...g.edges.map(e => (e.up ? plot.y : bottom))];
  const ys = stack(all, CHIP_H + 2, plot.y + CHIP_H / 2 + 2, chipBottom);
  const chipX = (z: Band, label: string) => {
    const w = textW(fitText(label, maxW - 16, fsz), fsz) * (z.key ? 1.07 : 1) + 16;
    const x0 = boxX(z) + (z.k0 != null && z.k0 < 0 ? 18 : 6);
    // a box that starts too far right for its chip: the chip ends where the box starts (keeps the newest candles clear)
    return x0 + w <= right - 6 ? x0 : Math.max(plot.x + 6, boxX(z) - 6 - w);
  };
  g.zones.forEach((d, k) => {
    const dem = d.z.side === 'demand';
    out.push(chip(chipX(d.z, d.label), ys[k], d.label, dem ? C.demandTxt : C.supplyTxt, d.z.host ? C.violet : dem ? C.demand : C.supply, fsz, maxW, `zlabel ${d.z.side}`, !!d.z.key));
  });
  g.edges.forEach((e, k) => {
    const dem = e.z.side === 'demand';
    out.push(chip(plot.x + 6, ys[g.zones.length + k], e.label, dem ? C.demandTxt : C.supplyTxt, C.border, fsz, maxW, `zlabel edge ${e.z.side}`));
  });
  // trade chips: right-aligned, clear of the zone chips they would overlap and of each other
  const zoneChips = [...g.zones.map((d, k) => ({ y: ys[k], r: chipX(d.z, d.label) + textW(fitText(d.label, maxW - 16, fsz), fsz) * 1.07 + 16 })),
    ...g.edges.map((e, k) => ({ y: ys[g.zones.length + k], r: plot.x + 6 + textW(fitText(e.label, maxW - 16, fsz), fsz) + 16 }))];
  const placed: number[] = [];
  // boxes the trendline labels inside the plot must stay off: zone / edge / trade chips, the note
  const taken2: { x0: number; x1: number; y0: number; y1: number }[] = [
    ...g.zones.map((d, k) => { const x0 = chipX(d.z, d.label); return { x0, x1: x0 + textW(fitText(d.label, maxW - 16, fsz), fsz) * 1.07 + 16, y0: ys[k] - CHIP_H / 2, y1: ys[k] + CHIP_H / 2 }; }),
    ...g.edges.map((e, k) => ({ x0: plot.x + 6, x1: plot.x + 22 + textW(fitText(e.label, maxW - 16, fsz), fsz), y0: ys[g.zones.length + k] - CHIP_H / 2, y1: ys[g.zones.length + k] + CHIP_H / 2 })),
    ...(note ? [{ x0: plot.x + 8, x1: plot.x + 8 + textW(note, 20), y0: bottom - 28, y1: bottom - 4 }] : [])];
  for (const t of trades) {
    const w = textW(t.text, fsz) + 16, xl = right - 6 - w;
    const taken = [...placed, ...zoneChips.filter(c => c.r > xl - 4).map(c => c.y)];
    const yy = freeSlot(t.y, taken, CHIP_H + 2, plot.y + CHIP_H / 2 + 2, chipBottom);
    if (yy == null) continue;
    placed.push(yy);
    taken2.push({ x0: xl, x1: xl + w, y0: yy - CHIP_H / 2, y1: yy + CHIP_H / 2 });
    out.push(chip(xl, yy, t.text, t.fg, t.col, fsz, w + 1, 'tradelabel'));
  }
  out.push('</g>');
  // forming tick under the last candle
  if (p.forming && p.bars.length) {
    const fx = cx(p.bars.length - 1);
    out.push(`<path class="formtick" d="M${f1(fx - 6)} ${f1(bottom + 12)}L${f1(fx + 6)} ${f1(bottom + 12)}L${f1(fx)} ${f1(bottom + 3)}Z" fill="${C.violet}"/>`);
  }
  // right margin: price tag, trendline labels (stacked off the tag), price ticks where free
  const tag = `<rect x="${f1(right + 2)}" y="${f1(yPrice - 15)}" width="${g.axisW - 8}" height="30" rx="6" fill="${C.tag}"/>`
    + `<text class="plabel" x="${f1(right + 8)}" y="${f1(yPrice + 7)}" font-size="20" font-weight="600" fill="#FFFFFF">${fmt(m.price)}</text>`;
  const margin = tlLabels.filter(t => !t.inside);
  const busy: number[] = [yPrice];
  for (const t of margin) {
    const yy = freeSlot(t.y, busy, 28, plot.y + 10, bottom - 4);
    if (yy == null) continue;
    busy.push(yy);
    const fs = Math.max(12, Math.min(20, Math.floor(20 * (g.axisW - 12) / Math.max(1, textW(t.text, 20)))));   // 'W1 momentum' shrinks to fit
    out.push(`<text class="tllabel" x="${f1(right + 8)}" y="${f1(yy + 7)}" font-size="${fs}" font-weight="600" fill="${t.col}">${x(fitText(t.text, g.axisW - 12, fs))}</text>`);
  }
  for (const t of tlLabels.filter(t => t.inside)) {   // off the chips and each other (nudged up / down, else left out)
    const [lx, ly] = t.inside!;
    const w = textW(t.text, 20) * 1.07, xr = Math.max(plot.x + 8 + w, lx - 6);
    const yy = [0, -26, 26, -52, 52].map(d => ly - 8 + d).find(y => y - 16 >= plot.y && y + 4 <= bottom
      && !taken2.some(b => b.x0 < xr + 2 && b.x1 > xr - w - 2 && b.y0 < y + 5 && b.y1 > y - 17));
    if (yy == null) continue;
    taken2.push({ x0: xr - w, x1: xr, y0: yy - 17, y1: yy + 5 });
    out.push(`<text class="tllabel" x="${f1(xr)}" y="${f1(yy)}" font-size="20" font-weight="600" text-anchor="end" fill="${t.col}" stroke="${C.panel}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${x(t.text)}</text>`);
  }
  const shown = new Set<string>();   // a step finer than the digits would repeat a label: each text once
  for (const v of ticks) {
    const yy = g.y(v);
    if (yy < plot.y + 12 || yy > bottom - 4 || busy.some(u => Math.abs(u - yy) < 28) || shown.has(v.toFixed(nt.dec))) continue;
    shown.add(v.toFixed(nt.dec));
    out.push(`<text class="tick" x="${f1(right + 8)}" y="${f1(yy + 7)}" font-size="20" fill="${C.mute}">${v.toFixed(nt.dec)}</text>`);
  }
  out.push(tag);
  // date axis
  if (p.bars.length) {
    for (const [k, s] of axisTicks(p.bars, p.tf, step, plot.w)) {
      out.push(`<text class="date" x="${f1(cx(k))}" y="${f1(bottom + 30)}" font-size="20" text-anchor="middle" fill="${C.mute}">${x(s)}</text>`);
    }
  } else {
    const ym = plot.y + plot.h / 2 + (Math.abs(plot.y + plot.h / 2 - yPrice) < 30 ? 44 : 0);   // off the price line
    out.push(`<text x="${f1(plot.x + plot.w / 2)}" y="${f1(ym)}" font-size="22" text-anchor="middle" fill="${C.mute}">no candles published for ${x(tfLabel(p.tf))}</text>`);
  }
  // the old 'no D1 zones: W1 zones shown' note is redundant with the header's 'W1 zones:' (owner review): other notes only
  if (note) out.push(`<text class="note" x="${f1(plot.x + 8)}" y="${f1(bottom - 10)}" font-size="20" fill="${C.mute}">${x(fitText(note, plot.w - 16, 20))}</text>`);
  return `<g class="panel" data-tf="${x(p.tf)}">${out.join('')}</g>`;
}

export const LEGEND = 'lilac = trend line · red dashed = momentum line · gold dots = higher-TF trend line · hollow = forming';
export function renderSvg(m: ChartModel): string {
  const top = m.verdict ? 104 : 72;
  const bx = boxes(m.layout, m.panels.length, top);
  const body = m.panels.map((p, i) => panelSvg(p, bx[i], m, i)).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" font-family="Inter">`
    + `<rect width="${SIZE}" height="${SIZE}" fill="${C.bg}"/>`
    + `<text class="title" x="16" y="48" font-size="34" font-weight="600" fill="${C.text}">${x(fitText(m.title, SIZE - 190, 34))}</text>`
    + `<text x="${SIZE - 16}" y="48" font-size="22" text-anchor="end" fill="${C.violet}">RamanFX</text>`
    + (m.verdict ? `<text class="verdict" x="16" y="88" font-size="22" fill="${C.verdict}">${x(fitText(m.verdict, SIZE - 32, 22))}</text>` : '')
    + body
    + `<text x="16" y="${SIZE - 14}" font-size="20" fill="${C.mute}">${x(LEGEND)}</text>`
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
