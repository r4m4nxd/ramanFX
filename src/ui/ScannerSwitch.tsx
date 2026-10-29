import { Link, useLocation } from 'react-router-dom';
import { cx } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { prefetchProps } from '@/routes';

/** "Stocks | Forex" switch at the top of the scanner pages, with a link to the market-hours study. */
export function ScannerSwitch() {
  const fx = useLocation().pathname.startsWith('/scanner/fx');
  const item = (on: boolean) => cx('relative rounded-full font-semibold whitespace-nowrap transition-colors h-8 touch:h-10 px-4 text-[13px] inline-flex items-center', on ? 'pill-on text-ink' : 'text-ink3 hover:text-ink2');
  return (
    <div className="flex items-center justify-between gap-3">
      <nav aria-label="Scanner market" className="self-start inline-flex p-[3px] rounded-full bg-raised/50 border border-line/70">
        <Link to="/scanner" aria-current={!fx ? 'page' : undefined} className={item(!fx)}>Stocks</Link>
        <Link to="/scanner/fx" aria-current={fx ? 'page' : undefined} className={item(fx)}>Forex</Link>
      </nav>
      <Link to="/market-hours" {...prefetchProps('/market-hours')} className="inline-flex items-center gap-1.5 h-8 touch:h-10 px-3 rounded-full text-[13px] font-medium text-ink2 hover:text-ink border border-line/70">
        <Icon name="clock" size={14} />Market hours
      </Link>
    </div>
  );
}
