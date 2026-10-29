import { useEffect, useState } from 'react';
import { Badge, Card, Empty, Page } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { ScannerSwitch } from '@/ui/ScannerSwitch';
import { FxSignalCard } from '@/ui/fx/FxSignalCard';
import { FxMarketMap } from '@/ui/fx/FxMarketMap';
import { FxUnmapped } from '@/ui/fx/FxUnmapped';
import { FX_DATA_NOTE, FX_URL, parseFx, type FxFile } from '@/core/fx';

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
  const act = scan?.signals ?? [];
  const watch = scan?.watch ?? [];
  const has = !!scan?.generated;

  return (
    <Page className="pb-24">
      <ScannerSwitch />
      <Card className="luxe-border">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-xl font-semibold tracking-tight">Forex zone scan</h2>
          <p className="text-[13px] text-ink2 leading-relaxed max-w-[62ch]">Your Pepperstone watchlist, scanned top-down (MN → W1 → D1 → H4 → H1) for fresh demand and supply zones after every H1 close.</p>
          {scan?.fixture && <Badge tone="warn" className="self-start">Sample data · synthetic fixture</Badge>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink3">
            {has ? <>
              <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={13} />As of {when(scan!.generated)}</span>
              {scan!.h1 && <span className="num" title={scan!.clock}>Last H1 close {scan!.h1} server time{scan!.h1_close_utc ? ` (${when(scan!.h1_close_utc)} local)` : ''}</span>}
              {scan!.h4 && <span className="num" title={scan!.clock}>Last H4 close {scan!.h4} server time{scan!.h4_close_utc ? ` (${when(scan!.h4_close_utc)} local)` : ''}</span>}
              {scan!.partial && <span className="text-warn">Partial scan: some instruments stale</span>}
            </> : load.state === 'loading' ? <span>Loading…</span> : <span>No scan yet</span>}
          </div>
          <p className="text-[12px] text-warn font-medium">{FX_DATA_NOTE}{scan?.feed ? ` (${scan.feed})` : ''}</p>
        </div>
      </Card>

      {load.state === 'error' && <Card><Empty icon="info" title="Couldn't load the forex scan" action={<button type="button" onClick={() => { setLoad({ state: 'loading' }); setN(x => x + 1); }} className="h-10 px-4 rounded-full border border-line text-[13px] font-semibold">Retry</button>}>Check your connection and try again.</Empty></Card>}
      {load.state === 'ok' && !has && <Card><Empty icon="info" title="No forex scan yet">The first scan appears here after the next H1 close.</Empty></Card>}

      {has && <>
        <section aria-label="Signals" className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold px-1">Signals <span className="num text-ink3 font-medium">{act.length}</span></h2>
          {act.length ? act.map((s, i) => <FxSignalCard key={`${s.sym}-${s.tf}-${s.side}-${i}`} s={s} />) : <p className="text-[13px] text-ink3 px-1">No BUY or SELL setups on this close.</p>}
          {!!watch.length && <>
            <h3 className="text-[14px] font-semibold px-1 mt-1">Watch <span className="num text-ink3 font-medium">{watch.length}</span></h3>
            {watch.map((s, i) => <FxSignalCard key={`w-${s.sym}-${s.tf}-${i}`} s={s} />)}
          </>}
        </section>
        <section aria-label="Market map" className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold px-1">Market map</h2>
          <FxMarketMap rows={scan!.map} order={scan!.groups.map(g => g.name)} />
        </section>
        <FxUnmapped items={scan!.unmapped} />
        {scan!.disclaimer && <p className="text-[11.5px] text-ink3 px-1">{scan!.disclaimer}</p>}
      </>}
    </Page>
  );
}
