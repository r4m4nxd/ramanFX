// Sam Seiden, "5 years of supply and demand teaching", original PDF pages 241-320.
// Study notes paraphrased from a full read of every page, including the chart images.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P241: VideoLesson[] = [
  {
    "n": 241,
    "title": "A Smart Trading Group, Getting Smarter",
    "kind": "article",
    "summary": "A reader Q&A collection. Seiden answers five student emails: taking profit early at a 60-minute index level, slippage on a spot-FX cross, whether turns need high volume, hesitating at a valid signal, and how to scale up position size. The common thread is to follow a rule-based plan, accept that nobody catches the whole move, and grow size slowly.",
    "sections": [
      {
        "heading": "Opening trades and early exits (Barbara)",
        "points": [
          "She bought two stocks a minute after the open at lower levels, trailed stops to 2:1 and exited when the related ETF was 10 cents from a 60-minute zone, banking 3:1 and 5:1.",
          "Trading right at the open is smart only if price opens INTO a demand or supply level; that is when demand and supply are most out of balance.",
          "Exiting because the sector/broad market is nearing a 60-minute level is the right call even if price later runs further.",
          "A plan that wins only 40% of the time at 3:1 is already a fantastic income; chasing more of the move usually invites more losses."
        ]
      },
      {
        "heading": "Slippage in spot Forex (W. Jones, GBPCHF)",
        "points": [
          "A long at demand on GBPCHF from a Sunday class made about $2,800 on 2 contracts but suffered ~10 pips of slippage on a market order after limit orders did not fill.",
          "Reason 1: in spot FX the broker is on the other side; when you buy at real demand the broker knows it is selling at a bad price and will fill you where it cannot lose.",
          "Reason 2: non-major pairs are thinner, so slippage is more likely.",
          "Set-and-forget orders mean you do not have to sit at the screen and they remove emotion."
        ]
      },
      {
        "heading": "Volume at turning points (Tim)",
        "points": [
          "Seiden corrects the idea that he plays every turn that comes with volume.",
          "The most significant turns usually happen on LOW volume: the bigger the imbalance at a level, the less time price spends there and the fewer trades print.",
          "He actively looks for low-volume turns as evidence of a large imbalance."
        ]
      },
      {
        "heading": "Hesitating at a valid signal (Jermal)",
        "points": [
          "Student marks daily levels, plans on the 30-minute chart, enters on the 5/15-minute, but freezes wondering if the level is wrong.",
          "There is no certainty; once you truly accept that, you look for better odds instead of guarantees.",
          "Build a rule-based plan that stacks odds, then execute; set-and-forget orders make this easier."
        ]
      },
      {
        "heading": "Scaling up size (Keith, BBBY and QLD)",
        "points": [
          "Keith's 10-share trades: BBBY long 39.75 to 39.97, short 39.99 to 39.93 (he admits the target was too close), long 39.97 to 40.17, plus QLD 52.18 to 52.43.",
          "Do not jump from 10 to 1,000 shares; go 10 to 100 and stay rule-based.",
          "Scaling too fast is one of the biggest causes of complete failure."
        ]
      }
    ],
    "rules": [
      "Only take opening trades when price opens into a demand or supply level.",
      "Take profits when the broad market/sector reaches its own higher-timeframe (e.g. 60-minute) level.",
      "Treat a 3:1 reward with a 40% win rate as a fully acceptable plan.",
      "Prefer low-volume turns at levels as a sign of a large imbalance.",
      "Increase size in steps of about 10x at most (10 -> 100 shares), not 100x.",
      "Use set-and-forget orders to remove emotion."
    ],
    "mistakes": [
      "Second-guessing a valid exit because price later went further.",
      "Expecting high volume to confirm a turn.",
      "Waiting for certainty before entering a valid setup.",
      "Taking trades whose target is too close (poor reward).",
      "Scaling position size up too fast."
    ],
    "quotes": [
      "No one will ever get the entire move, all the time.",
      "The most significant turns in price happen with low volume most of the time.",
      "Don't move from 10 to 1000. Instead, move from 10 to 100."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Accept uncertainty: execute the rule-based plan instead of searching for a guarantee." }
    ],
    "checklist": [
      "Is the open happening into a demand or supply level?",
      "Where is the index/sector relative to its 60-minute levels (exit trigger)?",
      "Is the target far enough for at least 3:1?",
      "Is position size only a modest step up from what I have traded successfully?"
    ],
    "journalTags": ["qa", "open-into-level", "index-exit", "slippage", "low-volume-turn", "position-sizing", "hesitation"],
    "newVsPdfs": [
      "Low volume at the turn is a positive sign for Seiden; Kevin's course does not use volume at all.",
      "Exit when the related index/ETF reaches its own 60-minute level - an inter-market exit rule not in Kevin's material.",
      "Explicit scaling guidance (grow size about 10x at a time) is new."
    ]
  },
  {
    "n": 246,
    "title": "Market Traps, Novice Traders Beware",
    "kind": "article",
    "summary": "Bull and bear traps: an event (news or a popular breakout) invites the crowd to buy right into objective supply with plenty of room below, or sell into demand. Seiden sells to those breakout buyers. Example: the S&P breaking above the prior day's high into supply formed at the origin of a weekly gap down.",
    "sections": [
      {
        "heading": "The logic of a trap",
        "points": [
          "Floor traders call it being 'hung': buying right into supply before a collapse or shorting into demand before a rally.",
          "A bull trap needs two things together: a positive event pulling buyers in, and price at a level where supply exceeds demand with a significant profit margin below.",
          "Once the last buyer buys there are no more buyers; price falls and trapped buyers sell at a loss, pushing price lower still.",
          "The 'event' can be news or a popular chart pattern such as a breakout."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p247): TradeStation screen from an XLT Stock Mastery session on 'Advanced Bull and Bear Trap Strategies'. Right panel: SPY weekly (about 70-130), price rallied from the lows right up to a horizontal line labelled 'Gap Supply' around 105-108 - the origin of a gap down from the prior year.",
          "Left panel: SPY 15-minute (about 108.6-110.2, 10/15-10/21). A white-shaded 'Supply' zone at the top (about 109.6-110.0) marks that gap origin on the small timeframe; a 'Demand' box at the bottom (about 108.5-108.9) is the target.",
          "A circled high labelled 'Trap' pokes above the prior day's high into the supply box - the breakout that makes the crowd bullish. Price then drops sharply (red bars) toward the demand box; last price shown about 108.25.",
          "The demand level below was the first target and was reached; risk was small had it failed."
        ]
      },
      {
        "heading": "Mental side",
        "points": [
          "Like a car dealer, you want customers who do not know true value: first-time buyers driven by emotion.",
          "Sell to them when price is at a level you know is too high; buy from them when it is too low."
        ]
      }
    ],
    "rules": [
      "When a significant event invites buyers, price is at supply and there is an adequate profit margin below: sell short.",
      "When a significant event invites sellers, price is at demand and there is an adequate profit margin above: buy.",
      "Check the larger timeframe first to know which side carries the better odds.",
      "Use the opposing level (first demand below) as the first target."
    ],
    "mistakes": [
      "Buying a breakout above the prior day's high when it runs into higher-timeframe supply.",
      "Trading with the crowd after an exciting event.",
      "Ignoring where price is on the larger timeframe."
    ],
    "quotes": [
      "Gaps represent the picture of a strong supply and demand imbalance.",
      "Be the seller to these buyers as they are falling for a trap."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Weekly gap-down origin defines the supply; the 15-minute chart refines the entry where the trap breakout occurs." }
    ],
    "checklist": [
      "Is there an event (news, breakout) inviting the crowd in?",
      "Is price at objective higher-timeframe supply/demand?",
      "Is there a significant profit margin to the opposing level?",
      "Is the breakout running INTO the level rather than away from it?"
    ],
    "journalTags": ["bull-trap", "bear-trap", "breakout-fade", "gap-origin", "mtf", "spy"],
    "newVsPdfs": [
      "Fading a prior-day-high breakout into higher-timeframe supply is framed as a named setup (bull/bear trap); Kevin's course treats it only implicitly through zone entries.",
      "Gap origin explicitly used as the supply zone on the weekly."
    ]
  },
  {
    "n": 248,
    "title": "Conventional Technical Analysis Strategies, A Flawed School of Thought",
    "kind": "article",
    "summary": "Using an Alcoa (AA) daily chart, Seiden contrasts an XLT member's short at daily supply (a pivot high followed by a gap down) with the textbook double-top entry below the neckline. The textbook entry sells after a decline and into demand, exactly backwards. Wrap supply and demand rules around any pattern to enter before the pattern traders.",
    "sections": [
      {
        "heading": "The member's trade",
        "points": [
          "Shawn shorted AA at 12.08 when it rallied into daily supply; target 1 at 10.85 (3:1) and target 2 at 10.03 (5:1).",
          "The supply was a clear pivot high followed by a gap down, showing a big imbalance.",
          "He sold to novices buying after a rally into supply, then covered at the circled targets."
        ]
      },
      {
        "heading": "Why the double top is flawed",
        "points": [
          "By the books the double top is only confirmed much lower, and the short is taken when price breaks the neckline.",
          "That means selling after a decline and selling into demand (support) - something no consistently profitable trader would do.",
          "The people buying back from Shawn at his targets were likely the book readers selling the neckline break.",
          "Conventional entry rules nearly always get you in well after the move is underway."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p251): AA daily (NYSE), Jan-Jul 2009, price scale about 6-12.5. A 'Supply' box at the top left (about 11.8-12.3) from the early-January pivot high that gapped down.",
          "Price falls to about 5 in March, then rallies back through April-June into the same supply box at the top right; arrow 'Shawn (XLT member) Short Entry' at that box (~12.08).",
          "Two small circles just below (about 10.8 and 10.0) are labelled 'Profit Target 1' and 'Profit Target 2'.",
          "Arrows label the two highs 'Double Top' and a horizontal 'Neckline' near 9.3; the textbook 'Double Top Short Entry' arrow points at the neckline break, which is also labelled 'Demand Level' - shorting into demand."
        ]
      }
    ],
    "rules": [
      "Short when price rallies into supply, not after it breaks down from a pattern.",
      "Use a pivot high followed by a gap down as evidence of strong supply.",
      "Set targets that give at least 3:1, with a second target near 5:1.",
      "If you like a conventional pattern, wrap supply/demand rules around it to enter before pattern traders."
    ],
    "mistakes": [
      "Selling the neckline break (after a decline and into demand).",
      "Following popular books simply because everyone teaches it the same way.",
      "Entering after the move is already underway."
    ],
    "quotes": [
      "You can't be consistently profitable buying and selling where everyone else does.",
      "Why in the world would we want to sell after a decline in price?"
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short at supply with 3:1 and 5:1 targets versus the late neckline entry." }
    ],
    "checklist": [
      "Am I entering at the level, before the pattern completes?",
      "Is my short entry above demand, not into it?",
      "Do T1 and T2 give at least 3:1 and 5:1?"
    ],
    "journalTags": ["double-top", "neckline", "pattern-critique", "gap-down", "aa-daily", "swing-short"],
    "newVsPdfs": [
      "Direct critique of the double-top/neckline entry, with the neckline identified as demand; Kevin does not discuss classic patterns.",
      "Two-target layout (3:1 and 5:1) shown on a stock swing trade."
    ]
  },
  {
    "n": 252,
    "title": "Mixed Feelings",
    "kind": "article",
    "summary": "At an OTA event Seiden runs a 'hard right edge' game: EBAY opens with a doji gapping up into obvious 5-minute supply. Graduates mostly sell; newcomers copy the first trader and mostly buy. Price fills the gap lower, and graduates outperform newcomers by over 400%: herd behaviour, not chart reading, drives the losers.",
    "sections": [
      {
        "heading": "Creating your own competition",
        "points": [
          "Proper trading needs an edge over the competition: a rule-based way to buy before others buy and sell before others sell.",
          "He is happy when people do not join, because markets need people who sell at demand and buy at supply."
        ]
      },
      {
        "heading": "The hard right edge game",
        "points": [
          "Candles are revealed one at a time; attendees raise a hand to buy or sell once.",
          "Graduates mostly sell: gap up, into obvious supply to the left, with a doji.",
          "New prospects copy whoever moves first, usually buying, despite being told they need not trade the first candle.",
          "Afterwards losers admit they 'knew' it was a doji into resistance but bought because others did."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p253): EBAY 5-minute (NASDAQ). Prior afternoon a small base at about 24.45-24.51 (boxed 'Supply (resistance)') drops hard to about 23.95 on 9/21, then chops 24.00-24.20 for the rest of the day.",
          "At the hard right edge the new session opens with a gap up straight into the supply box, arrow labelled 'Doji Candle' at about 24.45-24.50.",
          "Figure 2 (p255): same chart scrolled forward (9/22). After the doji at supply, a string of red candles falls from about 24.45 to about 24.15, filling the gap - sellers of the doji profit, buyers lose."
        ]
      },
      {
        "heading": "Results",
        "points": [
          "Graduates' performance is more than 400% better than newcomers'.",
          "Fear and greed will always keep enough people buying where he sells and selling where he buys."
        ]
      }
    ],
    "rules": [
      "When price opens with a gap into obvious supply and stalls (doji), favour the short.",
      "You do not have to trade the first candle; patience is allowed.",
      "Decide from the level, never from what other traders are doing.",
      "Learn, practise on a demo, then start small and low risk."
    ],
    "mistakes": [
      "Copying the first trader (herd mentality).",
      "Buying a gap up into supply.",
      "Feeling forced to act on the first candle."
    ],
    "quotes": [
      "It's herd mentality live in action.",
      "This has nothing to do with reading a chart."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Act on the level, not on the crowd." }
    ],
    "checklist": [
      "Is the open gapping into a supply/demand level?",
      "Am I acting on my rules or on what others do?",
      "Is there room for price to fill the gap (profit margin)?"
    ],
    "journalTags": ["herd-mentality", "gap-into-supply", "doji", "open", "ebay-5m", "psychology"],
    "newVsPdfs": [
      "Gap at the open into an intraday supply zone treated as a high-odds short; Kevin does not cover opening gaps on stocks.",
      "Herd behaviour illustrated with live audience statistics (400% better)."
    ]
  },
  {
    "n": 256,
    "title": "Three Ways to Speculate the Markets, Which is Best For You?",
    "kind": "article",
    "summary": "Day, swing and longer-term position trading compared with pros and cons. The strategy never changes across them: buy low/sell high at quantified supply and demand imbalances. Seiden personally finds swing trading the most profitable and comfortable.",
    "sections": [
      {
        "heading": "Day trading",
        "points": [
          "Exit before the session close; needs fast connections, backups, real-time data, direct access and multiple monitors.",
          "Pros: suits high-energy, disciplined people; profitable day traders take 1-3 quality trades, usually near the open, not 10-100.",
          "Cons: get-rich-quick appeal, high emotion, competing with market makers, most time-consuming, needs quick decisions."
        ]
      },
      {
        "heading": "Swing trading",
        "points": [
          "Hold from one day to a couple of weeks or longer; real-time data helpful but not required.",
          "Pros: where he sees the most students succeed; least competition (too long for day traders, too short for institutions); an hour or so of analysis two or three times a week; set-and-forget orders; best analysis is done when the market is closed.",
          "Cons: can feel boring; stock setups come in bunches, e.g. when the S&P pulls back to demand in an uptrend most stocks set up at once and vanish once it rallies."
        ]
      },
      {
        "heading": "Longer-term position trading",
        "points": [
          "Hold weeks to months; buy and hold can be the best style if you buy at the right time.",
          "Pros: fully pre-planned, least time-consuming.",
          "Cons: many rely on news and opinions and end up buying high/selling low; results take time; capital tied up (opportunity cost)."
        ]
      },
      {
        "heading": "Constant strategy",
        "points": [
          "A strategy that works in one market or timeframe should work in any.",
          "Everything comes down to objectively quantifying demand and supply to find turning points."
        ]
      }
    ],
    "rules": [
      "Day traders: focus on 1-3 quality opportunities, typically near the open.",
      "Swing traders: do analysis while the market is closed and use set-and-forget orders.",
      "Use price charts and supply/demand, not news, as primary tools for longer-term positions.",
      "Keep the same rule-based strategy whatever the timeframe."
    ],
    "mistakes": [
      "Day trading for the get-rich-quick thrill.",
      "Over-trading (10-100 trades a day).",
      "Long-term investing driven by news and opinions.",
      "Believing each style needs a different strategy."
    ],
    "quotes": [
      "The consistently profitable day traders are the ones who tend to take the 1-3 quality opportunities.",
      "The best time to perform your swing trading analysis is when the market is closed."
    ],
    "diagrams": [],
    "checklist": [
      "Which style fits my time, temperament and decision speed?",
      "Is my analysis done before the market opens/while it is closed?",
      "Am I limiting myself to a few quality trades?"
    ],
    "journalTags": ["trading-styles", "day-trading", "swing-trading", "position-trading", "set-and-forget"],
    "newVsPdfs": [
      "Swing trading framed as the least competitive niche (too long for day traders, too short for institutions).",
      "Observation that stock swing setups cluster when the S&P sits at demand."
    ]
  },
  {
    "n": 260,
    "title": "Important Questions Answered on Trading Styles",
    "kind": "article",
    "summary": "Follow-up Q&A on trading styles. Seiden explains that 'the basics never die' (Newton and Adam Smith said the same thing), that swing traders should pair a daily/weekly chart for direction with a 60-minute chart (no smaller) for entry, and that swing trading uses the same analysis as day trading at a slower pace.",
    "sections": [
      {
        "heading": "The basics never die (R.M.)",
        "points": [
          "Price movement is a function of an ongoing demand/supply equation; opportunity exists when it is out of balance.",
          "Newton (objects stay in motion until met by equal or greater force) and Adam Smith (supply exceeding demand drives price down) described the same reality."
        ]
      },
      {
        "heading": "Swing timeframes (E.B.)",
        "points": [
          "Use a larger timeframe (daily or weekly) to see where price is on the supply/demand curve and so which side to trade.",
          "Example: a stock near weekly demand likely offers a quality swing buy.",
          "Use a smaller timeframe such as the 60-minute chart, but no smaller, to pinpoint entry and shrink the stop inside the weekly zone.",
          "Focus on where most of the trading activity sits inside the demand level, as the turn is likely there.",
          "Moving averages are not part of his answer; the levels decide."
        ]
      },
      {
        "heading": "Does swing need different analysis? (B.L.)",
        "points": [
          "No: same larger/smaller timeframe combination, but slower and done while the market is closed, which removes emotion.",
          "Process: find levels, assess trend, plan and take trades per rules."
        ]
      }
    ],
    "rules": [
      "Swing trading: daily or weekly for direction, 60-minute (no smaller) for entry.",
      "Refine a weekly zone on the 60-minute chart to reduce stop size.",
      "Do swing analysis while markets are closed."
    ],
    "mistakes": [
      "Looking for the 'best' moving average to swing trade.",
      "Using too small a timeframe for swing entries.",
      "Analysing while the market is moving and emotions are high."
    ],
    "quotes": [
      "The basics never die.",
      "A 60-minute chart (but no smaller) in your swing trading analysis."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Weekly/daily for the curve and direction; 60-minute to refine the entry and tighten the stop." }
    ],
    "checklist": [
      "Is price near weekly/daily demand or supply?",
      "Have I refined the zone on the 60-minute chart?",
      "Was the plan prepared while the market was closed?"
    ],
    "journalTags": ["qa", "swing-timeframes", "mtf", "refinement", "basics"],
    "newVsPdfs": [
      "Explicit floor for swing entries: no chart smaller than 60-minute."
    ]
  },
  {
    "n": 264,
    "title": "Out-Thinking Your Competition",
    "kind": "article",
    "summary": "A competitive edge has two parts: mental (reality-based thinking, self-control, focus) and strategic (a rule-based plan). In late 2009 the S&P made repeated breakouts to new highs into an October 2008 supply level; XLT members sold each breakout. Three factors: origin of a strong decline, breakout buyers trapped, and no other advisory service watching that level.",
    "sections": [
      {
        "heading": "Two kinds of edge",
        "points": [
          "Mental: reality-based thinking free of illusion, extreme self-control, focus.",
          "Strategic: a rule-based strategy that wins over the opponent."
        ]
      },
      {
        "heading": "The three factors",
        "points": [
          "1) The supply was formed in October 2008 at the origin of a strong decline, so supply far exceeded demand; carry such levels forward.",
          "2) Each rally into the level made new highs; breakout buyers bought after a rally and into supply. His standing XLT line: bearish and a seller on breakouts to new highs within this supply level.",
          "3) Weekly review of competitor advisory services found nobody else pointing out the level, and most were bullish (good jobs/earnings news, a TV host calling Apple to $300) - more buyers to sell to and less competition for the fills.",
          "A member (Scott H.) reported over $10K in a month shorting @ESZ09 off this supply, starting from a clean chart with no indicators."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p265), left: @ES 60-minute, early October 2008 (10/2-10/9). A circled small rally/base around 1,120-1,130 labelled 'XLT Supply' is followed by a collapse to about 960.",
          "Figure 1, right: @ES 240-minute, Nov-Dec 2009 (about 1,050-1,120). Two black horizontal lines carry the supply forward at about 1,106.9 and 1,118. Five circled highs (mid-Nov, ~11/18, ~11/24-25, early Dec, ~12/4) poke into the band; each is followed by a decline toward 1,085-1,090 or lower (one drop near 1,060 in late November). Last price about 1,098."
        ]
      }
    ],
    "rules": [
      "Carry strong supply/demand levels forward until price returns to them.",
      "Sell breakouts to new highs that occur inside a known supply level.",
      "Keep the same stance at the level regardless of news.",
      "Treat lack of attention from other services, and bullish consensus at supply, as an odds enhancer for shorts."
    ],
    "mistakes": [
      "Buying breakouts after a rally and into supply.",
      "Letting good news override the level.",
      "Trading levels that every advisory service is publicising (crowded fills)."
    ],
    "quotes": [
      "I would be bearish and a seller on BREAKOUTS TO NEW HIGHS within this supply level.",
      "When we sell short, we want many to buy."
    ],
    "diagrams": [
      { "key": "zone-anatomy", "caption": "Supply at the origin of a strong decline, carried forward and sold repeatedly." }
    ],
    "checklist": [
      "Is this level the origin of a strong move?",
      "Is the current move into it a breakout that excites buyers?",
      "Is the crowd/news bullish into my supply (or bearish into my demand)?",
      "Is anyone else publicising this level?"
    ],
    "journalTags": ["competitive-edge", "breakout-fade", "carry-forward", "es-futures", "sentiment", "crowding"],
    "newVsPdfs": [
      "Checking competitor advisory services for crowding is an extra odds enhancer not in Kevin's course.",
      "Repeated short entries at the same supply on multiple revisits; Kevin's zone-removal rules would usually treat later touches as weaker."
    ]
  },
  {
    "n": 267,
    "title": "The Many Ways to Benefit from Proper Supply and Demand Analysis",
    "kind": "article",
    "summary": "Beyond trading, supply/demand analysis helps everyday financial decisions. Crude oil daily shows a short at supply targeting demand near $68, which also signalled when to fill up on fuel or hedge (airlines, truckers). The 10-year note daily short at supply after a novice gap up signals rates about to rise, relevant for mortgages and refinancing.",
    "sections": [
      {
        "heading": "Crude oil",
        "points": [
          "XLT shorted crude at daily supply targeting the demand below; the trade made over 12 points.",
          "The demand target was also a long swing entry for some members.",
          "Families: fill tanks (and spare cans) when crude reaches demand. Airlines: buy crude futures at the $68 demand as a hedge - effectively flying at $68 while competitors pay $73. Truckers/taxis: buy fuel ahead."
        ]
      },
      {
        "heading": "Ten-year note",
        "points": [
          "Price rallied into a clear supply well placed high on the larger-timeframe curve, with a novice gap up just before reaching it.",
          "Price and yield are inverse: when the note falls from supply, rates rise.",
          "Use it to time a home loan or refinance, or to lock a fixed rate on an adjustable mortgage before rates rise."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p268): @QM (e-mini crude) daily, Sep-Dec. Top: 'XLT Supply' box about 80.5-82 from the October rally top; circled 'XLT Short Entry' at about 81-82 in early November.",
          "Price declines through November-December to a bottom box 'XLT Demand' about 66.5-68 (the late-September base that launched the rally), circled 'Short Profit Target and Buying Opportunity' near 68; last price about 73.6 after the bounce.",
          "Figure 2 (p270): @TY (10-year note) daily, Apr-Dec. 'XLT Supply Level' two lines about 120'08-121'08 at the top left (origin of the March spike and decline to ~111). Price rallies back through Oct-Nov; arrow 'XLT Short Entry' where it touches the band near 120'00, then drops to about 117'15."
        ]
      }
    ],
    "rules": [
      "Use the opposing level as the target for a short and as a fresh entry for the opposite trade.",
      "A novice gap up into supply that sits high on the larger-timeframe curve adds odds to the short.",
      "Remember price/yield are inverse in bond futures."
    ],
    "mistakes": [
      "Treating supply/demand only as a trading tool and ignoring real-life cost decisions.",
      "Buying fuel or borrowing at variable rates without checking where price sits on the curve."
    ],
    "quotes": [
      "Price and yield are inversely related in this market.",
      "No one entity controls this market."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short at supply, target at demand, then reverse long at that demand." }
    ],
    "checklist": [
      "Where is price on the higher-timeframe curve (high = short, low = long)?",
      "Was there a novice gap into the level?",
      "Is the opposing level far enough for a good profit margin?"
    ],
    "journalTags": ["crude-oil", "ten-year-note", "hedging", "gap-into-supply", "swing", "real-life"],
    "newVsPdfs": [
      "Using a gap into the zone as an odds enhancer (novice buyer) is not in Kevin's material.",
      "Non-trading applications (hedging fuel, timing mortgages) are new."
    ]
  },
  {
    "n": 271,
    "title": "Don't Be a Blind Donor",
    "kind": "article",
    "summary": "End-of-year Q&A. Book advice: learn mechanics from books, but learn speculation from Economics 101 supply and demand. Quality levels are found by how price leaves a level: the stronger the move away, the bigger the imbalance. Moving averages are only secondary for trend; the larger-timeframe level matters more, and he only takes levels meeting his reward minimum.",
    "sections": [
      {
        "heading": "Two buckets of learning",
        "points": [
          "Mechanics (platforms, contract specs) can come from books.",
          "Becoming a profitable speculator should start from basic supply/demand and seeing retail vs wholesale prices on a chart, not from pattern recognition and indicators."
        ]
      },
      {
        "heading": "Extra criteria for levels",
        "points": [
          "Reader recalled: a level cannot be in the middle of a move, and repeated tests weaken it.",
          "Additional key point: look at how price leaves the level - the more out-of-balance, the stronger price moves away; gradual departures mean small imbalance.",
          "Search for periods of momentum first, then go to the origin of that momentum."
        ]
      },
      {
        "heading": "Trend and moving averages",
        "points": [
          "A reader uses a 50-SMA on the daily to choose sides on 4H/60-minute charts.",
          "MA is acceptable only as a secondary tool; primarily judge trend by where price is relative to larger-timeframe levels, because trends start and end at those levels.",
          "He does not trade every level - only those offering his required risk/reward; when found, trend is a distant consideration."
        ]
      }
    ],
    "rules": [
      "Find momentum first, then mark its origin as the potential level.",
      "Grade a level by the strength of the departure from it.",
      "Use moving averages only as a secondary filter.",
      "Only trade levels meeting your minimum risk/reward."
    ],
    "mistakes": [
      "Learning speculation from conventional books full of patterns and indicators.",
      "Treating every level as tradable.",
      "Letting a moving average override a strong larger-timeframe level."
    ],
    "quotes": [
      "Simply learn to see the difference between retail and wholesale prices on a price chart.",
      "When I find it, trend is a distant consideration."
    ],
    "diagrams": [
      { "key": "qualify", "caption": "Strength of departure = size of imbalance; start from momentum and trace back to its origin." }
    ],
    "checklist": [
      "Did price leave the level strongly?",
      "Is the level at the origin of a momentum move?",
      "Does it meet my minimum reward requirement?"
    ],
    "journalTags": ["qa", "strength-of-move", "origin", "moving-average", "trend", "education"],
    "newVsPdfs": [
      "Seiden ranks risk/reward above trend ('trend is a distant consideration'), whereas Kevin's course puts more weight on trend alignment."
    ]
  },
  {
    "n": 274,
    "title": "A Key Rule, Often Overlooked",
    "kind": "article",
    "summary": "The rule most plans miss is to define a demand or supply level with numbers. Seiden's rule: a demand level qualifies only if the initial rally away from it is at least three times the zone height (entry-to-stop), i.e. 1:3. Crude oil and 10-year note daily trades show the grey-shaded initial move compared to the zone.",
    "sections": [
      {
        "heading": "Why quantify",
        "points": [
          "Students can describe drop-base-rally and rally-base-drop but then jump straight to entries, stops and targets.",
          "Quantifying exactly what counts as a level is part of an edge.",
          "A significant profit margin both measures risk/reward and raises probability, because price is far from equilibrium."
        ]
      },
      {
        "heading": "The rule",
        "points": [
          "Buy at the top demand line and place the stop just below the lower line; that distance is the risk.",
          "The initial rally from the level shows there is no significant supply until its top, opening a profit margin.",
          "The initial rally must be at least 3x the zone (e.g. 2-point zone needs at least a 6-point rally) or the level is ignored.",
          "He uses 1:3; you may require 1:4 or more. T1 does not have to be the top of that rally."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p276): @QM crude daily, Oct-Dec 2009. Lower left: 'XLT Demand Level' between two black lines about 66.5-69.5, a clear drop-base-rally in late September/early October.",
          "A grey-shaded rectangle covers the initial rally from about 69.5 to about 82.5 in October - far more than 3x the zone height.",
          "Price returns in mid-December: 'XLT Long Entry' at the upper line (~69.5), arrow 'XLT Protective Stop' just below the lower line.",
          "Blue lines mark T1 (~77) and T2 (~78.5, at a prior December pivot); price reached both, last about 78.5.",
          "Figure 2 (p278): @TY 10-year daily, Apr-Dec. 'XLT Supply Level' about 120'08-121'08 at top left; grey-shaded initial decline from about 121 to about 111 (Apr-June).",
          "In November price returns: 'XLT Short Entry' at the lower supply line, 'XLT Protective Stop' above the upper line; blue T1 near 115'24, reached in December."
        ]
      }
    ],
    "rules": [
      "A demand level counts only if the initial rally is at least 3x the zone height (1:3); same for the initial decline from supply.",
      "Enter at the proximal line, stop just beyond the distal line.",
      "Ignore levels that fail the minimum requirement.",
      "Bigger initial moves mean higher probability of reaching T1."
    ],
    "mistakes": [
      "Calling any drop-base-rally a demand level without measuring the move away.",
      "Assuming T1 must be the top of the initial rally.",
      "Not writing numeric definitions of supply/demand into the plan."
    ],
    "quotes": [
      "A demand level only becomes a demand level if the initial rally is at least three times the demand level.",
      "Few actually define what supply and demand levels are to them."
    ],
    "diagrams": [
      { "key": "qualify", "caption": "Initial move away must be at least 3x the zone height for the level to qualify." },
      { "key": "entry-stop-tp", "caption": "Entry at proximal, stop beyond distal, T1/T2 inside the initial move." }
    ],
    "checklist": [
      "Measure zone height (entry to stop).",
      "Measure the initial move away from the zone.",
      "Is move away >= 3x zone height (or my own multiple)?",
      "Is T1 placed within that profit margin?"
    ],
    "journalTags": ["qualify-zone", "initial-move-3x", "profit-margin", "crude-oil", "ten-year-note", "swing"],
    "newVsPdfs": [
      "Hard numeric qualifier: initial leg out must be at least 3x the zone height. Kevin uses 3:1 for targets but not this specific test of the departure.",
      "Explicit idea that a large profit margin itself raises probability (price far from equilibrium)."
    ]
  },
  {
    "n": 278,
    "title": "Planes, Trains and Automobiles",
    "kind": "article",
    "summary": "Like travel, many routes reach the same destination. The same 10-year note short at daily supply (gap into the level) is shown with price only, then with Bollinger Bands, CCI and Slow Stochastics. Indicators may add comfort, but price reaching supply/demand is the real reason for the turn; filter every indicator signal through levels.",
    "sections": [
      {
        "heading": "Price only",
        "points": [
          "The supply was well placed on the daily curve, odds enhancers rated it high probability, and price gapped into the level, showing novice buyers.",
          "Price and volume alone gave everything needed."
        ]
      },
      {
        "heading": "Indicators as confirmation",
        "points": [
          "Bollinger: at the entry price pierced the upper band (overbought) at supply with a large margin below - higher odds; act on band piercing AND a level, called an 'All Star' setup by the options instructor.",
          "CCI: overbought at entry and oversold at the target, but earlier overbought/oversold readings failed; price turns because of supply/demand, not because CCI is overbought. Using CCI alone would have entered early and exited early.",
          "Stochastics: sell cross lined up with entry and buy cross with the target - but they were not needed."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p280): @TY daily, Apr 2009 to Jan 2010. 'XLT Supply' two lines about 120'08 and 121'12 at top left (March spike origin). Decline to about 110'16 in June, rally into November, 'XLT Short Entry' at about 120'08. Price falls to a 'Target' line about 115'20 (a late-October pivot low) in December, then bounces to about 116'30.",
          "Figure 2 (p281): same chart with Bollinger Bands; at the short entry the high pierces the upper band; at the target price touches the lower band near 114'29.",
          "Figure 3 (p282): same chart with CCI(14, +/-100). Red circles: overbought spike (~+200) at the entry and oversold (~-150) at the target; many earlier overbought readings to the left came with no turn.",
          "Figure 4 (p283): same chart with Slow Stochastics (14,3,3; 80/20). Red circles: bearish cross above 80 at entry and bullish cross below 20 at the target."
        ]
      }
    ],
    "rules": [
      "Price is the primary decision tool; indicators are optional secondary confirmation.",
      "Only act on an overbought/oversold reading when price is also at supply/demand.",
      "Exit at the opposing level, not on an oscillator reading."
    ],
    "mistakes": [
      "Shorting just because price pierced the upper band or CCI is overbought.",
      "Taking profits because an oscillator is oversold.",
      "Not filtering indicator signals through supply/demand levels."
    ],
    "quotes": [
      "Price does not turn lower because CCI is overbought.",
      "Did we need Stochastics for this trading opportunity? No.",
      "Filter those signals through proper supply and demand analysis."
    ],
    "diagrams": [
      { "key": "confirmation", "caption": "Oscillator extremes only count when they coincide with a supply/demand level." }
    ],
    "checklist": [
      "Is price at a qualified level before looking at any indicator?",
      "If using an indicator, does its signal coincide with the level?",
      "Is the target an opposing level rather than an oscillator reading?"
    ],
    "journalTags": ["indicators", "bollinger", "cci", "stochastics", "ten-year-note", "gap-into-supply", "all-star-setup"],
    "newVsPdfs": [
      "Indicator-plus-level 'All Star' setup (band pierce at supply) - Kevin's course does not use Bollinger/CCI/Stochastics.",
      "Seiden accepts indicators as a comfort tool if filtered by levels; Kevin's course is pure price."
    ]
  },
  {
    "n": 284,
    "title": "Trade What is Real, Not What You Feel",
    "kind": "article",
    "summary": "Beliefs drive behaviour which drives actions, and the biggest illusions sit inside conventional technical and fundamental analysis. Three illusions are dismantled with charts: moving averages as support/trend, bad news meaning lower prices, and good fundamentals/upgrades meaning buy. Seiden closes with his three laws of price movement.",
    "sections": [
      {
        "heading": "Moving averages illusion",
        "points": [
          "MAs are averages of past data and lag; slope-based trend filters make you skip the best buys.",
          "Waiting for price to get back above the 200-day MA means higher risk, lower profit potential, and paying the person who bought at demand.",
          "When an MA lines up with real demand/supply it only appears to work."
        ]
      },
      {
        "heading": "News illusion",
        "points": [
          "Strong news leads to strong emotion. Once the last seller sells at a level with more willing buyers, price must rise.",
          "Strong news often creates powerful turns opposite to what most expect, because one side exhausts itself into an objective level."
        ]
      },
      {
        "heading": "Fundamental illusion",
        "points": [
          "Good earnings, strong balance sheet, solid management, rising price, an upgrade and a strong economy create the illusion of a quality investment - usually when price is already high.",
          "When perceived risk is lowest, actual risk is often highest, and vice versa.",
          "Illusions lead to two mistakes: buying after rising prices and buying where sellers outnumber buyers."
        ]
      },
      {
        "heading": "Three laws of price movement",
        "points": [
          "1) Price in any free market is a function of an ongoing supply/demand relationship.",
          "2) Every influence on price is reflected in price.",
          "3) Change in price originates where one of the two forces (buyers or sellers) becomes zero at a specific price.",
          "'Act like a goose': follow rules mechanically like geese flying south, without debating."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p286): S&P 500 daily with 20 MA (blue) and 200 MA (red), about 1,120-1,240. 'A' arrows mark two demand bases between green lines: a lower one about 1,145-1,150 at the start of a strong rally and a higher one about 1,180-1,185 after a gap/rally step.",
          "Circled 'B' points are the first returns to each level: the upper B while the 20 MA slopes down, the lower B well below the 200 MA with the 20 MA sharply down. Both launch strong rallies to about 1,240 - the MA filters would have said do not buy.",
          "Figure 2 (p289): NASDAQ daily, about 1,440-1,640. 'A' is a small demand base between green lines about 1,477-1,488 before a strong rally to about 1,600.",
          "'B' marks the day of the London bombings: a long lower wick spikes down into the A zone (~1,480) and closes higher; price then rallies to about 1,630.",
          "Figure 3 (p291): CTXS 30-minute with a Yahoo Finance upgrades table (Needham Hold to Buy, $40 target, 21-Apr-08). Two black lines mark supply about 32.65-32.85 from an earlier high on 4/18.",
          "On 4/21 price gaps up into that supply with the upgrade ('Public Buys' / 'OTA Student Sells') and then collapses in a long red bar to about 31.0. Side panel: risk to buy perceived low, actual HIGH; profit potential perceived high, actual LOW.",
          "Figure 4 (p293): a list (good earnings, strong balance sheet, solid management, price moving higher, brokerage upgrade, strong economy) bracketed as 'the illusion of a quality investment'."
        ]
      }
    ],
    "rules": [
      "Buy the first return to an objective demand origin even if MAs slope down.",
      "Never buy near supply on the first rally into it, whatever the news or upgrade.",
      "Before any trade ask only: is price at a level with more demand than supply (or vice versa)?",
      "Treat indicators as derivatives of price; price alone is enough."
    ],
    "mistakes": [
      "Using MA slope or the 200-day cross as a trend filter for entries.",
      "Selling on bad news into demand or buying good news into supply.",
      "Buying because fundamentals look great after a big rise.",
      "Buying a gap up into supply."
    ],
    "quotes": [
      "When perceived risk is lowest, actual risk is often highest.",
      "Price is all that needs be considered.",
      "The many illusions are nothing more than risk disguised as opportunity."
    ],
    "diagrams": [
      { "key": "zone-anatomy", "caption": "A = origin of the move (objective level); B = first return, the low-risk entry." },
      { "key": "mindset", "caption": "Beliefs -> behaviour -> actions; trade reality, not illusion." }
    ],
    "checklist": [
      "Is this the first return to the level?",
      "Am I being pulled in by news, upgrades or an indicator rather than the level?",
      "Is the stop small and the distance to the opposing level at its maximum?"
    ],
    "journalTags": ["illusions", "moving-average", "news", "fundamentals", "first-return", "laws-of-price", "gap-into-supply"],
    "newVsPdfs": [
      "The 'three laws of price movement' framework is Seiden-specific.",
      "News-driven spikes into demand (London bombings) framed as the best buys; Kevin generally advises avoiding news events.",
      "Explicit rejection of MA slope as a trend filter, while Kevin's course uses swing structure."
    ]
  },
  {
    "n": 295,
    "title": "Trading Tools You May Not Find in Books",
    "kind": "article",
    "summary": "Two edge-building tools. Trend health: in an uptrend, shrinking distance between pivot lows (pullbacks) signals the trend is weakening and nearing supply; the mirror applies to downtrends. Volume: the biggest turns come on LOW volume because big imbalances leave little time for trades; he prefers below-average volume at his entry.",
    "sections": [
      {
        "heading": "Trend strength by pivot spacing",
        "points": [
          "He rejects higher-highs/higher-lows as a lagging method and uses his own real-time trend analysis.",
          "Strong trends do not pull back often; if pullbacks become frequent the trend is weakening.",
          "A trend is a supply/demand imbalance moving back into balance; works on any market and timeframe."
        ]
      },
      {
        "heading": "Volume",
        "points": [
          "Books say turning points come with above-average or climactic volume; he says the opposite.",
          "The more out of balance a level, the less time price spends there, the fewer transactions, the lower the volume.",
          "He often wants below-average volume at his supply/demand entry."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p297): a long-horizon uptrend chart (monthly-style labels M J S N), price from about 65 to 150 with volume beneath. Vertical dashed lines mark pivot lows; double-headed arrows between consecutive pivot lows get shorter ('Decreasing distance between the pivot lows'). The final arrow ends near the top (~140-150), after which price stalls and turns down.",
          "Figure 2 (p298): schematic 'Buying at Demand': red candles decline into a base of two green and one red candle between two white lines; price rallies, then a red candle pulls back into the zone labelled 'Buy Pullback'. Volume bars below shrink at that pullback (circled 'Low Volume'), then rise as price rallies."
        ]
      }
    ],
    "rules": [
      "Uptrend: shrinking distance between pivot lows means risk to buy rises and the trend is nearly over.",
      "Downtrend: shrinking distance between pivot highs means risk to short rises and the trend is nearly over.",
      "Prefer below-average volume as price returns to your level."
    ],
    "mistakes": [
      "Waiting for higher highs/lows to confirm trend.",
      "Requiring climactic volume to confirm a turn.",
      "Buying late in an uptrend whose pullbacks are getting closer together."
    ],
    "quotes": [
      "A strong trending market does not pullback often.",
      "The larger the supply and demand imbalance at a given price level, typically, the lower the volume."
    ],
    "diagrams": [
      { "key": "trend-momentum", "caption": "Pullbacks getting closer together = trend losing strength and nearing the opposing level." }
    ],
    "checklist": [
      "Are the pivot lows/highs getting closer together?",
      "Is volume below average as price returns to my level?",
      "Is the trend old and close to a higher-timeframe level?"
    ],
    "journalTags": ["trend-strength", "pivot-spacing", "volume", "low-volume", "buy-pullback"],
    "newVsPdfs": [
      "Pivot-spacing trend-exhaustion tool is new; Kevin judges trend with structure, trendlines and momentum.",
      "Volume filter (low volume on the return) - Kevin's course does not use volume."
    ]
  },
  {
    "n": 299,
    "title": "Your Questions Answered",
    "kind": "article",
    "summary": "Q&A on timeframes, single-stock day trading, and trend. Use two or three timeframes suited to your style (e.g. weekly/monthly for the curve, daily/hourly for entries when swing trading futures). Trading one stock (RIMM) needs index analysis (QQQQ) and a larger timeframe. Stop agonising over trend methods; trends begin and end at supply/demand levels.",
    "sections": [
      {
        "heading": "Which timeframe?",
        "points": [
          "Depends on style; always use more than one - two or three.",
          "Larger timeframe shows where price is on the curve (longs or shorts); smaller finds low-risk entries.",
          "His XLT futures swing set: weekly and monthly for the curve, daily and hourly for demand levels with big profit margins."
        ]
      },
      {
        "heading": "Single-stock plan (RIMM)",
        "points": [
          "Reader trades the first 15-minute candle high/low with a 1/3 stop and $0.90-1.00 targets using 5 and 15-minute charts.",
          "First do supply/demand on the index (NASDAQ/QQQQ), then find the matching turns in the stock to filter weak levels.",
          "Even a day trader needs a larger timeframe (60-minute or daily); a perfect 5-minute buy at daily supply will likely fail.",
          "Use a checklist ('odds enhancers') to qualify levels."
        ]
      },
      {
        "heading": "Trend",
        "points": [
          "Conventional HH/HL and MA slope are high risk, low reward, low probability entry methods.",
          "In everyday life nobody buys only after prices rise; doing so in markets transfers money to others.",
          "Every trend begins and ends at out-of-balance levels; get in before the conventional buyers."
        ]
      }
    ],
    "rules": [
      "Use 2-3 timeframes: larger for direction, smaller for entry.",
      "For stocks, analyse the index first and align stock levels with index levels.",
      "Day traders still check 60-minute or daily levels.",
      "Qualify every level with an odds-enhancer checklist."
    ],
    "mistakes": [
      "Trading a stock without looking at its index.",
      "Using only 5- and 15-minute charts.",
      "Spending years searching for the perfect trend method."
    ],
    "quotes": [
      "Every trend begins and ends at price levels where supply and demand are out-of-balance.",
      "Use more than one time frame; typically two or three are perfect."
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Weekly/monthly curve, then daily/hourly entries." }
    ],
    "checklist": [
      "What is the larger-timeframe picture?",
      "Does the index agree with the stock setup?",
      "Has the level passed the odds enhancers?"
    ],
    "journalTags": ["qa", "mtf", "index-alignment", "stocks", "trend", "odds-enhancers"],
    "newVsPdfs": [
      "Index-first analysis for individual stocks (QQQQ before RIMM) is new; Kevin trades FX/indices directly.",
      "Seiden's futures swing set (monthly/weekly + daily/hourly) differs from Kevin's timeframe combos."
    ]
  },
  {
    "n": 302,
    "title": "System Trading - A Complex World with Simple Answers",
    "kind": "article",
    "summary": "Most automated systems fail because they are curve-fitted rather than built on how markets work. A good system needs a novice on the other side. Seiden's simple mechanical template: a 50-period MA slope is the 'switch' (ok to buy or ok to sell) and an oscillator cross in oversold/overbought territory is the 'trigger', ignoring counter-trend signals. With supply/demand, the switch is price reaching the level and the trigger is the entry.",
    "sections": [
      {
        "heading": "Why systems fail",
        "points": [
          "Backtests often show 80%+ winners but lose fast with real money.",
          "Traders then tweak settings and add indicators - a path to disaster.",
          "The foundation must be how markets work: supply and demand out of balance."
        ]
      },
      {
        "heading": "Switch and trigger",
        "points": [
          "Buy rule: MA sloping up -> take stochastic crosses in oversold territory, ignore every overbought sell signal.",
          "Sell rule: MA sloping down -> take crosses in overbought, ignore every oversold buy signal.",
          "Logic: in an uptrend the oversold buy signal shows someone selling after a decline in an uptrend - a novice to buy from.",
          "Switch = on/off permission for one side; trigger = actual entry.",
          "For a level-based system: switch = price reaching the level; trigger = arrival at the level, a reversal candle, etc.",
          "Summary table: uptrend+overbought ignore, uptrend+oversold buy; downtrend+oversold ignore, downtrend+overbought short."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p305): QQQQ 5-minute, 50-period MA rising, Slow Stochastics 14,3,3 (80/20). Price rises from about 44.6 to 45.75, then a sharp drop to about 44.95 (circled) near the rising MA; stochastic crosses up below 20 (circled) and price rallies back to about 45.7. Earlier overbought readings during the rise would have been losing shorts.",
          "Figure 2 (p307): QQQQ 5-minute, MA falling from about 45.2 to 43.2; price grinds down to about 42.5. Circled stochastic crosses down from above 80 mark short entries; oversold crosses are ignored.",
          "Figure 3 (p308): @NQ (e-mini NASDAQ-100) 5-minute, MA sloping down (about 2,027 to 2,007). Two vertical lines at about 11:55 and 14:25 where CCI(14) spikes above +100 (circled) and price then falls - from about 2,020 to 2,000 and from about 2,010 to 1,990.",
          "Figure 4 (p309): USDJPY 5-minute (FOREX), MA rising from about 105.20 to 105.45. Vertical lines at about 18:15 and 22:35 where CCI drops below -100 (circled) near the MA; price then rallies to about 105.55.",
          "Figure 5 (p310): a 2x2 summary table of oscillator signals by trend."
        ]
      }
    ],
    "rules": [
      "Define a switch (permission to buy or sell, never both) and a trigger (entry).",
      "Uptrend: only oversold buy signals; downtrend: only overbought sell signals.",
      "Build systems on logic of who is on the other side, not on backtest optimisation.",
      "Do not keep adjusting settings or adding indicators after losses."
    ],
    "mistakes": [
      "Taking every indicator signal.",
      "Curve-fitting parameters to past data.",
      "Shorting overbought readings in an uptrend.",
      "Adding more indicators when a system loses."
    ],
    "quotes": [
      "Whatever the strategy, there is always a 'switch' and 'trigger.'",
      "There is no perfect trading system and there doesn't need to be."
    ],
    "diagrams": [
      { "key": "trend-trading", "caption": "Trade only pullbacks in the direction of the trend switch." }
    ],
    "checklist": [
      "Is the switch on for this side?",
      "Did the trigger occur in the right territory (oversold in uptrend, overbought in downtrend)?",
      "Am I ignoring counter-switch signals?",
      "Is the rule logical about who is on the other side?"
    ],
    "journalTags": ["system-trading", "switch-trigger", "moving-average", "stochastics", "cci", "qqqq", "usdjpy"],
    "newVsPdfs": [
      "Switch/trigger framework and an indicator-based mechanical template - Kevin's course has no indicator system.",
      "Seiden here accepts an MA slope as a trend switch inside a system, unlike his discretionary articles."
    ]
  },
  {
    "n": 311,
    "title": "Got Questions? Sam has Answers!",
    "kind": "article",
    "summary": "Q&A: add a 'flat MA' state for sideways markets in which both oscillator signals are taken; gaps in the middle of moves - find the nearest drop-base-rally to the gap origin; longer-term demand must have room below supply and some overhead supply absorbed; and hand charting builds feel for supply and demand.",
    "sections": [
      {
        "heading": "Sideways markets",
        "points": [
          "Define trend by a numeric MA slope; between the up and down thresholds the market is sideways.",
          "In sideways mode take both oscillator buy and sell signals; switch back to trend mode once the slope returns."
        ]
      },
      {
        "heading": "Gaps as demand",
        "points": [
          "Be careful with gaps in the middle of moves.",
          "Find the nearest demand (drop-base-rally) to the gap origin; often at the origin, sometimes just below it - that is the low-risk entry. Reverse for gap downs."
        ]
      },
      {
        "heading": "Longer-term (IRA) view",
        "points": [
          "Two equal considerations: a demand level below with significant upside margin to supply, and waiting for some or all of the overhead supply to be absorbed before investing for a big move up.",
          "Reaching demand does not mean price will break the big supply above."
        ]
      },
      {
        "heading": "Hand charting",
        "points": [
          "He used graph paper and coloured pencils; it makes you aware of levels where demand exceeds supply.",
          "Lagging computer signals put people into high risk, low reward trades that pay the tape reader who bought at demand."
        ]
      }
    ],
    "rules": [
      "Define a numeric MA slope threshold for up, down and flat.",
      "For a gap, mark the nearest drop-base-rally at or just below the gap origin.",
      "For long-term investing, require margin to supply and wait for overhead supply to be absorbed."
    ],
    "mistakes": [
      "Using trend-mode rules in a flat market.",
      "Treating any gap origin as demand without finding the actual base.",
      "Assuming price will pass big supply because it bounced at demand."
    ],
    "quotes": [
      "Be careful with those gaps in the middle of moves.",
      "Most will go with the high risk entry - people are people."
    ],
    "diagrams": [
      { "key": "draw", "caption": "For a gap, draw the nearest base at or just below the gap origin." }
    ],
    "checklist": [
      "Is the MA slope up, down or flat by my numeric definition?",
      "Where is the actual base near the gap origin?",
      "Is there overhead supply that has not been absorbed?"
    ],
    "journalTags": ["qa", "sideways", "gap-demand", "overhead-supply", "hand-charting", "long-term"],
    "newVsPdfs": [
      "Rule for gaps: use the nearest base to the gap origin, sometimes just below it.",
      "Waiting for overhead supply to be absorbed before long-term investing."
    ]
  },
  {
    "n": 315,
    "title": "Patience and Probabilities",
    "kind": "article",
    "summary": "Markets spend most time near equilibrium and little time at strong imbalances, so patience is needed to wait for those levels. GOOG daily swing short on March 12: five odds enhancers lined up (S&P near supply, novice gap-up buying, gap-down origin, VIX at demand, large profit margin). The entry was taken at the level before the red confirmation candle.",
    "sections": [
      {
        "heading": "Patience",
        "points": [
          "Fast platforms tempt home traders to over-trade.",
          "Low risk, high reward, high probability only exists at extreme imbalance, which is rare; patience and probability go together."
        ]
      },
      {
        "heading": "Odds enhancers for the GOOG short",
        "points": [
          "1) S&P nearing supply - most stocks likely to decline.",
          "2) Novice buying - gap up after a strong rally and into supply.",
          "3) Gap down from the supply originally - stronger departure, bigger imbalance.",
          "4) VIX near demand - complacency; when everyone has bought the market must fall.",
          "5) Large profit margin to demand - the further from equilibrium, the higher the probability.",
          "Not every opportunity has all of them."
        ]
      },
      {
        "heading": "No waiting for confirmation",
        "points": [
          "The entry day closed red at supply; next day gapped down to T1.",
          "Most wait for the red candle before shorting the next day; the astute speculator is already short and those late sellers help push price down."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p316): XLT swing-trading screen, 12 March. Circled grey S&P chart (upper left) nearing supply; circled VIX chart (lower left) near demand; a GOOG chart circled with labels 'Supply' and 'Short Entry' where price meets the supply line; watch list on the right.",
          "Figure 2 (p318): GOOG daily, Dec 2009-Mar 2010. Price peaks about 625 in early January, falls to a small base; 'Supply Level' two lines about 580-592 in mid/late January.",
          "A circled 'Gap' just below the zone shows the gap down from the base to about 565, then lows near 525 in February.",
          "In March price rallies, gaps up into the zone; arrow 'Novice Buyer' at a candle reaching about 588. Next candles red, the last gapping down to about 557."
        ]
      }
    ],
    "rules": [
      "Wait for price to reach the level; enter at the level, not after confirmation.",
      "Stack odds enhancers: index at a level, novice behaviour (gap after rally), strong departure (gap), sentiment (VIX), large profit margin.",
      "For stock shorts, the index should be at or near supply."
    ],
    "mistakes": [
      "Over-trading in balanced markets.",
      "Waiting for a confirmation candle before entering.",
      "Ignoring the index and sentiment context."
    ],
    "quotes": [
      "Patience and probabilities go hand-in-hand.",
      "With patience comes high probabilities."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Odds enhancers stacked: strong departure, novice gap in, index/VIX context, big profit margin." },
      { "key": "remove-limit", "caption": "Entry at the level with a limit order, before the confirmation candle." }
    ],
    "checklist": [
      "Is the S&P/NASDAQ at a matching level?",
      "Is the VIX at an opposing level (demand for shorts)?",
      "Did price leave the zone with a gap?",
      "Are novices gapping in after a rally?",
      "Is the profit margin to the opposing level large?"
    ],
    "journalTags": ["patience", "odds-enhancers", "goog", "vix", "gap-into-supply", "no-confirmation", "swing-short"],
    "newVsPdfs": [
      "Entry at the level without confirmation - Kevin's course often uses confirmation entries on a lower timeframe.",
      "VIX as a sentiment odds enhancer and S&P context for stock trades are new."
    ]
  },
  {
    "n": 319,
    "title": "Patience and Probabilities, Part 2",
    "kind": "article",
    "summary": "Starts here and continues into the next part. For stock day trades, time entries to S&P/NASDAQ turning points. On March 24 the S&P and INTC both reached yellow-shaded supply (origins of declines) with demand much lower, so XLT shorted both; S&P reached its demand target.",
    "sections": [
      {
        "heading": "Aligning stocks with the index",
        "points": [
          "Supply levels are the origins of price declines; price cannot stay there because supply exceeds demand.",
          "INTC worked because the S&P was also at supply with demand lower - an acceptable (not great) profit margin.",
          "Shorting INTC when the S&P/NASDAQ is not at supply is very low probability."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure (p320): composite of XLT screens. Left labels: 'XLT Pre Market Planning: 1) S&P at supply 2) Demand much lower 3) INTC at supply'; 'XLT Trading: 1) Short S&P 2) Short INTC'.",
          "Grey S&P charts show yellow supply boxes; circled 'S&P Supply (short entry)' where price returns, and a blue line below marked 'S&P Demand (target met)' that price later reaches.",
          "White INTC charts (three timeframes) show yellow supply with a circle at 'INTC Supply (short entry)'.",
          "Order ticket: Sell 5 at 1,167.25 and Buy 5 at 1,163.00 - a 4.25-point S&P futures short."
        ]
      }
    ],
    "rules": [
      "Only short stocks when the S&P/NASDAQ is also at supply (and long when at demand).",
      "Plan pre-market: index level, distance to opposing level, stock level.",
      "Supply = origin of a decline."
    ],
    "mistakes": [
      "Shorting a stock at supply while the index is mid-range or at demand.",
      "Lacking patience for index and stock to line up."
    ],
    "quotes": [
      "Timing your entries in stocks to the S&P and NASDAQ supply and demand levels is the key."
    ],
    "diagrams": [
      { "key": "sequence", "caption": "Pre-market plan: index at level -> margin to opposite level -> stock at level -> enter." }
    ],
    "checklist": [
      "Is the S&P/NASDAQ at supply (for shorts) or demand (for longs)?",
      "Is demand far enough below for an acceptable margin?",
      "Is the stock at its own matching level?"
    ],
    "journalTags": ["index-alignment", "day-trading-stocks", "intc", "s-and-p", "pre-market-plan"],
    "newVsPdfs": [
      "Index-to-stock alignment as a requirement; Kevin's course trades instruments standalone."
    ]
  }
];
