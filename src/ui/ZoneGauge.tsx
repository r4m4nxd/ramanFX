import { stateWord, type GaugeState } from '@/core/scanner';
import { num } from '@/lib/format';
import { cx } from './kit';
import { Explain } from './Explain';
import { gaugeTip } from '@/core/scannerGlossary';

export interface GaugeSide { pct: number; proximal?: number; distal?: number; tf?: string }

/**
 * Zone gauge (our own take on the idea): demand block on the left, supply block on the right, the price marker
 * between them placed by distance, "% away" under each side, and the state in the middle. The lit block = price is
 * inside that zone. Fully described in its aria-label.
 */
export function ZoneGauge({ demand, supply, state, compact, className, tip = true }: { demand?: GaugeSide | null; supply?: GaugeSide | null; state: GaugeState; compact?: boolean; className?: string; tip?: boolean }) {
  const d = demand?.pct, s = supply?.pct;
  // marker position on the track: 0 = at the demand proximal, 1 = at the supply proximal
  const pos = state === 'demand' || (d != null && d < 0) ? 0 : state === 'supply' ? 1 : d != null && s != null && d + s > 0 ? d / (d + s) : d != null ? Math.min(0.85, 0.15 + d / 20) : s != null ? Math.max(0.15, 0.85 - s / 20) : 0.5;
  const label = `Zone gauge: ${demand ? `demand ${num(d, 1)}% below` : 'no demand below'}, ${supply ? `supply ${num(s, 1)}% above` : 'no supply above'}, price ${stateWord(state).toLowerCase()}.`;
  const body = (
    <div role="img" aria-label={label} className={cx('min-w-0', !tip && className)}>
      <div className={cx('flex items-stretch gap-1', compact ? 'h-3' : 'h-4')}>
        <span className={cx('w-[22%] rounded-l-full border', state === 'demand' ? 'bg-profit border-profit' : demand ? 'bg-profit/25 border-profit/40' : 'bg-raised border-line')} />
        <span className="relative flex-1 rounded-sm bg-raised border border-line/70">
          <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-ink ring-2 ring-surface" style={{ left: `${Math.round(Math.max(0, Math.min(1, pos)) * 100)}%` }} />
        </span>
        <span className={cx('w-[22%] rounded-r-full border', state === 'supply' ? 'bg-loss border-loss' : supply ? 'bg-loss/25 border-loss/40' : 'bg-raised border-line')} />
      </div>
      {!compact && (
        <div className="grid grid-cols-3 gap-1 mt-1 text-[11px] leading-tight">
          <span className={cx('text-profit num truncate', tip && 'tip-u')}>{demand ? (d! < 0 ? 'inside demand' : `${num(d, 1)}% to demand`) : 'no demand'}</span>
          <span className={cx('text-center font-semibold', tip && 'tip-u', state === 'demand' ? 'text-profit' : state === 'supply' ? 'text-loss' : 'text-ink3')}>{stateWord(state)}</span>
          <span className={cx('text-loss num text-right truncate', tip && 'tip-u')}>{supply ? (s! < 0 ? 'inside supply' : `${num(s, 1)}% to supply`) : 'no supply'}</span>
        </div>
      )}
    </div>
  );
  return tip ? <Explain as="div" u={false} doc={gaugeTip({ demand, supply, state })} className={cx('min-w-0 block', className)}>{body}</Explain> : body;
}
