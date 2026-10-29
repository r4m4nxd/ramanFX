import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@/data/store';
import { loadRates, rate } from '@/data/fx';
import { LIBRARY, measuredUnitValues, normalizeSymbol, specFor, unitValue } from '@/core/instruments';
import { ccySymbol, num } from '@/lib/format';
import { Badge, cx } from '@/ui/kit';

export function useAccountCcy() {
  return useStore(s => (s.activeAccount !== 'all' ? s.accounts[s.activeAccount]?.currency : undefined) ?? Object.values(s.accounts)[0]?.currency ?? 'USD');
}

/** useState that survives tab switches and visits (localStorage, best effort). */
export function usePersisted<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => { try { const raw = localStorage.getItem(key); return raw != null ? (JSON.parse(raw) as T) : initial; } catch { return initial; } });
  return [v, (x: T) => { setV(x); try { localStorage.setItem(key, JSON.stringify(x)); } catch { /* private mode */ } }];
}

export const readLocal = <T,>(key: string): T | null => { try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : null; } catch { return null; } };
export const writeLocal = (key: string, v: unknown) => { try { if (v == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(v)); } catch { /* private mode */ } };

export function useRates() {
  const [r, setR] = useState<Awaited<ReturnType<typeof loadRates>>>(null);
  useEffect(() => { void loadRates().then(setR); }, []);
  return r;
}

/** Symbol combobox over the library plus the user's traded symbols. */
export function SymbolPicker({ value, onChange, futures }: { value: string; onChange: (s: string) => void; futures: boolean }) {
  const trades = useStore(s => s.trades);
  const [q, setQ] = useState(value);
  const [open, setOpen] = useState(false);
  useEffect(() => setQ(value), [value]);
  const mine = useMemo(() => [...new Set(trades.map(t => normalizeSymbol(t.symbol)))], [trades]);
  const list = useMemo(() => {
    const ql = q.trim().toUpperCase();
    const pool = LIBRARY.filter(i => (futures ? i.venue !== 'CFD' : i.venue === 'CFD'));
    const ranked = pool.filter(i => !ql || i.symbol.includes(ql) || i.name.toUpperCase().includes(ql) || i.aliases?.some(a => a.includes(ql)));
    ranked.sort((a, b) => Number(mine.includes(b.symbol)) - Number(mine.includes(a.symbol)) || Number(b.symbol.startsWith(ql)) - Number(a.symbol.startsWith(ql)));
    return ranked.slice(0, 40);
  }, [q, futures, mine]);
  return (
    <div className="relative">
      <input aria-label="Instrument" className="field font-mono uppercase" value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => { setOpen(false); if (q.trim()) onChange(q.trim().toUpperCase()); }, 150)} placeholder={futures ? 'ES, MNQ, GC, CL…' : 'EURUSD, XAUUSD, US30…'} />
      <AnimatePresence>
        {open && list.length > 0 && (
          // Wide enough to read every ticker's full name; scrolls up/down only and never drags the page with it.
          <motion.ul initial={{ opacity: 0, transform: 'translateY(-4px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}
            className="absolute z-30 mt-1.5 left-0 w-full sm:w-[max(100%,380px)] glass-pop rounded-2xl p-1.5 max-h-80 overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y" style={{ background: 'rgb(var(--surface))' }}>
            {list.map(i => (
              <li key={i.venue + i.symbol}>
                <button type="button" onMouseDown={() => { onChange(i.symbol); setQ(i.symbol); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 min-h-[48px] rounded-xl text-left hover:bg-raised active:bg-raised">
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono font-semibold text-[14px] leading-tight">{i.symbol}</span>
                    <span className="block text-[12px] text-ink3 leading-snug mt-0.5">{i.name}</span>
                  </span>
                  {mine.includes(i.symbol) && <Badge tone="accent" className="shrink-0">traded</Badge>}
                  {i.venue !== 'CFD' && <span className="shrink-0 text-[10.5px] font-medium text-ink3 border border-line2 rounded-full px-2 py-0.5">{i.venue}</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function useSpec(symbol: string, futures: boolean) {
  const overrides = useStore(s => s.overrides);
  const trades = useStore(s => s.trades);
  const ccy = useAccountCcy();
  const rates = useRates();
  return useMemo(() => {
    const spec = specFor(symbol, futures ? undefined : overrides[normalizeSymbol(symbol)], { futures });
    const fx = rate(rates, spec.quote, ccy);
    const uv = unitValue(spec, futures ? {} : measuredUnitValues(trades), fx ?? 1);
    return { spec, uv, fx, ccy, fxMissing: fx == null && spec.quote !== ccy };
  }, [symbol, futures, overrides, trades, ccy, rates]);
}

export function Result({ label, value, sub, big }: { label: string; value: React.ReactNode; sub?: React.ReactNode; big?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="label">{label}</div>
      <div className={cx('num font-semibold mt-1', big ? 'text-3xl tracking-tight' : 'text-lg')}>{value}</div>
      {sub && <div className="text-[11.5px] text-ink3 mt-0.5">{sub}</div>}
    </div>
  );
}

export function SourceNote({ spec, uv, fx, ccy, fxMissing }: ReturnType<typeof useSpec>) {
  return (
    <p className="text-[11.5px] text-ink3 leading-relaxed">
      {uv.source === 'measured'
        ? <>Value per point measured from your own {spec.symbol} fills (includes your broker's contract size and FX conversion).</>
        : <>From contract spec: {spec.venue === 'CFD' ? `${num(spec.contractSize, 0)} units per lot` : `${ccySymbol(spec.quote)}${num(spec.pointValue, spec.pointValue < 10 ? 2 : 0)} per point`}{spec.quote !== ccy && (fx ? `, ${spec.quote}→${ccy} at ${fx.toFixed(5)} (ECB reference)` : '')}.</>}
      {fxMissing && <span className="text-warn"> No {spec.quote}→{ccy} rate available offline; values shown in {spec.quote}.</span>}
      {!spec.known && <span className="text-warn"> Unknown symbol — check the spec in the library tab.</span>}
    </p>
  );
}

