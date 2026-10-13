// Live reference FX rates for converting a quote currency into the account currency in the
// calculators. Source: Frankfurter (ECB reference rates, updated daily, no key). Cached 12h.
// Journal statistics never depend on this: they use values measured from the broker's own fills.

const KEY = 'rfx_fx_rates_v1';
const TTL = 12 * 3600 * 1000;

interface Cache { at: number; base: string; rates: Record<string, number> }

let mem: Cache | null = null;

export async function loadRates(): Promise<Cache | null> {
  if (mem && Date.now() - mem.at < TTL) return mem;
  try {
    const c = JSON.parse(localStorage.getItem(KEY) || 'null') as Cache | null;
    if (c && Date.now() - c.at < TTL) return (mem = c);
  } catch { /* ignore */ }
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD');
    if (!res.ok) throw new Error(String(res.status));
    const j = await res.json();
    mem = { at: Date.now(), base: 'USD', rates: { USD: 1, ...j.rates } };
    try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch { /* ignore */ }
    return mem;
  } catch {
    return mem;
  }
}

/** Multiply an amount in `from` by this to get `to`. Null when either currency is unknown. */
export function rate(c: Cache | null, from: string, to: string): number | null {
  if (from === to) return 1;
  if (!c) return null;
  const f = c.rates[from], t = c.rates[to];
  return f && t ? t / f : null;
}
