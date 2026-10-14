import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore } from '@/data/store';
import { Card, cx, Page, Segmented } from '@/ui/kit';

const COUNTRIES: [string, string][] = [['us', 'USD'], ['eu', 'EUR'], ['gb', 'GBP'], ['jp', 'JPY'], ['ca', 'CAD'], ['au', 'AUD'], ['nz', 'NZD'], ['ch', 'CHF'], ['cn', 'CNY']];
const IMPORTANCE = { high: '1', med: '0,1', all: '-1,0,1' } as const;
type Imp = keyof typeof IMPORTANCE;
const KEY = 'rfx_news_filters';
const load = (): { imp: Imp; cc: string[] } => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? ''); if (v?.cc?.length) return v; } catch { /* default */ } return { imp: 'med', cc: ['us', 'eu', 'gb', 'jp', 'au', 'nz'] }; };

/** TradingView's economic calendar — check it before every day trade (Set & Forget PDF: wait for the initial spike). */
export default function News() {
  const theme = useStore(s => s.theme);
  const [f, setF] = useState(load);
  const save = (v: typeof f) => { setF(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };
  const src = useMemo(() => {
    const cfg = { colorTheme: theme, isTransparent: true, width: '100%', height: '100%', locale: 'en', importanceFilter: IMPORTANCE[f.imp], countryFilter: f.cc.join(',') };
    return `https://www.tradingview-widget.com/embed-widget/events/?locale=en#${encodeURIComponent(JSON.stringify(cfg))}`;
  }, [theme, f]);
  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Economic calendar</h2>
        <p className="text-[13px] text-ink3 mt-1">Day traders: know when data drops and wait for the initial spike before placing a trade. Times follow your device's time zone.</p>
      </motion.div>
      <Card className="flex flex-col gap-3">
        <Segmented label="Importance" size="sm" value={f.imp} onChange={imp => save({ ...f, imp })} options={[{ value: 'high', label: 'High only' }, { value: 'med', label: 'Medium +' }, { value: 'all', label: 'All' }]} />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Currencies">
          {COUNTRIES.map(([c, l]) => {
            const on = f.cc.includes(c);
            return <button key={c} aria-pressed={on} onClick={() => { const cc = on ? f.cc.filter(x => x !== c) : [...f.cc, c]; if (cc.length) save({ ...f, cc }); }} className={cx('chip h-8 touch:h-9 text-[12px] font-mono', on && '!bg-accent/15 !text-accent !border-accent/40')}>{l}</button>;
          })}
        </div>
      </Card>
      <Card className="p-0 overflow-hidden">
        <div className="h-[calc(100dvh-300px)] min-h-[520px]"><iframe key={src} src={src} title="Economic calendar" className="w-full h-full" /></div>
      </Card>
    </Page>
  );
}
