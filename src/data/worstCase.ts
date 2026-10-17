// Dev-only stress data (break-ui): `?data=worst|one|empty|huge` swaps the real journal for these fixtures at the
// data boundary (useAccountTrades / useEnriched), so screens are tested exactly as real data reaches them.
import type { Trade, TradeNote } from '@/core/types';

export type DataMode = 'real' | 'worst' | 'one' | 'empty' | 'huge';
export const DATA_MODES: DataMode[] = ['real', 'worst', 'one', 'empty', 'huge'];

export function dataMode(): DataMode {
  if (!import.meta.env.DEV || typeof location === 'undefined') return 'real';
  const m = new URLSearchParams(location.search).get('data');
  return (DATA_MODES as string[]).includes(m ?? '') ? (m as DataMode) : 'real';
}

const ts = (d: Date) => `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:00`;
const ago = (days: number, h = 10, m = 0) => { const d = new Date(); d.setDate(d.getDate() - days); d.setHours(h, m, 0, 0); return d; };

function trade(i: number, o: Partial<Trade> & { closeAgo: number; holdMin?: number }): Trade {
  const close = ago(o.closeAgo, 9 + (i % 10), (i * 7) % 60);
  const open = new Date(close.getTime() - (o.holdMin ?? 45) * 60_000);
  return {
    id: String(o.id ?? 90_000_000 + i), account: 'WORST-1', openTime: ts(open), closeTime: ts(close), symbol: o.symbol ?? 'EURUSD', type: o.type ?? 'buy',
    volume: o.volume ?? 1, openPrice: o.openPrice ?? 1.08345, closePrice: o.closePrice ?? 1.08412, sl: o.sl ?? 1.0821, tp: o.tp ?? 1.0861,
    commission: o.commission ?? -7, swap: o.swap ?? 0, profit: o.profit ?? 67,
  };
}

// Realistic extremes, spread across the first rows: long broker suffixes, seven-figure results, micro lots, zero-second and multi-week holds.
const WORST: Trade[] = [
  trade(0, { closeAgo: 0, symbol: 'XAUUSD.PRO-ECN', volume: 100, openPrice: 2312.45, closePrice: 2441.18, sl: 2290.1, tp: 2450, profit: 1_287_300, commission: -2_732.11, holdMin: 60 * 24 * 19 }),
  trade(1, { closeAgo: 0, symbol: 'US30.cash', type: 'sell', volume: 25, openPrice: 39_120.5, closePrice: 39_515.3, sl: 39_300, profit: -98_700.43, commission: -65 }),
  trade(2, { closeAgo: 1, symbol: 'BTCUSD', volume: 0.01, openPrice: 67_250.12, closePrice: 67_250.55, sl: 0, tp: 0, profit: 0.004, commission: 0, holdMin: 0 }),
  trade(3, { closeAgo: 1, symbol: 'GBPJPY', type: 'sell', volume: 0.01, profit: -0.01, commission: 0, sl: '', tp: '' }),
  trade(4, { closeAgo: 2, symbol: 'NAS100_SB', volume: 3.5, openPrice: 18_250.25, closePrice: 18_190.5, sl: 18_100, profit: -4_181.9 }),
  ...Array.from({ length: 35 }, (_, k) => trade(5 + k, { closeAgo: 3 + k * 2, symbol: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD.PRO-ECN', 'AUDCAD'][k % 5], type: k % 3 ? 'buy' : 'sell', profit: (k % 4 === 0 ? -1 : 1) * (120 + k * 37.5) })),
];

const NOTES: Record<string, TradeNote> = {
  '90000000': { tags: ['London open liquidity sweep into H4 demand', 'second retest after news'], mistakes: ['Moved stop to breakeven too early', 'Oversized'], note: 'Held through NFP.', grade: 'A' },
  '90000001': { tags: ['NY reversal'], mistakes: ['Revenge trade'] },
  '90000004': { tags: ['Ünïcödé · 東京セッション · سشن'], grade: 'D' },
};

const ONE = [trade(0, { closeAgo: 0 })];
const huge = () => Array.from({ length: 1500 }, (_, k) => trade(k, { closeAgo: Math.floor(k / 4), symbol: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'US30'][k % 5], type: k % 2 ? 'buy' : 'sell', profit: (k % 3 === 0 ? -1 : 1) * (40 + (k % 17) * 12.3) }));
let hugeCache: Trade[] | null = null;

export function fixtureTrades(m: DataMode): Trade[] | null {
  if (m === 'real') return null;
  if (m === 'worst') return WORST;
  if (m === 'one') return ONE;
  if (m === 'empty') return [];
  return (hugeCache ??= huge());
}
export const fixtureNotes = (m: DataMode): Record<string, TradeNote> | null => (m === 'worst' ? NOTES : m === 'real' ? null : {});
