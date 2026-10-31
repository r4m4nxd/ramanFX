/**
 * Holders card of the stock page (and the shape the Telegram bot's /holders reads): public/holders/t/<first letter>.json on the data
 * branch, written daily by tools/holders/holders.py from SEC EDGAR only:
 *   5%+ holders       the latest Schedule 13D / 13G of each filer, % of the class, shares, the change vs their previous filing
 *   insiders          shares after each person's last Form 4 as % of the shares outstanding, with the last move
 *   top 13F funds     the SEC's quarterly Form 13F data set: top 10 by shares, % of shares outstanding, change vs the quarter
 *                     before (new / added / cut / unchanged); index funds (Vanguard, BlackRock ...) tagged
 * A 13F is filed up to 45 days after the quarter end, so it is that old by construction.
 */
export const HOLDERS_INDEX_URL = '/holders/index.json';
export const holdersShard = (sym: string): string => { const c = (sym ?? '').slice(0, 1).toUpperCase(); return c >= 'A' && c <= 'Z' ? c : '_'; };
export const holdersUrl = (sym: string) => `/holders/t/${holdersShard(sym)}.json`;

export interface Holder5 { name: string; form: string; date: string; event: string; pct: number; shares: number | null; index: boolean; url: string; dPct: number | null; dShares: number | null; since: string }
export interface InsiderHolding { name: string; role: string; shares: number; pct: number | null; date: string; code: string; moved: number; price: number | null; tenPct: boolean }
export interface Fund { name: string; shares: number; value: number | null; pct: number | null; change: 'new' | 'add' | 'cut' | 'same'; dShares: number; index: boolean }
export interface HoldersRec {
  name: string; sharesOut: number | null; sharesOutEnd: string; h5: Holder5[]; fell: { name: string; pct: number; date: string }[]; insiders: InsiderHolding[];
  funds: Fund[]; exited: string[]; fundsAll: number | null; fundsAllPct: number | null;
}
export interface HoldersMeta { generated: string; quarter: string; prevQuarter: string; lagDays: number; f4Days: number }

type O = Record<string, unknown>;
const o = (v: unknown): O => (v && typeof v === 'object' && !Array.isArray(v) ? (v as O) : {});
const a = (v: unknown): O[] => (Array.isArray(v) ? v.filter(x => x && typeof x === 'object') as O[] : []);
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const secUrl = (u: unknown) => (/^https:\/\/www\.sec\.gov\//.test(str(u)) ? str(u) : '');

export function parseMeta(js: unknown): HoldersMeta | null {
  const f = o(js);
  if (!str(f.generated)) return null;
  const q = o(f.f13);
  return { generated: str(f.generated), quarter: str(q.q), prevQuarter: str(q.pq), lagDays: num(q.lag_days) ?? 45, f4Days: num(f.f4_days) ?? 180 };
}

/** One stock's record from a shard file; null when the shard has nothing for it (never trusts markup or arbitrary links). */
export function parseHolders(js: unknown, sym: string): HoldersRec | null {
  const r = o(o(o(js).stocks)[sym]);
  if (!Object.keys(r).length) return null;
  const f13 = o(r.f13);
  return {
    name: str(r.n), sharesOut: num(r.so), sharesOutEnd: str(r.so_end),
    h5: a(r.h5).filter(x => num(x.pct) != null && str(x.f)).map(x => {
      const c = o(x.chg);
      return { name: str(x.f), form: str(x.form), date: str(x.d), event: str(x.ev), pct: num(x.pct)!, shares: num(x.sh), index: x.idx === true, url: secUrl(x.url), dPct: num(c.pct), dShares: num(c.sh), since: str(c.prev) };
    }),
    fell: a(r.h5x).filter(x => num(x.pct) != null).map(x => ({ name: str(x.f), pct: num(x.pct)!, date: str(x.d) })),
    insiders: a(r.ins).filter(x => str(x.w) && num(x.own) != null).map(x => ({ name: str(x.w), role: str(x.role), shares: num(x.own)!, pct: num(x.pct), date: str(x.d), code: str(x.code), moved: num(x.mv) ?? 0, price: num(x.px), tenPct: x.ten === true })),
    funds: a(f13.top).filter(x => str(x.f) && num(x.sh) != null).map(x => ({ name: str(x.f), shares: num(x.sh)!, value: num(x.v), pct: num(x.pct), change: x.ch === 'new' || x.ch === 'add' || x.ch === 'cut' ? x.ch : 'same', dShares: num(x.dsh) ?? 0, index: x.idx === true })),
    exited: a(f13.ex).map(x => str(x.f)).filter(Boolean), fundsAll: num(f13.tot), fundsAllPct: num(f13.tot_pct),
  };
}

/** '2.2B', '861M', '24.8M', '480K'. */
export function qty(v: number): string {
  const x = Math.abs(v);
  return `${v < 0 ? '-' : ''}${x >= 1e9 ? `${(x / 1e9).toFixed(1)}B` : x >= 1e6 ? `${(x / 1e6).toFixed(x >= 1e8 ? 0 : 1)}M` : x >= 1e3 ? `${(x / 1e3).toFixed(0)}K` : x.toFixed(0)}`;
}
/** '9.6%', '0.42%', '<0.01%'. */
export const pctText = (p: number) => (Math.abs(p) < 0.01 ? '<0.01%' : Math.abs(p) < 1 ? `${p.toFixed(2)}%` : `${p.toFixed(1)}%`);
/** 'added +7.8%', 'cut -6.8%', 'new', 'unchanged' for a fund's quarter-over-quarter move. */
export function fundChange(f: Fund): string {
  if (f.change === 'new') return 'new';
  if (f.change === 'same') return 'unchanged';
  const before = f.shares - f.dShares;
  return before > 0 ? `${f.change === 'add' ? 'added' : 'cut'} ${f.dShares > 0 ? '+' : '-'}${Math.abs(f.dShares / before * 100).toFixed(1)}%` : f.change;
}
const MOVE: Record<string, string> = { S: 'sold', P: 'bought', A: 'awarded', M: 'exercised', F: 'tax-withheld', G: 'gifted', D: 'disposed', C: 'converted', X: 'exercised' };
/** 'sold 20K @ $120.00' for an insider's last move, '' when there was no transaction (a holdings-only line). */
export const lastMove = (i: InsiderHolding) => (i.moved && MOVE[i.code] ? `${MOVE[i.code]} ${qty(Math.abs(i.moved))}${i.price != null ? ` @ $${i.price.toFixed(2)}` : ''}` : '');
/** The 13F quarter end as 'Jun 30, 2026' and the latest date its holdings could have been filed (quarter end + lag). */
export function quarterNote(m: HoldersMeta | null): string {
  if (!m?.quarter) return '';
  const q = Date.parse(`${m.quarter}T12:00:00Z`);
  if (!Number.isFinite(q)) return '';
  const fmt = (t: number) => new Date(t).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric', year: 'numeric' });
  return `13F as of ${fmt(q)}, filed by ${fmt(q + m.lagDays * 86400000)} at the latest`;
}
