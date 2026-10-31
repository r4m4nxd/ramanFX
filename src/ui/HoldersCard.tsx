import { useEffect, useState } from 'react';
import { Badge, Card } from '@/ui/kit';
import { fundChange, HOLDERS_INDEX_URL, holdersUrl, lastMove, parseHolders, parseMeta, pctText, qty, quarterNote, type HoldersMeta, type HoldersRec } from '@/core/holders';

type Load = { state: 'loading' } | { state: 'none' } | { state: 'ok'; rec: HoldersRec; meta: HoldersMeta | null };
const MD = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const MDY = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', year: '2-digit' });
const md = (d: string) => { const t = Date.parse(`${d.slice(0, 10)}T12:00:00Z`); return Number.isFinite(t) ? MD.format(t) : ''; };
const my = (d: string) => { const t = Date.parse(`${d.slice(0, 10)}T12:00:00Z`); return Number.isFinite(t) ? MDY.format(t).replace(' ', " '") : ''; };
const CHANGE_TONE = { new: 'accent', add: 'profit', cut: 'warn', same: 'neutral' } as const;

function Head({ title, note }: { title: string; note: string }) {
  return <h4 className="text-[13px] font-semibold mt-3 first:mt-0">{title} <span className="text-ink3 font-normal text-[12px]">{note}</span></h4>;
}

/** The stock page's Holders card: 5%+ holders (13D / 13G), insiders and 10% owners (Form 4), top 13F funds (index funds tagged).
 *  Files of tools/holders/holders.py (data branch, daily, served through the /holders rewrite). Renders nothing until they exist. */
export function HoldersCard({ symbol }: { symbol: string }) {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  useEffect(() => {
    let live = true;
    setLoad({ state: 'loading' });
    Promise.all([
      fetch(holdersUrl(symbol), { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null),
      fetch(HOLDERS_INDEX_URL, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([shard, idx]) => {
      if (!live) return;
      const rec = parseHolders(shard, symbol);
      setLoad(rec ? { state: 'ok', rec, meta: parseMeta(idx) } : { state: 'none' });
    });
    return () => { live = false; };
  }, [symbol]);
  if (load.state === 'loading') return <div className="skeleton h-40 rounded-2xl" aria-busy="true" aria-label="Loading holders" />;
  if (load.state === 'none') return null;
  const { rec, meta } = load;
  const note = quarterNote(meta);
  return (
    <Card className="p-4 sm:p-5" aria-label="Holders">
      <h3 className="text-[15px] font-semibold">Holders <span className="text-ink3 font-normal text-[13px]">SEC filings{rec.sharesOut != null ? ` · ${qty(rec.sharesOut)} shares out${rec.sharesOutEnd ? ` (${md(rec.sharesOutEnd)})` : ''}` : ''}</span></h3>

      <Head title="5%+ holders" note="Schedule 13D / 13G" />
      {rec.h5.length ? (
        <ul className="divide-y divide-line/50">
          {rec.h5.map((h, i) => (
            <li key={i} className="py-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px]">
              <span className="font-medium min-w-0">{h.name}</span>
              {h.index && <Badge tone="neutral" className="!h-5 !px-2 !text-[10.5px]">index</Badge>}
              <span className="num font-semibold">{pctText(h.pct)}</span>
              {h.shares != null && <span className="num text-ink2">{qty(h.shares)} sh</span>}
              <span className="text-ink3 text-[12px]">{h.form} {md(h.date)}</span>
              {h.dPct != null && h.since && <span className={`num text-[12px] ${Math.abs(h.dPct) < 0.005 ? 'text-ink3' : h.dPct > 0 ? 'text-profit' : 'text-loss'}`}>{Math.abs(h.dPct) < 0.005 ? 'unchanged' : `${h.dPct > 0 ? '+' : '−'}${Math.abs(h.dPct).toFixed(2)} pt`} since {my(h.since)}</span>}
              {h.url && <a href={h.url} target="_blank" rel="noreferrer noopener" className="text-accent text-[12px]">filing</a>}
            </li>
          ))}
        </ul>
      ) : <p className="text-[13px] text-ink3 mt-1">None on file in the last 3 years.</p>}
      {rec.fell.length > 0 && <p className="text-[12px] text-ink3 mt-1">Fell below 5%: {rec.fell.map(f => `${f.name} ${pctText(f.pct)} (${md(f.date)})`).join(', ')}</p>}

      <Head title="Insiders & 10% owners" note={`Form 4, shares after each person's last filing (last ${meta?.f4Days ?? 180} days)`} />
      {rec.insiders.length ? (
        <ul className="divide-y divide-line/50">
          {rec.insiders.map((i, k) => (
            <li key={k} className="py-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px]">
              <span className="font-medium min-w-0">{i.name}</span>
              <span className="text-ink2">{i.role}</span>
              {i.pct != null && <span className="num font-semibold">{pctText(i.pct)}</span>}
              <span className="num text-ink2">{qty(i.shares)} sh</span>
              <span className="text-ink3 text-[12px]">{lastMove(i) ? `last: ${lastMove(i)} ${md(i.date)}` : `Form 4 ${md(i.date)}`}</span>
            </li>
          ))}
        </ul>
      ) : <p className="text-[13px] text-ink3 mt-1">No Form 4 on file in that window.</p>}

      <Head title="Top funds" note={note || 'Form 13F'} />
      {rec.funds.length ? (
        <>
          <ul className="divide-y divide-line/50">
            {rec.funds.map((f, i) => (
              <li key={i} className="py-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13px]">
                <span className="font-medium min-w-0">{f.name}</span>
                {f.index && <Badge tone="neutral" className="!h-5 !px-2 !text-[10.5px]">index</Badge>}
                {f.pct != null && <span className="num font-semibold">{pctText(f.pct)}</span>}
                <span className="num text-ink2">{qty(f.shares)} sh</span>
                <Badge tone={CHANGE_TONE[f.change]} className="!h-5 !px-2 !text-[10.5px]">{fundChange(f)}</Badge>
              </li>
            ))}
          </ul>
          {rec.exited.length > 0 && <p className="text-[12px] text-ink3 mt-1">Exited since the quarter before: {rec.exited.join(', ')}</p>}
          {rec.fundsAllPct != null && <p className="text-[12px] text-ink3 mt-1">All 13F filers together hold {pctText(rec.fundsAllPct)}.</p>}
        </>
      ) : <p className="text-[13px] text-ink3 mt-1">No 13F data for it yet.</p>}
      <p className="text-[11.5px] text-ink3 mt-3 leading-relaxed">
        A 13F is filed up to {meta?.lagDays ?? 45} days after the quarter end: newer buying or selling is not in it. Index funds (Vanguard, BlackRock, State Street, Geode ...) track an index and are marked, never an alert. 5%+ holders and insiders come from 13D / 13G and Form 4 filings, refreshed daily. Context, not a signal. Not advice.
      </p>
    </Card>
  );
}
