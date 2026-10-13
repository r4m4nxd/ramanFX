import { AnimatePresence, motion } from 'framer-motion';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/data/store';
import { useFiltered } from '@/data/derived';
import { alignmentPlays, ALIGN_MATRIX, TIMEFRAME_COMBOS, ZONE_CONFIRM } from '@/core/playbook';
import { groupStats } from '@/core/stats';
import type { Trend } from '@/core/types';
import { pct, rMult, tone, useMoney } from '@/lib/format';
import { Badge, Bar, Card, CardHead, cx, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

const CHECKS = [
  { id: 'departure', label: 'Departure candle is 2×+ the base candle size', group: 'Zone quality' },
  { id: 'fresh', label: 'Zone is WOW / Fresh / PCP near a trendline', group: 'Zone quality' },
  { id: 'tlbreak', label: 'Trendline broken by a long OHLC candle closing the other side', group: 'Trendline' },
  { id: 'removed', label: 'Break removed 2+ opposite zones', group: 'Trendline' },
  { id: 'neartl', label: 'Zone sits under the TL (sell) / over the TL (buy)', group: 'Trendline' },
  { id: 'curve', label: 'Buying in the low curve near demand / selling in the high curve near supply', group: 'Location' },
  { id: 'htf', label: 'HTF / ITF / ETF trends match a row in the alignment matrix', group: 'Alignment' },
  { id: 'pair', label: 'Timeframe combination identified before the impulse entry', group: 'Alignment' },
  { id: 'cp', label: 'Fewer than 3 CP levels formed (trend still valid)', group: 'Risk' },
  { id: 'sl', label: 'SL 10–15 pips beyond the valley (buy) / peak (sell)', group: 'Risk' },
  { id: 'confirm', label: 'Confirmation present (everything non-WOW needs it)', group: 'Risk' },
];
const RULES = [
  'Departure candles more than 2× the size of base candles.',
  'Trendline broken with a long OHLC candle closing on the other side, removing 2+ opposite zones.',
  'Buy in the low curve near demand; sell in the high curve near supply.',
  'Stop loss 10–15 pips below the valley for buys, above the peak for sells.',
  'Read HTF, ITF and ETF trend and take only the play the alignment matrix gives.',
  'Keep zones near the trendline — under it for sells, over it for buys.',
  'Only trade WOW zones, Fresh zones and PCP near the trendline. Everything else needs confirmation.',
  'Stop entering after 3 CP levels have formed — the trend may reverse.',
  'Missed the entry from the valley or peak? Look for PCP levels.',
];
const TRENDS: [Trend, string, string][] = [['up', '↑', 'Uptrend'], ['down', '↓', 'Downtrend'], ['side', '✖', 'Sideways']];

export default function Playbook() {
  const pb = useStore(s => s.playbook);
  const setPb = useStore(s => s.setPlaybook);
  const notes = useStore(s => s.notes);
  const et = useFiltered();
  const fmt = useMoney();
  const pair = Math.min(pb.pair ?? 3, TIMEFRAME_COMBOS.length - 1);
  const combo = TIMEFRAME_COMBOS[pair];
  const trend = (pb.trend ?? {}) as { htf?: Trend | null; itf?: Trend | null; etf?: Trend | null };
  const plays = alignmentPlays(trend, combo);
  const checks = pb.checks ?? {};
  const done = CHECKS.filter(c => checks[c.id]).length;
  const grade = done === CHECKS.length ? ['A+ setup', 'profit'] : done / CHECKS.length >= 0.8 ? ['High probability', 'profit'] : done / CHECKS.length >= 0.55 ? ['Needs confirmation', 'warn'] : ['Skip it', 'loss'];

  // Did trades that matched the matrix do better? Uses the alignment saved on each trade.
  const adherence = useMemo(() => groupStats(et, t => {
    const a = notes[t.id]?.align;
    if (!a?.htf || !a.itf || !a.etf) return null;
    const ps = alignmentPlays(a, TIMEFRAME_COMBOS[a.combo ?? 3]) ?? [];
    return ps.some(p => p.dir === (t.type === 'buy' ? 'long' : 'short')) ? 'Followed the matrix' : 'Against the matrix';
  }), [et, notes]);

  const setTrend = (k: 'htf' | 'itf' | 'etf', v: Trend | null) => setPb({ ...pb, trend: { ...trend, [k]: v } });

  return (
    <Page>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start">
        <Card className="xl:col-span-3">
          <CardHead title="Trend alignment" sub="Pick your entry timeframe, mark each trend, get the play" right={<button className="btn h-8 text-xs" onClick={() => setPb({ ...pb, trend: {} })}>Clear</button>} />
          <div className="flex flex-wrap gap-1.5 mb-4">
            {TIMEFRAME_COMBOS.map((c, i) => (
              <button key={i} onClick={() => setPb({ ...pb, pair: i })} className={cx('h-8 px-3 rounded-lg border text-[13px] font-medium transition-colors', i === pair ? 'bg-accent/15 border-accent text-accent' : 'border-line2 text-ink2 hover:bg-raised')}>ETF {c.etf}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {(['htf', 'itf', 'etf'] as const).map(k => (
              <div key={k} className="rounded-xl bg-raised p-3 text-center">
                <div className="label">{k.toUpperCase()}</div>
                <div className={cx('text-2xl font-bold mt-1 mb-3', k === 'htf' ? 'text-violet' : k === 'etf' ? 'text-accent' : 'text-ink')}>{combo[k]}</div>
                <div className="flex gap-1">
                  {TRENDS.map(([v, sym, title]) => {
                    const on = trend[k] === v;
                    return (
                      <motion.button key={v} whileTap={{ scale: 0.92 }} title={title} aria-label={`${k.toUpperCase()} ${title}`} aria-pressed={on} onClick={() => setTrend(k, on ? null : v)}
                        className={cx('flex-1 h-10 rounded-lg border text-base font-bold transition-colors', on ? (v === 'up' ? 'border-profit text-profit bg-profit/10' : v === 'down' ? 'border-loss text-loss bg-loss/10' : 'border-ink2 bg-surface') : 'border-line2 text-ink3 hover:text-ink2')}>{sym}</motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 min-h-[76px]">
            <AnimatePresence mode="wait">
              <motion.div key={JSON.stringify([plays, pair])} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                {plays === null ? <div className="p-4 rounded-xl bg-raised text-sm text-ink3">Mark the HTF, ITF and ETF trend to see the play.</div>
                  : plays.length === 0 ? <div className="p-4 rounded-xl border border-line2 text-sm"><b className="text-loss">No trade.</b> <span className="text-ink2">This combination isn't in the matrix — wait for alignment.</span></div>
                  : <div className="flex flex-col gap-2">{plays.map(p => (
                    <div key={p.dir + p.row} className={cx('p-4 rounded-xl border', p.dir === 'long' ? 'border-profit/50 bg-profit/5' : 'border-loss/50 bg-loss/5')}>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cx('font-bold', p.dir === 'long' ? 'text-profit' : 'text-loss')}>{p.dir === 'long' ? '↑ LONG' : '↓ SHORT'}</span>
                        <Badge tone={p.halfRisk ? 'warn' : 'neutral'}>{p.halfRisk ? 'HALF RISK' : 'FULL RISK'}</Badge>
                        {p.setAndForget && <Badge tone="accent">SET & FORGET OK</Badge>}
                        <Link to="/calculator" className="ml-auto text-xs text-accent inline-flex items-center gap-1"><Icon name="calculator" size={13} />Size it</Link>
                      </div>
                      <p className="text-sm text-ink2 mt-1.5 leading-relaxed">{p.text}</p>
                    </div>
                  ))}</div>}
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>

        <Card className="xl:col-span-2">
          <CardHead title="Does the matrix pay?" sub="Trades where you recorded the alignment" />
          {adherence.length ? adherence.map(g => (
            <div key={g.key} className="py-3 border-t border-line first:border-0">
              <div className="flex justify-between text-[13px]"><span className={g.key.startsWith('Followed') ? 'text-profit' : 'text-loss'}>{g.key}</span><span className={cx('num font-semibold', tone(g.net))}>{fmt(g.net, { signed: true })}</span></div>
              <div className="text-xs text-ink3 mt-1 num">{g.n} trades · {pct(g.winRate, 0)} win · avg {rMult(g.avgR, 2)}</div>
            </div>
          )) : <p className="text-sm text-ink3 leading-relaxed">Record HTF/ITF/ETF on each trade (Trade view → Playbook alignment). This card then compares trades that followed the matrix with ones that didn't.</p>}
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 items-start">
        <Card className="xl:col-span-3">
          <CardHead title="Pre-trade checklist" sub="Supply & demand + trendline confirmation" right={<button className="btn h-8 text-xs" onClick={() => setPb({ ...pb, checks: {} })}>Reset</button>} />
          <div className="flex items-center gap-3 mb-4">
            <span className={cx('num text-2xl font-semibold', `text-${grade[1]}`)}>{done}/{CHECKS.length}</span>
            <Badge tone={grade[1] as 'profit'}>{grade[0]}</Badge>
            <Bar value={done / CHECKS.length} tone={grade[1] as 'profit'} className="flex-1" />
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6">
            {[...new Set(CHECKS.map(c => c.group))].map(g => (
              <div key={g} className="mb-3">
                <div className="label text-accent mb-1.5">{g}</div>
                {CHECKS.filter(c => c.group === g).map(c => {
                  const on = !!checks[c.id];
                  return (
                    <button key={c.id} role="checkbox" aria-checked={on} onClick={() => setPb({ ...pb, checks: { ...checks, [c.id]: !on } })} className="w-full flex items-start gap-3 py-2 px-1.5 -mx-1.5 rounded-lg text-left hover:bg-raised">
                      <motion.span animate={{ scale: on ? [1, 1.2, 1] : 1 }} className={cx('mt-0.5 w-[18px] h-[18px] rounded-md border grid place-items-center shrink-0', on ? 'bg-accent border-accent text-[#0A0C0F]' : 'border-line2')}>{on && <Icon name="check" size={12} strokeWidth={3} />}</motion.span>
                      <span className={cx('text-[13px] leading-snug', on ? 'text-ink' : 'text-ink2')}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHead title="Rules" />
          <ol className="flex flex-col gap-2">
            {RULES.map((r, i) => <li key={i} className="flex gap-3 p-2.5 rounded-lg bg-raised text-[13px] text-ink2 leading-relaxed"><span className="num text-accent font-semibold">{String(i + 1).padStart(2, '0')}</span>{r}</li>)}
          </ol>
        </Card>
      </div>

      <Card>
        <CardHead title="Alignment reference" sub="Timeframe combinations, zone confirmation map and the full matrix" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-center">
            <tbody>
              {(['etf', 'itf', 'htf'] as const).map(k => (
                <tr key={k}><td className="td text-left font-bold text-accent w-16">{k.toUpperCase()}</td>{TIMEFRAME_COMBOS.map((c, i) => <td key={i} className={cx('td num', k === 'etf' ? 'font-semibold' : 'text-ink2', i === pair && 'bg-accent/10')}>{c[k]}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(ZONE_CONFIRM).map(([z, c]) => <span key={z} className="chip"><b className="text-ink">{z}</b> zone → {c}</span>)}
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          {(['Longs', 'Shorts'] as const).map(side => {
            const w = side === 'Longs' ? '↑' : '↓', a = side === 'Longs' ? '↓' : '↑';
            const f = (xs: string[]) => xs.map(x => (x === 'w' ? w : x === 'a' ? a : '✖')).join(' or ');
            return (
              <div key={side}>
                <div className={cx('label mb-2', side === 'Longs' ? 'text-profit' : 'text-loss')}>{side}</div>
                {ALIGN_MATRIX.map((m, i) => (
                  <div key={i} className="flex flex-wrap gap-x-3 gap-y-1 p-2.5 rounded-lg bg-raised mb-1.5 text-[12.5px]">
                    <span className="num text-ink w-[230px] shrink-0">HTF {f(m.htf)} · ITF {f(m.itf)} · ETF {f(m.etf)}</span>
                    <span className="text-ink2">{m.setAndForget ? `Set & forget at ETF zone / confirmation in ETF zone` : `Confirmation in ${m.zone.toUpperCase()} zone ${m.confirm === 'map' ? 'on the mapped TF' : `on ${m.confirm.toUpperCase()}`}${m.halfRisk ? ', half risk' : ''}`}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </Card>
    </Page>
  );
}
