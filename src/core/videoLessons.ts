// The mentor's 23 video lessons as study notes, written from the lesson transcripts.
// Notes restate the lessons only — no added rules. Generated; edit the notes, not the shape.
import type { DiagramKey } from '@/ui/LessonDiagrams';

export interface VideoLesson {
  n: number; title: string; kind: 'video' | 'webinar' | 'podcast' | 'zoom'; summary: string;
  sections: { heading: string; points: string[] }[];
  rules: string[]; mistakes: string[]; quotes: string[];
  diagrams: { key: DiagramKey | string; caption: string }[];
  checklist: string[]; journalTags: string[]; newVsPdfs: string[];
}

export const VIDEO_LESSONS: VideoLesson[] = [
 {
  "n": 1,
  "title": "Intro to Supply & Demand",
  "kind": "video",
  "summary": "Explains what supply and demand is, where the zone-trading method comes from, and how banks leave footprints as a pause in the market followed by a big, fast move away. The strategy in a nutshell: find the large move away, go to its origin (the basing), draw the zone, and buy/sell the pullback, using the two zone families (reversal and continuation).",
  "sections": [
   {
    "heading": "What supply & demand is",
    "points": [
     "Nobody created supply and demand; every market (clothes, food, stocks, currencies, commodities) moves as a function of it.",
     "More demand -> price goes up. More supply -> price goes down. It is a natural law.",
     "What does have a founder is the method of identifying it on a price chart: he credits the trader the captions call 'Sam Sein' (likely Sam Seiden), who worked on a trading floor facilitating orders and learned to spot on the chart where big order stacks sat.",
     "He recommends watching that founder's videos as starter material; this course goes into much more depth."
    ]
   },
   {
    "heading": "How a demand zone forms (the trading-floor logic)",
    "points": [
     "Example: a big stack of buy orders sits at, say, $62. Price pushes down into it and shoots up because of all those orders.",
     "On the chart this shows as price pushing down, then 'boom' a push up: price could not stay at that level long before shooting out.",
     "Idea: there are leftover buy orders from large banks/institutions at that level, or, having bought there once, they may want to buy there again. That is the reason to trade the return.",
     "Only banks or large institutions can move a market up or down like that, so the big move is their footprint, and we want to trade with them."
    ]
   },
   {
    "heading": "What to look for on the chart",
    "points": [
     "For demand: a pause in the market (basing) followed by a strong, fast move out, e.g. a large green candle.",
     "Small moves away (little candles drifting off) contain no demand you would trade. Technically S&D is everywhere, but we only mark the big moves away.",
     "Process: identify the large move away -> go to the origin of the move (the basing) -> draw the zone capturing the basing candles -> wait for and take the pullback.",
     "Example shown: a large red candle, basing, then a large green candle -> draw the demand around the basing.",
     "Supply is the exact opposite: basing then a strong move down."
    ]
   },
   {
    "heading": "Balance vs imbalance",
    "points": [
     "Sideways price action = a balance of buyers and sellers. That is NOT what we want.",
     "We want an imbalance: price pushed into a level, could not stay there, and shot out.",
     "A small push up out of a sideways range is at best 'borderline' demand; he treats the range as balance, no demand.",
     "S&D is an imbalance - way too much demand and lack of supply (demand zone) or way too much supply and lack of demand (supply zone)."
    ]
   },
   {
    "heading": "The two types of zones",
    "points": [
     "Demand: Drop-Base-Rally (DBR) and Rally-Base-Rally (RBR). Supply is opposite: Rally-Base-Drop (RBD) and Drop-Base-Drop (DBD).",
     "DBR/RBD = reversal type; RBR/DBD = continuation pattern.",
     "His opinion: continuation zones (RBR/DBD) are better in trending markets - that is how you trade with the trend.",
     "Any DBR demand is pretty much going to be counter-trend.",
     "There are a few more zone types that he will cover later in the course."
    ]
   },
   {
    "heading": "Losers and reality check",
    "points": [
     "He deliberately showed a failed supply zone (basing of two red candles + big move away) and zones that never filled.",
     "Not every trade works; we are stacking the odds by trading with the large players.",
     "The strategy is not just 'spot demand, buy the pullback' - you also need the trend, the structure of the zone and more (later lessons: multiple timeframe analysis etc.).",
     "Goal of the course: combine everything (incl. multiple timeframe analysis) to build your own strategy.",
     "Ask him questions anytime if something is unclear."
    ]
   },
   {
    "heading": "More from the lesson: Why a chart method was needed",
    "points": [
     "Anybody can say 'price goes up when demand exceeds supply'; the question is how you identify that on a price chart. That is what the founder of the method worked out.",
     "His understanding of how it was found: on the floor he saw where the orders filled, then looked at the chart and saw the huge move out of that price.",
     "First example on the chart: price pushed down, then 'boom' pushed up; he boxed the base, price later pushed back down into the box (the entry) and pushed up out of the zone again."
    ]
   },
   {
    "heading": "More from the lesson: Where he does NOT draw zones",
    "points": [
     "On the example chart he points to several spots and says 'no demand here' because there was no large move away. He only marks the large moves away.",
     "The two-type list (DBR/RBR, RBD/DBD) is also covered in his free videos."
    ]
   }
  ],
  "rules": [
   "Only mark zones with a large/fast move away; small drifting moves are not tradeable demand/supply.",
   "Always wait for the pullback to the zone - never chase the move away.",
   "Sideways price = balance = no zone; we only trade imbalances."
  ],
  "mistakes": [
   "Marking every little move as demand/supply because 'S&D is everywhere'.",
   "Treating a sideways range with a small push out as a demand zone.",
   "Thinking the strategy is only 'find a zone and buy the pullback' without trend, structure and timeframe context.",
   "Expecting every zone to work or to fill."
  ],
  "quotes": [
   "We are looking for a pause in the market and a strong fast move out.",
   "Sideways price action basically means that there's a balance of buyers and sellers - that's not what we are looking for.",
   "That's how they leave their footprints on a price chart.",
   "We always wait for the pullback.",
   "There was so much demand here and such a lack of supply that price pushed out.",
   "Price could not stay at this level long enough and we just shot up out of that area.",
   "We are stacking the odds in our favor by trading with these large players."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Basing candles followed by one large green candle; box drawn around the basing = demand, with price later pulling back into it."
   },
   {
    "key": "qualify",
    "caption": "Sideways range (balance, no zone) next to a pause + explosive move out (imbalance, zone)."
   }
  ],
  "checklist": [
   "Is there a clear pause (basing) followed by a large, fast move away?",
   "Is this an imbalance rather than sideways balance?",
   "Am I waiting for the pullback instead of chasing?",
   "Do I know whether this is a DBR/RBD (likely counter-trend) or RBR/DBD (with-trend) zone?",
   "Have I checked trend and higher-timeframe context, not just the zone?"
  ],
  "journalTags": [
   "weak move away",
   "zone in sideways range",
   "chased the move",
   "counter-trend DBR/RBD",
   "no trend context"
  ],
  "newVsPdfs": [
   "Credits the founder of the chart method (captions: 'Sam Sein', likely Sam Seiden) and his trading-floor order-stack origin story.",
   "Explicitly frames sideways action as 'balance' vs zones as 'imbalance' with the borderline-demand example.",
   "His opinion that continuation zones (RBR/DBD) suit trending markets and that DBR demand is pretty much always counter-trend.",
   "Second reason for the return: banks that bought there once may want to buy there again (PDFs only mention leftover unfilled orders)."
  ]
 },
 {
  "n": 2,
  "title": "Qualifying Zones",
  "kind": "video",
  "summary": "Covers how to qualify a zone: the highest-quality zones remove an opposing zone or a trendline, but because his edge comes from multiple timeframe and multiple sequence analysis, a clean base with a decent move away inside a higher-timeframe zone is acceptable even if it removed nothing. Also separates drawable-but-not-tradable zones from tradable ones and shows what is NOT supply and demand (support/resistance boxes).",
  "sections": [
   {
    "heading": "S&D exists on every timeframe",
    "points": [
     "There is supply and demand everywhere on a chart, so finding one does not mean it qualifies.",
     "No zone on the daily at a spot does not mean there is none on the 1m or 5m chart there."
    ]
   },
   {
    "heading": "Highest-quality qualification: remove an opposing zone or trendline",
    "points": [
     "For the highest-quality zone, it must remove another (opposing) zone or a trendline.",
     "Example: price pushes up into a supply zone (may react a bit, doesn't matter), then breaks it - supply is now removed. Something must have removed it: the demand zone at the origin of that move. That demand qualifies and is the potential trade.",
     "On his chart link you see this: a supply zone that removed several little mini demand zones, and a demand that took out a supply.",
     "Removed zones are shown in tan on his chart link."
    ]
   },
   {
    "heading": "Where the real edge comes from",
    "points": [
     "His personal edge comes from multiple timeframe analysis and multiple sequence analysis (top-down), covered later - don't skip ahead.",
     "So as long as the zone looks good (clean basing, decent move away), it can be traded even if it removed nothing - provided the higher timeframes make sense.",
     "Example: a 1-hour demand zone that did not remove the supply above it is still a candidate if it sits inside a daily demand zone.",
     "Summary: highest quality = removes opposing zones; but if trading with MTF + MSA, what the zone removed 'doesn't matter quite as much' as long as it looks good."
    ]
   },
   {
    "heading": "Decent vs mediocre zones",
    "points": [
     "Decent zones: decent basing + large move away.",
     "Mediocre/lower quality: only about one candle staying away and a move away that isn't large - the trade may still work, but it's mediocre.",
     "The bigger and cleaner the move away the better.",
     "Time away matters: a zone price stayed away from for a long time before rallying back is better than one price couldn't stay away from."
    ]
   },
   {
    "heading": "Drawable vs tradable zones",
    "points": [
     "Drawable zone: he draws it to track the chart (what removed what) so he can find the highest-quality zones when the time comes - not to trade.",
     "Not tradable examples: a very large zone with a very large wick that only removed things later; a supply zone that did remove demand but whose move away was a ~50% candle (weak move away).",
     "Tradable zone: very clean basing + very nice, strong move away (shown on both supply and demand, incl. a daily demand that still failed - that's okay).",
     "Low-quality, drawable-only signs: very poor move away, not much time spent away from the zone.",
     "Using MTF/MSA makes the drawable-vs-tradable distinction 'a little less important'."
    ]
   },
   {
    "heading": "What is NOT supply and demand",
    "points": [
     "Example: a DailyFX article ('whoever wrote this should be fired') with boxes started randomly far back and drawn straight across - that is support/resistance, not S&D.",
     "Those boxes 'work' as S/R (break, retest, support turns resistance), and that's fine, but there is no structure.",
     "Real zones are tightly based: lines wrapped around the basing candles, zones roughly the same size, drawn consistently - because that is how you shape the trade (entry/stop).",
     "Once a zone is broken it is violated/removed; you don't start a box from some random earlier price.",
     "He redraws the article's chart: the actual demand is where price rallied, based, then shot up - wrap lines around that base (he admits it isn't the best demand).",
     "No indicators - S&D is traded on pure price action.",
     "Lots of 'junk' on social media/Google isn't the original methodology he follows."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Open a chart and use the arrow tool to POINT to where you think demand and supply are (point at the basing) - don't draw zones yet.",
     "Post a screenshot in the Discord homework tab; he will check it."
    ]
   },
   {
    "heading": "More from the lesson: Worked hypothetical: zone that removed nothing",
    "points": [
     "His sketch: big red candle down, two basing candles, a large push up and a move away, with supply sitting above that was NOT removed. Even so, the demand left below can be a potential buy if it is a decent move away and the higher timeframes make sense.",
     "He then frames it as a 1-hour chart: that 1H demand should be located inside a daily demand zone. That is where the edge comes from."
    ]
   },
   {
    "heading": "More from the lesson: More 'not S&D' examples from the article",
    "points": [
     "Second article chart: a randomly drawn zone that price had already broken through. He shows where the real supply was instead: basing, then the move down. He marks another supply on the same chart the same way (basing, move down).",
     "On the first article chart he notes the boxes' zones had already been removed (at least further back), which is another sign they are S/R, not S&D.",
     "Boxes that are just 'areas price rallies in and out of' with no structure are not supply and demand."
    ]
   },
   {
    "heading": "More from the lesson: Use his chart link",
    "points": [
     "He provides his charts so you can compare his tight, consistent zones against S/R-style boxes and learn the difference."
    ]
   }
  ],
  "rules": [
   "Highest-quality zones remove an opposing zone or a trendline.",
   "A tradable zone needs clean basing and a strong move away.",
   "Wrap the zone tightly around the basing candles; no randomly started S/R boxes.",
   "A broken zone is violated and no longer valid.",
   "Pure price action - no indicators."
  ],
  "mistakes": [
   "Assuming any S&D you can find qualifies as a tradable zone.",
   "Assuming no zone on the daily means no zone on lower timeframes.",
   "Trading drawable-only zones (huge wick, ~50% candle move away, little time away).",
   "Drawing support/resistance boxes from random prices and calling them supply and demand.",
   "Using indicators on S&D charts.",
   "Getting too hung up on what the zone removed when the higher-timeframe context is right.",
   "Starting a zone from a random earlier price instead of at the basing that caused the move away."
  ],
  "quotes": [
   "Just because you can find it, it doesn't mean that it's qualified as supply or demand.",
   "Our edge comes from that top-down analysis.",
   "Clean basing, good move away - that's a drawable and tradable zone.",
   "This is not supply and demand, this is basically a support and resistance zone.",
   "Supply and demand is very tightly based.",
   "There's just no structure to anything they're doing here."
  ],
  "diagrams": [
   {
    "key": "qualify",
    "caption": "Supply zone broken by a rally; the demand at the origin of that rally is the qualified zone (removed supply shaded tan)."
   },
   {
    "key": "quality",
    "caption": "Tradable zone (clean basing, strong move, long time away) vs drawable-only zone (huge wick, ~50% candle move away, quick return)."
   },
   {
    "key": "mtf",
    "caption": "A 1H demand zone that removed nothing but sits inside a daily demand zone - still a candidate."
   }
  ],
  "checklist": [
   "Did this zone remove an opposing zone or a trendline (highest quality)?",
   "If not, is it inside a matching higher-timeframe zone?",
   "Is the basing clean?",
   "Is the move away strong (not a ~50% candle) and did price stay away for a while?",
   "Is the zone drawn tightly around the basing, not as a broad S/R box?",
   "Is the zone still unbroken (not violated)?"
  ],
  "journalTags": [
   "removed nothing, no HTF zone",
   "drawable not tradable",
   "50% candle move away",
   "no time away from zone",
   "S/R box not a zone",
   "zone violated"
  ],
  "newVsPdfs": [
   "Concept of 'drawable vs tradable' zones and drawing zones just to track what removed what.",
   "His view that with MTF/MSA, a zone need not remove anything as long as it looks good and sits in a HTF zone (PDF slide says neither removal = NO TRADE).",
   "Time spent away from the zone as a quality sign.",
   "A ~50% candle move away cited as not tradable; very large wick zones as not tradable.",
   "No zone on the daily doesn't mean none on the 1m/5m.",
   "Mentions 'multiple sequence analysis' as part of his edge (a later lesson).",
   "No indicators - pure price action; a DailyFX-style S/R box example of what is not S&D.",
   "Homework: point to demand/supply with the arrow tool and post in Discord."
  ]
 },
 {
  "n": 3,
  "title": "Drawing Zones",
  "kind": "video",
  "summary": "Shows how to draw PV (drop-base-rally / rally-base-drop) and CP (rally-base-rally / drop-base-drop) zones: the distal line is objective and always includes the wick, while the proximal line is partly subjective and trades fill rate against R:R. Zones should look visually similar in size on a timeframe, and an overly large zone can be cut in half.",
  "sections": [
   {
    "heading": "Objective vs subjective",
    "points": [
     "Drawing has some subjectivity; some parts are completely objective.",
     "Aim for zones that look visually similar in size - not measured to an exact pip count (e.g. not forcing 68 or 78 pips)."
    ]
   },
   {
    "heading": "Two zone types: PV and CP",
    "points": [
     "Demand: drop-base-rally and rally-base-rally. Supply is the complete opposite: rally-base-drop and drop-base-drop.",
     "He calls DBR/RBD 'PV' zones (peaks and valleys).",
     "He calls RBR/DBD 'CP' zones (continuation pattern - a continuation move).",
     "Each zone = basing candles + the move away; the move away is how we identify that there is demand; then wrap the lines around the basing candles.",
     "Other zone situations exist; odd ones get broken down in the Sunday meetings."
    ]
   },
   {
    "heading": "Distal and proximal lines",
    "points": [
     "Distal = the line furthest away. Demand: distal at the bottom; supply: distal at the top.",
     "Proximal = the near line. Demand: proximal on top; supply: proximal at the bottom.",
     "Knowing the names isn't super important, it's part of the theory."
    ]
   },
   {
    "heading": "Drawing the distal line (objective)",
    "points": [
     "The distal line is usually always completely objective: at the extreme wick of the basing (lowest low for demand, highest high for supply).",
     "Always include the wick - leaving the wick outside the zone is incorrect (a common mistake he sees).",
     "Exceptions where wicks are excluded exist, but they're for another lesson; in general always include the wick.",
     "Use the TradingView magnet tool (hold Ctrl) to snap exactly to the candle high/low instead of eyeballing it - manual placement misses the exact pip."
    ]
   },
   {
    "heading": "Drawing the proximal line (subjective) and the R:R trade-off",
    "points": [
     "Usually put the proximal on the top of the body of a basing candle (demand); or use the wick if the body version makes the zone tiny.",
     "Use parts of the basing candles to pick where the lines go.",
     "Example with a 3:1 trader: the smaller the zone, the less price has to travel to hit 3:1; a bigger zone needs a bigger move. A very tiny zone turned the same move into 13:1.",
     "Small zone: better R:R but you'll take a decent amount of losses, get filled less and miss more trades.",
     "Large zone: more trades and more fills, but smaller R:R.",
     "As long as the distal is right (the most important thing), experiment with the proximal and build your own strategy. He prefers a middle, decent-size zone - not too small, not too big."
    ]
   },
   {
    "heading": "Keep zone sizes consistent",
    "points": [
     "Try to copy the size of a properly drawn zone onto others on the same timeframe so zones are the same size.",
     "Example measurements: 33 pips and 43 pips are fine/similar; a 79-pip zone is much larger - 'you don't really want that'.",
     "To match size on a CP zone he ignores a wick at the top (proximal side), giving ~31-39 pips - 'somewhat similar' is fine; a slightly bigger zone 'who cares'.",
     "If a zone is a little too big, tighten it up a bit."
    ]
   },
   {
    "heading": "Large zones: cut in half",
    "points": [
     "Real trade example: a DBR with a very large range (red basing candle + several green). Don't ignore the large candles - distal at the far low, proximal at top of the basing body.",
     "If the zone is too large, you can simply cut it in half. 'I know this looks weird' but he has done it a long time and it works for him. Optional.",
     "Effect: the same move goes from roughly 3:1 to roughly 4:1-5:1.",
     "Supply examples: proximal on the green basing candle; distal at the objective high; choose the version that keeps size similar."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Draw 2 supply zones (one RBD, one DBD) and 2 demand zones (one continuation/RBR, one DBR), all drawn similar in size.",
     "Post in the homework chat labelled lesson 3 homework. Getting it wrong is fine - that's the point."
    ]
   },
   {
    "heading": "More from the lesson: Worked 3:1 example (proximal choice)",
    "points": [
     "With the proximal drawn low (small zone), a 3:1 trader only needed price to reach 2.205. Drawing the proximal higher made price travel further for 3:1; drawing it even bigger, price only just hit 3:1. Whether you hit it depends on how far your stop is."
    ]
   },
   {
    "heading": "More from the lesson: Other notes",
    "points": [
     "His example chart had three demand zones: two CP (rally-base-rally) and one PV (drop-base-rally).",
     "He says there are really only two types of zones; there are 'different situations', but he doesn't want to confuse anyone.",
     "He won't repeat everything for supply because it is the complete opposite.",
     "The rules to apply: zones similar in size, distal line at the extreme of the basing candles. Beyond that the proximal is up to you.",
     "Example identification: 'two basing candles' and the green candle is the large move away; then wrap the lines around the basing."
    ]
   }
  ],
  "rules": [
   "The distal line goes at the extreme wick of the basing - always include the wick (exceptions are a separate lesson).",
   "Use the basing candles to place both lines.",
   "Keep zones visually similar in size on the same timeframe.",
   "Use the magnet tool to hit the exact high/low."
  ],
  "mistakes": [
   "Leaving the wick outside the zone when placing the distal line.",
   "Eyeballing the line and missing the exact pip.",
   "Drawing a tiny zone just to show a huge R:R (e.g. 13:1) - fewer fills and more losses.",
   "Drawing very oversized zones (e.g. 79 pips next to 33-43 pip zones).",
   "Ignoring the big candles of a large basing when drawing the zone."
  ],
  "quotes": [
   "Distal is always going to be the one that's further away.",
   "You need to include this wick.",
   "As long as you have the distal line, that's the most important thing.",
   "You simply just cut that in half.",
   "There is some subjectivity here. It's not all completely objective.",
   "If you send me homework and it's incorrect or it's not good, that's great. That's the point of it."
  ],
  "diagrams": [
   {
    "key": "draw",
    "caption": "Demand zone: distal at the lowest wick of the basing, proximal at the top of a basing body; alternate proximal at the wick and a halved large zone."
   },
   {
    "key": "zone-anatomy",
    "caption": "PV (DBR/RBD) vs CP (RBR/DBD) shapes, with distal/proximal labelled for demand and supply."
   },
   {
    "key": "entry-stop-tp",
    "caption": "Same move measured from a small, medium and large zone: 13:1 vs 3:1 vs smaller R:R, showing fill-rate vs R:R trade-off."
   }
  ],
  "checklist": [
   "Is the distal line on the extreme wick of the basing (wick included)?",
   "Is the proximal on a basing candle body or wick?",
   "Is the zone similar in size to my other zones on this timeframe?",
   "If the zone is oversized, have I considered cutting it in half?",
   "Is my zone size giving a deliberate fill vs R:R trade-off, not a fantasy R:R?"
  ],
  "journalTags": [
   "wick excluded from distal",
   "zone too small",
   "zone too large",
   "inconsistent zone size",
   "line off by pips"
  ],
  "newVsPdfs": [
   "He calls DBR/RBD 'PV' (peaks and valleys) - the PDF calls them VP.",
   "Visual size consistency across zones on a timeframe, with pip examples (33/43 ok, 79 too big; ~31-39 similar).",
   "Cutting an oversized zone in half (3:1 becomes ~4-5:1).",
   "Magnet tool (hold Ctrl) to snap lines exactly.",
   "Distal is objective, proximal is subjective; tiny-zone 13:1 example.",
   "Exceptions where wicks are excluded are mentioned but deferred to another lesson.",
   "Homework: draw RBD, DBD, RBR and DBR zones of similar size."
  ]
 },
 {
  "n": 4,
  "title": "Multiple Timeframe Analysis",
  "kind": "video",
  "summary": "Multiple timeframe analysis (MTA) means only taking entry-timeframe zones that sit inside a higher-timeframe zone of the same direction, so the odds and the R:R are on your side. His edge: find the HTF zone, refine the entry on a lower timeframe, then hold as long as possible.",
  "sections": [
   {
    "heading": "What MTA is",
    "points": [
     "He calls it arguably one of the most important parts of the whole strategy, and says it helps whatever you trade (S/R, bull flags, etc.).",
     "MTA = knowing that entry-timeframe zones have higher odds when they sit inside a higher-timeframe zone of the same type.",
     "Natural gas example: three or four H4 demand zones, all inside a weekly demand zone. A couple of them failed, but one worked big. 'That's okay because eventually the one did.'",
     "Buying higher up the chart, inside HTF supply, gave only small R:R even on the trades that worked. 'You do not wanna be buying in a supply zone.'"
    ]
   },
   {
    "heading": "Timeframe combinations (ETF / ITF / HTF)",
    "points": [
     "ETF = entry timeframe (the one you enter on). ITF = intermediate timeframe. HTF = higher timeframe.",
     "For now, almost ignore the ITF. Focus on the ETF and the HTF. He says the ITF is there for a reason that comes up later.",
     "1m entry → 15m HTF · 5m entry → H1 HTF · 15m entry → H4 HTF · H1 entry → Daily HTF · H4 entry → Weekly HTF.",
     "The daily-entry row in the captions is unclear ('daily three month'). In the MSA lesson he says the HTF for daily is the monthly.",
     "The combinations are also on the 'High Probability Trading Solver' spreadsheet that members get.",
     "The same process works on any combination (5m with H1, 1m with 15m, 15m with H4, and so on)."
    ]
   },
   {
    "heading": "Picking your entry timeframe",
    "points": [
     "First step in building a trading plan: decide which timeframe you will enter on.",
     "He enters on H1 and H4, and occasionally on a daily zone. He can do three because he understands MTA and MSA well enough not to get confused.",
     "If you are new: pick ONE entry timeframe, not three, and stick to it.",
     "If you cannot day trade: enter on H1 or H4. If you day trade: enter on 1m, 5m or 15m.",
     "He suggests a four-chart layout as probably the best option."
    ]
   },
   {
    "heading": "The process step by step",
    "points": [
     "1) Decide your ETF (example: 5m). 2) Go to its HTF (H1) and mark the demand and supply zones. A tested zone can still be marked.",
     "3) Wait for price to reach those HTF zones. 4) Drop to the ETF and trade the ETF zones that form inside or off the HTF zone.",
     "EURUSD 5m example: a 5m demand zone removed a 5m supply zone (large move away, basing candle, stay-away candle), and price pulled back into it. That was the trade, coming off the H1 zone.",
     "In that example a wick may have stopped the trade out. 'That's why it's nice to have your stop a little bit lower, but that can happen.'",
     "In the same example the overall trend was down, so he thought shorts were higher odds. Trend is covered in another lesson.",
     "He says there are times you will adjust the timeframe pairing, to be covered later."
    ]
   },
   {
    "heading": "Where the edge comes from",
    "points": [
     "Find the HTF zone, refine the entry on the lower timeframe, then hold as long as possible.",
     "He is 'taking this weekly zone and making it smaller on an H4 chart'. He tries to trade the whole weekly move while entering only at lower-timeframe zones (he calls this confirming the entry).",
     "Inside HTF demand you only BUY. You ignore the supply-zone trades. 'We buy at demand. We do not sell at demand.'",
     "Supply trades inside HTF demand can work, but usually only briefly (about 1:1, maybe 2:1). The long inside weekly demand reached 12:1.",
     "MSA (next lesson) is 'basically this times two'. It is how he gets '50 to one' trades, but you cannot understand it until you master MTA."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Post two screenshots of one setup (a win or a loss is fine): 1) your HTF zone, 2) the ETF setup inside it ('a zone within a zone').",
     "Post it in the Discord homework chat and label what it is."
    ]
   },
   {
    "heading": "More from the lesson: Extra details from the examples",
    "points": [
     "Natural gas: he had cut a trade inside the weekly zone earlier and was back in again at the time of recording.",
     "In the EURUSD example he said the H1 zones he drew 'aren't high quality'; they were only to show the process.",
     "On the EURUSD 5m chart there was almost a second 5m zone right after the wick stop-out, which would have been another trade.",
     "He says MTA is where you actually start to build a trading plan and strategy.",
     "The edge works the same on 15m, 1m or any chart as long as you use the timeframe combinations properly."
    ]
   }
  ],
  "rules": [
   "Pick one entry timeframe (if you are new) and stick to it.",
   "Use the correct HTF for your ETF (1m→15m, 5m→H1, 15m→H4, H1→D, H4→W).",
   "Inside a HTF demand zone, only look for buys. Inside HTF supply, only look for sells.",
   "Hold as long as possible when the entry is inside a HTF zone."
  ],
  "mistakes": [
   "Buying while price is inside a higher-timeframe supply zone, or selling inside HTF demand.",
   "New traders entering on several timeframes at once.",
   "Trading entry-timeframe zones without checking where price is on the HTF.",
   "Taking quick counter-HTF trades. They only give about 1:1 to 2:1."
  ],
  "quotes": [
   "Our edge comes from identifying these higher timeframe zones, refining our entry lower, and then holding as long as possible.",
   "We buy at demand. We do not sell at demand.",
   "Pick one timeframe guys and stick to that timeframe.",
   "A couple trades did not work, but that's okay because eventually the one did.",
   "I would screenshot this, I would learn this.",
   "This is golden information here. This is how we get those 50 to one trades."
  ],
  "diagrams": [
   {
    "key": "mtf",
    "caption": "A weekly demand zone (large box) with several H4 demand zones inside it. Longs inside it run toward weekly supply, while shorts inside it only give about 1:1."
   },
   {
    "key": "zone-anatomy",
    "caption": "A 5m demand zone that removed a 5m supply zone, sitting off an H1 demand zone, with the pullback entry."
   }
  ],
  "checklist": [
   "Have I chosen ONE entry timeframe?",
   "Am I using the correct HTF for that ETF?",
   "Is my ETF zone inside a HTF zone of the same direction?",
   "Am I avoiding longs inside HTF supply and shorts inside HTF demand?",
   "Is my plan to hold toward the opposing HTF zone, not take a quick 1:1?"
  ],
  "journalTags": [
   "no HTF zone",
   "traded against HTF zone",
   "wrong timeframe pairing",
   "too many entry timeframes",
   "cut winner early"
  ],
  "newVsPdfs": [
   "The ITF (intermediate timeframe) row exists, but he says to mostly ignore it for now.",
   "He enters on H1, H4 and sometimes daily, and tells beginners to pick only one.",
   "Four-chart layout recommendation.",
   "Quick trades against the HTF zone usually give only 1:1 to 2:1, against 12:1 for the long inside weekly demand (natural gas example).",
   "His edge is stated as: HTF zone, refine the entry lower, then hold as long as possible.",
   "Members get a 'High Probability Trading Solver' spreadsheet that lists the combinations."
  ]
 },
 {
  "n": 5,
  "title": "Trend vs Momentum",
  "kind": "video",
  "summary": "A trend has clear, obvious peaks and valleys and is sustainable. Momentum is a steep, near-straight move with tiny pullbacks and is not sustainable. He trades only with trends and trend lines, and covers momentum lines only to show what not to use.",
  "sections": [
   {
    "heading": "Trend vs momentum",
    "points": [
     "He does not trade momentum or momentum lines. He only pays attention to trends and trend lines.",
     "Trend: very clear peaks and valleys that anyone can see. 'Show your mom', or any beginner, and they could tell you the trend.",
     "Momentum: a steep, almost straight-line move with only small pullbacks and no clear peaks or valleys. In his opinion it is not sustainable.",
     "When he says 'trade with the trend', he means a proper, sustainable trend, NOT momentum.",
     "A trend, even a weak one, is always better than momentum."
    ]
   },
   {
    "heading": "When a trend line exists",
    "points": [
     "Downtrend line: you need peak → valley → lower peak, then price must BREAK BELOW the valley low. Only then do you connect the peaks and extend the line.",
     "Uptrend: the mirror image. Price must break above the prior high before you draw the line.",
     "You cannot draw a trend line if the swing point was not broken. 'This doesn't make any sense.'",
     "After a new lower low, re-anchor the line to the newer high to clean it up (his example: price wicked above the old line, then made a new low).",
     "The line must slope. A near-flat line is not a trend.",
     "Arrows on his main chart link show the trend. Study his charts to learn what he counts as a trend line."
    ]
   },
   {
    "heading": "Trend quality",
    "points": [
     "A real trend line can still be low quality. If the peak-valley-peak-valley structure is small, or formed over a short time, the trend probably won't last.",
     "A larger trend, with big swings over a long time, is much better to trade with."
    ]
   },
   {
    "heading": "Trend without a trend line",
    "points": [
     "You can have a trend (for example a lower low) without a valid trend line. Then he marks the trend arrow but draws no line.",
     "AUDUSD example: the H1 was only momentum (no trend line), but the H4 had a clear trend line. The H1 arrow still said downtrend.",
     "Repeated momentum with many small peaks and valleys, falling again and again, can eventually be called a trend.",
     "No set number exists, and no pip distance (such as '600 pips') turns momentum into a trend. Use judgement.",
     "Borderline cases exist where he could argue either way, so he leaves the line off."
    ]
   },
   {
    "heading": "Why it matters for confirmation",
    "points": [
     "Example: HTF supply, H4 context, 15m entry. Breaking a small momentum line can be a false breakout, and price can continue higher.",
     "The real signal is the break of the proper trend line from further back, so use trend lines, not momentum lines, for confirmation."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Draw one momentum line and one proper trend line (clear higher highs/higher lows, peaks and valleys) and post both."
    ]
   },
   {
    "heading": "More from the lesson: Momentum with no trend: how a trend would have formed",
    "points": [
     "Example: momentum currently up, but no clear peak or valley. It is hard to call it a downtrend, sideways, or anything else; there is no trend, only momentum.",
     "How it would have become an uptrend: push up, push down lower, push back up and break the high. Then you have a clear valley and a clear peak, and you draw the trend line. That did not happen."
    ]
   },
   {
    "heading": "More from the lesson: Downtrend without a trend line (sketch)",
    "points": [
     "Sketch: valley, peak, then price broke the low but never broke the prior high in the right way. There is a lower low, so it is pretty much a downtrend, but you cannot draw a trend line there.",
     "He says this does not happen too often, so examples are hard to find."
    ]
   },
   {
    "heading": "More from the lesson: Judging when momentum becomes a trend",
    "points": [
     "Example: price came down to the trend line and kept rallying. At some point further up he would say the trend is up, but at the time there was not enough price action.",
     "Zoomed in on a slice, price can look sideways; zoomed out, it keeps breaking down and the trend is down. He calls this 'reality-based thinking': if price keeps going for long enough, that is the trend.",
     "He uses subjectivity and best judgement here, not a measurement."
    ]
   }
  ],
  "rules": [
   "Trade with trends and trend lines, never momentum lines.",
   "Draw a trend line only after the prior swing low (downtrend) or high (uptrend) is broken.",
   "A trend line must be angled, not near-flat.",
   "For confirmation, use a break of a proper trend line, not a momentum line.",
   "Do not draw momentum lines on your chart."
  ],
  "mistakes": [
   "Drawing momentum lines and treating them as trend lines (he sees this a lot in the community).",
   "Drawing a trend line before the swing point is broken.",
   "Treating a tiny, short-lived trend as equal to a large, established one.",
   "Taking the break of a small momentum line as confirmation, which can be a false breakout.",
   "Looking for an exact pip or candle count to call a trend."
  ],
  "quotes": [
   "Momentum lines are steep and aggressive and trend lines are very, very obvious.",
   "You could probably show your mom who has no idea what trading is, and she'd be able to tell you.",
   "Not everything is black and white.",
   "The reason I'm showing you momentum lines is to show you what not to do.",
   "This is always gonna be better than that momentum.",
   "Not every trend line's gonna be the exact same. Not every momentum line's gonna be the exact same.",
   "Study my charts, look at my trend lines, get used to it."
  ],
  "diagrams": [
   {
    "key": "trend-momentum",
    "caption": "Side by side: a trend with clear peaks and valleys, and a steep momentum line with tiny pullbacks."
   },
   {
    "key": "trendline",
    "caption": "Downtrend line drawn only after price breaks the valley low, then re-anchored to the newer lower high after the next lower low."
   }
  ],
  "checklist": [
   "Does the trend have clear, obvious peaks and valleys?",
   "Was the prior swing low/high broken before I drew the line?",
   "Is the line angled, not flat?",
   "Is this a sizeable, established trend rather than a short one?",
   "Is my confirmation a break of a trend line (not a momentum line)?"
  ],
  "journalTags": [
   "traded momentum line",
   "trendline drawn too early",
   "low-quality trend",
   "false momentum-line break",
   "flat trendline"
  ],
  "newVsPdfs": [
   "The PDFs only define a trend by HH/LL plus a blatant trendline. They do not cover the separate concept of momentum vs trend.",
   "Trend line is valid only after the prior swing point breaks, then re-anchored after each new low or high.",
   "Trend quality depends on the size and duration of the swings.",
   "A trend can exist without a trend line, and repeated momentum can become a trend. No fixed measure.",
   "Breaking a momentum line can be a false breakout for confirmation."
  ]
 },
 {
  "n": 6,
  "title": "Entry, Stop Loss & Take Profit",
  "kind": "video",
  "summary": "Basic method: enter a little before the proximal line, stop a little beyond the distal line, with the spread as buffer. Take-profit methods vary and should be tested. He takes 25% off at 3:1 and holds 75% toward the next HTF opposing zone.",
  "sections": [
   {
    "heading": "Mindset",
    "points": [
     "As with drawing zones, entries and take profits are subjective. There is no right or wrong. Test what works for you, and you may find an entry he has not tested.",
     "Once the zone is broken the whole trade is void, which is why the stop goes just beyond it."
    ]
   },
   {
    "heading": "Entry and stop placement",
    "points": [
     "Size the long/short position tool to the zone, then add the spread on both sides. With a 1-pip EURUSD spread, entry about 1 pip before the proximal line and stop about 1 pip beyond the distal line.",
     "Entering just around the proximal line is usually fine. You don't need a wide buffer or an entry far ahead of the zone.",
     "Give the stop a little more room, judged visually, because price sometimes peeks just through a zone and then goes.",
     "The stop is 'usually always' a few pips/spread beyond the zone. Nothing else to it.",
     "Supply is the exact opposite: short just below the proximal line, stop above the zone."
    ]
   },
   {
    "heading": "Other entry types (test them)",
    "points": [
     "Split entry: 50% at the proximal line and 50% halfway through the zone. This tightens the entry and raises R:R, but has cons ('no free lunch').",
     "The split entry may suit a bigger zone.",
     "Zone within the zone: drop to a lower timeframe (for example 15m inside an H4 zone) and use a lower-timeframe zone to refine the entry.",
     "There are hundreds of entry types. More may be covered in the Sunday sessions or a later video."
    ]
   },
   {
    "heading": "His personal method",
    "points": [
     "Two orders: 25% of the position with TP at 3:1 (set on the R:R tool → create limit order).",
     "The other 75% targets higher-timeframe supply/demand, for example holding H4 longs inside weekly demand up to the next weekly supply.",
     "On the runner he bumps the stop under new zones to lock in profit."
    ]
   },
   {
    "heading": "Take-profit methods",
    "points": [
     "Target the most recent high or pivot.",
     "Fixed R:R such as 2:1 or 3:1, ignoring structure. Example: maybe your tests show 30% wins and a lot of trades reach 3:1, so a fixed 3:1 rule fits you.",
     "Target the next opposing HTF zone. With MTA, an H4 entry can target weekly supply, which raises overall R:R.",
     "Context decides: in weekly demand with room above, hold to weekly supply. If it is a riskier trade with a supply zone close above, take profits quicker."
    ]
   },
   {
    "heading": "Managing the trade",
    "points": [
     "As price moves in your favour and fresh demand forms below, you can bump the stop under it to lock in profit."
    ]
   },
   {
    "heading": "More from the lesson: How to test",
    "points": [
     "His instruction: go back, look at a chart, track the zones like he does, and test which entry and take-profit methods work for you."
    ]
   },
   {
    "heading": "More from the lesson: Spread example details",
    "points": [
     "He uses a broker with a spread (he notes many people pay for no spread). EURUSD example: if the tool reads 40.2, he moves it to about 41.2 (one pip before the zone), and does the same past the other side for the stop.",
     "Natural gas example: H4 demand inside the big weekly zone, with the runner held toward the next weekly supply at roughly 3."
    ]
   },
   {
    "heading": "More from the lesson: Zone-within-zone example",
    "points": [
     "On the H4 example there was a lower-timeframe zone inside the zone that could have been used to refine the entry."
    ]
   }
  ],
  "rules": [
   "Stop goes just beyond the distal line (spread/few pips). If the zone breaks, the trade is void.",
   "Enter just before the proximal line.",
   "Base your entry and take-profit choices on your own testing."
  ],
  "mistakes": [
   "Stop exactly on the zone edge with no room (zones can peek through).",
   "Holding for a big target when an opposing zone sits close above. Take profit quicker then.",
   "Copying someone else's entry or TP style without testing it."
  ],
  "quotes": [
   "Once the zone is broken, the whole trade gets voided.",
   "There's no free lunch. There's pros and cons to everything.",
   "It's all about testing.",
   "The stop loss is usually always the same, but as far as entries go and take profits, it's definitely subjective.",
   "It's all based on different market conditions."
  ],
  "diagrams": [
   {
    "key": "entry-stop-tp",
    "caption": "Demand zone with entry one spread above the proximal line, stop one spread below the distal line, 25% TP at 3:1, and the runner targeting the next weekly supply."
   },
   {
    "key": "mtf",
    "caption": "H4 entry inside weekly demand, with TP at the next weekly supply zone."
   }
  ],
  "checklist": [
   "Is the entry just before the proximal line (spread added)?",
   "Is the stop just beyond the distal line with a little room?",
   "Did I choose a TP method I have tested?",
   "Is there an opposing zone close to my target? If so, did I plan to take profit sooner?",
   "Do I have a plan for bumping the stop under new zones?"
  ],
  "journalTags": [
   "stop too tight",
   "no spread buffer",
   "TP into opposing zone",
   "untested entry type",
   "held too long with opposing zone near"
  ],
  "newVsPdfs": [
   "Spread-based buffer: about 1 pip before the proximal line and about 1 pip beyond the distal line, with the stop given a bit more visual room.",
   "His split: 25% at 3:1, 75% held to the next HTF opposing zone.",
   "Split entry: 50% at the proximal line, 50% at mid-zone.",
   "Refining the entry with a lower-timeframe zone inside the zone (15m inside H4)."
  ]
 },
 {
  "n": 7,
  "title": "Multiple Sequence Analysis",
  "kind": "video",
  "summary": "Multiple sequence analysis (MSA) adds a third timeframe: the HTF of your HTF. It asks why the higher-timeframe zone should hold, and three-timeframe confluence is when he risks the most. Without that third-timeframe zone he still may trade, but at 0.25–0.5% instead of 1%.",
  "sections": [
   {
    "heading": "What MSA is",
    "points": [
     "MTA = multiple timeframe analysis. MSA = multiple sequence analysis. He writes them as 'MTA' and 'MSA'.",
     "You must master MTA first. 'If you do not understand multiple timeframe analysis, you will not understand multiple sequence analysis.'",
     "MTA: look for ETF trades inside HTF zones (example: H4 longs inside weekly demand).",
     "MSA asks: why should that weekly demand zone hold? Treat the HTF as if it were your entry timeframe, then look at ITS HTF."
    ]
   },
   {
    "heading": "The sequences",
    "points": [
     "1m ETF → 15m HTF → H4 MSA.",
     "5m ETF → H1 HTF → Daily MSA.",
     "15m ETF → H4 HTF → Weekly MSA.",
     "H1 ETF → Daily HTF → Monthly MSA.",
     "H4 ETF → Weekly HTF → in the natural gas example he used a 6-month 'macro' zone. The captions do not state a fixed MSA timeframe for the weekly.",
     "Any timeframe works if you use the appropriate sequence (see the High Probability Trading Solver spreadsheet). You can message him to check yours."
    ]
   },
   {
    "heading": "Natural gas example (three-timeframe confluence)",
    "points": [
     "Weekly demand was a drop-base-rally with two basing candles and a clean move up.",
     "On the 6-month chart there was demand (basing candle plus large stay-away candles), and the weekly demand sat inside it.",
     "H4 demand inside weekly demand inside 6-month demand gives three-timeframe confluence.",
     "This is why he felt comfortable taking loss after loss in the H4 zones and holding for one large win.",
     "These are the trades where he applies the most risk/capital."
    ]
   },
   {
    "heading": "Risk sizing by confluence",
    "points": [
     "Without a HTF zone and an MSA zone in play he would risk about 0.25% or 0.5%, not 1%.",
     "With MSA confluence and price moving because the higher timeframes are in play, he applies more capital.",
     "Low-quality example: EURUSD, find a weekly zone and an H4 zone in it, with no reason for the weekly to hold. He says this is fine, and better than S/R, but low quality: 0.25–0.5% risk.",
     "5m day-trade example: H1 demand, but on the daily there is no demand where price is (only a low-quality one elsewhere). No MSA confluence, so very low risk on 5m confirmation. If the area were daily demand too, it becomes higher odds.",
     "You can still take H1 trades in daily zones with no monthly zone. Just risk less."
    ]
   },
   {
    "heading": "Edge and expectations",
    "points": [
     "The edge: identify the top-level zone (for example daily), enter on the 5m, and try to hold the whole daily move by repeatedly finding 5m entries.",
     "Expect a very large R:R but a not-amazing win rate. 'That's just my strategy.'",
     "Once he started applying MSA his trading 'took a turn for the best'. Without it 'you're gonna have a hard time trading'."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Three screenshots: 1) entry-timeframe zone/entry, 2) higher-timeframe zone, 3) MSA-timeframe zone. Label each timeframe (arrows help). Any valid sequence is fine."
    ]
   },
   {
    "heading": "More from the lesson: Where MSA came from",
    "points": [
     "He says he asked himself one day, while only trading HTF zones, 'why should this weekly demand zone hold?', and then went to the timeframe above the weekly.",
     "The weekly zone in the natural gas example had 'beautiful reactions' off it."
    ]
   },
   {
    "heading": "More from the lesson: The question above the weekly",
    "points": [
     "In the EURUSD low-quality example he says that to justify the weekly demand you would have to ask whether there is a three-month demand there 'or whatever'.",
     "In the natural gas example he used the 6-month ('macro') chart. He adds that MSA can also be applied to the lower timeframes."
    ]
   },
   {
    "heading": "More from the lesson: EURUSD daily-to-5m hold idea",
    "points": [
     "Example: a daily supply zone was on his chart at the time. Plan: get long at daily demand, find a 1H demand inside it, enter on 5m, and try to hold from the daily demand toward the daily supply by repeatedly finding 5m entries.",
     "He calls the 5m 'a pretty popular entry type'."
    ]
   },
   {
    "heading": "More from the lesson: How to build your own sequence",
    "points": [
     "Take the HTF of your entry timeframe, act as if that HTF is now your entry timeframe, and apply its HTF. That third timeframe is your MSA timeframe."
    ]
   }
  ],
  "rules": [
   "Master MTA before trying MSA.",
   "For every HTF zone, ask why it should hold: check the next timeframe up.",
   "Risk the most only with three-timeframe confluence. Without a HTF or MSA zone, risk 0.25–0.5% instead of 1%.",
   "Use the correct sequence for your entry timeframe."
  ],
  "mistakes": [
   "Taking an ETF zone inside a HTF zone without asking why the HTF zone should hold.",
   "Using full risk on low-quality, single-timeframe or two-timeframe setups.",
   "Expecting a high win rate from a big-R:R hold strategy."
  ],
  "quotes": [
   "Why should this weekly demand zone hold?",
   "If you're not using multiple sequence analysis, you're gonna have a hard time trading.",
   "Our risk reward is gonna be very large, but our win rate is not gonna be amazing.",
   "If you do not understand multiple timeframe analysis, you will not understand multiple sequence analysis. I can guarantee you that.",
   "When I started to apply this, my trading took a turn for the best."
  ],
  "diagrams": [
   {
    "key": "sequence",
    "caption": "Three nested demand zones (6-month, weekly, H4) showing three-timeframe confluence and where full risk is allowed."
   },
   {
    "key": "mtf",
    "caption": "ETF → HTF → MSA ladder: 1m-15m-H4, 5m-H1-D, 15m-H4-W, H1-D-M."
   }
  ],
  "checklist": [
   "Is my ETF zone inside a HTF zone?",
   "Is that HTF zone inside a zone on the MSA timeframe?",
   "If there is no MSA zone, did I cut risk to 0.25–0.5%?",
   "Am I using the correct ETF/HTF/MSA sequence?",
   "Do I accept a lower win rate for a larger R:R?"
  ],
  "journalTags": [
   "no MSA confluence",
   "full risk on low quality",
   "HTF zone unsupported",
   "wrong sequence"
  ],
  "newVsPdfs": [
   "MSA (a third timeframe above the HTF) does not appear in course.ts.",
   "Sequence list: 1m-15m-H4, 5m-H1-D, 15m-H4-W, H1-D-M, plus a 6-month macro for the H4/W example.",
   "Risk tiers: about 0.25–0.5% without HTF/MSA confluence, more (up to 1%) with three-timeframe confluence.",
   "He says his strategy has a big R:R and a modest win rate."
  ]
 },
 {
  "n": 8,
  "title": "Trend Trading",
  "kind": "video",
  "summary": "Trend trading means the higher timeframe AND the entry timeframe are both trending, and you buy or sell the nearest entry-timeframe zone until it is removed. After three continuation patterns in a row, price is overextended: stop or cut risk, and do not chase.",
  "sections": [
   {
    "heading": "Definition",
    "points": [
     "Some call it momentum trading. The idea is trading with the trend.",
     "Just buying the nearest H1 demand because the H1 is up is 'right to an extent', but it ignores the higher-timeframe trend.",
     "His trend trading: the HTF of your ETF must be trending, AND the ETF must be trending (trend line respected). Then buy or sell the NEAREST ETF zone.",
     "Example: H1 ETF, daily HTF in an objective uptrend, H1 uptrend line respected. The nearest H1 demand is valid.",
     "Once the H1 demand was removed, his chart showed the H1 trend as sideways."
    ]
   },
   {
    "heading": "When the nearest zone is removed",
    "points": [
     "Trade the nearest zones in play until that zone is removed.",
     "After the nearest zone breaks you lose the ETF uptrend. You cannot buy the next zone down UNLESS it sits inside an ITF zone (H4 for an H1 entry).",
     "Otherwise wait for HTF (daily) demand to be hit. In the example the nearest H4 zone was far lower, so buying the next H1 zone was risky."
    ]
   },
   {
    "heading": "Overextension: the three-CP rule",
    "points": [
     "In his experience, after three continuation patterns (CPs) in a row you should stop trading in that direction. Price is overextended and you are waiting for a pullback.",
     "You CAN still take it, but with less risk and more aggressive management. His example: move the stop to break even by about 1:1 (or take profit), half-risk then into profit.",
     "At only the second CP he might risk the full 1% and look for 5:1.",
     "Not always exact: one run went CP 1-2-3-4-5 and still worked as a trend trade. He skipped the later one because of the three-CP overextension.",
     "Price will sometimes go straight up and you will miss trades. Do not chase price ('I cannot stress that enough')."
    ]
   },
   {
    "heading": "Zone quality still matters",
    "points": [
     "A trending HTF does not mean buy every nearest zone. The zone must still be high quality.",
     "Example: H4 entry with the weekly trending up. The nearest H4 demand was not great, so not automatically a buy."
    ]
   },
   {
    "heading": "Homework",
    "points": [
     "Two labelled screenshots: the HTF trend (any sequence), and the nearest-zone setup on the ETF."
    ]
   },
   {
    "heading": "More from the lesson: Details from the examples",
    "points": [
     "The 3rd-CP trade: he actually thought about taking it (entry and stop shown). As price reached about 1:1 he would have moved the stop to break even at least, or taken profit, so he would have broken even.",
     "On the daily, price went up at about a 90-degree angle. That will happen, and you will miss trades.",
     "In the H1 example, the nearest H4 zone was far below, around 179.5, which is why buying the next H1 zone was risky.",
     "Trading one timeframe and buying its demand zones 'is fine'; to stack the odds you need to look at other factors (the HTF trend).",
     "He says the daily uptrend in the example was 'completely objective'; nobody would deny it."
    ]
   },
   {
    "heading": "More from the lesson: Terminology",
    "points": [
     "'Momentum trading' from him can also mean a different method that he does not cover here."
    ]
   }
  ],
  "rules": [
   "The HTF trend and the ETF trend must both point the same way.",
   "Trade only the NEAREST ETF zone until it is removed.",
   "After the nearest zone is removed, the next zone is only valid if it sits inside an ITF zone. Otherwise wait for the HTF zone.",
   "After three CPs in a row, stop, or use reduced risk and aggressive management.",
   "The zone must still be high quality."
  ],
  "mistakes": [
   "Calling it a trend trade off one timeframe only.",
   "Chasing price after an extended run.",
   "Buying deeper ETF zones after the nearest one breaks, when they are not inside an ITF zone.",
   "Buying every nearest zone regardless of quality."
  ],
  "quotes": [
   "Do not chase price. I cannot stress that enough.",
   "After three CPs, continuation patterns, we should stop trading to the upside.",
   "We simply buy or sell the nearest zone.",
   "We don't just want to just be buying every zone with the trend.",
   "We still need to make sure that the zone is high quality."
  ],
  "diagrams": [
   {
    "key": "trend-trading",
    "caption": "Daily uptrend plus H1 uptrend line. Buy the nearest H1 demand. CP1-CP2-CP3 marked, with the 4th zone flagged as overextended."
   },
   {
    "key": "mtf",
    "caption": "After the nearest H1 zone breaks, the next H1 zone is valid only if inside an H4 zone; otherwise wait for daily demand."
   }
  ],
  "checklist": [
   "Is the HTF trending in my direction?",
   "Is the ETF trending (trend line holding)?",
   "Is this the NEAREST ETF zone?",
   "If the nearest zone broke, is this zone inside an ITF zone?",
   "Is this the 3rd+ CP in a row? If so, did I cut risk or skip?",
   "Is the zone itself high quality?"
  ],
  "journalTags": [
   "chased price",
   "after 3 CPs",
   "not nearest zone",
   "HTF not trending",
   "next zone not in ITF",
   "low-quality zone in trend"
  ],
  "newVsPdfs": [
   "Rule: buy or sell only the NEAREST ETF zone; the next zone is valid only if inside an ITF zone.",
   "Three continuation patterns in a row means overextended: stop, or reduce risk and manage aggressively.",
   "Full 1% and a 5:1 target at an early (2nd) CP.",
   "His meaning of 'momentum trading' may differ in other contexts."
  ]
 },
 {
  "n": 9,
  "title": "Dividend Investing Using Supply and Demand Zones",
  "kind": "video",
  "summary": "For long-term dividend stocks he buys supply-and-demand zones on the 12M, 6M, 3M and 1M charts with no stop loss (about 99% of the time). He sizes up on higher-timeframe zones and buys pullbacks instead of chasing.",
  "sections": [
   {
    "heading": "What makes it different",
    "points": [
     "This is ONLY for dividend investing, because there is no stop loss about 99% of the time. Otherwise it is the same supply-and-demand method.",
     "Charts: 12-month, 6-month, 3-month and 1-month (his macro charts). He maps zones on each and buys them."
    ]
   },
   {
    "heading": "Sizing by timeframe",
    "points": [
     "Illustration only ('keep it simple'): $100 at a 1M zone, $200 at 3M, $300 at 6M, $500 at 12M.",
     "The larger the timeframe, the bigger the pullback, so the bigger the buy.",
     "Buy according to your risk parameters, your capital and how consistent your income is."
    ]
   },
   {
    "heading": "Examples",
    "points": [
     "Coca-Cola: no fresh zones on the 12M. A 1M zone buy at 56.65, no stop.",
     "3M (MMM): buying 1M zones all the way down while it trended down, collecting dividends. Now at a 12-month demand zone, about 62% down from the highs. He plans heavy capital while it stays in that 12M demand.",
     "If it goes sideways for five years he doesn't mind; he keeps collecting the dividend and buying while it is paid."
    ]
   },
   {
    "heading": "Investing in a rising market",
    "points": [
     "Don't chase after a big run (S&P monthly example).",
     "Wait for price to base, create demand, then break the prior high. The new demand zone below becomes a discount buy on the pullback.",
     "For more active investing you can buy small pullbacks on a daily/lower timeframe."
    ]
   },
   {
    "heading": "Investing in a falling market",
    "points": [
     "Buy demand zones on the way down, as long as you have consistent capital, believe in the company long term, and it pays a dividend.",
     "Buying at the highs still collects dividends but can leave you down 50%. Buying low adds capital gains on top of dividends."
    ]
   }
  ],
  "rules": [
   "No-stop zone buying is for dividend investing only.",
   "Buy only at zones on the 1M/3M/6M/12M charts; bigger timeframe zone means bigger buy.",
   "In uptrends, buy pullbacks to new demand; never chase.",
   "Only keep buying a falling stock if you believe in the company, it still pays a dividend, and your capital is consistent."
  ],
  "mistakes": [
   "Using the no-stop approach for trading.",
   "Chasing a stock after a big run instead of waiting for a pullback to demand.",
   "Buying at the highs."
  ],
  "quotes": [
   "It's basically the same strategy as supply and demand, but it's just with no stop loss.",
   "The larger timeframe we go, the bigger the pullback.",
   "Wait for price to go up and then buy pullbacks."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Monthly chart: new demand forms after breaking the prior high. Buy the pullback to it instead of chasing."
   }
  ],
  "checklist": [
   "Is this a dividend stock I want to hold long term?",
   "Is price in a 1M/3M/6M/12M demand zone?",
   "Is my buy size scaled to the zone's timeframe?",
   "Am I buying a pullback rather than chasing a run?",
   "Is my capital consistent enough to keep buying lower?"
  ],
  "journalTags": [
   "chased price",
   "no zone",
   "no dividend",
   "oversized buy"
  ],
  "newVsPdfs": [
   "The whole dividend-investing approach: 1M/3M/6M/12M zones, no stop, size scaled by timeframe.",
   "Coca-Cola 56.65 1M zone and 3M (MMM) 12M demand examples."
  ]
 },
 {
  "n": 10,
  "title": "When to Remove a Limit Order",
  "kind": "video",
  "summary": "No time or candle-count rule. Remove or move a limit order when the context changes: the HTF zone becomes tested or loses control, a newer nearer zone forms (set & forget), or the trend line or ITF support is lost. Everything is subject to your own testing.",
  "sections": [
   {
    "heading": "Framing (Q from Melo)",
    "points": [
     "Question: how long should limit orders sit, and do you remove them on a condition or after a time?",
     "Everything here is 'subject to testing'. He is explaining what he was taught and his own experience.",
     "There is more room to leave orders in longer with set & forget than with confirmation.",
     "No time limit and no candle count apply."
    ]
   },
   {
    "heading": "When a zone counts as tested",
    "points": [
     "Price pushes into the HTF zone and reacts. The zone is officially TESTED once a candle CLOSES fully outside it, with no body or wick touching.",
     "Until then it is 'being tested'.",
     "Pulling back into a tested HTF zone to a lower-timeframe zone is lower odds.",
     "A quick return right after it was tested is different from returning much later after a long move ('even more tested')."
    ]
   },
   {
    "heading": "Confirmation: what can offset a tested zone",
    "points": [
     "A trend can negate it: H4 downtrend pulling into H4 supply plus a daily downtrend makes 'tested' less important.",
     "Counter-trend (for example H4 down, daily up) at a tested zone: he would not feel comfortable. 'With the trend always increases your odds.'",
     "If you are not with the trend, prefer the confirmation to happen while the zone is still being tested, not after.",
     "Embedded zones: two 15m supply zones in a tested H4 supply both worked over 3:1. The one inside an H1 supply was higher odds. He would have pulled the order on the one that wasn't embedded."
    ]
   },
   {
    "heading": "Confirmation: the zone you trade must stay in control",
    "points": [
     "Example: a daily demand becomes in control, and an H1 demand forms from confirmation. Leave the order as long as price pulls back BEFORE hitting the opposing daily supply.",
     "If price hits the opposing daily supply first and pushes down, daily supply is now in control. He removes the entry for sure.",
     "Exaggerated case: an H4 confirmation that only pulls back after price has reached weekly supply is not a confirmation trade anymore. The move already happened."
    ]
   },
   {
    "heading": "Confirmation: distance and timing",
    "points": [
     "Rule of thumb: the confirmation should form within about the size of the HTF zone away from it. Further away, other things come into control.",
     "Best case is an immediate pullback after the confirmation. If not, make sure the ETF zone is inside a HTF zone.",
     "After sharp moves off a zone that becomes in control, trades outside the HTF zone can still work. Inside is better.",
     "Once price leaves and breaks the low, it is 'more of a momentum' trade than confirmation."
    ]
   },
   {
    "heading": "Set & forget: move the order to the nearest zone",
    "points": [
     "Set & forget requires price to be trending.",
     "Keep the order at the nearest ETF zone as long as the trend line holds.",
     "When a NEW nearer zone forms, remove the old order and move it to the new nearest zone, if it is a qualified, decent-looking zone and there is room to the trend line.",
     "The trigger is a newer nearer zone, not time or candles."
    ]
   },
   {
    "heading": "Set & forget: after a loss or trend-line break",
    "points": [
     "Example sequence: H1 (HTF), 15m (ITF), 5m (ETF).",
     "If the nearest 5m zone fails, pull any lower 5m orders UNLESS that 5m zone is inside a 15m zone (H1 even better) AND the 15m trend line is still holding.",
     "If the ETF zone is below the ETF trend line it is lower odds. He takes it only if it is inside an ITF zone with the ITF trend line holding.",
     "AUDUSD example: a 5m zone just under the 5m trend line was inside a 15m rally-base-rally, with no real 15m trend line (only momentum). He would leave it.",
     "When price is trending, the criteria can be looser; trend raises odds."
    ]
   }
  ],
  "rules": [
   "A zone is tested once a candle closes fully outside it (no wick or body touching).",
   "Confirmation: remove the order if price hits the opposing HTF zone before pulling back to your entry zone.",
   "Set & forget: keep only the order at the nearest zone. Move it when a newer nearer qualified zone forms.",
   "After the nearest ETF zone fails, lower ETF orders stay only if inside an ITF zone with the ITF trend line holding.",
   "No time-based or candle-count removal."
  ],
  "mistakes": [
   "Leaving an order after the opposing HTF zone was hit, when your zone is no longer in control.",
   "Counter-trend trades at a tested zone.",
   "Keeping an old set & forget order below a newer nearer zone.",
   "Taking ETF zones below a broken trend line with no ITF zone support.",
   "Treating confirmations far from the HTF zone as confirmation trades."
  ],
  "quotes": [
   "It has nothing to do with time or anything or the amount of candles.",
   "When a zone is tested, it becomes lower odds.",
   "With the trend, it always increases your odds.",
   "It's all going to be subject to testing."
  ],
  "diagrams": [
   {
    "key": "remove-limit",
    "caption": "Set & forget: the order moves from the old zone to the newer nearest zone. After a loss, the next zone is kept only if inside an ITF zone with the ITF trend line holding."
   },
   {
    "key": "zone-removed",
    "caption": "Tested definition: the zone is tested once a candle closes fully outside it."
   },
   {
    "key": "confirmation",
    "caption": "H1 confirmation demand off daily demand. Order is valid until price touches the opposing daily supply, then removed."
   }
  ],
  "checklist": [
   "Is the HTF zone tested (candle closed fully outside)?",
   "If tested, am I with the trend on the ETF and HTF?",
   "Has price hit the opposing HTF zone before my entry? If so, remove.",
   "Is my order at the NEAREST zone (set & forget)?",
   "Is the trend line still holding? If not, is my zone inside an ITF zone with the ITF trend line intact?",
   "Did the confirmation form within about one zone-height of the HTF zone?"
  ],
  "journalTags": [
   "tested HTF zone",
   "opposing zone hit first",
   "stale limit order",
   "not nearest zone",
   "below trendline",
   "no ITF support",
   "counter-trend at tested zone"
  ],
  "newVsPdfs": [
   "Definition of a 'tested' zone (a candle closes fully outside it).",
   "Order-removal triggers: opposing zone hit first, newer nearer zone, trend-line loss without ITF support.",
   "Rule of thumb: confirmation within about one zone-height of the HTF zone; an immediate pullback is best.",
   "Trend can offset a tested zone; an embedded lower-timeframe zone raises odds."
  ]
 },
 {
  "n": 11,
  "title": "Having the Right Mindset in Trading",
  "kind": "webinar",
  "summary": "A no-chart psychology bonus video, a solo recording rather than a live webinar. Main points: focus on the process, not the money; being flat is a position; predict but don't trade predictions; stick to one side; judge a strategy over months, not three losses.",
  "sections": [
   {
    "heading": "Process over predictions and money",
    "points": [
     "Stop asking others 'where is it going?' or 'should I buy here?'. Even if you make $5,000 off a tip, it doesn't make you consistent.",
     "He wanted consistency and to learn to do it himself. Once you understand MSA you'll have your own view of where price is headed.",
     "Focus on the strategy and the process, not the money. If you don't enjoy charting and tracking zones, trading may not be right for you.",
     "Sharing profits in Discord is irrelevant to him. Get consistent first and the money follows."
    ]
   },
   {
    "heading": "Being flat is a position",
    "points": [
     "Having no trades open is a position. It means you see no good quality setups.",
     "EURUSD example: daily supply in control, H1 demand in play. He missed his entry, pulled the order, and is waiting for the zone to be removed so he can look for H1 confirmation.",
     "Not losing money is part of the process. Preserving capital matters more. Breaking even over three years beats losing thousands or blowing accounts.",
     "Patience comes only with experience."
    ]
   },
   {
    "heading": "Prediction vs trading",
    "points": [
     "He predicted pullbacks on overextended GBPJPY/AUDJPY from history and experience, but would never trade that.",
     "Reason: weekly momentum, daily, H4 and H1 trends were all up. Price could easily shoot back up, unless some HTF supply was in control.",
     "'I will predict these things based on history, but I will not trade them.'"
    ]
   },
   {
    "heading": "Stick to one side: long, short or flat",
    "points": [
     "Traders try to catch every move: they trade the daily uptrend and also try to short the lower-timeframe pullback.",
     "Pick one bias from the trends in play. Example: daily uptrend pulling into daily demand, so only longs.",
     "Change accordingly: if those longs lose and price breaks below daily demand, you lose the uptrend (now sideways), and shorts become viable.",
     "Counter-trend is possible, but your MSA must show higher-timeframe zones in control.",
     "You will take fewer trades. It feels hard at first, and like working out, it becomes natural with repetition."
    ]
   },
   {
    "heading": "Each setup is one of thousands",
    "points": [
     "Each setup must match your exact criteria, but it is one of thousands over your career. Stick to the plan and R:R.",
     "His average R:R is about 5:1. Three losses in a row still hurts.",
     "Run a simulation on a calculator or notepad. For example: lose 6, win 1, lose 3, win 1; or 5 losses then 2 wins. See that it is still profitable.",
     "Don't change strategy after three losses, especially a high-R:R one. Give it a few months. If it still isn't working after about two quarters, then change something.",
     "Holding to the final TP takes experience. Example: up $1,500 with a $2,000 target, a new trader closes early and loses out on $500."
    ]
   }
  ],
  "rules": [
   "Stick to one side of the market (long, short or flat) and change only when the zones or trend change.",
   "Don't trade predictions that go against the trends in play.",
   "Don't change a strategy after a short losing streak. Evaluate over about two quarters.",
   "Protect capital; being flat is a valid position."
  ],
  "mistakes": [
   "Asking others where price is going.",
   "Focusing on money instead of process.",
   "Trying to catch every move (trading both directions).",
   "Trading a prediction against the trend.",
   "Abandoning the strategy after three losses.",
   "Closing early before the final TP out of fear."
  ],
  "quotes": [
   "Being flat, being in no position is actually a position.",
   "I will predict these things based on history, but I will not trade them.",
   "Stick to one side of the market: long, short or flat.",
   "It should be about the process and learning how to trade; the money will just flow in naturally."
  ],
  "diagrams": [
   {
    "key": "mindset",
    "caption": "Long / Short / Flat: one bias at a time, switching only when the trend is lost or a demand zone is removed."
   }
  ],
  "checklist": [
   "Is this trade on my one chosen side (long/short/flat)?",
   "Is it a prediction against the trends, or a planned setup?",
   "Does it exactly match my setup criteria?",
   "Have I simulated a losing streak at my R:R so I can sit through it?",
   "Am I staying flat when nothing qualifies?"
  ],
  "journalTags": [
   "traded both sides",
   "traded a prediction",
   "asked for signals",
   "changed strategy after losses",
   "closed before TP",
   "FOMO / not flat"
  ],
  "newVsPdfs": [
   "'Flat is a position' and 'predict but don't trade it'.",
   "'Stick to one side: long, short or flat', switching only when the trend is lost.",
   "Evaluate a strategy over about two quarters, not after three losses.",
   "Simulating a loss sequence at your R:R (his average is about 5:1)."
  ]
 },
 {
  "n": 12,
  "title": "Day trading (webinar)",
  "kind": "webinar",
  "summary": "Kevin walks through the pros and cons of day trading, the three day-trading timeframe sequences, and a full top-down day-trading plan on EUR/USD using entry, higher and curve timeframes. He finishes with session times (Eastern) and how to handle news: be aware of it, never predict it, and never trade into it.",
  "sections": [
   {
    "heading": "Pros and cons of day trading",
    "points": [
     "Pro: far more setups, so you get involved in many trades and build emotional experience fast.",
     "He thinks day trading is a great way to START learning, but only if you risk tiny amounts you can afford to lose (he started risking about $5 a trade). Risking 1-2% of the account per trade as a beginner day trader is 'not a great idea'.",
     "Con: decisions have to be made quickly, so mistakes are easier (e.g. chasing a 1m/5m zone you 'missed' because the candle is about to close - he never recommends that).",
     "Con: much more stress; you have to be at the screen at exact times. On H1/H4 he has all day to decide and only rarely has to act live (his big gold trade: H1 zone inside H4 zone, price already inside both).",
     "Con: you start to believe you must take a trade every day. That is not true and it messes with your emotions.",
     "Price is fractal: a zone that works on H4 works on 1m, daily, monthly. The only differences between timeframes are how many trades you get and how fast you must react.",
     "His suggested learning path: start day trading (small risk) -> move to swing trading (where you really start to master it) -> optionally go back to day trading, which then feels much easier.",
     "To make more money he prefers risking more per zone (e.g. 2% instead of 1%, if the strategy's drawdown allows) rather than taking more trades on lower timeframes."
    ]
   },
   {
    "heading": "Chart layouts",
    "points": [
     "His own layout: four charts - weekly, daily, H4, H1 - plus a separate macro chart for the overall curve. He enters on H4 and H1 (mostly H1 lately).",
     "Day-trader members: keep his chart link open to see his HTF zones (e.g. if price is inside his daily supply, lay off day-trading longs).",
     "On your own two-chart layout: one side = higher timeframe, other side = entry timeframe."
    ]
   },
   {
    "heading": "The three day-trading sequences (HTF -> entry)",
    "points": [
     "H4 -> 15m entry (captions say '50 minute'; context and the H4 HTF show it is the 15-minute). For people who can only check the chart every 15-20 minutes. 15m is the highest day-trading entry; trades can last longer than expected, so expect to hold overnight - it is 'day trading / intraday swing'.",
     "H1 -> 5m entry. For checking every 5-10 minutes. His pick if he started day trading tomorrow - a good middle ground (e.g. 30 minutes away = 6 candles on 5m vs 30 on 1m).",
     "15m -> 1m entry. Most trades, but you must be on the charts constantly; a 1m zone can form, pull back and hit TP in minutes while you answer the door. Fine only if you accept missing trades. Expect to be out of a 1m trade within roughly 10-15 minutes depending on conditions.",
     "Anything higher than a 15m entry is intraday swing. Seconds charts (1s, 5s, 10s, 30s...) are extreme scalping - stay away. Even 1m is borderline scalping."
    ]
   },
   {
    "heading": "Top-down plan example (15m HTF, 1m entry, EUR/USD)",
    "points": [
     "Step 1 - assess the trend on the 15m. A member called it sideways because no clean trendline could be drawn; Kevin called it a downtrend: high, low, higher high, then the low broke (clear valley + clear peak, then a lower low). He admits it is 'not the best trend' and a 'weird looking trend' - he would prefer a cleaner one.",
     "Step 2 - draw significant 15m supply and demand zones (two 15m supply zones above, demand below; ignore areas with basing but nothing worth drawing).",
     "Step 3 - multiple sequence analysis: go one timeframe higher than the 15m, i.e. the H4 (the 15m's higher timeframe). H4 supply was in control, so the 15m supply zones become higher odds and the 15m demand (counter-trend) lower odds.",
     "You can still trade any of the zones, but size them by the analysis: e.g. 1% on the with-HTF shorts, 0.25-0.75% on the longs that have no real reason to hold.",
     "Step 4 - drop to the 1m inside the 15m supply: either a set & forget order at a 1m supply zone embedded in the 15m supply, OR wait for the 15m zone to be contacted and look for confirmation (removing 1m demand and trendlines) then short.",
     "Same process on any sequence: for a 5m entry the zone is an H1 zone and you check the daily (the H1's higher timeframe). Three timeframes in total: entry, higher, and curve/bigger-picture.",
     "Recap he gives: 15m downtrend -> shorts higher odds; 15m demand is counter-trend; H4 supply on top -> the 15m supply is '15m confirmation coming off H4 supply'."
    ]
   },
   {
    "heading": "Time of day (Eastern time)",
    "points": [
     "All times he gives are Eastern; convert to your own.",
     "New York session: wake around 8:00 AM, plan and look for trades.",
     "London session: around 1:00-2:00 AM Eastern.",
     "Pick one session and stick to it, based on where you live (he can only day trade the New York hours)."
    ]
   },
   {
    "heading": "News and economic data",
    "points": [
     "Always check economic data and big speakers (the president, Fed chair Jerome Powell) - for day traders this is 'an absolute must'.",
     "Example: price about to hit 15m supply at 8:59 AM with unemployment data at 9:00 AM -> wait. Even if price goes straight to TP, staying out was the better decision.",
     "Spreads widen around news and can stop you out even though price never reached your stop.",
     "Do not day trade the news. Two options: (a) place the order early, betting on a spike into the zone then a drop - 'definitely risky'; or (b) wait for the release and the spike, let spreads calm down, then place the order.",
     "Never predict the news or form your own opinion of it and trade that - many releases are subjective. Even objectively positive news should not sway a valid technical setup: 'If you have your setup in play, take it.'",
     "Trade the charts because zones are objective: a base followed by a sharp drop is objectively supply; a huge push up is not."
    ]
   },
   {
    "heading": "Q&A",
    "points": [
     "Q: What is the higher timeframe for the 15m chart? A: The H4 (not the H1).",
     "Q (trend read): sideways? A: Downtrend - valley, peak, then lower low - though not a clean one."
    ]
   }
  ],
  "rules": [
   "Do a top-down analysis: assess the HTF trend first, then draw zones, then check one timeframe higher (multiple sequence analysis) before looking at the entry timeframe.",
   "Do not day trade the news; wait for the release and for spreads to settle.",
   "Never let news or your opinion of it change a valid technical setup.",
   "Day trading as a beginner only with money you can afford to lose - not 1-2% per trade.",
   "You do not need to take a trade every day."
  ],
  "mistakes": [
   "Jumping into a 1m/5m zone you missed because the candle is about to close.",
   "Believing a 'day trader' must trade every day.",
   "Entering just before a scheduled release - spread spikes can stop you out without price touching the stop.",
   "Predicting news or trading your opinion of it.",
   "Going long on lower timeframes while price is inside a higher-timeframe supply zone.",
   "Using seconds charts (extreme scalping)."
  ],
  "quotes": [
   "Price is fractal - everything works on every timeframe.",
   "Do not day trade the news.",
   "It's not about predicting the news.",
   "If you have your setup in play, take it."
  ],
  "diagrams": [
   {
    "key": "mtf",
    "caption": "Three day-trading sequences: H4 -> 15m, H1 -> 5m, 15m -> 1m, with the curve timeframe above each."
   },
   {
    "key": "sequence",
    "caption": "EUR/USD example: H4 supply in control -> 15m downtrend + 15m supply (higher odds) -> 1m set & forget inside the 15m zone, or confirmation after contact."
   }
  ],
  "checklist": [
   "Have I checked the trend on my higher timeframe (15m / H1 / H4)?",
   "Have I checked one timeframe higher (H4 for a 15m, daily for an H1) for a zone in control?",
   "Is my trade with the higher-timeframe zone in control? If not, have I cut my risk?",
   "Is price inside a Kevin HTF zone that opposes my direction?",
   "Is there economic data or a major speaker in the next few minutes?",
   "Have spreads normalised after any release?",
   "Is this my chosen session?",
   "Can I actually watch this timeframe (1m needs constant screen time)?"
  ],
  "journalTags": [
   "traded into news",
   "spread stop-out",
   "chased missed entry",
   "forced daily trade",
   "against HTF zone",
   "skipped top-down",
   "news opinion trade",
   "outside my session"
  ],
  "newVsPdfs": [
   "Day-trading sequences H4->15m and H1->5m (PDF lists 1m=15m, 5m=H1, 15m=H4 but not his reasoning on screen-time per sequence).",
   "Seconds charts = extreme scalping; 1m is borderline scalping.",
   "Session times in Eastern: NY wake ~8:00 AM, London ~1-2 AM; pick one session.",
   "Spread widening around news can stop you out; two ways to handle a release (pre-placed order = risky, or wait for spike then place).",
   "Do not form opinions on news or let it sway a setup.",
   "Size risk by multiple sequence analysis (e.g. 1% with-HTF, 0.25-0.75% counter).",
   "Learning path day -> swing -> day; risk tiny amounts while learning day trading.",
   "Prefers raising risk per trade (within drawdown) over taking more trades.",
   "Using his shared chart link to avoid day-trading against his HTF zones."
  ]
 },
 {
  "n": 13,
  "title": "High vs low quality zones (webinar)",
  "kind": "webinar",
  "summary": "Kevin argues that zone quality is decided mainly by the higher timeframes, trend and testing history, not by how pretty the zone looks or a score out of 10. He grades the look of a zone simply as good or bad, then lets HTF zones, trend, tests and depth of tests decide whether it is high or low quality, followed by live market Q&A on overextended trends, embedded zones and macro confirmation.",
  "sections": [
   {
    "heading": "Look of the zone: good or bad, not a score",
    "points": [
     "Classic teaching: tight basing + large move away = high quality. He agrees only to an extent - you always want a large move away (the bigger the better) and tight basing is good.",
     "Problem: some groups score zones out of 10 (candle count in the base, 3:1 or 4:1 move away) and only trade 8-10/10 zones. That misses the HTF, the intermediate timeframe and the trend.",
     "He ranks the look of a zone as just good or bad. The range inside 'good' is wide on purpose because the higher timeframes matter more.",
     "Good example: 1-2 candle basing + large move away. A small wick does not matter ('whoopty do').",
     "Bad example: fine basing and initial move away, but a 50% indecision candle in the move away -> bad.",
     "Never-take example: lots of candles and wicks, a candle wicking right back into the zone - 'barely even a zone'. He would not take it even if every HTF zone was in control (even though price reacted off it).",
     "Stair-step basing / big wick = lower quality no matter how many HTF zones stack up (weekly in monthly in six-month). It could still work, but lower odds.",
     "You want clean basing and a clean move away (shape for a CP; similar for a peak & valley zone). Extra messy price action inside the base is not ideal, but you cannot always get perfect zones - trade with the higher timeframes."
    ]
   },
   {
    "heading": "HTF context changes quality without the look changing",
    "points": [
     "A 'bad' H4 demand can become a decent, tradable zone if it sits at weekly demand and removed supply.",
     "Trend: an H4 supply in an H4 downtrend is higher odds; an H4 demand in that downtrend is counter-trend and lower odds even if it is the best-looking demand ever.",
     "That counter-trend H4 demand turns from low quality to high quality if it sits inside a weekly demand zone (captions say 'weekly supply in control' at one point - he clearly means the weekly demand he just drew).",
     "Without the weekly zone, a random counter-trend H4 demand is low quality.",
     "Conversely, a picture-perfect zone (clean move up, tight base, clean move away) becomes much lower odds if higher-timeframe supply sits above it.",
     "Bottom line: what makes a zone high or low quality is basically the higher timeframes in play - you are stacking the odds."
    ]
   },
   {
    "heading": "Tests: how many, and how deep",
    "points": [
     "A weekly DXY demand: nice rally-base-rally, strong move away, good zone on its first test.",
     "After price reacted off it once, twice, three times (almost four), the look has not changed but it is now low quality.",
     "Depth matters: split the zone into 0 / 25 / 50 / 75 / 100% lines. Tests that only went ~25% in make it a 'mid' zone - a deeper pull into it with a decent LTF zone could still be a setup.",
     "If a wick tested it over 75% of the way, 'everything I just said goes out the window'.",
     "Count matters too: 25% deep but tested 3, 4, 5, 6, 7, 8 times is not the same as tested once.",
     "Factors to weigh: how many times tested, how deep, is it fresh, is it just a reaction off a previous zone. He admits much of this is experience rather than a written rule."
    ]
   },
   {
    "heading": "Trading a good zone against a HTF zone",
    "points": [
     "If a great-looking H4 demand sits right under weekly supply: ignore the zone, OR wait for it to be hit and look for extra confirmation.",
     "Price often does give an initial reaction off a LTF zone just before a HTF opposing zone.",
     "If you trade it anyway: day-trading confirmation, take profit at 2:1 instead of 5:1, and half risk - a quick low-risk scalp. He calls that a great plan.",
     "A winning trade with no logic behind it is luck - he would not give it a thumbs up. The logic has to make sense."
    ]
   },
   {
    "heading": "Rules vs subjectivity, and his views",
    "points": [
     "You need a set of rules. His non-negotiables: a daily uptrend AND an H1 uptrend, then he buys pullbacks to demand (mirror for shorts).",
     "The look of zones is where it gets subjective, and some rules cannot be super strict because the market is never exactly the same.",
     "Stick with one teacher (it does not have to be him).",
     "Even retail tools (RSI, support/resistance) would probably work if used only at higher-timeframe zones on the right side; RSI on its own is lagging junk.",
     "Order blocks are just supply and demand renamed; markets move only on supply and demand.",
     "Never start analysis on the entry timeframe if you are new - do top-down first, or a pretty H1 zone will tempt you into ignoring the daily."
    ]
   },
   {
    "heading": "Overextended trends and embedded zones (GBP/JPY, USD/JPY Q&A)",
    "points": [
     "GBP/JPY: weekly, daily, H4 and H1 uptrends - look for longs - but 5 continuation-pattern (rally-base-rally) zones in a row.",
     "Usually after 2-3 CPs you get one final move and then price rolls over back to a deeper zone (not 100% of the time - it could keep going).",
     "When overextended, prefer H1 zones embedded inside an H4 demand. If the H4 demand is just a reaction off another demand, it is lower quality but still an area to look for buys.",
     "Overextended H1 demand: tradable but risk a bit less. Apply full 1-2% only when price pulls back into the daily/deeper demand - the bigger pullback with the trend.",
     "His biggest trades that month were H1 zones embedded inside H4 demand (USD/JPY: fresh H4 demand after an overextended run, H1 zone inside it, 5:1 with no drawdown).",
     "With 5:1 R:R you break even winning roughly 17-18% of the time, so you can take the nearer zone and still wait for the deeper one if it fails.",
     "Rather wait for a deeper zone than chase price and lose."
    ]
   },
   {
    "heading": "Macro confirmation (EUR/USD Q&A) and other markets",
    "points": [
     "EUR/USD: three-month supply in control and a three-month downtrend; one-month supply too, six-month demand also somewhat in control - 'tricky', but shorts only.",
     "A daily supply under the three-month supply is itself a confirmation zone - a daily chart can be a confirmation trade - so keep looking for shorts on lower timeframes.",
     "If that daily zone breaks, that is fine - then look for longs, even with three-month supply in control.",
     "Ways in: set & forget at the H1 supply above ('very risky'), or confirmation: H1 demand removed, leaving H1 supply.",
     "Longs off the H4 demand would be low odds against three-month and daily supply.",
     "Natural gas: wait for daily supply to be removed, then look for H1 confirmation inside the daily demand.",
     "USD/CHF: no weekly or daily zone in control -> not trading it. Oil: sideways -> not interested."
    ]
   },
   {
    "heading": "Psychology, strategy and testing",
    "points": [
     "Trading is about 50% strategy and 50% applying it time and time again without changing it - not '90% emotions'.",
     "You must be able to take zone 1 (loss), zone 2 (loss), zone 3 (win). At 5:1: -1%, -1%, +5% = +3%.",
     "Do not cherry-pick between equally valid zones out of fear of missing out.",
     "He wants to move stops to breakeven quicker - e.g. a trade that went almost 3:1 before stopping him out should have been at BE.",
     "Build your own strategy from his: you might use his H4 zones with a different HTF or only 1:1 targets - but 1:1 needs very high accuracy; it all depends on your testing.",
     "Backtest with the replay tool and his tracked zones; tracking zones = tracking the story.",
     "Build a relationship with a few markets; day traders should stick to a couple of pairs (e.g. two pairs plus oil). Swing traders can follow more because stories are easier to remember.",
     "Swing trading on the H1 is 'the perfect mix' - decent setups without the stress.",
     "Patience: his results improved drastically when he stopped thinking he must trade every day."
    ]
   }
  ],
  "rules": [
   "Higher timeframes in play decide quality more than the look of the zone.",
   "Always want a large move away; tight basing is a plus.",
   "Do not take a very low quality (wicky, barely-a-zone) zone no matter what the HTF says.",
   "A zone tested over 75% of the way is out.",
   "His non-negotiable: daily uptrend + H1 uptrend before buying pullbacks to demand.",
   "Do top-down analysis first; do not start on the entry timeframe as a new trader.",
   "Every trade needs logic you can explain."
  ],
  "mistakes": [
   "Trading a zone because it looks like a 10/10 while ignoring HTF, trend and intermediate timeframe.",
   "Counting basing candles from a rule book as the whole system.",
   "Buying a beautiful demand zone right under weekly supply with full risk and full target.",
   "Treating a zone tested many times (or deeply) as fresh.",
   "Taking a zone with a 50% indecision candle in the move away.",
   "Buying overextended trends after 4-5 CPs with full risk.",
   "Chasing price instead of waiting for the deeper zone.",
   "Claiming a lucky win as a good trade without logic.",
   "Changing the strategy after two losses / cherry-picking zones."
  ],
  "quotes": [
   "The quality of the zone changed without the look of the zone changing.",
   "It's all about the higher timeframes.",
   "You got lucky in my opinion.",
   "I would rather wait for that than chase price and lose."
  ],
  "diagrams": [
   {
    "key": "quality",
    "caption": "Same H4 demand: low quality alone and counter-trend, high quality when inside weekly demand; picture-perfect zone made low odds by HTF supply above."
   },
   {
    "key": "zone-anatomy",
    "caption": "Zone split into 25/50/75/100% test-depth lines: tested ~25% = mid, tested past 75% = out."
   },
   {
    "key": "mtf",
    "caption": "Overextended trend after several CPs: H1 zone embedded inside H4 demand on the pullback."
   }
  ],
  "checklist": [
   "Is the look of the zone at least 'good' (clean base, large move away, no indecision candle in the move away)?",
   "Is the zone free of messy stair-step basing and wicks back into the zone?",
   "Is there a higher-timeframe zone supporting my direction?",
   "Is there a higher-timeframe opposing zone right above/below? If so, am I using half risk, ~2:1 TP and confirmation - or skipping it?",
   "Is the zone with the trend?",
   "How many times has the zone been tested, and how deep (under 25%? over 75%)?",
   "Is the zone fresh, or just a reaction off a previous zone?",
   "Is the market overextended (several CPs in a row)? If so, am I reducing risk or waiting for an embedded zone in a deeper HTF zone?",
   "Can I explain the logic of this trade?"
  ],
  "journalTags": [
   "traded the look only",
   "against HTF zone",
   "counter-trend zone",
   "zone tested multiple times",
   "zone tested over 75%",
   "indecision in move away",
   "stair-step basing",
   "overextended trend",
   "chased price",
   "no trade logic"
  ],
  "newVsPdfs": [
   "Rejects scoring zones out of 10; grades the look as only good or bad.",
   "A 50% indecision candle in the move away makes a zone bad.",
   "Stair-step basing = lower quality regardless of HTF stacking.",
   "Test-depth grid 0/25/50/75/100%: ~25% tested = mid quality, over 75% = out; number of tests also counts.",
   "Good zone under opposing HTF zone: half risk, TP 2:1 instead of 5:1, day-trading confirmation.",
   "After 2-3 continuation patterns, expect one final move then a roll-over; reduce risk when overextended, full risk at the deeper daily zone.",
   "Embedded H1 zones inside H4 demand as his best trades.",
   "A daily zone under a three-month zone counts as a confirmation zone.",
   "His non-negotiable: daily uptrend + H1 uptrend before buying pullbacks.",
   "Trading is ~50% strategy / 50% consistent execution; -1, -1, +5 = +3% example.",
   "Wants to move to breakeven sooner (e.g. near 3:1).",
   "Order blocks = S&D renamed; indicators only work at HTF zones."
  ]
 },
 {
  "n": 14,
  "title": "Trendline Tips",
  "kind": "video",
  "summary": "A short chart walkthrough of how Kevin draws a trendline: it needs a higher high (or lower low) and an obvious peak and valley, and it must be adjusted when it cuts through candles after a new high. He also separates trendlines from momentum lines and explains when a wick is not enough to count as a new valley.",
  "sections": [
   {
    "heading": "What a trendline needs",
    "points": [
     "A higher high is required (lower low for a downtrend). The high must be broken after the peak.",
     "If price rallies from the valley and just barely misses the previous high, then drops, you cannot draw a trendline - no higher high.",
     "The higher high is only one requirement - 'there's many other things'."
    ]
   },
   {
    "heading": "Obvious peak and obvious valley",
    "points": [
     "The trendline anchors to an obvious peak and an obvious valley, with a clear distance between them.",
     "A shallow dip that is 'not really that obvious' is not a valley.",
     "Price stepping up with small shallow pullbacks is a momentum line, not a trendline - technically price went up and down, but it is not deep enough."
    ]
   },
   {
    "heading": "Adjusting the trendline",
    "points": [
     "A first trendline can be drawn from the valley once the high is broken.",
     "If the line cuts through candles, that is fine at first - until price makes another new high.",
     "Once a new high is made and the line cuts through candles, re-anchor it so it no longer cuts through candles. The two touch points on his chart are then the adjusted ones, not the original ones - this is why members get confused by his lines.",
     "If price cuts through candles again, the trendline is removed and must be updated."
    ]
   },
   {
    "heading": "Wicks vs real valleys",
    "points": [
     "He does not like calling a single wick a new low / peak-and-valley.",
     "If there were real price action down there (several candles forming a clear new valley and new peak), draw the new trendline from the most recent valley.",
     "If it is just a 'weird wick' without real price action, simply adjust the existing line instead of starting a new one."
    ]
   },
   {
    "heading": "Nuance",
    "points": [
     "Trendlines are 'not the easiest thing ever' - there are rules and nuance; the Sunday meetings cover them in more depth."
    ]
   }
  ],
  "rules": [
   "No higher high (or lower low) = no trendline.",
   "Anchor only to an obvious peak and an obvious valley.",
   "A trendline must not cut through candles once a new high is made - adjust it.",
   "A lone wick is not a new valley; adjust the line rather than draw a new one."
  ],
  "mistakes": [
   "Drawing a trendline when price narrowly missed the previous high.",
   "Treating a momentum line (shallow step-ups) as a trendline.",
   "Anchoring to an unobvious dip.",
   "Leaving a trendline that cuts through candles after a new high.",
   "Treating a single wick as a new valley."
  ],
  "quotes": [
   "This is a momentum line.",
   "It's not the easiest thing ever. There are some rules to it and there is some nuance to it as well."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Valid trendline: obvious valley, obvious peak, higher high; versus a momentum line of shallow step-ups; and re-anchoring after the line cuts through candles."
   }
  ],
  "checklist": [
   "Did price make a higher high (or lower low) past the peak?",
   "Are both the peak and the valley obvious?",
   "Is this a real trendline, not a momentum line?",
   "Does my line cut through any candles after the latest new high?",
   "Is my latest 'valley' real price action, or just a wick?"
  ],
  "journalTags": [
   "momentum line not trendline",
   "no higher high",
   "trendline cuts candles",
   "wick used as valley"
  ],
  "newVsPdfs": [
   "Trendline needs an obvious peak and obvious valley with real depth; the PDFs only say 'blatantly obvious trendline'.",
   "Momentum line vs trendline distinction.",
   "Re-anchor the line once it cuts through candles after a new high; cutting through again removes it.",
   "A lone wick is not a new valley - adjust instead of redrawing from it."
  ]
 },
 {
  "n": 15,
  "title": "Confirmation Trading",
  "kind": "webinar",
  "summary": "Confirmation trading means waiting for price to contact a higher-timeframe zone, then dropping to the entry timeframe and waiting for opposing zones and/or a trendline to be removed before entering on a pullback (or a breakout). He covers the two entry methods, which timeframe pairs to use, when confirmation is worth it (counter-trend, around trendlines, large or doubtful zones, overextended price), plus Q&A on wick removal, stacked zones, targets, adding to winners and homework reviews.",
  "sections": [
   {
    "heading": "What confirmation trading is",
    "points": [
     "Mark the HTF zone first (his example: H1 demand). Then go to the entry timeframe (example: 5m) and wait.",
     "Step 1: price must come down and contact the HTF zone.",
     "Step 2: on the entry timeframe, look for opposing zones to be removed - e.g. a new demand zone that removes the opposing supply zones above it. That removal is the confirmation.",
     "Removing a downward trendline also counts as confirmation (see trendline section).",
     "He uses 'HTF' as shorthand for higher timeframe on his charts."
    ]
   },
   {
    "heading": "The two confirmation entry methods",
    "points": [
     "Pullback method (his personal choice): after the zone(s)/trendline are removed, wait for price to pull back to the new entry-timeframe demand and buy there with a limit order.",
     "Breakout method: if there is a clear basing structure that looks like demand on the way up, place a buy order above the supply zone (trade the breakout), stop below that basing structure. Needs a proper zone/structure to put the stop under.",
     "Why breakout exists: sometimes price pushes up, confirms, only makes a minor pullback and runs to TP without filling the pullback order.",
     "No free lunch: in his example to the same target (1.206) the breakout gave roughly 1.5R while the pullback gave roughly 10R.",
     "Trade-off in his opinion: pullback = bigger R:R, tighter stop, stopped out more, lower win rate; breakout = higher win rate, smaller R:R. Test which fits your personality.",
     "He is fine losing more trades than he wins and still being profitable - that is why he uses the pullback method.",
     "These are the only two confirmation methods he knows. He does not use candlestick patterns (hammers etc.) and will not teach what he does not know."
    ]
   },
   {
    "heading": "Which timeframes to use",
    "points": [
     "First decide the timeframe you want to trade and the one you enter on - it must fit your personality AND your schedule.",
     "1m entries = checking charts constantly, high stress. 1H entries = less stress, fewer trades. 4H/daily = a lot of patience.",
     "His own plan: enters on the 1H inside daily zones. When he does enter on a 4H he refines into a 1H.",
     "Example pairing: 5m entry with 1H as the HTF. The chart is a guide, not 'the Bible' - you can switch it up (e.g. 5m confirmation in a 4H zone), but expect more losses.",
     "Extreme example: 1m confirmation in a daily zone = a ton of losses, but huge R:R. If you refine that far you must hold as long as possible, ideally to the next opposing daily zone (20:1-type trades are possible).",
     "Rule of thumb from him: the lower your refinement vs the zone timeframe, the higher your R:R needs to be.",
     "He would not go 1m all the way to daily (too risky). 1m to 1H is fine; 1m to 4H is more risky but doable.",
     "'Lower timeframe' is relative: the entry timeframe can be a daily or 4H chart. A daily zone inside a 6-month/weekly demand is itself daily confirmation.",
     "He offered to help members pick timeframes by private message; a trading-plan-by-schedule Zoom session exists that he plans to repost."
    ]
   },
   {
    "heading": "When to use confirmation",
    "points": [
     "You can always use confirmation, never use it, or use it sometimes - no right or wrong; it depends on your testing. He trades both S&F and confirmation.",
     "First question before a 1H trade: what is the HTF of the 1H? The daily. Check the daily trend.",
     "HTF trend up (clear highs, obvious trendline) = longs are the highest-odds thing; a 1H demand pullback there is a valid set & forget.",
     "Overextended price: does not mean it will drop, but if you hesitate you can wait for confirmation instead of S&F.",
     "Counter-trend (relative to your HTF) = confirmation is best used / recommended. Example: weekly supply against a strong daily uptrend on GBP - look for extra confirmation on the 4H.",
     "With the HTF trend: confirmation is not needed as much; a 1H demand inside daily demand in a daily uptrend can be a S&F.",
     "Zone sitting around a trendline: confirmation is always best because of stop hunts that happen around trendlines.",
     "Zone too large (e.g. natural gas daily zone inside macro demand): refine the entry with confirmation instead of taking the whole zone.",
     "If you do not trust the zone, it looks questionable, or the ITF trend is down but multiple sequence analysis says that downtrend may be ending (e.g. 4H supply under 6-month demand in control) - only take a confirmation trade off it.",
     "He was taught that counter-trend trades need confirmation on the intermediate timeframe (e.g. 4H). His view now: with a proper, tested R:R you don't really need that."
    ]
   },
   {
    "heading": "Trendline confirmation",
    "points": [
     "The ultimate confirmation: a supply zone AND a downward trendline both removed. Even better if there is another supply zone also removed.",
     "If price breaks the downward trendline but respects (does not remove) the supply zone, a quality demand zone that meets your criteria is still a trade in his opinion - but it is a WEAKER confirmation (trend went from down to sideways).",
     "He has no math on that case. Ideas to test: risk less (half or a quarter of a percent) or keep 1% but take profit earlier.",
     "No two profitable S&D traders trade exactly the same - test your own strategy and management."
    ]
   },
   {
    "heading": "Q&A: is a zone removed by a wick?",
    "points": [
     "A small body with a huge wick through the zone = he does NOT call it removed; it looks like an emotional wick.",
     "A big body with a proportionately large wick = he would probably call it removed.",
     "Best case: a normal-looking candle with a normal wick closing through - that is clearly removed.",
     "The wick should be proportionate to the body. He admits this is pattern recognition, hard to explain exactly."
    ]
   },
   {
    "heading": "Q&A: stacked zones (level on top of level)",
    "points": [
     "After a removal you may get two or three demand zones stacked (e.g. basing before the big move AND the origin of the whole move lower down).",
     "He has no data on which works more often; from experience it feels close to 50/50.",
     "Options: test which one to take; take the extreme one only and accept missing fills; or take all of them and trust the R:R.",
     "Natural gas reel example: he took all three zones, only the bottom one worked, and he still made a lot because of R:R.",
     "With three zones he would probably take all three, or the top or bottom one, and ignore the middle one.",
     "He prefers to take all and leave the emotional decision out, as long as the R:R makes sense. If the far TP is only justified from the extreme zone, take only the extreme one and accept missed trades."
    ]
   },
   {
    "heading": "Targets and trade management",
    "points": [
     "Targets: opposing zones; also notice selling areas (bearish candles/basing that are not supply) for a first TP, then the high.",
     "After a sharp move it is hard to place a target based on a zone - you can bump the stop instead.",
     "What he does now: set a 5:1 TP, then adapt per trade. If stop is at breakeven, price breaks supply and a new demand forms before 5:1, he may remove the TP (set it far away) and trail the stop below each new zone.",
     "If price runs in one big candle with nothing to put a stop under, he just lets the 5:1 TP get hit.",
     "Trading rules matter, but not every trade goes exactly to plan - each situation is a bit different."
    ]
   },
   {
    "heading": "Adding to a winner (Q&A)",
    "points": [
     "His plan: S&F trades and confirmation trades, generally inside daily zones.",
     "Example: take a 1H S&F in a daily demand; price breaks supply and forms new demand. He moves the S&F stop to below the new demand and takes a confirmation trade there with its stop in the same place. Result: likely around breakeven, or two big winners targeting the opposing daily supply.",
     "He only adds if there is a clean new zone that meets his criteria. Sometimes he will not add if he does not think price is going all the way (does not want two positions).",
     "Journal: he logs these as TWO separate trades. A split-risk trade across two pairs (e.g. EURJPY and ZARJPY shorts) is logged as ONE trade."
    ]
   },
   {
    "heading": "Testing, data, confidence and homework",
    "points": [
     "Test everything: backtest, paper trade, or live trade risking a super small amount. Without testing you won't trust your R:R.",
     "He is collecting data to see which setup is more profitable; e.g. if S&F made 6% and confirmation 2% in a year, he might risk 2% on S&F and keep confirmation risk the same. Increase risk on the more profitable strategy.",
     "Nobody has it all figured out; keep improving.",
     "Multiple sequence analysis finds the best HTF zones for confirmation: e.g. 6-month demand -> daily confirmation -> 1H confirmation inside the daily. Stacking this way raises odds AND confidence (fixes hesitation to pull the trigger).",
     "When he only used 15m inside 4H zones he was around breakeven; opening up to higher timeframes changed that.",
     "Homework (MSA): daily supply -> 1H supply -> 5m supply at the extreme gave ~10:1+; refining that deep requires a bigger target (opposing zone) or moving stops.",
     "Homework (zone drawing): he would draw the supply using the wick to leave a little space; supply's move away should be fast candles. 50% candle indicators make basing more obvious.",
     "Homework (trend trading): weekly demand with 4H confirmation in a weekly uptrend = tradable, with the trend.",
     "Homework (GBPUSD daily/1H): valid with the trend only if the pullback comes before price reaches/breaks the trendline; if it takes a long time and breaks the trendline it is no longer a trend trade and he would ignore the zone."
    ]
   }
  ],
  "rules": [
   "Price must contact the HTF zone before you look for confirmation on the entry timeframe.",
   "Confirmation = an opposing zone and/or opposing trendline removed on the entry timeframe.",
   "Breakout method only with a proper basing structure to put the stop under.",
   "The deeper you refine below the zone timeframe, the bigger the R:R target must be (hold toward the opposing HTF zone).",
   "Use confirmation for counter-trend trades, zones around trendlines, oversized zones and zones you don't trust.",
   "Only add to a trade on a clean new zone that meets your criteria.",
   "Test everything before trusting your R:R."
  ],
  "mistakes": [
   "Calling a zone removed by a huge emotional wick with a small body.",
   "Refining to a very low timeframe and then taking a small target.",
   "Going from 1m straight to daily zones (too far).",
   "Picking timeframes that don't fit your schedule (1m entries without screen time).",
   "Not accepting missed trades when waiting for confirmation or taking only the extreme zone.",
   "Trading counter-trend zones without confirmation.",
   "Not testing - then not trusting your R:R and hesitating to pull the trigger."
  ],
  "quotes": [
   "Remember, there's no free lunch.",
   "Confirmation is best used when trading counter trend.",
   "Price action is price action.",
   "If you ever meet a trader that says I've got it all figured out, they're probably full of it."
  ],
  "diagrams": [
   {
    "key": "confirmation",
    "caption": "H1 demand contacted; on the 5m a new demand removes opposing supply (and a downtrend line); pullback limit entry vs breakout buy-stop above supply with stop under the basing."
   },
   {
    "key": "mtf",
    "caption": "Relative timeframes: 6-month demand -> daily zone (daily confirmation) -> 1H zone (1H confirmation); refining deeper needs bigger targets."
   },
   {
    "key": "zone-removed",
    "caption": "Small body + huge emotional wick = not removed; big body with proportionate wick or normal candle close = removed."
   }
  ],
  "checklist": [
   "Has price actually contacted the HTF zone?",
   "Has an opposing zone and/or trendline been removed on the entry timeframe?",
   "Was the removal a real candle (not just an emotional wick)?",
   "Is this trade counter to the HTF trend? If yes, am I waiting for confirmation?",
   "Is the zone near a trendline, oversized or doubtful? If yes, am I using confirmation?",
   "Does my timeframe pair fit my schedule, and is it not too far apart (e.g. not 1m into daily)?",
   "If refining very deep, is my target toward the opposing HTF zone?",
   "Pullback or breakout - is there a basing structure for the breakout stop?",
   "If adding on, is the new zone clean and does it meet my criteria?"
  ],
  "journalTags": [
   "no HTF contact",
   "wick-only removal",
   "counter-trend no confirmation",
   "zone at trendline",
   "refined too deep",
   "small target on deep refine",
   "breakout entry",
   "missed pullback fill",
   "middle stacked zone",
   "added on weak zone",
   "weak confirmation (trendline only)"
  ],
  "newVsPdfs": [
   "Pullback vs breakout trade-off with numbers (~1.5R vs ~10R to the same target) and his view on win rate.",
   "Lower refinement = higher R:R needed; 1m-to-daily too far, 1m-to-1H fine, 1m-to-4H risky but doable.",
   "When to use confirmation: counter-trend, around trendlines (stop hunts), oversized zones, overextended price, zones you don't trust.",
   "Taught to confirm counter-trend on the intermediate timeframe - he says with tested R:R it is not needed.",
   "Wick-vs-body rule for deciding whether a zone is removed.",
   "Trendline broken but supply respected = weaker confirmation; consider smaller risk or earlier TP.",
   "Stacked zones: no data, ~50/50, take all / extreme only / skip the middle one.",
   "His 5:1 default TP, then removing TP and trailing below new zones.",
   "Adding to a S&F with a confirmation trade; journaling as two trades vs split-risk as one.",
   "Increase risk on whichever setup your data shows is more profitable.",
   "'Lower timeframe' is relative - a daily zone can itself be confirmation off a 6-month zone."
  ]
 },
 {
  "n": 16,
  "title": "Supply and Demand Trading",
  "kind": "webinar",
  "summary": "A Sunday session on what is and is NOT a supply and demand zone: everything on a chart is supply and demand, but zone trading needs structure - basing, a strong move away, and proximal/distal lines drawn from the wicks, marked before the fact. He also explains why he avoids zones that sit on trendlines or old support/resistance (trading against retail, explained with poker), and rants on testing, journaling, drawdowns and fake gurus.",
  "sections": [
   {
    "heading": "Supply and demand vs supply and demand ZONE trading",
    "points": [
     "Essentially everything is supply and demand (a green candle is demand, a red one supply) - but that is not a zone.",
     "He trades supply and demand ZONES; pointing at 'supply up here, demand down here' is not the methodology.",
     "A real zone has structure: rally-base-drop (supply) or drop-base-rally (demand), a large quick move away, and a specific start point.",
     "Every zone is basing plus a move up (demand) or move down (supply); wrap the lines around the basing, extend them, and wait for the pullback to go long/short.",
     "Every zone pretty much needs a strong move away. Zones with a weak move away exist (e.g. one that removed a downtrend line) but he would not feel comfortable trading them.",
     "He credits the methodology to Sam Seiden; his entry/strategy is his own. ICT/SMC/order blocks/FVGs are rehashed supply and demand in his view."
    ]
   },
   {
    "heading": "How to draw it correctly",
    "points": [
     "Demand: distal line at the lowest wick of the basing (the low of price) - not a random wick. Proximal at the top of the basing.",
     "Exception: if the low wick is huge/emotional you can ignore it and use the body low instead.",
     "Never cut through candles; use the wicks/price to draw.",
     "Some subjectivity is fine: tighter zone = better R:R but you may not get filled; wider = filled more but less R:R.",
     "Use TradingView's magnet tool by holding Ctrl (instead of leaving it always on, which snaps to everything) so lines grab the exact wick. Price often holds a zone to the pip.",
     "When he marks a zone as removed he doesn't bother drawing it precisely."
    ]
   },
   {
    "heading": "What is NOT a zone (red flags)",
    "points": [
     "Zones that start at a random place with no basing or move away - test: black out price to the right of where the zone starts; if there's no reason for it, it was drawn after the fact.",
     "Zones drawn because price reacted several times at an area = support/resistance, not supply and demand.",
     "A big general area with no obvious tight zone is basically just a zone on a higher timeframe.",
     "If price clearly breaks a zone, it's gone - don't keep trading it as 'supply'. With a real zone your order, stop and TP were already in place; if broken you take the loss and move on.",
     "Support/resistance is a retail strategy, and most retail traders are not winning traders."
    ]
   },
   {
    "heading": "Analysis must be done before the fact",
    "points": [
     "Your zone should already be on the chart before price reacts; that is how you get an entry, stop and TP.",
     "He sometimes draws a zone after the fact (missed it), but it would have been objectively the same zone.",
     "Be cautious of people who point out zones after the fact - it looks great but they couldn't have called it beforehand."
    ]
   },
   {
    "heading": "Avoid zones on trendlines and old S/R (trade against retail)",
    "points": [
     "Q: why not take a zone that sits right at a trendline? Trendline trading is a very popular retail strategy; around trendlines he sees whippy price action and stop runs ('liquidity search').",
     "It's okay if trading with the trend and the R:R is good - he would take it if decent - but it's something he watches for.",
     "Once price breaks a trendline, zones become lower odds because the trend has officially changed.",
     "A demand zone right at an obvious old high ('old resistance becomes new support') is also a S/R trade. Retail stops sit just below that level, so he'd rather take the zone below it.",
     "Obvious repeatedly-tested areas just before supply are like a trap setup: stops sit there and fuel the real zone.",
     "Only two times he looks for 'retail things': around S/R areas and around trendlines.",
     "He noticed the trendline issue himself after being stopped out several times - nobody taught him.",
     "Goal: trade with the banks and against retail; retail traders are who pay us."
    ]
   },
   {
    "heading": "Poker analogy: exploitative play",
    "points": [
     "GTO poker = fixed system; exploitative poker = read the opponent and adjust.",
     "He plays exploitatively: tight player re-raises -> respect it; loose aggressive player -> slow down and let him hang himself.",
     "In trading, the opponent is retail. Adjust your normal setup when it sits where retail trades (trendlines, S/R)."
    ]
   },
   {
    "heading": "Testing, journal and drawdowns",
    "points": [
     "Learn what he knows, then build your own system with your own R:R, risk tolerance and win rate through testing.",
     "Once you have a system that works, stick to it for at least six months, even through a drawdown.",
     "His Excel journal: his five setups with wins, losses, breakevens, half wins and half losses per setup, max drawdown and max winning streak (tracked back to January). No screenshots yet.",
     "Knowing max drawdown means three losses in a row is nothing - he can check the journal and see it's normal.",
     "With 3:1, breakeven win rate is 25%; that can mean six losers in a row - anything is possible (like 20 heads in a row).",
     "Play out a month on a calculator (e.g. five losses then two winners) so you understand what your system can look like.",
     "A system with 10R+ will hit those trades every now and then - that's probability, not gambling.",
     "He backtested a 1:1 system on 1m EURUSD for a week (+2%), but low R:R strategies bother him.",
     "If your setup says take the trade, take it even if price looks overextended - price has looked overextended many times before.",
     "One weekend of testing, focused on trend and old S/R, changed his trading forever. Test on weekends."
    ]
   },
   {
    "heading": "Mindset and gurus",
    "points": [
     "Anyone is a genius in a bull market; there are always trades in any trend if you know what to look for.",
     "P&L screenshots and withdrawals can be faked; judge mentors by their timestamped forecasts (e.g. YouTube) compared to the charts.",
     "The membership doesn't hand out exact entries/stops/TPs - it's for learning.",
     "Post your trades in the trade review channel.",
     "Stacking odds: trade with the trend and inside higher-timeframe zones."
    ]
   }
  ],
  "rules": [
   "A zone needs basing plus a strong move away; no structure = no zone.",
   "Draw from the wicks (distal at the extreme wick of the basing); never cut through candles.",
   "Draw zones before the fact - not because price reacted there.",
   "If a zone is clearly broken, take the loss and move on; don't keep trading it.",
   "Be cautious of zones sitting on trendlines or obvious old S/R; prefer the zone below/beyond where retail stops sit.",
   "Once you have a working system, stick with it for at least six months."
  ],
  "mistakes": [
   "Drawing zones from areas price reacted to several times (that's S/R).",
   "Starting a zone at a random point with no basing.",
   "Ignoring a normal-size wick when setting the distal line.",
   "Trading a zone that has been clearly broken.",
   "Analysing after the fact.",
   "Buying a demand zone right on a trendline or on 'old resistance becomes new support'.",
   "Not knowing your win rate, R:R and max drawdown, so losing streaks shake you.",
   "Skipping a valid setup because price 'looks overextended'."
  ],
  "quotes": [
   "There's supply and demand, and then there's supply and demand zone trading.",
   "We don't cut through a candle.",
   "We want to trade with the banks and against retail.",
   "Anybody is a genius in a bull market."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Drop-base-rally demand: basing, strong move away, distal at the lowest basing wick, proximal at the top of the basing - contrasted with a random 'area' box drawn after the fact."
   },
   {
    "key": "draw",
    "caption": "Correct distal on the extreme wick vs a line cutting through candles; ignore only a huge emotional wick."
   },
   {
    "key": "trendline",
    "caption": "Demand zone sitting on a trendline / old high (old resistance = new support) with retail stops just below; preferred zone is the one below."
   }
  ],
  "checklist": [
   "Does the zone have clear basing and a strong move away?",
   "Is the distal line on the extreme wick (no cut-through candles)?",
   "Was the zone identifiable before price reacted to it?",
   "Is this zone just an area of repeated reactions (S/R)?",
   "Has the zone already been clearly broken?",
   "Does the zone sit on a trendline or an obvious old high/low?",
   "If on a trendline, am I trading with the trend and is R:R good?",
   "Do I know my win rate, R:R and max drawdown for this setup?"
  ],
  "journalTags": [
   "no basing",
   "weak move away",
   "drawn after the fact",
   "S/R not zone",
   "cut through candles",
   "zone already broken",
   "zone on trendline",
   "old S/R level",
   "skipped (looked overextended)"
  ],
  "newVsPdfs": [
   "Black-out test: hide price to the right of a zone's start - if no reason for it, it was drawn after the fact.",
   "A large vague area = basically a higher-timeframe zone.",
   "TradingView magnet tool via Ctrl for exact wick placement.",
   "Avoid demand right at a trendline (retail stop hunts) - he found this himself after repeated stop-outs.",
   "Avoid demand right at an obvious old high (old resistance = new support); take the zone below where retail stops are.",
   "Zones become lower odds after price breaks the trendline (trend changed).",
   "Poker GTO vs exploitative analogy for trading against retail.",
   "Stick with a working system for at least six months; his journal fields (5 setups, half wins/losses, max drawdown, max win streak).",
   "Judge mentors by timestamped forecasts, not P&L screenshots."
  ]
 },
 {
  "n": 17,
  "title": "Discipline & Sticking to Your Trading Plan",
  "kind": "podcast",
  "summary": "An informal garage podcast recorded on 12 July, after a breakeven trade and two losses in a row just after he raised his risk. He uses his own stats and his new gym habit to argue that trading is mostly discipline: stick to the plan, keep losses short-lived emotionally, and trust R:R over win rate.",
  "sections": [
   {
    "heading": "The week's trades (what happened)",
    "points": [
     "USDJPY: H1 set & forget trade inside a daily demand zone (one of his typical setups). It went his way almost immediately with basically no drawdown.",
     "It reached a little over 2:1. His targets are much larger than that, so he moved the stop to breakeven. Price pulled back and stopped him at BE (a tiny profit from overnight swap, so call it breakeven).",
     "USDCAD: set & forget on a daily confirmation. It is on the riskier side of his plan, so it was a half-risk setup. It lost, so he lost half a unit.",
     "EURGBP: a standard setup for him, so full risk. It was also stopped out.",
     "Result: BE, then two losses in a row, right after he increased his risk. He says it felt like being punched in the face and then stabbed."
    ]
   },
   {
    "heading": "Why the BE trade was a win for his process",
    "points": [
     "A month or so earlier he would not have moved to BE on that trade. It would probably have been a half or a full loss.",
     "By observing his own trades and thinking critically, he concluded that in that specific situation it is best to move the stop to BE after about a 2:1 move, because when price pulls back from there it very rarely goes his way.",
     "The positive takeaway is that he stuck to the plan. If emotion had made him think 'it will react a second time' and leave the stop where it was, that would have been breaking his plan.",
     "Even with no money made, sticking to the plan is the important thing."
    ]
   },
   {
    "heading": "His current plan tweaks",
    "points": [
     "Over the last month he tweaked his strategy to take only H1 zones. If he wants a H4 zone, he refines it to an H1 zone.",
     "He added more trending trades. This worked well for him in June.",
     "His plan has two risk tiers: full-risk setups (standard) and half-risk setups (riskier, e.g. the USDCAD daily confirmation set & forget).",
     "Swap fees can eat a lot of profit when you hold for a long time. That is part of why he now enters on H1. He has also been experimenting with his take profit, so his June winners were not 10:1."
    ]
   },
   {
    "heading": "Pre-committing a risk increase",
    "points": [
     "Before 1 June he wrote in his P&L spreadsheet/journal: if June is profitable, he will increase his risk to full risk. June was profitable, so he increased risk in July.",
     "His notes say 'Risk increase'. He still risks only half on the one riskier setup.",
     "He also wrote 'Expect big drawdown, do not get discouraged', because he knew losers would hit bigger after the increase.",
     "His P&L journal is broken down by month, by quarter and by half-year. He was half expecting the next quarter to be a losing quarter after the risk increase, unless a couple of winners came early."
    ]
   },
   {
    "heading": "His stats: losing more than winning and still profitable",
    "points": [
     "June: +0.89% (almost 1%) while not even risking 1% per trade. He says you could roughly double it to get a 'true' return, then says 1.6% to 1.9% at 1% risk (an off-the-cuff estimate).",
     "June record: 4 wins, 11 losses, 1 breakeven. He corrects it to probably 4 wins, 10 losses, 1 BE, because two trades where he split the risk (on AUDJPY and a EURJPY trade, both yen) were logged separately. He is unsure of the details.",
     "July so far: 3 losses and 1 BE (4 trades counting the split-risk pair).",
     "He tracks max drawdown as losing trades in a row. His current max is 6 in a row, and June had 4 losses in a row. He still had a profitable year so far.",
     "He loses more than he wins and is still profitable. Average people think that is delusional, but it works if you have the discipline.",
     "Not every strategy has more losers than winners. This is just his system."
    ]
   },
   {
    "heading": "Handling the emotions of losses",
    "points": [
     "It is basically impossible to feel nothing. Winning brings joy, and losing brings anger, sadness or defeat. That is normal and human.",
     "The key factor is how long you feel it. A few minutes is fine. Then get straight back to your discipline and look for the next setup.",
     "His scale: after one loss you should feel basically nothing. After two in a row: 'damn'. After three: 'does this even work?'. Then remind yourself that you know your system and your R:R, and it will be fine long term.",
     "Take your losses like an adult. Understand the maths and the probabilities, and keep taking the next trade.",
     "It gets easier every month."
    ]
   },
   {
    "heading": "The old mistake: tweaking after every losing streak",
    "points": [
     "He used to lose two or three in a row and immediately decide the system did not work ('trading is a scam'), then tweak something.",
     "He would blame things like a bad approach to the zone and go hunting for a pattern behind every loss. Back then he was around breakeven, losing small or winning a little.",
     "Identifying patterns IS necessary. That is how he found the move-to-BE-after-2:1 rule.",
     "But once you have seen the strategy work and know the system works, you must trust the overall R:R and the probabilities and take the next trade."
    ]
   },
   {
    "heading": "Discipline outside trading",
    "points": [
     "He started weight training on 13 June (one month before recording). The goal is not to be a frail old man and to keep a sharp mind.",
     "In the past he always quit working out after a week or two. This time he has stuck to it.",
     "Seeing results from trading discipline helped him stick to the gym, and the gym discipline now helps his trading. He feels more clear-minded.",
     "His suggestion: changing something in your actual life to build discipline can help your trading."
    ]
   },
   {
    "heading": "More from the lesson: Context and extra details from the week",
    "points": [
     "Start of a new month: he took no trades at first, then several setups showed up at once. The USDJPY trade was posted in the Discord group.",
     "On USDJPY his stop went to breakeven almost immediately because the trade had basically no drawdown. He says a no-drawdown trade feels like hype, and it is a bummer to watch that return pull back, but 'not that big of a deal... onto the next one'.",
     "Why he wanted the first trade after the risk increase to win: a winner first would mean any following losses are only a drawdown from profit, not a true drawdown.",
     "After the two losses he went back to his journal notes and re-read his own 'do not get discouraged' note. He says reading it is what you have to do in that moment.",
     "The analogy in full: running down the street for a free ice-cream truck (the USDJPY trade going great), getting punched in the face (stopped at BE), getting up and walking away, then getting stabbed (two losses in a row after raising risk). He says it no longer really feels like that, because of his discipline."
    ]
   },
   {
    "heading": "More from the lesson: R:R mindset he spells out",
    "points": [
     "The losses will hurt, but one or two winners will make up for them. You will lose more than you win and still be profitable over the long run.",
     "If 1:1 or 2:1 does not fit you (he does not like it either, he finds it difficult), master the discipline to keep taking the next trade with a lower-win-rate, bigger-R:R system.",
     "With 1% risk on every June trade, he estimates the return would have been about 1.6% to 1.9% instead of 0.89%.",
     "June also contained four losing trades in a row. He reminds himself that this 'is what it is' and moves on.",
     "He expects a temporary drawdown while the bigger risk is in place, and says you just have to understand that it will happen.",
     "Trading 'a lot of it is just that discipline'. You do not have to win a lot if you get used to losing."
    ]
   },
   {
    "heading": "More from the lesson: Why he shared this",
    "points": [
     "He recorded it right after the losses so that anyone with the same thoughts or feelings knows other traders feel this too. It is completely normal, and it does not mean you won't be successful."
    ]
   }
  ],
  "rules": [
   "Stick to your trading plan even when emotion says otherwise (e.g. move the stop to BE when your plan says so).",
   "His own plan rule: in that specific setup type, move the stop to breakeven after about a 2:1 move (based on his own trade observations).",
   "Riskier setups get half risk; standard setups get full risk.",
   "Decide risk changes in advance and in writing (e.g. 'if June is profitable, increase to full risk').",
   "After a loss, feel it briefly, then get straight back to looking for the next setup.",
   "Once a system is proven, trust the R:R and the probabilities. Do not rewrite it after a losing streak.",
   "When a losing streak hits, re-read the notes you wrote in advance (e.g. 'expect big drawdown, do not get discouraged') before reacting.",
   "Get used to losing: the system's few winners pay for the many losers, so keep taking the next trade."
  ],
  "mistakes": [
   "Not moving the stop to BE when your plan says to, because you think price will react a second time.",
   "Declaring the system broken or a scam after two or three losses in a row.",
   "Constantly tweaking the strategy after each loss (e.g. blaming the approach to the zone) instead of trusting the probabilities.",
   "Staying upset for too long after a loss.",
   "Holding trades very long without accounting for swap fees eating profit.",
   "Being shocked by a drawdown after raising risk instead of expecting it.",
   "Letting a no-drawdown 'hype' trade that comes back to BE throw you off the next setup.",
   "Choosing a 1:1 or 2:1 style only because a low win rate feels uncomfortable, when the real fix is the discipline to keep taking trades."
  ],
  "quotes": [
   "Expect big drawdown, do not get discouraged.",
   "I lose more than I win and I'm still a profitable trader.",
   "It's okay to feel that way for a few minutes, then you have to immediately get right back into it.",
   "Take your loss like an adult and understand the math and the probabilities.",
   "Obviously supply and demand works. Obviously the system I have works, I just need to move on to the next trade.",
   "These losses are gonna hurt, but you're gonna have that one winner... those two winners that are gonna make up for your losses.",
   "It's completely normal and it doesn't mean that you aren't gonna be successful.",
   "You don't have to win a lot if you get used to losing."
  ],
  "diagrams": [
   {
    "key": "mindset",
    "caption": "Loss-emotion ladder: 1 loss = feel nothing, 2 = 'damn', 3 = 'does this work?', then back to the plan; plus a June stats strip: 4W / 10-11L / 1BE = +0.89% at under 1% risk, max losing streak 6."
   },
   {
    "key": "entry-stop-tp",
    "caption": "Trade that runs to ~2:1, stop moved to BE per plan, price pulls back and stops out at BE, which counts as a plan-followed outcome."
   }
  ],
  "checklist": [
   "Is this a full-risk (standard) or half-risk (riskier) setup in my plan?",
   "Is my risk size the one I decided in writing in advance?",
   "Do I know the point (e.g. ~2:1) where my plan moves the stop to BE?",
   "Have I accounted for swap fees if I plan to hold for a long time?",
   "Am I calm, with no lingering frustration from the last loss?",
   "Am I taking this trade because it fits the plan, not to 'fix' a losing streak?",
   "Have I re-read my pre-written journal notes for this month (risk plan, expected drawdown)?",
   "Do I know my current losing streak compared with my recorded max drawdown (his is 6 in a row)?"
  ],
  "journalTags": [
   "stop not moved to BE per plan",
   "risk size not per plan",
   "tilt after loss",
   "strategy tweaked after streak",
   "half-risk setup at full risk",
   "swap fees ate profit",
   "followed plan - BE"
  ],
  "newVsPdfs": [
   "His personal rule: move the stop to BE after about 2:1 in that setup type, derived from his own trade observations (the PDFs mention BE after a set R:R only generically).",
   "Two-tier risk in his plan: full risk for standard setups and half risk for riskier ones (e.g. daily confirmation set & forget).",
   "Pre-committing a risk increase in writing, conditional on a profitable month, with a note to expect a bigger drawdown.",
   "Taking only H1 zones and refining H4 zones to H1, plus adding more trending trades.",
   "Swap fees eating profit on long holds as a reason for shorter-timeframe entries.",
   "Real stats: June 4W/10-11L/1BE = +0.89% at under 1% risk; max losing streak of 6; losing more than winning while profitable.",
   "Emotional time-limit idea (feel it for minutes, then move on) and the 1/2/3-loss reaction scale.",
   "Splitting risk across two correlated yen trades (mentioned in passing; details unclear).",
   "Building discipline outside trading (weight training) to support trading discipline."
  ]
 },
 {
  "n": 18,
  "title": "Zoom Meeting – What IS and what is NOT a supply and demand zone",
  "kind": "zoom",
  "summary": "Sunday Zoom session (2 Feb 2025) that resets the basics for new members: the four parts every zone must have, drawable vs tradable zones, sizing zones consistently, and the exact rules for drawing and removing trendlines. It closes with homework reviews and a short psychology talk on not forcing trades, 1% risk and hard stops.",
  "sections": [
   {
    "heading": "Psychology: the best trade is often the one not taken",
    "points": [
     "Seeing no opportunity and moving on is a decision — a position of patience and strength. Don't force trades.",
     "Beginners can press buy and win by luck; forcing your will on the market can work short-term, but trading is a long-term game.",
     "Sometimes there are tons of setups, sometimes none. When every pair on the watchlist has a zone it can get overwhelming — pick the best one (e.g. a 4H demand on EURUSD vs EURJPY: he would pick EURUSD).",
     "Hitting a trade that runs from a planned 5:1 to 10:1 feels better than skipping, but skipping bad charts is still a result."
    ]
   },
   {
    "heading": "Fast watchlist scan (4-chart layout)",
    "points": [
     "He uses a four-chart layout to judge a symbol in seconds: e.g. EURUSD weekly floating in the middle with profit margin down to weekly demand, daily supply in control, a 4H confirmation trade setting up, 1H downtrend → could day-trade short on 5m.",
     "S&P 500: weekly and daily trends are fine but nothing on 4H/1H → move on.",
     "USDCHF: 4H supply above — wait for it to be hit for shorts, or removed for longs (daily trend is up).",
     "Doing this quickly across the watchlist and skipping what isn't there leads to better results."
    ]
   },
   {
    "heading": "Risk: always 1% and a hard stop",
    "points": [
     "Never risk more than 1% of the account per trade — whether the account is $50 or $50,000.",
     "Don't drip-feed $500 deposits and blow them; if you are not comfortable funding more, put in the smaller amount, risk 1% on every trade and learn.",
     "If you can't make 10–30% a year on a $50 or $500 account, you can't do it on a $100,000 account.",
     "Always use a hard stop loss. Remove it and the 1% loss becomes 2%, 3%… 10% of the account. Losing positions also tie up capital and leverage."
    ]
   },
   {
    "heading": "The four parts of a zone (all four required)",
    "points": [
     "1. Basing candles. 2. Move-away candle(s). 3. Stay-away candle. 4. Space between the stay-away candle and the proximal line.",
     "Missing any part = no zone. There is always basing, so the real tests are the move away, the stay away and the space.",
     "Example: if the stay-away candle's wick comes down and touches the proximal line, there is no space → no zone.",
     "He tells members to make the four-part diagram their phone/desktop wallpaper — it stops you drawing the wrong areas.",
     "Not support/resistance: YouTube 'supply and demand' that just marks repeated highs as supply and lows as demand is technically buying/selling, but every candle is supply and demand. A zone needs the specific formation (methodology originally from Sam Seiden; his is slightly tweaked)."
    ]
   },
   {
    "heading": "Basing candles and the 50% candle indicator",
    "points": [
     "Basing candles do not have to be '50% candles' — a single small candle with barely any wick can be the base, as long as it is smaller than the move-away candle.",
     "Bases come in endless shapes, which is why the homework and chart work matter more than any single example.",
     "The 50% candle indicator just helps spot basing quickly ('like cruise control'); he can turn it off and still trade profitably.",
     "The candle right after the proximal line must be a move-away candle. If it looks like another basing candle, it isn't a move away and there is no zone there."
    ]
   },
   {
    "heading": "Drawable vs tradable zones",
    "points": [
     "Every tradable zone is drawable, but not every drawable zone is tradable.",
     "A wick that comes down to barely leave space still qualifies the zone — he draws it to see what removes it, but wouldn't trade it because the move away isn't great.",
     "The faster the initial move away and the more price stays away from the zone, the better the zone. 'I cannot stress that enough.'"
    ]
   },
   {
    "heading": "Sizing and drawing zones",
    "points": [
     "All zones on a chart should be a similar size; judge a new zone's size from the previous correct zones.",
     "If you can't tell whether there is space between the stay-away candle and the proximal line, draw the zone at the similar size first — then check. Never shrink a zone just to create space.",
     "There's no fixed wick-to-body or wick-to-wick rule. He prefers wick-to-body for a tight zone but makes it bigger when needed. Use the surrounding wicks/bodies of the base as anchors; if nothing fits, extend it to a similar size.",
     "The proximal line sits right before the sharp move away — keep it tight against that move, not floating higher.",
     "Distal line attaches to the lowest point of the base (for demand). Never let wicks cut through the distal line.",
     "Don't extend zones far back to the left; keep the chart clean.",
     "It doesn't have to be picture perfect ('doesn't have to be a grand piano') — similar enough is fine."
    ]
   },
   {
    "heading": "What qualifies a zone in chain analysis",
    "points": [
     "A zone qualifies when it removes an opposing zone, removes a trendline, or makes an all-time high/low (not just any high or low).",
     "Draw the zone whose basing happened before the opposing zone was removed, with the move away after it.",
     "New rule for members: when a trendline is removed, draw every zone that removed the trendline.",
     "Sometimes a zone or trendline is removed by nothing — no zone forms. That's fine; don't force a zone and the analysis just ends there."
    ]
   },
   {
    "heading": "Trendlines: drawing",
    "points": [
     "Needs a clear peak, a clear valley and then a higher high (uptrend) / lower low (downtrend). Sideways basing at the top is not a clear peak — no trendline.",
     "Attach to the lowest point (uptrend) / highest point (downtrend). If that line cuts through any candle or wick, move to the next point that doesn't cut through candles.",
     "Never cut through candles: 'if it cuts through this much, why not that much?' — a rule-based system needs exact attachment.",
     "Trendline (clear peak/valley) is different from momentum (no clear peaks/valleys)."
    ]
   },
   {
    "heading": "When a trendline or zone is removed",
    "points": [
     "A trendline is removed by the first candle that closes fully — body AND wick — beyond it (below an uptrend line). A candle still touching the line does not remove it, even if it closed beyond.",
     "It has nothing to do with the first or second candle or any count — it can be the 15th candle.",
     "A zone is removed when price closes/pushes beyond its distal line. Price can float inside a zone forever without removing it.",
     "Emotional wicks: a huge candle with a huge wick through the zone (looks like news/manipulation) is ignored — treat it as if it isn't there. It's about the size of the whole candle and wick, not the wick alone. Rare."
    ]
   },
   {
    "heading": "Homework review notes",
    "points": [
     "Submit screenshots, not unusable links. For multiple timeframe / sequence work, send every timeframe — a 4H zone can't be judged on a 15-minute chart.",
     "Common misses: obvious zones after a trendline removal; trendlines drawn poking through candles; 'zones' whose next candle is basing, not a move away.",
     "Indicators that flag strong moves can be fine to experiment with, but they don't follow the chain analysis (they flag moves that aren't zones).",
     "Next homework: January 2012 to January 2013 on the same chart."
    ]
   },
   {
    "heading": "More from the lesson: More psychology details",
    "points": [
     "Someone who has never heard of trading can press buy and win. 'You can make a million dollars at the click of a button, but you could also lose it slowly over time.'",
     "He says the quote exaggerates a little: a trade you planned for 5:1 that runs to 10:1 probably feels better than skipping. The point is still not to force trades.",
     "Some very obvious-looking charts will still lose when you take them. That is all part of it.",
     "There is a balance between short-term and long-term thinking, but trading is about staying in the game long-term.",
     "Hard stop, as a YouTuber put it: it makes you accept you are wrong. Without it, 1% becomes the next stop at 2%, then 3%, 4%, up to 10% of the whole account. A losing position you keep also ties up capital, leaving you less leverage."
    ]
   },
   {
    "heading": "More from the lesson: Why highs and lows are not zones",
    "points": [
     "Example: a sideways daily chart with repeated selling at the top and buying at the bottom. That is technically supply and demand, but every candle is supply and demand.",
     "Each daily candle seen on a lower timeframe (e.g. 1H) is its own run of buying and selling. That is supply and demand, but it is not a supply and demand zone under the original methodology.",
     "He learned from Sam Seiden's free YouTube videos (never his course). His strategy is tweaked from that, but much closer to it than to YouTube's highs/lows versions, which he says were changed to sell courses."
    ]
   },
   {
    "heading": "More from the lesson: Zone sizing by measuring (clone method)",
    "points": [
     "Worked example: wick-to-body was far too small (a correct earlier zone fitted about 2.5 times inside it). Wick-to-wick was still too small (about 1.5 times). So he moved the proximal line up to wherever the zone matched the earlier correct zone's size.",
     "'There's no reason that this is here other than I'm making it similar size to that one.'",
     "When first learning, clone a correct zone and measure the new one against it. With experience you won't need to. He clones only to demonstrate.",
     "Use the surroundings: try attaching the proximal line to different wicks and bodies within the basing and pick what gives a similar size. A zone a little smaller or a little bigger is 'similar enough'.",
     "Example: a too-small zone that you could fit almost two of the correct zone into shows the size is wrong. That would make a 'no space' zone look valid when it isn't."
    ]
   },
   {
    "heading": "More from the lesson: Homework walkthrough details (Jan 2011 to Jan 2012)",
    "points": [
     "First zone qualified because it removed a trendline. When a supply was removed, he saw the move away and the zone immediately ('picture perfect obvious to me' after years of practice).",
     "Distal line example: a green candle's low sat below a red wick, so the distal line attached to that green candle's low (the true lowest point of the base).",
     "Trendline exercise: several candles technically closed below the line. The removal candle is the FIRST one whose body and wick both closed below. Members circled the wrong candle (one still touching the line). The later full closes don't matter.",
     "A trendline removed by no zone: everything after it was basing with no move away and no stay away, so the chain stopped there.",
     "A hidden zone he had to draw to see: basing, a move-away candle, then the stay-away candle and the space. His worry was whether the move-away candle was big enough. He judged it was, and it was 'a beautiful setup'.",
     "A supply zone: an extra red basing candle at the top could be included or left out. Including it made sense given the zone size he was aiming for.",
     "Trendlines placed very close to each other are hard to spot. Even he almost missed one, and he admitted missing another while marking homework.",
     "Emotional wick example (USDCAD): a huge candle wicked through a demand like a news event. He treated the wick as if it wasn't there and kept extending the zone. If the body had closed beyond it, the zone would have been removed.",
     "For next week: if you don't have this zone on your chart, draw it so you can see what removes it."
    ]
   },
   {
    "heading": "More from the lesson: Move-away judgement in homework",
    "points": [
     "Technically every candle is a move away. The move away he wants is a nice, sharp move, not a run of wicks and basing candles.",
     "Placing the proximal line says the next candle is a move-away candle. If that candle is clearly basing, there is no zone there.",
     "50% candle indicator use case: a candle you might think is a move away gets flagged as a basing candle, which helps beginners tell basing from move away. He says it is just a tool and that his work without it is 'spot on'.",
     "Your eyes should go straight to the sharp moves away on any chart.",
     "MTA homework format seen: 4H higher timeframe and 15-minute entry timeframe. Send both charts."
    ]
   }
  ],
  "rules": [
   "A zone needs all four parts: basing, move away, stay away, and space between the stay-away candle and the proximal line.",
   "Risk 1% per trade, always, whatever the account size.",
   "Always use a hard stop loss.",
   "Keep zones a similar size; never shrink a zone to make space.",
   "Never let wicks cut through the distal line, and never draw trendlines through candles.",
   "A trendline is removed only when a candle closes fully (body and wick) beyond it.",
   "Ignore emotional wicks when judging zone removal.",
   "Don't force trades or zones — no opportunity is a valid decision.",
   "The trendline is removed by the FIRST candle that closes fully (body and wick) beyond it. Later full closes are irrelevant.",
   "If you are unsure whether a zone exists, draw it at the similar size first and only then judge the space.",
   "Attach the distal line to the true lowest point of the base, even if that is another candle's body rather than a wick.",
   "Every daily candle is supply and demand on a lower timeframe. Only the specific formation (basing, move away, stay away, space) is a zone."
  ],
  "mistakes": [
   "Calling repeated highs/lows supply and demand (support/resistance thinking).",
   "Treating a basing candle as the move away.",
   "Shrinking a zone just to create space for the stay-away candle.",
   "Proximal line floating above the sharp move instead of right before it.",
   "Cutting through wicks with the distal line or trendline.",
   "Calling a trendline removed while the candle still touches it.",
   "Calling a zone removed by an emotional news wick.",
   "Judging a higher-timeframe zone on a lower-timeframe chart.",
   "Drip-feeding small deposits and blowing them instead of risking 1%.",
   "Circling a candle that still touches the trendline, or a later candle, as the removal candle.",
   "Measuring zones wick-to-body or wick-to-wick by habit instead of matching the size of the previous correct zones.",
   "Missing a second trendline that sits very close to an obvious one.",
   "Removing the hard stop and letting a 1% loss grow to 10% of the account, and tying up capital.",
   "Not asking questions in sessions (he says people who never ask learn nothing)."
  ],
  "quotes": [
   "The greatest trade is often the one not taken.",
   "You absolutely need all four of them.",
   "Every tradable zone is a drawable zone, but not every drawable zone is a tradable zone.",
   "It doesn't have to be a grand piano.",
   "The market rewards those who wait, not those who force their will upon it.",
   "To see no opportunity and move on is a decision, a position of patience and strength.",
   "Every candle is supply and demand.",
   "How is that a rule-based system if you're cutting through candles?",
   "It's nothing to do with the first candle or the second or some arbitrary number."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "The four parts: basing, move away, stay away, and the space between the stay-away candle and the proximal line."
   },
   {
    "key": "trendline",
    "caption": "Attach to the lowest point that doesn't cut through candles; removed only when a candle closes fully beyond it."
   },
   {
    "key": "zone-removed",
    "caption": "A zone is removed by a close beyond the distal line — ignore one-off emotional wicks."
   }
  ],
  "checklist": [
   "Does the zone have all four parts (basing, move away, stay away, space)?",
   "Is the candle right after the proximal line a real move-away candle?",
   "Is the zone a similar size to my other zones on this chart?",
   "Is it tradable, not just drawable (fast move away, price stayed away)?",
   "Am I risking 1% with a hard stop?",
   "Is this the best setup on my watchlist, or am I forcing it?",
   "Have I identified the FIRST candle that closed fully (body and wick) beyond the trendline?",
   "If I cloned a previous correct zone onto this one, would it be a similar size?",
   "If a wick broke the zone, was it a huge emotional (news) candle that I should ignore?",
   "Am I sending screenshots of every timeframe for MTA homework?"
  ],
  "journalTags": [
   "zone missing stay-away",
   "basing candle as move away",
   "zone sized wrong",
   "trendline cut through candles",
   "forced trade",
   "no hard stop",
   "risked over 1%"
  ],
  "newVsPdfs": [
   "The explicit four-part zone checklist including the stay-away candle and the space to the proximal line.",
   "Drawable vs tradable zones.",
   "Zone sizing by similarity to previous zones instead of a fixed wick/body rule.",
   "Exact trendline attachment and removal rules (full body and wick close; touching candles don't count).",
   "Emotional-wick exception for zone removal.",
   "1% risk regardless of account size and the 10–30%/year small-account test.",
   "Four-chart watchlist scan routine."
  ]
 },
 {
  "n": 19,
  "title": "When to Remove a Trendline",
  "kind": "video",
  "summary": "Using EUR/JPY, Kevin shows that a trendline stops mattering when price runs so far away, for so long, that there is no price action around the line. He also repeats the difference between a trendline and a momentum line.",
  "sections": [
   {
    "heading": "When a trendline becomes irrelevant",
    "points": [
     "EUR/JPY example: the trendline made sense while price was close to it. Had price come back for another test with price action near the line, he might have kept it.",
     "Instead price pushed up so far, and took so long to come back, that the line 'doesn't really matter anymore' - he removed it.",
     "Price action must be seen around the trendline for it to be considered valid.",
     "Valid example: downward trendline with obvious valley, obvious peak, lower low, and price came back in for another test - it stayed valid until it was actually removed (broken).",
     "Hypothetical: if price had dropped away, not come back for a second test, spent a long time far away and only returned much later, he 'would maybe' delete it. There is no exact time/distance threshold given."
    ]
   },
   {
    "heading": "Reminder: momentum line vs trendline",
    "points": [
     "A trendline needs a high, a clear pullback forming an obvious low (valley), then the higher high.",
     "Steady movement without that clear peak and valley is just momentum - a momentum line, not a trendline."
    ]
   },
   {
    "heading": "More from the lesson: How he spotted it",
    "points": [
     "He found this EUR/JPY trendline while updating the members' charts. It 'was looking good at first', then price pushed up so far that the line was no longer relevant 'at the time of recording'.",
     "The reason to remove it was time: 'it took so long for price to come back to it' that it is basically irrelevant."
    ]
   }
  ],
  "rules": [
   "A trendline needs price action around it to stay valid; if price leaves for a long time and goes far away, remove it.",
   "A trendline that keeps getting tested stays valid until it is broken.",
   "Only a clear peak and valley with a higher high (lower low) makes a trendline; otherwise it is momentum.",
   "Review trendlines when you update charts. Remove any line that price has left far behind for a long time, even if it was never broken."
  ],
  "mistakes": [
   "Keeping an old trendline that price left long ago and far behind.",
   "Calling a momentum line a trendline."
  ],
  "quotes": [
   "This is a momentum line, not a trendline.",
   "We basically have to see price action around the trend line for it to be considered valid.",
   "It took so long for price to come back to it, it is basically irrelevant."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Valid trendline retested with price action around it, versus a line price left far behind for a long time (removed)."
   }
  ],
  "checklist": [
   "Has price shown recent price action around this trendline?",
   "Has price been far away from it for a long time? (If so, remove it.)",
   "Is it a real trendline (clear peak and valley) and not a momentum line?",
   "When updating my charts, is each trendline still relevant to where price is now?"
  ],
  "journalTags": [
   "stale trendline",
   "momentum line not trendline"
  ],
  "newVsPdfs": [
   "Trendlines become irrelevant when price leaves them far behind for a long time without price action around them (not in the PDFs).",
   "Momentum line vs trendline distinction."
  ]
 },
 {
  "n": 20,
  "title": "Low Odds Trading Conditions - when is the best time to trade",
  "kind": "video",
  "summary": "On USD/JPY with every timeframe ranging, Kevin explains that trading is lower odds when the timeframe above your entry timeframe is going sideways. It is higher odds when that higher timeframe is trending (either direction) or price is at a higher-timeframe zone.",
  "sections": [
   {
    "heading": "The core idea",
    "points": [
     "Lower odds when the higher timeframe of your entry timeframe is sideways.",
     "H1 entry with a sideways daily = lower odds. H4 entry with a sideways weekly = lower odds.",
     "Higher odds when your higher timeframe is trending (up or down - we are not biased) OR price is at a higher-timeframe supply/demand zone.",
     "You do not need a trend if price is at a HTF zone: e.g. pulling back into daily demand that is not in a downtrend is still a long candidate."
    ]
   },
   {
    "heading": "USD/JPY example",
    "points": [
     "Four-chart layout: every timeframe sideways - a 'picture perfect' example; real cases are often less obvious.",
     "Weekly sideways since August 2024 (over a year), so H4 zones are lower odds.",
     "A weekly trend can take about a year to form; the higher the timeframe, the more you can ignore this rule and just trade with more caution.",
     "5m entry: H1 sideways between two marked lines. Wait for a break: break the high -> peak, valley, higher high and a trendline that guides when to stop looking for longs; break the low -> mirror for shorts.",
     "If H1 downtrend forms -> day-trading shorts are good. If daily downtrend or price at daily demand -> longs are good.",
     "If he were doing a market breakdown right now: no trading options until a high or low breaks on the H1."
    ]
   },
   {
    "heading": "Messy ranges",
    "points": [
     "You can still trade inside a sideways market (e.g. a range on 5m) - it is just lower odds in his opinion.",
     "H4 example: a supply and a demand inside a big messy range both got blasted through. He did not count them as setups - 'absolutely hate it'.",
     "Wait for price to leave the range into higher-quality zones above or below.",
     "A pullback into the daily demand here would not form a downtrend (the peak and valley are not good enough for a trendline), but you can still go long because it is at a demand zone."
    ]
   },
   {
    "heading": "More from the lesson: Extra points from the USD/JPY example",
    "points": [
     "Lower odds does not mean he stops trading the pair: 'it's not like we're not gonna take trades... we understand that it's just gonna be lower odds' for all the H4 zones.",
     "The two H1 range lines were marked in his daily market breakdown or weekly forecast video. His message there was to wait for a trend to form.",
     "Breaking the trendline that forms after a range breakout is the guide for when to stop looking for longs (or shorts).",
     "On H4 there were high-quality zones above the range but not really any below it. Wait for price to pull out of the range into those zones.",
     "Day-trading longs or shorts become good depending on which side of the H1 range price breaks out of."
    ]
   }
  ],
  "rules": [
   "Lower odds when the higher timeframe of your entry timeframe is sideways.",
   "Higher odds when the higher timeframe is trending (either direction) or price is at a higher-timeframe zone.",
   "Zones inside a big messy range are not setups for him - wait for price to leave the range.",
   "It's always higher odds to trade with a trend on your higher timeframe. A sideways market is very, very difficult to trade."
  ],
  "mistakes": [
   "Trading zones inside a messy range on the higher timeframe.",
   "Treating sideways as tradeable at full confidence.",
   "Waiting for a trend at a HTF zone when the zone itself is the reason to trade."
  ],
  "quotes": [
   "It's lower odds to be trading when your higher timeframe to your entry timeframe is going sideways.",
   "We're not biased long or short.",
   "That was just trading in a big messy range. Absolutely hate it.",
   "It's always going to be higher odds when we are trading with a trend on our higher timeframe.",
   "I don't see any trading options until we can break a low or break a high on the one hour chart."
  ],
  "diagrams": [
   {
    "key": "low-odds",
    "caption": "HTF sideways range with zones blasted through inside it; break of the range high or low creates a trend and a trendline guide."
   },
   {
    "key": "mtf",
    "caption": "Entry -> HTF pairs (5m->H1, H1->daily, H4->weekly): sideways HTF = lower odds; trending HTF or HTF zone = higher odds."
   }
  ],
  "checklist": [
   "Is the higher timeframe of my entry timeframe trending?",
   "If not, is price at a higher-timeframe supply/demand zone?",
   "Is this zone sitting inside a big messy range?",
   "Am I waiting for a break of the range high/low before trading?",
   "If I trade sideways conditions anyway, am I trading with extra caution?",
   "Has the H1 broken its range high or low yet (if not, no day-trading options for him)?"
  ],
  "journalTags": [
   "HTF sideways",
   "inside messy range",
   "no trend no HTF zone"
  ],
  "newVsPdfs": [
   "Weekly trends can take ~a year to form; the higher the timeframe, the more you can relax the sideways rule and just trade with caution.",
   "Zones inside a big messy range are not setups - wait for price to leave the range.",
   "A HTF zone alone (without a trend) is enough to make a trade higher odds.",
   "Range breakout creates the trend and trendline that guides when to stop looking for longs/shorts."
  ]
 },
 {
  "n": 21,
  "title": "When is a zone removed",
  "kind": "video",
  "summary": "A short live Q&A clip on whether a wick through a zone removes it. A candle body closing through removes the zone; wicks generally do not, but he judges by the size of the wick relative to the candle body.",
  "sections": [
   {
    "heading": "Removed vs not removed",
    "points": [
     "A candle body closing through the zone = removed. Obvious.",
     "Huge wicks through the zone = not removed.",
     "It is about the size of the wick relative to the body: a big 'emotional' wick with a small body is not a removal.",
     "His second comparison is ambiguous in the captions: two candles with similar emotional wicks - one with a body about as big as the wick, one with a much bigger body. He calls the one with the bigger body 'not removed', and says that when the body is that big the wick is not really big compared to the body, 'and we're not gonna call that removed'. The drawing is needed to be sure which case he means."
    ]
   },
   {
    "heading": "More from the lesson: Context",
    "points": [
     "Clip from a live session: a member who joined late asked about a zone being violated by a wick. He says he had covered it in detail earlier and drew a 'removed' side and a 'not removed' side to compare examples."
    ]
   }
  ],
  "rules": [
   "A body through the zone removes it.",
   "A big emotional wick through the zone does not remove it.",
   "Judge by the wick size compared with the body."
  ],
  "mistakes": [
   "Deleting a zone because a wick poked through it."
  ],
  "quotes": [
   "It's all about the size of the wick.",
   "They're two pretty emotional wicks."
  ],
  "diagrams": [
   {
    "key": "zone-removed",
    "caption": "Left: candle bodies through the zone (removed). Right: large emotional wicks through the zone with small bodies (not removed)."
   }
  ],
  "checklist": [
   "Did a candle body close through the zone?",
   "Or was it only a wick - and how big is the wick compared to its body?"
  ],
  "journalTags": [
   "zone already removed",
   "removed zone by wick only"
  ],
  "newVsPdfs": [
   "Wick vs body rule for zone removal - the PDFs do not define when a zone is removed by a wick."
  ]
 },
 {
  "n": 22,
  "title": "Sunday Zoom Session lessons",
  "kind": "zoom",
  "summary": "A live Sunday session: a quick recap of what a zone and a trendline are, then a full 'chain analysis' homework walkthrough on the daily chart (Jan 1990 to Jan 1991). He covers when to draw a zone, how to draw, adjust, end and remove trendlines, borderline zones, all-time highs, and common homework mistakes.",
  "sections": [
   {
    "heading": "Recap: what a zone is (3 parts)",
    "points": [
     "A zone needs: (1) basing candle or candles, (2) an explosive move away, (3) a stay-away candle.",
     "The move away must be an explosive candle, clearly bigger than the basing.",
     "Without a stay-away candle there is NO zone yet, even when the move-away candle is explosive. Price could open the next candle and pull straight back.",
     "What you want is space between the explosive candle and the proximal line. The bigger the space, the better the zone.",
     "Telltale sign of a basing candle: big wicks. A candle with big wicks is basing, not the move away.",
     "Rally-base-rally example: 'barely a zone'. Look at the space and the stay-away candle before calling it."
    ]
   },
   {
    "heading": "Recap: what a trendline is",
    "points": [
     "Upward trendline: there is always a peak, then a BLATANT valley (a deep one everybody can see). Small dips don't count.",
     "That isn't enough on its own: after the peak forms, price must make a higher high above that peak.",
     "Downward trendline: a peak and a valley, then price must break to a lower low. Peak with no lower low = no trendline.",
     "Momentum line vs trendline: a line across shallow pullbacks is a momentum line, not a trendline (watch the trendline vs momentum lessons).",
     "Sideways price action, or a line that is 'too horizontal', is not a trendline even if there is a peak and a valley.",
     "Borderline case: almost too much sideways action, but 'one last candle peak' made it a real peak for him. Quick peak-and-valley moves still count but are easy to miss."
    ]
   },
   {
    "heading": "Drawing and adjusting trendlines",
    "points": [
     "Attach the second touch point to the valley, starting from the lowest point.",
     "The trendline must not cut through any candles (bodies or wicks). If it does, move it to the next lowest point that cuts nothing. With practice you place it right away.",
     "Use the magnet tool, or hold Ctrl while dragging, to snap the line to the exact wick.",
     "Adjusting: if price reacts off the trendline and then makes a new high, redraw the trendline to the new swing.",
     "Overextended trendline: put the channel tool on it (a normal trendline plus a parallel line attached to the first peak). If price trades above the channel, the trendline is irrelevant.",
     "When a trendline becomes irrelevant, END it on your chart. It doesn't have to stop at an exact spot. Extending it says it is still valid, which it isn't."
    ]
   },
   {
    "heading": "When a trendline is removed",
    "points": [
     "Upward trendline: removed only by a FULL candle close below it, body and wick both below. A candle whose body or wick still touches the line has not removed it.",
     "Downward trendline: removed only by a full candle close above it.",
     "Example: many would say the line broke on an earlier candle, but the wick still touched it. It was removed on the later candle that closed fully below.",
     "He says these are his own rules to stay rule-based: 'I'm not saying this is the only way to do it.'"
    ]
   },
   {
    "heading": "Chain analysis rules (the homework)",
    "points": [
     "Map out every zone that removes an opposing zone and every zone that removes a trendline.",
     "Only draw a zone when it (a) removes an opposing zone, (b) removes a trendline, or (c) makes an all-time high. If you draw a zone, it had better have done one of these.",
     "When a zone is removed, mark it with the remove tool (rectangle in a different colour) and stop extending it. Keep charts very clean. Extended zones are his 'biggest pet peeve'.",
     "To find the zone that did the removing, take the zone NEAREST to the removed opposing zone. If that isn't valid, go further down (or up) to the next one.",
     "Don't force zones. Don't draw a tiny zone to call it a gap zone. If no supply removed a trendline, the chain simply ends there. That is why his charts are sometimes empty.",
     "One zone can remove several things at once (e.g. one demand removed 2 supply areas, or a supply plus an all-time high).",
     "Put the rules on your chart (like Jeff did) and check each zone against them. If it didn't remove anything, you can't have it."
    ]
   },
   {
    "heading": "Basing position and all-time highs",
    "points": [
     "For a demand to count as the one that removed a supply, its basing must be below that supply, before the supply was removed. For supply it is reversed: the basing must be above the opposing demand.",
     "Example: a group of 3 basing candles was respected by the supply, but one candle's wick peaked just above it. So that demand is NOT the one that removed the supply, even though it looks like a demand zone.",
     "A wick barely above the supply counts the same as basing far above it. You only see this when you zoom in.",
     "All-time high: zones also form when price makes an all-time high, using the same basing rule.",
     "An all-time high doesn't have to be a blatant peak. Every high that price breaks past is an all-time high."
    ]
   },
   {
    "heading": "Borderline zones and judgement calls",
    "points": [
     "Example: he compared candle bodies as a quick visual check, 2.06 vs 1.96. It was very close to not being a demand zone.",
     "When unsure whether a zone is a zone, draw it and see how it looks.",
     "He normally draws only ONE zone. Two are acceptable only when the case is 'very, very close'. Here he'd probably keep the more obvious lower one, but he wouldn't call either choice wrong.",
     "'You're gonna have rules, but... it's gonna be very borderline' sometimes. Trading is never super easy.",
     "In homework, drawing two zones for the same removal (when it isn't borderline) is wrong. Only one zone removed it."
    ]
   },
   {
    "heading": "Q&A: proven zones, old zones, HTF control",
    "points": [
     "Q: If a zone is respected or tested and then removed, is the zone that removed it more valid? A: Yes. Several reactions off a supply prove it was real supply, so the demand that breaks it is more powerful.",
     "If price just blasts through a zone with no reaction, the zone that removed it is still valid and he'll still trade it, but it gives him less confidence.",
     "Old zones: a daily zone from 1990 got its first pullback in 1991. Good zone, but he would not take it. He wants a pullback in a reasonable time, not a year or more later.",
     "Very old zones have little liquidity and no support or resistance built up, which is why you see old zones break.",
     "When price hesitates for a long time, open a higher timeframe (weekly, monthly, 3-month). Often a macro HTF zone is in control. Not in this example, but many times it is."
    ]
   },
   {
    "heading": "Zone drawing corrections from homework review",
    "points": [
     "Include all the basing candles and their wicks when they are close. Including them doesn't make the zone massive. Leave a wick out only if it is far away.",
     "Wrap the proximal line tight against the basing, right before the explosive move.",
     "Draw the lines around the basing candle(s), not around the explosive candle.",
     "Tighten zones: there is no need to go wick to wick, but getting the right area matters most.",
     "Don't put a distal line randomly in the middle of a candle. Attach it to the wick.",
     "Supply/demand is NOT 'old resistance becomes new support'. The S&D way: supply removed by demand, then buy the pullback to that demand.",
     "'Not a good enough move away' = not a zone. A drop-base-rally or rally-base-drop label alone isn't enough."
    ]
   },
   {
    "heading": "Homework logistics and mindset",
    "points": [
     "Use the daily chart. Homework not on the daily (e.g. 4h) can't be marked.",
     "Submit a chart LINK with sharing on, not a screenshot. Submit once only; duplicates confuse marking.",
     "Copy his zones and trendlines exactly, to the pip, on the FXCM broker feed. Delete every zone he didn't draw before next week. He uses TradingView.",
     "Next homework: January 1991 to January 1992. Also map out the all-time high.",
     "Keep sessions to homework. Confused? Watch the welcome video.",
     "Homework is optional, but practice takes you from confused, to about 90% right but slow, to mapping fast after 1-3 months.",
     "Chain analysis isn't the holy grail. Its value is keeping you rule-based.",
     "Rules help psychology. A great move from a zone with no trendline or opposing zone removed is 'not a trade'. Missing it shouldn't bother you, and rules stop you forcing trades or changing your rules."
    ]
   },
   {
    "heading": "More from the lesson: More walkthrough details (Jan 1990 to Jan 1991)",
    "points": [
     "First demand that removed a supply: three basing candles before 'not the best explosive move away'. He included all three in the basing.",
     "Respected supply example: price reacted off a supply many times ('clearly there is supply here, but it just couldn't hold'). Buyers took over and pushed price up, so the demand that removed it is a strong one.",
     "Not a downward trendline: there was a peak but no lower low. Another case was sideways price action: 'if we just had one more little spike down' there would have been a good enough valley.",
     "All the zones look a little different but very similar: basing, then explosive move away, every time.",
     "After a trendline removal, a demand gave 'a beautiful setup there to target the all-time highs'. A single-candle-basing demand that removed a supply plus an all-time high gave 'a nice little 1:1'. The zone didn't work that great.",
     "Final example: a supply and a trendline both removed by one demand with single-candle basing and an explosive move away, 'picture perfect'.",
     "When he can already see a zone was removed, he uses the remove tool directly rather than checking it with another tool (he mentions not needing his Fibonacci tool)."
    ]
   },
   {
    "heading": "More from the lesson: Extra homework-review corrections",
    "points": [
     "Draw trendlines from the lowest touch point available. A line not attached to a valley 'from down there' makes no sense.",
     "A line 'too horizontal' is not a trendline, and drawing it can make you ignore the real trendline nearby.",
     "Don't call a candle the explosive move when it is really the basing candle. Moving the proximal line shows the real zone, and you then see the trade off it.",
     "If two basing candles are close together, include both. Including them doesn't make the zone massive.",
     "Use the magnet tool: either turn it on, or hold Ctrl while dragging a trendline or zone edge so it snaps to the nearest wick.",
     "Use different colours. Yellow zones are very hard to see.",
     "Overcorrecting: a member who drew too many zones started drawing too few. The goal is to fine-tune what should be drawn.",
     "Members' DBR/RBD/RBR labels were often technically correct even when the move away was 'barely good enough' to be a zone.",
     "Don't tag him in homework. He only looks at it on Sunday.",
     "Screenshots are only for video-lesson homework. Sunday chain-analysis homework is a shared chart link.",
     "If you're new and confused, rewatch old Sunday sessions (he keeps them up until his Zoom storage runs out) and the welcome video. Mute your mic during sessions.",
     "Homework at about 98% is very rare. A couple of members reached it in this session."
    ]
   }
  ],
  "rules": [
   "A zone needs basing, an explosive move away AND a stay-away candle. No stay-away candle = no zone yet.",
   "Only draw a zone if it removes an opposing zone, removes a trendline, or makes an all-time high.",
   "Upward trendline = peak + blatant valley + a higher high above the peak. Downward = peak + valley + a lower low.",
   "A trendline must not cut through any candles. Attach from the lowest point, adjusting to the next lowest if needed.",
   "Upward trendline is removed only by a full candle close (body and wick) below it. Downward only by a full candle close above it.",
   "A demand's basing must be below the supply it removed (supply's basing above the demand it removed). A wick poking past it disqualifies it.",
   "When a zone is removed, end it and mark it removed. Keep charts clean.",
   "Don't force zones. If nothing removed it, the chain ends.",
   "End an overextended trendline. Don't extend it.",
   "Use the magnet tool (or hold Ctrl) so trendlines and zone lines snap exactly to wicks.",
   "Copy every one of his zones every week. At minimum, carry over the zones he lists, so the chain continues correctly."
  ],
  "mistakes": [
   "Calling a zone off an explosive candle before a stay-away candle forms.",
   "Drawing momentum lines, or sideways/too-horizontal lines, as trendlines.",
   "Trendlines that cut through candles or aren't attached to the low or wick.",
   "Treating a wick touch, or a candle still touching the line, as a trendline break.",
   "Extending removed zones or irrelevant trendlines. Messy charts.",
   "Drawing two zones for one removal.",
   "Leaving out nearby basing candles or wicks, or wrapping lines around the explosive candle instead of the basing.",
   "Missing trendlines that need adjusting after a new high.",
   "Using the demand whose basing wick peaked above the supply as the one that 'removed' it.",
   "Thinking of S/R ('old resistance becomes new support') instead of supply removed by demand.",
   "Taking a very old zone whose first pullback comes a year or more later.",
   "Homework errors: wrong timeframe, screenshots instead of links, not copying his zones, submitting twice.",
   "Overcorrecting from drawing too many zones to drawing too few.",
   "Drawing zones in hard-to-see colours (e.g. yellow).",
   "Tagging him on homework or submitting screenshots for Sunday homework.",
   "Calling the basing candle the explosive move by misplacing the proximal line."
  ],
  "quotes": [
   "The bigger the space, the better the zone.",
   "We're not gonna force zones... the analysis just ends.",
   "Every single high we break is an all-time high.",
   "It just didn't follow my rules. There's nothing I can do about it.",
   "Clearly there is supply here, but it just couldn't hold.",
   "This isn't the holy grail, this is just the chain analysis... it keeps us rule-based."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Basing candles, then explosive move away, then stay-away candle, with the gap between the explosive candle and the proximal line highlighted (bigger gap = better). Second panel: no stay-away candle, price pulls straight back = not a zone."
   },
   {
    "key": "trendline",
    "caption": "Peak, blatant valley, then higher high = trendline, compared with a shallow momentum line. Line drawn from the lowest point without cutting candles; an adjusted line after a new high; a channel showing an overextended line that gets ended."
   },
   {
    "key": "zone-removed",
    "caption": "Trendline removal: a candle whose wick still touches the line = not removed; the next candle with a full body and wick close below = removed. Plus a demand whose basing wick pokes above the supply = not the demand that removed it."
   }
  ],
  "checklist": [
   "Is there a stay-away candle, with clear space between the explosive candle and the proximal line?",
   "Did this zone remove an opposing zone, remove a trendline, or make an all-time high?",
   "Is the basing fully below the supply it removed (or above the demand), with no wick poking past?",
   "Is this the zone nearest to the removed opposing zone?",
   "For a trendline break: did a full candle (body and wick) close beyond the line?",
   "Is the trendline still relevant (not overextended beyond the channel)?",
   "Is the trendline built on a blatant peak and valley plus a higher high or lower low, without cutting candles?",
   "Was the removed opposing zone respected or tested before it broke (more confidence)?",
   "Is the zone recent enough? No year-later first pullback on an old zone?",
   "Are all nearby basing candles and wicks included, with the proximal line tight to the basing?",
   "Is the trendline attached to the lowest available valley point (snapped with magnet/Ctrl)?",
   "Have I carried over all of his zones and trendlines from last week before starting?"
  ],
  "journalTags": [
   "no stay-away candle",
   "zone removed nothing",
   "wick touch not break",
   "momentum line not trendline",
   "trendline cuts candles",
   "overextended trendline",
   "basing above opposing zone",
   "forced zone",
   "two zones drawn",
   "basing wick excluded",
   "old zone no liquidity",
   "S/R not S&D"
  ],
  "newVsPdfs": [
   "Stay-away candle as a required third part of a zone, and 'space between the explosive candle and proximal line' as a quality measure.",
   "Chain analysis rule: only draw zones that remove an opposing zone, remove a trendline or make an all-time high. All-time high is a new qualifier not in the PDFs.",
   "'Every high broken is an all-time high', with no blatant peak needed.",
   "Exact trendline definition: blatant valley plus a higher high. Draw from the lowest point without cutting candles; magnet tool / Ctrl to snap to wicks.",
   "Trendline removal requires a full candle close (body and wick) beyond the line. A wick touch doesn't count.",
   "Adjusting a trendline after a new high. Ending overextended trendlines using the channel tool.",
   "Basing must be below the supply it removed (above the demand for supply). A wick barely past disqualifies it.",
   "Take the removing zone nearest to the removed opposing zone. Two zones only in very borderline cases.",
   "A zone that removes a proven (respected/tested) zone is stronger than one that removes a zone price blasted through.",
   "Very old zones (first pullback a year or more later) aren't traded: little liquidity.",
   "Long hesitation often means a HTF macro zone is in control. Check weekly, monthly, 3-month.",
   "Include nearby basing wicks. Never put a distal line mid-candle. Big wicks mark a basing candle.",
   "Rule-based system framed as a psychology tool: no regret over missed trades that broke the rules."
  ]
 },
 {
  "n": 23,
  "title": "The difference between Set & Forget and Confirmation Trading",
  "kind": "video",
  "summary": "On EUR/GBP H1 with a daily HTF, Kevin shows that the difference is when the entry zone formed: an H1 zone embedded inside the daily zone (formed with it) is set & forget, while an H1 zone formed after the daily zone was contacted is a confirmation zone. Both are still traded with an order you set and manage.",
  "sections": [
   {
    "heading": "Why it is confusing",
    "points": [
     "Technically any zone is a set & forget - you set the order and kind of forget it (still managing it).",
     "So the difference is not how you place the order but how the zone was formed."
    ]
   },
   {
    "heading": "EUR/GBP example (daily HTF, H1 entry)",
    "points": [
     "Daily demand formed by removing a trendline; price pulled back to it and rallied out.",
     "Zone 1: an H1 demand inside the daily demand that was formed WHEN the daily zone formed - part of the daily move. That is an embedded H1 zone = set & forget.",
     "Zone 2: price came back to the daily demand, contacted it, pushed out and removed a trendline, forming an H1 demand outside the daily zone = confirmation zone.",
     "Common mistake: calling the embedded zone a confirmation trade just because it is inside the daily zone."
    ]
   },
   {
    "heading": "The test",
    "points": [
     "Formed while the HTF zone was forming -> set & forget (embedded).",
     "Formed after the HTF zone was contacted (with a removal, e.g. a trendline) -> confirmation.",
     "Both can look like set & forget trades in practice."
    ]
   }
  ],
  "rules": [
   "An H1 zone formed as part of the daily zone's move is embedded = set & forget, not confirmation.",
   "A confirmation zone forms after the HTF zone is contacted and removes something (e.g. a trendline)."
  ],
  "mistakes": [
   "Calling an embedded LTF zone inside the HTF zone a confirmation trade."
  ],
  "quotes": [
   "Technically any zone is a set and forget.",
   "This zone was formed when the daily zone was forming. This zone was formed after the daily zone was contacted.",
   "So they may both look like set and forget trades... but just remember this is a confirmation zone."
  ],
  "diagrams": [
   {
    "key": "confirmation",
    "caption": "Daily demand with Zone 1 (H1 zone embedded, formed with the daily move = set & forget) and Zone 2 (H1 zone formed after contact + trendline removed = confirmation)."
   },
   {
    "key": "mtf",
    "caption": "Daily zone synced onto the H1 chart showing which H1 zone sits inside versus outside it."
   }
  ],
  "checklist": [
   "Was my entry zone formed while the HTF zone was forming (set & forget)?",
   "Or after the HTF zone was contacted (confirmation)?",
   "If I call it confirmation, did the move remove a trendline or opposing zone after contact?"
  ],
  "journalTags": [
   "mislabelled confirmation",
   "embedded zone"
  ],
  "newVsPdfs": [
   "The timing test: embedded zone formed with the HTF zone = set & forget; zone formed after HTF contact = confirmation. The PDFs say confirmation trades zones formed after contact and S&F trades zones formed outside HTF zones; he adds that an embedded zone inside the HTF zone is also set & forget."
  ]
 }
];
