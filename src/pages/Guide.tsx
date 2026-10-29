// /guide: the owner's how-to for every feature, the Telegram bot, the automatic messages, data, keys and fixes.
// Content: src/content/guide.ts (one data file). Search filters items; sections collapse; #anchors deep-link to a
// section or one item (/guide#bot, /guide#b-chart), and the old ?s=<id> links still work.
import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { GUIDE, filterGuide, sectionOf, type GuideItem, type GuideSection } from '@/content/guide';
import { Collapsible, ExpandAll, PillTag, scrollToSection, useOpenSet } from '@/ui/Collapse';
import { Card, cx, Page, useToast } from '@/ui/kit';
import { Icon } from '@/ui/Icon';
import { prefetchProps } from '@/routes';

const ALL = GUIDE.map(s => s.id);

/** Highlight every search word in `t`. */
function Hi({ t, words }: { t: string; words: string[] }) {
  if (!words.length) return <>{t}</>;
  const re = new RegExp(`(${words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{t.split(re).map((p, i) => (i % 2 ? <mark key={i} className="bg-accent/25 text-ink rounded px-0.5">{p}</mark> : p))}</>;
}

function AnchorLink({ id, label }: { id: string; label: string }) {
  const toast = useToast();
  return (
    <a href={`#${id}`} aria-label={`Link to ${label}`} title="Copy link"
      onClick={() => { try { void navigator.clipboard?.writeText(`${location.origin}/guide#${id}`).then(() => toast('Link copied'), () => {}); } catch { /* no clipboard */ } }}
      className="shrink-0 w-8 h-8 -mr-1 grid place-items-center rounded-full text-ink3 hover:text-ink2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent">
      <Icon name="link" size={13} />
    </a>
  );
}

function OpenLink({ to }: { to: string }) {
  return <Link to={to} {...prefetchProps(to)} className="btn h-8 px-3 text-[12.5px] shrink-0">Open<Icon name="chevronRight" size={13} /></Link>;
}

function Item({ it, w, flash }: { it: GuideItem; w: string[]; flash: boolean }) {
  return (
    <article id={it.id} className={cx('jump-target rounded-xl border border-line bg-raised/40 p-3.5 min-w-0 transition-shadow duration-500', flash && 'ring-2 ring-accent/60')}>
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {it.when && <div className="num text-[11.5px] font-semibold text-accent leading-snug mb-0.5"><Hi t={it.when} words={w} /></div>}
          <h4 className="text-[14px] font-semibold leading-snug"><Hi t={it.title} words={w} /></h4>
        </div>
        {it.to && <OpenLink to={it.to} />}
        <AnchorLink id={it.id} label={it.title} />
      </div>
      {it.body && <p className="text-[13.5px] text-ink2 leading-relaxed mt-1.5"><Hi t={it.body} words={w} /></p>}
      {it.steps && (
        <ol className="mt-2.5 flex flex-col gap-2">
          {it.steps.map((x, i) => (
            <li key={i} className="flex gap-2.5 text-[13.5px] leading-relaxed text-ink2">
              <span className="num w-6 h-6 rounded-full grid place-items-center text-[11px] font-semibold shrink-0 bg-accent/10 text-accent">{i + 1}</span>
              <span className="min-w-0 pt-0.5 break-words"><Hi t={x} words={w} /></span>
            </li>
          ))}
        </ol>
      )}
      {it.points && (
        <dl className="mt-2.5 flex flex-col divide-y divide-line">
          {it.points.map(([k, v]) => (
            <div key={k} className="py-2 first:pt-0 last:pb-0 min-w-0">
              <dt className="text-[13px] font-semibold break-words"><Hi t={k} words={w} /></dt>
              <dd className="text-[13px] text-ink2 leading-relaxed mt-0.5 break-words"><Hi t={v} words={w} /></dd>
            </div>
          ))}
        </dl>
      )}
    </article>
  );
}

/** The Telegram command table: a 3-column table on wide screens, stacked rows on a phone. */
function Commands({ items, w, flash }: { items: GuideItem[]; w: string[]; flash: string | null }) {
  return (
    <div className="rounded-xl border border-line overflow-hidden" role="table" aria-label="Telegram commands">
      <div role="row" className="hidden md:grid grid-cols-[150px_minmax(0,1fr)_minmax(0,1.6fr)_32px] gap-3 px-3.5 py-2 bg-raised/50 label">
        <span role="columnheader">Command</span><span role="columnheader">Example</span><span role="columnheader">What you get</span><span />
      </div>
      {items.map(it => (
        <div key={it.id} id={it.id} role="row"
          className={cx('jump-target grid grid-cols-[minmax(0,1fr)_32px] md:grid-cols-[150px_minmax(0,1fr)_minmax(0,1.6fr)_32px] gap-x-3 gap-y-1 px-3.5 py-3 border-t border-line first:border-t-0 md:first:border-t transition-shadow duration-500', flash === it.id && 'ring-2 ring-inset ring-accent/60')}>
          <div role="cell" className="min-w-0 md:order-none">
            <div className="text-[13.5px] font-semibold leading-snug">{it.cmd ? <code className="font-mono text-[13px] text-accent">/{it.cmd}</code> : <Hi t={it.title} words={w} />}</div>
            {it.cmd && <div className="text-[12px] text-ink3 leading-snug"><Hi t={it.title} words={w} /></div>}
          </div>
          <span className="md:hidden row-span-1 justify-self-end"><AnchorLink id={it.id} label={it.title} /></span>
          <div role="cell" className={cx('col-span-2 md:col-span-1 min-w-0', (!it.example || it.example === `/${it.cmd}`) && 'hidden md:block')}>
            {it.example && it.example !== `/${it.cmd}` && <code className="inline-block font-mono text-[12.5px] leading-relaxed px-1.5 py-0.5 rounded-md bg-raised border border-line break-words max-w-full"><Hi t={it.example} words={w} /></code>}
          </div>
          <div role="cell" className="col-span-2 md:col-span-1 text-[13px] text-ink2 leading-relaxed min-w-0 break-words"><Hi t={it.get ?? it.body ?? ''} words={w} /></div>
          <span className="hidden md:block"><AnchorLink id={it.id} label={it.title} /></span>
        </div>
      ))}
    </div>
  );
}

function SectionBody({ s, w, flash }: { s: GuideSection; w: string[]; flash: string | null }) {
  return (
    <>
      <p className="text-[13.5px] text-ink2 leading-relaxed mb-3"><Hi t={s.intro} words={w} /></p>
      {s.kind === 'commands'
        ? <Commands items={s.items} w={w} flash={flash} />
        : <div className={cx('grid gap-2.5', s.items.length > 3 && 'lg:grid-cols-2')}>{s.items.map(it => <Item key={it.id} it={it} w={w} flash={flash === it.id} />)}</div>}
    </>
  );
}

export default function Guide() {
  const loc = useLocation();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const words = useMemo(() => q.trim().toLowerCase().split(/\s+/).filter(Boolean), [q]);
  const shown = useMemo(() => filterGuide(q), [q]);
  const searching = words.length > 0;
  const os = useOpenSet('rfx_guide_open', ['start']);
  const [flash, setFlash] = useState<string | null>(null);
  const flashT = useRef<number>();

  // Deep links: /guide#<section or item id>, legacy /guide?s=<id>. Open the section, then scroll to the target.
  const target = decodeURIComponent(loc.hash.replace(/^#/, '')) || params.get('s') || '';
  useEffect(() => {
    if (!target) return;
    const sec = sectionOf(target);
    if (!sec) return;
    setQ('');
    os.set(sec, true);
    if (target === sec) { scrollToSection(sec, true); return; }
    // An item: wait for the section to open (200 ms) so nothing above it is still moving.
    const t = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFlash(target);
      window.clearTimeout(flashT.current);
      flashT.current = window.setTimeout(() => setFlash(null), 1800);
    }, 260);
    return () => window.clearTimeout(t);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  const allOpen = ALL.every(id => os.isOpen(id));
  const count = shown.reduce((n, s) => n + s.items.length, 0);
  const jump = (id: string) => { setQ(''); os.set(id, true); scrollToSection(id, true); history.replaceState(null, '', `#${id}`); };

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[13.5px] text-ink2 leading-relaxed">Every feature, the Telegram bot, what arrives when, keys and fixes. In Telegram: <code className="font-mono text-[12px]">/guide</code>.</p>
      </motion.div>

      <div className="relative">
        <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3 pointer-events-none" />
        <input type="text" inputMode="search" aria-label="Search the guide" className="field pl-9 pr-10 h-11 w-full text-[16px] md:text-[14px]" placeholder="Search: chart, alert, 401, quiet, brief…"
          value={q} onChange={e => setQ(e.target.value)} enterKeyHint="search" autoComplete="off" />
        {q && <button type="button" aria-label="Clear search" onClick={() => setQ('')} className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full text-ink3 hover:text-ink2"><Icon name="x" size={15} /></button>}
      </div>

      {!searching && (
        <nav aria-label="Guide sections" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {GUIDE.map(s => (
            <a key={s.id} href={`#${s.id}`} onClick={e => { e.preventDefault(); jump(s.id); }}
              className="press flex items-center gap-2 rounded-xl bg-raised/60 border border-line px-3 h-11 text-[13px] min-w-0">
              <Icon name={s.icon} size={14} className="text-accent shrink-0" /><span className="truncate">{s.title}</span>
            </a>
          ))}
        </nav>
      )}

      <div className="flex items-center justify-between gap-2 -my-1">
        <span className="text-[12px] text-ink3 px-1 num" aria-live="polite">{searching ? `${count} match${count === 1 ? '' : 'es'} in ${shown.length} section${shown.length === 1 ? '' : 's'}` : `${GUIDE.length} sections`}</span>
        {!searching && <ExpandAll allOpen={allOpen} onChange={on => os.setMany(ALL, on)} />}
      </div>

      <div className="flex flex-col gap-3 min-w-0">
        {shown.map(s => (
          <Collapsible key={s.id} id={s.id} open={searching || os.isOpen(s.id)} onToggle={() => (searching ? undefined : os.toggle(s.id))}
            lead={<span className="w-9 h-9 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name={s.icon} size={17} /></span>}
            title={<Hi t={s.title} words={words} />} preview={s.intro} pill={<PillTag>{s.items.length}</PillTag>} bodyClassName="pt-0">
            <SectionBody s={s} w={words} flash={flash} />
          </Collapsible>
        ))}
        {!shown.length && <Card><p className="text-sm text-ink3 text-center py-8">Nothing matches "{q}". Try one word, e.g. <b>chart</b> or <b>key</b>.</p></Card>}
      </div>

      <Foot />
    </Page>
  );
}

function Foot() {
  return <p className="text-[11.5px] text-ink3 px-1">Keep it current: the content is src/content/guide.ts. Rule-based scans, not financial advice.</p>;
}
