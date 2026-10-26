import { Link, useLocation } from 'react-router-dom';
import { cx } from '@/ui/kit';

/** "Stocks | Forex" switch at the top of the scanner pages. */
export function ScannerSwitch() {
  const fx = useLocation().pathname.startsWith('/scanner/fx');
  const item = (on: boolean) => cx('relative rounded-full font-semibold whitespace-nowrap transition-colors h-8 touch:h-10 px-4 text-[13px] inline-flex items-center', on ? 'pill-on text-ink' : 'text-ink3 hover:text-ink2');
  return (
    <nav aria-label="Scanner market" className="self-start inline-flex p-[3px] rounded-full bg-raised/50 border border-line/70">
      <Link to="/scanner" aria-current={!fx ? 'page' : undefined} className={item(!fx)}>Stocks</Link>
      <Link to="/scanner/fx" aria-current={fx ? 'page' : undefined} className={item(fx)}>Forex</Link>
    </nav>
  );
}
