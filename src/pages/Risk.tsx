import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_RISK_RULES, useStore } from '@/data/store';
import { useEnriched } from '@/data/derived';
import { riskStatus } from '@/core/risk';
import type { RiskRules } from '@/core/types';
import { useMoney } from '@/lib/format';
import { Badge, Bar, Card, CardHead, cx, Field, Page, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { readLocal, writeLocal } from './calcShared';
import { MentorChecks } from '@/ui/LessonLinks';

const FIELDS: { k: keyof RiskRules; label: string; hint: string; step: number; money?: boolean }[] = [
  { k: 'maxDailyLoss', label: 'Max daily loss', hint: 'Net loss for the day that ends trading', step: 1, money: true },
  { k: 'maxSingleTradeRisk', label: 'Max risk per trade', hint: 'Entry-to-stop risk on any single trade', step: 1, money: true },
  { k: 'riskPercent', label: 'Default risk % (calculator)', hint: 'Pre-fills the position size calculator', step: 0.1 },
  { k: 'maxPositionSizeLots', label: 'Max position size (lots)', hint: 'Hard cap on a single position', step: 0.01 },
  { k: 'maxDailyTrades', label: 'Max trades per day', hint: 'Daily trade cap', step: 1 },
  { k: 'maxConsecutiveLosses', label: 'Losses in a row before cooldown', hint: 'Triggers the cooldown below', step: 1 },
  { k: 'cooldownMinutes', label: 'Cooldown (minutes)', hint: 'Mandatory break after the losing streak', step: 5 },
];

const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const GATE_KEY = 'rfx_gate';

type Draft = { [K in keyof RiskRules]: RiskRules[K] | '' };

function Meter({ label, used, limit, value, tone }: { label: string; used: React.ReactNode; limit: React.ReactNode; value: number; tone: 'profit' | 'warn' | 'loss' | 'accent' }) {
  const hot = value >= 0.7;
  return (
    <div className="min-w-0">
      <div className="label">{label}</div>
      <div className="flex items-baseline gap-1.5 mt-1 mb-2 num">
        <span className={cx('text-xl font-semibold tracking-tight', hot ? `text-${tone}` : 'text-ink')}>{used}</span>
        <span className="text-sm text-ink3">/ {limit}</span>
      </div>
      <Bar value={value} tone={tone} />
    </div>
  );
}

export default function Risk() {
  const saved = useStore(s => s.riskRules);
  const setRules = useStore(s => s.setRiskRules);
  const checklist = useStore(s => s.checklist);
  const setJ = useStore(s => s.set);
  const all = useEnriched();
  const fmt = useMoney();
  const toast = useToast();
  const base = useMemo(() => ({ ...DEFAULT_RISK_RULES, ...saved }) as RiskRules, [saved]);
  const [r, setR] = useState<Draft>(base as Draft);
  const [list, setList] = useState(checklist.join('\n'));
  const st = useMemo(() => riskStatus(all, base), [all, base]);
  // Gate ticks are kept for the day, so following the Playbook / Calculator links doesn't wipe them.
  const [gate, setGateRaw] = useState<Record<string, boolean>>(() => { const g = readLocal<{ day: string; ticks: Record<string, boolean> }>(GATE_KEY); return g && g.day === todayKey() ? g.ticks : {}; });
  const setGate = (ticks: Record<string, boolean>) => { setGateRaw(ticks); writeLocal(GATE_KEY, { day: todayKey(), ticks }); };
  const gateItems = ['I checked HTF / ITF / ETF and the matrix gives a play', 'My entry is at a qualifying zone', 'Size comes from the calculator', `Risk is at or below ${fmt(base.maxSingleTradeRisk)}`, "I'm not trading to win back a loss"];
  const ticked = gateItems.filter(g => gate[g]).length;
  const gateOk = ticked === gateItems.length && !st.locked;

  const blank = FIELDS.filter(f => r[f.k] === '');
  const dirty = FIELDS.some(f => r[f.k] !== base[f.k]);
  const balance = useStore(s => (s.activeAccount !== 'all' ? s.accounts[s.activeAccount]?.snapshot?.balance : Object.values(s.accounts)[0]?.snapshot?.balance) ?? null);
  const pctRisk = balance && r.riskPercent !== '' ? balance * (r.riskPercent as number) / 100 : null;
  const pctConflict = pctRisk != null && r.maxSingleTradeRisk !== '' && (r.maxSingleTradeRisk as number) > 0 && pctRisk > (r.maxSingleTradeRisk as number);
  const saveRules = () => { if (blank.length) return; setRules(r as RiskRules); toast('Risk rules saved'); };
  const listDirty = list.split('\n').map(x => x.trim()).filter(Boolean).join('\n') !== checklist.join('\n');

  const lossTone = st.lossUsed >= 1 ? 'loss' : st.lossUsed >= 0.7 ? 'warn' : 'profit';
  return (
    <Page>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <div className="xl:col-span-2 flex flex-col gap-4 min-w-0">
          <Card className={cx(st.locked && 'border-loss/50')}>
            <CardHead title="Today" sub="Live against your rules" right={<Badge tone={st.locked ? 'loss' : st.warnings.length ? 'warn' : 'profit'}>{st.locked ? 'Locked' : st.warnings.length ? 'Caution' : 'Clear'}</Badge>} />
            {st.locked && <div role="alert" className="mb-4 p-3 rounded-xl bg-loss/10 text-loss text-sm font-semibold flex items-center gap-2"><Icon name="alert" size={15} />Trading is locked for today. Step away and review instead.</div>}
            <div className="grid sm:grid-cols-3 gap-5">
              <Meter label="Loss limit" used={fmt(st.lossToday)} limit={fmt(base.maxDailyLoss)} value={st.lossUsed} tone={lossTone} />
              <Meter label="Trades" used={st.count} limit={base.maxDailyTrades} value={st.tradesUsed} tone={st.tradesUsed >= 1 ? 'loss' : 'accent'} />
              <Meter label="Losing streak" used={st.consecLosses} limit={base.maxConsecutiveLosses} value={base.maxConsecutiveLosses ? st.consecLosses / base.maxConsecutiveLosses : 0} tone="warn" />
            </div>
            {[...st.breaches.map(b => b.text), ...st.warnings].map(t => <p key={t} className={cx('text-sm mt-3 flex items-center gap-2', st.locked ? 'text-loss' : 'text-warn')}><Icon name="alert" size={14} />{t}</p>)}
            <p className="text-[11.5px] text-ink3 mt-4">Based on trades imported so far today. Import after each session for a live read.</p>
          </Card>

          <Card>
            <CardHead title="Rules" sub="Amounts in your account currency" right={dirty ? <Badge tone="warn">Unsaved</Badge> : undefined} />
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              {FIELDS.map(f => (
                <Field key={f.k} label={f.label} hint={r[f.k] === '' ? undefined : f.hint}>
                  <input type="number" step={f.step} min="0" inputMode="decimal" aria-invalid={r[f.k] === '' || undefined} className={cx('field num', r[f.k] === '' && 'border-loss')} value={String(r[f.k] ?? '')} onChange={e => setR({ ...r, [f.k]: e.target.value === '' ? '' : +e.target.value })} />
                  {r[f.k] === '' && <span className="text-[12px] text-loss mt-1 block">Enter a number</span>}
                  {f.k === 'riskPercent' && pctConflict && <span className="text-[12px] text-warn mt-1 block">{r.riskPercent}% ≈ {fmt(pctRisk!)}, above your {fmt(r.maxSingleTradeRisk as number)} max per trade</span>}
                </Field>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2 mt-5 sticky bottom-[calc(58px+max(12px,env(safe-area-inset-bottom)))] land:!bottom-0 lg:static bg-surface py-2 -my-2 z-10">
              <button className="btn" onClick={() => setR({ ...DEFAULT_RISK_RULES } as Draft)}>Reset to defaults</button>
              {dirty && <button className="btn" onClick={() => setR(base as Draft)}>Discard</button>}
              <button className="btn-primary" disabled={!dirty || blank.length > 0} onClick={saveRules}>Save rules</button>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Card>
            <CardHead title="Pre-trade gate" sub="Tick all five before you click buy or sell" right={ticked ? <button className="btn h-8 touch:h-10 text-xs" onClick={() => setGate({})}>Reset</button> : undefined} />
            {gateItems.map(g => {
              const on = !!gate[g];
              return (
                <button key={g} role="checkbox" aria-checked={on} onClick={() => setGate({ ...gate, [g]: !on })} className="w-full flex items-start gap-3 py-2 min-h-[40px] text-left">
                  <motion.span animate={{ scale: on ? [1, 1.2, 1] : 1 }} className={cx('mt-0.5 w-[18px] h-[18px] rounded-md border grid place-items-center shrink-0', on ? 'bg-profit border-profit text-on-status' : 'border-line2')}>{on && <Icon name="check" size={12} strokeWidth={3} />}</motion.span>
                  <span className="text-[13px] text-ink2 leading-snug">{g}</span>
                </button>
              );
            })}
            <motion.div role="status" aria-live="polite" animate={{ scale: gateOk ? [1, 1.03, 1] : 1 }} className={cx('mt-3 p-3 rounded-xl text-center font-semibold text-sm', gateOk ? 'bg-profit/15 text-profit' : st.locked ? 'bg-loss/10 text-loss' : 'bg-raised text-ink3')}>
              {st.locked ? 'Locked for today' : gateOk ? 'OK to enter' : `Not yet · ${ticked}/${gateItems.length}`}
            </motion.div>
            <Link to="/plan/new" className="btn-primary w-full mt-3"><Icon name="plus" size={15} />Plan a trade</Link>
            <div className="flex gap-2 mt-2"><Link to="/playbook" className="btn flex-1">Playbook</Link><Link to="/calculator" className="btn flex-1">Calculator</Link></div>
            <p className="text-[11px] text-ink3 mt-2">Ticks are kept until the end of the day.</p>
          </Card>
          <Card>
            <CardHead title="Session routine" sub="One item per line. Ticked on the dashboard before each session." />
            <textarea aria-label="Session routine items" rows={8} className="w-full p-3 text-sm leading-relaxed" value={list} onChange={e => setList(e.target.value)} />
            <button className="btn-primary w-full mt-3" disabled={!listDirty} onClick={() => { setJ('checklist', list.split('\n').map(x => x.trim()).filter(Boolean)); toast('Routine saved'); }}>Save routine</button>
            <p className="text-[11px] text-ink3 mt-2">Ticks are kept per day; renaming an item starts it fresh.</p>
          </Card>
        </div>
      </div>
      <Card>
        <details>
          <summary className="cursor-pointer list-none flex items-center justify-between gap-3"><span><span className="text-[15px] font-semibold block">Mentor's pre-trade checks</span><span className="text-[12.5px] text-ink3">Every check from the video lessons, linked to its lesson</span></span><Icon name="chevronDown" size={16} className="text-ink3 shrink-0" /></summary>
          <div className="mt-4"><MentorChecks /></div>
        </details>
      </Card>
    </Page>
  );
}
