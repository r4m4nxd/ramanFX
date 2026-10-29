// /insiders (supabase/functions/telegram-bot/insiders.ts): public/insiders/latest.json (tools/insiders/insiders.py).
import { describe, expect, it } from 'vitest';
import { handle, handleCallback, COMMANDS, OWNER_ONLY, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { clusterLine, insiderLine, usd, withInsiders, zoneText } from '../../supabase/functions/telegram-bot/insiders';

const XYZ = {
  key: '111:cluster', cik: '111', sym: 'XYZ', name: 'XYZ Corp', kind: 'cluster', n: 3, strong: true, star: true, score: 9.5, value: 2_100_000,
  px: 12.4, price: 12.1, first: '2026-10-24', last: '2026-10-28', url: 'https://www.sec.gov/Archives/edgar/data/111/x-index.htm', universe: true,
  lead: { role: 'CEO', pct: 18, new: false, name: 'Doe Jane' }, zone: { tf: 'W1', where: 'inside', lo: 11.9, hi: 12.6, dist: 0 }, pe: 9.2, er_next: '2026-11-12',
  insiders: [{ name: 'Doe Jane', role: 'CEO · Director', value: 1_500_000, price: 12.1, date: '2026-10-24', pct: 18, url: 'https://www.sec.gov/a' }],
};
const SOLO = { ...XYZ, cik: '222', sym: 'OTCQ', name: 'Otc Q', kind: 'solo', n: 1, strong: false, star: false, score: 5.5, value: 400_000, universe: false, zone: null, px: undefined, price: 8.5 };
const FILE = {
  generated: '2026-10-29T20:00:00Z', days: 30, clusters: [XYZ, SOLO], buys: [],
  by_sym: {
    XYZ: { buys: 4, buy_value: 2_100_000, buyers: 3, sells: 1, sell_value: 50_000, sellers: 1, last_buy: '2026-10-28', last_sell: '2026-10-10', universe: true,
      rows: [{ d: '2026-10-28', who: 'Roe John', role: 'Director', code: 'P', value: 300_000, price: 12.4, pct: 5, url: 'https://www.sec.gov/b' },
        { d: '2026-10-10', who: 'Poe Ann', role: 'CFO', code: 'S', value: 50_000, price: 13, pct: -2, url: 'https://www.sec.gov/c' }] },
    OTCQ: { buys: 1, buy_value: 400_000, buyers: 1, sells: 0, sell_value: 0, sellers: 0, last_buy: '2026-10-27', universe: false, rows: [] },
  },
};
const INDEX = { tickers: [{ s: 'XYZ', n: 'XYZ Corp', k: 1, px: 12.4 }, { s: 'NVDA', n: 'NVIDIA', k: 2, px: 180 }] };
function ctx(file: unknown = FILE, now = '2026-10-29T22:00:00Z'): Ctx {
  const files: Record<string, unknown> = { 'insiders/latest.json': file, 'scanner/index.json': INDEX, 'fx/latest.json': { map: [] } };
  return { now: new Date(now), async load(p: string) { return files[p] ?? null; } };
}
const noRawLt = (s: string) => expect(s.replace(/<\/?(b|i|code)>/g, '')).not.toMatch(/<(?!\/)/);

describe('telegram /insiders', () => {
  it('is a guest-allowed menu command', () => {
    expect(COMMANDS.some(c => c.command === 'insiders')).toBe(true);
    expect(OWNER_ONLY.has('insiders')).toBe(false);
  });

  it('list: ⭐ first, one line each, chart buttons for scanner stocks', async () => {
    const r = await handle('/insiders', ctx());
    expect(r.cmd).toBe('insiders');
    expect(r.text).toContain('🕵️ <b>Insider cluster buys · last 30 days</b>');
    expect(r.text).toContain('2 found · 1 ⭐');
    expect(r.text).toContain('⭐ <b>XYZ</b> $12.40 · 3 insiders · $2.1M · CEO +18% holdings · inside W1 demand 11.90–12.60 · Oct 24–Oct 28');
    expect(r.text).toContain('🕵️ <b>OTCQ</b> $8.50 · big solo buy · $400K');
    expect(r.text.indexOf('XYZ')).toBeLessThan(r.text.indexOf('OTCQ'));
    expect(r.text).toContain('updated Thu Oct 29 · 2:00 PM');
    expect(r.buttons?.[0]).toEqual([{ text: '📊 XYZ', callback_data: 'c:XYZ' }]);
    noRawLt(r.text);
  });

  it('one stock: buys / sells summary, cluster context, buttons; unknown -> says so', async () => {
    const r = await handle('/insiders xyz', ctx());
    expect(r.text).toContain('🕵️ <b>XYZ</b> · insiders · last 30 days');
    expect(r.text).toContain('⭐ <b>Strong cluster · 3 insiders</b> · $2.1M · score 9.5');
    expect(r.text).toContain('inside W1 demand 11.90–12.60 · P/E 9 · earnings Nov 12');
    expect(r.text).toContain('Bought: <b>$2.1M</b> · 3 insiders · 4 filings (last Oct 28)');
    expect(r.text).toContain('Sold: <b>$50K</b> · 1 insider · 1 filing (last Oct 10)');
    expect(r.text).toContain('🟢 Oct 28 · Roe John (Director) bought $300K @ $12.40 · +5% holdings');
    expect(r.text).toContain('🔴 Oct 10 · Poe Ann (CFO) sold $50K @ $13.00 · -2% holdings');
    expect(r.buttons?.[0].map(b => ('callback_data' in b ? b.callback_data : ''))).toEqual(['c:XYZ', 'f:XYZ']);
    expect(r.buttons?.[1][0]).toEqual({ text: '🔗 SEC filing', url: 'https://www.sec.gov/b' });
    noRawLt(r.text);
    const n = await handle('/insiders NVDA', ctx());
    expect(n.text).toContain('No insider open-market buys or sells on SEC Form 4 in the last 30 days');
    expect((await handle('/insiders', ctx(null))).text).toContain('Not published yet');
    const solo = await handle('/insiders OTCQ', ctx());
    expect(solo.text).toContain('Sold: tracked for scanner stocks only');
    expect(solo.buttons?.some(row => row.some(b => 'callback_data' in b))).toBeFalsy();
  });

  it('the one-line note for /fund and the zone / chart replies (fresh data only)', async () => {
    expect(await insiderLine('XYZ', ctx())).toBe('🕵️ insiders bought $2.1M in last 30d (3 insiders · ⭐ cluster) · /insiders XYZ');
    expect(await insiderLine('NVDA', ctx())).toBe('');
    expect(await insiderLine('XYZ', ctx(FILE, '2026-11-05T22:00:00Z'))).toBe('');      // stalled job
    expect(await insiderLine('XYZ', ctx(FILE, '2026-10-29T15:00:00Z'))).toBe('');      // file newer than the clock
    const r = await withInsiders('XYZ', ctx(), Promise.resolve({ cmd: 'zones', text: '🔎 <b>XYZ</b>\nzones\n\n3 zones · not advice' }));
    expect(r.text).toBe('🔎 <b>XYZ</b>\nzones\n🕵️ insiders bought $2.1M in last 30d (3 insiders · ⭐ cluster) · /insiders XYZ\n\n3 zones · not advice');
    const p = await withInsiders('XYZ', ctx(), Promise.resolve({ cmd: 'chart', text: 'cap\nnot advice', photo: 'x' }));
    expect(p.text).toBe('cap\n🕵️ insiders bought $2.1M in last 30d (3 insiders · ⭐ cluster) · /insiders XYZ\nnot advice');
  });

  it('guests can use it', async () => {
    const r = await handle('/insiders', { ...ctx(), role: 'guest' });
    expect(r.text).toContain('Insider cluster buys');
  });

  it('helpers', () => {
    expect(usd(2_149_000)).toBe('$2.1M');
    expect(usd(12_000)).toBe('$12K');
    expect(usd(1.2e9)).toBe('$1.2B');
    expect(zoneText({ tf: 'MN', where: 'near', lo: 90, hi: 101, dist: 3.1 }, true)).toBe('⭐ 3.1% above MN demand 90–101');
    expect(clusterLine({ ...XYZ, lead: { role: 'CFO', new: true } })).toContain('CFO new position');
    expect(handleCallback).toBeTypeOf('function');
  });
});
