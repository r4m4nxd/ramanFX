// Telegram bot /ask (supabase/functions/telegram-bot/ask.ts) and /news (news.ts): pure ranking + formatting.
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { bestQuote, buildIndex, lessonPath, search, terms } from '../../supabase/functions/telegram-bot/ask';
import { groupLines, newsRows, newsText } from '../../supabase/functions/telegram-bot/news';
import { handle, type Ctx } from '../../supabase/functions/telegram-bot/logic';

const FIX = {
  lessons: [{ src: 'course', n: 1, title: 'Intro' }, { src: 'raja', n: 4, title: 'Proximal lines' }, { src: 'seiden', n: 2, title: 'Odds enhancers' }],
  passages: [
    { l: 0, h: 'Intro', t: 'Welcome to the course. We trade supply and demand. Supply and demand drive every market.' },
    { l: 1, h: 'Drawing', t: 'The proximal line is drawn at the body of the base candle nearest price. The distal line goes at the far wick.' },
    { l: 2, h: 'Odds', t: 'Freshness is the biggest odds enhancer. A zone tested many times is weak. Time spent in the base matters.' },
    { l: 1, h: 'Entries', t: 'Place the limit order at the proximal line and the stop loss beyond the distal line.' },
  ],
};

describe('telegram /ask (BM25)', () => {
  const ix = buildIndex(FIX)!;
  it('stems and drops stopwords', () => {
    expect(terms('What are the proximal lines?')).toEqual(['proximal', 'line']);
    expect(terms('How does freshness matter')).toEqual(['freshness', 'matter']);
  });
  it('ranks the passage with the rare query terms first, one hit per lesson', () => {
    const hits = search(ix, 'where do I draw the proximal line', 3);
    expect(hits[0].lesson.title).toBe('Proximal lines');
    expect(hits.filter(h => h.lesson.n === 4 && h.lesson.src === 'raja')).toHaveLength(1);
    expect(search(ix, 'freshness odds enhancer')[0].lesson.src).toBe('seiden');
    expect(search(ix, 'zzqqxx')).toEqual([]);
    expect(search(ix, 'what is the')).toEqual([]);
  });
  it('quotes the best-matching sentence, trimmed with ellipses', () => {
    const long = 'Intro words here. '.repeat(20) + 'The proximal line sits at the base body. ' + 'More filler text follows. '.repeat(20);
    const q = bestQuote(long, 'proximal line', 120);
    expect(q).toContain('The proximal line sits at the base body.');
    expect(q.length).toBeLessThanOrEqual(122);
    expect(q.startsWith('…')).toBe(true);
    expect(q.endsWith('…')).toBe(true);
    expect(bestQuote('Short one.', 'x')).toBe('Short one.');
  });
  it('lesson links use the app Learn URL format', () => {
    expect(lessonPath('course', 3)).toBe('/learn?l=3');
    expect(lessonPath('raja', 4)).toBe('/learn?src=raja&l=4');
    expect(lessonPath('glossary', 0)).toBe('/learn?src=glossary');
  });
  it('real passages.json: a known question returns a relevant lesson', () => {
    const p = 'public/ask/passages.json';
    if (!existsSync(p)) return;
    const real = buildIndex(JSON.parse(readFileSync(p, 'utf8')))!;
    const hits = search(real, 'when is a zone removed', 3);
    expect(hits.length).toBe(3);
    expect(hits.some(h => /remov|delet|invalid/i.test(`${h.lesson.title} ${h.p.t}`))).toBe(true);
    const tl = search(real, 'how do I draw a trendline', 3);
    expect(tl.some(h => /trend ?line/i.test(`${h.lesson.title} ${h.p.t}`))).toBe(true);
  });
});

const CAL = { status: 'ok', result: [
  { title: 'Core PCE Price Index MoM', country: 'US', importance: 1, date: '2026-10-29T12:30:00.000Z' },
  { title: 'GDP Growth Rate QoQ', country: 'US', importance: 1, date: '2026-10-29T12:30:00.000Z' },
  { title: 'ECB Interest Rate Decision', country: 'EU', importance: 1, date: '2026-10-29T13:15:00.000Z' },
  { title: 'BoJ Interest Rate Decision', country: 'JP', importance: 1, date: '2026-10-30T03:00:00.000Z' },
  { title: 'Retail Sales <MoM>', country: 'AU', importance: 0, date: '2026-10-29T22:30:00.000Z' },
  { title: 'Low thing', country: 'NZ', importance: -1, date: '2026-10-29T21:45:00.000Z' },
  { title: 'Ivey PMI', country: 'CA', importance: 1, date: '2026-10-30T14:00:00.000Z' },
  { title: 'Tomorrow afternoon', country: 'US', importance: 1, date: '2026-10-30T20:00:00.000Z' },
  { title: 'Yesterday', country: 'GB', importance: 1, date: '2026-10-28T09:00:00.000Z' },
] };

describe('telegram /news', () => {
  const now = new Date('2026-10-29T13:00:00Z');        // 7:00 AM Calgary (MDT, UTC-6)
  it('window = today + tomorrow morning (Calgary), high + medium when high ones are few, escaped', () => {
    const rows = newsRows(CAL, now)!;
    expect(rows.map(r => r.title)).toEqual(['Core PCE Price Index MoM', 'GDP Growth Rate QoQ', 'ECB Interest Rate Decision', 'BoJ Interest Rate Decision', 'Ivey PMI']);
    const few = newsRows({ result: CAL.result.filter(r => !/PCE|ECB/.test(r.title)) }, now)!;
    expect(few.map(r => r.title)).toContain('Retail Sales <MoM>');   // only 2 high -> medium added
    expect(few.map(r => r.title)).not.toContain('Low thing');
    const lines = groupLines(few, now);
    expect(lines.join('\n')).toContain('🇦🇺 AU Retail Sales &lt;MoM&gt; (medium)');
    expect(newsRows(null, now)).toBeNull();
    expect(newsRows({ status: 'error' }, now)).toBeNull();
  });
  it('groups by Calgary time, strikes passed times, shows tomorrow morning and key US events', () => {
    const key = [{ name: 'US inflation (CPI)', t: new Date('2026-10-29T12:30:00Z'), verified: true }];
    const text = newsText(CAL, key, now).join('\n');
    expect(text).toContain('Thu Oct 29');
    expect(text).toContain('<s><b>6:30 AM</b> · 🇺🇸 US Core PCE Price Index MoM · 🇺🇸 US GDP Growth Rate QoQ</s>');
    expect(text).toContain('<b>7:15 AM</b> · 🇪🇺 EU ECB Interest Rate Decision');
    expect(text).toContain('<b>Tomorrow morning · Fri Oct 30</b>');
    expect(text).toContain('<b>9:00 PM</b> · 🇯🇵 JP BoJ Interest Rate Decision');      // 03:00 UTC Oct 30 = Oct 29 evening
    expect(text).toContain('<b>Tomorrow morning · Fri Oct 30</b>\n<b>8:00 AM</b> · 🇨🇦 CA Ivey PMI');
    expect(text).toContain('⏰ <b>US inflation (CPI) today · 6:30 AM</b>');
    expect(text).not.toContain('Tomorrow afternoon');
    expect(text).not.toContain('Yesterday');
    expect(text).toContain('not advice');
  });
  it('Alberta permanent UTC-6 from 2026-11-01 (13:30 UTC = 7:30 AM, not 6:30 AM)', () => {
    const cal = { result: [{ title: 'Nonfarm Payrolls', country: 'US', importance: 1, date: '2026-11-06T13:30:00.000Z' },
      { title: 'Unemployment Rate', country: 'US', importance: 1, date: '2026-11-06T13:30:00.000Z' },
      { title: 'Tokyo CPI', country: 'JP', importance: 1, date: '2026-11-06T23:30:00.000Z' },
      { title: 'Westpac thing', country: 'NZ', importance: 1, date: '2026-11-07T18:00:00.000Z' }] };
    const text = newsText(cal, [], new Date('2026-11-06T12:00:00Z')).join('\n');
    expect(text).toContain('Fri Nov 6');
    expect(text).toContain('<b>7:30 AM</b> · 🇺🇸 US Nonfarm Payrolls · 🇺🇸 US Unemployment Rate');
    expect(text).toContain('<b>5:30 PM</b> · 🇯🇵 JP Tokyo CPI');
    expect(text).not.toContain('Westpac');                      // tomorrow noon (18:00 UTC at UTC-6) is past the morning
  });
  it('calendar down: calm notice, key events still listed', () => {
    const t = newsText(null, [{ name: 'Fed decision (FOMC)', t: new Date('2026-10-29T18:00:00Z'), verified: true }], new Date('2026-10-29T13:00:00Z')).join('\n');
    expect(t).toContain('Calendar unavailable');
    expect(t).toContain('Fed decision (FOMC) today · 12:00 PM');
  });
  it('/news through the dispatcher reads events.json and stays under 4096', async () => {
    const ctx: Ctx = { now: new Date('2026-11-10T12:00:00Z'), async load(p) {
      if (p === 'news.json') return { result: [{ title: 'CPI', country: 'US', importance: 1, date: '2026-11-10T13:30:00.000Z' }] };
      if (p === 'events.json') return { kinds: { cpi: { events: [{ date: '2026-11-10', et: '08:30', verified: true }] }, nfp: { events: [] }, fomc: { events: [] } } };
      return null;
    } };
    const r = await handle('/news', ctx);
    expect(r.cmd).toBe('news');
    expect(r.text).toContain('⏰ <b>US inflation (CPI) today · 7:30 AM</b>');
    expect(r.text).toContain('<b>7:30 AM</b> · 🇺🇸 US CPI');
    expect(r.text.length).toBeLessThanOrEqual(4096);
  });
});
