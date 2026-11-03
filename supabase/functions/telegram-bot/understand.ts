// Plain words -> a symbol (owner 2026-11-03 UX study: beginners type "gold", "apple stock", "should I buy tesla", "hi").
// Pure: no I/O. logic.ts tries the candidates in order against the published symbol lists.

/** Everyday names -> the bot's symbol (Pepperstone names for markets, tickers for well-known companies). */
export const ALIAS: Record<string, string> = {
  gold: 'XAUUSD', 'gold price': 'XAUUSD', xau: 'XAUUSD', silver: 'XAGUSD', xag: 'XAGUSD', platinum: 'XPTUSD', palladium: 'XPDUSD',
  oil: 'SPOTCRUDE', crude: 'SPOTCRUDE', 'crude oil': 'SPOTCRUDE', wti: 'SPOTCRUDE', 'us oil': 'SPOTCRUDE', brent: 'SPOTBRENT', 'brent oil': 'SPOTBRENT',
  gas: 'NATGAS', 'natural gas': 'NATGAS', 'nat gas': 'NATGAS', natgas: 'NATGAS', copper: 'COPPER', corn: 'CORN', wheat: 'WHEAT', sugar: 'SUGAR', soybeans: 'SOYBEANS', soy: 'SOYBEANS',
  bitcoin: 'BTCUSD', btc: 'BTCUSD', ethereum: 'ETHUSD', ether: 'ETHUSD', eth: 'ETHUSD', solana: 'SOLUSD', sol: 'SOLUSD', dogecoin: 'DOGEUSD', doge: 'DOGEUSD',
  ripple: 'XRPUSD', xrp: 'XRPUSD', cardano: 'ADAUSD', litecoin: 'LTCUSD', 'bitcoin cash': 'BCHUSD', chainlink: 'LINKUSD', polkadot: 'DOTUSD', avalanche: 'AVAXUSD', bnb: 'BNBUSD',
  euro: 'EURUSD', eur: 'EURUSD', 'euro dollar': 'EURUSD', pound: 'GBPUSD', sterling: 'GBPUSD', cable: 'GBPUSD', gbp: 'GBPUSD', yen: 'USDJPY', jpy: 'USDJPY',
  loonie: 'USDCAD', 'canadian dollar': 'USDCAD', cad: 'USDCAD', aussie: 'AUDUSD', 'australian dollar': 'AUDUSD', kiwi: 'NZDUSD', franc: 'USDCHF', swissy: 'USDCHF', 'swiss franc': 'USDCHF',
  'dollar index': 'USDX', dxy: 'USDX', 'us dollar': 'USDX', dollar: 'USDX', yuan: 'USDCNH', peso: 'USDMXN', rand: 'USDZAR', lira: 'USDTRY',
  sp500: 'US500', 'sp 500': 'US500', 's&p': 'US500', 's&p 500': 'US500', 's&p500': 'US500', 's and p': 'US500', 's and p 500': 'US500', spx: 'US500', spy: 'US500',
  dow: 'US30', 'dow jones': 'US30', djia: 'US30', 'the dow': 'US30', nasdaq: 'NAS100', 'nasdaq 100': 'NAS100', ndx: 'NAS100', qqq: 'NAS100',
  russell: 'US2000', 'russell 2000': 'US2000', dax: 'GER40', 'germany 40': 'GER40', ftse: 'UK100', 'ftse 100': 'UK100', nikkei: 'JPN225', 'hang seng': 'HK50',
  cac: 'FRA40', 'cac 40': 'FRA40', 'euro stoxx': 'EUSTX50', 'stoxx 50': 'EUSTX50', asx: 'AUS200', 'asx 200': 'AUS200', ibex: 'SPA35',
  apple: 'AAPL', google: 'GOOGL', alphabet: 'GOOGL', amazon: 'AMZN', microsoft: 'MSFT', meta: 'META', facebook: 'META', tesla: 'TSLA', nvidia: 'NVDA',
  netflix: 'NFLX', 'berkshire': 'BRK.B', 'berkshire hathaway': 'BRK.B', 'coca cola': 'KO', coke: 'KO', disney: 'DIS', walmart: 'WMT', costco: 'COST',
  'jp morgan': 'JPM', jpmorgan: 'JPM', visa: 'V', mastercard: 'MA', intel: 'INTC', amd: 'AMD', broadcom: 'AVGO', palantir: 'PLTR', uber: 'UBER',
  shopify: 'SHOP', 'royal bank': 'RY', rbc: 'RY', td: 'TD', 'td bank': 'TD', enbridge: 'ENB', suncor: 'SU', ford: 'F', boeing: 'BA', nike: 'NKE', starbucks: 'SBUX',
  mcdonalds: 'MCD', "mcdonald's": 'MCD', pfizer: 'PFE', 'eli lilly': 'LLY', lilly: 'LLY', oracle: 'ORCL', salesforce: 'CRM', adobe: 'ADBE', paypal: 'PYPL',
  'super micro': 'SMCI', supermicro: 'SMCI', coinbase: 'COIN', 'micro strategy': 'MSTR', microstrategy: 'MSTR', strategy: 'MSTR', airbnb: 'ABNB', spotify: 'SPOT',
};

/** Greetings and small talk: answered with the welcome menu, never read as a ticker. */
export const GREETING = /^(hi+|hey+|hello+|hola|yo|sup|hii+|helo|good (morning|afternoon|evening|day)|gm|start|menu|main menu|help|help me|helps?|options|commands|what can you do|how (do|does) (i|this|it) (use|work)( this| it)?|how to use( this| it)?|what is this|who are you|ok|okay|k|cool|nice|great|thanks|thank you|thx|ty|cheers|👍|🙏|\?+|\.+|start over|back|home|cancel|stop)\W*$/i;
export const THANKS = /^(thanks|thank you|thx|ty|cheers|🙏|👍|great|nice|cool)\W*$/i;

/** Words that carry no symbol ("should I buy tesla stock now?" -> tesla). */
const FILLER = new Set(('a an the is it its it\'s of for to in on at about and or me my i im i\'m you your we do does did should would could can will ' +
  'buy sell sold bought buying selling hold holding price prices priced quote chart charts graph stock stocks share shares ticker symbol market markets ' +
  'now today currently right this week month year good bad time worth think thoughts opinion what what\'s whats how how\'s hows why when where which ' +
  'show tell give get see check look update info news analysis zone zones area areas going go up down doing trend please pls plz any going? ' +
  'investment invest investing trade trading long short entry signal signals setup level levels support resistance cheap expensive').split(/\s+/));

const clean = (s: string) => s.toLowerCase().replace(/[’`]/g, "'").replace(/[^\p{L}\p{N}&.'\/\s-]/gu, ' ').replace(/\s+/g, ' ').trim();

/** Symbol candidates in the order to try: an everyday name (longest phrase first), a 2-word currency pair ('eur usd'),
 *  then each remaining word as a ticker. */
export function candidates(text: string): string[] {
  const t = clean(text);
  if (!t) return [];
  const out: string[] = [];
  const add = (s: string | undefined) => { if (s && !out.includes(s)) out.push(s); };
  add(ALIAS[t]);
  const words = t.split(' ');
  for (let n = Math.min(3, words.length); n >= 1; n--)
    for (let i = 0; i + n <= words.length; i++) add(ALIAS[words.slice(i, i + n).join(' ')]);
  const keep = words.filter(w => !FILLER.has(w) && !/^\d+(\.\d+)?$/.test(w));
  for (let i = 0; i + 1 < keep.length; i++)
    if (/^[a-z]{3}$/.test(keep[i]) && /^[a-z]{3}$/.test(keep[i + 1])) add(`${keep[i]}${keep[i + 1]}`.toUpperCase());
  for (const w of keep) if (w.length <= 12) add(ALIAS[w] ?? w.toUpperCase());
  return out.slice(0, 4);
}
