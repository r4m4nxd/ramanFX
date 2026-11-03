// /fund SYM (alias /fundamentals) and the [📑 Fundamentals] button (callback f:SYM): the nightly files of
// tools/fundamentals/build.py (.github/workflows/fundamentals.yml), loaded through ctx.load:
//   'fundamentals/fx.json'      per currency: policy rate (last decision, change, last move, next meeting), CPI y/y, GDP,
//                               unemployment; per FX pair: rate gap, carry side, one-line bias; notes for metals /
//                               indices / energy / crypto (TradingView calendar + federalreserve.gov FOMC dates)
//   'fundamentals/stocks.json'  per scanner stock: SEC EDGAR market cap, revenue / EPS TTM + YoY, net margin,
//                               debt / equity, P/E, 8-K filings, last / next earnings (Nasdaq or estimated)
// A stock missing from stocks.json falls back to the stock scanner's own fundamentals rows (scanner/t shards).
// Context only, never a signal. Pure: the caller passes the loaded JSON through ctx (vitest: telegramFundamentals.test.ts).

import { clock, day, esc, fit, isoDay, resolve, type Button, type Ctx, type Reply } from './logic.ts';
import { insiderLine } from './insiders.ts';
import { holdersButton } from './holders.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const FOOT_FX = 'Background only, not a trade signal · For learning only, not financial advice';
const FOOT_ST = 'Background only, not a trade signal · For learning only, not financial advice';
const CCY_NAME: Record<string, string> = { USD: 'US dollar', EUR: 'Euro', GBP: 'British pound', JPY: 'Japanese yen', AUD: 'Australian dollar', NZD: 'New Zealand dollar', CAD: 'Canadian dollar', CHF: 'Swiss franc', CNH: 'Chinese yuan', CNY: 'Chinese yuan',
  SEK: 'Swedish krona', NOK: 'Norwegian krone', MXN: 'Mexican peso', ZAR: 'South African rand', SGD: 'Singapore dollar', PLN: 'Polish zloty', HUF: 'Hungarian forint', CZK: 'Czech koruna', TRY: 'Turkish lira', DKK: 'Danish krone', HKD: 'Hong Kong dollar', THB: 'Thai baht' };
const MAJORS = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'NZD', 'CAD', 'CHF'];
export const EARNINGS_DAYS = 14;

const when = (iso: unknown): Date | null => { const t = Date.parse(String(iso ?? '')); return Number.isFinite(t) ? new Date(t) : null; };
/** 'Oct 28' on the Calgary calendar (an ISO instant), or a plain 'YYYY-MM-DD' date as written. */
export function md(v: unknown): string {
  const s = String(v ?? '');
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { const t = new Date(`${s}T12:00:00Z`); return `${t.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })} ${t.getUTCDate()}`; }
  const t = when(s);
  return t ? day(t).slice(4) : '';
}
const rate = (v: unknown) => (num(v) == null ? 'n/a' : `${(v as number).toFixed(2)}%`);
const pct1 = (v: unknown, sign = false) => (num(v) == null ? 'n/a' : `${sign && (v as number) > 0 ? '+' : ''}${(v as number).toFixed(1)}%`);
export function money(v: unknown, cur = 'USD'): string {
  const x = num(v);
  if (x == null) return 'n/a';
  const a = Math.abs(x);
  const s = a >= 1e12 ? `${(a / 1e12).toFixed(2)}T` : a >= 1e9 ? `${(a / 1e9).toFixed(1)}B` : a >= 1e6 ? `${(a / 1e6).toFixed(0)}M` : a.toFixed(0);
  return `${x < 0 ? '-' : ''}${cur === 'USD' ? '$' : `${cur} `}${s}`;
}
/** Whole days from Calgary today to a 'YYYY-MM-DD' date. */
export const daysTo = (d: string, now: Date) => Math.round((Date.parse(`${d}T12:00:00Z`) - Date.parse(`${isoDay(now)}T12:00:00Z`)) / 86400000);
const inDays = (n: number) => (n === 0 ? 'today' : n === 1 ? 'tomorrow' : n > 1 ? `in ${n} days` : n === -1 ? 'yesterday' : `${-n} days ago`);
const builtAt = (js: J) => { const t = when(js.generated_at); return t ? `built ${day(t)} · ${clock(t)}` : ''; };
export const fundButton = (sym: string): Button => ({ text: 'Company', callback_data: `f:${sym}` });
/** A scanner fundamentals row ('Revenue TTM', '$303.0B +83% YoY (2026-07)') in plain words. */
export function plainRow(k: string, v: string): string {
  const key = k.trim().toLowerCase();
  let val = v.replace(/\s*\(\d{4}-\d{2}\)/g, '').trim();
  val = val.replace(/([+-])(\d+(?:\.\d+)?)% (?:YoY|y\/y)/i, (_, sg, n) => `· ${sg === '-' ? 'down' : 'up'} ${n}% on last year`)
    .replace(/([+-])(\d+(?:\.\d+)?)% 1y/i, (_, sg, n) => `· ${sg === '-' ? 'down' : 'up'} ${n}% in a year`);
  const per = /ttm/.test(key) ? 'last 12 months' : /fy/.test(key) ? 'last year' : '';
  if (/^revenue/.test(key)) return `Sales${per ? ` (${per})` : ''}: ${val}`;
  if (/^eps/.test(key)) return `Profit per share${per ? ` (${per})` : ''}: ${val}`;
  if (/net margin/.test(key)) { const n = parseFloat(val); return Number.isFinite(n) ? `Kept as profit: ${Math.round(n)}¢ of every $1 of sales` : `Kept as profit: ${val}`; }
  if (/ocf|fcf/.test(key)) { const [a, b] = val.split('/').map(x => x.trim()); return b ? `Cash made: ${a} from the business · ${b} left after investing` : `Cash made: ${val}`; }
  if (/debt \/ equity/.test(key)) { const x = parseFloat(val); return Number.isFinite(x) ? `Debt: ${x < 0.5 ? 'low' : x < 1.5 ? 'moderate' : 'high'} (${x.toFixed(2)} for every $1 the owners hold)` : `Debt: ${val}`; }
  if (/^shares/.test(key)) return `Shares: ${val}`;
  if (/^p\/e/.test(key)) { const x = parseFloat(val); return Number.isFinite(x) ? `Price vs profit: ${x.toFixed(0)} years of profit to pay the price` : `Price vs profit: ${val}`; }
  if (/market cap/.test(key)) return `Company value: ${val}`;
  if (/52w/.test(key)) { const x = parseFloat(val); return Number.isFinite(x) ? `Over the past year: price is ${Math.round(x)}% of the way from its low to its high` : `Past year: ${val}`; }
  if (/from ath/.test(key)) { const x = parseFloat(val); return Number.isFinite(x) ? (x < -0.5 ? `Below its all-time high by ${Math.abs(Math.round(x))}%` : 'At or near its all-time high') : `From its high: ${val}`; }
  return `${k}: ${val}`;
}

// ---- forex --------------------------------------------------------------------------------------------------------
function decision(r: J): string {
  const c = num(r.chg);
  const what = c == null ? 'last decision' : c > 0 ? `hiked ${c.toFixed(2)}` : c < 0 ? `cut ${Math.abs(c).toFixed(2)}` : 'held';
  const mv = obj(r.move);
  const last = c === 0 && mv.date ? ` (last ${num(mv.chg)! > 0 ? 'hike' : 'cut'} ${md(mv.date)})` : '';
  return `${what} ${md(r.date)}${last}`;
}
/** Two lines per currency: the bank and its rate, then CPI / GDP / jobless. */
export function currencyLines(ccy: string, c: J): string[] {
  const r = obj(c.rate), n = obj(c.next);
  const head = [`● <b>${esc(CCY_NAME[ccy] ?? ccy)}</b> · interest rate ${rate(r.v)} (${esc(c.bank ?? '')})`];
  if (r.date) head.push(esc(decision(r)));
  if (n.date) head.push(esc(`next ${md(n.date)}${num(n.forecast) != null && num(r.v) != null && n.forecast !== r.v ? ` (exp. ${rate(n.forecast)})` : ''}`));
  const cpi = obj(c.cpi), g = obj(c.gdp), u = obj(c.unemp);
  const data = [num(cpi.v) != null ? `prices rising ${pct1(cpi.v)} a year${cpi.period ? ` (${cpi.period})` : ''}` : '',
    num(g.v) != null ? `economy growing ${pct1(g.v, true)} ${g.basis ?? ''}${g.period ? ` (${g.period})` : ''}` : '',
    num(u.v) != null ? `out of work ${pct1(u.v)}` : ''].filter(Boolean);
  return [head.join(' · '), ...(data.length ? [`   ${esc(data.join(' · '))}`] : [])];
}

function pairLines(sym: string, p: J, cur: J): string[] {
  const a = String(p.base), b = String(p.quote), ca = obj(cur[a]), cb = obj(cur[b]);
  const lines = [...currencyLines(a, ca), ...currencyLines(b, cb), ''];
  const carry = obj(p.carry), d = num(p.diff);
  if (d != null) {
    lines.push(carry.earns
      ? `● Interest gap: the <b>${esc(CCY_NAME[carry.ccy] ?? carry.ccy)}</b> pays ${Math.abs(d).toFixed(2)}% more, so ${carry.earns === 'long' ? 'buying' : 'selling'} ${esc(sym)} earns a little interest each night (your broker sets the exact amount)`
      : `● Interest gap: ${Math.abs(d).toFixed(2)}%, about level: little interest either way`);
  }
  if (num(obj(ca.cpi).v) != null && num(obj(cb.cpi).v) != null) lines.push(esc(`● Prices rising: ${a} ${pct1(ca.cpi.v)} vs ${b} ${pct1(cb.cpi.v)} a year`));
  if (num(p.gdp_diff) != null) lines.push(esc(`● Economy growing: ${a} ${pct1(ca.gdp.v, true)} vs ${b} ${pct1(cb.gdp.v, true)} ${ca.gdp.basis}`));
  lines.push(`● <b>What the economies say</b>: ${esc(p.bias)}`);
  return lines;
}

/** /fund with no symbol: the major central banks at a glance. */
function overview(fx: J): Reply {
  const cur = obj(fx.currencies);
  const lines = ['<b>Interest rates</b> · the main currencies', ''];
  for (const c of MAJORS) {
    const d = obj(cur[c]);
    if (!d.rate && !d.cpi) continue;
    const r = obj(d.rate), n = obj(d.next);
    lines.push(`● <b>${esc(CCY_NAME[c] ?? c)}</b> ${rate(r.v)} · prices rising ${pct1(obj(d.cpi).v)}${n.date ? ` · next decision ${esc(md(n.date))}` : ''}`);
  }
  lines.push('', 'Send <b>/fund EURUSD</b> or <b>/fund NVDA</b> for one symbol.', `<i>${esc(builtAt(fx))} · ${FOOT_FX}</i>`);
  return { cmd: 'fund', text: fit(lines) };
}

// ---- stocks -------------------------------------------------------------------------------------------------------
/** '📑 next earnings: Nov 4 (in 6 days)' when a stock reports within EARNINGS_DAYS (Calgary calendar), else ''. */
export function earningsText(e: J, now: Date): string {
  const d = String(e.er_next ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
  const n = daysTo(d, now);
  if (n < 0 || n > EARNINGS_DAYS) return '';
  return `Next earnings report: ${md(d)}${e.er_time ? ` ${e.er_time}` : ''} (${inDays(n)}${e.er_kind === 'estimated' ? ', estimated' : ''})`;
}
export async function earningsLine(sym: string, ctx: Ctx): Promise<string> {
  try { return esc(earningsText(obj(obj(obj(await ctx.load('fundamentals/stocks.json')).stocks)[sym]), ctx.now)); } catch { return ''; }
}

function stockLines(e: J, st: J, now: Date): string[] {
  const cur = String(e.cur ?? 'USD');
  const lines: string[] = [];
  const mc = num(e.mcap), pe = num(e.pe), eps = num(e.eps);
  lines.push(`Company value <b>${esc(money(mc))}</b> · price vs profit <b>${pe != null ? `${pe.toFixed(0)} years` : eps != null && eps <= 0 ? 'losing money' : 'n/a'}</b>${e.pe_note ? ` (${esc(e.pe_note)})` : ''}`);
  const per = e.per === 'FY' ? 'last year' : 'last 12 months';
  const yoy = (g: unknown) => { const x = num(g); return x == null ? '' : ` · ${x < 0 ? 'down' : 'up'} ${Math.abs(Math.round(x * 100))}% on last year`; };
  if (num(e.rev) != null) lines.push(esc(`Sales (${per}): ${money(e.rev, cur)}${yoy(e.rev_g)}`));
  if (eps != null) lines.push(esc(`Profit per share (${per}): ${eps.toFixed(2)}${cur !== 'USD' ? ` ${cur}` : ''}${yoy(e.eps_g)}`));
  if (num(e.nm) != null) lines.push(esc(`Kept as profit: ${Math.round((e.nm as number) * 100)}¢ of every $1 of sales`));
  if (num(e.de) != null) { const x = e.de as number; lines.push(esc(`Debt: ${x < 0.5 ? 'low' : x < 1.5 ? 'moderate' : 'high'} (${x.toFixed(2)} for every $1 the owners hold)`)); }
  const er: string[] = [];
  if (e.er_last) er.push(`last ${md(e.er_last)}`);
  if (e.er_next) {
    const n = daysTo(String(e.er_next), now);
    er.push(`next ${e.er_kind === 'estimated' ? '~' : ''}${md(e.er_next)}${e.er_time ? ` ${e.er_time}` : ''} (${inDays(n)}${e.er_kind === 'estimated' ? ', estimated' : ''})`);
  }
  if (er.length) lines.push(`Earnings reports: ${esc(er.join(' · '))}${num(e.eps_est) != null ? ` · expected profit per share ${esc((e.eps_est as number).toFixed(2))}` : ''}`);
  const fl = Array.isArray(e.filings) ? e.filings.slice(0, 4) : [];
  if (fl.length) {
    lines.push('', '<b>Latest company announcements</b> (SEC 8-K)');
    for (const f of fl) lines.push(`• ${esc(md(f[0]))} · ${esc(f[2] ?? f[1])}`);
  }
  const src = [e.end ? `SEC filings to ${md(e.end)}` : '', e.px != null && st.price_date ? `price ${md(st.price_date)} close` : '', builtAt(st)].filter(Boolean);
  lines.push('', esc(src.join(' · ')));
  return lines;
}

async function stockFund(sym: string, row: J, ctx: Ctx, raw = false): Promise<Reply> {
  const st = obj(await ctx.load('fundamentals/stocks.json'));
  const e = obj(obj(st.stocks)[sym]);
  const name = e.n ?? row.n ?? '';
  const lines = [raw ? `📑 <b>${esc(sym)}</b>` : `<b>${esc(name || sym)}</b>${name ? ` (${esc(sym)})` : ''} · the company in numbers`, ''];
  const buttons: Button[][] = [[{ text: 'Buy & sell areas', callback_data: `z:${sym}` }, { text: 'Chart', callback_data: `c:${sym}` }, holdersButton(sym)]];
  if (e.cik) buttons.push([{ text: 'SEC filings', url: `https://www.sec.gov/edgar/browse/?CIK=${encodeURIComponent(String(e.cik))}` }]);
  if (e.na) {
    lines.push(`n/a: ${esc(e.na)}`);
  } else if (e.src) {
    lines.push(...stockLines(e, st, ctx.now));
  } else {
    // not in the nightly file yet: the stock scanner's own fundamentals rows (its SEC fetch), plus any earnings date
    const d = obj(obj(obj(await ctx.load(`scanner/t/${row.k}.json`)).tickers)[sym]);
    const rows = Array.isArray(d.fundamentals_rows) ? d.fundamentals_rows.filter((r: unknown) => Array.isArray(r) && r.length >= 2) : [];
    if (rows.length) {
      if (raw) for (const [k, v] of rows.slice(0, 10)) lines.push(`${esc(k)}: ${esc(v)}`);
      else lines.push(`<blockquote>${rows.slice(0, 10).map(([k, v]: [string, string]) => esc(plainRow(String(k), String(v)))).join('\n')}</blockquote>`);
      lines.push('', `<i>${esc(`From SEC filings${d.date ? ` · price at the ${md(d.date)} close` : ''}`)}</i>`);
    } else {
      lines.push('No company numbers published for it yet (the nightly refresh fills them in).');
    }
    const er = stockLines({ er_last: e.er_last, er_next: e.er_next, er_kind: e.er_kind, er_time: e.er_time, filings: e.filings }, {}, ctx.now)
      .filter(l => l.startsWith('Earnings reports') || l.startsWith('•') || l.startsWith('<b>Latest company announcements'));
    if (er.length) lines.push(...er);
  }
  const ins = await insiderLine(sym, ctx).catch(() => '');   // '🕵️ insiders bought $X in last 30d' (insiders.ts)
  if (ins) lines.push('', ins);
  lines.push(`<i>${FOOT_ST}</i>`);
  return { cmd: 'fund', text: fit(lines), buttons };
}

// ---- command ------------------------------------------------------------------------------------------------------
export async function cmdFund(q: string, ctx: Ctx, raw = false): Promise<Reply> {
  if (!q) {
    const fx = obj(await ctx.load('fundamentals/fx.json'));
    if (!fx.currencies) return { cmd: 'fund', text: 'Send a symbol after it, e.g. <b>/fund EURUSD</b> or <b>/fund NVDA</b>.' };
    return overview(fx);
  }
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'fund', text: `📑 <b>${esc([...q.toUpperCase()].slice(0, 30).join(''))}</b> not found` + (suggest.length ? `\nDid you mean: ${suggest.map(s => `/fund ${esc(s)}`).join(' · ')}` : '') };
  if (hit.market === 'stock') return stockFund(hit.sym, hit.row, ctx, raw);
  const fx = obj(await ctx.load('fundamentals/fx.json'));
  const cur = obj(fx.currencies);
  const sym = hit.sym;
  const buttons: Button[][] = [[{ text: 'Buy & sell areas', callback_data: `z:${sym}` }, { text: 'Chart', callback_data: `c:${sym}` }]];
  if (!fx.currencies) return { cmd: 'fund', text: '⚠️ <b>Fundamentals unavailable</b>\nThe nightly file did not load. Try again in a minute.', buttons };
  const lines = [`<b>${esc(sym)}</b> · the economies behind it`, ''];
  const p = obj(obj(fx.pairs)[sym]), note = obj(obj(fx.notes)[sym]);
  if (p.base) lines.push(...pairLines(sym, p, cur));
  else if (note.text) {
    lines.push(esc(note.text), '');
    for (const c of Array.isArray(note.ccys) ? note.ccys : []) if (cur[c]) lines.push(...currencyLines(c, obj(cur[c])));
  } else {
    lines.push('No fundamentals for it yet (its central-bank data is not on the calendar).');
  }
  lines.push('', `<i>${esc(`TradingView calendar${cur.USD?.next?.verified ? ', federalreserve.gov' : ''} · ${builtAt(fx)} MT`)} · ${FOOT_FX}</i>`);
  return { cmd: 'fund', text: fit(lines), buttons };
}
