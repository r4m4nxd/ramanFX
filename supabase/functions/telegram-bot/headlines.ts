// Market news headlines for the bot (stocks + forex + crypto), from free sources only:
//   - Alpaca News API (Benzinga feed, real time, tagged per symbol: stocks, ETFs, crypto as BTCUSD), with the bot's
//     existing ALPACA_KEY_ID / ALPACA_SECRET_KEY: GET data.alpaca.markets/v1beta1/news?symbols=..&limit=..;
//   - public RSS feeds for forex / macro / markets (tested reachable from Supabase): investingLive (ex-ForexLive) news,
//     Investing.com forex / economic indicators / stock market news, CNBC top news, CoinDesk. FXStreet answers 403.
// Every field is UNTRUSTED text: tags stripped, entities decoded, clipped; the formatters esc() everything and accept
// only http(s) links. Symbols map to keywords (EURUSD -> EUR + USD terms: euro, ECB, Lagarde, dollar, Fed, Powell...;
// XAUUSD -> gold; US30 -> Dow; BTCUSD -> bitcoin + the Alpaca tag BTCUSD; stocks -> the Alpaca tag).
// The pure parts (parse, match, rank, format) are tested in src/core/telegramHeadlines.test.ts; headlineLoader() is
// the network part, used by index.ts as ctx.load('headlines/top') and ctx.load('headlines/sym/<SYM>').
// The keyword table is mirrored in tools/news/headline_terms.json for the Python jobs (a test keeps them equal).

export interface Headline {
  id: string;
  t: number;          // published, ms UTC
  title: string;
  summary: string;    // one plain sentence or ''
  url: string;        // http(s) or ''
  source: string;     // 'Benzinga', 'investingLive', 'Investing.com', 'CNBC', 'CoinDesk'
  syms: string[];     // Alpaca symbol tags (upper case); [] for RSS
}

export const CAL_TZ = 'America/Edmonton';
const HOUR = 3600_000;

// ---- text hygiene ------------------------------------------------------------------------------------------------
const ENT: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“' };
export function decode(s: string): string {
  return s.replace(/&(#x[0-9a-f]{1,6}|#[0-9]{1,7}|[a-z]{2,8});/gi, (m, e: string) => {
    if (e[0] === '#') {
      const n = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 && !(n >= 0xd800 && n < 0xe000) ? String.fromCodePoint(n) : '';
    }
    return ENT[e.toLowerCase()] ?? m;
  });
}
/** HTML / CDATA fragment -> one line of plain text (tags removed twice: before and after decoding). */
export function plainText(s: unknown, max = 300): string {
  let t = String(s ?? '').replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');
  t = t.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ');
  t = decode(t).replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ').replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029]/g, ' ');
  t = t.replace(/\s+/g, ' ').trim();
  return clip(t, max);
}
export function clip(s: string, n: number): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  const sp = cut.lastIndexOf(' ');
  return `${(sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.–—-]+$/, '')}…`;
}
/** The first sentence of a summary (<= n chars), '' when it only repeats the title. */
export function firstSentence(s: string, title = '', n = 140): string {
  const t = s.trim();
  if (!t) return '';
  const m = /^(.{25,}?[.!?])(\s|$)/.exec(t);
  const one = clip(m ? m[1] : t, n);
  const k = (x: string) => x.toLowerCase().replace(/[^a-z0-9]+/g, '');
  return k(one).startsWith(k(title).slice(0, 40)) && title ? '' : one;
}
export function safeUrl(u: unknown): string {
  const s = String(u ?? '').trim();
  return /^https?:\/\/[^\s"'<>]{3,500}$/i.test(s) ? s : '';
}
const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (u: string) => esc(u).replace(/"/g, '&quot;');

// ---- parsing -----------------------------------------------------------------------------------------------------
function tag(item: string, name: string): string {
  const m = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i').exec(item);
  return m ? m[1] : '';
}
/** RSS 2.0 pubDate (RFC 822) or Investing.com's 'YYYY-MM-DD HH:MM:SS' (UTC); NaN when unreadable. */
export function parseDate(s: string): number {
  const t = s.trim();
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)$/.exec(t);
  if (m) return Date.parse(`${m[1]}T${m[2]}Z`);
  const v = Date.parse(t);
  return Number.isFinite(v) ? v : NaN;
}
/** RSS 2.0 / Atom-ish XML -> headlines (max 60). Items without a title or a date are dropped. */
export function parseRss(xml: unknown, source: string): Headline[] {
  if (typeof xml !== 'string' || !/<(rss|feed|channel)[\s>]/i.test(xml)) return [];
  const out: Headline[] = [];
  for (const chunk of xml.split(/<item[\s>]|<entry[\s>]/i).slice(1, 61)) {
    const item = chunk.split(/<\/item>|<\/entry>/i)[0];
    const title = plainText(tag(item, 'title'), 220);
    const t = parseDate(plainText(tag(item, 'pubDate') || tag(item, 'dc:date') || tag(item, 'published') || tag(item, 'updated'), 60));
    if (!title || !Number.isFinite(t)) continue;
    let link = plainText(tag(item, 'link'), 600);
    if (!link) link = /<link[^>]*href="([^"]+)"/i.exec(item)?.[1] ?? '';
    if (!safeUrl(link)) { const g = plainText(tag(item, 'guid'), 600); if (safeUrl(g)) link = g; }
    const summary = firstSentence(plainText(tag(item, 'description') || tag(item, 'summary'), 600), title);
    const url = safeUrl(decode(link));
    out.push({ id: `${source}:${url || title}`, t, title, summary, url, source, syms: [] });
  }
  return out;
}
/** Alpaca News API JSON ({ news: [{ id, headline, summary, created_at, url, source, symbols }] }) -> headlines. */
export function parseAlpaca(js: unknown): Headline[] {
  const arr = (js as { news?: unknown } | null)?.news;
  if (!Array.isArray(arr)) return [];
  const out: Headline[] = [];
  for (const n of arr as Record<string, unknown>[]) {
    const title = plainText(n?.headline, 220);
    const t = Date.parse(String(n?.created_at ?? n?.updated_at ?? ''));
    if (!title || !Number.isFinite(t)) continue;
    const syms = Array.isArray(n.symbols) ? (n.symbols as unknown[]).map(s => String(s).toUpperCase().replace(/[^A-Z0-9.]/g, '')).filter(Boolean).slice(0, 30) : [];
    const src = plainText(n.source, 30);
    out.push({ id: `alpaca:${String(n.id ?? title).slice(0, 40)}`, t, title, summary: firstSentence(plainText(n.summary, 600), title),
      url: safeUrl(n.url), source: !src || /benzinga/i.test(src) ? 'Benzinga' : src.charAt(0).toUpperCase() + src.slice(1), syms });
  }
  return out;
}

// ---- symbols -> keywords -----------------------------------------------------------------------------------------
/** Keywords per currency / asset (lower case, matched on word boundaries). Mirrored in tools/news/headline_terms.json. */
export const TERMS: Record<string, string[]> = {
  USD: ['usd', 'dollar', 'greenback', 'dxy', 'fed', 'fomc', 'powell', 'federal reserve', 'treasury yields', 'treasuries', 'nonfarm', 'payrolls', 'nfp', 'us cpi', 'us inflation', 'us gdp', 'pce', 'jobless claims', 'u.s. economy', 'us economy'],
  EUR: ['eur', 'euro', 'eurozone', 'euro area', 'ecb', 'lagarde', 'germany', 'german', 'bund', 'bunds'],
  GBP: ['gbp', 'sterling', 'pound', 'cable', 'boe', 'bank of england', 'bailey', 'uk', 'u.k.', 'britain', 'british', 'gilts'],
  JPY: ['jpy', 'yen', 'boj', 'bank of japan', 'ueda', 'japan', 'japanese', 'jgb'],
  AUD: ['aud', 'aussie', 'rba', 'reserve bank of australia', 'bullock', 'australia', 'australian'],
  NZD: ['nzd', 'kiwi', 'rbnz', 'new zealand'],
  CAD: ['cad', 'loonie', 'boc', 'bank of canada', 'macklem', 'canada', 'canadian'],
  CHF: ['chf', 'swiss franc', 'franc', 'snb', 'swiss national bank', 'switzerland', 'swiss'],
  CNH: ['cnh', 'cny', 'yuan', 'renminbi', 'pboc', 'china', 'chinese', 'beijing'],
  HKD: ['hkd', 'hong kong'], SGD: ['sgd', 'singapore'], MXN: ['mxn', 'peso', 'banxico', 'mexico', 'mexican'],
  ZAR: ['zar', 'rand', 'sarb', 'south africa'], TRY: ['lira', 'turkey', 'turkish', 'cbrt'], SEK: ['sek', 'krona', 'riksbank', 'sweden', 'swedish'],
  NOK: ['nok', 'norges bank', 'norway', 'norwegian'], DKK: ['dkk', 'danish', 'denmark'], PLN: ['pln', 'zloty', 'poland', 'polish'],
  HUF: ['huf', 'forint', 'hungary', 'hungarian'], CZK: ['czk', 'koruna', 'czech'], THB: ['thb', 'baht', 'thailand'],
  XAU: ['gold', 'xau', 'bullion'], XAG: ['silver', 'xag'], XPT: ['platinum'], XPD: ['palladium'], XCU: ['copper'],
  OIL: ['oil', 'crude', 'wti', 'brent', 'opec', 'opec+'], NATGAS: ['natural gas', 'natgas', 'lng'],
  CORN: ['corn', 'grains'], WHEAT: ['wheat', 'grains'], SOYBEANS: ['soybeans', 'soybean', 'soy'], SUGAR: ['sugar'],
  US30: ['dow', 'dow jones', 'djia', 'wall street'], US500: ['s&p 500', 's&p', 'spx', 'wall street', 'us stocks', 'stocks'],
  NAS100: ['nasdaq', 'tech stocks', 'wall street'], US2000: ['russell 2000', 'russell', 'small caps', 'small-cap'],
  GER40: ['dax', 'german stocks'], UK100: ['ftse', 'ftse 100'], JPN225: ['nikkei', 'japanese stocks'], HK50: ['hang seng'],
  CHINAH: ['hang seng', 'chinese stocks', 'h-shares'], CN50: ['china a50', 'chinese stocks', 'csi 300'], AUS200: ['asx', 'asx 200'],
  FRA40: ['cac', 'cac 40'], EUSTX50: ['euro stoxx', 'stoxx'], SPA35: ['ibex'], NETH25: ['aex'], SWI20: ['smi', 'swiss stocks'],
  BTC: ['bitcoin', 'btc'], ETH: ['ethereum', 'ether', 'eth'], SOL: ['solana'], XRP: ['xrp', 'ripple'], ADA: ['cardano'],
  DOGE: ['dogecoin', 'doge'], AVAX: ['avalanche', 'avax'], BNB: ['bnb', 'binance coin'], DOT: ['polkadot'], LINK: ['chainlink'],
  LTC: ['litecoin'], BCH: ['bitcoin cash'], UNI: ['uniswap'], XLM: ['stellar', 'xlm'], XTZ: ['tezos'],
};
const CFD: Record<string, { k: string[]; tags?: string[] }> = {
  COPPER: { k: ['XCU'] }, NATGAS: { k: ['NATGAS'], tags: ['UNG'] }, SPOTBRENT: { k: ['OIL'], tags: ['BNO'] }, SPOTCRUDE: { k: ['OIL'], tags: ['USO'] },
  CORN: { k: ['CORN'] }, WHEAT: { k: ['WHEAT'] }, SOYBEANS: { k: ['SOYBEANS'] }, SUGAR: { k: ['SUGAR'] },
  USDX: { k: ['USD'], tags: ['UUP'] }, EURX: { k: ['EUR'] }, JPYX: { k: ['JPY'] },
  US30: { k: ['US30'], tags: ['DIA'] }, US500: { k: ['US500'], tags: ['SPY'] }, NAS100: { k: ['NAS100'], tags: ['QQQ'] }, US2000: { k: ['US2000'], tags: ['IWM'] },
  GER40: { k: ['GER40', 'EUR'] }, UK100: { k: ['UK100', 'GBP'] }, JPN225: { k: ['JPN225', 'JPY'] }, HK50: { k: ['HK50'] }, CHINAH: { k: ['CHINAH'] },
  CN50: { k: ['CN50', 'CNH'] }, AUS200: { k: ['AUS200', 'AUD'] }, FRA40: { k: ['FRA40'] }, EUSTX50: { k: ['EUSTX50', 'EUR'] }, SPA35: { k: ['SPA35'] },
  NETH25: { k: ['NETH25'] }, SWI20: { k: ['SWI20', 'CHF'] },
};
const METAL_TAG: Record<string, string> = { XAU: 'GLD', XAG: 'SLV', XPT: 'PPLT', XPD: 'PALL' };
const CCY_ALIAS: Record<string, string> = { CNY: 'CNH' };

export interface SymMap {
  kind: 'fx' | 'metal' | 'cfd' | 'crypto' | 'stock';
  main: string[];      // keyword groups that make a headline about this symbol (base / the asset)
  side: string[];      // weaker groups (the quote currency): count only when nothing better is there
  tags: string[];      // Alpaca symbols to query / match
  names: RegExp[];     // the symbol itself as written in headlines ('EUR/USD', 'EURUSD', 'BTC/USD')
}
const cleanSym = (s: string) => String(s ?? '').toUpperCase().replace(/[^A-Z0-9.]/g, '').slice(0, 20);
/** Symbol -> keyword groups + Alpaca tags. Unknown 1-6 letter symbols are stocks (Alpaca tag only). */
export function symMap(sym: string): SymMap {
  const s = cleanSym(sym);
  const names = [new RegExp(`\\b${s.replace(/\./g, '\\.')}\\b`, 'i')];
  if (CFD[s]) return { kind: 'cfd', main: CFD[s].k.slice(0, 1), side: CFD[s].k.slice(1), tags: CFD[s].tags ?? [], names };
  const m = /^([A-Z]{3,4})([A-Z]{3})$/.exec(s);
  if (m) {
    const [b, q] = [CCY_ALIAS[m[1]] ?? m[1], CCY_ALIAS[m[2]] ?? m[2]];
    const pairRe = new RegExp(`\\b${m[1]}\\s?/?\\s?${m[2]}\\b`, 'i');
    if (/^X(AU|AG|PT|PD)$/.test(b) && TERMS[b]) return { kind: 'metal', main: [b], side: TERMS[q] ? [q] : [], tags: q === 'USD' ? [METAL_TAG[b]] : [], names: [pairRe] };
    if (TERMS[b] && TERMS[q] && b.length === 3 && !['BTC', 'ETH', 'SOL', 'XRP', 'ADA', 'BNB', 'DOT', 'LTC', 'BCH', 'UNI', 'XLM', 'XTZ'].includes(b)) {
      return { kind: 'fx', main: [b], side: [q], tags: [], names: [pairRe] };
    }
    if (TERMS[b] && q === 'USD') return { kind: 'crypto', main: [b], side: [], tags: [`${m[1]}USD`], names: [pairRe] };
  }
  return { kind: 'stock', main: [], side: [], tags: /^[A-Z][A-Z0-9.]{0,9}$/.test(s) ? [s] : [], names };
}
const termRe = new Map<string, RegExp>();
function groupRe(g: string): RegExp {
  let r = termRe.get(g);
  if (!r) {
    const alt = (TERMS[g] ?? []).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s+')).join('|');
    r = new RegExp(`(?:^|[^a-z0-9&])(?:${alt})(?![a-z0-9])`, 'i');
    termRe.set(g, r);
  }
  return r;
}
/** How much a headline is about the symbol: 3 = tagged / named, 2 = a main keyword, 1 = only the quote side, 0 = not. */
export function relevance(h: Headline, map: SymMap): number {
  if (map.tags.length && h.syms.some(s => map.tags.includes(s)) && h.syms.length <= 6) return 3;
  const text = `${h.title} ${h.summary}`;
  if (map.names.some(r => r.test(h.title))) return 3;
  if (map.kind === 'stock') return 0;
  const title = h.title;
  if (map.main.some(g => groupRe(g).test(title))) return 2.5;
  if (map.main.some(g => groupRe(g).test(text))) return 2;
  if (map.side.some(g => groupRe(g).test(title))) return 1;
  return 0;
}

// ---- ranking -----------------------------------------------------------------------------------------------------
const MACRO = /\b(fed|fomc|powell|rate (cut|hike|decision)|cuts? rates|hikes? rates|holds? rates|interest rates?|cpi|inflation|pce|gdp|payrolls|nonfarm|nfp|jobs report|unemployment|ecb|lagarde|boj|bank of japan|boe|bank of england|rba|boc|bank of canada|snb|rbnz|pboc|tariffs?|trade war|treasury yields|recession|opec\+?|sanctions?|shutdown|default|stimulus|intervention|war|ceasefire|election)\b/i;
const MARKET = /\b(stocks?|s&p|nasdaq|dow|wall street|dollar|yen|euro|sterling|pound|gold|silver|oil|crude|bitcoin|ether(eum)?|crypto|yields?|bonds?|earnings|guidance|forecast|record|plunge[sd]?|surge[sd]?|soar(s|ed)?|tumble[sd]?|crash(es|ed)?|rall(y|ies|ied)|slump(s|ed)?|sell-?off|rout|jumps?|slides?|sinks?|spikes?)\b/i;
const MEGA = /\b(apple|microsoft|nvidia|alphabet|google|amazon|meta|tesla|broadcom|berkshire|jpmorgan|openai|netflix)\b/i;
const MEGA_TAGS = new Set(['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'GOOG', 'AMZN', 'META', 'TSLA', 'AVGO', 'BRK.B', 'JPM', 'NFLX', 'SPY', 'QQQ']);
export const NOISE = /(price prediction|should you buy|stocks? to (watch|buy)|analyst ratings?|options? activity|unusual options|whale|short interest|price target|insider (buy|sell)|here'?s why|what'?s going on|top (gainers|losers|movers)|mid-?day movers|pre-?market movers|shares are trading|these \d+ stocks|stocks moving|earnings preview|ratings? (update|change)|\bETF\b.*\b(inflows|outflows)\b|sponsored|podcast|webinar|newsletter|quiz|how to|explained|\bvs\.? \d|cramer)/i;
const SRC_W: Record<string, number> = { investingLive: 1.2, 'Investing.com': 1, CNBC: 1, CoinDesk: 0.4, Benzinga: 0 };

/** Market-moving score (higher = more important): macro words, market words, mega caps, source, minus noise + age. */
export function importance(h: Headline, now: number): number {
  let s = SRC_W[h.source] ?? 0.5;
  if (MACRO.test(h.title)) s += 3;
  if (MARKET.test(h.title)) s += 1.5;
  if (MEGA.test(h.title) || h.syms.some(x => MEGA_TAGS.has(x))) s += 1.5;
  if (NOISE.test(h.title)) s -= 4;
  if (h.syms.length > 6) s -= 1.5;           // round-ups tagging many tickers
  if (h.title.length < 25) s -= 1;
  const age = Math.max(0, (now - h.t) / HOUR);
  return s - age * 0.35;
}
const words = (t: string) => new Set(t.toLowerCase().replace(/[^a-z0-9% ]+/g, ' ').split(' ').filter(w => w.length > 2));
/** True when two titles say the same thing (word overlap >= 60% of the shorter one). */
export function similar(a: string, b: string): boolean {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return false;
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / Math.min(A.size, B.size) >= 0.6;
}
function dedupe(list: Headline[]): Headline[] {
  const out: Headline[] = [];
  const ids = new Set<string>();
  for (const h of list) {
    if (ids.has(h.id) || out.some(o => similar(o.title, h.title))) continue;
    ids.add(h.id);
    out.push(h);
  }
  return out;
}
const fresh = (list: Headline[], now: number, hours: number) => list.filter(h => h.t <= now + 10 * 60_000 && now - h.t <= hours * HOUR);

/** The n most important headlines of the last `hours` (6 h, widened to 18 h when quiet), at most 3 per source. */
export function topHeadlines(list: unknown, now: number, n = 5, hours = 6): Headline[] {
  const all = asList(list);
  let pool = fresh(all, now, hours);
  if (pool.length < n * 2) pool = fresh(all, now, Math.max(hours, 18));
  const ranked = dedupe(pool.map(h => [importance(h, now), h] as const).filter(([s]) => s > 0.5).sort((a, b) => b[0] - a[0]).map(x => x[1]));
  const per = new Map<string, number>();
  const out: Headline[] = [];
  for (const h of ranked) {
    if ((per.get(h.source) ?? 0) >= 3) continue;
    per.set(h.source, (per.get(h.source) ?? 0) + 1);
    out.push(h);
    if (out.length >= n) break;
  }
  return out;
}
/** The newest n headlines about `sym` in the last `hours` (quote-side-only matches fill in when there are few). */
export function forSymbol(list: unknown, sym: string, now: number, n = 6, hours = 72): Headline[] {
  const map = symMap(sym);
  const scored = fresh(asList(list), now, hours).map(h => [relevance(h, map), h] as const).filter(([r]) => r > 0);
  const byTime = (a: readonly [number, Headline], b: readonly [number, Headline]) => b[1].t - a[1].t;
  const strong = scored.filter(([r]) => r >= 2).sort(byTime);
  const weak = strong.length >= 3 ? [] : scored.filter(([r]) => r < 2).sort(byTime);
  const merged = [...strong, ...weak].map(x => x[1]).filter(h => map.kind === 'stock' || !NOISE.test(h.title));
  return dedupe(merged).slice(0, n);
}
/** The newest headline about `sym` in the last `hours` (default 24), or null. */
export function latestFor(list: unknown, sym: string, now: number, hours = 24): Headline | null {
  return forSymbol(list, sym, now, 1, hours).filter(h => relevance(h, symMap(sym)) >= 2)[0] ?? null;
}
function asList(list: unknown): Headline[] {
  if (!Array.isArray(list)) return [];
  return (list as Headline[]).filter(h => h && typeof h.title === 'string' && !!h.title.trim() && Number.isFinite(h.t))
    .map(h => ({ ...h, syms: Array.isArray(h.syms) ? h.syms : [], summary: typeof h.summary === 'string' ? h.summary : '', url: safeUrl(h.url), source: String(h.source ?? '') }));
}

// ---- formatting (Telegram HTML; everything external escaped) -------------------------------------------------------
export function ago(t: number, now: number): string {
  const m = Math.max(0, Math.round((now - t) / 60_000));
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}
export function calClock(t: number): string {
  return new Intl.DateTimeFormat('en-US', { timeZone: CAL_TZ, hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(t));
}
/** '<a href="url">Title</a>' (plain escaped title without a usable link). */
export function linked(h: Headline, max = 140): string {
  const t = esc(clip(h.title, max));
  return h.url ? `<a href="${attr(h.url)}">${t}</a>` : t;
}
/** Compact block for /news: '📰 <b>Top headlines</b>' + one line each. [] when there is nothing. */
export function topLines(list: unknown, now: number, n = 5): string[] {
  const top = topHeadlines(list, now, n);
  if (!top.length) return [];
  return ['📰 <b>Top headlines</b>', ...top.map(h => `• ${linked(h, 120)} · <i>${esc(ago(h.t, now))} · ${esc(h.source)}</i>`)];
}
export const SOURCES = 'Benzinga via Alpaca, investingLive, Investing.com, CNBC, CoinDesk';
/** /news SYM: the last ~6 headlines (time ago + Calgary clock, source, one-line summary, link). */
export function symbolLines(sym: string, list: unknown, now: number, n = 6): string[] {
  const s = cleanSym(sym);
  const items = list == null ? null : forSymbol(list, s, now, n);
  const head = `📰 <b>${esc(s)} · latest headlines</b>`;
  if (items == null) return [head, '', '⚠️ The news feeds did not load. Try again in a few minutes.'];
  if (!items.length) return [head, '', 'No headlines about it in the last 3 days.'];
  const lines = [head];
  for (const h of items) {
    lines.push('', `• ${linked(h, 150)}`, `<i>${esc(ago(h.t, now))} · ${esc(calClock(h.t))} · ${esc(h.source)}</i>`);
    if (h.summary) lines.push(esc(clip(h.summary, 140)));
  }
  return lines;
}
/** One line for symbol / chart replies: '📰 latest: <headline> · 2h ago' (last 24 h), or ''. */
export function latestLine(sym: string, list: unknown, now: number): string {
  const h = latestFor(list, sym, now);
  return h ? `📰 latest: ${linked(h, 90)} · ${esc(ago(h.t, now))}` : '';
}

// ---- network (index.ts) ------------------------------------------------------------------------------------------
export const FEEDS: { url: string; source: string }[] = [
  { url: 'https://investinglive.com/feed/news/', source: 'investingLive' },
  { url: 'https://www.investing.com/rss/news_1.rss', source: 'Investing.com' },    // forex news
  { url: 'https://www.investing.com/rss/news_95.rss', source: 'Investing.com' },   // economic indicators
  { url: 'https://www.investing.com/rss/news_25.rss', source: 'Investing.com' },   // stock market
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', source: 'CNBC' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
];
export const ALPACA_NEWS = 'https://data.alpaca.markets/v1beta1/news';
type Fetch = (url: string, init?: RequestInit) => Promise<Response>;
export interface LoaderDeps { fetch: Fetch; alpaca?: { id: string; secret: string }; log?: (o: Record<string, unknown>) => void; ttlMs?: number; timeoutMs?: number }

/** ctx.load('headlines/top' | 'headlines/sym/<SYM>') -> Headline[] (RSS pool + Alpaca), or null when every source failed.
 *  The RSS pool and the Alpaca answers are cached ttlMs (5 min) per instance; a failed source is logged (status only). */
export function headlineLoader(d: LoaderDeps): (path: string) => Promise<Headline[] | null> {
  const ttl = d.ttlMs ?? 5 * 60_000, to = d.timeoutMs ?? 4500;
  const log = d.log ?? (() => {});
  const memo = new Map<string, { t: number; v: Promise<Headline[] | null> }>();
  const cached = (k: string, f: () => Promise<Headline[] | null>) => {
    const hit = memo.get(k);
    if (hit && Date.now() - hit.t < ttl) return hit.v;
    const e = { t: Date.now(), v: f().catch(() => null) };
    memo.set(k, e);
    e.v.then(x => { if (x == null) e.t -= ttl - 60_000; });    // a failure is retried after 1 min
    if (memo.size > 60) memo.delete(memo.keys().next().value as string);
    return e.v;
  };
  const getText = async (url: string, headers: Record<string, string>, src: string): Promise<string | null> => {
    try {
      const r = await d.fetch(url, { headers, signal: AbortSignal.timeout(to) });
      if (!r.ok) { await r.body?.cancel(); log({ ev: 'headlines_src', src, status: r.status }); return null; }
      return (await r.text()).slice(0, 600_000);
    } catch (e) { log({ ev: 'headlines_src', src, err: String((e as Error)?.name ?? e).slice(0, 30) }); return null; }
  };
  const pool = () => cached('pool', async () => {
    const got = await Promise.all(FEEDS.map(async f => parseRss(await getText(f.url, { 'User-Agent': 'Mozilla/5.0 (compatible; RamanFX-bot/1.0)', Accept: 'application/rss+xml, application/xml, text/xml' }, f.source), f.source)));
    const all = got.flat();
    return got.every(g => !g.length) ? null : all;
  });
  const alpaca = (syms: string[]) => cached(`a:${syms.join(',')}`, async () => {
    if (!d.alpaca) return null;
    const q = new URLSearchParams({ limit: '50', sort: 'desc', include_content: 'false', exclude_contentless: 'true' });
    if (syms.length) q.set('symbols', syms.join(','));
    const t = await getText(`${ALPACA_NEWS}?${q}`, { 'APCA-API-KEY-ID': d.alpaca.id, 'APCA-API-SECRET-KEY': d.alpaca.secret, Accept: 'application/json' }, 'alpaca');
    if (t == null) return null;
    try { return parseAlpaca(JSON.parse(t)); } catch { return null; }
  });
  return async (path: string) => {
    const m = /^headlines\/(top|sym\/([A-Za-z0-9._-]{1,20}))$/.exec(path);
    if (!m) return null;
    const tags = m[2] ? symMap(m[2]).tags : [];
    const [p, a] = await Promise.all([m[2] && symMap(m[2]).kind === 'stock' ? Promise.resolve(null) : pool(), m[2] && !tags.length ? Promise.resolve(null) : alpaca(tags)]);
    if (p == null && a == null) return null;
    return [...(a ?? []), ...(p ?? [])];
  };
}
