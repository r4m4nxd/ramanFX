// Plain-language findings for a day or a week, ranked worst-first. Each one is something the
// numbers prove — no generic advice.

import type { Reason } from './strategy';

export interface InsightTrade {
  id: string; sym: string; net: number; r: number | null; volume: number; holdSec: number; open: Date; close: Date;
  outcome: 'win' | 'loss' | 'be'; session: string;
  planned: boolean; odds: 'high' | 'low' | null; tradeable: boolean | null; adherence: number | null;
  mfeR: number | null; riskPct: number | null; maxRiskPct: number | null;
}

const $ = (n: number) => `${n < 0 ? '−' : ''}$${Math.abs(n).toFixed(2)}`;

export function insights(win: InsightTrade[], history: InsightTrade[], scope: 'day' | 'week', limits: { maxDailyTrades?: number; maxDailyLoss?: number } = {}): Reason[] {
  const out: Reason[] = [];
  if (!win.length) return out;
  const add = (tone: Reason['tone'], text: string, rule: string) => out.push({ tone, text, rule });
  const net = win.reduce((a, t) => a + t.net, 0);
  const losses = win.filter(t => t.outcome === 'loss'), wins = win.filter(t => t.outcome === 'win');
  const lossSum = losses.reduce((a, t) => a + t.net, 0);
  const byClose = [...win].sort((a, b) => a.close.getTime() - b.close.getTime());

  // Plan discipline
  const unplanned = win.filter(t => !t.planned).length;
  if (unplanned === win.length) add('bad', `None of the ${win.length} trades had a plan.`, 'No plan, no trade.');
  else if (unplanned) add('warn', `${unplanned} of ${win.length} trades had no plan.`, 'Having a specific plan prevents FOMO.');
  else add('good', `Every trade was planned.`, 'Process over outcome.');
  const noTrade = win.filter(t => t.tradeable === false);
  if (noTrade.length) add('bad', `${noTrade.length} trade${noTrade.length > 1 ? 's were' : ' was'} taken on a NO-TRADE setup (${$(noTrade.reduce((a, t) => a + t.net, 0))}).`, 'If the zone is not fresh, qualified and explosive, it is not a trade.');
  const overRisk = win.filter(t => t.riskPct != null && t.maxRiskPct != null && t.riskPct > t.maxRiskPct * 1.15);
  if (overRisk.length) add('bad', `Over-risked ${overRisk.length} trade${overRisk.length > 1 ? 's' : ''} for their odds — ${$(overRisk.filter(t => t.net < 0).reduce((a, t) => a + t.net, 0))} of losses came from them.`, 'Low odds: risk 0.5% or less.');

  // Gave it back
  const gave = losses.filter(t => (t.mfeR ?? 0) >= 1);
  if (gave.length) add('bad', `${gave.length} loser${gave.length > 1 ? 's were' : ' was'} +1R first: ${$(gave.reduce((a, t) => a + t.net, 0))} that a 1:1 alert and breakeven would have saved.`, 'Alert at 1:1, move the stop to breakeven.');

  // Overtrading
  if (scope === 'day' && limits.maxDailyTrades && win.length > limits.maxDailyTrades) add('bad', `${win.length} trades — over your ${limits.maxDailyTrades}-trade limit.`, 'Too many setups leads to confusion and overtrading.');
  const histDays = new Map<string, number>();
  for (const t of history) { const k = t.close.toDateString(); histDays.set(k, (histDays.get(k) ?? 0) + 1); }
  const avgPerDay = histDays.size ? [...histDays.values()].reduce((a, b) => a + b, 0) / histDays.size : 0;
  if (scope === 'day' && avgPerDay && win.length >= Math.max(4, avgPerDay * 2)) add('warn', `${win.length} trades is ${(win.length / avgPerDay).toFixed(1)}× your usual ${avgPerDay.toFixed(1)} a day.`, 'Patience pays — opportunities are endless.');

  // Revenge and tilt
  let revenge = 0;
  for (let i = 1; i < byClose.length; i++) {
    const prev = byClose[i - 1], t = byClose[i];
    if (prev.outcome === 'loss' && t.open.getTime() - prev.close.getTime() < 15 * 60_000 && t.open > prev.close) revenge++;
  }
  if (revenge) add('bad', `${revenge} trade${revenge > 1 ? 's' : ''} opened within 15 minutes of a loss.`, 'Avoid revenge trading.');
  let streak = 0, worst = 0;
  for (const t of byClose) { streak = t.outcome === 'loss' ? streak + 1 : t.outcome === 'win' ? 0 : streak; worst = Math.max(worst, streak); }
  if (worst >= 3) add('warn', `${worst} losses in a row. Normal — if you stuck to the plan.`, 'Losing streaks are inevitable. Stick to your strategy.');
  if (limits.maxDailyLoss && scope === 'day' && -net > limits.maxDailyLoss) add('bad', `Lost ${$(-net)} — past your ${$(limits.maxDailyLoss)} daily limit.`, 'Respect the daily loss limit.');

  // Concentration
  if (losses.length >= 2) {
    const big = losses.reduce((a, t) => (t.net < a.net ? t : a));
    const share = big.net / lossSum;
    if (share >= 0.6) add('warn', `One trade (${big.sym} ${$(big.net)}) was ${(share * 100).toFixed(0)}% of the losses.`, 'Your risk is fixed before entry — one trade should never dominate.');
  }
  const sess = new Map<string, number>();
  for (const t of win) sess.set(t.session, (sess.get(t.session) ?? 0) + t.net);
  const worstSess = [...sess.entries()].sort((a, b) => a[1] - b[1])[0];
  if (worstSess && worstSess[1] < 0 && sess.size > 1 && worstSess[1] <= lossSum * 0.7 && lossSum < 0) add('warn', `${worstSess[0]} session cost ${$(worstSess[1])}.`, 'Know which session pays you.');

  // Holding behaviour
  if (wins.length && losses.length) {
    const hw = wins.reduce((a, t) => a + t.holdSec, 0) / wins.length, hl = losses.reduce((a, t) => a + t.holdSec, 0) / losses.length;
    if (hl > hw * 1.8 && hl > 600) add('warn', `Losers were held ${(hl / hw).toFixed(1)}× longer than winners.`, 'Cut losers at the stop; never widen it.');
  }

  // Result in context
  const histNet = new Map<string, number>();
  for (const t of history) { const k = t.close.toDateString(); histNet.set(k, (histNet.get(k) ?? 0) + t.net); }
  const vals = [...histNet.values()];
  if (scope === 'day' && vals.length >= 10) {
    const worse = vals.filter(v => v < net).length, better = vals.filter(v => v > net).length;
    if (better === 0) add('good', `Best day of the last ${vals.length + 1} trading days.`, 'Note what you did — repeat the process, not the result.');
    else if (worse === 0) add('bad', `Worst day of the last ${vals.length + 1} trading days.`, 'Have data on your max drawdown so it does not shock you.');
  }
  const rs = win.filter(t => t.r != null);
  if (rs.length >= 3) {
    const totalR = rs.reduce((a, t) => a + t.r!, 0);
    add(totalR >= 0 ? 'good' : 'warn', `${totalR >= 0 ? '+' : ''}${totalR.toFixed(1)}R across ${rs.length} trades with a known stop.`, 'Think in R, not dollars.');
  }
  if (!out.some(o => o.tone === 'bad') && net >= 0) add('good', `Clean ${scope}: no rule broken and green.`, 'Long-term consistency beats short-term gains.');
  const order = { bad: 0, warn: 1, good: 2 };
  return out.sort((a, b) => order[a.tone] - order[b.tone]);
}
