import type { Account, Attachment, Deposit, ExitData, NotebookEntry, NotebookFolder, OpenPosition, RiskRules, Strategy, TagCategory, Trade, TradeNote, WorkingOrder } from '@/core/types';

/** Everything that syncs to the cloud. Mirrors the rfx_journal row. */
export interface Journal {
  trades: Trade[];
  accounts: Record<string, Account>;
  exitData: Record<string, ExitData>;
  openPositions: OpenPosition[];
  workingOrders: WorkingOrder[];
  deposits: Deposit[];
  notes: Record<string, TradeNote>;
  dayNotes: Record<string, string>;
  strategies: Strategy[];
  notebook: NotebookEntry[];
  notebookFolders: NotebookFolder[];
  checklist: string[];
  checklistDays: Record<string, Record<string, boolean>>;
  riskRules: Partial<RiskRules>;
  tagCategories: TagCategory[];
  tagCategoryMap: Record<string, string>;
  attachments: Record<string, Attachment[]>;
}

const byId = <T extends { id: string }>(local: T[], remote: T[], pick: (l: T, r: T) => T = l => l): T[] => {
  const m = new Map(remote.map(x => [x.id, x]));
  for (const l of local) { const r = m.get(l.id); m.set(l.id, r ? pick(l, r) : l); }
  return [...m.values()];
};

const newer = <T extends { updatedAt?: number }>(l: T, r: T) => ((r.updatedAt ?? 0) > (l.updatedAt ?? 0) ? r : l);

/**
 * Merge two journals without losing work from either side. The classic app let the cloud
 * overwrite local data on every page load, so edits made offline vanished; here every record
 * is merged individually and the newer edit wins where records carry a timestamp.
 */
export function mergeJournal(local: Journal, remote: Partial<Journal>): Journal {
  const r = { ...emptyJournal(), ...remote } as Journal;

  const accounts: Record<string, Account> = { ...r.accounts };
  for (const [id, a] of Object.entries(local.accounts)) {
    const ra = accounts[id];
    accounts[id] = !ra || (a.lastImport ?? 0) >= (ra.lastImport ?? 0) ? a : ra;
  }
  // Point-in-time lists (open positions, orders) belong to whichever side imported that account last.
  const pointInTime = <T extends { account: string }>(l: T[], rm: T[]) => {
    const accts = new Set([...l, ...rm].map(x => x.account));
    const out: T[] = [];
    for (const a of accts) {
      const localNewer = (local.accounts[a]?.lastImport ?? 0) >= (r.accounts[a]?.lastImport ?? 0);
      out.push(...(localNewer ? l : rm).filter(x => x.account === a));
    }
    return out;
  };

  const notes: Record<string, TradeNote> = { ...r.notes };
  for (const [id, n] of Object.entries(local.notes)) notes[id] = notes[id] ? newer(n, notes[id]) : n;

  const depKey = (d: Deposit) => `${d.account ?? ''}|${d.time}|${d.amount}`;
  const deposits = [...new Map([...r.deposits, ...local.deposits].map(d => [depKey(d), d])).values()];

  const checklistDays: Journal['checklistDays'] = { ...r.checklistDays };
  for (const [day, items] of Object.entries(local.checklistDays)) checklistDays[day] = { ...(checklistDays[day] ?? {}), ...items };

  const attachments: Journal['attachments'] = { ...r.attachments };
  for (const [tid, atts] of Object.entries(local.attachments)) attachments[tid] = byId(atts, attachments[tid] ?? []);

  return {
    trades: byId(local.trades, r.trades),
    accounts,
    exitData: { ...r.exitData, ...local.exitData },
    openPositions: pointInTime(local.openPositions, r.openPositions),
    workingOrders: pointInTime(local.workingOrders, r.workingOrders),
    deposits,
    notes,
    dayNotes: { ...r.dayNotes, ...local.dayNotes },
    strategies: byId(local.strategies, r.strategies),
    notebook: byId(local.notebook, r.notebook, newer),
    notebookFolders: byId(local.notebookFolders, r.notebookFolders),
    checklist: local.checklist.length ? local.checklist : r.checklist,
    checklistDays,
    riskRules: Object.keys(local.riskRules).length ? { ...r.riskRules, ...local.riskRules } : r.riskRules,
    tagCategories: byId(local.tagCategories, r.tagCategories),
    tagCategoryMap: { ...r.tagCategoryMap, ...local.tagCategoryMap },
    attachments,
  };
}

export function emptyJournal(): Journal {
  return {
    trades: [], accounts: {}, exitData: {}, openPositions: [], workingOrders: [], deposits: [], notes: {}, dayNotes: {},
    strategies: [], notebook: [], notebookFolders: [], checklist: [], checklistDays: {}, riskRules: {}, tagCategories: [], tagCategoryMap: {}, attachments: {},
  };
}
