import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTopSymbols } from '@/data/topSymbols';
import { tvSymbol } from '@/core/tvSymbol';
import { Card, cx, Page, Segmented, Tabs } from '@/ui/kit';
import { TvEmbed } from '@/ui/TvEmbed';

const COUNTRIES: [string, string][] = [['us', 'USD'], ['eu', 'EUR'], ['gb', 'GBP'], ['jp', 'JPY'], ['ca', 'CAD'], ['au', 'AUD'], ['nz', 'NZD'], ['ch', 'CHF'], ['cn', 'CNY']];
const CCYS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF'];
const IMPORTANCE = { high: '1', med: '0,1', all: '-1,0,1' } as const;
type Imp = keyof typeof IMPORTANCE;
type View = 'calendar' | 'news' | 'heat';
const KEY = 'rfx_news_filters';
const load = (): { imp: Imp; cc: string[] } => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? ''); if (v?.cc?.length) return v; } catch { /* default */ } return { imp: 'med', cc: ['us', 'eu', 'gb', 'jp', 'au', 'nz'] }; };
const H = 'h-[calc(100dvh-330px)] min-h-[560px]';

/** Economic calendar (Set & Forget PDF: day traders wait for the initial spike), symbol news and currency strength. */
export default function News() {
  const [view, setView] = useState<View>('calendar');
  const [f, setF] = useState(load);
  const save = (v: typeof f) => { setF(v); try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };
  const top = useTopSymbols(8);
  const [sym, setSym] = useState<string | null>(null);
  const activeSym = sym ?? 'all';
  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">News & calendar</h2>
        <p className="text-[13px] text-ink3 mt-1">Day traders: know when data drops and wait for the initial spike before placing a trade. Times follow your device's time zone.</p>
      </motion.div>
      <Tabs label="View" value={view} onChange={setView} options={[{ value: 'calendar', label: 'Calendar' }, { value: 'news', label: 'News' }, { value: 'heat', label: 'Currency strength' }]} />
      {view === 'calendar' && (
        <>
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
            <TvEmbed fit title="Economic calendar" script="embed-widget-events.js" className={H} config={{ importanceFilter: IMPORTANCE[f.imp], countryFilter: f.cc.join(',') }} />
          </Card>
        </>
      )}
      {view === 'news' && (
        <>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="News for">
            {['all', ...top].map(s => <button key={s} aria-pressed={s === activeSym} onClick={() => setSym(s === 'all' ? null : s)} className={cx('chip h-8 touch:h-9 text-[12px]', s !== 'all' && 'font-mono', s === activeSym && '!bg-accent/15 !text-accent !border-accent/40')}>{s === 'all' ? 'All markets' : s}</button>)}
          </div>
          <Card className="p-0 overflow-hidden">
            <TvEmbed fit title="News" script="embed-widget-timeline.js" className={H}
              config={activeSym === 'all' ? { feedMode: 'all_symbols', displayMode: 'regular' } : { feedMode: 'symbol', symbol: tvSymbol(activeSym), displayMode: 'regular' }} />
          </Card>
        </>
      )}
      {view === 'heat' && (
        <>
          <p className="text-[13px] text-ink3 -mt-1">Each cell is the row currency against the column currency today. Strong row + weak column = a pair moving with momentum — check it against your HTF trend, never instead of it.</p>
          <Card className="p-0 overflow-hidden">
            <TvEmbed fit title="Currency strength" script="embed-widget-forex-heat-map.js" className={H} config={{ currencies: CCYS }} />
          </Card>
        </>
      )}
    </Page>
  );
}
