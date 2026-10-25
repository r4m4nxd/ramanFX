// Data shapes. These mirror what the classic app stored in localStorage / Supabase so
// existing journals load without migration. New optional fields are additive only.

export type Side = 'buy' | 'sell';

/** Closed position. Times are "YYYY.MM.DD HH:MM:SS" already converted to the browser's local time. */
export interface Trade {
  id: string;
  account: string;
  openTime: string;
  closeTime: string;
  symbol: string;
  type: Side;
  volume: number;
  openPrice: number;
  closePrice: number;
  sl: string | number;
  tp: string | number;
  commission: number;
  swap: number;
  profit: number;
}

export interface OpenPosition {
  id: string;
  account: string;
  openTime: string;
  symbol: string;
  type: Side;
  volume: number;
  openPrice: number;
  sl: string | number;
  tp: string | number;
  currentPrice: number;
  swap: number;
  floatingPnL: number;
}

export interface WorkingOrder {
  id: string;
  account: string;
  openTime: string;
  symbol: string;
  type: string;
  volume: number;
  price: number;
  sl: string | number;
  tp: string | number;
  expiry: string;
  state: string;
}

export interface Deposit {
  time: string;
  amount: number;
  balance: number | null;
  comment: string;
  account?: string;
}

export interface AccountSnapshot {
  balance: number | null;
  equity: number | null;
  floatingPnL: number | null;
  freeMargin: number | null;
  margin: number | null;
  marginLevel: string | null;
  credit: number | null;
}

export interface Account {
  id: string;
  name: string;
  broker: string;
  lastImport: number;
  snapshot: Partial<AccountSnapshot>;
  currency?: string;
}

export type Trend = 'up' | 'down' | 'side';

export interface Alignment {
  combo: number; // index into TIMEFRAME_COMBOS
  htf?: Trend | null;
  itf?: Trend | null;
  etf?: Trend | null;
}

export interface TradeNote {
  note?: string;
  tags?: string[];
  mistakes?: string[];
  rating?: number;
  strategyId?: string | null;
  updatedAt?: number;
  // v2 additions
  grade?: 'A' | 'B' | 'C' | 'D' | null;
  emotion?: string | null;
  align?: Alignment | null;
  /** Initial risk in account currency, when the final SL in the report no longer reflects it. */
  riskOverride?: number | null;
  /** Lines, zones and notes drawn on the trade chart. Times are UTC seconds. */
  drawings?: Drawing[];
  /** Rule check: Raja's key rules ticked followed (y) / broken (n) / not applicable (na), keyed by rule id (core/ruleScore). */
  rules?: Partial<Record<string, 'y' | 'n' | 'na'>>;
}

export type DrawKind = 'hline' | 'trend' | 'rect' | 'text';
export interface Drawing { id: string; kind: DrawKind; a: { t: number; p: number }; b?: { t: number; p: number }; color: string; text?: string }

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: number;
  storageUrl?: string;
  dataUrl?: string;
}

export interface ExitData {
  positionId: string;
  fillCount?: number;
  symbol: string | null;
  type: string | null;
  openTime: string | null;
  closeTime: string | null;
  durationHrs: number | null;
  profitDol: number | null;
  profitPts: number | null;
  mae: number | null;
  mfe: number | null;
  t30m: number | null;
  t1h: number | null;
  t4h: number | null;
  t12h: number | null;
  t1d: number | null;
  t1w: number | null;
  t1wMin: number | null;
  dollarPerPt?: number | null;
  /** Stop/target the position was opened with (RamanFX export). */
  initSl?: number | null;
  initTp?: number | null;
  /** Minutes from entry to the best / worst price, when known. */
  minToMfe?: number | null;
  minToMae?: number | null;
  source?: string | null;
  // v2 export
  /** How the position closed: sl / tp / manual / so (stop-out) / ea / other. */
  exitReason?: string | null;
  /** Closing deals (more than 1 = partial closes) and each fill as price@time×lots. */
  closes?: number | null;
  exits?: string | null;
  entryPrice?: number | null;
  exitPrice?: number | null;
  /** MT5: market / limit / stop / stop_limit, the price the order asked for, slippage (+ = worse) and when it was placed. */
  entryOrder?: string | null;
  reqPrice?: number | null;
  slipPts?: number | null;
  placedAt?: string | null;
  /** Worst point reached before the best point (heat taken on the way to the MFE). */
  maeBeforeMfe?: number | null;
  /** Minutes from entry when price first touched each R level (1R = initial stop), following price past the exit. */
  touch?: Touch | null;
  /** After the exit: did the original target or stop come first (within the export window), and when. */
  afterExit?: 'tp' | 'sl' | 'none' | null;
  afterExitMin?: number | null;
  /** Best price after the exit within 1 day / 1 week, in points from entry. */
  max1d?: number | null;
  max1w?: number | null;
  suspectMFE?: boolean;
  suspectMAE?: boolean;
}

export interface Touch { p05: number | null; p1: number | null; p2: number | null; p3: number | null; m05: number | null; sl: number | null; be05: number | null; be1: number | null; h05: number | null }

export interface Strategy {
  id: string;
  name: string;
  description?: string;
  rules?: string[] | string;
  color?: string;
}

export interface NotebookEntry {
  id: string;
  title: string;
  body: string;
  folderId: string;
  favorite?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface NotebookFolder {
  id: string;
  name: string;
  template?: string;
}

export interface RiskRules {
  maxDailyLoss: number;
  maxSingleTradeRisk: number;
  maxPositionSizeLots: number;
  maxDailyTrades: number;
  maxConsecutiveLosses: number;
  cooldownMinutes: number;
  maxSizeIncreaseFactor: number;
  requirePlanBeforeTrade: boolean;
  /** v2: default risk per trade as % of balance, used by the position calculator. */
  riskPercent?: number;
}

export interface TagCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
  system?: boolean;
  desc?: string;
}

/** User overrides for an instrument's contract specification, keyed by normalised symbol. */
export interface InstrumentOverride {
  contractSize?: number;
  pipSize?: number;
  tickSize?: number;
}
