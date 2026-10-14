import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTopSymbols } from '@/data/topSymbols';
import { tvSymbol } from '@/core/tvSymbol';
import { Card, CardHead, cx, Page, useIsMobile } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { TvEmbed } from '@/ui/TvEmbed';
import { TvFullscreen } from '@/ui/TvFullscreen';
import { TvWidget } from '@/ui/TvWidget';

/** Full TradingView chart with drawing tools and indicators, plus headlines for the symbol on screen. */
export default function ChartPage() {
  const top = useTopSymbols(8);
  const [sym, setSym] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const mobile = useIsMobile();
  const active = sym ?? top[0] ?? 'XAUUSD';
  const picker = top.length > 1 && (
    <select aria-label="Symbol" className="field h-10 w-auto font-mono font-semibold pr-8" value={active} onChange={e => setSym(e.target.value)}>
      {top.map(s => <option key={s}>{s}</option>)}
    </select>
  );
  return (
    <Page>
      {!mobile && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Advanced chart</h2>
          <p className="text-[13px] text-ink3 mt-1">Full TradingView chart on Pepperstone prices — drawing tools on the left, indicators and timeframes on top, your symbols in the watchlist.</p>
        </motion.div>
      )}
      {mobile ? (
        <div className="flex items-center gap-2">
          {picker}
          <button className="btn-primary h-10 ml-auto" onClick={() => setFull(true)}><Icon name="grid" size={15} />Full screen</button>
        </div>
      ) : top.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Your symbols">
          {top.map(s => <button key={s} aria-pressed={s === active} onClick={() => setSym(s)} className={cx('chip h-8 touch:h-9 text-[12px] font-mono', s === active && '!bg-accent/15 !text-accent !border-accent/40')}>{s}</button>)}
        </div>
      )}
      {/* Phone: fill the screen between the header and the tab bar, portrait, like the TradingView app. */}
      {!full && <TvWidget symbol={tvSymbol(active)} tf="H4" watchlist={top.map(tvSymbol)} panels={!mobile} className={mobile ? 'h-[calc(100dvh-262px-env(safe-area-inset-bottom))] min-h-[420px]' : 'h-[calc(100dvh-250px)] min-h-[480px]'} />}
      {full && (
        <TvFullscreen title={active} onClose={() => setFull(false)} controls={picker}>
          <TvWidget bare symbol={tvSymbol(active)} tf="H4" watchlist={top.map(tvSymbol)} className="absolute inset-0" />
        </TvFullscreen>
      )}
      <Card className="p-0 overflow-hidden">
        <div className="p-5 pb-3"><CardHead title={`${active} news`} sub="Breaking headlines for this symbol — the calendar only covers scheduled data" /></div>
        <TvEmbed fit title={`${active} news`} script="embed-widget-timeline.js" className="h-[460px]" config={{ feedMode: 'symbol', symbol: tvSymbol(active), displayMode: 'regular' }} />
      </Card>
    </Page>
  );
}
