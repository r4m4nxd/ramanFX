import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/data/store';
import { netOf } from '@/core/stats';
import { money } from '@/lib/format';
import { Ambient } from './Ambient';
import { Icon, type IconName } from './Icon';
import { cx, Segmented, Sheet, spring, useDialogFocus, useOnline, useToast } from './kit';
import { ImportPanel } from './ImportPanel';
import { presets, RangePicker } from './RangePicker';

type Group = 'Today' | 'Review' | 'Plan & tools' | 'Help';
/**
 * Every page, grouped the way a trading day runs: today's work, reviewing what happened, planning tools, help.
 * `mobile` = in the phone tab bar; `scoped` = the page reads the date range / account filters; `hint` = one line on what it's for.
 */
export const NAV: { to: string; label: string; short?: string; icon: IconName; mobile?: boolean; group: Group; hint: string; scoped?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', mobile: true, group: 'Today', hint: 'Today at a glance', scoped: true },
  { to: '/plan', label: 'Planner', short: 'Plan', icon: 'target', mobile: true, group: 'Today', hint: "Today's zones and entries", scoped: true },
  { to: '/journal', label: 'Daily journal', short: 'Journal', icon: 'journal', mobile: true, group: 'Today', hint: 'Notes and P&L by day', scoped: true },
  { to: '/trades', label: 'Trades', icon: 'trades', mobile: true, group: 'Review', hint: 'Every position, filter and review', scoped: true },
  { to: '/reports', label: 'Reports', icon: 'reports', group: 'Review', hint: 'Performance by symbol, session, setup', scoped: true },
  { to: '/calendar', label: 'P&L calendar', short: 'P&L cal', icon: 'calendar', group: 'Review', hint: 'Daily results on a calendar', scoped: true },
  { to: '/heatmaps', label: 'Heat maps', icon: 'flame', group: 'Review', hint: 'When and where you make money', scoped: true },
  { to: '/exits', label: 'MAE / MFE lab', short: 'MAE/MFE', icon: 'exit', group: 'Review', hint: 'How far trades went against and for you', scoped: true },
  { to: '/guru', label: 'Guru', icon: 'sparkles', group: 'Review', hint: 'Growth projection and coaching', scoped: true },
  { to: '/playbook', label: 'Playbook', icon: 'playbook', group: 'Plan & tools', hint: 'Setups and their rules', scoped: true },
  { to: '/strategies', label: 'Strategies', icon: 'strategy', group: 'Plan & tools', hint: 'Strategy performance', scoped: true },
  { to: '/risk', label: 'Risk rules', icon: 'shield', group: 'Plan & tools', hint: 'Daily loss and trade limits', scoped: true },
  { to: '/calculator', label: 'Calculator', icon: 'calculator', group: 'Plan & tools', hint: 'Lot size, pip value, R:R', scoped: true },
  { to: '/chart', label: 'Advanced chart', short: 'Chart', icon: 'sliders', group: 'Plan & tools', hint: 'Live TradingView chart' },
  { to: '/news', label: 'Economic news', short: 'News', icon: 'clock', group: 'Plan & tools', hint: 'Economic calendar and headlines' },
  { to: '/notebook', label: 'Notebook', icon: 'notebook', group: 'Plan & tools', hint: 'Free-form notes' },
  { to: '/guide', label: 'Guide', icon: 'info', group: 'Help', hint: 'How the app and the strategy work' },
  { to: '/settings', label: 'Settings', icon: 'settings', group: 'Help', hint: 'Sync, accounts, time zone, backup' },
];
const isOn = (path: string, to: string) => (to === '/' ? path === '/' : path === to || path.startsWith(`${to}/`));
const navFor = (path: string) => NAV.find(n => isOn(path, n.to));
/** ⌘ on Apple devices, Ctrl elsewhere. */
const MOD = typeof navigator !== 'undefined' && /Mac|iP(hone|ad|od)/.test(navigator.platform) ? '⌘' : 'Ctrl ';


/** One reading of the sync state for every badge: label, icon and tone. */
function useSyncView() {
  const sync = useStore(s => s.sync);
  const online = useOnline();
  if (!online) return { kind: 'offline' as const, label: 'Offline — saved on device', short: 'Offline', icon: 'cloudOff' as IconName, tone: 'text-warn', dot: 'bg-warn' };
  if (sync.status === 'syncing') return { kind: 'syncing' as const, label: 'Syncing…', short: 'Syncing…', icon: 'refresh' as IconName, tone: 'text-ink2', dot: 'bg-warn animate-pulse' };
  if (sync.status === 'error') return { kind: 'error' as const, label: 'Sync failed — tap to retry', short: 'Sync failed', icon: 'alert' as IconName, tone: 'text-loss', dot: 'bg-loss' };
  return { kind: 'ok' as const, label: 'Synced', short: 'Synced', icon: 'cloud' as IconName, tone: 'text-ink3', dot: 'bg-profit' };
}
const syncTitle = (sync: { message?: string; at?: number }) => sync.message ?? (sync.at ? `Last sync ${new Date(sync.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — tap to sync` : 'Tap to sync');

/** Compact sync control: an icon (not a bare colour dot), plus words when it failed and needs a tap. */
function SyncPill() {
  const sync = useStore(s => s.sync);
  const user = useStore(s => s.user);
  const syncNow = useStore(s => s.syncNow);
  const v = useSyncView();
  const nav = useNavigate();
  if (!user) return <button className="btn-ghost h-9 w-9 px-0 text-ink3" aria-label="Local only — sign in to sync" title="Local only" onClick={() => nav('/settings')}><Icon name="cloud" size={16} /></button>;
  const loud = v.kind === 'error';
  return (
    <button className={cx('btn-ghost h-9 text-xs', loud ? 'px-3' : 'w-9 px-0', v.tone)} aria-label={v.label} title={syncTitle(sync)} onClick={() => syncNow()}>
      <span className="relative inline-flex">
        <Icon name={v.icon} size={16} className={cx(v.kind === 'syncing' && 'animate-spin motion-reduce:animate-none')} />
        {v.kind === 'ok' && <span className="absolute -right-0.5 -bottom-0.5 w-1.5 h-1.5 rounded-full bg-profit ring-2 ring-bg" />}
      </span>
      {loud && <span aria-hidden="true">{v.short}</span>}
    </button>
  );
}

/** Account badge: avatar with the sync state on its corner; name and status text only where there's room (2xl). Tap to sync. */
function UserPill() {
  const sync = useStore(s => s.sync);
  const user = useStore(s => s.user);
  const syncNow = useStore(s => s.syncNow);
  const v = useSyncView();
  if (!user) return <SyncPill />;
  return (
    <button type="button" onClick={() => syncNow()} title={syncTitle(sync)} aria-label={`${user.email} · ${v.label}`}
      className="flex items-center gap-2.5 h-10 p-1 2xl:pr-3.5 rounded-full border border-line bg-raised/50 hover:bg-raised transition-colors shrink-0">
      <span className="relative w-8 h-8 rounded-full grid place-items-center text-[13px] font-bold text-on-accent bg-accent">
        {(user.email[0] ?? 'R').toUpperCase()}
        <span className={cx('absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-surface', v.dot)} />
      </span>
      <span className="hidden 2xl:block text-left leading-tight" aria-hidden="true">
        <span className="block text-cap font-semibold max-w-[150px] truncate">{user.email.split('@')[0]}</span>
        <span className={cx('block text-micro', v.kind === 'error' ? 'text-loss' : 'text-ink3')}>{v.short}</span>
      </span>
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
    <label className="relative min-w-0 xl:max-w-[200px]">
      <span className="sr-only">Account</span>
      <select className="field h-9 pr-8 appearance-none text-[13px] font-medium bg-raised truncate" value={active} onChange={e => setActive(e.target.value)}>
        <option value="all">All accounts</option>
        {list.map(a => <option key={a.id} value={a.id}>{a.broker} · {a.id}</option>)}
      </select>
      <Icon name="chevronDown" size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink3" />
    </label>
  );
}

type Cmd = { key: string; label: string; hint?: ReactNode; icon: IconName; run: () => void; group: 'Actions' | 'Pages' | 'Trades' };

/** ⌘K: run a shell action, jump to a page or find a trade. A combobox over a listbox, so screen readers follow the highlight. */
function CommandPalette({ open, onClose, actions }: { open: boolean; onClose: () => void; actions: Cmd[] }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const trades = useStore(s => s.trades);
  const accounts = useStore(s => s.accounts);
  const privacy = useStore(s => s.privacy);
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  useDialogFocus(open, box);
  const items = useMemo<Cmd[]>(() => {
    const ql = q.trim().toLowerCase();
    const pages: Cmd[] = NAV.map(n => ({ key: n.to, label: n.label, hint: n.hint, icon: n.icon, run: () => nav(n.to), group: 'Pages' }));
    const ranges: Cmd[] = presets().map(p => ({ key: `range-${p.label}`, label: `Range: ${p.label}`, hint: 'Date filter', icon: 'calendar', run: () => useStore.getState().setRange(p), group: 'Actions' }));
    if (!ql) return [...actions, ...pages];
    const match = (c: Cmd) => c.label.toLowerCase().includes(ql) || (typeof c.hint === 'string' && c.hint.toLowerCase().includes(ql));
    const tr: Cmd[] = trades.filter(t => t.symbol.toLowerCase().includes(ql) || t.id.includes(ql)).slice(-6).reverse().map(t => {
      const n = netOf(t);
      return {
        key: t.id, label: `${t.symbol} ${t.type} · #${t.id}`, icon: 'trades', group: 'Trades', run: () => nav(`/trades/${t.id}`),
        hint: <>{t.closeTime.slice(0, 10)} <span className={cx('num font-semibold ml-1.5', n > 0 ? 'text-profit' : n < 0 ? 'text-loss' : 'text-ink3')}>{money(n, { signed: true, privacy, ccy: accounts[t.account]?.currency })}</span></>,
      };
    });
    return [...[...actions, ...ranges].filter(match), ...pages.filter(match), ...tr];
  }, [q, trades, nav, actions, accounts, privacy]);
  useEffect(() => { setI(0); }, [q]);
  useEffect(() => { if (!open) setQ(''); }, [open]);
  useEffect(() => { list.current?.querySelector(`[data-k="${i}"]`)?.scrollIntoView({ block: 'nearest' }); }, [i]);
  const pick = (c: Cmd) => { onClose(); c.run(); };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[calc(12vh+env(safe-area-inset-top))] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div className="absolute inset-0 bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div ref={box} className="relative w-full max-w-lg card shadow-pop overflow-hidden" initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={spring}>
            <div className="flex items-center gap-2 px-4 border-b border-line">
              <Icon name="search" className="text-ink3" />
              <input autoFocus role="combobox" aria-expanded="true" aria-controls="cmd-list" aria-activedescendant={items[i] ? `cmd-${i}` : undefined} aria-autocomplete="list"
                aria-label="Search actions, pages and trades" placeholder="Run an action, go to a page, find a trade…" value={q} onChange={e => setQ(e.target.value)}
                className="flex-1 h-12 bg-transparent border-0 ring-0 focus:ring-0 text-sm"
                onKeyDown={e => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(items.length - 1, x + 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(0, x - 1)); }
                  if (e.key === 'Enter' && items[i]) pick(items[i]);
                  if (e.key === 'Escape') onClose();
                }} />
              <button type="button" onClick={onClose} className="text-[10px] text-ink3 border border-line2 rounded px-1.5 py-0.5" aria-label="Close">ESC</button>
            </div>
            <ul ref={list} id="cmd-list" role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-1.5">
              {items.map((it, k) => (<li key={it.key} role="presentation">
                {(k === 0 || items[k - 1].group !== it.group) && <div className="label px-3 pt-2.5 pb-1" aria-hidden="true">{it.group}</div>}
                <div id={`cmd-${k}`} data-k={k} role="option" aria-selected={k === i} className={cx('w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-left cursor-pointer', k === i ? 'bg-raised text-ink' : 'text-ink2')} onMouseMove={() => setI(k)} onClick={() => pick(it)}>
                  <Icon name={it.icon} size={15} className="text-ink3 shrink-0" /><span className="truncate">{it.label}</span><span className="ml-auto pl-3 text-micro text-ink3 truncate max-w-[45%] text-right">{it.hint}</span>
                </div>
              </li>))}
              {!items.length && <li className="px-3 py-6 text-center text-sm text-ink3">Nothing found</li>}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Sidebar row (desktop). The active page gets a quiet raised row; violet glow is kept for the one active control. */
function SideLink({ n }: { n: (typeof NAV)[number] }) {
  return (
    <NavLink to={n.to} end={n.to === '/'} className={({ isActive }) => cx('relative flex items-center gap-3 h-10 short:h-9 px-3 rounded-xl text-[13.5px] font-medium transition-colors shrink-0', isActive ? 'text-ink' : 'text-ink3 hover:text-ink2 hover:bg-raised/60')}>
      {({ isActive }) => (<>
        {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-xl side-on" transition={spring} />}
        <Icon name={n.icon} size={16} className={cx('relative', isActive && 'text-accent')} /><span className="relative">{n.label}</span>
      </>)}
    </NavLink>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation();
  const theme = useStore(s => s.theme), setTheme = useStore(s => s.setTheme);
  const privacy = useStore(s => s.privacy), setPrivacy = useStore(s => s.setPrivacy);
  const user = useStore(s => s.user), syncNow = useStore(s => s.syncNow);
  const hasTrades = useStore(s => s.trades.length > 0);
  const [importOpen, setImportOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cmd, setCmd] = useState(false);
  const toast = useToast();
  const mainRef = useRef<HTMLElement>(null);
  const online = useOnline();
  const here = navFor(loc.pathname);
  const title = here?.label ?? (loc.pathname.startsWith('/design') ? 'Design system' : 'Trade');
  // The date range and account filters only show where the page actually reads them.
  const scoped = !!here?.scoped;
  const inMore = !here?.mobile;
  const multiAccount = useStore(s => Object.keys(s.accounts).length > 1);

  const first = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0 }); setMoreOpen(false);
    // Keyboard and screen-reader users start each new page at its content, not on the link they pressed.
    if (first.current) { first.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
  }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(v => !v); return; }
      const t = e.target as HTMLElement;
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !t.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) { e.preventDefault(); setCmd(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    const open = () => setImportOpen(true);
    window.addEventListener('rfx:import', open);
    return () => window.removeEventListener('rfx:import', open);
  }, []);
  // Browser/status-bar colour follows the theme (light theme no longer gets a black bar).
  useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F2F2F2' : '#0B0C10'); }, [theme]);
  // Back online: catch up straight away instead of waiting for the next edit.
  const wasOnline = useRef(online);
  useEffect(() => { if (online && !wasOnline.current && user) void syncNow(); wasOnline.current = online; }, [online, user, syncNow]);

  // Transparent header over the ambient canvas at the top of a page; solid once content scrolls under it.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  const togglePrivacy = () => { setPrivacy(!privacy); toast(privacy ? 'Amounts visible' : 'Amounts hidden', 'info'); };
  const actions = useMemo<Cmd[]>(() => [
    { key: 'a-import', label: 'Import trades', hint: 'MT5 / MT4 report', icon: 'upload', run: () => setImportOpen(true), group: 'Actions' },
    { key: 'a-privacy', label: privacy ? 'Show amounts' : 'Hide amounts', hint: 'Privacy', icon: privacy ? 'eye' : 'eyeOff', run: togglePrivacy, group: 'Actions' },
    { key: 'a-theme', label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme', hint: 'Appearance', icon: theme === 'dark' ? 'sun' : 'moon', run: () => setTheme(theme === 'dark' ? 'light' : 'dark'), group: 'Actions' },
    ...(user ? [{ key: 'a-sync', label: 'Sync now', hint: 'Cloud', icon: 'refresh' as IconName, run: () => void syncNow(), group: 'Actions' as const }] : []),
  ], [privacy, theme, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const groups: Group[] = ['Today', 'Review', 'Plan & tools'];
  const tile = (active: boolean) => cx('flex flex-col items-center justify-center gap-2 py-4 land:py-2 land:gap-1 rounded-xl bg-raised border text-xs font-medium text-center', active ? 'border-accent/40 text-ink' : 'border-line text-ink2');
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen flex land:pl-[calc(68px+env(safe-area-inset-left))]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] btn-primary">Skip to content</a>
      <Ambient />
      {/* Desktop sidebar: logo, a scrolling nav, and a pinned footer so nothing is ever cut off on a short screen. */}
      <aside className="hidden lg:flex w-[232px] shrink-0 flex-col border-r border-line bg-surface/40 py-4 sticky top-0 h-screen">
        <div className="flex items-center gap-2.5 px-5 pb-4 short:pb-3 pt-1 shrink-0">
          <img src="/icon.svg" alt="" className="w-8 h-8 rounded-[9px] ring-1 ring-line" />
          <div className="font-bold text-[16px] tracking-tight">RamanFX</div>
        </div>
        <nav aria-label="Main" className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 flex flex-col">
          {groups.map(g => (
            <div key={g} className="flex flex-col gap-0.5 mb-3 short:mb-2">
              <div className="label px-3 pb-1 pt-1">{g}</div>
              {NAV.filter(n => n.group === g).map(n => <SideLink key={n.to} n={n} />)}
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-line mx-3 pt-2 flex flex-col gap-0.5">
          {NAV.filter(n => n.group === 'Help').map(n => <SideLink key={n.to} n={n} />)}
          <div className="flex flex-col gap-0.5 mt-1">
            <button className="btn-ghost h-8 px-3 justify-start gap-3 text-ink3 text-xs font-medium whitespace-nowrap" onClick={() => setCmd(true)} aria-label={`Search (shortcut / or ${MOD.trim()}+K)`}><Icon name="search" size={14} />Search<kbd className="ml-auto text-[10px] border border-line2 rounded px-1 whitespace-nowrap">{MOD}K</kbd></button>
            <a href="/legacy.html" className="btn-ghost h-8 px-3 justify-start gap-3 text-ink3 text-xs font-medium whitespace-nowrap"><Icon name="link" size={14} />Classic app</a>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className={cx('sticky top-0 z-30 border-b pt-safe px-safe transition-colors duration-300', scrolled ? 'bg-bg border-line' : 'bg-transparent border-transparent')}>
          <div className="max-w-[1360px] mx-auto flex items-center gap-2 px-4 lg:px-7 h-14 land:h-12">
            <h1 className="text-[17px] lg:text-[19px] font-semibold tracking-tight truncate min-w-[60px]">{title}</h1>
            <button type="button" onClick={() => setCmd(true)} aria-label="Search pages, trades and actions"
              className="hidden xl:flex items-center gap-2.5 h-9 2xl:h-10 2xl:w-[230px] ml-3 px-3 2xl:px-4 rounded-full border border-line bg-raised/40 text-[13px] text-ink3 hover:text-ink2 transition-colors shrink-0">
              <Icon name="search" size={15} /><span className="hidden 2xl:inline">Search pages and trades</span><kbd className="ml-auto text-[10px] border border-line2 rounded-full px-1.5">{MOD}K</kbd>
            </button>
            <div className="ml-auto flex items-center gap-1.5 min-w-0">
              <div className="hidden md:flex land:flex items-center gap-1.5 min-w-0 land:[&_select]:max-w-[150px]">
                <span className="hidden xl:inline-flex"><UserPill /></span><span className="xl:hidden"><SyncPill /></span>
                {scoped && <><AccountPicker /><RangePicker className="shrink-0 min-w-[132px]" /></>}
              </div>
              <span className="md:hidden land:hidden"><SyncPill /></span>
              <button className="btn-ghost w-9 px-0" aria-label={privacy ? 'Show amounts' : 'Hide amounts'} aria-pressed={privacy} onClick={togglePrivacy}><Icon name={privacy ? 'eyeOff' : 'eye'} /></button>
              <button className="btn-ghost w-9 px-0" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
              {/* Quiet once there's a journal: importing is occasional, so the accent stays for each page's own main action. */}
              <button className={hasTrades ? 'btn' : 'btn-primary'} aria-label="Import trades" aria-haspopup="dialog" aria-expanded={importOpen} onClick={() => setImportOpen(true)}><Icon name="upload" size={15} /><span className="hidden sm:inline land:hidden">Import</span></button>
            </div>
          </div>
          {scoped && (
            <div className={cx('md:hidden land:hidden grid gap-2 px-4 pb-2.5', multiAccount && 'grid-cols-2')}>
              <RangePicker /><AccountPicker />
            </div>
          )}
        </header>

        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 w-full max-w-[1360px] mx-auto px-4 lg:px-7 pt-5 land:pt-4 pb-28 land:pb-10 lg:pb-12 outline-none">
          {/* Plain keyed fade-in. An exit-then-enter handoff (AnimatePresence "wait") could stall
              while a lazy page was still loading, leaving the new page invisible. */}
          <motion.div key={loc.pathname} className="page-in">
              {!hasTrades && !['/playbook', '/calculator', '/settings', '/risk', '/notebook', '/strategies', '/plan', '/guru', '/guide', '/news', '/chart', '/design'].some(p => loc.pathname.startsWith(p)) ? <Welcome onImport={() => setImportOpen(true)} /> : children}
          </motion.div>
        </main>
      </div>

      {/* Phone landscape: slim icon rail on the left keeps the full height for content */}
      <nav aria-label="Main" className="hidden land:flex fixed left-0 inset-y-0 z-40 w-[calc(68px+env(safe-area-inset-left))] pl-[env(safe-area-inset-left)] flex-col items-center justify-center gap-1 bg-surface border-r border-line">
        {NAV.filter(n => n.mobile).map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('relative w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-micro transition-colors', isActive ? 'text-ink font-semibold bg-accent/15 [&_svg]:text-accent' : 'text-ink3 font-medium')}>
            <Icon name={n.icon} size={19} />{n.short ?? n.label}
          </NavLink>
        ))}
        <button className={cx('w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-micro', inMore ? 'text-ink font-semibold bg-accent/15 [&_svg]:text-accent' : 'text-ink3 font-medium')} aria-haspopup="dialog" aria-expanded={moreOpen} aria-current={inMore ? 'page' : undefined} onClick={() => setMoreOpen(true)}><Icon name="more" size={19} />More</button>
      </nav>

      {/* Mobile tab bar: the active tab gets an icon chip and bold label, not just a colour change. */}
      <nav aria-label="Main" className="lg:hidden land:hidden fixed bottom-0 inset-x-0 z-40 bg-surface border-t border-line pb-safe px-safe">
        <div className="flex justify-around max-w-[680px] mx-auto px-2 pt-1.5">
          {NAV.filter(n => n.mobile).map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/'} className={({ isActive }) => cx('flex flex-col items-center gap-0.5 min-w-[58px] min-h-[46px] justify-center text-micro', isActive ? 'text-ink font-semibold' : 'text-ink3 font-medium')}>
              {({ isActive }) => (<><span className={cx('grid place-items-center h-7 w-12 rounded-full transition-colors', isActive && 'bg-accent/15 text-accent')}><Icon name={n.icon} size={20} /></span>{n.short ?? n.label}</>)}
            </NavLink>
          ))}
          <button className={cx('flex flex-col items-center gap-0.5 min-w-[58px] min-h-[46px] justify-center text-micro', inMore ? 'text-ink font-semibold' : 'text-ink3 font-medium')} aria-haspopup="dialog" aria-expanded={moreOpen} aria-current={inMore ? 'page' : undefined} onClick={() => setMoreOpen(true)}>
            <span className={cx('grid place-items-center h-7 w-12 rounded-full transition-colors', inMore && 'bg-accent/15 text-accent')}><Icon name="more" size={20} /></span>More
          </button>
        </div>
      </nav>

      <Sheet bottom open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <button type="button" className="field h-11 flex items-center gap-2 text-left text-ink3 mb-4" onClick={() => { setMoreOpen(false); setCmd(true); }}><Icon name="search" size={16} />Search pages, trades, actions</button>
        {(['Review', 'Plan & tools'] as Group[]).map(g => (
          <section key={g} className="mb-4" aria-label={g}>
            <div className="label mb-2">{g}</div>
            <div className="grid grid-cols-3 sm:grid-cols-4 land:!grid-cols-7 gap-2">
              {NAV.filter(n => n.group === g && !n.mobile).map(n => (
                <NavLink key={n.to} to={n.to} className={({ isActive }) => tile(isActive)}>
                  <Icon name={n.icon} size={20} />{n.label}
                </NavLink>
              ))}
            </div>
          </section>
        ))}
        <div className="flex flex-wrap items-center justify-center gap-1 border-t border-line pt-3">
          {NAV.filter(n => n.group === 'Help').map(n => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => cx('btn-ghost h-11', isActive ? 'text-ink' : 'text-ink2')}><Icon name={n.icon} size={15} />{n.label}</NavLink>
          ))}
          <a href="/legacy.html" className="btn-ghost h-11 text-ink2"><Icon name="link" size={15} />Classic app</a>
        </div>
      </Sheet>
      <Sheet open={importOpen} onClose={() => setImportOpen(false)} title="Import trades"><ImportPanel onDone={() => setImportOpen(false)} /></Sheet>
      <CommandPalette open={cmd} onClose={() => setCmd(false)} actions={actions} />
    </div>
    </MotionConfig>
  );
}

function Welcome({ onImport }: { onImport: () => void }) {
  const sync = useStore(s => s.sync), syncNow = useStore(s => s.syncNow), user = useStore(s => s.user);
  const busy = sync.status === 'syncing';
  return (
    <div className="min-h-[70vh] grid place-items-center">
      <motion.div className="max-w-md text-center flex flex-col items-center gap-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 grid place-items-center text-accent"><Icon name="upload" size={24} /></div>
        <h2 className="text-2xl font-bold tracking-tight">Bring in your trades</h2>
        <p className="text-ink2 leading-relaxed">Export your account history from MT5 or MT4 as an HTML report and drop it here. Already journaled on another device? Sync to pull it in.</p>
        <div className="flex gap-2 flex-wrap justify-center">
          <button className="btn-primary h-10 px-5" onClick={onImport}>Import MT5 / MT4 report</button>
          {user && <button className="btn h-10 px-5" onClick={() => syncNow()} disabled={busy}><Icon name="refresh" size={14} className={cx(busy && 'animate-spin motion-reduce:animate-none')} />{busy ? 'Syncing…' : 'Sync now'}</button>}
        </div>
        {sync.status === 'error' && <p className="text-sm text-loss">{sync.message ?? 'Sync failed'}</p>}
        <div className="text-xs text-ink3">Your Playbook, Calculator and Risk rules work without trades.</div>
        <Segmented label="Theme" value={useStore.getState().theme} onChange={v => useStore.getState().setTheme(v)} size="sm" options={[{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }]} />
      </motion.div>
    </div>
  );
}
