// The owner's marked charts (src/core/training/fixtures/marks.json, from tools/training/export_marks.py or the Train
// page's Export JSON) run through the engine: per-chart and overall agreement, printed as a REPORT.
// A regression gate: agreement may only go up. Engine = the ZoneVision 2.16 model (zvModel.ts = docs/training/SPEC.md) since
// 2026-10-30; the floors below are its agreement on the owner's AUDUSD + XAUUSD marks (9 charts). Before / after and the
// remaining disagreements: docs/training/ZV216.md.
import { readFileSync } from 'node:fs';
import { engineMarks } from './training/engine';
import { scoreChart, summarize } from './training/score';
import { parseMarks, toTBars, type TrainChart } from './training/types';

const MIN_AGREEMENT = { pivots: 0.72, lines: 0.33, momentum: 0.16, zones: 0.23 };   // the 2.16 model's agreement (floor)
const file = JSON.parse(readFileSync('src/core/training/fixtures/marks.json', 'utf8')) as { charts: TrainChart[] };
const charts = (file.charts ?? []).filter(c => Array.isArray(c.bars) && c.bars.length >= 20);
const pct = (v: number | null) => (v == null ? '  –' : `${Math.round(v * 100)}%`.padStart(4));

describe('training fixtures: engine vs the owner\'s marks (report)', () => {
  it(`scores ${charts.length} marked chart(s)`, () => {
    const rows = charts.map(c => {
      const bars = toTBars(c.bars), owner = parseMarks(c.marks);
      return { c, owner, score: scoreChart(bars, owner, engineMarks(bars, c.tf, c.market === 'stock' ? 'stock' : 'fx')) };
    });
    const lines = rows.map(r => `  ${`${r.c.symbol} ${r.c.tf}`.padEnd(16)} overall ${pct(r.score.overall)} · pivots ${pct(r.score.pivots.f1)} · lines ${pct(r.score.lines.f1)} · momentum ${pct(r.score.momentum.f1)} · breaks ${pct(r.score.breaks.f1)} · zones ${pct(r.score.zones.f1)}`);
    const s = summarize(rows);
    // eslint-disable-next-line no-console
    console.log([`Training agreement over ${s.charts} chart(s): overall ${pct(s.overall)}`, `  pivots ${pct(s.pivots.f1)} (recall ${pct(s.pivots.recall)}, precision ${pct(s.pivots.precision)})`,
      `  lines  ${pct(s.lines.f1)} (recall ${pct(s.lines.recall)}, precision ${pct(s.lines.precision)}) · momentum ${pct(s.momentum.f1)} (recall ${pct(s.momentum.recall)}, precision ${pct(s.momentum.precision)}) · breaks ${pct(s.breaks.f1)}`, `  zones  ${pct(s.zones.f1)} (recall ${pct(s.zones.recall)}, precision ${pct(s.zones.precision)})`, ...lines].join('\n'));
    expect(s.pivots.f1 ?? 1).toBeGreaterThanOrEqual(MIN_AGREEMENT.pivots);
    expect(s.lines.f1 ?? 1).toBeGreaterThanOrEqual(MIN_AGREEMENT.lines);
    expect(s.momentum.f1 ?? 1).toBeGreaterThanOrEqual(MIN_AGREEMENT.momentum);
    expect(s.zones.f1 ?? 1).toBeGreaterThanOrEqual(MIN_AGREEMENT.zones);
  });
});
