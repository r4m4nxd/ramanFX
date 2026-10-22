// Sam Seiden, "5 years of supply and demand teaching", original PDF pages 81-160.
// Study notes paraphrased from a full read of every page, including the chart images.
import type { VideoLesson } from '@/core/videoLessons';

export const SEIDEN_P081: VideoLesson[] = [
  {
    "n": 81,
    "title": "Q&A: Two-Line Zones, Entry Signals and Market Makers (continued)",
    "kind": "article",
    "summary": "Continued from p80: the tail of a reader Q&A. Seiden says not to pick exact turns but to wrap each level in two lines and bet on a turn in that area, buying at the upper demand line with the stop just below the lower line. Any entry trigger is acceptable as long as it fires AT a level. A second question about market makers 'manipulating' price is answered from his floor experience: institutions push price into known supply to invite the public in, then sell into it.",
    "sections": [
      {
        "heading": "Where the ideas come from",
        "points": [
          "He did not invent supply and demand; he is repeating Adam Smith and Newton's laws of motion, where the 'mass' is order flow.",
          "The same equation has governed price movement for centuries and has not changed."
        ]
      },
      {
        "heading": "Two lines instead of an exact turning point",
        "points": [
          "Picking the exact turning point is hard and adds little profit even if you manage it.",
          "Draw two lines around each supply (resistance) and demand (support) level; you are only betting that price turns somewhere in that area.",
          "Long: buy when price reaches the upper demand line; once filled, put the protective sell stop just below the lower demand line.",
          "Size the position so the loss, if stopped, is no more than you are comfortable with."
        ]
      },
      {
        "heading": "Entry signals",
        "points": [
          "A momentum candle followed by a reversal candle AT a demand or supply level is a valid entry signal.",
          "A CCI overbought/oversold reading AT a level is also valid.",
          "Use any signal you like; what matters is that it fires at a price where demand likely exceeds supply (or vice versa)."
        ]
      },
      {
        "heading": "Are market makers just manipulating price?",
        "points": [
          "From the trading floor: when large supply sat above the market, institutions bid price up to that level, inviting the public to buy, then dumped a large sell order there, leaving the public on the wrong side.",
          "That is not a contradiction of supply and demand; it is how the game is played, and those who understand it best get paid by those who understand it least.",
          "The one place an institution cannot hide is the price chart, so candles should be read as footprints of real buyers and sellers, not red and green signals."
        ]
      },
      {
        "heading": "Charts",
        "points": [
          "The chart this answer refers to is on p80 (previous part); no chart appears on pp81-82."
        ]
      }
    ],
    "rules": [
      "Mark every level as a zone with two lines, not a single price.",
      "Long entry at the upper (proximal) demand line; protective stop just below the lower (distal) line.",
      "Only act on a trigger (reversal candle, CCI extreme, etc.) when it occurs at a supply or demand level.",
      "Size the position from the stop distance so the loss stays within your comfort limit."
    ],
    "mistakes": [
      "Trying to pick the exact tick of a turn.",
      "Taking indicator or candle signals away from a level.",
      "Believing price is pure manipulation and ignoring what the chart shows.",
      "Learning from books written by people who do not trade."
    ],
    "quotes": [
      "The one place a market maker or institution can't hide is the price chart.",
      "You're just betting that they will turn in that area."
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"112\" y=\"226\" width=\"358\" height=\"32\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"464\" y=\"246\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">DEMAND</text><text x=\"474\" y=\"230\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"474\" y=\"262\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Wrap the level in two lines</text><line x1=\"40\" y1=\"85\" x2=\"40\" y2=\"123\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"90\" width=\"12\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"56\" y1=\"108.8\" x2=\"56\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"113.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"72\" y1=\"136.8\" x2=\"72\" y2=\"179\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"66\" y=\"141.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"88\" y1=\"164.8\" x2=\"88\" y2=\"207\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"82\" y=\"169.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"104\" y1=\"192.8\" x2=\"104\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"98\" y=\"197.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"120\" y1=\"228\" x2=\"120\" y2=\"252\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"114\" y=\"233\" width=\"12\" height=\"14\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"136\" y1=\"228\" x2=\"136\" y2=\"252\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"233\" width=\"12\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"228\" x2=\"152\" y2=\"252\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"146\" y=\"234.4\" width=\"12\" height=\"9.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"168\" y1=\"211\" x2=\"168\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"162\" y=\"216\" width=\"12\" height=\"29\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"184\" y1=\"182\" x2=\"184\" y2=\"225.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"187\" width=\"12\" height=\"33.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"200\" y1=\"153\" x2=\"200\" y2=\"196.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"194\" y=\"158\" width=\"12\" height=\"33.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"216\" y1=\"124\" x2=\"216\" y2=\"167.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"210\" y=\"129\" width=\"12\" height=\"33.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"232\" y1=\"95\" x2=\"232\" y2=\"138.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"100\" width=\"12\" height=\"33.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"248\" y1=\"95\" x2=\"248\" y2=\"130\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"242\" y=\"100\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"116.2\" x2=\"264\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"258\" y=\"121.2\" width=\"12\" height=\"28.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"280\" y1=\"141.2\" x2=\"280\" y2=\"180\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"274\" y=\"146.2\" width=\"12\" height=\"28.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"296\" y1=\"166.2\" x2=\"296\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"290\" y=\"171.2\" width=\"12\" height=\"28.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"312\" y1=\"191.2\" x2=\"312\" y2=\"230\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"306\" y=\"196.2\" width=\"12\" height=\"28.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"328\" y1=\"200\" x2=\"328\" y2=\"233\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"322\" y=\"205\" width=\"12\" height=\"23\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"344\" y1=\"165\" x2=\"344\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"338\" y=\"170\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"360\" y1=\"135\" x2=\"360\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"354\" y=\"140\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"105\" x2=\"376\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"370\" y=\"110\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"330\" y1=\"226\" x2=\"470\" y2=\"226\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"230\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\"></text><text x=\"340\" y=\"218\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">BUY limit at proximal</text><line x1=\"330\" y1=\"272\" x2=\"470\" y2=\"272\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"276\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\"></text><text x=\"340\" y=\"290\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">STOP just below distal</text><line x1=\"330\" y1=\"95\" x2=\"470\" y2=\"95\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"99\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\"></text><text x=\"340\" y=\"87\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">TARGET: opposing supply</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">You only bet that price turns somewhere inside the zone, not on the exact tick.</text></svg>",
        "caption": "Two-line demand zone: the base is wrapped by a proximal and a distal line. Buy at the proximal line on the return, stop just below the distal line, target the opposing supply."
      }
    ],
    "diagrams": [
      { "key": "zone-anatomy", "caption": "Two lines wrap the level; buy at the upper line, stop below the lower line." }
    ],
    "checklist": [
      "Is the level drawn as a two-line zone?",
      "Is my entry at the proximal line and my stop beyond the distal line?",
      "Did my trigger fire at the level, not in the middle of nowhere?",
      "Is position size based on the stop distance?"
    ],
    "journalTags": ["two-line-zone", "entry-trigger-at-level", "cci", "market-makers", "institutional-footprints"],
    "newVsPdfs": [
      "Same as Kevin: entry at the proximal line, stop beyond the distal line.",
      "Differs: Seiden accepts indicator triggers (CCI overbought/oversold) as long as they fire at a level; Kevin's lessons avoid indicators."
    ]
  },
  {
    "n": 82,
    "title": "The Most Popular Entry Strategy in Forex Trading",
    "kind": "article",
    "summary": "Seiden explains the breakout, the most popular entry at Online Trading Academy, in two forms: the support/resistance breakout and the trend-line breakout. A level that is hit repeatedly with shrinking reactions, and then has price basing right at it, has run out of opposing orders and is likely to break. A trend-line break shows price has reached a level where the other side is now stronger, and a logical target is the origin of the whole trend.",
    "sections": [
      {
        "heading": "Support/resistance breakout",
        "points": [
          "Read the level left to right: the first pivot high forms because supply greatly exceeds demand; the first drop away is large.",
          "On each later visit some of the resting sell orders are filled, so the drop gets shallower: the equation is moving toward balance.",
          "Tree-chopping analogy: each chop removes mass, so the tree is more likely to fall; in trading the mass is the supply or demand at the level.",
          "On the fourth visit price stops falling and bases sideways under the line: there are no longer more sellers than buyers. That is when you get ready to buy the breakout as a low-risk entry.",
          "For shorts, do the mirror image (he jokes: print the page and turn it upside down)."
        ]
      },
      {
        "heading": "Trend-line breakout",
        "points": [
          "A trend line needs two points before it can be drawn.",
          "Downtrend: price falls because it is at levels where supply exceeds demand. Instead of guessing where demand is, wait for the break above the down-trend line; the break shows a level with more willing buyers has been reached.",
          "Uptrend: connect the pivot lows and sell short on the break (breakdown) of the line instead of guessing where supply is.",
          "One logical profit target is the origin of the move that started the whole trend."
        ]
      },
      {
        "heading": "Same logic in every market",
        "points": [
          "Stocks, futures, forex, options, trading cards or rare coins: it is all people and price, and a breakout is quantified the same way.",
          "Rookie-card analogy: when the last card offered at the current price sells, price has to rise.",
          "Risk management is the most important part of trading; the entry is only the start of a risk-averse strategy."
        ]
      },
      {
        "heading": "Chart 1 (p83): EURUSD 30-min, horizontal resistance breakout",
        "points": [
          "TradeStation EURUSD 30-min, 5/14 to 5/15. A horizontal resistance line is drawn at about 1.5485 (labelled 1.54849).",
          "Three small circles mark the touches of the line on 5/14 at about 08:00, 12:00 and 16:00. After a low near 1.5395 around 04:00, the first touch rejects into a dip; the later touches give smaller and smaller pullbacks (to about 1.5465-1.5470).",
          "Price then grinds sideways just under the line overnight (about 1.5455-1.5470).",
          "A large green oval on 5/15 near 00:00-02:00 shows price basing right at the line and breaking through; price then runs to about 1.5540-1.5550. The oval is the breakout buy area."
        ]
      },
      {
        "heading": "Chart 2 (p85): EURUSD 15-min, down-trend line break, long",
        "points": [
          "EURUSD 15-min, evening of 5/11 into 5/12. A down-trend line starts at the pivot high of about 1.5483 (labelled 1.54826) at about 20:00 and runs down across the lower highs.",
          "Price falls to about 1.5375-1.5385 by 01:00-02:00 on 5/12.",
          "A circle at about 02:30 marks the green candle breaking above the line near 1.5390: the long entry.",
          "A dashed red horizontal line at 1.5483 (the origin of the decline) is the target; a second circle around 09:00 shows price reaching it. Price then continues to about 1.5540."
        ]
      },
      {
        "heading": "Chart 3 (p86): EURUSD 5-min, up-trend line break, short",
        "points": [
          "EURUSD 5-min. A steep up-trend line is drawn from the pivot low at about 1.5567 (02:30) through the rising lows of a rally to about 1.5630 (03:30-03:45).",
          "A narrow oval at about 04:00 marks the red candle breaking below the line near 1.5615-1.5620: the short entry.",
          "A dashed red line at about 1.5567 (the origin of the rally) is the target; a circle at about 05:45 shows price falling back to it before bouncing slightly."
        ]
      }
    ],
    "rules": [
      "Breakout setup: repeated tests with progressively shallower reactions, then sideways basing AT the level, then enter on the break.",
      "Draw a trend line only once there are two points.",
      "Long on a break above a down-trend line; short on a break below an up-trend line.",
      "Logical target for a trend-line break: the origin of the move that began the trend.",
      "Manage risk first; an entry is only the beginning of the plan."
    ],
    "mistakes": [
      "Guessing where a trend will end instead of letting the line break show it.",
      "Buying a breakout without seeing evidence that the opposing orders at the level are used up.",
      "Thinking breakouts only work in one market or one era."
    ],
    "quotes": [
      "With each chop, you are removing mass from the tree.",
      "They are all just people and price."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p083-000.jpg",
        "caption": "EURUSD 30-min (5/14-5/15): horizontal resistance at 1.54849 tested three times (circles at 08:00, 12:00, 16:00) with shrinking pullbacks, then price bases just under the line overnight and breaks out in the green oval, running to about 1.5540.",
        "notes": [
          "Read the level left to right: the first rejection is the deepest, later ones are shallower as sell orders are filled.",
          "The key tell is basing AT the line instead of rejecting from it: sellers there are used up.",
          "Entry is the break of the line out of that basing; the stop belongs below the small base."
        ]
      },
      {
        "src": "/lessons/seiden/p085-001.jpg",
        "caption": "EURUSD 15-min (5/11-5/12): down-trend line drawn from the 1.54826 pivot high across the lower highs. The circled green candle near 02:30 breaks above the line around 1.5390 (long entry); the dashed line at 1.5483, the origin of the decline, is the target, reached about 09:00.",
        "notes": [
          "A trend line needs two points; the break shows price has reached a level where buyers now outnumber sellers.",
          "Target the origin of the whole move that the trend line contained.",
          "No guessing where demand is: the break tells you."
        ]
      },
      {
        "src": "/lessons/seiden/p086-002.jpg",
        "caption": "EURUSD 5-min: steep up-trend line from the 1.5567 pivot low (02:30) through the rising lows of a rally to about 1.5630. The circled red candle near 04:00 breaks the line around 1.5617 (short entry); the dashed line at 1.5567, the origin of the rally, is the target, reached about 05:45.",
        "notes": [
          "Mirror image of the long: short the break of an up-trend line instead of guessing where supply is.",
          "Target is again the origin of the move (the dashed line).",
          "Stop goes above the swing high just before the break."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Shrinking reactions, then basing AT the level</text><line x1=\"30\" y1=\"110\" x2=\"600\" y2=\"110\" stroke=\"#ef4444\" stroke-width=\"2\"/><text x=\"34\" y=\"102\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">resistance (supply being used up)</text><line x1=\"40\" y1=\"248.5\" x2=\"40\" y2=\"305\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"253.5\" width=\"12\" height=\"46.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"56\" y1=\"202\" x2=\"56\" y2=\"265.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"207\" width=\"12\" height=\"53.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"72\" y1=\"155.5\" x2=\"72\" y2=\"219\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"66\" y=\"160.5\" width=\"12\" height=\"53.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"88\" y1=\"109\" x2=\"88\" y2=\"172.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"82\" y=\"114\" width=\"12\" height=\"53.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"107\" x2=\"104\" y2=\"156.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"98\" y=\"112\" width=\"12\" height=\"39.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"120\" y1=\"140.6\" x2=\"120\" y2=\"196\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"114\" y=\"145.6\" width=\"12\" height=\"45.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"136\" y1=\"180.1\" x2=\"136\" y2=\"235.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"185.1\" width=\"12\" height=\"45.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"219.6\" x2=\"152\" y2=\"275\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"146\" y=\"224.6\" width=\"12\" height=\"45.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"168\" y1=\"225.8\" x2=\"168\" y2=\"275\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"162\" y=\"230.8\" width=\"12\" height=\"39.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"184\" y1=\"186.5\" x2=\"184\" y2=\"241.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"191.5\" width=\"12\" height=\"45.1\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"200\" y1=\"147.2\" x2=\"200\" y2=\"202.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"194\" y=\"152.2\" width=\"12\" height=\"45.1\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"216\" y1=\"108\" x2=\"216\" y2=\"163.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"210\" y=\"113\" width=\"12\" height=\"45.1\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"232\" y1=\"108\" x2=\"232\" y2=\"150.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"113\" width=\"12\" height=\"32.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"248\" y1=\"135.5\" x2=\"248\" y2=\"182.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"242\" y=\"140.5\" width=\"12\" height=\"37.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"167.8\" x2=\"264\" y2=\"215\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"258\" y=\"172.8\" width=\"12\" height=\"37.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"280\" y1=\"172.7\" x2=\"280\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"274\" y=\"177.7\" width=\"12\" height=\"32.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"296\" y1=\"140.3\" x2=\"296\" y2=\"187.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"290\" y=\"145.3\" width=\"12\" height=\"37.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"312\" y1=\"108\" x2=\"312\" y2=\"155.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"306\" y=\"113\" width=\"12\" height=\"37.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"328\" y1=\"108\" x2=\"328\" y2=\"144\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"322\" y=\"113\" width=\"12\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"344\" y1=\"130.1\" x2=\"344\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"338\" y=\"135.1\" width=\"12\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"360\" y1=\"135.5\" x2=\"360\" y2=\"170\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"354\" y=\"140.5\" width=\"12\" height=\"24.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"111\" x2=\"376\" y2=\"149.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"370\" y=\"116\" width=\"12\" height=\"28.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"392\" y1=\"112\" x2=\"392\" y2=\"132\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"386\" y=\"117\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"408\" y1=\"112\" x2=\"408\" y2=\"132\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"402\" y=\"117\" width=\"12\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"112\" x2=\"424\" y2=\"132\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"418\" y=\"118\" width=\"12\" height=\"7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"440\" y1=\"112\" x2=\"440\" y2=\"132\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"118\" width=\"12\" height=\"6.5\" fill=\"#ef4444\" rx=\"1\"/><ellipse cx=\"416\" cy=\"122\" rx=\"40\" ry=\"22\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><line x1=\"456\" y1=\"80\" x2=\"456\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"450\" y=\"85\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"472\" y1=\"45\" x2=\"472\" y2=\"90\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"466\" y=\"50\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"488\" y1=\"25\" x2=\"488\" y2=\"55\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"482\" y=\"30\" width=\"12\" height=\"20\" fill=\"#22c55e\" rx=\"1\"/><text x=\"150\" y=\"285\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">1st drop: large</text><text x=\"275\" y=\"225\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">2nd: smaller</text><text x=\"318\" y=\"190\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">3rd: smaller</text><text x=\"420\" y=\"160\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">basing under the line</text><text x=\"420\" y=\"176\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">= no more sellers: buy the break</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Each chop removes mass from the tree; the level is about to fall.</text></svg>",
        "caption": "Consumed-level breakout: each visit to resistance produces a smaller drop as sell orders are filled; when price bases right under the line, buy the break."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Down-trend line break, target = origin of the trend</text><line x1=\"40\" y1=\"65\" x2=\"40\" y2=\"85\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"70\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"58\" y1=\"65\" x2=\"58\" y2=\"100\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"52\" y=\"70\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"76\" y1=\"90\" x2=\"76\" y2=\"125\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"95\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"107\" x2=\"94\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"112\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"112\" y1=\"107\" x2=\"112\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"106\" y=\"112\" width=\"12\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"130\" y1=\"135\" x2=\"130\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"124\" y=\"140\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"148\" y1=\"145\" x2=\"148\" y2=\"170\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"142\" y=\"150\" width=\"12\" height=\"15\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"166\" y1=\"145\" x2=\"166\" y2=\"185\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"150\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"184\" y1=\"175\" x2=\"184\" y2=\"210\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"180\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"202\" y1=\"190\" x2=\"202\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"196\" y=\"195\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"220\" y1=\"190\" x2=\"220\" y2=\"230\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"214\" y=\"195\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"220\" x2=\"238\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"225\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"256\" y1=\"235\" x2=\"256\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"250\" y=\"240\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"274\" y1=\"235\" x2=\"274\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"268\" y=\"240\" width=\"12\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"292\" y1=\"250\" x2=\"292\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"286\" y=\"255\" width=\"12\" height=\"7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"40\" y1=\"62\" x2=\"380\" y2=\"282\" stroke=\"#a78bfa\" stroke-width=\"2\"/><text x=\"160\" y=\"112\" fill=\"#a78bfa\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">down-trend line</text><line x1=\"310\" y1=\"217\" x2=\"310\" y2=\"260\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"304\" y=\"222\" width=\"12\" height=\"33\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"328\" y1=\"195\" x2=\"328\" y2=\"227\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"322\" y=\"200\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"346\" y1=\"170\" x2=\"346\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"340\" y=\"175\" width=\"12\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"364\" y1=\"170\" x2=\"364\" y2=\"191\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"358\" y=\"175\" width=\"12\" height=\"11\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"382\" y1=\"145\" x2=\"382\" y2=\"191\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"150\" width=\"12\" height=\"36\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"400\" y1=\"115\" x2=\"400\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"394\" y=\"120\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"418\" y1=\"91\" x2=\"418\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"412\" y=\"96\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"436\" y1=\"67\" x2=\"436\" y2=\"101\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"430\" y=\"72\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"454\" y1=\"50\" x2=\"454\" y2=\"77\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"448\" y=\"55\" width=\"12\" height=\"17\" fill=\"#22c55e\" rx=\"1\"/><ellipse cx=\"328\" cy=\"235\" rx=\"22\" ry=\"32\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"250\" y=\"300\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">break above the line = BUY</text><line x1=\"40\" y1=\"70\" x2=\"560\" y2=\"70\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"74\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">TARGET</text><text x=\"44\" y=\"60\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">origin of the decline</text><line x1=\"280\" y1=\"275\" x2=\"560\" y2=\"275\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"279\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text></svg>",
        "caption": "Trend-line break: draw the line through two lower highs, buy the first candle that breaks above it, and target the origin of the decline."
      }
    ],
    "diagrams": [
      { "key": "trendline", "caption": "Two-point trend line; enter on the break, target the origin of the trend." }
    ],
    "checklist": [
      "Have the reactions from the level been shrinking with each visit?",
      "Is price now basing at the level instead of rejecting from it?",
      "Does my trend line have at least two points?",
      "Is the origin of the trend far enough away to justify the trade?",
      "Is the stop and position size set before entry?"
    ],
    "journalTags": ["breakout", "consumed-level", "trendline-break", "target-trend-origin", "eurusd"],
    "newVsPdfs": [
      "New: a 'consumed level' breakout setup (shrinking reactions, then basing at the level, then buy the break). Kevin's breakout entry is a buy above a supply zone after confirmation at an HTF zone, not this exhaustion pattern.",
      "Differs: Kevin uses a trendline break as confirmation at a zone and stresses full-candle closes; Seiden trades the trend-line break itself as the entry.",
      "New: target = origin of the whole trend after a trend-line break."
    ]
  },
  {
    "n": 87,
    "title": "Trading and Time Part II",
    "kind": "article",
    "summary": "After a London class in the week of 5/19/08 where the class shorted all week, Seiden returns to the question of time at a level. A pivot (price could not stay at the level) shows a large imbalance and is a stronger level than a cluster of sideways trading, where supply and demand were only mildly out of balance. There is a hierarchy of levels, and the greater the imbalance the greater the opportunity.",
    "sections": [
      {
        "heading": "Context",
        "points": [
          "The London class traded only the short side because the supply and demand picture said global equities would fall.",
          "He also flags a coming US dollar rally; to short EUR against USD, wait for a short-term rally against the dollar first."
        ]
      },
      {
        "heading": "Pivot versus cluster",
        "points": [
          "Trading comes down to catching reversals or trading with the trend; for reversals, success depends on your definition of support and resistance.",
          "Ask why price cannot stay at a level. A series of pivot lows with no basing means demand and supply are so out of balance that price cannot remain there: a very strong demand level.",
          "A cluster is a level where price stayed a long time; that means supply and demand were not far out of balance, so the level is weaker.",
          "A cluster can still work as support or resistance, but pivot areas are, by definition, stronger most of the time."
        ]
      },
      {
        "heading": "Chart (p88): E-mini S&P 60-min (Jun08), pivot A versus cluster B",
        "points": [
          "@ES 60-min from 4/21 to 5/30/2008, price range about 1,370-1,440.",
          "Area A: two lines at about 1,371 and 1,375 under a series of pivot lows on 4/22-4/24, where price kept spiking down and leaving at once.",
          "Price rallies to about 1,440 by 5/19, then falls. Area B: a box at about 1,392-1,398 around 5/22, a cluster of sideways candles before a further drop.",
          "Area C (oval, 5/23-5/27): the first pullback into demand A around 1,373-1,378; this is the low-risk buy.",
          "Area D (circle, 5/29): price rallies from C straight through cluster B, showing B held little supply. Last price about 1,397.50."
        ]
      }
    ],
    "rules": [
      "Rank levels: pivots (price could not stay) above clusters (price stayed a long time).",
      "Buy the first pullback into a pivot-low demand area.",
      "Expect a cluster level to give way easily, especially after a strong move into it."
    ],
    "mistakes": [
      "Treating every sideways cluster as strong support or resistance.",
      "Fading a strong move at a weak cluster level."
    ],
    "quotes": [
      "The greater the supply and demand imbalance, the greater the opportunity.",
      "Price just rallies right through it like a hot knife through butter."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p088-003.jpg",
        "caption": "E-mini S&P 60-min (Jun08): A = pivot-low demand at about 1,371-1,375 where price spiked down and left immediately; B = cluster box at about 1,392-1,398 where price lingered. C (oval) is the first pullback into A, the buy; D shows the rally slicing straight through cluster B.",
        "notes": [
          "Pivot (price could not stay) beats cluster (price stayed): A held, B gave way.",
          "The buy is the first return to A, with the stop under the lower line.",
          "A cluster is a weak obstacle for the move out of a strong pivot."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"28\" y=\"285\" width=\"532\" height=\"17\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"554\" y=\"297.5\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">A pivot lows</text><rect x=\"262\" y=\"146\" width=\"298\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"554\" y=\"162\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">B cluster</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Pivot A (strong) vs cluster B (weak)</text><line x1=\"30\" y1=\"195\" x2=\"30\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"200\" width=\"12\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"235\" x2=\"46\" y2=\"300\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"240\" width=\"12\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"245\" x2=\"62\" y2=\"295\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"250\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"78\" y1=\"245\" x2=\"78\" y2=\"298\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"250\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"235\" x2=\"94\" y2=\"285\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"240\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"206.7\" x2=\"110\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"211.7\" width=\"12\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"178.3\" x2=\"126\" y2=\"220.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"183.3\" width=\"12\" height=\"32.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"150\" x2=\"142\" y2=\"192.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"155\" width=\"12\" height=\"32.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"121.7\" x2=\"158\" y2=\"164.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"126.7\" width=\"12\" height=\"32.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"93.3\" x2=\"174\" y2=\"135.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"98.3\" width=\"12\" height=\"32.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"65\" x2=\"190\" y2=\"107.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"70\" width=\"12\" height=\"32.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"65\" x2=\"206\" y2=\"95\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"70\" width=\"12\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"82\" x2=\"222\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"87\" width=\"12\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"102\" x2=\"238\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"107\" width=\"12\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"122\" x2=\"254\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"127\" width=\"12\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"147\" x2=\"270\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"152\" width=\"12\" height=\"12\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"286\" y1=\"147\" x2=\"286\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"152\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"302\" y1=\"147\" x2=\"302\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"153.2\" width=\"12\" height=\"8.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"147\" x2=\"318\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"153.2\" width=\"12\" height=\"7.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"147\" x2=\"334\" y2=\"169\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"154.4\" width=\"12\" height=\"6.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"350\" y1=\"147\" x2=\"350\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"155\" width=\"12\" height=\"7.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"366\" y1=\"155\" x2=\"366\" y2=\"189\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"160\" width=\"12\" height=\"24\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"382\" y1=\"175.4\" x2=\"382\" y2=\"213\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"180.4\" width=\"12\" height=\"27.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"398\" y1=\"199.4\" x2=\"398\" y2=\"237\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"392\" y=\"204.4\" width=\"12\" height=\"27.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"414\" y1=\"223.4\" x2=\"414\" y2=\"261\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"408\" y=\"228.4\" width=\"12\" height=\"27.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"430\" y1=\"247.4\" x2=\"430\" y2=\"285\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"424\" y=\"252.4\" width=\"12\" height=\"27.6\" fill=\"#ef4444\" rx=\"1\"/><text x=\"416\" y=\"320\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">C: first return to A = buy</text><line x1=\"446\" y1=\"245\" x2=\"446\" y2=\"287\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"440\" y=\"250\" width=\"12\" height=\"32\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"462\" y1=\"210\" x2=\"462\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"456\" y=\"215\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"478\" y1=\"170\" x2=\"478\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"472\" y=\"175\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"494\" y1=\"135\" x2=\"494\" y2=\"180\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"488\" y=\"140\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"510\" y1=\"113\" x2=\"510\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"504\" y=\"118\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><text x=\"456\" y=\"108\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">D: through B like butter</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Price could not stay at A; it stayed a long time at B. The greater the imbalance, the better the level.</text></svg>",
        "caption": "Pivot versus cluster: price could not stay at pivot A (big imbalance, strong level), but lingered at cluster B (mild imbalance). The rally from A slices straight through B."
      }
    ],
    "diagrams": [
      { "key": "quality", "caption": "Pivot (price could not stay) is a stronger level than a long sideways cluster." }
    ],
    "checklist": [
      "Is my level a pivot where price left quickly, or a cluster where price lingered?",
      "Is this the first pullback into the level?",
      "If it is a cluster, have I lowered my expectations or skipped it?"
    ],
    "journalTags": ["pivot-vs-cluster", "level-hierarchy", "first-pullback", "es-futures"],
    "newVsPdfs": [
      "Similar direction to Kevin's preference for short bases (few basing candles), but Seiden states an explicit 'cluster = weaker level' hierarchy that Kevin's lessons do not."
    ]
  },
  {
    "n": 89,
    "title": "Three Simple Principles",
    "kind": "article",
    "summary": "Seiden sets out the three principles behind his whole method: price in a free market is a function of supply and demand; all influences on price are reflected in price; and price moves when one of the two competing forces becomes zero at a price. An earthquake analogy and a worked 300-buyers/200-sellers example show that apparent balance is often an imbalance that just needs time to play out.",
    "sections": [
      {
        "heading": "Earthquake analogy",
        "points": [
          "A former earthquake scientist asked for help; Seiden told him he already had the tools.",
          "Two plates press against each other until a threshold is reached and one overwhelms the other. Buyers and sellers are quantified the same way."
        ]
      },
      {
        "heading": "Principle 1: price is a function of supply and demand",
        "points": [
          "A market is buyers, sellers and a 'widget' (stock, futures, currency, bond).",
          "A market is always in one of three states: demand exceeds supply (competition to buy, rising prices; a pivot low on the chart), supply exceeds demand (pivot high), or equilibrium.",
          "At equilibrium there is no competition; moving away from it creates competition that pushes price back. Most candles are at equilibrium, but that is not where you want to trade."
        ]
      },
      {
        "heading": "Principle 2: all influences are reflected in price",
        "points": [
          "News, earnings, analyst opinion and events create different perceptions depending on each person's belief system; people wrongly assume others think like them.",
          "Beliefs lead to action (buying or selling), and every action happens at a price, so price is all you need. Adding other information distorts your view."
        ]
      },
      {
        "heading": "Principle 3: motion starts when one force reaches zero",
        "points": [
          "Example: 300 buyers and 200 sellers at $20.50. Price looks stable until the 200th seller sells; then 100 buyers remain with no sellers and price must rise.",
          "What looked like equilibrium was an imbalance that took time to play out."
        ]
      },
      {
        "heading": "Diagram (p92): two competing forces at $20.50",
        "points": [
          "Hand-drawn candles: two red candles falling from about $22.00, a dip to $20.50, then green candles rising back to about $22.00+, a small pullback and another rise.",
          "Under the lows the table reads Sellers 200, 100, 0 and Buyers 300, 200, 100. The circled column (0 sellers, 100 buyers) with an arrow marks the exact candle where the rally begins.",
          "Labelled '2 Competing Forces'. Price levels marked $22.00, $21.00 and $20.50."
        ]
      }
    ],
    "rules": [
      "Base every decision on price; filter out opinion and news.",
      "Look for the price where one side is exhausted (the origin of motion).",
      "Do not trade at equilibrium; trade the pivots where imbalance is obvious."
    ],
    "mistakes": [
      "Assuming others share your beliefs about news.",
      "Adding outside information that distorts the supply/demand picture.",
      "Mistaking sideways 'balance' for a lack of opportunity."
    ],
    "quotes": [
      "Any and all influences on price are reflected in price.",
      "It just took a certain amount of time for this unbalanced equation to play out."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p092-004.jpg",
        "caption": "Hand-drawn diagram '2 Competing Forces': red candles fall from $22.00 to $20.50, then green candles rise back above $22.00. Under the low: Sellers 200, 100, 0 and Buyers 300, 200, 100; the circled column (0 sellers, 100 buyers) marks the candle where the rally starts.",
        "notes": [
          "Apparent balance at $20.50 was an imbalance (more buyers than sellers) that needed time to play out.",
          "Motion starts the moment one side reaches zero.",
          "This is what every demand zone is: a price where buyers outnumber sellers."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Motion starts when one side reaches zero</text><line x1=\"40\" y1=\"80\" x2=\"600\" y2=\"80\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\"/><text x=\"600\" y=\"75\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\" font-weight=\"400\">$22.00</text><line x1=\"40\" y1=\"210\" x2=\"600\" y2=\"210\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"3 4\"/><text x=\"600\" y=\"205\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\" font-weight=\"400\">$20.50</text><line x1=\"80\" y1=\"85\" x2=\"80\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"71\" y=\"90\" width=\"18\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"120\" y1=\"115\" x2=\"120\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"111\" y=\"120\" width=\"18\" height=\"45\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"160\" y1=\"155\" x2=\"160\" y2=\"200\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"151\" y=\"160\" width=\"18\" height=\"35\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"200\" y1=\"185\" x2=\"200\" y2=\"216\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"191\" y=\"190\" width=\"18\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"240\" y1=\"195\" x2=\"240\" y2=\"216\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"231\" y=\"205\" width=\"18\" height=\"7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"280\" y1=\"165\" x2=\"280\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"271\" y=\"170\" width=\"18\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"320\" y1=\"115\" x2=\"320\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"311\" y=\"120\" width=\"18\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"360\" y1=\"80\" x2=\"360\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"351\" y=\"85\" width=\"18\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"400\" y1=\"55\" x2=\"400\" y2=\"90\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"391\" y=\"60\" width=\"18\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><text x=\"200\" y=\"250\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">200</text><text x=\"200\" y=\"272\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">300</text><text x=\"240\" y=\"250\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">100</text><text x=\"240\" y=\"272\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">200</text><text x=\"280\" y=\"250\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">0</text><text x=\"280\" y=\"272\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">100</text><text x=\"150\" y=\"250\" fill=\"#ef4444\" font-size=\"13\" text-anchor=\"end\" font-weight=\"600\">Sellers</text><text x=\"150\" y=\"272\" fill=\"#22c55e\" font-size=\"13\" text-anchor=\"end\" font-weight=\"600\">Buyers</text><ellipse cx=\"280\" cy=\"262\" rx=\"22\" ry=\"24\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><line x1=\"280\" y1=\"320\" x2=\"280\" y2=\"292\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"280,292 283.5,299.2 276.5,299.2\" fill=\"#f59e0b\"/><text x=\"296\" y=\"325\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">last seller filled: 100 buyers left, price must rise</text></svg>",
        "caption": "Two competing forces: at $20.50 there are more buyers than sellers. Price looks stable until the last seller is filled (sellers = 0), then the remaining buyers must pay up."
      }
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Three principles: S/D drives price, price reflects everything, motion starts when one side hits zero." }
    ],
    "checklist": [
      "Is price at a pivot (imbalance) rather than at equilibrium?",
      "Am I making this decision from price alone, not from news or opinion?",
      "Can I see where one side was exhausted?"
    ],
    "journalTags": ["three-principles", "equilibrium", "imbalance", "price-only"],
    "newVsPdfs": [
      "New framing: the three principles, the 'one side becomes zero' idea and the earthquake analogy are not in Kevin's course.",
      "Kevin's lessons do not discuss equilibrium as a market state."
    ]
  },
  {
    "n": 93,
    "title": "The Morning Gap, Part 3",
    "kind": "article",
    "summary": "Now the XLT instructor for futures and forex, Seiden compares a non-quality support level (a sideways range in the middle of a move) with a quality one (a pivot low that price exploded away from). The S&P gapped straight through the non-quality range but later gapped down into the quality pivot low, which was a buy from novice sellers, with targets at the gap origin and the nearest pivot high.",
    "sections": [
      {
        "heading": "Quality versus non-quality support",
        "points": [
          "'Support' means different things to different people (Fibonacci, moving averages, pivots, clusters).",
          "A sideways range preceded by a rally and followed by a rally sits in the middle of a move; it is not a quality level and price often slices through it.",
          "A pivot low that price explodes away from shows demand greatly exceeds supply: that is quality."
        ]
      },
      {
        "heading": "Who is selling the gap down?",
        "points": [
          "Someone said buying a gap down was high risk. Seiden asks who is selling: a seller AFTER a decline and INTO a level where demand exceeds supply is a novice.",
          "The laws of supply and demand ensure that trader loses over time, so be the buyer. If wrong, the loss is small because risk is low."
        ]
      },
      {
        "heading": "Position note",
        "points": [
          "Long dollar, short GBP and EUR position trades were working, but it was no longer the time to enter: the dollar was nearing supply and GBP/EUR nearing demand."
        ]
      },
      {
        "heading": "Chart (p94): E-mini S&P 15-min, non-quality A versus quality C",
        "points": [
          "@ES 15-min from 8/8 to 8/14, price about 1,265-1,312.",
          "A (non-quality, circled, 8/8): a small sideways range at about 1,281-1,285 after a strong rally from about 1,265 and before a further rally to about 1,310 on 8/11. Two lines extend right.",
          "B (arrow, 8/13 open): price opens right into A and falls straight through it.",
          "C (quality, circled, 8/13): a pivot low at about 1,275-1,279 that price explodes away from to about 1,293.",
          "D (8/14, arrow): price gaps down into C (lines about 1,275 and 1,279): the buy. Two short red lines mark the targets: the gap origin at about 1,284 and the nearest pivot high at about 1,293. Price then rallies to about 1,299.75."
        ]
      }
    ],
    "rules": [
      "Reject ranges that sit in the middle of a move (rally-range-rally) as buy levels.",
      "Prefer pivot lows that price explodes away from.",
      "Gap down into quality demand: buy; target 1 = origin of the gap, target 2 = nearest pivot high.",
      "Always ask who is on the other side of the trade."
    ],
    "mistakes": [
      "Buying a gap into a non-quality, mid-move range.",
      "Selling after a decline into demand (novice action).",
      "Calling a gap-down buy 'high risk' without looking at who is selling."
    ],
    "quotes": [
      "Who is selling on that gap down?",
      "A consistently profitable trader would never do that."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p094-005.jpg",
        "caption": "E-mini S&P 15-min (8/8-8/14): A (non-quality) is a sideways range at about 1,281-1,285 in the middle of a rally; B shows price falling straight through it. C (quality) is a pivot low at about 1,275-1,279 that price exploded from. D: the 8/14 gap down into C is the buy; red lines mark targets at the gap origin (about 1,284) and the nearest pivot high (about 1,293).",
        "notes": [
          "A mid-move sideways range is not quality support; price sliced through it.",
          "Quality = a pivot price left explosively.",
          "Gap down into quality demand after a decline: the seller is the novice, be the buyer.",
          "Target 1 is the gap origin, target 2 the nearest pivot high."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"86\" y=\"212\" width=\"474\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"360\" y=\"258\" width=\"200\" height=\"26\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Mid-move range A vs explosive pivot C</text><line x1=\"30\" y1=\"292.5\" x2=\"30\" y2=\"325\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"297.5\" width=\"12\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"270\" x2=\"46\" y2=\"305.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"275\" width=\"12\" height=\"25.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"247.5\" x2=\"62\" y2=\"283.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"252.5\" width=\"12\" height=\"25.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"78\" y1=\"225\" x2=\"78\" y2=\"260.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"230\" width=\"12\" height=\"25.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"94\" y1=\"212\" x2=\"94\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"217\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"212\" x2=\"110\" y2=\"232\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"217\" width=\"12\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"212\" x2=\"126\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"218\" width=\"12\" height=\"7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"212\" x2=\"142\" y2=\"232\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"218\" width=\"12\" height=\"6.5\" fill=\"#ef4444\" rx=\"1\"/><text x=\"86\" y=\"250\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">A: non-quality (mid-move range)</text><line x1=\"158\" y1=\"185\" x2=\"158\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"190\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"155\" x2=\"174\" y2=\"199.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"160\" width=\"12\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"125\" x2=\"190\" y2=\"169.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"130\" width=\"12\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"95\" x2=\"206\" y2=\"139.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"100\" width=\"12\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"65\" x2=\"222\" y2=\"109.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"70\" width=\"12\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"65\" x2=\"238\" y2=\"100.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"70\" width=\"12\" height=\"25.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"86.5\" x2=\"254\" y2=\"125.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"91.5\" width=\"12\" height=\"29.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"111.9\" x2=\"270\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"116.9\" width=\"12\" height=\"29.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"286\" y1=\"137.2\" x2=\"286\" y2=\"176.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"142.2\" width=\"12\" height=\"29.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"302\" y1=\"162.5\" x2=\"302\" y2=\"201.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"167.5\" width=\"12\" height=\"29.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"318\" y1=\"187.9\" x2=\"318\" y2=\"227\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"192.9\" width=\"12\" height=\"29.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"217\" x2=\"334\" y2=\"247\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"222\" width=\"12\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"350\" y1=\"234\" x2=\"350\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"239\" width=\"12\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><text x=\"346\" y=\"300\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"end\" font-weight=\"400\">B: slices through A</text><line x1=\"366\" y1=\"258\" x2=\"366\" y2=\"282\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"262\" width=\"12\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"382\" y1=\"245\" x2=\"382\" y2=\"277\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"250\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><text x=\"564\" y=\"275\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">C: quality</text><line x1=\"398\" y1=\"211.7\" x2=\"398\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"392\" y=\"216.7\" width=\"12\" height=\"33.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"414\" y1=\"178.3\" x2=\"414\" y2=\"226.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"408\" y=\"183.3\" width=\"12\" height=\"38.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"430\" y1=\"145\" x2=\"430\" y2=\"193.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"424\" y=\"150\" width=\"12\" height=\"38.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"446\" y1=\"145\" x2=\"446\" y2=\"180\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"440\" y=\"150\" width=\"12\" height=\"25\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"470\" y1=\"246\" x2=\"470\" y2=\"278\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"464\" y=\"250\" width=\"12\" height=\"18\" fill=\"#ef4444\" rx=\"1\"/><text x=\"422\" y=\"318\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">D: gap down into C = BUY</text><line x1=\"486\" y1=\"210\" x2=\"486\" y2=\"271\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"480\" y=\"215\" width=\"12\" height=\"51\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"502\" y1=\"173\" x2=\"502\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"496\" y=\"178\" width=\"12\" height=\"37\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"518\" y1=\"147\" x2=\"518\" y2=\"183\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"512\" y=\"152\" width=\"12\" height=\"26\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"446\" y1=\"178\" x2=\"560\" y2=\"178\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"182\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T1 gap origin</text><line x1=\"402\" y1=\"150\" x2=\"560\" y2=\"150\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"154\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T2 pivot high</text></svg>",
        "caption": "Non-quality vs quality support: a sideways range in the middle of a rally (A) gets sliced; a pivot low that price exploded from (C) holds. A gap down into C is the buy, targeting the gap origin and the nearest pivot high."
      }
    ],
    "diagrams": [
      { "key": "quality", "caption": "Mid-move range (non-quality) versus pivot low with explosive departure (quality)." }
    ],
    "checklist": [
      "Is the level a pivot with an explosive departure, not a mid-move range?",
      "Is the gap taking price INTO demand after a decline?",
      "Are targets set at the gap origin and the nearest pivot high?",
      "Is the risk small?"
    ],
    "journalTags": ["morning-gap", "quality-level", "mid-move-range", "gap-target", "novice-seller"],
    "newVsPdfs": [
      "Differs: Kevin treats mid-move (RBR/DBD) zones as tradable continuation zones; Seiden rejects this particular mid-move range as non-quality because it was a sideways cluster, not an explosive pivot.",
      "New: gap-trade targets (gap origin, then nearest pivot high); Kevin does not trade gaps."
    ]
  },
  {
    "n": 95,
    "title": "Keeping it Simple in XLT",
    "kind": "article",
    "summary": "New XLT students look at too many things; Seiden strips it back to one idea: focus on price levels price cannot go to or stay at. The S&P 1263-1264 demand was special because price only briefly touched 1262.50 and left, and the revisit a week later was a low-risk buy toward 1270+ from novice sellers.",
    "sections": [
      {
        "heading": "What makes a level special",
        "points": [
          "A level is important because of what did NOT happen there: price could not go to or past it.",
          "Price did trade to 1262.50 once, but moved higher quickly, which only happens where demand exceeds supply."
        ]
      },
      {
        "heading": "Two thoughts to focus on",
        "points": [
          "1) Focus on price levels price can't go to or stay at.",
          "2) Understand why: think of order flow, buyers and sellers, not red and green candles.",
          "At the revisit, ask who is on the other side. Only a novice sells after a decline and into demand; be the buyer to that seller."
        ]
      },
      {
        "heading": "Chart (p96): E-mini S&P 30-min, 1263-1264 demand",
        "points": [
          "@ES 30-min from 8/18 to 8/29, price about 1,262-1,300.",
          "A (shaded oval, 8/19-8/21): after a decline from about 1,300 price repeatedly dips to the 1,263-1,264 band and is pushed back up; two lines at about 1,262 and 1,265.",
          "Price rallies to about 1,293 by 8/22, then falls again.",
          "B (shaded oval, 8/26-8/27): the revisit of the same band; this is the buy. Price then rallies to about 1,298 by 8/29. XLT traders targeted 1,270 and higher."
        ]
      }
    ],
    "rules": [
      "Draw demand where price could not go to or stay at.",
      "Buy the revisit of that demand; first target about 1270 in the example, higher if available.",
      "Ask 'who is on the other side of my trade?' at every entry."
    ],
    "mistakes": [
      "Processing too much information and too many tools.",
      "Reading candles as colours instead of order flow.",
      "Selling after a decline into demand."
    ],
    "quotes": [
      "Focus on price levels where price can't go to or stay at.",
      "Who is on the other side of your trade?"
    ],
    "images": [
      {
        "src": "/lessons/seiden/p096-006.jpg",
        "caption": "E-mini S&P 30-min (8/18-8/29): oval A shows price repeatedly dipping into the 1,262-1,265 band (lines at about 1,262 and 1,265) and leaving. Price rallies to about 1,293, falls back, and oval B marks the revisit of the same band, the buy, before a rally to about 1,298.",
        "notes": [
          "The level matters because price could not stay there: it touched 1,262.50 and left.",
          "The revisit after a decline is a low-risk buy from novice sellers; XLT targeted 1,270 and higher.",
          "Stop goes below the lower line."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"102\" y=\"248\" width=\"438\" height=\"24\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"534\" y=\"264\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">touched and left</text><text x=\"544\" y=\"252\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"544\" y=\"276\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Focus on prices price can't go to or stay at</text><line x1=\"30\" y1=\"55\" x2=\"30\" y2=\"101\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"60\" width=\"12\" height=\"36\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"85.6\" x2=\"46\" y2=\"137\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"90.6\" width=\"12\" height=\"41.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"121.6\" x2=\"62\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"126.6\" width=\"12\" height=\"41.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"157.6\" x2=\"78\" y2=\"209\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"162.6\" width=\"12\" height=\"41.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"193.6\" x2=\"94\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"198.6\" width=\"12\" height=\"41.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"236\" x2=\"110\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"240\" width=\"12\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"233\" x2=\"126\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"238\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"232\" x2=\"142\" y2=\"268\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"240\" width=\"12\" height=\"18\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"158\" y1=\"220\" x2=\"158\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"225\" width=\"12\" height=\"33\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"197\" x2=\"174\" y2=\"230\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"202\" width=\"12\" height=\"23\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"174\" x2=\"190\" y2=\"210.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"179\" width=\"12\" height=\"26.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"151\" x2=\"206\" y2=\"187.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"156\" width=\"12\" height=\"26.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"128\" x2=\"222\" y2=\"164.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"133\" width=\"12\" height=\"26.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"105\" x2=\"238\" y2=\"141.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"110\" width=\"12\" height=\"26.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"105\" x2=\"254\" y2=\"137.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"110\" width=\"12\" height=\"22.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"124.3\" x2=\"270\" y2=\"160.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"129.3\" width=\"12\" height=\"26.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"286\" y1=\"146.9\" x2=\"286\" y2=\"183\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"151.9\" width=\"12\" height=\"26.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"302\" y1=\"169.6\" x2=\"302\" y2=\"205.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"174.6\" width=\"12\" height=\"26.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"318\" y1=\"192.3\" x2=\"318\" y2=\"228.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"197.3\" width=\"12\" height=\"26.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"214.9\" x2=\"334\" y2=\"251\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"219.9\" width=\"12\" height=\"26.1\" fill=\"#ef4444\" rx=\"1\"/><text x=\"280\" y=\"314\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">revisit = BUY</text><line x1=\"350\" y1=\"244\" x2=\"350\" y2=\"262\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"215\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"366\" y1=\"180\" x2=\"366\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"185\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"382\" y1=\"145\" x2=\"382\" y2=\"190\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"150\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"398\" y1=\"115\" x2=\"398\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"392\" y=\"120\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"330\" y1=\"292\" x2=\"540\" y2=\"292\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"544\" y=\"296\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Ask: who sells here after a decline into demand? Be the buyer to that seller.</text></svg>",
        "caption": "A level matters because of what did not happen: price touched the band and could not stay. The revisit after a decline is the low-risk buy from novice sellers."
      }
    ],
    "diagrams": [],
    "checklist": [
      "Did price fail to stay at (or get past) this level before?",
      "Is the current move into the level a decline that novices are selling into?",
      "Is there room to the first target?"
    ],
    "journalTags": ["keep-it-simple", "price-cant-stay", "revisit-entry", "es-futures"],
    "newVsPdfs": []
  },
  {
    "n": 97,
    "title": "The Bigger Picture",
    "kind": "article",
    "summary": "One-timeframe active traders are like a one-trick pony and do not make consistent profits. Larger-timeframe levels decide whether small-timeframe setups work and where trends start and end. In late 2008 the Dow, gold and crude all reached monthly demand and bounced, and Seiden ignores the news: he would not have traded any differently without it.",
    "sections": [
      {
        "heading": "Why the larger timeframe matters",
        "points": [
          "He has yet to see anyone make consistent profits using only small timeframes; small plus large timeframes is the recipe.",
          "The best 5-minute buy near larger-timeframe supply is unlikely to work; the best 15-minute sell near larger-timeframe demand is unlikely to work.",
          "Larger-timeframe trends begin and end at larger-timeframe supply and demand."
        ]
      },
      {
        "heading": "Weekly review in the XLT (three reasons)",
        "points": [
          "1) Know where trends are likely to end and begin, so you are first in line when risk/reward is ideal.",
          "2) Know which side of the market has the odds for active trades.",
          "3) Find swing and position trades (e.g. the GBPUSD short from May 2008).",
          "Look at weekly and daily charts at least once a week."
        ]
      },
      {
        "heading": "News",
        "points": [
          "The XLT does not trade the news; all influences are already in price.",
          "Chasing news on a 5-minute chart just transfers your account to someone else."
        ]
      },
      {
        "heading": "Chart 1 (p99): DIA (Dow ETF) monthly",
        "points": [
          "DIA monthly, 2004-2009. Demand zone labelled 'Demand' between about 100 and 108, drawn from the 2004-2005 base before the long rally.",
          "Price rallies to about 140 in late 2007, then falls hard through 2008.",
          "A shaded circle in late 2008 marks a long lower wick into the top of the zone near 105-108; price bounces to 113.38."
        ]
      },
      {
        "heading": "Chart 2 (p100): Gold futures monthly",
        "points": [
          "@ZG (100 oz gold) monthly, mid-2006 to 2009. Two lines at about 672 and 748 wrap the 2006-2007 base before the breakout.",
          "Gold rallies to about 1,030 in early 2008, then drops.",
          "A shaded circle at about 745-750 (around August 2008) marks the long wick into the top of the zone; price is back at 870.10."
        ]
      },
      {
        "heading": "Chart 3 (p101): Crude oil futures monthly",
        "points": [
          "@CL monthly, late 2007 to 2009. Two lines at about 87 and 96 wrap the late-2007/early-2008 base before the rally.",
          "Crude rallies to about 145 by July 2008, then falls sharply.",
          "The September 2008 candle wicks down to about 90, inside the zone, and closes near 100.96: a strong bounce from monthly demand."
        ]
      }
    ],
    "rules": [
      "Never trade from one timeframe only.",
      "Avoid small-timeframe buys near larger-timeframe supply and sells near larger-timeframe demand.",
      "Review weekly and daily (and monthly) supply and demand at least once a week.",
      "Expect larger-timeframe trends to start and end at larger-timeframe levels."
    ],
    "mistakes": [
      "Trading a single small timeframe.",
      "Taking a perfect-looking LTF setup straight into HTF opposing supply or demand.",
      "Chasing news on a 5-minute chart."
    ],
    "quotes": [
      "One time frame active traders simply can't compete.",
      "If we as traders never heard any of it, would we have traded any different? Nope."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p099-007.jpg",
        "caption": "DIA (Dow ETF) monthly, 2004-2009: demand zone between about 100 and 108 from the 2004-2005 base. After the 2007 peak near 140, the late-2008 candle wicks into the top of the zone (shaded circle) and closes back up near 113.",
        "notes": [
          "Large-timeframe trends end at large-timeframe demand.",
          "On the monthly chart a single long lower wick into the zone is the footprint of big buyers.",
          "Short-term sells into this area had poor odds regardless of the news."
        ]
      },
      {
        "src": "/lessons/seiden/p100-008.jpg",
        "caption": "Gold futures (@ZG) monthly, mid-2006 to 2009: lines at about 672 and 748 wrap the 2006-2007 base. After the rally to about 1,030, the 2008 sell-off wicks into the top line around 745-750 (shaded circle) and price recovers to 870.",
        "notes": [
          "Same lesson in a different market: the proximal line of monthly demand stopped the decline.",
          "The zone is drawn from the base before the breakout rally."
        ]
      },
      {
        "src": "/lessons/seiden/p101-009.jpg",
        "caption": "Crude oil (@CL) monthly, late 2007 to 2009: lines at about 87 and 96 wrap the late-2007/early-2008 base. After the run to about 145, the September 2008 candle wicks down to about 90 inside the zone and closes near 101.",
        "notes": [
          "Price penetrated into the zone but closed back above it: demand absorbed the selling.",
          "Check monthly and weekly levels at least once a week so you know where trends may turn."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"32\" y=\"255\" width=\"528\" height=\"37\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"554\" y=\"277.5\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">MONTHLY DEMAND</text><text x=\"564\" y=\"259\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"564\" y=\"296\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">HTF demand: where trends end and begin</text><line x1=\"40\" y1=\"256\" x2=\"40\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"33\" y=\"261\" width=\"14\" height=\"18\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"256\" x2=\"62\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55\" y=\"261\" width=\"14\" height=\"18\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"84\" y1=\"256\" x2=\"84\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77\" y=\"262.8\" width=\"14\" height=\"12.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"106\" y1=\"256\" x2=\"106\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"99\" y=\"262.8\" width=\"14\" height=\"11.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"128\" y1=\"256\" x2=\"128\" y2=\"284\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"121\" y=\"264.6\" width=\"14\" height=\"9.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"150\" y1=\"235\" x2=\"150\" y2=\"273\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"143\" y=\"240\" width=\"14\" height=\"28\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"172\" y1=\"210\" x2=\"172\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"165\" y=\"215\" width=\"14\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"194\" y1=\"195\" x2=\"194\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"187\" y=\"200\" width=\"14\" height=\"15\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"216\" y1=\"170\" x2=\"216\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"209\" y=\"175\" width=\"14\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"145\" x2=\"238\" y2=\"180\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"231\" y=\"150\" width=\"14\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"260\" y1=\"115\" x2=\"260\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"253\" y=\"120\" width=\"14\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"282\" y1=\"90\" x2=\"282\" y2=\"130\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"275\" y=\"95\" width=\"14\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"304\" y1=\"65\" x2=\"304\" y2=\"100\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"297\" y=\"70\" width=\"14\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"326\" y1=\"67\" x2=\"326\" y2=\"85\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"319\" y=\"72\" width=\"14\" height=\"8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"348\" y1=\"55\" x2=\"348\" y2=\"85\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"341\" y=\"60\" width=\"14\" height=\"20\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"370\" y1=\"57\" x2=\"370\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"363\" y=\"62\" width=\"14\" height=\"38\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"392\" y1=\"95\" x2=\"392\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"385\" y=\"100\" width=\"14\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"414\" y1=\"125\" x2=\"414\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"407\" y=\"130\" width=\"14\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"436\" y1=\"165\" x2=\"436\" y2=\"225\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"429\" y=\"170\" width=\"14\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"458\" y1=\"208\" x2=\"458\" y2=\"266\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"451\" y=\"214\" width=\"14\" height=\"18\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"480\" y1=\"191\" x2=\"480\" y2=\"219\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"473\" y=\"196\" width=\"14\" height=\"18\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"442\" y1=\"320\" x2=\"458\" y2=\"266\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"458,266 459.3,273.9 452.6,271.9\" fill=\"#f59e0b\"/><text x=\"342\" y=\"335\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">long wick into the zone, bounce</text><text x=\"20\" y=\"50\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">A 5-min sell here fights the monthly buyers; a 5-min buy has the wind behind it.</text></svg>",
        "caption": "Larger-timeframe demand decides the outcome: a monthly base, a long rally, then a hard decline that wicks into the top of the monthly zone and bounces. Small-timeframe sells there have poor odds."
      }
    ],
    "diagrams": [
      { "key": "mtf", "caption": "HTF levels decide which side has the odds for LTF trades." }
    ],
    "checklist": [
      "Have I checked weekly and daily levels this week?",
      "Is my LTF trade running into an HTF opposing level?",
      "Which side of the market does the HTF picture favour?",
      "Am I ignoring the news and trading the levels?"
    ],
    "journalTags": ["multi-timeframe", "weekly-review", "htf-demand", "ignore-news", "dow", "gold", "crude"],
    "newVsPdfs": [
      "Matches Kevin's top-down HTF approach and weekly chart update habit.",
      "Differs on news: Kevin says be aware of news and do not day-trade it; Seiden says ignore it entirely."
    ]
  },
  {
    "n": 102,
    "title": "Trading and Gambling",
    "kind": "article",
    "summary": "Trading is gambling, but the one form where you see the cards before betting and choose the size, so you can stack the odds. Seiden lists his odds enhancers for buying a pullback to demand: uptrend, 3:1 profit margin, a quality level (strong rally away, not retested, near HTF demand, pivot low well placed on the curve) and a sharp arrival. Like a casino, keep fixed rules and do not change them after losses.",
    "sections": [
      {
        "heading": "Trading as stacked-odds gambling",
        "points": [
          "Poker, trading and Pepsi buying TV time all put money at risk for an uncertain return.",
          "In trading you can decide whether to bet after seeing your cards and the dealer's, and how much to bet."
        ]
      },
      {
        "heading": "When to buy: a pullback to demand, plus odds enhancers",
        "points": [
          "1) In an uptrend.",
          "2) A profit margin of at least 3:1 (reward/risk).",
          "3) A quality demand level: a) strong rally from demand (big imbalance); b) not retested yet (greatest odds); c) near larger-timeframe demand; d) a pivot low well placed on the larger supply/demand curve.",
          "4) How price gets there: a stair-step decline into demand is a low-odds buy; a sharp drop into demand is a much higher-odds buy.",
          "Indicators and oscillators can add further enhancers.",
          "Assess the odds first, then decide how much capital to risk."
        ]
      },
      {
        "heading": "Casino discipline",
        "points": [
          "Casinos lose every day but stay profitable because they never change their rules after a loss.",
          "If you do not have a rule set that stacks the odds, do not trade; you are competing with people who do.",
          "Expect losses; the only certainty is the lack of certainty, so search for better odds, not certainty."
        ]
      },
      {
        "heading": "Charts",
        "points": ["No charts in this article; the odds-enhancer list is text only."]
      }
    ],
    "rules": [
      "Buy only pullbacks to demand.",
      "Require a profit margin of at least 3:1.",
      "Prefer levels with a strong departure, untested, near HTF demand, and low on the curve.",
      "Prefer a sharp decline into demand over a stair-step decline.",
      "Decide position size after scoring the odds.",
      "Never change the rules because of a loss."
    ],
    "mistakes": [
      "Trading without a written, odds-stacking rule set.",
      "Changing rules emotionally after losses.",
      "Searching for certainty instead of better odds."
    ],
    "quotes": [
      "The one thing that is certain is the lack of certainty.",
      "Make sure you have a set of rules that stacks the odds in your favor."
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"30\" y=\"260\" width=\"270\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"350\" y=\"260\" width=\"270\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Arrival into demand: stair-step vs sharp drop</text><line x1=\"320\" y1=\"60\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/><line x1=\"40\" y1=\"55\" x2=\"40\" y2=\"85\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"35\" y=\"60\" width=\"10\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"55\" y1=\"73\" x2=\"55\" y2=\"87\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"78\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"70\" y1=\"73\" x2=\"70\" y2=\"110\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"65\" y=\"78\" width=\"10\" height=\"27\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"85\" y1=\"97\" x2=\"85\" y2=\"111\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"80\" y=\"102\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"100\" y1=\"97\" x2=\"100\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"95\" y=\"102\" width=\"10\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"115\" y1=\"123\" x2=\"115\" y2=\"137\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"110\" y=\"128\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"123\" x2=\"130\" y2=\"161\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"125\" y=\"128\" width=\"10\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"145\" y1=\"149\" x2=\"145\" y2=\"163\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"140\" y=\"154\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"160\" y1=\"149\" x2=\"160\" y2=\"187\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"155\" y=\"154\" width=\"10\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"175\" y1=\"175\" x2=\"175\" y2=\"189\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"170\" y=\"180\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"175\" x2=\"190\" y2=\"213\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"185\" y=\"180\" width=\"10\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"205\" y1=\"201\" x2=\"205\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"206\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"220\" y1=\"201\" x2=\"220\" y2=\"239\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"215\" y=\"206\" width=\"10\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"235\" y1=\"227\" x2=\"235\" y2=\"241\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"230\" y=\"232\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"250\" y1=\"227\" x2=\"250\" y2=\"263\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"245\" y=\"232\" width=\"10\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"265\" y1=\"235\" x2=\"265\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260\" y=\"240\" width=\"10\" height=\"18\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"280\" y1=\"225\" x2=\"280\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"275\" y=\"230\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><text x=\"40\" y=\"320\" fill=\"#ef4444\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">stair-step arrival: LOW odds</text><line x1=\"360\" y1=\"55\" x2=\"360\" y2=\"75\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"355\" y=\"60\" width=\"10\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"375\" y1=\"61\" x2=\"375\" y2=\"75\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"370\" y=\"66\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"390\" y1=\"61\" x2=\"390\" y2=\"80\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"385\" y=\"66\" width=\"10\" height=\"9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"405\" y1=\"70\" x2=\"405\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"400\" y=\"75\" width=\"10\" height=\"65\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"420\" y1=\"135\" x2=\"420\" y2=\"210\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"415\" y=\"140\" width=\"10\" height=\"65\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"435\" y1=\"200\" x2=\"435\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"430\" y=\"205\" width=\"10\" height=\"57\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"450\" y1=\"215\" x2=\"450\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"445\" y=\"220\" width=\"10\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"465\" y1=\"165\" x2=\"465\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460\" y=\"170\" width=\"10\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"480\" y1=\"115\" x2=\"480\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"475\" y=\"120\" width=\"10\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"495\" y1=\"80\" x2=\"495\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"490\" y=\"85\" width=\"10\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><text x=\"360\" y=\"320\" fill=\"#22c55e\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">sharp drop: HIGHER odds</text><text x=\"20\" y=\"50\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">+ uptrend, 3:1 margin, strong departure, untested, near HTF demand, low on the curve</text></svg>",
        "caption": "How price arrives matters: a stair-step decline into demand (many small legs and bases) is a low-odds buy; a sharp drop of big red candles into fresh demand is a higher-odds buy."
      }
    ],
    "diagrams": [
      { "key": "qualify", "caption": "Odds enhancers: trend, 3:1 margin, strong departure, freshness, HTF and curve location, arrival." },
      { "key": "low-odds", "caption": "Stair-step decline into demand = low odds; sharp drop = higher odds." }
    ],
    "checklist": [
      "Is the higher trend up?",
      "Is reward at least 3x risk?",
      "Was the departure from demand strong?",
      "Is the level untested?",
      "Is it near HTF demand and low on the curve?",
      "Did price arrive with a sharp drop rather than a stair-step?",
      "Have I sized the trade after scoring these?"
    ],
    "journalTags": ["odds-enhancers", "profit-margin-3to1", "freshness", "arrival-type", "casino-mindset"],
    "newVsPdfs": [
      "Mostly matches Kevin's zone qualifiers (trend, R:R, strong departure, fresh, HTF alignment, curve).",
      "Differs: 'stair-step' in Kevin's course describes the basing; Seiden applies it to the arrival leg into the zone (stair-step arrival = low odds)."
    ]
  },
  {
    "n": 104,
    "title": "Trends, Gaps, and Probabilities",
    "kind": "article",
    "summary": "Seiden gives part of the XLT gap checklist, crossing the trend with gap direction. In a downtrend a gap up into supply is the highest-probability short; in an uptrend a gap down into demand is the highest-probability long. The deciding factor is who is making the biggest mistake.",
    "sections": [
      {
        "heading": "Downtrend",
        "points": [
          "Gap up into objective supply: likely the highest-probability trade. Only a novice buys a gap up into supply in a downtrend; sell to them. This gap usually fills very quickly.",
          "Gap down into objective demand: a lower-probability buy in a downtrend. The gap almost always fills, but usually takes longer."
        ]
      },
      {
        "heading": "Uptrend",
        "points": [
          "Gap up into supply: consider a short only if risk is low and the target high; not one of the best trades because it is against the trend. It usually fills within the day or soon after.",
          "Gap down into demand: likely the highest-probability trade; only a novice sells a gap down into demand in an uptrend. Usually fills very quickly."
        ]
      },
      {
        "heading": "Key idea",
        "points": [
          "The best gap trade is where the other side is making the biggest mistake.",
          "In every scenario, risk must be low and reward high, determined objectively from the chart."
        ]
      },
      {
        "heading": "Charts",
        "points": ["No charts in this article."]
      }
    ],
    "rules": [
      "Downtrend + gap up into supply = highest-odds short.",
      "Uptrend + gap down into demand = highest-odds long.",
      "Counter-trend gap trades need low risk and a high target.",
      "Every gap trade needs low risk and high reward measured on the chart."
    ],
    "mistakes": [
      "Buying every gap down into demand at the open regardless of trend.",
      "Buying a gap up into supply in a downtrend."
    ],
    "quotes": [
      "Identifying who is making the biggest mistake."
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"118\" y=\"78\" width=\"172\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"428\" y=\"148\" width=\"172\" height=\"18\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"118\" y=\"240\" width=\"172\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"428\" y=\"310\" width=\"172\" height=\"18\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Gap direction x trend</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"150\" fill=\"none\" stroke=\"#ef4444\" stroke-width=\"1\" rx=\"4\"/><text x=\"30\" y=\"60\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Downtrend + gap UP into supply</text><text x=\"30\" y=\"180\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">highest-odds SHORT</text><line x1=\"50\" y1=\"85\" x2=\"50\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"45\" y=\"90\" width=\"10\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"68\" y1=\"93\" x2=\"68\" y2=\"117\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"63\" y=\"98\" width=\"10\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"86\" y1=\"101\" x2=\"86\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"81\" y=\"106\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"101\" x2=\"104\" y2=\"127\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"99\" y=\"106\" width=\"10\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"130\" y1=\"79\" x2=\"130\" y2=\"99\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"125\" y=\"84\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"150\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"340\" y=\"60\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Downtrend + gap DOWN into demand</text><text x=\"340\" y=\"180\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">lower-odds buy, fills slowly</text><line x1=\"360\" y1=\"85\" x2=\"360\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"355\" y=\"90\" width=\"10\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"378\" y1=\"93\" x2=\"378\" y2=\"117\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"373\" y=\"98\" width=\"10\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"396\" y1=\"101\" x2=\"396\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"391\" y=\"106\" width=\"10\" height=\"4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"414\" y1=\"101\" x2=\"414\" y2=\"127\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"409\" y=\"106\" width=\"10\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"440\" y1=\"145\" x2=\"440\" y2=\"165\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"435\" y=\"150\" width=\"10\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/><rect x=\"20\" y=\"200\" width=\"290\" height=\"150\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"30\" y=\"220\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Uptrend + gap UP into supply</text><text x=\"30\" y=\"340\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">counter-trend short only if 3:1+</text><line x1=\"50\" y1=\"297\" x2=\"50\" y2=\"317\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"45\" y=\"302\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"68\" y1=\"297\" x2=\"68\" y2=\"311\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"63\" y=\"302\" width=\"10\" height=\"4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"86\" y1=\"287\" x2=\"86\" y2=\"311\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"81\" y=\"292\" width=\"10\" height=\"14\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"279\" x2=\"104\" y2=\"297\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"99\" y=\"284\" width=\"10\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"241\" x2=\"130\" y2=\"261\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"125\" y=\"246\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><rect x=\"330\" y=\"200\" width=\"290\" height=\"150\" fill=\"none\" stroke=\"#22c55e\" stroke-width=\"1\" rx=\"4\"/><text x=\"340\" y=\"220\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Uptrend + gap DOWN into demand</text><text x=\"340\" y=\"340\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">highest-odds LONG</text><line x1=\"360\" y1=\"297\" x2=\"360\" y2=\"317\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"355\" y=\"302\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"378\" y1=\"297\" x2=\"378\" y2=\"311\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"373\" y=\"302\" width=\"10\" height=\"4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"396\" y1=\"287\" x2=\"396\" y2=\"311\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"391\" y=\"292\" width=\"10\" height=\"14\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"414\" y1=\"279\" x2=\"414\" y2=\"297\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"409\" y=\"284\" width=\"10\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"440\" y1=\"307\" x2=\"440\" y2=\"327\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"435\" y=\"312\" width=\"10\" height=\"10\" fill=\"#ef4444\" rx=\"1\"/></svg>",
        "caption": "Gap-by-trend matrix: the highest-odds gap trades are with the trend into an opposing level, where the other side makes the biggest mistake."
      }
    ],
    "diagrams": [],
    "checklist": [
      "What is the trend?",
      "Is the gap going INTO supply (up) or INTO demand (down)?",
      "Is this the with-trend gap scenario?",
      "Is risk low and the target large?"
    ],
    "journalTags": ["gap-trend-matrix", "gap-fill", "novice-mistake", "opening-gap"],
    "newVsPdfs": [
      "New: Kevin's course does not trade opening gaps; this gap-by-trend matrix has no equivalent."
    ]
  },
  {
    "n": 106,
    "title": "Where Is The Dow Going?",
    "kind": "article",
    "summary": "The Dow found buyers around 8000, a monthly demand area it had bounced from several times since 1998. Seiden uses it to teach an XLT rule: do not buy a support level that has been tested more than once, because each visit uses up more of the resting buy orders. Buy on the first or second revisit only, and be cautious about the Dow until price reaches fresh demand.",
    "sections": [
      {
        "heading": "Why repeated tests weaken a level",
        "points": [
          "Many books say wait for support to be tested once or twice before buying; Seiden completely disagrees.",
          "On the floor, when the stack of buy orders exceeded sell orders, price had to rise once the last seller was filled. That stack is the demand.",
          "Each revisit lets more of those buy orders fill, so fewer buyers remain and the chance of breaking lower grows.",
          "Depth of penetration into a level is another XLT factor for judging the orders left, but he does not explain it here."
        ]
      },
      {
        "heading": "Two steps",
        "points": [
          "First: quantify supply and demand properly on the chart.",
          "Second: buy only the first or second time price revisits the level, and only with a desirable profit margin."
        ]
      },
      {
        "heading": "Chart (p106): Dow Jones Industrial Average monthly",
        "points": [
          "$INDU monthly, 1996 to early 2009, scale about 4,000-14,000.",
          "A black box at about 7,000-7,900 marks the demand area from the 1998 consolidation.",
          "Shaded ovals mark the earlier bounces from it: the 1998 dip (about 7,500) and two 2002-2003 lows (about 7,200 and 7,400).",
          "After the 2007 peak near 14,000, price collapses in 2008 to 8,507.26 (low about 8,187), just above the box: the fourth visit to this area."
        ]
      }
    ],
    "rules": [
      "Do not buy a support level that has been tested more than once.",
      "Buy on the first or second revisit only, with a desirable profit margin.",
      "Be cautious at heavily tested levels; wait for fresh demand for low-risk buys."
    ],
    "mistakes": [
      "Waiting for a level to be tested two or three times before buying.",
      "Assuming a level that has held many times will keep holding."
    ],
    "quotes": [
      "We make it a rule in XLT NOT to buy at a support level if it has been tested more than once.",
      "Politely say 'no thanks'."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p106-010.jpg",
        "caption": "Dow Jones Industrial Average monthly, 1996 to early 2009: a box at about 7,000-7,900 marks demand from the 1998 consolidation. Shaded ovals mark earlier bounces from it in 1998 and 2002-2003. In late 2008 price collapses from about 14,000 to about 8,190-8,500, approaching the box for the fourth time.",
        "notes": [
          "Each prior bounce used up some of the resting buy orders.",
          "By the fourth visit the level is weak: XLT buys only the first or second revisit.",
          "A heavily tested level is a reason for caution, not confidence."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"30\" y=\"240\" width=\"530\" height=\"35\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Every test uses up resting orders</text><line x1=\"40\" y1=\"75\" x2=\"40\" y2=\"140\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"80\" width=\"12\" height=\"55\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"56\" y1=\"121.8\" x2=\"56\" y2=\"195\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"126.8\" width=\"12\" height=\"63.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"72\" y1=\"176.8\" x2=\"72\" y2=\"250\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"66\" y=\"181.8\" width=\"12\" height=\"63.2\" fill=\"#ef4444\" rx=\"1\"/><text x=\"48\" y=\"300\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">test 1: 1000 buy orders</text><line x1=\"88\" y1=\"195\" x2=\"88\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"82\" y=\"200\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"150\" x2=\"104\" y2=\"211.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"98\" y=\"155\" width=\"12\" height=\"51.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"120\" y1=\"105\" x2=\"120\" y2=\"166.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"114\" y=\"110\" width=\"12\" height=\"51.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"136\" y1=\"105\" x2=\"136\" y2=\"160\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"110\" width=\"12\" height=\"45\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"143.2\" x2=\"152\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"146\" y=\"148.2\" width=\"12\" height=\"51.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"168\" y1=\"188.2\" x2=\"168\" y2=\"250\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"162\" y=\"193.2\" width=\"12\" height=\"51.8\" fill=\"#ef4444\" rx=\"1\"/><text x=\"144\" y=\"316\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">test 2: 600</text><line x1=\"184\" y1=\"205\" x2=\"184\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"210\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"200\" y1=\"170\" x2=\"200\" y2=\"220.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"194\" y=\"175\" width=\"12\" height=\"40.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"216\" y1=\"135\" x2=\"216\" y2=\"185.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"210\" y=\"140\" width=\"12\" height=\"40.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"232\" y1=\"135\" x2=\"232\" y2=\"180\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"140\" width=\"12\" height=\"35\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"248\" y1=\"164.8\" x2=\"248\" y2=\"215\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"242\" y=\"169.8\" width=\"12\" height=\"40.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"199.8\" x2=\"264\" y2=\"250\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"258\" y=\"204.8\" width=\"12\" height=\"40.2\" fill=\"#ef4444\" rx=\"1\"/><text x=\"240\" y=\"300\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">test 3: 250</text><line x1=\"280\" y1=\"213.3\" x2=\"280\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"274\" y=\"218.3\" width=\"12\" height=\"26.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"296\" y1=\"186.7\" x2=\"296\" y2=\"227.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"290\" y=\"191.7\" width=\"12\" height=\"30.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"312\" y1=\"160\" x2=\"312\" y2=\"200.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"306\" y=\"165\" width=\"12\" height=\"30.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"328\" y1=\"160\" x2=\"328\" y2=\"196.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"322\" y=\"165\" width=\"12\" height=\"26.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"344\" y1=\"182.7\" x2=\"344\" y2=\"223.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"338\" y=\"187.7\" width=\"12\" height=\"30.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"360\" y1=\"209.3\" x2=\"360\" y2=\"250\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"354\" y=\"214.3\" width=\"12\" height=\"30.7\" fill=\"#ef4444\" rx=\"1\"/><text x=\"336\" y=\"316\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">test 4: 50 left</text><line x1=\"376\" y1=\"218.3\" x2=\"376\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"370\" y=\"223.3\" width=\"12\" height=\"21.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"392\" y1=\"196.7\" x2=\"392\" y2=\"231.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"386\" y=\"201.7\" width=\"12\" height=\"24.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"408\" y1=\"175\" x2=\"408\" y2=\"209.9\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"402\" y=\"180\" width=\"12\" height=\"24.9\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"424\" y1=\"175\" x2=\"424\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"418\" y=\"180\" width=\"12\" height=\"70\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"440\" y1=\"245\" x2=\"440\" y2=\"305\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"250\" width=\"12\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"456\" y1=\"295\" x2=\"456\" y2=\"335\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"450\" y=\"300\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><text x=\"462\" y=\"340\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">breaks</text><text x=\"20\" y=\"50\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Rule: buy the 1st or 2nd revisit only; politely say no thanks after that.</text></svg>",
        "caption": "Each test of a demand level fills more of the resting buy orders. By the third and fourth test there are few buyers left and the level is likely to break; buy only the first or second revisit."
      }
    ],
    "diagrams": [
      { "key": "zone-removed", "caption": "Each test fills more resting orders; a heavily tested level is likely to break." }
    ],
    "checklist": [
      "How many times has price returned to this level?",
      "Is this the first or second revisit?",
      "Is there a desirable profit margin?",
      "Is there fresher demand lower down that would be a better buy?"
    ],
    "journalTags": ["test-count", "fresh-level", "depth-of-penetration", "dow-monthly"],
    "newVsPdfs": [
      "Close to Kevin's freshness preference, but Seiden explicitly allows the second revisit, while the repo strategy blocks any tested zone.",
      "Depth of penetration is named here without numbers; Kevin's course has a test-depth grid."
    ]
  },
  {
    "n": 108,
    "title": "Gaps, The Novice Trader Exposed",
    "kind": "article",
    "summary": "Gaps are the most obvious way to spot the novice, and the picture of the ultimate supply and demand imbalance. A NASDAQ gap up after a rally, in a downtrend, into supply was 'the most potent novice trader signal', and the next day was a big down day. Seiden restates four gap rules by trend.",
    "sections": [
      {
        "heading": "Spotting the novice",
        "points": [
          "If you cannot spot the losing trader in a market, it is probably you (like poker).",
          "Analysis is done before the open so trades are planned objectively, without emotion."
        ]
      },
      {
        "heading": "The NASDAQ example",
        "points": [
          "Buying after a rally, in a downtrend, into supply, and doing it on a gap up stacks every mistake together.",
          "Demand was much lower, so the path of least resistance was down. The goal is not certainty but objectively assessing the odds."
        ]
      },
      {
        "heading": "Four gap rules",
        "points": [
          "1) Gap up in a downtrend: very high-odds short.",
          "2) Gap up in an uptrend: lower-odds short; can be a buy if there is a significant profit margin.",
          "3) Gap down in an uptrend: very high-odds buy.",
          "4) Gap down in a downtrend: lower-odds buy; sometimes a short if there is a significant profit margin.",
          "Before entry, ask who is on the other side and make sure they are making a big mistake."
        ]
      },
      {
        "heading": "Chart (p109): NASDAQ Composite daily",
        "points": [
          "$COMPX daily from late September to mid-November 2008, price about 1,500-2,300.",
          "A clear downtrend from about 2,300 to a low near 1,500 on 10/27.",
          "A horizontal supply line at about 1,780 is drawn from the mid-October highs (around 10/14-10/20).",
          "Price rallies back up; an arrow labelled GAP marks the early-November gap up into that line (shaded small circle at about 1,750-1,780).",
          "The next candle is a big red down day to 1,681.64."
        ]
      }
    ],
    "rules": [
      "Gap up + downtrend = very high-odds short; gap down + uptrend = very high-odds long.",
      "Counter-trend gap trades only with a significant profit margin.",
      "Plan gap trades before the open.",
      "Check where the opposing level is before entering (room to run)."
    ],
    "mistakes": [
      "Buying a gap up after a rally into supply in a downtrend.",
      "Trading from a conventional TA book instead of reading order flow.",
      "Making decisions while the market is moving and emotions are high."
    ],
    "quotes": [
      "If you can't spot the novice, consistent losing trader in a market, it is probably you.",
      "The picture of the ultimate supply and demand imbalance is a gap."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p109-012.jpg",
        "caption": "NASDAQ Composite daily, late September to mid-November 2008: a downtrend from about 2,300 to about 1,500. A supply line at about 1,780 comes from the mid-October highs. After a rally, the arrowed GAP up in early November runs into that line (shaded circle); the next candle is a big down day to 1,681.64.",
        "notes": [
          "Buying after a rally, into supply, in a downtrend, on a gap: every novice mistake at once.",
          "Gap up in a downtrend is the very high-odds short.",
          "Demand was far below, so the path of least resistance was down."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"150\" y=\"150\" width=\"410\" height=\"25\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"554\" y=\"166.5\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><text x=\"564\" y=\"179\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"564\" y=\"154\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Gap up into supply in a downtrend</text><line x1=\"40\" y1=\"55\" x2=\"40\" y2=\"85\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"60\" width=\"12\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"58\" y1=\"67\" x2=\"58\" y2=\"85\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"52\" y=\"72\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"76\" y1=\"67\" x2=\"76\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"72\" width=\"12\" height=\"38\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"105\" x2=\"94\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"110\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"112\" y1=\"127\" x2=\"112\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"106\" y=\"132\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"127\" x2=\"130\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"124\" y=\"132\" width=\"12\" height=\"38\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"148\" y1=\"165\" x2=\"148\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"142\" y=\"170\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"166\" y1=\"181\" x2=\"166\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"186\" width=\"12\" height=\"14\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"184\" y1=\"181\" x2=\"184\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"186\" width=\"12\" height=\"44\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"202\" y1=\"225\" x2=\"202\" y2=\"275\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"196\" y=\"230\" width=\"12\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"220\" y1=\"255\" x2=\"220\" y2=\"275\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"214\" y=\"260\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"255\" x2=\"238\" y2=\"305\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"260\" width=\"12\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"256\" y1=\"278\" x2=\"256\" y2=\"305\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"250\" y=\"283\" width=\"12\" height=\"17\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"272\" y1=\"261\" x2=\"272\" y2=\"290.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"266\" y=\"266\" width=\"12\" height=\"19.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"288\" y1=\"244\" x2=\"288\" y2=\"273.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"282\" y=\"249\" width=\"12\" height=\"19.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"304\" y1=\"227\" x2=\"304\" y2=\"256.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"298\" y=\"232\" width=\"12\" height=\"19.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"320\" y1=\"210\" x2=\"320\" y2=\"239.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"314\" y=\"215\" width=\"12\" height=\"19.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"336\" y1=\"152\" x2=\"336\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"330\" y=\"160\" width=\"12\" height=\"12\" fill=\"#22c55e\" rx=\"1\"/><text x=\"324\" y=\"132\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">GAP = novice buyer</text><line x1=\"334\" y1=\"136\" x2=\"336\" y2=\"148\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"336,148 331.4,141.5 338.2,140.3\" fill=\"#f59e0b\"/><line x1=\"354\" y1=\"165\" x2=\"354\" y2=\"260\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"348\" y=\"170\" width=\"12\" height=\"85\" fill=\"#ef4444\" rx=\"1\"/><text x=\"380\" y=\"250\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">short: big down day</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Buying after a rally + into supply + in a downtrend + on a gap: every mistake stacked.</text></svg>",
        "caption": "The most potent novice signal: in a downtrend, a rally that gaps up into supply. The gap buyer is buying after buying, into supply, against the trend; the next day is a big down day."
      }
    ],
    "diagrams": [],
    "checklist": [
      "What is the trend, and which way did price gap?",
      "Is the gap into supply (for a short) or demand (for a long)?",
      "Where is the opposing level, and is the margin large?",
      "Who is on the other side, and what mistake are they making?"
    ],
    "journalTags": ["gap-rules", "novice-buyer", "nasdaq", "pre-market-plan"],
    "newVsPdfs": [
      "New: gap rules are absent from Kevin's course; in a Zoom session Kevin told a student a drawn gap area was not a zone."
    ]
  },
  {
    "n": 110,
    "title": "Markets and Market Timing",
    "kind": "article",
    "summary": "Amid 2008 bailout news, Seiden says the XLT rule on a bailout announcement is to find supply and short the stock market. Volatility is simply the distance between demand and supply levels. A NASDAQ 2-minute short at supply that was also the overnight high, reached by a rally with no demand levels in it, shows why a strong arrival and large profit margin matter, and stock traders should time their trades with S&P and NASDAQ levels.",
    "sections": [
      {
        "heading": "Macro view and volatility",
        "points": [
          "Foreclosures, job losses and the $700 billion bailout were not news to the XLT; they had been expected.",
          "XLT rule: each time a country announces a bailout, find supply and short the stock market (stocks or futures). This is his opinion-heavy macro view.",
          "Volatility is high because the distance from demand to supply is large; it will shrink when the levels tighten."
        ]
      },
      {
        "heading": "The NASDAQ trade",
        "points": [
          "Area A is supply: price could not stay there and left wicks, the footprints of sellers.",
          "Confluence: 1,175 was also the overnight (globex) high, which was the high because that is where the supply was.",
          "B is the first revisit; buyers there buy after buying (mistake 1) and at supply (mistake 2).",
          "Short at the lower line of the zone, protective buy stop just above the upper line.",
          "The rally into B was built with no demand levels, just big green candles, so once supply was hit price could fall quickly through that empty space to C. That empty space is the profit margin; the XLT requires strong rallies into supply like this."
        ]
      },
      {
        "heading": "Trading near the open",
        "points": [
          "The largest order imbalance is at or near the open, so that is where high-probability opportunities are.",
          "Buyers at B fell for the 'greed' trap; the XLT sets traps rather than falling for them."
        ]
      },
      {
        "heading": "Stocks: time trades with the indexes",
        "points": [
          "Stocks ebb and flow with the broad market; analyse S&P and NASDAQ supply and demand first.",
          "Spend about five minutes on index buy and sell zones, then trade a handful of stocks at most, timed with those levels.",
          "Free-market view: bailouts keep weak banks (cracks in the foundation) in the system; do not expect them to help."
        ]
      },
      {
        "heading": "Chart (p113): E-mini NASDAQ 2-min",
        "points": [
          "@NQ 2-min from the afternoon of 11/12 into the morning of 11/13, price about 1,148-1,178.",
          "A (yellow shaded box, 11/12 about 14:45-15:00): supply between two black lines at about 1,174 and 1,178, where candles left long upper wicks.",
          "Price falls overnight to about 1,149 by 9:00 on 11/13.",
          "C (bottom of a gray shaded oval, about 1,154 at 9:15): a run of large green candles with no basing rallies straight up the gray area to B.",
          "B (about 9:30, high about 1,177.50): the first revisit of A; short at the lower line (about 1,174), stop above the upper line (about 1,178).",
          "Price then drops back through the gray space to about 1,148.25 by 10:30."
        ]
      }
    ],
    "rules": [
      "Short at the proximal (lower) line of supply with the buy stop just above the distal (upper) line.",
      "Require a strong arrival with no demand levels inside the rally; the empty space is your profit margin.",
      "Extra confluence when supply lines up with the overnight high.",
      "For stocks, map S&P and NASDAQ levels first and time stock entries with them.",
      "Trade only a handful of stocks."
    ],
    "mistakes": [
      "Buying after a rally into supply (both novice mistakes at once).",
      "Avoiding the open out of fear when it holds the largest imbalance (for experienced traders).",
      "Scanning hundreds of stocks instead of starting with the index."
    ],
    "quotes": [
      "We don't fall for those traps, we set them.",
      "Candle wicks which are the footprints of sellers."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p113-014.jpg",
        "caption": "E-mini NASDAQ 2-min (11/12-11/13): A (yellow box) is supply at about 1,174-1,178 where candles left long upper wicks; it is also the overnight high. Price falls to about 1,149, then from C (about 1,154) a run of large green candles with no basing rallies straight to B (high 1,177.50), the first revisit of A. Price then drops back to about 1,148.",
        "notes": [
          "Short at the lower line (about 1,174), stop just above the upper line (about 1,178).",
          "The rally into B left no demand levels behind, so the gray area is empty space: the profit margin.",
          "Extra confluence: supply matched the overnight high."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"60\" width=\"430\" height=\"32\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"464\" y=\"80\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">A supply</text><text x=\"474\" y=\"96\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"474\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><rect x=\"212\" y=\"96\" width=\"90\" height=\"190\" fill=\"#94a3b81a\" stroke=\"none\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Strong rally into supply = profit margin</text><line x1=\"30\" y1=\"115\" x2=\"30\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"120\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"60\" x2=\"46\" y2=\"128\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"72\" width=\"12\" height=\"48\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"62\" x2=\"62\" y2=\"116\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"80\" width=\"12\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"87\" x2=\"78\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"92\" width=\"12\" height=\"18\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"94\" y1=\"87\" x2=\"94\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"92\" width=\"12\" height=\"38\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"125\" x2=\"110\" y2=\"157.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"130\" width=\"12\" height=\"22.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"143.8\" x2=\"126\" y2=\"179.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"148.8\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"142\" y1=\"166\" x2=\"142\" y2=\"201.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"171\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"158\" y1=\"188.1\" x2=\"158\" y2=\"223.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"193.1\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"174\" y1=\"210.2\" x2=\"174\" y2=\"245.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"215.2\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"232.4\" x2=\"190\" y2=\"267.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"237.4\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"206\" y1=\"254.5\" x2=\"206\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"259.5\" width=\"12\" height=\"25.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"254\" x2=\"222\" y2=\"296\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"260\" width=\"12\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"217\" x2=\"238\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"222\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"175\" x2=\"254\" y2=\"227\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"180\" width=\"12\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"133\" x2=\"270\" y2=\"185\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"138\" width=\"12\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"286\" y1=\"93\" x2=\"286\" y2=\"143\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"98\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"302\" y1=\"62\" x2=\"302\" y2=\"104\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"66\" width=\"12\" height=\"32\" fill=\"#22c55e\" rx=\"1\"/><text x=\"218\" y=\"196\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">no demand</text><text x=\"218\" y=\"210\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">levels inside</text><text x=\"288\" y=\"50\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"700\">B</text><line x1=\"318\" y1=\"65\" x2=\"318\" y2=\"108.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"70\" width=\"12\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"93.3\" x2=\"334\" y2=\"141.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"98.3\" width=\"12\" height=\"38.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"350\" y1=\"126.7\" x2=\"350\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"131.7\" width=\"12\" height=\"38.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"366\" y1=\"160\" x2=\"366\" y2=\"208.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"165\" width=\"12\" height=\"38.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"382\" y1=\"193.3\" x2=\"382\" y2=\"241.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"198.3\" width=\"12\" height=\"38.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"398\" y1=\"226.7\" x2=\"398\" y2=\"275\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"392\" y=\"231.7\" width=\"12\" height=\"38.3\" fill=\"#ef4444\" rx=\"1\"/><text x=\"202\" y=\"310\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"700\">C</text><line x1=\"528\" y1=\"92\" x2=\"566\" y2=\"92\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"96\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">SELL</text><line x1=\"528\" y1=\"56\" x2=\"566\" y2=\"56\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"60\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text><line x1=\"470\" y1=\"270\" x2=\"566\" y2=\"270\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"274\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">TARGET</text></svg>",
        "caption": "Short at supply A on the first revisit B: sell at the lower (proximal) line, protective buy stop just above the upper line. The rally into B left no demand levels, so the empty space down to C is the profit margin."
      }
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short at the lower supply line, stop above the upper line, target the next demand." }
    ],
    "checklist": [
      "Is the supply zone marked with two lines, with wicks showing sellers?",
      "Does it line up with another reference (overnight high)?",
      "Did price rally into it fast, with no demand levels left behind?",
      "Is the profit margin to the next demand large?",
      "For stocks: is the index at a matching level?"
    ],
    "journalTags": ["arrival-no-demand", "profit-margin", "globex-high", "nasdaq-futures", "index-timing", "volatility"],
    "newVsPdfs": [
      "New: using the overnight (globex) high as confluence for supply.",
      "New: volatility defined as the distance between demand and supply levels.",
      "Arrival quality (no demand levels in the rally) is only partly covered in Kevin's material.",
      "New: index-timing for stocks; Kevin's course has no index or correlation filter."
    ]
  },
  {
    "n": 114,
    "title": "Whose Supply and Demand Is It?",
    "kind": "article",
    "summary": "Seiden defines demand as a price where someone is willing and able to buy (where to buy) and supply as where someone is willing and able to sell. A sideways base only looks balanced: the equation was out of balance and needed time to play out. The big move away comes from institutions, because retail lacks the buying power, and where smart money buys is where retail sells.",
    "sections": [
      {
        "heading": "Definitions",
        "points": [
          "Support and resistance mean different things to different traders (Fibonacci, pivot lows, rising moving averages); supply and demand have only one definition.",
          "Demand = a price at which someone is willing and able to buy = where to buy.",
          "Supply = a price at which someone is willing and able to sell = where to sell.",
          "Opportunity exists when the supply/demand equation is out of balance."
        ]
      },
      {
        "heading": "Whose demand is it?",
        "points": [
          "Institutions profit from retail traders, so it helps to know where institutions buy and sell; price action shows it without expensive software.",
          "Three candles basing sideways look balanced, but the equation was always out of balance; once the last seller sells, price must rise.",
          "Retail traders do not have the buying power to cause that rally; institutions do.",
          "Where smart money buys is where retail sells, and vice versa."
        ]
      },
      {
        "heading": "Chart 1 (p115): EURGBP 10-min, supply and demand zones",
        "points": [
          "EURGBP 10-min, evening of 10/15 into 10/16, price about 0.7740-0.7815.",
          "Supply: two lines at about 0.7776 and 0.7788 around a small base near 23:00, from which price drops sharply in big red candles.",
          "Demand: two lines at about 0.7742 and 0.7752 around the base at the low (about 00:00-01:00 on 10/16), from which price rallies.",
          "An oval at about 02:00 shows price rallying back into the supply zone and turning down; a circle at about 02:30 shows price dropping back into demand and launching to about 0.7810."
        ]
      },
      {
        "heading": "Chart 2 (p116): 'Whose demand is this?' diagram",
        "points": [
          "Hand-drawn candles with price labels 1.6300, 1.6200 and 1.6100: a decline, three candles basing just above 1.6100, then a rally back to about 1.6300.",
          "Under the base: Sellers 200, 100, 0 and Buyers 3000, 2000, 1000. The circled column (0 sellers, 1000 buyers) is labelled 'Price must rise (Demand exceeds supply)'.",
          "A red box asks 'Whose demand is this?': the answer is institutional, not retail."
        ]
      },
      {
        "heading": "Chart 3 (p117): EURJPY 15-min, bank demand",
        "points": [
          "EURJPY 15-min, price about 134.9-136.8. Side notes: A = demand exceeds supply (the bank dealer desk has too much to buy at A); B = low-risk, high-reward buy for the astute speculator.",
          "A: a demand zone with two lines at about 134.95 and 135.15 at the low around 05:00-06:00.",
          "Price rallies to about 135.8, then pulls back; B is a shaded oval at about 135.15 around 08:00-09:00, the return to the zone.",
          "Price then rallies to about 136.8. Caption: when price reaches a level where demand exceeds supply, price must rise."
        ]
      }
    ],
    "rules": [
      "Treat demand as where to buy and supply as where to sell; ignore other definitions of support and resistance.",
      "Read a tight sideways base before a big move as hidden imbalance, not balance.",
      "Buy the return to the base the institutions left (B), not the move away."
    ],
    "mistakes": [
      "Believing a sideways base means buyers and sellers are balanced.",
      "Paying for software to find institutional orders that the chart already shows.",
      "Selling where smart money is buying."
    ],
    "quotes": [
      "Where the smart money buys is where retail sells.",
      "Demand = (Support) = where to buy."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p115-016.jpg",
        "caption": "EURGBP 10-min (10/15-10/16): supply between about 0.7776 and 0.7788 from a small base at 23:00 that price dropped hard from; demand between about 0.7742 and 0.7752 from the base at the low. The oval at about 02:00 shows price rallying back into supply and turning down; the circle at about 02:30 shows price returning to demand and launching to about 0.7810.",
        "notes": [
          "Each zone is the base a strong move left from.",
          "Price respected both: sell at the supply return, buy at the demand return.",
          "Opportunity exists where the equation is out of balance, at the edges, not in the middle."
        ]
      },
      {
        "src": "/lessons/seiden/p116-017.jpg",
        "caption": "Hand-drawn diagram 'Whose demand is this?': a decline to three basing candles just above 1.6100, then a rally back to about 1.6300. Under the base: Sellers 200, 100, 0 and Buyers 3000, 2000, 1000; the circled column reads 'Price must rise (Demand exceeds supply)'.",
        "notes": [
          "The base looks balanced but buyers far outnumber sellers.",
          "Only institutions have the size to drive the move away; retail does not.",
          "Where smart money buys is where retail sells."
        ]
      },
      {
        "src": "/lessons/seiden/p117-018.jpg",
        "caption": "EURJPY 15-min with notes: A is a demand zone at about 134.95-135.15 at the 05:00-06:00 low ('bank dealer desk has too much to buy at A'). Price rallies to about 135.8, then B (gray oval, about 08:00-09:00) returns to the zone: the low-risk, high-reward buy. Price then rallies to about 136.8.",
        "notes": [
          "Buy the return to the base the institutions left, not the move away.",
          "When price reaches a level where demand exceeds supply, price must rise.",
          "The stop goes just below the lower line at A."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"102\" y=\"228\" width=\"418\" height=\"26\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"245\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">A: bank demand</text><text x=\"524\" y=\"232\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"258\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">The base looks balanced; the move away says otherwise</text><line x1=\"30\" y1=\"65\" x2=\"30\" y2=\"107\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"70\" width=\"12\" height=\"32\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"92.2\" x2=\"46\" y2=\"139\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"97.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"124.2\" x2=\"62\" y2=\"171\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"129.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"156.2\" x2=\"78\" y2=\"203\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"161.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"188.2\" x2=\"94\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"193.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"229\" x2=\"110\" y2=\"251\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"234\" width=\"12\" height=\"12\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"229\" x2=\"126\" y2=\"251\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"234\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"142\" y1=\"229\" x2=\"142\" y2=\"251\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"235.2\" width=\"12\" height=\"8.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"195\" x2=\"158\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"200\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"145\" x2=\"174\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"150\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"100\" x2=\"190\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"105\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><text x=\"150\" y=\"150\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"end\" font-weight=\"400\">institutional</text><text x=\"150\" y=\"164\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"end\" font-weight=\"400\">move away</text><line x1=\"206\" y1=\"100\" x2=\"206\" y2=\"134.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"105\" width=\"12\" height=\"24.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"120.6\" x2=\"222\" y2=\"158.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"125.6\" width=\"12\" height=\"27.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"144.8\" x2=\"238\" y2=\"182.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"149.8\" width=\"12\" height=\"27.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"169\" x2=\"254\" y2=\"206.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"174\" width=\"12\" height=\"27.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"193.2\" x2=\"270\" y2=\"231\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"198.2\" width=\"12\" height=\"27.8\" fill=\"#ef4444\" rx=\"1\"/><text x=\"226\" y=\"290\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">B: return = BUY</text><line x1=\"286\" y1=\"222\" x2=\"286\" y2=\"240\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"190\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"302\" y1=\"135\" x2=\"302\" y2=\"195\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"140\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"85\" x2=\"318\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"90\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"334\" y1=\"55\" x2=\"334\" y2=\"95\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"60\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><text x=\"70\" y=\"310\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">sellers 200 → 100 → 0</text><text x=\"70\" y=\"328\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">buyers 3000 → 2000 → 1000</text></svg>",
        "caption": "Whose demand is it? Three quiet basing candles hide an imbalance only institutions can create; the big move away is their footprint. Buy the return to that base (B), where retail is selling."
      }
    ],
    "diagrams": [
      { "key": "zone-anatomy", "caption": "Base = hidden imbalance; the big move away shows institutional orders." }
    ],
    "checklist": [
      "Is there a strong move away that only institutions could cause?",
      "Have I marked the base it came from as the zone?",
      "Am I buying where retail is selling?"
    ],
    "journalTags": ["definitions", "institutional-demand", "hidden-imbalance", "eurgbp", "eurjpy"],
    "newVsPdfs": []
  },
  {
    "n": 117,
    "title": "Translating Floor Trading Emotion into Screen-Based Trading",
    "kind": "article",
    "summary": "From his CME pit days, Seiden learned that turns happen when the novice enters, and that the novice makes two mistakes: buying after a period of buying (or selling after selling) and buying into supply (or selling into demand). On screen, candlesticks show the same emotion. A USDCHF short at a pivot-high supply level illustrates it, followed by his task, tools and three-step analysis: trend, levels, profit margin.",
    "sections": [
      {
        "heading": "Lessons from the floor",
        "points": [
          "A successful floor trader had him watch a desperate buyer, then sold to him; minutes later the market fell.",
          "That trader's whole approach was to find the consistent loser and take the other side of his trade.",
          "Emotion, not intellect, drives most decisions, so emotional traders are invited in when risk is high and reward low."
        ]
      },
      {
        "heading": "The two novice mistakes",
        "points": [
          "1) Buying after a period of buying, or selling after a period of selling (late, high risk).",
          "2) Buying into supply, or selling into demand (low odds).",
          "To profit from a buy, someone must later pay more than you; most traders do the opposite.",
          "Studying what losers do wrong is a good way to learn what is right."
        ]
      },
      {
        "heading": "Task, tools and analysis",
        "points": [
          "Task: 1) objective, anticipatory analysis, entering before others; 2) low-risk entries.",
          "Tools: candlesticks (price), proper trend analysis, proper supply and demand analysis.",
          "Analysis step 1: trend of average prices (rising = odds with buyers, falling = odds with sellers). Proper trend analysis is objective anticipation of the next trend.",
          "Step 2: where are support (demand) and resistance (supply)? Entries are at or near support for longs and resistance for shorts.",
          "Step 3: is there a profit margin? For longs, resistance minus support at the time of entry; the reverse for shorts."
        ]
      },
      {
        "heading": "Why most people trade backwards",
        "points": [
          "Books teach chart patterns that need a bullish picture to buy; seminars teach lagging indicators.",
          "Astute traders get interested in buying well before green candles appear.",
          "People buy on good news and sell on bad news; good news does not bring price down to demand, bad news does.",
          "The advantage now lies with screen traders who know what to look for."
        ]
      },
      {
        "heading": "Chart (p122): USDCHF 30-min, short at pivot-high supply",
        "points": [
          "USDCHF 30-min from 11/24 to about 12/1, price about 1.1840-1.2210.",
          "A: a pivot high on 11/24 with supply wrapped by two lines at about 1.2190 and 1.2205; price immediately collapses to about 1.1925, then to about 1.1840 by 11/25-11/26.",
          "Price climbs back over several days in a choppy rally, with a sharp spike higher on 11/28.",
          "B: the candle that spikes into the same zone at about 1.2195 on 11/28. Those buyers are buying after an advance and into supply; the short entry is on candle B.",
          "Price then drifts lower to about 1.2105 by the right edge."
        ]
      }
    ],
    "rules": [
      "Never buy after a period of buying into supply, nor sell after selling into demand.",
      "Enter before others, at levels, with low risk.",
      "Run the three-step analysis every time: trend, levels, profit margin.",
      "Short the first return to a pivot-high supply level when buyers arrive after an advance."
    ],
    "mistakes": [
      "Buying when everyone else is buying and the picture looks bullish.",
      "Relying on lagging indicators and chart-pattern books.",
      "Buying on good news; selling on bad news.",
      "Letting emotion decide entries."
    ],
    "quotes": [
      "Turns in the market happen when the novice trader has entered the market.",
      "An astute trader gets interested in buying well before pretty green candles appear."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p122-020.jpg",
        "caption": "USDCHF 30-min (11/24 to about 12/1): A is a pivot high on 11/24 with supply wrapped by lines at about 1.2190-1.2205; price collapses from it to about 1.1840. After a choppy multi-day rally and a spike on 11/28, candle B reaches the same zone at about 1.2195; that is the short. Price then drifts lower to about 1.2105.",
        "notes": [
          "The buyer at B is buying after an advance AND into supply: both novice mistakes.",
          "Short the first return to a pivot-high supply level.",
          "Run the three steps: trend, levels, profit margin."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"60\" width=\"480\" height=\"22\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"514\" y=\"75\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">A pivot-high supply</text><text x=\"524\" y=\"86\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Sell to the buyer making both mistakes</text><line x1=\"30\" y1=\"105\" x2=\"30\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"110\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"62\" x2=\"46\" y2=\"116\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"70\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"67\" x2=\"62\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"72\" width=\"12\" height=\"58\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"125\" x2=\"78\" y2=\"167\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"130\" width=\"12\" height=\"32\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"152.2\" x2=\"94\" y2=\"199\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"157.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"184.2\" x2=\"110\" y2=\"231\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"189.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"216.2\" x2=\"126\" y2=\"263\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"221.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"142\" y1=\"248.2\" x2=\"142\" y2=\"295\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"253.2\" width=\"12\" height=\"36.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"158\" y1=\"255\" x2=\"158\" y2=\"295\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"260\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"257\" x2=\"174\" y2=\"280\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"262\" width=\"12\" height=\"13\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"233\" x2=\"190\" y2=\"280\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"238\" width=\"12\" height=\"37\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"235\" x2=\"206\" y2=\"257\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"240\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"210\" x2=\"222\" y2=\"257\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"215\" width=\"12\" height=\"37\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"211\" x2=\"238\" y2=\"233\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"216\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"185\" x2=\"254\" y2=\"233\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"190\" width=\"12\" height=\"38\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"165\" x2=\"270\" y2=\"195\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"170\" width=\"12\" height=\"20\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"286\" y1=\"115\" x2=\"286\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"120\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"302\" y1=\"66\" x2=\"302\" y2=\"125\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"82\" width=\"12\" height=\"38\" fill=\"#22c55e\" rx=\"1\"/><text x=\"278\" y=\"52\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"700\">B</text><text x=\"390\" y=\"200\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">1) buying after buying</text><text x=\"390\" y=\"216\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">2) buying into supply</text><line x1=\"318\" y1=\"80\" x2=\"318\" y2=\"111.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"85\" width=\"12\" height=\"21.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"98.1\" x2=\"334\" y2=\"132.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"103.1\" width=\"12\" height=\"24.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"350\" y1=\"119.3\" x2=\"350\" y2=\"153.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"124.3\" width=\"12\" height=\"24.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"366\" y1=\"140.6\" x2=\"366\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"145.6\" width=\"12\" height=\"24.4\" fill=\"#ef4444\" rx=\"1\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Analysis: 1) trend  2) where are supply and demand  3) is there a profit margin</text></svg>",
        "caption": "The two novice mistakes on one chart: candle B buys after a period of buying AND into the pivot-high supply A. The astute trader sells to that buyer at the zone."
      }
    ],
    "diagrams": [
      { "key": "mindset", "caption": "Find the novice making the two mistakes and take the other side." }
    ],
    "checklist": [
      "Is the other side buying after buying, or selling after selling?",
      "Are they buying into supply or selling into demand?",
      "What is the trend of average prices?",
      "Where are the nearest supply and demand?",
      "Is the profit margin large enough?"
    ],
    "journalTags": ["two-novice-mistakes", "floor-trading", "task-tools-analysis", "profit-margin", "usdchf"],
    "newVsPdfs": [
      "Differs: Seiden defines trend by average prices; Kevin defines it by swing structure and trendlines.",
      "New: the 'two novice mistakes' and 'who is on the other side' framing is not in Kevin's course."
    ]
  },
  {
    "n": 125,
    "title": "Set It And Forget It",
    "kind": "article",
    "summary": "We are conditioned from birth to trade wrong; good buys come at the end of downtrends, with bad news and indicators pointing down. Seiden estimates about 80% fail from poor education and 80% of the rest from poor discipline. Two pre-planned XLT trades (NASDAQ and crude oil) and an OCO bracket order show how to remove emotion: enter, stop and target all at once, then walk away.",
    "sections": [
      {
        "heading": "Why most traders fail",
        "points": [
          "If you are invited to buy only after an uptrend, with indicators up and good news, price is probably high.",
          "College finance (good earnings, good management, industry leader, uptrend) points you to buy when price is already high.",
          "Two requirements: a correct understanding of how markets work with a rule-based strategy, and the discipline to follow it.",
          "Roughly 80% fail because they are taught wrong; of the 20% properly educated, about 80% fail on discipline."
        ]
      },
      {
        "heading": "Pre-planning the trades",
        "points": [
          "Before the US open, mark the demand below and the supply above.",
          "At the open, buy from whoever sells after a decline at demand; at the supply above, sell longs or initiate shorts to the buyer making both mistakes.",
          "In the crude trade, price arrived at demand with a severe, big-red-candle decline (probably bad news, indicators falling), which is what makes buying there feel scary but correct."
        ]
      },
      {
        "heading": "Set it and forget it",
        "points": [
          "Seiden does not claim to be free of emotion; his brain is flawed for trading, so he lets the order platform keep emotion out.",
          "OCO (order cancels order): enter the buy at demand, the protective sell stop and the profit-taking sell limit at the same time, then stay hands-off.",
          "This handles emotion and means no need to watch the screen all day. Use it for day, swing and position trades."
        ]
      },
      {
        "heading": "Chart 1 (p127): E-mini NASDAQ 30-min, 12/17/08",
        "points": [
          "@NQ 30-min, 12/16 to 12/18, price about 1,209-1,245.",
          "Demand (support): two lines at about 1,209 and 1,216 around the base at 12:00-14:00 on 12/16, before a big rally to about 1,243.",
          "Supply (resistance): lines at about 1,239.5 and 1,245 at the top of that rally; the upper line is labelled 'XLT Profit Target'.",
          "A shaded circle at about 1,215 on the 12/17 open marks 'XLT Buy' after a sharp drop into demand.",
          "Price rallies to the supply zone, where a shaded oval at about 1,240-1,245 (around 13:00) marks the target; price then fades to 1,228.50."
        ]
      },
      {
        "heading": "Chart 2 (p128): Crude oil 15-min, XLT trade 12/10/08",
        "points": [
          "@CL 15-min, 12/9 to 12/10, price about 46.5-50.5.",
          "Demand (support): lines at about 46.50 and 46.80 at the 15:00 low on 12/9, from which price climbs to about 48 and then 49.",
          "Supply (resistance) / XLT target: a shaded oval with lines at about 49.0 and 49.3 at the top of the move.",
          "Around 9:00-9:30 on 12/10 price plunges in large red candles all the way back to demand; a shaded oval marks 'XLT Buy' at about 46.80.",
          "Price then rockets through the target to about 50.5."
        ]
      },
      {
        "heading": "Figure (p129): OCO order menu",
        "points": [
          "A TradeStation order-bar screenshot with the OCO/OSO drop-down open.",
          "Entry options include OCO Breakout, OCO Breakout/Fade Buy, OCO Breakout/Fade Sell, OCO Fade, Single Order Long and Single Order Short.",
          "Highlighted: 'Entry - Single Order - Long' with 'Exit - Bracket - 1 Limit & 1 Stop Level': one buy entry with one profit limit and one protective stop."
        ]
      }
    ],
    "rules": [
      "Mark demand below and supply above before the open.",
      "Buy at demand after a decline; take profit (or go short) at the supply above.",
      "Place entry, stop and target together as an OCO bracket, then do not touch it.",
      "Embrace sharp, bad-news declines into demand as buying opportunities."
    ],
    "mistakes": [
      "Buying when trend, indicators and news all look good.",
      "Relying on willpower instead of order automation to control emotion.",
      "Sitting in front of the screen all day managing trades by hand."
    ],
    "quotes": [
      "From birth, we are conditioned to trade incorrectly.",
      "I call this 'set it and forget it' trading."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p127-022.jpg",
        "caption": "E-mini NASDAQ 30-min (12/16-12/18): demand at about 1,209-1,216 from the 12/16 base before a big rally; supply at about 1,239.5-1,245 at the top of that rally, labelled XLT Profit Target. The shaded circle on 12/17 marks the XLT Buy after a sharp drop into demand; price rallies into the supply oval, then fades to 1,228.50.",
        "notes": [
          "Mark demand below and supply above before the open.",
          "Buy at demand after a sharp decline; the profit limit sits at the supply above.",
          "Entry, stop and target placed together, then hands off."
        ]
      },
      {
        "src": "/lessons/seiden/p128-023.jpg",
        "caption": "Crude oil 15-min (12/9-12/10): demand at about 46.50-46.80 at the 12/9 low; supply/XLT target at about 49.0-49.3 at the top of the move. Around 9:00-9:30 on 12/10 price plunges in big red candles straight back to demand, marked XLT Buy at about 46.80, then rockets through the target to about 50.5.",
        "notes": [
          "The scary, big-red-candle decline into demand is exactly the high-odds buy.",
          "The bracket order removes emotion: the buy, stop and target were set before the plunge."
        ]
      },
      {
        "src": "/lessons/seiden/p129-024.jpg",
        "caption": "TradeStation order-bar screenshot with the OCO/OSO menu open: 'Entry - Single Order - Long' is highlighted with the sub-option 'with Exit - Bracket - 1 Limit & 1 Stop Level'.",
        "notes": [
          "One order places the buy, the profit-taking limit and the protective stop together.",
          "When the stop or the limit fills, the other is cancelled automatically (order cancels order).",
          "This is the mechanical way to 'set it and forget it'."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"30\" y=\"255\" width=\"440\" height=\"45\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"464\" y=\"281.5\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">DEMAND</text><text x=\"474\" y=\"259\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"474\" y=\"304\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><rect x=\"124\" y=\"60\" width=\"346\" height=\"32\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"464\" y=\"80\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><text x=\"474\" y=\"96\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"474\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">OCO bracket: entry, stop and target placed together</text><line x1=\"30\" y1=\"265\" x2=\"30\" y2=\"285\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"270\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"262\" x2=\"46\" y2=\"300\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"270\" width=\"12\" height=\"15\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"257\" x2=\"62\" y2=\"290\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"262\" width=\"12\" height=\"23\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"78\" y1=\"255\" x2=\"78\" y2=\"296\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"262\" width=\"12\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"224\" x2=\"94\" y2=\"270\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"229\" width=\"12\" height=\"36\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"188\" x2=\"110\" y2=\"239.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"193\" width=\"12\" height=\"41.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"152\" x2=\"126\" y2=\"203.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"157\" width=\"12\" height=\"41.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"116\" x2=\"142\" y2=\"167.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"121\" width=\"12\" height=\"41.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"80\" x2=\"158\" y2=\"131.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"85\" width=\"12\" height=\"41.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"83\" x2=\"174\" y2=\"110\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"88\" width=\"12\" height=\"17\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"93\" x2=\"190\" y2=\"110\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"98\" width=\"12\" height=\"7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"95\" x2=\"206\" y2=\"185\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"100\" width=\"12\" height=\"80\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"175\" x2=\"222\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"180\" width=\"12\" height=\"82\" fill=\"#ef4444\" rx=\"1\"/><text x=\"168\" y=\"322\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">sharp bad-news drop</text><line x1=\"238\" y1=\"215\" x2=\"238\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"220\" width=\"12\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"165\" x2=\"254\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"170\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"120\" x2=\"270\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"125\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"286\" y1=\"87\" x2=\"286\" y2=\"130\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"92\" width=\"12\" height=\"33\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"528\" y1=\"255\" x2=\"566\" y2=\"255\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"259\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">BUY</text><line x1=\"470\" y1=\"308\" x2=\"566\" y2=\"308\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"312\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text><line x1=\"528\" y1=\"92\" x2=\"566\" y2=\"92\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"96\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">LIMIT</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Entry - Single Order - Long  with  Exit - Bracket - 1 Limit &amp; 1 Stop</text></svg>",
        "caption": "Set it and forget it: one OCO bracket places the buy limit at demand, the protective stop below the zone and the profit limit at supply, all before the move, so emotion never touches the trade."
      }
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "OCO bracket: entry at demand, stop below, limit at supply, all placed at once." }
    ],
    "checklist": [
      "Are demand and supply marked before the session?",
      "Is the entry at demand after a decline (or at supply after a rally)?",
      "Is the stop placed beyond the zone?",
      "Is the profit limit at the opposing level?",
      "Is everything entered as one bracket order?"
    ],
    "journalTags": ["set-and-forget", "oco-bracket", "pre-market-plan", "discipline", "nasdaq-futures", "crude-oil"],
    "newVsPdfs": [
      "Matches Kevin's 'set and forget' idea for zone orders; the explicit OCO bracket and the 80/80 failure estimate are new."
    ]
  },
  {
    "n": 130,
    "title": "Setting the Trap",
    "kind": "article",
    "summary": "Like scam prize letters and infomercial systems, markets transfer money from those who fall for traps to those who set them. Two XLT student trades show it: an S&P short pre-set at 914 supply after a fast breakout rally, and an S&P long in a demand zone sitting just below an obvious 'red line' of old pivot lows, where breakdown sellers sell straight into real demand.",
    "sections": [
      {
        "heading": "Traps in everyday life",
        "points": [
          "Trap-setters disguise risk as opportunity and pick the weakest prey.",
          "Someone truly owning a money-printing system would not sell it to you for $1,900."
        ]
      },
      {
        "heading": "Trap 1: the short at 914",
        "points": [
          "A student marked supply up and to the left and pre-placed a short at 914 (supply 914-917).",
          "Days later price broke out of the 905 area and rallied strongly straight into 914-917.",
          "An early breakout buyer could profit, but anyone buying after the strong rally and into supply made both mistakes; they thought 914 was value because of the breakout and green candles."
        ]
      },
      {
        "heading": "Trap 2: the red-line bait",
        "points": [
          "A demand zone formed from an explosive move up; draw it with two black lines and carry it forward.",
          "A red line connects two pivot lows just above the zone: most traders see that as the demand level.",
          "When price falls to the red line, many buy; when it breaks, they turn bearish and sell, straight into the real demand zone. Price then reverses fast.",
          "Enter close to the protective stop; turning points let you limit risk properly.",
          "If you cannot clearly see the trap on a chart, you are probably the prey."
        ]
      },
      {
        "heading": "Chart 1 (p131): S&P futures 20-min, student short",
        "points": [
          "@ES 20-min (Mar09 contract). A supply box ('Futures XLT - Supply Zone (The Trap)') at about 914-917 is drawn from a sharp drop in the upper left.",
          "Lower, a 'Futures XLT - Demand Zone' box at about 888-893 marks the origin of a later rally.",
          "Price rallies from about 893 up through the 905 area and spikes into the supply box: 'XLT Short Entry - student sets a trap and sells to a novice buyer'.",
          "A huge red candle then drops price to the demand box: 'XLT Profit Target Reached'.",
          "Trade box: short 914, stop 917, target 895, risk $300 (3 points x $50 x 2 contracts); result 19 points x $50 x 2 contracts = $1,900 profit."
        ]
      },
      {
        "heading": "Chart 2 (p132): S&P 5-min, demand zone and the bait",
        "points": [
          "@ES 5-min around 12/2, price about 812-850.",
          "'XLT Demand Zone': two black lines at about 812.34 and 815.55 around the low from which price explodes up to about 846.",
          "A red line at about 817.18 connects two pivot lows just above the zone, labelled 'The Bait - Setting the Trap'."
        ]
      },
      {
        "heading": "Chart 3 (p133): S&P 5-min, the long on 1/15",
        "points": [
          "Weeks later on 1/15, price falls from about 820 through the red line (817.18) into the black-line zone; an arrow marks 'Novice Trader Falls For Trap' where breakdown sellers sell.",
          "'XLT Student Buys' at the zone; price then rallies to about 846.",
          "Trade box: bought 814, stop 812, three targets 821, 827 and 834; risk $300 (2 points x $50 x 3 contracts); 40 total points x $50 = $2,000 profit (printed '$2,00.00')."
        ]
      }
    ],
    "rules": [
      "Pre-place shorts at supply that sits above a breakout area; let the breakout rally deliver buyers to you.",
      "Mark obvious pivot-low lines just above your real demand; expect them to break and fuel your entry.",
      "Enter close to the protective stop to keep risk small (2-3 points on the S&P examples).",
      "Use multiple targets at the opposing levels."
    ],
    "mistakes": [
      "Buying a strong breakout late, into supply.",
      "Buying at an obvious double-pivot-low line and then panic-selling when it breaks.",
      "Being unable to see where the trap is."
    ],
    "quotes": [
      "If you can't recognize a market trap clearly on a chart, chances are you are still the prey."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p131-026.jpg",
        "caption": "Futures XLT student trade, E-mini S&P 20-min (Mar09): supply box ('The Trap') at about 914-917 from a sharp drop at upper left; demand box at about 888-893 marks the origin of a later rally. Price rallies through the 905 area into the supply box where the student's pre-placed short fills; one huge red candle drops price to the demand box (target reached). Trade: short 914, stop 917, target 895, 19 points x $50 x 2 = $1,900.",
        "notes": [
          "Supply up and to the left is where breakout buyers get trapped.",
          "The short was placed in advance; the breakout rally delivered the buyers.",
          "Risk 3 points to make 19."
        ]
      },
      {
        "src": "/lessons/seiden/p132-027.jpg",
        "caption": "E-mini S&P 5-min around 12/2: the XLT demand zone between about 812.34 and 815.55 at the origin of a rally; a red line at about 817.18 just above it connects two pivot lows and is labelled 'The Bait - Setting the Trap'.",
        "notes": [
          "Most traders see the obvious pivot-low line as support.",
          "The real demand is the zone just below it, where the move started.",
          "When the bait line breaks, its buyers become sellers into your zone."
        ]
      },
      {
        "src": "/lessons/seiden/p133-028.jpg",
        "caption": "E-mini S&P 5-min on 1/15: price falls through the 817.18 bait line into the demand zone (arrow: 'Novice Trader Falls For Trap'); the XLT student buys at 814 with a stop at 812 and targets at 821, 827 and 834. Price rallies to about 848. Result about 40 points on 3 contracts.",
        "notes": [
          "Enter close to the protective stop: 2 points of risk.",
          "The breakdown sellers are selling after a decline into demand.",
          "Scale out at several opposing levels."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"86\" y=\"246\" width=\"434\" height=\"28\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"264\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">real demand</text><text x=\"524\" y=\"250\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"278\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">The bait line above real demand</text><line x1=\"30\" y1=\"75\" x2=\"30\" y2=\"127.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"80\" width=\"12\" height=\"42.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"111.1\" x2=\"46\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"116.1\" width=\"12\" height=\"48.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"153.6\" x2=\"62\" y2=\"212.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"158.6\" width=\"12\" height=\"48.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"196.1\" x2=\"78\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"201.1\" width=\"12\" height=\"48.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"246\" x2=\"94\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"250\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"235\" x2=\"110\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"240\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"207.5\" x2=\"126\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"212.5\" width=\"12\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"180\" x2=\"142\" y2=\"221.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"185\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"152.5\" x2=\"158\" y2=\"194.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"157.5\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"125\" x2=\"174\" y2=\"166.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"130\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"125\" x2=\"190\" y2=\"165.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"130\" width=\"12\" height=\"30.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"206\" y1=\"151.1\" x2=\"206\" y2=\"196.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"156.1\" width=\"12\" height=\"35.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"181.7\" x2=\"222\" y2=\"227\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"186.7\" width=\"12\" height=\"35.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"189.7\" x2=\"238\" y2=\"227\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"194.7\" width=\"12\" height=\"27.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"162.3\" x2=\"254\" y2=\"203.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"167.3\" width=\"12\" height=\"31.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"135\" x2=\"270\" y2=\"176.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"140\" width=\"12\" height=\"31.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"286\" y1=\"135\" x2=\"286\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"140\" width=\"12\" height=\"28\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"302\" y1=\"158.8\" x2=\"302\" y2=\"201\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"163.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"318\" y1=\"186.8\" x2=\"318\" y2=\"229\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"191.8\" width=\"12\" height=\"32.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"150\" y1=\"226\" x2=\"520\" y2=\"226\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><text x=\"155\" y=\"220\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">the bait: two pivot lows</text><line x1=\"334\" y1=\"216\" x2=\"334\" y2=\"266\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"222\" width=\"12\" height=\"36\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"350\" y1=\"245\" x2=\"350\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"250\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"366\" y1=\"210\" x2=\"366\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"215\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><text x=\"262\" y=\"300\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">break: novices sell into demand</text><text x=\"262\" y=\"316\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">trap-setter BUYS</text><line x1=\"382\" y1=\"165\" x2=\"382\" y2=\"220\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"376\" y=\"170\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"398\" y1=\"125\" x2=\"398\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"392\" y=\"130\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"470\" y1=\"290\" x2=\"560\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"294\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text></svg>",
        "caption": "The bait: an obvious line through two pivot lows sits just above the real demand zone. Novices buy the line, then panic-sell its break straight into the zone, where the trap-setter buys with a tight stop."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"30\" y=\"66\" width=\"490\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"514\" y=\"82\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">SUPPLY: short 914</text><text x=\"524\" y=\"94\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"70\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><rect x=\"134\" y=\"250\" width=\"386\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"269\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">target 895</text><text x=\"524\" y=\"254\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"284\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Pre-placed short: the breakout rally walks into supply</text><line x1=\"30\" y1=\"70\" x2=\"30\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"80\" width=\"12\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"75\" x2=\"46\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"80\" width=\"12\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"95\" x2=\"62\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"100\" width=\"12\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"145\" x2=\"78\" y2=\"195\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"150\" width=\"12\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"185\" x2=\"94\" y2=\"216.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"190\" width=\"12\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"203.4\" x2=\"110\" y2=\"238.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"208.4\" width=\"12\" height=\"24.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"225.1\" x2=\"126\" y2=\"260\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"230.1\" width=\"12\" height=\"24.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"142\" y1=\"250\" x2=\"142\" y2=\"278\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"255\" width=\"12\" height=\"15\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"158\" y1=\"240\" x2=\"158\" y2=\"275\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"245\" width=\"12\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"188\" x2=\"174\" y2=\"212\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"193\" width=\"12\" height=\"14\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"188\" x2=\"190\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"193\" width=\"12\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"206\" y1=\"188\" x2=\"206\" y2=\"212\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"194.4\" width=\"12\" height=\"9.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"188\" x2=\"222\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"194.4\" width=\"12\" height=\"9.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"155\" x2=\"238\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"160\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"115\" x2=\"254\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"120\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"72\" x2=\"270\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"80\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><text x=\"236\" y=\"150\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"end\" font-weight=\"400\">breakout buyers</text><line x1=\"286\" y1=\"78\" x2=\"286\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"84\" width=\"12\" height=\"176\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"528\" y1=\"56\" x2=\"562\" y2=\"56\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"566\" y=\"60\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP 917</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Risk 3 points, reward 19: the trap pays the trader who set it.</text></svg>",
        "caption": "The supply trap: shorts are pre-placed at supply up and to the left. A breakout rally delivers late buyers into that supply, and the sell order fills straight into a fast drop to demand."
      }
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short 914, stop 917, target 895: small risk, large reward from a pre-set order." }
    ],
    "checklist": [
      "Is my level the real origin of the move, not the obvious pivot line above it?",
      "Is there an obvious 'bait' level that will push novices into my zone?",
      "Is my order placed in advance?",
      "Is the stop tight and the reward several times the risk?"
    ],
    "journalTags": ["trap", "bait-line", "pre-set-order", "es-futures", "multiple-targets"],
    "newVsPdfs": [
      "Similar to Kevin's 'liquidity trap' just before a zone; Seiden's version is specific: an obvious pivot-low line just above real demand acts as the bait."
    ]
  },
  {
    "n": 134,
    "title": "Market Timing in the XLT Course",
    "kind": "article",
    "summary": "The XLT Momentum Intraday sessions now start 30 minutes before the open so trades are planned in advance. Step one is to find supply, demand and trend in the S&P and NASDAQ; step two is to find stocks whose levels line up with them. On 1/21 the S&P opened under supply, and Google and RIMM supply levels lined up with it, giving fast short trades, with RIMM risking $0.50 to make $1.50.",
    "sections": [
      {
        "heading": "New session format",
        "points": [
          "Sessions start 30 minutes before the stock market opens so students set up day trades ahead of time.",
          "Lessons and live trading alternate: learn, trade, learn, trade."
        ]
      },
      {
        "heading": "Finding turning points and candidates",
        "points": [
          "Step 1: mark demand, supply and trend in the governing markets (S&P and NASDAQ).",
          "Step 2: scan for stocks whose supply or demand lines up with the index level.",
          "Levels with a rapid move away carry very high probability.",
          "When the S&P rallied to its supply, Google rallied hard into its own supply; the short worked fast.",
          "RIMM gave the same setup in a cheaper stock, with demand about $1.50 below the short entry: risk $0.50 to make $1.50 (3:1)."
        ]
      },
      {
        "heading": "Chart 1 (p135): E-mini S&P 15-min, supply zone",
        "points": [
          "@ES 15-min from 1/20 to 1/21, price about 800-824.",
          "Supply zone: two lines at about 818.3 and 824 around the 1/20 early-afternoon highs, from which price slides to about 800.",
          "On 1/21 price opens lower and rallies into the zone (about 819), then drops in large red candles back to about 801-804."
        ]
      },
      {
        "heading": "Chart 2 (p136): Google 5-min, XLT short",
        "points": [
          "GOOG 5-min from 1/20 to 1/21. 'Supply (resistance) Zone': lines at about 299.5 and 301 around the 1/20 opening base.",
          "Price collapses from there to about 289 and grinds down to about 284 by the close.",
          "On 1/21 price rallies hard from about 284 to the zone; a shaded circle at about 299 marks 'XLT Sells Short'.",
          "Price then falls to about 292."
        ]
      },
      {
        "heading": "Chart 3 (p137): RIMM 5-min, short with 3:1",
        "points": [
          "RIMM 5-min from 1/20 to 1/21, price about 49.2-52.2.",
          "Upper gray box (supply): about 51.70-52.05 around the 11:30-12:00 base on 1/20, from which price declines steadily to about 49.25 at 14:30.",
          "Lower gray box (demand): about 49.95-50.15, at the base of the late-day rebound.",
          "On 1/21 RIMM gaps and rallies up to about 51.6, under the supply box; the short targets the demand box about $1.50 below.",
          "Price falls back into the demand box (low about 50.0); last price 50.71."
        ]
      }
    ],
    "rules": [
      "Begin analysis before the open; plan trades in advance.",
      "Mark S&P and NASDAQ supply, demand and trend first.",
      "Only trade stocks whose levels line up with the index level.",
      "Favour stock levels with a rapid move away.",
      "Require about 3:1 (e.g. risk $0.50 to make $1.50)."
    ],
    "mistakes": [
      "Trading stocks without checking where the index is relative to its own levels.",
      "Waiting until after the open to start analysis."
    ],
    "quotes": [
      "Timing your equity trades with the S&P or NASDAQ supply and demand is the key to high odds trading."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p135-030.jpg",
        "caption": "E-mini S&P 15-min (1/20-1/21): supply zone at about 818.3-824 from the 1/20 early-afternoon highs, from which price slides to about 800. On 1/21 price opens lower, rallies into the zone (about 819) and then drops in large red candles back to about 801.",
        "notes": [
          "Step 1 is the index: know where the S&P supply and demand are.",
          "The index rally into supply is the timing signal for stock shorts."
        ]
      },
      {
        "src": "/lessons/seiden/p136-031.jpg",
        "caption": "Google 5-min (1/20-1/21): supply zone at about 299.5-301 from the 1/20 opening base; price collapses to about 284. On 1/21 it rallies hard back to the zone where the shaded circle marks 'XLT Sells Short' at about 299; price then falls to about 292.",
        "notes": [
          "Stock supply lining up with index supply at the same moment raises the odds.",
          "Levels with a rapid move away are the ones to use."
        ]
      },
      {
        "src": "/lessons/seiden/p137-032.jpg",
        "caption": "RIMM 5-min (1/20-1/21): upper gray box is supply at about 51.70-52.05 from the 11:30-12:00 base; lower gray box is demand at about 49.95-50.15 at the base of the late-day rebound. On 1/21 RIMM rallies up under the supply box (about 51.6-51.8), the short, and falls back into the demand box.",
        "notes": [
          "Cheaper stock, same setup as Google, timed with the S&P.",
          "Risk about $0.50 to make about $1.50: a 3:1 profit margin to the demand box."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"30\" y=\"80\" width=\"260\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"350\" y=\"80\" width=\"260\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"350\" y=\"230\" width=\"260\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Index at supply + stock at supply = short</text><line x1=\"320\" y1=\"40\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/><text x=\"30\" y=\"56\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">S&amp;P index</text><line x1=\"44\" y1=\"82\" x2=\"44\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"39\" y=\"88\" width=\"10\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"59\" y1=\"85\" x2=\"59\" y2=\"125\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"54\" y=\"90\" width=\"10\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"74\" y1=\"115\" x2=\"74\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"69\" y=\"120\" width=\"10\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"89\" y1=\"137.1\" x2=\"89\" y2=\"177\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"84\" y=\"142.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"104\" y1=\"163.1\" x2=\"104\" y2=\"203\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"99\" y=\"168.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"119\" y1=\"189.1\" x2=\"119\" y2=\"229\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"114\" y=\"194.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"134\" y1=\"215.1\" x2=\"134\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"129\" y=\"220.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"149\" y1=\"235\" x2=\"149\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"144\" y=\"240\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"164\" y1=\"191\" x2=\"164\" y2=\"247\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"159\" y=\"196\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"179\" y1=\"145\" x2=\"179\" y2=\"201\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"174\" y=\"150\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"194\" y1=\"92\" x2=\"194\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"189\" y=\"104\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"209\" y1=\"101\" x2=\"209\" y2=\"142\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"204\" y=\"106\" width=\"10\" height=\"31\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"224\" y1=\"127.3\" x2=\"224\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"219\" y=\"132.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"239\" y1=\"158.3\" x2=\"239\" y2=\"204\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"234\" y=\"163.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"189.3\" x2=\"254\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"249\" y=\"194.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><text x=\"350\" y=\"56\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">Stock</text><line x1=\"364\" y1=\"82\" x2=\"364\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"359\" y=\"88\" width=\"10\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"379\" y1=\"85\" x2=\"379\" y2=\"125\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"374\" y=\"90\" width=\"10\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"394\" y1=\"115\" x2=\"394\" y2=\"151\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"389\" y=\"120\" width=\"10\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"409\" y1=\"137.1\" x2=\"409\" y2=\"177\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"404\" y=\"142.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"163.1\" x2=\"424\" y2=\"203\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"419\" y=\"168.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"439\" y1=\"189.1\" x2=\"439\" y2=\"229\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"434\" y=\"194.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"454\" y1=\"215.1\" x2=\"454\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"449\" y=\"220.1\" width=\"10\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"469\" y1=\"235\" x2=\"469\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"464\" y=\"240\" width=\"10\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"484\" y1=\"191\" x2=\"484\" y2=\"247\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"479\" y=\"196\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"499\" y1=\"145\" x2=\"499\" y2=\"201\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"494\" y=\"150\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"514\" y1=\"92\" x2=\"514\" y2=\"152\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"509\" y=\"104\" width=\"10\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"529\" y1=\"101\" x2=\"529\" y2=\"142\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"524\" y=\"106\" width=\"10\" height=\"31\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"544\" y1=\"127.3\" x2=\"544\" y2=\"173\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"539\" y=\"132.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"559\" y1=\"158.3\" x2=\"559\" y2=\"204\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"554\" y=\"163.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"574\" y1=\"189.3\" x2=\"574\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"569\" y=\"194.3\" width=\"10\" height=\"35.7\" fill=\"#ef4444\" rx=\"1\"/><text x=\"350\" y=\"280\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">risk $0.50 to make $1.50</text><text x=\"30\" y=\"300\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">same moment, same kind of level</text></svg>",
        "caption": "Time stock trades with the index: when the S&P rallies into its supply, look for stocks rallying into their own supply at the same moment and short those with about 3:1 to the demand below."
      }
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Index level first, then stocks whose levels line up with it." }
    ],
    "checklist": [
      "Is the index at supply or demand right now?",
      "Does my stock's level line up with the index level?",
      "Did price leave the stock's level rapidly?",
      "Is reward at least 3x risk to the opposing level?"
    ],
    "journalTags": ["index-alignment", "pre-market-plan", "stocks", "goog", "rimm", "3to1"],
    "newVsPdfs": [
      "New: index-to-stock alignment; a possible FX analogue is checking DXY levels, which Kevin only mentions in passing."
    ]
  },
  {
    "n": 137,
    "title": "Gaps, Pro versus Novice",
    "kind": "article",
    "summary": "Gaps form when demand or supply at the prior close is out of balance. A professional gap goes against the prior move, comes at the start of moves and ignites them: join it on a pullback to the gap's origin. A novice gap goes with the prior move, comes at the end of moves and leads to reversals: fade it at the nearest support or resistance. Both need a significant profit margin.",
    "sections": [
      {
        "heading": "Why gaps form",
        "points": [
          "More demand than supply at the prior close: gap higher. More supply than demand: gap lower.",
          "The rules for gaps are the same in stocks, futures, forex and options."
        ]
      },
      {
        "heading": "Definitions and actions",
        "points": [
          "Professional gap: after a move, in the opposite direction. It starts and ignites a new move. Action: join it on a pullback to the origin of the gap, if there is a significant profit margin.",
          "Novice gap: after a move, in the same direction. It tends to mark the end of a move. Action: fade it at the nearest support or resistance, if there is a significant profit margin.",
          "After a pro gap down, price often rallies quickly to fill the gap and then continues lower; sell near the origin of the gap.",
          "A novice gap down means someone is selling after a decline and during a gap down, which usually means losses for that seller."
        ]
      },
      {
        "heading": "Trading the open",
        "points": [
          "The open is where supply and demand are most out of balance.",
          "Trading the open is not for beginners, but once you can quantify supply and demand it is a very good time to trade."
        ]
      },
      {
        "heading": "Chart (p139): SPY 30-min, pro gap and novice gap",
        "points": [
          "SPY 30-min from 2/2 to 2/12/2009, price about 81.4-87.6.",
          "A 'Price Support' line at about 81.4-81.5 comes from the 2/2 low (labelled 81.36).",
          "Price rallies in steps to about 87.5 by 2/9.",
          "'Pro Gap' (shaded oval, 2/10, about 86.6-87.0): a gap down after the big rally, against the rally, which starts the slide to about 83.",
          "'Novice Gap' (shaded oval, 2/12): a gap down from about 83.5 to about 81.7 after the decline, right onto the price-support line; price then rallies to about 83.98."
        ]
      }
    ],
    "rules": [
      "Pro gap: join on a pullback to the gap origin.",
      "Novice gap: fade at the nearest support/resistance.",
      "Both only with a significant profit margin.",
      "Beginners should not trade the open."
    ],
    "mistakes": [
      "Selling after a decline and during a gap down (novice gap).",
      "Chasing a pro gap instead of waiting for the pullback to its origin.",
      "New traders trading the open."
    ],
    "quotes": [
      "Gaps represent the ultimate supply and demand imbalance.",
      "These gaps tend to be found at the end of moves and lead to reversals."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p139-034.jpg",
        "caption": "SPY 30-min (2/2-2/12/2009): price support at 81.36 from the 2/2 low; price rallies in steps to about 87.5. 'Pro Gap' (2/10): a gap down after the rally, against it, that starts a slide to about 83. 'Novice Gap' (2/12): a gap down after the decline onto the price-support line at about 81.7; price then rallies.",
        "notes": [
          "Pro gap = against the prior move; it ignites a new move. Join it on a pullback to its origin.",
          "Novice gap = with the prior move into a level; it tends to end the move. Fade it.",
          "Both only with a significant profit margin."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"350\" y=\"268\" width=\"260\" height=\"24\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"604\" y=\"284\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">support</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Pro gap vs novice gap</text><line x1=\"320\" y1=\"40\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"4 4\"/><text x=\"30\" y=\"56\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">PRO gap (against the move)</text><line x1=\"30\" y1=\"255\" x2=\"30\" y2=\"295\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"25\" y=\"260\" width=\"10\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"45\" y1=\"225\" x2=\"45\" y2=\"269.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"230\" width=\"10\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"60\" y1=\"195\" x2=\"60\" y2=\"239.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"55\" y=\"200\" width=\"10\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"75\" y1=\"165\" x2=\"75\" y2=\"209.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"70\" y=\"170\" width=\"10\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"90\" y1=\"135\" x2=\"90\" y2=\"179.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"85\" y=\"140\" width=\"10\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"105\" y1=\"105\" x2=\"105\" y2=\"149.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"100\" y=\"110\" width=\"10\" height=\"34.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"120\" y1=\"99\" x2=\"120\" y2=\"117\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"115\" y=\"104\" width=\"10\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"135\" y1=\"145\" x2=\"135\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"150\" width=\"10\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"130\" y1=\"113\" x2=\"300\" y2=\"113\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"304\" y=\"117\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\"></text><line x1=\"150\" y1=\"135\" x2=\"150\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"145\" y=\"140\" width=\"10\" height=\"30\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"165\" y1=\"113\" x2=\"165\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"160\" y=\"118\" width=\"10\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><text x=\"130\" y=\"96\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">sell at gap origin</text><line x1=\"180\" y1=\"115\" x2=\"180\" y2=\"166.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"175\" y=\"120\" width=\"10\" height=\"41.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"195\" y1=\"150.1\" x2=\"195\" y2=\"207.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"190\" y=\"155.1\" width=\"10\" height=\"47.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"210\" y1=\"191.3\" x2=\"210\" y2=\"248.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"205\" y=\"196.3\" width=\"10\" height=\"47.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"225\" y1=\"232.6\" x2=\"225\" y2=\"290\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"220\" y=\"237.6\" width=\"10\" height=\"47.4\" fill=\"#ef4444\" rx=\"1\"/><text x=\"340\" y=\"56\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">NOVICE gap (with the move)</text><line x1=\"340\" y1=\"85\" x2=\"340\" y2=\"115\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"335\" y=\"90\" width=\"10\" height=\"20\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"355\" y1=\"102\" x2=\"355\" y2=\"135\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"350\" y=\"107\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"370\" y1=\"122\" x2=\"370\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"365\" y=\"127\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"385\" y1=\"142\" x2=\"385\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"380\" y=\"147\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"400\" y1=\"162\" x2=\"400\" y2=\"195\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"395\" y=\"167\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"415\" y1=\"182\" x2=\"415\" y2=\"215\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"410\" y=\"187\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"430\" y1=\"202\" x2=\"430\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"425\" y=\"207\" width=\"10\" height=\"23\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"445\" y1=\"266\" x2=\"445\" y2=\"292\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"440\" y=\"270\" width=\"10\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><text x=\"390\" y=\"318\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">gap down onto support: BUY (fade)</text><line x1=\"460\" y1=\"245\" x2=\"460\" y2=\"287\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"455\" y=\"250\" width=\"10\" height=\"32\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"475\" y1=\"220\" x2=\"475\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"470\" y=\"225\" width=\"10\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"490\" y1=\"195\" x2=\"490\" y2=\"230\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"485\" y=\"200\" width=\"10\" height=\"25\" fill=\"#22c55e\" rx=\"1\"/></svg>",
        "caption": "Professional gap versus novice gap. A pro gap goes against the prior move and starts a new one: join it on the pullback to its origin. A novice gap goes with the prior move into a level and ends it: fade it."
      }
    ],
    "diagrams": [],
    "checklist": [
      "Was there a prior move, and did the gap go with it or against it?",
      "Pro gap: am I waiting for the pullback to the gap origin?",
      "Novice gap: is there support/resistance to fade from?",
      "Is the profit margin significant?"
    ],
    "journalTags": ["pro-gap", "novice-gap", "gap-origin", "spy", "trading-the-open"],
    "newVsPdfs": [
      "New: the professional versus novice gap classification has no counterpart in Kevin's course."
    ]
  },
  {
    "n": 140,
    "title": "Q&A With Sam Seiden",
    "kind": "article",
    "summary": "Three student questions. In an uptrend a novice gap is a gap up after a strong rally, while a pro gap is a gap down after a rally, usually at resistance, which ends the uptrend. The best time for active equity traders is the open until about two hours in, with analysis done pre-market. Profit margin is the space between the supply and demand levels; without a significant one there is no trade.",
    "sections": [
      {
        "heading": "Khoi: pro gap versus novice gap in an uptrend",
        "points": [
          "Novice gap in an uptrend: a gap up after a strong rally; professionals do not buy after a strong rise, especially on a gap up.",
          "Pro gap in an uptrend: a gap down after a rally, usually at resistance; it ends the uptrend and starts a downtrend."
        ]
      },
      {
        "heading": "Tom: best time of day for equities",
        "points": [
          "At and around the open until about two hours into the day, because that is when supply and demand are most out of balance and direction is most predictable.",
          "Quantify levels pre-market and trade the market 'back to balance' at the open.",
          "New traders should not trade the open; XLT sessions start 30-60 minutes before the open to prepare."
        ]
      },
      {
        "heading": "Lisa: what is profit margin?",
        "points": [
          "The top shaded area is supply, the bottom is demand; the space between them is the profit margin.",
          "The plan was to short at supply and take profit at demand.",
          "Two good levels are not enough; there must also be a significant profit margin."
        ]
      },
      {
        "heading": "Chart 1 (p141): QQQQ 30-min, professional gap in an uptrend",
        "points": [
          "QQQQ 30-min, 12/9 to 12/26/2008, with a 10-period moving average. Price about 28.6-30.8.",
          "'Resistance' line at about 30.45 from the 12/9 high.",
          "Price falls to about 28.9, then an 'Uptrend' (arrow, 12/16) rallies back to resistance.",
          "'Pro-Gap' (circle, 12/17): a gap down at resistance, against the rally. The uptrend ends and price trends down to about 29.0 by 12/22-12/26."
        ]
      },
      {
        "heading": "Chart 2 (p142): SPY 30-min, novice gap in an uptrend",
        "points": [
          "SPY 30-min, 10/7 to 10/16/2008, with a 10-period moving average. Price about 85-107.",
          "'Resistance' lines at about 104.8 and 106 from the 10/7 highs.",
          "Price collapses to about 86 by 10/10, then an 'Uptrend' (arrow, 10/13) begins.",
          "'Novice Gap' (circle, 10/14): a big gap up after the rally, straight into resistance at about 105. Price then falls back to about 88-90 by 10/16."
        ]
      },
      {
        "heading": "Chart 3 (p144): RIMM 5-min, profit margin example",
        "points": [
          "The same RIMM 5-min chart as in 'Market Timing in the XLT Course': supply box about 51.70-52.05, demand box about 49.95-50.15.",
          "The space between the two boxes is the profit margin: short at the supply box, take profit at the demand box."
        ]
      }
    ],
    "rules": [
      "Uptrend: fade a gap up after a strong rally into resistance; join a gap down after a rally at resistance.",
      "Active equity window: the open to about two hours in, prepared pre-market.",
      "No significant profit margin = no trade."
    ],
    "mistakes": [
      "Buying a gap up after a strong rally.",
      "New traders trading the open.",
      "Taking a trade between two levels that are too close together."
    ],
    "quotes": [
      "Without the presence of a significant profit margin, there is no trading opportunity."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p141-036.jpg",
        "caption": "QQQQ 30-min (12/9-12/26/2008) with a 10-period moving average: resistance at about 30.45 from the 12/9 high. After an uptrend from about 28.9, the circled 'Pro-Gap' on 12/17 gaps down at resistance, against the rally; the uptrend ends and price trends down to about 29.0.",
        "notes": [
          "In an uptrend, a gap DOWN after a rally at resistance is the professional gap.",
          "It marks the end of the uptrend and the start of a downtrend."
        ]
      },
      {
        "src": "/lessons/seiden/p142-037.jpg",
        "caption": "SPY 30-min (10/7-10/16/2008) with a 10-period moving average: resistance lines at about 104.8-106 from the 10/7 highs. After the collapse to about 86 and a sharp uptrend, the circled 'Novice Gap' on 10/14 is a big gap up after the rally straight into resistance; price then falls back to about 88-90.",
        "notes": [
          "In an uptrend, a gap UP after a strong rally into resistance is the novice gap.",
          "Professionals do not buy after a strong rise, especially on a gap up: fade it."
        ]
      },
      {
        "src": "/lessons/seiden/p144-038.jpg",
        "caption": "RIMM 5-min (same chart as in 'Market Timing in the XLT Course'): supply box about 51.70-52.05 and demand box about 49.95-50.15; the space between them is the profit margin.",
        "notes": [
          "Profit margin = distance from the entry zone to the opposing zone.",
          "Short at the supply box, take profit at the demand box.",
          "Two good levels without a significant margin = no trade."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"60\" width=\"480\" height=\"32\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"514\" y=\"80\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">SUPPLY: short here</text><text x=\"524\" y=\"96\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"64\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><rect x=\"40\" y=\"262\" width=\"480\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"281\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">DEMAND: take profit</text><text x=\"524\" y=\"266\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"296\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Profit margin = space between the levels</text><line x1=\"60\" y1=\"70\" x2=\"60\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"53\" y=\"76\" width=\"14\" height=\"34\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"86\" y1=\"73\" x2=\"86\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"79\" y=\"78\" width=\"14\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"112\" y1=\"95\" x2=\"112\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"105\" y=\"100\" width=\"14\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"138\" y1=\"135\" x2=\"138\" y2=\"180\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"131\" y=\"140\" width=\"14\" height=\"35\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"164\" y1=\"170\" x2=\"164\" y2=\"215\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"157\" y=\"175\" width=\"14\" height=\"35\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"205\" x2=\"190\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"183\" y=\"210\" width=\"14\" height=\"30\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"216\" y1=\"236\" x2=\"216\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"209\" y=\"240\" width=\"14\" height=\"36\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"242\" y1=\"245\" x2=\"242\" y2=\"281\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"235\" y=\"250\" width=\"14\" height=\"26\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"268\" y1=\"200\" x2=\"268\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"261\" y=\"205\" width=\"14\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"294\" y1=\"155\" x2=\"294\" y2=\"210\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"287\" y=\"160\" width=\"14\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"320\" y1=\"115\" x2=\"320\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"313\" y=\"120\" width=\"14\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"346\" y1=\"70\" x2=\"346\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"339\" y=\"88\" width=\"14\" height=\"32\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"372\" y1=\"85\" x2=\"372\" y2=\"145\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"365\" y=\"90\" width=\"14\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"398\" y1=\"135\" x2=\"398\" y2=\"195\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"391\" y=\"140\" width=\"14\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"185\" x2=\"424\" y2=\"235\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"417\" y=\"190\" width=\"14\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"450\" y1=\"226\" x2=\"450\" y2=\"274\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"443\" y=\"230\" width=\"14\" height=\"36\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"560\" y1=\"96\" x2=\"560\" y2=\"258\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"560,258 556.5,250.8 563.5,250.8\" fill=\"#f59e0b\"/><line x1=\"560\" y1=\"258\" x2=\"560\" y2=\"96\" stroke=\"#f59e0b\" stroke-width=\"2\"/><polygon points=\"560,96 563.5,103.2 556.5,103.2\" fill=\"#f59e0b\"/><text x=\"572\" y=\"180\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">profit</text><text x=\"572\" y=\"196\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">margin</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">No significant profit margin = no trade.</text></svg>",
        "caption": "Profit margin is the space between supply above and demand below. Two good levels are not enough: short at supply and cover at demand only if that space is significant."
      }
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Profit margin = space between the entry level and the opposing level." }
    ],
    "checklist": [
      "Is this gap with or against the prior move?",
      "Am I trading within about two hours of the open, with levels already drawn?",
      "Is the distance to the opposing level significant?"
    ],
    "journalTags": ["pro-gap", "novice-gap", "time-of-day", "profit-margin", "qqqq", "spy"],
    "newVsPdfs": [
      "Differs: Kevin picks one session to trade; Seiden names the open to about two hours in for equities.",
      "Profit margin to the opposing zone matches Kevin's R:R-to-opposing-zone idea."
    ]
  },
  {
    "n": 144,
    "title": "Three Ways to Managing Risk",
    "kind": "article",
    "summary": "The best traders are professional losers. Seiden's three risk tools are protective stops (always stop-market, never stop-limit), proper position size (risk 1% of the account) and keeping losses small. An S&P short at gap supply shows stop placement and trailing the stop above new supply on a smaller timeframe, and a student's stats show a 29% win rate producing +46.79% because losses were small.",
    "sections": [
      {
        "heading": "Protective stops",
        "points": [
          "Stop-market order: becomes a market order once price passes the stop. Execution is almost guaranteed, the price is not (slippage). Seiden always uses it for protection.",
          "Stop-limit order: becomes a limit order at the stop price; it gives price control but no guaranteed exit. Example: bought at $41.00, stop limit at $40.50, no buyers there, and the loss keeps growing. He never uses it for protection.",
          "Place the initial stop just above where all the sellers are (for a short): just beyond the supply line, where price could not go."
        ]
      },
      {
        "heading": "Trailing the stop",
        "points": [
          "Drop to a smaller timeframe.",
          "Each strong decline candle creates new supply at its origin; move the buy stop down to just above that new supply.",
          "If the market is weak it should not rally above these new levels; this protects profit without giving much back. Mirror it for longs."
        ]
      },
      {
        "heading": "Position sizing",
        "points": [
          "Account $100,000, max risk 1% = $1,000. Buy at the top of the support zone, stop below the zone.",
          "Entry $22.30, stop $21.90, stop size $0.40, so 2,500 shares.",
          "A position-sizing grid keeps you mechanical; you do not want to be 'thinking' while the market moves."
        ]
      },
      {
        "heading": "Keeping losses small",
        "points": [
          "Four outcomes: big win, small win, small loss, big loss. Eliminate the big loss and you can live with the other three.",
          "Student stats (Roth IRA, start of 2009): 952 ticks, profit $13,185.73, 7 wins, 17 losses, avg win $2,528.29, avg loss $265.43, biggest winner $4,369.30, biggest loser $925.50, win rate 29.17%, P/L ratio 9.53, max risk 2% ($827.35), capital $28,182.00 to $41,367.73, net +46.79%.",
          "He feels no different about a winning or losing trade; he is executing a profitable plan."
        ]
      },
      {
        "heading": "Chart 1 (p146): SPY 60-min, short at gap supply",
        "points": [
          "SPY 60-min from 2/27 to 3/11/2009, price about 67.5-77.",
          "'Gap Supply': a black line at about 73.7, the origin of the late-February/early-March gap down.",
          "Price falls to about 67.5 by 3/9, then rallies; 3/10-3/11 gaps higher.",
          "'XLT Sells Short' at the gap supply line (about 73.7) on 3/11; 'Protective Buy Stop Market' is a short purple line just above it (about 73.9).",
          "'Profit Target - Gap Demand': a black line at about 72.1 marking the origin of the gap up, with arrows pointing up to it."
        ]
      },
      {
        "heading": "Chart 2 (p147): SPY 10-min, trailing the stop",
        "points": [
          "SPY 10-min, 3/10 to 3/11, price about 71.4-73.6.",
          "'Gap Demand' line at about 72.1 (the origin of the 3/11 gap up), with an arrow.",
          "'XLT Short Entry' (small circle) at about 73.6 near the 3/11 high shortly after the open.",
          "Two circled strong red decline candles (around 10:30 and 11:45). After the first, the stop moves to 'New Buy Stop Market Order' at about 73.45; after the second, to 'New Buy Stop' at about 73.1 (purple lines).",
          "Price falls to the gap demand line around 13:30, marked 'Profit Target'."
        ]
      },
      {
        "heading": "Figure (p148): position-sizing grid",
        "points": [
          "Account $100,000, max risk 1% ($1,000). Drawn candles fall to 'Price Support' between $22.30 and $21.90 (mid $22.10).",
          "'The Entry' at $22.30 (Buy); 'Protective Stop (the initial risk)' at $21.90; stop size $22.30 - $21.90 = $0.40.",
          "Grid: $0.10 = 10,000 shares; $0.20 = 5,000; $0.30 = 3,300; $0.40 = 2,500 (highlighted); $0.50 = 2,000; $0.60 = 1,600; $0.70 = 1,400; $0.80 = 1,250; $0.90 = 1,100; $1.00 = 1,000."
        ]
      }
    ],
    "rules": [
      "Use stop-market orders for protection; never stop-limit.",
      "Initial stop just beyond the zone, where the opposing orders sit.",
      "Trail on a smaller timeframe: move the stop beyond each new supply (short) or demand (long) left by a strong candle.",
      "Risk a fixed 1% per trade and size from the stop distance.",
      "Eliminate big losses; let winners reach pre-planned targets."
    ],
    "mistakes": [
      "Using a stop-limit for protection.",
      "Thinking about size while the market is moving instead of using a grid.",
      "Needing to be right; letting a loss become big.",
      "Judging a system by win rate alone."
    ],
    "quotes": [
      "What the best traders have in common, however, is that they are very professional losers.",
      "As a trader, I NEVER use this order for protection."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p146-040.jpg",
        "caption": "SPY 60-min (2/27-3/11/2009): 'Gap Supply' line at about 73.7, the origin of an earlier gap down. Price falls to about 67.5, then rallies and gaps higher on 3/10-3/11. 'XLT Sells Short' at the gap supply line on 3/11 with a 'Protective Buy Stop Market' just above (about 73.9); 'Profit Target - Gap Demand' at about 72.1, the origin of the gap up.",
        "notes": [
          "Initial stop just beyond the level, as a stop-market order.",
          "Target is the opposing level: the origin of the gap up.",
          "Gaps leave both supply and demand behind."
        ]
      },
      {
        "src": "/lessons/seiden/p147-041.jpg",
        "caption": "SPY 10-min (3/10-3/11): the short entry circled at about 73.6 near the 3/11 high; 'Gap Demand' line at about 72.1. Two circled strong red decline candles (about 10:30 and 11:45); after each, the buy stop moves down to just above the new supply (about 73.45, then about 73.1). Price reaches the gap demand line around 13:30, the profit target.",
        "notes": [
          "Trail the stop on a smaller timeframe.",
          "Each strong decline candle leaves new supply at its origin; move the stop just above it.",
          "If the market is truly weak it will not rally back above those levels."
        ]
      },
      {
        "src": "/lessons/seiden/p148-042.jpg",
        "caption": "Position-sizing slide: account $100,000, max risk 1% ($1,000). Drawn candles fall to price support between $22.30 and $21.90; entry at $22.30, protective stop at $21.90, stop size $0.40. A grid lists shares by stop size; $0.40 = 2,500 shares is highlighted.",
        "notes": [
          "Size = maximum dollar risk / stop distance.",
          "Buy at the top of the zone, stop below the bottom of the zone.",
          "Use a pre-computed grid so you never think about size while the market moves."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Trail the stop above each new supply</text><line x1=\"30\" y1=\"155\" x2=\"30\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"160\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"105\" x2=\"46\" y2=\"165\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"110\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"62\" x2=\"62\" y2=\"114\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"70\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><text x=\"48\" y=\"52\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">short entry</text><line x1=\"78\" y1=\"69\" x2=\"78\" y2=\"97\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"74\" width=\"12\" height=\"18\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"79\" x2=\"94\" y2=\"97\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"84\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"79\" x2=\"110\" y2=\"105\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"84\" width=\"12\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"95\" x2=\"126\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"100\" width=\"12\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"142\" y1=\"135\" x2=\"142\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"140\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"135\" x2=\"158\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"140\" width=\"12\" height=\"8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"174\" y1=\"143\" x2=\"174\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"148\" width=\"12\" height=\"52\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"185\" x2=\"190\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"190\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"187\" x2=\"206\" y2=\"210\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"192\" width=\"12\" height=\"13\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"200\" x2=\"222\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"205\" width=\"12\" height=\"45\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"235\" x2=\"238\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"240\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"254\" y1=\"235\" x2=\"254\" y2=\"267\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"240\" width=\"12\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"60\" y1=\"56\" x2=\"500\" y2=\"56\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"504\" y=\"60\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">initial stop</text><line x1=\"126\" y1=\"78\" x2=\"500\" y2=\"78\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"504\" y=\"82\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">new stop 1</text><line x1=\"174\" y1=\"132\" x2=\"500\" y2=\"132\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"504\" y=\"136\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">new stop 2</text><line x1=\"222\" y1=\"184\" x2=\"500\" y2=\"184\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"504\" y=\"188\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">new stop 3</text><line x1=\"30\" y1=\"262\" x2=\"500\" y2=\"262\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"504\" y=\"266\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">target</text><ellipse cx=\"126\" cy=\"125\" rx=\"13\" ry=\"32\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><ellipse cx=\"174\" cy=\"174\" rx=\"13\" ry=\"32\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><ellipse cx=\"222\" cy=\"227\" rx=\"13\" ry=\"32\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Use a stop-market order (guaranteed exit), never a stop-limit for protection.</text></svg>",
        "caption": "Trailing the stop on a smaller timeframe: every strong red candle leaves new supply at its origin. Move the protective buy stop to just above that new supply; a weak market should not rally back through it."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"196\" width=\"340\" height=\"42\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"374\" y=\"221\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">support</text><text x=\"384\" y=\"200\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"384\" y=\"242\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Size = max risk / stop distance</text><line x1=\"40\" y1=\"65\" x2=\"40\" y2=\"101\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"34\" y=\"70\" width=\"12\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"56\" y1=\"87.1\" x2=\"56\" y2=\"127\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"50\" y=\"92.1\" width=\"12\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"72\" y1=\"113.1\" x2=\"72\" y2=\"153\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"66\" y=\"118.1\" width=\"12\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"88\" y1=\"139.1\" x2=\"88\" y2=\"179\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"82\" y=\"144.1\" width=\"12\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"104\" y1=\"165.1\" x2=\"104\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"98\" y=\"170.1\" width=\"12\" height=\"29.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"120\" y1=\"196\" x2=\"120\" y2=\"236\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"114\" y=\"200\" width=\"12\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"136\" y1=\"195\" x2=\"136\" y2=\"227\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"130\" y=\"200\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"152\" y1=\"167.5\" x2=\"152\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"146\" y=\"172.5\" width=\"12\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"168\" y1=\"140\" x2=\"168\" y2=\"181.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"162\" y=\"145\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"184\" y1=\"112.5\" x2=\"184\" y2=\"154.1\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"178\" y=\"117.5\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"200\" y1=\"85\" x2=\"200\" y2=\"126.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"194\" y=\"90\" width=\"12\" height=\"31.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"216\" y1=\"85\" x2=\"216\" y2=\"121.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"210\" y=\"90\" width=\"12\" height=\"26.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"232\" y1=\"107.5\" x2=\"232\" y2=\"148\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"226\" y=\"112.5\" width=\"12\" height=\"30.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"248\" y1=\"134\" x2=\"248\" y2=\"174.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"242\" y=\"139\" width=\"12\" height=\"30.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"160.5\" x2=\"264\" y2=\"201\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"258\" y=\"165.5\" width=\"12\" height=\"30.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"280\" y1=\"165\" x2=\"280\" y2=\"201\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"274\" y=\"170\" width=\"12\" height=\"26\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"296\" y1=\"125\" x2=\"296\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"290\" y=\"130\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><text x=\"44\" y=\"190\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">$22.30 entry</text><text x=\"44\" y=\"256\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">$21.90 stop</text><rect x=\"450\" y=\"70\" width=\"170\" height=\"175\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"465\" y=\"92\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">stop</text><text x=\"605\" y=\"92\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">shares</text><text x=\"465\" y=\"120\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"400\">$0.20</text><text x=\"605\" y=\"120\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"end\" font-weight=\"400\">5,000</text><text x=\"465\" y=\"146\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"400\">$0.30</text><text x=\"605\" y=\"146\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"end\" font-weight=\"400\">3,300</text><text x=\"465\" y=\"172\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">$0.40</text><text x=\"605\" y=\"172\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"end\" font-weight=\"600\">2,500</text><text x=\"465\" y=\"198\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"400\">$0.50</text><text x=\"605\" y=\"198\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"end\" font-weight=\"400\">2,000</text><text x=\"465\" y=\"224\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"start\" font-weight=\"400\">$0.60</text><text x=\"605\" y=\"224\" fill=\"#94a3b8\" font-size=\"13\" text-anchor=\"end\" font-weight=\"400\">1,600</text><text x=\"20\" y=\"330\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">$1,000 / $0.40 = 2,500 shares</text></svg>",
        "caption": "Position size from the stop: risk 1% of a $100,000 account ($1,000). Buy at the top of support $22.30, stop below at $21.90; a $0.40 stop allows 2,500 shares."
      }
    ],
    "diagrams": [
      { "key": "entry-stop-tp", "caption": "Short at gap supply, stop-market above, target gap demand; trail above new LTF supply." }
    ],
    "checklist": [
      "Is my stop a stop-market order beyond the zone?",
      "Is size = (1% of account) / stop distance?",
      "Do I have a rule for trailing the stop on a smaller timeframe?",
      "Is the target a pre-planned opposing level?",
      "Could this trade produce a big loss? If so, fix it before entry."
    ],
    "journalTags": ["stop-market", "trailing-stop", "position-sizing", "one-percent-risk", "keep-losses-small", "spy"],
    "newVsPdfs": [
      "New: stop-market versus stop-limit; for an EA this means a server-side stop that exits at market, never a pending stop-limit exit.",
      "Similar to Kevin's trailing below each new zone, but Seiden specifies a smaller timeframe and the origin of each strong candle.",
      "1% sizing matches Kevin; the student's 2% max risk is above Kevin's norm."
    ]
  },
  {
    "n": 150,
    "title": "News and Price, A Relationship Often Misunderstood",
    "kind": "article",
    "summary": "New traders assume bad news means price must fall. On 4/1/2009 the ADP report showed a much bigger drop in jobs than expected, and sellers pushed the NASDAQ straight into a pre-drawn drop-base-rally demand level, from which it rallied hard. Filter the news through the chart: only sell on bad news if price is at supply.",
    "sections": [
      {
        "heading": "The news illusion",
        "points": [
          "Markets are flooded with conflicting news each morning.",
          "Bad news creates perceptions, perceptions create trades, and trades become candles: all influences are reflected in price.",
          "In XLT pre-market sessions, bad news often leads Seiden to look for a low-risk place to buy the S&P or related stocks."
        ]
      },
      {
        "heading": "The 4/1/2009 example",
        "points": [
          "ADP: non-farm private employment fell by 742,000 in March versus an expected 663,000 (February revised to -706,000).",
          "Traders who heard it sold after a drop and into a level where demand exceeded supply: a demand level with a decline-base-rally (pivot low) structure.",
          "Once the last seller sold, price shot higher; the news was the invitation for sellers to take novice action."
        ]
      },
      {
        "heading": "Chart (p152): E-mini NASDAQ 60-min",
        "points": [
          "@NQ 60-min, 3/27 to 4/2/2009, price about 1,204-1,280.",
          "'XLT Demand': two lines at about 1,204 and 1,214 around the 3/30 low (drop-base-rally) from which price rallied to about 1,252.",
          "Price drifts back down over 3/31-4/1; a gray circle on 4/1 at about 1,214 ('Buying Opportunity') marks the dip into the top of demand on the news.",
          "Price then rallies to about 1,279 by 4/2."
        ]
      }
    ],
    "rules": [
      "Bad news that pushes price into pre-drawn demand is a buy opportunity.",
      "Before selling on bad news, make sure price is at supply, not demand.",
      "Draw levels before the news; let the news deliver price to them."
    ],
    "mistakes": [
      "Assuming bad news means price must fall.",
      "Selling on bad news after a decline and into demand."
    ],
    "quotes": [
      "Filter your perception of the news through the objective supply and demand equation."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p152-044.jpg",
        "caption": "E-mini NASDAQ 60-min (3/27-4/2/2009): 'XLT Demand' between about 1,204 and 1,214 around the 3/30 drop-base-rally low. Price rallies to about 1,252, drifts back over 3/31-4/1, and on the bad ADP news dips to about 1,214 (gray circle, 'Buying Opportunity'); price then rallies to about 1,279.",
        "notes": [
          "Draw the levels before the news; let the news deliver price to them.",
          "Sellers on bad news after a decline and into demand are the novice side.",
          "Buy at the proximal line, stop below the distal line."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"102\" y=\"238\" width=\"418\" height=\"44\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"264\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">DBR demand</text><text x=\"524\" y=\"242\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"286\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Bad news into demand = buying opportunity</text><line x1=\"30\" y1=\"65\" x2=\"30\" y2=\"109\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"70\" width=\"12\" height=\"34\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"93.9\" x2=\"46\" y2=\"143\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"98.9\" width=\"12\" height=\"39.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"127.9\" x2=\"62\" y2=\"177\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"132.9\" width=\"12\" height=\"39.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"161.9\" x2=\"78\" y2=\"211\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"166.9\" width=\"12\" height=\"39.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"195.9\" x2=\"94\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"200.9\" width=\"12\" height=\"39.1\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"236\" x2=\"110\" y2=\"280\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"240\" width=\"12\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"126\" y1=\"240\" x2=\"126\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"245\" width=\"12\" height=\"17\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"219.2\" x2=\"142\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"224.2\" width=\"12\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"198.3\" x2=\"158\" y2=\"232.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"203.3\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"177.5\" x2=\"174\" y2=\"211.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"182.5\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"156.7\" x2=\"190\" y2=\"190.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"161.7\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"135.8\" x2=\"206\" y2=\"169.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"140.8\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"115\" x2=\"222\" y2=\"149\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"120\" width=\"12\" height=\"24\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"238\" y1=\"115\" x2=\"238\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"120\" width=\"12\" height=\"80\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"185\" x2=\"254\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"190\" width=\"12\" height=\"10\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"185\" x2=\"270\" y2=\"210\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"190\" width=\"12\" height=\"15\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"286\" y1=\"198\" x2=\"286\" y2=\"248\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"205\" width=\"12\" height=\"35\" fill=\"#ef4444\" rx=\"1\"/><text x=\"242\" y=\"300\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">news: sellers hit demand</text><line x1=\"302\" y1=\"185\" x2=\"302\" y2=\"245\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"190\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"145\" x2=\"318\" y2=\"195\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"150\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"334\" y1=\"105\" x2=\"334\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"110\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"350\" y1=\"65\" x2=\"350\" y2=\"115\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"70\" width=\"12\" height=\"40\" fill=\"#22c55e\" rx=\"1\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Filter the news through supply and demand: is it pushing price into demand or supply?</text></svg>",
        "caption": "Bad news is the invitation: the demand level (drop-base-rally) is drawn before the report; the news pushes price into its proximal line, novices sell, and the buyer at demand gets paid."
      }
    ],
    "diagrams": [],
    "checklist": [
      "Where is price relative to my pre-drawn levels when the news hits?",
      "Is the news pushing price into demand (buy) or supply (sell)?",
      "Am I about to sell after a decline into demand?"
    ],
    "journalTags": ["news-into-demand", "adp", "drop-base-rally", "nasdaq-futures"],
    "newVsPdfs": [
      "Differs from Kevin: he says do not day-trade the news and wait for spreads to settle; Seiden actively buys when news drives price into demand. Both agree news should not override a valid setup."
    ]
  },
  {
    "n": 154,
    "title": "Identifying Turning Points Begins With Proper Focus",
    "kind": "article",
    "summary": "Most trading problems (stops, management) are really poor entries. Seiden's shift in focus: do not scan for bases, which are everywhere; first find the strong momentum move, then follow it back to its origin, where the key supply or demand level will be. Crude oil and Qualcomm charts show the A-B-C-D sequence.",
    "sections": [
      {
        "heading": "Why entries matter most",
        "points": [
          "Identifying turning points is the most important part of trading; without it you cannot manage risk.",
          "Almost every problem traders report is a function of poor entry points."
        ]
      },
      {
        "heading": "The shift in focus",
        "points": [
          "Most traders look first for area A, the basing. Basing is everywhere, so this leads to many poor levels.",
          "Instead, look first for area B, the strong move; then follow price back to its origin. That is likely the key level.",
          "Step 1: identify strong momentum moves. Step 2: find the origin of each move.",
          "Buy the revisit at C from a seller making both mistakes; target the opposing level D."
        ]
      },
      {
        "heading": "Chart 1 (p155): Crude oil (QM) 60-min, demand",
        "points": [
          "@QM (e-mini crude) 60-min, 4/1 to 4/13/2009, with volume. Price about 47.3-52.5.",
          "A: three or four candles basing sideways on 4/1-4/2, wrapped by lines at about 47.3 and 48.0.",
          "B: a gray oval over the strong rally out of A, to about 51.5-52.0.",
          "D: a supply line at about 52.0 at the 4/3-4/6 highs.",
          "Price declines over 4/6-4/7; C (4/8) is the revisit of A at about 48.0, followed by a rally to D at about 52.0 on 4/9. Last price 49.45 after a late drop."
        ]
      },
      {
        "heading": "Chart 2 (p156): Qualcomm 60-min, supply",
        "points": [
          "QCOM 60-min, 4/8 to 4/16/2009, price about 39.2-42.0.",
          "After a rally from about 39.2, A: small candles at the top on 4/9, wrapped by lines at about 41.5 and 41.85.",
          "B: a gray oval over the strong drop on 4/13 out of A.",
          "D: a demand zone at about 40.1-40.5 around the 4/15 base.",
          "C (4/16): price rallies back into A at about 41.5: the short, targeting D. Last price 40.85."
        ]
      }
    ],
    "rules": [
      "Step 1: find a strong momentum move. Step 2: go to its origin and draw the zone there.",
      "Enter on the first revisit of the origin (C).",
      "Target the nearest opposing level (D)."
    ],
    "mistakes": [
      "Scanning charts for bases first.",
      "Blaming stops or trade management when the real problem is the entry location."
    ],
    "quotes": [
      "Make the FIRST thing you look for area 'B', the STRONG move in price.",
      "Almost every trading problem... is directly a function of poor entry points."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p155-046.jpg",
        "caption": "E-mini crude (@QM) 60-min (4/1-4/13/2009) with volume: A is a base of three or four candles at about 47.3-48.0; B (gray oval) the strong rally out of it to about 51.5-52.0; D a supply line at about 52.0. Price declines and C (4/8) is the revisit of A at about 48.0, followed by a rally to D on 4/9.",
        "notes": [
          "Look for B, the strong move, first; then go to its origin A.",
          "Buy the first revisit C; target the opposing level D.",
          "Basing alone is everywhere; the strong move away is what makes A special."
        ]
      },
      {
        "src": "/lessons/seiden/p156-047.jpg",
        "caption": "Qualcomm 60-min (4/8-4/16/2009): after a rally, A is a small base at the top on 4/9 at about 41.5-41.85; B (gray oval) the strong drop out of it on 4/13; D a demand zone at about 40.1-40.5 around the 4/15 base. C (4/16): price rallies back into A, the short, targeting D.",
        "notes": [
          "Same process for supply: strong drop B, origin A, revisit C, target D.",
          "Short at the proximal (lower) line of A, stop above the upper line."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"70\" y=\"246\" width=\"450\" height=\"30\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"524\" y=\"250\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"280\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Find the strong move B first, then its origin A</text><line x1=\"30\" y1=\"195\" x2=\"30\" y2=\"221.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"200\" width=\"12\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"46\" y1=\"209.2\" x2=\"46\" y2=\"238.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"214.2\" width=\"12\" height=\"19.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"225.8\" x2=\"62\" y2=\"255\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"230.8\" width=\"12\" height=\"19.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"247\" x2=\"78\" y2=\"269\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"252\" width=\"12\" height=\"12\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"94\" y1=\"247\" x2=\"94\" y2=\"269\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"252\" width=\"12\" height=\"12\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"247\" x2=\"110\" y2=\"269\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"253.2\" width=\"12\" height=\"8.4\" fill=\"#22c55e\" rx=\"1\"/><text x=\"40\" y=\"300\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">A: origin</text><line x1=\"126\" y1=\"195\" x2=\"126\" y2=\"265\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"200\" width=\"12\" height=\"60\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"135\" x2=\"142\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"140\" width=\"12\" height=\"60\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"85\" x2=\"158\" y2=\"145\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"90\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><ellipse cx=\"142\" cy=\"175\" rx=\"34\" ry=\"92\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"120\" y=\"290\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">B: strong move</text><line x1=\"174\" y1=\"65\" x2=\"174\" y2=\"97\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"70\" width=\"12\" height=\"22\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"67\" x2=\"190\" y2=\"93\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"72\" width=\"12\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"206\" y1=\"75\" x2=\"206\" y2=\"93\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"80\" width=\"12\" height=\"8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"162\" y1=\"66\" x2=\"520\" y2=\"66\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"524\" y=\"70\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">D: supply target</text><line x1=\"222\" y1=\"77\" x2=\"222\" y2=\"114.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"82\" width=\"12\" height=\"27.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"100.2\" x2=\"238\" y2=\"141.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"105.2\" width=\"12\" height=\"31.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"127.6\" x2=\"254\" y2=\"169\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"132.6\" width=\"12\" height=\"31.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"154.9\" x2=\"270\" y2=\"196.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"159.9\" width=\"12\" height=\"31.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"286\" y1=\"182.2\" x2=\"286\" y2=\"223.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"187.2\" width=\"12\" height=\"31.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"302\" y1=\"209.6\" x2=\"302\" y2=\"251\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"214.6\" width=\"12\" height=\"31.4\" fill=\"#ef4444\" rx=\"1\"/><text x=\"288\" y=\"300\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">C: first revisit = BUY</text><line x1=\"318\" y1=\"195\" x2=\"318\" y2=\"255\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"200\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"334\" y1=\"145\" x2=\"334\" y2=\"205\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"150\" width=\"12\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"350\" y1=\"100\" x2=\"350\" y2=\"155\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344\" y=\"105\" width=\"12\" height=\"45\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"366\" y1=\"67\" x2=\"366\" y2=\"110\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"360\" y=\"72\" width=\"12\" height=\"33\" fill=\"#22c55e\" rx=\"1\"/><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Basing is everywhere; strong moves are not. Start from the move.</text></svg>",
        "caption": "Look for B (the strong move) first, then follow it back to its origin A and draw the zone there. Buy the first revisit C from the seller making both mistakes and target the opposing level D."
      }
    ],
    "diagrams": [
      { "key": "draw", "caption": "Find the strong move (B) first, then draw the zone at its origin (A)." },
      { "key": "sequence", "caption": "A base, B strong move, C revisit entry, D opposing-level target." }
    ],
    "checklist": [
      "Did I start from a strong momentum move?",
      "Is my zone at the origin of that move?",
      "Is this the first revisit?",
      "Is there an opposing level far enough away for the target?"
    ],
    "journalTags": ["strong-move-first", "origin", "abcd-sequence", "crude-oil", "qcom"],
    "newVsPdfs": [
      "Same process as Kevin's 'find the large move away, then go to the origin' from his intro lesson."
    ]
  },
  {
    "n": 157,
    "title": "Scanning for Opportunity, the Old-Fashioned Way",
    "kind": "article",
    "summary": "Cut off: this range covers the start of the article (pp157-160) and it continues in the next part with the sector (XLF) step. Seiden describes his top-down scan (index, then a few large sectors, then a handful of high-volume stocks, all at the same kind of level), ranking candidates by largest profit margin, and why he dropped automated scanners. The S&P step shows an unfilled gap origin acting as demand on 4/21/09.",
    "sections": [
      {
        "heading": "Background",
        "points": [
          "He started on the CME floor and drew charts by hand with graph paper and coloured pencils, which taught him where significant buyers and sellers were.",
          "For years he wrote daily advisory letters using a top-down scan each afternoon after the close."
        ]
      },
      {
        "heading": "The three-step top-down scan",
        "points": [
          "Step 1: find demand and supply in the S&P and NASDAQ. If they closed near demand, look for buys the next day.",
          "Step 2: check a few large sectors for ones also near demand; one or two usually set up well with the broad market.",
          "Step 3: look at a handful of high-volume stocks in those sectors that are also near demand.",
          "If more than three or four candidates qualify, choose those with the largest profit margin: at or near demand and farthest from supply."
        ]
      },
      {
        "heading": "Dropping automated scanners",
        "points": [
          "He tried every scanning product, scrolling hundreds of symbols for hours, and found it made an easy process hard.",
          "Seeing children with coloured pencils in a library reminded him the power was in the old-fashioned analysis; he has not used an automated scanner since."
        ]
      },
      {
        "heading": "Chart (p160): SPY 60-min, unfilled gap as demand",
        "points": [
          "SPY 60-min, 4/6 to 4/23/2009, price about 81.8-87.5.",
          "Price bases around 82-83 on 4/7-4/8, then gaps up on 4/9 to about 84.8. A black line labelled 'S&P Fills a Gap' at about 82.8 marks the origin of that unfilled gap.",
          "Price rallies to about 87.3 by 4/17, then drops on 4/20.",
          "An arrow at '4/21/09' marks the gap down into the line at about 82.9; price rallies strongly most of that day to about 85-86. Last price 84.52.",
          "The article continues in the next part with the Financial Service Sector (XLF) chart."
        ]
      }
    ],
    "rules": [
      "Scan top-down: index, then sectors, then a handful of stocks.",
      "All three layers should be at the same kind of level (all at demand for buys).",
      "Rank candidates by profit margin (distance to the opposing level).",
      "An unfilled gap origin can act as quality demand."
    ],
    "mistakes": [
      "Spending hours on automated scanners and hundreds of symbols.",
      "Picking stocks without checking the index and sector first."
    ],
    "quotes": [
      "I would choose the stocks that had the largest profit margins."
    ],
    "images": [
      {
        "src": "/lessons/seiden/p160-049.jpg",
        "caption": "SPY 60-min (4/6-4/23/2009): price bases around 82-83, then gaps up on 4/9; a line labelled 'S&P Fills a Gap' at about 82.8 marks the origin of that unfilled gap. Price rallies to about 87.3, drops on 4/20, and on 4/21 (arrow) gaps down into the line at about 82.9 before rallying strongly to about 85-86.",
        "notes": [
          "An unfilled gap origin acts as demand.",
          "Step 1 of the scan: the index closed near demand, so look for buys in sectors and stocks.",
          "The gap down into it was a with-trend novice gap into demand."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"28\" y=\"82\" width=\"174\" height=\"16\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"28\" y=\"250\" width=\"174\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"97\" width=\"174\" height=\"16\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"233\" y=\"250\" width=\"174\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"438\" y=\"112\" width=\"174\" height=\"16\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"438\" y=\"250\" width=\"174\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Index → sector → stock, all at demand</text><rect x=\"20\" y=\"40\" width=\"190\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"30\" y=\"60\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">1) S&amp;P / NASDAQ</text><line x1=\"40\" y1=\"236\" x2=\"40\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"34.5\" y=\"240\" width=\"11\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"60\" y1=\"215\" x2=\"60\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"54.5\" y=\"220\" width=\"11\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"80\" y1=\"165\" x2=\"80\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"74.5\" y=\"170\" width=\"11\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"100\" y1=\"89\" x2=\"100\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"94.5\" y=\"94\" width=\"11\" height=\"76\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"120\" y1=\"89\" x2=\"120\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"114.5\" y=\"94\" width=\"11\" height=\"56\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"140\" y1=\"145\" x2=\"140\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"134.5\" y=\"150\" width=\"11\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"160\" y1=\"195\" x2=\"160\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"154.5\" y=\"200\" width=\"11\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"180\" y1=\"236\" x2=\"180\" y2=\"262\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"174.5\" y=\"240\" width=\"11\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><text x=\"30\" y=\"300\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">at demand</text><rect x=\"225\" y=\"40\" width=\"190\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"235\" y=\"60\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">2) Sector</text><line x1=\"245\" y1=\"236\" x2=\"245\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"239.5\" y=\"240\" width=\"11\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"265\" y1=\"215\" x2=\"265\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.5\" y=\"220\" width=\"11\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"285\" y1=\"165\" x2=\"285\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"279.5\" y=\"170\" width=\"11\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"305\" y1=\"104\" x2=\"305\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"299.5\" y=\"109\" width=\"11\" height=\"61\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"325\" y1=\"104\" x2=\"325\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"319.5\" y=\"109\" width=\"11\" height=\"41\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"345\" y1=\"145\" x2=\"345\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"339.5\" y=\"150\" width=\"11\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"365\" y1=\"195\" x2=\"365\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"359.5\" y=\"200\" width=\"11\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"385\" y1=\"236\" x2=\"385\" y2=\"262\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"379.5\" y=\"240\" width=\"11\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><text x=\"235\" y=\"300\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">at demand</text><rect x=\"430\" y=\"40\" width=\"190\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"4\"/><text x=\"440\" y=\"60\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">3) Stock</text><line x1=\"450\" y1=\"236\" x2=\"450\" y2=\"270\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"444.5\" y=\"240\" width=\"11\" height=\"22\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"470\" y1=\"215\" x2=\"470\" y2=\"267\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"464.5\" y=\"220\" width=\"11\" height=\"42\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"490\" y1=\"165\" x2=\"490\" y2=\"225\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"484.5\" y=\"170\" width=\"11\" height=\"50\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"510\" y1=\"119\" x2=\"510\" y2=\"175\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"504.5\" y=\"124\" width=\"11\" height=\"46\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"530\" y1=\"119\" x2=\"530\" y2=\"155\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"524.5\" y=\"124\" width=\"11\" height=\"26\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"550\" y1=\"145\" x2=\"550\" y2=\"205\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"544.5\" y=\"150\" width=\"11\" height=\"50\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"570\" y1=\"195\" x2=\"570\" y2=\"245\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"564.5\" y=\"200\" width=\"11\" height=\"40\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"590\" y1=\"236\" x2=\"590\" y2=\"262\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"584.5\" y=\"240\" width=\"11\" height=\"14\" fill=\"#ef4444\" rx=\"1\"/><text x=\"440\" y=\"300\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">at demand</text><text x=\"20\" y=\"340\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Most room to supply = largest profit margin = first choice.</text></svg>",
        "caption": "Top-down scan: index, then a sector, then a handful of stocks, all at demand at the same time. Among the candidates, pick the one with the largest profit margin to the supply above."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"80\" y=\"238\" width=\"440\" height=\"20\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"514\" y=\"252\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">gap origin</text><text x=\"524\" y=\"242\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"524\" y=\"262\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Unfilled gap origin as demand</text><line x1=\"30\" y1=\"237\" x2=\"30\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"24\" y=\"242\" width=\"12\" height=\"16\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"46\" y1=\"237\" x2=\"46\" y2=\"263\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"40\" y=\"242\" width=\"12\" height=\"16\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"62\" y1=\"237\" x2=\"62\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"56\" y=\"243.6\" width=\"12\" height=\"11.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"78\" y1=\"237\" x2=\"78\" y2=\"263\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72\" y=\"243.6\" width=\"12\" height=\"10.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"237\" x2=\"94\" y2=\"263\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88\" y=\"245.2\" width=\"12\" height=\"8.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"175\" x2=\"110\" y2=\"211\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"104\" y=\"180\" width=\"12\" height=\"26\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"161.7\" x2=\"126\" y2=\"187\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120\" y=\"166.7\" width=\"12\" height=\"15.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"142\" y1=\"146.3\" x2=\"142\" y2=\"174\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"136\" y=\"151.3\" width=\"12\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"158\" y1=\"131\" x2=\"158\" y2=\"158.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152\" y=\"136\" width=\"12\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"115.7\" x2=\"174\" y2=\"143.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"168\" y=\"120.7\" width=\"12\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"190\" y1=\"100.3\" x2=\"190\" y2=\"128\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184\" y=\"105.3\" width=\"12\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"85\" x2=\"206\" y2=\"112.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"200\" y=\"90\" width=\"12\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"87\" x2=\"222\" y2=\"116.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"216\" y=\"92\" width=\"12\" height=\"19.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"103.6\" x2=\"238\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232\" y=\"108.6\" width=\"12\" height=\"22.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"123.1\" x2=\"254\" y2=\"155.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248\" y=\"128.1\" width=\"12\" height=\"22.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"142.6\" x2=\"270\" y2=\"175\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"264\" y=\"147.6\" width=\"12\" height=\"22.4\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"286\" y1=\"198\" x2=\"286\" y2=\"252\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280\" y=\"205\" width=\"12\" height=\"39\" fill=\"#ef4444\" rx=\"1\"/><text x=\"242\" y=\"290\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">gap down into origin: BUY</text><line x1=\"302\" y1=\"205\" x2=\"302\" y2=\"249\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296\" y=\"210\" width=\"12\" height=\"34\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"170\" x2=\"318\" y2=\"215\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"312\" y=\"175\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"334\" y1=\"135\" x2=\"334\" y2=\"180\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"328\" y=\"140\" width=\"12\" height=\"35\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"360\" y1=\"274\" x2=\"520\" y2=\"274\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"524\" y=\"278\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text></svg>",
        "caption": "An unfilled gap origin acts as demand: price bases, gaps up and rallies; when it later gaps down into the origin of that gap, buyers waiting there push it back up."
      }
    ],
    "diagrams": [
      { "key": "mtf", "caption": "Top-down: index, then sector, then stock, all at demand." }
    ],
    "checklist": [
      "Is the index at demand (or supply)?",
      "Is a major sector at the same kind of level?",
      "Is the stock at the same kind of level, with high volume?",
      "Among candidates, does this one have the largest profit margin?"
    ],
    "journalTags": ["top-down-scan", "sector", "profit-margin-ranking", "gap-origin-demand", "spy"],
    "newVsPdfs": [
      "New: a sector layer and ranking candidates by largest profit margin.",
      "Differs: Seiden treats an unfilled gap origin as demand; Kevin told a student a gap area was not a zone."
    ]
  }
];
