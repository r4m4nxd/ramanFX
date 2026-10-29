// Sam Seiden, "5 years of supply and demand teaching", original PDF pages 321-400.
// Study notes paraphrased from a full read of every page, including the chart images.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P321: VideoLesson[] = [
  {
    "n": 321,
    "title": "An XLT \"Edge\" Building Rule to Better Your Odds",
    "kind": "article",
    "summary": "Seiden shares one odds-enhancing rule: a supply level with another supply level sitting just above it (or demand with demand just below) is stronger than a lone level. He shows an S&P (SPY 5-minute) short taken at stacked supply and explains how to enter when two levels are stacked. (Page 321 opens with the last lines of the previous article; this lesson starts at the new heading.)",
    "sections": [
      {
        "heading": "Levels on top of levels",
        "points": [
          "The only reason to study trading is to gain an edge over the competition; this is one rule rarely found in conventional books.",
          "Stacked supply levels are like a bank vault with two steel doors instead of one: price arriving at the lower supply meets a 'thick' area of supply.",
          "The buyer he sold to had bought after a strong rally straight into that thick supply - a very novice mistake, 'a plastic hammer' against two vault doors.",
          "The same logic applies to demand: a demand level with another demand level just below is typically stronger."
        ]
      },
      {
        "heading": "How to enter stacked levels",
        "points": [
          "Option 1: scale in - part of the position at the lower (proximal) supply level, the rest at the upper level, with the stop above the upper level.",
          "Option 2: enter the whole position at the upper supply level.",
          "Never enter the full position at the bottom level with a buy stop just above the bottom level - that puts your stop exactly where you should be adding/entering short."
        ]
      },
      {
        "heading": "Mindset: odds, not certainty",
        "points": [
          "A tongue-in-cheek 'mayor of Foolsville' story: the copy-paste crowd was buying at $119.00 SPY on a 'buy signal', exactly where he planned to short.",
          "Certainty does not exist in trading or life; search for better odds with objective, rule-based supply/demand analysis ('motion into mass').",
          "Not every trade wins, but levels on top of levels dramatically increase the odds."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.322): SPY 5-minute (TradeStation, S&P ETF used to represent the S&P futures trade, 4/7/10). Upper-left: an origin labelled 'Supply' around 119.10-119.20 (a rally, a few small candles marked B, then a sharp red drop; letters R, B, D mark the rally-base-drop) and just below it a second 'Supply' zone around 119.00-119.05 created by another small base (D) before a further decline. Price then fell to about 118.45, rallied steadily through the late morning back up into the lower supply around 119.00 at about 12:30. Arrows labelled 'Novice Buyers' point up into the level and 'Low risk Short Entry' marks the top. Price then sold off hard to below 118.00 by 14:00 (last 118.38 on the axis). An inset commodity statement for 04/07/10 shows gross P/L 2,162.50 and net 2,132.50."
        ]
      }
    ],
    "rules": [
      "A supply level with another supply level just above it is typically stronger than an isolated supply level.",
      "A demand level with another demand level just below it is typically stronger than an isolated demand level.",
      "With stacked levels, either scale in (part at lower level, rest at upper, stop above upper) or enter fully at the upper level.",
      "Never put the full position at the lower level with the stop just beyond it - your stop would sit where the next entry belongs."
    ],
    "mistakes": [
      "Buying after a strong rally straight into stacked supply.",
      "Copying 'buy signals' from the crowd without checking where supply sits.",
      "Placing the protective stop inside the second (stronger) level.",
      "Searching for certainty instead of better odds."
    ],
    "quotes": [
      "Would you rather have your money in a bank vault that had one steel door, or... two steel doors?",
      "We must not search for certainty, but instead search for better odds."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Odds enhancer: a second level stacked just beyond the first makes the area 'thicker'." }
    ],
    "checklist": [
      "Is there a second supply level just above (or demand just below) my level?",
      "Am I scaling in across both levels or entering at the outer level?",
      "Is my stop beyond the OUTER level, not between the two?",
      "Did price arrive after a strong move (novice buyers/sellers on the other side)?"
    ],
    "journalTags": ["levels-on-top-of-levels", "stacked-zones", "scale-in", "odds-enhancer", "spy"],
    "images": [
      {"src": "/lessons/seiden/p322-001.jpg", "caption": "SPY 5-minute, 4/7/10: a rally-base-drop 'Supply' near 119.10-119.20 (R-B-D upper left) with a second 'Supply' just below at ~119.00; the midday rally back up is marked 'Novice Buyers' and the 'Low risk Short Entry' arrow sits at the stacked supply. Price then falls into the close (~118.0). Statement: net +$2,132.50.", "notes": ["Two supply levels stacked on top of each other: the lower one is the entry, the upper one protects the stop.", "The rally into supply is where the 'buy signal' crowd buys - Seiden sells to them.", "The short had room to run: the earlier 10:00 low (~118.40) and then the session low were the downside targets."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Levels on top of levels: two vault doors</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A supply level with another supply level just above it is the stronger setup</text><rect x=\"104\" y=\"114\" width=\"456\" height=\"20\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"176\" y=\"140\" width=\"384\" height=\"13\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"392\" y=\"127\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply 2 (upper level)</text><text x=\"392\" y=\"150\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply 1 (lower level)</text><line x1=\"40\" y1=\"221\" x2=\"40\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"225\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"58\" y1=\"191\" x2=\"58\" y2=\"229\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"53\" y=\"195\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"76\" y1=\"161\" x2=\"76\" y2=\"199\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"71\" y=\"165\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"94\" y1=\"126\" x2=\"94\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"89\" y=\"130\" width=\"10\" height=\"35\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"112\" y1=\"114\" x2=\"112\" y2=\"134\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"107\" y=\"118\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"130\" y1=\"114\" x2=\"130\" y2=\"128\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"125\" y=\"118\" width=\"10\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"148\" y1=\"116\" x2=\"148\" y2=\"128\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"143\" y=\"120\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"166\" y1=\"116\" x2=\"166\" y2=\"152\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"161\" y=\"120\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"184\" y1=\"140\" x2=\"184\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"179\" y=\"144\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"202\" y1=\"140\" x2=\"202\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"197\" y=\"144\" width=\"10\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"220\" y1=\"145\" x2=\"220\" y2=\"188\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"149\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"238\" y1=\"180\" x2=\"238\" y2=\"228\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"184\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"256\" y1=\"220\" x2=\"256\" y2=\"258\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"251\" y=\"224\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"274\" y1=\"230\" x2=\"274\" y2=\"258\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"269\" y=\"234\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"292\" y1=\"205\" x2=\"292\" y2=\"238\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"287\" y=\"209\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"310\" y1=\"177\" x2=\"310\" y2=\"213\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"305\" y=\"181\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"328\" y1=\"152\" x2=\"328\" y2=\"185\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"323\" y=\"156\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"346\" y1=\"152\" x2=\"346\" y2=\"190\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"341\" y=\"156\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"364\" y1=\"182\" x2=\"364\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"359\" y=\"186\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"382\" y1=\"217\" x2=\"382\" y2=\"260\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"377\" y=\"221\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"400\" y1=\"252\" x2=\"400\" y2=\"285\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"256\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"440\" y1=\"153\" x2=\"560\" y2=\"153\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"156\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">entry 1 (part)</text><line x1=\"440\" y1=\"134\" x2=\"560\" y2=\"134\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"137\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">entry 2 (rest)</text><line x1=\"440\" y1=\"106\" x2=\"560\" y2=\"106\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"109\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop above both</text><line x1=\"440\" y1=\"254\" x2=\"560\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"257\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">target (prior low)</text><text x=\"328\" y=\"80\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">Short the return</text><line x1=\"328\" y1=\"86\" x2=\"328\" y2=\"147\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"328,147 324.5,139.8 331.5,139.8\" fill=\"#f59e0b\"/><text x=\"130\" y=\"106\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">R-B-D</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Scale in at each level (or all at the upper one); one stop above the upper level, never between them.</text></svg>", "caption": "Stacked supply: price rallies into Supply 1 with Supply 2 sitting just above. Short part at the lower proximal line and the rest at the upper level, stop above the upper distal line, target the prior low."},
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Where the stop goes with stacked levels</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Your stop must not sit where the next level says to add</text><rect x=\"40\" y=\"112\" width=\"250\" height=\"26\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"40\" y=\"150\" width=\"250\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"246\" x2=\"60\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"55\" y=\"250\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"76\" y1=\"216\" x2=\"76\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"71\" y=\"220\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"92\" y1=\"186\" x2=\"92\" y2=\"224\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"87\" y=\"190\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"108\" y1=\"161\" x2=\"108\" y2=\"194\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"103\" y=\"165\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"124\" y1=\"126\" x2=\"124\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"119\" y=\"130\" width=\"10\" height=\"35\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"140\" y1=\"126\" x2=\"140\" y2=\"174\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"135\" y=\"130\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"156\" y1=\"166\" x2=\"156\" y2=\"214\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"151\" y=\"170\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"172\" y1=\"206\" x2=\"172\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"167\" y=\"210\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"188\" y1=\"246\" x2=\"188\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"183\" y=\"250\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"140\" y1=\"168\" x2=\"290\" y2=\"168\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"290\" y=\"182\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"end\">full entry here</text><line x1=\"140\" y1=\"145\" x2=\"290\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"290\" y=\"106\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"end\">stop between levels</text><text x=\"110\" y=\"96\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">spike hits the stop...</text><text x=\"165\" y=\"310\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">...then price falls without you</text><text x=\"40\" y=\"72\" fill=\"#ef4444\" font-size=\"13\" text-anchor=\"start\" font-weight=\"700\">WRONG</text><rect x=\"350\" y=\"112\" width=\"250\" height=\"26\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"350\" y=\"150\" width=\"250\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><line x1=\"370\" y1=\"246\" x2=\"370\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"250\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"386\" y1=\"216\" x2=\"386\" y2=\"254\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"381\" y=\"220\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"402\" y1=\"186\" x2=\"402\" y2=\"224\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"397\" y=\"190\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"418\" y1=\"161\" x2=\"418\" y2=\"194\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"413\" y=\"165\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"434\" y1=\"126\" x2=\"434\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"429\" y=\"130\" width=\"10\" height=\"35\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"450\" y1=\"126\" x2=\"450\" y2=\"174\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"445\" y=\"130\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"466\" y1=\"166\" x2=\"466\" y2=\"214\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"461\" y=\"170\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"482\" y1=\"206\" x2=\"482\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"477\" y=\"210\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"498\" y1=\"246\" x2=\"498\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"493\" y=\"250\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"450\" y1=\"168\" x2=\"600\" y2=\"168\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"600\" y=\"182\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"end\">entry 1 (part)</text><line x1=\"450\" y1=\"138\" x2=\"600\" y2=\"138\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"600\" y=\"148\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"end\">entry 2 (rest)</text><line x1=\"450\" y1=\"104\" x2=\"600\" y2=\"104\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"600\" y=\"98\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"end\">stop above upper level</text><text x=\"475\" y=\"310\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">the spike fills entry 2, the stop holds</text><text x=\"350\" y=\"72\" fill=\"#22c55e\" font-size=\"13\" text-anchor=\"start\" font-weight=\"700\">RIGHT</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A stop just above Supply 1 sits inside Supply 2 - exactly where you should be selling more.</text></svg>", "caption": "Wrong vs right: a full position at the lower level with a stop between the levels gets stopped by the spike into the upper level; scaling in with one stop above the upper level survives it."}
    ],
    "newVsPdfs": [
      "Kevin's Q&A covers stacked zones; Seiden adds the explicit entry choice: scale in across both levels or enter only at the upper one, with the stop beyond the outer level.",
      "Seiden frames stacking as an odds enhancer (stronger level), not just a zone-drawing question."
    ]
  },
  {
    "n": 324,
    "title": "Where is the Stock Market Going?",
    "kind": "article",
    "summary": "A long-term call: in March 2009 the S&P reached monthly demand (wholesale) with a huge profit margin to the next fresh supply, so XLT bought. Thirteen months later price was approaching large monthly supply, which he zoomed into on the weekly chart to find two stacked supply levels, so he expected the rally to stop and turn lower. Bad news at demand and good news at supply are opportunities against the crowd.",
    "sections": [
      {
        "heading": "Long-term timing with monthly levels",
        "points": [
          "Profit margin is assessed as the distance from the fresh demand level to the fresh supply level; in March 2009 it was huge, giving ideal risk/reward.",
          "XLT members were alerted on March 4th; one member bought a basket of stocks also at larger-timeframe demand and had double-digit gains within two months.",
          "Wall Street says 'you can't time the market' - Seiden disagrees; timing via real supply and demand analysis is the key."
        ]
      },
      {
        "heading": "Zooming into a large monthly level ('x-ray')",
        "points": [
          "A large monthly supply area is investigated on smaller timeframes - like a doctor taking several x-ray pictures of the same elbow from different angles.",
          "Inside the monthly supply, the weekly SPY shows two clear supply levels: a lower (proximal) one not far away and an upper (distal) one just above.",
          "If he is wrong and price rallies through monthly supply, simply buy pullbacks to new demand levels."
        ]
      },
      {
        "heading": "The news",
        "points": [
          "March 2009 news was terrible (worst jobs reports since 1945, record foreclosures, AIG 'collapse') - yet that was the time to buy.",
          "Two facts matter: you profit by buying at wholesale (demand) and selling at retail (supply), and you must quantify supply/demand on a price chart to find turns in advance.",
          "Bad news + price at demand = turn higher; good news + price at supply = turn lower.",
          "Keep analysis 'real' and 'simple'; the price chart contains all needed information."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.325): $INX/SPX monthly, 1997-2010. A yellow-shaded 'Demand - (wholesale)' zone is drawn at the very bottom-left (1990s base around the 700 area) and carried right; the March 2009 low (~670) reaches it. A second yellow box labelled 'Supply - Retail' is drawn around 1,200-1,250 at the base where price broke down in 2008. Price has rallied from the 2009 low to about 1,200, just under that supply.",
          "Figure 2 (p.325): a short email from an XLT member (May 6, 2009) saying most positions were entered the week of 3/9-3/13 in an IRA that was in cash.",
          "Figure 3 (p.325): the member's position list (DRYS, AA, HYG, NUE, DLN, PBT, PBR, TBT, PCU) showing percentage gains roughly 5-59%.",
          "Figure 4 (p.326): SPY weekly ('09-'10). Two yellow supply boxes: upper 'Supply - Retail' around 138-145 (distal) and lower 'Supply - (retail)' around 124-131 (proximal), both origins of the 2008 declines. Price has climbed steadily from the 2009 low near 68 to 121.02, approaching the lower supply."
        ]
      }
    ],
    "rules": [
      "Measure profit margin as the distance between the fresh demand level and the fresh opposing supply level.",
      "Investigate large higher-timeframe levels on smaller timeframes to locate the precise proximal and distal levels inside.",
      "Bad news with price at demand is a buy context; good news with price at supply is a sell context.",
      "If a forecast level fails, switch to buying pullbacks into the newly created levels."
    ],
    "mistakes": [
      "Believing the market cannot be timed.",
      "Letting dramatic news stop you from buying at wholesale prices.",
      "Treating a large monthly zone as one entry price without zooming in.",
      "Complicating analysis instead of keeping it real and simple."
    ],
    "quotes": [
      "Real bad news and price at or near demand (wholesale prices) equates to a turn higher in price.",
      "The trick is to keep your analysis 'real' and 'simple.'"
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Zoom a large monthly supply into weekly to find proximal and distal levels inside it." }
    ],
    "checklist": [
      "Where is the nearest fresh opposing level (profit margin)?",
      "Is the HTF level large? Have I zoomed in to find the inner levels?",
      "Is the news pushing price INTO my level (crowd on the wrong side)?",
      "What will I do if the level fails (buy/sell new pullback levels)?"
    ],
    "journalTags": ["monthly-demand", "market-timing", "profit-margin", "news-at-level", "zoom-in", "spx"],
    "images": [
      {"src": "/lessons/seiden/p325-003.jpg", "caption": "$INX (S&P 500) monthly 1997-2010: 'Demand - (wholesale)' box at the 1990s base (~700) reached by the March 2009 low; 'Supply - Retail' box near 1,250-1,300 at the origin of the 2008 collapse, with price rallying toward it (1,208 on the right).", "notes": ["Monthly demand at the origin of a multi-year rally = wholesale price, bought on the worst news.", "The profit margin from demand to the next fresh supply was enormous.", "The retail supply above is where the rally is expected to stall."]},
      {"src": "/lessons/seiden/p325-004.jpg", "caption": "Email from an XLT member (May 6, 2009): most positions were entered the week of 3/9-3/13, in an IRA that had been all cash.", "notes": ["Buying at monthly demand meant buying when the news was worst - the week of the 2009 low."]},
      {"src": "/lessons/seiden/p325-005.jpg", "caption": "The member's position list (DRYS, AA, HYG, NUE, OLN, PBT, PBR, TBT, PCU) showing gains of roughly 5-59% two months after the March 2009 entries.", "notes": ["Low-risk entries at demand produce large percentage gains without needing to predict the news."]},
      {"src": "/lessons/seiden/p326-006.jpg", "caption": "SPY weekly 2008-2010: two yellow supply boxes - 'Supply - Retail' (~138-145) and 'Supply - (retail)' (~124-131), both origins of 2008 declines; price has rallied from the 2009 low to ~121, just under the lower box.", "notes": ["Zooming from the monthly to the weekly chart reveals levels on top of levels inside the monthly supply.", "Seiden expected the rally to stop at the lower supply and turn lower."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Buy wholesale, sell retail (monthly S&amp;P)</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">March 2009: price fell into the monthly demand that launched the 1990s rally</text><rect x=\"30\" y=\"276\" width=\"530\" height=\"13\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"182\" y=\"106\" width=\"378\" height=\"14\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"36\" y=\"305\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Demand (wholesale): the base that launched the rally</text><text x=\"186\" y=\"100\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply (retail): origin of the collapse</text><line x1=\"40\" y1=\"276\" x2=\"40\" y2=\"289\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"280\" width=\"10\" height=\"5\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"55\" y1=\"276\" x2=\"55\" y2=\"288\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"50\" y=\"280\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"70\" y1=\"276\" x2=\"70\" y2=\"288\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"65\" y=\"280\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"85\" y1=\"251\" x2=\"85\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"80\" y=\"255\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"100\" y1=\"229\" x2=\"100\" y2=\"259\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"95\" y=\"233\" width=\"10\" height=\"22\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"115\" y1=\"201\" x2=\"115\" y2=\"237\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"110\" y=\"205\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"130\" y1=\"181\" x2=\"130\" y2=\"209\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"125\" y=\"185\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"145\" y1=\"156\" x2=\"145\" y2=\"189\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"140\" y=\"160\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"160\" y1=\"131\" x2=\"160\" y2=\"164\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"155\" y=\"135\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"175\" y1=\"106\" x2=\"175\" y2=\"139\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"170\" y=\"110\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"190\" y1=\"106\" x2=\"190\" y2=\"118\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"185\" y=\"110\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"205\" y1=\"107\" x2=\"205\" y2=\"118\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"200\" y=\"111\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"220\" y1=\"107\" x2=\"220\" y2=\"120\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"111\" width=\"10\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"235\" y1=\"112\" x2=\"235\" y2=\"150\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"230\" y=\"116\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"250\" y1=\"142\" x2=\"250\" y2=\"185\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"245\" y=\"146\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"265\" y1=\"177\" x2=\"265\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"260\" y=\"181\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"280\" y1=\"217\" x2=\"280\" y2=\"260\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"221\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"295\" y1=\"252\" x2=\"295\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"290\" y=\"256\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"310\" y1=\"257\" x2=\"310\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"305\" y=\"261\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"325\" y1=\"227\" x2=\"325\" y2=\"265\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"320\" y=\"231\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"340\" y1=\"202\" x2=\"340\" y2=\"235\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"335\" y=\"206\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"355\" y1=\"174\" x2=\"355\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"350\" y=\"178\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"370\" y1=\"146\" x2=\"370\" y2=\"182\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"150\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"385\" y1=\"120\" x2=\"385\" y2=\"154\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"380\" y=\"124\" width=\"10\" height=\"26\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"400\" y1=\"120\" x2=\"400\" y2=\"148\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"124\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"415\" y1=\"140\" x2=\"415\" y2=\"163\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"410\" y=\"144\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"281\" y=\"226\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"end\">bad news: crowd sells</text><line x1=\"275\" y1=\"242\" x2=\"289\" y2=\"272\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"289,272 282.8,266.9 289.1,264\" fill=\"#f59e0b\"/><text x=\"345\" y=\"305\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">XLT buys here</text><line x1=\"500\" y1=\"276\" x2=\"500\" y2=\"120\" stroke=\"#f59e0b\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/><line x1=\"500\" y1=\"200\" x2=\"500\" y2=\"124\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"500,124 503.5,131.2 496.5,131.2\" fill=\"#f59e0b\"/><line x1=\"500\" y1=\"200\" x2=\"500\" y2=\"272\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"500,272 496.5,264.8 503.5,264.8\" fill=\"#f59e0b\"/><text x=\"508\" y=\"204\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">profit margin</text><text x=\"429\" y=\"190\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"start\">then lower?</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Low risk at demand, huge margin to the next fresh supply - then the rally runs into retail supply.</text></svg>", "caption": "S&P monthly logic: buy the return to the wholesale demand base on bad news, target the retail supply at the origin of the collapse; the distance between them is the profit margin."},
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Zoom in: one monthly zone, two weekly levels</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Refining the monthly supply on the weekly chart showed levels on top of levels</text><rect x=\"60\" y=\"90\" width=\"160\" height=\"70\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"140\" y=\"82\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">Monthly supply (big)</text><line x1=\"80\" y1=\"266\" x2=\"80\" y2=\"304\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"75\" y=\"270\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"94\" y1=\"231\" x2=\"94\" y2=\"274\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"89\" y=\"235\" width=\"10\" height=\"35\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"108\" y1=\"201\" x2=\"108\" y2=\"239\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"103\" y=\"205\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"122\" y1=\"171\" x2=\"122\" y2=\"209\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"117\" y=\"175\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"136\" y1=\"136\" x2=\"136\" y2=\"179\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"131\" y=\"140\" width=\"10\" height=\"35\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"150\" y1=\"126\" x2=\"150\" y2=\"144\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"145\" y=\"130\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"140\" y=\"330\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">monthly: price nears a large zone</text><line x1=\"220\" y1=\"90\" x2=\"340\" y2=\"70\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><line x1=\"220\" y1=\"160\" x2=\"340\" y2=\"310\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 3\"/><rect x=\"340\" y=\"70\" width=\"270\" height=\"240\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><text x=\"475\" y=\"64\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">weekly zoom</text><rect x=\"372\" y=\"82\" width=\"228\" height=\"14\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"438\" y=\"160\" width=\"162\" height=\"13\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"596\" y=\"93\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">Supply - retail</text><text x=\"596\" y=\"171\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">Supply - (retail)</text><line x1=\"380\" y1=\"82\" x2=\"380\" y2=\"96\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"376\" y=\"86\" width=\"8\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"393\" y1=\"82\" x2=\"393\" y2=\"94\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"389\" y=\"86\" width=\"8\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"406\" y1=\"86\" x2=\"406\" y2=\"120\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"402\" y=\"90\" width=\"8\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"419\" y1=\"112\" x2=\"419\" y2=\"150\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"415\" y=\"116\" width=\"8\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"432\" y1=\"142\" x2=\"432\" y2=\"172\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"428\" y=\"146\" width=\"8\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"445\" y1=\"160\" x2=\"445\" y2=\"172\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"441\" y=\"164\" width=\"8\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"458\" y1=\"160\" x2=\"458\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"454\" y=\"164\" width=\"8\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"471\" y1=\"165\" x2=\"471\" y2=\"203\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"467\" y=\"169\" width=\"8\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"484\" y1=\"195\" x2=\"484\" y2=\"238\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"480\" y=\"199\" width=\"8\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"497\" y1=\"230\" x2=\"497\" y2=\"258\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"493\" y=\"234\" width=\"8\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"510\" y1=\"238\" x2=\"510\" y2=\"258\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"506\" y=\"242\" width=\"8\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"523\" y1=\"224\" x2=\"523\" y2=\"246\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"519\" y=\"228\" width=\"8\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"536\" y1=\"214\" x2=\"536\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"532\" y=\"218\" width=\"8\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"549\" y1=\"202\" x2=\"549\" y2=\"222\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"545\" y=\"206\" width=\"8\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"562\" y1=\"190\" x2=\"562\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"558\" y=\"194\" width=\"8\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"575\" y1=\"178\" x2=\"575\" y2=\"198\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"571\" y=\"182\" width=\"8\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"588\" y1=\"168\" x2=\"588\" y2=\"186\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"584\" y=\"172\" width=\"8\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"475\" y=\"296\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">the rally reaches the lower of two stacked levels</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Expect the rally to stall at the lower weekly supply, with more supply right above it.</text></svg>", "caption": "Seiden zooms from the monthly supply into the weekly chart and finds two stacked supply levels (both origins of 2008 declines), so he expects the rally to stop and turn lower."}
    ],
    "newVsPdfs": [
      "Kevin's MTF is about refining entry-TF zones inside HTF zones; Seiden uses the same idea for long-term investing calls on monthly/weekly index charts.",
      "Kevin says don't trade the news; Seiden treats extreme news pushing price into a level as part of the opportunity (on HTF swing/position horizons)."
    ]
  },
  {
    "n": 328,
    "title": "The All Star Entry (Lite)",
    "kind": "article",
    "summary": "Introduces the XLT 'All Star' entry: a strong supply/demand level combined with price piercing the outer Bollinger Band and a significant profit margin to the opposing level. Two live trades (RIMM 60-minute, INTC daily) illustrate it. 'Lite' because two further rules are withheld for XLT members.",
    "sections": [
      {
        "heading": "The two tools",
        "points": [
          "1) Supply and demand; 2) Bollinger Bands.",
          "Supply level chosen because price fell from it in strong fashion - a big imbalance.",
          "When price returns to supply AND pierces the upper Bollinger Band, it is both at a level of excess supply and statistically at an extreme likely to revert to the mean - the combination makes it high probability."
        ]
      },
      {
        "heading": "Targets",
        "points": [
          "The profit target (blue line) is placed just ABOVE the demand level below for a short - buy back before demand, not at it.",
          "At demand there is competition to buy, so your cover order is more likely to fill just in front of it."
        ]
      },
      {
        "heading": "INTC example and the news",
        "points": [
          "INTC had a significant supply level (price fell strongly and far from it).",
          "Price rallied back into it on a good earnings announcement while piercing the upper band; mean reversion happened quickly and target one was reached.",
          "However good the news, when price reaches a level where supply exceeds demand, price falls."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.329): RIMM 60-minute with Bollinger Bands (red midline). A yellow 'Supply' box around 73.80-74.20 sits at the 4/15 peak, origin of a strong drop to ~69. Price later spiked back up on 4/27 into supply and above the upper band (circled) - labelled 'XLT Short Entry'. A blue 'Target' line sits around 69.6, just above the lows/demand near 68.9. Price turned down from the entry (last 71.36).",
          "Figure 2 (p.331): INTC daily, roughly two years, with Bollinger Bands. Yellow 'Supply (resistance)' box at the upper-left peak (~24.3), origin of a steep collapse to ~12. Price grinds back up over a year and finally reaches the supply at the far right (circled, 'XLT Short Entry') while poking outside the upper band. Two blue target lines, T1 (~22.9) and T2 (~21.6), are drawn below; price drops to T1 quickly."
        ]
      }
    ],
    "rules": [
      "Buy: price at a strong demand level, piercing the lower Bollinger Band, with a significant profit margin above.",
      "Sell short: price at a strong supply level, piercing the upper Bollinger Band, with a significant profit margin below.",
      "Place profit targets just before the opposing level, not at it."
    ],
    "mistakes": [
      "Buying after a big rally outside the upper band and into supply.",
      "Placing the cover/exit order right at the opposing level where competition is greatest.",
      "Letting great earnings news override a supply level."
    ],
    "quotes": [
      "We want to buy back our profitable shares just before price reaches demand, not at demand.",
      "When price reaches a price level where willing supply exceeds demand, price will fall."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short at supply when price pierces the upper band; target just above the next demand." }
    ],
    "checklist": [
      "Is the level strong (sharp, far move away)?",
      "Is price piercing the outer Bollinger Band on arrival?",
      "Is there a significant profit margin to the opposing level?",
      "Is my target placed just in front of the opposing level?"
    ],
    "journalTags": ["all-star", "bollinger-bands", "mean-reversion", "target-placement", "rimm", "intc"],
    "images": [
      {"src": "/lessons/seiden/p329-008.jpg", "caption": "RIMM 60-minute with Bollinger Bands: yellow 'Supply' ~73.8-74.2 at the 4/15 high; on 4/27 price spikes back up into supply and pierces the upper band (circled 'XLT Short Entry'). A blue 'Target' line sits near 69.6 at the opposing demand; price is already back to ~71.4.", "notes": ["All Star: strong supply + price outside the upper band + big margin to demand.", "Entry at the supply, stop just above it, target the demand that launched the spike."]},
      {"src": "/lessons/seiden/p331-009.jpg", "caption": "INTC daily with Bollinger Bands: 'Supply (resistance)' box at the upper-left peak (~24.3), origin of a collapse to ~12. A year later price grinds back up, pierces the upper band and reaches supply ('XLT Short Entry' circled at ~24); T1 and T2 lines drawn below (~23.3 and ~22.5).", "notes": ["The same All Star logic works on a daily chart: a fresh level from long ago is still fresh.", "Targets step down: first near the midline, then lower."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">The All Star entry (lite)</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Three conditions together: strong level + band pierce + profit margin</text><rect x=\"96\" y=\"94\" width=\"464\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"98\" y=\"88\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">1. Strong supply (origin of a sharp drop)</text><rect x=\"240\" y=\"223\" width=\"320\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><polyline points=\"50,156 68,142.5 86,114.2 104,81.9 122,73.5 140,68.1 158,80.1 176,75.3 194,60.3 212,63.4 230,78 248,120.3 266,162.1 284,195.9 302,208.7 320,210.3 338,210 356,206.3 374,165.9 392,105.7 410,89 428,90.5 446,99.7 464,93.1\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.5\"/><polyline points=\"50,204 68,192.5 86,195.8 104,200.6 122,194.5 140,188.9 158,160.6 176,169 194,206 212,243.3 230,274 248,275.1 266,269.2 284,255.8 302,256.7 320,258.3 338,258 356,254.3 374,269.8 392,291.6 410,276.6 428,257.2 446,237.3 464,251.6\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.5\"/><polyline points=\"50,180 68,167.5 86,155 104,141.2 122,134 140,128.5 158,120.3 176,122.2 194,133.2 212,153.3 230,176 248,197.7 266,215.7 284,225.8 302,232.7 320,234.3 338,234 356,230.3 374,217.8 392,198.7 410,182.8 428,173.8 446,168.5 464,172.3\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/><line x1=\"50\" y1=\"176\" x2=\"50\" y2=\"204\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"45\" y=\"180\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"68\" y1=\"151\" x2=\"68\" y2=\"184\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"63\" y=\"155\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"86\" y1=\"126\" x2=\"86\" y2=\"159\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"81\" y=\"130\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"104\" y1=\"96\" x2=\"104\" y2=\"134\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"99\" y=\"100\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"122\" y1=\"96\" x2=\"122\" y2=\"109\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"117\" y=\"100\" width=\"10\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"140\" y1=\"97\" x2=\"140\" y2=\"109\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"135\" y=\"101\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"158\" y1=\"97\" x2=\"158\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"153\" y=\"101\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"176\" y1=\"127\" x2=\"176\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"171\" y=\"131\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"194\" y1=\"162\" x2=\"194\" y2=\"200\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"189\" y=\"166\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"212\" y1=\"192\" x2=\"212\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"207\" y=\"196\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"230\" y1=\"217\" x2=\"230\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"225\" y=\"221\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"248\" y1=\"227\" x2=\"248\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"243\" y=\"231\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"266\" y1=\"227\" x2=\"266\" y2=\"243\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"261\" y=\"231\" width=\"10\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"284\" y1=\"223\" x2=\"284\" y2=\"243\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"279\" y=\"227\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"302\" y1=\"223\" x2=\"302\" y2=\"241\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"297\" y=\"227\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"320\" y1=\"227\" x2=\"320\" y2=\"241\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"315\" y=\"231\" width=\"10\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"338\" y1=\"227\" x2=\"338\" y2=\"243\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"333\" y=\"231\" width=\"10\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"356\" y1=\"205\" x2=\"356\" y2=\"243\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"351\" y=\"209\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"374\" y1=\"160\" x2=\"374\" y2=\"213\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"369\" y=\"164\" width=\"10\" height=\"45\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"392\" y1=\"108\" x2=\"392\" y2=\"168\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"387\" y=\"112\" width=\"10\" height=\"52\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"410\" y1=\"108\" x2=\"410\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"405\" y=\"112\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"428\" y1=\"138\" x2=\"428\" y2=\"181\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"423\" y=\"142\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"446\" y1=\"173\" x2=\"446\" y2=\"211\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"441\" y=\"177\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"464\" y1=\"203\" x2=\"464\" y2=\"236\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"459\" y=\"207\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"376\" y=\"160\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">2. pierces the</text><text x=\"376\" y=\"173\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">upper band</text><line x1=\"352\" y1=\"150\" x2=\"384\" y2=\"118\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"384,118 381.4,125.6 376.4,120.6\" fill=\"#f59e0b\"/><line x1=\"406\" y1=\"112\" x2=\"560\" y2=\"112\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"115\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short</text><line x1=\"406\" y1=\"86\" x2=\"560\" y2=\"86\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"89\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"406\" y1=\"223\" x2=\"560\" y2=\"223\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"226\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">target: demand</text><line x1=\"586\" y1=\"112\" x2=\"586\" y2=\"223\" stroke=\"#f59e0b\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/><text x=\"580\" y=\"172\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">3. profit margin</text><text x=\"60\" y=\"330\" fill=\"#a78bfa\" font-size=\"9\" text-anchor=\"start\">Bollinger Bands (purple), midline dashed</text></svg>", "caption": "All Star: price spikes back into fresh supply and pierces the upper Bollinger Band while there is a big margin down to demand; short the proximal line, stop above the distal line."}
    ],
    "newVsPdfs": [
      "Kevin trades pure price action with no indicators; the All Star adds Bollinger Bands as a statistical-extreme filter.",
      "Explicit target placement just in front of the opposing zone (to avoid competition) is a Seiden detail."
    ]
  },
  {
    "n": 331,
    "title": "You Have Questions - Sam has Answers!",
    "kind": "article",
    "summary": "Reader Q&A: why time-at-level and distance-before-return matter, how to handle conflicting trends across timeframes, when old supply becomes demand, and how a newbie should start (simulator, QQQQ, small size).",
    "sections": [
      {
        "heading": "The four questions (from his 'Market Traps' talk)",
        "points": [
          "1) How did price leave the level? 2) How much time did price spend at the level? 3) Levels on top of levels? 4) How far did price move before returning to the level?",
          "These questions explain why he takes some levels and ignores others - the ignored ones are not levels at all under these tests."
        ]
      },
      {
        "heading": "Time at the level",
        "points": [
          "Where supply and demand are badly out of balance there will be very few transactions - few candles in the base.",
          "This contradicts books that say the best turns come with heavy/climactic volume: big imbalance means one side is mostly missing, so few trades occur.",
          "Look for levels with fewer candles, not many."
        ]
      },
      {
        "heading": "Distance before return",
        "points": [
          "It quantifies profit margin: a long rally from demand shows the supply in that rally was absorbed, so you know where sellers are and are not.",
          "The farther price moved away before returning, the greater the profit margin."
        ]
      },
      {
        "heading": "Conflicting trends across timeframes (Gloria)",
        "points": [
          "Trends confuse many people; an uptrend on one timeframe is a downtrend on another.",
          "Waiting for a rising moving average means buying after price is already expensive - the opposite of shopping for a sale.",
          "Identify where the trend begins with supply/demand levels; a larger-timeframe MA as a general guide is fine but not as the primary tool."
        ]
      },
      {
        "heading": "Old supply becoming demand (Susan)",
        "points": [
          "When demand absorbs all supply and price breaks through, the old supply becomes demand only if: there is significant profit margin, the breakout was strong, and the level is well placed on the larger-timeframe curve.",
          "Missing any of these makes the new level weak."
        ]
      },
      {
        "heading": "Where a newbie should start (Ray)",
        "points": [
          "Decide your style (day, swing, position) and use a simulator first to: get comfortable with the platform, execute the strategy as planned, and prove the rules are profitable.",
          "Then start with the stock market, e.g. QQQQ (liquid, low price); if you can't profit on QQQQ you won't on individual stocks.",
          "Start small with position size until your data shows you are consistently profitable."
        ]
      }
    ],
    "rules": [
      "Prefer levels with few candles in the base (little time at level).",
      "The farther price travelled before returning, the bigger the profit margin and the better the level.",
      "A broken supply becomes demand only with strong breakout, big profit margin and good HTF location.",
      "Use moving averages at most as a background guide, never the primary trend tool.",
      "Prove platform, execution and profitability on a simulator before real money; start small."
    ],
    "mistakes": [
      "Expecting strong turns at heavy-volume, many-candle areas.",
      "Waiting for a rising MA before buying (buying expensive).",
      "Assuming every broken level flips polarity.",
      "Trading real capital before proving the plan in a simulator; oversizing early."
    ],
    "quotes": [
      "When looking for strong levels of supply or demand, look for levels with fewer candles in them instead of many.",
      "The farther price moves away from our level before returning back to the level, the greater the profit margin."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Odds questions: how price left, time at level, levels on levels, distance before return." },
      { "key": "trend-momentum", "caption": "Define trend by where supply/demand levels start, not by a lagging MA." }
    ],
    "checklist": [
      "How did price leave the level?",
      "How many candles are in the base?",
      "Is there another level stacked on top/below?",
      "How far did price travel before returning?",
      "For a flipped level: strong breakout, big profit margin, good HTF location?"
    ],
    "journalTags": ["odds-enhancers", "time-at-level", "profit-margin", "polarity-flip", "trend-confusion", "simulator"],
    "newVsPdfs": [
      "Kevin limits basing to about six or seven candles; Seiden gives the reason (few transactions = big imbalance) and rejects heavy-volume S/R logic.",
      "Seiden's conditions for a broken supply flipping to demand (strong break, profit margin, HTF placement) are an explicit filter not stated in Kevin's notes."
    ]
  },
  {
    "n": 335,
    "title": "The Check List",
    "kind": "article",
    "summary": "Entry location is the key to everything else (stop, size, target): enter as close to the turn as possible. Seiden lists three checks for a level where price should turn: how price left, how much time it spent there, and how far it moved before returning - each with its logic.",
    "sections": [
      {
        "heading": "Why entry matters most",
        "points": [
          "Entering close to the turn allows the largest position for the least money at risk.",
          "It also puts you farthest from the target, making the reward side as big as possible.",
          "Price turns where supply and demand are most out of balance."
        ]
      },
      {
        "heading": "1) How did price leave the level?",
        "points": [
          "Logic: the stronger the move away, the more out of balance the level.",
          "Three ways to leave: gradual move, strong move with big red/green candles, or a gap - the gap is strongest."
        ]
      },
      {
        "heading": "2) How much time did price spend at the level?",
        "points": [
          "Logic: the less time at the level, the bigger the imbalance.",
          "Contrary to books seeking lots of activity and volume: big imbalance means fewer transactions and lower volume.",
          "'Don't believe everything you read' - the herd once thought the world was flat."
        ]
      },
      {
        "heading": "3) How far did price move before returning?",
        "points": [
          "Logic: the farther the move away before return, the greater the profit margin and probability.",
          "Such a level is far from equilibrium on the supply/demand curve - a stretched rubber band likely to snap back.",
          "On return to a supply level you are selling to someone buying after a very large rally.",
          "Measure from the supply level to the lowest low before the rally back - that distance becomes one of the profit targets."
        ]
      },
      {
        "heading": "Resources he suggests",
        "points": [
          "His Lessons from the Pros and SFO articles, the free recordings, an Economics 101 book, the XLT, and Adam Smith's 'The Wealth of Nations'."
        ]
      }
    ],
    "rules": [
      "Gap away > strong big-candle move away > gradual move away.",
      "Fewer candles at the level = stronger level.",
      "Use the distance from the level to the extreme before return as a profit target.",
      "Enter as close to the turn as possible to maximise size and reward for given risk."
    ],
    "mistakes": [
      "Choosing levels with lots of activity and heavy volume.",
      "Entering far from the turn and shrinking the reward side.",
      "Trading levels that price barely moved away from."
    ],
    "quotes": [
      "The stronger price moves away from a price level, the more out-of-balance supply and demand are at the level.",
      "The less time price spends at a level, the more out-of-balance supply and demand are."
    ],
    "diagrams": [
      { "key": "qualify", "caption": "Grade a zone by its departure, time at level and distance before return." }
    ],
    "checklist": [
      "Did price gap or leave with large candles?",
      "Is the base only a few candles?",
      "Did price travel far before coming back?",
      "Is my target based on the distance to the prior extreme?"
    ],
    "journalTags": ["checklist", "departure-strength", "time-at-level", "distance-before-return", "entry-location"],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">The check list: three questions for every level</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Strong departure, little time, far distance before the return</text><text x=\"110\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">1. How did price leave?</text><text x=\"320\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">2. How long was it there?</text><text x=\"530\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">3. How far before returning?</text><text x=\"8\" y=\"120\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">trade</text><text x=\"8\" y=\"252\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">avoid</text><rect x=\"30\" y=\"148\" width=\"180\" height=\"9\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"38\" y1=\"116\" x2=\"38\" y2=\"134\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"34.5\" y=\"120\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"50\" y1=\"126\" x2=\"50\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"46.5\" y=\"130\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"138\" x2=\"62\" y2=\"158\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"58.5\" y=\"142\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"74\" y1=\"147\" x2=\"74\" y2=\"158\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"70.5\" y=\"151\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"86\" y1=\"147\" x2=\"86\" y2=\"158\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"82.5\" y=\"151\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"98\" y1=\"124\" x2=\"98\" y2=\"148\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"94.5\" y=\"128\" width=\"7\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"110\" y1=\"106\" x2=\"110\" y2=\"132\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"106.5\" y=\"110\" width=\"7\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"122\" y1=\"90\" x2=\"122\" y2=\"114\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"118.5\" y=\"94\" width=\"7\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"134\" y1=\"76\" x2=\"134\" y2=\"98\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"130.5\" y=\"80\" width=\"7\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"120\" y=\"184\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">big candles / a gap</text><rect x=\"240\" y=\"149\" width=\"180\" height=\"8\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"248\" y1=\"112\" x2=\"248\" y2=\"132\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"244.5\" y=\"116\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"124\" x2=\"260\" y2=\"144\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"256.5\" y=\"128\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"272\" y1=\"136\" x2=\"272\" y2=\"158\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"268.5\" y=\"140\" width=\"7\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"284\" y1=\"148\" x2=\"284\" y2=\"158\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"280.5\" y=\"152\" width=\"7\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"296\" y1=\"128\" x2=\"296\" y2=\"156\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"292.5\" y=\"132\" width=\"7\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"308\" y1=\"108\" x2=\"308\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"304.5\" y=\"112\" width=\"7\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"320\" y1=\"90\" x2=\"320\" y2=\"116\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"316.5\" y=\"94\" width=\"7\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"332\" y1=\"74\" x2=\"332\" y2=\"98\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"328.5\" y=\"78\" width=\"7\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"330\" y=\"184\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">1-2 candles at the level</text><rect x=\"450\" y=\"140\" width=\"180\" height=\"9\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"458\" y1=\"120\" x2=\"458\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"454.5\" y=\"124\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"471\" y1=\"130\" x2=\"471\" y2=\"150\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"467.5\" y=\"134\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"484\" y1=\"139\" x2=\"484\" y2=\"150\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"480.5\" y=\"143\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"497\" y1=\"123\" x2=\"497\" y2=\"147\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"493.5\" y=\"127\" width=\"7\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"510\" y1=\"107\" x2=\"510\" y2=\"131\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"506.5\" y=\"111\" width=\"7\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"523\" y1=\"93\" x2=\"523\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"519.5\" y=\"97\" width=\"7\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"536\" y1=\"81\" x2=\"536\" y2=\"101\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"532.5\" y=\"85\" width=\"7\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"549\" y1=\"81\" x2=\"549\" y2=\"97\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"545.5\" y=\"85\" width=\"7\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"562\" y1=\"89\" x2=\"562\" y2=\"107\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"558.5\" y=\"93\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"575\" y1=\"99\" x2=\"575\" y2=\"119\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"571.5\" y=\"103\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"588\" y1=\"111\" x2=\"588\" y2=\"133\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"584.5\" y=\"115\" width=\"7\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"601\" y1=\"125\" x2=\"601\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"597.5\" y=\"129\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"540\" y=\"184\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">far away = big margin</text><rect x=\"30\" y=\"280\" width=\"180\" height=\"9\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"38\" y1=\"248\" x2=\"38\" y2=\"266\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"34.5\" y=\"252\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"50\" y1=\"258\" x2=\"50\" y2=\"278\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"46.5\" y=\"262\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"270\" x2=\"62\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"58.5\" y=\"274\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"74\" y1=\"279\" x2=\"74\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"70.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"86\" y1=\"279\" x2=\"86\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"82.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"98\" y1=\"276\" x2=\"98\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"94.5\" y=\"280\" width=\"7\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"110\" y1=\"276\" x2=\"110\" y2=\"286\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"106.5\" y=\"280\" width=\"7\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"122\" y1=\"271\" x2=\"122\" y2=\"286\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"118.5\" y=\"275\" width=\"7\" height=\"7\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"134\" y1=\"271\" x2=\"134\" y2=\"282\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"130.5\" y=\"275\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"146\" y1=\"268\" x2=\"146\" y2=\"282\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"142.5\" y=\"272\" width=\"7\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"158\" y1=\"263\" x2=\"158\" y2=\"276\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"154.5\" y=\"267\" width=\"7\" height=\"5\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"170\" y1=\"257\" x2=\"170\" y2=\"271\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"166.5\" y=\"261\" width=\"7\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"120\" y=\"320\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">gradual, overlapping</text><rect x=\"240\" y=\"280\" width=\"180\" height=\"10\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"248\" y1=\"248\" x2=\"248\" y2=\"266\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"244.5\" y=\"252\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"258\" y1=\"258\" x2=\"258\" y2=\"278\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"254.5\" y=\"262\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"268\" y1=\"270\" x2=\"268\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"264.5\" y=\"274\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"278\" y1=\"279\" x2=\"278\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"274.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"288\" y1=\"279\" x2=\"288\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"284.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"298\" y1=\"280\" x2=\"298\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"294.5\" y=\"284\" width=\"7\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"308\" y1=\"280\" x2=\"308\" y2=\"291\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"304.5\" y=\"284\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"318\" y1=\"280\" x2=\"318\" y2=\"291\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"314.5\" y=\"284\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"328\" y1=\"280\" x2=\"328\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"324.5\" y=\"284\" width=\"7\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"338\" y1=\"279\" x2=\"338\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"334.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"348\" y1=\"279\" x2=\"348\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"344.5\" y=\"283\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"358\" y1=\"280\" x2=\"358\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"354.5\" y=\"284\" width=\"7\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"368\" y1=\"280\" x2=\"368\" y2=\"291\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"364.5\" y=\"284\" width=\"7\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"378\" y1=\"269\" x2=\"378\" y2=\"291\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"374.5\" y=\"273\" width=\"7\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"388\" y1=\"255\" x2=\"388\" y2=\"277\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"384.5\" y=\"259\" width=\"7\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"330\" y=\"320\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">many candles = balanced</text><rect x=\"450\" y=\"272\" width=\"180\" height=\"9\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"458\" y1=\"252\" x2=\"458\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"454.5\" y=\"256\" width=\"7\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"472\" y1=\"262\" x2=\"472\" y2=\"282\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"468.5\" y=\"266\" width=\"7\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"486\" y1=\"271\" x2=\"486\" y2=\"282\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"482.5\" y=\"275\" width=\"7\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"500\" y1=\"261\" x2=\"500\" y2=\"279\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"496.5\" y=\"265\" width=\"7\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"514\" y1=\"253\" x2=\"514\" y2=\"269\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"510.5\" y=\"257\" width=\"7\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"528\" y1=\"253\" x2=\"528\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"524.5\" y=\"257\" width=\"7\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"542\" y1=\"259\" x2=\"542\" y2=\"274\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"538.5\" y=\"263\" width=\"7\" height=\"7\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"556\" y1=\"266\" x2=\"556\" y2=\"279\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"552.5\" y=\"270\" width=\"7\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"540\" y=\"320\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">returns too soon = small margin</text><line x1=\"14\" y1=\"196\" x2=\"626\" y2=\"196\" stroke=\"#94a3b8\" stroke-width=\"0.6\" stroke-dasharray=\"2 4\"/></svg>", "caption": "Seiden's three checks: price should leave the level strongly (big candles or a gap), spend little time there (few candles), and travel far before it returns (big profit margin). The bottom row shows the weak versions to skip."}
    ],
    "newVsPdfs": [
      "Kevin grades the move away and counts basing candles too; Seiden explicitly ranks a gap as the strongest departure and uses the 'stretched rubber band' curve idea.",
      "Target from the distance between level and the lowest low before return is a Seiden-specific target method."
    ]
  },
  {
    "n": 338,
    "title": "Sam Answers Your Questions",
    "kind": "article",
    "summary": "Q&A: include after-hours levels (especially S&P futures overnight) when trading stocks; supply/demand applies in every market worldwide; and why he says supply/demand instead of support/resistance, plus where to learn the rules.",
    "sections": [
      {
        "heading": "After-hours levels (Joe)",
        "points": [
          "Yes, include after-hours supply/demand levels; most line up with day-session levels anyway.",
          "When trading stocks, check the S&P futures overnight chart: a level that looks good on a small stock chart can be invalid because S&P futures already moved well beyond it overnight.",
          "If the market is open, supply and demand are at work, whatever the time a level forms - but every level must meet minimum standards (see The Check List)."
        ]
      },
      {
        "heading": "Does it work in all markets? (Asian markets)",
        "points": [
          "A solid yes: supply and demand ('motion into mass') is the same underlying equation everywhere.",
          "Behind every market and asset class are people pushing buttons."
        ]
      },
      {
        "heading": "Supply/demand vs support/resistance (John)",
        "points": [
          "He avoids support/resistance because people define them differently (pivots, Fibonacci, Elliott Wave, sloping MAs).",
          "Calling it what it is - demand and supply - avoids reinforcing inaccurate definitions.",
          "Rules can be learned from archived articles, free recordings, or the paid XLT where strategy is executed live 3-4 times a week."
        ]
      }
    ],
    "rules": [
      "Include overnight/after-hours levels in analysis, especially S&P futures when trading stocks.",
      "Discard a stock level if the index futures already traded well beyond the corresponding level overnight.",
      "Only consider levels that meet minimum quality standards."
    ],
    "mistakes": [
      "Ignoring the overnight session and trading 'levels' already invalidated.",
      "Using fuzzy support/resistance definitions (pivots, Fibs, MAs) as if they were supply/demand.",
      "Treating every swing as a level."
    ],
    "quotes": [
      "Behind all these markets around the world and different asset classes are just people pushing the buttons.",
      "Make sure your definition of supply and demand is correct."
    ],
    "diagrams": [],
    "checklist": [
      "Did I check the overnight/after-hours chart for levels and for price already beyond my level?",
      "For a stock trade, where is the S&P futures relative to its levels?",
      "Does the level meet the check-list standards?"
    ],
    "journalTags": ["after-hours", "overnight-levels", "index-context", "definitions", "all-markets"],
    "newVsPdfs": [
      "Checking the S&P futures overnight chart before trading a stock level is a Seiden equity-specific filter; Kevin's course is forex-focused."
    ]
  },
  {
    "n": 340,
    "title": "Government Intervention and Market Price",
    "kind": "article",
    "summary": "From his CME floor days handling Yen order flow, Seiden learned that intervention in free markets never works for long and often produces the opposite move. He treats intervention or bailout news as a cue to look for a supply level to sell, illustrated by a 6/21/10 S&P E-mini short after the Yuan-peg news gap.",
    "sections": [
      {
        "heading": "Floor experience",
        "points": [
          "He facilitated institutional order flow in currencies (Yen, CAD, GBP, DEM, CHF); the Yen was the most volatile due to Bank of Japan activity.",
          "The BOJ would sell hundreds of millions of Yen to weaken it; the Yen fell to their target, then rallied back to pre-intervention levels and much further.",
          "Lesson: intervention in free markets never works for more than a short period; the 'invisible hand' brings price where it should be."
        ]
      },
      {
        "heading": "XLT bailout rule",
        "points": [
          "Before the March 2009 low, every time a bailout was announced students were to find a supply (resistance) level in the S&P and prepare to short.",
          "The market would rally on the news, reach supply and decline."
        ]
      },
      {
        "heading": "The 6/21/10 Yuan example",
        "points": [
          "Headline: US equities rally on Yuan intervention; indices gapped up (S&P +1.5%).",
          "Reasons to short at the small supply level: novice buying on news; price at a level where supply exceeded demand (low risk); the gap below meant a large profit margin because there is no demand inside a gap.",
          "Intervention is a sign something is broken: an initial move one way, the big move the other way."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.343): '6/21/10 Low Risk Gain: $1687.50'. @ES 10-minute chart. After the opening gap (off-chart left, date 6/21 circled on the axis) price based near the high. Two black horizontal lines around 1,127-1,129 mark 'Supply (retail)' at a small base; arrow 'Short Entry' points to the later retest of that level. Price then trends down through the session to a sharp drop at about 1,106.25 near 14:00. Volume bars rise on the sell-off. Below, a fill window lists the ES (and some 6E euro) fills with the net P/L circled."
        ]
      }
    ],
    "rules": [
      "When intervention/bailout news drives a rally, look for a nearby supply level to sell short (and vice versa for declines).",
      "A gap below the entry implies little demand in that space - a large profit margin.",
      "Small supply levels formed after a news gap are valid if the profit margin is large."
    ],
    "mistakes": [
      "Buying a news-driven gap because an authority 'intervened'.",
      "Believing central banks/governments can hold price away from free-market value."
    ],
    "quotes": [
      "Intervention in free markets never works.",
      "All I had to see was the word 'intervention' and that was a sell signal for me."
    ],
    "diagrams": [],
    "checklist": [
      "Is the move news/intervention-driven (novice participation)?",
      "Is price at a fresh supply/demand level?",
      "Is there a gap or empty space giving profit margin toward my target?"
    ],
    "journalTags": ["intervention", "news-fade", "gap", "es", "profit-margin"],
    "images": [
      {"src": "/lessons/seiden/p343-014.jpg", "caption": "'6/21/10 Low Risk Gain: $1687.50': @ES 10-minute. After the Yuan-news gap up, price bases near 1,127-1,129 ('Supply (retail)' lines); 'Short Entry' at the retest; price then trends down to ~1,106 by 14:00 on rising volume. The fill window below shows the ES trades.", "notes": ["Intervention news creates the initial move; the supply it leaves behind gives the low-risk short.", "Enter on the retest of the base, not into the news itself."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Intervention: initial move one way, big move the other</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Fade the news-driven rally at the supply it creates</text><rect x=\"192\" y=\"141\" width=\"368\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"194\" y=\"133\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply (retail): base at the news high</text><line x1=\"40\" y1=\"253\" x2=\"40\" y2=\"264\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"257\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"60\" y1=\"253\" x2=\"60\" y2=\"263\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"55\" y=\"257\" width=\"10\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"80\" y1=\"253\" x2=\"80\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"75\" y=\"257\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"100\" y1=\"253\" x2=\"100\" y2=\"264\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"95\" y=\"257\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"120\" y1=\"254\" x2=\"120\" y2=\"264\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"115\" y=\"258\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"140\" y1=\"166\" x2=\"140\" y2=\"192\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"135\" y=\"170\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"160\" y1=\"151\" x2=\"160\" y2=\"174\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"155\" y=\"155\" width=\"10\" height=\"15\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"180\" y1=\"141\" x2=\"180\" y2=\"159\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"175\" y=\"145\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"200\" y1=\"141\" x2=\"200\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"195\" y=\"145\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"220\" y1=\"142\" x2=\"220\" y2=\"153\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"146\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"240\" y1=\"142\" x2=\"240\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"235\" y=\"146\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"145\" x2=\"260\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"149\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"280\" y1=\"165\" x2=\"280\" y2=\"188\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"169\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"300\" y1=\"168\" x2=\"300\" y2=\"188\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"295\" y=\"172\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"320\" y1=\"153\" x2=\"320\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"315\" y=\"157\" width=\"10\" height=\"15\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"340\" y1=\"153\" x2=\"340\" y2=\"181\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"335\" y=\"157\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"360\" y1=\"173\" x2=\"360\" y2=\"206\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"355\" y=\"177\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"380\" y1=\"198\" x2=\"380\" y2=\"236\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"375\" y=\"202\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"400\" y1=\"228\" x2=\"400\" y2=\"271\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"232\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"420\" y1=\"263\" x2=\"420\" y2=\"301\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"415\" y=\"267\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"80\" y=\"290\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">overnight</text><text x=\"70\" y=\"170\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">Intervention news</text><text x=\"70\" y=\"183\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"middle\">gap up</text><line x1=\"96\" y1=\"190\" x2=\"132\" y2=\"205\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"132,205 124,205.4 126.7,199\" fill=\"#f59e0b\"/><line x1=\"360\" y1=\"153\" x2=\"560\" y2=\"153\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"156\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short at retest</text><line x1=\"360\" y1=\"133\" x2=\"560\" y2=\"133\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"136\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"360\" y1=\"260\" x2=\"560\" y2=\"260\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"263\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">target</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Don't trade into the release; sell the first return to supply after the gap.</text></svg>", "caption": "6/21/10-style fade: intervention news gaps the market up, price bases at the high (retail supply), and the short on the first retest rides the move back down."}
    ],
    "newVsPdfs": [
      "Kevin: don't trade the news. Seiden deliberately fades intervention-driven rallies at supply (after the news, not into the release).",
      "Using a gap as evidence of no opposing demand (profit margin) is a Seiden concept."
    ]
  },
  {
    "n": 345,
    "title": "Motion Into Mass: Your Questions Answered",
    "kind": "article",
    "summary": "Follow-up Q&A on the 6/21/10 E-mini short: why the origin of the earlier gap-up was not a buy (no profit margin because of supply after supply above), why a big candle appears at the end of moves (the bandwagon), and why a weak-departure supply was still tradable (news rally, big profit margin, levels on top of levels).",
    "sections": [
      {
        "heading": "Why not buy the gap-up origin? (JP)",
        "points": [
          "The origin of a strong move up is where demand exceeds supply - the area of interest, not the big green candles themselves.",
          "But when price came back to that origin, there was supply level after supply level above - no upside profit margin - so it was not a buy and price likely keeps falling."
        ]
      },
      {
        "heading": "The big candle at the end of a move (Beth)",
        "points": [
          "It shows the bandwagon: most traders buy aggressively after a rally into supply and sell aggressively after a decline into demand.",
          "People are taught to wait for a strong trend before acting; Seiden's strategy enters well before this crowd, when risk is low."
        ]
      },
      {
        "heading": "Weak departure but still shorted (Philippe)",
        "points": [
          "Ideally the move away from supply is very strong; here it was weak.",
          "Compensating factors: the news-driven rally brought price way up the curve; a big profit margin below; levels on top of levels.",
          "Primarily the big profit margin made up for the weak departure."
        ]
      },
      {
        "heading": "Ask the right questions",
        "points": [
          "He had no mentor; he asked questions like 'where is buying low?' and answered them from the chart (a demand level).",
          "Humans love to complicate and to follow others - both kill accounts."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.346): @ES 15-minute, 6/20-6/21/10. Left side circles mark the overnight gap up from ~1,111 and long green candles (the area JP asked about). Two yellow-shaded 'Supply Levels' near 1,126-1,128: one at the high just after 6/21 open and a second small base slightly lower to the right (levels on top of levels). A grey circle marks the 'Short Entry' at about 1,126 as price retested; price then declined to about 1,110 by 12:00-14:00.",
          "Figure 2 (p.346): the fill window for the trade (ES sells/buys around 1,127.25 and 1,122.25 etc.), net result 1,687.50."
        ]
      }
    ],
    "rules": [
      "Only buy a demand origin if there is upside profit margin (no stacked supply right above).",
      "A big profit margin can compensate for a weaker departure, especially with news-driven extension and stacked levels.",
      "Enter before the bandwagon - big end-of-move candles show where the late crowd acts."
    ],
    "mistakes": [
      "Buying the origin of a gap-up when several supply levels sit overhead.",
      "Buying the big green candle after the move or selling the big red candle after a decline.",
      "Overcomplicating and copying others."
    ],
    "quotes": [
      "You are identifying the 'bandwagon' on a price chart.",
      "Ask the right questions, get the right answers and life is good."
    ],
    "diagrams": [
      { "key": "low-odds", "caption": "Demand origin with stacked supply overhead = no profit margin, skip." }
    ],
    "checklist": [
      "Is there clear space to the next opposing level?",
      "If the departure is weak, do I have compensating odds (profit margin, stacked levels, extended news move)?",
      "Am I entering before or after the bandwagon candle?"
    ],
    "journalTags": ["profit-margin", "bandwagon", "gap-origin", "weak-departure", "es"],
    "images": [
      {"src": "/lessons/seiden/p346-016.jpg", "caption": "@ES 15-minute, 6/20-6/21/10: circles on the left mark the overnight gap up from ~1,111 and its long green candles; two yellow 'Supply Levels' around 1,126-1,128 after the 6/21 open; 'Short Entry' at ~1,126 on the return; price falls to ~1,110.", "notes": ["The gap-up origin was demand, but the return there had supply after supply overhead - no margin for a long.", "Two supply levels side by side compensated for a weak departure.", "Shorting at 1,126 had a big margin down to the gap origin."]},
      {"src": "/lessons/seiden/p346-017.jpg", "caption": "Fill window for the 6/21/10 ES trade: sells near 1,127.25 and buys near 1,122.25 (and lower), P/L 1,687.50.", "notes": ["The execution record of the supply short shown above."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">A demand origin is not enough</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Profit margin decides: is there room before the next supply?</text><rect x=\"30\" y=\"273\" width=\"530\" height=\"11\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"36\" y=\"299\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Demand: origin of the gap up</text><rect x=\"200\" y=\"156\" width=\"360\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"320\" y=\"220\" width=\"240\" height=\"11\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"202\" y=\"150\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply level</text><text x=\"342\" y=\"214\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply level</text><line x1=\"40\" y1=\"273\" x2=\"40\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"277\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"64\" y1=\"273\" x2=\"64\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"59\" y=\"277\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"88\" y1=\"274\" x2=\"88\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"83\" y=\"278\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"112\" y1=\"208\" x2=\"112\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"107\" y=\"212\" width=\"10\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"136\" y1=\"190\" x2=\"136\" y2=\"216\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"131\" y=\"194\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"160\" y1=\"170\" x2=\"160\" y2=\"198\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"155\" y=\"174\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"184\" y1=\"156\" x2=\"184\" y2=\"178\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"179\" y=\"160\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"208\" y1=\"156\" x2=\"208\" y2=\"168\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"203\" y=\"160\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"232\" y1=\"157\" x2=\"232\" y2=\"168\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"227\" y=\"161\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"256\" y1=\"157\" x2=\"256\" y2=\"189\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"251\" y=\"161\" width=\"10\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"280\" y1=\"181\" x2=\"280\" y2=\"211\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"185\" width=\"10\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"304\" y1=\"203\" x2=\"304\" y2=\"231\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"299\" y=\"207\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"328\" y1=\"220\" x2=\"328\" y2=\"231\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"323\" y=\"224\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"352\" y1=\"220\" x2=\"352\" y2=\"231\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"347\" y=\"224\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"376\" y1=\"223\" x2=\"376\" y2=\"256\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"371\" y=\"227\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"400\" y1=\"248\" x2=\"400\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"252\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"520\" y1=\"273\" x2=\"520\" y2=\"231\" stroke=\"#f59e0b\" stroke-width=\"1.3\"/><text x=\"514\" y=\"255\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"end\" font-weight=\"600\">small margin</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Demand with supply stacked right above = little reward for the risk, so it is not a buy.</text></svg>", "caption": "The gap-up origin is real demand, but with supply level after supply level just above it there is little upside profit margin, so the return is not a buy."},
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Motion into mass: the big candle comes last</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">The crowd buys aggressively after a rally, right into supply</text><rect x=\"192\" y=\"126\" width=\"368\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"560\" y=\"120\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">Supply</text><line x1=\"60\" y1=\"276\" x2=\"60\" y2=\"294\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"55\" y=\"280\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"82\" y1=\"264\" x2=\"82\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"77\" y=\"268\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"104\" y1=\"254\" x2=\"104\" y2=\"272\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"99\" y=\"258\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"126\" y1=\"239\" x2=\"126\" y2=\"262\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"121\" y=\"243\" width=\"10\" height=\"15\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"148\" y1=\"225\" x2=\"148\" y2=\"247\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"143\" y=\"229\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"170\" y1=\"207\" x2=\"170\" y2=\"233\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"165\" y=\"211\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"192\" y1=\"185\" x2=\"192\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"187\" y=\"189\" width=\"10\" height=\"22\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"214\" y1=\"145\" x2=\"214\" y2=\"193\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"209\" y=\"149\" width=\"10\" height=\"40\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"236\" y1=\"145\" x2=\"236\" y2=\"159\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"231\" y=\"149\" width=\"10\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"258\" y1=\"151\" x2=\"258\" y2=\"177\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"253\" y=\"155\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"280\" y1=\"169\" x2=\"280\" y2=\"202\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"173\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"302\" y1=\"194\" x2=\"302\" y2=\"232\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"297\" y=\"198\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"324\" y1=\"224\" x2=\"324\" y2=\"258\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"319\" y=\"228\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"40\" y=\"104\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">biggest candle at the end:</text><text x=\"40\" y=\"118\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"start\">the bandwagon buys into supply</text><line x1=\"150\" y1=\"124\" x2=\"207\" y2=\"166\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"207,166 199.1,164.5 203.3,158.9\" fill=\"#f59e0b\"/><text x=\"60\" y=\"322\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\">XLT went long down here, before the crowd</text><text x=\"420\" y=\"260\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">...and sells to them at supply</text></svg>", "caption": "The largest candle usually prints at the end of a move: the bandwagon chases the rally into supply (or the decline into demand), which is where XLT takes the other side."}
    ],
    "newVsPdfs": [
      "Kevin requires a strong move away to qualify a zone; Seiden lets a large profit margin plus stacked levels compensate for a weak departure."
    ]
  },
  {
    "n": 349,
    "title": "News, Price, Supply, and Demand",
    "kind": "article",
    "summary": "We are conditioned to buy cheap everywhere except in stocks, where we wait for good company, strong earnings, uptrend and rising MAs - i.e. high prices. Intel's quadrupled earnings gapped price straight into the origin of a huge prior decline: the right action was to be a seller.",
    "sections": [
      {
        "heading": "The conditioning conflict",
        "points": [
          "With cars and houses we negotiate down and seek wholesale prices.",
          "With stocks we are taught to wait for good company, strong earnings, healthy balance sheet, quality management, uptrend and rising MAs - when all true, price is high.",
          "That is paying $50,000 for a $30,000 car."
        ]
      },
      {
        "heading": "INTC earnings (April 15 Hour With The Pros)",
        "points": [
          "INTC earnings quadrupled to 43 cents vs 38 expected; revenue +44%; price gapped up.",
          "The gap went right into the origin of a huge, strong decline - supply exceeds demand there.",
          "Buyers made two losing mistakes: buying after a rally and buying into supply.",
          "Ask: 'If I buy here, will someone buy it from me higher?'"
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.351): screenshot of the live Hour With The Pros webinar (324 participants). The shared INTC daily chart shows a yellow supply band at the top across the chart, with the earnings gap circled on the right touching it; chat questions ask about shorting.",
          "Figure 2 (p.352): INTC daily (2008-2010). Yellow 'Supply Level' at the upper-left peak (~24.3), origin of a strong fall to ~12. Price recovered and on the far right gapped up on 'Great Earnings' into supply (circled, 'XLT Short Entry'). Blue target lines T1 (~22.8) and T2 (~21.5) below; price then fell to the targets."
        ]
      }
    ],
    "rules": [
      "When all the 'good stock' criteria are true, assume price is likely high - check for supply.",
      "A positive news gap into the origin of a strong prior decline is a sell, not a buy.",
      "Before buying, ask whether someone will buy it from you higher."
    ],
    "mistakes": [
      "Buying because earnings, fundamentals and trend all look good.",
      "Buying after a rally into supply.",
      "Getting lost in pattern recognition instead of simple buy-low/sell-high logic."
    ],
    "quotes": [
      "If I buy the stock here, will someone buy it from me higher?",
      "The only question that matters, however, is this: Should you be the buyer or the seller?"
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Shop for wholesale: good news at supply is a sell." }
    ],
    "checklist": [
      "Is the news pushing price into a fresh supply/demand origin?",
      "Did price rally into supply (or fall into demand) before my entry?",
      "Will someone pay me more from here?"
    ],
    "journalTags": ["news", "earnings-gap", "intc", "wholesale-retail", "conditioning"],
    "images": [
      {"src": "/lessons/seiden/p351-019.jpg", "caption": "Screenshot of the live 'Hour With The Pros' webinar (324 participants): the shared INTC daily chart has a yellow supply band across the top and the earnings gap circled on the right touching it; chat questions ask whether to short at 25.00.", "notes": ["The supply was identified in advance, live, before the earnings gap arrived."]},
      {"src": "/lessons/seiden/p352-020.jpg", "caption": "INTC daily 2008-2010: 'Supply Level' at the upper-left peak (~24.3), origin of a fall to ~12. On the far right price gaps up on 'Great Earnings' into supply ('XLT Short Entry' circled near 24); blue T1 (~22.8) and T2 (~21.0) lines; price drops to ~21.5.", "notes": ["Great news delivered price to retail supply: a sell, not a buy.", "Targets sit at prior swing areas below; the first was hit within days."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Good news, wrong price: INTC earnings gap</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Strong earnings gapped price straight into the origin of a big decline</text><rect x=\"76\" y=\"99\" width=\"504\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"78\" y=\"93\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply: origin of a huge decline</text><line x1=\"40\" y1=\"111\" x2=\"40\" y2=\"134\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"115\" width=\"10\" height=\"15\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"62\" y1=\"99\" x2=\"62\" y2=\"119\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"57\" y=\"103\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"84\" y1=\"99\" x2=\"84\" y2=\"111\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"79\" y=\"103\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"106\" y1=\"100\" x2=\"106\" y2=\"111\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"101\" y=\"104\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"128\" y1=\"100\" x2=\"128\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"123\" y=\"104\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"150\" y1=\"130\" x2=\"150\" y2=\"172\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"145\" y=\"134\" width=\"10\" height=\"34\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"172\" y1=\"164\" x2=\"172\" y2=\"200\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"167\" y=\"168\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"194\" y1=\"192\" x2=\"194\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"189\" y=\"196\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"216\" y1=\"217\" x2=\"216\" y2=\"247\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"211\" y=\"221\" width=\"10\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"238\" y1=\"239\" x2=\"238\" y2=\"257\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"243\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"241\" x2=\"260\" y2=\"257\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"245\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"282\" y1=\"231\" x2=\"282\" y2=\"249\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"277\" y=\"235\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"304\" y1=\"219\" x2=\"304\" y2=\"239\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"299\" y=\"223\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"326\" y1=\"209\" x2=\"326\" y2=\"227\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"321\" y=\"213\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"348\" y1=\"197\" x2=\"348\" y2=\"217\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"343\" y=\"201\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"370\" y1=\"183\" x2=\"370\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"187\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"392\" y1=\"171\" x2=\"392\" y2=\"191\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"387\" y=\"175\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"414\" y1=\"161\" x2=\"414\" y2=\"179\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"409\" y=\"165\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"436\" y1=\"108\" x2=\"436\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"431\" y=\"112\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"458\" y1=\"108\" x2=\"458\" y2=\"131\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"453\" y=\"112\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"480\" y1=\"123\" x2=\"480\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"127\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"502\" y1=\"143\" x2=\"502\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"497\" y=\"147\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"396\" y=\"248\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">great earnings:</text><text x=\"396\" y=\"261\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\">gap up into supply</text><line x1=\"392\" y1=\"236\" x2=\"428\" y2=\"132\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"428,132 428.9,139.9 422.4,137.7\" fill=\"#f59e0b\"/><line x1=\"450\" y1=\"111\" x2=\"580\" y2=\"111\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"452\" y=\"107\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short</text><line x1=\"450\" y1=\"91\" x2=\"580\" y2=\"91\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"452\" y=\"87\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"450\" y1=\"140\" x2=\"580\" y2=\"140\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"586\" y=\"143\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">T1</text><line x1=\"450\" y1=\"165\" x2=\"580\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"586\" y=\"168\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">T2</text><text x=\"300\" y=\"312\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">conditioning says buy good news; the chart says this is a retail price</text></svg>", "caption": "INTC: quadrupled earnings gap price up into the supply where a large decline began; the low-risk action is to sell there with targets below."}
    ],
    "newVsPdfs": [
      "Kevin's lessons treat news as something to avoid trading; Seiden uses earnings gaps into supply as swing short setups."
    ]
  },
  {
    "n": 352,
    "title": "News, Price, Supply and Demand, Part 2",
    "kind": "article",
    "summary": "The lowest-risk buys are far down the supply/demand curve, and price usually gets there on very bad news. BP's oil-spill collapse reached a fresh monthly demand level ($26-28) and XLT bought, deliberately skipping a closer grey area that was not fresh.",
    "sections": [
      {
        "heading": "Buying far down the curve",
        "points": [
          "Prices turn where supply/demand are most out of balance; buying far down the curve gives huge upside margin and low risk.",
          "Price rarely falls to such levels and does not stay there long, because demand greatly exceeds supply.",
          "Stocks usually reach those levels on very bad news - the worse the news, the lower the price."
        ]
      },
      {
        "heading": "BP and the fresh-level rule",
        "points": [
          "XLT identified demand at the $26-$28 range on the monthly chart.",
          "The grey area higher up was skipped because a key rule requires a 'fresh' demand level, which it was not.",
          "The logic is simple; acting is hard because the news is so bad.",
          "An XLT member sold at 38.47 for an $11 per-share gain."
        ]
      },
      {
        "heading": "Market timing",
        "points": [
          "Wall Street says turning points can't be timed; Seiden argues the average person can time them with a high degree of accuracy using rules - not always right, but with high odds."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.354): BP monthly, 1996-2010. Yellow 'Demand Level' box at the bottom-left 1996-97 base (~26-28), origin of a strong multi-year rally, carried right. A grey band labelled 'No Demand' around 33-37 spans 1997-2009 (an area price had traded through repeatedly, not fresh). In 2010 price collapses from ~60 into the yellow demand: circled 'XLT Long entry'; price then bounces to 38.47."
        ]
      }
    ],
    "rules": [
      "Only buy at FRESH demand; skip areas already traded through repeatedly.",
      "Very bad news pushing price far down the curve into fresh demand is a buy context.",
      "Prefer the deeper, fresh level over a closer, used one."
    ],
    "mistakes": [
      "Buying the first visible support that is not fresh.",
      "Selling at wholesale prices because the news is terrible.",
      "Letting emotion about the event decide the trade."
    ],
    "quotes": [
      "The demand level in question must be a 'fresh' demand level.",
      "Price simply dropped down to deep discount, wholesale prices."
    ],
    "diagrams": [
      { "key": "zone-removed", "caption": "A level traded through repeatedly is not fresh - go to the next fresh level." }
    ],
    "checklist": [
      "Is my demand level fresh (not repeatedly revisited)?",
      "Is price far down the curve with large upside margin?",
      "Am I acting despite bad news, based on the level?"
    ],
    "journalTags": ["fresh-level", "bp", "monthly", "bad-news-buy", "curve-location"],
    "images": [
      {"src": "/lessons/seiden/p354-022.jpg", "caption": "BP monthly 1996-2010: yellow 'Demand Level' at the 1996-97 base (~26-28), origin of a multi-year rally; a grey 'No Demand' band ~33-37 that price traded through many times; in 2010 the oil-spill collapse falls through the grey band into demand ('XLT Long entry' circled) and rebounds to ~38.5.", "notes": ["The grey area is not fresh demand - price had already traded there repeatedly.", "Very bad news drove price far down the curve into fresh monthly demand: the lowest-risk buy."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Skip the grey area, buy the fresh level</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Bad news pushes price far down the curve - into fresh demand</text><rect x=\"30\" y=\"281\" width=\"550\" height=\"13\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"36\" y=\"309\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Fresh demand: origin of the rally, never revisited</text><rect x=\"140\" y=\"188\" width=\"440\" height=\"35\" fill=\"#94a3b822\" stroke=\"#94a3b8\" stroke-width=\"1\"/><text x=\"160\" y=\"182\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Grey area: traded through, not fresh</text><line x1=\"40\" y1=\"282\" x2=\"40\" y2=\"294\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"286\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"60\" y1=\"282\" x2=\"60\" y2=\"293\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"55\" y=\"286\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"80\" y1=\"281\" x2=\"80\" y2=\"293\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"75\" y=\"285\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"100\" y1=\"257\" x2=\"100\" y2=\"289\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"95\" y=\"261\" width=\"10\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"120\" y1=\"229\" x2=\"120\" y2=\"265\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"115\" y=\"233\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"140\" y1=\"199\" x2=\"140\" y2=\"237\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"135\" y=\"203\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"160\" y1=\"189\" x2=\"160\" y2=\"207\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"155\" y=\"193\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"180\" y1=\"189\" x2=\"180\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"175\" y=\"193\" width=\"10\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"200\" y1=\"191\" x2=\"200\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"195\" y=\"195\" width=\"10\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"220\" y1=\"191\" x2=\"220\" y2=\"209\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"195\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"240\" y1=\"193\" x2=\"240\" y2=\"209\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"235\" y=\"197\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"260\" y1=\"193\" x2=\"260\" y2=\"213\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"197\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"280\" y1=\"199\" x2=\"280\" y2=\"213\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"203\" width=\"10\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"300\" y1=\"199\" x2=\"300\" y2=\"222\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"295\" y=\"203\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"320\" y1=\"204\" x2=\"320\" y2=\"222\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"315\" y=\"208\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"340\" y1=\"204\" x2=\"340\" y2=\"220\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"335\" y=\"208\" width=\"10\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"360\" y1=\"188\" x2=\"360\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"355\" y=\"192\" width=\"10\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"380\" y1=\"168\" x2=\"380\" y2=\"196\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"375\" y=\"172\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"400\" y1=\"150\" x2=\"400\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"154\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"420\" y1=\"150\" x2=\"420\" y2=\"188\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"415\" y=\"154\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"440\" y1=\"180\" x2=\"440\" y2=\"228\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"435\" y=\"184\" width=\"10\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"460\" y1=\"220\" x2=\"460\" y2=\"273\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"455\" y=\"224\" width=\"10\" height=\"45\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"480\" y1=\"265\" x2=\"480\" y2=\"303\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"269\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"500\" y1=\"265\" x2=\"500\" y2=\"303\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"495\" y=\"269\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"520\" y1=\"245\" x2=\"520\" y2=\"273\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"515\" y=\"249\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"470\" y=\"104\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">oil-spill news</text><line x1=\"470\" y1=\"110\" x2=\"446\" y2=\"160\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"446,160 446,152 452.3,155\" fill=\"#f59e0b\"/><text x=\"580\" y=\"309\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">XLT buys here</text></svg>", "caption": "BP monthly logic: the closer grey area had been traded through repeatedly and was not demand; the fresh base far below was, and that is where the bad-news collapse was bought."}
    ],
    "newVsPdfs": [
      "Matches Kevin's fresh-zone emphasis; Seiden adds the 'No Demand' labelling of a used area and applies it to multi-decade monthly investing."
    ]
  },
  {
    "n": 356,
    "title": "The Psychology of Trading and Investing",
    "kind": "article",
    "summary": "Strategy is a direct function of your belief system. News, earnings, upgrades and indicators are 'invitations' to buy or sell; profitable traders filter them through the objective supply/demand picture. Examples: the 6/21/10 Yuan-news S&P short, the INTC earnings short, and the BP oil-spill buy.",
    "sections": [
      {
        "heading": "Two types of invitations",
        "points": [
          "Market invitations based purely on supply and demand (reality).",
          "Everything else: news, earnings, upgrades/downgrades, tips, indicators (illusion and a trap).",
          "A good earnings report or buy rating does not equal demand; a downgrade may be a low-risk buy."
        ]
      },
      {
        "heading": "The S&P Yuan example",
        "points": [
          "Ask two questions: what does the news suggest I do (buy), and what would a consistently profitable buyer/seller of anything do at this price (do nothing or sell)?",
          "Near the top price based sideways and could not stay - more willing supply than demand.",
          "Buyers at the short were buying after a significant advance and at supply - the two novice mistakes."
        ]
      },
      {
        "heading": "Beliefs and discipline",
        "points": [
          "Your psychological belief system IS your strategy; beware even the slightest illusion.",
          "Failing to follow rules is usually not a lack of discipline but a conflict between rules and beliefs.",
          "All influences on price are reflected in price: news -> thoughts/perceptions -> action (buy or sell). Filter through true supply/demand before forming a perception.",
          "Conventional S/R (clusters of activity) is not necessarily true supply/demand; a unique simple pattern shows peak supply/demand."
        ]
      },
      {
        "heading": "Two rules",
        "points": [
          "Negative news that brings price to fresh demand is typically a buying opportunity.",
          "Positive news that brings price to fresh supply is typically a selling opportunity."
        ]
      },
      {
        "heading": "INTC and BP",
        "points": [
          "INTC: very positive earnings and a strong uptrend, yet the gap reached supply (origin of a strong decline) for the first time - those buyers lost.",
          "BP: bad oil-spill news pushed price to the origin of a strong rally; XLT bought at wholesale.",
          "Price must DECLINE to reach fresh demand; most people only buy after rising prices and good news.",
          "A strategy that works is not market- or time-specific; coupon cutters already have the right belief system."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.358): repeat of the 6/21/10 @ES 10-minute chart ('Low Risk Gain: $1687.50') - 'Supply (retail)' lines around 1,127-1,129, 'Short Entry' arrow at the retest, decline to ~1,106.",
          "Figure 2 (p.360): a flow diagram - inputs (earnings report, news, income statement, balance sheet, Fed announcement, economic report, terrorist alert, trading tip, broker upgrade/downgrade, analyst opinion, technical indicators) feed 'Thoughts and Perceptions' which feed 'ACTION: Buy or Sell'.",
          "Figure 3 (p.361): repeat of the Hour With The Pros screenshot of INTC daily with the yellow supply band and the earnings gap circled.",
          "Figure 4 (p.362): INTC daily - supply at the upper-left peak (~24.3); price returns at the far right and drops; three blue targets T1 (~23.0), T2 (~22.3) and T3 (~21.0) are drawn below.",
          "Figure 5 (p.363): BP monthly - 'XLT Demand' at the circled 1996-97 base, line carried to 2010 where 'XLT Buys' marks the touch at about $27-28 after the spill collapse."
        ]
      }
    ],
    "rules": [
      "Filter every news item or indicator through the objective supply/demand picture before acting.",
      "Negative news into fresh demand = look to buy; positive news into fresh supply = look to sell.",
      "Avoid the two novice mistakes: buying after a rally and buying at supply (mirror for selling)."
    ],
    "mistakes": [
      "Treating news, upgrades or earnings as buy/sell signals.",
      "Blaming lack of discipline when the real problem is conflicting beliefs.",
      "Equating clusters of trading activity with true supply/demand."
    ],
    "quotes": [
      "Your psychological belief system IS your trading and/or investing strategy.",
      "The objective supply and demand relationship in markets is revealed most clearly in price and price alone."
    ],
    "diagrams": [
      { "key": "mindset", "caption": "News -> perception -> action; filter through supply/demand first." }
    ],
    "checklist": [
      "What is the news inviting me to do, and what does the level say?",
      "Is price at FRESH supply/demand?",
      "Am I buying after a rally or selling after a decline?",
      "Do my beliefs agree with my rules for this trade?"
    ],
    "journalTags": ["psychology", "belief-system", "news-filter", "invitations", "intc", "bp", "es"],
    "images": [
      {"src": "/lessons/seiden/p358-024.jpg", "caption": "Repeat of the 6/21/10 @ES 10-minute chart ('Low Risk Gain: $1687.50'): 'Supply (retail)' lines ~1,127-1,129, 'Short Entry' at the retest, decline to ~1,106, with the fill window.", "notes": ["Example 1 of filtering news: the Yuan-peg rally was sold at supply."]},
      {"src": "/lessons/seiden/p360-025.jpg", "caption": "Flow diagram: inputs (earnings, news, income statement, balance sheet, Fed, economic report, terrorist alert, trading tip, broker upgrade/downgrade, analyst opinion, technical indicators) feed 'Thoughts and Perceptions', which lead to ACTION: buy or sell.", "notes": ["Every input passes through your beliefs before it becomes an action.", "The profitable trader adds an objective filter: where is price relative to supply and demand?"]},
      {"src": "/lessons/seiden/p361-026.jpg", "caption": "Repeat of the Hour With The Pros webinar screenshot: INTC daily with the yellow supply band and the earnings gap circled at it.", "notes": ["Example 2: good earnings news at supply was an invitation to sell."]},
      {"src": "/lessons/seiden/p362-027.jpg", "caption": "INTC daily: supply at the upper-left peak (~24.3); the earnings gap returns price to it on the far right and it drops; three blue targets T1 (~23.0), T2 (~22.3) and T3 (~21.0), with price reaching below T2.", "notes": ["Scaling out at successive targets below the supply short."]},
      {"src": "/lessons/seiden/p363-028.jpg", "caption": "BP monthly: 'XLT Demand' at the circled 1996-97 base, line carried to 2010 where 'XLT Buys' marks the touch at ~$27-28 after the oil-spill collapse.", "notes": ["Example 3: catastrophic news at fresh monthly demand was an invitation to buy."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">From news to action: add the objective filter</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Strategy is a direct function of your belief system</text><rect x=\"20\" y=\"70\" width=\"150\" height=\"230\" fill=\"#94a3b822\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><text x=\"95\" y=\"90\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Invitations</text><text x=\"95\" y=\"105\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">earnings report</text><text x=\"95\" y=\"120\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">news / Fed</text><text x=\"95\" y=\"135\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">economic report</text><text x=\"95\" y=\"150\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">trading tip</text><text x=\"95\" y=\"165\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">upgrade / downgrade</text><text x=\"95\" y=\"180\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">analyst opinion</text><text x=\"95\" y=\"195\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">technical indicators</text><text x=\"95\" y=\"210\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\"></text><text x=\"95\" y=\"225\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">(all just inputs)</text><line x1=\"172\" y1=\"185\" x2=\"212\" y2=\"185\" stroke=\"#94a3b8\" stroke-width=\"1.6\"/><polygon points=\"212,185 204.8,188.5 204.8,181.5\" fill=\"#94a3b8\"/><rect x=\"214\" y=\"140\" width=\"122\" height=\"90\" fill=\"#a78bfa22\" stroke=\"#a78bfa\" stroke-width=\"1.2\"/><text x=\"275\" y=\"160\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Thoughts and</text><text x=\"275\" y=\"175\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">perceptions</text><text x=\"275\" y=\"190\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">(belief system)</text><line x1=\"338\" y1=\"185\" x2=\"378\" y2=\"185\" stroke=\"#94a3b8\" stroke-width=\"1.6\"/><polygon points=\"378,185 370.8,188.5 370.8,181.5\" fill=\"#94a3b8\"/><rect x=\"380\" y=\"115\" width=\"126\" height=\"140\" fill=\"#f59e0b22\" stroke=\"#f59e0b\" stroke-width=\"1.2\"/><text x=\"443\" y=\"135\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Filter</text><text x=\"443\" y=\"150\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Where is price on</text><text x=\"443\" y=\"165\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">the supply/demand</text><text x=\"443\" y=\"180\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">curve? Fresh level?</text><text x=\"443\" y=\"195\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Profit margin?</text><line x1=\"508\" y1=\"165\" x2=\"538\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.6\"/><polygon points=\"538,125 536.5,132.9 530.9,128.7\" fill=\"#22c55e\"/><line x1=\"508\" y1=\"205\" x2=\"538\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.6\"/><polygon points=\"538,245 530.9,241.3 536.5,237.1\" fill=\"#ef4444\"/><rect x=\"540\" y=\"86\" width=\"84\" height=\"56\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"582\" y=\"106\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">BUY</text><text x=\"582\" y=\"121\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">at demand</text><rect x=\"540\" y=\"226\" width=\"84\" height=\"56\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"582\" y=\"246\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">SELL</text><text x=\"582\" y=\"261\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">at supply</text><text x=\"443\" y=\"276\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">otherwise: no action</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Good news at supply is a sell invitation; bad news at demand is a buy invitation.</text></svg>", "caption": "Seiden's flow: every input is only an invitation that passes through your beliefs; the profitable trader filters it through the objective supply/demand picture before acting."}
    ],
    "newVsPdfs": [
      "Seiden's belief-system/invitation framework is broader psychology than Kevin's mindset notes; it explicitly classifies news and indicators as illusion inputs."
    ]
  },
  {
    "n": 366,
    "title": "Key Trading Nuggets Q&A",
    "kind": "article",
    "summary": "Q&A: why ES 1083-1085 was a weak demand level versus 1073-1075, another odds enhancer (levels on top of levels), why little time at a level means strength, and what a 'fresh' level is (first or second return only).",
    "sections": [
      {
        "heading": "Weak vs better demand (Mat)",
        "points": [
          "1083-1085 had plenty of recent price action to its left - likely not fresh.",
          "1073-1075 was lower on the curve (higher probability and bigger margin) and its initial rally was stronger; it produced a 13-point rally.",
          "Not perfect either - trading seeks better odds and large margins, not perfection; trading both robotically with stops/targets still nets a profit."
        ]
      },
      {
        "heading": "Odds enhancers (Jakob)",
        "points": [
          "Levels on top of levels: like a sell stack at 1070 with an even larger stack at 1071 - more comfortable shorting.",
          "Time at level: books say more activity = stronger; Seiden says the opposite - big imbalance means few transactions, few candles and low volume.",
          "'Motion into mass' confusion is resolved: strong levels are where little trading happened."
        ]
      },
      {
        "heading": "Fresh level (Olga)",
        "points": [
          "Demand is a stack of buy orders; each return fills some of them, so willing buyers decrease with each visit.",
          "Buy when demand is strongest: the first, or sometimes second, return. After that the level is not fresh and odds fall rapidly.",
          "Best: enter the first time price revisits a level that has significant profit margin."
        ]
      }
    ],
    "rules": [
      "Prefer levels with no recent price action to their left (fresh).",
      "Prefer levels lower on the curve with stronger initial departure.",
      "Trade the first (at most second) return to a level.",
      "Two stacked levels with a big profit margin beat a single level."
    ],
    "mistakes": [
      "Buying a demand level with a lot of recent trading around it.",
      "Trading a level on its third+ visit.",
      "Seeking perfect levels instead of better odds."
    ],
    "quotes": [
      "We are not looking for perfection, we are looking for better odds and large profit margins.",
      "Focus on entering a position at a supply or demand level the first time price revisits that level."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Fresh, low on the curve, strong departure, few candles, stacked levels." }
    ],
    "checklist": [
      "Is this the first (or second) return?",
      "Is there recent price action to the left of the level?",
      "Is the level low on the curve with a strong departure?",
      "Are there stacked levels and a large profit margin?"
    ],
    "journalTags": ["fresh-level", "first-touch", "odds-enhancers", "time-at-level", "es"],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Fresh means first (or second) return</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Each visit fills part of the buy orders resting at the level</text><rect x=\"92\" y=\"154\" width=\"428\" height=\"11\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"94\" y=\"197\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Demand = a stack of buy orders</text><line x1=\"40\" y1=\"116\" x2=\"40\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"120\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"60\" y1=\"128\" x2=\"60\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"55\" y=\"132\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"80\" y1=\"143\" x2=\"80\" y2=\"165\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"75\" y=\"147\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"100\" y1=\"154\" x2=\"100\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"95\" y=\"158\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"120\" y1=\"128\" x2=\"120\" y2=\"162\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"115\" y=\"132\" width=\"10\" height=\"26\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"140\" y1=\"104\" x2=\"140\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"135\" y=\"108\" width=\"10\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"160\" y1=\"84\" x2=\"160\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"155\" y=\"88\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"180\" y1=\"84\" x2=\"180\" y2=\"106\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"175\" y=\"88\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"200\" y1=\"98\" x2=\"200\" y2=\"122\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"195\" y=\"102\" width=\"10\" height=\"16\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"220\" y1=\"114\" x2=\"220\" y2=\"140\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"118\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"240\" y1=\"132\" x2=\"240\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"235\" y=\"136\" width=\"10\" height=\"15\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"127\" x2=\"260\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"131\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"280\" y1=\"109\" x2=\"280\" y2=\"135\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"275\" y=\"113\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"300\" y1=\"95\" x2=\"300\" y2=\"117\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"295\" y=\"99\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"320\" y1=\"95\" x2=\"320\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"315\" y=\"99\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"340\" y1=\"107\" x2=\"340\" y2=\"129\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"335\" y=\"111\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"360\" y1=\"121\" x2=\"360\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"355\" y=\"125\" width=\"10\" height=\"16\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"380\" y1=\"137\" x2=\"380\" y2=\"163\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"375\" y=\"141\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"400\" y1=\"145\" x2=\"400\" y2=\"163\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"149\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"420\" y1=\"133\" x2=\"420\" y2=\"153\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"415\" y=\"137\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"440\" y1=\"133\" x2=\"440\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"435\" y=\"137\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"460\" y1=\"143\" x2=\"460\" y2=\"165\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"455\" y=\"147\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"480\" y1=\"157\" x2=\"480\" y2=\"183\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"161\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"500\" y1=\"175\" x2=\"500\" y2=\"203\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"495\" y=\"179\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"240\" y=\"180\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">1st return: best</text><text x=\"380\" y=\"180\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">2nd: still OK</text><text x=\"500\" y=\"236\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"middle\" font-weight=\"600\">3rd: orders used up</text><rect x=\"560\" y=\"230\" width=\"16\" height=\"70\" fill=\"#22c55e44\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"582\" y=\"258\" width=\"16\" height=\"42\" fill=\"#f59e0b44\" stroke=\"#f59e0b\" stroke-width=\"1.2\"/><rect x=\"604\" y=\"284\" width=\"16\" height=\"16\" fill=\"#ef444444\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"593\" y=\"316\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">orders left</text></svg>", "caption": "A demand level is a pile of buy orders: the first return meets the most of them, the second fewer, and after that the level is no longer fresh and tends to break."}
    ],
    "newVsPdfs": [
      "Kevin also weighs how many times a zone was tested; Seiden's order-stack explanation (orders get filled each visit) gives the mechanism and allows a second touch at most."
    ]
  },
  {
    "n": 369,
    "title": "Who Can You Trust?",
    "kind": "article",
    "summary": "Level II, Total View and the Matrix bid/offer ladders do not show the real willing buyers and sellers; they can be bluffs. A live AAPL example showed 1600 bid vs 200 offer right at supply, and price collapsed seconds later. Trust price. The article ends with an educational short idea in XLNX at daily supply aligned with QQQQ weekly supply.",
    "sections": [
      {
        "heading": "Real orders vs screens",
        "points": [
          "On the CME floor he held real institutional orders, stacked by price; the largest buy stack below price was where it would turn higher.",
          "Level II-type tools claim to show this, but market makers can post and pull bids and offers freely.",
          "S&P E-mini shows hundreds-thousands on bid/offer but only 1-2 contracts trade at a time - not real.",
          "If you truly saw real orders you would not be allowed to trade - he was monitored by cameras and recorded lines on the desk."
        ]
      },
      {
        "heading": "AAPL example",
        "points": [
          "A 2-minute supply level formed where price could not stay; on the rally back it was the place to short.",
          "At that moment the Matrix showed 1600 bid vs 200 offer - books say buy. Seconds later price collapsed.",
          "Institutions with too much to sell need novice buyers; a big displayed bid invites them."
        ]
      },
      {
        "heading": "Educational idea: XLNX",
        "points": [
          "XLNX rallied with the NASDAQ toward daily supply: entry $27.75, stop about $28.50, target around $25.50 unless new levels form.",
          "The NASDAQ (QQQQ) also approaching weekly supply raised the odds.",
          "Alternatives: short stock, buy puts, or a credit spread."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.371): 'Charts Can't Lie' - left: AAPL Matrix ladder with 'Bid Size: 1600' and 'Offer Size: 200' arrowed; middle: AAPL 2-minute chart with the 'Supply' level circled at the high (~191.5) and a second circle where price returns; right: zoomed chart with a horizontal line at supply, 'Bid is MUCH greater than offer' at the top, then a boxed area labelled 'Price falls rapidly' as price drops about a dollar.",
          "Figure 2 (p.373): left QQQQ weekly ('08-'10): yellow 'Supply (retail prices)' box near 49-51 at the 2008 high, price rallying back to 49.24. Right XLNX daily: yellow 'Supply (retail prices)' box at ~27.70-28.10 at the upper-left high, origin of a sharp drop to ~24.5; price has rallied back to 26.73 just below."
        ]
      }
    ],
    "rules": [
      "Base decisions on price-defined supply/demand, not displayed bid/offer size.",
      "A big bid into fresh supply can be a lure for novice buyers - stick to the short.",
      "Check the index/sector for aligned supply/demand to raise odds on a single-stock trade."
    ],
    "mistakes": [
      "Buying because the bid is much bigger than the offer.",
      "Believing Level II/Matrix shows institutional intentions.",
      "Trading a stock level without checking the index level."
    ],
    "quotes": [
      "To answer the question, 'Who can you trust?' The answer is simple. Trust price.",
      "These bids and offers are not exactly real!"
    ],
    "diagrams": [],
    "checklist": [
      "Is my decision based on price levels only?",
      "Is the related index also at an aligned level?",
      "Are entry, stop and target defined before the touch?"
    ],
    "journalTags": ["level-2", "order-book", "trust-price", "aapl", "xlnx", "index-alignment"],
    "images": [
      {"src": "/lessons/seiden/p371-031.jpg", "caption": "'Charts Can't Lie': AAPL Matrix ladder showing 'Bid Size: 1600' vs 'Offer Size: 200'; AAPL 2-minute chart with 'Supply' circled at the high (~191.5) and price returning to it ('Bid is MUCH greater than offer'); right panel: 'Price falls rapidly' from the supply.", "notes": ["The visible order book said buyers dominated; price at supply said otherwise - and price won.", "Level II sizes can be bluffs; trust the chart."]},
      {"src": "/lessons/seiden/p373-032.jpg", "caption": "Left: QQQQ weekly '08-'10 with 'Supply (retail prices)' near 49-51 at the 2008 high and price rallying back to 49.24. Right: XLNX daily with 'Supply (retail prices)' ~27.70-28.10 at the upper-left high and price rallying to 26.73 toward it.", "notes": ["A stock short idea is stronger when its index is also arriving at higher-timeframe supply.", "Both charts: the rally is into retail prices, so the low-risk side is short."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Who can you trust? Price, not the ladder</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">A huge bid under supply was a bluff - price collapsed seconds later</text><rect x=\"30\" y=\"70\" width=\"200\" height=\"230\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><text x=\"130\" y=\"64\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">Order book at the level</text><text x=\"80\" y=\"92\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Bid size</text><text x=\"180\" y=\"92\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Offer size</text><rect x=\"50\" y=\"104\" width=\"60\" height=\"26\" fill=\"#22c55e33\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"80\" y=\"122\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">1600</text><rect x=\"150\" y=\"104\" width=\"60\" height=\"26\" fill=\"#ef444433\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"180\" y=\"122\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"700\">200</text><text x=\"130\" y=\"166\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Looks bullish:</text><text x=\"130\" y=\"180\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">8x more buyers shown</text><text x=\"130\" y=\"220\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">But resting orders can be</text><text x=\"130\" y=\"234\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">pulled in a millisecond -</text><text x=\"130\" y=\"248\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">real sellers do not show</text><text x=\"130\" y=\"262\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">their size.</text><rect x=\"366\" y=\"170\" width=\"234\" height=\"11\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"600\" y=\"164\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">Supply</text><line x1=\"300\" y1=\"222\" x2=\"300\" y2=\"244\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"295\" y=\"226\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"322\" y1=\"210\" x2=\"322\" y2=\"230\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"317\" y=\"214\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"344\" y1=\"194\" x2=\"344\" y2=\"218\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"339\" y=\"198\" width=\"10\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"366\" y1=\"184\" x2=\"366\" y2=\"202\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"361\" y=\"188\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"388\" y1=\"170\" x2=\"388\" y2=\"192\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"383\" y=\"174\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"410\" y1=\"170\" x2=\"410\" y2=\"181\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"405\" y=\"174\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"432\" y1=\"171\" x2=\"432\" y2=\"181\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"427\" y=\"175\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"454\" y1=\"171\" x2=\"454\" y2=\"197\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"449\" y=\"175\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"476\" y1=\"189\" x2=\"476\" y2=\"227\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"471\" y=\"193\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"498\" y1=\"219\" x2=\"498\" y2=\"261\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"493\" y=\"223\" width=\"10\" height=\"34\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"520\" y1=\"253\" x2=\"520\" y2=\"289\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"515\" y=\"257\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"542\" y1=\"281\" x2=\"542\" y2=\"315\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"537\" y=\"285\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"232\" y1=\"117\" x2=\"400\" y2=\"176\" stroke=\"#94a3b8\" stroke-width=\"1.6\"/><polygon points=\"400,176 392.1,176.9 394.4,170.3\" fill=\"#94a3b8\"/><text x=\"600\" y=\"330\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">price falls rapidly: trust price</text></svg>", "caption": "AAPL example: the Matrix showed 1600 bid vs 200 offered right at supply; the visible orders were not the real sellers and price dropped hard. The chart is what you trust."}
    ],
    "newVsPdfs": [
      "Kevin does not cover Level II or order-book data; Seiden explicitly rejects it as unreliable.",
      "Index alignment (QQQQ weekly supply supporting an XLNX short) is a stock-specific MTF/correlation filter."
    ]
  },
  {
    "n": 373,
    "title": "Price and Time",
    "kind": "article",
    "summary": "Conventional TA says strong support/resistance has many candles and heavy volume; Seiden argues the opposite - the most out-of-balance levels have very few candles and low volume. An ES 15-minute short at a four-candle supply level illustrates it, followed by a SPY 240-minute idea at supply with no demand below.",
    "sections": [
      {
        "heading": "Questioning conventional wisdom",
        "points": [
          "Markets turn where supply and demand are 'most' out of balance; the more imbalance, the stronger the turn.",
          "At a big imbalance all the potential is on one side, so actual trading activity is small: few candles, low volume."
        ]
      },
      {
        "heading": "The ES trade",
        "points": [
          "Supply level of only four little candles before price dropped - price could not stay there.",
          "He shorted the retrace into it, selling to a buyer who probably ignored the level because it had so little activity.",
          "That lack of activity is what makes it strong."
        ]
      },
      {
        "heading": "Educational idea: SPY",
        "points": [
          "Price has rallied far and is near supply (yellow), whose initial decline was strong and had little time spent at it.",
          "A circled area below with hardly any trading = no demand, so price can fall into it easily.",
          "Overhead supply plus no solid demand below suggests a pause or reversal."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.376): @ES.D 15-minute, 4/27/10. After a flat morning around 1,212, a small four-candle base (circled) between ~1,207.5 and ~1,210 forms just before a drop; labelled 'Supply (Retail)'. Price falls, then rallies back to just under the level - arrow 'Amateur buying (my short entry)' - and collapses to ~1,187 by noon (last 1,185.75). Statement inset 04/27/10: gross 2,500.00, net 2,313.20.",
          "Figure 2 (p.377): SPY 240-minute, May-Oct 2010. Yellow supply box at the May high (~117-118) carried across; price has climbed from ~102 (July) to ~116 by 10/6, just under supply. A circled area of sparse trading around 114-115 on the right marks thin/no demand below."
        ]
      }
    ],
    "rules": [
      "Prefer levels with very few candles and low volume at the base.",
      "Short the first retrace into a small-base supply after a sharp drop.",
      "Thin, little-traded areas below supply mean little demand - easy downside path (and vice versa)."
    ],
    "mistakes": [
      "Looking for many candles and heavy volume to find strong levels.",
      "Ignoring small levels because they are 'hardly noticeable'."
    ],
    "quotes": [
      "Lack of activity is what makes it such a strong supply level.",
      "Don't be afraid to question something everyone believes to be true."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Time odds enhancer: a 4-candle base beats a long sideways cluster." }
    ],
    "checklist": [
      "How many candles are in the base?",
      "Was the departure strong?",
      "Is the path to my target thinly traded (little opposing interest)?"
    ],
    "journalTags": ["time-at-level", "few-candles", "low-volume", "es", "spy", "thin-area"],
    "images": [
      {"src": "/lessons/seiden/p376-034.jpg", "caption": "@ES 15-minute, 4/27/10: a small four-candle base (circled, ~1,207.5-1,210) right before a drop is labelled 'Supply (Retail)'; price gaps lower, rallies back just under it ('Amateur buying (my short entry)'), then collapses to ~1,186. Statement: net +$2,313.20.", "notes": ["Few candles at the level = big imbalance = strong supply.", "The amateur buys the rally; the professional sells it at the supply."]},
      {"src": "/lessons/seiden/p377-035.jpg", "caption": "SPY 240-minute May-Oct 2010: yellow supply box at the May high (~117-118) carried across; price has climbed from ~102 (July) to ~116 by 10/6, just under supply; a circled area of sparse trading on the right (~114-115) shows no demand below.", "notes": ["Approaching supply with no demand below: the short side has room.", "Thin price action means little time spent there, so no strong demand to stop a decline."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Price and time: less activity = stronger level</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Big imbalance means few transactions, few candles and low volume</text><rect x=\"116\" y=\"117\" width=\"189\" height=\"27\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><line x1=\"32\" y1=\"113\" x2=\"32\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"28\" y=\"117\" width=\"8\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"47\" y1=\"113\" x2=\"47\" y2=\"123\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"43\" y=\"117\" width=\"8\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"113\" x2=\"62\" y2=\"123\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"58\" y=\"117\" width=\"8\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"77\" y1=\"113\" x2=\"77\" y2=\"124\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"73\" y=\"117\" width=\"8\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"92\" y1=\"114\" x2=\"92\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"88\" y=\"118\" width=\"8\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"107\" y1=\"114\" x2=\"107\" y2=\"125\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"103\" y=\"118\" width=\"8\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"122\" y1=\"117\" x2=\"122\" y2=\"139\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"118\" y=\"121\" width=\"8\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"137\" y1=\"131\" x2=\"137\" y2=\"143\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"133\" y=\"135\" width=\"8\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"152\" y1=\"132\" x2=\"152\" y2=\"143\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"148\" y=\"136\" width=\"8\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"167\" y1=\"132\" x2=\"167\" y2=\"144\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"163\" y=\"136\" width=\"8\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"182\" y1=\"136\" x2=\"182\" y2=\"174\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"178\" y=\"140\" width=\"8\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"197\" y1=\"166\" x2=\"197\" y2=\"208\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"193\" y=\"170\" width=\"8\" height=\"34\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"212\" y1=\"200\" x2=\"212\" y2=\"238\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"208\" y=\"204\" width=\"8\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"227\" y1=\"202\" x2=\"227\" y2=\"238\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"223\" y=\"206\" width=\"8\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"242\" y1=\"172\" x2=\"242\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"238\" y=\"176\" width=\"8\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"257\" y1=\"140\" x2=\"257\" y2=\"180\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"253\" y=\"144\" width=\"8\" height=\"32\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"272\" y1=\"140\" x2=\"272\" y2=\"178\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"268\" y=\"144\" width=\"8\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"287\" y1=\"170\" x2=\"287\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"283\" y=\"174\" width=\"8\" height=\"34\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><rect x=\"28\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"43\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"58\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"73\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"88\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"103\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"118\" y=\"310\" width=\"8\" height=\"10\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"133\" y=\"310\" width=\"8\" height=\"10\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"148\" y=\"310\" width=\"8\" height=\"10\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"163\" y=\"310\" width=\"8\" height=\"10\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"178\" y=\"286\" width=\"8\" height=\"34\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"193\" y=\"286\" width=\"8\" height=\"34\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"208\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"223\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"238\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"253\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"268\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"283\" y=\"302\" width=\"8\" height=\"18\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><text x=\"165\" y=\"64\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">Few candles, low volume</text><text x=\"165\" y=\"78\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">big imbalance: strong level</text><text x=\"197\" y=\"262\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">short the first return</text><line x1=\"242\" y1=\"250\" x2=\"259\" y2=\"150\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"259,150 261.2,157.7 254.4,156.5\" fill=\"#f59e0b\"/><rect x=\"396\" y=\"116\" width=\"219\" height=\"21\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><line x1=\"342\" y1=\"113\" x2=\"342\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"338\" y=\"117\" width=\"8\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"357\" y1=\"113\" x2=\"357\" y2=\"123\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"353\" y=\"117\" width=\"8\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"372\" y1=\"113\" x2=\"372\" y2=\"123\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"368\" y=\"117\" width=\"8\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"387\" y1=\"113\" x2=\"387\" y2=\"124\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"383\" y=\"117\" width=\"8\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"402\" y1=\"116\" x2=\"402\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"398\" y=\"120\" width=\"8\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"417\" y1=\"124\" x2=\"417\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"413\" y=\"128\" width=\"8\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"432\" y1=\"124\" x2=\"432\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"428\" y=\"128\" width=\"8\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"447\" y1=\"123\" x2=\"447\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"443\" y=\"127\" width=\"8\" height=\"5\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"462\" y1=\"123\" x2=\"462\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"458\" y=\"127\" width=\"8\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"477\" y1=\"124\" x2=\"477\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"473\" y=\"128\" width=\"8\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"492\" y1=\"124\" x2=\"492\" y2=\"137\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"488\" y=\"128\" width=\"8\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"507\" y1=\"124\" x2=\"507\" y2=\"137\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"503\" y=\"128\" width=\"8\" height=\"5\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"522\" y1=\"124\" x2=\"522\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"518\" y=\"128\" width=\"8\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"537\" y1=\"124\" x2=\"537\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"533\" y=\"128\" width=\"8\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"552\" y1=\"124\" x2=\"552\" y2=\"137\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"548\" y=\"128\" width=\"8\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"567\" y1=\"125\" x2=\"567\" y2=\"137\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"563\" y=\"129\" width=\"8\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"582\" y1=\"125\" x2=\"582\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"578\" y=\"129\" width=\"8\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"597\" y1=\"143\" x2=\"597\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"593\" y=\"147\" width=\"8\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><rect x=\"338\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"353\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"368\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"383\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"398\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"413\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"428\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"443\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"458\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"473\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"488\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"503\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"518\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"533\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"548\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"563\" y=\"290\" width=\"8\" height=\"30\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"578\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><rect x=\"593\" y=\"306\" width=\"8\" height=\"14\" fill=\"#94a3b855\" stroke=\"#94a3b8\" stroke-width=\"0.5\"/><text x=\"475\" y=\"64\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"700\">Many candles, heavy volume</text><text x=\"475\" y=\"78\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">balanced: textbook 'strong', really weak</text><line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"320\" stroke=\"#94a3b8\" stroke-width=\"0.6\" stroke-dasharray=\"2 4\"/></svg>", "caption": "The ES 15-minute short came from a four-candle, low-volume supply; a long, busy sideways area is where buyers and sellers agreed (balance), not where price turns sharply."}
    ],
    "newVsPdfs": [
      "Kevin caps basing at about six or seven candles; Seiden argues the logic and adds 'thin areas with no demand' as a reason the target is easy to reach."
    ]
  },
  {
    "n": 377,
    "title": "Ten Year Treasury Note Futures",
    "kind": "article",
    "summary": "Seiden recommends the 10-year T-note futures (TY/ZN): huge volume and liquidity make supply/demand levels clean and easy to identify. A 15-minute short at a yellow supply box made $750, and timing bond turns helps forecast interest-rate moves for mortgages and investments.",
    "sections": [
      {
        "heading": "Why trade the TY",
        "points": [
          "One of the largest global treasury markets; it is where interest rates are set in a free market.",
          "Very liquid, so quality supply/demand levels are solid and easy to see."
        ]
      },
      {
        "heading": "The trade",
        "points": [
          "Price traded sideways in a yellow area - looks balanced, but it is never balanced; the imbalance just takes time to show.",
          "The drop from the area proved supply exceeded demand (retail prices).",
          "When price rallied back he sold to someone buying at retail; he took a quick $750 because he had a plane to catch.",
          "The supply level was so clear you could almost draw a box around it."
        ]
      },
      {
        "heading": "Contract specs and rates",
        "points": [
          "CME contract specs give value, months, tick value, hours, symbols - but never where to buy and sell.",
          "Bond prices up = rates down and vice versa; supply on TY means rates about to rise.",
          "Investors would use larger-timeframe levels; key living-standard markets (rates, currencies, food, energy) are all futures."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.378): @TY 15-minute (CBOT). Yellow 'Supply' box around 126'06-126'08 where price traded sideways after an early decline; price drops from it, then rallies back up; arrow 'Short Entry' at the top of the box. Price then declines to about 125'22. Volume bars below. Statement Oct 26, 2010: gross 812.50, 'Low Risk Profit: $750.60'.",
          "Figure 2 (p.380): CME 10-Year US Treasury Note Futures contract specs table - $100,000 face value, tick 1/2 of 1/32 ($15.625), March/June/Sept/Dec cycle, open outcry 7:20-14:00 CT, Globex Sun-Fri 17:30-16:00, tickers TY/ZN."
        ]
      }
    ],
    "rules": [
      "Prefer highly liquid markets where levels are clean.",
      "A sideways area followed by a drop is supply; sell the first rally back.",
      "Know the contract specs (tick value etc.) but don't expect them to tell you where to trade."
    ],
    "mistakes": [
      "Thinking a sideways area is truly balanced.",
      "Confusing contract knowledge with a trading edge."
    ],
    "quotes": [
      "It is never a balanced equation. It simply takes time for this unbalanced equation to play out.",
      "You can almost draw a box around that level."
    ],
    "diagrams": [
      { "key": "draw", "caption": "Box the sideways base that price dropped from; sell the return." }
    ],
    "checklist": [
      "Is the market liquid enough for clean levels?",
      "Do I know the tick value and session hours?",
      "Is the level a clear box with a sharp departure?"
    ],
    "journalTags": ["treasury-futures", "ty", "liquidity", "interest-rates", "contract-specs"],
    "images": [
      {"src": "/lessons/seiden/p378-037.jpg", "caption": "@TY 15-minute (10-year T-note): yellow 'Supply' box ~126'06-126'08 where price paused sideways in an early decline; the rally back up hits the box ('Short Entry' arrow) and price falls to ~125'20. Statement 10/26/10: 'Low Risk Profit: $750.60'.", "notes": ["Drop-base-drop supply in a deep, liquid market gives clean, objective levels.", "Short the first return with the stop just above the box."]},
      {"src": "/lessons/seiden/p380-038.jpg", "caption": "CME 10-Year US Treasury Note futures contract specifications: $100,000 face value, tick 1/2 of 1/32 ($15.625), March/June/Sept/Dec cycle, open outcry 7:20-14:00 CT, Globex Sun-Fri 17:30-16:00, tickers TY / ZN.", "notes": ["Know the contract: tick value and trading hours determine stop size and position sizing."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">10-year T-note: clean levels from deep liquidity</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Drop-base-drop supply, short the first return</text><rect x=\"120\" y=\"135\" width=\"440\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"122\" y=\"129\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply: sideways pause in the decline</text><line x1=\"40\" y1=\"86\" x2=\"40\" y2=\"104\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"90\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"96\" x2=\"62\" y2=\"118\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"57\" y=\"100\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"84\" y1=\"110\" x2=\"84\" y2=\"130\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"79\" y=\"114\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"106\" y1=\"122\" x2=\"106\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"101\" y=\"126\" width=\"10\" height=\"16\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"128\" y1=\"135\" x2=\"128\" y2=\"146\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"123\" y=\"139\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"150\" y1=\"135\" x2=\"150\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"145\" y=\"139\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"172\" y1=\"136\" x2=\"172\" y2=\"146\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"167\" y=\"140\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"194\" y1=\"136\" x2=\"194\" y2=\"147\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"189\" y=\"140\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"216\" y1=\"136\" x2=\"216\" y2=\"147\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"211\" y=\"140\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"238\" y1=\"136\" x2=\"238\" y2=\"166\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"140\" width=\"10\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"158\" x2=\"260\" y2=\"192\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"162\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"282\" y1=\"184\" x2=\"282\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"277\" y=\"188\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"304\" y1=\"190\" x2=\"304\" y2=\"212\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"299\" y=\"194\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"326\" y1=\"174\" x2=\"326\" y2=\"198\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"321\" y=\"178\" width=\"10\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"348\" y1=\"156\" x2=\"348\" y2=\"182\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"343\" y=\"160\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"370\" y1=\"142\" x2=\"370\" y2=\"164\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"146\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"392\" y1=\"142\" x2=\"392\" y2=\"174\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"387\" y=\"146\" width=\"10\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"414\" y1=\"166\" x2=\"414\" y2=\"202\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"409\" y=\"170\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"436\" y1=\"194\" x2=\"436\" y2=\"224\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"431\" y=\"198\" width=\"10\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"458\" y1=\"208\" x2=\"458\" y2=\"224\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"453\" y=\"212\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"480\" y1=\"208\" x2=\"480\" y2=\"242\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"212\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"502\" y1=\"234\" x2=\"502\" y2=\"264\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"497\" y=\"238\" width=\"10\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"400\" y1=\"147\" x2=\"560\" y2=\"147\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"150\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short entry</text><line x1=\"400\" y1=\"127\" x2=\"560\" y2=\"127\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"130\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"400\" y1=\"250\" x2=\"560\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"253\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">target</text><text x=\"172\" y=\"300\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">drop - base - drop</text></svg>", "caption": "TY 15-minute: price paused sideways in a decline (supply), dropped, and the first rally back to the box was the short, with the stop just above it."}
    ],
    "newVsPdfs": [
      "Kevin's material centres on forex; Seiden promotes the TY note futures and links bond levels to interest-rate forecasting."
    ]
  },
  {
    "n": 381,
    "title": "The Bull Trap",
    "kind": "article",
    "summary": "Hunter vs hunted: the Bull Trap is shorting when price breaks above an obvious high (here the Globex overnight high) straight into fresh supply just above. Breakout buyers provide liquidity. The 11/17/10 Pro Picks ES short at 1182 (stop 1184.25) hit both targets.",
    "sections": [
      {
        "heading": "Traps vs opportunities",
        "points": [
          "Like the polar bear at the seal's breathing hole or the crocodile at the waterhole, professionals set traps for novices.",
          "There are invitations to buy that are real opportunities and others that are traps."
        ]
      },
      {
        "heading": "The setup",
        "points": [
          "Supply level = yellow shaded area where price could not stay and declined; two lines are wrapped around it and carried forward.",
          "The Globex (overnight) high sat just below the supply; most traders watch the S&P.",
          "When the regular session rallied above the Globex high, breakout buyers rushed in - right into fresh supply.",
          "Entry 1182, stop 1184.25, targets 1179 and 1175; 1182 became the high of the day and both targets filled."
        ]
      },
      {
        "heading": "Why it works",
        "points": [
          "Most are trained to buy a new high of the day and buy at supply; he is trained to sell there.",
          "Trading is a transfer from those who fall for traps to those who set them."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.383): Pro Picks screen 11/17/2010, ES S&P E-mini, Short. Trends: short-term Down, long-term Up. Entry range 1,182.00-1,183.50, stop 1,184.25, T1 1,179.00, T2 1,175.00. Result: closed for profit, quantity 5, exit 1,179.00, P/L $1,350, +10 points. The chart shows a yellow 'Supply above Globex High' box carried right to 'Bull Trap Short'. Trade strategy text explains the bullish expectations above the Globex high.",
          "Figure 2 (p.384): @ES 10-minute (Dec10). Yellow 'Supply' box ~1,182-1,184 at the left (origin of a sharp drop to ~1,172). Price recovers overnight and in the session pokes above the prior high into supply - circled 'Short Entry' ~1,182. Price drops; two circles at ~1,175-1,177 labelled 'Target 1 & 2'. Below, the confirmation statement with sells at 1,182 and buys at 1,174.25-1,179.50; 'Low Risk Profit: $732.40'."
        ]
      }
    ],
    "rules": [
      "Bull trap: short when price breaks an obvious high (e.g. overnight/Globex high) into fresh supply right above it.",
      "Bear trap (mirror): buy when price breaks an obvious low into fresh demand right below it.",
      "Carry supply/demand lines forward so you know where price will likely turn."
    ],
    "mistakes": [
      "Buying a breakout of the day's/overnight high without checking for supply above.",
      "Buying at supply because it looks like strength."
    ],
    "quotes": [
      "This game is a transfer of accounts from those who fall for professional 'traps'.",
      "When there is a fresh supply level just above, this bullish thinking is a TRAP."
    ],
    "diagrams": [
      { "key": "sequence", "caption": "Obvious high taken out, breakout buyers trapped at fresh supply." }
    ],
    "checklist": [
      "Is there an obvious high/low (Globex, prior day) just inside a fresh level?",
      "Will a break of it create breakout buyers/sellers who become my liquidity?",
      "Entry at the level, stop just beyond, targets set?"
    ],
    "journalTags": ["bull-trap", "globex-high", "breakout-trap", "es", "pro-picks"],
    "images": [
      {"src": "/lessons/seiden/p383-040.jpg", "caption": "Pro Picks 11/17/2010, ES S&P E-mini Short: short-term trend down, long-term up; entry 1,182.00-1,183.50, stop 1,184.25, T1 1,179.00, T2 1,175.00. Chart: 'Supply above Globex High' with 'Bull Trap Short' marked. Result: closed for profit, 5 contracts, +$1,350 (10 points).", "notes": ["The plan was published before the trade: entry, stop and targets all objective.", "Bull trap: the break above the Globex high runs straight into supply."]},
      {"src": "/lessons/seiden/p384-041.jpg", "caption": "@ES 10-minute (Dec10): yellow 'Supply' ~1,182-1,184 at the left (origin of a sharp drop to ~1,172); price recovers and pokes above the prior high into supply ('Short Entry' circled ~1,182); it then declines to both circled targets (~1,176 and ~1,174). Statement: 'Low Risk Profit: $732.40'.", "notes": ["Breakout buyers above the prior high provide the liquidity for the short.", "Small stop above supply, two targets below - a lopsided reward to risk."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">The bull trap: hunter vs hunted</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">The break of an obvious high runs straight into fresh supply</text><rect x=\"98\" y=\"130\" width=\"462\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"100\" y=\"124\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply (origin of a sharp drop)</text><line x1=\"238\" y1=\"154\" x2=\"560\" y2=\"154\" stroke=\"#94a3b8\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"157\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"start\">Globex high</text><line x1=\"40\" y1=\"154\" x2=\"40\" y2=\"174\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"158\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"62\" y1=\"140\" x2=\"62\" y2=\"162\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"57\" y=\"144\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"84\" y1=\"130\" x2=\"84\" y2=\"148\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"79\" y=\"134\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"106\" y1=\"130\" x2=\"106\" y2=\"142\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"101\" y=\"134\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"128\" y1=\"131\" x2=\"128\" y2=\"142\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"123\" y=\"135\" width=\"10\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"150\" y1=\"131\" x2=\"150\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"145\" y=\"135\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"172\" y1=\"161\" x2=\"172\" y2=\"197\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"167\" y=\"165\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"194\" y1=\"189\" x2=\"194\" y2=\"221\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"189\" y=\"193\" width=\"10\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"216\" y1=\"209\" x2=\"216\" y2=\"221\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"211\" y=\"213\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"238\" y1=\"209\" x2=\"238\" y2=\"220\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"213\" width=\"10\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"260\" y1=\"198\" x2=\"260\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"202\" width=\"10\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"282\" y1=\"186\" x2=\"282\" y2=\"206\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"277\" y=\"190\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"304\" y1=\"176\" x2=\"304\" y2=\"194\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"299\" y=\"180\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"326\" y1=\"168\" x2=\"326\" y2=\"184\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"321\" y=\"172\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"348\" y1=\"158\" x2=\"348\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"343\" y=\"162\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"370\" y1=\"152\" x2=\"370\" y2=\"166\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"156\" width=\"10\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"392\" y1=\"144\" x2=\"392\" y2=\"160\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"387\" y=\"148\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"414\" y1=\"132\" x2=\"414\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"409\" y=\"136\" width=\"10\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"436\" y1=\"132\" x2=\"436\" y2=\"168\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"431\" y=\"136\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"458\" y1=\"160\" x2=\"458\" y2=\"198\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"453\" y=\"164\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"480\" y1=\"190\" x2=\"480\" y2=\"224\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"194\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"502\" y1=\"216\" x2=\"502\" y2=\"244\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"497\" y=\"220\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"384\" y=\"250\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">breakout buyers</text><line x1=\"384\" y1=\"238\" x2=\"408\" y2=\"144\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"408,144 409.6,151.8 402.8,150.1\" fill=\"#f59e0b\"/><line x1=\"426\" y1=\"142\" x2=\"560\" y2=\"142\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"428\" y=\"139\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short</text><line x1=\"426\" y1=\"122\" x2=\"560\" y2=\"122\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"428\" y=\"119\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"426\" y1=\"195\" x2=\"560\" y2=\"195\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"198\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">T1</text><line x1=\"426\" y1=\"228\" x2=\"560\" y2=\"228\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"231\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">T2</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Breakout buyers above the Globex high provide the liquidity for the short.</text></svg>", "caption": "Bull trap: price pokes above the overnight (Globex) high into supply just above it; short the proximal line with a small stop, T1 and T2 below."}
    ],
    "newVsPdfs": [
      "Kevin teaches liquidity traps before zones; Seiden's version names a specific trigger - the Globex/overnight high just under fresh supply."
    ]
  },
  {
    "n": 385,
    "title": "Is it a Duck or a Lobster?",
    "kind": "article",
    "summary": "Supply and demand never change; buy wholesale and sell retail like any business. A Pro Picks long in Euro futures at fresh daily demand (1.3085) was supported by the US Dollar index hitting fresh supply at the same time, yielding about $4,400 in shorter-term trades.",
    "sections": [
      {
        "heading": "Keep it simple",
        "points": [
          "If it looks, walks and quacks like a duck, it's a duck - no matter what experts or fancy math say.",
          "Adam Smith described supply and demand; it has never changed, like gravity.",
          "A gas station buys gum at $0.25 and sells at $1.00 - traders must do the same."
        ]
      },
      {
        "heading": "The Euro trade",
        "points": [
          "Euro futures had declined for days toward a fresh demand zone; Pro Picks long entry 1.3085 (range 1.3085-1.2970), stop 1.2965, targets 1.3300 and 1.3350.",
          "At the same time the US Dollar index was nearing fresh supply - higher odds.",
          "Price reached the zone a day later and turned up; he used the level for several shorter-term trades."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.386): Pro Picks (Forex swing) - EC Euro, Long; trends short Down, long Down; pick 11/29/2010; entry 13085-12970, stop 12965, T1 133(00), T2 13350. The chart shows a yellow demand box at the base of the Sept rally (~1.30-1.31) with price falling back toward it.",
          "Figure 2 (p.387): left 'US Dollar - Daily Chart' ($DXY): yellow supply box ~80.8-81.6 at the September high, price rallying from ~76 back up to ~80.7 into it. Right 'Euro/US Dollar - Daily Chart' (@EC): yellow demand ~1.30-1.31 at the September base, price declining from ~1.42 to touch it (last 1.3127).",
          "Figure 3 (p.388): trading platform DOM for Euro FX with circled P/L, and a statement of 11/30 Euro currency futures trades; 'Low Risk Profit: $4,421.55'."
        ]
      }
    ],
    "rules": [
      "Buy at fresh demand (wholesale), sell at fresh supply (retail).",
      "Raise odds by confirming the inverse/related market is at the opposite level (EUR at demand while USD index at supply).",
      "A swing level can be used for multiple shorter-term trades."
    ],
    "mistakes": [
      "Complicating a simple supply/demand picture.",
      "Selling at wholesale levels because the trend is down."
    ],
    "quotes": [
      "Gravity is always gravity.",
      "Maybe you're really just looking at a Duck, thinking it's a Babboon."
    ],
    "diagrams": [],
    "checklist": [
      "Is the correlated/inverse market at an aligned opposite level?",
      "Is my zone fresh?",
      "Entry, stop and targets set before the touch?"
    ],
    "journalTags": ["eurusd", "dxy", "correlation", "fresh-demand", "pro-picks", "keep-it-simple"],
    "images": [
      {"src": "/lessons/seiden/p386-043.jpg", "caption": "Pro Picks (Forex swing) 11/29/2010: EC Euro Long; short- and long-term trends Down; entry 13085-12970, stop 12965, T1 133(00), T2 13350. The chart shows a yellow demand box at the base of the September rally (~1.30-1.31) with price falling into it.", "notes": ["A long against both trends, justified by fresh demand and the margin above.", "The trade strategy notes the US Dollar is at fresh supply at the same time."]},
      {"src": "/lessons/seiden/p387-044.jpg", "caption": "Left: US Dollar index daily - yellow supply ~80.8-81.6 at the September high, price rallying from ~76 back up into it (~80.7). Right: Euro/US Dollar daily - yellow demand ~1.30-1.31 at the September base, price falling from ~1.42 back down into it (~1.31).", "notes": ["Mirror image: dollar at supply while the euro is at demand.", "Correlated confirmation raises the odds of both turns."]},
      {"src": "/lessons/seiden/p388-045.jpg", "caption": "Euro FX trading platform DOM with the open P/L circled, plus the 11/30 statement of Euro currency futures trades; 'Low Risk Profit: $4,421.55'.", "notes": ["Shorter-term trades taken off the daily demand produced the profit."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Duck or lobster? Two charts, one story</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Dollar into fresh supply while the Euro falls into fresh demand</text><text x=\"160\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">US Dollar index (daily)</text><rect x=\"34\" y=\"88\" width=\"266\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"300\" y=\"82\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"end\" font-weight=\"600\">fresh supply</text><line x1=\"44\" y1=\"88\" x2=\"44\" y2=\"100\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"39.5\" y=\"92\" width=\"9\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"62\" y1=\"88\" x2=\"62\" y2=\"99\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"57.5\" y=\"92\" width=\"9\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"80\" y1=\"91\" x2=\"80\" y2=\"123\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"75.5\" y=\"95\" width=\"9\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"98\" y1=\"115\" x2=\"98\" y2=\"149\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"93.5\" y=\"119\" width=\"9\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"116\" y1=\"141\" x2=\"116\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"111.5\" y=\"145\" width=\"9\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"134\" y1=\"161\" x2=\"134\" y2=\"185\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"129.5\" y=\"165\" width=\"9\" height=\"16\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"152\" y1=\"169\" x2=\"152\" y2=\"185\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"147.5\" y=\"173\" width=\"9\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"170\" y1=\"159\" x2=\"170\" y2=\"177\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"165.5\" y=\"163\" width=\"9\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"188\" y1=\"147\" x2=\"188\" y2=\"167\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"183.5\" y=\"151\" width=\"9\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"206\" y1=\"133\" x2=\"206\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"201.5\" y=\"137\" width=\"9\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"224\" y1=\"121\" x2=\"224\" y2=\"141\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"219.5\" y=\"125\" width=\"9\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"242\" y1=\"111\" x2=\"242\" y2=\"129\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"237.5\" y=\"115\" width=\"9\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"260\" y1=\"99\" x2=\"260\" y2=\"119\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"255.5\" y=\"103\" width=\"9\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"278\" y1=\"93\" x2=\"278\" y2=\"107\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"273.5\" y=\"97\" width=\"9\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"300\" y=\"300\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"end\">dollar rallies into supply</text><text x=\"470\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Euro / US Dollar (daily)</text><rect x=\"344\" y=\"266\" width=\"266\" height=\"12\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"346\" y=\"293\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\" font-weight=\"600\">fresh demand</text><line x1=\"354\" y1=\"266\" x2=\"354\" y2=\"278\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"349.5\" y=\"270\" width=\"9\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"372\" y1=\"267\" x2=\"372\" y2=\"278\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"367.5\" y=\"271\" width=\"9\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"390\" y1=\"243\" x2=\"390\" y2=\"275\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"385.5\" y=\"247\" width=\"9\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"408\" y1=\"217\" x2=\"408\" y2=\"251\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"403.5\" y=\"221\" width=\"9\" height=\"26\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"426\" y1=\"197\" x2=\"426\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"421.5\" y=\"201\" width=\"9\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"444\" y1=\"181\" x2=\"444\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"439.5\" y=\"185\" width=\"9\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"462\" y1=\"181\" x2=\"462\" y2=\"197\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"457.5\" y=\"185\" width=\"9\" height=\"8\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"480\" y1=\"189\" x2=\"480\" y2=\"207\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"475.5\" y=\"193\" width=\"9\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"498\" y1=\"199\" x2=\"498\" y2=\"219\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"493.5\" y=\"203\" width=\"9\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"516\" y1=\"211\" x2=\"516\" y2=\"233\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"511.5\" y=\"215\" width=\"9\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"534\" y1=\"225\" x2=\"534\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"529.5\" y=\"229\" width=\"9\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"552\" y1=\"237\" x2=\"552\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"547.5\" y=\"241\" width=\"9\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"570\" y1=\"247\" x2=\"570\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"565.5\" y=\"251\" width=\"9\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"588\" y1=\"259\" x2=\"588\" y2=\"273\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"583.5\" y=\"263\" width=\"9\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"610\" y=\"293\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"end\" font-weight=\"600\">euro falls into demand: buy</text><line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"320\" stroke=\"#94a3b8\" stroke-width=\"0.6\" stroke-dasharray=\"2 4\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">When the inverse market sits at the opposite level at the same time, the odds of the turn rise.</text></svg>", "caption": "Euro long at fresh daily demand was backed by the US Dollar index hitting fresh daily supply at the same moment - the mirror image confirms the trade."}
    ],
    "newVsPdfs": [
      "Using the Dollar index at supply as confirmation for a EUR long is an inter-market filter not in Kevin's notes."
    ]
  },
  {
    "n": 388,
    "title": "Gain an Edge with the \"All Star\" Strategy",
    "kind": "article",
    "summary": "A fuller restatement of the All Star strategy: proper supply/demand plus Bollinger Bands. Short at strong supply when price pierces the upper band, in a downtrend context, with significant profit margin; stop just above supply; T1 = band midline, T2 = the opposing demand. Shown on RIMM 60-minute.",
    "sections": [
      {
        "heading": "Selling to novices",
        "points": [
          "Big profits in sales come from selling to buyers who do not know real value; trading is the same.",
          "The strategy focuses on buying from and selling to novices who cannot assess real value."
        ]
      },
      {
        "heading": "Setup and logic",
        "points": [
          "Supply (yellow) is where price dropped strongly.",
          "Return to supply + pierce of upper band = supply exceeds demand, statistical extreme, and a novice buying at supply.",
          "Nearest demand below defines the profit margin; T1 = Bollinger midline (the mean), T2 = demand.",
          "The novice buyer makes two mistakes: buying after a rally outside the upper band and buying at retail prices."
        ]
      },
      {
        "heading": "All Star rules",
        "points": [
          "At key supply, piercing the upper band, in the context of a downtrend, with significant profit margin below: sell short at supply with a buy stop just above supply.",
          "Targets: first the midline, then the opposing demand level.",
          "Opposite rules for longs."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.390): RIMM 60-minute (4/13-5/6) with Bollinger Bands (grey midline). Yellow 'Supply' ~73.8-74.2 at the 4/15 high. Yellow 'Demand' ~68.5-69.0 at the 4/26 low, origin of a strong spike up. That spike reaches supply above the upper band - arrow 'Short Entry'. T1 at the midline (~71) is reached, and T2 at the demand (~69) is reached in early May as price falls toward 67."
        ]
      }
    ],
    "rules": [
      "Short at key supply when price pierces the upper Bollinger Band in a downtrend context with significant profit margin; stop just above supply.",
      "T1 = Bollinger midline, T2 = opposing demand level.",
      "Mirror everything for longs at demand piercing the lower band."
    ],
    "mistakes": [
      "Buying after a rally outside the upper band.",
      "Buying at retail prices.",
      "Taking the setup without profit margin to the opposing level."
    ],
    "quotes": [
      "Profitable traders buy at wholesale prices and sell at retail prices.",
      "Learn to spot the novice trader."
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "All Star: entry at supply, stop just above, T1 midline, T2 demand." }
    ],
    "checklist": [
      "Key level with strong departure?",
      "Price piercing the outer band?",
      "Trend context agrees (downtrend for shorts)?",
      "Profit margin to the opposing level? T1 midline, T2 level set?"
    ],
    "journalTags": ["all-star", "bollinger-bands", "t1-midline", "rimm", "trend-context"],
    "images": [
      {"src": "/lessons/seiden/p390-047.jpg", "caption": "RIMM 60-minute (4/13-5/6) with Bollinger Bands: yellow 'Supply' ~73.8-74.2 at the 4/15 high and yellow 'Demand' ~68.5-69.0 at the 4/26 low (origin of a strong spike). The spike reaches supply above the upper band ('Short Entry' ~74); price falls to T1 (~71.3, band midline) then T2 at the demand, and continues lower to ~67.", "notes": ["Full All Star plan: entry at supply on the band pierce, stop above supply.", "T1 = band midline, T2 = the opposing demand level."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">All Star: entry, stop, T1, T2</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Supply + upper-band pierce + profit margin, in a downtrend context</text><rect x=\"86\" y=\"94\" width=\"474\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"88\" y=\"88\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply</text><rect x=\"284\" y=\"225\" width=\"276\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"286\" y=\"270\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Demand (origin of the spike)</text><polyline points=\"40,156 58,142.5 76,114.2 94,81.9 112,73.5 130,68.1 148,80.1 166,75.3 184,60.3 202,63.4 220,78 238,120 256,162 274,196.2 292,210 310,214 328,215.7 346,210 364,161.8 382,102.2 400,85.9 418,77 436,95.5 454,107 472,94.7 490,109.7\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.5\"/><polyline points=\"40,204 58,192.5 76,195.8 94,200.6 112,194.5 130,188.9 148,160.6 166,169 184,206 202,243.3 220,274 238,276 256,270 274,256.8 292,258 310,262 328,263.7 346,262 364,284.2 382,305.1 400,290.5 418,263.7 436,214.2 454,193.3 472,223 490,248\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.5\"/><polyline points=\"40,180 58,167.5 76,155 94,141.2 112,134 130,128.5 148,120.3 166,122.2 184,133.2 202,153.3 220,176 238,198 256,216 274,226.5 292,234 310,238 328,239.7 346,236 364,223 382,203.7 400,188.2 418,170.3 436,154.8 454,150.2 472,158.8 490,178.8\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\" stroke-dasharray=\"4 3\"/><line x1=\"40\" y1=\"176\" x2=\"40\" y2=\"204\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"180\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"58\" y1=\"151\" x2=\"58\" y2=\"184\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"53\" y=\"155\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"76\" y1=\"126\" x2=\"76\" y2=\"159\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"71\" y=\"130\" width=\"10\" height=\"25\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"94\" y1=\"96\" x2=\"94\" y2=\"134\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"89\" y=\"100\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"112\" y1=\"96\" x2=\"112\" y2=\"109\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"107\" y=\"100\" width=\"10\" height=\"5\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"130\" y1=\"97\" x2=\"130\" y2=\"109\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"125\" y=\"101\" width=\"10\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"148\" y1=\"97\" x2=\"148\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"143\" y=\"101\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"166\" y1=\"127\" x2=\"166\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"161\" y=\"131\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"184\" y1=\"162\" x2=\"184\" y2=\"200\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"179\" y=\"166\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"202\" y1=\"192\" x2=\"202\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"197\" y=\"196\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"220\" y1=\"217\" x2=\"220\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"215\" y=\"221\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"238\" y1=\"229\" x2=\"238\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"233\" width=\"10\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"256\" y1=\"229\" x2=\"256\" y2=\"243\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"251\" y=\"233\" width=\"10\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"274\" y1=\"225\" x2=\"274\" y2=\"243\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"269\" y=\"229\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"292\" y1=\"225\" x2=\"292\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"287\" y=\"229\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"310\" y1=\"237\" x2=\"310\" y2=\"249\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"305\" y=\"241\" width=\"10\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"328\" y1=\"241\" x2=\"328\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"323\" y=\"245\" width=\"10\" height=\"6\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"346\" y1=\"207\" x2=\"346\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"341\" y=\"211\" width=\"10\" height=\"40\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"364\" y1=\"157\" x2=\"364\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"359\" y=\"161\" width=\"10\" height=\"50\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"382\" y1=\"109\" x2=\"382\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"377\" y=\"113\" width=\"10\" height=\"48\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"400\" y1=\"109\" x2=\"400\" y2=\"152\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"395\" y=\"113\" width=\"10\" height=\"35\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"418\" y1=\"134\" x2=\"418\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"413\" y=\"138\" width=\"10\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"436\" y1=\"134\" x2=\"436\" y2=\"162\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"431\" y=\"138\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"454\" y1=\"154\" x2=\"454\" y2=\"187\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"449\" y=\"158\" width=\"10\" height=\"25\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"472\" y1=\"179\" x2=\"472\" y2=\"217\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"467\" y=\"183\" width=\"10\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"490\" y1=\"209\" x2=\"490\" y2=\"237\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"485\" y=\"213\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"394\" y1=\"112\" x2=\"560\" y2=\"112\" stroke=\"#f59e0b\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"115\" fill=\"#f59e0b\" font-size=\"9\" text-anchor=\"start\">short</text><line x1=\"394\" y1=\"86\" x2=\"560\" y2=\"86\" stroke=\"#ef4444\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"89\" fill=\"#ef4444\" font-size=\"9\" text-anchor=\"start\">stop</text><line x1=\"394\" y1=\"203.7\" x2=\"560\" y2=\"203.7\" stroke=\"#a78bfa\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"206.7\" fill=\"#a78bfa\" font-size=\"9\" text-anchor=\"start\">T1: midline</text><line x1=\"394\" y1=\"225\" x2=\"560\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.3\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"228\" fill=\"#22c55e\" font-size=\"9\" text-anchor=\"start\">T2: demand</text></svg>", "caption": "RIMM 60-minute logic: short where the spike pierces the upper band inside supply, stop just above supply, first target the band midline, second target the demand that launched the spike."}
    ],
    "newVsPdfs": [
      "Kevin uses no indicators and targets with R:R to the next zone; here T1 is the Bollinger midline and a trend-context requirement is added.",
      "Completes the earlier 'Lite' version by adding the downtrend context and stop placement."
    ]
  },
  {
    "n": 391,
    "title": "Supply, Demand and Time",
    "kind": "article",
    "summary": "A clearer restatement of the time odds enhancer with a two-level example: Supply 2 (big, many candles, conventional favourite) was broken, while Supply 1 (two candles) held and produced the short. Little time at a level means a big imbalance.",
    "sections": [
      {
        "heading": "Logic",
        "points": [
          "The more out of balance supply and demand, the stronger and quicker the turn.",
          "At big imbalance, activity is low: few candles and usually low volume."
        ]
      },
      {
        "heading": "The example",
        "points": [
          "Supply 2: many candles, sharp fall - conventional TA loves it. On the return, price based sideways and broke up through it. XLT ignores such levels because too much time was spent there.",
          "Supply 1: just a few candles, hardly noticeable - most ignore it. Price spent little time there, so a big imbalance; shorted on the retrace (circled), and price dropped hard.",
          "The buyer probably followed books that dismiss low-activity levels."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.393): candlestick chart (instrument unnamed, prices ~131-140). 'Supply 1' small box of two candles around 137.3-137.8 after a decline from ~139.5; 'Supply 2' a long box of ~15 sideways candles around 134.8-135.8, from which price fell to ~131. Price rallied back, chopped at Supply 2 and broke through it, then spiked into Supply 1 (circled at ~137.5-138) and immediately dropped back toward 134 (last 138.14 marker on the axis)."
        ]
      }
    ],
    "rules": [
      "Ignore levels where price spent a lot of time; they are not out of balance.",
      "Favour small, few-candle levels and sell/buy the first retrace into them.",
      "Time is one of several odds enhancers deciding level quality."
    ],
    "mistakes": [
      "Choosing the big, obvious, many-candle zone.",
      "Ignoring small levels because they are barely noticeable."
    ],
    "quotes": [
      "That lack of activity is what makes it such a strong supply level.",
      "By thinking the simple logic through, you will always arrive at truth."
    ],
    "diagrams": [
      { "key": "quality", "caption": "Supply 2 (long base) fails; Supply 1 (two candles) holds." }
    ],
    "checklist": [
      "How many candles are in this base vs other candidate levels?",
      "If a long-base level is in the way, do I expect it to break?",
      "Is the few-candle level fresh with a strong departure?"
    ],
    "journalTags": ["time-at-level", "few-candles", "big-base-fails", "odds-enhancer"],
    "images": [
      {"src": "/lessons/seiden/p393-049.jpg", "caption": "Candlestick chart (~131-140): 'Supply 1' - a two-candle box ~137.3-137.8 after a decline from ~139.5; 'Supply 2' - a long box of ~15 sideways candles ~134.8-135.8 from which price fell to ~131. On the return price chops at Supply 2 and breaks through it, then spikes into Supply 1 (circled ~137.5) and drops immediately to ~134.", "notes": ["The long, busy base failed; the quiet two-candle level held.", "Less time at a level = more out of balance = stronger turn."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Supply, demand and time</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">The quiet two-candle level held; the busy long base failed</text><rect x=\"55\" y=\"110\" width=\"535\" height=\"12\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"56\" y=\"104\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply 1: two candles</text><rect x=\"103\" y=\"141\" width=\"487\" height=\"13\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"104\" y=\"169\" fill=\"#ef4444\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">Supply 2: long base</text><line x1=\"30\" y1=\"66\" x2=\"30\" y2=\"94\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"25.5\" y=\"70\" width=\"9\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"46\" y1=\"86\" x2=\"46\" y2=\"118\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"41.5\" y=\"90\" width=\"9\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"110\" x2=\"62\" y2=\"122\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"57.5\" y=\"114\" width=\"9\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"78\" y1=\"111\" x2=\"78\" y2=\"122\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"73.5\" y=\"115\" width=\"9\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"94\" y1=\"111\" x2=\"94\" y2=\"149\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"89.5\" y=\"115\" width=\"9\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"110\" y1=\"141\" x2=\"110\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"105.5\" y=\"145\" width=\"9\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"126\" y1=\"142\" x2=\"126\" y2=\"153\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"121.5\" y=\"146\" width=\"9\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"142\" y1=\"142\" x2=\"142\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"137.5\" y=\"146\" width=\"9\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"158\" y1=\"143\" x2=\"158\" y2=\"153\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"153.5\" y=\"147\" width=\"9\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"174\" y1=\"143\" x2=\"174\" y2=\"154\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"169.5\" y=\"147\" width=\"9\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"190\" y1=\"142\" x2=\"190\" y2=\"154\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"185.5\" y=\"146\" width=\"9\" height=\"4\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"206\" y1=\"142\" x2=\"206\" y2=\"152\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"201.5\" y=\"146\" width=\"9\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"222\" y1=\"141\" x2=\"222\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"217.5\" y=\"145\" width=\"9\" height=\"3\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"238\" y1=\"141\" x2=\"238\" y2=\"152\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233.5\" y=\"145\" width=\"9\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"254\" y1=\"142\" x2=\"254\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"249.5\" y=\"146\" width=\"9\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"270\" y1=\"142\" x2=\"270\" y2=\"154\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"265.5\" y=\"146\" width=\"9\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"286\" y1=\"146\" x2=\"286\" y2=\"184\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"281.5\" y=\"150\" width=\"9\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"302\" y1=\"176\" x2=\"302\" y2=\"214\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"297.5\" y=\"180\" width=\"9\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"318\" y1=\"206\" x2=\"318\" y2=\"236\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"313.5\" y=\"210\" width=\"9\" height=\"22\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"334\" y1=\"214\" x2=\"334\" y2=\"236\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"329.5\" y=\"218\" width=\"9\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"350\" y1=\"202\" x2=\"350\" y2=\"222\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"345.5\" y=\"206\" width=\"9\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"366\" y1=\"192\" x2=\"366\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"361.5\" y=\"196\" width=\"9\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"382\" y1=\"180\" x2=\"382\" y2=\"200\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"377.5\" y=\"184\" width=\"9\" height=\"12\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"398\" y1=\"166\" x2=\"398\" y2=\"188\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"393.5\" y=\"170\" width=\"9\" height=\"14\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"414\" y1=\"158\" x2=\"414\" y2=\"174\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"409.5\" y=\"162\" width=\"9\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"430\" y1=\"152\" x2=\"430\" y2=\"166\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"425.5\" y=\"156\" width=\"9\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"446\" y1=\"152\" x2=\"446\" y2=\"164\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"441.5\" y=\"156\" width=\"9\" height=\"4\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"462\" y1=\"150\" x2=\"462\" y2=\"164\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"457.5\" y=\"154\" width=\"9\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"478\" y1=\"150\" x2=\"478\" y2=\"161\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"473.5\" y=\"154\" width=\"9\" height=\"3\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"494\" y1=\"145\" x2=\"494\" y2=\"161\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"489.5\" y=\"149\" width=\"9\" height=\"8\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"510\" y1=\"139\" x2=\"510\" y2=\"153\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"505.5\" y=\"143\" width=\"9\" height=\"6\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"526\" y1=\"123\" x2=\"526\" y2=\"147\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"521.5\" y=\"127\" width=\"9\" height=\"16\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"542\" y1=\"113\" x2=\"542\" y2=\"131\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"537.5\" y=\"117\" width=\"9\" height=\"10\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"558\" y1=\"113\" x2=\"558\" y2=\"161\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"553.5\" y=\"117\" width=\"9\" height=\"40\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"574\" y1=\"153\" x2=\"574\" y2=\"191\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"569.5\" y=\"157\" width=\"9\" height=\"30\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><text x=\"470\" y=\"236\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">chops, then breaks through Supply 2</text><text x=\"528\" y=\"72\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"end\" font-weight=\"600\">short here</text><line x1=\"512\" y1=\"78\" x2=\"536\" y2=\"108\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"536,108 528.8,104.5 534.2,100.2\" fill=\"#f59e0b\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Little time at a level = big imbalance. Many candles = balance, so it gets broken.</text></svg>", "caption": "Supply 2 had many candles and was broken on the return; Supply 1 had just two candles, so the imbalance was big, and shorting the first retrace into it produced the drop."}
    ],
    "newVsPdfs": [
      "Kevin includes all basing candles and caps them at about six or seven; Seiden's example shows a long-base zone simply being disregarded as not a level."
    ]
  },
  {
    "n": 394,
    "title": "Remove the Veil of Illusion from Trading and Investing",
    "kind": "article",
    "summary": "Actions come from behaviour patterns, which come from beliefs; the strongest illusions sit inside conventional technical and fundamental analysis. Covered here: moving averages (lagging, not support/resistance) and the news (BP at $27 demand). The article continues into Fundamental Analysis beyond page 400.",
    "sections": [
      {
        "heading": "Illusion vs reality",
        "points": [
          "Mastering conventional technical/fundamental analysis is an illusion that layers subjective complexity - walking east-west near the equator trying to reach the North Pole.",
          "Strategies that work don't change with market conditions; the core is supply/demand and human behaviour.",
          "Beliefs -> behaviour patterns -> actions; change beliefs, not just actions."
        ]
      },
      {
        "heading": "Moving averages",
        "points": [
          "Illusion: MAs act as support/resistance or trend filters (crosses, slope).",
          "At the 'B' areas the 20 MA sloped down (a 'downtrend') exactly when the low-risk buy appeared - MA users would skip it.",
          "MAs lag; waiting to buy above the 200-day MA means higher risk, smaller profit, and providing profit to those who bought at B.",
          "When an MA lines up with real supply/demand it only seems to work.",
          "Reality: 'A' areas are sideways bases followed by dramatic rallies = demand; 'B' is the first return = low-risk buy with small stop, maximum profit potential and highest probability.",
          "Indicators are just derivatives of price and volume; price is all you need."
        ]
      },
      {
        "heading": "The news",
        "points": [
          "News is the most powerful illusion because strong news creates strong emotion.",
          "BP: oil-spill news drove the majority to sell; XLT bought for a long-term hold at $27.00 demand. Once the last seller sells where demand exceeds supply, price rises.",
          "Strong news creates powerful turns opposite to what the majority expects, because one side exhausts itself into an imbalance level.",
          "Bad news + collapse in price into demand = low risk, high reward buy."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "Figure 1 (p.395): S&P 500 daily with a blue 20 MA and red 200 MA. Two 'A' arrows mark a sideways base at ~1,145-1,150 and a base ~1,180-1,185 that both launched dramatic rallies (green lines drawn as demand zones). Two circled 'B' points mark first returns to each zone - one at ~1,185 and one at ~1,150 (below the 200 MA, with the 20 MA sloping down) - after which price rallied toward ~1,240.",
          "Figure 2 (p.398): BP monthly, 1996-2011. Yellow 'Demand Level' box ~26-28 at the 1996 base, lines carried right; in 2010 the circled touch is labelled 'We Bought', and price rebounds to ~47. An email from XLT member Mark (July 27, 2010) reports selling at 38.47 for an $11 gain.",
          "Figure 3 (p.400): EUR/USD 30-minute (Feb 2010). A 'Supply Level' rectangle across the top ~1.3800-1.3850 from the upper-left high, origin of a strong drop to ~1.3550. Price rallies back to it - arrows 'Short Entry' and 'Novice Buyer' at the touch - then declines toward ~1.3650. Statement 02/09/10: gross 18,250.00, net 18,034.40."
        ]
      }
    ],
    "rules": [
      "Do not use MAs as support/resistance or trend filters for entries; use price-defined supply/demand.",
      "Buy the first return ('B') to a base that produced a dramatic rally ('A').",
      "Treat strong news into a fresh level as a likely exhaustion turn."
    ],
    "mistakes": [
      "Skipping a demand buy because the 20 MA slopes down or price is below the 200 MA.",
      "Waiting for an MA crossover and buying far above demand.",
      "Selling into bad news at wholesale prices."
    ],
    "quotes": [
      "Indicators and oscillators are nothing more than a derivative of price and volume.",
      "No matter how bad the news is, when the last seller sells at a price level where demand exceeds supply, prices rise."
    ],
    "diagrams": [
      { "key": "trend-momentum", "caption": "Trend defined by levels, not MA slope: buy first return to the base." },
      { "key": "mindset", "caption": "Beliefs -> behaviour -> actions; remove illusion." }
    ],
    "checklist": [
      "Is my bias from a level or from an MA/indicator?",
      "Is this the first return to the base?",
      "Is the news pushing the crowd into my level?",
      "Stop small, profit potential to the opposing level maximal?"
    ],
    "journalTags": ["illusion", "moving-averages", "news", "first-return", "bp", "eurusd", "beliefs"],
    "images": [
      {"src": "/lessons/seiden/p395-051.jpg", "caption": "S&P 500 daily with a blue 20 MA and red 200 MA: two 'A' arrows mark sideways bases (~1,145-1,150 and ~1,180-1,185) that launched dramatic rallies (green demand lines); two circled 'B' points are the first returns to them - one below the 200 MA with the 20 MA sloping down - after which price rallies to ~1,240.", "notes": ["The MA said 'downtrend' at exactly the lowest-risk buy.", "Moving averages lag; demand levels are the objective information."]},
      {"src": "/lessons/seiden/p398-052.jpg", "caption": "BP monthly 1996-2011: yellow 'Demand Level' ~26-28 at the 1996 base, carried right; the 2010 oil-spill collapse touches it ('We Bought' circled) and price rebounds to ~47.", "notes": ["The news created the fear; the demand level created the buy.", "Bad news plus a collapse into fresh demand = low risk, high reward."]},
      {"src": "/lessons/seiden/p400-053.jpg", "caption": "EUR/USD 30-minute (Feb 2010): 'Supply Level' rectangle ~1.3825-1.3850 at the upper-left high, origin of a drop to ~1.3600; price rallies back to it ('Short Entry' / 'Novice Buyer' arrows at the touch) and falls toward ~1.3680. Statement 02/09/10: gross $18,250, net $18,034.40.", "notes": ["The novice buys strength into supply; the short sells to him.", "Supply/demand works the same in forex as in stocks and futures."]}
    ],
    "figures": [
      {"svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"26\" fill=\"#94a3b8\" font-size=\"15\" text-anchor=\"start\" font-weight=\"600\">Remove the veil: moving averages lag</text><text x=\"20\" y=\"44\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">At B the MA slopes down - exactly when the best buy appears</text><rect x=\"142\" y=\"180\" width=\"438\" height=\"10\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"144\" y=\"205\" fill=\"#22c55e\" font-size=\"10\" text-anchor=\"start\" font-weight=\"600\">A: sideways base + dramatic rally = demand</text><polyline points=\"40,118 62,126 84,135.3 106,143.5 128,152 150,157.3 172,161.4 194,161.2 216,162.8 238,158.8 260,149.2 282,135.5 304,121 326,109.2 348,100.2 370,98 392,102.8 414,112.2 436,121.5 458,129.5 480,133 502,131.5 524,124.8\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.6\"/><line x1=\"40\" y1=\"96\" x2=\"40\" y2=\"122\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"35\" y=\"100\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"62\" y1=\"114\" x2=\"62\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"57\" y=\"118\" width=\"10\" height=\"16\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"84\" y1=\"130\" x2=\"84\" y2=\"158\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"79\" y=\"134\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"106\" y1=\"150\" x2=\"106\" y2=\"172\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"101\" y=\"154\" width=\"10\" height=\"14\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"128\" y1=\"164\" x2=\"128\" y2=\"190\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"123\" y=\"168\" width=\"10\" height=\"18\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"150\" y1=\"180\" x2=\"150\" y2=\"190\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"145\" y=\"184\" width=\"10\" height=\"2\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"172\" y1=\"180\" x2=\"172\" y2=\"190\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"167\" y=\"184\" width=\"10\" height=\"2\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"194\" y1=\"156\" x2=\"194\" y2=\"190\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"189\" y=\"160\" width=\"10\" height=\"26\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"216\" y1=\"126\" x2=\"216\" y2=\"164\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"211\" y=\"130\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"238\" y1=\"98\" x2=\"238\" y2=\"134\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"102\" width=\"10\" height=\"28\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"260\" y1=\"74\" x2=\"260\" y2=\"106\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"255\" y=\"78\" width=\"10\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"282\" y1=\"54\" x2=\"282\" y2=\"82\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"277\" y=\"58\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"304\" y1=\"54\" x2=\"304\" y2=\"74\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"299\" y=\"58\" width=\"10\" height=\"12\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"326\" y1=\"66\" x2=\"326\" y2=\"94\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"321\" y=\"70\" width=\"10\" height=\"20\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"348\" y1=\"86\" x2=\"348\" y2=\"118\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"343\" y=\"90\" width=\"10\" height=\"24\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"370\" y1=\"110\" x2=\"370\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"365\" y=\"114\" width=\"10\" height=\"28\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"392\" y1=\"138\" x2=\"392\" y2=\"172\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"387\" y=\"142\" width=\"10\" height=\"26\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"414\" y1=\"164\" x2=\"414\" y2=\"182\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"409\" y=\"168\" width=\"10\" height=\"10\" fill=\"#ef4444\" stroke=\"#ef4444\" stroke-width=\"0\"/><line x1=\"436\" y1=\"148\" x2=\"436\" y2=\"182\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"431\" y=\"152\" width=\"10\" height=\"26\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"458\" y1=\"118\" x2=\"458\" y2=\"156\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"453\" y=\"122\" width=\"10\" height=\"30\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"480\" y1=\"94\" x2=\"480\" y2=\"126\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"475\" y=\"98\" width=\"10\" height=\"24\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"502\" y1=\"74\" x2=\"502\" y2=\"102\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"497\" y=\"78\" width=\"10\" height=\"20\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><line x1=\"524\" y1=\"56\" x2=\"524\" y2=\"82\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"519\" y=\"60\" width=\"10\" height=\"18\" fill=\"#22c55e\" stroke=\"#22c55e\" stroke-width=\"0\"/><text x=\"414\" y=\"262\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"600\">B: first return</text><text x=\"414\" y=\"275\" fill=\"#f59e0b\" font-size=\"10\" text-anchor=\"middle\">= low-risk buy</text><line x1=\"414\" y1=\"252\" x2=\"414\" y2=\"196\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"414,196 417.5,203.2 410.5,203.2\" fill=\"#f59e0b\"/><text x=\"620\" y=\"300\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"end\">MA trader at B: 'downtrend, no buy'</text><text x=\"620\" y=\"314\" fill=\"#a78bfa\" font-size=\"9\" text-anchor=\"end\">the moving average lags price</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\">Indicators are derivatives of price; the demand level is the objective information.</text></svg>", "caption": "S&P daily logic: the A base launched a dramatic rally (demand); at the first return B the lagging MA still points down, so MA traders skip the low-risk buy that XLT takes."}
    ],
    "newVsPdfs": [
      "Agrees with Kevin's no-indicator stance and adds an explicit S&P example where the MA trend filter would block the best buy.",
      "Seiden treats bad-news exhaustion into demand as a buy; Kevin's notes focus on avoiding news releases."
    ]
  }
];
