// The Decision Desk and the Today page: every market on the owner's own watchlist, judged automatically from files the
// scanners already publish. Four lights per market: is it a good time (market-hours study), is price at an area, do
// the owner's rules pass (the scanner's rule check), and is there room left in today's move. Pure logic; the pages are
// pages/Desk.tsx and pages/Today.tsx. It reports conditions; it never says a trade will win.
import { MH_SLOTS } from './marketHours';
import { NY_TZ, nyAheadMin, zoneTime, minutesOf } from './tradeClock';

export const DESK_DEFAULT = ['EURUSD', 'XAUUSD', 'NAS100'];
export const DESK_MAX = 24;
export type Light = 'g' | 'a' | 'r' | 'n';
export type Verdict = 'ready' | 'close' | 'wait' | 'done' | 'closed';
export const VERDICT_LABEL: Record<Verdict, string> = { ready: 'Ready', close: 'Close', wait: 'Wait', done: 'Done today', closed: 'Closed' };
export const TF_WORD: Record<string, string> = { H1: 'hourly', H4: '4-hour', D1: 'daily', W1: 'weekly', MN: 'monthly' };
const BIG = ['D1', 'W1', 'MN'];
/** The scanner's rule names in plain words (what must be true). */
export const RULE_WORD: Record<string, string> = {
  location: 'At a bigger-timeframe area', 'no 3rd CP': 'Not the third try in a row', 'not used': 'Area has not done its job yet', 'market TF': 'Right timeframe for this market',
  trendline: 'Trend line agrees', blind: 'Confirmed, not a blind entry', 'HTF opposite': 'Nothing bigger blocking it', 'near entry': 'Price is near the entry',
  direction: 'Trend direction agrees', clean: 'Clean area, no overlap', strong: 'Strong type of area', leg: 'Strong move away from it', weekend: 'Not right before the weekend',
  sideways: 'Market is not sideways', 'out of TL': 'Formed outside the trend line', room: 'Room to target is 2× the risk', fresh: 'Untouched since it formed',
  curve: 'On the right side of the range', spread: 'Spread is small enough', reduced: 'Full-size direction', area: 'Inside a bigger area', context: '3-month picture agrees', 'gold TF': 'Gold timeframe rule',
};

export interface DeskArea { tf: string; side: 'D' | 'S'; lo: number; hi: number; pct: number; inside: boolean }
export interface DeskRule { short: string; status: 'p' | 'f' | 'w' | 'u' }
export interface DeskInst {
  sym: string; cls: string; price: number; digits: number;
  /** Average daily range of the 14 days before today. */
  adr: number | null;
  /** Today's hourly candles: [broker hour 0-23, high, low]; the broker day starts at 17:00 New York. */
  hours: [number, number, number][];
  prev: { high: number; low: number; close: number } | null;
  /** The scanner's own "price is in / near an area" hit. */
  place: { sec: 'in' | 'near'; tf: string; side: 'D' | 'S' } | null;
  /** Nearest daily-or-bigger buy area at or below price and sell area at or above. */
  buy: DeskArea | null; sell: DeskArea | null;
  /** The rule check of the area in `place` (or the setup closest to passing). */
  check: { tf: string; side: 'D' | 'S'; rules: DeskRule[] } | null;
  signal: boolean;
}

type J = Record<string, unknown>;
const obj = (v: unknown): J => (v && typeof v === 'object' && !Array.isArray(v) ? (v as J) : {});
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const sideOf = (v: unknown): 'D' | 'S' => (str(v).toLowerCase().startsWith('s') ? 'S' : 'D');

/** One instrument of a /fx/d/<class>.json shard; null when it has no price. */
export function parseDeskInst(shard: unknown, sym: string): DeskInst | null {
  const o = obj(obj(obj(shard).instruments)[sym]);
  const price = num(o.price);
  if (price == null || price <= 0) return null;
  const bars = obj(o.bars);
  const d1 = arr(bars.D1).map(arr).filter(b => num(b[2]) != null && num(b[3]) != null);
  const today = d1.length ? str(d1[d1.length - 1][0]).slice(0, 10) : '';
  const adr = d1.length >= 16 ? d1.slice(-15, -1).reduce((a, b) => a + (b[2] as number) - (b[3] as number), 0) / 14 : null;
  const hours = arr(bars.H1).map(arr).filter(b => str(b[0]).slice(0, 10) === today && num(b[2]) != null && num(b[3]) != null)
    .map(b => [Number(str(b[0]).slice(11, 13)), b[2] as number, b[3] as number] as [number, number, number]);
  const p = d1.length >= 2 ? d1[d1.length - 2] : null;
  const areas: { D: DeskArea | null; S: DeskArea | null } = { D: null, S: null };
  for (const z of arr(o.zones).map(obj)) {
    const a = num(z.proximal), b = num(z.distal), tf = str(z.tf);
    if (a == null || b == null || !BIG.includes(tf)) continue;
    const lo = Math.min(a, b), hi = Math.max(a, b), side = sideOf(z.side);
    const pct = price >= lo && price <= hi ? 0 : side === 'D' && price > hi ? ((price - hi) / price) * 100 : side === 'S' && price < lo ? ((lo - price) / price) * 100 : null;
    if (pct == null) continue;
    const cur = areas[side];
    if (!cur || pct < cur.pct || (pct === cur.pct && BIG.indexOf(tf) > BIG.indexOf(cur.tf))) areas[side] = { tf, side, lo, hi, pct, inside: pct === 0 };
  }
  const hits = arr(o.hits).map(obj);
  const hit = hits.find(h => h.section === 'in') ?? hits.find(h => h.section === 'near') ?? null;
  const checks = arr(o.checks).map(obj);
  const fails = (c: J) => arr(c.rules).map(obj).filter(r => r.status === 'fail').length;
  const ck = (hit && checks.find(c => c.zid === hit.zid)) || checks.slice().sort((a, b) => fails(a) - fails(b) || (num(a.pips) ?? 0) - (num(b.pips) ?? 0))[0] || null;
  return {
    sym, cls: str(o.cls), price, digits: num(o.digits) ?? 5, adr: adr && adr > 0 ? adr : null, hours,
    prev: p && num(p[4]) != null ? { high: p[2] as number, low: p[3] as number, close: p[4] as number } : null,
    place: hit ? { sec: hit.section === 'in' ? 'in' : 'near', tf: str(hit.tf), side: sideOf(hit.side) } : null,
    buy: areas.D, sell: areas.S,
    check: ck ? { tf: str(ck.tf), side: sideOf(ck.side), rules: arr(ck.rules).map(obj).map(r => ({ short: str(r.short), status: (str(r.status)[0] || 'u') as DeskRule['status'] })) } : null,
    signal: arr(o.signals).length > 0,
  };
}

// ---- time: the study's clock is New York minus 2 h; its weekday rows are Monday..Sunday -------------------------------
export interface Moment { live: boolean; closed: boolean; nyWeekday: number; nyMin: number; ahead: number; brokerHour: number | null }
/** Now. Forex is closed from Friday 17:00 to Sunday 17:00 New York. */
export function momentOf(at: Date): Moment {
  const ny = zoneTime(at, NY_TZ), m = Math.floor(minutesOf(ny));
  const closed = (ny.weekday === 5 && m >= 1020) || ny.weekday === 6 || (ny.weekday === 0 && m < 1020);
  return { live: true, closed, nyWeekday: ny.weekday, nyMin: m, ahead: nyAheadMin(at), brokerHour: null };
}
/** {row 0 = Monday .. 6 = Sunday, slot, min} on the study's clock. */
export function studyAt(m: Pick<Moment, 'nyWeekday' | 'nyMin'>): { row: number; slot: number; min: number; weekday: number } {
  let min = m.nyMin - 120, wd = m.nyWeekday;
  if (min < 0) { min += 1440; wd = (wd + 6) % 7; }
  return { row: (wd + 6) % 7, slot: Math.floor(min / 30), min, weekday: wd };
}
type Week = (number | null)[][] | null | undefined;
const rowOf = (week: Week, fallback: Week, row: number) => (week ?? fallback)?.[row] ?? null;
/** The best half-hours of a weekday row: its highest ones at least 2 h apart, earliest first. */
export function bestSlots(row: (number | null)[] | null): number[] {
  if (!row) return [];
  const out: number[] = [];
  for (const o of row.map((x, k) => ({ x: x ?? 0, k })).filter(o => o.x > 1.1).sort((a, b) => b.x - a.x)) {
    if (out.length >= 3) break;
    if (out.every(q => Math.min((o.k - q + MH_SLOTS) % MH_SLOTS, (q - o.k + MH_SLOTS) % MH_SLOTS) >= 4)) out.push(o.k);
  }
  return out.sort((a, b) => a - b);
}
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const clock12 = (min: number): string => { const m = (((Math.round(min) % 1440) + 1440) % 1440), h = Math.floor(m / 60); return `${h % 12 || 12}:${String(m % 60).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`; };
export const spanText = (min: number): string => { const m = Math.max(0, Math.round(min)); return m < 60 ? `${m} min` : m < 1440 ? (m % 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${Math.floor(m / 60)} h`) : `${Math.floor(m / 1440)} d ${Math.floor((m % 1440) / 60)} h`; };

export interface Chance { text: string; inMin: number; x: number | null }
/** The next best time: later today, else the biggest best time of the next trading day (Calgary clock). */
export function nextChance(week: Week, fallback: Week, m: Moment): Chance | null {
  const s = studyAt(m), show = (slot: number) => clock12(slot * 30 + 120 - m.ahead);
  if (s.row <= 4 && !m.closed) {
    const row = rowOf(week, fallback, s.row), w = bestSlots(row).find(k => k * 30 > s.min);
    if (w != null) return { text: `today ${show(w)}`, inMin: w * 30 - s.min, x: row?.[w] ?? null };
  }
  let wd = s.weekday, days = 0;
  do { wd = (wd + 1) % 7; days++; } while (wd === 6 || wd === 0);
  // of the next day's best times, the biggest one (not its first: that is often the 1 AM London open)
  const row = rowOf(week, fallback, wd - 1), w = bestSlots(row).sort((x, y) => (row?.[y] ?? 0) - (row?.[x] ?? 0))[0];
  if (w == null) return null;
  return { text: `${days === 1 ? 'tomorrow' : DAYS[wd]} ${show(w)}`, inMin: days * 1440 + w * 30 - s.min, x: row?.[w] ?? null };
}

export interface LightLine { light: Light; title: string; text: string }
export interface Judgement {
  time: LightLine; place: LightLine; rules: LightLine; room: LightLine;
  verdict: Verdict; why: string; score: number;
  /** Share of a normal day's move already made (1 = a whole normal day); null before the first candle. */
  used: number | null; high: number | null; low: number | null; fails: DeskRule[];
}

/** The four lights and the verdict of one market at one moment. */
export function judge(i: DeskInst, week: Week, fallback: Week, m: Moment): Judgement {
  const s = studyAt(m), act = m.closed ? null : rowOf(week, fallback, s.row)?.[s.slot] ?? null;
  const time: LightLine = m.closed ? { light: 'n', title: 'Market closed', text: 'Forex is shut for the weekend.' }
    : act == null ? { light: 'n', title: 'No timing data', text: 'The study has no numbers for this half-hour.' }
      : act >= 1.15 ? { light: 'g', title: act >= 1.6 ? 'Very busy now' : 'Busy now', text: `${act.toFixed(2)}× a typical half-hour for this market on a ${DAYS[s.weekday]}.` }
        : act >= 0.7 ? { light: 'a', title: 'Normal activity', text: `${act.toFixed(2)}× typical. Fine, but not one of the best times.` }
          : { light: 'r', title: 'Quiet now', text: `${act.toFixed(2)}× typical. Small moves and wider spreads.` };
  const area = (p: NonNullable<DeskInst['place']>) => `${TF_WORD[p.tf] ?? p.tf} ${p.side === 'D' ? 'buy' : 'sell'} area`;
  const place: LightLine = !i.place ? { light: 'r', title: 'In the middle of nowhere', text: 'Price is not at any buy or sell area. Nothing to do here.' }
    : i.place.sec === 'in' ? { light: 'g', title: `Inside a ${area(i.place)}`, text: 'Price is where your plan says to look.' }
      : { light: 'a', title: `Close to a ${area(i.place)}`, text: 'Not there yet. Let price come to the area.' };
  const fails = i.check ? i.check.rules.filter(r => r.status === 'f') : [], total = i.check?.rules.length ?? 0;
  const word = (r: DeskRule) => (RULE_WORD[r.short] ?? r.short).toLowerCase();
  const rules: LightLine = i.signal ? { light: 'g', title: 'All your rules pass', text: 'The scanner has a full signal on this market.' }
    : !i.check ? { light: 'n', title: 'No setup to check', text: 'There is no area close enough to test against your rules.' }
      : fails.length <= 3 ? { light: 'a', title: `${total - fails.length} of ${total} rules pass`, text: `Missing: ${fails.map(word).join('; ')}.` }
        : { light: 'r', title: `${total - fails.length} of ${total} rules pass`, text: `${fails.length} rules fail, starting with: ${word(fails[0])}.` };
  const bars = i.hours.filter(b => m.brokerHour == null || b[0] < m.brokerHour);
  const high = bars.length ? Math.max(...bars.map(b => b[1])) : null, low = bars.length ? Math.min(...bars.map(b => b[2])) : null;
  const used = high == null || low == null || !i.adr ? null : (high - low) / i.adr;
  const room: LightLine = used == null ? { light: 'n', title: 'Day has not started', text: 'No candles yet today.' }
    : used >= 0.9 ? { light: 'r', title: "Today's move is mostly done", text: `It has already travelled ${Math.round(used * 100)}% of a normal day. Chasing it now is late.` }
      : used >= 0.6 ? { light: 'a', title: "Over half of today's move is done", text: `${Math.round(used * 100)}% of a normal day used.` }
        : { light: 'g', title: "Plenty of today's move left", text: `Only ${Math.round(used * 100)}% of a normal day used so far.` };
  const verdict: Verdict = m.closed ? 'closed' : rules.light === 'g' && time.light !== 'r' && room.light !== 'r' ? 'ready'
    : room.light === 'r' ? 'done' : place.light !== 'r' && time.light !== 'r' && rules.light === 'a' ? 'close' : 'wait';
  const rank = { ready: 0, close: 1, wait: 2, done: 3, closed: 4 }[verdict];
  const cost = (l: Light) => ({ g: 0, a: 1, r: 2, n: 2 }[l]);
  const why = verdict === 'closed' ? 'Market closed' : verdict === 'ready' ? 'Rules pass and the time is right' : verdict === 'done' ? room.title
    : verdict === 'close' ? `${place.title}; ${rules.title.toLowerCase()}` : place.light === 'r' ? place.title
      : rules.light === 'r' ? `${place.title}, but ${fails.length} of your rules fail` : rules.light === 'n' ? place.title : time.title;
  return { time, place, rules, room, verdict, why, used, high, low, fails, score: rank * 100 + (cost(time.light) + cost(place.light) + cost(rules.light) + cost(room.light)) * 5 + fails.length };
}

export const HEADLINE: Record<Verdict, string> = { ready: 'Conditions are right', close: 'Close, but not there yet', wait: 'Nothing to do here yet', done: 'You have not missed it. It is over for today.', closed: 'Market closed' };
export function leadOf(i: DeskInst, j: Judgement): string {
  if (j.verdict === 'done') return `${i.sym} has already made ${Math.round((j.used ?? 0) * 100)}% of a normal day's move. Entering now means buying the end of it.`;
  if (j.verdict === 'ready') return 'Your rules pass, the time is good and there is room left. Check the chart and your plan before acting.';
  if (j.verdict === 'close') return 'Price is at or near an area and the time is fine. A few of your rules are still missing; see which below.';
  if (j.verdict === 'closed') return 'Nothing is moving. This is the time to look at structure and plan, not to trade.';
  if (j.place.light === 'r') return 'Price is between areas. Waiting is the trade.';
  if (j.rules.light === 'r') return `Price is at or near an area, but ${j.fails.length} of your rules fail. By your own rules this is not a trade.`;
  return 'The timing or the setup is not there yet.';
}

// ---- the owner's watchlist and nightly plans (kept inside the journal's synced risk settings) --------------------------
const norm = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');
/** The list with one symbol added or removed; never empty, never over DESK_MAX, no duplicates. */
export function editWatch(list: string[] | undefined, sym: string, add: boolean): string[] {
  const cur = (list?.length ? list : DESK_DEFAULT).map(norm).filter(Boolean), s = norm(sym);
  if (!s) return cur;
  if (add) return cur.includes(s) ? cur : [...cur, s].slice(0, DESK_MAX);
  const next = cur.filter(x => x !== s);
  return next.length ? next : cur;
}
export const watchOf = (list: string[] | undefined): string[] => { const l = (list ?? []).map(norm).filter(Boolean); return l.length ? [...new Set(l)].slice(0, DESK_MAX) : [...DESK_DEFAULT]; };
/** Plans by day ('YYYY-MM-DD' of the trading day they are for), each {symbol: one line}; only the newest 21 days are kept. */
export type DeskPlans = Record<string, Record<string, string>>;
export function savePlanLine(plans: DeskPlans | undefined, day: string, sym: string, text: string): DeskPlans {
  const next: DeskPlans = { ...(plans ?? {}) }, d = { ...(next[day] ?? {}) }, t = text.trim().slice(0, 200);
  if (t) d[norm(sym)] = t; else delete d[norm(sym)];
  if (Object.keys(d).length) next[day] = d; else delete next[day];
  for (const k of Object.keys(next).sort().slice(0, -21)) delete next[k];
  return next;
}
/** Calgary dates: today, and the trading day a plan written now is for (tonight after 3 PM -> the next weekday). */
export function planDays(at: Date): { today: string; planFor: string; planForName: string; evening: boolean } {
  const t = zoneTime(at);
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Edmonton', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  const base = new Date(`${parts}T12:00:00Z`);
  const evening = t.h >= 15 || t.weekday === 6 || t.weekday === 0;
  const d = new Date(base);
  if (evening) do { d.setUTCDate(d.getUTCDate() + 1); } while (d.getUTCDay() === 0 || d.getUTCDay() === 6);
  else while (d.getUTCDay() === 0 || d.getUTCDay() === 6) d.setUTCDate(d.getUTCDate() + 1);
  return { today: iso(base), planFor: iso(d), planForName: DAYS[d.getUTCDay()], evening };
}
/** Symbols matching a search, for the "add a market" box. */
export function searchMarkets(all: { sym: string; cls: string }[], q: string, have: string[], limit = 8): { sym: string; cls: string }[] {
  const n = norm(q);
  if (!n) return [];
  const rank = (s: string) => (s === n ? 0 : s.startsWith(n) ? 1 : s.includes(n) ? 2 : 9);
  return all.filter(x => !have.includes(x.sym) && rank(x.sym) < 9).sort((a, b) => rank(a.sym) - rank(b.sym) || a.sym.localeCompare(b.sym)).slice(0, limit);
}
