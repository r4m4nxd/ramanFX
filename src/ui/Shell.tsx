import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/data/store';
import { Icon, type IconName } from './Icon';
import { cx, Segmented, Sheet, spring, useToast } from './kit';
import { ImportPanel } from './ImportPanel';
import { RangePicker } from './RangePicker';

export const NAV: { to: string; label: string; short?: string; icon: IconName; mobile?: boolean; group?: string }[] = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: 'dashboard', mobile: true },
  { to: '/journal', label: 'Daily journal', short: 'Journal', icon: 'journal', mobile: true },
  { to: '/trades', label: 'Trades', icon: 'trades', mobile: true },
  { to: '/reports', label: 'Reports', icon: 'reports' },
  { to: '/calendar', label: 'Calendar', icon: 'calendar' },
  { to: '/heatmaps', label: 'Heat maps', icon: 'flame' },
  { to: '/playbook', label: 'Playbook', icon: 'playbook', mobile: true, group: 'Plan' },
  { to: '/calculator', label: 'Calculator', icon: 'calculator', group: 'Plan' },
  { to: '/risk', label: 'Risk rules', icon: 'shield', group: 'Plan' },
  { to: '/strategies', label: 'Strategies', icon: 'strategy', group: 'Plan' },
  { to: '/notebook', label: 'Notebook', icon: 'notebook', group: 'Plan' },
  { to: '/exits', label: 'Exit analysis', icon: 'exit', group: 'Review' },
  { to: '/settings', label: 'Settings', icon: 'settings', group: 'Review' },
];

function SyncPill({ compact }: { compact?: boolean }) {
  const sync = useStore(s => s.sync);
  const user = useStore(s => s.user);
  const syncNow = useStore(s => s.syncNow);
  const nav = useNavigate();
  if (!user) return <button className="btn-ghost h-8 text-xs text-ink3" aria-label="Local only — sign in to sync" onClick={() => nav('/settings')}><Icon name="cloud" size={14} />{!compact && 'Local only'}</button>;
  const label = sync.status === 'syncing' ? 'Syncing…' : sync.status === 'error' ? 'Sync failed' : 'Synced';
  return (
    <button className={cx('btn-ghost h-8 text-xs', compact && 'w-9 px-0')} aria-label={compact ? label : undefined} onClick={() => syncNow()} title={sync.message ?? (sync.at ? `Last sync ${new Date(sync.at).toLocaleTimeString()}` : '')}>
      <span className={cx('w-1.5 h-1.5 rounded-full', sync.status === 'error' ? 'bg-loss' : sync.status === 'syncing' ? 'bg-warn animate-pulse' : 'bg-profit')} />
      <span className={cx(sync.status === 'error' ? 'text-loss' : 'text-ink2', compact && 'sr-only')}>{label}</span>
    </button>
  );
}

function AccountPicker() {
  const accounts = useStore(s => s.accounts);
  const active = useStore(s => s.activeAccount);
  const setActive = useStore(s => s.setActiveAccount);
  const list = Object.values(accounts);
  if (list.length < 2) return null;
  return (
    <label className="relative min-w-0">
      <span className="sr-only">Account</span>
      <select className="field h-9 pr-8 appearance-none text-[13px] font-medium bg-raised truncate" value={active} onChange={e => setActive(e.target.value)}>
        <option value="all">All accounts</option>
        {list.map(a => <option key={a.id} value={a.id}>{a.broker} · {a.id}</option>)}
      </select>
      <Icon name="chevronDown" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink3" />
    </label>
  );
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const trades = useStore(s => s.trades);
  const items = useMemo(() => {
    const pages = NAV.map(n => ({ key: n.to, label: n.label, hint: 'Page', go: () => nav(n.to), icon: n.icon }));
    const ql = q.trim().toLowerCase();
    if (!ql) return pages;
    const tr = trades.filter(t => t.symbol.toLowerCase().includes(ql) || t.id.includes(ql)).slice(-6).reverse()
      .map(t => ({ key: t.id, label: `${t.symbol} ${t.type} · #${t.id}`, hint: t.closeTime.slice(0, 10), go: () => nav(`/trades/${t.id}`), icon: 'trades' as IconName }));
    return [...pages.filter(p => p.label.toLowerCase().includes(ql)), ...tr];
  }, [q, trades, nav]);
  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { if (!open) setQ(''); }, [open]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[calc(12vh+env(safe-area-inset-top))] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div className="relative w-full max-w-lg card shadow-pop overflow-hidden" initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring}>
            <div className="flex items-center gap-2 px-4 border-b border-line">
              <Icon name="search" className="text-ink3" />
              <input autoFocus aria-label="Search pages and trades" placeholder="Go to page or find a trade…" value={q} onChange={e => setQ(e.target.value)}
                className="flex-1 h-12 bg-transparent border-0 ring-0 focus:ring-0 text-sm"
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(items.length - 1, x + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(0, x - 1)); }
                  if (e.key === 'Enter' && items[i]) { items[i].go(); onClose(); }
                  if (e.key === 'Escape') onClose();
                }} />
              <kbd className="text-[10px] text-ink3 border border-line2 rounded px-1.5 py-0.5">ESC</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-1.5">
              {items.map((it, k) => (
                <li key={it.key}>
                  <button className={cx('w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-left', k === i ? 'bg-raised text-ink' : 'text-ink2')} onMouseEnter={() => setI(k)} onClick={() => { it.go(); onClose(); }}>
                    <Icon name={it.icon} size={15} className="text-ink3" />{it.label}<span className="ml-auto text-[11px] text-ink3">{it.hint}</span>
                  </button>
                </li>
              ))}
              {!items.length && <li className="px-3 py-6 text-center text-sm text-ink3">Nothing found</li>}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const theme = useStore(s => s.theme), setTheme = useStore(s => s.setTheme);
  const privacy = useStore(s => s.privacy), setPrivacy = useStore(s => s.setPrivacy);
  const hasTrades = useStore(s => s.trades.length > 0);
  const [importOpen, setImportOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cmd, setCmd] = useState(false);
  const toast = useToast();
  const mainRef = useRef<HTMLDivElement>(null);
  const title = NAV.find(n => (n.to === '/' ? loc.pathname === '/' : loc.pathname.startsWith(n.to)))?.label ?? 'Trade';

  useEffect(() => { window.scrollTo({ top: 0 }); setMoreOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(v => !v); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const open = () => setImportOpen(true);
    window.addEventListener('rfx:import', open);
    return () => window.removeEventListener('rfx:import', open);
  }, []);

  const groups = ['', 'Plan', 'Review'];
  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[232px] shrink-0 flex-col gap-1 border-r border-line bg-surface/40 px-3 py-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-2.5 pb-5 pt-1">
          <div className="w-8 h-8 rounded-[9px] bg-accent grid place-items-center"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#0A0C0F" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 17l6-6 4 4 8-8" /></svg></div>
          <div className="font-bold text-[16px] tracking-tight">RamanFX</div>
        </div>
        {groups.map(g => (
          <div key={g} className="flex flex-col gap-0.5 mb-3">
            {g && <div className="label px-3 pb-1.5 pt-1">{g}</div>}
            {NAV.filter(n => (n.group ?? '') === g).map(n => (
              <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('relative flex items-center gap-3 h-9 px-3 rounded-lg text-[13.5px] font-medium transition-colors', isActive ? 'text-ink' : 'text-ink3 hover:text-ink2 hover:bg-raised/60')}>
                {({ isActive }) => (<>
                  {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-raised border border-line" transition={spring} />}
                  <Icon name={n.icon} size={16} className="relative" /><span className="relative">{n.label}</span>
                </>)}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="flex-1" />
        <button className="btn-ghost justify-start text-ink3 text-xs" onClick={() => setCmd(true)}><Icon name="search" size={14} />Search<kbd className="ml-auto text-[10px] border border-line2 rounded px-1.5">⌘K</kbd></button>
        <a href="/legacy.html" className="btn-ghost justify-start text-ink3 text-xs"><Icon name="link" size={14} />Classic app</a>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col" ref={mainRef}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-line pt-safe px-safe">
          <div className="max-w-[1360px] mx-auto flex items-center gap-2 px-4 lg:px-7 h-14">
            <h1 className="text-[17px] font-semibold tracking-tight truncate">{title}</h1>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="hidden md:flex items-center gap-1.5">
                <SyncPill />
                <AccountPicker />
                <RangePicker />
              </div>
              <button className="btn-ghost w-9 px-0" aria-label={privacy ? 'Show amounts' : 'Hide amounts'} aria-pressed={privacy} onClick={() => { setPrivacy(!privacy); toast(privacy ? 'Amounts visible' : 'Amounts hidden', 'info'); }}><Icon name={privacy ? 'eyeOff' : 'eye'} /></button>
              <button className="btn-ghost w-9 px-0" aria-label="Toggle theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
              <button className="btn-primary" onClick={() => setImportOpen(true)}><Icon name="upload" size={15} /><span className="hidden sm:inline">Import</span></button>
            </div>
          </div>
          <div className="md:hidden flex items-center gap-2 px-4 pb-2.5 [&>*]:flex-1">
            <RangePicker /><AccountPicker /><div className="!flex-none"><SyncPill compact /></div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1360px] mx-auto px-4 lg:px-7 pt-5 pb-28 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div key={loc.pathname} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.22 }}>
              {!hasTrades && !['/playbook', '/calculator', '/settings', '/risk', '/notebook', '/strategies'].includes(loc.pathname) ? <Welcome onImport={() => setImportOpen(true)} /> : children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile tab bar */}
      <nav aria-label="Main" className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/90 backdrop-blur-xl border-t border-line pb-safe px-safe">
        <div className="flex justify-around px-2 pt-1.5">
          {NAV.filter(n => n.mobile).map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('relative flex flex-col items-center gap-0.5 min-w-[58px] min-h-[46px] justify-center text-[10.5px] font-medium', isActive ? 'text-accent' : 'text-ink3')}>
              <Icon name={n.icon} size={20} />{n.short ?? n.label}
            </NavLink>
          ))}
          <button className="flex flex-col items-center gap-0.5 min-w-[58px] min-h-[46px] justify-center text-[10.5px] font-medium text-ink3" onClick={() => setMoreOpen(true)}>
            <Icon name="more" size={20} />More
          </button>
        </div>
      </nav>

      <Sheet open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <div className="grid grid-cols-3 gap-2">
          {NAV.filter(n => !n.mobile).map(n => (
            <NavLink key={n.to} to={n.to} className="flex flex-col items-center gap-2 py-4 rounded-xl bg-raised border border-line text-xs font-medium text-ink2">
              <Icon name={n.icon} size={20} />{n.label}
            </NavLink>
          ))}
          <button className="flex flex-col items-center gap-2 py-4 rounded-xl bg-raised border border-line text-xs font-medium text-ink2" onClick={() => { setMoreOpen(false); setCmd(true); }}><Icon name="search" size={20} />Search</button>
          <a href="/legacy.html" className="flex flex-col items-center gap-2 py-4 rounded-xl bg-raised border border-line text-xs font-medium text-ink2"><Icon name="link" size={20} />Classic app</a>
        </div>
      </Sheet>
      <Sheet open={importOpen} onClose={() => setImportOpen(false)} title="Import trades"><ImportPanel onDone={() => setImportOpen(false)} /></Sheet>
      <CommandPalette open={cmd} onClose={() => setCmd(false)} />
    </div>
  );
}

function Welcome({ onImport }: { onImport: () => void }) {
  const nav = useNavigate();
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <motion.div className="max-w-md text-center flex flex-col items-center gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 grid place-items-center text-accent"><Icon name="upload" size={24} /></div>
        <h2 className="text-2xl font-bold tracking-tight">Bring in your trades</h2>
        <p className="text-ink2 leading-relaxed">Export your account history from MetaTrader 5 or 4 as an HTML report and drop it here. Or sign in to load the journal you've already synced.</p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button className="btn-primary h-10 px-5" onClick={onImport}>Import MT5 / MT4 report</button>
          <button className="btn h-10 px-5" onClick={() => nav('/settings')}>Sign in to sync</button>
        </div>
        <div className="text-xs text-ink3">Your Playbook, Calculator and Risk rules work without trades.</div>
        <Segmented label="Theme" value={useStore.getState().theme} onChange={v => useStore.getState().setTheme(v)} size="sm" options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
      </motion.div>
    </div>
  );
}
