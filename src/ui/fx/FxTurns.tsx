import { useEffect, useState } from 'react';
import { Card } from '@/ui/kit';

// FX daily / weekly direction changes in progress (public/fx/trendchg.json 'current', the hourly scan: fxtrend.py).
// Telegram: /turns (alerts at each step).
type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const ICON: Record<string, string> = { break: '⚠️', removed1: '🟡', changed: '🔄' };

export function FxTurns() {
  const [rows, setRows] = useState<J[]>([]);
  useEffect(() => {
    let live = true;
    fetch('/fx/trendchg.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(js => { if (live && Array.isArray(js?.current)) setRows(js.current); }).catch(() => {});
    return () => { live = false; };
  }, []);
  if (!rows.length) return null;
  return (
    <Card>
      <h2 className="text-[15px] font-semibold">🧭 Direction changes · daily / weekly <span className="num text-ink3 font-medium">{rows.length}</span></h2>
      <p className="text-[12px] text-ink3 mb-1">Raja: a trend line broken by a close (⚠️), then opposite zones removed: 1 (🟡), 2 = direction CHANGED (🔄).</p>
      <ul>
        {rows.slice(0, 30).map((x, i) => {
          const up = x.side > 0, opp = up ? 'supply' : 'demand';
          const what = x.stage === 'changed' ? `CHANGED ${up ? 'up' : 'down'} · ${x.rm ?? 2} ${opp} removed` : x.stage === 'removed1' ? `turning ${up ? 'up' : 'down'} · 1 of 2 ${opp} removed` : `line broken ${String(x.cross ?? '').slice(0, 10)} · turning ${up ? 'up' : 'down'}`;
          return (
            <li key={`${x.sym}-${x.tf}-${i}`} className="py-2 border-b border-line/50 last:border-0 flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
              <span aria-hidden>{ICON[x.stage] ?? '·'}</span>
              <span className="font-semibold">{x.sym}</span>
              <span className="text-ink2">{x.tf === 'W1' ? 'Weekly' : 'Daily'}</span>
              <span>{what}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
