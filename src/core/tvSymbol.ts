// RamanFX symbol → TradingView symbol for the live chart widget (CFD names differ per broker; OANDA/TVC cover them).
const MAP: Record<string, string> = {
  US100: 'OANDA:NAS100USD', US500: 'OANDA:SPX500USD', US30: 'OANDA:US30USD', US2000: 'OANDA:US2000USD',
  GER40: 'OANDA:DE30EUR', UK100: 'OANDA:UK100GBP', JP225: 'OANDA:JP225USD', AUS200: 'OANDA:AU200AUD',
  FRA40: 'OANDA:FR40EUR', HK50: 'OANDA:HK33HKD', EU50: 'OANDA:EU50EUR', ESP35: 'OANDA:ESPIXEUR',
  USOIL: 'TVC:USOIL', UKOIL: 'TVC:UKOIL', NGAS: 'OANDA:NATGASUSD', XNGUSD: 'OANDA:NATGASUSD', XCUUSD: 'OANDA:XCUUSD', COPPER: 'OANDA:XCUUSD',
  BTCUSD: 'BITSTAMP:BTCUSD', ETHUSD: 'BITSTAMP:ETHUSD', DXY: 'TVC:DXY', USDX: 'TVC:DXY',
};
const CRYPTO = /^(BTC|ETH|SOL|XRP|LTC|BCH|ADA|DOGE|DOT|LINK|AVAX|BNB|MATIC|TRX|XLM|UNI|SHIB)USD$/;

export function tvSymbol(sym: string): string {
  if (MAP[sym]) return MAP[sym];
  if (CRYPTO.test(sym)) return `COINBASE:${sym}`;
  if (/^[A-Z]{6}$/.test(sym)) return `OANDA:${sym}`; // FX pairs and metals (XAUUSD, XAGUSD, XAUAUD…)
  return sym;
}

export const TV_INTERVAL: Record<string, string> = { M1: '1', M5: '5', M15: '15', H1: '60', H4: '240', D1: 'D' };
