import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { IChartApi, ISeriesApi, SeriesMarker, UTCTimestamp } from 'lightweight-charts';
import { pickTf, type Series, type Tf, TF_SEC, TFS, wallSec, wallShifter } from '@/core/bars';
import type { DrawKind, Drawing } from '@/core/types';
import { DrawLayer, type DrawState, timeAxis } from './chartDraw';
import { deviceTz } from '@/core/time';
import { useTradeBars } from '@/data/bars';
import { useStore } from '@/data/store';
import type { EnrichedTrade } from '@/core/stats';
import { Card, CardHead, cx, lockScroll, Segmented, useIsMobile } from './kit';
import { Icon } from './Icon';
import { tvSymbol } from '@/core/tvSymbol';
import { TvWidget } from './TvWidget';
import { TvFullscreen } from './TvFullscreen';

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

function Chart({ t, s, tf, levels, full, drawings, tool, color, onAdd }: { t: EnrichedTrade; s: Series; tf: Tf; levels: Lv; full: boolean; drawings: Drawing[]; tool: DrawKind | null; color: string; onAdd: (d: Drawing) => void }) {
  const el = useRef<HTMLDivElement>(null), legend = useRef<HTMLDivElement>(null);
  const theme = useStore(st => st.theme), tz = useStore(st => st.userTz) || deviceTz();
  const st = useRef<DrawState>({ drawings, pending: null, preview: null });
  const layer = useRef<DrawLayer | null>(null);
  const live = useRef({ tool, color, onAdd });
  live.current = { tool, color, onAdd };
  useEffect(() => {
    st.current.drawings = drawings;
    if (!tool || st.current.pending?.kind !== tool) { st.current.pending = null; st.current.preview = null; }
    layer.current?.refresh();
  }, [drawings, tool]);
  useEffect(() => {
    let chart: IChartApi | null = null, dead = false, unlisten = () => {};
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

      // Drawing layer: clicks place points while a tool is active.
      const axis = timeAxis(s.t, TF_SEC[tf]);
      const dl = new DrawLayer(st.current, axis, x => x.toFixed(prec));
      c.attachPrimitive(dl);
      layer.current = dl;
      const at = (pt: { x: number; y: number }) => {
        const l = chart!.timeScale().coordinateToLogical(pt.x), p = c.coordinateToPrice(pt.y);
        return l == null || p == null ? null : { t: axis.toTime(l), p: +p.toFixed(prec) };
      };
      const onTap = (pt: { x: number; y: number }) => {
        const { tool: k, color, onAdd } = live.current;
        if (!k) return;
        const q = at(pt);
        if (!q) return;
        const id = `d_${Date.now().toString(36)}`;
        if (k === 'hline' || k === 'text') {
          const text = k === 'text' ? window.prompt('Note text')?.trim() : undefined;
          if (k === 'text' && !text) return;
          onAdd({ id, kind: k, a: q, color, text });
          return;
        }
        const S = st.current;
        if (!S.pending) { S.pending = { id, kind: k, a: q, color }; S.preview = q; dl.refresh(); return; }
        const d: Drawing = { ...S.pending, b: q };
        S.pending = null; S.preview = null;
        onAdd(d);
      };
      // Taps straight from the pointer: the chart's own click events drop a quick second tap.
      const host = el.current;
      let press: { x: number; y: number; at: number } | null = null;
      const pd = (e: PointerEvent) => { press = { x: e.clientX, y: e.clientY, at: Date.now() }; };
      const pu = (e: PointerEvent) => {
        if (!press || !live.current.tool) return;
        const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y), long = Date.now() - press.at;
        press = null;
        if (moved > 8 || long > 700) return; // a pan or a press, not a tap
        const r = host.getBoundingClientRect();
        if (e.clientX - r.left > chart!.timeScale().width()) return; // on the price axis
        onTap({ x: e.clientX - r.left, y: e.clientY - r.top });
      };
      host.addEventListener('pointerdown', pd);
      host.addEventListener('pointerup', pu);
      unlisten = () => { host.removeEventListener('pointerdown', pd); host.removeEventListener('pointerup', pu); };

      const pad = Math.max(25, Math.round((iOut - iIn) * 0.8));
      chart.timeScale().setVisibleLogicalRange({ from: iIn - pad, to: iOut + Math.round(pad * 0.6) });

      const fmt = (x: number) => x.toFixed(prec);
      const show = (i: number) => {
        if (!legend.current || i < 0 || i >= data.length) return;
        const b = data[i], chg = b.close - b.open;
        legend.current.innerHTML = `<span>O <b>${fmt(b.open)}</b></span><span>H <b>${fmt(b.high)}</b></span><span>L <b>${fmt(b.low)}</b></span><span>C <b style="color:${chg >= 0 ? up : down}">${fmt(b.close)}</b></span>`;
      };
      show(iOut);
      chart.subscribeCrosshairMove(p => {
        if (p.logical != null) show(Math.round(p.logical)); else show(iOut);
        if (st.current.pending && p.point) { st.current.preview = at(p.point); dl.refresh(); }
      });
    });
    return () => { dead = true; unlisten(); layer.current = null; chart?.remove(); };
  }, [t, s, tf, levels, theme, tz]);
  return (
    <div className={cx('relative', full ? 'flex-1 min-h-0' : 'h-[340px] md:h-[440px]')}>
      <div ref={legend} className="absolute left-2 top-1 z-10 flex gap-2.5 text-[11px] num text-ink3 pointer-events-none [&_b]:font-medium [&_b]:text-ink2" />
      <div ref={el} className={cx('absolute inset-0 touch-none', tool && 'cursor-crosshair')} />
    </div>
  );
}

/** Real broker candles around the trade, with the execution drawn on. */
const TOOLS: { k: DrawKind; label: string; hint: string }[] = [
  { k: 'hline', label: '— Line', hint: 'Tap a price' }, { k: 'trend', label: '╱ Trend', hint: 'Tap two points' },
  { k: 'rect', label: '▭ Zone', hint: 'Tap two opposite corners' }, { k: 'text', label: 'T Note', hint: 'Tap where the note goes' },
];
const COLORS = ['--accent', '--warn', '--profit', '--loss', '--violet'];
const KIND: Record<DrawKind, string> = { hline: 'Line', trend: 'Trend', rect: 'Zone', text: 'Note' };

export function TradeChart({ t, levels, drawings = [], onDrawings }: { t: EnrichedTrade; levels: ChartLevels; drawings?: Drawing[]; onDrawings?: (d: Drawing[]) => void }) {
  const [tool, setTool] = useState<DrawKind | null>(null);
  const [colorVar, setColorVar] = useState(COLORS[0]);
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
  useEffect(() => { setTf(null); setView(null); setTool(null); }, [t.id]);
  useEffect(() => {
    if (!full) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setFull(false); };
    window.addEventListener('keydown', k); const unlock = lockScroll();
    return () => { window.removeEventListener('keydown', k); unlock(); };
  }, [full]);

  const short = (x: Tf) => (mobile ? x.replace('M', '').replace('H', 'h').replace('D1', 'D') : x);
  const tfOpts: Tf[] = mode === 'tv' ? [...TFS] : have;
  const tfValue = mode === 'tv' ? tvTf : active;
  const tfs = tfValue && tfOpts.length > 1 && <Segmented label="Timeframe" size="sm" value={tfValue} onChange={v => setTf(v)} options={tfOpts.map(x => ({ value: x, label: short(x) }))} />;
  const views = <Segmented label="Chart source" size="sm" value={mode} onChange={v => setView(v)} options={[{ value: 'mine', label: 'My execution' }, { value: 'tv', label: 'TradingView' }]} />;
  const mine = loading ? <div className="h-[340px] md:h-[440px] relative rounded-xl bg-raised/40 overflow-hidden" role="status" aria-label="Loading candles">
      <div className="absolute inset-x-6 bottom-10 top-10 flex items-end gap-1.5 opacity-60 motion-safe:animate-pulse" aria-hidden>
        {[38, 52, 46, 61, 57, 70, 64, 48, 55, 42, 50, 66, 73, 60, 68, 58, 49, 62].map((h, i) => <span key={i} className="flex-1 rounded-sm bg-line2" style={{ height: `${h}%` }} />)}
      </div>
      <span className="absolute left-4 top-3 text-[12px] text-ink3">Loading candles…</span>
    </div>
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
    ) : <Chart key={`${t.id}${active}${full}`} t={t} s={series[active]!} tf={active} levels={lv} full={full} drawings={drawings} tool={tool} color={rgb(colorVar)}
        onAdd={d => { onDrawings?.([...drawings, d]); setTool(null); }} />;
  const fmtP = (p: number) => String(+p.toFixed(5));
  const drawBar = mode === 'mine' && active && onDrawings && (
    <div className="flex flex-col gap-2 mb-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {TOOLS.map(x => <button key={x.k} aria-pressed={tool === x.k} onClick={() => setTool(tool === x.k ? null : x.k)} className={cx('chip h-8 touch:h-9 text-[12px]', tool === x.k && '!bg-accent/15 !text-accent !border-accent/40')}>{x.label}</button>)}
        <span className="flex items-center gap-1 ml-1" role="radiogroup" aria-label="Colour">
          {COLORS.map(c => <button key={c} role="radio" aria-checked={colorVar === c} aria-label={c.slice(2)} onClick={() => setColorVar(c)} className={cx('w-6 h-6 touch:w-8 touch:h-8 rounded-full grid place-items-center border-2', colorVar === c ? 'border-ink' : 'border-transparent')}><span className="w-3.5 h-3.5 rounded-full" style={{ background: rgb(c) }} /></button>)}
        </span>
      </div>
      {tool && <div className="text-[12px] text-accent">{TOOLS.find(x => x.k === tool)?.hint} on the chart · tap the tool again to cancel</div>}
    </div>
  );
  const drawList = mode === 'mine' && active && onDrawings && drawings.length > 0 && (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {drawings.map(d => (
        <span key={d.id} className="chip h-8 touch:h-9 text-[12px] gap-1.5 pr-1">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
          {KIND[d.kind]} {d.text ? `“${d.text}”` : ''} <span className="num text-ink3">{d.kind === 'rect' || d.kind === 'trend' ? `${fmtP(d.a.p)}–${fmtP(d.b?.p ?? d.a.p)}` : d.kind === 'hline' ? fmtP(d.a.p) : ''}</span>
          <button aria-label={`Delete ${KIND[d.kind]}`} className="w-6 h-6 touch:w-8 touch:h-8 grid place-items-center text-ink3 hover:text-loss" onClick={() => onDrawings(drawings.filter(x => x.id !== d.id))}><Icon name="x" size={12} /></button>
        </span>
      ))}
      <button className="btn-ghost h-8 text-[12px] text-ink3" onClick={() => { if (window.confirm('Delete all drawings on this trade?')) onDrawings([]); }}>Clear all</button>
    </div>
  );
  const body = mode === 'tv'
    ? <><TvWidget symbol={tvSymbol(t.symbol)} tf={tvTf} className={full ? 'flex-1 min-h-0' : 'h-[70dvh] min-h-[420px] md:h-[520px]'} />{!full && <p className="text-[11.5px] text-ink3 mt-2">Pepperstone feed on TradingView ({tvSymbol(t.symbol)}) — scroll back to {t.openTime.slice(0, 10)}. Draw with the tools on the left; use My execution to see your fills.</p>}</>
    : mine;
  const canFull = mode === 'tv' || !!active;

  if (full && mode === 'tv' && mobile) return (
    <TvFullscreen title={t.symbol} onClose={() => setFull(false)}>
      <TvWidget bare symbol={tvSymbol(t.symbol)} tf={tvTf} className="absolute inset-0" />
    </TvFullscreen>
  );
  if (full && canFull) return createPortal(
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[80] bg-bg flex flex-col p-2 pt-[max(8px,env(safe-area-inset-top))] pb-[max(8px,env(safe-area-inset-bottom))]">
      <div className="flex items-center gap-2 px-1 pb-2 flex-wrap">
        <span className="font-mono font-semibold">{t.symbol}</span>
        <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">{views}{tfs}<button className="btn h-9 w-9 px-0" aria-label="Close full screen" onClick={() => setFull(false)}><Icon name="x" size={16} /></button></div>
      </div>
      {drawBar}
      {body}
      {drawList}
    </motion.div>,
    document.body,
  );
  return (
    <Card aria-label="Trade chart">
      <CardHead title="Trade chart" sub={mode === 'mine' && active ? `${t.symbol} · your broker's candles · your time zone` : 'Where the trade was executed, on real candles'}
        />
      <div className="flex flex-wrap items-center gap-2 mb-3 -mt-1">{views}{tfs}{canFull && <button className="btn h-9 w-9 px-0 ml-auto" aria-label="Full screen" onClick={() => setFull(true)}><Icon name="grid" size={15} /></button>}</div>
      {drawBar}
      {body}
      {drawList}
    </Card>
  );
}
