// /holders SYM and the [👥 Holders] button (callback h:SYM): who owns a stock, from SEC EDGAR only. Files of tools/holders/holders.py
// (public/holders/index.json + public/holders/t/<first letter>.json on the data branch, daily) and the 30-day events of
// tools/insiders/insiders.py (public/insiders/latest.json, every 10 min on US weekdays), loaded through ctx.load:
//   5%+ holders      the latest Schedule 13D / 13G of each filer, % of the class, shares, the change vs their previous filing
//   insiders         shares after each person's last Form 4 as % of shares outstanding, with the last move
//   top funds        the 13F data set's top 10 institutions with % of shares outstanding and the change vs the quarter before;
//                    index funds (Vanguard, BlackRock, State Street ...) marked 'index'. A 13F is filed up to 45 days after the
//                    quarter end: the card says which quarter it is
//   last 30 days     insider buys (cluster / early), big sales, Form 144 planned sales, 13D filings of the stock
// Market data from public filings: guests may use it (nothing of the owner's). Context only, never a signal. Pure: data through
// ctx.load (vitest: src/core/telegramHolders.test.ts).

import { clock, day, echo, esc, fit, resolve, type Button, type Ctx, type Reply } from './logic.ts';
import { eventLines, INSIDERS_PATH, mday } from './insiders.ts';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): J[] => (Array.isArray(v) ? v.filter(x => x && typeof x === 'object') : []);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const APP = 'https://raman-fx.vercel.app';
const FOOT = 'SEC filings (13D/G, Form 4, 13F) · context, not a signal · not advice';
const EVENT_DAYS = 30;

export const holdersButton = (sym: string): Button => ({ text: '👥 Holders', callback_data: `h:${sym}` });
/** The shard file of a symbol: its first letter, '_' for anything else (tools/holders/holders.py shard_of, src/core/holders.ts). */
export const shardOf = (sym: string): string => { const c = (sym ?? '').slice(0, 1).toUpperCase(); return c >= 'A' && c <= 'Z' ? c : '_'; };
export const holdersPath = (sym: string) => `holders/t/${shardOf(sym)}.json`;

/** '2.2B', '861M', '24.8M', '480K', '950' (shares). */
export function qty(v: unknown): string {
  const x = num(v);
  if (x == null) return 'n/a';
  const a = Math.abs(x);
  return `${x < 0 ? '-' : ''}${a >= 1e9 ? `${(a / 1e9).toFixed(1)}B` : a >= 1e6 ? `${(a / 1e6).toFixed(a >= 1e8 ? 0 : 1)}M` : a >= 1e3 ? `${(a / 1e3).toFixed(0)}K` : a.toFixed(0)}`;
}
/** '9.1%', '0.42%', '<0.01%'. */
export function pct(v: unknown): string {
  const x = num(v);
  if (x == null) return '';
  return Math.abs(x) < 0.01 ? '<0.01%' : Math.abs(x) < 1 ? `${x.toFixed(2)}%` : `${x.toFixed(1)}%`;
}
/** 'Feb '24' from 'YYYY-MM-DD'. */
const monYr = (s: unknown): string => { const m = mday(s); const y = /^(\d{4})/.exec(String(s ?? '')); return m && y ? `${m.split(' ')[0]} '${y[1].slice(2)}` : ''; };
const when = (iso: unknown): Date | null => { const t = Date.parse(String(iso ?? '')); return Number.isFinite(t) ? new Date(t) : null; };
const MOVE: Record<string, string> = { S: 'sold', P: 'bought', A: 'awarded', M: 'exercised', F: 'tax-withheld', G: 'gifted', D: 'disposed', C: 'converted', X: 'exercised' };

function holder5(r: J): string {
  const c = obj(r.chg);
  const chg = num(c.pct) != null && Math.abs(c.pct) >= 0.005
    ? ` · ${c.pct > 0 ? '+' : '-'}${Math.abs(c.pct).toFixed(2)} pt since ${monYr(c.prev) || 'its last filing'}`
    : c.prev ? ` · unchanged since ${monYr(c.prev)}` : '';
  return `• ${esc(r.f)}${r.idx ? ' <i>(index)</i>' : ''} <b>${pct(r.pct)}</b> · ${qty(r.sh)} sh · ${esc(r.form)} ${esc(mday(r.d))}${esc(chg)}`;
}
function insiderLine(r: J): string {
  const code = String(r.code ?? ''), mv = num(r.mv);
  const last = mv && MOVE[code] ? ` · last: ${MOVE[code]} ${qty(Math.abs(mv))}${num(r.px) != null ? ` @ $${(r.px as number).toFixed(2)}` : ''} ${mday(r.d)}` : r.d ? ` · last Form 4 ${mday(r.d)}` : '';
  const own = num(r.pct) != null ? `<b>${pct(r.pct)}</b> · ` : '';
  return `• ${esc(r.w)} <i>(${esc(String(r.role ?? '').slice(0, 30))})</i> ${own}${qty(r.own)} sh${esc(last)}`;
}
function fundLine(r: J): string {
  const sh = num(r.sh) ?? 0, d = num(r.dsh) ?? 0, prev = sh - d;
  const ch = r.ch === 'new' ? 'new' : r.ch === 'same' ? 'unchanged' : prev > 0 ? `${r.ch === 'add' ? 'added' : 'cut'} ${d > 0 ? '+' : '-'}${Math.abs(d / prev * 100).toFixed(1)}%` : String(r.ch ?? '');
  const share = num(r.pct) != null ? `<b>${pct(r.pct)}</b> · ` : '';
  return `• ${esc(r.f)}${r.idx ? ' <i>(index)</i>' : ''} ${share}${qty(r.sh)} sh · ${esc(ch)}`;
}

async function loadFile(ctx: Ctx, path: string): Promise<J> { try { return obj(await ctx.load(path)); } catch { return {}; } }

/** /holders [SYM] and the 👥 Holders button. */
export async function cmdHolders(q: string, ctx: Ctx): Promise<Reply> {
  if (!q) return { cmd: 'holders', text: 'Send a stock after it, e.g. <b>/holders NVDA</b>: its 5%+ holders, insiders and top funds. Just the symbol works for its zones; the 👥 Holders button is under it.' };
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'holders', text: `👥 <b>${echo(q.toUpperCase())}</b> not found` + (suggest.length ? `\nDid you mean: ${suggest.map(s => `/holders ${esc(s)}`).join(' · ')}` : '\nSend a stock ticker (NVDA, BRK.B).') };
  const sym = hit.sym;
  if (hit.market !== 'stock') return { cmd: 'holders', text: `👥 <b>${esc(sym)}</b>\nHolders are published for stocks only (5%+ holders, insiders and 13F funds come from SEC filings). Try <b>/holders NVDA</b>.` };
  const [idx, shard, ins] = await Promise.all([loadFile(ctx, 'holders/index.json'), loadFile(ctx, holdersPath(sym)), loadFile(ctx, INSIDERS_PATH)]);
  const rec = obj(obj(shard.stocks)[sym]);
  const buttons: Button[][] = [[{ text: `📊 Chart ${sym}`, callback_data: `c:${sym}` }, { text: `🔎 Zones ${sym}`, callback_data: `z:${sym}` }, { text: '📑 Fundamentals', callback_data: `f:${sym}` }]];
  buttons.push([{ text: 'Open stock page', url: `${APP}/scanner/${encodeURIComponent(sym.replace(/\./g, '-'))}` }]);
  if (!Object.keys(rec).length) {
    return { cmd: 'holders', text: `👥 <b>${esc(sym)}</b> · holders\nNot published yet: the SEC holders job (daily, weekdays) fills it in for every scanner stock. Try again later.`, buttons };
  }
  const f13 = obj(rec.f13), meta = obj(idx.f13);
  const lines = [`👥 <b>${esc(sym)}</b> · holders${rec.n ? ` · ${esc(rec.n)}` : ''}`];
  const head = [num(rec.so) != null ? `${qty(rec.so)} shares out${rec.so_end ? ` (${mday(rec.so_end)})` : ''}` : ''].filter(Boolean);
  if (head.length) lines.push(esc(head.join(' · ')));

  const h5 = arr(rec.h5);
  lines.push('', '<b>5%+ holders</b> <i>(Schedule 13D / 13G)</i>');
  if (h5.length) lines.push(...h5.slice(0, 6).map(holder5));
  else lines.push('none on file in the last 3 years');
  const h5x = arr(rec.h5x);
  if (h5x.length) lines.push(`<i>fell below 5%: ${h5x.map(r => `${esc(r.f)} ${pct(r.pct)} (${esc(mday(r.d))})`).join(', ')}</i>`);

  const people = arr(rec.ins);
  lines.push('', `<b>Insiders &amp; 10% owners</b> <i>(Form 4, last ${num(idx.f4_days) ?? 180} days)</i>`);
  if (people.length) lines.push(...people.slice(0, 5).map(insiderLine));
  else lines.push('no Form 4 on file in that window');

  const top = arr(f13.top);
  const q13 = str(meta.q), q13d = q13 ? mday(q13) : '';
  lines.push('', `<b>Top funds</b> <i>(13F${q13d ? `, ${esc(q13d)}` : ''}${num(f13.tot_pct) != null ? ` · all 13F filers hold ${pct(f13.tot_pct)}` : ''})</i>`);
  if (top.length) {
    lines.push(...top.slice(0, 7).map(fundLine));
    const ex = arr(f13.ex);
    if (ex.length) lines.push(`<i>exited: ${ex.map(r => esc(r.f)).join(', ')}</i>`);
  } else lines.push('no 13F data for it yet');
  if (q13d) lines.push(`<i>13F is filed up to ${num(meta.lag_days) ?? 45} days after the quarter end (${esc(q13d)}): newer buying or selling is not in it.</i>`);

  const ev = eventLines(ins, sym, ctx.now);
  lines.push('', `<b>Last ${EVENT_DAYS} days</b>`);
  if (ev.length) lines.push(...ev);
  else lines.push('no insider buy / sale, Form 144 or 13D on file');

  const t = when(idx.generated);
  lines.push('', `<i>${FOOT}</i>${t ? ` · ${esc(`updated ${day(t)} · ${clock(t)}`)}` : ''}`);
  return { cmd: 'holders', text: fit(lines), buttons };
}
