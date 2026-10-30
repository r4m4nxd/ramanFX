import { engineLines, engineMarks, enginePivots, engineZones } from './engine';
import { iou, scoreChart, summarize } from './score';
import { autoSide, firstCloseBreak, labelPivots, regimeOf, snapPivot, zoneEdges, zoneFromDrag } from './structure';
import { barsHash, emptyMarks, parseMarks, toTBars, type Marks, type TBar } from './types';
import sample from './fixtures/sample_eurusd_d1.json';

const real = toTBars(sample.bars as [string, number, number, number, number][]);

/** A zig-zag up-trend with pullbacks: 3 legs up, 2 down, repeated (deterministic). */
function zigzag(n = 90, up = true): TBar[] {
  const out: TBar[] = [];
  let px = 100;
  for (let i = 0; i < n; i++) {
    const phase = i % 10, dir = (phase < 6 ? 1 : -1) * (up ? 1 : -1);
    const o = px, c = px + dir * (0.8 + (i % 3) * 0.15);
    out.push({ t: `2026-01-${String(1 + (i % 28)).padStart(2, '0')}T${String(i % 24).padStart(2, '0')}:00`, o, h: Math.max(o, c) + 0.3, l: Math.min(o, c) - 0.3, c });
    px = c;
  }
  return out;
}

describe('training structure helpers', () => {
  it('labels HH / HL / LH / LL against the previous same-type pivot', () => {
    const l = labelPivots([{ i: 1, kind: 'valley', p: 1 }, { i: 3, kind: 'peak', p: 5 }, { i: 5, kind: 'valley', p: 2 }, { i: 7, kind: 'peak', p: 6 }, { i: 9, kind: 'valley', p: 1.5 }, { i: 11, kind: 'peak', p: 4 }]);
    expect(l.map(x => x.label)).toEqual(['L', 'H', 'HL', 'HH', 'LL', 'LH']);
  });
  it('snaps a tap to the nearer wick', () => {
    const b: TBar[] = [{ t: 'a', o: 10, h: 12, l: 9, c: 11 }];
    expect(snapPivot(b, 0, 11.8)).toEqual({ i: 0, kind: 'peak', p: 12 });
    expect(snapPivot(b, 0, 9.4)).toEqual({ i: 0, kind: 'valley', p: 9 });
  });
  it('zone edges: demand proximal on body / wick top, distal on the low; side by price', () => {
    const b: TBar[] = [{ t: 'a', o: 10, h: 10.6, l: 9.5, c: 10.2 }, { t: 'b', o: 10.2, h: 10.4, l: 9.8, c: 10.0 }, { t: 'c', o: 10, h: 13, l: 10, c: 12.8 }];
    expect(zoneEdges(b, 0, 1, 'demand')).toEqual({ proxBody: 10.2, proxWick: 10.6, distWick: 9.5, distBody: 10 });
    expect(autoSide(b, 9.5, 10.2)).toBe('demand');
    const z = zoneFromDrag(b, 1, 0, 9.6, 10.25);
    expect([z.side, z.s, z.e, z.prox, z.dist]).toEqual(['demand', 0, 1, 10.2, 9.5]);
  });
  it('first close beyond an up line', () => {
    const b: TBar[] = [0, 1, 2, 3, 4].map(i => ({ t: String(i), o: 10 + i, h: 11 + i, l: 9 + i, c: 10 + i }));
    b[4] = { t: '4', o: 13, h: 13.5, l: 11, c: 11.5 };   // line at bar 4 = 13 → close 11.5 below it
    expect(firstCloseBreak(b, { a: { i: 0, p: 9 }, b: { i: 1, p: 10 }, dir: 1 })).toBe(4);
  });
  it('regime and hash', () => {
    expect(regimeOf(zigzag(90, true))).toBe('up');
    expect(regimeOf(zigzag(90, false))).toBe('down');
    expect(barsHash(zigzag(30))).toBe(barsHash(zigzag(30)));
    expect(barsHash(zigzag(30))).not.toBe(barsHash(zigzag(31)));
  });
  it('parseMarks drops junk and fixes direction', () => {
    const m = parseMarks({ pivots: [{ i: 1, kind: 'peak', p: 2 }, { i: 'x' }], lines: [{ id: 'a', a: { i: 1, p: 5 }, b: { i: 4, p: 3 }, dir: 1 }], zones: [{ side: 'nope' }] });
    expect(m.pivots.length).toBe(1);
    expect(m.lines[0].dir).toBe(-1);
    expect(m.zones).toEqual([]);
  });
});

describe('engine lines = zvLines (one source of truth with the bot / ZoneVision)', () => {
  it('each engine line ends where zvLines says (the owner rule: a candle CLOSING beyond it, or the structure change)', () => {
    const ls = engineLines(real, 'D1');
    expect(ls.length).toBeGreaterThan(0);
    for (const l of ls) {
      if (l.brk == null) continue;
      const c = firstCloseBreak(real, l);
      expect(c).not.toBeNull();
      expect(c!).toBeLessThanOrEqual(l.brk);           // never later than the first close beyond it
    }
  });
  it('XAUUSD D1 (the owner\'s acceptance chart): the live down line Sep 3 -> Sep 18 is in the replay, unbroken', async () => {
    const X = (await import('../../../tools/telegram_bot/parity/xauusd_d1_2026-10-29.json')).default as unknown as { D1: [string, number, number, number, number][] };
    const bars = toTBars(X.D1.slice(0, -1));
    const l = engineLines(bars, 'D1').find(x => x.dir < 0 && bars[x.a.i].t.startsWith('2026-09-03') && bars[x.b.i].t.startsWith('2026-09-18'));
    expect(l).toBeDefined();
    expect(l!.brk).toBeNull();
  });
});

describe('training score (honest agreement)', () => {
  const bars = zigzag(90);
  it('the engine agrees 100% with itself (real EURUSD D1 bars)', () => {
    const bars = real;
    const e = engineMarks(bars, 'D1', 'fx');
    expect(e.pivots.length).toBeGreaterThan(3);
    expect(e.lines.length).toBeGreaterThan(0);
    const s = scoreChart(bars, e, e);
    expect(s.pivots.f1).toBe(1);
    expect(s.lines.f1).toBe(1);
    expect(s.breaks.f1).toBe(1);
    expect(s.overall).toBe(1);
    expect(s.misses).toEqual([]);
  });
  it('pivots match within ±1 bar of the same type only, one to one', () => {
    const own: Marks = { ...emptyMarks(), pivots: [{ i: 10, kind: 'peak', p: 1 }, { i: 11, kind: 'peak', p: 1 }, { i: 20, kind: 'valley', p: 1 }] };
    const eng: Marks = { ...emptyMarks(), pivots: [{ i: 11, kind: 'peak', p: 1 }, { i: 22, kind: 'valley', p: 1 }, { i: 30, kind: 'peak', p: 1 }] };
    const s = scoreChart(bars, own, eng);
    expect(s.pivots.matched).toBe(1);
    expect(s.pivots.recall).toBeCloseTo(1 / 3);
    expect(s.pivots.precision).toBeCloseTo(1 / 3);
  });
  it('lines need both anchors within 1 bar and 0.1 ATR', () => {
    const e = enginePivots(bars, 'H4');
    expect(e.length).toBeGreaterThan(0);
    const line = { id: 'x', a: { i: 10, p: bars[10].l }, b: { i: 30, p: bars[30].l }, dir: 1 as const, brk: null };
    const off = { ...line, id: 'y', b: { i: 30, p: bars[30].l + 5 } };
    expect(scoreChart(bars, { ...emptyMarks(), lines: [line] }, { ...emptyMarks(), lines: [{ ...line, a: { i: 11, p: line.a.p } }] }).lines.matched).toBe(1);
    expect(scoreChart(bars, { ...emptyMarks(), lines: [line] }, { ...emptyMarks(), lines: [off] }).lines.matched).toBe(0);
    const brk = scoreChart(bars, { ...emptyMarks(), lines: [{ ...line, brk: 40 }] }, { ...emptyMarks(), lines: [{ ...line, brk: 45 }] });
    expect([brk.lines.matched, brk.breaks.matched]).toEqual([1, 0]);
  });
  it('zones: start ±1, IoU ≥ 0.6', () => {
    expect(iou(0, 10, 2, 10)).toBeCloseTo(0.8);
    const z = { id: 'z', side: 'demand' as const, s: 10, e: 11, prox: 101, dist: 100 };
    expect(scoreChart(bars, { ...emptyMarks(), zones: [z] }, { ...emptyMarks(), zones: [{ ...z, s: 11, prox: 100.9 }] }).zones.matched).toBe(1);
    expect(scoreChart(bars, { ...emptyMarks(), zones: [z] }, { ...emptyMarks(), zones: [{ ...z, prox: 100.4 }] }).zones.matched).toBe(0);
    expect(scoreChart(bars, { ...emptyMarks(), zones: [z] }, { ...emptyMarks(), zones: [{ ...z, side: 'supply' }] }).zones.matched).toBe(0);
  });
  it('nothing marked = no score (never a free 100%)', () => {
    const s = scoreChart(bars, emptyMarks(), engineMarks(bars, 'H4', 'fx'));
    expect(s.overall).toBeNull();
    expect(summarize([{ owner: emptyMarks(), score: s }]).overall).toBeNull();
  });
  it('engine indices are bar positions (zones sit on their base candles, lines on wicks)', () => {
    const bars = real;
    for (const z of engineZones(bars, 'D1', 'fx')) { expect(z.s).toBeLessThanOrEqual(z.e); expect(z.e).toBeLessThan(bars.length); }
    for (const l of engineLines(bars, 'D1')) {
      expect(l.a.i).toBeLessThan(l.b.i);
      expect([bars[l.b.i].l, bars[l.b.i].h]).toContain(l.b.p);
    }
    for (const p of enginePivots(bars, 'D1')) expect(p.p).toBe(p.kind === 'peak' ? bars[p.i].h : bars[p.i].l);
  });
});
