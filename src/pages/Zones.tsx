import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { clearDataset, emptyDataset, importFiles, loadDataset, saveDataset, type Progress } from '@/core/zones/client';
import { dayToISO, isoToDay, type Dataset } from '@/core/zones/research';
import { DIMS, MIN_N, RAJA_DEFAULTS, callouts, dateSpan, defaultCut, groupRows, hasSplit, pick, summaryRow, type Callout, type Dim, type Opts, type Row, type Target } from '@/core/zones/score';
import { pct, rMult } from '@/lib/format';
import { Badge, Bar, Card, CardHead, cx, Empty, Page, Segmented, Tabs, useToast } from '@/ui/kit';
import { Collapsible, useOpenSet } from '@/ui/Collapse';
import { Icon } from '@/ui/Icon';

type Saved = Omit<Opts, 'cutDay'> & { dim: Dim; cut: string | null };
const PREF_KEY = 'rfx_zone_scorecard_prefs';
function readPrefs(): Saved {
  const d: Saved = { ...RAJA_DEFAULTS, dim: 'raja', cut: null };
  try { const v = localStorage.getItem(PREF_KEY); if (v) return { ...d, ...(JSON.parse(v) as Partial<Saved>) }; } catch { /* storage blocked */ }
  return d;
}
function writePrefs(p: Saved) { try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch { /* storage blocked */ } }

const mb = (b: number) => (b >= 1e9 ? `${(b / 1e9).toFixed(2)} GB` : `${(b / 1e6).toFixed(b < 1e7 ? 1 : 0)} MB`);
const int = (n: number) => n.toLocaleString('en-US');
/** Colour only what the sample can carry: n ≥ 30 and the whole 95% interval on one side of 0. */
const verdictTone = (r: Row) => (r.small || !Number.isFinite(r.ci[0]) ? 'muted' : r.ci[0] > 0 ? 'good' : r.ci[1] < 0 ? 'bad' : 'flat');

export default function Zones() {
  const [ds, setDs] = useState<Dataset | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [prog, setProg] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<Saved>(readPrefs);
  const fileRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const help = useOpenSet('rfx_zone_scorecard_open', ['honesty']);

  useEffect(() => { void loadDataset().then(d => { setDs(d); setLoaded(true); }); }, []);
  const set = (p: Partial<Saved>) => setPrefs(prev => { const n = { ...prev, ...p }; writePrefs(n); return n; });

  const onFiles = async (list: FileList) => {
    const files = [...list];
    if (!files.length) return;
    setErrors([]);
    const { ds: next, errors: errs } = await importFiles(files, ds ?? emptyDataset(), setProg);
    setProg(null);
    setErrors(errs);
    if (next !== ds && next.n) {
      setDs(next);
      const ok = await saveDataset(next);
      toast(ok ? `Imported ${int(next.n - (ds?.n ?? 0))} touches` : 'Imported — but this device would not store it, so it is gone after a reload', ok ? 'ok' : 'error');
    }
  };
  const clear = async () => {
    if (!confirm('Remove every imported research file from this device?')) return;
    await clearDataset();
    setDs(null); setErrors([]); set({ cut: null });
    toast('Research data cleared');
  };

  const has = !!ds && ds.n > 0;
  const autoCut = useMemo(() => (ds ? defaultCut(ds) : 0), [ds]);
  const cutDay = prefs.cut ? isoToDay(prefs.cut) : autoCut;
  const opts: Opts = { target: prefs.target, stop: prefs.stop, snap: prefs.snap, touches: prefs.touches, detector: prefs.detector, drawnOnly: prefs.drawnOnly, sample: prefs.sample, cutDay };
  const lazy = useDeferredValue(opts);
  const lazyDim = useDeferredValue(prefs.dim);
  const key = JSON.stringify(lazy);
  const res = useMemo(() => {
    if (!ds || !ds.n) return null;
    const p = pick(ds, lazy);
    return { p, sum: summaryRow(ds, p, lazy), rows: groupRows(ds, p, lazyDim, lazy), call: callouts(ds, lazy), split: hasSplit(ds, lazy.cutDay) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ds, key, lazyDim]);
  const stale = key !== JSON.stringify(opts) || lazyDim !== prefs.dim;
  const span = useMemo(() => (ds ? dateSpan(ds) : null), [ds]);

  const importBtn = (
    <button type="button" className="btn-primary" disabled={!!prog} onClick={() => fileRef.current?.click()}>
      <Icon name="upload" size={15} />{has ? 'Add CSV' : 'Import research CSV'}
    </button>
  );

  return (
    <Page className="pb-4">
      <p className="text-[13px] text-ink3 leading-relaxed max-w-[70ch] text-pretty">
        Which ZoneVision setups actually paid on your pairs. Import the research CSVs the MT5 Strategy Tester writes; every touch of a real
        detected zone is scored with Raja’s rules: close stop with its real loss, creation-time context, R targets.
      </p>
      <input ref={fileRef} type="file" multiple accept=".csv,text/csv,text/comma-separated-values" className="sr-only" tabIndex={-1} aria-hidden="true"
        onChange={e => { if (e.target.files) void onFiles(e.target.files); e.target.value = ''; }} />

      {/* ── import ─────────────────────────────────────────────────── */}
      <Card aria-label="Research files">
        <CardHead title="Research files" sub={has ? `${int(ds!.zones)} zones · ${int(ds!.n)} touches${span ? ` · ${span.from} → ${span.to}` : ''} · stored on this device only` : 'Nothing imported yet'}
          right={<div className="flex gap-2 flex-wrap">{importBtn}{has && <button type="button" className="btn" onClick={() => void clear()}><Icon name="trash" size={14} />Clear</button>}</div>} />
        {prog && (
          <div className="flex flex-col gap-2" role="status" aria-live="polite">
            <div className="flex justify-between gap-3 text-[13px]">
              <span className="truncate font-medium">{prog.count > 1 ? `${prog.index + 1}/${prog.count} · ` : ''}{prog.file}</span>
              <span className="num text-ink3 shrink-0">{mb(prog.read)} / {mb(prog.total)} · {int(prog.zones)} zones</span>
            </div>
            <Bar value={prog.total ? prog.read / prog.total : 0} />
          </div>
        )}
        {errors.length > 0 && (
          <ul className="mt-3 flex flex-col gap-2">
            {errors.map(e => <li key={e} className="flex gap-2.5 text-[13px] leading-snug rounded-xl px-3 py-2.5 bg-warn/[0.08] border border-warn/30"><Icon name="alert" size={15} className="text-warn shrink-0 mt-0.5" /><span className="min-w-0 break-words">{e}</span></li>)}
          </ul>
        )}
        {has && !prog && (
          <ul className="mt-1 divide-y divide-line">
            {ds!.files.map(f => (
              <li key={f.name + f.at} className="py-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[13px]">
                <span className="font-medium min-w-0 break-all">{f.name}</span>
                <span className="text-ink3 num">{f.symbols.join(', ')} · {int(f.zones)} zones · {f.from} → {f.to}{f.dup ? ` · ${int(f.dup)} duplicates skipped` : ''}</span>
                {!f.v2 && <Badge tone="warn">v1 file: no Raja type / lens columns</Badge>}
              </li>
            ))}
          </ul>
        )}
        {loaded && !has && !prog && (
          <Empty icon="upload" title="Import a ZoneVision research CSV" action={importBtn}>
            The file is <span className="num">RFX_ZoneResearch_&lt;symbol&gt;_&lt;from&gt;_&lt;to&gt;.csv</span>. On iPhone, save it to Files first and pick it from there. The steps to make one are below.
          </Empty>
        )}
      </Card>

      {has && res && (<>
        {/* ── settings ───────────────────────────────────────────────── */}
        <Card aria-label="Settings">
          <CardHead title="How trades are counted" sub="Defaults follow Raja’s template. Every change re-scores all touches." right={
            <button type="button" className="btn-ghost text-[13px]" onClick={() => set({ ...RAJA_DEFAULTS, cut: prefs.cut })}><Icon name="refresh" size={14} />Raja defaults</button>} />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-4">
            <Ctl label="Stop" hint={prefs.stop === 'close' ? 'Raja: out only on a candle close beyond the distal, at that close’s real loss' : 'A wick beyond the distal stops you at −1R'}>
              <Segmented size="sm" label="Stop model" value={prefs.stop} onChange={v => set({ stop: v })} options={[{ value: 'close', label: 'Close (real loss)' }, { value: 'wick', label: 'Wick' }]} />
            </Ctl>
            <Ctl label="Target" hint={prefs.target === 'opp' ? 'The nearest opposing zone at creation; zones with none are left out' : `Take profit at ${prefs.target}R (Raja’s template asks at least 2R)`}>
              <Segmented size="sm" label="Target" value={String(prefs.target)} onChange={v => set({ target: (v === 'opp' ? 'opp' : Number(v)) as Target })}
                options={[{ value: '1', label: '1R' }, { value: '2', label: '2R' }, { value: '3', label: '3R' }, { value: '5', label: '5R' }, { value: 'opp', label: 'Opp' }]} />
            </Ctl>
            <Ctl label="Zone context" hint={prefs.snap === 'create' ? 'What the chart knew when the zone appeared: no look-ahead' : 'Touch-candle snapshot: read on the candle that filled you, it leaks the outcome'} warn={prefs.snap === 'touch'}>
              <Segmented size="sm" label="Zone context" value={prefs.snap} onChange={v => set({ snap: v })} options={[{ value: 'create', label: 'At creation' }, { value: 'touch', label: 'At touch ⚠' }]} />
            </Ctl>
            <Ctl label="Touches" hint={prefs.touches === 'fresh' ? 'First touch only (Raja trades fresh zones)' : 'Touches 2–3 have no close-stop log: they use the wick stop'} warn={prefs.touches === 'all' && prefs.stop === 'close'}>
              <Segmented size="sm" label="Touches" value={prefs.touches} onChange={v => set({ touches: v })} options={[{ value: 'fresh', label: 'Fresh only' }, { value: 'all', label: 'All (1–3)' }]} />
            </Ctl>
            <Ctl label="Zones" hint={prefs.detector === 'ZV' ? 'ZoneVision’s own detector' : 'Adds the ALT ZigZag-pivot detector rows'}>
              <div className="flex flex-wrap items-center gap-2">
                <Segmented size="sm" label="Detector" value={prefs.detector} onChange={v => set({ detector: v })} options={[{ value: 'ZV', label: 'ZoneVision' }, { value: 'all', label: '+ ALT' }]} />
                <label className="chip cursor-pointer select-none">
                  <input type="checkbox" checked={prefs.drawnOnly} onChange={e => set({ drawnOnly: e.target.checked })} />Drawn on chart only
                </label>
              </div>
            </Ctl>
            <Ctl label="Sample" hint={res.split ? `In-sample before ${dayToISO(cutDay)}, out-of-sample from it${prefs.cut ? '' : ' (last 20% of dates)'}` : 'Pick a cut date inside the data to split it'}>
              <div className="flex flex-wrap items-center gap-2">
                <Segmented size="sm" label="Sample" value={prefs.sample} onChange={v => set({ sample: v })} options={[{ value: 'all', label: 'All' }, { value: 'is', label: 'In-sample' }, { value: 'oos', label: 'Out-of-sample' }]} />
                <label className="flex items-center gap-1.5 text-[12px] text-ink3">
                  <span className="sr-only">Out-of-sample from</span>
                  <input type="date" className="field h-9 touch:h-10 w-[10.5rem] text-[16px] sm:text-[13px] num" value={dayToISO(cutDay)} min={span?.from} max={span?.to}
                    onChange={e => set({ cut: e.target.value || null })} aria-label="Out-of-sample starts on" />
                </label>
                {prefs.cut && <button type="button" className="btn-ghost h-9 text-[12px]" onClick={() => set({ cut: null })}>Auto</button>}
              </div>
            </Ctl>
          </div>
        </Card>

        {/* ── headline ──────────────────────────────────────────────── */}
        <Card aria-label="All trades" className={cx('transition-opacity duration-150', stale && 'opacity-60')}>
          <CardHead title={`All trades · ${prefs.sample === 'all' ? 'whole sample' : prefs.sample === 'is' ? 'in-sample' : 'out-of-sample'}`}
            sub={`${prefs.stop === 'close' ? 'Close stop' : 'Wick stop'} · ${prefs.target === 'opp' ? 'opposing-zone target' : `${prefs.target}R target`} · ${prefs.touches === 'fresh' ? 'fresh touches' : 'touches 1–3'} · ${prefs.detector === 'ZV' ? 'ZoneVision' : 'ZoneVision + ALT'}${prefs.drawnOnly ? ', drawn' : ''}`} />
          <Kpis r={res.sum} />
          {res.p.optimistic > 0 && <Note tone="warn">{int(res.p.optimistic)} close-stop losses come from an older CSV without <span className="num">t1c_loss</span> and are counted at −1R: optimistic. Re-run the test with ZoneVision 2.10.</Note>}
          {res.sum.wickShare > 0 && prefs.stop === 'close' && <Note>{pct(res.sum.wickShare, 0)} of these trades have no close-stop log (touches 2–3, or a v1 file) and use the wick stop.</Note>}
        </Card>

        {/* ── best / avoid ──────────────────────────────────────────── */}
        <div className={cx('grid lg:grid-cols-2 gap-4 transition-opacity duration-150', stale && 'opacity-60')}>
          <CalloutCard title="Raja’s best setups" good items={res.call.best} chosenOn={res.call.chosenOn}
            empty={`No group with at least ${MIN_N} trades has its whole 95% interval above 0R. That is the honest answer for these settings.`} />
          <CalloutCard title="Avoid" items={res.call.avoid} chosenOn={res.call.chosenOn}
            empty={`No group with at least ${MIN_N} trades is clearly below 0R.`} />
        </div>

        {/* ── scorecard ─────────────────────────────────────────────── */}
        <Card aria-label="Scorecard" className={cx('transition-opacity duration-150', stale && 'opacity-60')}>
          <CardHead title={`Scorecard · ${DIMS.find(d => d.id === prefs.dim)!.label}`} sub={DIMS.find(d => d.id === prefs.dim)!.hint} />
          <div className="mb-4"><Tabs label="Group by" swap={false} value={prefs.dim} onChange={v => set({ dim: v })} options={DIMS.map(d => ({ value: d.id, label: d.short }))} /></div>
          <Scorecard rows={res.rows} />
        </Card>
      </>)}

      {/* ── honesty + MT5 help ─────────────────────────────────────── */}
      <Collapsible id="honesty" title="Read this before trusting a number" lead={<Icon name="info" size={16} className="text-accent shrink-0" />}
        preview="Backtest detections, not live trades · costs · in-sample bias" open={help.isOpen('honesty')} onToggle={() => help.toggle('honesty')}>
        <ul className="flex flex-col gap-2.5 text-[13px] text-ink2 leading-relaxed list-disc pl-5 max-w-[75ch]">
          <li><b>Not live trades.</b> These are zones ZoneVision detected on MT5 history in the Strategy Tester, with a mechanical entry at the proximal. Nobody placed these orders. Your fills, your hesitation and your news filter are not in here.</li>
          <li><b>Costs.</b> The tester spread at creation is inside 1R (risk = height + spread). Slippage, commission, swaps and a wider live spread at news are not. Small zones on M15 suffer most.</li>
          <li><b>Close stop is the realistic one.</b> A close beyond the distal is often far past it: in the 2023-25 EURUSD + XAUUSD run the close-stop losses averaged about −2R, not −1R. The wick stop at −1R looks better than you could actually trade.</li>
          <li><b>No look-ahead by default.</b> The touch snapshot (<span className="num">s1_*</span>) is read on the close of the candle that filled you. Its depth alone predicts the stop with AUC 1.000. Use “At creation”.</li>
          <li><b>In-sample bias.</b> Picking the best of many groups always finds something that looks good. When a cut date splits the data, the callouts are chosen on in-sample trades and shown next to their out-of-sample result. A setup that only works in-sample is luck.</li>
          <li><b>Small samples.</b> Fewer than {MIN_N} trades: grey, no colour, no callout. Intervals are a 95% bootstrap (normal approximation above 1,000 trades). Open trades at the horizon count 0R; untouched zones are not trades.</li>
        </ul>
      </Collapsible>

      <Collapsible id="mt5" title="Make the CSV in MT5 (Raja’s template)" lead={<Icon name="wrench" size={16} className="text-accent shrink-0" />}
        preview="ZoneVision 2.10 research mode in the Strategy Tester" open={help.isOpen('mt5') || (loaded && !has)} onToggle={() => help.toggle('mt5')}>
        <ol className="flex flex-col gap-3 text-[13px] text-ink2 leading-relaxed list-decimal pl-5 max-w-[75ch]">
          <li>Copy <span className="num">RamanFX_ZoneVision.mq5</span> and <span className="num">RFX_ZoneCore.mqh</span> (Tools page) into <span className="num">MQL5\Indicators\</span> and compile with F7.</li>
          <li>Strategy Tester (Ctrl+R): type <b>Indicator</b> → <span className="num">RamanFX_ZoneVision</span>. One symbol per run, chart period M15, modelling <b>1 minute OHLC</b> (not “Open prices only”). Indicators always run in visual mode: drag the speed to max.</li>
          <li>Dates: test one period to choose setups and a later one to check them, e.g. 2023-01-01 → 2025-12-31, then 2026.</li>
          <li>Inputs tab → <b>Load</b> → <span className="num">ZV_Template_Raja.set</span>. Then set:
            <ul className="mt-1.5 flex flex-col gap-1 list-disc pl-5">
              <li><span className="num">InpResearch = true</span> (always on in the tester anyway)</li>
              <li><span className="num">InpResearchDNA = true</span>: Raja type, lens verdict, curve, room, trendline and the close-stop loss columns</li>
              <li><span className="num">InpResearchTFs = M15,H1,H4,D1</span> · <span className="num">InpResearchMaxBars = 200</span></li>
              <li><span className="num">InpResearchDraw = false</span> for a much faster run (same data)</li>
              <li><span className="num">InpResearchGMT</span> = your broker’s offset (2 in winter, 3 in summer for most)</li>
              <li>Leave the zone rules as the template sets them: the CSV records zones as the template draws them.</li>
            </ul>
          </li>
          <li>Start. The Journal says <span className="num">ZoneVision research mode ON</span>. Let it finish so the file is renamed.</li>
          <li>The file is in <span className="num">%APPDATA%\MetaQuotes\Terminal\Common\Files\RFX_ZoneResearch_&lt;symbol&gt;_&lt;from&gt;_&lt;to&gt;.csv</span> (File → Open Data Folder, up two levels, Common\Files). A <span className="num">_running.csv</span> also works. Use local agents only.</li>
          <li>Send it to your phone (iCloud Drive, AirDrop to Files) and import it above. Big multi-year files are fine: they are read in the background and only a compact summary of each touch is kept on the device.</li>
        </ol>
        <p className="text-[12px] text-ink3 mt-3">The <span className="num">RFX_Calib*.csv</span> tables in the research folder are summaries made by analyze.py, not per-zone rows. They cannot be scored here.</p>
      </Collapsible>
    </Page>
  );
}

function Ctl({ label, hint, warn, children }: { label: string; hint: ReactNode; warn?: boolean; children: ReactNode }) {
  return (
    <div className="min-w-0 flex flex-col gap-1.5">
      <div className="label">{label}</div>
      <div className="min-w-0 max-w-full overflow-x-auto overscroll-x-contain -mx-1 px-1 pb-0.5">{children}</div>
      <div className={cx('text-[12px] leading-snug', warn ? 'text-warn' : 'text-ink3')}>{warn && <Icon name="alert" size={12} className="inline -mt-0.5 mr-1" />}{hint}</div>
    </div>
  );
}

function Note({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  return <p className={cx('mt-3 text-[12px] leading-snug flex gap-2', tone === 'warn' ? 'text-warn' : 'text-ink3')}><Icon name={tone === 'warn' ? 'alert' : 'info'} size={13} className="shrink-0 mt-px" /><span>{children}</span></p>;
}

const toneText = { good: 'text-profit', bad: 'text-loss', flat: 'text-ink', muted: 'text-ink3' } as const;

function Kpis({ r }: { r: Row }) {
  const t = verdictTone(r);
  const items: [string, ReactNode, string?][] = [
    ['Trades', int(r.n)],
    ['Win rate', pct(r.winRate, 0), Number.isFinite(r.winCI[0]) ? `${pct(r.winCI[0], 0)}–${pct(r.winCI[1], 0)}` : undefined],
    ['Avg loss', rMult(r.avgLoss), `avg win ${rMult(r.avgWin)}`],
    ['Expectancy', <span key="e" className={toneText[t]}>{rMult(r.E)}</span>, Number.isFinite(r.ci[0]) ? `95% ${rMult(r.ci[0])} to ${rMult(r.ci[1])}` : 'too few trades'],
    ['Max drawdown', rMult(-r.maxDD, 1), `total ${rMult(r.totalR, 0)}`],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map(([k, v, s]) => (
        <div key={k} className="kpi-box min-w-0 rounded-xl border border-line bg-raised/40 px-3.5 py-3">
          <div className="label truncate">{k}</div>
          <div className="num text-[20px] font-semibold tracking-[-0.01em] mt-1 truncate">{v}</div>
          {s && <div className="num text-[11px] text-ink3 mt-0.5 truncate">{s}</div>}
        </div>
      ))}
      {r.small && <div className="col-span-full"><Badge tone="warn"><Icon name="alert" size={12} />Only {r.n} trades: too few to judge</Badge></div>}
    </div>
  );
}

function CalloutCard({ title, items, good, empty, chosenOn }: { title: string; items: Callout[]; good?: boolean; empty: string; chosenOn: 'is' | 'selected' }) {
  return (
    <Card aria-label={title} className="p-5">
      <CardHead title={<span className="inline-flex items-center gap-2"><Icon name={good ? 'star' : 'alert'} size={15} className={good ? 'text-profit' : 'text-loss'} />{title}</span>}
        sub={chosenOn === 'is' ? `n ≥ ${MIN_N}, 95% interval ${good ? 'above' : 'below'} 0R, picked on in-sample trades · out-of-sample check on the right` : `n ≥ ${MIN_N} and the whole 95% interval ${good ? 'above' : 'below'} 0R`} />
      {items.length ? (
        <ul className="flex flex-col gap-2">
          {items.map(c => {
            const o = c.oos;
            const held = o && !o.small ? (good ? o.E > 0 : o.E < 0) : null;
            return (
              <li key={c.dim + c.row.key} className={cx('rounded-xl px-3.5 py-2.5 border flex items-center gap-3', good ? 'bg-profit/[0.06] border-profit/25' : 'bg-loss/[0.06] border-loss/25')}>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-ink3">{c.dimLabel} · {int(c.row.n)} trades · win {pct(c.row.winRate, 0)}</div>
                  <div className="text-[13.5px] font-medium leading-snug line-clamp-2 break-words">{c.row.key}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className={cx('num font-semibold text-[13.5px]', good ? 'text-profit' : 'text-loss')}>{rMult(c.row.E)}</div>
                  <div className="num text-[11px] text-ink3">{rMult(c.row.ci[0])} to {rMult(c.row.ci[1])}</div>
                </div>
                {chosenOn === 'is' && (
                  <div className="text-right shrink-0 pl-3 border-l border-line min-w-[68px]">
                    <div className="text-[10px] uppercase tracking-wide text-ink3">OOS</div>
                    <div className={cx('num text-[12.5px] font-medium', held == null ? 'text-ink3' : held ? (good ? 'text-profit' : 'text-loss') : 'text-warn')}>{o ? rMult(o.E) : '—'}</div>
                    <div className="num text-[10.5px] text-ink3">{o ? `n ${o.n}${o.small ? ' · few' : held === false ? ' · failed' : ''}` : 'no trades'}</div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : <p className="text-[13px] text-ink3 leading-relaxed">{empty}</p>}
    </Card>
  );
}

/** One row per group. The interval strip spans ±2R around a zero line, so groups compare at a glance. */
function Scorecard({ rows }: { rows: Row[] }) {
  if (!rows.length) return <p className="text-[13px] text-ink3">No trades match these settings.</p>;
  const lim = 2;
  const x = (v: number) => `${((Math.max(-lim, Math.min(lim, v)) + lim) / (2 * lim)) * 100}%`;
  const firstSmall = rows.findIndex(r => r.small);
  return (
    <div className="flex flex-col">
      <div className="hidden md:grid grid-cols-[minmax(0,1.4fr)_64px_92px_80px_minmax(150px,1.3fr)_88px_72px] gap-3 px-3 pb-2 label border-b border-line">
        <span>Group</span><span className="text-right">Trades</span><span className="text-right">Win rate</span><span className="text-right">Avg loss</span><span className="text-center">Expectancy · 95% interval</span><span className="text-right">E</span><span className="text-right">Max DD</span>
      </div>
      {rows.map((r, i) => {
        const t = verdictTone(r);
        return (
          <div key={r.key}>
            {i === firstSmall && <div className="px-3 pt-4 pb-1.5 text-[12px] text-warn flex items-center gap-1.5"><Icon name="alert" size={13} />Fewer than {MIN_N} trades: not enough to judge</div>}
            <div className={cx('grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.4fr)_64px_92px_80px_minmax(150px,1.3fr)_88px_72px] gap-x-3 gap-y-1.5 items-center px-3 py-2.5 border-b border-line/70', r.small && 'opacity-75')}>
              <div className="min-w-0 text-[13.5px] font-medium truncate">{r.key}</div>
              <div className={cx('md:hidden num text-[13.5px] font-semibold text-right', toneText[t])}>{rMult(r.E)}</div>
              <div className="col-span-2 md:col-span-1 md:contents num text-[12px] md:text-[13px] text-ink3 md:text-ink2 flex gap-3">
                <span className="md:text-right">{int(r.n)}<span className="md:hidden"> trades</span></span>
                <span className="md:text-right">{pct(r.winRate, 0)}<span className="md:hidden"> win</span></span>
                <span className="md:text-right"><span className="md:hidden">loss </span>{rMult(r.avgLoss, 1)}</span>
                <span className="md:hidden ml-auto">DD {rMult(-r.maxDD, 0)}</span>
              </div>
              <div className="col-span-2 md:col-span-1 relative h-5" aria-label={`95% interval ${rMult(r.ci[0])} to ${rMult(r.ci[1])}`} role="img">
                <div className="absolute inset-y-[9px] inset-x-0 rounded-full bg-line/70" />
                <div className="absolute top-0.5 bottom-0.5 w-px bg-ink3/70" style={{ left: '50%' }} />
                {Number.isFinite(r.ci[0]) && (
                  <div className={cx('absolute top-[6px] h-2 rounded-full', t === 'good' ? 'bg-profit/60' : t === 'bad' ? 'bg-loss/60' : 'bg-ink3/40')}
                    style={{ left: x(r.ci[0]), width: `calc(${x(r.ci[1])} - ${x(r.ci[0])})` }} />
                )}
                {Number.isFinite(r.E) && <div className={cx('absolute top-[3px] w-[3px] h-3.5 -ml-[1.5px] rounded-full', t === 'good' ? 'bg-profit' : t === 'bad' ? 'bg-loss' : 'bg-ink2')} style={{ left: x(r.E) }} />}
              </div>
              <div className={cx('hidden md:block num text-[13px] font-semibold text-right', toneText[t])}>{rMult(r.E)}</div>
              <div className="hidden md:block num text-[13px] text-ink2 text-right">{rMult(-r.maxDD, 1)}</div>
            </div>
          </div>
        );
      })}
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_64px_92px_80px_minmax(150px,1.3fr)_88px_72px] gap-x-3 px-3 pt-2 num text-[10.5px] text-ink3" aria-hidden="true">
        <span className="hidden md:block md:col-span-4 text-right">strip</span>
        <span className="flex justify-between"><span>−2R</span><span>0</span><span>+2R</span></span>
      </div>
    </div>
  );
}
