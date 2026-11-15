// Loads what the Today page and the Decision Desk need: the forex list (which markets exist and which shard holds
// them), the shards of the watched markets only, and the market-hours study (each market's weekday timing).
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FX_URL, fxDetailUrl, parseFx } from '@/core/fx';
import { MH_URL, parseMarketHours } from '@/core/marketHours';
import { globalClock } from '@/core/tradeClock';
import { editWatch, parseDeskInst, watchOf, type DeskInst, type DeskPlans } from '@/core/desk';
import { useStore } from './store';

export interface Market { sym: string; cls: string; k: string }
type Week = (number | null)[][] | null;
interface Base { markets: Market[]; generated: string; weeks: Record<string, Week>; fallback: Week }
const getJson = (url: string) => fetch(url, { cache: 'no-cache' }).then(r => (r.ok ? r.json() : Promise.reject(new Error(`${url} ${r.status}`))));
const shards = new Map<string, { at: number; js: unknown }>();
const FRESH = 4 * 60_000;
async function shard(k: string): Promise<unknown> {
  const c = shards.get(k);
  if (c && Date.now() - c.at < FRESH) return c.js;
  const js = await getJson(fxDetailUrl(k));
  shards.set(k, { at: Date.now(), js });
  return js;
}

export function useDesk() {
  const rules = useStore(s => s.riskRules);
  const setDesk = useStore(s => s.setDesk);
  const watch = useMemo(() => watchOf(rules.deskWatch), [rules.deskWatch]);
  const plans: DeskPlans = rules.deskPlans ?? {};
  const [base, setBase] = useState<Base | null>(null);
  const [insts, setInsts] = useState<Record<string, DeskInst>>({});
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let live = true;
    Promise.all([getJson(FX_URL), getJson(MH_URL).catch(() => null)]).then(([fx, mh]) => {
      if (!live) return;
      const f = parseFx(fx), study = mh ? parseMarketHours(mh).symbols : [];
      if (!f) { setState('error'); return; }
      setBase({
        markets: f.map.filter(r => r.px != null && r.k).map(r => ({ sym: r.sym, cls: r.cls, k: r.k })).sort((a, b) => a.sym.localeCompare(b.sym)),
        generated: f.generated, weeks: Object.fromEntries(study.filter(s => s.week).map(s => [s.sym, s.week])), fallback: globalClock(study)?.week ?? null,
      });
    }).catch(() => { if (live) setState('error'); });
    return () => { live = false; };
  }, [tick]);

  const keys = useMemo(() => (base ? [...new Set(watch.map(s => base.markets.find(m => m.sym === s)?.k).filter((k): k is string => !!k))].sort().join(',') : ''), [base, watch]);
  useEffect(() => {
    if (!base) return;
    let live = true;
    Promise.all(keys.split(',').filter(Boolean).map(k => shard(k).then(js => [k, js] as const).catch(() => [k, null] as const))).then(rows => {
      if (!live) return;
      const by = new Map(rows), out: Record<string, DeskInst> = {};
      for (const s of watch) { const k = base.markets.find(m => m.sym === s)?.k; const i = k ? parseDeskInst(by.get(k), s) : null; if (i) out[s] = i; }
      setInsts(out);
      setState('ok');
    });
    return () => { live = false; };
  }, [base, keys, watch]);

  // new scan data arrives hourly: look again every 5 minutes while the page is open
  useEffect(() => { const id = window.setInterval(() => { if (!document.hidden) setTick(x => x + 1); }, 5 * 60_000); return () => window.clearInterval(id); }, []);

  const add = useCallback((sym: string) => setDesk({ deskWatch: editWatch(watch, sym, true) }), [setDesk, watch]);
  const remove = useCallback((sym: string) => setDesk({ deskWatch: editWatch(watch, sym, false) }), [setDesk, watch]);
  return { state, watch, plans, insts, markets: base?.markets ?? [], weeks: base?.weeks ?? {}, fallback: base?.fallback ?? null, generated: base?.generated ?? '', add, remove, setDesk, retry: () => { setState('loading'); setTick(x => x + 1); } };
}
