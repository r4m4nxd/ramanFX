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

/** Convert a broker-clock MT string (UTC+offset) to a local-time MT string. */
export function brokerToLocal(s: string, brokerOffsetHours: number): string {
  if (!s) return s;
  const m = /^(\d{4})\.(\d{2})\.(\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s.trim());
  if (!m) return s;
  const utc = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)) - brokerOffsetHours * 3_600_000;
  const d = new Date(utc);
  return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}:${p2(d.getSeconds())}`;
}

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
