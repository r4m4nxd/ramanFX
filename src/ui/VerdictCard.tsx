import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/data/store';
import { usePlans, type Graded } from '@/data/guru';
import { formation, SD_COMBOS } from '@/core/strategy';
import { Card, cx, ease } from './kit';
import { Icon } from './Icon';
import { ReasonList } from './PlanParts';

/** The guru's read on one trade: plan link, odds, adherence and blunt rule-cited lines. */
export function VerdictCard({ g }: { g: Graded }) {
  const plans = usePlans();
  const save = useStore(s => s.savePlan);
  const [pick, setPick] = useState(false);
  const { t, plan, verdict, eval: ev } = g;
  const candidates = plans.filter(p => !p.tradeId && !p.retro && p.symbol.toUpperCase() === t.sym.toUpperCase());
  const adh = verdict.adherence;
  const tone = adh == null ? 'ink3' : adh >= 80 ? 'profit' : adh >= 50 ? 'warn' : 'loss';
  const R = 30, C = 2 * Math.PI * R;
  return (
    <Card className="luxe-border" aria-label="Strategy verdict">
      <div className="flex items-start gap-4">
        <div className="relative w-[76px] h-[76px] shrink-0">
          <svg viewBox="0 0 70 70" className="w-full h-full -rotate-90" aria-hidden="true">
            <circle cx="35" cy="35" r={R} fill="none" stroke="rgb(var(--line))" strokeWidth="6" />
            <motion.circle cx="35" cy="35" r={R} fill="none" stroke={`rgb(var(--${tone}))`} strokeWidth="6" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - (adh ?? 0) / 100) }} transition={{ duration: 0.9, ease }} />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center"><div><div className="num text-lg font-semibold leading-none">{adh ?? '—'}{adh != null && <span className="text-[10px]">%</span>}</div><div className="text-[9px] text-ink3 mt-0.5">rules kept</div></div></div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="label flex items-center gap-1.5"><Icon name="sparkles" size={12} />Guru verdict</div>
          <div className="text-[16px] font-semibold leading-snug mt-1">{verdict.headline}</div>
          {plan && ev && (
            <div className="text-[12px] text-ink3 mt-1">
              <span className={cx('font-bold', !ev.tradeable ? 'text-loss' : ev.odds === 'high' ? 'text-profit' : 'text-warn')}>{!ev.tradeable ? 'NO-TRADE SETUP' : ev.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS'}</span>
              {' '}· {plan.method === 'sf' ? 'Set & forget' : 'Confirmation'} · {SD_COMBOS[plan.combo].etf}→{SD_COMBOS[plan.combo].htf} · {formation(plan.kind, plan.side)} · score {ev.score}
              {plan.retro && ' · graded after the fact'}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4"><ReasonList items={verdict.lines} /></div>
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-line">
        {plan ? <Link to={`/plan/${plan.id}`} className="btn h-9"><Icon name="edit" size={13} />{plan.retro ? 'Edit grade' : 'Open plan'}</Link>
          : <Link to={`/plan/new?trade=${t.id}`} className="btn-primary h-9"><Icon name="target" size={14} />Grade this trade</Link>}
        {!plan && candidates.length > 0 && <button className="btn h-9" onClick={() => setPick(v => !v)}><Icon name="link" size={13} />Link a plan ({candidates.length})</button>}
        {plan && !plan.retro && plan.tradeId === t.id && <button className="btn-ghost h-9 text-ink3" onClick={() => save({ ...plan, tradeId: null })}>Unlink</button>}
        {plan && !plan.tradeId && <button className="btn-ghost h-9 text-ink3" onClick={() => save({ ...plan, tradeId: t.id, status: 'filled' })}>Confirm link</button>}
      </div>
      {pick && (
        <ul className="mt-3 flex flex-col gap-1.5">
          {candidates.map(p => (
            <li key={p.id}><button className="w-full text-left rounded-lg border border-line px-3 py-2 hover:border-accent text-[13px]" onClick={() => { save({ ...p, tradeId: t.id, status: 'filled' }); setPick(false); }}>
              <b className="font-mono">{p.symbol}</b> {p.side === 'buy' ? 'long' : 'short'} @ {p.entry ?? '—'} · {new Date(p.createdAt).toLocaleDateString()}
            </button></li>
          ))}
        </ul>
      )}
    </Card>
  );
}
