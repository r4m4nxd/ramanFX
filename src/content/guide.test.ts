import { readFileSync } from 'node:fs';
import { COMMANDS } from '../../supabase/functions/telegram-bot/logic';
import { GUIDE, filterGuide, sectionOf } from './guide';

const commands: { command: string }[] = JSON.parse(readFileSync('supabase/functions/telegram-bot/commands.json', 'utf8'));
const items = GUIDE.flatMap(s => s.items);

describe('in-app guide', () => {
  it('has a row for every Telegram command in commands.json (add one when you add a command)', () => {
    const inGuide = new Set(items.map(i => i.cmd).filter(Boolean));
    const missing = commands.map(c => c.command).filter(c => !inGuide.has(c));
    expect(missing).toEqual([]);
  });

  it('lists no command the bot does not have', () => {
    const known = new Set(COMMANDS.map(c => c.command));
    for (const i of items) if (i.cmd) expect(known.has(i.cmd), `/${i.cmd}`).toBe(true);
  });

  it('every command row has an example and what you get', () => {
    for (const i of items.filter(x => x.cmd)) {
      expect(i.example, i.id).toMatch(new RegExp(`^/${i.cmd}\\b`));
      expect(i.get, i.id).toBeTruthy();
    }
  });

  it('has the agreed sections, unique anchors', () => {
    expect(GUIDE.map(s => s.title)).toEqual(['Start here', 'Daily routine', 'App features', 'Telegram bot', 'Alerts & messages', 'Data & coverage', 'Settings & keys', 'Troubleshooting', 'Costs & limits']);
    const ids = [...GUIDE.map(s => s.id), ...items.map(i => i.id)];
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    expect(sectionOf('b-chart')).toBe('bot');
    expect(sectionOf('fix')).toBe('fix');
    expect(sectionOf('nope')).toBeNull();
  });

  it('never holds a secret value (names only)', () => {
    const text = JSON.stringify(GUIDE);
    expect(text).not.toMatch(/\b(sk|pk|ghp|github_pat)_[A-Za-z0-9]{10,}/);
    expect(text).not.toMatch(/\b\d{8,10}:[A-Za-z0-9_-]{30,}\b/);   // Telegram bot token shape
    expect(text).not.toMatch(/[A-Za-z0-9]{40,}/);
  });

  it('search keeps matching items only, all words in any order', () => {
    const r = filterGuide('alpaca 401');
    expect(r.length).toBeGreaterThan(0);
    expect(r.flatMap(s => s.items).some(i => i.id === 't-lastclose')).toBe(true);
    expect(filterGuide('15m chart').flatMap(s => s.items).map(i => i.id)).toContain('b-chart');
    expect(filterGuide('zzzz-nothing')).toEqual([]);
    expect(filterGuide('  ')).toBe(GUIDE);
  });
});
