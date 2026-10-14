import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '@/data/derived';
import { useGraded } from '@/data/guru';
import { useStore } from '@/data/store';
import { BE_TABLE, cardOfDay, drills, RULE_CARDS } from '@/core/coach';
import { formation, SD_COMBOS } from '@/core/strategy';
import { COURSE, type Pdf, WHERE } from '@/core/course';
import { monteCarlo } from '@/core/sim';
import { pct, tone, useMoney } from '@/lib/format';
import { Card, CardHead, CountUp, cx, ease, Page, Segmented, spring } from '@/ui/kit';
import { Icon } from '@/ui/Icon';

function StreakMode() {
  const { et, stats } = useAnalytics();
  const fmt = useMoney();
  const recent = [...et].sort((a, b) => b.close.getTime() - a.close.getTime());
  let streak = 0;
  for (const t of recent) { if (t.outcome === 'loss') streak++; else if (t.outcome === 'win') break; }
  // What a normal losing streak looks like at YOUR win rate, from 1,000 simulated runs of your stats.
  const sim = useMemo(() => (stats.total >= 20 ? monteCarlo({ start: 10000, trades: 200, runs: 1000, win: stats.winRate, mode: 'fixed', avgWin: Math.max(1, stats.avgWin), avgLoss: Math.max(1, Math.abs(stats.avgLoss)), riskPct: 0, ruinLevel: -1e12, samples: 0 }) : null), [stats]);
  const p = 1 - stats.winRate;
  const expectMax = stats.total >= 20 && p > 0 && p < 1 ? Math.round(Math.log(200) / -Math.log(p)) : null;
  const ddMed = sim ? [...sim.maxDDs].sort((a, b) => a - b)[500] : null;
  const active = streak >= 3;
  return (
    <Card className={cx(active ? 'border-warn/50' : '', 'luxe-border')}>
      <div className="flex items-start gap-4">
        <div className={cx('w-12 h-12 rounded-2xl grid place-items-center shrink-0', active ? 'bg-warn/15 text-warn' : 'bg-profit/15 text-profit')}><Icon name={active ? 'alert' : 'shield'} size={22} /></div>
        <div className="min-w-0 flex-1">
          <div className="label">Right now</div>
          <div className="text-lg font-semibold mt-0.5">{active ? `${streak} losses in a row. Slow down — don't stop thinking.` : streak ? `${streak} loss${streak > 1 ? 'es' : ''} in a row. Normal.` : 'Last trade was not a loss. Stay patient.'}</div>
          <p className="text-[13px] text-ink2 mt-1.5 leading-relaxed">
            {expectMax ? <>At your {pct(stats.winRate, 0)} win rate, a run of <b className="text-ink">{expectMax} straight losses</b> is expected somewhere in every 200 trades. {ddMed != null && <>Your typical max drawdown over 200 trades is <b className="text-ink">{fmt(ddMed * 10000)}</b> per $10k at this sizing.</>} When it happens, it's the math — not a broken strategy.</> : 'After 20 trades this shows the losing streak and drawdown you should expect at your win rate.'}
          </p>
          {active && (
            <ul className="mt-3 grid sm:grid-cols-3 gap-2 text-[12.5px]">
              {['Drop to half risk until a win', 'Only HIGH-odds setups today', 'No trade within 15 min of a loss'].map(x => <li key={x} className="rounded-lg bg-warn/10 border border-warn/30 px-3 py-2">{x}</li>)}
            </ul>
          )}
        </div>
      </div>
    </Card>
  );
}

function DailyCard() {
  const c = cardOfDay();
  const [i, setI] = useState(RULE_CARDS.indexOf(c));
  const card = RULE_CARDS[i];
  return (
    <Card>
      <div className="flex items-center justify-between mb-3"><div className="label flex items-center gap-1.5"><Icon name="sparkles" size={12} />Rule of the day</div>
        <div className="flex gap-1"><button className="btn-ghost w-8 h-8 px-0" aria-label="Previous rule" onClick={() => setI((i - 1 + RULE_CARDS.length) % RULE_CARDS.length)}><Icon name="chevronLeft" size={15} /></button><button className="btn-ghost w-8 h-8 px-0" aria-label="Next rule" onClick={() => setI((i + 1) % RULE_CARDS.length)}><Icon name="chevronRight" size={15} /></button></div></div>
      <AnimatePresence mode="wait">
        <motion.div key={i} initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3, ease }}>
          <div className="text-[11px] text-accent font-semibold uppercase tracking-wider">{card.topic}</div>
          <div className="text-xl font-semibold tracking-tight mt-1">{card.title}</div>
          <p className="text-[14px] text-ink2 mt-2 leading-relaxed">{card.body}</p>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function Drills() {
  const all = useMemo(() => drills(), []);
  const [order] = useState(() => [...all.keys()].sort(() => Math.random() - 0.5));
  const [k, setK] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const d = all[order[k % order.length]];
  const answer = (a: string) => { if (pick) return; setPick(a); setScore(s => ({ right: s.right + (a === d.answer ? 1 : 0), total: s.total + 1 })); };
  return (
    <Card>
      <CardHead title="Odds drill" sub="Grade the setup the way the playbook would" right={<span className="num text-sm text-ink3">{score.right}/{score.total}</span>} />
      <AnimatePresence mode="wait">
        <motion.div key={k} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25, ease }}>
          <div className="rounded-xl bg-raised/60 border border-line p-4">
            <div className="text-[12px] text-ink3 mb-2">{d.plan.method === 'sf' ? 'Set & forget' : 'Confirmation'} · {d.plan.side === 'buy' ? 'Long' : 'Short'} · {formation(d.plan.kind, d.plan.side)} · {SD_COMBOS[d.plan.combo].etf}→{SD_COMBOS[d.plan.combo].htf}</div>
            <ul className="flex flex-col gap-1.5">{d.prompt.map(p => <li key={p} className="text-[14px] flex gap-2"><span className="text-accent">•</span>{p}</li>)}</ul>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {(['HIGH ODDS', 'LOW ODDS', 'NO TRADE'] as const).map(a => {
              const right = pick && a === d.answer, wrong = pick === a && a !== d.answer;
              return <motion.button key={a} whileTap={{ scale: 0.96 }} onClick={() => answer(a)} animate={wrong ? { x: [0, -6, 6, -3, 0] } : {}} transition={{ duration: 0.3 }}
                className={cx('h-12 rounded-xl border text-[12.5px] font-bold transition-colors', right ? 'border-profit bg-profit/15 text-profit' : wrong ? 'border-loss bg-loss/15 text-loss' : 'border-line bg-raised/40 hover:border-line2')}>{a}</motion.button>;
            })}
          </div>
          <AnimatePresence>
            {pick && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0 }} className="overflow-hidden">
                <div className={cx('mt-3 rounded-xl p-3 text-[13px]', pick === d.answer ? 'bg-profit/10' : 'bg-loss/10')}><b>{pick === d.answer ? 'Correct.' : `It's ${d.answer}.`}</b> {d.why}</div>
                <button className="btn-primary w-full h-11 mt-3" onClick={() => { setPick(null); setK(x => x + 1); }}>Next setup<Icon name="chevronRight" size={15} /></button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function Returns() {
  const a = useAnalytics();
  const fmt = useMoney();
  const bal = a.balance;
  const first = bal[0], last = bal[bal.length - 1];
  const days = first && last ? (last.t - first.t) / 86_400_000 : 0;
  // Return on money deposited (time-weighted would need cash-flow dates; this is the simple, honest version).
  const deposited = last?.deposits ?? 0;
  const ret = deposited > 0 && last ? (last.balance - deposited) / deposited : null;
  // Annualising a few months exaggerates both ways; only do it with six months of history.
  const annual = ret != null && days >= 180;
  const yearly = ret == null || days < 30 ? null : annual ? Math.pow(1 + ret, 365 / days) - 1 : ret;
  const bands = [{ to: 0, label: 'Below breakeven', tone: 'loss' }, { to: 0.08, label: 'Breakeven — the year-one goal', tone: 'warn' }, { to: 0.2, label: 'Beating the S&P 500', tone: 'profit' }, { to: 0.3, label: 'Incredible', tone: 'profit' }, { to: Infinity, label: 'Exceptional — check your risk', tone: 'accent' }];
  const band = yearly == null ? null : bands.find(b => yearly < b.to);
  return (
    <Card>
      <CardHead title="Realistic returns" sub="Measured against what the course calls realistic, not against social media" />
      {yearly == null ? <p className="text-sm text-ink3">Needs account balance history (import a report with a summary) and a month of trading.</p> : (<>
        <div className="flex items-baseline gap-3"><CountUp value={yearly * 100} format={v => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} className={cx('num text-4xl font-semibold tracking-tight', tone(yearly))} /><span className="text-sm text-ink3">{annual ? 'a year' : `in ${Math.round(days)} days`}, on {fmt(deposited)} deposited</span></div>
        <div className={cx('text-[13px] font-semibold mt-1', `text-${band!.tone}`)}>{band!.label}</div>
        <div className="relative h-3 rounded-full mt-5 overflow-hidden flex">
          <div className="bg-loss/40 flex-[2]" /><div className="bg-warn/40 flex-[0.8]" /><div className="bg-profit/40 flex-[1.2]" /><div className="bg-profit/70 flex-[1]" /><div className="bg-accent/50 flex-[1]" />
          <motion.span className="absolute top-1/2 w-4 h-4 -mt-2 -ml-2 rounded-full bg-ink border-2 border-surface shadow-pop" initial={{ left: '0%' }} animate={{ left: `${Math.max(2, Math.min(98, ((Math.max(-0.4, Math.min(0.4, yearly)) + 0.4) / 0.8) * 100))}%` }} transition={spring} />
        </div>
        <div className="flex justify-between text-[10.5px] text-ink3 mt-1.5 num"><span>−40%</span><span>0</span><span>8–10% S&P</span><span>30%</span><span>40%+</span></div>
      </>)}
      <div className="mt-5 pt-4 border-t border-line">
        <div className="label mb-2">Breakeven win rate (risk : reward)</div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-center">
          {BE_TABLE.slice(4).map(([r, w]) => <div key={`${r}${w}`} className="rounded-lg bg-raised p-2"><div className="text-[10.5px] text-ink3 num">{r}:{w}</div><div className="num text-[13px] font-semibold">{Math.round((r / (r + w)) * 100)}%</div></div>)}
        </div>
      </div>
    </Card>
  );
}

function Library() {
  const topics = [...new Set(RULE_CARDS.map(r => r.topic))];
  const [t, setT] = useState(topics[0]);
  return (
    <Card>
      <CardHead title="The playbook, in one place" sub="Every rule the verdicts cite" />
      <div className="flex flex-wrap gap-1.5 mb-4">{topics.map(x => <button key={x} onClick={() => setT(x)} className={cx('chip', t === x && 'border-accent text-accent bg-accent/10')}>{x}</button>)}</div>
      <div className="grid sm:grid-cols-2 gap-2">
        {RULE_CARDS.filter(r => r.topic === t).map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="rounded-xl bg-raised/50 border border-line p-3.5">
            <div className="font-semibold text-[14px]">{r.title}</div><p className="text-[13px] text-ink2 mt-1 leading-relaxed">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function Progress() {
  const graded = useGraded();
  const [n, setN] = useState<'20' | '50' | 'all'>('50');
  const xs = [...graded].sort((a, b) => b.t.close.getTime() - a.t.close.getTime()).slice(0, n === 'all' ? undefined : +n);
  const planned = xs.filter(g => g.plan).length;
  const adh = xs.filter(g => g.verdict.adherence != null);
  const avg = adh.length ? adh.reduce((a, g) => a + g.verdict.adherence!, 0) / adh.length : 0;
  const broken = new Map<string, number>();
  for (const g of xs) for (const l of g.verdict.lines) if (l.tone === 'bad') broken.set(l.rule, (broken.get(l.rule) ?? 0) + 1);
  const top = [...broken.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  return (
    <Card>
      <CardHead title="Your discipline" sub="The rules you break most, from your own trades" right={<Segmented label="Window" size="sm" value={n} onChange={setN} options={[{ value: '20', label: 'Last 20' }, { value: '50', label: 'Last 50' }, { value: 'all', label: 'All' }]} />} />
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-raised/60 p-3"><div className="label">Planned</div><div className="num text-2xl font-semibold mt-1">{pct(xs.length ? planned / xs.length : null, 0)}</div><div className="text-[11px] text-ink3">{planned} of {xs.length} trades</div></div>
        <div className="rounded-xl bg-raised/60 p-3"><div className="label">Rules kept</div><div className={cx('num text-2xl font-semibold mt-1', avg >= 80 ? 'text-profit' : avg >= 50 ? 'text-warn' : 'text-loss')}>{avg.toFixed(0)}%</div><div className="text-[11px] text-ink3">average per trade</div></div>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {top.map(([rule, c], i) => (
          <li key={rule} className="text-[13px]">
            <div className="flex justify-between gap-3"><span>{rule}</span><span className="num text-loss font-semibold">{c}×</span></div>
            <div className="h-1.5 rounded-full bg-line mt-1.5 overflow-hidden"><motion.div className="h-full bg-loss/70 rounded-full" initial={{ width: 0 }} animate={{ width: `${(c / top[0][1]) * 100}%` }} transition={{ duration: 0.7, ease, delay: i * 0.05 }} /></div>
          </li>
        ))}
      </ul>
      {!planned && <Link to="/plan/new" className="btn-primary w-full h-11 mt-4"><Icon name="target" size={15} />Plan your next trade</Link>}
    </Card>
  );
}

function Lesson({ l, open, toggle, i }: { l: (typeof COURSE)[number]; open: boolean; toggle: () => void; i: number }) {
  return (
    <motion.li initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i, 20) * 0.015 }} className="border-t border-line first:border-0">
      <button onClick={toggle} aria-expanded={open} className="w-full flex gap-3 py-3 text-left">
        <span className="w-5 h-5 mt-0.5 rounded-full bg-profit/20 text-profit grid place-items-center shrink-0"><Icon name="check" size={11} strokeWidth={3} /></span>
        <div className="min-w-0 flex-1">
          <div className="text-[13.5px] font-medium">{l.slide}</div>
          <div className="text-[12px] text-ink3 mt-0.5">{l.how}</div>
        </div>
        <motion.span animate={{ rotate: open ? 90 : 0 }} className="text-ink3 shrink-0 mt-0.5"><Icon name="chevronRight" size={15} /></motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease }} className="overflow-hidden">
            <div className="ml-8 mb-3 rounded-xl bg-raised/50 border border-line p-3.5">
              <ul className="flex flex-col gap-2">
                {l.notes.map((n, j) => <li key={j} className="flex gap-2 text-[13px] leading-relaxed text-ink2"><span className="w-1.5 h-1.5 rounded-full bg-accent mt-[7px] shrink-0" />{n}</li>)}
              </ul>
              {l.rule && <div className="mt-3 rounded-lg bg-accent/12 text-accent text-[13px] font-semibold px-3 py-2">{l.rule}</div>}
              <div className="flex gap-1.5 flex-wrap mt-3 items-center">
                <span className="text-[11px] text-ink3 mr-1">Used in</span>
                {l.where.split(' ').map(w => <Link key={w} to={WHERE[w].to} className="chip h-7 touch:h-9 text-[11px]">{WHERE[w].label}</Link>)}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function CourseMap() {
  const [pdf, setPdf] = useState<Pdf>('S&D');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<Set<string>>(new Set());
  const ql = q.trim().toLowerCase();
  const xs = COURSE.filter(l => (ql ? [l.slide, l.how, l.topic, l.rule ?? '', ...l.notes].join(' ').toLowerCase().includes(ql) : l.pdf === pdf));
  const topics = [...new Set(xs.map(l => (ql ? `${l.pdf} · ${l.topic}` : l.topic)))];
  const all = xs.length > 0 && xs.every(l => open.has(l.pdf + l.slide));
  const toggle = (k: string) => setOpen(o => { const n = new Set(o); if (n.has(k)) n.delete(k); else n.add(k); return n; });
  return (
    <Card>
      <CardHead title="Course map" sub={`All ${COURSE.length} lessons from your three PDFs as study notes — tap any lesson to open it`} />
      <div className="flex flex-wrap gap-2 items-center mb-3">
        {!ql && <Segmented label="Course" size="sm" value={pdf} onChange={setPdf} options={[{ value: 'S&D', label: 'Supply & demand' }, { value: 'Confirmation', label: 'Confirmation' }, { value: 'Set & Forget', label: 'Set & forget' }]} />}
        <button onClick={() => setOpen(all ? new Set() : new Set(xs.map(l => l.pdf + l.slide)))} className="chip h-8 touch:h-9 text-[12px] ml-auto">{all ? 'Collapse all' : 'Expand all'}</button>
      </div>
      <div className="relative mb-2">
        <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
        <input aria-label="Search the course" className="field pl-9 h-10" placeholder="Search all three PDFs — e.g. curve, distal, breakeven" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {topics.map(t => (
        <div key={t} className="mt-3">
          <div className="label pt-2 pb-1">{t}</div>
          <ol className="flex flex-col">
            {xs.filter(l => (ql ? `${l.pdf} · ${l.topic}` : l.topic) === t).map((l, i) => <Lesson key={l.pdf + l.slide} l={l} i={i} open={open.has(l.pdf + l.slide)} toggle={() => toggle(l.pdf + l.slide)} />)}
          </ol>
        </div>
      ))}
      {!xs.length && <p className="text-sm text-ink3 text-center py-8">Nothing in the PDFs matches "{q}".</p>}
    </Card>
  );
}

export default function Guru() {
  const hasTrades = useStore(s => s.trades.length > 0);
  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Your guru</h2>
        <p className="text-[13px] text-ink3 mt-1">Supply & demand, set & forget and confirmation — taught, tested and checked against every trade you take.</p>
      </motion.div>
      {hasTrades && <StreakMode />}
      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4"><DailyCard /><Drills /></div>
        <div className="flex flex-col gap-4">{hasTrades && <Progress />}<Returns /></div>
      </div>
      <Library />
      <CourseMap />
    </Page>
  );
}
