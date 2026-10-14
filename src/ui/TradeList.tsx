import { Link } from 'react-router-dom';
import type { EnrichedTrade } from '@/core/stats';
import { fmtHold } from '@/core/time';
import { useStore } from '@/data/store';
import { rMult, shortDate, timeHM, tone, useMoney } from '@/lib/format';
import { cx } from './kit';

/** Phone layout for trades: one tappable row each, no sideways scrolling. */
export function TradeList({ trades, time = 'close' }: { trades: EnrichedTrade[]; time?: 'close' | 'range' }) {
  const fmt = useMoney();
  const notes = useStore(s => s.notes);
  return (
    <ul className="flex flex-col">
      {trades.map(t => {
        const n = notes[t.id];
        const long = t.type === 'buy';
        return (
          <li key={t.account + t.id} className="border-t border-line first:border-0">
            <Link to={`/trades/${t.id}`} className="flex items-center gap-3 py-3 active:bg-raised/60 -mx-1 px-1 rounded-lg">
              <span className={cx('w-8 h-8 rounded-lg grid place-items-center text-[10px] font-bold shrink-0', long ? 'bg-accent/15 text-accent' : 'bg-warn/15 text-warn')} aria-label={long ? 'Long' : 'Short'}>{long ? 'L' : 'S'}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-[14px] truncate">{t.sym}</span>
                  {n?.mistakes?.length ? <span className="w-1.5 h-1.5 rounded-full bg-warn shrink-0" title="Has mistakes" /> : null}
                </span>
                <span className="block text-[11.5px] text-ink3 truncate num">
                  {time === 'range' ? `${timeHM(t.open)}–${timeHM(t.close)}` : `${shortDate(t.close)} ${timeHM(t.close)}`} · {t.volume} lots · {fmtHold(t.holdSec)}
                  {n?.tags?.length ? <span className="font-sans"> · {n.tags.join(', ')}</span> : null}
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className={cx('block num font-semibold text-[14px]', tone(t.net))}>{fmt(t.net, { signed: true })}</span>
                <span className={cx('block num text-[11.5px]', t.r == null ? 'text-ink3' : tone(t.r))}>{rMult(t.r, 1)}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
