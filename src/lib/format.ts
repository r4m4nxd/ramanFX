import { useStore } from '@/data/store';

const SYM: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', JPY: '¥', INR: '₹', AUD: 'A$', CAD: 'C$', CHF: 'CHF ', NZD: 'NZ$', SGD: 'S$', HKD: 'HK$', ZAR: 'R' };
export const ccySymbol = (c?: string) => SYM[c ?? 'USD'] ?? `${c} `;

export function money(n: number | null | undefined, o: { signed?: boolean; ccy?: string; compact?: boolean; privacy?: boolean; dp?: number } = {}): string {
  if (n == null || !isFinite(n)) return '—';
  const sign = n < 0 ? '−' : o.signed && n > 0 ? '+' : '';
  const s = ccySymbol(o.ccy);
  if (o.privacy) return `${sign}${s}•••`;
  const a = Math.abs(n);
  if (o.compact && a >= 1000) return `${sign}${s}${(a / 1000).toFixed(a >= 100_000 ? 0 : 1)}k`;
  const dp = o.dp ?? (o.compact ? 0 : 2);
  return `${sign}${s}${a.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
}

export const pct = (n: number | null | undefined, dp = 1) => (n == null || !isFinite(n) ? '—' : `${(n * 100).toFixed(dp)}%`);
export const num = (n: number | null | undefined, dp = 2) => (n == null || !isFinite(n) ? '—' : n.toLocaleString('en-US', { minimumFractionDigits: dp, maximumFractionDigits: dp }));
export const rMult = (n: number | null | undefined, dp = 2) => (n == null || !isFinite(n) ? '—' : `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(dp)}R`);
export const price = (n: number, digits: number) => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Money formatter bound to the privacy toggle and the active account currency. */
export function useMoney() {
  const privacy = useStore(s => s.privacy);
  const ccy = useStore(s => (s.activeAccount !== 'all' ? s.accounts[s.activeAccount]?.currency : undefined) ?? Object.values(s.accounts)[0]?.currency ?? 'USD');
  return (n: number | null | undefined, o: { signed?: boolean; compact?: boolean; dp?: number } = {}) => money(n, { ...o, privacy, ccy });
}

export const tone = (n: number | null | undefined) => (n == null || Math.abs(n) < 0.005 ? 'text-ink' : n > 0 ? 'text-profit' : 'text-loss');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const shortDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]}`;
export const longDate = (d: Date) => `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
export const timeHM = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
export const monthName = (m: number) => ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][m];
