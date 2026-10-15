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

const FIELDS: { k: keyof RiskRules; label: string; hint: string; step: number; money?: boolean }[] = [
  { k: 'maxDailyLoss', label: 'Max daily loss', hint: 'Net loss for the day that ends trading', step: 1, money: true },
  { k: 'maxSingleTradeRisk', label: 'Max risk per trade', hint: 'Entry-to-stop risk on any single trade', step: 1, money: true },
  { k: 'riskPercent', label: 'Default risk % (calculator)', hint: 'Pre-fills the position size calculator', step: 0.1 },
  { k: 'maxPositionSizeLots', label: 'Max position size (lots)', hint: 'Hard cap on a single position', step: 0.01 },
  { k: 'maxDailyTrades', label: 'Max trades per day', hint: 'Daily trade cap', step: 1 },
  { k: 'maxConsecutiveLosses', label: 'Losses in a row before cooldown', hint: 'Triggers the cooldown below', step: 1 },
  { k: 'cooldownMinutes', label: 'Cooldown (minutes)', hint: 'Mandatory break after the losing streak', step: 5 },
];

export default function Risk() {
  const saved = useStore(s => s.riskRules);
  const setRules = useStore(s => s.setRiskRules);
  const checklist = useStore(s => s.checklist);
  const setJ = useStore(s => s.set);
  const all = useEnriched();
  const fmt = useMoney();
  const toast = useToast();
  const [r, setR] = useState<RiskRules>({ ...DEFAULT_RISK_RULES, ...saved });
  const [list, setList] = useState(checklist.join('\n'));
  const st = useMemo(() => riskStatus(all, { ...DEFAULT_RISK_RULES, ...saved }), [all, saved]);
  const [gate, setGate] = useState<Record<string, boolean>>({});
  const gateItems = ['I checked HTF / ITF / ETF and the matrix gives a play', 'My entry is at a qualifying zone', 'Size comes from the calculator', `Risk is at or below ${fmt(r.maxSingleTradeRisk)}`, "I'm not trading to win back a loss"];
  const gateOk = gateItems.every(g => gate[g]) && !st.locked;

  return (
    <Page>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <Card className="xl:col-span-2">
          <CardHead title="Today" sub="Live against your rules" right={<Badge tone={st.locked ? 'loss' : st.warnings.length ? 'warn' : 'profit'}>{st.locked ? 'LOCKED' : st.warnings.length ? 'CAUTION' : 'CLEAR'}</Badge>} />
          <div className="grid sm:grid-cols-3 gap-5">
            <div><div className="flex justify-between text-xs text-ink2 mb-1.5"><span>Loss limit</span><span className="num">{fmt(st.lossToday)} / {fmt(r.maxDailyLoss)}</span></div><Bar value={st.lossUsed} tone={st.lossUsed >= 1 ? 'loss' : st.lossUsed >= 0.7 ? 'warn' : 'profit'} /></div>
            <div><div className="flex justify-between text-xs text-ink2 mb-1.5"><span>Trades</span><span className="num">{st.count} / {r.maxDailyTrades}</span></div><Bar value={st.tradesUsed} tone={st.tradesUsed >= 1 ? 'loss' : 'accent'} /></div>
            <div><div className="flex justify-between text-xs text-ink2 mb-1.5"><span>Losing streak</span><span className="num">{st.consecLosses} / {r.maxConsecutiveLosses}</span></div><Bar value={r.maxConsecutiveLosses ? st.consecLosses / r.maxConsecutiveLosses : 0} tone="warn" /></div>
          </div>
          {[...st.breaches.map(b => b.text), ...st.warnings].map(t => <p key={t} className={cx('text-sm mt-3 flex items-center gap-2', st.locked ? 'text-loss' : 'text-warn')}><Icon name="alert" size={14} />{t}</p>)}
          <p className="text-[11.5px] text-ink3 mt-4">Based on trades imported so far today. Import after each session for a live read.</p>
        </Card>

        <Card>
          <CardHead title="Pre-trade gate" sub="Tick all five before you click buy or sell" />
          {gateItems.map(g => {
            const on = !!gate[g];
            return (
              <button key={g} role="checkbox" aria-checked={on} onClick={() => setGate(x => ({ ...x, [g]: !on }))} className="w-full flex items-start gap-3 py-2 text-left">
                <motion.span animate={{ scale: on ? [1, 1.2, 1] : 1 }} className={cx('mt-0.5 w-[18px] h-[18px] rounded-md border grid place-items-center shrink-0', on ? 'bg-profit border-profit text-on-status' : 'border-line2')}>{on && <Icon name="check" size={12} strokeWidth={3} />}</motion.span>
                <span className="text-[13px] text-ink2 leading-snug">{g}</span>
              </button>
            );
          })}
          <motion.div animate={{ scale: gateOk ? [1, 1.03, 1] : 1 }} className={cx('mt-3 p-3 rounded-xl text-center font-semibold text-sm', gateOk ? 'bg-profit/15 text-profit' : st.locked ? 'bg-loss/10 text-loss' : 'bg-raised text-ink3')}>
            {st.locked ? 'Locked for today' : gateOk ? 'OK to enter' : 'Not yet'}
          </motion.div>
          <div className="flex gap-2 mt-3"><Link to="/playbook" className="btn flex-1">Playbook</Link><Link to="/calculator" className="btn flex-1">Calculator</Link></div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <Card className="xl:col-span-2">
          <CardHead title="Rules" sub="Amounts in your account currency" />
          <div className="grid sm:grid-cols-2 gap-4">
            {FIELDS.map(f => (
              <Field key={f.k} label={f.label} hint={f.hint}>
                <input type="number" step={f.step} min="0" inputMode="decimal" className="field num" value={String(r[f.k] ?? '')} onChange={e => setR({ ...r, [f.k]: e.target.value === '' ? 0 : +e.target.value })} />
              </Field>
            ))}
          </div>
          <div className="flex justify-end gap-2 mt-5">
            <button className="btn" onClick={() => setR({ ...DEFAULT_RISK_RULES })}>Defaults</button>
            <button className="btn-primary" onClick={() => { setRules(r); toast('Risk rules saved'); }}>Save rules</button>
          </div>
        </Card>
        <Card>
          <CardHead title="Pre-session checklist" sub="One item per line — shown on the dashboard" />
          <textarea aria-label="Checklist items" rows={8} className="w-full p-3 text-sm leading-relaxed" value={list} onChange={e => setList(e.target.value)} />
          <button className="btn-primary w-full mt-3" onClick={() => { setJ('checklist', list.split('\n').map(x => x.trim()).filter(Boolean)); toast('Checklist saved'); }}>Save checklist</button>
          <p className="text-[11px] text-ink3 mt-2">Ticks are kept per day; renaming an item starts it fresh.</p>
        </Card>
      </div>
    </Page>
  );
}
