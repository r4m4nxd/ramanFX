import { describe, expect, it } from 'vitest';
import { safeSvg } from '@/ui/LessonMedia';

// Every lesson figure shipped in the app must still pass the sanitizer.
const files = import.meta.glob('/src/core/mentors/**/*.ts', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

describe('lesson figures', () => {
  it('all pass safeSvg', () => {
    const svgs = Object.values(files).flatMap(s => s.match(/<svg[\s\S]*?<\/svg>/g) ?? []);
    expect(svgs.length).toBeGreaterThan(200);
    const bad = svgs.filter(s => safeSvg(s.replace(/\\"/g, '"').replace(/\\n/g, '\n')) === null);
    expect(bad.map(s => s.slice(0, 80))).toEqual([]);
  });
});
