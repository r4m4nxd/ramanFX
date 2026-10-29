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
    "images": [
      {
        "src": "/lessons/seiden/p161-000.jpg",
        "caption": "XLF daily, Jan to Apr 2009: a small base around 9.2-9.6 gaps higher at A; the grey box wraps that gap origin. On 4/21/09 (B) price drops straight into the box (low about 9.4) and closes back near 10.5.",
        "notes": [
          "The gap away at A is the proof of a large demand imbalance at the base.",
          "The first return (B) is the buy: limit order at the top of the box, stop under its bottom, target the April high near 11.2.",
          "The sector level matched the S&P demand on the same day, which raised the odds for bank stocks."
        ]
      },
      {
        "src": "/lessons/seiden/p162-001.jpg",
        "caption": "BAC 30-min, 4/6 to 4/22/2009: an XLT demand zone (about 6.9-7.1) under the flat base at A, where price gapped to 8.2 and ran to 11.4. On 4/21 price gaps down into the zone at B and rallies to about 9.2.",
        "notes": [
          "A strong gap away from a base marks a high quality level.",
          "Entry at the zone top on the gap down risked only about $0.15 per share.",
          "The sellers at B sold after a decline and into demand: the two novice mistakes."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"473\" y=\"243\" width=\"145\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"268\" y=\"243\" width=\"145\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"63\" y=\"243\" width=\"145\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Top-down: index, sector and stock demand line up</text><rect x=\"20\" y=\"40\" width=\"195\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"58\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">S&amp;P 500 (index)</text><line x1=\"36\" y1=\"146.0\" x2=\"36\" y2=\"187.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"32.5\" y=\"150.0\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"47\" y1=\"179.3\" x2=\"47\" y2=\"220.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"43.5\" y=\"183.3\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"58\" y1=\"212.7\" x2=\"58\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"54.5\" y=\"216.7\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"69\" y1=\"243.0\" x2=\"69\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"65.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"80\" y1=\"243.0\" x2=\"80\" y2=\"257.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"76.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"91\" y1=\"243.0\" x2=\"91\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"87.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"102\" y1=\"192.2\" x2=\"102\" y2=\"229.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"98.5\" y=\"196.2\" width=\"7\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"113\" y1=\"163.5\" x2=\"113\" y2=\"200.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"109.5\" y=\"167.5\" width=\"7\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"124\" y1=\"134.8\" x2=\"124\" y2=\"171.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120.5\" y=\"138.8\" width=\"7\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"135\" y1=\"106.0\" x2=\"135\" y2=\"142.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"131.5\" y=\"110.0\" width=\"7\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"146\" y1=\"106.0\" x2=\"146\" y2=\"141.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"142.5\" y=\"110.0\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"157\" y1=\"133.5\" x2=\"157\" y2=\"169.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"153.5\" y=\"137.5\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"168\" y1=\"196.0\" x2=\"168\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"164.5\" y=\"200.0\" width=\"7\" height=\"50.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"179\" y1=\"171.0\" x2=\"179\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"175.0\" width=\"7\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"168\" y1=\"70\" x2=\"168\" y2=\"290\" stroke=\"#f59e0b\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><rect x=\"225\" y=\"40\" width=\"195\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"235\" y=\"58\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">XLF (sector)</text><line x1=\"241\" y1=\"146.0\" x2=\"241\" y2=\"187.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"237.5\" y=\"150.0\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"252\" y1=\"179.3\" x2=\"252\" y2=\"220.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"248.5\" y=\"183.3\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"263\" y1=\"212.7\" x2=\"263\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"259.5\" y=\"216.7\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"274\" y1=\"243.0\" x2=\"274\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"270.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"285\" y1=\"243.0\" x2=\"285\" y2=\"257.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"281.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"296\" y1=\"243.0\" x2=\"296\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"292.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"307\" y1=\"177.2\" x2=\"307\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"303.5\" y=\"181.2\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"153.5\" x2=\"318\" y2=\"185.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"314.5\" y=\"157.5\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"329\" y1=\"129.8\" x2=\"329\" y2=\"161.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"325.5\" y=\"133.8\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"340\" y1=\"106.0\" x2=\"340\" y2=\"137.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"336.5\" y=\"110.0\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"351\" y1=\"106.0\" x2=\"351\" y2=\"141.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"347.5\" y=\"110.0\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"362\" y1=\"133.5\" x2=\"362\" y2=\"169.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"358.5\" y=\"137.5\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"373\" y1=\"196.0\" x2=\"373\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"369.5\" y=\"200.0\" width=\"7\" height=\"50.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"384\" y1=\"171.0\" x2=\"384\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"380.5\" y=\"175.0\" width=\"7\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"373\" y1=\"70\" x2=\"373\" y2=\"290\" stroke=\"#f59e0b\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><rect x=\"430\" y=\"40\" width=\"195\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"440\" y=\"58\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">BAC (stock)</text><line x1=\"446\" y1=\"146.0\" x2=\"446\" y2=\"187.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"442.5\" y=\"150.0\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"457\" y1=\"179.3\" x2=\"457\" y2=\"220.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"453.5\" y=\"183.3\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"468\" y1=\"212.7\" x2=\"468\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"464.5\" y=\"216.7\" width=\"7\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"479\" y1=\"243.0\" x2=\"479\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"475.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"490\" y1=\"243.0\" x2=\"490\" y2=\"257.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"486.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"501\" y1=\"243.0\" x2=\"501\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"497.5\" y=\"247.0\" width=\"7\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"512\" y1=\"177.2\" x2=\"512\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"508.5\" y=\"181.2\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"523\" y1=\"153.5\" x2=\"523\" y2=\"185.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"519.5\" y=\"157.5\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"534\" y1=\"129.8\" x2=\"534\" y2=\"161.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"530.5\" y=\"133.8\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"545\" y1=\"106.0\" x2=\"545\" y2=\"137.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"541.5\" y=\"110.0\" width=\"7\" height=\"23.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"556\" y1=\"106.0\" x2=\"556\" y2=\"141.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"552.5\" y=\"110.0\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"567\" y1=\"133.5\" x2=\"567\" y2=\"169.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"563.5\" y=\"137.5\" width=\"7\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"578\" y1=\"196.0\" x2=\"578\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"574.5\" y=\"200.0\" width=\"7\" height=\"50.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"589\" y1=\"171.0\" x2=\"589\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"585.5\" y=\"175.0\" width=\"7\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"578\" y1=\"70\" x2=\"578\" y2=\"290\" stroke=\"#f59e0b\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><text x=\"320\" y=\"328\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">same day (4/21/09): all three gap down into demand</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Buy the stock whose demand lines up with the sector and the index demand.</text></svg>",
        "caption": "Top-down alignment: the S&P, the financial sector ETF and BAC each had fresh demand at the origin of a strong (gap) move, and all three returned to it on the same morning."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"149\" y=\"243\" width=\"411\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Gap-origin demand: buy the first return</text><line x1=\"50\" y1=\"116.0\" x2=\"50\" y2=\"145.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"44.5\" y=\"120.0\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"68\" y1=\"137.7\" x2=\"68\" y2=\"167.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"62.5\" y=\"141.7\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"86\" y1=\"159.3\" x2=\"86\" y2=\"189.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"80.5\" y=\"163.3\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"104\" y1=\"181.0\" x2=\"104\" y2=\"210.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"98.5\" y=\"185.0\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"122\" y1=\"202.7\" x2=\"122\" y2=\"232.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"116.5\" y=\"206.7\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"140\" y1=\"224.3\" x2=\"140\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"134.5\" y=\"228.3\" width=\"11\" height=\"21.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"158\" y1=\"243.0\" x2=\"158\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"152.5\" y=\"247.0\" width=\"11\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"176\" y1=\"243.0\" x2=\"176\" y2=\"257.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"170.5\" y=\"247.0\" width=\"11\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"194\" y1=\"243.0\" x2=\"194\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"188.5\" y=\"247.0\" width=\"11\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"212\" y1=\"173.5\" x2=\"212\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"206.5\" y=\"177.5\" width=\"11\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"230\" y1=\"151.0\" x2=\"230\" y2=\"181.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"224.5\" y=\"155.0\" width=\"11\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"248\" y1=\"128.5\" x2=\"248\" y2=\"159.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"242.5\" y=\"132.5\" width=\"11\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"266\" y1=\"106.0\" x2=\"266\" y2=\"136.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260.5\" y=\"110.0\" width=\"11\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"284\" y1=\"102.0\" x2=\"284\" y2=\"118.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"278.5\" y=\"106.0\" width=\"11\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"302\" y1=\"102.0\" x2=\"302\" y2=\"118.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296.5\" y=\"106.0\" width=\"11\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"320\" y1=\"88.0\" x2=\"320\" y2=\"114.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"314.5\" y=\"92.0\" width=\"11\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"338\" y1=\"88.0\" x2=\"338\" y2=\"122.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"332.5\" y=\"92.0\" width=\"11\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"356\" y1=\"114.0\" x2=\"356\" y2=\"148.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"350.5\" y=\"118.0\" width=\"11\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"374\" y1=\"140.0\" x2=\"374\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"368.5\" y=\"144.0\" width=\"11\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"392\" y1=\"192.0\" x2=\"392\" y2=\"256.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"386.5\" y=\"196.0\" width=\"11\" height=\"50.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"410\" y1=\"169.0\" x2=\"410\" y2=\"200.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"404.5\" y=\"173.0\" width=\"11\" height=\"23.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"428\" y1=\"146.0\" x2=\"428\" y2=\"177.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"422.5\" y=\"150.0\" width=\"11\" height=\"23.0\" fill=\"#22c55e\" rx=\"1\"/><text x=\"556\" y=\"254\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DEMAND</text><text x=\"566\" y=\"247\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"566\" y=\"262\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><line x1=\"362\" y1=\"268\" x2=\"560\" y2=\"268\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"358\" y=\"272\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">STOP below distal</text><line x1=\"212\" y1=\"88\" x2=\"560\" y2=\"88\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"564\" y=\"92\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">TARGET</text><text x=\"206\" y=\"84\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">prior high</text><ellipse cx=\"208\" cy=\"222\" rx=\"16\" ry=\"26\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"226\" y=\"214\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">A: base + gap up</text><text x=\"226\" y=\"228\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">= strong departure</text><line x1=\"352\" y1=\"300\" x2=\"388\" y2=\"262\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"388.0,262.0 385.2,269.5 380.7,265.2\" fill=\"#f59e0b\"/><text x=\"348\" y=\"312\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">B: gap down into demand: BUY at proximal</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">The faster price left the base, the bigger the imbalance waiting there on the return.</text></svg>",
        "caption": "Gap-origin demand: price bases, gaps away (A), and on the first return (B) gaps straight into the zone. Buy at the proximal line, stop under the distal line, target the prior high."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p165-003.jpg",
        "caption": "Gold 60-min slide \"Probability Scoring\": a supply zone (about 862-870) over a rally-base-drop top; the XLT student sells the return at 864 with a stop at 870, Target One about 852 and Target Two about 835. Score panel: 9 of 10, reward 3:1.",
        "notes": [
          "Strength of move: the first decline from the zone was fast and large (2 of 2).",
          "Profit margin: entry to stop 6 points, entry to first target 12+ points, at least 3:1 (2 of 2).",
          "Entry was a limit order with stop and both targets pre-placed; risk $1,200, profit $4,100."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"94\" y=\"123\" width=\"316\" height=\"17\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Odds Enhancers: scoring a supply zone before the short</text><line x1=\"36\" y1=\"222.0\" x2=\"36\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"32.0\" y=\"226.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"49\" y1=\"198.0\" x2=\"49\" y2=\"230.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"45.0\" y=\"202.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"62\" y1=\"174.0\" x2=\"62\" y2=\"206.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"58.0\" y=\"178.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"75\" y1=\"150.0\" x2=\"75\" y2=\"182.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"71.0\" y=\"154.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"88\" y1=\"126.0\" x2=\"88\" y2=\"158.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"84.0\" y=\"130.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"101\" y1=\"123.0\" x2=\"101\" y2=\"137.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"97.0\" y=\"127.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"114\" y1=\"123.0\" x2=\"114\" y2=\"137.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"110.0\" y=\"127.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"127\" y1=\"123.0\" x2=\"127\" y2=\"137.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"123.0\" y=\"127.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"140\" y1=\"126.0\" x2=\"140\" y2=\"164.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"136.0\" y=\"130.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"153\" y1=\"156.0\" x2=\"153\" y2=\"194.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"149.0\" y=\"160.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"166\" y1=\"186.0\" x2=\"166\" y2=\"224.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"162.0\" y=\"190.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"179\" y1=\"216.0\" x2=\"179\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"175.0\" y=\"220.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"192\" y1=\"242.0\" x2=\"192\" y2=\"258.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"188.0\" y=\"246.0\" width=\"8\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"205\" y1=\"242.0\" x2=\"205\" y2=\"258.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"201.0\" y=\"246.0\" width=\"8\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"218\" y1=\"231.0\" x2=\"218\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"214.0\" y=\"235.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"231\" y1=\"216.0\" x2=\"231\" y2=\"239.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"227.0\" y=\"220.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"244\" y1=\"194.5\" x2=\"244\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"240.0\" y=\"198.5\" width=\"8\" height=\"21.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"257\" y1=\"173.0\" x2=\"257\" y2=\"202.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"253.0\" y=\"177.0\" width=\"8\" height=\"21.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"151.5\" x2=\"270\" y2=\"181.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"266.0\" y=\"155.5\" width=\"8\" height=\"21.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"283\" y1=\"130.0\" x2=\"283\" y2=\"159.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"279.0\" y=\"134.0\" width=\"8\" height=\"21.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"296\" y1=\"130.0\" x2=\"296\" y2=\"160.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"292.0\" y=\"134.0\" width=\"8\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"309\" y1=\"152.0\" x2=\"309\" y2=\"182.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"305.0\" y=\"156.0\" width=\"8\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"322\" y1=\"174.0\" x2=\"322\" y2=\"204.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"318.0\" y=\"178.0\" width=\"8\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"335\" y1=\"182.0\" x2=\"335\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"331.0\" y=\"186.0\" width=\"8\" height=\"14.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"348\" y1=\"182.0\" x2=\"348\" y2=\"214.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"344.0\" y=\"186.0\" width=\"8\" height=\"24.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"361\" y1=\"206.8\" x2=\"361\" y2=\"239.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"357.0\" y=\"210.8\" width=\"8\" height=\"24.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"374\" y1=\"231.5\" x2=\"374\" y2=\"264.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"370.0\" y=\"235.5\" width=\"8\" height=\"24.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"387\" y1=\"256.2\" x2=\"387\" y2=\"289.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"383.0\" y=\"260.2\" width=\"8\" height=\"24.8\" fill=\"#ef4444\" rx=\"1\"/><text x=\"406\" y=\"136\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><line x1=\"283\" y1=\"140\" x2=\"410\" y2=\"140\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"414\" y=\"144\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">entry 864</text><line x1=\"283\" y1=\"118\" x2=\"410\" y2=\"118\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"414\" y=\"116\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop 870</text><line x1=\"283\" y1=\"184\" x2=\"410\" y2=\"184\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"414\" y=\"188\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T1 852</text><line x1=\"283\" y1=\"246\" x2=\"410\" y2=\"246\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"414\" y=\"250\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T2 835</text><text x=\"141\" y=\"270\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">fast, strong drop</text><rect x=\"470\" y=\"44\" width=\"160\" height=\"236\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"480\" y=\"66\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Score</text><text x=\"480\" y=\"92\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Strength of move</text><text x=\"620\" y=\"92\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">2/2</text><text x=\"480\" y=\"118\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Profit margin</text><text x=\"620\" y=\"118\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">2/2</text><text x=\"480\" y=\"144\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Big picture</text><text x=\"620\" y=\"144\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">2/2</text><text x=\"480\" y=\"170\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Retracement</text><text x=\"620\" y=\"170\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">1/2</text><text x=\"480\" y=\"196\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Time at level</text><text x=\"620\" y=\"196\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">1/1</text><text x=\"480\" y=\"222\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">Return</text><text x=\"620\" y=\"222\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">1/1</text><line x1=\"480\" y1=\"248\" x2=\"620\" y2=\"248\" stroke=\"#94a3b8\" stroke-width=\"1\"/><text x=\"480\" y=\"268\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Total</text><text x=\"620\" y=\"268\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"end\" font-weight=\"600\">9 / 10</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Limit entry, stop and both targets were placed before price arrived: reward 3:1.</text></svg>",
        "caption": "Gold 60-min short scored with the Odds Enhancers: a rally-base-drop supply left fast, reward to the first target is 3:1 and the bigger picture agrees, so the zone scores 9 of 10."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"384\" y=\"93\" width=\"226\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"74\" y=\"93\" width=\"226\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Strength of move: how did price leave the base?</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Fast, strong departure</text><line x1=\"50\" y1=\"106.0\" x2=\"50\" y2=\"124.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"45.0\" y=\"110.0\" width=\"10\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"66\" y1=\"96.0\" x2=\"66\" y2=\"114.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"61.0\" y=\"100.0\" width=\"10\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"93.0\" x2=\"82\" y2=\"107.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"98\" y1=\"93.0\" x2=\"98\" y2=\"107.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"93.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"114\" y1=\"93.0\" x2=\"114\" y2=\"107.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"109.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"96.0\" x2=\"130\" y2=\"146.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"125.0\" y=\"100.0\" width=\"10\" height=\"42.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"146\" y1=\"138.5\" x2=\"146\" y2=\"189.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"141.0\" y=\"142.5\" width=\"10\" height=\"42.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"162\" y1=\"181.0\" x2=\"162\" y2=\"231.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"157.0\" y=\"185.0\" width=\"10\" height=\"42.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"178\" y1=\"223.5\" x2=\"178\" y2=\"274.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"173.0\" y=\"227.5\" width=\"10\" height=\"42.5\" fill=\"#ef4444\" rx=\"1\"/><text x=\"200\" y=\"140\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">big candles, no overlap</text><text x=\"200\" y=\"156\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">= big imbalance</text><text x=\"165\" y=\"295\" fill=\"#22c55e\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">score 2 / 2</text><text x=\"340\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Slow drift away</text><line x1=\"360\" y1=\"106.0\" x2=\"360\" y2=\"124.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"355.0\" y=\"110.0\" width=\"10\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"96.0\" x2=\"376\" y2=\"114.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"371.0\" y=\"100.0\" width=\"10\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"392\" y1=\"93.0\" x2=\"392\" y2=\"107.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"387.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"408\" y1=\"93.0\" x2=\"408\" y2=\"107.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"403.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"93.0\" x2=\"424\" y2=\"107.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"419.0\" y=\"97.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"440\" y1=\"96.0\" x2=\"440\" y2=\"119.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"435.0\" y=\"100.0\" width=\"10\" height=\"15.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"456\" y1=\"104.0\" x2=\"456\" y2=\"119.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"451.0\" y=\"108.0\" width=\"10\" height=\"7.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"472\" y1=\"104.0\" x2=\"472\" y2=\"129.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"467.0\" y=\"108.0\" width=\"10\" height=\"17.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"488\" y1=\"114.0\" x2=\"488\" y2=\"129.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"483.0\" y=\"118.0\" width=\"10\" height=\"7.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"504\" y1=\"114.0\" x2=\"504\" y2=\"139.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"499.0\" y=\"118.0\" width=\"10\" height=\"17.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"520\" y1=\"124.0\" x2=\"520\" y2=\"139.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"515.0\" y=\"128.0\" width=\"10\" height=\"7.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"536\" y1=\"124.0\" x2=\"536\" y2=\"149.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"531.0\" y=\"128.0\" width=\"10\" height=\"17.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"552\" y1=\"136.0\" x2=\"552\" y2=\"149.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"547.0\" y=\"140.0\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"568\" y1=\"136.0\" x2=\"568\" y2=\"159.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"563.0\" y=\"140.0\" width=\"10\" height=\"15.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"584\" y1=\"146.0\" x2=\"584\" y2=\"159.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"579.0\" y=\"150.0\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"600\" y1=\"146.0\" x2=\"600\" y2=\"169.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"595.0\" y=\"150.0\" width=\"10\" height=\"15.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"470\" y=\"200\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">small, overlapping candles</text><text x=\"470\" y=\"216\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">= small imbalance</text><text x=\"475\" y=\"295\" fill=\"#ef4444\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">score 0 / 2</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">The stronger the move away from a level, the greater the supply and demand imbalance there.</text></svg>",
        "caption": "Strength of move, the first Odds Enhancer: a fast, wide-range departure from the base scores full points; a slow, overlapping drift away scores nothing."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p169-005.jpg",
        "caption": "BAC 60-min, 4/8 to 5/8/2009: the same XLT demand zone (about 6.9-7.1) from A. On 4/21 (B) price gaps into it on bad CEO news, holds 8-9.3 for two weeks, then rallies to about 15.",
        "notes": [
          "Bad news drove price into peak demand: that was the buy, not a reason to sell.",
          "The news sellers acted on an outside invitation; the level was the market invitation.",
          "Stop under the zone, first target the 4/14 high near 11.5 and far more was available."
        ]
      },
      {
        "src": "/lessons/seiden/p170-006.jpg",
        "caption": "Diagram: earnings, news, statements, Fed, economic reports, tips, upgrades and downgrades, analyst opinion and technical indicators all feed \"Thoughts and Perceptions\", which lead to \"ACTION: Buy or Sell\".",
        "notes": [
          "Every input ends as a buy or sell decision, so all of it is already reflected in price.",
          "Filter each invitation through the supply and demand picture before acting."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"103\" y=\"273\" width=\"457\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">News is an invitation; the level decides the action</text><rect x=\"30\" y=\"38\" width=\"140\" height=\"44\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"250\" y=\"38\" width=\"140\" height=\"44\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"470\" y=\"38\" width=\"140\" height=\"44\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"100\" y=\"56\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"400\">News, earnings, tips,</text><text x=\"100\" y=\"72\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"400\">upgrades, indicators</text><text x=\"320\" y=\"56\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"400\">Thoughts and</text><text x=\"320\" y=\"72\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"400\">perceptions</text><text x=\"540\" y=\"56\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">ACTION</text><text x=\"540\" y=\"72\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"400\">buy or sell</text><line x1=\"172\" y1=\"60\" x2=\"246\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"1.6\"/><polygon points=\"246.0,60.0 238.6,63.1 238.6,56.9\" fill=\"#94a3b8\"/><line x1=\"392\" y1=\"60\" x2=\"466\" y2=\"60\" stroke=\"#94a3b8\" stroke-width=\"1.6\"/><polygon points=\"466.0,60.0 458.6,63.1 458.6,56.9\" fill=\"#94a3b8\"/><line x1=\"60\" y1=\"196.0\" x2=\"60\" y2=\"230.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"200.0\" width=\"10\" height=\"26.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"77\" y1=\"222.7\" x2=\"77\" y2=\"257.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72.0\" y=\"226.7\" width=\"10\" height=\"26.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"94\" y1=\"249.3\" x2=\"94\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"89.0\" y=\"253.3\" width=\"10\" height=\"26.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"111\" y1=\"273.0\" x2=\"111\" y2=\"287.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"106.0\" y=\"277.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"128\" y1=\"273.0\" x2=\"128\" y2=\"287.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"123.0\" y=\"277.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"145\" y1=\"273.0\" x2=\"145\" y2=\"287.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"140.0\" y=\"277.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"162\" y1=\"248.0\" x2=\"162\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"157.0\" y=\"252.0\" width=\"10\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"179\" y1=\"220.0\" x2=\"179\" y2=\"256.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"174.0\" y=\"224.0\" width=\"10\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"196\" y1=\"192.0\" x2=\"196\" y2=\"228.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"191.0\" y=\"196.0\" width=\"10\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"213\" y1=\"164.0\" x2=\"213\" y2=\"200.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"208.0\" y=\"168.0\" width=\"10\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"230\" y1=\"136.0\" x2=\"230\" y2=\"172.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"225.0\" y=\"140.0\" width=\"10\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"247\" y1=\"132.0\" x2=\"247\" y2=\"148.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"242.0\" y=\"136.0\" width=\"10\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"264\" y1=\"132.0\" x2=\"264\" y2=\"148.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"259.0\" y=\"136.0\" width=\"10\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"281\" y1=\"136.0\" x2=\"281\" y2=\"166.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"276.0\" y=\"140.0\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"298\" y1=\"158.5\" x2=\"298\" y2=\"189.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"293.0\" y=\"162.5\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"315\" y1=\"181.0\" x2=\"315\" y2=\"211.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"310.0\" y=\"185.0\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"332\" y1=\"203.5\" x2=\"332\" y2=\"234.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"327.0\" y=\"207.5\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"349\" y1=\"232.0\" x2=\"349\" y2=\"290.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344.0\" y=\"236.0\" width=\"10\" height=\"45.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"366\" y1=\"213.3\" x2=\"366\" y2=\"240.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"361.0\" y=\"217.3\" width=\"10\" height=\"18.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"383\" y1=\"194.7\" x2=\"383\" y2=\"221.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"378.0\" y=\"198.7\" width=\"10\" height=\"18.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"400\" y1=\"176.0\" x2=\"400\" y2=\"202.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"395.0\" y=\"180.0\" width=\"10\" height=\"18.7\" fill=\"#22c55e\" rx=\"1\"/><text x=\"556\" y=\"284\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">PEAK DEMAND</text><text x=\"566\" y=\"277\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"566\" y=\"292\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><line x1=\"409\" y1=\"250\" x2=\"357\" y2=\"278\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"357.0,278.0 362.0,271.8 365.0,277.2\" fill=\"#f59e0b\"/><text x=\"413\" y=\"246\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">bad news gap: novices sell</text><text x=\"413\" y=\"262\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">XLT buys at demand</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Bad news into peak demand is usually a buy; good news into peak supply is usually a sell.</text></svg>",
        "caption": "Every input becomes a buy or sell decision, so filter it through the level: BAC gapped down on bad CEO news straight into pre-planned demand, the sellers acted on the news, the buyers acted on the level."
      }
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
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"50\" y=\"254\" width=\"510\" height=\"16\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"50\" y=\"84\" width=\"510\" height=\"16\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Mass and motion: price travels between imbalances</text><line x1=\"70\" y1=\"255.0\" x2=\"70\" y2=\"269.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"65.0\" y=\"259.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"87\" y1=\"255.0\" x2=\"87\" y2=\"269.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"82.0\" y=\"259.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"104\" y1=\"229.7\" x2=\"104\" y2=\"266.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"99.0\" y=\"233.7\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"121\" y1=\"201.3\" x2=\"121\" y2=\"237.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"116.0\" y=\"205.3\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"138\" y1=\"173.0\" x2=\"138\" y2=\"209.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"133.0\" y=\"177.0\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"155\" y1=\"144.7\" x2=\"155\" y2=\"181.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"150.0\" y=\"148.7\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"172\" y1=\"116.3\" x2=\"172\" y2=\"152.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"167.0\" y=\"120.3\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"189\" y1=\"88.0\" x2=\"189\" y2=\"124.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"184.0\" y=\"92.0\" width=\"10\" height=\"28.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"85.0\" x2=\"206\" y2=\"99.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"201.0\" y=\"89.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"223\" y1=\"85.0\" x2=\"223\" y2=\"99.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"89.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"240\" y1=\"88.0\" x2=\"240\" y2=\"124.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"235.0\" y=\"92.0\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"257\" y1=\"116.3\" x2=\"257\" y2=\"152.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"252.0\" y=\"120.3\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"274\" y1=\"144.7\" x2=\"274\" y2=\"181.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"269.0\" y=\"148.7\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"291\" y1=\"173.0\" x2=\"291\" y2=\"209.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"286.0\" y=\"177.0\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"308\" y1=\"201.3\" x2=\"308\" y2=\"237.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"303.0\" y=\"205.3\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"325\" y1=\"229.7\" x2=\"325\" y2=\"266.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"320.0\" y=\"233.7\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"342\" y1=\"255.0\" x2=\"342\" y2=\"269.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"337.0\" y=\"259.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"359\" y1=\"255.0\" x2=\"359\" y2=\"269.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"354.0\" y=\"259.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"376\" y1=\"227.5\" x2=\"376\" y2=\"266.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"371.0\" y=\"231.5\" width=\"10\" height=\"30.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"393\" y1=\"197.0\" x2=\"393\" y2=\"235.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"388.0\" y=\"201.0\" width=\"10\" height=\"30.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"410\" y1=\"166.5\" x2=\"410\" y2=\"205.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"405.0\" y=\"170.5\" width=\"10\" height=\"30.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"427\" y1=\"136.0\" x2=\"427\" y2=\"174.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"422.0\" y=\"140.0\" width=\"10\" height=\"30.5\" fill=\"#22c55e\" rx=\"1\"/><text x=\"556\" y=\"96\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY = mass of sell orders</text><text x=\"556\" y=\"266\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DEMAND = mass of buy orders</text><line x1=\"590\" y1=\"240\" x2=\"590\" y2=\"112\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"590.0,112.0 593.1,119.4 586.9,119.4\" fill=\"#f59e0b\"/><line x1=\"610\" y1=\"112\" x2=\"610\" y2=\"240\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"610.0,240.0 606.9,232.6 613.1,232.6\" fill=\"#f59e0b\"/><text x=\"600\" y=\"182\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">motion</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Newton: motion continues until met by an equal or greater force. In markets that force is the next level.</text></svg>",
        "caption": "Governing dynamics: supply and demand levels are the mass; price movement is the motion from a level where demand exceeds supply to the next level where supply exceeds demand."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p175-009.jpg",
        "caption": "NASDAQ E-mini 30-min, evening 5/19 to morning 5/20/2009 (before): price grinds up from about 1388, then accelerates with large green candles; candle A runs from about 1402 to 1413 and more large green bars follow to about 1420.",
        "notes": [
          "The largest candles come at the end of the run: emotional novice buying.",
          "Those buyers are buying after a rally and into a daily supply level above."
        ]
      },
      {
        "src": "/lessons/seiden/p176-010.jpg",
        "caption": "NASDAQ E-mini 30-min on 5/20/2009 (after): just after A price tops near 1424, falls in large red candles, makes a lower high near 1408 and drops to about 1386 by evening.",
        "notes": [
          "The same move seen after the fact: the late buyers at A were the liquidity for the short.",
          "A short at the daily supply had a stop just above the top and reached the prior lows the same day."
        ]
      },
      {
        "src": "/lessons/seiden/p177-011.jpg",
        "caption": "NASDAQ E-mini daily, late March to late May 2009: rising moving average marked \"Uptrend\"; a supply line about 1420-1430 across the early-May rally-base-drop top. At A (about May 20) price reaches just under it and turns down with a large red candle.",
        "notes": [
          "Shorting in an uptrend is valid only at a level where supply exceeds demand.",
          "Use the daily to find the level, the 30-min to see novices chasing into it."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"271\" y=\"92\" width=\"249\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Daily uptrend, but price reaches a rally-base-drop supply</text><line x1=\"40\" y1=\"283.5\" x2=\"40\" y2=\"304.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"35.5\" y=\"287.5\" width=\"9\" height=\"12.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"54\" y1=\"271.0\" x2=\"54\" y2=\"291.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"49.5\" y=\"275.0\" width=\"9\" height=\"12.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"68\" y1=\"258.5\" x2=\"68\" y2=\"279.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"63.5\" y=\"262.5\" width=\"9\" height=\"12.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"246.0\" x2=\"82\" y2=\"266.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77.5\" y=\"250.0\" width=\"9\" height=\"12.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"96\" y1=\"246.0\" x2=\"96\" y2=\"266.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"91.5\" y=\"250.0\" width=\"9\" height=\"12.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"242.5\" x2=\"110\" y2=\"266.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"105.5\" y=\"246.5\" width=\"9\" height=\"15.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"124\" y1=\"227.0\" x2=\"124\" y2=\"250.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"119.5\" y=\"231.0\" width=\"9\" height=\"15.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"138\" y1=\"211.5\" x2=\"138\" y2=\"235.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"133.5\" y=\"215.5\" width=\"9\" height=\"15.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"152\" y1=\"196.0\" x2=\"152\" y2=\"219.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"147.5\" y=\"200.0\" width=\"9\" height=\"15.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"166\" y1=\"196.0\" x2=\"166\" y2=\"218.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"161.5\" y=\"200.0\" width=\"9\" height=\"14.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"180\" y1=\"194.0\" x2=\"180\" y2=\"218.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"198.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"194\" y1=\"178.0\" x2=\"194\" y2=\"202.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"189.5\" y=\"182.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"208\" y1=\"162.0\" x2=\"208\" y2=\"186.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"203.5\" y=\"166.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"146.0\" x2=\"222\" y2=\"170.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"217.5\" y=\"150.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"236\" y1=\"130.0\" x2=\"236\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"231.5\" y=\"134.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"250\" y1=\"114.0\" x2=\"250\" y2=\"138.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"118.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"264\" y1=\"98.0\" x2=\"264\" y2=\"122.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.5\" y=\"102.0\" width=\"9\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"278\" y1=\"95.0\" x2=\"278\" y2=\"109.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"273.5\" y=\"99.0\" width=\"9\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"292\" y1=\"95.0\" x2=\"292\" y2=\"109.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"287.5\" y=\"99.0\" width=\"9\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"306\" y1=\"98.0\" x2=\"306\" y2=\"132.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"301.5\" y=\"102.0\" width=\"9\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"320\" y1=\"124.0\" x2=\"320\" y2=\"158.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"315.5\" y=\"128.0\" width=\"9\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"150.0\" x2=\"334\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"329.5\" y=\"154.0\" width=\"9\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"348\" y1=\"156.0\" x2=\"348\" y2=\"184.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"343.5\" y=\"160.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"362\" y1=\"142.5\" x2=\"362\" y2=\"164.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"357.5\" y=\"146.5\" width=\"9\" height=\"13.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"129.0\" x2=\"376\" y2=\"150.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"371.5\" y=\"133.0\" width=\"9\" height=\"13.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"390\" y1=\"115.5\" x2=\"390\" y2=\"137.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"385.5\" y=\"119.5\" width=\"9\" height=\"13.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"404\" y1=\"102.0\" x2=\"404\" y2=\"123.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"399.5\" y=\"106.0\" width=\"9\" height=\"13.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"418\" y1=\"102.0\" x2=\"418\" y2=\"154.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"413.5\" y=\"106.0\" width=\"9\" height=\"44.0\" fill=\"#ef4444\" rx=\"1\"/><polyline points=\"110,264 124,254 138,245 152,234 166,228 180,218 194,207 208,196 222,185 236,174 250,158 264,142 278,128 292,118 306,114 320,118 334,128 348,138 362,146 376,150 390,149 404,141 418,136\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2\"/><text x=\"516\" y=\"105\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><text x=\"526\" y=\"114\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"526\" y=\"96\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><text x=\"120\" y=\"290\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">uptrend: rising moving average</text><line x1=\"404\" y1=\"60\" x2=\"404\" y2=\"88\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"404.0,88.0 400.9,80.6 407.1,80.6\" fill=\"#f59e0b\"/><text x=\"404\" y=\"54\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">A: short at supply</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">There is a time to short in an uptrend: when price reaches a level where supply exceeds demand.</text></svg>",
        "caption": "NASDAQ daily: the uptrend is intact, yet price rallies back into a rally-base-drop supply from early May. That is where the uptrend stalls and the short is planned."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"158\" width=\"430\" height=\"20\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Small timeframe: the biggest candles come at the end</text><line x1=\"60\" y1=\"280.0\" x2=\"60\" y2=\"296.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"53.0\" y=\"284.0\" width=\"14\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"272.0\" x2=\"82\" y2=\"290.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"75.0\" y=\"276.0\" width=\"14\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"260.0\" x2=\"104\" y2=\"282.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"97.0\" y=\"264.0\" width=\"14\" height=\"14.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"242.0\" x2=\"126\" y2=\"270.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"119.0\" y=\"246.0\" width=\"14\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"148\" y1=\"214.0\" x2=\"148\" y2=\"252.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"141.0\" y=\"218.0\" width=\"14\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"170\" y1=\"166.0\" x2=\"170\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"163.0\" y=\"170.0\" width=\"14\" height=\"50.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"192\" y1=\"166.0\" x2=\"192\" y2=\"180.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"185.0\" y=\"170.0\" width=\"14\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"214\" y1=\"178.0\" x2=\"214\" y2=\"240.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"207.0\" y=\"182.0\" width=\"14\" height=\"54.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"236\" y1=\"212.0\" x2=\"236\" y2=\"240.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"229.0\" y=\"216.0\" width=\"14\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"258\" y1=\"212.0\" x2=\"258\" y2=\"270.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"251.0\" y=\"216.0\" width=\"14\" height=\"50.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"280\" y1=\"262.0\" x2=\"280\" y2=\"310.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"273.0\" y=\"266.0\" width=\"14\" height=\"40.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"466\" y=\"172\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DAILY SUPPLY</text><text x=\"476\" y=\"182\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"476\" y=\"162\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><ellipse cx=\"150\" cy=\"200\" rx=\"44\" ry=\"40\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"100\" y=\"236\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">novices chase: buying after a rally</text><text x=\"100\" y=\"252\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">and into supply</text><line x1=\"240\" y1=\"110\" x2=\"180\" y2=\"160\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"180.0,160.0 183.7,152.9 187.7,157.7\" fill=\"#f59e0b\"/><text x=\"244\" y=\"106\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">XLT sells short to them</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Larger timeframe shows the turning point; smaller timeframe shows the emotional bandwagon.</text></svg>",
        "caption": "Reading emotion on the 30-minute chart: green candles grow larger as the run gets older. The largest candles arrive right at daily supply, which is where the instructors sold to the late buyers."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p180-013.jpg",
        "caption": "E-mini S&P 10-min, 5/20 to 5/28/2009: A is a small rally-base-drop base wrapped by lines at about 911 and 915; ellipse B marks the fast drop away; ellipse C the steep 5/26 rally from about 879 back to 910. D: short at 911 at the 5/27 open, E: stop 915, F: target 899 (3:1). Price holds under 912, then falls to about 891.",
        "notes": [
          "Supply is the rally-base-drop at A; the speed of B measures the imbalance.",
          "A steep return (C) with no demand inside it tends to fall back at a similar rate.",
          "Risk 4 points, target 12 points: 3:1, all orders entered before the open so the trader could walk away."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"96\" y=\"143\" width=\"374\" height=\"14\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">A to F: a pre-planned short at rally-base-drop supply</text><line x1=\"40\" y1=\"228.5\" x2=\"40\" y2=\"264.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"35.0\" y=\"232.5\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"56\" y1=\"201.0\" x2=\"56\" y2=\"236.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"51.0\" y=\"205.0\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"72\" y1=\"173.5\" x2=\"72\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"67.0\" y=\"177.5\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"88\" y1=\"146.0\" x2=\"88\" y2=\"181.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"83.0\" y=\"150.0\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"104\" y1=\"143.5\" x2=\"104\" y2=\"156.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"99.0\" y=\"147.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"120\" y1=\"143.5\" x2=\"120\" y2=\"156.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"115.0\" y=\"147.5\" width=\"10\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"136\" y1=\"143.5\" x2=\"136\" y2=\"156.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"131.0\" y=\"147.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"152\" y1=\"146.0\" x2=\"152\" y2=\"187.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"147.0\" y=\"150.0\" width=\"10\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"168\" y1=\"179.3\" x2=\"168\" y2=\"220.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"163.0\" y=\"183.3\" width=\"10\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"184\" y1=\"212.7\" x2=\"184\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"179.0\" y=\"216.7\" width=\"10\" height=\"33.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"200\" y1=\"246.0\" x2=\"200\" y2=\"274.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"195.0\" y=\"250.0\" width=\"10\" height=\"20.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"216\" y1=\"266.0\" x2=\"216\" y2=\"294.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"211.0\" y=\"270.0\" width=\"10\" height=\"20.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"232\" y1=\"283.0\" x2=\"232\" y2=\"297.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"227.0\" y=\"287.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"248\" y1=\"283.0\" x2=\"248\" y2=\"297.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"243.0\" y=\"287.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"252.2\" x2=\"264\" y2=\"294.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.0\" y=\"256.2\" width=\"10\" height=\"33.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"280\" y1=\"218.5\" x2=\"280\" y2=\"260.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"275.0\" y=\"222.5\" width=\"10\" height=\"33.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"296\" y1=\"184.8\" x2=\"296\" y2=\"226.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"291.0\" y=\"188.8\" width=\"10\" height=\"33.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"312\" y1=\"151.0\" x2=\"312\" y2=\"192.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"307.0\" y=\"155.0\" width=\"10\" height=\"33.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"328\" y1=\"148.5\" x2=\"328\" y2=\"161.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"323.0\" y=\"152.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"344\" y1=\"148.5\" x2=\"344\" y2=\"161.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"339.0\" y=\"152.5\" width=\"10\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"360\" y1=\"148.5\" x2=\"360\" y2=\"161.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"355.0\" y=\"152.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"151.0\" x2=\"376\" y2=\"176.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"371.0\" y=\"155.0\" width=\"10\" height=\"17.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"392\" y1=\"168.5\" x2=\"392\" y2=\"194.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"387.0\" y=\"172.5\" width=\"10\" height=\"17.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"408\" y1=\"186.0\" x2=\"408\" y2=\"211.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"403.0\" y=\"190.0\" width=\"10\" height=\"17.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"203.5\" x2=\"424\" y2=\"229.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"419.0\" y=\"207.5\" width=\"10\" height=\"17.5\" fill=\"#ef4444\" rx=\"1\"/><text x=\"114\" y=\"136\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">A</text><ellipse cx=\"174\" cy=\"200\" rx=\"26\" ry=\"52\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"208\" y=\"210\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">B</text><ellipse cx=\"284\" cy=\"220\" rx=\"28\" ry=\"60\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"248\" y=\"230\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"end\" font-weight=\"600\">C</text><line x1=\"318\" y1=\"157\" x2=\"470\" y2=\"157\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"161\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">D: short 911</text><line x1=\"318\" y1=\"137\" x2=\"470\" y2=\"137\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"141\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">E: stop 915 (4 pts)</text><line x1=\"318\" y1=\"217\" x2=\"470\" y2=\"217\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"221\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">F: target 899 (3:1)</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">A rally-base-drop, B fast exit, C steep return with no demand in it. Enter all orders, then walk away.</text></svg>",
        "caption": "S&P 10-min walk-through: A is the rally-base-drop supply, B the fast decline away, C the steep rally back with no demand inside it, D the short at 911, E the stop at 915 and F the 3:1 target at 899."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"416\" y=\"163\" width=\"194\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"122\" y=\"123\" width=\"178\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Rally-base-drop is supply; drop-base-drop mid-move is weak</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Rally-base-drop: trade it</text><line x1=\"50\" y1=\"230.0\" x2=\"50\" y2=\"264.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"45.0\" y=\"234.0\" width=\"10\" height=\"26.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"66\" y1=\"204.0\" x2=\"66\" y2=\"238.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"61.0\" y=\"208.0\" width=\"10\" height=\"26.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"178.0\" x2=\"82\" y2=\"212.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77.0\" y=\"182.0\" width=\"10\" height=\"26.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"98\" y1=\"152.0\" x2=\"98\" y2=\"186.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"93.0\" y=\"156.0\" width=\"10\" height=\"26.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"114\" y1=\"126.0\" x2=\"114\" y2=\"160.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"109.0\" y=\"130.0\" width=\"10\" height=\"26.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"123.5\" x2=\"130\" y2=\"136.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"125.0\" y=\"127.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"146\" y1=\"123.5\" x2=\"146\" y2=\"136.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"141.0\" y=\"127.5\" width=\"10\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"162\" y1=\"123.5\" x2=\"162\" y2=\"136.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"157.0\" y=\"127.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"178\" y1=\"126.0\" x2=\"178\" y2=\"162.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"173.0\" y=\"130.0\" width=\"10\" height=\"28.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"194\" y1=\"154.0\" x2=\"194\" y2=\"190.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"189.0\" y=\"158.0\" width=\"10\" height=\"28.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"210\" y1=\"182.0\" x2=\"210\" y2=\"218.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"205.0\" y=\"186.0\" width=\"10\" height=\"28.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"226\" y1=\"210.0\" x2=\"226\" y2=\"246.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"221.0\" y=\"214.0\" width=\"10\" height=\"28.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"242\" y1=\"238.0\" x2=\"242\" y2=\"274.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"237.0\" y=\"242.0\" width=\"10\" height=\"28.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"165\" y=\"110\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">price could not stay here</text><text x=\"340\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Drop-base-drop: usually skip</text><line x1=\"360\" y1=\"76.0\" x2=\"360\" y2=\"106.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"355.0\" y=\"80.0\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"376\" y1=\"98.5\" x2=\"376\" y2=\"129.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"371.0\" y=\"102.5\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"392\" y1=\"121.0\" x2=\"392\" y2=\"151.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"387.0\" y=\"125.0\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"408\" y1=\"143.5\" x2=\"408\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"403.0\" y=\"147.5\" width=\"10\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"424\" y1=\"163.5\" x2=\"424\" y2=\"176.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"419.0\" y=\"167.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"440\" y1=\"163.5\" x2=\"440\" y2=\"176.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"435.0\" y=\"167.5\" width=\"10\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"456\" y1=\"163.5\" x2=\"456\" y2=\"176.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"451.0\" y=\"167.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"472\" y1=\"166.0\" x2=\"472\" y2=\"196.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"467.0\" y=\"170.0\" width=\"10\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"488\" y1=\"188.0\" x2=\"488\" y2=\"218.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"483.0\" y=\"192.0\" width=\"10\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"504\" y1=\"210.0\" x2=\"504\" y2=\"240.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"499.0\" y=\"214.0\" width=\"10\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"520\" y1=\"232.0\" x2=\"520\" y2=\"262.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"515.0\" y=\"236.0\" width=\"10\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"536\" y1=\"254.0\" x2=\"536\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"531.0\" y=\"258.0\" width=\"10\" height=\"22.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"470\" y=\"215\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">base in the middle</text><text x=\"470\" y=\"231\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">of a move</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Seiden: drop-base-drop levels sit mid-move and typically do not work well.</text></svg>",
        "caption": "Choosing the base: a rally-base-drop marks a turning point where supply overwhelmed demand; a drop-base-drop is a pause inside a move and is a lower-quality level."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p183-015.jpg",
        "caption": "Live XLT session screen hours before the US open: chat on the left, S&P E-mini chart on the right with two magenta lines (about 924-927) around a small cluster; a big red candle drops out of it and price drifts lower overnight.",
        "notes": [
          "The zone is drawn before the open, around the balance that preceded the big red candle.",
          "The plan is waiting for price to come back, not a reaction to it."
        ]
      },
      {
        "src": "/lessons/seiden/p184-016.jpg",
        "caption": "E-mini S&P 10-min (Sep09), 6/15 to 6/16/2009: XLT supply level lines at about 924.1 and 927.3 with the circled big red candle leaving it. Price chops 916-922, rallies into the lower line about 9:00 on 6/16 (XLT sells short to novice buyer), then falls through the 911 profit target to about 907.",
        "notes": [
          "First return to a fresh supply after a collapse candle is the high odds short.",
          "Entry at the lower line, stop above the upper line, target the 911 demand.",
          "Buyers at the arrow bought after a rally and into supply."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"93\" y=\"103\" width=\"377\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Pay attention: balance, then a big red candle</text><line x1=\"40\" y1=\"173.5\" x2=\"40\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"35.5\" y=\"177.5\" width=\"9\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"55\" y1=\"151.0\" x2=\"55\" y2=\"181.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"50.5\" y=\"155.0\" width=\"9\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"70\" y1=\"128.5\" x2=\"70\" y2=\"159.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"65.5\" y=\"132.5\" width=\"9\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"85\" y1=\"106.0\" x2=\"85\" y2=\"136.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"80.5\" y=\"110.0\" width=\"9\" height=\"22.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"100\" y1=\"103.0\" x2=\"100\" y2=\"117.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"95.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"115\" y1=\"103.0\" x2=\"115\" y2=\"117.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"110.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"130\" y1=\"103.0\" x2=\"130\" y2=\"117.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"125.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"145\" y1=\"103.0\" x2=\"145\" y2=\"117.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"140.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"160\" y1=\"104.0\" x2=\"160\" y2=\"196.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"155.5\" y=\"110.0\" width=\"9\" height=\"80.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"175\" y1=\"186.0\" x2=\"175\" y2=\"209.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"170.5\" y=\"190.0\" width=\"9\" height=\"15.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"196.0\" x2=\"190\" y2=\"214.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"185.5\" y=\"200.0\" width=\"9\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"205\" y1=\"196.0\" x2=\"205\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200.5\" y=\"200.0\" width=\"9\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"220\" y1=\"196.0\" x2=\"220\" y2=\"214.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"215.5\" y=\"200.0\" width=\"9\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"235\" y1=\"196.0\" x2=\"235\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"230.5\" y=\"200.0\" width=\"9\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"250\" y1=\"196.0\" x2=\"250\" y2=\"214.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"200.0\" width=\"9\" height=\"10.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"265\" y1=\"183.4\" x2=\"265\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260.5\" y=\"187.4\" width=\"9\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"280\" y1=\"165.8\" x2=\"280\" y2=\"191.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"275.5\" y=\"169.8\" width=\"9\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"295\" y1=\"148.2\" x2=\"295\" y2=\"173.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"290.5\" y=\"152.2\" width=\"9\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"310\" y1=\"130.6\" x2=\"310\" y2=\"156.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"305.5\" y=\"134.6\" width=\"9\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"325\" y1=\"113.0\" x2=\"325\" y2=\"138.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"320.5\" y=\"117.0\" width=\"9\" height=\"17.6\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"340\" y1=\"110.5\" x2=\"340\" y2=\"123.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"335.5\" y=\"114.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"355\" y1=\"110.5\" x2=\"355\" y2=\"123.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"350.5\" y=\"114.5\" width=\"9\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"370\" y1=\"113.0\" x2=\"370\" y2=\"147.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"365.5\" y=\"117.0\" width=\"9\" height=\"26.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"385\" y1=\"139.6\" x2=\"385\" y2=\"174.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"380.5\" y=\"143.6\" width=\"9\" height=\"26.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"400\" y1=\"166.2\" x2=\"400\" y2=\"200.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"395.5\" y=\"170.2\" width=\"9\" height=\"26.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"415\" y1=\"192.8\" x2=\"415\" y2=\"227.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"410.5\" y=\"196.8\" width=\"9\" height=\"26.6\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"430\" y1=\"219.4\" x2=\"430\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"425.5\" y=\"223.4\" width=\"9\" height=\"26.6\" fill=\"#ef4444\" rx=\"1\"/><text x=\"466\" y=\"114\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><ellipse cx=\"160\" cy=\"150\" rx=\"14\" ry=\"52\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"170\" y=\"250\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">collapse = supply</text><text x=\"170\" y=\"265\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">far exceeds demand</text><line x1=\"320\" y1=\"118\" x2=\"470\" y2=\"118\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"122\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">short at proximal</text><line x1=\"320\" y1=\"98\" x2=\"470\" y2=\"98\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"102\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop above distal</text><line x1=\"320\" y1=\"232\" x2=\"470\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"236\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">profit target 911</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Wrap the cluster with two lines before the open; short the first rally back into it.</text></svg>",
        "caption": "S&P 10-min supply built in advance: a quiet cluster collapses with one big red candle, two lines wrap the cluster, and hours later the rally into it is shorted to novice buyers with a target at 911."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p187-018.jpg",
        "caption": "Schwab Technology Focus Fund (SWTFX) monthly, 2002 to 2007: pivot-low demand A in late 2004 wrapped by two lines; B (2005) is the return to the upper line, after which the fund climbs to new highs in 2007.",
        "notes": [
          "Mutual funds can be bought at demand like any stock; the holdings do not matter.",
          "Whoever sells at B is selling after a decline and into demand."
        ]
      },
      {
        "src": "/lessons/seiden/p188-019.jpg",
        "caption": "US Dollar Index monthly, 2004 to mid-2009: supply A between about 89 and 92.5 at the late-2005 top, a long decline to about 71, then a sharp rally to B (about 88-89), the first revisit, and a turn down toward 80.",
        "notes": [
          "Dollar assets can rise in price and still lose buying power when the dollar falls from supply.",
          "The first revisit of a fresh monthly supply is where the currency risk is highest."
        ]
      },
      {
        "src": "/lessons/seiden/p189-020.jpg",
        "caption": "SPY daily, Sep to Nov 2007: supply A at the October top (lines about 155-157); price drops to about 149, rallies back to B around Nov 1 and then declines steadily to about 141.",
        "notes": [
          "When the index returns to supply, hedge: short SPY or S&P futures, or buy puts.",
          "The revisit B was a lower high under the zone, a clean hedge entry with a nearby stop."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"395\" y=\"103\" width=\"215\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"163\" y=\"213\" width=\"137\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Long-term money: buy demand, hedge at supply</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Fund (monthly): buy at B</text><line x1=\"40\" y1=\"86.0\" x2=\"40\" y2=\"134.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"36.0\" y=\"90.0\" width=\"8\" height=\"40.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"53\" y1=\"126.0\" x2=\"53\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"49.0\" y=\"130.0\" width=\"8\" height=\"40.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"66\" y1=\"166.0\" x2=\"66\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"62.0\" y=\"170.0\" width=\"8\" height=\"40.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"79\" y1=\"206.0\" x2=\"79\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"75.0\" y=\"210.0\" width=\"8\" height=\"40.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"92\" y1=\"216.0\" x2=\"92\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"88.0\" y=\"220.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"105\" y1=\"186.0\" x2=\"105\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"101.0\" y=\"190.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"118\" y1=\"156.0\" x2=\"118\" y2=\"194.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"114.0\" y=\"160.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"131\" y1=\"126.0\" x2=\"131\" y2=\"164.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"127.0\" y=\"130.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"144\" y1=\"126.0\" x2=\"144\" y2=\"179.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"140.0\" y=\"130.0\" width=\"8\" height=\"45.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"157\" y1=\"171.0\" x2=\"157\" y2=\"224.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"153.0\" y=\"175.0\" width=\"8\" height=\"45.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"170\" y1=\"213.0\" x2=\"170\" y2=\"227.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"166.0\" y=\"217.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"183\" y1=\"213.0\" x2=\"183\" y2=\"227.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"179.0\" y=\"217.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"196\" y1=\"191.0\" x2=\"196\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"192.0\" y=\"195.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"209\" y1=\"166.0\" x2=\"209\" y2=\"199.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"205.0\" y=\"170.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"166.0\" x2=\"222\" y2=\"200.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"170.0\" width=\"8\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"235\" y1=\"192.0\" x2=\"235\" y2=\"226.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"231.0\" y=\"196.0\" width=\"8\" height=\"26.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"248\" y1=\"189.6\" x2=\"248\" y2=\"226.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"244.0\" y=\"193.6\" width=\"8\" height=\"28.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"261\" y1=\"161.2\" x2=\"261\" y2=\"197.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"257.0\" y=\"165.2\" width=\"8\" height=\"28.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"274\" y1=\"132.8\" x2=\"274\" y2=\"169.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"270.0\" y=\"136.8\" width=\"8\" height=\"28.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"287\" y1=\"104.4\" x2=\"287\" y2=\"140.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"283.0\" y=\"108.4\" width=\"8\" height=\"28.4\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"300\" y1=\"76.0\" x2=\"300\" y2=\"112.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296.0\" y=\"80.0\" width=\"8\" height=\"28.4\" fill=\"#22c55e\" rx=\"1\"/><text x=\"170\" y=\"250\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">A</text><text x=\"222\" y=\"250\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">B</text><text x=\"340\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Index: hedge at B</text><line x1=\"350\" y1=\"226.0\" x2=\"350\" y2=\"274.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"346.0\" y=\"230.0\" width=\"8\" height=\"40.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"363\" y1=\"186.0\" x2=\"363\" y2=\"234.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"359.0\" y=\"190.0\" width=\"8\" height=\"40.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"146.0\" x2=\"376\" y2=\"194.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"372.0\" y=\"150.0\" width=\"8\" height=\"40.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"389\" y1=\"106.0\" x2=\"389\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"385.0\" y=\"110.0\" width=\"8\" height=\"40.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"402\" y1=\"103.0\" x2=\"402\" y2=\"117.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"398.0\" y=\"107.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"415\" y1=\"103.0\" x2=\"415\" y2=\"117.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"411.0\" y=\"107.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"428\" y1=\"106.0\" x2=\"428\" y2=\"144.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"424.0\" y=\"110.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"441\" y1=\"136.0\" x2=\"441\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"437.0\" y=\"140.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"454\" y1=\"166.0\" x2=\"454\" y2=\"204.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"450.0\" y=\"170.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"467\" y1=\"166.0\" x2=\"467\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"463.0\" y=\"170.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"480\" y1=\"136.0\" x2=\"480\" y2=\"174.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"476.0\" y=\"140.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"493\" y1=\"106.0\" x2=\"493\" y2=\"144.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"489.0\" y=\"110.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"506\" y1=\"106.0\" x2=\"506\" y2=\"148.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"502.0\" y=\"110.0\" width=\"8\" height=\"34.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"519\" y1=\"140.0\" x2=\"519\" y2=\"182.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"515.0\" y=\"144.0\" width=\"8\" height=\"34.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"532\" y1=\"174.0\" x2=\"532\" y2=\"216.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"528.0\" y=\"178.0\" width=\"8\" height=\"34.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"545\" y1=\"208.0\" x2=\"545\" y2=\"250.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"541.0\" y=\"212.0\" width=\"8\" height=\"34.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"558\" y1=\"242.0\" x2=\"558\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"554.0\" y=\"246.0\" width=\"8\" height=\"34.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"402\" y=\"96\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">A</text><text x=\"493\" y=\"96\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">B</text><text x=\"400\" y=\"296\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">hedge: short SPY/futures or buy puts</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Check the currency too: a dollar at supply means dollar assets lose buying power.</text></svg>",
        "caption": "Supply and demand for a nest egg: buy a fund at its pivot-low demand on the first return (B); when the index returns to supply (B), hedge the portfolio with a short or puts."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p192-022.jpg",
        "caption": "Alcoa daily, late 2008 to July 2009: XLT supply level box (about 11.9-12.4) around the early-January rally-base-decline spike top. Price falls to about 5.2 in March, rallies back into the box in early June (Shawn short entry at 12.08) and turns down to about 9.0-9.5.",
        "notes": [
          "A pivot high where price could not stay is supply; short its first return.",
          "Targets as multiples of risk: 10.85 (3:1) and 10.03 (5:1).",
          "Buyers in the box bought after a rally and into supply."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"103\" y=\"103\" width=\"367\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Rally-base-decline supply: short with 3:1 and 5:1 targets</text><line x1=\"40\" y1=\"242.0\" x2=\"40\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"35.5\" y=\"246.0\" width=\"9\" height=\"34.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"54\" y1=\"208.0\" x2=\"54\" y2=\"250.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"49.5\" y=\"212.0\" width=\"9\" height=\"34.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"68\" y1=\"174.0\" x2=\"68\" y2=\"216.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"63.5\" y=\"178.0\" width=\"9\" height=\"34.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"140.0\" x2=\"82\" y2=\"182.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77.5\" y=\"144.0\" width=\"9\" height=\"34.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"96\" y1=\"106.0\" x2=\"96\" y2=\"148.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"91.5\" y=\"110.0\" width=\"9\" height=\"34.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"110\" y1=\"103.0\" x2=\"110\" y2=\"117.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"105.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"124\" y1=\"103.0\" x2=\"124\" y2=\"117.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"119.5\" y=\"107.0\" width=\"9\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"138\" y1=\"106.0\" x2=\"138\" y2=\"144.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"133.5\" y=\"110.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"136.0\" x2=\"152\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"147.5\" y=\"140.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"166\" y1=\"166.0\" x2=\"166\" y2=\"204.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"161.5\" y=\"170.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"180\" y1=\"196.0\" x2=\"180\" y2=\"234.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"200.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"194\" y1=\"226.0\" x2=\"194\" y2=\"264.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"189.5\" y=\"230.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"208\" y1=\"256.0\" x2=\"208\" y2=\"294.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"203.5\" y=\"260.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"282.0\" x2=\"222\" y2=\"298.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"217.5\" y=\"286.0\" width=\"9\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"236\" y1=\"282.0\" x2=\"236\" y2=\"298.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"231.5\" y=\"286.0\" width=\"9\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"250\" y1=\"261.0\" x2=\"250\" y2=\"294.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"265.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"264\" y1=\"236.0\" x2=\"264\" y2=\"269.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.5\" y=\"240.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"278\" y1=\"211.0\" x2=\"278\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"273.5\" y=\"215.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"292\" y1=\"186.0\" x2=\"292\" y2=\"219.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"287.5\" y=\"190.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"306\" y1=\"161.0\" x2=\"306\" y2=\"194.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"301.5\" y=\"165.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"320\" y1=\"136.0\" x2=\"320\" y2=\"169.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"315.5\" y=\"140.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"334\" y1=\"111.0\" x2=\"334\" y2=\"144.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"329.5\" y=\"115.0\" width=\"9\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"348\" y1=\"111.0\" x2=\"348\" y2=\"141.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"343.5\" y=\"115.0\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"362\" y1=\"133.5\" x2=\"362\" y2=\"164.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"357.5\" y=\"137.5\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"376\" y1=\"156.0\" x2=\"376\" y2=\"186.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"371.5\" y=\"160.0\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"390\" y1=\"178.5\" x2=\"390\" y2=\"209.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"385.5\" y=\"182.5\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"404\" y1=\"201.0\" x2=\"404\" y2=\"231.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"399.5\" y=\"205.0\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"418\" y1=\"223.5\" x2=\"418\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"413.5\" y=\"227.5\" width=\"9\" height=\"22.5\" fill=\"#ef4444\" rx=\"1\"/><text x=\"103\" y=\"96\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">SUPPLY: rally-base-decline</text><line x1=\"328\" y1=\"112\" x2=\"470\" y2=\"112\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"116\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">short 12.08</text><line x1=\"328\" y1=\"98\" x2=\"470\" y2=\"98\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"100\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop</text><line x1=\"328\" y1=\"154\" x2=\"470\" y2=\"154\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"158\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T1 10.85 = 3R</text><line x1=\"328\" y1=\"182\" x2=\"470\" y2=\"182\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"186\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">T2 10.03 = 5R</text><text x=\"288\" y=\"300\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">buyers here: buying after a rally,</text><text x=\"288\" y=\"316\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">into supply (gas pedal into a wall)</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Lemonade-stand logic: sell high, where price could not stay before.</text></svg>",
        "caption": "Alcoa daily: a rally-base-decline pivot high near $12 is supply. When price rallies all the way back into it, short at 12.08 with targets at 3:1 and 5:1 of the risk."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p195-024.jpg",
        "caption": "Breakout example: a rising 20-period MA, grey demand box A (two lines) around a small drop-base-rally base, long green \"Breakout\" candles, B the high of the initial breakout, a sharp red candle back to the top line at C, and the rally to the B level where D marks the exit.",
        "notes": [
          "Do not buy the breakout; it shows where the buyers are.",
          "Buy the first return at C, stop below the bottom line, target B.",
          "The trend filter is the rising 20-period MA, and the base should be preceded by a drop."
        ]
      },
      {
        "src": "/lessons/seiden/p196-025.jpg",
        "caption": "Slide: \"Buying the Breakout\" (buy as price leaves pivot-low demand: higher risk, lower reward, lower probability) versus \"Buying the Retracement\" (buy the pullback to the zone after the breakout: low risk, high reward, high probability).",
        "notes": [
          "The same zone, two entries; the pullback puts the entry next to the stop."
        ]
      },
      {
        "src": "/lessons/seiden/p196-026.jpg",
        "caption": "Slide: \"Shorting the Breakdown\" versus \"Shorting the Retracement\" from pivot-high supply: the breakdown short is higher risk and lower reward; the short on the pullback to the zone is low risk, high reward.",
        "notes": [
          "Mirror rule for shorts: let price break down, then short the return to the origin."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"413\" y=\"233\" width=\"197\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"103\" y=\"233\" width=\"197\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Buying the breakout vs buying the retracement</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Breakout: the sucker bet</text><line x1=\"50\" y1=\"116.0\" x2=\"50\" y2=\"154.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"45.5\" y=\"120.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"65\" y1=\"146.0\" x2=\"65\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"60.5\" y=\"150.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"80\" y1=\"176.0\" x2=\"80\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"75.5\" y=\"180.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"95\" y1=\"206.0\" x2=\"95\" y2=\"244.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"90.5\" y=\"210.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"233.5\" x2=\"110\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"105.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"125\" y1=\"233.5\" x2=\"125\" y2=\"246.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"120.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"140\" y1=\"233.5\" x2=\"140\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"135.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"155\" y1=\"206.0\" x2=\"155\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"150.5\" y=\"210.0\" width=\"9\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"170\" y1=\"176.0\" x2=\"170\" y2=\"214.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"165.5\" y=\"180.0\" width=\"9\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"185\" y1=\"146.0\" x2=\"185\" y2=\"184.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"180.5\" y=\"150.0\" width=\"9\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"200\" y1=\"131.0\" x2=\"200\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"195.5\" y=\"135.0\" width=\"9\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"215\" y1=\"116.0\" x2=\"215\" y2=\"139.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"210.5\" y=\"120.0\" width=\"9\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"175\" y1=\"150\" x2=\"300\" y2=\"150\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"232\" y=\"144\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">buy here</text><line x1=\"175\" y1=\"254\" x2=\"300\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"232\" y=\"270\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop far below</text><text x=\"165\" y=\"296\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">higher risk, lower reward</text><text x=\"340\" y=\"60\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">Retracement: let it break out first</text><line x1=\"360\" y1=\"116.0\" x2=\"360\" y2=\"154.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"355.5\" y=\"120.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"375\" y1=\"146.0\" x2=\"375\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"370.5\" y=\"150.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"390\" y1=\"176.0\" x2=\"390\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"385.5\" y=\"180.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"405\" y1=\"206.0\" x2=\"405\" y2=\"244.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"400.5\" y=\"210.0\" width=\"9\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"420\" y1=\"233.5\" x2=\"420\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"415.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"435\" y1=\"233.5\" x2=\"435\" y2=\"246.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"430.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"450\" y1=\"233.5\" x2=\"450\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"445.5\" y=\"237.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"465\" y1=\"199.3\" x2=\"465\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460.5\" y=\"203.3\" width=\"9\" height=\"36.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"480\" y1=\"162.7\" x2=\"480\" y2=\"207.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"475.5\" y=\"166.7\" width=\"9\" height=\"36.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"495\" y1=\"126.0\" x2=\"495\" y2=\"170.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"490.5\" y=\"130.0\" width=\"9\" height=\"36.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"510\" y1=\"123.0\" x2=\"510\" y2=\"137.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"505.5\" y=\"127.0\" width=\"9\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"525\" y1=\"123.0\" x2=\"525\" y2=\"137.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"520.5\" y=\"127.0\" width=\"9\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"540\" y1=\"126.0\" x2=\"540\" y2=\"185.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"535.5\" y=\"130.0\" width=\"9\" height=\"51.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"555\" y1=\"177.0\" x2=\"555\" y2=\"236.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"550.5\" y=\"181.0\" width=\"9\" height=\"51.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"570\" y1=\"187.3\" x2=\"570\" y2=\"236.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"565.5\" y=\"191.3\" width=\"9\" height=\"40.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"585\" y1=\"146.7\" x2=\"585\" y2=\"195.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"580.5\" y=\"150.7\" width=\"9\" height=\"40.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"600\" y1=\"106.0\" x2=\"600\" y2=\"154.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"595.5\" y=\"110.0\" width=\"9\" height=\"40.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"545\" y1=\"233\" x2=\"610\" y2=\"233\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"600\" y=\"274\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">buy the pullback</text><line x1=\"545\" y1=\"254\" x2=\"610\" y2=\"254\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"475\" y=\"296\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">low risk, high reward</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">The breakout reveals where the buyers are; buy from the seller on the return, not the breakout.</text></svg>",
        "caption": "Same demand, two entries: buying the breakout candle puts the stop far away for little reward; letting the breakout happen and buying the first pullback to the zone keeps the stop tight and the reward large."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"145\" y=\"224\" width=\"375\" height=\"16\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Breakout-entry rules: 20 MA, drop-base-rally, target B</text><line x1=\"40\" y1=\"166.0\" x2=\"40\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"35.5\" y=\"170.0\" width=\"9\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"54\" y1=\"171.0\" x2=\"54\" y2=\"184.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"49.5\" y=\"175.0\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"68\" y1=\"171.0\" x2=\"68\" y2=\"186.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"63.5\" y=\"175.0\" width=\"9\" height=\"7.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"82\" y1=\"174.0\" x2=\"82\" y2=\"186.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"77.5\" y=\"178.0\" width=\"9\" height=\"4.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"96\" y1=\"174.0\" x2=\"96\" y2=\"190.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"91.5\" y=\"178.0\" width=\"9\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"182.0\" x2=\"110\" y2=\"205.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"105.5\" y=\"186.0\" width=\"9\" height=\"15.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"124\" y1=\"197.3\" x2=\"124\" y2=\"220.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"119.5\" y=\"201.3\" width=\"9\" height=\"15.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"138\" y1=\"212.7\" x2=\"138\" y2=\"236.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"133.5\" y=\"216.7\" width=\"9\" height=\"15.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"225.5\" x2=\"152\" y2=\"238.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"147.5\" y=\"229.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"166\" y1=\"225.5\" x2=\"166\" y2=\"238.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"161.5\" y=\"229.5\" width=\"9\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"180\" y1=\"225.5\" x2=\"180\" y2=\"238.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"229.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"194\" y1=\"200.0\" x2=\"194\" y2=\"236.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"189.5\" y=\"204.0\" width=\"9\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"208\" y1=\"172.0\" x2=\"208\" y2=\"208.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"203.5\" y=\"176.0\" width=\"9\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"144.0\" x2=\"222\" y2=\"180.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"217.5\" y=\"148.0\" width=\"9\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"236\" y1=\"116.0\" x2=\"236\" y2=\"152.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"231.5\" y=\"120.0\" width=\"9\" height=\"28.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"250\" y1=\"112.0\" x2=\"250\" y2=\"128.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"116.0\" width=\"9\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"264\" y1=\"112.0\" x2=\"264\" y2=\"128.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"259.5\" y=\"116.0\" width=\"9\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"278\" y1=\"112.0\" x2=\"278\" y2=\"128.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"273.5\" y=\"116.0\" width=\"9\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"292\" y1=\"116.0\" x2=\"292\" y2=\"159.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"287.5\" y=\"120.0\" width=\"9\" height=\"35.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"306\" y1=\"151.3\" x2=\"306\" y2=\"194.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"301.5\" y=\"155.3\" width=\"9\" height=\"35.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"320\" y1=\"186.7\" x2=\"320\" y2=\"230.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"315.5\" y=\"190.7\" width=\"9\" height=\"35.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"196.8\" x2=\"334\" y2=\"230.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"329.5\" y=\"200.8\" width=\"9\" height=\"25.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"348\" y1=\"171.6\" x2=\"348\" y2=\"204.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"343.5\" y=\"175.6\" width=\"9\" height=\"25.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"362\" y1=\"146.4\" x2=\"362\" y2=\"179.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"357.5\" y=\"150.4\" width=\"9\" height=\"25.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"376\" y1=\"121.2\" x2=\"376\" y2=\"154.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"371.5\" y=\"125.2\" width=\"9\" height=\"25.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"390\" y1=\"96.0\" x2=\"390\" y2=\"129.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"385.5\" y=\"100.0\" width=\"9\" height=\"25.2\" fill=\"#22c55e\" rx=\"1\"/><polyline points=\"60,300 160,292 260,262 360,215 440,180 520,150\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2\"/><text x=\"516\" y=\"236\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DEMAND</text><text x=\"166\" y=\"262\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">A</text><line x1=\"242\" y1=\"110\" x2=\"520\" y2=\"110\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"238\" y=\"114\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">B: breakout high</text><text x=\"526\" y=\"114\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">TARGET</text><line x1=\"310\" y1=\"248\" x2=\"520\" y2=\"248\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"526\" y=\"252\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">STOP</text><text x=\"320\" y=\"266\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">C: buy</text><text x=\"404\" y=\"98\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">D: exit</text><text x=\"70\" y=\"318\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">20-period MA rising = uptrend</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Profit margin = distance from A to B. Check the higher-timeframe curve before taking it.</text></svg>",
        "caption": "The full setup: uptrend by a rising 20-period MA, demand A is a drop-base-rally at the origin of the breakout, B is the high of the initial breakout. Buy C at the top line, stop under the bottom line, exit D at B."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p200-028.jpg",
        "caption": "Genzyme 30-min, 7/23 to early Aug 2009: demand lines about 51.0-51.3 under the 7/23 low; supply lines about 55.8-56.5 around the 7/30 top. On 7/31 a huge red candle drops to about 52 where a circled cluster (pocket of sellers) forms; the student bought at the demand line and price broke through to about 50.",
        "notes": [
          "Low odds: supply not far above, a weak latest rally and a repeated return to the level.",
          "The circled cluster between entry and supply was a pocket of sellers.",
          "The S&P was not at demand, so the trade was against the market timing."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"201\" y=\"117\" width=\"299\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"75\" y=\"248\" width=\"425\" height=\"14\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Why the GENZ long failed: three low-odds clues</text><line x1=\"40\" y1=\"166.0\" x2=\"40\" y2=\"202.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"36.0\" y=\"170.0\" width=\"8\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"54\" y1=\"194.3\" x2=\"54\" y2=\"230.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"50.0\" y=\"198.3\" width=\"8\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"68\" y1=\"222.7\" x2=\"68\" y2=\"259.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"64.0\" y=\"226.7\" width=\"8\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"82\" y1=\"248.5\" x2=\"82\" y2=\"261.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"78.0\" y=\"252.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"96\" y1=\"248.5\" x2=\"96\" y2=\"261.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"92.0\" y=\"252.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"110\" y1=\"222.2\" x2=\"110\" y2=\"259.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"106.0\" y=\"226.2\" width=\"8\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"124\" y1=\"193.5\" x2=\"124\" y2=\"230.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"120.0\" y=\"197.5\" width=\"8\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"138\" y1=\"164.8\" x2=\"138\" y2=\"201.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"134.0\" y=\"168.8\" width=\"8\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"152\" y1=\"136.0\" x2=\"152\" y2=\"172.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"148.0\" y=\"140.0\" width=\"8\" height=\"28.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"166\" y1=\"131.0\" x2=\"166\" y2=\"144.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"162.0\" y=\"135.0\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"180\" y1=\"126.0\" x2=\"180\" y2=\"139.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"176.0\" y=\"130.0\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"194\" y1=\"121.0\" x2=\"194\" y2=\"134.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"190.0\" y=\"125.0\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"208\" y1=\"118.5\" x2=\"208\" y2=\"131.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"204.0\" y=\"122.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"118.5\" x2=\"222\" y2=\"131.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"122.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"236\" y1=\"118.5\" x2=\"236\" y2=\"131.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"232.0\" y=\"122.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"250\" y1=\"118.0\" x2=\"250\" y2=\"216.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"246.0\" y=\"125.0\" width=\"8\" height=\"87.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"205.5\" x2=\"264\" y2=\"218.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260.0\" y=\"209.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"278\" y1=\"205.5\" x2=\"278\" y2=\"218.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"274.0\" y=\"209.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"292\" y1=\"205.5\" x2=\"292\" y2=\"218.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"288.0\" y=\"209.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"306\" y1=\"208.0\" x2=\"306\" y2=\"258.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"302.0\" y=\"212.0\" width=\"8\" height=\"42.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"320\" y1=\"250.0\" x2=\"320\" y2=\"278.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"316.0\" y=\"254.0\" width=\"8\" height=\"20.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"334\" y1=\"270.5\" x2=\"334\" y2=\"299.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"330.0\" y=\"274.5\" width=\"8\" height=\"20.5\" fill=\"#ef4444\" rx=\"1\"/><text x=\"496\" y=\"259\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DEMAND</text><text x=\"496\" y=\"128\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><ellipse cx=\"278\" cy=\"212\" rx=\"32\" ry=\"14\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"314\" y=\"196\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">3: pocket of sellers</text><text x=\"198\" y=\"100\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">1: supply close above = little room</text><line x1=\"276\" y1=\"296\" x2=\"304\" y2=\"262\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"304.0,262.0 301.7,269.7 296.9,265.7\" fill=\"#f59e0b\"/><text x=\"272\" y=\"310\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">2: weak rally, late return: low odds</text><text x=\"510\" y=\"230\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">+ S&amp;P not at demand</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Need room to the next supply, a strong move away and the index on your side.</text></svg>",
        "caption": "The failed GENZ long: opposing supply sat close above, a pocket of sellers based between the entry and that supply, the latest rally from the zone was weak and repeated, and the S&P was not at demand."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p203-030.jpg",
        "caption": "Long-term chart rising from about 65 to about 150 with volume: double-headed arrows join successive pivot lows (about 75, 98, 125, 135) and get shorter, labelled \"Decreasing distance between the pivot lows\". At the right price stalls near 150 and turns down.",
        "notes": [
          "Shrinking distance between pullbacks warns that the trend is weakening.",
          "A strong trend does not pull back often."
        ]
      },
      {
        "src": "/lessons/seiden/p204-031.jpg",
        "caption": "DryShips daily, June to mid-Aug 2009 with two moving averages: the circled MA cross in late June sits just right of a supply level (lines about 7.1-7.45) where price topped. Price falls to about 4.9, then a big green candle on 7/27 reaches about 7.1 (\"Selling Opportunity\") and price falls back to about 6.1-6.5.",
        "notes": [
          "Use a past MA cross only to look slightly left for the origin of the strong move.",
          "The return to that supply is the sell; the cross itself is never the trigger."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Trend health: watch the distance between pivot lows</text><line x1=\"40\" y1=\"291.0\" x2=\"40\" y2=\"314.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"36.0\" y=\"295.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"53\" y1=\"276.0\" x2=\"53\" y2=\"299.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"49.0\" y=\"280.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"66\" y1=\"261.0\" x2=\"66\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"62.0\" y=\"265.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"79\" y1=\"246.0\" x2=\"79\" y2=\"269.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"75.0\" y=\"250.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"92\" y1=\"246.0\" x2=\"92\" y2=\"265.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88.0\" y=\"250.0\" width=\"8\" height=\"11.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"105\" y1=\"257.0\" x2=\"105\" y2=\"276.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"101.0\" y=\"261.0\" width=\"8\" height=\"11.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"118\" y1=\"253.5\" x2=\"118\" y2=\"276.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"114.0\" y=\"257.5\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"131\" y1=\"239.0\" x2=\"131\" y2=\"261.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"127.0\" y=\"243.0\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"144\" y1=\"224.5\" x2=\"144\" y2=\"247.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"140.0\" y=\"228.5\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"157\" y1=\"210.0\" x2=\"157\" y2=\"232.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"153.0\" y=\"214.0\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"170\" y1=\"195.5\" x2=\"170\" y2=\"218.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"166.0\" y=\"199.5\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"183\" y1=\"181.0\" x2=\"183\" y2=\"203.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"179.0\" y=\"185.0\" width=\"8\" height=\"14.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"196\" y1=\"181.0\" x2=\"196\" y2=\"199.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"192.0\" y=\"185.0\" width=\"8\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"209\" y1=\"191.0\" x2=\"209\" y2=\"209.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"205.0\" y=\"195.0\" width=\"8\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"184.8\" x2=\"222\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"188.8\" width=\"8\" height=\"16.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"235\" y1=\"168.5\" x2=\"235\" y2=\"192.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"231.0\" y=\"172.5\" width=\"8\" height=\"16.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"248\" y1=\"152.2\" x2=\"248\" y2=\"176.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"244.0\" y=\"156.2\" width=\"8\" height=\"16.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"261\" y1=\"136.0\" x2=\"261\" y2=\"160.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"257.0\" y=\"140.0\" width=\"8\" height=\"16.2\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"274\" y1=\"136.0\" x2=\"274\" y2=\"160.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"270.0\" y=\"140.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"287\" y1=\"131.5\" x2=\"287\" y2=\"160.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"283.0\" y=\"135.5\" width=\"8\" height=\"20.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"300\" y1=\"111.0\" x2=\"300\" y2=\"139.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"296.0\" y=\"115.0\" width=\"8\" height=\"20.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"313\" y1=\"111.0\" x2=\"313\" y2=\"128.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"309.0\" y=\"115.0\" width=\"8\" height=\"9.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"326\" y1=\"96.0\" x2=\"326\" y2=\"128.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"322.0\" y=\"100.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"339\" y1=\"96.0\" x2=\"339\" y2=\"114.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"335.0\" y=\"100.0\" width=\"8\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"352\" y1=\"91.0\" x2=\"352\" y2=\"114.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"348.0\" y=\"95.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"365\" y1=\"91.0\" x2=\"365\" y2=\"124.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"361.0\" y=\"95.0\" width=\"8\" height=\"25.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"378\" y1=\"116.0\" x2=\"378\" y2=\"149.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"374.0\" y=\"120.0\" width=\"8\" height=\"25.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"391\" y1=\"141.0\" x2=\"391\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"387.0\" y=\"145.0\" width=\"8\" height=\"25.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"115\" y1=\"290\" x2=\"205\" y2=\"225\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"205.0,225.0 200.9,231.8 197.2,226.8\" fill=\"#f59e0b\"/><line x1=\"205\" y1=\"225\" x2=\"115\" y2=\"290\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"115.0,290.0 119.1,283.2 122.8,288.2\" fill=\"#f59e0b\"/><line x1=\"219\" y1=\"223\" x2=\"270\" y2=\"176\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"270.0,176.0 266.7,183.3 262.5,178.7\" fill=\"#f59e0b\"/><line x1=\"270\" y1=\"176\" x2=\"219\" y2=\"223\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"219.0,223.0 222.3,215.7 226.5,220.3\" fill=\"#f59e0b\"/><line x1=\"284\" y1=\"174\" x2=\"309\" y2=\"144\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"309.0,144.0 306.7,151.7 301.9,147.7\" fill=\"#f59e0b\"/><line x1=\"309\" y1=\"144\" x2=\"284\" y2=\"174\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"284.0,174.0 286.3,166.3 291.1,170.3\" fill=\"#f59e0b\"/><text x=\"250\" y=\"300\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">shrinking distance between pullbacks</text><text x=\"250\" y=\"316\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">= trend weakening, end likely near</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">A strong trend does not pull back often. Frequent pullbacks mean balance is approaching.</text></svg>",
        "caption": "Same tool, different thought: measure the distance between pivot lows of an uptrend. When the distance keeps shrinking, the trend is losing its imbalance and is likely to end soon."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"72\" y=\"103\" width=\"488\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Moving-average cross as a locator, not a signal</text><line x1=\"40\" y1=\"146.0\" x2=\"40\" y2=\"174.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"36.0\" y=\"150.0\" width=\"8\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"53\" y1=\"126.0\" x2=\"53\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"49.0\" y=\"130.0\" width=\"8\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"66\" y1=\"106.0\" x2=\"66\" y2=\"134.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"62.0\" y=\"110.0\" width=\"8\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"79\" y1=\"103.0\" x2=\"79\" y2=\"117.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"75.0\" y=\"107.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"92\" y1=\"103.0\" x2=\"92\" y2=\"117.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"88.0\" y=\"107.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"105\" y1=\"106.0\" x2=\"105\" y2=\"132.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"101.0\" y=\"110.0\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"118\" y1=\"124.9\" x2=\"118\" y2=\"151.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"114.0\" y=\"128.9\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"131\" y1=\"143.8\" x2=\"131\" y2=\"170.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"127.0\" y=\"147.8\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"144\" y1=\"162.7\" x2=\"144\" y2=\"189.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"140.0\" y=\"166.7\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"157\" y1=\"181.6\" x2=\"157\" y2=\"208.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"153.0\" y=\"185.6\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"170\" y1=\"200.4\" x2=\"170\" y2=\"227.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"166.0\" y=\"204.4\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"183\" y1=\"219.3\" x2=\"183\" y2=\"246.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"179.0\" y=\"223.3\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"196\" y1=\"238.2\" x2=\"196\" y2=\"265.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"192.0\" y=\"242.2\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"209\" y1=\"257.1\" x2=\"209\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"205.0\" y=\"261.1\" width=\"8\" height=\"18.9\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"272.0\" x2=\"222\" y2=\"288.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"276.0\" width=\"8\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"235\" y1=\"272.0\" x2=\"235\" y2=\"288.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"231.0\" y=\"276.0\" width=\"8\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"248\" y1=\"251.0\" x2=\"248\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"244.0\" y=\"255.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"261\" y1=\"226.0\" x2=\"261\" y2=\"259.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"257.0\" y=\"230.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"274\" y1=\"201.0\" x2=\"274\" y2=\"234.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"270.0\" y=\"205.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"287\" y1=\"176.0\" x2=\"287\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"283.0\" y=\"180.0\" width=\"8\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"300\" y1=\"176.0\" x2=\"300\" y2=\"209.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"296.0\" y=\"180.0\" width=\"8\" height=\"25.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"313\" y1=\"112.0\" x2=\"313\" y2=\"210.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"309.0\" y=\"116.0\" width=\"8\" height=\"89.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"326\" y1=\"112.0\" x2=\"326\" y2=\"133.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"322.0\" y=\"116.0\" width=\"8\" height=\"13.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"339\" y1=\"125.5\" x2=\"339\" y2=\"147.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"335.0\" y=\"129.5\" width=\"8\" height=\"13.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"352\" y1=\"139.0\" x2=\"352\" y2=\"160.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"348.0\" y=\"143.0\" width=\"8\" height=\"13.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"365\" y1=\"152.5\" x2=\"365\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"361.0\" y=\"156.5\" width=\"8\" height=\"13.5\" fill=\"#ef4444\" rx=\"1\"/><polyline points=\"66,130 79,116 92,110 105,116 118,130 131,148 144,167 157,186 170,204 183,223 196,242 209,261 222,272 235,280 248,272 261,256 274,230 287,205 300,197 313,167 326,150 339,130 352,143 365,156\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"2\"/><polyline points=\"131,132 144,136 157,145 170,160 183,176 196,195 209,214 222,230 235,245 248,253 261,256 274,254 287,246 300,239 313,219 326,201 339,183 352,171 365,163\" fill=\"none\" stroke=\"#38bdf8\" stroke-width=\"2\"/><text x=\"556\" y=\"114\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><text x=\"566\" y=\"122\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"566\" y=\"107\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><ellipse cx=\"150\" cy=\"150\" rx=\"22\" ry=\"18\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><line x1=\"128\" y1=\"140\" x2=\"100\" y2=\"122\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"100.0,122.0 107.9,123.4 104.5,128.6\" fill=\"#f59e0b\"/><text x=\"190\" y=\"64\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">cross: look slightly LEFT</text><text x=\"190\" y=\"80\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">to find the origin of the move</text><text x=\"380\" y=\"150\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">selling opportunity</text><text x=\"40\" y=\"300\" fill=\"#a78bfa\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">fast MA</text><text x=\"110\" y=\"300\" fill=\"#38bdf8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">slow MA</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">MAs lag price; they only cross because a strong move started at an imbalance.</text></svg>",
        "caption": "DryShips: two moving averages cross after a strong decline. The cross is not the trade; it points to the supply level just to its left, which is sold when price rallies back to it."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p208-033.jpg",
        "caption": "Live XLT session screen, Aug 19, 2009: participants and chat on the left, several charts on the right; the main chart shows an uptrend and a two-line demand box drawn from an earlier base, with price gapping down into it at the far right (circled).",
        "notes": [
          "The top-down plan is done before the open; the gap into demand is the sale."
        ]
      },
      {
        "src": "/lessons/seiden/p209-034.jpg",
        "caption": "QQQQ 30-min, 7/22 to 8/24/2009: two lines wrap the late-July base from which price rallied strongly. Price ranges in early August, falls into the zone around 8/17-8/19, and a large ellipse marks the rally out of it to new highs by 8/24.",
        "notes": [
          "Index at demand while the news is bad: buy wholesale.",
          "The first return to the origin of a strong rally produced another strong rally."
        ]
      },
      {
        "src": "/lessons/seiden/p210-035.jpg",
        "caption": "Cisco 60-min, 8/14 to 8/24/2009: price drops from about 21.5 to a base near 20.7-20.8 on 8/17, wrapped by lines at about 20.65 and 20.82. On 8/19 a candle dips back to the zone and price climbs steadily to about 22.6.",
        "notes": [
          "Stock demand aligned with the index demand on the same morning.",
          "Entry at the upper line, stop under the lower line, a very small risk for a large move."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"262\" width=\"520\" height=\"18\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"40\" y=\"82\" width=\"520\" height=\"18\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Wholesale vs retail: the pizza owner already trades</text><line x1=\"60\" y1=\"126.0\" x2=\"60\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"130.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"76\" y1=\"106.0\" x2=\"76\" y2=\"134.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"71.0\" y=\"110.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"92\" y1=\"86.0\" x2=\"92\" y2=\"114.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"87.0\" y=\"90.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"108\" y1=\"83.0\" x2=\"108\" y2=\"97.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"103.0\" y=\"87.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"124\" y1=\"83.0\" x2=\"124\" y2=\"97.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"119.0\" y=\"87.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"140\" y1=\"86.0\" x2=\"140\" y2=\"119.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"135.0\" y=\"90.0\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"156\" y1=\"111.7\" x2=\"156\" y2=\"145.4\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"151.0\" y=\"115.7\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"172\" y1=\"137.4\" x2=\"172\" y2=\"171.1\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"167.0\" y=\"141.4\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"188\" y1=\"163.1\" x2=\"188\" y2=\"196.9\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"183.0\" y=\"167.1\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"204\" y1=\"188.9\" x2=\"204\" y2=\"222.6\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"199.0\" y=\"192.9\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"220\" y1=\"214.6\" x2=\"220\" y2=\"248.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"215.0\" y=\"218.6\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"236\" y1=\"240.3\" x2=\"236\" y2=\"274.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"231.0\" y=\"244.3\" width=\"10\" height=\"25.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"252\" y1=\"263.0\" x2=\"252\" y2=\"277.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"247.0\" y=\"267.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"268\" y1=\"263.0\" x2=\"268\" y2=\"277.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"263.0\" y=\"267.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"284\" y1=\"241.0\" x2=\"284\" y2=\"274.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"279.0\" y=\"245.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"300\" y1=\"216.0\" x2=\"300\" y2=\"249.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"295.0\" y=\"220.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"316\" y1=\"191.0\" x2=\"316\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"311.0\" y=\"195.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"332\" y1=\"166.0\" x2=\"332\" y2=\"199.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"327.0\" y=\"170.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"348\" y1=\"141.0\" x2=\"348\" y2=\"174.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"343.0\" y=\"145.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"364\" y1=\"116.0\" x2=\"364\" y2=\"149.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"359.0\" y=\"120.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"380\" y1=\"91.0\" x2=\"380\" y2=\"124.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"375.0\" y=\"95.0\" width=\"10\" height=\"25.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"396\" y1=\"91.0\" x2=\"396\" y2=\"125.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"391.0\" y=\"95.0\" width=\"10\" height=\"26.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"412\" y1=\"117.2\" x2=\"412\" y2=\"151.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"407.0\" y=\"121.2\" width=\"10\" height=\"26.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"428\" y1=\"143.5\" x2=\"428\" y2=\"177.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"423.0\" y=\"147.5\" width=\"10\" height=\"26.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"444\" y1=\"169.8\" x2=\"444\" y2=\"204.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"439.0\" y=\"173.8\" width=\"10\" height=\"26.2\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"40\" y1=\"180\" x2=\"560\" y2=\"180\" stroke=\"#94a3b8\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"570\" y=\"88\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">cheese $4/lb</text><text x=\"570\" y=\"102\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">buy only what</text><text x=\"570\" y=\"114\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">you need</text><text x=\"570\" y=\"184\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">$2 average</text><text x=\"570\" y=\"268\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">cheese $1/lb</text><text x=\"570\" y=\"282\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">buy all you</text><text x=\"570\" y=\"294\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">can store</text><text x=\"60\" y=\"76\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">RETAIL = supply</text><text x=\"60\" y=\"300\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">WHOLESALE = demand</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Nobody pays $30,000 for a $20,000 car, yet traders wait for higher prices before they buy.</text></svg>",
        "caption": "Everyday logic on a chart: buy heavily when price is at wholesale (demand) and only a little or not at all when it is at retail (supply), exactly as a pizza owner buys cheese."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"382\" y=\"233\" width=\"228\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"72\" y=\"233\" width=\"228\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Gap down into demand = a sale, for index and stock</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">QQQQ 30-min</text><line x1=\"42\" y1=\"146.0\" x2=\"42\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"38.0\" y=\"150.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"54\" y1=\"176.0\" x2=\"54\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"50.0\" y=\"180.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"66\" y1=\"206.0\" x2=\"66\" y2=\"244.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"62.0\" y=\"210.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"78\" y1=\"233.5\" x2=\"78\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"74.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"90\" y1=\"233.5\" x2=\"90\" y2=\"246.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"86.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"102\" y1=\"233.5\" x2=\"102\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"98.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"114\" y1=\"212.0\" x2=\"114\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"110.0\" y=\"216.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"188.0\" x2=\"126\" y2=\"220.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"122.0\" y=\"192.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"138\" y1=\"164.0\" x2=\"138\" y2=\"196.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"134.0\" y=\"168.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"150\" y1=\"140.0\" x2=\"150\" y2=\"172.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"146.0\" y=\"144.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"162\" y1=\"116.0\" x2=\"162\" y2=\"148.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"158.0\" y=\"120.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"174\" y1=\"116.0\" x2=\"174\" y2=\"140.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"170.0\" y=\"120.0\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"186\" y1=\"132.7\" x2=\"186\" y2=\"157.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"182.0\" y=\"136.7\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"198\" y1=\"149.3\" x2=\"198\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"194.0\" y=\"153.3\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"210\" y1=\"166.0\" x2=\"210\" y2=\"201.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"206.0\" y=\"170.0\" width=\"8\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"222\" y1=\"193.5\" x2=\"222\" y2=\"229.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"218.0\" y=\"197.5\" width=\"8\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"234\" y1=\"210.0\" x2=\"234\" y2=\"252.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"230.0\" y=\"214.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"246\" y1=\"189.2\" x2=\"246\" y2=\"218.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"242.0\" y=\"193.2\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"258\" y1=\"168.4\" x2=\"258\" y2=\"197.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"254.0\" y=\"172.4\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"270\" y1=\"147.6\" x2=\"270\" y2=\"176.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"266.0\" y=\"151.6\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"282\" y1=\"126.8\" x2=\"282\" y2=\"155.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"278.0\" y=\"130.8\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"294\" y1=\"106.0\" x2=\"294\" y2=\"134.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"290.0\" y=\"110.0\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><text x=\"234\" y=\"280\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Aug 19: buy</text><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"340\" y=\"60\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">CSCO 60-min</text><line x1=\"352\" y1=\"146.0\" x2=\"352\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"348.0\" y=\"150.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"364\" y1=\"176.0\" x2=\"364\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"360.0\" y=\"180.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"376\" y1=\"206.0\" x2=\"376\" y2=\"244.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"372.0\" y=\"210.0\" width=\"8\" height=\"30.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"388\" y1=\"233.5\" x2=\"388\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"384.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"400\" y1=\"233.5\" x2=\"400\" y2=\"246.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"396.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"412\" y1=\"233.5\" x2=\"412\" y2=\"246.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"408.0\" y=\"237.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"424\" y1=\"212.0\" x2=\"424\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"420.0\" y=\"216.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"436\" y1=\"188.0\" x2=\"436\" y2=\"220.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"432.0\" y=\"192.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"448\" y1=\"164.0\" x2=\"448\" y2=\"196.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"444.0\" y=\"168.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"460\" y1=\"140.0\" x2=\"460\" y2=\"172.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"456.0\" y=\"144.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"472\" y1=\"116.0\" x2=\"472\" y2=\"148.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"468.0\" y=\"120.0\" width=\"8\" height=\"24.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"484\" y1=\"116.0\" x2=\"484\" y2=\"140.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"480.0\" y=\"120.0\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"496\" y1=\"132.7\" x2=\"496\" y2=\"157.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"492.0\" y=\"136.7\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"508\" y1=\"149.3\" x2=\"508\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"504.0\" y=\"153.3\" width=\"8\" height=\"16.7\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"520\" y1=\"166.0\" x2=\"520\" y2=\"201.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"516.0\" y=\"170.0\" width=\"8\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"532\" y1=\"193.5\" x2=\"532\" y2=\"229.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"528.0\" y=\"197.5\" width=\"8\" height=\"27.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"544\" y1=\"210.0\" x2=\"544\" y2=\"252.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"540.0\" y=\"214.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"556\" y1=\"189.2\" x2=\"556\" y2=\"218.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"552.0\" y=\"193.2\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"568\" y1=\"168.4\" x2=\"568\" y2=\"197.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"564.0\" y=\"172.4\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"580\" y1=\"147.6\" x2=\"580\" y2=\"176.4\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"576.0\" y=\"151.6\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"592\" y1=\"126.8\" x2=\"592\" y2=\"155.6\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"588.0\" y=\"130.8\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"604\" y1=\"106.0\" x2=\"604\" y2=\"134.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"600.0\" y=\"110.0\" width=\"8\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><text x=\"544\" y=\"280\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">Aug 19: buy</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Sellers on the gap down ignored the level. Stock demand aligned with index demand.</text></svg>",
        "caption": "Aug 19, 2009: the NASDAQ dropped into its demand at the same time CSCO sat at aligned demand. Bad news made it cheap; both were bought wholesale and rallied to new highs."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p213-037.jpg",
        "caption": "SPY 15-min, 8/27 to 8/31/2009 (pre-market): two lines labelled \"S&P Supply\" at about 103.1 and 103.5 wrap a small base late on 8/28; on 8/31 price gaps down from it to about 102.0-102.4.",
        "notes": [
          "A gap away from a base marks strong supply.",
          "Price opened below the level, so the plan waits for a rally back into it."
        ]
      },
      {
        "src": "/lessons/seiden/p214-038.jpg",
        "caption": "Live XLT Stock Mastery screen with seven panes (XLF, C, BAC, COF, GS, JPM, MS); callouts mark the XLF supply level, two Citigroup supply levels and the Goldman Sachs supply level, all above current price.",
        "notes": [
          "Sector and stocks were checked for supply matching the index supply."
        ]
      },
      {
        "src": "/lessons/seiden/p215-039.jpg",
        "caption": "SPY 15-min (after): the same supply about 103.1-103.5. On Sep 1 price rallies from about 102 into the lower line (XLT short entry) and collapses to about 100.4-100.6.",
        "notes": [
          "The rally into the gap-origin supply was the short; the buyers there bought after a rally into supply.",
          "Risk about half a point for a drop of more than two and a half points."
        ]
      },
      {
        "src": "/lessons/seiden/p216-040.jpg",
        "caption": "Goldman Sachs 15-min and Citigroup 30-min: GS supply level about 165.5-166 from the 8/28 top, rallied into on Sep 1 (XLT short entry) and fell to about 160.2; C supply about 5.00-5.05 from the 8/28-8/31 base, rallied into on Sep 1 and dropped to about 4.55.",
        "notes": [
          "Index, sector and stocks at supply together stack the odds.",
          "Each short was entered on the rally into the level, never on the way down."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"108\" y=\"143\" width=\"362\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Gap-down supply: wait for the rally into it, then short</text><line x1=\"40\" y1=\"226.0\" x2=\"40\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"35.5\" y=\"230.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"55\" y1=\"206.0\" x2=\"55\" y2=\"234.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"50.5\" y=\"210.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"70\" y1=\"186.0\" x2=\"70\" y2=\"214.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"65.5\" y=\"190.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"85\" y1=\"166.0\" x2=\"85\" y2=\"194.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"80.5\" y=\"170.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"100\" y1=\"146.0\" x2=\"100\" y2=\"174.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"95.5\" y=\"150.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"115\" y1=\"143.5\" x2=\"115\" y2=\"156.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"110.5\" y=\"147.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"130\" y1=\"143.5\" x2=\"130\" y2=\"156.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"125.5\" y=\"147.5\" width=\"9\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"145\" y1=\"143.5\" x2=\"145\" y2=\"156.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"140.5\" y=\"147.5\" width=\"9\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"160\" y1=\"214.0\" x2=\"160\" y2=\"230.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"155.5\" y=\"218.0\" width=\"9\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"175\" y1=\"214.0\" x2=\"175\" y2=\"230.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"170.5\" y=\"218.0\" width=\"9\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"190\" y1=\"214.0\" x2=\"190\" y2=\"230.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"185.5\" y=\"218.0\" width=\"9\" height=\"8.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"205\" y1=\"214.0\" x2=\"205\" y2=\"230.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"200.5\" y=\"218.0\" width=\"9\" height=\"8.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"220\" y1=\"200.5\" x2=\"220\" y2=\"226.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"215.5\" y=\"204.5\" width=\"9\" height=\"17.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"235\" y1=\"183.0\" x2=\"235\" y2=\"208.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"230.5\" y=\"187.0\" width=\"9\" height=\"17.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"250\" y1=\"165.5\" x2=\"250\" y2=\"191.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"245.5\" y=\"169.5\" width=\"9\" height=\"17.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"265\" y1=\"148.0\" x2=\"265\" y2=\"173.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260.5\" y=\"152.0\" width=\"9\" height=\"17.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"280\" y1=\"148.0\" x2=\"280\" y2=\"179.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"275.5\" y=\"152.0\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"295\" y1=\"171.8\" x2=\"295\" y2=\"203.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"290.5\" y=\"175.8\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"310\" y1=\"195.7\" x2=\"310\" y2=\"227.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"305.5\" y=\"199.7\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"325\" y1=\"219.5\" x2=\"325\" y2=\"251.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"320.5\" y=\"223.5\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"340\" y1=\"243.3\" x2=\"340\" y2=\"275.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"335.5\" y=\"247.3\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"355\" y1=\"267.2\" x2=\"355\" y2=\"299.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"350.5\" y=\"271.2\" width=\"9\" height=\"23.8\" fill=\"#ef4444\" rx=\"1\"/><text x=\"466\" y=\"154\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><ellipse cx=\"152\" cy=\"190\" rx=\"14\" ry=\"30\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"170\" y=\"300\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">gap away = too much supply</text><line x1=\"212\" y1=\"60\" x2=\"212\" y2=\"320\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><text x=\"216\" y=\"74\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">Sept 1 open</text><line x1=\"255\" y1=\"158\" x2=\"470\" y2=\"158\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"162\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">short at proximal</text><line x1=\"255\" y1=\"138\" x2=\"470\" y2=\"138\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"142\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop</text><text x=\"474\" y=\"200\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">S&amp;P + XLF + GS + C</text><text x=\"474\" y=\"216\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">all at supply</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Price opened below the level: a rally into it was needed, with novices buying after the rally.</text></svg>",
        "caption": "Sept 1, 2009 plan: the S&P supply formed where price based and gapped down. Price opened below it, so the plan was to wait for the rally into the zone and short, with the sector and two bank stocks at matching supply."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p218-042.jpg",
        "caption": "Page of Newton's 1687 Principia, \"Axiomata sive Leges Motus\", with the first and second laws of motion in Latin.",
        "notes": [
          "Mass (supply and demand) and motion (price between levels) frame the lesson."
        ]
      },
      {
        "src": "/lessons/seiden/p219-043.jpg",
        "caption": "SPY 30-min, 8/28 to 9/9/2009: XLT supply level lines about 103.0-103.45 over a circled base; a circled gap below it (\"Gap suggests supply level is strong\"). A (Sep 1) first revisit, then a fall to about 99.7; B (9/8) a novice gap into supply; C and D shallower touches; E (9/9) price pushes deep and breaks above to about 104.",
        "notes": [
          "First revisit (A) had the highest odds and the deepest decline.",
          "Each later touch absorbed supply; shallow dips at C and D said stop shorting.",
          "A deep push into the level (E) signalled that the mass was gone."
        ]
      },
      {
        "src": "/lessons/seiden/p221-044.jpg",
        "caption": "SPY 5-min, 9/8 to 9/9/2009: demand level lines at about 102.76-102.85 under a base from 14:00 on 9/8. Around 8:30 on 9/9 a big red candle drops to the upper line (circled \"Low Risk Long Entry\") and price rallies to about 103.95.",
        "notes": [
          "Once the larger supply was absorbed, switch sides and buy smaller-timeframe demand.",
          "Entry close to the stop, reward large because the supply above had been used up."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"60\" y=\"95\" width=\"500\" height=\"17\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Motion into mass: each revisit absorbs supply</text><line x1=\"30\" y1=\"130.0\" x2=\"30\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"26.5\" y=\"134.0\" width=\"7\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"42\" y1=\"114.0\" x2=\"42\" y2=\"138.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"38.5\" y=\"118.0\" width=\"7\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"54\" y1=\"98.0\" x2=\"54\" y2=\"122.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"50.5\" y=\"102.0\" width=\"7\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"66\" y1=\"95.5\" x2=\"66\" y2=\"108.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"62.5\" y=\"99.5\" width=\"7\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"78\" y1=\"95.5\" x2=\"78\" y2=\"108.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"74.5\" y=\"99.5\" width=\"7\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"90\" y1=\"146.0\" x2=\"90\" y2=\"164.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"86.5\" y=\"150.0\" width=\"7\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"102\" y1=\"139.3\" x2=\"102\" y2=\"164.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"98.5\" y=\"143.3\" width=\"7\" height=\"16.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"114\" y1=\"122.7\" x2=\"114\" y2=\"147.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"110.5\" y=\"126.7\" width=\"7\" height=\"16.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"126\" y1=\"106.0\" x2=\"126\" y2=\"130.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"122.5\" y=\"110.0\" width=\"7\" height=\"16.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"138\" y1=\"106.0\" x2=\"138\" y2=\"142.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"134.5\" y=\"110.0\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"150\" y1=\"134.3\" x2=\"150\" y2=\"170.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"146.5\" y=\"138.3\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"162\" y1=\"162.7\" x2=\"162\" y2=\"199.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"158.5\" y=\"166.7\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"174\" y1=\"191.0\" x2=\"174\" y2=\"227.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"170.5\" y=\"195.0\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"186\" y1=\"219.3\" x2=\"186\" y2=\"255.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"182.5\" y=\"223.3\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"198\" y1=\"247.7\" x2=\"198\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"194.5\" y=\"251.7\" width=\"7\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"210\" y1=\"248.5\" x2=\"210\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"206.5\" y=\"252.5\" width=\"7\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"222\" y1=\"221.0\" x2=\"222\" y2=\"256.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"218.5\" y=\"225.0\" width=\"7\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"234\" y1=\"193.5\" x2=\"234\" y2=\"229.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"230.5\" y=\"197.5\" width=\"7\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"246\" y1=\"166.0\" x2=\"246\" y2=\"201.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"242.5\" y=\"170.0\" width=\"7\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"258\" y1=\"100.0\" x2=\"258\" y2=\"114.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"254.5\" y=\"104.0\" width=\"7\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"106.0\" x2=\"270\" y2=\"132.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"266.5\" y=\"110.0\" width=\"7\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"282\" y1=\"124.3\" x2=\"282\" y2=\"150.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"278.5\" y=\"128.3\" width=\"7\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"294\" y1=\"142.7\" x2=\"294\" y2=\"169.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"290.5\" y=\"146.7\" width=\"7\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"306\" y1=\"141.3\" x2=\"306\" y2=\"169.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"302.5\" y=\"145.3\" width=\"7\" height=\"19.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"318\" y1=\"121.7\" x2=\"318\" y2=\"149.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"314.5\" y=\"125.7\" width=\"7\" height=\"19.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"330\" y1=\"102.0\" x2=\"330\" y2=\"129.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"326.5\" y=\"106.0\" width=\"7\" height=\"19.7\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"342\" y1=\"102.0\" x2=\"342\" y2=\"126.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"338.5\" y=\"106.0\" width=\"7\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"354\" y1=\"118.0\" x2=\"354\" y2=\"142.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"350.5\" y=\"122.0\" width=\"7\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"366\" y1=\"117.5\" x2=\"366\" y2=\"142.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"362.5\" y=\"121.5\" width=\"7\" height=\"16.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"378\" y1=\"101.0\" x2=\"378\" y2=\"125.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"374.5\" y=\"105.0\" width=\"7\" height=\"16.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"390\" y1=\"101.0\" x2=\"390\" y2=\"117.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"386.5\" y=\"105.0\" width=\"7\" height=\"8.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"402\" y1=\"109.5\" x2=\"402\" y2=\"126.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"398.5\" y=\"113.5\" width=\"7\" height=\"8.5\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"414\" y1=\"101.0\" x2=\"414\" y2=\"126.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"410.5\" y=\"105.0\" width=\"7\" height=\"17.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"426\" y1=\"84.0\" x2=\"426\" y2=\"109.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"422.5\" y=\"88.0\" width=\"7\" height=\"17.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"438\" y1=\"74.7\" x2=\"438\" y2=\"92.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"434.5\" y=\"78.7\" width=\"7\" height=\"9.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"450\" y1=\"65.3\" x2=\"450\" y2=\"82.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"446.5\" y=\"69.3\" width=\"7\" height=\"9.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"462\" y1=\"56.0\" x2=\"462\" y2=\"73.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"458.5\" y=\"60.0\" width=\"7\" height=\"9.3\" fill=\"#22c55e\" rx=\"1\"/><text x=\"556\" y=\"108\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">SUPPLY</text><text x=\"126\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">A</text><text x=\"258\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">B</text><text x=\"330\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">C</text><text x=\"378\" y=\"82\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">D</text><text x=\"426\" y=\"70\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">E</text><text x=\"140\" y=\"300\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">A: deep drop</text><text x=\"370\" y=\"200\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">C, D: shallow dips</text><text x=\"470\" y=\"140\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">E: deep push in</text><text x=\"470\" y=\"156\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">= mass removed</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">First revisit = best odds. Shallow reactions: stop shorting. Deep push in: switch sides.</text></svg>",
        "caption": "SPY 30-min: the gap-origin supply produced a big decline on the first revisit (A) and a smaller one on the novice gap (B). Reactions at C and D got shallow, and at E price pushed deep and broke through."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"69\" y=\"243\" width=\"451\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Switch sides: buy smaller-timeframe demand below</text><line x1=\"60\" y1=\"246.0\" x2=\"60\" y2=\"264.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"250.0\" width=\"10\" height=\"10.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"77\" y1=\"253.5\" x2=\"77\" y2=\"266.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"72.0\" y=\"257.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"94\" y1=\"253.5\" x2=\"94\" y2=\"266.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"89.0\" y=\"257.5\" width=\"10\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"111\" y1=\"253.5\" x2=\"111\" y2=\"266.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"106.0\" y=\"257.5\" width=\"10\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"128\" y1=\"236.0\" x2=\"128\" y2=\"264.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"123.0\" y=\"240.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"145\" y1=\"216.0\" x2=\"145\" y2=\"244.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"140.0\" y=\"220.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"162\" y1=\"196.0\" x2=\"162\" y2=\"224.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"157.0\" y=\"200.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"179\" y1=\"176.0\" x2=\"179\" y2=\"204.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"174.0\" y=\"180.0\" width=\"10\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"196\" y1=\"173.0\" x2=\"196\" y2=\"187.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"191.0\" y=\"177.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"213\" y1=\"173.0\" x2=\"213\" y2=\"187.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"208.0\" y=\"177.0\" width=\"10\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"230\" y1=\"173.0\" x2=\"230\" y2=\"187.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"225.0\" y=\"177.0\" width=\"10\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"247\" y1=\"181.0\" x2=\"247\" y2=\"249.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"242.0\" y=\"185.0\" width=\"10\" height=\"60.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"264\" y1=\"217.7\" x2=\"264\" y2=\"249.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.0\" y=\"221.7\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"281\" y1=\"194.3\" x2=\"281\" y2=\"225.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"276.0\" y=\"198.3\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"298\" y1=\"171.0\" x2=\"298\" y2=\"202.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"293.0\" y=\"175.0\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"315\" y1=\"147.7\" x2=\"315\" y2=\"179.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"310.0\" y=\"151.7\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"332\" y1=\"124.3\" x2=\"332\" y2=\"155.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"327.0\" y=\"128.3\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"349\" y1=\"101.0\" x2=\"349\" y2=\"132.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"344.0\" y=\"105.0\" width=\"10\" height=\"23.3\" fill=\"#22c55e\" rx=\"1\"/><text x=\"516\" y=\"254\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">DEMAND (5-min)</text><text x=\"526\" y=\"247\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"526\" y=\"262\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><line x1=\"237\" y1=\"264\" x2=\"520\" y2=\"264\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"526\" y=\"274\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">stop</text><line x1=\"237\" y1=\"100\" x2=\"520\" y2=\"100\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"526\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">target</text><line x1=\"287\" y1=\"292\" x2=\"251\" y2=\"254\" stroke=\"#f59e0b\" stroke-width=\"1.6\"/><polygon points=\"251.0,254.0 258.3,257.2 253.8,261.5\" fill=\"#f59e0b\"/><text x=\"291\" y=\"304\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">big red candle into demand: low risk long</text><text x=\"277\" y=\"76\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">supply above was absorbed</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Entry close to the stop, reward large because the overhead supply has been used up.</text></svg>",
        "caption": "SPY 5-min: once the 30-min supply was absorbed, the class looked for demand on a smaller timeframe. A big red candle crashed into it, giving a long with the stop close by and plenty of room above."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p225-046.jpg",
        "caption": "AAPL weekly, 2007 to mid-2009: D the circled late-2007 top, C a circled flat top in mid-2008 just below it, A two lines around a lower pivot high in late summer 2008 (about 175-181), the crash into early 2009 and the rally back to A at B on the right edge.",
        "notes": [
          "A looked like supply but held less than expected; the short there was stopped.",
          "The rules then point to the next supply, C, for the next short."
        ]
      },
      {
        "src": "/lessons/seiden/p226-047.jpg",
        "caption": "TradeStation P&L line: AAPL -960 as the short at A was stopped out.",
        "notes": [
          "A small, planned loss is part of the strategy, not a failure."
        ]
      },
      {
        "src": "/lessons/seiden/p226-048.jpg",
        "caption": "TradeStation P&L line later: AAPL +3,020 on the re-short at supply C.",
        "notes": [
          "The next valid trade more than paid for the loss."
        ]
      },
      {
        "src": "/lessons/seiden/p227-049.jpg",
        "caption": "Futures fill window, ES DEC09: sell 5 at 1063.75, buys of 2, 3, 5, 2, 2 and 1 between 1063.75 and 1065.00, sell 10 at 1068.00; bought 15, sold 15, net 0, P/L +1,562.50.",
        "notes": [
          "One loss and one win in a day still nets a profit when winners are larger than losers."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"154\" y=\"93\" width=\"316\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"63\" y=\"45\" width=\"407\" height=\"15\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Losing to win: stopped at A, paid at C</text><line x1=\"30\" y1=\"120.0\" x2=\"30\" y2=\"164.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"26.0\" y=\"124.0\" width=\"8\" height=\"36.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"43\" y1=\"84.0\" x2=\"43\" y2=\"128.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"39.0\" y=\"88.0\" width=\"8\" height=\"36.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"56\" y1=\"48.0\" x2=\"56\" y2=\"92.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"52.0\" y=\"52.0\" width=\"8\" height=\"36.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"69\" y1=\"45.5\" x2=\"69\" y2=\"58.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"65.0\" y=\"49.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"82\" y1=\"45.5\" x2=\"82\" y2=\"58.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"78.0\" y=\"49.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"95\" y1=\"48.0\" x2=\"95\" y2=\"92.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"91.0\" y=\"52.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"108\" y1=\"84.0\" x2=\"108\" y2=\"128.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"104.0\" y=\"88.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"121\" y1=\"120.0\" x2=\"121\" y2=\"164.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"117.0\" y=\"124.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"134\" y1=\"126.0\" x2=\"134\" y2=\"164.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"130.0\" y=\"130.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"147\" y1=\"96.0\" x2=\"147\" y2=\"134.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"143.0\" y=\"100.0\" width=\"8\" height=\"30.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"160\" y1=\"93.5\" x2=\"160\" y2=\"106.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"156.0\" y=\"97.5\" width=\"8\" height=\"5.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"173\" y1=\"93.5\" x2=\"173\" y2=\"106.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"169.0\" y=\"97.5\" width=\"8\" height=\"5.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"186\" y1=\"96.0\" x2=\"186\" y2=\"140.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"182.0\" y=\"100.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"199\" y1=\"132.0\" x2=\"199\" y2=\"176.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"195.0\" y=\"136.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"212\" y1=\"168.0\" x2=\"212\" y2=\"212.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"208.0\" y=\"172.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"225\" y1=\"204.0\" x2=\"225\" y2=\"248.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"221.0\" y=\"208.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"238\" y1=\"240.0\" x2=\"238\" y2=\"284.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"234.0\" y=\"244.0\" width=\"8\" height=\"36.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"251\" y1=\"246.7\" x2=\"251\" y2=\"284.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"247.0\" y=\"250.7\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"264\" y1=\"217.3\" x2=\"264\" y2=\"254.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"260.0\" y=\"221.3\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"277\" y1=\"188.0\" x2=\"277\" y2=\"225.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"273.0\" y=\"192.0\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"290\" y1=\"158.7\" x2=\"290\" y2=\"196.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"286.0\" y=\"162.7\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"303\" y1=\"129.3\" x2=\"303\" y2=\"166.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"299.0\" y=\"133.3\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"316\" y1=\"100.0\" x2=\"316\" y2=\"137.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"312.0\" y=\"104.0\" width=\"8\" height=\"29.3\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"329\" y1=\"80.0\" x2=\"329\" y2=\"108.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"325.0\" y=\"84.0\" width=\"8\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"342\" y1=\"65.0\" x2=\"342\" y2=\"88.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"338.0\" y=\"69.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"355\" y1=\"50.0\" x2=\"355\" y2=\"73.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"351.0\" y=\"54.0\" width=\"8\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"368\" y1=\"50.0\" x2=\"368\" y2=\"74.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"364.0\" y=\"54.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"381\" y1=\"66.0\" x2=\"381\" y2=\"109.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"377.0\" y=\"70.0\" width=\"8\" height=\"35.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"394\" y1=\"101.0\" x2=\"394\" y2=\"144.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"390.0\" y=\"105.0\" width=\"8\" height=\"35.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"407\" y1=\"136.0\" x2=\"407\" y2=\"179.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"403.0\" y=\"140.0\" width=\"8\" height=\"35.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"420\" y1=\"171.0\" x2=\"420\" y2=\"214.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"416.0\" y=\"175.0\" width=\"8\" height=\"35.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"466\" y=\"56\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">C</text><text x=\"466\" y=\"104\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">A</text><text x=\"316\" y=\"125\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">B: short</text><text x=\"296\" y=\"82\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">stopped: -$960</text><text x=\"363\" y=\"40\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">re-short at C</text><line x1=\"347\" y1=\"120\" x2=\"470\" y2=\"120\" stroke=\"#22c55e\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"474\" y=\"124\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">3:1: stop to breakeven</text><text x=\"385\" y=\"230\" fill=\"#22c55e\" font-size=\"13\" text-anchor=\"start\" font-weight=\"600\">+$3,020</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">A loses: price had less supply at A than thought. The rules move you to the next level, C.</text></svg>",
        "caption": "AAPL weekly: the short at A was stopped for a small loss when price rallied through, but the same rules sold the next supply C, moved the stop to breakeven at 3:1 and paid far more than the loss."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Casino math: 50% accuracy, 3:1 reward</text><rect x=\"70\" y=\"200\" width=\"30\" height=\"30\" fill=\"#ef4444\" rx=\"2\"/><text x=\"85\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">-1R</text><rect x=\"120\" y=\"110\" width=\"30\" height=\"90\" fill=\"#22c55e\" rx=\"2\"/><text x=\"135\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">+3R</text><rect x=\"170\" y=\"200\" width=\"30\" height=\"30\" fill=\"#ef4444\" rx=\"2\"/><text x=\"185\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">-1R</text><rect x=\"220\" y=\"110\" width=\"30\" height=\"90\" fill=\"#22c55e\" rx=\"2\"/><text x=\"235\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">+3R</text><rect x=\"270\" y=\"200\" width=\"30\" height=\"30\" fill=\"#ef4444\" rx=\"2\"/><text x=\"285\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">-1R</text><rect x=\"320\" y=\"110\" width=\"30\" height=\"90\" fill=\"#22c55e\" rx=\"2\"/><text x=\"335\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">+3R</text><rect x=\"370\" y=\"200\" width=\"30\" height=\"30\" fill=\"#ef4444\" rx=\"2\"/><text x=\"385\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">-1R</text><rect x=\"420\" y=\"110\" width=\"30\" height=\"90\" fill=\"#22c55e\" rx=\"2\"/><text x=\"435\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">+3R</text><rect x=\"470\" y=\"200\" width=\"30\" height=\"30\" fill=\"#ef4444\" rx=\"2\"/><text x=\"485\" y=\"244\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">-1R</text><rect x=\"520\" y=\"110\" width=\"30\" height=\"90\" fill=\"#22c55e\" rx=\"2\"/><text x=\"535\" y=\"104\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"middle\" font-weight=\"600\">+3R</text><line x1=\"50\" y1=\"200\" x2=\"590\" y2=\"200\" stroke=\"#94a3b8\" stroke-width=\"1\"/><text x=\"320\" y=\"290\" fill=\"#f59e0b\" font-size=\"13\" text-anchor=\"middle\" font-weight=\"600\">5 losses (-5R) + 5 wins (+15R) = +10R</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">A loss you can accept calmly is a business cost. If it makes you cringe, size down.</text></svg>",
        "caption": "Why losses belong in the winning column: ten trades at 50% accuracy with every loss at 1R and every win at 3R still net +10R, like a casino with an edge."
      }
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
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"160\" y=\"220\" width=\"310\" height=\"52\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Planned scaling in: more size nearer the stop</text><line x1=\"180\" y1=\"131.0\" x2=\"180\" y2=\"154.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"135.0\" width=\"9\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"195\" y1=\"116.0\" x2=\"195\" y2=\"139.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"190.5\" y=\"120.0\" width=\"9\" height=\"15.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"210\" y1=\"116.0\" x2=\"210\" y2=\"142.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"205.5\" y=\"120.0\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"225\" y1=\"134.3\" x2=\"225\" y2=\"160.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"220.5\" y=\"138.3\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"240\" y1=\"152.7\" x2=\"240\" y2=\"179.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"235.5\" y=\"156.7\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"255\" y1=\"171.0\" x2=\"255\" y2=\"197.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"250.5\" y=\"175.0\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"270\" y1=\"189.3\" x2=\"270\" y2=\"215.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"265.5\" y=\"193.3\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"285\" y1=\"207.7\" x2=\"285\" y2=\"234.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"280.5\" y=\"211.7\" width=\"9\" height=\"18.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"300\" y1=\"206.0\" x2=\"300\" y2=\"234.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"295.5\" y=\"210.0\" width=\"9\" height=\"20.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"315\" y1=\"206.0\" x2=\"315\" y2=\"233.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"310.5\" y=\"210.0\" width=\"9\" height=\"19.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"330\" y1=\"225.3\" x2=\"330\" y2=\"252.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"325.5\" y=\"229.3\" width=\"9\" height=\"19.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"345\" y1=\"244.7\" x2=\"345\" y2=\"272.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"340.5\" y=\"248.7\" width=\"9\" height=\"19.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"360\" y1=\"246.0\" x2=\"360\" y2=\"272.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"355.5\" y=\"250.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"375\" y1=\"228.0\" x2=\"375\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"370.5\" y=\"232.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"390\" y1=\"210.0\" x2=\"390\" y2=\"236.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"385.5\" y=\"214.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"405\" y1=\"192.0\" x2=\"405\" y2=\"218.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"400.5\" y=\"196.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"420\" y1=\"174.0\" x2=\"420\" y2=\"200.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"415.5\" y=\"178.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"435\" y1=\"156.0\" x2=\"435\" y2=\"182.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"430.5\" y=\"160.0\" width=\"9\" height=\"18.0\" fill=\"#22c55e\" rx=\"1\"/><text x=\"476\" y=\"224\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">proximal</text><text x=\"476\" y=\"276\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">distal</text><line x1=\"150\" y1=\"222\" x2=\"470\" y2=\"222\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"140\" y=\"226\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">entry 1: 1 unit</text><line x1=\"150\" y1=\"240\" x2=\"470\" y2=\"240\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"140\" y=\"244\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">entry 2: 2 units</text><line x1=\"150\" y1=\"258\" x2=\"470\" y2=\"258\" stroke=\"#f59e0b\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"140\" y=\"262\" fill=\"#f59e0b\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">entry 3: 3 units</text><line x1=\"150\" y1=\"284\" x2=\"470\" y2=\"284\" stroke=\"#ef4444\" stroke-width=\"1.5\" stroke-dasharray=\"5 4\"/><text x=\"140\" y=\"288\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">one stop</text><text x=\"476\" y=\"160\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">all entries, the stop and</text><text x=\"476\" y=\"176\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">total size set before</text><text x=\"476\" y=\"192\" fill=\"#94a3b8\" font-size=\"11\" text-anchor=\"start\" font-weight=\"400\">the first fill</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Unplanned additions are just adding to a loser.</text></svg>",
        "caption": "Scaling in versus adding to a loser: entries, one stop and total size are fixed in advance, with larger size placed nearer the stop, so the total risk is known before the first fill."
      },
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"350\" y=\"92\" width=\"260\" height=\"16\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><rect x=\"40\" y=\"243\" width=\"260\" height=\"15\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">VIX as an odds enhancer: mirror image of stocks</text><rect x=\"20\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><rect x=\"330\" y=\"40\" width=\"290\" height=\"270\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"30\" y=\"60\" fill=\"#22c55e\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">S&amp;P falls into demand</text><line x1=\"50\" y1=\"96.0\" x2=\"50\" y2=\"122.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"46.0\" y=\"100.0\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"63\" y1=\"114.8\" x2=\"63\" y2=\"141.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"59.0\" y=\"118.8\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"76\" y1=\"133.5\" x2=\"76\" y2=\"160.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"72.0\" y=\"137.5\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"89\" y1=\"152.2\" x2=\"89\" y2=\"179.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"85.0\" y=\"156.2\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"102\" y1=\"171.0\" x2=\"102\" y2=\"197.8\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"98.0\" y=\"175.0\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"115\" y1=\"189.8\" x2=\"115\" y2=\"216.5\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"111.0\" y=\"193.8\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"128\" y1=\"208.5\" x2=\"128\" y2=\"235.2\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"124.0\" y=\"212.5\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"141\" y1=\"227.2\" x2=\"141\" y2=\"254.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"137.0\" y=\"231.2\" width=\"8\" height=\"18.8\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"154\" y1=\"243.0\" x2=\"154\" y2=\"257.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"150.0\" y=\"247.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"167\" y1=\"243.0\" x2=\"167\" y2=\"257.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"163.0\" y=\"247.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"180\" y1=\"230.0\" x2=\"180\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"176.0\" y=\"234.0\" width=\"8\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"193\" y1=\"214.0\" x2=\"193\" y2=\"238.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"189.0\" y=\"218.0\" width=\"8\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"206\" y1=\"198.0\" x2=\"206\" y2=\"222.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"202.0\" y=\"202.0\" width=\"8\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"219\" y1=\"182.0\" x2=\"219\" y2=\"206.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"215.0\" y=\"186.0\" width=\"8\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"232\" y1=\"166.0\" x2=\"232\" y2=\"190.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"228.0\" y=\"170.0\" width=\"8\" height=\"16.0\" fill=\"#22c55e\" rx=\"1\"/><text x=\"340\" y=\"60\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"start\" font-weight=\"600\">VIX rises into supply</text><line x1=\"360\" y1=\"227.2\" x2=\"360\" y2=\"254.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"356.0\" y=\"231.2\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"373\" y1=\"208.5\" x2=\"373\" y2=\"235.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"369.0\" y=\"212.5\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"386\" y1=\"189.8\" x2=\"386\" y2=\"216.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"382.0\" y=\"193.8\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"399\" y1=\"171.0\" x2=\"399\" y2=\"197.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"395.0\" y=\"175.0\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"412\" y1=\"152.2\" x2=\"412\" y2=\"179.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"408.0\" y=\"156.2\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"425\" y1=\"133.5\" x2=\"425\" y2=\"160.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"421.0\" y=\"137.5\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"438\" y1=\"114.8\" x2=\"438\" y2=\"141.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"434.0\" y=\"118.8\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"451\" y1=\"96.0\" x2=\"451\" y2=\"122.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"447.0\" y=\"100.0\" width=\"8\" height=\"18.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"464\" y1=\"93.0\" x2=\"464\" y2=\"107.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"460.0\" y=\"97.0\" width=\"8\" height=\"6.0\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"477\" y1=\"93.0\" x2=\"477\" y2=\"107.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"473.0\" y=\"97.0\" width=\"8\" height=\"6.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"490\" y1=\"96.0\" x2=\"490\" y2=\"120.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"486.0\" y=\"100.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"503\" y1=\"112.0\" x2=\"503\" y2=\"136.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"499.0\" y=\"116.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"516\" y1=\"128.0\" x2=\"516\" y2=\"152.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"512.0\" y=\"132.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"529\" y1=\"144.0\" x2=\"529\" y2=\"168.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"525.0\" y=\"148.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"542\" y1=\"160.0\" x2=\"542\" y2=\"184.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"538.0\" y=\"164.0\" width=\"8\" height=\"16.0\" fill=\"#ef4444\" rx=\"1\"/><text x=\"320\" y=\"328\" fill=\"#f59e0b\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">both at their levels together = strong odds stocks turn up</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Public buys insurance after the accident. Reverse it for shorts: VIX at demand, stocks at supply.</text></svg>",
        "caption": "The VIX check: when stocks are low at demand and the VIX is high at supply, the odds of a rally in stocks are strong; the reverse warns of a decline."
      }
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
    "images": [
      {
        "src": "/lessons/seiden/p234-052.jpg",
        "caption": "Slide \"Foolsville Sell Setup\": a decline, a green bounce, a red reversal candle, then several red candles; the last one is circled as the \"High Odds Shorting opportunity\". Panel: downtrend, 3+ red candles, above-average volume, bad news, bad earnings, reversal candle and S&P declining, 10 points each = 70.",
        "notes": [
          "The crowd checklist fires after the move is done, near the low.",
          "If you sell low, who will sell to you even lower?"
        ]
      },
      {
        "src": "/lessons/seiden/p237-053.jpg",
        "caption": "Live XLT Stock Mastery screen, Sept 2009: participants, chat and several chart panes; one QQQQ pane shows two horizontal demand lines under a base.",
        "notes": [
          "The demand level was drawn before the open, ahead of the news selling."
        ]
      },
      {
        "src": "/lessons/seiden/p238-054.jpg",
        "caption": "QQQQ 5-min, 9/10 to 9/11/2009: XLT demand lines at about 41.20 and 41.25 under a 10:00-12:00 base on 9/10, from which price rallied to about 41.6. On 9/11 price drops back to touch the upper line around 11:45 (Foolsville sell signal = XLT buy signal) and rallies to about 41.55.",
        "notes": [
          "The same candle was a sell to the crowd and a buy at pre-planned demand.",
          "Entry at the upper line, stop below the lower line, target the prior highs."
        ]
      }
    ],
    "figures": [
      {
        "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><rect x=\"40\" y=\"248\" width=\"560\" height=\"16\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"20\" y=\"24\" fill=\"#f59e0b\" font-size=\"14\" text-anchor=\"start\" font-weight=\"600\">Foolsville 70-point sell signal = XLT buy signal</text><line x1=\"50\" y1=\"86.0\" x2=\"50\" y2=\"122.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"45.0\" y=\"90.0\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"67\" y1=\"114.3\" x2=\"67\" y2=\"150.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"62.0\" y=\"118.3\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"84\" y1=\"142.7\" x2=\"84\" y2=\"179.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"79.0\" y=\"146.7\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"101\" y1=\"171.0\" x2=\"101\" y2=\"207.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"96.0\" y=\"175.0\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"118\" y1=\"199.3\" x2=\"118\" y2=\"235.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"113.0\" y=\"203.3\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"135\" y1=\"227.7\" x2=\"135\" y2=\"264.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"130.0\" y=\"231.7\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"152\" y1=\"228.5\" x2=\"152\" y2=\"264.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"147.0\" y=\"232.5\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"169\" y1=\"201.0\" x2=\"169\" y2=\"236.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"164.0\" y=\"205.0\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"186\" y1=\"173.5\" x2=\"186\" y2=\"209.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"181.0\" y=\"177.5\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"203\" y1=\"146.0\" x2=\"203\" y2=\"181.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"198.0\" y=\"150.0\" width=\"10\" height=\"27.5\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"220\" y1=\"140.0\" x2=\"220\" y2=\"174.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"215.0\" y=\"150.0\" width=\"10\" height=\"20.0\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"237\" y1=\"166.0\" x2=\"237\" y2=\"202.3\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"232.0\" y=\"170.0\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"254\" y1=\"194.3\" x2=\"254\" y2=\"230.7\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"249.0\" y=\"198.3\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"271\" y1=\"222.7\" x2=\"271\" y2=\"259.0\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"266.0\" y=\"226.7\" width=\"10\" height=\"28.3\" fill=\"#ef4444\" rx=\"1\"/><line x1=\"288\" y1=\"230.2\" x2=\"288\" y2=\"259.0\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"283.0\" y=\"234.2\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"305\" y1=\"209.3\" x2=\"305\" y2=\"238.2\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"300.0\" y=\"213.3\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"322\" y1=\"188.5\" x2=\"322\" y2=\"217.3\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"317.0\" y=\"192.5\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"339\" y1=\"167.7\" x2=\"339\" y2=\"196.5\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"334.0\" y=\"171.7\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"356\" y1=\"146.8\" x2=\"356\" y2=\"175.7\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"351.0\" y=\"150.8\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><line x1=\"373\" y1=\"126.0\" x2=\"373\" y2=\"154.8\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"368.0\" y=\"130.0\" width=\"10\" height=\"20.8\" fill=\"#22c55e\" rx=\"1\"/><text x=\"596\" y=\"260\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">XLT DEMAND (planned pre-market)</text><ellipse cx=\"271\" cy=\"258\" rx=\"16\" ry=\"16\" fill=\"none\" stroke=\"#f59e0b\" stroke-width=\"1.5\"/><text x=\"220\" y=\"128\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\" font-weight=\"400\">reversal candle</text><rect x=\"450\" y=\"40\" width=\"180\" height=\"140\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\" rx=\"6\"/><text x=\"460\" y=\"60\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">downtrend 10</text><text x=\"460\" y=\"76\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">3+ red candles 10</text><text x=\"460\" y=\"92\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">high volume 10</text><text x=\"460\" y=\"108\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">bad news 10</text><text x=\"460\" y=\"124\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">bad earnings 10</text><text x=\"460\" y=\"140\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">reversal candle 10</text><text x=\"460\" y=\"156\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"start\" font-weight=\"400\">S&amp;P falling 10</text><text x=\"540\" y=\"200\" fill=\"#ef4444\" font-size=\"12\" text-anchor=\"middle\" font-weight=\"600\">70 points: SELL!</text><line x1=\"211\" y1=\"300\" x2=\"257\" y2=\"266\" stroke=\"#ef4444\" stroke-width=\"1.6\"/><polygon points=\"257.0,266.0 252.9,272.9 249.2,267.9\" fill=\"#ef4444\"/><text x=\"207\" y=\"312\" fill=\"#ef4444\" font-size=\"11\" text-anchor=\"end\" font-weight=\"600\">Fool sells after a decline into demand</text><line x1=\"331\" y1=\"300\" x2=\"285\" y2=\"266\" stroke=\"#22c55e\" stroke-width=\"1.6\"/><polygon points=\"285.0,266.0 292.8,267.9 289.1,272.9\" fill=\"#22c55e\"/><text x=\"335\" y=\"312\" fill=\"#22c55e\" font-size=\"11\" text-anchor=\"start\" font-weight=\"600\">XLT buys from him</text><text x=\"20\" y=\"345\" fill=\"#94a3b8\" font-size=\"12\" text-anchor=\"start\" font-weight=\"400\">Ask who buys from you after you enter. Do you trade like a Fool, or with one?</text></svg>",
        "caption": "The Foolsville checklist scores 70 out of 70 exactly when price reaches pre-planned demand, so the crowd sells at the low and the XLT buys from them, as on QQQQ on Sept 11, 2009."
      }
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
