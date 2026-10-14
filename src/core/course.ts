// Every slide of the three course PDFs, as study notes, and where the app applies it.
// Notes restate the PDFs only — no added rules.
// where: P = Planner question/verdict, V = trade verdict, J = journal insight, L = MAE/MFE lab, G = Guru card/drill, C = Calculator.

export type Pdf = 'S&D' | 'Confirmation' | 'Set & Forget';
export interface Lesson {
  pdf: Pdf;
  topic: string;
  slide: string;
  where: string;
  how: string;
  notes: string[];
  rule?: string; // the line the PDF stresses most
}

export const COURSE: Lesson[] = [
  // ── Supply & Demand (FX Telepath) ──
  { pdf: 'S&D', topic: 'Foundations', slide: 'What supply & demand zones are', where: 'P', how: 'The zone step asks for both parts of a zone.', notes: [
    'Price moves because of imbalances between buyers and sellers; zones mark where those imbalances are likely to occur.',
    'Demand zone: a fresh area where buyers overwhelmed sellers, causing a strong move up.',
    'Supply zone: a fresh area where sellers overpowered buyers, causing a sharp drop.',
    'The best zones are untested — price has not returned to them yet.',
    'The stronger the move away, the stronger the imbalance, and the more likely a reaction on the return.',
  ] },
  { pdf: 'S&D', topic: 'Foundations', slide: 'What is NOT a zone — common mistakes', where: 'P', how: 'Poor move away = NO TRADE.', notes: [
    'Zones are not just highs and lows of price. Every candle is supply and demand, but that is not a zone.',
    'A valid zone MUST show a strong imbalance: price moves away aggressively with little hesitation (institutions stepped in).',
    'Weak moves away mean there was not enough buying or selling pressure to make the zone significant.',
    'Do NOT cut through candles when mapping out a zone.',
  ], rule: 'No strong move away = no zone.' },
  { pdf: 'S&D', topic: 'Foundations', slide: 'Supply & demand is NOT support & resistance', where: 'P', how: 'Basing + move away are both required in the zone step.', notes: [
    'Every zone has 2 key elements: BASING and a STRONG/FAST MOVE AWAY.',
    'Support and resistance focus on general price areas; zones need a specific candle formation that shows institutional pressure.',
  ] },
  { pdf: 'S&D', topic: 'Foundations', slide: 'The logic: basing, breakout, return', where: 'P G', how: 'Why the Planner prints a limit order at the zone.', notes: [
    'Banks do not create zones on purpose — they leave footprints, because only large players can make explosive moves.',
    'Phase 1 — Basing: price is in equilibrium; buying and selling are almost balanced, so price ranges.',
    'Phase 2 — Breakout: buyers absorb the sell orders, overpower sellers, and price shoots off in one direction.',
    'The return: the move away was so fast that orders were left unfilled at the zone.',
    'We buy the pullback where the big players OBJECTIVELY bought before — we join the 2nd move to fill their leftover orders.',
  ] },
  { pdf: 'S&D', topic: 'Foundations', slide: 'Types of zones: VP & CP', where: 'P', how: 'VP / CP choice; the formation (DBR, RBD, RBR, DBD) is named for you.', notes: [
    'Valleys & Peaks (VP): at the tops and bottoms of moves — clear swing points where price strongly reverses, often reactions to previous zones.',
    'VP formations: Drop-Base-Rally (DBR) = demand · Rally-Base-Drop (RBD) = supply.',
    'Continuation Patterns (CP): usually in the middle of price — a pause in momentum, not a reversal; often a single-candle basing.',
    'CP formations: Rally-Base-Rally (RBR) = demand · Drop-Base-Drop (DBD) = supply.',
  ] },
  { pdf: 'S&D', topic: 'Zone structure', slide: 'Proximal & distal lines', where: 'P', how: 'Planner → Levels asks for both; stop is placed beyond the distal automatically.', notes: [
    'Proximal line: the lower line of supply / the upper line of demand (the side price reaches first).',
    'Distal line: the higher line of supply / the lower line of demand.',
    'The area between proximal and distal is the zone. The best zones show strong moves away.',
  ] },
  { pdf: 'S&D', topic: 'Zone structure', slide: 'The basing (1–4 tight candles)', where: 'P', how: 'Basing candles 1–7+: 5–6 warns, 7+ blocks.', notes: [
    'The basing is where price consolidates before the strong move away.',
    'Best bases are tight and well structured — typically 1 to 4 candles, uniform and clean.',
    'Wide, messy bases with too many candles suggest a weaker imbalance — avoid them.',
  ] },
  { pdf: 'S&D', topic: 'Zone structure', slide: 'Move away: poor / decent / A+ / gap', where: 'P', how: 'Drawn options; poor = NO TRADE, A+/gap score highest.', notes: [
    'Poor: drifts away slowly, choppy, no momentum or decisive breakout — weak reaction on return.',
    'Decent: clear direction with momentum, several consecutive candles the same way — solid, not the strongest.',
    'A+: explosive, large-bodied candles, no hesitation or wicks in the breakout — high-probability reaction.',
    'Gap: price gaps away without trading through the zone — extreme imbalance, often strong reactions.',
    'The best zones come from the best moves away; a weak move away is less likely to hold.',
    'The worst zones can work and the best can fail — it is a probability game; let R:R work out over the long run.',
  ] },
  { pdf: 'S&D', topic: 'Zone structure', slide: 'Types of bases (doji, messy, single)', where: 'P', how: 'Base structure question; single scores up, doji/messy warn.', notes: [
    'Bases vary with market conditions — some are tight, some have wicks rejecting a level several times.',
    'Doji-candle basing: not the favourite.',
    'Multiple-candle basing: messy.',
    'Single-candle basing: the favourite. Best of all is a zone with 1–2 basing candles.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'Entry: pending limit vs market', where: 'P', how: 'Entry order question; market and breakout are flagged.', notes: [
    'Pending limit order (best): placed just before the proximal line — fills automatically on the tap and gives the best R:R.',
    'Market order (if late): only if price is already in the zone; needs quick execution and is not advised. Entry may be slightly worse or better, the setup is still valid.',
    'Always set the stop loss outside the zone.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'Stop: standard / wide / very conservative', where: 'P', how: 'Stop buffer chips set the style; stop inside the zone is blocked.', notes: [
    'Standard: just below a demand zone (longs), just above a supply zone (shorts).',
    'Wider stop = more room, lower R:R. Tighter stop = higher R:R, but normal fluctuations can hit it.',
    'There is no right or wrong — some prefer standard, some very conservative.',
    'Backtest it, then decide which stop size you will use for your trades.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'Take profit: fixed R:R, opposing zone, structure, trail', where: 'P', how: 'Take-profit method question; low odds + trail is flagged.', notes: [
    'Fixed R:R (e.g. 1:1, 1:2): clear and consistent, you stick to a predefined level.',
    'Opposing zone: target the nearest opposing supply/demand — a natural exit, but price may not reach it.',
    'Opposing structure: target the previous high or low.',
    'No TP (trailing stop): trail as price moves; flexible, but you must manage the stop and decide when to lock profit manually.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'Trade management: hold / BE / half risk / trail', where: 'P V', how: 'Planned management is checked against your MAE/MFE after the trade.', notes: [
    'No universal answer — test methods and pick the one that gives you confidence to stick with the strategy.',
    '1. Don\'t touch the stop: let the trade reach its natural conclusion; requires trust in the setup.',
    '2. Breakeven after a set R:R (e.g. 1:1): great for big targets, but can stop you out early and miss the move.',
    '3. Half risk after a set R:R: move the stop to half the original risk (1% → 0.5%) — more room to breathe.',
    '4. Move the stop with price: place it just below higher-probability zones on lower timeframes.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'Never move your stop wider', where: 'V', how: 'Final stop wider than planned → broken rule.', notes: [
    'Your risk was decided before entry. Widening the stop after entry increases exposure and breaks disciplined risk management.',
  ], rule: 'Never move your stop loss wider.' },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'TradingView: connect your broker', where: 'G', how: 'Guru card: TradingView workflow.', notes: [
    'Connect your broker to TradingView (80+ brokers) to analyse, place and manage trades in one place.',
  ] },
  { pdf: 'S&D', topic: 'Trading a zone', slide: 'TradingView R:R tool → limit order', where: 'G P', how: 'Guru card; the Planner prints the same order ticket.', notes: [
    'Step 1: long position tool for longs, short position tool for shorts; form entry, stop and TP around the zone.',
    'Step 2: right-click the tool → "Create limit order…" (you must be logged in to your broker).',
    'Step 3: in the order panel only adjust risk % — entry, stop and TP are already set.',
  ], rule: 'Risk no more than 1% of your account.' },
  { pdf: 'S&D', topic: 'Drawing zones', slide: 'Drawing a zone precisely', where: 'P G', how: 'Hints on each line; Guru card.', notes: [
    'Demand: distal at the lowest wick of the basing candles; proximal at the top of the body or wick of the basing.',
    'Supply: distal at the highest wick of the basing candles; proximal at the bottom of the body or wick of the basing.',
    'Capture the exact area where the imbalance took place.',
  ] },
  { pdf: 'S&D', topic: 'Drawing zones', slide: 'Zone size: small / medium / large', where: 'P G', how: 'Zone height and R:R shown on Levels; Guru card on the trade-off.', notes: [
    'Small: best R:R, higher chance of being stopped out before price reacts.',
    'Medium: balanced — better chance of a fill while keeping good R:R.',
    'Large: highest chance of a fill, lowest R:R.',
    'Pick by your risk tolerance and objectives.',
  ] },
  { pdf: 'S&D', topic: 'Timeframes', slide: 'Timeframe combinations (day & swing)', where: 'P', how: 'Six combos from the course; style drives the news check.', notes: [
    'Day: 1m entry = 15m HTF · 5m entry = H1 HTF · 15m entry = H4 HTF.',
    'Swing: H1 entry = 1D HTF · H4 entry = 1W HTF · 1D entry = 1M HTF.',
    'Price is fractal — the same principles work from the 1m to the 1M.',
    'No "best" timeframe; consistency on the one that fits your lifestyle matters.',
  ] },
  { pdf: 'S&D', topic: 'Timeframes', slide: 'Day or swing for your lifestyle', where: 'G', how: 'Guru card; beginners swing first.', notes: [
    'Day trader: at the computer most of the day, 1m/5m/15m entries; fast decisions, constant monitoring, more stress.',
    'Beginners should not day trade — learn on swing timeframes: slower, and teaches patience for quality setups.',
    'Swing trader: busy schedule, H1/H4/1D entries held hours to days; less screen time.',
    'Best fit for a 9–5; H1/H4 pullbacks can take hours or days, so you can place trades after work.',
  ] },
  { pdf: 'S&D', topic: 'Multiple timeframes', slide: 'HTF zone in control; higher TF = more power', where: 'P G', how: '"At your HTF zone" question raises odds.', notes: [
    'Odds booster. HTF = higher timeframe, ETF = entry timeframe (example: 1D HTF, H1 ETF).',
    'Aligning with HTF zones is one of the best ways to boost odds.',
    'The higher the timeframe of the zone, the more power it has (a 1W zone beats an H4 zone).',
    '1. Map HTF zones and wait for price to reach a key HTF zone.',
    '2. Once price touches the proximal line, drop to the ETF.',
  ] },
  { pdf: 'S&D', topic: 'Multiple timeframes', slide: 'Patience pays', where: 'G J', how: 'Guru card; overtrading and revenge insights.', notes: [
    'This stage needs discipline: don\'t worry whether price pulls back — execute the plan without hesitation.',
    'Don\'t chase price or force trades; react when the market gives a clear opportunity.',
    'If the pullback doesn\'t come, accept it and move on — opportunities are endless.',
    'Trading is probabilities, not predictions. Patience separates consistent traders from impulsive ones.',
  ] },
  { pdf: 'S&D', topic: 'Multiple timeframes', slide: 'ETF zones within/near HTF zones', where: 'P', how: 'At-HTF-zone question.', notes: [
    'On the ETF, look for fresh demand/supply forming within or near the HTF zone.',
    'As price continues, a 2nd ETF zone can form and offer another entry.',
  ] },
  { pdf: 'S&D', topic: 'Qualify & odds boosters', slide: 'Qualify: break opposing zone OR remove trendline', where: 'P', how: 'Neither = NO TRADE.', notes: [
    'Odds booster. To be tradeable a zone must break an opposing zone OR remove a trendline — both are not required.',
    'Break an opposing zone: demand must break a previous supply; supply must break a previous demand.',
    'Remove the opposing trendline: price breaks the trendline that supported the previous trend.',
  ] },
  { pdf: 'S&D', topic: 'Qualify & odds boosters', slide: 'Zones must be FRESH', where: 'P', how: 'Tested = NO TRADE.', notes: [
    'Price must not have returned to the zone yet — tested zones lose strength and reliability.',
    'Freshness confirms a true shift in control and filters weak zones.',
  ], rule: 'Zones must be FRESH.' },
  { pdf: 'S&D', topic: 'Entries', slide: 'Confirmation entries: zone / trendline removed', where: 'P', how: 'Signal choice in Context.', notes: [
    'Use multiple timeframes to refine entries: look for lower-timeframe zones forming inside or near HTF zones, instead of blindly trading every HTF zone.',
    'A valid confirmation must remove an opposing supply/demand zone (momentum shifted) or remove a trendline (trend changed).',
    'Trendline example: price contacts the HTF demand zone → look for a trendline break on the ETF → trade the ETF demand zone.',
  ] },
  { pdf: 'S&D', topic: 'Entries', slide: 'Set & forget: HTF trend + ETF trend', where: 'P', how: 'Both trends asked; ETF against = low odds.', notes: [
    'High-odds set & forget trades follow the trend with fresh zones and need no extra confirmation.',
    'Must follow the HTF trend AND have the ETF trend in the same direction — this stacks confluence.',
  ] },
  { pdf: 'S&D', topic: 'Qualify & odds boosters', slide: 'Odds booster: Marubozu move away', where: 'P', how: 'A+ move away grade.', notes: [
    'An odds booster adds confluence that the zone holds; strength of the move away is one of the strongest.',
    'Want an explosive move away and a Marubozu candle leaving the base (little to no wicks).',
    'The cleaner and stronger the departure, the higher the odds.',
  ] },
  { pdf: 'S&D', topic: 'Qualify & odds boosters', slide: 'Odds booster: liquidity trap', where: 'P', how: 'Odds booster toggle.', notes: [
    'A support/resistance level right before the zone where many traders enter too early.',
    'Their stop losses sit where our real zone is; price sweeps them and reverses from the true imbalance.',
    'That trapped liquidity fuels our trade — a stronger reaction at the zone.',
  ] },
  { pdf: 'S&D', topic: 'Psychology', slide: 'Losing streaks & breakeven win-rate table', where: 'G', how: 'Streak mode + table on the Guru page.', notes: [
    'Losing streaks are inevitable, even for the best — a probability game, not a verdict on your skill.',
    'Stick to the strategy; deviating out of frustration leads to bigger mistakes.',
    'Trust the probabilities — an edge plays out over hundreds of trades. Make sure it is backtested.',
    'Avoid revenge trading.',
    'Know your average and MAX expected drawdown so a streak doesn\'t shock you into emotional decisions.',
    'Success is managing losses while staying disciplined; experience is the best teacher. Keep the chart handy.',
  ] },
  { pdf: 'S&D', topic: 'Psychology', slide: 'Profit simulator (winrate.io)', where: 'C', how: 'Calculator → Monte Carlo with "Use my stats".', notes: [
    'Enter account size, win rate and R:R, simulate any number of trades.',
    'Use it to see what a win rate/R:R combo looks like and what a losing streak looks like (trade-by-trade breakdown).',
  ] },
  { pdf: 'S&D', topic: 'Psychology', slide: 'Realistic expectations (8–10%, 20–30%)', where: 'G', how: 'Realistic returns gauge.', notes: [
    'Beating the stock market average (8–10% a year) consistently already puts you ahead of most traders.',
    '20–30% a year is incredible if consistent. Returns depend on trade frequency and risk management.',
    'Most online gurus fake profits — screenshots and balances are easy to manipulate.',
    'Long-term consistency beats short-term gains. Learn to trade first; the money follows.',
  ] },
  { pdf: 'S&D', topic: 'Psychology', slide: 'Myths and lies', where: 'G', how: 'Guru card.', notes: [
    '"$100 per day" — markets don\'t pay on a schedule; some days you make nothing.',
    '"Turn $50 into $50,000" — extremely rare and usually reckless gambling.',
    '"90% win rate" — top traders lose often; risk management matters, not win rate.',
    '"Quit your 9–5" — success takes years; most never replace a full-time income.',
  ], rule: 'If it sounds too good to be true, it always is.' },

  // ── Confirmation ──
  { pdf: 'Confirmation', topic: 'Foundations', slide: 'What a confirmation entry is', where: 'P', how: 'Method choice: Confirmation.', notes: [
    'Wait for price action to validate the idea before entering, reducing false setups.',
    'Instead of blind orders at zones, look for signals: trendline breaks, candlestick patterns, lower-timeframe structure shifts.',
    'Can increase precision, maximise R:R and give extra confidence in the setup.',
  ] },
  { pdf: 'Confirmation', topic: 'Foundations', slide: 'Basing + move away', where: 'P', how: 'Zone step.', notes: [
    'Supply: selling exceeds buying → often a drop. Demand: buying exceeds selling → often a rise.',
    'Unlike S/R, zones account for consolidation before strong moves.',
    'The basing: price stalls in a tight range — big players quietly building positions.',
    'The move away: a sharp move showing one side overpowered the other; the stronger, the more significant.',
    'No clear base or no strong move away = weak and unreliable.',
  ] },
  { pdf: 'Confirmation', topic: 'Foundations', slide: 'Why confirm: clear zones, break trendlines', where: 'P G', how: 'Signals + cards.', notes: [
    'Blind entries can cause unnecessary losses; confirmation filters weak setups.',
    'Clearing opposing zones: a strong nearby opposing zone could reject price before target — wait for it to be removed.',
    'Breaking trendline resistance: a strong opposing trendline can push against you — its break shows momentum shifting your way.',
    'Boosting confidence: clear signals that institutions are stepping in reduce hesitation.',
    'Example: instead of buying in a downtrend, wait for the downtrend to be removed and a demand zone to form.',
  ] },
  { pdf: 'Confirmation', topic: 'The method', slide: '2 steps: HTF contacted → ETF signal', where: 'P', how: 'Touched + signal both required, else NO TRADE.', notes: [
    'Step 1: wait for a HTF supply/demand zone to be contacted.',
    'Step 2: drop to the ETF and wait for a confirmation signal.',
    'You confirm on the ETF, inside or near the HTF zone, AFTER price has touched it. (Example: 1D HTF, H1 ETF.)',
  ] },
  { pdf: 'Confirmation', topic: 'Signals', slide: 'Zone removal (most common)', where: 'P', how: 'Signal option.', notes: [
    'Price breaks an opposing supply/demand zone on the ETF — strength in your direction.',
    'The previous buyers/sellers were overpowered, so a reversal against you is less likely.',
    'Ideally the break creates a fresh zone to enter at.',
    'Trade it: limit order at the zone that removed the opposing zone, stop beyond it, TP beyond — entry on the return.',
  ] },
  { pdf: 'Confirmation', topic: 'Signals', slide: 'Trendline removal (stronger); both = best', where: 'P', how: 'Scored in that order.', notes: [
    'Price breaks an opposing trendline — momentum shifts toward the HTF zone direction.',
    'Ideally the break creates a new supply/demand zone below the trendline to enter at on the return.',
    'Trendline removal is a stronger signal than zone removal.',
  ], rule: 'Best signal: an opposing trendline AND an opposing zone removed.' },
  { pdf: 'Confirmation', topic: 'Signals', slide: 'Structure shift', where: 'P', how: 'Signal option and odds booster.', notes: [
    'Price breaks a clear high or low — a change in direction, usually after a fresh zone forms and removes the structure.',
    'Shows the dominant side has enough strength to shift control.',
    'Usually comes with a zone removal too, so it is used as an extra odds booster when judging the zone.',
  ] },
  { pdf: 'Confirmation', topic: 'Signals', slide: 'Breakout stop order (worse R:R)', where: 'P', how: 'Signal and entry option, flagged.', notes: [
    '1. Identify the opposing zone that needs to be removed.',
    '2. As price approaches it, look for a zone in your direction; if it forms, place a stop order just beyond the opposing zone\'s distal line, with the stop loss safely beyond your zone.',
    'Enters with momentum, but lowers R:R depending on how far your stop zone is from the zone being removed.',
    'Works well for long-term stock investing where a stop loss is less of a worry.',
  ] },
  { pdf: 'Confirmation', topic: 'The method', slide: 'Core concept: HTF zone, ETF signal, order at the zone', where: 'P', how: 'The whole Confirmation path.', notes: [
    'Align entries with the HTF narrative: the HTF zone tells you where price is likely to react.',
    'Step 1: identify and wait for a HTF zone to be contacted.',
    'Step 2: wait for a signal on the ETF, identify the zone that gave it, place the order at that zone.',
  ] },
  { pdf: 'Confirmation', topic: 'The method', slide: 'Timeframe sequences, price is fractal', where: 'P G', how: 'Combos + card.', notes: [
    'No best timeframe — it depends on your life. Working days → swing. Home all day → day trading may suit.',
    'Day: 1m = 15m · 5m = H1 · 15m = H4. Swing: H1 = 1D · H4 = 1W · 1D = 1M.',
    'Price is fractal — you cannot tell a 1-minute chart from a 1-month chart by looks.',
  ] },
  { pdf: 'Confirmation', topic: 'Step by step', slide: 'Step 1: map HTF zones', where: 'P', how: 'Zone watchlist.', notes: [
    'After picking your timeframe sequence, map the HTF zones on a blank chart (example: H1 HTF, 5m ETF).',
  ] },
  { pdf: 'Confirmation', topic: 'Step by step', slide: 'Step 2: alert just before the HTF zone', where: 'P', how: 'Watchlist "Waiting" stage.', notes: [
    'Place the alert just a bit before the HTF zone so you can prepare to look for ETF trades.',
    'Tip: right-click the exact price to set the alert.',
    'Alerts make trading mechanical and remove emotion and randomness — an important part of the system.',
  ] },
  { pdf: 'Confirmation', topic: 'Step by step', slide: 'Step 3: wait for an ACTUAL touch', where: 'P', how: '"Touched" question; close is not touching.', notes: [
    'Practise patience: price must ACTUALLY touch the HTF zone — not get close.',
    'Example: price made a false move after ALMOST touching; the big move came after it contacted the zone.',
  ], rule: 'Close is not touching.' },
  { pdf: 'Confirmation', topic: 'Step by step', slide: 'Step 4: confirmation on ETF, pullback entry', where: 'P', how: 'Signal + limit at the zone.', notes: [
    'Pick the confirmation type (the pullback entry is preferred).',
    'Map out the opposing zone / trendline / structure you want removed.',
    'Once removed, place your order and let the trade play out.',
  ] },
  { pdf: 'Confirmation', topic: 'Step by step', slide: 'Multiple confirmations much preferred', where: 'P G', how: 'Both scores highest; card.', notes: [
    'The same trade can show several confirmations at once (structure high removed, supply zone removed, trendline) — MUCH preferred.',
  ] },
  { pdf: 'Confirmation', topic: 'Pros & cons', slide: 'Not a cheat code — missed trades', where: 'G', how: 'Pros & cons card; Missed status on plans.', notes: [
    'Waiting prevents some losses, but you WILL miss setups.',
    'Accept: price hits the HTF zone, no confirmation comes, and price leaves without you.',
    'Accept: confirmation forms, but no pullback — price leaves without you (this one hurts).',
    'Accept: confirmation, pullback, stop hit — then price goes your way.',
    'Every decision has pros and cons; there is no free lunch.',
  ] },
  { pdf: 'Confirmation', topic: 'Pros & cons', slide: 'Pros and cons', where: 'G', how: 'Card.', notes: [
    'Pro: can prevent losses by waiting for price to shift your way.',
    'Pro: narrows the entry for a bigger R:R.',
    'Pro: you trade with the HTF zone — higher odds and profit margin.',
    'Pro: more confidence than set & forget; easier on emotions when price blasts through the HTF zone.',
    'Con: you miss entries you would have had trading the whole HTF zone.',
    'Con: more chart time than set & forget — harder with a full-time job.',
    'Con: breakout stop orders give a worse R:R.',
    'Con: frustrating when price sits in the HTF zone with no confirmation.',
  ] },

  // ── Set & Forget ──
  { pdf: 'Set & Forget', topic: 'Foundations', slide: 'What is a set & forget entry', where: 'P', how: 'Method choice.', notes: [
    'Orders go directly at zones without lower-timeframe confirmation — the zone already represents an institutional imbalance.',
    'HTF zones are still used — to judge how much profit is available, not as a place to wait for.',
  ] },
  { pdf: 'Set & Forget', topic: 'Foundations', slide: 'Basing + explosive move away; wait for it first', where: 'P', how: 'Zone step.', notes: [
    'A zone = basing + an EXPLOSIVE move away — evidence of big banks entering.',
    'An aggressive move proves objectively more buyers than sellers at that price; unfilled orders may remain, or big players may value that price again.',
    'Wait for the explosive move FIRST, then place the order at the zone. Supply is the exact opposite.',
  ] },
  { pdf: 'Set & Forget', topic: 'Foundations', slide: 'What is NOT a zone; middle-of-move zones', where: 'P G', how: 'Poor move = NO TRADE; CP zone type; card.', notes: [
    'Zones are not just highs and lows; every candle is supply and demand, but that is not a zone.',
    'Must have an explosive move away — not a "move" made of basing candles.',
    'A high and a low alone are not a zone; you still need the explosive move away.',
    'Zones can form in the middle of a move — and often are the most powerful.',
  ] },
  { pdf: 'Set & Forget', topic: 'Foundations', slide: 'S&F vs confirmation', where: 'P', how: 'Method choice explains both.', notes: [
    'Confirmation: wait for the HTF zone to be contacted, then trade zones forming on a lower timeframe.',
    'Set & forget: do NOT wait for the HTF zone — trade ETF zones formed outside the HTF zones.',
  ] },
  { pdf: 'Set & Forget', topic: 'Trend', slide: 'Trend: up / down / sideways (blatant trendline)', where: 'P', how: 'Trend question hint; no trendline = sideways.', notes: [
    'The trend tells you how aggressive to be with trade management.',
    'Uptrend: higher highs AND a blatantly obvious trendline up.',
    'Downtrend: lower lows AND a blatantly obvious trendline down.',
    'Sideways: no trendline, no HH or LL — a range where highs and lows are respected.',
  ], rule: 'A higher high without a blatantly obvious trendline is NOT a trend.' },
  { pdf: 'Set & Forget', topic: 'High odds', slide: 'The 2 things that decide the odds', where: 'P', how: 'Context step asks both.', notes: [
    '1. The HTF trend (trending or sideways).',
    '2. Where the ETF zone sits relative to HTF supply/demand zones.',
    'Assess both to decide whether to take or avoid, and how to manage.',
    'Counter trend: ETF demand in a HTF downtrend, or ETF supply in a HTF uptrend.',
    'Profit margin: distance from your zone to the next opposing zone on the HIGHER timeframe.',
  ] },
  { pdf: 'Set & Forget', topic: 'High odds', slide: 'High odds 1: HTF trend aligned', where: 'P', how: 'Counter/sideways = low odds.', notes: [
    'High odds only when the HTF trend aligns with the entry.',
    'ETF demand + HTF uptrend. ETF supply + HTF downtrend.',
  ] },
  { pdf: 'Set & Forget', topic: 'High odds', slide: 'High odds 2: the curve & 50% mark', where: 'P', how: 'Curve slider.', notes: [
    'The curve = price location between the HTF demand zone and HTF supply zone, split at the 50% mark.',
    'High-odds demand: below 50%. High-odds supply: above 50%.',
    'The closer the ETF zone is to the matching HTF zone, the higher the odds.',
    'You can still long near HTF supply or short near HTF demand — be aware and manage accordingly.',
  ] },
  { pdf: 'Set & Forget', topic: 'High odds', slide: 'Profit margin to the opposing HTF zone', where: 'P', how: 'Opposing HTF price → R of room; behind entry = NO TRADE.', notes: [
    'Profit margin is the room from your zone to the next opposing HTF zone — HTF zones decide how much profit the trade can give.',
  ] },
  { pdf: 'Set & Forget', topic: 'High odds', slide: 'Highest odds: low in curve + NEW trend', where: 'P', how: 'New-trend question.', notes: [
    'Highest-odds demand: low in the curve + a NEW HTF uptrend.',
    'Highest-odds supply: high in the curve + a NEW HTF downtrend.',
    'Everything else still applies — explosive moves away from all HTF and ETF zones.',
  ] },
  { pdf: 'Set & Forget', topic: 'Low odds', slide: 'Low odds: counter trend', where: 'P', how: 'Odds logic.', notes: [
    'Low odds when the HTF trend does not align with the ETF zone.',
    'ETF demand + HTF downtrend. ETF supply + HTF uptrend.',
  ], rule: 'Counter-trend trading is low odds.' },
  { pdf: 'Set & Forget', topic: 'Low odds', slide: 'Low odds: close to the opposing HTF zone', where: 'P', how: 'Near-opposing question.', notes: [
    'The closer you are to the opposing HTF zone, the lower the odds (demand near HTF supply, supply near HTF demand).',
    'Low odds doesn\'t mean untradeable — manage the trade differently.',
  ] },
  { pdf: 'Set & Forget', topic: 'Timeframes', slide: 'Timeframes; economic data for day traders', where: 'P', how: 'Day combos ask about the calendar.', notes: [
    'Day: 1m = 15m · 5m = H1 · 15m = H4. Swing: H1 = 1D · H4 = 1W · 1D = 1M.',
    'No best combo — full-time job → swing; free during NY or London → you can try day trading.',
    'Lower timeframes have more noise and are hit harder by economic data.',
    'Day traders: know when data is released and wait for the initial spike before placing a trade. Swing traders worry less.',
  ] },
  { pdf: 'Set & Forget', topic: 'Trade management', slide: 'Trade management is the key', where: 'P V L', how: 'Odds → risk, target, breakeven; checked after; replayed in the lab.', notes: [
    'Two styles: Aggressive and Non-aggressive.',
    'Using both means you don\'t wait only for the highest-odds setups — you can take lower-probability ones too.',
    'Example: a low-odds demand zone — TP at 1:1 instead of the high, or BE at 1:1, avoided a loss.',
  ], rule: 'Do NOT take low-odds setups unless you fully understand what is and is not high odds.' },
  { pdf: 'Set & Forget', topic: 'Trade management', slide: 'What makes a zone low odds (3 reasons)', where: 'P', how: 'Opposing zone, counter/sideways, old zone.', notes: [
    '1. ETF zone is at or near an opposing HTF zone.',
    '2. ETF zone is counter trend or sideways to the HTF trend.',
    '3. ETF zone is old — price went very far without retracing to it.',
  ] },
  { pdf: 'Set & Forget', topic: 'Trade management', slide: 'Aggressive: 0.5% risk, 1:1, BE at 0.5–1R, alert at 1:1', where: 'P V L', how: 'Prescribed for low odds; risk over 0.5% flagged; lab replays it.', notes: [
    'For low odds: 1. Lower risk — 0.5% or less if you usually risk 1%.',
    '2. Target only 1:1 — not 1:3–1:5.',
    '3. Move the stop to breakeven at 0.5:1 or 1:1.',
    'Favourite: set an ALERT at 1:1 instead of a TP. When it triggers, move the stop to breakeven.',
    'Sometimes price returns to BE. Sometimes it keeps going — then move the stop into profit around 1:1, and keep bumping it with price; it can become 1:3+.',
    'Low odds zones (even at an opposing HTF zone) sometimes blast through — this is why.',
  ] },
  { pdf: 'Set & Forget', topic: 'Trade management', slide: 'Non-aggressive: opposing zone or 1:3+, TP in market', where: 'P V', how: 'Prescribed for high odds; missing TP flagged.', notes: [
    'High odds when: the ETF zone is at/near a HTF zone that aligns (ETF demand at HTF demand), and/or it aligns with the HTF trend.',
    'Aim for the highest R:R: TP at opposing HTF or ETF zones, or a fixed TP at 1:3 or higher.',
    'You can combine a fixed or zone TP with bumping the stop up with price.',
    'Always keep a TP order in the market in case you cannot manage the trade.',
  ] },
  { pdf: 'Set & Forget', topic: 'Trade management', slide: 'Summary: DO NOT BE GREEDY', where: 'P V', how: 'Over 1.6R target on low odds warns.', notes: [
    'Low odds: still tradeable — lower R:R and/or breakeven sooner.',
    'High odds: higher R:R and wait longer before breakeven.',
  ], rule: 'DO NOT BE GREEDY.' },
  { pdf: 'Set & Forget', topic: 'Plan', slide: 'Step-by-step plan (5 steps)', where: 'P', how: 'The Planner follows it in order.', notes: [
    'A daily plan prevents FOMO and taking setups you normally wouldn\'t.',
    '1. Find zones on your ETF.',
    '2. Identify the HTF trend.',
    '3. Identify the HTF curve (now you know: aggressive or non-aggressive).',
    '4. Place a pending limit order at the ETF zone.',
    '5. Set alerts and manage the trade once the limit order fills.',
  ] },
  { pdf: 'Set & Forget', topic: 'Plan', slide: 'Pros and cons', where: 'G', how: 'Card.', notes: [
    'Pro: more setups than confirmation.',
    'Pro: TP often hit quicker — trading with momentum.',
    'Pro: less confusing — finding ETF zones first keeps it simple.',
    'Pro: counter-trend trades too → more setups, smaller watchlist, more focus.',
    'Con: can feel riskier without confirmation inside a HTF zone — can mess with psychology.',
    'Con: too many setups across many markets → confusion and overtrading.',
  ] },
  { pdf: 'Set & Forget', topic: 'Plan', slide: 'Realistic returns; year one ≈ breakeven', where: 'G', how: 'Returns gauge.', notes: [
    'Ignore "$100 per day", "$5 → $35,541", "95% win rate" marketing.',
    'Aim to match or beat the S&P 500 average return.',
    'In your first year, aim for around breakeven. Be realistic.',
  ] },
];

export const WHERE: Record<string, { label: string; to: string }> = {
  P: { label: 'Planner', to: '/plan/new' }, V: { label: 'Trade verdict', to: '/trades' }, J: { label: 'Journal', to: '/journal' },
  L: { label: 'MAE/MFE lab', to: '/exits' }, G: { label: 'Guru', to: '/guru' }, C: { label: 'Calculator', to: '/calculator?tab=mc' },
};
