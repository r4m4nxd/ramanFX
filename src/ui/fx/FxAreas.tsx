import { useEffect, useState } from 'react';
import { Card } from '@/ui/kit';

// The open FX realignment areas (public/fx/arrivals.json, the hourly scan): where a higher-TF correction should end; the
// trade is the lower-TF arrival inside it (the ✅ Confirmation alert). Price inside first. Telegram: /areas.
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const TF: Record<string, string> = { M15: '15m', H1: '1H', H4: '4H', D1: 'Daily', W1: 'Weekly', MN: 'Monthly', '3M': '3-month' };

export function areaRows(file: J | null): J[] {
  const n = (v: unknown) => typeof v === 'number' && Number.isFinite(v);
  const rows = Object.values((file?.areas ?? {}) as J).filter((a: J) => a && !a.confirmed && n(a.lo) && n(a.hi) && n(a.price)) as J[];
  const dist = (a: J) => (a.price >= a.lo && a.price <= a.hi ? 0 : Math.min(Math.abs(a.price - a.lo), Math.abs(a.price - a.hi)) / a.price * 100);
  return rows.map((a): J => ({ ...a, d: dist(a) })).sort((a, b) => Number(!a.inside) - Number(!b.inside) || a.d - b.d);
}

export function FxAreas() {
  const [file, setFile] = useState<J | null>(null);
  useEffect(() => {
    let live = true;
    fetch('/fx/arrivals.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(js => { if (live) setFile(js); }).catch(() => {});
    return () => { live = false; };
  }, []);
  const rows = areaRows(file);
  if (!rows.length) return null;
  return (
    <Card>
      <h2 className="text-[15px] font-semibold">🎯 Realignment areas <span className="num text-ink3 font-medium">{rows.length}</span></h2>
      <p className="text-[12px] text-ink3 mb-1">Where a higher-timeframe correction should end. The trade is the lower-timeframe arrival inside the area: you get a ✅ Confirmation alert on Telegram (/areas).</p>
      <ul>
        {rows.slice(0, 30).map(a => (
          <li key={a.id} className="py-2 border-b border-line/50 last:border-0 flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
            <span aria-hidden>{a.inside ? '🎯' : a.d < 1 ? '⏳' : '·'}</span>
            <span className="font-semibold">{a.sym}</span>
            <span className="text-ink2">{TF[a.tf] ?? a.tf} {a.dir > 0 ? 'buy' : 'sell'} area</span>
            <span className="num">{Number(a.lo).toFixed(a.digits ?? 5)}–{Number(a.hi).toFixed(a.digits ?? 5)}</span>
            <span className="text-ink2">{a.inside ? `price inside · watching ${TF[a.ltf] ?? a.ltf}` : `${a.d.toFixed(1)}% away`}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
