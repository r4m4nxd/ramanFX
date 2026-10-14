// The guru's teaching material: rules to reread, drills to test yourself, and a quick read of
// where you stand right now. All text paraphrases the three strategy PDFs.

import { blankPlan, evaluatePlan, type Plan } from './strategy';

export const RULE_CARDS: { title: string; body: string; topic: string }[] = [
  { topic: 'Zones', title: 'A zone is two things', body: 'A tight base, then an explosive move away. No explosive move, no zone — just a high or a low.' },
  { topic: 'Zones', title: 'The best bases are small', body: '1–2 candles is the favourite. Up to 4 is fine. Wide, messy bases mean a weak imbalance.' },
  { topic: 'Zones', title: 'Fresh or nothing', body: 'Once price has returned to a zone, it has lost its strength. Only trade fresh zones.' },
  { topic: 'Zones', title: 'Qualify the zone', body: 'It must break an opposing zone OR remove a trendline. One is enough.' },
  { topic: 'Zones', title: 'Draw it precisely', body: 'Demand: distal at the lowest wick of the base, proximal at the top of the base. Supply is the mirror.' },
  { topic: 'Entry', title: 'Limit order at the proximal', body: 'Place a pending limit just before the proximal line. A market order only if you are late — not advised.' },
  { topic: 'Entry', title: 'Stop beyond the distal', body: 'Standard, wide or very conservative — pick one in backtesting and stick to it.' },
  { topic: 'Entry', title: 'Never widen the stop', body: 'Your risk was decided before entry. Widening it increases exposure and breaks your discipline.' },
  { topic: 'Confirmation', title: 'Touching is not close', body: 'Wait for price to ACTUALLY touch the HTF zone. Close is a false move waiting to happen.' },
  { topic: 'Confirmation', title: 'The best confirmation', body: 'An opposing trendline AND an opposing zone removed. Trendline alone is stronger than zone alone.' },
  { topic: 'Confirmation', title: 'Pullback entry', body: 'After the signal, find the ETF zone that caused it and place your order there. Let the trade play out.' },
  { topic: 'Confirmation', title: 'No free lunch', body: 'Confirmation avoids losses but misses trades. Be completely fine watching price leave without you.' },
  { topic: 'Set & forget', title: 'Trend + curve = odds', body: 'High odds: with the HTF trend, demand below the 50% mark of the curve (supply above it).' },
  { topic: 'Set & forget', title: 'A trend needs a trendline', body: 'Higher highs without a blatantly obvious trendline is still sideways.' },
  { topic: 'Set & forget', title: 'What makes it low odds', body: 'Near an opposing HTF zone, counter-trend or sideways, or an old zone.' },
  { topic: 'Management', title: 'Low odds: do not be greedy', body: 'Risk 0.5% or less, target 1:1, move to breakeven at 0.5–1R. An alert at 1:1 instead of a TP lets winners surprise you.' },
  { topic: 'Management', title: 'High odds: let it breathe', body: 'Target the opposing zone or 1:3+. Wait longer before breakeven. Keep a TP order in the market.' },
  { topic: 'Psychology', title: 'Hundreds, not a handful', body: 'An edge plays out over hundreds of trades. A losing streak is not a verdict on your strategy.' },
  { topic: 'Psychology', title: 'No revenge trades', body: 'Emotional decisions make losing streaks worse. Stick to the plan, especially after a loss.' },
  { topic: 'Psychology', title: 'Realistic returns', body: 'Beating the S&P\'s 8–10% a year puts you ahead of most traders. 20–30% is incredible. Year one: aim for breakeven.' },
  { topic: 'Psychology', title: 'Patience pays', body: 'Your job is not to chase price. React when the market presents a clear opportunity — or move on.' },
];

/** Same card all day, a new one tomorrow. */
export function cardOfDay(d = new Date()) {
  const n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000));
  return RULE_CARDS[n % RULE_CARDS.length];
}

export interface Drill { id: number; prompt: string[]; plan: Plan; answer: 'NO TRADE' | 'HIGH ODDS' | 'LOW ODDS'; why: string }

/** Deterministic set of scenarios graded by the same engine the Planner uses. */
export function drills(): Drill[] {
  const base: [Partial<Plan>, string[]][] = [
    [{ side: 'buy', htfTrend: 'up', curve: 20, moveAway: 'aplus', baseCandles: 1 }, ['H1 demand, A+ move away, 1-candle base', '1D trend: up with a clear trendline', 'Zone sits at 20% of the curve']],
    [{ side: 'buy', htfTrend: 'down', curve: 30, moveAway: 'aplus', baseCandles: 2 }, ['H1 demand, A+ move away', '1D trend: down', 'Low in the curve (30%)']],
    [{ side: 'sell', htfTrend: 'down', curve: 35, moveAway: 'decent' }, ['H1 supply, decent move away', '1D trend: down', 'Zone at 35% of the curve (closer to HTF demand)']],
    [{ side: 'buy', htfTrend: 'up', curve: 25, moveAway: 'poor' }, ['5m demand, price drifted away slowly', '1H trend: up', 'Low in the curve']],
    [{ side: 'sell', htfTrend: 'up', curve: 85, moveAway: 'gap' }, ['H4 supply, gapped away', '1W trend: up', 'High in the curve (85%)']],
    [{ side: 'buy', htfTrend: 'up', curve: 15, fresh: false }, ['H1 demand, A+ move away', '1D up, low in the curve', 'Price already came back to it once']],
    [{ side: 'buy', htfTrend: 'side', curve: 40 }, ['H1 demand, decent move', '1D made a higher high — but no obvious trendline', 'Zone at 40% of the curve']],
    [{ side: 'buy', htfTrend: 'up', curve: 20, nearOpposing: true }, ['15m demand, 1H trend up', 'Low in the curve', 'Right under a 1H supply zone in control']],
    [{ method: 'conf', side: 'buy', htfTrend: 'down', htfTouched: false, signal: 'zone' }, ['Confirmation trade', 'Price came within a few pips of the 1D demand', 'An H1 supply was removed']],
    [{ method: 'conf', side: 'buy', htfTrend: 'up', htfTouched: true, signal: 'both', atHtfZone: true }, ['Confirmation trade', '1D demand touched', 'H1 trendline AND supply removed']],
    [{ side: 'sell', htfTrend: 'down', curve: 70, baseCandles: 6 }, ['H1 supply, 6 messy basing candles', '1D trend down, high in the curve']],
    [{ side: 'buy', htfTrend: 'up', curve: 30, qualified: 'none' }, ['H1 demand, A+ move', '1D up, low in the curve', 'It did not break any supply or trendline']],
    [{ side: 'buy', htfTrend: 'up', curve: 30, old: true }, ['H1 demand, 1D uptrend, low in the curve', 'Price ran very far before coming back weeks later']],
    [{ side: 'sell', htfTrend: 'down', curve: 80, moveAway: 'aplus', baseCandles: 1, liquidityTrap: true }, ['H4 supply, Marubozu leaving a 1-candle base', '1W trend down, 80% of the curve', 'Resistance liquidity sits just below the zone']],
  ];
  return base.map(([o, prompt], id) => {
    const plan = blankPlan({ id: `drill${id}`, qualified: 'zone', ...o });
    const v = evaluatePlan(plan);
    const answer = !v.tradeable ? 'NO TRADE' : v.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS';
    const why = !v.tradeable ? v.blockers[0].rule : v.reasons.filter(r => r.tone === (v.odds === 'high' ? 'good' : 'bad')).map(r => r.rule)[0] ?? v.mgmt.target;
    return { id, prompt, plan, answer, why };
  });
}

/** The breakeven-win-rate table from the S&D course. */
export const BE_TABLE: [number, number][] = [[50, 1], [10, 1], [5, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 5], [1, 10], [1, 50]];
