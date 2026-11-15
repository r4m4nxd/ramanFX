import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHead, cx, Empty, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { useNow } from '@/ui/TradeClock';
import { Lights, MarketDetail, VerdictPill, WatchEditor } from '@/ui/DeskParts';
import { useDesk } from '@/data/desk';
import { clock12, judge, momentOf, nextChance, studyAt, type Verdict } from '@/core/desk';

const when = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? new Intl.DateTimeFormat('en-US', { timeZone: 'America/Edmonton', weekday: 'short', hour: 'numeric', minute: '2-digit' }).format(t) : '–'; };

export default function Desk() {
  const d = useDesk();
  const now = useNow();
  const minute = Math.floor(now.getTime() / 60_000);
  const m = useMemo(() => momentOf(new Date(minute * 60_000)), [minute]);
  const [pick, setPick] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const rows = useMemo(() => d.watch.map(s => d.insts[s]).filter(Boolean).map(i => ({ i, j: judge(i, d.weeks[i.sym], d.fallback, m) })).sort((a, b) => a.j.score - b.j.score || a.i.sym.localeCompare(b.i.sym)), [d.watch, d.insts, d.weeks, d.fallback, m]);
  const missing = d.watch.filter(s => !d.insts[s]);
  const sel = rows.find(r => r.i.sym === pick) ?? rows[0] ?? null;
  const count = (v: Verdict) => rows.filter(r => r.j.verdict === v).length;
  const s = studyAt(m), g = m.closed ? null : d.fallback?.[s.row]?.[s.slot] ?? null;
  const closest = rows.filter(r => r.i.check && r.j.place.light !== 'r').sort((a, b) => a.j.fails.length - b.j.fails.length)[0];
  const tiles: { label: string; value: string; sub: string; tone?: string }[] = [
    { label: 'Calgary time', value: clock12(m.nyMin - m.ahead), sub: `scan from ${when(d.generated)}` },
    { label: 'Forex market', value: m.closed ? 'Closed' : g == null ? '–' : g >= 1.6 ? 'Very busy' : g >= 1.15 ? 'Busy' : g >= 0.7 ? 'Normal' : 'Quiet', sub: m.closed ? `opens Sunday ${clock12(1020 - m.ahead)}` : g == null ? '' : `${g.toFixed(2)}× typical`, tone: m.closed || g == null ? 'text-ink2' : g >= 1.15 ? 'text-profit' : g >= 0.7 ? 'text-warn' : 'text-ink2' },
    { label: 'Ready', value: String(count('ready')), sub: 'rules pass, good time', tone: 'text-profit' },
    { label: 'Close', value: String(count('close')), sub: 'at an area, 3 or fewer rules missing', tone: 'text-warn' },
    ...(closest ? [{ label: 'Closest to a trade', value: closest.i.sym, sub: `${closest.j.fails.length} of your rules still missing` }] : []),
    { label: 'Too late today', value: String(count('done')), sub: 'most of the move is done', tone: 'text-loss' },
  ];

  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Decision desk</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[70ch]">Every market on your list, checked against your own rules with no input from you. Four lights each: is it a good time, is price at an area, do your rules pass, and is there still room in today's move.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px]">
            <Link to="/today" className="text-accent font-medium">Today's plan</Link>
            <Link to="/market-hours" className="text-accent font-medium">Trading clock</Link>
            <Link to="/scanner/fx" className="text-accent font-medium">Forex scanner</Link>
          </div>
        </div>
      </Card>

      {d.state === 'error' && <Card><Empty icon="info" title="Couldn't load the scan" action={<button type="button" onClick={d.retry} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>Check your connection and try again.</Empty></Card>}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
        {tiles.map(t => (
          <div key={t.label} className="rounded-2xl border border-line bg-surface px-3.5 py-3 min-w-0">
            <div className="text-[11.5px] text-ink3">{t.label}</div>
            <div className={cx('text-[20px] font-semibold tracking-tight num mt-0.5 truncate', t.tone)}>{t.value}</div>
            <div className="text-[11.5px] text-ink3 leading-snug">{t.sub}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHead title="Your markets" sub={`${d.watch.length} on your list. Saved with your journal, so it follows you to your phone.`} right={
          <button type="button" onClick={() => setEditing(x => !x)} className="h-9 px-3.5 rounded-full border border-line text-[12.5px] font-semibold inline-flex items-center gap-1.5 hover:bg-raised"><Icon name={editing ? 'check' : 'edit'} size={14} />{editing ? 'Done' : 'Edit list'}</button>} />
        {editing && <div className="mb-4"><WatchEditor watch={d.watch} markets={d.markets} onAdd={d.add} onRemove={d.remove} /></div>}
        <div className="grid gap-5 items-start lg:grid-cols-[minmax(0,1fr)_minmax(0,400px)]">
          <div className="flex flex-col gap-1.5 min-w-0">
            {d.state === 'loading' && !rows.length && <p className="text-[13px] text-ink3">Loading your markets…</p>}
            {rows.map(({ i, j }) => (
              <button key={i.sym} type="button" onClick={() => setPick(i.sym)} aria-pressed={sel?.i.sym === i.sym}
                className={cx('grid grid-cols-[80px_92px_minmax(0,1fr)] items-center gap-2.5 text-left w-full rounded-xl border px-3 py-2.5 hover:bg-raised', sel?.i.sym === i.sym ? 'border-accent' : 'border-line')}>
                <span className="font-bold text-[13.5px] truncate">{i.sym}</span>
                <VerdictPill v={j.verdict} />
                <span className="flex items-center gap-2.5 min-w-0"><Lights j={j} /><span className="text-[12px] text-ink3 truncate max-sm:hidden">{j.why}</span></span>
              </button>
            ))}
            {missing.map(s => <div key={s} className="rounded-xl border border-line px-3 py-2.5 text-[12.5px] text-ink3"><b className="text-ink2">{s}</b> · no scan data for this market yet</div>)}
          </div>
          {sel && <div className="rounded-2xl border border-line p-4 lg:sticky lg:top-4"><MarketDetail i={sel.i} j={sel.j} chance={nextChance(d.weeks[sel.i.sym], d.fallback, m)} /></div>}
        </div>
      </Card>
      <p className="text-[11.5px] text-ink3 px-1 leading-relaxed">The lights follow the scanner's rule checks, built from your lessons, and the market-hours study. They say whether conditions are good, not that a trade will win. Forex, metals, indices and crypto only; stocks are on the Stock scanner. For learning only, not financial advice.</p>
    </Page>
  );
}
