// "Train my eye": what the owner marks on a chart and what the engine draws on the same bars, in one shape so the two
// can be scored against each other (score.ts). Bar index i = position in `bars` (0 = oldest), never a shift.

export interface TBar { t: string; o: number; h: number; l: number; c: number }
export type Market = 'fx' | 'stock';
export type TrainTf = 'M15' | 'H1' | 'H4' | 'D1' | 'W1' | 'MN' | '3M';
export const TRAIN_TFS: TrainTf[] = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'];

export type PivotKind = 'peak' | 'valley';
/** A swing peak (price = the candle's high) or valley (its low). */
export interface MPivot { i: number; kind: PivotKind; p: number; note?: string }
export interface Anchor { i: number; p: number }
/** Trend line from anchor a (older) to b (newer); brk = the bar whose CLOSE went beyond it (the line stops there). */
export type LineKind = 'trend' | 'momentum';
/** kind: a TREND line (both anchors real pivots) or a MOMENTUM line (from a leg's extreme along its impulse; its break
 *  ends the impulse, not the trend). Older marks without kind: note 'momentum line' = momentum, else trend. */
export interface MLine { id: string; a: Anchor; b: Anchor; dir: 1 | -1; brk: number | null; note?: string; kind?: LineKind }
export const lineKind = (l: Pick<MLine, 'kind' | 'note'>): LineKind => (l.kind === 'momentum' || (!l.kind && /momentum/i.test(l.note ?? '')) ? 'momentum' : 'trend');
/** Zone from its base candles s..e (s = start, the box extends right from there); proximal / distal prices. */
export interface MZone { id: string; side: 'demand' | 'supply'; s: number; e: number; prox: number; dist: number; note?: string; /** engine: removed at this bar */ end?: number | null }
export interface Marks { v: 1; pivots: MPivot[]; lines: MLine[]; zones: MZone[] }
export const emptyMarks = (): Marks => ({ v: 1, pivots: [], lines: [], zones: [] });

/** One marked chart as stored (rfx_training_marks row / localStorage / export / test fixture). */
export interface TrainChart {
  id: string; symbol: string; tf: TrainTf; market: Market; cls: string;
  as_of: string; bars_hash: string; bars: [string, number, number, number, number][];
  marks: Marks; note: string; created_at: string; updated_at: string;
}
export interface TrainExport { version: 1; exported_at: string; charts: TrainChart[] }

export const toTBars = (rows: [string, number, number, number, number][]): TBar[] => rows.map(([t, o, h, l, c]) => ({ t, o, h, l, c }));
export const fromTBars = (bars: TBar[]): [string, number, number, number, number][] => bars.map(b => [b.t, b.o, b.h, b.l, b.c]);

/** FNV-1a over the bars' text: the same bars always hash the same (the chart a mark was made on). */
export function barsHash(bars: TBar[]): string {
  let h = 0x811c9dc5;
  const s = bars.map(b => `${b.t},${b.o},${b.h},${b.l},${b.c}`).join(';');
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return `${bars.length}-${h.toString(16).padStart(8, '0')}`;
}

/** Parse anything that looks like marks (stored jsonb, imported JSON) without throwing. */
export function parseMarks(js: unknown): Marks {
  const o = (js && typeof js === 'object' ? js : {}) as Partial<Marks>;
  const n = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
  const pivots = (Array.isArray(o.pivots) ? o.pivots : []).filter(p => p && n(p.i) && n(p.p) && (p.kind === 'peak' || p.kind === 'valley'));
  const lines = (Array.isArray(o.lines) ? o.lines : []).filter(l => l && l.a && l.b && n(l.a.i) && n(l.a.p) && n(l.b.i) && n(l.b.p))
    .map(l => ({ ...l, id: String(l.id ?? `${l.a.i}-${l.b.i}`), dir: (l.b.p >= l.a.p ? 1 : -1) as 1 | -1, brk: n(l.brk) ? l.brk : null, kind: lineKind(l) }));
  const zones = (Array.isArray(o.zones) ? o.zones : []).filter(z => z && n(z.s) && n(z.e) && n(z.prox) && n(z.dist) && (z.side === 'demand' || z.side === 'supply'))
    .map(z => ({ ...z, id: String(z.id ?? `${z.side}-${z.s}`) }));
  return { v: 1, pivots, lines, zones };
}
