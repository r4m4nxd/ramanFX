// ARRIVAL rules (owner-approved Raja / Kevin diagrams, Oct 2026): supabase/functions/telegram-bot/arrival.ts.
// 1. every case of the shared parity fixture tools/telegram_bot/parity/arrival_fixtures.json (the Python alert side
//    tests against the same file) recomputes to the stored expected output;
// 2. the hand-built scenarios (scripts/arrival-scenarios.ts) show each rule: wick re-anchoring, a demand arrival
//    removing 1 / 2 supplies, no arrival without a line cross, the HTF ceiling cap / extension, a supply arrival making
//    the demands weak with the realignment demand at the HTF up line, the LTF confirmation inside it.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { arrivalTf, rrOf, stopOf } from '../../supabase/functions/telegram-bot/arrival';
import { FX_PARAMS, RAJA, Series, tfZonesOf, type ZBar } from '../../supabase/functions/telegram-bot/zonecore';
import { baseIndex, buildPanels, chartArrival, chartVerdict } from '../../supabase/functions/telegram-bot/logic';
import { renderSvg, type Bar } from '../../supabase/functions/telegram-bot/chart';
import { chartIssues } from '../../scripts/break-checks';
import { zvLines } from '../../supabase/functions/telegram-bot/zvTrend';
import { SCEN } from '../../scripts/arrival-scenarios';

type Row = [string, number, number, number, number];
const fx = JSON.parse(readFileSync('tools/telegram_bot/parity/arrival_fixtures.json', 'utf8'));
const zb = (r: Row[]): ZBar[] => r.map(([d, o, h, l, c]) => ({ d, o, h, l, c }));

function close(a: unknown, b: unknown, path = '$'): void {
  if (typeof a === 'number' && typeof b === 'number') {
    if (Math.abs(a - b) > 1e-9 * Math.max(1, Math.abs(a))) throw new Error(`${path}: ${a} != ${b}`);
    return;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) throw new Error(`${path}: length ${a.length} != ${b.length}`);
    a.forEach((x, i) => close(x, b[i], `${path}[${i}]`));
    return;
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const ka = Object.keys(a).sort(), kb = Object.keys(b).sort();
    if (ka.join() !== kb.join()) throw new Error(`${path}: keys ${ka} != ${kb}`);
    for (const k of ka) close((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`);
    return;
  }
  if (a !== b) throw new Error(`${path}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
}

describe('arrival parity fixture', () => {
  it('has the hand-built rule cases and real published cases', () => {
    const names = fx.cases.map((c: { name: string }) => c.name);
    for (const n of Object.keys(SCEN)) expect(names).toContain(n);
    expect(fx.cases.length).toBeGreaterThan(Object.keys(SCEN).length + 4);
  });
  for (const c of fx.cases) {
    it(`${c.name}: recomputes to the stored output`, () => {
      const bars = zb(c.bars[c.tf]);
      const a = arrivalTf(bars, c.tf, c.price, c.market === 'fx' ? FX_PARAMS : RAJA, c.htf ? zb(c.bars[c.htf]) : null, c.ltf ? zb(c.bars[c.ltf]) : null, c.htf, c.ltf, c.spread ?? 0);
      const r = zvLines(new Series(bars, bars[bars.length - 1].c, c.tf));
      const o = (t: typeof r.up) => (t ? { a: t.a, b: t.b, pa: t.pa, pb: t.pb } : null);
      const got = JSON.parse(JSON.stringify({ lines: { up: o(r.up), dn: o(r.dn), upX: o(r.upX), dnX: o(r.dnX), why: r.why }, arrivals: a.arrivals,
        current: a.current ? a.arrivals.indexOf(a.current) : -1, plan: a.plan, confirm: a.confirm, pending: a.pending }));
      close(got, c.expected);
    });
  }
});

const run = (k: string) => { const s = SCEN[k]; return arrivalTf(s.bars, s.tf, s.price, FX_PARAMS, s.htf ?? null, s.ltf ?? null, s.htfTf ?? null, s.ltfTf ?? null, s.spread ?? 0); };

describe('A: trend line wick re-anchoring (FitAnchor)', () => {
  it('a candle between the two real peaks poking above the line becomes the older anchor (its wick)', () => {
    const s = SCEN.reanchor, n = s.bars.length, r = zvLines(new Series(s.bars, s.price, s.tf));
    const peaks = r.pivots.filter(p => p.t > 0);
    expect(peaks.length).toBe(3);                       // top 136, pivot 1 = 132, pivot 2 = 122; the poking candle is not a real peak
    expect(r.dn).not.toBeNull();
    expect(r.dn!.a).toBeLessThan(peaks[1].bar);          // re-anchored newer than pivot 1
    expect(n - r.dn!.a).toBe(s.bars.findIndex(b => b.h === 130.5));   // the wick candle (high 130.5)
    expect(r.dn!.pa).toBe(130.5);
    expect(r.dn!.b).toBe(peaks[2].bar);
    expect(r.dn!.cuts).toBe(0);
  });
});

describe('B: arrival zones', () => {
  it('demand arrival: the leg-out crosses the down line and removes 2 supplies (strong)', () => {
    const a = run('dem2');
    expect(a.arrivals.length).toBe(1);
    const x = a.current!;
    expect(x.zone.dir).toBe(1);
    expect(x.removed.length).toBe(2);
    expect(x.strong).toBe(true);
    expect(x.line.dir).toBe(-1);
    expect(x.legs).toContain(x.crossBar);
    expect(a.plan!.entry).toBe(x.zone.prox);
    // stop rule, no HTF host: beyond the D1 valley (= the base low here) by 0.1 x ATR14 (no spread given)
    expect(x.valley).toBe(x.zone.dist);
    expect(a.plan!.basis).toBe('valley');
    expect(a.plan!.buffer).toBeCloseTo(0.1 * a.plan!.atr, 12);
    expect(a.plan!.stop).toBeCloseTo(x.valley - a.plan!.buffer, 12);
    expect(a.plan!.rr).toBeCloseTo((116 - x.zone.prox) / (x.zone.prox - a.plan!.stop), 9);
    // no HTF: target = the nearest weak supply above
    expect(a.plan!.ceiling).toBeNull();
    expect(a.plan!.tp).toBe(116);
  });
  it('stop rule: the D1 demand nested in a W1 demand -> 2 buffers below the W1 distal; the spread floors the buffer', () => {
    const a = run('nested'), pl = a.plan!;
    expect(pl.host).not.toBeNull();
    expect(pl.host!.dir).toBe(1);
    expect(Math.min(pl.host!.prox, pl.host!.dist)).toBeLessThanOrEqual(Math.max(a.current!.zone.prox, a.current!.zone.dist));
    expect(pl.buffer).toBe(0.4);                          // spread 0.4 > 0.1 x ATR (0.27)
    expect(pl.basis).toBe('htf');
    expect(pl.stop).toBeCloseTo(pl.host!.dist - 2 * 0.4, 12);
    expect(pl.stop).toBeLessThan(a.current!.valley - pl.buffer);
  });
  it('stop rule (stopOf): a host whose distal is inside the valley stop never tightens it; supply mirrored', () => {
    const S = new Series(SCEN.dem2.bars, SCEN.dem2.price, 'D1');
    const host = { dir: 1, prox: 97, dist: 96.5, legBar: 5, saBar: 4, removed: false, removedBar: -1, tLeg: '', t0: '', made: '' };
    const st = stopOf(S, 1, 96, host, 0);
    expect(st.basis).toBe('valley');
    expect(st.stop).toBeCloseTo(96 - 0.1 * S.atr(1), 12);
    const sp = stopOf(S, -1, 110, { ...host, dir: -1, prox: 109, dist: 111 }, 1);
    expect(sp.buffer).toBe(1);
    expect(sp.basis).toBe('htf');
    expect(sp.stop).toBe(113);
    expect(rrOf(100, 98, 106)).toBe(3);
    expect(rrOf(100, 98, 99)).toBeNull();
    expect(rrOf(100, 98, null)).toBeNull();
  });
  it('demand arrival removing 1 supply: not strong', () => {
    const a = run('dem1');
    expect(a.current!.removed.length).toBe(1);
    expect(a.current!.strong).toBe(false);
  });
  it('no arrival when the leg-out never closes above the down line', () => {
    const a = run('nocross');
    expect(a.arrivals).toEqual([]);
    expect(a.plan).toBeNull();
  });
  it('the HTF down line still intact above caps the target just below it', () => {
    const a = run('ceiling');
    const p = a.plan!;
    expect(p.ceiling).not.toBeNull();
    expect(p.targetPx!).toBeGreaterThan(p.ceiling!);
    expect(p.tp).toBe(p.ceiling);
    expect(p.capped).toBe(true);
  });
  it('the HTF down line crossed: the target extends to the HTF supply', () => {
    const a = run('extend');
    const p = a.plan!;
    expect(p.ceiling).toBeNull();
    expect(p.htfZone).not.toBeNull();
    expect(p.extended).toBe(true);
    expect(p.tp).toBe(p.htfZone!.prox);
    expect(p.tp!).toBeGreaterThan(p.targetPx!);
  });
});

describe('C: supply arrival -> weak demands, realignment, LTF confirmation', () => {
  it('every same-TF demand below is weak; realignment = the demand nearest the HTF up line (not the nearest to price)', () => {
    const a = run('supply'), p = a.plan!;
    expect(a.current!.zone.dir).toBe(-1);
    expect(p.weak.length).toBe(3);
    expect(p.weak.every(z => z.dir === 1)).toBe(true);
    const near = p.weak.slice().sort((x, y) => (SCEN.supply.price - x.prox) - (SCEN.supply.price - y.prox))[0];
    expect(p.realign).not.toBeNull();
    expect(p.realign!.prox).not.toBe(near.prox);
    expect(Math.abs(p.realign!.prox - p.lineNow!)).toBeLessThan(Math.abs(near.prox - p.lineNow!));
    expect(p.target).toEqual(p.realign);
    expect(p.tp).toBe(Math.max(p.targetPx!, p.ceiling!));   // TP above the HTF up line
    expect(a.pending).toBe(false);                              // no LTF given
  });
  it('price in the realignment area + a 1H demand arrival there = confirmed buy, target the D1 last swing high', () => {
    const a = run('confirm');
    expect(a.confirm).not.toBeNull();
    const c = a.confirm!;
    expect(c.tf).toBe('H1');
    expect(c.zone.dir).toBe(1);
    const r = a.plan!.realign!;
    expect(Math.min(c.zone.prox, c.zone.dist)).toBeLessThanOrEqual(Math.max(r.prox, r.dist));
    expect(Math.max(c.zone.prox, c.zone.dist)).toBeGreaterThanOrEqual(Math.min(r.prox, r.dist));
    expect(c.target).toBeGreaterThan(c.zone.prox);
    expect(a.pending).toBe(false);
  });
  it('without the 1H arrival yet: pending (no limit buys)', () => {
    const a = run('pending');
    expect(a.plan!.realign).not.toBeNull();
    expect(a.confirm).toBeNull();
    expect(a.pending).toBe(true);
  });
});

describe('charts: arrival drawing + arrival line (logic.buildPanels -> chart.renderSvg)', () => {
  const draw = (k: string) => {
    const s = SCEN[k];
    const cb = (b: ZBar[]): Bar[] => b.map(r => ({ t: r.d, o: r.o, h: r.h, l: r.l, c: r.c }));
    const bars: Record<string, Bar[]> = { [s.tf]: cb(s.bars), ...(s.htf ? { [s.htfTf!]: cb(s.htf) } : {}), ...(s.ltf ? { [s.ltfTf!]: cb(s.ltf) } : {}) };
    const zones = Object.entries(bars).flatMap(([tf, b]) => tfZonesOf(b.map(r => ({ d: r.t, o: r.o, h: r.h, l: r.l, c: r.c })), tf, 2, s.price)
      .map(z => ({ tf, side: z.side, prox: z.proximal, dist: z.distal, t0: z.base_start, made: z.made })));
    const forming = Object.fromEntries(Object.keys(bars).map(t => [t, false]));
    const panels = buildPanels([s.tf], bars, zones, s.price, 2, null, 'single', t => t, { forming, htf: { [s.tf]: s.htfTf ?? null }, market: 'fx', spread: s.spread ?? 0 })
      .map(p => ({ ...p, zones: p.zones.map(z => ({ ...z, k0: baseIndex(z.t0, p.bars), ...(z.t1 ? { k1: baseIndex(z.t1, p.bars) } : {}) })) }));
    const model = { sym: 'T', title: 'T', digits: 2, price: s.price, layout: 'single' as const, panels, verdict: chartVerdict(panels, zones, s.price, 2, 'fx', null), arrival: chartArrival(panels, 2, 'fx', null) };
    return { model, svg: renderSvg(model as never) };
  };
  it('supply arrival: bold arrival zone with a bolt, removed demands crossed out, weak demands dashed, realignment, TP line', () => {
    const { model, svg } = draw('supply');
    expect(model.arrival).toMatch(/^D1 arrival supply 103\.26–103\.98 · W1 up line intact at [\d.]+ → TP above it · buy only after 1H arrival$/);
    for (const cls of ['zone supply arrival', 'zone removed demand', 'class="xmark"', 'zone demand weak', 'realign', 'trade tp', 'class="bolt"', 'class="bolt arrline"', 'tl ltf up'])
      expect(svg).toContain(cls);
    expect(svg).toContain('realignment D1 demand 78.00–77.28 · confirm on 1H');
    expect(svg).toContain('weak – no limit');
    expect(svg).not.toMatch(/[✕⚡]/);                     // glyphs the Inter subset lacks are drawn as shapes
    expect(chartIssues(model as never, svg)).toEqual([]);
  });
  it('confirmed: the realignment chip and the arrival line name the 1H buy', () => {
    const { model, svg } = draw('confirm');
    const c = run('confirm').confirm!;
    expect(c.basis).toBe('htf');                          // the 1H demand sits in the D1 realignment demand: below its distal
    expect(c.stop).toBeCloseTo(77.28 - 2 * c.buffer, 2);
    expect(model.arrival).toContain(`1H arrival demand in realignment: buy 77.66, stop ${c.stop.toFixed(2)}, target 103.98`);
    expect(svg).toContain('1H arrival: buy');
    expect(chartIssues(model as never, svg)).toEqual([]);
  });
  it('demand arrival with the HTF ceiling: TP chip below the W1 line', () => {
    const { model, svg } = draw('ceiling');
    expect(model.arrival).toContain('W1 down line intact at 121.22 → TP below it');
    expect(svg).toMatch(/TP 121\.22 · below W1 line · R:R [\d.]+/);
    expect(svg).toContain('trade sl');
    expect(svg).toMatch(/SL 95\.75 · below D1 valley/);
  });
  it('nested demand: the SL chip names the W1 demand', () => {
    const { svg } = draw('nested');
    expect(svg).toMatch(/SL 95\.00 · below W1 demand/);
  });
  it('no arrival: no arrival line, nothing flagged', () => {
    const { model, svg } = draw('nocross');
    expect(model.arrival).toBeNull();
    expect(svg).not.toContain('arrival');
  });
});
