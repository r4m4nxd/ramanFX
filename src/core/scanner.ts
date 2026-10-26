// The daily S&P 500 scan written by tools/stock_scanner (GitHub Actions) to public/scanner/latest.json.
// Rule-based (Raja first, Kevin second); fundamentals are context only. Holdings never appear here beyond a symbol.

export type RuleStatus = 'pass' | 'fail' | 'warn' | 'unknown' | 'info';
export interface ScanRule { status: RuleStatus; text: string; ref: string }
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
  tf: 'D1' | 'W1';
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
}

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

export type IndexCode = 'SPX' | 'NDX' | 'DJI' | 'RUT';
export const INDEXES: { value: IndexCode; label: string }[] = [
  { value: 'SPX', label: 'S&P 500' }, { value: 'NDX', label: 'Nasdaq-100' }, { value: 'DJI', label: 'Dow 30' }, { value: 'RUT', label: 'Russell 2000' },
];
export interface RegimeRow { symbol: string; close: number; sma200: number | null; above200: boolean | null; curve: number | null; direction: string }
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
  filtered_liquidity?: number;
  liquidity_rule?: string;
  rut_snapshot?: string;
  regime?: RegimeRow[];
  rfx_index?: RfxIndex | null;
  /** Last ~6 months of daily bars per signalled ticker: [date, o, h, l, c]. */
  bars?: Record<string, [string, number, number, number, number][]>;
  /** 'intraday-dropped' = the scan ran while the US market was open: today's partial bar was left out. */
  session?: 'closed' | 'intraday-dropped';
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
    filtered_liquidity: Number(o.filtered_liquidity ?? 0), liquidity_rule: typeof o.liquidity_rule === 'string' ? o.liquidity_rule : undefined,
    rut_snapshot: typeof o.rut_snapshot === 'string' ? o.rut_snapshot : '',
    regime: Array.isArray(o.regime) ? o.regime.filter(r => r && typeof r.symbol === 'string') : [],
    rfx_index: o.rfx_index && typeof o.rfx_index === 'object' && typeof o.rfx_index.price === 'number' ? o.rfx_index : null,
    bars: o.bars && typeof o.bars === 'object' ? Object.fromEntries(Object.entries(o.bars).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.filter(b => Array.isArray(b) && b.length === 5 && b.slice(1).every(n => typeof n === 'number' && Number.isFinite(n)))])) : {},
    session: o.session === 'intraday-dropped' ? 'intraday-dropped' : 'closed',
    blocked: parseBlocked(o.blocked),
    closest: parseClosest(o.closest),
  };
}

const isIndex = (v: unknown): v is IndexCode => v === 'SPX' || v === 'NDX' || v === 'DJI' || v === 'RUT';

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

/** One search row: s symbol, n name, sec sector, ix indexes, px last close, dd / ds distance % to the nearest
 *  demand / supply, sig today's signal, il illiquid (skipped by the liquidity filter), k shard number. */
export interface IndexRow { s: string; n: string; sec: string; ix: IndexCode[]; px: number; dd?: number; ds?: number; sig?: SignalKind; il?: boolean; k: number; /** D in demand, S in supply, M middle */ st?: 'D' | 'S' | 'M' }
export interface ScanIndex { date: string; generated_at: string; fixture: boolean; tickers: IndexRow[] }

export interface DetailZone { tf: 'D1' | 'W1'; side: 'demand' | 'supply'; proximal: number; distal: number; type: string; score: number | null; fresh: boolean; touches: number; made: string; pattern: string }
export interface NearZone { tf: string; proximal: number; distal: number; type: string; dist_pct: number }
export interface DetailCheck {
  zone: NearZone; kind: 'BUY' | 'no trade'; score: number | null; entry: number; stop: number; target: number | null; rr: number | null;
  next_supply: number | null; supply_distal?: number | null; stop_pct_of_height: number; rules: ScanRule[];
  pz1?: number | null; pz2?: number | null; pz3?: number | null; rr_pz1?: number | null; rr_pz2?: number | null; rr_pz3?: number | null;
  seiden_score?: number; seiden_parts?: Record<string, number>; fv_dist_atr?: number | null; fv_inside?: boolean; index_state?: GaugeState | null; index_aligned?: boolean;
}
export interface TickerDetail {
  symbol: string; name: string; sector: string; indexes: IndexCode[]; exchange?: string; chart?: string; date: string; price: number;
  illiquid: boolean; signal: SignalKind | null; direction: string; d1: string; w1: string; mn: string; curve: number | null; curve_raja: boolean;
  zones: DetailZone[]; nearest_demand: NearZone | null; nearest_supply: NearZone | null; check: DetailCheck | null;
  fundamentals_rows: [string, string][]; bars: { t0: string; dt: number[]; b: [number, number, number, number][] };
  gauge?: { state: GaugeState; demand: GaugeZone | null; supply: GaugeZone | null };
  fv?: { lo: number; hi: number; method: string } | null;
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
    .map(r => ({ ...r, n: String(r.n ?? r.s), sec: String(r.sec ?? ''), ix: Array.isArray(r.ix) ? r.ix.filter(isIndex) : [] }));
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
