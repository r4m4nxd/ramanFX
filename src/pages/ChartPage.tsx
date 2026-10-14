import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTopSymbols } from '@/data/topSymbols';
import { tvSymbol } from '@/core/tvSymbol';
import { Card, CardHead, cx, Page, useIsMobile } from '@/ui/kit';
import { TvEmbed } from '@/ui/TvEmbed';
import { TvWidget } from '@/ui/TvWidget';

/** Full TradingView chart with drawing tools and indicators, plus headlines for the symbol on screen. */
export default function ChartPage() {
  const top = useTopSymbols(8);
  const [sym, setSym] = useState<string | null>(null);
  const mobile = useIsMobile();
  const active = sym ?? top[0] ?? 'XAUUSD';
  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Advanced chart</h2>
        <p className="text-[13px] text-ink3 mt-1">Full TradingView chart on Pepperstone prices — drawing tools on the left, indicators and timeframes on top, your symbols in the watchlist.</p>
      </motion.div>
      {top.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Your symbols">
          {top.map(s => <button key={s} aria-pressed={s === active} onClick={() => setSym(s)} className={cx('chip h-8 touch:h-9 text-[12px] font-mono', s === active && '!bg-accent/15 !text-accent !border-accent/40')}>{s}</button>)}
        </div>
      )}
      <TvWidget symbol={tvSymbol(active)} tf="H4" watchlist={top.map(tvSymbol)} panels={!mobile} className="h-[calc(100dvh-250px)] min-h-[480px]" />
      <Card className="p-0 overflow-hidden">
        <div className="p-5 pb-3"><CardHead title={`${active} news`} sub="Breaking headlines for this symbol — the calendar only covers scheduled data" /></div>
        <TvEmbed fit title={`${active} news`} script="embed-widget-timeline.js" className="h-[460px]" config={{ feedMode: 'symbol', symbol: tvSymbol(active), displayMode: 'regular' }} />
      </Card>
    </Page>
  );
}
