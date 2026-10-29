/**
 * Insider cluster buys (public/insiders/latest.json on the data branch, written every 30 min on US weekdays by
 * tools/insiders/insiders.py from SEC EDGAR Form 4): 2+ insiders buying the same stock within 14 days, or one CEO / CFO
 * buy of $250k+, scored with the stock scanner's zone context. ⭐ = 3+ insiders AND price at a weekly / monthly demand.
 */
export const INSIDERS_URL = '/insiders/latest.json';

export interface InsiderZone { tf: string; where: 'inside' | 'near'; lo: number; hi: number; dist: number }
export interface Insider { name: string; role: string; value: number; price: number | null; date: string; pct: number | null; isNew: boolean; repeat: boolean; url: string }
export interface Cluster {
  sym: string; name: string; kind: 'cluster' | 'solo'; n: number; strong: boolean; star: boolean; score: number; value: number;
  px: number | null; first: string; last: string; url: string; universe: boolean; zone: InsiderZone | null;
  lead: { role: string; pct: number | null; isNew: boolean }; trend: string; signal: string; pe: number | null; erNext: string; insiders: Insider[];
}
export interface InsidersFile { generated: string; days: number; clusters: Cluster[]; coverage: { days: number; done: number } }

type O = Record<string, unknown>;
const o = (v: unknown): O => (v && typeof v === 'object' && !Array.isArray(v) ? (v as O) : {});
const str = (v: unknown) => (typeof v === 'string' ? v : '');
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);
/** Only SEC links (the file is public data: never trusted for markup or arbitrary URLs). */
const secUrl = (u: unknown) => (/^https:\/\/www\.sec\.gov\//.test(str(u)) ? str(u) : '');

function zone(v: unknown): InsiderZone | null {
  const z = o(v);
  const lo = num(z.lo), hi = num(z.hi);
  if (lo == null || hi == null || !str(z.tf)) return null;
  return { tf: str(z.tf), where: z.where === 'inside' ? 'inside' : 'near', lo, hi, dist: num(z.dist) ?? 0 };
}

export function parseInsiders(js: unknown): InsidersFile {
  const f = o(js);
  const clusters: Cluster[] = [];
  for (const x of Array.isArray(f.clusters) ? f.clusters : []) {
    const c = o(x);
    if (!str(c.sym) && !str(c.name)) continue;
    const l = o(c.lead);
    clusters.push({
      sym: str(c.sym), name: str(c.name), kind: c.kind === 'solo' ? 'solo' : 'cluster', n: num(c.n) ?? 0, strong: c.strong === true, star: c.star === true,
      score: num(c.score) ?? 0, value: num(c.value) ?? 0, px: num(c.px) ?? num(c.price), first: str(c.first), last: str(c.last), url: secUrl(c.url),
      universe: c.universe === true, zone: zone(c.zone), lead: { role: str(l.role), pct: num(l.pct), isNew: l.new === true },
      trend: str(c.trend), signal: str(c.signal), pe: num(c.pe), erNext: str(c.er_next),
      insiders: (Array.isArray(c.insiders) ? c.insiders : []).map(i => {
        const y = o(i);
        return { name: str(y.name), role: str(y.role), value: num(y.value) ?? 0, price: num(y.price), date: str(y.date), pct: num(y.pct), isNew: y.new === true, repeat: y.repeat === true, url: secUrl(y.url) };
      }),
    });
  }
  const cov = o(f.coverage);
  return { generated: str(f.generated), days: num(f.days) ?? 30, clusters, coverage: { days: num(cov.days) ?? 0, done: num(cov.done) ?? 0 } };
}

/** '$2.1M', '$450K'. */
export function usd(v: number): string {
  const a = Math.abs(v);
  return `${v < 0 ? '-' : ''}$${a >= 1e9 ? `${(a / 1e9).toFixed(1)}B` : a >= 1e6 ? `${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${(a / 1e3).toFixed(0)}K` : a.toFixed(0)}`;
}
export function zoneLabel(z: InsiderZone | null): string {
  if (!z) return '';
  const r = z.hi < 100 ? `${z.lo.toFixed(2)}–${z.hi.toFixed(2)}` : `${z.lo.toFixed(0)}–${z.hi.toFixed(0)}`;
  return z.where === 'inside' ? `inside ${z.tf} demand ${r}` : `${z.dist.toFixed(1)}% above ${z.tf} demand ${r}`;
}
export const holdingsLabel = (l: { pct: number | null; isNew: boolean }) => (l.isNew ? 'new position' : l.pct != null && l.pct >= 0.5 ? `+${l.pct.toFixed(0)}% holdings` : '');
export type InsiderFilter = 'all' | 'star' | 'scanner';
export function filterClusters(cs: Cluster[], f: InsiderFilter): Cluster[] {
  return f === 'star' ? cs.filter(c => c.star) : f === 'scanner' ? cs.filter(c => c.universe) : cs;
}
