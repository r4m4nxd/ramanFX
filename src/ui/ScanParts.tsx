import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INDEX_URL, parseIndex, ruleIcon, searchTickers, stockPath, type IndexRow, type RuleStatus, type ScanIndex, type ScanRule } from '@/core/scanner';
import { num } from '@/lib/format';
import { cx, Sheet } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ZoneMiniChart, type MiniBar, type MiniLevels, type MiniZone } from '@/ui/ZoneMiniChart';

export const IDX_SHORT: Record<string, string> = { SPX: 'S&P', NDX: 'NDX', DJI: 'Dow', RUT: 'R2K' };
export const typeTone = (t: string) => (t === 'ARR' || t === 'WOW' ? 'accent' : t === 'STR' ? 'violet' : 'neutral') as 'accent' | 'violet' | 'neutral';
const RULE_TONE: Record<RuleStatus, string> = { pass: 'text-profit bg-profit/10', fail: 'text-loss bg-loss/10', warn: 'text-warn bg-warn/10', unknown: 'text-ink3 bg-raised' };
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

export function FundTable({ rows, open }: { rows: [string, string][]; open?: boolean }) {
  if (!rows.length) return null;
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
        <p className="text-[12px] text-ink3 mt-3">Green: the {tf ?? ''} demand zone of the plan{zones?.length ? ' (dotted: other active zones)' : ''}. Red: the next supply (target zone). Dashed: entry (E), stop (S), target (T). P = last close. Daily bars, split and dividend adjusted.</p>
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
        <ul id={`${id}-list`} role="listbox" aria-label="Stocks" className="absolute z-30 left-0 right-0 mt-1.5 rounded-2xl border border-line bg-surface shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto">
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
                  <span className="block num text-[13px]">{num(r.px)}</span>
                  {r.sig ? <span className={cx('block text-[11px] font-semibold', r.sig === 'BUY' ? 'text-profit' : 'text-warn')}>{r.sig}</span>
                    : r.dd != null ? <span className="block num text-[11px] text-ink3">demand {num(r.dd, 1)}%</span> : null}
                </span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
