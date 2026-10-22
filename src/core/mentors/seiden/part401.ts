// Sam Seiden, "5 years of supply and demand teaching", original PDF pages 401-423.
// Study notes paraphrased from a full read of every page, including the chart images.
// Note: pp. 401-403 hold only the tail of "Remove the Veil of Illusion" (starts p. 394), so it is covered in the previous part.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P401: VideoLesson[] = [
  {
    "n": 403,
    "title": "Do You Have a Copy - Paste Mentality in Your Trading?",
    "kind": "article",
    "summary": "Starting from a friend's 'copy - paste' remark about US chain stores in Dubai, Seiden argues that losing traders copy crowd behaviour and conventional technical-analysis books, while winners think differently and focus only on supply and demand. He walks through an XLT short in the QQQ: a supply level that price left by falling, a pre-planned short when price rallied back, and the cover at the demand level below.",
    "sections": [
      {
        "heading": "The copy - paste mind",
        "points": [
          "Losing traders watch what others do, copy those novice actions into their own belief system and end up with a 'copy - paste' mind and life.",
          "The first step to trading success is simply to think differently from most people.",
          "Very few people make consistent low-risk income from conventional TA books, yet more people buy them every day and repeat what they suggest.",
          "Successful people ignore what the crowd is doing and repeat the actions that produced their own success, because they focus on what is real: price moves only through supply and demand."
        ]
      },
      {
        "heading": "The QQQ XLT trade (the logic)",
        "points": [
          "A level where supply and demand looked balanced; then price declined from it, which revealed that supply was greater than demand.",
          "After that decline, wrap two lines around the level and extend them to the right: this is the supply zone, a potential future turning point.",
          "The plan, made in advance: sell short when price rallies back up to that zone. When it did, risk was low, reward high and odds strong.",
          "The odds come from knowing who is on the other side: a buyer who buys after a rally and into a level where supply exceeds demand, the two classic losing-trader mistakes.",
          "One XLT member shorted 2,500 shares at the supply level, per the pre-set plan.",
          "Price then fell to demand, where the short was covered by buying from the 'copy - paste' sellers who were selling after a decline into demand."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p. 405): screenshot of the Online Trading Academy XLT live room. Left: participant list (Sam Seiden as moderator) and the chat window; the last chat line, boxed in green, reads roughly 'shorted 2500 qqq 57.70'. Right: the shared whiteboard with several TradeStation windows; the highlighted one is the QQQ chart with a yellow 'Supply' box at the upper left and a yellow 'Demand' box at the lower right.",
          "Figure 2 (p. 406): QQQ (PowerShares QQQ Trust, NASDAQ) 15-minute chart, about 4/3 to 4/6. On the left, after a run up to about 57.90, a small yellow 'Supply' base sits between black lines at about 57.73 (proximal) and 57.81 (distal); price then dropped hard in long red candles to about 57.30 and on to about 57.03.",
          "Figure 2 continued: price bounced to about 57.47 on 4/5, then fell into a yellow 'Demand' base around 57.01-57.12 (late 4/5). On 4/6 it gapped higher at the open and rallied straight back up to the supply's lower line: 'Short Entry' circled at about 57.73.",
          "Figure 2 trade marks: red 'Buy Stop' line just above the zone at about 57.82; blue 'Target 1' at about 57.57; blue 'Target 2' at about 57.15, just above the demand zone's top line. Price fell in large red candles through both targets into demand (last price 57.14). Risk about 9 cents against about 58 cents to Target 2, roughly 6:1."
        ]
      }
    ],
    "rules": [
      "Draw a supply zone only after price has declined from the level; wrap two lines around it and extend them forward.",
      "Plan the short before price returns: sell when price rallies back into the supply zone.",
      "Place the protective buy stop just above the zone's upper (distal) line.",
      "Use the opposing demand level below as the final target; cover the short there.",
      "Enter only where the counterparty is buying after a rally and into supply (or selling after a decline into demand)."
    ],
    "mistakes": [
      "Copying the crowd and conventional TA books instead of thinking independently.",
      "Buying after a rally in price.",
      "Buying into a level where supply already exceeds demand.",
      "Selling after a decline into a demand level."
    ],
    "quotes": [
      "Those who know what they are doing in trading get paid from those who don't.",
      "Proper market speculation is simple; actually having the right knowledge and discipline to do it is not easy.",
      "The first step in successful trading is to simply think different than most."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "QQQ short: entry at the supply's proximal line, buy stop above the distal line, targets down to the demand zone below." },
      { "key": "mindset", "caption": "Think differently from the crowd: the copy - paste trader is the counterparty you want." }
    ],
    "checklist": [
      "Did price leave this level with a clear decline (supply) or rally (demand)?",
      "Are the zone lines drawn and extended forward before price returns?",
      "Is the entry, stop and target set in advance?",
      "Is the counterparty buying after a rally into supply (or selling after a drop into demand)?",
      "Is there an opposing zone to use as the final target?"
    ],
    "journalTags": ["copy-paste-mind", "think-different", "qqq-short", "pre-planned-entry", "cover-at-demand", "counterparty"],
    "newVsPdfs": [
      "The 'copy - paste mind' psychology framing is not in Kevin's course.",
      "Target 1 here is a level partway down (not a fixed 3:1); Kevin takes 25% at 3:1 and holds the rest to the next HTF opposing zone. Both end at the opposing zone."
    ]
  },
  {
    "n": 408,
    "title": "How Do You Find Market Turning Points in Advance?",
    "kind": "article",
    "summary": "Seiden says the entry is the key decision in a trade: entering as close to the turn as possible gives the largest size for the least risk and the biggest distance to target. Price turns where supply and demand are most out of balance, and he lists three XLT 'Odds Enhancers' to find such levels: how price left, how long it stayed, and how far it went before returning. No charts in this article.",
    "sections": [
      {
        "heading": "Why the entry matters most",
        "points": [
          "Stops, targets, duration, risk and position sizing all depend on getting the entry right.",
          "Entering right at the turn lets you trade the largest position with the least money at risk.",
          "It also puts you farthest from your profit target, so the reward side is as large as it can be."
        ]
      },
      {
        "heading": "Odds Enhancer 1: how did price leave the level?",
        "points": [
          "The stronger the move away, the bigger the imbalance at the level.",
          "Three grades of departure, weakest to strongest: a gradual move; a strong move with big red or green candles; a gap away.",
          "A gap away is the strongest and shows the biggest imbalance."
        ]
      },
      {
        "heading": "Odds Enhancer 2: how much time did price spend at the level?",
        "points": [
          "Less time at the level means a bigger imbalance.",
          "This contradicts the books that favour busy, high-volume levels: if price could spend a long time there, supply and demand cannot have been very out of balance.",
          "A strong imbalance means few transactions and so lower volume: look for levels with little activity and low volume."
        ]
      },
      {
        "heading": "Odds Enhancer 3: how far did price move away before returning?",
        "points": [
          "The farther price ran before coming back, the greater the profit margin and the probability.",
          "A far run means the level sits far out on the supply/demand curve, away from equilibrium: a stretched rubber band that is more likely to snap back.",
          "For a supply short: the buyer on the return is buying after a very large rally, a big mistake that helps the seller.",
          "Measure from the supply level to the lowest low made before price rallied back: that distance becomes one of the profit targets."
        ]
      },
      {
        "heading": "Resources he points to",
        "points": [
          "His Lessons from the Pros and SFO Magazine articles, the OTA website recordings, a basic Economics 101 book, and the XLT live-market program."
        ]
      }
    ],
    "rules": [
      "Enter as close to the turn in price as possible.",
      "Grade the departure: gap away > big-candle move > gradual move.",
      "Prefer levels where price spent little time and traded low volume.",
      "Prefer levels price moved far away from before returning.",
      "Use the extreme of the move away (lowest low for supply, highest high for demand) before the return as a profit target."
    ],
    "mistakes": [
      "Looking for levels with lots of trading activity and high volume, as conventional books suggest.",
      "Entering far from the turn, which means smaller size, more risk and less reward.",
      "Believing something just because most people believe it (herd thinking)."
    ],
    "quotes": [
      "The stronger price moves away from a price level, the more out-of-balance supply and demand are at the level.",
      "The less time price spends at a level, the more out-of-balance supply and demand are.",
      "The more it is stretched, the more likely it is to snap back."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Odds enhancers: strength of departure, time at the level, distance travelled before the return." },
      { "key": "zone-anatomy", "caption": "A short base (few candles) with a strong departure marks the biggest imbalance." }
    ],
    "checklist": [
      "How did price leave: gradual, big candles, or a gap?",
      "How many candles did price spend at the level (fewer is better)?",
      "Was volume at the base low?",
      "How far did price run before returning, and is that distance a usable target?",
      "Is my entry as close to the zone (the turn) as possible?"
    ],
    "journalTags": ["odds-enhancers", "strong-departure", "gap-away", "time-at-level", "low-volume-base", "run-out-target", "rubber-band"],
    "newVsPdfs": [
      "Low volume at the base as a quality sign: Kevin's course has no volume logic.",
      "Using the run-out extreme (lowest low before the return) as a profit target is new; Kevin targets 3:1 and the next HTF opposing zone.",
      "The departure grading (gradual / big candles / gap) and few basing candles match Kevin's 'explosive move away' and short-basing ideas."
    ]
  },
  {
    "n": 410,
    "title": "Trading with the Trend",
    "kind": "article",
    "summary": "Using an OTA Pro Pick short in USDCHF, Seiden shows what 'trade with the trend' means as a rule: in a downtrend, only look for supply levels to short. Of many visible supply levels only one met the odds-enhancer criteria; price rallied to it, turned and fell over 100 ticks for 25 ticks of risk. The buyers on the other side made three mistakes, the third being buying in a downtrend.",
    "sections": [
      {
        "heading": "The rule behind 'the trend is your friend'",
        "points": [
          "OTA core strategy: supply (retail), demand (wholesale) and trends.",
          "When the trend is down, only look for supply (resistance) levels, because you only want to sell short.",
          "Many supply levels may appear on a chart; only the one that meets the odds-enhancer rules is chosen."
        ]
      },
      {
        "heading": "Four reasons to sell the USDCHF supply",
        "points": [
          "A quality supply level with several odds enhancers.",
          "A significant profit margin below.",
          "An ideal risk/reward.",
          "A strong downtrend."
        ]
      },
      {
        "heading": "Market timing and the counterparty",
        "points": [
          "Price rallied back to supply, stopped and fell well over 100 ticks to the targets while risking only 25 ticks.",
          "He disputes the claim that turning points cannot be timed: quantify where supply and demand are out of balance, because that is where price turns.",
          "The buyers made three mistakes: buying after a rally; buying where supply exceeded demand (worse than the first); buying in the context of a downtrend.",
          "In a downtrend the odds are with the shorts. Those who trade against the trend tend to pay those who trade with it."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p. 411): OTA Pro Picks screen dated 5/11/2011, Forex intraday, USDCHF Short. Trends panel: short term Down, long term Down. Trade parameters: pick date 4/27/2011, entry .8827-.8852, stop .8857, target 1 .873, target 2 .87.",
          "Figure 1 results panel: entry date 4/27/2011, closed for profit, quantity 16, exit .873, P/L $1,672, +214 points. Strategy note: 30-minute timeframe, 'trending down strongly', cancel the trade going into the FOMC announcement until the market settles, and a confirmation-entry stipulation. Log: T1 hit, stop moved to .8795, rest exited at .8710.",
          "Figure 1 chart: a long decline from a top on the left, a small yellow 'Supply Zone' marked about 0.88276-0.88550, and a grey 'Target 1' line about 0.87293 below, with price already dropping to it.",
          "Figure 2 (p. 412): USDCHF 30-minute TradeStation chart, 4/25 evening to 4/27 evening. A yellow 'Supply Zone' early on 4/26 between black lines at about 0.8832 and 0.8850: price jumped up into a short base, then fell in long red candles to about 0.8780.",
          "Figure 2 continued: a bounce to about 0.8810, then a further drop to a spike low near 0.8660 (afternoon 4/26). On 4/27 price climbed steadily back up to the zone's lower line around 10:00, circled as 'Short Entry' near 0.8832, then fell back to about 0.8695 by the evening.",
          "The run from the zone to the 0.8660 low is the 'distance before return' odds enhancer; the 25-tick stop vs 100+-tick move gives roughly 4:1 or better."
        ]
      }
    ],
    "rules": [
      "Downtrend: only short at supply. Uptrend: only buy at demand.",
      "Pick only the level that meets the odds-enhancer criteria, not every visible level.",
      "Require quality level + profit margin + good risk/reward + trend in your favour before shorting.",
      "Example sizing of risk: 25 ticks risked for 100+ ticks of potential.",
      "Stand aside (cancel pending entries) going into a major announcement such as the FOMC until the market settles (from the Pro Pick note)."
    ],
    "mistakes": [
      "Buying after a rally in price.",
      "Buying at a level where supply exceeds demand.",
      "Buying in the context of a downtrend.",
      "Trading every supply level on the chart instead of the one that qualifies."
    ],
    "quotes": [
      "Those who trade against the trend tend to pay those who trade with the trend.",
      "The professionals say you can't time the markets turning points; we say you can.",
      "If you would not take this novice action when buying things in any other part of life, don't do it when trading."
    ],
    "diagrams": [
      { "key": "trend-trading", "caption": "Downtrend: ignore demand, sell the qualifying supply on the rally back." },
      { "key": "entry-stop-tp", "caption": "USDCHF: entry .8827-.8852, stop .8857, targets .873 and .87." }
    ],
    "checklist": [
      "What is the trend on my trading timeframe and above? Am I trading in its direction?",
      "Which single supply/demand level meets the odds enhancers?",
      "Is there a significant profit margin to the target?",
      "Is the risk small relative to the target (e.g. 25 vs 100+ ticks)?",
      "Is a major announcement (FOMC etc.) due? If so, wait.",
      "Is the counterparty buying after a rally, into supply, against the trend?"
    ],
    "journalTags": ["with-trend", "usdchf", "pro-picks", "three-mistakes", "odds-enhancers", "fomc-stand-aside", "market-timing"],
    "newVsPdfs": [
      "Same direction rule as Kevin (trade zones with the trend; counter-trend is lower odds).",
      "The 'buyer's third mistake = buying in a downtrend' counterparty framing is new.",
      "Pro Pick note to cancel the order going into the FOMC: Kevin's news handling differs; check your own news rule."
    ]
  },
  {
    "n": 414,
    "title": "The Two Most Important Parts of a Trade Setup",
    "kind": "article",
    "summary": "After hearing another speaker list six factors for a Euro trade, Seiden says he needs only two: the quality of the supply/demand level (where price will turn) and the profit margin (where price will go). A gold short and his March 2011 S&P buy call during the Japan disaster show both: a fast departure from the level, and a 'rally with no basing' meaning open space. He bought against the downtrend and the news because both factors were present.",
    "sections": [
      {
        "heading": "Only two things",
        "points": [
          "1) Quality of the supply or demand level: tells you where price will turn.",
          "2) The profit margin: tells you where price will go.",
          "If both are present he takes the trade and typically considers nothing else; everything else is secondary."
        ]
      },
      {
        "heading": "Reading the profit margin from price action",
        "points": [
          "The supply was high quality because price declined from it so quickly: willing supply far greater than willing demand.",
          "Below it, the rally had no basing: nothing on the chart suggests strong demand in that price range.",
          "As fast as price rallied through that range, expect it to fall back through it at the same rate next time.",
          "On a CME trade desk this looks like a big stack of sell orders at supply and no significant buy orders until many points lower."
        ]
      },
      {
        "heading": "The Japan disaster buy (S&P, March 2011)",
        "points": [
          "On March 15, 2011, at the height of the tragedy, Barron's/WSJ asked whether the global sell-off was the start of a larger decline.",
          "News was real and awful, the trend was down and TV pundits called for lower prices.",
          "But price had declined to a quality demand level and there was a clear profit margin above, so he called it a very good buying opportunity.",
          "Price rallied strongly from demand, through the margin and beyond.",
          "Lesson: ignore most conventional TA and news analysis; apply how you profit buying and selling anything."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p. 415), left: @GC gold 30-minute COMEX chart around 12/29-12/30. A yellow 'Demand (wholesale)' base at the bottom near 1,403-1,404; from it a big circled rally in tall green candles with no basing up to about 1,414. A yellow 'Supply (Retail)' base at the upper right around 1,411.5-1,413.5 marked 'Sold Short'.",
          "Figure 1 continued: price dropped fast from the supply back down through the no-basing rally area; a bracket 'Took Profits' sits around 1,404-1,407, just above the demand. Right: the trading platform/DOM with filled orders and a highlighted P/L, 'Low Risk Profit: $1,200'. Banner: 'Risk $400 to make $1,200' (3:1).",
          "Figure 2 (p. 416): Barron's article 'Steer Clear of a Radioactive Japan Stock Play' (3/15/2011) with Seiden's highlighted quote that markets collapse into high-quality demand levels that turn out to be buying opportunities. Right: S&P (@ES E-mini) daily chart, Dec 2010-Mar 2011: strong uptrend from about 1,200 to about 1,340 in February, then a drop with large red candles (circled) into the upper of two yellow 'Demand Zones' (about 1,250-1,262); a lower demand sits about 1,205-1,225. An arrow labels the touch 'Interview Day'.",
          "Figure 3 (p. 417): the same S&P daily chart later: the 'Demand Zone' around 1,240-1,250, the circled touch on interview day, then a strong rally to about 1,320-1,330 by early April. Caption: the market was down hundreds during the interview and the news was very bad, the strategy said buy, and the Dow then rallied over 800 points."
        ]
      }
    ],
    "rules": [
      "Take a trade only when both a quality level and a clear profit margin are present.",
      "Judge level quality mainly by how quickly price left it.",
      "Judge profit margin by the price action between entry and the opposing level: a move with no basing means no opposing orders and open space.",
      "A quality HTF demand with clear margin can be bought even in a downtrend and against bad news.",
      "Example risk/reward: risk $400 to make $1,200 (3:1)."
    ],
    "mistakes": [
      "Over-analysing with many factors (six-factor Euro analysis) instead of the two that matter.",
      "Letting bad news, the trend and TV opinions stop you buying at quality demand with margin.",
      "Ignoring what lies between entry and target (bases there reduce the margin)."
    ],
    "quotes": [
      "The quality of the Supply or Demand level itself - this tells me where price will turn.",
      "The profit margin - this tells me where price will go to.",
      "There is just a rally in price with no basing."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Two factors: level quality (fast departure) and profit margin (no bases between entry and target)." },
      { "key": "entry-stop-tp", "caption": "Gold short: sell supply, take profits just above the demand at the origin of the no-basing rally." }
    ],
    "checklist": [
      "Did price leave the level quickly (quality)?",
      "Between entry and target, is there any basing (opposing orders)? None = clear margin.",
      "Where is the opposing zone (target), and is the reward at least 3x the risk?",
      "If the trend or news is against me, is this a quality HTF level with a clear margin?"
    ],
    "journalTags": ["two-factors", "level-quality", "profit-margin", "no-basing", "gold-short", "japan-2011", "news-contrarian"],
    "newVsPdfs": [
      "Seiden's minimum filter is only quality + margin; Kevin uses a fuller qualify process (removal, HTF alignment, trend).",
      "He bought against a daily downtrend because quality + margin were present; Kevin treats counter-trend as lower odds (allowed only with HTF support).",
      "Defining the margin as 'no basing between entry and target' is close to Kevin's 'clear path' idea but stated here as an explicit rule."
    ]
  },
  {
    "n": 418,
    "title": "Learn the Answers to Your Questions on Strategy with Sam",
    "kind": "article",
    "summary": "Reader Q&A that follows up 'The Two Most Important Parts of a Trade Setup'. Seiden covers timeframe pairs for day and swing trading, what happens to a level after the first revisit, win rate on larger timeframes, when to trade a reversal, touch count versus penetration depth, counter-trend trades, Fibonacci and pivots, and candlestick patterns. No charts in this article.",
    "sections": [
      {
        "heading": "Which timeframes (Jacqueline)",
        "points": [
          "Day trading: pair a larger timeframe (hourly or daily) with a small one (5-minute).",
          "The larger timeframe shows where price is on its supply/demand curve, which decides whether to look for buys or sells on the small timeframe.",
          "Example: price at or near larger-timeframe supply, so go to the 5-minute chart and short quality supply levels with good profit margin.",
          "Swing trading: daily and weekly charts should be fine."
        ]
      },
      {
        "heading": "After the first revisit (Eliza)",
        "points": [
          "CME floor example: a large stack of S&P buy orders at 1245 with the market opening at 1260.",
          "The first time price reaches 1245 it bounces higher.",
          "Each later decline to 1245 fills more of those orders: demand weakens, 'layers of the floor' are removed.",
          "Once all orders at 1245 are filled, price falls quickly to the next demand level."
        ]
      },
      {
        "heading": "Win rate on larger timeframes (Michael)",
        "points": [
          "Win rates are usually higher on daily, weekly and monthly charts because the levels are very clear.",
          "Larger-timeframe levels trump smaller-timeframe ones: a good HTF demand with margin is not undone by small-timeframe noise.",
          "The reverse is not true: a 5-minute demand with supply far above is not enough information; check where it sits on the HTF curve.",
          "LTF buy near HTF demand: typically works very well. LTF buy at or near HTF supply: very low odds."
        ]
      },
      {
        "heading": "Strong vs weak levels and reversal trades",
        "points": [
          "Trends always end and begin at fresh larger-timeframe supply and demand levels.",
          "That is where you stop trading with the trend and trade against it, anticipating the reversal and entering the new trend before it gets going.",
          "First make sure your own definition of a quality level is correct."
        ]
      },
      {
        "heading": "Touch count vs penetration depth",
        "points": [
          "He rejects the textbook 'touch count' / '3 taps' rule as less objective.",
          "Watch how deep price goes into the level on each return.",
          "If price just touches the level and leaves strongly, the imbalance is still big: trade it again on the 2nd, 3rd and later returns.",
          "Once price trades 25% or more into the level, take no more trades there: the imbalance is no longer strong enough."
        ]
      },
      {
        "heading": "Counter-trend, Fibonacci/pivots, candlesticks",
        "points": [
          "Counter-trend: only when the trend is reaching a larger-timeframe supply or demand level, meaning it is about to end.",
          "Fibonacci and pivots: not used. They are calculations that ignore willing supply and demand, and they give several lines to choose from; the one that works is always the one lining up with real supply/demand, so why use the Fib?",
          "Candlesticks: no conventional patterns. Focus only on the picture of where demand exceeded supply or vice versa.",
          "Head-and-shoulders and double tops make you wait for a big decline before selling (selling low) instead of selling high at supply."
        ]
      },
      {
        "heading": "Closing",
        "points": [
          "Almost every trading question is answered by asking how you profit buying and selling anything: use your 'bag of logic'."
        ]
      }
    ],
    "rules": [
      "Day trading: hourly or daily for direction, 5-minute for entries. Swing trading: weekly for direction, daily for entries.",
      "At or near HTF supply, only look for LTF shorts; at or near HTF demand, only LTF longs.",
      "A level weakens with each revisit; expect a fast move to the next level once its orders are used up.",
      "Ignore touch count; keep trading a level whose returns only touch and leave strongly.",
      "Stop trading a level once price has penetrated 25% or more into it.",
      "Trade counter-trend only when the trend reaches a fresh larger-timeframe supply/demand level.",
      "Do not use Fibonacci retracements, pivot points or conventional candlestick/chart patterns."
    ],
    "mistakes": [
      "Taking a 5-minute buy that sits at or near larger-timeframe supply.",
      "Relying on touch count ('3 taps') instead of how deep price goes into the level.",
      "Using Fib or pivot lines that ignore actual supply and demand.",
      "Waiting for H&S or double-top patterns, which make you sell low after a big decline.",
      "Trading reversals without a fresh HTF level or a correct definition of quality."
    ],
    "quotes": [
      "Trends always end and begin at 'fresh' larger time frame demand and supply levels.",
      "Larger time frame levels trump smaller time frame levels.",
      "Why do I need the Fib line when I am always taking the one that lines up with real demand or supply?"
    ],
    "diagrams": [
      { "key": "mtf", "caption": "HTF location (hourly/daily or weekly) decides buy vs sell setups on the LTF (5-minute or daily)." },
      { "key": "zone-removed", "caption": "Each revisit fills orders at the level; once used up price moves fast to the next level." }
    ],
    "checklist": [
      "Where is price on the higher-timeframe supply/demand curve?",
      "Is my LTF setup in the same direction as the HTF location?",
      "How deep did earlier returns go into this zone: under 25%?",
      "If counter-trend, is the trend arriving at a fresh HTF level?",
      "Am I relying on Fib, pivots or candle patterns instead of the zone itself?"
    ],
    "journalTags": ["timeframe-pairs", "htf-trumps-ltf", "revisit-weakens", "penetration-25pct", "no-touch-count", "counter-trend-at-htf", "no-fibonacci", "no-candle-patterns"],
    "newVsPdfs": [
      "Freshness by depth: Seiden says 25%+ penetration ends the level but touch count does not matter; Kevin's 0/25/50/75/100 grid treats ~25% as a 'mid' zone, over 75% as out, and also counts the number of tests.",
      "Counter-trend allowed explicitly at a fresh HTF level ('trends end and begin there'); Kevin calls counter-trend lower odds.",
      "Specific timeframe pairs (H1/D1 with M5; W1 with D1) differ from Kevin's own HTF/entry pairs.",
      "Kevin uses the Fibonacci tool only as a drawing tool (levels 0 and 1), not for retracements, so no conflict with Seiden's 'no Fib' rule."
    ]
  }
];
