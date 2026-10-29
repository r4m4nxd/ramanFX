// Reliable scheduler for the GitHub Actions workflows (GitHub's own cron drops most scheduled runs). The coach's
// 10-minute pg_cron tick asks dueDispatches(now) which workflow slots are due; index.ts dispatches each slot once
// (POST /actions/workflows/<file>/dispatches, ref main) unless a GitHub run already started inside the slot.
// Every dispatch is "scheduled-equivalent": the workflow's own checks decide exactly as on a cron run
//   (fx-scan also outside the forex week, slot 'fxc:<hour>': crypto trades 24/7, its --check runs a crypto-only scan)
//   fx-scan.yml / stock-scan.yml: input scheduled=true (the --check / 'already scanned today' step decides);
//   briefing.yml: test=false (its Calgary-clock decide() + state.json dedupe);  reminders.yml: no inputs (its window logic);
//   movers.yml: no inputs (hourly big moves, its own per-hour dedupe), with the FX slot of every forex-week hour.
//   fundamentals.yml: input scheduled=true (skips when today's files are built), weekdays 18:00-19:00 New York.
// The bot's on-demand scans (run name 'FX on-demand scan SYM' / 'Stock on-demand scan SYM') never cover a slot.
// Pure: no Deno, no network (tests: src/core/traderCoach.test.ts).
import { calParts } from './core.ts';

export const REPO = 'r4m4nxd/ramanFX';
export interface Dispatch {
  /** Workflow file in .github/workflows. */
  wf: 'fx-scan.yml' | 'stock-scan.yml' | 'briefing.yml' | 'reminders.yml' | 'movers.yml' | 'fundamentals.yml';
  /** Dedupe key: one dispatch per slot (rfx_coach_events 'dispatch:<slot>'). */
  slot: string;
  /** Slot start (UTC ms): a GitHub run created at or after this already covers the slot. */
  since: number;
  inputs: Record<string, string>;
}

// ---- New York clock (forex week, US close) -------------------------------------------------------------------------
let nyFmt: Intl.DateTimeFormat | null = null;
export function nyParts(ms: number) {
  nyFmt ??= new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', weekday: 'short', hourCycle: 'h23' });
  const p: Record<string, string> = {};
  for (const x of nyFmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, wd };
}
const p2 = (n: number) => String(n).padStart(2, '0');
const key = (p: { y: number; m: number; d: number }) => `${p.y}-${p2(p.m)}-${p2(p.d)}`;

/** Forex week: Sunday 17:00 -> Friday 17:00 New York. True when an H1 candle closing at `closeMs` belongs to it. */
export function fxBarCloses(closeMs: number): boolean {
  const n = nyParts(closeMs);
  const mins = n.h * 60 + n.mi;
  if (n.wd === 6) return false;
  if (n.wd === 0) return mins > 17 * 60;          // first bar 17:00-18:00 closes at 18:00
  if (n.wd === 5) return mins <= 17 * 60;         // last bar closes at 17:00 Friday
  return true;
}

/** Minutes after each H1 close in which the coach dispatches the FX scan (two 10-min ticks land in it). */
export const FX_WINDOW: [number, number] = [5, 25];

export function dueDispatches(nowUtc: number): Dispatch[] {
  const out: Dispatch[] = [];
  const t = new Date(nowUtc);

  // FX: once per H1 close, :05-:25 past the hour (UTC hours: H1 candles are on the hour in every zone used here).
  const mi = t.getUTCMinutes();
  if (mi >= FX_WINDOW[0] && mi < FX_WINDOW[1]) {
    const close = Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), t.getUTCDate(), t.getUTCHours());
    if (fxBarCloses(close)) {
      const h = new Date(close).toISOString().slice(0, 13);
      out.push({ wf: 'fx-scan.yml', slot: `fx:${h}`, since: close, inputs: { scheduled: 'true' } });
      out.push({ wf: 'movers.yml', slot: `movers:${h}`, since: close, inputs: {} });   // hourly big moves (FX + US stocks)
    } else {
      // Weekend: crypto trades 24/7. Same scheduled-equivalent dispatch; the workflow's --check finds the forex candle
      // already scanned and runs the crypto-only scan when a new crypto H1 candle closed.
      out.push({ wf: 'fx-scan.yml', slot: `fxc:${new Date(close).toISOString().slice(0, 13)}`, since: close, inputs: { scheduled: 'true' } });
    }
  }

  // Stocks: weekdays (New York), 30 min after the 16:00 NY close (20:30 UTC in summer, 21:30 UTC in winter), and a
  // second try 3 h later (the scan's 'already scanned today' check makes it a no-op when the first one ran).
  const ny = nyParts(nowUtc);
  if (ny.wd >= 1 && ny.wd <= 5) {
    const m = ny.h * 60 + ny.mi;
    const startOf = (hm: number) => nowUtc - (m - hm) * 60000 - (nowUtc % 60000);
    for (const [name, at] of [['a', 16 * 60 + 30], ['b', 19 * 60 + 30]] as const)
      if (m >= at && m < at + 60) out.push({ wf: 'stock-scan.yml', slot: `stock:${key(ny)}:${name}`, since: startOf(at), inputs: { scheduled: 'true' } });
    // Fundamentals (bot /fund): after the first stock scan, 18:00-19:00 New York (prices of that day's scan).
    if (m >= 18 * 60 && m < 19 * 60) out.push({ wf: 'fundamentals.yml', slot: `fund:${key(ny)}`, since: startOf(18 * 60), inputs: { scheduled: 'true' } });
  }

  // Calgary weekday mornings (zone rules incl. the permanent UTC-6 from 2026-11-01).
  const c = calParts(nowUtc);
  if (c.wd >= 1 && c.wd <= 5) {
    const m = c.h * 60 + c.mi;
    const startOf = (hm: number) => nowUtc - (m - hm) * 60000 - (nowUtc % 60000);
    // Morning brief: due from 5:55 AM; dispatch in 5:55-6:30 (its decide() sends once, 5:55-6:40).
    if (m >= 5 * 60 + 55 && m < 6 * 60 + 30) out.push({ wf: 'briefing.yml', slot: `brief:${key(c)}`, since: startOf(5 * 60 + 55), inputs: { test: 'false' } });
    // Event reminders: every 30 min, 4:00 AM - 2:00 PM.
    if (m >= 4 * 60 && m < 14 * 60) {
      const b = m - (m % 30);
      out.push({ wf: 'reminders.yml', slot: `rem:${key(c)}T${p2(Math.floor(b / 60))}:${p2(b % 60)}`, since: startOf(b), inputs: {} });
    }
  }
  return out;
}

/** The latest GitHub run of the workflow (created_at, UTC ms) already covers the slot. */
export const covered = (d: Dispatch, latestRunCreatedMs: number | null) => latestRunCreatedMs != null && latestRunCreatedMs >= d.since;

/** The dispatch request (never logged: it carries the token). */
export function dispatchRequest(d: Dispatch, token: string): { url: string; init: RequestInit } {
  return {
    url: `https://api.github.com/repos/${REPO}/actions/workflows/${d.wf}/dispatches`,
    init: {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ramanfx-coach', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ref: 'main', inputs: d.inputs }),
    },
  };
}
export const latestRunUrl = (d: Dispatch) => `https://api.github.com/repos/${REPO}/actions/workflows/${d.wf}/runs?per_page=10`;
/** Created time (UTC ms) of the newest run that is not one of the bot's on-demand scans (they scan one symbol). */
export function latestRunMs(js: unknown): number | null {
  const runs = (js as { workflow_runs?: { created_at?: string; display_title?: string; name?: string }[] })?.workflow_runs;
  const r = (Array.isArray(runs) ? runs : []).find(x => !/on-demand/i.test(String(x?.display_title ?? '')));
  const t = Date.parse(r?.created_at ?? '');
  return Number.isFinite(t) ? t : null;
}
