// Forex scan file (public/fx/latest.json, written by tools/fx_scanner). Parsed defensively: the Python side may add or
// rename fields, so every read falls back instead of throwing.

export const FX_URL = '/fx/latest.json';
export const FX_SECTIONS = ['FX MAJORS', 'FX MINORS', 'FX CROSSES', 'FX EXOTICS', 'METALS', 'ENERGY', 'CRYPTO', 'INDICES', 'CRYPTO 2', 'COMMODITIES', 'FX INDEX'] as const;
export const FX_DATA_NOTE = 'Levels from OANDA feed — check on your Pepperstone chart';

export type FxKind = 'BUY' | 'SELL' | 'WATCH';
export type FxZoneSection = 'in' | 'near' | 'left';
export interface FxSignal {
  symbol: string; instrument: string; section: string; kind: FxKind; tf: string; side: 'demand' | 'supply'; zone_type: string;
  entry: number | null; stop: number | null; target: number | null; rr: number | null;
  stop_pips: number | null; target_pips: number | null; to_entry_pips: number | null; spread_pips: number | null;
  chain_text: string; note: string; exotic: boolean; wide_spread: boolean; price: number | null; score: number;
}
export interface FxZoneHit { tf: string; side: 'demand' | 'supply'; section: FxZoneSection; type: string; pips: number | null; label: string; prox: number | null; dist: number | null }
export interface FxInstrument { symbol: string; instrument: string; section: string; price: number | null; bucket: FxZoneHit | null; exotic: boolean; spread_pips: number | null }
export interface FxUnmapped { symbol: string; section: string; note: string }
export interface FxFile {
  generated_at: string; last_h4_close: string; fixture: boolean; note: string;
  signals: FxSignal[]; instruments: FxInstrument[]; unmapped: FxUnmapped[];
}

type J = Record<string, unknown>;
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (...v: unknown[]): string => { for (const x of v) if (typeof x === 'string' && x) return x; return ''; };
const numOr = (...v: unknown[]): number | null => { for (const x of v) if (typeof x === 'number' && Number.isFinite(x)) return x; return null; };

/** 'PEPPERSTONE:EURUSD' / 'EUR_USD' / 'EURUSD' → 'EURUSD'. */
export function pepperSymbol(s: string): string {
  return s.replace(/^PEPPERSTONE:/i, '').replace(/[_/]/g, '').toUpperCase();
}
export const tvLink = (symbol: string) => `https://www.tradingview.com/chart/?symbol=PEPPERSTONE:${encodeURIComponent(pepperSymbol(symbol))}`;

export function normSection(s: string): string {
  const u = s.replace(/^#+/, '').trim().toUpperCase();
  return u || 'OTHER';
}

const side = (v: unknown, kind?: string): 'demand' | 'supply' => (v === 'supply' || kind === 'SELL' ? 'supply' : 'demand');
const kindOf = (v: unknown): FxKind => (v === 'SELL' ? 'SELL' : v === 'WATCH' ? 'WATCH' : 'BUY');
const zsec = (v: unknown): FxZoneSection => (v === 'in' || v === 'left' ? v : 'near');

function parseHit(v: unknown): FxZoneHit | null {
  const h = obj(v);
  if (!h.tf && !h.side && !h.section) return null;
  return { tf: str(h.tf), side: side(h.side), section: zsec(h.section ?? h.sec), type: str(h.type, h.zone_type), pips: numOr(h.pips), label: str(h.label, h.status), prox: numOr(h.prox, h.proximal), dist: numOr(h.dist, h.distal) };
}

function parseSignal(v: unknown, parent: J = {}): FxSignal {
  const s = obj(v);
  const kind = kindOf(s.kind);
  const tags = arr(s.tags).map(String).join(' ').toLowerCase() + ' ' + str(s.tag).toLowerCase();
  const cls = str(s.cls, parent.cls);
  const exotic = s.exotic === true || parent.exotic === true || cls === 'exotic' || tags.includes('exotic');
  return {
    symbol: pepperSymbol(str(s.sym, s.symbol, s.pepperstone, parent.sym, parent.symbol, s.instrument, s.oanda, parent.instrument)),
    instrument: str(s.oanda, s.instrument, parent.oanda, parent.instrument), section: normSection(str(s.group, s.section, parent.group, parent.section)),
    kind, tf: str(s.tf), side: side(s.side, kind), zone_type: str(s.zone_type, s.type),
    entry: numOr(s.entry), stop: numOr(s.stop), target: numOr(s.target), rr: numOr(s.rr),
    stop_pips: numOr(s.stop_pips), target_pips: numOr(s.target_pips), to_entry_pips: numOr(s.to_entry_pips),
    spread_pips: numOr(s.spread_pips, parent.spread_pips), chain_text: str(s.chain_text, s.chain), note: str(s.note),
    exotic, wide_spread: exotic || s.wide_spread === true || tags.includes('wide'), price: numOr(s.price, parent.price), score: numOr(s.score) ?? 0,
  };
}

/** Accepts the scan file in either shape: top-level `signals` and/or per-instrument `signals`. Null when not a scan. */
export function parseFx(js: unknown): FxFile | null {
  const o = obj(js);
  if (!Object.keys(o).length) return null;
  const rawInst = arr(o.map ?? o.instruments ?? o.items ?? o.rows);
  const instruments: FxInstrument[] = [];
  const signals: FxSignal[] = [...arr(o.signals), ...arr(o.watch)].map(s => parseSignal(s));
  for (const v of rawInst) {
    const r = obj(v);
    const sym = pepperSymbol(str(r.sym, r.symbol, r.pepperstone, r.instrument, r.oanda, r.name));
    if (!sym) continue;
    const hits = arr(r.hits ?? r.zones).map(parseHit).filter((h): h is FxZoneHit => !!h);
    const bucket = parseHit(r.z ?? r.bucket) ?? hits[0] ?? null;
    const exotic = r.exotic === true || r.cls === 'exotic';
    instruments.push({ symbol: sym, instrument: str(r.oanda, r.instrument, r.name), section: normSection(str(r.group, r.section)), price: numOr(r.px, r.price, r.last), bucket, exotic, spread_pips: numOr(r.sp, r.spread_pips) });
    if (!arr(o.signals).length) for (const s of arr(r.signals)) if (s && typeof s === 'object') signals.push(parseSignal(s, r));
  }
  const unmapped = arr(o.unmapped ?? obj(o.watchlist).unmapped).map(v => {
    const u = obj(v);
    return { symbol: pepperSymbol(str(u.symbol, u.sym, typeof v === 'string' ? v : '')), section: normSection(str(u.section, u.group)), note: str(u.note) || 'not on OANDA' };
  }).filter(u => u.symbol);
  // Signals without a section borrow it from the instrument list.
  const secOf = new Map(instruments.map(i => [i.symbol, i.section]));
  for (const s of signals) if (s.section === 'OTHER' && secOf.has(s.symbol)) s.section = secOf.get(s.symbol)!;
  return {
    generated_at: str(o.generated, o.generated_at, o.as_of, o.asof), last_h4_close: str(o.h4_close_utc, o.last_h4_close, o.h4_close, o.last_close, o.h4),
    fixture: o.fixture === true, note: str(o.note, o.data_note) || FX_DATA_NOTE, signals, instruments, unmapped,
  };
}

/** Actionable signals first (BUY / SELL), best R:R first, then WATCH. */
export function sortFxSignals(list: FxSignal[]): FxSignal[] {
  const rank = (k: FxKind) => (k === 'WATCH' ? 1 : 0);
  return [...list].sort((a, b) => rank(a.kind) - rank(b.kind) || (b.rr ?? -1) - (a.rr ?? -1) || b.score - a.score || a.symbol.localeCompare(b.symbol));
}

/** Instruments by watchlist section, in the owner's order (unknown sections last). Empty sections dropped. */
export function groupBySection<T extends { section: string }>(list: T[]): { section: string; items: T[] }[] {
  const order = (s: string) => { const i = (FX_SECTIONS as readonly string[]).indexOf(s); return i < 0 ? 99 : i; };
  const m = new Map<string, T[]>();
  for (const x of list) m.set(x.section, [...(m.get(x.section) ?? []), x]);
  return [...m.entries()].sort((a, b) => order(a[0]) - order(b[0]) || a[0].localeCompare(b[0])).map(([section, items]) => ({ section, items }));
}

/** 'In demand' / 'Approaching supply' / 'Left demand'. */
export function bucketText(h: FxZoneHit | null): string {
  if (!h) return 'No zone near';
  const w = h.section === 'in' ? 'In' : h.section === 'left' ? 'Left' : 'Approaching';
  return `${w} ${h.side}`;
}

/** Price with sensible precision for FX (5 / 3 dp), metals and indices. */
export function fxPx(v: number | null): string {
  if (v == null) return '—';
  const a = Math.abs(v);
  const dp = a >= 1000 ? 1 : a >= 50 ? 3 : 5;
  return v.toFixed(dp);
}
