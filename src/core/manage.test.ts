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

describe('exact replay from touch times', () => {
  const T = (o: Partial<import('./types').Touch>) => ({ p05: null, p1: null, p2: null, p3: null, m05: null, sl: null, be05: null, be1: null, h05: null, ...o });
  it('target before stop wins, stop first loses', () => {
    const won = { r: -1, mfe: 2.2, mae: 1, mfeFirst: null, touch: T({ p05: 5, p1: 10, p2: 30, sl: 50 }), exitMin: 60 };
    expect(replay(won, 'tp1')).toBe(1); expect(replay(won, 'tp2')).toBe(2); expect(replay(won, 'tp3')).toBe(-1);
    const lost = { r: -1, mfe: 1.5, mae: 1, mfeFirst: null, touch: T({ sl: 5, p1: 10 }), exitMin: 5 };
    expect(replay(lost, 'tp1')).toBe(-1);
  });
  it('breakeven rules use the return to entry', () => {
    const p = { r: -1, mfe: 1.2, mae: 1, mfeFirst: true, touch: T({ p05: 3, p1: 8, be05: 20, be1: 20, h05: 25, sl: 40 }), exitMin: 40 };
    expect(replay(p, 'be1')).toBe(0); expect(replay(p, 'be05tp1')).toBe(1); expect(replay(p, 'be1tp3')).toBe(0); expect(replay(p, 'half')).toBe(-0.5);
    const runner = { r: 0.8, mfe: 3.4, mae: 0.2, mfeFirst: true, touch: T({ p05: 3, p1: 8, p2: 20, p3: 60 }), exitMin: 30 };
    expect(replay(runner, 'be1tp3')).toBe(3); expect(replay(runner, 'be1')).toBe(0.8);
  });
});
