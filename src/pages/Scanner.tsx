import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ago, EXIT_REASON, INDEXES, matches, parseScan, planLink, SCAN_URL, SECTOR_SHORT, sectorsOf, sortSignals, stockPath, tvChart, type IndexFilter, type ScanExit, type ScanFile, type ScanSignal, type SortKey } from '@/core/scanner';
import { num } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Segmented, Stat } from '@/ui/kit';
import type { MiniBar } from '@/ui/ZoneMiniChart';
import { ContextFlags, FundTable, IDX_SHORT, PzChips, RfxPanel, RuleList, ScoreChips, StarButton, TickerSearch, typeTone, useScanIndex, useWatchlist, ZoneChart } from '@/ui/ScanParts';
import { ZoneGauge } from '@/ui/ZoneGauge';
import { Icon } from '@/ui/Icon';

type Pill = 'BUY' | 'WATCH' | 'EXIT' | 'STAR';
const KEY = 'rfx_scanner_pill';
const readPill = (): Pill => { try { const v = localStorage.getItem(KEY); return v === 'WATCH' || v === 'EXIT' || v === 'STAR' ? v : 'BUY'; } catch { return 'BUY'; } };
const savePill = (v: Pill) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };
const IDX_KEY = 'rfx_scanner_index';
const readIdx = (): IndexFilter => { try { const v = localStorage.getItem(IDX_KEY); return v === 'SPX' || v === 'NDX' || v === 'DJI' || v === 'RUT' ? v : 'all'; } catch { return 'all'; } };
const saveIdx = (v: IndexFilter) => { try { localStorage.setItem(IDX_KEY, v); } catch { /* storage blocked */ } };

type Load = { state: 'loading' } | { state: 'ok'; scan: ScanFile | null } | { state: 'error' };

function useScan(): Load {
  const [s, setS] = useState<Load>({ state: 'loading' });
  useEffect(() => {
    let live = true;
    fetch(SCAN_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setS({ state: 'ok', scan: parseScan(js) }); })
      .catch(() => { if (live) setS({ state: 'error' }); });
    return () => { live = false; };
  }, []);
  return s;
}

function SignalCard({ s, bars, starred, onStar }: { s: ScanSignal; bars?: MiniBar[]; starred: boolean; onStar: () => void }) {
  const away = s.to_entry_pct;
  return (
    <Card aria-label={`${s.kind} ${s.symbol}`} className="flex flex-col gap-3.5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[18px] font-semibold tracking-tight"><Link to={stockPath(s.symbol)} className="hover:text-accent underline-offset-4 hover:underline">{s.symbol}</Link></h3>
            <Badge tone={typeTone(s.zone_type)}>{s.tf} · {s.zone_type}</Badge>
            {s.kind === 'WATCH' && <Badge tone="warn">{s.watch === 'tested' ? `Touch ${s.touches + 1} · confirm` : 'New · price far'}</Badge>}
          </div>
          <p className="text-[12.5px] text-ink3 mt-0.5 truncate">{s.name}{s.sector ? ` · ${s.sector}` : ''}</p>
          {!!s.indexes?.length && <div className="flex gap-1 mt-1.5 flex-wrap" aria-label="Indexes">{s.indexes.map(i => <span key={i} className="h-5 px-1.5 rounded-md border border-line text-[10.5px] font-semibold text-ink2 grid place-items-center">{IDX_SHORT[i] ?? i}</span>)}</div>}
        </div>
        <StarButton symbol={s.symbol} on={starred} onToggle={onStar} />
        <div className="text-right shrink-0">
          <div className="num text-[15px] font-semibold">{num(s.price)}</div>
          <div className={cx('num text-[11.5px]', Math.abs(away) <= 3 ? 'text-accent' : 'text-ink3')}>{away >= 0 ? `${num(away, 1)}% above entry` : `${num(-away, 1)}% in the zone`}</div>
        </div>
      </div>

      <p className="text-[12.5px] text-ink2 leading-relaxed -mt-1">
        {s.zone_type_text}. {s.pattern} demand {num(s.distal)}–{num(s.proximal)}, {s.base_candles}-candle base, made {s.made}.
      </p>

      <ZoneGauge demand={{ pct: s.demand_pct_away ?? s.to_entry_pct }} supply={s.supply_pct_away != null ? { pct: s.supply_pct_away } : null} state={s.gauge_state ?? 'middle'} />

      {!!bars?.length && <ZoneChart symbol={s.symbol} tf={s.tf} bars={bars} levels={{ proximal: s.proximal, distal: s.distal, entry: s.entry, stop: s.stop, target: s.target, supply: s.next_supply, supplyDistal: s.supply_distal ?? null, price: s.price, fvLo: s.fv_lo, fvHi: s.fv_hi, pz1: s.pz1, pz2: s.pz2 }} />}

      <div className="grid grid-cols-4 gap-2 rounded-xl bg-raised/50 border border-line/70 p-3">
        <Stat label="Entry" value={num(s.entry)} />
        <Stat label="Stop" value={num(s.stop)} className="text-loss" />
        <Stat label="Target" value={s.target != null ? num(s.target) : '—'} className="text-profit" />
        <Stat label="R:R" value={s.rr != null ? `${num(s.rr, 1)}` : '—'} />
      </div>
      <ScoreChips raja={s.score} seiden={s.seiden_score} parts={s.seiden_parts} />
      <PzChips s={s} />
      <ContextFlags s={s} />
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink3 -mt-1">
        <span>Stop: distal − {s.stop_pct_of_height}% of the zone</span>
        <span>Target: 0.5% before supply {s.next_supply != null ? num(s.next_supply) : '—'}</span>
        <span>Curve {Math.round(s.curve)}%</span>
        <span>{s.direction} · W1 {s.w1} · MN {s.mn}</span>
        {s.earnings && <span>Earnings {s.earnings}</span>}
      </div>
      {s.note && <p className="text-[12.5px] text-ink2 leading-relaxed">{s.note}</p>}

      <RuleList rules={s.rules} open={s.kind === 'BUY'} />
      <FundTable rows={s.fundamentals_rows ?? []} />

      <div className="flex gap-2">
        <Link to={planLink(s)} className={cx(s.kind === 'BUY' ? 'btn-primary' : 'btn', 'h-10 flex-1 sm:flex-none')}><Icon name="target" size={15} />Plan it</Link>
        <a href={tvChart(s)} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />Chart</a>
        <Link to={stockPath(s.symbol)} className="btn h-10 flex-1 sm:flex-none" aria-label={`${s.symbol} details`}><Icon name="layers" size={15} />Zones</Link>
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
                  {r?.sig && <span className={cx('text-[11px] font-semibold', r.sig === 'BUY' ? 'text-profit' : 'text-warn')}>{r.sig}</span>}
                  {r && <span className="num text-[13px]">{num(r.px)}</span>}
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
              <div className="text-[12.5px] text-ink3">{e.reasons.map(r => EXIT_REASON[r] ?? r).join(' · ')}{e.sector ? ` · ${e.sector}` : ''}</div>
            </div>
            <a href={tvChart({ symbol: e.symbol })} target="_blank" rel="noopener noreferrer" className="btn h-9 px-3 text-xs" aria-label={`${e.symbol} chart`}><Icon name="link" size={13} />Chart</a>
          </li>
        ))}
      </ul>
      <p className="text-[12px] text-ink3 px-4 sm:px-5 pb-4 pt-1">Entries, stops and sizes stay private: the full warning goes only to your Telegram.</p>
    </Card>
  );
}

export default function Scanner() {
  const load = useScan();
  const [pill, setPillState] = useState<Pill>(readPill);
  const setPill = (v: Pill) => { setPillState(v); savePill(v); };
  const [idx, setIdxState] = useState<IndexFilter>(readIdx);
  const setIdx = (v: IndexFilter) => { setIdxState(v); saveIdx(v); };
  const [sector, setSector] = useState('all');
  const scan = load.state === 'ok' ? load.scan : null;
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
      <Card className="luxe-border">
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold tracking-tight">US stock zone scan</h2>
              <p className="text-[13px] text-ink2 mt-1 leading-relaxed max-w-[62ch]">S&amp;P 500, Nasdaq-100, Dow 30 and Russell 2000 after each US close: fresh D1 / W1 demand zones checked rule by rule (Raja first, Kevin second), plus exit warnings for your holdings.</p>
            </div>
          </div>
          {scan?.fixture && <Badge tone="warn" className="self-start">Sample data · synthetic fixture</Badge>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {has ? <>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />Updated {new Date(scan!.generated_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} · {ago(scan!.generated_at)}</span>
              <span className="num">Close of {scan!.date} · {scan!.scanned}/{scan!.universe} stocks</span>
              {!!scan!.filtered_liquidity && <span title={scan!.liquidity_rule}>{scan!.filtered_liquidity} illiquid small caps skipped</span>}
            </> : load.state === 'loading' ? <span>Loading the latest scan…</span> : <span>No scan has run yet.</span>}
          </div>
          {has && !!scan!.regime?.length && (
            <div className="grid grid-cols-3 gap-2" aria-label="Market regime">
              {scan!.regime!.map(r => (
                <div key={r.symbol} className="rounded-xl border border-line/70 bg-raised/40 px-2.5 py-2 min-w-0">
                  <div className="flex items-center gap-1.5"><span className="font-semibold text-[13px]">{r.symbol}</span><span className={cx('text-[11px] font-semibold', r.above200 ? 'text-profit' : r.above200 === false ? 'text-loss' : 'text-ink3')}>{r.above200 ? '▲ 200D' : r.above200 === false ? '▼ 200D' : '—'}</span></div>
                  <div className="text-[11px] text-ink3 num">MN curve {r.curve != null ? `${Math.round(r.curve)}%` : '—'}</div>
                  <div className="text-[10.5px] text-ink2 leading-tight line-clamp-2 mt-0.5">{r.direction}</div>
                </div>
              ))}
            </div>
          )}
          {has && scan!.rfx_index && <RfxPanel ix={scan!.rfx_index} />}
          <p className="text-[12px] leading-relaxed text-warn bg-warn/10 border border-warn/25 rounded-xl px-3 py-2">
            {scan?.disclaimer ?? 'Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.'} The rules were built for forex charts; check every chart yourself.
          </p>
        </div>
      </Card>

      <TickerSearch />

      {load.state === 'loading' && <div className="skeleton h-64 rounded-2xl" aria-busy="true" aria-label="Loading" />}
      {load.state === 'error' && <Card><Empty icon="cloudOff" title="Could not load the scan">{navigator.onLine ? 'The scan file is missing or unreadable. It is written by the daily GitHub workflow.' : 'You are offline. The scan needs a connection once.'}</Empty></Card>}
      {load.state === 'ok' && !has && <Card><Empty icon="search" title="No scan yet">The first scan runs on the next weekday after the US close (21:45 UTC). Results land here and in Telegram.</Empty></Card>}

      {has && scan && (
        <>
          <div className="flex flex-col gap-2.5">
            <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="Signals" value={pill} onChange={setPill} swap="page" options={[
                { value: 'BUY', label: `Buy ${count('BUY')}` },
                { value: 'WATCH', label: `Watch ${count('WATCH')}` },
                { value: 'EXIT', label: `Exit ${exits.length}` },
                { value: 'STAR', label: `★ ${watch.list.length}` },
              ]} />
            </div>
            <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="Index" size="sm" value={idx} onChange={setIdx} options={[{ value: 'all' as IndexFilter, label: 'All' }, ...INDEXES.map(i => ({ value: i.value as IndexFilter, label: i.label }))]} />
            </div>
            {(pill === 'BUY' || pill === 'WATCH') && (
              <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
                <span className="text-[12px] text-ink3 shrink-0">Sort</span>
                <Segmented label="Sort" size="sm" value={sort} onChange={setSort} options={[{ value: 'score', label: 'Raja' }, { value: 'seiden', label: 'Seiden' }, { value: 'near', label: 'Nearest' }, { value: 'rr', label: 'R:R' }]} />
              </div>
            )}
            {sectors.length > 1 && (
              <div role="group" aria-label="Sector" className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
                {[{ sector: 'all', buys: count('BUY'), total: 0 }, ...sectors].map(x => {
                  const on = sector === x.sector;
                  return (
                    <button key={x.sector} type="button" aria-pressed={on} onClick={() => setSector(x.sector)}
                      className={cx('h-8 touch:h-9 px-3 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 transition-colors', on ? 'bg-accent/15 border-accent/40 text-ink' : 'border-line text-ink3 hover:text-ink2')}>
                      {x.sector === 'all' ? 'All sectors' : SECTOR_SHORT[x.sector] ?? x.sector}{x.sector !== 'all' && x.buys ? <span className="num text-accent ml-1">{x.buys}</span> : null}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {pill === 'STAR' ? <WatchList syms={watch.list} onStar={watch.toggle} /> : pill === 'EXIT' ? <ExitList exits={exits} /> : list.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">{list.map(s => <SignalCard key={`${s.kind}${s.symbol}${s.tf}${s.made}`} s={s} bars={scan.bars?.[s.symbol]} starred={watch.has(s.symbol)} onStar={() => watch.toggle(s.symbol)} />)}</div>
          ) : (
            <Card><Empty icon={pill === 'BUY' ? 'target' : 'eye'} title={pill === 'BUY' ? 'No buy setup here today' : 'Nothing to watch here'}>
              {idx !== 'all' || sector !== 'all' ? 'Nothing for this index or sector. Try All.' : pill === 'BUY' ? 'No zone passed every rule. No zone, no trade: waiting is a position.' : 'No new strong zone and no tested zone that needs a confirmation.'}
            </Empty></Card>
          )}
        </>
      )}
    </Page>
  );
}
