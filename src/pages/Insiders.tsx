import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Card, Empty, Page, Segmented } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ago, filterActivists, filterClusters, filterPlans, filterSales, holdingsLabel, INSIDERS_URL, parseInsiders, usd, zoneLabel, type Activist, type Cluster, type InsiderFilter, type InsidersFile, type Planned, type PlanFilter, type Sale, type SaleFilter } from '@/core/insiders';

type Load = { state: 'loading' } | { state: 'ok'; file: InsidersFile } | { state: 'error' };
const CAL = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Edmonton', weekday: 'short', hour: 'numeric', minute: '2-digit' });
const calgary = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? CAL.format(t) : '–'; };
const MD = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'short', day: 'numeric' });
const md = (d: string) => { const t = Date.parse(`${d.slice(0, 10)}T12:00:00Z`); return Number.isFinite(t) ? MD.format(t) : ''; };
const slug = (s: string) => encodeURIComponent(s.replace(/\./g, '-'));
const sh = (v: number) => (v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(1)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : `${v.toFixed(0)}`);
const pc = (v: number) => (v < 0.01 ? '<0.01' : v < 1 ? v.toFixed(2) : v.toFixed(1));
type Tab = 'buys' | 'sells' | 'plans' | 'activists';

/** The stock's name: a link to its scanner page (and its Holders card) when the scanner covers it. */
function Sym({ sym, name, link }: { sym: string; name: string; link: boolean }) {
  return link && sym ? <Link to={`/scanner/${slug(sym)}`} className="font-semibold text-ink hover:text-accent">{sym}</Link> : <span className="font-semibold">{sym || name}</span>;
}
function Filed({ iso, now }: { iso: string; now: number }) {
  const a = ago(iso, now);
  return a ? <span>filed {a}</span> : null;
}
function SecLink({ url }: { url: string }) {
  return url ? <a href={url} target="_blank" rel="noreferrer noopener" className="text-accent">SEC filing</a> : null;
}

function Row({ c, now }: { c: Cluster; now: number }) {
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
        <span>{c.kind === 'solo' ? 'big solo buy' : c.kind === 'early' ? 'early · 1 insider so far' : `${c.n} insiders`}</span>
        <span className="num font-semibold">{usd(c.value)}</span>
        {(c.lead.role || h) && <span className="text-ink2">{`${c.lead.role} ${h}`.trim()}</span>}
        {c.strong && <Badge tone="accent" className="!h-5 !px-2 !text-[10.5px]">strong</Badge>}
        {c.zone && <Badge tone={c.zone.where === 'inside' ? 'profit' : 'warn'} className="!h-5 !px-2 !text-[10.5px]">{zoneLabel(c.zone)}</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink3 mt-0.5 pl-6">
        <span className="min-w-0 truncate max-w-[28ch]">{c.name}</span>
        <span>{span}</span>
        <Filed iso={c.filed} now={now} />
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

function SaleRow({ r, now }: { r: Sale; now: number }) {
  return (
    <li className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <span aria-hidden="true">🔻</span>
        <Sym sym={r.sym} name={r.name} link />
        {r.price != null && <span className="num text-ink2">${r.price.toFixed(2)}</span>}
        <span><span className="text-ink2">{r.role}</span> {r.who} sold</span>
        <span className="num font-semibold">{usd(r.value)}</span>
        {r.ofMcap != null && <span className="text-ink2 num">{pc(r.ofMcap)}% of cap</span>}
        {r.pct != null && r.pct <= -0.5 && <span className="text-ink2 num">{Math.abs(r.pct).toFixed(0)}% of holdings</span>}
        {r.big && <Badge tone="warn" className="!h-5 !px-2 !text-[10.5px]">big · no plan</Badge>}
        {r.plan && <Badge tone="neutral" className="!h-5 !px-2 !text-[10.5px]">10b5-1 plan</Badge>}
        {r.cover && <Badge tone="neutral" className="!h-5 !px-2 !text-[10.5px]">tax withholding</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink3 mt-0.5 pl-6">
        <span className="min-w-0 truncate max-w-[28ch]">{r.name}</span>
        <span>sold {md(r.date)}</span>
        <Filed iso={r.filed} now={now} />
        {r.shares != null && <span className="num">{sh(r.shares)} sh</span>}
        <SecLink url={r.url} />
      </div>
    </li>
  );
}

function PlanRow({ r, now }: { r: Planned; now: number }) {
  return (
    <li className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <span aria-hidden="true">📋</span>
        <Sym sym={r.sym} name={r.name} link />
        <span><span className="text-ink2">{r.role}</span> {r.who} plans to sell</span>
        {r.value != null && <span className="num font-semibold">{usd(r.value)}</span>}
        {r.shares != null && <span className="num text-ink2">{sh(r.shares)} sh</span>}
        {r.ofMcap != null && <span className="text-ink2 num">{pc(r.ofMcap)}% of cap</span>}
        {r.big && <Badge tone="accent" className="!h-5 !px-2 !text-[10.5px]">big</Badge>}
        {r.plan && <Badge tone="neutral" className="!h-5 !px-2 !text-[10.5px]">10b5-1{r.planDate ? ` · ${md(r.planDate)}` : ''}</Badge>}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink3 mt-0.5 pl-6">
        <span className="min-w-0 truncate max-w-[28ch]">{r.name}</span>
        {r.date && <span>sale about {md(r.date)}</span>}
        <Filed iso={r.filed} now={now} />
        <SecLink url={r.url} />
      </div>
    </li>
  );
}

function ActivistRow({ r, now }: { r: Activist; now: number }) {
  return (
    <li className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <span aria-hidden="true">📣</span>
        <Sym sym={r.sym} name={r.name} link={r.universe} />
        <span>{r.who}</span>
        {r.pct != null && <span className="num font-semibold">{r.pct.toFixed(1)}%</span>}
        {r.prevPct != null && r.pct != null && Math.abs(r.pct - r.prevPct) >= 0.05 && <span className="num text-ink2">from {r.prevPct.toFixed(1)}%</span>}
        {r.shares != null && <span className="num text-ink2">{sh(r.shares)} sh</span>}
        <Badge tone={r.form.endsWith('/A') ? 'neutral' : 'violet'} className="!h-5 !px-2 !text-[10.5px]">{r.form.replace('SCHEDULE ', '')}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-ink3 mt-0.5 pl-6">
        <span className="min-w-0 truncate max-w-[28ch]">{r.name}</span>
        {r.event && <span>event {md(r.event)}</span>}
        <Filed iso={r.filed} now={now} />
        <SecLink url={r.url} />
      </div>
      {r.purpose && <p className="text-[12px] text-ink2 mt-1 pl-6 max-w-[80ch]">Item 4: “{r.purpose}”</p>}
    </li>
  );
}

export default function Insiders() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  const [f, setF] = useState<InsiderFilter>('all');
  const [tab, setTab] = useState<Tab>('buys');
  const [sf, setSf] = useState<SaleFilter>('big');
  const [pf, setPf] = useState<PlanFilter>('big');
  const [scan, setScan] = useState(true);
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
  const sales = useMemo(() => (file ? filterSales(file.sells, sf) : []), [file, sf]);
  const plans = useMemo(() => (file ? filterPlans(file.plans, pf) : []), [file, pf]);
  const acts = useMemo(() => (file ? filterActivists(file.activists, scan) : []), [file, scan]);
  const now = useMemo(() => Date.now(), [file]);                       // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Insider activity</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[64ch]">
            {tab === 'buys' && `Open-market purchases from SEC Form 4 filings: 2+ insiders buying the same stock within 14 days (3+ = strong), or the first big buy before others join ("early": a CEO / CFO / President / COO / Chair $100k+, anyone $500k+). Buys under $10k and stocks under $2 are left out. ⭐ = strong cluster with the price inside or near a weekly / monthly demand zone of the stock scanner. Last ${file?.days ?? 30} days, Calgary time.`}
            {tab === 'sells' && 'Open-market sales (Form 4 code S) of scanner stocks, $250k+, last 14 days. "Big · no plan" = a CEO / CFO / President / COO / Chair or 10% owner selling $1M+ or 0.1% of the market cap, not under a Rule 10b5-1 plan (those, and tax-withholding sales, are shown dimmer under All).'}
            {tab === 'plans' && 'Form 144: the notice an insider files BEFORE selling restricted or control shares. A plan to sell, not a sale: it may be smaller, later or never. Scanner stocks only; "big" = $1M+ or 0.1% of the market cap.'}
            {tab === 'activists' && 'Schedule 13D: a holder crossing 5% who may push for change (filed within 5 business days). Percent of the class, shares, the change vs the filer\'s previous filing, and the first words of Item 4 (purpose). Schedule 13G (passive holders) is on each stock\'s Holders card, never here.'}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {file ? <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />Updated {calgary(file.generated)}</span> : load.state === 'loading' ? <span>Loading…</span> : null}
            {file && file.coverage.days > 0 && file.coverage.done < file.coverage.days && <span>backfill {file.coverage.done}/{file.coverage.days} days</span>}
            <Link to="/scanner" className="text-accent font-medium">Stock scanner</Link>
          </div>
          <div className="pt-1 flex flex-wrap gap-2">
            <Segmented label="Section" size="sm" value={tab} onChange={setTab} options={[
              { value: 'buys', label: `Buys${file ? ` · ${file.clusters.length}` : ''}` }, { value: 'sells', label: `Sells${file ? ` · ${file.sells.filter(x => x.big).length}` : ''}` },
              { value: 'plans', label: `Planned (144)${file ? ` · ${file.plans.filter(x => x.big).length}` : ''}` }, { value: 'activists', label: `Activists (13D)${file ? ` · ${file.activists.filter(x => x.universe).length}` : ''}` }]} />
            {tab === 'buys' && <Segmented label="Show" size="sm" value={f} onChange={setF} options={[{ value: 'all', label: 'All' }, { value: 'star', label: '⭐ Only' }, { value: 'scanner', label: 'Scanner stocks' }]} />}
            {tab === 'sells' && <Segmented label="Show sales" size="sm" value={sf} onChange={setSf} options={[{ value: 'big', label: 'Big · no plan' }, { value: 'all', label: 'All $250k+' }]} />}
            {tab === 'plans' && <Segmented label="Show planned sales" size="sm" value={pf} onChange={setPf} options={[{ value: 'big', label: 'Big' }, { value: 'all', label: 'All' }]} />}
            {tab === 'activists' && <Segmented label="Show 13D" size="sm" value={scan ? 'scan' : 'all'} onChange={v => setScan(v === 'scan')} options={[{ value: 'scan', label: 'Scanner stocks' }, { value: 'all', label: 'All companies' }]} />}
          </div>
        </div>
      </Card>
      {load.state === 'error' && <Card><Empty icon="info" title="No insider list yet" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>It appears after the first run of the SEC filings job (every 10 min on US weekdays).</Empty></Card>}
      {file && tab === 'buys' && !rows.length && <Card><Empty icon="info" title="Nothing here yet">No cluster matches this filter in the data so far.</Empty></Card>}
      {tab === 'buys' && rows.length > 0 && <Card><ul>{rows.map(c => <Row key={`${c.sym}:${c.kind}:${c.first}`} c={c} now={now} />)}</ul></Card>}
      {file && tab === 'sells' && !sales.length && <Card><Empty icon="info" title="No sales here">No big open-market sale without a 10b5-1 plan in the data so far.</Empty></Card>}
      {tab === 'sells' && sales.length > 0 && <Card><ul>{sales.map((r, i) => <SaleRow key={`${r.sym}:${r.who}:${r.date}:${i}`} r={r} now={now} />)}</ul></Card>}
      {file && tab === 'plans' && !plans.length && <Card><Empty icon="info" title="No planned sales here">No Form 144 of a scanner stock matches in the data so far.</Empty></Card>}
      {tab === 'plans' && plans.length > 0 && <Card><ul>{plans.map((r, i) => <PlanRow key={`${r.sym}:${r.who}:${r.filed}:${i}`} r={r} now={now} />)}</ul></Card>}
      {file && tab === 'activists' && !acts.length && <Card><Empty icon="info" title="No 13D filings here">No Schedule 13D in the last 60 days matches.</Empty></Card>}
      {tab === 'activists' && acts.length > 0 && <Card><ul>{acts.map((r, i) => <ActivistRow key={`${r.sym}:${r.who}:${r.filed}:${i}`} r={r} now={now} />)}</ul></Card>}
      <p className="text-[11.5px] text-ink3 px-1">Score: cluster size (2 → 2, 3 → 3.5, 4+ → 4.5; solo 1) + CEO / CFO 2 (both 3) + other top officer 0.5 + $ vs market cap up to 2 + holdings increase up to 1.5 + inside a W1 / MN / 3M demand 2 (within 5% above: 1) + repeat buyer 0.5. Early buys (first big buy) alert at once without the score. Telegram alerts new ones, big sales, planned sales and 13D filings together, at most 6 a day. Context, not a signal. Not advice.</p>
    </Page>
  );
}
