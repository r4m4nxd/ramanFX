import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ago, EXIT_REASON, INDEXES, matches, parseScan, planLink, ruleIcon, SCAN_URL, SECTOR_SHORT, sectorsOf, tvChart, type IndexFilter, type RuleStatus, type ScanExit, type ScanFile, type ScanSignal } from '@/core/scanner';
import { num } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, Segmented, Sheet, Stat } from '@/ui/kit';
import { ZoneMiniChart, type MiniBar, type MiniLevels } from '@/ui/ZoneMiniChart';
import { Icon } from '@/ui/Icon';

type Pill = 'BUY' | 'WATCH' | 'EXIT';
const KEY = 'rfx_scanner_pill';
const readPill = (): Pill => { try { const v = localStorage.getItem(KEY); return v === 'WATCH' || v === 'EXIT' ? v : 'BUY'; } catch { return 'BUY'; } };
const savePill = (v: Pill) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };
const IDX_KEY = 'rfx_scanner_index';
const readIdx = (): IndexFilter => { try { const v = localStorage.getItem(IDX_KEY); return v === 'SPX' || v === 'NDX' || v === 'DJI' || v === 'RUT' ? v : 'all'; } catch { return 'all'; } };
const saveIdx = (v: IndexFilter) => { try { localStorage.setItem(IDX_KEY, v); } catch { /* storage blocked */ } };
const IDX_SHORT: Record<string, string> = { SPX: 'S&P', NDX: 'NDX', DJI: 'Dow', RUT: 'R2K' };

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

const RULE_TONE: Record<RuleStatus, string> = { pass: 'text-profit bg-profit/10', fail: 'text-loss bg-loss/10', warn: 'text-warn bg-warn/10', unknown: 'text-ink3 bg-raised' };
const typeTone = (t: string) => (t === 'ARR' || t === 'WOW' ? 'accent' : t === 'STR' ? 'violet' : 'neutral') as 'accent' | 'violet' | 'neutral';

function Rules({ s }: { s: ScanSignal }) {
  const n = s.rules.length;
  const ok = s.rules.filter(r => r.status === 'pass').length;
  const bad = s.rules.filter(r => r.status === 'fail').length;
  return (
    <details className="group rounded-xl border border-line px-3" open={s.kind === 'BUY'}>
      <summary className="flex items-center gap-2 min-h-[44px] cursor-pointer list-none text-[13px] font-semibold select-none">
        <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3 shrink-0" />
        <span className="flex-1">Rules checked</span>
        <span className="num text-xs font-medium text-ink3">{ok}/{n} pass{bad ? ` · ${bad} fail` : ''}</span>
      </summary>
      <ul className="pb-3 flex flex-col gap-1.5">
        {s.rules.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed">
            <span aria-label={r.status} className={cx('w-5 h-5 rounded-full grid place-items-center shrink-0 text-[11px] font-bold mt-px', RULE_TONE[r.status])}>{ruleIcon[r.status]}</span>
            <span className="min-w-0 flex-1 text-ink2 [overflow-wrap:anywhere]">{r.text}</span>
            <span className="num text-[11px] text-ink3 shrink-0 mt-px max-w-[34%] text-right">{r.ref}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Fundamentals({ s }: { s: ScanSignal }) {
  const rows = s.fundamentals_rows ?? [];
  if (!rows.length) return null;
  return (
    <details className="group rounded-xl border border-line px-3">
      <summary className="flex items-center gap-2 min-h-[44px] cursor-pointer list-none text-[13px] font-semibold select-none">
        <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3 shrink-0" />
        <span className="flex-1">Fundamentals</span>
        <span className="text-[11px] font-medium text-ink3">context only · SEC filings</span>
      </summary>
      <table className="w-full text-[12.5px] mb-3">
        <tbody className="divide-y divide-line">
          {rows.map(([k, v]) => (
            <tr key={k}><th scope="row" className="text-left font-medium text-ink3 py-1.5 pr-3 whitespace-nowrap align-top">{k}</th><td className="num text-ink py-1.5 text-right [overflow-wrap:anywhere]">{v}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11.5px] text-ink3 pb-3 -mt-1">Not part of the supply and demand rules. A signal never depends on these numbers.</p>
    </details>
  );
}

const levelsOf = (s: ScanSignal): MiniLevels => ({ proximal: s.proximal, distal: s.distal, entry: s.entry, stop: s.stop, target: s.target, supply: s.next_supply, supplyDistal: s.supply_distal ?? null, price: s.price });

function ZoneChart({ s, bars }: { s: ScanSignal; bars?: MiniBar[] }) {
  const [big, setBig] = useState(false);
  if (!bars?.length) return null;
  const label = `${s.symbol} daily chart: demand ${s.distal} to ${s.proximal}, entry ${s.entry}, stop ${s.stop}${s.target != null ? `, target ${s.target}` : ''}`;
  return (
    <>
      <button type="button" onClick={() => setBig(true)} aria-label={`Enlarge the ${s.symbol} chart`} className="block w-full rounded-xl border border-line/70 bg-raised/30 p-1.5 press">
        <ZoneMiniChart bars={bars.slice(-60)} levels={levelsOf(s)} label={label} />
      </button>
      <Sheet open={big} onClose={() => setBig(false)} title={`${s.symbol} · last ${bars.length} sessions`} width={760}>
        <ZoneMiniChart bars={bars} levels={levelsOf(s)} height={280} label={label} />
        <p className="text-[12px] text-ink3 mt-3">Green: the {s.tf} demand zone. Red: the next supply (target zone). Dashed: entry (E), stop (S), target (T). P = last close. Daily bars, split and dividend adjusted.</p>
      </Sheet>
    </>
  );
}

function SignalCard({ s, bars }: { s: ScanSignal; bars?: MiniBar[] }) {
  const away = s.to_entry_pct;
  return (
    <Card aria-label={`${s.kind} ${s.symbol}`} className="flex flex-col gap-3.5 p-4 sm:p-5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[18px] font-semibold tracking-tight">{s.symbol}</h3>
            <Badge tone={typeTone(s.zone_type)}>{s.tf} · {s.zone_type}</Badge>
            {s.score != null && <Badge className="num">Score {s.score}/10</Badge>}
            {s.kind === 'WATCH' && <Badge tone="warn">{s.watch === 'tested' ? `Touch ${s.touches + 1} · confirm` : 'New · price far'}</Badge>}
          </div>
          <p className="text-[12.5px] text-ink3 mt-0.5 truncate">{s.name}{s.sector ? ` · ${s.sector}` : ''}</p>
          {!!s.indexes?.length && <div className="flex gap-1 mt-1.5 flex-wrap" aria-label="Indexes">{s.indexes.map(i => <span key={i} className="h-5 px-1.5 rounded-md border border-line text-[10.5px] font-semibold text-ink2 grid place-items-center">{IDX_SHORT[i] ?? i}</span>)}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="num text-[15px] font-semibold">{num(s.price)}</div>
          <div className={cx('num text-[11.5px]', Math.abs(away) <= 3 ? 'text-accent' : 'text-ink3')}>{away >= 0 ? `${num(away, 1)}% above entry` : `${num(-away, 1)}% in the zone`}</div>
        </div>
      </div>

      <p className="text-[12.5px] text-ink2 leading-relaxed -mt-1">
        {s.zone_type_text}. {s.pattern} demand {num(s.distal)}–{num(s.proximal)}, {s.base_candles}-candle base, made {s.made}.
      </p>

      <ZoneChart s={s} bars={bars} />

      <div className="grid grid-cols-4 gap-2 rounded-xl bg-raised/50 border border-line/70 p-3">
        <Stat label="Entry" value={num(s.entry)} />
        <Stat label="Stop" value={num(s.stop)} className="text-loss" />
        <Stat label="Target" value={s.target != null ? num(s.target) : '—'} className="text-profit" />
        <Stat label="R:R" value={s.rr != null ? `${num(s.rr, 1)}` : '—'} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-ink3 -mt-1">
        <span>Stop: distal − {s.stop_pct_of_height}% of the zone</span>
        <span>Target: 0.5% before supply {s.next_supply != null ? num(s.next_supply) : '—'}</span>
        <span>Curve {Math.round(s.curve)}%</span>
        <span>{s.direction} · W1 {s.w1} · MN {s.mn}</span>
        {s.earnings && <span>Earnings {s.earnings}</span>}
      </div>
      {s.note && <p className="text-[12.5px] text-ink2 leading-relaxed">{s.note}</p>}

      <Rules s={s} />
      <Fundamentals s={s} />

      <div className="flex gap-2">
        <Link to={planLink(s)} className={cx(s.kind === 'BUY' ? 'btn-primary' : 'btn', 'h-10 flex-1 sm:flex-none')}><Icon name="target" size={15} />Plan it</Link>
        <a href={tvChart(s)} target="_blank" rel="noopener noreferrer" className="btn h-10 flex-1 sm:flex-none"><Icon name="link" size={15} />Chart</a>
      </div>
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
  const list = shown.filter(s => s.kind === pill);
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
          <p className="text-[12px] leading-relaxed text-warn bg-warn/10 border border-warn/25 rounded-xl px-3 py-2">
            {scan?.disclaimer ?? 'Rule-based scan, not financial advice. Untested on stocks until the backtest says otherwise.'} The rules were built for forex charts; check every chart yourself.
          </p>
        </div>
      </Card>

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
              ]} />
            </div>
            <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
              <Segmented label="Index" size="sm" value={idx} onChange={setIdx} options={[{ value: 'all' as IndexFilter, label: 'All' }, ...INDEXES.map(i => ({ value: i.value as IndexFilter, label: i.label }))]} />
            </div>
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
          {pill === 'EXIT' ? <ExitList exits={exits} /> : list.length ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">{list.map(s => <SignalCard key={`${s.kind}${s.symbol}${s.tf}${s.made}`} s={s} bars={scan.bars?.[s.symbol]} />)}</div>
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
