import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { caption, cardSvg, plainFund, plainName, trendOf, type CardData } from '../../supabase/functions/telegram-bot/card';
import { summaryCard, type Ctx } from '../../supabase/functions/telegram-bot/logic';

const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
const ctx: Ctx = { now: new Date('2026-10-29T15:00:00Z'), async load(path: string) { return path === 'events.json' ? { kinds: {} } : read(`public/${path}`); } };

describe('summary share card', () => {
  it('plain words: names, trend, company numbers', () => {
    expect(plainName('EURUSD', '', 'fx')).toBe('Euro vs US dollar');
    expect(plainName('XAUUSD', '', 'fx')).toBe('Gold (in US dollars)');
    expect(trendOf('Trend: W1 pullback · MN pullback · 3M up').map(t => `${t.label}:${t.word}`)).toEqual(['THIS WEEK:Dipping', 'THIS MONTH:Dipping', 'BIG PICTURE:Rising']);
    const f = plainFund(['Revenue TTM: $303.0B +83% YoY (2026-07)', 'Net margin: 64%', 'Debt / equity: 0.15 (2026-07)']);
    expect(f.map(x => `${x.label}=${x.value}`)).toEqual(['Sales, last 12 months=$303.0B', 'Profit from sales=64¢', 'Debt=Low']);
    expect(f[0].sub).toBe('up 83% on last year');
  });
  it('real data -> a caption without jargon and a well-formed SVG', async () => {
    for (const sym of ['NVDA', 'EURUSD', 'XAUUSD']) {
      const d = await summaryCard(sym, ctx) as CardData;
      expect(d).toBeTruthy();
      const c = caption(d);
      expect(c.length).toBeLessThanOrEqual(1024);
      expect(c).not.toMatch(/\b(demand|supply|W1|MN|3M|R:R|TF)\b/);
      const svg = cardSvg(d);
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
});
describe('premium polish of every reply', () => {
  it('drops decorative emoji at line starts and in buttons, keeps markers, max 3 buttons per row', async () => {
    const { polishText, polishButtons } = await import('../../supabase/functions/telegram-bot/logic');
    expect(polishText('📰 <b>News</b>\n▲ up\n● dot\n⚠️ warn · 🇺🇸 x')).toBe('<b>News</b>\n▲ up\n● dot\nwarn · 🇺🇸 x');
    const rows = polishButtons([[{ text: '🔎 Zones', callback_data: 'z' }, { text: '📊 Chart', callback_data: 'c' }, { text: 'a', callback_data: 'a' }, { text: 'b', callback_data: 'b' }]])!;
    expect(rows.map(r => r.map(b => b.text))).toEqual([['Zones', 'Chart', 'a'], ['b']]);
  });
});
describe('summary card: chart + key points', () => {
  it('the image data has the daily chart and plain key points; the SVG draws them', async () => {
    const { summaryCard } = await import('../../supabase/functions/telegram-bot/logic');
    const read = (p: string) => (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : null);
    const c = { now: new Date('2026-10-29T15:00:00Z'), async load(p: string) { return read(`public/${p}`); } } as Parameters<typeof summaryCard>[1];
    for (const sym of ['NVDA', 'EURUSD']) {
      const d = (await summaryCard(sym, c))!;
      expect(d.chart?.bars.length).toBeGreaterThan(10);
      expect(d.points?.length).toBeGreaterThanOrEqual(2);
      for (const p of d.points!) expect(p).not.toMatch(/\b(demand|supply|W1|MN|D1)\b/);
      const svg = cardSvg(d);
      expect(svg).toContain('DAILY CHART');
      expect(svg).toContain('KEY POINTS');
      expect(svg).not.toMatch(/NaN|undefined/);
    }
  });
});
