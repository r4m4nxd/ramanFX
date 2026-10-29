// Live zones for the bot: a TypeScript port of the zone DETECTION the scanners draw from (no rules, no signals).
// Ported line by line from tools/stock_scanner/zones.py (Series, detect, the dna() F16 test count, to_quarters,
// forming_touched) and the zone filters of tools/fx_scanner/fxcore.py analyse() + fxscan.py detail() (FX) and
// tools/stock_scanner/scan.py analyse() + ticker_detail() (stocks), so the zones computed here on live candles are the
// ones the scanners would publish on the same bars: proximal / distal, demand / supply, the pattern (RBR / DBR / DBD /
// RBD), the test count (fresh = 0). NOT ported: the zone DNA codes (ARR / WOW / STR ...), location, direction, the
// trade rules: BUY / SELL / WATCH stay those of the latest scanner run (the bot says so).
// Parity: src/core/telegramZoneParity.test.ts runs this port and the Python engine on the same fixture bars
// (tools/telegram_bot/parity/make_fixtures.py) and requires identical zones.
// Index convention kept from the Python (and the MQL before it): shift 0 = a phantom forming bar at the price,
// 1 = the newest CLOSED bar, larger = older. Pure: no Deno, no network.

export interface ZBar { d: string; o: number; h: number; l: number; c: number }
export interface ZParams {
  min_leg_ratio: number; max_base: number; max_zone_atr: number; lookback: number; max_zone_age: number; emo_atr: number;
  removal_mode: number; base_strict?: boolean; emo_touch?: boolean;
}
/** zones.RAJA (ZV_Template_Raja.set): the stock scanner's settings. */
export const RAJA: ZParams = { min_leg_ratio: 1.2, max_base: 6, max_zone_atr: 1.5, lookback: 200, max_zone_age: 200, emo_atr: 3.0, removal_mode: 1 };
/** fxcore.params(): RAJA + the stricter FX readings that change detection / tests (7+ candle base = no zone, news taps count). */
export const FX_PARAMS: ZParams = { ...RAJA, base_strict: true, emo_touch: true };
const MIN_ROW_BARS: Record<string, number> = { '3M': 21, '6M': 16 };   // zones.MIN_ROW_BARS (default 40)

export class Series {
  readonly O: number[]; readonly H: number[]; readonly L: number[]; readonly C: number[]; readonly T: string[];
  readonly n: number; readonly price: number; private readonly a: number[];
  constructor(bars: ZBar[], price: number | null, readonly tf: string, atrPeriod = 14) {
    const p = price == null && bars.length ? bars[bars.length - 1].c : (price ?? 0);
    const rb = [...bars].reverse();
    this.price = p;
    this.O = [p, ...rb.map(b => b.o)]; this.H = [p, ...rb.map(b => b.h)]; this.L = [p, ...rb.map(b => b.l)]; this.C = [p, ...rb.map(b => b.c)];
    this.T = [rb.length ? rb[0].d : '', ...rb.map(b => b.d)];
    const n = this.n = this.C.length;
    const tr = new Array<number>(n).fill(0);
    for (let i = 0; i < n - 1; i++) { const pc = this.C[i + 1]; tr[i] = Math.max(this.H[i], pc) - Math.min(this.L[i], pc); }
    // MT5 iATR(14): simple average of the true range over 14 bars ending at the shift (same summation order as Python)
    this.a = new Array<number>(n).fill(0);
    let s = 0;
    for (let i = n - 2; i >= 0; i--) {
      s += tr[i];
      if (i + atrPeriod <= n - 2) s -= tr[i + atrPeriod];
      if (i + atrPeriod <= n - 1) this.a[i] = s / atrPeriod;
    }
  }
  atr(i: number): number { return i >= 0 && i < this.n ? this.a[i] : 0; }
  rng(i: number): number { return this.H[i] - this.L[i]; }
  body(i: number): number { return Math.abs(this.C[i] - this.O[i]); }
  basing(i: number): boolean { const r = this.rng(i); return r > 0 && this.body(i) / r < 0.5; }
  cdir(i: number): number { return this.C[i] > this.O[i] ? 1 : this.C[i] < this.O[i] ? -1 : 0; }
  emotional(i: number, emo: number): boolean { const a = this.atr(i + 1); return a > 0 && this.rng(i) > emo * a; }
}

export interface Zone {
  tf: string; dir: number; prox: number; dist: number; legBar: number; baseN: number; saBar: number; legRatio: number; cont: boolean;
  tested: boolean; testedBar: number; removed: boolean; removedBar: number; baseStart: string; made: string;
}
export const pattern = (z: Zone) => (z.dir > 0 ? (z.cont ? 'RBR' : 'DBR') : (z.cont ? 'DBD' : 'RBD'));
const lo = (z: Zone) => Math.min(z.prox, z.dist), hi = (z: Zone) => Math.max(z.prox, z.dist);

/** zones.detect(): base 1-6 basing candles + a departure >= 1.2x the biggest base candle, proximal on the base bodies,
 *  distal on the wicks, height <= 1.5 ATR, the stay-away candle leaves space; removed by a close beyond the distal. */
export function detect(S: Series, p: ZParams = RAJA): Zone[] {
  const out: Zone[] = [];
  const bars = Math.min(p.lookback, S.n - p.max_base - 3);
  for (let L = bars; L > 1; L--) {
    const lr = S.rng(L);
    if (lr <= 0 || S.basing(L)) continue;
    const d = S.cdir(L);
    if (d === 0) continue;
    let k = 0, maxBase = 0;
    while (k < p.max_base && S.basing(L + 1 + k)) { maxBase = Math.max(maxBase, S.rng(L + 1 + k)); k++; }
    if (k === 0 || maxBase <= 0) continue;
    if (p.base_strict && k === p.max_base && L + 1 + k < S.n && S.basing(L + 1 + k)) continue;
    const ratio = lr / maxBase;
    if (ratio < p.min_leg_ratio) continue;
    const cont = S.cdir(L + 1 + k) === d;
    let prox: number, dist: number;
    if (d > 0) {
      prox = -Infinity; let m = Infinity;
      for (let b = L + 1; b <= L + k; b++) { prox = Math.max(prox, Math.max(S.O[b], S.C[b])); m = Math.min(m, S.L[b]); }
      dist = Math.min(m, S.L[L]);
    } else {
      prox = Infinity; let m = -Infinity;
      for (let b = L + 1; b <= L + k; b++) { prox = Math.min(prox, Math.min(S.O[b], S.C[b])); m = Math.max(m, S.H[b]); }
      dist = Math.max(m, S.H[L]);
    }
    const h = Math.abs(prox - dist), atr = S.atr(L);
    if (h <= 0) continue;
    if (atr > 0 && h > p.max_zone_atr * atr) continue;
    const sa = L - 1;
    if ((d > 0 && S.L[sa] <= prox) || (d < 0 && S.H[sa] >= prox)) continue;
    const z: Zone = { tf: S.tf, dir: d, prox, dist, legBar: L, baseN: k, saBar: sa, legRatio: ratio, cont, tested: false, testedBar: -1,
      removed: false, removedBar: -1, baseStart: S.T[L + k], made: S.T[sa] };
    const wick = p.removal_mode === 0;
    for (let j = sa - 1; j > 0; j--) {
      if (d > 0) {
        if (S.C[j] < dist || (wick && S.L[j] < dist && !S.emotional(j, p.emo_atr))) { z.removed = true; z.removedBar = j; break; }
        if (!z.tested && S.L[j] <= prox && !S.emotional(j, p.emo_atr)) { z.tested = true; z.testedBar = j; }
      } else {
        if (S.C[j] > dist || (wick && S.H[j] > dist && !S.emotional(j, p.emo_atr))) { z.removed = true; z.removedBar = j; break; }
        if (!z.tested && S.H[j] >= prox && !S.emotional(j, p.emo_atr)) { z.tested = true; z.testedBar = j; }
      }
    }
    out.push(z);
  }
  return out;
}

/** dna() F16: separate visits to the proximal on the zone TF's closed bars (+ whether price is in a touch now). */
export function tests(S: Series, z: Zone, p: ZParams = RAJA): { n: number; inTouch: boolean } {
  let away = true, inT = false, n = 0;
  const stop = z.removed ? z.removedBar : 0;
  for (let j = z.saBar - 1; j > Math.max(stop, 0); j--) {
    const a = z.dir > 0 ? S.L[j] : S.H[j];
    const touch = z.dir > 0 ? a <= z.prox : a >= z.prox;
    if (touch && !p.emo_touch && S.emotional(j, p.emo_atr)) continue;
    if (touch) { if (!inT && away) { n++; inT = true; away = false; } } else { away = true; inT = false; }
  }
  return { n, inTouch: inT };
}

/** eval_row()'s gate: enough bars (40; 3M 21) and a positive ATR, else the row has no zones. */
export const rowOk = (S: Series) => S.n >= (MIN_ROW_BARS[S.tf] ?? 40) && S.atr(1) > 0;
export const rowZones = (S: Series, p: ZParams) => (rowOk(S) ? detect(S, p) : []);

// ---- periods ------------------------------------------------------------------------------------------------------
const isoDow = (d: string) => (new Date(`${d.slice(0, 10)}T00:00:00Z`).getUTCDay() + 6) % 7;   // Monday 0 (Python weekday())
const addDays = (d: string, k: number) => new Date(Date.parse(`${d.slice(0, 10)}T00:00:00Z`) + k * 86400000).toISOString().slice(0, 10);
/** ISO week key (Python isocalendar()[:2]): 'YYYY-Www' of the week's Thursday. */
export function isoWeek(d: string): string {
  const thu = addDays(d, 3 - isoDow(d));
  const y = Number(thu.slice(0, 4));
  const jan4 = `${y}-01-04`;
  const w1 = addDays(jan4, -isoDow(jan4));
  const w = Math.round((Date.parse(`${thu}T00:00:00Z`) - Date.parse(`${w1}T00:00:00Z`)) / (7 * 86400000)) + 1;
  return `${y}-W${String(w).padStart(2, '0')}`;
}
/** fxcfg.period_key on forex-time labels, as sortable strings: H1 / H4 the bar, D1 the day, W1 the Saturday it starts on. */
export function fxPeriod(tf: string, d: string): string {
  if (tf === 'H1' || tf === 'H4') return d.slice(0, 16);
  if (tf === 'D1') return d.slice(0, 10);
  if (tf === 'W1') return addDays(d, -((isoDow(d) - 5 + 7) % 7));
  if (tf === 'MN') return d.slice(0, 7);
  const m = Number(d.slice(5, 7));
  return `${d.slice(0, 4)}-${tf === '6M' ? Math.floor((m - 1) / 6) : Math.floor((m - 1) / 3)}`;
}
/** fxcfg.h4_bucket: the H4 bar (server time 00/04/../20) holding an H1 label. */
export const h4Bucket = (l: string) => { const h = Number(l.slice(11, 13)); return `${l.slice(0, 11)}${String(h - (h % 4)).padStart(2, '0')}:00`; };

/** zones.to_quarters: closed 3M bars from closed monthly bars (the forming quarter and a partial first one dropped). */
export function toQuarters(mn: ZBar[]): ZBar[] {
  const groups: [string, number, ZBar[]][] = [];
  for (const b of mn) {
    const q = Math.floor((Number(b.d.slice(5, 7)) - 1) / 3), k = `${b.d.slice(0, 4)}-${q}`;
    if (groups.length && groups[groups.length - 1][0] === k) groups[groups.length - 1][2].push(b);
    else groups.push([k, q, [b]]);
  }
  const out: ZBar[] = [];
  groups.forEach(([, q, bs], n) => {
    const months = new Set(bs.map(b => Number(b.d.slice(5, 7))));
    if (!months.has(3 * (q + 1))) return;
    if (n === 0 && !months.has(3 * q + 1)) return;
    out.push({ d: bs[0].d, o: bs[0].o, h: Math.max(...bs.map(b => b.h)), l: Math.min(...bs.map(b => b.l)), c: bs[bs.length - 1].c });
  });
  return out;
}

/** The zone list both markets draw / list: one entry per zone. */
export interface LiveZone { tf: string; side: 'demand' | 'supply'; proximal: number; distal: number; pattern: string; touches: number; fresh: boolean; made: string; base_start: string }
const pyRound1 = (x: number) => {   // Python round(x, 1): half-even on exact ties
  const t = x * 10, f = Math.floor(t);
  if (t - f === 0.5) return (f % 2 === 0 ? f : f + 1) / 10;
  return Math.round(t) / 10;
};
const roundTo = (v: number, nd: number) => Number(v.toFixed(nd));

// ---- FX: fxcore.analyse + fxscan.detail -----------------------------------------------------------------------------
const FX_KEEP: Record<string, number> = { H1: 1500, H4: 1500, D1: 1500, W1: 1500, MN: 600 };
export const FX_ZONE_TFS = ['H1', 'H4', 'D1', 'W1', 'MN'];
const FX_MAX_TOUCHES = 3;
/**
 * The zones fxscan.py publishes for one instrument (detail()['zones'] before its 16-zone cut), on CLOSED bars per TF
 * (oldest first, forex-time labels). price = the live price (the scanner: the newest closed H1 close); omitted = the
 * scanner's own price. Each zone: not removed, departure within 200 bars, on its own side of price, tested <= 3x
 * (closed-bar visits + a touch in the HTF bar still forming), sorted by distance in pips (rounded to 0.1 like the scan).
 */
export function fxZonesOf(bars: Record<string, ZBar[]>, pip: number, nd: number, price?: number | null): LiveZone[] {
  const h4 = (bars.H4 ?? []).slice(-FX_KEEP.H4);
  if (!h4.length) return [];
  let h1 = (bars.H1 ?? []).slice(-FX_KEEP.H1);
  const last4 = h4[h4.length - 1].d;
  if (h1.length && h4Bucket(h1[h1.length - 1].d) < last4) h1 = [];
  const h1x = h1.filter(b => h4Bucket(b.d) > last4);
  const px = price ?? (h1x.length ? h1x[h1x.length - 1].c : h4[h4.length - 1].c);
  // fine = H4 bars + the forming H4 bar(s) built from the closed H1 bars after the newest closed H4 bar
  const formH4: ZBar[] = [];
  for (const b of h1x) {
    const k = h4Bucket(b.d), x = formH4[formH4.length - 1];
    if (x && x.d === k) formH4[formH4.length - 1] = { d: k, o: x.o, h: Math.max(x.h, b.h), l: Math.min(x.l, b.l), c: b.c };
    else formH4.push({ d: k, o: b.o, h: b.h, l: b.l, c: b.c });
  }
  const fine = new Series([...h4, ...formH4], px, 'H4');
  const series: Record<string, Series> = {
    H1: new Series(h1, px, 'H1'), H4: new Series(h4, px, 'H4'),
    D1: new Series((bars.D1 ?? []).slice(-FX_KEEP.D1), px, 'D1'), W1: new Series((bars.W1 ?? []).slice(-FX_KEEP.W1), px, 'W1'),
    MN: new Series((bars.MN ?? []).slice(-FX_KEEP.MN), px, 'MN'),
  };
  const formingTouched = (z: Zone): boolean => {
    if (z.tf === 'H1') return false;
    if (z.tf === 'H4') return !z.removed && h1x.some(b => (z.dir > 0 ? b.l <= z.prox : b.h >= z.prox));
    if (z.removed) return false;
    const htf = series[z.tf];
    const last = htf.n > 1 ? fxPeriod(z.tf, htf.T[1]) : null;
    for (let j = 1; j < fine.n; j++) {
      if (last != null && fxPeriod(z.tf, fine.T[j]) <= last) break;
      if (z.dir > 0 ? fine.L[j] <= z.prox : fine.H[j] >= z.prox) return true;
    }
    return lo(z) <= fine.price && fine.price <= hi(z);
  };
  const out: (LiveZone & { pips: number })[] = [];
  for (const tf of FX_ZONE_TFS) {
    const S = series[tf];
    for (const z of rowZones(S, FX_PARAMS)) {
      if (z.removed || z.legBar > FX_PARAMS.max_zone_age) continue;
      if (!((z.dir > 0 && z.dist < px) || (z.dir < 0 && z.dist > px))) continue;
      const x = tests(S, z, FX_PARAMS);
      const n = x.n + (formingTouched(z) && !x.inTouch ? 1 : 0);
      if (n > FX_MAX_TOUCHES) continue;
      out.push({ tf, side: z.dir > 0 ? 'demand' : 'supply', proximal: roundTo(z.prox, nd), distal: roundTo(z.dist, nd), pattern: pattern(z),
        touches: n, fresh: n === 0, made: z.made, base_start: z.baseStart, pips: pyRound1(Math.abs(px - z.prox) / pip) });
    }
  }
  out.sort((a, b) => a.pips - b.pips);
  return out.map(({ pips: _p, ...z }) => z);   // eslint-disable-line @typescript-eslint/no-unused-vars
}

// ---- stocks: data.closed_htf + scan.analyse + scan.ticker_detail ---------------------------------------------------
export const nextBusinessDay = (d: string) => { let n = addDays(d, 1); while (isoDow(n) >= 5) n = addDays(n, 1); return n; };
/** data.aggregate + closed_htf: ISO-week / calendar-month bars from daily bars, the forming bucket dropped. */
export function closedHtf(daily: ZBar[], tf: 'W1' | 'MN' | '3M'): ZBar[] {
  if (tf === '3M') return toQuarters(closedHtf(daily, 'MN'));
  const key = tf === 'W1' ? isoWeek : (d: string) => d.slice(0, 7);
  const out: ZBar[] = [];
  let ck = '';
  for (const b of daily) {
    const k = key(b.d);
    const x = out[out.length - 1];
    if (!x || k !== ck) { out.push({ ...b }); ck = k; } else { x.h = Math.max(x.h, b.h); x.l = Math.min(x.l, b.l); x.c = b.c; }
  }
  if (daily.length) {
    const last = daily[daily.length - 1].d;
    if (key(nextBusinessDay(last)) === key(last)) out.pop();
  }
  return out;
}
export const STOCK_ZONE_TFS = ['W1', 'MN', '3M'] as const;
/** The zones scan.py publishes for one ticker (ticker_detail()['zones']): every not-removed W1 / MN / 3M zone whose
 *  departure is within 200 bars, sorted by proximal (highest first). daily = CLOSED sessions (split adjusted). */
export function stockZonesOf(daily: ZBar[], price?: number | null): LiveZone[] {
  const px = price ?? (daily.length ? daily[daily.length - 1].c : 0);
  const out: LiveZone[] = [];
  for (const tf of STOCK_ZONE_TFS) {
    const bs = closedHtf(daily, tf);
    if (!bs.length) continue;
    const S = new Series(bs, px, tf);
    for (const z of rowZones(S, RAJA)) {
      if (z.removed || z.legBar > RAJA.max_zone_age) continue;
      const n = tests(S, z, RAJA).n;
      out.push({ tf, side: z.dir > 0 ? 'demand' : 'supply', proximal: roundTo(z.prox, 2), distal: roundTo(z.dist, 2), pattern: pattern(z),
        touches: n, fresh: n === 0, made: z.made, base_start: z.baseStart });
    }
  }
  return out.sort((a, b) => b.proximal - a.proximal);
}
