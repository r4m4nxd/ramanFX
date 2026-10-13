import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEnriched } from '@/data/derived';
import { useStore } from '@/data/store';
import { compressImage, uploadImage } from '@/data/cloud';
import { measuredUnitValues, pipsBetween, specFor, unitValue } from '@/core/instruments';
import { alignmentPlays, TIMEFRAME_COMBOS } from '@/core/playbook';
import { fmtHold } from '@/core/time';
import type { Attachment, TradeNote, Trend } from '@/core/types';
import { longDate, num, price, rMult, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Card, CardHead, cx, Empty, Field, Page, useToast } from '@/ui/kit';
import { TagInput } from '@/ui/TagInput';
import { Icon } from '@/ui/Icon';

const EMOTIONS = ['calm', 'focused', 'confident', 'anxious', 'fomo', 'greedy', 'revenge', 'tired', 'bored'];
const TRENDS: [Trend, string, string][] = [['up', '↑', 'Uptrend'], ['down', '↓', 'Downtrend'], ['side', '✖', 'Sideways']];

export default function TradeDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const all = useEnriched();
  const rawTrades = useStore(s => s.trades);
  const notes = useStore(s => s.notes);
  const saveNote = useStore(s => s.saveNote);
  const overrides = useStore(s => s.overrides);
  const exitData = useStore(s => s.exitData);
  const attachments = useStore(s => s.attachments);
  const saveAttachments = useStore(s => s.saveAttachments);
  const strategies = useStore(s => s.strategies);
  const user = useStore(s => s.user);
  const fmt = useMoney();
  const toast = useToast();

  const idx = all.findIndex(t => t.id === id);
  const t = all[idx];
  const [draft, setDraft] = useState<TradeNote>(() => notes[id ?? ''] ?? {});
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lightbox, setLightbox] = useState<Attachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const dirty = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(notes[id ?? ''] ?? {}); dirty.current = false; setSaved('idle'); /* eslint-disable-next-line */ }, [id]);
  // Autosave 600ms after the last user edit (never on open, so viewing doesn't bump timestamps).
  useEffect(() => {
    if (!dirty.current || !id) return;
    setSaved('saving');
    const h = setTimeout(() => { saveNote(id, draft); setSaved('saved'); }, 600);
    return () => clearTimeout(h);
  }, [draft, id, saveNote]);

  const universe = useMemo(() => {
    const tags = new Set<string>(), mistakes = new Set<string>();
    for (const n of Object.values(notes)) { n.tags?.forEach(x => tags.add(x.toLowerCase())); n.mistakes?.forEach(x => mistakes.add(x.toLowerCase())); }
    return { tags: [...tags].sort(), mistakes: [...mistakes].sort() };
  }, [notes]);

  const spec = useMemo(() => (t ? specFor(t.sym, overrides[t.sym]) : null), [t, overrides]);
  const uv = useMemo(() => (spec ? unitValue(spec, measuredUnitValues(rawTrades)) : null), [spec, rawTrades]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.key === 'ArrowLeft' && all[idx - 1]) nav(`/trades/${all[idx - 1].id}`);
      if (e.key === 'ArrowRight' && all[idx + 1]) nav(`/trades/${all[idx + 1].id}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [all, idx, nav]);

  // Paste a screenshot straight from the clipboard.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []).filter(f => f.type.startsWith('image/'));
      if (files.length) { e.preventDefault(); void addFiles(files); }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  });

  if (!t || !spec || !uv) return <Empty icon="search" title="Trade not found" action={<Link className="btn" to="/trades">Back to trades</Link>}>It may belong to another account, or the date filter hides it.</Empty>;

  const set = (patch: Partial<TradeNote>) => { dirty.current = true; setDraft(d => ({ ...d, ...patch })); };
  const dir = t.type === 'buy' ? 1 : -1;
  const sl = parseFloat(String(t.sl)), tp = parseFloat(String(t.tp));
  const movePips = ((t.closePrice - t.openPrice) * dir) / spec.pipSize;
  const stopPips = sl > 0 ? pipsBetween(t.openPrice, sl, spec) : null;
  const tpPips = tp > 0 ? pipsBetween(t.openPrice, tp, spec) : null;
  const plannedRR = stopPips && tpPips ? tpPips / stopPips : null;
  const ex = exitData[t.id];
  const atts = attachments[t.id] ?? [];
  const combo = TIMEFRAME_COMBOS[draft.align?.combo ?? 3];
  const plays = draft.align ? alignmentPlays(draft.align, combo) : null;
  const want = t.type === 'buy' ? 'long' : 'short';
  const matched = plays?.find(p => p.dir === want);

  async function addFiles(files: File[]) {
    setUploading(true);
    const added: Attachment[] = [];
    for (const f of files) {
      const attId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const blob = await compressImage(f);
      let storageUrl: string | null = null;
      if (user) storageUrl = await uploadImage(user.id, `${t.account}_${t.id}`, attId, blob);
      const base = { id: attId, name: f.name || 'screenshot.jpg', type: 'image/jpeg', size: blob.size, addedAt: Date.now() };
      if (storageUrl) added.push({ ...base, storageUrl });
      else added.push({ ...base, dataUrl: await new Promise<string>(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result)); fr.readAsDataURL(blob); }) });
    }
    saveAttachments(t.id, [...atts, ...added]);
    setUploading(false);
    toast(`${added.length} screenshot${added.length > 1 ? 's' : ''} added`);
  }

  const pipLabel = spec.assetClass === 'forex' || spec.assetClass === 'metal' ? 'pips' : 'pts';

  return (
    <Page>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button className="btn-ghost -ml-2 text-accent" onClick={() => nav(-1)}><Icon name="chevronLeft" size={15} />Back</button>
        <div className="flex items-center gap-2">
          <span className={cx('text-xs transition-opacity', saved === 'idle' ? 'opacity-0' : 'text-ink3')}>{saved === 'saving' ? 'Saving…' : 'Saved'}</span>
          <button className="btn" disabled={!all[idx - 1]} onClick={() => nav(`/trades/${all[idx - 1].id}`)} aria-label="Previous trade"><Icon name="chevronLeft" size={14} />Prev</button>
          <button className="btn" disabled={!all[idx + 1]} onClick={() => nav(`/trades/${all[idx + 1].id}`)} aria-label="Next trade">Next<Icon name="chevronRight" size={14} /></button>
        </div>
      </div>

      <Card className="flex flex-wrap items-center gap-6 justify-between">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-mono text-2xl font-semibold">{t.sym}</h2>
            <Badge tone={t.type === 'buy' ? 'accent' : 'warn'}>{t.type === 'buy' ? 'LONG' : 'SHORT'}</Badge>
            {matched && <Badge tone="profit">FOLLOWED PLAN</Badge>}
            {plays && !matched && <Badge tone="loss">AGAINST MATRIX</Badge>}
            {!!draft.mistakes?.length && <Badge tone="warn">{draft.mistakes.length} MISTAKE{draft.mistakes.length > 1 ? 'S' : ''}</Badge>}
          </div>
          <p className="text-[13px] text-ink3 mt-1.5">{longDate(t.open)} · {timeHM(t.open)} → {timeHM(t.close)} · held {fmtHold(t.holdSec)} · {spec.name} · #{t.id}</p>
        </div>
        <div className="flex gap-8 flex-wrap">
          <div><div className="label">Net P&L</div><div className={cx('num text-2xl font-semibold mt-1', tone(t.net))}>{fmt(t.net, { signed: true })}</div></div>
          <div><div className="label">R multiple</div><div className={cx('num text-2xl font-semibold mt-1', tone(t.r))}>{rMult(t.r, 2)}</div></div>
          <div><div className="label">Moved</div><div className={cx('num text-2xl font-semibold mt-1', tone(movePips))}>{movePips > 0 ? '+' : ''}{num(movePips, 1)} <span className="text-sm text-ink3">{pipLabel}</span></div></div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <div className="xl:col-span-2 flex flex-col gap-4 min-w-0">
          <Card aria-label="Screenshots">
            <CardHead title="Chart screenshots" sub="Paste (Ctrl/⌘+V), drop or upload — one per timeframe works best" right={<button className="btn" onClick={() => fileRef.current?.click()} disabled={uploading}><Icon name="image" size={14} />{uploading ? 'Uploading…' : 'Add'}</button>} />
            <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => { if (e.target.files) void addFiles(Array.from(e.target.files)); e.target.value = ''; }} />
            {atts.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {atts.map(a => (
                  <motion.div key={a.id} layout className="group relative aspect-video rounded-xl overflow-hidden border border-line bg-raised">
                    <button className="absolute inset-0" onClick={() => setLightbox(a)} aria-label={`Open ${a.name}`}><img src={a.storageUrl ?? a.dataUrl} alt={a.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /></button>
                    <button className="absolute top-1.5 right-1.5 w-8 h-8 rounded-lg bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="Remove screenshot" onClick={() => saveAttachments(t.id, atts.filter(x => x.id !== a.id))}><Icon name="trash" size={14} /></button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <button className="w-full h-44 rounded-xl border-2 border-dashed border-line2 hover:border-ink3 grid place-items-center text-sm text-ink3" onClick={() => fileRef.current?.click()}
                onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); void addFiles(Array.from(e.dataTransfer.files)); }}>
                <span className="flex flex-col items-center gap-2"><Icon name="image" size={22} />Drop or paste your chart</span>
              </button>
            )}
          </Card>

          <Card aria-label="Journal">
            <CardHead title="Journal" sub="Why you took it, how you managed it, what you'd repeat" />
            <label className="sr-only" htmlFor="tnote">Trade notes</label>
            <textarea id="tnote" rows={7} value={draft.note ?? ''} onChange={e => set({ note: e.target.value })} placeholder="Setup, confirmation, management, lesson…" className="w-full p-3.5 text-[14px] leading-relaxed resize-y" />
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Setup tags"><TagInput label="Setup tags" value={draft.tags ?? []} onChange={v => set({ tags: v })} universe={universe.tags} placeholder="wow zone, fresh zone, pcp…" /></Field>
              <Field label="Mistakes"><TagInput label="Mistakes" tone="warn" value={draft.mistakes ?? []} onChange={v => set({ mistakes: v })} universe={universe.mistakes} placeholder="moved sl, early exit…" /></Field>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <Field label="Strategy">
                <select className="field" value={draft.strategyId ?? ''} onChange={e => set({ strategyId: e.target.value || null })}>
                  <option value="">None</option>{strategies.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </Field>
              <Field label="Execution grade">
                <div className="flex gap-1.5">
                  {(['A', 'B', 'C', 'D'] as const).map(g => (
                    <button key={g} type="button" aria-pressed={draft.grade === g} onClick={() => set({ grade: draft.grade === g ? null : g })}
                      className={cx('h-9 flex-1 rounded-lg border text-sm font-bold transition-colors', draft.grade === g ? (g === 'A' ? 'bg-profit text-[#0A0C0F] border-profit' : g === 'B' ? 'bg-accent text-[#0A0C0F] border-accent' : g === 'C' ? 'bg-warn text-[#0A0C0F] border-warn' : 'bg-loss text-white border-loss') : 'border-line2 text-ink2 hover:bg-raised')}>{g}</button>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-ink2 mb-1.5">State of mind</div>
              <div className="flex flex-wrap gap-1.5">
                {EMOTIONS.map(e => (
                  <button key={e} type="button" aria-pressed={draft.emotion === e} onClick={() => set({ emotion: draft.emotion === e ? null : e })}
                    className={cx('chip capitalize', draft.emotion === e && 'bg-ink text-bg border-ink')}>{e}</button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4 min-w-0">
          <Card aria-label="Playbook alignment">
            <CardHead title="Playbook alignment" sub="Your trend read at entry, checked against the matrix" />
            <select aria-label="Timeframe combination" className="field mb-3" value={draft.align?.combo ?? 3} onChange={e => set({ align: { ...(draft.align ?? {}), combo: +e.target.value } })}>
              {TIMEFRAME_COMBOS.map((c, i) => <option key={i} value={i}>ETF {c.etf} · ITF {c.itf} · HTF {c.htf}</option>)}
            </select>
            <div className="grid grid-cols-3 gap-2">
              {(['htf', 'itf', 'etf'] as const).map(k => (
                <div key={k} className="rounded-lg bg-raised p-2 text-center">
                  <div className="label">{k.toUpperCase()} · {combo[k]}</div>
                  <div className="flex gap-1 mt-2">
                    {TRENDS.map(([v, sym, title]) => {
                      const on = draft.align?.[k] === v;
                      return <button key={v} type="button" title={title} aria-label={`${k.toUpperCase()} ${title}`} aria-pressed={on}
                        onClick={() => set({ align: { combo: draft.align?.combo ?? 3, ...(draft.align ?? {}), [k]: on ? null : v } })}
                        className={cx('flex-1 h-8 rounded-md border text-sm font-bold', on ? (v === 'up' ? 'border-profit text-profit bg-profit/10' : v === 'down' ? 'border-loss text-loss bg-loss/10' : 'border-ink2 text-ink bg-surface') : 'border-line2 text-ink3')}>{sym}</button>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={JSON.stringify(plays)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-3">
                {plays === null ? <p className="text-xs text-ink3">Mark all three trends to check this trade against your matrix.</p>
                  : plays.length === 0 ? <div className="p-3 rounded-lg border border-loss/40 text-[13px]"><b className="text-loss">No-trade combination.</b> <span className="text-ink2">The matrix had no play here.</span></div>
                  : plays.map(p => (
                    <div key={p.dir + p.row} className={cx('p-3 rounded-lg border text-[13px] mb-2 leading-relaxed', p.dir === want ? 'border-profit/45' : 'border-line2 opacity-70')}>
                      <div className={cx('font-semibold', p.dir === 'long' ? 'text-profit' : 'text-loss')}>{p.dir === 'long' ? '↑ Long' : '↓ Short'} · {p.halfRisk ? 'half risk' : 'full risk'}{p.dir === want && ' · you took this'}</div>
                      <div className="text-ink2">{p.text}</div>
                    </div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </Card>

          <Card aria-label="Execution">
            <CardHead title="Execution" />
            <dl className="text-[13px]">
              {[
                ['Entry', price(t.openPrice, spec.digits)],
                ['Exit', price(t.closePrice, spec.digits)],
                ['Stop loss', sl > 0 ? <>{price(sl, spec.digits)} <span className="text-ink3">({num(stopPips, 1)} {pipLabel})</span></> : <span className="text-ink3">none</span>],
                ['Take profit', tp > 0 ? <>{price(tp, spec.digits)} <span className="text-ink3">({num(tpPips, 1)} {pipLabel})</span></> : <span className="text-ink3">none</span>],
                ['Planned R:R', plannedRR ? `1 : ${plannedRR.toFixed(2)}` : '—'],
                ['Size', `${t.volume} lots`],
                ['Pip value', `${fmt(uv.value * spec.pipSize * t.volume)} / ${pipLabel.slice(0, -1)}`],
                ['Initial risk', t.risk ? fmt(t.risk) : '—'],
                ['Gross · commission · swap', `${fmt(t.profit)} · ${fmt(t.commission)} · ${fmt(t.swap)}`],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between gap-3 py-2 border-t border-line first:border-0"><dt className="text-ink2">{k}</dt><dd className="num text-right">{v}</dd></div>
              ))}
            </dl>
            <Field label="Initial risk override" hint={t.riskSource === 'stop' ? 'Taken from the stop in the report. Override if you moved it before exit.' : 'No usable stop in the report (none, or moved past entry). Enter what you risked to get R.'}>
              <input type="number" step="0.01" min="0" className="field num" value={draft.riskOverride ?? ''} placeholder={t.risk ? t.risk.toFixed(2) : 'e.g. 100'} onChange={e => set({ riskOverride: e.target.value ? +e.target.value : null })} />
            </Field>
            <p className="text-[11px] text-ink3 mt-2">Value per pip {uv.source === 'measured' ? 'measured from your fills' : 'from contract spec'} · 1 {pipLabel.slice(0, -1)} = {spec.pipSize} price</p>
          </Card>

          {ex && (
            <Card aria-label="Excursion">
              <CardHead title="How the trade moved" sub="Max adverse vs max favourable excursion (points)" />
              {(() => {
                const mae = Math.abs(ex.mae ?? 0), mfe = Math.max(0, ex.mfe ?? 0), got = ex.profitPts ?? 0;
                const span = mae + mfe || 1;
                return (<>
                  <div className="relative h-8 rounded-lg bg-raised overflow-hidden">
                    <motion.div className="absolute inset-y-1.5 bg-loss/60 rounded-l" style={{ right: `${(mfe / span) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(mae / span) * 100}%` }} />
                    <motion.div className="absolute inset-y-1.5 bg-profit/40 rounded-r" style={{ left: `${(mae / span) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(mfe / span) * 100}%` }} />
                    <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${((mae + got) / span) * 100}%` }} title="Exit" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs num">
                    <div><div className="label">MAE</div><div className="text-loss mt-1">{num(ex.mae, 0)}</div></div>
                    <div><div className="label">MFE</div><div className="text-profit mt-1">{num(ex.mfe, 0)}</div></div>
                    <div><div className="label">Captured</div><div className="mt-1">{mfe > 0 ? `${Math.round((Math.max(0, got) / mfe) * 100)}%` : '—'}</div></div>
                  </div>
                </>);
              })()}
            </Card>
          )}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-[80] bg-black/85 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)} role="dialog" aria-label="Screenshot">
            <motion.img src={lightbox.storageUrl ?? lightbox.dataUrl} alt={lightbox.name} className="max-w-full max-h-full rounded-xl" initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.94 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}
