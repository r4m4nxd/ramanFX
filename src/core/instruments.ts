import type { InstrumentOverride, Trade } from './types';
import { CURRENCIES, LIBRARY, findCfd, findFuture, type AssetClass, type LibraryInstrument, type Venue } from './library';

// Contract specs come from the instrument library (src/core/library.ts). Broker CFDs still
// differ (index contract sizes, gold "pip" conventions), so the app prefers the per-symbol value
// it measures from the user's own closed trades and lets them override any field.

export interface InstrumentSpec {
  symbol: string;        // normalised (no broker suffix)
  name: string;
  assetClass: AssetClass;
  venue: Venue;
  quote: string;         // currency P&L is denominated in before conversion
  contractSize: number;
  pipSize: number;
  tickSize: number;
  /** Value of a 1.0 price move per lot/contract in QUOTE currency. */
  pointValue: number;
  digits: number;
  known: boolean;        // found in the library
}

const METAL_CODES = ['XAU', 'XAG', 'XPT', 'XPD', 'XCU'];

/** Strip broker suffixes/prefixes: "EURUSD.r", "XAUUSDm", "#US30", "GBPJPY+", "US30.cash" → core symbol. */
export function normalizeSymbol(raw: string): string {
  const s = raw.trim().toUpperCase().replace(/^[#.!]/, '');
  const six = /^([A-Z]{3})([A-Z]{3})/.exec(s);
  if (six && (CURRENCIES.includes(six[1]) || METAL_CODES.includes(six[1])) && CURRENCIES.includes(six[2])) return six[1] + six[2];
  const crypto = /^([A-Z]{2,5})(USDT|USD)/.exec(s);
  if (crypto && findCfd(`${crypto[1]}USD`)) return `${crypto[1]}USD`;
  const base = s.replace(/[._\-+!].*$/, '');
  const noSuffix = base.replace(/(ECN|PRO|RAW|MICRO|CASH|SPOT|M)$/, '');
  return findCfd(s)?.symbol ?? findCfd(base)?.symbol ?? findCfd(noSuffix)?.symbol ?? base;
}

function decimals(step: number): number {
  if (!isFinite(step) || step <= 0) return 2;
  const s = step.toExponential();
  const [m, e] = s.split('e');
  const md = m.includes('.') ? m.split('.')[1].length : 0;
  return Math.max(0, md - Number(e));
}

function fromLibrary(i: LibraryInstrument, symbol = i.symbol): InstrumentSpec {
  return {
    symbol, name: i.name, assetClass: i.assetClass, venue: i.venue, quote: i.quote,
    contractSize: i.contractSize, pipSize: i.pipSize, tickSize: i.tickSize,
    pointValue: i.pointValue ?? i.contractSize, digits: decimals(i.tickSize), known: true,
  };
}

/** Resolve a broker symbol (or futures code with venue = futures) to its contract spec. */
export function specFor(raw: string, override?: InstrumentOverride, opts: { futures?: boolean } = {}): InstrumentSpec {
  let spec: InstrumentSpec;
  const fut = opts.futures ? findFuture(raw) : undefined;
  if (fut) spec = fromLibrary(fut);
  else {
    const symbol = normalizeSymbol(raw);
    const lib = findCfd(symbol);
    if (lib) spec = fromLibrary(lib, symbol);
    else {
      const six = /^([A-Z]{3})([A-Z]{3})$/.exec(symbol);
      if (six && CURRENCIES.includes(six[1]) && CURRENCIES.includes(six[2])) {
        // Unlisted FX pair: standard 100k lot, JPY/HUF pip 0.01.
        const pip = six[2] === 'JPY' || six[2] === 'HUF' ? 0.01 : 0.0001;
        spec = { symbol, name: `${six[1]} / ${six[2]}`, assetClass: 'forex', venue: 'CFD', quote: six[2], contractSize: 100_000, pipSize: pip, tickSize: pip / 10, pointValue: 100_000, digits: decimals(pip / 10), known: false };
      } else {
        spec = { symbol, name: symbol, assetClass: 'other', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, pointValue: 1, digits: 2, known: false };
      }
    }
  }
  if (override) {
    if (override.contractSize) { spec.contractSize = override.contractSize; if (spec.venue === 'CFD') spec.pointValue = override.contractSize; }
    if (override.pipSize) spec.pipSize = override.pipSize;
    if (override.tickSize) { spec.tickSize = override.tickSize; spec.digits = decimals(override.tickSize); }
  }
  return spec;
}

export { LIBRARY };

const median = (xs: number[]) => {
  const a = [...xs].sort((x, y) => x - y);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
};

/**
 * Account-currency value of a 1.0 price move for 1 lot, per normalised symbol, measured from
 * closed trades: |gross profit| ÷ |close − open| ÷ lots. Gross profit excludes commission and
 * swap, so this equals pointValue × quote→account FX rate as the broker actually applied it.
 * The median resists outliers from partial closes and odd fills.
 */
export function measuredUnitValues(trades: Trade[]): Record<string, number> {
  const bucket: Record<string, number[]> = {};
  for (const t of trades) {
    const move = Math.abs(t.closePrice - t.openPrice);
    if (!(move > 0) || !(t.volume > 0) || !t.profit) continue;
    const dirMove = t.type === 'buy' ? t.closePrice - t.openPrice : t.openPrice - t.closePrice;
    if (Math.sign(dirMove) !== Math.sign(t.profit)) continue;
    const v = Math.abs(t.profit) / move / t.volume;
    if (!isFinite(v)) continue;
    (bucket[normalizeSymbol(t.symbol)] ??= []).push(v);
  }
  const out: Record<string, number> = {};
  for (const [k, xs] of Object.entries(bucket)) out[k] = median(xs);
  return out;
}

/**
 * Value of a 1.0 price move per lot in ACCOUNT currency: the measured value when available,
 * otherwise the spec's point value converted with `quoteToAccount` (1 when quote = account ccy).
 */
export function unitValue(spec: InstrumentSpec, measured: Record<string, number>, quoteToAccount = 1): { value: number; source: 'measured' | 'spec' } {
  const m = spec.venue === 'CFD' ? measured[spec.symbol] : undefined;
  if (m) return { value: m, source: 'measured' };
  return { value: spec.pointValue * quoteToAccount, source: 'spec' };
}

export const pipValuePerLot = (unit: number, spec: InstrumentSpec) => unit * spec.pipSize;
export const tickValuePerLot = (unit: number, spec: InstrumentSpec) => unit * spec.tickSize;
export const pipsBetween = (a: number, b: number, spec: InstrumentSpec) => Math.abs(a - b) / spec.pipSize;
export const ticksBetween = (a: number, b: number, spec: InstrumentSpec) => Math.abs(a - b) / spec.tickSize;

export interface SizeInput {
  riskAmount: number;   // account currency
  entry: number;
  stop: number;
  unitValue: number;    // value of 1.0 price move per lot/contract, account currency
  lotStep?: number;
  minLot?: number;
  maxLot?: number;
}

export interface SizeResult {
  lots: number;          // floored to lotStep so risk never exceeds the budget
  rawLots: number;
  stopDistance: number;
  riskAtLots: number;
  tooSmall: boolean;
}

export function positionSize({ riskAmount, entry, stop, unitValue, lotStep = 0.01, minLot = 0.01, maxLot = 100 }: SizeInput): SizeResult | null {
  const dist = Math.abs(entry - stop);
  if (!(dist > 0) || !(unitValue > 0) || !(riskAmount > 0)) return null;
  const rawLots = riskAmount / (dist * unitValue);
  let lots = Math.floor(rawLots / lotStep + 1e-9) * lotStep;
  lots = Math.min(maxLot, +lots.toFixed(decimals(lotStep)));
  return { lots, rawLots, stopDistance: dist, riskAtLots: lots * dist * unitValue, tooSmall: lots < minLot };
}
