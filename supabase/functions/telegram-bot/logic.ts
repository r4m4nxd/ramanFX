// RamanFX Telegram bot: commands -> reply text. Pure (no Deno, no network): the edge function (index.ts) and the
// vitest suite (src/core/telegramBot.test.ts) both import it. Data comes through ctx.load(path), path relative to the
// published site ('fx/latest.json', 'fx/d/<k>.json', 'scanner/latest.json', 'scanner/index.json', 'scanner/t/<k>.json',
// 'research/market_hours_by_symbol.json') plus 'events.json' (tools/reminders/events.json); null = missing / bad.
// Layout = the scanners' calm Telegram style: a bold heading, short lines, a timeframe per symbol (MN W1 D1 4H 1H),
// distances in percent (never pips), Calgary 12-hour times (America/Edmonton zone rules), HTML escaped, < 4096 chars.

import { bestQuote, buildIndex, lessonPath, mentorOf, search as askSearch, type AskIndex } from './ask.ts';
import { newsButton, newsText, symbolNews, withLatest, withTopHeadlines, loadHeadlines } from './news.ts';
import { MAX_ALERTS, MAX_WATCH, parseDuration, parsePrice, parseQuiet, parseTap, type Alert, type Prefs, type PrefsStore } from './prefs.ts';
import { aggregate, monthKey, quarterKey, tfLabel, weekKey, type Band, type Bar, type ChartModel, type Panel, type TLine } from './chart.ts';
import { fxZonesOf, nextBusinessDay, stockZonesOf, tfZonesOf, type LiveZone, type ZBar } from './zonecore.ts';
import { panelTrendlines, type PubLine, type TlSeries } from './trendcore.ts';
import type { LiveFx, LiveSource, LiveStock } from './live.ts';
import { cmdFund, earningsLine, fundButton } from './fundamentals.ts';

export type Button = { text: string; url: string } | { text: string; callback_data: string };
export interface Reply {
  text: string; cmd: string;
  buttons?: Button[][];   // inline keyboard
  keyboard?: boolean;     // attach the persistent quick-reply keyboard instead (MAIN_KEYBOARD)
  photo?: string;         // send a photo (URL) with `text` as its caption
  edit?: boolean;         // a chart view switch / list refresh: edit the tapped message when there is one
  toast?: string;         // short answerCallbackQuery text (only when the optional TELEGRAM_BOT_TOKEN secret is set)
}
export interface Ctx {
  load(path: string): Promise<unknown>;
  now: Date;
  /** Starts the FX + stock scans (GitHub workflow_dispatch); undefined = no GITHUB_DISPATCH_TOKEN. */
  dispatch?: () => Promise<boolean>;
  /** Public PNG URL of a chart view ('Q' = 4 timeframes, or a TF) for a scan version; undefined = no charts. */
  imageUrl?: (sym: string, view: string, v: string) => string;
  /** Owner preferences (alerts, mutes, quiet hours, watchlist); undefined = no database. */
  prefs?: PrefsStore;
  /** Live candles at request time (live.ts): fx with OANDA_API_TOKEN, stock with the Alpaca keys; undefined = none. */
  live?: LiveSource;
  /** On-demand scan of ONE symbol (fx-scan.yml only= / stock-scan.yml tickers=, with ondemand=true): the scanner
   *  sends the result card itself. undefined = no GITHUB_DISPATCH_TOKEN. */
  scanOne?: (market: 'fx' | 'stock', sym: string) => Promise<ScanResult>;
  /** /health: the trader coach's last watchdog snapshot as text (trader-coach/health.ts); undefined = no database. */
  health?: () => Promise<string>;
}
export type ScanResult = 'ok' | 'limited' | 'fail';

/** The command list: Telegram's Menu (setMyCommands reads commands.json, kept equal by a test), /help and the pin. */
export type Group = 'Markets' | 'Symbol lookup' | 'Alerts' | 'Times' | 'Journal' | 'Learn';
export const GROUPS: Group[] = ['Markets', 'Symbol lookup', 'Alerts', 'Times', 'Journal', 'Learn'];
export const COMMANDS: { command: string; description: string; group: Group; usage: string; help: string }[] = [
  { command: 'fx', description: 'Open FX setups + getting close', group: 'Markets', usage: '/fx', help: 'open FX setups, getting close, in a zone' },
  { command: 'stocks', description: "Today's stock BUY / WATCH", group: 'Markets', usage: '/stocks', help: "today's stock BUY / WATCH, close to a zone" },
  { command: 'signals', description: 'Every open BUY / SELL / WATCH', group: 'Markets', usage: '/signals', help: 'every open BUY / SELL / WATCH, both markets' },
  { command: 'near', description: 'Everything within 1% of a zone', group: 'Markets', usage: '/near', help: 'everything within 1% of a strong zone' },
  { command: 'scan', description: 'Fresh scan of a symbol (or all)', group: 'Markets', usage: '/scan EURUSD', help: 'fresh scan of one symbol, result in ~1 min (/scan alone: every market)' },
  { command: 'zones', description: 'Every zone of a symbol', group: 'Symbol lookup', usage: '/zones EURUSD', help: 'every zone on every timeframe (or just send the symbol)' },
  { command: 'chart', description: 'Chart: 4 timeframes, or one', group: 'Symbol lookup', usage: '/chart EURUSD', help: 'one image, 4 timeframes (/chart EURUSD H4: one TF)' },
  { command: 'hours', description: 'Best times / days for a symbol', group: 'Symbol lookup', usage: '/hours XAUUSD', help: 'best Calgary times and weekdays' },
  { command: 'fund', description: 'Fundamentals: rates, CPI, P/E, earnings', group: 'Symbol lookup', usage: '/fund EURUSD', help: 'rates + carry + bias (FX), P/E, revenue, earnings (stocks); /fund alone: central banks' },
  { command: 'alert', description: 'Alert at a price, or on a zone', group: 'Alerts', usage: '/alert XAUUSD 2650', help: 'one-shot price alert (/alert NVDA zone: price enters a strong zone)' },
  { command: 'alerts', description: 'Your alerts, mutes, quiet hours', group: 'Alerts', usage: '/alerts', help: 'your alerts (🗑 to delete), mutes, quiet hours, watchlist' },
  { command: 'unalert', description: 'Delete an alert', group: 'Alerts', usage: '/unalert 12', help: 'delete an alert by its number' },
  { command: 'mute', description: 'Mute a symbol (1d or 1w)', group: 'Alerts', usage: '/mute EURUSD 1w', help: 'no scanner alerts for it (1d default, 1w, 12h)' },
  { command: 'unmute', description: 'Unmute a symbol', group: 'Alerts', usage: '/unmute EURUSD', help: 'alerts back on for it' },
  { command: 'quiet', description: 'Quiet hours (Calgary)', group: 'Alerts', usage: '/quiet 22:00-06:00', help: 'silent alerts overnight (/quiet off)' },
  { command: 'watch', description: 'Add a symbol to the watchlist', group: 'Alerts', usage: '/watch AUDNZD', help: 'extra watchlist symbol (/watch: the list)' },
  { command: 'unwatch', description: 'Remove a watchlist symbol', group: 'Alerts', usage: '/unwatch AUDNZD', help: 'take it off the extra watchlist' },
  { command: 'times', description: "Today's key Calgary times", group: 'Times', usage: '/times', help: "today's key Calgary times" },
  { command: 'next', description: 'Next NFP, CPI and Fed decision', group: 'Times', usage: '/next', help: 'next jobs report, CPI, Fed decision' },
  { command: 'news', description: 'Calendar + top market headlines', group: 'Times', usage: '/news', help: "today's high-impact events + top headlines (/news NVDA: one symbol's headlines)" },
  { command: 'took', description: 'Log a trade you took as a plan', group: 'Journal', usage: '/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910', help: 'adds it to the Planner; reply to a 📝 prompt to save why' },
  { command: 'ask', description: 'Ask the lessons a question', group: 'Learn', usage: '/ask what is a proximal line', help: "the mentors' own words (or end any message with ?)" },
  { command: 'health', description: 'Are the scans and keys OK?', group: 'Learn', usage: '/health', help: 'last FX / stock scan, keys OK (the watchdog messages only when something breaks)' },
  { command: 'guide', description: 'How-to cheat sheet + the full guide', group: 'Learn', usage: '/guide', help: 'short how-to + a link to the full guide in the app' },
  { command: 'help', description: 'This list', group: 'Learn', usage: '/help', help: 'this list' },
];

export const APP = 'https://raman-fx.vercel.app';
const LIMIT = 4000;
const FOOT = 'not advice';
const ICON: Record<string, string> = { BUY: '🟢', SELL: '🔴', WATCH: '👀', NEAR: '⏳' };
const TF_SHORT: Record<string, string> = { M15: '15m', H1: '1H', H4: '4H', D1: 'D1', W1: 'W1', MN: 'MN', '3M': '3M', '6M': '6M' };
const TF_ORDER = ['MN', 'W1', 'D1', 'H4', 'H1', 'M15', '3M', '6M'];
export const CAL = 'America/Edmonton';
export const NY = 'America/New_York';

type J = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): any[] => (Array.isArray(v) ? v : []); // eslint-disable-line @typescript-eslint/no-explicit-any
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// ---- text helpers --------------------------------------------------------------------------------------------------
export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const u16 = (s: string) => s.length; // JS strings are UTF-16 already
export const tf = (t: unknown) => TF_SHORT[String(t ?? '')] ?? String(t ?? '');
/** '1.4%', and '<0.1%' rather than a misleading '0.0%' (escape before sending). */
export const shortPct = (p: number) => (Math.abs(p) < 0.05 ? '<0.1%' : `${Math.abs(p).toFixed(1)}%`);
export function away(p: number): string {
  const a = Math.abs(p);
  return `${shortPct(a)} away${a < 0.5 ? ' · very close' : a < 2 ? ' · close' : ''}`;
}
const px = (v: unknown, digits = 2) => (num(v) == null ? 'n/a' : (v as number).toFixed(digits));
const stockPx = (v: unknown) => (num(v) == null ? 'n/a' : (v as number).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const rr = (v: unknown) => { const r = num(v); return r == null ? '' : r >= 10 ? `R:R ${r.toFixed(0)}` : `R:R ${r.toFixed(1)}`; };

/** Join lines; past LIMIT, cut whole lines and say so (every tag opens and closes on one line, so a cut is safe). */
export function fit(lines: string[], limit = LIMIT): string {
  const out: string[] = [];
  let n = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (n + l.length + 1 > limit - 40) {
      out.push(`… +${lines.slice(i).filter(x => x.trim()).length} more lines in the app`);
      break;
    }
    out.push(l);
    n += l.length + 1;
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

// Rule keys / labels -> plain words (same table as tools/stock_scanner/notify.py PLAIN).
const PLAIN: Record<string, string> = {
  'HTF area not reached': 'bigger zone not reached yet', location: 'bigger zone not reached yet',
  curve: 'wrong end of the range', 'wrong side of the curve': 'wrong end of the range', 'high on curve': 'price high in its range',
  'direction against': 'trend against it', direction: 'trend against it', 'direction not long': 'trend not up', 'HTF align': 'trend not up',
  'direction reduced (correction)': 'trend in a pullback', reduced: 'trend in a pullback',
  'opposite HTF zone on top': 'bigger opposite zone in the way', 'HTF opposite': 'bigger opposite zone in the way',
  'monthly supply on top': 'monthly supply overhead', 'no HTF supply': 'bigger supply overhead',
  'sideways market': 'sideways market', sideways: 'sideways market', 'not sideways': 'sideways market',
  'weak zone type': 'weak zone', strong: 'weak zone', 'zone already tested': 'zone used before', fresh: 'zone used before',
  'overlap / flip zone': 'messy zone', clean: 'messy zone', 'zone already did its job': 'zone already played out', 'not used': 'zone already played out',
  '3rd CP in a row': 'third pullback in a row', 'no 3rd CP': 'third pullback in a row',
  'room < 2x the stop': 'not enough room to the target', room: 'not enough room to the target',
  'departure < 2x': 'weak move away from the zone', leg: 'weak move away from the zone',
  'price not near the entry': 'price still far', 'near entry': 'price still far',
  'out of the trendline': 'off the trendline', 'out of TL': 'off the trendline', 'trendline far / 4th touch': 'trendline far', trendline: 'trendline far',
  'HTF area tested before': 'bigger zone used before', 'host tested': 'bigger zone used before',
  'confirmation entry only': 'confirm first', blind: 'confirm first', 'spread > 10% of the stop': 'spread too wide', spread: 'spread too wide',
  'no XAU_USD on H1 / H4 (Raja)': 'gold: daily and up only', 'gold TF': 'gold: daily and up only',
  'not on this TF (Raja)': 'not traded on this timeframe', 'market TF': 'not traded on this timeframe',
  'context only (levels unreliable)': 'context only', context: 'context only', 'W1 / MN area: enter on D1 / H4': 'big area: enter lower down', area: 'big area: enter lower down',
  'weekend gap risk': 'weekend gap risk', weekend: 'weekend gap risk',
};
export const plain = (label: unknown) => {
  const l = String(label ?? '').trim();
  return PLAIN[l] ?? l.replace(/HTF/g, 'bigger-timeframe');
};

// ---- time (zone rules via Intl, plus the 2026c Alberta rule when the runtime lacks it) ----------------------------------
interface Parts { y: number; m: number; d: number; h: number; mi: number; wd: string; mon: string }
const fmtCache = new Map<string, Intl.DateTimeFormat>();
// Alberta stays on UTC-6 all year from 2026-11-01 (tzdata 2026c: the 2026-11-01 08:00 UTC fall-back never happens).
// Runtimes whose ICU predates 2026c (Deno Deploy / Node as of 2026-10) still apply the old MST rule; patch only then.
const AB_PERMANENT = Date.UTC(2026, 10, 1, 8, 0);
let abStale: boolean | null = null;
const albertaStale = () => {
  if (abStale == null) { const p = rawParts(new Date(AB_PERMANENT + 30 * 86400000), CAL); abStale = p.h !== 2; }   // 08:00 UTC Dec 1 = 2 AM at UTC-6
  return abStale;
};
export function parts(t: Date, tz: string): Parts {
  if (tz === CAL && t.getTime() >= AB_PERMANENT && albertaStale()) return rawParts(new Date(t.getTime() - 6 * 3600000), 'UTC');
  return rawParts(t, tz);
}
function rawParts(t: Date, tz: string): Parts {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short', hourCycle: 'h23' });
    fmtCache.set(tz, f);
  }
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(t)) p[x.type] = x.value;
  const m = Number(p.month);
  return { y: Number(p.year), m, d: Number(p.day), h: Number(p.hour) % 24, mi: Number(p.minute), wd: p.weekday, mon: MON[m - 1] };
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const offsetMin = (t: Date, tz: string) => { const p = parts(t, tz); return (Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi) - Math.floor(t.getTime() / 60000) * 60000) / 60000; };
/** The instant of a wall-clock time in a zone ('2026-11-06', '08:30', NY). */
export function zoned(day: string, hhmm: string, tz: string): Date {
  const [y, m, d] = day.split('-').map(Number), [h, mi] = hhmm.split(':').map(Number);
  const wall = Date.UTC(y, m - 1, d, h, mi);
  let t = wall - offsetMin(new Date(wall), tz) * 60000;
  t = wall - offsetMin(new Date(t), tz) * 60000;
  return new Date(t);
}
/** '6:30 AM' on the Calgary clock. */
export function clock(t: Date, tz = CAL): string {
  const p = parts(t, tz);
  return `${p.h % 12 || 12}:${String(p.mi).padStart(2, '0')} ${p.h < 12 ? 'AM' : 'PM'}`;
}
/** 'Thu Oct 29' on the Calgary calendar. */
export function day(t: Date, tz = CAL): string { const p = parts(t, tz); return `${p.wd} ${p.mon} ${p.d}`; }
export const isoDay = (t: Date, tz = CAL) => { const p = parts(t, tz); return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`; };
const parseUtc = (s: unknown): Date | null => { const t = Date.parse(String(s ?? '')); return Number.isFinite(t) ? new Date(t) : null; };
const when = (s: unknown) => { const t = parseUtc(s); return t ? `${day(t)} · ${clock(t)}` : 'time unknown'; };
const dayOfIso = (d: string) => { const t = new Date(`${d}T12:00:00Z`); return `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][t.getUTCDay()]} ${MON[t.getUTCMonth()]} ${t.getUTCDate()}`; };

// ---- data ----------------------------------------------------------------------------------------------------------
const NO_DATA = '⚠️ <b>Scanner data unavailable</b>\nThe published files did not load. Try again in a minute.';
const fxPct = (z: J) => { const p = num(z.px), prox = num(z.prox); if (!p || prox == null || (z.sec ?? z.section) === 'in') return 0; return Math.abs(p - prox) / p * 100; };
const stockPct = (z: J) => ((z.sec ?? z.section) === 'in' ? 0 : Math.abs(num(z.pct) ?? 0));
const fxSigPct = (s: J) => { const p = num(s.price), e = num(s.entry); return p && e != null ? Math.abs(p - e) / p * 100 : null; };
const digitsOf = (s: J) => num(s.digits) ?? 5;

function fxSignalLines(s: J): string[] {
  const d = digitsOf(s), k = String(s.kind);
  const top = `${ICON[k] ?? '•'} <b>${esc(s.sym)}</b> ${tf(s.tf)} ${esc(k)} ${px(s.entry, d)}${num(s.target) != null ? ` → ${px(s.target, d)}` : ''}`;
  const p = fxSigPct(s);
  const bits = [`stop ${px(s.stop, d)}`, rr(s.rr), `${s.side ?? ''}`.trim(), p != null ? (p < 0.05 ? 'at the entry' : away(p)) : '',
    k === 'WATCH' ? (s.watch_kind === 'new' ? 'price still far' : 'confirm first') : ''];
  return [top, esc(bits.filter(Boolean).join(' · '))];
}
function stockSignalLines(s: J): string[] {
  const k = String(s.kind);
  const top = `${ICON[k] ?? '•'} <b>${esc(s.symbol)}</b> ${tf(s.tf)} ${esc(k)} ${stockPx(s.entry)}${num(s.target) != null ? ` → ${stockPx(s.target)}` : ''}`;
  const p = num(s.to_entry_pct);
  const bits = [`stop ${stockPx(s.stop)}`, rr(s.rr), 'demand', p != null ? (Math.abs(p) < 0.05 ? 'at the entry' : away(p)) : '',
    k === 'BUY' ? `score ${s.score ?? 0}/10` : s.watch === 'new' ? 'price still far' : 'confirm first'];
  return [top, esc(bits.filter(Boolean).join(' · '))];
}
const names = (rows: J[], key: string, n: number, extra?: (r: J) => string) =>
  rows.slice(0, n).map(r => `${esc(r[key])} ${tf(r.tf)}${extra ? ` ${esc(extra(r))}` : ''}`).join(' · ') + (rows.length > n ? ` +${rows.length - n}` : '');
function section(title: string, rows: J[], key: string, n = 8, extra?: (r: J) => string): string[] {
  return rows.length ? [`<b>${esc(title)}</b> (${rows.length})`, names(rows, key, n, extra)] : [];
}
const fxSetups = (fx: J) => [...arr(fx.signals).sort((a, b) => Number(!a.wl) - Number(!b.wl) || (b.score ?? 0) - (a.score ?? 0)),
  ...arr(fx.watch).sort((a, b) => Number(!a.wl) - Number(!b.wl) || (b.score ?? 0) - (a.score ?? 0))];
const stockSetups = (st: J) => {
  const key = (a: J, b: J) => (b.score ?? 0) - (a.score ?? 0) || (b.rr ?? 0) - (a.rr ?? 0);
  const s = arr(st.signals);
  return [...s.filter(x => x.kind === 'BUY').sort(key), ...s.filter(x => x.kind === 'WATCH').sort(key)];
};
function fxCloseRows(fx: J): J[] {
  const zl = obj(fx.lists);
  const rows = ['demand', 'supply'].flatMap(side => arr(obj(zl[side]).near).filter(r => r.wl && r.loc_ok).map(r => ({ ...r, side })))
    .sort((a, b) => fxPct(a) - fxPct(b));
  const seen = new Set<string>();
  return rows.filter(r => !seen.has(r.sym) && !!seen.add(r.sym));
}
const fxList = (fx: J, side: string, sec: string) => arr(obj(obj(fx.lists)[side])[sec]).slice().sort((a, b) => Number(!a.wl) - Number(!b.wl) || fxPct(a) - fxPct(b) || (b.score ?? 0) - (a.score ?? 0));
const stList = (st: J, side: string, sec: string) => arr(obj(obj(st.zone_lists)[side])[sec]);
const kb = (label: string, path: string): Button[][] => [[{ text: label, url: `${APP}${path}` }]];

/** The persistent quick-reply keyboard (ReplyKeyboardMarkup); its button texts map to commands in handle(). */
export const QUICK: [string, string][][] = [[['💱 FX', 'fx'], ['📈 Stocks', 'stocks'], ['⏳ Near', 'near']], [['📋 Signals', 'signals'], ['🕐 Times', 'times'], ['📅 Next', 'next']]];
export const MAIN_KEYBOARD = { keyboard: QUICK.map(r => r.map(([text]) => ({ text }))), is_persistent: true, resize_keyboard: true };
const QUICK_MAP = new Map<string, string>(QUICK.flat().flatMap(([label, cmd]) => [[label.toLowerCase(), cmd], [label.replace(/^\S+\s+/, '').toLowerCase(), cmd]] as [string, string][]));
/** Callback buttons for symbols: [🔎 SYM] [📊 SYM] per symbol (callback_data <= 64 bytes). */
export function symButtons(syms: string[], n = 3): Button[][] {
  return [...new Set(syms)].slice(0, n).filter(s => cbOk(`z:${s}`)).map(s => [{ text: `🔎 Zones ${s}`, callback_data: `z:${s}` }, { text: `📊 Chart ${s}`, callback_data: `c:${s}` }]);
}
const cbOk = (d: string) => new TextEncoder().encode(d).length <= 64;

// ---- commands ------------------------------------------------------------------------------------------------------
export function helpText(): string {
  const lines = ['🤖 <b>RamanFX bot · commands</b>', 'Type a command, or just send a symbol (EURUSD, XAUUSD, NVDA).'];
  for (const g of GROUPS) {
    lines.push('', `<b>${g}</b>`);
    for (const c of COMMANDS.filter(x => x.group === g)) lines.push(`${esc(c.usage)} · ${esc(c.help)}`);
  }
  lines.push('', `Times on the Calgary clock · ${FOOT}`);
  return lines.join('\n');
}

/** /guide, /howto: a compact cheat sheet; the full how-to is the app's /guide page (src/content/guide.ts). */
export function cmdGuide(): Reply {
  const text = ['📘 <b>RamanFX · quick guide</b>', 'Send a symbol (EURUSD, XAUUSD, NVDA): its zones, price and buttons.', '',
    '<b>Look</b> /fx · /stocks · /signals · /near', '<b>One symbol</b> /zones · /chart EURUSD 15m · /scan EURUSD · /fund · /news NVDA · /hours',
    '<b>Alerts</b> /alert XAUUSD 2650 · /alert NVDA zone · /alerts · /mute EURUSD 1w · /quiet 22:00-06:00 · /watch',
    '<b>Day</b> /times · /next · /took EURUSD buy 1.0850 sl 1.0820 tp 1.0910', '<b>Learn</b> /ask what is a proximal line', '',
    '<b>Comes by itself</b> (Calgary)', '6 AM brief + lesson · FX scan hourly (only when new) · big moves hourly · stock scan after the US close · breaking news on watched symbols · coach: rule guard, 📝 why?, Sunday 6 PM report', '',
    `All commands: /help · ${FOOT}`].join('\n');
  return { cmd: 'guide', text, buttons: [[{ text: '📘 Open the full guide', url: `${APP}/guide` }], [{ text: '🤖 Bot commands', url: `${APP}/guide#bot` }, { text: '🛠 If something breaks', url: `${APP}/guide#fix` }]] };
}

async function cmdFx(ctx: Ctx): Promise<Reply> {
  const fx = obj(await ctx.load('fx/latest.json'));
  if (!Array.isArray(fx.map)) return { cmd: 'fx', text: NO_DATA };
  const setups = fxSetups(fx), c = obj(fx.counts);
  const head = setups.length ? [c.BUY ? `${c.BUY} BUY` : '', c.SELL ? `${c.SELL} SELL` : '', c.WATCH ? `${c.WATCH} WATCH` : ''].filter(Boolean).join(' · ') : 'no open setups';
  const lines = [`💱 <b>FX · ${esc(head)}</b>`, `${esc(tf('H1'))} candle closed ${esc(when(fx.h1_close_utc ?? fx.h4_close_utc ?? fx.generated))}${fx.fixture ? ' · sample data' : ''}`, ''];
  for (const s of setups.slice(0, 8)) lines.push(...fxSignalLines(s), '');
  if (setups.length > 8) lines.push(`+${setups.length - 8} more setups in the app`, '');
  const close = fxCloseRows(fx);
  if (close.length) {
    lines.push(`${ICON.NEAR} <b>Getting close</b>`);
    for (const r of close.slice(0, 6)) lines.push(`<b>${esc(r.sym)}</b> · ${tf(r.tf)} ${esc(r.side)} · ${esc(away(fxPct(r)))}`);
    if (close.length > 6) lines.push(`+${close.length - 6} more`);
    lines.push('');
  } else lines.push('Nothing on the watchlist close to a good zone yet.', '');
  lines.push(...section('In demand', fxList(fx, 'demand', 'in'), 'sym'), ...section('In supply', fxList(fx, 'supply', 'in'), 'sym'),
    ...section('Bounced off demand', fxList(fx, 'demand', 'left'), 'sym', 6), ...section('Turned down at supply', fxList(fx, 'supply', 'left'), 'sym', 6));
  lines.push('', `${c.instruments ?? arr(fx.map).length} markets · check levels on Pepperstone · ${FOOT}`);
  return { cmd: 'fx', text: fit(lines), buttons: [...symButtons([...setups.map(x => x.sym), ...close.map(r => r.sym)]), ...kb('Open FX scanner', '/scanner/fx')] };
}

async function cmdStocks(ctx: Ctx): Promise<Reply> {
  const st = obj(await ctx.load('scanner/latest.json'));
  if (!Array.isArray(st.signals)) return { cmd: 'stocks', text: NO_DATA };
  const s = stockSetups(st);
  const nb = s.filter(x => x.kind === 'BUY').length, nw = s.length - nb;
  const lines = [`📈 <b>Stocks · ${s.length ? `${nb} BUY · ${nw} WATCH` : 'no setups today'}</b>`,
    `${esc(st.date ? dayOfIso(st.date) : '')} close · scanned ${esc(when(st.generated_at))}${st.fixture ? ' · sample data' : ''}`, ''];
  for (const x of s.slice(0, 8)) lines.push(...stockSignalLines(x), '');
  if (s.length > 8) lines.push(`+${s.length - 8} more in the app`, '');
  const near = (side: string) => stList(st, side, 'near').slice().sort((a, b) => stockPct(a) - stockPct(b));
  lines.push(...section('⏳ Close to demand', near('demand'), 's', 8, r => shortPct(stockPct(r))),
    ...section('Close to supply', near('supply'), 's', 6, r => shortPct(stockPct(r))),
    ...section('In demand', stList(st, 'demand', 'in'), 's', 6));
  lines.push('', `${st.scanned ?? ''} stocks · ${FOOT}`.trim());
  return { cmd: 'stocks', text: fit(lines), buttons: [...symButtons([...s.map(x => x.symbol), ...near('demand').map(r => r.s)]), ...kb('Open stock scanner', '/scanner')] };
}

async function cmdSignals(ctx: Ctx): Promise<Reply> {
  const [fx, st] = [obj(await ctx.load('fx/latest.json')), obj(await ctx.load('scanner/latest.json'))];
  if (!Array.isArray(fx.map) && !Array.isArray(st.signals)) return { cmd: 'signals', text: NO_DATA };
  const f = fxSetups(fx), s = stockSetups(st);
  const lines = [`📋 <b>Open signals · ${f.length + s.length}</b>`, ''];
  const one = (icon: string, sym: string, t: string, kind: string, entry: string, p: number | null) =>
    `${icon} <b>${esc(sym)}</b> ${tf(t)} ${esc(kind)} ${esc(entry)}${p != null ? ` · ${esc(Math.abs(p) < 0.05 ? 'at the entry' : away(p))}` : ''}`;
  lines.push(`<b>FX</b>${Array.isArray(fx.map) ? ` · ${esc(when(fx.h1_close_utc ?? fx.generated))}` : ' · data unavailable'}`);
  lines.push(...(f.length ? f.map(x => one(ICON[x.kind] ?? '•', x.sym, x.tf, x.kind, px(x.entry, digitsOf(x)), fxSigPct(x))) : ['none open']));
  lines.push('', `<b>Stocks</b>${Array.isArray(st.signals) ? ` · ${esc(st.date ? dayOfIso(st.date) : '')} close` : ' · data unavailable'}`);
  lines.push(...(s.length ? s.map(x => one(ICON[x.kind] ?? '•', x.symbol, x.tf, x.kind, stockPx(x.entry), num(x.to_entry_pct))) : ['none open']));
  lines.push('', `Details: /fx · /stocks · /zones SYMBOL · ${FOOT}`);
  return { cmd: 'signals', text: fit(lines), buttons: symButtons([...f.map(x => x.sym), ...s.map(x => x.symbol)], 4) };
}

async function cmdNear(ctx: Ctx): Promise<Reply> {
  const [fx, st] = [obj(await ctx.load('fx/latest.json')), obj(await ctx.load('scanner/latest.json'))];
  if (!Array.isArray(fx.map) && !Array.isArray(st.signals)) return { cmd: 'near', text: NO_DATA };
  type Row = { m: string; sym: string; tf: string; side: string; p: number };
  const best = new Map<string, Row>();
  const add = (r: Row) => { const k = `${r.m}:${r.sym}`; const o = best.get(k); if (!o || r.p < o.p) best.set(k, r); };
  for (const side of ['demand', 'supply']) {
    for (const r of fxList(fx, side, 'near')) { const p = fxPct(r); if (p <= 1) add({ m: 'FX', sym: r.sym, tf: r.tf, side, p }); }
    for (const r of stList(st, side, 'near')) { const p = stockPct(r); if (p <= 1) add({ m: 'stock', sym: r.s, tf: r.tf, side, p }); }
  }
  const rows = [...best.values()].sort((a, b) => a.p - b.p || a.sym.localeCompare(b.sym));
  const inFx = new Set(['demand', 'supply'].flatMap(s => fxList(fx, s, 'in').map(r => r.sym))).size;
  const inSt = new Set(['demand', 'supply'].flatMap(s => stList(st, s, 'in').map(r => r.s))).size;
  const lines = [`${ICON.NEAR} <b>Within 1% of a zone · ${rows.length}</b>`, 'Strong zones the scanners track, closest first.', ''];
  for (const r of rows) lines.push(`<b>${esc(r.sym)}</b> ${r.m === 'FX' ? 'FX' : 'stock'} · ${tf(r.tf)} ${esc(r.side)} · ${esc(away(r.p))}`);
  if (!rows.length) lines.push('Nothing within 1% right now.');
  lines.push('', `Already inside a zone: ${inFx} FX · ${inSt} stocks (/fx, /stocks)`, FOOT);
  return { cmd: 'near', text: fit(lines), buttons: symButtons(rows.map(r => r.sym)) };
}

// ---- symbol lookup --------------------------------------------------------------------------------------------------
const norm = (s: string) => s.toUpperCase().replace(/^(PEPPERSTONE|OANDA|NASDAQ|NYSE|AMEX|TSX):/, '').replace(/[\s/_]/g, '');
const normStock = (s: string) => norm(s).replace(/-/g, '.');
export interface Resolved { market: 'fx' | 'stock'; sym: string; row: J }

export async function resolve(q: string, ctx: Ctx): Promise<{ hit: Resolved | null; suggest: string[] }> {
  const fx = obj(await ctx.load('fx/latest.json')), ix = obj(await ctx.load('scanner/index.json'));
  const fxRows = arr(fx.map), stRows = arr(ix.tickers);
  const k = norm(q), ks = normStock(q);
  const f = fxRows.find(r => r.sym === k || String(r.oanda ?? '').replace(/_/g, '') === k);
  if (f) return { hit: { market: 'fx', sym: f.sym, row: f }, suggest: [] };
  const s = stRows.find(r => String(r.s).toUpperCase() === ks || String(r.s).toUpperCase().replace(/\./g, '') === k);
  if (s) return { hit: { market: 'stock', sym: s.s, row: s }, suggest: [] };
  const all: string[] = [...fxRows.map(r => String(r.sym)), ...stRows.map(r => String(r.s))];
  const scored = all.map(c => [c.startsWith(k) && k.length >= 2 ? 0.5 : lev(k, c.toUpperCase().replace(/\./g, '')), c] as const)
    .filter(([d]) => d <= Math.max(1, Math.min(2, Math.floor(k.length / 3))))
    .sort((a, b) => a[0] - b[0] || a[1].length - b[1].length || a[1].localeCompare(b[1]));
  const byName = stRows.filter(r => k.length >= 3 && String(r.n ?? '').toUpperCase().split(/[\s.,&-]+/).some(w => w.startsWith(k))).map(r => String(r.s));
  return { hit: null, suggest: [...new Set([...scored.map(x => x[1]), ...byName])].slice(0, 4) };
}
export function lev(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 3) return 9;
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0];
    d[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const t = d[j];
      d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = t;
    }
  }
  return d[b.length];
}
const notFound = (q: string, sug: string[]) => `🔎 <b>${esc(q.toUpperCase())}</b> not found` + (sug.length ? `\nDid you mean: ${sug.map(s => `/zones ${esc(s)}`).join(' · ')}` : '\nSend a Pepperstone FX name (EURUSD, XAUUSD, US500) or a stock ticker (NVDA, BRK.B).');

/** Where price is against a zone: 'in it', or the percent to its nearer edge. */
function placement(price: number, a: number, b: number): { inside: boolean; p: number; dir: 'above' | 'below' | 'in' } {
  const lo = Math.min(a, b), hi = Math.max(a, b);
  if (price >= lo && price <= hi) return { inside: true, p: 0, dir: 'in' };
  return price > hi ? { inside: false, p: (price - hi) / price * 100, dir: 'above' } : { inside: false, p: (lo - price) / price * 100, dir: 'below' };
}
const sameZone = (a: J, t: unknown, side: unknown, prox: unknown) => a.tf === t && a.side === side && num(a.prox ?? a.proximal) != null && Math.abs((a.prox ?? a.proximal) - (prox as number)) < 1e-9;

function zoneStatus(pl: ReturnType<typeof placement>, side: string, extra: string): string {
  const wrong = (side === 'demand' && pl.dir === 'below') || (side === 'supply' && pl.dir === 'above');
  const where = pl.inside ? 'in it' : wrong ? `price ${shortPct(pl.p)} through it` : `${shortPct(pl.p)} away`;
  return [where, extra].filter(Boolean).join(' · ');
}

// ---- live data (live.ts candles at request time + zonecore.ts zones) -----------------------------------------------
export const LIVE_HINT = '(live data needs OANDA/Alpaca keys in Supabase)';
const LIVE_DOWN = '(live data did not load just now: latest scan shown)';
export interface LiveView { at: number; price: number; zones: LiveZone[]; fx?: LiveFx; st?: LiveStock; feed: string }
const liveMemo = new WeakMap<object, LiveView>();
/** Live candles + zones computed on them (cached with the candles); null = no keys or the fetch failed. */
export async function liveFor(r: Resolved, ctx: Ctx, digits: number): Promise<LiveView | null> {
  try {
    if (r.market === 'fx') {
      if (!ctx.live?.fx || !r.row.oanda) return null;
      const d = await ctx.live.fx(String(r.row.oanda));
      if (!d) return null;
      let v = liveMemo.get(d);
      if (!v) {
        const pip = num(r.row.pip) ?? (digits >= 4 ? 1e-4 : 0.01);
        v = { at: d.at, price: d.price, zones: fxZonesOf(d.closed, pip, digits, d.price), fx: d, feed: d.feed };
        liveMemo.set(d, v);
      }
      return v;
    }
    if (!ctx.live?.stock) return null;
    const d = await ctx.live.stock(String(r.sym));
    if (!d) return null;
    let v = liveMemo.get(d);
    if (!v) { v = { at: d.at, price: d.price, zones: stockZonesOf(d.daily, d.price), st: d, feed: d.feed }; liveMemo.set(d, v); }
    return v;
  } catch (e) { console.log(JSON.stringify({ ev: 'live_error', market: r.market, err: String((e as Error)?.name ?? e).slice(0, 40) })); return null; }
}
/** '' when live, else why not (no keys / fetch failed). */
const liveNote = (r: Resolved, ctx: Ctx, lv: LiveView | null) => (lv ? '' : (r.market === 'fx' ? ctx.live?.fx : ctx.live?.stock) ? LIVE_DOWN : LIVE_HINT);
const liveAt = (lv: LiveView) => `live · ${clock(new Date(lv.at))}`;
/** [🔄 Live scan] (an on-demand scan of this symbol) when a GitHub token is set. */
const scanButton = (sym: string, ctx: Ctx): Button[] => [...(ctx.scanOne && cbOk(`s:${sym}`) ? [{ text: '🔄 Live scan', callback_data: `s:${sym}` }] : []), ...(cbOk(`f:${sym}`) ? [fundButton(sym)] : [])];   // + [📑 Fundamentals]

async function fxZones(r: Resolved, ctx: Ctx): Promise<Reply> {
  const fx = obj(await ctx.load('fx/latest.json'));
  const shard = obj(await ctx.load(`fx/d/${r.row.k ?? r.row.cls}.json`));
  const d = obj(obj(shard.instruments)[r.sym]);
  const dg = digitsOf(d.digits != null ? d : r.row);
  const lv = await liveFor(r, ctx, dg);
  const price = lv?.price ?? num(d.price) ?? num(r.row.px);
  const src: J[] | null = lv ? lv.zones.slice(0, 16) : Array.isArray(d.zones) ? d.zones : null;   // the scan's 16 nearest
  if (!price || !src) return { cmd: 'zones', text: `🔎 <b>${esc(r.sym)}</b>\nNo zone detail published for it yet. ${FOOT}\n${liveNote(r, ctx, lv)}`.trim() };
  const scanned = `${tf('H1')} candle closed ${when(fx.h1_close_utc ?? fx.generated)}`;
  const lines = [`🔎 <b>${esc(r.sym)}</b> · FX · price ${px(price, dg)}${lv ? ` · ${esc(liveAt(lv))}` : ''}`,
    lv ? esc(`zones + price live (OANDA) · signals: scan of the ${scanned.replace(' candle closed ', ' candle ')}`) : esc(scanned)];
  const st = obj(d.states);
  lines.push('Trend: ' + esc(['MN', 'W1', 'D1', 'H4', 'H1'].filter(t => st[t]).map(t => `${tf(t)} ${String(st[t]).toLowerCase()}`).join(' · ')));
  const sigs = arr(d.signals);
  if (sigs.length) lines.push(`Open: ${esc(sigs.join(', '))}`);
  const hits = arr(d.hits), checks = arr(d.checks);
  const zones = src.slice().sort((a, b) => TF_ORDER.indexOf(a.tf) - TF_ORDER.indexOf(b.tf) || (b.proximal - a.proximal));
  let cur = '';
  for (const z of zones) {
    if (z.tf !== cur) { cur = z.tf; lines.push('', `<b>${esc(tf(cur))}</b>`); }
    const pl = placement(price, z.proximal, z.distal);
    const h = hits.find(x => sameZone(x, z.tf, z.side, z.proximal)), c = checks.find(x => sameZone(x, z.tf, z.side, z.proximal));
    let extra = '';
    if (h?.section === 'left') extra = z.side === 'demand' ? 'bounced' : 'turned down';
    const status = h?.status ?? c?.block;
    const label = h?.label ?? c?.label;
    if (status === 'BUY' || status === 'SELL') extra = [extra, `${status} setup`].filter(Boolean).join(' · ');
    else if (status) extra = [extra, `blocked: ${plain(label || status)}`].filter(Boolean).join(' · ');
    else if (z.tf === '3M') extra = 'context';
    else if ((z.touches ?? 0) > 0) extra = `touched ${z.touches}x`;
    else extra = extra || 'fresh';
    lines.push(`${z.side === 'demand' ? '🟩' : '🟥'} ${esc(z.side)} ${px(z.proximal, dg)}–${px(z.distal, dg)} · ${esc(zoneStatus(pl, z.side, extra))}`);
  }
  lines.push('', `Nearest ${zones.length} zones · check levels on Pepperstone · ${FOOT}`);
  const note = liveNote(r, ctx, lv);
  if (note) lines.push(note);
  return { cmd: 'zones', text: fit(lines), buttons: [...chartButtons(r.sym, 'fx', ctx), [{ text: `📈 ${r.sym} on TradingView`, url: `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(d.tv || `PEPPERSTONE:${r.sym}`)}` }, ...scanButton(r.sym, ctx), ...newsButton(r.sym)], ...prefsButtons(r.sym, ctx)] };
}

async function stockZones(r: Resolved, ctx: Ctx): Promise<Reply> {
  const [sh, st] = [obj(await ctx.load(`scanner/t/${r.row.k}.json`)), obj(await ctx.load('scanner/latest.json'))];
  const d = obj(obj(sh.tickers)[r.sym]);
  const lv = await liveFor(r, ctx, 2);
  const price = lv?.price ?? num(d.price) ?? num(r.row.px);
  const old = arr(d.zones);
  // live zones keep the scan's verdict ('br': the first rule blocking a BUY) when the scan has the same zone
  const src: J[] | null = lv ? lv.zones.map(z => ({ ...z, br: old.find(o => o.tf === z.tf && o.side === z.side && o.proximal === z.proximal)?.br })) : Array.isArray(d.zones) ? d.zones : null;
  if (!price || !src) return { cmd: 'zones', text: `🔎 <b>${esc(r.sym)}</b>\nNo zone detail published for it yet. ${FOOT}\n${liveNote(r, ctx, lv)}`.trim() };
  const ccy = d.levels_ccy && d.levels_ccy !== 'USD' ? ` ${d.levels_ccy}` : '';
  const lines = [`🔎 <b>${esc(r.sym)}</b> · ${esc(d.name ?? r.row.n ?? '')}`,
    lv ? `price ${stockPx(price)} · ${esc(liveAt(lv))}` : `price ${stockPx(price)}${esc(ccy)} · ${esc(d.date ? dayOfIso(d.date) : '')} close · scanned ${esc(when(st.generated_at))}`];
  if (lv) lines.push(esc(`zones + price live (Alpaca) · signals: scan of ${when(st.generated_at)}`));
  lines.push('Trend: ' + esc([['W1', d.w1], ['MN', d.mn], ['3M', d.m3]].filter(x => x[1] && x[1] !== 'n/a').map(([t, v]) => `${tf(t)} ${String(v).toLowerCase()}`).join(' · ')));
  if (d.signal) lines.push(`Open: ${esc(d.signal)} (see /stocks)`);
  const earn = await earningsLine(r.sym, ctx);   // '📑 next earnings: Nov 4 (in 6 days)' within 14 days
  if (earn) lines.push(earn);
  const zl = obj(st.zone_lists);
  const mine = ['demand', 'supply'].flatMap(side => ['in', 'near', 'left'].flatMap(sec => arr(obj(zl[side])[sec]).filter(x => x.s === r.sym).map(x => ({ ...x, side, section: sec }))));
  const zones = src.slice().sort((a, b) => TF_ORDER.indexOf(a.tf) - TF_ORDER.indexOf(b.tf) || (b.proximal - a.proximal));
  let cur = '';
  for (const z of zones) {
    if (z.tf !== cur) { cur = z.tf; lines.push('', `<b>${esc(tf(cur))}</b>`); }
    const pl = placement(price, z.proximal, z.distal);
    const h = mine.find(x => sameZone(x, z.tf, z.side, z.proximal));
    const bits: string[] = [];
    if (h?.section === 'left') bits.push(z.side === 'demand' ? 'bounced' : 'turned down');
    if (z.side === 'demand') {
      const why = z.br ?? (h && h.status !== 'BUY' && h.status !== 'WATCH' && h.status !== 'ok' ? h.status : null);
      if (h?.status === 'BUY' || h?.status === 'WATCH') bits.push(`${h.status} setup`);
      else if (why) bits.push(`blocked: ${plain(h?.label || why)}`);
    }
    if (!bits.length) bits.push(z.fresh ? 'fresh' : `used ${z.touches ?? 1}x`);
    lines.push(`${z.side === 'demand' ? '🟩' : '🟥'} ${esc(z.side)} ${stockPx(z.proximal)}–${stockPx(z.distal)} · ${esc(zoneStatus(pl, z.side, bits.join(' · ')))}`);
  }
  lines.push('', `${zones.length} zones · long only (supply = where to take profit) · ${FOOT}`);
  const note = liveNote(r, ctx, lv);
  if (note) lines.push(note);
  const slug = String(r.sym).replace(/\./g, '-');
  return { cmd: 'zones', text: fit(lines), buttons: [...chartButtons(r.sym, 'stock', ctx), [...(d.chart ? [{ text: `📈 ${r.sym}`, url: String(d.chart) }] : []), { text: 'Open in scanner', url: `${APP}/scanner/${encodeURIComponent(slug)}` }, ...scanButton(r.sym, ctx), ...newsButton(r.sym)], ...prefsButtons(r.sym, ctx)] };
}

async function cmdZones(q: string, ctx: Ctx): Promise<Reply> {
  if (!q) return { cmd: 'zones', text: 'Send a symbol after it, e.g. <b>/zones EURUSD</b> or <b>/zones NVDA</b>. Just the symbol works too.' };
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'zones', text: notFound(q, suggest) };
  return withLatest(hit.sym, ctx, hit.market === 'fx' ? fxZones(hit, ctx) : stockZones(hit, ctx));
}

// ---- times ---------------------------------------------------------------------------------------------------------
const ET_TIME: Record<string, string> = { nfp: '08:30', cpi: '08:30', fomc: '14:00' };
const KIND_NAME: Record<string, string> = { nfp: 'Jobs report (NFP)', cpi: 'US inflation (CPI)', fomc: 'Fed decision (FOMC)' };
/** UNVERIFIED fallback (tools/reminders/reminders.py FALLBACK): used only when the fetched cache has no dates. */
export const FALLBACK: Record<string, string[]> = { nfp: ['2026-11-06', '2026-12-04'], cpi: ['2026-11-10', '2026-12-10'], fomc: ['2026-12-09'] };
interface Ev { kind: string; date: string; et: string; verified: boolean }
function eventsOf(js: unknown): Ev[] {
  const k = obj(obj(js).kinds);
  return ['nfp', 'cpi', 'fomc'].flatMap(kind => {
    const evs = arr(obj(k[kind]).events).filter(e => typeof e?.date === 'string');
    return (evs.length ? evs.map(e => ({ kind, date: e.date, et: e.et || ET_TIME[kind], verified: e.verified !== false }))
      : FALLBACK[kind].map(date => ({ kind, date, et: ET_TIME[kind], verified: false })));
  });
}

async function cmdTimes(ctx: Ctx): Promise<Reply> {
  const today = isoDay(ctx.now);
  const wd = parts(ctx.now, CAL).wd;
  const at = (et: string) => clock(zoned(today, et, NY));
  const lines = [`🕐 <b>Today · ${esc(day(ctx.now))}</b> (Calgary)`];
  if (wd === 'Sat' || wd === 'Sun') {
    lines.push('Weekend: stock markets closed.', wd === 'Sun' ? `Forex reopens ${esc(at('17:00'))} (5:00 PM New York).` : 'Forex reopens Sunday 5:00 PM New York time.');
  } else {
    lines.push(`${at('08:30')} · US data (8:30 AM New York)`, `${at('09:30')} · NYSE opens`,
      `${at('08:00')}–${at('12:00')} · busiest window for forex, gold, indices (peak ${at('10:00')})`,
      `${at('11:00')} · London close / fix`, `${at('16:00')} · NYSE closes`, `${at('17:00')} · forex day rolls over (new daily candle)`);
  }
  const evs = eventsOf(await ctx.load('events.json')).filter(e => e.date === today);
  for (const e of evs) {
    const t = zoned(e.date, e.et, NY);
    lines.push('', `⏰ <b>${esc(KIND_NAME[e.kind])} today · ${clock(t)}</b>${e.verified ? '' : ' (date not verified)'}`);
    if (e.kind === 'fomc') lines.push(`Press conference ${clock(new Date(t.getTime() + 30 * 60000))} usually moves most.`);
    else lines.push('Big moves likely on forex, gold and US indices. Plan before it.');
  }
  if (!evs.length && wd !== 'Sat' && wd !== 'Sun') lines.push('', 'No NFP, CPI or Fed decision today (/next).');
  lines.push('', `Times follow New York, shown on the Calgary clock · ${FOOT}`);
  return { cmd: 'times', text: fit(lines) };
}

async function cmdNext(ctx: Ctx): Promise<Reply> {
  const evs = eventsOf(await ctx.load('events.json'));
  const lines = ['📅 <b>Next big US events</b> (Calgary time)', ''];
  for (const kind of ['nfp', 'cpi', 'fomc']) {
    const e = evs.filter(x => x.kind === kind).map(x => ({ ...x, t: zoned(x.date, x.et, NY) })).filter(x => x.t.getTime() > ctx.now.getTime() - 60 * 60000)
      .sort((a, b) => a.t.getTime() - b.t.getTime())[0];
    if (!e) { lines.push(`<b>${esc(KIND_NAME[kind])}</b>`, 'no date known yet', ''); continue; }
    const days = Math.round((Date.parse(`${isoDay(e.t)}T12:00:00Z`) - Date.parse(`${isoDay(ctx.now)}T12:00:00Z`)) / 86400000);
    const rel = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
    lines.push(`<b>${esc(KIND_NAME[kind])}</b>`, `${esc(day(e.t))} · ${clock(e.t)} · ${rel}${e.verified ? '' : ' · ⚠️ date not verified'}`, '');
  }
  lines.push('Dates from federalreserve.gov / bls.gov (cached by the reminders job).', FOOT);
  return { cmd: 'next', text: fit(lines) };
}

async function cmdHours(q: string, ctx: Ctx): Promise<Reply> {
  if (!q) return { cmd: 'hours', text: 'Send a symbol after it, e.g. <b>/hours XAUUSD</b> or <b>/hours NVDA</b>.' };
  const js = obj(await ctx.load('research/market_hours_by_symbol.json'));
  const rows = arr(js.symbols);
  if (!rows.length) return { cmd: 'hours', text: '⏳ <b>Market-hours study still running</b>\nThe per-symbol results are not published yet. Try again later.' };
  const k = norm(q), ks = normStock(q);
  const s = rows.find(r => String(r.s).toUpperCase() === k || String(r.s).toUpperCase() === ks || String(r.n ?? '').toUpperCase().replace(/_/g, '') === k);
  if (!s) {
    const sug = rows.map(r => String(r.s)).map(c => [lev(k, c.toUpperCase()), c] as const).filter(([d]) => d <= 2).sort((a, b) => a[0] - b[0]).slice(0, 4).map(x => x[1]);
    return { cmd: 'hours', text: `🕐 <b>${esc(q.toUpperCase())}</b> is not in the study` + (sug.length ? `\nDid you mean: ${sug.map(x => `/hours ${esc(x)}`).join(' · ')}` : '') };
  }
  const today = isoDay(ctx.now);
  const cal = (ny: string, mt: string) => (/^\d{2}:\d{2}$/.test(ny) ? clock(zoned(today, ny, NY)) : mt);
  const y = arr(s.y), w = arr(s.w), meta = obj(js.meta);
  const lines = [`🕐 <b>${esc(s.s)}</b> · best times (Calgary)`];
  arr(s.t).slice(0, 3).forEach((t, i) => {
    const a = num(t[4]), big = num(t[5]);
    lines.push(`${i + 1}. ${cal(t[1], t[0])}${t[1] ? ` (${esc(t[1])} New York)` : ''}${a != null ? ` · ${a.toFixed(1)}x normal activity` : ''}${big != null ? ` · big move ${big.toFixed(0)}% of days` : ''}`);
  });
  if (!arr(s.t).length) lines.push('No clear best time.');
  if (s.tr) lines.push(`Best times ${s.tr === 'reliable' ? 'hold up across the history' : 'are weak (they move around)'}`);
  if (w.length && w[0]) lines.push('', `Best day: ${esc(w[0])} · quietest: ${esc(w[1] ?? '')}${num(w[2]) != null ? ` · ${(w[2] as number).toFixed(2)}x` : ''}${w[5] === 'reliable' ? '' : ' (weak difference)'}`);
  const ev = (name: string, v: unknown) => { const a = arr(v); return num(a[0]) != null ? `${name} ${(a[0] as number).toFixed(1)}x a normal day` : ''; };
  const evl = [ev('NFP mornings', s.nfp), ev('Fed days', s.f1230 ?? s.f12)].filter(Boolean);
  if (evl.length) lines.push(esc(evl.join(' · ')));
  lines.push('', `Study ${esc(y[0] ?? '')} to ${esc(y[1] ?? '')}${meta.synthetic ? ' · SAMPLE DATA' : ''} · times follow New York · ${FOOT}`);
  return { cmd: 'hours', text: fit(lines), buttons: kb('Open Market hours', '/market-hours') };
}

async function cmdScan(q: string, ctx: Ctx): Promise<Reply> {
  if (q) return scanOne(q, ctx);
  if (!ctx.dispatch) return { cmd: 'scan', text: '🔒 <b>/scan needs a GitHub token (not set up yet)</b>\nThe scanners still run on their own schedule.' };
  const ok = await ctx.dispatch().catch(() => false);
  return { cmd: 'scan', text: ok ? '🔄 <b>Scan started</b>, results in ~2 min (FX first, stocks a bit later).\nThe usual Telegram alerts follow if anything is new.' : '⚠️ <b>Scan did not start</b>\nGitHub refused or is busy. Try again in a few minutes.' };
}

/** /scan SYM and [🔄 Live scan]: an on-demand scan of one symbol; the scanner itself sends the result card. */
async function scanOne(q: string, ctx: Ctx): Promise<Reply> {
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'scan', text: notFound(q, suggest).replace(/\/zones /g, '/scan ') };
  if (!ctx.scanOne) return { cmd: 'scan', text: `🔒 <b>/scan ${esc(hit.sym)} needs a GitHub token (not set up yet)</b>\nLive zones now: /zones ${esc(hit.sym)}`, toast: 'needs a GitHub token' };
  const r = await ctx.scanOne(hit.market, hit.sym).catch((): ScanResult => 'fail');
  if (r === 'limited') return { cmd: 'scan', text: `⏳ <b>On-demand scan limit reached</b> (6 an hour).\nTry again a bit later; live zones now: /zones ${esc(hit.sym)}`, toast: 'limit reached' };
  if (r === 'fail') return { cmd: 'scan', text: '⚠️ <b>Scan did not start</b>\nGitHub refused or is busy. Try again in a few minutes.', toast: 'did not start' };
  return { cmd: 'scan', text: `🔄 <b>Scanning ${esc(hit.sym)}…</b> ~1 min\nThe ${hit.market === 'fx' ? 'FX' : 'stock'} scanner sends the fresh result card here (on-demand scan, all its rules).`, toast: `scanning ${hit.sym}…` };
}

// ---- charts --------------------------------------------------------------------------------------------------------
const FX_TFS = ['MN', 'W1', 'D1', 'H4', 'H1'];
const STOCK_TFS = ['3M', 'MN', 'W1', 'D1'];
const ORDER = ['3M', 'MN', 'W1', 'D1', 'H4', 'H1', 'M15'];
export function parseTf(s: string): string | null {
  const t = (s || '').toUpperCase();
  const m: Record<string, string> = { H1: 'H1', '1H': 'H1', '60': 'H1', H4: 'H4', '4H': 'H4', D1: 'D1', D: 'D1', '1D': 'D1', W1: 'W1', W: 'W1', '1W': 'W1', MN: 'MN', M: 'MN', '1M': 'MN', MN1: 'MN', '3M': '3M', Q: 'Q', M15: 'M15', '15M': 'M15', '15': 'M15' };
  return m[t] ?? null;
}
/** [📊 4 timeframes] + one button per timeframe (single large view). */
/** The single-TF views of a market (FX + 15m with live OANDA data; stocks + 1H and 15m with live Alpaca data). */
const viewTfs = (market: 'fx' | 'stock', ctx?: Ctx) => (market === 'fx' ? (ctx?.live?.fx ? [...FX_TFS, 'M15'] : FX_TFS)
  : ctx?.live?.stock ? [...STOCK_TFS, 'H1', 'M15'] : STOCK_TFS);
export function chartButtons(sym: string, market: 'fx' | 'stock', ctx?: Ctx): Button[][] {
  const tfs = viewTfs(market, ctx);
  return [[{ text: `📊 Chart ${sym} (4 timeframes)`, callback_data: `c:${sym}` }], tfs.map(t => ({ text: tfLabel(t), callback_data: `c:${sym}:${t}` }))];
}
function photoButtons(sym: string, market: 'fx' | 'stock', view: string, ctx: Ctx): Button[][] {
  const tfs = viewTfs(market, ctx);
  const scan = [...scanButton(sym, ctx), ...newsButton(sym)];
  return [tfs.map(t => ({ text: t === view ? `• ${tfLabel(t)}` : tfLabel(t), callback_data: `c:${sym}:${t}` })),
    [{ text: view === 'Q' ? '• 4 views' : '🔲 4 views', callback_data: `c:${sym}:Q` }, { text: `🔎 Zones ${sym}`, callback_data: `z:${sym}` }, { text: '⏳ Near', callback_data: 'n' }],
    ...(scan.length ? [scan] : [])];
}

interface Zn { tf: string; side: 'demand' | 'supply'; prox: number; dist: number }
const overlaps = (a: Zn, b: Zn) => Math.max(Math.min(a.prox, a.dist), Math.min(b.prox, b.dist)) <= Math.min(Math.max(a.prox, a.dist), Math.max(b.prox, b.dist));
const zDist = (price: number, z: Zn) => placement(price, z.prox, z.dist).p;
const toBars = (rows: unknown): Bar[] => arr(rows).filter(r => Array.isArray(r) && r.length >= 5).map(r => ({ t: String(r[0]), o: +r[1], h: +r[2], l: +r[3], c: +r[4] }))
  .filter(b => [b.o, b.h, b.l, b.c].every(Number.isFinite));
/** Packed bars {t0: 'YYYY-MM-DD', dt: [day offsets], b: [[o, h, l, c]]} (stock shards: bars, hb.W1 / hb.MN / hb['3M']). */
export function packedBars(pb: unknown): Bar[] {
  const p = obj(pb);
  if (typeof p.t0 !== 'string') return [];
  const d0 = Date.parse(`${p.t0}T00:00:00Z`);
  if (!Number.isFinite(d0)) return [];
  return arr(p.b).filter(r => Array.isArray(r) && r.length >= 4)
    .map((r, i) => ({ t: new Date(d0 + (num(arr(p.dt)[i]) ?? i) * 86400000).toISOString().slice(0, 10), o: +r[0], h: +r[1], l: +r[2], c: +r[3] }))
    .filter(x => [x.o, x.h, x.l, x.c].every(Number.isFinite));
}
/** Real higher-TF bars, plus the derived bars of any later (current) period they do not cover; the derived ones alone
 *  when there are no real bars. */
export function withRecent(real: Bar[], derived: Bar[], key: (t: string) => string): Bar[] {
  if (!real.length) return derived;
  const last = key(real[real.length - 1].t);
  return [...real, ...derived.filter(b => key(b.t) > last)];
}
function zoneList(rows: unknown[]): Zn[] {
  const out: Zn[] = [], seen = new Set<string>();
  for (const r of rows as J[]) {
    const prox = num(r?.proximal ?? r?.prox), dist = num(r?.distal ?? r?.dist);
    if (prox == null || dist == null || (r.side !== 'demand' && r.side !== 'supply') || typeof r.tf !== 'string') continue;
    const k = `${r.tf}:${r.side}:${prox}`;
    if (!seen.has(k)) { seen.add(k); out.push({ tf: r.tf, side: r.side, prox, dist }); }
  }
  return out;
}

/** Trendline inputs of a chart: per TF whether its last bar is still forming (TFs absent = no lines), and the next
 *  higher TF whose lines each panel also draws (gold dots); pub = the scanner's published lines per TF ('tls': used
 *  for a TF whose chart bars are too few for the scanners' lookback, i.e. the published shards, never live candles). */
export interface TlSrc { forming: Record<string, boolean>; htf: Record<string, string | null>; pub?: Record<string, unknown> }
const pubLines = (v: unknown): PubLine[] | undefined => (Array.isArray(v) ? (v as J[]).filter(t => num(t?.p) != null && num(t?.s) != null && num(t?.n) != null && typeof t?.t === 'string')
  .map(t => ({ dir: t.dir > 0 ? 1 : -1, p: t.p, s: t.s, n: t.n, t: t.t, touches: num(t.touches) ?? 0, x: !!t.x })) : undefined);
const FX_HTF: Record<string, string | null> = { M15: 'H1', H1: 'H4', H4: 'D1', D1: 'W1', W1: 'MN', MN: '3M' };
const STOCK_HTF: Record<string, string | null> = { M15: 'H1', H1: 'D1', D1: 'W1', W1: 'MN', MN: '3M', '3M': null };
/** A stock bar built from daily bars is still forming unless its period ended with the newest daily bar. */
const periodOpen = (bars: Bar[], key: (t: string) => string, lastDay: string | undefined) =>
  !!bars.length && !!lastDay && key(bars[bars.length - 1].t) === key(lastDay) && key(nextBusinessDay(lastDay)) === key(lastDay);

export interface ChartData { model: ChartModel; v: string; market: 'fx' | 'stock'; sym: string; view: string; when: string; live?: boolean; note?: string }
const zb = (b: ZBar): Bar => ({ t: b.d, o: b.o, h: b.h, l: b.l, c: b.c });
/** Closed candles (the last 250: the trendlines' 200-bar lookback, like the scanners) + the forming one, as chart bars. */
const withForming = (closed: ZBar[], forming: ZBar | null): Bar[] => [...closed.slice(-250), ...(forming ? [forming] : [])].map(zb);
/** The image version of a live chart: a new one every 30 s (Telegram caches photo URLs). */
const liveVersion = (lv: LiveView) => `L${Math.floor(lv.at / 30000)}`;

/** Panels for the given timeframes: key zone per TF (nearest), the host of the next-lower key zone outlined, trade
 *  lines on the entry TF, higher-TF zones lighter in the single view. */
export function buildPanels(tfs: string[], bars: Record<string, Bar[]>, zones: Zn[], price: number, digits: number,
  sig: { tf: string; entry?: number; stop?: number; target?: number; kind?: string } | null, layout: 'quad' | 'single', zoneTfOf: (tf: string) => string = t => t,
  tl?: TlSrc): Panel[] {
  const fmt = (v: number) => v.toFixed(digits);
  const keys = tfs.map(tf => zones.filter(z => z.tf === zoneTfOf(tf)).sort((a, b) => zDist(price, a) - zDist(price, b))[0] ?? null);
  return tfs.map((tf, i) => {
    const ztf = zoneTfOf(tf);
    const own = zones.filter(z => z.tf === ztf).sort((a, b) => zDist(price, a) - zDist(price, b)).slice(0, layout === 'quad' ? 6 : 8);
    const key = keys[i], lowerKey = keys[i + 1];
    const host = lowerKey && zoneTfOf(tfs[i + 1]) !== ztf ? own.find(z => z.side === lowerKey.side && overlaps(z, lowerKey)) ?? null : null;
    const bands: Band[] = own.map(z => ({ ...z, key: z === key, host: z === host, light: ztf !== tf,
      label: layout === 'single' ? `${tfLabel(z.tf)} ${z.side} ${fmt(z.prox)}–${fmt(z.dist)}` : undefined }));
    if (layout === 'single') {   // the higher TF's zones for context, lighter; the one hosting this TF's key zone outlined
      const hi = ORDER[ORDER.indexOf(ztf) - 1];
      const up = hi ? zones.filter(z => z.tf === hi).sort((a, b) => zDist(price, a) - zDist(price, b)).slice(0, 4) : [];
      const h = key ? up.find(z => z.side === key.side && overlaps(z, key)) : undefined;
      bands.unshift(...up.map(z => ({ ...z, light: true, host: z === h, label: `${tfLabel(z.tf)} ${z.side} ${fmt(z.prox)}–${fmt(z.dist)}` })));
    }
    const header = key ? `${ztf !== tf ? `${tfLabel(ztf)} ` : ''}${key.side} ${fmt(key.prox)}–${fmt(key.dist)} · ${zoneStatus(placement(price, key.prox, key.dist), key.side, '')}` : 'no zone in view';
    const lines = sig && sig.tf === tf ? { entry: sig.entry, stop: sig.stop, target: sig.target, kind: sig.kind } : null;
    const shown = (bars[tf] ?? []).slice(layout === 'quad' ? -60 : -90);
    const ser = (t: string): TlSeries | null => (tl && tl.forming[t] != null && bars[t]?.length ? { tf: t, bars: bars[t], forming: tl.forming[t], pub: pubLines(tl.pub?.[t]) } : null);
    const mine = ser(tf), up = tl?.htf[tf], hs = up ? ser(up) : null;
    let tls: TLine[] = [];
    try { tls = mine ? panelTrendlines(mine, shown.length, price, hs, 2) : []; } catch (e) { console.log(JSON.stringify({ ev: 'tl_error', tf, err: String((e as Error)?.message ?? e).slice(0, 60) })); }
    return { tf, header, bars: shown, zones: bands, lines, tls,
      note: ztf !== tf ? `no ${tfLabel(tf)} zones: ${tfLabel(ztf)} zones shown` : undefined };
  });
}

export async function chartData(q: string, view: string, ctx: Ctx): Promise<ChartData | null> {
  const { hit } = await resolve(q, ctx);
  if (!hit) return null;
  if (hit.market === 'fx') {
    const fx = obj(await ctx.load('fx/latest.json'));
    const d = obj(obj(obj(await ctx.load(`fx/d/${hit.row.k ?? hit.row.cls}.json`)).instruments)[hit.sym]);
    const lv = await liveFor(hit, ctx, digitsOf(d.digits != null ? d : hit.row));
    const price = lv?.price ?? num(d.price);
    if (!price) return null;
    const b = obj(d.bars), bars: Record<string, Bar[]> = {};
    const forming: Record<string, boolean> = {};
    if (lv?.fx) {   // live: the closed candles + the one forming now
      for (const t of [...FX_TFS, 'M15']) { bars[t] = withForming(lv.fx.closed[t] ?? [], lv.fx.forming[t] ?? null); forming[t] = !!lv.fx.forming[t]; }
    } else {
      for (const t of ['H1', 'H4', 'D1', 'W1']) { bars[t] = toBars(b[t]); forming[t] = false; }
      const mn = toBars(b.MN);
      bars.MN = withRecent(mn, aggregate(bars.W1, monthKey), monthKey);   // real closed months + the current one
      forming.MN = bars.MN.length > mn.length;
    }
    bars['3M'] = aggregate(bars.MN, quarterKey);   // only for the MN panel's higher-TF trendlines
    const lastMn = bars.MN[bars.MN.length - 1]?.t ?? '';
    forming['3M'] = forming.MN || Number(lastMn.slice(5, 7)) % 3 !== 0;
    const digits0 = digitsOf(d.digits != null ? d : hit.row);
    // the 15m view (live only): its own zones on the 15m candles, the scanners' filters (zonecore.tfZonesOf)
    const m15 = view === 'M15' && lv?.fx?.closed.M15?.length ? tfZonesOf(lv.fx.closed.M15, 'M15', digits0, price) : [];
    const zones = lv ? zoneList([...lv.zones, ...m15]) : zoneList([...arr(d.zones), ...arr(d.hits)]);
    const s = fxSetups(fx).find(x => x.sym === hit.sym);
    const near = arr(d.hits).filter(h => h.section !== 'left').sort((a, z) => (num(a.pips) ?? 1e9) - (num(z.pips) ?? 1e9))[0];
    const rel = s?.tf ?? near?.tf ?? null;
    const tfs = view !== 'Q' ? [view] : (rel === 'H1' || rel === 'H4') && bars.H1.length ? ['W1', 'D1', 'H4', 'H1'] : ['MN', 'W1', 'D1', 'H4'];
    if (!tfs.every(t => FX_TFS.includes(t) || (t === 'M15' && bars.M15?.length))) return null;   // 15m: live candles only
    const digits = digitsOf(d.digits != null ? d : hit.row), layout = view === 'Q' ? 'quad' : 'single';
    const sig = s ? { tf: s.tf, entry: num(s.entry) ?? undefined, stop: num(s.stop) ?? undefined, target: num(s.target) ?? undefined, kind: s.kind } : null;
    const t = parseUtc(fx.h1_close_utc ?? fx.generated);
    const when = lv ? liveAt(lv) : t ? clock(t) : '';
    return { market: 'fx', sym: hit.sym, view, v: lv ? liveVersion(lv) : String(fx.generated ?? '').replace(/[^0-9]/g, '').slice(0, 14), when, live: !!lv, note: liveNote(hit, ctx, lv),
      model: { sym: hit.sym, digits, price, layout, title: `${hit.sym} · ${price.toFixed(digits)}${when ? ` · ${when}` : ''}`, panels: buildPanels(tfs, bars, zones, price, digits, sig, layout, t => t, { forming, htf: FX_HTF, pub: lv ? undefined : obj(d.tls) }) } };
  }
  const [sh, st] = [obj(await ctx.load(`scanner/t/${hit.row.k}.json`)), obj(await ctx.load('scanner/latest.json'))];
  const d = obj(obj(sh.tickers)[hit.sym]);
  const lv = await liveFor(hit, ctx, 2);
  const price = lv?.price ?? num(d.price), pb = obj(d.bars);
  if (!price || (!pb.t0 && !lv)) return null;
  let bars: Record<string, Bar[]>, forming: Record<string, boolean>;
  if (lv?.st) {   // live: every session since 2016 + today's forming one; W1 / MN / 3M built from them; 1H from IEX
    const part = lv.st.partial ? { ...lv.st.partial, h: Math.max(lv.st.partial.h, price), l: Math.min(lv.st.partial.l, price), c: price } : null;
    const all = [...lv.st.daily, ...(part ? [part] : [])].map(zb);
    bars = { D1: all, W1: aggregate(all, weekKey), MN: aggregate(all, monthKey), '3M': aggregate(all, quarterKey), H1: lv.st.h1.map(zb), M15: (lv.st.m15 ?? []).map(zb) };
    const lastDay = lv.st.daily[lv.st.daily.length - 1]?.d;
    forming = { D1: !!part, H1: true, M15: true };
    for (const [t, key] of [['W1', weekKey], ['MN', monthKey], ['3M', quarterKey]] as const) forming[t] = !!part || periodOpen(bars[t], key, lastDay);
  } else {
    const daily = packedBars(pb), hb = obj(d.hb);
    // Real higher-TF bars (hb, only for listed / signalled / watched tickers) when published; else rebuilt from D1.
    const higher = (tf: string, key: (t: string) => string) => withRecent(packedBars(hb[tf]), aggregate(daily, key), key);
    bars = { D1: daily, W1: higher('W1', weekKey), MN: higher('MN', monthKey), '3M': higher('3M', quarterKey) };
    const lastDay = daily[daily.length - 1]?.t;
    forming = { D1: false, W1: periodOpen(bars.W1, weekKey, lastDay), MN: periodOpen(bars.MN, monthKey, lastDay), '3M': periodOpen(bars['3M'], quarterKey, lastDay) };
  }
  const tfs = view === 'Q' ? STOCK_TFS : [view];
  if (!tfs.every(t => viewTfs('stock', ctx).includes(t)) || ((view === 'H1' || view === 'M15') && !bars[view]?.length)) return null;
  const s = stockSetups(st).find(x => x.symbol === hit.sym);
  const sig = s ? { tf: s.tf, entry: num(s.entry) ?? undefined, stop: num(s.stop) ?? undefined, target: num(s.target) ?? undefined, kind: s.kind } : null;
  const layout = view === 'Q' ? 'quad' : 'single';
  const when = lv ? liveAt(lv) : d.date ? `${dayOfIso(String(d.date))} close` : '';
  return { market: 'stock', sym: hit.sym, view, v: lv ? liveVersion(lv) : String(st.generated_at ?? '').replace(/[^0-9]/g, '').slice(0, 14), when, live: !!lv, note: liveNote(hit, ctx, lv),
    model: { sym: hit.sym, digits: 2, price, layout, title: `${hit.sym} · ${price.toFixed(2)}${when ? ` · ${when}` : ''}`,
      panels: buildPanels(tfs, bars, zoneList(lv ? lv.zones : arr(d.zones)), price, 2, sig, layout, t => (t === 'D1' || t === 'H1' || t === 'M15' ? 'W1' : t), { forming, htf: STOCK_HTF, pub: lv ? undefined : obj(d.tls) }) } };
}

async function cmdChart(q: string, tfArg: string, ctx: Ctx): Promise<Reply> {
  if (!q) return { cmd: 'chart', text: 'Send a symbol after it, e.g. <b>/chart EURUSD</b> (4 timeframes) or <b>/chart EURUSD H4</b>.' };
  const view = tfArg ? parseTf(tfArg) : 'Q';
  if (!view) return { cmd: 'chart', text: `Unknown timeframe <b>${esc(tfArg)}</b>. Use MN, W1, D1, 4H, 1H${ctx.live?.fx ? ' or 15m' : ''} (stocks: 3M, MN, W1, D1${ctx.live?.stock ? ', 1H, 15m' : ''}).` };
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'chart', text: notFound(q, suggest).replace(/\/zones /g, '/chart ') };
  if (!ctx.imageUrl) return { cmd: 'chart', text: 'Charts are not available right now.' };
  let cd = await chartData(hit.sym, view, ctx);
  if (!cd && view !== 'Q') {
    cd = await chartData(hit.sym, 'Q', ctx);
    // 15m exists only on live candles: say why the 4 views came instead
    if (cd && view === 'M15') cd = { ...cd, note: `15m needs live candles ${cd.note || (hit.market === 'fx' ? (ctx.live?.fx ? LIVE_DOWN : LIVE_HINT) : (ctx.live?.stock ? LIVE_DOWN : LIVE_HINT))}`.trim() };
  }
  if (!cd) return { cmd: 'chart', text: `🔎 <b>${esc(hit.sym)}</b>\nNo chart data published for ${esc(view === 'Q' ? 'it' : tfLabel(view))} yet.` };
  const tfs = cd.model.panels.map(p => tfLabel(p.tf)).join(' ');
  const caption = `<b>${esc(cd.sym)}</b> · ${esc(cd.view === 'Q' ? `${tfs} (top-down)` : tfs)}${cd.when ? ` · ${esc(cd.when)}` : ''}\n`
    + `${cd.live ? 'zones + price live · signals from the last scan · ' : ''}${cd.market === 'fx' ? 'check levels on Pepperstone · ' : ''}${FOOT}${cd.note ? `\n${cd.note}` : ''}`;
  return withLatest(cd.sym, ctx, Promise.resolve({ cmd: 'chart', text: caption, photo: ctx.imageUrl(cd.sym, cd.view, cd.v), buttons: photoButtons(cd.sym, cd.market, cd.view, ctx) }));
}

const CB_CMDS: Record<string, string> = { n: '/near', f: '/fx', s: '/stocks', g: '/signals', t: '/times', x: '/next', h: '/help' };
/** A tapped inline button (callback_query.data): 'z:SYM' zones, 'c:SYM' 4-view chart, 'c:SYM:TF' one TF, short codes. */
export async function handleCallback(data: string, ctx: Ctx): Promise<Reply> {
  const m = /^([zcs]):([A-Za-z0-9._-]{1,20})(?::([A-Za-z0-9]{1,3}))?$/.exec(data ?? '');
  const nw = /^n:([A-Za-z0-9._-]{1,20})$/.exec(data ?? '');
  if (nw) return symbolNews(nw[1], ctx, FOOT);
  if (m && m[1] === 'z') return cmdZones(m[2], ctx);
  if (m && m[1] === 's' && !m[3]) return scanOne(m[2], ctx);
  if (m && m[1] === 'c') return { ...(await cmdChart(m[2], m[3] ?? '', ctx)), edit: !!m[3] };
  const fd = /^f:([A-Za-z0-9._-]{1,20})$/.exec(data ?? '');
  if (fd) return cmdFund(fd[1], ctx);
  if (CB_CMDS[data]) return handle(CB_CMDS[data], ctx);
  const tap = parseTap(data ?? '');
  if (tap) return prefsTap(tap, ctx);
  return { cmd: 'callback?', text: HINT };
}

// ---- preferences: alerts, mutes, quiet hours, watchlist (prefs.ts) ------------------------------------------------
const NO_PREFS = '⚠️ <b>Alerts are not available right now</b>\nThe settings database did not answer. Try again in a minute.';
/** [🔕 Mute 1w] [⏰ 0.2%] under a symbol card (only with a database). */
export function prefsButtons(sym: string, ctx: Ctx): Button[][] {
  if (!ctx.prefs || !cbOk(`m:${sym}:7`) || !cbOk(`r:${sym}:0.2`)) return [];
  return [[{ text: '🔕 Mute 1w', callback_data: `m:${sym}:7` }, { text: '⏰ 0.2%', callback_data: `r:${sym}:0.2` }]];
}
interface Quote { hit: Resolved; price: number | null; digits: number; zones: Zn[] }
/** A symbol's canonical name, current price and strong zones (FX: not the 3M context zones). */
async function quote(q: string, ctx: Ctx): Promise<{ quote: Quote | null; suggest: string[] }> {
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { quote: null, suggest };
  if (hit.market === 'fx') {
    const d = obj(obj(obj(await ctx.load(`fx/d/${hit.row.k ?? hit.row.cls}.json`)).instruments)[hit.sym]);
    return { quote: { hit, price: num(d.price) ?? num(hit.row.px), digits: digitsOf(d.digits != null ? d : hit.row), zones: zoneList(arr(d.zones)).filter(z => z.tf !== '3M') }, suggest };
  }
  const d = obj(obj(obj(await ctx.load(`scanner/t/${hit.row.k}.json`)).tickers)[hit.sym]);
  return { quote: { hit, price: num(d.price) ?? num(hit.row.px), digits: 2, zones: zoneList(arr(d.zones)) }, suggest };
}
const fmtLevel = (v: number, q: Quote) => (q.hit.market === 'fx' ? px(v, q.digits) : stockPx(v));
const untilText = (iso: string | Date) => { const t = new Date(iso); return `${day(t)} · ${clock(t)}`; };
function alertLine(a: Alert): string {
  if (a.kind === 'price') return `#${a.id} <b>${esc(a.sym)}</b> ${a.dir === 'above' ? '↑ above' : '↓ below'} ${esc(String(a.level))}`;
  if (a.kind === 'zone') return `#${a.id} <b>${esc(a.sym)}</b> · enters a strong zone`;
  return `#${a.id} <b>${esc(a.sym)}</b> · within ${esc(String(a.pct))}% of the nearest zone${a.level != null ? ` (${esc(String(a.level))})` : ''}`;
}

async function withPrefs(cmd: string, ctx: Ctx, f: (p: PrefsStore) => Promise<Reply>): Promise<Reply> {
  if (!ctx.prefs) return { cmd, text: NO_PREFS };
  try { return await f(ctx.prefs); } catch { return { cmd, text: NO_PREFS }; }
}
const unknownSym = (cmd: string, q: string, sug: string[]): Reply => ({ cmd, text: notFound(q, sug).replace(/\/zones /g, `/${cmd} `) });

async function cmdAlert(a1: string, a2: string, ctx: Ctx): Promise<Reply> {
  if (!a1 || !a2) return { cmd: 'alert', text: 'Send a symbol and a price, e.g. <b>/alert XAUUSD 2650</b>, or <b>/alert NVDA zone</b> (price enters any strong zone). /alerts lists them.' };
  return withPrefs('alert', ctx, async p => {
    const { quote: q, suggest } = await quote(a1, ctx);
    if (!q) return unknownSym('alert', a1, suggest);
    const cur = await p.get(ctx.now);
    if (cur.alerts.length >= MAX_ALERTS) return { cmd: 'alert', text: `You have ${cur.alerts.length} alerts, the most allowed. Delete some in /alerts first.` };
    const sym = q.hit.sym;
    if (/^zones?$/i.test(a2)) {
      const dup = cur.alerts.find(a => a.sym === sym && a.kind === 'zone');
      if (dup) return { cmd: 'alert', text: `⏰ Already set: ${alertLine(dup)}` };
      const id = await p.addAlert({ sym, kind: 'zone' });
      return { cmd: 'alert', text: [`⏰ <b>Alert #${id} set</b>`, `<b>${esc(sym)}</b>: when price enters any strong zone (any timeframe).`, `${q.zones.length} zones located now · checked on every scan · one-shot`].join('\n') };
    }
    const level = parsePrice(a2);
    if (level == null) return { cmd: 'alert', text: `<b>${esc(a2)}</b> is not a price. E.g. <b>/alert ${esc(sym)} ${q.price != null ? esc(fmtLevel(q.price, q).replace(/,/g, '')) : '1.2345'}</b> or <b>/alert ${esc(sym)} zone</b>.` };
    if (q.price == null) return { cmd: 'alert', text: `No current price published for <b>${esc(sym)}</b>, so the direction is unknown. Try again after the next scan.` };
    if (Math.abs(level - q.price) / q.price > 0.5) return { cmd: 'alert', text: `<b>${esc(fmtLevel(level, q))}</b> is more than 50% from the price (${esc(fmtLevel(q.price, q))}). Check the number.` };
    if (level === q.price) return { cmd: 'alert', text: `Price is at ${esc(fmtLevel(level, q))} already.` };
    const dir = level > q.price ? 'above' : 'below';
    const id = await p.addAlert({ sym, kind: 'price', level, dir });
    return { cmd: 'alert', text: [`⏰ <b>Alert #${id} set</b>`, `<b>${esc(sym)}</b> ${dir === 'above' ? '↑ above' : '↓ below'} ${esc(fmtLevel(level, q))}`,
      `now ${esc(fmtLevel(q.price, q))} · ${esc(shortPct(Math.abs(level - q.price) / q.price * 100))} away · checked on every scan · one-shot`].join('\n') };
  });
}

async function cmdAlerts(ctx: Ctx, edit = false): Promise<Reply> {
  return withPrefs('alerts', ctx, async p => {
    const pr: Prefs = await p.get(ctx.now);
    const lines = [`⏰ <b>Alerts · ${pr.alerts.length}</b>`];
    lines.push(...(pr.alerts.length ? pr.alerts.map(alertLine) : ['none set (/alert XAUUSD 2650, /alert NVDA zone)']));
    lines.push('', `🔕 <b>Muted · ${pr.mutes.length}</b>`);
    lines.push(...(pr.mutes.length ? pr.mutes.map(m => `<b>${esc(m.sym)}</b> until ${esc(untilText(m.until_utc))}`) : ['nothing muted (/mute EURUSD 1w)']));
    lines.push('', `🌙 <b>Quiet hours</b> · ${pr.quiet ? `${esc(pr.quiet.from)}–${esc(pr.quiet.to)} Calgary (/quiet off)` : 'off (/quiet 22:00-06:00)'}`);
    lines.push('', `👀 <b>Extra watchlist · ${pr.watch.length}</b>`, pr.watch.length ? esc(pr.watch.join(' · ')) : 'empty (/watch AUDNZD)');
    lines.push('', `The scanners check these on every run · ${FOOT}`);
    const buttons: Button[][] = [];
    const del = pr.alerts.slice(0, 20).map(a => ({ text: `🗑 #${a.id} ${a.sym}`, callback_data: `d:${a.id}` }));
    for (let i = 0; i < del.length; i += 3) buttons.push(del.slice(i, i + 3));
    const um = pr.mutes.slice(0, 6).filter(m => cbOk(`u:${m.sym}`)).map(m => ({ text: `🔔 ${m.sym}`, callback_data: `u:${m.sym}` }));
    for (let i = 0; i < um.length; i += 3) buttons.push(um.slice(i, i + 3));
    return { cmd: 'alerts', text: fit(lines), buttons, edit };
  });
}

async function cmdUnalert(a: string, ctx: Ctx): Promise<Reply> {
  const id = Number(a.replace(/^#/, ''));
  if (!a || !Number.isInteger(id) || id <= 0) return { cmd: 'unalert', text: 'Send the alert number, e.g. <b>/unalert 12</b> (numbers in /alerts).' };
  return withPrefs('unalert', ctx, async p => ({ cmd: 'unalert', text: (await p.delAlert(id)) ? `🗑 Alert #${id} deleted.` : `No open alert #${id} (/alerts).` }));
}

async function doMute(q: string, ms: number, ctx: Ctx, p: PrefsStore): Promise<Reply> {
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return unknownSym('mute', q, suggest);
  const until = new Date(ctx.now.getTime() + ms);
  await p.mute(hit.sym, until, ctx.now);
  return { cmd: 'mute', text: `🔕 <b>${esc(hit.sym)}</b> muted until ${esc(untilText(until))} (Calgary).\nNo scanner alerts for it until then · /unmute ${esc(hit.sym)}`, toast: `${hit.sym} muted` };
}
async function cmdMute(a1: string, a2: string, ctx: Ctx): Promise<Reply> {
  if (!a1) return { cmd: 'mute', text: 'Send a symbol, e.g. <b>/mute EURUSD 1w</b> (1d by default; 12h, 3d, 2w work too).' };
  const ms = parseDuration(a2);
  if (ms == null) return { cmd: 'mute', text: `<b>${esc(a2)}</b> is not a duration. Use 1d, 1w, 12h (up to 90d).` };
  return withPrefs('mute', ctx, p => doMute(a1, ms, ctx, p));
}
async function cmdUnmute(a: string, ctx: Ctx): Promise<Reply> {
  if (!a) return { cmd: 'unmute', text: 'Send a symbol, e.g. <b>/unmute EURUSD</b>.' };
  return withPrefs('unmute', ctx, async p => {
    const { hit } = await resolve(a, ctx);
    const sym = hit?.sym ?? a.toUpperCase();
    return { cmd: 'unmute', text: (await p.unmute(sym)) ? `🔔 <b>${esc(sym)}</b> unmuted.` : `<b>${esc(sym)}</b> was not muted.`, toast: `${sym} unmuted` };
  });
}
async function cmdQuiet(a: string, ctx: Ctx): Promise<Reply> {
  return withPrefs('quiet', ctx, async p => {
    if (!a) {
      const q = (await p.get(ctx.now)).quiet;
      return { cmd: 'quiet', text: q ? `🌙 Quiet hours ${esc(q.from)}–${esc(q.to)} Calgary. /quiet off to stop.` : '🌙 Quiet hours are off. Set them with <b>/quiet 22:00-06:00</b> (Calgary clock).' };
    }
    const q = parseQuiet(a);
    if (q === undefined) return { cmd: 'quiet', text: 'Use <b>/quiet 22:00-06:00</b> (Calgary clock) or <b>/quiet off</b>.' };
    await p.setQuiet(q);
    return { cmd: 'quiet', text: q ? `🌙 <b>Quiet hours ${esc(q.from)}–${esc(q.to)}</b> (Calgary)\nScanner alerts in that window come silently. /quiet off to stop.` : '🌙 Quiet hours off.' };
  });
}
async function cmdWatch(a: string, ctx: Ctx): Promise<Reply> {
  return withPrefs('watch', ctx, async p => {
    const cur = (await p.get(ctx.now)).watch;
    if (!a) return { cmd: 'watch', text: `👀 <b>Extra watchlist · ${cur.length}</b>\n${cur.length ? esc(cur.join(' · ')) : 'empty'}\nAdd: <b>/watch AUDNZD</b> · remove: /unwatch` };
    const { hit, suggest } = await resolve(a, ctx);
    if (!hit) return unknownSym('watch', a, suggest);
    if (cur.includes(hit.sym)) return { cmd: 'watch', text: `👀 <b>${esc(hit.sym)}</b> is on the watchlist already.` };
    if (cur.length >= MAX_WATCH) return { cmd: 'watch', text: `The extra watchlist is full (${cur.length}). /unwatch some first.` };
    await p.watch(hit.sym);
    return { cmd: 'watch', text: `👀 <b>${esc(hit.sym)}</b> added to the watchlist (${cur.length + 1}). The scanners report it like a watchlist symbol.` };
  });
}
async function cmdUnwatch(a: string, ctx: Ctx): Promise<Reply> {
  if (!a) return { cmd: 'unwatch', text: 'Send a symbol, e.g. <b>/unwatch AUDNZD</b>.' };
  return withPrefs('unwatch', ctx, async p => {
    const { hit } = await resolve(a, ctx);
    const sym = hit?.sym ?? a.toUpperCase();
    return { cmd: 'unwatch', text: (await p.unwatch(sym)) ? `👀 <b>${esc(sym)}</b> removed from the watchlist.` : `<b>${esc(sym)}</b> is not on the extra watchlist.` };
  });
}

/** A tapped prefs button (prefs.ts parseTap). */
async function prefsTap(t: NonNullable<ReturnType<typeof parseTap>>, ctx: Ctx): Promise<Reply> {
  if (t.op === 'mute') return withPrefs('mute', ctx, p => doMute(t.sym, t.days * 86400000, ctx, p));
  if (t.op === 'unmute') return { ...(await cmdUnmute(t.sym, ctx)), cmd: 'unmute' };
  if (t.op === 'del') {
    return withPrefs('unalert', ctx, async p => {
      const ok = await p.delAlert(t.id);
      return { ...(await cmdAlerts(ctx, true)), cmd: 'unalert', toast: ok ? `Alert #${t.id} deleted` : `Alert #${t.id} was already gone` };
    });
  }
  return withPrefs('alert', ctx, async p => {
    const { quote: q } = await quote(t.sym, ctx);
    if (!q) return { cmd: 'alert', text: notFound(t.sym, []) };
    const near = q.price != null ? q.zones.slice().sort((a, b) => zDist(q.price as number, a) - zDist(q.price as number, b))[0] : undefined;
    const cur = await p.get(ctx.now);
    const dup = cur.alerts.find(a => a.sym === q.hit.sym && a.kind === 'pct' && a.pct === t.pct);
    if (dup) return { cmd: 'alert', text: `⏰ Already set: ${alertLine(dup)}`, toast: 'Already set' };
    if (cur.alerts.length >= MAX_ALERTS) return { cmd: 'alert', text: `You have ${cur.alerts.length} alerts, the most allowed. Delete some in /alerts first.` };
    const id = await p.addAlert({ sym: q.hit.sym, kind: 'pct', pct: t.pct, ...(near ? { level: near.prox } : {}) });
    const where = near ? `nearest zone now: ${tf(near.tf)} ${near.side} ${fmtLevel(near.prox, q)}–${fmtLevel(near.dist, q)}${q.price != null ? ` (${shortPct(zDist(q.price, near))} away)` : ''}` : 'no zone located right now';
    return { cmd: 'alert', text: [`⏰ <b>Alert #${id} set</b>`, `<b>${esc(q.hit.sym)}</b>: price within ${esc(String(t.pct))}% of the nearest strong zone's proximal line.`, esc(where), 'checked on every scan · one-shot · /alerts'].join('\n'), toast: `Alert #${id} set` };
  });
}

// ---- /news (TradingView economic calendar, loaded as 'news.json' = yesterday .. +2 days; formatting in news.ts) ----
async function cmdNews(arg: string, ctx: Ctx): Promise<Reply> {
  if (arg) return symbolNews(arg, ctx, FOOT);   // /news SYM: that symbol's headlines (news.ts + headlines.ts)
  const [cal, evs, top] = await Promise.all([ctx.load('news.json'), ctx.load('events.json'), loadHeadlines(ctx, 'headlines/top')]);
  const key = eventsOf(evs).filter(e => e.verified).map(e => ({ name: KIND_NAME[e.kind], t: zoned(e.date, e.et, NY), verified: e.verified }));
  return { cmd: 'news', text: fit(withTopHeadlines(newsText(cal, key, ctx.now, FOOT), top, ctx.now)) };
}

// ---- /ask (lesson passages, BM25) ----------------------------------------------------------------------------------
let askIx: { src: unknown; ix: AskIndex | null } | null = null;
function trimQuote(t: string, n: number): string {
  const s = t.replace(/\s+/g, ' ').trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), n - 20))}…`;
}
async function cmdAsk(q: string, ctx: Ctx): Promise<Reply> {
  const question = q.trim().slice(0, 300);
  if (!question) return { cmd: 'ask', text: 'Ask after it, e.g. <b>/ask what is a proximal line</b>, or end any message with <b>?</b>' };
  const js = await ctx.load('ask/passages.json');
  if (!askIx || askIx.src !== js) askIx = { src: js, ix: buildIndex(js) };
  const ix = askIx.ix;
  if (!ix) return { cmd: 'ask', text: '⚠️ <b>Lessons unavailable</b>\nThe lesson passages did not load. Try again in a minute.' };
  const hits = askSearch(ix, question, 3);
  if (!hits.length) return { cmd: 'ask', text: `💬 <b>${esc(trimQuote(question, 120))}</b>\nNothing in the lessons matches those words. Try other words, the Ask page, or /help for the commands.`, buttons: kb('Open Ask', '/ask') };
  for (const qlen of [300, 230, 170, 120]) {
    const lines = [`💬 <b>${esc(trimQuote(question, 120))}</b>`, 'From the lessons, in their own words:'];
    hits.forEach((h, i) => {
      const title = h.lesson.src === 'glossary' ? 'Glossary' : `${mentorOf(h.lesson.src)} · ${h.lesson.n}. ${h.lesson.title}`;
      lines.push('', `<b>${i + 1}. ${esc(title)}</b>`, `<i>“${esc(bestQuote(h.p.t, question, qlen))}”</i>`);
    });
    lines.push('', FOOT);
    const text = lines.join('\n');
    if (text.length <= 1500 || qlen === 120) {
      return { cmd: 'ask', text: text.slice(0, 1500), buttons: hits.map(h => [{ text: `📖 Open ${h.lesson.src === 'glossary' ? 'glossary' : `${h.lesson.n}. ${trimQuote(h.lesson.title, 34)}`}`, url: `${APP}${lessonPath(h.lesson.src, h.lesson.n)}` }]) };
    }
  }
  return { cmd: 'ask', text: HINT };
}

// ---- dispatch ------------------------------------------------------------------------------------------------------
export function parseCommand(text: string): { cmd: string; arg: string; arg2: string; rest: string } | null {
  const m = /^\/([A-Za-z_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/.exec(text.trim());
  if (!m) return null;
  const a = (m[2] ?? '').trim().split(/\s+/);
  return { cmd: m[1].toLowerCase(), arg: a[0] ?? '', arg2: a[1] ?? '', rest: (m[2] ?? '').trim() };
}
const SYMBOLISH = /^[A-Za-z][A-Za-z0-9.\/_:-]{0,14}$/;
const HINT = 'Not sure what that means. Send /help for the list, or just a symbol like <b>EURUSD</b> or <b>NVDA</b>.';

export async function handle(text: string, ctx: Ctx): Promise<Reply> {
  const t = (text ?? '').trim();
  const quick = QUICK_MAP.get(t.toLowerCase());
  const c = quick ? { cmd: quick, arg: '', arg2: '', rest: '' } : parseCommand(t);
  if (c) {
    switch (c.cmd) {
      case 'start': case 'help': return { cmd: c.cmd, text: helpText(), keyboard: true };
      case 'guide': case 'howto': return cmdGuide();
      case 'health': case 'status': return { cmd: 'health', text: ctx.health ? await ctx.health() : '🩺 Health status needs the database (Supabase secrets of the bot).' };
      case 'chart': return cmdChart(c.arg, c.arg2, ctx);
      case 'ask': return cmdAsk(c.rest, ctx);
      case 'news': return cmdNews(c.arg, ctx);
      case 'fx': return cmdFx(ctx);
      case 'stocks': return cmdStocks(ctx);
      case 'signals': return cmdSignals(ctx);
      case 'near': return cmdNear(ctx);
      case 'zones': case 'zone': return cmdZones(c.arg, ctx);
      case 'times': return cmdTimes(ctx);
      case 'next': return cmdNext(ctx);
      case 'hours': return cmdHours(c.arg, ctx);
      case 'fund': case 'fundamentals': return cmdFund(c.arg, ctx);
      case 'scan': return cmdScan(c.arg, ctx);
      case 'took': return { cmd: 'took', text: 'Use: <code>/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910</code>' };   // index.ts routes it to journal.ts first
      case 'alert': return cmdAlert(c.arg, c.arg2, ctx);
      case 'alerts': return cmdAlerts(ctx);
      case 'unalert': case 'delalert': return cmdUnalert(c.arg, ctx);
      case 'mute': return cmdMute(c.arg, c.arg2, ctx);
      case 'unmute': return cmdUnmute(c.arg, ctx);
      case 'quiet': return cmdQuiet(c.rest, ctx);
      case 'watch': return cmdWatch(c.arg, ctx);
      case 'unwatch': return cmdUnwatch(c.arg, ctx);
      default: return { cmd: 'unknown', text: HINT };
    }
  }
  if (t.endsWith('?') && t.length > 3) return cmdAsk(t, ctx);
  if (SYMBOLISH.test(t)) {
    const { hit, suggest } = await resolve(t, ctx);
    if (hit) return withLatest(hit.sym, ctx, hit.market === 'fx' ? fxZones(hit, ctx) : stockZones(hit, ctx));
    if (suggest.length) return { cmd: 'symbol?', text: notFound(t, suggest) };
  }
  return { cmd: 'text', text: HINT };
}
