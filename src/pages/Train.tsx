import { useCallback, useEffect, useMemo, useState } from 'react';
import { useStore } from '@/data/store';
import { Badge, Card, Empty, Page, Segmented, Tabs, useIsMobile, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { MarkChart, fmtPx, shortDate, type Pending, type Tool } from '@/ui/train/MarkChart';
import { CLASS_LABEL, CLASS_ORDER, deleteChart, listCharts, loadBars, loadSymbols, randomChart, readLocal, saveChart, uploadLocal, type StoreMode, type SymRow } from '@/data/training';
import { engineMarks } from '@/core/training/engine';
import { scoreChart, summarize, type ChartScore, type TypeScore } from '@/core/training/score';
import { firstCloseBreak, labelPivots, lineCuts, atrSeries, regimeOf, zoneEdges, zoneRemovedAt } from '@/core/training/structure';
import { barsHash, emptyMarks, fromTBars, toTBars, TRAIN_TFS, type Marks, type MLine, type MPivot, type MZone, type TBar, type TrainChart, type TrainExport, type TrainTf } from '@/core/training/types';

type Tab = 'mark' | 'score';
const pct = (v: number | null) => (v == null ? '–' : `${Math.round(v * 100)}%`);
const TOOL_HINT: Record<Tool, string> = {
  pivot: 'Tap a candle: near its high = PEAK, near its low = VALLEY (snaps to the wick). Long-press or Alt-click a pivot to remove it.',
  line: 'Tap anchor 1, then anchor 2 (each snaps to the nearer wick). Then tap the candle that CLOSED beyond the line, or "No break". Select a line and drag its anchors up / down to a clean point.',
  zone: 'Drag a box over the base candle(s) (or tap one base candle). Edges snap to body / wick; switch them below. Long-press a zone to remove it.',
  select: 'Tap a pivot, line or zone to edit it, add a note or delete it.',
};

export default function Train() {
  const user = useStore(s => s.user);
  const toast = useToast();
  const mobile = useIsMobile();
  const [tab, setTab] = useState<Tab>('mark');
  const [symbols, setSymbols] = useState<SymRow[] | null>(null);
  const [loadErr, setLoadErr] = useState('');
  const [cls, setCls] = useState('major');
  const [sym, setSym] = useState<SymRow | null>(null);
  const [allBars, setAllBars] = useState<Partial<Record<TrainTf, TBar[]>>>({});
  const [tf, setTf] = useState<TrainTf>('H4');
  const [bars, setBars] = useState<TBar[]>([]);
  const [marks, setMarks] = useState<Marks>(emptyMarks());
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<TrainChart | null>(null);
  const [dirty, setDirty] = useState(false);
  const [charts, setCharts] = useState<TrainChart[]>([]);
  const [mode, setMode] = useState<StoreMode>('local');
  const [why, setWhy] = useState('');
  const [tool, setTool] = useState<Tool>('pivot');
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [compare, setCompare] = useState(false);
  const [busy, setBusy] = useState('');
  const [win, setWin] = useState(60);
  const [end, setEnd] = useState(0);

  // storage + symbol list
  const refresh = useCallback(async () => {
    const r = await listCharts(user?.id ?? null);
    setMode(r.mode); setCharts(r.charts); setWhy(r.why ?? '');
  }, [user?.id]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => { loadSymbols().then(setSymbols, e => setLoadErr(String(e?.message ?? e))); }, []);

  const n = bars.length;
  useEffect(() => { setWin(Math.min(n, mobile ? 45 : 80)); setEnd(n - 1); }, [n, mobile, bars]);
  const view: [number, number] = n ? [Math.max(0, Math.min(end, n - 1) - Math.max(10, Math.min(win, n)) + 1), Math.min(end, n - 1)] : [0, 0];

  const open = (b: TBar[], s: SymRow, t: TrainTf, existing: TrainChart | null) => {
    setBars(b); setTf(t); setSym(s); setCls(s.cls);
    setMarks(existing ? existing.marks : emptyMarks()); setNote(existing?.note ?? ''); setSaved(existing);
    setDirty(false); setSelected(null); setPending(null); setCompare(false);
  };
  const findSaved = (s: string, t: string, b: TBar[]) => { const h = barsHash(b); return charts.find(c => c.symbol === s && c.tf === t && c.bars_hash === h) ?? null; };
  const guardDirty = () => !dirty || window.confirm('Discard the marks on this chart that are not saved?');

  const pickSymbol = async (row: SymRow, wantTf?: TrainTf) => {
    if (!guardDirty()) return;
    setBusy('Loading bars…');
    try {
      const all = await loadBars(row);
      setAllBars(all);
      const tfs = TRAIN_TFS.filter(t => all[t]);
      const t = wantTf && all[wantTf] ? wantTf : tfs.includes(tf) ? tf : (tfs.find(x => x === 'D1') ?? tfs[0]);
      if (!t) { toast('No bars published for this symbol', 'error'); return; }
      open(all[t]!, row, t, findSaved(row.sym, t, all[t]!));
    } catch (e) { toast(`Could not load ${row.sym}: ${e instanceof Error ? e.message : e}`, 'error'); }
    finally { setBusy(''); }
  };
  const pickTf = (t: TrainTf) => { if (!sym || !allBars[t] || !guardDirty()) return; open(allBars[t]!, sym, t, findSaved(sym.sym, t, allBars[t]!)); };
  const random = async () => {
    if (!symbols || !guardDirty()) return;
    setBusy('Picking a chart…');
    try {
      const c = await randomChart(symbols, charts);
      if (!c) { toast('No chart found', 'error'); return; }
      setDirty(false);
      const all = await loadBars(c.row);
      setAllBars(all);
      open(all[c.tf]!, c.row, c.tf, findSaved(c.row.sym, c.tf, all[c.tf]!));
      toast(`${c.row.sym} ${c.tf} · ${c.regime === 'range' ? 'ranging' : `trending ${c.regime}`}`);
    } finally { setBusy(''); }
  };
  const openSaved = (c: TrainChart) => {
    if (!guardDirty()) return;
    const row = symbols?.find(s => s.sym === c.symbol) ?? { sym: c.symbol, market: c.market, cls: c.cls, k: c.cls };
    setAllBars({ [c.tf]: toTBars(c.bars) });
    open(toTBars(c.bars), row, c.tf, c);
    setTab('mark');
    void loadBars(row).then(all => setAllBars(a => ({ ...all, ...a })), () => {});
  };

  const change = (m: Marks) => { setMarks(m); setDirty(true); };
  const save = async () => {
    if (!sym || !n) return;
    setBusy('Saving…');
    const now = new Date().toISOString();
    const c: TrainChart = {
      id: saved?.id ?? `local-${Date.now().toString(36)}`, symbol: sym.sym, tf, market: sym.market, cls: sym.cls,
      as_of: bars[n - 1].t, bars_hash: barsHash(bars), bars: fromTBars(bars), marks, note, created_at: saved?.created_at ?? now, updated_at: now,
    };
    try {
      const s = await saveChart(mode, user?.id ?? null, c);
      setSaved(s); setDirty(false);
      setCharts(list => [s, ...list.filter(x => x.id !== s.id && x.id !== c.id)]);
      toast(mode === 'cloud' ? 'Saved' : 'Saved on this device', 'ok');
    } catch (e) { toast(`Save failed: ${e instanceof Error ? e.message : e}`, 'error'); }
    finally { setBusy(''); }
  };
  const remove = async () => {
    if (!saved || !window.confirm('Delete this marked chart?')) return;
    try { await deleteChart(mode, saved); setCharts(l => l.filter(x => x.id !== saved.id)); setSaved(null); setMarks(emptyMarks()); setNote(''); setCompare(false); }
    catch (e) { toast(`Delete failed: ${e instanceof Error ? e.message : e}`, 'error'); }
  };
  const exportJson = () => {
    const out: TrainExport = { version: 1, exported_at: new Date().toISOString(), charts };
    const url = URL.createObjectURL(new Blob([JSON.stringify(out, null, 1)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = `training-marks-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  // engine + score of the open chart (only once saved, so the owner marks blind)
  const market = sym?.market ?? 'fx';
  const engine = useMemo(() => (compare && n ? engineMarks(bars, tf, market) : null), [compare, bars, tf, market, n]);
  const score = useMemo(() => (engine ? scoreChart(bars, marks, engine) : null), [engine, bars, marks]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.('input, textarea, select')) return;
      if (e.key === 'Escape') { setPending(null); setSelected(null); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) { change(removeEl(marks, selected)); setSelected(null); }
      const t = ({ p: 'pivot', l: 'line', z: 'zone', s: 'select' } as const)[e.key as 'p'];
      if (t) setTool(t);
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });

  const classes = CLASS_ORDER.filter(c => symbols?.some(s => s.cls === c));
  const inClass = (symbols ?? []).filter(s => s.cls === cls);
  const localCount = mode === 'cloud' ? readLocal().length : 0;

  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Train my eye</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[70ch]">Mark charts the way you read them: swing peaks and valleys, trend lines and their break, demand / supply zones. Save, then compare with what the engine draws on the same candles. Every marked chart tunes the indicators and the bot and becomes a regression test.</p>
          {mode === 'local' && (
            <div role="status" className="rounded-xl border border-warn/40 bg-warn/10 px-3 py-2 text-[12.5px] text-ink flex gap-2 items-start">
              <Icon name="alert" size={15} className="text-warn mt-0.5 shrink-0" />
              <span>Saving on <b>this device only</b> (the training table is not reachable{why ? `: ${why}` : ''}). Use Export JSON to keep a copy; marks upload when the table is back.</span>
            </div>
          )}
          {localCount > 0 && user && (
            <button type="button" className="btn h-8 self-start" onClick={async () => { const k = await uploadLocal(user.id); toast(`Uploaded ${k} chart${k === 1 ? '' : 's'}`, 'ok'); void refresh(); }}>
              <Icon name="cloud" size={14} /> Upload {localCount} chart{localCount === 1 ? '' : 's'} saved on this device
            </button>
          )}
        </div>
      </Card>

      <Tabs value={tab} onChange={setTab} label="Train view" options={[{ value: 'mark', label: 'Mark a chart' }, { value: 'score', label: `Score · ${charts.length}` }]} />

      {tab === 'mark' ? (
        <>
          <Card className="p-4">
            <div className="flex flex-wrap gap-2 items-end">
              <label className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-none">
                <span className="label">Market</span>
                <select className="field" value={cls} onChange={e => setCls(e.target.value)} aria-label="Market">
                  {classes.map(c => <option key={c} value={c}>{CLASS_LABEL[c] ?? c}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1 min-w-[140px] flex-1 sm:flex-none">
                <span className="label">Symbol</span>
                <select className="field" value={sym?.cls === cls ? sym.sym : ''} aria-label="Symbol"
                  onChange={e => { const r = inClass.find(s => s.sym === e.target.value); if (r) void pickSymbol(r); }}>
                  <option value="" disabled>{symbols ? `Pick (${inClass.length})` : 'Loading…'}</option>
                  {inClass.map(s => <option key={s.sym} value={s.sym}>{s.sym}</option>)}
                </select>
              </label>
              <button type="button" className="btn-primary h-9" onClick={random} disabled={!symbols || !!busy}><Icon name="refresh" size={14} /> Random chart</button>
            </div>
            {sym && (
              <div className="flex flex-wrap gap-1.5 mt-3" role="radiogroup" aria-label="Timeframe">
                {TRAIN_TFS.map(t => {
                  const has = !!allBars[t];
                  return <button key={t} type="button" role="radio" aria-checked={t === tf} disabled={!has} onClick={() => pickTf(t)}
                    className={`chip ${t === tf ? '!bg-accent !text-on-accent !border-transparent' : ''} ${has ? '' : 'opacity-40'}`} title={has ? `${allBars[t]!.length} bars` : 'No bars published for this timeframe'}>{t}</button>;
                })}
              </div>
            )}
            {loadErr && <p className="text-[12.5px] text-loss mt-2">Chart feeds not reachable: {loadErr}</p>}
            {busy && <p className="text-[12.5px] text-ink3 mt-2">{busy}</p>}
          </Card>

          {!n ? (
            <Card><Empty icon="eye" title="Pick a chart to mark">Choose a market and symbol, or tap Random chart for a mix of trending and ranging markets.</Empty></Card>
          ) : (
            <Card className="p-3 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="text-[15px] font-semibold">{sym?.sym} <span className="text-ink3 font-normal">{tf} · {n} bars · to {shortDate(bars[n - 1].t)}</span></div>
                  <div className="text-[11.5px] text-ink3">{regimeOf(bars) === 'range' ? 'Ranging' : `Trending ${regimeOf(bars)}`}{saved ? ` · saved ${new Date(saved.updated_at).toLocaleDateString()}` : ' · not saved'}{dirty ? ' · unsaved changes' : ''}</div>
                </div>
                <Segmented size="sm" label="Marking tool" value={tool} onChange={t => { setTool(t); setPending(null); }}
                  options={[{ value: 'pivot', label: 'Pivots' }, { value: 'line', label: 'Lines' }, { value: 'zone', label: 'Zones' }, { value: 'select', label: 'Edit' }]} />
              </div>
              <p className="text-[12px] text-ink3 mb-2 min-h-[32px]">{pending?.stage === 'a' ? 'Now tap anchor 2.' : pending?.stage === 'brk' ? 'Tap the candle that CLOSED beyond the line, or choose No break below.' : TOOL_HINT[tool]}</p>
              <div className="-mx-1">
                <MarkChart bars={bars} marks={marks} engine={engine} tool={tool} view={view} height={mobile ? 340 : 440}
                  selected={selected} pending={pending} onChange={change} onSelect={setSelected} onPending={setPending} />
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <button type="button" className="btn h-8 w-9 !px-0" aria-label="Zoom out" onClick={() => setWin(w => Math.min(n, Math.round(w * 1.4)))}>−</button>
                <button type="button" className="btn h-8 w-9 !px-0" aria-label="Zoom in" onClick={() => setWin(w => Math.max(15, Math.round(w / 1.4)))}>+</button>
                <input type="range" aria-label="Scroll the chart" className="flex-1 min-w-[120px] accent-[rgb(var(--accent))] !bg-transparent !border-0" min={Math.min(n - 1, win - 1)} max={n - 1} value={Math.min(end, n - 1)} onChange={e => setEnd(Number(e.target.value))} />
                <span className="num text-[11px] text-ink3">{view[1] - view[0] + 1} bars</span>
              </div>
              {pending?.stage === 'brk' && <BreakPrompt bars={bars} line={marks.lines.find(l => l.id === pending.id) ?? null} onSet={brk => { change({ ...marks, lines: marks.lines.map(l => (l.id === pending.id ? { ...l, brk } : l)) }); setPending(null); }} />}
              <Legend compare={!!engine} />
            </Card>
          )}

          {n > 0 && selected && <Selected bars={bars} marks={marks} id={selected} onChange={change} onDone={() => setSelected(null)} onBreakTap={id => { setTool('line'); setPending({ stage: 'brk', id }); }} />}

          {n > 0 && (
            <Card className="p-4">
              <MarkList marks={marks} bars={bars} onSelect={id => { setSelected(id); setTool('select'); }} />
              <label className="flex flex-col gap-1 mt-3">
                <span className="label">Note on this chart</span>
                <textarea rows={2} className="w-full p-2.5 text-sm" placeholder="What you see here, what the engine should learn…" value={note} onChange={e => { setNote(e.target.value); setDirty(true); }} />
              </label>
              <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" className="btn-primary" onClick={save} disabled={!!busy}><Icon name="check" size={14} /> {saved ? 'Save changes' : 'Save marks'}</button>
                <button type="button" className="btn" disabled={!saved} onClick={() => setCompare(c => !c)} title={saved ? '' : 'Save first, so you mark without seeing the engine'}>
                  <Icon name="eye" size={14} /> {compare ? 'Hide engine' : 'Compare with engine'}
                </button>
                <button type="button" className="btn-ghost" onClick={() => { if (window.confirm('Clear every mark on this chart?')) { change(emptyMarks()); setSelected(null); setPending(null); } }}>Clear</button>
                {saved && <button type="button" className="btn-ghost text-loss" onClick={remove}>Delete chart</button>}
                <button type="button" className="btn-ghost sm:ml-auto" onClick={exportJson} disabled={!charts.length}><Icon name="download" size={14} /> Export JSON</button>
              </div>
            </Card>
          )}

          {score && <ScoreCard s={score} />}
        </>
      ) : (
        <ScoreTab charts={charts} onOpen={openSaved} onExport={exportJson} />
      )}
    </Page>
  );
}

// ─── pieces ───────────────────────────────────────────────────────────────────────────────────────────────

function removeEl(m: Marks, id: string): Marks {
  return { ...m, pivots: m.pivots.filter(p => `p${p.i}${p.kind}` !== id), lines: m.lines.filter(l => l.id !== id), zones: m.zones.filter(z => z.id !== id) };
}

function Legend({ compare }: { compare: boolean }) {
  const dot = (c: string) => <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: `rgb(var(--${c}))` }} />;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11.5px] text-ink3">
      <span className="inline-flex items-center gap-1.5">{dot('cyan')} You (solid)</span>
      {compare && <span className="inline-flex items-center gap-1.5">{dot('warn')} Engine (dashed, ▲▼ pivots)</span>}
      <span className="inline-flex items-center gap-1.5">{dot('profit')} Demand</span>
      <span className="inline-flex items-center gap-1.5">{dot('loss')} Supply</span>
      <span>× = break</span>
    </div>
  );
}

function BreakPrompt({ bars, line, onSet }: { bars: TBar[]; line: MLine | null; onSet: (brk: number | null) => void }) {
  if (!line) return null;
  const auto = firstCloseBreak(bars, line);
  return (
    <div className="flex flex-wrap gap-2 mt-2 items-center text-[12.5px]">
      <span className="text-ink2">Where was it broken?</span>
      {auto != null && <button type="button" className="btn h-8" onClick={() => onSet(auto)}>First close beyond: {shortDate(bars[auto].t)}</button>}
      <button type="button" className="btn h-8" onClick={() => onSet(null)}>No break</button>
    </div>
  );
}

function NoteField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 mt-2">
      <span className="label">Note</span>
      <input className="field" placeholder="e.g. not the top — first lower high" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}

function Selected({ bars, marks, id, onChange, onDone, onBreakTap }: { bars: TBar[]; marks: Marks; id: string; onChange: (m: Marks) => void; onDone: () => void; onBreakTap: (id: string) => void }) {
  const pv = marks.pivots.find(p => `p${p.i}${p.kind}` === id);
  const ln = marks.lines.find(l => l.id === id);
  const zn = marks.zones.find(z => z.id === id);
  if (!pv && !ln && !zn) return null;
  const atr = atrSeries(bars);
  const del = <button type="button" className="btn-ghost text-loss h-8" onClick={() => { onChange(removeEl(marks, id)); onDone(); }}><Icon name="trash" size={14} /> Delete</button>;
  const setP = (np: MPivot) => onChange({ ...marks, pivots: marks.pivots.map(p => (p === pv ? np : p)) });
  const setL = (nl: MLine) => onChange({ ...marks, lines: marks.lines.map(l => (l.id === id ? nl : l)) });
  const setZ = (nz: MZone) => onChange({ ...marks, zones: marks.zones.map(z => (z.id === id ? nz : z)) });
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-2 mb-1">
        <h3 className="text-[14px] font-semibold">
          {pv && <>{labelPivots(marks.pivots).find(x => x.p === pv)?.label} {pv.kind} · {shortDate(bars[pv.i].t)} · <span className="num">{fmtPx(pv.p)}</span></>}
          {ln && <>{ln.dir > 0 ? 'Up' : 'Down'} trend line</>}
          {zn && <>{zn.side === 'demand' ? 'Demand' : 'Supply'} zone · base {shortDate(bars[zn.s].t)}{zn.e > zn.s ? ` – ${shortDate(bars[zn.e].t)}` : ''}</>}
        </h3>
        <button type="button" className="btn-ghost h-8 w-8 !px-0" aria-label="Close" onClick={onDone}><Icon name="x" size={14} /></button>
      </div>
      {pv && (
        <div className="flex flex-wrap gap-2 mt-2">
          <button type="button" className="btn h-8" onClick={() => { const k = pv.kind === 'peak' ? 'valley' : 'peak'; setP({ ...pv, kind: k, p: k === 'peak' ? bars[pv.i].h : bars[pv.i].l }); }}>Make it a {pv.kind === 'peak' ? 'valley' : 'peak'}</button>
          {del}
        </div>
      )}
      {ln && (
        <div className="text-[12.5px] text-ink2 flex flex-col gap-1.5 mt-1">
          {(['a', 'b'] as const).map(k => {
            const an = ln[k], b = bars[an.i];
            const onWick = an.p === b.h || an.p === b.l;
            return (
              <div key={k} className="flex flex-wrap items-center gap-2">
                <span>Anchor {k === 'a' ? 1 : 2}: {shortDate(b.t)} · <span className="num">{fmtPx(an.p)}</span> {onWick ? <Badge>wick</Badge> : <Badge tone="accent">clean point</Badge>}</span>
                {!onWick && <button type="button" className="btn h-7 text-[12px]" onClick={() => { const p = Math.abs(an.p - b.l) < Math.abs(an.p - b.h) ? b.l : b.h; const nl = { ...ln, [k]: { i: an.i, p } }; setL({ ...nl, dir: nl.b.p >= nl.a.p ? 1 : -1 }); }}>Back to wick</button>}
              </div>
            );
          })}
          <div>Cuts {lineCuts(bars, ln, 0.05 * (atr[ln.b.i] || 0))} candle{lineCuts(bars, ln, 0.05 * (atr[ln.b.i] || 0)) === 1 ? '' : 's'} between the anchors (more than 0.05 ATR). Drag an anchor on the chart to move it.</div>
          <div className="flex flex-wrap items-center gap-2">
            <span>Break: {ln.brk == null ? 'none' : shortDate(bars[ln.brk].t)}</span>
            <button type="button" className="btn h-7 text-[12px]" onClick={() => onBreakTap(ln.id)}>Tap the break</button>
            {(() => { const a = firstCloseBreak(bars, ln); return a != null && a !== ln.brk ? <button type="button" className="btn h-7 text-[12px]" onClick={() => setL({ ...ln, brk: a })}>First close beyond ({shortDate(bars[a].t)})</button> : null; })()}
            {ln.brk != null && <button type="button" className="btn h-7 text-[12px]" onClick={() => setL({ ...ln, brk: null })}>No break</button>}
          </div>
          <div>{del}</div>
        </div>
      )}
      {zn && (() => {
        const E = zoneEdges(bars, zn.s, zn.e, zn.side);
        const rm = zoneRemovedAt(bars, zn);
        const opt = (lbl: string, v: number, on: boolean, set: () => void) => <button type="button" onClick={set} className={`chip ${on ? '!bg-accent !text-on-accent !border-transparent' : ''}`}>{lbl} <span className="num">{fmtPx(v)}</span></button>;
        const reEdge = (s: number, e: number, side = zn.side) => {
          const N = zoneEdges(bars, s, e, side), O = zoneEdges(bars, zn.s, zn.e, zn.side);
          return { ...zn, side, s, e, prox: zn.prox === O.proxWick ? N.proxWick : N.proxBody, dist: zn.dist === O.distBody ? N.distBody : N.distWick };
        };
        return (
          <div className="text-[12.5px] text-ink2 flex flex-col gap-2 mt-1">
            <div className="flex flex-wrap gap-2 items-center">
              <Segmented size="sm" label="Zone side" value={zn.side} onChange={v => setZ(reEdge(zn.s, zn.e, v))} options={[{ value: 'demand', label: 'Demand' }, { value: 'supply', label: 'Supply' }]} />
              <span>Base: {zn.e - zn.s + 1} candle{zn.e > zn.s ? 's' : ''}</span>
              <button type="button" className="btn h-7 text-[12px]" disabled={zn.s <= 0} onClick={() => setZ(reEdge(zn.s - 1, zn.e))}>◀ start</button>
              <button type="button" className="btn h-7 text-[12px]" disabled={zn.s >= zn.e} onClick={() => setZ(reEdge(zn.s + 1, zn.e))}>start ▶</button>
              <button type="button" className="btn h-7 text-[12px]" disabled={zn.e <= zn.s} onClick={() => setZ(reEdge(zn.s, zn.e - 1))}>◀ end</button>
              <button type="button" className="btn h-7 text-[12px]" disabled={zn.e >= bars.length - 1} onClick={() => setZ(reEdge(zn.s, zn.e + 1))}>end ▶</button>
            </div>
            <div className="flex flex-wrap gap-1.5 items-center"><span className="w-16">Proximal</span>{opt('body', E.proxBody, zn.prox === E.proxBody, () => setZ({ ...zn, prox: E.proxBody }))}{opt('wick', E.proxWick, zn.prox === E.proxWick && E.proxWick !== E.proxBody, () => setZ({ ...zn, prox: E.proxWick }))}</div>
            <div className="flex flex-wrap gap-1.5 items-center"><span className="w-16">Distal</span>{opt('wick', E.distWick, zn.dist === E.distWick, () => setZ({ ...zn, dist: E.distWick }))}{opt('body', E.distBody, zn.dist === E.distBody && E.distBody !== E.distWick, () => setZ({ ...zn, dist: E.distBody }))}</div>
            <div>{rm != null ? `A close beyond the distal on ${shortDate(bars[rm].t)} removed it.` : 'Not removed (no close beyond the distal).'}</div>
            <div>{del}</div>
          </div>
        );
      })()}
      <NoteField value={(pv ?? ln ?? zn)?.note ?? ''} onChange={v => (pv ? setP({ ...pv, note: v }) : ln ? setL({ ...ln, note: v }) : zn && setZ({ ...zn, note: v }))} />
    </Card>
  );
}

function MarkList({ marks, bars, onSelect }: { marks: Marks; bars: TBar[]; onSelect: (id: string) => void }) {
  const lab = labelPivots(marks.pivots);
  const t = (i: number) => (bars[i] ? shortDate(bars[i].t) : `#${i}`);
  if (!marks.pivots.length && !marks.lines.length && !marks.zones.length) return <p className="text-[12.5px] text-ink3">Nothing marked yet.</p>;
  return (
    <div className="flex flex-col gap-2 text-[12.5px]">
      {lab.length > 0 && <div><span className="label">Structure · {lab.length}</span><div className="flex flex-wrap gap-1.5 mt-1">{lab.map(({ p, label }) => <button key={`${p.i}${p.kind}`} type="button" className="chip" onClick={() => onSelect(`p${p.i}${p.kind}`)} title={p.note}>{label} {t(p.i)}{p.note ? ' ✎' : ''}</button>)}</div></div>}
      {marks.lines.length > 0 && <div><span className="label">Trend lines · {marks.lines.length}</span><div className="flex flex-wrap gap-1.5 mt-1">{marks.lines.map(l => <button key={l.id} type="button" className="chip" onClick={() => onSelect(l.id)}>{l.dir > 0 ? '↗' : '↘'} {t(l.a.i)} → {t(l.b.i)}{l.brk != null ? ` × ${t(l.brk)}` : ''}{l.note ? ' ✎' : ''}</button>)}</div></div>}
      {marks.zones.length > 0 && <div><span className="label">Zones · {marks.zones.length}</span><div className="flex flex-wrap gap-1.5 mt-1">{marks.zones.map(z => <button key={z.id} type="button" className="chip" onClick={() => onSelect(z.id)}><span className={z.side === 'demand' ? 'text-profit' : 'text-loss'}>{z.side === 'demand' ? 'D' : 'S'}</span> {t(z.s)} · {fmtPx(z.prox)}–{fmtPx(z.dist)}{z.note ? ' ✎' : ''}</button>)}</div></div>}
    </div>
  );
}

function TypeRow({ name, s, hint }: { name: string; s: TypeScore; hint: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-2 border-b border-line/50 last:border-0">
      <div className="min-w-0">
        <div className="text-[13.5px] font-semibold">{name} <span className="num text-ink">{pct(s.f1)}</span></div>
        <div className="text-[11.5px] text-ink3">{hint}</div>
      </div>
      <div className="text-right text-[12px] text-ink2 num">
        <div>{s.matched} matched · you {s.owner} · engine {s.engine}</div>
        <div className="text-ink3">recall {pct(s.recall)} · precision {pct(s.precision)}</div>
      </div>
    </div>
  );
}

function ScoreCard({ s }: { s: ChartScore }) {
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <h3 className="text-[15px] font-semibold">Agreement on this chart</h3>
        <span className="num text-[20px] font-semibold">{pct(s.overall)}</span>
      </div>
      <p className="text-[11.5px] text-ink3 mb-2">Agreement = 2 × matched ÷ (yours + engine's). Recall = how many of yours the engine found; precision = how many of the engine's you agree with. Only the element types you marked count toward the total.</p>
      <TypeRow name="Pivots" s={s.pivots} hint="Same type, within ±1 bar" />
      <TypeRow name="Trend lines" s={s.lines} hint="Both anchors within ±1 bar and 0.1 ATR" />
      <TypeRow name="Breaks (of matched lines)" s={s.breaks} hint="Both unbroken, or broken within ±1 bar" />
      <TypeRow name="Zones" s={s.zones} hint="Same side, start ±1 bar, price IoU ≥ 0.6" />
      {s.misses.length > 0 && (
        <details className="mt-2">
          <summary className="text-[12.5px] text-ink2 cursor-pointer">{s.misses.length} disagreement{s.misses.length === 1 ? '' : 's'}</summary>
          <ul className="mt-1 text-[12px] text-ink2 list-disc pl-5">{s.misses.map((m, k) => <li key={k}>{m.text}</li>)}</ul>
        </details>
      )}
    </Card>
  );
}

function ScoreTab({ charts, onOpen, onExport }: { charts: TrainChart[]; onOpen: (c: TrainChart) => void; onExport: () => void }) {
  const rows = useMemo(() => charts.map(c => {
    const bars = toTBars(c.bars);
    const engine = engineMarks(bars, c.tf, c.market);
    return { c, owner: c.marks, score: scoreChart(bars, c.marks, engine) };
  }), [charts]);
  const sum = useMemo(() => summarize(rows), [rows]);
  const worst = [...rows].filter(r => r.score.overall != null).sort((a, b) => (a.score.overall ?? 0) - (b.score.overall ?? 0));
  if (!charts.length) return <Card><Empty icon="eye" title="No marked charts yet">Mark and save a chart; the score of every saved chart against the engine shows here. Aim for about 30 charts across markets before tuning.</Empty></Card>;
  return (
    <>
      <Card className="p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1 flex-wrap">
          <h3 className="text-[15px] font-semibold">Engine vs your eye · {sum.charts} chart{sum.charts === 1 ? '' : 's'}</h3>
          <span className="num text-[22px] font-semibold">{pct(sum.overall)}</span>
        </div>
        <p className="text-[11.5px] text-ink3 mb-2">Totals over every chart where you marked that element type. {sum.charts < 30 ? `${30 - sum.charts} more charts before tuning (see docs/training/README.md).` : 'Enough charts to tune: export and run the tuning split.'}</p>
        <TypeRow name="Pivots" s={sum.pivots} hint="±1 bar" />
        <TypeRow name="Trend lines" s={sum.lines} hint="anchors ±1 bar, 0.1 ATR" />
        <TypeRow name="Breaks" s={sum.breaks} hint="of matched lines, ±1 bar" />
        <TypeRow name="Zones" s={sum.zones} hint="start ±1 bar, IoU ≥ 0.6" />
        <button type="button" className="btn h-8 mt-3" onClick={onExport}><Icon name="download" size={14} /> Export JSON</button>
      </Card>
      <Card className="p-4">
        <h3 className="text-[15px] font-semibold mb-2">Worst disagreements first</h3>
        <ul className="flex flex-col">
          {worst.map(({ c, score }) => (
            <li key={c.id} className="border-b border-line/50 last:border-0">
              <button type="button" className="w-full text-left py-2.5 flex flex-col gap-0.5 hover:bg-raised/50 rounded-lg px-1" onClick={() => onOpen(c)}>
                <span className="flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
                  <b>{c.symbol}</b><span className="text-ink3">{c.tf} · to {shortDate(c.as_of)}</span>
                  <span className="num ml-auto font-semibold">{pct(score.overall)}</span>
                </span>
                <span className="text-[11.5px] text-ink3 num">pivots {pct(score.pivots.f1)} · lines {pct(score.lines.f1)} · zones {pct(score.zones.f1)}{c.note ? ` · “${c.note.slice(0, 60)}”` : ''}</span>
                {score.misses[0] && <span className="text-[11.5px] text-ink2 truncate">{score.misses[0].text}{score.misses.length > 1 ? ` (+${score.misses.length - 1})` : ''}</span>}
              </button>
            </li>
          ))}
          {rows.filter(r => r.score.overall == null).map(({ c }) => (
            <li key={c.id}><button type="button" className="w-full text-left py-2 text-[12.5px] text-ink3 px-1" onClick={() => onOpen(c)}>{c.symbol} {c.tf} · nothing marked</button></li>
          ))}
        </ul>
      </Card>
    </>
  );
}
