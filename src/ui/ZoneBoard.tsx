import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/data/store';
import type { WatchZone, ZoneStage } from '@/core/strategy';
import { Card, CardHead, cx, Field, Segmented, Sheet, useToast } from './kit';
import { Icon } from './Icon';

const STAGES: { s: ZoneStage; t: string; hint: string }[] = [
  { s: 'waiting', t: 'Waiting', hint: 'Alert set just before the zone' },
  { s: 'touched', t: 'Touched', hint: 'Look for confirmation on the ETF' },
  { s: 'ordered', t: 'Order placed', hint: 'Let it play out' },
];
const NEXT: Partial<Record<ZoneStage, ZoneStage>> = { waiting: 'touched', touched: 'ordered', ordered: 'done' };

const BLANK: Partial<WatchZone> = { side: 'buy', role: 'htf', tf: '1D' };
const ALL_STAGES: { value: ZoneStage; label: string }[] = [{ value: 'waiting', label: 'Waiting' }, { value: 'touched', label: 'Touched' }, { value: 'ordered', label: 'Order placed' }, { value: 'done', label: 'Planned' }, { value: 'invalid', label: 'Invalid' }];

/** Add or edit form — the same fields either way. */
function ZoneForm({ init, onSave, onCancel, editing }: { init: Partial<WatchZone>; onSave: (d: Partial<WatchZone>) => void; onCancel?: () => void; editing?: boolean }) {
  const [d, setD] = useState<Partial<WatchZone>>(init);
  const num = (v: string) => (v === '' ? null : +v);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <Field label="Symbol"><input className="field font-mono uppercase" value={d.symbol ?? ''} onChange={e => setD({ ...d, symbol: e.target.value })} placeholder="XAUUSD" /></Field>
      <Field label="Timeframe"><select className="field" value={d.tf} onChange={e => setD({ ...d, tf: e.target.value })}>{['1M', '1W', '1D', 'H4', 'H1', '15m', '5m', '1m'].map(t => <option key={t}>{t}</option>)}</select></Field>
      <Field label="Side"><Segmented label="Side" size="sm" value={d.side ?? 'buy'} onChange={v => setD({ ...d, side: v })} options={[{ value: 'buy', label: 'Demand' }, { value: 'sell', label: 'Supply' }]} /></Field>
      <Field label="Proximal"><input type="number" step="any" inputMode="decimal" className="field num" value={d.proximal ?? ''} onChange={e => setD({ ...d, proximal: num(e.target.value) })} /></Field>
      <Field label="Distal"><input type="number" step="any" inputMode="decimal" className="field num" value={d.distal ?? ''} onChange={e => setD({ ...d, distal: num(e.target.value) })} /></Field>
      <Field label="Role"><Segmented label="Role" size="sm" value={d.role ?? 'htf'} onChange={v => setD({ ...d, role: v })} options={[{ value: 'htf', label: 'HTF' }, { value: 'etf', label: 'ETF' }]} /></Field>
      {editing && <div className="col-span-2 sm:col-span-1"><Field label="Stage"><select className="field" value={d.stage} onChange={e => setD({ ...d, stage: e.target.value as ZoneStage })}>{ALL_STAGES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></Field></div>}
      <div className={editing ? 'col-span-2' : 'col-span-2 sm:col-span-3'}><Field label="Note"><input className="field" value={d.note ?? ''} onChange={e => setD({ ...d, note: e.target.value })} placeholder="Why this zone — move away, freshness, trend…" /></Field></div>
      <div className="col-span-2 sm:col-span-3 flex gap-2">
        {onCancel && <button className="btn h-10 flex-1" onClick={onCancel}>Cancel</button>}
        <button className="btn-primary h-10 flex-[2]" disabled={!d.symbol?.trim()} onClick={() => onSave(d)}>{editing ? 'Save changes' : 'Add to watchlist'}</button>
      </div>
    </div>
  );
}

/** The process board: zones move left to right, never straight to "in a trade". */
export function ZoneBoard() {
  const all = useStore(s => s.zones).filter(z => !z.deleted);
  const zones = all.filter(z => z.stage !== 'done' && z.stage !== 'invalid');
  const closed = all.filter(z => z.stage === 'done' || z.stage === 'invalid');
  const save = useStore(s => s.saveZone), del = useStore(s => s.deleteZone);
  const toast = useToast();
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [showClosed, setShowClosed] = useState(false);
  const editing = all.find(z => z.id === editId);
  const clean = (d: Partial<WatchZone>) => ({ symbol: d.symbol!.trim().toUpperCase(), side: d.side ?? 'buy', tf: d.tf ?? '1D', role: d.role ?? 'htf', proximal: d.proximal ?? null, distal: d.distal ?? null, note: d.note?.trim() || undefined });
  const add = (d: Partial<WatchZone>) => {
    save({ id: `z_${Date.now().toString(36)}`, createdAt: Date.now(), updatedAt: Date.now(), stage: 'waiting', ...clean(d) });
    setAdding(false); toast('Zone added — set your alert just before it');
  };
  const update = (d: Partial<WatchZone>) => { if (!editing) return; save({ ...editing, ...clean(d), stage: d.stage ?? editing.stage }); setEditId(null); toast('Zone updated'); };
  const remove = (id: string) => { del(id); if (editId === id) setEditId(null); toast('Zone removed'); };
  return (
    <Card>
      <CardHead title="Zone watchlist" sub="Map zones before the session. Move them only when price earns it." right={<button className="btn h-9" onClick={() => { setAdding(v => !v); setEditId(null); }}><Icon name={adding ? 'x' : 'plus'} size={14} />{adding ? 'Cancel' : 'Add zone'}</button>} />
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
            <div className="pb-4 mb-4 border-b border-line"><ZoneForm init={BLANK} onSave={add} /></div>
          </motion.div>
        )}
      </AnimatePresence>
      <Sheet open={!!editing} onClose={() => setEditId(null)} title={editing ? `Edit ${editing.symbol} zone` : ''}>
        {editing && (
          <div className="flex flex-col gap-4">
            <ZoneForm key={editing.id} init={editing} editing onSave={update} onCancel={() => setEditId(null)} />
            <button className="btn-ghost h-10 text-loss" onClick={() => remove(editing.id)}><Icon name="trash" size={14} />Delete zone</button>
          </div>
        )}
      </Sheet>
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
                        <span className="text-[11px] text-ink3 truncate">{z.tf} {z.role.toUpperCase()} {z.side === 'buy' ? 'demand' : 'supply'}</span>
                        <button className="ml-auto btn-ghost h-8 w-8 touch:h-9 touch:w-9 px-0 text-ink3 shrink-0" aria-label="Edit zone" onClick={() => { setEditId(z.id); setAdding(false); }}><Icon name="edit" size={13} /></button>
                      </div>
                      {(z.proximal != null || z.distal != null) && <div className="text-[11.5px] num text-ink2 mt-1">{z.proximal ?? '—'} / {z.distal ?? '—'}</div>}
                      {z.note && <div className="text-[11.5px] text-ink3 mt-1 line-clamp-2">{z.note}</div>}
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
      {closed.length > 0 && (
        <div className="mt-4 pt-3 border-t border-line">
          <button className="flex items-center gap-1.5 text-[12.5px] text-ink3 hover:text-ink2" onClick={() => setShowClosed(v => !v)}>
            <motion.span initial={false} animate={{ transform: `rotate(${showClosed ? 90 : 0}deg)` }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="inline-flex"><Icon name="chevronRight" size={13} /></motion.span>Planned & invalid ({closed.length})
          </button>
          <AnimatePresence initial={false}>
            {showClosed && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }} className="overflow-hidden">
                <div className="flex flex-col mt-2">
                  {closed.map(z => (
                    <div key={z.id} className="flex items-center gap-2 py-2 border-t border-line first:border-0">
                      <span className={cx('w-1.5 h-5 rounded-full', z.side === 'buy' ? 'bg-profit' : 'bg-loss')} />
                      <span className="font-mono font-semibold text-[12.5px]">{z.symbol}</span>
                      <span className="text-[11px] text-ink3 truncate">{z.tf} {z.role.toUpperCase()} · {z.stage === 'done' ? 'Planned' : 'Invalid'}</span>
                      <button className="ml-auto btn-ghost h-8 text-xs" onClick={() => { save({ ...z, stage: 'waiting' }); toast('Back on the watchlist'); }}>Restore</button>
                      <button className="btn-ghost h-8 w-8 px-0 text-ink3" aria-label="Edit zone" onClick={() => setEditId(z.id)}><Icon name="edit" size={13} /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
}
