import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useFiltered } from '@/data/derived';
import { useStore } from '@/data/store';
import { computeStats, type EnrichedTrade } from '@/core/stats';
import { dayKey } from '@/core/time';
import { pct, rMult, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Card, cx, Empty, Page, useIsMobile } from '@/ui/kit';
import { TradeList } from '@/ui/TradeList';
import { Icon } from '@/ui/Icon';

function DayNote({ day }: { day: string }) {
  const dayNotes = useStore(s => s.dayNotes);
  const save = useStore(s => s.saveDayNote);
  const [text, setText] = useState(dayNotes[day] ?? '');
  const [dirty, setDirty] = useState(false);
  useEffect(() => { setText(dayNotes[day] ?? ''); setDirty(false); /* eslint-disable-next-line */ }, [day]);
  useEffect(() => { if (!dirty) return; const h = setTimeout(() => { save(day, text); setDirty(false); }, 700); return () => clearTimeout(h); }, [text, dirty, day, save]);
  return (
    <div>
      <label htmlFor={`dn-${day}`} className="text-xs font-medium text-ink2 flex justify-between">Day review<span className="text-ink3 font-normal">{dirty ? 'Saving…' : text ? 'Saved' : ''}</span></label>
      <textarea id={`dn-${day}`} rows={3} value={text} onChange={e => { setText(e.target.value); setDirty(true); }} placeholder="What went well, what to fix tomorrow…" className="w-full mt-1.5 p-3 text-sm leading-relaxed resize-y" />
    </div>
  );
}

function DayCard({ day, trades, open, onToggle }: { day: string; trades: EnrichedTrade[]; open: boolean; onToggle: () => void }) {
  const fmt = useMoney();
  const notes = useStore(s => s.notes);
  const s = useMemo(() => computeStats(trades), [trades]);
  const mobile = useIsMobile();
  const d = new Date(day + 'T00:00');
  let cum = 0;
  const pts = trades.map(t => (cum += t.net));
  const min = Math.min(0, ...pts), max = Math.max(0, ...pts), span = max - min || 1;
  const path = [0, ...pts].map((v, i) => `${i ? 'L' : 'M'}${(i / Math.max(1, pts.length)) * 100} ${((max - v) / span) * 40}`).join(' ');
  return (
    <motion.article layout className="card overflow-hidden" id={`d-${day}`}>
      <button className="w-full flex items-center gap-3 md:gap-4 p-4 text-left hover:bg-raised/40 transition-colors" onClick={onToggle} aria-expanded={open}>
        <div className={cx('w-1 self-stretch rounded-full', s.net >= 0 ? 'bg-profit' : 'bg-loss')} />
        <div className="min-w-0">
          <div className="font-semibold">{d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>
          <div className="text-xs text-ink3 mt-0.5">{s.total} trades · {pct(s.winRate, 0)} win</div>
        </div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="hidden sm:block h-10 flex-1 max-w-[220px]" aria-hidden="true">
          <line x1="0" x2="100" y1={(max / span) * 40} y2={(max / span) * 40} stroke="rgb(var(--line2))" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
          <path d={path} fill="none" stroke={s.net >= 0 ? 'rgb(var(--profit))' : 'rgb(var(--loss))'} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="ml-auto flex items-center gap-5">
          <div className="hidden md:block text-right"><div className="label">PF</div><div className="num text-sm">{s.profitFactor?.toFixed(2) ?? '—'}</div></div>
          <div className="hidden md:block text-right"><div className="label">Volume</div><div className="num text-sm">{s.volume.toFixed(2)}</div></div>
          <div className="text-right"><div className="label">Net</div><div className={cx('num font-semibold', tone(s.net))}>{fmt(s.net, { signed: true })}</div></div>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-ink3"><Icon name="chevronDown" /></motion.span>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="px-4 pb-4 flex flex-col gap-4 border-t border-line pt-4">
              {mobile ? <TradeList trades={trades} time="range" /> : (
              <div>
                <table className="w-full">
                  <thead><tr><th className="th">Time</th><th className="th">Symbol</th><th className="th">Side</th><th className="th">Setup</th><th className="th text-right">R</th><th className="th text-right">Net</th></tr></thead>
                  <tbody>
                    {trades.map(t => (
                      <tr key={t.account + t.id} className="hover:bg-raised/50">
                        <td className="td num text-ink2">{timeHM(t.open)}–{timeHM(t.close)}</td>
                        <td className="td"><Link className="font-mono font-medium hover:text-accent inline-block py-2 -my-2" to={`/trades/${t.id}`}>{t.sym}</Link></td>
                        <td className="td"><Badge tone={t.type === 'buy' ? 'accent' : 'warn'}>{t.type === 'buy' ? 'LONG' : 'SHORT'}</Badge></td>
                        <td className="td text-ink2">{notes[t.id]?.tags?.join(', ') || <Link to={`/trades/${t.id}`} className="text-accent text-xs inline-block py-2 -my-2">Journal it</Link>}</td>
                        <td className={cx('td num text-right', tone(t.r))}>{rMult(t.r, 1)}</td>
                        <td className={cx('td num text-right font-semibold', tone(t.net))}>{fmt(t.net, { signed: true })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
              <DayNote day={day} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function Journal() {
  const et = useFiltered();
  const [params] = useSearchParams();
  const focus = params.get('day');
  const days = useMemo(() => {
    const m = new Map<string, EnrichedTrade[]>();
    for (const t of et) { const k = dayKey(t.close); m.set(k, [...(m.get(k) ?? []), t]); }
    return [...m.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  }, [et]);
  const [open, setOpen] = useState<Set<string>>(() => new Set(focus ? [focus] : days[0] ? [days[0][0]] : []));
  const [limit, setLimit] = useState(20);
  useEffect(() => {
    if (!focus) return;
    setOpen(s => new Set(s).add(focus));
    const i = days.findIndex(d => d[0] === focus);
    if (i >= limit) setLimit(i + 5);
    setTimeout(() => document.getElementById(`d-${focus}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);
  if (!days.length) return <Card><Empty icon="journal" title="No trading days in this range" /></Card>;
  return (
    <Page>
      {days.slice(0, limit).map(([day, ts]) => (
        <DayCard key={day} day={day} trades={ts} open={open.has(day)} onToggle={() => setOpen(s => { const n = new Set(s); if (n.has(day)) n.delete(day); else n.add(day); return n; })} />
      ))}
      {days.length > limit && <button className="btn self-center" onClick={() => setLimit(l => l + 20)}>Load older days</button>}
    </Page>
  );
}
