import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IChartApi, ISeriesApi, SeriesMarker, UTCTimestamp } from 'lightweight-charts';
import { pickTf, type Series, type Tf, TFS, wallSec, wallShifter } from '@/core/bars';
import { deviceTz } from '@/core/time';
import { useTradeBars } from '@/data/bars';
import { useStore } from '@/data/store';
import type { EnrichedTrade } from '@/core/stats';
import { Card, CardHead, cx, Segmented, useIsMobile } from './kit';
import { Icon } from './Icon';
import { tvSymbol } from '@/core/tvSymbol';
import { TvWidget } from './TvWidget';

export interface ChartLevels { initSl?: number | null; sl?: string | number | null; tp?: string | number | null; proximal?: number | null; distal?: number | null }

type Lv = { initSl: number | null; sl: number | null; tp: number | null; proximal?: number | null; distal?: number | null };

const rgb = (v: string, a = 1) => `rgba(${getComputedStyle(document.documentElement).getPropertyValue(v).trim().split(/\s+/).join(',')},${a})`;
/** A locale the chart's date formatter accepts (some systems report e.g. "en-US@posix"). */
const safeLocale = () => { for (const l of [navigator.language, 'en-US']) { try { new Intl.DateTimeFormat(l); return l; } catch { /* next */ } } return 'en-US'; };
const decimals = (x: number) => (String(x).split('.')[1] ?? '').length;
const lvl = (v: string | number | null | undefined) => { const n = typeof v === 'string' ? parseFloat(v) : v; return n && isFinite(n) && n > 0 ? n : null; };

/** Index of the last bar starting at or before t. */
function barAt(times: number[], t: number) {
  let lo = 0, hi = times.length - 1, r = 0;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (times[m] <= t) { r = m; lo = m + 1; } else hi = m - 1; }
  return r;
}

function Chart({ t, s, levels, full }: { t: EnrichedTrade; s: Series; levels: Lv; full: boolean }) {
  const el = useRef<HTMLDivElement>(null), legend = useRef<HTMLDivElement>(null);
  const theme = useStore(st => st.theme), tz = useStore(st => st.userTz) || deviceTz();
  useEffect(() => {
    let chart: IChartApi | null = null, dead = false;
    void import('lightweight-charts').then(({ createChart, ColorType, CrosshairMode, LineStyle }) => {
      if (dead || !el.current) return;
      const shift = wallShifter(tz);
      const times = s.t.map(shift);
      const data = times.map((time, i) => ({ time: time as UTCTimestamp, open: s.o[i], high: s.h[i], low: s.l[i], close: s.c[i] }));
      const prec = Math.min(6, Math.max(decimals(t.openPrice), decimals(t.closePrice), ...s.c.slice(-60).map(decimals)));
      const ink3 = rgb('--ink3'), line = rgb('--line'), up = rgb('--profit'), down = rgb('--loss'), accent = rgb('--accent');
      chart = createChart(el.current, {
        autoSize: true,
        localization: { locale: safeLocale() },
        layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: ink3, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 },
        grid: { vertLines: { color: rgb('--line', 0.5) }, horzLines: { color: rgb('--line', 0.5) } },
        rightPriceScale: { borderColor: line },
        timeScale: { borderColor: line, timeVisible: true, secondsVisible: false, rightOffset: 4 },
        crosshair: { mode: CrosshairMode.Normal },
        handleScale: { axisPressedMouseMove: true },
      });
      const c: ISeriesApi<'Candlestick'> = chart.addCandlestickSeries({ upColor: up, downColor: down, wickUpColor: up, wickDownColor: down, borderVisible: false, priceFormat: { type: 'price', precision: prec, minMove: 1 / 10 ** prec } });
      c.setData(data);

      const tIn = wallSec(t.openTime), tOut = wallSec(t.closeTime);
      const iIn = tIn != null ? barAt(times, tIn) : 0, iOut = tOut != null ? barAt(times, tOut) : times.length - 1;
      const long = t.type === 'buy', won = t.net >= 0;
      const marks: SeriesMarker<UTCTimestamp>[] = [
        { time: times[iIn] as UTCTimestamp, position: long ? 'belowBar' : 'aboveBar', color: accent, shape: long ? 'arrowUp' : 'arrowDown', text: `${long ? 'Buy' : 'Sell'} ${t.openPrice}` },
        { time: times[iOut] as UTCTimestamp, position: long ? 'aboveBar' : 'belowBar', color: won ? up : down, shape: 'circle', text: `Exit ${t.closePrice}` },
      ];
      c.setMarkers(marks.sort((a, b) => a.time - b.time));
      // Entry → exit path.
      if (iOut > iIn) {
        const path = chart.addLineSeries({ color: won ? up : down, lineWidth: 2, lineStyle: LineStyle.Dashed, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false });
        path.setData([{ time: times[iIn] as UTCTimestamp, value: t.openPrice }, { time: times[iOut] as UTCTimestamp, value: t.closePrice }]);
      }
      const pl = (price: number | null | undefined, color: string, title: string, style = LineStyle.Dashed) => { if (price) c.createPriceLine({ price, color, lineWidth: 1, lineStyle: style, axisLabelVisible: true, title }); };
      pl(t.openPrice, accent, 'Entry', LineStyle.Solid);
      pl(levels.initSl, down, levels.sl && levels.sl !== levels.initSl ? 'Initial SL' : 'SL');
      if (levels.sl && levels.sl !== levels.initSl) pl(levels.sl, rgb('--loss', 0.6), levels.initSl ? 'Final SL' : 'SL', LineStyle.Dotted);
      pl(levels.tp, up, 'TP');
      pl(levels.proximal, rgb('--warn'), 'Proximal', LineStyle.SparseDotted);
      pl(levels.distal, rgb('--warn', 0.7), 'Distal', LineStyle.SparseDotted);

      const pad = Math.max(25, Math.round((iOut - iIn) * 0.8));
      chart.timeScale().setVisibleLogicalRange({ from: iIn - pad, to: iOut + Math.round(pad * 0.6) });

      const fmt = (x: number) => x.toFixed(prec);
      const show = (i: number) => {
        if (!legend.current || i < 0 || i >= data.length) return;
        const b = data[i], chg = b.close - b.open;
        legend.current.innerHTML = `<span>O <b>${fmt(b.open)}</b></span><span>H <b>${fmt(b.high)}</b></span><span>L <b>${fmt(b.low)}</b></span><span>C <b style="color:${chg >= 0 ? up : down}">${fmt(b.close)}</b></span>`;
      };
      show(iOut);
      chart.subscribeCrosshairMove(p => { if (p.logical != null) show(Math.round(p.logical)); else show(iOut); });
    });
    return () => { dead = true; chart?.remove(); };
  }, [t, s, levels, theme, tz]);
  return (
    <div className={cx('relative', full ? 'flex-1 min-h-0' : 'h-[340px] md:h-[440px]')}>
      <div ref={legend} className="absolute left-2 top-1 z-10 flex gap-2.5 text-[11px] num text-ink3 pointer-events-none [&_b]:font-medium [&_b]:text-ink2" />
      <div ref={el} className="absolute inset-0 touch-none" />
    </div>
  );
}

/** Real broker candles around the trade, with the execution drawn on. */
export function TradeChart({ t, levels }: { t: EnrichedTrade; levels: ChartLevels }) {
  const { loading, series } = useTradeBars(t.account, t.symbol);
  const have = TFS.filter(x => series[x]);
  const [tf, setTf] = useState<Tf | null>(null);
  const [full, setFull] = useState(false);
  const [view, setView] = useState<'mine' | 'tv' | null>(null);
  const mobile = useIsMobile();
  const active = tf && series[tf] ? tf : pickTf(t.holdSec, have);
  const mode = view ?? (active || loading ? 'mine' : 'tv');
  const tvTf: Tf = tf ?? active ?? pickTf(t.holdSec, [...TFS]) ?? 'H1';
  const lv = useMemo<Lv>(() => ({ ...levels, sl: lvl(levels.sl), tp: lvl(levels.tp), initSl: lvl(levels.initSl) ?? lvl(levels.sl) }), [JSON.stringify(levels)]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { setTf(null); setView(null); }, [t.id]);
  useEffect(() => {
    if (!full) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [full]);

  const short = (x: Tf) => (mobile ? x.replace('M', '').replace('H', 'h').replace('D1', 'D') : x);
  const tfOpts: Tf[] = mode === 'tv' ? [...TFS] : have;
  const tfValue = mode === 'tv' ? tvTf : active;
  const tfs = tfValue && tfOpts.length > 1 && <Segmented label="Timeframe" size="sm" value={tfValue} onChange={v => setTf(v)} options={tfOpts.map(x => ({ value: x, label: short(x) }))} />;
  const views = <Segmented label="Chart source" size="sm" value={mode} onChange={v => setView(v)} options={[{ value: 'mine', label: 'My execution' }, { value: 'tv', label: 'TradingView' }]} />;
  const mine = loading ? <div className="h-[340px] md:h-[440px] grid place-items-center text-[13px] text-ink3">Loading candles…</div>
    : !active ? (
      <div className="rounded-xl bg-raised/50 border border-line p-4 text-[13px] text-ink2 leading-relaxed">
        <div className="font-semibold text-ink mb-1">No candles for {t.symbol} yet</div>
        Run the RamanFX_Charts script in the terminal this trade came from, then import the CSV it saves. It exports your broker's own candles around every trade, so your entry, exit, stop and target are drawn on exact prices.
        <div className="flex gap-2 flex-wrap mt-3">
          <a className="btn h-9" href="/tools/RamanFX_Charts.mq5" download><Icon name="download" size={14} />MT5 script</a>
          <a className="btn h-9" href="/tools/RamanFX_Charts.mq4" download><Icon name="download" size={14} />MT4 script</a>
          <a className="btn-ghost h-9 text-accent" href="/guide?s=charts">How to</a>
        </div>
      </div>
    ) : <Chart key={`${t.id}${active}${full}`} t={t} s={series[active]!} levels={lv} full={full} />;
  const body = mode === 'tv'
    ? <><TvWidget symbol={tvSymbol(t.sym)} tf={tvTf} className={full ? 'flex-1 min-h-0' : 'h-[420px] md:h-[520px]'} />{!full && <p className="text-[11.5px] text-ink3 mt-2">Live TradingView data ({tvSymbol(t.sym)}) — scroll back to {t.openTime.slice(0, 10)}. It can't draw your fills; use My execution for that. Prices can differ slightly from your broker.</p>}</>
    : mine;
  const canFull = mode === 'tv' || !!active;

  if (full && canFull) return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] bg-bg flex flex-col p-2 pt-[max(8px,env(safe-area-inset-top))] pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2 px-1 pb-2 flex-wrap">
        <span className="font-mono font-semibold">{t.symbol}</span>
        <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">{views}{tfs}<button className="btn h-9 w-9 px-0" aria-label="Close full screen" onClick={() => setFull(false)}><Icon name="x" size={16} /></button></div>
      </div>
      {body}
    </motion.div>,
    document.body,
  );
  return (
    <Card aria-label="Trade chart">
      <CardHead title="Trade chart" sub={mode === 'mine' && active ? `${t.symbol} · your broker's candles · your time zone` : 'Where the trade was executed, on real candles'}
        />
      <div className="flex flex-wrap items-center gap-2 mb-3 -mt-1">{views}{tfs}{canFull && <button className="btn h-9 w-9 px-0 ml-auto" aria-label="Full screen" onClick={() => setFull(true)}><Icon name="grid" size={15} /></button>}</div>
      {body}
    </Card>
  );
}
