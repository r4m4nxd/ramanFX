// The daily S&P 500 scan written by tools/stock_scanner (GitHub Actions) to public/scanner/latest.json.
// Rule-based (Raja first, Kevin second); fundamentals are context only. Holdings never appear here beyond a symbol.

export type RuleStatus = 'pass' | 'fail' | 'warn' | 'unknown';
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
}

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
  /** Last ~6 months of daily bars per signalled ticker: [date, o, h, l, c]. */
  bars?: Record<string, [string, number, number, number, number][]>;
}

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
    bars: o.bars && typeof o.bars === 'object' ? Object.fromEntries(Object.entries(o.bars).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.filter(b => Array.isArray(b) && b.length === 5 && b.slice(1).every(n => typeof n === 'number' && Number.isFinite(n)))])) : {},
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

export const ruleIcon: Record<RuleStatus, string> = { pass: '✓', fail: '✗', warn: '!', unknown: '?' };

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
