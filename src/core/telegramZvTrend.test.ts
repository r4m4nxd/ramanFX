// The chart's trendlines: the owner's ZoneVision rule (zvTrend.ts, from public/tools/RFX_ZoneCore.mqh ZigZag / Confirmed /
// TooFlat / RemovedAt, cross-checked with RamanFX_ZoneVision.pine) + the owner's two-pivot rule ("we draw a trendline from
// the most recent TWO peaks or TWO valleys only") + Kevin's momentum line. Hand-built bar sequences whose real peaks /
// valleys are known by hand, an independent brute-force check of the owner's definition, the BABA fixture as published
// 2026-10-29 (tools/telegram_bot/parity/baba_2026-10-29.json), and the higher-TF projection being straight.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { aggregate, renderSvg, weekKey, type Bar } from '../../supabase/functions/telegram-bot/chart';
import { chartData, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { Series } from '../../supabase/functions/telegram-bot/zonecore';
import { htfBarIndex, panelTrendlines, zvAt, zvLines, zvPivots, type CBar } from '../../supabase/functions/telegram-bot/zvTrend';

/** Bars along a path through (bar, price) points (linear in between): high = path + 0.5, low = path - 0.5. */
function path(pts: [number, number][], t0 = '2025-01-06'): Bar[] {
  const out: Bar[] = [];
  const t = new Date(`${t0}T00:00:00Z`);
  let prev = pts[0][1];
  for (let k = 0; k + 1 < pts.length; k++) {
    const [i0, p0] = pts[k], [i1, p1] = pts[k + 1];
    for (let i = i0; i < i1 || (k + 2 === pts.length && i === i1); i++) {
      const v = p0 + (p1 - p0) * (i - i0) / (i1 - i0);
      out.push({ t: t.toISOString().slice(0, 10), o: prev, h: v + 0.5, l: v - 0.5, c: v });
      prev = v;
      t.setUTCDate(t.getUTCDate() + 7);
    }
  }
  return out;
}
const ser = (b: Bar[], tf = 'W1') => new Series(b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c })), b[b.length - 1].c, tf);
const shiftOf = (b: Bar[], i: number) => b.length - i;   // bar index (oldest first) -> shift (1 = newest closed)

// ---- an independent reading of the owner's definition (no code shared with zvTrend.ts) ------------------------------
/** "Real peaks are pivot points after which price made a new lower low", significant ("c", Oct 2026): a 2-bar swing high
 *  (>= the 2 older highs, > the 2 newer) after which, before any high above it, a low breaks the previous REAL valley's
 *  low (the most recent swing low while there is no real valley yet). Valleys mirrored. */
function realPivots(b: Bar[], sw = 2): { i: number; t: number }[] {
  const n = b.length, out: { i: number; t: number }[] = [];
  const swH = (i: number) => i - sw >= 0 && i + sw < n && [...Array(sw)].every((_, k) => b[i].h >= b[i - k - 1].h && b[i].h > b[i + k + 1].h);
  const swL = (i: number) => i - sw >= 0 && i + sw < n && [...Array(sw)].every((_, k) => b[i].l <= b[i - k - 1].l && b[i].l < b[i + k + 1].l);
  for (let i = 0; i < n; i++) {
    // the previous REAL valley (found so far, all older than i), else the most recent swing low
    const lastReal = (t: number) => { for (let k = out.length - 1; k >= 0; k--) if (out[k].t === t && out[k].i < i) return out[k].i; return -1; };
    if (swH(i)) {
      let f = lastReal(-1); if (f < 0) for (let j = i - 1; j >= 0; j--) if (swL(j)) { f = j; break; }
      if (f >= 0) for (let j = i + 1; j < n; j++) { if (b[j].h > b[i].h) break; if (b[j].l < b[f].l) { out.push({ i, t: 1 }); break; } }
    }
    if (swL(i)) {
      let f = lastReal(1); if (f < 0) for (let j = i - 1; j >= 0; j--) if (swH(j)) { f = j; break; }
      if (f >= 0) for (let j = i + 1; j < n; j++) { if (b[j].l < b[i].l) break; if (b[j].h > b[f].h) { out.push({ i, t: -1 }); break; } }
    }
  }
  return out;
}

describe('real peaks / valleys (owner: a peak is real once price made a new lower low after it)', () => {
  // up from 90 to a swing low at 85, P1 100, V1 80, P2 95, V2 75, P3 90, V3 70, ends at 72
  const down = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [60, 70], [65, 72]]);
  it('a downtrend with lower lows: the down line runs through the two most recent real peaks (P2, P3), wick to wick', () => {
    const S = ser(down), r = zvLines(S);
    expect(r.dn).not.toBeNull();
    expect([r.dn!.a, r.dn!.b]).toEqual([shiftOf(down, 30), shiftOf(down, 50)]);
    expect([r.dn!.pa, r.dn!.pb]).toEqual([95.5, 90.5]);
    expect(r.dn!.cuts).toBe(0);
    expect(r.up).toBeNull();                                   // valleys fall: no up line
    expect(r.why.up).toBe('no higher low after the bottom');   // valleys only fall
    expect(r.mom).toBeNull();                                  // momentum only without a trend line that way... and none up
    const peaks = r.pivots.filter(p => p.t > 0).map(p => p.bar);
    expect(peaks).toEqual([10, 30, 50].map(i => shiftOf(down, i)));
  });
  it('a lower high NOT followed by a lower low is not a real peak: no pivot 2 yet, no down line', () => {
    const b = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [60, 78], [64, 80]]);   // after P3: only 78 (> V2 75)
    const r = zvLines(ser(b));
    expect(r.pivots.some(p => p.bar === shiftOf(b, 50))).toBe(false);
    expect(r.dn).toBeNull();                                   // the top (P1) is never a pivot; P2 is pivot 1
    expect(r.why.dn).toBe('one lower high so far');
  });
  it('an uptrend (mirror): the up line through the two most recent real valleys, no down line', () => {
    const up = down.map(x => ({ ...x, o: 200 - x.o, h: 200 - x.l, l: 200 - x.h, c: 200 - x.c }));
    const r = zvLines(ser(up));
    expect([r.up!.a, r.up!.b]).toEqual([shiftOf(up, 30), shiftOf(up, 50)]);
    expect([r.up!.pa, r.up!.pb]).toEqual([104.5, 109.5]);
    expect(r.dn).toBeNull();
  });
  it('a line broken by a full closed candle is not drawn (and nothing older replaces it)', () => {
    const b = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [60, 70], [64, 99], [68, 99]]);   // rallies above it
    const r = zvLines(ser(b));
    expect(r.dn).toBeNull();
    expect(r.why.dn).toMatch(/^broken at shift/);
  });
  it('owner: the top is never a pivot - pivot 1 = the first lower high after it; too flat = no line', () => {
    const b = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 94.8], [60, 70], [65, 72]]);
    const r = zvLines(ser(b));
    expect(r.dn).toBeNull();
    expect(r.why.dn).toBe('too flat');                         // 95.5 -> 95.3: not the top (100.5) -> 95.3
  });
  it('a peak above pivot 1 (under the top) becomes the new pivot 1', () => {
    const b = path([[0, 90], [4, 85], [10, 95], [20, 80], [30, 95.2], [40, 75], [50, 94.8], [60, 70], [65, 72]]);
    const r = zvLines(ser(b));
    expect(r.dn).toBeNull();
    expect(r.dnX).toBeNull();
    expect(r.why.dn).toBe('one lower high so far');            // 95.7 is the new top, 95.3 its first lower high
  });
  it('the line is kept (later lower highs are touches) and re-anchored from pivot 1 only after a close beyond it', () => {
    // top 100 (bar 10), pivot 1 = 95 (bar 30), pivot 2 = 90 (bar 50); the next lower high 86 (bar 70) sits under the line
    const b = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [60, 70], [70, 84], [80, 60], [84, 62]]);
    const r = zvLines(ser(b));
    expect([r.dn!.a, r.dn!.b]).toEqual([shiftOf(b, 30), shiftOf(b, 50)]);
    expect(r.dnX).toBeNull();
    // a rally that CLOSES above it, then a lower high (still under pivot 1): the new line from the same pivot 1
    const c = path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [55, 70], [62, 89], [70, 72], [76, 87], [86, 60], [90, 62]]);
    const q = zvLines(ser(c));
    expect(q.dnX).not.toBeNull();                              // 95 -> 90 broken by the closes at ~88: the most recent broken line
    expect(q.dnX!.b).toBe(shiftOf(c, 62));                     // (re-anchored to 89 at bar 62 first, broken again by the 87 rally)
    expect(q.dn).not.toBeNull();
    expect(q.dn!.a).toBe(shiftOf(c, 30));                      // re-anchored from the same pivot 1 ...
    expect(q.dn!.b).toBe(shiftOf(c, 76));                      // ... the tangent over the later lower highs
    for (let j = 1; j < q.dn!.b; j++) expect(ser(c).C[j]).toBeLessThanOrEqual(zvAt(q.dn!, j));
  });
  it('zvPivots matches the brute-force reading of the definition on every fixture', () => {
    for (const b of [down, path([[0, 50], [7, 60], [12, 52], [20, 70], [26, 58], [33, 80], [40, 61], [47, 77], [55, 64], [60, 66]])]) {
      const S = ser(b);
      const got = zvPivots(S, Math.min(200, S.n - 3)).map(p => `${b.length - p.bar}:${p.t}`).sort();
      const want = realPivots(b).filter(p => shiftOf(b, p.i) <= S.n - 3).map(p => `${p.i}:${p.t}`).sort();
      expect(got).toEqual(want);
    }
  });
});

describe('momentum lines (Kevin lesson 5: a one-way leg with tiny pullbacks, no real peak / valley)', () => {
  it('a steady fall without real peaks: no trend line, one red momentum line from the top', () => {
    const b: Bar[] = [];
    const t = new Date('2025-01-06T00:00:00Z');
    for (let i = 0; i < 40; i++) {                            // falls 1 a bar, every 5th bar pauses (no new low, no higher high)
      const v = 140 - i - (i % 5 === 4 ? -0.6 : 0);
      b.push({ t: t.toISOString().slice(0, 10), o: v + 0.3, h: v + 0.5, l: v - 0.5, c: v - 0.3 });
      t.setUTCDate(t.getUTCDate() + 7);
    }
    const S = ser(b), r = zvLines(S);
    expect(r.up).toBeNull();
    expect(r.dn).toBeNull();
    expect(r.pivots.filter(p => p.t > 0)).toEqual([]);
    expect(r.mom).not.toBeNull();
    expect(r.mom!.dir).toBe(-1);
    for (let j = r.mom!.a - 3; j >= 1; j--) expect(S.H[j]).toBeLessThanOrEqual(zvAt(r.mom!, j) + 1e-9);   // no later high above it
    const tls = panelTrendlines({ tf: 'W1', bars: b, forming: false }, 40, b[b.length - 1].c, null);
    expect(tls.map(x => x.kind)).toEqual(['momentum']);
    const svg = renderSvg({ sym: 'TEST', digits: 2, price: b[b.length - 1].c, layout: 'single', title: 'TEST', verdict: '',
      panels: [{ tf: 'W1', header: '', bars: b, zones: [], lines: null, tls }] } as never);
    expect(svg).toContain('class="tl mom down"');
    expect(svg).toContain('W1 momentum');
  });
  it('with a trend line that way, no momentum line', () => {
    const r = zvLines(ser(path([[0, 90], [4, 85], [10, 100], [20, 80], [30, 95], [40, 75], [50, 90], [60, 70], [65, 72]])));
    expect(r.dn).not.toBeNull();
    expect(r.mom).toBeNull();
  });
});

describe('higher-TF lines on a lower-TF panel: straight in the panel\'s bar space', () => {
  /** Business days, a clear downtrend 200 -> 100 with 25-day swings. */
  function downtrend(n = 500, from = 200, to = 100, period = 25): Bar[] {
    const out: Bar[] = [];
    const t = new Date('2024-11-04T00:00:00Z');
    let prev = from;
    for (let i = 0; i < n; i++) {
      while (t.getUTCDay() === 0 || t.getUTCDay() === 6) t.setUTCDate(t.getUTCDate() + 1);
      const base = from + (to - from) * i / (n - 1);
      const c = base * (1 + 0.06 * Math.sin(i * 2 * Math.PI / period));
      out.push({ t: t.toISOString().slice(0, 10), o: prev, h: Math.max(prev, c) * 1.006, l: Math.min(prev, c) * 0.994, c });
      prev = c;
      t.setUTCDate(t.getUTCDate() + 1);
    }
    return out;
  }
  it('the W1 line on D1: anchors on the D1 candle holding each W1 pivot\'s extreme, every drawn point collinear', () => {
    const d = downtrend(500, 200, 100, 40), w = aggregate(d, weekKey);   // W1 swings ~8 weeks apart (a live W1 down line)
    const tls = panelTrendlines({ tf: 'D1', bars: d, forming: false }, 120, d[d.length - 1].c, { tf: 'W1', bars: w, forming: false });
    // (the W1 line runs along the D1 one here, so DedupeTL may keep only the D1 line: check every drawn trend line)
    const gold = tls.filter(t => t.kind === 'trend');
    expect(gold.length).toBeGreaterThan(0);
    const i0 = d.length - 120;
    expect(zvLines(ser(w, 'W1')).dn).not.toBeNull();             // the W1 down line exists (live)
    for (const t of gold) {
      if (t.htf) for (const [k, p] of t.anchors) if (k >= 0) expect(t.dir > 0 ? d[i0 + k].l : d[i0 + k].h).toBeCloseTo(p, 9);   // ChartBarIn
      const pts = [...t.pts, ...t.anchors];
      const [[x0, y0], [x1, y1]] = t.pts;
      for (const [x, y] of pts) expect(y).toBeCloseTo(y0 + (y1 - y0) * (x - x0) / (x1 - x0), 6);
    }
    // every trend line's anchors are real pivots by the brute-force definition: own D1 lines on the D1 bars, the W1 line on W1
    const realD = realPivots(d), realW = realPivots(w), hw = zvLines(ser(w, 'W1'));
    // (the newer anchor always; the older one is a real pivot or the FitAnchor candle after the older real pivot)
    const okOlder = (real: { i: number; t: number }[], i: number, j: number, dir: number) => real.some(q => q.t === -dir && (q.i === i || (q.i < i && i < j)));
    for (const t of tls.filter(x => !x.htf && x.kind === 'trend')) {
      expect(realD.some(q => q.i === i0 + t.anchors[1][0] && q.t === -t.dir)).toBe(true);
      expect(okOlder(realD, i0 + t.anchors[0][0], i0 + t.anchors[1][0], t.dir)).toBe(true);
    }
    for (const t of [hw.up, hw.dn]) if (t) {
      expect(realW.some(q => q.i === w.length - t.b && q.t === -t.dir)).toBe(true);
      expect(okOlder(realW, w.length - t.a, w.length - t.b, t.dir)).toBe(true);
    }
    expect(hw.dn).not.toBeNull();
    // the rendered SVG path of every trend line is straight too
    const svg = renderSvg({ sym: 'TEST', digits: 2, price: d[d.length - 1].c, layout: 'single', title: 'TEST', verdict: '',
      panels: [{ tf: 'D1', header: '', bars: d.slice(-120), zones: [], lines: null, tls }] } as never);
    const paths = [...svg.matchAll(/class="tl (?:htf|ltf)[^"]*"[^>]* d="([^"]+)"/g)].map(m => m[1]);
    expect(paths.length).toBe(gold.length);
    for (const dp of paths) {
      const xy = [...dp.matchAll(/[ML]([-\d.]+) ([-\d.]+)/g)].map(m => [+m[1], +m[2]]);
      const [[x0, y0], [x1, y1]] = [xy[0], xy[xy.length - 1]];
      for (const [x, y] of xy) expect(Math.abs(y - (y0 + (y1 - y0) * (x - x0) / (x1 - x0)))).toBeLessThan(0.15);   // 1-decimal SVG rounding
    }
  });
  it('htfBarIndex: a covered HTF bar = the panel bar with its extreme; an older one is extrapolated at the median bars per HTF bar', () => {
    const B: CBar[] = ['2026-01-05', '2026-01-06', '2026-01-07', '2026-01-08', '2026-01-09', '2026-01-12', '2026-01-13', '2026-01-14', '2026-01-15', '2026-01-16']
      .map((t, i) => ({ t, o: 10, h: i === 2 ? 15 : 11, l: i === 8 ? 5 : 9, c: 10 }));
    const HB: CBar[] = ['2025-12-29', '2026-01-05', '2026-01-12'].map(t => ({ t, o: 10, h: 15, l: 5, c: 10 }));
    expect(htfBarIndex(B, HB, 1, -1)).toBe(2);
    expect(htfBarIndex(B, HB, 2, 1)).toBe(8);
    expect(htfBarIndex(B, HB, 0, -1)).toBe(-3);               // 5 bars per week before index 0, mid-week
  });
});

describe('BABA as published 2026-10-29 (the owner\'s chart)', () => {
  const BABA = JSON.parse(readFileSync('tools/telegram_bot/parity/baba_2026-10-29.json', 'utf8'));
  const ctx = (): Ctx => {
    const files: Record<string, unknown> = {
      'scanner/index.json': { tickers: [BABA.row] },
      [`scanner/t/${BABA.row.k}.json`]: { tickers: { BABA: BABA.ticker } },
      'scanner/latest.json': { signals: [] },
    };
    return { now: new Date('2026-10-29T22:00:00Z'), load: async (p: string) => files[p] ?? null, imageUrl: () => 'x' };
  };
  it('D1: no live up trend line in the downtrend; the down line from the first lower high after the Aug 10 top', async () => {
    const m = (await chartData('BABA', 'Q', ctx()))!.model;
    const P = Object.fromEntries(m.panels.map(p => [p.tf, p]));
    expect((P.D1.tls ?? []).some(t => t.dir > 0 && t.kind !== 'momentum' && !t.broken)).toBe(false);
    expect((P.D1.tls ?? []).some(t => t.htf && t.dir > 0)).toBe(false);
    expect((P.D1.tls ?? []).filter(t => t.dir < 0 && !t.htf && t.kind === 'trend' && !t.broken).length).toBe(1);
    // top Aug 10 (132.57) excluded; pivot 1 = Aug 20 (130.62); pivot 2 = the tangent over the later lower highs: Sep 22 (120.40),
    // passing above the Aug 26 / Sep 4 / Sep 15 highs, kept since (Oct 5 / Oct 14 are touches under it)
    const D = P.D1.bars.slice(0, P.D1.forming ? -1 : undefined), S = ser(D, 'D1'), d1 = zvLines(S);
    expect(d1.why.dn).toBe('ok');
    expect([D[D.length - d1.dn!.a].t.slice(0, 10), d1.dn!.pa, D[D.length - d1.dn!.b].t.slice(0, 10), d1.dn!.pb]).toEqual(['2026-08-20', 130.62, '2026-09-22', 120.4]);
    for (let j = 1; j < d1.dn!.b; j++) expect(S.C[j]).toBeLessThanOrEqual(zvAt(d1.dn!, j));
    expect(d1.up).toBeNull();
  });
});

describe('XAUUSD D1 as published 2026-10-29 (owner: "gold D1 should show a down line across the Sep-Oct lower highs")', () => {
  const X = JSON.parse(readFileSync('tools/telegram_bot/parity/xauusd_d1_2026-10-29.json', 'utf8'));
  const rows: [string, number, number, number, number][] = X.D1.slice(0, -1);   // closed bars (the last one was forming)
  const S = new Series(rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), X.price, 'D1');
  const r = zvLines(S), day = (sh: number) => rows[rows.length - sh][0].slice(0, 10);
  it('owner: the top (Aug 25 4696.81) is not a pivot; live down line Sep 3 (4510.64) -> Sep 18 (4399.48), kept, touched by Oct 16', () => {
    expect(r.why.dn).toBe('ok');
    expect([day(r.dn!.a), r.dn!.pa, day(r.dn!.b), r.dn!.pb]).toEqual(['2026-09-03', 4510.64, '2026-09-18', 4399.48]);
    expect(r.dn!.brokenAt).toBe(-1);
    const o16 = rows.length - rows.findIndex(x => x[0].startsWith('2026-10-16'));
    expect(Math.abs(zvAt(r.dn!, o16) - 4198.96)).toBeLessThan(5);           // the Oct 16 high touches it
    for (let j = 1; j < r.dn!.b; j++) expect(S.C[j]).toBeLessThanOrEqual(zvAt(r.dn!, j));   // no close above it
    expect(r.mom).toBeNull();
  });
  it('the up line from the first higher low after the July bottom, stopped at the close below it', () => {
    expect(r.up).toBeNull();
    expect(day(r.upX!.a) >= '2026-08-03' && day(r.upX!.b) <= '2026-08-19').toBe(true);
    expect(S.C[r.upX!.brokenAt!]).toBeLessThan(zvAt(r.upX!, r.upX!.brokenAt!));
  });
});
