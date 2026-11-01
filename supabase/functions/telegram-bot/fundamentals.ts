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
const FOOT_FX = 'Fundamental context, not a signal · not advice';
const FOOT_ST = 'Context only: not part of the zone rules · not advice';
const FLAG: Record<string, string> = { USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', JPY: '🇯🇵', AUD: '🇦🇺', NZD: '🇳🇿', CAD: '🇨🇦', CHF: '🇨🇭', CNH: '🇨🇳', CNY: '🇨🇳',
  SEK: '🇸🇪', NOK: '🇳🇴', MXN: '🇲🇽', ZAR: '🇿🇦', SGD: '🇸🇬', PLN: '🇵🇱', HUF: '🇭🇺', CZK: '🇨🇿', TRY: '🇹🇷', DKK: '🇩🇰', HKD: '🇭🇰', THB: '🇹🇭' };
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
/** A fraction as a whole percent: 0.712 -> '+71%' (sign) / '71%'. */
const frac = (v: unknown, sign = true) => (num(v) == null ? 'n/a' : `${sign && (v as number) > 0 ? '+' : ''}${Math.round((v as number) * 100)}%`);
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
export const fundButton = (sym: string): Button => ({ text: '📑 Fundamentals', callback_data: `f:${sym}` });

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
  const head = [`${FLAG[ccy] ?? '•'} <b>${esc(ccy)}</b> · ${esc(c.bank ?? '')} ${rate(r.v)}`];
  if (r.date) head.push(esc(decision(r)));
  if (n.date) head.push(esc(`next ${md(n.date)}${num(n.forecast) != null && num(r.v) != null && n.forecast !== r.v ? ` (exp. ${rate(n.forecast)})` : ''}`));
  const cpi = obj(c.cpi), g = obj(c.gdp), u = obj(c.unemp);
  const data = [num(cpi.v) != null ? `CPI ${pct1(cpi.v)}${cpi.period ? ` (${cpi.period})` : ''}` : '',
    num(g.v) != null ? `GDP ${pct1(g.v, true)} ${g.basis ?? ''}${g.period ? ` (${g.period})` : ''}` : '',
    num(u.v) != null ? `jobless ${pct1(u.v)}` : ''].filter(Boolean);
  return [head.join(' · '), ...(data.length ? [`   ${esc(data.join(' · '))}`] : [])];
}

function pairLines(sym: string, p: J, cur: J): string[] {
  const a = String(p.base), b = String(p.quote), ca = obj(cur[a]), cb = obj(cur[b]);
  const lines = [...currencyLines(a, ca), ...currencyLines(b, cb), ''];
  const carry = obj(p.carry), d = num(p.diff);
  if (d != null) {
    lines.push(carry.earns
      ? `💰 Rate gap: <b>${esc(carry.ccy)} +${Math.abs(d).toFixed(2)}%</b> → ${esc(carry.earns)} ${esc(sym)} earns the carry (broker swap varies)`
      : `💰 Rate gap: ${Math.abs(d).toFixed(2)}%, about level: little carry either way`);
  }
  if (num(obj(ca.cpi).v) != null && num(obj(cb.cpi).v) != null) lines.push(esc(`Inflation: ${a} ${pct1(ca.cpi.v)} vs ${b} ${pct1(cb.cpi.v)}`));
  if (num(p.gdp_diff) != null) lines.push(esc(`Growth: ${a} ${pct1(ca.gdp.v, true)} vs ${b} ${pct1(cb.gdp.v, true)} ${ca.gdp.basis}`));
  lines.push(`🧭 <b>Bias</b>: ${esc(p.bias)}`);
  return lines;
}

/** /fund with no symbol: the major central banks at a glance. */
function overview(fx: J): Reply {
  const cur = obj(fx.currencies);
  const lines = ['📑 <b>Central banks · majors</b>', ''];
  for (const c of MAJORS) {
    const d = obj(cur[c]);
    if (!d.rate && !d.cpi) continue;
    const r = obj(d.rate), n = obj(d.next);
    lines.push(`${FLAG[c]} <b>${c}</b> ${rate(r.v)} · CPI ${pct1(obj(d.cpi).v)}${n.date ? ` · next ${esc(md(n.date))}` : ''}`);
  }
  lines.push('', 'Send <b>/fund EURUSD</b> or <b>/fund NVDA</b> for one symbol.', `<i>${FOOT_FX}</i> · ${esc(builtAt(fx))}`);
  return { cmd: 'fund', text: fit(lines) };
}

// ---- stocks -------------------------------------------------------------------------------------------------------
/** '📑 next earnings: Nov 4 (in 6 days)' when a stock reports within EARNINGS_DAYS (Calgary calendar), else ''. */
export function earningsText(e: J, now: Date): string {
  const d = String(e.er_next ?? '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return '';
  const n = daysTo(d, now);
  if (n < 0 || n > EARNINGS_DAYS) return '';
  return `📑 next earnings: ${md(d)}${e.er_time ? ` ${e.er_time}` : ''} (${inDays(n)}${e.er_kind === 'estimated' ? ', estimated' : ''})`;
}
export async function earningsLine(sym: string, ctx: Ctx): Promise<string> {
  try { return esc(earningsText(obj(obj(obj(await ctx.load('fundamentals/stocks.json')).stocks)[sym]), ctx.now)); } catch { return ''; }
}

function stockLines(e: J, st: J, now: Date): string[] {
  const cur = String(e.cur ?? 'USD');
  const lines: string[] = [];
  const mc = num(e.mcap), pe = num(e.pe), eps = num(e.eps);
  lines.push(`Market cap <b>${esc(money(mc))}</b> · P/E <b>${pe != null ? pe.toFixed(1) : eps != null && eps <= 0 ? 'neg (loss)' : 'n/a'}</b>${e.pe_note ? ` (${esc(e.pe_note)})` : ''}`);
  const per = e.per === 'FY' ? 'FY' : 'TTM';
  if (num(e.rev) != null) lines.push(esc(`Revenue ${money(e.rev, cur)} ${per} (${frac(e.rev_g)} y/y)`));
  if (eps != null) lines.push(esc(`EPS ${eps.toFixed(2)}${cur !== 'USD' ? ` ${cur}` : ''} ${per} (${frac(e.eps_g)} y/y)${num(e.nm) != null ? ` · net margin ${frac(e.nm, false)}` : ''}`));
  else if (num(e.nm) != null) lines.push(esc(`Net margin ${frac(e.nm, false)}`));
  if (num(e.de) != null) lines.push(esc(`Debt / equity ${(e.de as number).toFixed(2)}`));
  const er: string[] = [];
  if (e.er_last) er.push(`last ${md(e.er_last)}`);
  if (e.er_next) {
    const n = daysTo(String(e.er_next), now);
    er.push(`next ${e.er_kind === 'estimated' ? '~' : ''}${md(e.er_next)}${e.er_time ? ` ${e.er_time}` : ''} (${inDays(n)}${e.er_kind === 'estimated' ? ', estimated' : ''})`);
  }
  if (er.length) lines.push(`📅 Earnings: ${esc(er.join(' · '))}${num(e.eps_est) != null ? ` · EPS est. ${esc((e.eps_est as number).toFixed(2))}` : ''}`);
  const fl = Array.isArray(e.filings) ? e.filings.slice(0, 4) : [];
  if (fl.length) {
    lines.push('', '<b>Latest 8-K filings</b>');
    for (const f of fl) lines.push(`• ${esc(md(f[0]))} · ${esc(f[2] ?? f[1])}`);
  }
  const src = [e.end ? `SEC filings to ${md(e.end)}` : '', e.px != null && st.price_date ? `price ${md(st.price_date)} close` : '', builtAt(st)].filter(Boolean);
  lines.push('', esc(src.join(' · ')));
  return lines;
}

async function stockFund(sym: string, row: J, ctx: Ctx): Promise<Reply> {
  const st = obj(await ctx.load('fundamentals/stocks.json'));
  const e = obj(obj(st.stocks)[sym]);
  const name = e.n ?? row.n ?? '';
  const lines = [`📑 <b>${esc(sym)}</b>${name ? ` · ${esc(name)}` : ''} · fundamentals`, ''];
  const buttons: Button[][] = [[{ text: `🔎 Zones ${sym}`, callback_data: `z:${sym}` }, { text: `📊 Chart ${sym}`, callback_data: `c:${sym}` }, holdersButton(sym)]];
  if (e.cik) buttons.push([{ text: '📄 SEC filings', url: `https://www.sec.gov/edgar/browse/?CIK=${encodeURIComponent(String(e.cik))}` }]);
  if (e.na) {
    lines.push(`n/a: ${esc(e.na)}`);
  } else if (e.src) {
    lines.push(...stockLines(e, st, ctx.now));
  } else {
    // not in the nightly file yet: the stock scanner's own fundamentals rows (its SEC fetch), plus any earnings date
    const d = obj(obj(obj(await ctx.load(`scanner/t/${row.k}.json`)).tickers)[sym]);
    const rows = Array.isArray(d.fundamentals_rows) ? d.fundamentals_rows.filter((r: unknown) => Array.isArray(r) && r.length >= 2) : [];
    if (rows.length) {
      for (const [k, v] of rows.slice(0, 10)) lines.push(`${esc(k)}: ${esc(v)}`);
      lines.push('', esc(`Source: stock scanner (SEC XBRL)${d.date ? ` · price ${md(d.date)} close` : ''}`));
    } else {
      lines.push('No fundamentals published for it yet (the nightly SEC refresh fills them in).');
    }
    const er = stockLines({ er_last: e.er_last, er_next: e.er_next, er_kind: e.er_kind, er_time: e.er_time, filings: e.filings }, {}, ctx.now)
      .filter(l => l.startsWith('📅') || l.startsWith('•') || l === '<b>Latest 8-K filings</b>');
    if (er.length) lines.push(...er);
  }
  const ins = await insiderLine(sym, ctx).catch(() => '');   // '🕵️ insiders bought $X in last 30d' (insiders.ts)
  if (ins) lines.push('', ins);
  lines.push(`<i>${FOOT_ST}</i>`);
  return { cmd: 'fund', text: fit(lines), buttons };
}

// ---- command ------------------------------------------------------------------------------------------------------
export async function cmdFund(q: string, ctx: Ctx): Promise<Reply> {
  if (!q) {
    const fx = obj(await ctx.load('fundamentals/fx.json'));
    if (!fx.currencies) return { cmd: 'fund', text: 'Send a symbol after it, e.g. <b>/fund EURUSD</b> or <b>/fund NVDA</b>.' };
    return overview(fx);
  }
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'fund', text: `📑 <b>${esc([...q.toUpperCase()].slice(0, 30).join(''))}</b> not found` + (suggest.length ? `\nDid you mean: ${suggest.map(s => `/fund ${esc(s)}`).join(' · ')}` : '') };
  if (hit.market === 'stock') return stockFund(hit.sym, hit.row, ctx);
  const fx = obj(await ctx.load('fundamentals/fx.json'));
  const cur = obj(fx.currencies);
  const sym = hit.sym;
  const buttons: Button[][] = [[{ text: `🔎 Zones ${sym}`, callback_data: `z:${sym}` }, { text: `📊 Chart ${sym}`, callback_data: `c:${sym}` }]];
  if (!fx.currencies) return { cmd: 'fund', text: '⚠️ <b>Fundamentals unavailable</b>\nThe nightly file did not load. Try again in a minute.', buttons };
  const lines = [`📑 <b>${esc(sym)}</b> · fundamentals`, ''];
  const p = obj(obj(fx.pairs)[sym]), note = obj(obj(fx.notes)[sym]);
  if (p.base) lines.push(...pairLines(sym, p, cur));
  else if (note.text) {
    lines.push(esc(note.text), '');
    for (const c of Array.isArray(note.ccys) ? note.ccys : []) if (cur[c]) lines.push(...currencyLines(c, obj(cur[c])));
  } else {
    lines.push('No fundamentals for it yet (its central-bank data is not on the calendar).');
  }
  lines.push('', `<i>${FOOT_FX}</i>`, esc(`Data: TradingView calendar${cur.USD?.next?.verified ? ', federalreserve.gov' : ''} · ${builtAt(fx)} · times Calgary`));
  return { cmd: 'fund', text: fit(lines), buttons };
}
