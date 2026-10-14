import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/data/store';
import type { WatchZone, ZoneStage } from '@/core/strategy';
import { Card, CardHead, cx, Field, Segmented, useToast } from './kit';
import { Icon } from './Icon';

const STAGES: { s: ZoneStage; t: string; hint: string }[] = [
  { s: 'waiting', t: 'Waiting', hint: 'Alert set just before the zone' },
  { s: 'touched', t: 'Touched', hint: 'Look for confirmation on the ETF' },
  { s: 'ordered', t: 'Order placed', hint: 'Let it play out' },
];
const NEXT: Partial<Record<ZoneStage, ZoneStage>> = { waiting: 'touched', touched: 'ordered', ordered: 'done' };

/** The process board: zones move left to right, never straight to "in a trade". */
export function ZoneBoard() {
  const zones = useStore(s => s.zones).filter(z => !z.deleted && z.stage !== 'done' && z.stage !== 'invalid');
  const save = useStore(s => s.saveZone), del = useStore(s => s.deleteZone);
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [d, setD] = useState<Partial<WatchZone>>({ side: 'buy', role: 'htf', tf: '1D' });
  const add = () => {
    if (!d.symbol) return;
    save({ id: `z_${Date.now().toString(36)}`, createdAt: Date.now(), updatedAt: Date.now(), symbol: d.symbol.toUpperCase(), side: d.side ?? 'buy', tf: d.tf ?? '1D', role: d.role ?? 'htf', proximal: d.proximal ?? null, distal: d.distal ?? null, stage: 'waiting', note: d.note });
    setAdding(false); setD({ side: 'buy', role: 'htf', tf: '1D' }); toast('Zone added — set your alert just before it');
  };
  return (
    <Card>
      <CardHead title="Zone watchlist" sub="Map zones before the session. Move them only when price earns it." right={<button className="btn h-9" onClick={() => setAdding(v => !v)}><Icon name={adding ? 'x' : 'plus'} size={14} />{adding ? 'Cancel' : 'Add zone'}</button>} />
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-4 mb-4 border-b border-line">
              <Field label="Symbol"><input className="field font-mono uppercase" value={d.symbol ?? ''} onChange={e => setD({ ...d, symbol: e.target.value })} placeholder="XAUUSD" /></Field>
              <Field label="Timeframe"><select className="field" value={d.tf} onChange={e => setD({ ...d, tf: e.target.value })}>{['1M', '1W', '1D', 'H4', 'H1', '15m', '5m'].map(t => <option key={t}>{t}</option>)}</select></Field>
              <Field label="Side"><Segmented label="Side" size="sm" value={d.side ?? 'buy'} onChange={v => setD({ ...d, side: v })} options={[{ value: 'buy', label: 'Demand' }, { value: 'sell', label: 'Supply' }]} /></Field>
              <Field label="Proximal"><input type="number" step="any" inputMode="decimal" className="field num" value={d.proximal ?? ''} onChange={e => setD({ ...d, proximal: e.target.value === '' ? null : +e.target.value })} /></Field>
              <Field label="Distal"><input type="number" step="any" inputMode="decimal" className="field num" value={d.distal ?? ''} onChange={e => setD({ ...d, distal: e.target.value === '' ? null : +e.target.value })} /></Field>
              <Field label="Role"><Segmented label="Role" size="sm" value={d.role ?? 'htf'} onChange={v => setD({ ...d, role: v })} options={[{ value: 'htf', label: 'HTF' }, { value: 'etf', label: 'ETF' }]} /></Field>
              <button className="btn-primary h-10 col-span-2 sm:col-span-3" disabled={!d.symbol} onClick={add}>Add to watchlist</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!zones.length && !adding ? <p className="text-[13px] text-ink3">No zones mapped. Add the HTF zones you're watching — each one moves Waiting → Touched → Order placed → Plan.</p> : (
      <div className="grid md:grid-cols-3 gap-3">
        {STAGES.map(st => {
          const xs = zones.filter(z => z.stage === st.s);
          return (
            <div key={st.s} className={cx('rounded-xl bg-raised/40 border border-line p-2.5 md:min-h-[120px]', !xs.length && 'max-md:hidden')}>
              <div className="flex items-baseline justify-between px-1 mb-2"><span className="text-[13px] font-semibold">{st.t}</span><span className="num text-xs text-ink3">{xs.length}</span></div>
              <div className="text-[11px] text-ink3 px-1 mb-2">{st.hint}</div>
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {xs.map(z => (
                    <motion.div key={z.id} layout layoutId={z.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="rounded-lg bg-surface border border-line p-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cx('w-1.5 h-6 rounded-full', z.side === 'buy' ? 'bg-profit' : 'bg-loss')} />
                        <span className="font-mono font-semibold text-[13px]">{z.symbol}</span>
                        <span className="text-[11px] text-ink3">{z.tf} {z.role.toUpperCase()} {z.side === 'buy' ? 'demand' : 'supply'}</span>
                        <button className="ml-auto btn-ghost h-7 w-7 px-0 text-ink3" aria-label="Remove zone" onClick={() => del(z.id)}><Icon name="x" size={12} /></button>
                      </div>
                      {(z.proximal != null || z.distal != null) && <div className="text-[11.5px] num text-ink2 mt-1">{z.proximal ?? '—'} / {z.distal ?? '—'}</div>}
                      <div className="flex gap-1.5 mt-2">
                        {NEXT[z.stage] === 'done'
                          ? <Link to={`/plan/new?symbol=${z.symbol}`} onClick={() => save({ ...z, stage: 'done' })} className="btn h-8 text-xs flex-1"><Icon name="target" size={12} />Plan it</Link>
                          : <button className="btn h-8 text-xs flex-1" onClick={() => save({ ...z, stage: NEXT[z.stage]! })}>→ {STAGES.find(s => s.s === NEXT[z.stage])?.t}</button>}
                        <button className="btn-ghost h-8 text-xs text-ink3" onClick={() => save({ ...z, stage: 'invalid' })} title="Price blew through it or it got tested">Invalid</button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {!xs.length && <div className="text-[12px] text-ink3 text-center py-4">—</div>}
              </div>
            </div>
          );
        })}
      </div>
      )}
    </Card>
  );
}
