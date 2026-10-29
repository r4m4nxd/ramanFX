// Instrument library: every major/minor/exotic FX pair, spot metals, CFD indices, energies,
// crypto CFDs and the main CME/CBOT/NYMEX/COMEX/ICE/Eurex/CBOE futures.
//
// Units
//  - pipSize / tickSize are in PRICE units.
//  - CFD/FX: contractSize = units per 1.0 lot; value of a 1.0 price move per lot = contractSize (in quote ccy).
//  - Futures: pointValue = value of a 1.0 price move per contract (quote ccy); tickValue = pointValue × tickSize.
// Futures specs: exchange contract specs (CME Group, ICE, Eurex, CBOE). Broker CFD specs vary — the app
// measures the real per-symbol value from closed trades and lets the user override any field.

export type AssetClass = 'forex' | 'metal' | 'index' | 'energy' | 'crypto' | 'softs' | 'rates' | 'agri' | 'livestock' | 'volatility' | 'other';
export type Venue = 'CFD' | 'CME' | 'CBOT' | 'NYMEX' | 'COMEX' | 'ICE' | 'EUREX' | 'CBOE';

export interface LibraryInstrument {
  symbol: string;
  name: string;
  assetClass: AssetClass;
  venue: Venue;
  quote: string;
  /** CFD/FX units per lot. For futures, the contract's underlying quantity (informational). */
  contractSize: number;
  pipSize: number;
  tickSize: number;
  /** Futures only: value of a 1.0 price move per contract, in quote currency. */
  pointValue?: number;
  unit?: string;
  aliases?: string[];
}

// ─── Forex ─────────────────────────────────────────────────────────────
const CCY_NAMES: Record<string, string> = {
  USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', JPY: 'Japanese Yen', AUD: 'Australian Dollar', NZD: 'New Zealand Dollar',
  CAD: 'Canadian Dollar', CHF: 'Swiss Franc', SEK: 'Swedish Krona', NOK: 'Norwegian Krone', DKK: 'Danish Krone', SGD: 'Singapore Dollar',
  HKD: 'Hong Kong Dollar', ZAR: 'South African Rand', MXN: 'Mexican Peso', TRY: 'Turkish Lira', PLN: 'Polish Zloty', CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint', CNH: 'Offshore Yuan', ILS: 'Israeli Shekel', THB: 'Thai Baht', RUB: 'Russian Ruble', INR: 'Indian Rupee',
};
export const CURRENCIES = Object.keys(CCY_NAMES);

const FX_PAIRS = [
  // Majors
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'USDCAD', 'AUDUSD', 'NZDUSD',
  // EUR crosses
  'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD', 'EURSEK', 'EURNOK', 'EURDKK', 'EURPLN', 'EURHUF', 'EURCZK', 'EURTRY', 'EURZAR', 'EURSGD', 'EURHKD', 'EURMXN', 'EURCNH', 'EURILS',
  // GBP crosses
  'GBPJPY', 'GBPCHF', 'GBPAUD', 'GBPCAD', 'GBPNZD', 'GBPSEK', 'GBPNOK', 'GBPDKK', 'GBPPLN', 'GBPSGD', 'GBPZAR', 'GBPTRY', 'GBPHKD', 'GBPMXN',
  // AUD / NZD / CAD / CHF crosses
  'AUDJPY', 'AUDCHF', 'AUDCAD', 'AUDNZD', 'AUDSGD', 'AUDHKD', 'AUDCNH',
  'NZDJPY', 'NZDCHF', 'NZDCAD', 'NZDSGD',
  'CADJPY', 'CADCHF', 'CADSGD', 'CHFJPY', 'CHFSGD', 'SGDJPY', 'HKDJPY', 'NOKJPY', 'SEKJPY', 'ZARJPY', 'TRYJPY', 'MXNJPY', 'CNHJPY', 'NOKSEK',
  // USD exotics
  'USDSEK', 'USDNOK', 'USDDKK', 'USDSGD', 'USDHKD', 'USDZAR', 'USDMXN', 'USDTRY', 'USDPLN', 'USDCZK', 'USDHUF', 'USDCNH', 'USDILS', 'USDTHB', 'USDRUB', 'USDINR',
];

/**
 * Pip convention (MT4/MT5 retail standard, matches Myfxbook): 0.01 when the quote currency is JPY or HUF
 * (quoted to 3 decimals), 0.0001 for everything else — including CZK, THB, INR, MXN, ZAR, TRY. A few
 * brokers (e.g. IG) use 0.001 for CZK; the app's measured per-symbol value is unaffected by pip size.
 */
const fxPip = (quote: string) => (quote === 'JPY' || quote === 'HUF' ? 0.01 : 0.0001);

const forex: LibraryInstrument[] = FX_PAIRS.map(p => {
  const base = p.slice(0, 3), quote = p.slice(3);
  const pip = fxPip(quote);
  return { symbol: p, name: `${CCY_NAMES[base]} / ${CCY_NAMES[quote]}`, assetClass: 'forex', venue: 'CFD', quote, contractSize: 100_000, pipSize: pip, tickSize: pip / 10, unit: base };
});

// ─── Spot metals (CFD) ─────────────────────────────────────────────────
// Gold "pip" = 0.10 (the common MT5 trader convention: $1 move = 10 pips; 1 lot = 100 oz ⇒ $10/pip).
// Some sites (e.g. OANDA) call 0.01 a gold pip — override pipSize per symbol if you count that way.
// Silver pip = 0.01 (5,000 oz ⇒ $50/pip). Platinum/palladium 100 oz is broker-dependent.
const metals: LibraryInstrument[] = [
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', assetClass: 'metal', venue: 'CFD', quote: 'USD', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz', aliases: ['GOLD'] },
  { symbol: 'XAUEUR', name: 'Gold / Euro', assetClass: 'metal', venue: 'CFD', quote: 'EUR', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XAUGBP', name: 'Gold / British Pound', assetClass: 'metal', venue: 'CFD', quote: 'GBP', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XAUAUD', name: 'Gold / Australian Dollar', assetClass: 'metal', venue: 'CFD', quote: 'AUD', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XAUCHF', name: 'Gold / Swiss Franc', assetClass: 'metal', venue: 'CFD', quote: 'CHF', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XAUJPY', name: 'Gold / Japanese Yen', assetClass: 'metal', venue: 'CFD', quote: 'JPY', contractSize: 100, pipSize: 10, tickSize: 1, unit: 'oz' },
  { symbol: 'XAGUSD', name: 'Silver / US Dollar', assetClass: 'metal', venue: 'CFD', quote: 'USD', contractSize: 5000, pipSize: 0.01, tickSize: 0.001, unit: 'oz', aliases: ['SILVER'] },
  { symbol: 'XAGEUR', name: 'Silver / Euro', assetClass: 'metal', venue: 'CFD', quote: 'EUR', contractSize: 5000, pipSize: 0.01, tickSize: 0.001, unit: 'oz' },
  { symbol: 'XPTUSD', name: 'Platinum / US Dollar', assetClass: 'metal', venue: 'CFD', quote: 'USD', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XPDUSD', name: 'Palladium / US Dollar', assetClass: 'metal', venue: 'CFD', quote: 'USD', contractSize: 100, pipSize: 0.1, tickSize: 0.01, unit: 'oz' },
  { symbol: 'XCUUSD', name: 'Copper / US Dollar', assetClass: 'metal', venue: 'CFD', quote: 'USD', contractSize: 25000, pipSize: 0.0001, tickSize: 0.0001, unit: 'lb', aliases: ['COPPER'] },
];

// ─── Index CFDs (contract = 1 × index, point = 1.0) ───────────────────
const idx = (symbol: string, name: string, quote: string, aliases: string[] = []): LibraryInstrument =>
  ({ symbol, name, assetClass: 'index', venue: 'CFD', quote, contractSize: 1, pipSize: 1, tickSize: 0.01, unit: 'index', aliases });
const indices: LibraryInstrument[] = [
  idx('US30', 'Dow Jones 30', 'USD', ['DJ30', 'DJI', 'WS30', 'USA30', 'DOW']),
  idx('US100', 'Nasdaq 100', 'USD', ['NAS100', 'NDX', 'USTEC', 'USA100', 'NQ100']),
  idx('US500', 'S&P 500', 'USD', ['SPX500', 'SPX', 'USA500', 'SP500']),
  idx('US2000', 'Russell 2000', 'USD', ['RUSSELL', 'RUT', 'US2K']),
  idx('GER40', 'Germany 40 (DAX)', 'EUR', ['DE40', 'DAX40', 'GER30', 'DE30', 'DAX']),
  idx('UK100', 'UK 100 (FTSE)', 'GBP', ['FTSE100', 'FTSE']),
  idx('FRA40', 'France 40 (CAC)', 'EUR', ['CAC40', 'F40']),
  idx('EU50', 'Euro Stoxx 50', 'EUR', ['STOXX50', 'EUSTX50', 'SX5E']),
  idx('ESP35', 'Spain 35 (IBEX)', 'EUR', ['IBEX35', 'SPA35']),
  idx('ITA40', 'Italy 40 (FTSE MIB)', 'EUR', ['IT40']),
  idx('NETH25', 'Netherlands 25 (AEX)', 'EUR', ['AEX25']),
  idx('SWI20', 'Switzerland 20 (SMI)', 'CHF', ['SMI20', 'SUI20']),
  idx('JP225', 'Japan 225 (Nikkei)', 'JPY', ['JPN225', 'NIK225', 'NIKKEI']),
  idx('AUS200', 'Australia 200 (ASX)', 'AUD', ['ASX200']),
  idx('HK50', 'Hong Kong 50 (Hang Seng)', 'HKD', ['HSI50', 'HSI']),
  idx('CHINA50', 'China A50', 'USD', ['CN50', 'CHINAA50']),
  idx('SING30', 'Singapore 30', 'SGD', ['SG30']),
  idx('INDIA50', 'India 50 (Nifty)', 'USD', ['NIFTY50', 'IND50']),
  idx('VIX', 'Volatility Index', 'USD', ['VOLX']),
  idx('DXY', 'US Dollar Index', 'USD', ['USDX', 'USDINDEX']),
];

// ─── Energy CFDs ───────────────────────────────────────────────────────
// Oil: 1 lot = 100 bbl at most MT5 retail/prop brokers (IC Markets XTIUSD/XBRUSD, Pepperstone, FTMO
// USOIL.cash); some use 1,000 bbl (CME-sized) or 10 bbl (Axi, FXCM). The measured value wins.
const energy: LibraryInstrument[] = [
  { symbol: 'USOIL', name: 'WTI Crude Oil', assetClass: 'energy', venue: 'CFD', quote: 'USD', contractSize: 100, pipSize: 0.01, tickSize: 0.001, unit: 'bbl', aliases: ['WTI', 'XTIUSD', 'CL-OIL', 'USCRUDE', 'OILUSD', 'SPOTCRUDE', 'CRUDE', 'CRUDEOIL'] },
  { symbol: 'UKOIL', name: 'Brent Crude Oil', assetClass: 'energy', venue: 'CFD', quote: 'USD', contractSize: 100, pipSize: 0.01, tickSize: 0.001, unit: 'bbl', aliases: ['BRENT', 'XBRUSD', 'BRN', 'SPOTBRENT'] },
  { symbol: 'NATGAS', name: 'Natural Gas', assetClass: 'energy', venue: 'CFD', quote: 'USD', contractSize: 10000, pipSize: 0.001, tickSize: 0.001, unit: 'MMBtu', aliases: ['XNGUSD', 'NGAS', 'NG-C', 'NATURALGAS'] },
  { symbol: 'GASOLINE', name: 'Gasoline (RBOB)', assetClass: 'energy', venue: 'CFD', quote: 'USD', contractSize: 1000, pipSize: 0.0001, tickSize: 0.0001, unit: 'gal', aliases: ['RBOB', 'UGAS'] },
  { symbol: 'HEATINGOIL', name: 'Heating Oil', assetClass: 'energy', venue: 'CFD', quote: 'USD', contractSize: 1000, pipSize: 0.0001, tickSize: 0.0001, unit: 'gal', aliases: ['HOIL'] },
];

// ─── Agricultural & soft CFDs (contract sizes vary most by broker — your fills win) ───
const agriCfd: LibraryInstrument[] = [
  { symbol: 'SOYBEANS', name: 'Soybeans', assetClass: 'agri', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/bu', aliases: ['SOYBEAN', 'SOYB'] },
  { symbol: 'CORN', name: 'Corn', assetClass: 'agri', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/bu' },
  { symbol: 'WHEAT', name: 'Wheat', assetClass: 'agri', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/bu' },
  { symbol: 'COFFEE', name: 'Coffee', assetClass: 'softs', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/lb' },
  { symbol: 'SUGAR', name: 'Sugar', assetClass: 'softs', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/lb' },
  { symbol: 'COCOA', name: 'Cocoa', assetClass: 'softs', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 1, tickSize: 1, unit: '$/t' },
  { symbol: 'COTTON', name: 'Cotton', assetClass: 'softs', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: 0.01, tickSize: 0.01, unit: '¢/lb' },
];

// ─── Crypto CFDs (1 lot = 1 coin) ──────────────────────────────────────
// Crypto has no standard pip. We use $1 for high-priced coins, $0.01 for mid-priced and $0.0001 for
// sub-dollar coins so a "pip" is always a small fraction of price.
const cry = (c: string, name: string, tick = 0.01, pip = 1): LibraryInstrument =>
  ({ symbol: `${c}USD`, name: `${name} / US Dollar`, assetClass: 'crypto', venue: 'CFD', quote: 'USD', contractSize: 1, pipSize: pip, tickSize: tick, unit: c, aliases: [`${c}USDT`, c] });
const crypto: LibraryInstrument[] = [
  cry('BTC', 'Bitcoin'), cry('ETH', 'Ethereum'), cry('BNB', 'BNB'),
  cry('SOL', 'Solana', 0.01, 0.01), cry('LTC', 'Litecoin', 0.01, 0.01),
  cry('DOT', 'Polkadot', 0.001, 0.01), cry('AVAX', 'Avalanche', 0.001, 0.01), cry('LINK', 'Chainlink', 0.001, 0.01),
  cry('XRP', 'Ripple', 0.00001, 0.0001), cry('ADA', 'Cardano', 0.00001, 0.0001), cry('DOGE', 'Dogecoin', 0.00001, 0.0001),
];

// ─── Futures ───────────────────────────────────────────────────────────
const fut = (symbol: string, name: string, assetClass: AssetClass, venue: Venue, tickSize: number, tickValue: number, quote = 'USD', contractSize = 1, unit = '', aliases: string[] = []): LibraryInstrument =>
  ({ symbol, name, assetClass, venue, quote, contractSize, pipSize: tickSize, tickSize, pointValue: tickValue / tickSize, unit, aliases });

const futures: LibraryInstrument[] = [
  // Equity index — CME / CBOT
  fut('ES', 'E-mini S&P 500', 'index', 'CME', 0.25, 12.5, 'USD', 50, '$50 × index'),
  fut('MES', 'Micro E-mini S&P 500', 'index', 'CME', 0.25, 1.25, 'USD', 5, '$5 × index'),
  fut('NQ', 'E-mini Nasdaq-100', 'index', 'CME', 0.25, 5, 'USD', 20, '$20 × index'),
  fut('MNQ', 'Micro E-mini Nasdaq-100', 'index', 'CME', 0.25, 0.5, 'USD', 2, '$2 × index'),
  fut('YM', 'E-mini Dow ($5)', 'index', 'CBOT', 1, 5, 'USD', 5, '$5 × index'),
  fut('MYM', 'Micro E-mini Dow', 'index', 'CBOT', 1, 0.5, 'USD', 0.5, '$0.50 × index'),
  fut('RTY', 'E-mini Russell 2000', 'index', 'CME', 0.1, 5, 'USD', 50, '$50 × index'),
  fut('M2K', 'Micro E-mini Russell 2000', 'index', 'CME', 0.1, 0.5, 'USD', 5, '$5 × index'),
  fut('EMD', 'E-mini S&P MidCap 400', 'index', 'CME', 0.1, 10, 'USD', 100, '$100 × index'),
  fut('NKD', 'Nikkei 225 (USD)', 'index', 'CME', 5, 25, 'USD', 5, '$5 × index'),
  fut('NIY', 'Nikkei 225 (Yen)', 'index', 'CME', 5, 2500, 'JPY', 500, '¥500 × index'),
  // Eurex
  fut('FDAX', 'DAX Futures', 'index', 'EUREX', 1, 25, 'EUR', 25, '€25 × index'),
  fut('FDXM', 'Mini-DAX Futures', 'index', 'EUREX', 1, 5, 'EUR', 5, '€5 × index'),
  fut('FDXS', 'Micro-DAX Futures', 'index', 'EUREX', 1, 1, 'EUR', 1, '€1 × index'),
  fut('FESX', 'Euro Stoxx 50 Futures', 'index', 'EUREX', 1, 10, 'EUR', 10, '€10 × index'),
  fut('FGBL', 'Euro-Bund', 'rates', 'EUREX', 0.01, 10, 'EUR', 100000, '€100k notional'),
  fut('FGBM', 'Euro-Bobl', 'rates', 'EUREX', 0.01, 10, 'EUR', 100000, '€100k notional'),
  fut('FGBS', 'Euro-Schatz', 'rates', 'EUREX', 0.005, 5, 'EUR', 100000, '€100k notional'),
  // ICE Europe
  fut('Z', 'FTSE 100 Futures', 'index', 'ICE', 0.5, 5, 'GBP', 10, '£10 × index'),
  // Volatility
  fut('VX', 'Cboe VIX Futures', 'volatility', 'CBOE', 0.05, 50, 'USD', 1000, '$1,000 × index'),
  fut('VXM', 'Mini VIX Futures', 'volatility', 'CBOE', 0.05, 5, 'USD', 100, '$100 × index'),
  // Energy — NYMEX / ICE
  fut('CL', 'WTI Crude Oil', 'energy', 'NYMEX', 0.01, 10, 'USD', 1000, '1,000 bbl'),
  fut('MCL', 'Micro WTI Crude Oil', 'energy', 'NYMEX', 0.01, 1, 'USD', 100, '100 bbl'),
  fut('QM', 'E-mini Crude Oil', 'energy', 'NYMEX', 0.025, 12.5, 'USD', 500, '500 bbl'),
  fut('BZ', 'Brent Crude (NYMEX)', 'energy', 'NYMEX', 0.01, 10, 'USD', 1000, '1,000 bbl'),
  fut('B', 'Brent Crude (ICE)', 'energy', 'ICE', 0.01, 10, 'USD', 1000, '1,000 bbl'),
  fut('G', 'Low Sulphur Gasoil (ICE)', 'energy', 'ICE', 0.25, 25, 'USD', 100, '100 metric tonnes'),
  fut('NG', 'Henry Hub Natural Gas', 'energy', 'NYMEX', 0.001, 10, 'USD', 10000, '10,000 MMBtu'),
  fut('MNG', 'Micro Henry Hub Natural Gas', 'energy', 'NYMEX', 0.001, 1, 'USD', 1000, '1,000 MMBtu'),
  fut('QG', 'E-mini Natural Gas', 'energy', 'NYMEX', 0.005, 12.5, 'USD', 2500, '2,500 MMBtu'),
  fut('RB', 'RBOB Gasoline', 'energy', 'NYMEX', 0.0001, 4.2, 'USD', 42000, '42,000 gal'),
  fut('HO', 'NY Harbor ULSD (Heating Oil)', 'energy', 'NYMEX', 0.0001, 4.2, 'USD', 42000, '42,000 gal'),
  // Metals — COMEX / NYMEX
  fut('GC', 'Gold', 'metal', 'COMEX', 0.1, 10, 'USD', 100, '100 troy oz'),
  fut('MGC', 'Micro Gold', 'metal', 'COMEX', 0.1, 1, 'USD', 10, '10 troy oz'),
  fut('1OZ', '1-Ounce Gold', 'metal', 'COMEX', 0.25, 0.25, 'USD', 1, '1 troy oz'),
  fut('SI', 'Silver', 'metal', 'COMEX', 0.005, 25, 'USD', 5000, '5,000 troy oz'),
  fut('SIL', 'Micro Silver (1,000 oz)', 'metal', 'COMEX', 0.005, 5, 'USD', 1000, '1,000 troy oz'),
  fut('HG', 'Copper', 'metal', 'COMEX', 0.0005, 12.5, 'USD', 25000, '25,000 lb'),
  fut('MHG', 'Micro Copper', 'metal', 'COMEX', 0.0005, 1.25, 'USD', 2500, '2,500 lb'),
  fut('PL', 'Platinum', 'metal', 'NYMEX', 0.1, 5, 'USD', 50, '50 troy oz'),
  fut('PA', 'Palladium', 'metal', 'NYMEX', 0.5, 50, 'USD', 100, '100 troy oz'),
  // Currency futures — CME (USD per unit of foreign ccy; 6J quoted per yen)
  fut('6E', 'Euro FX', 'forex', 'CME', 0.00005, 6.25, 'USD', 125000, '€125,000'),
  fut('M6E', 'Micro EUR/USD', 'forex', 'CME', 0.0001, 1.25, 'USD', 12500, '€12,500'),
  fut('E7', 'E-mini Euro FX', 'forex', 'CME', 0.0001, 6.25, 'USD', 62500, '€62,500'),
  fut('6B', 'British Pound', 'forex', 'CME', 0.0001, 6.25, 'USD', 62500, '£62,500'),
  fut('M6B', 'Micro GBP/USD', 'forex', 'CME', 0.0001, 0.625, 'USD', 6250, '£6,250'),
  fut('6J', 'Japanese Yen', 'forex', 'CME', 0.0000005, 6.25, 'USD', 12500000, '¥12,500,000'),
  fut('6A', 'Australian Dollar', 'forex', 'CME', 0.00005, 5, 'USD', 100000, 'A$100,000'),
  fut('M6A', 'Micro AUD/USD', 'forex', 'CME', 0.0001, 1, 'USD', 10000, 'A$10,000'),
  fut('6C', 'Canadian Dollar', 'forex', 'CME', 0.00005, 5, 'USD', 100000, 'C$100,000'),
  fut('6S', 'Swiss Franc', 'forex', 'CME', 0.00005, 6.25, 'USD', 125000, 'CHF 125,000'),
  fut('6N', 'New Zealand Dollar', 'forex', 'CME', 0.00005, 5, 'USD', 100000, 'NZ$100,000'),
  fut('6M', 'Mexican Peso', 'forex', 'CME', 0.00001, 5, 'USD', 500000, 'MXN 500,000'),
  fut('MJY', 'Micro JPY/USD', 'forex', 'CME', 0.000001, 1.25, 'USD', 1250000, '¥1,250,000'),
  fut('MCD', 'Micro CAD/USD', 'forex', 'CME', 0.0001, 1, 'USD', 10000, 'C$10,000'),
  fut('MSF', 'Micro CHF/USD', 'forex', 'CME', 0.0001, 1.25, 'USD', 12500, 'CHF 12,500'),
  fut('DX', 'US Dollar Index (ICE)', 'forex', 'ICE', 0.005, 5, 'USD', 1000, '$1,000 × index'),
  // Interest rates — CBOT (Treasury price ticks are fractions of a point)
  fut('ZT', '2-Year T-Note', 'rates', 'CBOT', 1 / 256, 7.8125, 'USD', 200000, '$200k face'),
  fut('ZF', '5-Year T-Note', 'rates', 'CBOT', 1 / 128, 7.8125, 'USD', 100000, '$100k face'),
  fut('ZN', '10-Year T-Note', 'rates', 'CBOT', 1 / 64, 15.625, 'USD', 100000, '$100k face'),
  fut('TN', 'Ultra 10-Year T-Note', 'rates', 'CBOT', 1 / 64, 15.625, 'USD', 100000, '$100k face'),
  fut('ZB', '30-Year T-Bond', 'rates', 'CBOT', 1 / 32, 31.25, 'USD', 100000, '$100k face'),
  fut('UB', 'Ultra T-Bond', 'rates', 'CBOT', 1 / 32, 31.25, 'USD', 100000, '$100k face'),
  // SR3 tick is 0.0025 ($6.25) for contracts within 4 months of expiry, 0.005 ($12.50) for later months.
  fut('SR3', '3-Month SOFR', 'rates', 'CME', 0.0025, 6.25, 'USD', 2500, '$2,500 × index'),
  // Crypto — CME
  fut('BTC', 'Bitcoin Futures', 'crypto', 'CME', 5, 25, 'USD', 5, '5 BTC'),
  fut('MBT', 'Micro Bitcoin', 'crypto', 'CME', 5, 0.5, 'USD', 0.1, '0.1 BTC'),
  fut('ETH', 'Ether Futures', 'crypto', 'CME', 0.5, 25, 'USD', 50, '50 ETH'),
  fut('MET', 'Micro Ether', 'crypto', 'CME', 0.5, 0.05, 'USD', 0.1, '0.1 ETH'),
  fut('SOL', 'Solana Futures', 'crypto', 'CME', 0.05, 25, 'USD', 500, '500 SOL'),
  fut('MSL', 'Micro Solana', 'crypto', 'CME', 0.05, 1.25, 'USD', 25, '25 SOL'),
  fut('XRP', 'XRP Futures', 'crypto', 'CME', 0.0005, 25, 'USD', 50000, '50,000 XRP'),
  fut('MXP', 'Micro XRP', 'crypto', 'CME', 0.0005, 1.25, 'USD', 2500, '2,500 XRP'),
  // Grains — CBOT (cents per bushel)
  fut('ZC', 'Corn', 'agri', 'CBOT', 0.25, 12.5, 'USD', 5000, '5,000 bu (¢/bu)'),
  fut('ZS', 'Soybeans', 'agri', 'CBOT', 0.25, 12.5, 'USD', 5000, '5,000 bu (¢/bu)'),
  fut('ZW', 'Chicago SRW Wheat', 'agri', 'CBOT', 0.25, 12.5, 'USD', 5000, '5,000 bu (¢/bu)'),
  fut('KE', 'KC HRW Wheat', 'agri', 'CBOT', 0.25, 12.5, 'USD', 5000, '5,000 bu (¢/bu)'),
  fut('ZM', 'Soybean Meal', 'agri', 'CBOT', 0.1, 10, 'USD', 100, '100 short tons'),
  fut('ZL', 'Soybean Oil', 'agri', 'CBOT', 0.01, 6, 'USD', 60000, '60,000 lb (¢/lb)'),
  fut('ZO', 'Oats', 'agri', 'CBOT', 0.25, 12.5, 'USD', 5000, '5,000 bu (¢/bu)'),
  // Livestock — CME (cents per lb)
  fut('LE', 'Live Cattle', 'livestock', 'CME', 0.025, 10, 'USD', 40000, '40,000 lb (¢/lb)'),
  fut('GF', 'Feeder Cattle', 'livestock', 'CME', 0.025, 12.5, 'USD', 50000, '50,000 lb (¢/lb)'),
  fut('HE', 'Lean Hogs', 'livestock', 'CME', 0.025, 10, 'USD', 40000, '40,000 lb (¢/lb)'),
  // Softs — ICE US
  fut('KC', 'Coffee "C"', 'softs', 'ICE', 0.05, 18.75, 'USD', 37500, '37,500 lb (¢/lb)'),
  fut('SB', 'Sugar No. 11', 'softs', 'ICE', 0.01, 11.2, 'USD', 112000, '112,000 lb (¢/lb)'),
  fut('CC', 'Cocoa', 'softs', 'ICE', 1, 10, 'USD', 10, '10 metric tons'),
  fut('CT', 'Cotton No. 2', 'softs', 'ICE', 0.01, 5, 'USD', 50000, '50,000 lb (¢/lb)'),
  fut('OJ', 'Orange Juice (FCOJ-A)', 'softs', 'ICE', 0.05, 7.5, 'USD', 15000, '15,000 lb (¢/lb)'),
];

export const LIBRARY: LibraryInstrument[] = [...forex, ...metals, ...indices, ...energy, ...agriCfd, ...crypto, ...futures];

const BY_KEY = new Map<string, LibraryInstrument>();
for (const i of LIBRARY) {
  const k = i.venue === 'CFD' ? i.symbol : `FUT:${i.symbol}`;
  BY_KEY.set(k, i);
  if (i.venue === 'CFD') for (const a of i.aliases ?? []) if (!BY_KEY.has(a)) BY_KEY.set(a, i);
}

/** Look up a CFD/FX symbol (already normalised) or alias. */
export const findCfd = (symbol: string) => BY_KEY.get(symbol);

const MONTH_CODES = 'FGHJKMNQUVXZ';
/** Look up a futures contract by root ("ES") or dated code ("ESZ6", "ESZ2026", "MNQH26", "/ES"). */
export function findFuture(code: string): LibraryInstrument | undefined {
  const s = code.toUpperCase().replace(/^\//, '').replace(/[\s.]/g, '');
  const direct = BY_KEY.get(`FUT:${s}`);
  if (direct) return direct;
  const m = new RegExp(`^([A-Z0-9]{1,4}?)[${MONTH_CODES}](\\d{1,4})$`).exec(s);
  return m ? BY_KEY.get(`FUT:${m[1]}`) : undefined;
}

/** Value of one pip per standard lot in the quote currency (CFD/FX) — e.g. EURUSD = 10 USD. */
export const pipValueInQuote = (i: LibraryInstrument) => (i.pointValue ?? i.contractSize) * i.pipSize;
export const tickValueInQuote = (i: LibraryInstrument) => (i.pointValue ?? i.contractSize) * i.tickSize;
