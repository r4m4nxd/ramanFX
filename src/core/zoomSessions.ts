// Kevin's Sunday live Zoom sessions as study notes, written from the session transcripts.
// Kept separate from the 23 recorded lessons. Generated; edit the notes, not the shape.
import type { VideoLesson } from './videoLessons';

export interface ZoomSession extends VideoLesson {
  date: string;
  examples: { market: string; timeframe: string; setup: string; reasoning: string; outcome: string }[];
  qa: { q: string; a: string }[];
  newDiagrams: { id: string; title: string; caption: string; svg: string }[];
  botRules: { rule: string; detail: string; plannerStep: string }[];
}

export const ZOOM_SESSIONS: ZoomSession[] = [
 {
  "n": 8,
  "title": "Chain analysis Jan 1996-Jan 1997: zones with no basing, trendline updates and overextended lines",
  "kind": "zoom",
  "date": "2026-09-13",
  "summary": "Kevin recaps the three zone-qualifying rules (removes an opposing zone, removes a trendline, makes an all-time high/low), what a zone is (basing, explosive move away, stay-away candle with space to the proximal line) and his trendline rules (blatant peak and valley plus a higher high / lower low, attached to candles, never cutting through them). He then walks through the daily chain analysis from January 1997, showing how to draw a zone that has no basing, how to handle very large basing groups, why some removals produce no new zone, when a daily trendline is really a weekly one, how to update a trendline from the previous peak, and why overextended trendlines are ended rather than extended. In the homework review two students scored a first-ever 100%, and he corrects common errors: trendlines drawn on the top, zones not attached to candles, distal lines in random places, zones shrunk to fake a stay-away gap, and oversized 'higher-timeframe' trendlines that hide the ones in between. He finishes with a short all-time-low lesson (every new low is an all-time low, so a series of drop-base-drops each forms a zone) and sets the Jan 1998 to Jan 1999 homework.",
  "sections": [
   {
    "heading": "Recap: the 3 zone-qualifying rules (anchored note on the chart)",
    "points": [
     "He keeps the three rules as an anchored note in the top right of the homework chart so they stay visible wherever he scrolls.",
     "Rule 1: did the zone remove an opposing zone? (and did that opposing zone itself remove an opposing zone - the chain).",
     "Rule 2: did it remove a trendline?",
     "Rule 3 (the rarer one): did it make an all-time high or low?",
     "You only need ONE of the three, not all three.",
     "Example from last week's homework: a zone that broke no zone and no trendline, but broke an all-time high, so it qualified under rule 3."
    ]
   },
   {
    "heading": "Recap: what a zone is (basing, explosive move away, stay-away candle)",
    "points": [
     "Zones won't always be as clean as the textbook example in the Discord learning material.",
     "Needs basing candle(s) and a move-away candle that must be explosive - measured from the proximal line, the candle leaving the zone must be explosive, not 'little boo-boo basing candles on the way out'.",
     "A move from A to B made of small basing-like candles is not the same as an explosive move.",
     "Stay-away candle: the candle that stays away from where the zone would be drawn, which naturally leaves a space between the stay-away candle and the proximal line.",
     "The smaller that space (e.g. a wick reaching down close to the proximal), the worse the zone - not great, but he still draws it (drawable vs tradable, video lesson 1).",
     "He does not measure the space; it is visual and comes with the Sunday work over time.",
     "Preferred (optimal, not required): basing, an explosive move away, then ANOTHER explosive move away - two explosive candles show a lot of demand. Basing, one explosive candle then a pullback is also fine."
    ]
   },
   {
    "heading": "Recap: trendline rules",
    "points": [
     "Everything is a peak and valley; what he wants is a blatant, obvious valley that everybody would see as a valley. Shallow ones are momentum.",
     "Uptrend line: a peak, an obvious valley, and then a HIGHER HIGH above that peak. If price approaches the high and sells off without breaking it, there is no trendline.",
     "Downtrend line is the inverse: peak, obvious valley, then a lower low.",
     "Trendlines are attached to candles and never cut through candles.",
     "Rally-base-rally names etc. don't really matter for this exercise."
    ]
   },
   {
    "heading": "Homework instructions and the January 1997 supply",
    "points": [
     "Last week covered Jan 1996 to Jan 1997; your chart must contain all the zones and trendlines he corrected. The first thing he checks is whether you followed instructions and copied his chain analysis - otherwise you can't see what removed what. Doing badly is fine; not copying his zones upsets him.",
     "Last zone was a supply that qualified by rule 1 (removed an opposing demand). A huge wick there was just an emotional wick (look at the size), not the removal; the demand was cleanly removed when a body closed below it.",
     "A body close is not always required: a normal-sized wick (candle not small, wick not massive) breaking a zone also removes it.",
     "There was also a trendline he forgot to draw (a member caught it) - rule 2, trendline removed, with an explosive move and basing.",
     "The basing there was very large. He excluded one candle with a big wick and used only the 3 other basing candles; if that wick had been smaller he would include all three/four.",
     "The zone was respected, then removed; he ends the zone where it was removed instead of extending it - that is how you keep a clean chart.",
     "Some students drew a trendline on a nearby peak/valley; for him it was close but not a good enough valley.",
     "The trendline is continued right to the candle that removed it: it was officially removed only when a candle closed fully below it (body and wick not touching). That trendline touched both basing candles and even the explosive candle, so he would not draw the zone until the stay-away candle closed fully below the trendline."
    ]
   },
   {
    "heading": "Large basing groups: two ways to draw, risk-reward trade-off",
    "points": [
     "After the zone was removed his eye went straight to the explosive candle; the full basing behind it was too big for him.",
     "You can draw the whole big basing area if you really want to trade that big, but your risk-reward will be much worse; you get less chance of being stopped out. 'There's no free lunch.'",
     "For chain analysis we do not draw it that big.",
     "There were two groups of basing (a cluster plus one candle); he drew it around the relevant group.",
     "Not a great zone; he would not have traded it - not terrible, just not one he'd personally take. It was later removed.",
     "Removal with no new zone: an opposing zone being removed does not mean a zone removed it. Nothing there resembled supply.",
     "A candle bigger than the others can still be a basing candle - just a larger basing candle."
    ]
   },
   {
    "heading": "Daily vs weekly trendlines and overextended trendlines",
    "points": [
     "A clear low was removed, and many students wanted a large trendline. On a daily chart that line is massive compared with normal daily trendlines, so it is most likely a weekly downward trendline. He won't include it in the chain analysis, but it's 'not really wrong'.",
     "A proper daily trendline: good enough valley, peak, lower low.",
     "Price then got very overextended, making the trendline basically irrelevant; updated trendlines follow.",
     "He wants that trendline on your chart but ENDED there, not extended. Extending it tells him you don't understand that it became irrelevant.",
     "Old zones: he removed some very old zones. 'We don't expect these to hold.' One was respected once, but he's not surprised an old zone with no real liquidity trap fails; he doesn't like trading older zones."
    ]
   },
   {
    "heading": "Drawing a supply zone that has no basing",
    "points": [
     "A rare case: a supply with essentially no basing, just a huge explosive move, but you still want a zone there.",
     "How: go to the very top (the extreme) - that is the distal line - then look at the other zones on your chart and draw it a similar size.",
     "It was an older zone, so it is tracked for much later.",
     "Students mostly got this one right; he was impressed since there's no basing."
    ]
   },
   {
    "heading": "Trendline from the highest point of the previous peak; trendline updates",
    "points": [
     "With a very obvious peak and valley and a lower low, take the highest possible point at the previous peak and draw to the next touch - rule 2 trendline.",
     "That trendline was removed, but nothing resembled demand, so no zone.",
     "Updated trendline after a new peak and valley: normally draw it from the RECENT peak.",
     "If drawing from the recent peak makes no sense (the line would not work), use the previous peak and valley instead. If another previous peak sat higher, attach to that.",
     "Later in the same chart a new peak, valley and lower low did allow drawing from the recent peak - no need to go up to the older one. Again highest point possible.",
     "That line also got overextended: he uses the channel tool to show price is no longer staying within the channel, so it is ended, not extended.",
     "A trendline must start from a real previous peak, not from some random point (unless that point was part of a trendline before). Manipulation spikes are not peaks."
    ]
   },
   {
    "heading": "Almost-zones: no stay-away candle, too-small zones",
    "points": [
     "An almost-zone: basing and an explosive move away, but no stay-away candle - price pushed straight back and wicked into it. So no supply there, and nothing above either.",
     "Again, a removed zone does not guarantee a new zone.",
     "Price 'falling off a cliff' = very difficult trading conditions.",
     "A small potential supply at the end: if drawn it would be too small; you don't want to draw zones too small. He compared it against other zones and decided it did qualify - very poor quality, not a trade he would take, even though it 'worked beautifully'.",
     "The red line is the all-time low. Very poor quality zones are drawn only to map them for the future and see what removes them, not because we want to trade them."
    ]
   },
   {
    "heading": "Homework review: corrections",
    "points": [
     "Missing one zone often makes you miss the next zone in the chain (missed supply -> missed demand).",
     "If you draw a second, safer zone in a real trading situation because the qualifying one is very poor, that makes sense - but put a note saying which one is the zone and why you're drawing the other.",
     "Distal lines must be based on the candles; zones placed with a random distal 'don't make any sense'.",
     "Boo-boo basing candles are not zones; a very wicky area is not demand/supply; a weak move away or tiny zone is not a zone.",
     "Include the basing candles and include the wick in the zone (an example: including the wick would have avoided being stopped out).",
     "We do NOT draw trendlines on the top: uptrend lines go on the bottom (lows), downtrend lines on the top (highs). A line across the top of an uptrend is a momentum line.",
     "Zones must be attached to the candles.",
     "A clear big wick means it is not a supply zone - if that wick were part of a basing candle body it would be, but it's just a larger basing candle.",
     "End zones where they end; don't extend a zone past the candle that broke it.",
     "Don't cut through wicks with trendlines; oversized trendlines are wrong.",
     "Shrinking a zone so there is a gap to the stay-away candle is not how we do it - copy the size of a properly drawn zone (he measured 88 and copied it; at the same size the candle touches, so no zone). He admits he's been guilty of it.",
     "Don't combine two separate sets of basing inside one larger basing area - draw just the relevant set.",
     "No trendline where price never broke to a lower low.",
     "Huge trendlines are higher-timeframe lines; focusing on them makes you miss all the daily ones in between - a bad habit.",
     "Homework must be on the daily timeframe; homework on the 1 hour chart cannot be marked."
    ]
   },
   {
    "heading": "Weird zones: explosive move after lots of basing; drawable vs tradable",
    "points": [
     "Example where the explosive move comes after a long run of basing candles: he doesn't want to exclude the basing, so he may draw the zone at the explosive move but tuck the stop underneath all the basing - his best idea for a trading situation; he hasn't fully figured out the best way. It looks like breaking the rules but isn't.",
     "Remember which candle is the explosive move - the basing is not the move away.",
     "Drawable but not tradable example: basing and move away fine, but very small space between the stay-away candle and the proximal line. He'd draw it, not trade it, even though it worked beautifully.",
     "A very good tradable zone: one he would 'risk my hard-earned capital off all day'.",
     "If you can't draw a zone without making it too small, and making it bigger removes the stay-away candle, and drawing from lower makes the basing bigger than the move away, it is not a zone. When the move away is the same but there's a clear pinpoint of basing, it is a zone.",
     "A very poor weekly zone drawn oddly because it was too large to draw normally - a one-off anomaly."
    ]
   },
   {
    "heading": "Trades, drawdowns and his Euro stop-out",
    "points": [
     "A student went 4 for 4 following his analysis; he congratulates but warns: expect a drawdown.",
     "He doesn't give signals ('that's illegal'); in daily breakdown videos he points out good zones where you can look for confirmation trades.",
     "His EUR trade was stopped out, likely by the spread at news time; he believes his stop was wider than the zone; he got over it quickly."
    ]
   },
   {
    "heading": "All-time lows and next homework",
    "points": [
     "Every candle making a new low is an all-time low; it doesn't have to be an obvious valley - every wick that makes a new low counts.",
     "So when price breaks the all-time low and keeps going drop-base-drop, drop-base-drop, each one is a zone (rule 3), even without breaking an obvious low.",
     "Copying his chart: do it manually (two monitors, or watch his chart on your phone while drawing on desktop); a member noted you can make a copy of the chart from the Sunday Meeting drop-down.",
     "Homework: Jan 1, 1998 to Jan 1, 1999 on the daily, monitor all the lows; some trendlines this week.",
     "Two students got 100% - the first perfect homework ever. 8 or 7 out of 10 is still doing good."
    ]
   }
  ],
  "rules": [
   "Qualify every zone by at least one rule: removes an opposing zone, removes a trendline, or makes an all-time high/low.",
   "Require basing, an explosive move away and a stay-away candle with space to the proximal line.",
   "Draw an uptrend line only after a blatant peak and valley followed by a higher high (inverse for downtrend).",
   "Attach trendlines to candles and never cut through candles or wicks.",
   "Draw uptrend lines on the lows and downtrend lines on the highs - never on the top of an uptrend.",
   "Count a trendline as removed only when a candle closes fully beyond it (body and wick not touching).",
   "Do not draw a zone whose basing touches a trendline until the stay-away candle closes fully beyond that trendline.",
   "End zones and trendlines where they were removed or became irrelevant; never extend them.",
   "End an overextended trendline (check with the channel tool) instead of extending it.",
   "Update a trendline from the recent peak; if that makes no sense, use the previous peak and valley.",
   "Start trendlines only from a real previous peak at its highest point, not from random points or manipulation.",
   "For a zone without basing, put the distal at the extreme and copy the size of your other zones.",
   "Exclude a basing candle with an outsized wick from a large basing group.",
   "Copy the size of properly drawn zones; don't shrink a zone to create a stay-away gap.",
   "Include wicks and all relevant basing candles in the zone.",
   "Ignore emotional wicks for removal; a normal wick through a zone does remove it.",
   "Exclude daily lines that are so large they are really weekly trendlines from daily chain analysis.",
   "If you draw two zones for one removal, add a note saying which is the qualifying zone.",
   "Do homework on the daily chart and copy his previous chain analysis first.",
   "Treat every new low (or high) as an all-time low (high); each drop-base-drop beyond it is a zone."
  ],
  "mistakes": [
   "Not copying his previous chain analysis into your homework.",
   "Assuming a removed zone always has a new zone that removed it.",
   "Calling it a zone without a stay-away candle (price wicked straight back in).",
   "Drawing trendlines on the top of an uptrend (that's a momentum line).",
   "Extending zones and trendlines past where they ended or became overextended.",
   "Drawing massive higher-timeframe trendlines on the daily and missing the trendlines in between.",
   "Shrinking a zone to fake a gap to the stay-away candle.",
   "Random distal lines not based on candles; zones not attached to candles.",
   "Drawing boo-boo basing candles or wicky areas as zones.",
   "Excluding the wick from a zone (gets you stopped out).",
   "Combining two separate sets of basing into one oversized zone.",
   "Starting a trendline from a random point or a manipulation spike.",
   "Drawing a trendline where price never broke a lower low / higher high.",
   "Drawing zones too small.",
   "Trading very old zones that are unlikely to hold.",
   "Trading drawable-only zones with little space to the stay-away candle.",
   "Doing homework on the 1 hour chart instead of daily.",
   "Expecting a winning streak to continue - expect a drawdown.",
   "Ignoring spreads around news times."
  ],
  "quotes": [
   "You don't need all three, you just need one.",
   "We don't want little boo-boo basing candles on the way out.",
   "We end it where it was ended, and that's how we keep a clean chart.",
   "There's pros and cons to everything, there's no free lunch.",
   "Just because we have a zone removed, does not mean we will have an actual area of demand.",
   "We don't draw trend lines on the top.",
   "I'll risk my hard-earned capital off a zone like that all day.",
   "Just because we draw it doesn't mean we're looking to trade.",
   "Expect a drawdown.",
   "I don't give signals, never will give signals."
  ],
  "diagrams": [
   {
    "key": "qualify",
    "caption": "The 3 anchored rules: removes opposing zone, removes trendline, makes all-time high/low - only one is needed."
   },
   {
    "key": "zone-anatomy",
    "caption": "Basing, explosive move away, stay-away candle and the space to the proximal line; optimal is two explosive candles."
   },
   {
    "key": "trendline",
    "caption": "Blatant peak and valley plus a higher high / lower low; uptrend lines on the lows, downtrend lines on the highs."
   },
   {
    "key": "remove-limit",
    "caption": "Trendline removed only on a full candle close beyond it; draw the zone only after the stay-away candle closes beyond the line."
   },
   {
    "key": "zone-removed",
    "caption": "Emotional wick is not a removal; a normal wick or body close is. End the zone at the removal candle."
   },
   {
    "key": "draw",
    "caption": "Excluding a big-wick candle from large basing; copying zone size instead of shrinking for a gap."
   },
   {
    "key": "quality",
    "caption": "Drawable vs tradable: small space to the stay-away candle means draw it, don't trade it."
   }
  ],
  "checklist": [
   "Does the zone meet at least one of the 3 rules?",
   "Basing identified, move away explosive, stay-away candle present with visible space?",
   "Is the zone attached to candles, wick included, similar size to my other zones?",
   "If basing touches a trendline, has a candle closed fully beyond the trendline?",
   "Is the trendline from a real peak, blatant valley, with a higher high / lower low, on the correct side?",
   "Is the trendline overextended (outside the channel)? Then end it.",
   "Is the trendline so large it's really a higher-timeframe line?",
   "Is the zone old with little liquidity?",
   "Drawable or tradable? Is the risk-reward acceptable given the zone size?",
   "Is it news time - can the spread hit my stop?"
  ],
  "journalTags": [
   "zone not qualified",
   "no stay-away candle",
   "zone extended",
   "trendline extended",
   "overextended trendline",
   "trendline on top",
   "htf trendline on daily",
   "random trendline start",
   "zone shrunk",
   "wick excluded",
   "zone not attached",
   "boo-boo basing",
   "old zone",
   "drawable not tradable",
   "spread stop-out",
   "oversized zone",
   "news spread"
  ],
  "newVsPdfs": [
   "How to draw a zone with no basing at all: distal at the extreme, size copied from other zones.",
   "Trendline updates: use the recent peak normally, fall back to the previous peak when the recent one makes no sense; start only from real previous peaks, not manipulation spikes.",
   "A daily trendline that is too massive is really a weekly line - leave it out of daily chain analysis; obsessing over big lines makes you miss the daily ones.",
   "Don't draw a zone whose basing touches a trendline until the stay-away candle closes fully beyond the line.",
   "Explicit: trendlines are never drawn on the top of an uptrend.",
   "Large basing: drawing the whole base trades worse R:R for fewer stop-outs ('no free lunch'); alternative of drawing at the explosive move but tucking the stop under all the basing.",
   "Exclude a single big-wick candle from a basing group; don't combine two basing sets.",
   "Shrinking a zone to manufacture a stay-away gap is wrong - copy standard zone size.",
   "Optimal demand has two explosive move-away candles.",
   "Not-a-zone test: if the zone is too small, enlarging kills the stay-away, and lowering makes basing bigger than the move away.",
   "All-time low clarification: every new low counts, so successive drop-base-drops are each zones.",
   "Note your choice when drawing two zones for one removal."
  ],
  "examples": [
   {
    "market": "Homework chart (daily chain analysis)",
    "timeframe": "Daily",
    "setup": "Supply removing a demand (rule 1), Jan 1997",
    "reasoning": "Huge wick was an emotional wick; removal confirmed by body close below the demand",
    "outcome": "Valid supply carried into this week's chain"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Zone after trendline removal with large basing (rule 2)",
    "reasoning": "Excluded the big-wick candle, used 3 basing candles; zone drawn only after the stay-away candle closed fully below the trendline",
    "outcome": "Respected, then removed; zone ended at removal candle"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Wide two-group basing zone",
    "reasoning": "Drawing the whole basing gives worse R:R but fewer stop-outs; drawn around the relevant group",
    "outcome": "Not a great zone, he would not trade it; later removed"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Large downward trendline",
    "reasoning": "Too massive for a daily line, likely a weekly trendline",
    "outcome": "Excluded from chain analysis (not wrong)"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Daily downtrend line then overextension",
    "reasoning": "Price got overextended, trendline irrelevant",
    "outcome": "Keep it but end it; do not extend"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Supply with no basing, huge explosive move",
    "reasoning": "Distal at the very top, size copied from other zones",
    "outcome": "Valid old zone, tracked for later"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Trendline update where recent peak makes no sense",
    "reasoning": "Used previous peak and valley instead",
    "outcome": "Trendline updated correctly"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Almost-supply: basing + explosive move but no stay-away",
    "reasoning": "Price pushed back and wicked into it",
    "outcome": "Not a zone"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Small poor-quality supply near all-time low",
    "reasoning": "Compared to other zones; it qualifies, but very poor",
    "outcome": "Drawn for mapping only; 'worked beautifully' but not a trade he'd take"
   },
   {
    "market": "EUR (his live trade)",
    "timeframe": "n/a",
    "setup": "Zone trade",
    "reasoning": "Stop probably wider than the zone; news time spread",
    "outcome": "Stopped out, likely by spread"
   }
  ],
  "qa": [
   {
    "q": "Can you show an example of a drawable zone?",
    "a": "The one down below is drawable, not really tradable, not the best. Whereas another zone is very good - he'd risk his hard-earned capital off it all day. Another drawable-not-tradable example: basing and move away fine, but the space between the stay-away candle and the proximal line is very small; he'd draw it, not trade it, even though it worked beautifully."
   },
   {
    "q": "How do you follow him (a student who went 4/4)?",
    "a": "Probably by watching his daily breakdowns and using his chart analysis. He doesn't give signals and never will (illegal); he points out good zones to look for confirmation trades. Expect a drawdown."
   },
   {
    "q": "How can I copy your setups/chart?",
    "a": "Manually: have his chart open (second monitor or phone) and redraw each zone. A member said you can make a copy from the Sunday Meeting drop-down; he'll try it, but manual seems best."
   }
  ],
  "newDiagrams": [
   {
    "id": "no-basing-zone",
    "title": "Supply with no basing",
    "caption": "Distal at the very top of the explosive move; zone height copied from your other zones.",
    "svg": "<line x1='60' y1='20' x2='60' y2='150' stroke='#94a3b8'/><rect x='40' y='30' width='12' height='60' fill='#34d399'/><line x1='46' y1='22' x2='46' y2='30' stroke='#34d399'/><rect x='56' y='28' width='12' height='110' fill='#f87171'/><line x1='62' y1='24' x2='62' y2='28' stroke='#f87171'/><rect x='72' y='120' width='12' height='30' fill='#f87171'/><rect x='30' y='24' width='280' height='16' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><text x='120' y='35' font-size='9' fill='#f87171'>distal = very top, size copied</text><rect x='200' y='110' width='100' height='16' fill='#a78bfa' fill-opacity='0.2' stroke='#a78bfa'/><text x='204' y='121' font-size='9' fill='#a78bfa'>other zone (same height)</text><text x='30' y='170' font-size='9' fill='#94a3b8'>no basing: explosive move only</text>"
   },
   {
    "id": "trendline-update-previous-peak",
    "title": "Trendline update from the previous peak",
    "caption": "Normally redraw from the recent peak; if that line makes no sense, attach to the previous peak; end the line when price overextends outside the channel.",
    "svg": "<polyline points='20,30 60,80 90,50 130,120 150,105 175,150' fill='none' stroke='#94a3b8'/><line x1='20' y1='30' x2='190' y2='110' stroke='#f87171' stroke-width='1.5'/><line x1='60' y1='80' x2='230' y2='160' stroke='#f87171' stroke-dasharray='3,3'/><text x='22' y='24' font-size='9' fill='#f87171'>previous peak</text><text x='92' y='44' font-size='9' fill='#94a3b8'>recent peak (no sense)</text><line x1='190' y1='110' x2='190' y2='115' stroke='#a78bfa'/><text x='196' y='100' font-size='9' fill='#a78bfa'>end here (overextended)</text><text x='180' y='172' font-size='9' fill='#94a3b8'>channel line</text>"
   },
   {
    "id": "all-time-low-chain",
    "title": "Every new low is an all-time low",
    "caption": "After breaking the all-time low, each drop-base-drop forms a zone under rule 3, even without breaking an obvious valley.",
    "svg": "<line x1='10' y1='60' x2='310' y2='60' stroke='#94a3b8' stroke-dasharray='4,3'/><text x='12' y='54' font-size='9' fill='#94a3b8'>obvious all-time low</text><polyline points='20,40 60,58 90,75 110,72 140,100 160,98 190,125 210,122 240,150' fill='none' stroke='#f87171' stroke-width='1.5'/><rect x='100' y='66' width='200' height='10' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><rect x='150' y='94' width='150' height='10' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><rect x='200' y='118' width='100' height='10' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><text x='250' y='170' font-size='9' fill='#a78bfa'>zone, zone, zone</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Zone qualifies if it removed an opposing zone OR removed a trendline OR made an all-time high/low",
    "detail": "any one of the three is sufficient",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zone if no stay-away candle (next candle wicks back into the zone)",
    "detail": "space between stay-away candle and proximal must exist; size judged visually, not measured",
    "plannerStep": "Zone"
   },
   {
    "rule": "Trendline removal = candle with high and low fully beyond the line (body and wick not touching)",
    "detail": "close fully below for uptrend, fully above for downtrend",
    "plannerStep": "Context"
   },
   {
    "rule": "Delay zone creation until stay-away candle closes fully beyond a trendline touching the basing",
    "detail": "applies when the trendline touches basing or explosive candle",
    "plannerStep": "Zone"
   },
   {
    "rule": "Zone removal by wick counts unless wick is emotional (huge relative to small body)",
    "detail": "normal-sized wick or body close through zone = removed",
    "plannerStep": "Zone"
   },
   {
    "rule": "Uptrend line valid only with peak, obvious valley, then higher high; downtrend inverse",
    "detail": "'obvious' valley is discretionary; uptrend line anchored on lows, downtrend on highs",
    "plannerStep": "Context"
   },
   {
    "rule": "Mark trendline irrelevant when price trades outside the channel (parallel from first peak)",
    "detail": "end the line; do not extend",
    "plannerStep": "Context"
   },
   {
    "rule": "No-basing zone: distal = extreme of the move, height = median height of other zones on same timeframe",
    "detail": "height copied visually from other zones",
    "plannerStep": "Levels"
   },
   {
    "rule": "Zone height must match standard zone size; reject if at standard size the stay-away candle touches",
    "detail": "he measured 88 and copied it; discretionary",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zone where basing range is larger than the move away",
    "detail": "discretionary",
    "plannerStep": "Zone"
   },
   {
    "rule": "Flag zone as low quality / do not trade if old (first retest much later)",
    "detail": "discretionary; old zones lack liquidity",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Flag drawable-only when gap between stay-away candle and proximal is small",
    "detail": "draw for mapping, do not trade",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Large basing: option A whole base (worse R:R, fewer stop-outs); option B zone at explosive move with stop under all basing",
    "detail": "discretionary",
    "plannerStep": "Levels"
   },
   {
    "rule": "Any candle making a new extreme low/high is an all-time low/high for rule 3",
    "detail": "each drop-base-drop after breaking ATL is a zone",
    "plannerStep": "Setup"
   },
   {
    "rule": "Warn about spread near news times when stop is close",
    "detail": "discretionary",
    "plannerStep": "Levels"
   }
  ]
 },
 {
  "n": 11,
  "title": "Chain-analysis homework review: trendline anatomy, borderline zones and homework format",
  "kind": "zoom",
  "date": "2026-10-04",
  "summary": "Kevin reviewed the AUDUSD daily chain-analysis homework (the stretch ending around 2000-2001), where the only zones allowed are ones that remove an opposing zone, remove a trendline, or make an all-time high/low. He walked through how to anchor a trendline from the highest point possible and lower it so it never cuts through candles, where a trendline is removed (a full wick-and-body close beyond it), and when to keep extending one after price overextends. Because the price action that week was very borderline, he said he would be more lenient on moves away and gave students grace on close calls, then marked each student's chart, repeatedly correcting momentum mistaken for trend and lines with no lower low/higher high. He answered questions on zones that remove nothing, which timeframes he trades (H1 and H4 with daily/weekly as higher timeframes) and whether trendlines are drawn on every timeframe, set next week's homework (Jan 2001 to Jan 2002, all-time low must be marked), asked for feedback on the homework format, and closed with a short review of students' trade screenshots.",
  "sections": [
   {
    "heading": "Opening: the homework rules (chain analysis)",
    "points": [
     "The homework is 'chain analysis': find which zones removed which zones and trendlines, following the chain across the chart.",
     "Only three kinds of zones go on the homework chart: a zone that removes an opposing zone, a zone that removes a trendline, or a zone that makes an all-time high or low.",
     "All-time high or low means exactly that, not any little high or low.",
     "You can trade differently if you want, but for the homework you must follow these rules; if you are not going to follow them, maybe don't submit the homework.",
     "First-week students not understanding it is completely reasonable; the frustration is with students on their fourth submission still drawing a zone that removed nothing.",
     "He is not saying this is the only way to trade; it is simply what the homework is testing.",
     "Last week's homework ran from January 2000 (the red line) forward, which meant the prior zone had to be properly drawn already."
    ]
   },
   {
    "heading": "Homework walkthrough part 1: the removed zone and the supply that removed it",
    "points": [
     "Nothing new appeared in the chain at the start; then a zone was removed.",
     "He uses the remove tool to end the zone exactly where it was removed rather than extending it, to keep charts very clean.",
     "The removed zone was quite large; he said that is about the smallest size of zone they are looking for in this homework (i.e. zones here are on the large side).",
     "Next step after a zone is removed: go up and look for the supply that removed it.",
     "There was an explosive candle, but drawn one way it is very close to not being a zone at all because there is no move away.",
     "He saw a supply level and said it was a weird one to draw; it could be drawn wick to wick.",
     "None of these zones were great and he would not look to trade them; the point is drawable versus tradable zones (refer to the video lessons).",
     "The result is a visible chain on the chart: this zone removed that zone. Every zone on his chart can be traced to what it removed; never just a random zone."
    ]
   },
   {
    "heading": "Trendline anatomy and anchoring",
    "points": [
     "A larger downward trendline was valid. Many students drew a steeper one, which he called too momentum-like: close, not super wrong, but not the one.",
     "The valid line had a very good peak, a very obvious valley and, more importantly, the lower low.",
     "Anchor the trendline from the highest point possible to the next peak.",
     "If the line from the highest point cuts through candles, you do not keep it; we never cut through candles for a trendline. Lower it to the next highest point.",
     "He can often tell in advance that a given anchor will cut through candles and skip straight to the anchor that will not.",
     "Structure for an upward trendline: starting point, peak, valley, higher high. A downward trendline is the inverse: starting point, valley, peak, lower low.",
     "If there is no lower low (downtrend) or higher high (uptrend), it is not a trendline, no matter how the line is drawn.",
     "A trendline must actually touch the price points it is drawn from; one student's line was not even touching.",
     "Usually do not draw very large trendlines, because then you are usually skipping trendlines in the middle; but in this homework the large one was required because the middle ones were too borderline."
    ]
   },
   {
    "heading": "Where a trendline is removed and when to keep extending",
    "points": [
     "The trendline was removed when a candle closed fully above it: a full close of wick and body beyond the line.",
     "It was not the explosive candle (which is part of a potential zone) that removed the line; removal is the first candle with full wick and body beyond the trendline.",
     "When a trendline is removed, do not continue it; end it where it was removed.",
     "Later, another trendline (blatant valley and peak, and a lower low) became almost irrelevant after a very aggressive move to the downside.",
     "He still extended it: price got overextended and fell off below the channel a bit, but it immediately pushed back into the line and somewhat respected it. If price had really fallen off, he would not have.",
     "Several students ended or edited this line; he said it should be extended but called it a very close call."
    ]
   },
   {
    "heading": "Borderline zones and leniency on moves away",
    "points": [
     "The zone that removed the trendline was a tricky situation: the basing was way too tiny, and drawing it bigger would make it not a zone; very sloppy price action.",
     "He dislikes drawing zones that combine one basing candle with another separate section of basing candles.",
     "He does not measure moves away, because what counts changes with the sizes of the candles and the moves; but this week everything was borderline.",
     "Zoom level changes the read: zoomed in, the candles all look like basing candles; zoomed out, they don't. Having the right zoom is a big deal; he suspects he sometimes looks at the bigger picture too much and moves away then look weaker.",
     "He drew that zone not base to base but in a looser form, and called it a move away.",
     "If candles are borderline, he will give students grace; he will be more lenient on moves away from now on because recent stretches of time lack the best moves.",
     "Reason for leniency: if you start homework where moves away look amazing, that becomes your grounding for what a zone is, and lesser but valid zones become hard to accept.",
     "Trading has objectivity in its rules but sometimes also subjectivity, and you have to accept that.",
     "Bad homework weeks still train you to be very patient."
    ]
   },
   {
    "heading": "All-time low as a zone source",
    "points": [
     "After the trendline sequence there was an all-time low; per the rules, an all-time low means there is potentially a zone (not that there will be one).",
     "In his view the supply that removed the all-time low was the exact same supply as before.",
     "It was a very obvious all-time low: price peaked and rallied, so everyone has seen it.",
     "Once below it, literally every new wick lower is an all-time low; every time you break a new low, that is an all-time low, 100%.",
     "Those spots are potential zones, but the price action there was terrible, so none were drawn.",
     "Finally a downward trendline was removed by a candle closing above it, leaving an area of demand with a move away that was not the best."
    ]
   },
   {
    "heading": "Marking students' homework: recurring corrections",
    "points": [
     "The correct answer had exactly two trendlines and three zones on the chart.",
     "Most common miss: the large trendline coming in, which was the necessary one; missing it caused students to miss downstream zones.",
     "Most common wrong line: a steeper line that was 'way too much like momentum' and not a trend.",
     "A zone whose wick is almost the same size as its candle is close to not being a zone; to him it is a very large basing candle. If the wick were half the size he would accept it.",
     "One student had a zone that removed the low, which he also had, but it also removed that demand; always note every removal.",
     "A drop-base-rally shape built on a single basing candle was correctly identified as DBR but was not an area of demand.",
     "'Biggest explosive move' is not enough when a wick negates it.",
     "A trendline drawn where price never made a new low is very incorrect.",
     "Peak-to-peak line where the first point is not a peak and there is no lower low: incorrect, and any zone justified by removing it is therefore not a zone.",
     "'What did this zone accomplish?' If it removed nothing, it does not belong on the homework chart.",
     "Not marking the all-time low caused students to miss the zone that formed there.",
     "He gave grace on close trendlines and borderline zones: 'it's never gonna be like, oh, you're wrong' when it is not out of left field.",
     "One student had no forced zones, which he praised."
    ]
   },
   {
    "heading": "Homework submission rules",
    "points": [
     "Submit each timeframe separately: if you have H1 and H4 zones, send the H1 and H4 charts, not just the daily, or he cannot mark them.",
     "Make sure the chart is set to the right timeframe (daily for this homework) before saving and submitting.",
     "Homework is not submitted as images; students know the rules, and he will not chase anyone for their work.",
     "Wrong-timeframe submissions cannot be marked."
    ]
   },
   {
    "heading": "Student Q&A: zones that remove nothing, timeframes, trendlines",
    "points": [
     "Zones that don't remove opposing zones: he wouldn't use them in general, but if a move is very obvious and huge, he sees no issue drawing it.",
     "He trades H1 and H4 zones; this is his own trading layout, not just for teaching.",
     "Layout: H1 chart with daily as its higher timeframe; H4 chart with weekly as its higher timeframe.",
     "He combines them: if the daily isn't showing much information for the H1, he looks at the weekly. They work in flow and in sequence.",
     "Recommendation: stick to only one timeframe to enter on, especially if new; he can handle two after 7 years of trading.",
     "Trendlines, zones, everything is drawn on any timeframe exactly the same way; he would do it identically on the 1 minute or the 1 month. Price is fractal.",
     "The trend removal and the zone are on the same timeframe in this homework, not higher vs lower."
    ]
   },
   {
    "heading": "Rethinking the homework format and next week's homework",
    "points": [
     "He considered moving away from chain analysis to random charts or recent lower timeframe charts (e.g. EURUSD FXCM 5m or 15m), but recent charts lack the prior analysis (existing zones) needed to build the chain.",
     "Lower timeframe homework is impractical because someone doing it on Saturday has to scroll back a week on a 5m chart.",
     "He looked at EURUSD weekly as an option but disliked how bad it looked; he prefers day-trading timeframes, while the daily is used just for the homework's sake.",
     "He decided to continue with the AUDUSD chain analysis because he thinks it is a great way of learning.",
     "Next week's homework: January 2001 to January 2002. The all-time low must be drawn on your chart; it's a must.",
     "He asked members (including people watching the recording) for feedback on homework and Sunday meeting formats.",
     "Idea taken up: going over students' trade reviews in future sessions. Interactive chart annotation was rejected because people never participate or it lags."
    ]
   },
   {
    "heading": "Trade review segment (students' screenshots)",
    "points": [
     "A beautiful trade by a student: very explosive move away.",
     "Another student's zone was not a zone, just a basing candle; the trade worked out but reference his chart.",
     "EURAUD 2R trade looked good, but the distal line was drawn in the wrong place: the basing is where the zone goes; never just randomly draw the distal line.",
     "Unclear charts with three random lines, or just a box where you can't see the zone, are not useful; show the zone.",
     "If the zone is far back and does not fit a normal screenshot, send both screenshots (the zone and the trade).",
     "A zone with too small a gap (not a big enough move away) is not really a good zone.",
     "Keep the trade-review channel clean: just send a trade where the zone is visible."
    ]
   }
  ],
  "rules": [
   "Only draw homework zones that remove an opposing zone, remove a trendline, or make an all-time high/low.",
   "Treat only a true all-time high/low as a zone source, not any minor high/low.",
   "End a removed zone at the point of removal; do not extend it.",
   "After a zone is removed, look for the opposing zone that removed it.",
   "Be able to say what every zone on your chart removed.",
   "Anchor a trendline from the highest (or lowest) point possible to the next peak (valley).",
   "Never let a trendline cut through candles; move the anchor to the next highest point instead.",
   "Require starting point, peak, valley, higher high for an up trendline (inverse, with a lower low, for a down trendline).",
   "Make the trendline actually touch its anchor points.",
   "Consider a trendline removed only when a candle closes fully beyond it, wick and body.",
   "Stop a trendline where it was removed; do not continue it.",
   "Keep extending a trendline after an overextension if price immediately pushes back into it and respects it.",
   "Mark every new all-time low; each new low is an all-time low.",
   "Avoid drawing very large trendlines unless the middle ones are too borderline.",
   "Draw trendlines and zones the same way on every timeframe.",
   "Stick to one entry timeframe if you are new.",
   "Place the distal line where the basing is, never at a random level.",
   "Submit each timeframe's chart separately, set to the correct timeframe, not as images.",
   "Show the zone in trade-review screenshots; send two screenshots if the zone is far back."
  ],
  "mistakes": [
   "Drawing a zone that removed nothing on the chain-analysis homework.",
   "Drawing a steep, momentum-like line as a trendline.",
   "Drawing a trendline with no lower low (or higher high), or from a point that is not a peak.",
   "Missing the large necessary trendline and thereby missing downstream zones.",
   "Calling the explosive candle the trendline removal instead of the first full wick-and-body close beyond it.",
   "Continuing a trendline after it has been removed.",
   "Ending a trendline too early after a brief overextension that price immediately reclaimed.",
   "Trendline not touching its anchor points or cutting through candles.",
   "Treating a candle with a wick almost the size of the candle as a zone (it is a large basing candle).",
   "Calling a single basing candle a demand zone just because the shape is drop-base-rally.",
   "Not marking the all-time low, so the zone there is missed.",
   "Combining separate sections of basing candles into one zone.",
   "Wrong zoom level making moves away look stronger or weaker than they are.",
   "Sending a daily chart when the zones are on H1/H4, or submitting homework as images or on the wrong timeframe.",
   "Drawing the distal line randomly away from the basing.",
   "Posting trade screenshots where the zone can't be seen."
  ],
  "quotes": [
   "We only have zones on our charts that remove an opposing zone, removes a trend line, or makes an all-time high or low.",
   "We're never really going to cut through candles for a trendline.",
   "When we have a trend line removed, we don't continue the trend line, we end it where it was removed.",
   "Every time you break a new low, that's an all-time low, 100%.",
   "A trend line looks like this. Peak, valley, lower low, removed.",
   "Doesn't matter if I was trading the 1 minute or the 1 month, it would be the same thing.",
   "There's objectivity, but sometimes there is some subjectivity, so we have to accept that.",
   "Make sure you show the zone."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Peak, valley, lower low: anchor at the highest point possible and lower it to the next highest point if the line would cut through candles."
   },
   {
    "key": "trend-momentum",
    "caption": "The steep line most students drew was momentum; the valid one had an obvious peak, valley and lower low."
   },
   {
    "key": "zone-removed",
    "caption": "End the removed zone with the remove tool at the removal point, then look for the opposing zone that removed it (the chain)."
   },
   {
    "key": "quality",
    "caption": "Drawable vs tradable: this week's chain zones were drawable for the chain but none were worth trading."
   },
   {
    "key": "mtf",
    "caption": "His layout: H1 with daily above it, H4 with weekly above it; fall back to the weekly when the daily shows little."
   },
   {
    "key": "draw",
    "caption": "Distal goes at the basing (EURAUD trade review); a wick almost as large as the candle makes it just a big basing candle."
   }
  ],
  "checklist": [
   "Does this zone remove an opposing zone, remove a trendline, or make an all-time high/low?",
   "Can I name exactly what this zone removed?",
   "Is this a trend (clear peak, valley, lower low/higher high) or momentum?",
   "Is my trendline anchored at the highest/lowest point possible without cutting through candles?",
   "Does the line touch its anchors?",
   "Has any candle closed fully (wick and body) beyond the trendline? If so, end it there.",
   "If price overextended past the line, did it immediately push back and respect it?",
   "Is the all-time high/low marked?",
   "Is the wick so big relative to the candle that this is just a large basing candle?",
   "Is the zone drawn on a single clear basing section, with the distal at the basing?",
   "Is my zoom appropriate when judging the move away?",
   "Is the chart on the correct timeframe before saving/submitting?"
  ],
  "journalTags": [
   "zone removed nothing",
   "momentum not trend",
   "no lower low",
   "no higher high",
   "trendline cuts candles",
   "trendline not touching",
   "trendline not ended at removal",
   "trendline ended early",
   "wrong removal candle",
   "all-time low not marked",
   "wick too large",
   "single basing candle",
   "distal not at basing",
   "wrong timeframe submitted",
   "zoom misjudged move away",
   "multiple entry timeframes"
  ],
  "newVsPdfs": [
   "Formal chain-analysis homework rule set: only zones that remove an opposing zone, remove a trendline, or make an all-time high/low; every new low below an all-time low is itself an all-time low.",
   "Trendline removal defined precisely as the first candle with a full wick-and-body close beyond the line (not the explosive candle), and the line is ended there.",
   "Trendline anchoring: start from the highest point possible and lower to the next highest point when the line would cut through candles; must touch anchors; explicit four-point structure (start, peak, valley, higher high / inverse).",
   "Keep extending a trendline after an overextension if price immediately pushes back into and respects it.",
   "Avoid very large trendlines because they skip middle ones, except when the middle ones are too borderline.",
   "He does not measure moves away; zoom level changes whether candles look like basing, and he is now more lenient on borderline moves away.",
   "A candle whose wick is nearly the candle's size is a large basing candle, not a zone; a DBR shape on one basing candle is not demand.",
   "Explicit layout: H1 paired with daily, H4 paired with weekly, falling back to weekly when daily is uninformative; new traders should use one entry timeframe.",
   "Zones that remove nothing: generally not used, but a very obvious huge move can still be drawn.",
   "Homework/trade-review submission standards (separate timeframes, correct timeframe, not images, zone visible, send both screenshots)."
  ],
  "examples": [
   {
    "market": "AUDUSD",
    "timeframe": "Daily",
    "setup": "Large demand zone removed; search for the supply that removed it",
    "reasoning": "Zone ended with the remove tool at the point of removal. The candidate supply had an explosive candle but almost no move away, so it was drawn wick to wick as a weird, borderline supply level",
    "outcome": "Drawable for the chain, not a zone he would trade"
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily",
    "setup": "Large downward trendline: peak, obvious valley, lower low",
    "reasoning": "Anchored from the highest point possible to the next peak; that cut through candles, so lowered to the next highest point. The steeper line many students drew was too momentum-like",
    "outcome": "Valid trendline; removed later by the first candle closing fully (wick and body) above it, not by the explosive candle"
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily",
    "setup": "Demand zone that removed the trendline",
    "reasoning": "Basing too tiny, sloppy price action, two basing sections combined; drawn loosely, not base to base, and accepted as a move away with leniency",
    "outcome": "Borderline zone accepted on the chart; later removed"
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily",
    "setup": "Second downward trendline after an aggressive drop",
    "reasoning": "Price overextended and fell below the channel but immediately pushed back into it and respected it",
    "outcome": "Line kept and extended (close call)"
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily",
    "setup": "Obvious all-time low broken",
    "reasoning": "All-time low means a potential zone; the supply that removed it was the same supply. Every new wick lower is an all-time low but price action was terrible",
    "outcome": "No additional zones drawn; afterwards a downward trendline was removed by a close above, leaving a weak area of demand"
   },
   {
    "market": "EURAUD",
    "timeframe": "unspecified",
    "setup": "Student trade review, 2R winner",
    "reasoning": "Trade looked good but the distal line was placed away from the basing",
    "outcome": "Correction: the zone goes where the basing is; never draw the distal randomly"
   },
   {
    "market": "unspecified",
    "timeframe": "unspecified",
    "setup": "Student trade reviews",
    "reasoning": "One had a very explosive move away (beautiful); one was just a basing candle; one had too small a gap",
    "outcome": "Winning trades on non-zones still flagged as not zones"
   }
  ],
  "qa": [
   {
    "q": "Is the trend removal on the higher timeframe and the zone on the lower timeframe?",
    "a": "No, everything is on the same timeframe. It has nothing to do with timeframes; price is fractal, so it doesn't make much difference."
   },
   {
    "q": "How important are 'proven' zones, i.e. zones that don't remove opposing zones?",
    "a": "He wouldn't use them. But if a move is very obvious, e.g. a huge explosive move that didn't remove anything, he doesn't see an issue with drawing it."
   },
   {
    "q": "What timeframe do you use most for entering and looking for zones?",
    "a": "H1 and H4, those are the zones he trades. His layout: H1 with the daily as its higher timeframe, H4 with the weekly as its higher timeframe; if the daily isn't showing much he looks at the weekly, so they work in flow and in sequence. He recommends sticking to one entry timeframe, especially if new; he can handle two after 7 years."
   },
   {
    "q": "Do we draw trendlines on both timeframes?",
    "a": "Trendlines are drawn on any timeframe. Trendlines, zones, everything he does on the H1 he does on the daily exactly the same way, whether 1 minute or 1 month."
   },
   {
    "q": "A student found the submission confusing (sent a daily chart with H1/H4 zones on it).",
    "a": "Very easy: make sure the chart is on the correct timeframe (the daily for this homework) and hit save. If you have H1 and H4 zones, send those charts separately or he cannot see or mark them."
   },
   {
    "q": "Suggestion: interactive analysis where everyone annotates the chart, or posting finished trades for review.",
    "a": "Interactive annotation has been tried and never works (nobody participates or it's laggy). Going over trade reviews is a good idea; he may start next week with trade reviews and lessons from them."
   }
  ],
  "newDiagrams": [
   {
    "id": "trendline-full-close-removal",
    "title": "Trendline removal = full close beyond the line",
    "caption": "The explosive candle pierces the downtrend line, but the line is removed only by the first candle whose wick AND body close fully above it; the line ends there.",
    "svg": "<line x1='20' y1='30' x2='230' y2='130' stroke='#f87171' stroke-width='1.5'/><line x1='40' y1='30' x2='40' y2='80' stroke='#f87171'/><rect x='35' y='38' width='10' height='32' fill='#f87171'/><line x1='80' y1='70' x2='80' y2='120' stroke='#f87171'/><rect x='75' y='78' width='10' height='30' fill='#f87171'/><line x1='120' y1='100' x2='120' y2='150' stroke='#f87171'/><rect x='115' y='110' width='10' height='30' fill='#f87171'/><line x1='160' y1='85' x2='160' y2='150' stroke='#34d399'/><rect x='155' y='95' width='10' height='50' fill='#34d399'/><line x1='195' y1='88' x2='195' y2='104' stroke='#34d399'/><rect x='190' y='90' width='10' height='12' fill='#34d399'/><circle cx='195' cy='110' r='3' fill='#a78bfa'/><text x='140' y='170' fill='#94a3b8' font-size='9'>explosive candle: not the removal</text><text x='205' y='85' fill='#a78bfa' font-size='9'>full wick+body</text><text x='205' y='96' fill='#a78bfa' font-size='9'>close above = removed</text><text x='20' y='20' fill='#94a3b8' font-size='9'>downtrend line ends here, not extended</text>"
   },
   {
    "id": "trendline-anchor-no-cut",
    "title": "Anchor high, then lower to avoid cutting candles",
    "caption": "Start from the highest point possible; if the line to the next peak cuts through candles, lower the anchor to the next highest point. Valid only once a lower low prints.",
    "svg": "<line x1='30' y1='20' x2='30' y2='60' stroke='#f87171'/><rect x='25' y='25' width='10' height='30' fill='#f87171'/><line x1='60' y1='35' x2='60' y2='80' stroke='#f87171'/><rect x='55' y='40' width='10' height='30' fill='#f87171'/><line x1='100' y1='70' x2='100' y2='120' stroke='#34d399'/><rect x='95' y='80' width='10' height='30' fill='#34d399'/><line x1='140' y1='50' x2='140' y2='95' stroke='#f87171'/><rect x='135' y='55' width='10' height='30' fill='#f87171'/><line x1='190' y1='110' x2='190' y2='160' stroke='#f87171'/><rect x='185' y='115' width='10' height='35' fill='#f87171'/><line x1='30' y1='20' x2='140' y2='50' stroke='#94a3b8' stroke-dasharray='4 3'/><text x='70' y='22' fill='#f87171' font-size='9'>cuts candle - no</text><line x1='60' y1='35' x2='140' y2='50' stroke='#a78bfa' stroke-width='1.5'/><line x1='140' y1='50' x2='260' y2='72' stroke='#a78bfa' stroke-width='1.5'/><text x='200' y='60' fill='#a78bfa' font-size='9'>next highest point</text><text x='85' y='135' fill='#94a3b8' font-size='9'>valley</text><text x='150' y='175' fill='#94a3b8' font-size='9'>lower low confirms the line</text><line x1='90' y1='120' x2='280' y2='120' stroke='#94a3b8' stroke-dasharray='2 3'/>"
   }
  ],
  "botRules": [
   {
    "rule": "Only register a zone if it removes an opposing zone, removes a trendline, or creates an all-time high/low",
    "detail": "All-time = beyond every prior price in the data; minor swing highs/lows don't count. Exception (discretionary): a very obvious huge move may be drawn",
    "plannerStep": "Zone"
   },
   {
    "rule": "Mark a zone removed and stop extending it at the removal candle",
    "detail": "End at removal point; then search for the opposing zone that caused the removal",
    "plannerStep": "Zone"
   },
   {
    "rule": "Validate a trendline only with full structure",
    "detail": "Up: start, peak, valley, higher high. Down: start, valley, peak, lower low. No new extreme = no trendline",
    "plannerStep": "Context"
   },
   {
    "rule": "Anchor trendline at the most extreme point and lower if it intersects candles",
    "detail": "Iterate anchors from highest (down line) to next highest until no candle between anchors is cut; line must touch anchors",
    "plannerStep": "Context"
   },
   {
    "rule": "Reject trendlines on momentum",
    "detail": "discretionary: steep near-straight moves without obvious peaks/valleys are momentum",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removed when a candle closes fully beyond it",
    "detail": "Whole candle (wick and body) beyond the line; piercing/explosive candle alone does not remove it; end the line at that candle",
    "plannerStep": "Context"
   },
   {
    "rule": "Keep a trendline after overextension if price immediately returns",
    "detail": "discretionary: price falls below/above the channel but immediately pushes back into it and respects it",
    "plannerStep": "Context"
   },
   {
    "rule": "Each new low beyond the all-time low is a new all-time low and a potential zone source",
    "detail": "Potential only; still requires valid basing and move away",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zone when basing candle wick is nearly the size of the candle",
    "detail": "Wick about equal to candle = large basing candle; acceptable at roughly half that size (his example)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Do not merge separate basing sections into one zone",
    "detail": "discretionary",
    "plannerStep": "Zone"
   },
   {
    "rule": "Place distal at the basing",
    "detail": "Never at an arbitrary level away from the basing candles",
    "plannerStep": "Levels"
   },
   {
    "rule": "Use H1 with daily and H4 with weekly as higher timeframes",
    "detail": "If daily shows little information for H1, consult weekly; beginners use a single entry timeframe",
    "plannerStep": "Setup"
   },
   {
    "rule": "Downgrade zones on borderline move away to drawable-only",
    "detail": "discretionary; moves away are not measured, judged relative to candle sizes at an appropriate zoom",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 13,
  "title": "Trendlines vs momentum, updated trendlines and the two exceptions to the drawing rules",
  "kind": "zoom",
  "date": "2026-10-18",
  "summary": "After a tough trading week, Kevin re-teaches the trendline concept (obvious peak and valley plus a break of the pivot high/low) and when he does NOT follow the chain-analysis drawing rules: confirmation off a very convincing higher-timeframe zone, and macro charts (1 month and up). He then walks the AUDUSD daily chain analysis from January 2002 to January 2003, showing how to attach a trendline without cutting candles, how to update a trendline from the most recent valley, how to end overextended trendlines and removed zones, and how to size zones consistently. Homework reviews focus on missed trendlines and missed updated trendlines, and trade reviews cover zones drawn too large for the timeframe, the 'third zone in a range' warning, overextended markets and a 10/10 NASDAQ zone that still failed. Homework for next week is AUDUSD daily on FXCM, January 2003 to January 2004.",
  "sections": [
   {
    "heading": "Opening: a tough week is normal",
    "points": [
     "Last week was a very tough trading week for him too, after a little over 7 years of trading.",
     "If you struggled, don't worry: keep taking the setups. Weeks like this happen a few times a year; it is the nature of the beast.",
     "The plan for the session: trendlines (a member asked about them), homework review, then trade reviews from the Discord."
    ]
   },
   {
    "heading": "Trendline vs momentum",
    "points": [
     "A steep move with small peaks and valleys is momentum, not a trendline. A trendline needs an OBVIOUS, deep peak and valley.",
     "He does not measure the peak/valley depth. A member measured it (about 50%) and that may be reasonable, but for him it is purely visual: it saves time and is accurate enough. You can build a measuring system if you want.",
     "An obvious valley alone is not enough. After the obvious valley, price must break the pivot high that came before it (uptrend). Then it is a trendline.",
     "Downtrend line: valley, peak, then a lower low.",
     "Example: obvious peak, obvious valley, broke the high after the valley - trendline drawn from the valley to the next touch.",
     "Borderline cases exist: a peak, valley and lower low that are close but not as obvious - he does not draw it. Without measuring, the odd one may not be 100% right, but it is good enough.",
     "There is no single video for adjusting trendlines because every situation differs; that is why the Sunday meetings, homework and chain analysis exist."
    ]
   },
   {
    "heading": "When to draw zones, and the only two exceptions",
    "points": [
     "Only draw a zone when it does one of three things: removes an opposing zone, removes a trendline, or makes an all-time high/low.",
     "Exception 1 - confirmation, but only when he is very convinced by the higher-timeframe zone (a very good zone with a great move away, not a barely qualifiable one).",
     "Why: often price makes one massive aggressive candle into the HTF zone with no trendline and no opposing zones to remove. The entry-timeframe zone that forms at the HTF zone cannot remove anything because the pullback was too aggressive, so he accepts it if it has a good move away.",
     "Exception 2 - macro charts (1 month and up: 1M, 3M, 6M, 12M). Zones are harder to get there, so any explosive move is valuable whether or not it did one of the three things.",
     "Even in these cases he still much prefers to follow the rules."
    ]
   },
   {
    "heading": "AUDUSD daily walkthrough part 1 (Jan 2002 - Jan 2003): trendline removal and zone sizing",
    "points": [
     "A trendline was removed by a supply zone. Compare move-aways: one decent, one great; the trade off it was maybe break-even.",
     "That supply qualified because it removed the trendline (rule 2). The trendline was removed when the candle CLOSED fully below it, body and wick - not by the earlier candle.",
     "That supply was then removed by a demand zone. Drawn wick to body it is far too small; wick to wick looks decent compared with the other zone sizes - slightly smaller but not too small.",
     "If a zone is too small for his liking, just make it a little bigger. In a safer situation you can draw it up to where it was tested later, but he did not do that here.",
     "Zoomed out there is a larger trendline, but with the channel tool you can see price got very overextended from it, so he does not use it (having it is understandable).",
     "Explosive moves that removed nothing are not zones - 'what did it accomplish? Nothing.' That is momentum."
    ]
   },
   {
    "heading": "Part 2: attaching the trendline without cutting candles",
    "points": [
     "A good-enough peak and valley appears, so a trendline is drawn from that valley.",
     "Attach to the lowest point of the valley first. Here that line cut through candles, so keep the second point and move to the next lowest point that does not cut through candles.",
     "A trendline start that looks random is not random: it is the lowest point possible, adjusted so it does not cut through candles.",
     "Extend the trendline up to where it was removed and no further.",
     "A zone that was respected then broken: delete it with the remove tool and END it where it was removed - do not extend it past that. Extending makes charts sloppy.",
     "Then find the zone that removed it: small candles are not good enough; the standout explosive candle, on par with the other explosive moves used, is the zone. Not a coincidence.",
     "It was an older zone, so trading it would have made him a little nervous."
    ]
   },
   {
    "heading": "Part 3: updated trendlines",
    "points": [
     "Price broke above a high after an obvious valley, so there is a new, updated trendline.",
     "When there is an updated trendline, END the old one around that point (he had extended it thinking it was the only one).",
     "Do not start the new line from the bottom again. Start from the MOST RECENT valley: the old line's second touchpoint becomes the first point of the new line.",
     "The new trendline was removed by the first candle that did not touch the line with body or wick - he first picked the wrong candle and corrected himself; candles still touching the line do not count.",
     "The massive explosive candle there is the demand/supply zone (large zone). Not his favourite: explosive move and stay-away candle present, but little space between the stay-away candle and the zone. Still a nice trade, and price pulled back to another zone too - a great year for daily zones on the Aussie."
    ]
   },
   {
    "heading": "Part 4: downtrend line at the exact top, tricky basing",
    "points": [
     "Obvious valley, obvious peak, lower low: a downtrend line from the highest point.",
     "He expected it to cut through a candle; it only touched (did not cut through), so starting at the exact top was correct. If the wick were slightly bigger he would have moved the start point.",
     "Reference zone sizes: stick to similar sizes across the chart - don't draw one far larger than needed.",
     "Trendline removed when a candle closed above it (not the earlier candle). The explosive move signals demand.",
     "Drawing is tricky with many basing candles: drawing it huge makes no sense when you don't have to, one candle is too small, so use both green basing candles and leave out the red one."
    ]
   },
   {
    "heading": "Part 5: multiple updated trendlines and overextension",
    "points": [
     "Another obvious peak, valley and higher high gives a trendline (you may use a wick he does not love).",
     "That trendline was removed but no supply removed it, so the chain analysis just ends there.",
     "Another peak and valley formed, so draw a new trendline from the most recent valley; then yet another peak and valley gave another update from the newest valley. This is where trendlines get tricky.",
     "The newest trendline got very overextended, so do not continue it; just end it there.",
     "An already-tested supply being removed is no surprise. It was removed by an obvious single-candle-basing demand - his favourite kind - with nice spacing and an explosive move away."
    ]
   },
   {
    "heading": "Homework review",
    "points": [
     "Most common error: missing updated trendlines and the trendlines after them, which then makes you miss the zones that remove them.",
     "Borderline trendlines drawn by students got grace; it is either-or.",
     "Only end a trendline when there is a new (updated) trendline; when there is one, end/delete the old one about 95% of the time.",
     "Do not draw momentum lines at all.",
     "If you missed a zone, you still have to put it on your chart, because you need to see what removes it later.",
     "A student drew two zones where only one removed the opposing zone; the other removed nothing.",
     "A student's demand was right but for the wrong reason: it removed a different supply than the one they marked - fix the chain.",
     "A technically correct trendline that did not affect the chain analysis does not need to be drawn.",
     "Overextended trendline means price got so far from the line that it becomes irrelevant; you want price trading in the range of the line.",
     "Homework on the wrong chart (1H, 15m, ICE) cannot be marked. It must be AUDUSD, FXCM broker, daily chart, saved on the daily before the meeting."
    ]
   },
   {
    "heading": "Next week's homework",
    "points": [
     "AUDUSD one-day chart, FXCM, from January 2003 to January 2004.",
     "First copy his zones onto your chart EXACTLY as he drew them so your distal lines match his and you can see what removed what.",
     "You may use the chart for anything during the week, but before the meeting it must be saved on the daily AUDUSD FXCM chart.",
     "He is hard on the instructions because he cares and wants paying members to participate."
    ]
   },
   {
    "heading": "Trade reviews: what he liked and disliked",
    "points": [
     "1H supply in a bearish daily: in the daily breakdown he had a bad feeling - in tight price action where one zone is removed then another, the third zone more often than not fails because price is ranging. That is how he avoided the loss.",
     "The same market was overextended, so even if taken, use aggressive trade management; a far target is chasing.",
     "A 15m zone without an explosive move: only the lower gap zone was the trade.",
     "USDCAD 1R: great trade, but he prefers the entry just a little before the proximal line, giving wiggle room below, rather than far above.",
     "Gold 1H/5m 1:3: good trade, but the line drawn was not a trendline because the low was not broken after the peak.",
     "EURUSD loss: buying 5m demand while very overextended is risky; a 1H or 4H zone is better because a 1H turnaround means more than a 5m one. Basing candle as big as the move-away candle and a small gap - not a great zone.",
     "5m demand drawn including all basing candles: really a 15m or 1H zone on a 5m chart - not wrong, but the wrong timeframe; a smaller single-candle-basing zone would have been its own nice trade.",
     "CADJPY loss: good trade with liquidity, move away could be better - just a loss.",
     "15m winner off an old zone with no reaction at the liquidity: he would not have taken it unless it was a 4H set-and-forget.",
     "S&P 1H and NASDAQ 4H all-time-high zone: removed the trendline, liquidity, great basing, great move away - a 10/10 zone that failed. Don't get frustrated; it happens.",
     "Trading an entire daily zone on NASDAQ is fine - a great trade too."
    ]
   },
   {
    "heading": "Mindset and wrap-up",
    "points": [
     "This week tests your emotions. Usually the week after a bad week is decent, but nothing is guaranteed.",
     "Post trade reviews in the trade review channel; questions about them go in the questions channel to keep things clean.",
     "He will try to do trade reviews every Sunday because there is a lot to learn from them."
    ]
   }
  ],
  "rules": [
   "Draw a trendline only after an obvious peak and valley AND a break of the prior pivot high (uptrend) or low (downtrend).",
   "Judge trendline peaks/valleys visually; do not draw borderline ones.",
   "Only draw zones that remove an opposing zone, remove a trendline or make an all-time high/low.",
   "Break that rule only for confirmation off a very convincing HTF zone, or on macro charts (1 month and up).",
   "A trendline is removed only when a candle closes fully beyond it, body and wick not touching the line.",
   "Attach the trendline at the lowest/highest point; if it cuts candles, move to the next point that doesn't.",
   "When an updated trendline forms, end the old one and start the new one from the most recent valley/peak.",
   "End an overextended trendline instead of extending it.",
   "End a removed zone exactly where it was removed; do not extend it.",
   "Keep zone sizes consistent; enlarge a too-small zone slightly, don't make it needlessly large.",
   "Do not draw momentum lines.",
   "Draw missed zones on your chart anyway so you can see what removes them.",
   "Copy his zones exactly before starting the next homework period.",
   "Do homework on AUDUSD, FXCM, daily, and leave it saved on the daily.",
   "Manage aggressively when entering in an overextended market.",
   "Draw zones to fit the timeframe you are trading."
  ],
  "mistakes": [
   "Treating momentum (small peaks and valleys) as a trendline.",
   "Drawing a trendline after an obvious valley without the pivot high being broken.",
   "Missing updated trendlines, which cascades into missing the zones after them.",
   "Starting an updated trendline from the original bottom instead of the most recent valley.",
   "Picking a candle that still touches the trendline as the removal candle.",
   "Extending removed zones or overextended trendlines across the chart (sloppy charts).",
   "Drawing zones that removed nothing.",
   "Drawing a 15m/1H-sized zone on a 5m chart.",
   "Entering far above the proximal line instead of just before it.",
   "Trading the third zone in tight ranging price after two zones were removed.",
   "Chasing overextended markets with 5m entries.",
   "Taking zones whose basing candle is as big as the move-away candle.",
   "Doing homework on the wrong broker or timeframe.",
   "Getting frustrated when a 10/10 zone fails."
  ],
  "quotes": [
   "We will get weeks like this a few times a year. It's the nature of the beast.",
   "This is not a trend line. This is momentum.",
   "What did it accomplish? Nothing. That's why we don't have them.",
   "I'm not choosing a random spot here to draw my trend line.",
   "Single candle basings are my favorite.",
   "This is like a 10 out of 10 zone. And it failed.",
   "I'm your teacher. I gotta be hard on you guys, and that's because I care."
  ],
  "diagrams": [
   {
    "key": "trend-momentum",
    "caption": "Obvious deep peak and valley plus a pivot break = trendline; shallow small swings = momentum."
   },
   {
    "key": "trendline",
    "caption": "Attach at the lowest point; if it cuts candles move to the next point. Updated lines start from the most recent valley."
   },
   {
    "key": "zone-removed",
    "caption": "Trendline removed by the first full close with no body or wick touching; the explosive candle there is the zone."
   },
   {
    "key": "remove-limit",
    "caption": "End a removed zone where it was removed; don't extend it across the chart."
   },
   {
    "key": "confirmation",
    "caption": "Exception: an ETF zone formed after an aggressive move into a very good HTF zone can be used even if it removed nothing."
   },
   {
    "key": "draw",
    "caption": "Wick to wick vs wick to body sizing; use only the needed basing candles."
   }
  ],
  "checklist": [
   "Is there an obvious peak and valley and was the pivot broken?",
   "Is there a newer trendline that replaces the old one?",
   "Does the trendline cut through any candles?",
   "Is price overextended from the trendline (channel tool)?",
   "Did this zone remove a zone, a trendline or make an all-time high (or is it a valid exception)?",
   "Is the zone sized consistently and for the right timeframe?",
   "Is there space between the stay-away candle and the zone?",
   "Is this the third zone in a tight range after two removals?",
   "Is the market overextended, requiring aggressive management?",
   "Did the old zone get a reaction at the liquidity?"
  ],
  "journalTags": [
   "momentum as trendline",
   "pivot not broken",
   "missed updated trendline",
   "trendline cuts candles",
   "overextended trendline",
   "zone removed nothing",
   "zone too big for timeframe",
   "entry far from proximal",
   "third zone in range",
   "chasing overextended",
   "old zone no reaction",
   "frustrated after good loss"
  ],
  "newVsPdfs": [
   "The two explicit exceptions to the 'remove a zone / trendline / all-time high' drawing rule: confirmation off a very convincing HTF zone after an aggressive one-candle pullback, and macro charts (1M, 3M, 6M, 12M) where any explosive move counts.",
   "Trendline validity explicitly needs the pivot high (or low) BEFORE the obvious valley (peak) to be broken; he judges depth visually, no 50% measure.",
   "Updated trendlines: end the old line (about 95% of the time) and start the new one from the most recent valley - the old second touchpoint becomes the new first point.",
   "End removed zones exactly where they were removed; extending them is sloppy.",
   "Third zone in tight ranging price after two removals tends to fail - his reason for skipping a 1H supply.",
   "A zone drawn including all basing candles on a 5m chart is really a 15m/1H zone - match zone size to the timeframe.",
   "A 1H/4H turnaround means more than a 5m one when the market is overextended; enter just before the proximal for wiggle room.",
   "Missed zones must still be drawn so later removals can be tracked; technically correct trendlines that don't affect the chain need not be drawn."
  ],
  "examples": [
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Supply that removed a trendline",
    "reasoning": "Qualified by rule 2 (trendline removed on the full close below the line). Move away decent, not great.",
    "outcome": "Maybe break-even trade."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Demand that removed that supply, drawn wick to wick",
    "reasoning": "Wick to body too small; wick to wick similar to other zone sizes; enlarge slightly if too small.",
    "outcome": "Valid zone in the chain."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Older standout explosive candle that removed a respected zone",
    "reasoning": "Small candles not good enough; the explosive candle matches the other explosive moves.",
    "outcome": "Valid but old, would have made him nervous."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Large zone after the updated trendline was removed",
    "reasoning": "Removed on the first candle not touching the line; explosive move and stay-away present, but little space.",
    "outcome": "Nice trade; pullback to another zone too."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Demand with several basing candles after a downtrend line removal",
    "reasoning": "Use both green basing candles, exclude the red one; avoid an oversized zone.",
    "outcome": "Drawn as the zone."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Daily (FXCM)",
    "setup": "Single-candle-basing demand removing tested supply",
    "reasoning": "His favourite basing, nice spacing, explosive move away, removed supply.",
    "outcome": "Valid demand."
   },
   {
    "market": "Unspecified (student)",
    "timeframe": "1H, daily bearish",
    "setup": "1H supply after previous demand taken out",
    "reasoning": "Third zone in tight ranging price after two zones removed tends to fail; also overextended.",
    "outcome": "He avoided it; aggressive management if taken."
   },
   {
    "market": "USDCAD",
    "timeframe": "Intraday",
    "setup": "Demand, entry well above proximal",
    "reasoning": "Great trade, but he enters just before the proximal for wiggle room.",
    "outcome": "1R win."
   },
   {
    "market": "Gold",
    "timeframe": "1H / 5m",
    "setup": "1H supply in control, demand removed",
    "reasoning": "Line drawn was not a trendline (low not broken after peak); supply not the best.",
    "outcome": "1:3 win."
   },
   {
    "market": "EURUSD",
    "timeframe": "15m / 5m",
    "setup": "Gap demand while overextended",
    "reasoning": "Day-trading timeframes while overextended is risky; basing candle the size of the move-away; small gap.",
    "outcome": "Loss."
   },
   {
    "market": "Unspecified (student)",
    "timeframe": "5m",
    "setup": "Large demand including all basing candles",
    "reasoning": "Really a 15m/1H zone on a 5m chart; smaller single-candle zone was its own trade.",
    "outcome": "2.34R win."
   },
   {
    "market": "CADJPY",
    "timeframe": "Intraday",
    "setup": "Zone with liquidity",
    "reasoning": "As good as it gets for liquidity; move away could be better.",
    "outcome": "Stop loss hit - good trade, just a loss."
   },
   {
    "market": "Unspecified (student)",
    "timeframe": "15m",
    "setup": "Old supply, no reaction at the liquidity",
    "reasoning": "Would only be better as a 4H set-and-forget.",
    "outcome": "1:2 win, he would not have taken it."
   },
   {
    "market": "NASDAQ / S&P",
    "timeframe": "4H / 1H",
    "setup": "All-time-high supply that removed the trendline",
    "reasoning": "Liquidity, great basing, great move away: 10/10.",
    "outcome": "Failed - it happens."
   },
   {
    "market": "Unspecified (student)",
    "timeframe": "Weekly / 3M context",
    "setup": "Uptrend weekly, wide entry",
    "reasoning": "Wide entries sometimes play out well.",
    "outcome": "1:3.4 win."
   }
  ],
  "qa": [
   {
    "q": "Was that a downside trendline?",
    "a": "Yes - valley, peak and a lower low, so it would have been a downward trendline. He agreed after checking."
   },
   {
    "q": "What is an overextended trendline?",
    "a": "When price gets too far away from the trendline, which makes it pretty much irrelevant. You want price trading in the range of the line; when it runs far away (check with the channel tool), end the line."
   },
   {
    "q": "Should I end the old trendline here?",
    "a": "Don't end a trendline unless there is a new one. When there is an updated trendline, end the original one (about 95% of the time)."
   },
   {
    "q": "Why is this explosive move not a zone?",
    "a": "Because it accomplished nothing - it did not remove an opposing zone, a trendline or make an all-time high. That is momentum."
   },
   {
    "q": "How do I get the homework right?",
    "a": "Go to AUDUSD, make sure the broker is FXCM and the chart is daily, and save it on the daily before the meeting. Message him if you need help."
   }
  ],
  "newDiagrams": [
   {
    "id": "updated-trendline",
    "title": "Updated trendline from the most recent valley",
    "caption": "Old line (muted) ends when a new valley and higher high form; the new line starts at the most recent valley (old second touch).",
    "svg": "<line x1='20' y1='160' x2='170' y2='110' stroke='#94a3b8' stroke-width='1.5' stroke-dasharray='4 3'/><line x1='120' y1='127' x2='300' y2='60' stroke='#34d399' stroke-width='2'/><polyline points='20,160 60,95 90,140 120,127 150,70 175,105 205,50 240,85 270,30' fill='none' stroke='#94a3b8' stroke-width='1'/><circle cx='20' cy='160' r='3' fill='#94a3b8'/><circle cx='120' cy='127' r='3' fill='#a78bfa'/><circle cx='175' cy='105' r='3' fill='#34d399'/><text x='24' y='174' fill='#94a3b8' font-size='9'>old start</text><text x='86' y='150' fill='#a78bfa' font-size='9'>recent valley = new start</text><text x='210' y='44' fill='#34d399' font-size='9'>higher high</text><text x='130' y='18' fill='#94a3b8' font-size='10'>End old line, redraw from recent valley</text>"
   },
   {
    "id": "third-zone-range",
    "title": "Third zone in tight price action",
    "caption": "When zone 1 and zone 2 get removed in tight ranging price, the third zone more often than not fails.",
    "svg": "<rect x='30' y='60' width='70' height='16' fill='#f87171' fill-opacity='0.25' stroke='#f87171'/><text x='34' y='71' fill='#f87171' font-size='9'>zone 1 removed</text><rect x='110' y='50' width='70' height='16' fill='#f87171' fill-opacity='0.25' stroke='#f87171'/><text x='114' y='61' fill='#f87171' font-size='9'>zone 2 removed</text><rect x='190' y='42' width='110' height='16' fill='#a78bfa' fill-opacity='0.25' stroke='#a78bfa'/><text x='194' y='53' fill='#a78bfa' font-size='9'>3rd zone: likely fails</text><polyline points='30,110 50,72 70,115 90,62 110,120 130,58 150,112 170,50 195,118 215,48 240,105 265,40 300,30' fill='none' stroke='#94a3b8' stroke-width='1'/><text x='30' y='160' fill='#94a3b8' font-size='10'>Ranging: avoid the third zone</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Trendline valid only after obvious peak + valley and break of the prior pivot",
    "detail": "Uptrend: valley then break of the pivot high before it; downtrend: peak then lower low. Depth judged visually (discretionary; a member's ~50% measure is optional).",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removal candle",
    "detail": "First candle that closes beyond the line with neither body nor wick touching it.",
    "plannerStep": "Context"
   },
   {
    "rule": "Updated trendline replaces old",
    "detail": "On a new obvious valley + higher high (or peak + lower low), end the old line and anchor the new one at the most recent valley/peak; ~95% of the time delete the old.",
    "plannerStep": "Context"
   },
   {
    "rule": "Ignore overextended trendlines",
    "detail": "If price moves far outside the channel of the line (channel tool), end the line; discretionary distance.",
    "plannerStep": "Context"
   },
   {
    "rule": "Zone must remove something",
    "detail": "Require removal of an opposing zone, a trendline, or an all-time high/low.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Exception: HTF-convinced confirmation",
    "detail": "Allow an ETF zone that removed nothing only if the HTF zone is very high quality and price pulled back aggressively into it; ETF zone needs a good move away.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Exception: macro charts",
    "detail": "On 1M, 3M, 6M, 12M any explosive move qualifies as a zone.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Avoid third zone in a range",
    "detail": "If two consecutive zones were removed in tight ranging price, flag the third as low odds (more often than not fails).",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Overextended market management",
    "detail": "When overextended, prefer 1H/4H zones over 5m and use aggressive trade management / nearer target; discretionary.",
    "plannerStep": "Levels"
   },
   {
    "rule": "Entry placement",
    "detail": "Place entry just a little before the proximal line, leaving wiggle room below.",
    "plannerStep": "Levels"
   },
   {
    "rule": "Zone size fits timeframe",
    "detail": "Keep size similar to other zones on the chart; if a zone needs many basing candles it likely belongs to a higher timeframe; discretionary.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Quality flags",
    "detail": "Downgrade when basing candle is as big as the move-away, gap is small, little space after stay-away candle, or old zone with no reaction at liquidity.",
    "plannerStep": "Verdict"
   }
  ]
 }
];
