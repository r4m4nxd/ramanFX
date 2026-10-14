import { create } from 'zustand';
import type { Account, Attachment, Deposit, ExitData, InstrumentOverride, NotebookEntry, NotebookFolder, OpenPosition, RiskRules, Strategy, TagCategory, TradeNote, WorkingOrder } from '@/core/types';
import type { ParsedReport } from '@/core/parsers';
import { emptyJournal, mergeJournal, type Journal } from './merge';
import { dedupeDeposits } from '@/core/stats';
import { deviceTz } from '@/core/time';
import type { Plan, WatchZone } from '@/core/strategy';
import * as cloud from './cloud';

// localStorage keys are shared with the classic app (public/legacy.html) so both read the same data.
export const SK = {
  trades: 'ledger_trades', notes: 'ledger_notes', dayNotes: 'ledger_dayNotes', accounts: 'ledger_accounts', strategies: 'ledger_strategies',
  activeAccount: 'ledger_activeAccount', checklist: 'ledger_checklist', checklistDays: 'ledger_checklistDays', notebook: 'ledger_notebook',
  playbook: 'ledger_playbook', openPositions: 'ledger_openPositions', workingOrders: 'ledger_workingOrders', deposits: 'ledger_deposits',
  attachments: 'ledger_attachments', brokerOffset: 'ledger_brokerOffset', brokerClock: 'ledger_brokerClock', userTz: 'ledger_userTz', riskRules: 'ledger_riskRules', exitData: 'ledger_tradeExitData',
  theme: 'ledger_theme', privacy: 'ledger_privacy_mode', notebookFolders: 'ledger_notebook_folders', tagCategories: 'ledger_tag_categories',
  tagCategoryMap: 'ledger_tag_category_map', aiConfig: 'ledger_ai_coach_config', aiConvos: 'ledger_ai_coach_convos',
  overrides: 'ledger_instrument_overrides', plans: 'rfx_plans', zones: 'rfx_zones', sidebar: 'ledger_sidebar_collapsed', lastSync: 'rfx_last_sync',
} as const;

const get = <T,>(k: string, d: T): T => { try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; } };
const put = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error('Storage full?', e); } };

export const DEFAULT_RISK_RULES: RiskRules = {
  maxDailyLoss: 50, maxSingleTradeRisk: 25, maxPositionSizeLots: 0.1, maxDailyTrades: 5, maxConsecutiveLosses: 2,
  cooldownMinutes: 30, maxSizeIncreaseFactor: 2, requirePlanBeforeTrade: true, riskPercent: 1,
};

export const DEFAULT_CHECKLIST = ['Checked HTF / ITF / ETF trend', 'Marked zones before session', 'News calendar checked', 'Risk sized with calculator', 'No revenge trades'];

export interface PlaybookState { checks: Record<string, boolean>; pair: number; trend?: { htf?: string | null; itf?: string | null; etf?: string | null } }
export interface DateRange { from: string | null; to: string | null; label: string }
export type SyncState = { status: 'off' | 'idle' | 'syncing' | 'ok' | 'error'; message?: string; at?: number };

interface State extends Journal {
  activeAccount: string;
  playbook: PlaybookState;
  brokerOffset: number;
  /** Broker server clock used to convert imported times ('mt-ny' = GMT+2/+3 with US DST). */
  brokerClock: string;
  /** The trader's own time zone; imported times are shown on this clock. */
  userTz: string;
  theme: 'dark' | 'light';
  privacy: boolean;
  overrides: Record<string, InstrumentOverride>;
  range: DateRange;
  user: { id: string; email: string } | null;
  sync: SyncState;

  set: <K extends keyof Journal>(k: K, v: Journal[K]) => void;
  importReport: (r: ParsedReport) => { added: number; updated: number; skipped: number };
  importExit: (d: Record<string, ExitData>) => { matched: number; total: number };
  saveNote: (id: string, n: TradeNote) => void;
  savePlan: (p: Plan) => void;
  deletePlan: (id: string) => void;
  saveZone: (z: WatchZone) => void;
  deleteZone: (id: string) => void;
  saveDayNote: (day: string, text: string) => void;
  saveAttachments: (tradeId: string, a: Attachment[]) => void;
  toggleChecklist: (item: string) => void;
  saveStrategy: (s: Strategy) => void;
  deleteStrategy: (id: string) => void;
  saveNotebook: (e: NotebookEntry) => void;
  deleteNotebook: (id: string) => void;
  saveFolder: (f: NotebookFolder) => void;
  setActiveAccount: (id: string) => void;
  setPlaybook: (p: PlaybookState) => void;
  setRiskRules: (r: RiskRules) => void;
  setOverride: (symbol: string, o: InstrumentOverride | null) => void;
  setTheme: (t: 'dark' | 'light') => void;
  setPrivacy: (v: boolean) => void;
  setRange: (r: DateRange) => void;
  setBrokerOffset: (h: number) => void;
  setBrokerClock: (c: string) => void;
  setUserTz: (tz: string) => void;
  restoreBackup: (b: Partial<Journal> & { playbookState?: PlaybookState }) => void;
  initCloud: () => Promise<void>;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  syncNow: () => Promise<void>;
}

const JOURNAL_KEYS: Record<keyof Journal, string> = {
  trades: SK.trades, accounts: SK.accounts, exitData: SK.exitData, openPositions: SK.openPositions, workingOrders: SK.workingOrders,
  deposits: SK.deposits, notes: SK.notes, dayNotes: SK.dayNotes, strategies: SK.strategies, notebook: SK.notebook, notebookFolders: SK.notebookFolders,
  checklist: SK.checklist, checklistDays: SK.checklistDays, riskRules: SK.riskRules, tagCategories: SK.tagCategories, tagCategoryMap: SK.tagCategoryMap, attachments: SK.attachments,
  plans: SK.plans, zones: SK.zones,
};

function loadJournal(): Journal {
  const e = emptyJournal();
  const j = {} as Record<string, unknown>;
  for (const [k, key] of Object.entries(JOURNAL_KEYS)) j[k] = get(key, (e as unknown as Record<string, unknown>)[k]);
  const out = j as unknown as Journal;
  if (!out.checklist.length) out.checklist = DEFAULT_CHECKLIST;
  return out;
}

const journalOf = (s: State): Journal => {
  const j = {} as Record<string, unknown>;
  for (const k of Object.keys(JOURNAL_KEYS)) j[k] = (s as unknown as Record<string, unknown>)[k];
  return j as unknown as Journal;
};

let pushTimer: ReturnType<typeof setTimeout> | null = null;

export const useStore = create<State>((set, getState) => {
  /** Persist journal fields and schedule a debounced cloud push when signed in. */
  const commit = (patch: Partial<Journal>) => {
    set(patch as Partial<State>);
    for (const [k, v] of Object.entries(patch)) put(JOURNAL_KEYS[k as keyof Journal], v);
    if (getState().user) {
      if (pushTimer) clearTimeout(pushTimer);
      pushTimer = setTimeout(() => { void getState().syncNow(); }, 4000);
    }
  };

  return {
    ...loadJournal(),
    activeAccount: get(SK.activeAccount, 'all'),
    playbook: get(SK.playbook, { checks: {}, pair: 3 }),
    brokerOffset: get(SK.brokerOffset, 3),
    // Older installs stored a fixed offset; anything but the old default keeps that exact offset.
    brokerClock: get<string | null>(SK.brokerClock, null) ?? (((o: number) => (o === 3 ? 'mt-ny' : `Etc/GMT${o > 0 ? '-' : '+'}${Math.abs(o)}`))(get(SK.brokerOffset, 3))),
    userTz: get(SK.userTz, deviceTz()),
    theme: get<string>(SK.theme, 'dark') === 'light' ? 'light' : 'dark',
    privacy: get(SK.privacy, false),
    overrides: get(SK.overrides, {}),
    range: { from: null, to: null, label: 'All time' },
    user: null,
    sync: { status: 'off' },

    set: (k, v) => commit({ [k]: v } as Partial<Journal>),

    importReport: (r) => {
      const s = getState();
      let added = 0, updated = 0, skipped = 0;
      const map = new Map(s.trades.map(t => [`${t.account}|${t.id}`, t]));
      for (const p of r.positions) {
        const key = `${p.account}|${p.id}`;
        const ex = map.get(key);
        if (!ex) { map.set(key, p); added++; }
        else if (ex.closeTime !== p.closeTime || ex.closePrice !== p.closePrice || ex.profit !== p.profit) { map.set(key, p); updated++; }
        else skipped++;
      }
      const acct: Account = { id: r.accountId, name: r.accountName, broker: r.broker, lastImport: Date.now(), snapshot: r.account, currency: r.currency ?? s.accounts[r.accountId]?.currency ?? 'USD' };
      const dk = (d: Deposit) => `${d.account}|${d.time}|${d.amount}`;
      const deps = new Map(s.deposits.map(d => [dk(d), d]));
      for (const d of r.deposits) deps.set(dk(d), d);
      commit({
        trades: [...map.values()],
        accounts: { ...s.accounts, [r.accountId]: acct },
        openPositions: [...s.openPositions.filter((p: OpenPosition) => p.account !== r.accountId), ...r.openPositions],
        workingOrders: [...s.workingOrders.filter((o: WorkingOrder) => o.account !== r.accountId), ...r.workingOrders],
        deposits: dedupeDeposits([...deps.values()]),
      });
      return { added, updated, skipped };
    },

    importExit: (d) => {
      const s = getState();
      const ids = new Set(s.trades.map(t => t.id));
      commit({ exitData: { ...s.exitData, ...d } });
      return { matched: Object.keys(d).filter(id => ids.has(id)).length, total: Object.keys(d).length };
    },

    saveNote: (id, n) => commit({ notes: { ...getState().notes, [id]: { ...n, updatedAt: Date.now() } } }),
    savePlan: (p) => { const now = { ...p, updatedAt: Date.now() }; const list = getState().plans; commit({ plans: list.some(x => x.id === p.id) ? list.map(x => (x.id === p.id ? now : x)) : [now, ...list] }); },
    // Deletions are tombstones so a sync from another device can't bring the record back.
    deletePlan: (id) => commit({ plans: getState().plans.map(x => (x.id === id ? { ...x, deleted: true, updatedAt: Date.now() } : x)) }),
    saveZone: (z) => { const now = { ...z, updatedAt: Date.now() }; const list = getState().zones; commit({ zones: list.some(x => x.id === z.id) ? list.map(x => (x.id === z.id ? now : x)) : [now, ...list] }); },
    deleteZone: (id) => commit({ zones: getState().zones.map(x => (x.id === id ? { ...x, deleted: true, updatedAt: Date.now() } : x)) }),
    saveDayNote: (day, text) => {
      const next = { ...getState().dayNotes };
      if (text.trim()) next[day] = text; else delete next[day];
      commit({ dayNotes: next });
    },
    saveAttachments: (id, a) => {
      const next = { ...getState().attachments, [id]: a };
      if (!a.length) delete next[id];
      commit({ attachments: next });
    },
    toggleChecklist: (item) => {
      const d = new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const days = getState().checklistDays;
      commit({ checklistDays: { ...days, [key]: { ...(days[key] ?? {}), [item]: !days[key]?.[item] } } });
    },
    saveStrategy: (st) => {
      const list = getState().strategies;
      commit({ strategies: list.some(x => x.id === st.id) ? list.map(x => (x.id === st.id ? st : x)) : [...list, st] });
    },
    deleteStrategy: (id) => {
      const notes = { ...getState().notes };
      for (const k of Object.keys(notes)) if (notes[k]?.strategyId === id) notes[k] = { ...notes[k], strategyId: null, updatedAt: Date.now() };
      commit({ strategies: getState().strategies.filter(x => x.id !== id), notes });
    },
    saveNotebook: (e) => {
      const list = getState().notebook, item = { ...e, updatedAt: Date.now() };
      commit({ notebook: list.some(x => x.id === e.id) ? list.map(x => (x.id === e.id ? item : x)) : [...list, { ...item, createdAt: Date.now() }] });
    },
    deleteNotebook: (id) => commit({ notebook: getState().notebook.filter(x => x.id !== id) }),
    saveFolder: (f) => {
      const list = getState().notebookFolders;
      commit({ notebookFolders: list.some(x => x.id === f.id) ? list.map(x => (x.id === f.id ? { ...x, ...f } : x)) : [...list, f] });
    },
    setActiveAccount: (id) => { set({ activeAccount: id }); put(SK.activeAccount, id); },
    setPlaybook: (p) => { set({ playbook: p }); put(SK.playbook, p); },
    setRiskRules: (r) => commit({ riskRules: r }),
    setOverride: (sym, o) => {
      const next = { ...getState().overrides };
      if (o) next[sym] = o; else delete next[sym];
      set({ overrides: next }); put(SK.overrides, next);
    },
    setTheme: (t) => { document.documentElement.dataset.theme = t; set({ theme: t }); put(SK.theme, t); },
    setPrivacy: (v) => { set({ privacy: v }); put(SK.privacy, v); },
    setRange: (r) => set({ range: r }),
    setBrokerOffset: (h) => { set({ brokerOffset: h }); put(SK.brokerOffset, h); },
    setBrokerClock: (c) => { set({ brokerClock: c }); put(SK.brokerClock, c); },
    setUserTz: (tz) => { set({ userTz: tz }); put(SK.userTz, tz); },
    restoreBackup: (b) => {
      const merged = mergeJournal(journalOf(getState()), b);
      commit(merged);
      if (b.playbookState) getState().setPlaybook(b.playbookState);
    },

    initCloud: async () => {
      const u = await cloud.currentUser();
      cloud.supa().auth.onAuthStateChange((_e, session) => {
        const su = session?.user;
        set({ user: su ? { id: su.id, email: su.email ?? '' } : null, sync: su ? getState().sync : { status: 'off' } });
      });
      if (!u) return;
      set({ user: { id: u.id, email: u.email ?? '' }, sync: { status: 'idle' } });
      await getState().syncNow();
    },
    login: async (email, password) => {
      const { data, error } = await cloud.signIn(email, password);
      if (error || !data.user) return error?.message ?? 'Sign-in failed';
      set({ user: { id: data.user.id, email: data.user.email ?? email }, sync: { status: 'idle' } });
      await getState().syncNow();
      return null;
    },
    logout: async () => { await cloud.signOut(); set({ user: null, sync: { status: 'off' } }); },

    /** Pull → merge record-by-record → save locally → push the merged journal back. */
    syncNow: async () => {
      const u = getState().user;
      if (!u || getState().sync.status === 'syncing') return;
      set({ sync: { status: 'syncing' } });
      try {
        const remote = await cloud.pull(u.id);
        const merged = remote ? mergeJournal(journalOf(getState()), remote) : journalOf(getState());
        set(merged as Partial<State>);
        for (const [k, v] of Object.entries(merged)) put(JOURNAL_KEYS[k as keyof Journal], v);
        if (merged.trades.length || remote) await cloud.push(u.id, merged);
        const at = Date.now();
        put(SK.lastSync, at);
        set({ sync: { status: 'ok', at } });
      } catch (e) {
        set({ sync: { status: 'error', message: (e as Error).message } });
      }
    },
  };
});

export const journalSnapshot = () => journalOf(useStore.getState());
export const tagCategoriesDefault: TagCategory[] = [
  { id: 'setup', name: 'Setup', color: 'accent', system: true, desc: 'Strategies, entries, patterns' },
  { id: 'mistake', name: 'Mistake', color: 'loss', system: true, desc: 'Execution errors to avoid' },
  { id: 'emotion', name: 'Emotion', color: 'warn', system: true, desc: 'Feelings, mindset, state' },
];
