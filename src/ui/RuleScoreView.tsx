import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useRuleScore } from '@/data/ruleChecks';
import { SMALL_SAMPLE, autoMarks, fmtR, planWarnings, type RuleGroup, type RuleScore, type RuleWarning } from '@/core/ruleScore';
import type { Plan } from '@/core/strategy';
import { pct, rMult, tone } from '@/lib/format';
import { Badge, Card, CardHead, cx, Empty } from './kit';
import { Icon } from './Icon';

/** Followed vs broken as a small table: trades, win rate, average R and total R per side. */
function GroupTable({ s }: { s: RuleScore }) {
  const rows: [string, RuleGroup, string][] = [['Followed', s.followed, 'text-profit'], ['Broken', s.broken, 'text-loss']];
  return (
    <div role="table" aria-label={`${s.rule.name}: followed vs broken`} className="mt-2.5 rounded-lg border border-line bg-raised/40 px-3 py-1.5 text-[12.5px] num grid grid-cols-[minmax(0,1fr)_repeat(4,auto)] gap-x-3 sm:gap-x-5 items-center">
      <div role="row" className="contents text-[10.5px] text-ink3">
        <span role="columnheader" className="py-1"><span className="sr-only">Side</span></span>
        <span role="columnheader" className="text-right">Trades</span><span role="columnheader" className="text-right">Win</span><span role="columnheader" className="text-right">Avg R</span><span role="columnheader" className="text-right">Total R</span>
      </div>
      {rows.map(([k, g, c]) => (
        <div role="row" key={k} className="contents">
          <span role="rowheader" className={cx('font-semibold font-sans py-1 truncate', c)}>{k}</span>
          <span role="cell" className="text-right">{g.n}</span>
          <span role="cell" className="text-right">{g.n ? pct(g.winRate, 0) : '—'}</span>
          <span role="cell" className={cx('text-right', tone(g.avgR))}>{rMult(g.avgR, 2)}</span>
          <span role="cell" className={cx('text-right font-semibold', g.rN ? tone(g.totalR) : 'text-ink3')}>{g.rN ? rMult(g.totalR, 1) : '—'}</span>
        </div>
      ))}
    </div>
  );
}

function RuleRow({ s }: { s: RuleScore }) {
  const hurt = s.cost != null && s.cost < 0;
  return (
    <li className="py-3.5 border-t border-line first:border-0 first:pt-0">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-medium leading-snug">{s.rule.text}</div>
          <div className="text-[11.5px] text-ink3 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{s.rule.never ? 'Never list · ' : ''}{s.rule.src}</span>
            {s.small && s.cost != null && <span className="text-warn">small sample</span>}
            {s.na > 0 && <span className="num">{s.na} n/a</span>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className={cx('num text-lg font-semibold leading-tight', s.cost == null ? 'text-ink3' : tone(s.cost))}>{s.cost == null ? '—' : fmtR(s.cost)}</div>
          <div className="text-[10.5px] text-ink3">{s.cost == null ? (s.broken.n ? 'nothing to compare' : 'never broken') : `${hurt ? 'cost' : 'gain'} over ${s.broken.rN} trade${s.broken.rN === 1 ? '' : 's'}`}</div>
        </div>
      </div>
      <GroupTable s={s} />
    </li>
  );
}

/** Reports → Rules: which of Raja's rules you break and what each break costs, from your own checked trades. */
export function RuleScoreView() {
  const { checks, reviewed, scores } = useRuleScore();
  const latest = useMemo(() => [...checks].sort((a, b) => b.g.t.close.getTime() - a.g.t.close.getTime())[0], [checks]);

  if (!reviewed.length) return (
    <Card>
      <Empty icon="target" title="No rule checks yet"
        action={latest ? <Link className="btn-primary h-10" to={`/trades/${latest.g.t.id}`}>Check your latest trade</Link> : <Link className="btn h-10" to="/trades">Open your trades</Link>}>
        Tick rules on a few trades to see your cost of breaking them. Each trade has a Rule check card with Raja's key rules; risk, revenge and anything a plan proves are filled in for you.
      </Empty>
    </Card>
  );

  const used = scores.filter(s => s.followed.n || s.broken.n);
  const unused = scores.filter(s => !s.followed.n && !s.broken.n);
  const worst = used.find(s => s.cost != null && s.cost < 0);
  const lost = used.reduce((a, s) => a + (s.cost != null && s.cost < 0 ? s.cost : 0), 0);
  const brokenTrades = reviewed.filter(c => Object.values(c.marks).includes('n')).length;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        {worst ? (<>
          <div className="label">Your most expensive habit</div>
          <p className="text-[17px] sm:text-xl font-semibold tracking-tight leading-snug mt-1.5 text-pretty">
            Breaking “{worst.rule.name}” cost you <span className="text-loss num">{fmtR(worst.cost!)}</span> over {worst.broken.rN} trade{worst.broken.rN === 1 ? '' : 's'}.
          </p>
          <p className="text-[12.5px] text-ink3 mt-1.5 leading-relaxed">
            When you followed it you averaged <span className="num">{rMult(worst.followed.avgR, 2)}</span>; when you broke it, <span className="num">{rMult(worst.broken.avgR, 2)}</span>.
            {worst.small && ` Early read: fewer than ${SMALL_SAMPLE} trades on one side.`}
          </p>
        </>) : (<>
          <div className="label">No costly break yet</div>
          <p className="text-[15px] font-semibold mt-1.5">None of the rules you broke has cost you R so far.</p>
          <p className="text-[12.5px] text-ink3 mt-1">Keep ticking: a cost shows once a rule has trades on both sides.</p>
        </>)}
        <div className="grid grid-cols-3 gap-2 mt-4">
          {([
            ['Checked', `${reviewed.length}`, `of ${checks.length} trades`],
            ['Broke one', `${brokenTrades}`, `${pct(brokenTrades / reviewed.length, 0)} of them`],
            ['R lost', lost < 0 ? fmtR(lost) : '0R', 'to broken rules'],
          ] as const).map(([k, v, sub]) => (
            <div key={k} className="rounded-xl bg-raised/60 border border-line px-3 py-2.5 min-w-0">
              <div className="label truncate">{k}</div>
              <div className={cx('num text-[16px] font-semibold mt-0.5 truncate', k === 'R lost' && lost < 0 && 'text-loss')}>{v}</div>
              <div className="text-[10.5px] text-ink3 num truncate">{sub}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHead title="Rule score" sub={`Cost of breaking = (avg R broken − avg R followed) × broken trades. Worst first · ${reviewed.length} checked trades in this range`} />
        <ul>{used.map(s => <RuleRow key={s.rule.id} s={s} />)}</ul>
        {unused.length > 0 && (
          <div className="mt-3 pt-3 border-t border-line">
            <div className="label mb-1.5">Not ticked yet</div>
            <div className="flex flex-wrap gap-1.5">{unused.map(s => <Badge key={s.rule.id}>{s.rule.name}</Badge>)}</div>
          </div>
        )}
        <p className="text-[11.5px] text-ink3 mt-4 leading-relaxed">Under {SMALL_SAMPLE} trades on a side is a small sample: treat it as a hint, not a verdict. Only trades you have ticked count; risk, revenge and anything a plan proves fill in the rest of those trades for you.</p>
      </Card>
    </div>
  );
}

/** Rules this plan breaks that have cost the owner R before, with his own numbers. */
export function usePlanWarnings(plan: Plan, pip: number, digits: number): RuleWarning[] {
  const { scores } = useRuleScore({ allTime: true });
  return useMemo(() => planWarnings(autoMarks({ side: plan.side, plan, pip, digits }), scores), [plan, pip, digits, scores]);
}

export function PlanRuleWarnings({ warnings }: { warnings: RuleWarning[] }) {
  if (!warnings.length) return null;
  return (
    <div role="note" className="rounded-xl border border-loss/40 bg-loss/[0.06] p-4">
      <div className="flex items-center gap-2 text-[13px] font-semibold text-loss"><Icon name="alert" size={15} />This plan breaks {warnings.length === 1 ? 'a rule that has' : `${warnings.length} rules that have`} cost you before</div>
      <ul className="mt-2.5 flex flex-col gap-2">
        {warnings.map(({ rule, score: s }) => (
          <li key={rule.id} className="text-[12.5px] leading-relaxed">
            <span className="text-ink font-medium">{rule.text}.</span>{' '}
            <span className="text-ink2">Trades like this: <span className="num font-semibold text-loss">{s.broken.n} trade{s.broken.n === 1 ? '' : 's'}, {fmtR(s.cost!)}</span> against following it{s.small ? ' (small sample)' : ''}.</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
