import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { bucketMeta, checkPlanLink, CODE_BUCKET, DEFAULT_INDEXES, detailFrom, homeChart, indexList, listingText, px, findBySlug, shardUrl, tvChart, unpackBars, type DetailZone, type IndexRow, type TickerDetail } from '@/core/scanner';
import { num } from '@/lib/format';
import { Badge, Card, cx, Empty, Page } from '@/ui/kit';
import { Explain } from '@/ui/Explain';
import { bucketTip, ctx6Text, locTip, curveTip, directionTip, distTip, freshTip, G, rajaTip, tfStateTip, zoneBadgeTip, zoneLineTip, zoneScoreTip } from '@/core/scannerGlossary';
import { Icon } from '@/ui/Icon';
import { ChainLine, ContextFlags, FundTable, IndexChips, loadIndex, PlanGrid, PzChips, RuleList, ScoreChips, StarButton, TfBadge, TickerSearch, TipStat, TypeBadge, useWatchlist, ZoneChart } from '@/ui/ScanParts';
import { ZoneGauge } from '@/ui/ZoneGauge';
import { HoldersCard } from '@/ui/HoldersCard';
import type { MiniZone } from '@/ui/ZoneMiniChart';

type Load = { state: 'loading' } | { state: 'missing' } | { state: 'error' } | { state: 'ok'; d: TickerDetail; row: IndexRow };

function useDetail(slug: string): [Load, () => void] {
  const [s, setS] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
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
      if (live) setS(d ? { state: 'ok', d, row } : { state: 'error' });
    })().catch(() => { if (live) setS({ state: 'error' }); });
    return () => { live = false; };
  }, [slug, n]);
  return [s, () => setN(x => x + 1)];
}

function ZoneRow({ z, price }: { z: DetailZone; price: number }) {
  const dist = z.side === 'demand' ? (price - z.proximal) / price * 100 : (z.proximal - price) / price * 100;
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className={cx('w-1.5 self-stretch rounded-full shrink-0', z.side === 'demand' ? 'bg-profit' : 'bg-loss')} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <TfBadge tf={z.tf} />
          <Explain doc={{ title: z.side === 'demand' ? 'Demand zone' : 'Supply zone', body: z.side === 'demand' ? 'Where buyers left price in a hurry: the scanner buys at its proximal (upper edge). Green bar.' : 'Where sellers left price in a hurry: the target sits just before it, holders get an exit warning near it. Red bar.' }} className="text-[13px] font-semibold">{z.side}</Explain>
          <TypeBadge t={z.type} />
          <Explain doc={freshTip(z.touches)} className={cx('text-[11px] font-medium', z.fresh ? 'text-profit' : 'text-ink3')}>{z.fresh ? 'fresh' : `touch ${z.touches + 1}`}</Explain>
          {z.score != null && <Explain doc={zoneScoreTip(z.score, z.side)} className="num text-[11px] text-ink3">score {z.score}/10</Explain>}
        </div>
        {z.loc_text && <div className="text-[11.5px] mt-0.5"><Explain doc={locTip(z.loc, z.loc_text)!} className={z.loc === 'inside' || z.loc === 'top' ? 'text-profit' : 'text-ink3'}>{z.loc === 'inside' || z.loc === 'top' ? '✓' : '✗'} {z.loc_text}</Explain></div>}
        <div className="num text-[12px] text-ink3 mt-0.5"><Explain doc={z.side === 'demand' ? zoneLineTip({ tf: z.tf, zone_type: z.type, pattern: z.pattern, proximal: z.proximal, distal: z.distal, made: z.made, price }) : { ...G.proxDist, title: `Supply ${px(z.proximal)}–${px(z.distal)}`, body: `Proximal ${px(z.proximal)} = the lowest base body (where price hits it first); distal ${px(z.distal)} = the highest wick. ${z.pattern}, made ${z.made}. Removed only by a close above the distal.` }}>{px(Math.min(z.proximal, z.distal))}–{px(Math.max(z.proximal, z.distal))} · {z.pattern} · made {z.made}</Explain></div>
      </div>
      <Explain doc={distTip(dist, z.side, z)} className={cx('num text-[12px] shrink-0 text-right', Math.abs(dist) <= 3 ? 'text-accent' : 'text-ink3')}>{dist >= 0 ? `${num(dist, 1)}%` : `−${num(-dist, 1)}%`}<span className="block text-[10.5px] text-ink3">{dist < 0 ? 'inside' : z.side === 'demand' ? 'below' : 'above'}</span></Explain>
    </li>
  );
}

export default function Stock() {
  const { ticker = '' } = useParams();
  const [load, retry] = useDetail(ticker);
  const d = load.state === 'ok' ? load.d : null;
  const mb = load.state === 'ok' && load.row.mb && load.row.mb !== 'M' ? CODE_BUCKET[load.row.mb] : null;
  const bars = useMemo(() => (d ? unpackBars(d.bars) : []), [d]);
  const watch = useWatchlist();
  const checkZone = useMemo(() => {
    const c = d?.check;
    if (!c) return undefined;
    const z = d!.zones.find(x => x.side === 'demand' && x.proximal === c.zone.proximal && x.tf === c.zone.tf);
    const cr = c.rules.find(r => r.short === 'curve' || /^Curve \d/.test(r.text));
    const m = cr ? /Curve (\d+(?:\.\d+)?)%/.exec(cr.text) : null;
    return { type: c.zone.type, touches: z?.touches ?? null, curve: m ? Number(m[1]) : null };
  }, [d]);
  const zones: MiniZone[] = useMemo(() => (d ? d.zones.map(z => ({ proximal: z.proximal, distal: z.distal, side: z.side })) : []), [d]);

  return (
    <Page>
      <div className="flex items-center gap-2">
        <Link to="/scanner" className="btn-ghost h-10 px-3 -ml-3 text-ink2"><Icon name="chevronLeft" size={16} />Scanner</Link>
      </div>
      <TickerSearch />
      {load.state === 'loading' && <div className="skeleton h-72 rounded-2xl" aria-busy="true" aria-label="Loading" />}
      {load.state === 'missing' && <Card><Empty icon="search" title={`${decodeURIComponent(ticker).toUpperCase()} is not in the scan`}>The scanner covers {indexList(DEFAULT_INDEXES)} (TSX names through their US listing). Try the search above.</Empty></Card>}
      {load.state === 'error' && <Card><Empty icon="cloudOff" title="Could not load this stock" action={<button type="button" className="btn h-11 px-5" onClick={retry}><Icon name="refresh" size={15} />Try again</button>}>{navigator.onLine ? 'The scan files are missing or unreadable.' : 'You are offline.'}</Empty></Card>}
      {d && (
        <>
          <Card className="flex flex-col gap-3.5 p-4 sm:p-5" aria-label={`${d.symbol} zones`}>
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-[22px] font-semibold tracking-tight">{d.symbol}</h2>
                  {d.signal && <Explain u={false} doc={G.signal(d.signal)}><Badge tone={d.signal === 'BUY' ? 'profit' : 'warn'}><span className="tip-u">{d.signal} today</span></Badge></Explain>}
                  {listingText(d) && <Explain u={false} doc={G.listing(listingText(d))}><Badge tone="neutral"><span className="tip-u">{listingText(d)}</span></Badge></Explain>}
                  {mb && <Explain control doc={{ ...bucketTip(bucketMeta(mb).label, mb), lines: ['Tap to open this list in the market map (the same list as Telegram).'] }}><Link to={`/scanner?view=map&b=${mb}`} className="h-6 px-2 rounded-full border border-line text-[11px] font-semibold text-ink2 inline-flex items-center hover:text-ink">{bucketMeta(mb).label}</Link></Explain>}
                </div>
                <p className="text-[13px] text-ink3 mt-0.5">{d.name}{d.sector ? <> · <Explain doc={G.sector(d.sector)}>{d.sector}</Explain></> : ''}</p>
                <IndexChips codes={d.indexes} />
              </div>
              <StarButton symbol={d.symbol} on={watch.has(d.symbol)} onToggle={() => watch.toggle(d.symbol)} />
              <div className="text-right shrink-0">
                <div className="num text-[18px] font-semibold"><Explain doc={G.price(d.price, d.currency ?? 'USD', d.date)}>{px(d.price)} <span className="text-[11px] font-medium text-ink3">{d.currency ?? 'USD'}</span></Explain></div>
                <div className="text-[11.5px] text-ink3"><Explain doc={{ title: `Close ${d.date}`, body: 'The session of the last daily close the scan read (after the US close; a run during market hours drops the unfinished candle).' }}>close {d.date}</Explain></div>
              </div>
            </div>
            {d.gauge && <ZoneGauge demand={d.gauge.demand} supply={d.gauge.supply} state={d.gauge.state} />}
            {bars.length > 0 && (
              <ZoneChart symbol={d.symbol} tf={d.check?.zone.tf} bars={bars} zones={zones} show={bars.length} height={180}
                levels={{ price: d.price, fvLo: d.fv?.lo, fvHi: d.fv?.hi, ...(d.check ? { pz1: d.check.pz1, pz2: d.check.pz2 } : {}), ...(d.check ? { proximal: d.check.zone.proximal, distal: d.check.zone.distal, entry: d.check.entry, stop: d.check.stop, target: d.check.target, supply: d.check.next_supply, supplyDistal: d.check.supply_distal ?? null } : {}) }} />
            )}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-xl bg-raised/50 border border-line/70 p-3">
              <TipStat doc={directionTip(d.direction)} label="Direction" value={d.direction} className="!whitespace-normal" />
              <TipStat doc={tfStateTip('W1 · MN', `${d.w1} · ${d.mn}`)} label="W1 · MN" value={`${d.w1} · ${d.mn}`} className="!whitespace-normal" />
              <TipStat doc={curveTip(d.curve, d.curve_raja, d.curve_tf ?? 'MN')} label={`Curve (${d.curve_tf ?? 'MN'})`} value={d.curve != null ? `${Math.round(d.curve)}%` : '—'} />
              {d.m3 ? <TipStat doc={{ ...tfStateTip(d.m6 ? '3M · 6M' : '3M', d.m6 ? `${d.m3} · ${d.m6}` : d.m3), lines: [...(tfStateTip(d.m6 ? '3M · 6M' : '3M', d.m6 ? `${d.m3} · ${d.m6}` : d.m3).lines ?? []), ...(ctx6Text(d.ctx6) ? [ctx6Text(d.ctx6)!] : [])] }} label={d.m6 ? '3M · 6M' : '3M'} value={d.m6 ? `${d.m3} · ${d.m6}` : d.m3} className="!whitespace-normal" />
                : d.d1 && d.d1 !== 'not used' ? <TipStat doc={tfStateTip('D1', d.d1)} label="D1" value={d.d1} className="!whitespace-normal" /> : null}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Explain as="div" u={false} doc={d.nearest_demand ? distTip(d.nearest_demand.dist_pct, 'demand', d.nearest_demand) : { title: 'No demand below', body: 'No active D1 / W1 / MN demand zone under the price.' }} className="rounded-xl border border-line/70 p-3 min-w-0">
                <div className="label"><span className="tip-u">Nearest demand</span></div>
                {d.nearest_demand ? <><div className="num text-[13px] font-medium mt-0.5">{px(d.nearest_demand.distal)}–{px(d.nearest_demand.proximal)}</div><div className="text-[11.5px] text-ink3">{d.nearest_demand.tf} {d.nearest_demand.type} · {num(d.nearest_demand.dist_pct, 1)}% below</div></> : <div className="text-[13px] text-ink3 mt-0.5">none under price</div>}
              </Explain>
              <Explain as="div" u={false} doc={d.nearest_supply ? distTip(d.nearest_supply.dist_pct, 'supply', d.nearest_supply) : { title: 'No supply above', body: "No fresh supply above the price (all-time-high area): a BUY's target becomes Raja's 250% projection (L5).", ref: 'Raja L5 · L101' }} className="rounded-xl border border-line/70 p-3 min-w-0">
                <div className="label"><span className="tip-u">Nearest supply</span></div>
                {d.nearest_supply ? <><div className="num text-[13px] font-medium mt-0.5">{px(d.nearest_supply.proximal)}–{px(d.nearest_supply.distal)}</div><div className="text-[11.5px] text-ink3">{d.nearest_supply.tf} {d.nearest_supply.type} · {num(d.nearest_supply.dist_pct, 1)}% above</div></> : <div className="text-[13px] text-ink3 mt-0.5">none above: 250% projection target (L5)</div>}
              </Explain>
            </div>
            <div className="flex gap-2">
              {checkPlanLink(d) && <Explain control doc={G.planIt}><Link to={checkPlanLink(d)!} className={cx(d.check?.kind === 'BUY' ? 'btn-primary' : 'btn', 'h-10 flex-1 sm:flex-none')}><Icon name="target" size={15} />Plan it</Link></Explain>}
              <Explain control doc={G.tv}><a href={tvChart(d)} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />TradingView{homeChart(d) ? ' (US · USD)' : ''}</a></Explain>
              {homeChart(d) && <a href={homeChart(d)!.url} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />{homeChart(d)!.label}</a>}
            </div>
          </Card>

          {d.check && (
            <Card className="flex flex-col gap-3 p-4 sm:p-5" aria-label="Rule check">
              <div className="flex items-start gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold"><Explain doc={{ title: d.signal === 'BUY' ? "Today's BUY" : 'Nearest demand as a BUY', body: d.signal === 'BUY' ? "Today's signal zone with every rule it passed." : 'The nearest demand under the price, checked against every BUY rule as if it were a signal, so you can see what blocks it.' }}>{d.signal === 'BUY' ? "Today's BUY: rule check" : 'Nearest demand as a BUY'}</Explain></h3>
                  <p className="num text-[12px] text-ink3 mt-0.5"><Explain doc={zoneBadgeTip(d.check.zone.tf, d.check.zone.type)}>{d.check.zone.tf} {d.check.zone.type} demand {px(d.check.zone.distal)}–{px(d.check.zone.proximal)}</Explain>{d.check.score != null ? <> · <Explain doc={rajaTip(d.check.score, checkZone)}>score {d.check.score}/10</Explain></> : ''}</p>
                </div>
                <Explain u={false} doc={d.check.kind === 'BUY' ? { title: 'Passes every rule', body: 'No ✗ in the list below: a set-and-forget BUY at the proximal.' } : { title: 'No trade', body: 'At least one rule below is ✗: no BUY on this zone. No zone, no trade.' }}><Badge tone={d.check.kind === 'BUY' ? 'profit' : 'neutral'}><span className="tip-u">{d.check.kind === 'BUY' ? 'Passes every rule' : 'No trade'}</span></Badge></Explain>
              </div>
              <ChainLine s={d.check} />
              <PlanGrid p={{ ...d.check, tf: d.check.zone.tf, proximal: d.check.zone.proximal, distal: d.check.zone.distal, price: d.price }} />
              <ScoreChips raja={d.check.score} seiden={d.check.seiden_score} parts={d.check.seiden_parts} zone={checkZone} />
              <PzChips s={{ ...d.check, price: d.price, fv_lo: d.fv?.lo, fv_hi: d.fv?.hi }} />
              <ContextFlags s={d.check} />
              <RuleList rules={d.check.rules} open />
            </Card>
          )}

          <Card className="p-4 sm:p-5" aria-label="Active zones">
            <h3 className="text-[15px] font-semibold"><Explain doc={{ title: `Active zones · ${d.zones.length}`, body: `Every zone on ${(d.tfs?.length ? d.tfs : ['D1', 'W1', 'MN']).join(', ')} not yet removed by a close, made in the last 200 bars, highest first. The % on the right is from the close to the proximal.` }}>Active zones</Explain> <span className="text-ink3 font-normal text-[13px]">{(d.tfs?.length ? d.tfs : ['D1', 'W1', 'MN']).join(' + ')} · {d.zones.length}</span></h3>
            {d.zones.length ? <ul className="divide-y divide-line mt-1">{d.zones.map((z, i) => <ZoneRow key={i} z={z} price={d.price} />)}</ul>
              : <p className="text-[13px] text-ink3 mt-2">No active zone in the last 200 bars.</p>}
          </Card>

          <FundTable rows={d.fundamentals_rows} open country={d.country} />
          <HoldersCard symbol={d.symbol} />
          <p className="text-[12px] text-ink3">Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.</p>
        </>
      )}
    </Page>
  );
}
