// Chart images for the Telegram bot: a pure SVG builder (no Deno, no network), rasterised to PNG by index.ts with
// resvg-wasm. Two layouts: 'quad' = ONE 1280x1280 image split 2x2 into four timeframes of the same symbol (highest TF
// top-left, Kevin's top-down view), 'single' = one large TF. Dark theme like the app: bg #0B0C10, violet accent,
// demand green, supply red. Text >= 20 px (legible on a phone at 1280 px). Font family 'Inter' (index.ts passes an
// Inter SUBSET: Latin-1 + – — ’ … ↑ → ↓ − ≤ ≥, so no ▲▼ or emoji; bold text names the 'Inter SemiBold' face, because
// resvg matches the family name and the SemiBold file is not family 'Inter').
//
// DECLUTTER rules (owner review of the SOYBEANS 4-view, Nov 2026; drawing only, nothing here changes a zone or a line):
//   1. no text inside the plot area, so none over the candles. A zone's prices are in the panel header and in a small
//      solid tag in the right price gutter at the zone's level (like the price tag); tags are nudged off each other and
//      off the price tag, the lower-priority one is dropped when it still collides.
//   2. at most 2 zones per panel: the nearest supply above price and the nearest demand below (the zone price is inside
//      takes its side's place), after merging overlapping / adjacent zones of the same side and TF into one box.
//   3. only live lines: the own-TF trend line (lilac, one per direction), the momentum line (red dashed) and the
//      higher-TF line (gold dots). A broken line ("× broken", the arrival's crossed line) is not drawn at all. Line names
//      ('MN up', 'D1 down') are small gutter tags.
//   4. one short header line per panel: 'W1 · ↑ 12.81–13.10 (+5.8%) · ↓ 11.74–11.48 (−3.1%)'; no nesting warning.
//   5. title line 'SYMBOL price · time', one short verdict line (logic.chartVerdict -> chartnotes.verdict), an arrival
//      line only on a chart that has an arrival.
//   6. one short legend line.
//   7. the y-range fits the candles (and the price); a drawn zone / trade line may stretch it by up to ~34% of the candle
//      range in total (candles keep >= ~70% of the plot height), a zone further away is not drawn as a box: a tag
//      '↑ 13.05–13.20 (+7.8%)' in a strip above / below the plot instead.
//   8. fonts: header 22 px (single 27), tags / axis / dates 21 px, title 36 px; bold = the real SemiBold face.
// Other rules kept from the owner reviews: empty candle slots on the right (~8%) keep the last candle clear of the
// price scale; the forming candle is hollow with a violet tick under it; date axis per TF: 3M / MN / W1 'Jan 2016', D1
// 'Sep 17' (+ "'25" on the first tick and at year changes), intraday 'Oct 29 09:30'.

export interface Bar { t: string; o: number; h: number; l: number; c: number }
export interface Band {
  tf: string; side: 'demand' | 'supply'; prox: number; dist: number;
  key?: boolean;     // the panel's key zone (the nearest one)
  host?: boolean;    // hosts the next-lower panel's key zone: outlined in violet (the nesting chain)
  light?: boolean;   // a zone of another TF drawn for context (W1 zones on a stock D1 / intraday panel)
  wide?: boolean;    // too tall to be a precise level: lighter, dashed
  t0?: string;       // base start: time of the zone's oldest base candle (ZoneVision's box start)
  k0?: number;       // drawn bar index where the box starts (-1 = before the first drawn bar); undefined = full width
  label?: string;
  // ARRIVAL reading (arrival.ts, owner-approved Raja / Kevin rules): set by logic.ts buildPanels
  arrival?: boolean; // an arrival zone: bold border, tag with a drawn bolt
  strong?: boolean;  // its leg-out removed 2+ opposite zones
  removedN?: number; // how many opposite zones its leg-out removed
  removed?: boolean; // an opposite zone that arrival removed: not a live zone, never drawn
  t1?: string; k1?: number;   // removed zones: the removing bar's time / drawn index
  weak?: boolean;    // after an arrival: same-TF zones on the other side, dashed
  realign?: boolean; // the realignment area (the weak zone nearest the higher-TF line): gold outline
  tag?: string;      // an extra note ('confirm on 15m'), told by the arrival line, not drawn
}
export interface Lines { entry?: number | null; stop?: number | null; target?: number | null; kind?: string }
/** A trendline to draw (zvTrend.ts panelTrendlines): pts = [drawn bar index (centres 0 .. n-1), price]; htf = the next
 *  higher timeframe's line projected onto this panel (gold dots), else the panel's own timeframe (solid lilac). */
export interface TLine { tf: string; htf: boolean; dir: number; touches: number; crossed: boolean; pts: [number, number][]; kind?: 'trend' | 'momentum'; broken?: boolean }
/** The arrival plan's take-profit on a panel: amber dashed line, tag text e.g. 'TP 117.6'. */
export interface ArrTp { px: number; text: string }
export interface Panel {
  tf: string; header: string; bars: Bar[]; zones: Band[]; lines?: Lines | null; note?: string; tls?: TLine[];
  dbgZz?: { zz: [number, number][]; used: [number, number][] };   // debug overlay (harness only): zigzag of the real pivots + the anchors used
  tp?: ArrTp | null; sl?: ArrTp | null;
  forming?: boolean;          // the last bar is still forming (drawn hollow)
  nestNote?: string | null;   // the nesting note (logic.ts sets it; no longer drawn: the verdict says 'not nested')
}
export interface ChartModel { sym: string; title: string; digits: number; price: number; panels: Panel[]; layout: 'quad' | 'single'; verdict?: string | null; arrival?: string | null }
/** The title strip's height: title, + the verdict line, + the arrival line. */
export const topOf = (m: Pick<ChartModel, 'verdict' | 'arrival'>) => 72 + (m.verdict ? 34 : 0) + (m.arrival ? 32 : 0);

export const SIZE = 1280;
const C = {
  bg: '#0B0C10', panel: '#11131A', border: '#232634', text: '#E5E7EB', mute: '#9CA3AF', violet: '#8B5CF6', tag: '#7C3AED',
  demand: '#10B981', supply: '#EF4444', demandTxt: '#34D399', supplyTxt: '#FCA5A5', up: '#34D399', down: '#F87171',
  grid: '#1B1E2A', tl: '#C4B5FD', gold: '#D4AF37', momentum: '#F87171', amber: '#FBBF24', verdict: '#D1D5DB',
};
const TF_SHORT: Record<string, string> = { M15: '15m', H1: '1H', H4: '4H', D1: 'D1', W1: 'W1', MN: 'MN', '3M': '3M' };
export const tfLabel = (tf: string) => TF_SHORT[tf] ?? tf;
/** Bold text: the SemiBold face (family 'Inter SemiBold' in the font files), falling back to Inter. */
const SB = ' font-family="Inter SemiBold, Inter" font-weight="600"';

const x = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const f1 = (n: number) => (Math.round(n * 10) / 10).toString();
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Inter advance widths (1/1000 em) of the bot's font files (tools/telegram_bot/fonts): ASCII 32..126, Regular / SemiBold.
const W_REG = [
  281, 288, 466, 633, 642, 982, 644, 300, 365, 365, 501, 662, 288, 460, 288, 360, 631, 407, 610,
  618, 646, 593, 620, 566, 619, 620, 288, 302, 662, 662, 662, 511, 966, 690, 654, 730, 722, 601,
  590, 746, 743, 269, 571, 672, 565, 903, 753, 765, 639, 765, 644, 642, 646, 744, 690, 985, 682,
  679, 629, 365, 360, 365, 471, 456, 323, 562, 612, 571, 612, 583, 370, 613, 591, 242, 242, 549,
  242, 876, 591, 600, 612, 612, 376, 528, 327, 591, 562, 818, 546, 562, 552, 426, 333, 426, 662];
const W_SEMI = [
  252, 321, 523, 644, 650, 1004, 663, 326, 373, 373, 540, 673, 319, 465, 319, 379, 660, 423, 623,
  636, 666, 612, 640, 576, 640, 640, 319, 329, 673, 673, 673, 543, 999, 728, 659, 737, 722, 605,
  588, 749, 746, 277, 580, 703, 565, 922, 759, 769, 645, 773, 652, 650, 660, 736, 728, 1020, 720,
  713, 652, 373, 379, 373, 481, 469, 351, 574, 624, 583, 624, 591, 389, 625, 612, 262, 262, 569,
  262, 900, 612, 609, 624, 624, 397, 549, 353, 612, 587, 839, 569, 588, 566, 455, 359, 455, 673];
const W_SPECIAL: Record<string, [number, number]> = { '·': [288, 319], '–': [500, 500], '—': [1000, 1000], '’': [261, 294], '…': [864, 956], '↑': [834, 881], '↓': [834, 881], '→': [954, 954], '−': [662, 673], '≤': [662, 673], '≥': [662, 673], '×': [662, 673], '°': [456, 458], '±': [662, 673] };

/** Rendered width of Inter text (px) at a font size, from the font's own advance widths (kerning ignored). */
export function textW(s: string, size: number, bold = false): number {
  const T = bold ? W_SEMI : W_REG;
  let w = 0;
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    w += c >= 32 && c <= 126 ? T[c - 32] : W_SPECIAL[ch]?.[bold ? 1 : 0] ?? 600;
  }
  return w * size / 1000;
}
/** Truncate text so it fits `px` pixels at a font size. */
export function fitText(s: string, px: number, size: number, bold = false): string {
  if (textW(s, size, bold) <= px) return s;
  let t = s;
  while (t.length > 4 && textW(`${t}…`, size, bold) > px) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}
/** Truncate a header so it fits roughly `px` pixels at 20-22 px Inter. */
export const clip = (s: string, px: number) => fitText(s, px, 21);

// ---- numbers ---------------------------------------------------------------------------------------------------------
/** Decimals a zone's prices need: 2 significant digits of its height + `extra`, at most `digits`. */
const zoneDec = (a: number, b: number, digits: number, extra = 0) => {
  const h = Math.abs(a - b);
  return h > 0 ? Math.min(digits, Math.max(0, Math.ceil(-Math.log10(h)) + 1 + extra)) : digits;
};
/** A zone's prices with as many decimals as its height needs (2 significant digits of the height + `extra`, at most
 *  `digits`): 96.14–94.36 -> '96.1–94.4' (extra 0), 124.22–146.87 -> '124–147'. */
export function zoneRange(a: number, b: number, digits: number, extra = 0): string {
  const dec = zoneDec(a, b, digits, extra);
  return `${a.toFixed(dec)}–${b.toFixed(dec)}`;
}
export const pctText = (p: number) => (p < 0.05 ? '<0.1%' : p < 10 ? `${p.toFixed(1)}%` : `${Math.round(p)}%`);
/** A signed distance: '+5.8%' above price, '−3.1%' (a real minus sign, in the font subset) below it. */
const sgnPct = (p: number, up: boolean) => (p < 0.05 ? pctText(p) : `${up ? '+' : '−'}${pctText(p)}`);
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

// ---- which zones a panel draws -----------------------------------------------------------------------------------------
interface Near { z: Band; pct: number; inside: boolean }
/** The zone timeframe a panel's header talks about: its own TF, else the TF of its key zone (stock D1 -> W1). */
const zoneTfOf = (p: Panel) => (p.zones.some(z => z.tf === p.tf) ? p.tf : p.zones.find(z => z.key)?.tf ?? p.zones.find(z => !z.light)?.tf ?? p.zones[0]?.tf ?? p.tf);
const zh = (z: Band) => zhi(z) - zlo(z);
/** One box for a run of overlapping / adjacent zones (same side and TF): the union of their prices, the strongest flags. */
function joinZones(zs: Band[]): Band {
  if (zs.length === 1) return zs[0];
  const lo = Math.min(...zs.map(zlo)), hi = Math.max(...zs.map(zhi));
  const base = zs.find(z => z.arrival) ?? zs.find(z => z.key) ?? zs.find(z => z.realign) ?? zs[0];
  const dem = base.side === 'demand', k0s = zs.map(z => z.k0);
  const arrival = zs.some(z => z.arrival);
  return { ...base, prox: dem ? hi : lo, dist: dem ? lo : hi, key: zs.some(z => z.key), host: zs.some(z => z.host), arrival, realign: zs.some(z => z.realign),
    light: zs.every(z => z.light), wide: zs.every(z => z.wide), weak: !arrival && zs.every(z => z.weak),
    k0: k0s.some(k => k == null) ? undefined : Math.min(...(k0s as number[])) };
}
/** Merge zones of the same side and TF that overlap or sit next to each other (a gap of at most half the smaller zone's
 *  height) into one box each: two stacked '4H supply' boxes become one. Order of the others is kept per group. */
export function mergeZones(zs: Band[]): Band[] {
  const groups = new Map<string, Band[]>();
  for (const z of zs) { const k = `${z.tf}|${z.side}`; if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(z); }
  const out: Band[] = [];
  for (const g of groups.values()) {
    g.sort((a, z) => zlo(a) - zlo(z));
    let cur: Band[] = [], top = -Infinity, h = 0;
    for (const z of g) {
      if (cur.length && zlo(z) - top <= 0.5 * Math.min(zh(z), h) + 1e-9 * Math.abs(top)) {
        cur.push(z);
        if (zhi(z) > top) { top = zhi(z); h = zh(z); }
      } else {
        if (cur.length) out.push(joinZones(cur));
        cur = [z]; top = zhi(z); h = zh(z);
      }
    }
    if (cur.length) out.push(joinZones(cur));
  }
  return out;
}
/** Nearest demand at / below price and nearest supply at / above it among the panel's zones of `tf`. */
export function nearestZones(zones: Band[], tf: string, price: number): { dem: Near | null; sup: Near | null } {
  let dem: Near | null = null, sup: Near | null = null;
  for (const z of zones) {
    if (z.tf !== tf || z.removed) continue;
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
/** The panel's zones: merged, then the nearest supply above price and the nearest demand below (a zone price is inside
 *  takes its side's place). At most 2; every other zone of the panel is not drawn. Removed zones are never live. */
export function pickZones(p: Panel, price: number): { ztf: string; dem: Near | null; sup: Near | null } {
  const ztf = zoneTfOf(p);
  const { dem, sup } = nearestZones(mergeZones(p.zones.filter(z => z.tf === ztf && !z.removed)), ztf, price);
  return { ztf, dem, sup };
}

// ---- panel header ------------------------------------------------------------------------------------------------------
const nearText = (n: Near | null, side: 'demand' | 'supply', digits: number, paren: boolean) => {
  if (!n) return side === 'demand' ? '↓ no demand' : '↑ no supply';
  const r = zoneRange(n.z.prox, n.z.dist, digits);
  if (n.inside) return `in ${side} ${r}`;
  const pc = sgnPct(n.pct, side === 'supply');
  return `${side === 'demand' ? '↓' : '↑'} ${r} ${paren ? `(${pc})` : pc}`;
};
/** The panel header after the TF tag: ONE line, '↑ 12.81–13.10 (+5.8%) · ↓ 11.74–11.48 (−3.1%)' (a zone TF other than the
 *  panel's is named first: 'W1 ↑ …'); the % in parentheses drops, then the dot, when the line does not fit `px`. */
export function headerLines(p: Panel, price: number, digits: number, px: number, size: number): string[] {
  if (!p.zones.length) return [p.header || 'no zone in view'];
  const { ztf, dem, sup } = pickZones(p, price);
  const pre = ztf !== p.tf ? `${tfLabel(ztf)} ` : '';
  const v = [true, false].map(par => `${pre}${nearText(sup, 'supply', digits, par)} · ${nearText(dem, 'demand', digits, par)}`);
  v.push(`${pre}${nearText(sup, 'supply', digits, false)}  ${nearText(dem, 'demand', digits, false)}`);
  return [v.find(s => textW(s, size, true) <= px) ?? fitText(v[2], px, size, true)];
}

// ---- y-range ---------------------------------------------------------------------------------------------------------
interface RItem { id: number; kind: 'zone' | 'line'; lo: number; hi: number }
const EXT_NEAR = 0.5;      // an item further than this share of the candle range beyond the candles is "far"
const EXT_BUDGET = 0.34;   // the range may grow by this share in total (both sides): candles keep >= 1 / (1 + 0.34 + 2 PAD) = 71% of the plot
const PAD = 0.03, DEPTH = 0.05;
/** The y-range: the candles (and the price) `lo0..hi0`, stretched for the zones / trade lines that are near (within
 *  EXT_NEAR of the candle range, and the total stretch within EXT_BUDGET). `far` = the items that do not fit (id -> above
 *  the candles). A near item is at least visible by DEPTH of the range, and shown whole when the budget allows. */
export function fitRange(lo0: number, hi0: number, items: RItem[]): { lo: number; hi: number; far: Map<number, boolean> } {
  if (!(hi0 > lo0)) { const m = lo0 || 1; hi0 = m * 1.01 + 1e-9; lo0 = m * 0.99; }
  const R = hi0 - lo0, limHi = hi0 + EXT_NEAR * R, limLo = lo0 - EXT_NEAR * R, B = EXT_BUDGET * R;
  const above = (i: RItem) => i.lo > hi0, below = (i: RItem) => i.hi < lo0;
  const gap = (i: RItem) => (above(i) ? i.lo - hi0 : below(i) ? lo0 - i.hi : 0);
  const upFull = (i: RItem) => Math.max(0, Math.min(i.hi, limHi) - hi0), dnFull = (i: RItem) => Math.max(0, lo0 - Math.max(i.lo, limLo));
  const ext = { up: 0, dn: 0 }, far = new Map<number, boolean>(), ok: RItem[] = [];
  for (const i of [...items].sort((a, z) => gap(a) - gap(z))) {   // pass 1, nearest first: what makes the item visible
    const depth = i.kind === 'zone' ? Math.min(i.hi - i.lo, DEPTH * R) : 0;
    const nu = Math.max(ext.up, above(i) ? Math.min(upFull(i), i.lo - hi0 + depth) : 0), nd = Math.max(ext.dn, below(i) ? Math.min(dnFull(i), lo0 - i.hi + depth) : 0);
    if ((above(i) && i.lo > limHi) || (below(i) && i.hi < limLo) || nu + nd > B + 1e-12) { far.set(i.id, above(i)); continue; }
    ext.up = nu; ext.dn = nd; ok.push(i);
  }
  for (const i of ok) {   // pass 2: the whole item while the budget lasts
    ext.up = Math.max(ext.up, Math.min(upFull(i), B - ext.dn));
    ext.dn = Math.max(ext.dn, Math.min(dnFull(i), B - ext.up));
  }
  return { lo: lo0 - ext.dn - PAD * R, hi: hi0 + ext.up + PAD * R, far };
}

// ---- lines -----------------------------------------------------------------------------------------------------------
export interface LineDraw { t: TLine; kind: 'ltf' | 'htf' | 'mom'; pts: [number, number][]; col: string; text: string }
/** The live lines to draw: per direction ONE own-TF trend line (lilac) and ONE higher-TF line (gold dots), plus ONE
 *  momentum line (red dashed). A broken line (flagged broken, or the arrival's crossed line) is never drawn. Each line is
 *  extended through the empty candle slots to the right edge (`kEnd`). The most touched line wins, then the newest. */
export function drawnLines(tls: TLine[] | undefined, kEnd: number): LineDraw[] {
  const live = (tls ?? []).filter(t => t.pts.length >= 2 && !t.broken && !t.crossed);
  const end = (t: TLine) => t.pts[t.pts.length - 1][0];
  const best = (xs: TLine[]) => xs.reduce<TLine | null>((m, t) => (!m || t.touches > m.touches || (t.touches === m.touches && end(t) > end(m)) ? t : m), null);
  const picks: [TLine, LineDraw['kind']][] = [];
  const add = (t: TLine | null, kind: LineDraw['kind']) => { if (t) picks.push([t, kind]); };
  for (const dir of [-1, 1]) add(best(live.filter(t => t.htf && Math.sign(t.dir) === dir)), 'htf');
  for (const dir of [-1, 1]) add(best(live.filter(t => !t.htf && t.kind !== 'momentum' && Math.sign(t.dir) === dir)), 'ltf');
  add(best(live.filter(t => !t.htf && t.kind === 'momentum')), 'mom');
  return picks.map(([t, kind]) => {
    const pts = [...t.pts];
    const [k1, v1] = pts[pts.length - 2], [k2, v2] = pts[pts.length - 1];
    if (k2 < kEnd && k2 > k1) pts.push([kEnd, v2 + (v2 - v1) * (kEnd - k2) / (k2 - k1)]);
    return { t, kind, pts, col: kind === 'mom' ? C.momentum : kind === 'htf' ? C.gold : C.tl,
      text: kind === 'mom' ? `${tfLabel(t.tf)} mom` : `${tfLabel(t.tf)} ${t.dir > 0 ? 'up' : 'down'}` };
  });
}

// ---- geometry -------------------------------------------------------------------------------------------------------
const FS = 21;          // gutter / tag / axis / date text size
const TAG_H = 28;       // gutter tag height
const STRIP = 30;       // the strip above / below the plot that holds a far zone's tag
const BOLT_W = 16;      // room a tag's bolt icon takes before its text
const RIGHT_PAD = 0.08; // empty candle slots on the right, share of the drawn bars (>= 3)
/** Right margin (price scale, price tag, tags): sized to the price's digits, at least 104 px; wider when a tag needs it. */
export const axisWidth = (price: number, digits: number) => Math.max(104, Math.ceil(textW(price.toFixed(digits), FS, true) + 24));
const tagW = (s: string, bolt = false) => Math.ceil(textW(s, FS, true)) + 16 + (bolt ? BOLT_W : 0);

interface DrawZone { z: Band; lo: number; hi: number; label: string }
interface EdgeTag { z: Band; up: boolean; label: string }
interface TradeLine { k: 'entry' | 'stop' | 'target' | 'tp' | 'sl'; v: number; col: string; fg: string; dash: string; texts: string[] }
/** A tag in the right gutter (never over candles): a zone's prices, a trade level, a line's name. y = the placed centre. */
export interface Tag { kind: 'zone' | 'trade' | 'line'; cls: string; text: string; y: number; fg: string; fill?: string; stroke?: string; bolt?: boolean; dash?: boolean }
export interface PanelGeom {
  plot: Box; lo: number; hi: number; y: (p: number) => number;
  head: string[]; headSize: number; slots: number; step: number; axisW: number;
  zones: DrawZone[]; edges: EdgeTag[]; tags: Tag[]; lines: LineDraw[]; trades: TradeLine[];
  stripUp: number; stripDn: number; yPrice: number;
}
const edgeText = (z: Band, up: boolean, price: number, digits: number) => {
  const pct = up ? (zlo(z) - price) / price * 100 : (price - zhi(z)) / price * 100;
  return `${up ? '↑' : '↓'} ${zoneRange(z.prox, z.dist, digits)} (${sgnPct(pct, up)})`;
};
/** The nearest y to `want` (searching outwards, `prefer` = 1 down / -1 up first) at least a tag height from every taken
 *  tag, inside [top, bottom] and within `maxNudge` of `want`; null = no room (the tag is dropped). */
function slotFor(want: number, h: number, taken: { y: number; h: number }[], top: number, bottom: number, maxNudge: number, prefer = 1): number | null {
  const lo = top + h / 2, hi = bottom - h / 2, w0 = Math.min(Math.max(want, lo), hi);
  for (let d = 0; d <= maxNudge + 1e-9; d += 4) {
    for (const s of d ? [prefer, -prefer] : [1]) {
      const y = w0 + s * d;
      if (y < lo - 1e-9 || y > hi + 1e-9) continue;
      if (taken.every(t => Math.abs(t.y - y) >= (t.h + h) / 2 + 1)) return y;
    }
  }
  return null;
}
/** Plot box, price range, the zones to draw and every gutter tag (see the file header for the rules). */
export function geom(p: Panel, b: Box, price: number, digits = 5): PanelGeom {
  const quad = b.w < SIZE / 2;
  const fmt = (v: number) => v.toFixed(digits);
  // header: the biggest size at which the one line fits
  const sizes = quad ? [22, 21, 20] : [27, 26, 25, 24];
  const hpx = (s: number) => b.w - 32 - textW(`${tfLabel(p.tf)} · `, s, true);
  let headSize = sizes[sizes.length - 1], head = headerLines(p, price, digits, hpx(headSize), headSize);
  for (const s of sizes) {
    const h = headerLines(p, price, digits, hpx(s), s);
    if (textW(h[0], s, true) <= hpx(s)) { headSize = s; head = h; break; }
  }
  const top = 16 + headSize + 12;
  // the zones (<= 2) and the trade lines, then the y-range they may stretch
  const { dem, sup } = pickZones(p, price);
  const cands = [dem?.z, sup?.z].filter((z, i, a): z is Band => !!z && a.indexOf(z) === i);
  const trades: TradeLine[] = [];
  const L = p.lines;
  if (L) {
    for (const [k, v, col, fg, word, abbr, dash] of [['entry', L.entry, C.violet, C.tl, 'entry', 'E', '0'], ['stop', L.stop, C.supply, C.supplyTxt, 'stop', 'SL', '10 6'], ['target', L.target, C.demand, C.demandTxt, 'target', 'TP', '10 6']] as const) {
      if (typeof v === 'number') trades.push({ k, v, col, fg, dash, texts: [`${word} ${fmt(v)}`, `${abbr} ${fmt(v)}`, fmt(v)] });
    }
  }
  if (p.tp && p.tp.px > 0) trades.push({ k: 'tp', v: p.tp.px, col: C.amber, fg: C.amber, dash: '12 7', texts: [`TP ${fmt(p.tp.px)}`, fmt(p.tp.px)] });
  if (p.sl && p.sl.px > 0) trades.push({ k: 'sl', v: p.sl.px, col: C.supply, fg: C.supplyTxt, dash: '12 7', texts: [`SL ${fmt(p.sl.px)}`, fmt(p.sl.px)] });
  let lo0 = price, hi0 = price;
  for (const r of p.bars) { lo0 = Math.min(lo0, r.l); hi0 = Math.max(hi0, r.h); }
  const fit = fitRange(lo0, hi0, [...trades.map((t, i) => ({ id: i, kind: 'line' as const, lo: t.v, hi: t.v })), ...cands.map((z, i) => ({ id: 100 + i, kind: 'zone' as const, lo: zlo(z), hi: zhi(z) }))]);
  const shownTrades = trades.filter((_, i) => !fit.far.has(i));
  const edges: EdgeTag[] = cands.flatMap((z, i) => (fit.far.has(100 + i) ? [{ z, up: fit.far.get(100 + i)!, label: edgeText(z, fit.far.get(100 + i)!, price, digits) }] : []));
  const stripUp = edges.some(e => e.up) ? STRIP : 0, stripDn = edges.some(e => !e.up) ? STRIP : 0;
  // gutter width: the price tag and every zone / trade tag at full width, up to a cap (longer ones fall back to shorter texts)
  const cap = quad ? 172 : 236;
  const zoneTags = cands.filter((_, i) => !fit.far.has(100 + i)).map(z => ({ z, texts: [zoneRange(z.prox, z.dist, digits), z.prox.toFixed(zoneDec(z.prox, z.dist, digits))] }));
  let inner = Math.max(axisWidth(price, digits) - 8, tagW(fmt(price)));
  const choose = (texts: string[], bolt: boolean) => texts.find(s => tagW(s, bolt) <= cap - 8) ?? texts[texts.length - 1];
  const zText = zoneTags.map(t => choose(t.texts, !!t.z.arrival)), tText = shownTrades.map(t => choose(t.texts, false));
  zoneTags.forEach((t, i) => { inner = Math.max(inner, Math.min(cap - 8, tagW(zText[i], !!t.z.arrival))); });
  shownTrades.forEach((_, i) => { inner = Math.max(inner, Math.min(cap - 8, tagW(tText[i]))); });
  const axisW = inner + 8;
  const plot = { x: b.x + 14, y: b.y + top + stripUp, w: b.w - 14 - axisW, h: b.h - top - stripUp - 36 - stripDn };
  const n = Math.max(p.bars.length, 1), slots = n + Math.max(3, Math.ceil(n * RIGHT_PAD)), step = plot.w / slots;
  const bottom = plot.y + plot.h;
  const yOf = (v: number) => plot.y + (fit.hi - v) / (fit.hi - fit.lo) * plot.h;
  const yPrice = Math.min(Math.max(yOf(price), plot.y), bottom);
  const zones: DrawZone[] = zoneTags.map((t, i) => ({ z: t.z, lo: zlo(t.z), hi: zhi(t.z), label: zText[i] }));
  const lines = drawnLines(p.tls, slots - 0.5);
  // gutter tags, highest priority first: zones (arrival first, then the nearer one), trade levels, line names
  const taken: { y: number; h: number }[] = [{ y: yPrice, h: 30 }];
  const tags: Tag[] = [];
  const zOrder = zones.map((d, i) => ({ d, i })).sort((a, z) => Number(!!z.d.z.arrival) - Number(!!a.d.z.arrival)
    || Math.abs((a.d.lo + a.d.hi) / 2 - price) - Math.abs((z.d.lo + z.d.hi) / 2 - price));
  for (const { d } of zOrder) {
    const yt = Math.max(yOf(d.hi), plot.y), yb = Math.min(yOf(d.lo), bottom), z = d.z;
    const y = slotFor((yt + yb) / 2, TAG_H, taken, plot.y, bottom, 2 * TAG_H, z.side === 'supply' ? -1 : 1);
    if (y == null) continue;
    taken.push({ y, h: TAG_H });
    tags.push({ kind: 'zone', cls: `ztag ${z.side}${z.arrival ? ' arrival' : ''}`, text: d.label, y, fg: C.bg, fill: z.realign ? C.gold : z.side === 'demand' ? C.demand : C.supply, bolt: !!z.arrival });
  }
  shownTrades.forEach((t, i) => {
    const y = slotFor(yOf(t.v), TAG_H, taken, plot.y, bottom, 2 * TAG_H);
    if (y == null) return;
    taken.push({ y, h: TAG_H });
    tags.push({ kind: 'trade', cls: `tradelabel ${t.k}`, text: tText[i], y, fg: t.fg, stroke: t.col });
  });
  for (const l of lines) {
    const ye = yOf(l.pts[l.pts.length - 1][1]);
    if (ye < plot.y + 8 || ye > bottom - 8) continue;   // the line leaves the plot before its right edge: no name over the candles
    const y = slotFor(ye, 24, taken, plot.y, bottom, 36);
    if (y == null) continue;
    taken.push({ y, h: 24 });
    tags.push({ kind: 'line', cls: 'tllabel', text: l.text, y, fg: l.col });
  }
  return { plot, lo: fit.lo, hi: fit.hi, y: yOf, head, headSize, slots, step, axisW, zones, edges, tags, lines, trades: shownTrades, stripUp, stripDn, yPrice };
}

/** A lightning bolt (the font has no ⚡): a filled path in a w x h box at (x, y top-left). */
export const boltPath = (x0: number, y0: number, h: number, fill: string, cls = 'bolt') => {
  const w = h * 0.62, P = (u: number, v: number) => `${f1(x0 + u * w)} ${f1(y0 + v * h)}`;
  return `<path class="${cls}" d="M${P(0.62, 0)}L${P(0.08, 0.56)}L${P(0.46, 0.56)}L${P(0.3, 1)}L${P(0.92, 0.4)}L${P(0.52, 0.4)}L${P(0.74, 0)}Z" fill="${fill}"/>`;
};

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

// ---- drawing ---------------------------------------------------------------------------------------------------------
/** A solid / outlined tag: rect at (xl, yc - TAG_H / 2), w wide, text (SemiBold) left-aligned, an optional bolt first. */
function tagSvg(xl: number, yc: number, w: number, t: { text: string; fg: string; fill?: string; stroke?: string; bolt?: boolean; dash?: boolean; h?: number }, cls: string): string {
  const h = t.h ?? TAG_H, ib = t.bolt ? BOLT_W : 0, txt = fitText(t.text, w - 14 - ib, FS, true);
  return `<g class="${cls}"><rect x="${f1(xl)}" y="${f1(yc - h / 2)}" width="${f1(w)}" height="${h}" rx="6" fill="${t.fill ?? C.panel}"${t.stroke ? ` stroke="${t.stroke}" stroke-width="2"` : ''}${t.dash ? ' stroke-dasharray="6 4"' : ''}/>`
    + (t.bolt ? boltPath(xl + 6, yc - 9, 18, t.fg) : '')
    + `<text x="${f1(xl + 8 + ib)}" y="${f1(yc + FS * 0.36)}" font-size="${FS}"${SB} fill="${t.fg}">${x(txt)}</text></g>`;
}

function panelSvg(p: Panel, b: Box, m: ChartModel, i: number): string {
  const g = geom(p, b, m.price, m.digits);
  const { plot, step } = g;
  const out: string[] = [];
  const cid = `c${i}`;
  const right = plot.x + plot.w, bottom = plot.y + plot.h;
  out.push(`<rect x="${f1(b.x)}" y="${f1(b.y)}" width="${f1(b.w)}" height="${f1(b.h)}" rx="14" fill="${C.panel}" stroke="${C.border}" stroke-width="2"/>`);
  out.push(`<clipPath id="${cid}"><rect x="${f1(plot.x)}" y="${f1(plot.y)}" width="${f1(plot.w)}" height="${f1(plot.h)}"/></clipPath>`);
  // header: ONE line, the TF in violet then the nearest supply above / demand below
  const hs = g.headSize;
  out.push(`<text class="head" x="${f1(b.x + 16)}" y="${f1(b.y + 16 + hs - 4)}" font-size="${hs}"${SB} fill="${C.text}"><tspan fill="${C.violet}">${x(tfLabel(p.tf))}</tspan> <tspan fill="${C.mute}">·</tspan> ${x(g.head[0])}</text>`);
  // a far zone is no box: its tag sits in the strip above / below the plot
  for (const e of g.edges) {
    const w = tagW(e.label), yc = e.up ? plot.y - STRIP / 2 : bottom + STRIP / 2;
    out.push(tagSvg(b.x + 16, yc, w, { text: e.label, fg: C.bg, fill: e.z.side === 'demand' ? C.demand : C.supply, h: 26 }, `ztag edge ${e.up ? 'up' : 'down'} ${e.z.side}`));
  }
  // zone boxes start at the zone's base (ZoneVision: the oldest base candle) and run to the right edge
  const boxX = (z: Band) => (z.k0 == null || z.k0 < 0 ? plot.x : Math.min(plot.x + step * z.k0, right - step));
  const parts: string[] = [];
  for (const d of g.zones) {
    const z = d.z;
    const yt = Math.max(g.y(d.hi), plot.y), yb = Math.min(g.y(d.lo), bottom);
    const col = z.side === 'demand' ? C.demand : C.supply;
    const op = z.arrival ? 0.30 : z.wide || z.weak ? 0.07 : z.light ? 0.14 : z.key || z.host || z.realign ? 0.28 : 0.15;
    const stroke = z.arrival ? ` stroke="${z.side === 'demand' ? C.demandTxt : C.supplyTxt}" stroke-width="4"`
      : z.realign ? ` stroke="${C.gold}" stroke-width="3.5"`
      : z.host ? ` stroke="${C.violet}" stroke-width="3"`
      : z.weak ? ` stroke="${col}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10 7"`
      : z.key && !z.wide ? ` stroke="${col}" stroke-opacity="0.9" stroke-width="2"` : z.wide ? ` stroke="${col}" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="8 6"` : '';
    const x0 = boxX(z);
    parts.push(`<rect class="zone ${z.side}${z.key ? ' key' : ''}${z.host ? ' host' : ''}${z.wide ? ' wide' : ''}${z.light ? ' light' : ''}${z.arrival ? ' arrival' : ''}${z.weak ? ' weak' : ''}${z.realign ? ' realign' : ''}" data-tf="${x(z.tf)}" x="${f1(x0)}" y="${f1(yt)}" width="${f1(right - x0)}" height="${f1(Math.max(2, yb - yt))}" fill="${col}" fill-opacity="${op}"${stroke}/>`);
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
  // live trendlines only: own TF solid lilac, the next higher TF gold dots, momentum red dashes; through the empty slots to the right edge
  for (const l of g.lines) {
    const xy = l.pts.map(([k, v]) => [plot.x + step * (k + 0.5), g.y(v)] as const);
    const dpath = xy.map(([px, py], j) => `${j ? 'L' : 'M'}${f1(px)} ${f1(py)}`).join('');
    out.push(`<path class="tl ${l.kind} ${l.t.dir > 0 ? 'up' : 'down'}" data-tf="${x(l.t.tf)}" d="${dpath}" fill="none" stroke="${l.col}"`
      + (l.kind === 'mom' ? ' stroke-width="1.8" stroke-dasharray="9 7"' : l.kind === 'htf' ? ' stroke-width="5.5" stroke-linecap="round" stroke-dasharray="0.5 11"' : ' stroke-width="2.6"')
      + ` stroke-opacity="0.95"/>`);
  }
  if (p.dbgZz) {   // debug overlay (render harness --debug-tl): the zigzag of the real pivots + the anchors the lines use
    const P = (k: number, v: number) => `${f1(plot.x + step * (k + 0.5))} ${f1(g.y(v))}`;
    if (p.dbgZz.zz.length > 1) out.push(`<path class="dbg-zz" d="${p.dbgZz.zz.map(([k, v], j) => `${j ? 'L' : 'M'}${P(k, v)}`).join('')}" fill="none" stroke="#ffd60a" stroke-width="1.6" stroke-opacity="0.85"/>`);
    for (const [k, v] of p.dbgZz.zz) out.push(`<circle cx="${f1(plot.x + step * (k + 0.5))}" cy="${f1(g.y(v))}" r="2.5" fill="#ffd60a"/>`);
    for (const [k, v] of p.dbgZz.used) out.push(`<circle cx="${f1(plot.x + step * (k + 0.5))}" cy="${f1(g.y(v))}" r="7" fill="none" stroke="#ffd60a" stroke-width="2"/>`);
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
  // trade lines (entry TF only, the arrival plan's TP / SL): lines here, their tags in the gutter
  for (const t of g.trades) {
    const yy = g.y(t.v);
    out.push(`<line class="trade ${t.k}" x1="${f1(plot.x)}" x2="${f1(right)}" y1="${f1(yy)}" y2="${f1(yy)}" stroke="${t.col}" stroke-width="2.5" stroke-dasharray="${t.dash}"/>`);
  }
  // current price line
  out.push(`<line class="price" x1="${f1(plot.x)}" x2="${f1(right)}" y1="${f1(g.yPrice)}" y2="${f1(g.yPrice)}" stroke="${C.violet}" stroke-width="2" stroke-dasharray="6 5"/>`);
  out.push('</g>');
  // forming tick under the last candle
  if (p.forming && p.bars.length) {
    const fx = cx(p.bars.length - 1);
    out.push(`<path class="formtick" d="M${f1(fx - 6)} ${f1(bottom + 12)}L${f1(fx + 6)} ${f1(bottom + 12)}L${f1(fx)} ${f1(bottom + 3)}Z" fill="${C.violet}"/>`);
  }
  // right gutter: zone / trade tags, line names, the price scale where free, the price tag on top
  const tw = g.axisW - 8;
  for (const t of g.tags) {
    if (t.kind === 'line') {
      const fs = Math.max(14, Math.min(FS, Math.floor(FS * (g.axisW - 12) / Math.max(1, textW(t.text, FS, true)))));
      out.push(`<text class="${t.cls}" x="${f1(right + 8)}" y="${f1(t.y + 7)}" font-size="${fs}"${SB} fill="${t.fg}">${x(fitText(t.text, g.axisW - 12, fs, true))}</text>`);
    } else out.push(tagSvg(right + 2, t.y, tw, t, t.cls));
  }
  const shown = new Set<string>();   // a step finer than the digits would repeat a label: each text once
  for (const v of ticks) {
    const yy = g.y(v);
    const busy = Math.abs(g.yPrice - yy) < 28 || g.tags.some(t => Math.abs(t.y - yy) < (t.kind === 'line' ? 24 : TAG_H) / 2 + 14);
    if (yy < plot.y + 12 || yy > bottom - 4 || busy || shown.has(v.toFixed(nt.dec))) continue;
    shown.add(v.toFixed(nt.dec));
    out.push(`<text class="tick" x="${f1(right + 8)}" y="${f1(yy + 7)}" font-size="${FS}" fill="${C.mute}">${v.toFixed(nt.dec)}</text>`);
  }
  out.push(`<rect x="${f1(right + 2)}" y="${f1(g.yPrice - 15)}" width="${f1(tw)}" height="30" rx="6" fill="${C.tag}"/>`
    + `<text class="plabel" x="${f1(right + 8)}" y="${f1(g.yPrice + 7)}" font-size="${FS}"${SB} fill="#FFFFFF">${m.price.toFixed(m.digits)}</text>`);
  // date axis
  const dateY = b.y + b.h - 6;
  const dates: { x0: number; x1: number }[] = [];
  if (p.bars.length) {
    for (const [k, s] of axisTicks(p.bars, p.tf, step, plot.w, FS)) {
      out.push(`<text class="date" x="${f1(cx(k))}" y="${f1(dateY)}" font-size="${FS}" text-anchor="middle" fill="${C.mute}">${x(s)}</text>`);
      dates.push({ x0: cx(k) - textW(s, FS) / 2, x1: cx(k) + textW(s, FS) / 2 });
    }
  } else {
    const ym = plot.y + plot.h / 2 + (Math.abs(plot.y + plot.h / 2 - g.yPrice) < 30 ? 44 : 0);   // off the price line
    out.push(`<text class="nodata" x="${f1(plot.x + plot.w / 2)}" y="${f1(ym)}" font-size="22" text-anchor="middle" fill="${C.mute}">no candles published for ${x(tfLabel(p.tf))}</text>`);
  }
  // a panel note ('short history: 5 MN candles') sits right-aligned in the date band, only where no date label is
  const note = p.note && p.bars.length && !/^no .* zones: .* zones shown$/.test(p.note) ? fitText(p.note, plot.w * 0.6, FS) : '';
  if (note) {
    const nx1 = right + g.axisW - 12, nx0 = nx1 - textW(note, FS);
    if (!dates.some(d => d.x1 + 12 > nx0 && d.x0 < nx1)) out.push(`<text class="note" x="${f1(nx1)}" y="${f1(dateY)}" font-size="${FS}" text-anchor="end" fill="${C.mute}">${x(note)}</text>`);
  }
  return `<g class="panel" data-tf="${x(p.tf)}">${out.join('')}</g>`;
}

export const LEGEND = 'lilac trend · red dashed momentum · gold dotted higher-TF · not advice';
export const LEGEND_ARR = 'lilac trend · gold dotted higher-TF · bold box = arrival · not advice';
export function renderSvg(m: ChartModel): string {
  const top = topOf(m);
  const bx = boxes(m.layout, m.panels.length, top);
  const body = m.panels.map((p, i) => panelSvg(p, bx[i], m, i)).join('');
  const vs = m.verdict ? [26, 25, 24, 23, 22, 21, 20].find(s => textW(m.verdict!, s) <= SIZE - 32) ?? 20 : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" font-family="Inter">`
    + `<rect width="${SIZE}" height="${SIZE}" fill="${C.bg}"/>`
    + `<text class="title" x="16" y="48" font-size="36"${SB} fill="${C.text}">${x(fitText(m.title, SIZE - 200, 36, true))}</text>`
    + `<text x="${SIZE - 16}" y="46" font-size="22" text-anchor="end" fill="${C.violet}">RamanFX</text>`
    + (m.verdict ? `<text class="verdict" x="16" y="${vs >= 24 ? 90 : 88}" font-size="${vs}" fill="${C.verdict}">${x(fitText(m.verdict, SIZE - 32, vs))}</text>` : '')
    + (m.arrival ? (() => { const y = m.verdict ? 124 : 90; return boltPath(16, y - 17, 20, C.amber, 'bolt arrline')
      + `<text class="arrival" x="${16 + BOLT_W}" y="${y}" font-size="22"${SB} fill="${C.amber}">${x(fitText(m.arrival, SIZE - 32 - BOLT_W, 22, true))}</text>`; })() : '')
    + body
    + `<text class="legend" x="16" y="${SIZE - 14}" font-size="${FS}" fill="${C.mute}">${x(m.panels.some(p => p.zones.some(z => z.arrival && !z.removed)) ? LEGEND_ARR : LEGEND)}</text>`
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
