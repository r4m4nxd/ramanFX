import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, Empty, Page, Segmented } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { filterClusters, holdingsLabel, INSIDERS_URL, parseInsiders, usd, zoneLabel, type Cluster, type InsiderFilter, type InsidersFile } from '@/core/insiders';

type Load = { state: 'loading' } | { state: 'ok'; file: InsidersFile } | { state: 'error' };
const CAL = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Edmonton', weekday: 'short', hour: 'numeric', minute: '2-digit' });
const calgary = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? CAL.format(t) : '–'; };
const MD = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const md = (d: string) => { const t = Date.parse(`${d}T12:00:00Z`); return Number.isFinite(t) ? MD.format(t) : ''; };

function Row({ c }: { c: Cluster }) {
  const [open, setOpen] = useState(false);
  const name = c.universe ? <Link to={`/scanner/${encodeURIComponent(c.sym.replace(/\./g, '-'))}`} className="font-semibold text-ink hover:text-accent">{c.sym}</Link> : <span className="font-semibold">{c.sym || c.name}</span>;
  const span = c.first && c.first !== c.last ? `${md(c.first)}–${md(c.last)}` : md(c.last);
  const h = holdingsLabel(c.lead);
  return (
    <li className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <span aria-label={c.star ? 'star' : 'insider buy'}>{c.star ? '⭐' : '🕵️'}</span>
        {name}
        {c.px != null && <span className="num text-ink2">${c.px.toFixed(2)}</span>}
        <span>{c.kind === 'solo' ? 'big solo buy' : `${c.n} insiders`}</span>
        <span className="num font-semibold">{usd(c.value)}</span>
        {(c.lead.role || h) && <span className="text-ink2">{`${c.lead.role} ${h}`.trim()}</span>}
        {c.strong && <Badge tone="accent" className="!h-5 !px-2 !text-[10.5px]">strong</Badge>}
        {c.zone && <Badge tone={c.zone.where === 'inside' ? 'profit' : 'warn'} className="!h-5 !px-2 !text-[10.5px]">{zoneLabel(c.zone)}</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink3 mt-0.5 pl-6">
        <span className="min-w-0 truncate max-w-[28ch]">{c.name}</span>
        <span>{span}</span>
        <span className="num">score {c.score}</span>
        {c.pe != null && c.pe > 0 && <span className="num">P/E {c.pe.toFixed(0)}</span>}
        {c.erNext && <span>earnings {md(c.erNext)}</span>}
        {c.trend && <span>trend {c.trend}</span>}
        {c.url && <a href={c.url} target="_blank" rel="noreferrer noopener" className="text-accent">SEC filing</a>}
        {c.insiders.length > 0 && <button type="button" onClick={() => setOpen(v => !v)} className="text-accent" aria-expanded={open}>{open ? 'Hide' : 'Who'} ({c.insiders.length})</button>}
      </div>
      {open && (
        <ul className="pl-6 mt-1 text-[12.5px] text-ink2">
          {c.insiders.map((i, k) => (
            <li key={k} className="flex flex-wrap gap-x-2">
              <span className="font-medium text-ink">{i.name}</span><span>{i.role}</span><span className="num">{usd(i.value)}{i.price != null ? ` @ $${i.price.toFixed(2)}` : ''}</span>
              <span>{md(i.date)}</span>{(i.isNew || (i.pct != null && i.pct >= 0.5)) && <span>{i.isNew ? 'new position' : `+${i.pct!.toFixed(0)}%`}</span>}
              {i.repeat && <Badge tone="violet" className="!h-5 !px-2 !text-[10.5px]">repeat</Badge>}
              {i.url && <a href={i.url} target="_blank" rel="noreferrer noopener" className="text-accent">filing</a>}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Insiders() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  const [f, setF] = useState<InsiderFilter>('all');
  useEffect(() => {
    let live = true;
    fetch(INSIDERS_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setLoad({ state: 'ok', file: parseInsiders(js) }); })
      .catch(() => { if (live) setLoad({ state: 'error' }); });
    return () => { live = false; };
  }, [n]);
  const file = load.state === 'ok' ? load.file : null;
  const rows = useMemo(() => (file ? filterClusters(file.clusters, f) : []), [file, f]);
  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Insider buys</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[64ch]">Open-market purchases from SEC Form 4 filings: 2+ insiders buying the same stock within 14 days (3+ = strong), or one CEO / CFO buy of $250k+. Buys under $10k and stocks under $2 are left out. ⭐ = strong cluster with the price inside or near a weekly / monthly demand zone of the stock scanner. Last {file?.days ?? 30} days, Calgary time.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {file ? <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />Updated {calgary(file.generated)}</span> : load.state === 'loading' ? <span>Loading…</span> : null}
            {file && file.coverage.days > 0 && file.coverage.done < file.coverage.days && <span>backfill {file.coverage.done}/{file.coverage.days} days</span>}
            <Link to="/scanner" className="text-accent font-medium">Stock scanner</Link>
          </div>
          <div className="pt-1">
            <Segmented label="Show" size="sm" value={f} onChange={setF} options={[{ value: 'all', label: 'All' }, { value: 'star', label: '⭐ Only' }, { value: 'scanner', label: 'Scanner stocks' }]} />
          </div>
        </div>
      </Card>
      {load.state === 'error' && <Card><Empty icon="info" title="No insider list yet" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>It appears after the first run of the SEC Form 4 job (every 30 min on US weekdays).</Empty></Card>}
      {file && !rows.length && <Card><Empty icon="info" title="Nothing here yet">No cluster matches this filter in the data so far.</Empty></Card>}
      {rows.length > 0 && <Card><ul>{rows.map(c => <Row key={`${c.sym}:${c.kind}:${c.first}`} c={c} />)}</ul></Card>}
      <p className="text-[11.5px] text-ink3 px-1">Score: cluster size (2 → 2, 3 → 3.5, 4+ → 4.5; solo 1) + CEO / CFO 2 (both 3) + other top officer 0.5 + $ vs market cap up to 2 + holdings increase up to 1.5 + inside a W1 / MN / 3M demand 2 (within 5% above: 1) + repeat buyer 0.5. Telegram alerts new ones scoring 5+, at most 6 a day. Context, not a signal. Not advice.</p>
    </Page>
  );
}
