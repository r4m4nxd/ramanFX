// Trader coach: the owner's own discipline rules, from his own journal (public.rfx_journal). Pure functions, no Deno,
// no network: the edge function (index.ts), the Telegram bot (../telegram-bot/journal.ts) and the vitest suite
// (src/core/traderCoach.test.ts) all import it.
//
// The journal maths is the APP'S OWN code: app-core.js is src/core (enrich, riskStatus, rule score, plans) bundled by
// scripts/build-coach-core.mjs, so the coach and the app always agree. Trade times in the journal are wall-clock
// strings on the owner's clock (America/Edmonton) that the app parses as local time; this module runs the app code in
// a UTC runtime and hands it "now" as the Calgary wall clock read as UTC, so day keys and minute gaps match the app
// exactly (see wallMs). The edge runtime is UTC; tests set TZ=UTC.
//
// Messages: calm layout, Calgary 12-hour times, plain words, HTML escaped, no profit claims.

import { autoMarks, balanceSeries, blankPlan, computeStats, dayKey, enrich, matchPlan, resolveMarks, riskStatus, scoreRules, specFor, fmtR } from './app-core.js';

export const APP = 'https://raman-fx.vercel.app';
export const CAL = 'America/Edmonton';
export const OWNER_ID = '67967f02-d6fb-45f1-9edf-d14c3d3fcf12';

// ---- types (derived from the app code, so they never drift) --------------------------------------------------------
export type EnrichedTrade = ReturnType<typeof enrich>[number];
export type RiskRules = Parameters<typeof riskStatus>[1];
export type Plan = ReturnType<typeof blankPlan>;
type Trade = Parameters<typeof enrich>[0][number];
type Notes = NonNullable<Parameters<typeof enrich>[1]>;
type Note = Notes[string];
type ExitMap = NonNullable<Parameters<typeof enrich>[4]>;
type Deposits = Parameters<typeof balanceSeries>[1];
type Accounts = Parameters<typeof balanceSeries>[2];
type RuleMarks = ReturnType<typeof autoMarks>;

/** The rfx_journal columns the coach reads, already renamed to the app's keys (cloud.ts COLS). */
export interface CoachJournal {
  trades: Trade[];
  notes: Notes;
  exitData: ExitMap;
  openPositions: { id: string; account: string; openTime: string; symbol: string; type: 'buy' | 'sell'; openPrice: number }[];
  plans: Plan[];
  riskRules: Partial<RiskRules>;
  accounts: Accounts;
  deposits: Deposits;
}
export const COLS: [keyof CoachJournal, string][] = [
  ['trades', 'trades'], ['notes', 'notes'], ['exitData', 'exit_data'], ['openPositions', 'open_positions'], ['plans', 'plans'],
  ['riskRules', 'risk_rules'], ['accounts', 'accounts'], ['deposits', 'deposits'],
];
export function fromRow(row: Record<string, unknown>): CoachJournal {
  const arr = <T,>(col: string): T[] => { const x = row[col]; return Array.isArray(x) ? (x as T[]) : []; };
  const obj = <T,>(col: string): T => { const x = row[col]; return (x && typeof x === 'object' && !Array.isArray(x) ? x : {}) as T; };
  return {
    trades: arr('trades'), notes: obj('notes'), exitData: obj('exit_data'), openPositions: arr('open_positions'), plans: arr('plans'),
    riskRules: obj('risk_rules'), accounts: obj('accounts'), deposits: arr('deposits'),
  };
}

/** Same as DEFAULT_RISK_RULES in src/data/store.ts (a test keeps them equal; store.ts pulls in React, so it is copied). */
export const DEFAULT_RISK_RULES: RiskRules = {
  maxDailyLoss: 50, maxSingleTradeRisk: 25, maxPositionSizeLots: 0.1, maxDailyTrades: 5, maxConsecutiveLosses: 2,
  cooldownMinutes: 30, maxSizeIncreaseFactor: 2, requirePlanBeforeTrade: true, riskPercent: 1,
};
export const rulesOf = (j: CoachJournal): RiskRules => ({ ...DEFAULT_RISK_RULES, ...j.riskRules });

// ---- Calgary time (zone rules via Intl, plus the 2026c Alberta rule when the runtime's ICU lacks it) ---------------
interface Parts { y: number; m: number; d: number; h: number; mi: number; s: number; wd: number }
// Alberta stays on UTC-6 all year from 2026-11-01 (tzdata 2026c: the 2026-11-01 08:00 UTC fall-back never happens).
const AB_PERMANENT = Date.UTC(2026, 10, 1, 8, 0);
const WD: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
let fmt: Intl.DateTimeFormat | null = null;
function rawParts(ms: number): Parts {
  fmt ??= new Intl.DateTimeFormat('en-US', { timeZone: CAL, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', weekday: 'short', hourCycle: 'h23' });
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, s: +p.second, wd: WD[p.weekday] ?? 0 };
}
let abStale: boolean | null = null;
const albertaStale = () => (abStale ??= rawParts(AB_PERMANENT + 30 * 86400000).h !== 2);   // 08:00 UTC Dec 1 = 2 AM at UTC-6
export function calParts(ms: number): Parts {
  if (ms >= AB_PERMANENT && albertaStale()) {
    const t = new Date(ms - 6 * 3600000);
    return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate(), h: t.getUTCHours(), mi: t.getUTCMinutes(), s: t.getUTCSeconds(), wd: t.getUTCDay() };
  }
  return rawParts(ms);
}
/** The Calgary wall clock of an instant, as a UTC millisecond count (what the app's parseTs yields in a UTC runtime). */
export function wallMs(utcMs: number): number {
  const p = calParts(utcMs);
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s) + (utcMs % 1000 + 1000) % 1000;
}
/** Inverse of wallMs (two passes settle zone changes). */
export function utcOfWall(w: number): number {
  let t = w - (wallMs(w) - w);
  t = w - (wallMs(t) - t);
  return t;
}
const p2 = (n: number) => String(n).padStart(2, '0');
export const isoDay = (utcMs: number) => { const p = calParts(utcMs); return `${p.y}-${p2(p.m)}-${p2(p.d)}`; };
/** '9:15 AM' on the Calgary clock. */
export function clock(utcMs: number): string {
  const p = calParts(utcMs);
  return `${p.h % 12 || 12}:${p2(p.mi)} ${p.h < 12 ? 'AM' : 'PM'}`;
}
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayLabel = (key: string) => { const [, m, d] = key.split('-').map(Number); return `${MON[m - 1]} ${d}`; };
/** True when the runtime's local zone is UTC (required: the app code parses journal times as local time). */
export const utcRuntime = () => new Date(Date.UTC(2026, 0, 1)).getTimezoneOffset() === 0 && new Date(Date.UTC(2026, 6, 1)).getTimezoneOffset() === 0;

export const esc = (s: unknown) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const money = (x: number) => (Math.round(x * 100) / 100).toFixed(Math.abs(x) >= 100 || Number.isInteger(x) ? 0 : 2);
const pct = (x: number) => `${Math.round(x * 100)}%`;
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

// ---- journal maths (the app's code) --------------------------------------------------------------------------------
export const coachTrades = (j: CoachJournal): EnrichedTrade[] => enrich(j.trades, j.notes, {}, j.trades, j.exitData);

// ---- 1. rule guard ------------------------------------------------------------------------------------------------
export interface CoachEvent { key: string; kind: 'stop' | 'heads' | 'cool'; text: string }
/** A stop / heads-up only goes out while the day is live: the latest trade today closed within this many minutes. */
export const FRESH_MIN = 180;

/** The app's riskStatus for the Calgary "now" (wall clock, see the header). */
export const coachRiskStatus = (j: CoachJournal, nowUtc: number) => riskStatus(coachTrades(j), rulesOf(j), new Date(wallMs(nowUtc)));

/** Rule events for the Calgary day of `nowUtc`; each key is sent at most once (rfx_coach_events). */
export function guardEvents(j: CoachJournal, nowUtc: number): CoachEvent[] {
  const rules = rulesOf(j);
  const et = coachTrades(j);
  const now = new Date(wallMs(nowUtc));
  const st = coachRiskStatus(j, nowUtc);
  const day = isoDay(nowUtc);
  const today = et.filter(t => dayKey(t.close) === dayKey(now)).sort((a, b) => b.close.getTime() - a.close.getTime());
  if (!today.length) return [];
  const fresh = (now.getTime() - today[0].close.getTime()) / 60000 <= FRESH_MIN;
  const out: CoachEvent[] = [];
  const lossHit = rules.maxDailyLoss > 0 && st.lossToday >= rules.maxDailyLoss;
  const capHit = rules.maxDailyTrades > 0 && st.count >= rules.maxDailyTrades;
  if (lossHit || capHit) {
    if (fresh) out.push({ key: `${day}:stop`, kind: 'stop', text: lossHit
      ? `🛑 <b>Stop trading today</b> — daily loss limit reached ($${money(st.lossToday)} / $${money(rules.maxDailyLoss)}). Next session tomorrow.`
      : `🛑 <b>Stop trading today</b> — max trades reached (${st.count} / ${rules.maxDailyTrades}). Next session tomorrow.` });
    return out;
  }
  const near = st.lossUsed >= 0.7 || (rules.maxDailyTrades > 0 && st.tradesUsed >= 0.7);
  if (near && fresh) {
    const bits = [
      rules.maxDailyLoss > 0 ? `$${money(st.lossToday)} of $${money(rules.maxDailyLoss)} lost today` : '',
      rules.maxDailyTrades > 0 ? `${st.count} of ${rules.maxDailyTrades} trades` : '',
    ].filter(Boolean);
    out.push({ key: `${day}:heads`, kind: 'heads', text: `⚠️ <b>Close to your daily limit</b>\n${bits.join(' · ')}.\nYour rule ends the day at the limit.` });
  }
  const cool = st.breaches.find(b => b.level === 'cooldown');
  const lastLoss = today.find(t => t.outcome === 'loss');
  if (cool && lastLoss) {
    const next = utcOfWall(lastLoss.close.getTime() + rules.cooldownMinutes * 60000);
    out.push({ key: `${day}:cool:${lastLoss.id}`, kind: 'cool', text: `⏸ <b>${rules.cooldownMinutes}-min pause</b> (your rule). Next look at ${clock(next)}.\n${st.consecLosses} losses in a row today.` });
  }
  return out;
}

// ---- 2. "why did you take this?" ----------------------------------------------------------------------------------
export interface AskTrade { id: string; sym: string; side: 'buy' | 'sell'; price: number; kind: 'open' | 'closed'; atUtc: number }
/** Trades and open positions opened in the last `hours` that have no note text yet, newest first. */
export function askCandidates(j: CoachJournal, nowUtc: number, hours = 24): AskTrade[] {
  const now = wallMs(nowUtc), lim = hours * 3600000;
  const parse = (s: string) => { const m = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(String(s ?? '').trim()); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)) : null; };
  const seen = new Set<string>();
  const out: AskTrade[] = [];
  const add = (id: unknown, sym: unknown, side: unknown, price: unknown, openTime: string, kind: AskTrade['kind']) => {
    const k = String(id ?? '');
    if (!k || seen.has(k) || (side !== 'buy' && side !== 'sell') || typeof price !== 'number') return;
    seen.add(k);
    const at = parse(openTime);
    if (at == null || now - at > lim || at - now > 3600000) return;
    if ((j.notes[k]?.note ?? '').trim()) return;
    out.push({ id: k, sym: String(sym ?? '').toUpperCase(), side, price, kind, atUtc: utcOfWall(at) });
  };
  for (const p of j.openPositions) add(p.id, p.symbol, p.type, p.openPrice, p.openTime, 'open');
  for (const t of j.trades) add(t.id, t.symbol, t.type, t.openPrice, t.openTime, 'closed');
  return out.sort((a, b) => b.atUtc - a.atUtc);
}
export const askText = (a: AskTrade) => `📝 <b>${esc(a.sym)} ${a.side} ${esc(a.price)}</b> — why did you take it? Reply to this message.`;

/** The reply becomes the trade's note (the app's TradeNote.note); other note fields stay. updatedAt like saveNote(). */
export function withWhyNote(notes: Notes, tradeId: string, text: string, nowMs: number): { notes: Notes; changed: boolean } {
  const t = text.trim().slice(0, 2000);
  const cur: Note = notes[tradeId] ?? {};
  const prev = (cur.note ?? '').trim();
  if (!t || prev.includes(t)) return { notes, changed: false };
  return { notes: { ...notes, [tradeId]: { ...cur, note: prev ? `${prev}\n\n${t}` : t, updatedAt: nowMs } }, changed: true };
}

// ---- 3. weekly report card ----------------------------------------------------------------------------------------
/** Monday..Sunday (Calgary day keys) of the week that contains nowUtc. */
export function weekOf(nowUtc: number): { from: string; to: string } {
  const p = calParts(nowUtc);
  const mon = Date.UTC(p.y, p.m - 1, p.d) - ((p.wd + 6) % 7) * 86400000;
  const k = (ms: number) => new Date(ms).toISOString().slice(0, 10);
  return { from: k(mon), to: k(mon + 6 * 86400000) };
}
/** The weekly report is due from Sunday 6 PM Calgary; its dedupe key is the week's Monday. */
export const reportDue = (nowUtc: number) => { const p = calParts(nowUtc); return p.wd === 0 && p.h >= 18; };

interface RuleCheck { t: EnrichedTrade; marks: RuleMarks; reviewed: boolean }
/** src/data/ruleChecks.ts useRuleChecks + src/data/guru.ts useGraded (the parts the rule marks read), on the app's code. */
export function ruleChecks(j: CoachJournal, et: EnrichedTrade[]): RuleCheck[] {
  // Plans carry real epoch ms; trades are on the wall clock (see the header): move plan times to the wall clock too.
  const plans = j.plans.filter(p => !p.deleted).map(p => ({ ...p, createdAt: wallMs(p.createdAt) }));
  const series = new Map<string, { t: number; balance: number }[]>();
  const balAt = (acct: string, t: number) => {
    if (typeof j.accounts[acct]?.snapshot?.balance !== 'number') return null;
    let s = series.get(acct);
    if (!s) { s = balanceSeries(j.trades, j.deposits, j.accounts, acct); series.set(acct, s); }
    let b: number | null = null;
    for (const x of s) { if (x.t <= t) b = x.balance; else break; }
    return b;
  };
  const losses = new Map<string, number[]>();
  for (const t of et) if (t.outcome === 'loss') { const k = `${t.account}|${dayKey(t.close)}`; losses.set(k, [...(losses.get(k) ?? []), t.close.getTime()]); }
  return et.map(t => {
    const plan = matchPlan(plans, { id: t.id, sym: t.sym, type: t.type, open: t.open, openPrice: t.openPrice });
    const balance = balAt(t.account, t.open.getTime());
    const spec = specFor(t.sym);
    const sameDay = losses.get(`${t.account}|${dayKey(t.open)}`) ?? [];
    const note = j.notes[t.id];
    const ctx = {
      side: t.type, plan,
      riskPct: t.risk != null && balance && balance > 0 ? (t.risk / balance) * 100 : null,
      afterLossSameDay: sameDay.some(c => c <= t.open.getTime()),
      pip: spec.pipSize, digits: spec.digits, entry: t.openPrice, initStop: j.exitData[t.id]?.initSl ?? null,
    };
    const stored = (note?.rules ?? {}) as RuleMarks;
    const auto = autoMarks({ ...ctx, align: note?.align ?? null });
    return { t, marks: resolveMarks(stored, auto), reviewed: Object.keys(stored).length > 0 };
  });
}

const normTag = (s: string) => s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

export interface ReportOpts { showAmounts?: boolean; sample?: boolean }
export interface Card { text: string; buttons: { text: string; url: string }[][] }

export function reportCard(j: CoachJournal, nowUtc: number, opts: ReportOpts = {}): Card {
  const { from, to } = weekOf(nowUtc);
  const all = coachTrades(j);
  const week = all.filter(t => { const k = dayKey(t.close); return k >= from && k <= to; });
  const head = `${opts.sample ? '🧪 <b>Sample weekly report</b>' : '📋 <b>Weekly report card</b>'} · ${dayLabel(from)} – ${dayLabel(to)}`;
  const lines = [head];
  const s = computeStats(week);
  if (!week.length) lines.push('No closed trades this week.');
  else {
    const r = s.rCount ? `net ${fmtR(s.totalR)}${s.rCount < s.total ? ` (R known on ${s.rCount} of ${s.total})` : ''}` : 'net R unknown (no stops recorded)';
    const amt = opts.showAmounts ? ` · ${s.net < 0 ? '−' : '+'}$${money(Math.abs(s.net))}` : '';
    lines.push(`${plural(s.total, 'trade')} · win rate ${pct(s.winRate)} · ${r}${amt}`);
  }

  const checks = ruleChecks(j, all);
  const wk = checks.filter(c => c.reviewed && (() => { const k = dayKey(c.t.close); return k >= from && k <= to; })());
  const marks = wk.flatMap(c => Object.values(c.marks));
  const y = marks.filter(m => m === 'y').length, n = marks.filter(m => m === 'n').length;
  lines.push(y + n ? `Rules followed ${pct(y / (y + n))} (${y} of ${y + n} checks on ${plural(wk.length, 'trade')})` : 'Rules: no trades checked this week (tick the Rule check on a trade).');

  const scored = (cs: RuleCheck[]) => scoreRules(cs.map(c => ({ id: c.t.id, net: c.t.net, r: c.t.r, risk: c.t.risk, marks: c.marks })));
  let worst = scored(wk).find(x => x.cost != null && x.cost < 0), span = '';
  if (!worst) { worst = scored(checks.filter(c => c.reviewed)).find(x => x.cost != null && x.cost < 0); span = ', all time'; }
  lines.push(worst ? `Most expensive habit: breaking '${esc(worst.rule.name)}' (${fmtR(worst.cost!)} over ${plural(worst.broken.rN, 'trade')}${span})` : 'Most expensive habit: none showing yet.');

  const groups = new Map<string, { n: number; r: number; rN: number }>();
  for (const t of week) {
    const tags = [...new Set((j.notes[t.id]?.tags ?? []).map(normTag).filter(Boolean))];
    for (const k of tags) { const g = groups.get(k) ?? { n: 0, r: 0, rN: 0 }; g.n++; if (t.r != null) { g.r += t.r; g.rN++; } groups.set(k, g); }
  }
  const ranked = [...groups].filter(([, g]) => g.rN > 0).sort((a, b) => b[1].r - a[1].r);
  const setup = (label: string, [k, g]: [string, { n: number; r: number }]) => `${label}: ${esc(k)} (${fmtR(g.r)} · ${plural(g.n, 'trade')})`;
  if (ranked.length >= 2) { lines.push(setup('Best setup', ranked[0])); lines.push(setup('Worst setup', ranked[ranked.length - 1])); }
  else if (ranked.length === 1) lines.push(setup('Only setup tagged', ranked[0]));
  else if (week.length) lines.push('Setups: no setup tags with R this week.');
  return { text: lines.join('\n'), buttons: [[{ text: 'Open journal', url: `${APP}/journal` }]] };
}

// ---- 4. /took -----------------------------------------------------------------------------------------------------
export interface Took { symbol: string; side: 'buy' | 'sell'; entry: number; sl: number; tp: number | null }
export const TOOK_USAGE = 'Use: <code>/took EURUSD buy 1.0850 sl 1.0820 tp 1.0910</code>';
const NUM = /^\d+(?:\.\d+)?$/;

export function parseTook(rest: string): { ok: true; v: Took } | { ok: false; error: string } {
  const toks = String(rest ?? '').replace(/,/g, ' ').replace(/\b(sl|tp|stop|target)\s*[=:]\s*/gi, '$1 ').trim().split(/\s+/).filter(Boolean);
  if (toks.length < 3) return { ok: false, error: TOOK_USAGE };
  const symbol = toks[0].toUpperCase().replace(/\//g, '');
  if (!/^[A-Z][A-Z0-9.]{1,14}$/.test(symbol)) return { ok: false, error: `“${esc(toks[0])}” is not a symbol. ${TOOK_USAGE}` };
  const sd = toks[1].toLowerCase();
  const side = sd === 'buy' || sd === 'long' ? 'buy' : sd === 'sell' || sd === 'short' ? 'sell' : null;
  if (!side) return { ok: false, error: `Side must be buy or sell. ${TOOK_USAGE}` };
  let i = 2;
  if (/^(@|at)$/i.test(toks[i] ?? '')) i++;
  if (!NUM.test(toks[i] ?? '')) return { ok: false, error: `Entry price missing. ${TOOK_USAGE}` };
  const entry = Number(toks[i++]);
  let sl: number | null = null, tp: number | null = null;
  while (i < toks.length) {
    const k = toks[i].toLowerCase(), v = toks[i + 1];
    if (!['sl', 'stop', 'tp', 'target'].includes(k) || !NUM.test(v ?? '')) return { ok: false, error: `Could not read “${esc(toks.slice(i).join(' '))}”. ${TOOK_USAGE}` };
    if (k === 'sl' || k === 'stop') sl = Number(v); else tp = Number(v);
    i += 2;
  }
  if (!(entry > 0)) return { ok: false, error: 'Entry must be above 0.' };
  if (sl == null || !(sl > 0)) return { ok: false, error: `A stop is needed (sl). ${TOOK_USAGE}` };
  const dir = side === 'buy' ? 1 : -1;
  if (dir * (entry - sl) <= 0) return { ok: false, error: `For a ${side} the stop must be ${side === 'buy' ? 'below' : 'above'} the entry.` };
  if (tp != null && dir * (tp - entry) <= 0) return { ok: false, error: `For a ${side} the target must be ${side === 'buy' ? 'above' : 'below'} the entry.` };
  if (Math.abs(entry - sl) / entry > 0.25 || (tp != null && Math.abs(tp - entry) / entry > 1)) return { ok: false, error: 'Those levels are very far from the entry. Check the prices.' };
  return { ok: true, v: { symbol, side, entry, sl, tp } };
}

/** A Planner plan (the app's blankPlan) for a /took trade. Context fields read "with the trend" until edited in the Planner. */
export function tookPlan(t: Took, nowMs: number, rand = Math.random): Plan {
  return blankPlan({
    id: `pl_${nowMs.toString(36)}${rand().toString(36).slice(2, 6)}`, createdAt: nowMs, updatedAt: nowMs,
    symbol: t.symbol, side: t.side, entry: t.entry, stop: t.sl, target: t.tp, entryType: 'market',
    htfTrend: t.side === 'buy' ? 'up' : 'down', etfTrend: t.side === 'buy' ? 'up' : 'down', curve: t.side === 'buy' ? 30 : 70,
    status: 'planned', note: 'Added from Telegram (/took). Check the zone, trend and curve here.',
  });
}
/** The app's savePlan(): a new plan goes first. Never touches other plans. */
export const withPlan = (plans: Plan[], p: Plan): Plan[] => (plans.some(x => x.id === p.id) ? plans : [p, ...plans]);

export function planCard(p: Plan): Card {
  const risk = Math.abs((p.entry ?? 0) - (p.stop ?? 0));
  const rr = p.target != null && risk > 0 ? Math.abs(p.target - (p.entry ?? 0)) / risk : null;
  const text = [
    `📝 <b>Plan saved</b> · ${esc(p.symbol)} ${p.side}`,
    `Entry ${esc(p.entry)} · stop ${esc(p.stop)}${p.target != null ? ` · target ${esc(p.target)}` : ''}`,
    rr != null ? `Target is ${rr.toFixed(1)}× the stop distance.` : 'No target set.',
    'In the Planner after the app syncs.',
  ].join('\n');
  return { text, buttons: [[{ text: 'Open in Planner', url: `${APP}/plan/${encodeURIComponent(p.id)}` }]] };
}

// ---- safe journal writes: read-modify-write of single columns, optimistic concurrency on updated_at ---------------
export interface Db {
  /** The owner's row: the asked columns plus updated_at; null when there is no row. */
  read(cols: string[]): Promise<{ row: Record<string, unknown>; updatedAt: string } | null>;
  /** PATCH the columns only if updated_at still equals `expect`; true when the row changed. */
  write(patch: Record<string, unknown>, expect: string): Promise<boolean>;
}
export type RmwResult = 'ok' | 'nochange' | 'conflict' | 'missing';
/** f returns the new values of the columns (or null = nothing to change). Retries on a concurrent write. */
export async function rmw(db: Db, cols: string[], f: (row: Record<string, unknown>) => Record<string, unknown> | null, tries = 5): Promise<RmwResult> {
  for (let i = 0; i < tries; i++) {
    const cur = await db.read(cols);
    if (!cur) return 'missing';
    const patch = f(cur.row);
    if (!patch) return 'nochange';
    for (const k of Object.keys(patch)) if (!cols.includes(k)) throw new Error(`rmw: column ${k} not read`);
    if (await db.write(patch, cur.updatedAt)) return 'ok';
    await new Promise(r => setTimeout(r, 150 * (i + 1)));
  }
  return 'conflict';
}

/** PostgREST access to the owner's rfx_journal row with the service role. */
export function restDb(sbUrl: string, key: string, userId = OWNER_ID, f: typeof fetch = fetch): Db {
  const h = { apikey: key, 'Content-Type': 'application/json', ...(key.startsWith('eyJ') ? { Authorization: `Bearer ${key}` } : {}) };
  const base = `${sbUrl}/rest/v1/rfx_journal?user_id=eq.${encodeURIComponent(userId)}`;
  return {
    async read(cols) {
      const r = await f(`${base}&select=${[...cols, 'updated_at'].join(',')}`, { headers: h });
      if (!r.ok) throw new Error(`journal read ${r.status}`);
      const rows = await r.json();
      if (!Array.isArray(rows) || rows.length !== 1) return null;
      return { row: rows[0], updatedAt: String(rows[0].updated_at) };
    },
    async write(patch, expect) {
      const r = await f(`${base}&updated_at=eq.${encodeURIComponent(expect)}&select=user_id`, {
        method: 'PATCH', headers: { ...h, Prefer: 'return=representation' }, body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error(`journal write ${r.status}`);
      const rows = await r.json();
      return Array.isArray(rows) && rows.length === 1;
    },
  };
}

/** A journal write the bot made (rfx_coach_writes). The app's sync could overwrite it if the app pulled just before
 *  the write and pushed just after, so the coach re-checks writes for a day and re-applies a lost one. */
export interface JournalWrite { kind: 'note' | 'plan'; trade_id?: string | null; text?: string | null; plan?: Plan | null; at: number }
/** True when the write is missing from the journal (and was not superseded by a later edit in the app). */
export function writeLost(j: CoachJournal, w: JournalWrite): boolean {
  if (w.kind === 'plan') return !!w.plan && !j.plans.some(p => p.id === w.plan!.id);
  if (!w.trade_id || !w.text) return false;
  const n = j.notes[w.trade_id];
  return !(n?.note ?? '').includes(w.text.trim().slice(0, 2000)) && (n?.updatedAt ?? 0) < w.at;
}

/** Save a "why" reply as the trade's note. */
export const saveWhyNote = (db: Db, tradeId: string, text: string, nowMs = Date.now()) =>
  rmw(db, ['notes'], row => { const r = withWhyNote((row.notes ?? {}) as Notes, tradeId, text, nowMs); return r.changed ? { notes: r.notes } : null; });
/** Add a plan to the journal's plans. */
export const savePlan = (db: Db, p: Plan) =>
  rmw(db, ['plans'], row => { const cur = Array.isArray(row.plans) ? (row.plans as Plan[]) : []; return cur.some(x => x.id === p.id) ? null : { plans: withPlan(cur, p) }; });
