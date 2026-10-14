import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useFiltered } from '@/data/derived';
import { useStore } from '@/data/store';
import { num, pct, tone, useMoney } from '@/lib/format';
import { Card, CardHead, cx, Empty, Page, Stat, useIsMobile } from '@/ui/kit';

const WINDOWS = [['t30m', '+30m'], ['t1h', '+1h'], ['t4h', '+4h'], ['t12h', '+12h'], ['t1d', '+1d'], ['t1w', '+1w']] as const;

export default function Exits() {
  const et = useFiltered();
  const exitData = useStore(s => s.exitData);
  const fmt = useMoney();
  const mobile = useIsMobile();
  const rows = useMemo(() => et.filter(t => exitData[t.id]).map(t => {
    const e = exitData[t.id];
    const mfe = Math.max(0, e.mfe ?? 0), got = e.profitPts ?? 0, dpp = e.dollarPerPt ?? null;
    const capture = mfe > 0 ? Math.max(0, got) / mfe : null;
    const left = dpp != null && mfe > got ? (mfe - Math.max(0, got)) * dpp : null;
    return { t, e, capture, left, dpp };
  }), [et, exitData]);

  if (!Object.keys(exitData).length) return (
    <Card><Empty icon="exit" title="No excursion data yet" action={<button className="btn-primary" onClick={() => window.dispatchEvent(new Event('rfx:import'))}>Import CSV</button>}>
      Run the free MQL5 script “Advanced Trade History Exporter” (#72326) in MT5, then import its CSV. It adds max adverse/favourable excursion and where price went after you exited.
    </Empty></Card>
  );

  const winners = rows.filter(r => r.t.outcome === 'win');
  const avgCapture = winners.filter(r => r.capture != null).reduce((a, r, _, xs) => a + r.capture! / xs.length, 0);
  const leftTotal = rows.reduce((a, r) => a + (r.left ?? 0), 0);
  const losersHitMfe = rows.filter(r => r.t.outcome === 'loss' && (r.e.mfe ?? 0) > Math.abs(r.e.mae ?? 0));
  const forward = WINDOWS.map(([k, label]) => {
    const xs = rows.filter(r => r.e[k] != null);
    // Positive = price kept going your way after exit (you exited early).
    const better = xs.filter(r => (r.e[k] as number) > (r.e.profitPts ?? 0)).length;
    return { label, n: xs.length, better: xs.length ? better / xs.length : null };
  });

  return (
    <Page>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          ['Trades with data', String(rows.length), ''],
          ['Avg capture (winners)', pct(avgCapture, 0), ''],
          ['Left on the table', fmt(leftTotal), 'text-warn'],
          ['Losers that were green first', `${losersHitMfe.length}`, losersHitMfe.length ? 'text-loss' : ''],
        ].map(([l, v, c]) => <Card key={l} className="p-4"><div className="label">{l}</div><div className={cx('num text-2xl font-semibold mt-2', c)}>{v}</div></Card>)}
      </div>
      <Card>
        <CardHead title="After you exited" sub="Share of trades where price was further in your favour later — high numbers mean you exit early" />
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {forward.map(f => (
            <div key={f.label} className="rounded-xl bg-raised p-3 text-center">
              <div className="label">{f.label}</div>
              <div className={cx('num text-xl font-semibold mt-1', f.better != null && f.better > 0.5 ? 'text-warn' : '')}>{pct(f.better, 0)}</div>
              <div className="text-[11px] text-ink3">{f.n} trades</div>
            </div>
          ))}
        </div>
      </Card>
      {mobile ? (
        <Card className="px-4 py-1">
          <ul>
            {[...rows].reverse().slice(0, 300).map(({ t, e, capture, left }) => (
              <li key={t.id} className="py-3 border-t border-line first:border-0">
                <Link to={`/trades/${t.id}`} className="flex items-baseline justify-between gap-3">
                  <span className="font-mono font-semibold">{t.sym} <span className="font-sans font-normal text-ink3 text-xs">{t.closeTime.slice(0, 10)}</span></span>
                  <span className={cx('num font-semibold', tone(t.net))}>{fmt(t.net, { signed: true })}</span>
                </Link>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Stat label="MAE" value={num(e.mae, 0)} className="text-loss" />
                  <Stat label="MFE" value={num(e.mfe, 0)} className="text-profit" />
                  <Stat label="Captured" value={pct(capture, 0)} />
                  <Stat label="Left" value={left != null && left > 0 ? fmt(left, { compact: true }) : '—'} className="text-warn" />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ) : (
      <Card className="p-0 overflow-hidden">
        <div>
          <table className="w-full">
            <thead className="bg-raised/50"><tr className="[&>th]:pt-3 [&>th:first-child]:pl-5 [&>th:last-child]:pr-5"><th className="th">Trade</th><th className="th text-right">MAE (pts)</th><th className="th text-right">MFE (pts)</th><th className="th text-right">Exit (pts)</th><th className="th text-right">Captured</th><th className="th text-right">Left</th><th className="th text-right">Net</th></tr></thead>
            <tbody>
              {[...rows].reverse().slice(0, 300).map(({ t, e, capture, left }) => (
                <tr key={t.id} className="[&>td:first-child]:pl-5 [&>td:last-child]:pr-5 hover:bg-raised/50">
                  <td className="td"><Link to={`/trades/${t.id}`} className="font-mono hover:text-accent">{t.sym}</Link> <span className="text-ink3 text-xs">{t.closeTime.slice(0, 10)}</span>{(e.suspectMAE || e.suspectMFE) && <span className="text-warn text-xs" title="Excursion data was repaired"> *</span>}</td>
                  <td className="td num text-right text-loss">{num(e.mae, 0)}</td>
                  <td className="td num text-right text-profit">{num(e.mfe, 0)}</td>
                  <td className={cx('td num text-right', tone(e.profitPts))}>{num(e.profitPts, 0)}</td>
                  <td className="td num text-right">{pct(capture, 0)}</td>
                  <td className="td num text-right text-warn">{left != null && left > 0 ? fmt(left) : '—'}</td>
                  <td className={cx('td num text-right font-semibold', tone(t.net))}>{fmt(t.net, { signed: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}
    </Page>
  );
}
