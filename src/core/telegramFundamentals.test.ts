// /fund (supabase/functions/telegram-bot/fundamentals.ts): the nightly public/fundamentals/*.json, phone-sized replies.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { handle, handleCallback, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { daysTo, earningsText, md, money } from '../../supabase/functions/telegram-bot/fundamentals';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const FX = {
  generated_at: '2026-10-29T23:00:00Z',
  currencies: {
    USD: { bank: 'Fed', rate: { v: 4.0, date: '2026-10-28T18:00:00Z', chg: -0.25, move: { date: '2026-10-28T18:00:00Z', chg: -0.25 } },
      next: { date: '2026-12-09T19:00:00Z', verified: true }, cpi: { v: 3.0, period: 'Sep' }, gdp: { v: 3.8, basis: 'q/q ann.', period: 'Q2' }, unemp: { v: 4.3 }, real: 1.0 },
    EUR: { bank: 'ECB', rate: { v: 2.0, date: '2026-09-11T12:15:00Z', chg: 0, move: { date: '2026-06-05T12:15:00Z', chg: -0.25 } },
      next: { date: '2026-10-30T12:15:00Z', verified: false, forecast: 2.0 }, cpi: { v: 2.2, period: 'Sep' }, gdp: { v: 1.4, basis: 'y/y', period: 'Q2' }, unemp: { v: 6.3 } },
  },
  pairs: { EURUSD: { base: 'EUR', quote: 'USD', diff: -2.0, carry: { earns: 'short', ccy: 'USD', pct: 2.0 }, cpi_diff: -0.8, score: -3, bias: 'USD stronger: higher rate, hotter CPI' } },
  notes: { XAUUSD: { text: 'Gold pays no yield: higher real rates and a firmer USD usually weigh on it. US real rate +1.0%', ccys: ['USD'] } },
};
const ST = {
  generated_at: '2026-10-29T23:10:00Z', price_date: '2026-10-29',
  stocks: {
    NVDA: { n: 'NVIDIA Corp', cik: '1045810', cur: 'USD', px: 180.5, mcap: 4.4e12, pe: 52.1, rev: 165.2e9, rev_g: 0.712, eps: 3.51, eps_g: 0.6, nm: 0.53, de: 0.1,
      end: '2026-07-27', per: 'TTM', src: 'SEC', er_last: '2026-08-27', er_next: '2026-11-04', er_kind: 'nasdaq', er_time: 'after close', eps_est: 1.25,
      filings: [['2026-10-20', '8-K', 'Director / officer change', 'https://www.sec.gov/x'], ['2026-08-27', '8-K', 'Earnings results', '']] },
    AAPL: { n: 'Apple Inc.', er_next: '2026-12-20', er_kind: 'estimated' },
  },
};
function ctx(extra: Record<string, unknown> = {}, now = '2026-10-29T15:00:00Z'): Ctx {
  const files: Record<string, unknown> = { 'fundamentals/fx.json': FX, 'fundamentals/stocks.json': ST, ...extra };
  return { now: new Date(now), imageUrl: (s, v, x) => `https://img.test/?img=${s}&tf=${v}&v=${x}`,
    async load(path: string) { return path in files ? files[path] : read(`public/${path}`); } };
}
const noRawLt = (s: string) => expect(s.replace(/<\/?(b|i|code)>/g, '')).not.toMatch(/<(?!\/)/);

describe('telegram /fund', () => {
  it('FX pair: both central banks, carry side, bias labelled as context', async () => {
    const r = await handle('/fund eurusd', ctx());
    expect(r.cmd).toBe('fund');
    expect(r.text).toContain('📑 <b>EURUSD</b> · fundamentals');
    expect(r.text).toContain('🇪🇺 <b>EUR</b> · ECB 2.00% · held Sep 11 (last cut Jun 5) · next Oct 30');
    expect(r.text).toContain('🇺🇸 <b>USD</b> · Fed 4.00% · cut 0.25 Oct 28 · next Dec 9');
    expect(r.text).toContain('CPI 3.0% (Sep) · GDP +3.8% q/q ann. (Q2) · jobless 4.3%');
    expect(r.text).toContain('Rate gap: <b>USD +2.00%</b> → short EURUSD earns the carry');
    expect(r.text).toContain('Inflation: EUR 2.2% vs USD 3.0%');
    expect(r.text).not.toContain('Growth:');                         // y/y vs q/q: not compared
    expect(r.text).toContain('🧭 <b>Bias</b>: USD stronger: higher rate, hotter CPI');
    expect(r.text).toContain('not a signal');
    expect(r.text).toContain('built Thu Oct 29 · 5:00 PM');           // Calgary clock (UTC-6)
    expect(r.text.length).toBeLessThan(1500);
    noRawLt(r.text);
    expect(r.buttons?.[0].map(b => ('callback_data' in b ? b.callback_data : ''))).toEqual(['z:EURUSD', 'c:EURUSD']);
    expect((await handle('/fundamentals EURUSD', ctx())).text).toBe(r.text);
    expect((await handleCallback('f:EURUSD', ctx())).text).toBe(r.text);
  });

  it('metals / indices: the note + the currency they follow; /fund alone: majors at a glance', async () => {
    const g = await handle('/fund XAUUSD', ctx());
    expect(g.text).toContain('Gold pays no yield');
    expect(g.text).toContain('🇺🇸 <b>USD</b> · Fed 4.00%');
    const o = await handle('/fund', ctx());
    expect(o.text).toContain('Central banks');
    expect(o.text).toContain('🇺🇸 <b>USD</b> 4.00% · CPI 3.0% · next Dec 9');
    expect(o.text).toContain('🇪🇺 <b>EUR</b> 2.00%');
    const none = await handle('/fund EURUSD', ctx({ 'fundamentals/fx.json': null }));
    expect(none.text).toContain('Fundamentals unavailable');
    expect((await handle('/fund QQQQQQQ', ctx())).text).toContain('not found');
  });

  it('stock: SEC numbers, earnings (Nasdaq / estimated), 8-K titles, phone-sized', async () => {
    const r = await handle('/fund NVDA', ctx());
    expect(r.text).toContain('📑 <b>NVDA</b> · NVIDIA Corp · fundamentals');
    expect(r.text).toContain('Market cap <b>$4.40T</b> · P/E <b>52.1</b>');
    expect(r.text).toContain('Revenue $165.2B TTM (+71% y/y)');
    expect(r.text).toContain('EPS 3.51 TTM (+60% y/y) · net margin 53%');
    expect(r.text).toContain('Debt / equity 0.10');
    expect(r.text).toContain('📅 Earnings: last Aug 27 · next Nov 4 after close (in 6 days) · EPS est. 1.25');
    expect(r.text).toContain('• Oct 20 · Director / officer change');
    expect(r.text).toContain('SEC filings to Jul 27 · price Oct 29 close');
    expect(r.text).toContain('not part of the zone rules');
    noRawLt(r.text);
    expect(r.buttons?.flat().some(b => 'url' in b && b.url.includes('CIK=1045810'))).toBe(true);
    const a = await handle('/fund AAPL', ctx());                      // no SEC numbers in the file: scanner rows fallback
    expect(a.text).toContain('📅 Earnings: next ~Dec 20 (in 52 days, estimated)');
  });

  it('earnings line for stock replies only within 14 days', async () => {
    const now = new Date('2026-10-29T15:00:00Z');
    expect(earningsText(ST.stocks.NVDA, now)).toBe('📑 next earnings: Nov 4 after close (in 6 days)');
    expect(earningsText({ er_next: '2026-10-30', er_kind: 'estimated' }, now)).toBe('📑 next earnings: Oct 30 (tomorrow, estimated)');
    expect(earningsText({ er_next: '2026-11-20' }, now)).toBe('');
    expect(earningsText({ er_next: '2026-10-20' }, now)).toBe('');
    expect(daysTo('2026-10-29', new Date('2026-10-30T05:00:00Z'))).toBe(0);   // still Oct 29 in Calgary
    expect(md('2026-11-04')).toBe('Nov 4');
    expect(money(-2.5e9)).toBe('-$2.5B');
    expect(money(12e6, 'EUR')).toBe('EUR 12M');
    const z = await handle('/zones NVDA', ctx());
    expect(z.text).toContain('📑 next earnings: Nov 4 after close (in 6 days)');
    expect(z.buttons?.flat().some(b => 'callback_data' in b && b.callback_data === 'f:NVDA')).toBe(true);
    const z2 = await handle('/zones NVDA', ctx({ 'fundamentals/stocks.json': null }));
    expect(z2.text).not.toContain('next earnings');
  });
});
