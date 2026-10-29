// The daily S&P 500 scan written by tools/stock_scanner (GitHub Actions) to public/scanner/latest.json.
// Rule-based (Raja first, Kevin second); fundamentals are context only. Holdings never appear here beyond a symbol.

/** Zone timeframes: W1, MN and 3M (D1 in scan files before the top-down rule). */
export type ZoneTF = 'D1' | 'W1' | 'MN' | '3M';
export const ZONE_TFS: ZoneTF[] = ['W1', 'MN', '3M'];
export type RuleStatus = 'pass' | 'fail' | 'warn' | 'unknown' | 'info';
export interface ScanRule { status: RuleStatus; text: string; ref: string; short?: string }
export type SignalKind = 'BUY' | 'WATCH';

export interface ScanSignal {
  kind: SignalKind;
  watch?: 'new' | 'tested';
  symbol: string;
  name: string;
  sector: string;
  /** Index memberships, e.g. ['SPX', 'NDX']. */
  indexes?: IndexCode[];
  /** Raja lens score 0-10 (zone type, freshness, curve, room). */
  score?: number;
  exchange?: string;
  chart?: string;
  tf: ZoneTF;
  zone_type: string;
  zone_type_text: string;
  pattern: string;
  proximal: number;
  distal: number;
  height: number;
  base_candles: number;
  made: string;
  touches: number;
  curve: number;
  entry: number;
  stop: number;
  target: number | null;
  rr: number | null;
  next_supply: number | null;
  supply_distal?: number | null;
  /** 'supply' = 0.5% before the next supply; 'projection' = Raja's 250% projection (no supply above, L5). */
  target_kind?: 'supply' | 'projection' | null;
  stop_pct_of_height: number;
  price: number;
  to_entry_pct: number;
  direction: string;
  w1: string;
  mn: string;
  note?: string;
  earnings?: string | null;
  rules: ScanRule[];
  fundamentals_rows?: [string, string][];
  // Pinndx-inspired extras (display only; the Raja rules alone decide BUY)
  fv_lo?: number | null; fv_hi?: number | null; fv_dist_atr?: number | null; fv_inside?: boolean;
  pz1?: number | null; pz2?: number | null; pz3?: number | null; rr_pz1?: number | null; rr_pz2?: number | null; rr_pz3?: number | null;
  seiden_score?: number; seiden_parts?: Record<string, number>;
  index_state?: GaugeState | null; index_aligned?: boolean;
  gauge_state?: GaugeState; demand_pct_away?: number; supply_pct_away?: number | null;
  /** Home listing of an interlisted name (e.g. 'TSX:RY'; '' = a US company), price currency, issuer country. */
  /** Owner's top-down location (newer scans): code (inside / top / below / above / untouched / none / unknown), pass, text, chain. */
  loc?: string | null; loc_ok?: boolean | null; loc_text?: string | null; chain_text?: string | null; chain?: unknown[];
  /** 3M / 6M states and the 6M context line (newer scans). */
  m3?: string; m6?: string; ctx6?: unknown;
  home?: string; currency?: string; country?: string;
  /** Interlisted names: levels are the US listing in USD ('US listing · USD'); chart = US chart, chart_home = TSX chart (CAD). */
  listing_label?: string; levels_ccy?: string; chart_home?: string; chart_home_label?: string;
}

/** "TSX: RY · US listing · USD" for an interlisted name (levels from the US listing, in USD), '' otherwise. */
export const listingText = (x: { home?: string | null; h?: string }) => { const h = x.home || x.h || ''; return h.includes(':') ? `${h.replace(':', ': ')} · US listing · USD` : ''; };
/** Secondary chart link of an interlisted name: its TSX chart (CAD). null for a US company. */
export const homeChart = (x: { chart_home?: string; chart_home_label?: string }) => x.chart_home && x.chart_home.startsWith('https://www.tradingview.com/') ? { url: x.chart_home, label: x.chart_home_label || 'TSX chart (CAD)' } : null;

export type GaugeState = 'demand' | 'supply' | 'middle';
export interface GaugeZone { tf: string; proximal: number; distal: number; height?: number; pct: number }
/** The RFX composite index (equal-weight SPY, QQQ, IWM, DIA) with its own zones. */
export interface RfxIndex { symbol: string; name: string; price: number; state: GaugeState; date: string; direction: string; demand: GaugeZone | null; supply: GaugeZone | null; aligned: boolean; w1?: string; mn?: string; curve?: number | null; bars?: [string, number, number, number, number][] }

export const SEIDEN_PARTS: Record<string, string> = {
  departure: 'Departure (gap 2, ≥ 2x base 1)', time: 'Time at level (1-3 candles 1, 4-6 ½)', fresh: 'Freshness (1st 2, 2nd 1)',
  margin: 'Profit margin (≥ 3R 2, ≥ 2R 1)', trend: 'Trend (Raja direction FULL 2, REDUCED 1)', curve: 'Curve (≤ 25% 1, ≤ 50% ½)',
  fv_bonus: 'Bonus: ≥ 1 ATR below fair value', index_bonus: 'Bonus: RFX index aligned',
};
export const seidenText = (p?: Record<string, number>) => (p ? Object.entries(p).map(([k, v]) => `${SEIDEN_PARTS[k] ?? k}: ${v}`).join('\n') : '');
export const stateWord = (s?: GaugeState | null) => (s === 'demand' ? 'In demand' : s === 'supply' ? 'In supply' : 'Middle');

/** An index code from the scan's registry (SPX, NDX, DJI, TSX60, TSX, …): the app hard-codes none of them. */
export type IndexCode = string;
export interface IndexMeta { code: IndexCode; label: string; short: string; country: string }
/** Used only when a scan file has no index_meta (older files); a new index needs no change here. */
export const DEFAULT_INDEXES: IndexMeta[] = [
  { code: 'SPX', label: 'S&P 500', short: 'S&P', country: 'US' }, { code: 'NDX', label: 'Nasdaq-100', short: 'NDX', country: 'US' },
  { code: 'DJI', label: 'Dow 30', short: 'Dow', country: 'US' }, { code: 'TSX60', label: 'TSX 60', short: 'TSX60', country: 'CA' },
  { code: 'TSX', label: 'TSX Composite', short: 'TSX', country: 'CA' },
];
/** The scan's indexes in pill order (its registry, else the default list). */
export const indexesOf = (scan?: Pick<ScanFile, 'index_meta'> | null): IndexMeta[] => (scan?.index_meta?.length ? scan.index_meta : DEFAULT_INDEXES);
export const indexShort = (code: string, meta: IndexMeta[] = DEFAULT_INDEXES) => meta.find(m => m.code === code)?.short ?? code;
/** "S&P 500, Nasdaq-100 and TSX 60". */
export const indexList = (meta: IndexMeta[]) => meta.length > 1 ? `${meta.slice(0, -1).map(m => m.label).join(', ')} and ${meta[meta.length - 1].label}` : (meta[0]?.label ?? '');
export interface RegimeRow { symbol: string; close: number; sma200: number | null; above200: boolean | null; curve: number | null; curve_raja?: boolean; direction: string }
export interface ScanExit { symbol: string; sector?: string; indexes?: IndexCode[]; reasons: string[] }

export interface ScanFile {
  version: number;
  fixture?: boolean;
  date: string;
  generated_at: string;
  universe: number;
  scanned: number;
  errors?: number;
  disclaimer: string;
  counts: { BUY: number; WATCH: number; EXIT: number };
  signals: ScanSignal[];
  exits: ScanExit[];
  index_sizes?: Partial<Record<IndexCode, number>>;
  /** The index registry (labels in pill order). */
  index_meta?: IndexMeta[];
  /** Canadian coverage: {TSX60: {covered, total}, …} (covered = scanned through a US listing or a TSX feed). */
  coverage?: Record<string, { covered: number; total: number }>;
  /** Index members without data (TSX-only names until a TSX feed is switched on). */
  uncovered?: { symbol: string; name: string; indexes: IndexCode[] }[];
  regime?: RegimeRow[];
  rfx_index?: RfxIndex | null;
  /** Last ~6 months of daily bars per signalled ticker: [date, o, h, l, c]. */
  bars?: Record<string, [string, number, number, number, number][]>;
  /** 'intraday-dropped' = the scan ran while the US market was open: today's partial bar was left out. */
  session?: 'closed' | 'intraday-dropped';
  /** Banner text when price data is degraded (e.g. Alpaca IEX feed instead of SIP); '' = none. */
  data_warning?: string;
  feed_iex?: boolean;
  /** Why no signal: candidates (nearest fresh demand within `within_pct`% or in it) counted by first failing rule. */
  blocked?: ScanBlocked;
  /** The candidates closest to their entry, with the rule that blocks each. */
  closest?: ScanClosest[];
}

export interface BlockReason { rule: string; label: string; count: number }
export interface ScanBlocked { candidates: number; within_pct: number; reasons: BlockReason[] }
export interface ScanClosest {
  symbol: string; name: string; sector?: string; indexes?: IndexCode[]; tf: string; zone_type: string; proximal: number; distal: number;
  price: number; to_entry_pct: number; rule: string; label: string; fails: string[]; direction?: string; curve?: number;
}

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** Blocked counts from the file (bad rows dropped; null when the field is missing). */
export function parseBlocked(v: unknown): ScanBlocked | undefined {
  if (!v || typeof v !== 'object') return undefined;
  const o = v as Partial<ScanBlocked>;
  const reasons = Array.isArray(o.reasons) ? o.reasons.filter((r): r is BlockReason => !!r && typeof r.rule === 'string' && typeof r.label === 'string' && isNum(r.count)) : [];
  return { candidates: isNum(o.candidates) ? o.candidates : reasons.reduce((a, r) => a + r.count, 0), within_pct: isNum(o.within_pct) ? o.within_pct : 5, reasons };
}

function parseClosest(v: unknown): ScanClosest[] {
  if (!Array.isArray(v)) return [];
  return v.filter((r): r is ScanClosest => !!r && typeof r === 'object' && typeof r.symbol === 'string' && typeof r.rule === 'string' && isNum(r.to_entry_pct) && isNum(r.proximal))
    .map(r => ({ ...r, name: String(r.name ?? r.symbol), label: String(r.label ?? r.rule), fails: Array.isArray(r.fails) ? r.fails.map(String) : [], indexes: Array.isArray(r.indexes) ? r.indexes.filter(isIndex) : [] }));
}

/** "high on curve (312), direction not long (140), …" (top n). */
export const reasonsText = (b: ScanBlocked | undefined, n = 4) => (b?.reasons ?? []).slice(0, n).map(r => `${r.label} (${r.count.toLocaleString()})`).join(', ');

export const SCAN_URL = '/scanner/latest.json';

/** Accepts only a file that looks like a scan; anything else is treated as "no scan yet". */
export function parseScan(js: unknown): ScanFile | null {
  if (!js || typeof js !== 'object') return null;
  const o = js as Partial<ScanFile>;
  if (typeof o.version !== 'number' || !Array.isArray(o.signals) || !Array.isArray(o.exits)) return null;
  const signals = o.signals.filter((s): s is ScanSignal => !!s && typeof s === 'object' && typeof s.symbol === 'string' && (s.kind === 'BUY' || s.kind === 'WATCH') && Array.isArray(s.rules));
  return {
    version: o.version, fixture: !!o.fixture, date: String(o.date ?? ''), generated_at: String(o.generated_at ?? ''),
    universe: Number(o.universe ?? 0), scanned: Number(o.scanned ?? 0), errors: Number(o.errors ?? 0),
    disclaimer: String(o.disclaimer ?? 'Rule-based scan, not financial advice.'),
    counts: { BUY: signals.filter(s => s.kind === 'BUY').length, WATCH: signals.filter(s => s.kind === 'WATCH').length, EXIT: o.exits.length },
    signals: signals.map(s => ({ ...s, sector: s.sector || 'Other', indexes: Array.isArray(s.indexes) ? s.indexes.filter(isIndex) : [] })),
    exits: o.exits.filter(e => e && typeof e.symbol === 'string').map(e => ({
      symbol: e.symbol, reasons: Array.isArray(e.reasons) ? e.reasons.map(String) : [],
      ...(typeof e.sector === 'string' && e.sector ? { sector: e.sector } : {}), ...(Array.isArray(e.indexes) ? { indexes: e.indexes.filter(isIndex) } : {}),
    })),
    index_sizes: o.index_sizes && typeof o.index_sizes === 'object' ? o.index_sizes : {},
    index_meta: Array.isArray(o.index_meta) ? o.index_meta.filter((m): m is IndexMeta => !!m && typeof m.code === 'string' && typeof m.label === 'string').map(m => ({ ...m, short: String(m.short || m.code), country: String(m.country || '') })) : [],
    coverage: o.coverage && typeof o.coverage === 'object' ? o.coverage : {},
    uncovered: Array.isArray(o.uncovered) ? o.uncovered.filter(u => u && typeof u.symbol === 'string').map(u => ({ symbol: u.symbol, name: String(u.name ?? ''), indexes: Array.isArray(u.indexes) ? u.indexes.filter(isIndex) : [] })) : [],
    regime: Array.isArray(o.regime) ? o.regime.filter(r => r && typeof r.symbol === 'string') : [],
    rfx_index: o.rfx_index && typeof o.rfx_index === 'object' && typeof o.rfx_index.price === 'number' ? o.rfx_index : null,
    bars: o.bars && typeof o.bars === 'object' ? Object.fromEntries(Object.entries(o.bars).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.filter(b => Array.isArray(b) && b.length === 5 && b.slice(1).every(n => typeof n === 'number' && Number.isFinite(n)))])) : {},
    session: o.session === 'intraday-dropped' ? 'intraday-dropped' : 'closed',
    data_warning: typeof o.data_warning === 'string' ? o.data_warning : '',
    feed_iex: !!o.feed_iex,
    blocked: parseBlocked(o.blocked),
    closest: parseClosest(o.closest),
  };
}

const isIndex = (v: unknown): v is IndexCode => typeof v === 'string' && /^[A-Z0-9]{2,8}$/.test(v);

export type IndexFilter = 'all' | IndexCode;
/** Signals / exits in an index and a sector ('all' = any). */
export function matches(x: { indexes?: IndexCode[]; sector?: string }, idx: IndexFilter, sector: string): boolean {
  return (idx === 'all' || !!x.indexes?.includes(idx)) && (sector === 'all' || (x.sector || 'Other') === sector);
}
/** Sectors present, most BUYs first. */
export function sectorsOf(scan: ScanFile): { sector: string; buys: number; total: number }[] {
  const m = new Map<string, { buys: number; total: number }>();
  for (const s of scan.signals) { const k = s.sector || 'Other'; const v = m.get(k) ?? { buys: 0, total: 0 }; v.total++; if (s.kind === 'BUY') v.buys++; m.set(k, v); }
  for (const e of scan.exits) { const k = e.sector || 'Other'; const v = m.get(k) ?? { buys: 0, total: 0 }; v.total++; m.set(k, v); }
  return [...m].map(([sector, v]) => ({ sector, ...v })).sort((a, b) => b.buys - a.buys || b.total - a.total || a.sector.localeCompare(b.sector));
}
export const SECTOR_SHORT: Record<string, string> = {
  'Information Technology': 'Tech', 'Health Care': 'Health', 'Consumer Discretionary': 'Discretionary', 'Consumer Staples': 'Staples',
  'Communication Services': 'Comms', 'Real Estate': 'Real estate',
};

export const EXIT_REASON: Record<string, string> = {
  stop: 'Stop hit by a close',
  demand_broken: 'Demand under the entry broken by a close',
  near_supply: 'Within one zone height of the next supply',
  in_supply: 'Price is inside a supply',
  trail: 'Trail the stop behind a new demand (L3)',
  trail_broken: 'Trail demand broken by a close (L3)',
  trend_change: 'Direction changed down',
  currency: 'Holding currency differs from the scanned listing',
};

/**
 * A stock price for display: 2 decimals with thousands separators (4,500.00), more decimals below $1 so a
 * sub-dollar price never collapses to "0.01" (0.0123 -> 0.0123). Same rule as the zone chart's labels.
 */
export function px(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return '—';
  const a = Math.abs(n);
  const dp = a === 0 || a >= 1 ? 2 : a >= 0.1 ? 3 : 4;
  return n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp });
}

/** TradingView chart link (the scan supplies it with the exchange prefix when it knows it). */
export const tvChart = (s: Pick<ScanSignal, 'symbol' | 'chart'>) => s.chart && s.chart.startsWith('https://www.tradingview.com/') ? s.chart : `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(s.symbol)}`;

/** /plan/new prefilled from a signal: side, levels, zone kind, curve and the opposing HTF zone. */
export function planLink(s: ScanSignal): string {
  const q = new URLSearchParams({ symbol: s.symbol, side: 'buy', entry: String(s.entry), stop: String(s.stop), proximal: String(s.proximal), distal: String(s.distal), curve: String(Math.round(s.curve)), kind: /RBR|DBD/.test(s.pattern) ? 'CP' : 'VP', base: String(s.base_candles), src: 'scanner' });
  if (s.target != null) q.set('target', String(s.target));
  if (s.next_supply != null) q.set('opp', String(s.next_supply));
  return `/plan/new?${q.toString()}`;
}

const numOrNull = (v: string | null) => { if (v == null || v === '') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };

/** Plan fields from /plan/new query params (only what is present and valid). */
export function planFromParams(p: URLSearchParams) {
  const out: Record<string, unknown> = {};
  const side = p.get('side');
  if (side === 'buy' || side === 'sell') out.side = side;
  for (const [k, f] of [['entry', 'entry'], ['stop', 'stop'], ['target', 'target'], ['proximal', 'proximal'], ['distal', 'distal'], ['opp', 'opposingHtf']] as const) {
    const n = numOrNull(p.get(k));
    if (n != null) out[f] = n;
  }
  const curve = numOrNull(p.get('curve'));
  if (curve != null) out.curve = Math.max(0, Math.min(100, Math.round(curve)));
  const kind = p.get('kind');
  if (kind === 'VP' || kind === 'CP') out.kind = kind;
  const base = numOrNull(p.get('base'));
  if (base != null && base >= 1 && base <= 6) out.baseCandles = Math.round(base);
  if (p.get('src') === 'scanner') out.note = 'From the stock scanner (rule-based, daily close). Check the chart before the order.';
  return out;
}

export const ruleIcon: Record<RuleStatus, string> = { pass: '✓', fail: '✗', warn: '!', unknown: '?', info: '·' };

/** "x minutes / hours / days ago" for the last-updated line. */
export function ago(iso: string, now = Date.now()): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const m = Math.max(0, Math.round((now - t) / 60000));
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 48) return `${h} h ago`;
  return `${Math.round(h / 24)} days ago`;
}

// ─── Search: every ticker of the universe (public/scanner/index.json + shard files t/<k>.json) ─────────────
export const INDEX_URL = '/scanner/index.json';
export const shardUrl = (k: number) => `/scanner/t/${k}.json`;

/** One search row: s symbol, n name, sec sector, ix indexes, px last close, dd / ds distance % to the nearest fresh
 *  demand / supply, sig today's signal, k shard number. Market map: dz nearest fresh demand [tf, type, Raja score,
 *  touches], sz nearest fresh supply [tf, type, touches], br the first rule blocking a BUY (no signal), h home
 *  listing ('TSX:RY'), cur currency when not USD. */
export interface IndexRow {
  s: string; n: string; sec: string; ix: IndexCode[]; px: number; dd?: number; ds?: number; sig?: SignalKind; k: number;
  /** D in demand, S in supply, M middle */ st?: 'D' | 'S' | 'M';
  dz?: [string, string, number, number]; sz?: [string, string, number]; br?: string; h?: string; cur?: string;
  /** Zone-list bucket (newer scans; same lists as Telegram): IS in supply, AS approaching supply, LS left supply,
   *  M middle, LD left demand, AD approaching demand, ID in demand. */
  mb?: BucketCode;
  /** The bucket's zone: [tf, type, score | null, touches, % from the close to the proximal, proximal]. */
  mz?: [string, string, number | null, number, number, number];
  /** Raja status on that zone: 'BUY' / 'WATCH' / 'ok' (rules pass) / 'dir' (supply side) / a rule key (BLOCK_LABEL). */
  mr?: string;
  /** Top-down location of the bucket's zone (newer scans): [code, text]. */
  ml?: [string, string];
}
export type BucketCode = 'IS' | 'AS' | 'LS' | 'M' | 'LD' | 'AD' | 'ID';
export interface ScanIndex { date: string; generated_at: string; fixture: boolean; tickers: IndexRow[] }

export interface DetailZone { tf: ZoneTF; side: 'demand' | 'supply'; proximal: number; distal: number; type: string; score: number | null; fresh: boolean; touches: number; made: string; pattern: string; loc?: string | null; loc_text?: string | null }
export interface NearZone { tf: string; proximal: number; distal: number; type: string; dist_pct: number }
export interface DetailCheck {
  zone: NearZone; kind: 'BUY' | 'no trade'; score: number | null; entry: number; stop: number; target: number | null; rr: number | null;
  next_supply: number | null; supply_distal?: number | null; target_kind?: 'supply' | 'projection' | null; stop_pct_of_height: number; rules: ScanRule[];
  pz1?: number | null; pz2?: number | null; pz3?: number | null; rr_pz1?: number | null; rr_pz2?: number | null; rr_pz3?: number | null;
  seiden_score?: number; seiden_parts?: Record<string, number>; fv_dist_atr?: number | null; fv_inside?: boolean; index_state?: GaugeState | null; index_aligned?: boolean;
  /** Owner's top-down location (newer scans): code (inside / top / below / above / untouched / none / unknown), pass, text, chain. */
  loc?: string | null; loc_ok?: boolean | null; loc_text?: string | null; chain_text?: string | null; chain?: unknown[];
}
export interface TickerDetail {
  symbol: string; name: string; sector: string; indexes: IndexCode[]; exchange?: string; chart?: string; date: string; price: number;
  home?: string; currency?: string; country?: string; chart_home?: string; chart_home_label?: string; signal: SignalKind | null; direction: string; d1: string; w1: string; mn: string; curve: number | null; curve_raja: boolean;
  zones: DetailZone[]; nearest_demand: NearZone | null; nearest_supply: NearZone | null; check: DetailCheck | null;
  fundamentals_rows: [string, string][]; bars: { t0: string; dt: number[]; b: [number, number, number, number][] };
  /** Newer scans, listed / signalled / watched tickers only: higher-TF chart bars (forming period included), same packing as bars. */
  hb?: Partial<Record<'W1' | 'MN' | '3M', { t0: string; dt: number[]; b: [number, number, number, number][] }>>;
  gauge?: { state: GaugeState; demand: GaugeZone | null; supply: GaugeZone | null };
  fv?: { lo: number; hi: number; method: string } | null;
  /** Newer scans: 3M / 6M states, 6M context, the zone timeframes and the curve timeframe. */
  m3?: string; m6?: string; ctx6?: unknown; tfs?: string[]; curve_tf?: string;
}

// ─── Watchlist (per viewer, this device) ──────────────────────────────────────────────────────────────────
export const WATCH_KEY = 'rfx_scanner_watchlist';
export function readWatch(): string[] { try { const v = JSON.parse(localStorage.getItem(WATCH_KEY) ?? '[]'); return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : []; } catch { return []; } }
export function writeWatch(list: string[]) { try { localStorage.setItem(WATCH_KEY, JSON.stringify([...new Set(list)].sort())); } catch { /* storage blocked */ } }
export const toggleWatch = (list: string[], sym: string) => (list.includes(sym) ? list.filter(s => s !== sym) : [...list, sym].sort());

export type SortKey = 'score' | 'seiden' | 'near' | 'rr';
export function sortSignals<T extends ScanSignal>(list: T[], key: SortKey): T[] {
  const v = (s: T) => key === 'score' ? -(s.score ?? 0) : key === 'seiden' ? -(s.seiden_score ?? 0) : key === 'rr' ? -(s.rr ?? 0) : Math.abs(s.to_entry_pct);
  return [...list].sort((a, b) => v(a) - v(b) || (b.score ?? 0) - (a.score ?? 0));
}

export function parseIndex(js: unknown): ScanIndex | null {
  if (!js || typeof js !== 'object' || !Array.isArray((js as ScanIndex).tickers)) return null;
  const o = js as ScanIndex;
  const tickers = o.tickers.filter(r => r && typeof r.s === 'string' && typeof r.k === 'number')
    .map(r => {
      const { dz, sz, mb, mz, mr, ...rest } = r;
      const okDz = Array.isArray(dz) && dz.length === 4 && typeof dz[1] === 'string';
      const okSz = Array.isArray(sz) && sz.length === 3 && typeof sz[1] === 'string';
      const okMb = typeof mb === 'string' && mb in CODE_BUCKET;
      const okMz = Array.isArray(mz) && mz.length === 6 && typeof mz[0] === 'string' && typeof mz[1] === 'string' && isNum(mz[4]) && isNum(mz[5]);
      return { ...rest, n: String(r.n ?? r.s), sec: String(r.sec ?? ''), ix: Array.isArray(r.ix) ? r.ix.filter(isIndex) : [], ...(okDz ? { dz } : {}), ...(okSz ? { sz } : {}),
        ...(okMb ? { mb } : {}), ...(okMb && okMz ? { mz } : {}), ...(okMb && typeof mr === 'string' ? { mr } : {}) };
    });
  return { date: String(o.date ?? ''), generated_at: String(o.generated_at ?? ''), fixture: !!o.fixture, tickers };
}

/** The ticker's detail from its shard file (null when missing or malformed). */
export function detailFrom(js: unknown, symbol: string): TickerDetail | null {
  const t = (js as { tickers?: Record<string, TickerDetail> } | null)?.tickers?.[symbol];
  if (!t || typeof t !== 'object' || !t.bars || !Array.isArray(t.bars.b) || !Array.isArray(t.zones)) return null;
  return { ...t, indexes: Array.isArray(t.indexes) ? t.indexes.filter(isIndex) : [], fundamentals_rows: Array.isArray(t.fundamentals_rows) ? t.fundamentals_rows : [] };
}

/** URL-safe ticker (BRK.B -> BRK-B; a dot in the path would look like a file extension). */
export const slug = (sym: string) => sym.replace(/\./g, '-');
export const stockPath = (sym: string) => `/scanner/${encodeURIComponent(slug(sym))}`;
export const findBySlug = (rows: IndexRow[], s: string) => {
  const k = decodeURIComponent(s).toUpperCase();
  return rows.find(r => slug(r.s).toUpperCase() === k || r.s.toUpperCase() === k) ?? null;
};

/** Type-ahead: exact ticker, then ticker prefix, then name word prefix, then name contains. */
export function searchTickers(rows: IndexRow[], q: string, limit = 8): IndexRow[] {
  const t = q.trim().toUpperCase();
  if (!t) return [];
  const score = (r: IndexRow) => {
    const s = r.s.toUpperCase(), n = r.n.toUpperCase();
    if (s === t || slug(s) === t) return 0;
    if (s.startsWith(t)) return 1 + s.length / 100;
    if (n.split(/[\s.,&-]+/).some(w => w.startsWith(t))) return 3;
    if (t.length >= 2 && n.includes(t)) return 4;
    return -1;
  };
  return rows.map(r => [score(r), r] as const).filter(([s]) => s >= 0).sort((a, b) => a[0] - b[0] || a[1].s.localeCompare(b[1].s)).slice(0, limit).map(([, r]) => r);
}

/** Packed bars -> [date, o, h, l, c]. */
export function unpackBars(p: TickerDetail['bars']): [string, number, number, number, number][] {
  if (!p?.t0) return [];
  const d0 = Date.parse(`${p.t0}T00:00:00Z`);
  return p.b.map((b, i) => [new Date(d0 + (p.dt[i] ?? i) * 86400000).toISOString().slice(0, 10), b[0], b[1], b[2], b[3]]);
}

/** A Plan-it link from a detail's rule check (the nearest demand as if it were a BUY). */
export function checkPlanLink(d: TickerDetail): string | null {
  const c = d.check;
  if (!c) return null;
  const z = d.zones.find(x => x.side === 'demand' && x.proximal === c.zone.proximal && x.tf === c.zone.tf);
  return planLink({ symbol: d.symbol, entry: c.entry, stop: c.stop, target: c.target, proximal: c.zone.proximal, distal: c.zone.distal,
    curve: d.curve ?? 50, pattern: z?.pattern ?? 'DBR', base_candles: 2, next_supply: c.next_supply } as ScanSignal);
}

// ─── Market map: every stock by where its price sits against the fresh zones (index.json, no shard loads) ──────
export type Bucket = 'in_supply' | 'near_supply' | 'left_supply' | 'middle' | 'left_demand' | 'near_demand' | 'in_demand';
/** Distance (%) that counts as "approaching" a zone (the scan's default; newer files carry their own buckets). */
export const NEAR_PCT = 3;
export type Side = 'supply' | 'middle' | 'demand';
export const BUCKETS: { key: Bucket; label: string; short: string; side: Side; hint: string }[] = [
  { key: 'in_supply', label: 'In supply', short: 'In', side: 'supply', hint: 'Close inside a supply zone' },
  { key: 'near_supply', label: 'Approaching supply', short: 'Approaching', side: 'supply', hint: `Close within ${NEAR_PCT}% below a supply` },
  { key: 'left_supply', label: 'Left supply', short: 'Left', side: 'supply', hint: 'Touched a supply in the last 3 sessions and closed back below it (rejected)' },
  { key: 'middle', label: 'Middle', short: 'Middle', side: 'middle', hint: 'Not in, near or just off a zone' },
  { key: 'left_demand', label: 'Left demand', short: 'Left', side: 'demand', hint: 'Touched a demand in the last 3 sessions and closed back above it (bounced)' },
  { key: 'near_demand', label: 'Approaching demand', short: 'Approaching', side: 'demand', hint: `Close within ${NEAR_PCT}% above a demand` },
  { key: 'in_demand', label: 'In demand', short: 'In', side: 'demand', hint: 'Close inside a demand zone' },
];
export const CODE_BUCKET: Record<BucketCode, Bucket> = { IS: 'in_supply', AS: 'near_supply', LS: 'left_supply', M: 'middle', LD: 'left_demand', AD: 'near_demand', ID: 'in_demand' };
export const bucketMeta = (b: Bucket) => BUCKETS.find(x => x.key === b)!;
export const isBucket = (v: unknown): v is Bucket => typeof v === 'string' && BUCKETS.some(b => b.key === v);
export const STRONG_TYPES = new Set(['ARR', 'WOW', 'STR']);
/** The scanner's first blocking rule (index row `br`) in words; same labels as the Python BLOCK_LABEL. */
export const BLOCK_LABEL: Record<string, string> = {
  location: 'HTF area not reached', curve: 'high on curve', 'HTF align': 'direction not long', 'no HTF supply': 'monthly supply on top', 'not sideways': 'sideways market',
  strong: 'weak zone type', fresh: 'zone already tested', clean: 'overlap / flip zone', 'not used': 'zone already did its job',
  'no 3rd CP': '3rd CP in a row', room: 'room < 2x the stop (supply or 250% projection)', leg: 'departure < 2x the base', 'near entry': 'price not near the entry',
};

/** The row's bucket: the scan's own (mb, newer files), else from the gauge state and the distances (older files have
 *  no "left" information: those buckets stay empty until the next scan). */
export function bucketOf(r: Pick<IndexRow, 'st' | 'dd' | 'ds' | 'mb'>, near = NEAR_PCT): Bucket {
  if (r.mb && r.mb in CODE_BUCKET) return CODE_BUCKET[r.mb];
  if (r.st === 'S') return 'in_supply';
  if (r.st === 'D') return 'in_demand';
  const nd = r.dd != null && r.dd >= 0 && r.dd <= near;
  const ns = r.ds != null && r.ds >= 0 && r.ds <= near;
  if (nd && ns) return r.dd! <= r.ds! ? 'near_demand' : 'near_supply';
  return nd ? 'near_demand' : ns ? 'near_supply' : 'middle';
}

export interface MapZone { side: 'demand' | 'supply'; tf: string; type: string; score: number | null; touches: number; pct: number | null; strong: boolean; fresh: boolean }

/** The zone a row is shown with in its bucket: the scan's bucket zone (mz), else the nearest fresh supply on the
 *  supply side and the nearest fresh demand elsewhere. */
export function mapZone(r: IndexRow, b: Bucket): MapZone | null {
  const sup = bucketMeta(b).side === 'supply';
  if (r.mz && r.mb) {
    const [tf, type, score, touches, pct] = r.mz;
    return { side: sup ? 'supply' : 'demand', tf, type, score, touches, pct: b.startsWith('in_') ? 0 : pct, strong: STRONG_TYPES.has(type), fresh: touches === 0 };
  }
  const z = sup ? r.sz : r.dz;
  if (!z) return null;
  const touches = sup ? r.sz![2] : r.dz![3];
  return { side: sup ? 'supply' : 'demand', tf: z[0], type: z[1], score: sup ? null : r.dz![2], touches, pct: (sup ? r.ds : r.dd) ?? null, strong: STRONG_TYPES.has(z[1]), fresh: touches === 0 };
}

/** Strongest zones first. Newer files: zone score, then the nearest (the Telegram order, so its top 15 = the top
 *  of the column). Older files: strong type, then untouched, then Raja score, then the nearest. */
function strengthKey(r: IndexRow, b: Bucket): number[] {
  const z = mapZone(r, b);
  if (!z) return [1, 1, 0, 999];
  if (r.mz && r.mb) return [-(z.score ?? ((z.type === 'ARR' || z.type === 'WOW' ? 4 : z.type === 'STR' ? 3 : 0) + (z.touches === 0 ? 2 : z.touches === 1 ? 1 : 0))), Math.abs(z.pct ?? 999)];
  return [z.strong ? 0 : 1, z.fresh ? 0 : 1, -(z.score ?? 0), Math.abs(z.pct ?? 999)];
}

export function marketMap(rows: IndexRow[], idx: IndexFilter = 'all', sector = 'all'): Record<Bucket, IndexRow[]> {
  const out = Object.fromEntries(BUCKETS.map(b => [b.key, [] as IndexRow[]])) as unknown as Record<Bucket, IndexRow[]>;
  for (const r of rows) if (matches({ indexes: r.ix, sector: r.sec }, idx, sector)) out[bucketOf(r)].push(r);
  for (const b of BUCKETS) {
    out[b.key].sort((x, y) => {
      const a = strengthKey(x, b.key), c = strengthKey(y, b.key);
      for (let i = 0; i < a.length; i++) if (a[i] !== c[i]) return a[i] - c[i];
      return x.s.localeCompare(y.s);
    });
  }
  return out;
}

/** The small tag of a map row: today's signal, else the rule that blocks a BUY. */
export function mapTag(r: IndexRow): { text: string; tone: 'profit' | 'warn' | 'neutral' } | null {
  if (r.sig) return { text: r.sig, tone: r.sig === 'BUY' ? 'profit' : 'warn' };
  const k = r.mb ? r.mr : r.br;
  if (!k || k === 'dir') return null;
  if (k === 'BUY' || k === 'WATCH') return { text: k, tone: k === 'BUY' ? 'profit' : 'warn' };
  if (k === 'ok') return { text: 'rules pass', tone: 'neutral' };
  return { text: BLOCK_LABEL[k] ?? k, tone: 'neutral' };
}

/** Sectors of the index rows, most rows first. */
export const rowSectors = (rows: IndexRow[]) => [...rows.reduce((m, r) => m.set(r.sec || 'Other', (m.get(r.sec || 'Other') ?? 0) + 1), new Map<string, number>())]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([s]) => s);
