// Insider buys (SEC EDGAR Form 4, tools/insiders/insiders.py -> public/insiders/latest.json, every 30 min on US
// weekdays): /insiders (the latest clusters, ⭐ first), /insiders SYM (that stock's 30-day buys / sells summary) and
// the one-line '🕵️ insiders bought $X in last 30d' under /fund and the stock zones / chart replies. Guests allowed.
// Context only, never a signal. Pure: data through ctx.load (vitest: src/core/telegramInsiders.test.ts).

import { clock, day, esc, fit, resolve, type Button, type Ctx, type Reply } from './logic.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): J[] => (Array.isArray(v) ? v.filter(x => x && typeof x === 'object') : []);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
export const INSIDERS_PATH = 'insiders/latest.json';
const APP = 'https://raman-fx.vercel.app';
const FOOT = 'SEC Form 4 open-market buys · context, not a signal · not advice';
/** Published data older than this is not quoted under /fund and the zone / chart replies (a stalled job). */
const STALE_MS = 4 * 86400_000;
const LIST_N = 8;

/** '$2.1M', '$450K', '$1.2B'. */
export function usd(v: unknown): string {
  const x = num(v);
  if (x == null) return 'n/a';
  const a = Math.abs(x);
  const s = a >= 1e9 ? `${(a / 1e9).toFixed(1)}B` : a >= 1e6 ? `${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `${(a / 1e3).toFixed(0)}K` : a.toFixed(0);
  return `${x < 0 ? '-' : ''}$${s}`;
}
const price = (v: unknown) => (num(v) == null ? '' : `$${(v as number).toFixed(2)}`);
/** 'Oct 28' from 'YYYY-MM-DD'. */
export function mday(s: unknown): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? ''));
  if (!m) return '';
  return `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+m[2] - 1]} ${+m[3]}`;
}
const secUrl = (u: unknown) => (typeof u === 'string' && /^https:\/\/www\.sec\.gov\//.test(u) ? u : '');
const range = (lo: number, hi: number) => (hi < 100 ? `${lo.toFixed(2)}–${hi.toFixed(2)}` : `${lo.toFixed(0)}–${hi.toFixed(0)}`);

export function zoneText(z: J | null | undefined, star = false): string {
  const lo = num(z?.lo), hi = num(z?.hi);
  if (!z || lo == null || hi == null) return '';
  const t = z.where === 'inside' ? `inside ${z.tf} demand ${range(lo, hi)}` : `${(num(z.dist) ?? 0).toFixed(1)}% above ${z.tf} demand ${range(lo, hi)}`;
  return `${star ? '⭐ ' : ''}${t}`;
}
function holdings(l: J): string {
  if (l.new) return 'new position';
  const p = num(l.pct);
  return p != null && p >= 0.5 ? `+${p.toFixed(0)}% holdings` : '';
}

/** One cluster, one line: '⭐ XYZ $12.40 · 3 insiders · $2.1M · CEO +18% holdings · inside W1 demand 11.90–12.60'. */
export function clusterLine(c: J): string {
  const bits = [`${c.star ? '⭐' : '🕵️'} <b>${esc(c.sym || c.name)}</b> ${price(c.px ?? c.price)}`.trim(),
    c.kind === 'solo' ? 'big solo buy' : `${num(c.n) ?? 0} insiders`, usd(c.value)];
  const l = obj(c.lead);
  const who = `${l.role ?? ''} ${holdings(l)}`.trim();
  if (who) bits.push(esc(who));
  const z = zoneText(c.zone);
  if (z) bits.push(esc(z));
  const span = c.first && c.first !== c.last ? `${mday(c.first)}–${mday(c.last)}` : mday(c.last);
  if (span) bits.push(span);
  return bits.join(' · ');
}

async function file(ctx: Ctx): Promise<J | null> {
  try {
    const f = obj(await ctx.load(INSIDERS_PATH));
    return Array.isArray(f.clusters) ? f : null;
  } catch { return null; }
}
/** Not stale, and not written after the clock (a clock behind the data = an old replay: nothing quoted). */
const fresh = (f: J, now: Date) => { const t = Date.parse(String(f.generated ?? '')); const age = now.getTime() - t; return Number.isFinite(t) && age <= STALE_MS && age >= -3600_000; };
const updated = (f: J) => { const t = Date.parse(String(f.generated ?? '')); return Number.isFinite(t) ? `updated ${day(new Date(t))} · ${clock(new Date(t))}` : ''; };

function symKey(f: J, q: string): string | null {
  const by = obj(f.by_sym), u = q.toUpperCase();
  for (const k of [u, u.replace(/-/g, '.'), u.replace(/\./g, '-'), u.replace(/[.-]/g, '')]) if (by[k] || arr(f.clusters).some(c => c.sym === k)) return k;
  return null;
}

/** '🕵️ insiders bought $2.1M in last 30d (3 insiders · ⭐ cluster)' for a symbol, '' when none (or stale data). */
export async function insiderLine(sym: string, ctx: Ctx): Promise<string> {
  const f = await file(ctx);
  if (!f || !fresh(f, ctx.now)) return '';
  const k = symKey(f, sym);
  const e = k ? obj(obj(f.by_sym)[k]) : {};
  if (!k || !num(e.buy_value)) return '';
  const c = arr(f.clusters).find(x => x.sym === k);
  const tag = c ? (c.star ? ' · ⭐ cluster' : c.kind === 'solo' ? ' · big CEO/CFO buy' : ' · cluster') : '';
  return `🕵️ insiders bought ${usd(e.buy_value)} in last 30d (${num(e.buyers) ?? 1} insider${num(e.buyers) === 1 ? '' : 's'}${tag}) · /insiders ${esc(k)}`;
}

/** Adds the insider line to a zones / chart / fund reply of a stock (before the footer; photo captions <= 1024). */
export async function withInsiders(sym: string, ctx: Ctx, reply: Promise<Reply>): Promise<Reply> {
  const [r, line] = await Promise.all([reply, insiderLine(sym, ctx).catch(() => '')]);
  if (!line || r.text.includes('🕵️ insiders bought')) return r;
  const lines = r.text.split('\n');
  if (r.photo) {
    if (r.text.length + line.length + 1 > 1024) return r;
    lines.splice(Math.max(1, lines.length - 1), 0, line);
    return { ...r, text: lines.join('\n') };
  }
  const blank = lines.lastIndexOf('');
  lines.splice(blank > 0 ? blank : lines.length, 0, line);
  return { ...r, text: lines.join('\n') };
}

function listReply(f: J): Reply {
  const cs = arr(f.clusters);
  const lines = [`🕵️ <b>Insider cluster buys · last ${num(f.days) ?? 30} days</b>`];
  if (!cs.length) {
    lines.push('', 'None in the data yet: 2+ insiders buying the same stock within 14 days, or a CEO / CFO buy of $250k+.');
  } else {
    const stars = cs.filter(c => c.star).length;
    lines.push(`${cs.length} found${stars ? ` · ${stars} ⭐ (3+ insiders at weekly / monthly demand)` : ''}`, '');
    for (const c of cs.slice(0, LIST_N)) lines.push(clusterLine(c));
    if (cs.length > LIST_N) lines.push(`+${cs.length - LIST_N} more in the app`);
  }
  lines.push('', 'Send <b>/insiders NVDA</b> for one stock.', `<i>${FOOT}</i>${updated(f) ? ` · ${esc(updated(f))}` : ''}`);
  const syms = cs.filter(c => c.universe).slice(0, 4).map(c => String(c.sym));
  const buttons: Button[][] = [];
  if (syms.length) buttons.push(syms.map(s => ({ text: `📊 ${s}`, callback_data: `c:${s}` })));
  buttons.push([{ text: 'Open insiders', url: `${APP}/insiders` }]);
  return { cmd: 'insiders', text: fit(lines), buttons };
}

function rowLine(r: J): string {
  const what = r.code === 'P' ? 'bought' : 'sold';
  const p = num(r.pct);
  const h = r.code === 'P' && p != null && p >= 0.5 ? ` · +${p.toFixed(0)}% holdings` : r.code === 'S' && p != null && p <= -0.5 ? ` · ${p.toFixed(0)}% holdings` : '';
  return `${r.code === 'P' ? '🟢' : '🔴'} ${mday(r.d)} · ${esc(r.who)} (${esc(r.role)}) ${what} ${usd(r.value)}${num(r.price) != null ? ` @ ${price(r.price)}` : ''}${h}${r.plan ? ' · 10b5-1 plan' : ''}`;
}

async function symReply(f: J, q: string, ctx: Ctx): Promise<Reply> {
  let k = symKey(f, q);
  if (!k) {
    const { hit } = await resolve(q, ctx).catch(() => ({ hit: null }));
    if (hit && hit.market === 'stock') k = symKey(f, hit.sym) ?? null;
    if (!k) {
      const name = hit?.sym ?? q.toUpperCase();
      const scan = hit?.market === 'stock' ? ' (buys and sells are tracked for every scanner stock)' : '';
      return { cmd: 'insiders', text: `🕵️ <b>${esc(name)}</b>\nNo insider open-market buys or sells on SEC Form 4 in the last ${num(f.days) ?? 30} days${esc(scan)}.\n/insiders lists the latest clusters.` };
    }
  }
  const e = obj(obj(f.by_sym)[k]);
  const c = arr(f.clusters).find(x => x.sym === k);
  const lines = [`🕵️ <b>${esc(k)}</b> · insiders · last ${num(f.days) ?? 30} days`, ''];
  if (c) {
    lines.push(`${c.star ? '⭐ ' : ''}<b>${c.kind === 'solo' ? 'Big solo buy' : `${c.strong ? 'Strong cluster' : 'Cluster'} · ${num(c.n)} insiders`}</b> · ${usd(c.value)} · score ${esc(String(c.score ?? ''))}`);
    const z = zoneText(c.zone, false);
    const ctxBits = [z, c.trend ? `trend ${c.trend}` : '', c.signal ? `scanner ${c.signal}` : '', num(c.pe) != null && c.pe > 0 ? `P/E ${(c.pe as number).toFixed(0)}` : '', c.er_next ? `earnings ${mday(c.er_next)}` : ''].filter(Boolean);
    if (ctxBits.length) lines.push(esc(ctxBits.join(' · ')));
    lines.push('');
  }
  if (num(e.buys)) lines.push(`Bought: <b>${usd(e.buy_value)}</b> · ${num(e.buyers)} insider${e.buyers === 1 ? '' : 's'} · ${num(e.buys)} filing${e.buys === 1 ? '' : 's'} (last ${mday(e.last_buy)})`);
  else lines.push('Bought: none ($10k+ open-market buys)');
  if (num(e.sells)) lines.push(`Sold: <b>${usd(e.sell_value)}</b> · ${num(e.sellers)} insider${e.sellers === 1 ? '' : 's'} · ${num(e.sells)} filing${e.sells === 1 ? '' : 's'} (last ${mday(e.last_sell)})`);
  else lines.push(e.universe ? 'Sold: none (open-market sales)' : 'Sold: tracked for scanner stocks only');
  const rows = arr(e.rows).length ? arr(e.rows) : arr(c?.insiders).map(i => ({ d: i.date, who: i.name, role: String(i.role ?? '').split(' · ')[0], code: 'P', value: i.value, price: i.price, pct: i.pct, url: i.url }));
  if (rows.length) lines.push('', ...rows.slice(0, 6).map(rowLine));
  lines.push('', `<i>SEC Form 4 · context, not a signal · not advice</i>${updated(f) ? ` · ${esc(updated(f))}` : ''}`);
  const buttons: Button[][] = [];
  if (e.universe || c?.universe) buttons.push([{ text: `📊 Chart ${k}`, callback_data: `c:${k}` }, { text: '📑 Fundamentals', callback_data: `f:${k}` }]);
  const u = secUrl(rows[0]?.url) || secUrl(c?.url);
  if (u) buttons.push([{ text: '🔗 SEC filing', url: u }]);
  return { cmd: 'insiders', text: fit(lines), buttons };
}

/** /insiders [SYM]. */
export async function cmdInsiders(q: string, ctx: Ctx): Promise<Reply> {
  const f = await file(ctx);
  if (!f) return { cmd: 'insiders', text: '🕵️ <b>Insider buys</b>\nNot published yet: the SEC Form 4 job fills it every 30 min on US weekdays. Try again later.' };
  return q ? symReply(f, q, ctx) : listReply(f);
}
