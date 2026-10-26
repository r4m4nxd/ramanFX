import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { checkPlanLink, detailFrom, findBySlug, shardUrl, tvChart, unpackBars, type DetailZone, type TickerDetail } from '@/core/scanner';
import { num } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Stat } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { FundTable, IDX_SHORT, loadIndex, RuleList, TickerSearch, typeTone, ZoneChart } from '@/ui/ScanParts';
import type { MiniZone } from '@/ui/ZoneMiniChart';

type Load = { state: 'loading' } | { state: 'missing' } | { state: 'error' } | { state: 'ok'; d: TickerDetail };

function useDetail(slug: string): Load {
  const [s, setS] = useState<Load>({ state: 'loading' });
  useEffect(() => {
    let live = true;
    setS({ state: 'loading' });
    (async () => {
      const idx = await loadIndex();
      if (!idx) return live && setS({ state: 'error' });
      const row = findBySlug(idx.tickers, slug);
      if (!row) return live && setS({ state: 'missing' });
      const r = await fetch(shardUrl(row.k), { cache: 'no-cache' });
      const d = r.ok ? detailFrom(await r.json(), row.s) : null;
      if (live) setS(d ? { state: 'ok', d } : { state: 'error' });
    })().catch(() => { if (live) setS({ state: 'error' }); });
    return () => { live = false; };
  }, [slug]);
  return s;
}

function ZoneRow({ z, price }: { z: DetailZone; price: number }) {
  const dist = z.side === 'demand' ? (price - z.proximal) / price * 100 : (z.proximal - price) / price * 100;
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className={cx('w-1.5 self-stretch rounded-full shrink-0', z.side === 'demand' ? 'bg-profit' : 'bg-loss')} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[13px] font-semibold">{z.tf} {z.side}</span>
          <Badge tone={typeTone(z.type)} className="h-5 px-2 text-[10.5px]">{z.type}</Badge>
          <span className={cx('text-[11px] font-medium', z.fresh ? 'text-profit' : 'text-ink3')}>{z.fresh ? 'fresh' : `touch ${z.touches + 1}`}</span>
          {z.score != null && <span className="num text-[11px] text-ink3">score {z.score}/10</span>}
        </div>
        <div className="num text-[12px] text-ink3 mt-0.5">{num(Math.min(z.proximal, z.distal))}–{num(Math.max(z.proximal, z.distal))} · {z.pattern} · made {z.made}</div>
      </div>
      <span className={cx('num text-[12px] shrink-0', Math.abs(dist) <= 3 ? 'text-accent' : 'text-ink3')}>{dist >= 0 ? '' : '−'}{num(Math.abs(dist), 1)}%</span>
    </li>
  );
}

export default function Stock() {
  const { ticker = '' } = useParams();
  const load = useDetail(ticker);
  const d = load.state === 'ok' ? load.d : null;
  const bars = useMemo(() => (d ? unpackBars(d.bars) : []), [d]);
  const zones: MiniZone[] = useMemo(() => (d ? d.zones.map(z => ({ proximal: z.proximal, distal: z.distal, side: z.side })) : []), [d]);

  return (
    <Page>
      <div className="flex items-center gap-2">
        <Link to="/scanner" className="btn-ghost h-10 px-3 -ml-3 text-ink2"><Icon name="chevronLeft" size={16} />Scanner</Link>
      </div>
      <TickerSearch />
      {load.state === 'loading' && <div className="skeleton h-72 rounded-2xl" aria-busy="true" aria-label="Loading" />}
      {load.state === 'missing' && <Card><Empty icon="search" title={`${decodeURIComponent(ticker).toUpperCase()} is not in the scan`}>The scanner covers the S&amp;P 500, Nasdaq-100, Dow 30 and Russell 2000. Try the search above.</Empty></Card>}
      {load.state === 'error' && <Card><Empty icon="cloudOff" title="Could not load this stock">{navigator.onLine ? 'The scan files are missing or unreadable.' : 'You are offline.'}</Empty></Card>}
      {d && (
        <>
          <Card className="flex flex-col gap-3.5 p-4 sm:p-5" aria-label={`${d.symbol} zones`}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[22px] font-semibold tracking-tight">{d.symbol}</h2>
                  {d.signal && <Badge tone={d.signal === 'BUY' ? 'profit' : 'warn'}>{d.signal} today</Badge>}
                  {d.illiquid && <Badge tone="warn">Illiquid: skipped</Badge>}
                </div>
                <p className="text-[13px] text-ink3 mt-0.5">{d.name}{d.sector ? ` · ${d.sector}` : ''}</p>
                {!!d.indexes.length && <div className="flex gap-1 mt-1.5 flex-wrap" aria-label="Indexes">{d.indexes.map(i => <span key={i} className="h-5 px-1.5 rounded-md border border-line text-[10.5px] font-semibold text-ink2 grid place-items-center">{IDX_SHORT[i] ?? i}</span>)}</div>}
              </div>
              <div className="text-right shrink-0">
                <div className="num text-[18px] font-semibold">{num(d.price)}</div>
                <div className="text-[11.5px] text-ink3">close {d.date}</div>
              </div>
            </div>
            {bars.length > 0 && (
              <ZoneChart symbol={d.symbol} tf={d.check?.zone.tf} bars={bars} zones={zones} show={bars.length} height={180}
                levels={{ price: d.price, ...(d.check ? { proximal: d.check.zone.proximal, distal: d.check.zone.distal, entry: d.check.entry, stop: d.check.stop, target: d.check.target, supply: d.check.next_supply, supplyDistal: d.check.supply_distal ?? null } : {}) }} />
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-raised/50 border border-line/70 p-3">
              <Stat label="Direction" value={d.direction} />
              <Stat label="W1 · MN" value={`${d.w1} · ${d.mn}`} />
              <Stat label="Curve (MN)" value={d.curve != null ? `${Math.round(d.curve)}%` : '—'} />
              <Stat label="D1" value={d.d1} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-line/70 p-3 min-w-0">
                <div className="label">Nearest demand</div>
                {d.nearest_demand ? <><div className="num text-[13px] font-medium mt-0.5">{num(d.nearest_demand.distal)}–{num(d.nearest_demand.proximal)}</div><div className="text-[11.5px] text-ink3">{d.nearest_demand.tf} {d.nearest_demand.type} · {num(d.nearest_demand.dist_pct, 1)}% below</div></> : <div className="text-[13px] text-ink3 mt-0.5">none under price</div>}
              </div>
              <div className="rounded-xl border border-line/70 p-3 min-w-0">
                <div className="label">Nearest supply</div>
                {d.nearest_supply ? <><div className="num text-[13px] font-medium mt-0.5">{num(d.nearest_supply.proximal)}–{num(d.nearest_supply.distal)}</div><div className="text-[11.5px] text-ink3">{d.nearest_supply.tf} {d.nearest_supply.type} · {num(d.nearest_supply.dist_pct, 1)}% above</div></> : <div className="text-[13px] text-ink3 mt-0.5">none above: no known target</div>}
              </div>
            </div>
            <div className="flex gap-2">
              {checkPlanLink(d) && <Link to={checkPlanLink(d)!} className={cx(d.check?.kind === 'BUY' ? 'btn-primary' : 'btn', 'h-10 flex-1 sm:flex-none')}><Icon name="target" size={15} />Plan it</Link>}
              <a href={tvChart(d)} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />TradingView</a>
            </div>
          </Card>

          {d.check && (
            <Card className="flex flex-col gap-3 p-4 sm:p-5" aria-label="Rule check">
              <div className="flex items-start gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold">{d.signal === 'BUY' ? "Today's BUY: rule check" : 'Nearest demand as a BUY'}</h3>
                  <p className="num text-[12px] text-ink3 mt-0.5">{d.check.zone.tf} {d.check.zone.type} demand {num(d.check.zone.distal)}–{num(d.check.zone.proximal)}{d.check.score != null ? ` · score ${d.check.score}/10` : ''}</p>
                </div>
                <Badge tone={d.check.kind === 'BUY' ? 'profit' : 'neutral'}>{d.check.kind === 'BUY' ? 'Passes every rule' : 'No trade'}</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2 rounded-xl bg-raised/50 border border-line/70 p-3">
                <Stat label="Entry" value={num(d.check.entry)} />
                <Stat label="Stop" value={num(d.check.stop)} className="text-loss" />
                <Stat label="Target" value={d.check.target != null ? num(d.check.target) : '—'} className="text-profit" />
                <Stat label="R:R" value={d.check.rr != null ? num(d.check.rr, 1) : '—'} />
              </div>
              <RuleList rules={d.check.rules} open />
            </Card>
          )}

          <Card className="p-4 sm:p-5" aria-label="Active zones">
            <h3 className="text-[15px] font-semibold">Active zones <span className="text-ink3 font-normal text-[13px]">D1 + W1 · {d.zones.length}</span></h3>
            {d.zones.length ? <ul className="divide-y divide-line mt-1">{d.zones.map((z, i) => <ZoneRow key={i} z={z} price={d.price} />)}</ul>
              : <p className="text-[13px] text-ink3 mt-2">No active zone in the last 200 bars.</p>}
          </Card>

          {!!d.fundamentals_rows.length && <FundTable rows={d.fundamentals_rows} open />}
          <p className="text-[12px] text-ink3">Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.</p>
        </>
      )}
    </Page>
  );
}
