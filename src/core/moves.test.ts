import { readFileSync } from 'node:fs';
import { fmtPct, grouped, parseMoves, sectionsOf, tfFromHash } from './moves';

describe('big moves file (public/movers/latest.json)', () => {
  const js = {
    generated: '2026-10-30T21:06:00Z',
    sections: [
      { tf: 'D1', close: '2026-10-29T21:00:00+00:00', label: 'day closed Thu 3:00 PM', rows: [] },
      { tf: 'D1', close: '2026-10-30T21:00:00+00:00', label: 'day closed Fri 3:00 PM', feed: 'SIP', rows: [
        { sym: 'GBPJPY', group: 'fx', market: 'fx', pct: 1.2, x: 2.6, ctx: 'into D1 supply' },
        { sym: 'NVDA', group: 'stock', market: 'stock', pct: -6.4, x: 2.3, tags: ['gap ▼3.1%'], why: { title: 'Nvidia falls', url: 'javascript:alert(1)' } },
        { sym: '', group: 'fx' }, { sym: 'X', group: 'nope' }] },
      { tf: 'M1', rows: [] },
    ],
  };

  it('keeps good rows, drops bad ones and unsafe links', () => {
    const f = parseMoves(js);
    expect(f.sections.map(s => s.tf)).toEqual(['D1', 'D1']);
    const fri = sectionsOf(f, 'D1')[0];
    expect(fri.label).toBe('day closed Fri 3:00 PM');
    expect(fri.rows.map(r => r.sym)).toEqual(['GBPJPY', 'NVDA']);
    expect(fri.rows[1].why).toEqual({ title: 'Nvidia falls', url: '' });
    expect(grouped(fri).map(([g, rs]) => [g, rs.length])).toEqual([['fx', 1], ['stock', 1]]);
    expect(parseMoves(null).sections).toEqual([]);
  });

  it('formats like Telegram and reads the +N more links', () => {
    expect(fmtPct(1.234)).toBe('+1.2%');
    expect(fmtPct(-0.42)).toBe('-0.42%');
    expect(tfFromHash('#w1')).toBe('W1');
    expect(tfFromHash('#zz')).toBeNull();
  });

  it('is served as JSON, not rewritten to the app', () => {
    const v = readFileSync('vercel.json', 'utf8');
    expect(v).toContain('movers/.*\\\\.json');
  });
});

describe('3-day window', () => {
  it('keeps only closes from the last 3 days', async () => {
    const { sectionsOf } = await import('./moves');
    const now = Date.parse('2026-10-30T12:00:00Z');
    const sec = (close: string) => ({ tf: 'H1' as const, close, label: '', fams: [], feed: '', rows: [] });
    const f = { generated: '', sections: [sec('2026-10-30T11:00:00Z'), sec('2026-10-27T13:00:00Z'), sec('2026-10-27T11:00:00Z')] } as never;
    expect(sectionsOf(f, 'H1', now).map(s => s.close)).toEqual(['2026-10-30T11:00:00Z', '2026-10-27T13:00:00Z']);
  });
});

describe('3-week window for 1D / 1W', () => {
  it('keeps daily closes up to 21 days', async () => {
    const { sectionsOf } = await import('./moves');
    const now = Date.parse('2026-10-30T12:00:00Z');
    const sec = (close: string) => ({ tf: 'D1' as const, close, label: '', fams: [], feed: '', rows: [] });
    const f = { generated: '', sections: [sec('2026-10-20T21:00:00Z'), sec('2026-10-08T21:00:00Z')] } as never;
    expect(sectionsOf(f, 'D1', now).map(s => s.close)).toEqual(['2026-10-20T21:00:00Z']);
  });
});
