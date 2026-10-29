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
  { topic: 'Zones', title: 'Base types', body: 'Single-candle base is the favourite. Doji basing works but is not preferred. Multiple messy candles = weak imbalance.' },
  { topic: 'Zones', title: 'Zones in the middle of a move', body: 'Continuation zones (Rally-Base-Rally, Drop-Base-Drop) form mid-move and are often the most powerful.' },
  { topic: 'Zones', title: 'Not every high or low is a zone', body: 'Every candle is supply and demand, but a ZONE needs a base and an explosive move away. Lines cutting through candles are not zones.' },
  { topic: 'Zones', title: 'Zone size is a trade-off', body: 'Small zone: best R:R, more stop-outs. Medium: balanced. Large: fills most often, lowest R:R. Choose and stay consistent.' },
  { topic: 'Zones', title: 'Higher timeframe, more power', body: 'A 1W demand is stronger than an H4 supply. The higher the timeframe of the zone, the more it controls price.' },
  { topic: 'Zones', title: 'Odds booster: the move away', body: 'An explosive Marubozu leaving the base — little to no wicks — is the strongest sign the zone will hold.' },
  { topic: 'Zones', title: 'Odds booster: liquidity trap', body: 'A clear support/resistance right before the zone traps early traders; their stops sit in our zone and fuel the reaction.' },
  { topic: 'Zones', title: 'Probabilities, not certainties', body: 'The worst zones can work and the best zones can fail. Let your R:R work out over the long run.' },
  { topic: 'Entry', title: 'Stop styles', body: 'Standard just beyond the distal, wide, or very conservative. Wider = more room, lower R:R. Backtest, pick one, stick to it.' },
  { topic: 'Entry', title: 'Four ways to take profit', body: 'Fixed R:R, the opposing zone, the opposing structure high/low, or no TP and trail the stop.' },
  { topic: 'Entry', title: 'Four ways to manage the stop', body: "Don't touch it; breakeven after a set R:R; half risk after a set R:R; or move it along with price below fresh LTF zones." },
  { topic: 'Entry', title: 'TradingView workflow', body: 'Long/Short position tool around the zone → right-click → Create limit order → set risk %. Entry, SL and TP come from the tool.' },
  { topic: 'Confirmation', title: 'Set the alert first', body: 'Place an alert just before the HTF zone. Alerts make trading mechanical and take emotion out of it.' },
  { topic: 'Confirmation', title: 'Multiple confirmations', body: 'Trendline, zone and structure removed on the same trade is MUCH preferred. Map what must be removed before it happens.' },
  { topic: 'Confirmation', title: 'Structure shift', body: 'An obvious high/low broken after a fresh zone forms. Usually comes with a zone removal — use it as an odds booster.' },
  { topic: 'Confirmation', title: 'Breakout order', body: 'Stop order just beyond the new zone after the opposing zone is removed. Works, but R:R is worse. Good for long-term investing.' },
  { topic: 'Confirmation', title: 'Pros and cons', body: 'Pros: fewer losses, tighter entries, more confidence. Cons: missed trades, more screen time, frustration inside the HTF zone with no signal.' },
  { topic: 'Set & forget', title: 'HTF trend + ETF trend', body: 'A high-odds set & forget follows the HTF trend AND has an entry-timeframe trend in the same direction.' },
  { topic: 'Set & forget', title: 'The highest odds', body: 'Demand low in the curve with a NEW HTF uptrend (supply high in the curve with a new downtrend). Still needs explosive moves on both timeframes.' },
  { topic: 'Set & forget', title: 'Profit margin', body: 'The distance from your ETF zone to the next opposing HTF zone. Small margin → manage aggressively.' },
  { topic: 'Set & forget', title: 'Understand before you take low odds', body: 'Do not take low-odds setups unless you fully understand what is — and what is not — a high-odds setup.' },
  { topic: 'Set & forget', title: 'The step-by-step plan', body: '1 Find ETF zones. 2 HTF trend. 3 HTF curve. 4 Pending limit order. 5 Alerts and management once filled.' },
  { topic: 'Set & forget', title: 'Pros and cons', body: 'Pros: more setups, faster TPs with momentum, simpler. Cons: feels riskier without confirmation; too many setups can mean overtrading.' },
  { topic: 'Timeframes', title: 'Pick for your life', body: 'Day: 1m→15m, 5m→H1, 15m→H4. Swing: H1→1D, H4→1W, 1D→1M. No best combo — price is fractal.' },
  { topic: 'Timeframes', title: 'Beginners: swing first', body: 'Day trading is fast and stressful. Learn on swing timeframes — they teach patience and wait for quality setups.' },
  { topic: 'Timeframes', title: 'News for day traders', body: 'Lower timeframes get hit by economic data. Know the release times and wait for the initial spike before placing a trade.' },
  { topic: 'Psychology', title: 'Know your drawdown', body: 'Have data on your average and MAX drawdown so that when it comes you are not shocked into emotional decisions.' },
  { topic: 'Psychology', title: 'Simulate before you suffer', body: 'Run your win rate and R:R through a profit simulator to see what a normal losing streak looks like. (Calculator → Monte Carlo.)' },
  { topic: 'Psychology', title: 'Myths and lies', body: '"$100 a day", "$50 to $50,000", "90% win rate", "quit your 9–5". If it sounds too good to be true, it always is.' },
  { topic: 'Psychology', title: 'Experience teaches', body: 'You only get comfortable with losing after losing a lot of trades. Success is managing losses, not avoiding them.' },
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
    [{ side: 'buy', htfTrend: 'up', etfTrend: 'down', curve: 25, moveAway: 'aplus' }, ['H1 demand, A+ move away', '1D uptrend, low in the curve', 'H1 itself is in a downtrend']],
    [{ side: 'buy', htfTrend: 'up', curve: 20, newTrend: true, moveAway: 'aplus', baseCandles: 1, baseType: 'single' }, ['H1 demand from a single-candle base', '1D just made its first higher high above the trendline', 'Low in the curve']],
  ];
  return base.map(([o, prompt], id) => {
    const plan = blankPlan({ id: `drill${id}`, qualified: 'zone', etfTrend: o.side === 'sell' ? 'down' : 'up', ...o });
    const v = evaluatePlan(plan);
    const answer = !v.tradeable ? 'NO TRADE' : v.odds === 'high' ? 'HIGH ODDS' : 'LOW ODDS';
    const why = !v.tradeable ? v.blockers[0].rule : v.reasons.filter(r => r.tone === (v.odds === 'high' ? 'good' : 'bad')).map(r => r.rule)[0] ?? v.mgmt.target;
    return { id, prompt, plan, answer, why };
  });
}

/** The breakeven-win-rate table from the S&D course. */
export const BE_TABLE: [number, number][] = [[50, 1], [10, 1], [5, 1], [3, 1], [2, 1], [1, 1], [1, 2], [1, 3], [1, 5], [1, 10], [1, 50]];
