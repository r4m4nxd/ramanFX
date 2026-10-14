// RamanFX symbol → TradingView symbol for the chart widgets. Default feed: Pepperstone (matches the broker's own prices).
// Pepperstone's TradingView names follow its MT4/MT5 names (NAS100, US500, SPOTCRUDE…); normalised names are mapped back.
const PEPPER: Record<string, string> = {
  US100: 'NAS100', USTEC: 'NAS100', NDX: 'NAS100', SPX500: 'US500', DJ30: 'US30', DE40: 'GER40', DAX: 'GER40', FTSE100: 'UK100',
  JP225: 'JPN225', NIKKEI: 'JPN225', EU50: 'EUSTX50', STOXX50: 'EUSTX50', ESP35: 'SPA35', F40: 'FRA40', CAC40: 'FRA40', ASX200: 'AUS200',
  USOIL: 'SPOTCRUDE', WTI: 'SPOTCRUDE', XTIUSD: 'SPOTCRUDE', UKOIL: 'SPOTBRENT', BRENT: 'SPOTBRENT', XBRUSD: 'SPOTBRENT',
  NGAS: 'NATGAS', XNGUSD: 'NATGAS', XCUUSD: 'COPPER',
};
// Not on Pepperstone's feed.
const OTHER: Record<string, string> = { DXY: 'TVC:DXY', USDX: 'TVC:DXY' };

/** Symbol without broker suffixes (XAUUSD.s → XAUUSD, #NAS100 → NAS100). */
export const bareSymbol = (raw: string) => raw.trim().toUpperCase().replace(/^[#.!]/, '').replace(/[._\-+!].*$/, '');

export function tvSymbol(sym: string): string {
  const s = bareSymbol(sym);
  if (OTHER[s]) return OTHER[s];
  return `PEPPERSTONE:${PEPPER[s] ?? s}`;
}

export const TV_INTERVAL: Record<string, string> = { M1: '1', M5: '5', M15: '15', H1: '60', H4: '240', D1: 'D' };
