import { Link, useNavigate } from 'react-router-dom';
import type { EnrichedTrade } from '@/core/stats';
import { fmtHold } from '@/core/time';
import { useNotes } from '@/data/derived';
import { rMult, shortDate, timeHM, tone, useMoney } from '@/lib/format';
import { cx, morphNavigate } from './kit';

/** Session key for the ordered ids of the trades list, so trade detail Prev/Next walk the same filtered, sorted list. */
export const TRADE_ORDER_KEY = 'rfx.tradeOrder';

/** Phone layout for trades: one tappable row each, no sideways scrolling. */
export function TradeList({ trades, time = 'close', linkState }: { trades: EnrichedTrade[]; time?: 'close' | 'range'; linkState?: unknown }) {
  const nav = useNavigate();
  const fmt = useMoney();
  const notes = useNotes();
  return (
    <ul className="flex flex-col">
      {trades.map(t => {
        const n = notes[t.id];
        const long = t.type === 'buy';
        return (
          <li key={t.account + t.id} className="relative before:absolute before:left-12 before:right-0 before:top-0 before:border-t before:border-line first:before:hidden">
            <Link to={`/trades/${t.id}`} state={linkState} onClick={e => { if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; e.preventDefault(); const to = `/trades/${t.id}`; morphNavigate(e.currentTarget, () => nav(to, { state: linkState })); }} className="press flex items-center gap-3 min-h-[56px] py-2.5 active:bg-raised/60 -mx-2 px-2 rounded-xl">
              <span className={cx('w-8 h-8 rounded-lg grid place-items-center text-[10px] font-bold shrink-0', long ? 'bg-accent/15 text-accent' : 'bg-warn/15 text-warn')} role="img" aria-label={long ? 'Long' : 'Short'}>{long ? 'L' : 'S'}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="font-mono font-semibold text-[15px] truncate">{t.sym}</span>
                  {n?.mistakes?.length ? <span className="w-1.5 h-1.5 rounded-full bg-warn shrink-0" title="Has mistakes" role="img" aria-label="Has mistakes" /> : null}
                </span>
                <span className="block text-[12px] text-ink3 truncate num mt-0.5">
                  {time === 'range' ? `${timeHM(t.open)}–${timeHM(t.close)}` : `${shortDate(t.close)} ${timeHM(t.close)}`} · {t.volume} lots · {fmtHold(t.holdSec)}
                  {n?.tags?.length ? <span className="font-sans"> · {n.tags.join(', ')}</span> : null}
                </span>
              </span>
              <span className="text-right shrink-0">
                <span className={cx('block num font-semibold text-[15px] whitespace-nowrap', tone(t.net))}>{fmt(t.net, { signed: true })}</span>
                <span className={cx('block num text-[11.5px]', t.r == null ? 'text-ink3' : tone(t.r))}>{rMult(t.r, 1)}</span>
              </span>
              <svg aria-hidden viewBox="0 0 8 14" className="w-[7px] h-3 shrink-0 text-ink3/60 -ml-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 1.5 6.5 7l-5 5.5" /></svg>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
