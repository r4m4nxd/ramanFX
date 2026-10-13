import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useFiltered } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats, normTag, type EnrichedTrade } from '@/core/stats';
import { fmtHold } from '@/core/time';
import { pct, rMult, shortDate, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Segmented } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

type SortKey = 'close' | 'sym' | 'net' | 'r' | 'volume' | 'hold';

export default function Trades() {
  const et = useFiltered();
  const notes = useStore(s => s.notes);
  const fmt = useMoney();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [side, setSide] = useState<'all' | 'buy' | 'sell'>('all');
  const [outcome, setOutcome] = useState<'all' | 'win' | 'loss'>('all');
  const [sort, setSort] = useState<{ k: SortKey; dir: 1 | -1 }>({ k: 'close', dir: -1 });
  const [limit, setLimit] = useState(100);
  const symbol = params.get('symbol') ?? '';
  const tag = params.get('tag') ?? '';

  const symbols = useMemo(() => [...new Set(et.map(t => t.sym))].sort(), [et]);
  const tags = useMemo(() => [...new Set(Object.values(notes).flatMap(n => (n.tags ?? []).map(normTag)))].sort(), [notes]);

  const rows = useMemo(() => {
    const ql = q.trim().toLowerCase();
    const out = et.filter(t =>
      (!symbol || t.sym === symbol) && (side === 'all' || t.type === side) && (outcome === 'all' || t.outcome === outcome) &&
      (!tag || (notes[t.id]?.tags ?? []).some(x => normTag(x) === tag)) &&
      (!ql || t.id.includes(ql) || t.sym.toLowerCase().includes(ql) || (notes[t.id]?.note ?? '').toLowerCase().includes(ql) || (notes[t.id]?.tags ?? []).some(x => x.toLowerCase().includes(ql))));
    const val = (t: EnrichedTrade): number | string => ({ close: t.close.getTime(), sym: t.sym, net: t.net, r: t.r ?? -Infinity, volume: t.volume, hold: t.holdSec }[sort.k]);
    return out.sort((a, b) => { const x = val(a), y = val(b); return (x < y ? -1 : x > y ? 1 : 0) * sort.dir; });
  }, [et, q, symbol, side, outcome, tag, notes, sort]);

  const sum = useMemo(() => computeStats(rows), [rows]);
  const setParam = (k: string, v: string) => { const p = new URLSearchParams(params); if (v) p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };
  const Th = ({ k, children, right }: { k: SortKey; children: React.ReactNode; right?: boolean }) => (
    <th className={cx('th', right && 'text-right')} aria-sort={sort.k === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button className={cx('inline-flex items-center gap-1 hover:text-ink2', sort.k === k && 'text-ink2')} onClick={() => setSort(s => ({ k, dir: s.k === k ? (s.dir === 1 ? -1 : 1) : -1 }))}>
        {children}{sort.k === k && <Icon name={sort.dir === 1 ? 'arrowUp' : 'arrowDown'} size={11} />}
      </button>
    </th>
  );

  return (
    <Page>
      <Card className="p-4">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
            <input aria-label="Search trades" placeholder="Search symbol, ticket, tag or note" value={q} onChange={e => setQ(e.target.value)} className="field pl-9" />
          </div>
          <select aria-label="Symbol" className="field w-auto" value={symbol} onChange={e => setParam('symbol', e.target.value)}>
            <option value="">All symbols</option>{symbols.map(s => <option key={s}>{s}</option>)}
          </select>
          <select aria-label="Setup tag" className="field w-auto" value={tag} onChange={e => setParam('tag', e.target.value)}>
            <option value="">All setups</option>{tags.map(s => <option key={s}>{s}</option>)}
          </select>
          <Segmented label="Side" size="sm" value={side} onChange={setSide} options={[{ value: 'all', label: 'All' }, { value: 'buy', label: 'Long' }, { value: 'sell', label: 'Short' }]} />
          <Segmented label="Outcome" size="sm" value={outcome} onChange={setOutcome} options={[{ value: 'all', label: 'All' }, { value: 'win', label: 'Wins' }, { value: 'loss', label: 'Losses' }]} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-line">
          {[
            ['Trades', String(sum.total), ''],
            ['Net P&L', fmt(sum.net, { signed: true }), tone(sum.net)],
            ['Win rate', pct(sum.winRate), ''],
            ['Profit factor', sum.profitFactor?.toFixed(2) ?? '—', ''],
            ['Expectancy', fmt(sum.expectancy, { signed: true }), tone(sum.expectancy)],
            ['Avg R', rMult(sum.avgR), tone(sum.avgR)],
          ].map(([l, v, cl]) => <div key={l}><div className="label">{l}</div><div className={cx('num font-semibold mt-1', cl)}>{v}</div></div>)}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {rows.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-raised/50"><tr className="[&>th]:pt-3 [&>th:first-child]:pl-5 [&>th:last-child]:pr-5">
                <Th k="close">Closed</Th><Th k="sym">Symbol</Th><th className="th">Side</th><Th k="volume" right>Lots</Th><th className="th text-right">Entry → Exit</th><Th k="hold" right>Hold</Th><th className="th">Setup</th><Th k="r" right>R</Th><Th k="net" right>Net</Th>
              </tr></thead>
              <tbody>
                {rows.slice(0, limit).map(t => {
                  const n = notes[t.id];
                  const d = t.type === 'buy' ? t.closePrice - t.openPrice : t.openPrice - t.closePrice;
                  return (
                    <tr key={t.account + t.id} onClick={() => nav(`/trades/${t.id}`)} className="cursor-pointer hover:bg-raised/60 transition-colors [&>td:first-child]:pl-5 [&>td:last-child]:pr-5">
                      <td className="td num text-ink2 whitespace-nowrap">{shortDate(t.close)} <span className="text-ink3">{timeHM(t.close)}</span></td>
                      <td className="td"><Link to={`/trades/${t.id}`} onClick={e => e.stopPropagation()} className="font-mono font-medium hover:text-accent">{t.sym}</Link>{n?.mistakes?.length ? <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-warn align-middle" title="Has mistakes" /> : null}</td>
                      <td className="td"><Badge tone={t.type === 'buy' ? 'accent' : 'warn'}>{t.type === 'buy' ? 'LONG' : 'SHORT'}</Badge></td>
                      <td className="td num text-right text-ink2">{t.volume}</td>
                      <td className="td num text-right text-ink2 whitespace-nowrap">{t.openPrice} → <span className={d >= 0 ? 'text-profit' : 'text-loss'}>{t.closePrice}</span></td>
                      <td className="td num text-right text-ink2">{fmtHold(t.holdSec)}</td>
                      <td className="td text-ink2 max-w-[200px] truncate">{n?.tags?.join(', ') || <span className="text-ink3">—</span>}</td>
                      <td className={cx('td num text-right', tone(t.r))}>{rMult(t.r, 1)}</td>
                      <td className={cx('td num text-right font-semibold', tone(t.net))}>{fmt(t.net, { signed: true })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {rows.length > limit && <div className="p-4 text-center border-t border-line"><button className="btn" onClick={() => setLimit(l => l + 200)}>Show more ({rows.length - limit} left)</button></div>}
          </div>
        ) : <Empty icon="search" title="No trades match">Try clearing a filter or widening the date range.</Empty>}
      </Card>
    </Page>
  );
}
