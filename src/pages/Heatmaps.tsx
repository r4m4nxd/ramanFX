import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useAnalytics } from '@/data/derived';
import type { EnrichedTrade } from '@/core/stats';
import { monthName } from '@/lib/format';
import { Card, CardHead, cx, Page, rise, Segmented, Tabs } from '@/ui/kit';
import { addTo, emptyCell, Heatmap, METRIC_LABEL, metricValue, Spotlight, useMetricFmt, type HeatCell, type HeatMetric } from '@/ui/Heatmap';
import { Icon } from '@/ui/Icon';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, h) => String(h).padStart(2, '0'));
const SESSIONS = ['Asia', 'London', 'New York', 'Off-hours'];
const HOLDS = ['< 5m', '5–15m', '15m–1h', '1–4h', '4h–1d', '> 1d'];
const holdBucket = (s: number) => (s < 300 ? HOLDS[0] : s < 900 ? HOLDS[1] : s < 3600 ? HOLDS[2] : s < 14400 ? HOLDS[3] : s < 86400 ? HOLDS[4] : HOLDS[5]);

/** Bucket trades into a row × column grid of heat cells. */
function grid(et: EnrichedTrade[], row: (t: EnrichedTrade) => string, col: (t: EnrichedTrade) => string) {
  const m = new Map<string, HeatCell>();
  for (const t of et) { const k = `${row(t)}|${col(t)}`; const c = m.get(k) ?? emptyCell(); addTo(c, t); m.set(k, c); }
  return (r: string, c: string) => m.get(`${r}|${c}`);
}

/** Best and worst cells as callouts, so the map answers "so what?" at a glance. */
function Extremes({ rows, cols, cell, metric, label }: { rows: string[]; cols: string[]; cell: (r: string, c: string) => HeatCell | undefined; metric: HeatMetric; label: (r: string, c: string) => string }) {
  const f = useMetricFmt();
  const all = rows.flatMap(r => cols.map(c => ({ r, c, x: cell(r, c) }))).filter(o => o.x && o.x.n >= 3).map(o => ({ ...o, v: metricValue(metric === 'trades' ? 'net' : metric, o.x) }))
    .filter(o => o.v != null) as { r: string; c: string; x: HeatCell; v: number }[];
  if (all.length < 2) return null;
  all.sort((a, b) => b.v - a.v);
  const m = metric === 'trades' ? 'net' : metric;
  return (
    <div className="grid sm:grid-cols-2 gap-2 mb-5">
      {[{ o: all[0], good: true }, { o: all[all.length - 1], good: false }].map(({ o, good }, i) => (
        <motion.div key={`${good}${o.r}${o.c}${metric}`} initial={{ opacity: 0, x: good ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.08 }}
          className={cx('flex items-center gap-3 rounded-xl px-3.5 py-2.5 border', good ? 'bg-profit/[0.07] border-profit/25' : 'bg-loss/[0.07] border-loss/25')}>
          <Icon name={good ? 'flame' : 'alert'} size={16} className={good ? 'text-profit' : 'text-loss'} />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] text-ink3">{good ? 'Strongest' : 'Weakest'} · {o.x.n} trades</div>
            <div className="text-[13px] font-medium truncate">{label(o.r, o.c)}</div>
          </div>
          <span className={cx('num font-semibold text-[13px]', good ? 'text-profit' : 'text-loss')}>{f(m, o.v)}</span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Heatmaps() {
  const { et } = useAnalytics();
  const [metric, setMetric] = useState<HeatMetric>('net');
  const [dim, setDim] = useState<'session' | 'day' | 'hold'>('session');

  const dayHour = useMemo(() => grid(et, t => DAYS[(t.open.getDay() + 6) % 7], t => String(t.open.getHours()).padStart(2, '0')), [et]);
  const daysUsed = useMemo(() => DAYS.filter(d => HOURS.some(h => dayHour(d, h))), [dayHour]);

  const monthYear = useMemo(() => grid(et, t => monthName(t.close.getMonth()).slice(0, 3), t => String(t.close.getFullYear())), [et]);
  const yearsUsed = useMemo(() => [...new Set(et.map(t => String(t.close.getFullYear())))].sort(), [et]);
  const MONTHS = Array.from({ length: 12 }, (_, i) => monthName(i).slice(0, 3));

  const topSyms = useMemo(() => {
    const n = new Map<string, number>();
    for (const t of et) n.set(t.sym, (n.get(t.sym) ?? 0) + 1);
    return [...n.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).map(([s]) => s);
  }, [et]);
  const dimCols = dim === 'session' ? SESSIONS : dim === 'day' ? DAYS.slice(0, 5).concat(et.some(t => [0, 6].includes(t.open.getDay())) ? ['Sat', 'Sun'] : []) : HOLDS;
  const symGrid = useMemo(() => grid(et, t => t.sym, t => (dim === 'session' ? t.session : dim === 'day' ? DAYS[(t.open.getDay() + 6) % 7] : holdBucket(t.holdSec))), [et, dim]);

  const sideHour = useMemo(() => grid(et, t => (t.type === 'buy' ? 'Long' : 'Short'), t => t.session), [et]);

  if (!et.length) return <Card><div className="py-16 text-center text-ink3">No trades in this range.</div></Card>;

  return (
    <Page>
      <motion.div variants={rise} className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Where your edge lives</h2>
          <p className="text-[13px] text-ink3 mt-1">{et.length} trades. Hover or tap a cell; hatched cells have fewer than 3 trades.</p>
        </div>
        <Tabs label="Metric" value={metric} onChange={setMetric} options={(['net', 'win', 'exp', 'r', 'trades'] as HeatMetric[]).map(m => ({ value: m, label: m === 'exp' ? 'Per trade' : METRIC_LABEL[m] }))} />
      </motion.div>

      <Card className="p-0 luxe-border"><Spotlight className="p-5 md:p-6 rounded-xl">
        <CardHead title="Day × hour" sub="Your local entry hour. The hottest hours are your trading window." />
        <Extremes rows={daysUsed} cols={HOURS} cell={dayHour} metric={metric} label={(r, c) => `${r} · ${c}:00–${String((+c + 1) % 24).padStart(2, '0')}:00`} />
        <Heatmap rows={daysUsed} cols={HOURS} cell={dayHour} metric={metric} transposeOnMobile rowHead="" cellH={30} colLabel={c => c} />
      </Spotlight></Card>

      <div className="grid xl:grid-cols-5 gap-4">
        <Card className="p-0 xl:col-span-3"><Spotlight className="p-5 md:p-6 rounded-xl">
          <CardHead title="Symbol ×" sub="Your 12 most traded symbols" right={<Segmented label="Columns" size="sm" value={dim} onChange={setDim} options={[{ value: 'session', label: 'Session' }, { value: 'day', label: 'Day' }, { value: 'hold', label: 'Hold' }]} />} />
          <Extremes rows={topSyms} cols={dimCols} cell={symGrid} metric={metric} label={(r, c) => `${r} · ${c}`} />
          <Heatmap key={dim} rows={topSyms} cols={dimCols} cell={symGrid} metric={metric} showValues cellH={34} />
        </Spotlight></Card>
        <Card className="p-0 xl:col-span-2"><Spotlight className="p-5 md:p-6 rounded-xl">
          <CardHead title="Month by month" sub="Classic returns grid, one column per year" />
          <Heatmap rows={MONTHS.filter(m => yearsUsed.some(y => monthYear(m, y)))} cols={yearsUsed} cell={monthYear} metric={metric} showValues cellH={30} />
          <div className="mt-6"><CardHead title="Direction × session" sub="Are you better buying or selling, and when?" /></div>
          <Heatmap rows={['Long', 'Short']} cols={SESSIONS} cell={sideHour} metric={metric} showValues cellH={44} />
        </Spotlight></Card>
      </div>
    </Page>
  );
}
