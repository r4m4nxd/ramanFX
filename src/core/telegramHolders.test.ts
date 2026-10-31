// /holders and the 👥 Holders button (supabase/functions/telegram-bot/holders.ts): public/holders/* (tools/holders/holders.py) +
// the 30-day filings of public/insiders/latest.json (tools/insiders/insiders.py).
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { handle, handleCallback, COMMANDS, OWNER_ONLY, type Ctx } from '../../supabase/functions/telegram-bot/logic';
import { guestCallback, guestMessage, memoryGuests, type Guest } from '../../supabase/functions/telegram-bot/guests';
import { cmdHolders, holdersButton, holdersPath, pct, qty, shardOf } from '../../supabase/functions/telegram-bot/holders';

const readPub = (p: string) => (existsSync(`public/${p}`) ? JSON.parse(readFileSync(`public/${p}`, 'utf8')) : null);
const NOW = new Date('2026-10-30T15:00:00Z');
const INDEX = { tickers: [{ s: 'XYZ', n: 'XYZ Corp', k: 1, px: 12.4 }, { s: 'BRK.B', n: 'Berkshire Hathaway', k: 2, px: 480 }, { s: 'NEWCO', n: 'New Co', k: 3, px: 9 }, { s: '3MCO', n: '3M Co', k: 4, px: 90 }] };
const XYZ = {
  n: 'XYZ Corp', cik: '111111', so: 180_000_000, so_end: '2026-10-20',
  h5: [{ f: 'Vanguard Group Inc', cik: '102909', form: '13G/A', d: '2026-10-14', ev: '2026-09-30', pct: 9.57, sh: 17_220_000, idx: true, chg: { pct: 0.37, sh: 680_000, prev: '2024-02-13' } },
    { f: 'Activist Capital LP', cik: '1555555', form: '13D/A', d: '2026-10-30', ev: '2026-10-28', pct: 7, sh: 12_600_000, chg: { pct: 0.9, sh: 1_600_000, prev: '2026-08-01' } },
    { f: 'Old Fund LP', cik: '9', form: '13G', d: '2025-02-01', ev: '2024-12-31', pct: 5.2, sh: 9_400_000, chg: { pct: 0, sh: 0, prev: '2024-02-01' } }],
  h5x: [{ f: 'Small Holder LP', cik: '5', form: '13G/A', d: '2026-05-01', pct: 3.1 }],
  ins: [{ w: 'Doe Jane', role: 'CEO · Director', own: 480_000, pct: 0.267, d: '2026-10-27', code: 'S', mv: -20_000, px: 120 },
    { w: 'Big Holder Fund', role: '10% owner', own: 20_000_000, pct: 11.11, d: '2026-09-01', code: 'P', mv: 500_000, px: 118.5, ten: true },
    { w: 'Quiet Director', role: 'Director', own: 50_000, pct: 0.028, d: '2026-08-01', code: '', mv: 0 }],
  f13: { top: [{ f: 'Vanguard Group Inc', cik: '102909', sh: 24_800_000, v: 3e9, ch: 'add', dsh: 1_800_000, pct: 13.78, idx: true },
    { f: 'BlackRock Inc', cik: '1364742', sh: 20_500_000, v: 2.5e9, ch: 'cut', dsh: -1_500_000, pct: 11.39, idx: true },
    { f: 'FMR LLC', cik: '315066', sh: 8_300_000, v: 1e9, ch: 'same', dsh: 0, pct: 4.61 },
    { f: 'Acme Capital LP', cik: '1111111', sh: 1_080_000, v: 1e8, ch: 'new', dsh: 1_080_000, pct: 0.6 }], n: 7, tot: 54_000_000, tot_pct: 30, ex: [{ f: 'Exited Fund LP', cik: '6', sh: 3_000_000 }] },
};
const HOLD_INDEX = { version: 1, generated: '2026-10-30T09:23:00Z', f4_days: 180, f13: { q: '2026-06-30', pq: '2026-03-31', lag_days: 45 }, shards: ['A', 'X'] };
const INSIDERS = {
  generated: '2026-10-30T14:50:00Z', days: 30,
  clusters: [{ sym: 'XYZ', kind: 'early', n: 1, value: 300_000, last: '2026-10-28', star: false, strong: false }],
  sells: [{ sym: 'XYZ', role: 'CEO', who: 'Doe Jane', value: 2_400_000, date: '2026-10-27', filed: '2026-10-29T19:40:00Z', plan: false, big: true },
    { sym: 'XYZ', role: 'CFO', who: 'Roe Richard', value: 900_000, date: '2026-10-26', filed: '2026-10-28T19:40:00Z', plan: true }],
  plans: [{ sym: 'XYZ', who: 'Doe Jane', value: 6_012_500, date: '2026-11-02', filed: '2026-10-30T13:45:02Z', plan: true }],
  activists: [{ sym: 'XYZ', who: 'Activist Capital LP', form: 'SCHEDULE 13D/A', pct: 7, prev_pct: 6.1, filed: '2026-10-30T12:30:12Z', universe: true }],
};
function ctx(files: Record<string, unknown> = {}, now = NOW): Ctx {
  const all: Record<string, unknown> = { 'scanner/index.json': INDEX, 'fx/latest.json': { map: [] }, 'holders/index.json': HOLD_INDEX, 'holders/t/X.json': { stocks: { XYZ } }, 'insiders/latest.json': INSIDERS, ...files };
  return { now, async load(p: string) { return p in all ? all[p] : readPub(p); } };
}
const noRawLt = (s: string) => expect(s.replace(/<\/?(b|i|code)>/g, '')).not.toMatch(/<(?!\/)/);

describe('telegram /holders', () => {
  it('is a menu command guests may use', () => {
    expect(COMMANDS.some(c => c.command === 'holders')).toBe(true);
    expect(OWNER_ONLY.has('holders')).toBe(false);
  });

  it('the card: 5%+ holders, insiders, top funds with index marks and QoQ change, the last 30 days', async () => {
    const r = await handle('/holders xyz', ctx());
    expect(r.cmd).toBe('holders');
    const t = r.text;
    expect(t).toContain('👥 <b>XYZ</b> · holders · XYZ Corp');
    expect(t).toContain('180M shares out (Oct 20)');
    expect(t).toContain('<b>5%+ holders</b> <i>(Schedule 13D / 13G)</i>');
    expect(t).toContain('• Vanguard Group Inc <i>(index)</i> <b>9.6%</b> · 17.2M sh · 13G/A Oct 14 · +0.37 pt since Feb \'24');
    expect(t).toContain('• Activist Capital LP <b>7.0%</b> · 12.6M sh · 13D/A Oct 30 · +0.90 pt since Aug \'26');
    expect(t).toContain('• Old Fund LP <b>5.2%</b> · 9.4M sh · 13G Feb 1 · unchanged since Feb \'24');
    expect(t).toContain('fell below 5%: Small Holder LP 3.1% (May 1)');
    expect(t).toContain('<b>Insiders &amp; 10% owners</b> <i>(Form 4, last 180 days)</i>');
    expect(t).toContain('• Doe Jane <i>(CEO · Director)</i> <b>0.27%</b> · 480K sh · last: sold 20K @ $120.00 Oct 27');
    expect(t).toContain('• Big Holder Fund <i>(10% owner)</i> <b>11.1%</b> · 20.0M sh · last: bought 500K @ $118.50 Sep 1');
    expect(t).toContain('• Quiet Director <i>(Director)</i> <b>0.03%</b> · 50K sh · last Form 4 Aug 1');
    expect(t).toContain('<b>Top funds</b> <i>(13F, Jun 30 · all 13F filers hold 30.0%)</i>');
    expect(t).toContain('• Vanguard Group Inc <i>(index)</i> <b>13.8%</b> · 24.8M sh · added +7.8%');
    expect(t).toContain('• BlackRock Inc <i>(index)</i> <b>11.4%</b> · 20.5M sh · cut -6.8%');
    expect(t).toContain('• FMR LLC <b>4.6%</b> · 8.3M sh · unchanged');
    expect(t).toContain('• Acme Capital LP <b>0.60%</b> · 1.1M sh · new');
    expect(t).not.toMatch(/FMR LLC <i>\(index\)/);                                          // only the index giants are marked
    expect(t).toContain('exited: Exited Fund LP');
    expect(t).toContain('13F is filed up to 45 days after the quarter end (Jun 30)');
    expect(t).toContain('<b>Last 30 days</b>');
    expect(t).toContain('🟢 Oct 28 · early insider buy (1 insider so far) $300K');
    expect(t).toContain('🔴 Oct 27 · CEO Doe Jane sold $2.4M · big, no plan');
    expect(t).toContain('🔴 Oct 26 · CFO Roe Richard sold $900K (10b5-1 plan)');
    expect(t).toContain('📋 Oct 30 · Form 144: Doe Jane plans to sell $6.0M about Nov 2 (10b5-1 plan)');
    expect(t).toContain('📣 Oct 30 · SCHEDULE 13D/A: Activist Capital LP 7.0% (was 6.1%)');
    expect(t).toContain('updated Fri Oct 30 · 3:23 AM');
    expect(t.length).toBeLessThan(4096);
    noRawLt(t);
    const cb = (r.buttons ?? []).flat().filter(b => 'callback_data' in b).map(b => ('callback_data' in b ? b.callback_data : ''));
    expect(cb).toEqual(['c:XYZ', 'z:XYZ', 'f:XYZ']);
    expect((r.buttons ?? []).flat().some(b => 'url' in b && b.url === 'https://raman-fx.vercel.app/scanner/XYZ')).toBe(true);
  });

  it('the button (h:SYM), the same card; guests may use both, nothing of the owner in it', async () => {
    expect((await handleCallback('h:XYZ', ctx())).text).toContain('<b>5%+ holders</b>');
    expect(holdersButton('XYZ')).toEqual({ text: '👥 Holders', callback_data: 'h:XYZ' });
    expect(new TextEncoder().encode((holdersButton('ABCDEFGHIJKLMNOPQRST') as { callback_data: string }).callback_data).length).toBeLessThanOrEqual(64);
    const r = await handle('/holders XYZ', { ...ctx(), role: 'guest' });
    expect(r.text).toContain('Vanguard Group Inc');
    const g: Guest = { chat_id: 222, name: 'Bro', added_at: NOW.toISOString(), active: true, prefs: {} };
    const env = { db: memoryGuests([g]) };
    const gm = await guestMessage('/holders XYZ', g, ctx(), env);
    expect(gm.text).toContain('<b>Top funds</b>');
    expect((await guestCallback('h:XYZ', g, ctx(), env)).text).toContain('<b>Top funds</b>');
    expect((await guestMessage('/help', g, ctx(), env)).text).toContain('/holders NVDA');
  });

  it('shards by first letter, number formats', () => {
    expect(['XYZ', 'brk-b', 'BRK.B', '3M', '', 'Z'].map(shardOf)).toEqual(['X', 'B', 'B', '_', '_', 'Z']);
    expect(holdersPath('NVDA')).toBe('holders/t/N.json');
    expect([qty(2.2e9), qty(861e6), qty(24.8e6), qty(480e3), qty(950), qty(null)]).toEqual(['2.2B', '861M', '24.8M', '480K', '950', 'n/a']);
    expect([pct(9.57), pct(0.42), pct(0.004), pct(null)]).toEqual(['9.6%', '0.42%', '<0.01%', '']);
  });

  it('missing, unknown, non-stock, stale and hostile input', async () => {
    expect((await handle('/holders', ctx())).text).toContain('Send a stock after it');
    expect((await handle('/holders ZZZZ', ctx())).text).toContain('not found');
    expect((await handle('/holders <b>x</b>', ctx())).text).not.toContain('<b>x</b>');
    expect((await handle('/holders EURUSD', ctx({ 'fx/latest.json': { map: [{ sym: 'EURUSD', cls: 'major' }] } }))).text).toContain('Holders are published for stocks only');
    const none = await handle('/holders NEWCO', ctx());
    expect(none.text).toContain('Not published yet');
    expect(none.buttons?.[0][0]).toEqual({ text: '📊 Chart NEWCO', callback_data: 'c:NEWCO' });
    const noFiles = await handle('/holders XYZ', ctx({ 'holders/t/X.json': null, 'holders/index.json': null }));
    expect(noFiles.text).toContain('Not published yet');
    // stale insiders file: the card keeps the holders, drops the 30-day lines
    const stale = await handle('/holders XYZ', ctx({}, new Date('2026-11-20T15:00:00Z')));
    expect(stale.text).toContain('<b>5%+ holders</b>');
    expect(stale.text).toContain('no insider buy / sale, Form 144 or 13D on file');
    // partial data (a stock with only a name) and garbage fields never throw
    const bare = await handle('/holders XYZ', ctx({ 'holders/t/X.json': { stocks: { XYZ: { n: 'XYZ Corp' } } } }));
    expect(bare.text).toContain('none on file in the last 3 years');
    expect(bare.text).toContain('no 13F data for it yet');
    const junk = await handle('/holders XYZ', ctx({ 'holders/t/X.json': { stocks: { XYZ: { n: 5, h5: [null, 'x', { pct: 'a' }], ins: [{}], f13: { top: [{ f: '<b>', sh: 'x' }] } } } } }));
    expect(junk.cmd).toBe('holders');
    noRawLt(junk.text);
    // symbols with a dot / dash and a digit start find their shards
    const brk = await cmdHolders('BRK.B', ctx({ 'holders/t/B.json': { stocks: { 'BRK.B': { n: 'Berkshire', h5: [{ f: 'Vanguard', pct: 9, d: '2026-02-01', form: '13G/A' }] } } } }));
    expect(brk.text).toContain('👥 <b>BRK.B</b>');
    const dig = await cmdHolders('3MCO', ctx({ 'holders/t/_.json': { stocks: { '3MCO': { n: '3M Co' } } } }));
    expect(dig.text).toContain('👥 <b>3MCO</b>');
  });
});

describe('the 👥 Holders button under stock replies', () => {
  const real = (): Ctx => ({ now: new Date('2026-10-29T15:00:00Z'), imageUrl: (s, v, k) => `https://img.test/?img=${s}&tf=${v}&v=${k}`, async load(p: string) { return readPub(p); } });
  const cbs = (r: { buttons?: { text: string; callback_data?: string; url?: string }[][] }) => (r.buttons ?? []).flat().map(b => b.callback_data ?? '');
  const sym = (readPub('scanner/index.json')?.tickers ?? [])[0]?.s as string | undefined;

  it('the symbol reply, /zones, /fund and the chart of a stock have it; an FX symbol does not', async () => {
    expect(sym).toBeTruthy();
    expect(cbs(await handle(sym!, real()))).toContain(`h:${sym}`);
    expect(cbs(await handle(`/zones ${sym}`, real()))).toContain(`h:${sym}`);
    expect(cbs(await handle(`/fund ${sym}`, real()))).toContain(`h:${sym}`);
    const chart = await handle(`/chart ${sym}`, real());
    if (chart.photo) expect(cbs(chart)).toContain(`h:${sym}`);
    expect(cbs(await handle('EURUSD', real())).some(c => c.startsWith('h:'))).toBe(false);
    expect(cbs(await handle('/fund EURUSD', real())).some(c => c.startsWith('h:'))).toBe(false);
  });
});
