// ZoneVision 2.18 MT5 conformance: tools/telegram_bot/parity/mql_port.py --model (mql_model.py = a statement-by-statement
// Python port of the RFX_MODEL block of public/tools/RFX_ZoneCore.mqh, MQL index semantics) replays the acceptance charts,
// every Q1 / Q2 option and seeded random windows of the long-history fixture; every pivot, line, zone, trend state, the
// STRUCTURE line and the DIRECTION message must equal the canonical TypeScript (zvModel.ts). The 11-symbol run over qa/bars
// (200+ windows) is scripts/zv216-conformance.ts.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { qaRows } from './structure/acceptance';
import { modelCase, type ModelCase, type Row } from './structure/parity';

const hasPy = spawnSync('python3', ['-c', 'print(1)'], { encoding: 'utf8' }).status === 0;
function rng(seed: number) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; }
const TF_ORDER = ['MN', 'W1', 'D1', 'H4', 'H1'];

describe.skipIf(!hasPy)('MT5 RFX_MODEL conformance (Python port of the MQL block vs zvModel.ts)', () => {
  const cases: ModelCase[] = [];
  const gPins = { MN: '2026-09', W1: '2026-10-17', D1: '2026-10-29', H4: '2026-10-29T20', H1: '2026-10-29T23' };
  const aPins = { MN: '2026-09', W1: '2026-10-17', D1: '2026-10-29', H4: '2026-10-30T16', H1: '2026-10-30T16' };
  const pinned = (sym: string, pins: Record<string, string>, n = 700) => Object.fromEntries(Object.entries(pins).map(([tf, to]) => [tf, qaRows(sym, tf, to).slice(-n)])) as Record<string, Row[]>;
  cases.push(modelCase('XAUUSD H1 acceptance', 'XAUUSD', 'H1', pinned('XAUUSD', gPins), 4020.10, 2));
  cases.push(modelCase('AUDUSD H4 acceptance', 'AUDUSD', 'H4', pinned('AUDUSD', aPins), 0.70346, 5));
  // Q1 / Q2 apply to the 2.16 line machine (lineMode 0, still an input); the 2.17 default machine on the same windows
  for (const q1 of ['retrace', 'major'] as const) cases.push(modelCase(`XAUUSD D1 Q1 ${q1}`, 'XAUUSD', 'D1', pinned('XAUUSD', gPins, 400), 4020.10, 2, { q1, params: { lineMode: 0 } }));
  for (const q2 of ['b', 'c'] as const) cases.push(modelCase(`AUDUSD W1 Q2 ${q2}`, 'AUDUSD', 'W1', pinned('AUDUSD', aPins, 400), 0.70346, 5, { q2, params: { lineMode: 0 } }));
  cases.push(modelCase('XAUUSD H1 acceptance, 2.16 lines', 'XAUUSD', 'H1', pinned('XAUUSD', gPins), 4020.10, 2, { params: { lineMode: 0 } }));
  cases.push(modelCase('AUDUSD H4 acceptance, 2.16 lines', 'AUDUSD', 'H4', pinned('AUDUSD', aPins), 0.70346, 5, { params: { lineMode: 0 } }));
  // 2.18 rules switched off (= 2.17) and each on alone: the switches (H1 BOS line swings + first higher low, H2 run momentum
  // lines, H3 base zones) on the W1 / MN charts they act on
  const off218 = { bosN: 0, p1Low: 0, momRun: 0, momBars: 0, pivZones: 2 };
  cases.push(modelCase('XAUUSD W1 acceptance, 2.18 rules off', 'XAUUSD', 'W1', pinned('XAUUSD', gPins), 4020.10, 2, { params: off218 }));
  cases.push(modelCase('AUDUSD W1 acceptance, H1 only', 'AUDUSD', 'W1', pinned('AUDUSD', aPins), 0.70346, 5, { params: { ...off218, bosN: 1, p1Low: 1 } }));
  cases.push(modelCase('XAUUSD D1 acceptance, H2 + H1 at bosN 2', 'XAUUSD', 'D1', pinned('XAUUSD', gPins), 4020.10, 2, { params: { ...off218, momRun: 1, momBars: 5, bosN: 2 } }));
  const R = rng(20261030);
  for (let k = 0; k < 24; k++) {                         // random windows: end date and length per TF
    const sym = R() < 0.5 ? 'XAUUSD' : 'AUDUSD', bars: Record<string, Row[]> = {};
    for (const tf of TF_ORDER) {
      const all = qaRows(sym, tf, '9999'), end = all.length - Math.floor(R() * Math.min(300, all.length / 3)), len = 120 + Math.floor(R() * 380);
      bars[tf] = all.slice(Math.max(0, end - len), end);
    }
    const chart = ['W1', 'D1', 'H4', 'H1'][Math.floor(R() * 4)];
    const last = bars[chart][bars[chart].length - 1][4];
    cases.push(modelCase(`random ${k} ${sym} ${chart}`, sym, chart, bars, last, sym === 'XAUUSD' ? 2 : 5));
  }
  it(`${cases.length} models: pivots, lines (history), zones + reasons, trend states, STRUCTURE, DIRECTION`, () => {
    const dir = mkdtempSync(join(tmpdir(), 'rfx-model-'));
    writeFileSync(join(dir, 'cases.json'), JSON.stringify({ cases }));
    const r = spawnSync('python3', ['tools/telegram_bot/parity/mql_port.py', join(dir, 'cases.json'), '--model', '--json'], { encoding: 'utf8', maxBuffer: 64 << 20 });
    if (r.status !== 0 && !r.stdout) throw new Error(r.stderr);
    const out = JSON.parse(r.stdout) as { bad: number; errors: string[] };
    expect(out.errors).toEqual([]);
    expect(out.bad).toBe(0);
  }, 300000);
});
