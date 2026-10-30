// Tiny candle DSL for the hand-built arrival fixtures (scripts/make-arrival-fixtures.ts, src/core/telegramArrival.test.ts).
// Every candle is explicit and deterministic: move() = trending candles (body 1 step, wicks 0.3 step: never basing),
// base() = basing candles (body 20% of the range), leg() = one marubozu-like departure candle. Times: daily
// ('YYYY-MM-DD', every calendar day) or intraday ('YYYY-MM-DDTHH:MM', `stepMin` minutes).
import type { ZBar } from '../supabase/functions/telegram-bot/zonecore.ts';

export class Tape {
  readonly bars: ZBar[] = [];
  private t: number; private c: number;
  constructor(start: number, t0 = '2025-01-01', private readonly stepMin = 1440) {
    this.c = start;
    this.t = Date.parse(t0.length > 10 ? `${t0}:00Z` : `${t0}T00:00:00Z`);
  }
  private time(): string {
    const s = new Date(this.t).toISOString();
    this.t += this.stepMin * 60000;
    return this.stepMin >= 1440 ? s.slice(0, 10) : s.slice(0, 16);
  }
  get close() { return this.c; }
  private push(o: number, h: number, l: number, c: number) {
    const r = (v: number) => Math.round(v * 1e6) / 1e6;
    this.bars.push({ d: this.time(), o: r(o), h: r(h), l: r(l), c: r(c) });
    this.c = r(c);
  }
  /** n trending candles from the last close to `to` (equal steps), wicks 0.3 x the step. */
  move(n: number, to: number): this {
    const st = (to - this.c) / n, w = Math.abs(st) * 0.3;
    for (let k = 0; k < n; k++) { const o = this.c, c = o + st; this.push(o, Math.max(o, c) + w, Math.min(o, c) - w, c); }
    return this;
  }
  /** n basing candles around the last close: range `size`, body 20% of it, alternating colour. */
  base(n: number, size: number): this {
    for (let k = 0; k < n; k++) {
      const o = this.c, c = o + (k % 2 ? -0.2 : 0.2) * size, m = (o + c) / 2;
      this.push(o, m + size / 2, m - size / 2, c);
    }
    return this;
  }
  /** One strong candle to `to`: wicks 5% of the body. */
  leg(to: number): this {
    const o = this.c, w = Math.abs(to - o) * 0.05;
    this.push(o, Math.max(o, to) + w, Math.min(o, to) - w, to);
    return this;
  }
  /** A single candle with an explicit high / low (a wick poking out), body from the last close to `c`. */
  wick(c: number, h: number, l: number): this { this.push(this.c, h, l, c); return this; }
}
