// Chart notes for the bot's chart images (logic.ts buildPanels / chartData): display-only reading of the scanners'
// zones and the chart trendlines, never a signal rule (the scanners' zone detection, filters and signals are unchanged).
//   wide     a zone too tall to trade from on the chart: height > max(WIDE_PCT[tf] % of price, WIDE_ATR[tf] x the D1
//            ATR in % of price). The engine caps a zone at 1.5 ATR of ITS timeframe when it forms (zones.py
//            detect(): max_zone_atr), so a 3M zone can legally be 28% of price; Kevin refines such a zone on a lower
//            timeframe. `refine` = the nearest lower-TF zone of the same side inside / overlapping it (the top-down chain).
//   nestNote where a panel's key zone (nearest price on its TF) sits against the next higher TF's zones of the same side.
//   verdict  one plain-English line (<= 110 chars) from the data: price vs the nearest zone of the most relevant TF,
//            the higher-TF zone price is inside, the trend, the scanner signal or the zone to watch, nesting.
// Text is ASCII + the few symbols the chart font has (· – no check marks). Pure.
import { tfLabel, type Bar } from './chart.ts';

export interface NZone { tf: string; side: 'demand' | 'supply'; prox: number; dist: number }
export interface NLine { tf: string; htf: boolean; dir: number; crossed: boolean; fallback?: boolean }
export const ZONE_ORDER = ['6M', '3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'];

const lo = (z: NZone) => Math.min(z.prox, z.dist), hi = (z: NZone) => Math.max(z.prox, z.dist);
const gap = (price: number, z: NZone) => (price < lo(z) ? lo(z) - price : price > hi(z) ? price - hi(z) : 0);
const overlap = (a: NZone, b: NZone) => Math.max(lo(a), lo(b)) <= Math.min(hi(a), hi(b));
const nearest = (zs: NZone[], price: number) => zs.slice().sort((a, b) => gap(price, a) - gap(price, b))[0] ?? null;
const name = (tf: string) => tfLabel(tf);

// ---- wide zones -------------------------------------------------------------------------------------------------------
/** % of price a zone may span before it is flagged wide, and the same as a multiple of the D1 ATR (volatile symbols). */
export const WIDE_PCT: Record<string, number> = { M15: 0.25, H1: 0.4, H4: 0.8, D1: 1.5, W1: 3, MN: 5, '3M': 8, '6M': 10 };
export const WIDE_ATR: Record<string, number> = { M15: 0.5, H1: 0.8, H4: 1.2, D1: 2, W1: 3, MN: 5, '3M': 7, '6M': 9 };
/** 14-bar ATR of the bars (simple average of the true range, the newest 14) in % of the last close; 0 = too few. */
export function atrPct(bars: Bar[], n = 14): number {
  if (bars.length < n + 1) return 0;
  let s = 0;
  for (let i = bars.length - n; i < bars.length; i++) {
    const b = bars[i], pc = bars[i - 1].c;
    s += Math.max(b.h, pc) - Math.min(b.l, pc);
  }
  const c = bars[bars.length - 1].c;
  return c > 0 ? s / n / c * 100 : 0;
}
export function isWide(z: NZone, price: number, d1AtrPct: number): boolean {
  const h = Math.abs(z.prox - z.dist) / price * 100;
  return h > Math.max(WIDE_PCT[z.tf] ?? 3, (WIDE_ATR[z.tf] ?? 3) * d1AtrPct);
}
/** The lower-TF zone a wide zone refines to: the nearest TF below with a same-side zone overlapping it (nearest price). */
export function refineOf(z: NZone, zones: NZone[], price: number): NZone | null {
  for (const t of ZONE_ORDER.slice(ZONE_ORDER.indexOf(z.tf) + 1)) {
    const r = nearest(zones.filter(x => x.tf === t && x.side === z.side && overlap(x, z)), price);
    if (r) return r;
  }
  return null;
}

// ---- nesting ----------------------------------------------------------------------------------------------------------
/** The next higher zone TF of `tf` (stocks W1 -> MN -> 3M, FX H1 -> H4 -> D1 -> W1 -> MN -> 3M); null at the top. */
export const upTf = (tf: string) => { const i = ZONE_ORDER.indexOf(tf); return i > 0 ? ZONE_ORDER[i - 1] : null; };
export type Nest = { kind: 'nested' | 'overlaps' | 'at' | 'outside' | 'none'; htf: string; host: NZone | null; where?: 'above' | 'below' };
/** Where zone k sits against the same-side zones of the next higher TF; null = no higher-TF zones at all (unknown). */
export function nestOf(k: NZone, zones: NZone[]): Nest | null {
  const H = upTf(k.tf);
  if (!H) return null;
  const all = zones.filter(z => z.tf === H);
  if (!all.length) return null;
  const same = all.filter(z => z.side === k.side);
  if (!same.length) return { kind: 'none', htf: H, host: null };
  const mid = (lo(k) + hi(k)) / 2;
  const host = same.find(h => lo(k) >= lo(h) && hi(k) <= hi(h)) ?? same.find(h => overlap(h, k))
    ?? same.slice().sort((a, b) => gap(mid, a) - gap(mid, b))[0];
  if (lo(k) >= lo(host) && hi(k) <= hi(host)) return { kind: 'nested', htf: H, host };
  if (overlap(host, k)) return { kind: 'overlaps', htf: H, host };
  const where = lo(k) > hi(host) ? 'above' : 'below';
  // the scanners' location tolerance (zones.py LOC_TOL): up to 25% of the host's height beyond its proximal = at it
  const beyond = where === 'above' ? lo(k) - hi(host) : lo(host) - hi(k);
  const prox = (host.side === 'demand' && where === 'above') || (host.side === 'supply' && where === 'below');
  if (prox && beyond <= 0.25 * Math.abs(host.prox - host.dist)) return { kind: 'at', htf: H, host, where };
  return { kind: 'outside', htf: H, host, where };
}
/** The panel's nesting note, e.g. 'nested in W1 demand', 'MN demand outside 3M demand (below)'; null = nothing to say. */
export function nestNote(k: NZone | null, zones: NZone[]): string | null {
  if (!k) return null;
  const n = nestOf(k, zones);
  if (!n) return null;
  const H = `${name(n.htf)} ${k.side}`;
  switch (n.kind) {
    case 'nested': return `nested in ${H}`;
    case 'overlaps': return `overlaps ${H}`;
    case 'at': return `at ${H} (just outside)`;
    case 'outside': return `${name(k.tf)} ${k.side} outside ${H} (${n.where})`;
    default: return `no ${H} to nest in`;
  }
}

// ---- trend ------------------------------------------------------------------------------------------------------------
/** Swing structure of the bars (2-bar swings): the last two swing highs and lows. 1 up (HH + HL), -1 down, 0 neither. */
export function structure(bars: Bar[], sw = 2): number {
  const hs: number[] = [], ls: number[] = [];
  for (let i = sw; i < bars.length - sw; i++) {
    let h = true, l = true;
    for (let k = 1; k <= sw; k++) {
      if (!(bars[i].h > bars[i - k].h && bars[i].h >= bars[i + k].h)) h = false;
      if (!(bars[i].l < bars[i - k].l && bars[i].l <= bars[i + k].l)) l = false;
    }
    if (h) hs.push(bars[i].h);
    if (l) ls.push(bars[i].l);
  }
  if (hs.length < 2 || ls.length < 2) return 0;
  const [h1, h2] = hs.slice(-2), [l1, l2] = ls.slice(-2);
  const last = bars[bars.length - 1].c;
  if (h2 > h1 && l2 > l1 && last > l2) return 1;
  if (h2 < h1 && l2 < l1 && last < h2) return -1;
  return 0;
}
/** Trend of a panel: its own uncrossed house lines when they point one way, else the swing structure, else its own
 *  uncrossed fallback lines when they point one way; 0 = no clear trend. */
export function trendOf(lines: NLine[], bars: Bar[]): number {
  const one = (ls: NLine[]) => { const d = new Set(ls.map(t => t.dir)); return d.size === 1 ? [...d][0] : 0; };
  const own = lines.filter(t => !t.htf && !t.crossed);
  return one(own.filter(t => !t.fallback)) || structure(bars) || one(own.filter(t => t.fallback));
}

// ---- verdict ----------------------------------------------------------------------------------------------------------
export const VERDICT_MAX = 110;
/** A price with ~4 significant figures (5 for FX), never more decimals than the symbol has. */
export function compact(v: number, digits: number, fx: boolean): string {
  const mag = v > 0 ? Math.floor(Math.log10(v)) : 0;
  const dec = Math.max(0, Math.min(digits, (fx ? 5 : 4) - 1 - mag));
  return v.toFixed(dec);
}
export interface VerdictIn {
  price: number; digits: number; market: 'fx' | 'stock';
  zones: NZone[];
  relTf: string;                                  // the zone TF that matters most (the signal's, else the lowest panel's)
  trendTf: string; trendLines: NLine[]; trendBars: Bar[];
  sig?: { tf: string; kind?: string; entry?: number } | null;
}
export function verdict(v: VerdictIn): string {
  const fmt = (x: number) => compact(x, v.digits, v.market === 'fx');
  const rng = (z: NZone) => `${fmt(z.prox)}–${fmt(z.dist)}`;
  const pct = (x: number) => `${(x / v.price * 100 < 0.05 ? 0.1 : x / v.price * 100).toFixed(1)}%`;
  // the most relevant TF with zones (walk up when it has none)
  let rel = v.relTf;
  while (rel && !v.zones.some(z => z.tf === rel)) rel = upTf(rel) ?? '';
  const R = name(rel || v.relTf);
  const own = v.zones.filter(z => z.tf === rel);
  const dem = nearest(own.filter(z => z.side === 'demand' && lo(z) <= v.price), v.price);
  const sup = nearest(own.filter(z => z.side === 'supply' && hi(z) >= v.price), v.price);
  const main = [dem, sup].filter((z): z is NZone => !!z).sort((a, b) => gap(v.price, a) - gap(v.price, b))[0] ?? null;
  const other = main === dem ? sup : dem;
  const inside = !!main && gap(v.price, main) === 0;
  const head = !main ? `Price ${fmt(v.price)}: no ${R} zone near`
    : inside ? `Price inside ${R} ${main.side} (${rng(main)})`
    : `Price ${pct(gap(v.price, main))} ${main.side === 'demand' ? 'above' : 'below'} ${R} ${main.side} (${rng(main)})`;
  // the highest-TF zone price is inside (above the relevant TF)
  let contain = '';
  for (const t of ZONE_ORDER.slice(0, Math.max(0, ZONE_ORDER.indexOf(rel)))) {
    const z = v.zones.find(x => x.tf === t && gap(v.price, x) === 0);
    if (z) { contain = `inside ${name(t)} ${z.side}`; break; }
  }
  const tr = trendOf(v.trendLines, v.trendBars);
  const trend = tr > 0 ? `${name(v.trendTf)} uptrend` : tr < 0 ? `${name(v.trendTf)} downtrend` : `${name(v.trendTf)} no clear trend`;
  const s = v.sig;
  const signal = s && s.kind ? `scanner: ${s.kind} ${name(s.tf)}${s.entry != null ? ` at ${fmt(s.entry)}` : ''}` : '';
  const watch = !signal && main && !inside ? `watch ${rng(main)}` : '';
  const n = main ? nestOf(main, v.zones) : null;
  const nest = !n ? '' : n.kind === 'nested' || n.kind === 'overlaps' || n.kind === 'at' ? `nested in ${name(n.htf)}` : `not nested in ${name(n.htf)}`;
  const opp = other ? `${other.side} ${fmt(other.prox)} ${pct(gap(v.price, other))} ${other.side === 'supply' ? 'up' : 'down'}` : '';
  // parts in priority order; the least important dropped first until the line fits
  const parts: { t: string; pri: number; join: string }[] = [
    { t: head, pri: 9, join: '' }, { t: contain, pri: 4, join: ', ' }, { t: trend, pri: 6, join: ' · ' },
    { t: signal, pri: 8, join: ' · ' }, { t: watch, pri: 3, join: ' · ' }, { t: nest, pri: 2, join: ' · ' }, { t: opp, pri: 1, join: ' · ' },
  ].filter(p => p.t);
  const build = (ps: typeof parts) => ps.map((p, i) => (i ? p.join : '') + p.t).join('');
  let ps = parts;
  while (build(ps).length > VERDICT_MAX && ps.length > 1) {
    const low = ps.reduce((m, p) => (p.pri < m.pri ? p : m));
    ps = ps.filter(p => p !== low);
  }
  const out = build(ps);
  return out.length > VERDICT_MAX ? out.slice(0, VERDICT_MAX) : out;
}
