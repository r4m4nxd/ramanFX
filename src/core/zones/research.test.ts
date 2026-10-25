import HEADER_RAW from './__fixtures__/zv210_header.csv?raw';
import { describe, expect, it } from 'vitest';
import { NotResearchError, ResearchParser, curveCode, emptyDataset, isoToDay, mergeInto, parseResearchText, verdictCode } from './research';
import { RAJA_DEFAULTS, callouts, defaultCut, groupRows, maxDrawdown, meanCI, pick, summaryRow, tradeR, wilson, type Opts } from './score';

// The exact header ZoneVision 2.10 writes with InpResearchDNA = true (316 columns), generated from RsHeader / RsV2Cols /
// RsS1Cols / RsV2OutHdr in public/tools/RamanFX_ZoneVision.mq5.
const HEADER = HEADER_RAW.trim();
const COLS = HEADER.split(',');
const row = (v: Record<string, string | number>) => COLS.map(c => (c in v ? String(v[c]) : '')).join(',');

const base = { detector: 'ZV', symbol: 'EURUSD', tf: 'H1', type: 'demand', would_draw: 1, opp_R: 4, raja_type: 'ARR', curve_zone: 10, room_R: 4, near_tl: 1, pass_r: 1, entry_modes: 1111, s1_ok: 0 };
const rows = [
  // A: wick stop hit on touch 1, but no candle CLOSED beyond the distal: close-stop trade went on to 2.5R
  row({ ...base, id: 'ZV-H1-D-202401020000', created: '2024.01.02 00:00', touches: 1, t1_time: '2024.01.03 10:00', t1_mfe: 0.4, t1_result: 'stop', t1c_mfe: 2.5, t1c_result: 'target', t1c_loss: '' }),
  // B: stopped either way; the close-stop loss is the real −2.3R. A 2nd touch reached 3R (wick model).
  row({ ...base, id: 'ZV-H1-D-202402010000', created: '2024.02.01 00:00', touches: 2, t1_time: '2024.02.02 10:00', t1_mfe: 0.2, t1_result: 'stop', t1c_mfe: 0.2, t1c_result: 'stop', t1c_loss: -2.3, t2_time: '2024.02.05 10:00', t2_mfe: 3, t2_result: 'target' }),
  // C: never touched — a zone, not a trade
  row({ ...base, id: 'ZV-H1-D-202403010000', created: '2024.03.01 00:00', touches: 0 }),
  // D: ALT detector
  row({ ...base, detector: 'ALT', id: 'ALT-H1-D-202403050000', created: '2024.03.05 00:00', touches: 1, t1_time: '2024.03.06 10:00', t1_mfe: 5, t1_result: 'target', t1c_mfe: 5, t1c_result: 'target' }),
  // E: look-ahead — weak at creation, the touch-candle snapshot calls it ARR with a TAKE
  row({ ...base, type: 'supply', curve_zone: 90, id: 'ZV-H1-S-202404010000', created: '2024.04.01 00:00', raja_type: 'WK', pass_r: 0, entry_modes: 1000, s1_ok: 1, s1_raja_type: 'ARR', s1_pass_r: 1, s1_curve_zone: 90, s1_room_R: 6, s1_near_tl: 0, touches: 1, t1_time: '2024.04.02 10:00', t1_mfe: 2.2, t1_result: 'target', t1c_mfe: 2.2, t1c_result: 'target' }),
  // F: an older file: close-stop "stop" without t1c_loss → optimistic −1R, flagged
  row({ ...base, symbol: 'XAUUSD', tf: 'M15', id: 'ZV-M15-D-202405010000', created: '2024.05.01 00:00', touches: 1, t1_time: '2024.05.01 12:00', t1_mfe: 0, t1_result: 'stop', t1c_mfe: 0, t1c_result: 'stop', t1c_loss: '' }),
];
const CSV = [HEADER, ...rows, rows[0] /* same zone again (overlapping test runs) */].join('\r\n') + '\r\n';
const opts = (o: Partial<Opts> = {}): Opts => ({ ...RAJA_DEFAULTS, cutDay: isoToDay('2024-04-01'), ...o });

describe('research CSV parsing', () => {
  const ds = parseResearchText(CSV, 'RFX_ZoneResearch_EURUSD_20240101_20241231.csv');
  it('reads zones by column name, one trade per touch, untouched zones are not trades', () => {
    expect(COLS.length).toBe(316);
    expect(ds.zones).toBe(6);
    expect(ds.files[0].dup).toBe(1);
    expect(ds.n).toBe(6); // A1, B1, B2, D1, E1, F1
    expect(ds.symbols).toEqual(['EURUSD', 'XAUUSD']);
    expect(ds.files[0]).toMatchObject({ from: '2024-01-02', to: '2024-05-01', v2: true });
  });
  it('streams: any chunk split gives the same result', () => {
    const p = new ResearchParser();
    for (let i = 0; i < CSV.length; i += 37) p.push(CSV.slice(i, i + 37));
    p.end();
    const ds2 = mergeInto(emptyDataset(), { cols: p.cols(), symbols: p.symbols, tfs: p.tfs, newKeys: p.newKeys, info: p.info('x'), zones: p.zones });
    expect(Array.from(ds2.cols.mfeC)).toEqual(Array.from(ds.cols.mfeC));
    expect(Array.from(ds2.cols.rtS)).toEqual(Array.from(ds.cols.rtS));
  });
  it('a second import of the same zones adds nothing', () => {
    const again = parseResearchText(CSV, 'again.csv', ds);
    expect(again.n).toBe(ds.n);
    expect(again.files[1].dup).toBe(7);
  });
  it('rejects calibration tables with a clear message', () => {
    const calib = 'ver,stop_model,level,key,n,touched,p1\n2,wick,0,all,18014,0.9136,0.4151\n';
    expect(() => parseResearchText(calib)).toThrow(NotResearchError);
    expect(() => parseResearchText(calib)).toThrow(/calibration table/);
  });
  it('maps the Raja verdict like the chart and the curve by side', () => {
    expect(verdictCode('1', '1111')).toBe(1); // TAKE
    expect(verdictCode('0', '10')).toBe(2);   // WAIT (Raja entry mode 1)
    expect(verdictCode('0', '20')).toBe(3);   // CONFIRM
    expect(verdictCode('0', '1000')).toBe(4); // SKIP
    expect(verdictCode('', '')).toBe(0);
    expect(curveCode(10, 1)).toBe(1); expect(curveCode(10, -1)).toBe(3); expect(curveCode(50, 1)).toBe(2); expect(curveCode(80, -1)).toBe(1);
  });
});

describe('outcomes: close stop uses the real loss', () => {
  const ds = parseResearchText(CSV);
  const at = (id: number) => id; // trade order = file order here
  it('close stop: A survives the wick and wins +2R; B loses the real −2.3R; F (no t1c_loss) is −1R flagged', () => {
    expect(tradeR(ds, at(0), { target: 2, stop: 'close' })).toEqual({ r: 2, optimistic: false });
    expect(tradeR(ds, at(1), { target: 2, stop: 'close' })!.r).toBeCloseTo(-2.3, 5);
    expect(tradeR(ds, at(5), { target: 2, stop: 'close' })).toEqual({ r: -1, optimistic: true });
  });
  it('wick stop: always exactly −1R', () => {
    expect(tradeR(ds, at(0), { target: 2, stop: 'wick' })!.r).toBe(-1);
    expect(tradeR(ds, at(1), { target: 2, stop: 'wick' })!.r).toBe(-1);
  });
  it('touch 2 has no close-stop log: it uses its wick-stop result', () => {
    expect(tradeR(ds, at(2), { target: 2, stop: 'close' })!.r).toBe(2);
  });
  it('opp target skips zones with nothing opposing', () => {
    expect(tradeR(ds, at(0), { target: 'opp', stop: 'close' })!.r).toBe(0); // 2.5R reached, opp at 4R, still running → 0
  });
  it('Raja defaults: ZV only, fresh only, close stop', () => {
    const p = pick(ds, opts());
    expect(p.idx.length).toBe(4); // A1, B1, E1, F1 (no ALT, no touch 2)
    expect(p.optimistic).toBe(1);
    const s = summaryRow(ds, p, { stop: 'close' });
    expect(s.E).toBeCloseTo((2 - 2.3 + 2 - 1) / 4, 6);
    expect(s.avgLoss).toBeCloseTo((-2.3 - 1) / 2, 6);
    expect(s.small).toBe(true);
  });
});

describe('look-ahead: snapshot columns are not used by default', () => {
  const ds = parseResearchText(CSV);
  it('groups E by its creation type (WK) unless the touch snapshot is asked for', () => {
    const keys = (snap: 'create' | 'touch') => groupRows(ds, pick(ds, opts({ snap })), 'raja', { snap, stop: 'close' }).map(r => `${r.key}:${r.n}`).sort();
    expect(keys('create')).toEqual(['ARR · Arrival:3', 'WK · Weak:1']);
    expect(keys('touch')).toEqual(['ARR · Arrival:4']);
    const v = (snap: 'create' | 'touch') => groupRows(ds, pick(ds, opts({ snap })), 'verdict', { snap, stop: 'close' }).map(r => `${r.key}:${r.n}`).sort();
    expect(v('create')).toEqual(['SKIP:1', 'TAKE:3']);
    expect(v('touch')).toEqual(['TAKE:4']);
  });
  it('in-sample / out-of-sample by creation date', () => {
    expect(pick(ds, opts({ sample: 'is' })).idx.length).toBe(2);  // A, B (Jan, Feb)
    expect(pick(ds, opts({ sample: 'oos' })).idx.length).toBe(2); // E (Apr 1 = the cut, OOS), F
    expect(defaultCut(ds)).toBe(isoToDay('2024-05-01')); // 5 distinct creation days → index 4
  });
});

describe('statistics', () => {
  it('Wilson interval', () => {
    const [lo, hi] = wilson(50, 100);
    expect(lo).toBeCloseTo(0.4038, 3); expect(hi).toBeCloseTo(0.5962, 3);
  });
  it('max drawdown in R, chronological', () => {
    expect(maxDrawdown([2, -1, -2.3, 2, -1])).toBeCloseTo(3.3, 6);
    expect(maxDrawdown([1, 1, 1])).toBe(0);
  });
  it('bootstrap CI is seeded (stable) and brackets the mean', () => {
    const r = Array.from({ length: 200 }, (_, i) => (i % 3 === 0 ? 2 : -1));
    const a = meanCI(r), b = meanCI(r);
    expect(a).toEqual(b);
    const m = r.reduce((s, x) => s + x, 0) / r.length;
    expect(a[0]).toBeLessThan(m); expect(a[1]).toBeGreaterThan(m);
  });
  it('callouts need n ≥ 30 and a whole interval on one side of 0', () => {
    // 40 winners on H1 and 40 close-stop losers on M15 → H1 "best", M15 "avoid"; everything before the cut
    const many: string[] = [];
    for (let i = 0; i < 40; i++) {
      const d = `2024.01.${String(1 + (i % 28)).padStart(2, '0')}`;
      many.push(row({ ...base, tf: 'H1', id: `w${i}`, created: `${d} 00:00`, touches: 1, t1_time: `${d} 05:00`, t1_mfe: 3, t1_result: 'target', t1c_mfe: 3, t1c_result: 'target' }));
      many.push(row({ ...base, tf: 'M15', id: `l${i}`, created: `${d} 00:00`, touches: 1, t1_time: `${d} 06:00`, t1_mfe: 0, t1_result: 'stop', t1c_mfe: 0, t1c_result: 'stop', t1c_loss: -2 }));
    }
    const d2 = parseResearchText([HEADER, ...many].join('\n'));
    const c = callouts(d2, opts({ cutDay: isoToDay('2030-01-01') }));
    expect(c.best.map(x => `${x.dim}:${x.row.key}`)).toContain('tf:H1');
    expect(c.avoid.map(x => `${x.dim}:${x.row.key}`)).toContain('tf:M15');
    expect(c.avoid.find(x => x.row.key === 'M15')!.row.avgLoss).toBe(-2);
  });
});
