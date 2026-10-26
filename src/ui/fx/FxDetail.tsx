import { useEffect, useState } from 'react';
import { ZoneMiniChart } from '@/ui/ZoneMiniChart';
import { fxDetailUrl, fxPx, parseDetail, tvLink, type FxDetail as D, type FxRow } from '@/core/fx';

// One fetch per class shard per page visit.
const cache = new Map<string, Promise<unknown>>();
const shard = (k: string) => {
  let p = cache.get(k);
  if (!p) { p = fetch(fxDetailUrl(k), { cache: 'no-cache' }).then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))); p.catch(() => cache.delete(k)); cache.set(k, p); }
  return p;
};

export function FxDetail({ row }: { row: FxRow }) {
  const [d, setD] = useState<D | null | 'err'>(null);
  useEffect(() => {
    let live = true;
    shard(row.k).then(js => { if (live) setD(parseDetail(js, row.sym) ?? 'err'); }, () => { if (live) setD('err'); });
    return () => { live = false; };
  }, [row.k, row.sym]);
  const tv = <a href={tvLink(row.tv)} target="_blank" rel="noreferrer" className="text-[12.5px] font-semibold text-accent hover:underline underline-offset-4">Open {row.sym} on TradingView ↗</a>;
  if (d === null) return <p className="text-[12px] text-ink3 py-2">Loading…</p>;
  if (d === 'err') return <div className="py-2 flex flex-col gap-1"><p className="text-[12px] text-ink3">Detail not available.</p>{tv}</div>;
  const tf = (['D1', 'H4', 'W1'] as const).find(t => (d.bars[t]?.length ?? 0) > 1);
  const bars = tf ? d.bars[tf] : [];
  const z = row.z;
  return (
    <div className="flex flex-col gap-2 py-2">
      {bars.length > 1 && <>
        <ZoneMiniChart bars={bars} height={150} label={`${row.sym} ${tf} chart with zones`}
          levels={{ price: d.price ?? bars[bars.length - 1][4], proximal: z?.side === 'demand' ? z.prox : null, distal: z?.side === 'demand' ? z.dist : null, supply: z?.side === 'supply' ? z.prox : null, supplyDistal: z?.side === 'supply' ? z.dist : null }}
          zones={d.zones.filter(x => x.tf === tf).slice(0, 6).map(x => ({ proximal: x.proximal, distal: x.distal, side: x.side }))} />
        <p className="text-[11px] text-ink3">{tf} bars · {d.date} server time</p>
      </>}
      {z && <p className="text-[12px] text-ink2 [overflow-wrap:anywhere]">{z.tf} {z.side} {z.type} {fxPx(z.prox, row.digits)}–{fxPx(z.dist, row.digits)} · {z.label}{z.chain_text ? ` · ${z.chain_text}` : ''}</p>}
      {d.ctx3 && <p className="text-[12px] text-ink3">{d.ctx3}</p>}
      {d.checks.map((c, i) => <p key={i} className="text-[12px] text-ink3">Nearest {c.side}: {c.tf} {c.zone_type} {fxPx(c.proximal, row.digits)} · {c.label || 'passes'}</p>)}
      {tv}
    </div>
  );
}
