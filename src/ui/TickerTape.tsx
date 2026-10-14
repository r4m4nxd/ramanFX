import { useTopSymbols } from '@/data/topSymbols';
import { tvSymbol } from '@/core/tvSymbol';
import { TvEmbed } from './TvEmbed';

/** Live prices for your most-traded symbols (Pepperstone feed). */
export function TickerTape() {
  const top = useTopSymbols(8);
  const syms = top.length ? top : ['XAUUSD', 'EURUSD', 'GBPUSD', 'USDJPY', 'NAS100', 'BTCUSD'];
  return (
    <TvEmbed title="Live prices" script="embed-widget-ticker-tape.js" className="h-[46px] rounded-xl border border-line"
      config={{ symbols: syms.map(s => ({ proName: tvSymbol(s), title: s })), showSymbolLogo: true, displayMode: 'adaptive' }} />
  );
}
