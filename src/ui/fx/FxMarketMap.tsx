import { useState } from 'react';
import { Collapsible } from '@/ui/Collapse';
import { Badge, cx } from '@/ui/kit';
import { bucketText, bucketTone, fxPx, groupBySection, type FxRow } from '@/core/fx';
import { FxDetail } from '@/ui/fx/FxDetail';

const TONE = { profit: 'text-profit', loss: 'text-loss', neutral: 'text-ink3' } as const;

export function FxMarketMap({ rows, order }: { rows: FxRow[]; order: string[] }) {
  const groups = groupBySection(rows, order);
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups.slice(0, 2).map(g => g.section)));
  const [sel, setSel] = useState<string | null>(null);
  const toggle = (s: string) => setOpen(o => { const n = new Set(o); if (n.has(s)) n.delete(s); else n.add(s); return n; });
  if (!groups.length) return <p className="text-[13px] text-ink3 px-1">No instruments in this scan.</p>;
  return (
    <div className="flex flex-col gap-3">
      {groups.map(g => {
        const zoned = g.items.filter(i => i.b !== 'M').length;
        return (
          <Collapsible key={g.section} id={`fx-${g.section.replace(/\W+/g, '-').toLowerCase()}`} title={g.section} open={open.has(g.section)} onToggle={() => toggle(g.section)}
            pill={<span className="num text-[11.5px] text-ink3">{zoned}/{g.items.length}</span>} preview={`${zoned} at or near a zone`}>
            <ul className="flex flex-col divide-y divide-line/60">
              {g.items.map(r => {
                const on = sel === r.sym;
                return (
                  <li key={r.sym}>
                    <button type="button" aria-expanded={on} onClick={() => setSel(on ? null : r.sym)} className="w-full flex items-center gap-2 py-2.5 min-h-[44px] text-left">
                      <span className="font-semibold text-[13.5px] w-[84px] shrink-0 truncate" title={`OANDA ${r.oanda}`}>{r.sym}</span>
                      <span className={cx('text-[12.5px] font-medium flex-1 min-w-0 truncate', TONE[bucketTone(r.b)])}>
                        {bucketText(r.b)}{r.z ? ` · ${r.z.tf} ${r.z.type}` : ''}{r.z?.pips != null && r.z.sec !== 'in' ? ` · ${r.z.pips.toFixed(1)}p` : ''}
                      </span>
                      {r.sig && <Badge tone={r.sig === 'BUY' ? 'profit' : r.sig === 'SELL' ? 'loss' : 'warn'} className="shrink-0">{r.sig}</Badge>}
                      <span className="num text-[12px] text-ink2 shrink-0">{fxPx(r.px, r.digits)}</span>
                    </button>
                    {on && <FxDetail row={r} />}
                  </li>
                );
              })}
            </ul>
          </Collapsible>
        );
      })}
    </div>
  );
}
