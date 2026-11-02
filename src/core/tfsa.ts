// TFSA list (owner 2026-11-02: "for the TFSA I buy at the best price: near, inside or just left a higher-timeframe zone"):
// long-only stocks at a W1 / MN / 3M demand zone from the stock scan (scanner/latest.json zone_lists), the biggest timeframe
// first, then the strongest; stocks whose insiders bought in the last 30 days (insiders/latest.json clusters) on top (Baker).
// The Telegram /tfsa (supabase/functions/telegram-bot/logic.ts cmdTfsa) shows the same list.

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
export type TfsaSection = 'in' | 'left' | 'near';
export interface TfsaRow { sym: string; name: string; tf: string; prox: number; dist: number; pct: number; score: number; section: TfsaSection; cad: boolean; px: number | null; insider: { kind: string; n: number; value: number } | null }
const RANK: Record<string, number> = { '3M': 0, MN: 1, W1: 2 };
const n = (v: unknown, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** Rows per section, one per stock (its biggest timeframe), plus the insider-buying ones (any section) on top. */
export function tfsaRows(scan: J, insiders: J | null, caOnly = false): { insiders: TfsaRow[]; in: TfsaRow[]; left: TfsaRow[]; near: TfsaRow[] } {
  const buys = new Map<string, J>((Array.isArray(insiders?.clusters) ? insiders!.clusters : []).map((c: J) => [String(c.sym), c] as [string, J]));
  const dem = (scan?.zone_lists?.demand ?? {}) as J;
  const pick = (sec: TfsaSection): TfsaRow[] => {
    const best = new Map<string, J>();
    for (const r of Array.isArray(dem[sec]) ? dem[sec] : []) {
      if (!(String(r.tf) in RANK) || (caOnly && r.cur !== 'CAD')) continue;
      const o = best.get(r.s);
      if (!o || RANK[r.tf] < RANK[o.tf]) best.set(r.s, r);
    }
    return [...best.values()].sort((a, b) => RANK[a.tf] - RANK[b.tf] || n(b.score) - n(a.score) || n(a.pct) - n(b.pct)).map(r => {
      const c = buys.get(String(r.s));
      return { sym: String(r.s), name: String(r.n ?? ''), tf: String(r.tf), prox: n(r.prox), dist: n(r.dist), pct: n(r.pct), score: n(r.score), section: sec, cad: r.cur === 'CAD',
        px: typeof r.px === 'number' ? r.px : null, insider: c ? { kind: String(c.kind ?? ''), n: n(c.n, 1), value: n(c.value) } : null };
    });
  };
  const seen = new Set<string>();
  const all = { in: pick('in'), left: pick('left'), near: pick('near') };
  const ins = [...all.in, ...all.left, ...all.near].filter(r => r.insider && !seen.has(r.sym) && !!seen.add(r.sym));
  const rest = (rs: TfsaRow[]) => rs.filter(r => !seen.has(r.sym) && !!seen.add(r.sym));
  return { insiders: ins, in: rest(all.in), left: rest(all.left), near: rest(all.near) };
}
