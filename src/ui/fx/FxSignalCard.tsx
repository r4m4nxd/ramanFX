import { Badge, Card, cx } from '@/ui/kit';
import { feedBadge, feedText, fxPx, tvLink, wideSpread, type FxSignal } from '@/core/fx';

const n1 = (v: number | null) => (v == null ? '—' : v.toFixed(1));

export function FxSignalCard({ s }: { s: FxSignal }) {
  const tone = s.kind === 'BUY' ? 'profit' : s.kind === 'SELL' ? 'loss' : 'warn';
  const p = (v: number | null) => fxPx(v, s.digits);
  return (
    <Card aria-label={`${s.kind} ${s.sym}`} className="flex flex-col gap-3 p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge tone={tone}>{s.kind === 'WATCH' && s.watch_kind ? `WATCH · ${s.watch_kind}` : s.kind}</Badge>
            <h3 className="text-[18px] font-semibold tracking-tight">{s.sym}</h3>
            {s.tf && <Badge>{s.tf}{s.zone_type ? ` · ${s.zone_type}` : ''}</Badge>}
            {wideSpread(s) && <Badge tone="warn">{s.exotic ? 'exotic · wide spread' : 'wide spread'}</Badge>}
            {feedBadge(s) && <Badge tone="warn">{feedBadge(s)}</Badge>}
          </div>
          <p className="text-[12px] text-ink3 mt-0.5"><span title={feedText(s)}>{s.group || 'Not on watchlist'}</span>{s.direction ? ` · ${s.direction}` : ''}</p>
        </div>
        {s.price != null && <div className="num text-[15px] font-semibold shrink-0">{p(s.price)}</div>}
      </div>
      {s.chain_text && <p className="text-[12px] text-ink2 leading-relaxed [overflow-wrap:anywhere]">{s.chain_text}</p>}
      <dl className="grid grid-cols-3 gap-2 text-[12px]">
        {[['Entry', p(s.entry)], ['Stop', p(s.stop)], ['Target', p(s.target)], ['R:R', s.rr == null ? '—' : `${s.rr.toFixed(2)}R`], ['Risk / reward pips', `${n1(s.stop_pips)} / ${n1(s.target_pips)}`], ['Spread', s.spread_pips == null ? '—' : `${n1(s.spread_pips)} pips`]].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-raised/50 border border-line/60 px-2.5 py-2 min-w-0">
            <dt className="text-[10.5px] text-ink3 truncate">{k}</dt>
            <dd className={cx('num font-semibold truncate', k === 'R:R' && 'text-accent')}>{v}</dd>
          </div>
        ))}
      </dl>
      {s.ctx3 && <p className="text-[11.5px] text-ink3">{s.ctx3}</p>}
      {s.note && <p className="text-[11.5px] text-ink3">{s.note}</p>}
      {s.gold_note && <p className="text-[11.5px] text-warn">{s.gold_note}</p>}
      {s.src && <p className={cx('text-[11.5px]', s.unofficial ? 'text-warn' : 'text-ink3')}>{feedText(s)}</p>}
      <a href={tvLink(s.tv)} target="_blank" rel="noreferrer" className="self-start text-[12.5px] font-semibold text-accent hover:underline underline-offset-4">Open {s.sym} on TradingView ↗</a>
    </Card>
  );
}
