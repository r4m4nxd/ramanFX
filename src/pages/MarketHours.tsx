import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Badge, Card, CardHead, cx, Empty, Page, Segmented } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import {
  findSymbol, fmtX, isFx, KIND_LABEL, MH_SLOTS, MH_URL, nyOf, parseMarketHours, searchSymbols, slotLabel, WEEKDAYS,
  type MhEvent, type MhFile, type MhFilter, type MhSymbol, type Reliability,
} from '@/core/marketHours';

type Load = { state: 'loading' } | { state: 'ok'; file: MhFile } | { state: 'error' };
const FILTERS: { value: MhFilter; label: string }[] = [
  { value: 'all', label: 'All' }, { value: 'fx', label: 'Forex' }, { value: 'metal', label: 'Metals' }, { value: 'cfd', label: 'CFDs' }, { value: 'stock', label: 'Stocks' },
];
const when = (s: string) => s.replace(' UTC', '') || '–';

function RelBadge({ rel, what }: { rel: Reliability; what: string }) {
  return rel === 'reliable'
    ? <Badge tone="profit" className="!h-5 !px-2 !text-[10.5px]">{what}: reliable</Badge>
    : <Badge tone="warn" className="!h-5 !px-2 !text-[10.5px]">{what}: weak</Badge>;
}

/** Mon-Fri activity per Calgary half-hour; the best windows in full accent, the rest muted. */
function Profile({ s }: { s: MhSymbol }) {
  const [hover, setHover] = useState<number | null>(null);
  const vals = s.profile;
  const max = Math.max(1.2, ...vals.map(v => v ?? 0));
  const inWin = (i: number) => s.windows.some(w => {
    const a = slotIndex(w.from), b = slotIndex(w.to);
    return a <= b ? i >= a && i < b : i >= a || i < b;
  });
  const W = 480, H = 132, top = 6, bottom = 2, bw = W / vals.length;
  const y = (v: number) => top + (H - top - bottom) * (1 - v / max);
  const h = hover ?? (s.windows[0] ? slotIndex(s.windows[0].mt) : null);
  const peak = s.windows[0];
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-1.5 min-h-[20px]">
        <span className="text-[12px] text-ink3">Activity by half-hour, Mon–Fri (1.0× = typical)</span>
        {h != null && <span className="num text-[12px] text-ink2 shrink-0">{slotLabel(h)} <span className="text-ink3">({nyOf(slotLabel(h))} NY)</span> · <b className="text-ink">{fmtX(vals[h])}</b></span>}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full h-32 md:h-40 block" role="img"
        aria-label={`${s.sym} activity by Calgary half-hour${peak ? `; peak ${peak.mt} at ${fmtX(peak.activity)}` : ''}`}
        onPointerLeave={() => setHover(null)}>
        <line x1={0} x2={W} y1={y(1)} y2={y(1)} className="stroke-line2" strokeDasharray="3 3" strokeWidth={1} />
        {vals.map((v, i) => (
          <g key={i} onPointerEnter={() => setHover(i)}>
            <rect x={i * bw} y={top} width={bw} height={H - top - bottom} fill="transparent" />
            {v != null && v > 0 && (
              <rect x={i * bw + 1} y={y(v)} width={Math.max(1, bw - 2)} height={Math.max(1, H - bottom - y(v))}
                className={cx(inWin(i) ? 'fill-accent' : 'fill-ink3', hover === i && 'opacity-100')}
                opacity={inWin(i) ? (hover === i || hover == null ? 1 : 0.85) : hover === i ? 0.75 : 0.35} />
            )}
            <title>{`${slotLabel(i)} Calgary (${nyOf(slotLabel(i))} New York): ${fmtX(v)}`}</title>
          </g>
        ))}
      </svg>
      <div className="relative h-4 mt-1 text-[10.5px] text-ink3 num" aria-hidden="true">
        {[0, 12, 24, 36].map(i => <span key={i} className="absolute" style={{ left: `${(100 * i) / MH_SLOTS}%` }}>{slotLabel(i)}</span>)}
        <span className="absolute right-0">Calgary</span>
      </div>
    </div>
  );
}

const slotIndex = (t: string) => { const [a, b] = t.split(':').map(Number); return a * 2 + (b >= 30 ? 1 : 0); };

function Days({ s }: { s: MhSymbol }) {
  const vals = s.days;
  const max = Math.max(...vals.map(v => v ?? 0), 1);
  return (
    <div className="flex flex-col gap-1.5">
      {WEEKDAYS.map((d, i) => {
        const v = vals[i];
        const best = s.weekday?.best === d, quiet = s.weekday?.quiet === d;
        return (
          <div key={d} className="grid grid-cols-[36px_minmax(0,1fr)_52px] items-center gap-2 text-[12.5px]">
            <span className={cx('font-medium', best ? 'text-ink' : 'text-ink3')}>{d}</span>
            <div className="h-2 rounded-full bg-line overflow-hidden">
              <div className={cx('h-full rounded-full', best ? 'bg-accent' : quiet ? 'bg-ink3/40' : 'bg-ink3/70')} style={{ width: `${v ? (100 * v) / max : 0}%` }} />
            </div>
            <span className="num text-right text-ink2">{fmtX(v)}</span>
          </div>
        );
      })}
    </div>
  );
}

function EventRow({ label, e, note }: { label: string; e: MhEvent | null; note: string }) {
  if (!e) return null;
  return (
    <div className="flex items-baseline justify-between gap-3 py-2 border-t border-line first:border-t-0">
      <div className="min-w-0"><div className="text-[13px] font-medium">{label}</div><div className="text-[11.5px] text-ink3">{note}</div></div>
      <div className="text-right shrink-0">
        <div className={cx('num text-[15px] font-semibold', e.ratio >= 1.5 ? 'text-accent' : 'text-ink')}>{fmtX(e.ratio)}</div>
        <div className="num text-[11px] text-ink3">{e.days} days{e.bigPct != null && e.bigCtrlPct != null ? ` · big ${e.bigPct}% vs ${e.bigCtrlPct}%` : ''}</div>
      </div>
    </div>
  );
}

function Detail({ s }: { s: MhSymbol }) {
  const stock = s.kind === 'stock' || s.kind === 'etf';
  const w = s.weekday;
  return (
    <>
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight">{s.sym}<span className="text-ink3 font-normal text-[14px] ml-2">{s.display && s.display !== s.sym ? s.display : s.name !== s.sym ? s.name : ''}</span></h2>
            <p className="text-[12px] text-ink3 mt-1 num">{KIND_LABEL[s.kind]}{s.group ? ` · ${s.group}` : ''} · {s.from} → {s.to} ({s.years ?? '–'} years)</p>
          </div>
          <div className="flex flex-wrap gap-1.5"><RelBadge rel={s.timesRel} what="Times" />{w && <RelBadge rel={w.rel} what="Days" />}{s.era.shifted ? <Badge tone="warn" className="!h-5 !px-2 !text-[10.5px]">Era: shifted</Badge> : <Badge className="!h-5 !px-2 !text-[10.5px]">Era: stable</Badge>}</div>
        </div>
        <div>
          <table className="w-full text-[13px]">
            <caption className="sr-only">Best times of {s.sym}</caption>
            <thead><tr className="text-left text-[11px] text-ink3 uppercase tracking-wide">
              <th scope="col" className="font-medium py-1.5 pr-2 max-sm:hidden">#</th><th scope="col" className="font-medium py-1.5 pr-2">Calgary</th><th scope="col" className="font-medium py-1.5 pr-2">NY</th>
              <th scope="col" className="font-medium py-1.5 pr-2 text-right">Activity</th><th scope="col" className="font-medium py-1.5 pr-2 text-right">Range</th><th scope="col" className="font-medium py-1.5 text-right"><span className="sm:hidden">Big moves</span><span className="max-sm:hidden">Big-move days</span></th>
            </tr></thead>
            <tbody>
              {s.windows.map((x, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="py-2 pr-2 text-ink3 num max-sm:hidden">{i + 1}</td>
                  <td className="py-2 pr-2 num"><b>{x.mt}</b><span className="text-ink3 text-[11.5px] block">{x.from}–{x.to}</span></td>
                  <td className="py-2 pr-2 num text-ink2">{x.ny}</td>
                  <td className="py-2 pr-2 num text-right font-semibold">{fmtX(x.activity)}</td>
                  <td className="py-2 pr-2 num text-right text-ink2">{fmtX(x.range, 1)}</td>
                  <td className="py-2 num text-right text-ink2">{x.bigPct != null ? `${x.bigPct}%` : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4"><Profile s={s} /></div>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHead title="Weekdays" sub={w ? `${w.best} busiest, ${w.quiet} quietest: ${fmtX(w.ratio)} (95% CI ${w.ciLo ?? '–'}–${w.ciHi ?? '–'})` : 'Not enough days'} />
          <Days s={s} />
          {w?.rel === 'weak' && <p className="text-[11.5px] text-ink3 mt-3">Weak: the gap between weekdays is within noise (the confidence interval reaches 1.0 or the two halves of the history disagree). Plan by the clock, not the day.</p>}
        </Card>
        <Card>
          <CardHead title="News days" sub="Range of that half-hour on event days vs normal days" />
          <EventRow label={stock ? 'NFP Friday · 07:30 open' : 'NFP Friday · 06:30'} e={s.nfp} note={stock ? '09:30 ET opening half-hour vs other Fridays' : '08:30 ET jobs report vs other Fridays'} />
          <EventRow label="FOMC · 12:00" e={s.fomc1200} note="14:00 ET statement vs a normal Wednesday" />
          <EventRow label="FOMC · 12:30" e={s.fomc1230} note="14:30 ET press conference vs a normal Wednesday" />
          {!s.nfp && !s.fomc1200 && !s.fomc1230 && <p className="text-[12.5px] text-ink3">Not enough event days in this symbol's history.</p>}
        </Card>
      </div>

      <Card>
        <CardHead title="Has it changed?" sub="Shape of the day before vs since 2020, and the last 2 years vs all history (1.0 = identical)" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[13px]">
          <div><div className="label">Last 2 y vs all</div><div className="num font-semibold mt-0.5">{s.era.recentVsAll ?? '–'}</div></div>
          <div><div className="label">Before vs since 2020</div><div className="num font-semibold mt-0.5">{s.era.prePost ?? '–'}</div></div>
          <div><div className="label">Peak before 2020</div><div className="num font-semibold mt-0.5">{s.era.peakPre ?? '–'}</div></div>
          <div><div className="label">Peak since 2020 · last 2 y</div><div className="num font-semibold mt-0.5">{s.era.peakPost ?? '–'} · {s.era.peakRecent ?? '–'}</div></div>
        </div>
      </Card>
    </>
  );
}

export default function MarketHours() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<MhFilter>('all');
  useEffect(() => {
    let live = true;
    fetch(MH_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setLoad({ state: 'ok', file: parseMarketHours(js) }); })
      .catch(() => { if (live) setLoad({ state: 'error' }); });
    return () => { live = false; };
  }, [n]);
  const file = load.state === 'ok' ? load.file : null;
  const list = file?.symbols ?? [];
  const selected = useMemo(() => findSymbol(list, params.get('s') || '') ?? findSymbol(list, 'EURUSD') ?? list[0] ?? null, [list, params]);
  const results = useMemo(() => searchSymbols(list, q, filter, 40), [list, q, filter]);
  const pick = (s: MhSymbol) => { setParams({ s: s.sym }, { replace: true }); setQ(''); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Market hours</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[64ch]">When each pair and stock moves most: its best half-hours (Calgary time, New York in grey) and its busiest weekday, measured over its whole history. It says when to look, not which way to trade.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {file ? <>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />Updated {when(file.generated)} UTC</span>
              <span className="num">{file.fxCount} forex / metals / CFDs · {file.stockCount} stocks</span>
              {file.synthetic && <Badge tone="warn">Sample data · synthetic</Badge>}
            </> : load.state === 'loading' ? <span>Loading…</span> : null}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <Link to="/scanner/fx" className="text-accent font-medium">Forex scanner</Link>
            <Link to="/scanner" className="text-accent font-medium">Stock scanner</Link>
            <a className="text-accent font-medium" href="https://github.com/r4m4nxd/ramanFX/blob/main/docs/research/Market_Hours.md" target="_blank" rel="noreferrer">Full report</a>
          </div>
        </div>
      </Card>

      {load.state === 'error' && <Card><Empty icon="info" title="Couldn't load the market-hours study" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>Check your connection and try again.</Empty></Card>}
      {file && !list.length && <Card><Empty icon="info" title="No study yet">The first results appear after the market-hours workflow runs.</Empty></Card>}

      {!!list.length && <>
        <Card>
          <div className="flex flex-col gap-3">
            <label className="relative block">
              <span className="sr-only">Search a symbol</span>
              <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
              <input className="field w-full h-11 pl-10 text-[16px]" type="search" enterKeyHint="search" autoComplete="off" spellCheck={false}
                placeholder={`Search ${list.length.toLocaleString()} symbols: EURUSD, gold, AAPL…`} value={q} onChange={e => setQ(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && results[0]) pick(results[0]); }} />
            </label>
            <div className="overflow-x-auto -mx-1 px-1"><Segmented label="Market" size="sm" value={filter} onChange={setFilter} options={FILTERS} /></div>
            {(q || filter !== 'all') && (
              <ul className="flex flex-col max-h-[340px] overflow-y-auto -mx-2" aria-label="Matching symbols">
                {results.map(s => (
                  <li key={s.sym}>
                    <button type="button" onClick={() => pick(s)} className={cx('w-full grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-raised', selected?.sym === s.sym && 'bg-raised')}>
                      <span className="min-w-0">
                        <span className="font-semibold text-[13.5px]">{s.sym}</span>
                        <span className="text-[12px] text-ink3 ml-2 truncate">{isFx(s.kind) || s.kind === 'metal' || s.kind === 'cfd' ? KIND_LABEL[s.kind] : s.display}</span>
                      </span>
                      <span className="num text-[12px] text-ink2 shrink-0">{s.windows[0] ? `${s.windows[0].mt} · ${fmtX(s.windows[0].activity, 1)}` : '–'}{s.weekday ? ` · ${s.weekday.best}` : ''}</span>
                    </button>
                  </li>
                ))}
                {!results.length && <li className="px-2 py-2 text-[13px] text-ink3">No symbol matches “{q}”.</li>}
              </ul>
            )}
          </div>
        </Card>
        {selected && <Detail key={selected.sym} s={selected} />}
        <p className="text-[11.5px] text-ink3 px-1 leading-relaxed">Activity = volume and range of a half-hour together (geometric mean), relative to a typical half-hour of the same month; Range = price movement alone (a stock's 13:30 close is mostly volume). Forex volume is OANDA tick volume; stock volume is consolidated (SIP). “Weak” = within noise: the two halves of the history disagree. Descriptive only, not financial advice.</p>
      </>}
    </Page>
  );
}
