import { TV_INTERVAL } from '@/core/tvSymbol';
import { deviceTz } from '@/core/time';
import { useStore } from '@/data/store';
import { cx } from './kit';
import { TvEmbed } from './TvEmbed';

/**
 * TradingView's official advanced chart: live data, drawing tools, indicators, symbol search.
 * `panels` adds the details / hotlist / watchlist side panels (wide screens).
 */
export function TvWidget({ symbol, tf = 'H1', className, watchlist, panels = false, bare = false }: { symbol: string; tf?: string; className?: string; watchlist?: string[]; panels?: boolean; bare?: boolean }) {
  const tz = useStore(st => st.userTz) || deviceTz();
  useStore(st => st.theme); // re-read colours on theme change
  const css = (v: string) => `rgb(${getComputedStyle(document.documentElement).getPropertyValue(v).trim().split(/\s+/).join(',')})`;
  return (
    <div className={cx(className?.includes('absolute') ? '' : 'relative', 'overflow-hidden', !bare && 'rounded-xl border border-line', className)}>
      <TvEmbed title={`TradingView chart ${symbol}`} script="embed-widget-advanced-chart.js" className="absolute inset-0"
        config={{
          autosize: true, symbol, interval: TV_INTERVAL[tf] ?? tf, timezone: tz, style: '1',
          allow_symbol_change: true, calendar: false, hide_side_toolbar: false, hide_top_toolbar: false, hide_legend: false, hide_volume: false,
          details: panels, hotlist: panels, watchlist: watchlist ?? [], withdateranges: true, save_image: true,
          backgroundColor: css('--surface'), gridColor: css('--line'), studies: [], compareSymbols: [], support_host: 'https://www.tradingview.com',
        }} />
    </div>
  );
}
