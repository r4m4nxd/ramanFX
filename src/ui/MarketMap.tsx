import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { BUCKETS, bucketMeta, isBucket, mapTag, mapZone, marketMap, px, stockPath, type Bucket, type IndexFilter, type IndexRow, type Side } from '@/core/scanner';
import { num } from '@/lib/format';
import { Card, cx, Empty, Segmented } from '@/ui/kit';
import { typeTone } from '@/ui/ScanParts';
import { Explain, InfoDot } from '@/ui/Explain';
import { bucketTip, locOk, locTip, freshTip, G, mapTagTip, mapZoneTip, whereTip } from '@/core/scannerGlossary';

const KEY = 'rfx_scanner_bucket';
const readBucket = (): Bucket => { try { const v = localStorage.getItem(KEY); return isBucket(v) ? v : 'in_demand'; } catch { return 'in_demand'; } };
const saveBucket = (v: Bucket) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };

const wide = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
const sub = (cb: () => void) => { wide?.addEventListener('change', cb); return () => wide?.removeEventListener('change', cb); };
/** Columns from 1024 px; below that one bucket at a time. */
function useWide() { return useSyncExternalStore(sub, () => !!wide?.matches, () => false); }

const DOT: Record<Bucket, string> = {
  in_supply: 'bg-loss', near_supply: 'bg-loss/60', left_supply: 'bg-loss/30 ring-1 ring-loss/60', middle: 'bg-ink3/60',
  left_demand: 'bg-profit/30 ring-1 ring-profit/60', near_demand: 'bg-profit/60', in_demand: 'bg-profit',
};
const FIRST = 60;
/** Demand first (what the scanner buys), then supply. */
const SIDE_ORDER: Bucket[][] = [['in_demand', 'near_demand', 'left_demand'], ['in_supply', 'near_supply', 'left_supply']];

function whereText(b: Bucket, pct: number | null | undefined): string {
  if (b === 'in_demand' || b === 'in_supply') return 'in zone';
  if (pct == null) return '—';
  const p = `${num(Math.abs(pct), 1)}%`;
  if (b === 'near_demand') return `${p} above`;
  if (b === 'left_demand') return `${p} above · bounced`;
  if (b === 'near_supply') return `${p} below`;
  if (b === 'left_supply') return `${p} below · rejected`;
  return `${p} to the zone`;
}

function MapRow({ r, b }: { r: IndexRow; b: Bucket }) {
  const z = mapZone(r, b);
  const tag = mapTag(r);
  const side = bucketMeta(b).side;
  const hot = !!z && z.strong && z.fresh;
  const tone = side === 'demand' ? 'text-profit' : side === 'supply' ? 'text-loss' : 'text-ink3';
  return (
    <li>
      <Link to={stockPath(r.s)} aria-label={`${r.s} ${r.n}`}
        className={cx('flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] hover:bg-raised/40 transition-colors', hot && 'bg-accent/[0.07] shadow-[inset_2px_0_0_rgb(var(--accent))]')}>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-semibold text-[14px] shrink-0">{r.s}</span>
            {r.h && <Explain doc={G.listing(`${r.h.replace(':', ': ')} · US listing`)} className="text-[10.5px] text-ink3 shrink-0">{r.h}</Explain>}
            <span className="text-[11.5px] text-ink3 truncate">{r.n}</span>
          </span>
          <span className="flex items-center gap-1.5 mt-1 flex-wrap">
            {z ? (
              <Explain doc={mapZoneTip(z)} className={cx('h-5 px-1.5 rounded-md border text-[10.5px] font-semibold grid place-items-center num whitespace-nowrap',
                typeTone(z.type) === 'accent' ? 'border-accent/40 text-accent' : typeTone(z.type) === 'violet' ? 'border-violet/40 text-violet' : 'border-line text-ink2')}>
                {z.tf} · {z.type}{z.score != null ? ` · ${z.score}` : ''}
              </Explain>
            ) : <Explain doc={{ title: `No fresh ${side === 'supply' ? 'supply' : 'demand'}`, body: `No fresh W1 / MN / 3M ${side === 'supply' ? 'supply above' : 'demand below'} the close.` }} className="text-[11px] text-ink3">no fresh {side === 'supply' ? 'supply' : 'demand'}</Explain>}
            {Array.isArray(r.ml) && r.ml.length >= 2 && <Explain doc={locTip(r.ml[0], r.ml[1])!} className={cx('text-[11px] font-semibold', locOk(r.ml[0]) ? 'text-profit' : 'text-ink3')}>{locOk(r.ml[0]) ? '✓ HTF' : '✗ HTF'}</Explain>}
            {z && <Explain doc={freshTip(z.touches)} className={cx('text-[11px]', z.fresh ? 'text-ink2 font-medium' : 'text-ink3')}>{z.fresh ? 'fresh' : `${z.touches}× tested`}</Explain>}
            {tag && <Explain doc={mapTagTip(r.mb ? r.mr : r.br, tag.text)} className={cx('h-5 px-1.5 rounded-full border text-[10.5px] font-semibold grid place-items-center whitespace-nowrap',
              tag.tone === 'profit' ? 'border-profit/40 text-profit bg-profit/10' : tag.tone === 'warn' ? 'border-warn/40 text-warn bg-warn/10' : 'border-line text-ink3')}>{tag.text}</Explain>}
          </span>
        </span>
        <span className="text-right shrink-0">
          <Explain as="span" u={false} doc={G.price(r.px, r.cur ?? 'USD')} className="block num text-[13px]">{px(r.px)}{r.cur ? <span className="text-[10px] text-ink3 ml-1">{r.cur}</span> : null}</Explain>
          <Explain as="span" doc={whereTip(b, z?.pct)} className={cx('block num text-[11.5px]', b.startsWith('in_') ? tone : 'text-ink3')}>{z ? whereText(b, z.pct) : '—'}</Explain>
        </span>
      </Link>
    </li>
  );
}

function BucketList({ rows, b, compact, pending }: { rows: IndexRow[]; b: Bucket; compact?: boolean; pending?: boolean }) {
  const [all, setAll] = useState(false);
  useEffect(() => setAll(false), [rows]);
  if (!rows.length) return <p className="text-[12.5px] text-ink3 px-3 py-6 text-center">{pending && b.startsWith('left_') ? 'Fills after the next scan (this scan file predates the "left" lists).' : 'No stock here today.'}</p>;
  const shown = all ? rows : rows.slice(0, FIRST);
  return (
    <>
      <ul className={cx('divide-y divide-line', compact && 'max-h-[60vh] overflow-y-auto overscroll-contain')} aria-label={bucketMeta(b).label}>
        {shown.map(r => <MapRow key={r.s} r={r} b={b} />)}
      </ul>
      {rows.length > shown.length && (
        <Explain control doc={G.showAll}><button type="button" className="btn-ghost w-full h-11 text-[12.5px] border-t border-line rounded-none" onClick={() => setAll(true)}>Show all {rows.length.toLocaleString()}</button></Explain>
      )}
    </>
  );
}

function Column({ b, rows, pending }: { b: Bucket; rows: IndexRow[]; pending?: boolean }) {
  const m = bucketMeta(b);
  return (
    <Card className="p-0 min-w-0 overflow-hidden" aria-label={m.label}>
      <Explain as="div" u={false} doc={bucketTip(m.label, b, rows.length)} className="flex items-center gap-2 px-3 py-3 border-b border-line">
        <span className={cx('w-2 h-2 rounded-full shrink-0', DOT[b])} />
        <h3 className="text-[13px] font-semibold flex-1 min-w-0 truncate"><span className="tip-u">{m.label}</span></h3>
        <span className="num text-[12px] text-ink3">{rows.length.toLocaleString()}</span>
      </Explain>
      <BucketList rows={rows} b={b} compact pending={pending} />
    </Card>
  );
}

/** Every stock by where its close sits against its W1 / MN / 3M zones (in, approaching, just left), whatever the
 *  rules say. Newer scans write the buckets (the same lists as the Telegram message); older files fall back to the
 *  nearest fresh zones, without the "left" buckets. */
export function MarketMap({ rows, idx, sector, loading, initial }: { rows: IndexRow[] | null; idx: IndexFilter; sector: string; loading: boolean; initial?: Bucket | null }) {
  const isWide = useWide();
  const [b, setBState] = useState<Bucket>(() => initial ?? readBucket());
  const setB = (v: Bucket) => { setBState(v); saveBucket(v); };
  const map = useMemo(() => marketMap(rows ?? [], idx, sector), [rows, idx, sector]);
  const hasLeft = useMemo(() => (rows ?? []).some(r => r.mb), [rows]);
  // opened from a link (Telegram "+N more on the app"): bring the map into view once it has rows
  const top = useRef<HTMLDivElement>(null);
  const ready = !loading && !!rows?.length;
  useEffect(() => { if (initial && ready) top.current?.scrollIntoView({ block: 'start' }); }, [initial, ready]);
  if (loading) return <div className="skeleton h-64 rounded-2xl" aria-busy="true" aria-label="Loading" />;
  if (!rows?.length) return <Card><Empty icon="layers" title="No market map yet">The map is built from the daily scan's stock index. It appears after the next scan.</Empty></Card>;
  const total = BUCKETS.reduce((a, x) => a + map[x.key].length, 0);
  if (!total) return <Card><Empty icon="layers" title="Nothing for this filter">No stock in this index or sector. Try All.</Empty></Card>;
  const sideCount = (s: Side) => BUCKETS.filter(x => x.side === s).reduce((a, x) => a + map[x.key].length, 0);
  const legend = (
    <p className="text-[12px] text-ink3 leading-relaxed">
      Where each close sits against its W1 / MN / 3M zones, whatever the rules say: in a zone, approaching it (within 3%), or just left it (touched in the last 3 sessions, closed back out). Not signals: the tag shows today's signal or the first Raja rule that blocks a BUY.
      {!hasLeft && <> The "left" lists fill after the next scan.</>}
      <Explain doc={G.strongFresh} u={false} className="whitespace-nowrap"> <span className="inline-block w-2 h-2 rounded-sm bg-accent/60 shadow-[inset_2px_0_0_rgb(var(--accent))] align-middle mr-1" /><span className="tip-u">strong + fresh zone</span>.</Explain>
    </p>
  );
  if (isWide) {
    return (
      <div ref={top} className="flex flex-col gap-3 scroll-mt-4" aria-label="Market map">
        {legend}
        {SIDE_ORDER.map(group => (
          <div key={group[0]} className="grid grid-cols-3 gap-3 items-start">
            {group.map(k => <Column key={k} b={k} rows={map[k]} pending={!hasLeft} />)}
          </div>
        ))}
        <details className="group">
          <summary className="list-none cursor-pointer select-none flex items-center gap-2 min-h-[44px] px-3 rounded-xl border border-line text-[13px] font-semibold">
            <span className={cx('w-2 h-2 rounded-full', DOT.middle)} />Middle<span className="num text-ink3 font-medium">{map.middle.length.toLocaleString()}</span>
            <Explain inert doc={bucketTip('Middle', 'middle', map.middle.length)} className="text-ink3 font-normal text-[12px]">not in, near or just off a zone</Explain>
          </summary>
          <Card className="p-0 overflow-hidden mt-2"><BucketList rows={map.middle} b="middle" compact /></Card>
        </details>
      </div>
    );
  }
  const side = bucketMeta(b).side;
  // the first non-empty bucket of a side, so a tap on "Supply" never lands on an empty list when another has stocks
  const pickSide = (s: Side) => {
    if (s === side) return;
    const opts = s === 'middle' ? ['middle' as Bucket] : SIDE_ORDER[s === 'demand' ? 0 : 1];
    setB(opts.find(k => map[k].length) ?? opts[0]);
  };
  return (
    <div ref={top} className="flex flex-col gap-3 scroll-mt-4">
      <div className="flex items-center gap-2 overflow-x-auto -mx-1 px-1 pb-0.5">
        <Segmented label="Side" value={side} onChange={pickSide} options={[
          { value: 'demand' as Side, label: <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-profit" />Demand <span className="num text-ink3 font-medium">{sideCount('demand')}</span></span> },
          { value: 'middle' as Side, label: <span className="inline-flex items-center gap-1.5">Middle <span className="num text-ink3 font-medium">{sideCount('middle')}</span></span> },
          { value: 'supply' as Side, label: <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-loss" />Supply <span className="num text-ink3 font-medium">{sideCount('supply')}</span></span> },
        ]} />
        <InfoDot doc={G.side} label="About the market map sides" />
      </div>
      {side !== 'middle' && (
        <div role="radiogroup" aria-label={`${side === 'demand' ? 'Demand' : 'Supply'} bucket`} className="grid grid-cols-3 gap-1.5">
          {(side === 'demand' ? SIDE_ORDER[0] : SIDE_ORDER[1]).map(k => {
            const on = b === k;
            return (
              <button key={k} type="button" role="radio" aria-checked={on} onClick={() => setB(k)} aria-label={`${bucketMeta(k).label} ${map[k].length}`}
                className={cx('h-12 px-1.5 rounded-xl border text-[11.5px] font-semibold flex flex-col items-center justify-center leading-tight transition-colors min-w-0', on ? 'bg-accent/15 border-accent/40 text-ink' : 'border-line text-ink3 hover:text-ink2')}>
                <span className="inline-flex items-center gap-1 max-w-full"><span className={cx('w-1.5 h-1.5 rounded-full shrink-0', DOT[k])} /><span className="truncate">{bucketMeta(k).short}</span></span>
                <span className="num text-ink3 font-medium text-[11px] mt-0.5">{map[k].length.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[12px] text-ink2 -mb-1"><Explain doc={bucketTip(bucketMeta(b).label, b, map[b].length)}><span className="font-semibold">{bucketMeta(b).label}</span> · {bucketMeta(b).hint}</Explain></p>
      <Card className="p-0 overflow-hidden" aria-label={bucketMeta(b).label}>
        <BucketList rows={map[b]} b={b} pending={!hasLeft} />
      </Card>
      {legend}
    </div>
  );
}
