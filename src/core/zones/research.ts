/**
 * ZoneVision research CSV → compact touch-trade dataset.
 *
 * Input: the CSV RamanFX_ZoneVision.mq5 writes in research mode (Strategy Tester), one row per zone:
 * Terminal\Common\Files\RFX_ZoneResearch_<symbol>_<from>_<to>.csv. Columns are read BY NAME (the v2 columns are
 * appended after the v1 ones, so v1 files still parse). Each touch 1..3 becomes one trade record; untouched zones
 * are counted but are not trades (a limit order that never filled).
 *
 * Outcome columns used (see docs/Zone_Research_HowTo.md §4):
 *  - t<k>_mfe / t<k>_result: touch k with the WICK stop (a wick beyond the distal fills the stop = exactly −1R).
 *  - t1c_mfe / t1c_result / t1c_loss: touch 1 with the CLOSE stop (stopped only by a candle close beyond the distal).
 *    t1c_loss is the real R of that close (≈ −2R on average in 2023-25 data, not −1R). The indicator logs the
 *    close-stop model for touch 1 only.
 * Context columns: creation-time (raja_type, curve_zone, room_R, near_tl, pass_r, entry_modes) and the touch-1
 * snapshot copies (s1_*). The s1_* columns are taken on the touch candle's CLOSE while the order fills inside that
 * candle, so they leak the outcome (docs/research/Zone_ML_Benchmark.md: s1_touch_depth AUC 1.000). Both are kept;
 * the scorecard uses the creation columns unless the owner explicitly asks for the snapshot.
 */

export const RAJA_TYPES = ['ARR', 'WOW', 'STR', 'OVL', 'INH', 'FLP', 'OTL', 'TST', 'WK'] as const;
/** Raja lens verdict as the chart's RjC_Verdict shows it. 0 = no lens data (v1 file, or DNA not computed). */
export const VERDICTS = ['', 'TAKE', 'WAIT', 'CONFIRM', 'SKIP'] as const;
/** Curve position relative to the side: 1 right side (demand ≤ 25 / supply ≥ 75), 2 middle, 3 wrong side. 0 unknown. */
export const CURVE = ['', 'right', 'middle', 'wrong'] as const;
export const RES = ['', 'stop', 'target', 'open'] as const;

/** Columnar touch trades. One index = one touch of one zone. Typed arrays keep 100k trades in a few MB. */
export interface TradeCols {
  day: Int32Array;      // creation day (days since 1970-01-01, server clock) — the IS / OOS split key
  time: Float64Array;   // touch time (minutes since 1970-01-01, server clock) — chronological order for drawdown
  sym: Uint16Array;     // index into Dataset.symbols
  tf: Uint8Array;       // index into Dataset.tfs
  side: Int8Array;      // +1 demand (buy), −1 supply (sell)
  k: Uint8Array;        // touch number 1..3
  alt: Uint8Array;      // 1 = ALT detector row, 0 = ZoneVision (ZV)
  draw: Uint8Array;     // would_draw: the chart would show this zone (1), hidden (0), unknown (2)
  rtC: Uint8Array; rtS: Uint8Array;       // Raja type, 1-based into RAJA_TYPES (0 unknown). C = creation, S = s1 snapshot
  cvC: Uint8Array; cvS: Uint8Array;       // CURVE code
  roomC: Float32Array; roomS: Float32Array; // room in R to the nearest opposing level (99 = nothing opposing, NaN unknown)
  tlC: Int8Array; tlS: Int8Array;         // near a trendline 1 / 0, −1 unknown
  vC: Uint8Array; vS: Uint8Array;         // VERDICTS code
  s1: Uint8Array;       // 1 = the s1 snapshot was taken for this zone
  oppR: Float32Array;   // opp_R (0 = none)
  mfeW: Float32Array; resW: Uint8Array;   // wick-stop model of this touch
  mfeC: Float32Array; resC: Uint8Array; lossC: Float32Array; // close-stop model (touch 1 only; resC 0 = not logged)
}
export type ColName = keyof TradeCols;

const CTORS: { [K in ColName]: { new (n: number): TradeCols[K] } } = {
  day: Int32Array, time: Float64Array, sym: Uint16Array, tf: Uint8Array, side: Int8Array, k: Uint8Array, alt: Uint8Array, draw: Uint8Array,
  rtC: Uint8Array, rtS: Uint8Array, cvC: Uint8Array, cvS: Uint8Array, roomC: Float32Array, roomS: Float32Array, tlC: Int8Array, tlS: Int8Array,
  vC: Uint8Array, vS: Uint8Array, s1: Uint8Array, oppR: Float32Array, mfeW: Float32Array, resW: Uint8Array, mfeC: Float32Array, resC: Uint8Array, lossC: Float32Array,
};
export const COL_NAMES = Object.keys(CTORS) as ColName[];

export interface FileInfo { name: string; zones: number; trades: number; dup: number; v2: boolean; from: string; to: string; symbols: string[]; at: number }
export interface Dataset {
  version: 1;
  n: number;
  cols: TradeCols;
  symbols: string[];
  tfs: string[];
  /** Zone keys already loaded (detector|symbol|tf|id): overlapping test runs repeat zones; the first copy wins (as analyze.py). */
  keys: string[];
  files: FileInfo[];
  /** Zones read, including untouched ones (touch rate = trades on touch 1 / zones). */
  zones: number;
}

export function emptyCols(n = 0): TradeCols {
  const o = {} as Record<ColName, unknown>;
  for (const c of COL_NAMES) o[c] = new CTORS[c](n);
  return o as unknown as TradeCols;
}
export function emptyDataset(): Dataset {
  return { version: 1, n: 0, cols: emptyCols(), symbols: [], tfs: [], keys: [], files: [], zones: 0 };
}

/** Thrown for a CSV that is not a research file, with a message the owner can act on. */
export class NotResearchError extends Error {}

const num = (v: string | undefined): number => {
  if (v == null || v === '') return NaN;
  const x = Number(v);
  return Number.isFinite(x) ? x : NaN;
};
/** "2023.01.02 01:00" (MT5 TimeToString) → minutes since epoch, the server clock read as UTC. NaN when blank. */
export function mt5Minutes(s: string | undefined): number {
  if (!s) return NaN;
  const m = /^(\d{4})[.-](\d{2})[.-](\d{2})(?:[ T](\d{2}):(\d{2}))?/.exec(s.trim());
  if (!m) return NaN;
  return Date.UTC(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0)) / 60000;
}
export const dayToISO = (d: number) => new Date(d * 86400000).toISOString().slice(0, 10);
export const isoToDay = (s: string) => Math.floor(Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 86400000);

const resCode = (s: string | undefined) => (s === 'stop' ? 1 : s === 'target' ? 2 : s === 'open' ? 3 : 0);
const rtCode = (s: string | undefined) => { const i = (RAJA_TYPES as readonly string[]).indexOf((s ?? '').trim().toUpperCase()); return i < 0 ? 0 : i + 1; };
/** Raja verdict from the lens columns, exactly as the chart's RjC_Verdict: pass_r → TAKE; else the Raja entry mode digit 1 WAIT, 2 CONFIRM, else SKIP. */
export function verdictCode(passR: string | undefined, entryModes: string | undefined): number {
  if (passR == null || passR === '') return 0;
  if (passR === '1') return 1;
  const em = num(entryModes);
  if (!Number.isFinite(em)) return 0;
  const r = Math.floor(em / 10) % 10;
  return r === 1 ? 2 : r === 2 ? 3 : 4;
}
/** Raja curve: buys low (≤ 25), sells high (≥ 75); the zone's own side decides right / wrong. */
export function curveCode(curve: number, side: number): number {
  if (!Number.isFinite(curve)) return 0;
  const right = side > 0 ? curve <= 25 : curve >= 75;
  const wrong = side > 0 ? curve >= 75 : curve <= 25;
  return right ? 1 : wrong ? 3 : 2;
}
const tlCode = (v: string | undefined) => (v === '1' ? 1 : v === '0' ? 0 : -1);

/** What the header says about a CSV, or a NotResearchError for files that are not research rows. */
export function checkHeader(header: string[]): { v2: boolean } {
  const h = new Set(header);
  if (!h.has('detector') || !h.has('t1_time')) {
    if (h.has('stop_model') && h.has('key')) {
      throw new NotResearchError('This is a calibration table (RFX_Calib.csv from analyze.py --calibrate): it holds summary cells, not one row per zone, so it cannot be scored here. Import the RFX_ZoneResearch_<symbol>_… CSV the Strategy Tester wrote.');
    }
    throw new NotResearchError('Not a ZoneVision research CSV: the header has no "detector" / "t1_time" columns. Use the RFX_ZoneResearch_<symbol>_<from>_<to>.csv file from Terminal\\Common\\Files.');
  }
  return { v2: h.has('raja_type') || h.has('s1_ok') };
}

/**
 * Incremental parser: feed text chunks (any split, even mid-line) and it appends trades as it goes.
 * Research CSVs have no quoting (the indicator strips commas and quotes from values), so a plain split is exact.
 */
export class ResearchParser {
  private rest = '';
  private idx: Record<string, number> | null = null;
  private v2 = false;
  private symMap = new Map<string, number>();
  private tfMap = new Map<string, number>();
  private seen: Set<string>;
  private buf: { [K in ColName]: number[] } = Object.fromEntries(COL_NAMES.map(c => [c, []])) as unknown as { [K in ColName]: number[] };
  readonly symbols: string[];
  readonly tfs: string[];
  readonly newKeys: string[] = [];
  zones = 0;
  dup = 0;
  trades = 0;
  private minDay = Infinity;
  private maxDay = -Infinity;
  private fileSyms = new Set<string>();

  constructor(base: { symbols: string[]; tfs: string[]; keys: Iterable<string> } = { symbols: [], tfs: [], keys: [] }) {
    this.symbols = [...base.symbols];
    this.tfs = [...base.tfs];
    this.symbols.forEach((s, i) => this.symMap.set(s, i));
    this.tfs.forEach((s, i) => this.tfMap.set(s, i));
    this.seen = new Set(base.keys);
  }

  push(text: string) {
    const all = this.rest + text;
    const lines = all.split(/\r?\n/);
    this.rest = lines.pop() ?? '';
    for (const l of lines) this.line(l);
  }

  end() {
    if (this.rest) this.line(this.rest);
    this.rest = '';
    if (!this.idx) throw new NotResearchError('The file is empty.');
  }

  private line(raw: string) {
    const l = raw.replace(/^﻿/, '');
    if (!l.trim()) return;
    const f = l.split(',');
    if (!this.idx) {
      const names = f.map(s => s.trim());
      this.v2 = checkHeader(names).v2;
      this.idx = {};
      names.forEach((n, i) => { if (this.idx![n] === undefined) this.idx![n] = i; });
      return;
    }
    const ix = this.idx;
    const g = (name: string): string | undefined => { const i = ix[name]; return i === undefined ? undefined : f[i]; };
    const det = g('detector');
    if (!det) return;
    const sym = (g('symbol') ?? '').trim(), tf = (g('tf') ?? '').trim();
    const key = `${det}|${sym}|${tf}|${g('id') ?? ''}`;
    if (this.seen.has(key)) { this.dup++; return; }
    this.seen.add(key);
    this.newKeys.push(key);
    this.zones++;
    const created = mt5Minutes(g('created'));
    const day = Number.isFinite(created) ? Math.floor(created / 1440) : 0;
    if (Number.isFinite(created)) { this.minDay = Math.min(this.minDay, day); this.maxDay = Math.max(this.maxDay, day); }
    let si = this.symMap.get(sym);
    if (si === undefined) { si = this.symbols.length; this.symbols.push(sym); this.symMap.set(sym, si); }
    this.fileSyms.add(sym);
    let ti = this.tfMap.get(tf);
    if (ti === undefined) { ti = this.tfs.length; this.tfs.push(tf); this.tfMap.set(tf, ti); }
    const side = g('type') === 'supply' ? -1 : 1;
    const wd = g('would_draw');
    const oppR = num(g('opp_R'));
    // creation context; v1 files only have `curve` (HTF 100-candle range) and opp_R
    const cvRawC = num(g('curve_zone'));
    const cvC = curveCode(Number.isFinite(cvRawC) ? cvRawC : num(g('curve')), side);
    const roomRawC = num(g('room_R'));
    const roomC = Number.isFinite(roomRawC) ? roomRawC : Number.isFinite(oppR) ? (oppR > 0 ? oppR : 99) : NaN;
    const rtC = rtCode(g('raja_type'));
    const tlC = tlCode(g('near_tl'));
    const vC = verdictCode(g('pass_r'), g('entry_modes'));
    // touch-1 snapshot (look-ahead): falls back to creation when it was not taken, as analyze.py does
    const s1 = g('s1_ok') === '1' ? 1 : 0;
    const cvRawS = num(g('s1_curve_zone'));
    const roomRawS = num(g('s1_room_R'));
    const rtS = s1 ? rtCode(g('s1_raja_type')) : rtC;
    const cvS = s1 && Number.isFinite(cvRawS) ? curveCode(cvRawS, side) : cvC;
    const roomS = s1 && Number.isFinite(roomRawS) ? roomRawS : roomC;
    const tlS = s1 ? tlCode(g('s1_near_tl')) : tlC;
    const vS = s1 ? verdictCode(g('s1_pass_r'), g('s1_entry_modes')) : vC;
    for (let k = 1; k <= 3; k++) {
      const tt = g(`t${k}_time`);
      if (!tt) continue;
      const b = this.buf;
      b.day.push(day); b.time.push(mt5Minutes(tt)); b.sym.push(si); b.tf.push(ti); b.side.push(side); b.k.push(k);
      b.alt.push(det === 'ALT' ? 1 : 0); b.draw.push(wd === '1' ? 1 : wd === '0' ? 0 : 2);
      b.rtC.push(rtC); b.rtS.push(rtS); b.cvC.push(cvC); b.cvS.push(cvS); b.roomC.push(roomC); b.roomS.push(roomS);
      b.tlC.push(tlC); b.tlS.push(tlS); b.vC.push(vC); b.vS.push(vS); b.s1.push(s1); b.oppR.push(Number.isFinite(oppR) ? oppR : 0);
      b.mfeW.push(num(g(`t${k}_mfe`)) || 0); b.resW.push(resCode(g(`t${k}_result`)));
      if (k === 1) {
        const rc = resCode(g('t1c_result'));
        b.mfeC.push(rc ? num(g('t1c_mfe')) || 0 : NaN); b.resC.push(rc); b.lossC.push(num(g('t1c_loss')));
      } else { b.mfeC.push(NaN); b.resC.push(0); b.lossC.push(NaN); }
      this.trades++;
    }
  }

  /** The trades parsed so far as typed arrays (transferable to the main thread). */
  cols(): TradeCols {
    const o = {} as Record<ColName, unknown>;
    for (const c of COL_NAMES) o[c] = (CTORS[c] as unknown as { from: (a: number[]) => unknown }).from(this.buf[c]);
    return o as unknown as TradeCols;
  }

  info(name: string): FileInfo {
    return {
      name, zones: this.zones, trades: this.trades, dup: this.dup, v2: this.v2, at: Date.now(),
      from: Number.isFinite(this.minDay) ? dayToISO(this.minDay) : '', to: Number.isFinite(this.maxDay) ? dayToISO(this.maxDay) : '',
      symbols: [...this.fileSyms],
    };
  }
}

/** Append one parsed file to a dataset (the parser was seeded with this dataset's symbols / tfs / keys). */
export function mergeInto(ds: Dataset, p: { cols: TradeCols; symbols: string[]; tfs: string[]; newKeys: string[]; info: FileInfo; zones: number }): Dataset {
  const add = p.cols.day.length;
  const n = ds.n + add;
  const cols = {} as Record<ColName, unknown>;
  for (const c of COL_NAMES) {
    const a = new CTORS[c](n) as unknown as { set: (src: ArrayLike<number>, off?: number) => void };
    a.set(ds.cols[c] as unknown as ArrayLike<number>, 0);
    a.set(p.cols[c] as unknown as ArrayLike<number>, ds.n);
    cols[c] = a;
  }
  return { version: 1, n, cols: cols as unknown as TradeCols, symbols: p.symbols, tfs: p.tfs, keys: [...ds.keys, ...p.newKeys], files: [...ds.files, p.info], zones: ds.zones + p.zones };
}

/** Parse a whole CSV string at once (tests, small files). */
export function parseResearchText(text: string, name = 'file.csv', base: Dataset = emptyDataset()): Dataset {
  const p = new ResearchParser(base);
  p.push(text);
  p.end();
  return mergeInto(base, { cols: p.cols(), symbols: p.symbols, tfs: p.tfs, newKeys: p.newKeys, info: p.info(name), zones: p.zones });
}
