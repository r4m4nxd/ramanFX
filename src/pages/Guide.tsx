import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { GUIDE, type GuideSection } from '@/core/guide';
import { Card, cx, ease, Page, useIsMobile } from '@/ui/kit';
import { Icon, type IconName } from '@/ui/Icon';

const GROUPS = [...new Set(GUIDE.map(s => s.group))];

function Section({ s, q }: { s: GuideSection; q: string }) {
  const hi = (t: string) => {
    if (!q) return t;
    const i = t.toLowerCase().indexOf(q);
    return i < 0 ? t : <>{t.slice(0, i)}<mark className="bg-accent/25 text-ink rounded px-0.5">{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>;
  };
  return (
    <motion.section id={s.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, ease }} className="card p-5 md:p-6 scroll-mt-28">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-accent/15 text-accent grid place-items-center shrink-0"><Icon name={s.icon as IconName} size={18} /></span>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-ink3">{s.group}</div>
          <h2 className="text-lg font-semibold tracking-tight">{hi(s.title)}</h2>
        </div>
        {s.to && <Link to={s.to} className="btn h-9 shrink-0">Open<Icon name="chevronRight" size={14} /></Link>}
      </div>
      <p className="text-[14px] text-ink2 leading-relaxed mt-3">{hi(s.intro)}</p>
      {s.steps && (
        <ol className="mt-4 flex flex-col gap-2">
          {s.steps.map((x, i) => <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed"><span className="w-6 h-6 rounded-full bg-raised border border-line num text-[11.5px] font-semibold grid place-items-center shrink-0">{i + 1}</span><span className="pt-0.5">{hi(x)}</span></li>)}
        </ol>
      )}
      <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {s.points.map(([k, v]) => (
          <div key={k} className="rounded-xl bg-raised/50 border border-line p-3">
            <dt className="text-[13px] font-semibold">{hi(k)}</dt>
            <dd className="text-[13px] text-ink2 leading-relaxed mt-1">{hi(v)}</dd>
          </div>
        ))}
      </dl>
      {s.tip && <div className="mt-4 flex gap-2 text-[13px] text-accent"><Icon name="info" size={15} className="shrink-0 mt-0.5" />{s.tip}</div>}
    </motion.section>
  );
}

export default function Guide() {
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  const mobile = useIsMobile();
  const ql = q.trim().toLowerCase();
  const shown = useMemo(() => (ql ? GUIDE.filter(s => [s.title, s.intro, ...(s.steps ?? []), ...s.points.flat(), s.tip ?? ''].join(' ').toLowerCase().includes(ql)) : GUIDE), [ql]);
  const [active, setActive] = useState(GUIDE[0].id);
  useEffect(() => {
    const id = params.get('s');
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  }, [params]);
  useEffect(() => {
    const io = new IntersectionObserver(es => { const v = es.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]; if (v) setActive(v.target.id); }, { rootMargin: '-120px 0px -60% 0px' });
    shown.forEach(s => { const el = document.getElementById(s.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [shown]);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl md:text-[28px] font-semibold tracking-tight sheen-text">Guide</h2>
        <p className="text-[13px] text-ink3 mt-1">Everything the app does, how to use it, and why. {GUIDE.length} sections.</p>
      </motion.div>
      <div className="relative">
        <Icon name="search" size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink3" />
        <input aria-label="Search the guide" className="field pl-9 h-11" placeholder="Search the guide — e.g. breakeven, import, curve" value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="grid lg:grid-cols-[230px_minmax(0,1fr)] gap-4 items-start">
        {!mobile && (
          <Card className="p-2 lg:sticky lg:top-20 max-h-[calc(100vh-110px)] overflow-y-auto">
            <nav aria-label="Guide contents">
              {GROUPS.map(g => (
                <div key={g} className="mb-2">
                  <div className="label px-3 pt-2 pb-1">{g}</div>
                  {GUIDE.filter(s => s.group === g).map(s => (
                    <button key={s.id} onClick={() => go(s.id)} className={cx('relative w-full text-left flex items-center gap-2.5 h-9 px-3 rounded-lg text-[13px]', active === s.id ? 'text-ink font-medium' : 'text-ink3 hover:text-ink2', !shown.includes(s) && 'opacity-35')}>
                      {active === s.id && <motion.span layoutId="guide-pill" className="absolute inset-0 rounded-lg bg-raised border border-line" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                      <Icon name={s.icon as IconName} size={14} className="relative shrink-0" /><span className="relative truncate">{s.title}</span>
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </Card>
        )}
        <div className="flex flex-col gap-4 min-w-0">
          {mobile && !ql && (
            <div className="grid grid-cols-2 gap-2">
              {GUIDE.map(s => <button key={s.id} onClick={() => go(s.id)} className="flex items-center gap-2 rounded-xl bg-raised/60 border border-line px-3 h-11 text-[13px] text-left"><Icon name={s.icon as IconName} size={14} className="text-accent shrink-0" /><span className="truncate">{s.title}</span></button>)}
            </div>
          )}
          <AnimatePresence>{shown.map(s => <Section key={s.id} s={s} q={ql} />)}</AnimatePresence>
          {!shown.length && <Card><p className="text-sm text-ink3 text-center py-8">Nothing matches "{q}".</p></Card>}
        </div>
      </div>
    </Page>
  );
}
