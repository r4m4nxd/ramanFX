import { Fragment, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ago, CODE_BUCKET, EXIT_REASON, homeChart, isBucket, indexesOf, indexList, listingText, px, reasonsText, rowSectors, stateWord, matches, parseScan, planLink, SCAN_URL, SECTOR_SHORT, sectorsOf, sortSignals, stockPath, tvChart, type IndexFilter, type ScanExit, type ScanFile, type ScanSignal, type SortKey } from '@/core/scanner';
import { num } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Segmented, useIsMobile } from '@/ui/kit';
import type { MiniBar } from '@/ui/ZoneMiniChart';
import { ChainLine, ContextFlags, FundTable, IndexChips, PlanGrid, PzChips, RfxPanel, RuleList, ScoreChips, StarButton, TickerSearch, typeTone, useScanIndex, useWatchlist, ZoneChart } from '@/ui/ScanParts';
import { Explain, InfoDot } from '@/ui/Explain';
import { blockTip, ctx6Text, ctx6Tip, curveTip, directionTip, exitTip, G, rfxTip, targetTip, tfStateTip, toEntryTip, zoneBadgeTip, zoneLineTip } from '@/core/scannerGlossary';
import { ZoneGauge } from '@/ui/ZoneGauge';
import { MarketMap } from '@/ui/MarketMap';
import { Icon } from '@/ui/Icon';
import { ScannerSwitch } from '@/ui/ScannerSwitch';

type Pill = 'BUY' | 'WATCH' | 'EXIT' | 'STAR';
const KEY = 'rfx_scanner_pill';
const readPill = (): Pill => { try { const v = localStorage.getItem(KEY); return v === 'WATCH' || v === 'EXIT' || v === 'STAR' ? v : 'BUY'; } catch { return 'BUY'; } };
const savePill = (v: Pill) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };
const IDX_KEY = 'rfx_scanner_index';
const readIdx = (): IndexFilter => { try { const v = localStorage.getItem(IDX_KEY); return v && /^[A-Z0-9]{2,8}$/.test(v) ? v : 'all'; } catch { return 'all'; } };
const saveIdx = (v: IndexFilter) => { try { localStorage.setItem(IDX_KEY, v); } catch { /* storage blocked */ } };
type View = 'signals' | 'map';
const VIEW_KEY = 'rfx_scanner_view';
const readView = (): View => { try { return localStorage.getItem(VIEW_KEY) === 'map' ? 'map' : 'signals'; } catch { return 'signals'; } };
const saveView = (v: View) => { try { localStorage.setItem(VIEW_KEY, v); } catch { /* storage blocked */ } };

function SectorPills({ sectors, sector, setSector, allCount }: { sectors: { sector: string; buys?: number }[]; sector: string; setSector: (s: string) => void; allCount?: number }) {
  if (sectors.length < 2) return null;
  return (
    <div role="group" aria-label="Sector" className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
      <InfoDot doc={G.sectors} label="About the sector filter" />
      {[{ sector: 'all', buys: allCount }, ...sectors].map(x => {
        const on = sector === x.sector;
        return (
          <button key={x.sector} type="button" aria-pressed={on} onClick={() => setSector(x.sector)}
            className={cx('h-8 touch:h-9 px-3 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors', on ? 'bg-accent/15 border-accent/40 text-ink' : 'border-line text-ink3 hover:text-ink2')}>
            {x.sector === 'all' ? 'All sectors' : SECTOR_SHORT[x.sector] ?? x.sector}{x.sector !== 'all' && x.buys ? <span className="num text-accent ml-1">{x.buys}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

type Load = { state: 'loading' } | { state: 'ok'; scan: ScanFile | null } | { state: 'error' };

function useScan(): [Load, () => void] {
  const [s, setS] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    setS({ state: 'loading' });
    fetch(SCAN_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setS({ state: 'ok', scan: parseScan(js) }); })
      .catch(() => { if (live) setS({ state: 'error' }); });
    return () => { live = false; };
  }, [n]);
  return [s, () => setN(x => x + 1)];
}

function SignalCard({ s, bars, starred, onStar }: { s: ScanSignal; bars?: MiniBar[]; starred: boolean; onStar: () => void }) {
  const away = s.to_entry_pct;
  return (
    <Card aria-label={`${s.kind} ${s.symbol}`} className="flex flex-col gap-3.5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[18px] font-semibold tracking-tight"><Link to={stockPath(s.symbol)} className="hover:text-accent underline-offset-4 hover:underline">{s.symbol}</Link></h3>
            <Explain u={false} doc={zoneBadgeTip(s.tf, s.zone_type)}><Badge tone={typeTone(s.zone_type)}><span className="tip-u">{s.tf} · {s.zone_type}</span></Badge></Explain>
            {s.kind === 'WATCH' && <Explain u={false} doc={s.watch === 'tested' ? G.watchTested(s.touches, s.tf) : G.watchNew}><Badge tone="warn"><span className="tip-u">{s.watch === 'tested' ? `Touch ${s.touches + 1} · confirm` : 'New · price far'}</span></Badge></Explain>}
          </div>
          <p className="text-[12.5px] text-ink3 mt-0.5 line-clamp-2 [overflow-wrap:anywhere]">{s.name}{s.sector ? <> · <Explain doc={G.sector(s.sector)}>{s.sector}</Explain></> : ''}</p>
          {listingText(s) && <p className="text-[11.5px] text-ink2 mt-0.5 font-medium"><Explain doc={G.listing(listingText(s))}>{listingText(s)}</Explain></p>}
          <IndexChips codes={s.indexes ?? []} />
        </div>
        <StarButton symbol={s.symbol} on={starred} onToggle={onStar} />
        <div className="text-right shrink-0">
          <div className="num text-[15px] font-semibold"><Explain doc={G.price(s.price, s.currency ?? 'USD')}>{px(s.price)} <span className="text-[10.5px] font-medium text-ink3">{s.currency ?? 'USD'}</span></Explain></div>
          <div className={cx('num text-[11.5px]', Math.abs(away) <= 3 ? 'text-accent' : 'text-ink3')}><Explain doc={toEntryTip(away, s.entry)}>{away >= 0 ? `${num(away, 1)}% above entry` : `${num(-away, 1)}% in the zone`}</Explain></div>
        </div>
      </div>

      <p className="text-[12.5px] text-ink2 leading-relaxed -mt-1">
        <Explain u={false} doc={zoneLineTip(s)}>{s.zone_type_text}. <span className="tip-u">{s.pattern} demand {px(s.distal)}–{px(s.proximal)}, {s.base_candles}-candle base, made {s.made}</span>.</Explain>
      </p>
      <ChainLine s={s} className="-mt-2" />

      <ZoneGauge demand={{ pct: s.demand_pct_away ?? s.to_entry_pct }} supply={s.supply_pct_away != null ? { pct: s.supply_pct_away } : null} state={s.gauge_state ?? 'middle'} />

      {!!bars?.length && <ZoneChart symbol={s.symbol} tf={s.tf} bars={bars} levels={{ proximal: s.proximal, distal: s.distal, entry: s.entry, stop: s.stop, target: s.target, supply: s.next_supply, supplyDistal: s.supply_distal ?? null, price: s.price, fvLo: s.fv_lo, fvHi: s.fv_hi, pz1: s.pz1, pz2: s.pz2 }} />}

      <PlanGrid p={s} />
      <ScoreChips raja={s.score} seiden={s.seiden_score} parts={s.seiden_parts} zone={{ type: s.zone_type, touches: s.touches, curve: s.curve }} />
      <PzChips s={s} />
      <ContextFlags s={s} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink3 -mt-1">
        <Explain doc={G.stopRule(s.stop_pct_of_height, s.tf)}>Stop: distal − {s.stop_pct_of_height}% of the zone</Explain>
        <Explain doc={targetTip(s)}>{s.target_kind === 'projection' ? 'Target: 250% projection target (no supply above, L5)' : <>Target: 0.5% before supply {px(s.next_supply)}</>}</Explain>
        <Explain doc={curveTip(s.curve)}>Curve {Math.round(s.curve)}%</Explain>
        <span><Explain doc={directionTip(s.direction)}>{s.direction}</Explain> · <Explain doc={tfStateTip('W1', s.w1)}>W1 {s.w1}</Explain> · <Explain doc={tfStateTip('MN', s.mn)}>MN {s.mn}</Explain>{s.m3 && <> · <Explain doc={tfStateTip('3M', s.m3)}>3M {s.m3}</Explain></>}</span>
        {ctx6Text(s.ctx6) && <Explain doc={ctx6Tip(ctx6Text(s.ctx6)!)}>{ctx6Text(s.ctx6)}</Explain>}
        <Explain doc={G.earnings(s.earnings || 'unknown')}>Next earnings {s.earnings || 'unknown'} (info)</Explain>
      </div>
      {s.note && <p className="text-[12.5px] text-ink2 leading-relaxed">{s.note}</p>}

      <RuleList rules={s.rules} />
      <FundTable rows={s.fundamentals_rows ?? []} country={s.country} />

      <div className="flex gap-2">
        <Explain control doc={G.planIt}><Link to={planLink(s)} className={cx(s.kind === 'BUY' ? 'btn-primary' : 'btn', 'h-10 flex-1 sm:flex-none')}><Icon name="target" size={15} />Plan it</Link></Explain>
        <Explain control doc={G.tv}><a href={tvChart(s)} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />Chart{homeChart(s) ? ' (US · USD)' : ''}</a></Explain>
        {homeChart(s) && <a href={homeChart(s)!.url} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />{homeChart(s)!.label}</a>}
        <Explain control doc={G.zonesBtn}><Link to={stockPath(s.symbol)} className="btn h-10 flex-1 sm:flex-none" aria-label={`${s.symbol} details`}><Icon name="layers" size={15} />Zones</Link></Explain>
      </div>
    </Card>
  );
}

function WatchList({ syms, onStar }: { syms: string[]; onStar: (s: string) => void }) {
  const { idx } = useScanIndex(true);
  if (!syms.length) return <Card><Empty icon="star" title="Your watchlist is empty">Tap the star on any card or stock page. Starred stocks show here with their zone gauge (kept on this device). For Telegram alerts add them to the WATCHLIST secret.</Empty></Card>;
  const rows = idx?.tickers ?? [];
  return (
    <Card aria-label="Watchlist" className="p-0">
      <ul className="divide-y divide-line">
        {syms.map(sym => {
          const r = rows.find(x => x.s === sym);
          const st = r?.st === 'D' ? 'demand' : r?.st === 'S' ? 'supply' : 'middle';
          return (
            <li key={sym} className="flex items-center gap-3 px-4 sm:px-5 py-3">
              <StarButton symbol={sym} on onToggle={() => onStar(sym)} />
              <Link to={stockPath(sym)} className="min-w-0 flex-1 flex flex-col gap-1.5">
                <span className="flex items-baseline gap-2 min-w-0">
                  <span className="font-semibold text-[15px]">{sym}</span>
                  <span className="text-[12px] text-ink3 truncate flex-1">{r?.n ?? (idx === undefined ? 'Loading…' : 'not in the scan')}</span>
                  {r?.sig && <Explain doc={G.signal(r.sig)} className={cx('text-[11px] font-semibold', r.sig === 'BUY' ? 'text-profit' : 'text-warn')}>{r.sig}</Explain>}
                  {r && <Explain doc={G.price(r.px, r.cur ?? 'USD')} className="num text-[13px]">{px(r.px)}</Explain>}
                </span>
                {r && <ZoneGauge demand={r.dd != null ? { pct: r.dd } : null} supply={r.ds != null ? { pct: r.ds } : null} state={st} />}
              </Link>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/** 0 BUY: the top blocking reasons and the setups closest to their entry, each with the rule that blocks it. */
function NoBuy({ scan, filtered }: { scan: ScanFile; filtered: boolean }) {
  const why = reasonsText(scan.blocked);
  const closest = scan.closest ?? [];
  return (
    <Card aria-label="No buy today" className="p-0">
      <Empty icon="target" title={filtered ? 'No buy setup here today' : 'No BUY today'}>
        {filtered ? 'Nothing for this index or sector. Try All.' : why ? <>Top reasons: {scan.blocked!.reasons.slice(0, 4).map((r, i) => <Fragment key={r.rule}>{i ? ', ' : ''}<Explain doc={blockTip(r.rule)}>{r.label} ({r.count.toLocaleString()})</Explain></Fragment>)}. <Explain doc={{ title: `${scan.blocked!.candidates.toLocaleString()} candidates`, body: `Stocks without a BUY whose nearest fresh demand is within ${num(scan.blocked!.within_pct, 0)}% below the close, or holds it. Each counts once, under the first rule that blocks it (curve → direction → monthly supply → sideways → zone type → fresh → overlap / flip → did its job → 3rd CP → room → near entry; earnings are information only). Diagnostics only.` }}>{scan.blocked!.candidates.toLocaleString()} stocks sit within {num(scan.blocked!.within_pct, 0)}%</Explain> of a fresh demand or inside one, each counted by the first rule that blocks it. No zone, no trade.</> : 'No zone passed every rule. No zone, no trade: waiting is a position.'}
      </Empty>
      {!filtered && !!closest.length && (
        <div className="border-t border-line">
          <h3 className="text-[13px] font-semibold px-4 sm:px-5 pt-3.5 pb-1"><Explain doc={G.closest}>Closest setups</Explain></h3>
          <ul className="divide-y divide-line" aria-label="Closest setups">
            {closest.map(c => (
              <li key={c.symbol}>
                <Link to={stockPath(c.symbol)} className="flex items-center gap-3 px-4 sm:px-5 py-3 min-h-[44px] hover:bg-raised/40">
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2 min-w-0">
                      <span className="font-semibold text-[15px]">{c.symbol}</span>
                      <span className="text-[12px] text-ink3 truncate">{c.name}</span>
                    </span>
                    <span className="block text-[12px] text-ink3 num"><Explain doc={zoneBadgeTip(c.tf, c.zone_type)}>{c.tf} · {c.zone_type} demand {px(c.distal)}–{px(c.proximal)}</Explain></span>
                  </span>
                  <span className="text-right shrink-0">
                    <Explain as="span" doc={toEntryTip(c.to_entry_pct, c.proximal)} className={cx('block num text-[12.5px]', Math.abs(c.to_entry_pct) <= 3 ? 'text-accent' : 'text-ink2')}>{c.to_entry_pct >= 0 ? `${num(c.to_entry_pct, 1)}% above` : 'in the zone'}</Explain>
                    <Explain u={false} doc={blockTip(c.rule, c.fails)} className="inline-block"><Badge tone="warn" className="mt-0.5"><span className="tip-u">{c.label}</span></Badge></Explain>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

function ExitList({ exits }: { exits: ScanExit[] }) {
  if (!exits.length) return <Card><Empty icon="shield" title="No exit warnings">None of your holdings sits near a supply, broke its demand or closed below its stop.</Empty></Card>;
  return (
    <Card aria-label="Exit warnings" className="p-0">
      <ul className="divide-y divide-line">
        {exits.map(e => (
          <li key={e.symbol} className="flex items-center gap-3 px-4 sm:px-5 py-3.5">
            <span className="w-9 h-9 rounded-full bg-warn/15 text-warn grid place-items-center shrink-0"><Icon name="alert" size={16} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-[15px]">{e.symbol}</div>
              <div className="text-[12.5px] text-ink3">{e.reasons.map((r, i) => <Fragment key={r}>{i ? ' · ' : ''}<Explain doc={exitTip(r)}>{EXIT_REASON[r] ?? r}</Explain></Fragment>)}{e.sector ? ` · ${e.sector}` : ''}</div>
            </div>
            <a href={tvChart({ symbol: e.symbol })} target="_blank" rel="noopener noreferrer" className="btn h-10 px-3.5 text-xs" aria-label={`${e.symbol} chart`}><Icon name="link" size={13} />Chart</a>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-ink3 px-4 sm:px-5 pb-4 pt-1"><Explain doc={G.exitEmpty}>Entries, stops and sizes stay private</Explain>: the full warning goes only to your Telegram.</p>
    </Card>
  );
}

export default function Scanner() {
  const [load, retry] = useScan();
  const mobile = useIsMobile();
  const [pill, setPillState] = useState<Pill>(readPill);
  const setPill = (v: Pill) => { setPillState(v); savePill(v); };
  const [idx, setIdxState] = useState<IndexFilter>(readIdx);
  const setIdx = (v: IndexFilter) => { setIdxState(v); saveIdx(v); };
  const [sector, setSector] = useState('all');
  // a link like /scanner?view=map&b=near_demand (Telegram's "+N more on the app") opens that view and bucket
  const [sp] = useSearchParams();
  const qb = sp.get('b');
  const linkBucket = isBucket(qb) ? qb : qb && qb in CODE_BUCKET ? CODE_BUCKET[qb as keyof typeof CODE_BUCKET] : null;
  const [view, setViewState] = useState<View>(() => (sp.get('view') === 'map' || linkBucket ? 'map' : sp.get('view') === 'signals' ? 'signals' : readView()));
  const setView = (v: View) => { setViewState(v); saveView(v); };
  const scan = load.state === 'ok' ? load.scan : null;
  const { idx: tickIdx } = useScanIndex(view === 'map');
  const indexes = indexesOf(scan);
  const mapSectors = useMemo(() => rowSectors(tickIdx?.tickers ?? []).map(sector => ({ sector })), [tickIdx]);
  const uncoveredN = scan?.uncovered?.length ?? 0;
  const shown = useMemo(() => (scan ? scan.signals.filter(s => matches(s, idx, sector)) : []), [scan, idx, sector]);
  const exits = useMemo(() => (scan ? scan.exits.filter(e => matches(e, idx, sector)) : []), [scan, idx, sector]);
  const [sort, setSort] = useState<SortKey>('score');
  const watch = useWatchlist();
  const list = sortSignals(shown.filter(s => s.kind === pill), sort);
  const sectors = useMemo(() => (scan ? sectorsOf(scan) : []), [scan]);
  const count = (k: 'BUY' | 'WATCH') => shown.filter(s => s.kind === k).length;
  const has = !!scan && !!scan.generated_at;

  return (
    <Page>
      <ScannerSwitch />
      <TickerSearch />

      <Card className="luxe-border">
        <div className="flex flex-col gap-3">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">US stock zone scan</h2>
            <p className="text-[13px] text-ink2 mt-1 leading-relaxed max-w-[62ch]">{indexList(indexes)} after each US close: fresh W1 / MN / 3M demand zones (top-down: each inside a touched higher area) checked rule by rule (Raja first, Kevin second), plus exit warnings for your holdings.</p>
          </div>
          {scan?.fixture && <Explain u={false} doc={G.fixture} className="self-start"><Badge tone="warn"><span className="tip-u">Sample data · synthetic fixture</span></Badge></Explain>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {has ? <>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} /><Explain doc={G.updated(ago(scan!.generated_at))}>Updated {new Date(scan!.generated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · {ago(scan!.generated_at)}</Explain></span>
              <Explain doc={G.scanned(scan!.date, scan!.scanned, scan!.universe)} className="num">Close of {scan!.date} · {scan!.scanned.toLocaleString()}/{scan!.universe.toLocaleString()} stocks</Explain>
              {scan!.session === 'intraday-dropped' && <Explain doc={G.intraday} className="text-warn">Ran during market hours: last closed session used</Explain>}
              {!!scan!.data_warning && <span role="alert" className="text-warn font-medium">{scan!.data_warning}</span>}
              {!!uncoveredN && <Explain doc={G.uncovered(uncoveredN, scan!.uncovered!.map(u => u.symbol).join(', '))}>{uncoveredN} TSX-only names need a TSX data feed</Explain>}
            </> : load.state === 'loading' ? <span>Loading the latest scan…</span> : load.state === 'error' ? <span>The scan could not be loaded.</span> : <span>No scan has run yet.</span>}
          </div>
          {has && (!!scan!.regime?.length || scan!.rfx_index) && (
            <details className="group rounded-xl border border-line/70 bg-raised/30 px-3" open={!mobile}>
              <summary className="flex items-center gap-2 min-h-[44px] cursor-pointer list-none select-none text-[13px]">
                <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3 shrink-0" />
                <span className="font-semibold">Market</span>
                <span className="min-w-0 flex-1 flex flex-wrap items-center justify-end gap-x-2.5 gap-y-0.5 text-[12px] num">
                  {scan!.regime!.map(r => <Explain inert u={false} key={r.symbol} doc={G.above200(r)} className="whitespace-nowrap"><span className="text-ink2">{r.symbol}</span> <span role="img" className={r.above200 ? 'text-profit' : r.above200 === false ? 'text-loss' : 'text-ink3'} aria-label={r.above200 ? 'above the 200-day average' : r.above200 === false ? 'below the 200-day average' : 'no 200-day average'}>{r.above200 ? '▲' : r.above200 === false ? '▼' : '—'}</span></Explain>)}
                  {scan!.rfx_index && <Explain inert u={false} doc={rfxTip(scan!.rfx_index)} className="whitespace-nowrap text-ink2">RFX <span className={scan!.rfx_index.state === 'demand' ? 'text-profit' : scan!.rfx_index.state === 'supply' ? 'text-loss' : 'text-ink3'}>{stateWord(scan!.rfx_index.state).toLowerCase()}</span></Explain>}
                </span>
              </summary>
              <div className="flex flex-col gap-2 pb-3">
                {!!scan!.regime?.length && (
                  <div className="grid grid-cols-3 gap-2" aria-label="Market regime">
                    {scan!.regime!.map(r => (
                      <div key={r.symbol} className="rounded-xl border border-line/70 bg-raised/40 px-2.5 py-2 min-w-0">
                        <div className="flex items-center gap-x-1.5 flex-wrap"><Explain doc={G.regime(r)} className="font-semibold text-[13px]">{r.symbol}</Explain><Explain doc={G.above200(r)} className={cx('text-[11px] font-semibold whitespace-nowrap', r.above200 ? 'text-profit' : r.above200 === false ? 'text-loss' : 'text-ink3')}>{r.above200 ? '▲ 200D' : r.above200 === false ? '▼ 200D' : '—'}</Explain></div>
                        <div className="text-[11px] text-ink3 num"><Explain doc={curveTip(r.curve, r.curve_raja)}>MN curve {r.curve != null ? `${Math.round(r.curve)}%` : '—'}</Explain></div>
                        <Explain as="div" doc={directionTip(r.direction)} className="text-[10.5px] text-ink2 leading-tight line-clamp-3 mt-0.5">{r.direction}</Explain>
                      </div>
                    ))}
                  </div>
                )}
                {scan!.rfx_index && <RfxPanel ix={scan!.rfx_index} />}
              </div>
            </details>
          )}
          <p className="flex gap-1.5 text-[12px] leading-relaxed text-warn">
            <Icon name="alert" size={14} className="shrink-0 mt-[3px]" />
            <span>{scan?.disclaimer ?? 'Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.'} The rules were built for forex charts; check every chart yourself.</span>
          </p>
        </div>
      </Card>

      {load.state === 'loading' && <div className="skeleton h-64 rounded-2xl" aria-busy="true" aria-label="Loading" />}
      {load.state === 'error' && <Card><Empty icon="cloudOff" title="Could not load the scan" action={<button type="button" className="btn h-11 px-5" onClick={retry}><Icon name="refresh" size={15} />Try again</button>}>{navigator.onLine ? 'The scan file is missing or unreadable. It is written by the daily GitHub workflow.' : 'You are offline. The scan needs a connection once.'}</Empty></Card>}
      {load.state === 'ok' && !has && <Card><Empty icon="search" title="No scan yet">The first scan runs on the next weekday after the US close (21:45 UTC). Results land here and in Telegram.</Empty></Card>}

      {has && scan && (
        <>
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="View" value={view} onChange={setView} options={[{ value: 'signals' as View, label: 'Signals' }, { value: 'map' as View, label: 'Market map' }]} />
              <InfoDot doc={G.views} label="About Signals and Market map" />
            </div>
            {view === 'signals' && <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="Signals" value={pill} onChange={setPill} swap="page" options={[
                { value: 'BUY', label: `Buy ${count('BUY')}` },
                { value: 'WATCH', label: `Watch ${count('WATCH')}` },
                { value: 'EXIT', label: `Exit ${exits.length}` },
                { value: 'STAR', label: `★ ${watch.list.length}` },
              ]} />
              <InfoDot doc={G.pills(count('BUY'), count('WATCH'), exits.length, watch.list.length)} label="About the signal lists" />
            </div>}
            <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="Index" size="sm" value={idx} onChange={setIdx} options={[{ value: 'all' as IndexFilter, label: 'All' }, ...indexes.map(i => ({ value: i.code as IndexFilter, label: i.label }))]} />
              <InfoDot doc={G.indexFilter} label="About the index filter" />
            </div>
            {view === 'signals' && (pill === 'BUY' || pill === 'WATCH') && (
              <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
                <span className="text-[12px] text-ink3 shrink-0">Sort</span>
                <Segmented label="Sort" size="sm" value={sort} onChange={setSort} options={[{ value: 'score', label: 'Raja' }, { value: 'seiden', label: 'Seiden' }, { value: 'near', label: 'Nearest' }, { value: 'rr', label: 'R:R' }]} />
                <InfoDot doc={G.sort} label="About sorting" />
              </div>
            )}
            {view === 'signals' ? <SectorPills sectors={sectors} sector={sector} setSector={setSector} allCount={count('BUY')} />
              : <SectorPills sectors={mapSectors} sector={sector} setSector={setSector} />}
          </div>
          {view === 'map' ? <MarketMap rows={tickIdx?.tickers ?? null} idx={idx} sector={sector} loading={tickIdx === undefined} initial={linkBucket} /> : pill === 'STAR' ? <WatchList syms={watch.list} onStar={watch.toggle} /> : pill === 'EXIT' ? <ExitList exits={exits} /> : list.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">{list.map(s => <SignalCard key={`${s.kind}${s.symbol}${s.tf}${s.made}`} s={s} bars={scan.bars?.[s.symbol]} starred={watch.has(s.symbol)} onStar={() => watch.toggle(s.symbol)} />)}</div>
          ) : pill === 'BUY' ? <NoBuy scan={scan} filtered={idx !== 'all' || sector !== 'all'} /> : (
            <Card><Empty icon="eye" title="Nothing to watch here">
              {idx !== 'all' || sector !== 'all' ? 'Nothing for this index or sector. Try All.' : 'No new strong zone and no tested zone that needs a confirmation.'}
            </Empty></Card>
          )}
        </>
      )}
    </Page>
  );
}
