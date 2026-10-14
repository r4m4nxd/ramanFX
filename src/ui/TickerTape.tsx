import { useTopSymbols } from '@/data/topSymbols';
import { tvSymbol } from '@/core/tvSymbol';
import { useIsMobile } from './kit';
import { TvEmbed } from './TvEmbed';

/** Live prices for your most-traded symbols (Pepperstone feed). The widget sets its own height. */
export function TickerTape() {
  const top = useTopSymbols(8);
  const mobile = useIsMobile();
  const syms = top.length ? top : ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'NAS100', 'BTCUSD'];
  return (
    <TvEmbed auto title="Live prices" script="embed-widget-ticker-tape.js" className="rounded-xl border border-line min-h-[44px]"
      config={{ symbols: syms.map(s => ({ proName: tvSymbol(s), title: s })), showSymbolLogo: !mobile, displayMode: mobile ? 'compact' : 'adaptive' }} />
  );
}
