import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFiltered } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats, normTag, type EnrichedTrade } from '@/core/stats';
import { specFor } from '@/core/instruments';
import { fmtHold } from '@/core/time';
import { pct, price, rMult, shortDate, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Segmented, useIsMobile } from '@/ui/kit';
import { TRADE_ORDER_KEY, TradeList } from '@/ui/TradeList';
import { Icon } from '@/ui/Icon';

type SortKey = 'close' | 'sym' | 'net' | 'r' | 'volume' | 'hold';
type Side = 'all' | 'buy' | 'sell';
type Outcome = 'all' | 'win' | 'loss';
type Review = 'all' | 'todo' | 'mistakes';

const SORT_KEYS: SortKey[] = ['close', 'sym', 'net', 'r', 'volume', 'hold'];
const SORT_LABEL: Record<SortKey, string> = { close: 'Close time', sym: 'Symbol', net: 'Net P&L', r: 'R multiple', volume: 'Lots', hold: 'Hold time' };
const pick = <T extends string>(v: string | null, ok: readonly T[], d: T): T => (v && (ok as readonly string[]).includes(v) ? (v as T) : d);

export default function Trades() {
  const et = useFiltered();
  const notes = useStore(s => s.notes);
  const overrides = useStore(s => s.overrides);
  const fmt = useMoney();
  const nav = useNavigate();
  const mobile = useIsMobile();
  const [params, setParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);
  const [showFilters, setShowFilters] = useState(false);

  // All filter + sort state lives in the URL, so it survives opening a trade and coming back.
  const q = params.get('q') ?? '';
  const symbol = params.get('symbol') ?? '';
  const tag = params.get('tag') ?? '';
  const side = pick<Side>(params.get('side'), ['all', 'buy', 'sell'], 'all');
  const outcome = pick<Outcome>(params.get('outcome'), ['all', 'win', 'loss'], 'all');
  const review = pick<Review>(params.get('review'), ['all', 'todo', 'mistakes'], 'all');
  const [sk, sd] = (params.get('sort') ?? 'close-desc').split('-');
  const sort = { k: pick<SortKey>(sk, SORT_KEYS, 'close'), dir: (sd === 'asc' ? 1 : -1) as 1 | -1 };
  const limit = Math.max(100, parseInt(params.get('n') ?? '', 10) || 100);

  const update = (patch: Record<string, string>) => {
    const p = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) { if (v) p.set(k, v); else p.delete(k); }
    setParams(p, { replace: true });
  };
  const setParam = (k: string, v: string) => update({ [k]: v });
  const setSort = (k: SortKey, dir: 1 | -1) => update({ sort: k === 'close' && dir === -1 ? '' : `${k}-${dir === 1 ? 'asc' : 'desc'}` });

  const symbols = useMemo(() => [...new Set(et.map(t => t.sym))].sort(), [et]);
  const tags = useMemo(() => [...new Set(Object.values(notes).flatMap(n => (n.tags ?? []).map(normTag)))].sort(), [notes]);

  const { rows, counts } = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const base = et.filter(t =>
      (!symbol || t.sym === symbol) && (side === 'all' || t.type === side) && (outcome === 'all' || t.outcome === outcome) &&
      (!tag || (notes[t.id]?.tags ?? []).some(x => normTag(x) === tag)) &&
      (!ql || t.id.includes(ql) || t.sym.toLowerCase().includes(ql) || (notes[t.id]?.note ?? '').toLowerCase().includes(ql) || (notes[t.id]?.tags ?? []).some(x => x.toLowerCase().includes(ql))));
    const todo = (t: EnrichedTrade) => { const n = notes[t.id]; return !n?.note?.trim() && !n?.tags?.length && !n?.grade; };
    const hasMistakes = (t: EnrichedTrade) => !!notes[t.id]?.mistakes?.length;
    const counts = { todo: base.filter(todo).length, mistakes: base.filter(hasMistakes).length };
    const out = review === 'todo' ? base.filter(todo) : review === 'mistakes' ? base.filter(hasMistakes) : base;
    const val = (t: EnrichedTrade): number | string => ({ close: t.close.getTime(), sym: t.sym, net: t.net, r: t.r ?? -Infinity, volume: t.volume, hold: t.holdSec }[sort.k]);
    return { rows: out.sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * sort.dir; }), counts };
  }, [et, q, symbol, side, outcome, tag, review, notes, sort.k, sort.dir]);

  // Remember the visible order for Prev/Next on the trade page.
  useEffect(() => { try { sessionStorage.setItem(TRADE_ORDER_KEY, JSON.stringify(rows.map(t => t.id))); } catch { /* storage unavailable */ } }, [rows]);

  // "/" jumps to search, like most list apps.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || (e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return;
      e.preventDefault(); setShowFilters(true); searchRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const sum = useMemo(() => computeStats(rows), [rows]);
  const active = [symbol, tag, side !== 'all', outcome !== 'all', review !== 'all'].filter(Boolean).length;
  const anyFilter = active > 0 || !!q;
  const clearAll = () => update({ q: '', symbol: '', tag: '', side: '', outcome: '', review: '', n: '' });
  const more = () => update({ n: String(limit + 200) });
  const linkState = { list: 'trades' };

  const Th = ({ k, children, right }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={cx('th', right && 'text-right')} aria-sort={sort.k === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button className={cx('inline-flex items-center gap-1 py-2 -my-2 min-w-[28px] justify-end [text-transform:inherit] [letter-spacing:inherit] hover:text-ink2', sort.k === k && 'text-ink2')} onClick={() => setSort(k, sort.k === k ? (sort.dir === 1 ? -1 : 1) : -1)}>
        {children}{sort.k === k && <Icon name={sort.dir === 1 ? 'arrowUp' : 'arrowDown'} size={11} />}
      </button>
    </th>
  );

  const reviewSeg = <Segmented label="Review state" size="sm" value={review} onChange={v => setParam('review', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'todo', label: <>To review <span className="num opacity-70">{counts.todo}</span></> }, { value: 'mistakes', label: <>Mistakes <span className="num opacity-70">{counts.mistakes}</span></> }]} />;
  const sideSeg = <Segmented label="Side" size="sm" value={side} onChange={v => setParam('side', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'buy', label: 'Long' }, { value: 'sell', label: 'Short' }]} />;
  const outcomeSeg = <Segmented label="Outcome" size="sm" value={outcome} onChange={v => setParam('outcome', v === 'all' ? '' : v)} options={[{ value: 'all', label: 'All' }, { value: 'win', label: 'Wins' }, { value: 'loss', label: 'Losses' }]} />;
  const selects = (<>
    <select aria-label="Symbol" className="field md:w-auto" value={symbol} onChange={e => setParam('symbol', e.target.value)}>
      <option value="">All symbols</option>{symbols.map(s => <option key={s}>{s}</option>)}
    </select>
    <select aria-label="Setup tag" className="field md:w-auto" value={tag} onChange={e => setParam('tag', e.target.value)}>
      <option value="">All setups</option>{tags.map(s => <option key={s}>{s}</option>)}
    </select>
  </>);
  const search = (
    <div className="relative min-w-0 flex-1 md:min-w-[180px]">
      <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
      <input ref={searchRef} aria-label="Search trades" placeholder={mobile ? 'Search symbol, ticket, tag, note' : 'Search symbol, ticket, tag or note  ( / )'} value={q} onChange={e => setParam('q', e.target.value)} className="field pl-9" />
    </div>
  );

  return (
    <Page>
      <Card className="p-4">
        {mobile ? (<>
          <div className="flex gap-2 items-center">
            {search}
            <button type="button" className={cx('btn h-11 shrink-0', active > 0 && 'border-accent text-accent')} aria-expanded={showFilters} aria-controls="trade-filters" onClick={() => setShowFilters(s => !s)}>
              <Icon name="sliders" size={14} />Filters{active > 0 && <span className="num">· {active}</span>}
            </button>
          </div>
          {showFilters && (
            <div id="trade-filters" className="flex flex-col gap-3 mt-3">
              <div className="grid grid-cols-2 gap-2">{selects}</div>
              {[['Review', reviewSeg], ['Side', sideSeg], ['Outcome', outcomeSeg]].map(([l, el]) => (
                <div key={l as string} className="flex items-center justify-between gap-2"><span className="label">{l}</span>{el}</div>
              ))}
              <div className="flex items-center justify-between gap-2">
                <label className="label" htmlFor="trade-sort">Sort</label>
                <div className="flex gap-2">
                  <select id="trade-sort" className="field w-auto" value={sort.k} onChange={e => setSort(e.target.value as SortKey, sort.dir)}>
                    {SORT_KEYS.map(k => <option key={k} value={k}>{SORT_LABEL[k]}</option>)}
                  </select>
                  <button type="button" className="btn h-11 w-11 px-0 justify-center" aria-label={sort.dir === 1 ? 'Ascending, switch to descending' : 'Descending, switch to ascending'} onClick={() => setSort(sort.k, sort.dir === 1 ? -1 : 1)}>
                    <Icon name={sort.dir === 1 ? 'arrowUp' : 'arrowDown'} size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>) : (
          <div className="flex flex-wrap gap-2 items-center">
            {search}{selects}{reviewSeg}{sideSeg}{outcomeSeg}
          </div>
        )}
        {anyFilter && (
          <div className="flex items-center justify-between gap-2 mt-3 text-xs text-ink3">
            <span className="num">{rows.length} of {et.length} trades</span>
            <button type="button" className="btn-ghost h-8 text-accent" onClick={clearAll}><Icon name="x" size={13} />Clear filters</button>
          </div>
        )}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-3 mt-4 pt-4 border-t border-line">
          {[
            ['Trades', String(sum.total), ''],
            ['Net P&L', fmt(sum.net, { signed: true }), tone(sum.net)],
            ['Win rate', pct(sum.winRate), ''],
            ['Profit factor', sum.profitFactor?.toFixed(2) ?? '—', ''],
            ['Expectancy', fmt(sum.expectancy, { signed: true }), tone(sum.expectancy)],
            ['Avg R', rMult(sum.avgR), tone(sum.avgR)],
          ].map(([l, v, cl]) => <div key={l} className="min-w-0"><div className="label truncate">{l}</div><div className={cx('num font-semibold mt-1 truncate', cl)}>{v}</div></div>)}
        </div>
      </Card>

      <Card className={mobile ? 'px-4 py-1' : 'p-0 overflow-hidden'}>
        {rows.length ? mobile ? (<>
          <TradeList trades={rows.slice(0, limit)} linkState={linkState} />
          {rows.length > limit && <div className="py-3 text-center border-t border-line"><button className="btn w-full h-11" onClick={more}>Show more ({rows.length - limit} left)</button></div>}
        </>) : (
          <div>
            <table className="w-full">
              <thead className="pillhead"><tr className="[&>th]:pt-3 [&>th:first-child]:pl-5 [&>th:last-child]:pr-5">
                <Th k="close">Closed</Th><Th k="sym">Symbol</Th><th className="th">Side</th><Th k="volume" right>Lots</Th><th className="th text-right">Entry → Exit</th><Th k="hold" right>Hold</Th><th className="th pl-5">Setup</th><th className="th">Result</th><Th k="r" right>R</Th><Th k="net" right>Net</Th>
              </tr></thead>
              <tbody>
                {rows.slice(0, limit).map(t => {
                  const n = notes[t.id];
                  const digits = specFor(t.sym, overrides[t.sym]).digits;
                  return (
                    <tr key={t.account + t.id} onClick={() => nav(`/trades/${t.id}`, { state: linkState })} className="cursor-pointer hover:bg-raised/60 transition-colors [&>td:first-child]:pl-5 [&>td:last-child]:pr-5">
                      <td className="td num text-ink2 whitespace-nowrap">{shortDate(t.close)} <span className="text-ink3">{timeHM(t.close)}</span></td>
                      <td className="td"><Link to={`/trades/${t.id}`} state={linkState} onClick={e => e.stopPropagation()} className="font-mono font-medium hover:text-accent inline-block py-2 -my-2">{t.sym}</Link>{n?.mistakes?.length ? <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-warn align-middle" title={`Mistakes: ${n.mistakes.join(', ')}`} aria-label="Has mistakes" role="img" /> : null}</td>
                      <td className="td"><Badge tone={t.type === 'buy' ? 'profit' : 'loss'}>{t.type === 'buy' ? 'BUY' : 'SELL'}</Badge></td>
                      <td className="td num text-right text-ink2">{t.volume}</td>
                      <td className="td num text-right text-ink2 whitespace-nowrap">{price(t.openPrice, digits)} <span className="text-ink3">→</span> {price(t.closePrice, digits)}</td>
                      <td className="td num text-right text-ink2">{fmtHold(t.holdSec)}</td>
                      <td className="td pl-5 text-ink2 max-w-[200px] truncate">{n?.tags?.join(', ') || <span className="text-ink3">—</span>}</td>
                      <td className="td"><Badge tone={t.net > 0 ? 'profit' : t.net < 0 ? 'loss' : 'neutral'}>{t.net > 0 ? 'WIN' : t.net < 0 ? 'LOSS' : 'BE'}</Badge></td>
                      <td className={cx('td num text-right', t.r == null ? 'text-ink3' : 'text-ink2')}>{rMult(t.r, 1)}</td>
                      <td className={cx('td num text-right font-semibold', tone(t.net))}>{fmt(t.net, { signed: true })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length > limit && <div className="p-4 text-center border-t border-line"><button className="btn" onClick={more}>Show more ({rows.length - limit} left)</button></div>}
          </div>
        ) : <Empty icon="search" title="No trades match" action={anyFilter ? <button className="btn" onClick={clearAll}>Clear filters</button> : undefined}>{anyFilter ? 'Nothing fits these filters in the current date range.' : 'No trades in the current date range. Widen it from the date picker.'}</Empty>}
      </Card>
    </Page>
  );
}
