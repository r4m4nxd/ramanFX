/**
 * Insider activity (public/insiders/latest.json on the data branch, written every 10 min on US weekdays 6:00-22:00 New York by
 * tools/insiders/insiders.py from SEC EDGAR): Form 4 buys (2+ insiders within 14 days = cluster; an 'early' buy = the first big
 * one, a CEO / CFO / President / COO / Chair $100k+ or anyone $500k+, before others join), scored with the stock scanner's
 * zone context (⭐ = 3+ insiders AND price at a weekly / monthly demand); big non-10b5-1 sales (CEO / CFO / President /
 * COO / Chair / 10% owner, $1M+ or 0.1% of the market cap); Form 144 planned sales; Schedule 13D activists.
 */
export const INSIDERS_URL = '/insiders/latest.json';

export interface InsiderZone { tf: string; where: 'inside' | 'near'; lo: number; hi: number; dist: number }
export interface Insider { name: string; role: string; value: number; price: number | null; date: string; pct: number | null; isNew: boolean; repeat: boolean; url: string }
export interface Cluster {
  sym: string; name: string; kind: 'cluster' | 'solo' | 'early'; n: number; strong: boolean; star: boolean; score: number; value: number;
  px: number | null; first: string; last: string; filed: string; url: string; universe: boolean; zone: InsiderZone | null;
  lead: { role: string; pct: number | null; isNew: boolean }; trend: string; signal: string; pe: number | null; erNext: string; insiders: Insider[];
}
/** A Form 4 open-market sale (`big` = meets the alert rules; `plan` = under a Rule 10b5-1 plan; `cover` = tax withholding). */
export interface Sale { sym: string; name: string; who: string; role: string; value: number; shares: number | null; price: number | null; date: string; filed: string; pct: number | null; ofMcap: number | null; plan: boolean; cover: boolean; big: boolean; url: string }
/** A Form 144 notice of a proposed sale (filed before the sale). */
export interface Planned { sym: string; name: string; who: string; role: string; shares: number | null; value: number | null; price: number | null; date: string; filed: string; ofMcap: number | null; plan: boolean; planDate: string; big: boolean; url: string }
/** A Schedule 13D / 13D/A filing. */
export interface Activist { sym: string; name: string; who: string; form: string; pct: number | null; prevPct: number | null; shares: number | null; event: string; purpose: string; filed: string; universe: boolean; url: string }
export interface InsidersFile { generated: string; days: number; clusters: Cluster[]; sells: Sale[]; plans: Planned[]; activists: Activist[]; coverage: { days: number; done: number } }

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
      sym: str(c.sym), name: str(c.name), kind: c.kind === 'solo' ? 'solo' : c.kind === 'early' ? 'early' : 'cluster', n: num(c.n) ?? 0, strong: c.strong === true, star: c.star === true,
      score: num(c.score) ?? 0, value: num(c.value) ?? 0, px: num(c.px) ?? num(c.price), first: str(c.first), last: str(c.last), filed: str(c.filed), url: secUrl(c.url),
      universe: c.universe === true, zone: zone(c.zone), lead: { role: str(l.role), pct: num(l.pct), isNew: l.new === true },
      trend: str(c.trend), signal: str(c.signal), pe: num(c.pe), erNext: str(c.er_next),
      insiders: (Array.isArray(c.insiders) ? c.insiders : []).map(i => {
        const y = o(i);
        return { name: str(y.name), role: str(y.role), value: num(y.value) ?? 0, price: num(y.price), date: str(y.date), pct: num(y.pct), isNew: y.new === true, repeat: y.repeat === true, url: secUrl(y.url) };
      }),
    });
  }
  const rows = (v: unknown) => (Array.isArray(v) ? v.map(o).filter(x => Object.keys(x).length) : []);
  const sells: Sale[] = rows(f.sells).filter(x => str(x.who) && num(x.value) != null).map(x => ({
    sym: str(x.sym), name: str(x.name), who: str(x.who), role: str(x.role), value: num(x.value)!, shares: num(x.shares), price: num(x.price), date: str(x.date), filed: str(x.filed),
    pct: num(x.pct), ofMcap: num(x.of_mcap), plan: x.plan === true, cover: x.cover === true, big: x.big === true, url: secUrl(x.url) }));
  const plans: Planned[] = rows(f.plans).filter(x => str(x.who)).map(x => ({
    sym: str(x.sym), name: str(x.name), who: str(x.who), role: str(x.role), shares: num(x.shares), value: num(x.value), price: num(x.price), date: str(x.date), filed: str(x.filed),
    ofMcap: num(x.of_mcap), plan: x.plan === true, planDate: str(Array.isArray(x.plan_dates) ? x.plan_dates[0] : ''), big: x.big === true, url: secUrl(x.url) }));
  const activists: Activist[] = rows(f.activists).filter(x => str(x.who)).map(x => ({
    sym: str(x.sym), name: str(x.name), who: str(x.who), form: str(x.form), pct: num(x.pct), prevPct: num(x.prev_pct), shares: num(x.shares), event: str(x.event), purpose: str(x.purpose),
    filed: str(x.filed), universe: x.universe === true, url: secUrl(x.url) }));
  const cov = o(f.coverage);
  return { generated: str(f.generated), days: num(f.days) ?? 30, clusters, sells, plans, activists, coverage: { days: num(cov.days) ?? 0, done: num(cov.done) ?? 0 } };
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

/** '35m ago', '3h ago', '2d ago' from an ISO instant; '' when unknown or in the future. */
export function ago(iso: string, now: number): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return '';
  const m = Math.floor((now - t) / 60000);
  if (m < -5) return '';
  return m < 1 ? 'just now' : m < 60 ? `${m}m ago` : m < 48 * 60 ? `${Math.floor(m / 60)}h ago` : `${Math.floor(m / 1440)}d ago`;
}
export type SaleFilter = 'big' | 'all';
export const filterSales = (rows: Sale[], f: SaleFilter): Sale[] => (f === 'big' ? rows.filter(r => r.big) : rows);
export type PlanFilter = 'big' | 'all';
export const filterPlans = (rows: Planned[], f: PlanFilter): Planned[] => (f === 'big' ? rows.filter(r => r.big) : rows);
export const filterActivists = (rows: Activist[], scannerOnly: boolean): Activist[] => (scannerOnly ? rows.filter(r => r.universe) : rows);
