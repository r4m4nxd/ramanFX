// The shareable summary card (owner 2026-11-03: "premium, for an audience with zero trading knowledge"): a 1080x1350
// image (SVG -> PNG via resvg in index.ts) plus a short plain-English caption. Design: the "RamanFX Telegram Premium"
// canvas (ink ground, champagne accent, serif ticker, mono numbers). No jargon: "buy area" not "demand zone", "this
// week" not "W1", "for learning only". Pure: data in, strings out (tests: src/core/telegramCard.test.ts).

export interface CardZone { kind: 'buy' | 'sell'; tf: string; lo: number; hi: number; state: 'inside' | 'near' | 'left' | 'next'; away: number }
export interface CardFund { label: string; value: string; sub?: string }
export interface CardData {
  sym: string; name: string; market: 'fx' | 'stock'; price: number | null; digits: number; live: boolean;
  trend: { label: string; word: string; up: boolean | null }[];
  zones: CardZone[]; fund: CardFund[];
  social: { n: number; bull: number; bear: number } | null;
  headline: { title: string; meta: string } | null;
  at: Date;
  points?: string[];                         // 'Key points': plain one-liners
  chart?: CardChart;                         // the daily chart drawn under the summary (the image only)
}
export interface CardChart { tf: string; digits: number; bars: { t: string; o: number; h: number; l: number; c: number }[]; zones: { side: string; lo: number; hi: number }[]; lines: [number, number][][] }

const CCY: Record<string, string> = { EUR: 'Euro', USD: 'US dollar', GBP: 'British pound', JPY: 'Japanese yen', CHF: 'Swiss franc', CAD: 'Canadian dollar',
  AUD: 'Australian dollar', NZD: 'New Zealand dollar', XAU: 'Gold', XAG: 'Silver', XPT: 'Platinum', XPD: 'Palladium', CNH: 'Chinese yuan', HKD: 'Hong Kong dollar',
  SGD: 'Singapore dollar', MXN: 'Mexican peso', ZAR: 'South African rand', TRY: 'Turkish lira', NOK: 'Norwegian krone', SEK: 'Swedish krona', DKK: 'Danish krone',
  PLN: 'Polish zloty', HUF: 'Hungarian forint', CZK: 'Czech koruna', THB: 'Thai baht', BTC: 'Bitcoin', ETH: 'Ether' };
const MARKET: Record<string, string> = { US500: 'S&P 500 (US stocks)', US30: 'Dow Jones (US stocks)', NAS100: 'Nasdaq 100 (US tech stocks)', US2000: 'Russell 2000 (US small companies)',
  GER40: 'Germany 40 (DAX)', UK100: 'UK 100 (FTSE)', FRA40: 'France 40 (CAC)', EUSTX50: 'Euro Stoxx 50', SPA35: 'Spain 35', NETH25: 'Netherlands 25', SWI20: 'Swiss 20',
  JPN225: 'Japan 225 (Nikkei)', HK50: 'Hong Kong 50 (Hang Seng)', CHINAH: 'China H-shares', CN50: 'China 50', AUS200: 'Australia 200',
  SPOTCRUDE: 'Crude oil (WTI)', SPOTBRENT: 'Brent oil', NATGAS: 'Natural gas', COPPER: 'Copper', CORN: 'Corn', WHEAT: 'Wheat', SUGAR: 'Sugar', SOYBEANS: 'Soybeans',
  USDX: 'US dollar index', EURX: 'Euro index', JPYX: 'Japanese yen index', XAUXAG: 'Gold vs silver' };
/** 'EURUSD' -> 'Euro vs US dollar', 'XAUUSD' -> 'Gold (in US dollars)'; other names unchanged. */
export function plainName(sym: string, name: string, market: 'fx' | 'stock'): string {
  if (market === 'stock') return name || sym;
  if (MARKET[sym]) return MARKET[sym];
  const m = /^([A-Z]{3})([A-Z]{3})$/.exec(sym);
  if (!m || !CCY[m[1]] || !CCY[m[2]]) return name && name !== 'FX' ? name : sym;
  return ['XAU', 'XAG', 'XPT', 'XPD', 'BTC', 'ETH'].includes(m[1]) ? `${CCY[m[1]]} (in ${CCY[m[2]]}s)` : `${CCY[m[1]]} vs ${CCY[m[2]]}`;
}
const TF_WORD: Record<string, string> = { '1H': 'this hour', '4H': 'today', D1: 'today', W1: 'this week', MN: 'this month', '3M': 'big picture', '15m': 'this hour' };
const TF_ADJ: Record<string, string> = { '1H': 'hourly', '4H': '4-hour', D1: 'daily', W1: 'weekly', MN: 'monthly', '3M': '3-month', '15m': '15-minute' };
/** 'pullback' -> 'Dipping', 'turning up' -> 'Turning up' ... (the scan's trend words, plain). */
export function plainTrend(w: string): { word: string; up: boolean | null } {
  const s = w.toLowerCase();
  if (/turning up|changed up/.test(s)) return { word: 'Turning up', up: true };
  if (/turning down|changed down/.test(s)) return { word: 'Turning down', up: false };
  if (/pullback/.test(s)) return { word: 'Dipping', up: null };
  if (/\bup\b/.test(s)) return { word: 'Rising', up: true };
  if (/\bdown\b/.test(s)) return { word: 'Falling', up: false };
  if (/range|side/.test(s)) return { word: 'Sideways', up: null };
  return { word: w ? w[0].toUpperCase() + w.slice(1) : 'n/a', up: null };
}
/** The trend line of a zones reply ('Trend: W1 pullback · MN pullback · 3M up') -> the 3 biggest timeframes, plain. */
export function trendOf(line: string): CardData['trend'] {
  const parts = line.replace(/^Trend:\s*/, '').split(' · ').map(p => p.trim()).filter(Boolean);
  const rows = parts.map(p => { const m = /^(\S+)\s+(.*)$/.exec(p); return m ? { tf: m[1], w: m[2] } : null; }).filter((x): x is { tf: string; w: string } => !!x);
  const order = ['15m', '1H', '4H', 'D1', 'W1', 'MN', '3M'];
  rows.sort((a, b) => order.indexOf(a.tf) - order.indexOf(b.tf));
  return rows.slice(-3).map(r => ({ label: (TF_WORD[r.tf] ?? r.tf).toUpperCase(), ...plainTrend(r.w) }));
}
const fmt = (v: number | null, d: number) => (v == null ? 'n/a' : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }));
const money = (d: CardData, v: number) => `${d.market === 'stock' ? '$' : ''}${fmt(v, d.digits)}`;

/** One plain sentence per zone. */
export function zoneSentence(d: CardData, z: CardZone): string {
  const range = `${money(d, z.lo)}–${money(d, z.hi)}`, adj = TF_ADJ[z.tf] ?? z.tf;
  if (z.kind === 'buy') {
    if (z.state === 'inside') return `In a ${adj} buy area (${range}): buyers stepped in here before.`;
    if (z.state === 'left') return `Just bounced out of a ${adj} buy area (${range}).`;
    return `${z.away.toFixed(1)}% above a ${adj} buy area (${range}).${z.away < 3 ? ' Getting close.' : ''}`;
  }
  if (z.state === 'inside') return `In a ${adj} sell area (${range}): sellers took over here before.`;
  if (z.state === 'left') return `Just turned down from a ${adj} sell area (${range}).`;
  return `${z.away.toFixed(1)}% below a ${adj} sell area (${range}): a place to take profit.`;
}
/** Fundamentals rows of /fund ('Revenue TTM: $303.0B +83% YoY (2026-07)') in plain words, at most 4. */
export function plainFund(lines: string[]): CardFund[] {
  const out: CardFund[] = [];
  const strip = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\s*\(\d{4}-\d{2}\)/, '').trim();
  for (const raw of lines) {
    const l = strip(raw), m = /^([^:]{2,30}):\s*(.+)$/.exec(l);
    if (!m) continue;
    const k = m[1].toLowerCase(), v = m[2];
    const yoy = /([+-]\d+%) YoY/.exec(v);
    const first = v.split(' ')[0];
    if (/revenue/.test(k)) out.push({ label: 'Sales, last 12 months', value: first, sub: yoy ? `${yoy[1].startsWith('-') ? 'down' : 'up'} ${yoy[1].replace(/[+-]/, '')} on last year` : undefined });
    else if (/^eps/.test(k)) out.push({ label: 'Profit per share', value: first, sub: yoy ? `${yoy[1].startsWith('-') ? 'down' : 'up'} ${yoy[1].replace(/[+-]/, '')} on last year` : undefined });
    else if (/net margin/.test(k)) { const p = parseFloat(first); if (Number.isFinite(p)) out.push({ label: 'Profit from sales', value: `${Math.round(p)}¢`, sub: 'of every $1 sold' }); }
    else if (/debt \/ equity/.test(k)) { const x = parseFloat(first); if (Number.isFinite(x)) out.push({ label: 'Debt', value: x < 0.5 ? 'Low' : x < 1.5 ? 'Moderate' : 'High', sub: `${x.toFixed(2)} of what it owns` }); }
    else if (/^p\/e/.test(k)) out.push({ label: 'Price vs profit', value: first, sub: 'years to earn the price' });
    if (out.length >= 4) break;
  }
  return out;
}

const time = (d: Date) => d.toLocaleString('en-US', { timeZone: 'America/Edmonton', hour: 'numeric', minute: '2-digit' });
const dateLong = (d: Date) => d.toLocaleString('en-US', { timeZone: 'America/Edmonton', month: 'short', day: 'numeric', year: 'numeric' });
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The Telegram caption under the card image (HTML, plain English, <= 1024 chars). */
export function caption(d: CardData): string {
  const title = plainName(d.sym, d.name, d.market);
  const lines = [`<b>${esc(title)}</b>${title !== d.sym ? ` (${esc(d.sym)})` : ''} · ${esc(d.price == null ? 'n/a' : money(d, d.price))}`];
  const main = d.zones.find(z => z.state === 'inside') ?? d.zones.find(z => z.state === 'left') ?? d.zones.find(z => z.kind === 'buy') ?? d.zones[0];
  if (main) lines.push(esc(zoneSentence(d, main)));
  if (d.trend.length) lines.push(esc(d.trend.map(t => `${t.word.toLowerCase()} ${t.label === 'BIG PICTURE' ? 'in the big picture' : t.label.toLowerCase()}`).join(', ').replace(/^./, c => c.toUpperCase()) + '.'));
  if (d.social && d.social.bull + d.social.bear > 0) lines.push(esc(`${d.social.bull} of ${d.social.bull + d.social.bear} people posting on StockTwits expect a rise.`));
  lines.push('', `<i>For learning only, not financial advice · ${esc(time(d.at))} MT</i>`);
  return lines.join('\n').slice(0, 1020);
}

// ---- the image ------------------------------------------------------------------------------------------------------
const C = { ink: '#0B0F14', panel: '#10161D', line: '#232A33', text: '#EDE9E1', bright: '#F5F1E8', mute: '#A8A397', dim: '#8C877C', faint: '#6E6A61',
  gold: '#C9A96E', green: '#7FC8A9', greenBar: '#3E9C77', red: '#E39187', redBar: '#B8584F', amber: '#E8B26A' };
const SERIF = "'Instrument Serif', 'DejaVu Serif', serif", SANS = 'Inter', MONO = "'IBM Plex Mono', Inter";
const T = (x: number, y: number, s: string, size: number, fill: string, o: { font?: string; weight?: number; anchor?: string; ls?: number } = {}) =>
  `<text x="${x}" y="${y}" font-family="${o.font ?? SANS}" font-size="${size}" fill="${fill}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.anchor ? ` text-anchor="${o.anchor}"` : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}>${esc(s)}</text>`;
/** Greedy word wrap by an average glyph width (Inter ~0.52 em). */
export function wrap(s: string, size: number, width: number, maxLines = 2): string[] {
  const per = Math.max(8, Math.floor(width / (size * 0.52)));
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(/\s+/)) {
    if ((cur + ' ' + w).trim().length > per) { out.push(cur.trim()); cur = w; } else cur += ' ' + w;
    if (out.length === maxLines) break;
  }
  if (out.length < maxLines && cur.trim()) out.push(cur.trim());
  if (out.length === maxLines && s.length > out.join(' ').length) out[maxLines - 1] = out[maxLines - 1].replace(/\s*\S*$/, '') + '…';
  return out;
}

/** The 1080x1350 card as SVG. */
const SHORT: Record<string, string> = { 'Sales, last 12 months': 'Sales · 12 mo', 'Profit per share': 'Profit / share', 'Price vs profit': 'Price / profit' };
export function cardSvg(d: CardData): string {
  const W = 1080, X = 80, R = W - 80;
  const s: string[] = [];
  // brand row
  s.push(`<rect x="${X}" y="72" width="40" height="40" rx="10" fill="none" stroke="${C.gold}" stroke-width="1.5"/>`, T(X + 20, 101, 'R', 24, C.gold, { font: SERIF, anchor: 'middle' }),
    T(X + 56, 99, 'RAMANFX', 20, C.mute, { weight: 600, ls: 4.8 }), T(R, 99, `${dateLong(d.at)} · ${time(d.at)} MT`, 18, C.dim, { font: MONO, anchor: 'end' }));
  // name + price
  const title = plainName(d.sym, d.name, d.market);
  s.push(T(X, 262, d.sym, d.sym.length > 7 ? 104 : 132, C.bright, { font: SERIF }));
  s.push(T(X, 314, title !== d.sym ? title : (d.market === 'stock' ? 'Stock' : 'Market'), 26, C.mute));
  s.push(T(X, 398, d.price == null ? 'n/a' : money(d, d.price), 64, C.bright, { font: MONO, weight: 600 }), T(X + 20 + (money(d, d.price ?? 0).length * 38), 398, d.live ? 'live' : 'last close', 24, C.dim));
  // trend tiles
  const tw = (R - X - 32) / 3;
  d.trend.slice(0, 3).forEach((t, i) => {
    const x = X + i * (tw + 16);
    s.push(`<rect x="${x}" y="444" width="${tw}" height="108" rx="16" fill="none" stroke="${C.line}"/>`, T(x + 24, 484, t.label, 17, C.dim, { ls: 2.7 }),
      T(x + 24, 528, t.word, 30, t.up === true ? C.green : t.up === false ? C.red : C.amber));
  });
  // where the price is
  s.push(T(X, 610, 'WHERE THE PRICE IS NOW', 17, C.gold, { ls: 3.4 }));
  let y = 634;
  for (const z of d.zones.slice(0, 2)) {
    const buy = z.kind === 'buy';
    s.push(`<rect x="${X}" y="${y}" width="${R - X}" height="118" rx="18" fill="${C.panel}"/>`, `<rect x="${X + 28}" y="${y + 31}" width="12" height="56" rx="6" fill="${buy ? C.greenBar : C.redBar}"/>`);
    s.push(T(X + 64, y + 50, `${buy ? 'Buy' : 'Sell'} area · ${TF_ADJ[z.tf] ?? z.tf}`, 28, C.bright), T(X + 64 + ((buy ? 11 : 12) + (TF_ADJ[z.tf] ?? z.tf).length) * 15.5, y + 50, `${money(d, z.lo)} – ${money(d, z.hi)}`, 24, C.mute, { font: MONO }));
    const sent = zoneSentence(d, z).replace(/\s*\([^)]*\)/, '');
    s.push(T(X + 64, y + 88, wrap(sent, 21, R - X - 230, 1)[0] ?? '', 21, C.dim));
    s.push(T(R - 28, y + 72, z.state === 'inside' ? 'INSIDE' : `${z.away.toFixed(1)}%`, 32, buy ? C.green : C.red, { font: MONO, anchor: 'end' }));
    y += 134;
  }
  if (!d.zones.length) { s.push(T(X, y + 40, 'No buy or sell area near the price right now.', 24, C.dim)); y += 80; }
  // the daily chart (owner 2026-11-03: "include the image of the chart underneath")
  if (d.chart && d.chart.bars.length > 10) { y += 24; s.push(T(X, y + 17, 'DAILY CHART · LAST ' + d.chart.bars.length + ' DAYS', 17, C.gold, { ls: 3.4 })); y += 36; s.push(miniChart(d.chart, X, y, R - X, 380, d.price)); y += 380 + 8;
    s.push(T(X, y + 22, `Green: buy areas · red: sell areas${d.chart.lines.length ? ' · lilac: trend lines' : ''} · gold: price now`, 17, C.faint)); y += 34; }
  // key points
  if (d.points?.length) {
    y += 40; s.push(T(X, y, 'KEY POINTS', 17, C.gold, { ls: 3.4 })); y += 14;
    for (const p of d.points.slice(0, 4)) {
      const ls = wrap(p, 23, R - X - 36, 2);
      s.push(`<circle cx="${X + 7}" cy="${y + 30}" r="5" fill="${C.gold}"/>`);
      ls.forEach((l, k) => s.push(T(X + 30, y + 38 + k * 32, l, 23, C.text)));
      y += 18 + ls.length * 32;
    }
  }
  // company numbers (stocks)
  y += 30;
  if (d.fund.length) {
    s.push(`<line x1="${X}" y1="${y}" x2="${R}" y2="${y}" stroke="${C.line}"/>`);
    const fw = (R - X) / d.fund.length;
    d.fund.forEach((f, i) => {
      const x = X + i * fw;
      s.push(T(x, y + 42, (SHORT[f.label] ?? f.label).toUpperCase(), 15, C.dim, { ls: 2 }), T(x, y + 84, f.value, 30, C.text, { font: MONO }));
      if (f.sub) s.push(T(x, y + 114, f.sub, 17, f.sub.startsWith('up') ? C.green : f.sub.startsWith('down') ? C.red : C.dim));
    });
    y += 140;
    s.push(`<line x1="${X}" y1="${y}" x2="${R}" y2="${y}" stroke="${C.line}"/>`);
  }
  // what people say + news
  y += 50;
  const half = (R - X - 40) / 2;
  if (d.social && d.social.bull + d.social.bear > 0) {
    const tot = d.social.bull + d.social.bear, p = d.social.bull / tot;
    s.push(T(X, y, 'WHAT PEOPLE SAY', 17, C.gold, { ls: 3.4 }), T(X, y + 40, `${d.social.n} recent posts on StockTwits`, 22, C.text),
      `<rect x="${X}" y="${y + 60}" width="${half * p}" height="10" rx="5" fill="${C.greenBar}"/>`, `<rect x="${X + half * p}" y="${y + 60}" width="${half * (1 - p)}" height="10" rx="5" fill="${C.redBar}"/>`,
      T(X, y + 100, `${d.social.bull} expect a rise · ${d.social.bear} expect a fall`, 19, C.dim));
  }
  if (d.headline) {
    const hx = d.social ? X + half + 40 : X, hw = d.social ? half : R - X;
    s.push(T(hx, y, 'IN THE NEWS', 17, C.gold, { ls: 3.4 }));
    wrap(d.headline.title, 22, hw, 2).forEach((l, i) => s.push(T(hx, y + 40 + i * 30, l, 22, C.text)));
    s.push(T(hx, y + 106, d.headline.meta, 17, C.dim));
  }
  if (d.social || d.headline) y += 130;
  const H = Math.max(1350, y + 130);
  // footer
  s.push(T(X, H - 72, 'Read with the supply &amp; demand method'.replace('&amp;', '&'), 17, C.faint), T(R, H - 72, 'For learning only, not financial advice', 17, C.faint, { anchor: 'end' }));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${C.ink}"/>` + s.join('') + '</svg>';
}
/** A compact candle chart: the buy / sell areas as bands, candles, the trend lines and the price line. */
function miniChart(c: CardChart, x0: number, y0: number, w: number, h: number, price: number | null): string {
  const bars = c.bars, n = bars.length;
  let lo = Math.min(...bars.map(b => b.l)), hi = Math.max(...bars.map(b => b.h));
  const pad = (hi - lo) * 0.08 || hi * 0.01; lo -= pad; hi += pad;
  const axis = 120, pw = w - axis;
  const Y = (v: number) => y0 + (hi - v) / (hi - lo) * h, step = pw / n, X = (i: number) => x0 + step * (i + 0.5);
  const out: string[] = [`<rect x="${x0}" y="${y0}" width="${w}" height="${h}" rx="14" fill="${C.panel}"/>`, `<clipPath id="mc"><rect x="${x0}" y="${y0}" width="${pw}" height="${h}"/></clipPath>`, '<g clip-path="url(#mc)">'];
  for (const z of c.zones) {
    if (z.hi < lo || z.lo > hi) continue;
    const a = Y(Math.min(hi, z.hi)), b = Y(Math.max(lo, z.lo));
    out.push(`<rect x="${x0}" y="${a}" width="${pw}" height="${Math.max(2, b - a)}" fill="${z.side === 'demand' ? C.greenBar : C.redBar}" fill-opacity="0.22"/>`);
  }
  const bw = Math.max(2, step * 0.62);
  bars.forEach((b, i) => {
    const up = b.c >= b.o, col = up ? C.green : C.red, xc = X(i);
    out.push(`<line x1="${xc}" y1="${Y(b.h)}" x2="${xc}" y2="${Y(b.l)}" stroke="${col}" stroke-width="1.5"/>`,
      `<rect x="${xc - bw / 2}" y="${Y(Math.max(b.o, b.c))}" width="${bw}" height="${Math.max(1.5, Math.abs(Y(b.o) - Y(b.c)))}" fill="${col}"/>`);
  });
  for (const l of c.lines) {
    const pts = l.filter(([i]) => Number.isFinite(i));
    if (pts.length < 2) continue;
    const [a, b] = [pts[0], pts[pts.length - 1]];
    const k = (b[1] - a[1]) / ((b[0] - a[0]) || 1), i0 = Math.max(a[0], -0.5), i1 = n - 0.5;
    if (i1 <= i0) continue;
    out.push(`<line x1="${X(i0)}" y1="${Y(a[1] + k * (i0 - a[0]))}" x2="${X(i1)}" y2="${Y(a[1] + k * (i1 - a[0]))}" stroke="#C4B5FD" stroke-width="2.5"/>`);
  }
  out.push('</g>');
  const fmt = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: c.digits, maximumFractionDigits: c.digits });
  for (const v of [hi - pad, (hi + lo) / 2, lo + pad]) if (price == null || Math.abs(Y(v) - Y(price)) > 34) out.push(T(x0 + w - 14, Y(v) + 6, fmt(v), 17, C.faint, { font: MONO, anchor: 'end' }));
  if (price != null && price > lo && price < hi) {
    out.push(`<line x1="${x0}" y1="${Y(price)}" x2="${x0 + pw}" y2="${Y(price)}" stroke="${C.gold}" stroke-width="1.5" stroke-dasharray="6 6"/>`,
      `<rect x="${x0 + pw + 4}" y="${Y(price) - 16}" width="${axis - 12}" height="32" rx="6" fill="${C.gold}"/>`, T(x0 + pw + 4 + (axis - 12) / 2, Y(price) + 7, fmt(price), 17, C.ink, { font: MONO, anchor: 'middle', weight: 600 }));
  }
  return out.join('');
}
