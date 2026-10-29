import type { Trend } from './types';

// ETF = entry timeframe, ITF = intermediate, HTF = higher.
export const TIMEFRAME_COMBOS = [
  { etf: '1m', itf: '5m', htf: '15m' },
  { etf: '5m', itf: '15m', htf: 'H1' },
  { etf: '15m', itf: 'H1', htf: 'H4' },
  { etf: 'H1', itf: 'H4', htf: '1D' },
  { etf: 'H4', itf: '1D', htf: '1W' },
  { etf: '1D', itf: '1M', htf: '3M' },
] as const;
export type Combo = (typeof TIMEFRAME_COMBOS)[number];

/** Zone timeframe → timeframe to look for confirmation on. */
export const ZONE_CONFIRM: Record<string, string> = { '15m': '1m', H1: '5m', H4: '15m', '1D': 'H1', '1W': 'H4', '1M': '1D' };

type Rel = 'w' | 'a' | 's'; // with trade direction, against, sideways
interface Row { htf: Rel[]; itf: Rel[]; etf: Rel[]; zone: 'etf' | 'itf' | 'htf'; confirm: 'map' | 'etf' | 'itf'; setAndForget: boolean; halfRisk: boolean }

export const ALIGN_MATRIX: Row[] = [
  { htf: ['w'], itf: ['w'], etf: ['w'], zone: 'etf', confirm: 'map', setAndForget: true, halfRisk: false },
  { htf: ['w'], itf: ['w'], etf: ['s', 'a'], zone: 'itf', confirm: 'map', setAndForget: false, halfRisk: false },
  { htf: ['w'], itf: ['a', 's'], etf: ['s', 'a'], zone: 'htf', confirm: 'etf', setAndForget: false, halfRisk: false },
  { htf: ['s'], itf: ['a', 's'], etf: ['s', 'a'], zone: 'htf', confirm: 'itf', setAndForget: false, halfRisk: true },
];

export interface Play {
  dir: 'long' | 'short';
  row: number;
  zone: 'ETF' | 'ITF' | 'HTF';
  zoneTf: string;
  confirmTf: string | null;
  setAndForget: boolean;
  halfRisk: boolean;
  text: string;
}

export function alignmentPlays(t: { htf?: Trend | null; itf?: Trend | null; etf?: Trend | null }, combo: Combo): Play[] | null {
  if (!t.htf || !t.itf || !t.etf) return null;
  const plays: Play[] = [];
  for (const [dir, withT] of [['long', 'up'], ['short', 'down']] as const) {
    const rel = (x: Trend): Rel => (x === 'side' ? 's' : x === withT ? 'w' : 'a');
    ALIGN_MATRIX.forEach((m, i) => {
      if (!m.htf.includes(rel(t.htf!)) || !m.itf.includes(rel(t.itf!)) || !m.etf.includes(rel(t.etf!))) return;
      const zoneTf = combo[m.zone];
      const confirmTf = m.confirm === 'map' ? ZONE_CONFIRM[zoneTf] ?? null : combo[m.confirm];
      const side = dir === 'long' ? 'Longs' : 'Shorts';
      const conf = confirmTf ? `confirm on ${confirmTf}` : 'no lower confirmation timeframe in your map';
      const text = m.setAndForget
        ? `Set and forget ${side.toLowerCase()} at the nearest ETF zone (${zoneTf}), or confirmation ${side.toLowerCase()} there, ${conf}.`
        : `Confirmation ${side.toLowerCase()} in the nearest ${m.zone.toUpperCase()} zone (${zoneTf}), ${conf}${m.halfRisk ? ' — half risk' : ''}.`;
      plays.push({ dir, row: i + 1, zone: m.zone.toUpperCase() as Play['zone'], zoneTf, confirmTf, setAndForget: m.setAndForget, halfRisk: m.halfRisk, text });
    });
  }
  return plays;
}
