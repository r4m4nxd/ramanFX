import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_RISK_RULES, useStore } from '@/data/store';
import { LIBRARY, measuredUnitValues, positionSize, specFor, type InstrumentSpec } from '@/core/instruments';
import type { AssetClass } from '@/core/library';
import { ccySymbol, money, num, price } from '@/lib/format';
import { Badge, Card, CardHead, CountUp, cx, Field, InfoTip, Page, Segmented, Stat, useIsMobile, useScrollLock } from '@/ui/kit';
import { Result, SourceNote, SymbolPicker, usePersisted, useSpec } from './calcShared';
import { DrawdownCalc, GrowthCalc, LevelsCalc, MarginCalc, PnlCalc, RRCalc } from './CalcTools';
import { ConverterCalc, MonteCarloCalc, OptionsCalc, PropCalc } from './CalcTools2';
import { Icon } from '@/ui/Icon';

type Tab = 'size' | 'value' | 'pnl' | 'margin' | 'rr' | 'growth' | 'dd' | 'mc' | 'prop' | 'options' | 'levels' | 'library' | 'fx';

function SizeCalc() {
  const accounts = useStore(s => s.accounts);
  const active = useStore(s => s.activeAccount);
  const rules = { ...DEFAULT_RISK_RULES, ...useStore(s => s.riskRules) };
  const snapBal = (active !== 'all' ? accounts[active]?.snapshot?.balance : Object.values(accounts)[0]?.snapshot?.balance) ?? null;
  const [futures, setFuturesRaw] = usePersisted('rfx_calc_size_futures', false);
  const [symbol, setSymbol] = usePersisted('rfx_calc_size_symbol', 'XAUUSD');
  const setFutures = (f: boolean) => { if (f !== futures) { setFuturesRaw(f); setSymbol(f ? 'MES' : 'XAUUSD'); } };
  const [balance, setBalance] = useState<string>(snapBal ? String(snapBal) : '10000');
  const [mode, setMode] = usePersisted<'pct' | 'amt'>('rfx_calc_size_mode', 'pct');
  const [riskPct, setRiskPct] = usePersisted('rfx_calc_size_riskPct', String(rules.riskPercent ?? 1));
  const [riskAmt, setRiskAmt] = usePersisted('rfx_calc_size_riskAmt', '100');
  const [entry, setEntry] = usePersisted('rfx_calc_size_entry', '');
  const [stopMode, setStopMode] = usePersisted<'price' | 'pips'>('rfx_calc_size_stopMode', 'pips');
  const [stop, setStop] = usePersisted('rfx_calc_size_stop', '');
  const [stopPips, setStopPips] = usePersisted('rfx_calc_size_stopPips', '30');
  const [side, setSide] = usePersisted<'buy' | 'sell'>('rfx_calc_size_side', 'buy');
  const mobile = useIsMobile();
  const s = useSpec(symbol, futures);
  const { spec, uv, ccy } = s;

  const riskBudget = mode === 'pct' ? (+balance || 0) * (+riskPct || 0) / 100 : +riskAmt || 0;
  const e = +entry || 0;
  const dist = stopMode === 'pips' ? (+stopPips || 0) * spec.pipSize : e && +stop ? Math.abs(e - +stop) : 0;
  const stopPrice = stopMode === 'pips' && e ? (side === 'buy' ? e - dist : e + dist) : +stop || null;
  const lotStep = futures ? 1 : 0.01;
  const res = positionSize({ riskAmount: riskBudget, entry: 0, stop: dist, unitValue: uv.value, lotStep, minLot: lotStep });
  const pipVal = uv.value * spec.pipSize;
  const unit = futures ? 'contracts' : 'lots';
  // Your Risk rules cap the answer: the hero is the largest size that obeys BOTH the lot cap and the max risk per trade.
  const lotCapHit = !!res && !futures && rules.maxPositionSizeLots > 0 && res.lots > rules.maxPositionSizeLots;
  const riskCapHit = !!res && rules.maxSingleTradeRisk > 0 && res.riskAtLots > rules.maxSingleTradeRisk + 1e-9;
  const capped = lotCapHit || riskCapHit;
  const perLotRisk = dist * uv.value;
  const riskCapLots = perLotRisk > 0 && rules.maxSingleTradeRisk > 0 ? Math.floor(rules.maxSingleTradeRisk / perLotRisk / lotStep + 1e-9) * lotStep : Infinity;
  const allowed = res ? Math.max(0, Math.min(res.lots, lotCapHit ? rules.maxPositionSizeLots : Infinity, riskCapLots)) : 0;
  const shownLots = capped ? allowed : res?.lots ?? 0;
  const shownRisk = res ? shownLots * perLotRisk : 0;
  const capText = [riskCapHit && `${money(rules.maxSingleTradeRisk, { ccy })} max risk`, lotCapHit && `${rules.maxPositionSizeLots}-lot cap`].filter(Boolean).join(' and ');
  const pipWord = spec.venue === 'CFD' && (spec.assetClass === 'forex' || spec.assetClass === 'metal') ? 'pips' : futures ? 'ticks' : 'points';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
      <Card className="lg:col-span-3">
        <CardHead title="Position size" sub="Lots that risk exactly your budget at your stop — rounded down, never over" right={<Segmented label="Market" size="sm" value={futures ? 'f' : 'c'} onChange={v => setFutures(v === 'f')} options={[{ value: 'c', label: 'Forex / CFD' }, { value: 'f', label: 'Futures' }]} />} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Instrument" hint={spec.name}><SymbolPicker value={symbol} onChange={setSymbol} futures={futures} /></Field>
          <Field label={`Account balance (${ccy})`} hint={snapBal ? 'From your last import' : undefined}><input type="number" inputMode="decimal" className="field num" value={balance} onChange={e => setBalance(e.target.value)} /></Field>
          <Field label="Risk">
            <div className="flex gap-2">
              <Segmented label="Risk mode" size="sm" value={mode} onChange={setMode} options={[{ value: 'pct', label: '%' }, { value: 'amt', label: ccySymbol(ccy).trim() }]} />
              {mode === 'pct'
                ? <input aria-label="Risk percent" type="number" step="0.1" inputMode="decimal" className="field num" value={riskPct} onChange={e => setRiskPct(e.target.value)} />
                : <input aria-label="Risk amount" type="number" inputMode="decimal" className="field num" value={riskAmt} onChange={e => setRiskAmt(e.target.value)} />}
            </div>
          </Field>
          <Field label="Direction"><Segmented label="Direction" value={side} onChange={setSide} options={[{ value: 'buy', label: 'Long' }, { value: 'sell', label: 'Short' }]} /></Field>
          <Field label="Entry price (optional for pip stops)"><input type="number" inputMode="decimal" step="any" className="field num" value={entry} onChange={e => setEntry(e.target.value)} placeholder="e.g. 2654.20" /></Field>
          <Field label="Stop loss">
            <div className="flex gap-2">
              <Segmented label="Stop mode" size="sm" value={stopMode} onChange={setStopMode} options={[{ value: 'pips', label: pipWord }, { value: 'price', label: 'Price' }]} />
              {stopMode === 'pips'
                ? <input aria-label={`Stop in ${pipWord}`} type="number" inputMode="decimal" step="any" className="field num" value={stopPips} onChange={e => setStopPips(e.target.value)} />
                : <input aria-label="Stop price" type="number" inputMode="decimal" step="any" className="field num" value={stop} onChange={e => setStop(e.target.value)} />}
            </div>
          </Field>
        </div>
        <div className="mt-4"><SourceNote {...s} /></div>
      </Card>

      <Card className="lg:col-span-2 lg:sticky lg:top-20">
        <div className="label">{capped ? 'Size within your rules' : 'Size'}</div>
        <div className="flex items-baseline gap-2 mt-1">
          {res ? <CountUp value={shownLots} format={v => v.toFixed(futures ? 0 : 2)} className={cx('num text-5xl font-semibold tracking-tight', res.tooSmall || (capped && allowed <= 0) ? 'text-loss' : 'text-ink')} /> : <span className="num text-5xl font-semibold text-ink3">—</span>}
          <span className="text-ink3">{unit}</span>
        </div>
        {res?.tooSmall && <p className="text-[13px] text-loss mt-2">Budget is below one {futures ? 'contract' : 'minimum lot'} at this stop. Widen the risk or tighten the stop.</p>}
        {capped && res && (
          <p role="status" className="text-[13px] text-warn mt-2 flex items-start gap-1.5"><Icon name="alert" size={14} className="mt-0.5 shrink-0" />
            <span>Your budget gives <span className="num">{res.lots.toFixed(futures ? 0 : 2)}</span> {unit} ({money(res.riskAtLots, { ccy })}), above your {capText} in Risk rules.</span>
          </p>
        )}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-line">
          <Result label="Risk budget" value={money(riskBudget, { ccy })} sub={mode === 'pct' ? `${riskPct}% of balance` : undefined} />
          <Result label="Risk at size" value={res ? money(shownRisk, { ccy }) : '—'} sub={res && riskBudget ? `${((shownRisk / (+balance || 1)) * 100).toFixed(2)}% of balance` : undefined} />
          <Result label={`Stop distance`} value={dist ? `${num(dist / spec.pipSize, 1)} ${pipWord}` : '—'} sub={dist ? `${price(dist, spec.digits)} in price` : undefined} />
          <Result label={`Value per ${pipWord.slice(0, -1)}`} value={money(pipVal * (shownLots || 1), { ccy })} sub={`${money(pipVal, { ccy })} per 1 ${futures ? 'contract' : 'lot'}`} />
        </div>
        {stopPrice != null && e > 0 && dist > 0 && (
          <div className="mt-5 pt-5 border-t border-line">
            <div className="label mb-2">Targets</div>
            <table className="w-full text-[13px]">
              <thead className="pillhead"><tr><th className="th">Level</th><th className="th text-right">Price</th><th className="th text-right">Result</th></tr></thead>
              <tbody>
                <tr><td className="td text-loss">Stop</td><td className="td num text-right">{price(stopPrice, spec.digits)}</td><td className="td num text-right text-loss">{res ? money(-shownRisk, { ccy }) : '—'}</td></tr>
                {[1, 1.5, 2, 3, 4].map(r => {
                  const p = side === 'buy' ? e + dist * r : e - dist * r;
                  return <tr key={r}><td className="td text-profit">{r}R</td><td className="td num text-right">{price(p, spec.digits)}</td><td className="td num text-right text-profit">{res ? money(shownRisk * r, { ccy, signed: true }) : '—'}</td></tr>;
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      {mobile && res && (
        <div role="status" aria-live="polite" className="sticky bottom-[calc(58px+max(12px,env(safe-area-inset-bottom)))] land:!bottom-0 z-10 -mx-1 card shadow-pop px-4 py-2.5 flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5"><span className={cx('num text-2xl font-semibold tracking-tight', res.tooSmall || (capped && allowed <= 0) ? 'text-loss' : 'text-ink')}>{shownLots.toFixed(futures ? 0 : 2)}</span><span className="text-xs text-ink3">{unit}</span></div>
            <div className="text-[11.5px] text-ink3 num truncate">risk {money(shownRisk, { ccy })}{dist ? ` · ${num(dist / spec.pipSize, 1)} ${pipWord}` : ''}</div>
          </div>
          {capped && <Badge tone="warn">Capped by rules</Badge>}
        </div>
      )}
    </div>
  );
}

function ValueCalc() {
  const [futures, setFuturesRaw] = usePersisted('rfx_calc_value_futures', false);
  const [symbol, setSymbol] = usePersisted('rfx_calc_value_symbol', 'EURUSD');
  const setFutures = (f: boolean) => { if (f !== futures) { setFuturesRaw(f); setSymbol(f ? 'ES' : 'EURUSD'); } };
  const [lots, setLots] = usePersisted('rfx_calc_value_lots', '1');
  const [move, setMove] = usePersisted('rfx_calc_value_move', '10');
  const s = useSpec(symbol, futures);
  const { spec, uv, ccy } = s;
  const l = +lots || 0;
  const pipWord = futures ? 'tick' : spec.assetClass === 'forex' || spec.assetClass === 'metal' ? 'pip' : 'point';
  const per = futures ? uv.value * spec.tickSize : uv.value * spec.pipSize;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
      <Card>
        <CardHead title="Pip, tick & point value" right={<Segmented label="Market" size="sm" value={futures ? 'f' : 'c'} onChange={v => setFutures(v === 'f')} options={[{ value: 'c', label: 'Forex / CFD' }, { value: 'f', label: 'Futures' }]} />} />
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Instrument"><SymbolPicker value={symbol} onChange={setSymbol} futures={futures} /></Field>
          <Field label={futures ? 'Contracts' : 'Lots'}><input type="number" step={futures ? 1 : 0.01} inputMode="decimal" className="field num" value={lots} onChange={e => setLots(e.target.value)} /></Field>
          <Field label={`Move (${pipWord}s)`}><input type="number" step="any" inputMode="decimal" className="field num" value={move} onChange={e => setMove(e.target.value)} /></Field>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mt-6">
          <Result big label={`Per ${pipWord}`} value={money(per * l, { ccy })} sub={`${l} ${futures ? 'contract' : 'lot'}${l === 1 ? '' : 's'}`} />
          <Result big label={`${move || 0} ${pipWord}s`} value={money(per * l * (+move || 0), { ccy })} />
          <Result big label="Per 1.0 price move" value={money(uv.value * l, { ccy })} />
        </div>
        <div className="mt-5"><SourceNote {...s} /></div>
      </Card>
      <Card>
        <CardHead title={`${spec.symbol} specification`} sub={spec.name} />
        <dl className="text-[13px]">
          {([
            ['Venue', spec.venue === 'CFD' ? 'Spot / CFD (broker)' : spec.venue],
            ['Asset class', spec.assetClass],
            ['Quote currency', spec.quote],
            [spec.venue === 'CFD' ? 'Contract size (1 lot)' : 'Contract', spec.venue === 'CFD' ? num(spec.contractSize, 0) : (LIBRARY.find(i => i.venue !== 'CFD' && i.symbol === spec.symbol)?.unit ?? '—')],
            ['Pip / point size', String(spec.pipSize)],
            ['Tick size', String(spec.tickSize)],
            ['Tick value (quote ccy)', `${ccySymbol(spec.quote)}${num(spec.pointValue * spec.tickSize, spec.pointValue * spec.tickSize < 1 ? 4 : 2)}`],
            ['Pip value per lot (quote ccy)', `${ccySymbol(spec.quote)}${num(spec.pointValue * spec.pipSize, 2)}`],
          ] as [string, string][]).map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-2 border-t border-line first:border-0"><dt className="text-ink2">{k}</dt><dd className="num text-right capitalize">{v}</dd></div>)}
        </dl>
      </Card>
    </div>
  );
}

const CLASSES: (AssetClass | 'all')[] = ['all', 'forex', 'metal', 'index', 'energy', 'crypto', 'rates', 'agri', 'softs', 'livestock', 'volatility'];

function Library() {
  const [q, setQ] = useState('');
  const [cls, setCls] = useState<AssetClass | 'all'>('all');
  const [venue, setVenue] = useState<'cfd' | 'fut'>('cfd');
  const trades = useStore(s => s.trades);
  const overrides = useStore(s => s.overrides), setOverride = useStore(s => s.setOverride);
  const measured = useMemo(() => measuredUnitValues(trades), [trades]);
  const mine = Object.keys(measured);
  const [edit, setEdit] = useState<string | null>(null);
  const mobile = useIsMobile();
  const [mLimit, setMLimit] = useState(60);
  const rows = useMemo(() => {
    const ql = q.trim().toUpperCase();
    const list = LIBRARY.filter(i => (venue === 'cfd' ? i.venue === 'CFD' : i.venue !== 'CFD') && (cls === 'all' || i.assetClass === cls) && (!ql || i.symbol.includes(ql) || i.name.toUpperCase().includes(ql) || i.aliases?.some(a => a.includes(ql))));
    // Symbols you trade that aren't in the library still get a row.
    if (venue === 'cfd') for (const m of mine) if (!LIBRARY.some(i => i.symbol === m) && (!ql || m.includes(ql))) list.unshift({ symbol: m, name: 'From your trades', assetClass: 'other', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01 });
    return list;
  }, [q, cls, venue, mine]);
  const spec = (sym: string): InstrumentSpec => (venue === 'fut' ? specFor(sym, undefined, { futures: true }) : specFor(sym, overrides[sym]));

  return (
    <Card className="p-0 overflow-hidden">
      <div className="p-4 flex flex-wrap gap-2 items-center border-b border-line">
        <div className="relative w-full md:w-auto md:flex-1 md:min-w-[200px]">
          <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
          <input aria-label="Search instruments" className="field pl-9" placeholder={`Search ${LIBRARY.length} instruments`} value={q} onChange={e => setQ(e.target.value)} />
        </div>
        <Segmented label="Venue" size="sm" value={venue} onChange={setVenue} options={[{ value: 'cfd', label: 'Forex / CFD' }, { value: 'fut', label: 'Futures' }]} />
        <select aria-label="Asset class" className="field w-auto flex-1 md:flex-none capitalize" value={cls} onChange={e => setCls(e.target.value as AssetClass | 'all')}>
          {CLASSES.map(c => <option key={c} value={c}>{c === 'all' ? 'All classes' : c}</option>)}
        </select>
      </div>
      {mobile ? (
        <ul className="flex flex-col px-4">
          {rows.slice(0, mLimit).map(i => {
            const sp = spec(i.symbol);
            const m = measured[i.symbol];
            const step = venue === 'fut' ? sp.tickSize : sp.pipSize;
            const v = sp.pointValue * step;
            return (
              <li key={i.venue + i.symbol} className="py-3 border-t border-line first:border-0">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-mono font-semibold text-[14px]">{i.symbol}{overrides[i.symbol] && <Badge tone="violet" className="ml-1.5">edited</Badge>}</div>
                    <div className="text-[12px] text-ink3 truncate">{i.name} · <span className="capitalize">{venue === 'fut' ? i.venue : i.assetClass}</span></div>
                  </div>
                  {venue === 'cfd' && <button className="btn-ghost h-8 w-8 px-0 -mr-1" aria-label={`Edit ${i.symbol} spec`} onClick={() => setEdit(i.symbol)}><Icon name="edit" size={14} /></button>}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Stat label={venue === 'fut' ? 'Contract' : 'Lot size'} value={venue === 'fut' ? i.unit : num(sp.contractSize, sp.contractSize < 10 ? 2 : 0)} />
                  <Stat label={venue === 'fut' ? 'Tick' : 'Pip'} value={step} />
                  <Stat label={venue === 'fut' ? 'Tick value' : 'Pip / lot'} value={`${ccySymbol(sp.quote)}${num(v, v < 1 ? 4 : 2)}`} />
                </div>
                {venue === 'cfd' && m ? <div className="text-[11.5px] text-ink3 mt-1.5">Measured from your trades: <span className="num text-ink2">{money(m * sp.pipSize)}</span> per pip per lot</div> : null}
              </li>
            );
          })}
          {rows.length > mLimit && <li className="py-3 border-t border-line"><button className="btn w-full h-11" onClick={() => setMLimit(l => l + 60)}>Show more ({rows.length - mLimit} left)</button></li>}
        </ul>
      ) : (
      <div className="overflow-y-auto max-h-[70vh]">
        <table className="w-full">
          <thead className="sticky top-0 bg-surface z-10"><tr className="[&>th]:pt-3 [&>th:first-child]:pl-5 [&>th:last-child]:pr-5">
            <th className="th">Symbol</th><th className="th">Name</th><th className="th">{venue === 'fut' ? 'Exchange' : 'Class'}</th><th className="th text-right">{venue === 'fut' ? 'Contract' : 'Lot size'}</th>
            <th className="th text-right">{venue === 'fut' ? 'Tick' : 'Pip'}</th><th className="th text-right">{venue === 'fut' ? 'Tick value' : 'Pip value / lot'}</th><th className="th text-right">{venue === 'fut' ? 'Point value' : 'Your measured'}</th>
          </tr></thead>
          <tbody>
            {rows.map(i => {
              const sp = spec(i.symbol);
              const m = measured[i.symbol];
              return (
                <tr key={i.venue + i.symbol} className="[&>td:first-child]:pl-5 [&>td:last-child]:pr-5 hover:bg-raised/50">
                  <td className="td font-mono font-medium">{i.symbol}{overrides[i.symbol] && <Badge tone="violet" className="ml-1.5">edited</Badge>}</td>
                  <td className="td text-ink2 max-w-[240px] truncate">{i.name}</td>
                  <td className="td text-ink3 capitalize">{venue === 'fut' ? i.venue : i.assetClass}</td>
                  <td className="td num text-right text-ink2">{venue === 'fut' ? i.unit : num(sp.contractSize, sp.contractSize < 10 ? 2 : 0)}</td>
                  <td className="td num text-right text-ink2">{venue === 'fut' ? sp.tickSize : sp.pipSize}</td>
                  <td className="td num text-right">{ccySymbol(sp.quote)}{num(sp.pointValue * (venue === 'fut' ? sp.tickSize : sp.pipSize), sp.pointValue * (venue === 'fut' ? sp.tickSize : sp.pipSize) < 1 ? 4 : 2)}</td>
                  <td className="td num text-right">
                    {venue === 'fut' ? `${ccySymbol(sp.quote)}${num(sp.pointValue, sp.pointValue < 10 ? 2 : 0)}` : (
                      <span className="inline-flex items-center gap-2 justify-end">
                        {m ? <span title="Your broker's real value per pip per lot, in account currency">{money(m * sp.pipSize)}</span> : <span className="text-ink3">—</span>}
                        <button className="btn-ghost h-7 w-7 touch:h-9 touch:w-9 px-0" aria-label={`Edit ${i.symbol} spec`} onClick={() => setEdit(i.symbol)}><Icon name="edit" size={13} /></button>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
      <AnimatePresence>
        {edit && <OverrideEditor symbol={edit} onClose={() => setEdit(null)} current={overrides[edit]} base={specFor(edit)} onSave={o => { setOverride(edit, o); setEdit(null); }} />}
      </AnimatePresence>
    </Card>
  );
}

function OverrideEditor({ symbol, current, base, onSave, onClose }: { symbol: string; current?: { contractSize?: number; pipSize?: number; tickSize?: number }; base: InstrumentSpec; onSave: (o: { contractSize?: number; pipSize?: number; tickSize?: number } | null) => void; onClose: () => void }) {
  const [cs, setCs] = useState(String(current?.contractSize ?? base.contractSize));
  const [pip, setPip] = useState(String(current?.pipSize ?? base.pipSize));
  const [tick, setTick] = useState(String(current?.tickSize ?? base.tickSize));
  useScrollLock(true);
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label={`Edit ${symbol}`}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <motion.div className="relative card shadow-pop p-5 w-full max-w-sm" initial={{ scale: 0.96, y: 8 }} animate={{ scale: 1, y: 0 }}>
        <h3 className="font-semibold">Edit {symbol} for your broker</h3>
        <p className="text-xs text-ink3 mt-1 mb-4">Check MT5 → Market Watch → right-click → Specification. Your measured value always wins when you've traded it.</p>
        <div className="flex flex-col gap-3">
          <Field label="Contract size (units per 1 lot)"><input className="field num" type="number" step="any" value={cs} onChange={e => setCs(e.target.value)} /></Field>
          <Field label="Pip size (price)"><input className="field num" type="number" step="any" value={pip} onChange={e => setPip(e.target.value)} /></Field>
          <Field label="Tick size (price)"><input className="field num" type="number" step="any" value={tick} onChange={e => setTick(e.target.value)} /></Field>
        </div>
        <div className="flex gap-2 mt-5">
          {current && <button className="btn" onClick={() => onSave(null)}>Reset</button>}
          <button className="btn ml-auto" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave({ contractSize: +cs || undefined, pipSize: +pip || undefined, tickSize: +tick || undefined })}>Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

const PRIMARY: { value: Tab; label: string; short: string }[] = [
  { value: 'size', label: 'Position size', short: 'Size' }, { value: 'value', label: 'Pip value', short: 'Pip value' }, { value: 'pnl', label: 'Profit & loss', short: 'P&L' }, { value: 'rr', label: 'Risk : reward', short: 'R:R' },
];
const MORE: { value: Tab; label: string }[] = [
  { value: 'margin', label: 'Margin' }, { value: 'mc', label: 'Monte Carlo' }, { value: 'dd', label: 'Drawdown' }, { value: 'prop', label: 'Prop firm' },
  { value: 'options', label: 'Options' }, { value: 'growth', label: 'Compounding' }, { value: 'levels', label: 'Pivots & Fib' }, { value: 'fx', label: 'Currency' }, { value: 'library', label: 'Instruments' },
];
const MORE_KEY = '__more';

export default function Calculator() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab') as Tab | null;
  const tab: Tab = raw && (PRIMARY.some(o => o.value === raw) || MORE.some(o => o.value === raw)) ? raw : 'size';
  const mobile = useIsMobile();
  const pick = (v: Tab) => setParams({ tab: v }, { replace: true });
  const inMore = MORE.some(o => o.value === tab);
  return (
    <Page>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <Segmented swap="page" label="Calculator" value={inMore ? (MORE_KEY as Tab) : tab} onChange={pick}
          options={PRIMARY.map(o => ({ value: o.value, label: mobile ? <><span aria-hidden>{o.short}</span><span className="sr-only">{o.label}</span></> : o.label }))} />
        <label className="relative flex-1 sm:flex-none sm:min-w-[200px]">
          <span className="sr-only">More tools</span>
          <select className={cx('field w-full', inMore && 'border-accent text-ink font-semibold')} value={inMore ? tab : ''} onChange={e => e.target.value && pick(e.target.value as Tab)}>
            <option value="">More tools…</option>
            {MORE.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>
      </div>
      {(tab === 'value' || tab === 'library' || tab === 'size' || tab === 'margin') && (
        <span className="text-xs text-ink3 flex items-center gap-1.5 -mt-1">Futures specs from CME, CBOT, NYMEX, COMEX, ICE, Eurex and Cboe<InfoTip text="Broker CFDs vary. When you've traded a symbol, the app uses the value measured from your own fills instead." /></span>
      )}
      {{ size: <SizeCalc />, value: <ValueCalc />, pnl: <PnlCalc />, margin: <MarginCalc />, rr: <RRCalc />, growth: <GrowthCalc />, dd: <DrawdownCalc />, mc: <MonteCarloCalc />, prop: <PropCalc />, options: <OptionsCalc />, levels: <LevelsCalc />, fx: <ConverterCalc />, library: <Library /> }[tab]}
    </Page>
  );
}
