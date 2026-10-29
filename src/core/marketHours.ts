// Market-hours study (tools/research/market_hours/deep.py + report.py): for every forex pair, metal, CFD and US stock,
// the best Calgary clock times and weekdays from the full history. /research/market_hours_by_symbol.json is compact
// (short keys); parsed defensively here: a missing or odd field falls back instead of throwing.

export const MH_URL = '/research/market_hours_by_symbol.json';
export const MH_SLOTS = 48;
export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const;

export type MhKind = 'major' | 'cross' | 'exotic' | 'metal' | 'cfd' | 'stock' | 'etf' | 'other';
export type MhFilter = 'all' | 'fx' | 'metal' | 'cfd' | 'stock';
export type Reliability = 'reliable' | 'weak';

/** One best window: Calgary peak half-hour, its window, activity multiple and the share of big-move days. */
export interface MhWindow { mt: string; ny: string; from: string; to: string; activity: number | null; bigPct: number | null }
export interface MhWeekday { best: string; quiet: string; ratio: number | null; ciLo: number | null; ciHi: number | null; rel: Reliability }
export interface MhEvent { ratio: number; days: number; bigPct: number | null; bigCtrlPct: number | null }
export interface MhEra { recentVsAll: number | null; prePost: number | null; peakPre: string | null; peakPost: string | null; peakRecent: string | null; shifted: boolean }
export interface MhSymbol {
  sym: string; name: string; kind: MhKind; group: string; display: string; indexes: string; watchlist: boolean;
  from: string; to: string; years: number | null;
  windows: MhWindow[]; timesRel: Reliability; timesRho: number | null;
  weekday: MhWeekday | null; days: (number | null)[];
  era: MhEra; nfp: MhEvent | null; fomc1200: MhEvent | null; fomc1230: MhEvent | null;
  /** Mon-Fri activity per Calgary half-hour (index 0 = 00:00), x typical. */
  profile: (number | null)[];
}
export interface MhFile { generated: string; synthetic: boolean; fxCount: number; stockCount: number; feed: string; fomcSource: string; nfpSource: string; symbols: MhSymbol[] }

type J = Record<string, unknown>;
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (v: unknown, d = ''): string => (typeof v === 'string' ? v : d);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const rel = (v: unknown): Reliability => (v === 'reliable' ? 'reliable' : 'weak');
const KINDS: readonly string[] = ['major', 'cross', 'exotic', 'metal', 'cfd', 'stock', 'etf'];
const HHMM = /^\d{2}:\d{2}$/;
const hhmm = (v: unknown): string | null => (typeof v === 'string' && HHMM.test(v) ? v : null);

function parseEvent(v: unknown): MhEvent | null {
  const a = arr(v);
  const ratio = num(a[0]), days = num(a[1]);
  return ratio == null || days == null ? null : { ratio, days, bigPct: num(a[2]), bigCtrlPct: num(a[3]) };
}

export function parseSymbol(v: unknown): MhSymbol | null {
  const o = obj(v);
  const sym = str(o.s);
  if (!sym) return null;
  const y = arr(o.y);
  const w = arr(o.w);
  const e = arr(o.e);
  const windows = arr(o.t).map(x => {
    const a = arr(x);
    const mt = hhmm(a[0]);
    return mt ? { mt, ny: hhmm(a[1]) ?? '', from: hhmm(a[2]) ?? mt, to: hhmm(a[3]) ?? mt, activity: num(a[4]), bigPct: num(a[5]) } : null;
  }).filter((x): x is MhWindow => !!x);
  const profile = arr(o.p).slice(0, MH_SLOTS).map(x => { const n = num(x); return n == null ? null : n / 100; });
  while (profile.length < MH_SLOTS) profile.push(null);
  const kind = str(o.k);
  return {
    sym, name: str(o.n, sym), kind: (KINDS.includes(kind) ? kind : 'other') as MhKind, group: str(o.g), display: str(o.d), indexes: str(o.i),
    watchlist: o.wl === true, from: str(y[0]), to: str(y[1]), years: num(y[2]),
    windows, timesRel: rel(o.tr), timesRho: num(o.th),
    weekday: w.length && typeof w[0] === 'string' ? { best: str(w[0]), quiet: str(w[1]), ratio: num(w[2]), ciLo: num(w[3]), ciHi: num(w[4]), rel: rel(w[5]) } : null,
    days: WEEKDAYS.map((_, i) => num(arr(o.dd)[i])),
    era: { recentVsAll: num(e[0]), prePost: num(e[1]), peakPre: hhmm(e[2]), peakPost: hhmm(e[3]), peakRecent: hhmm(e[4]), shifted: e[5] === true },
    nfp: parseEvent(o.nfp), fomc1200: parseEvent(o.f12), fomc1230: parseEvent(o.f1230), profile,
  };
}

export function parseMarketHours(v: unknown): MhFile {
  const o = obj(v), m = obj(o.meta);
  const symbols = arr(o.symbols).map(parseSymbol).filter((x): x is MhSymbol => !!x);
  return {
    generated: str(m.generated), synthetic: m.synthetic === true, fxCount: num(m.n_fx) ?? 0, stockCount: num(m.n_stocks) ?? 0,
    feed: str(m.alpaca_feed), fomcSource: str(m.fomc_source), nfpSource: str(m.nfp_source), symbols,
  };
}

export const isFx = (k: MhKind) => k === 'major' || k === 'cross' || k === 'exotic';
export const KIND_LABEL: Record<MhKind, string> = { major: 'Major', cross: 'Cross', exotic: 'Exotic', metal: 'Metal', cfd: 'CFD', stock: 'Stock', etf: 'ETF', other: 'Other' };

export function matchesFilter(s: MhSymbol, f: MhFilter): boolean {
  if (f === 'all') return true;
  if (f === 'fx') return isFx(s.kind);
  if (f === 'stock') return s.kind === 'stock' || s.kind === 'etf';
  return s.kind === f;
}

const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

/** Ranked search: exact symbol, then symbol prefix, then OANDA name / company name contains. Watchlist first on ties. */
export function searchSymbols(list: MhSymbol[], q: string, f: MhFilter = 'all', limit = 40): MhSymbol[] {
  const n = norm(q);
  const pool = list.filter(s => matchesFilter(s, f));
  const rank = (s: MhSymbol): number => {
    if (!n) return s.watchlist ? 0 : isFx(s.kind) ? 1 : 2;
    const a = norm(s.sym), b = norm(s.name);
    if (a === n || b === n) return 0;
    if (a.startsWith(n) || b.startsWith(n)) return 1;
    if (a.includes(n) || b.includes(n)) return 2;
    if (norm(s.display).includes(n)) return 3;
    return 9;
  };
  return pool.map(s => ({ s, r: rank(s) })).filter(x => x.r < 9)
    .sort((x, y) => x.r - y.r || Number(y.s.watchlist) - Number(x.s.watchlist) || x.s.sym.localeCompare(y.s.sym))
    .slice(0, limit).map(x => x.s);
}

export const findSymbol = (list: MhSymbol[], q: string) => { const n = norm(q); return list.find(s => norm(s.sym) === n || norm(s.name) === n) ?? null; };

/** "1.84x" / "-" */
export const fmtX = (v: number | null | undefined, d = 2) => (v == null ? '–' : `${v.toFixed(d)}×`);

/** Calgary "HH:MM" + minutes, wrapping at midnight. */
export function addMinutes(t: string, m: number): string {
  const [h, mm] = t.split(':').map(Number);
  const x = (((h * 60 + mm + m) % 1440) + 1440) % 1440;
  return `${String(Math.floor(x / 60)).padStart(2, '0')}:${String(x % 60).padStart(2, '0')}`;
}

/** New York time of a Calgary clock time (always +2 h: both follow US daylight-saving dates). */
export const nyOf = (mt: string) => addMinutes(mt, 120);

export const slotLabel = (i: number) => `${String(Math.floor(i / 2)).padStart(2, '0')}:${i % 2 ? '30' : '00'}`;
