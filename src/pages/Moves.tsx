import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Badge, Card, Empty, Page, Segmented } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import {
  fmtPct, GROUP_LABEL, grouped, MOVE_TFS, MOVES_URL, parseMoves, sectionsOf, TF_LABEL, TF_MARK, tfFromHash,
  type MoveRow, type MoveSection, type MovesFile, type MoveTf,
} from '@/core/moves';

type Load = { state: 'loading' } | { state: 'ok'; file: MovesFile } | { state: 'error' };
const CAL = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Edmonton', weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const DAY = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Edmonton', weekday: 'short', month: 'short', day: 'numeric' });
const calDay = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? DAY.format(t) : ''; };
const calgary = (iso: string) => { const t = Date.parse(iso); return Number.isFinite(t) ? CAL.format(t) : '–'; };

function Line({ r }: { r: MoveRow }) {
  const up = r.pct >= 0;
  const name = r.market === 'stock' ? <Link to={`/scanner/${encodeURIComponent(r.sym)}`} className="font-semibold text-ink hover:text-accent">{r.sym}</Link> : <span className="font-semibold">{r.sym}</span>;
  return (
    <li className="py-2 border-b border-line/50 last:border-0">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[13.5px]">
        <span className={up ? 'text-profit' : 'text-loss'} aria-label={up ? 'up' : 'down'}>{up ? '▲' : '▼'}</span>
        {name}
        <span className={`num ${up ? 'text-profit' : 'text-loss'}`}>{fmtPct(r.pct)}</span>
        <span className="num text-ink2">{r.x.toFixed(1)}×</span>
        {r.tags.map(t => <Badge key={t} tone="warn" className="!h-5 !px-2 !text-[10.5px]">{t}</Badge>)}
        {r.ctx && <span className="text-[12.5px] text-ink2">{r.ctx}</span>}
      </div>
      {r.why && (
        <div className="text-[12px] text-ink3 mt-0.5 pl-5 min-w-0 truncate">
          📰 {r.why.url ? <a href={r.why.url} target="_blank" rel="noreferrer noopener" className="hover:text-ink2 underline-offset-2 hover:underline">{r.why.title}</a> : r.why.title}
        </div>
      )}
    </li>
  );
}

function Section({ s }: { s: MoveSection }) {
  const groups = grouped(s);
  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
        <h3 className="text-[15px] font-semibold">{TF_MARK[s.tf]} {TF_LABEL[s.tf]} <span className="text-ink3 font-normal text-[13px]">· {s.label ? `${calDay(s.close)} · ${s.label.replace(/^(day|week)( \(UTC\))? closed \w{3} /, '$1$2 closed ')}` : calgary(s.close)}</span></h3>
        <span className="num text-[12px] text-ink3">{s.rows.length} move{s.rows.length === 1 ? '' : 's'}</span>
      </div>
      {!groups.length && <p className="text-[13px] text-ink3 py-2">Nothing moved 2× its normal range on this close.</p>}
      {groups.map(([g, rs]) => (
        <div key={g} className="mt-2">
          <div className="label">{GROUP_LABEL[g]}{g === 'stock' && s.feed ? ` · ${s.feed}` : ''} · {rs.length}</div>
          <ul>{rs.map(r => <Line key={`${g}:${r.sym}`} r={r} />)}</ul>
        </div>
      ))}
    </Card>
  );
}

export default function Moves() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  const loc = useLocation();
  const nav = useNavigate();
  const tf: MoveTf = tfFromHash(loc.hash) ?? 'D1';
  useEffect(() => {
    let live = true;
    fetch(MOVES_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setLoad({ state: 'ok', file: parseMoves(js) }); })
      .catch(() => { if (live) setLoad({ state: 'error' }); });
    return () => { live = false; };
  }, [n]);
  const file = load.state === 'ok' ? load.file : null;
  const secs = useMemo(() => (file ? sectionsOf(file, tf) : []), [file, tf]);

  return (
    <Page className="pb-24">
      <Card className="luxe-border">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold tracking-tight">Big moves</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[64ch]">Every pair, index, coin and stock whose candle just closed at 2× (or more) its 20-candle average range, per timeframe. The Telegram message shows the top 8 per group; this page lists them all for the last 3 days. Calgary time.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {file ? <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />Updated {calgary(file.generated)}</span>
              : load.state === 'loading' ? <span>Loading…</span> : null}
            <Link to="/scanner/fx" className="text-accent font-medium">Forex scanner</Link>
            <Link to="/scanner" className="text-accent font-medium">Stock scanner</Link>
          </div>
          <div className="overflow-x-auto -mx-1 px-1 pt-1">
            <Segmented label="Timeframe" size="sm" value={tf} onChange={v => nav({ hash: v.toLowerCase() }, { replace: true })}
              options={MOVE_TFS.map(t => ({ value: t, label: `${TF_MARK[t]} ${TF_LABEL[t]}` }))} />
          </div>
        </div>
      </Card>
      {load.state === 'error' && <Card><Empty icon="info" title="No big-moves list yet" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>It appears after the first hourly run that finds a close. Check your connection and try again.</Empty></Card>}
      {file && !secs.length && <Card><Empty icon="info" title={`No ${TF_LABEL[tf]} close yet`}>The list fills in as candles close.</Empty></Card>}
      {secs.map(s => <Section key={`${s.tf}:${s.close}`} s={s} />)}
      <p className="text-[11.5px] text-ink3 px-1">Move = close vs the previous close. Range rule: ≥ 2× the 20-candle average and a minimum % per timeframe; stocks 1D also flag gaps ≥ 3% and big bodies. Not advice.</p>
    </Page>
  );
}
