import { useEffect, useRef } from 'react';
import { TV_INTERVAL } from '@/core/tvSymbol';
import { deviceTz } from '@/core/time';
import { useStore } from '@/data/store';
import { cx } from './kit';

/**
 * TradingView's official advanced chart embed (embed-widget-advanced-chart.js): live data, drawing tools,
 * indicators, symbol search. `panels` adds the details / hotlist / watchlist side panels (wide screens).
 */
export function TvWidget({ symbol, tf = 'H1', className, watchlist, panels = false }: { symbol: string; tf?: string; className?: string; watchlist?: string[]; panels?: boolean }) {
  const theme = useStore(st => st.theme), tz = useStore(st => st.userTz) || deviceTz();
  const box = useRef<HTMLDivElement>(null);
  const wl = (watchlist ?? []).join(',');
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const css = (v: string) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue(v).trim().split(/\s+/).join(',')})`;
    const cfg = {
      autosize: true, symbol, interval: TV_INTERVAL[tf] ?? tf, timezone: tz, theme, style: '1', locale: 'en',
      allow_symbol_change: true, calendar: false, hide_side_toolbar: false, hide_top_toolbar: false, hide_legend: false, hide_volume: false,
      details: panels, hotlist: panels, watchlist: wl ? wl.split(',') : [], withdateranges: true, save_image: true,
      backgroundColor: css('--surface'), gridColor: css('--line'), studies: [], compareSymbols: [], support_host: 'https://www.tradingview.com',
    };
    el.innerHTML = '';
    const w = document.createElement('div');
    w.className = 'tradingview-widget-container__widget';
    w.style.cssText = 'height:100%;width:100%';
    const s = document.createElement('script');
    s.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    s.async = true;
    s.type = 'text/javascript';
    s.textContent = JSON.stringify(cfg);
    el.append(w, s);
    return () => { el.innerHTML = ''; };
  }, [symbol, tf, theme, tz, wl, panels]);
  return <div className={cx('relative rounded-xl overflow-hidden border border-line', className)}><div ref={box} className="tradingview-widget-container absolute inset-0" /></div>;
}
