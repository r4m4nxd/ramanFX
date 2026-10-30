// Honest agreement between the owner's marks (the truth) and the engine's on one chart.
// One-to-one greedy matching (closest first), so one engine element can never "match" two of the owner's.
//   pivots: same type, bar within ±1.                              precision = matched / engine, recall = matched / owner
//   lines : same direction, both anchors within ±1 bar AND within 0.1 ATR of price; the break bar is scored separately
//           among matched lines (both unbroken, or both broken within ±1 bar). TREND lines and MOMENTUM lines (kind; older
//           marks: note 'momentum line') are matched and scored separately (lines = trend, momentum = momentum).
//   zones : same side, start (base) bar within ±1, IoU of the price ranges >= 0.6.
// Agreement of an element type = F1 = 2·matched / (owner + engine). Both empty = null (nothing to agree on, never 100%).
import { atrSeries } from './structure';
import { lineKind, type MLine, type Marks, type MPivot, type MZone, type TBar } from './types';

export const TOL = { pivotBars: 1, lineBars: 1, lineAtr: 0.1, breakBars: 1, zoneBars: 1, zoneIou: 0.6 } as const;

export interface TypeScore { owner: number; engine: number; matched: number; precision: number | null; recall: number | null; f1: number | null }
export interface Miss { kind: 'pivot' | 'line' | 'zone' | 'break'; who: 'owner' | 'engine' | 'both'; text: string; i: number }
export interface ChartScore {
  pivots: TypeScore; lines: TypeScore; momentum: TypeScore; breaks: TypeScore; zones: TypeScore;
  /** mean of the element types that have anything to compare (null = nothing marked by either) */
  overall: number | null;
  misses: Miss[];
  pairs: { pivots: [number, number][]; lines: [number, number][]; momentum: [number, number][]; zones: [number, number][] };
}

export function typeScore(owner: number, engine: number, matched: number): TypeScore {
  return { owner, engine, matched, precision: engine ? matched / engine : null, recall: owner ? matched / owner : null, f1: owner + engine ? (2 * matched) / (owner + engine) : null };
}

/** Greedy one-to-one matching: every compatible (owner, engine) pair with a cost, cheapest first. */
function match<A, B>(as: A[], bs: B[], cost: (a: A, b: B) => number | null): [number, number][] {
  const cand: [number, number, number][] = [];
  as.forEach((a, i) => bs.forEach((b, j) => { const c = cost(a, b); if (c != null) cand.push([c, i, j]); }));
  cand.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2]);
  const ua = new Set<number>(), ub = new Set<number>(), out: [number, number][] = [];
  for (const [, i, j] of cand) if (!ua.has(i) && !ub.has(j)) { ua.add(i); ub.add(j); out.push([i, j]); }
  return out;
}

export const iou = (a0: number, a1: number, b0: number, b1: number) => {
  const lo1 = Math.min(a0, a1), hi1 = Math.max(a0, a1), lo2 = Math.min(b0, b1), hi2 = Math.max(b0, b1);
  const inter = Math.max(0, Math.min(hi1, hi2) - Math.max(lo1, lo2)), uni = Math.max(hi1, hi2) - Math.min(lo1, lo2);
  return uni > 0 ? inter / uni : (lo1 === lo2 ? 1 : 0);
};

const fmtP = (p: number) => (Math.abs(p) >= 100 ? p.toFixed(2) : p.toPrecision(5));

export function scoreChart(bars: TBar[], owner: Marks, engine: Marks): ChartScore {
  const atr = atrSeries(bars), atrAt = (i: number) => atr[Math.max(0, Math.min(atr.length - 1, i))] || 1e-9;
  const t = (i: number) => (bars[i] ? bars[i].t.replace(/T00:00(:00)?$/, '').replace('T', ' ') : `#${i}`);
  const misses: Miss[] = [];

  // pivots
  const pp = match(owner.pivots, engine.pivots, (a: MPivot, b: MPivot) => (a.kind === b.kind && Math.abs(a.i - b.i) <= TOL.pivotBars ? Math.abs(a.i - b.i) : null));
  const pO = new Set(pp.map(x => x[0])), pE = new Set(pp.map(x => x[1]));
  owner.pivots.forEach((p, k) => { if (!pO.has(k)) misses.push({ kind: 'pivot', who: 'owner', i: p.i, text: `You marked a ${p.kind} at ${t(p.i)} the engine does not see` }); });
  engine.pivots.forEach((p, k) => { if (!pE.has(k)) misses.push({ kind: 'pivot', who: 'engine', i: p.i, text: `Engine ${p.kind} at ${t(p.i)} you did not mark` }); });

  // lines
  const lineCost = (a: MLine, b: MLine) => {
    if (a.dir !== b.dir) return null;
    const da = Math.abs(a.a.i - b.a.i), db = Math.abs(a.b.i - b.b.i);
    if (da > TOL.lineBars || db > TOL.lineBars) return null;
    const pa = Math.abs(a.a.p - b.a.p) / atrAt(a.a.i), pb = Math.abs(a.b.p - b.b.p) / atrAt(a.b.i);
    if (pa > TOL.lineAtr || pb > TOL.lineAtr) return null;
    return da + db + pa + pb;
  };
  const dirW = (d: number) => (d > 0 ? 'up' : 'down');
  let brkOk = 0, brkN = 0;
  const lineSet = (kind: 'trend' | 'momentum') => {
    const O = owner.lines.map((l, k) => [l, k] as const).filter(([l]) => lineKind(l) === kind), E = engine.lines.map((l, k) => [l, k] as const).filter(([l]) => lineKind(l) === kind);
    const lp = match(O.map(x => x[0]), E.map(x => x[0]), lineCost);
    const lO = new Set(lp.map(x => x[0])), lE = new Set(lp.map(x => x[1]));
    const w = kind === 'momentum' ? 'momentum line' : 'line';
    O.forEach(([l], k) => { if (!lO.has(k)) misses.push({ kind: 'line', who: 'owner', i: l.a.i, text: `Your ${dirW(l.dir)} ${w} ${t(l.a.i)} → ${t(l.b.i)} (${fmtP(l.a.p)} → ${fmtP(l.b.p)}): no engine ${w} on the same anchors` }); });
    E.forEach(([l], k) => { if (!lE.has(k)) misses.push({ kind: 'line', who: 'engine', i: l.a.i, text: `Engine ${dirW(l.dir)} ${w} ${t(l.a.i)} → ${t(l.b.i)} you did not draw` }); });
    for (const [i, j] of lp) {
      const a = O[i][0].brk, b = E[j][0].brk;
      const ok = (a == null && b == null) || (a != null && b != null && Math.abs(a - b) <= TOL.breakBars);
      brkN++;
      if (ok) brkOk++;
      else misses.push({ kind: 'break', who: 'both', i: a ?? b ?? O[i][0].b.i, text: `Same ${dirW(O[i][0].dir)} ${w}, break differs: you ${a == null ? 'none' : t(a)}, engine ${b == null ? 'none' : t(b)}` });
    }
    return { score: typeScore(O.length, E.length, lp.length), pairs: lp.map(([i, j]) => [O[i][1], E[j][1]] as [number, number]) };
  };
  const tl = lineSet('trend'), ml = lineSet('momentum');

  // zones
  const zoneCost = (a: MZone, b: MZone) => {
    if (a.side !== b.side || Math.abs(a.s - b.s) > TOL.zoneBars) return null;
    const u = iou(a.prox, a.dist, b.prox, b.dist);
    return u >= TOL.zoneIou ? Math.abs(a.s - b.s) + (1 - u) : null;
  };
  const zp = match(owner.zones, engine.zones, zoneCost);
  const zO = new Set(zp.map(x => x[0])), zE = new Set(zp.map(x => x[1]));
  owner.zones.forEach((z, k) => {
    if (zO.has(k)) return;
    const near = engine.zones.find(e => e.side === z.side && Math.abs(e.s - z.s) <= TOL.zoneBars);
    misses.push({ kind: 'zone', who: 'owner', i: z.s, text: near ? `Your ${z.side} at ${t(z.s)}: engine has it but edges differ (IoU ${iou(z.prox, z.dist, near.prox, near.dist).toFixed(2)})` : `Your ${z.side} at ${t(z.s)} (${fmtP(z.prox)}–${fmtP(z.dist)}): engine has no zone there` });
  });
  engine.zones.forEach((z, k) => { if (!zE.has(k)) misses.push({ kind: 'zone', who: 'engine', i: z.s, text: `Engine ${z.side} at ${t(z.s)} (${fmtP(z.prox)}–${fmtP(z.dist)}) you did not mark` }); });

  const pivots = typeScore(owner.pivots.length, engine.pivots.length, pp.length);
  const lines = tl.score, momentum = ml.score;
  const breaks = typeScore(brkN, brkN, brkOk);
  const zones = typeScore(owner.zones.length, engine.zones.length, zp.length);
  // Only types the owner actually marked count toward the chart's overall (an unmarked type is not a disagreement).
  const parts = [owner.pivots.length ? pivots.f1 : null, lines.owner ? lines.f1 : null, momentum.owner ? momentum.f1 : null, owner.zones.length ? zones.f1 : null].filter((v): v is number => v != null);
  return { pivots, lines, momentum, breaks, zones, overall: parts.length ? parts.reduce((a, b) => a + b, 0) / parts.length : null, misses: misses.sort((a, b) => a.i - b.i), pairs: { pivots: pp, lines: tl.pairs, momentum: ml.pairs, zones: zp } };
}

export interface Summary { charts: number; pivots: TypeScore; lines: TypeScore; momentum: TypeScore; breaks: TypeScore; zones: TypeScore; overall: number | null }
/** Micro-averaged over charts (a chart with many pivots weighs more), counting only element types the owner marked on it. */
export function summarize(rows: { owner: Marks; score: ChartScore }[]): Summary {
  const add = (k: 'pivots' | 'lines' | 'momentum' | 'zones' | 'breaks', has: (o: Marks) => boolean) => {
    let o = 0, e = 0, m = 0;
    for (const r of rows) if (has(r.owner)) { o += r.score[k].owner; e += r.score[k].engine; m += r.score[k].matched; }
    return typeScore(o, e, m);
  };
  const pivots = add('pivots', o => o.pivots.length > 0), lines = add('lines', o => o.lines.some(l => lineKind(l) === 'trend')), momentum = add('momentum', o => o.lines.some(l => lineKind(l) === 'momentum')), zones = add('zones', o => o.zones.length > 0), breaks = add('breaks', o => o.lines.length > 0);
  const ov = rows.map(r => r.score.overall).filter((v): v is number => v != null);
  return { charts: rows.length, pivots, lines, momentum, breaks, zones, overall: ov.length ? ov.reduce((a, b) => a + b, 0) / ov.length : null };
}
