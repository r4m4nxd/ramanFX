// Black–Scholes pricing and Greeks for European options (no dividends).

/** Standard normal CDF (Abramowitz–Stegun 7.1.26, |error| < 7.5e-8). */
export function normCdf(x: number): number {
  const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
  const s = x < 0 ? -1 : 1, z = Math.abs(x) / Math.SQRT2;
  const t = 1 / (1 + p * z);
  const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  return 0.5 * (1 + s * y);
}
const normPdf = (x: number) => Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);

export type OptType = 'call' | 'put';
export interface Greeks { price: number; delta: number; gamma: number; theta: number; vega: number }

/** S spot, K strike, T years, r rate, v vol (all decimals). theta per calendar day, vega per 1 vol point. */
export function blackScholes(type: OptType, S: number, K: number, T: number, r: number, v: number): Greeks {
  if (T <= 0 || v <= 0) {
    const intr = Math.max(0, type === 'call' ? S - K : K - S);
    return { price: intr, delta: type === 'call' ? (S > K ? 1 : 0) : (S < K ? -1 : 0), gamma: 0, theta: 0, vega: 0 };
  }
  const sq = Math.sqrt(T);
  const d1 = (Math.log(S / K) + (r + (v * v) / 2) * T) / (v * sq), d2 = d1 - v * sq;
  const disc = Math.exp(-r * T);
  const price = type === 'call' ? S * normCdf(d1) - K * disc * normCdf(d2) : K * disc * normCdf(-d2) - S * normCdf(-d1);
  const delta = type === 'call' ? normCdf(d1) : normCdf(d1) - 1;
  const gamma = normPdf(d1) / (S * v * sq);
  const thetaY = type === 'call'
    ? -(S * normPdf(d1) * v) / (2 * sq) - r * K * disc * normCdf(d2)
    : -(S * normPdf(d1) * v) / (2 * sq) + r * K * disc * normCdf(-d2);
  return { price, delta, gamma, theta: thetaY / 365, vega: (S * normPdf(d1) * sq) / 100 };
}

export interface Leg { kind: OptType | 'stock'; side: 1 | -1; strike: number; qty: number; premium: number }

/** Strategy value at expiry for one underlying price, per share (× multiplier outside). */
export function payoffAtExpiry(legs: Leg[], S: number, spot0: number): number {
  return legs.reduce((a, l) => {
    if (l.kind === 'stock') return a + l.side * l.qty * (S - spot0);
    const intr = Math.max(0, l.kind === 'call' ? S - l.strike : l.strike - S);
    return a + l.side * l.qty * (intr - l.premium);
  }, 0);
}

export function valueNow(legs: Leg[], S: number, spot0: number, T: number, r: number, v: number): number {
  return legs.reduce((a, l) => (l.kind === 'stock' ? a + l.side * l.qty * (S - spot0) : a + l.side * l.qty * (blackScholes(l.kind, S, l.strike, T, r, v).price - l.premium)), 0);
}

export const PRESETS: { id: string; name: string; legs: (S: number, w: number) => Omit<Leg, 'premium'>[] }[] = [
  { id: 'lc', name: 'Long call', legs: S => [{ kind: 'call', side: 1, strike: S, qty: 1 }] },
  { id: 'lp', name: 'Long put', legs: S => [{ kind: 'put', side: 1, strike: S, qty: 1 }] },
  { id: 'cc', name: 'Covered call', legs: (S, w) => [{ kind: 'stock', side: 1, strike: S, qty: 1 }, { kind: 'call', side: -1, strike: S + w, qty: 1 }] },
  { id: 'csp', name: 'Cash-secured put', legs: (S, w) => [{ kind: 'put', side: -1, strike: S - w, qty: 1 }] },
  { id: 'bcs', name: 'Bull call spread', legs: (S, w) => [{ kind: 'call', side: 1, strike: S, qty: 1 }, { kind: 'call', side: -1, strike: S + w, qty: 1 }] },
  { id: 'bps', name: 'Bear put spread', legs: (S, w) => [{ kind: 'put', side: 1, strike: S, qty: 1 }, { kind: 'put', side: -1, strike: S - w, qty: 1 }] },
  { id: 'str', name: 'Long straddle', legs: S => [{ kind: 'call', side: 1, strike: S, qty: 1 }, { kind: 'put', side: 1, strike: S, qty: 1 }] },
  { id: 'stg', name: 'Long strangle', legs: (S, w) => [{ kind: 'call', side: 1, strike: S + w, qty: 1 }, { kind: 'put', side: 1, strike: S - w, qty: 1 }] },
  { id: 'ic', name: 'Iron condor', legs: (S, w) => [{ kind: 'put', side: 1, strike: S - 2 * w, qty: 1 }, { kind: 'put', side: -1, strike: S - w, qty: 1 }, { kind: 'call', side: -1, strike: S + w, qty: 1 }, { kind: 'call', side: 1, strike: S + 2 * w, qty: 1 }] },
];
