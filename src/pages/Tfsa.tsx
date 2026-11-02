import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Empty, Page, Segmented } from '@/ui/kit';
import { tfsaRows, type TfsaRow } from '@/core/tfsa';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const px = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const usd = (v: number) => (v >= 1e9 ? `$${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(1)}M` : `$${(v / 1e3).toFixed(0)}K`);
const TF: Record<string, string> = { W1: 'Weekly', MN: 'Monthly', '3M': '3-month' };

function Row({ r }: { r: TfsaRow }) {
  const where = r.section === 'in' ? 'inside the zone' : r.section === 'left' ? `${r.pct.toFixed(1)}% above · just left` : `${r.pct.toFixed(1)}% away`;
  return (
    <li className="py-2.5 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <Link to={`/scanner/${encodeURIComponent(r.sym.replace(/\./g, '-'))}`} className="font-semibold text-ink hover:text-accent">{r.sym}</Link>
        {r.cad && <span aria-label="Canadian listing">🇨🇦</span>}
        <span className="text-ink2">{TF[r.tf] ?? r.tf} demand</span>
        <span className="num">{px(r.prox)}–{px(r.dist)}</span>
        <span className="text-ink2">{where}</span>
        {r.insider && <span className="font-medium">⭐ {r.insider.kind === 'cluster' ? `${r.insider.n} insiders` : r.insider.kind === 'early' ? '1 insider (early)' : 'big solo buy'} bought {usd(r.insider.value)}</span>}
      </div>
      {r.name && <div className="text-[12px] text-ink3 pl-0.5 truncate max-w-[48ch]">{r.name}</div>}
    </li>
  );
}

export default function Tfsa() {
  const [scan, setScan] = useState<J | null>(null);
  const [ins, setIns] = useState<J | null>(null);
  const [err, setErr] = useState(false);
  const [turns, setTurns] = useState<J[]>([]);
  const [ca, setCa] = useState<'all' | 'ca'>('all');
  useEffect(() => {
    let live = true;
    fetch('/scanner/latest.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : Promise.reject(r.status))).then(js => { if (live) setScan(js); }).catch(() => { if (live) setErr(true); });
    fetch('/insiders/latest.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(js => { if (live) setIns(js); }).catch(() => {});
    fetch('/scanner/arrivals.json', { cache: 'no-cache' }).then(r => (r.ok ? r.json() : null)).then(js => { if (live && Array.isArray(js?.weekly_turns)) setTurns(js.weekly_turns); }).catch(() => {});
    return () => { live = false; };
  }, []);
  const rows = useMemo(() => (scan ? tfsaRows(scan, ins, ca === 'ca') : null), [scan, ins, ca]);
  const sec: [string, string, TfsaRow[]][] = rows ? [['⭐ Insiders buying at the zone', 'last 30 days of SEC Form 4 buys (Baker: fundamentals and insiders first)', rows.insiders],
    ['🟩 Inside the zone', 'the best price now', rows.in], ['↗️ Just left it', 'bounced off the zone, still close', rows.left], ['⏳ Near', 'coming down to the zone', rows.near]] : [];
  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">TFSA · buy at the best price</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[64ch]">Long-only stocks inside, just leaving or near a weekly, monthly or 3-month demand zone of the daily stock scan, the biggest timeframe first. Stocks whose insiders bought in the last 30 days come first. Telegram: /tfsa (/tfsa ca for Canadian listings).</p>
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink3">
            {scan?.generated_at && <span>Scan {new Date(scan.generated_at).toLocaleString('en-US', { timeZone: 'America/Edmonton', weekday: 'short', hour: 'numeric', minute: '2-digit' })}</span>}
            <Segmented label="Listings" size="sm" value={ca} onChange={setCa} options={[{ value: 'all', label: 'All' }, { value: 'ca', label: '🇨🇦 Canada' }]} />
          </div>
        </div>
      </Card>
      {err && <Card><Empty icon="info" title="No stock scan yet">It appears after the daily stock scan (about 30 min after the US close).</Empty></Card>}
      {sec.filter(([, , rs]) => rs.length).map(([title, sub, rs]) => (
        <Card key={title}>
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <p className="text-[12px] text-ink3 mb-1">{sub}</p>
          <ul>{rs.slice(0, 40).map(r => <Row key={r.sym} r={r} />)}</ul>
        </Card>
      ))}
      {turns.length > 0 && ca === 'all' && (
        <Card>
          <h3 className="text-[15px] font-semibold">🌱 Weekly turn + fresh daily arrival</h3>
          <p className="text-[12px] text-ink3 mb-1">The weekly down trend line broken by a close (Raja: turning; 2 supply zones removed = changed) and a fresh daily arrival demand: a new up-move starting, caught early.</p>
          <ul>{turns.slice(0, 30).map(t => (
            <li key={`${t.sym}-${t.w1_cross}`} className="py-2 border-b border-line/50 last:border-0 flex flex-wrap items-baseline gap-x-2 text-[13.5px]">
              <Link to={`/scanner/${encodeURIComponent(String(t.sym).replace(/\./g, '-'))}`} className="font-semibold text-ink hover:text-accent">{t.sym}</Link>
              <span className="text-ink2">weekly line broken {String(t.w1_cross ?? '').slice(0, 10)} ({t.w1_state})</span>
              <span className="num">daily demand {Number(t.d1_lo).toFixed(2)}–{Number(t.d1_hi).toFixed(2)}</span>
            </li>))}</ul>
        </Card>
      )}
      {rows && !sec.some(([, , rs]) => rs.length) && <Card><Empty icon="info" title="Nothing at a big zone">No stock is at a weekly / monthly / 3-month demand zone right now.</Empty></Card>}
      <p className="text-[11.5px] text-ink3 px-1">Zones from the daily stock scan (Raja rules). Context for your own decision. Not advice.</p>
    </Page>
  );
}
