import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useStore } from '@/data/store';
import { useFiltered } from '@/data/derived';
import { computeStats } from '@/core/stats';
import type { Strategy } from '@/core/types';
import { pct, rMult, tone, useMoney } from '@/lib/format';
import { Card, cx, Empty, Field, Page, rise, Sheet, useToast } from '@/ui/kit';
import { Sparkline } from '@/ui/charts';
import { Icon } from '@/ui/Icon';

export default function Strategies() {
  const list = useStore(s => s.strategies);
  const save = useStore(s => s.saveStrategy), del = useStore(s => s.deleteStrategy);
  const notes = useStore(s => s.notes);
  const et = useFiltered();
  const fmt = useMoney();
  const toast = useToast();
  const [edit, setEdit] = useState<Strategy | null>(null);
  const stats = useMemo(() => Object.fromEntries(list.map(s => [s.id, computeStats(et.filter(t => notes[t.id]?.strategyId === s.id))])), [list, et, notes]);
  const rulesText = (r: Strategy['rules']) => (Array.isArray(r) ? r.join('\n') : r ?? '');

  return (
    <Page>
      <div className="flex justify-between items-center">
        <p className="text-sm text-ink3">Define a strategy, then assign it to trades from the trade view.</p>
        <button className="btn-primary" onClick={() => setEdit({ id: `pb_${Date.now()}`, name: '', description: '', rules: [] })}><Icon name="plus" size={15} />New strategy</button>
      </div>
      {list.length ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {list.map(s => {
            const st = stats[s.id];
            return (
              <motion.button variants={rise} key={s.id} onClick={() => setEdit(s)} className="card p-5 text-left hover:border-line2 transition-colors flex flex-col gap-3">
                <div className="flex justify-between gap-2"><h3 className="font-semibold">{s.name || 'Untitled'}</h3><span className={cx('num font-semibold', tone(st.net))}>{fmt(st.net, { signed: true })}</span></div>
                {s.description && <p className="text-[13px] text-ink3 line-clamp-2">{s.description}</p>}
                <Sparkline values={st.equity.map(e => e.cum)} height={40} />
                <div className="grid grid-cols-4 gap-2 text-xs">
                  {[['Trades', String(st.total)], ['Win', pct(st.winRate, 0)], ['PF', st.profitFactor?.toFixed(2) ?? '—'], ['Avg R', rMult(st.avgR, 1)]].map(([k, v]) => <div key={k}><div className="text-ink3">{k}</div><div className="num mt-0.5">{v}</div></div>)}
                </div>
              </motion.button>
            );
          })}
        </div>
      ) : <Card><Empty icon="strategy" title="No strategies yet">Strategies group your trades so you can see which approach carries your edge.</Empty></Card>}

      <Sheet open={!!edit} onClose={() => setEdit(null)} title={edit && list.some(x => x.id === edit.id) ? 'Edit strategy' : 'New strategy'}>
        <AnimatePresence>
          {edit && (
            <div className="flex flex-col gap-4">
              <Field label="Name"><input className="field" value={edit.name} onChange={e => setEdit({ ...edit, name: e.target.value })} autoFocus /></Field>
              <Field label="Description"><textarea rows={3} className="w-full p-3 text-sm" value={edit.description ?? ''} onChange={e => setEdit({ ...edit, description: e.target.value })} /></Field>
              <Field label="Rules (one per line)"><textarea rows={8} className="w-full p-3 text-sm leading-relaxed" value={rulesText(edit.rules)} onChange={e => setEdit({ ...edit, rules: e.target.value.split('\n') })} /></Field>
              <div className="flex gap-2">
                {list.some(x => x.id === edit.id) && <button className="btn text-loss" onClick={() => { if (confirm('Delete this strategy? Trades keep their notes.')) { del(edit.id); setEdit(null); toast('Strategy deleted'); } }}><Icon name="trash" size={14} />Delete</button>}
                <button className="btn-primary ml-auto" disabled={!edit.name.trim()} onClick={() => { save({ ...edit, rules: (Array.isArray(edit.rules) ? edit.rules : [edit.rules ?? '']).map(r => r.trim()).filter(Boolean) }); setEdit(null); toast('Strategy saved'); }}>Save</button>
              </div>
            </div>
          )}
        </AnimatePresence>
      </Sheet>
    </Page>
  );
}
