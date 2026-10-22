// Sam Seiden - "5 years of supply and demand teaching", original PDF pages 1-80.
// Study notes paraphrased from a full read of every page, including the chart images.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P001: VideoLesson[] = [
 {
  "n": 1,
  "title": "Probability Enhancer (Odds Enhancer Score Sheet)",
  "kind": "article",
  "summary": "XLT class notes that turn level quality into a score: strength of the move away, reward-to-risk, big picture, how many times price has returned, time at the level and the arrival. Each factor gets 0-2 (or 0-1) points, and the total decides whether you use a limit order, a confirmation entry or no trade. Time of day (the first hour) is an extra odds enhancer for short-term traders.",
  "sections": [
   {
    "heading": "Strength of the move away (max 2)",
    "points": [
     "How price left the level tells you how far out of balance supply and demand were there: a fast exit means a large imbalance.",
     "The job is to find the levels where supply and demand are most out of balance; the speed of departure is the biggest clue.",
     "Strongest (2) = one or two very large candles leaving the level; strong (1) = a steady run of mid-size candles; weak (0) = a choppy, overlapping drift with mixed colours."
    ]
   },
   {
    "heading": "Reward/risk (max 2)",
    "points": [
     "Measure how far price travelled from the level before it came back: that is the initial profit margin.",
     "When buying at demand, find the nearest supply. Example: risking 20 cents, the nearest supply must be 60 cents or more away, otherwise skip.",
     "Scoring in the diagrams: 3:1 or better to target 1 = 2 points, 2:1 = 1 point, 1:1 = 0 points.",
     "Levels are everywhere; only take the best ones."
    ]
   },
   {
    "heading": "Big picture (max 2)",
    "points": [
     "Even though most of Sam's trades are intraday, he checks the daily chart for two things: the bigger trend (which side to be on) and where the big-picture supply and demand levels are.",
     "Do not short just above a big-picture demand level; you only know it is there from the higher timeframe.",
     "Shorting on a lower timeframe inside a big downtrend scores 2; shorting inside a bigger uptrend close to big-picture support scores 0 or 1."
    ]
   },
   {
    "heading": "Retracements / tests (max 2)",
    "points": [
     "The first return to a level is the highest-probability entry: first time = 2, second time = 1, third time = 0.",
     "It is motion into mass: the mass is the stack of unfilled orders, and each visit removes some of it.",
     "Chopping-tree analogy: every swing of the axe removes wood, so the more swings, the more likely price goes through."
    ]
   },
   {
    "heading": "Time at level (max 1) and arrival (max 1)",
    "points": [
     "Where the imbalance is greatest, price spends the least time - only a few candles. Long time at a level means equilibrium, which is not where you want to trade.",
     "Do not fix a magic candle count: the count changes with timeframe. Compare time spent at this level with time at other levels on the same chart.",
     "Arrival: price should come back to the level cleanly, without new resistance forming before a buy or new support forming before a sell. A strong arrival usually means a strong departure from the level."
    ]
   },
   {
    "heading": "Total score and entry type",
    "points": [
     "Score 9 or 10: a limit order is acceptable.",
     "Score 8: use a confirmation entry.",
     "Below 7: no trade (the notes list 7 next to 'no trade if less than 7').",
     "Time of day: setups that meet entry in the first 45-60 minutes of the session are usually the best; afternoons are weaker because by then orders are processed and supply and demand are back near balance.",
     "If you do not know what you are doing, do not trade the open; if you do, the open is when most money moves between accounts."
    ]
   },
   {
    "heading": "Charts (score-sheet diagrams, pages 1-2)",
    "points": [
     "'Strength at Origin of Move' panel: demand row shows 2 = two or three tall green candles leaving almost vertically, 1 = a staircase of five medium green candles, 0 = a long mixed red/green drift upward. Supply row mirrors it with red candles.",
     "'Reward to Risk Ratio' panel: each box shows a V-shaped line chart, an entry line on the basing candle, a stop just beyond it, and target 1 at the first opposing level. Strongest box marks 1 unit of risk vs 3 of reward, strong 1 vs 2, weak 1 vs 1. Supply boxes are the same upside down with the stop above.",
     "'Retracement' panel: buy zone (demand) and sell zone (supply) drawn as two horizontal lines under or above a big candle. 'Strongest = 2' shows a yellow tag '1st time to level'; 'Strong = 1' has a blue '1st' bubble where price already touched and a tag '2nd time to level'; 'Weak = 0' shows '1st' and '2nd' bubbles and a '3rd time to level' tag."
    ]
   }
  ],
  "rules": [
   "Score every level on six factors: strength (0-2), reward/risk (0-2), big picture (0-2), retracement count (0-2), time at level (0-1), arrival (0-1).",
   "Total 9-10: limit entry allowed; total 8: confirmation entry only; under 7: no trade.",
   "Require at least 3:1 to the nearest opposing level (e.g. 20 cents risk needs 60 cents of room).",
   "First return = 2 points, second = 1, third = 0.",
   "Check the daily chart for trend and big-picture levels even for intraday trades.",
   "Prefer setups that meet entry in the first 45-60 minutes of the session."
  ],
  "mistakes": [
   "Treating a level with lots of candles as strong - textbooks say more time = stronger, Sam says the opposite.",
   "Fixing a specific basing-candle number regardless of timeframe.",
   "Shorting just above a big-picture demand level because only the small chart was checked.",
   "Trading the third or later return to a level as if it were fresh.",
   "Trading the open without knowing how to read levels."
  ],
  "quotes": [
   "The more quickly they move, the more out of balance they are.",
   "Every swing removes some of the mass.",
   "Morning is the golden opportunity."
  ],
  "diagrams": [
   { "key": "quality", "caption": "Strength of the move away, time at level and freshness decide the score." },
   { "key": "entry-stop-tp", "caption": "Reward-to-risk scoring: 3:1 = 2 points, 2:1 = 1, 1:1 = 0." }
  ],
  "checklist": [
   "Strength of departure scored (2 = one or two large candles).",
   "Nearest opposing level is at least 3x the stop distance away.",
   "Daily trend and big-picture levels checked; not shorting into HTF demand or buying into HTF supply.",
   "This is the first return to the level.",
   "Few candles at the level compared with other levels on the same chart.",
   "No new opposing level formed on the way back.",
   "Total score 9-10 for a limit order, 8 for confirmation, otherwise skip."
  ],
  "journalTags": ["odds-enhancer", "score-sheet", "strength-of-move", "first-return", "time-at-level", "time-of-day"],
  "newVsPdfs": [
   "A numeric 10-point score with explicit cut-offs (9-10 limit, 8 confirmation, under 7 skip); Kevin grades zones by qualifiers but not with this point table.",
   "Reward/risk is itself a zone-quality factor (2/1/0 for 3:1/2:1/1:1), not only a trade filter.",
   "Freshness scored in steps (1st/2nd/3rd visit) rather than tested vs untested only.",
   "'Arrival' factor: no new opposing levels on the way back into the zone.",
   "Time-of-day enhancer: first 45-60 minutes after the open."
  ]
 },
 {
  "n": 5,
  "title": "Trading Notes (XLT)",
  "kind": "article",
  "summary": "Class notes covering the rally-base-drop / drop-base-rally definitions, how to join trends with little risk, Weinstein's four market stages, top-down analysis, not cutting through candles, and the three entry types. Most space goes to how confirmation entries are run mechanically with a trigger price and a stop price.",
  "sections": [
   {
    "heading": "Definitions and trend context",
    "points": [
     "Supply forms as rally-base-drop; demand forms as drop-base-rally.",
     "In an uptrend buy pullbacks to a quality demand level; in a downtrend short rallies into supply; in a sideways market sell rallies into supply and buy pullbacks into demand.",
     "The more often price returns to a level and gets a chance to trade there, the more likely the level breaks (it turns)."
    ]
   },
   {
    "heading": "Four stages of the market (Stan Weinstein, 'Secrets for Profiting in Bull and Bear Markets')",
    "points": [
     "Stage 1: a trading range after a sell-off, read with a 30-week moving average; institutions accumulate while the public sells in pain.",
     "Stage 2: uptrend - prices rise, then range again.",
     "Stage 3 (end of 2007 example): a violent range where institutions sell high to the public, using upgrades and hype so they can unload.",
     "Stage 4: an ugly decline."
    ]
   },
   {
    "heading": "Top-down analysis",
    "points": [
     "Work down from the big picture: monthly, weekly, daily, hourly and 5-minute.",
     "Two reasons: know where you are relative to big-picture support/resistance, and know the bigger trend.",
     "If price cannot rally to test supply, it has no choice but to go back down and test the next demand; if it breaks up, look further left for the next level.",
     "Do not cut through candles when drawing levels - you want the supply/demand equation as it really traded."
    ]
   },
   {
    "heading": "Entries",
    "points": [
     "Most problems blamed on stops or targets are really entry problems; knowing where the turning points are is everything.",
     "Three entry types: limit, confirmation and breakout. Which one to use comes from the odds-enhancer sheet, especially strength of the move.",
     "Confirmation entry: let price enter the level and buy as it leaves; if price goes through the level, cancel.",
     "Many XLT members never take confirmation entries because they only take the strongest setups.",
     "Set a rule for confirmation - e.g. 0.01, 0.05 or 0.10 outside the level, or a trigger inside it. Any rule is fine as long as it is a fixed rule; if the rule kills the reward/risk, skip the trade.",
     "Mechanics: once the trigger is hit, the entry order becomes active. If entry fills first, you are in with your stop; if the stop price is hit before the entry, cancel and never get in."
    ]
   },
   {
    "heading": "Time at level and turning points",
    "points": [
     "Rule of thumb: if a base is just two candles on the 240-minute chart, drop to a smaller timeframe such as 60 minutes to find the base.",
     "Three to six candles is probably the best base on any timeframe, but the key is still a fast exit from the level - no fast exit, no interest.",
     "There are only two reasons for a turn: at a top sellers outnumber buyers (or buyers simply leave), at a bottom buyers outnumber sellers."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "No chart images on these pages - text notes only."
    ]
   }
  ],
  "rules": [
   "Supply = rally-base-drop; demand = drop-base-rally.",
   "Uptrend: buy pullbacks to demand. Downtrend: sell rallies to supply. Range: do both at the edges.",
   "Analyse monthly -> weekly -> daily -> hourly -> 5-minute before trading.",
   "Pick the entry type from the score: strongest levels with limit orders, weaker ones with confirmation.",
   "Confirmation uses a fixed rule (e.g. 0.01/0.05/0.10 beyond the level); skip if it ruins reward/risk.",
   "If the stop price trades before the confirmation entry, cancel the trade.",
   "A 2-candle base on 240-minute: refine on 60-minute; 3-6 candles is the ideal base size."
  ],
  "mistakes": [
   "Drawing support and resistance lines that cut through candles.",
   "Blaming targets or stops when the real problem is a poor entry.",
   "Having no fixed confirmation rule and deciding by feel.",
   "Entering a confirmation trade after the stop level already traded."
  ],
  "quotes": [
   "Understanding where the turning points are is everything.",
   "More important is that you have a rule and make it rule based."
  ],
  "diagrams": [
   { "key": "confirmation", "caption": "Confirmation entry: price enters the level, then you enter as it leaves; cancel if the stop trades first." },
   { "key": "trend-trading", "caption": "Uptrend buy demand pullbacks, downtrend sell supply rallies, range trade both edges." }
  ],
  "checklist": [
   "Top-down done from monthly to entry timeframe.",
   "Stage of the market identified (accumulation, uptrend, distribution, decline).",
   "Base found on a timeframe where it shows 3-6 candles.",
   "Entry type chosen from the score.",
   "Confirmation rule written down before the trade (trigger and offset).",
   "Cancel plan if stop price trades before entry."
  ],
  "journalTags": ["rbd-dbr", "weinstein-stages", "top-down", "confirmation-entry", "entry-types", "base-size"],
  "newVsPdfs": [
   "Weinstein four-stage cycle with a 30-week MA as market-phase context; Kevin uses pure price action.",
   "Breakout entry listed as one of three standard entries.",
   "Confirmation entry defined as a fixed price offset / trigger with a cancel-if-stop-first rule, rather than candle-pattern confirmation on a lower timeframe.",
   "Explicit refine rule: a 2-candle 240-minute base is redrawn on 60-minute; 3-6 candles ideal."
  ]
 },
 {
  "n": 9,
  "title": "A Key Factor for Trade Success",
  "kind": "article",
  "summary": "Defines 'profit margin' as the distance from your entry level to the opposing supply or demand level and makes it the key go/no-go factor: look to your left and require at least 3:1 to the first target. Trading ideas show how a strong initial move away marks a good level, and how buyers chasing after an advance into supply are the people to sell to.",
  "sections": [
   {
    "heading": "Profit margin",
    "points": [
     "Profit margin = the objectively measured distance between the supply (resistance) level and the demand (support) level.",
     "There are only two entry types - the pullback entry and the breakout entry - and both depend on having a profit margin.",
     "Look to your left: before buying make sure supply is far above; before shorting make sure demand is far below.",
     "Sam's minimum: the initial profit margin must be at least 3 times the stop (3:1 to the first target). Price often goes well beyond, but 3:1 gets the trade started in your favour.",
     "Business analogy: a losing trader buys inventory at $4.00 (supply) without research and then finds the market will only pay $3.00 (demand)."
    ]
   },
   {
    "heading": "Reading a level",
    "points": [
     "A strong initial decline from a supply level suggests a large imbalance, so price will likely fall fast on the first revisit.",
     "A level can have a strong move out but still be badly placed on the bigger supply/demand curve - then it is a day-trade bounce, not a swing trade.",
     "A very large level is not always a good thing.",
     "Buyers buying after a large advance and at a level where supply exceeds demand are not consistently profitable traders - take the other side."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "OTA graphic 'Entries: First Pullback / Breakout': left side shows a red/green base between two green lines, a rally to a high (red line), then a pullback into the top green line with an arrow labelled 'Low Risk Entry' and a circled 'Profit Zone' between entry and the red supply line. Right side shows a drop from a red supply band into a green base, a breakout candle above the base marked 'Low Risk Entry', and the circled profit zone up to the red lines.",
     "10-Year Note futures (intraday, 9/20-9/23): supply drawn between about 109'03 and 109'08 (two red lines) at a small base after the opening candles; price then fell hard in several large red candles to about 108'12. It has since climbed back to 108'30.5, just under the zone. The drop from the zone to the low is the initial profit margin, more than 3:1, so short in the supply area.",
     "S&P E-mini (daily, late Aug-early Oct): demand drawn about 1485-1500 (green lines) under a small base before one tall green candle up to roughly 1540; last price 1534.25. Strong move out, but the level sits badly on the bigger curve: fine for a day-trade bounce, not a swing entry.",
     "Newell Rubbermaid NWL (daily, Jun-Sep): wide supply band about 29.1-29.9 drawn across a long June-July range, followed by a large drop to about 24.5 in August. In September price rallied straight back into the band with tall green candles and no basing (28.83). Large level and only average volume, so a watch idea: buyers here are buying after a big advance into supply.",
     "Goldman Sachs GS (daily, Jul-Sep): supply about 219-222 (red lines) at the July top, a long decline to about 160, then a steady recovery. A circle marks large green candles and gap-ups near 190-205 after the advance (last 209.98) - the novice buyers. Plan: sell to them if price reaches the supply level."
    ]
   }
  ],
  "rules": [
   "Before any entry, look left for the opposing level and measure the profit margin.",
   "Initial profit margin must be at least 3x the stop (3:1 to target 1).",
   "Short supply levels that were left with a strong initial decline; buy demand left with a strong rally.",
   "A level badly placed on the higher-timeframe curve is a day trade only, not a swing trade."
  ],
  "mistakes": [
   "Entering without checking how far the opposing level is.",
   "Buying after a large advance and into supply (the novice buyer).",
   "Assuming a large-range level is automatically strong.",
   "Swing trading a level that is badly placed on the big-picture curve."
  ],
  "quotes": [
   "All you have to do is look to your left.",
   "The initial profit margin must be at least 3 times the stop."
  ],
  "diagrams": [
   { "key": "entry-stop-tp", "caption": "Profit margin: distance from entry zone to the opposing zone, at least 3x the stop." }
  ],
  "checklist": [
   "Opposing level found to the left and distance measured.",
   "Profit margin at least 3:1 to the first target.",
   "Strong initial move out of the level.",
   "Level is well placed on the bigger picture if this is a swing trade.",
   "Price is returning after a run (others are chasing) and this is the first visit."
  ],
  "journalTags": ["profit-margin", "look-left", "3-to-1", "novice-buyer", "curve-location"],
  "newVsPdfs": [
   "'Profit margin' framed as the distance between opposing zones measured before entry; Kevin uses 3:1 too but Seiden makes it the main pass/fail filter for both pullback and breakout entries.",
   "Distinguishes levels good for a day-trade bounce but not a swing because of curve location."
  ]
 },
 {
  "n": 14,
  "title": "Success in the 30-Year Bond",
  "kind": "article",
  "summary": "Follow-up on a 30-year bond supply level from the previous letter that triggered right away and paid about 3:1 on the first day. The lesson: level quality is judged mainly by how price first left the level - strong exit means large imbalance, slow drift means a smaller one. Trading ideas cover the Russell, SMH and silver.",
  "sections": [
   {
    "heading": "Quality of a level",
    "points": [
     "One of the most important features of a quality level is how price originally left it.",
     "A strong move away from an area of apparent equilibrium happens because there is a large supply/demand imbalance there.",
     "If price slowly drifts away, the level can still be traded, but the imbalance is smaller.",
     "The higher the imbalance, the higher the probability the trade works."
    ]
   },
   {
    "heading": "Using a sector chart as a guide",
    "points": [
     "The distance between an unvisited supply level above and an unvisited demand level below is the profit margin.",
     "An ETF chart such as SMH can be traded directly and also used as a guide for the sector's stocks (XLNX, NVLS, KLAC, NSM)."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "30-Year Bond futures (intraday, 9/6-9/14): rally from about 111 28/32 to 114, a topping range, then a drop and a small base around 113 12/32-113 18/32 marked with red lines and the label 'Last weeks supply level (sell short)'. Price fell from it to about 112 16/32, rallied back into the zone, and was rejected with a tall red candle (now 112 27/32) - the trade that paid about 3:1.",
     "Russell futures ER2 (intraday, 9/5-9/17): supply labelled about 795-802 (red lines) at a small base right after a drop from about 810; price then gapped and fell to about 767 on 9/10 and has recovered to 789.30 just under the zone. Strong initial decline = strong imbalance; short-term shorts there. Note Russell is $100 per point per contract.",
     "SMH semiconductor ETF (daily, Apr-Sep): demand labelled about 34.2-34.9 at an April base before a strong rally; supply labelled about 37.8-38.3 at a small September base below a lower high. Price is 37.14, and the large gap between the two unvisited levels is circled and labelled 'Profit Margin'.",
     "Silver futures (daily, late Jul-Sep): supply about 13.00-13.20 (red, top base) followed by a collapse to about 11.50; demand about 11.85-12.15 (green) at a late-August base before a rally to 12.745. Buy the first pullback to demand with a protective sell stop just below the level; it is well placed on the curve and has a decent profit margin."
    ]
   }
  ],
  "rules": [
   "Judge a level mainly by the strength of the original move away from it.",
   "Trade the first pullback to the level, with the stop just beyond it.",
   "Use sector ETF levels to time trades in that sector's stocks.",
   "Size for the contract value (Russell: $100 per point) and keep risk low."
  ],
  "mistakes": [
   "Treating a level that price slowly drifted away from as equal to one with a violent departure.",
   "Ignoring contract size in fast markets."
  ],
  "quotes": [
   "The higher the imbalance at the level, the higher the probability of the trade working out well."
  ],
  "diagrams": [
   { "key": "quality", "caption": "Strong departure from the base = large imbalance = higher-probability level." }
  ],
  "checklist": [
   "Departure from the level was strong, not a slow drift.",
   "Level is unvisited.",
   "Opposing unvisited level gives a large profit margin.",
   "Stop just beyond the zone.",
   "Position size fits the contract's point value."
  ],
  "journalTags": ["level-quality", "strong-departure", "bonds", "sector-etf", "first-pullback"],
  "newVsPdfs": [
   "Using a sector ETF's zones as a guide for individual stocks in that sector.",
   "Distinguishes 'slow drift' levels as tradeable but lower-odds, rather than invalid."
  ]
 },
 {
  "n": 17,
  "title": "A Lesson on Supply and Demand",
  "kind": "article",
  "summary": "Explains why Sam focuses on turning points instead of joining trends late or buying breakouts: the turning-point trader earns his money from late trend-followers and breakout buyers. The QQQQ supply short shows how entering at the level gives a stop very close to entry and a maximal profit margin. He also argues for price-only analysis because indicators lag.",
  "sections": [
   {
    "heading": "Why trade turning points",
    "points": [
     "When you buy, many others must buy after you at higher prices for you to profit; when you short, others must sell after you lower.",
     "The trader who picks turning points with simple supply/demand rules usually takes money from those who enter trends late and from breakout traders who buy after buying and sell after selling.",
     "Entering at the pre-determined turning point gives a short entry very close to the protective stop and far from demand targets.",
     "The longer you wait and let price drop before shorting, the more risk rises and the profit margin shrinks. Prefer a low-risk entry at supply over lots of confirmation."
    ]
   },
   {
    "heading": "Big-picture context and price only",
    "points": [
     "Always check supply and demand on a big-picture chart (e.g. monthly) to put things in perspective.",
     "If price has not been able to even reach a big supply level, there is plenty of supply there and a turn lower is likely before any break through.",
     "Use price alone: all influences on price are already reflected in price, and anything added (e.g. a moving average) lags, which adds risk. Indicators can be used, but there is a right and wrong way."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "QQQQ (intraday, 7/23-9/7): supply about 50.00-50.30 (red lines) from the late-July top, after which price fell to about 45 on 8/16. Price rallied back and the 'Short Entry' label sits at the first touch of 50.00 on 9/5; price then fell about $2 and gapped down toward 48 (now 49.12). 'Supply Level' is labelled at the left origin.",
     "NASDAQ futures NQ (monthly, 2001-2007): supply level drawn about 2,100-2,250 at the start of the chart; a circle marks the sharp drop out of it in 2002 down to about 1,100. Price has climbed back for years to about 2,025 but has never re-entered the zone - lots of supply waits there, so long-term low-risk buys are lower.",
     "30-Year Bond futures (intraday, 8/24-9/13): demand (support) about 110 24/32-111 at a late-August base before the rally; supply (resistance) about 113 4/32-113 8/32 at a small base after the top near 114. Price sits at 112 22/32 between them and the circled gap is labelled 'Profit Margin' - both levels to be traded the first time price revisits them."
    ]
   }
  ],
  "rules": [
   "Enter at the pre-planned level, not after the move has started.",
   "Prefer the lowest-risk entry at the zone over extra confirmation lower down.",
   "Check the monthly chart for big supply/demand before taking longer-term trades.",
   "Use price as the primary input; treat lagging indicators as secondary."
  ],
  "mistakes": [
   "Joining a trend well after it is under way.",
   "Buying breakouts after a period of buying.",
   "Waiting for lots of confirmation, which increases risk and cuts reward.",
   "Relying on lagging indicators for entry decisions."
  ],
  "quotes": [
   "The longer you wait and let prices decline before selling short, the more risk is increasing.",
   "Any and all influences on price are reflected in price."
  ],
  "diagrams": [
   { "key": "mtf", "caption": "Monthly supply caps the market; check the big picture before buying." },
   { "key": "entry-stop-tp", "caption": "Short at supply: stop just above, target at the demand below." }
  ],
  "checklist": [
   "Entry is at the level, not after a run away from it.",
   "Stop is close (just beyond the zone).",
   "Profit margin to the opposing level is still large.",
   "Monthly/weekly picture does not put a big opposing level close by."
  ],
  "journalTags": ["turning-points", "low-risk-entry", "price-only", "big-picture", "profit-margin"],
  "newVsPdfs": [
   "Explicit argument that the zone trader's profit comes from late trend-followers and breakout traders.",
   "Monthly-chart zone that price has never re-entered used as a reason to expect a turn there."
  ]
 },
 {
  "n": 20,
  "title": "What Happens When You Stick To the Rules",
  "kind": "article",
  "summary": "Sam credits his success to having mechanical rules based on supply and demand and actually following them. A mentoring student's AAPL day-trade short shows the method: find a supply and demand pair with a good profit margin, short at supply before the big red candle and cover at demand. Trading ideas in QQQQ, CEPH and EUR/USD repeat the first-revisit rule.",
  "sections": [
   {
    "heading": "Rules and following them",
    "points": [
     "Two reasons for Sam's success: a mechanical, objective rule set based on supply and demand, and learning to actually follow those rules.",
     "Most mentoring time is spent identifying true supply and demand in any market and timeframe."
    ]
   },
   {
    "heading": "The student's AAPL short",
    "points": [
     "He first found a demand and supply pair with an ideal profit margin, then shorted right at supply and covered at demand.",
     "The low-risk entry matters more than the gain: shorting at supply, before a big red candle, puts you first in line, close to the buy stop and far from demand.",
     "The more you let price drop before shorting, the higher the risk and the lower the reward, so do not wait.",
     "Nobody knows for sure a level will turn; we only stack the odds with objective information.",
     "The buyer he sold to made the two novice mistakes: buying after a move up, and buying where supply was already known to exceed demand."
    ]
   },
   {
    "heading": "Zones and first revisits",
    "points": [
     "Levels are zones, areas to buy and sell, not single lines.",
     "Take positions the first time price revisits: risk is lowest and reward highest; each further pullback lowers the probability."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "AAPL day trade (OTA student trade, intraday 8/28-8/29): 'Resistance (supply)' about 133.0-133.4 drawn from a small base on 8/28 morning, after which price free-fell to about 127.3. Next day price gapped up; 'Support (demand)' is drawn about 131.5-131.9 at the morning base. 'Sold short' arrow at the first return into supply near 133; a circle shows the drop and 'Covered' arrow at the demand line; the space between them is labelled 'Profit Margin'.",
     "QQQQ ETF (intraday, 7/23-early Sep): supply about 50.0-50.3 (red lines) at the left; a small demand zone (green lines) about 48.8-49.0 near the current price of 49.35 after the late-August rally. Both are the nearest levels to trade on first revisit.",
     "CEPH (intraday, 7/23-early Sep): 'Resistance (supply)' about 78-80 at the top-left base, then a dramatic decline including a gap to about 69. Price has climbed steadily back to about 75.5 and is nearing the zone - plan to short the first revisit, selling to buyers who buy after an advance.",
     "EUR/USD cash forex (intraday, 9/3-9/4): supply about 1.3610-1.3627 (red lines) at a sideways base after a fall from 1.3650, followed by a strong drop with large red candles to about 1.3555 (now 1.35691). Day traders can short the first return intraday."
    ]
   }
  ],
  "rules": [
   "Find the supply/demand pair first; only trade if the profit margin between them is ideal.",
   "Short at supply before the big red candle forms; do not chase lower.",
   "Exit at the opposing demand level.",
   "Only trade the first revisit of a level."
  ],
  "mistakes": [
   "Waiting for a large red candle before shorting.",
   "Being impressed by the gain instead of the low-risk entry.",
   "Buying after a move up and into known supply.",
   "Trading second or third pullbacks into the same zone."
  ],
  "quotes": [
   "It is one thing to have rules and another thing to actually follow rules.",
   "It allows us to be first in line at the right time."
  ],
  "diagrams": [
   { "key": "entry-stop-tp", "caption": "Short at supply, cover at demand - the profit margin between the two zones." }
  ],
  "checklist": [
   "Supply and demand pair identified with a large profit margin.",
   "First revisit of the entry zone.",
   "Entry placed at the zone, stop just beyond.",
   "Target = opposing zone.",
   "Rules written down and followed without changes."
  ],
  "journalTags": ["rule-discipline", "day-trade", "first-revisit", "zone-to-zone", "novice-mistakes"],
  "newVsPdfs": [
   "Day-trade framework of shorting supply and covering exactly at the next demand (zone-to-zone targeting) shown on a real student trade."
  ]
 },
 {
  "n": 25,
  "title": "Important Rules to Follow",
  "kind": "article",
  "summary": "A short list of day-trading rules: trade only at supply or demand, use two entry types (breakout and first pullback), mark one supply and one demand level per market each day on a larger intraday timeframe, demand 3:1 to target 1, pre-set entry/stop/targets, and ignore news and lagging indicators. Trading ideas show a Russell cluster, EUR/GBP and the 10-year note.",
  "sections": [
   {
    "heading": "Day-trading rules",
    "points": [
     "Only enter when price is at a support (demand) or resistance (supply) level, at any time of day or night.",
     "Two types of entries: breakouts and first pullbacks.",
     "Each day, mark one demand and one supply level per market on a larger intraday timeframe, and always know where the market sits in the larger picture.",
     "Only trade opportunities with at least a 3:1 profit zone to the first target.",
     "Pre-plan and pre-set entry, stop and target(s).",
     "Do not get fooled by news, lagging indicators or subjective information - all influences are reflected in price.",
     "Emotion will have day traders buying and selling at the wrong time, so self-control to follow rules is essential."
    ]
   },
   {
    "heading": "What makes either entry work",
    "points": [
     "The first pullback entry is lower risk and higher reward, though many people are uncomfortable with it; breakouts are fine when done properly.",
     "Two conditions: the level must be fresh (price has not revisited it), and the profit zone must be significant - there must be room to move after you enter.",
     "A cluster of trading that looks like equilibrium becomes supply once price declines from it; the decline can only mean supply exceeded demand."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "Entries graphic (First Pullback vs Breakout) repeated: first pullback buys the return to the top of the demand base after a rally; breakout buys the candle closing above a base that formed after a drop; both show a circled 'Profit Zone' up to the red supply lines.",
     "Russell 2000 futures (intraday, 8/28-8/29): after a drop from about 795, a long cluster around 776-782 is circled; price then broke down to about 769.90. The circled cluster is the first supply level above - short the first rally back into it.",
     "Euro/Pound cash forex (intraday, 8/29): supply about 0.6788-0.6795 (red lines) at a small top base, then a dramatic slide to about 0.6765; price has stabilised and found demand, now 0.67725. Very active non-dollar pair, called ideal.",
     "10-Year Note futures (intraday, 8/24-8/30): demand (green lines) about 108'22-108'27 at a 8/27 base, followed by a strong rally and a gap to about 109'24 (now 109'18.5). Nearest demand below price; buy the first revisit."
    ]
   }
  ],
  "rules": [
   "Enter only at a supply or demand level.",
   "Use only two entries: first pullback or breakout.",
   "Each day mark one supply and one demand per market on a larger intraday timeframe.",
   "Minimum 3:1 profit zone to the first target.",
   "Set entry, stop and targets before price arrives.",
   "Level must be fresh (unvisited) for either entry type."
  ],
  "mistakes": [
   "Trading in the middle, away from any level.",
   "Being moved by news, lagging indicators or opinions.",
   "Entering a breakout with no room before the next level.",
   "Making decisions in real time instead of pre-setting orders."
  ],
  "quotes": [
   "Price is all we need.",
   "There must be room for price to move after you enter."
  ],
  "diagrams": [
   { "key": "sequence", "caption": "Daily routine: mark one supply and one demand per market on a larger intraday timeframe, pre-set the orders." }
  ],
  "checklist": [
   "Price is at a marked supply or demand level.",
   "Level is fresh.",
   "Entry type is first pullback or breakout.",
   "At least 3:1 to target 1.",
   "Entry, stop and target pre-set.",
   "No news-based or indicator-based reason for the trade."
  ],
  "journalTags": ["day-trading-rules", "pre-plan", "fresh-level", "breakout-entry", "first-pullback", "ignore-news"],
  "newVsPdfs": [
   "Breakout entries are one of the two standard entries (Kevin's notes mention breakout trades only occasionally).",
   "Routine of marking only one supply and one demand per market per day from a larger intraday timeframe."
  ]
 },
 {
  "n": 29,
  "title": "Take Advantage of the Equity Market Volatility!",
  "kind": "article",
  "summary": "With volatility high, Sam explains why price alone is enough: all news, reports, tips, upgrades and indicators pass through each person's belief system into a buy or sell action at a price. Trading ideas show a daily Dow demand level formed by a gap, intraday Dow and QQQQ supply levels, and a USD/JPY swing short.",
  "sections": [
   {
    "heading": "Any and all influences on price are reflected in price",
    "points": [
     "Earnings, news, financial statements, Fed announcements, economic reports, terror alerts, tips, brokers, upgrades/downgrades, analyst opinions and technical indicators all become thoughts and perceptions.",
     "Everyone filters the same information through their own belief system, so perceptions differ.",
     "Perceptions lead to action, and in markets action is only buying or selling at a specific price - so price is all the consistently profitable trader needs.",
     "Adding other information distorts what is real according to supply and demand."
    ]
   },
   {
    "heading": "Novice action to fade",
    "points": [
     "At a demand level after a decline, sellers are selling after a decline and where demand exceeds supply - buy from them.",
     "At a supply level after a rally, buyers are buying after a rally and where supply exceeds demand - sell to them.",
     "In high volatility a supply level that seems far away can be reached quickly.",
     "Always size positions so you only risk the percentage of capital you are comfortable with."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "Diagram 'Any and all influences on price are reflected in price': a list (earnings report, news, income statement, balance sheet, Fed announcement, economic report, terrorist alert/attack, trading/investing tip, broker, upgrade/downgrade, analyst opinion, technical indicators) braces into 'Thoughts and Perceptions', which braces into 'ACTION: Buy or Sell'.",
     "DOW Mini CBOT futures (daily, Apr-Aug, with volume): demand (green lines) about 12,900-12,990 at a two-candle base in late April, which then gapped up and trended to the all-time high near 14,000. Price has dropped to 13,237 with rising volume; no buying until price reaches the demand lines.",
     "DOW Mini intraday (8/9-8/13, with volume): supply about 13,480-13,550 (red lines) at a small base, followed by a steep drop in large red candles to about 13,110. Price is back near 13,245; day traders short the zone if volatility brings price there.",
     "QQQQ intraday (8/9-8/13, with volume): supply about 48.12-48.33 (red lines) at a small base after an opening drop; price then fell to about 46.7 and is at 47.38. Shorting opportunity for traders who do not trade futures.",
     "USD/JPY cash forex (daily, Jul-Aug): supply about 121.65-122.6 (red lines) at a mid-July base after a tall red candle from about 123.4; a sharp slide followed to about 117.2 (now 118.207). Far from price but well placed on the big-picture curve - swing short with a very large profit margin."
    ]
   }
  ],
  "rules": [
   "Base decisions on price and supply/demand levels, not on the information that moved perceptions.",
   "Wait for price to reach the level; do not buy a falling market above demand.",
   "Size every position to a fixed percentage of capital at risk.",
   "Distant but well-placed levels are swing trades with large profit margins."
  ],
  "mistakes": [
   "Assuming everyone interprets news the same way you do.",
   "Letting news or tips drive buy/sell decisions.",
   "Buying in a decline before demand is reached."
  ],
  "quotes": [
   "Price is all the consistently profitable trader and investor needs to focus on.",
   "Any and all influences on price are reflected in price."
  ],
  "diagrams": [
   { "key": "mindset", "caption": "Information -> beliefs/perceptions -> buy or sell action at a price; trade the price." }
  ],
  "checklist": [
   "Trade reason is a price level, not news or a tip.",
   "Level formed with a strong departure (gap or large candles).",
   "Price has actually reached the level.",
   "Position size within your max risk percent."
  ],
  "journalTags": ["price-only", "beliefs", "volatility", "gap-demand", "position-sizing", "swing-short"],
  "newVsPdfs": [
   "A gap away from a base counts as the strongest form of departure for a demand level.",
   "Belief-system model (information -> perception -> action) as the reason to ignore news."
  ]
 },
 {
  "n": 33,
  "title": "Online Trading Academy Futures",
  "kind": "article",
  "summary": "Applies the A-B-C logic to futures: A is a pause that looks like equilibrium, B is the move away that proves A was out of balance, C is the first return and the low-risk entry. Trading ideas give exact zones, entries and stops for the S&P E-mini, Canadian dollar and crude oil shorts, which are taken as swing trades because they sit high on the curve.",
  "sections": [
   {
    "heading": "The A-B-C logic of a level",
    "points": [
     "A: temporary price stability that looks like supply/demand equilibrium.",
     "B: the rally (or drop) away from A; it proves A was really a level where demand (or supply) greatly exceeded the other side.",
     "News that comes with B adds nothing that price is not already telling you.",
     "C: the first revisit of A, where price meets a level of large imbalance - the low-risk, high-reward entry.",
     "A dramatic B suggests a similar reaction at C."
    ]
   },
   {
    "heading": "Entry and stop mechanics from the trading ideas",
    "points": [
     "Let price trade into the supply level and then short if and when it declines from the level (a confirmation-style entry just under the zone).",
     "Place the stop just above the supply level.",
     "The closer the entry to the stop, the larger the position you can hold while risking very little capital.",
     "Levels high on the big-picture curve have huge profit margins, so treat them as swing trades rather than day trades.",
     "Sam trades over 30 futures markets with a mechanical rule set."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "S&P demand example (intraday, 4/20-4/25): A = small flat base about 1479.5-1481.5 (green lines); B = bracketed rally to about 1494; C = a sharp drop on 4/24 back into the zone (about 1480) that reversed immediately; price then rallied to 1502.50.",
     "S&P supply example (intraday, 9:30-13:30): A = base about 1452.7-1454 (red lines) at the open; B = bracketed drop to about 1447.5; price ranged back up and C = the first revisit near 1453 around 12:00-12:30, after which it fell to about 1446.",
     "S&P E-mini CME (intraday, 7/30-8/6): 'Supply' arrow at a small base; zone 1465-1471.50 (red lines). Sharp decline to 1443.25 followed. Plan: let price rally into the zone and short as it declines from it (about 1464 or higher), stop 1472; demand lower near 1430.",
     "Canadian Dollar CME futures (intraday, 8/4-8/5): huge green spike from about .9470 to .9530, then a base about .9500-.9511 (red lines) and a drop to .9469. Zone .9500-.9515, entry about .9495-.9498 as price declines from it, stop .9517. High on the curve plus dramatic drop = swing trade.",
     "Crude oil NYMEX (intraday, 8/2-8/5): after a range near 77, price dropped through a small base around 75.75-76.15 (red lines) to 75.20. Zone 75.85-76.30, entry about 75.80-75.85 on decline from the level, stop 76.35. High on the curve, so swing rather than day trade."
    ]
   }
  ],
  "rules": [
   "Level = pause (A) + strong move away (B); entry on the first return (C).",
   "Let price trade into the zone, enter as it leaves the zone (just below supply / just above demand).",
   "Stop just beyond the zone (e.g. S&P supply 1465-1471.50 -> stop 1472).",
   "Levels high/low on the big-picture curve: manage as swing trades.",
   "Use the tight entry-to-stop distance to size up while risking little."
  ],
  "mistakes": [
   "Believing the news explains the move rather than the imbalance.",
   "Shorting far below supply after the drop is under way.",
   "Day trading a level that offers a swing-size profit margin."
  ],
  "quotes": [
   "News and everything else that accompanies the price action does not offer any benefit that price is not already telling us.",
   "The closer our entry is to our stop, the larger the position size we can have."
  ],
  "diagrams": [
   { "key": "zone-anatomy", "caption": "A = basing pause, B = strong move away, C = first return entry." },
   { "key": "confirmation", "caption": "Let price trade into the zone, then enter as it declines from it; stop just beyond the zone." }
  ],
  "checklist": [
   "A (pause) and B (strong departure) identified.",
   "This is C, the first return.",
   "Entry just outside the zone in the trade direction after price trades in.",
   "Stop just beyond the far side of the zone.",
   "Curve location checked: day trade or swing trade.",
   "Position size computed from entry-to-stop distance."
  ],
  "journalTags": ["abc-logic", "first-return", "futures", "swing-vs-day", "position-size", "exact-levels"],
  "newVsPdfs": [
   "A-B-C labelling for every zone (pause, departure, first return).",
   "Entry placed a few ticks outside the zone after price trades into it (e.g. S&P 1464 under a 1465-1471.50 zone) - a hybrid between limit and confirmation.",
   "Curve location decides whether a trade is managed as a day trade or a swing trade."
  ]
 },
 {
  "n": 39,
  "title": "New Newsletter for Online Trading Academy Swing Traders",
  "kind": "article",
  "summary": "A Disney swing short shows the A-B-C logic on a daily chart, and introduces moving-average crosses as a guide: the first return to the point where averages crossed often holds supply or demand. Trading ideas give semiconductor shorts (SMH as a guide, NVLS with exact entry/stop/objective) and an IBM demand buy.",
  "sections": [
   {
    "heading": "Disney (DIS) swing short",
    "points": [
     "Area A was stable, then a steep decline B followed, so A had more supply than demand.",
     "The first revisit of A means buyers buying after an advance and into supply - be the seller to them.",
     "The two moving averages crossed at the origin of the imbalance; this happens most of the time and has to, if you think about it.",
     "After meeting entry, price fell to the first target. The trade was planned on objective, mechanical rules."
    ]
   },
   {
    "heading": "Moving-average lesson",
    "points": [
     "The first time price revisits a moving-average cross, there is often supply or demand in that area.",
     "When averages cross, extend a line to the right and wait for price to come back to it.",
     "Used correctly, averages are guides to true support and resistance, not the textbook definitions."
    ]
   },
   {
    "heading": "Sector and stock plans",
    "points": [
     "Use SMH's supply as a guide: short semiconductor stocks if the sector rallies into its level.",
     "Highest-probability when both the stock and its sector ETF reach supply together.",
     "NVLS: short 31.00-31.35, stop 31.46, initial profit objective 1.50-3.00.",
     "IBM (strong during the market decline): buy 108.10-109.10, stop 107.75, initial objective 3.00-6.00."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "Walt Disney DIS daily 'Before': supply A about 35.2-35.9 (two red lines) at a small base, bracket B shows the steep drop to about 33.4, a circle marks where the two moving averages (grey and pink) cross right at the zone, and C (dashed box) marks the expected first revisit at the right edge.",
     "DIS daily 'After': price came back into the red lines in July, stalled, and then dropped in tall red candles toward about 33.9 - the first target.",
     "SMH (intraday, 7/23-7/30): supply about 39.10-39.45 (red lines) at a 7/24-7/25 base, then a steady slide to 37.73.",
     "NVLS (intraday, 7/23-7/30): 'Resistance (supply)' about 31.00-31.30 at a small base before a big red drop; price slid to 28.62. Short 31.00-31.35, stop 31.46.",
     "IBM (daily, Jul-Aug): 'Support (demand)' about 108-109.7 (green lines) at a mid-July base of small candles, followed by a gap up to about 118 (now 115.62). Buy 108.10-109.10, stop 107.75."
    ]
   }
  ],
  "rules": [
   "Short the first revisit of a base that was followed by a steep decline (and vice versa for demand).",
   "A moving-average cross can mark the origin of a level; extend it right and wait for the first return.",
   "Prefer stock trades when the sector ETF is at a matching level.",
   "Write every idea as entry zone, stop just beyond, and initial profit objective."
  ],
  "mistakes": [
   "Using textbook support/resistance definitions instead of imbalance origins.",
   "Buying because a moving average 'turned up' at a level where supply exceeds demand."
  ],
  "quotes": [
   "When moving averages cross, simply extend a trend line to the right and wait for price to come back to that level."
  ],
  "diagrams": [
   { "key": "zone-anatomy", "caption": "Base A, steep drop B, first revisit C - the swing short in DIS." }
  ],
  "checklist": [
   "Base followed by steep move away identified.",
   "First revisit only.",
   "Sector ETF also at a level in the same direction (bonus).",
   "Entry range, stop and initial objective written before the open."
  ],
  "journalTags": ["swing-trade", "ma-cross", "sector-confluence", "abc-logic", "exact-levels"],
  "newVsPdfs": [
   "Moving-average crosses used as a locator for zone origins; Kevin trades with no indicators.",
   "Sector ETF + stock confluence as a probability booster.",
   "Profit objective given as a dollar range (e.g. 1.50-3.00) rather than the next zone alone."
  ]
 },
 {
  "n": 42,
  "title": "Are You Prepared to Trade in 2008?",
  "kind": "article",
  "summary": "A new-year checklist of questions every trader should answer before risking money - plan, discretion, objectivity, quantifying supply and demand, and reviewing results. Market review shows why a support level that has been revisited many times is getting weaker, and uses the 200-day moving average as trend context.",
  "sections": [
   {
    "heading": "Five questions",
    "points": [
     "Do you have a trading plan, and do you stick to it?",
     "Is there discretion in your plan? Discretion means unanswered questions; turn them into rules.",
     "Is your analysis objective or partly subjective?",
     "Can you quantify supply and demand, or do you rely on a lagging indicator that leads to high-risk, low-reward trades?",
     "Have you reviewed your results - average win vs average loss and win percentage?",
     "As an educator: do not trade until these are handled. The novice trader almost always funds the consistently profitable one."
    ]
   },
   {
    "heading": "Weakening support",
    "points": [
     "Each revisit of a support level lets more of the waiting buyers fill, so the support gets weaker, not stronger.",
     "The better buy is at the origin of the demand that has not been revisited yet.",
     "A down-sloping 200 MA confirms a downtrend, which makes shorting at resistance acceptable.",
     "Long-unvisited demand below a falling market can be used to time longer-term buys in that sector."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "SPY (S&P ETF, weekly, 2006-2008): 'Support 1' about 137 drawn from a small base during the 2006 rally; price has come back to it several times (wicks touching in 2007). 'Support 2' about 129-132 (two green lines) at the earlier origin of the rally, still unvisited, with the rising 200 MA reaching it around 129. Price is 144.93.",
     "QQQQ (NASDAQ ETF, intraday, 12/11-12/20): 'Resistance' about 51.10-51.55 (red lines) at a 12/13-12/14 base after a fall from about 52.7, with a down-sloping 200 MA running through the zone. A dramatic drop to about 49.2 followed; price is 49.92. Swing and day traders can short the range.",
     "XLF (Financial Service ETF, weekly, 2003-2008): 'Support' about 25.0-26.2 (green lines) from the 2003 base at the start of the multi-year uptrend; the 200 MA rises below the trend. Price has fallen fast from about 38 to about 29, below the 200 MA, toward the unvisited demand."
    ]
   }
  ],
  "rules": [
   "Have a written plan with no discretion left in it.",
   "Use objective supply/demand analysis instead of lagging indicators.",
   "Review average win, average loss and win rate regularly.",
   "Avoid buying a support that has been revisited many times; prefer the unvisited origin below.",
   "Short resistance when the 200 MA slopes down (trend filter)."
  ],
  "mistakes": [
   "Starting the year by increasing size without fixing process.",
   "Trading with discretionary, subjective decisions.",
   "Thinking repeated tests make support stronger.",
   "Rushing back into thin holiday markets."
  ],
  "quotes": [
   "It is best to turn those questions into RULES.",
   "Support is getting weaker, not stronger."
  ],
  "diagrams": [
   { "key": "zone-removed", "caption": "Each revisit absorbs buyers - a support tested many times is weakening." },
   { "key": "mindset", "caption": "Plan, no discretion, objective analysis, reviewed statistics." }
  ],
  "checklist": [
   "Written trading plan exists and is being followed.",
   "No discretionary decisions left in the plan.",
   "Level is the unvisited origin, not a level touched several times.",
   "Trend context (e.g. 200 MA slope) agrees with direction.",
   "Results reviewed: average win/loss and win rate."
  ],
  "journalTags": ["trading-plan", "no-discretion", "weakening-support", "200-ma", "results-review"],
  "newVsPdfs": [
   "200 MA used as a trend filter and as confluence at a demand origin; Kevin uses no indicators.",
   "Review of average win/average loss and win rate as a pre-trading requirement."
  ]
 },
 {
  "n": 46,
  "title": "Trading and Time",
  "kind": "article",
  "summary": "The XLF reached a demand level from 2003 and gained $2 in two days; Sam explains trade management and answers whether a level that old can matter. Markets are always in one of three states, and old levels are often better because price returning to them is far from equilibrium, giving large profit margins.",
  "sections": [
   {
    "heading": "Managing the XLF trade",
    "points": [
     "After a $2 gain in two days you can move the stop to breakeven and consider taking some or all off near the nearby supply (the circled area).",
     "The gain is nice, but the low-risk entry is the key point - getting gains is one thing, getting them with the lowest possible risk is another."
    ]
   },
   {
    "heading": "Three states of a market",
    "points": [
     "Demand exceeds supply: competition to buy, prices rise.",
     "Supply exceeds demand: competition to sell, prices fall.",
     "Equilibrium: everyone can trade as much as they want; moving away from it increases competition, which forces price back. At equilibrium there is little or no opportunity."
    ]
   },
   {
    "heading": "Old levels",
    "points": [
     "A demand level from 2003 is not less relevant than one from last week; old levels usually produce better trades.",
     "When price comes back to a level from long ago it is far from equilibrium, so the level is ideally placed on the curve with a large profit margin.",
     "They are not the same buyers from 2003 - it is pure supply and demand: lower prices attract more buyers, higher prices attract more sellers.",
     "Not every cluster is a level and not every high or low is a level; it takes objective rules."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "XLF (Financial Service Sector ETF, weekly, 2003-2008): 'Demand (support)' about 25.0-26.0 at the 2003 base. Price rose to about 38 in 2007 and then crashed; an arrow labelled 'Low Risk High Reward Buying Opportunity' points to the touch of the zone near 26 in early 2008. A small circle near 29 marks nearby supply where profits can be taken; price is 27.41.",
     "Stick-figure supply/demand curve: red sellers grow in number with price (3 at 40, 7 at 50, 14 at 60) and green buyers grow as price falls (3 at 30, 7 at 20, 13 at 10). It is a chart with time removed, showing the number of willing buyers and sellers at each price."
    ]
   }
  ],
  "rules": [
   "Once in profit, move the stop to breakeven and take some or all near the next opposing level.",
   "Do not discard a level because it is old; old untouched levels often offer the biggest profit margins.",
   "Trade only when price is far from equilibrium."
  ],
  "mistakes": [
   "Judging the trade by the gain instead of the entry risk.",
   "Ignoring old higher-timeframe levels as irrelevant.",
   "Trading in equilibrium where there is no opportunity."
  ],
  "quotes": [
   "At equilibrium, there is little to no trading opportunity.",
   "Obtaining them with the lowest possible risk is another story."
  ],
  "diagrams": [
   { "key": "mtf", "caption": "An old weekly demand far from current equilibrium offers a large profit margin." }
  ],
  "checklist": [
   "Level is unvisited, regardless of its age.",
   "Price is far from equilibrium (good curve location).",
   "Exit plan: breakeven stop after a solid move, partials at the next supply.",
   "Opposing level marked for profit taking."
  ],
  "journalTags": ["old-levels", "equilibrium", "trade-management", "breakeven", "curve-location"],
  "newVsPdfs": [
   "Explicit claim that older untouched levels tend to give better trades than recent ones.",
   "Market-states model (demand > supply, supply > demand, equilibrium) and the time-removed supply/demand curve picture."
  ]
 },
 {
  "n": 49,
  "title": "Find The Novice Trader",
  "kind": "article",
  "summary": "Profitable trading means finding the novice trader and taking the other side. Novices make two mistakes: they buy after buying and sell after selling, and they buy into supply and sell into demand. Sam walks through a chart where a range breaks, a rally on above-average volume returns to the range, and a confirmation candle gives the short, then tells his CME pit story.",
  "sections": [
   {
    "heading": "The two novice mistakes",
    "points": [
     "Buying after a period of buying (late, high risk) and selling after a period of selling.",
     "Buying into resistance (supply) and selling into support (demand) - always a low-odds trade.",
     "In the pit story the novice was also buying in a market whose average price was falling (downtrend), making the odds even worse.",
     "Focus on what the masses do wrong; Plato and Aristotle found the right answers by finding every way to fail first."
    ]
   },
   {
    "heading": "Chart walk-through (A to E)",
    "points": [
     "A: what books call sideways trading - really a period where supply and demand were in balance.",
     "B: a candle that closes below the range; it can only do that because there was too much supply at A. Shorting after the selling is under way is late and high risk.",
     "C: the novice buyers - buying after a rally, on above-average volume, into an area we already know has too much supply; first rally into the area, so none of the supply is absorbed.",
     "D: the close of this candle is the confirmation; the entry is on E, below the low of D's body.",
     "This happens every day and is the essence of a turn in price."
    ]
   },
   {
    "heading": "The CME pit story",
    "points": [
     "Sam started on the CME floor handling order flow, with no screen charts for his first year.",
     "A successful floor trader had him watch a newer trader desperately bidding after a long rise, then sold to him; the market fell minutes later.",
     "His friend's whole approach: turns happen when the novice has entered, so find the novice and take the other side consistently.",
     "Sam then worked out what that looks like on a price chart; indicators (e.g. a CCI piece) can show the same idea.",
     "Emotion, not intellect, drives most human behaviour; emotional decisions lead to high-risk, low-reward trades."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "OTA intraday chart with volume (11:00-16:00): A = a range drawn with a red top line and green bottom line; B = a long red candle breaking below the green line around 14:00 on rising volume. Price bounces; a red line extends from the broken range low as supply. C = a tall green candle rallying back to that line on above-average volume (circled bar labelled 'Above Average Volume'); D = the candle at the line whose close confirms; E = the entry below D's body low, after which price slid to the close."
    ]
   }
  ],
  "rules": [
   "Only short when the buyer on the other side is buying after a rally and into supply (and ideally in a downtrend); reverse for longs.",
   "Trade the first rally into a broken range/supply area, before its supply is absorbed.",
   "Confirmation variant: enter below the low of the body of the candle that reacted at the level.",
   "Do not short after selling is already under way."
  ],
  "mistakes": [
   "Buying after a period of buying, or selling after a period of selling.",
   "Buying into supply / selling into demand.",
   "Trading against the bigger trend.",
   "Making decisions based on emotion."
  ],
  "quotes": [
   "All we have to do is consistently find the novice trader.",
   "Find the novice trader and take the other side of his trade consistently."
  ],
  "diagrams": [
   { "key": "confirmation", "caption": "Rally into supply on high volume, confirmation close at D, entry below D's body on E." },
   { "key": "low-odds", "caption": "Novice entry: after a move, into an opposing level, against the trend." }
  ],
  "checklist": [
   "Price arrives after a strong run in the opposite direction (others are chasing).",
   "Price is at an unabsorbed supply/demand area (first visit).",
   "Bigger trend agrees with your side.",
   "If using confirmation: wait for the reaction candle and enter beyond its body."
  ],
  "journalTags": ["novice-trader", "two-mistakes", "order-flow", "confirmation-entry", "volume", "first-rally"],
  "newVsPdfs": [
   "Confirmation entry defined as entry beyond the body low of the reaction candle at the level.",
   "Above-average volume on the rally into supply used as evidence of novice buying; Kevin does not use volume.",
   "Broken-range low used as the supply level (range breakdown and retest)."
  ]
 },
 {
  "n": 54,
  "title": "Find The Novice Trader, Part 2",
  "kind": "article",
  "summary": "A student in an options class bought RIMM puts when RIMM had run more than $8 from the morning low into the prior days' highs (resistance) with CCI overbought and a possible double top. He sold the puts the next day at the double bottom for a large gain; Sam stresses the low-risk entry, not the profit.",
  "sections": [
   {
    "heading": "The trade",
    "points": [
     "RIMM was flying, up over $8.00 from the morning low, and rallied into the prior days' highs, which are resistance.",
     "The buyer there was buying after a large move up and at resistance - a novice. CCI was very overbought and a double top was possible.",
     "The student took the other side with puts: bought them very cheap when they were about to get expensive and sold them expensive when they were about to get cheap.",
     "Price could have gone higher and stopped him out; that is why risk stays low. The low-risk entry is the only reason he could enjoy the gain.",
     "He did the same trade in two other stocks at about the same time."
    ]
   },
   {
    "heading": "Lessons",
    "points": [
     "Most people who trade fail; simply do the opposite of what they do, when they do it, which is visible on a chart.",
     "When someone buys after a significant advance and at resistance, consider selling to them; when someone sells after a decline and at support, consider buying from them.",
     "Learning the rules is easy; emotion makes applying them one of the hardest things you will do.",
     "The answers are in the trader on the other side of the trade, not in what the student did.",
     "Do not trade in class; if you do, only when risk is low, reward is high and odds are in your favour."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "OTA RIMM chart (intraday, 1/17-1/23, CCI panel below): a 'Double Top' circle near 91-92 on 1/17 and a second circle at the same height on 1/22 after the rally; text box 'Student bought PUT options on RIMM expecting a decline'. Between them a 'Double Bottom' around 82 is circled (1/22 low and 1/23 low); text box 'Student sells his PUT options for a big profit because price has hit his target and turns into a double bottom'. CCI is circled above +100 at the second top.",
     "Account screenshot: bought 10 puts (two fills of 5) at 6.50 on 01/22/08 around 13:16 for -6,517.49, sold 10 at 11.00 on 01/23/08 at 11:22 for +10,982.34 (about $4,465 gain)."
    ]
   }
  ],
  "rules": [
   "Sell to buyers who buy after a large advance and at resistance; buy from sellers who sell after a decline and at support.",
   "The prior days' highs/lows act as supply/demand for intraday trades.",
   "Take profits at the opposing level (here the double-bottom support).",
   "Keep risk small because any level can fail."
  ],
  "mistakes": [
   "Being impressed by the gain instead of the low-risk entry.",
   "Letting emotion override easy-to-learn rules.",
   "Trading personal accounts during class without a plan."
  ],
  "quotes": [
   "Emotion will make applying the rules one of the hardest things you will ever attempt to do.",
   "The real key is to focus on the trader who was on the other side."
  ],
  "diagrams": [
   { "key": "low-odds", "caption": "Buyer after an $8 run into prior highs = novice; take the other side." }
  ],
  "checklist": [
   "Price arrived after a large run (others chasing).",
   "Price is at prior highs/lows or a marked level.",
   "Target is the next opposing level.",
   "Risk defined and small; instrument choice (stock/options) fits the plan."
  ],
  "journalTags": ["novice-trader", "prior-day-high", "options", "double-top", "cci", "emotion"],
  "newVsPdfs": [
   "Using options (buying puts) to express a supply-zone short.",
   "Prior days' highs treated as resistance on intraday charts; CCI overbought as supporting evidence (Kevin uses no indicators)."
  ]
 },
 {
  "n": 56,
  "title": "The Qualifier - Support (demand) and Resistance (supply)",
  "kind": "article",
  "summary": "Conventional chart patterns (triangles, flags, pennants, cup and handle, head and shoulders) all use breakout entries, and whether they work depends entirely on the supply and demand at the levels price breaks into. Before taking a pattern breakout, measure the profit margin to the next opposing level; RIMM, DRYS and EBAY examples compare good and poor margins.",
  "sections": [
   {
    "heading": "Patterns need a profit margin",
    "points": [
     "Indicators always do exactly what they are programmed to do; the problem is how traders use them. The same logic applies to chart patterns.",
     "Every common pattern uses a breakout entry; the win or loss depends 100% on the supply/demand at the price levels being broken into.",
     "Before pressing buy or sell, check there is room for price to run after you enter.",
     "A picture-perfect pattern can fail badly when the breakout runs straight into a support or resistance level."
    ]
   },
   {
    "heading": "Execution notes",
    "points": [
     "Breakout entries are hard to fill well; do not chase price. If you miss the low-risk entry, let it go - there is always another trade.",
     "Continuation patterns (descending triangle, bear pennant) are better when price spends very little time in the pattern.",
     "Chart patterns, indicators, candle patterns and more can all be used; how well you quantify supply and demand decides the outcome."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "RIMM intraday (5-minute TradeStation): a 'Descending Triangle' drawn with a falling top line and a flat bottom line after a rally; 'Short Entry' arrow at the break of the bottom line. 'Support - Target 1' is a green line at a prior pullback low below, and 'Support - Target 2' is a lower green line at the earlier base. Plenty of room - about 5:1 reward to risk.",
     "DRYS (TradeStation title shows 60-minute, the text calls it daily; 12/17-12/28): after a steep decline, a small 'Descending Triangle' forms near 75-77; 'Short Entry' at the break of its base around 75. 'Support - Target' is the green line about 71 just below, marked with a double arrow - a much smaller reward-to-risk than RIMM. Price then based and rallied to 82.10.",
     "EBAY 5-minute (12/10-12/11): after a gap up and drift near 34.8-35.0, a tall red candle dropped to about 34.45; a small 'Bear Pennant' formed there and broke lower. 'Support - Target' is the green line at about 33.85 drawn from the prior day's base, and the double arrow shows the decent profit margin from entry."
    ]
   }
  ],
  "rules": [
   "Before any pattern breakout, find the next opposing supply/demand level and measure the profit margin.",
   "Skip pattern breakouts that run straight into a nearby opposing level.",
   "Do not chase a missed breakout fill.",
   "Prefer continuation patterns where price spends little time."
  ],
  "mistakes": [
   "Taking picture-perfect patterns without checking where the next support/resistance is.",
   "Chasing breakout entries for a fill.",
   "Using every indicator signal without logical rules around it."
  ],
  "quotes": [
   "If you miss the low risk entry, let it go. There is always another trade.",
   "The less time price spends in the pattern, typically the better the outcome."
  ],
  "diagrams": [
   { "key": "entry-stop-tp", "caption": "Pattern breakout entry with target at the next opposing demand; room decides the trade." }
  ],
  "checklist": [
   "Next opposing level located below/above the breakout.",
   "Reward to that level is at least 3:1.",
   "Price spent little time in the pattern.",
   "Entry is fillable without chasing."
  ],
  "journalTags": ["chart-patterns", "breakout", "profit-margin", "descending-triangle", "bear-pennant", "no-chasing"],
  "newVsPdfs": [
   "Classic chart patterns allowed as entry triggers when filtered by supply/demand room; Kevin's course does not use pattern breakouts.",
   "Time-in-pattern rule: shorter consolidation = better continuation."
  ]
 },
 {
  "n": 60,
  "title": "The Morning Gap, Low Risk Opportunity for the Astute Market Speculator",
  "kind": "article",
  "summary": "The opening gap entry is usually Sam's lowest-risk, highest-reward trade of the day. Gaps happen because orders at the open overwhelm the other side, so price opens where supply and demand are out of balance; when a gap opens straight into a supply or demand level, the novice is on the wrong side. A SPY 60-minute chart shows three gap entries in one week.",
  "sections": [
   {
    "heading": "Why the open",
    "points": [
     "Gap up = more buy orders at the open than supply at the prior close; gap down = more sell orders than demand.",
     "So at the open price is almost always at an imbalance - opportunity. Trade it back toward balance.",
     "Floor example: with 10 buyers and 5 sellers at a price, price must rise as soon as the 5th seller sells.",
     "The open is not for the novice trader, but it is a great opportunity for the trader who can spot the novice. Entries are usually seconds to minutes after the bell.",
     "Imbalances are greatest at or near the open; by the end of the first hour a lot of novice capital has moved to astute traders.",
     "Order flow works as it did 100 years ago, and novices are always present."
    ]
   },
   {
    "heading": "Reading it",
    "points": [
     "Only a losing trader buys a gap up, after a rally, into an objective supply level; only a novice sells a gap down, after a decline, into demand.",
     "Do not see candles as red and green pictures; understand what is happening behind them.",
     "If you cannot see the novice trader in the market, you probably are the novice."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "SPY 60-minute (2/11-2/22): supply A about 136.4-137.0 (two black lines) at the 2/14 top. B = 2/19 gap up into that supply at the open (tall oval), then a decline. Demand D about 133.9-134.3 at the 2/15 base; E = 2/20 gap down into demand at the open (circle), then a rally. C = 2/21 gap up into the A/B supply again (small circle), then a decline to 134.74. Three gap entries in three days, all low risk if taken near the open."
    ]
   }
  ],
  "rules": [
   "At the open, check whether price gapped into a marked supply or demand level.",
   "Short gap-ups into supply after a rally; buy gap-downs into demand after a decline.",
   "Enter near the open (seconds to minutes), when the imbalance is greatest.",
   "Skip the open if you cannot yet identify levels objectively."
  ],
  "mistakes": [
   "Buying a gap up after a rally and into supply.",
   "Selling a gap down after a decline and into demand.",
   "Reading candles as colours and patterns instead of order flow."
  ],
  "quotes": [
   "If you can't see the novice trader in markets, you likely are the novice trader.",
   "The open is not for the novice trader."
  ],
  "diagrams": [
   { "key": "low-odds", "caption": "Gap into an opposing level after a run = novice entry; fade it." }
  ],
  "checklist": [
   "Supply and demand levels marked before the open.",
   "Price gapped directly into a level.",
   "Gap came after a run in the same direction (novice chasing).",
   "Entry within the first minutes; stop just beyond the level."
  ],
  "journalTags": ["opening-gap", "order-flow", "novice-trader", "first-hour", "gap-fade"],
  "newVsPdfs": [
   "Opening gaps into zones as a dedicated setup traded within minutes of the open; Kevin's notes cover session times but not gap fades.",
   "Claim that imbalance is greatest at the open and the first hour is where most profit is made."
  ]
 },
 {
  "n": 62,
  "title": "The Dollar, In Real Money Terms",
  "kind": "article",
  "summary": "A macro essay arguing that the nominal Dow and NASDAQ hide large declines once the falling US dollar is factored in, that the dollar is a faith-based currency, and that gold is a better yardstick of value. Sam closes by showing supply and demand on the US Dollar index and the 10-year note with the same A-B logic used for any market.",
  "sections": [
   {
    "heading": "Real-money view of stocks",
    "points": [
     "Producers/savers (East Asia, China, Japan, OPEC) vs consumers/borrowers (US government and public); the US borrowed about $2 billion a day and ran a goods deficit over $800 billion in 2006.",
     "Dow 2000 top 11,700 x dollar index 1.24 = 14,508 'GPPP' points; 2007 Dow 13,500 x 0.81 = 10,935, a 25% real decline.",
     "NASDAQ 5000 x 1.24 = 6,200 in 2000 vs 2,500 x 0.81 = 2,100 in 2006: a 66% real decline.",
     "The Dow now buys over 30% fewer euros, 35% less milk, 40% less corn or wheat, 65% less silver, 70% less oil and 80% less copper than in 2000."
    ]
   },
   {
    "heading": "Dollar and gold",
    "points": [
     "Since Nixon closed the gold window on 15 August 1971 the dollar is uncollateralised and faith-based.",
     "Think of currencies like companies: the US dollar looks more like Enron than Microsoft; producer/saver currencies are the Microsofts.",
     "Gold held its value: a $20 suit in 1932 vs an ounce over $700 today that still buys a nice suit.",
     "Printing money -> inflation -> higher rates -> weak bonds -> weak stocks.",
     "Dow/gold ratio fell from 47:1 in 2000 (11,700 / $250) to 19:1 in 2007 (14,000 / $740)."
    ]
   },
   {
    "heading": "Supply and demand on the dollar and bonds",
    "points": [
     "Area A: temporary stability that looks like equilibrium; the decline from it shows sellers greatly exceeded buyers.",
     "B: the first revisit of A, where price is expected to decline again; a dramatic first decline suggests a similar decline at B.",
     "Higher interest rates attract foreign buyers to a currency; falling treasury prices = rising yields (inverse).",
     "Everyone with dollars or a mortgage has a reason to read charts of the dollar and the 10-year note objectively."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "US Dollar index (daily, Oct 2006-Oct 2007): first A = base about 85.3-85.9 (red lines) followed by a gap and drop to about 82.3; B = the first revisit near 85.4 in early 2007, after which price declined. Second A = base about 82.7-83.4 in April, drop to about 81.3, B = revisit near 83.3 around June, then a slide to about 77.8 (now 78.56).",
     "10-Year Note (daily, Jul-Sep): supply A about 117'00-117'16 (red lines) at a small July base, B = first revisit a few days later, followed by a steady decline to 108'23 (falling prices = rising yields).",
     "US Dollar (daily, Apr-Jul, same period): demand A about 94.2-95.1 (green lines) at a base after a V-shaped low near 93; B = the pullback into the zone, after which price rallied to about 99 as rates rose."
    ]
   }
  ],
  "rules": [
   "Analyse any market - currencies, bonds, gold - with the same A (pause) / B (first revisit) supply-demand logic.",
   "Use real-value benchmarks rather than nominal prices when judging long-term wealth."
  ],
  "mistakes": [
   "Judging wealth by nominal index highs while the currency loses value.",
   "Trusting media narratives instead of objective supply/demand."
  ],
  "quotes": [
   "What changed is the purchasing power of a fiat dollar to buy each asset class.",
   "Even the slightest illusion in the search for truth ensures truth will never be found."
  ],
  "diagrams": [
   { "key": "zone-anatomy", "caption": "Dollar index: base A, sharp drop, first revisit B, further decline." }
  ],
  "checklist": [
   "Base A and strong departure identified on the macro chart.",
   "First revisit (B) only.",
   "Rate/currency relationship considered for FX and bond trades."
  ],
  "journalTags": ["macro", "us-dollar", "gold", "real-value", "intermarket", "abc-logic"],
  "newVsPdfs": [
   "Intermarket and macro view (dollar index, treasury yields, gold ratio); Kevin's course is purely chart-based per pair."
  ]
 },
 {
  "n": 70,
  "title": "The Morning Gap, Part 2",
  "kind": "article",
  "summary": "In an LA stock class, Citigroup upgraded ImClone (IMCL) and the stock gapped up at the open right into a supply level formed by a dramatic decline from 45-46. The class sold to the crowd of upgrade buyers. Morning prep is about 15 minutes: find stocks opening at large imbalances, using upgrade/downgrade lists as one source.",
  "sections": [
   {
    "heading": "Morning prep",
    "points": [
     "Prep consists of finding stocks opening at price levels where supply and demand are out of balance in a large way and trading them back to balance.",
     "Two sources are used; one is the list of morning broker upgrades and downgrades.",
     "About 15 minutes of prep each morning; many stocks did the same thing that day."
    ]
   },
   {
    "heading": "The IMCL short",
    "points": [
     "On 3/7 there was a dramatic decline from the $45-46 area, so there was much more supply there than demand.",
     "On 3/19 Citigroup upgraded the stock to Buy and price opened right into that supply level.",
     "The plan made before the open said sell to anyone buying at that level: only a novice buys after an advance and into supply.",
     "Entries at strong imbalances near the open usually move very fast.",
     "Everything else around markets is noise that invites you in at the wrong time and direction; as a trader Sam welcomes it."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "IMCL 60-minute (3/6-3/20): 'Resistance (Supply)' between about 44.95 and 45.75 (black lines) at a 3/7 base, followed by a large red drop to about 42.5 and weeks of trading near 42-43.5. On 3/19 a 'Citigroup Upgrade Gap Up' candle opens into the zone (high about 45.2); 'Short Entry' points to the zone, and price then fell in red candles to 43.31."
    ]
   }
  ],
  "rules": [
   "Before the open, list stocks gapping into marked supply or demand (use upgrades/downgrades as a scan source).",
   "Fade an upgrade-driven gap up into supply; fade a downgrade-driven gap down into demand.",
   "Have the order plan set before the open."
  ],
  "mistakes": [
   "Following a big bank's upgrade by buying the gap into supply.",
   "Treating news as a reason to enter instead of a source of novice order flow."
  ],
  "quotes": [
   "Everything else in and around markets is just noise.",
   "As a trader, I love it - the more noise the better."
  ],
  "diagrams": [
   { "key": "low-odds", "caption": "Upgrade gap up straight into supply - sell to the crowd." }
  ],
  "checklist": [
   "15-minute pre-open scan done (gaps, upgrades/downgrades).",
   "Gap opens directly into an unvisited level formed by a strong move.",
   "Entry, stop and target set before the bell."
  ],
  "journalTags": ["opening-gap", "upgrade-fade", "pre-market-prep", "news-noise", "stocks"],
  "newVsPdfs": [
   "Broker upgrades/downgrades used as a scanning tool for gaps into zones; Kevin's rule is to avoid trading into news.",
   "Fixed 15-minute morning prep routine for stocks."
  ]
 },
 {
  "n": 72,
  "title": "Think Like A Goose",
  "kind": "article",
  "summary": "An essay on illusions: fundamental and news analysis feel real but layering them creates subjective illusions that lead to failure. Beliefs create behaviour and actions; strong news usually creates turns opposite to what the crowd expects because one side exhausts itself into a level. A goose that mechanically flies south each winter is the model for rule-based trading.",
  "sections": [
   {
    "heading": "Illusion vs reality",
    "points": [
     "Consistent low-risk profit rules are simple, but layers of illusion hide them.",
     "Mastering fundamental/news analysis to get consistent profits is an illusion; it stacks subjective views.",
     "Beginners are 'driving from LA to NY trying to reach Mexico' - the path itself is wrong.",
     "Strategies that work do not change with market conditions; believing conditions change is itself an illusion.",
     "Beliefs -> behaviour patterns -> actions; decisions are made at the level of beliefs."
    ]
   },
   {
    "heading": "News illusion",
    "points": [
     "Strong news leads to strong emotion. Example: the London bombings made many sell, but once price reached demand (area A, the origin of an earlier rally) and the last seller sold, price rose.",
     "No matter how bad the news is, when the last seller sells at a level with more willing buyers, prices rise.",
     "Strong news creates powerful turns opposite to the majority's expectation because one side exhausts itself into an objective imbalance."
    ]
   },
   {
    "heading": "Fundamental illusion",
    "points": [
     "QLGC example: a rally back into an imbalance area came with good earnings, an uptrend and brokerage upgrades, but it was an objective supply level.",
     "The only question: is price at a level with objectively more demand than supply? If not, there is no reason to buy.",
     "The drop from that supply was fast because willing buyers went to zero while sellers were still there.",
     "When perceived risk is lowest, actual risk is often highest, and vice versa.",
     "When everything about the company looks good, the price is usually high - and who will buy from you then?",
     "Illusions disguise risk as opportunity and lead to the two mistakes: buying after rising prices and buying where sellers outnumber buyers."
    ]
   },
   {
    "heading": "Act like a goose",
    "points": [
     "Humans decide by emotion; a goose acts like a machine and flies south each autumn without debate.",
     "Markets are supply and demand at work; opportunity is when the relationship is out of balance.",
     "Reality-based traders profit from the illusion-based crowd who buy after them."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "Figure 1 (London bombings) and Figure 2 (QLGC supply with upgrades) are referenced, but the images are missing in this PDF - pages 74, 75 and 77 show only blank space with the captions. The text describes Figure 1 as demand A at the origin of a rally and B the bombing-day drop that turned higher at A, and Figure 2 as a labelled supply area that price rallied into on good news and upgrades before dropping fast."
    ]
   }
  ],
  "rules": [
   "Only buy where there is objectively more demand than supply; otherwise no reason to buy, whatever the news.",
   "Treat strong news moves into a level as likely exhaustion and reversal points.",
   "Follow the rules mechanically, like a goose, without re-debating them each time."
  ],
  "mistakes": [
   "Layering fundamental opinions and calling it analysis.",
   "Selling into demand on bad news, buying into supply on good news.",
   "Believing that market conditions change and the strategy must change too.",
   "Feeling safe because everyone agrees (comfort in numbers)."
  ],
  "quotes": [
   "When perceived risk is lowest, actual risk is often highest.",
   "The many illusions are nothing more than risk disguised as opportunity."
  ],
  "diagrams": [
   { "key": "mindset", "caption": "Beliefs -> behaviour -> action; act mechanically like a goose." }
  ],
  "checklist": [
   "Is price at an objective level? If not, no trade regardless of news.",
   "Am I joining the crowd after a move? If yes, stop.",
   "Am I following the written rule without debate?"
  ],
  "journalTags": ["illusion", "news", "fundamentals", "beliefs", "mechanical-trading", "perceived-risk"],
  "newVsPdfs": [
   "News is treated as a source of exhaustion into levels (fade it at zones) rather than something to avoid trading around."
  ]
 },
 {
  "n": 78,
  "title": "Supply and Demand Q&A With Sam Seiden",
  "kind": "article",
  "summary": "Recurring reader questions answered with a daily DIA demand setup. The first answer explains how to draw zone lines: enclose the majority of trading, check two timeframes because wicks and bodies swap between timeframes, and reduce position size if the zone is wide. The second question (how to choose an exact price inside a zone) begins here and its answer continues past page 80.",
  "sections": [
   {
    "heading": "The DIA demand setup",
    "points": [
     "Once price moved above the cluster of trading, that cluster became a significant demand level for a couple of long trades.",
     "Price could only leave that area upward because demand for Dow stocks exceeded supply there.",
     "When price declined back into it, sellers were selling where demand exceeds supply - the novice seller to buy from."
    ]
   },
   {
    "heading": "Q1: where to draw the lines (opens, closes, wicks?)",
    "points": [
     "Make sure the vast majority of trading sits between your two lines.",
     "There is no fixed 'include wicks' or 'exclude wicks' answer: change the timeframe and some wicks become bodies and some bodies become wicks.",
     "Look at the area on two different timeframes to see where most trading happened and draw there.",
     "Using the candle highs and lows is fine but often makes a very large stop.",
     "If you draw the lines around the entire price action (as the student did in this chart), reduce position size so the risk stays inside your maximum."
    ]
   },
   {
    "heading": "Q2 (continues in next part)",
    "points": [
     "A reader notes that Sam says true levels are found in bases, pivots and gaps, and asks how to quantify them and where inside a range such as 15.20-15.50 to buy or sell.",
     "The reader lists clues Sam has mentioned: a momentum bar followed by a reversal bar, a slow stochastic cross, and a cross of the +/-100 CCI line. The answer follows after page 80."
    ]
   },
   {
    "heading": "Charts",
    "points": [
     "DIA daily (TradeStation, Mar-May): after a drop to about 118 in March and a choppy recovery, price formed a cluster in early April; 'Support (Demand)' is drawn about 125.2-127.2 (two black lines) around the whole cluster. Price rose above it, came back twice (circled in late April and early May, both touching about 127) and bounced each time; last price 130.05."
    ]
   }
  ],
  "rules": [
   "Draw the zone so the majority of trading in the base sits between the lines.",
   "Check the base on two timeframes before fixing the lines.",
   "If the zone is drawn wide (full highs/lows), cut position size to keep risk within limits.",
   "Buy the return into a demand cluster that price left upward."
  ],
  "mistakes": [
   "Applying one fixed wick/body rule on every timeframe.",
   "Drawing wide zones and keeping full position size."
  ],
  "quotes": [
   "Make sure that the vast majority of trading is between your two lines.",
   "Some wicks become bodies and some bodies become wicks."
  ],
  "diagrams": [
   { "key": "draw", "caption": "Enclose the majority of trading in the base; verify on a second timeframe." }
  ],
  "checklist": [
   "Base examined on two timeframes.",
   "Lines contain most of the trading in the base.",
   "Stop size measured; position size reduced if the zone is wide.",
   "Price left the cluster strongly and is returning into it."
  ],
  "journalTags": ["zone-drawing", "wicks-vs-bodies", "two-timeframes", "position-sizing", "qa"],
  "newVsPdfs": [
   "Kevin's distal line always includes the wick (objective rule); Seiden says no fixed wick rule - enclose the majority of trading, judged across two timeframes.",
   "Wide zones handled by cutting position size instead of redrawing the zone smaller.",
   "Mentions slow stochastic and CCI clues for timing entries inside a zone (indicators, which Kevin does not use)."
  ]
 }
];
