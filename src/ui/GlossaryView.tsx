// Searchable, alphabetical glossary with a letter jump bar.
import { useMemo } from 'react';
import { GLOSSARY, GLOSSARY_MENTOR_LABEL, type GlossaryMentor } from '@/core/glossary';
import { Badge, Card, cx, RevealText } from '@/ui/kit';

const TONE: Record<GlossaryMentor, 'accent' | 'violet' | 'warn' | 'profit' | 'neutral'> = { kevin: 'accent', seiden: 'violet', baker: 'warn', raja: 'profit', bot: 'neutral' };
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const first = (t: string) => { const c = t.trim()[0]?.toUpperCase() ?? '#'; return /[A-Z]/.test(c) ? c : '#'; };

export function GlossaryView({ q, mentor }: { q: string; mentor: GlossaryMentor | 'all' }) {
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const hits = GLOSSARY
      .filter(g => mentor === 'all' || g.mentors?.includes(mentor))
      .filter(g => !s || (g.term + ' ' + g.definition).toLowerCase().includes(s))
      .sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: 'base' }));
    const m = new Map<string, typeof hits>();
    for (const g of hits) { const k = first(g.term); m.set(k, [...(m.get(k) ?? []), g]); }
    return m;
  }, [q, mentor]);
  const jump = (L: string) => document.getElementById(`gloss-${L}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const count = [...groups.values()].reduce((a, g) => a + g.length, 0);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <RevealText as="h2" className="text-[20px] font-semibold" text="Glossary" />
        <p className="text-[14px] text-ink2 mt-2 max-w-[70ch]">Every supply-and-demand term the mentors and the bot use, from the combined rulebook. Tags show whose definition is cited. {count} of {GLOSSARY.length} shown.</p>
        <nav aria-label="Jump to letter" className="flex flex-wrap gap-1 mt-4">
          {LETTERS.map(L => {
            const has = groups.has(L);
            return <button key={L} type="button" disabled={!has} onClick={() => jump(L)} aria-label={`Jump to ${L}`}
              className={cx('num w-7 h-7 rounded-md text-[12px] font-semibold transition-colors', has ? 'text-ink hover:bg-accent/15 hover:text-accent' : 'text-ink3/40')}>{L}</button>;
          })}
        </nav>
      </Card>
      {count === 0 && <Card><p className="text-[13px] text-ink3">No term mentions “{q}”.</p></Card>}
      {[...groups.entries()].map(([L, items]) => (
        <Card key={L} className="scroll-mt-24">
          <div id={`gloss-${L}`} className="scroll-mt-24 text-[20px] font-semibold text-accent mb-2">{L}</div>
          <dl className="flex flex-col divide-y divide-line">
            {items.map(g => (
              <div key={g.term} className="py-3 grid gap-1 sm:grid-cols-[220px_1fr] sm:gap-4">
                <dt className="text-[14px] font-semibold text-ink">{g.term}</dt>
                <dd className="text-[13.5px] text-ink2 leading-relaxed">
                  {g.definition}
                  {g.mentors && g.mentors.length > 0 && <span className="flex flex-wrap gap-1.5 mt-1.5">{g.mentors.map(m => <Badge key={m} tone={TONE[m]}>{GLOSSARY_MENTOR_LABEL[m]}</Badge>)}</span>}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      ))}
    </div>
  );
}
