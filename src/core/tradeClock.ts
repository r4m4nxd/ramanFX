// The trading clock (Market hours page): a 24-hour dial of how busy each Calgary half-hour is, for one symbol or for
// the whole forex market, with "what is happening now" and "what comes next". Pure logic; the dial is ui/TradeClock.
import { addMinutes, MH_SLOTS, slotLabel, type MhSymbol } from './marketHours';

export const CLOCK_TZ = 'America/Edmonton';
export type Level = 'closed' | 'quiet' | 'normal' | 'busy' | 'peak';
export const LEVEL_LABEL: Record<Level, string> = { closed: 'Closed', quiet: 'Quiet', normal: 'Normal', busy: 'Busy', peak: 'Very busy' };
export const LEVEL_HINT: Record<Level, string> = {
  closed: 'No trading in this half-hour', quiet: 'Small moves, wide spreads: usually not worth it', normal: 'Ordinary movement',
  busy: 'More movement than usual', peak: 'The biggest moves of the day happen here',
};

/** Activity (1.0 = a typical half-hour) to a level. */
export function levelOf(v: number | null | undefined): Level {
  if (v == null || v <= 0.02) return 'closed';
  if (v >= 1.6) return 'peak';
  if (v >= 1.15) return 'busy';
  if (v >= 0.7) return 'normal';
  return 'quiet';
}

export interface ClockWindow { rank: number; from: number; to: number; peak: number; activity: number | null }
export interface ClockData {
  key: string; title: string; sub: string;
  /** 48 Calgary half-hours, x typical. */
  profile: (number | null)[];
  windows: ClockWindow[];
  /** Mon..Fri multiplier (1.0 = an average day). */
  days: (number | null)[];
  /** Trades around the clock on weekdays (forex / metals / CFDs): the weekend rule and the session ring apply. */
  roundTheClock: boolean;
}

export const slotOf = (t: string): number => { const [h, m] = t.split(':').map(Number); return ((h * 2 + (m >= 30 ? 1 : 0)) % MH_SLOTS + MH_SLOTS) % MH_SLOTS; };
const span = (from: number, to: number) => ((to - from + MH_SLOTS) % MH_SLOTS) || 1;
export const inWindow = (w: Pick<ClockWindow, 'from' | 'to'>, slot: number) => ((slot - w.from + MH_SLOTS) % MH_SLOTS) < span(w.from, w.to);

/** One symbol of the market-hours study as clock data. */
export function symbolClock(s: MhSymbol): ClockData {
  const stock = s.kind === 'stock' || s.kind === 'etf';
  return {
    key: s.sym, title: s.sym, sub: s.display && s.display !== s.sym ? s.display : s.name !== s.sym ? s.name : '',
    profile: s.profile,
    windows: s.windows.slice(0, 3).map((w, i) => ({ rank: i + 1, from: slotOf(w.from), to: slotOf(w.to), peak: slotOf(w.mt), activity: w.activity })),
    days: s.days, roundTheClock: !stock,
  };
}

/** The best `n` windows of a profile: the highest half-hours at least `gap` slots apart, each grown to its neighbours
 *  that keep 85% of the peak (at most 2 h wide). */
export function topWindows(profile: (number | null)[], n = 3, gap = 4): ClockWindow[] {
  const v = profile.map(x => x ?? 0);
  const order = v.map((x, i) => ({ x, i })).filter(o => o.x > 1).sort((a, b) => b.x - a.x);
  const picked: number[] = [];
  for (const o of order) {
    if (picked.length >= n) break;
    if (picked.every(p => Math.min((o.i - p + MH_SLOTS) % MH_SLOTS, (p - o.i + MH_SLOTS) % MH_SLOTS) >= gap)) picked.push(o.i);
  }
  return picked.map((p, k) => {
    let a = p, b = p;
    while (span(a, b + 1) < 4 && v[(a - 1 + MH_SLOTS) % MH_SLOTS] >= 0.85 * v[p]) a = (a - 1 + MH_SLOTS) % MH_SLOTS;
    while (span(a, b + 1) < 4 && v[(b + 1) % MH_SLOTS] >= 0.85 * v[p]) b = (b + 1) % MH_SLOTS;
    return { rank: k + 1, from: a, to: (b + 1) % MH_SLOTS, peak: p, activity: v[p] };
  });
}

/** The whole forex market: the average day of the major pairs (and gold when it is in the study). */
export function globalClock(list: MhSymbol[]): ClockData | null {
  const pool = list.filter(s => s.kind === 'major' || s.sym === 'XAUUSD');
  if (!pool.length) return null;
  const mean = (get: (s: MhSymbol) => number | null) => { const xs = pool.map(get).filter((x): x is number => x != null); return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null; };
  const profile = Array.from({ length: MH_SLOTS }, (_, i) => mean(s => s.profile[i]));
  return {
    key: 'global', title: 'Forex market', sub: `Average of ${pool.length} major markets`, profile, windows: topWindows(profile),
    days: [0, 1, 2, 3, 4].map(i => mean(s => s.days[i])), roundTheClock: true,
  };
}

// ---- time ------------------------------------------------------------------------------------------------------------
export interface ZoneTime { weekday: number; h: number; m: number; s: number }
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fmtCache = new Map<string, Intl.DateTimeFormat>();
/** Wall-clock time of `at` in an IANA zone (weekday 0 = Sunday). */
export function zoneTime(at: Date, tz: string = CLOCK_TZ): ZoneTime {
  let f = fmtCache.get(tz);
  if (!f) { f = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit' }); fmtCache.set(tz, f); }
  const p: Record<string, string> = {};
  for (const x of f.formatToParts(at)) p[x.type] = x.value;
  return { weekday: Math.max(0, WD.indexOf(p.weekday)), h: Number(p.hour) % 24, m: Number(p.minute), s: Number(p.second) };
}
export const minutesOf = (t: ZoneTime) => t.h * 60 + t.m + t.s / 60;

/** The four forex sessions, as Calgary half-hour slots today (their local 8:00-17:00, Sydney 7:00-16:00, Tokyo 9:00-18:00;
 *  each city's own daylight-saving rule is applied through the time zone database). */
export interface Session { id: string; label: string; from: number; to: number }
const SESSIONS: { id: string; label: string; tz: string; open: number; close: number }[] = [
  { id: 'sydney', label: 'Sydney', tz: 'Australia/Sydney', open: 7, close: 16 },
  { id: 'tokyo', label: 'Tokyo', tz: 'Asia/Tokyo', open: 9, close: 18 },
  { id: 'london', label: 'London', tz: 'Europe/London', open: 8, close: 17 },
  { id: 'newyork', label: 'New York', tz: 'America/New_York', open: 8, close: 17 },
];
export function sessions(at: Date): Session[] {
  const here = minutesOf(zoneTime(at));
  return SESSIONS.map(s => {
    const diff = here - minutesOf(zoneTime(at, s.tz));           // Calgary minus the city, minutes (mod one day)
    const slot = (hour: number) => (((Math.round((hour * 60 + diff) / 30) % MH_SLOTS) + MH_SLOTS) % MH_SLOTS);
    return { id: s.id, label: s.label, from: slot(s.open), to: slot(s.close) };
  });
}

export const NY_TZ = 'America/New_York';
/** Forex weekend: Friday 17:00 to Sunday 17:00 New York. */
export function fxWeekend(at: Date): boolean {
  const t = zoneTime(at, NY_TZ);
  return (t.weekday === 5 && t.h >= 17) || t.weekday === 6 || (t.weekday === 0 && t.h < 17);
}

/** How many minutes New York is ahead of Calgary right now (120, or 60 in winter since Alberta keeps summer time). */
export function nyAheadMin(at: Date): number {
  const d = Math.round(minutesOf(zoneTime(at, NY_TZ)) - minutesOf(zoneTime(at)));
  return ((d % 1440) + 1440) % 1440;
}
/** The study is in Calgary clock time with New York 2 h ahead. Markets follow New York, so when the gap is smaller
 *  everything happens later on the Calgary clock: this many half-hours later. */
export const shiftSlots = (at: Date): number => Math.round((120 - nyAheadMin(at)) / 30);
const rot = <T,>(a: T[], k: number): T[] => a.map((_, i) => a[(((i - k) % a.length) + a.length) % a.length]);
const mv = (slot: number, k: number) => (((slot + k) % MH_SLOTS) + MH_SLOTS) % MH_SLOTS;
export function shiftClock(c: ClockData, k: number): ClockData {
  return k ? { ...c, profile: rot(c.profile, k), windows: c.windows.map(w => ({ ...w, from: mv(w.from, k), to: mv(w.to, k), peak: mv(w.peak, k) })) } : c;
}
/** The same shift for a whole study row (the tables and the bar chart of the Market hours page). */
export function shiftSymbol(s: MhSymbol, k: number): MhSymbol {
  if (!k) return s;
  const t = (x: string) => addMinutes(x, k * 30), tn = (x: string | null) => (x ? t(x) : x);
  return { ...s, profile: rot(s.profile, k), windows: s.windows.map(w => ({ ...w, mt: t(w.mt), from: t(w.from), to: t(w.to) })),
    era: { ...s.era, peakPre: tn(s.era.peakPre), peakPost: tn(s.era.peakPost), peakRecent: tn(s.era.peakRecent) } };
}

export interface ClockNow {
  slot: number; activity: number | null; level: Level; closed: boolean;
  /** The best window we are inside, if any. */
  inside: ClockWindow | null; insideLeftMin: number;
  /** The next best window to start. */
  next: ClockWindow | null; nextInMin: number;
  /** Today's weekday multiplier (null on the weekend). */
  dayFactor: number | null; dayName: string;
  headline: string; detail: string;
}

export const fmtDur = (min: number): string => {
  const m = Math.max(0, Math.round(min));
  return m < 60 ? `${m} min` : m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${Math.floor(m / 60)} h`;
};
/** "06:30" -> "6:30 AM" */
export const fmt12 = (slotOrLabel: number | string): string => {
  const [h, m] = (typeof slotOrLabel === 'number' ? slotLabel(slotOrLabel) : slotOrLabel).split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** What the clock says right now. */
export function clockNow(c: ClockData, at: Date): ClockNow {
  const t = zoneTime(at);
  const mins = minutesOf(t);
  const slot = Math.floor(mins / 30) % MH_SLOTS;
  const weekend = c.roundTheClock ? fxWeekend(at) : t.weekday === 0 || t.weekday === 6;
  const activity = weekend ? null : c.profile[slot] ?? null;
  const level = weekend ? 'closed' : levelOf(activity);
  const closed = level === 'closed';
  const inside = closed ? null : c.windows.find(w => inWindow(w, slot)) ?? null;
  const until = (s: number) => (((s * 30 - mins) % 1440) + 1440) % 1440;
  const insideLeftMin = inside ? until(inside.to) || 1440 : 0;
  const upcoming = c.windows.filter(w => w !== inside).map(w => ({ w, d: until(w.from) })).sort((a, b) => a.d - b.d)[0];
  const dayFactor = t.weekday >= 1 && t.weekday <= 5 ? c.days[t.weekday - 1] ?? null : null;
  let headline: string, detail: string;
  if (weekend) {
    headline = 'Market closed';
    const ahead = nyAheadMin(at);
    detail = c.roundTheClock ? `Forex opens Sunday ${fmt12(addMinutes('17:00', -ahead))}` : `Stocks open Monday ${fmt12(addMinutes('09:30', -ahead))}`;
  } else if (closed) {
    headline = 'Closed now';
    detail = upcoming ? `Best time ${fmt12(upcoming.w.from)}, in ${fmtDur(upcoming.d)}` : 'No trading in this half-hour';
  } else if (inside) {
    headline = `Best time #${inside.rank} is on`;
    detail = `${fmtDur(insideLeftMin)} left, until ${fmt12(inside.to)}`;
  } else {
    headline = LEVEL_LABEL[level];
    detail = upcoming ? `Next best time ${fmt12(upcoming.w.from)}, in ${fmtDur(upcoming.d)}` : LEVEL_HINT[level];
  }
  return { slot, activity, level, closed, inside, insideLeftMin, next: upcoming?.w ?? null, nextInMin: upcoming?.d ?? 0, dayFactor, dayName: WD[t.weekday], headline, detail };
}
