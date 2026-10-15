import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEnriched } from '@/data/derived';
import { useStore } from '@/data/store';
import { compressImage, uploadImage } from '@/data/cloud';
import { measuredUnitValues, pipsBetween, specFor, unitValue } from '@/core/instruments';
import { alignmentPlays, TIMEFRAME_COMBOS } from '@/core/playbook';
import { fmtHold } from '@/core/time';
import { normTag } from '@/core/stats';
import type { Attachment, TradeNote, Trend } from '@/core/types';
import { longDate, num, price, rMult, timeHM, tone, useMoney } from '@/lib/format';
import { Badge, Card, CardHead, cx, Empty, Field, Page, useIsMobile, useToast } from '@/ui/kit';
import { TRADE_ORDER_KEY } from '@/ui/TradeList';
import { TagInput } from '@/ui/TagInput';
import { Icon } from '@/ui/Icon';
import { Lightbox } from '@/ui/Lightbox';
import { VerdictCard } from '@/ui/VerdictCard';
import { TradeChart } from '@/ui/TradeChart';
import { useGradedTrade } from '@/data/guru';
import { exitOutcome, ORDER_LABEL, ptsToR, REASON_LABEL } from '@/core/exitInsights';

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
  const graded = useGradedTrade(id);

  const loc = useLocation();
  const mobile = useIsMobile();
  const t = all.find(x => x.id === id);
  // Prev/Next walk the trades list as it was filtered and sorted; elsewhere, newest first.
  const order = useMemo(() => {
    if ((loc.state as { list?: string } | null)?.list === 'trades') {
      try { const ids = JSON.parse(sessionStorage.getItem(TRADE_ORDER_KEY) ?? 'null') as string[] | null; if (ids?.includes(id ?? '')) return { ids, filtered: true }; } catch { /* fall through */ }
    }
    return { ids: [...all].sort((a, b) => b.close.getTime() - a.close.getTime()).map(x => x.id), filtered: false };
  }, [all, id, loc.state]);
  const pos = order.ids.indexOf(id ?? '');
  const prevId = pos > 0 ? order.ids[pos - 1] : undefined;
  const nextId = pos >= 0 ? order.ids[pos + 1] : undefined;
  const go = (to?: string) => { if (to) nav(`/trades/${to}`, { replace: true, state: loc.state }); };
  const [draft, setDraft] = useState<TradeNote>(() => notes[id ?? ''] ?? {});
  const [saved, setSaved] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const dirty = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const riskRef = useRef<HTMLInputElement>(null);
  const [riskOpen, setRiskOpen] = useState(false);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  useEffect(() => {
    setDraft(notes[id ?? ''] ?? {}); dirty.current = false; setSaved('idle'); setConfirmDel(null);
    // Flush a pending edit when leaving this trade (Prev/Next, Back, closing the tab) instead of dropping it.
    const flush = () => { if (dirty.current && id) { saveNote(id, draftRef.current); dirty.current = false; } };
    window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('pagehide', flush); flush(); };
    /* eslint-disable-next-line */
  }, [id]);
  // Autosave 600ms after the last user edit (never on open, so viewing doesn't bump timestamps).
  useEffect(() => {
    if (!dirty.current || !id) return;
    setSaved('saving');
    const h = setTimeout(() => { saveNote(id, draft); dirty.current = false; setSaved('saved'); }, 600);
    return () => clearTimeout(h);
  }, [draft, id, saveNote]);

  const universe = useMemo(() => {
    const tags = new Set<string>(), mistakes = new Set<string>();
    for (const n of Object.values(notes)) { n.tags?.forEach(x => tags.add(normTag(x))); n.mistakes?.forEach(x => mistakes.add(normTag(x))); }
    return { tags: [...tags].sort(), mistakes: [...mistakes].sort() };
  }, [notes]);

  const spec = useMemo(() => (t ? specFor(t.sym, overrides[t.sym]) : null), [t, overrides]);
  const uv = useMemo(() => (spec ? unitValue(spec, measuredUnitValues(rawTrades)) : null), [spec, rawTrades]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input,textarea,select')) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'ArrowLeft') go(prevId);
      if (e.key === 'ArrowRight') go(nextId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

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

  async function addFiles(picked: File[]) {
    const files = picked.filter(f => f.type.startsWith('image/'));
    if (!files.length) { toast('Only image files can be added', 'error'); return; }
    setUploading(true);
    const added: Attachment[] = [];
    try {
    for (const f of files) {
      const attId = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const blob = await compressImage(f);
      let storageUrl: string | null = null;
      if (user) storageUrl = await uploadImage(user.id, `${t!.account}_${t!.id}`, attId, blob);
      const base = { id: attId, name: f.name || 'screenshot.jpg', type: 'image/jpeg', size: blob.size, addedAt: Date.now() };
      if (storageUrl) added.push({ ...base, storageUrl });
      else added.push({ ...base, dataUrl: await new Promise<string>(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result)); fr.readAsDataURL(blob); }) });
    }
    } catch {
      toast(added.length ? `Only ${added.length} of ${files.length} screenshots were added` : 'Could not add the screenshot. Try again.', 'error');
    } finally {
      if (added.length) saveAttachments(t!.id, [...atts, ...added]);
      setUploading(false);
    }
    if (added.length === files.length) toast(`${added.length} screenshot${added.length > 1 ? 's' : ''} added`);
  }
  const drop = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setDragOver(true); },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setDragOver(false); void addFiles(Array.from(e.dataTransfer.files)); },
  };
  const removeAtt = (attId: string) => {
    if (confirmDel !== attId) { setConfirmDel(attId); return; }
    saveAttachments(t.id, atts.filter(x => x.id !== attId)); setConfirmDel(null); toast('Screenshot removed');
  };
  const editRisk = () => { setRiskOpen(true); requestAnimationFrame(() => { riskRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); riskRef.current?.focus(); }); };

  const journal = (
    <Card aria-label="Journal">
      <CardHead title="Journal" sub="Why you took it, how you managed it, what you'd repeat" right={<span className={cx('text-xs transition-opacity', saved === 'idle' ? 'opacity-0' : 'text-ink3')} aria-live="polite">{saved === 'saving' ? 'Saving…' : 'Saved'}</span>} />
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
                className={cx('h-9 flex-1 rounded-full border text-sm font-bold transition-colors', draft.grade === g ? (g === 'A' ? 'bg-profit text-on-status border-profit' : g === 'B' ? 'bg-accent text-on-accent border-accent' : g === 'C' ? 'bg-warn text-on-status border-warn' : 'bg-loss text-white border-loss') : 'border-line2 text-ink2 hover:bg-raised')}>{g}</button>
            ))}
          </div>
        </Field>
      </div>
      <div className="mt-4">
        <div className="text-xs font-medium text-ink2 mb-1.5">Rating</div>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map(n => (
            <button key={n} type="button" role="radio" aria-checked={draft.rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => set({ rating: draft.rating === n ? 0 : n })}
              className={cx('w-9 h-9 grid place-items-center rounded-lg transition-colors', (draft.rating ?? 0) >= n ? 'text-warn' : 'text-ink3 hover:text-ink2')}>
              <Icon name="star" size={18} fill={(draft.rating ?? 0) >= n ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
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
  );

  const pipLabel = spec.assetClass === 'forex' || spec.assetClass === 'metal' ? 'pips' : 'pts';

  return (
    <Page>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <button className="btn-ghost -ml-2 text-accent" onClick={() => nav(-1)}><Icon name="chevronLeft" size={15} />Back</button>
        <div className="flex items-center gap-2">
          <span className={cx('text-xs transition-opacity', saved === 'idle' ? 'opacity-0' : 'text-ink3')}>{saved === 'saving' ? 'Saving…' : 'Saved'}</span>
          {pos >= 0 && <span className="text-xs text-ink3 num hidden sm:inline" title={order.filtered ? 'Position in your filtered trades list' : 'Position among all trades, newest first'}>{pos + 1} / {order.ids.length}</span>}
          <button className="btn" disabled={!prevId} onClick={() => go(prevId)} aria-label="Previous trade" title="Previous trade (←)"><Icon name="chevronLeft" size={14} />Prev</button>
          <button className="btn" disabled={!nextId} onClick={() => go(nextId)} aria-label="Next trade" title="Next trade (→)">Next<Icon name="chevronRight" size={14} /></button>
        </div>
      </div>

      <Card className="flex flex-wrap items-center gap-6 justify-between">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="font-mono text-2xl font-semibold">{t.sym}</h2>
            <Badge tone={t.type === 'buy' ? 'accent' : 'warn'}>{t.type === 'buy' ? 'LONG' : 'SHORT'}</Badge>
            {matched && <Badge tone="profit">MATCHES MATRIX</Badge>}
            {plays && !matched && <Badge tone="loss">AGAINST MATRIX</Badge>}
            {!!draft.mistakes?.length && <Badge tone="warn">{draft.mistakes.length} MISTAKE{draft.mistakes.length > 1 ? 'S' : ''}</Badge>}
          </div>
          <p className="text-[13px] text-ink3 mt-1.5 num">{longDate(t.open)} · {timeHM(t.open)} → {timeHM(t.close)} · <span className="whitespace-nowrap">held {fmtHold(t.holdSec)}</span></p>
          <p className="text-[12px] text-ink3 mt-0.5"><span className="whitespace-nowrap">{spec.name}</span> · <span className="num whitespace-nowrap">{t.volume} lots</span> · <span className="num whitespace-nowrap">#{t.id}</span></p>
        </div>
        <div className="grid grid-cols-2 sm:flex gap-x-8 gap-y-4 w-full sm:w-auto">
          <div><div className="label">Net P&L</div><div className={cx('num text-2xl font-semibold mt-1', tone(t.net))}>{fmt(t.net, { signed: true })}</div></div>
          <div>
            <div className="label">R multiple</div>
            {t.r != null ? <div className={cx('num text-2xl font-semibold mt-1', tone(t.r))}>{rMult(t.r, 2)}</div>
              : <button type="button" className="mt-1 h-8 text-sm font-medium text-accent hover:underline" onClick={editRisk}>Set risk to get R</button>}
          </div>
          <div><div className="label">Risk</div><div className="num text-lg font-semibold mt-1.5 text-ink2">{t.risk ? fmt(t.risk) : '—'}</div></div>
          <div><div className="label">Price move</div><div className={cx('num text-lg font-semibold mt-1.5', tone(movePips))}>{movePips > 0 ? '+' : ''}{num(movePips, 1)} <span className="text-xs text-ink3">{pipLabel}</span></div></div>
        </div>
      </Card>

      {mobile && journal}

      {graded && <VerdictCard g={graded} />}

      <TradeChart t={t} levels={{ initSl: ex?.initSl, sl: t.sl, tp: t.tp, proximal: graded?.plan?.proximal, distal: graded?.plan?.distal }} drawings={draft.drawings} onDrawings={d => set({ drawings: d })} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
        <div className="xl:col-span-2 flex flex-col gap-4 min-w-0">
          <Card aria-label="Screenshots" className={cx(dragOver && 'ring-2 ring-accent/50')}>
            <div {...drop}>
            <CardHead title="Chart screenshots" sub="Paste (Ctrl/⌘+V), drop or upload — one per timeframe works best" right={<button className="btn" onClick={() => fileRef.current?.click()} disabled={uploading}><Icon name="image" size={14} />{uploading ? 'Uploading…' : 'Add'}</button>} />
            <input ref={fileRef} type="file" accept="image/*" multiple className="sr-only" onChange={e => { if (e.target.files) void addFiles(Array.from(e.target.files)); e.target.value = ''; }} />
            {atts.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {atts.map((a, ai) => (
                  <motion.div key={a.id} layout className="group relative aspect-video rounded-xl overflow-hidden border border-line bg-raised">
                    <button className="absolute inset-0" onClick={() => setLightbox(ai)} aria-label={`Open ${a.name}`}><img src={a.storageUrl ?? a.dataUrl} alt={a.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" /></button>
                    <button className={cx('absolute top-1.5 right-1.5 h-8 rounded-lg text-white grid place-items-center transition-opacity', confirmDel === a.id ? 'px-2.5 bg-loss text-xs font-semibold opacity-100' : 'w-8 bg-black/60 opacity-0 touch:opacity-100 group-hover:opacity-100 focus:opacity-100')} aria-label={confirmDel === a.id ? `Confirm remove ${a.name}` : `Remove ${a.name}`} onClick={() => removeAtt(a.id)} onBlur={() => setConfirmDel(c => (c === a.id ? null : c))}>{confirmDel === a.id ? 'Remove?' : <Icon name="trash" size={14} />}</button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <button className={cx('w-full h-28 md:h-36 rounded-xl border-2 border-dashed hover:border-ink3 grid place-items-center text-sm text-ink3', dragOver ? 'border-accent' : 'border-line2')} onClick={() => fileRef.current?.click()} disabled={uploading}>
                <span className="flex flex-col items-center gap-2"><Icon name="image" size={22} />{uploading ? 'Uploading…' : mobile ? 'Tap to add your chart' : 'Drop or paste your chart'}</span>
              </button>
            )}
            </div>
          </Card>

          {!mobile && journal}
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
                        className={cx('flex-1 h-8 touch:h-10 rounded-md border text-sm font-bold', on ? (v === 'up' ? 'border-profit text-profit bg-profit/10' : v === 'down' ? 'border-loss text-loss bg-loss/10' : 'border-ink2 text-ink bg-surface') : 'border-line2 text-ink3')}>{sym}</button>;
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
                ['Gross', fmt(t.profit)],
                ['Commission', fmt(t.commission)],
                ['Swap', fmt(t.swap)],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between gap-3 py-2 border-t border-line first:border-0"><dt className="text-ink2">{k}</dt><dd className="num text-right">{v}</dd></div>
              ))}
            </dl>
            <details className="mt-2 border-t border-line pt-2 group" open={riskOpen || draft.riskOverride != null || t.risk == null} onToggle={e => setRiskOpen((e.target as HTMLDetailsElement).open)}>
              <summary className="cursor-pointer list-none flex items-center justify-between gap-2 py-1.5 text-[13px] text-ink2 hover:text-ink">
                <span>Override initial risk{draft.riskOverride != null && <span className="text-ink3"> · set</span>}</span>
                <Icon name="chevronDown" size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pt-2">
                <Field label="Initial risk" hint={t.riskSource === 'initial' ? 'Exact: from the stop you opened with.' : t.riskSource === 'stop' ? 'Estimated from the final stop. Enter what you risked for an exact R.' : 'No usable stop on this trade. Enter what you risked to get R.'}>
                  <input ref={riskRef} type="number" step="0.01" min="0" inputMode="decimal" className="field num" value={draft.riskOverride ?? ''} placeholder={t.risk ? t.risk.toFixed(2) : 'e.g. 100'} onChange={e => set({ riskOverride: e.target.value ? +e.target.value : null })} />
                </Field>
              </div>
            </details>
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
                    <motion.div className="absolute inset-y-2.5 bg-loss/35 rounded-l" style={{ right: `${(mfe / span) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(mae / span) * 100}%` }} />
                    <motion.div className="absolute inset-y-2.5 bg-profit/35 rounded-r" style={{ left: `${(mae / span) * 100}%` }} initial={{ width: 0 }} animate={{ width: `${(mfe / span) * 100}%` }} />
                    <div className="absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${((mae + got) / span) * 100}%` }} title="Exit" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 num">
                    <div><div className="label">MAE</div><div className="text-loss mt-1 text-base font-semibold">{num(ex.mae, 0)}</div></div>
                    <div><div className="label">MFE</div><div className="text-profit mt-1 text-base font-semibold">{num(ex.mfe, 0)}</div></div>
                    <div><div className="label">Captured</div><div className="mt-1 text-base font-semibold">{mfe > 0 ? `${Math.round((Math.max(0, got) / mfe) * 100)}%` : '—'}</div></div>
                  </div>
                  {ex.exitReason != null && (() => {
                    const xt = { net: t.net, r: t.r, risk: t.risk, side: t.type, openPrice: t.openPrice, sl: t.sl, tp: t.tp, e: ex };
                    const o = exitOutcome(xt);
                    const heat = ptsToR(xt, ex.maeBeforeMfe);
                    const T = ex.touch;
                    const lv: [string, number | null | undefined][] = T ? [['+0.5R', T.p05], ['+1R', T.p1], ['+2R', T.p2], ['+3R', T.p3], ['−0.5R', T.m05], ['Stop', T.sl]] : [];
                    const mins = (m: number) => (m < 60 ? `${Math.round(m)}m` : m < 1440 ? `${(m / 60).toFixed(1)}h` : `${(m / 1440).toFixed(1)}d`);
                    const held = t.holdSec / 60;
                    return (
                      <div className="mt-4 pt-3 border-t border-line flex flex-col gap-2.5 text-[12.5px]">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge tone={ex.exitReason === 'tp' ? 'profit' : ex.exitReason === 'sl' ? 'loss' : ex.exitReason === 'so' ? 'loss' : 'warn'}>{(REASON_LABEL[ex.exitReason] ?? ex.exitReason).toUpperCase()}</Badge>
                          {ex.entryOrder && <Badge tone={ex.entryOrder === 'limit' ? 'profit' : 'warn'}>{(ORDER_LABEL[ex.entryOrder] ?? ex.entryOrder).toUpperCase()}{ex.slipPts ? ` · ${ex.slipPts > 0 ? '+' : ''}${ex.slipPts} PTS SLIP` : ''}</Badge>}
                          {(ex.closes ?? 1) > 1 && <Badge tone="accent">{ex.closes} PARTIAL CLOSES</Badge>}
                        </div>
                        {o.left != null && o.left > 0 && <div className="text-warn">After you closed, price hit your target ({o.tpR?.toFixed(1)}R) {o.afterMin != null ? mins(o.afterMin) + ' later' : ''} before the stop — {fmt(o.left)} left on the table.</div>}
                        {o.saved != null && o.saved > 0 && <div className="text-profit">After you closed, price hit your stop {o.afterMin != null ? mins(o.afterMin) + ' later' : ''} — closing early saved {fmt(o.saved)}.</div>}
                        {o.after === 'none' && ex.exitReason !== 'tp' && ex.exitReason !== 'sl' && <div className="text-ink3">Price touched neither your target nor your stop in the week after you closed.</div>}
                        {heat != null && <div className="text-ink2">Heat before the best price: <span className="num">{Math.abs(heat).toFixed(2)}R</span>{Math.abs(heat) < 0.5 && t.r != null && t.r < 0 ? ' — it barely went against you before turning your way.' : ''}</div>}
                        {lv.some(([, m]) => m != null) && (
                          <div>
                            <div className="label mb-1">First touch after entry (★ = after you closed)</div>
                            <div className="flex flex-wrap gap-1.5">{lv.filter(([, m]) => m != null).sort((a, b) => a[1]! - b[1]!).map(([k, m]) => <span key={k} className={cx('chip h-7 text-[11.5px] num', k === 'Stop' || k.startsWith('−') ? 'text-loss' : 'text-profit')}>{k} {mins(m!)}{m! > held ? ' ★' : ''}</span>)}</div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>);
              })()}
            </Card>
          )}
        </div>
      </div>

      <Lightbox images={atts.map(x => ({ src: x.storageUrl ?? x.dataUrl ?? '', name: x.name }))} index={lightbox} onClose={() => setLightbox(null)} />
    </Page>
  );
}
