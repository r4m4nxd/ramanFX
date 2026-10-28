// Forex scan files written by tools/fx_scanner (contract: tools/fx_scanner/SCHEMA.md, v1).
// Scanned after every H1 close (timeframes H1 / H4 / D1 / W1 / MN, 3M context).
// /fx/latest.json = the list views; /fx/d/<class>.json = per-instrument detail (bars, zones, checks).
// Parsed defensively: a missing or odd field falls back instead of throwing.

export const FX_URL = '/fx/latest.json';
export const fxDetailUrl = (k: string) => `/fx/d/${encodeURIComponent(k)}.json`;
export const FX_SECTIONS = ['FX MAJORS', 'FX MINORS', 'FX CROSSES', 'FX EXOTICS', 'METALS', 'ENERGY', 'CRYPTO', 'INDICES', 'CRYPTO 2', 'COMMODITIES', 'FX INDEX'] as const;
export const FX_DATA_NOTE = 'Levels from OANDA feed — check on your Pepperstone chart';
export const OFF_LIST = 'NOT ON WATCHLIST';

export type FxKind = 'BUY' | 'SELL' | 'WATCH';
/** Zone / entry timeframes, lowest first (3M = context only). */
export const FX_TFS = ['H1', 'H4', 'D1', 'W1', 'MN'] as const;
export type FxSide = 'demand' | 'supply';
export type FxSec = 'in' | 'left' | 'near';
export type FxWatchKind = 'new' | 'tested' | 'confirm' | 'area' | 'context';
const WATCH_KINDS: readonly string[] = ['new', 'tested', 'confirm', 'area', 'context'];
export interface FxRule { status: string; text: string; ref: string; short: string }

/** Instrument fields shared by Signal / Item / Row / Detail. */
export interface FxInst { sym: string; oanda: string; cls: string; group: string; wl: boolean; tv: string; digits: number; pip: number; exotic: boolean }

export interface FxSignal extends FxInst {
  kind: FxKind; watch_kind: FxWatchKind | null; tf: string; side: FxSide; zone_type: string; pattern: string;
  proximal: number | null; distal: number | null; touches: number; made: string;
  entry: number | null; stop: number | null; target: number | null; target_kind: string | null; rr: number | null;
  stop_pips: number | null; target_pips: number | null; height_pips: number | null; price: number | null; to_entry_pips: number | null;
  score: number; direction: string; loc_ok: boolean | null; loc_text: string; chain_text: string; spread_pips: number | null;
  ctx3: string; note: string; gold_note: string; rules: FxRule[];
}
export interface FxItem extends FxInst {
  px: number | null; tf: string; side: FxSide; sec: FxSec; b: string; type: string; touches: number; score: number;
  prox: number | null; dist: number | null; pips: number | null; loc_ok: boolean | null; loc_text: string; chain_text: string; status: string; label: string;
}
export interface FxRow extends FxInst { px: number | null; b: string; z: FxItem | null; dir: Record<string, string>; states: Record<string, string>; sp: number | null; sig: FxKind | null; k: string }
export interface FxUnmapped { symbol: string; section: string; note: string }
export interface FxInvalidated { sym: string; kind: string; tf: string; side: string; entry: number | null; reason: string }
export interface FxFile {
  version: number; generated: string; h4: string; h4_close_utc: string; h1: string; h1_close_utc: string; fixture: boolean; partial: boolean; broker: string; feed: string; clock: string;
  counts: { instruments: number; BUY: number; SELL: number; WATCH: number; errors: number };
  classes: { id: string; label: string; n: number }[]; groups: { name: string; symbols: string[] }[];
  signals: FxSignal[]; watch: FxSignal[]; invalidated: FxInvalidated[]; map: FxRow[]; unmapped: FxUnmapped[];
  block_labels: Record<string, string>; disclaimer: string;
}
export type MiniBar = [string, number, number, number, number];
export interface FxZone { tf: string; side: FxSide; zone_type: string; proximal: number; distal: number; touches: number; pips: number | null; loc: string; loc_text: string }
export interface FxDetail extends FxInst {
  price: number | null; date: string; h4: string; spread_pips: number | null; states: Record<string, string>; dirs: Record<string, string>;
  ctx3: string; zones: FxZone[]; checks: (FxZone & { label: string; entry: number | null; stop: number | null; target: number | null; rr: number | null })[];
  signals: string[]; bars: Record<string, MiniBar[]>;
}

type J = Record<string, unknown>;
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const str = (...v: unknown[]): string => { for (const x of v) if (typeof x === 'string' && x) return x; return ''; };
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const int = (v: unknown, d = 0) => num(v) ?? d;
const bool = (v: unknown): boolean | null => (typeof v === 'boolean' ? v : null);
const strMap = (v: unknown): Record<string, string> => Object.fromEntries(Object.entries(obj(v)).filter(([, x]) => typeof x === 'string')) as Record<string, string>;
const side = (v: unknown): FxSide => (v === 'supply' ? 'supply' : 'demand');
const kind = (v: unknown): FxKind | null => (v === 'BUY' || v === 'SELL' || v === 'WATCH' ? v : null);
const sec = (v: unknown): FxSec => (v === 'in' || v === 'left' ? v : 'near');

/** 'PEPPERSTONE:EURUSD' / 'EUR_USD' → 'EURUSD'. */
export const pepperSymbol = (s: string) => s.replace(/^PEPPERSTONE:/i, '').replace(/[_/]/g, '').toUpperCase();
export const tvLink = (symOrTv: string) => `https://www.tradingview.com/chart/?symbol=PEPPERSTONE:${encodeURIComponent(pepperSymbol(symOrTv))}`;

function inst(o: J): FxInst {
  const sym = pepperSymbol(str(o.sym, o.oanda));
  const cls = str(o.cls) || 'cfd';
  return { sym, oanda: str(o.oanda), cls, group: str(o.group).replace(/^#+/, '').trim().toUpperCase(), wl: o.wl === true, tv: str(o.tv) || `PEPPERSTONE:${sym}`,
    digits: int(o.digits, 5), pip: num(o.pip) ?? 0.0001, exotic: o.exotic === true || cls === 'exotic' };
}

export function parseSignal(v: unknown): FxSignal {
  const o = obj(v);
  return {
    ...inst(o), kind: kind(o.kind) ?? 'WATCH', watch_kind: typeof o.watch_kind === 'string' && WATCH_KINDS.includes(o.watch_kind) ? (o.watch_kind as FxWatchKind) : null,
    tf: str(o.tf), side: side(o.side), zone_type: str(o.zone_type), pattern: str(o.pattern), proximal: num(o.proximal), distal: num(o.distal),
    touches: int(o.touches), made: str(o.made), entry: num(o.entry), stop: num(o.stop), target: num(o.target), target_kind: str(o.target_kind) || null,
    rr: num(o.rr), stop_pips: num(o.stop_pips), target_pips: num(o.target_pips), height_pips: num(o.height_pips), price: num(o.price),
    to_entry_pips: num(o.to_entry_pips), score: int(o.score), direction: str(o.direction), loc_ok: bool(o.loc_ok), loc_text: str(o.loc_text),
    chain_text: str(o.chain_text), spread_pips: num(o.spread_pips), ctx3: str(o.ctx3), note: str(o.note), gold_note: str(o.gold_note),
    rules: arr(o.rules).map(r => { const x = obj(r); return { status: str(x.status), text: str(x.text), ref: str(x.ref), short: str(x.short) }; }),
  };
}

export function parseItem(v: unknown): FxItem | null {
  const o = obj(v);
  if (!o.tf && !o.side) return null;
  return { ...inst(o), px: num(o.px), tf: str(o.tf), side: side(o.side), sec: sec(o.sec), b: str(o.b), type: str(o.type), touches: int(o.touches), score: int(o.score),
    prox: num(o.prox), dist: num(o.dist), pips: num(o.pips), loc_ok: bool(o.loc_ok), loc_text: str(o.loc_text), chain_text: str(o.chain_text), status: str(o.status), label: str(o.label) };
}

/** Null when the payload isn't an object (network junk). The 'no scan yet' placeholder parses to an empty file. */
export function parseFx(js: unknown): FxFile | null {
  const o = obj(js);
  if (!Object.keys(o).length) return null;
  const c = obj(o.counts);
  return {
    version: int(o.version, 1), generated: str(o.generated), h4: str(o.h4), h4_close_utc: str(o.h4_close_utc), h1: str(o.h1), h1_close_utc: str(o.h1_close_utc), fixture: o.fixture === true, partial: o.partial === true,
    broker: str(o.broker) || 'Pepperstone', feed: str(o.feed), clock: str(o.clock),
    counts: { instruments: int(c.instruments), BUY: int(c.BUY), SELL: int(c.SELL), WATCH: int(c.WATCH), errors: int(c.errors) },
    classes: arr(o.classes).map(x => { const y = obj(x); return { id: str(y.id), label: str(y.label), n: int(y.n) }; }).filter(x => x.id),
    groups: arr(o.groups).map(x => { const y = obj(x); return { name: str(y.name), symbols: arr(y.symbols).filter((s): s is string => typeof s === 'string') }; }).filter(g => g.name),
    signals: arr(o.signals).map(parseSignal).filter(s => s.sym), watch: arr(o.watch).map(parseSignal).filter(s => s.sym),
    invalidated: arr(o.invalidated).map(x => { const y = obj(x); return { sym: str(y.sym), kind: str(y.kind), tf: str(y.tf), side: str(y.side), entry: num(y.entry), reason: str(y.reason) }; }).filter(x => x.sym),
    map: arr(o.map).map(x => { const y = obj(x); return { ...inst(y), px: num(y.px), b: str(y.b) || 'M', z: parseItem(y.z), dir: strMap(y.dir), states: strMap(y.states), sp: num(y.sp), sig: kind(y.sig), k: str(y.k, y.cls) }; }).filter(r => r.sym),
    unmapped: arr(o.unmapped).map(x => { const y = obj(x); return { symbol: pepperSymbol(str(y.symbol)), section: str(y.section).toUpperCase(), note: str(y.note) || 'not on OANDA' }; }).filter(u => u.symbol),
    block_labels: strMap(o.block_labels), disclaimer: str(o.disclaimer),
  };
}

const bar = (v: unknown): MiniBar | null => { const a = arr(v); return a.length >= 5 && typeof a[0] === 'string' && a.slice(1, 5).every(x => num(x) != null) ? (a.slice(0, 5) as MiniBar) : null; };
function zone(v: unknown): FxZone | null {
  const o = obj(v);
  const p = num(o.proximal), d = num(o.distal);
  if (p == null || d == null) return null;
  return { tf: str(o.tf), side: side(o.side), zone_type: str(o.zone_type, o.type), proximal: p, distal: d, touches: int(o.touches), pips: num(o.pips), loc: str(o.loc), loc_text: str(o.loc_text) };
}

/** One instrument from a /fx/d/<class>.json shard; null when missing. */
export function parseDetail(js: unknown, sym: string): FxDetail | null {
  const o = obj(obj(obj(js).instruments)[sym]);
  if (!Object.keys(o).length) return null;
  return {
    ...inst(o), price: num(o.price), date: str(o.date), h4: str(o.h4, o.date), spread_pips: num(o.spread_pips), states: strMap(o.states), dirs: strMap(o.dirs), ctx3: str(o.ctx3),
    zones: arr(o.zones).map(zone).filter((z): z is FxZone => !!z),
    checks: arr(o.checks).map(x => { const z = zone(x); const y = obj(x); return z && { ...z, label: str(y.label, y.block), entry: num(y.entry), stop: num(y.stop), target: num(y.target), rr: num(y.rr) }; }).filter((x): x is NonNullable<typeof x> => !!x),
    signals: arr(o.signals).filter((s): s is string => typeof s === 'string'),
    bars: Object.fromEntries(Object.entries(obj(o.bars)).map(([tf, bs]) => [tf, arr(bs).map(bar).filter((b): b is MiniBar => !!b)])),
  };
}

/** Group label of an instrument: its watchlist section, else 'NOT ON WATCHLIST'. */
export const sectionOf = (x: { group: string; wl: boolean }) => (x.group ? x.group : OFF_LIST);

/** Rows by watchlist section, in the owner's order (`groups` from the file first, then the canonical list, others last). */
export function groupBySection<T extends { group: string; wl: boolean }>(list: T[], fileOrder: string[] = []): { section: string; items: T[] }[] {
  const order = [...fileOrder, ...FX_SECTIONS.filter(s => !fileOrder.includes(s))];
  const rank = (s: string) => { const i = order.indexOf(s); return i < 0 ? (s === OFF_LIST ? 1000 : 999) : i; };
  const m = new Map<string, T[]>();
  for (const x of list) { const s = sectionOf(x); m.set(s, [...(m.get(s) ?? []), x]); }
  return [...m.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0])).map(([section, items]) => ({ section, items }));
}

const BUCKET_TEXT: Record<string, string> = { ID: 'In demand', AD: 'Approaching demand', LD: 'Left demand', IS: 'In supply', AS: 'Approaching supply', LS: 'Left supply', M: 'Middle' };
/** 'In demand' / 'Approaching supply' / 'Left demand' / 'Middle'. */
export const bucketText = (b: string) => BUCKET_TEXT[b] ?? 'Middle';
export const bucketTone = (b: string): 'profit' | 'loss' | 'neutral' => (b.endsWith('D') ? 'profit' : b.endsWith('S') ? 'loss' : 'neutral');

/** Wide spread: exotic, or the typical spread is over 10% of the stop. */
export const wideSpread = (s: Pick<FxSignal, 'exotic' | 'spread_pips' | 'stop_pips'>) => s.exotic || (s.spread_pips != null && s.stop_pips != null && s.stop_pips > 0 && s.spread_pips / s.stop_pips > 0.1);

/** Price at the instrument's precision. */
export const fxPx = (v: number | null | undefined, digits = 5) => (v == null ? '—' : v.toFixed(Math.max(0, Math.min(8, digits))));
