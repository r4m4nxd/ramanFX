import type { RiskRules } from './types';
import type { EnrichedTrade } from './stats';
import { dayKey } from './time';

export interface RiskStatus {
  netToday: number;
  /** Today's net loss (0 when net is positive). Daily loss limits are measured on net, like prop firms. */
  lossToday: number;
  count: number;
  consecLosses: number;
  biggestSize: number;
  minsSinceLastLoss: number;
  breaches: { level: 'hard' | 'cooldown'; text: string }[];
  warnings: string[];
  locked: boolean;
  lossUsed: number;   // 0..1 of the daily loss limit
  tradesUsed: number; // 0..1 of the daily trade cap
}

export function riskStatus(all: EnrichedTrade[], rules: RiskRules, now = new Date()): RiskStatus {
  const today = dayKey(now);
  const tt = all.filter(t => dayKey(t.close) === today).sort((a, b) => b.close.getTime() - a.close.getTime());
  const netToday = tt.reduce((a, t) => a + t.net, 0);
  const lossToday = Math.max(0, -netToday);
  let consecLosses = 0;
  for (const t of tt) { if (t.outcome === 'loss') consecLosses++; else if (t.outcome === 'win') break; }
  const lastLoss = tt.find(t => t.outcome === 'loss');
  const minsSinceLastLoss = lastLoss ? Math.floor((now.getTime() - lastLoss.close.getTime()) / 60000) : Infinity;
  const biggestSize = tt.reduce((a, t) => Math.max(a, t.volume), 0);
  const breaches: RiskStatus['breaches'] = [];
  const warnings: string[] = [];
  if (rules.maxDailyLoss > 0 && lossToday >= rules.maxDailyLoss) breaches.push({ level: 'hard', text: `Daily loss limit hit (−${lossToday.toFixed(2)} of ${rules.maxDailyLoss}). Done for today.` });
  if (rules.maxDailyTrades > 0 && tt.length >= rules.maxDailyTrades) breaches.push({ level: 'hard', text: `Trade cap reached (${tt.length}/${rules.maxDailyTrades}).` });
  if (rules.maxPositionSizeLots > 0 && biggestSize > rules.maxPositionSizeLots + 1e-9) breaches.push({ level: 'hard', text: `Position size ${biggestSize} lots exceeded the ${rules.maxPositionSizeLots} lot cap.` });
  if (rules.maxConsecutiveLosses > 0 && consecLosses >= rules.maxConsecutiveLosses && minsSinceLastLoss < rules.cooldownMinutes)
    breaches.push({ level: 'cooldown', text: `${consecLosses} losses in a row — cooldown for ${rules.cooldownMinutes - minsSinceLastLoss} more min.` });
  if (rules.maxDailyLoss > 0 && lossToday > 0 && lossToday >= rules.maxDailyLoss * 0.7 && lossToday < rules.maxDailyLoss) warnings.push(`Within 30% of your daily loss limit.`);
  if (rules.maxDailyTrades > 0 && tt.length === rules.maxDailyTrades - 1) warnings.push('One trade left today.');
  return {
    netToday, lossToday, count: tt.length, consecLosses, biggestSize, minsSinceLastLoss, breaches, warnings, locked: breaches.length > 0,
    lossUsed: rules.maxDailyLoss > 0 ? lossToday / rules.maxDailyLoss : 0,
    tradesUsed: rules.maxDailyTrades > 0 ? tt.length / rules.maxDailyTrades : 0,
  };
}
