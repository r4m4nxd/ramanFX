import { useState } from 'react';
import { Collapsible } from '@/ui/Collapse';
import { tvLink, type FxUnmapped as U } from '@/core/fx';

export function FxUnmapped({ items }: { items: U[] }) {
  const [open, setOpen] = useState(false);
  if (!items.length) return null;
  return (
    <Collapsible id="fx-unmapped" title="Not on OANDA" open={open} onToggle={() => setOpen(o => !o)} pill={<span className="num text-[11.5px] text-ink3">{items.length}</span>}
      preview="Watchlist symbols the OANDA feed doesn't carry: not scanned">
      <ul className="flex flex-wrap gap-1.5">
        {items.map(u => (
          <li key={u.symbol}><a href={tvLink(u.symbol)} target="_blank" rel="noreferrer" title={`${u.section} · ${u.note}`}
            className="inline-flex items-center h-8 px-3 rounded-full border border-line text-[12px] font-semibold text-ink2 hover:text-ink">{u.symbol}</a></li>
        ))}
      </ul>
    </Collapsible>
  );
}
