// MT5 ZoneVision 2.15 RFX_STRUCT block (public/tools/RFX_ZoneCore.mqh = the owner's teaching, zvReal.ts) conformance:
// tools/telegram_bot/parity/mql_port.py --struct (a mechanical Python port of the MQL block, MQL index semantics,
// out-of-range = error) replays the owner's marked charts, the gold D1 acceptance chart and seeded random charts, every
// number compared with the canonical TypeScript (zrLines / zrPhase).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Series } from '../../supabase/functions/telegram-bot/zonecore';
import { zrLines, zrPhase, type ZrLine } from '../../supabase/functions/telegram-bot/zvReal';
import { randomCases } from '../../scripts/arrival-random';

type Row = [string, number, number, number, number];
const hasPy = spawnSync('python3', ['-c', 'print(1)'], { encoding: 'utf8' }).status === 0;
const L = (t: ZrLine | null) => (t ? { dir: t.dir, a: t.a, b: t.b, pa: t.pa, pb: t.pb, brokenAt: t.brokenAt ?? -1, kind: t.kind } : null);
function expected(rows: Row[], tf: string, price: number | null) {
  const S = new Series(rows.map(([d, o, h, l, c]) => ({ d, o, h, l, c })), price, tf), r = zrLines(S), ph = zrPhase(S, r);
  return {
    pivots: r.pivots.map(p => ({ bar: p.bar, p: p.p, t: p.t, conf: p.conf })), hist: r.hist.map(L),
    up: L(r.up), dn: L(r.dn), upX: L(r.upX), dnX: L(r.dnX), mom: L(r.mom),
    phase: { trend: ph.trend, leg: ph.leg, phase: ph.phase, target: ph.target },
  };
}

describe.skipIf(!hasPy)('MT5 RFX_STRUCT conformance (Python port of the MQL block vs zvReal.ts)', () => {
  const cases: { name: string; tf: string; price: number | null; bars: Row[]; expected: unknown }[] = [];
  for (const c of JSON.parse(readFileSync('src/core/training/fixtures/marks.json', 'utf8')).charts as { symbol: string; tf: string; bars: Row[] }[])
    cases.push({ name: `${c.symbol}_${c.tf}`, tf: c.tf, price: null, bars: c.bars, expected: expected(c.bars, c.tf, null) });
  const X = JSON.parse(readFileSync('tools/telegram_bot/parity/xauusd_d1_2026-10-29.json', 'utf8'));
  cases.push({ name: 'XAUUSD_D1', tf: 'D1', price: X.price, bars: X.D1.slice(0, -1), expected: expected(X.D1.slice(0, -1), 'D1', X.price) });
  for (const c of randomCases(120, 20261031).cases as { name: string; tf: string; bars: Record<string, Row[]> }[])
    for (const tf of Object.keys(c.bars)) if (tf !== '3M') cases.push({ name: `${c.name}_${tf}`, tf, price: null, bars: c.bars[tf], expected: expected(c.bars[tf], tf, null) });
  it(`${cases.length} charts: pivots, every trend / momentum line, live / broken lines, phase`, () => {
    const all = cases.map(c => c.expected as { hist: { kind: string }[]; phase: { phase: string } });
    expect(all.filter(e => e.hist.some(h => h.kind === 'momentum')).length).toBeGreaterThan(20);
    expect(all.filter(e => e.hist.filter(h => h.kind === 'trend').length > 1).length).toBeGreaterThan(20);
    expect(all.filter(e => e.phase.phase === 'correction').length).toBeGreaterThan(5);
    const dir = mkdtempSync(join(tmpdir(), 'rfx-struct-'));
    writeFileSync(join(dir, 'cases.json'), JSON.stringify({ cases }));
    const r = spawnSync('python3', ['tools/telegram_bot/parity/mql_port.py', join(dir, 'cases.json'), '--struct', '--json'], { encoding: 'utf8', maxBuffer: 64 << 20 });
    if (r.status !== 0 && !r.stdout) throw new Error(r.stderr);
    const out = JSON.parse(r.stdout) as { bad: number; errors: string[] };
    expect(out.errors).toEqual([]);
    expect(out.bad).toBe(0);
  }, 120000);
});
