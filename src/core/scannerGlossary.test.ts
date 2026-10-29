import { describe, expect, it } from 'vitest';
import { blockTip, ctx6Text, curveTip, entryTip, locTip, mapTagTip, pctGain, pzTip, rajaParts, rajaTip, riskPct, rMultiple, rrTip, ruleKey, ruleTip, seidenTip, stopFrom, stopTip, targetTip, tfTip, toEntryTip } from './scannerGlossary';

// LMT from the real 2026-10-26 scan: W1 STR demand 497.00-509.59, projection target
const lmt = { tf: 'W1', proximal: 509.59, distal: 497, entry: 509.59, stop: 496.37, target: 776.95, rr: 20.22, target_kind: 'projection' as const, next_supply: null, stop_pct_of_height: 5, price: 624.2 };

describe('math', () => {
  it('% gain, risk and R', () => {
    expect(pctGain(100, 114.4)).toBeCloseTo(14.4, 6);
    expect(pctGain(0, 5)).toBe(0);
    expect(riskPct(123.4, 118.9)).toBeCloseTo(3.6467, 3);
    expect(rMultiple(100, 95, 110)).toBe(2);
    expect(rMultiple(100, 100, 110)).toBe(0);
  });
  it('stop = distal − % of the zone height per TF', () => {
    expect(stopFrom(509.59, 497, 'W1')).toBeCloseTo(496.3705, 4);
    expect(stopFrom(110, 100, 'D1')).toBeCloseTo(99, 6); // old files
    expect(stopFrom(110, 100, 'MN')).toBeCloseTo(99.7, 6);
    expect(stopFrom(110, 100, '3M')).toBeCloseTo(99.8, 6);
    expect(stopFrom(100.1, 100, 'W1')).toBeCloseTo(99.97, 6); // min 0.03
  });
});

describe('plan tips', () => {
  it('entry names the zone and the distance', () => {
    const t = entryTip(lmt);
    expect(t.body).toContain('Limit buy at 509.59');
    expect(t.body).toContain('proximal of the W1 demand');
    expect(t.lines![0]).toBe('Price is 22.5% above it now.');
  });
  it('stop shows the formula and the risk %', () => {
    const t = stopTip(lmt);
    expect(t.body).toBe('496.37 = distal 497.00 − 5% of the zone height 12.59 (0.63). The W1 rule: W1 5%, MN 3%, 3M 2%.');
    expect(t.lines![0]).toBe('Risk 2.6% from the entry (13.22 per share).');
  });
  it('target: projection vs supply, % from entry', () => {
    expect(targetTip(lmt).body).toContain('250% projection');
    expect(targetTip(lmt).lines![0]).toBe('+52.5% from the entry · R:R 20.2.');
    const s = targetTip({ ...lmt, target: 140, target_kind: 'supply', next_supply: 140.7, entry: 120, stop: 115, rr: 4, price: 125 });
    expect(s.body).toContain("0.5% before the next supply's proximal 140.70");
    expect(s.lines).toEqual(['+16.7% from the entry · R:R 4.0.', "+12.0% from today's close."]);
    expect(targetTip({ ...lmt, target: null }).title).toBe('No target');
  });
  it('R:R spells out reward ÷ risk', () => {
    expect(rrTip(lmt).body).toContain('267.36 ÷ 13.22');
    expect(rrTip({ ...lmt, rr: null }).title).toBe('R:R —');
  });
  it('PZ tips: % gain, R and the source', () => {
    const s = { entry: 509.59, stop: 496.37, price: 624.2, fv_lo: 497, fv_hi: 550.9, target_kind: 'projection' };
    const p1 = pzTip('pz1', 550.9, s);
    expect(p1.title).toBe('PZ1 550.90');
    expect(p1.lines![0]).toBe('+8.1% from the entry 509.59 · R:R 3.1.');
    expect(p1.lines![1]).toBe('Price is already 11.7% above it.');
    expect(p1.lines![2]).toBe("= the fair value's high edge 550.90.");
    const p2 = pzTip('pz2', 115, { entry: 100, stop: 95, price: 101 });
    expect(p2.lines).toEqual(['+15.0% from the entry 100.00 · R:R 3.0.', "+13.9% from today's close.", '= 3R (entry + 3 × risk).']);
    expect(pzTip('pz3', 776.95, s).lines![2]).toContain('250% projection');
  });
  it('% to entry', () => {
    expect(toEntryTip(18.36, 509.59).body).toContain('fall 18.4%');
    expect(toEntryTip(-0.5, 10).title).toBe('0.5% in the zone');
  });
});

describe('scores and rules', () => {
  it('Raja parts add up to the score', () => {
    expect(rajaParts(8, 'STR', 0, 64.5)).toEqual({ type: 3, fresh: 2, curve: 1, room: 2 });
    expect(rajaParts(10, 'ARR', 0, 20)).toEqual({ type: 4, fresh: 2, curve: 2, room: 2 });
    expect(rajaTip(8, { type: 'STR', touches: 0, curve: 64.5 }).lines).toContain('Room to target: 2/2 (≥ 3x the stop 2, ≥ 2x 1).');
  });
  it('Seiden lists earned and missed parts', () => {
    const t = seidenTip(9, { departure: 2, time: 1, fresh: 2, margin: 2, trend: 2, curve: 0, fv_bonus: 0, index_bonus: 0 });
    expect(t.lines![0]).toBe('Earned: departure 2, time 1, fresh 2, margin 2, trend 2.');
    expect(t.lines![1]).toBe('Missed: curve, fv bonus, index bonus.');
  });
  it('rule keys from short or text', () => {
    expect(ruleKey({ text: 'Curve 64% (no MN strong pair: 100-bar MN range)' })).toBe('curve');
    expect(ruleKey({ text: 'x', short: 'room' })).toBe('room');
    expect(ruleTip({ status: 'fail', text: 'Tested 2x', ref: 'L2 · L52', short: 'fresh' }).title).toBe('Fresh · ✗ fail: blocks a BUY');
    expect(blockTip('curve', ['curve', 'fresh']).lines![0]).toBe('Also fails: zone already tested.');
    expect(mapTagTip('ok', 'rules pass').title).toBe('Rules pass');
  });
  it('curve words and TF tips (incl. 3M), tolerant HTF location', () => {
    expect(curveTip(20).body).toContain('low curve');
    expect(curveTip(80).body).toContain('high curve');
    expect(tfTip('3M').title).toContain('quarterly');
    expect(locTip(undefined)).toBeNull();
    expect(locTip('none', 'no strong 3M demand at the zone')!.lines![0]).toContain('no strong higher-timeframe zone');
    expect(locTip('inside', 'x', 'MN demand 37.47–32.66 touched ✓ → W1 entry 38.74–36.98')!.title).toBe('Chain: MN demand 37.47–32.66 touched ✓ → W1 entry 38.74–36.98');
    expect(ctx6Text({ text: '6M: middle · trend RANGE' })).toBe('6M: middle · trend RANGE');
    expect(ctx6Text('n/a (short history)')).toBe('n/a (short history)');
    expect(ruleKey({ text: 'HTF location: 3M demand: top tradeable timeframe' })).toBe('location');
  });
});
