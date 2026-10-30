// Silent health-check watchdog (run on the coach's 10-minute tick, index.ts, at most once per half hour).
// It says NOTHING while everything works. When something stays broken past its grace window it sends ONE calm
// Telegram message ('⚠️ FX scan missed 2 hours — last good scan 1:05 PM.'), at most again 6 h later while it is still
// broken, and ONE '✅ resolved: …' when it clears. Several problems found together share one message.
// Calm limits: max 4 health messages a Calgary day; during the owner's quiet hours (rfx_bot_config, /quiet) nothing is
// sent: what is still broken when the quiet hours end goes out in one message then (a problem that healed overnight
// never speaks). Calgary clock (America/Edmonton) in every message.
// Checks (evaluate(), pure; the I/O is gather() / gatherFiles() with an injected fetch, so the tests run offline):
//   fx      forex week: a successful fx-scan.yml run (not the bot's 'FX on-demand scan …') or public/fx/latest.json
//           `generated` within the last 2 H1 closes + 20 min; weekend: a (crypto-only) run within 3 h.
//   stock   each NYSE trading day (weekdays minus NYSE holidays, the briefing's own rule): a successful stock-scan
//           run, or public/scanner/latest.json `generated_at`, after the 4 PM New York close, due 2.5 h after it.
//           A scan still running is not a problem yet. (The scanner has no 'market closed' mark: on a holiday it
//           would rescan the last session, so holidays are simply not checked.)
//   movers  a successful movers.yml (big moves) run within 3 h during the forex week.
//   brief   weekdays: a successful briefing.yml run after 5:50 AM Calgary, due 6:45 AM.
//   fund    New York weekdays: a successful fundamentals.yml run (or public/fundamentals/fx.json) after 18:00 New
//           York, due 21:00 New York.
//   fail:*  the newest finished run of any of these workflows is a failure (failure / timed_out / startup_failure,
//           last 24 h) -> named, with a link to the run; still failing at the next check (25 min grace, the
//           scheduler retries on its own) before it is sent. Clears with the next successful run.
//   key:*   GitHub token (API 200 on the runs list), OANDA (1 candle), Alpaca (latest AAPL trade), Telegram (getMe):
//           401 / 403 = rejected (two checks in a row before a message); a missing secret or a network hiccup is
//           not a problem. Edge secrets are project-wide, so the coach reads OANDA_API_TOKEN like the bot does.
//   app     the web app (raman-fx.vercel.app, Vercel Hobby: 100 deployments a day). Live commit = its /version.json
//           (written by the build); GitHub compare live...main finds the commits that change the app (appPaths.ts,
//           the same rule as the Vercel ignore script: data / bot commits never deploy). The oldest such commit not
//           live after 90 min = 'App not updating — Vercel may be rate-limited'. version.json or GitHub unreadable:
//           skipped.
//   app-data /fx/latest.json and /movers/latest.json fetched THROUGH the app (the vercel.json rewrite to GitHub):
//           unreachable / not JSON, or `generated` 30+ min behind the raw GitHub file -> problem, two checks in a row.
//   gh-exp-14 / gh-exp-3  the GitHub token's expiry (header github-authentication-token-expiration): ONE heads-up
//           14 days and ONE 3 days before (never repeated).
// Self-healing first: the scheduler (scheduler.ts) re-dispatches a missed slot every tick, so the grace windows above
// are longer than its retries: a message means the retries did not fix it.
// State: rfx_coach_events rows 'hopen:<id>' (kind health-open, sent = alerted), 'halert:<id>:<ms>' (health-alert,
// the 6 h re-alert), 'hmsg:<ms>' (health-msg, the daily cap), 'health:<hour>:<half>' (health-tick, once per half hour).
// The last snapshot is kept in rfx_coach_config.dispatch.health for the bot's /health (healthSummary()).
// Never logs or shows a secret value.
import { calParts, clock, esc, isoDay, utcOfWall } from './core.ts';
import { fxBarCloses, nyParts, REPO } from './scheduler.ts';
import { isAppPath } from './appPaths.ts';

export const MIN = 60_000, HOUR = 3_600_000, DAY = 86_400_000;
export const FX_GRACE = 2 * HOUR + 20 * MIN, CRYPTO_GRACE = 3 * HOUR, MOVERS_GRACE = 3 * HOUR, STOCK_DUE = 150 * MIN;
export const KEY_GRACE = 25 * MIN, FAIL_GRACE = 25 * MIN, REALERT = 6 * HOUR, PER_DAY = 4;
export const APP_GRACE = 90 * MIN, APP_DATA_GRACE = 25 * MIN, APP_DATA_LAG = 30 * MIN;
export const APP_URL = 'https://raman-fx.vercel.app';
export type AppFile = 'fx' | 'movers';
export const APP_FILES: AppFile[] = ['fx', 'movers'];
/** The web app: live commit, the oldest app change not live yet, the data files through the app vs GitHub. */
export interface AppSnap {
  /** Commit in /version.json; null = unreadable. */
  live: string | null;
  /** Built time in /version.json (UTC ms). */
  builtAt?: number | null;
  /** Commit time of the oldest app-affecting commit on main that is not live; null = none; undefined = unknown. */
  pendingSince?: number | null;
  /** `generated` (UTC ms) per file: app = through raman-fx.vercel.app (undefined = unreachable / not JSON, null = no
   *  `generated`), raw = raw.githubusercontent.com (undefined = could not read). */
  data: Partial<Record<AppFile, { app?: number | null; raw?: number | null }>>;
}

export type WfFile = 'fx-scan.yml' | 'stock-scan.yml' | 'movers.yml' | 'briefing.yml' | 'fundamentals.yml';
export const HEALTH_WFS: WfFile[] = ['fx-scan.yml', 'stock-scan.yml', 'movers.yml', 'briefing.yml', 'fundamentals.yml'];
export const WF_NAME: Record<WfFile, string> = { 'fx-scan.yml': 'FX scan', 'stock-scan.yml': 'Stock scan', 'movers.yml': 'Big moves', 'briefing.yml': 'Morning brief', 'fundamentals.yml': 'Fundamentals' };
const PER_PAGE: Record<WfFile, number> = { 'fx-scan.yml': 50, 'stock-scan.yml': 30, 'movers.yml': 20, 'briefing.yml': 15, 'fundamentals.yml': 10 };
export type KeyName = 'github' | 'oanda' | 'alpaca' | 'telegram';
/** ok = accepted; bad = rejected (401 / 403); absent = secret not set; error = could not tell (network, 5xx). */
export type KeyState = 'ok' | 'bad' | 'absent' | 'error';
export const KEYS: KeyName[] = ['github', 'oanda', 'alpaca', 'telegram'];
const KEY_LABEL: Record<KeyName, string> = { github: 'GitHub', oanda: 'OANDA', alpaca: 'Alpaca', telegram: 'Telegram' };
const KEY_TEXT: Record<KeyName, string> = {
  github: 'GitHub token rejected — the scheduler and /scan are off. Renew GITHUB_DISPATCH_TOKEN in Supabase secrets.',
  oanda: 'OANDA key rejected — live FX charts are off. Renew OANDA_API_TOKEN (Supabase + GitHub secrets).',
  alpaca: 'Alpaca keys rejected — live stock data and breaking news are off. Renew ALPACA_KEY_ID / ALPACA_SECRET_KEY.',
  telegram: 'Telegram bot token rejected (getMe). Renew TELEGRAM_BOT_TOKEN.',
};

export interface Run { id: number; at: number; status: string; conclusion: string | null; url: string; ondemand: boolean }
export interface Snapshot {
  now: number;
  /** Runs per workflow, newest first; a workflow missing = could not read (no token, API error). */
  runs: Partial<Record<WfFile, Run[]>>;
  /** Generated times (UTC ms) of the published files, read only when a run check fails (gatherFiles). */
  files?: Partial<Record<FileName, number | null>>;
  keys: Record<KeyName, KeyState>;
  /** GitHub token expiry (UTC ms); null = none reported; undefined = not read. */
  ghExpiry?: number | null;
  /** The web app (gatherApp); undefined = not read. */
  app?: AppSnap;
}
export type FileName = 'fx' | 'stock' | 'fund';
export interface Check {
  id: string;
  label: string;
  status: 'ok' | 'problem' | 'skip';
  /** Problem: the alert line (HTML, escaped); ok: a short detail for the resolved line. */
  text: string;
  /** A problem is sent only after it was seen for this long (default 0). */
  graceMs?: number;
  /** Sent once, never repeated while it lasts. */
  once?: boolean;
  /** The file that can still clear this problem (fetched only then). */
  file?: FileName;
  /** Last good time, for /health. */
  last?: number | null;
}

// ---- time ------------------------------------------------------------------------------------------------------------
const p2 = (n: number) => String(n).padStart(2, '0');
const WDN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const nyWall = (ms: number) => { const n = nyParts(ms); return Date.UTC(n.y, n.m - 1, n.d, n.h, n.mi) + (ms % 60000); };
/** UTC ms of a New York wall time (two passes settle DST). */
export function nyUtc(y: number, m: number, d: number, h: number, mi = 0): number {
  const w = Date.UTC(y, m - 1, d, h, mi);
  let t = w - (nyWall(w) - w);
  t = w - (nyWall(t) - t);
  return t;
}
/** UTC ms of a Calgary wall time. */
export const calUtc = (y: number, m: number, d: number, h: number, mi = 0) => utcOfWall(Date.UTC(y, m - 1, d, h, mi));
/** '1:05 PM' today, 'Thu 1:05 PM' another day (Calgary). */
export function when(t: number | null | undefined, now: number): string {
  if (t == null) return 'none recently';
  return isoDay(t) === isoDay(now) ? clock(t) : `${WDN[calParts(t).wd]} ${clock(t)}`;
}
const dayLabel = (y: number, m: number, d: number) => `${WDN[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]} ${MON[m - 1]} ${d}`;

/** NYSE full-day holidays 'YYYY-MM-DD' (rule-based; same rules as tools/reminders/reminders.py nyse_holidays). */
export function nyseHolidays(year: number): Set<string> {
  const k = (t: number) => new Date(t).toISOString().slice(0, 10);
  const nth = (month: number, wd: number, n: number): number => {   // wd: 0 = Sunday (JS)
    if (n > 0) {
      const first = Date.UTC(year, month - 1, 1);
      return first + (((wd - new Date(first).getUTCDay()) + 7) % 7) * DAY + (n - 1) * 7 * DAY;
    }
    const last = Date.UTC(year, month, 0);
    return last - (((new Date(last).getUTCDay() - wd) + 7) % 7) * DAY;
  };
  const observed = (t: number) => { const wd = new Date(t).getUTCDay(); return wd === 6 ? t - DAY : wd === 0 ? t + DAY : t; };
  const a = year % 19, b = Math.floor(year / 100), c = year % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), kk = c % 4;
  const l = (32 + 2 * e + 2 * i - h - kk) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mon = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  const out = [nth(1, 1, 3), nth(2, 1, 3), Date.UTC(year, mon - 1, day) - 2 * DAY, nth(5, 1, -1), observed(Date.UTC(year, 5, 19)),
    observed(Date.UTC(year, 6, 4)), nth(9, 1, 1), nth(11, 4, 4), observed(Date.UTC(year, 11, 25))];
  const ny = Date.UTC(year, 0, 1);
  if (new Date(ny).getUTCDay() !== 6) out.push(observed(ny));   // a Saturday New Year's Day is not observed on Friday
  return new Set(out.map(k));
}
/** The latest NYSE trading day whose stock-scan deadline (close + 2.5 h) has passed: its close (UTC ms) and label. */
export function stockDue(now: number): { close: number; due: number; label: string } | null {
  const n = nyParts(now);
  for (let i = 0; i < 8; i++) {
    const t = new Date(Date.UTC(n.y, n.m - 1, n.d - i));
    const y = t.getUTCFullYear(), m = t.getUTCMonth() + 1, d = t.getUTCDate(), wd = t.getUTCDay();
    if (wd === 0 || wd === 6 || nyseHolidays(y).has(`${y}-${p2(m)}-${p2(d)}`)) continue;
    const close = nyUtc(y, m, d, 16, 0);
    if (now >= close + STOCK_DUE) return { close, due: close + STOCK_DUE, label: dayLabel(y, m, d) };
  }
  return null;
}

// ---- checks (pure) ---------------------------------------------------------------------------------------------------
export function parseRuns(js: unknown): Run[] {
  const runs = (js as { workflow_runs?: unknown[] })?.workflow_runs;
  return (Array.isArray(runs) ? runs : []).map(x => {
    const r = (x ?? {}) as Record<string, unknown>;
    const url = String(r.html_url ?? '');
    return { id: Number(r.id) || 0, at: Date.parse(String(r.run_started_at ?? r.created_at ?? '')), status: String(r.status ?? ''),
      conclusion: typeof r.conclusion === 'string' ? r.conclusion : null, url: url.startsWith('https://github.com/') ? url : '',
      ondemand: /on-demand/i.test(String(r.display_title ?? '')) };
  }).filter(r => Number.isFinite(r.at));
}
const scheduled = (runs: Run[]) => runs.filter(r => !r.ondemand);
/** Newest successful scheduled run (start time). */
export const lastOk = (runs: Run[]): number | null => scheduled(runs).filter(r => r.conclusion === 'success').reduce<number | null>((a, r) => (a == null || r.at > a ? r.at : a), null);
const running = (runs: Run[], since: number) => scheduled(runs).some(r => r.status !== 'completed' && r.at >= since);
const newest = (a: number | null | undefined, b: number | null | undefined) => (a == null ? b ?? null : b == null ? a : Math.max(a, b));
const fxWeek = (t: number) => fxBarCloses(t - (t % HOUR));
const hoursAgo = (now: number, t: number | null, min: number) => (t == null ? `${min}+` : String(Math.max(min, Math.floor((now - t) / HOUR))));
const FAILED = new Set(['failure', 'timed_out', 'startup_failure']);

export function evaluate(s: Snapshot): Check[] {
  const { now } = s;
  const out: Check[] = [];
  const files = s.files ?? {};

  // FX scan
  const fx = s.runs['fx-scan.yml'];
  if (!fx) out.push({ id: 'fx', label: 'FX scan', status: 'skip', text: '' });
  else if (fxWeek(now) && fxWeek(now - FX_GRACE)) {
    const last = newest(lastOk(fx), files.fx);
    out.push(last != null && now - last <= FX_GRACE
      ? { id: 'fx', label: 'FX scan', status: 'ok', text: `last good scan ${when(last, now)}`, last }
      : { id: 'fx', label: 'FX scan', status: 'problem', file: 'fx', last,
        text: `FX scan missed ${hoursAgo(now, last, 2)} hours — last good scan ${when(last, now)}. The scheduler keeps retrying.` });
  } else {
    const last = lastOk(fx);
    out.push(last != null && now - last <= CRYPTO_GRACE
      ? { id: 'fx', label: 'FX scan', status: 'ok', text: `last good run ${when(last, now)} (weekend crypto)`, last }
      : { id: 'fx', label: 'FX scan', status: 'problem', last,
        text: `Weekend crypto scan missed ${hoursAgo(now, last, 3)} hours — last good run ${when(last, now)}.` });
  }

  // Stock scan (NYSE trading days, due 2.5 h after the close)
  const st = s.runs['stock-scan.yml'];
  const due = stockDue(now);
  if (!st || !due) out.push({ id: 'stock', label: 'Stock scan', status: 'skip', text: '', last: st ? lastOk(st) : null });
  else {
    const last = newest(lastOk(st), files.stock);
    if (last != null && last >= due.close) out.push({ id: 'stock', label: 'Stock scan', status: 'ok', text: `scanned ${when(last, now)}`, last });
    else if (running(st, due.close)) out.push({ id: 'stock', label: 'Stock scan', status: 'skip', text: 'running', last });
    else out.push({ id: 'stock', label: 'Stock scan', status: 'problem', file: 'stock', last,
      text: `Stock scan missing for ${due.label} — nothing since the US close (${clock(due.close)}).` });
  }

  // Big moves (hourly, forex week)
  const mv = s.runs['movers.yml'];
  if (!mv || !(fxWeek(now) && fxWeek(now - MOVERS_GRACE))) out.push({ id: 'movers', label: 'Big moves', status: 'skip', text: '', last: mv ? lastOk(mv) : null });
  else {
    const last = lastOk(mv);
    out.push(last != null && now - last <= MOVERS_GRACE
      ? { id: 'movers', label: 'Big moves', status: 'ok', text: `last run ${when(last, now)}`, last }
      : { id: 'movers', label: 'Big moves', status: 'problem', last, text: `Big moves didn't run for ${hoursAgo(now, last, 3)} hours — last run ${when(last, now)}.` });
  }

  // Morning brief (Calgary weekdays, due 6:45 AM)
  const br = s.runs['briefing.yml'];
  const c = calParts(now);
  const briefDue = calUtc(c.y, c.m, c.d, 6, 45), briefFrom = calUtc(c.y, c.m, c.d, 5, 50);
  if (!br || c.wd === 0 || c.wd === 6 || now < briefDue) out.push({ id: 'brief', label: 'Morning brief', status: 'skip', text: '', last: br ? lastOk(br) : null });
  else {
    const last = lastOk(br);
    if (last != null && last >= briefFrom) out.push({ id: 'brief', label: 'Morning brief', status: 'ok', text: `ran ${when(last, now)}`, last });
    else if (running(br, briefFrom)) out.push({ id: 'brief', label: 'Morning brief', status: 'skip', text: 'running', last });
    else out.push({ id: 'brief', label: 'Morning brief', status: 'problem', last, text: "Morning brief didn't run this morning (due 6 AM, latest 6:45 AM)." });
  }

  // Fundamentals (New York weekdays, due 21:00 New York)
  const fu = s.runs['fundamentals.yml'];
  const n = nyParts(now);
  const fundDue = nyUtc(n.y, n.m, n.d, 21), fundFrom = nyUtc(n.y, n.m, n.d, 18);
  if (!fu || n.wd === 0 || n.wd === 6 || now < fundDue) out.push({ id: 'fund', label: 'Fundamentals', status: 'skip', text: '', last: fu ? lastOk(fu) : null });
  else {
    const last = newest(lastOk(fu), files.fund);
    if (last != null && last >= fundFrom) out.push({ id: 'fund', label: 'Fundamentals', status: 'ok', text: `built ${when(last, now)}`, last });
    else if (running(fu, fundFrom)) out.push({ id: 'fund', label: 'Fundamentals', status: 'skip', text: 'running', last });
    else out.push({ id: 'fund', label: 'Fundamentals', status: 'problem', file: 'fund', last, text: `Fundamentals not rebuilt tonight (due by ${clock(fundDue)}).` });
  }

  // A failed run (the newest finished scheduled run of each workflow)
  for (const wf of HEALTH_WFS) {
    const runs = s.runs[wf];
    const id = `fail:${wf.replace(/\.yml$/, '')}`, label = `${WF_NAME[wf]} run`;
    const done = runs ? scheduled(runs).find(r => r.status === 'completed' && (r.conclusion === 'success' || FAILED.has(r.conclusion ?? ''))) : undefined;
    if (!done) { out.push({ id, label, status: 'skip', text: '' }); continue; }
    if (done.conclusion === 'success') { out.push({ id, label, status: 'ok', text: `last run ${when(done.at, now)} ok` }); continue; }
    if (now - done.at > DAY) { out.push({ id, label, status: 'skip', text: '' }); continue; }
    const link = done.url ? ` — <a href="${esc(done.url)}">open the run</a>` : '';
    out.push({ id, label, status: 'problem', graceMs: FAIL_GRACE, text: `${WF_NAME[wf]} failed at ${when(done.at, now)}${link}` });
  }

  // The web app: deploys stuck (Vercel limit) / data through the app's GitHub proxy
  out.push(...appChecks(s));

  // Keys
  for (const k of KEYS) {
    const v = s.keys[k];
    out.push({ id: `key:${k}`, label: `${KEY_LABEL[k]} key`, status: v === 'bad' ? 'problem' : v === 'ok' ? 'ok' : 'skip', graceMs: KEY_GRACE,
      text: v === 'bad' ? KEY_TEXT[k] : 'works again' });
  }
  // GitHub token expiry: one heads-up at 14 days, one at 3 days
  if (s.ghExpiry === undefined) {
    out.push({ id: 'gh-exp-14', label: 'GitHub token expiry', status: 'skip', text: '' }, { id: 'gh-exp-3', label: 'GitHub token expiry', status: 'skip', text: '' });
  } else {
    const left = s.ghExpiry == null ? Infinity : (s.ghExpiry - now) / DAY;
    const ex = s.ghExpiry == null ? '' : (() => { const p = calParts(s.ghExpiry!); return `${MON[p.m - 1]} ${p.d}`; })();
    const msg = `GitHub token expires ${ex} (in ${Math.max(0, Math.ceil(left))} days) — renew GITHUB_DISPATCH_TOKEN in Supabase secrets before then.`;
    out.push({ id: 'gh-exp-14', label: 'GitHub token expiry', once: true, status: left <= 3 ? 'skip' : left <= 14 ? 'problem' : 'ok', text: left <= 14 ? msg : 'token renewed' });
    out.push({ id: 'gh-exp-3', label: 'GitHub token expiry', once: true, status: left <= 3 ? 'problem' : 'ok', text: left <= 3 ? msg : 'token renewed' });
  }
  return out;
}
const age = (ms: number) => `${Math.max(1.5, Math.floor(ms / (HOUR / 2)) / 2)}h`;
export function appChecks(s: Snapshot): Check[] {
  const { now, app } = s;
  const out: Check[] = [];
  if (!app || !app.live || app.pendingSince === undefined) out.push({ id: 'app', label: 'App deploy', status: 'skip', text: '' });
  else if (app.pendingSince == null || now - app.pendingSince <= APP_GRACE) out.push({ id: 'app', label: 'App deploy', status: 'ok', text: `live ${app.live.slice(0, 7)}` });
  else out.push({ id: 'app', label: 'App deploy', status: 'problem',
    text: `App not updating — Vercel may be rate-limited; latest app change not live for ${age(now - app.pendingSince)} (live ${esc(app.live.slice(0, 7))}, waiting since ${when(app.pendingSince, now)}).` });
  if (!app) { out.push({ id: 'app-data', label: 'App data', status: 'skip', text: '' }); return out; }
  const bad: string[] = [];
  for (const k of APP_FILES) {
    const d = app.data[k];
    if (!d) continue;
    const path = `/${k}/latest.json`;
    if (d.app === undefined) bad.push(`${path} unreachable through the app`);
    else if (typeof d.raw === 'number' && (d.app == null || d.app < d.raw - APP_DATA_LAG))
      bad.push(`${path} through the app is ${d.app == null ? 'missing its time' : `from ${when(d.app, now)}`}, GitHub has ${when(d.raw, now)}`);
  }
  out.push(bad.length
    ? { id: 'app-data', label: 'App data', status: 'problem', graceMs: APP_DATA_GRACE,
      text: `App data not loading — ${bad.join('; ')}. Check the GitHub rewrites in vercel.json.` }
    : { id: 'app-data', label: 'App data', status: APP_FILES.some(k => app.data[k]) ? 'ok' : 'skip', text: 'loads again' });
  return out;
}
/** Files that could still clear a problem (fetched only then, keeps the check cheap). */
export const needFiles = (checks: Check[]): FileName[] => [...new Set(checks.filter(c => c.status === 'problem' && c.file).map(c => c.file!))];

// ---- what to send (pure) ---------------------------------------------------------------------------------------------
export interface Open { id: string; since: number; alerted: boolean }
export interface PlanIn {
  now: number; checks: Check[]; open: Open[];
  /** Last alert time per problem id (last 24 h). */
  lastAlert: Record<string, number>;
  /** Health messages sent today (Calgary day). */
  sentToday: number;
  quiet: boolean;
}
export interface PlanOut {
  /** New problems: open them (rows 'hopen:<id>'). */
  add: string[];
  /** Problems that cleared: close them. */
  close: string[];
  /** Problems in this message. */
  alert: string[];
  /** Cleared problems announced in this message (they were alerted before). */
  resolved: string[];
  text: string | null;
}
export function plan(p: PlanIn): PlanOut {
  const open = new Map(p.open.map(o => [o.id, o]));
  const add: string[] = [], close: string[] = [], resolved: string[] = [];
  for (const c of p.checks) {
    const o = open.get(c.id);
    if (c.status === 'problem' && !o) add.push(c.id);
    if (c.status === 'ok' && o) {
      if (!o.alerted) close.push(c.id);                     // healed before anyone was told: silent
      else if (!p.quiet) { close.push(c.id); resolved.push(c.id); }   // quiet hours: announced after them
    }
  }
  let alert: string[] = [];
  for (const c of p.checks) {
    if (c.status !== 'problem') continue;
    const o = open.get(c.id);
    if (p.now - (o?.since ?? p.now) < (c.graceMs ?? 0)) continue;
    if (o?.alerted && (c.once || p.now - (p.lastAlert[c.id] ?? 0) < REALERT)) continue;
    alert.push(c.id);
  }
  if (p.quiet) alert = [];
  if (p.sentToday >= PER_DAY || (!alert.length && !resolved.length)) return { add, close, alert: [], resolved: [], text: null };
  const by = new Map(p.checks.map(c => [c.id, c]));
  return { add, close, alert, resolved, text: healthText(alert.map(id => by.get(id)!), resolved.map(id => by.get(id)!)) };
}
export function healthText(problems: Check[], resolved: Check[]): string {
  const ok = resolved.map(c => `✅ resolved: ${esc(c.label)}${c.text ? ` — ${esc(c.text)}` : ''}`);
  if (!problems.length) return ok.join('\n');
  const head = problems.length === 1 ? [`⚠️ ${problems[0].text}`] : [`⚠️ <b>${problems.length} things need a look</b>`, ...problems.map(c => `• ${c.text}`)];
  return [...head, ...ok, '<i>/health for the full status</i>'].join('\n');
}

// ---- /health (the bot reads the last snapshot from rfx_coach_config.dispatch.health) --------------------------------
export interface HealthSnap { at: number; checks: { id: string; label: string; status: Check['status']; text: string }[]; last: Partial<Record<WfFile, number | null>>; keys: Record<KeyName, KeyState>; ghExpiry: number | null; app?: { live: string | null; builtAt: number | null; pendingSince: number | null } }
export function snapOf(s: Snapshot, checks: Check[]): HealthSnap {
  const last: Partial<Record<WfFile, number | null>> = {};
  for (const wf of HEALTH_WFS) { const r = s.runs[wf]; if (r) last[wf] = lastOk(r); }
  const lf = checks.find(c => c.id === 'fx')?.last, ls = checks.find(c => c.id === 'stock')?.last;
  if (lf != null) last['fx-scan.yml'] = newest(last['fx-scan.yml'], lf);
  if (ls != null) last['stock-scan.yml'] = newest(last['stock-scan.yml'], ls);
  const app = s.app ? { live: s.app.live, builtAt: s.app.builtAt ?? null, pendingSince: s.app.pendingSince ?? null } : undefined;
  return { at: s.now, checks: checks.map(c => ({ id: c.id, label: c.label, status: c.status, text: c.status === 'problem' ? c.text : '' })), last, keys: s.keys, ghExpiry: s.ghExpiry ?? null, ...(app ? { app } : {}) };
}
const KEY_ICON: Record<KeyState, string> = { ok: '✅', bad: '❌', absent: '—', error: '?' };
export function healthSummary(snap: HealthSnap | null | undefined, now: number): string {
  if (!snap || !Number.isFinite(snap.at)) return '🩺 <b>RamanFX health</b>\nNo check yet: the trader-coach watchdog checks every 30 min (it needs the coach running).';
  const line = (wf: WfFile) => `${WF_NAME[wf]}: last ok ${snap.last?.[wf] != null ? when(snap.last[wf], now) : 'n/a'}`;
  const out = [`🩺 <b>RamanFX health</b> · checked ${when(snap.at, now)}`];
  if (now - snap.at > 75 * MIN) out.push(`⚠️ last check was ${Math.round((now - snap.at) / HOUR)} h ago — is the trader coach running?`);
  out.push(line('fx-scan.yml'), line('stock-scan.yml'), `${line('movers.yml')} · brief ${snap.last?.['briefing.yml'] != null ? when(snap.last['briefing.yml'], now) : 'n/a'}`);
  if (snap.app) {
    const a = snap.app, data = (snap.checks ?? []).find(c => c.id === 'app-data')?.status;
    out.push(`App: ${a.live ? `live ${esc(a.live.slice(0, 7))}${a.builtAt != null ? ` (built ${when(a.builtAt, now)})` : ''}` : 'version unreadable'}`
      + `${a.pendingSince != null ? ` · app change waiting since ${when(a.pendingSince, now)}` : ''} · data ${data === 'ok' ? '✅' : data === 'problem' ? '❌' : '?'}`);
  }
  out.push(`Keys: ${KEYS.map(k => `${KEY_LABEL[k]} ${KEY_ICON[snap.keys?.[k] ?? 'error']}`).join(' · ')}`);
  if (snap.ghExpiry != null) {
    const p = calParts(snap.ghExpiry);
    out.push(`GitHub token expires ${MON[p.m - 1]} ${p.d} (${Math.max(0, Math.ceil((snap.ghExpiry - now) / DAY))} days)`);
  }
  const probs = (snap.checks ?? []).filter(c => c.status === 'problem');
  out.push('', ...(probs.length ? probs.map(c => `⚠️ ${c.text}`) : ['All good.']));
  out.push('<i>The watchdog stays silent while things work: one message when something breaks, one when it clears.</i>');
  return out.join('\n');
}

// ---- I/O (injected fetch; never logs or returns a secret) -------------------------------------------------------------
export interface HealthEnv { gh: string; oanda: string; oandaLive: boolean; alpacaId: string; alpacaSecret: string; tg: string }
type F = (url: string, init?: RequestInit) => Promise<Response>;
/** 'YYYY-MM-DD HH:MM:SS UTC' / '... +0000' / '... -0800' (GitHub's header) -> UTC ms. */
export function parseExpiry(v: string | null): number | null {
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}(?::\d{2})?)\s*(UTC|Z|[+-]\d{2}:?\d{2})?$/.exec((v ?? '').trim());
  if (!m) return null;
  const z = !m[3] || m[3] === 'UTC' || m[3] === 'Z' ? 'Z' : m[3].replace(/^([+-]\d{2}):?(\d{2})$/, '$1:$2');
  const t = Date.parse(`${m[1]}T${m[2]}${z}`);
  return Number.isFinite(t) ? t : null;
}
const keyState = (status: number): KeyState => (status >= 200 && status < 300 ? 'ok' : status === 401 || status === 403 ? 'bad' : 'error');
async function probe(f: F, url: string, init: RequestInit, bad404 = false): Promise<KeyState> {
  try {
    const r = await f(url, { ...init, signal: AbortSignal.timeout(6000) });
    const body = r.ok ? '' : (await r.text().catch(() => '')).replace(/\s+/g, ' ').slice(0, 120);
    if (!r.ok) console.log(JSON.stringify({ ev: 'probe', host: new URL(url).host, status: r.status, body }));
    else await r.body?.cancel();
    return bad404 && r.status === 404 ? 'bad' : keyState(r.status);
  } catch { return 'error'; }
}
export async function gather(env: HealthEnv, f: F, now: number): Promise<Snapshot> {
  const runs: Snapshot['runs'] = {};
  let github = (env.gh ? 'error' : 'absent') as KeyState;
  let ghExpiry = undefined as number | null | undefined;
  if (env.gh) {
    const headers = { Authorization: `Bearer ${env.gh}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ramanfx-coach' };
    await Promise.all(HEALTH_WFS.map(async wf => {
      try {
        const r = await f(`https://api.github.com/repos/${REPO}/actions/workflows/${wf}/runs?per_page=${PER_PAGE[wf]}&exclude_pull_requests=true`, { headers, signal: AbortSignal.timeout(6000) });
        if (!r.ok) {
          await r.body?.cancel();
          const limited = r.status === 403 && r.headers.get('x-ratelimit-remaining') === '0';
          if (!limited && (r.status === 401 || r.status === 403 || r.status === 404)) github = 'bad';
          return;
        }
        if (github !== 'bad') github = 'ok';
        if (ghExpiry === undefined) ghExpiry = parseExpiry(r.headers.get('github-authentication-token-expiration'));
        runs[wf] = parseRuns(await r.json());
      } catch { /* network: unknown */ }
    }));
  }
  const [oanda, alpaca, telegram] = await Promise.all([
    env.oanda ? probe(f, `https://${env.oandaLive ? 'api-fxtrade' : 'api-fxpractice'}.oanda.com/v3/instruments/EUR_USD/candles?count=1&granularity=H1&price=M`, { headers: { Authorization: `Bearer ${env.oanda}` } }) : Promise.resolve<KeyState>('absent'),
    env.alpacaId && env.alpacaSecret ? probe(f, 'https://data.alpaca.markets/v2/stocks/AAPL/trades/latest?feed=iex', { headers: { 'APCA-API-KEY-ID': env.alpacaId, 'APCA-API-SECRET-KEY': env.alpacaSecret, Accept: 'application/json' } }) : Promise.resolve<KeyState>('absent'),
    env.tg ? probe(f, `https://api.telegram.org/bot${env.tg}/getMe`, {}, true) : Promise.resolve<KeyState>('absent'),
  ]);
  return { now, runs, keys: { github, oanda, alpaca, telegram }, ghExpiry: github === 'ok' ? ghExpiry ?? null : undefined };
}
// The scheduled jobs commit their data to the `data` branch, never main (scripts/data-branch.sh): the FX file check
// (fresh within hours on a trading day) is therefore also the check that the data branch gets new commits.
export const DATA_RAW = `https://raw.githubusercontent.com/${REPO}/data/public`;
const FILE_URL: Record<FileName, [string, string]> = {
  fx: [`${DATA_RAW}/fx/latest.json`, 'generated'],
  stock: [`${DATA_RAW}/scanner/latest.json`, 'generated_at'],
  fund: [`${DATA_RAW}/fundamentals/fx.json`, 'generated_at'],
};
/** Generated times of the published files (public repo, no token). */
export async function gatherFiles(need: FileName[], f: F): Promise<Partial<Record<FileName, number | null>>> {
  const out: Partial<Record<FileName, number | null>> = {};
  await Promise.all(need.map(async k => {
    try {
      const r = await f(FILE_URL[k][0], { signal: AbortSignal.timeout(8000) });
      if (!r.ok) { await r.body?.cancel(); return; }
      const t = Date.parse(String((await r.json())?.[FILE_URL[k][1]] ?? ''));
      out[k] = Number.isFinite(t) ? t : null;
    } catch { /* unknown */ }
  }));
  return out;
}
// ---- the web app (public: no secret needed for the app / raw files; the GitHub token only for the compare API) ------
const SHA = /^[0-9a-f]{40}$/;
async function getJson(f: F, url: string, init: RequestInit = {}): Promise<unknown> {
  const r = await f(url, { ...init, signal: AbortSignal.timeout(8000) });
  if (!r.ok) { await r.body?.cancel(); throw new Error(String(r.status)); }
  return await r.json();
}
const genOf = (js: unknown): number | null => { const t = Date.parse(String((js as { generated?: unknown })?.generated ?? '')); return Number.isFinite(t) ? t : null; };
interface Cmp { status: string; files: string[]; truncated: boolean; commits: { sha: string; at: number }[] }
const parseCmp = (js: unknown): Cmp => {
  const o = (js ?? {}) as { status?: unknown; files?: unknown[]; commits?: unknown[] };
  const files = (Array.isArray(o.files) ? o.files : []).map(x => String((x as { filename?: unknown })?.filename ?? ''));
  const commits = (Array.isArray(o.commits) ? o.commits : []).map(x => {
    const c = (x ?? {}) as { sha?: unknown; commit?: { committer?: { date?: unknown }; author?: { date?: unknown } } };
    return { sha: String(c.sha ?? ''), at: Date.parse(String(c.commit?.committer?.date ?? c.commit?.author?.date ?? '')) };
  }).filter(c => SHA.test(c.sha) && Number.isFinite(c.at));
  return { status: String(o.status ?? ''), files, truncated: files.length >= 300, commits };
};
const touchesApp = (c: Cmp) => c.truncated || c.files.some(isAppPath);
/** Commit time of the oldest commit after `live` on main that changes the app; null = none; undefined = unknown. */
export async function pendingSince(f: F, gh: string, live: string): Promise<number | null | undefined> {
  const headers = { Authorization: `Bearer ${gh}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ramanfx-coach' };
  const cmp = async (head: string) => parseCmp(await getJson(f, `https://api.github.com/repos/${REPO}/compare/${live}...${head}`, { headers }));
  try {
    const all = await cmp('main');
    if (all.status === 'identical' || all.status === 'behind' || !all.commits.length || !touchesApp(all)) return null;
    // the commits come oldest first (up to 250): binary search for the first one whose diff from `live` touches the app
    // (<= 8 calls, only while an app change is waiting)
    let lo = 0, hi = all.commits.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (touchesApp(await cmp(all.commits[mid].sha))) { found = mid; hi = mid - 1; } else lo = mid + 1;
    }
    return found < 0 ? undefined : all.commits[found].at;
  } catch { return undefined; }
}
export async function gatherApp(f: F, gh: string): Promise<AppSnap> {
  const raw = (k: AppFile) => `${DATA_RAW}/${k}/latest.json`;   // what the app's vercel.json rewrites serve
  const nc: RequestInit = { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } };
  const [ver, ...data] = await Promise.all([
    getJson(f, `${APP_URL}/version.json`, nc).catch(() => null),
    ...APP_FILES.map(async k => {
      const [a, r] = await Promise.all([getJson(f, `${APP_URL}/${k}/latest.json`, nc).then(genOf, () => undefined), getJson(f, raw(k)).then(genOf, () => undefined)]);
      return [k, { app: a, raw: r }] as const;
    }),
  ]);
  const v = (ver ?? {}) as { sha?: unknown; built_at?: unknown };
  const live = typeof v.sha === 'string' && SHA.test(v.sha) ? v.sha : null;
  const built = Date.parse(String(v.built_at ?? ''));
  return { live, builtAt: Number.isFinite(built) ? built : null, pendingSince: live && gh ? await pendingSince(f, gh, live) : undefined, data: Object.fromEntries(data) };
}

/** Event-row helpers (rfx_coach_events keys). */
export const tickKey = (now: number) => { const t = new Date(now); return `health:${t.toISOString().slice(0, 13)}:${t.getUTCMinutes() < 30 ? 0 : 1}`; };
export const calMidnight = (now: number) => { const c = calParts(now); return calUtc(c.y, c.m, c.d, 0, 0); };
export function stateOf(rows: { key: string; kind: string; sent: boolean; created_at: string }[], now: number): { open: Open[]; lastAlert: Record<string, number>; sentToday: number } {
  const open: Open[] = [], lastAlert: Record<string, number> = {};
  let sentToday = 0;
  const mid = calMidnight(now);
  for (const r of rows) {
    const at = Date.parse(r.created_at);
    if (r.kind === 'health-open' && r.key.startsWith('hopen:')) open.push({ id: r.key.slice(6), since: at, alerted: !!r.sent });
    else if (r.kind === 'health-alert' && r.key.startsWith('halert:')) {
      const id = r.key.slice(7, r.key.lastIndexOf(':'));
      lastAlert[id] = Math.max(lastAlert[id] ?? 0, at);
    } else if (r.kind === 'health-msg' && at >= mid) sentToday++;
  }
  return { open, lastAlert, sentToday };
}
