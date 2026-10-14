// What the v2 excursion export says about each trade's exit and entry, in account money and R.
import type { ExitData } from './types';

export interface ExitTrade { net: number; r: number | null; risk: number | null; side: 'buy' | 'sell'; openPrice: number; sl: string | number; tp: string | number; e: ExitData }

const num = (v: string | number | null | undefined) => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return isFinite(n) && n > 0 ? n : null; };
const naive = (s: string | null | undefined) => { const m = s && /^(\d{4})[.-](\d{2})[.-](\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)) : null; };

export const REASON_LABEL: Record<string, string> = { tp: 'Take profit', sl: 'Stop loss', manual: 'Closed by hand', so: 'Stop-out', ea: 'Expert advisor', other: 'Other' };
export const ORDER_LABEL: Record<string, string> = { limit: 'Pending limit', market: 'Market', stop: 'Buy/sell stop', stop_limit: 'Stop-limit' };

/** Money the original target would have paid had you held (it was hit after you closed), or money closing early saved (the stop was hit after). */
export function exitOutcome(t: ExitTrade): { left: number | null; saved: number | null; tpR: number | null; after: ExitData['afterExit'] | null; afterMin: number | null } {
  const e = t.e;
  const entry = e.entryPrice ?? t.openPrice;
  const stop = num(e.initSl) ?? num(t.sl), target = num(e.initTp) ?? num(t.tp);
  const dist = stop ? Math.abs(entry - stop) : null;
  const tpR = target && dist ? Math.abs(target - entry) / dist : null;
  let left: number | null = null, saved: number | null = null;
  if (e.afterExit === 'tp' && e.exitReason !== 'tp' && tpR != null && t.risk) left = Math.max(0, tpR * t.risk - t.net);
  if (e.afterExit === 'sl' && e.exitReason !== 'sl' && t.risk) saved = Math.max(0, t.net + t.risk);
  return { left, saved, tpR, after: e.afterExit ?? null, afterMin: e.afterExitMin ?? null };
}

/** Points → R for this trade (via its own $ per point and risk). */
export function ptsToR(t: ExitTrade, pts: number | null | undefined): number | null {
  const e = t.e;
  const dpp = e.dollarPerPt ?? (e.profitDol != null && e.profitPts ? Math.abs(e.profitDol / e.profitPts) : null);
  return pts == null || !dpp || !t.risk ? null : (pts * dpp) / t.risk;
}

export function orderWaitMin(e: ExitData): number | null {
  const a = naive(e.placedAt), b = naive(e.openTime);
  return a != null && b != null && b >= a ? (b - a) / 60000 : null;
}

export interface Group { key: string; label: string; n: number; net: number; avgR: number | null; win: number | null; extra?: number | null }
function group(xs: ExitTrade[], key: (t: ExitTrade) => string | null, label: (k: string) => string, extra?: (ts: ExitTrade[]) => number | null): Group[] {
  const m = new Map<string, ExitTrade[]>();
  for (const t of xs) { const k = key(t); if (k) (m.get(k) ?? m.set(k, []).get(k)!).push(t); }
  return [...m.entries()].map(([k, ts]) => {
    const rs = ts.map(t => t.r).filter((r): r is number => r != null);
    const decided = ts.filter(t => Math.abs(t.net) > 0.01);
    return { key: k, label: label(k), n: ts.length, net: ts.reduce((a, t) => a + t.net, 0), avgR: rs.length ? rs.reduce((a, b) => a + b, 0) / rs.length : null, win: decided.length ? decided.filter(t => t.net > 0).length / decided.length : null, extra: extra ? extra(ts) : undefined };
  }).sort((a, b) => b.n - a.n);
}

const avg = (xs: (number | null)[]) => { const v = xs.filter((x): x is number => x != null && isFinite(x)); return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null; };

export function exitSummary(all: ExitTrade[]) {
  const xs = all.filter(t => t.e.exitReason != null);
  const outs = xs.map(t => ({ t, o: exitOutcome(t) }));
  const left = outs.filter(x => x.o.left != null && x.o.left > 0), saved = outs.filter(x => x.o.saved != null && x.o.saved > 0);
  const byReason = group(xs, t => t.e.exitReason ?? null, k => REASON_LABEL[k] ?? k);
  const byOrder = group(xs, t => t.e.entryOrder ?? null, k => ORDER_LABEL[k] ?? k, ts => avg(ts.map(t => t.e.slipPts ?? null)));
  const byCloses = group(xs, t => (t.e.closes == null ? null : t.e.closes > 1 ? 'partial' : 'full'), k => (k === 'partial' ? 'Scaled out (partial closes)' : 'Closed in one go'));
  const bucket = (m: number | null) => (m == null ? null : m < 60 ? 'a' : m < 720 ? 'b' : m < 2880 ? 'c' : 'd');
  const WAIT: Record<string, string> = { a: 'Filled within 1 hour', b: '1–12 hours', c: '12–48 hours', d: 'Over 2 days' };
  const byWait = group(xs.filter(t => t.e.entryOrder && t.e.entryOrder !== 'market'), t => bucket(orderWaitMin(t.e)), k => WAIT[k]).sort((a, b) => a.key.localeCompare(b.key));
  return {
    n: xs.length,
    left: { total: left.reduce((a, x) => a + x.o.left!, 0), n: left.length },
    saved: { total: saved.reduce((a, x) => a + x.o.saved!, 0), n: saved.length },
    heatBeforeBestR: avg(xs.map(t => (t.e.maeBeforeMfe != null ? Math.abs(ptsToR(t, t.e.maeBeforeMfe) ?? NaN) : null))),
    maeR: avg(xs.map(t => (t.e.mae != null ? Math.abs(ptsToR(t, t.e.mae) ?? NaN) : null))),
    byReason, byOrder, byCloses, byWait,
  };
}
