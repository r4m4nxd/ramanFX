import { describe, expect, it } from 'vitest';
import { replay, simulate } from './manage';

describe('management replay', () => {
  it('a trade that ran +2R then stopped out: 1:1 TP banks +1, BE at 1R saves it', () => {
    const p = { r: -1, mfe: 2, mae: 1, mfeFirst: true };
    expect(replay(p, 'actual')).toBe(-1);
    expect(replay(p, 'tp1')).toBe(1);
    expect(replay(p, 'be1')).toBe(0);
    expect(replay(p, 'tp3')).toBe(-1);
  });
  it('unknown order is treated conservatively (stop first)', () => {
    const p = { r: -1, mfe: 2, mae: 1, mfeFirst: null };
    expect(replay(p, 'tp1')).toBe(-1);
  });
  it('a clean runner: 1:3 TP gets 3R, actual kept 4R', () => {
    const p = { r: 4, mfe: 4.2, mae: 0.2, mfeFirst: false };
    expect(replay(p, 'tp3')).toBe(3);
    expect(replay(p, 'actual')).toBe(4);
  });
  it('manual exit before either level keeps the real result', () => {
    expect(replay({ r: 0.4, mfe: 0.6, mae: 0.3, mfeFirst: null }, 'tp1')).toBe(0.4);
  });
  it('simulate totals', () => {
    const res = simulate([{ r: -1, mfe: 2, mae: 1, mfeFirst: true }, { r: 1.5, mfe: 1.6, mae: 0.1, mfeFirst: false }]);
    expect(res.find(x => x.id === 'tp1')!.totalR).toBe(2);
  });
});
