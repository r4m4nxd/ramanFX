// RamanFX Telegram bot: commands -> reply text. Pure (no Deno, no network): the edge function (index.ts) and the
// vitest suite (src/core/telegramBot.test.ts) both import it. Data comes through ctx.load(path), path relative to the
// published site ('fx/latest.json', 'fx/d/<k>.json', 'scanner/latest.json', 'scanner/index.json', 'scanner/t/<k>.json',
// 'research/market_hours_by_symbol.json') plus 'events.json' (tools/reminders/events.json); null = missing / bad.
// Layout = the scanners' calm Telegram style: a bold heading, short lines, a timeframe per symbol (MN W1 D1 4H 1H),
// distances in percent (never pips), Calgary 12-hour times (America/Edmonton zone rules), HTML escaped, < 4096 chars.

export interface Button { text: string; url: string }
export interface Reply { text: string; buttons?: Button[][]; cmd: string }
export interface Ctx {
  load(path: string): Promise<unknown>;
  now: Date;
  /** Starts the FX + stock scans (GitHub workflow_dispatch); undefined = no GITHUB_DISPATCH_TOKEN. */
  dispatch?: () => Promise<boolean>;
}

/** The command list: Telegram's Menu (setMyCommands reads commands.json, kept equal by a test), /help and the pin. */
export const COMMANDS: { command: string; description: string; group: 'Markets' | 'Symbol lookup' | 'Times'; usage: string; help: string }[] = [
  { command: 'fx', description: 'Open FX setups + getting close', group: 'Markets', usage: '/fx', help: 'open FX setups, getting close, in a zone' },
  { command: 'stocks', description: "Today's stock BUY / WATCH", group: 'Markets', usage: '/stocks', help: "today's stock BUY / WATCH, close to a zone" },
  { command: 'signals', description: 'Every open BUY / SELL / WATCH', group: 'Markets', usage: '/signals', help: 'every open BUY / SELL / WATCH, both markets' },
  { command: 'near', description: 'Everything within 1% of a zone', group: 'Markets', usage: '/near', help: 'everything within 1% of a strong zone' },
  { command: 'scan', description: 'Run a fresh scan now', group: 'Markets', usage: '/scan', help: 'run a fresh FX + stock scan' },
  { command: 'zones', description: 'Every zone of a symbol', group: 'Symbol lookup', usage: '/zones EURUSD', help: 'every zone on every timeframe (or just send the symbol)' },
  { command: 'hours', description: 'Best times / days for a symbol', group: 'Symbol lookup', usage: '/hours XAUUSD', help: 'best Calgary times and weekdays' },
  { command: 'times', description: "Today's key Calgary times", group: 'Times', usage: '/times', help: "today's key Calgary times" },
  { command: 'next', description: 'Next NFP, CPI and Fed decision', group: 'Times', usage: '/next', help: 'next jobs report, CPI, Fed decision' },
  { command: 'help', description: 'This list', group: 'Times', usage: '/help', help: 'this list' },
];

export const APP = 'https://raman-fx.vercel.app';
const LIMIT = 4000;
const FOOT = 'not advice';
const ICON: Record<string, string> = { BUY: '🟢', SELL: '🔴', WATCH: '👀', NEAR: '⏳' };
const TF_SHORT: Record<string, string> = { H1: '1H', H4: '4H', D1: 'D1', W1: 'W1', MN: 'MN', '3M': '3M', '6M': '6M' };
const TF_ORDER = ['MN', 'W1', 'D1', 'H4', 'H1', '3M', '6M'];
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

// ---- commands ------------------------------------------------------------------------------------------------------
export function helpText(): string {
  const lines = ['🤖 <b>RamanFX bot · commands</b>', 'Type a command, or just send a symbol (EURUSD, XAUUSD, NVDA).'];
  for (const g of ['Markets', 'Symbol lookup', 'Times'] as const) {
    lines.push('', `<b>${g}</b>`);
    for (const c of COMMANDS.filter(x => x.group === g)) lines.push(`${esc(c.usage)} · ${esc(c.help)}`);
  }
  lines.push('', `Times on the Calgary clock · ${FOOT}`);
  return lines.join('\n');
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
  return { cmd: 'fx', text: fit(lines), buttons: kb('Open FX scanner', '/scanner/fx') };
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
  return { cmd: 'stocks', text: fit(lines), buttons: kb('Open stock scanner', '/scanner') };
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
  return { cmd: 'signals', text: fit(lines) };
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
  return { cmd: 'near', text: fit(lines) };
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

async function fxZones(r: Resolved, ctx: Ctx): Promise<Reply> {
  const fx = obj(await ctx.load('fx/latest.json'));
  const shard = obj(await ctx.load(`fx/d/${r.row.k ?? r.row.cls}.json`));
  const d = obj(obj(shard.instruments)[r.sym]);
  const price = num(d.price) ?? num(r.row.px);
  if (!price || !Array.isArray(d.zones)) return { cmd: 'zones', text: `🔎 <b>${esc(r.sym)}</b>\nNo zone detail published for it yet. ${FOOT}` };
  const dg = digitsOf(d);
  const lines = [`🔎 <b>${esc(r.sym)}</b> · FX · price ${px(price, dg)}`, `${tf('H1')} candle closed ${esc(when(fx.h1_close_utc ?? fx.generated))}`];
  const st = obj(d.states);
  lines.push('Trend: ' + esc(['MN', 'W1', 'D1', 'H4', 'H1'].filter(t => st[t]).map(t => `${tf(t)} ${String(st[t]).toLowerCase()}`).join(' · ')));
  const sigs = arr(d.signals);
  if (sigs.length) lines.push(`Open: ${esc(sigs.join(', '))}`);
  const hits = arr(d.hits), checks = arr(d.checks);
  const zones = arr(d.zones).slice().sort((a, b) => TF_ORDER.indexOf(a.tf) - TF_ORDER.indexOf(b.tf) || (b.proximal - a.proximal));
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
  return { cmd: 'zones', text: fit(lines), buttons: [[{ text: `📈 ${r.sym}`, url: `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(d.tv || `PEPPERSTONE:${r.sym}`)}` }]] };
}

async function stockZones(r: Resolved, ctx: Ctx): Promise<Reply> {
  const [sh, st] = [obj(await ctx.load(`scanner/t/${r.row.k}.json`)), obj(await ctx.load('scanner/latest.json'))];
  const d = obj(obj(sh.tickers)[r.sym]);
  const price = num(d.price) ?? num(r.row.px);
  if (!price || !Array.isArray(d.zones)) return { cmd: 'zones', text: `🔎 <b>${esc(r.sym)}</b>\nNo zone detail published for it yet. ${FOOT}` };
  const ccy = d.levels_ccy && d.levels_ccy !== 'USD' ? ` ${d.levels_ccy}` : '';
  const lines = [`🔎 <b>${esc(r.sym)}</b> · ${esc(d.name ?? r.row.n ?? '')}`, `price ${stockPx(price)}${esc(ccy)} · ${esc(d.date ? dayOfIso(d.date) : '')} close · scanned ${esc(when(st.generated_at))}`];
  lines.push('Trend: ' + esc([['W1', d.w1], ['MN', d.mn], ['3M', d.m3]].filter(x => x[1] && x[1] !== 'n/a').map(([t, v]) => `${tf(t)} ${String(v).toLowerCase()}`).join(' · ')));
  if (d.signal) lines.push(`Open: ${esc(d.signal)} (see /stocks)`);
  const zl = obj(st.zone_lists);
  const mine = ['demand', 'supply'].flatMap(side => ['in', 'near', 'left'].flatMap(sec => arr(obj(zl[side])[sec]).filter(x => x.s === r.sym).map(x => ({ ...x, side, section: sec }))));
  const zones = arr(d.zones).slice().sort((a, b) => TF_ORDER.indexOf(a.tf) - TF_ORDER.indexOf(b.tf) || (b.proximal - a.proximal));
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
  const slug = String(r.sym).replace(/\./g, '-');
  return { cmd: 'zones', text: fit(lines), buttons: [[...(d.chart ? [{ text: `📈 ${r.sym}`, url: String(d.chart) }] : []), { text: 'Open in scanner', url: `${APP}/scanner/${encodeURIComponent(slug)}` }]] };
}

async function cmdZones(q: string, ctx: Ctx): Promise<Reply> {
  if (!q) return { cmd: 'zones', text: 'Send a symbol after it, e.g. <b>/zones EURUSD</b> or <b>/zones NVDA</b>. Just the symbol works too.' };
  const { hit, suggest } = await resolve(q, ctx);
  if (!hit) return { cmd: 'zones', text: notFound(q, suggest) };
  return hit.market === 'fx' ? fxZones(hit, ctx) : stockZones(hit, ctx);
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

async function cmdScan(ctx: Ctx): Promise<Reply> {
  if (!ctx.dispatch) return { cmd: 'scan', text: '🔒 <b>/scan needs a GitHub token (not set up yet)</b>\nThe scanners still run on their own schedule.' };
  const ok = await ctx.dispatch().catch(() => false);
  return { cmd: 'scan', text: ok ? '🔄 <b>Scan started</b>, results in ~2 min (FX first, stocks a bit later).\nThe usual Telegram alerts follow if anything is new.' : '⚠️ <b>Scan did not start</b>\nGitHub refused or is busy. Try again in a few minutes.' };
}

// ---- dispatch ------------------------------------------------------------------------------------------------------
export function parseCommand(text: string): { cmd: string; arg: string } | null {
  const m = /^\/([A-Za-z_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/.exec(text.trim());
  return m ? { cmd: m[1].toLowerCase(), arg: (m[2] ?? '').trim().split(/\s+/)[0] ?? '' } : null;
}
const SYMBOLISH = /^[A-Za-z][A-Za-z0-9.\/_:-]{0,14}$/;
const HINT = 'Not sure what that means. Send /help for the list, or just a symbol like <b>EURUSD</b> or <b>NVDA</b>.';

export async function handle(text: string, ctx: Ctx): Promise<Reply> {
  const t = (text ?? '').trim();
  const c = parseCommand(t);
  if (c) {
    switch (c.cmd) {
      case 'start': case 'help': return { cmd: c.cmd, text: helpText(), buttons: kb('Open RamanFX', '/') };
      case 'fx': return cmdFx(ctx);
      case 'stocks': return cmdStocks(ctx);
      case 'signals': return cmdSignals(ctx);
      case 'near': return cmdNear(ctx);
      case 'zones': case 'zone': return cmdZones(c.arg, ctx);
      case 'times': return cmdTimes(ctx);
      case 'next': return cmdNext(ctx);
      case 'hours': return cmdHours(c.arg, ctx);
      case 'scan': return cmdScan(ctx);
      default: return { cmd: 'unknown', text: HINT };
    }
  }
  if (SYMBOLISH.test(t)) {
    const { hit, suggest } = await resolve(t, ctx);
    if (hit) return hit.market === 'fx' ? fxZones(hit, ctx) : stockZones(hit, ctx);
    if (suggest.length) return { cmd: 'symbol?', text: notFound(t, suggest) };
  }
  return { cmd: 'text', text: HINT };
}
