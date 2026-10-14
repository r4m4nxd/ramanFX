import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Bar, BarChart } from 'recharts';
import { excursionMoney, useGraded, type Graded } from '@/data/guru';
import { useStore } from '@/data/store';
import { simulate, type Path } from '@/core/manage';
import { num, pct, tone, useMoney } from '@/lib/format';
import { Card, CardHead, cx, ease, Page, Segmented, Stat, useIsMobile } from '@/ui/kit';
import { ChartTip, useAxisW, useColors } from '@/ui/charts';
import { Icon } from '@/ui/Icon';

const WINDOWS = [['t30m', '+30m'], ['t1h', '+1h'], ['t4h', '+4h'], ['t12h', '+12h'], ['t1d', '+1d'], ['t1w', '+1w']] as const;

function Setup({ have }: { have: number }) {
  return (
    <Card className={cx(!have && 'luxe-border')}>
      <CardHead title={have ? 'Refresh your excursion data' : 'Get exact MAE / MFE for every trade'} sub="Your MT5 report only has entry and exit. These scripts read your broker's own price history." />
      <div className="grid md:grid-cols-2 gap-3">
        {[
          { f: 'RamanFX_Excursions.mq5', t: 'MetaTrader 5', s: 'Tick-exact where your broker keeps ticks. Also exports the stop and target each trade was OPENED with — your true 1R.' },
          { f: 'RamanFX_Excursions.mq4', t: 'MetaTrader 4', s: 'Uses the smallest timeframe with history. MT4 does not store the opening stop.' },
        ].map(x => (
          <a key={x.f} href={`/tools/${x.f}`} download className="rounded-xl border border-line hover:border-accent bg-raised/40 p-4 flex gap-3 items-start transition-colors">
            <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name="download" size={18} /></span>
            <span><span className="font-semibold block">{x.t}</span><span className="font-mono text-[11.5px] text-ink3 block">{x.f}</span><span className="text-[12.5px] text-ink2 block mt-1 leading-relaxed">{x.s}</span></span>
          </a>
        ))}
      </div>
      <ol className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[12.5px]">
        {['In MT5: File → Open Data Folder → MQL5 → Scripts. Put the file there.', 'In the Navigator, right-click Scripts → Refresh. Double-click RamanFX_Excursions (no compiling needed if MetaEditor compiles it on open — press F7 if asked).', 'Drag it onto any chart → OK. An alert shows where it saved the CSV (MQL5\\Files).', 'Back here: Import → drop RamanFX_Excursions.csv. Re-run after each import of new trades.'].map((s, i) => (
          <li key={i} className="rounded-lg bg-raised/60 p-3 flex gap-2"><span className="num text-accent font-semibold">{i + 1}</span><span className="text-ink2 leading-relaxed">{s}</span></li>
        ))}
      </ol>
      <div className="mt-4"><button className="btn-primary" onClick={() => window.dispatchEvent(new Event('rfx:import'))}><Icon name="upload" size={14} />Import the CSV</button></div>
    </Card>
  );
}

type Row = { g: Graded; mfeR: number | null; maeR: number | null; mfe$: number | null; mae$: number | null; capture: number | null; path: Path | null };

export default function Exits() {
  const graded = useGraded();
  const exitData = useStore(s => s.exitData);
  const { from, to } = useStore(s => s.range);
  const fmt = useMoney();
  const c = useColors();
  const yw = useAxisW();
  const mobile = useIsMobile();
  const [unit, setUnit] = useState<'R' | '$'>('R');
  const [split, setSplit] = useState<'all' | 'high' | 'low' | 'none'>('all');

  const rows: Row[] = useMemo(() => graded.filter(g => exitData[g.t.id]).filter(g => { const k = g.t.closeTime.slice(0, 10).replace(/\./g, '-'); return (!from || k >= from) && (!to || k <= to); }).map(g => {
    const e = exitData[g.t.id];
    const m = excursionMoney(e);
    const risk = g.t.risk;
    const mfeR = risk && m.mfe != null ? m.mfe / risk : null, maeR = risk && m.mae != null ? m.mae / risk : null;
    const capture = m.mfe && m.mfe > 0 ? Math.max(0, g.t.net) / m.mfe : null;
    const order = e.minToMfe != null && e.minToMae != null ? e.minToMfe < e.minToMae : null;
    return { g, mfeR, maeR, mfe$: m.mfe, mae$: m.mae, capture, path: mfeR != null && maeR != null && g.t.r != null ? { r: g.t.r, mfe: mfeR, mae: maeR, mfeFirst: order } : null };
  }), [graded, exitData, from, to]);

  const withR = rows.filter(r => r.path);
  const pool = withR.filter(r => split === 'all' || (split === 'none' ? !r.g.eval : r.g.eval?.odds === split));
  const sim = useMemo(() => simulate(pool.map(r => r.path!)), [pool]);
  const best = sim.reduce((a, b) => (b.totalR > a.totalR ? b : a), sim[0]);
  const actual = sim.find(s => s.id === 'actual');
  const timed = rows.filter(r => exitData[r.g.t.id].minToMfe != null).length;
  const winners = rows.filter(r => r.g.t.outcome === 'win' && r.capture != null);
  const avgCapture = winners.length ? winners.reduce((a, r) => a + r.capture!, 0) / winners.length : null;
  const gaveBack = rows.filter(r => r.g.t.outcome === 'loss' && (r.mfeR ?? 0) >= 1);
  const gaveBack$ = gaveBack.reduce((a, r) => a + Math.abs(r.g.t.net), 0);
  const forward = WINDOWS.map(([k, label]) => {
    const xs = rows.filter(r => exitData[r.g.t.id][k] != null);
    const better = xs.filter(r => (exitData[r.g.t.id][k] as number) > (exitData[r.g.t.id].profitPts ?? 0)).length;
    return { label, n: xs.length, better: xs.length ? better / xs.length : null };
  });
  const cap = (v: number | null) => (v == null ? null : unit === 'R' ? Math.min(6, v) : v);
  const scatter = rows.map(r => ({ x: cap(unit === 'R' ? r.maeR : r.mae$), y: cap(unit === 'R' ? r.mfeR : r.mfe$), z: Math.abs(r.g.t.net), win: r.g.t.net >= 0, sym: r.g.t.sym, net: r.g.t.net })).filter(d => d.x != null && d.y != null);

  if (!rows.length) return <Page><Setup have={0} /></Page>;

  return (
    <Page>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Trades with data', `${rows.length}`, `${withR.length} with a known 1R · ${timed} timed`, ''],
          ['Avg capture (winners)', pct(avgCapture, 0), 'Of the best price reached', avgCapture != null && avgCapture < 0.5 ? 'text-warn' : ''],
          ['Losers that were +1R first', `${gaveBack.length}`, gaveBack.length ? `${fmt(gaveBack$)} lost after being 1R up` : 'None', gaveBack.length ? 'text-loss' : 'text-profit'],
          ['Best rule on your trades', best ? best.name : '—', best && actual ? `${best.totalR - actual.totalR >= 0 ? '+' : ''}${(best.totalR - actual.totalR).toFixed(1)}R vs how you traded` : '', 'text-accent'],
        ].map(([l, v, s, cl]) => (
          <Card key={l} className="p-4"><div className="label">{l}</div><div className={cx('num font-semibold mt-1.5 leading-tight', String(v).length > 12 ? 'text-[15px]' : 'text-xl', cl)}>{v}</div><div className="text-[11.5px] text-ink3 mt-1">{s}</div></Card>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-3">
          <CardHead title="Heat vs reward" sub="Each dot is a trade: how far it went against you (x) and for you (y)" right={<Segmented label="Unit" size="sm" value={unit} onChange={setUnit} options={[{ value: 'R', label: 'R' }, { value: '$', label: '$' }]} />} />
          <ResponsiveContainer width="100%" height={mobile ? 260 : 320}>
            <ScatterChart margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid stroke={c.line} />
              <XAxis dataKey="x" type="number" name="MAE" tickFormatter={v => (unit === 'R' ? `${v.toFixed(1)}R` : fmt(v, { compact: true }))} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} domain={[0, 'auto']} />
              <YAxis dataKey="y" type="number" name="MFE" tickFormatter={v => (unit === 'R' ? `${v.toFixed(1)}R` : fmt(v, { compact: true }))} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} width={yw} domain={[0, 'auto']} />
              <ZAxis dataKey="z" range={[18, 140]} />
              {unit === 'R' && <ReferenceLine x={1} stroke={c.loss} strokeDasharray="4 4" label={{ value: '1R stop', fill: c.ink3, fontSize: 10, position: 'insideTopRight' }} />}
              {unit === 'R' && <ReferenceLine y={1} stroke={c.profit} strokeDasharray="4 4" label={{ value: '1:1', fill: c.ink3, fontSize: 10, position: 'insideTopLeft' }} />}
              <Tooltip content={<ChartTip fmt={(v, k) => (k === 'z' ? fmt(v) : unit === 'R' ? `${v.toFixed(2)}R` : fmt(v))} labelFmt={() => 'Trade'} />} />
              <Scatter data={scatter} isAnimationActive animationDuration={800}>
                {scatter.map((d, i) => <Cell key={i} fill={d.win ? c.profit : c.loss} fillOpacity={0.7} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          {unit === 'R' && <p className="text-[11.5px] text-ink3 mt-2">Red dots above the 1:1 line were winners at some point. Dots right of the 1R line went past your initial stop. Values above 6R sit on the edge.</p>}
        </Card>
        <Card className="xl:col-span-2">
          <CardHead title="After you exited" sub="Share of trades where price was further in your favour later" />
          <div className="grid grid-cols-3 gap-2">
            {forward.map((f, i) => (
              <motion.div key={f.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, ease }} className="rounded-xl bg-raised/70 border border-line p-3 text-center">
                <div className="label">{f.label}</div>
                <div className={cx('num text-xl font-semibold mt-1', f.better != null && f.better > 0.5 ? 'text-warn' : '')}>{pct(f.better, 0)}</div>
                <div className="text-[10.5px] text-ink3">{f.n} trades</div>
              </motion.div>
            ))}
          </div>
          <p className="text-[12px] text-ink3 mt-3 leading-relaxed">Above 50% means you usually exit early. That's only a problem on high-odds setups — on low odds, taking 1:1 is the plan.</p>
        </Card>
      </div>

      <Card>
        <CardHead title="Management lab" sub={`Your ${pool.length} trades replayed under each rule from the PDFs. ${timed === 0 ? 'Your CSV has no timing, so whenever a trade touched both +1R and −1R the stop is assumed to have hit first — these are worst-case numbers. Run the RamanFX script for exact ones.' : timed < rows.length ? 'Where the order of highs and lows is unknown, the stop is assumed to hit first (conservative).' : 'Exact: every trade knows whether its best or worst price came first.'}`}
          right={<Segmented label="Trades" size="sm" value={split} onChange={setSplit} options={[{ value: 'all', label: 'All' }, { value: 'high', label: 'High odds' }, { value: 'low', label: 'Low odds' }, { value: 'none', label: 'Unplanned' }]} />} />
        {pool.length ? (<>
          <ResponsiveContainer width="100%" height={mobile ? 220 : 240}>
            <BarChart data={sim} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={c.line} horizontal={false} />
              <XAxis type="number" tickFormatter={v => `${v}R`} tick={{ fontSize: 10.5, fill: c.ink3 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={mobile ? 110 : 170} tick={{ fontSize: mobile ? 10.5 : 12, fill: c.ink2 }} axisLine={false} tickLine={false} />
              <ReferenceLine x={0} stroke={c.line2} />
              <Tooltip content={<ChartTip fmt={v => `${v.toFixed(1)}R`} />} cursor={{ fill: c.a('ink3', 0.08) }} />
              <Bar dataKey="totalR" name="Total" radius={[0, 4, 4, 0]} animationDuration={800}>
                {sim.map(s => <Cell key={s.id} fill={s.id === best?.id ? c.accent : s.totalR >= 0 ? c.profit : c.loss} fillOpacity={s.id === 'actual' ? 0.55 : 0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-2 mt-4">
            {sim.map(s => (
              <div key={s.id} className={cx('rounded-xl border p-3', s.id === best?.id ? 'border-accent bg-accent/10' : 'border-line bg-raised/40')}>
                <div className="text-[13px] font-semibold flex items-center gap-1.5">{s.name}{s.id === best?.id && <Icon name="star" size={12} className="text-accent" fill="currentColor" />}</div>
                <div className="text-[11px] text-ink3">{s.desc}</div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <Stat label="Total" value={`${s.totalR >= 0 ? '+' : ''}${s.totalR.toFixed(1)}R`} className={tone(s.totalR)} />
                  <Stat label="Avg" value={`${s.avgR.toFixed(2)}R`} className={tone(s.avgR)} />
                  <Stat label="Win" value={pct(s.winRate, 0)} />
                </div>
              </div>
            ))}
          </div>
        </>) : <p className="text-sm text-ink3 py-6 text-center">{split === 'all' ? 'Needs trades with a known initial stop (run the MT5 script, or set the initial risk on the trade).' : 'No trades in this group yet — grade trades in the Planner to split by odds.'}</p>}
      </Card>

      <Card className={mobile ? 'px-4 py-1' : 'p-0 overflow-hidden'}>
        {mobile ? (
          <ul>{[...rows].reverse().slice(0, 200).map(r => (
            <li key={r.g.t.id} className="py-3 border-t border-line first:border-0">
              <Link to={`/trades/${r.g.t.id}`} className="flex items-baseline justify-between gap-3"><span className="font-mono font-semibold">{r.g.t.sym} <span className="font-sans font-normal text-ink3 text-xs">{r.g.t.closeTime.slice(0, 10)}</span></span><span className={cx('num font-semibold', tone(r.g.t.net))}>{fmt(r.g.t.net, { signed: true })}</span></Link>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <Stat label="MAE" value={r.maeR != null ? `${r.maeR.toFixed(2)}R` : fmt(r.mae$ ?? null)} className="text-loss" />
                <Stat label="MFE" value={r.mfeR != null ? `${r.mfeR.toFixed(2)}R` : fmt(r.mfe$ ?? null)} className="text-profit" />
                <Stat label="Result" value={r.g.t.r != null ? `${r.g.t.r.toFixed(2)}R` : '—'} className={tone(r.g.t.r)} />
                <Stat label="Captured" value={pct(r.capture, 0)} />
              </div>
            </li>
          ))}</ul>
        ) : (
          <table className="w-full">
            <thead className="bg-raised/50"><tr className="[&>th]:pt-3 [&>th:first-child]:pl-5 [&>th:last-child]:pr-5"><th className="th">Trade</th><th className="th text-right">MAE</th><th className="th text-right">MFE</th><th className="th text-right">Result</th><th className="th text-right">Captured</th><th className="th text-right">Data</th><th className="th text-right">Net</th></tr></thead>
            <tbody>
              {[...rows].reverse().slice(0, 300).map(r => (
                <tr key={r.g.t.id} className="[&>td:first-child]:pl-5 [&>td:last-child]:pr-5 hover:bg-raised/50">
                  <td className="td"><Link to={`/trades/${r.g.t.id}`} className="font-mono hover:text-accent inline-block py-2 -my-2">{r.g.t.sym}</Link> <span className="text-ink3 text-xs">{r.g.t.closeTime.slice(0, 10)}</span></td>
                  <td className="td num text-right text-loss">{r.maeR != null ? `${r.maeR.toFixed(2)}R` : fmt(r.mae$ ?? null)}</td>
                  <td className="td num text-right text-profit">{r.mfeR != null ? `${r.mfeR.toFixed(2)}R` : fmt(r.mfe$ ?? null)}</td>
                  <td className={cx('td num text-right', tone(r.g.t.r))}>{r.g.t.r != null ? `${r.g.t.r.toFixed(2)}R` : '—'}</td>
                  <td className="td num text-right">{pct(r.capture, 0)}</td>
                  <td className="td text-right text-xs text-ink3">{exitData[r.g.t.id].source ?? 'CSV'}</td>
                  <td className={cx('td num text-right font-semibold', tone(r.g.t.net))}>{fmt(r.g.t.net, { signed: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <Setup have={rows.length} />
      <p className="text-[11.5px] text-ink3 text-center">{num(rows.length, 0)} positions with excursion data.</p>
    </Page>
  );
}
