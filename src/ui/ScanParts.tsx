import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_INDEXES, INDEX_URL, parseIndex, px, readWatch, ruleIcon, searchTickers, SEIDEN_PARTS, stockPath, toggleWatch, WATCH_KEY, writeWatch, type IndexRow, type RfxIndex, type RuleStatus, type ScanIndex, type ScanRule } from '@/core/scanner';
import { ZoneGauge } from './ZoneGauge';
import { num } from '@/lib/format';
import { cx, Sheet } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ZoneMiniChart, type MiniBar, type MiniLevels, type MiniZone } from '@/ui/ZoneMiniChart';

/** Short index labels (unknown codes show as themselves). */
export const IDX_SHORT: Record<string, string> = Object.fromEntries(DEFAULT_INDEXES.map(m => [m.code, m.short]));
export const typeTone = (t: string) => (t === 'ARR' || t === 'WOW' ? 'accent' : t === 'STR' ? 'violet' : 'neutral') as 'accent' | 'violet' | 'neutral';
const RULE_TONE: Record<RuleStatus, string> = { pass: 'text-profit bg-profit/10', fail: 'text-loss bg-loss/10', warn: 'text-warn bg-warn/10', unknown: 'text-ink3 bg-raised', info: 'text-ink3 bg-raised' };
/** The plan numbers (entry / stop / target / R:R) are the point of a card: one step up from the other stats. */
export const PLAN_V = '!text-[16px] !font-semibold';
const summary = 'flex items-center gap-2 min-h-[44px] cursor-pointer list-none text-[13px] font-semibold select-none';

export function RuleList({ rules, open, title = 'Rules checked' }: { rules: ScanRule[]; open?: boolean; title?: string }) {
  const ok = rules.filter(r => r.status === 'pass').length;
  const bad = rules.filter(r => r.status === 'fail').length;
  return (
    <details className="group rounded-xl border border-line px-3" open={open}>
      <summary className={summary}>
        <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3 shrink-0" />
        <span className="flex-1">{title}</span>
        <span className="num text-xs font-medium text-ink3">{ok}/{rules.length} pass{bad ? ` · ${bad} fail` : ''}</span>
      </summary>
      <ul className="pb-3 flex flex-col gap-1.5">
        {rules.map((r, i) => (
          <li key={i} className="flex gap-2.5 text-[12.5px] leading-relaxed">
            <span aria-label={r.status} className={cx('w-5 h-5 rounded-full grid place-items-center shrink-0 text-[11px] font-bold mt-px', RULE_TONE[r.status])}>{ruleIcon[r.status]}</span>
            <span className="min-w-0 flex-1 text-ink2 [overflow-wrap:anywhere]">{r.text}</span>
            <span className="num text-[11px] text-ink3 shrink-0 mt-px max-w-[34%] text-right">{r.ref}</span>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function FundTable({ rows, open, country }: { rows: [string, string][]; open?: boolean; country?: string }) {
  if (!rows.length) {
    // Canadian issuers file 40-F / 6-K with IFRS numbers: no SEC companyfacts in the US-GAAP shape the table reads.
    return country === 'CA' ? <p className="text-[12px] text-ink3 rounded-xl border border-line px-3 min-h-[44px] flex items-center"><span className="font-semibold text-ink2 mr-1.5">Fundamentals</span> n/a (Canadian filer)</p> : null;
  }
  return (
    <details className="group rounded-xl border border-line px-3" open={open}>
      <summary className={summary}>
        <Icon name="chevronRight" size={14} className="transition-transform group-open:rotate-90 text-ink3 shrink-0" />
        <span className="flex-1">Fundamentals</span>
        <span className="text-[11px] font-medium text-ink3">context only · SEC filings</span>
      </summary>
      <table className="w-full text-[12.5px] mb-3">
        <tbody className="divide-y divide-line">
          {rows.map(([k, v]) => (
            <tr key={k}><th scope="row" className="text-left font-medium text-ink3 py-1.5 pr-3 whitespace-nowrap align-top">{k}</th><td className="num text-ink py-1.5 text-right [overflow-wrap:anywhere]">{v}</td></tr>
          ))}
        </tbody>
      </table>
      <p className="text-[11.5px] text-ink3 pb-3 -mt-1">Not part of the supply and demand rules. A signal never depends on these numbers.</p>
    </details>
  );
}

/** The zone chart as a tap target; tap opens the full ~6 months. */
export function ZoneChart({ symbol, tf, bars, levels, zones, show = 60, height = 120 }: { symbol: string; tf?: string; bars: MiniBar[]; levels: MiniLevels; zones?: MiniZone[]; show?: number; height?: number }) {
  const [big, setBig] = useState(false);
  const label = `${symbol} daily chart` + (levels.proximal != null ? `: demand ${levels.distal} to ${levels.proximal}` : '') + (levels.entry != null ? `, entry ${levels.entry}, stop ${levels.stop}` : '') + (levels.target != null ? `, target ${levels.target}` : '');
  return (
    <>
      <button type="button" onClick={() => setBig(true)} aria-label={`Enlarge the ${symbol} chart`} className="block w-full rounded-xl border border-line/70 bg-raised/30 p-1.5 press">
        <ZoneMiniChart bars={bars.slice(-show)} levels={levels} zones={zones} height={height} label={label} />
      </button>
      <Sheet open={big} onClose={() => setBig(false)} title={`${symbol} · last ${bars.length} sessions`} width={760}>
        <ZoneMiniChart bars={bars} levels={levels} zones={zones} height={280} label={label} />
        <p className="text-[12px] text-ink3 mt-3 leading-relaxed">Green band: the {tf ?? ''} demand zone of the plan{zones?.length ? ' (dotted bands: other active zones)' : ''}. Red band: the next supply (the target zone). Amber band (FV): fair value, the 20-bar value area. Dashed lines: entry (E), stop (S) and target (T, or PZ3 when profit zones are shown); dotted lines: PZ1 / PZ2. P = last close. Daily bars, split and dividend adjusted.</p>
      </Sheet>
    </>
  );
}

// ─── Ticker search (type-ahead over index.json) ─────────────────────────────────────────────────────────
let indexPromise: Promise<ScanIndex | null> | null = null;
export function loadIndex(): Promise<ScanIndex | null> {
  indexPromise ??= fetch(INDEX_URL, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(parseIndex).catch(() => { indexPromise = null; return null; });
  return indexPromise;
}
export function useScanIndex(eager = false) {
  const [idx, setIdx] = useState<ScanIndex | null | undefined>(undefined);
  const [want, setWant] = useState(eager);
  useEffect(() => { if (!want) return; let live = true; void loadIndex().then(v => { if (live) setIdx(v); }); return () => { live = false; }; }, [want]);
  return { idx, load: () => setWant(true) };
}

export function TickerSearch() {
  const { idx, load } = useScanIndex();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [act, setAct] = useState(0);
  const nav = useNavigate();
  const id = useId();
  const box = useRef<HTMLDivElement>(null);
  const res: IndexRow[] = idx ? searchTickers(idx.tickers, q) : [];
  useEffect(() => setAct(0), [q]);
  useEffect(() => {
    const h = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', h);
    return () => document.removeEventListener('pointerdown', h);
  }, []);
  const go = (r: IndexRow) => { setOpen(false); setQ(''); nav(stockPath(r.s)); };
  const show = open && q.trim().length > 0;
  return (
    <div ref={box} className="relative">
      <label className="sr-only" htmlFor={`${id}-q`}>Search any ticker</label>
      <div className="relative">
        <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
        <input id={`${id}-q`} type="search" inputMode="search" autoComplete="off" spellCheck={false} placeholder={idx?.tickers.length ? `Search ${idx.tickers.length.toLocaleString()} stocks by ticker or name` : 'Search any stock by ticker or name'}
          className="field h-11 pl-10 pr-3 w-full text-[16px] sm:text-[14px]" value={q}
          role="combobox" aria-expanded={show} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={show && res[act] ? `${id}-o${act}` : undefined}
          onFocus={() => { load(); setOpen(true); }} onChange={e => { load(); setQ(e.target.value); setOpen(true); }}
          onKeyDown={e => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setAct(a => Math.min(a + 1, Math.max(res.length - 1, 0))); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setAct(a => Math.max(a - 1, 0)); }
            else if (e.key === 'Enter' && res[act]) { e.preventDefault(); go(res[act]); }
            else if (e.key === 'Escape') setOpen(false);
          }} />
      </div>
      {show && (
        <ul id={`${id}-list`} role="listbox" aria-label="Stocks" className="absolute z-30 left-0 right-0 mt-1.5 rounded-2xl border border-line bg-surface shadow-xl overflow-hidden max-h-[min(60vh,calc(100dvh-18rem))] overflow-y-auto overscroll-contain">
          {idx === undefined ? <li className="px-4 py-3 text-[13px] text-ink3">Loading the list…</li>
            : idx === null ? <li className="px-4 py-3 text-[13px] text-ink3">The stock list is not available yet.</li>
            : !res.length ? <li className="px-4 py-3 text-[13px] text-ink3">No stock matches “{q}”.</li>
            : res.map((r, i) => (
              <li key={r.s} id={`${id}-o${i}`} role="option" aria-selected={i === act}
                onPointerDown={e => e.preventDefault()} onClick={() => go(r)} onPointerEnter={() => setAct(i)}
                className={cx('flex items-center gap-3 px-4 min-h-[48px] py-2 cursor-pointer', i === act && 'bg-raised')}>
                <span className="font-semibold text-[14px] w-[64px] shrink-0 truncate">{r.s}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] text-ink2 truncate">{r.n}</span>
                  <span className="block text-[11px] text-ink3 truncate">{[r.sec, r.ix.map(i2 => IDX_SHORT[i2] ?? i2).join(' ')].filter(Boolean).join(' · ')}</span>
                </span>
                <span className="text-right shrink-0">
                  <span className="block num text-[13px]">{px(r.px)}</span>
                  {r.sig ? <span className={cx('block text-[11px] font-semibold', r.sig === 'BUY' ? 'text-profit' : 'text-warn')}>{r.sig}</span>
                    : r.dd != null ? <span className="block num text-[11px] text-ink3">{num(r.dd, 1)}% to demand</span> : null}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}

// ─── Pinndx-inspired display pieces (scores, PZ chips, watchlist star, RFX index panel) ─────────────────
export function ScoreChips({ raja, seiden, parts }: { raja?: number | null; seiden?: number | null; parts?: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        {raja != null && <span className="h-7 touch:h-9 px-2.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-[11px] font-semibold inline-flex items-center num" title="Raja lens score: zone type, freshness, curve, room. The headline and part of the BUY rules.">Raja {raja}/10</span>}
        {seiden != null && (
          <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)}
            className="h-7 touch:h-9 px-3 rounded-full border border-line2 bg-raised text-ink2 text-[11px] font-semibold inline-flex items-center gap-1 num hover:text-ink transition-colors">
            Seiden odds {num(seiden, seiden % 1 ? 1 : 0)}/10<Icon name="chevronDown" size={11} className={cx('transition-transform', open && 'rotate-180')} />
          </button>
        )}
      </div>
      {open && seiden != null && (
        <div id={id} className="rounded-xl border border-line bg-raised/40 p-3 text-[12px]">
          <p className="text-ink3 mb-1.5">Display only: Seiden's odds enhancers. Raja's rules alone decide a BUY.</p>
          <ul className="flex flex-col gap-1">
            {Object.entries(parts ?? {}).map(([k, v]) => <li key={k} className="flex justify-between gap-3"><span className="text-ink2 min-w-0">{SEIDEN_PARTS[k] ?? k}</span><span className="num font-semibold shrink-0">{v}</span></li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PzChips({ s }: { s: { pz1?: number | null; pz2?: number | null; pz3?: number | null; rr_pz1?: number | null; rr_pz2?: number | null; rr_pz3?: number | null; target?: number | null } }) {
  const items = (['pz1', 'pz2', 'pz3'] as const).map(k => ({ k, v: s[k], r: s[`rr_${k}` as const] })).filter(x => x.v != null);
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Profit zones">
      {items.map(x => (
        <span key={x.k} className="h-6 px-2 rounded-md border border-profit/30 bg-profit/10 text-profit text-[11px] font-semibold inline-flex items-center gap-1 num" title={x.k === 'pz3' ? 'PZ3 = the Raja target, 0.5% before the next supply' : x.k === 'pz1' ? 'PZ1: the higher of fair value near edge and 2R, below PZ3 (Raja: close one half here, hold the other)' : 'PZ2: the higher of fair value far edge and 3R, below PZ3'}>
          {x.k.toUpperCase()} {px(x.v)}{x.r != null && <span className="font-medium opacity-80">· {num(x.r, 1)}R</span>}
        </span>
      ))}
    </div>
  );
}

export function ContextFlags({ s }: { s: { fv_inside?: boolean; fv_dist_atr?: number | null; index_aligned?: boolean; index_state?: string | null } }) {
  const f: { t: string; tone: string }[] = [];
  if (s.fv_inside) f.push({ t: 'Inside fair value', tone: 'text-warn border-warn/30 bg-warn/10' });
  else if (s.fv_dist_atr != null && s.fv_dist_atr >= 1) f.push({ t: `${num(s.fv_dist_atr, 1)} ATR below fair value`, tone: 'text-ink2 border-line2 bg-raised' });
  if (s.index_aligned) f.push({ t: 'RFX index aligned', tone: 'text-profit border-profit/30 bg-profit/10' });
  else if (s.index_state === 'supply') f.push({ t: 'RFX index in supply', tone: 'text-warn border-warn/30 bg-warn/10' });
  if (!f.length) return null;
  return <div className="flex flex-wrap gap-1.5">{f.map(x => <span key={x.t} className={cx('h-6 px-2 rounded-md border text-[11px] font-semibold inline-flex items-center', x.tone)}>{x.t}</span>)}</div>;
}

/** Starred tickers, kept on this device; every page using it stays in sync. */
export function useWatchlist() {
  const [list, setList] = useState<string[]>(readWatch);
  useEffect(() => {
    const on = (e: StorageEvent | Event) => { if (!(e instanceof StorageEvent) || e.key === WATCH_KEY) setList(readWatch()); };
    window.addEventListener('storage', on);
    window.addEventListener('rfx-watch', on);
    return () => { window.removeEventListener('storage', on); window.removeEventListener('rfx-watch', on); };
  }, []);
  const toggle = (sym: string) => { const next = toggleWatch(readWatch(), sym); writeWatch(next); setList(next); window.dispatchEvent(new Event('rfx-watch')); };
  return { list, toggle, has: (s: string) => list.includes(s) };
}

export function StarButton({ symbol, on, onToggle }: { symbol: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} aria-pressed={on} aria-label={on ? `Remove ${symbol} from the watchlist` : `Add ${symbol} to the watchlist`}
      className={cx('w-10 h-10 -m-1.5 rounded-full grid place-items-center shrink-0 transition-colors', on ? 'text-warn' : 'text-ink3 hover:text-ink2')}>
      <Icon name="star" size={18} fill={on ? 'currentColor' : 'none'} />
    </button>
  );
}

export function RfxPanel({ ix }: { ix: RfxIndex }) {
  return (
    <div className="rounded-xl border border-line/70 bg-raised/40 px-3 py-2.5" aria-label="RFX composite index">
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="font-semibold text-[13px]">RFX index</span>
        <span className="text-[11px] text-ink3">equal-weight SPY · QQQ · IWM · DIA</span>
        <span className="num text-[13px] font-semibold ml-auto">{px(ix.price)}</span>
      </div>
      <ZoneGauge className="mt-2" demand={ix.demand} supply={ix.supply} state={ix.state} />
      <div className="text-[11px] text-ink3 mt-1">{ix.direction}{ix.aligned ? ' · aligned: +1 Seiden bonus on buys' : ix.state === 'supply' ? ' · in supply: opposite-zone flag on buys (never blocks)' : ''}</div>
    </div>
  );
}
