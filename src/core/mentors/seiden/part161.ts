// Sam Seiden, "5 years of supply and demand teaching", original PDF pages 161-240.
// Study notes paraphrased from a full read of every page, including the chart images.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P161: VideoLesson[] = [
  {
    "n": 161,
    "title": "Scanning for Opportunity, the Old-Fashioned Way (continued)",
    "kind": "article",
    "summary": "Continued from p157-160: the sector and stock steps of the top-down scan. The financial sector ETF (XLF) had a gap-origin demand level that lined up with the S&P demand, and Bank of America (BAC) had a demand zone created by a strong gap away. On 4/21/09 all three gapped down into their pre-planned demand and rallied; the BAC risk was only $0.15.",
    "sections": [
      {
        "heading": "Sector step (XLF)",
        "points": [
          "After the index, he checked three or four sectors and found the financial sector ETF had quality demand lining up with the S&P demand.",
          "The gap higher at 'A' shows how much more demand than supply existed at its origin; a return there was likely to rally and lift the stocks in the sector.",
          "Next day the sector opened right into that demand ('B') and rallied all day, just like the S&P."
        ]
      },
      {
        "heading": "Stock step (BAC)",
        "points": [
          "Of three major bank stocks, BAC had a demand level ('A') made high quality by a strong gap away.",
          "The stronger the move away from a level, the larger the imbalance at its origin.",
          "All analysis was done on April 20; on April 21 price gapped down into the pre-planned zone, giving a very low risk, high reward entry. Risk was $0.15 per share.",
          "The sellers at 'B' made the two novice mistakes: selling after a decline and selling into a level where demand exceeds supply. Be the buyer to that seller."
        ]
      },
      {
        "heading": "Why do it by hand",
        "points": [
          "The whole scan took minutes the day before; automated scanners would have taken longer and probably never found BAC.",
          "Plan trades in advance and time them with the broad market, whatever your holding period."
        ]
      },
      {
        "heading": "Chart: XLF daily (Figure 2, p161)",
        "points": [
          "XLF daily, January to late April 2009, price scale about 6.50-12.30.",
          "Price falls from about 12.3 in January to a low near 6.5 in early March, then rallies through March and April.",
          "In early-mid April a small base around 9.2-9.6 is followed by a gap higher ('A'); a grey box (about 9.1-9.6) is drawn around that gap origin.",
          "Price runs to about 11.2, then on 4/21/09 (arrow, 'B') drops straight into the box (low about 9.4) and closes back up near 10.5. Last price 10.22."
        ]
      },
      {
        "heading": "Chart: BAC 30-minute (Figure 3, p162)",
        "points": [
          "BAC 30-min, 4/6 to 4/22/2009, scale about 6.8-11.5.",
          "A flat base around 7.0-7.3 from 4/6 to 4/8, then on 4/9 price gaps from about 7 to 8.2 ('A') and climbs to about 11.4 on 4/14.",
          "A grey bar labelled 'XLT Demand Zone' (about 6.9-7.1) extends from 'A' to the right.",
          "After a 4/15 gap down and recovery to about 11.1, price gaps down on 4/20 and slides to about 8.2; on 4/21 it gaps into the zone at 'B' (arrow) and rallies to about 9.2 by 4/22. Last price 8.41."
        ]
      }
    ],
    "rules": [
      "Work top-down: index, then 3-4 sectors, then 3 major stocks in the best sector.",
      "Take the stock whose demand lines up with the sector and index demand.",
      "Grade a level by how strongly price left it; a gap away is a strong departure.",
      "Do the analysis the day before and have orders ready before price arrives."
    ],
    "mistakes": [
      "Selling after a decline into a level where demand exceeds supply.",
      "Relying on automated scanners instead of a quick rule-based top-down read."
    ],
    "quotes": [
      "The stronger the move away from a price level, the greater the demand and supply imbalance.",
      "Planning your trades in advance and timing your trades with the broad market is important."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Index, sector and stock demand all lined up on 4/21/09." }
    ],
    "checklist": [
      "Is the index at demand?",
      "Is a sector ETF at a matching demand level?",
      "Does the chosen stock have demand at the same time with a strong (gap) departure?",
      "Is the plan written the day before with entry and stop?"
    ],
    "journalTags": ["top-down-scan", "sector-alignment", "gap-origin-demand", "bac", "xlf"],
    "newVsPdfs": [
      "New: a sector-ETF layer between index and stock; Kevin's course has no sector step.",
      "Differs: a gap origin is treated as quality demand here."
    ]
  },
  {
    "n": 163,
    "title": "Advanced Price Action Analysis: The Odds Enhancers",
    "kind": "article",
    "summary": "Seiden introduces the XLT 'Odds Enhancers', a rule-based scoring of each supply or demand level out of 10. A student's gold short scored 9 out of 10 and was entered with a limit order and all exits pre-placed. He explains three enhancers (strength of move, profit margin, big picture) and stresses that a larger purpose gives the discipline to wait.",
    "sections": [
      {
        "heading": "Why score levels",
        "points": [
          "Not every prior turning point is support or resistance; price turns where demand and supply are most out of balance.",
          "The Odds Enhancers are a simple criteria set that steer you to the best levels and help you ignore weak ones.",
          "Highest possible score is 10; the score tells you whether to act."
        ]
      },
      {
        "heading": "Strength of move (max 2)",
        "points": [
          "How did price initially leave the area? A fast, strong departure means a big imbalance; a gradual drift means a small one.",
          "The gold supply had a fast, strong initial decline, so it scored 2 of 2."
        ]
      },
      {
        "heading": "Profit margin (max 2)",
        "points": [
          "Compare entry-to-stop with entry-to-nearest opposing level (target 1).",
          "At least 3:1 reward to risk scored 2 of 2."
        ]
      },
      {
        "heading": "Big picture (max 2)",
        "points": [
          "The setup was on the hourly chart, so check the larger timeframe's fresh levels.",
          "Do not short anywhere near higher-timeframe demand; ideally short close to higher-timeframe supply."
        ]
      },
      {
        "heading": "Remaining enhancers and usage",
        "points": [
          "Three more (retracement, time at level, return) are listed but not explained here.",
          "Use the formal scoring for a while as a new member, then learn to 'eyeball' the enhancers.",
          "The student risked $1,200 and made $4,100, but the focus should be the mechanical steps, not the money.",
          "A grander vision (more time with family) is what gives the discipline to wait for low risk opportunities."
        ]
      },
      {
        "heading": "Chart: Gold 60-minute 'Probability Scoring' slide (Figure 1, p165)",
        "points": [
          "Gold futures (ZG, 100 oz) 60-min, about 1/6 to 1/12/2009, scale about 827-875.",
          "A black 'Supply Zone' box (about 862-870) is drawn around an earlier rally-base-drop top (circled, 'Supply (resistance)'); price dropped sharply from it into the 840s.",
          "Price later rallies back into the box (circled, 'XLT Student sells to a novice buyer') and turns down.",
          "'Target One' circle at about 852 and 'Target Two' circle at about 835 mark the exits; last price about 827.",
          "Scoring panel: market Gold, short, entry 864, stop 870. Max/student scores: strength 2/2, profit margin 2/2, big picture 2/2, retracement 2/1, time at level 1/1, return 1/1; total 10/9. Reward/risk 3:1, limit entry yes, confirmation entry no.",
          "Risk on trade $1,200; reward 12 points on target 1 and 29 points on target 2 at $100 per point x 2 contracts = $4,100 profit."
        ]
      }
    ],
    "rules": [
      "Score every level before trading: strength of move 2, profit margin 2, big picture 2, retracement 2, time at level 1, return 1 (total 10).",
      "Profit margin scores full only when reward to the nearest opposing level is at least 3:1.",
      "Check the higher timeframe: never short near HTF demand; prefer shorts near HTF supply.",
      "Pre-place entry (limit), stop and targets before price arrives.",
      "Trail the stop as targets are hit so a retrace still leaves a profit."
    ],
    "mistakes": [
      "Treating every prior turning point as support or resistance.",
      "Trading because you want to trade rather than because the score is high.",
      "Following the herd methods taught in books and seminars (no edge)."
    ],
    "quotes": [
      "This setup is a 9.",
      "Those who focus on the realities of markets and price simply get paid from those who don't."
    ],
    "diagrams": [
      { "key": "qualify", "caption": "Odds Enhancers: score strength, profit margin and big picture before entering." },
      { "key": "entry-stop-tp", "caption": "Gold short: entry 864, stop 870, targets 852 and 835." }
    ],
    "checklist": [
      "Did price leave the zone fast and strong?",
      "Is the nearest opposing level at least 3x the stop distance away?",
      "Is the higher timeframe supporting the direction (not shorting into HTF demand)?",
      "What is the total score out of 10?",
      "Are entry, stop and both targets placed before the trade?"
    ],
    "journalTags": ["odds-enhancers", "probability-score", "gold", "limit-entry", "3-to-1"],
    "newVsPdfs": [
      "New: a numeric 10-point score per zone; Kevin grades a zone simply good or bad and lets the HTF decide.",
      "New: a minimum 3:1 profit-margin rule; Kevin warns a fixed R:R leaves money on the table.",
      "Similar: the big-picture check matches Kevin's HTF zone filter."
    ]
  },
  {
    "n": 167,
    "title": "Some Thoughts on Trading Psychology",
    "kind": "article",
    "summary": "Your psychological belief system IS your strategy. News, upgrades, earnings and indicators are 'invitations' to buy or sell; a profitable belief system filters them through the real supply and demand picture. BAC was bought at demand on 4/21/09 despite bad CEO news, while the sellers acted on the news.",
    "sections": [
      {
        "heading": "Two kinds of invitations",
        "points": [
          "Market invitations come only from supply and demand; the other kind is everything else (news, earnings, upgrades and downgrades, tips).",
          "The first keeps you on reality; the second on everything but reality.",
          "A good earnings report or a buy recommendation does not equal demand; bad news or a downgrade can be a low risk buying opportunity."
        ]
      },
      {
        "heading": "Discipline is a belief problem",
        "points": [
          "Not following rules comes from invitations that do not fit your belief system, causing internal conflict at the moment of action.",
          "Even a little illusion in the belief system means truth is never found.",
          "Do not punish yourself for not acting; clean your belief system so it only holds objective information."
        ]
      },
      {
        "heading": "All influences are reflected in price",
        "points": [
          "Every input creates thoughts and perceptions, which lead to an action: buy or sell. So focus on price.",
          "Conventional support and resistance (a cluster of trading) is not necessarily true supply and demand; a specific pattern shows peak supply and demand.",
          "Two rules: negative news that brings price to peak demand is usually a buy; positive news that brings price to peak supply is usually a sell."
        ]
      },
      {
        "heading": "Chart: BAC 60-minute (Figure 1, p169)",
        "points": [
          "BAC 60-min, 4/8 to 5/8/2009, scale about 6.8-15.",
          "Grey 'XLT Demand Zone' (about 6.9-7.1) from 'A' on 4/9, where price jumped from the base to about 8.2 and on to about 11.4.",
          "On 4/21 ('B', arrow) price gaps down into the zone on the CEO's bad credit-quality news and rallies to about 9.",
          "Price then holds 8-9.3 through late April and rallies to about 15 by 5/7; last price 13.05."
        ]
      },
      {
        "heading": "Diagram: inputs to action (Figure 2, p170)",
        "points": [
          "A list of inputs (earnings report, news, income statement, balance sheet, Fed announcement, economic report, terrorist alert, trading tip, broker upgrade/downgrade, analyst opinion, technical indicators) feeds 'Thoughts and Perceptions', which feeds 'ACTION: Buy or Sell'."
        ]
      }
    ],
    "rules": [
      "Filter every piece of news through the supply and demand picture before acting.",
      "Bad news that drives price into peak demand is a buy opportunity, not a sell.",
      "Good news that drives price into peak supply is a sell opportunity, not a buy."
    ],
    "mistakes": [
      "Selling on bad news after a decline and into demand (the BAC sellers on 4/21).",
      "Assuming a cluster of trading is real supply or demand.",
      "Blaming a lack of discipline when the real issue is a belief system that conflicts with the rules."
    ],
    "quotes": [
      "Your psychological belief system IS your trading and/or investing strategy.",
      "Any and all influences on price are reflected in price."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "News and opinions become thoughts, then actions; filter them through supply and demand." }
    ],
    "checklist": [
      "Is the news pushing price into demand (buy) or supply (sell)?",
      "Am I acting on a market invitation or a news invitation?",
      "Is my hesitation a belief conflict rather than a rules problem?"
    ],
    "journalTags": ["psychology", "belief-system", "news-into-demand", "bac"],
    "newVsPdfs": [
      "Similar: Kevin also says even good news should not override a valid setup.",
      "New: the explicit 'news into peak demand = buy' rule and the belief-system framing."
    ]
  },
  {
    "n": 171,
    "title": "Governing Dynamics",
    "kind": "article",
    "summary": "A follow-up on psychology: success comes from keeping things simple and grounded in unchanging laws. Newton (motion until met by an equal or greater force), Adam Smith (supply over demand means price falls) and Nash (do what is best for yourself and the group, as dolphins herd a bait ball) describe realities that always existed. In markets, supply and demand is the mass and price movement between levels is the motion.",
    "sections": [
      {
        "heading": "Keep it simple",
        "points": [
          "Trading decisions must rest on supply and demand; adding derivatives of that concept is tricky and dangerous.",
          "Traders fail because they complicate things and because the mind creates illusion.",
          "More indicators, strategies and books do not help; a few basic principles never change."
        ]
      },
      {
        "heading": "Laws that were always there",
        "points": [
          "Newton (1686): an object stays in motion until met by an equal or greater force.",
          "Adam Smith: when supply exceeds demand at a price, price declines.",
          "Neither invented these; they challenged mass perception with a reality that existed all along, thanks to a belief system that let them apply core principles widely.",
          "Nash: the best outcome comes when each does what is best for himself and the group; dolphins herding fish into a bait ball and feeding in turns show the same thing."
        ]
      },
      {
        "heading": "Applied to markets",
        "points": [
          "Supply and demand is Newton's mass; motion is price moving from levels where demand exceeds supply to levels where supply exceeds demand.",
          "Theories that try to change these basics are usually proven wrong.",
          "Correction note (p174): last week's article should have said the SELLERS of BAC on 4/21 fell into the trap, not the buyers."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "No charts in this article."
        ]
      }
    ],
    "rules": [
      "Base every trade decision on supply and demand; treat other tools as secondary.",
      "Expect price to travel from one imbalance level to the next opposing one."
    ],
    "mistakes": [
      "Adding more indicators and strategies instead of simplifying.",
      "Letting illusion replace observable price reality."
    ],
    "quotes": [
      "Those who can't keep things simple typically pay those who can.",
      "You can't change what can't be changed."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Simple, unchanging laws: mass (supply/demand) and motion (price)." }
    ],
    "checklist": [
      "Is my reason for this trade a supply/demand imbalance, not an add-on tool?",
      "Where is the next opposing level (where motion should stop)?"
    ],
    "journalTags": ["governing-dynamics", "simplicity", "mindset", "newton"],
    "newVsPdfs": []
  },
  {
    "n": 174,
    "title": "Governing Dynamics and Trading Psychology",
    "kind": "article",
    "summary": "A live XLT session on May 20, 2009: the NASDAQ had rallied for days and new members wanted to buy, but the instructors planned a short at a daily rally-base-drop supply above. Price spiked up into it with large emotional green candles and then fell far and fast. There is a time to short in an uptrend: when price reaches a level where supply exceeds demand.",
    "sections": [
      {
        "heading": "Our job is to search, not to trade",
        "points": [
          "The job each day is to look for low risk, high reward opportunity, not to trade.",
          "Uptrends end at big supply; new downtrends begin there, so stay ahead of the masses.",
          "Buy in uptrends, but not when price is nearing major supply."
        ]
      },
      {
        "heading": "Reading emotion on the small timeframe",
        "points": [
          "A series of rising green candles with the largest candles at the end of the run is a sign of novice, emotional buying.",
          "Buyers at 'A' made the two mistakes: buying after a rally and buying at a level where supply exceeds demand.",
          "Larger timeframes show the turning points; smaller timeframes show novices jumping on the bandwagon at the wrong time."
        ]
      },
      {
        "heading": "Two-fold challenge",
        "points": [
          "Know exactly what a low risk, high reward, high probability opportunity looks like on a chart (where the brick walls are).",
          "Have the self control not to jump on the bandwagon when everyone else does."
        ]
      },
      {
        "heading": "Chart: NASDAQ futures 30-minute before (Figure 1, p175)",
        "points": [
          "E-mini NASDAQ (@NQ) 30-min, evening of 5/19 to the morning of 5/20/2009, scale about 1388-1422.",
          "Price grinds up from about 1388, pulls back to about 1395, then accelerates with large green candles; candle 'A' is a big green bar from about 1402 to 1413, followed by more large green bars to about 1420."
        ]
      },
      {
        "heading": "Chart: NASDAQ futures 30-minute after (Figure 2, p176)",
        "points": [
          "Same market from about 8:00 to 20:00 on 5/20: after 'A' price tops near 1424, drops in large red candles, makes a lower high near 1408, and falls to about 1386 by evening."
        ]
      },
      {
        "heading": "Chart: NASDAQ futures daily (Figure 3, p177)",
        "points": [
          "@NQ daily, late March to late May 2009, scale about 1180-1430, with a rising moving average labelled 'Uptrend'.",
          "A black 'Supply (resistance)' line (about 1420-1430) is drawn across the early-May top, a rally-base-drop where price stalled and dropped to about 1340.",
          "Price rallies back and at 'A' (about May 20) reaches just under the supply line, then turns down with a large red candle; last price 1359."
        ]
      }
    ],
    "rules": [
      "Shorting in an uptrend is valid only at a level where supply exceeds demand.",
      "Use the larger timeframe to find the level, the smaller timeframe to see novice buying into it.",
      "Mark the supply zone before the open and wait for price to come to it."
    ],
    "mistakes": [
      "Buying a strong uptrend right into major overhead supply.",
      "Chasing large green candles at the end of a run.",
      "Ignoring a pre-determined supply level because price was not there recently."
    ],
    "quotes": [
      "There is a time and a place to sell short during an uptrend.",
      "Our job is to wake up each day and search for low risk, high reward opportunity."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Daily supply finds the turn; 30-min shows the emotional buying into it." }
    ],
    "checklist": [
      "Is there daily supply just above current price?",
      "Are the biggest candles appearing late in the rally (emotional buying)?",
      "Am I fighting the urge to buy with the crowd?"
    ],
    "journalTags": ["short-in-uptrend", "rbd-supply", "emotional-candles", "nasdaq", "mtf"],
    "newVsPdfs": [
      "Differs: Seiden shorts HTF supply in a daily uptrend; Kevin's course leans on trading with the trend unless the HTF zone and trend analysis justify a reversal.",
      "New: reading 'largest candles at the end of a run' as novice emotion."
    ]
  },
  {
    "n": 178,
    "title": "Plan, Execute, and Then Go Do Something Else More Important Than Trading",
    "kind": "article",
    "summary": "A step-by-step S&P futures short from a live XLT Futures session on May 27, 2009. A rally-base-drop supply 'A' was confirmed by a fast decline 'B'; a steep rally 'C' back to it invited a short at 911 ('D') with a 4-point stop at 915 ('E') and a 3:1 target at 899 ('F'). With the whole trade pre-planned, the trader can walk away.",
    "sections": [
      {
        "heading": "Plan and walk away",
        "points": [
          "Find the opportunity, apply the rules, execute like a robot, enter the entire trade, then go do something else.",
          "This brings emotional detachment and a better life; watching trades keeps the biggest risk (you) alive.",
          "Trading is like Las Vegas: the same action over and over, wins and losses, with gains larger than losses."
        ]
      },
      {
        "heading": "A to F walk-through",
        "points": [
          "A: supply, because price could not stay there and had to fall. The pattern is rally-base-drop; drop-base-drop levels sit mid-move and typically do not work well.",
          "B: the rate of decline from A measures the imbalance; the faster, the better.",
          "C: a strong rally back to A with no sign of demand inside it is the most inviting part; a steep rally usually falls back at a similar rate.",
          "D: short at 911 as novices buy after a rally into supply.",
          "E: protective buy stop at 915, just above the zone, because price could not get above it before. 4 points = $200 per contract; 5 contracts = $1,000 risk.",
          "F: target 899, 12 points = 3:1; 5 contracts = $3,000. Keeping goals at 3:1 or more also raises probability."
        ]
      },
      {
        "heading": "Chart: E-mini S&P 10-minute (Figure 1, p180)",
        "points": [
          "@ES 10-min, 5/20 to 5/28/2009, scale about 878-922.",
          "'A': two black lines at about 911 and 915 around a small base after a rally on 5/20; the drop from it is shaded as ellipse 'B' (about 910 down to 899, continuing to about 888).",
          "Price bottoms near 879 on 5/22 and 5/26; ellipse 'C' shades the steep 5/26 rally from about 879 back to about 910.",
          "A dashed vertical line at 05/27/09 08:40 marks the open; 'D' is the short at the lower line (911), 'E' the stop line at 915.",
          "Price holds just under 912 for a few hours, then falls; the blue line 'F' at 899 marks the 3:1 target, and price reaches about 891 (last 894)."
        ]
      }
    ],
    "rules": [
      "Supply = rally-base-drop; skip drop-base-drop bases in the middle of a move.",
      "Judge the level by how fast price left it.",
      "A steep rally back into supply with no demand inside it is a positive.",
      "Stop just above the supply zone; size so total risk is fixed in dollars.",
      "Target at least 3:1 before taking the trade."
    ],
    "mistakes": [
      "Sitting in front of the screen watching open trades.",
      "Buying after a rally right into supply.",
      "Using drop-base-drop bases as supply."
    ],
    "quotes": [
      "Money always ends up in the hands of its rightful owners.",
      "Sitting and watching your trades keeps the largest risk in your trading world alive."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "ES short: entry 911, stop 915, target 899 (3:1)." },
      { "key": "zone-anatomy", "caption": "Rally-base-drop supply at 'A', strong departure at 'B'." }
    ],
    "checklist": [
      "Is the zone a rally-base-drop (not drop-base-drop)?",
      "Was the departure fast?",
      "Is the return to the zone steep with no demand inside it?",
      "Stop just beyond the zone; risk fixed in dollars?",
      "Is the target at least 3:1?",
      "Are all orders in so I can walk away?"
    ],
    "journalTags": ["set-and-forget", "es", "rbd-supply", "3-to-1", "steep-return"],
    "newVsPdfs": [
      "Similar: Kevin's set-and-forget approach matches 'enter the whole trade and leave'.",
      "New: rejecting drop-base-drop as supply (continuation zones are part of Kevin's course).",
      "New: a steep return into the zone counts in favour of the trade."
    ]
  },
  {
    "n": 182,
    "title": "Pay Attention",
    "kind": "article",
    "summary": "Most big mistakes come from not paying attention to the reality in front of you. In the June 16, 2009 XLT Futures session a quiet cluster in the S&P collapsed with a big red candle, so lines were drawn around that origin as a supply zone. Hours later price rallied into it, the class shorted to novice buyers, and the target near 911 was reached; a student made 13.25 points.",
    "sections": [
      {
        "heading": "Price action tells you",
        "points": [
          "Focus on what price action shows, not on thinking too deeply.",
          "Market information is only given to those who listen."
        ]
      },
      {
        "heading": "Building the supply zone",
        "points": [
          "Two lines are drawn around a cluster where price was balanced; then it collapsed with a big red candle.",
          "That collapse says supply greatly exceeded demand at the origin of the decline: a 'supply zone' or 'sell zone'.",
          "When price later rallied into it, buyers there made the two mistakes (buying after a rally, buying into supply); taking the other side is the high odds trade.",
          "Focus first on objectively assessing risk, then reward; not every trade works."
        ]
      },
      {
        "heading": "Student email (Zak)",
        "points": [
          "First short at 923 closed manually at 923.75 (-0.75) because it looked close to his 924 stop; he re-entered at 923.",
          "Price ranged 919-924.25, then fell to close at 909.75: +13.25 points."
        ]
      },
      {
        "heading": "Chart: live XLT screen (Figure 1, p183)",
        "points": [
          "Screenshot of the session hours before the US open: chat window on the left, an S&P E-mini chart on the right.",
          "Two magenta lines (about 924-927) wrap a small cluster near the top; a big red candle drops out of it, and price then drifts sideways lower overnight."
        ]
      },
      {
        "heading": "Chart: E-mini S&P 10-minute (Figure 2, p184)",
        "points": [
          "@ES 10-min (Sep09 contract), 6/15 to 6/16/2009, scale about 906-927.",
          "'XLT Supply Level': lines at about 924.1 and 927.3, with the circled big red candle leaving the level on the left.",
          "Price chops 916-922, then rallies into the lower line around 9:00 on 6/16 ('XLT Sells Short To Novice Buyer' arrow at about 924).",
          "Price falls hard to a 'Profit Target' line at 911.00 and on to about 907; last 908.75."
        ]
      }
    ],
    "rules": [
      "Wrap the base where price was balanced before a sharp collapse; that is the supply zone.",
      "Short the first rally back into the zone; risk first, reward second.",
      "Pre-plan the trade before the market opens."
    ],
    "mistakes": [
      "Not noticing the obvious reality on the chart.",
      "Acting on advice from people paid for advice, not trading.",
      "Buying after a rally into a fresh supply zone."
    ],
    "quotes": [
      "This important market information is only given to those who listen.",
      "Success is a choice."
    ],
    "diagrams": [
      { "key": "draw", "caption": "Two lines around the balanced cluster at the origin of the collapse." }
    ],
    "checklist": [
      "Was there balance (a cluster) before a big departure candle?",
      "Is this the first return to the zone?",
      "Is the profit target at the next demand defined?",
      "Have I assessed risk before reward?"
    ],
    "journalTags": ["pay-attention", "es", "sell-zone", "pre-market-plan"],
    "newVsPdfs": [
      "Similar: drawing the zone around the base before an explosive candle matches Kevin's zone drawing.",
      "Differs: Seiden calls it 'supply' or 'sell zone'; Kevin adds qualifying rules (e.g. trendline/HTF) before trading it."
    ]
  },
  {
    "n": 186,
    "title": "Demand and Supply and Your Nest Egg",
    "kind": "article",
    "summary": "Supply and demand analysis also protects long-term wealth. A tech mutual fund can be bought at pivot-low demand, but a fund priced in dollars can still lose buying power when the US Dollar Index hits supply. Likewise, when the S&P revisits supply you can hedge a stock portfolio by shorting SPY or S&P futures or buying puts.",
    "sections": [
      {
        "heading": "Turning points everywhere",
        "points": [
          "The strongest turns and largest moves happen where demand and supply are MOST out of balance.",
          "You can chart almost anything that is bought and sold, including mutual funds."
        ]
      },
      {
        "heading": "Mutual funds",
        "points": [
          "Schwab Tech Fund: 'A' is pivot-low demand; whoever sells at 'B' is a novice selling after a decline and into demand.",
          "You do not need to know what the fund holds; price says it is about to rise at 'B'."
        ]
      },
      {
        "heading": "Currency risk",
        "points": [
          "A fund rising in dollars can still lose buying power if the dollar falls.",
          "US Dollar Index: 'A' is supply and 'B' the first revisit; expect a decline at 'B', so dollar assets lose buying power.",
          "Ignoring currency risk transfers buying power to those who do not."
        ]
      },
      {
        "heading": "Hedging",
        "points": [
          "SPY: 'A' supply, 'B' the revisit. A decline from B drags global stocks and your retirement account down.",
          "Hedge choices at 'B': short SPY, short S&P futures, buy S&P puts, and more.",
          "All that matters at the end of the day is your buying power versus your neighbours."
        ]
      },
      {
        "heading": "Chart: Schwab Tech Fund monthly (Figure 1, p187)",
        "points": [
          "SWTFX monthly, 2002 to 2007.",
          "Price falls to a 2003 low, rallies into 2004, then pulls back to a pivot low at 'A' (late 2004), wrapped by two black lines.",
          "'B' (2005) is the return into the upper line; price then climbs steadily to new highs in 2007."
        ]
      },
      {
        "heading": "Chart: US Dollar Index monthly (Figure 2, p188)",
        "points": [
          "$DXY monthly, 2004 to mid-2009, scale about 72-93.",
          "'A' supply: lines at about 89 and 92.5 around the late-2005 top, followed by a long decline to about 71 in 2008.",
          "A sharp 2008-09 rally reaches 'B' (about 88-89), the first revisit, and price turns down to about 80 (last 80.28)."
        ]
      },
      {
        "heading": "Chart: SPY daily (Figure 3, p189)",
        "points": [
          "SPY daily, mid-September to late November 2007, scale about 141-157.",
          "'A' supply: lines at about 155 and 157 around the October top.",
          "Price drops to about 149, rallies to 'B' (about 155, around Nov 1), then declines steadily to about 141 by late November."
        ]
      }
    ],
    "rules": [
      "Buy funds or stocks at pivot-low demand, not after declines into it with the crowd selling.",
      "Check the currency your assets are priced in; a dollar at supply is a risk to dollar assets.",
      "When the index revisits supply, hedge (short ETF/futures or buy puts)."
    ],
    "mistakes": [
      "Ignoring currency risk because it seems complicated.",
      "Selling a fund after a decline into demand."
    ],
    "quotes": [
      "All that matters at the end of the day is your BUYING POWER.",
      "The REAL demand and supply equation is always right in front of your face."
    ],
    "diagrams": [],
    "checklist": [
      "Is the asset at demand or supply on the monthly chart?",
      "Is the currency it is priced in near supply?",
      "Is the S&P at supply, and do I need a hedge?"
    ],
    "journalTags": ["hedging", "currency-risk", "dxy", "mutual-funds", "long-term"],
    "newVsPdfs": [
      "New: using supply and demand for hedging and currency risk on long-term holdings; not covered in Kevin's course."
    ]
  },
  {
    "n": 190,
    "title": "Simple Logic Always Beats Complex Illusion",
    "kind": "article",
    "summary": "Occam's Razor and the lemonade stand: trading should be as simple as buying low and selling high as a child. A student shorted Alcoa (AA) at 12.08 when it returned to daily rally-base-drop supply near 12, with targets at 3:1 (10.85) and 5:1 (10.03). The buyers made the two classic mistakes.",
    "sections": [
      {
        "heading": "The illusive obvious",
        "points": [
          "The simplest answer is usually right; most people take illusion for reality.",
          "Much of his teaching is peeling away layers of illusion rather than giving rules."
        ]
      },
      {
        "heading": "Lemonade stand logic",
        "points": [
          "As a child you sold lemonade costing $0.05 for $0.50 or more; that is solid buying and selling.",
          "Instead of advice from people paid for advice, bring that simple logic back to the markets."
        ]
      },
      {
        "heading": "Shawn's AA trade",
        "points": [
          "AA came into daily supply; short at 12.08, target 1 at 10.85 (3:1), target 2 at 10.03 (5:1).",
          "The supply is a rally-base-decline pivot high near $12; price could not stay there.",
          "Buyers bought after a rally (like offering $40,000 for a $30,000 car) and into supply (like hitting the gas toward a concrete wall)."
        ]
      },
      {
        "heading": "Chart: Alcoa daily (Figure 1, p192)",
        "points": [
          "AA daily, late 2008 to July 2009, scale about 5-13.",
          "'XLT Supply Level': a box at about 11.9-12.4 around the early-January 2009 spike top (rally-base-decline).",
          "Price falls to about 5.2 in March, then rallies through April-June back into the box ('Shawn Short Entry' arrow, early June).",
          "Price turns down to about 9.0-9.5; last 9.46."
        ]
      }
    ],
    "rules": [
      "Supply = rally-base-decline (pivot high); short the return into it.",
      "Set targets as multiples of risk: target 1 at 3:1, target 2 at 5:1.",
      "Apply the same logic in markets as when buying anything in daily life."
    ],
    "mistakes": [
      "Buying after a rally (paying above the sticker price).",
      "Buying at a level where supply exceeds demand (accelerating into a wall).",
      "Following paid advisers instead of simple logic."
    ],
    "quotes": [
      "Simple logic always beats complex illusion.",
      "Do you step on the gas pedal or the brakes?"
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "AA short at 12.08 with 3:1 and 5:1 targets." }
    ],
    "checklist": [
      "Is the supply a rally-base-decline pivot high?",
      "Has price rallied back into it (buyers after a rally)?",
      "Are targets at 3:1 and 5:1 room before the next demand?"
    ],
    "journalTags": ["simplicity", "lemonade-stand", "aa", "daily-supply", "scaled-targets"],
    "newVsPdfs": [
      "New: fixed multi-R targets (3:1 and 5:1); Kevin targets the next opposing zone and avoids a fixed R:R."
    ]
  },
  {
    "n": 193,
    "title": "Breakout Entries",
    "kind": "article",
    "summary": "Buying the breakout itself is usually the 'sucker bet': high risk, low reward. Instead, let the breakout happen, because it reveals where the buyers are, then buy the return to the origin. Setup: 20-period MA uptrend, drop-base-rally demand at the origin, a profit margin to the breakout high; buy at the top line, stop below the bottom line, target the breakout high.",
    "sections": [
      {
        "heading": "Two key questions",
        "points": [
          "Why do prices move? They turn where demand and supply are out of balance.",
          "Who is on the other side? Trading transfers money from those who do not know to those who do; make sure a novice is on the other side."
        ]
      },
      {
        "heading": "The logic",
        "points": [
          "Area 'A' is the origin of a strong rally; most traders buy as price breaks out from it.",
          "By the time you buy the breakout, price has moved so far that it is high risk, low reward.",
          "Wait for price to return to 'A' ('C'); the seller there is selling after selling and into demand."
        ]
      },
      {
        "heading": "The setup and action",
        "points": [
          "Longs: uptrend defined by a 20-period moving average.",
          "Draw two lines around the origin of the strong move (demand 'A'); it should be a drop-base-rally (preceded by a decline) for higher probability.",
          "Profit margin = distance from 'A' to 'B', the highest high of the initial breakout before the return.",
          "Buy at 'C' when price touches the top line; protective sell stop just below the lower line; size to acceptable loss; target at 'B' (exit at 'D').",
          "Shorts are the mirror image: short the pullback to pivot-high supply, not the breakdown."
        ]
      },
      {
        "heading": "Higher timeframe",
        "points": [
          "Works in any market and timeframe, but always know where price is on the larger timeframe supply/demand curve."
        ]
      },
      {
        "heading": "Chart: breakout example (Figure 1, p195)",
        "points": [
          "Unlabelled candlestick chart with a rising 20-period moving average.",
          "Grey box 'A' with two black lines around a small base after a dip (drop-base-rally); arrows marked 'Breakout' show price leaving it with long green candles.",
          "'B' is a horizontal line at the high of the initial breakout; price consolidates, then a sharp red candle drops back to the top line of 'A' at 'C'.",
          "Price rallies from 'C' through 'B'; 'D' marks the profit exit at the B level."
        ]
      },
      {
        "heading": "Slides: breakout vs retracement (p196)",
        "points": [
          "'Buying the Breakout': buy as price leaves pivot-low demand (origin of imbalance) = higher risk, lower reward, lower probability.",
          "'Buying the Retracement': after the breakout, buy the pullback to the zone = low risk, high reward, high probability.",
          "'Shorting the Breakdown' vs 'Shorting the Retracement' from pivot-high supply: same contrast mirrored.",
          "Page 197 is blank."
        ]
      }
    ],
    "rules": [
      "Trend filter: 20-period MA for direction.",
      "Demand must be drop-base-rally (a decline before the base).",
      "Entry at the proximal line on the first return; stop just beyond the distal line.",
      "Target = high of the initial breakout (low of the breakdown for shorts).",
      "Check the higher timeframe curve first."
    ],
    "mistakes": [
      "Buying the breakout candle (the sucker bet).",
      "Letting emotion push you into the initial rally.",
      "Ignoring where price is on the larger timeframe."
    ],
    "quotes": [
      "This type of breakout entry is typically the 'sucker bet'.",
      "I sit back and let the breakout happen."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Buy the return to the breakout origin, stop below, target the breakout high." },
      { "key": "trend-trading", "caption": "With-trend pullback into drop-base-rally demand." }
    ],
    "checklist": [
      "Is the 20-period MA rising (or falling for shorts)?",
      "Is the zone at the origin of a strong move, with a drop before the base?",
      "Is there enough room to the breakout high?",
      "Is this the first return?",
      "Where is price on the higher timeframe?"
    ],
    "journalTags": ["breakout", "retracement-entry", "20ma", "dbr", "first-return"],
    "newVsPdfs": [
      "Differs: Kevin also teaches a breakout entry (order above supply with stop below the base) when structure allows; Seiden rejects buying the breakout.",
      "New: 20-period moving average as the trend filter; Kevin uses trendlines and structure, not MAs.",
      "New: target fixed at the initial breakout high."
    ]
  },
  {
    "n": 198,
    "title": "The Straight Answers to the Most Frequently Asked Questions",
    "kind": "article",
    "summary": "How long it takes depends on prior bad information: beginners with no experience learn fastest. A student's failed GENZ long shows three common errors: supply too close above, a third return to the demand after a weak rally, and the S&P not at demand. His reading list is Economics 101 and Psychology 101.",
    "sections": [
      {
        "heading": "How long to become successful?",
        "points": [
          "Those with little or no experience learn fastest; seminar and book veterans take longest because of bad 'decision filters'.",
          "Get the right information the first time; first impressions are hard to replace.",
          "Use a simple logic filter: if it seems too complex or illogical, it is probably poisonous to your account."
        ]
      },
      {
        "heading": "GENZ student question",
        "points": [
          "Plan: long at 51.35 from the July 23 drop-base-rally demand, stop 51.00. Price opened 51.99 on Aug 3 after a downgrade and bad news, and the trade was stopped.",
          "1) Supply was not far above, limiting profit and showing sellers nearby.",
          "2) It was the third return to the level and the latest rally from it was weak: low odds.",
          "3) The S&P was not at demand; timing with the S&P is not everything but very important.",
          "The circled area was a pocket of sellers the student missed."
        ]
      },
      {
        "heading": "Best trading book?",
        "points": [
          "Economics 101 for supply and demand and Psychology 101 for how people decide.",
          "Most trading books are written by people who write books, not trade."
        ]
      },
      {
        "heading": "Chart: Genzyme 30-minute (Figure 1, p200)",
        "points": [
          "GENZ 30-min, 7/23 to early August 2009, scale about 50-56.5.",
          "'Demand' lines at about 51.0 and 51.3 under the 7/23 low, where price launched to about 53.",
          "Price climbs to about 56.5 by 7/30; 'Supply' lines at about 55.8 and 56.5 wrap the top cluster.",
          "On 7/31 a huge red candle drops to about 52; a circled cluster (about 51.6-52.3) is the pocket of sellers.",
          "'Student Bought' arrow at the demand line on Aug 1-3; price breaks through to about 50."
        ]
      }
    ],
    "rules": [
      "Need room: no nearby opposing level above a long.",
      "Be cautious on a third return to a level, especially after a weak bounce.",
      "Time trades with the S&P being at a matching level.",
      "Look for basing pockets of sellers between entry and the zone."
    ],
    "mistakes": [
      "Buying demand with supply close above.",
      "Trading a level that has been revisited several times.",
      "Ignoring the index.",
      "Learning from too many sources first."
    ],
    "quotes": [
      "If information seems too complex or doesn't make sense to you, chances are great that it is poisonous.",
      "Timing your trade to the S&P is not everything but it sure is important."
    ],
    "diagrams": [
      { "key": "low-odds", "caption": "Third return, weak rally, nearby supply: low odds long." }
    ],
    "checklist": [
      "How many times has price returned to this level?",
      "Was the latest move away strong?",
      "Is opposing supply far enough away?",
      "Is the index at the same kind of level?",
      "Any small base (pocket of sellers) just above the zone?"
    ],
    "journalTags": ["faq", "third-touch", "profit-margin", "index-timing", "genz"],
    "newVsPdfs": [
      "Differs: Kevin keeps a zone until it is removed (closed through), not weakened by touches; Seiden lowers odds on a third return.",
      "New: requiring the S&P to be at demand for a stock long."
    ]
  },
  {
    "n": 201,
    "title": "Same Tools, Different Thoughts",
    "kind": "article",
    "summary": "Schools train people to think alike, which loses in competitive markets. Two conventional tools used differently: judge trend health by the shrinking distance between pivot lows, and use a past moving-average cross as a pointer to look slightly left for the origin of a strong move, i.e. a supply or demand level.",
    "sections": [
      {
        "heading": "Think differently",
        "points": [
          "No class teaches how to compete; herd thinking hands accounts to those who think differently.",
          "Conventional technical analysis is taught the same way, so it offers little edge."
        ]
      },
      {
        "heading": "Trend health from pivot spacing",
        "points": [
          "Beyond higher highs/lows or MA slope, measure the distance between the pivot lows of an uptrend (pivot highs in a downtrend).",
          "Shrinking distance between pullbacks means the trend is weakening and likely to end soon.",
          "A strong trend does not pull back often; a trend is an imbalance moving toward a level of temporary balance."
        ]
      },
      {
        "heading": "Moving average cross as a locator",
        "points": [
          "MA slope and MA cross signals lag price and add risk if used for execution.",
          "MAs cross because of a strong move, whose origin is an imbalance.",
          "When you see a past cross above or below price, look slightly left of it for the level.",
          "He does not use these two tools himself; the point is to think differently from the herd."
        ]
      },
      {
        "heading": "Chart: pivot-low spacing (Figure 1, p203)",
        "points": [
          "Unlabelled long-term chart (months marked, several years), price rising from about 65 to about 150 with volume below.",
          "Double-headed arrows join successive pivot lows (about 75, 98, 125, 135); the arrows get shorter: 'Decreasing distance between the pivot lows'.",
          "At the far right price stalls near 150 and turns down to about 130."
        ]
      },
      {
        "heading": "Chart: DryShips daily with two MAs (Figure 2, p204)",
        "points": [
          "DRYS daily, June to mid-August 2009, scale about 4.9-7.6, two moving averages.",
          "Circled MA cross near 7.1-7.2 in mid/late June labelled 'Moving Average Cross & Supply (resistance) level'; two lines at about 7.1 and 7.45 mark the supply just left of the cross, where price topped before falling.",
          "Price drops to about 4.9 in early July, then rallies; around 7/27 a big green candle reaches about 7.1 ('Selling Opportunity', circled).",
          "Price then falls back to about 6.1-6.5; last 6.48."
        ]
      }
    ],
    "rules": [
      "Measure distance between pivot lows (uptrend) or highs (downtrend); shrinking spacing warns of trend end.",
      "Never use an MA cross as an execution trigger; use it only to locate the origin of the move to its left."
    ],
    "mistakes": [
      "Using lagging indicators to time entries.",
      "Thinking and acting like the herd."
    ],
    "quotes": [
      "A strong trending market does not pullback often.",
      "Look slightly to the left of the cross and investigate the price action."
    ],
    "diagrams": [
      { "key": "trend-momentum", "caption": "Shrinking distance between pivot lows: weakening trend." }
    ],
    "checklist": [
      "Are the pullbacks in this trend getting closer together?",
      "Is there a past MA cross nearby, and what level sits just left of it?"
    ],
    "journalTags": ["trend-health", "pivot-spacing", "moving-average-cross", "drys", "think-differently"],
    "newVsPdfs": [
      "New: trend strength from pivot-low spacing; Kevin judges trend with trendlines and structure.",
      "New: MA cross as a pointer to a zone; Kevin does not use moving averages."
    ]
  },
  {
    "n": 205,
    "title": "Where Most People Get It Wrong",
    "kind": "article",
    "summary": "Most people lose because conventional technical and fundamental analysis make them buy with the herd after good news, and because they drop the everyday logic they use when buying a car or cheese. On August 19, 2009 the NASDAQ (QQQQ) gapped down into demand and CSCO sat at demand aligned with it; both were bought 'wholesale' and rallied.",
    "sections": [
      {
        "heading": "Two reasons for losses",
        "points": [
          "Books and seminars teach buying after rallies, lagging indicators, and buying after good news when price is already high.",
          "People throw out simple logic: nobody offers $30,000 for a $20,000 car, yet traders wait for confirmation of higher prices and then buy.",
          "To profit, others must buy after you at higher prices."
        ]
      },
      {
        "heading": "The pizza owner",
        "points": [
          "A pizza chain owner: cheese averages $2/lb; at $4 he buys only what he needs, at $1 as much as he can store.",
          "He already knew how to trade; he only needed to see what that looks like on a chart.",
          "Bring your everyday shopping mindset (coupons, sales) into trading."
        ]
      },
      {
        "heading": "Aug 19 XLT session",
        "points": [
          "Pre-market top-down analysis an hour before the open.",
          "NASDAQ was gapping down into demand (circled): briefly on sale. Sellers on the gap down ignored supply and demand.",
          "CSCO had demand aligned with the NASDAQ demand; despite bad news it was at wholesale prices that would not last."
        ]
      },
      {
        "heading": "Chart: live XLT screen (Figure 1, p208)",
        "points": [
          "Screenshot of the August 19 session: participants and chat on the left, several TradeStation charts on the right.",
          "The main chart shows an uptrend with a horizontal two-line box drawn from a base on the left; on the far right price has dropped into the box (black circle at the gap down)."
        ]
      },
      {
        "heading": "Chart: QQQQ 30-minute (Figure 2, p209)",
        "points": [
          "QQQQ 30-min, 7/22 to 8/24/2009.",
          "Two lines wrap the late-July base (around 7/23) from which price rallied strongly.",
          "Price ranges through early August, then falls in mid-August and dips into the zone around 8/17-8/19.",
          "A large ellipse marks the rally out of the zone from 8/19 to 8/24 to new highs."
        ]
      },
      {
        "heading": "Chart: Cisco 60-minute (Figure 3, p210)",
        "points": [
          "CSCO 60-min, 8/14 to 8/24/2009, scale about 20.6-22.6.",
          "Price drops from about 21.5 to a base around 20.7-20.8 on 8/17; two lines at about 20.65 and 20.82 wrap it.",
          "On 8/19 a candle dips back to the zone (about 20.75) and price climbs steadily to about 22.6 by 8/24; last 21.93."
        ]
      }
    ],
    "rules": [
      "Buy wholesale (at demand), sell retail (at supply).",
      "Align a stock's demand with the index's demand.",
      "Treat a gap down into demand as a sale, not a reason to sell."
    ],
    "mistakes": [
      "Buying after good news when price is already high.",
      "Waiting for confirmation of higher prices before buying.",
      "Selling a gap down into demand because of bad news."
    ],
    "quotes": [
      "If proper market speculating was as easy as reading a book, wouldn't every librarian be a millionaire?",
      "Make sure you are the author."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Wholesale vs retail: buy cheap at demand like buying cheese on sale." }
    ],
    "checklist": [
      "Is price at wholesale (demand) or retail (supply)?",
      "Is the index at matching demand?",
      "Am I reacting to news or to the level?"
    ],
    "journalTags": ["wholesale-retail", "everyday-logic", "qqqq", "csco", "gap-into-demand"],
    "newVsPdfs": [
      "Differs: Seiden argues against waiting for confirmation; Kevin's course includes confirmation entries in some contexts."
    ]
  },
  {
    "n": 210,
    "title": "Foolsville, Part 1",
    "kind": "article",
    "summary": "A parable of Foolsville, a box-shaped town where everyone thinks and trades the same way: buy on good news, rising prices and bullish indicators. On September 1, 2009 the S&P had a gap-down supply zone; the financial sector, Goldman Sachs and Citigroup had matching supply. Price rallied into supply, the 'Foolsville' buyers bought, the XLT sold short, and all four fell hard.",
    "sections": [
      {
        "heading": "Thinking differently",
        "points": [
          "To command a higher income, learn to do something others can't, which requires thinking differently.",
          "In Foolsville everyone eats, drives and trades the same way; from inside the box you never see the box.",
          "Money flows out of Foolsville to those who buy when they sell and sell when they buy."
        ]
      },
      {
        "heading": "Sept 1 trade plan",
        "points": [
          "S&P supply above price: price could not stay there and gapped down, meaning too much supply.",
          "Price opened below the level, so a rally was needed, plus buyers buying after a rally right at supply.",
          "The financial sector (XLF) had the same supply; GS and C had clear supply just above the open.",
          "Index, sector and stocks at supply together stacked the odds."
        ]
      },
      {
        "heading": "Chart: SPY 15-minute pre-market (Figure 1, p213)",
        "points": [
          "SPY 15-min, 8/27 to 8/31/2009, scale about 102-104.2.",
          "Two black lines labelled 'S&P Supply' at about 103.1 and 103.5 wrap a small base on 8/28 late in the day.",
          "On 8/31 price gaps down from the base to about 102.0-102.4 and drifts there."
        ]
      },
      {
        "heading": "Chart: live sector screen (Figure 2, p214)",
        "points": [
          "XLT Stock Mastery session screenshot with seven panes: XLF, C, BAC, COF on top and GS, JPM, MS below.",
          "Callouts point to 'XLF (Financial Service Sector) Supply Level', 'Citigroup (C) Supply Levels' (two levels) and 'Goldman Sachs Supply Level', each drawn as horizontal lines above current price."
        ]
      },
      {
        "heading": "Chart: SPY 15-minute after (Figure 3, p215)",
        "points": [
          "Same SPY zone (about 103.1-103.5). On Sep 1 price rallies from about 102 to about 103.2 into the lower line ('XLT Short Entry' arrow).",
          "Price then collapses to about 100.4-100.6."
        ]
      },
      {
        "heading": "Chart: GS 15-minute and C 30-minute (Figure 4, p216)",
        "points": [
          "GS: 'Supply Level' line at about 165.5-166 from an 8/28 top; on Sep 1 price rallies back to it ('XLT Short Entry') and falls to about 160.2.",
          "C: 'Supply Level' lines at about 5.00 and 5.05 from a base on 8/28-8/31; Sep 1 rally into it ('XLT Short Entry') then a drop to about 4.55 by 9/2.",
          "Index bar at top: Dow 9310.60 (-185.68), Nasdaq 1968.89 (-40.17), S&P 998.04 (-22.58)."
        ]
      }
    ],
    "rules": [
      "Look for the index, sector and stocks all at supply (or demand) together.",
      "If price opens away from the level, wait for it to rally into it; do not chase.",
      "A gap away from a base marks strong supply."
    ],
    "mistakes": [
      "Buying after good news, rising price and bullish indicators all line up (the Foolsville setup).",
      "Doing what everyone else does."
    ],
    "quotes": [
      "If you want to command a higher income, simply learn how to do something others can't do.",
      "You have to be outside the box to understand that there is a box."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "S&P, XLF, GS and C supply lined up on Sept 1." }
    ],
    "checklist": [
      "Is the index at supply?",
      "Is the sector at matching supply?",
      "Which stocks have clear supply just above the open?",
      "Am I waiting for the rally into the level?"
    ],
    "journalTags": ["foolsville", "top-down-scan", "spy", "gs", "citigroup", "gap-supply"],
    "newVsPdfs": [
      "New: sector and multi-stock alignment with the index (no sector step in Kevin's course)."
    ]
  },
  {
    "n": 217,
    "title": "Motion Into Mass",
    "kind": "article",
    "summary": "Newton's laws describe price: mass is supply and demand, motion happens between them. A strong S&P supply (gap away) worked on the first revisit 'A' and again on a gap into it 'B', but each revisit absorbed supply; at 'C' and 'D' the declines were shallow, so shorts were skipped. When price pushed deep into the level ('E'), they switched to buying smaller-timeframe demand on the 5-minute chart.",
    "sections": [
      {
        "heading": "Mass = demand and supply",
        "points": [
          "On the CME floor, the largest stack of sell orders above price is where rallies stopped; the largest buy stack below is where declines stopped.",
          "Price rises at levels where demand exceeds supply and falls where supply exceeds demand; motion occurs between them."
        ]
      },
      {
        "heading": "Revisits remove mass",
        "points": [
          "A gap away from the level means supply greatly exceeds demand.",
          "First revisit ('A') = highest odds; the class shorted and price fell.",
          "Second revisit ('B') a week later was shorted because price gapped into it (novice buying), but there is less supply left.",
          "Each move into the level absorbs some supply; at 'C' and 'D' declines got shallower, so shorting became high risk and was skipped."
        ]
      },
      {
        "heading": "Switch sides",
        "points": [
          "When price pushed deep into the level ('E'), the mass was removed and motion higher was likely.",
          "They looked for demand below on smaller timeframes; on the 5-minute chart price crashed into demand for a low risk long (entry close to stop, reward high because supply above was absorbed)."
        ]
      },
      {
        "heading": "Chart: Principia page (Figure 1, p218)",
        "points": [
          "Image of the 1687 Principia page 'Axiomata sive Leges Motus' with Newton's first and second laws in Latin (source: Wikipedia)."
        ]
      },
      {
        "heading": "Chart: SPY 30-minute (Figure 2, p219)",
        "points": [
          "SPY 30-min, about 8/28 to 9/9/2009, scale about 99.5-104, with volume.",
          "'XLT Supply Level': two lines at about 103.0 and 103.45 around a circled base on the left; a circled gap below it is labelled 'Gap suggests supply level is strong'.",
          "'A' (Sep 1): first revisit, followed by a fall to about 99.7 on 9/2-9/3.",
          "Rally on 9/4; 'B' (9/8): a circled 'Novice Gap into supply', short taken; price dips to about 102.7.",
          "'C' and 'D': further touches with shallower dips; 'E' (9/9): price pushes deep into the zone, then breaks above to about 104; last 103.76."
        ]
      },
      {
        "heading": "Chart: SPY 5-minute (Figure 3, p221)",
        "points": [
          "SPY 5-min, about 13:00 on 9/8 to 11:00 on 9/9/2009, scale about 102.75-104.",
          "'Demand Level': lines at about 102.72 and 102.80 under a base around 14:00 on 9/8.",
          "Around 8:30 on 9/9 a big red candle drops to the upper line; a circle marks the 'Low Risk Long Entry' at about 102.8.",
          "Price then rallies to about 103.95; last 103.76."
        ]
      }
    ],
    "rules": [
      "First revisit to a fresh level has the highest odds.",
      "Each further revisit absorbs orders; shallower reactions mean the level is failing.",
      "Stop trading a level when reactions get shallow; when price goes deep into it, look for the opposite trade on a smaller timeframe.",
      "A gap into a level shows novice entries and can justify a trade on a later revisit."
    ],
    "mistakes": [
      "Shorting the same supply again and again after it has been absorbed.",
      "Chasing pretty candlestick patterns instead of quantifying supply and demand."
    ],
    "quotes": [
      "Mass = Demand and Supply, motion occurs between demand and supply.",
      "Proper trading is easy; having the proper belief system is the hard part."
    ],
    "diagrams": [
      { "key": "zone-removed", "caption": "Repeated revisits absorb supply until the level fails." },
      { "key": "mtf", "caption": "When HTF supply is absorbed, buy smaller-timeframe demand." }
    ],
    "checklist": [
      "How many times has price revisited this level?",
      "Are the reactions from it getting shallower?",
      "Has price pushed deep into it?",
      "If so, is there smaller-timeframe demand below for a long?"
    ],
    "journalTags": ["motion-into-mass", "level-absorption", "first-revisit", "spy", "mtf-switch"],
    "newVsPdfs": [
      "Differs: Kevin keeps a zone valid until a candle closes fully through it; Seiden downgrades it as revisits make reactions shallower.",
      "New: switching to the opposite trade on a smaller timeframe once supply is absorbed."
    ]
  },
  {
    "n": 223,
    "title": "Losing To Win, It's All In Your Perception",
    "kind": "article",
    "summary": "Losses belong in the 'winning' category: they are a necessary part of a profitable strategy. An AAPL weekly short at supply 'A' lost $960 when price rallied through, but the rules then shorted the next supply 'C' for +$3,020 with the stop moved to breakeven at 3:1. A futures day with one loss and one win still netted $1,562.50.",
    "sections": [
      {
        "heading": "Attitude",
        "points": [
          "Winners play to win; losers play not to lose (fear).",
          "A bad golf shot is part of the game; don't let it affect the next shot.",
          "Trying to eliminate losses also eliminated his winning trades."
        ]
      },
      {
        "heading": "Perception of loss",
        "points": [
          "Categorize each trading loss as part of winning.",
          "A loss should be small and no big deal; he keeps losses to $1,000 or less in one lower-risk account.",
          "If a loss makes you cringe, the position is too big for your comfort."
        ]
      },
      {
        "heading": "AAPL example",
        "points": [
          "'A' looked like supply; short at 'B' when price rallied back, which was profitable for a bit, then stopped for a loss as price rallied through.",
          "'A' had less supply than thought; price zoomed up to supply 'C', where the rules said short again.",
          "Plenty of sellers at 'C'; price reached 3:1, the stop moved to breakeven (free trade), and it paid.",
          "Two trades per day, 50% accuracy, is fine with proper risk and odds, like a casino."
        ]
      },
      {
        "heading": "Chart: AAPL weekly (Figure 1, p225)",
        "points": [
          "AAPL weekly, 2007 to mid-2009.",
          "'D': circled top around the end of 2007 (the highest); 'C': circled flat top in mid-2008 just below it.",
          "'A': two lines around a lower pivot high in late summer 2008 (below C), followed by a crash into early 2009.",
          "Price then rallies through 2009 back toward 'A' (the 'B' revisit is off the right edge)."
        ]
      },
      {
        "heading": "Account windows (Figures 2-4, p226-227)",
        "points": [
          "Figure 2: TradeStation P&L line showing AAPL -960 as the loss was taken.",
          "Figure 3: the same line later showing AAPL +3,020 on the re-short at 'C'.",
          "Figure 4: futures fill window, ES DEC09: sell 5 at 1063.75; buys of 2 and 3 at 1065.00, 5 at 1064.75, 2, 2 and 1 at 1063.75; sell 10 at 1068.00. Bought 15, sold 15, net 0, P/L 1,562.50."
        ]
      }
    ],
    "rules": [
      "Size every trade so the loss is a small, comfortable amount (e.g. $1,000 or less).",
      "After a stop-out, keep applying the rules; take the next valid level.",
      "At 3:1 move the stop to breakeven."
    ],
    "mistakes": [
      "Treating a loss as failure and becoming paralysed.",
      "Trying to eliminate all losses.",
      "Risking an amount that makes a loss hurt."
    ],
    "quotes": [
      "To become a professional winner, you have to first become a professional loser.",
      "If you want to change, change your perception of loss."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Losses are filed under winning: part of the cost of the edge." },
      { "key": "zone-removed", "caption": "Supply A failed; next supply C took the re-short." }
    ],
    "checklist": [
      "Is my risk on this trade a loss I can accept calmly?",
      "If stopped, where is the next level for the next trade?",
      "Is the breakeven rule (at 3:1) set?"
    ],
    "journalTags": ["losing", "perception", "breakeven", "aapl", "next-level"],
    "newVsPdfs": [
      "Differs: stop to breakeven at 3:1 here; Kevin's examples move to breakeven around 1:1 or use larger targets."
    ]
  },
  {
    "n": 228,
    "title": "Questions and Answers: Things You May Want To Know",
    "kind": "article",
    "summary": "A Q&A covering FESX (Euro Stoxx 50 futures) and its daily gap, scaling into a position versus adding to a loser, what changes for position trading (only the timeframe, and the need for large profit margins), the VIX as an odds enhancer, and why fresh levels from far back in time can be better than recent ones.",
    "sections": [
      {
        "heading": "FESX",
        "points": [
          "Euro Stoxx 50 futures on Eurex; no overnight session, so a gap forms almost every day, which traders like.",
          "Each point is worth 10 euros."
        ]
      },
      {
        "heading": "Scaling in vs adding to a loser",
        "points": [
          "Scaling in is smart only if it is built into the plan.",
          "Know all entry points and the exact stop first, then size the total so the risk stays acceptable.",
          "Unplanned additions are adding to a loser.",
          "Entries need not be equal; he adds larger size the closer price gets to the protective stop."
        ]
      },
      {
        "heading": "Position trading",
        "points": [
          "Nothing different: same imbalance levels, just larger timeframes.",
          "Insist on LARGE profit margins (examples: British pound trades, the March S&P buy)."
        ]
      },
      {
        "heading": "VIX as an odds enhancer",
        "points": [
          "VIX high at supply while stocks are low at demand: strong odds stocks turn up.",
          "VIX low at demand while stocks are high at supply: strong odds stocks decline.",
          "The public buys 'insurance' after the accident; a free delayed chart is enough. Check daily for day trading, weekly for swing/position."
        ]
      },
      {
        "heading": "Fresh vs historical levels",
        "points": [
          "The key is 'fresh' levels: not revisited since they formed. These are often recent but sometimes far back.",
          "Levels from long ago are arguably better: price is far out on the curve (rubber band stretched).",
          "He accepts a little more risk on distant fresh levels because the probability and profit margin are so good."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "No charts in this Q&A (it refers back to the AAPL weekly chart from the previous article)."
        ]
      }
    ],
    "rules": [
      "Scale in only with a written plan: entries, stop and total size fixed before the first fill.",
      "Add larger size nearer the stop when scaling in.",
      "Position trades need large profit margins.",
      "Use only fresh (unvisited) levels; a fresh level far back in time is high quality.",
      "Use the VIX at its own supply/demand as a confirmation for index trades."
    ],
    "mistakes": [
      "Adding to a losing position without a plan.",
      "Ranking support/resistance by number of touches.",
      "Assuming only recent levels matter."
    ],
    "quotes": [
      "This action would only be adding to a losing position if it was not planned.",
      "The rubber band is very stretched so to speak."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Fresh levels, even from far back, rank highest." }
    ],
    "checklist": [
      "Is the level fresh (never revisited)?",
      "If scaling in, are all entries, the stop and total risk set in advance?",
      "Is the VIX at an opposing level that supports the trade?",
      "Is the profit margin large enough for the timeframe?"
    ],
    "journalTags": ["scaling-in", "vix", "fresh-levels", "fesx", "position-trading"],
    "newVsPdfs": [
      "New: the VIX as an odds enhancer; not in Kevin's course.",
      "New: planned scaling in with larger size near the stop.",
      "Similar: fresh (untested) zones matter in both; Kevin also keeps far-back zones valid until removed."
    ]
  },
  {
    "n": 233,
    "title": "Foolsville, Part 2",
    "kind": "article",
    "summary": "A satire of the herd's scoring system: seven criteria (downtrend, red candles, volume, bad news, bad earnings, reversal candle, S&P falling) worth 10 points each, with 70 meaning 'sell' at the lows. On Sept 11, 2009 the XLT bought a pre-planned NASDAQ (QQQQ) demand level exactly when the Fools yelled 'sell short', revealing who is on the other side of the trade.",
    "sections": [
      {
        "heading": "Day 1: the Foolsville strategy",
        "points": [
          "Everyone drives the same car; the town pools funds and makes one trade at a time together.",
          "Their sell setup awards 10 points each for downtrend, 3+ red candles, above-average volume, bad news, bad earnings, a reversal candle and the S&P declining; 70 is their best signal.",
          "The buy setup is the mirror; when it scores 70, price is 'very high'.",
          "Key question: if you buy high, who buys from you? To profit, others must buy after you at higher prices."
        ]
      },
      {
        "heading": "Day 2: the trade",
        "points": [
          "Pre-market news of a China-US trade dispute caused selling in S&P and NASDAQ futures.",
          "QQQQ had clear demand a bit below the prior close: a low risk day trade buy if reached.",
          "Price fell into the level just as the Fools shouted 'sell short'; demand held and price rose."
        ]
      },
      {
        "heading": "Foolsville belief system",
        "points": [
          "'Make decisions based upon the actions of others, after they make it.'",
          "Change starts with thoughts: think in reality-based terms, not conventional ones; pay attention to the present."
        ]
      },
      {
        "heading": "Slide: Foolsville Sell Setup (Figure 1, p234)",
        "points": [
          "Candles: a decline, a bounce of green candles, a red reversal candle, then several red candles; a circle at the last red candle (near the prior low) marks their 'High Odds Shorting opportunity'.",
          "Panel: Downtrend 10, 3 or more red candles 10, above average volume 10, bad news 10, bad earnings 10, reversal candle 10, S&P declining 10 = 70 points."
        ]
      },
      {
        "heading": "Chart: live XLT screen (Figure 2, p237)",
        "points": [
          "XLT Stock Mastery session screenshot with the participant list, chat (joined September 14, 2009, 7:31 AM) and several chart panes; one pane shows two horizontal lines under a base."
        ]
      },
      {
        "heading": "Chart: QQQQ 5-minute (Figure 3, p238)",
        "points": [
          "QQQQ 5-min, 9/10 to 9/11/2009, high 42.60, low 41.60.",
          "'XLT Demand': two lines (about 41.7 and 41.95) under a base from 10:00-12:00 on 9/10, from which price rallied to about 42.6.",
          "On 9/11 price drops from the highs to touch the upper line around 11:45; arrows from the same candle are labelled 'Foolsville Sell Signal' and 'XLT Buy Signal' with money flowing from one to the other.",
          "Price then rallies back to about 42.4."
        ]
      }
    ],
    "rules": [
      "Pre-plan the demand level before the open and buy there on a gap or drop into it.",
      "Ignore the crowd's checklist of news, candles and indicators; ask who will buy after you."
    ],
    "mistakes": [
      "Selling after a decline into demand because news, candles and the index all look bearish.",
      "Making decisions after others have acted.",
      "Following the crowd (the long airport line)."
    ],
    "quotes": [
      "Make decisions based upon the actions of others, after they make it.",
      "Do you trade like a Fool or do you trade with a Fool?"
    ],
    "diagrams": [
      { "key": "low-odds", "caption": "The 70-point Foolsville sell signal fires right at demand." }
    ],
    "checklist": [
      "Is my signal built from lagging news, candles and volume after the move?",
      "Is price at pre-planned demand while others are panicking?",
      "Who will buy from me (or sell to me) after I enter?"
    ],
    "journalTags": ["foolsville", "contrarian", "qqqq", "pre-market-demand", "news-selling"],
    "newVsPdfs": []
  }
];
