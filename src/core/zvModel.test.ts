// ZoneVision 2.16 structure model (supabase/functions/telegram-bot/zvModel.ts = docs/training/SPEC.md): every acceptance row
// of SPEC sections 4 / 5 (src/core/structure/rows.ts, on the long-history qa/bars fixture), the invariants of section 6
// (I1 - I5) and window independence (X1). A row the rules as written cannot produce is asserted as a KNOWN gap with its reason
// (it fails loudly the day it starts passing, so the table is updated), never skipped silently.
import { describe, expect, it } from 'vitest';
import { chart, model, qaRows } from './structure/acceptance';
import { ROWS } from './structure/rows';
import { Series } from '../../supabase/functions/telegram-bot/zonecore';
import { zmAt, zmModel, zmPivots, zmTf, type ZmModel } from '../../supabase/functions/telegram-bot/zvModel';

describe('SPEC acceptance rows (sections 4 + 5, owner gold marks 2026-10-30)', () => {
  for (const r of ROWS) {
    if (r.expect.startsWith('skip:')) { it.skip(`${r.id} [${r.tag}] ${r.what} - ${r.expect}`, () => {}); continue; }
    if (r.expect === 'pass') it(`${r.id} [${r.tag}] ${r.what}`, () => expect(r.run()).toBe(true));
    else it(`${r.id} [${r.tag}] known gap: ${r.expect.slice(6)}`, () => expect(r.run()).toBe(false));
  }
});

const gold = (chartTf: string) => model('XAUUSD', chartTf, { MN: '2026-09', W1: '2026-10-17', D1: '2026-10-29', H4: '2026-10-29T20', H1: '2026-10-29T23' }, 4020.10);
const aud = (chartTf: string) => model('AUDUSD', chartTf, { MN: '2026-09', W1: '2026-10-17', D1: '2026-10-29', H4: '2026-10-30T16', H1: '2026-10-30T16' });
const models: [string, ZmModel][] = [['XAUUSD H1', gold('H1')], ['XAUUSD H4', gold('H4')], ['XAUUSD D1', gold('D1')], ['XAUUSD W1', gold('W1')],
  ['AUDUSD H4', aud('H4')], ['AUDUSD D1', aud('D1')], ['AUDUSD MN', aud('MN')]];

describe('SPEC 6 invariants', () => {
  it('I1: the NOW side is the side 2.6 allows on the TFs it names', () => {
    for (const [n, m] of models) {
      const now = m.direction.split(' | ')[1] ?? '';
      const side = now.startsWith('NOW: BUY') ? 1 : now.startsWith('NOW: SELL') ? -1 : 0;
      const tfs = (now.match(/on ([A-Z0-9/]+)/)?.[1] ?? '').split('/').filter(Boolean);
      if (side !== 0) for (const tf of tfs) expect(m.allowed[tf], `${n} ${tf}`).toBe(side);
    }
  });
  it('I2: one DIRECTION per symbol (same text on every chart), no FULL / REDUCED / "with direction"', () => {
    for (const [n, m] of models) {
      expect(m.direction.match(/DIRECTION:/g)?.length, n).toBe(1);
      expect(m.direction).not.toMatch(/FULL|REDUCED|with direction/);
    }
    expect(new Set(models.filter(([n]) => n.startsWith('XAUUSD')).map(([, m]) => m.direction)).size).toBe(1);
    expect(new Set(models.filter(([n]) => n.startsWith('AUDUSD')).map(([, m]) => m.direction)).size).toBe(1);
  });
  it('I3: at most one "->", on the correcting TF; "impulse" never on a TF whose leg opposes its parent trend', () => {
    for (const [n, m] of models) {
      const arrows = m.structure.split('  |  ').filter(s => s.includes('->'));
      expect(arrows.length, n).toBeLessThanOrEqual(1);
      if (arrows.length) expect(arrows[0].startsWith(`${m.cTf} `), n).toBe(true);
      m.phases.forEach((p, i) => {
        if (i === 0 || p.phase !== 'impulse') return;
        const par = m.tfs[i - 1].st.trend;
        expect(p.leg === par, `${n} ${p.tf}`).toBe(true);
      });
    }
  });
  it('I4: the chain always starts at 3M (an H1 chart prints 6 segments; a missing TF says "loading", never vanishes)', () => {
    for (const [n, m] of models) expect(m.structure.startsWith('3M '), n).toBe(true);
    expect(gold('H1').structure.split('  |  ').length).toBe(6);
    const bars = { MN: qaRows('XAUUSD', 'MN', '2026-09').map(([d, o, h, l, c]) => ({ d, o, h, l, c })), D1: qaRows('XAUUSD', 'D1', '2026-10-29').map(([d, o, h, l, c]) => ({ d, o, h, l, c })) };
    const m = zmModel({ sym: 'XAUUSD', chart: 'D1', bars });
    expect(m.structure).toContain('W1 loading');
    expect(m.structure.startsWith('3M ')).toBe(true);
  });
  it('I5: a trend line ends at its first close beyond (or a veto rotation); no live line has a close beyond it now', () => {
    for (const [sym, tf, to] of [['XAUUSD', 'D1', '2026-10-29'], ['XAUUSD', 'W1', '2026-10-17'], ['AUDUSD', 'D1', '2026-10-29'], ['AUDUSD', 'H4', '2026-10-30T16'], ['XAUUSD', 'H4', '2026-10-30T16']]) {
      const c = chart(sym, tf, to);
      for (const t of c.t.lines.filter(l => l.kind !== 'momentum')) {
        if (t.brokenAt >= 0) expect(t.dir > 0 ? c.S.C[t.brokenAt] < zmAt(t, t.brokenAt) : c.S.C[t.brokenAt] > zmAt(t, t.brokenAt), `${sym} ${tf} ${t.a}>${t.b}`).toBe(true);
        else expect(t.dir > 0 ? c.S.C[1] >= zmAt(t, 1) : c.S.C[1] <= zmAt(t, 1), `${sym} ${tf} live ${t.a}>${t.b}`).toBe(true);
      }
    }
  });
});

describe('SPEC X1: the reading does not depend on where the loaded history starts', () => {
  const rows = qaRows('XAUUSD', 'D1', '2026-10-29');
  const run = (n: number) => { const r = rows.slice(-n), t = zmTf(r.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), 'D1'); return { r, t }; };
  const live = (x: ReturnType<typeof run>) => { const t = x.t.dn!; return `${x.r[x.r.length - t.a][0]}>${x.r[x.r.length - t.b][0]}`; };
  it('gold D1: the live down line is Sep 3 -> Sep 18 with 80, 200, 460 or all bars loaded', () => {
    for (const n of [80, 200, 460, rows.length]) expect(live(run(n)), `${n} bars`).toBe('2026-09-03T00:00>2026-09-18T00:00');
  });
  it('pivots of the last 80 bars are identical with 200, 460 and all bars loaded (D1 / W1 / H4, gold + AUDUSD)', () => {
    for (const [sym, tf, to] of [['XAUUSD', 'D1', '2026-10-29'], ['AUDUSD', 'D1', '2026-10-29'], ['XAUUSD', 'W1', '2026-10-17'], ['AUDUSD', 'H4', '2026-10-30T16']]) {
      const all = qaRows(sym, tf, to);
      const tail = (n: number) => {
        const r = all.slice(-n), S = new Series(r.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), null, tf);
        return zmPivots(S).filter(p => p.conf >= 0 && p.bar <= 80).map(p => `${r[r.length - p.bar][0]}${p.t > 0 ? 'P' : 'V'}`).join(' ');
      };
      const ref = tail(all.length);
      for (const n of [200, 460]) if (all.length >= n) expect(tail(n), `${sym} ${tf} ${n}`).toBe(ref);
    }
  });
});
