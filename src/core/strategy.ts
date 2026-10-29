// The supply & demand playbook (FX Telepath: S&D zones, Set & Forget, Confirmation) as code.
// Every verdict the app gives cites one of these rules, so it is consistent and testable.

import type { Side, Trend } from './types';

export type Method = 'sf' | 'conf';
/** VP = valley/peak (reversal: DBR demand, RBD supply). CP = continuation (RBR demand, DBD supply). */
export type ZoneKind = 'VP' | 'CP';
export type MoveAway = 'poor' | 'decent' | 'aplus' | 'gap';
export type Qualifier = 'zone' | 'trendline' | 'both' | 'none';
export type ConfSignal = 'zone' | 'trendline' | 'both' | 'structure' | 'breakout';
export type EntryType = 'limit' | 'market' | 'stop';
export type TpMethod = 'fixed' | 'zone' | 'structure' | 'trail';
export type MgmtPlan = 'hold' | 'be' | 'half' | 'trail';
export type StopStyle = 'standard' | 'wide' | 'conservative';
export type BaseType = 'single' | 'tight' | 'doji' | 'messy';
export type PlanStatus = 'planned' | 'waiting' | 'touched' | 'ordered' | 'filled' | 'skipped' | 'missed';

/** Entry → higher timeframe pairs from the PDFs. Same order as the Playbook's combos. */
export const SD_COMBOS = [
  { etf: '1m', htf: '15m', style: 'Day' },
  { etf: '5m', htf: 'H1', style: 'Day' },
  { etf: '15m', htf: 'H4', style: 'Day' },
  { etf: 'H1', htf: '1D', style: 'Swing' },
  { etf: 'H4', htf: '1W', style: 'Swing' },
  { etf: '1D', htf: '1M', style: 'Swing' },
] as const;

export interface Plan {
  id: string;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
  /** Graded after the fact for a trade that had no plan. */
  retro?: boolean;
  symbol: string;
  side: Side;
  method: Method;
  combo: number;
  // The zone
  kind: ZoneKind;
  baseCandles: number;
  baseType?: BaseType;
  moveAway: MoveAway;
  fresh: boolean;
  /** Price ran far without retracing before coming back — an old zone. */
  old: boolean;
  qualified: Qualifier;
  // Higher-timeframe context
  htfTrend: Trend;
  /** Entry-timeframe trend — set & forget needs it in the trade's direction too. */
  etfTrend?: Trend;
  /** The HTF trend has only just started (new higher high / lower low after the trendline). */
  newTrend?: boolean;
  /** Price of the opposing HTF zone's proximal line — the profit margin. */
  opposingHtf?: number | null;
  /** Day trading: checked the economic calendar for data releases. */
  newsChecked?: boolean;
  /** Where the ETF zone sits between the HTF demand (0) and HTF supply (100) zones. */
  curve: number;
  /** ETF zone at or near an HTF zone that agrees with the trade (demand at HTF demand). */
  atHtfZone: boolean;
  /** ETF zone at or near an HTF zone that opposes the trade. */
  nearOpposing: boolean;
  // Confirmation trading
  htfTouched: boolean;
  signal: ConfSignal | null;
  // Odds boosters
  liquidityTrap: boolean;
  structureShift: boolean;
  // Levels (prices) and size
  proximal?: number | null;
  distal?: number | null;
  entry?: number | null;
  stop?: number | null;
  target?: number | null;
  lots?: number | null;
  riskPct?: number | null;
  riskAmount?: number | null;
  entryType?: EntryType;
  stopStyle?: StopStyle;
  tpMethod?: TpMethod;
  mgmtPlan?: MgmtPlan;
  status: PlanStatus;
  tradeId?: string | null;
  account?: string | null;
  note?: string;
}

export const blankPlan = (o: Partial<Plan> = {}): Plan => ({
  id: `pl_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
  createdAt: Date.now(), updatedAt: Date.now(),
  symbol: '', side: 'buy', method: 'sf', combo: 3,
  kind: 'VP', baseCandles: 2, moveAway: 'decent', fresh: true, old: false, qualified: 'zone',
  htfTrend: 'up', etfTrend: 'up', newTrend: false, curve: 30, entryType: 'limit', stopStyle: 'standard', tpMethod: 'fixed', mgmtPlan: 'hold', baseType: 'tight', atHtfZone: false, nearOpposing: false,
  htfTouched: false, signal: null, liquidityTrap: false, structureShift: false,
  status: 'planned', ...o,
});

/** DBR / RBD / RBR / DBD for the zone's kind and direction. */
export const formation = (kind: ZoneKind, side: Side) =>
  kind === 'VP' ? (side === 'buy' ? 'Drop-Base-Rally' : 'Rally-Base-Drop') : side === 'buy' ? 'Rally-Base-Rally' : 'Drop-Base-Drop';

export type TrendRel = 'with' | 'counter' | 'sideways';
export const trendRel = (side: Side, t: Trend): TrendRel => (t === 'side' ? 'sideways' : (t === 'up') === (side === 'buy') ? 'with' : 'counter');
/** Demand wants to be low in the curve, supply high. 0 = right at your own HTF zone, 100 = at the opposing one. */
export const curveDepth = (side: Side, curve: number) => (side === 'buy' ? curve : 100 - curve);

export interface Reason { tone: 'good' | 'bad' | 'warn'; text: string; rule: string }
export interface Management {
  style: 'aggressive' | 'non-aggressive';
  maxRiskPct: number;
  targetR: number;
  target: string;
  breakeven: string;
  alerts: string[];
}
export interface Verdict {
  tradeable: boolean;
  odds: 'high' | 'low';
  score: number;
  blockers: Reason[];
  reasons: Reason[];
  mgmt: Management;
  rr: number | null;
  stopPips?: number | null;
}

/**
 * Grade a plan. Blockers mean "no trade" per the PDFs; otherwise odds decide trade management:
 * low odds → lower risk, 1:1 target, breakeven early; high odds → let it run.
 */
export function evaluatePlan(p: Plan, defaultRiskPct = 1): Verdict {
  const blockers: Reason[] = [];
  const reasons: Reason[] = [];
  const add = (tone: Reason['tone'], text: string, rule: string) => reasons.push({ tone, text, rule });
  const block = (text: string, rule: string) => blockers.push({ tone: 'bad', text, rule });

  // ── Is it a zone at all? ──
  if (p.moveAway === 'poor') block('No explosive move away. A drift is not a supply/demand zone.', 'A zone MUST have an explosive move away from the basing.');
  else if (p.moveAway === 'aplus' || p.moveAway === 'gap') add('good', p.moveAway === 'gap' ? 'Gap move away — extreme imbalance.' : 'A+ move away: big bodies, no hesitation.', 'The best zones are created by the best moves away.');
  else add('warn', 'Decent move away — solid, but not the strongest reaction.', 'Decent: clear momentum, not the strongest imbalance.');

  if (p.baseCandles > 6) block(`${p.baseCandles} basing candles — wide and messy.`, 'Wide, messy bases suggest weak imbalance and should be avoided.');
  else if (p.baseCandles > 4) add('warn', `${p.baseCandles} basing candles — on the messy side.`, 'The best bases are tight: 1 to 4 candles.');
  else if (p.baseCandles <= 2) add('good', `${p.baseCandles}-candle base — his favourite structure.`, 'My favourite basing is when the zone has 1–2 candles.');
  else add('good', `${p.baseCandles}-candle base — tight enough.`, 'The best bases are tight: 1 to 4 candles.');

  if (p.baseType === 'doji') add('warn', 'Doji basing — workable, but not his favourite.', 'Doji candle basing: not my favourite.');
  if (p.baseType === 'messy' && p.baseCandles <= 6) add('warn', 'Messy multi-candle base.', 'Wide and messy bases suggest weaker imbalances.');
  if (p.baseType === 'single') add('good', 'Single-candle base — his favourite.', 'Single candle basing: my favourite.');
  if (!p.fresh) block('Zone has been tested already.', 'Zones must be FRESH — tested zones lose strength.');
  if (p.qualified === 'none') block('Zone did not remove an opposing zone or a trendline.', 'To be tradeable a zone must break an opposing zone OR remove a trendline.');
  else add('good', p.qualified === 'both' ? 'Removed an opposing zone AND a trendline.' : p.qualified === 'zone' ? 'Removed an opposing zone.' : 'Removed a trendline.', 'Qualified zone.');

  // ── Method-specific ──
  if (p.method === 'conf') {
    if (!p.htfTouched) block('HTF zone not actually touched yet. Close is not touching.', 'Wait for price to ACTUALLY touch the HTF zone.');
    if (!p.signal) block('No confirmation signal on the entry timeframe yet.', 'Drop to the ETF and wait for a confirmation signal.');
    else if (p.signal === 'both') add('good', 'Opposing trendline AND opposing zone removed — the best confirmation.', 'The BEST signal is both removed.');
    else if (p.signal === 'trendline') add('good', 'Trendline removed — the stronger single confirmation.', 'Trendline removal is stronger than zone removal.');
    else if (p.signal === 'zone') add('good', 'Opposing zone removed — the most common confirmation.', 'Zone removal confirms buyers/sellers were overpowered.');
    else if (p.signal === 'structure') add('good', 'Structure shift — a clear high/low broken.', 'Structure shift is an odds booster.');
    else add('warn', 'Breakout stop order — works, but your R:R is worse.', 'Breakout orders lower overall R:R.');
  }

  // ── Odds: HTF trend + location in the curve (+ zone age, opposing HTF zones) ──
  const rel = trendRel(p.side, p.htfTrend);
  const depth = curveDepth(p.side, p.curve);
  const low: Reason[] = [];
  if (p.nearOpposing) low.push({ tone: 'bad', text: `ETF ${p.side === 'buy' ? 'demand' : 'supply'} sits at/near an opposing HTF zone.`, rule: 'Low odds: ETF zone at or near a HTF opposing zone.' });
  if (rel !== 'with' && !p.atHtfZone) low.push({ tone: 'bad', text: rel === 'counter' ? 'Counter-trend to the HTF.' : 'HTF is sideways (no blatantly obvious trendline).', rule: 'Low odds: counter-trend or sideways to the HTF trend.' });
  const etfRel = p.etfTrend ? trendRel(p.side, p.etfTrend) : 'with';
  if (p.method === 'sf' && etfRel !== 'with') low.push({ tone: 'bad', text: `Entry-timeframe trend is ${etfRel === 'counter' ? 'against' : 'not with'} the trade.`, rule: 'A high-odds set & forget needs an entry-timeframe trend in the same direction.' });
  if (p.old) low.push({ tone: 'bad', text: 'Old zone — price ran far before returning.', rule: 'Low odds: the ETF zone is old.' });
  if (p.method === 'sf' && depth > 50 && !p.atHtfZone) low.push({ tone: 'bad', text: `${p.side === 'buy' ? 'Above' : 'Below'} the 50% mark of the curve (${Math.round(p.curve)}%).`, rule: `High-odds ${p.side === 'buy' ? 'demand is below' : 'supply is above'} the 50% mark of the curve.` });
  const high: Reason[] = [];
  if (rel === 'with') high.push({ tone: 'good', text: `With the HTF ${p.htfTrend === 'up' ? 'uptrend' : 'downtrend'}.`, rule: 'High odds: ETF zone aligns with the HTF trend.' });
  if (p.atHtfZone) high.push({ tone: 'good', text: 'At/near your HTF zone in control.', rule: 'High odds: ETF zone at or near a HTF zone that aligns with the entry.' });
  if (p.method === 'sf' && depth <= 50) high.push({ tone: 'good', text: `${p.side === 'buy' ? 'Low' : 'High'} in the curve (${Math.round(p.curve)}%) — room to the opposing HTF zone.`, rule: 'The closer the ETF zone is to your HTF zone, the higher the odds.' });
  if (p.method === 'sf' && rel === 'with' && etfRel === 'with') high.push({ tone: 'good', text: 'HTF and ETF trends both with you — stacked confluence.', rule: 'Follow the HTF trend AND have an ETF trend in the same direction.' });
  if (p.newTrend && rel === 'with') high.push({ tone: 'good', text: 'A NEW HTF trend — the highest-odds context.', rule: 'Highest odds: low in the curve combined with a new HTF trend.' });
  if (p.liquidityTrap) high.push({ tone: 'good', text: 'Liquidity trap in front of the zone.', rule: 'Odds booster: S/R liquidity trap before the zone.' });
  if (p.structureShift && p.signal !== 'structure') high.push({ tone: 'good', text: 'Structure shift in your direction.', rule: 'Odds booster: structure shift.' });
  const odds: Verdict['odds'] = low.length === 0 && (rel === 'with' || p.atHtfZone) ? 'high' : 'low';
  reasons.push(...high, ...low);

  if (SD_COMBOS[p.combo]?.style === 'Day' && !p.newsChecked) add('warn', 'Day-trading timeframe and no economic calendar check.', 'Day traders: know when data comes out and wait for the initial spike.');
  // ── Score 0–100 (quality of the zone and context, independent of blockers) ──
  let s = 0;
  s += { poor: 0, decent: 14, aplus: 24, gap: 24 }[p.moveAway];
  s += p.baseCandles <= 2 ? 14 : p.baseCandles <= 4 ? 10 : p.baseCandles <= 6 ? 3 : 0;
  s += p.qualified === 'both' ? 14 : p.qualified === 'none' ? 0 : 10;
  s += p.fresh ? 8 : 0;
  s += p.old ? 0 : 4;
  s += rel === 'with' ? 14 : rel === 'sideways' ? 5 : 0;
  s += p.atHtfZone ? 8 : 0;
  s += p.nearOpposing ? 0 : 6;
  s += Math.round(Math.max(0, Math.min(1, (100 - depth) / 100)) * 6);
  s += (p.liquidityTrap ? 3 : 0) + (p.structureShift ? 3 : 0) + (p.newTrend ? 2 : 0);
  if (p.method === 'sf') s += etfRel === 'with' ? 3 : 0;
  if (p.baseType === 'single') s += 2; else if (p.baseType === 'doji' || p.baseType === 'messy') s -= 2;
  if (p.method === 'conf') s += p.htfTouched && p.signal ? (p.signal === 'both' ? 6 : p.signal === 'breakout' ? 2 : 4) : 0;
  const score = Math.max(0, Math.min(100, s));

  // ── Trade management (the "key to the strategy") ──
  const mgmt: Management = odds === 'low'
    ? { style: 'aggressive', maxRiskPct: Math.min(0.5, defaultRiskPct / 2), targetR: 1, target: '1:1 — or an alert at 1:1 instead of a TP order', breakeven: 'Move to breakeven at 0.5–1R, then trail into profit', alerts: ['Alert at 1:1', 'At the alert: stop to breakeven', 'If it keeps going: bump the stop into profit'] }
    : { style: 'non-aggressive', maxRiskPct: defaultRiskPct, targetR: 3, target: 'Opposing HTF/ETF zone, or a fixed 1:3 or higher', breakeven: 'Wait longer before breakeven — let it breathe', alerts: ['Keep a TP order in the market', 'Never widen the stop'] };

  // ── Execution choices ──
  if (p.entryType === 'market') add('warn', 'Market order — you are late to the zone.', 'Market order (if late) is not advised; a pending limit at the proximal is the best entry.');
  else if (p.entryType === 'stop') add(p.method === 'conf' ? 'warn' : 'bad', 'Breakout stop order beyond the zone.', 'Breakout entries lower your overall R:R.');
  else add('good', 'Pending limit order at the proximal line.', 'Pending limit order: best entry method.');
  if (p.tpMethod === 'trail' && odds === 'low') add('warn', 'Trailing with no TP on a low-odds setup.', 'Low odds: take 1:1 or an alert at 1:1 — do not be greedy.');
  if (p.tpMethod === 'fixed' || p.tpMethod === 'zone' || p.tpMethod === 'structure') { if (odds === 'high') add('good', `Take profit: ${{ fixed: 'fixed R:R', zone: 'opposing zone', structure: 'opposing structure' }[p.tpMethod]}, order in the market.`, 'Keep a TP order in the market in case you cannot manage the trade.'); }
  if (p.mgmtPlan === 'hold' && odds === 'low') add('warn', 'Plan says "don\'t touch the stop" on a low-odds setup.', 'Low odds: move to breakeven quicker (0.5–1R).');
  if ((p.mgmtPlan === 'be' || p.mgmtPlan === 'half') && odds === 'high') add('warn', 'Early breakeven on a high-odds setup can stop you out of the move.', 'High odds: wait longer before moving to breakeven.');
  if (p.mgmtPlan === 'trail') add('good', 'Trail the stop behind lower-timeframe zones.', 'Move the stop along with price, below fresh LTF zones.');

  // ── Levels ──
  let rr: number | null = null;
  if (p.entry && p.stop) {
    const risk = Math.abs(p.entry - p.stop);
    const dir = p.side === 'buy' ? 1 : -1;
    if ((p.entry - p.stop) * dir <= 0) block('Stop is on the wrong side of the entry.', 'Stop goes below demand / above supply.');
    if (p.distal != null && (p.stop - p.distal) * dir > 0) block(`Stop is inside the zone (${p.side === 'buy' ? 'above' : 'below'} the distal line).`, 'Place the stop just beyond the distal line.');
    if (p.proximal != null && p.distal != null) {
      const h = Math.abs(p.proximal - p.distal);
      if ((p.entry - p.proximal) * dir > h * 0.25) add('warn', 'Entry is well outside the proximal line — that is chasing.', 'Place the limit order just before the proximal line.');
    }
    if (p.target && risk > 0) {
      rr = Math.abs(p.target - p.entry) / risk;
      if ((p.target - p.entry) * dir <= 0) block('Target is on the wrong side of the entry.', 'Take profit goes in your direction.');
      else if (odds === 'low' && rr > 1.6) add('warn', `Targeting ${rr.toFixed(1)}R on a low-odds setup.`, 'Low odds: aim for 1:1. DO NOT BE GREEDY.');
      else if (odds === 'high' && rr < 2) add('warn', `Only ${rr.toFixed(1)}R on a high-odds setup.`, 'High odds: target the opposing zone or 1:3+.');
    }
  }
  if (p.opposingHtf != null && p.entry != null && p.stop != null && Math.abs(p.entry - p.stop) > 0) {
    const room = ((p.opposingHtf - p.entry) * (p.side === 'buy' ? 1 : -1)) / Math.abs(p.entry - p.stop);
    if (room <= 0) blockers.push({ tone: 'bad', text: 'The opposing HTF zone is behind your entry — no profit margin.', rule: 'Profit margin is the distance to the next opposing HTF zone.' });
    else if (room < 1) add('bad', `Only ${room.toFixed(1)}R of room to the opposing HTF zone.`, 'Profit margin is the distance to the next opposing HTF zone.');
    else if (room < 2) add('warn', `${room.toFixed(1)}R of room to the opposing HTF zone — tight.`, 'Low profit margin → manage aggressively.');
    else add('good', `${room.toFixed(1)}R of room to the opposing HTF zone.`, 'Profit margin is the distance to the next opposing HTF zone.');
  }
  if (p.riskPct != null && p.riskPct > mgmt.maxRiskPct + 1e-9) add('bad', `Risking ${p.riskPct}% — ${odds} odds allows ${mgmt.maxRiskPct}% at most.`, odds === 'low' ? 'Low odds: risk 0.5% or less.' : 'Stick to your normal risk.');

  return { tradeable: blockers.length === 0, odds, score, blockers, reasons, mgmt, rr };
}

// ─── Post-trade verdict ──────────────────────────────────────────────

export interface TradeFacts {
  side: Side;
  entry: number;
  exit: number;
  /** Final stop from the report (may have been moved to breakeven). */
  finalStop: number | null;
  finalTarget: number | null;
  net: number;
  /** Money risked at the initial stop, when known. */
  risk: number | null;
  r: number | null;
  balance: number | null;
  /** Max adverse / favourable excursion in account money for the whole position (both ≥ 0). */
  maeMoney?: number | null;
  mfeMoney?: number | null;
  holdSec: number;
  minutesSinceLastLoss?: number | null;
  sizeVsAvg?: number | null;
  /** v2 excursion export: how it closed, how it was entered, and what holding would have paid / cost. */
  exitReason?: string | null;
  entryOrder?: string | null;
  slipPts?: number | null;
  leftMoney?: number | null;
  savedMoney?: number | null;
  afterMin?: number | null;
}

export interface TradeVerdict { lines: Reason[]; adherence: number | null; headline: string }

const money = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2)}`;

/**
 * Blunt, rule-cited assessment of one closed trade. Uses the plan when there is one; without
 * a plan it still checks what the report can prove (stop, target, risk size, behaviour).
 */
export function judgeTrade(f: TradeFacts, plan: Plan | null, defaultRiskPct = 1): TradeVerdict {
  const lines: Reason[] = [];
  const say = (tone: Reason['tone'], text: string, rule: string) => lines.push({ tone, text, rule });
  const dir = f.side === 'buy' ? 1 : -1;
  const v = plan ? evaluatePlan(plan, defaultRiskPct) : null;
  let checks = 0, passed = 0;
  const check = (ok: boolean) => { checks++; if (ok) passed++; };

  if (!plan) { say('bad', 'No plan. This trade was not graded before entry — you cannot know if it was high or low odds.', 'Having a specific plan prevents FOMO and off-plan trades.'); check(false); }
  else {
    if (!v!.tradeable) { check(false); say('bad', `Taken despite a NO-TRADE verdict: ${v!.blockers.map(b => b.text).join(' ')}`, v!.blockers[0].rule); }
    else check(true);
    say(v!.odds === 'high' ? 'good' : 'warn', `${v!.odds === 'high' ? 'High' : 'Low'}-odds ${plan.method === 'sf' ? 'set & forget' : 'confirmation'} ${formation(plan.kind, plan.side)} (score ${v!.score}).`, v!.odds === 'high' ? 'High odds: aim for higher R:R, wait longer before breakeven.' : 'Low odds: lower R:R, breakeven quicker.');
  }

  // Stop loss
  if (f.finalStop == null) { say('bad', 'No stop loss on this position.', 'Always manage risk by setting a stop loss outside the zone.'); check(false); }
  else if (plan?.stop != null && (plan.stop - f.finalStop) * dir > 1e-9) { say('bad', `Stop was widened from ${plan.stop} to ${f.finalStop}.`, 'Never move your stop loss wider.'); check(false); }
  else check(true);

  // Take profit order (a planned trail means no TP by design)
  if (f.finalTarget == null && plan?.tpMethod !== 'trail') { say(v?.odds === 'low' ? 'warn' : 'bad', 'No take-profit order was in the market.', 'Keep a TP order in the market in case you cannot manage the trade.'); check(v?.odds === 'low'); }

  // Entry vs plan
  if (plan?.entry && plan.proximal != null && plan.distal != null) {
    const h = Math.abs(plan.proximal - plan.distal) || Math.abs(plan.entry - (plan.stop ?? plan.entry)) || 1;
    const slip = (f.entry - plan.entry) * dir;
    if (slip > h * 0.25) { say('warn', `Filled ${Math.abs(f.entry - plan.entry).toPrecision(3)} worse than the planned limit — chased.`, 'Pending limit order at the proximal line is the best entry.'); check(false); }
    else check(true);
  }

  // Risk size
  if (f.risk != null && f.balance && f.balance > 0) {
    const pct = (f.risk / f.balance) * 100;
    const cap = v ? v.mgmt.maxRiskPct : defaultRiskPct;
    if (pct > cap * 1.15) { say('bad', `Risked ${pct.toFixed(2)}% of the account (${money(f.risk)}). ${v ? `${v.odds === 'low' ? 'Low' : 'High'} odds allows ${cap}%.` : `Your rule is ${cap}%.`}${f.net < 0 ? ` This loss was ${money(Math.abs(f.net) - (f.risk * cap) / pct)} bigger than it had to be.` : ''}`, v?.odds === 'low' ? 'Low odds: risk 0.5% or less.' : 'Size from your risk %, never from a feeling.'); check(false); }
    else { say('good', `Risk ${pct.toFixed(2)}% of the account — within your ${cap}% rule.`, 'Size from your risk %.'); check(true); }
  }

  // Outcome vs management, using MAE/MFE when available
  if (f.mfeMoney != null && f.risk && f.risk > 0) {
    const mfeR = f.mfeMoney / f.risk;
    const maeR = f.maeMoney != null ? f.maeMoney / f.risk : null;
    if (mfeR != null) {
      if (plan?.mgmtPlan === 'be' && f.net < 0 && mfeR >= (v?.odds === 'low' ? 0.5 : 1)) {
        say('bad', `Your plan said breakeven — price reached +${mfeR.toFixed(1)}R and you still took ${money(f.net)}.`, 'Follow the management you planned before entry.');
        check(false);
      } else if (plan?.mgmtPlan === 'half' && f.r != null && f.r < -0.6 && mfeR >= 1) {
        say('bad', `Plan said half risk after 1R; it hit +${mfeR.toFixed(1)}R and you still lost ${Math.abs(f.r).toFixed(2)}R.`, 'Move the stop to half risk after the set R:R.');
        check(false);
      } else if (f.net < 0 && mfeR >= 1) {
        say('bad', `Ran to +${mfeR.toFixed(1)}R, then closed at ${f.r != null ? f.r.toFixed(2) + 'R' : money(f.net)}. A 1:1 alert + breakeven would have saved ${money(Math.abs(f.net))}.`, 'Aggressive management: alert at 1:1, move the stop to breakeven.');
        check(false);
      } else if (f.net < 0 && mfeR >= 0.5 && v?.odds === 'low') {
        say('warn', `Reached +${mfeR.toFixed(2)}R before reversing. Low odds says breakeven from 0.5R.`, 'Move stop to breakeven after 0.5:1 or 1:1.');
      }
      if (f.r != null && f.r > 0 && mfeR > 0 && v?.odds === 'high' && mfeR - f.r >= 1.5) say('warn', `Banked ${f.r.toFixed(1)}R of a ${mfeR.toFixed(1)}R move on a high-odds setup.`, 'High odds: wait longer before breakeven, aim higher.');
      if (f.r != null && f.r > 0 && v?.odds === 'low' && f.r >= 0.9) say('good', `Took ${f.r.toFixed(1)}R on low odds — not greedy.`, 'DO NOT BE GREEDY.');
      if (f.r != null && v?.odds === 'high' && f.r >= 2.5) say('good', `Let a high-odds trade pay ${f.r.toFixed(1)}R.`, 'High odds: aim for a higher R:R.');
    }
    if (maeR != null && maeR > 1.15 && f.finalStop != null) { say('bad', `Price went ${maeR.toFixed(1)}R against you — beyond where a stop at 1R sat.`, 'Never widen the stop.'); check(false); }
  } else if (f.r != null) {
    if (f.r <= -1.2) { say('bad', `Lost ${Math.abs(f.r).toFixed(2)}R — more than the planned 1R.`, 'Your risk is fixed before entry.'); check(false); }
  }

  // How it was entered and closed (v2 export)
  if (f.entryOrder) {
    if (f.entryOrder === 'market') { say(plan && plan.entryType !== 'market' ? 'bad' : 'warn', `Entered with a market order${plan?.entryType === 'limit' ? ' — your plan said a pending limit' : ''}.`, 'Pending limit order just before the proximal line is the best entry; market orders are not advised.'); check(false); }
    else if (f.entryOrder === 'limit') { say('good', 'Entered with a pending limit order.', 'Pending limit order (best entry method).'); check(true); }
    else if (f.entryOrder === 'stop') say('warn', 'Entered with a stop order (breakout).', 'Breakout stop orders typically give a worse R:R.');
  }
  const ago = f.afterMin != null ? ` ${f.afterMin < 60 ? Math.round(f.afterMin) + ' min' : (f.afterMin / 60).toFixed(1) + ' h'} later` : '';
  if (f.exitReason === 'so') say('bad', 'Closed by a margin stop-out.', 'Size from your risk %, never from a feeling.');
  if (f.leftMoney != null && f.leftMoney > 0) say(v?.odds === 'low' ? 'warn' : 'bad', `You closed early; price hit your original target${ago} before the stop — ${money(f.leftMoney)} left on the table.`, v?.odds === 'low' ? 'Low odds: taking 1:1 is fine — DO NOT BE GREEDY.' : 'High odds: aim for a higher R:R and wait longer.');
  if (f.savedMoney != null && f.savedMoney > 0) say('good', `Closing early paid off — price went on to hit your stop${ago}. Saved ${money(f.savedMoney)}.`, 'Manage the trade by the plan; protect capital.');

  // Behaviour
  if (f.minutesSinceLastLoss != null && f.minutesSinceLastLoss < 15) say('bad', `Opened ${Math.round(f.minutesSinceLastLoss)} min after a loss.`, 'Avoid revenge trading — emotional decisions make losing streaks worse.');
  if (f.sizeVsAvg != null && f.sizeVsAvg >= 2) say('warn', `Size was ${f.sizeVsAvg.toFixed(1)}× your average.`, 'Size comes from the plan, not from conviction.');

  const adherence = checks ? Math.round((passed / checks) * 100) : null;
  const bad = lines.filter(l => l.tone === 'bad').length;
  const headline = !plan && f.net >= 0 ? 'A win without a plan is luck you cannot repeat.'
    : !plan ? 'An unplanned loss. Grade it now so it teaches you something.'
    : bad === 0 ? (f.net >= 0 ? 'Textbook. Plan followed, result earned.' : 'Plan followed. A good loss — the edge plays out over hundreds of trades.')
    : f.net >= 0 ? `Won, but ${bad} rule${bad > 1 ? 's' : ''} broken. Don't let the result reward the mistake.` : `Lost and ${bad} rule${bad > 1 ? 's' : ''} broken. This one was on you, not the market.`;
  return { lines, adherence, headline };
}

/** Find the most plausible plan for a trade: same symbol and side, made before the entry. */
export function matchPlan(plans: Plan[], t: { id: string; sym: string; type: Side; open: Date; openPrice: number }): Plan | null {
  const linked = plans.find(p => !p.deleted && p.tradeId === t.id);
  if (linked) return linked;
  const cands = plans.filter(p => !p.deleted && !p.tradeId && !p.retro && p.symbol.toUpperCase() === t.sym.toUpperCase() && p.side === t.type
    && p.createdAt <= t.open.getTime() + 5 * 60_000 && t.open.getTime() - p.createdAt < 21 * 86_400_000);
  if (!cands.length) return null;
  const dist = (p: Plan) => (p.entry ? Math.abs(p.entry - t.openPrice) / Math.max(1e-9, Math.abs((p.entry ?? 0) - (p.stop ?? p.entry ?? 0)) || 1) : 50) + (t.open.getTime() - p.createdAt) / 86_400_000;
  return cands.sort((a, b) => dist(a) - dist(b))[0];
}

/** Breakeven win rate for a reward:risk (the "keep this chart on hand" table). */
export const breakevenWinRate = (rr: number) => 1 / (1 + rr);

// ─── Zone watchlist (the process board) ──────────────────────────────
export type ZoneStage = 'waiting' | 'touched' | 'confirmed' | 'ordered' | 'done' | 'invalid';
export interface WatchZone {
  id: string;
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
  symbol: string;
  side: Side;
  /** Timeframe the zone was drawn on. */
  tf: string;
  /** HTF zone (wait for a touch, then confirm) or ETF zone (set & forget limit order). */
  role: 'htf' | 'etf';
  proximal?: number | null;
  distal?: number | null;
  stage: ZoneStage;
  note?: string;
  planId?: string | null;
}
