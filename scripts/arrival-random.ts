// Random differential cases for the tool ports of the ARRIVAL rules: seeded regime-switching candles (legs, bases,
// pullbacks, the odd emotional candle) on every TF pairing the tools use, with the canonical TypeScript output
// (supabase/functions/telegram-bot/arrival.ts arrivalTf + zvTrend.ts zvLines incl. the momentum line) as `expected`.
// Same case shape as tools/telegram_bot/parity/arrival_fixtures.json, so tools/telegram_bot/parity/mql_port.py and
// pine_port.py replay them unchanged. src/core/toolsArrival.test.ts runs it; by hand:
//   npx tsx scripts/arrival-random.ts 200 7 > /tmp/random_cases.json
import { arrivalTf } from '../supabase/functions/telegram-bot/arrival.ts';
import { FX_PARAMS, RAJA, Series, type ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';
import { zvLines } from '../supabase/functions/telegram-bot/zvTrend.ts';

type Row = [string, number, number, number, number];
const STEP: Record<string, number> = { M15: 900, H1: 3600, H4: 14400, D1: 86400, W1: 604800, MN: 2592000, '3M': 7776000 };
const PAIRS: [string, string | null, string | null][] = [
  ['H4', 'D1', 'M15'], ['D1', 'W1', 'H1'], ['W1', 'MN', 'H4'], ['H1', 'H4', 'M15'], ['MN', '3M', 'D1'], ['D1', null, null], ['M15', 'H1', null],
];

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
const iso = (t: number, tf: string) => {
  const d = new Date(t * 1000).toISOString();
  return STEP[tf] >= 86400 ? d.slice(0, 10) : d.slice(0, 16);
};
/** n closed candles of TF tf ending at tEnd (unix s), starting near p0: swing phases (impulse legs out of 1-3 candle
 *  bases, pullbacks against them) that reverse with a strong impulse, so trend lines, zones and arrivals form. */
function bars(R: () => number, n: number, tf: string, tEnd: number, p0: number): ZBar[] {
  const out: ZBar[] = [];
  const vol = p0 * 0.004;
  let p = p0, dir = R() < 0.5 ? 1 : -1;
  const plan: number[] = [];                                            // per candle: body in vol units (signed), 0 = base
  while (plan.length < n) {
    const swings = 2 + Math.floor(R() * 4);
    for (let s = 0; s < swings && plan.length < n; s++) {
      for (let k = 1 + Math.floor(R() * 3); k > 0; k--) plan.push(0);                   // base
      for (let k = 2 + Math.floor(R() * 3); k > 0; k--) plan.push(dir * (1 + R() * 2));  // impulse
      for (let k = 1 + Math.floor(R() * 3); k > 0; k--) plan.push(-dir * (0.5 + R() * 1.2));   // pullback
    }
    dir = -dir;
    for (let k = 1 + Math.floor(R() * 2); k > 0; k--) plan.push(0);                     // the reversal base
    for (let k = 2 + Math.floor(R() * 2); k > 0; k--) plan.push(dir * (2.5 + R() * 3)); // the reversal impulse (arrival)
  }
  for (let i = 0; i < n; i++) {
    const o = p;
    let body = plan[i] === 0 ? (R() - 0.5) * vol * 0.5 : plan[i] * vol;
    if (R() < 0.02) body *= 3;                                          // emotional candle
    const c = o + body;
    const wick = vol * (plan[i] === 0 ? 0.3 + R() * 0.8 : 0.1 + R() * 0.5);
    const h = Math.max(o, c) + wick * R(), l = Math.min(o, c) - wick * R();
    const t = tEnd - (n - 1 - i) * STEP[tf];
    out.push({ d: iso(t, tf), o: +o.toFixed(5), h: +h.toFixed(5), l: +l.toFixed(5), c: +c.toFixed(5) });
    p = c;
  }
  return out;
}
/** HTF bars from TF bars: groups of f, time of the first. */
function aggregate(B: ZBar[], f: number): ZBar[] {
  const out: ZBar[] = [];
  for (let i = B.length % f; i + f <= B.length; i += f) {
    const g = B.slice(i, i + f);
    out.push({ d: g[0].d, o: g[0].o, h: Math.max(...g.map(x => x.h)), l: Math.min(...g.map(x => x.l)), c: g[g.length - 1].c });
  }
  return out;
}
/** LTF bars inside TF candles: a path open -> first extreme -> second extreme -> close, f sub-bars per candle, with
 *  1-3 sub-bar pauses (bases) and noise, so the LTF has its own legs / bases. */
function disaggregate(R: () => number, B: ZBar[], tf: string, ltf: string): ZBar[] {
  const f = Math.max(2, Math.round(STEP[tf] / STEP[ltf]));
  const out: ZBar[] = [];
  for (const b of B) {
    const t0 = Date.parse(b.d.length > 10 ? `${b.d}:00Z` : `${b.d}T00:00:00Z`) / 1000;
    const up = b.c >= b.o, e1 = up ? b.l : b.h, e2 = up ? b.h : b.l;
    const pts = [b.o, e1, e2, b.c], path: number[] = [b.o];
    for (let k = 1; k <= f; k++) {
      const x = (k / f) * 3, s = Math.min(2, Math.floor(x)), u = x - s;
      const pause = R() < 0.25;
      const v = pause ? path[path.length - 1] : pts[s] + (pts[s + 1] - pts[s]) * u;
      path.push(v + (R() - 0.5) * (b.h - b.l) * 0.05);
    }
    path[f] = b.c;
    for (let k = 0; k < f; k++) {
      const o = path[k], c = path[k + 1], w = (b.h - b.l) * 0.04 * R();
      const h = Math.min(b.h, Math.max(o, c) + w), l = Math.max(b.l, Math.min(o, c) - w);
      out.push({ d: iso(t0 + k * STEP[ltf], ltf), o: +o.toFixed(5), h: +Math.max(h, o, c).toFixed(5), l: +Math.min(l, o, c).toFixed(5), c: +c.toFixed(5) });
    }
  }
  return out;
}
export function randomCases(count: number, seed: number) {
  const R = rng(seed);
  const cases = [];
  const tEnd = Date.UTC(2026, 9, 28, 0, 0, 0) / 1000;
  for (let k = 0; k < count; k++) {
    const [tf, htf, ltf] = PAIRS[k % PAIRS.length];
    const market = R() < 0.8 ? 'fx' : 'stock';
    const p0 = 1 + R() * 100;
    // HTF = the TF bars aggregated (so HTF zones can host the TF zones), LTF = the last TF candles split into sub-bars
    const nT = 60 + Math.floor(R() * 400), fH = htf ? Math.max(2, Math.round(STEP[htf] / STEP[tf])) : 1;
    const all = bars(R, htf ? Math.max(nT, 40 * fH) : nT, tf, tEnd - STEP[tf], p0);
    const B = all.slice(-nT);
    const last = B[B.length - 1].c;
    const HB = htf ? (k % 3 === 2 ? bars(R, 20 + Math.floor(R() * 300), htf, tEnd - STEP[htf], last * (0.97 + R() * 0.06)) : aggregate(all, fH)) : null;
    const LB = ltf ? disaggregate(R, B.slice(-Math.max(4, Math.ceil(460 / Math.max(2, Math.round(STEP[tf] / STEP[ltf]))))), tf, ltf).slice(-460) : null;
    const price = +(last * (0.995 + R() * 0.01)).toFixed(5);
    const spread = R() < 0.5 ? 0 : +(p0 * 0.0002 * R()).toFixed(6);
    const p = market === 'fx' ? FX_PARAMS : RAJA;
    const a = arrivalTf(B, tf, price, p, HB, LB, htf, ltf, spread);
    const r = zvLines(new Series(B, B[B.length - 1].c, tf));
    const o = (t: typeof r.up) => (t ? { a: t.a, b: t.b, pa: t.pa, pb: t.pb } : null);
    const rows = (b: ZBar[]): Row[] => b.map(x => [x.d, x.o, x.h, x.l, x.c]);
    const b: Record<string, Row[]> = { [tf]: rows(B) };
    if (htf && HB) b[htf] = rows(HB);
    if (ltf && LB) b[ltf] = rows(LB);
    cases.push({
      name: `rnd${k}`, about: `random ${tf}`, market, tf, htf, ltf, price, spread, bars: b,
      momentum: r.mom ? { a: r.mom.a, b: r.mom.b, pa: r.mom.pa, pb: r.mom.pb, dir: r.mom.dir } : null,
      expected: JSON.parse(JSON.stringify({ lines: { up: o(r.up), dn: o(r.dn), upX: o(r.upX), dnX: o(r.dnX), why: r.why }, arrivals: a.arrivals,
        current: a.current ? a.arrivals.indexOf(a.current) : -1, plan: a.plan, confirm: a.confirm, pending: a.pending })),
    });
  }
  return { cases };
}

/** Jittered copies of fixture cases (every price x a random scale, + noise of up to `noise` of the bar's range; the
 *  OHLC order kept), with the TS output recomputed: the hand-built confirmation / nested cases with other numbers. */
export function jitterCases(fixture: { cases: any[] }, copies: number, seed: number, noise = 0.03) {   // eslint-disable-line @typescript-eslint/no-explicit-any
  const R = rng(seed);
  const cases = [];
  for (const c of fixture.cases) for (let k = 0; k < copies; k++) {
    const sc = 0.5 + R() * 2;
    const bars: Record<string, Row[]> = {};
    for (const [tf, rows] of Object.entries(c.bars as Record<string, Row[]>)) bars[tf] = rows.map(([d, o, h, l, cl]) => {
      const n = () => (R() - 0.5) * noise * (h - l);
      const O = (o + n()) * sc, C = (cl + n()) * sc;
      return [d, +O.toFixed(6), +Math.max(O, C, (h + n()) * sc).toFixed(6), +Math.min(O, C, (l + n()) * sc).toFixed(6), +C.toFixed(6)] as Row;
    });
    const zb = (r: Row[]): ZBar[] => r.map(([d, o, h, l, cl]) => ({ d, o, h, l, c: cl }));
    const B = zb(bars[c.tf]), price = +(c.price * sc).toFixed(6), spread = +((c.spread ?? 0) * sc).toFixed(8);
    const a = arrivalTf(B, c.tf, price, c.market === 'fx' ? FX_PARAMS : RAJA, c.htf ? zb(bars[c.htf]) : null, c.ltf ? zb(bars[c.ltf]) : null, c.htf, c.ltf, spread);
    const r = zvLines(new Series(B, B[B.length - 1].c, c.tf));
    const o = (t: typeof r.up) => (t ? { a: t.a, b: t.b, pa: t.pa, pb: t.pb } : null);
    cases.push({ ...c, name: `${c.name}~${k}`, price, spread, bars,
      momentum: r.mom ? { a: r.mom.a, b: r.mom.b, pa: r.mom.pa, pb: r.mom.pb, dir: r.mom.dir } : null,
      expected: JSON.parse(JSON.stringify({ lines: { up: o(r.up), dn: o(r.dn), upX: o(r.upX), dnX: o(r.dnX), why: r.why }, arrivals: a.arrivals,
        current: a.current ? a.arrivals.indexOf(a.current) : -1, plan: a.plan, confirm: a.confirm, pending: a.pending })) });
  }
  return { cases };
}

if (process.argv[1]?.endsWith('arrival-random.ts') && process.argv[2] === 'jitter') {
  const fx = JSON.parse((await import('node:fs')).readFileSync('tools/telegram_bot/parity/arrival_fixtures.json', 'utf8'));
  process.stdout.write(JSON.stringify(jitterCases(fx, Number(process.argv[3] ?? 5), Number(process.argv[4] ?? 1))));
} else if (process.argv[1]?.endsWith('arrival-random.ts')) {
  const n = Number(process.argv[2] ?? 100), seed = Number(process.argv[3] ?? 1);
  process.stdout.write(JSON.stringify(randomCases(n, seed)));
}
