import { AnimatePresence, motion, MotionConfig, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '@/data/store';
import { DATA_MODE, useTrades } from '@/data/derived';
import { DATA_MODES } from '@/data/worstCase';
import { netOf } from '@/core/stats';
import { money } from '@/lib/format';
import { Ambient } from './Ambient';
import { Icon, type IconName } from './Icon';
import { cx, enteringSoftly, Segmented, Sheet, useScrollLock, softClick, softNavigate, spring, useDialogFocus, useOnline, useToast } from './kit';
import { ImportPanel } from './ImportPanel';
import { GlassTabBar } from './GlassTabBar';
import { installLiveCards } from './liveCards';
import { installRubberBand } from './rubberBand';
import { presets, RangePicker } from './RangePicker';
import { prefetchProps, prefetchRoute } from '@/routes';

type Group = 'Today' | 'Review' | 'Plan & tools' | 'Help';
/**
 * Every page, grouped the way a trading day runs: today's work, reviewing what happened, planning tools, help.
 * `mobile` = in the phone tab bar; `scoped` = the page reads the date range / account filters; `hint` = one line on what it's for.
 */
export const NAV: { to: string; label: string; short?: string; icon: IconName; mobile?: boolean; group: Group; hint: string; scoped?: boolean }[] = [
  { to: '/', label: 'Dashboard', short: 'Home', icon: 'dashboard', mobile: true, group: 'Today', hint: 'Today at a glance', scoped: true },
  { to: '/plan', label: 'Planner', short: 'Plan', icon: 'target', mobile: true, group: 'Today', hint: "Today's zones and entries", scoped: true },
  { to: '/journal', label: 'Daily journal', short: 'Journal', icon: 'journal', mobile: true, group: 'Today', hint: 'Notes and P&L by day', scoped: true },
  { to: '/trades', label: 'Trades', icon: 'trades', mobile: true, group: 'Review', hint: 'Every position, filter and review', scoped: true },
  { to: '/reports', label: 'Reports', icon: 'reports', group: 'Review', hint: 'Performance by symbol, session, setup', scoped: true },
  { to: '/calendar', label: 'P&L calendar', short: 'P&L cal', icon: 'calendar', group: 'Review', hint: 'Daily results on a calendar', scoped: true },
  { to: '/heatmaps', label: 'Heat maps', icon: 'flame', group: 'Review', hint: 'When and where you make money', scoped: true },
  { to: '/exits', label: 'MAE / MFE lab', short: 'MAE/MFE', icon: 'exit', group: 'Review', hint: 'How far trades went against and for you', scoped: true },
  { to: '/zones', label: 'Zone scorecard', short: 'Zones', icon: 'star', group: 'Review', hint: 'Which ZoneVision setups paid in MT5 research runs (Raja types, curve, room)' },
  { to: '/guru', label: 'Guru', icon: 'sparkles', group: 'Review', hint: 'Growth projection and coaching', scoped: true },
  { to: '/playbook', label: 'Playbook', icon: 'playbook', group: 'Plan & tools', hint: 'Setups and their rules', scoped: true },
  { to: '/strategies', label: 'Strategies', icon: 'strategy', group: 'Plan & tools', hint: 'Strategy performance', scoped: true },
  { to: '/risk', label: 'Risk rules', icon: 'shield', group: 'Plan & tools', hint: 'Daily loss and trade limits', scoped: true },
  { to: '/calculator', label: 'Calculator', icon: 'calculator', group: 'Plan & tools', hint: 'Lot size, pip value, R:R', scoped: true },
  { to: '/scanner', label: 'Stock scanner', short: 'Scanner', icon: 'search', group: 'Plan & tools', hint: 'Daily S&P 500 buy setups at fresh demand and exit warnings, by the Raja rules' },
  { to: '/insiders', label: 'Insider buys', short: 'Insiders', icon: 'eye', group: 'Plan & tools', hint: 'Insider cluster buys from SEC Form 4, with the scanner\'s zone context' },
  { to: '/moves', label: 'Big moves', short: 'Moves', icon: 'bolt', group: 'Plan & tools', hint: 'Every big 1W / 1D / 4H / 1H candle that just closed: forex, indices, crypto, stocks' },
  { to: '/train', label: 'Train my eye', short: 'Train', icon: 'eye', group: 'Plan & tools', hint: 'Mark pivots, trend lines and zones the way you read them; score the engine against your eye' },
  { to: '/market-hours', label: 'Market hours', short: 'Hours', icon: 'clock', group: 'Plan & tools', hint: 'Best times and weekdays for every pair and stock, Calgary time' },
  { to: '/chart', label: 'Advanced chart', short: 'Chart', icon: 'sliders', group: 'Plan & tools', hint: 'Live TradingView chart' },
  { to: '/news', label: 'Economic news', short: 'News', icon: 'clock', group: 'Plan & tools', hint: 'Economic calendar and headlines' },
  { to: '/notebook', label: 'Notebook', icon: 'notebook', group: 'Plan & tools', hint: 'Free-form notes' },
  { to: '/guide', label: 'Guide & how-to', short: 'Guide', icon: 'info', group: 'Help', hint: 'How every feature, the Telegram bot, alerts and keys work; what to do when something breaks' },
  { to: '/learn', label: 'Lessons', icon: 'playbook', group: 'Help', hint: 'Every mentor lesson as notes, plus the glossary' },
  { to: '/checklist', label: 'Checklist', icon: 'check', group: 'Help', hint: 'Cradle-to-grave trade checklist per mentor: tick, memorize, save as PDF' },
  { to: '/ask', label: 'Ask your mentors', short: 'Ask', icon: 'sparkles', group: 'Help', hint: 'Search every lesson by meaning, on your device' },
  { to: '/practice', label: 'Sandbox', icon: 'grid', group: 'Help', hint: 'Blind chart tests, drawing tools and pattern drills' },
  { to: '/tools', label: 'Tools', icon: 'wrench', group: 'Help', hint: 'Every MT5, MT4 and TradingView download, with presets' },
  { to: '/bot-guide', label: 'Bot guide', icon: 'target', group: 'Help', hint: 'How to use the MT4 ZoneBot and ZoneVision' },
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
  if (!user) return <button className="btn-ghost h-9 w-9 touch:h-11 touch:w-11 px-0 text-ink3" aria-label="Local only — sign in to sync" title="Local only" onClick={() => nav('/settings')}><Icon name="cloud" size={16} /></button>;
  const loud = v.kind === 'error';
  return (
    <button className={cx('btn-ghost h-9 touch:h-11 text-xs', loud ? 'px-3' : 'w-9 touch:w-11 px-0', v.tone)} aria-label={v.label} title={syncTitle(sync)} onClick={() => syncNow()}>
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
/** `instant`: opened from the keyboard (⌘K or /), an action hit many times a day, so it appears and leaves with no animation. */
function CommandPalette({ open, onClose, actions, instant }: { open: boolean; onClose: () => void; actions: Cmd[]; instant: boolean }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const trades = useStore(s => s.trades);
  const accounts = useStore(s => s.accounts);
  const privacy = useStore(s => s.privacy);
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  useDialogFocus(open, box);
  useScrollLock(open);
  const items = useMemo<Cmd[]>(() => {
    const ql = q.trim().toLowerCase();
    const pages: Cmd[] = NAV.map(n => ({ key: n.to, label: n.label, hint: n.hint, icon: n.icon, run: () => softNavigate(() => nav(n.to)), group: 'Pages' }));
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
  // The highlighted page starts downloading before Enter, so the jump lands on content, not a skeleton.
  useEffect(() => { const it = items[i]; if (open && it?.group === 'Pages') prefetchRoute(it.key); }, [open, i, items]);
  const pick = (c: Cmd) => { onClose(); c.run(); };
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-[calc(12vh+env(safe-area-inset-top))] px-4" role="dialog" aria-modal="true" aria-label="Command palette">
          <motion.div className="absolute inset-0 bg-black/50" initial={instant ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: instant ? { duration: 0 } : { duration: 0.15 } }} onClick={onClose} />
          {/* Morph: on wide screens the header search pill grows into this panel (shared layoutId); content blurs in once the shape has settled. */}
          <motion.div ref={box} layoutId={instant ? undefined : 'cmd-morph'} style={{ borderRadius: 16 }} className="relative w-full max-w-lg glass-pop overflow-hidden"
            initial={instant ? false : { opacity: 0, transform: 'translateY(-8px) scale(0.97)' }} animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }} exit={{ opacity: 0, transition: instant ? { duration: 0 } : { duration: 0.15 } }} transition={spring}>
            {/* Content sharpens in quickly once the shape is nearly there: the user is about to type. */}
            <motion.div initial={instant ? false : { opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)', transition: { delay: 0.06, duration: 0.15 } }} exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.1 } }}>
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
            <ul ref={list} id="cmd-list" role="listbox" aria-label="Results" className="max-h-[50vh] max-h-[50dvh] overflow-y-auto overscroll-contain touch-pan-y p-1.5">
              {items.map((it, k) => (<li key={it.key} role="presentation">
                {(k === 0 || items[k - 1].group !== it.group) && <div className="label px-3 pt-2.5 pb-1" aria-hidden="true">{it.group}</div>}
                <div id={`cmd-${k}`} data-k={k} role="option" aria-selected={k === i} className={cx('w-full flex items-center gap-3 px-3 h-10 rounded-lg text-sm text-left cursor-pointer', k === i ? 'bg-raised text-ink' : 'text-ink2')} onMouseMove={() => setI(k)} onClick={() => pick(it)}>
                  <Icon name={it.icon} size={15} className="text-ink3 shrink-0" /><span className="truncate">{it.label}</span><span className="ml-auto pl-3 text-micro text-ink3 truncate max-w-[45%] text-right">{it.hint}</span>
                </div>
              </li>))}
              {!items.length && <li className="px-3 py-6 text-center text-sm text-ink3">Nothing found</li>}
            </ul>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Sidebar row (desktop). The active page gets a quiet raised row; violet glow is kept for the one active control. */
function SideLink({ n }: { n: (typeof NAV)[number] }) {
  const nav = useNavigate();
  return (
    <NavLink to={n.to} end={n.to === '/'} {...prefetchProps(n.to)} onClick={softClick(() => nav(n.to))} className={({ isActive }) => cx('relative flex items-center gap-3 h-10 short:h-8 px-3 rounded-xl text-[13.5px] font-medium transition-colors shrink-0', isActive ? 'text-ink' : 'text-ink3 hover:text-ink2 hover:bg-raised/60')}>
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
  const hasTrades = useTrades().length > 0;
  const [importOpen, setImportOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cmd, setCmd] = useState(false);
  const [cmdKbd, setCmdKbd] = useState(false);
  const openCmd = () => { setCmdKbd(false); setCmd(true); };
  const toast = useToast();
  const mainRef = useRef<HTMLElement>(null);
  const online = useOnline();
  const here = navFor(loc.pathname);
  const title = here?.label ?? (loc.pathname.startsWith('/design') ? 'Design system' : 'Trade');
  // The date range and account filters only show where the page actually reads them.
  const scoped = !!here?.scoped;
  const inMore = !here?.mobile;
  const mobileTabs = useMemo(() => NAV.filter(n => n.mobile).map(n => ({ to: n.to, label: n.short ?? n.label, icon: n.icon })), []);
  const multiAccount = useStore(s => Object.keys(s.accounts).length > 1);
  // Drill-down page (e.g. /trades/123): iOS push in, no large title, and an edge swipe takes you back.
  const deep = loc.pathname.split('/').filter(Boolean).length > 1 && !loc.pathname.startsWith('/learn');
  const navTo = useNavigate();
  useEffect(() => {
    if (!deep) return;
    // Installed app (home screen) has no browser back gesture, so recreate iOS's swipe-from-left-edge.
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (!standalone) return;
    let x0 = 0, y0 = 0, t0 = 0, active = false, el: HTMLElement | null = null;
    const down = (e: PointerEvent) => { if (e.pointerType !== 'touch' || e.clientX > 24) return; x0 = e.clientX; y0 = e.clientY; t0 = performance.now(); active = true; el = mainRef.current; if (el) el.style.transition = 'none'; };
    const move = (e: PointerEvent) => {
      if (!active || !el) return;
      const dx = e.clientX - x0;
      if (Math.abs(e.clientY - y0) > 30 && dx < 20) { active = false; el.style.transform = ''; return; }
      if (dx > 0) el.style.transform = `translateX(${dx}px)`;
    };
    const up = (e: PointerEvent) => {
      if (!active || !el) return;
      active = false;
      const dx = e.clientX - x0, v = dx / Math.max(1, performance.now() - t0) * 1000;
      el.style.transition = 'transform 0.35s var(--ease-drawer)';
      if (dx + v * 0.2 > window.innerWidth * 0.4) { navigator.vibrate?.(8); el.style.transform = `translateX(${window.innerWidth}px)`; window.setTimeout(() => { if (el) { el.style.transition = 'none'; el.style.transform = ''; } navTo(-1); }, 220); }
      else el.style.transform = '';
    };
    window.addEventListener('pointerdown', down, { passive: true }); window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); };
  }, [deep, navTo]);

  useGlassLight();
  // Decided once per page: entered through the soft transition → no extra CSS fade (it would blink when it starts late).
  const pageEnter = useMemo(() => (enteringSoftly() ? '' : deep ? 'page-in page-push' : 'page-in'), [loc.pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  // Top and bottom of the page stretch and settle like iOS instead of stopping dead.
  useEffect(() => (mainRef.current ? installRubberBand(mainRef.current) : undefined), []);
  const first = useRef(true);
  useEffect(() => {
    window.scrollTo({ top: 0 }); setMoreOpen(false);
    // Keyboard and screen-reader users start each new page at its content, not on the link they pressed.
    if (first.current) { first.current = false; return; }
    mainRef.current?.focus({ preventScroll: true });
  }, [loc.pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdKbd(true); setCmd(v => !v); return; }
      const t = e.target as HTMLElement;
      // A page that owns "/" (Trades focuses its own search) claims it first in the capture phase.
      if (e.key === '/' && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !t.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) { e.preventDefault(); setCmdKbd(true); setCmd(true); }
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
  // iOS large title → inline title, tied to the scroll position (not a timed animation), so it tracks the finger both ways:
  // the large title blurs, shrinks and fades as it slides under the top edge; the bar title sharpens in out of a blur.
  const phone = usePhoneBar();
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const bigOpacity = useTransform(scrollY, [0, 44], [1, 0]);
  const bigFilter = useTransform(scrollY, [0, 44], ['blur(0px)', 'blur(8px)']);
  const bigScale = useTransform(scrollY, [0, 44], [1, 0.94]);
  const barOpacity = useTransform(scrollY, [26, 56], [0, 1]);
  const barFilter = useTransform(scrollY, [26, 56], ['blur(6px)', 'blur(0px)']);
  const barY = useTransform(scrollY, [26, 56], [5, 0]);
  const edgeOpacity = useTransform(scrollY, [0, 24], [0, 1]);
  const liveTitle = phone && !deep;
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
  // Keep the current page's link in view when the nav scrolls (deep pages like Lessons sit below the fold on short screens).
  const sideNav = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = sideNav.current?.querySelector<HTMLElement>('a[aria-current="page"]');
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [loc.pathname]);
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen min-h-dvh flex land:pl-[calc(80px+env(safe-area-inset-left))]">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] btn-primary">Skip to content</a>
      <Ambient />
      {/* Desktop sidebar: logo, a scrolling nav, and a pinned footer so nothing is ever cut off on a short screen. */}
      {/* Floating glass sidebar: inset from the window edges so the canvas glows around it. */}
      <aside className="vt-side hidden lg:flex w-[232px] shrink-0 flex-col glass rounded-[26px] m-3 mr-0 py-4 sticky top-3 h-[calc(100vh-24px)]">
        <div className="flex items-center gap-2.5 px-5 pb-4 short:pb-3 pt-1 shrink-0">
          <img src="/icon.svg" alt="" className="w-8 h-8 rounded-[9px] ring-1 ring-line" />
          <div className="font-bold text-[16px] tracking-tight">RamanFX</div>
        </div>
        {/* Help scrolls with the rest (pinning its 8 links left the main nav ~400px on a 900px screen, hiding Scanner and the tools);
            only Settings and Search stay pinned. The bottom fade says there's more below. */}
        <nav ref={sideNav} aria-label="Main" className="side-nav flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 pb-6 flex flex-col">
          {[...groups, 'Help' as Group].map(g => (
            <div key={g} className="flex flex-col gap-0.5 short:gap-0 mb-3 short:mb-1.5">
              <div className="label px-3 pb-1 pt-1">{g}</div>
              {NAV.filter(n => n.group === g && n.to !== '/settings').map(n => <SideLink key={n.to} n={n} />)}
            </div>
          ))}
        </nav>
        <div className="shrink-0 border-t border-line mx-3 pt-2 flex flex-col gap-0.5">
          {NAV.filter(n => n.to === '/settings').map(n => <SideLink key={n.to} n={n} />)}
          <div className="flex flex-col gap-0.5 mt-1">
            <button className="btn-ghost h-8 px-3 justify-start gap-3 text-ink3 text-xs font-medium whitespace-nowrap" onClick={openCmd} aria-label={`Search (shortcut / or ${MOD.trim()}+K)`}><Icon name="search" size={14} />Search<kbd className="ml-auto text-[10px] border border-line2 rounded px-1 whitespace-nowrap">{MOD}K</kbd></button>
            <a href="/legacy.html" className="btn-ghost h-8 px-3 justify-start gap-3 text-ink3 text-xs font-medium whitespace-nowrap"><Icon name="link" size={14} />Classic app</a>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        {/* Phone scroll-edge effect (iOS 26): no solid bar; content dissolves into a progressive blur under the top edge. */}
        {phone && <motion.div aria-hidden="true" className="scroll-edge lg:hidden land:hidden" style={{ opacity: edgeOpacity, height: `calc(env(safe-area-inset-top) + ${scoped ? 124 : 76}px)` }} />}
        {/* Top bar floats: transparent at rest, then condenses into a glass capsule once content scrolls beneath it. */}
        <header className="vt-bar-top sticky top-0 z-30 pt-safe px-safe">
          <div className={cx('mx-2 lg:mx-4 mt-1.5 rounded-[26px] border border-transparent transition-[background-color,box-shadow,border-color] duration-200', scrolled && !phone ? 'glass' : 'bg-transparent shadow-none')}>
          <div className="max-w-[1360px] mx-auto flex items-center gap-2 px-3 lg:px-5 h-14 land:h-12">
            <motion.h1 className="bar-title text-[17px] lg:text-[19px] font-semibold truncate min-w-[60px]"
              style={liveTitle ? (reduceMotion ? { opacity: barOpacity } : { opacity: barOpacity, filter: barFilter, y: barY }) : undefined}>{title}</motion.h1>
            <div className="ml-auto flex items-center gap-1.5 min-w-0">
              <div className="hidden md:flex land:flex items-center gap-1.5 min-w-0 land:[&_select]:max-w-[150px]">
                <span className="hidden xl:inline-flex"><UserPill /></span><span className="xl:hidden"><SyncPill /></span>
                {scoped && <><AccountPicker /><RangePicker className="shrink-0 min-w-[132px]" /></>}
              </div>
              <span className="md:hidden land:hidden"><SyncPill /></span>
              <button className="btn-ghost w-9 touch:w-11 touch:h-11 px-0" aria-label={privacy ? 'Show amounts' : 'Hide amounts'} aria-pressed={privacy} onClick={togglePrivacy}><Icon name={privacy ? 'eyeOff' : 'eye'} /></button>
              <button className="btn-ghost w-9 touch:w-11 touch:h-11 px-0" aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}><Icon name={theme === 'dark' ? 'sun' : 'moon'} /></button>
              {/* Quiet once there's a journal: importing is occasional, so the accent stays for each page's own main action. */}
              {/* Morph: the button grows into the import panel and shrinks back into it on close. */}
              {importOpen
                ? <span className={cx(hasTrades ? 'btn' : 'btn-primary', 'invisible')} aria-hidden="true"><Icon name="upload" size={15} /><span className="hidden sm:inline land:hidden">Import</span></span>
                : <motion.button layoutId="import-morph" style={{ borderRadius: 18 }} transition={spring} className={hasTrades ? 'btn' : 'btn-primary'} aria-label="Import trades" aria-haspopup="dialog" aria-expanded={importOpen} onClick={() => setImportOpen(true)}><Icon name="upload" size={15} /><span className="hidden sm:inline land:hidden">Import</span></motion.button>}
            </div>
          </div>
          {scoped && (
            <div className={cx('md:hidden land:hidden grid gap-2 px-3 pb-2.5', multiAccount && 'grid-cols-2')}>
              <RangePicker /><AccountPicker />
            </div>
          )}
          </div>
        </header>

        <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 w-full overflow-x-clip max-w-[1360px] mx-auto px-4 lg:px-7 pt-5 land:pt-4 pb-28 land:pb-10 lg:pb-12 outline-none">
          {/* Plain keyed fade-in. An exit-then-enter handoff (AnimatePresence "wait") could stall
              while a lazy page was still loading, leaving the new page invisible. */}
          <motion.div key={loc.pathname} data-page className={pageEnter}>
              {!deep && <motion.div className="lg:hidden land:hidden large-title mb-3 -mt-1 origin-left" aria-hidden="true" style={reduceMotion ? { opacity: bigOpacity } : { opacity: bigOpacity, filter: bigFilter, scale: bigScale }}>{title}</motion.div>}
              {!hasTrades && !['/playbook', '/calculator', '/settings', '/risk', '/notebook', '/strategies', '/plan', '/guru', '/guide', '/news', '/chart', '/design', '/learn', '/ask', '/practice', '/bot-guide', '/checklist', '/tools', '/zones', '/scanner', '/fx', '/market-hours', '/moves', '/insiders', '/train'].some(p => loc.pathname.startsWith(p)) ? <Welcome onImport={() => setImportOpen(true)} /> : children}
          </motion.div>
        </main>
      </div>

      {/* Phone landscape: slim icon rail on the left keeps the full height for content */}
      <nav aria-label="Main" className="vt-side hidden land:flex fixed left-[max(8px,env(safe-area-inset-left))] inset-y-2 z-40 w-[64px] flex-col items-center justify-center gap-1 glass rounded-[26px]">
        {NAV.filter(n => n.mobile).map(n => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'} {...prefetchProps(n.to)} onClick={softClick(() => navTo(n.to))} className={({ isActive }) => cx('press relative w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-micro', isActive ? 'text-ink font-semibold [&_svg]:text-accent' : 'text-ink3 font-medium')}>
            {({ isActive }) => (<>{isActive && <motion.span layoutId="rail-chip" transition={spring} className="absolute inset-0 rounded-xl bg-accent/15" />}<Icon name={n.icon} size={19} className="relative" /><span className="relative">{n.short ?? n.label}</span></>)}
          </NavLink>
        ))}
        <button className={cx('w-14 h-12 rounded-xl flex flex-col items-center justify-center gap-0.5 text-micro', inMore ? 'text-ink font-semibold bg-accent/15 [&_svg]:text-accent' : 'text-ink3 font-medium')} aria-haspopup="dialog" aria-expanded={moreOpen} aria-current={inMore ? 'page' : undefined} onClick={() => setMoreOpen(true)}><Icon name="more" size={19} />More</button>
      </nav>

      {/* Phone: floating Liquid Glass tab bar with a sliding, stretchy selection lens and a search orb. */}
      <GlassTabBar tabs={mobileTabs} active={mobileTabs.findIndex(n => isOn(loc.pathname, n.to))} moreActive={inMore} onMore={() => setMoreOpen(true)} onSearch={openCmd} />

      <Sheet bottom open={moreOpen} onClose={() => setMoreOpen(false)} title="More">
        <MoreMenu onSearch={() => { setMoreOpen(false); openCmd(); }} go={to => navTo(to)} />
      </Sheet>
      <Sheet open={importOpen} onClose={() => setImportOpen(false)} title="Import trades" morphId="import-morph"><ImportPanel onDone={() => setImportOpen(false)} /></Sheet>
      <CommandPalette open={cmd} onClose={() => setCmd(false)} actions={actions} instant={cmdKbd} />
      {import.meta.env.DEV && <DevDataToggle />}
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

/** Dev only (break-ui): flip the whole app between the real journal and stress fixtures. Plain chrome, instant, not part of the design. */
function DevDataToggle() {
  const label = { real: 'Demo data', worst: 'Worst case', one: 'One', empty: 'Empty', huge: '1,500 rows' } as const;
  const go = (m: string) => { const u = new URL(location.href); if (m === 'real') u.searchParams.delete('data'); else u.searchParams.set('data', m); location.assign(u.toString()); };
  return (
    <div role="radiogroup" aria-label="Dev data set" className="fixed z-[90] left-1/2 -translate-x-1/2 bottom-[calc(84px+max(12px,env(safe-area-inset-bottom)))] lg:bottom-3 land:bottom-3 flex gap-0.5 p-0.5 rounded-full bg-neutral-200 text-[11px] font-[system-ui] text-neutral-700 shadow">
      {DATA_MODES.map(m => <button key={m} type="button" role="radio" aria-checked={DATA_MODE === m} onClick={() => go(m)} className={cx('h-6 px-2.5 rounded-full whitespace-nowrap', DATA_MODE === m && 'bg-white text-black shadow-sm')}>{label[m]}</button>)}
    </div>
  );
}

/** Phone portrait layout (large title + scroll-edge effect): below lg and not the short landscape layout. */
const phoneMq = '(max-width: 1023px) and (not ((orientation: landscape) and (max-height: 520px)))';
function usePhoneBar() {
  const [on, setOn] = useState(() => typeof window !== 'undefined' && window.matchMedia(phoneMq).matches);
  useEffect(() => { const m = window.matchMedia(phoneMq); const f = () => setOn(m.matches); m.addEventListener('change', f); return () => m.removeEventListener('change', f); }, []);
  return on;
}

/** Liquid Glass reflections: slide the light streak (--lx) across every glass surface — with the pointer on desktop, and
 *  gently with scrolling everywhere. Written per glass element (non-inheriting property), once per frame at most. */
function useGlassLight() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let px: number | null = null, raf = 0, calm = 0;
    const glass = () => document.querySelectorAll<HTMLElement>('.glass, .glass-pop');
    const paint = () => {
      raf = 0;
      const fromScroll = 30 + 22 * Math.sin(window.scrollY / 260);
      const lx = px == null ? fromScroll : 0.65 * (12 + 76 * (px / window.innerWidth)) + 0.35 * fromScroll;
      // Movement makes the edges flash their VIBGYOR band (--glint up, the band turning with the light); stillness calms it.
      glass().forEach(el => { el.style.setProperty('--lx', `${lx.toFixed(1)}%`); el.style.setProperty('--la', `${(lx * 3.6 + 120).toFixed(0)}deg`); el.style.setProperty('--glint', '1'); });
      clearTimeout(calm);
      calm = window.setTimeout(() => glass().forEach(el => el.style.setProperty('--glint', '0.18')), 220);
    };
    const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
    const move = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; px = e.clientX; queue(); };
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    paint();
    const stop = installLiveCards();
    return () => { stop(); clearTimeout(calm); cancelAnimationFrame(raf); window.removeEventListener('scroll', queue); window.removeEventListener('pointermove', move); };
  }, []);
}

function AppIcon({ to, icon, size = 44 }: { to: string; icon: IconName; size?: number }) {
  // One colour family for every page: the theme accent, lit like an app icon.
  return (
    <span className="app-icon" data-to={to} style={{ width: size, height: size }}>
      <Icon name={icon} size={Math.round(size * 0.48)} strokeWidth={2} />
    </span>
  );
}

/** The phone "More" sheet: glass search pill, app-icon tiles that cascade in, and an iOS grouped list for help. */
function MoreMenu({ onSearch, go }: { onSearch: () => void; go: (to: string) => void }) {
  const loc = useLocation();
  const intro = { hidden: { opacity: 0, transform: 'translateY(10px) scale(0.96)' }, show: { opacity: 1, transform: 'translateY(0px) scale(1)', transition: { duration: 0.32, ease: [0.23, 1, 0.32, 1] } } };
  let k = 0;
  return (
    <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03, delayChildren: 0.06 } } }}>
      <motion.button variants={intro} type="button" onClick={onSearch} className="glass press w-full h-12 rounded-full flex items-center gap-2.5 px-4 text-left text-ink2 mb-5">
        <Icon name="search" size={17} className="text-ink3" />Search pages, trades, actions
      </motion.button>
      {(['Review', 'Plan & tools'] as Group[]).map(g => (
        <section key={g} className="mb-5" aria-label={g}>
          <div className="text-[13px] font-semibold text-ink2 mb-2.5 px-1 tracking-tight">{g}</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 land:!grid-cols-7 gap-2.5">
            {NAV.filter(n => n.group === g && !n.mobile).map(n => {
              const on = isOn(loc.pathname, n.to);
              k++;
              return (
                <motion.div key={n.to} variants={intro} custom={k}>
                  <NavLink to={n.to} {...prefetchProps(n.to)} onClick={softClick(() => go(n.to))} aria-current={on ? 'page' : undefined}
                    className={cx('more-tile press flex flex-col items-center justify-center gap-2.5 py-4 land:py-2 land:gap-1.5 rounded-[20px] text-[12.5px] font-medium text-center leading-tight', on ? 'is-on text-ink' : 'text-ink2')}>
                    <AppIcon to={n.to} icon={n.icon} />{n.label}
                  </NavLink>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
      <motion.div variants={intro} className="more-list rounded-[20px] overflow-hidden">
        {NAV.filter(n => n.group === 'Help').map(n => (
          <NavLink key={n.to} to={n.to} {...prefetchProps(n.to)} onClick={softClick(() => go(n.to))} className="press flex items-center gap-3 h-[52px] px-3.5 text-[15px] text-ink active:bg-white/5">
            <AppIcon to={n.to} icon={n.icon} size={30} /><span className="flex-1">{n.label}</span><Icon name="chevronRight" size={16} className="text-ink3" />
          </NavLink>
        ))}
        <a href="/legacy.html" className="press flex items-center gap-3 h-[52px] px-3.5 text-[15px] text-ink active:bg-white/5">
          <AppIcon to="/legacy" icon="link" size={30} /><span className="flex-1">Classic app</span><Icon name="chevronRight" size={16} className="text-ink3" />
        </a>
      </motion.div>
    </motion.div>
  );
}
