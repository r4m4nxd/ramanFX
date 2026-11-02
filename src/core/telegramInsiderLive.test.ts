import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { liveInsiders, parseForm4, recentFilings } from '../../supabase/functions/telegram-bot/insiderLive';
import { liveReply } from '../../supabase/functions/telegram-bot/insiders';

const fx = (n: string) => readFileSync(`tools/insiders/tests/fixtures/${n}`, 'utf8');
const xmlOf = (t: string) => (/<XML>\s*([\s\S]*?)\s*<\/XML>/i.exec(t)?.[1] ?? t);

describe('/insiders SYM live (SEC EDGAR)', () => {
  it('reads real Form 4s: open sale, 10b5-1 checkbox, 10b5-1 footnote', () => {
    const open = parseForm4(xmlOf(fx('real_form4_sale_open.txt')));
    expect(open.owner.length).toBeGreaterThan(2);
    expect(open.rows.some(r => r.code === 'S' && (r.shares ?? 0) > 0)).toBe(true);
    const box = parseForm4(xmlOf(fx('real_form4_sale_box.txt')));
    expect(box.plan).toBe(true);
    const note = parseForm4(xmlOf(fx('real_form4_sale_note.txt')));
    expect(note.plan || note.rows.some(r => r.plan)).toBe(true);
  });
  it('picks the recent Form 4 / 144 / 13D filings, newest first', () => {
    const sub = { filings: { recent: { form: ['4', '10-Q', '144', '4', 'SC 13D'], filingDate: ['2026-10-30', '2026-10-29', '2026-10-20', '2026-06-01', '2026-10-01'],
      accessionNumber: ['a', 'b', 'c', 'd', 'e'], primaryDocument: ['x.xml', 'q.htm', 'p.xml', 'y.xml', 's.htm'] } } };
    expect(recentFilings(sub, '2026-08-04').map(f => f.form)).toEqual(['4', '144', 'SC 13D']);
  });
  it('ticker -> CIK -> filings -> Form 4 trades, rendered', async () => {
    const xml = xmlOf(fx('real_form4_sale_open.txt'));
    const sec = async (u: string) => {
      if (u.endsWith('company_tickers.json')) return JSON.stringify({ 0: { cik_str: 320193, ticker: 'ZZZT', title: 'Test Co' } });
      if (u.includes('/submissions/CIK0000320193.json')) return JSON.stringify({ filings: { recent: { form: ['4', '144'], filingDate: ['2026-10-30', '2026-10-28'], accessionNumber: ['0001-26-000001', '0001-26-000002'], primaryDocument: ['xslF345X05/f4.xml', 'p.xml'] } } });
      if (u.endsWith('/000126000001/f4.xml')) return xml;
      return null;
    };
    const L = await liveInsiders('zzzt', sec, new Date('2026-11-02T20:00:00Z'));
    expect(L?.trades.length).toBeGreaterThan(0);
    expect(L?.f144.length).toBe(1);
    const r = liveReply(L!, null, new Date('2026-11-02T20:00:00Z'));
    expect(r.text).toContain('ZZZT');
    expect(r.text).toContain('Sold:');
    expect(r.text).toContain('live from SEC EDGAR');
  });
});
