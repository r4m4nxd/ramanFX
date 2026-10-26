import { useEffect, useMemo, useState } from 'react';
import { Badge, Card, Empty, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ScannerSwitch } from '@/ui/ScannerSwitch';
import { FxSignalCard } from '@/ui/fx/FxSignalCard';
import { FxMarketMap } from '@/ui/fx/FxMarketMap';
import { FxUnmapped } from '@/ui/fx/FxUnmapped';
import { FX_DATA_NOTE, FX_URL, parseFx, sortFxSignals, type FxFile } from '@/core/fx';

type Load = { state: 'loading' } | { state: 'ok'; scan: FxFile | null } | { state: 'error' };
const when = (s: string) => { const d = new Date(s); return Number.isNaN(d.getTime()) ? s : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); };

export default function Fx() {
  const [load, setLoad] = useState<Load>({ state: 'loading' });
  const [n, setN] = useState(0);
  useEffect(() => {
    let live = true;
    fetch(FX_URL, { cache: 'no-cache' })
      .then(r => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then(js => { if (live) setLoad({ state: 'ok', scan: parseFx(js) }); })
      .catch(() => { if (live) setLoad({ state: 'error' }); });
    return () => { live = false; };
  }, [n]);
  const scan = load.state === 'ok' ? load.scan : null;
  const signals = useMemo(() => (scan ? sortFxSignals(scan.signals) : []), [scan]);
  const act = signals.filter(s => s.kind !== 'WATCH');
  const watch = signals.filter(s => s.kind === 'WATCH');
  const has = !!scan?.generated_at;

  return (
    <Page className="pb-24">
      <ScannerSwitch />
      <Card className="luxe-border">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight">Forex zone scan</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[62ch]">Your Pepperstone watchlist, scanned top-down for fresh demand and supply zones on every H4 close.</p>
          {scan?.fixture && <Badge tone="warn" className="self-start">Sample data · synthetic fixture</Badge>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {has ? <>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />As of {when(scan!.generated_at)}</span>
              {scan!.last_h4_close && <span className="num">Last H4 close {when(scan!.last_h4_close)}</span>}
            </> : load.state === 'loading' ? <span>Loading…</span> : <span>No scan yet</span>}
          </div>
          <p className="text-[12px] text-warn font-medium">{scan?.note || FX_DATA_NOTE}</p>
        </div>
      </Card>

      {load.state === 'error' && <Card><Empty icon="info" title="Couldn't load the forex scan" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>Check your connection and try again.</Empty></Card>}
      {load.state === 'ok' && !has && <Card><Empty icon="info" title="No forex scan yet">The first scan appears here after the next H4 close.</Empty></Card>}

      {has && <>
        <section aria-label="Signals" className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold px-1">Signals <span className="num text-ink3 font-medium">{act.length}</span></h2>
          {act.length ? act.map((s, i) => <FxSignalCard key={`${s.symbol}-${s.tf}-${s.side}-${i}`} s={s} />) : <p className="text-[13px] text-ink3 px-1">No BUY or SELL setups on this close.</p>}
          {!!watch.length && <>
            <h3 className="text-[14px] font-semibold px-1 mt-1">Watch <span className="num text-ink3 font-medium">{watch.length}</span></h3>
            {watch.map((s, i) => <FxSignalCard key={`w-${s.symbol}-${s.tf}-${i}`} s={s} />)}
          </>}
        </section>
        <section aria-label="Market map" className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold px-1">Market map</h2>
          <FxMarketMap instruments={scan!.instruments} />
        </section>
        <FxUnmapped items={scan!.unmapped} />
      </>}
    </Page>
  );
}
