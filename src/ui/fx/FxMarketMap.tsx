import { useState } from 'react';
import { Collapsible } from '@/ui/Collapse';
import { cx } from '@/ui/kit';
import { bucketText, fxPx, groupBySection, tvLink, type FxInstrument } from '@/core/fx';

const toneOf = (i: FxInstrument) => {
  const b = i.bucket;
  if (!b) return 'text-ink3';
  if (b.section === 'in') return b.side === 'demand' ? 'text-profit' : 'text-loss';
  return b.side === 'demand' ? 'text-profit/80' : 'text-loss/80';
};

export function FxMarketMap({ instruments }: { instruments: FxInstrument[] }) {
  const groups = groupBySection(instruments);
  const [open, setOpen] = useState<Set<string>>(() => new Set(groups.slice(0, 2).map(g => g.section)));
  const toggle = (s: string) => setOpen(o => { const n = new Set(o); if (n.has(s)) n.delete(s); else n.add(s); return n; });
  if (!groups.length) return <p className="text-[13px] text-ink3 px-1">No instruments in this scan.</p>;
  return (
    <div className="flex flex-col gap-3">
      {groups.map(g => {
        const zoned = g.items.filter(i => i.bucket).length;
        return (
          <Collapsible key={g.section} id={`fx-${g.section.replace(/\W+/g, '-').toLowerCase()}`} title={g.section} open={open.has(g.section)} onToggle={() => toggle(g.section)}
            pill={<span className="num text-[11.5px] text-ink3">{zoned}/{g.items.length}</span>} preview={`${zoned} near a zone`}>
            <ul className="flex flex-col divide-y divide-line/60">
              {g.items.map(i => (
                <li key={i.symbol} className="flex items-center gap-3 py-2.5 min-h-[44px]">
                  <a href={tvLink(i.symbol)} target="_blank" rel="noreferrer" className="font-semibold text-[13.5px] hover:text-accent hover:underline underline-offset-4 w-[92px] shrink-0 truncate">{i.symbol}</a>
                  <span className={cx('text-[12.5px] font-medium flex-1 min-w-0 truncate', toneOf(i))}>
                    {bucketText(i.bucket)}{i.bucket?.tf ? ` · ${i.bucket.tf}` : ''}{i.bucket?.type ? ` ${i.bucket.type}` : ''}{i.bucket?.pips != null && i.bucket.section !== 'in' ? ` · ${i.bucket.pips.toFixed(1)} pips` : ''}
                  </span>
                  <span className="num text-[12px] text-ink2 shrink-0">{fxPx(i.price)}</span>
                </li>
              ))}
            </ul>
          </Collapsible>
        );
      })}
    </div>
  );
}
