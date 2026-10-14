import { useMemo } from 'react';
import { TV_INTERVAL } from '@/core/tvSymbol';
import { deviceTz } from '@/core/time';
import { useStore } from '@/data/store';
import { cx } from './kit';

/** TradingView's free advanced chart embed: live data, drawing tools on the left, indicators, symbol search. */
export function TvWidget({ symbol, tf = 'H1', className }: { symbol: string; tf?: string; className?: string }) {
  const theme = useStore(st => st.theme), tz = useStore(st => st.userTz) || deviceTz();
  const src = useMemo(() => {
    const hex = (v: string) => '#' + getComputedStyle(document.documentElement).getPropertyValue(v).trim().split(/\s+/).map(n => (+n).toString(16).padStart(2, '0')).join('');
    const bg = hex('--surface'), grid = hex('--line'), up = hex('--profit'), down = hex('--loss');
    const cfg = {
      width: '100%', height: '100%', autosize: true, symbol, interval: TV_INTERVAL[tf] ?? tf, timezone: tz, theme, style: '1', locale: 'en',
      hide_side_toolbar: false, hide_top_toolbar: false, withdateranges: true, allow_symbol_change: true, save_image: true, calendar: false,
      backgroundColor: bg, gridColor: grid,
      overrides: { 'paneProperties.background': bg, 'paneProperties.backgroundType': 'solid', 'paneProperties.vertGridProperties.color': grid, 'paneProperties.horzGridProperties.color': grid,
        'mainSeriesProperties.candleStyle.upColor': up, 'mainSeriesProperties.candleStyle.downColor': down, 'mainSeriesProperties.candleStyle.borderUpColor': up, 'mainSeriesProperties.candleStyle.borderDownColor': down,
        'mainSeriesProperties.candleStyle.wickUpColor': up, 'mainSeriesProperties.candleStyle.wickDownColor': down },
    };
    return `https://www.tradingview-widget.com/embed-widget/advanced-chart/?locale=en#${encodeURIComponent(JSON.stringify(cfg))}`;
  }, [symbol, tf, theme, tz]);
  return (
    <div className={cx('relative rounded-xl overflow-hidden border border-line', className)}>
      <iframe key={src} src={src} title={`TradingView chart ${symbol}`} className="absolute inset-0 w-full h-full" allow="fullscreen; clipboard-write" />
    </div>
  );
}
