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
  "images": [
   {"src": "/lessons/seiden/p001-000.jpg", "caption": "Score-sheet diagram 'Strength at Origin of Move': demand (top row) and supply (bottom row) departures graded Strongest = 2, Strong = 1, Weak = 0.", "notes": ["Strongest = 2: one or two very large candles leave the level - the biggest imbalance.", "Strong = 1: a steady staircase of mid-size candles in one direction.", "Weak = 0: overlapping candles of mixed colour drifting away - little imbalance, low odds on the return."]},
   {"src": "/lessons/seiden/p001-002.jpg", "caption": "Score-sheet diagram 'Reward to Risk Ratio': entry on the basing candle, stop just beyond it, target 1 at the first opposing level; 3:1 = 2 points, 2:1 = 1, 1:1 = 0 (supply row mirrored).", "notes": ["Measure risk from entry to stop, and reward from entry to the first opposing level (target 1), not to a hoped-for extreme.", "Only 3:1 or better earns the full 2 points; a 1:1 setup scores zero even if the zone looks clean.", "The supply row is the same picture upside down: stop above, entry at the zone, target 1 below."]},
   {"src": "/lessons/seiden/p002-004.jpg", "caption": "Score-sheet diagram 'Retracement': buy/sell zones with the 1st, 2nd and 3rd time price returns to the level (Strongest = 2, Strong = 1, Weak = 0).", "notes": ["The first return to a fresh zone is the highest-probability entry (2 points).", "Each previous touch (blue numbered circles) has already filled orders at the level, lowering the score to 1 and then 0.", "By the third visit the zone is likely to break - motion into mass removes the mass."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Strength of the move away from the base</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">How price leaves the zone shows how far supply and demand were out of balance</text><rect x=\"28\" y=\"242.5\" width=\"182\" height=\"13.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"42\" y1=\"237.9\" x2=\"42\" y2=\"256.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"36.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"59\" y1=\"237.9\" x2=\"59\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"53.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"76\" y1=\"240.2\" x2=\"76\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"70.5\" y=\"244.8\" width=\"11\" height=\"4.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"93\" y1=\"175.8\" x2=\"93\" y2=\"247.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"87.5\" y=\"180.4\" width=\"11\" height=\"64.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"110\" y1=\"102.2\" x2=\"110\" y2=\"182.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104.5\" y=\"106.8\" width=\"11\" height=\"73.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"115\" y=\"78\" fill=\"#22c55e\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Strongest = 2</text><text x=\"115\" y=\"330\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">1-2 large candles</text><line x1=\"220\" y1=\"60\" x2=\"220\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"238\" y=\"242.5\" width=\"182\" height=\"13.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"252\" y1=\"237.9\" x2=\"252\" y2=\"256.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"246.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"269\" y1=\"237.9\" x2=\"269\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"263.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"286\" y1=\"240.2\" x2=\"286\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"280.5\" y=\"244.8\" width=\"11\" height=\"4.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"303\" y1=\"220.7\" x2=\"303\" y2=\"248.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"297.5\" y=\"224.1\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"320\" y1=\"199.9\" x2=\"320\" y2=\"227.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"314.5\" y=\"203.4\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"337\" y1=\"179.2\" x2=\"337\" y2=\"206.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"331.5\" y=\"182.7\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"354\" y1=\"158.6\" x2=\"354\" y2=\"186.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"348.5\" y=\"162\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"371\" y1=\"137.8\" x2=\"371\" y2=\"165.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"365.5\" y=\"141.3\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"325\" y=\"78\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Strong = 1</text><text x=\"325\" y=\"330\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">steady mid-size candles</text><line x1=\"430\" y1=\"60\" x2=\"430\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"448\" y=\"242.5\" width=\"182\" height=\"13.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"462\" y1=\"237.9\" x2=\"462\" y2=\"256.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"456.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"479\" y1=\"237.9\" x2=\"479\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"473.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"496\" y1=\"240.2\" x2=\"496\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"490.5\" y=\"244.8\" width=\"11\" height=\"4.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"513\" y1=\"227.6\" x2=\"513\" y2=\"248.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"507.5\" y=\"231\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"530\" y1=\"227.6\" x2=\"530\" y2=\"241.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"524.5\" y=\"231\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"547\" y1=\"220.7\" x2=\"547\" y2=\"241.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"541.5\" y=\"224.1\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"564\" y1=\"220.7\" x2=\"564\" y2=\"236.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"558.5\" y=\"224.1\" width=\"11\" height=\"9.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"581\" y1=\"216.1\" x2=\"581\" y2=\"236.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"575.5\" y=\"219.5\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"598\" y1=\"216.1\" x2=\"598\" y2=\"229.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"592.5\" y=\"219.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"615\" y1=\"209.2\" x2=\"615\" y2=\"229.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"609.5\" y=\"212.6\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"632\" y1=\"202.2\" x2=\"632\" y2=\"216.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"626.5\" y=\"205.7\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"535\" y=\"78\" fill=\"#ef4444\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Weak = 0</text><text x=\"535\" y=\"330\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">overlapping, mixed colours</text><text x=\"20\" y=\"350\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\"></text></svg>", "caption": "Score the departure: one or two large candles out of a small base = 2, a steady run of mid-size candles = 1, a choppy overlapping drift = 0."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">First return is the best return</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Every visit fills orders at the zone - like axe swings on a tree</text><rect x=\"40\" y=\"231\" width=\"540\" height=\"27.6\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"585\" y=\"235\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"585\" y=\"262.6\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"50\" y1=\"235.6\" x2=\"50\" y2=\"258.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"44.5\" y=\"240.2\" width=\"11\" height=\"9.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"65\" y1=\"237.9\" x2=\"65\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"59.5\" y=\"242.5\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"80\" y1=\"237.9\" x2=\"80\" y2=\"251.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"74.5\" y=\"242.5\" width=\"11\" height=\"4.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"95\" y1=\"189.6\" x2=\"95\" y2=\"249.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"89.5\" y=\"194.2\" width=\"11\" height=\"52.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><polyline points=\"95,194.2 150,116 205,228.7 265,129.8 320,231 385,148.2 440,233.3 500,180.4 565,286.2\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"205\" cy=\"210.7\" r=\"13\" fill=\"#22c55e\"/><text x=\"205\" y=\"214.3\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">1st</text><text x=\"205\" y=\"280.6\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">2 pts</text><circle cx=\"320\" cy=\"210.7\" r=\"13\" fill=\"#f59e0b\"/><text x=\"320\" y=\"214.3\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">2nd</text><text x=\"320\" y=\"280.6\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">1 pt</text><circle cx=\"440\" cy=\"210.7\" r=\"13\" fill=\"#ef4444\"/><text x=\"440\" y=\"214.3\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">3rd</text><text x=\"440\" y=\"280.6\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">0 pts</text><line x1=\"530\" y1=\"208\" x2=\"556.4\" y2=\"268.7\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"560,277 560.5,267 552.3,270.5\" fill=\"#ef4444\"/><text x=\"560\" y=\"308.8\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\">zone breaks</text></svg>", "caption": "Retracement score: 1st return to the zone = 2 points, 2nd = 1, 3rd = 0. Each touch removes unfilled orders until the level gives way."}
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
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Supply = Rally-Base-Drop   |   Demand = Drop-Base-Rally</text><rect x=\"162\" y=\"127.5\" width=\"128\" height=\"20\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"295\" y=\"151.5\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"295\" y=\"131.5\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"70\" y1=\"236.2\" x2=\"70\" y2=\"273.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"63.5\" y=\"240\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"96\" y1=\"203.8\" x2=\"96\" y2=\"243.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"89.5\" y=\"207.5\" width=\"13\" height=\"32.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"122\" y1=\"166.2\" x2=\"122\" y2=\"211.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"115.5\" y=\"170\" width=\"13\" height=\"37.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"148\" y1=\"136.2\" x2=\"148\" y2=\"173.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"141.5\" y=\"140\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"174\" y1=\"130\" x2=\"174\" y2=\"150\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"167.5\" y=\"140\" width=\"13\" height=\"5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"200\" y1=\"127.5\" x2=\"200\" y2=\"147.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"193.5\" y=\"137.5\" width=\"13\" height=\"7.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"226\" y1=\"132.5\" x2=\"226\" y2=\"152.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"219.5\" y=\"137.5\" width=\"13\" height=\"10\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"252\" y1=\"143.8\" x2=\"252\" y2=\"198.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"147.5\" width=\"13\" height=\"47.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"278\" y1=\"191.2\" x2=\"278\" y2=\"248.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"271.5\" y=\"195\" width=\"13\" height=\"50\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><text x=\"175\" y=\"340\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">RBD: base after a rally</text><line x1=\"330\" y1=\"60\" x2=\"330\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"462\" y=\"240\" width=\"128\" height=\"20\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"595\" y=\"244\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"595\" y=\"264\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"370\" y1=\"116.2\" x2=\"370\" y2=\"153.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"363.5\" y=\"120\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"396\" y1=\"146.2\" x2=\"396\" y2=\"186.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"389.5\" y=\"150\" width=\"13\" height=\"32.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"422\" y1=\"178.8\" x2=\"422\" y2=\"223.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"415.5\" y=\"182.5\" width=\"13\" height=\"37.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"448\" y1=\"216.2\" x2=\"448\" y2=\"253.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"441.5\" y=\"220\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"474\" y1=\"240\" x2=\"474\" y2=\"260\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"467.5\" y=\"245\" width=\"13\" height=\"5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"500\" y1=\"237.5\" x2=\"500\" y2=\"257.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"493.5\" y=\"245\" width=\"13\" height=\"7.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"526\" y1=\"237.5\" x2=\"526\" y2=\"257.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"519.5\" y=\"242.5\" width=\"13\" height=\"10\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"552\" y1=\"191.2\" x2=\"552\" y2=\"246.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"545.5\" y=\"195\" width=\"13\" height=\"47.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"578\" y1=\"136.2\" x2=\"578\" y2=\"198.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"571.5\" y=\"140\" width=\"13\" height=\"55\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"475\" y=\"340\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">DBR: base after a drop</text></svg>", "caption": "The two reversal zones: a small base between a rally and a drop is supply (RBD); a base between a drop and a rally is demand (DBR). Proximal = edge nearest price, distal = far edge."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Confirmation entry at demand</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Enter only after price proves the zone holds</text><rect x=\"40\" y=\"231.6\" width=\"440\" height=\"36.4\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"234.2\" x2=\"60\" y2=\"265.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"52.5\" y=\"239.4\" width=\"15\" height=\"7.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"94\" y1=\"234.2\" x2=\"94\" y2=\"260.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"86.5\" y=\"239.4\" width=\"15\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"128\" y1=\"158.8\" x2=\"128\" y2=\"247.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120.5\" y=\"164\" width=\"15\" height=\"80.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"162\" y1=\"144.5\" x2=\"162\" y2=\"167.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"154.5\" y=\"148.4\" width=\"15\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"196\" y1=\"144.5\" x2=\"196\" y2=\"173.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"188.5\" y=\"148.4\" width=\"15\" height=\"20.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"230\" y1=\"165.3\" x2=\"230\" y2=\"193.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"222.5\" y=\"169.2\" width=\"15\" height=\"20.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"264\" y1=\"186.1\" x2=\"264\" y2=\"214.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"256.5\" y=\"190\" width=\"15\" height=\"20.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"298\" y1=\"206.9\" x2=\"298\" y2=\"232.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"290.5\" y=\"210.8\" width=\"15\" height=\"18.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"332\" y1=\"226.4\" x2=\"332\" y2=\"262.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"324.5\" y=\"229\" width=\"15\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"366\" y1=\"216\" x2=\"366\" y2=\"244.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"358.5\" y=\"221.2\" width=\"15\" height=\"18.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"400\" y1=\"180.9\" x2=\"400\" y2=\"219.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"392.5\" y=\"184.8\" width=\"15\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"434\" y1=\"149.7\" x2=\"434\" y2=\"188.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"426.5\" y=\"153.6\" width=\"15\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"468\" y1=\"118.5\" x2=\"468\" y2=\"157.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460.5\" y=\"122.4\" width=\"15\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"312\" y1=\"214.7\" x2=\"480\" y2=\"214.7\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"486\" y=\"218.7\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">buy-stop trigger</text><line x1=\"40\" y1=\"275.8\" x2=\"480\" y2=\"275.8\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"486\" y=\"279.8\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">stop below distal</text><line x1=\"336\" y1=\"298\" x2=\"359.4\" y2=\"258.3\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><polygon points=\"364,250.6 355.5,256.1 363.3,260.6\" fill=\"#94a3b8\"/><text x=\"226\" y=\"310\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">reaction candle inside zone</text><line x1=\"408\" y1=\"184.8\" x2=\"446.2\" y2=\"139.7\" stroke=\"#22c55e\" stroke-width=\"2\"/><polygon points=\"452,132.8 442.8,136.8 449.6,142.6\" fill=\"#22c55e\"/><text x=\"26\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">If the stop price trades before the trigger, cancel the order.</text></svg>", "caption": "Confirmation entry: wait for price to enter the zone and print a reaction candle, buy above that candle, stop under the distal line; cancel if the stop trades first."}
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
  "images": [
   {"src": "/lessons/seiden/p009-006.jpg", "caption": "OTA slide 'Entries: First Pullback / Breakout': left - base between two green lines, rally to a red supply line, pullback into the base = Low Risk Entry; right - drop into a base under two red lines, entry as price breaks up from the base. Circled 'Profit Zone' up to supply in both.", "notes": ["Both entries are taken at demand, close to the protective stop.", "The profit zone is the room between entry and the next supply line - that is the profit margin to measure before entering.", "First pullback: wait for price to come back to the fresh base after the rally; breakout: enter as price leaves the base."]},
   {"src": "/lessons/seiden/p010-007.jpg", "caption": "10-Year Note futures, intraday (9/20-9/23): supply about 109'03-109'08 (two red lines) at a small base, a hard drop in large red candles to about 108'14, and a slow climb back to 108'30.5 just under the zone.", "notes": ["The fast, large-candle drop out of the base marks a strong imbalance at the supply zone.", "Distance from the zone to the low is the initial profit margin on a short at the first return.", "The return is slow and overlapping - buyers drifting up into supply, the people a short sells to."]},
   {"src": "/lessons/seiden/p011-008.jpg", "caption": "S&P E-mini, daily (late Aug-early Oct): demand about 1485-1500 (green lines) under a small base, then one tall green candle to about 1540 (last 1534.25).", "notes": ["One very large candle out of a small base = strongest departure.", "Even a strong level must be judged on the bigger curve: here it is fine for a day-trade bounce but too high for a swing entry.", "Look left for the nearest supply before deciding the trade has enough profit margin."]},
   {"src": "/lessons/seiden/p012-009.jpg", "caption": "Newell Rubbermaid NWL, daily (Jun-Sep): wide supply about 29.0-29.9 (red lines) across the June-July range, a drop to about 24.5 in August, then tall green candles straight back into the zone (28.83).", "notes": ["Price rallied into supply with big green candles and no basing - novice buyers buying after an advance.", "A wide zone means a wider stop; it was kept as a watch idea rather than a full-size trade.", "The opposing demand near 25 defines the profit margin for a short from the zone."]},
   {"src": "/lessons/seiden/p013-010.jpg", "caption": "Goldman Sachs GS, daily (Jul-Sep): supply about 219-222 (red lines) at the July top, a decline to about 160, then a recovery; the circle marks large green candles and gap-ups near 190-205 (last 209.98).", "notes": ["The circled big green candles are late buyers chasing the advance - the people to sell to.", "The plan is a short only if price reaches the red supply lines, not in the middle of the move.", "Profit margin is large: the whole decline from 220 to 160 sits below the zone."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Profit margin: look to your left</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Distance from entry to the opposing zone must be at least 3x the risk</text><rect x=\"50\" y=\"96.4\" width=\"420\" height=\"23.4\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"247.2\" width=\"270\" height=\"26\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"108.1\" x2=\"60\" y2=\"141.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"53.5\" y=\"112\" width=\"13\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"86\" y1=\"91.2\" x2=\"86\" y2=\"119.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"79.5\" y=\"104.2\" width=\"13\" height=\"7.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"112\" y1=\"96.4\" x2=\"112\" y2=\"119.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"105.5\" y=\"104.2\" width=\"13\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"138\" y1=\"110.7\" x2=\"138\" y2=\"167.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"131.5\" y=\"114.6\" width=\"13\" height=\"49.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"164\" y1=\"160.1\" x2=\"164\" y2=\"206.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"157.5\" y=\"164\" width=\"13\" height=\"39\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"190\" y1=\"199.1\" x2=\"190\" y2=\"245.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"183.5\" y=\"203\" width=\"13\" height=\"39\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"216\" y1=\"244.6\" x2=\"216\" y2=\"270.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"209.5\" y=\"242\" width=\"13\" height=\"7.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"242\" y1=\"242\" x2=\"242\" y2=\"268\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"235.5\" y=\"244.6\" width=\"13\" height=\"5.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"268\" y1=\"191.3\" x2=\"268\" y2=\"248.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"261.5\" y=\"195.2\" width=\"13\" height=\"49.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"294\" y1=\"149.7\" x2=\"294\" y2=\"199.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"287.5\" y=\"153.6\" width=\"13\" height=\"41.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"320\" y1=\"149.7\" x2=\"320\" y2=\"173.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"313.5\" y=\"153.6\" width=\"13\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"346\" y1=\"165.3\" x2=\"346\" y2=\"209.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"339.5\" y=\"169.2\" width=\"13\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"372\" y1=\"201.7\" x2=\"372\" y2=\"240.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"365.5\" y=\"205.6\" width=\"13\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"380\" y1=\"119.8\" x2=\"470\" y2=\"119.8\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"123.8\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">target 1 = opposing supply</text><line x1=\"380\" y1=\"247.2\" x2=\"470\" y2=\"247.2\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"251.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">entry (proximal)</text><line x1=\"380\" y1=\"278.4\" x2=\"470\" y2=\"278.4\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"282.4\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">stop (beyond distal)</text><line x1=\"432\" y1=\"183.5\" x2=\"432\" y2=\"129.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"432,122.4 428.5,129.4 435.5,129.4\" fill=\"#22c55e\"/><line x1=\"432\" y1=\"183.5\" x2=\"432\" y2=\"237.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"432,244.6 435.5,237.6 428.5,237.6\" fill=\"#22c55e\"/><text x=\"426\" y=\"184.8\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"700\">reward 4</text><line x1=\"432\" y1=\"262.8\" x2=\"432\" y2=\"255.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><polygon points=\"432,248.5 428.5,255.5 435.5,255.5\" fill=\"#ef4444\"/><line x1=\"432\" y1=\"262.8\" x2=\"432\" y2=\"270.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><polygon points=\"432,277.1 435.5,270.1 428.5,270.1\" fill=\"#ef4444\"/><text x=\"426\" y=\"265.4\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"700\">risk 1</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Under 3:1 to the first target = no trade, however good the zone looks.</text></svg>", "caption": "Profit margin: entry at the demand proximal line, stop beyond the distal line, first target at the nearest supply to the left. Require 3:1 or better."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Sell to the late buyer</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Big green candles after an advance, into supply, are novice buying</text><rect x=\"60\" y=\"91.2\" width=\"520\" height=\"26\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"585\" y=\"121.2\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"585\" y=\"95.2\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"70\" y1=\"86\" x2=\"70\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"63\" y=\"96.4\" width=\"14\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"100\" y1=\"91.2\" x2=\"100\" y2=\"117.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"93\" y=\"96.4\" width=\"14\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"130\" y1=\"108.1\" x2=\"130\" y2=\"154.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"123\" y=\"112\" width=\"14\" height=\"39\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"160\" y1=\"147.1\" x2=\"160\" y2=\"188.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"153\" y=\"151\" width=\"14\" height=\"33.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"190\" y1=\"180.9\" x2=\"190\" y2=\"219.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"183\" y=\"184.8\" width=\"14\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"220\" y1=\"212.1\" x2=\"220\" y2=\"245.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"213\" y=\"216\" width=\"14\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"250\" y1=\"238.1\" x2=\"250\" y2=\"261.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"243\" y=\"242\" width=\"14\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"280\" y1=\"243.3\" x2=\"280\" y2=\"261.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"273\" y=\"247.2\" width=\"14\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"310\" y1=\"227.7\" x2=\"310\" y2=\"251.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"303\" y=\"231.6\" width=\"14\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"340\" y1=\"227.7\" x2=\"340\" y2=\"240.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"333\" y=\"231.6\" width=\"14\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"370\" y1=\"212.1\" x2=\"370\" y2=\"240.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"363\" y=\"216\" width=\"14\" height=\"20.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"400\" y1=\"196.5\" x2=\"400\" y2=\"219.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"393\" y=\"200.4\" width=\"14\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"430\" y1=\"196.5\" x2=\"430\" y2=\"209.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"423\" y=\"200.4\" width=\"14\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"460\" y1=\"175.7\" x2=\"460\" y2=\"209.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"453\" y=\"179.6\" width=\"14\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"490\" y1=\"135.4\" x2=\"490\" y2=\"182.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"483\" y=\"138\" width=\"14\" height=\"41.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"520\" y1=\"101.6\" x2=\"520\" y2=\"135.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"513\" y=\"106.8\" width=\"14\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><ellipse cx=\"505\" cy=\"143.2\" rx=\"34\" ry=\"56\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"4 3\"/><text x=\"505\" y=\"217.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">novice buyers</text><text x=\"505\" y=\"231.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\">chase the rally</text><line x1=\"540\" y1=\"112\" x2=\"540\" y2=\"168\" stroke=\"#ef4444\" stroke-width=\"2.5\"/><polygon points=\"540,177 544.5,168 535.5,168\" fill=\"#ef4444\"/><text x=\"548\" y=\"153.6\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"700\">sell here</text></svg>", "caption": "Who you trade against: buyers who chase large green candles and gaps after a long advance, right into an old supply zone, are the people to sell to."}
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
  "images": [
   {"src": "/lessons/seiden/p014-011.jpg", "caption": "30-Year Bond futures, intraday (9/6-9/14): 'Last weeks supply level (sell short)' about 113 10/32-113 17/32 (red lines) at a small base after the drop from 114; price fell to 112 16/32, rallied straight back into the zone and was rejected with a tall red candle.", "notes": ["The short from last week's letter triggered on the first return and paid about 3:1 on the first day.", "Entry at the proximal line, stop just above the distal line - a tiny stop compared with the drop that followed.", "Why it worked: price had left that base fast, so a large imbalance (unfilled sell orders) was still waiting."]},
   {"src": "/lessons/seiden/p015-012.jpg", "caption": "Russell 2000 futures ER2, intraday (9/5-9/17): 'Supply' about 795.5-802 (red lines) at a small base after the drop from about 810, a gap down to about 767 on 9/10, and a recovery to 789.30 just under the zone.", "notes": ["Strong initial decline (including a gap) away from the base = strong supply.", "Short-term short on the first return to the zone, stop above the distal line.", "Note the contract size: Russell points are worth $100, so position size must match the stop."]},
   {"src": "/lessons/seiden/p016-013.jpg", "caption": "SMH semiconductor ETF, daily (Apr-Sep): demand about 34.2-34.9 at the April base, supply about 37.8-38.3 at a small September base; price 37.14 with the gap between the two levels circled as 'Profit Margin'.", "notes": ["Two unvisited opposing levels define the trade: sell supply, buy demand.", "The circled gap between them is the profit margin for either trade.", "A sector ETF like SMH can also be used as a guide for its component stocks."]},
   {"src": "/lessons/seiden/p017-014.jpg", "caption": "Silver futures, daily (late Jul-Sep): supply about 13.00-13.20 (red lines) at the top base, a collapse to about 11.50, demand about 11.85-12.15 (green lines) at a late-August base, then a rally to 12.745.", "notes": ["Buy the first pullback into the green demand with a protective sell stop just under it.", "Target the red supply above - the profit margin between the two levels is several times the risk.", "The demand base sits low on the bigger curve after a collapse, which raises the odds."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Judge the level by how price left it</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Same base, two departures, two very different imbalances</text><rect x=\"30\" y=\"125.2\" width=\"270\" height=\"18.4\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><line x1=\"48\" y1=\"125.2\" x2=\"48\" y2=\"143.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"42\" y=\"132.1\" width=\"12\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"70\" y1=\"125.2\" x2=\"70\" y2=\"141.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"64\" y=\"132.1\" width=\"12\" height=\"4.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"92\" y1=\"125.2\" x2=\"92\" y2=\"141.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"86\" y=\"129.8\" width=\"12\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"114\" y1=\"132.1\" x2=\"114\" y2=\"187.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"108\" y=\"134.4\" width=\"12\" height=\"50.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"136\" y1=\"182.7\" x2=\"136\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"185\" width=\"12\" height=\"64.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><text x=\"165\" y=\"82\" fill=\"#22c55e\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Strong exit</text><text x=\"165\" y=\"335\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">large imbalance - trade the first return</text><line x1=\"325\" y1=\"60\" x2=\"325\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"340\" y=\"125.2\" width=\"270\" height=\"18.4\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><line x1=\"358\" y1=\"125.2\" x2=\"358\" y2=\"143.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"352\" y=\"132.1\" width=\"12\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"380\" y1=\"125.2\" x2=\"380\" y2=\"141.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"374\" y=\"132.1\" width=\"12\" height=\"4.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"402\" y1=\"125.2\" x2=\"402\" y2=\"141.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"396\" y=\"129.8\" width=\"12\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"424\" y1=\"130.9\" x2=\"424\" y2=\"149.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"418\" y=\"134.4\" width=\"12\" height=\"11.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"446\" y1=\"135.6\" x2=\"446\" y2=\"149.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"440\" y=\"139\" width=\"12\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"468\" y1=\"135.6\" x2=\"468\" y2=\"156.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"462\" y=\"139\" width=\"12\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"490\" y1=\"144.8\" x2=\"490\" y2=\"156.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"484\" y=\"148.2\" width=\"12\" height=\"4.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"512\" y1=\"144.8\" x2=\"512\" y2=\"165.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"506\" y=\"148.2\" width=\"12\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"534\" y1=\"153.9\" x2=\"534\" y2=\"165.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"528\" y=\"157.4\" width=\"12\" height=\"4.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"556\" y1=\"153.9\" x2=\"556\" y2=\"174.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"550\" y=\"157.4\" width=\"12\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"578\" y1=\"167.8\" x2=\"578\" y2=\"183.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"572\" y=\"171.2\" width=\"12\" height=\"9.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><text x=\"475\" y=\"82\" fill=\"#ef4444\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Slow drift</text><text x=\"475\" y=\"335\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">small imbalance - skip or size down</text></svg>", "caption": "Level quality: a base followed by one or two large candles away shows a large imbalance (high odds on the first return); a slow overlapping drift shows a small one."}
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
  "images": [
   {"src": "/lessons/seiden/p018-015.jpg", "caption": "QQQQ, intraday (7/23-9/7): 'Supply Level' about 50.00-50.30 (red lines) at the late-July top, a fall to about 45 on 8/16, then a rally back; 'Short Entry' at the first touch of 50.00 on 9/5, followed by a $2 drop and gap down toward 48 (now 49.12).", "notes": ["Shorting at the first touch of the zone put the stop only cents away above 50.30.", "The trend follower who bought the rally and the breakout buyer at the highs were on the other side.", "Entering at the turning point maximises the profit margin; entering after confirmation lower down gives part of it away."]},
   {"src": "/lessons/seiden/p019-016.jpg", "caption": "NASDAQ futures NQ, monthly (2001-2007): supply level about 2,100-2,250 (red lines) at the start, a circled sharp drop in 2002 down to about 1,100, and a multi-year climb back to about 2,025 without re-entering the zone.", "notes": ["The big-picture chart shows where large supply still waits - price has never returned to that zone.", "Long-term buying near that level is low odds; it is where a turn is likely.", "Always check the monthly chart before longer-term trades."]},
   {"src": "/lessons/seiden/p019-017.jpg", "caption": "30-Year Bond futures, intraday (8/24-9/13): demand (support) about 110 24/32-111 at the late-August base, supply (resistance) about 113 4/32-113 8/32 at a small base after the 114 top; price 112 22/32 with the gap between them circled as 'Profit Margin'.", "notes": ["Both levels are tradable: short supply, buy demand, each with a stop just beyond the zone.", "The space between the levels is the profit margin for each trade.", "Price-only analysis: no indicator is needed to locate either level."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Who pays the turning-point trader?</text><rect x=\"40\" y=\"85\" width=\"560\" height=\"25\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"270\" width=\"560\" height=\"25\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polyline points=\"50,210 90,285 150,235 200,250 260,190 300,205 360,150 400,165 450,100 500,155 560,210\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"90\" cy=\"307\" r=\"11\" fill=\"#22c55e\"/><text x=\"90\" y=\"310.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><text x=\"110\" y=\"311\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">turning-point buyer at demand</text><circle cx=\"260\" cy=\"170\" r=\"11\" fill=\"#f59e0b\"/><text x=\"260\" y=\"173.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><text x=\"240\" y=\"152\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">trend follower</text><circle cx=\"450\" cy=\"70\" r=\"11\" fill=\"#ef4444\"/><text x=\"450\" y=\"73.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">C</text><text x=\"434\" y=\"74\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\">breakout buyer</text><line x1=\"470\" y1=\"100\" x2=\"539.5\" y2=\"190.4\" stroke=\"#ef4444\" stroke-width=\"2.5\"/><polygon points=\"545,197.5 543.1,187.6 535.9,193.1\" fill=\"#ef4444\"/><text x=\"570\" y=\"230\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\">turning-point</text><text x=\"570\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\">trader sells</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A and the short at supply have tiny stops; B and C buy late, far from demand, into supply.</text></svg>", "caption": "Turning points vs late entries: the trader who buys demand and sells supply is paid by the trend follower and the breakout buyer who enter late, far from support, into supply."}
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
  "images": [
   {"src": "/lessons/seiden/p021-018.jpg", "caption": "AAPL day trade (OTA student trade, intraday 8/28-8/29): 'Resistance (supply)' about 132.7-133.2 at a small base before the free-fall to about 127.3; next day 'Support (demand)' about 131.5-131.9 forms after the gap up, price rallies into supply, 'sold short' at the zone and 'Covered' at demand; the gap is labelled 'Profit Margin'.", "notes": ["The student found a supply/demand pair first, then measured the profit margin between them.", "Short entered at supply before the big red candle - first in line, stop right above the zone.", "Cover at the opposing demand rather than hoping for more: the plan was set before entry."]},
   {"src": "/lessons/seiden/p022-019.jpg", "caption": "QQQQ, intraday (7/23-early Sep): supply about 49.9-50.3 (red lines) at the top left; a small demand zone (green lines) about 48.8-49.0 near the current price of 49.33 after the late-August rally.", "notes": ["Mark the nearest supply above and nearest demand below; both are first-revisit trades.", "The trade with more room to the opposing level is the better one.", "Rules decide the entry: no change of plan once price reaches a level."]},
   {"src": "/lessons/seiden/p023-020.jpg", "caption": "CEPH, intraday (7/23-early Sep): 'Resistance (supply)' about 78-80 at the top-left base, a dramatic decline including a gap to about 69, then a steady climb back toward the zone.", "notes": ["Plan: short the first revisit of the supply, selling to buyers who buy after an advance.", "A gap in the departure shows a strong imbalance at the level.", "The slow, steady rally back is not a reason to doubt the zone - it is how novices arrive."]},
   {"src": "/lessons/seiden/p024-021.jpg", "caption": "EUR/USD cash forex, intraday (9/3-9/4): supply about 1.3610-1.3627 (red lines) at a sideways base after the fall from 1.3650, then a strong drop with large red candles to about 1.3555 (now 1.35691).", "notes": ["The base (drop-base-drop) is supply because price left it with large red candles.", "Day traders can short the first intraday return to the zone with a stop above 1.3627.", "The size of the decline shows the profit margin available on that return."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Trade between a supply and demand pair</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Short the first return to supply, cover at demand</text><rect x=\"50\" y=\"86\" width=\"420\" height=\"20.8\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"200.4\" width=\"190\" height=\"20.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"83.4\" x2=\"60\" y2=\"104.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"54\" y=\"91.2\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"84\" y1=\"86\" x2=\"84\" y2=\"104.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"78\" y=\"91.2\" width=\"12\" height=\"7.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"108\" y1=\"95.1\" x2=\"108\" y2=\"141.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"102\" y=\"99\" width=\"12\" height=\"39\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"132\" y1=\"134.1\" x2=\"132\" y2=\"188.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"126\" y=\"138\" width=\"12\" height=\"46.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"156\" y1=\"180.9\" x2=\"156\" y2=\"230.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"150\" y=\"184.8\" width=\"12\" height=\"41.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"180\" y1=\"222.5\" x2=\"180\" y2=\"266.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"174\" y=\"226.4\" width=\"12\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"204\" y1=\"248.5\" x2=\"204\" y2=\"266.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"198\" y=\"252.4\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"228\" y1=\"213.4\" x2=\"228\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"222\" y=\"216\" width=\"12\" height=\"36.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"252\" y1=\"200.4\" x2=\"252\" y2=\"221.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"246\" y=\"208.2\" width=\"12\" height=\"7.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"276\" y1=\"200.4\" x2=\"276\" y2=\"221.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"270\" y=\"208.2\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"300\" y1=\"165.3\" x2=\"300\" y2=\"217.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"294\" y=\"169.2\" width=\"12\" height=\"44.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"324\" y1=\"134.1\" x2=\"324\" y2=\"173.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"318\" y=\"138\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"348\" y1=\"108.1\" x2=\"348\" y2=\"141.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"342\" y=\"112\" width=\"12\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"372\" y1=\"93.8\" x2=\"372\" y2=\"114.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"366\" y=\"101.6\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"396\" y1=\"97.7\" x2=\"396\" y2=\"136.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"390\" y=\"101.6\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"420\" y1=\"128.9\" x2=\"420\" y2=\"173.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"414\" y=\"132.8\" width=\"12\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"444\" y1=\"165.3\" x2=\"444\" y2=\"201.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"438\" y=\"169.2\" width=\"12\" height=\"28.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"380\" y1=\"78.2\" x2=\"470\" y2=\"78.2\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"82.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">stop</text><line x1=\"380\" y1=\"106.8\" x2=\"470\" y2=\"106.8\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"110.8\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">short</text><line x1=\"380\" y1=\"200.4\" x2=\"470\" y2=\"200.4\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"476\" y=\"204.4\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">cover</text><line x1=\"540\" y1=\"153.6\" x2=\"540\" y2=\"116.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"540,109.4 536.5,116.4 543.5,116.4\" fill=\"#22c55e\"/><line x1=\"540\" y1=\"153.6\" x2=\"540\" y2=\"190.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"540,197.8 543.5,190.8 536.5,190.8\" fill=\"#22c55e\"/><text x=\"548\" y=\"153.6\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">profit</text><text x=\"548\" y=\"167.6\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">margin</text></svg>", "caption": "Supply/demand pair: short at the first revisit of supply (stop just above it) and cover at the proximal line of the demand below - the room between them is the profit margin."}
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
  "images": [
   {"src": "/lessons/seiden/p026-022.jpg", "caption": "OTA slide 'Entries: First Pullback / Breakout' (repeated): low-risk entry at the base after a rally (left) or as price breaks up out of a base (right), with the profit zone up to the red supply line.", "notes": ["These are the only two entry types in the rules: breakout and first pullback.", "Both entries are at demand, so the stop is close.", "The profit zone must be at least 3x the risk to target 1."]},
   {"src": "/lessons/seiden/p027-023.jpg", "caption": "Russell 2000 futures, intraday (8/28-8/29): after a drop from about 795, a long cluster around 776-782 is circled; price then broke down to about 769.90.", "notes": ["The circled cluster is the first supply level above price after the breakdown.", "Short the first rally back into it.", "Long time at a level means it was near balance while it formed - the breakdown shows sellers won."]},
   {"src": "/lessons/seiden/p028-024.jpg", "caption": "Euro/Pound cash forex, intraday (8/29): supply about 0.6788-0.6795 (red lines) at a small top base, a dramatic slide to about 0.6765, then price stabilising at 0.67725.", "notes": ["Small base, dramatic departure = high-quality supply.", "Mark one supply and one demand per market each day on a larger intraday timeframe.", "Very active non-dollar pairs work with the same rules."]},
   {"src": "/lessons/seiden/p028-025.jpg", "caption": "10-Year Note futures, intraday (8/24-8/30): demand about 108'22-108'27 (green lines) at the 8/27 base, a strong rally and gap to about 109'24 (now 109'18.5).", "notes": ["Nearest demand below price - buy the first revisit.", "The strong rally away from the base confirms the imbalance.", "Pre-set entry, stop and target before price arrives."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Two entry types: first pullback and breakout</text><line x1=\"30\" y1=\"97.6\" x2=\"290\" y2=\"97.6\" stroke=\"#ef4444\" stroke-width=\"1.8\"/><rect x=\"30\" y=\"231\" width=\"260\" height=\"36.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"42\" y1=\"231\" x2=\"42\" y2=\"267.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"36.5\" y=\"235.6\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"62\" y1=\"231\" x2=\"62\" y2=\"263.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56.5\" y=\"235.6\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"82\" y1=\"231\" x2=\"82\" y2=\"265.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"76.5\" y=\"237.9\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"102\" y1=\"204.6\" x2=\"102\" y2=\"241.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"96.5\" y=\"208\" width=\"11\" height=\"29.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"122\" y1=\"167.8\" x2=\"122\" y2=\"211.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"116.5\" y=\"171.2\" width=\"11\" height=\"36.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"142\" y1=\"135.6\" x2=\"142\" y2=\"174.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136.5\" y=\"139\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"162\" y1=\"97.6\" x2=\"162\" y2=\"143.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"156.5\" y=\"106.8\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"182\" y1=\"103.3\" x2=\"182\" y2=\"133.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"176.5\" y=\"106.8\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"202\" y1=\"126.3\" x2=\"202\" y2=\"160.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"196.5\" y=\"129.8\" width=\"11\" height=\"27.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"222\" y1=\"153.9\" x2=\"222\" y2=\"193.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216.5\" y=\"157.4\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"242\" y1=\"186.2\" x2=\"242\" y2=\"225.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"236.5\" y=\"189.6\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"262\" y1=\"228.7\" x2=\"262\" y2=\"249.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"256.5\" y=\"221.8\" width=\"11\" height=\"9.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"282\" y1=\"195.3\" x2=\"282\" y2=\"234.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"276.5\" y=\"198.8\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"160\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">First pullback</text><line x1=\"296\" y1=\"217.2\" x2=\"296\" y2=\"115.8\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"296,106.8 291.5,115.8 300.5,115.8\" fill=\"#f59e0b\"/><text x=\"292\" y=\"162\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">profit zone</text><text x=\"160\" y=\"330\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">low-risk entry at the first return</text><line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><line x1=\"340\" y1=\"97.6\" x2=\"610\" y2=\"97.6\" stroke=\"#ef4444\" stroke-width=\"1.8\"/><line x1=\"340\" y1=\"152.8\" x2=\"610\" y2=\"152.8\" stroke=\"#ef4444\" stroke-width=\"1.8\"/><rect x=\"340\" y=\"221.8\" width=\"270\" height=\"36.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"352\" y1=\"97.6\" x2=\"352\" y2=\"139\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"346.5\" y=\"106.8\" width=\"11\" height=\"27.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"372\" y1=\"97.6\" x2=\"372\" y2=\"139\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"366.5\" y=\"102.2\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"392\" y1=\"98.8\" x2=\"392\" y2=\"151.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"386.5\" y=\"102.2\" width=\"11\" height=\"46\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"412\" y1=\"144.8\" x2=\"412\" y2=\"183.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"406.5\" y=\"148.2\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"432\" y1=\"176.9\" x2=\"432\" y2=\"216.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"426.5\" y=\"180.4\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"452\" y1=\"209.2\" x2=\"452\" y2=\"234.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"446.5\" y=\"212.6\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"472\" y1=\"226.4\" x2=\"472\" y2=\"258.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"466.5\" y=\"231\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"492\" y1=\"221.8\" x2=\"492\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"486.5\" y=\"228.7\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"512\" y1=\"221.8\" x2=\"512\" y2=\"256.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"506.5\" y=\"228.7\" width=\"11\" height=\"16.1\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"532\" y1=\"221.8\" x2=\"532\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"526.5\" y=\"224.1\" width=\"11\" height=\"20.7\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"552\" y1=\"186.2\" x2=\"552\" y2=\"227.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"546.5\" y=\"189.6\" width=\"11\" height=\"34.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"475\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">Breakout</text><line x1=\"568\" y1=\"203.4\" x2=\"568\" y2=\"164.1\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"568,155.1 563.5,164.1 572.5,164.1\" fill=\"#f59e0b\"/><text x=\"576\" y=\"180.4\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">profit zone</text><text x=\"475\" y=\"330\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">entry as price leaves the base</text></svg>", "caption": "The two entries: the first pullback into a fresh demand zone, and the breakout as price leaves a base. Both need room (profit zone) up to the next supply line."}
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
  "images": [
   {"src": "/lessons/seiden/p029-026.jpg", "caption": "Diagram 'Any and all influences on price are reflected in price': earnings, news, statements, Fed, economic reports, terror alerts, tips, brokers, upgrades/downgrades, analyst opinions and technical indicators feed 'Thoughts and Perceptions', which become ACTION - Buy or Sell.", "notes": ["Every influence ends up as a buy or sell order at a price.", "So the chart already contains the news; price is the only data you need.", "Indicators are just one more input to people's beliefs, and they lag price."]},
   {"src": "/lessons/seiden/p030-027.jpg", "caption": "DOW Mini CBOT futures, daily (Apr-Aug, with volume): demand about 12,900-12,990 (green lines) at a two-candle base in late April that gapped up; trend to near 14,000, now dropped to 13,237 on rising volume.", "notes": ["A gap out of a small base marks strong demand.", "No buying until price reaches the green lines - the middle of the move is not a level.", "Rising volume on the decline is not a reason to buy early."]},
   {"src": "/lessons/seiden/p031-028.jpg", "caption": "DOW Mini, intraday (8/9-8/13, with volume): supply about 13,480-13,550 (red lines) at a small base, followed by a steep drop in large red candles to about 13,110; price back near 13,245.", "notes": ["Small base and large red candles away = strong supply.", "Day traders short the zone if volatility brings price back to it.", "The drop from the base shows the profit margin."]},
   {"src": "/lessons/seiden/p032-029.jpg", "caption": "QQQQ, intraday (8/9-8/13, with volume): supply about 48.12-48.33 (red lines) at a small base after an opening drop; price fell to about 46.7 and is at 47.38.", "notes": ["Same supply logic in the ETF for traders who do not trade futures.", "Short at the first return, stop above the upper red line.", "Compare the zone with the Dow chart: the same supply shows up across related markets."]},
   {"src": "/lessons/seiden/p033-030.jpg", "caption": "USD/JPY cash forex, daily (Jul-Aug): supply about 121.65-122.6 (red lines) at a mid-July base after a tall red candle from about 123.4, then a sharp slide to about 117.2 (now 118.207).", "notes": ["Far from price, but well placed high on the big-picture curve.", "A swing short from the zone has a very large profit margin down to the 117 area.", "Fresh daily supply after a strong departure - patience until price returns."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Everything ends up as an order at a price</text><rect x=\"24\" y=\"70\" width=\"170\" height=\"36\" rx=\"6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"109\" y=\"93\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">News, earnings</text><line x1=\"196\" y1=\"88\" x2=\"248.4\" y2=\"174\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><polygon points=\"252,180 251.4,172.2 245.4,175.8\" fill=\"#94a3b8\"/><rect x=\"24\" y=\"122\" width=\"170\" height=\"36\" rx=\"6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"109\" y=\"145\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">Fed, economic reports</text><line x1=\"196\" y1=\"140\" x2=\"246.3\" y2=\"175.9\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><polygon points=\"252,180 248.3,173.1 244.3,178.8\" fill=\"#94a3b8\"/><rect x=\"24\" y=\"174\" width=\"170\" height=\"36\" rx=\"6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"109\" y=\"197\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">Upgrades, analyst opinion</text><line x1=\"196\" y1=\"192\" x2=\"245.2\" y2=\"181.5\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><polygon points=\"252,180 244.4,178 245.9,184.9\" fill=\"#94a3b8\"/><rect x=\"24\" y=\"226\" width=\"170\" height=\"36\" rx=\"6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"109\" y=\"249\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">Tips, brokers</text><line x1=\"196\" y1=\"244\" x2=\"247.4\" y2=\"185.3\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><polygon points=\"252,180 244.8,183 250,187.6\" fill=\"#94a3b8\"/><rect x=\"24\" y=\"278\" width=\"170\" height=\"36\" rx=\"6\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"109\" y=\"301\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\">Technical indicators</text><line x1=\"196\" y1=\"296\" x2=\"249\" y2=\"186.3\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><polygon points=\"252,180 245.8,184.8 252.1,187.8\" fill=\"#94a3b8\"/><rect x=\"256\" y=\"140\" width=\"130\" height=\"80\" rx=\"8\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.8\"/><text x=\"321\" y=\"175\" fill=\"#a78bfa\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">Thoughts and</text><text x=\"321\" y=\"193\" fill=\"#a78bfa\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">perceptions</text><line x1=\"388\" y1=\"180\" x2=\"421\" y2=\"180\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"430,180 421,175.5 421,184.5\" fill=\"#f59e0b\"/><rect x=\"432\" y=\"120\" width=\"180\" height=\"120\" rx=\"8\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.8\"/><text x=\"522\" y=\"150\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">ACTION</text><text x=\"522\" y=\"176\" fill=\"#22c55e\" font-size=\"16\" text-anchor=\"middle\" font-weight=\"700\">BUY</text><text x=\"522\" y=\"198\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">or</text><text x=\"522\" y=\"222\" fill=\"#ef4444\" font-size=\"16\" text-anchor=\"middle\" font-weight=\"700\">SELL</text><text x=\"432\" y=\"280\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\">The chart records every action,</text><text x=\"432\" y=\"298\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\">so price alone shows where</text><text x=\"432\" y=\"316\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\">buyers and sellers are out</text><text x=\"432\" y=\"334\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\">of balance.</text></svg>", "caption": "Any and all influences pass through beliefs and become a buy or sell order at a price - so supply and demand on the chart already contain them."}
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
  "images": [
   {"src": "/lessons/seiden/p034-031.jpg", "caption": "S&P, intraday (4/20-4/25): A = small flat base about 1479.5-1481.5 (green lines), B = bracketed rally to about 1494, C = a sharp drop back into the zone on 4/24 that reversed immediately; price then rallied to 1502.50.", "notes": ["A looks like equilibrium while it forms; only the move B proves it was out of balance.", "C is the first return - the low-risk buy with the stop just below the lower green line.", "The sharp drop into C is novice selling into demand."]},
   {"src": "/lessons/seiden/p035-032.jpg", "caption": "S&P, intraday (9:30-13:30): A = base about 1452.7-1454 (red lines) at the open, B = bracketed drop to about 1447.5, C = first revisit near 1453 around 12:00-12:30, after which price fell to about 1446.", "notes": ["Same A-B-C logic at supply: base, strong decline, first return.", "Short at the lower red line with the stop above the upper one.", "The slow rally into C contrasts with the fast drop out of A - the imbalance is still there."]},
   {"src": "/lessons/seiden/p036-033.jpg", "caption": "S&P E-mini CME, intraday (7/30-8/6): 'Supply' arrow at a small base, zone about 1465-1471.50 (red lines), followed by a sharp decline to 1443.25.", "notes": ["Plan: let price rally into the zone and short as it declines from it (about 1464 or higher), stop 1472.", "Demand lower near 1430 is the opposing level.", "High on the curve plus a dramatic drop - treated as a swing trade."]},
   {"src": "/lessons/seiden/p037-034.jpg", "caption": "Canadian Dollar CME futures, intraday (8/4-8/5): a huge green spike from about .9470 to .9530, a base about .9500-.9511 (red lines), then a drop to .9469.", "notes": ["Rally-base-drop: the base after the spike is supply.", "Zone .9500-.9515, entry about .9495-.9498 as price declines from it, stop .9517.", "High on the curve plus a dramatic drop = swing trade."]},
   {"src": "/lessons/seiden/p038-035.jpg", "caption": "Crude oil NYMEX, intraday (8/2-8/5): after a range near 77, price dropped through a small base around 75.75-76.15 (red lines) to 75.20.", "notes": ["Drop-base-drop: the small base inside the decline is supply.", "Zone 75.85-76.30, entry about 75.80-75.85 on the decline from the level, stop 76.35.", "High on the curve, so a swing rather than a day trade."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">A-B-C at demand</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A = pause, B = move away that proves the imbalance, C = first return</text><rect x=\"90\" y=\"249.8\" width=\"430\" height=\"20.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"85\" y=\"253.8\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"end\">proximal</text><text x=\"85\" y=\"274.6\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"end\">distal</text><line x1=\"104\" y1=\"238.1\" x2=\"104\" y2=\"261.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"97.5\" y=\"242\" width=\"13\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"130\" y1=\"252.4\" x2=\"130\" y2=\"270.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"123.5\" y=\"257.6\" width=\"13\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"156\" y1=\"249.8\" x2=\"156\" y2=\"268\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"149.5\" y=\"255\" width=\"13\" height=\"7.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"182\" y1=\"249.8\" x2=\"182\" y2=\"268\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"255\" width=\"13\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"208\" y1=\"206.9\" x2=\"208\" y2=\"264.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"201.5\" y=\"210.8\" width=\"13\" height=\"49.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"234\" y1=\"165.3\" x2=\"234\" y2=\"214.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"227.5\" y=\"169.2\" width=\"13\" height=\"41.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"260\" y1=\"144.5\" x2=\"260\" y2=\"173.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"253.5\" y=\"148.4\" width=\"13\" height=\"20.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"286\" y1=\"144.5\" x2=\"286\" y2=\"162.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"279.5\" y=\"148.4\" width=\"13\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"312\" y1=\"149.7\" x2=\"312\" y2=\"162.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"305.5\" y=\"153.6\" width=\"13\" height=\"5.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"338\" y1=\"149.7\" x2=\"338\" y2=\"183.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"331.5\" y=\"153.6\" width=\"13\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"364\" y1=\"175.7\" x2=\"364\" y2=\"209.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"357.5\" y=\"179.6\" width=\"13\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"390\" y1=\"201.7\" x2=\"390\" y2=\"230.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"383.5\" y=\"205.6\" width=\"13\" height=\"20.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"416\" y1=\"223.8\" x2=\"416\" y2=\"257.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"409.5\" y=\"226.4\" width=\"13\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"442\" y1=\"212.1\" x2=\"442\" y2=\"256.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"435.5\" y=\"216\" width=\"13\" height=\"36.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"468\" y1=\"170.5\" x2=\"468\" y2=\"219.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"461.5\" y=\"174.4\" width=\"13\" height=\"41.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"494\" y1=\"134.1\" x2=\"494\" y2=\"178.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"487.5\" y=\"138\" width=\"13\" height=\"36.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><circle cx=\"156\" cy=\"292.6\" r=\"11\" fill=\"#94a3b8\"/><text x=\"156\" y=\"296.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><path d=\"M 196 242.0 Q 182 195.2 250 138.0\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><circle cx=\"174\" cy=\"179.6\" r=\"11\" fill=\"#94a3b8\"/><text x=\"174\" y=\"183.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><circle cx=\"416\" cy=\"292.6\" r=\"11\" fill=\"#f59e0b\"/><text x=\"416\" y=\"296.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">C</text><line x1=\"400\" y1=\"249.8\" x2=\"520\" y2=\"249.8\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"253.8\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">buy C at proximal</text><line x1=\"400\" y1=\"281\" x2=\"520\" y2=\"281\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"285\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">stop below distal</text><line x1=\"400\" y1=\"187.4\" x2=\"520\" y2=\"187.4\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"191.4\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">target 3:1</text></svg>", "caption": "A-B-C at demand (S&P example): small base A, rally B, first return C = buy at the proximal line, stop below the distal line."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">A-B-C at supply</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A = pause, B = move away that proves the imbalance, C = first return</text><rect x=\"90\" y=\"160\" width=\"430\" height=\"21\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"85\" y=\"185\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\">proximal</text><text x=\"85\" y=\"164\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\">distal</text><line x1=\"104\" y1=\"167.5\" x2=\"104\" y2=\"194.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"97.5\" y=\"172\" width=\"13\" height=\"18\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"130\" y1=\"160\" x2=\"130\" y2=\"178\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"123.5\" y=\"166\" width=\"13\" height=\"6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"156\" y1=\"160\" x2=\"156\" y2=\"181\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"149.5\" y=\"166\" width=\"13\" height=\"9\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"182\" y1=\"160\" x2=\"182\" y2=\"178\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"169\" width=\"13\" height=\"6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"208\" y1=\"164.5\" x2=\"208\" y2=\"230.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"201.5\" y=\"169\" width=\"13\" height=\"57\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"234\" y1=\"221.5\" x2=\"234\" y2=\"278.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"227.5\" y=\"226\" width=\"13\" height=\"48\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"260\" y1=\"269.5\" x2=\"260\" y2=\"302.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"253.5\" y=\"274\" width=\"13\" height=\"24\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"286\" y1=\"281.5\" x2=\"286\" y2=\"302.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"279.5\" y=\"286\" width=\"13\" height=\"12\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"312\" y1=\"281.5\" x2=\"312\" y2=\"296.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"305.5\" y=\"286\" width=\"13\" height=\"6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"338\" y1=\"257.5\" x2=\"338\" y2=\"296.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"331.5\" y=\"262\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"364\" y1=\"227.5\" x2=\"364\" y2=\"266.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"357.5\" y=\"232\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"390\" y1=\"203.5\" x2=\"390\" y2=\"236.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"383.5\" y=\"208\" width=\"13\" height=\"24\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"416\" y1=\"172\" x2=\"416\" y2=\"211\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"409.5\" y=\"178\" width=\"13\" height=\"30\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"442\" y1=\"173.5\" x2=\"442\" y2=\"224.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"435.5\" y=\"178\" width=\"13\" height=\"42\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"468\" y1=\"215.5\" x2=\"468\" y2=\"272.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"461.5\" y=\"220\" width=\"13\" height=\"48\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"494\" y1=\"263.5\" x2=\"494\" y2=\"314.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"487.5\" y=\"268\" width=\"13\" height=\"42\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><circle cx=\"156\" cy=\"138\" r=\"11\" fill=\"#94a3b8\"/><text x=\"156\" y=\"141.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><path d=\"M 196 172.0 Q 182 226.0 250 298.0\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><circle cx=\"174\" cy=\"244\" r=\"11\" fill=\"#94a3b8\"/><text x=\"174\" y=\"247.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><circle cx=\"416\" cy=\"138\" r=\"11\" fill=\"#f59e0b\"/><text x=\"416\" y=\"141.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">C</text><line x1=\"400\" y1=\"181\" x2=\"520\" y2=\"181\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"185\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">sell on decline</text><line x1=\"400\" y1=\"148\" x2=\"520\" y2=\"148\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"152\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">stop above distal</text><line x1=\"400\" y1=\"265\" x2=\"520\" y2=\"265\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"526\" y=\"269\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">target 3:1</text></svg>", "caption": "A-B-C at supply (futures shorts): base A, drop B, rally back to C; sell as price declines from the zone with the stop just above the distal line."}
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
  "images": [
   {"src": "/lessons/seiden/p039-036.jpg", "caption": "Walt Disney DIS, daily 'Before': supply A about 35.2-35.9 (red lines) at a small base, bracket B the steep drop to about 33.4, a circle where the two moving averages cross at the zone, and C (dashed box) the expected first revisit.", "notes": ["A-B-C on a daily chart: base, strong departure, wait for the first return.", "The moving-average cross right at the zone adds weight to the supply.", "C is planned in advance - the order waits at the zone."]},
   {"src": "/lessons/seiden/p039-037.jpg", "caption": "DIS daily 'After': price came back into the red lines (about 35.2-35.85) in July, stalled, then dropped in tall red candles toward about 33.9 - the first target.", "notes": ["The planned first revisit (C) held exactly as expected.", "Short at the lower red line, stop above the upper one, target the prior low area.", "Patience paid: the trade only existed because the level was marked weeks earlier."]},
   {"src": "/lessons/seiden/p040-038.jpg", "caption": "SMH, intraday (7/23-7/30): supply about 39.10-39.45 (red lines) at a 7/24-7/25 base, then a steady slide to 37.73.", "notes": ["SMH is used as a guide for semiconductor shorts.", "Base after a pop, then a decline - supply above price.", "When the sector ETF has supply overhead, look for the same setup in its stocks."]},
   {"src": "/lessons/seiden/p041-039.jpg", "caption": "NVLS, intraday (7/23-7/30): 'Resistance (supply)' about 31.00-31.30 at a small base before a big red drop; price slid to 28.62.", "notes": ["Exact plan: short 31.00-31.35, stop 31.46.", "Large red candle out of the base = strong supply.", "The stock confirms what the SMH sector chart shows."]},
   {"src": "/lessons/seiden/p042-040.jpg", "caption": "IBM, daily (Jul-Aug): 'Support (demand)' about 108-109.7 (green lines) at a mid-July base of small candles, followed by a gap up to about 118 (now 115.62).", "notes": ["Exact plan: buy 108.10-109.10, stop 107.75.", "A gap away from a base of small candles marks strong demand.", "Large profit margin back up to the 118 area."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Moving-average cross at a supply zone</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Daily A-B-C: the first return to where the averages crossed often holds</text><rect x=\"40\" y=\"112\" width=\"540\" height=\"26\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"585\" y=\"142\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"585\" y=\"116\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"50\" y1=\"76.9\" x2=\"50\" y2=\"95.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"80.8\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"76\" y1=\"87.3\" x2=\"76\" y2=\"105.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"91.2\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"102\" y1=\"97.7\" x2=\"102\" y2=\"121.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"96\" y=\"101.6\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"128\" y1=\"112\" x2=\"128\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"122\" y=\"117.2\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"154\" y1=\"112\" x2=\"154\" y2=\"135.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"148\" y=\"119.8\" width=\"12\" height=\"7.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"180\" y1=\"114.6\" x2=\"180\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"174\" y=\"119.8\" width=\"12\" height=\"13\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"206\" y1=\"128.9\" x2=\"206\" y2=\"178.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"132.8\" width=\"12\" height=\"41.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"232\" y1=\"170.5\" x2=\"232\" y2=\"214.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"174.4\" width=\"12\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"258\" y1=\"206.9\" x2=\"258\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"252\" y=\"210.8\" width=\"12\" height=\"20.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"284\" y1=\"227.7\" x2=\"284\" y2=\"245.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"278\" y=\"231.6\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"310\" y1=\"222.5\" x2=\"310\" y2=\"245.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"304\" y=\"226.4\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"336\" y1=\"222.5\" x2=\"336\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"330\" y=\"226.4\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"362\" y1=\"201.7\" x2=\"362\" y2=\"235.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"356\" y=\"205.6\" width=\"12\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"388\" y1=\"186.1\" x2=\"388\" y2=\"209.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"382\" y=\"190\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"414\" y1=\"186.1\" x2=\"414\" y2=\"199.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"408\" y=\"190\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"440\" y1=\"160.1\" x2=\"440\" y2=\"199.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"164\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"466\" y1=\"127.6\" x2=\"466\" y2=\"166.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460\" y=\"132.8\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"492\" y1=\"128.9\" x2=\"492\" y2=\"167.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"486\" y=\"132.8\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"518\" y1=\"160.1\" x2=\"518\" y2=\"199.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"512\" y=\"164\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><path d=\"M 40 70.4 C 120 91.19999999999999 160 138.0 230 190.0 S 330 231.6 400 200.4 S 500 153.6 540 164.0\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"2\"/><path d=\"M 40 101.6 C 130 106.80000000000001 180 122.4 260 153.6 S 380 184.8 440 179.6 S 520 164.0 560 169.2\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2\"/><circle cx=\"150\" cy=\"125.0\" r=\"18\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><text x=\"150\" y=\"99\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">cross at zone</text><text x=\"40\" y=\"340\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">fast MA</text><text x=\"110\" y=\"340\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"start\">slow MA</text><circle cx=\"466\" cy=\"92\" r=\"11\" fill=\"#f59e0b\"/><text x=\"466\" y=\"95.6\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">C</text><line x1=\"510\" y1=\"138\" x2=\"535.5\" y2=\"182.2\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"540,190 539.4,180 531.6,184.5\" fill=\"#ef4444\"/></svg>", "caption": "Disney idea in a diagram: supply base A where the moving averages cross, a strong drop B, and the first return C as the low-risk short."}
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
  "images": [
   {"src": "/lessons/seiden/p044-041.jpg", "caption": "SPY (S&P ETF, weekly, 2006-2008): 'Support 1' about 137 drawn from a small base during the 2006 rally and revisited several times in 2007; 'Support 2' about 129-132 (two green lines) at the earlier origin of the rally, still unvisited, with the rising 200 MA reaching it around 129.", "notes": ["Support 1 has been touched many times - each visit removed demand, so it is weakening.", "Support 2 is fresh and coincides with the 200 MA - the higher-quality demand.", "Ask the checklist questions before trading either level."]},
   {"src": "/lessons/seiden/p045-042.jpg", "caption": "QQQQ (NASDAQ ETF, intraday, 12/11-12/20): 'Resistance' about 51.10-51.55 (red lines) at a 12/13-12/14 base after a fall from about 52.7, with a down-sloping 200 MA running through the zone; a dramatic drop to about 49.2 followed (now 49.92).", "notes": ["A down-sloping 200 MA confirms the downtrend, so shorting resistance is with the trend.", "Swing and day traders can short the first return to the range.", "The dramatic drop away from the base shows the imbalance."]},
   {"src": "/lessons/seiden/p046-043.jpg", "caption": "XLF (Financial Service ETF, weekly, 2003-2008): 'Support' about 25.0-26.2 (green lines) from the 2003 base at the start of the multi-year uptrend; price has fallen fast from about 38 to about 29, below the 200 MA, toward the unvisited demand.", "notes": ["An old, never-revisited demand level is waiting below price.", "Price below a falling 200 MA - wait for the level instead of buying the decline.", "Sets up the 'Trading and Time' lesson that follows."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Support gets weaker with every revisit</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Each touch fills buy orders; the fresh level below is better</text><rect x=\"40\" y=\"190\" width=\"560\" height=\"15.6\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"150\" y=\"249.6\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">Support 1 (above): touched 4 times</text><rect x=\"40\" y=\"262.8\" width=\"560\" height=\"26\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"600\" y=\"304.8\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\">Support 2: fresh, unvisited</text><polyline points=\"40,299.2 70,283.6 90,242 120,195.2 160,132.8 200,187.4 250,112 290,190 340,96.4 380,192.6 430,122.4 470,195.2 520,164 560,226.4\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"200\" cy=\"221.6\" r=\"9\" fill=\"#22c55e\"/><text x=\"200\" y=\"225.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">1</text><circle cx=\"290\" cy=\"221.6\" r=\"9\" fill=\"#f59e0b\"/><text x=\"290\" y=\"225.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">2</text><circle cx=\"380\" cy=\"221.6\" r=\"9\" fill=\"#f59e0b\"/><text x=\"380\" y=\"225.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">3</text><circle cx=\"470\" cy=\"221.6\" r=\"9\" fill=\"#ef4444\"/><text x=\"470\" y=\"225.2\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">4</text><path d=\"M 40 325.2 C 200 314.8 380 294.0 600 273.2\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2\"/><text x=\"250\" y=\"327.6\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"start\">200 MA rising toward Support 2</text></svg>", "caption": "Repeated tests weaken a support level; a fresh, unvisited level below - especially where a rising 200 MA meets it - is the better demand."}
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
  "images": [
   {"src": "/lessons/seiden/p047-044.jpg", "caption": "XLF (Financial Service Sector ETF, weekly, 2004-2008): 'Demand (support)' about 25-26 (green lines) from the 2003 base; price collapsed from about 38 to 27.41, and the arrow marks the 'Low Risk High Reward Buying Opportunity' at the zone.", "notes": ["The demand level is years old but untouched - price returning there is far from equilibrium.", "Buy at the proximal line with a stop under the distal line: small risk, large profit margin.", "Price gained about $2 in two days after reaching the level."]},
   {"src": "/lessons/seiden/p048-045.jpg", "caption": "Stick-figure supply/demand curve: red sellers grow with price (3 at 40, 7 at 50, 14 at 60) and green buyers grow as price falls (3 at 30, 7 at 20, 13 at 10).", "notes": ["It is a chart with time removed: the number of willing buyers and sellers at each price.", "The further price moves from equilibrium, the more the other side outnumbers it.", "Old levels far from current price are where the imbalance is greatest."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Supply and demand curve - a chart with time removed</text><text x=\"60\" y=\"86\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">60.00</text><rect x=\"72\" y=\"70\" width=\"364\" height=\"24\" rx=\"3\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"442\" y=\"86\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">14 sellers</text><text x=\"60\" y=\"132\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">50.00</text><rect x=\"72\" y=\"116\" width=\"182\" height=\"24\" rx=\"3\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"260\" y=\"132\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">7 sellers</text><text x=\"60\" y=\"178\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">40.00</text><rect x=\"72\" y=\"162\" width=\"78\" height=\"24\" rx=\"3\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"156\" y=\"178\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">3 sellers</text><text x=\"60\" y=\"224\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">30.00</text><rect x=\"72\" y=\"208\" width=\"78\" height=\"24\" rx=\"3\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"156\" y=\"224\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">3 buyers</text><text x=\"60\" y=\"270\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">20.00</text><rect x=\"72\" y=\"254\" width=\"182\" height=\"24\" rx=\"3\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"260\" y=\"270\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">7 buyers</text><text x=\"60\" y=\"316\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\">10.00</text><rect x=\"72\" y=\"300\" width=\"338\" height=\"24\" rx=\"3\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"416\" y=\"316\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">13 buyers</text><line x1=\"66\" y1=\"197\" x2=\"470\" y2=\"197\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"201\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\">equilibrium</text><text x=\"400\" y=\"128\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">More sellers the higher</text><text x=\"400\" y=\"142\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">price goes</text><text x=\"400\" y=\"252\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">More buyers the lower</text><text x=\"400\" y=\"266\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">price goes</text></svg>", "caption": "The supply/demand curve: willing sellers grow as price rises and willing buyers grow as it falls. The further price is from equilibrium, the bigger the imbalance."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Old levels are often the best levels</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Price returning after years is far from equilibrium</text><rect x=\"30\" y=\"278.4\" width=\"570\" height=\"26\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"36\" y=\"320.4\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">2003 demand base</text><polyline points=\"30,320 60,294 80,288.8 110,262.8 150,231.6 180,242 220,200.4 260,216 300,169.2 340,179.6 380,127.6 420,143.2 450,86 480,112 510,153.6 540,205.6 565,273.2\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><line x1=\"470\" y1=\"278.4\" x2=\"600\" y2=\"278.4\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"600\" y=\"272.4\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">buy at proximal</text><line x1=\"590\" y1=\"183.5\" x2=\"590\" y2=\"268.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"590,275.8 593.5,268.8 586.5,268.8\" fill=\"#22c55e\"/><line x1=\"590\" y1=\"183.5\" x2=\"590\" y2=\"98.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"590,91.2 586.5,98.2 593.5,98.2\" fill=\"#22c55e\"/><text x=\"582\" y=\"177\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\">large profit margin</text></svg>", "caption": "XLF lesson: a demand level from 2003 that price had never revisited. When price finally returns, it is far from equilibrium, so the reaction and the profit margin are large."}
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
  "images": [
   {"src": "/lessons/seiden/p050-046.jpg", "caption": "OTA intraday chart with volume (11:00-16:00): A = range (red top line, green bottom line); B = long red candle breaking below the range low around 14:00; C = tall green candle rallying back to the broken low (red line) on above-average volume; D = confirmation candle; E = short entry; price then declines.", "notes": ["After the break, the old range low becomes supply.", "C is the novice: buying after a rally, into supply, in a falling market - with heavy volume.", "Short below the D confirmation candle with the stop above C; target the B low and lower."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Find the novice: range break, then the rally into supply</text><line x1=\"40\" y1=\"88.6\" x2=\"330\" y2=\"88.6\" stroke=\"#ef4444\" stroke-width=\"1.8\"/><line x1=\"40\" y1=\"129.4\" x2=\"330\" y2=\"129.4\" stroke=\"#22c55e\" stroke-width=\"1.8\"/><rect x=\"300\" y=\"125.4\" width=\"300\" height=\"12.2\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><line x1=\"50\" y1=\"97.8\" x2=\"50\" y2=\"120.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"100.9\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"76\" y1=\"97.8\" x2=\"76\" y2=\"116.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"100.9\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"102\" y1=\"89.7\" x2=\"102\" y2=\"116.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"96\" y=\"92.7\" width=\"12\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"128\" y1=\"89.7\" x2=\"128\" y2=\"112.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"122\" y=\"92.7\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"154\" y1=\"106\" x2=\"154\" y2=\"128.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"148\" y=\"109\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"180\" y1=\"101.9\" x2=\"180\" y2=\"128.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"174\" y=\"105\" width=\"12\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"206\" y1=\"101.9\" x2=\"206\" y2=\"120.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"105\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"232\" y1=\"93.7\" x2=\"232\" y2=\"120.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"96.8\" width=\"12\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"258\" y1=\"93.7\" x2=\"258\" y2=\"116.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"252\" y=\"96.8\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"284\" y1=\"110.1\" x2=\"284\" y2=\"128.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"278\" y=\"113.1\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"310\" y1=\"123.3\" x2=\"310\" y2=\"198.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"304\" y=\"125.4\" width=\"12\" height=\"53\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"336\" y1=\"175.3\" x2=\"336\" y2=\"193.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"330\" y=\"178.4\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"362\" y1=\"167.2\" x2=\"362\" y2=\"193.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"356\" y=\"170.2\" width=\"12\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"388\" y1=\"167.2\" x2=\"388\" y2=\"185.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"382\" y=\"170.2\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"414\" y1=\"163.1\" x2=\"414\" y2=\"185.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"408\" y=\"166.2\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"440\" y1=\"163.1\" x2=\"440\" y2=\"177.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"166.2\" width=\"12\" height=\"8.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"466\" y1=\"125.4\" x2=\"466\" y2=\"176.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460\" y=\"129.4\" width=\"12\" height=\"44.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"492\" y1=\"127.4\" x2=\"492\" y2=\"145.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"486\" y=\"129.4\" width=\"12\" height=\"12.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"518\" y1=\"138.6\" x2=\"518\" y2=\"169.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"512\" y=\"141.7\" width=\"12\" height=\"24.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"544\" y1=\"163.1\" x2=\"544\" y2=\"185.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"538\" y=\"166.2\" width=\"12\" height=\"16.3\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"570\" y1=\"179.4\" x2=\"570\" y2=\"210\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"564\" y=\"182.5\" width=\"12\" height=\"24.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><circle cx=\"140\" cy=\"149.4\" r=\"11\" fill=\"#94a3b8\"/><text x=\"140\" y=\"153\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><circle cx=\"290\" cy=\"178.4\" r=\"11\" fill=\"#94a3b8\"/><text x=\"290\" y=\"182\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><circle cx=\"444\" cy=\"145.8\" r=\"11\" fill=\"#f59e0b\"/><text x=\"444\" y=\"149.4\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">C</text><circle cx=\"494\" cy=\"107.4\" r=\"11\" fill=\"#f59e0b\"/><text x=\"494\" y=\"111\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">D</text><line x1=\"538\" y1=\"145.8\" x2=\"515\" y2=\"145.8\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"506,145.8 515,150.3 515,141.3\" fill=\"#ef4444\"/><text x=\"542\" y=\"149.8\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"700\">E: short</text><rect x=\"44\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"70\" y=\"326\" width=\"12\" height=\"14\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"96\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"122\" y=\"326\" width=\"12\" height=\"14\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"148\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"174\" y=\"326\" width=\"12\" height=\"14\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"200\" y=\"326\" width=\"12\" height=\"14\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"226\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"252\" y=\"326\" width=\"12\" height=\"14\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"278\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"304\" y=\"277\" width=\"12\" height=\"63\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"330\" y=\"305\" width=\"12\" height=\"35\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"356\" y=\"312\" width=\"12\" height=\"28\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"382\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"408\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"434\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"460\" y=\"284\" width=\"12\" height=\"56\" rx=\"0\" fill=\"#f59e0b\" stroke=\"#f59e0b\" stroke-width=\"0.5\"/><rect x=\"486\" y=\"312\" width=\"12\" height=\"28\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"512\" y=\"312\" width=\"12\" height=\"28\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"538\" y=\"319\" width=\"12\" height=\"21\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"564\" y=\"312\" width=\"12\" height=\"28\" rx=\"0\" fill=\"#94a3b8\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><text x=\"448\" y=\"278\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\">above-average volume</text><line x1=\"40\" y1=\"341\" x2=\"600\" y2=\"341\" stroke=\"#94a3b8\" stroke-width=\"1\"/></svg>", "caption": "Range A breaks at B; the broken low becomes supply. C rallies back into it on above-average volume (novices buying after a rally into supply), D is the confirmation candle, E the short."}
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
  "images": [
   {"src": "/lessons/seiden/p054-047.jpg", "caption": "OTA RIMM chart (intraday, 1/17-1/23, CCI panel): 'Double Top' circles near 91-92 on 1/17 and 1/22; student bought puts at the second top after an $8 run from the morning low; 'Double Bottom' circles around 82 (1/22 low and 1/23 low) where he sold the puts; CCI overbought circled.", "notes": ["The entry was at the prior days' highs (resistance) after a big rally - the novice was buying there.", "The exit was planned at the prior low (demand), where the double bottom formed.", "The low-risk entry, not the size of the profit, is the lesson; CCI only supported the read."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Double top into the prior highs</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Buying after an $8 rally into resistance is the novice side</text><rect x=\"40\" y=\"96.4\" width=\"560\" height=\"20.8\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"46\" y=\"90.4\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\">prior days' highs (resistance)</text><rect x=\"40\" y=\"268\" width=\"560\" height=\"20.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"46\" y=\"304.8\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\">prior low (double bottom)</text><polyline points=\"50,148.4 90,106.8 130,138 170,153.6 210,174.4 240,283.6 270,200.4 310,169.2 350,138 380,106.8 420,112\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><polyline points=\"430,184.8 460,195.2 490,242 520,278.4 550,252.4 580,242\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><line x1=\"420\" y1=\"112\" x2=\"430\" y2=\"184.8\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text x=\"425\" y=\"148.4\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\">gap</text><line x1=\"225\" y1=\"195.2\" x2=\"225\" y2=\"271.4\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><polygon points=\"225,278.4 228.5,271.4 221.5,271.4\" fill=\"#f59e0b\"/><line x1=\"225\" y1=\"195.2\" x2=\"225\" y2=\"119\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><polygon points=\"225,112 221.5,119 228.5,119\" fill=\"#f59e0b\"/><text x=\"218\" y=\"195.2\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"end\" font-weight=\"700\">+$8</text><line x1=\"400\" y1=\"65.2\" x2=\"407.4\" y2=\"90.4\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"410,99 411.8,89.1 403.1,91.6\" fill=\"#ef4444\"/><text x=\"400\" y=\"61.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">buy puts / short</text><line x1=\"530\" y1=\"324\" x2=\"524.3\" y2=\"302.7\" stroke=\"#22c55e\" stroke-width=\"2\"/><polygon points=\"522,294 520,303.9 528.7,301.5\" fill=\"#22c55e\"/><text x=\"540\" y=\"336\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">take profit</text></svg>", "caption": "RIMM trade: after an $8 run from the morning low into the prior highs (a possible double top), short via puts; take profit at the prior low where a double bottom forms."}
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
  "images": [
   {"src": "/lessons/seiden/p057-050.jpg", "caption": "RIMM, 5-minute: 'Descending Triangle' (falling top line, flat bottom line) after a rally; 'Short Entry' at the break of the bottom line; 'Support - Target 1' at a prior pullback low and 'Support - Target 2' at the earlier base, both reached.", "notes": ["A pattern breakout is only worth taking if there is room to the next demand.", "Here target 1 and target 2 gave a good profit margin from the short entry.", "The pattern is just an entry trigger; supply and demand decide whether it works."]},
   {"src": "/lessons/seiden/p058-051.jpg", "caption": "DRYS, 60-minute (12/17-12/28): after a steep decline a small 'Descending Triangle' near 75-77; 'Short Entry' at the break around 75; 'Support - Target' about 71 just below (double arrow); price hit it and later rallied to 82.", "notes": ["The support target sits close to the entry - a much smaller reward-to-risk than the RIMM example.", "The triangle formed low on the curve after a big decline, near demand.", "After the target, price turned up strongly - shorting near demand is the novice side."]},
   {"src": "/lessons/seiden/p059-052.jpg", "caption": "EBAY, 5-minute (12/10-12/11): after a gap up and drift near 34.8-35.0, a tall red candle drops to about 34.45; a small 'Bear Pennant' forms and breaks lower; 'Support - Target' about 33.85 from the prior day's base (double arrow).", "notes": ["The prior day's base is the demand that defines the target.", "The double arrow shows a decent profit margin from the pennant entry.", "Measure that margin before taking any pattern breakout."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">A pattern breakout is only as good as its profit margin</text><line x1=\"50\" y1=\"106.8\" x2=\"50\" y2=\"152.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"44.5\" y=\"116\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"72\" y1=\"112.6\" x2=\"72\" y2=\"142.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"66.5\" y=\"116\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"94\" y1=\"120.6\" x2=\"94\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88.5\" y=\"125.2\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"116\" y1=\"121.8\" x2=\"116\" y2=\"147.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"110.5\" y=\"125.2\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"138\" y1=\"129.8\" x2=\"138\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"132.5\" y=\"132.1\" width=\"11\" height=\"11.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"160\" y1=\"128.7\" x2=\"160\" y2=\"149.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"154.5\" y=\"132.1\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"182\" y1=\"136.7\" x2=\"182\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"176.5\" y=\"139\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"204\" y1=\"135.6\" x2=\"204\" y2=\"160.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"198.5\" y=\"139\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"226\" y1=\"153.9\" x2=\"226\" y2=\"179.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"220.5\" y=\"157.4\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"50\" y1=\"104.5\" x2=\"210\" y2=\"139\" stroke=\"#a78bfa\" stroke-width=\"1.8\"/><line x1=\"50\" y1=\"148.2\" x2=\"218\" y2=\"148.2\" stroke=\"#a78bfa\" stroke-width=\"1.8\"/><line x1=\"204\" y1=\"148.2\" x2=\"310\" y2=\"148.2\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"310\" y=\"142.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">short entry</text><line x1=\"204\" y1=\"125.2\" x2=\"310\" y2=\"125.2\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"310\" y=\"119.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\">stop</text><rect x=\"30\" y=\"277\" width=\"280\" height=\"13.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"310\" y=\"306.8\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\">support = target</text><line x1=\"280\" y1=\"212.6\" x2=\"280\" y2=\"157.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"280,150.5 276.5,157.5 283.5,157.5\" fill=\"#22c55e\"/><line x1=\"280\" y1=\"212.6\" x2=\"280\" y2=\"267.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><polygon points=\"280,274.7 283.5,267.7 276.5,267.7\" fill=\"#22c55e\"/><text x=\"170\" y=\"82\" fill=\"#22c55e\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Good margin</text><text x=\"170\" y=\"338\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">support far below: 3:1+</text><line x1=\"325\" y1=\"60\" x2=\"325\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><line x1=\"360\" y1=\"106.8\" x2=\"360\" y2=\"152.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"354.5\" y=\"116\" width=\"11\" height=\"32.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"382\" y1=\"112.6\" x2=\"382\" y2=\"142.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"376.5\" y=\"116\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"404\" y1=\"120.6\" x2=\"404\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"398.5\" y=\"125.2\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"426\" y1=\"121.8\" x2=\"426\" y2=\"147.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"420.5\" y=\"125.2\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"448\" y1=\"129.8\" x2=\"448\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"442.5\" y=\"132.1\" width=\"11\" height=\"11.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"470\" y1=\"128.7\" x2=\"470\" y2=\"149.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"464.5\" y=\"132.1\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"492\" y1=\"136.7\" x2=\"492\" y2=\"148.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"486.5\" y=\"139\" width=\"11\" height=\"6.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"514\" y1=\"135.6\" x2=\"514\" y2=\"160.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"508.5\" y=\"139\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"536\" y1=\"153.9\" x2=\"536\" y2=\"179.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"530.5\" y=\"157.4\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"360\" y1=\"104.5\" x2=\"520\" y2=\"139\" stroke=\"#a78bfa\" stroke-width=\"1.8\"/><line x1=\"360\" y1=\"148.2\" x2=\"528\" y2=\"148.2\" stroke=\"#a78bfa\" stroke-width=\"1.8\"/><line x1=\"514\" y1=\"148.2\" x2=\"620\" y2=\"148.2\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"620\" y=\"142.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">short entry</text><line x1=\"514\" y1=\"125.2\" x2=\"620\" y2=\"125.2\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"620\" y=\"119.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\">stop</text><rect x=\"340\" y=\"180.4\" width=\"280\" height=\"13.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"620\" y=\"210.2\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\">support = target</text><line x1=\"590\" y1=\"164.3\" x2=\"590\" y2=\"157.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><polygon points=\"590,150.5 586.5,157.5 593.5,157.5\" fill=\"#ef4444\"/><line x1=\"590\" y1=\"164.3\" x2=\"590\" y2=\"171.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><polygon points=\"590,178.1 593.5,171.1 586.5,171.1\" fill=\"#ef4444\"/><text x=\"480\" y=\"82\" fill=\"#ef4444\" font-size=\"14\" text-anchor=\"middle\" font-weight=\"700\">Poor margin</text><text x=\"480\" y=\"338\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">support right below: ~1:1, skip</text></svg>", "caption": "Descending triangles with the same short entry: one has support far below (good 3:1+ margin), the other has support just under the break (poor margin, skip)."}
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
  "images": [
   {"src": "/lessons/seiden/p062-053.jpg", "caption": "SPY 60-minute (2/11-2/22): supply A about 136.4-137.0 (black lines) at the 2/14 top; B = 2/19 gap up into that supply at the open (oval), then a decline; demand D about 133.9-134.3 at the 2/15 base; E = 2/20 gap down into demand (circle), then a rally; C = 2/21 gap up into supply again, then a decline.", "notes": ["Three gap entries in one week, each opening straight into a marked level.", "Gap up after a rally into supply = short at the open; gap down after a decline into demand = buy.", "The novice buys the gap up and sells the gap down - take the other side within minutes."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Opening gaps into supply and demand</text><rect x=\"30\" y=\"120.5\" width=\"270\" height=\"20.4\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><line x1=\"46\" y1=\"219.4\" x2=\"46\" y2=\"241.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"39.5\" y=\"222.5\" width=\"13\" height=\"16.3\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"72\" y1=\"219.4\" x2=\"72\" y2=\"229.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"65.5\" y=\"222.5\" width=\"13\" height=\"4.1\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"98\" y1=\"203.1\" x2=\"98\" y2=\"229.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"91.5\" y=\"206.2\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"124\" y1=\"203.1\" x2=\"124\" y2=\"213.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"117.5\" y=\"206.2\" width=\"13\" height=\"4.1\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"150\" y1=\"190.9\" x2=\"150\" y2=\"213.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"143.5\" y=\"193.9\" width=\"13\" height=\"16.3\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"176\" y1=\"182.7\" x2=\"176\" y2=\"197\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"169.5\" y=\"185.8\" width=\"13\" height=\"8.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"202\" y1=\"124.6\" x2=\"202\" y2=\"149\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"195.5\" y=\"136.8\" width=\"13\" height=\"8.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"228\" y1=\"141.9\" x2=\"228\" y2=\"168.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"221.5\" y=\"145\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"254\" y1=\"162.3\" x2=\"254\" y2=\"188.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"247.5\" y=\"165.4\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"176\" y1=\"183.7\" x2=\"212\" y2=\"183.7\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text x=\"206\" y=\"165.4\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">gap</text><line x1=\"162\" y1=\"96\" x2=\"186.9\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"194,120.5 189.6,111.4 184.1,118.6\" fill=\"#ef4444\"/><text x=\"158\" y=\"100\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"700\">sell the open</text><text x=\"165\" y=\"66\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">Gap up after a rally, into supply</text><line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"340\" y=\"255.1\" width=\"270\" height=\"20.4\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"356\" y1=\"154.1\" x2=\"356\" y2=\"176.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"349.5\" y=\"157.2\" width=\"13\" height=\"16.3\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"382\" y1=\"166.4\" x2=\"382\" y2=\"176.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"375.5\" y=\"169.4\" width=\"13\" height=\"4.1\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"408\" y1=\"166.4\" x2=\"408\" y2=\"192.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"401.5\" y=\"169.4\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"434\" y1=\"182.7\" x2=\"434\" y2=\"192.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"427.5\" y=\"185.8\" width=\"13\" height=\"4.1\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"460\" y1=\"182.7\" x2=\"460\" y2=\"209.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"453.5\" y=\"185.8\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"486\" y1=\"203.1\" x2=\"486\" y2=\"217.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"479.5\" y=\"206.2\" width=\"13\" height=\"8.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"512\" y1=\"251\" x2=\"512\" y2=\"271.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"505.5\" y=\"255.1\" width=\"13\" height=\"8.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"538\" y1=\"227.6\" x2=\"538\" y2=\"258.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"531.5\" y=\"230.6\" width=\"13\" height=\"24.5\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"564\" y1=\"207.2\" x2=\"564\" y2=\"233.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"557.5\" y=\"210.2\" width=\"13\" height=\"20.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"486\" y1=\"216.4\" x2=\"522\" y2=\"216.4\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text x=\"516\" y=\"230.6\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">gap</text><line x1=\"544\" y1=\"291.8\" x2=\"529.2\" y2=\"280.9\" stroke=\"#22c55e\" stroke-width=\"2\"/><polygon points=\"522,275.5 526.5,284.5 531.9,277.3\" fill=\"#22c55e\"/><text x=\"546\" y=\"305.8\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">buy the open</text><text x=\"475\" y=\"66\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">Gap down after a decline, into demand</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">The novice buys the gap up and sells the gap down; take the other side within minutes of the bell.</text></svg>", "caption": "Gap trades: a gap up after a rally that opens inside supply is a short at the open; a gap down after a decline into demand is a buy. Stop just beyond the zone."}
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
  "images": [
   {"src": "/lessons/seiden/p068-054.jpg", "caption": "US Dollar index, daily (Oct 2006-Oct 2007): first A = base about 85.3-85.9 (red lines) followed by a gap and drop; B = the first revisit near 85.4 in early 2007, then a decline; second A = base about 82.7-83.4 in April, B = revisit near 83.3 around June, then a slide to about 78.", "notes": ["The same A-B logic works on a macro chart: base, strong departure, first revisit.", "Each revisit of supply produced the next leg of the downtrend.", "Read the dollar objectively from price, not from the news narrative."]},
   {"src": "/lessons/seiden/p069-055.jpg", "caption": "Left: 10-Year Note, daily (Jul-Sep): supply A about 117'00-117'16 (red lines) at a small July base, B = first revisit, then a steady decline to 108'23. Right: US Dollar, daily (Apr-Jul): demand A about 94.2-95.1 (green lines), B = pullback into the zone, then a rally to about 99.", "notes": ["Supply in the note and demand in the dollar, both traded at the first revisit (B).", "Falling note prices mean rising yields - the charts tell the macro story without opinions.", "A-B works the same for supply and demand."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">A-B on the US Dollar index</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Base A, a sharp drop, first revisit B, lower again - twice</text><rect x=\"80\" y=\"91.2\" width=\"220\" height=\"20.8\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"320\" y=\"169.2\" width=\"200\" height=\"20.8\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><polyline points=\"30,112 60,80.8 90,101.6 110,96.4 130,106.8 150,164 190,138 230,101.6 260,117.2 290,132.8 330,174.4 350,169.2 370,184.8 400,231.6 440,205.6 460,210.8 480,179.6 510,226.4 540,252.4 570,304.4\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" stroke-linecap=\"round\"/><circle cx=\"110\" cy=\"73.2\" r=\"11\" fill=\"#94a3b8\"/><text x=\"110\" y=\"76.8\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><circle cx=\"230\" cy=\"73.2\" r=\"11\" fill=\"#f59e0b\"/><text x=\"230\" y=\"76.8\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><circle cx=\"350\" cy=\"151.2\" r=\"11\" fill=\"#94a3b8\"/><text x=\"350\" y=\"154.8\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">A</text><circle cx=\"480\" cy=\"151.2\" r=\"11\" fill=\"#f59e0b\"/><text x=\"480\" y=\"154.8\" fill=\"#0f172a\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"700\">B</text><line x1=\"240\" y1=\"112\" x2=\"273.3\" y2=\"142.3\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"280,148.4 276.4,139 270.3,145.7\" fill=\"#ef4444\"/><line x1=\"490\" y1=\"190\" x2=\"515.1\" y2=\"229.2\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"520,236.8 518.9,226.8 511.4,231.7\" fill=\"#ef4444\"/></svg>", "caption": "Dollar index: each base (A) followed by a sharp drop marks supply; the first revisit (B) is the short, and the downtrend steps lower each time."}
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
  "images": [
   {"src": "/lessons/seiden/p071-056.jpg", "caption": "IMCL 60-minute (3/6-3/20): 'Resistance (Supply)' about 44.95-45.75 (black lines) at a 3/7 base, a large drop to about 42.5 and weeks near 42-43.5; on 3/19 a 'Citigroup Upgrade Gap Up' opens into the zone (high about 45.2), 'Short Entry' there, then price falls to about 43.3.", "notes": ["The upgrade brought a crowd of buyers to the open - right into supply formed by a dramatic decline.", "Short the gap into the zone with the stop above the upper line.", "Use upgrade/downgrade lists in a 15-minute pre-open scan to find stocks opening at big imbalances."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Upgrade gap into supply (IMCL)</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">The crowd buys the news; the gap opens inside a supply zone</text><rect x=\"40\" y=\"86\" width=\"540\" height=\"36.4\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"585\" y=\"126.4\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"585\" y=\"90\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"50\" y1=\"87.3\" x2=\"50\" y2=\"105.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"44\" y=\"91.2\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"76\" y1=\"87.3\" x2=\"76\" y2=\"110.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"91.2\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"102\" y1=\"86\" x2=\"102\" y2=\"117.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"96\" y=\"101.6\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"128\" y1=\"91.2\" x2=\"128\" y2=\"119.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"122\" y=\"101.6\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"154\" y1=\"104.2\" x2=\"154\" y2=\"122.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"148\" y=\"112\" width=\"12\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"180\" y1=\"113.3\" x2=\"180\" y2=\"178.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"174\" y=\"117.2\" width=\"12\" height=\"57.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"206\" y1=\"170.5\" x2=\"206\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"174.4\" width=\"12\" height=\"57.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"232\" y1=\"217.3\" x2=\"232\" y2=\"235.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"221.2\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"258\" y1=\"217.3\" x2=\"258\" y2=\"240.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"252\" y=\"221.2\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"284\" y1=\"212.1\" x2=\"284\" y2=\"240.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"278\" y=\"216\" width=\"12\" height=\"20.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"310\" y1=\"212.1\" x2=\"310\" y2=\"230.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"304\" y=\"216\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"336\" y1=\"206.9\" x2=\"336\" y2=\"230.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"330\" y=\"210.8\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"362\" y1=\"206.9\" x2=\"362\" y2=\"245.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"356\" y=\"210.8\" width=\"12\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"388\" y1=\"238.1\" x2=\"388\" y2=\"256.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"382\" y=\"242\" width=\"12\" height=\"10.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"414\" y1=\"232.9\" x2=\"414\" y2=\"256.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"408\" y=\"236.8\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"440\" y1=\"217.3\" x2=\"440\" y2=\"240.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"221.2\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"466\" y1=\"201.7\" x2=\"466\" y2=\"225.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460\" y=\"205.6\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"492\" y1=\"106.8\" x2=\"492\" y2=\"148.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"486\" y=\"117.2\" width=\"12\" height=\"15.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"518\" y1=\"128.9\" x2=\"518\" y2=\"178.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"512\" y=\"132.8\" width=\"12\" height=\"41.6\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"544\" y1=\"170.5\" x2=\"544\" y2=\"204.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"538\" y=\"174.4\" width=\"12\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"466\" y1=\"203\" x2=\"492\" y2=\"203\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><text x=\"462\" y=\"169.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">upgrade</text><text x=\"462\" y=\"183.2\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\">gap up</text><line x1=\"482\" y1=\"78.2\" x2=\"580\" y2=\"78.2\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"578\" y=\"72.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\">stop</text><line x1=\"482\" y1=\"210.8\" x2=\"580\" y2=\"210.8\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"6 4\"/><text x=\"578\" y=\"225.8\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\">target: prior range</text><line x1=\"452\" y1=\"143.2\" x2=\"475\" y2=\"131.6\" stroke=\"#ef4444\" stroke-width=\"2\"/><polygon points=\"483,127.6 472.9,127.6 477,135.7\" fill=\"#ef4444\"/><text x=\"448\" y=\"147.2\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"700\">short</text></svg>", "caption": "Morning gap fade: an upgrade gap opens straight into supply formed by a dramatic decline. Short the open with a stop above the zone; target the prior trading range."}
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
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Strong news often marks the turn</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">One side exhausts itself into a level</text><rect x=\"40\" y=\"91.2\" width=\"560\" height=\"26\" rx=\"0\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><line x1=\"60\" y1=\"222.5\" x2=\"60\" y2=\"245.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"52\" y=\"226.4\" width=\"16\" height=\"15.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"96\" y1=\"222.5\" x2=\"96\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"226.4\" width=\"16\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"132\" y1=\"206.9\" x2=\"132\" y2=\"235.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"124\" y=\"210.8\" width=\"16\" height=\"20.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"168\" y1=\"206.9\" x2=\"168\" y2=\"219.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"210.8\" width=\"16\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"204\" y1=\"191.3\" x2=\"204\" y2=\"219.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"196\" y=\"195.2\" width=\"16\" height=\"20.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"240\" y1=\"191.3\" x2=\"240\" y2=\"204.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"195.2\" width=\"16\" height=\"5.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"276\" y1=\"170.5\" x2=\"276\" y2=\"204.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"268\" y=\"174.4\" width=\"16\" height=\"26\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"312\" y1=\"134.1\" x2=\"312\" y2=\"178.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"304\" y=\"138\" width=\"16\" height=\"36.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"348\" y1=\"93.8\" x2=\"348\" y2=\"140.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"340\" y=\"101.6\" width=\"16\" height=\"36.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"384\" y1=\"97.7\" x2=\"384\" y2=\"136.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"101.6\" width=\"16\" height=\"31.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"420\" y1=\"128.9\" x2=\"420\" y2=\"173.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"412\" y=\"132.8\" width=\"16\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"456\" y1=\"165.3\" x2=\"456\" y2=\"209.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"448\" y=\"169.2\" width=\"16\" height=\"36.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"492\" y1=\"201.7\" x2=\"492\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"484\" y=\"205.6\" width=\"16\" height=\"26\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><rect x=\"242\" y=\"56\" width=\"140\" height=\"26\" rx=\"6\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"312\" y=\"73\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">great news!</text><text x=\"470\" y=\"67.8\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">last buyers arrive</text><text x=\"470\" y=\"81.8\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">at supply</text><line x1=\"466\" y1=\"70.4\" x2=\"366.8\" y2=\"89.5\" stroke=\"#94a3b8\" stroke-width=\"1.5\"/><polygon points=\"358,91.2 367.7,93.9 366,85.1\" fill=\"#94a3b8\"/><line x1=\"440\" y1=\"122.4\" x2=\"500.8\" y2=\"208.6\" stroke=\"#ef4444\" stroke-width=\"2.5\"/><polygon points=\"506,216 504.5,206.1 497.1,211.2\" fill=\"#ef4444\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Rules decide at the level; the story in the headline does not.</text></svg>", "caption": "Illusion of the news: strong good news brings the last buyers in, they exhaust themselves into supply, and price turns the opposite way to what the crowd expects."}
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
  "images": [
   {"src": "/lessons/seiden/p079-057.jpg", "caption": "DIA daily (TradeStation, Mar-May): after a drop to about 118 and a choppy recovery, 'Support (Demand)' drawn about 125.2-127.2 (two black lines) around the early-April cluster; price rose above it and came back twice (circled, late April and early May), holding near 127 both times before moving to about 130.", "notes": ["The student drew the lines around the whole cluster - a wide zone means a wide stop.", "Enclose the majority of the trading and check a second timeframe for where bodies and wicks sit.", "If the zone stays wide, reduce position size so risk stays within your maximum."]}
  ],
  "figures": [
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Drawing the zone lines</text><rect x=\"30\" y=\"238.6\" width=\"240\" height=\"25.2\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"275\" y=\"242.6\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"275\" y=\"267.8\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"50\" y1=\"138.8\" x2=\"50\" y2=\"191.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"43.5\" y=\"142\" width=\"13\" height=\"46.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"76\" y1=\"186.1\" x2=\"76\" y2=\"223.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"69.5\" y=\"188.2\" width=\"13\" height=\"29.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"102\" y1=\"213.4\" x2=\"102\" y2=\"263.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"95.5\" y=\"217.6\" width=\"13\" height=\"29.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"128\" y1=\"234.4\" x2=\"128\" y2=\"257.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"121.5\" y=\"238.6\" width=\"13\" height=\"8.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"154\" y1=\"232.3\" x2=\"154\" y2=\"261.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"147.5\" y=\"238.6\" width=\"13\" height=\"10.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"180\" y1=\"236.5\" x2=\"180\" y2=\"255.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"173.5\" y=\"240.7\" width=\"13\" height=\"8.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"206\" y1=\"196.6\" x2=\"206\" y2=\"242.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"199.5\" y=\"200.8\" width=\"13\" height=\"39.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"232\" y1=\"151.4\" x2=\"232\" y2=\"203.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"225.5\" y=\"154.6\" width=\"13\" height=\"46.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"170\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">Tight: majority of trading</text><text x=\"170\" y=\"338\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">normal size</text><line x1=\"325\" y1=\"60\" x2=\"325\" y2=\"345\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\" stroke-opacity=\"0.4\"/><rect x=\"340\" y=\"213.4\" width=\"240\" height=\"58.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"585\" y=\"217.4\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"585\" y=\"276.2\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"360\" y1=\"138.8\" x2=\"360\" y2=\"191.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"353.5\" y=\"142\" width=\"13\" height=\"46.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"386\" y1=\"186.1\" x2=\"386\" y2=\"223.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"379.5\" y=\"188.2\" width=\"13\" height=\"29.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"412\" y1=\"213.4\" x2=\"412\" y2=\"263.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"405.5\" y=\"217.6\" width=\"13\" height=\"29.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"438\" y1=\"234.4\" x2=\"438\" y2=\"257.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"431.5\" y=\"238.6\" width=\"13\" height=\"8.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"464\" y1=\"232.3\" x2=\"464\" y2=\"261.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"457.5\" y=\"238.6\" width=\"13\" height=\"10.5\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"490\" y1=\"236.5\" x2=\"490\" y2=\"255.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"483.5\" y=\"240.7\" width=\"13\" height=\"8.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"516\" y1=\"196.6\" x2=\"516\" y2=\"242.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"509.5\" y=\"200.8\" width=\"13\" height=\"39.9\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"542\" y1=\"151.4\" x2=\"542\" y2=\"203.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"535.5\" y=\"154.6\" width=\"13\" height=\"46.2\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"480\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">Wide: all of the price action</text><text x=\"480\" y=\"338\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\">wider stop - reduce position size</text></svg>", "caption": "Zone lines: enclose the majority of trading in the base (body tops for the proximal, the extreme wick for the distal). If the lines must cover all the price action, the stop is wider, so cut size."},
   {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Check two timeframes</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A wick on the daily can be bodies on the 60-minute</text><line x1=\"130\" y1=\"129.8\" x2=\"130\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"117\" y=\"139\" width=\"26\" height=\"13.8\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"190\" y1=\"129.8\" x2=\"190\" y2=\"162\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"177\" y=\"134.4\" width=\"26\" height=\"18.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"160\" y=\"82\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">Daily</text><rect x=\"100\" y=\"208\" width=\"140\" height=\"46\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><line x1=\"260\" y1=\"190\" x2=\"321\" y2=\"190\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"330,190 321,185.5 321,194.5\" fill=\"#f59e0b\"/><text x=\"450\" y=\"82\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"700\">60-minute</text><rect x=\"345\" y=\"217.2\" width=\"225\" height=\"36.8\" rx=\"0\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><text x=\"575\" y=\"221.2\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">proximal</text><text x=\"575\" y=\"258\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">distal</text><line x1=\"358\" y1=\"135.6\" x2=\"358\" y2=\"160.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"352.5\" y=\"139\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"378\" y1=\"153.9\" x2=\"378\" y2=\"183.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"372.5\" y=\"157.4\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"398\" y1=\"176.9\" x2=\"398\" y2=\"202.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"392.5\" y=\"180.4\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"418\" y1=\"195.3\" x2=\"418\" y2=\"225.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"412.5\" y=\"198.8\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"438\" y1=\"217.2\" x2=\"438\" y2=\"249.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"432.5\" y=\"221.8\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"458\" y1=\"221.8\" x2=\"458\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"452.5\" y=\"226.4\" width=\"11\" height=\"13.8\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"478\" y1=\"219.5\" x2=\"478\" y2=\"244.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"472.5\" y=\"226.4\" width=\"11\" height=\"9.2\" rx=\"0\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"1\"/><line x1=\"498\" y1=\"212.6\" x2=\"498\" y2=\"240.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"492.5\" y=\"217.2\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"518\" y1=\"186.2\" x2=\"518\" y2=\"220.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"512.5\" y=\"189.6\" width=\"11\" height=\"27.6\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"538\" y1=\"163.2\" x2=\"538\" y2=\"193.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"532.5\" y=\"166.6\" width=\"11\" height=\"23\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><line x1=\"558\" y1=\"144.8\" x2=\"558\" y2=\"170.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"552.5\" y=\"148.2\" width=\"11\" height=\"18.4\" rx=\"0\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"1\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Draw on both and let the lower timeframe show where the bodies (the real trading) sit.</text></svg>", "caption": "A long daily lower wick hides a base of candle bodies on the 60-minute chart; checking both timeframes gives truer proximal and distal lines."}
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
