import { RULES, fmtR, type RuleId, type RuleMark, type RuleMarks, type RuleScore } from '@/core/ruleScore';
import { Card, CardHead, cx } from './kit';
import { Icon } from './Icon';

const OPTS: { v: RuleMark; label: string; icon: 'check' | 'x' | 'minus'; on: string; hint: string }[] = [
  { v: 'y', label: 'Followed', icon: 'check', on: 'bg-profit/15 text-profit border-profit/60', hint: 'text-profit border-profit/45' },
  { v: 'n', label: 'Broken', icon: 'x', on: 'bg-loss/15 text-loss border-loss/60', hint: 'text-loss border-loss/45' },
  { v: 'na', label: 'Not applicable', icon: 'minus', on: 'bg-raised text-ink border-ink3/70', hint: 'text-ink2 border-ink3/50' },
];

/**
 * Raja's key rules for one trade. One tap per rule: followed / broken / n/a. Values the data proves are shown
 * pre-selected with a dashed outline ("auto") until the owner taps; tapping the selected value clears it.
 */
export function RuleCheck({ stored, auto, onChange, scores }: { stored: RuleMarks; auto: RuleMarks; onChange: (next: RuleMarks) => void; scores?: RuleScore[] }) {
  const byId = new Map(scores?.map(s => [s.rule.id, s]));
  const ticked = RULES.filter(r => stored[r.id]).length;
  const pending = RULES.filter(r => !stored[r.id] && auto[r.id]);
  const set = (id: RuleId, v: RuleMark) => {
    const next = { ...stored };
    if (stored[id] === v) delete next[id]; else next[id] = v;
    onChange(next);
  };
  const broken = RULES.filter(r => (stored[r.id] ?? auto[r.id]) === 'n').length;
  return (
    <Card aria-label="Rule check">
      <CardHead title="Rule check" sub={ticked ? `${ticked} of ${RULES.length} ticked${broken ? ` · ${broken} broken` : ''}` : 'Raja’s key rules. Tap what you did; it builds your rule score.'}
        right={pending.length > 0 ? (
          <button type="button" className="btn h-9 text-xs" onClick={() => { const next = { ...stored }; for (const r of pending) next[r.id] = auto[r.id]; onChange(next); }}>
            <Icon name="check" size={13} />Accept {pending.length} auto
          </button>
        ) : undefined} />
      <ul className="flex flex-col -mx-1">
        {RULES.map(r => {
          const own = stored[r.id], sug = auto[r.id], val = own ?? sug;
          const s = byId.get(r.id);
          const costly = val === 'n' && s?.cost != null && s.cost < 0;
          return (
            <li key={r.id} className="flex items-center gap-3 px-1 py-2 border-t border-line first:border-0">
              <div className="min-w-0 flex-1">
                <div className="text-[13px] leading-snug text-ink">{r.text}</div>
                <div className="text-[11px] text-ink3 mt-0.5 flex flex-wrap gap-x-2">
                  <span>{r.never ? 'Never list · ' : ''}{r.src}</span>
                  {!own && sug && <span className="text-accent font-medium">auto</span>}
                  {costly && <span className="text-loss font-medium num">breaking it: {fmtR(s!.cost!)} over {s!.broken.n}</span>}
                </div>
              </div>
              <div role="radiogroup" aria-label={r.text} className="flex gap-1 shrink-0">
                {OPTS.map(o => {
                  const on = val === o.v;
                  return (
                    <button key={o.v} type="button" role="radio" aria-checked={on} aria-label={o.label} title={o.label} onClick={() => set(r.id, o.v)}
                      className={cx('press w-9 h-9 touch:w-10 touch:h-10 grid place-items-center rounded-full border', on ? (own ? o.on : cx('border-dashed', o.hint)) : 'border-line2 text-ink3/70')}>
                      <Icon name={o.icon} size={15} strokeWidth={2.4} />
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
