import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router-dom';
import { BUCKETS, NEAR_PCT, mapTag, mapZone, marketMap, px, stockPath, type Bucket, type IndexFilter, type IndexRow } from '@/core/scanner';
import { num } from '@/lib/format';
import { Card, cx, Empty } from '@/ui/kit';
import { typeTone } from '@/ui/ScanParts';

const KEY = 'rfx_scanner_bucket';
const readBucket = (): Bucket => { try { const v = localStorage.getItem(KEY); return BUCKETS.some(b => b.key === v) ? v as Bucket : 'in_demand'; } catch { return 'in_demand'; } };
const saveBucket = (v: Bucket) => { try { localStorage.setItem(KEY, v); } catch { /* storage blocked */ } };

const wide = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
const sub = (cb: () => void) => { wide?.addEventListener('change', cb); return () => wide?.removeEventListener('change', cb); };
/** Columns from 1024 px; below that one bucket at a time. */
function useWide() { return useSyncExternalStore(sub, () => !!wide?.matches, () => false); }

const DOT: Record<Bucket, string> = { in_supply: 'bg-loss', near_supply: 'bg-loss/50', middle: 'bg-ink3/60', near_demand: 'bg-profit/50', in_demand: 'bg-profit' };
const FIRST = 60;

function MapRow({ r, b }: { r: IndexRow; b: Bucket }) {
  const z = mapZone(r, b);
  const tag = mapTag(r);
  const inZone = b === 'in_demand' || b === 'in_supply';
  const hot = !!z && z.strong && z.fresh;
  return (
    <li>
      <Link to={stockPath(r.s)} aria-label={`${r.s} ${r.n}`}
        className={cx('flex items-center gap-2.5 px-3 py-2.5 min-h-[44px] hover:bg-raised/40 transition-colors', hot && 'bg-accent/[0.07] shadow-[inset_2px_0_0_rgb(var(--accent))]')}>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-semibold text-[14px] shrink-0">{r.s}</span>
            <span className="text-[11.5px] text-ink3 truncate">{r.n}</span>
          </span>
          <span className="flex items-center gap-1.5 mt-1 flex-wrap">
            {z ? (
              <span className={cx('h-5 px-1.5 rounded-md border text-[10.5px] font-semibold grid place-items-center num whitespace-nowrap',
                typeTone(z.type) === 'accent' ? 'border-accent/40 text-accent' : typeTone(z.type) === 'violet' ? 'border-violet/40 text-violet' : 'border-line text-ink2')}
                title={`${z.tf} ${z.side}, ${z.type}${z.score != null ? `, Raja score ${z.score}/10` : ''}, ${z.fresh ? 'untouched' : `touched ${z.touches}x`}`}>
                {z.tf} · {z.type}{z.score != null ? ` · ${z.score}` : ''}
              </span>
            ) : <span className="text-[11px] text-ink3">no fresh {b === 'in_supply' || b === 'near_supply' ? 'supply' : 'demand'}</span>}
            {z && <span className={cx('text-[11px]', z.fresh ? 'text-ink2 font-medium' : 'text-ink3')}>{z.fresh ? 'fresh' : `${z.touches}× tested`}</span>}
            {tag && <span className={cx('h-5 px-1.5 rounded-full border text-[10.5px] font-semibold grid place-items-center whitespace-nowrap',
              tag.tone === 'profit' ? 'border-profit/40 text-profit bg-profit/10' : tag.tone === 'warn' ? 'border-warn/40 text-warn bg-warn/10' : 'border-line text-ink3')}>{tag.text}</span>}
          </span>
        </span>
        <span className="text-right shrink-0">
          <span className="block num text-[13px]">{px(r.px)}{r.cur ? <span className="text-[10px] text-ink3 ml-1">{r.cur}</span> : null}</span>
          <span className={cx('block num text-[11.5px]', inZone ? (b === 'in_demand' ? 'text-profit' : 'text-loss') : 'text-ink3')}>
            {inZone ? 'in zone' : z?.pct != null ? `${num(z.pct, 1)}% to ${z.side}` : '—'}
          </span>
        </span>
      </Link>
    </li>
  );
}

function BucketList({ rows, b, compact }: { rows: IndexRow[]; b: Bucket; compact?: boolean }) {
  const [all, setAll] = useState(false);
  useEffect(() => setAll(false), [rows]);
  if (!rows.length) return <p className="text-[12.5px] text-ink3 px-3 py-6 text-center">No stock here.</p>;
  const shown = all ? rows : rows.slice(0, FIRST);
  return (
    <>
      <ul className={cx('divide-y divide-line', compact && 'max-h-[70vh] overflow-y-auto overscroll-contain')} aria-label={BUCKETS.find(x => x.key === b)!.label}>
        {shown.map(r => <MapRow key={r.s} r={r} b={b} />)}
      </ul>
      {rows.length > shown.length && (
        <button type="button" className="btn-ghost w-full h-11 text-[12.5px] border-t border-line rounded-none" onClick={() => setAll(true)}>Show all {rows.length.toLocaleString()}</button>
      )}
    </>
  );
}

/** Every stock by where its price sits against its nearest fresh D1 / W1 zones, including those the rules block. */
export function MarketMap({ rows, idx, sector, loading }: { rows: IndexRow[] | null; idx: IndexFilter; sector: string; loading: boolean }) {
  const isWide = useWide();
  const [b, setBState] = useState<Bucket>(readBucket);
  const setB = (v: Bucket) => { setBState(v); saveBucket(v); };
  const map = useMemo(() => marketMap(rows ?? [], idx, sector), [rows, idx, sector]);
  const bar = useRef<HTMLDivElement>(null);
  // keep the chosen bucket chip in view (In demand sits at the far end of the strip on a phone)
  useEffect(() => { bar.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center' }); }, [b, isWide, rows]);
  if (loading) return <div className="skeleton h-64 rounded-2xl" aria-busy="true" aria-label="Loading" />;
  if (!rows?.length) return <Card><Empty icon="layers" title="No market map yet">The map is built from the daily scan's stock index. It appears after the next scan.</Empty></Card>;
  const total = BUCKETS.reduce((a, x) => a + map[x.key].length, 0);
  if (!total) return <Card><Empty icon="layers" title="Nothing for this filter">No stock in this index or sector. Try All.</Empty></Card>;
  const legend = (
    <p className="text-[12px] text-ink3 leading-relaxed">
      Where each price sits against its nearest fresh D1 / W1 zone, whatever the rules say. Not signals: the tag shows today's signal or the first Raja rule that blocks a BUY.
      <span className="whitespace-nowrap"> <span className="inline-block w-2 h-2 rounded-sm bg-accent/60 shadow-[inset_2px_0_0_rgb(var(--accent))] align-middle mr-1" />strong + fresh zone.</span>
    </p>
  );
  if (isWide) {
    return (
      <div className="flex flex-col gap-3">
        {legend}
        <div className="grid grid-cols-5 gap-3 items-start" aria-label="Market map">
          {BUCKETS.map(x => (
            <Card key={x.key} className="p-0 min-w-0 overflow-hidden" aria-label={x.label}>
              <div className="flex items-center gap-2 px-3 py-3 border-b border-line">
                <span className={cx('w-2 h-2 rounded-full shrink-0', DOT[x.key])} />
                <h3 className="text-[13px] font-semibold flex-1 min-w-0 truncate" title={x.label}>{x.short}{x.key.startsWith("near") ? <span className="text-ink3 font-normal"> ≤ {NEAR_PCT}%</span> : null}</h3>
                <span className="num text-[12px] text-ink3">{map[x.key].length.toLocaleString()}</span>
              </div>
              <BucketList rows={map[x.key]} b={x.key} compact />
            </Card>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      <div ref={bar} role="radiogroup" aria-label="Zone bucket" className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
        {BUCKETS.map(x => {
          const on = b === x.key;
          return (
            <button key={x.key} type="button" role="radio" aria-checked={on} onClick={() => setB(x.key)}
              className={cx('h-10 px-3 rounded-full border text-xs font-semibold whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 transition-colors', on ? 'bg-accent/15 border-accent/40 text-ink' : 'border-line text-ink3 hover:text-ink2')}>
              <span className={cx('w-2 h-2 rounded-full', DOT[x.key])} />{x.short}<span className="num text-ink3 font-medium">{map[x.key].length}</span>
            </button>
          );
        })}
      </div>
      {legend}
      <Card className="p-0 overflow-hidden" aria-label={BUCKETS.find(x => x.key === b)!.label}>
        <BucketList rows={map[b]} b={b} />
      </Card>
    </div>
  );
}
