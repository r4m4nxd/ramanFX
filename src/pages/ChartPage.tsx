import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore } from '@/data/store';
import { bareSymbol, tvSymbol } from '@/core/tvSymbol';
import { Page, useIsMobile } from '@/ui/kit';
import { TvWidget } from '@/ui/TvWidget';

/** Full TradingView chart with drawing tools and indicators; opens on your most-traded symbol. */
export default function ChartPage() {
  const trades = useStore(s => s.trades);
  const top = useMemo(() => {
    const n: Record<string, number> = {};
    for (const t of trades) { const s = bareSymbol(t.symbol); n[s] = (n[s] ?? 0) + 1; }
    return Object.entries(n).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s]) => s);
  }, [trades]);
  const [sym, setSym] = useState<string | null>(null);
  const mobile = useIsMobile();
  const active = sym ?? top[0] ?? 'XAUUSD';
  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Advanced chart</h2>
        <p className="text-[13px] text-ink3 mt-1">Full TradingView chart — drawing tools on the left, indicators and timeframes on top, your symbols in the watchlist. Use it to map your HTF zones.</p>
      </motion.div>
      {top.length > 1 && (
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Your symbols">
          {top.map(s => <button key={s} aria-pressed={s === active} onClick={() => setSym(s)} className={s === active ? 'chip h-8 touch:h-9 text-[12px] font-mono !bg-accent/15 !text-accent !border-accent/40' : 'chip h-8 touch:h-9 text-[12px] font-mono'}>{s}</button>)}
        </div>
      )}
      <TvWidget symbol={tvSymbol(active)} tf="H4" watchlist={top.map(tvSymbol)} panels={!mobile} className="h-[calc(100dvh-250px)] min-h-[480px]" />
    </Page>
  );
}
