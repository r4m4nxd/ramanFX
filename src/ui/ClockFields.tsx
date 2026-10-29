import { useEffect, useMemo, useState } from 'react';
import { allTimeZones, BROKER_CLOCKS, brokerClockNow, clockIn, deviceTz, gmtLabel, POPULAR_TZ } from '@/core/time';
import { useStore } from '@/data/store';
import { Field } from './kit';

/** Your time zone + your broker's server clock, as plain dropdowns with a live clock to check against. */
export function ClockFields({ showUser = true }: { showUser?: boolean }) {
  const userTz = useStore(s => s.userTz), setUserTz = useStore(s => s.setUserTz);
  const clock = useStore(s => s.brokerClock), setClock = useStore(s => s.setBrokerClock);
  const [, tick] = useState(0);
  useEffect(() => { const h = setInterval(() => tick(x => x + 1), 30_000); return () => clearInterval(h); }, []);
  const others = useMemo(() => { const pop = new Set(POPULAR_TZ.map(p => p.tz)); return allTimeZones().filter(z => !pop.has(z)); }, []);
  const device = deviceTz();
  const hint = BROKER_CLOCKS.find(b => b.value === clock)?.hint;

  return (
    <div className="flex flex-col gap-4">
      {showUser && (
        <Field label="Your time zone" hint={<>Trades, days and the calendar use this clock. Now: <b className="num text-ink2">{clockIn(userTz)}</b>{userTz !== device && <> · <button type="button" className="text-accent" onClick={() => setUserTz(device)}>use this device's ({device.split('/').pop()?.replace(/_/g, ' ')})</button></>}</>}>
          <select className="field" value={userTz} onChange={e => setUserTz(e.target.value)}>
            <optgroup label="Popular">
              {POPULAR_TZ.map(p => <option key={p.tz} value={p.tz}>{p.city} ({gmtLabel(p.tz)})</option>)}
            </optgroup>
            <optgroup label="All time zones">
              {others.map(z => <option key={z} value={z}>{z.replace(/_/g, ' ')} ({gmtLabel(z)})</option>)}
            </optgroup>
          </select>
        </Field>
      )}
      <Field label="Broker server time" hint={<>{hint && <>{hint.replace(/[.…]+$/, '')}. </>}Check: MT5 Market Watch shows the server time — it should read <b className="num text-ink2">{brokerClockNow(clock)}</b> right now.</>}>
        <select className="field" value={clock} onChange={e => setClock(e.target.value)}>
          {BROKER_CLOCKS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
          {!BROKER_CLOCKS.some(b => b.value === clock) && <option value={clock}>{clock}</option>}
        </select>
      </Field>
    </div>
  );
}
