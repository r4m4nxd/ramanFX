import { describe, expect, it } from 'vitest';
import { parseExitCSV } from './parsers';
import { exitOutcome, exitSummary, orderWaitMin } from './exitInsights';

const H = 'Position ID,Symbol,Type,Open Time,Close Time,Duration (Hrs),Profit ($),Profit (Pts),MAE (Pts),MFE (Pts),T+30m (Pts),T+1h (Pts),T+4h (Pts),T+12h (Pts),T+1d (Pts),T+1w (Pts),T+1w MIN (Pts),Initial SL,Initial TP,Entry,Exit,Volume,Minutes to MFE,Minutes to MAE,Source,Exit Reason,Closes,Exits,Entry Order,Requested,Slippage (Pts),Order Placed,MAE before MFE (Pts),Hit +0.5R,Hit +1R,Hit +2R,Hit +3R,Hit -0.5R,Hit SL,BE after +0.5R,BE after +1R,-0.5R after +1R,After Exit,After Exit Min,Max After 1d (Pts),Max After 1w (Pts)';
// Long gold 2000 → closed by hand at 2005 (+$50); stop 1990 (1R = $100), target 2030 (3R) hit 2h after the exit.
const row = '1,XAUUSD,buy,2026.07.01 10:00:00,2026.07.01 11:00:00,1.00,50.00,500.0,-300.0,800.0,N/A,N/A,N/A,N/A,N/A,N/A,N/A,1990.00,2030.00,2000.00,2005.00,0.10,20.0,5.0,ticks,manual,1,2005.00@2026.07.01 11:00:00x0.10,limit,2000.00,0.0,2026.07.01 08:30:00,-150.0,10.0,25.0,,,40.0,,,,,tp,120.0,3100.0,3100.0';

describe('v2 excursion export', () => {
  const e = parseExitCSV([H, row].join('\n'))['1'];
  it('reads the new columns', () => {
    expect(e.exitReason).toBe('manual'); expect(e.entryOrder).toBe('limit'); expect(e.closes).toBe(1);
    expect(e.touch?.p1).toBe(25); expect(e.touch?.sl).toBeNull(); expect(e.afterExit).toBe('tp'); expect(e.afterExitMin).toBe(120);
    expect(orderWaitMin(e)).toBe(90);
  });
  it('prices what the target would have paid', () => {
    const t = { net: 50, r: 0.5, risk: 100, side: 'buy' as const, openPrice: 2000, sl: 1990, tp: 2030, e };
    const o = exitOutcome(t);
    expect(o.tpR).toBeCloseTo(3); expect(o.left).toBeCloseTo(250); expect(o.saved).toBeNull();
    const s = exitSummary([t]);
    expect(s.left.total).toBeCloseTo(250); expect(s.byReason[0].key).toBe('manual'); expect(s.byOrder[0].key).toBe('limit');
    expect(s.heatBeforeBestR).toBeCloseTo(0.15);
  });
});
