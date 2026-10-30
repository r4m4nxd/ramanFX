/**
 * Big moves on every timeframe (public/movers/latest.json, written hourly by tools/movers/movers.py): the newest
 * 1W / 1D / 4H / 1H closes with EVERY qualifier, grouped Forex & metals / Indices & commodities / Crypto / Stocks.
 * The Telegram message shows the top 8 per group and links here ("+N more → app", /moves#d1).
 */
export const MOVES_URL = '/movers/latest.json';
export const MOVE_TFS = ['W1', 'D1', 'H4', 'H1'] as const;
export type MoveTf = (typeof MOVE_TFS)[number];
export const MOVE_GROUPS = ['fx', 'idx', 'crypto', 'stock'] as const;
export type MoveGroup = (typeof MOVE_GROUPS)[number];
export const TF_LABEL: Record<MoveTf, string> = { W1: '1W', D1: '1D', H4: '4H', H1: '1H' };
export const TF_MARK: Record<MoveTf, string> = { W1: '🟪', D1: '🟦', H4: '🟩', H1: '⬜' };
export const GROUP_LABEL: Record<MoveGroup, string> = { fx: 'Forex & metals', idx: 'Indices & commodities', crypto: 'Crypto', stock: 'Stocks' };

export interface MoveRow { sym: string; group: MoveGroup; market: 'fx' | 'stock'; pct: number; x: number; ctx: string; tags: string[]; why: { title: string; url: string } | null }
export interface MoveSection { tf: MoveTf; close: string; label: string; feed: string; rows: MoveRow[] }
export interface MovesFile { generated: string; sections: MoveSection[] }

const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const isTf = (v: unknown): v is MoveTf => MOVE_TFS.includes(v as MoveTf);
const isGroup = (v: unknown): v is MoveGroup => MOVE_GROUPS.includes(v as MoveGroup);
const safeUrl = (u: string) => (/^https:\/\//i.test(u) ? u : '');

/** The file with bad entries dropped (it is data from a public file: never trusted for markup). */
export function parseMoves(js: unknown): MovesFile {
  const o = (js && typeof js === 'object' ? js : {}) as Record<string, unknown>;
  const sections: MoveSection[] = [];
  for (const s of Array.isArray(o.sections) ? o.sections : []) {
    const x = (s ?? {}) as Record<string, unknown>;
    if (!isTf(x.tf)) continue;
    const rows: MoveRow[] = [];
    for (const r of Array.isArray(x.rows) ? x.rows : []) {
      const y = (r ?? {}) as Record<string, unknown>;
      if (!str(y.sym) || !isGroup(y.group)) continue;
      const w = (y.why ?? null) as Record<string, unknown> | null;
      rows.push({
        sym: str(y.sym), group: y.group, market: y.market === 'stock' ? 'stock' : 'fx', pct: num(y.pct), x: num(y.x), ctx: str(y.ctx),
        tags: Array.isArray(y.tags) ? y.tags.filter((t): t is string => typeof t === 'string') : [],
        why: w && str(w.title) ? { title: str(w.title), url: safeUrl(str(w.url)) } : null,
      });
    }
    sections.push({ tf: x.tf, close: str(x.close), label: str(x.label), feed: str(x.feed), rows });
  }
  return { generated: str(o.generated), sections };
}

/** '+1.2%' / '-0.42%' (two decimals under 1%), like the Telegram line. */
export function fmtPct(p: number): string {
  const a = Math.abs(p);
  return `${p >= 0 ? '+' : '-'}${a < 1 ? a.toFixed(2) : a.toFixed(1)}%`;
}

/** Sections of one timeframe, newest close first. */
/** How far back the page (and latest.json) keeps closes. */
export const KEEP_DAYS = 3;
/** Sections of one timeframe whose candle closed within the last KEEP_DAYS, newest first. */
export const sectionsOf = (f: MovesFile, tf: MoveTf, now = Date.now()) => f.sections
  .filter(s => s.tf === tf && now - Date.parse(s.close) <= KEEP_DAYS * 86_400_000)
  .sort((a, b) => (a.close < b.close ? 1 : -1));

/** Rows of a section by group, in the file's order (best first). */
export function grouped(s: MoveSection): [MoveGroup, MoveRow[]][] {
  return MOVE_GROUPS.map(g => [g, s.rows.filter(r => r.group === g)] as [MoveGroup, MoveRow[]]).filter(([, rs]) => rs.length > 0);
}

/** '#d1' -> 'D1' (the Telegram '+N more' links). */
export const tfFromHash = (h: string): MoveTf | null => {
  const t = h.replace('#', '').toUpperCase();
  return isTf(t) ? t : null;
};
