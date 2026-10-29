// /news from Telegram: today's and tomorrow morning's economic events on the Calgary clock, grouped by time, from the
// TradingView economic calendar JSON ({ result: [{ title, country, importance (1 high, 0 medium, -1 low), date }] },
// fetched by index.ts as 'news.json' = yesterday .. +2 days) plus the verified NFP / CPI / FOMC dates of
// tools/reminders/events.json. Pure: the caller passes the loaded JSON, the parsed key events and the time.

import { clock, day, esc, fit, isoDay, parts, resolve, symButtons, CAL, type Button, type Ctx, type Reply } from './logic.ts';
import { latestLine, SOURCES, symbolLines, topLines } from './headlines.ts';

export const FLAG: Record<string, string> = { US: '🇺🇸', EU: '🇪🇺', GB: '🇬🇧', JP: '🇯🇵', AU: '🇦🇺', NZ: '🇳🇿', CA: '🇨🇦', CH: '🇨🇭', CN: '🇨🇳', DE: '🇩🇪', FR: '🇫🇷', IT: '🇮🇹' };
export interface NewsRow { t: Date; c: string; title: string; high: boolean }
export interface KeyEvent { name: string; t: Date; verified: boolean }

const MORNING_END_H = 12;      // "tomorrow morning" = until noon Calgary
const FEW = 4;                 // fewer high-impact events than this in the window -> add medium ones
const MAX_PER_TIME = 4;
const PASSED_MIN = 15;

/** Calendar JSON -> rows in [Calgary today 00:00, tomorrow noon), high (and medium when high ones are few), sorted. null = no calendar. */
export function newsRows(js: unknown, now: Date): NewsRow[] | null {
  const res = (js as { result?: unknown } | null)?.result;
  if (!Array.isArray(res)) return null;
  const today = isoDay(now), tmr = new Date(Date.parse(`${today}T12:00:00Z`) + 86400000).toISOString().slice(0, 10);
  const inWindow = (t: Date) => { const d = isoDay(t); return d === today || (d === tmr && parts(t, CAL).h < MORNING_END_H); };
  const rows: NewsRow[] = [];
  for (const r of res as Record<string, unknown>[]) {
    const imp = Number(r?.importance);
    if (!(imp >= 0) || typeof r?.date !== 'string') continue;
    const t = new Date(r.date);
    const title = String(r.title ?? '').replace(/\s+/g, ' ').trim();
    if (!Number.isFinite(t.getTime()) || !title || !inWindow(t)) continue;
    rows.push({ t, c: String(r.country ?? '').toUpperCase().slice(0, 3), title, high: imp >= 1 });
  }
  const high = rows.filter(r => r.high);
  const out = high.length >= FEW ? high : rows;
  // the same release can be listed twice (e.g. EU + DE); keep one per time + country + title
  const seen = new Set<string>();
  return out.sort((a, b) => a.t.getTime() - b.t.getTime() || Number(b.high) - Number(a.high))
    .filter(r => { const k = `${r.t.getTime()}|${r.c}|${r.title.toLowerCase()}`; if (seen.has(k)) return false; seen.add(k); return true; });
}

const item = (r: NewsRow) => `${FLAG[r.c] ? `${FLAG[r.c]} ` : ''}${esc(r.c)} ${esc(r.title)}${r.high ? '' : ' (medium)'}`;

/** One line per Calgary time: '7:30 AM · 🇺🇸 US CPI · 🇺🇸 US Core CPI'; passed times struck through. */
export function groupLines(rows: NewsRow[], now: Date): string[] {
  const by = new Map<number, NewsRow[]>();
  for (const r of rows) { const k = r.t.getTime(); by.set(k, [...(by.get(k) ?? []), r]); }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([k, rs]) => {
    const past = k < now.getTime() - PASSED_MIN * 60000;
    const shown = rs.slice(0, MAX_PER_TIME).map(item).join(' · ') + (rs.length > MAX_PER_TIME ? ` · +${rs.length - MAX_PER_TIME} more` : '');
    const line = `<b>${clock(new Date(k))}</b> · ${shown}`;
    return past ? `<s>${line}</s>` : line;
  });
}

/** The full /news text (lines; the caller fits them under 4096). */
export function newsText(js: unknown, key: KeyEvent[], now: Date, foot = 'not advice'): string[] {
  const rows = newsRows(js, now);
  const today = isoDay(now);
  const lines = [`📰 <b>Economic news · ${esc(day(now))}</b> (Calgary time)`];
  const keyNow = key.filter(e => isoDay(e.t) === today || (e.t.getTime() > now.getTime() && e.t.getTime() - now.getTime() < 36 * 3600000))
    .sort((a, b) => a.t.getTime() - b.t.getTime());
  for (const e of keyNow) {
    const when = isoDay(e.t) === today ? 'today' : esc(day(e.t));
    lines.push(`⏰ <b>${esc(e.name)} ${when} · ${clock(e.t)}</b>${e.verified ? '' : ' (date not verified)'}`);
  }
  if (rows == null) {
    lines.push('', '⚠️ <b>Calendar unavailable</b>', 'The economic calendar did not load. Try again in a few minutes (/next has the big US dates).', '', foot);
    return lines;
  }
  const todayRows = rows.filter(r => isoDay(r.t) === today), tmrRows = rows.filter(r => isoDay(r.t) !== today);
  const medium = rows.some(r => !r.high);
  lines.push('', `<b>Today</b>${medium ? ' · high + medium impact' : ' · high impact'}`);
  lines.push(...(todayRows.length ? groupLines(todayRows, now) : ['No high-impact events on the calendar today.']));
  if (tmrRows.length) lines.push('', `<b>Tomorrow morning · ${esc(day(tmrRows[0].t))}</b>`, ...groupLines(tmrRows, now));
  lines.push('', `Price often jumps around these times; spreads widen. Source: TradingView calendar · ${foot}`);
  return lines;
}

// ---- headlines (headlines.ts: Alpaca News + RSS; loaded by index.ts as 'headlines/top' and 'headlines/sym/<SYM>') ----
const HEADLINE_WAIT_MS = 5000;    // a slow feed never holds a reply longer than this
/** ctx.load(path) for headlines, null after HEADLINE_WAIT_MS or on any error. */
export function loadHeadlines(ctx: Ctx, path: string, waitMs = HEADLINE_WAIT_MS): Promise<unknown> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const late = new Promise<null>(r => { timer = setTimeout(() => r(null), waitMs); });
  return Promise.race([ctx.load(path).catch(() => null), late]).finally(() => clearTimeout(timer));
}
/** The calendar lines with the '📰 Top headlines' block after the key events (before the 'Today' section). */
export function withTopHeadlines(lines: string[], list: unknown, now: Date): string[] {
  const top = topLines(list, now.getTime());
  if (!top.length) return lines;
  const at = lines.findIndex((l, i) => i > 0 && l === '');
  const i = at < 0 ? lines.length : at;
  return [...lines.slice(0, i), '', ...top, ...lines.slice(i)];
}
/** [📰 News] under symbol / chart replies (callback 'n:SYM'). */
export function newsButton(sym: string): Button[] {
  const d = `n:${sym}`;
  return new TextEncoder().encode(d).length <= 64 ? [{ text: '📰 News', callback_data: d }] : [];
}
/** /news SYM and the [📰 News] button: the symbol's last ~6 headlines. */
export async function symbolNews(q: string, ctx: Ctx, foot = 'not advice'): Promise<Reply> {
  const { hit, suggest } = await resolve(q, ctx);
  const sym = hit?.sym ?? (/^[A-Za-z][A-Za-z0-9.]{0,9}$/.test(q) && !suggest.length ? q.toUpperCase() : '');
  if (!sym) return { cmd: 'news', text: `Not sure which symbol <b>${esc(q)}</b> is.${suggest.length ? ` Did you mean ${suggest.map(s => `/news ${esc(s)}`).join(', ')}?` : ''}` };
  const list = await loadHeadlines(ctx, `headlines/sym/${sym}`);
  const lines = symbolLines(sym, list, ctx.now.getTime());
  lines.push('', `Times: Calgary clock · ${SOURCES} · ${foot}`);
  return { cmd: 'news', text: fit(lines), buttons: hit ? symButtons([hit.sym], 1) : undefined };
}
/** A symbol / chart reply plus one '📰 latest: ...' line (a headline from the last 24 h), fetched alongside the reply.
 *  Text replies: before the closing footer block; photo captions: before the last line (caption <= 1024). */
export async function withLatest(sym: string, ctx: Ctx, reply: Promise<Reply>): Promise<Reply> {
  const [r, list] = await Promise.all([reply, loadHeadlines(ctx, `headlines/sym/${sym}`, 3500)]);
  const line = latestLine(sym, list, ctx.now.getTime());
  if (!line || r.text.includes('📰 latest:')) return r;
  const lines = r.text.split('\n');
  if (r.photo) {
    if (r.text.length + line.length + 1 > 1024) return r;
    lines.splice(Math.max(1, lines.length - 1), 0, line);
    return { ...r, text: lines.join('\n') };
  }
  const blank = lines.lastIndexOf('');
  lines.splice(blank > 0 ? blank : lines.length, 0, ...(blank > 0 ? ['', line] : [line]));
  return { ...r, text: lines.join('\n').replace(/\n{3,}/g, '\n\n') };
}
