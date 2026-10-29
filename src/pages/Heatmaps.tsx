import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/data/store';
import { useAnalytics } from '@/data/derived';
import type { EnrichedTrade } from '@/core/stats';
import { monthName } from '@/lib/format';
import { Card, CardHead, cx, Empty, Page, rise, Segmented, useIsMobile } from '@/ui/kit';
import { addTo, emptyCell, Heatmap, METRIC_LABEL, metricValue, useMetricFmt, type HeatCell, type HeatMetric } from '@/ui/Heatmap';
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
      {[{ o: all[0], good: true }, { o: all[all.length - 1], good: false }].map(({ o, good }) => (
        <motion.div key={`${good}${o.r}${o.c}${metric}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}
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

/** Local UTC offset, e.g. "UTC+05:30", so hour-based views name their clock. */
function utcOffset() {
  const m = -new Date().getTimezoneOffset();
  return `UTC${m >= 0 ? '+' : '−'}${String(Math.floor(Math.abs(m) / 60)).padStart(2, '0')}:${String(Math.abs(m) % 60).padStart(2, '0')}`;
}

export default function Heatmaps() {
  const { et } = useAnalytics();
  const nav = useNavigate();
  const mobile = useIsMobile();
  const setRange = useStore(s => s.setRange);
  const range = useStore(s => s.range);
  const [metric, setMetric] = useState<HeatMetric>('net');
  const [dim, setDim] = useState<'session' | 'day' | 'hold'>('session');

  const dayHour = useMemo(() => grid(et, t => DAYS[(t.open.getDay() + 6) % 7], t => String(t.open.getHours()).padStart(2, '0')), [et]);
  const daysUsed = useMemo(() => DAYS.filter(d => HOURS.some(h => dayHour(d, h))), [dayHour]);
  // Only the span of hours actually traded (gaps inside kept so the axis stays honest).
  const hoursUsed = useMemo(() => {
    const idx = HOURS.map((h, i) => (daysUsed.some(d => dayHour(d, h)) ? i : -1)).filter(i => i >= 0);
    return idx.length ? HOURS.slice(idx[0], idx[idx.length - 1] + 1) : HOURS;
  }, [dayHour, daysUsed]);

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
  const openSym = (sym: string) => nav(`/trades?symbol=${encodeURIComponent(sym)}`);

  if (!et.length) return (
    <Page>
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Where your edge lives</h2>
      <Card>
        <Empty icon="calendar" title={`No trades in ${range.label === 'All time' ? 'this account yet' : range.label}`}
          action={range.from || range.to ? <button type="button" className="btn-primary h-10" onClick={() => setRange({ from: null, to: null, label: 'All time' })}>Show all time</button> : undefined}>
          Heat maps fill in once there are trades in the selected range.
        </Empty>
      </Card>
    </Page>
  );

  const fullDay = hoursUsed.length === 24;

  return (
    <Page>
      <motion.div variants={rise} className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Where your edge lives</h2>
          <p className="text-[13px] text-ink3 mt-1">{et.length} trades. {mobile ? 'Tap a cell for details' : 'Hover a cell for details'}; hatched cells have fewer than 3 trades.</p>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <span className="label shrink-0 max-sm:hidden">Colour by</span>
          <div className="overflow-x-auto -mx-1 px-1 min-w-0"><Segmented swap="card" label="Colour cells by" size="sm" value={metric} onChange={setMetric} options={(['net', 'win', 'exp', 'r', 'trades'] as HeatMetric[]).map(m => ({ value: m, label: m === 'exp' ? 'Per trade' : METRIC_LABEL[m] }))} /></div>
        </div>
      </motion.div>

      <Card>
        <CardHead title="Day × hour" sub={<>Entry hour, your time ({utcOffset()}).{!fullDay && <> Showing {hoursUsed[0]}–{hoursUsed[hoursUsed.length - 1]}:00; no trades outside these hours.</>}</>} />
        <Extremes rows={daysUsed} cols={hoursUsed} cell={dayHour} metric={metric} label={(r, c) => `${r} · ${c}:00–${String((+c + 1) % 24).padStart(2, '0')}:00`} />
        <Heatmap label="Day × hour" rows={daysUsed} cols={hoursUsed} cell={dayHour} metric={metric} transposeOnMobile rowHead="" cellH={30} colLabel={c => c} />
      </Card>

      <div className="grid xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHead title={`Symbol × ${dim === 'session' ? 'session' : dim === 'day' ? 'weekday' : 'hold time'}`} sub="Your 12 most traded symbols. Open a cell to see its trades." right={<Segmented swap="card" label="Columns" size="sm" value={dim} onChange={setDim} options={[{ value: 'session', label: 'Session' }, { value: 'day', label: 'Day' }, { value: 'hold', label: 'Hold' }]} />} />
          <Extremes rows={topSyms} cols={dimCols} cell={symGrid} metric={metric} label={(r, c) => `${r} · ${c}`} />
          <Heatmap key={dim} label="Symbol" rows={topSyms} cols={dimCols} cell={symGrid} metric={metric} showValues cellH={34} onOpen={r => openSym(r)} />
        </Card>
        <div className="xl:col-span-2 flex flex-col gap-4">
          <Card>
            <CardHead title="Month by month" sub="Classic returns grid, one column per year" />
            <Heatmap label="Month by month" rows={MONTHS.filter(m => yearsUsed.some(y => monthYear(m, y)))} cols={yearsUsed} cell={monthYear} metric={metric} showValues cellH={30} />
          </Card>
          <Card>
            <CardHead title="Direction × session" sub="Sessions in UTC: Asia 23–07 · London 07–12 · New York 12–21" />
            <Heatmap label="Direction × session" rows={['Long', 'Short']} cols={SESSIONS} cell={sideHour} metric={metric} showValues cellH={44} />
          </Card>
        </div>
      </div>
    </Page>
  );
}
