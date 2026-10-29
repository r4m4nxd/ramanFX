// Breaking-news alerts (run on the coach's 10-minute tick, index.ts): ONE calm message when Alpaca News (Benzinga)
// tags a fresh article with a symbol the owner watches (the bot's /watch list, rfx_bot_watch) or holds (journal open
// positions). Calm rules:
//   - only articles Alpaca marks for that symbol (its `symbols` list, at most 3 tickers: no round-ups), published in
//     the last 30 min, not noise (price targets, options activity, 'stocks moving' lists...);
//   - stocks, ETFs and crypto (BTCUSD...) directly; metals / US indices / oil through their ETF tag (XAUUSD -> GLD,
//     US500 -> SPY, SPOTCRUDE -> USO); plain FX pairs have no Alpaca tag, so they get no breaking alert (their news is
//     in /news SYM, the hourly big moves and the morning brief);
//   - max 1 per symbol per 3 h, max 6 a Calgary day; muted symbols skipped; nothing during quiet hours (overnight news
//     lands in the 6 AM brief's '📰 overnight headlines' instead).
// Dedupe + limits use rfx_coach_events (kind 'news', key 'news:<SYM>:<article id>').
import { ago, calClock, linked, NOISE, symMap, type Headline } from '../telegram-bot/headlines.ts';
import type { Prefs } from '../telegram-bot/prefs.ts';

export const PER_SYM_H = 3, PER_DAY = 6, FRESH_MIN = 30, MAX_TAGS = 3;
const TZ = 'America/Edmonton';
const esc = (x: unknown) => String(x ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const hm = (s: string | undefined) => { const m = /^(\d{2}):(\d{2})$/.exec(s ?? ''); return m ? +m[1] * 60 + +m[2] : null; };
function localMin(now: number, tz: string): number {
  const p = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(now));
  const g = (t: string) => Number(p.find(x => x.type === t)?.value ?? 0);
  return g('hour') * 60 + g('minute');
}
/** Inside the quiet window (from > to wraps past midnight; from == to: never). Same rule as tools/stock_scanner/prefs.py. */
export function inQuiet(q: Prefs['quiet'], now: number): boolean {
  const a = hm(q?.from), b = hm(q?.to);
  if (a == null || b == null || a === b) return false;
  const m = localMin(now, q?.tz || TZ);
  return a < b ? a <= m && m < b : m >= a || m < b;
}
/** Calgary day 'YYYY-MM-DD' of a time. */
export const calDay = (t: number) => new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(t));

/** The owner's symbols that can get a breaking alert -> their Alpaca tags (muted ones left out). */
export function watchedTags(watch: string[], open: string[], prefs: Pick<Prefs, 'mutes'>, now: number): Map<string, string> {
  const muted = new Set(prefs.mutes.filter(m => !(Date.parse(m.until_utc) <= now)).map(m => m.sym.toUpperCase()));
  const out = new Map<string, string>();   // tag -> symbol
  for (const s of [...open, ...watch].map(x => x.toUpperCase())) {
    if (muted.has(s)) continue;
    for (const t of symMap(s).tags) if (!out.has(t)) out.set(t, s);
  }
  return out;
}
export interface Sent { sym: string; at: number }
export interface BreakingPick { sym: string; h: Headline; key: string }
/** Which articles to send now: tagged, fresh, not noise, within the per-symbol and daily limits (oldest-first fair). */
export function pickBreaking(items: Headline[], tags: Map<string, string>, sent: Sent[], now: number, quiet: boolean): BreakingPick[] {
  if (quiet || !tags.size) return [];
  const today = calDay(now);
  let left = PER_DAY - sent.filter(s => calDay(s.at) === today).length;
  const last = new Map<string, number>();
  for (const s of sent) last.set(s.sym, Math.max(last.get(s.sym) ?? 0, s.at));
  const out: BreakingPick[] = [];
  const fresh = items.filter(h => now - h.t <= FRESH_MIN * 60_000 && h.t <= now + 5 * 60_000 && h.syms.length >= 1 && h.syms.length <= MAX_TAGS && !NOISE.test(h.title))
    .sort((a, b) => b.t - a.t);
  for (const h of fresh) {
    if (left <= 0) break;
    const tag = h.syms.find(s => tags.has(s));
    if (!tag) continue;
    const sym = tags.get(tag)!;
    if (now - (last.get(sym) ?? 0) < PER_SYM_H * 3600_000) continue;
    last.set(sym, now);
    left--;
    out.push({ sym, h, key: `news:${sym}:${h.id.replace(/^alpaca:/, '').slice(0, 40)}` });
  }
  return out;
}
export function breakingText(p: BreakingPick, now: number, why: 'watch' | 'open'): string {
  const lines = [`📰 <b>${esc(p.sym)} · breaking</b>`, linked(p.h, 180), `<i>${esc(ago(p.h.t, now))} · ${esc(calClock(p.h.t))} · ${esc(p.h.source)}</i>`];
  if (p.h.summary) lines.push(esc(p.h.summary));
  lines.push('', `${why === 'open' ? 'you hold it' : 'on your watch list'} · max 1 per symbol per 3 h · not advice`);
  return lines.join('\n');
}
export const breakingMarkup = (sym: string) => ({ inline_keyboard: [[{ text: `📰 More ${sym}`, callback_data: `n:${sym}` }, { text: `📊 Chart ${sym}`, callback_data: `c:${sym}` }]] });
