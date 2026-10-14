// MT reports use "YYYY.MM.DD HH:MM:SS". Stored times are already in browser-local time.

export function parseTs(s: string | null | undefined): Date | null {
  if (!s) return null;
  const m = /^(\d{4})[.\-/](\d{1,2})[.\-/](\d{1,2})(?:[ T](\d{1,2}):(\d{2})(?::(\d{2}))?)?/.exec(s.trim());
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0));
  return isNaN(d.getTime()) ? null : d;
}

const p2 = (n: number) => String(n).padStart(2, '0');

export const dayKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
export const monthKey = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}`;

/** Monday of the week containing d, as a day key. */
export function weekKey(d: Date): string {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return dayKey(m);
}

export function fromDayKey(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Broker server clock. 'mt-ny' is the MetaTrader convention most brokers use: New York time + 7h,
 * i.e. GMT+2 in winter and GMT+3 in summer, switching on US daylight-saving dates.
 * Otherwise an IANA zone ('Europe/London') or a fixed offset in hours (legacy numbers).
 */
export type BrokerClock = 'mt-ny' | string | number;

export const BROKER_CLOCKS: { value: string; label: string; hint: string }[] = [
  { value: 'mt-ny', label: 'GMT+2 winter / GMT+3 summer', hint: 'Most MT4/MT5 brokers: IC Markets, Pepperstone, FTMO, FundedNext, Exness, Vantage, The5ers…' },
  { value: 'UTC', label: 'GMT+0 all year (UTC)', hint: 'Some brokers and prop firms run on plain UTC' },
  { value: 'Europe/London', label: 'London time (GMT / BST)', hint: 'UK brokers: GMT in winter, GMT+1 in summer' },
  { value: 'Etc/GMT-2', label: 'GMT+2 all year', hint: 'Fixed, no daylight saving' },
  { value: 'Etc/GMT-3', label: 'GMT+3 all year', hint: 'Fixed, no daylight saving' },
  { value: 'America/New_York', label: 'New York time (EST / EDT)', hint: 'US brokers on Eastern time' },
];

const dtf = new Map<string, Intl.DateTimeFormat>();
function fmtIn(zone: string) {
  let f = dtf.get(zone);
  if (!f) { f = new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }); dtf.set(zone, f); }
  return f;
}
/** Wall-clock fields of an instant in a zone. */
export function wallIn(zone: string, utcMs: number) {
  const p: Record<string, number> = {};
  for (const x of fmtIn(zone).formatToParts(new Date(utcMs))) if (x.type !== 'literal') p[x.type] = +x.value;
  return { y: p.year, mo: p.month, d: p.day, h: p.hour % 24, mi: p.minute, s: p.second };
}
/** Zone's offset from UTC at an instant, in ms (positive east of Greenwich). */
export function zoneOffsetMs(zone: string, utcMs: number): number {
  const w = wallIn(zone, utcMs);
  return Date.UTC(w.y, w.mo - 1, w.d, w.h, w.mi, w.s) - Math.floor(utcMs / 1000) * 1000;
}
/** UTC instant for a wall-clock time in a zone (two passes settle DST edges). */
export function wallToUtc(zone: string, y: number, mo: number, d: number, h: number, mi: number, s: number): number {
  const naive = Date.UTC(y, mo - 1, d, h, mi, s);
  let t = naive - zoneOffsetMs(zone, naive);
  t = naive - zoneOffsetMs(zone, t);
  return t;
}

export const deviceTz = () => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch { return 'UTC'; } };

/** UTC instant of a broker-clock MT timestamp. */
export function brokerToUtc(s: string, clock: BrokerClock): number | null {
  const m = /^(\d{4})[.\-](\d{2})[.\-](\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s.trim());
  if (!m) return null;
  const [y, mo, d, h, mi, sec] = [+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] ?? 0)];
  if (typeof clock === 'number') return Date.UTC(y, mo - 1, d, h, mi, sec) - clock * 3_600_000;
  if (clock === 'mt-ny') {
    // Broker clock = New York + 7h: step back 7h of wall time, then resolve as New York.
    const ny = new Date(Date.UTC(y, mo - 1, d, h, mi, sec) - 7 * 3_600_000);
    return wallToUtc('America/New_York', ny.getUTCFullYear(), ny.getUTCMonth() + 1, ny.getUTCDate(), ny.getUTCHours(), ny.getUTCMinutes(), ny.getUTCSeconds());
  }
  return wallToUtc(clock, y, mo, d, h, mi, sec);
}

/** Convert a broker-clock MT string to an MT string on the user's clock (their chosen time zone). */
export function brokerToLocal(s: string, clock: BrokerClock, userTz?: string): string {
  if (!s) return s;
  const utc = brokerToUtc(s, clock);
  if (utc == null) return s;
  if (!userTz) {
    const d = new Date(utc);
    return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
  }
  const w = wallIn(userTz, utc);
  return `${w.y}.${p2(w.mo)}.${p2(w.d)} ${p2(w.h)}:${p2(w.mi)}:${p2(w.s)}`;
}

/** Friendly time-zone list: popular cities first, every IANA zone after. */
export const POPULAR_TZ: { tz: string; city: string }[] = [
  { tz: 'America/Edmonton', city: 'Calgary / Edmonton' }, { tz: 'America/Vancouver', city: 'Vancouver' }, { tz: 'America/Winnipeg', city: 'Winnipeg' },
  { tz: 'America/Toronto', city: 'Toronto / Montreal' }, { tz: 'America/Halifax', city: 'Halifax' }, { tz: 'America/New_York', city: 'New York' },
  { tz: 'America/Chicago', city: 'Chicago' }, { tz: 'America/Denver', city: 'Denver' }, { tz: 'America/Phoenix', city: 'Phoenix' },
  { tz: 'America/Los_Angeles', city: 'Los Angeles' }, { tz: 'America/Mexico_City', city: 'Mexico City' }, { tz: 'America/Sao_Paulo', city: 'São Paulo' },
  { tz: 'Europe/London', city: 'London' }, { tz: 'Europe/Dublin', city: 'Dublin' }, { tz: 'Europe/Paris', city: 'Paris' }, { tz: 'Europe/Berlin', city: 'Berlin / Frankfurt' },
  { tz: 'Europe/Zurich', city: 'Zurich' }, { tz: 'Europe/Athens', city: 'Athens' }, { tz: 'Europe/Istanbul', city: 'Istanbul' }, { tz: 'Europe/Moscow', city: 'Moscow' },
  { tz: 'Africa/Lagos', city: 'Lagos' }, { tz: 'Africa/Johannesburg', city: 'Johannesburg' }, { tz: 'Asia/Dubai', city: 'Dubai' }, { tz: 'Asia/Karachi', city: 'Karachi' },
  { tz: 'Asia/Kolkata', city: 'India (Mumbai / Delhi)' }, { tz: 'Asia/Dhaka', city: 'Dhaka' }, { tz: 'Asia/Bangkok', city: 'Bangkok' }, { tz: 'Asia/Singapore', city: 'Singapore' },
  { tz: 'Asia/Hong_Kong', city: 'Hong Kong' }, { tz: 'Asia/Shanghai', city: 'Shanghai' }, { tz: 'Asia/Tokyo', city: 'Tokyo' }, { tz: 'Australia/Perth', city: 'Perth' },
  { tz: 'Australia/Sydney', city: 'Sydney / Melbourne' }, { tz: 'Pacific/Auckland', city: 'Auckland' },
];

export function allTimeZones(): string[] {
  try { return (Intl as unknown as { supportedValuesOf(k: string): string[] }).supportedValuesOf('timeZone'); } catch { return POPULAR_TZ.map(p => p.tz); }
}

/** "GMT−6" style label for a zone right now. */
export function gmtLabel(zone: string, at = Date.now()): string {
  try {
    const m = Math.round(zoneOffsetMs(zone, at) / 60000), a = Math.abs(m);
    return `GMT${m < 0 ? '−' : '+'}${Math.floor(a / 60)}${a % 60 ? `:${p2(a % 60)}` : ''}`;
  } catch { return ''; }
}

export const clockIn = (zone: string, at = Date.now()) => { const w = wallIn(zone, at); return `${p2(w.h)}:${p2(w.mi)}`; };
export const brokerClockNow = (clock: BrokerClock) => {
  const now = Date.now();
  if (typeof clock === 'number') { const d = new Date(now + clock * 3_600_000); return `${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}`; }
  if (clock === 'mt-ny') { const w = wallIn('America/New_York', now); return `${p2((w.h + 7) % 24)}:${p2(w.mi)}`; }
  return clockIn(clock, now);
};

export function fmtHold(sec: number): string {
  if (!isFinite(sec) || sec <= 0) return '0m';
  if (sec >= 86400) return `${(sec / 86400).toFixed(1)}d`;
  if (sec >= 3600) {
    const h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  if (sec >= 60) return `${Math.round(sec / 60)}m`;
  return `${Math.round(sec)}s`;
}

/** Trading session by the UTC hour of entry. Overlaps are assigned to the later session. */
export type Session = 'Asia' | 'London' | 'New York' | 'Off-hours';
export function sessionOf(d: Date): Session {
  const h = d.getUTCHours();
  if (h >= 12 && h < 21) return 'New York';
  if (h >= 7 && h < 12) return 'London';
  if (h >= 23 || h < 7) return 'Asia';
  return 'Off-hours';
}
