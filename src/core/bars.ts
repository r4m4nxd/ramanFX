// Broker candles exported by the RamanFX_Charts script (MT5 / MT4), used to replay each trade on a real chart.
import { brokerToUtc, type BrokerClock, zoneOffsetMs } from './time';

export const TFS = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1'] as const;
export type Tf = (typeof TFS)[number];
export const TF_SEC: Record<Tf, number> = { M1: 60, M5: 300, M15: 900, H1: 3600, H4: 14400, D1: 86400 };

/** Column-wise OHLC, times in UTC seconds, sorted ascending. */
export interface Series { t: number[]; o: number[]; h: number[]; l: number[]; c: number[] }
export const seriesKey = (account: string, symbol: string, tf: Tf) => `${account}|${symbol}|${tf}`;

/** Broker-clock "YYYY.MM.DD HH:MM[:SS]" → UTC seconds, resolving the clock once per hour. */
export function brokerParser(clock: BrokerClock) {
  const cache = new Map<string, number>();
  return (s: string): number | null => {
    const m = /^(\d{4})[.-](\d{2})[.-](\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s);
    if (!m) return null;
    const naive = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0));
    const hk = s.slice(0, 13);
    let off = cache.get(hk);
    if (off == null) {
      const base = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4]);
      const u = brokerToUtc(`${m[1]}.${m[2]}.${m[3]} ${m[4]}:00:00`, clock);
      if (u == null) return null;
      off = u - base;
      cache.set(hk, off);
    }
    return Math.round((naive + off) / 1000);
  };
}

export interface BarsImport { series: Record<string, Series>; bars: number; symbols: string[] }

/**
 * File layout:
 *   RamanFX Bars,1,<account>
 *   Symbol,TF,Time,Open,High,Low,Close
 *   XAUUSD,M5,2026.05.11 07:40:00,2331.10,2332.40,2330.85,2331.95
 */
export function isBarsCSV(text: string) { return /^﻿?RamanFX Bars/.test(text); }

export function parseBarsCSV(text: string, clock: BrokerClock): BarsImport {
  const lines = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n').split('\n');
  const account = (lines[0].split(',')[2] ?? '').trim() || 'default';
  const toUtc = brokerParser(clock);
  const tmp: Record<string, Map<number, [number, number, number, number]>> = {};
  let bars = 0;
  for (let i = 2; i < lines.length; i++) {
    const c = lines[i].split(',');
    if (c.length < 7) continue;
    const tf = c[1].trim() as Tf;
    if (!TF_SEC[tf]) continue;
    const t = toUtc(c[2].trim());
    const o = +c[3], h = +c[4], l = +c[5], cl = +c[6];
    if (t == null || !(o > 0 && h > 0 && l > 0 && cl > 0)) continue;
    (tmp[seriesKey(account, c[0].trim(), tf)] ??= new Map()).set(t, [o, h, l, cl]);
    bars++;
  }
  const series: Record<string, Series> = {};
  for (const [k, m] of Object.entries(tmp)) series[k] = fromMap(m);
  return { series, bars, symbols: [...new Set(Object.keys(series).map(k => k.split('|')[1]))] };
}

function fromMap(m: Map<number, [number, number, number, number]>): Series {
  const ts = [...m.keys()].sort((a, b) => a - b);
  const s: Series = { t: ts, o: [], h: [], l: [], c: [] };
  for (const t of ts) { const [o, h, l, c] = m.get(t)!; s.o.push(o); s.h.push(h); s.l.push(l); s.c.push(c); }
  return s;
}

/** Union of two series; the newer one wins where times overlap. */
export function mergeSeries(old: Series | undefined, add: Series): Series {
  if (!old?.t.length) return add;
  const m = new Map<number, [number, number, number, number]>();
  for (const s of [old, add]) s.t.forEach((t, i) => m.set(t, [s.o[i], s.h[i], s.l[i], s.c[i]]));
  return fromMap(m);
}

/** Shift UTC seconds to wall-clock seconds in a zone (charts draw times as UTC), caching per hour. */
export function wallShifter(zone: string) {
  const cache = new Map<number, number>();
  return (utcSec: number) => {
    const hk = Math.floor(utcSec / 3600);
    let off = cache.get(hk);
    if (off == null) { off = zoneOffsetMs(zone, hk * 3_600_000) / 1000; cache.set(hk, off); }
    return utcSec + off;
  };
}

/** "YYYY.MM.DD HH:MM:SS" wall time (already in the user's zone) → the same wall time as chart seconds. */
export function wallSec(s: string): number | null {
  const m = /^(\d{4})[.-](\d{2})[.-](\d{2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/.exec(s.trim());
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] ?? 0)) / 1000 : null;
}

/** The timeframe that frames a trade of this length best, from those available. */
export function pickTf(holdSec: number, have: Tf[]): Tf | null {
  if (!have.length) return null;
  const want: Tf = holdSec < 2 * 3600 ? 'M1' : holdSec < 12 * 3600 ? 'M5' : holdSec < 3 * 86400 ? 'M15' : holdSec < 12 * 86400 ? 'H1' : holdSec < 60 * 86400 ? 'H4' : 'D1';
  const order = TFS.indexOf(want);
  // Nearest available, preferring a higher timeframe (more context) over a lower one.
  for (let d = 0; d < TFS.length; d++) {
    for (const i of [order + d, order - d]) if (i >= 0 && i < TFS.length && have.includes(TFS[i])) return TFS[i];
  }
  return have[0];
}
