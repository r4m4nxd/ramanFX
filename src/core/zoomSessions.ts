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
  "n": 1,
  "title": "Chain analysis homework review: trendline anchoring, second explosive leg, and realistic stop losses",
  "kind": "zoom",
  "date": "2026-07-19",
  "summary": "Kevin continues last week's chain-analysis homework, drawing only zones that remove an opposing zone, remove a trendline or make an all-time high/low, and walks through each new zone and trendline in order. The big theme is trendlines: attach each new one to the most recent peak (or valley), move it only when it would cut through candles, fall back to the original starting point when it is too horizontal, and know that one missed trendline can cost several zones further down the chain. He says he prefers a zone whose first explosive candle is followed by a second explosive move over one that bases again before moving, and he explains why some zones that won still were not trades he would take (already tested before they qualified, or a weak move away). In Q&A he covers realistic stop placement (visual rather than measured, wider on gold/oil and in volatile conditions, and wider again when the zone sits at the proximal line of a higher-timeframe zone), keeping zones a similar size, and zones price comes back to straight away. The new homework is January 1992 to January 1993, with the all-time high mapped first.",
  "sections": [
   {
    "heading": "Opening and recap of the chain-analysis rules",
    "points": [
     "This is the first recorded Sunday session (he forgot to hit record last time). He says last week's homework chart was not great and this week's part of the chart is also ugly and tricky, so they may have to skip ahead.",
     "Since there are only a few new members he does not re-teach everything, but he restates the core: in chain analysis we only draw zones that (1) remove an opposing zone, (2) remove a trendline, or (3) make an all-time high (or low).",
     "Only ONE of the three is needed. A zone does not need two or all three.",
     "Last week ended on a supply zone and a downward trendline. Then a move removed the zone and the trendline and made an all-time high, so all three things happened, but there was no qualifying zone. With no zone, we draw nothing. 'The theme of the homework lately is no zones.'"
    ]
   },
   {
    "heading": "Walkthrough 1: picking the supply that removed demand, and anchoring the first downtrend line",
    "points": [
     "There was a demand zone further back that barely qualified, and it was the latest zone. Price pushed down and removed that demand.",
     "Choosing the supply: many students would pick one area as the zone, but in his opinion a different move away was 'just a little bit better', so that is the supply.",
     "Drawing it from the wick across the whole area would be too big, so he uses only two candles as the basing.",
     "That supply is valid because it did rule number one: it removed an opposing area of demand.",
     "As price pushed down it made a clear valley, a peak and a lower low, so there will be a trendline.",
     "Trendline drawing: attach it from the top of the move (before the drop) to the top of the peak. Doing that cut through some candles at the top, so he moved the line to the next highest point where it no longer cuts candles. After that small adjustment it is still attached to the peak and cuts nothing.",
     "He says it is 'almost too sideways' for him, but there is enough angle for a peak and valley, so it stays.",
     "Trendline removal: the line is removed only by the candle that closes above it with its full body and wick. An earlier candle came very close but only touched the line with its wick, so that did not remove it.",
     "The demand zone that removed this trendline had already been tested before it actually became a zone (before it removed anything), so it would not have been a trading setup."
    ]
   },
   {
    "heading": "Walkthrough 2: the next trendline, a tested supply, and a demand he would not take",
    "points": [
     "Another clear valley, peak and lower low, so another new trendline, drawn from the recent peak to the new peak. It is close to too horizontal, but it looks fine.",
     "If it had been too horizontal, he would go back to the original starting point and draw from there down to the new peak instead.",
     "Price pushed down and removed a heavily tested area of demand. Looking up for the supply, the only candidate is one explosive move away.",
     "Like before, that supply was already hit before it became a zone (before it removed anything). He explains that this is why you often see him draw a zone 'after the fact': nothing was removed yet, but it is still the supply even though it was tested.",
     "Price then pushed and removed the trendline. Explaining the removal: the line was respected once, then removed when neither the wick nor the body touched it, with the whole candle sitting above the line.",
     "The zone that removed it was a small drop-base-rally with one explosive candle. 'Not the best zone, but what a trade.' It qualified as a trading setup, and it won big.",
     "He is honest that he would not have taken it. The move away is good, but he would like to see another leg up proving there is more demand there."
    ]
   },
   {
    "heading": "Trend without a trendline (the arrow with no line)",
    "points": [
     "After price hit that zone it broke a higher high, and there was a clear peak and valley, so there is clearly some sort of trend.",
     "But the trendline you would draw is so horizontal that it is 'completely irrelevant'. If a student draws it on homework that is reasonable, but he will not be looking for it.",
     "This is why, on his chart link, you sometimes see an up arrow (trend) with no trendline drawn: there is a trend, but no usable trendline."
    ]
   },
   {
    "heading": "Walkthrough 3: rally-base-rally demand and the 'second explosive move' preference",
    "points": [
     "Price pushed up and removed the supply. It was removed by a rally-base-rally demand with a pretty decent move away, and that was a trade.",
     "The move away on another zone was actually better, but what he likes more about this zone is the continued move to the upside after it.",
     "Drawing on the chart: the first candle after the basing must ALWAYS be an explosive move. That is required for both versions he drew.",
     "Version A (preferred): basing, explosive candle, then ANOTHER explosive move. 'It really tells me there's a lot of demand here.'",
     "Version B (qualifies, less preferred): basing, explosive candle, then a bunch of basing candles, then another explosive move. There is demand, but it 'kind of based out'.",
     "Both qualify, but he much prefers version A for a high-quality setup."
    ]
   },
   {
    "heading": "Old zones, liquidity traps, and keeping two trendlines",
    "points": [
     "A zone on the chart had been removed long ago. Zones from that long ago he no longer expects to hold.",
     "There would have been a nice liquidity trap there. If price had pulled back right away, hit the zone and reacted off the liquidity, he would 'take that zone all day'. Students may mark that liquidity on their chart if they want.",
     "Momentum versus trendline: he shows a flat line next to a steep one through a clear peak and valley, and says the steep one is momentum and that is a trendline. Draw it from the lowest point possible to the valley.",
     "Another quick peak and valley forms (hard to tell), so a second, steeper trendline is drawn.",
     "Usually, if the new trendline is as good as the old one, he removes the old one. Here he keeps both, because one is the overall trendline and the other is a temporary, aggressive one.",
     "He goes back and removes a supply zone. It is not a setup he would take, but it stays on the chart so you can see what removes it."
    ]
   },
   {
    "heading": "Walkthrough 4: a barely-qualifying zone and the last supply of the homework",
    "points": [
     "With the new trendline in place there is barely a zone: a rally-base-rally. The body of the candle is big enough to count as a move away, but he dislikes the tail-end wick and the overall size of the zone, so it is not a setup he would take.",
     "Last part of the homework: demand removed, trendline removed, and a very obvious area of supply above. There was no immediate pullback, so it was a bit old but 'actually not bad', a nice setup. That zone failed 'pretty miserably', but it is the kind of move away he would take, compared with the weaker one.",
     "Of all the zones, the only ones he would consider taking were that supply and the earlier rally-base-rally demand, which he calls mediocre because he wanted another explosive move.",
     "His verdict: the homework was 'actually not as bad as I expected'."
    ]
   },
   {
    "heading": "Homework marking: trendline anchoring errors (most common mistake)",
    "points": [
     "Starting a trendline from a random point is wrong. It must be attached to the most recent peak (downtrend) or valley (uptrend). Even when a random start gives the same signal, it is not the right line.",
     "The only time he does not start at the exact peak is when attaching there would cut through candles. Then he moves to the next point that does not cut through candles. 'Starting it from here doesn't make any sense. Starting it from here, why not up here?'",
     "New peak and valley: draw the new trendline from the most recent peak, not from some random point, as long as it is not too sideways.",
     "Do not draw both an old line and a new line when they share the anchor point you are attaching to. There is only one trendline in that case.",
     "A line that ignores the price action between its points is 'not correct at all'.",
     "Almost nobody got the first trendline. Missing it was 'a fatal error': one missed trendline led to one, two, three missed zones, because each zone in the chain depends on what came before. 'That's the importance of the chain analysis.'",
     "Praise: one student properly updated a trendline by attaching it to the peak, not a random point higher up."
    ]
   },
   {
    "heading": "Homework marking: zone errors",
    "points": [
     "Not a demand: there was no explosive move away. A zone must have an explosive move away.",
     "Some students drew a zone above or below the right one, or drew one zone instead of the correct one. 'That's the zone, not that one.'",
     "Proximal line: one student was told to move the proximal line up. It makes the zone a little larger, but that is where it belongs.",
     "A wick on the move-away candle does not disqualify it if the body is still big enough. A missed supply with an explosive body caused later zones to be missed.",
     "Ending zones: a zone that was not removed must be extended to the point where it was removed. Do not end it early. This applies to trendlines too ('just want to extend it').",
     "Random zones: 'What did this zone break?' If a zone did not remove a demand/supply, a trendline or an all-time high/low, it does not belong on the chart.",
     "Too big, and inconsistent: if you include all those candles in the zone you cannot ignore one wick. You would have to include everything, and then it is far too large, so draw a tighter zone instead.",
     "Gap zones: a student who drew a gap zone was told there is no zone there.",
     "No forced zones, which is praised: 'Nothing forced here, love it.'",
     "Session separator: zones after a student's session marker are not counted against them, since they will draw them next week.",
     "Disqualification reasons: when a student said 'basing too large disqualifies', he said it is not the basing. It is that the move away is not amazing and there is no further explosive move.",
     "For a student who seemed new: copy all his zones onto your chart, follow the three rules, watch previous Sunday recordings, and take a trendline lesson.",
     "Tighten zones where possible, or make them bigger when they are too small."
    ]
   },
   {
    "heading": "Data and broker differences (no-gap candles indicator)",
    "points": [
     "A student on EURUSD (FXCM) used a 'no gap candles' indicator. On that chart one area is clearly a demand zone, while on his chart the gap makes it look like no zone.",
     "He likes the indicator and says he may start using it ('Something to consider'). Based on it, the student should have had that demand.",
     "The student's candles looked different from his even on the same broker, and he said he was confused by it. Treat these zones as unresolved."
    ]
   },
   {
    "heading": "New homework and announcements",
    "points": [
     "Homework: January 1992 to January 1993 on the homework chart.",
     "First map out the all-time high on your chart, which means you must have that supply zone.",
     "Make it a habit every week to update your chart with any zones you missed (many students did not have a key zone).",
     "There is no Sunday session next week. The Friday forecast still happens. Members whose membership ends can contact him.",
     "Homework marking next week may be postponed.",
     "Read Trading in the Zone by Mark Douglas and practise trading psychology. 'Very important.'",
     "He will post Daily Market Breakdowns during the week."
    ]
   },
   {
    "heading": "Q&A: realistic stop loss placement",
    "points": [
     "He does not measure stops. He places them by eye and does not think measuring matters much.",
     "In normal conditions the stop goes a little beyond the zone. That is a normal stop, not a wide one.",
     "Gold and oil: use a wider stop, because they are volatile and, with the current political news (Trump), 'you never know'.",
     "You can use a tighter stop if you pay little or nothing in spread. He pays spreads and is a swing trader, so a tighter stop does not matter to him.",
     "Give the trade wiggle room. When he first practised day trading 5 to 6 years ago, his zone would be respected and then the spread would stop him out, especially around news.",
     "Toward the end of 2025, zones were respected but trades were barely stopped out because of political headlines. The last month or two has been better, but a slightly wider stop is still sensible.",
     "USDCAD example: a 4-hour demand zone sits right at the proximal line of a daily demand, and there is a weekly demand as well. A normal stop would give the daily zone almost no wiggle room.",
     "Do not put the stop all the way below the daily zone either: 'you might as well just take the whole daily zone'.",
     "Middle ground: put the stop about halfway into the daily zone, so the daily gets a chance to test half of it. The whole trade could still fail.",
     "Summary: not every stop loss is the same. There is a normal stop, one that is too tight, one that is right for the market conditions, and a bigger one when a higher-timeframe zone is underneath."
    ]
   },
   {
    "heading": "Q&A: zone sizes and immediate returns to the zone",
    "points": [
     "Try to keep zones a similar size. On gold, his zones are all very similar, though he rarely measures and there are minor differences.",
     "What he does not want is a tiny zone half the size of the others. 'Too small. Bigger the better', because if you go too small, 'there's zones everywhere'. A slightly smaller zone is fine; a tiny one is not.",
     "A zone that removes a previous zone, with a good base and a good explosive move away, but where price comes back quickly: you can draw it.",
     "He does not love it. From six years of experience, he likes price to stay a little away from the zone first. He does not really know why, but it seems to work out better.",
     "He has seen zones where the very next candle after the stay-away candle hit the zone and price still went to take profit, but it is not his favourite situation.",
     "He repeats that the best case is an explosive move followed by another explosive move. Only one is required."
    ]
   }
  ],
  "rules": [
   "Only draw zones that remove an opposing zone, remove a trendline, or make an all-time high/low. One of the three is enough.",
   "If nothing qualifies, draw nothing.",
   "The first candle after the basing must be an explosive move, every time.",
   "Do not stretch a zone wick to wick if that makes it too big. Use the core basing candles.",
   "Attach a new trendline to the most recent peak (downtrend) or valley (uptrend), never to a random point.",
   "If the trendline cuts through candles, move it to the next highest (or lowest) point that does not cut any.",
   "If a new trendline from the recent peak is too horizontal, go back to the original starting point and draw from there.",
   "A trendline is removed only when a candle closes beyond it with its full body and wick. A wick touch does not remove it.",
   "If there is a trend but the trendline would be nearly flat, mark the trend with an arrow and draw no line.",
   "If a new trendline is as good as the old one, usually remove the old one. Keep both when one is the overall line and the other is a temporary, aggressive line.",
   "Do not draw two trendlines from the same anchor point. There is only one.",
   "Keep removed or untradeable zones on the chart so you can see what removes them.",
   "Extend zones and trendlines until the point where they are actually removed.",
   "A zone tested before it qualified (before it removed anything) is still the zone, but it is not a trading setup.",
   "A wick on the move-away candle is fine if the body is big enough.",
   "Put the proximal line where it belongs, even if the zone gets a little larger.",
   "If you include a group of candles in a zone, include all their wicks. Do not ignore one wick.",
   "Keep zones a similar size and avoid tiny zones.",
   "Place stops by eye, a little beyond the zone in normal conditions, and wider on gold, oil and in volatile news conditions.",
   "Use tighter stops only if your spread is minimal.",
   "When the entry zone sits at a higher-timeframe zone's proximal line, put the stop about halfway into the higher-timeframe zone, not below all of it.",
   "Do not expect very old zones to hold.",
   "Update your chart every week with any zones you missed.",
   "Map out the all-time high (and its supply) before starting the new homework range."
  ],
  "mistakes": [
   "Starting a trendline from a random point instead of the most recent peak or valley.",
   "Missing one trendline, which then causes several missed zones down the chain.",
   "Drawing a trendline that ignores the price action between its points.",
   "Drawing both an old and a new trendline from the same anchor.",
   "Drawing zones without an explosive move away.",
   "Drawing random zones that removed nothing (no zone, trendline or all-time high/low broken).",
   "Drawing zones far too big, or ignoring one wick while including the other candles.",
   "Ending a zone or trendline before it was actually removed.",
   "Drawing the wrong one of two nearby candidate zones.",
   "Putting the proximal line in the wrong place to keep the zone small.",
   "Drawing gap zones that are not zones.",
   "Treating a wick on the move-away candle as disqualifying when the body is big enough.",
   "Treating a zone tested before it qualified as a trade.",
   "Taking a qualifying but weak zone with one move away and no further explosive leg (he would skip it).",
   "Using a stop so tight that the spread or a news spike stops you out while the zone holds.",
   "Putting the stop below the whole higher-timeframe zone, which defeats the point of the lower-timeframe entry.",
   "Drawing tiny zones much smaller than the rest.",
   "Not updating the chart with missed zones each week."
  ],
  "quotes": [
   "We only need one of these three things to be accomplished.",
   "Not the best zone, but what a trade from that area of demand.",
   "I'll always be honest.",
   "That's momentum. That is a trend line.",
   "It really tells me there's a lot of demand here.",
   "Missing that trend line was a fatal error.",
   "We don't start trendlines from random points.",
   "What did this zone break?",
   "Nothing forced here, love it.",
   "Too small. Bigger the better.",
   "You might as well just take the whole daily zone.",
   "Not every stop loss is gonna be the same."
  ],
  "diagrams": [
   {
    "key": "qualify",
    "caption": "Chain analysis: draw a zone only if it removes an opposing zone, removes a trendline or makes an all-time high/low. One is enough, and with none, draw nothing."
   },
   {
    "key": "trendline",
    "caption": "Attach to the most recent peak and move to the next highest point only if the line cuts through candles. Too horizontal: go back to the original start point."
   },
   {
    "key": "zone-removed",
    "caption": "The trendline is removed only by the candle closing beyond it with its full body and wick. The earlier wick touch did not count."
   },
   {
    "key": "trend-momentum",
    "caption": "A nearly flat line through a clear peak and valley versus a steep one. The steep line is the trendline; the flat case gets an arrow and no line."
   },
   {
    "key": "quality",
    "caption": "Zones that qualify but he would not take: tested before qualifying, a single move away with no second leg, a tail-end wick, or a big zone."
   },
   {
    "key": "entry-stop-tp",
    "caption": "Normal stop a little beyond the distal line, set by eye. Use a wider stop on gold and oil and in volatile news conditions."
   },
   {
    "key": "mtf",
    "caption": "A USDCAD 4H demand sitting at the proximal line of a daily demand (weekly behind it) is the reason for the halfway-into-daily stop."
   }
  ],
  "checklist": [
   "Did this zone remove an opposing zone, remove a trendline or make an all-time high/low?",
   "Is the first candle after the basing explosive (the body counts even with a wick)?",
   "Is there a second explosive move after the first, rather than more basing? (higher quality)",
   "Was the zone tested before it qualified? If yes, it is not a trade.",
   "Did price stay away from the zone for a while before returning?",
   "Is the zone a similar size to my other zones, not too big and not tiny?",
   "Is the proximal line in the correct place, with all wicks of the included candles inside the zone?",
   "Is my trendline attached to the most recent peak or valley without cutting candles?",
   "Is the trendline too horizontal? If so, use the original start point or just an arrow.",
   "Was the trendline removed by a full candle close beyond it, not just a wick?",
   "Are zones and trendlines extended up to the candle that removed them?",
   "Is the zone very old? If so, do not expect it to hold.",
   "Is there a higher-timeframe zone right behind my entry zone? If so, place the stop about halfway into it.",
   "Is this gold, oil or a volatile news period? If so, use a wider stop.",
   "Is my stop giving the trade enough wiggle room for my spread?"
  ],
  "journalTags": [
   "zone not qualified",
   "trendline random anchor",
   "missed trendline",
   "trendline too horizontal",
   "trendline cut through candles",
   "zone tested before qualifying",
   "no second explosive leg",
   "weak move away",
   "zone too big",
   "zone too small",
   "wrong proximal line",
   "zone not extended",
   "stop too tight",
   "stop ignores htf zone",
   "forced zone",
   "old zone"
  ],
  "newVsPdfs": [
   "A stated preference within qualifying zones: a second explosive move straight after the first explosive candle beats basing again before the next move. Both qualify, but the first is higher quality.",
   "Zones tested before they qualified (before removing anything) are still drawn as the zone, which is why he draws zones 'after the fact', but they are never trading setups.",
   "Trendline anchoring: a new trendline must start from the most recent peak or valley, never from a random point. If it is too horizontal, go back to the original starting point. Never draw two lines from the same anchor.",
   "Keeping two trendlines at once (an overall line plus a temporary, aggressive one), versus usually replacing the old line when the new one is equally good.",
   "The cost of a missed trendline in chain analysis: one missed line led to three missed zones down the chain.",
   "Stop placement by eye, not measured, and wider on gold and oil and during political-news volatility (late 2025), with tighter stops only for traders with minimal spread.",
   "A higher-timeframe stop rule: when the entry zone sits at the proximal line of a daily zone, put the stop about halfway into the daily zone, neither a normal stop nor below the whole daily.",
   "Honest trade selection: a winning, qualifying zone he still would not take because there was no further leg; a zone with a bad tail-end wick or size is skipped.",
   "Old zones removed long ago are not expected to hold. Liquidity traps can be marked, and an immediate pullback into the zone plus liquidity is a setup he likes.",
   "Price returning right after the stay-away candle is allowed but not favoured. In his experience zones work better when price stays away a while.",
   "A no-gap candles indicator can reveal zones that broker gaps hide. He is considering using it.",
   "Homework procedure: map the all-time high and its supply first, copy his zones, update missed zones weekly, and zones after your session separator are not marked."
  ],
  "examples": [
   {
    "market": "Homework chart (not named; EURUSD FXCM per a student's chart), homework timeframe",
    "timeframe": "not stated",
    "setup": "Supply drawn from a two-candle basing after price removed the latest (barely qualified) demand",
    "reasoning": "Rule 1: it removed an opposing demand. He chose the slightly better move away, and a wick-to-wick zone would have been too big, so he used only two basing candles.",
    "outcome": "Valid supply, kept on the chart. It led to a downtrend line from the valley, peak and lower low."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Demand zone that removed the first downtrend line",
    "reasoning": "It removed the trendline, but the zone had already been tested before it qualified.",
    "outcome": "Not a trading setup."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Supply above the removed, heavily tested demand (single explosive move away)",
    "reasoning": "It is the only supply candidate, but it was hit before it removed anything, which is why it was drawn 'after the fact'.",
    "outcome": "Valid zone, not a trading setup."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Small drop-base-rally demand with one explosive candle, which removed the second downtrend line",
    "reasoning": "It qualified as a trading setup. He would not have taken it: he wanted another leg up to prove more demand.",
    "outcome": "Big winning trade. He was honest that he would have skipped it."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Higher high after a clear peak and valley, but the trendline is almost flat",
    "reasoning": "There is a trend, but the line is irrelevant. He marks the trend with an arrow and draws no line.",
    "outcome": "Up arrow, no trendline."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Rally-base-rally demand that removed supply, followed by a continued move up",
    "reasoning": "Another zone had the better move away, but he likes the continued explosive move after this one, which shows strong demand.",
    "outcome": "Counted as a trade."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Old zone that was removed long ago, with a liquidity trap",
    "reasoning": "Old zones are not expected to hold. With an immediate pullback into the zone plus the liquidity he would 'take that zone all day'.",
    "outcome": "No immediate pullback, so no trade."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Rally-base-rally that barely qualifies",
    "reasoning": "The body is big enough for a move away, but he dislikes the tail-end wick and the zone's size.",
    "outcome": "Not a setup he would take."
   },
   {
    "market": "Homework chart",
    "timeframe": "not stated",
    "setup": "Obvious supply after demand and the trendline were removed (last zone of the homework)",
    "reasoning": "A good move away and a nice setup, a little old since there was no immediate pullback.",
    "outcome": "The zone failed 'pretty miserably', but it was a zone he would take."
   },
   {
    "market": "Gold (XAUUSD)",
    "timeframe": "not stated",
    "setup": "Stop loss in normal conditions, a little beyond the zone",
    "reasoning": "Gold and oil are volatile, and political headlines make them riskier, so use a wider stop. Gold zones are also shown as an example of similar-size zones.",
    "outcome": "Illustration only."
   },
   {
    "market": "USDCAD",
    "timeframe": "4H entry inside daily demand (weekly demand too)",
    "setup": "4-hour demand at the proximal line of a daily demand",
    "reasoning": "A normal stop gives the daily zone no wiggle room. A stop below the whole daily means you might as well trade the daily. The middle ground is a stop about halfway into the daily zone.",
    "outcome": "Live example of a wider stop. The outcome was not given, and he said the entire trade could fail."
   }
  ],
  "qa": [
   {
    "q": "Can you touch on how to choose a stop loss realistically?",
    "a": "He places stops by eye, not by measurement. Normal conditions: a little beyond the zone. Gold and oil: wider, because they are volatile and political headlines (Trump) make moves unpredictable. With minimal or zero spread you can go tighter. He pays spreads and swing trades, so it does not matter to him. Always give the trade wiggle room: when he practised day trading 5 to 6 years ago, the spread stopped him out of zones that were respected, especially around news. In late 2025 many zones held but just stopped people out. When the entry zone (for example a USDCAD 4H demand) sits at the proximal line of a higher-timeframe zone (daily, with a weekly too), put the stop about halfway into the daily zone. Not below the whole daily, or you might as well trade the daily itself, and not a normal tight stop, which gives the daily no room. Not every stop is the same."
   },
   {
    "q": "I noticed the zones are the same size. Should they be?",
    "a": "Yes. Try to keep zones a similar size. His gold zones are all similar, though he rarely measures. Do not draw tiny zones half the size of the others. 'Too small. Bigger the better', because small zones mean zones everywhere. Slightly smaller is fine."
   },
   {
    "q": "Would you draw a zone that removes a previous zone, with a good base and a good explosive move away, if price comes back to it quickly?",
    "a": "Yes, you can draw it, but he does not love it. In his six years he has found it works better when price stays a little away from the zone. He does not know exactly why. He has seen the next candle after the stay-away candle hit the zone and still reach take profit, but it is not his favourite situation. The best case is an explosive move followed by another explosive move, though only one is required."
   },
   {
    "q": "A student noted that 'basing a little too large disqualifies' a zone.",
    "a": "He agreed it was not a good zone, but said the basing was not the problem. The move away was not amazing and there was no further explosive move."
   }
  ],
  "newDiagrams": [
   {
    "id": "second-explosive-leg",
    "title": "Second explosive leg vs re-basing",
    "caption": "Both zones qualify because the first candle after the basing is explosive. Left (preferred): another explosive move follows straight away and shows a lot of demand. Right (less preferred): price bases again before the next explosive move.",
    "svg": "<text x=\"80\" y=\"14\" fill=\"#34d399\" font-size=\"10\" text-anchor=\"middle\">Preferred</text><text x=\"240\" y=\"14\" fill=\"#94a3b8\" font-size=\"10\" text-anchor=\"middle\">Qualifies, less preferred</text><line x1=\"160\" y1=\"20\" x2=\"160\" y2=\"172\" stroke=\"#94a3b8\" stroke-width=\"0.5\" stroke-dasharray=\"3 3\"/><rect x=\"14\" y=\"138\" width=\"60\" height=\"18\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"16\" y=\"168\" fill=\"#34d399\" font-size=\"9\">demand</text><line x1=\"30\" y1=\"136\" x2=\"30\" y2=\"158\" stroke=\"#94a3b8\"/><rect x=\"26\" y=\"142\" width=\"8\" height=\"8\" fill=\"#94a3b8\"/><line x1=\"46\" y1=\"104\" x2=\"46\" y2=\"146\" stroke=\"#34d399\"/><rect x=\"42\" y=\"108\" width=\"8\" height=\"34\" fill=\"#34d399\"/><line x1=\"62\" y1=\"60\" x2=\"62\" y2=\"110\" stroke=\"#34d399\"/><rect x=\"58\" y=\"64\" width=\"8\" height=\"42\" fill=\"#34d399\"/><text x=\"80\" y=\"80\" fill=\"#a78bfa\" font-size=\"9\">2nd explosive</text><text x=\"58\" y=\"126\" fill=\"#a78bfa\" font-size=\"9\">1st</text><rect x=\"174\" y=\"138\" width=\"60\" height=\"18\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"176\" y=\"168\" fill=\"#34d399\" font-size=\"9\">demand</text><line x1=\"190\" y1=\"136\" x2=\"190\" y2=\"158\" stroke=\"#94a3b8\"/><rect x=\"186\" y=\"142\" width=\"8\" height=\"8\" fill=\"#94a3b8\"/><line x1=\"206\" y1=\"104\" x2=\"206\" y2=\"146\" stroke=\"#34d399\"/><rect x=\"202\" y=\"108\" width=\"8\" height=\"34\" fill=\"#34d399\"/><line x1=\"222\" y1=\"98\" x2=\"222\" y2=\"114\" stroke=\"#94a3b8\"/><rect x=\"218\" y=\"102\" width=\"8\" height=\"7\" fill=\"#94a3b8\"/><line x1=\"236\" y1=\"100\" x2=\"236\" y2=\"116\" stroke=\"#94a3b8\"/><rect x=\"232\" y=\"104\" width=\"8\" height=\"6\" fill=\"#94a3b8\"/><line x1=\"250\" y1=\"97\" x2=\"250\" y2=\"113\" stroke=\"#94a3b8\"/><rect x=\"246\" y=\"101\" width=\"8\" height=\"7\" fill=\"#94a3b8\"/><line x1=\"266\" y1=\"56\" x2=\"266\" y2=\"104\" stroke=\"#34d399\"/><rect x=\"262\" y=\"60\" width=\"8\" height=\"40\" fill=\"#34d399\"/><text x=\"236\" y=\"92\" fill=\"#94a3b8\" font-size=\"9\" text-anchor=\"middle\">basing again</text>"
   },
   {
    "id": "stop-htf-proximal",
    "title": "Stop when the entry zone sits at a higher-timeframe zone",
    "caption": "A USDCAD 4H demand at the proximal line of a daily demand. A normal stop is too tight for the daily, and a stop below the whole daily means you might as well trade the daily. He uses the middle ground, about halfway into the daily zone.",
    "svg": "<rect x=\"40\" y=\"92\" width=\"200\" height=\"64\" fill=\"#34d399\" fill-opacity=\"0.10\" stroke=\"#34d399\" stroke-width=\"0.8\" stroke-dasharray=\"4 3\"/><text x=\"44\" y=\"150\" fill=\"#34d399\" font-size=\"9\">Daily demand</text><rect x=\"100\" y=\"72\" width=\"140\" height=\"20\" fill=\"#34d399\" fill-opacity=\"0.30\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"104\" y=\"85\" fill=\"#34d399\" font-size=\"9\">4H demand (entry)</text><line x1=\"40\" y1=\"92\" x2=\"240\" y2=\"92\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"44\" y=\"89\" fill=\"#94a3b8\" font-size=\"9\">daily proximal</text><line x1=\"240\" y1=\"97\" x2=\"312\" y2=\"97\" stroke=\"#f87171\" stroke-dasharray=\"2 2\"/><text x=\"246\" y=\"107\" fill=\"#f87171\" font-size=\"9\">normal: too tight</text><line x1=\"240\" y1=\"124\" x2=\"312\" y2=\"124\" stroke=\"#a78bfa\" stroke-width=\"1.4\"/><text x=\"246\" y=\"134\" fill=\"#a78bfa\" font-size=\"9\">~half of daily: his stop</text><line x1=\"240\" y1=\"162\" x2=\"312\" y2=\"162\" stroke=\"#f87171\" stroke-dasharray=\"2 2\"/><text x=\"246\" y=\"174\" fill=\"#f87171\" font-size=\"9\">below daily: just trade daily</text><text x=\"40\" y=\"20\" fill=\"#94a3b8\" font-size=\"10\">Gold/oil, news or volatile periods: wider</text><text x=\"40\" y=\"34\" fill=\"#94a3b8\" font-size=\"10\">Minimal spread: can be tighter</text>"
   },
   {
    "id": "trendline-recent-peak",
    "title": "Anchoring a new trendline",
    "caption": "A new peak, valley and lower low means a new trendline from the MOST RECENT peak, never from a random point. Move off the peak only if the line would cut through candles. If the line from the recent peak is too horizontal, go back to the original starting point.",
    "svg": "<polyline points=\"20,30 60,110 90,70 130,130 165,95 205,155 230,120 260,165\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\"/><circle cx=\"20\" cy=\"30\" r=\"3\" fill=\"#a78bfa\"/><text x=\"26\" y=\"28\" fill=\"#a78bfa\" font-size=\"9\">original start</text><circle cx=\"90\" cy=\"70\" r=\"3\" fill=\"#f87171\"/><circle cx=\"165\" cy=\"95\" r=\"3\" fill=\"#f87171\"/><line x1=\"90\" y1=\"70\" x2=\"300\" y2=\"137\" stroke=\"#f87171\" stroke-width=\"1.4\"/><text x=\"190\" y=\"92\" fill=\"#f87171\" font-size=\"9\">recent peak to new peak</text><line x1=\"20\" y1=\"30\" x2=\"300\" y2=\"121\" stroke=\"#a78bfa\" stroke-width=\"0.8\" stroke-dasharray=\"4 3\"/><text x=\"200\" y=\"70\" fill=\"#a78bfa\" font-size=\"9\">if too horizontal</text><line x1=\"40\" y1=\"55\" x2=\"300\" y2=\"80\" stroke=\"#94a3b8\" stroke-width=\"0.8\" stroke-dasharray=\"2 3\"/><text x=\"236\" y=\"76\" fill=\"#94a3b8\" font-size=\"9\">random point: wrong</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Draw a zone only if it removed an opposing zone OR removed a trendline OR made an all-time high/low",
    "detail": "At least 1 of the 3 conditions. Otherwise draw nothing.",
    "plannerStep": "Setup"
   },
   {
    "rule": "Require the first candle after the basing to be explosive",
    "detail": "Every time. A wick on the move-away candle is fine if the body is large enough (body size threshold: discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Score the zone higher if the candle after the first explosive candle is also explosive (no re-basing)",
    "detail": "Quality bonus only. Re-basing then exploding still qualifies.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject the trade if the zone was touched before it qualified (before it removed anything)",
    "detail": "The zone is still drawn on the chart, but it is not a trading setup.",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Downgrade the zone if price returns to it on the very next candle after the stay-away candle",
    "detail": "Allowed but less favoured. He prefers price to stay away for a while (duration: discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Keep zone height similar to the previous zones on the chart. Flag zones about half the typical size or smaller",
    "detail": "'Too small. Bigger the better.' Exact tolerance: discretionary.",
    "plannerStep": "Zone"
   },
   {
    "rule": "When including several basing candles, include every wick of those candles in the zone",
    "detail": "Never ignore one wick. If the result is too large, use fewer core basing candles.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Anchor a new trendline at the most recent peak (downtrend) or valley (uptrend)",
    "detail": "Trigger: valley, then peak, then lower low (or the bull mirror). Never use a random start point.",
    "plannerStep": "Context"
   },
   {
    "rule": "If the trendline cuts through any candle body or wick, move the anchor to the next highest (or lowest) point that cuts none",
    "detail": "Only allowed deviation from the exact peak or valley.",
    "plannerStep": "Context"
   },
   {
    "rule": "If the line from the recent peak is too horizontal, redraw it from the original starting point. If still flat, mark the trend with an arrow and draw no line",
    "detail": "The 'too horizontal' threshold is discretionary.",
    "plannerStep": "Context"
   },
   {
    "rule": "Mark a trendline as removed only when a candle's full body and wick are beyond the line",
    "detail": "A wick touch or a partial close does not count.",
    "plannerStep": "Context"
   },
   {
    "rule": "Extend zones and trendlines until the candle that removes them",
    "detail": "No early termination.",
    "plannerStep": "Context"
   },
   {
    "rule": "Ignore very old zones (removed or formed long ago) as tradeable",
    "detail": "Age threshold: discretionary.",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Default stop: a little beyond the distal line, set visually",
    "detail": "Not measured. Tighter only with minimal or zero spread.",
    "plannerStep": "Levels"
   },
   {
    "rule": "Widen the stop on gold, oil and in volatile news regimes",
    "detail": "Amount: discretionary.",
    "plannerStep": "Levels"
   },
   {
    "rule": "If the entry zone sits at the proximal line of a higher-timeframe zone, place the stop about 50% into the higher-timeframe zone",
    "detail": "Not below the whole higher-timeframe zone (then trade the higher timeframe instead). Example: USDCAD 4H inside daily, with a weekly demand behind it.",
    "plannerStep": "Levels"
   }
  ]
 },
 {
  "n": 2,
  "title": "EURUSD daily chain analysis, borderline zones and following homework instructions",
  "kind": "zoom",
  "date": "2026-08-02",
  "summary": "Kevin returns from vacation, reviews his only trade of the week (a USDCAD 4-hour demand trade closed in profit after the 4-hour trendline broke) and encourages students after a volatile, losing week. He continues the EURUSD daily chain analysis, drawing only zones that remove an opposing zone, remove a trendline or make an all-time high, and walks through trendline updates, overextended trendlines that must be ended, a near-horizontal line that does not count, and a tricky demand where the basing formed inside the respected supply. He then marks every student's homework, repeatedly correcting basing-candle 'zones' that accomplish nothing, extended zones, unattached lines, wrong timeframes and unreadable screenshots, and becomes strict: homework that does not follow the instructions will not be marked. He closes by setting next week's homework (treat a broken-data high as an all-time high) and explaining that every rule-based strategy has obvious yes, obvious no and gray-area cases.",
  "sections": [
   {
    "heading": "Week recap and encouragement after a volatile week",
    "points": [
     "He was on vacation with poor internet and cell service, so he did not take new trades because he could not manage them; staying out of the market was the decision.",
     "The only trade he managed was the USDCAD 4-hour area-of-demand trade; it was stopped out for a profit after the 4-hour trendline broke.",
     "There were crazy moves in the markets this week; he estimates he would have had roughly one winner and two losses had he traded - a bad week for him too.",
     "He has been trading a little over 6 years and has had many weeks like this; losses in crazy moves are the reality of trading, so do not get discouraged.",
     "The coming week looks tricky to trade due to market conditions.",
     "Sunday meetings resume as normal after he missed the previous Sunday."
    ]
   },
   {
    "heading": "Chain analysis recap: what qualifies a zone to be drawn",
    "points": [
     "In the Sunday meetings we are only drawing zones that remove one of three things: an opposing zone, a trendline, or make an all-time high (or low).",
     "It does not have to be all three - just one of them.",
     "You must follow along with the past weeks because the trendlines, removed zones and new zones from previous homework have to be on your chart for the chain to continue.",
     "The last supply zone on the chart removed both a trendline and a demand zone - a 'double whammy' zone.",
     "Just because a trendline or zone is removed does not mean we automatically have a zone: there must be an explosive move away from basing.",
     "Where the break happened through small indecisive candles ('little boo-boo basing candles') there is no zone; this period of EURUSD daily has had very few areas of demand."
    ]
   },
   {
    "heading": "Drawing and updating trendlines on the EURUSD daily",
    "points": [
     "Three things are required for a trendline: peak, valley, and a lower low (downtrend) or higher high (uptrend). If no new low is made, there is simply no trendline.",
     "Draw from the highest point possible to the highest point possible of the second touchpoint (downtrend); for an uptrend from the lows.",
     "When a new peak, valley and higher high forms, the earlier trendline becomes irrelevant and you update to a new line from the most recent valley.",
     "If the line from the lowest point of the valley cuts through a wick, do not use it; go to the next highest point instead so the line does not cut through candles.",
     "The odd time a trendline will cut through a candle; leave it until price makes a new all-time high, then adjust it.",
     "When price shoots up too aggressively with no pullback (overextended), end the trendline - do not keep extending it. There is no specific end point; stop it roughly halfway, which shows you recognised there is no more trendline there.",
     "You can use the channel tool attached to the peak to see visually how overextended price got, but it is not required.",
     "Ending overextended trendlines is what he wants to see in homework: it tells him you are paying attention."
    ]
   },
   {
    "heading": "Tricky demand zone: basing inside a respected supply",
    "points": [
     "Price pushed up and got only a small minor reaction off an older supply; he expected more of a move, but it did not hold.",
     "Use the remove tool and extend the supply to where it was removed; he did not need the Fibonacci tool there because the removal was obvious.",
     "The demand that removed it is valid because the supply was respected, price created the basing candle under/at it, and then an explosive move away removed the supply.",
     "If the basing candle (or even a wick) was sitting above the supply, the basing was created after the supply was already removed, and there would be no zone.",
     "The move away barely qualifies as explosive - not the best zone. Price reacted off it twice, but it would not have been a trade for him: the demand was already removed and the pullback was too aggressive.",
     "He calls it a tricky one and will not give students a hard time if they missed it."
    ]
   },
   {
    "heading": "No-zone areas, borderline peaks and the near-horizontal line",
    "points": [
     "At the new all-time high there is no zone in his opinion: the move away is not good enough, and wicks on both the top and bottom of the candle show it is a basing candle.",
     "A small peak and valley there is borderline; the big explosive candle makes him uncomfortable drawing a trendline. If you drew it he will not mark you down heavily, but he would not have it.",
     "No demand there means no supply after it in the chain.",
     "A valley, peak and lower low that produces an almost horizontal line is not a trendline - it is closer to momentum. We want a nice angle on the trendline.",
     "There is no angle measurement for this; it is visual and takes time to learn.",
     "When the low is removed in such a case, his chart may show a downward arrow but no trendline, meaning a downtrend with no trendline.",
     "After demand was removed he looked for a supply above that removed it; there was none, so the chain ends there ('that's just the way the cookie crumbles').",
     "He briefly tried TradingView's 'no gaps' chart setting because a student used it; he did not like it (many small gaps he cannot see) and removed it for now - even with it there was still no explosive move away at that high.",
     "Final part of the homework: valley, blatant peak, lower low gives the last trendline, then it ended at the session marker. The blacked-out weird price action at the end is to be skipped; just mark the zone below as removed."
    ]
   },
   {
    "heading": "Homework review: recurring corrections (part 1)",
    "points": [
     "Most students extended overextended trendlines - those need to end, just like the earlier one.",
     "Almost everyone drew a borderline demand candle he would not have: large but with wicks at the top and bottom, so it is a basing candle. If it had a bit more body he would accept it.",
     "Because of that one extra zone, the rest of the chain shifted; he still gives credit: 'if that was correct, that would be correct, and that would be correct'.",
     "Students are getting good at spotting the 'little boo-boo basing candles' and not forcing zones.",
     "Homework on the wrong timeframe (e.g. 1-hour instead of daily) or wrong chart cannot be marked; he can change the broker but not the timeframe. It has to be on the daily.",
     "Blacked-out or blurry screenshots where wicks and timeframe are not visible are unmarkable; copy his chart layout for a clear visual.",
     "A first-time submission drew zones that accomplished nothing, a trendline without a lower low, an extended trendline, and missed a blatant explosive zone; he recommends watching previous Sunday meetings.",
     "Candle size alone does not make a move away: two candles of almost the same size can differ - a full-bodied candle with almost no wicks is explosive, while a large candle with big wicks top and bottom is still a basing candle, just a large one."
    ]
   },
   {
    "heading": "Lesson homework reviews (other lessons)",
    "points": [
     "Lesson 3 (drawing zones): a drop-base-rally that was technically one but he would not consider demand; a rally-base-drop acceptable despite a wick because the body was big enough; one 'zone' was way off - basing candle, non-explosive move.",
     "Daily trainer / 1-hour supply: the top zone was good; a move away that barely qualified looked fine.",
     "Lesson 4 (multi-timeframe): a 4-hour zone in the right place but far too big - the student combined two separate sections of basing (two basing candles, then two more above). Do not combine them; draw only the basing next to the explosive move. The correct zone was well respected.",
     "A student extending removed zones and not drawing opposing zones: he refused to mark it fully - zones are not extended; it makes charts too messy.",
     "Momentum line correctly identified; the student's trendline logic was right but he would have attached it to the clear high that was removed, and the line was not attached properly.",
     "Multiple timeframe analysis homework: the area was right but the student did not include the distal line at the basing candle; draw from the basing candle.",
     "Trend vs momentum homework: momentum line and trendline both correct."
    ]
   },
   {
    "heading": "Homework review: recurring corrections (part 2)",
    "points": [
     "A good example student copied all old zones, ended zones when removed, and had no zones cutting through - 'he just followed the instructions'.",
     "Trendlines must be attached exactly (unattached lines are concerning); zone lines must be attached to the high.",
     "A student in another group (who trades differently) drew a non-explosive demand that removed nothing: 'if that's your explosive move, there are demand zones everywhere'. We only look for explosive moves.",
     "No higher high (or lower low) means no trendline - he corrected an experienced student and another student for this multiple times.",
     "Do not ignore a blatant peak, valley and lower low and draw a line where no lower low was made.",
     "When a zone is drawn at a candle, the next candle must be the explosive move. If a basing candle comes after it and then the explosive move, the zone is drawn at that later basing.",
     "Drawing the zone at a basing-candle move away is saying that candle is the explosive move, which it is not; the supply belongs where the explosive move starts.",
     "If it was a zone, do not cut through the wick of the basing - include the wick unless it is massive.",
     "Students who keep drawing zones that accomplish nothing should put the three rules at the top of their chart, as one student does.",
     "Charts done on a phone change the angles, so trendlines are harder to judge.",
     "There is no real winner; the 'winner' idea is just for fun and something to strive for. The closest this week was a student who got both ended trendlines and the hidden demand."
    ]
   },
   {
    "heading": "Explaining 'a zone must accomplish something' to a student",
    "points": [
     "A rally-base-rally with a good enough explosive candle still is not drawn if nothing (no opposing zone, no trendline) was removed by it.",
     "On his EURUSD chart every zone has a reason: this one removed that opposing zone, this one removed that trendline, this one removed that zone.",
     "'We're only drawing zones that accomplish something.'",
     "Even a zone that is not an ideal trading situation can still be a zone (answer to a student's point)."
    ]
   },
   {
    "heading": "Fibonacci tool settings for drawing zones",
    "points": [
     "It does not matter what tool you draw zones with (Fibonacci or rectangle); you can still use the magnet tool with either.",
     "His Fibonacci settings: one colour; levels 0 and 1 only; background not too dark; prices shown; text centred and middle. He posted a screenshot in the chat for students to copy."
    ]
   },
   {
    "heading": "Being strict about homework instructions",
    "points": [
     "His biggest pet peeve is not removing (ending) zones - zones are not extended across the chart.",
     "Follow the instructions: copy all of his old zones, old trendlines and new trendlines; only draw zones that remove an opposing zone, remove a trendline or break an all-time high; delete/end zones when removed.",
     "Homework that does not follow the instructions will not be marked.",
     "He will happily work with anyone who struggles to understand zones; what he will not work with is people who do not follow simple instructions."
    ]
   },
   {
    "heading": "Next week's homework",
    "points": [
     "EURUSD daily from January onwards; the dark section with broken data (no wicks, the data did not cooperate) is skipped.",
     "Use a horizontal ray to mark that high and treat it as an all-time high, even though it is not one; it will come into effect later.",
     "You must have the specified zone on your chart; if it or the all-time-high ray is missing he will close your chart immediately.",
     "The two zones below are not necessary for next week but will be needed in coming weeks, so copy them all.",
     "Expect a trendline-heavy week with a couple of zones; brush up on trendlines. Watch the end of the meeting for the different instructions."
    ]
   },
   {
    "heading": "Rules vs gray areas",
    "points": [
     "Any strategy has obvious no's (clearly not a zone) and obvious yes's (clearly a zone), and gray areas in between that are 50-50.",
     "This applies to zones and trendlines: sometimes a move-away candle is very close, or a peak barely looks like a peak.",
     "The borderline demand candle almost everyone drew this week is an example; 'you can have rules, but sometimes there will be borderlines'."
    ]
   }
  ],
  "rules": [
   "Only draw zones that remove an opposing zone, remove a trendline, or make an all-time high/low - one is enough.",
   "A removed zone or trendline does not automatically create a zone; there must be an explosive move away.",
   "Require peak, valley and a higher high (uptrend) or lower low (downtrend) before drawing a trendline.",
   "Do not let a trendline cut through candles; if it cuts a wick, attach to the next highest/lowest point.",
   "End an overextended trendline (no pullback) roughly halfway; never extend it.",
   "Do not draw near-horizontal trendlines; a trendline needs a visible angle.",
   "For a demand that removes a supply, the basing must form while the supply is respected (below it); if basing or a wick sits above the supply, there is no zone.",
   "Treat a large candle with wicks on both top and bottom as a basing candle, not an explosive move.",
   "The candle after the zone must be the explosive move; if another basing candle follows, the zone moves to that later basing.",
   "Do not combine two separate sections of basing into one zone.",
   "Include the basing wick in the zone unless it is massive.",
   "End and mark zones when removed; never extend removed zones across the chart.",
   "Copy all of his previous zones and trendlines each week so the chain continues.",
   "Submit homework on the correct chart and timeframe (daily) with a clear, readable layout.",
   "Attach trendlines and zone lines exactly to the highs/lows (magnet tool).",
   "Treat the broken-data high on EURUSD as an all-time high for next week's homework, marked with a horizontal ray."
  ],
  "mistakes": [
   "Drawing zones off basing-candle moves that accomplish nothing (remove no zone, no trendline).",
   "Extending overextended trendlines instead of ending them.",
   "Drawing a trendline without a new higher high or lower low.",
   "Ignoring a blatant peak, valley and lower low and drawing a line elsewhere.",
   "Counting a big but wicky candle as an explosive move.",
   "Drawing a near-horizontal line and calling it a trendline.",
   "Extending removed zones, making charts messy and unmarkable.",
   "Not copying the previous weeks' zones and trendlines, which breaks the chain.",
   "Combining two basing sections into one oversized zone.",
   "Not including the basing candle/distal line, or cutting through the basing wick.",
   "Trendlines or zones not attached to the highs/lows.",
   "Submitting on the wrong timeframe or chart, or as blurry/blacked-out screenshots.",
   "Getting discouraged after a losing week in volatile conditions.",
   "Mixing in other methods (break of structure, other groups' looser zone criteria)."
  ],
  "quotes": [
   "It doesn't have to be all three, just one of these.",
   "Little boo-boo basing candles.",
   "Just because a trendline is removed, or a zone is removed, doesn't mean we automatically have a zone.",
   "We wanna have a nice angle on the trendline.",
   "If that's your explosive move, then there are demand zones everywhere.",
   "We're only drawing zones that accomplish something.",
   "You can have rules, but sometimes there will be borderlines.",
   "It's never personal.",
   "Some weeks are like this, I've had many weeks like that, so don't get discouraged."
  ],
  "diagrams": [
   {
    "key": "zone-removed",
    "caption": "The three reasons a zone gets drawn in the chain: removed opposing zone, removed trendline, or new all-time high - the EURUSD 'double whammy' supply did two at once."
   },
   {
    "key": "trendline",
    "caption": "Peak, valley, higher high/lower low; if the line from the lowest valley point cuts a wick, move to the next highest point."
   },
   {
    "key": "trend-momentum",
    "caption": "The near-horizontal valley-peak-lower-low line on EURUSD daily is closer to momentum - no trendline, just a downward arrow."
   },
   {
    "key": "qualify",
    "caption": "Large candle with wicks top and bottom is still basing; only a full-bodied candle qualifies as the explosive move."
   },
   {
    "key": "draw",
    "caption": "Draw only around the basing next to the explosive move - do not merge two basing sections, and include the basing wick."
   }
  ],
  "checklist": [
   "Does this zone remove an opposing zone, a trendline, or make an all-time high/low?",
   "Is there a genuinely explosive move away (full body, small wicks), not a large wicky basing candle?",
   "Is the candle right after the basing the explosive move?",
   "Did the basing form while the removed zone was still respected (not after it was already broken)?",
   "Is the zone drawn only around the basing next to the move, with the wick included?",
   "For a trendline: peak, valley and a new higher high / lower low present?",
   "Does the trendline avoid cutting through any candles and have a real angle?",
   "Has price overextended away from the trendline so it should be ended?",
   "Are removed zones ended and old zones/trendlines carried over?",
   "Am I on the correct chart and timeframe with a clear layout?",
   "Can I manage the trade (internet, availability) - if not, stay out."
  ],
  "journalTags": [
   "zone accomplishes nothing",
   "basing candle as move away",
   "trendline overextended",
   "no higher high",
   "no lower low",
   "trendline cuts candles",
   "horizontal trendline",
   "zone extended after removal",
   "basing sections combined",
   "chain not copied",
   "trendline not attached",
   "wrong timeframe",
   "forced zone",
   "basing after removal"
  ],
  "newVsPdfs": [
   "Overextended trendlines are ended roughly halfway (no fixed point) when price shoots away without a pullback; the channel tool attached to the peak can help see it.",
   "When a trendline from the lowest valley point cuts a wick, attach to the next highest point; the odd candle cut is left until a new all-time high, then adjusted.",
   "A near-horizontal line is not a trendline (visual judgment, no angle measurement); such a downtrend is shown with a downward arrow and no trendline.",
   "A large candle with wicks at both top and bottom is still a basing candle, regardless of size; full body with small wicks is what makes it explosive.",
   "Do not combine two separate sections of basing into one zone - draw only the basing adjacent to the explosive move.",
   "If a basing candle follows the zone candle before the explosive move, the zone is drawn at that later basing.",
   "Explicit framing of obvious yes / obvious no / gray-area cases in a rule-based strategy.",
   "Homework now strictly enforced: wrong timeframe, unreadable screenshots, extended zones or missing copied zones will not be marked.",
   "Broken price data on EURUSD daily: mark that high with a horizontal ray and treat it as an all-time high for the chain.",
   "His Fibonacci tool settings for zones (one colour, levels 0 and 1, prices on, text centred) and that the magnet tool works with any drawing tool.",
   "He does not use break of structure / Dow theory market structure and has no opinion on it; only peaks and valleys.",
   "Practical risk decision: do not take trades you cannot manage (no internet on vacation)."
  ],
  "examples": [
   {
    "market": "USDCAD",
    "timeframe": "4-hour",
    "setup": "4-hour area of demand trade",
    "reasoning": "Trade managed while on vacation; managed against the 4-hour trendline",
    "outcome": "Stopped out in profit after the 4-hour trendline broke"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Supply zone that removed both a trendline and a demand (double whammy)",
    "reasoning": "Followed the rule: removed an opposing zone and a trendline with an explosive move",
    "outcome": "Valid zone in the chain; later removed"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Trendline removed through small basing candles",
    "reasoning": "No explosive move away, only 'little boo-boo basing candles'",
    "outcome": "No zone drawn"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Uptrend trendline update after peak, valley, higher high",
    "reasoning": "Line from the lowest valley point cut through a wick, so it was attached to the next highest point; price then overextended",
    "outcome": "Trendline updated then ended roughly halfway; not extended"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Demand that removed an older supply",
    "reasoning": "Supply respected, basing formed beneath it, then explosive move removed it; move away barely qualified",
    "outcome": "Valid (tricky) zone; reacted twice but not a trade for him - demand already removed and pullback too aggressive"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Candle at new all-time high",
    "reasoning": "Wicks on top and bottom = basing candle; move away not good enough",
    "outcome": "No zone; most students drew it incorrectly"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Valley, peak, lower low forming a near-horizontal line",
    "reasoning": "Too horizontal - closer to momentum; no nice angle",
    "outcome": "No trendline; downtrend marked with a downward arrow only"
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily",
    "setup": "Search for supply that removed a demand",
    "reasoning": "No explosive supply above; tested 'no gaps' setting, still no explosive move",
    "outcome": "No zone; chain ends"
   },
   {
    "market": "Student chart (Lesson 4)",
    "timeframe": "4-hour",
    "setup": "Zone combining two sections of basing",
    "reasoning": "Explosive move correct, but zone too big from merging two basing sections",
    "outcome": "Zone should be only the basing next to the explosive move; that zone was well respected"
   }
  ],
  "qa": [
   {
    "q": "I was doing a lot of market structure / Dow theory (break of structure) and I see you use trendlines. Should I keep both?",
    "a": "We do not trade break of structure here, so it is irrelevant to this group. He advises doing trendlines exactly the way the group does them, since his system is winning. You can use break of structure in your own analysis, but he will have no opinion on it because he does not use it. He recommends only looking at peaks and valleys and not worrying about the other stuff."
   },
   {
    "q": "Can you elaborate what 'it doesn't mean a zone on its own' means?",
    "a": "If there is a rally-base-rally with a good enough explosive candle, but nothing was removed by it (no opposing zone, no trendline), we do not draw the zone. On his EURUSD chart every zone exists because it removed an opposing zone or a trendline. We only draw zones that accomplish something."
   },
   {
    "q": "What tool do you use for zones - can I still use the magnet tool?",
    "a": "It does not matter which tool (Fibonacci or rectangle); the magnet tool works with either. His Fibonacci settings: one colour, levels 0 and 1, background not too dark, prices on, text centre and middle; he posted a screenshot in the chat."
   },
   {
    "q": "(A student argued a zone would not be an ideal trading situation.)",
    "a": "Correct that it would not be ideal to trade, but it is still a zone."
   },
   {
    "q": "How do I review trendlines again / get better?",
    "a": "Watch the Sunday meetings - go to the Sunday Meeting section and watch 4 or 5 of them; that is your best bet."
   },
   {
    "q": "Should I re-share my homework link after fixing it?",
    "a": "No, as long as it is the same link he will look at it after the meeting."
   }
  ],
  "newDiagrams": [
   {
    "id": "overextended-trendline-end",
    "title": "Ending an overextended trendline",
    "caption": "After the higher high, price shoots away with no pullback; end the trendline roughly halfway instead of extending it.",
    "svg": "<line x1='20' y1='160' x2='180' y2='100' stroke='#a78bfa' stroke-width='2'/><line x1='180' y1='100' x2='300' y2='55' stroke='#94a3b8' stroke-width='1' stroke-dasharray='4 3'/><rect x='30' y='140' width='8' height='14' fill='#34d399'/><line x1='34' y1='134' x2='34' y2='158' stroke='#34d399'/><rect x='70' y='118' width='8' height='14' fill='#f87171'/><line x1='74' y1='112' x2='74' y2='146' stroke='#f87171'/><rect x='110' y='122' width='8' height='14' fill='#34d399'/><line x1='114' y1='116' x2='114' y2='140' stroke='#34d399'/><rect x='150' y='80' width='8' height='30' fill='#34d399'/><line x1='154' y1='74' x2='154' y2='112' stroke='#34d399'/><rect x='190' y='50' width='8' height='30' fill='#34d399'/><line x1='194' y1='44' x2='194' y2='82' stroke='#34d399'/><rect x='230' y='22' width='8' height='28' fill='#34d399'/><line x1='234' y1='16' x2='234' y2='52' stroke='#34d399'/><text x='186' y='118' fill='#a78bfa' font-size='9'>end here</text><text x='230' y='90' fill='#94a3b8' font-size='9'>do not extend</text><text x='20' y='14' fill='#94a3b8' font-size='10'>No pullback = trendline irrelevant</text>"
   },
   {
    "id": "basing-inside-respected-zone",
    "title": "Basing must form while the zone is respected",
    "caption": "Valid: supply respected, basing forms below it, explosive move removes it. Invalid: basing (or a wick) sits above the supply, so the basing came after the removal.",
    "svg": "<rect x='10' y='40' width='140' height='18' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><text x='14' y='36' fill='#f87171' font-size='9'>supply</text><rect x='40' y='70' width='8' height='10' fill='#94a3b8'/><line x1='44' y1='62' x2='44' y2='86' stroke='#94a3b8'/><rect x='60' y='22' width='8' height='56' fill='#34d399'/><line x1='64' y1='16' x2='64' y2='80' stroke='#34d399'/><rect x='30' y='62' width='50' height='24' fill='#34d399' fill-opacity='0.15' stroke='#34d399'/><text x='14' y='104' fill='#34d399' font-size='10'>valid demand</text><rect x='170' y='40' width='140' height='18' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><text x='174' y='36' fill='#f87171' font-size='9'>supply</text><rect x='200' y='28' width='8' height='10' fill='#94a3b8'/><line x1='204' y1='22' x2='204' y2='44' stroke='#94a3b8'/><rect x='220' y='4' width='8' height='30' fill='#34d399'/><line x1='224' y1='2' x2='224' y2='36' stroke='#34d399'/><text x='174' y='104' fill='#f87171' font-size='10'>basing above supply = no zone</text><text x='10' y='150' fill='#94a3b8' font-size='9'>Remove tool: extend supply to the candle that removed it</text>"
   },
   {
    "id": "rules-gray-area",
    "title": "Obvious yes, obvious no, gray area",
    "caption": "Rules decide the obvious cases; borderline move-away candles and barely-peaks fall in a 50-50 gray area.",
    "svg": "<rect x='10' y='60' width='95' height='50' fill='#f87171' fill-opacity='0.2' stroke='#f87171'/><text x='22' y='88' fill='#f87171' font-size='10'>obvious NO</text><rect x='112' y='60' width='96' height='50' fill='#94a3b8' fill-opacity='0.2' stroke='#94a3b8'/><text x='128' y='84' fill='#94a3b8' font-size='10'>gray area</text><text x='134' y='98' fill='#94a3b8' font-size='9'>50-50</text><rect x='215' y='60' width='95' height='50' fill='#34d399' fill-opacity='0.2' stroke='#34d399'/><text x='225' y='88' fill='#34d399' font-size='10'>obvious YES</text><rect x='50' y='125' width='8' height='20' fill='#94a3b8'/><line x1='54' y1='118' x2='54' y2='152' stroke='#94a3b8'/><rect x='155' y='122' width='8' height='26' fill='#34d399'/><line x1='159' y1='116' x2='159' y2='156' stroke='#34d399'/><rect x='258' y='118' width='8' height='36' fill='#34d399'/><line x1='262' y1='116' x2='262' y2='156' stroke='#34d399'/><text x='10' y='40' fill='#a78bfa' font-size='10'>Move-away candle: wicky basing - borderline - full body</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Draw a zone only if its explosive move removes an opposing zone, removes a trendline, or makes a new all-time high/low",
    "detail": "At least one of the three conditions; otherwise skip",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zones where the move-away candle has large wicks on both ends",
    "detail": "discretionary (wick-to-body comparison; full body with small wicks required)",
    "plannerStep": "Zone"
   },
   {
    "rule": "The candle immediately after the basing must be the explosive candle",
    "detail": "If another basing candle intervenes, re-anchor the zone to the last basing before the explosive candle",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject a demand (supply) whose basing high (low) lies beyond the supply (demand) it removed",
    "detail": "Any basing body or wick above the removed supply (below removed demand) = no zone",
    "plannerStep": "Zone"
   },
   {
    "rule": "Zone boundaries use only the basing cluster adjacent to the move; do not merge separate basing clusters",
    "detail": "Include the basing wick unless massive (discretionary)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Create a trendline only after peak, valley and a new higher high (up) or lower low (down)",
    "detail": "No new extreme = no trendline",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline anchors must not intersect any candle; if the lowest valley point cuts a wick, use the next anchor point",
    "detail": "Occasional cut tolerated until a new all-time high, then re-anchor",
    "plannerStep": "Context"
   },
   {
    "rule": "Discard near-horizontal trendlines",
    "detail": "discretionary visual angle; mark trend direction only (arrow) without a line",
    "plannerStep": "Context"
   },
   {
    "rule": "Terminate a trendline when price overextends away from it without a pullback",
    "detail": "discretionary; end roughly halfway into the overextension",
    "plannerStep": "Context"
   },
   {
    "rule": "Mark a zone removed at the candle that removes it and stop extending it",
    "detail": "Use the remove tool to extend only up to the removal candle",
    "plannerStep": "Levels"
   },
   {
    "rule": "Skip a pullback trade to a zone that was already removed or when the pullback is too aggressive",
    "detail": "discretionary",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Do not open trades you cannot manage",
    "detail": "No internet/availability = stay out",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Treat a manually flagged high as an all-time high when price data is broken",
    "detail": "Horizontal ray at the flagged high",
    "plannerStep": "Setup"
   }
  ]
 },
 {
  "n": 3,
  "title": "EURUSD chain-analysis review: trendline breaks, re-anchoring and not forcing zones",
  "kind": "zoom",
  "date": "2026-08-09",
  "summary": "Kevin walks through the EURUSD daily chain-analysis homework, a hard week with almost no clean zones. He uses it to teach when a trendline is removed (a full candle close beyond it), where to anchor and re-anchor trendlines, and why a removed trendline or zone does not always produce a new zone. He then marks the members' homework: forced zones, basing candles called move aways, missed blatant trendlines, a wick used as a valley, too big a timeframe jump in multiple sequence analysis, and a confirmation trade taken after the higher-timeframe zone broke. He closes by switching the homework to AUDUSD daily, explaining why zone size is judged by eye at the current zoom rather than measured, and saying when to go for bigger risk-reward trades instead of a fixed 1:1.",
  "sections": [
   {
    "heading": "Purpose of Sunday sessions and the chain-analysis rules",
    "points": [
     "Sunday sessions are where 'the real education' happens: real charts show situations the recorded lessons can't cover.",
     "The homework is chain analysis on the daily chart. Keep the three rules in an anchored note on the chart, top right.",
     "Only draw a zone that (1) removes an opposing zone, (2) removes a trendline, or (3) makes an all-time high (or low).",
     "Every zone on his analysis chart meets one of those three rules.",
     "Homework: draw all trendlines and all zones."
    ]
   },
   {
    "heading": "The blacked-out anomaly on EURUSD (May 1993 to 1997)",
    "points": [
     "From about May 1993 to 1997 the EURUSD candles had no wicks and were 'impossible to read', so he blacked that stretch out.",
     "Because of that he treated the high right after the blackout as an all-time high. He says this is not normal: 'don't do this' in real analysis, it is only for this homework.",
     "The tricky part was where to start the first downward trendline. He started it from the highest point visible after the blackout.",
     "He gave grace on this trendline in the homework because people could reasonably pick a different starting point."
    ]
   },
   {
    "heading": "First downward trendline: blatant peak and valley vs small ones",
    "points": [
     "There was a small peak and valley and a lower low, but that peak and valley was 'almost too small' next to a much larger, blatant peak and valley.",
     "A trendline needs a blatant peak, a blatant valley and a lower low (for a downtrend).",
     "Most members missed this blatant trendline and drew the small 'boo-boo' peaks and valleys instead. He calls those borderline, not way off.",
     "Only one or two members got the main trendlines right. Stefano was 'the winner', almost perfect apart from missing the updated line."
    ]
   },
   {
    "heading": "Exactly when a trendline is removed",
    "points": [
     "Zoomed in: the downward trendline was removed when one specific red candle closed.",
     "Every candle before it, even a green one, still touched the line with its body or its wick.",
     "Removal needs a full candle close above a downward trendline with neither body nor wick touching it. If the wick comes back down and touches the line, it is not removed.",
     "An upward trendline is the exact opposite: a full close below it without touching.",
     "Upward example: a green candle and a red candle both still touched the line. The candle after them closed fully below without touching, and that one removed it."
    ]
   },
   {
    "heading": "A removed trendline does not guarantee a zone",
    "points": [
     "After that trendline broke, the only candidate was a small rally-base-rally that was 'very close'.",
     "He doesn't usually measure zones ('it's more of a look'), but price was far from the reference zones, so he measured: the candidate was about 215 pips, compared with the move-away candle of an older zone.",
     "Result: 'it's not even close', so no zone.",
     "'Just because… a trendline's removed… doesn't mean we're always gonna have a zone.' If nothing qualifies, leave it."
    ]
   },
   {
    "heading": "Borderline trendline, old tested zone and the supply that removed it",
    "points": [
     "A second trendline with two smaller peaks and valleys does qualify, in his opinion, though it is very close.",
     "No update to that line until another peak and valley forms.",
     "A very old demand zone below had already been tested, and 'we don't trade at tested zones'.",
     "He extended that zone with the remove tool to show where it was removed. In daily analysis you don't have to extend zones all the way back, because it takes too long (he often updates charts on the go). For homework he recommends it because it makes things easier to see.",
     "Rule 1 in action: the opposing zone was removed, so go up and find the supply that removed it.",
     "Candidates: one with too small a move-away candle; one at about 129; one at about 145. He chose the one with 'the biggest move away' and said others could be justified. He admitted he was 'struggling' and would not give anyone a hard time.",
     "Going back to the earlier trendline: it was respected several times, then one candle closed without touching it, and in a real trade that would be the break."
    ]
   },
   {
    "heading": "Drawing and re-anchoring upward trendlines",
    "points": [
     "Draw from the lowest point possible, without cutting through candles, to the second touch point at the valley.",
     "If the line from the absolute lowest point cuts through a candle, adjust the bottom anchor until it no longer cuts through.",
     "After the break: blatant peak, valley and a higher high ('we always need that higher high'), so draw the new trendline from the most recent valley.",
     "A demand zone removed here produced no demand, because nothing qualified as the demand that removed the supply.",
     "Re-anchoring on update: normally connect the most recent peaks and valleys (previous valley to the new valley). Skip the recent valley and go from the very bottom only when using it would make the line too horizontal.",
     "Several members drew from the lowest point to the new valley when it wasn't needed. That is 'not totally wrong', but it isn't how he does it here."
    ]
   },
   {
    "heading": "EURUSD dropped as a homework chart",
    "points": [
     "Almost no clean zones: 'just another bad week of homework'. Even his own single zone felt forced.",
     "His note: EURUSD is only good up to about 1990 for this homework. Price action after that was 'complete junk' (the current EURUSD daily is fine).",
     "He says this week tested whether members could avoid forcing zones. He gave a lot of grace on borderline calls."
    ]
   },
   {
    "heading": "Homework marking: zone mistakes",
    "points": [
     "Basing candle almost the same size as the move away = not explosive. That near-equal size is 'the dead giveaway'.",
     "For every zone ask 'what did this zone accomplish?' / 'what did this remove?' If it removed nothing, don't draw it.",
     "Creating a new low does not equal a zone. 'Just because that's a low doesn't mean there's demand.'",
     "Don't say three zones removed one zone. Follow the chain analysis, one zone at a time.",
     "Choppiness doesn't matter for a zone. A zone fails because the moves aren't explosive, not because price was choppy.",
     "The next candle out from the proximal line must be an explosive move. If it's basing, basing, basing, there is no zone.",
     "'Explosive' is relative to the basing. A zone can barely qualify if it's explosive compared with its basing.",
     "A big wick tells him a candle is basing, not a move away.",
     "Include the wicks of the basing when drawing (for example, a supply drawn without its wick is wrong). Draw the proximal tight to the body.",
     "Basing does not have to be tight and well structured. Include all the basing candles.",
     "End a zone when it is removed. Extending it past removal is 'one of my biggest pet peeves'.",
     "He wouldn't trade a zone that is very large because of a big wick.",
     "A member who drew zones on almost every basing candle was told to rewatch the full YouTube course and get back to basics ('I'm just being brutally honest').",
     "Drawing zones because price reacts to an area hurts your edge. 'The hard part is identifying boo-boo zones.'",
     "His favourite type of zone is a clean drop-base-drop with a single basing candle."
    ]
   },
   {
    "heading": "Homework marking: trendline mistakes, wicks as valleys, channel lenience",
    "points": [
     "Extend trendlines. Several members ended a valid line too early.",
     "Lines that just go sideways are not trendlines. 'If we just got one more peak up, for sure.'",
     "Pick the better valley as the reference point for an updated line. A technical valley isn't enough when a clearer one is there.",
     "A massive wick alone is not a valley. If price is only making momentum lines and one wick sticks out, he won't call that wick a valley.",
     "He attaches to a wick only when a valley built from proper candles already qualifies there and the wick is its extreme.",
     "Channel lenience: a small break of the lower channel line doesn't remove the trendline, as long as price comes back to test or re-enters the channel. Only when price falls 'way, way out' of the channel does the line go (and there is probably an updated line by then).",
     "A member said 'no trendline because it's a range'. He disagreed: there was clearly a trendline.",
     "Don't map out random highs and lows for this homework."
    ]
   },
   {
    "heading": "Homework marking: chart hygiene and other methods",
    "points": [
     "Charts you send must be clean: no overlapping blue and red boxes, and the candle details must be visible. 'I can't judge anything off of that.'",
     "Get rid of CHoCH and break-of-structure markings for this homework. 'This is supply and demand, we don't use that.' Fine if you do it on your own.",
     "If you're on the wrong timeframe or chart, he can't mark the homework.",
     "Don't use the 2-hour: go 4-hour to 15-minute."
    ]
   },
   {
    "heading": "Multiple timeframe and multiple sequence corrections",
    "points": [
     "MTF: the member's daily demand was right, but it broke. Once your higher-timeframe zone breaks, the trade on your entry timeframe (1H) is no longer a confirmation trade. You can still trade the zones, but not as confirmation.",
     "The member's 1H 'demand' had a great move away, but drawn properly it was huge because of the wick, so he wouldn't call it a zone.",
     "MSA: going from a 3-month chart down to a 1-hour is 'way too crazy of a jump'. For a 1H entry, the HTF is the daily and the sequence above the daily is the 1-month.",
     "On macro charts like the 3-month, he mostly ignores the chain rules (opposing zone and so on) because the timeframe is so long, and just draws explosive moves away.",
     "Daily and 1H zones in that example were in the right area but drawn too big. Tighter is better, even if that means you might not get filled.",
     "Trend trading: a downtrend on the daily was recognised correctly, but the marked 'supply zones' were all basing candles."
    ]
   },
   {
    "heading": "New homework: AUDUSD daily (FXCM)",
    "points": [
     "Next homework chart: AUDUSD, 1 day, FXCM broker. Copy the rules note onto the new chart.",
     "Early AUDUSD data is unusable, so draw a vertical line where normal candles start and treat the first high there as an all-time high and the first low as an all-time low, for homework purposes.",
     "Zones form when price breaks all-time highs or lows, not any high or low. Mark the all-time highs and lows as you go so you can spot them.",
     "No supply zones before that point. The homework period starts around January 1993 (he extended it back slightly from December 1992).",
     "Price action in the 90s may need a bit more lenience on what qualifies.",
     "He plans to cycle through charts over the coming months and come back to EURUSD later."
    ]
   },
   {
    "heading": "Zone size depends on the zoom, and risk-reward flexibility",
    "points": [
     "Gold example: after price shot up so far, old zones look tiny and don't look explosive at the current zoom. At the zoom of that time they barely qualified.",
     "That's why he doesn't measure zones: depending on the price action, zones look smaller or bigger, so it's a visual judgment at the zoom you have. Sometimes you need to change the zoom to judge a zone.",
     "Oil weekly is another chart where a huge move distorts the zoom.",
     "Don't always aim for 1:1. Spot chances for larger risk-reward. Those are 'your account boosters' (a 3-4% trade really boosts the account).",
     "He used to believe in a fixed risk-reward (1:1, 2:1, 3:1) and says that leaves money on the table. Recent example: many 1:1 trades lately, but on AUD he saw a possible 3:1 (it didn't work out).",
     "These chances don't come often. He refers to his YouTube 'Set & Forget' video for those situations."
    ]
   }
  ],
  "rules": [
   "Only draw a zone that removes an opposing zone, removes a trendline, or makes an all-time high or low.",
   "Keep the chain-analysis rules in an anchored note on your chart.",
   "A downward trendline is removed only by a full candle close above it with neither body nor wick touching the line; for an upward line, the opposite.",
   "A trendline needs a blatant peak, a blatant valley and a lower low (downtrend) or higher high (uptrend).",
   "Draw upward trendlines from the lowest point possible to the valley without cutting through candles. Move the anchor if it cuts one.",
   "After a break with a new peak, valley and higher high, draw the new trendline from the most recent valley.",
   "When updating a trendline, connect the most recent valleys. Go from the very bottom only if the recent valley makes the line too horizontal.",
   "Don't call a lone wick a valley. Attach to a wick only when a valley from proper candles already qualifies there.",
   "Don't remove a trendline for a small break of the channel; remove it only when price falls far out of the channel.",
   "A removed trendline or zone doesn't mean there must be a zone. If nothing qualifies, draw nothing.",
   "When an opposing zone is removed, go find the zone that removed it, and pick the one with the biggest move away.",
   "Don't trade tested zones.",
   "The candle right after the proximal line must be explosive. If it's basing, there is no zone.",
   "End a zone when it is removed. Don't extend it past removal.",
   "Include all the basing candles and their wicks in the zone, and keep the proximal tight.",
   "Judge zone size by eye at the zoom you have, and change the zoom if price has run far.",
   "If your higher-timeframe zone breaks, the trade is no longer a confirmation trade.",
   "For a 1H entry use daily as the HTF and 1-month as the sequence. Never jump from 3-month to 1H.",
   "On macro charts (3-month), skip the chain rules and draw explosive moves away.",
   "Use 4H to 15m rather than a 2H chart.",
   "Send clean charts with visible candles and no overlapping boxes. Leave out CHoCH/BOS markings.",
   "Look for larger risk-reward when the chance is there instead of a fixed 1:1."
  ],
  "mistakes": [
   "Forcing zones on a chart with no clean ones.",
   "Drawing zones that removed nothing ('what did this zone accomplish?').",
   "Treating a new low or high as a zone.",
   "Claiming several zones removed one zone.",
   "Calling a basing candle almost as big as the move away explosive.",
   "Calling a run of basing candles a move away.",
   "Leaving the basing wick out of the zone.",
   "Drawing zones too big.",
   "Extending a zone past the point where it was removed.",
   "Missing the blatant peak/valley trendline while drawing small boo-boo ones.",
   "Ending a valid trendline too early instead of extending it.",
   "Drawing sideways lines as trendlines.",
   "Re-anchoring an updated trendline from the lowest point when the recent valley was fine.",
   "Using a lone wick as a valley.",
   "Treating a wick that still touches the line as a trendline break.",
   "Removing a trendline just because price slightly broke the channel.",
   "Saying 'no trendline because it's a range' when a clear trendline exists.",
   "Counting a trade as confirmation after the higher-timeframe zone broke.",
   "Jumping from a 3-month chart to a 1H entry.",
   "Using a 2H chart.",
   "Cluttered screenshots with overlapping boxes and unreadable candles.",
   "Mixing CHoCH/BOS markings into supply and demand homework.",
   "Doing homework on the wrong chart or timeframe.",
   "Measuring zone size in pips across very different price levels instead of judging at the right zoom.",
   "Always settling for a fixed 1:1 and leaving money on the table."
  ],
  "quotes": [
   "Just because… a trendline's removed… doesn't mean we're always gonna have a zone.",
   "We need a full close above a downward trend line for it to be removed.",
   "We always need that higher high, too.",
   "What did this zone accomplish?",
   "Creating a new low does not equal a zone.",
   "Little boo-boo peaks and valleys.",
   "It's one of my biggest pet peeves when people continue it.",
   "Choppiness doesn't really matter for a zone.",
   "The hard part is identifying boo-boo zones.",
   "Those are your account boosters.",
   "You're leaving money on the table. You really are.",
   "Not trying to be rude, I'm just being brutally honest."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Blatant peak, valley and lower low vs small boo-boo ones. Anchor from the lowest point without cutting candles, then from the most recent valley after a higher high."
   },
   {
    "key": "zone-removed",
    "caption": "A trendline is removed only by the first candle that closes fully beyond it, with neither body nor wick touching. End zones at the point they are removed."
   },
   {
    "key": "qualify",
    "caption": "The next candle from the proximal must be explosive. A basing candle about the same size as the move away is the giveaway that there's no zone."
   },
   {
    "key": "sequence",
    "caption": "1H entry, daily HTF, 1-month sequence. Never jump from 3-month to 1H."
   },
   {
    "key": "confirmation",
    "caption": "If the higher-timeframe zone breaks, the entry-timeframe trade is no longer a confirmation trade."
   },
   {
    "key": "trend-momentum",
    "caption": "Sideways or momentum lines with no extra peak are not trendlines."
   }
  ],
  "checklist": [
   "Did this zone remove an opposing zone, remove a trendline, or make an all-time high or low?",
   "Is the next candle out from the proximal line explosive compared with the basing?",
   "Is the basing clearly smaller than the move away?",
   "Are all the basing candles and their wicks included, with the proximal tight?",
   "Is the zone untested?",
   "Has the zone been ended where it was removed?",
   "Is the zone size similar to nearby zones at a sensible zoom?",
   "Is the trendline built on a blatant peak, blatant valley and a higher high or lower low?",
   "Does the trendline avoid cutting through any candle?",
   "Did a candle close fully beyond the trendline without touching it?",
   "If updating, is it anchored to the most recent valley (unless that makes it too horizontal)?",
   "Is the valley built from proper candles, not just a wick?",
   "Is price still roughly within the trendline's channel?",
   "Is my higher-timeframe zone still intact, so this is a confirmation trade?",
   "Is my timeframe sequence sensible (e.g. 1H / daily / monthly)?",
   "Is a larger risk-reward than 1:1 realistically available here?"
  ],
  "journalTags": [
   "forced zone",
   "zone removed nothing",
   "new low not a zone",
   "basing called move away",
   "basing too big vs move away",
   "wick excluded",
   "zone too big",
   "zone not ended",
   "missed blatant trendline",
   "boo-boo trendline",
   "trendline not extended",
   "sideways trendline",
   "wrong re-anchor",
   "wick used as valley",
   "early trendline break",
   "tested zone traded",
   "htf zone broke",
   "msa jump too big",
   "wrong timeframe",
   "messy chart",
   "fixed 1:1 only"
  ],
  "newVsPdfs": [
   "Channel lenience: a small break of the channel doesn't remove the trendline if price comes back to test it. Earlier lessons only said price trading beyond the channel makes the line irrelevant.",
   "A lone wick is not a valley. Attach to a wick only when a valley from proper candles already qualifies.",
   "Re-anchor updated lines through the most recent valleys. Skip back to the bottom only when the recent valley makes the line too horizontal.",
   "Once the higher-timeframe zone breaks, an entry-timeframe trade is no longer a confirmation trade (you can still trade the zone).",
   "Multiple sequence analysis: never jump from 3-month to 1H. For a 1H entry the sequence is daily then 1-month. On macro charts (3-month), skip the chain rules and draw explosive moves away.",
   "Measuring is a fallback: when price is far from the reference zones he measures a candidate (about 215) against a known zone's move-away candle. Otherwise size is judged by eye at the right zoom, because huge rallies (gold, oil weekly) shrink old zones.",
   "Don't use a 2H chart; use 4H to 15m.",
   "Risk-reward philosophy: no fixed 1:1. Look for 3:1-type account boosters when the chance is there (3-4% account gains).",
   "Data anomalies: black out unreadable stretches and treat the first high or low after them as an all-time high or low, for homework only.",
   "Chart hygiene for submissions: clean screenshots, visible candles, no CHoCH/BOS markings.",
   "Homework notes: EURUSD is only usable up to about 1990. New homework is AUDUSD daily (FXCM) from about January 1993, and the 90s may need a bit more lenience.",
   "More zone pitfalls: a new low is not a zone; don't say several zones removed one zone; choppiness doesn't disqualify a zone, a missing explosive move does; basing doesn't need to be tight; his favourite zone is a single-candle drop-base-drop."
  ],
  "examples": [
   {
    "market": "EURUSD",
    "timeframe": "Daily (homework)",
    "setup": "First downward trendline after the blacked-out 1993-1997 period, anchored at the highest visible point",
    "reasoning": "A blatant peak, blatant valley and lower low (the small peak/valley nearby was too small). The start point is a judgment call because of the anomaly.",
    "outcome": "Valid trendline. Removed when a red candle closed fully above it without touching."
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily (homework)",
    "setup": "Rally-base-rally candidate right after the downward trendline broke",
    "reasoning": "Looked close. He measured it (about 215) against an older zone's move-away candle and it was not even close in size.",
    "outcome": "No zone. A removed trendline doesn't always produce one."
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily (homework)",
    "setup": "Old tested demand removed, then a search for the supply that removed it (candidates around 129 and 145)",
    "reasoning": "Rule 1: opposing zone removed. He chose the supply with the biggest move away and admitted others could be justified.",
    "outcome": "Supply drawn, but borderline and 'almost forced'. The old demand was not tradable anyway because it had been tested."
   },
   {
    "market": "EURUSD",
    "timeframe": "Daily (homework)",
    "setup": "Upward trendline from the lowest point, adjusted so it doesn't cut a candle, then broken and redrawn",
    "reasoning": "The break came on the first candle that closed fully below without touching. A blatant peak, valley and higher high followed, so the new line starts from the most recent valley.",
    "outcome": "Trendline removed. New trendline from the recent valley. No demand had removed the related supply."
   },
   {
    "market": "Member chart (unspecified)",
    "timeframe": "Daily HTF / 1H entry",
    "setup": "Daily demand with a 1H demand taken as a confirmation trade",
    "reasoning": "The daily demand had broken, so it was no longer a confirmation trade. The 1H zone was huge because of a wick.",
    "outcome": "Not a valid confirmation setup. He wouldn't take a zone like that."
   },
   {
    "market": "Member chart (unspecified)",
    "timeframe": "3-month / Daily / 1H",
    "setup": "Multiple sequence analysis jumping from 3-month to 1H",
    "reasoning": "Too big a jump. For a 1H entry the sequence is daily (HTF) then 1-month. On macro charts, just draw explosive moves away.",
    "outcome": "Right area, but zones too big. Should have used the 1-month."
   },
   {
    "market": "Gold (and oil weekly)",
    "timeframe": "Higher timeframe",
    "setup": "Old zones look non-explosive after a huge rally",
    "reasoning": "The current zoom shrinks old moves. At the zoom of that time they barely qualified as explosive.",
    "outcome": "Judge zone size by eye at the right zoom, not by measuring."
   },
   {
    "market": "AUDUSD",
    "timeframe": "Trade (timeframe not stated)",
    "setup": "Kevin spotted a chance for about a 3:1 instead of his usual 1:1",
    "reasoning": "Bigger risk-reward chances are account boosters, and it is worth spotting when they're available.",
    "outcome": "Didn't work out, but he says looking for these trades is right."
   }
  ],
  "qa": [
   {
    "q": "On the last homework on zones, would that have been a continuation trend, not a drop-base?",
    "a": "He didn't understand what 'continuation trend' meant and gave no further answer."
   },
   {
    "q": "Trend line versus momentum: is this a momentum line and that a trendline?",
    "a": "Yes, that one is momentum and the other is a trendline. There is also another trendline the student missed."
   },
   {
    "q": "Can this be classified as basing?",
    "a": "Absolutely. Basing doesn't have to be tight and well structured. Include all the basing candles in the zone."
   },
   {
    "q": "I drew the zones in the middle, but they don't seem good, right?",
    "a": "Correct, those weren't good, and leaving them out was completely fine."
   },
   {
    "q": "Which chart should the next homework use?",
    "a": "Members suggested AUDUSD and noted it hadn't been done yet. He checked USDCAD and AUDUSD and chose AUDUSD daily on FXCM, because EURUSD after about 1990 has been junk. He thought about a weekly chart but said that would change the timeframes."
   },
   {
    "q": "Struggling with how the zoom changes how zones look?",
    "a": "Yes, it's tough. The chart rescales after huge moves (gold, oil weekly), so old zones look smaller. Judge visually at the zoom of the time. It's simple as long as there aren't insanely big moves."
   },
   {
    "q": "Shouldn't you just take 1:1 trades?",
    "a": "Not always. Spot chances for larger risk-reward, because those are account boosters (a 3-4% trade really helps). A fixed risk-reward leaves money on the table. He's had many 1:1 trades lately but saw a possible 3:1 on AUD. See his Set & Forget video on YouTube."
   }
  ],
  "newDiagrams": [
   {
    "id": "wick-not-a-valley",
    "title": "When a wick can be a valley",
    "caption": "Left: price only makes momentum moves and one long wick sticks out, so the wick is not a valley and there is no trendline. Right: a real valley built from proper candles already exists, so the line can attach to that valley's wick.",
    "svg": "<line x1='160' y1='10' x2='160' y2='170' stroke='#94a3b8' stroke-dasharray='3 3' stroke-width='0.8'/><text x='20' y='18' fill='#f87171' font-size='10'>Wick alone: no valley</text><g><line x1='30' y1='130' x2='30' y2='150' stroke='#34d399'/><rect x='26' y='134' width='8' height='12' fill='#34d399'/><line x1='45' y1='120' x2='45' y2='140' stroke='#34d399'/><rect x='41' y='124' width='8' height='12' fill='#34d399'/><line x1='60' y1='110' x2='60' y2='160' stroke='#f87171'/><rect x='56' y='113' width='8' height='10' fill='#34d399'/><line x1='75' y1='98' x2='75' y2='118' stroke='#34d399'/><rect x='71' y='102' width='8' height='12' fill='#34d399'/><line x1='90' y1='86' x2='90' y2='106' stroke='#34d399'/><rect x='86' y='90' width='8' height='12' fill='#34d399'/><line x1='105' y1='74' x2='105' y2='94' stroke='#34d399'/><rect x='101' y='78' width='8' height='12' fill='#34d399'/><line x1='120' y1='62' x2='120' y2='82' stroke='#34d399'/><rect x='116' y='66' width='8' height='12' fill='#34d399'/></g><line x1='30' y1='150' x2='130' y2='100' stroke='#f87171' stroke-dasharray='4 3'/><text x='64' y='170' fill='#94a3b8' font-size='9'>long wick</text><text x='20' y='34' fill='#94a3b8' font-size='9'>momentum only</text><text x='175' y='18' fill='#34d399' font-size='10'>Real valley + wick: ok</text><g><line x1='180' y1='140' x2='180' y2='158' stroke='#34d399'/><rect x='176' y='144' width='8' height='10' fill='#34d399'/><line x1='195' y1='110' x2='195' y2='146' stroke='#34d399'/><rect x='191' y='114' width='8' height='28' fill='#34d399'/><line x1='210' y1='80' x2='210' y2='116' stroke='#34d399'/><rect x='206' y='84' width='8' height='28' fill='#34d399'/><line x1='225' y1='86' x2='225' y2='112' stroke='#f87171'/><rect x='221' y='90' width='8' height='16' fill='#f87171'/><line x1='240' y1='100' x2='240' y2='140' stroke='#f87171'/><rect x='236' y='104' width='8' height='18' fill='#f87171'/><line x1='255' y1='96' x2='255' y2='118' stroke='#34d399'/><rect x='251' y='100' width='8' height='14' fill='#34d399'/><line x1='270' y1='70' x2='270' y2='102' stroke='#34d399'/><rect x='266' y='74' width='8' height='24' fill='#34d399'/><line x1='285' y1='44' x2='285' y2='76' stroke='#34d399'/><rect x='281' y='48' width='8' height='24' fill='#34d399'/></g><line x1='180' y1='158' x2='300' y2='118' stroke='#a78bfa' stroke-width='1.4'/><text x='212' y='170' fill='#94a3b8' font-size='9'>valley's wick</text><text x='262' y='40' fill='#a78bfa' font-size='9'>higher high</text>"
   },
   {
    "id": "trendline-reanchor-choice",
    "title": "Re-anchoring an updated trendline",
    "caption": "Default: after a new peak, valley and higher high, connect the previous valley to the new valley. Go from the original bottom only when the recent valley would make the line too horizontal.",
    "svg": "<polyline points='20,160 60,90 85,125 130,60 160,105 210,35 240,70 290,20' fill='none' stroke='#94a3b8' stroke-width='1.2'/><circle cx='20' cy='160' r='3' fill='#94a3b8'/><circle cx='85' cy='125' r='3' fill='#34d399'/><circle cx='160' cy='105' r='3' fill='#34d399'/><circle cx='240' cy='70' r='3' fill='#34d399'/><line x1='20' y1='160' x2='130' y2='112' stroke='#34d399' stroke-dasharray='4 3'/><text x='24' y='174' fill='#94a3b8' font-size='9'>first line (lowest point)</text><line x1='85' y1='125' x2='300' y2='54' stroke='#a78bfa' stroke-width='1.4'/><text x='196' y='92' fill='#a78bfa' font-size='10'>update: recent valleys</text><line x1='20' y1='160' x2='300' y2='76' stroke='#f87171' stroke-dasharray='2 3'/><text x='206' y='130' fill='#f87171' font-size='9'>from bottom: only if</text><text x='206' y='141' fill='#f87171' font-size='9'>recent line too flat</text>"
   },
   {
    "id": "channel-lenience",
    "title": "Channel lenience before removing a trendline",
    "caption": "A small dip below the lower channel line that comes back to test the channel keeps the trendline (the lenience area). Falling far out of the channel means the line no longer applies.",
    "svg": "<line x1='20' y1='150' x2='300' y2='40' stroke='#34d399' stroke-width='1.4'/><line x1='20' y1='110' x2='300' y2='0' stroke='#34d399' stroke-dasharray='4 3'/><rect x='150' y='98' width='70' height='30' fill='#a78bfa' fill-opacity='0.15' stroke='#a78bfa' stroke-width='0.6'/><text x='154' y='138' fill='#a78bfa' font-size='9'>lenience area</text><polyline points='40,140 70,105 95,118 130,85 160,105 175,115 195,95 215,80' fill='none' stroke='#94a3b8' stroke-width='1.2'/><text x='196' y='72' fill='#34d399' font-size='9'>back to test: keep</text><polyline points='215,80 240,100 260,140 285,170' fill='none' stroke='#f87171' stroke-width='1.2'/><text x='238' y='160' fill='#f87171' font-size='9'>way out: drop</text><text x='24' y='20' fill='#94a3b8' font-size='9'>trendline + channel</text>"
   }
  ],
  "botRules": [
   {
    "rule": "A zone is eligible only if it removed an opposing zone, removed a trendline, or broke the all-time high or low.",
    "detail": "Three chain-analysis triggers. A new swing low or high that isn't all-time does not count.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Trendline break = the first candle whose whole range (body and wick) is beyond the line.",
    "detail": "Downtrend line: candle low > line value at that bar. Uptrend line: candle high < line value. Any touch = not removed.",
    "plannerStep": "Context"
   },
   {
    "rule": "A valid trendline needs a significant peak, a significant valley and a higher high (uptrend) or lower low (downtrend).",
    "detail": "Discretionary on what counts as blatant: compare with the other peaks and valleys on the chart; tiny ones don't count.",
    "plannerStep": "Context"
   },
   {
    "rule": "Anchor the uptrend line at the lowest low and the valley. If the line crosses any candle in between, move the anchor until it doesn't.",
    "detail": "No candle body or wick may cross the line between the anchors.",
    "plannerStep": "Context"
   },
   {
    "rule": "On update after a new higher high, re-anchor through the most recent valleys unless the slope becomes too flat.",
    "detail": "Fall back to the original lowest point when the recent-valley line is too horizontal (discretionary threshold).",
    "plannerStep": "Context"
   },
   {
    "rule": "Reject a single-wick extreme as a valley unless proper candle bodies also form a valley there.",
    "detail": "Discretionary: needs a candle-based valley; then the wick may be used as the exact anchor.",
    "plannerStep": "Context"
   },
   {
    "rule": "Keep the trendline during a minor break of its channel if price comes back toward the channel. Drop it if price moves far outside.",
    "detail": "Discretionary; no numeric threshold given ('way, way out' of the channel).",
    "plannerStep": "Context"
   },
   {
    "rule": "The first candle beyond the proximal line must be explosive compared with the basing candles.",
    "detail": "Reject if the basing candle is about the same size as the move-away candle, or if the next candles are basing too. Big wick = basing.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zones that are already tested.",
    "detail": "'We don't trade at tested zones.'",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zones that are very large because of a wick.",
    "detail": "Discretionary; compare visually with nearby zones on the same timeframe and zoom.",
    "plannerStep": "Zone"
   },
   {
    "rule": "If several candidate zones removed an opposing zone, choose the one with the largest move away. Only one zone is credited per removal.",
    "detail": "Never credit several zones with removing one zone.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Tag a trade as confirmation only while the higher-timeframe zone is intact.",
    "detail": "If the HTF zone has broken, downgrade it to a non-confirmation zone trade.",
    "plannerStep": "Setup"
   },
   {
    "rule": "Enforce the timeframe sequence: entry, then HTF, then the next HTF up.",
    "detail": "1H entry, daily HTF, 1-month sequence. Reject 3-month to 1H. Reject 2H, and use 4H to 15m.",
    "plannerStep": "Setup"
   },
   {
    "rule": "On macro timeframes (3-month and above), skip the chain-analysis triggers and accept any zone with an explosive move away.",
    "detail": "Stated for 3-month charts.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Judge zone size relative to nearby price action at a local zoom, not with a fixed pip size.",
    "detail": "Discretionary. When price is far from the reference zones, compare against a nearby zone's move-away candle (his example: about 215 was 'not even close').",
    "plannerStep": "Zone"
   },
   {
    "rule": "Set the target by opportunity, not a fixed 1:1.",
    "detail": "Allow about 3:1 when the structure offers it ('account boosters', 3-4% gains). Otherwise 1:1 is acceptable.",
    "plannerStep": "Levels"
   },
   {
    "rule": "No qualifying zone after a trendline or zone removal means no trade.",
    "detail": "Removal alone is not a setup.",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 4,
  "title": "Fresh chain-analysis chart: measuring moves away, single-candle basing, and grading student homework",
  "kind": "zoom",
  "date": "2026-08-16",
  "summary": "Kevin starts the session by going back over the core zone concept from the Discord learning materials. He covers basing (sometimes only one candle, and occasionally none you can see), the explosive move away, the stay-away space as his main measure of zone quality, and trendline versus momentum. He admits the method is about 95% objective. He then does the homework on a brand-new daily chart, where the first visible high and low are treated as all-time highs/lows. He draws each zone using the most recent basing section, compares candle sizes in pips (94, 102 vs 80) to settle borderline moves away, rejects a borderline trendline, and ends an overextended trendline instead of extending it. Most of the session is marking students' homework. The same mistakes keep coming up: zones that are just basing candles, zones drawn too small or too big, momentum lines drawn as trendlines, trendlines with no lower low or higher high, trendlines not attached or started from a random point, and zones ended when tested instead of when removed. The next homework is January 1994 to January 1995. Students must copy his corrected zones exactly (the distal line matters most), submit the chart on the daily timeframe, and map out every all-time high with a horizontal line.",
  "sections": [
   {
    "heading": "Why the Sunday sessions matter",
    "points": [
     "The Sunday sessions are where you learn the strategy more in depth through chain analysis. He cannot make a video lesson for every single explanation, so many answers to members' questions are in these meetings.",
     "Watch the daily breakdowns and the Sunday meetings. Members want his breakdowns because they are accurate, but the point of the group is to learn the strategy yourself.",
     "He points students to the 'learning material' section in the Discord. It holds the core concept of a zone and the trendline material."
    ]
   },
   {
    "heading": "Recap: basing, including single-candle and 'invisible' basing",
    "points": [
     "A zone starts with basing. The basing candles are not always 3. It can be just 1 candle.",
     "Rare case: a massive red candle down (clearly explosive) followed immediately by a massive green candle up, with no basing candle in between. Act as if there is basing there and draw the zone a similar size to your previous zones. He says this is more nuanced and is the kind of situation the Sunday meetings are for.",
     "The move away must be explosive. A move that covers the same distance but is made of tiny 'boo-boo basing candles' is not a move away, so it is not a zone."
    ]
   },
   {
    "heading": "Recap: stay-away candle and the space that grades a zone",
    "points": [
     "Next comes the stay-away candle: price stays away from the proximal line. The stay-away candle creates the space between itself and the proximal line.",
     "That space is pretty much how he judges how good a zone is. The bigger the space, the better the zone.",
     "He loves an explosive move followed by another explosive move. It is preferred, not required.",
     "If a wick comes all the way back and only just misses the proximal line, it is still a zone. This goes back to Lesson 1, drawable vs tradable: a zone with a small space is still drawn, but it is not traded. It is drawn so that, when price comes back, you can see which zone removes it."
    ]
   },
   {
    "heading": "Recap: trendline vs momentum, and how objective the method is",
    "points": [
     "A steep move with no significant pullbacks is momentum. A trendline needs a blatant peak and valley.",
     "Technically every little wiggle is a peak and valley. What he needs is a significant peak and valley that is extremely obvious.",
     "A viewer on his channel commented that it seems too subjective. He says it is about 95% objective with a little subjectivity, and that you cannot make something like this 100% objective.",
     "There is no measurement for a move away. One reason it cannot be fully objective: crazy moves on gold or oil change the zoom of the chart, so you cannot measure moves away consistently. With experience you learn to recognise good moves away. Some are very obvious and some are tricky, and that is okay.",
     "As long as you are not drawing little boo-boo basing candles as the move away, you should be able to spot moves away."
    ]
   },
   {
    "heading": "Chain analysis rules and starting a fresh chart",
    "points": [
     "Only draw zones that (1) remove an opposing zone, (2) remove a trendline, or (3) make an all-time high or low. If you ask why he doesn't have a zone, it is because it didn't fit the chain analysis.",
     "This homework starts on a fresh chart. Earlier price action exists but can't be used. Like an axiom, treat the first high as the all-time high and the first low as the all-time low, because you have to start somewhere.",
     "An all-time high doesn't have to be an obvious peak that price rallied down from. Every wick and high that price breaks above is an all-time high. So a zone can qualify by removing a high that nobody would call an obvious peak.",
     "Just because something (zone, trendline or all-time high) was removed does not mean there is a zone. If no explosive move away removed it (only basing candles), the analysis simply ends there.",
     "Do not end a zone when it is tested. Keep extending it until it is removed, then mark it with the remove tool (the remove box goes where it was removed)."
    ]
   },
   {
    "heading": "Homework walkthrough part 1: first supply and demand zones (daily)",
    "points": [
     "First zone: the starting all-time high was removed by an explosive move. 'Not the best zone, I will admit, but it is an explosive move.'",
     "The basing had two sections: one before the explosive move and one after. He does not combine them because the zone would be too big. He uses the most recent basing section.",
     "The next all-time high: he found no demand that removed it. The candles were all boo-boo basing candles. One got close to a move away but was not big enough compared with the others, so there is no zone and the analysis ends.",
     "Price came back to the earlier zone and gave a nice trade. The zone was kept until it was removed, which happened on an 'objectively explosive' move away.",
     "Sizing that zone: his first draw was too big, so he tightened it to a similar size to the others. He cloned a previous zone to compare. Going a bit bigger is fine (for example if it was tested), but never make it really tiny. Tiny zones mean zones everywhere."
    ]
   },
   {
    "heading": "Homework walkthrough part 2: borderline trendlines and a strong supply",
    "points": [
     "He judged one possible trendline 'not a good enough peak and valley', calling it borderline. He judged another close one good enough and drew it, though he usually doesn't like one drawn off wicks. Both were borderline, and it didn't matter because no zone came from them.",
     "Trendline drawing: go from the lowest point possible to the valley. If the line cuts through a wick, adjust it, because trendlines don't cut through wicks.",
     "A demand zone was removed, but no explosive move did the removing, only basing candles. So he does not just mark the low and call it a zone.",
     "Rule 2 (trendline removed = zone): here the trendline broke but there was no zone, because there was no explosive move.",
     "The last supply drawn removed 2 demand zones and an all-time low: 'Pretty strong zone.'",
     "That supply later failed. He says it was most likely because the zone was so old and there was no liquidity trap before it.",
     "A new all-time low formed with a blatant valley and peak, much better than the borderline one. It is probably more of a weekly trendline but still looks fine on the daily. He drew it from the highest point to the peak, the next touch point.",
     "He contrasts very obvious trendlines ('boom, boom, boom'), borderline ones, and plain momentum, which he does not want to see."
    ]
   },
   {
    "heading": "Homework walkthrough part 3: measuring borderline moves away and ending an overextended trendline",
    "points": [
     "The all-time high was removed (rule 3), with an explosive move away compared with the price action before it. The basing was two candles. The zone was already removed, so he used the remove tool at the removal point rather than extending it.",
     "For Sunday sessions he sometimes measures. A candidate move away measured 94 pips. It was close and borderline, so he drew it to see how it looked, compared it with the other zones, and kept it on the chart.",
     "He admits he probably misses zones in his real trading sometimes by judging them too small: 'I'm not worried about missing a trade. I am not.'",
     "That zone removed the downward trendline. The trendline counts as removed when a candle closes fully above it.",
     "Another candidate demand: the overall candle including the wick measured 102 pips, but the green move-away candle was only about 80. Not good enough, so no demand zone. 'Kind of a close one there, I wouldn't be surprised if somebody had that.'",
     "A blatant peak and valley plus a higher high gives a trendline. Without the high being removed (for example price only pushes up partway and drops), there is no trendline, even with a great valley.",
     "Price then got very overextended above that trendline. You could check it with the channel tool, but it was obvious. So he does not continue the trendline. He ends it, and it becomes irrelevant.",
     "Ending the line on the chart says 'I recognise there was a trendline, and I recognise price got too overextended.' The exact end point doesn't matter as long as you don't continue it.",
     "Reflection: because the first three or four zones on a fresh chart had very strong moves away, it is easy to get too caught up in needing an extremely explosive move. The later borderline zone does qualify."
    ]
   },
   {
    "heading": "Marking homework: zone mistakes",
    "points": [
     "Most common: zones drawn too small. Include all the basing candles that are grouped together, not just two of them. Some zones were too big. 'Get rid of, like, a quarter of that.'",
     "Drawing zones on boo-boo basing candles: 'Every candle I see on this chart is a basing candle.' A zone drawn on a basing candle with no stay-away candle is not a demand zone. If you can't tell what an explosive move away is, go back and watch his free full course on YouTube.",
     "Using too much basing: where the basing isn't all together, he would use single-candle basing for the explosive move.",
     "Misidentifying the move away: the candle right after the basing must be the explosive move. If it isn't, the zone is somewhere else, at the actual explosive move.",
     "Ignoring the wick: the zone has to use the wick.",
     "Ending zones when they are tested or used: 'Just because it's used doesn't mean we end it.' Extend each zone to where it was removed so he can see your work. Ending a zone early makes it look as if it was drawn randomly.",
     "Small zones change the removal point. If you draw a zone too small, it gets removed earlier than it should, which corrupts the chain.",
     "On a very zoomed-out chart, moves away are hard to judge. Zoomed in, some would probably qualify.",
     "A student measured the zone against the move away from basing before an explosive move. The move was slightly bigger, so no zone. 'It is very close… it's not way off.'"
    ]
   },
   {
    "heading": "Marking homework: trendline mistakes",
    "points": [
     "Drawing momentum lines as trendlines. A student had 4 correct trendlines but too many momentum lines, so that is what to work on.",
     "A downward trendline drawn where there is no lower low after the peak is not a trendline. You need a lower low (or higher high), not just a peak and valley. One student also said a zone removed that line. That would have been correct if it had been a trendline.",
     "Trendlines not attached: the line must touch the valley or peak. Zoomed in, even his won't be perfectly attached, but it can't be floating, and a wick must not poke through the line. 'Take pride in our work.'",
     "Wrong starting point: start from the highest point (for a downtrend), not a random spot. The wrong start changes the angle, and that made a student miss a zone later.",
     "A trendline started too far in misses earlier peaks and valleys. Redo sloppy trendlines and don't extend lines past where they belong.",
     "Sideways price action is not a trendline. 'Just one more peak down like that and I would agree.'",
     "He praised students who drew the trendline and then ended it once price was overextended.",
     "He admits a student may have found a valid trendline he missed: 'I'm not even gonna say you're wrong… I probably missed that one.'"
    ]
   },
   {
    "heading": "Homework submission rules",
    "points": [
     "Submit your homework chart on the DAILY timeframe and leave it there when you save it. He cannot switch to your timeframe, so 4-hour submissions cannot be marked.",
     "Fix chart sharing issues. One chart wouldn't open. Another used a data indicator with no wicks, which can't be used anyway.",
     "The 'winner' of best homework is just for fun. There is no prize, and having the worst homework doesn't matter. That's why you're there.",
     "Struggling with what an explosive move away is is fine and is why the group exists. Not following instructions is what frustrates him and feels like wasted time."
    ]
   },
   {
    "heading": "Corrections and next homework (Jan 1994 to Jan 1995)",
    "points": [
     "Copy his homework exactly after the session and make every correction, because later zones will reference these ones. The chain analysis has to stay the same for everyone.",
     "Many students had the borderline zone he rejected. Remove it. It was close, but he doesn't have it.",
     "Add the supply he has if you are missing it, and redraw it his way. The proximal line doesn't matter much (try to keep it similar). The distal line matters, because it decides exactly when the zone was removed.",
     "Next homework: January 1994 to January 1995.",
     "Use the trendline tool, make it perfectly horizontal, and map out every all-time high in the new section. Remember that an all-time high doesn't have to be an obvious one.",
     "Next week he will first check that the corrected supply is drawn exactly his way and the rejected zone is removed.",
     "He measured moves away this week to set a baseline zone size, and plans to do this whenever a new homework chart starts."
    ]
   },
   {
    "heading": "Closing: summer conditions",
    "points": [
     "It is August. If trading is not going great, that is the reality, because summer is usually not the best time to trade.",
     "See you in the daily market breakdowns during the week."
    ]
   }
  ],
  "rules": [
   "Only draw zones that remove an opposing zone, remove a trendline, or make an all-time high/low.",
   "On a fresh chart, treat the first visible high and low as the all-time high and all-time low.",
   "Treat every high that price breaks as an all-time high. It does not have to be an obvious peak.",
   "Require an explosive move away. A distance covered by small basing candles is not a move away.",
   "Basing can be one candle. If a massive drop is followed directly by a massive rally, act as if there is basing and draw a zone similar in size to your previous zones.",
   "Judge zone quality by the space between the stay-away candle and the proximal line. The bigger the space, the better.",
   "A zone with a small space is still drawn (drawable) but not traded (tradable).",
   "When the basing has separate sections, use the most recent section only. Do not combine them.",
   "Include all the basing candles that are grouped together in the zone, not just two.",
   "Keep zones a similar size to your other zones. Slightly bigger is fine. Never really tiny.",
   "Include the wick in the zone.",
   "Extend a zone until it is removed, not until it is tested. Then mark it with the remove tool where it was removed.",
   "If something is removed without an explosive move away, there is no zone and the analysis ends.",
   "A trendline needs a blatant peak and valley plus a higher high (uptrend) or a lower low (downtrend).",
   "Draw an uptrend line from the lowest point possible to the valley, and a downtrend line from the highest point to the peak, never from a random spot.",
   "Trendlines must not cut through wicks. Adjust them so they don't.",
   "Attach the trendline to the valley or peak. No floating lines and no wick poking through.",
   "A trendline is removed by a full candle close beyond it.",
   "When price gets very overextended from a trendline, end the trendline. Do not continue it.",
   "When a move away is borderline, draw the zone to see it and compare it with your other zones. Measuring in pips is fine as a baseline.",
   "Submit homework on the daily timeframe and leave the saved chart there.",
   "After each session, copy his corrections exactly, especially the distal lines, so the chain analysis matches.",
   "Map all-time highs with a perfectly horizontal trendline tool."
  ],
  "mistakes": [
   "Drawing zones on boo-boo basing candles with no explosive move away.",
   "Calling a basing candle with no stay-away candle a demand zone.",
   "Drawing zones too small: only part of the basing group. This gives zones everywhere and earlier false removals.",
   "Drawing zones too big by including too much basing or combining two basing sections.",
   "Picking the wrong candle as the move away. The candle after the basing must be the explosive one.",
   "Ignoring the wick when drawing the zone.",
   "Ending a zone when it was tested or used instead of when it was removed.",
   "Drawing momentum lines as trendlines.",
   "Drawing a trendline from a peak and valley with no lower low or higher high.",
   "Calling sideways price action a trendline.",
   "Trendlines not attached to the valley or peak, or wicks poking through the line.",
   "Starting a trendline from a random point. The angle comes out wrong and later zones get missed.",
   "Continuing a trendline after price got overextended.",
   "Getting too caught up in needing an extremely explosive move after seeing a few very strong zones.",
   "Marking the low and calling it a zone after a removal that had no explosive move.",
   "Submitting homework on the 4-hour timeframe, or as a chart that can't be opened.",
   "Not making the corrections he asked for, such as keeping a zone he told you to remove.",
   "Very old zones with no liquidity trap before them can fail."
  ],
  "quotes": [
   "The bigger the space, the better the zone.",
   "It's, like, 95% objective.",
   "Just because we remove an opposing zone, trend line, or all-time high, doesn't mean we have a zone.",
   "We don't end the zone when it was tested, unless it was removed.",
   "If you make the zone really tiny, then we have zones everywhere.",
   "I'm not worried about missing a trade. I am not.",
   "He's speaking to me through the charts.",
   "Just because it's used doesn't mean we end it.",
   "It's the distal line that matters.",
   "Summer is not usually the best."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Basing (can be 1 candle), explosive move away, stay-away candle. The space between the stay-away candle and the proximal line is how he grades a zone."
   },
   {
    "key": "qualify",
    "caption": "Chain-analysis filter used all session: removes an opposing zone, removes a trendline, or makes an all-time high/low (every broken high counts)."
   },
   {
    "key": "draw",
    "caption": "Include every basing candle in the group and the wick, and keep the zone a similar size to the others. Many students drew zones too small."
   },
   {
    "key": "trend-momentum",
    "caption": "Blatant peak and valley vs momentum. Several students drew momentum lines as trendlines."
   },
   {
    "key": "trendline",
    "caption": "Uptrend: lowest point to valley. Downtrend: highest point to peak. Attached, no wicks cut, and removed by a full candle close beyond it."
   },
   {
    "key": "zone-removed",
    "caption": "Extend a zone through tests until it is removed, then use the remove box at the removal point."
   },
   {
    "key": "quality",
    "caption": "A small space between the stay-away candle and the proximal line means drawable, not tradable."
   },
   {
    "key": "low-odds",
    "caption": "August/summer is usually not the best trading period."
   }
  ],
  "checklist": [
   "Did this zone remove an opposing zone, a trendline, or an all-time high/low?",
   "Is the move away explosive compared with the basing and the surrounding candles, and not made of small basing candles?",
   "Is there a stay-away candle, and how big is the space to the proximal line (tradable or drawable only)?",
   "Am I using only the most recent basing section and including all of its candles and wicks?",
   "Is the zone a similar size to my other zones?",
   "Is the zone extended until it was actually removed?",
   "For a trendline: blatant peak and valley, plus a higher high or lower low?",
   "Does the trendline start at the lowest or highest point, touch the valley or peak, and not cut any wicks?",
   "Has price got overextended from the trendline, so it should be ended?",
   "If the call is borderline: did I draw it and compare it with other zones, or measure it?",
   "Is the zone very old with no liquidity trap before it (higher failure risk)?",
   "Is it summer or August (low-odds conditions)?"
  ],
  "journalTags": [
   "basing candle as zone",
   "no explosive move away",
   "zone too small",
   "zone too big",
   "combined basing sections",
   "wick excluded",
   "zone ended at test",
   "momentum line as trendline",
   "no higher high / lower low",
   "trendline not attached",
   "trendline wrong start point",
   "trendline overextended not ended",
   "zone not qualified",
   "old zone no liquidity trap",
   "summer low odds"
  ],
  "newVsPdfs": [
   "Single-candle or 'invisible' basing: after a massive drop straight into a massive rally, act as if there is basing and size the zone like your previous zones.",
   "When basing has two sections, use the most recent section only. Never combine them.",
   "On a fresh chart, treat the first visible high and low as all-time high and low 'like an axiom'.",
   "He measures moves away in pips at the start of a new homework chart to set a baseline (94 pips kept; 102-pip candle vs ~80-pip move away rejected), while saying there is no fixed measurement.",
   "Explicit 95% objective / 5% subjective admission. Gold and oil moves change the chart zoom, which is why moves away cannot be measured objectively.",
   "A strong supply that removed 2 demand zones and an all-time low still failed, most likely because it was very old and had no liquidity trap before it.",
   "Small zones corrupt the chain: a zone drawn too small gets 'removed' too early.",
   "A wrong trendline start point changes the angle and leads to missed zones further down the chain.",
   "Homework protocol: daily timeframe only, copy his corrections exactly (the distal line decides when a zone is removed), map all-time highs with a horizontal line. Next section is Jan 1994 to Jan 1995.",
   "He accepts missing zones in live trading: 'I'm not worried about missing a trade.'"
  ],
  "examples": [
   {
    "market": "Homework chart (daily, fresh start of new section)",
    "timeframe": "Daily",
    "setup": "Supply zone after the starting all-time high was removed by an explosive move; basing split into two sections",
    "reasoning": "Treat first visible high as all-time high (axiom). Use only the most recent basing section so the zone isn't too big. 'Not the best zone, but it is an explosive move.'",
    "outcome": "Zone drawn; later tested and removed by an objectively explosive move away"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "All-time high removed but only by boo-boo basing candles",
    "reasoning": "A removal without an explosive move away does not create a zone; one candidate was close but smaller than the other moves away",
    "outcome": "No zone; chain analysis ends there"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Zone that removed the earlier zone, sized against prior zones",
    "reasoning": "First draft too big; cloned a previous zone to compare and tightened to similar size; bigger acceptable, tiny never",
    "outcome": "Drawn slightly larger than prior zone; price had given a nice trade off the earlier zone"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Two borderline possible trendlines",
    "reasoning": "One 'not a good enough peak and valley'; the other close enough though drawn off wicks",
    "outcome": "First rejected, second drawn; irrelevant since no zone formed from either"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Supply that removed 2 demand zones and an all-time low",
    "reasoning": "Multiple removals = pretty strong zone",
    "outcome": "Later failed, most likely because it was so old and had no liquidity trap before it"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily (likely weekly trendline)",
    "setup": "New all-time low with blatant valley and peak -> downward trendline",
    "reasoning": "Draw from highest point to the peak (next touch point); much better than the borderline one",
    "outcome": "Trendline later removed by a full candle close above it"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Demand after all-time high removed; candidate move away measured 94 pips",
    "reasoning": "Borderline; drew it to see, compared to other zones",
    "outcome": "Kept on the chart; this zone removed the downward trendline and an area of supply"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Candidate demand: total candle incl. wick 102 pips vs green move-away candle ~80 pips",
    "reasoning": "Move away not big enough relative to the basing",
    "outcome": "No demand zone (close; some students had it)"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Upward trendline: blatant peak, valley, and higher high; price then rallied far above",
    "reasoning": "Price got so overextended (channel tool optional, obvious visually) that the trendline is irrelevant",
    "outcome": "Trendline ended, not extended"
   },
   {
    "market": "AUD (student homework, 1H trend trading)",
    "timeframe": "1H",
    "setup": "Student drew a trendline and many zones",
    "reasoning": "Not a trendline, though overall trend looks up; most zones were on basing candles",
    "outcome": "Told to stop drawing basing-candle 'moves away'"
   }
  ],
  "qa": [
   {
    "q": "How big does a move away have to be, and how do you measure it? (a comment on his channel said it seems too subjective)",
    "a": "There's no measurement. It is about 95% objective with a little subjectivity, which is just reality. You can't make it 100% objective, partly because big moves on gold or oil change the chart's zoom, so a consistent measurement isn't possible. Don't treat boo-boo basing candles as a move away. Some moves away are very obvious and some are tricky. With experience you learn which are good. At the start of a new homework chart he will measure a few in pips to set a baseline."
   },
   {
    "q": "(Student homework) Is this basing, before the explosive move away, a zone?",
    "a": "He measured the move away against it on his other screen. The move was a little bigger, so he wouldn't have that zone, but it was very close and not way off."
   },
   {
    "q": "(Student) Why did you draw this zone?",
    "a": "The student explained it removed a supply further up the chart. He hadn't noticed because he was zoomed in down below, so he'll cover it next week."
   },
   {
    "q": "Any questions before we go?",
    "a": "The chat was quiet and there were no questions. He repeated that he'll check next week that the corrected supply is drawn exactly his way and the rejected zone is removed."
   }
  ],
  "newDiagrams": [
   {
    "id": "single-candle-basing",
    "title": "Basing you can't see",
    "caption": "Normally the zone sits on the basing candles. In the rare case of a massive drop followed directly by a massive rally, act as if there is basing at the turn and draw a zone similar in size to your previous zones.",
    "svg": "<text x=\"80\" y=\"14\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\">Normal basing</text><text x=\"240\" y=\"14\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\">No visible basing (rare)</text><line x1=\"160\" y1=\"20\" x2=\"160\" y2=\"172\" stroke=\"#94a3b8\" stroke-width=\"0.5\" stroke-dasharray=\"3 3\"/><line x1=\"30\" y1=\"40\" x2=\"30\" y2=\"112\" stroke=\"#f87171\"/><rect x=\"26\" y=\"44\" width=\"8\" height=\"62\" fill=\"#f87171\"/><line x1=\"46\" y1=\"104\" x2=\"46\" y2=\"126\" stroke=\"#94a3b8\"/><rect x=\"42\" y=\"108\" width=\"8\" height=\"10\" fill=\"#94a3b8\"/><line x1=\"58\" y1=\"102\" x2=\"58\" y2=\"124\" stroke=\"#94a3b8\"/><rect x=\"54\" y=\"106\" width=\"8\" height=\"10\" fill=\"#94a3b8\"/><line x1=\"72\" y1=\"50\" x2=\"72\" y2=\"112\" stroke=\"#34d399\"/><rect x=\"68\" y=\"54\" width=\"8\" height=\"54\" fill=\"#34d399\"/><line x1=\"88\" y1=\"34\" x2=\"88\" y2=\"60\" stroke=\"#34d399\"/><rect x=\"84\" y=\"38\" width=\"8\" height=\"18\" fill=\"#34d399\"/><rect x=\"40\" y=\"106\" width=\"110\" height=\"20\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"96\" y=\"140\" fill=\"#34d399\" font-size=\"9\">demand: basing candles</text><text x=\"96\" y=\"78\" fill=\"#94a3b8\" font-size=\"9\">explosive away</text><line x1=\"200\" y1=\"30\" x2=\"200\" y2=\"124\" stroke=\"#f87171\"/><rect x=\"196\" y=\"34\" width=\"8\" height=\"84\" fill=\"#f87171\"/><line x1=\"214\" y1=\"40\" x2=\"214\" y2=\"122\" stroke=\"#34d399\"/><rect x=\"210\" y=\"44\" width=\"8\" height=\"72\" fill=\"#34d399\"/><line x1=\"230\" y1=\"26\" x2=\"230\" y2=\"50\" stroke=\"#34d399\"/><rect x=\"226\" y=\"30\" width=\"8\" height=\"16\" fill=\"#34d399\"/><rect x=\"194\" y=\"104\" width=\"116\" height=\"20\" fill=\"#a78bfa\" fill-opacity=\"0.15\" stroke=\"#a78bfa\" stroke-width=\"0.8\" stroke-dasharray=\"3 2\"/><text x=\"238\" y=\"98\" fill=\"#a78bfa\" font-size=\"9\">act as if basing here</text><text x=\"200\" y=\"140\" fill=\"#94a3b8\" font-size=\"9\">draw it similar size to</text><text x=\"200\" y=\"152\" fill=\"#94a3b8\" font-size=\"9\">your previous zones</text><text x=\"200\" y=\"166\" fill=\"#f87171\" font-size=\"9\">massive drop</text><text x=\"244\" y=\"166\" fill=\"#34d399\" font-size=\"9\">then massive rally</text>"
   },
   {
    "id": "most-recent-basing",
    "title": "Use the most recent basing section",
    "caption": "When a long basing area has two sections, draw the zone on the section just before the explosive move only. Combining them makes the zone too big. Still include every candle of that recent group.",
    "svg": "<text x=\"160\" y=\"14\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\">Long basing: use the most recent section only</text><line x1=\"20\" y1=\"70\" x2=\"20\" y2=\"96\" stroke=\"#94a3b8\"/><rect x=\"16\" y=\"74\" width=\"8\" height=\"14\" fill=\"#94a3b8\"/><line x1=\"34\" y1=\"72\" x2=\"34\" y2=\"98\" stroke=\"#94a3b8\"/><rect x=\"30\" y=\"78\" width=\"8\" height=\"12\" fill=\"#94a3b8\"/><line x1=\"48\" y1=\"68\" x2=\"48\" y2=\"94\" stroke=\"#94a3b8\"/><rect x=\"44\" y=\"72\" width=\"8\" height=\"14\" fill=\"#94a3b8\"/><rect x=\"12\" y=\"66\" width=\"46\" height=\"34\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"0.8\" stroke-dasharray=\"3 2\"/><text x=\"14\" y=\"112\" fill=\"#94a3b8\" font-size=\"9\">section 1</text><line x1=\"64\" y1=\"104\" x2=\"64\" y2=\"74\" stroke=\"#f87171\"/><rect x=\"60\" y=\"78\" width=\"8\" height=\"22\" fill=\"#f87171\"/><line x1=\"80\" y1=\"100\" x2=\"80\" y2=\"124\" stroke=\"#94a3b8\"/><rect x=\"76\" y=\"104\" width=\"8\" height=\"12\" fill=\"#94a3b8\"/><line x1=\"94\" y1=\"102\" x2=\"94\" y2=\"126\" stroke=\"#94a3b8\"/><rect x=\"90\" y=\"106\" width=\"8\" height=\"12\" fill=\"#94a3b8\"/><line x1=\"108\" y1=\"100\" x2=\"108\" y2=\"124\" stroke=\"#94a3b8\"/><rect x=\"104\" y=\"104\" width=\"8\" height=\"12\" fill=\"#94a3b8\"/><text x=\"78\" y=\"140\" fill=\"#94a3b8\" font-size=\"9\">section 2 (most recent)</text><line x1=\"124\" y1=\"60\" x2=\"124\" y2=\"118\" stroke=\"#34d399\"/><rect x=\"120\" y=\"64\" width=\"8\" height=\"50\" fill=\"#34d399\"/><line x1=\"140\" y1=\"34\" x2=\"140\" y2=\"66\" stroke=\"#34d399\"/><rect x=\"136\" y=\"38\" width=\"8\" height=\"24\" fill=\"#34d399\"/><text x=\"150\" y=\"70\" fill=\"#34d399\" font-size=\"9\">explosive move away</text><rect x=\"72\" y=\"100\" width=\"236\" height=\"26\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"0.8\"/><text x=\"180\" y=\"116\" fill=\"#34d399\" font-size=\"9\">zone = section 2 only</text><text x=\"14\" y=\"162\" fill=\"#f87171\" font-size=\"9\">Do not combine section 1 + 2: zone becomes too big.</text><text x=\"14\" y=\"174\" fill=\"#94a3b8\" font-size=\"9\">But include ALL candles of the recent basing group (not just 2).</text>"
   },
   {
    "id": "trendline-higher-high-end",
    "title": "Trendline: higher high required, end when overextended",
    "caption": "A peak and valley only become an uptrend line once the prior high breaks. Draw from the lowest point to the valley. When price runs far above the line, end it rather than extending it.",
    "svg": "<text x=\"160\" y=\"14\" fill=\"#a78bfa\" font-size=\"10\" text-anchor=\"middle\">Uptrend line: needs higher high; end it when overextended</text><polyline points=\"20,160 70,90 100,128 150,70 190,40 230,20\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\"/><circle cx=\"70\" cy=\"90\" r=\"2.5\" fill=\"#f87171\"/><text x=\"50\" y=\"84\" fill=\"#f87171\" font-size=\"9\">peak</text><circle cx=\"100\" cy=\"128\" r=\"2.5\" fill=\"#34d399\"/><text x=\"96\" y=\"142\" fill=\"#34d399\" font-size=\"9\">valley</text><line x1=\"20\" y1=\"90\" x2=\"160\" y2=\"90\" stroke=\"#94a3b8\" stroke-width=\"0.6\" stroke-dasharray=\"3 2\"/><text x=\"114\" y=\"100\" fill=\"#94a3b8\" font-size=\"9\">prior high must break</text><line x1=\"20\" y1=\"160\" x2=\"150\" y2=\"118\" stroke=\"#34d399\" stroke-width=\"1.4\"/><text x=\"14\" y=\"174\" fill=\"#34d399\" font-size=\"9\">lowest point -> valley</text><line x1=\"150\" y1=\"118\" x2=\"200\" y2=\"102\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"2 3\"/><text x=\"204\" y=\"104\" fill=\"#f87171\" font-size=\"9\">not extended</text><text x=\"200\" y=\"56\" fill=\"#a78bfa\" font-size=\"9\">price far above the line =</text><text x=\"200\" y=\"68\" fill=\"#a78bfa\" font-size=\"9\">overextended: END line</text><text x=\"200\" y=\"150\" fill=\"#94a3b8\" font-size=\"9\">Peak+valley with no</text><text x=\"200\" y=\"162\" fill=\"#94a3b8\" font-size=\"9\">higher high = no line</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Qualify zone only if it removed an opposing zone, a trendline, or an all-time high/low",
    "detail": "At least one of three. Every high price breaks counts as an all-time high. On a fresh dataset, seed the first high and low as all-time high and low.",
    "plannerStep": "Setup"
   },
   {
    "rule": "Reject when the removal was done without an explosive move-away candle",
    "detail": "No zone, chain ends. Explosiveness is relative to basing and nearby candles (discretionary). Example: 102-pip total candle vs ~80-pip move-away body was rejected, and a 94-pip move away was kept as borderline.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Synthesize basing when an explosive candle is followed directly by an explosive opposite candle",
    "detail": "Place a virtual zone at the turn, sized similar to the median of previous zones",
    "plannerStep": "Zone"
   },
   {
    "rule": "Use only the most recent contiguous basing section before the move away",
    "detail": "Include all of its candles and wicks. Do not merge with earlier basing sections.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Normalize zone height to recent zones",
    "detail": "Similar size to previous zones, slightly bigger allowed, never much smaller (discretionary, no pip value)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Grade zone quality by the gap between the stay-away candle and the proximal line",
    "detail": "Bigger gap = better. A small gap (wick nearly touching the proximal) is drawable but not tradable. A second explosive move is preferred, not required.",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Keep a zone active through tests until it is removed",
    "detail": "Mark removed at the removal candle and stop extending",
    "plannerStep": "Context"
   },
   {
    "rule": "Create a trendline only with a blatant peak and valley AND a break of the prior high (up) or low (down)",
    "detail": "Significance of the peak and valley is discretionary (about 95% objective). Sideways action does not count.",
    "plannerStep": "Context"
   },
   {
    "rule": "Anchor the trendline at the extreme point and attach it to the valley or peak without cutting wicks",
    "detail": "Up: lowest point to valley. Down: highest point to peak. Shift the anchor if any wick is crossed.",
    "plannerStep": "Context"
   },
   {
    "rule": "Mark the trendline removed on a full candle close beyond it",
    "detail": "Full close above a downtrend line, or below an uptrend line",
    "plannerStep": "Context"
   },
   {
    "rule": "End the trendline when price is overextended away from it",
    "detail": "Channel tool optional. Overextension judged visually (discretionary).",
    "plannerStep": "Context"
   },
   {
    "rule": "Lower confidence on very old zones with no prior liquidity trap",
    "detail": "discretionary",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Flag summer/August as low-odds conditions",
    "detail": "discretionary",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 5,
  "title": "The four parts of a zone, full-close trendline removal, ending overextended trendlines and why huge trendlines miss the chain",
  "kind": "zoom",
  "date": "2026-08-23",
  "summary": "Kevin opens with a mini lesson for new members on the four things a zone needs (basing, an explosive move-away, a stay-away candle and the space between the stay-away candle and the proximal line) and what makes a trendline (obvious peak, obvious valley and a new high or low). He then walks through the chain analysis on the daily homework chart, showing that a trendline is only removed when a candle fully closes beyond it, that overextended trendlines should be ended rather than extended, and that a removal does not automatically give a new zone. Along the way he explains his normal stop distance, why a zone broken by a few pips might still not have been a loss, and how a large wick on the move-away candle is fine if the body is big enough. In the homework review the main theme is students drawing trendlines that are too large, which makes them miss the recent peaks and valleys and the zones that follow, plus zones drawn too wide. The session ends with a long off-topic talk on mindset, self-improvement, lowering expenses and keeping your 9-to-5, a note on 12-month stock zones, and the new homework: January 1995 to January 1996.",
  "sections": [
   {
    "heading": "Mini lesson: the four things a zone needs",
    "points": [
     "Thing 1 is basing. About 98% of the time there are basing candles. It can be 1 candle or 3. He prefers 1 to 3, and his favourite is a single-candle basing zone (he points to a recent single-candle basing trade that worked very well).",
     "The rare exception has no basing: a massive red candle down followed straight away by another aggressive move up. Because the move away is aggressive, you still have a zone, and you simply draw the basing in yourself.",
     "Thing 2 is the move-away candle or candles. All you really need is one explosive candle. One big candle is different from a series of little 'boo-boo basing candles'. Little boo-boo candles are not a move away.",
     "After the first explosive candle, little boo-boo basing candles are fine. The best case is basing, an explosive move away, then another explosive move away. The most important part is the explosive move away from the basing.",
     "Thing 3 is the stay-away candle. It can be a basing candle, but he prefers it to be explosive and to carry another explosive move. A boo-boo candle is acceptable.",
     "Thing 4 is the space between the stay-away candle and where you draw the proximal line. You get the space automatically once the stay-away candle closes.",
     "You do NOT have the zone yet after just basing plus a move away. He does not draw it until the stay-away candle has closed and the next candle has started forming. Only then does the zone exist.",
     "The strength of the zone depends on how much space there is between the stay-away candle and the zone. More space is better. A tiny space is a drawable zone but not really a tradable zone (as in the first video lesson).",
     "Drawable-but-not-tradable zones are still kept on the chart because he wants to see what removes them for the chain analysis."
    ]
   },
   {
    "heading": "Mini lesson: trendline vs momentum",
    "points": [
     "A trendline must be very obvious. He admits that is subjective and says it gets easier the more Sunday sessions you attend.",
     "An uptrend line needs a very obvious peak, then a very obvious valley, then a higher high. If after the peak and valley price fails to make a new high, there is no trendline. 'It's that simple.'",
     "Steady moves without that structure are momentum. 'There's momentum everywhere. There's trend lines not everywhere.' Trendlines are harder to get.",
     "He uses trendlines 'as kind of like a guide'."
    ]
   },
   {
    "heading": "Chain analysis rules recap",
    "points": [
     "In the chain analysis you draw all removed zones, all fresh zones, all trendlines, and map all the all-time highs.",
     "Rules (shown top right of the chart): every zone he draws, in homework and in his own chart link, either (1) removes an opposing zone, (2) removes a trendline, or (3) makes an all-time high or low. It must be an all-time high or low, not just any high or low.",
     "He shows examples from earlier in the chart: two zones that qualified because they removed an all-time high, and a supply that removed a demand (rule 1).",
     "Last week's trendline ended where price 'just blasted off'. He did not extend it because it got too overextended. In your homework he wants trendlines to end when they get too overextended.",
     "When a zone is removed, extend it to roughly where it was removed. Leaving it short or running it far past the removal candle is 'laziness'. It does not have to be exactly on it, but it has to be close."
    ]
   },
   {
    "heading": "Walkthrough part 1: the far-away demand and a downtrend line",
    "points": [
     "A supply was removed. Under rule 1 he looked for the zone that removed it. 'Just because a zone is removed doesn't mean we're gonna have a zone.'",
     "He checked a small area close by against the older zones and decided it was not good enough. The zone that removed the supply was quite far down: a demand area. He wrapped the lines around it at a similar size to earlier zones. It was a little smaller, but 'there's no perfection here'.",
     "Then he found a very obvious peak, a very obvious valley and a lower low, so a downtrend line was drawn.",
     "Timing of removal: the trendline was not removed when the first candle poked through it. It was removed when a later candle fully closed beyond it. For a downward trendline you need a full close above it, and for an upward trendline a full close below it.",
     "He gives a live example: the weekly DXY trendline was not removed earlier when price only pushed into it. It was removed this past week with a full close below it."
    ]
   },
   {
    "heading": "Walkthrough part 2: single-candle basing demand, stop placement and a broken zone",
    "points": [
     "The trendline was removed (rule 2). He then looked at the explosive move away and drew a single-candle basing demand. It was just barely broken afterwards.",
     "Trading view: you probably would still have been in this trade. With a stop that tight you might have been stopped out by the spread.",
     "Entry: he enters at the zone or just a little before it, and 'most always' just a little before.",
     "Stop: he showed a normal stop sitting a visible distance beyond the zone and said his stops are 'pretty much always gonna be that far from the zone' at minimum. In volatile conditions (Trump 'on a tirade', a war in Iran) a wider stop makes sense.",
     "A zone being broken does not mean the trade lost. It is not ideal, but with his normal stop this one would not have been a loss unless the spread blew out. The odd stop-out from spread happens, especially on day-trading timeframes.",
     "He showed the stop only, not a take-profit."
    ]
   },
   {
    "heading": "Walkthrough part 3: no zone after the next removal, and an uptrend line that was ended",
    "points": [
     "After that demand was removed (rule 1), he found no qualifying zone. 'I know a lot of you are probably thinking that's a zone.' Checked against the other zones, the move away was not good enough.",
     "A peak, a valley and a higher high gave an uptrend line, attached to the next lowest point.",
     "Price got a bit overextended. He put a channel tool on it, attached to the peak, to check, and said 'it's actually not bad'. He still keeps the line on the chart but does not extend it. In homework he wants it ending around that area, or slightly earlier. 'I just don't want to see it continued.'",
     "An all-time high followed, but no zone removed it, so nothing was drawn. A second all-time high also had nothing he felt comfortable drawing. 'Just because a zone is removed, or a trend line is removed, does not automatically mean that we have a new zone formed.'"
    ]
   },
   {
    "heading": "Walkthrough part 4: the hidden small supply and the big-wick supply",
    "points": [
     "A blatant peak, a valley and a higher high gave another uptrend line.",
     "There was a small zone that was 'very difficult to spot'. He zoomed in, compared it with the other zones and found an explosive move away. It was not a great zone and he probably would not have traded it.",
     "It was an odd situation: there was a stay-away candle as needed, then price shot straight back up into the zone. If you block out what follows, it was setting up nicely (explosive move, stay-away candle, another leg). It was 'still a great trade, but nothing that I would have taken personally'.",
     "He double-checks for missed trendlines: 'Sometimes I'll miss stuff... I'm not perfect.'",
     "A supply then removed an all-time high and a demand, with a very obvious explosive move away but a long wick. 'Just because it's a large move away, doesn't make... an explosive move away.' It still qualifies because the body is big enough overall compared with the wick.",
     "Drawing it was tricky: there was an overall basing area and a little single-candle basing inside it. He drew it out to a point that keeps it a similar size to the other zones rather than making it really tiny.",
     "This supply is a zone for two reasons: it removed an opposing zone and an all-time high.",
     "After that price is at all-time highs. Each little push up is a new all-time high, and there are no more zones, so the chain ends.",
     "Week summary: 4 zones. It was a great 'combination week' that tested spotting zones, trendlines, and not forcing zones that were close."
    ]
   },
   {
    "heading": "Homework review: trendlines too large",
    "points": [
     "The biggest theme: students drew huge trendlines. On a daily chart these are most likely weekly trendlines. Being too zoomed-out means you ignore all the trendlines in between, and those recent ones are what give the zones in the chain.",
     "'We're only really trying to draw the most recent one.' He wants the most recent peak and valley, not too big.",
     "One student's trendline was anchored so that after the second touch point price needed a new high, which it never made, so the line was incorrect.",
     "Another student was 'ignoring that valley'. The correct line runs from the most recent peak through the most recent valley.",
     "Don't draw momentum lines on the homework. Only trendlines.",
     "A trendline drawn where there is no new high after the peak and valley is 'a big no-no... Where is the new high?'",
     "Make sure your trendline is attached to the correct point (he admits he sometimes gets this wrong too).",
     "Ending trendlines when overextended was praised when students did it."
    ]
   },
   {
    "heading": "Homework review: zones, missed items and logistics",
    "points": [
     "The second theme was zones drawn too big from combining too many basing candles. Use the single candle before the explosive move. Some students' zones were only slightly large, and he called that nitpicking.",
     "Weak move-away zones were removed. A boo-boo basing candle is not a supply level.",
     "When an obvious explosive move sits close to a weaker one, draw the more obvious one.",
     "If your homework drew a zone differently, change it to how he drew it so everyone has the same chain analysis next week.",
     "Grace was given on the very hard-to-spot small supply and on a borderline zone that 'could go both ways'.",
     "For new people he wants all-time highs marked on the chart, even if an experienced student already knew it was an all-time-high move.",
     "If a student's earlier zone was wrong, he still marks the later work as if it were correct, because it follows the student's own chain.",
     "You must be on the daily chart, or he cannot mark it. A submission that did not copy the old zones was not marked: 'I will not be marking a homework that does not follow the rules.'",
     "For other lesson homework (multiple sequence analysis, trend trading), label the timeframe. The recurring problem was zones far too big.",
     "The best homework went to the student with only one mistake (the hard demand at the start), who nailed the trendlines and ended them correctly."
    ]
   },
   {
    "heading": "On subjectivity",
    "points": [
     "A YouTube comment said a 'big move away' is too subjective. He agrees there is some subjectivity, and two people's chain analyses may differ by one item depending on zoom, but most students got the important zones, so 'not really at the end of the day'.",
     "Zoom level matters: don't zoom in too much, because then every zone looks like a large move."
    ]
   },
   {
    "heading": "News, markets and 12-month stock zones",
    "points": [
     "A student flagged Friday's all-pairs news (the Jackson Hole Symposium). He says it will probably affect everything, so Friday might not be a great day to trade.",
     "Don't let world events and politics distract you. Focus on your life and on trading.",
     "12-month (yearly) stock zones: there are few options and he is waiting on one that could take years to return. One example was about 100% from a 12-month zone to supply over about 13 years. One stock he bought went up 150% in a day. His 3M purchase at a 12-month zone worked out and paid a dividend on the way up. 'This is building wealth.'",
     "He made a TradingView scanner for these but it did not save."
    ]
   },
   {
    "heading": "Mindset and life (off-topic talk)",
    "points": [
     "Have a great job so you can afford to take risks like long-term investing. He recommends How to Win Friends and Influence People to help you get a better job.",
     "Too much news and information confuses and distracts people (he agreed with a student).",
     "Keep improving: read, give yourself a classical education (rhetoric, logic, grammar), learn philosophy, and don't outsource all your thinking to AI. Use it to help you understand things, not to replace thinking.",
     "Lower expenses: buy meat on sale and freeze it, own DVDs instead of paying for subscriptions. Don't chase the next new thing, and don't care if people think you're weird.",
     "Think generationally, not just about spending everything in retirement.",
     "Roughly 15% of your time for pleasure is his rough figure. The rest goes to learning and improving.",
     "To a student who wants to quit their 9-to-5 by trading: don't think you can give it up in the next year or two. Focus on a good 9-to-5, save money, and lower expenses. It's a long journey.",
     "The goal for the group is profitability, but also improving in life. You need a good income so you can trade your own capital."
    ]
   },
   {
    "heading": "Homework for next week",
    "points": [
     "Chain analysis on the daily chart, January 1995 to January 1996.",
     "Map out the all-time high, and carry over his zones exactly the way he drew them.",
     "It is 'pretty much a fresh chart' with lots of trendlines and quite a few zones. 'It's gonna be a good challenge.'"
    ]
   }
  ],
  "rules": [
   "A zone needs four things: basing, an explosive move-away candle, a stay-away candle, and space between the stay-away candle and the proximal line.",
   "Don't draw a zone until the stay-away candle has closed.",
   "If there is no basing but the move away is aggressive, draw the basing in yourself.",
   "Make sure the first candle out of the basing is explosive. Little boo-boo candles are not a move away.",
   "Rate zone strength by the space between the stay-away candle and the proximal line. More space is better.",
   "Keep drawable-but-untradable zones on the chart to see what removes them.",
   "Draw a zone only if it removes an opposing zone, removes a trendline, or makes an all-time (not just any) high or low.",
   "A removal does not guarantee a new zone. If nothing qualifies, draw nothing.",
   "A trendline needs an obvious peak, an obvious valley, and a new high (uptrend) or new low (downtrend).",
   "An uptrend line is removed only by a full candle close below it, and a downtrend line only by a full close above it.",
   "Attach a new trendline to the most recent peak and valley. Don't draw huge trendlines that skip recent structure.",
   "End a trendline once price becomes too overextended from it. Don't extend it.",
   "When a zone is removed, extend it close to the removal point.",
   "Draw a zone at a similar size to the other zones. Use the single basing candle before the explosive move rather than combining many basing candles.",
   "When an obvious explosive move is next to a weaker one, draw the more obvious one.",
   "A long wick on the move-away candle is fine if the body is still big enough.",
   "Enter at the zone or just a little before it.",
   "Keep the stop at least his normal visible distance beyond the zone. Go wider in volatile conditions.",
   "Don't draw momentum lines in the chain-analysis homework. Only trendlines.",
   "Do homework on the daily chart and copy his zones exactly, or it won't be marked.",
   "Don't zoom in too far when looking for zones."
  ],
  "mistakes": [
   "Drawing trendlines too large (really weekly lines on the daily), which misses recent peaks and valleys and the zones they lead to.",
   "Anchoring a trendline so no new high or low follows the second touch point.",
   "Drawing a trendline where there is no new high or low after the peak and valley.",
   "Ignoring the most recent valley or peak when attaching a trendline.",
   "Extending a trendline after price has become overextended.",
   "Drawing a zone before the stay-away candle has closed.",
   "Treating boo-boo basing candles as an explosive move away.",
   "Drawing zones too big by combining too many basing candles.",
   "Assuming every removal or all-time high gives a new zone (forcing zones).",
   "Calling a trendline removed when a candle only pokes through, before a full close.",
   "Stop loss too tight, right at the zone, so spread spikes take you out.",
   "Assuming a broken zone always means a losing trade.",
   "Being lazy about where removed zones end.",
   "Zooming in so far that every move looks explosive.",
   "Drawing momentum lines on the homework.",
   "Wrong timeframe or not copying the previous zones in homework.",
   "Not labelling the timeframe on lesson homework.",
   "Trading big all-pairs news days such as Jackson Hole without caution.",
   "Expecting to quit a 9-to-5 within a year or two of learning to trade."
  ],
  "quotes": [
   "My favorite one is a single candle basing zone.",
   "We're not looking for little boo-boo basin candles, we're looking for one aggressive move-away candle.",
   "The bigger the space between the stay-away candle, the better.",
   "There's momentum everywhere. There's trend lines not everywhere.",
   "Just because a zone is removed doesn't mean we're gonna have a zone.",
   "For an upper trend line, we need a full close below it.",
   "I don't want to see this, that's laziness.",
   "Just because the zone is broken doesn't mean that the trade wouldn't have worked.",
   "Just because it's a large move away, doesn't make... an explosive move away.",
   "There's no perfection here.",
   "We're only really trying to draw the most recent one.",
   "Where is the new high?",
   "It's so easy to be better than the average person.",
   "Focus on having a good 9-5."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "The four parts: basing (1 to 3 candles, ideally 1), an explosive move-away candle, a stay-away candle, and the space between the stay-away candle and the proximal line, which sets zone strength."
   },
   {
    "key": "qualify",
    "caption": "Drawable vs tradable: a zone with only a small space between the stay-away candle and the proximal line is drawable but not tradable."
   },
   {
    "key": "trendline",
    "caption": "Obvious peak, obvious valley, then a new high or low. Without the new high or low there is no trendline. Anchor to the most recent structure."
   },
   {
    "key": "trend-momentum",
    "caption": "Momentum is everywhere and trendlines are rare. Don't draw momentum lines on homework."
   },
   {
    "key": "entry-stop-tp",
    "caption": "Enter at or just before the zone. The stop sits a visible distance beyond the zone (his minimum), wider in volatile conditions."
   },
   {
    "key": "zone-removed",
    "caption": "A big wick on the move-away candle doesn't disqualify a zone if the body is big enough."
   },
   {
    "key": "sequence",
    "caption": "Chain analysis: each zone must remove an opposing zone or trendline, or make an all-time high or low. A removal does not guarantee a new zone."
   }
  ],
  "checklist": [
   "Is there basing (or an aggressive reversal where I can draw the basing in)?",
   "Is the first candle out of the basing explosive, not boo-boo candles?",
   "Has the stay-away candle closed?",
   "How much space is there between the stay-away candle and the proximal line? Tradable, or just drawable?",
   "Did this zone remove an opposing zone, remove a trendline, or make an all-time high or low?",
   "Is the removing zone reasonably close, not extremely far away?",
   "If there is a long wick on the move-away candle, is the body still big enough?",
   "Is the zone a similar size to my other zones (single candle before the move, not too many basing candles)?",
   "Is my trendline built from the most recent obvious peak and valley, with a new high or low after it?",
   "Has the trendline actually been removed by a full candle close beyond it?",
   "Is the trendline overextended and so should be ended?",
   "Is my entry at or just before the zone, with the stop at least my normal distance beyond it (wider if conditions are volatile)?",
   "Is there major all-pairs news (e.g. Jackson Hole) this day?",
   "Am I on the daily chart with his zones copied (homework)?"
  ],
  "journalTags": [
   "zone not qualified",
   "no stay-away candle",
   "boo-boo move away",
   "zone too big",
   "trendline too large",
   "trendline no new high",
   "trendline not ended",
   "premature trendline removal",
   "forced zone",
   "stop too tight",
   "spread stop-out",
   "over-zoomed",
   "news day",
   "momentum line not trendline"
  ],
  "newVsPdfs": [
   "An explicit four-part zone definition: basing, explosive move away, stay-away candle, and the space between the stay-away candle and the proximal line, with zone strength measured by that space.",
   "The zone does not exist until the stay-away candle closes.",
   "No-basing exception: after an aggressive reversal with no basing, draw the basing in yourself.",
   "'Boo-boo basing candles' named: small candles that do not count as the move away, though they are fine after the first explosive candle.",
   "Trendline removal timing: a full candle close beyond the line (below for uptrend, above for downtrend), shown on the live weekly DXY.",
   "Use a channel tool attached to the peak to judge whether a trendline is overextended, then end it rather than extend it.",
   "A zone just barely broken can still be a non-losing trade when the stop sits his normal distance beyond the zone. Spread spikes are the main risk with tight stops, especially on day-trading timeframes.",
   "How close the removing zone should be: closer is better, judged by feel. If it is extremely far away, end the analysis.",
   "A large wick on the move-away candle is fine if the body is big enough. In a tricky basing area, size the zone to match the other zones.",
   "The homework's main error: trendlines drawn too large (weekly-sized on the daily) skip the recent trendlines and so the zones in the chain.",
   "Don't over-zoom when looking for zones, or every move looks explosive.",
   "12-month stock zones for wealth building (100% over about 13 years, a 150% day, 3M with a dividend).",
   "Career advice: keep a good 9-to-5, lower expenses, and don't expect to go full-time within a year or two."
  ],
  "examples": [
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Supply removed; demand found far below",
    "reasoning": "A nearby candidate was checked against older zones and was not good enough. The real zone that removed the supply was a demand quite far down, drawn at a similar size to earlier zones. Far, but not too far.",
    "outcome": "Drawn as a zone (rule 1: removed an opposing zone)."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Downtrend line: obvious peak, obvious valley, lower low",
    "reasoning": "Meets the trendline rules. Removal counted only when a candle fully closed above it, not when the first candle poked through.",
    "outcome": "Trendline drawn and later removed on the full close."
   },
   {
    "market": "DXY",
    "timeframe": "Weekly",
    "setup": "Weekly uptrend line",
    "reasoning": "Earlier pushes into the line did not remove it. A full weekly close below it this past week did.",
    "outcome": "Trendline now removed."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Single-candle basing demand after the trendline removal",
    "reasoning": "Explosive move away from a single basing candle (rule 2). Price later just barely broke the zone.",
    "outcome": "Zone counted as broken. As a trade, with his normal stop distance beyond the zone it would probably not have been a loss unless the spread spiked."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Candidate zone after the demand was removed",
    "reasoning": "Many students would call it a zone, but compared with the other zones the move away was not good enough.",
    "outcome": "No zone drawn."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Uptrend line: peak, valley, higher high, attached to the next lowest point",
    "reasoning": "Price became somewhat overextended (checked with a channel tool attached to the peak).",
    "outcome": "Line kept but ended, not extended."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Two all-time highs with no removing zone",
    "reasoning": "No zone he felt comfortable drawing.",
    "outcome": "Nothing drawn. A removal does not automatically mean a new zone."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Small, hard-to-spot supply after an uptrend line",
    "reasoning": "Explosive move away when zoomed in, with a stay-away candle, but price shot straight back into it. Not a great zone.",
    "outcome": "Drawn as a zone. It played out well, but he would not have taken it personally."
   },
   {
    "market": "Homework chart (daily, chain analysis; market not named)",
    "timeframe": "Daily",
    "setup": "Supply with a long wick on the move-away candle",
    "reasoning": "The body was still big enough compared with the wick, so it qualifies. Drawn from the overall basing out to a size similar to the other zones, not just the tiny single candle.",
    "outcome": "Zone for two reasons: removed a demand and an all-time high. After that, only new all-time highs and the chain ends."
   },
   {
    "market": "Stocks (12-month chart)",
    "timeframe": "12M",
    "setup": "Long-term buys at 12-month demand zones",
    "reasoning": "Rare setups that take a long time to play out. Used to build wealth (one with a dividend on the way up).",
    "outcome": "Example of about 100% over about 13 years; one stock up 150% in a day; his 3M buy worked out."
   }
  ],
  "qa": [
   {
    "q": "Do we care how close or far the zone that removed something is?",
    "a": "Yes, closer is better. Typically he wants it reasonably near. The demand in this walkthrough was getting far but not too far. He has no way to measure it. If the zone that removed it were all the way further down, he would not draw it and would just end the analysis. It's a feel thing with some subjectivity, and it's unlikely to be that far anyway."
   },
   {
    "q": "Is it better to zoom in really close to spot all the zones?",
    "a": "No. If you zoom in too much, every zone looks like a large move. Missing the small, hard supply this week was understandable."
   },
   {
    "q": "(Student note) Trendlines have been weak for me recently.",
    "a": "He agreed. Overall it was very good work, nothing too detrimental. Keep it up."
   },
   {
    "q": "There's all-pairs news on Friday (Jackson Hole Symposium). What do you think?",
    "a": "He looked it up: central bank leaders meeting about long-term economic issues and possible shifts. It will probably affect everything, so Friday might not be a great day to trade. Don't let the news itself distract you."
   },
   {
    "q": "I'm learning to trade so I can give up my 9-to-5.",
    "a": "Don't think you can give up your 9-to-5 in the next year or two. Focus on having a good 9-to-5, save money, lower your expenses. It's a long journey, but he believes you can do it."
   },
   {
    "q": "Have you read Surrounded by Idiots?",
    "a": "No. He looked it up, found it interesting and may add it to his list."
   }
  ],
  "newDiagrams": [
   {
    "id": "trendline-full-close-removal",
    "title": "Trendline removed only on a full close",
    "caption": "An uptrend line is not removed when a candle pokes through it. It is removed when a candle fully closes below it (mirror for downtrend lines: a full close above).",
    "svg": "<line x1='20' y1='160' x2='300' y2='40' stroke='#a78bfa' stroke-width='1.5'/><text x='22' y='174' fill='#94a3b8' font-size='9'>uptrend line</text><line x1='70' y1='120' x2='70' y2='150' stroke='#34d399'/><rect x='66' y='126' width='8' height='18' fill='#34d399'/><line x1='100' y1='100' x2='100' y2='135' stroke='#34d399'/><rect x='96' y='106' width='8' height='22' fill='#34d399'/><line x1='140' y1='78' x2='140' y2='128' stroke='#f87171'/><rect x='136' y='84' width='8' height='20' fill='#f87171'/><text x='118' y='142' fill='#94a3b8' font-size='9'>wick through:</text><text x='118' y='152' fill='#94a3b8' font-size='9'>NOT removed</text><line x1='170' y1='72' x2='170' y2='92' stroke='#34d399'/><rect x='166' y='76' width='8' height='12' fill='#34d399'/><line x1='220' y1='60' x2='220' y2='118' stroke='#f87171'/><rect x='216' y='64' width='8' height='48' fill='#f87171'/><circle cx='220' cy='112' r='5' fill='none' stroke='#f87171'/><text x='232' y='118' fill='#f87171' font-size='9'>full close below</text><text x='232' y='129' fill='#f87171' font-size='9'>= REMOVED</text><text x='160' y='16' fill='#94a3b8' font-size='10' text-anchor='middle'>Removal needs a full candle close beyond the line</text>"
   },
   {
    "id": "stay-away-space",
    "title": "Stay-away candle and the space",
    "caption": "No zone until the stay-away candle closes. The space between the stay-away candle and the proximal line sets strength: a big space is tradable, a small space is only drawable.",
    "svg": "<text x='80' y='14' fill='#34d399' font-size='10' text-anchor='middle'>Tradable</text><text x='240' y='14' fill='#94a3b8' font-size='10' text-anchor='middle'>Drawable only</text><line x1='160' y1='20' x2='160' y2='172' stroke='#94a3b8' stroke-width='0.5' stroke-dasharray='3 3'/><rect x='14' y='142' width='120' height='16' fill='#34d399' fill-opacity='0.18' stroke='#34d399' stroke-width='0.8'/><text x='16' y='170' fill='#34d399' font-size='9'>demand</text><line x1='30' y1='140' x2='30' y2='160' stroke='#94a3b8'/><rect x='26' y='144' width='8' height='8' fill='#94a3b8'/><line x1='48' y1='90' x2='48' y2='150' stroke='#34d399'/><rect x='44' y='96' width='8' height='50' fill='#34d399'/><line x1='66' y1='46' x2='66' y2='100' stroke='#34d399'/><rect x='62' y='52' width='8' height='44' fill='#34d399'/><text x='76' y='58' fill='#a78bfa' font-size='9'>stay-away</text><line x1='100' y1='52' x2='100' y2='142' stroke='#a78bfa' stroke-dasharray='2 2'/><text x='104' y='104' fill='#a78bfa' font-size='9'>big space</text><rect x='174' y='142' width='120' height='16' fill='#94a3b8' fill-opacity='0.15' stroke='#94a3b8' stroke-width='0.8'/><text x='176' y='170' fill='#94a3b8' font-size='9'>demand</text><line x1='190' y1='140' x2='190' y2='160' stroke='#94a3b8'/><rect x='186' y='144' width='8' height='8' fill='#94a3b8'/><line x1='208' y1='112' x2='208' y2='150' stroke='#34d399'/><rect x='204' y='116' width='8' height='30' fill='#34d399'/><line x1='226' y1='118' x2='226' y2='136' stroke='#94a3b8'/><rect x='222' y='122' width='8' height='10' fill='#94a3b8'/><text x='236' y='118' fill='#a78bfa' font-size='9'>stay-away</text><line x1='260' y1='128' x2='260' y2='142' stroke='#a78bfa' stroke-dasharray='2 2'/><text x='264' y='138' fill='#a78bfa' font-size='9'>tiny space</text>"
   },
   {
    "id": "trendline-too-large",
    "title": "Too-large trendline vs most recent",
    "caption": "A huge line through old structure (really a weekly line) skips the recent peak and valley. Draw the most recent one. That line's removal gives the next zone in the chain.",
    "svg": "<polyline points='14,160 50,110 70,135 110,80 130,105 170,62 190,92 230,48 250,70 290,30' fill='none' stroke='#94a3b8' stroke-width='1'/><line x1='14' y1='160' x2='300' y2='70' stroke='#f87171' stroke-width='1.2' stroke-dasharray='4 3'/><text x='200' y='118' fill='#f87171' font-size='9'>too large (skips structure)</text><line x1='190' y1='92' x2='300' y2='55' stroke='#34d399' stroke-width='1.5'/><text x='180' y='106' fill='#34d399' font-size='9'>valley</text><text x='222' y='42' fill='#34d399' font-size='9'>peak</text><text x='262' y='24' fill='#34d399' font-size='9'>higher high</text><text x='160' y='176' fill='#94a3b8' font-size='9' text-anchor='middle'>Draw the most recent peak-valley-new high line</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Require basing before a zone",
    "detail": "1 to 3 basing candles (1 preferred). If there are 0 basing candles but the reversal is aggressive, synthesize the basing at the turn.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Require an explosive first move-away candle",
    "detail": "At least one explosive candle straight out of the basing. Small 'boo-boo' candles do not count. Explosiveness is judged against the chart's other zones (discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Only confirm a zone after the stay-away candle closes",
    "detail": "Zone is created on the close of the stay-away candle, i.e. once the next candle opens.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Score zone strength by the space between the stay-away candle and the proximal line",
    "detail": "Larger is better. A small gap means drawable but not tradable. No numeric threshold given (discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Accept a wicky move-away candle if the body dominates",
    "detail": "Body must still be big overall compared with the wick (discretionary ratio).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Chain qualification",
    "detail": "Zone valid only if it removed an opposing zone, OR removed a trendline, OR made an all-time high or low (not just a local high or low).",
    "plannerStep": "Setup"
   },
   {
    "rule": "Do not auto-create a zone on a removal",
    "detail": "After a removal or all-time high, create a zone only if one meets the zone criteria; otherwise none.",
    "plannerStep": "Setup"
   },
   {
    "rule": "Limit distance to the removing zone",
    "detail": "Closer is better. If it is extremely far away, end the chain (discretionary, no measure given).",
    "plannerStep": "Setup"
   },
   {
    "rule": "Trendline definition",
    "detail": "Obvious peak, obvious valley, then a new high (uptrend) or a new low (downtrend) after the valley. Otherwise momentum only, not a trendline.",
    "plannerStep": "Context"
   },
   {
    "rule": "Anchor to the most recent structure",
    "detail": "Use the most recent peak and valley, not an older larger swing (avoid weekly-scale lines on the daily).",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removal on a full close",
    "detail": "Uptrend line removed when a candle closes fully below it; downtrend line removed when a candle closes fully above it. Wicks or partial pokes do not count.",
    "plannerStep": "Context"
   },
   {
    "rule": "Stop extending overextended trendlines",
    "detail": "If price runs far from the line (checked with a channel attached to the peak), end the line there (discretionary).",
    "plannerStep": "Context"
   },
   {
    "rule": "Entry at or slightly before the proximal line",
    "detail": "'Most always' just a little before the zone.",
    "plannerStep": "Levels"
   },
   {
    "rule": "Stop beyond the zone at a minimum normal buffer",
    "detail": "At least his usual visible distance beyond the distal line (no pip figure given). Widen it in volatile or news-driven conditions; tight stops risk spread stop-outs, especially intraday.",
    "plannerStep": "Levels"
   },
   {
    "rule": "Flag major all-pairs news days",
    "detail": "E.g. Jackson Hole Symposium Friday: 'might not be a great day to trade'.",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Downgrade a zone that price returns to immediately",
    "detail": "Hard-to-spot zones with an immediate return after the stay-away candle: draw them, but he would not personally trade them (discretionary).",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 6,
  "title": "Chain analysis homework: trendline drawing, updated trendlines and the zone that removes a trendline",
  "kind": "zoom",
  "date": "2026-08-30",
  "summary": "Kevin walks through the chain-analysis homework on the daily chart from January 1995 to January 1996, a week he calls tricky because of the many trendlines. He repeats the three rules for drawing a zone (it removes an opposing zone, removes a trendline, or makes an all-time high/low) and gives a detailed trendline lesson: obvious peak and valley plus a break of the prior low/high, never cutting through wicks, ending overextended lines, updating the line after a new high or low, and counting a trendline as removed only on a full candle close beyond it. He adds a new clarification: for a zone to be the one that removed a downward trendline, its basing candle must be at or below the trendline. He then marks each student's homework, flags zones that 'accomplished nothing', wrong timeframes and redrawn zones that were never on his charts, and says he is debating a future rule for zones with two explosive moves away. He closes by saying a swing trader's stop should be wider when a higher timeframe zone is in control, and by explaining why economic data and fundamentals hardly matter for 1:1 to 3:1 swing trades.",
  "sections": [
   {
    "heading": "Opening and the chain-analysis rules",
    "points": [
     "Sunday livestream for August 30th; Kevin mentions a second child is coming soon and accepts he may miss some trades because of it.",
     "The homework is the chain analysis: if a zone you expected is missing from his chart, it is because it did not fit the chain analysis.",
     "Chain analysis = mark out all the zones and trendlines, and the zones that remove them.",
     "Recap of last week: a demand drawn because it removed a trendline, a supply drawn because it removed a trendline, and a demand drawn because it removed a supply and made an all-time high.",
     "The three rules: only draw a zone that (1) removes an opposing zone, (2) removes a trendline, or (3) makes an all-time high or low. If it does none of these, do not draw it.",
     "Every time you draw a zone, ask yourself: what did it remove?",
     "This week's range: January 1995 to January 1996. He warns it is tricky with many trendlines and says seasoned members sometimes catch things he missed."
    ]
   },
   {
    "heading": "Trendline 1: highest point, no cutting through wicks, ending an overextended line",
    "points": [
     "First he spots a valley, a peak and a lower low, which gives a downward trendline.",
     "For a trendline in either direction you need an OBVIOUS peak and valley, not tiny peaks and valleys, plus a higher high (uptrend) or lower low (downtrend). An obvious peak and valley with no break of the low is not a trendline.",
     "Draw from the highest point possible to the peak.",
     "Zoomed in, the line from the very highest point cut through candles (wicks stuck above it). We do not want that, so adjust to the next highest point possible. Most of the time it has to be adjusted because of the angle change.",
     "Live, he does not try point after point; with experience he can see right away where the anchor goes.",
     "This trendline became way overextended (price pushed far away from it), so he simply ends the trendline there."
    ]
   },
   {
    "heading": "Trendline 2 and identifying the supply that removed the demand",
    "points": [
     "A second obvious peak and valley gives another trendline, drawn from the previous peak to that peak. He admits it can be a bit subjective and 'not 100% perfect, as close as we can get it'.",
     "A demand zone was respected and then removed, so by rule 1 he has to find the supply that removed it. There will not always be one, but most of the time there is.",
     "Nothing stood out. He compared a few small candidate zones by their moves away; he usually judges by eye, but when it is close he measures: 74 pips (to the body), 63, 93 for the whole wick, 85.",
     "His pick for the supply that removed the demand is the zone higher up, with the better move away.",
     "Drawable vs tradable (he refers back to video lesson 1): he would not trade that supply. A lower candidate that is not in the chain analysis had a much better move away, followed by a second explosive move away, and he would take that trade 'all day'. He admits that is partly hindsight.",
     "He would never really take the drawn supply: he does not like how close the stay-away candle is."
    ]
   },
   {
    "heading": "No demand from basing candles below the downward trendline",
    "points": [
     "A downward trendline was removed. Rule 2 says when a trendline is removed we MIGHT have a zone, and the keyword is might.",
     "No demand here: every candle below that trendline is a 'boo-boo' basing candle. None meets the minimum requirement for a zone.",
     "Even he gets confused here, so he sets it up as a trendline lesson."
    ]
   },
   {
    "heading": "Trendline lesson: picking the right peaks and checking with a channel",
    "points": [
     "After the lower move there are many small peaks and valleys. He finds the recent obvious peak, valley and lower low, and draws the trendline peak to peak.",
     "He puts a channel tool on the trendline as a check: price sold off but hovered around the bottom of the channel, which is OK.",
     "What he does not want to see is a massive sell-off away from the line, which tells him price pushed far away from the trendline. The earlier trendline got so overextended that he ended it.",
     "Another trendline: peak and lower low, drawn from the highest point possible to the peak, cutting through no wicks; a clean line.",
     "No zone was drawn at a very explosive move here because it removed nothing (no zone, no trendline), so it is not in the chain analysis."
    ]
   },
   {
    "heading": "Possible future rule: two explosive moves in a row",
    "points": [
     "From a pattern he has seen over 7 years, he is debating a rule for zones that remove nothing but have an extremely obvious explosive candle followed by another one.",
     "He does not know how to qualify it yet. His idea: a move away about 4 to 5 times the size of the basing. The example zone moved away about 5 times the size of its basing.",
     "He does not like changing his rules, but when you see patterns it makes sense. A student said such zones worked for them; Kevin agrees they work out quite a bit but says, for now, they do not follow the rules.",
     "Status: not a rule yet. Do not add these zones to the chain analysis."
    ]
   },
   {
    "heading": "The demand that removed the trendlines: basing at or below the line",
    "points": [
     "Both trendlines were removed, and there were no zones above them before, so none afterwards either.",
     "When a trendline is removed there is a zone; he sees the obvious explosive move away.",
     "Key clarification: for a DOWNWARD trendline, the basing candle of the move away must be AT or BELOW the trendline for that zone to count as the one that removed it.",
     "If the whole basing candle sat above the trendline, that basing and move away did not remove the trendline. Here the basing candle is at the line; even if the line only touches its wick, it counts.",
     "So this demand removed trendline 1 and trendline 2.",
     "Zone size: he trims it slightly so it is similar to the sizes of his other zones. Body to body is also fine."
    ]
   },
   {
    "heading": "When a trendline is removed: full candle close",
    "points": [
     "A trendline is removed only when a candle closes fully beyond it, with no wick or body touching the line. Extend the line until then.",
     "Example: one candle's wick still touched the line, so the line was removed on the next candle, which closed fully above with nothing touching.",
     "A later upward trendline: a very obvious peak and valley ('everybody is seeing this peak and valley'), drawn from the lowest point possible.",
     "A touch that does not close beyond is a RESPECT of the trendline, not a removal."
    ]
   },
   {
    "heading": "Updated trendlines after a new high or low",
    "points": [
     "We do not cut through candles when drawing, but we let the trendline cut through candles until price either breaks it or makes a new high.",
     "Once a new high is made, you do not just move the line there. Draw the updated trendline from the next valley, if a properly drawn line can be made.",
     "The trendline he wants to see on charts is the updated one. You may keep both, and he does not mind seeing the old one, but the updated one is required.",
     "Later, a downward trendline that was fully respected (wicks and bodies kept touching it) had to be extended, not removed, until a candle closed beyond it.",
     "A student pointed out a new lower low that needed an updated trendline from the recent peak (peak, valley, peak, lower low). Kevin had missed it: 'Trendlines can get a little bit confusing.'"
    ]
   },
   {
    "heading": "Older zone trade and the next demand (measuring a close call)",
    "points": [
     "Back at the zone, there was a quick 1:1 off it; he calls it 'a nice little one-to-one' because it is an older zone.",
     "That zone was then removed, so he finds the demand that removed it and measures to check the bare minimum: about 85, then 84 total. It qualifies.",
     "A lower demand made more sense and was the better zone. In real trading you could have both, but the qualifying one goes in the chain analysis.",
     "No supply removed that demand, and no supply removed that trendline.",
     "In real trading, if a supply removes and the qualifying zone is mediocre while a very obvious zone sits lower in a better location, you can trade the better one. For the chain analysis, only the zone that qualified first counts.",
     "Many students drew the better zone. He accepts it, but they must delete it for next week to keep the chain analysis consistent."
    ]
   },
   {
    "heading": "Homework review: common corrections",
    "points": [
     "Ask what each zone accomplished: 'You have your rules, start following them.' Keep the rules on your chart (an anchored note at the top) and check every zone against them.",
     "Do not map out every low and high; it does not matter for this analysis.",
     "A zone drawn too big ignores the peaks and valleys inside it; the basing candle defines where the zone actually is.",
     "Do not label basing candles as the zone: the zone is at the basing before the explosive move away.",
     "Mark zones as removed when they are removed; do not keep extending them.",
     "Copy his chain analysis exactly each week. Do not carry forward zones that were not on his charts last week.",
     "Use the daily FXCM chart. He cannot mark homework done on the 1-hour chart.",
     "A very long trendline is allowed, but it usually skips the peaks and valleys in between. Use the recent valid peak unless the line would become almost horizontal.",
     "A student redrew a trendline from a later peak; that is wrong while the angle from the recent peak is still good. Only if the recent peak were low and the line very horizontal would you do that.",
     "Calling an obvious peak and valley 'too flat' is not a reason to skip a trendline.",
     "Do not draw a zone from a 'boo-boo' basing candle with no real move away.",
     "One student stopped extending a zone because a new trendline formed: correct.",
     "Close call between two supplies: the upper one wins. Both candles are about the same size, but the lower one has a wick at the bottom, which makes it more of a basing candle.",
     "Measured example: candle sizes 203 vs 182 vs 225 ('close enough'), with an older body at 151."
    ]
   },
   {
    "heading": "All-time highs on any timeframe and the zoom effect",
    "points": [
     "A student shared a case with a daily demand (removed an all-time high) and a 1-hour zone (removed a supply).",
     "An all-time high is not only on the daily chart; it can be on any timeframe.",
     "Next week's homework: January 1996 to January 1997. There is an all-time high to map (rule 3), so there will be a zone.",
     "He admits a zone he skipped last week was probably a zone, but he keeps it out for consistency.",
     "A student asked if he is gradually changing the measurement. He explains the zoom effect: after an insanely explosive move (gold, oil), the chart scrunches up and earlier good zones look like small basing candles. That is why he does not like relying on measuring. He has used his method for years and it works, so he will not change it."
    ]
   },
   {
    "heading": "Stops with a higher-timeframe zone in control",
    "points": [
     "A student was stopped out on a Euro trade with a tight stop. He had said in his breakdown to use a wider stop because a daily demand sat there.",
     "The wider stop was not because of NFP. It was because a higher timeframe zone was in control, so you give the trade more wiggle room.",
     "Price could still blast through the daily demand, but why not give yourself more room? 'You guys gotta listen.'",
     "For a momentum trade, a wide stop does not make much sense."
    ]
   },
   {
    "heading": "Economic data, fundamentals and time away from the charts",
    "points": [
     "He does not follow the release schedule; as a swing trader it matters less to him. Day traders definitely need to know when data comes out.",
     "Exception: if he is short, price is moving up toward his stop and NFP is coming, closing the trade beforehand might be a decent idea. But the move is 50-50 either way.",
     "'Your 2-to-1 trade will not be affected by the economics.' Fundamentals matter more for larger risk-reward trades on higher timeframes.",
     "Fundamentals may tell you where price ought to be, but not that it will get there or go in a straight line. You can still get a 1:1 off a supply.",
     "He does not say fundamentals do not matter. He says fundamentals content is an endless source of material for content creators.",
     "Mindset: spend long sessions on the charts (even 10 hours) to recognise patterns, but also step away; you do not want to be on the charts 100% of the time."
    ]
   }
  ],
  "rules": [
   "Only draw a zone that removes an opposing zone, removes a trendline, or makes an all-time high/low.",
   "For every zone you draw, ask: what did it remove?",
   "Draw a trendline only with an obvious peak and valley AND a break of the prior low (downtrend) or high (uptrend).",
   "Anchor from the highest (or lowest) point possible; if the line cuts through wicks or candles, move to the next highest (or lowest) point.",
   "End a trendline when price gets overextended away from it.",
   "A trendline is removed only when a candle closes fully beyond it with no wick or body touching; until then extend it.",
   "Let the trendline cut through candles until price breaks it or makes a new high/low; then draw the updated trendline.",
   "After a new lower low, draw the updated downward trendline from the recent peak.",
   "When a trendline is removed, a zone MIGHT exist; basing candles alone do not qualify.",
   "A demand counts as removing a downward trendline only if its basing candle is at or below the line (for supply and an upward trendline, at or above).",
   "When a zone is removed, look for the opposing zone that removed it; there usually is one, but not always.",
   "When candidates are close, measure the move away; the first one that qualifies goes in the chain analysis.",
   "Keep zone sizes similar to your other zones (trim if needed; body to body is fine).",
   "Copy his chain analysis exactly each week and delete zones not on his charts.",
   "Do homework on the daily FXCM chart.",
   "Keep the rules on an anchored note on your chart.",
   "Use a wider stop when a higher timeframe zone is in control; use a tighter stop for momentum trades.",
   "All-time highs and lows count on any timeframe."
  ],
  "mistakes": [
   "Drawing zones that accomplished nothing (removed nothing).",
   "Mapping out every high and low.",
   "Drawing zones too big, which ignores the inner peaks and valleys and the real basing candle.",
   "Drawing a zone on boo-boo basing candles with no real move away.",
   "Treating basing candles as the zone instead of the basing before the explosive move.",
   "Not marking a removed zone as removed (keeping it extended).",
   "Carrying forward zones that were never in his chain analysis.",
   "Working on the wrong timeframe (1H instead of daily).",
   "Trendlines that cut through candles or wicks.",
   "Missing updated trendlines after a new high or low.",
   "Drawing trendlines too large and skipping the obvious peaks and valleys in between.",
   "Re-anchoring a trendline to a later peak while the angle from the recent peak is still good.",
   "Missing the zone that removed a trendline when its basing sits right at the line.",
   "Using a tight stop when a daily zone is in control.",
   "Not listening to the trade breakdowns.",
   "Letting economic data and fundamentals drive 1:1 to 3:1 swing trades.",
   "Spending 100% of your time on the charts without stepping away."
  ],
  "quotes": [
   "Removes an opposing zone, removes a trend line, or makes an all-time high or low. It's really that simple.",
   "You have to ask yourself, what did it remove?",
   "Not little boo-boo peaks and valleys.",
   "We don't cut through the trend lines, but we let the trend line cut through the candles until we either break it, or until we make a new high.",
   "We need a full candle close, no wicks, no bodies touching it.",
   "Keyword, might.",
   "Trendlines can get a little bit confusing.",
   "I don't like changing my rules, but when you see patterns, it kind of makes sense.",
   "You have your rules, start following them.",
   "You guys gotta listen to me.",
   "Your 2-to-1 trade will not be affected by the economics.",
   "Stepping away also can help."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Obvious peak and valley plus a break of the low; move the anchor when the line cuts wicks; draw an updated line from the recent peak after a new lower low."
   },
   {
    "key": "zone-removed",
    "caption": "The chain analysis: each zone exists because it removed an opposing zone, a trendline, or made an all-time high or low."
   },
   {
    "key": "remove-limit",
    "caption": "Trendline removal needs a full candle close beyond it with no wick or body touching."
   },
   {
    "key": "quality",
    "caption": "Drawable vs tradable: a supply with a close stay-away candle vs a lower zone with two explosive moves away."
   },
   {
    "key": "entry-stop-tp",
    "caption": "Wider stop when a daily zone is in control; tighter stop for momentum trades."
   }
  ],
  "checklist": [
   "What did this zone remove: an opposing zone, a trendline, or an all-time high/low?",
   "Is there an obvious peak and valley plus a break of the low or high?",
   "Does the trendline cut through any wicks or candles?",
   "Has the trendline become overextended, so it should be ended?",
   "Has a candle closed fully beyond the trendline with nothing touching it?",
   "Was a new high or low made, so I need an updated trendline?",
   "Is the zone's basing candle at or below the downward trendline (at or above an upward one)?",
   "Is the move away explosive enough, or is this just basing candles?",
   "Is the zone similar in size to my other zones?",
   "Drawable or tradable: is the stay-away candle too close, and is the move away weak?",
   "Am I on the daily FXCM chart with his previous chain analysis copied exactly?",
   "Is a higher timeframe zone in control, so I should use a wider stop?"
  ],
  "journalTags": [
   "zone not qualified",
   "zone removed nothing",
   "trendline cuts candles",
   "missed updated trendline",
   "overextended trendline",
   "trendline removal no full close",
   "zone too big",
   "basing candle zone",
   "stop too tight htf",
   "wrong timeframe",
   "fundamentals bias"
  ],
  "newVsPdfs": [
   "The chain-analysis homework method: draw only zones that remove an opposing zone, remove a trendline, or make an all-time high/low, and log what removed what.",
   "New precision rule: a zone removes a downward trendline only if its basing candle is at or below the line (touching the wick counts).",
   "Trendline removal requires a full candle close beyond the line with no wick or body touching (applying the zone 'tested' close logic to trendlines).",
   "Using a channel tool to judge whether price is overextended from a trendline, and ending overextended lines.",
   "Proposed (not adopted) rule: zones with two explosive moves in a row, a move away about 4 to 5 times the basing size, even if they remove nothing.",
   "In close calls between zones, the first one to qualify goes in the chain analysis, but you may trade the better-located zone in real trading.",
   "All-time highs and lows count on any timeframe.",
   "The zoom effect after huge moves makes earlier zones look like basing candles, which is why he dislikes measuring.",
   "Stop width: wider when a higher timeframe zone is in control, not because of news; tight for momentum trades.",
   "Fundamentals and economic data barely matter for 1:1 to 3:1 swing trades; consider closing a trade before NFP only if price is already moving toward your stop."
  ],
  "examples": [
   {
    "market": "Homework chart (daily FXCM, Jan 1995 to Jan 1996)",
    "timeframe": "Daily",
    "setup": "Downward trendline drawn from the highest point to the peak, then adjusted",
    "reasoning": "The original line cut through wicks, so he moved it to the next highest point. Price later got overextended from the line.",
    "outcome": "Trendline adjusted, then ended where it became overextended"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Supply that removed a respected demand; choosing between candidates",
    "reasoning": "Weak options measured at 74/63/93/85 pips. The upper zone with the better move away qualified. A lower zone (not in the chain) had a better move away plus a second explosive move away.",
    "outcome": "Upper supply drawn but not tradable (stay-away candle too close). He would trade the lower one 'all day', partly in hindsight."
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Downward trendline removed, with only basing candles below it",
    "reasoning": "Rule 2 says a zone MIGHT exist. All candles were boo-boo basing candles below minimum requirements.",
    "outcome": "No demand drawn"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Explosive demand removing two downward trendlines",
    "reasoning": "The basing candle sat at the trendline (the line touched its wick). It must be at or below the line for a downward trendline. The line was removed when a later candle closed fully above with nothing touching it.",
    "outcome": "Demand drawn as removing trendlines 1 and 2, trimmed to a similar size to his other zones"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Older zone retested",
    "reasoning": "Older zone",
    "outcome": "Quick 1:1, then the zone was removed"
   },
   {
    "market": "Homework chart",
    "timeframe": "Daily",
    "setup": "Demand that removed the older supply; close call between two demands",
    "reasoning": "The upper demand measured about 84-85, the bare minimum, so it qualified first. The lower demand was better located and better quality.",
    "outcome": "Upper one goes in the chain analysis. You can trade the lower one in real trading. Students must delete the lower one for consistency."
   },
   {
    "market": "Student example (gold implied)",
    "timeframe": "Daily + 1H",
    "setup": "Daily demand from removing an all-time high, with a 1H zone from removing a supply",
    "reasoning": "An all-time high can be on any timeframe",
    "outcome": "Shared as a valid example"
   },
   {
    "market": "EUR (Euro)",
    "timeframe": "Swing, with daily demand below",
    "setup": "Long with a tight stop",
    "reasoning": "He advised a wider stop because a daily demand was in control. It was not about NFP.",
    "outcome": "A student with a tight stop was stopped out"
   }
  ],
  "qa": [
   {
    "q": "A student said zones with two explosive moves worked for them but they stopped drawing them because they do not follow the rules.",
    "a": "He agrees those zones work out quite a bit. He is debating a rule, roughly a move away 4 to 5 times the basing size, but for now they are not in the chain analysis."
   },
   {
    "q": "A student pointed out a missed updated trendline after a new lower low.",
    "a": "He agreed: draw the updated line from the recent peak (peak, valley, peak, lower low). He thanked the student and said trendlines can get confusing."
   },
   {
    "q": "A student noted a daily demand that removed an all-time high and a 1H zone that removed a supply.",
    "a": "Correct. All-time highs are not only on the daily; they can be on any timeframe."
   },
   {
    "q": "A student wrote 'too flat' as the reason for skipping a trendline.",
    "a": "He did not understand it. It was an obvious peak and valley, so the trendline should be drawn."
   },
   {
    "q": "Are you gradually changing the measurement of zones?",
    "a": "No. After insanely explosive moves (gold, oil), the chart scrunches up and earlier good zones look like small basing candles: the zoom effect. That is why he dislikes relying on measuring. His method has worked for years, so he will not change it."
   },
   {
    "q": "Was the wider stop on the Euro trade because of NFP (this Friday)?",
    "a": "No. It was wider because a higher timeframe (daily) zone was in control, to give more wiggle room. He does not follow the data schedule as a swing trader. Day traders must. He might close a trade before NFP if price is already moving toward his stop, but it is 50-50."
   }
  ],
  "newDiagrams": [
   {
    "id": "basing-at-trendline",
    "title": "Zone that removes a trendline",
    "caption": "Valid: the demand's basing candle is at or below the downward trendline (touching its wick counts). Invalid: basing fully above the line, so that move did not remove the line.",
    "svg": "<line x1='20' y1='30' x2='300' y2='120' stroke='#f87171' stroke-width='1.5'/><text x='230' y='92' fill='#f87171' font-size='9'>down trendline</text><rect x='70' y='60' width='40' height='26' fill='#34d399' fill-opacity='0.18' stroke='#34d399'/><line x1='90' y1='52' x2='90' y2='92' stroke='#94a3b8'/><rect x='86' y='64' width='8' height='14' fill='#94a3b8'/><rect x='100' y='20' width='10' height='50' fill='#34d399'/><line x1='105' y1='14' x2='105' y2='72' stroke='#34d399'/><text x='60' y='104' fill='#34d399' font-size='9'>VALID: basing at line</text><rect x='200' y='40' width='40' height='22' fill='#a78bfa' fill-opacity='0.15' stroke='#a78bfa' stroke-dasharray='3 2'/><rect x='216' y='44' width='8' height='12' fill='#94a3b8'/><rect x='228' y='10' width='10' height='36' fill='#34d399'/><text x='186' y='34' fill='#a78bfa' font-size='9'>basing above line</text><text x='186' y='150' fill='#94a3b8' font-size='9'>did not remove the line</text><text x='20' y='170' fill='#94a3b8' font-size='9'>Removal: candle closes fully above, no wick or body touching</text>"
   },
   {
    "id": "updated-trendline",
    "title": "Updated trendline after a new low",
    "caption": "The old line is drawn peak to peak and may cut through candles until a new lower low. Then draw the updated line from the recent peak. Do not move to a later peak while the angle stays good.",
    "svg": "<polyline points='20,30 60,90 100,50 140,120 180,80 230,150 270,110' fill='none' stroke='#94a3b8' stroke-width='1.2'/><line x1='20' y1='30' x2='200' y2='75' stroke='#f87171' stroke-opacity='0.5' stroke-dasharray='4 3'/><text x='150' y='58' fill='#f87171' font-size='9'>old line</text><line x1='100' y1='50' x2='300' y2='104' stroke='#f87171' stroke-width='1.5'/><text x='240' y='92' fill='#f87171' font-size='9'>updated</text><circle cx='140' cy='120' r='3' fill='#a78bfa'/><text x='110' y='136' fill='#a78bfa' font-size='9'>valley</text><circle cx='230' cy='150' r='3' fill='#a78bfa'/><text x='200' y='166' fill='#a78bfa' font-size='9'>new lower low</text><text x='20' y='175' fill='#94a3b8' font-size='9'>peak, valley, peak, lower low</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Zone qualification for the chain",
    "detail": "Keep the zone only if it removed an opposing zone, removed a trendline, or made an all-time high/low (any timeframe); otherwise discard it",
    "plannerStep": "Zone"
   },
   {
    "rule": "Trendline existence",
    "detail": "Needs an obvious peak and valley (discretionary size) plus a close beyond the prior low (downtrend) or high (uptrend)",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline anchor",
    "detail": "Start at the highest/lowest point; if any wick or body crosses the line between anchors, move to the next extreme point",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removal",
    "detail": "Removed when a candle closes fully beyond the line with no wick or body touching; any touch = respect, so extend the line",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline update",
    "detail": "On a new lower low (or higher high), redraw from the most recent peak (or valley) if a valid line exists",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline overextension",
    "detail": "discretionary: end the line when price sells off or rallies far from it (channel check)",
    "plannerStep": "Context"
   },
   {
    "rule": "Zone removing a downward trendline",
    "detail": "The basing candle's range must be at or below the trendline value at that bar (wick touch counts); otherwise that zone did not remove the line",
    "plannerStep": "Zone"
   },
   {
    "rule": "Basing-only rejection",
    "detail": "If the candles past the removed trendline are all basing candles with no explosive move away, there is no zone",
    "plannerStep": "Zone"
   },
   {
    "rule": "Close-call selection",
    "detail": "Measure the move away when candidates are close (examples: 74/63/93/85 pips; 84-85 minimum). The first that qualifies goes in the chain",
    "plannerStep": "Zone"
   },
   {
    "rule": "Drawable vs tradable flag",
    "detail": "Mark as drawable-only if the stay-away candle is close or the move away is weak; discretionary",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Stop width",
    "detail": "Widen the stop when a higher timeframe (e.g. daily) zone is in control; tight stop for momentum trades; news is not a reason",
    "plannerStep": "Levels"
   },
   {
    "rule": "News exit",
    "detail": "discretionary: consider closing a swing trade before NFP only if price is already moving toward the stop",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 7,
  "title": "Chain analysis Jan 1996 to Jan 1997: emotional wicks, the stay-away candle, starting trendlines from the recent valley and mapping all-time highs",
  "kind": "zoom",
  "date": "2026-09-06",
  "summary": "Kevin opens after a losing week by reminding students that bad weeks and months are normal and that the 'turn $5 into $500k' picture sold by fake gurus is false. He finishes the daily chain analysis (Aussie, January 1996 to January 1997) using his three zone rules, showing a trendline-removal demand, an all-time-high supply, a borderline trendline, a demand rejected for having no stay-away candle, and a 10 out of 10 single-candle demand that was spiked through by a news-driven emotional wick. He defines an emotional wick precisely: a zone is only kept through an emotional wick when only the wick pierces it; if the body closes beyond, it is removed, and if you keep a zone through an emotional wick you extend it and the next supply/demand is taken from there. He explains that being stopped by news on a day-trading chart is your fault, while on a daily swing chart it is out of your control. The homework review hammers three recurring errors: trendlines started from a random point instead of the most recent peak and valley, trendlines that are too large (weekly-sized) and miss the ones in between, and missing zones because all-time highs were not mapped; plus zones whose first candle out is a basing candle, 50% wick candles drawn as zones, lines not attached (use the magnet tool), and zones that removed nothing. New homework: January 1997 to January 1998.",
  "sections": [
   {
    "heading": "Opening: losing weeks are normal",
    "points": [
     "It was not a good trading week; as he said at the end of the forecast video, these weeks can happen.",
     "Beginners think bad weeks cannot happen because fake gurus advertise trading as turning $5 into $500 grand. That is nonsense, so when a bad week or a bad month comes you must not panic - get that idea out of your head.",
     "(Personal chat about a tornado near his home; no trading content.)"
    ]
   },
   {
    "heading": "Chain analysis recap: the three rules",
    "points": [
     "Homework period reviewed: daily chart (Aussie), January 1996 to January 1997.",
     "For new members: in the chain analysis we only draw zones that follow one of the three rules written on the top right of his chart.",
     "Rule 2: when a trendline is removed, we have a zone. Rule 3: when price makes an all-time high, we have a zone. The other rule used in the chain is that an opposing zone was removed.",
     "Definition repeated: a zone is basing, an explosive move away, a stay-away candle, and space between the stay-away candle and the zone."
    ]
   },
   {
    "heading": "Walkthrough 1: demand from a trendline removal",
    "points": [
     "The last part of the previous chain was a trendline; it is removed, giving a demand zone.",
     "The trendline touches both basing candles before the explosive move away, so the demand is valid. If the line were a little lower and did not touch the basing candle, he would not draw the zone - it is that simple.",
     "He drew the zone a little big but said it is fine."
    ]
   },
   {
    "heading": "Walkthrough 2: all-time high supply and a too-large trendline",
    "points": [
     "Price made an all-time high, so by rule 3 there is a zone (supply) there.",
     "Many students probably wanted to draw a long trendline there. It is technically correct but really big - on a daily chart it is probably a weekly trendline, so he does not draw it.",
     "The all-time high was removed by an area of demand that looks 'somewhat decent' but is not his favourite and not one he would trade: the move away is barely explosive enough; he wanted another explosive candle.",
     "There is a demand near the all-time high area that is 'close but just not good enough': the basing barely qualifies and the move away does not."
    ]
   },
   {
    "heading": "Walkthrough 3: borderline trendlines and readjusting",
    "points": [
     "Determining whether a peak and valley are good enough is sometimes borderline: 'when we have rules, there's gonna be times where it's borderline.' He drew it to see what it looked like and accepted it.",
     "He compared two similar-looking valleys: one was formed only by a wick, the other by actual candles (bodies). The one formed by actual candles makes the better valley, so that trendline was kept.",
     "A trendline needs three things: a peak, a valley, and a lower low (for a downtrend; higher high for an uptrend).",
     "When a new peak, valley and lower low form, the trendline is readjusted to the newer ones. You could have both lines on the chart; he removed the older one, but the newer one is what he wanted to see.",
     "The resulting demand was removed - not surprising because it was very poor quality - leaving a supply zone with an objectively explosive candle (looked better the more he zoomed in)."
    ]
   },
   {
    "heading": "Walkthrough 4: no demand because there is no stay-away candle",
    "points": [
     "After the supply removed the opposing demand, he looked for a demand and found nothing that represents demand.",
     "One almost qualified, but drawn that tight it was too small. Drawn at a proper size there is basing and an explosive move but no stay-away candle.",
     "The stay-away candle means price stayed away from the zone. The stay-away candle cannot touch the zone, or it is not a stay-away candle.",
     "Next, a blatant peak, valley and lower low gave another trendline, which was removed by an area of demand that also removed the all-time high."
    ]
   },
   {
    "heading": "TradingView tip: Shift for straight lines",
    "points": [
     "When drawing all-time highs it is hard to get the line perfectly flat. Hold Shift while drawing to get a straight (horizontal) line; it also snaps to a 45-degree angle or a vertical line."
    ]
   },
   {
    "heading": "Walkthrough 5: the 10/10 demand and the emotional wick",
    "points": [
     "A single-candle basing demand that removed an all-time high, with clean basing and an amazing move away: 'a 10 out of 10 zone'. He would take that trade all day, every day.",
     "Price spiked straight through it as if it was not there, most likely due to a news event or economic data on the Aussie or, more likely, the US dollar. That can happen.",
     "He compared its location to a current 4-hour S&P zone near an all-time high; the S&P zone is good but this one is better.",
     "Answering what an emotional candle is: this obvious, massive wick through the zone is an emotional wick.",
     "Because it was only a wick, he did not end the zone there; he extended it. The zone was respected afterwards and price pushed up - a pattern he noticed doing the chain analysis, which is why he extends zones through emotional wicks.",
     "Later a candle broke the zone with its body, so the zone was removed.",
     "Precise rule: an emotional wick only counts (zone not removed) when it is just the wick. Even if the wick is enormous, if the body closes beyond the zone, even barely, the zone is removed.",
     "A new supply was created after that and gave a nice move. Drawn tight it is too small, so he drew it a bit bigger; another zone could also be a bit bigger.",
     "You would still be stopped out by the emotional wick, 100%, but the zone is not removed."
    ]
   },
   {
    "heading": "News and fault: day trading vs swing trading",
    "points": [
     "On a 1-minute (day trading) chart, if you know inflation data is coming out on the dollar and you leave an order at the zone and get wicked out, that is your fault for placing the trade knowing news was due.",
     "On a daily (swing) chart with a daily limit order, especially when price is far away, this would not bother him much and is not really your fault - it is out of your control.",
     "That is why the Sunday forecast starts with when economic data comes out: not to predict the data, but to know when it is released so you do not get hit by an emotional wick."
    ]
   },
   {
    "heading": "Homework review: zone drawing corrections",
    "points": [
     "A student's zone was reasonable but he would include another basing candle from the same group: it does not make the zone much bigger and gives more wiggle room. Including a far-away basing candle would make the zone too big compared to the other zones, so do not.",
     "You must change your zones to match his exactly (e.g. move the distal line) before next week's homework, because a different zone changes the later chain - 'an absolute must'. All zones must be on your charts to get the same chain.",
     "Lines that are not actually attached to the candles: use the magnet tool and wrap the lines around the basing properly.",
     "Include the wick at the top/bottom of the zone when it belongs to the basing.",
     "A supply drawn on a candle with a massive wick is a 50% candle; he does not really draw 50% candles as zones. He recommends the 50% candle indicator to show them.",
     "When you extend a zone through an emotional wick, the next zone (e.g. the supply) is the one nearest to the removed demand - the nearest explosive move away - not an earlier one.",
     "A zone the student pointed at was not demand because the first candle out was a basing candle, not an explosive move away. The candle right after the proximal line must be explosive; if it is a basing candle, redraw the zone so the explosive candle follows it.",
     "A 'larger basing candle' is still a basing candle; it does not qualify as the move away.",
     "A 5-minute demand had an explosive move but very small space between the stay-away candle and the zone, so it is not really a tradable zone.",
     "A bearish zone 'technically qualifies' but is not good; you want a decent amount of space from the stay-away candle to where the zone is drawn.",
     "Only the zone that broke the opposing zone is the zone by rule; any other is 'just an extra one'.",
     "Do not extend zones all the way across the chart - it makes it too messy.",
     "Every zone must accomplish something: ask 'what did it remove?' If nothing, it is not a chain zone.",
     "A student who did not copy the previous weeks' work missed zones; you must copy all previous analysis and follow the instructions (do not submit homework screenshots, only draw the zones/move points)."
    ]
   },
   {
    "heading": "Homework review: trendline corrections",
    "points": [
     "Most common error this week: many students started the trendline from the same random point. A trendline is drawn from the most recent peak and valley, not from a point that is not a valley.",
     "Even when a student's line ended up as the same line, the concept was wrong: draw from the most recent peak and valley; when a new peak and valley form, go from those. Touching three points does not matter - we only use two.",
     "He does sometimes attach a line to a less obvious point, but only when there is no proper valley/peak to attach to (e.g. attach to the next lowest point). That did not apply here.",
     "A peak and valley without a new high (uptrend) or lower low (downtrend) after it is not a trendline: 'a trend line could have the best peak and valley, but if we do not break that opposing high, there is no trend line'. No trendline means no zone from it.",
     "Too-large trendlines: a weekly-sized line on a daily chart makes you miss all the trendlines (and zones) in between. If it is the only one available it is reasonable, but a weekly trendline stays on the weekly.",
     "Zooming: if you are too zoomed out you miss peaks and valleys in between; too zoomed in and you can miss a trendline (he admitted missing one a student found).",
     "A trendline that is only slightly overextended is still fine (close to too large but valid).",
     "Momentum line (blue) vs trendline (black): a student's momentum line was correct but the trendline too big."
    ]
   },
   {
    "heading": "Homework review: map the all-time highs",
    "points": [
     "Several students missed zones simply because they did not mark the all-time high/low; one missed zone then made them miss the next zone in the chain.",
     "'Map out the all-time highs, and then the chain will most likely be correct.' He recommends having all-time highs mapped before starting.",
     "A student asked about an all-time low; he found one was very close and marked it with a horizontal ray.",
     "Praise went to work where trendlines, demand and supply were all correct with only one missed trendline."
    ]
   },
   {
    "heading": "Wrap-up and homework",
    "points": [
     "He will add rules and possibly a copy of his chain analysis exactly as he did it to clear things up.",
     "Next homework: January 1997 to January 1998, with all previous zones drawn exactly as his.",
     "No student questions were asked; he hopes for a better trading week and asks students to stay positive."
    ]
   }
  ],
  "rules": [
   "Only draw chain zones that follow one of the three rules (opposing zone removed, trendline removed, all-time high/low).",
   "Draw a trendline-removal zone only if the trendline touches the basing candles before the explosive move away.",
   "Require a stay-away candle that does not touch the zone.",
   "Make the candle after the proximal line an explosive candle, never a basing candle.",
   "Draw a trendline only after a peak, a valley and a new high/lower low.",
   "Start trendlines from the most recent peak and valley; readjust when a newer peak, valley and new extreme form.",
   "Use two points for a trendline, not three.",
   "Leave weekly-sized trendlines on the weekly chart; do not draw them on the daily.",
   "Prefer a valley formed by candle bodies over one formed only by a wick.",
   "Keep a zone through an emotional wick only if just the wick pierces it; remove it if the body closes beyond, even barely.",
   "Extend a zone through an emotional wick, and take the next opposing zone from the nearest explosive move to the removed zone.",
   "Do not draw 50% (huge-wick) candles as zones.",
   "Include adjacent basing candles in the same group if it does not make the zone too big compared to other zones.",
   "Map out all-time highs and lows before doing the chain.",
   "Copy all previous analysis and correct your zones to match his before the next homework.",
   "Use the magnet tool so zones and trendlines are actually attached; hold Shift for straight horizontal lines.",
   "Do not extend zones all the way across the chart.",
   "Know when economic data is released; do not leave day-trading orders at zones into known news."
  ],
  "mistakes": [
   "Believing bad weeks or months should not happen.",
   "Starting trendlines from a random point that is not a valley.",
   "Drawing trendlines too large (weekly-sized on daily) and missing those in between.",
   "Drawing a trendline with a peak and valley but no new high/low.",
   "Not mapping all-time highs, which cascades into missing later zones.",
   "Calling a basing candle (or larger basing candle) the explosive move away.",
   "Drawing zones with no stay-away candle or tiny space between stay-away candle and zone.",
   "Drawing zones too small or too big.",
   "Drawing a 50% huge-wick candle as a zone.",
   "Ending a zone at an emotional wick instead of extending it; or keeping a zone when the body closed through.",
   "Drawing zones that removed nothing.",
   "Lines not attached to candles; not using the magnet tool.",
   "Not copying previous weeks' analysis or not correcting zones to match his.",
   "Extending zones all the way across the chart.",
   "Day trading into known news releases with orders at zones.",
   "Being too zoomed out or too zoomed in and missing peaks/valleys."
  ],
  "quotes": [
   "These weeks can happen.",
   "When we have rules, there's gonna be times where it's borderline.",
   "The stay-away candle can't touch the zone, or else it's not a stay-away candle.",
   "This is a 10 out of 10 zone.",
   "Emotional wicks only count when it's just the wick.",
   "You would be stopped out, but we're not removing the zone.",
   "A trend line could have the best peak and valley, but if we do not break that opposing high, there is no trend line.",
   "Map out the all-time highs, and then the chain will most likely be correct.",
   "What did it remove? Nothing."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Basing, explosive move away, stay-away candle that must not touch the zone, and the space between it and the proximal line."
   },
   {
    "key": "trendline",
    "caption": "Peak, valley, then new high/lower low; start from the most recent peak and valley, not a random point."
   },
   {
    "key": "zone-removed",
    "caption": "Only wick through = not removed (extend the zone); body closes beyond, even barely = removed."
   },
   {
    "key": "sequence",
    "caption": "Chain rules: opposing zone removed, trendline removed (line must touch basing), all-time high/low."
   },
   {
    "key": "low-odds",
    "caption": "Know news release times; a news emotional wick on a day-trading chart is your fault, on a daily swing chart it is out of your control."
   }
  ],
  "checklist": [
   "Are all-time highs/lows mapped?",
   "Which of the three rules created this zone, and what did it remove?",
   "Is there basing, an explosive first candle out of the zone, a stay-away candle that does not touch the zone, and decent space?",
   "Is the zone sized reasonably compared with other zones (including adjacent basing candles)?",
   "Is the trendline from the most recent peak and valley, with a confirmed new high/low, and not weekly-sized?",
   "For a trendline-removal zone, does the trendline touch the basing candles?",
   "Was the zone pierced by only a wick (extend) or did a body close beyond (remove)?",
   "Is the zone a 50% wick candle?",
   "Is there economic news due while my day-trading order sits at the zone?",
   "Are lines snapped with the magnet tool?"
  ],
  "journalTags": [
   "trendline random start",
   "trendline too large",
   "no new high/low",
   "all-time high not mapped",
   "basing candle as move away",
   "no stay-away candle",
   "zone too small",
   "zone too big",
   "50% candle zone",
   "emotional wick misread",
   "zone removed nothing",
   "line not attached",
   "traded into news"
  ],
  "newVsPdfs": [
   "Precise emotional-wick rule: only a wick-only pierce keeps a zone; any body close beyond, however small and however big the wick, removes it.",
   "Zones kept through an emotional wick are extended, and the next opposing zone is taken from the nearest explosive move to the removed zone.",
   "Fault framework for news spikes: day-trading chart with known news = your fault; daily swing limit order = out of your control.",
   "Stay-away candle defined strictly: it cannot touch the zone; a zone drawn at proper size with a touching next candle is not a zone.",
   "Trendline-removal zones require the trendline to touch the basing candles before the explosive move.",
   "Wick-only valleys are weaker than body-formed valleys when judging borderline trendlines.",
   "Trendline start must be the most recent peak and valley; only use another point when no proper peak/valley exists.",
   "Weekly-sized trendlines stay on the weekly chart; drawing them on the daily makes you miss the chain.",
   "Mapping all-time highs/lows first is the single fix for most cascading chain misses.",
   "TradingView tip: hold Shift for perfectly horizontal (or 45-degree/vertical) lines.",
   "Include extra basing candles from the same group if it does not oversize the zone (more wiggle room)."
  ],
  "examples": [
   {
    "market": "AUD/USD (Aussie)",
    "timeframe": "Daily (Jan 1996)",
    "setup": "Demand zone from a trendline removal",
    "reasoning": "The trendline touches both basing candles before the explosive move away (rule 2). If the line did not touch the basing candle there would be no zone.",
    "outcome": "Drawn as a valid chain demand (slightly big but fine)."
   },
   {
    "market": "AUD/USD",
    "timeframe": "Daily",
    "setup": "All-time high supply",
    "reasoning": "Rule 3: an all-time high gives a zone. A long trendline here was technically correct but weekly-sized, so not drawn on the daily.",
    "outcome": "All-time high later removed by a barely-explosive demand he would not trade."
   },
   {
    "market": "AUD/USD",
    "timeframe": "Daily",
    "setup": "Borderline trendline",
    "reasoning": "Peak/valley borderline; valley formed by actual candles preferred over a wick-only valley. Readjusted when a newer peak, valley and lower low formed.",
    "outcome": "Trendline kept; its demand was very poor and got removed, leaving a supply."
   },
   {
    "market": "AUD/USD",
    "timeframe": "Daily",
    "setup": "Potential demand after supply removed opposing demand",
    "reasoning": "Drawn tight it is too small; drawn properly there is basing and explosive move but no stay-away candle (next candle touches the zone).",
    "outcome": "Not a zone."
   },
   {
    "market": "AUD/USD",
    "timeframe": "Daily",
    "setup": "Single-candle basing demand that removed an all-time high",
    "reasoning": "Clean basing, amazing move away - 10/10, take it all day every day.",
    "outcome": "Spiked through by a news-driven emotional wick (stop hit), but only the wick pierced so the zone was extended; it was respected and pushed up, then later removed by a body close. A new supply formed afterwards with a nice move."
   },
   {
    "market": "S&P 500",
    "timeframe": "4H",
    "setup": "Zone near an all-time high",
    "reasoning": "Mentioned as similar location to the 10/10 Aussie demand.",
    "outcome": "Good zone, but the Aussie example is better."
   },
   {
    "market": "Student homework",
    "timeframe": "5-minute",
    "setup": "Demand zone",
    "reasoning": "Explosive move but very small space between stay-away candle and zone.",
    "outcome": "Not really tradable; would likely not have filled if drawn properly."
   }
  ],
  "qa": [
   {
    "q": "What is an emotional candle?",
    "a": "An obvious, massive wick through a zone, usually from news or economic data. If only the wick goes through, the zone is not removed - you extend it, and it is often respected afterwards. If the body closes beyond the zone, even barely and even with a huge wick, the zone is removed. You still get stopped out by the wick."
   },
   {
    "q": "Would we still be stopped out by the emotional wick?",
    "a": "Yes, 100%. You would be stopped out, but the zone is not removed. On a daily swing chart it is out of your control; on a day-trading chart with known news coming, placing the trade is your fault - that is why the forecast lists economic data release times."
   },
   {
    "q": "Is there an all-time low here?",
    "a": "He did not think so at first, then saw it was very close and marked it with a horizontal ray."
   },
   {
    "q": "(Homework) Is a peak and valley alone enough for a trendline?",
    "a": "No. You need a peak, a valley, and then the opposing high (or low) broken. Without the new high/low there is no trendline and therefore no zone from it."
   },
   {
    "q": "(Homework) Why can't I start the trendline from this point?",
    "a": "Because it is not a valley. Trendlines go from the most recent peak and valley. He only attaches to another point when there is no proper peak/valley available."
   }
  ],
  "newDiagrams": [
   {
    "id": "emotional-wick-extend",
    "title": "Extend through an emotional wick",
    "caption": "A news spike pierces the demand with only its wick: the zone is kept and extended, and is respected afterwards. A later body close below removes it.",
    "svg": "<rect x='20' y='110' width='280' height='22' fill='#34d399' fill-opacity='0.18' stroke='#34d399' stroke-width='0.8'/><text x='24' y='106' fill='#34d399' font-size='9'>demand (10/10)</text><line x1='40' y1='112' x2='40' y2='132' stroke='#34d399'/><rect x='36' y='114' width='8' height='14' fill='#94a3b8'/><line x1='55' y1='60' x2='55' y2='118' stroke='#34d399'/><rect x='51' y='64' width='8' height='50' fill='#34d399'/><line x1='70' y1='45' x2='70' y2='70' stroke='#34d399'/><rect x='66' y='48' width='8' height='18' fill='#34d399'/><line x1='120' y1='70' x2='120' y2='168' stroke='#f87171'/><rect x='116' y='74' width='8' height='30' fill='#f87171'/><text x='128' y='164' fill='#f87171' font-size='9'>emotional wick only: keep and extend</text><line x1='150' y1='70' x2='150' y2='112' stroke='#34d399'/><rect x='146' y='74' width='8' height='30' fill='#34d399'/><line x1='170' y1='50' x2='170' y2='80' stroke='#34d399'/><rect x='166' y='54' width='8' height='20' fill='#34d399'/><text x='180' y='48' fill='#94a3b8' font-size='9'>respected, pushes up</text><line x1='250' y1='90' x2='250' y2='150' stroke='#f87171'/><rect x='246' y='94' width='8' height='44' fill='#f87171'/><circle cx='250' cy='138' r='5' fill='none' stroke='#f87171'/><text x='206' y='176' fill='#f87171' font-size='9'>body closes below: removed</text>"
   },
   {
    "id": "stay-away-touch",
    "title": "Stay-away candle must not touch the zone",
    "caption": "Left: basing, explosive move, stay-away candle clear of the zone = valid. Right: zone drawn at proper size and the next candle touches it = no stay-away candle, no zone.",
    "svg": "<rect x='20' y='120' width='120' height='18' fill='#34d399' fill-opacity='0.18' stroke='#34d399' stroke-width='0.8'/><line x1='35' y1='120' x2='35' y2='138' stroke='#94a3b8'/><rect x='31' y='123' width='8' height='12' fill='#94a3b8'/><line x1='55' y1='70' x2='55' y2='126' stroke='#34d399'/><rect x='51' y='74' width='8' height='48' fill='#34d399'/><line x1='75' y1='60' x2='75' y2='95' stroke='#34d399'/><rect x='71' y='64' width='8' height='26' fill='#34d399'/><text x='68' y='108' fill='#94a3b8' font-size='9'>space</text><text x='24' y='156' fill='#34d399' font-size='9'>valid: stays away</text><rect x='180' y='120' width='120' height='18' fill='#f87171' fill-opacity='0.12' stroke='#f87171' stroke-width='0.8' stroke-dasharray='3 2'/><line x1='195' y1='120' x2='195' y2='138' stroke='#94a3b8'/><rect x='191' y='123' width='8' height='12' fill='#94a3b8'/><line x1='215' y1='80' x2='215' y2='126' stroke='#34d399'/><rect x='211' y='84' width='8' height='38' fill='#34d399'/><line x1='235' y1='85' x2='235' y2='124' stroke='#f87171'/><rect x='231' y='88' width='8' height='20' fill='#f87171'/><circle cx='235' cy='122' r='4' fill='none' stroke='#a78bfa'/><text x='184' y='156' fill='#f87171' font-size='9'>touches zone: no stay-away</text><text x='110' y='20' fill='#a78bfa' font-size='10'>stay-away candle</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Zone must come from one of the three chain rules",
    "detail": "Opposing zone removed, trendline removed, or all-time high/low made; otherwise skip.",
    "plannerStep": "Setup"
   },
   {
    "rule": "Trendline-removal zone validity",
    "detail": "The removed trendline must touch the basing candles before the explosive move away; if it does not touch the basing candle, no zone.",
    "plannerStep": "Zone"
   },
   {
    "rule": "First candle after the proximal line must be explosive",
    "detail": "If the candle immediately after the zone is a basing (or larger basing) candle, reject or redraw the zone.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Require a stay-away candle that does not touch the zone",
    "detail": "Candle after the explosive move must not overlap the zone range; if it touches, no zone.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Require space between stay-away candle and proximal line",
    "detail": "Very small space = drawable but not tradable; no number given (discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject 50% candles as zone candles",
    "detail": "A candle with a massive wick (about 50% wick) is not drawn as a zone; use a 50% candle indicator.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Zone sizing",
    "detail": "Include adjacent basing candles of the same group unless it makes the zone much larger than other zones on the chart (discretionary).",
    "plannerStep": "Zone"
   },
   {
    "rule": "Valid trendline needs peak, valley and a new extreme",
    "detail": "Peak, valley, then lower low (downtrend) or higher high (uptrend) that breaks the opposing extreme; two anchor points from the most recent peak and valley.",
    "plannerStep": "Context"
   },
   {
    "rule": "Readjust trendline on newer swing",
    "detail": "When a newer peak, valley and new extreme form, redraw from those.",
    "plannerStep": "Context"
   },
   {
    "rule": "Skip oversized trendlines on the current timeframe",
    "detail": "If the trendline spans a structure belonging to the next higher timeframe (e.g. weekly-sized on daily), do not use it (discretionary).",
    "plannerStep": "Context"
   },
   {
    "rule": "Prefer body-formed valleys",
    "detail": "On borderline cases, a valley formed by candle bodies outweighs one formed only by a wick.",
    "plannerStep": "Context"
   },
   {
    "rule": "Zone removal vs emotional wick",
    "detail": "If only the wick pierces beyond the distal line, keep and extend the zone (stop still hit). If the body closes beyond the distal line by any amount, mark removed.",
    "plannerStep": "Zone"
   },
   {
    "rule": "Map all-time highs and lows",
    "detail": "Compute ATH/ATL before running the chain; an ATH gives a zone.",
    "plannerStep": "Setup"
   },
   {
    "rule": "News filter for day trading",
    "detail": "On intraday charts, do not leave limit orders at zones through scheduled high-impact data (e.g. US inflation); on daily swing orders, no filter required.",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Quality rating",
    "detail": "Top grade (10/10): single-candle clean basing, amazing move away, removed an all-time high. Barely explosive move away = not tradable (discretionary).",
    "plannerStep": "Verdict"
   }
  ]
 },
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
  "n": 9,
  "title": "Chain analysis: don't force zones, all-time lows, and updating/ending trendlines",
  "kind": "zoom",
  "date": "2026-09-20",
  "summary": "Kevin walks through a quiet week of the chain analysis on the daily chart. Most of the new price was at all-time lows (rule 3), but only three zones qualified because almost everything in between was small basing candles, not explosive moves away. The main lessons were patience (don't force zones), drawing zones that include all the basing candles, and keeping trendlines strict: an obvious peak and valley followed by a lower low or higher high, ended when an updated line appears or when it gets overextended. He then marks the students' homework. The most common mistakes were trendlines with no lower low, missed updated trendlines, forced zones and badly drawn zones. He also answers a question on removals across timeframes: removal only counts on the exact same timeframe.",
  "sections": [
   {
    "heading": "Opening: purpose of the Sunday session and psychology",
    "points": [
     "Sunday sessions are where they dive into the 'meat' of the system: the rules, trendlines, what a zone is. Video lessons, daily breakdowns and forecasts sit alongside them.",
     "The chain analysis moves one year at a time. Some weeks are great for lessons and some are not; this one is a weak week, and that is just how it is.",
     "Reminder for new members: only draw zones that qualify under one of the three rules (remove a zone, remove a trendline, or make an all-time high/low). One rule is enough, not all three.",
     "This week is mostly rule 3. Once price trades at these levels, everything is an all-time low.",
     "Clear the old zones off the chart as you go.",
     "The last zone carried over was a very poor-quality supply. It is drawable, not tradable. He would not take it, even though it worked out fantastically, and he refuses to claim afterwards that he would have.",
     "'The best zones can fail, and the worst zones could work.' He passes on good trades and takes bad ones, which is why trading psychology matters so much.",
     "You can have the best strategy in the world, with a good win rate or good overall risk-reward, and still fail without the psychology. Everyone struggles with it, him included. He recommends his podcast episodes for this."
    ]
   },
   {
    "heading": "Zone 1: supply that removed demand plus an all-time low",
    "points": [
     "Rule 1 reminder: an opposing zone being removed only sometimes gives a zone. A zone, trendline or all-time low being removed does not guarantee one.",
     "Here a demand zone was removed AND an all-time low was made, a 'double whammy'. He immediately spotted the supply above.",
     "He ended the removed zone's line short of the exact removal point to keep the chart clean, because a new zone was being drawn there. Normally you end it right where it was removed.",
     "He rated this supply as decent: nice basing and a good move away. It was a little better than the old poor supply, which price came straight back to. With this one, price stayed away for a while."
    ]
   },
   {
    "heading": "Zone 2: demand that removed two supplies, and how to draw it",
    "points": [
     "Anyone in the group for a month should see it: a great explosive move away with two basing candles. It removed two opposing supply zones.",
     "Because the two basing candles are close together, and using both doesn't make the zone massive or tiny, use BOTH. Don't draw the zone off only one candle.",
     "Distal: go all the way to the bottom wick, using the magnet tool. Proximal: put it right up against where the explosive move away started.",
     "The zone later failed, most likely because it was against the downtrend you see when you zoom out. Trends and trendlines are vital. Spotting supply and demand zones alone is not enough.",
     "The push up after it was momentum, not a trendline. A trendline needs very obvious peaks and valleys, not 'little boo-boo' peaks and valleys."
    ]
   },
   {
    "heading": "Downtrend lines: updating, ending and overextension",
    "points": [
     "After a low was removed, an obvious peak and valley appeared, followed by a lower low. You need that lower low after the peak and valley. That gave a valid downtrend line.",
     "Don't keep extending one trendline forever, especially once a new peak and valley forms. Here the next one was 'pretty much a peak and valley', so the line was updated to go from the new point.",
     "Homework expectation: both trendlines on the chart, the original ended and the updated one drawn.",
     "Extended, the line got hugely overextended as price was pushed down. It is fine to have it in real trading. Once it is that overextended, end it by marking that it got too extended.",
     "Two reasons a trendline ends here: (1) an updated trendline replaces it, which makes the old one invalid; (2) it got too overextended."
    ]
   },
   {
    "heading": "Big basing candles vs explosive moves: don't force zones",
    "points": [
     "Above the demand there was no supply at all, just small basing candles.",
     "The confusing part: a candle that is bigger than the tiny ones around it is still a basing candle, just a bigger one. Compared with its neighbours it looks explosive, but it isn't the kind of explosive move he means.",
     "He doesn't usually measure anything. Judging an explosive move is a feel you build over time by taking part in these meetings.",
     "Many all-time lows were made in this stretch and none of them showed demand or supply. Main lesson: be patient and don't just draw any zone.",
     "One nice explosive candle removed nothing (rules 1-3), so it is not a zone. Ask what it removed.",
     "A small drop-base-drop looked like a zone but wasn't, because the move-away candle wasn't good enough. Without the wick, as a full red body, it probably would have been a zone."
    ]
   },
   {
    "heading": "Momentum vs trendline; not cutting through candles",
    "points": [
     "Valley, peak and lower low: a trendline. Small steps with no obvious valleys: momentum. Compare the two.",
     "Draw from the most recent peak to the new peak.",
     "Don't anchor from the highest older peak if the line would cut through candles. A trendline must not cut through candles. There are extreme exceptions, but he won't cover them yet.",
     "An uptrend line was also needed: peak, valley, higher high. Then another peak, valley and higher high appeared, so it had to be updated.",
     "The straight update would have cut through candles, so he adjusted the anchor. His line can therefore start where there is no peak or valley, because the real peak and valley is elsewhere and the line was moved to avoid candles.",
     "The older line ended, and he wants it ended on your charts.",
     "He marked an all-time low early so it is ready for a later homework."
    ]
   },
   {
    "heading": "Zone 3: demand from a removed trendline, and old zones",
    "points": [
     "Rule 2: a trendline was removed, giving an extremely obvious demand zone.",
     "Unfortunately the zone got very old. When price finally returned it got at most a tiny reaction and then failed. That is the issue with older zones.",
     "Ideally you wait for a pullback into a zone like this, but there wasn't one. You won't always get a pullback entry; accepting that is part of trading psychology.",
     "Another example: a peak and valley that is only momentum compared with real trendline structure.",
     "Week recap: only three zones. The test was not forcing poor-quality zones and keeping trendlines updated and correct."
    ]
   },
   {
    "heading": "Homework types differ by week",
    "points": [
     "Some weeks test whether you can identify every one of many zones, which is tricky.",
     "Some weeks are heavily about trendlines.",
     "Some weeks, like this one, are about not forcing zones. Each week depends on how the charts played out.",
     "He doesn't only grade the zones you draw. He also checks that you didn't force any zones."
    ]
   },
   {
    "heading": "Homework review: trendline errors",
    "points": [
     "A student got all three zones but missed an updated trendline that needed to end the old one.",
     "A borderline trendline idea: it was only a wick. If those candles had been bodies he would agree, but because it's just a wick he doesn't really see a trendline. He gave grace because it was close and 'too wicky'.",
     "The repeated error: a trendline with NO lower low after the peak. That is not a trendline. If price had then broken that low, it would have been correct.",
     "Several students got the demand right but for a bad reason: they said it removed an invalid trendline. He still grades the rest of your chain as if your trendline were right.",
     "Another student drew a peak and valley with no higher high. Remember: peak, valley, higher high.",
     "Trendline recipe as he repeated it: starting point, peak, a valley deep enough to be extremely obvious, then a break of the high where your peak is (higher high). Downtrend: starting point, valley, peak, lower low. No lower low means no trendline.",
     "He suspects people are overcomplicating trendlines and considers them easier than identifying zones. The rules are in the Discord learning material.",
     "Nobody, or maybe one person, got both of the tricky trendlines."
    ]
   },
   {
    "heading": "Homework review: zone drawing and forced zones",
    "points": [
     "Forced zone: a move away the same size as the surrounding basing candles. If you draw that zone you would also have to draw others like it, which shows it isn't a zone.",
     "Attach trendlines properly. Not perfectly attached is tolerable when doing quick after-the-fact analysis, but live it must actually be attached.",
     "Zones not attached to the highest wick: you must go up to the proximal line properly.",
     "Don't cut through the wick when drawing a zone. Include the wick.",
     "Big tip: if you draw your zone and the next candle is a basing candle, it is not a zone. The zone belongs where the explosive move away actually starts.",
     "Include all the basing candles when they are close together. If a wick reached far down he would draw it differently. A frequent error was zones that were too tiny because they ignored one of the basing candles.",
     "Only tighten the zone if the basing gets crazy.",
     "Your distal line must have a reason, such as the lowest wick of the basing. A distal placed at a random point makes no sense.",
     "When drawing an all-time low, use the actual all-time low.",
     "Removal check: one student drew two zones that each removed one. Zoomed in, the earlier zone was fully respected by the basing, so only one zone counted. It would only remove it if part of the basing wicked above it.",
     "A zone that is way too big compared with the others: if it had removed supply, he would still draw it big and accept that it's massive. That can happen sometimes."
    ]
   },
   {
    "heading": "Homework logistics and using his resources",
    "points": [
     "Homework must be on the DAILY chart. Submissions on the wrong timeframe (one on 1H) could not be marked.",
     "Send real screenshots (get a screenshot app), not sideways photos taken on another device.",
     "Members in the chat ask about zones that his daily breakdown and chart link already answer. Watch the breakdowns: that is why he makes them. Asking why something is not a zone is fair.",
     "You may have your own rule (e.g. drawing an amazing move away that removed nothing), but his chart link shows what qualifies under his rules. A borderline example a member raised was not on his chart.",
     "He is hard on students who did well before because he cares. If he didn't, he would just say try again next week.",
     "He recommends watching previous meetings for trendlines; they cover it better than a short video, though he may make one."
    ]
   },
   {
    "heading": "Trendline subjectivity and next homework",
    "points": [
     "Next homework: January 1999 to January 2000. The chart starts clean with no zones needing removal, and it is mostly about trendlines.",
     "No pip-measurement rule for trendlines (e.g. 'if the depth is 168 pips it's a trendline'). Pip values differ between pairs, so it's visual.",
     "That is why he gives grace on borderline cases: 'We are not robots, we are humans.'",
     "Classic rule: the trendline must be as obvious as possible, super obvious peak-valley, peak-valley.",
     "Don't draw one massive trendline that ignores the smaller valid trendlines in between.",
     "Grace is given on subjective wick-or-valley calls, but NOT on trendlines that break the basic rule (no lower low), unless it's your very first time.",
     "Market note: the dollar looks strong. The current hiccup is most likely the start of a pullback after a long strong run."
    ]
   },
   {
    "heading": "Q&A: removals across timeframes",
    "points": [
     "A student asked if an opposite zone can be removed by a zone on a different timeframe. No. Everything happens on the exact same timeframe.",
     "A one-minute zone will not remove a monthly zone. Zone removal and trendline removal are judged on the same chart and timeframe. If you trade the 5-minute, look for removals only on the 5-minute."
    ]
   }
  ],
  "rules": [
   "Draw a zone only if it removes an opposing zone, removes a trendline, or makes an all-time high/low. One is enough.",
   "Don't force zones. If nothing in a stretch shows an explosive move away, draw nothing.",
   "Don't call a bigger-than-usual basing candle an explosive move away. Judge it against real explosive moves.",
   "An explosive candle that removed nothing is not a zone.",
   "When the basing candles are close, include all of them in the zone. Only tighten it if the basing gets crazy.",
   "Put the distal at the bottom wick of the basing for demand (top wick for supply), using the magnet tool. Put the proximal right against where the explosive move away starts.",
   "Include the wick. Don't cut through it when drawing a zone.",
   "If the candle after your drawn zone is a basing candle, it is not a zone. Move the zone to where the explosive move away begins.",
   "A downtrend line needs a starting point, an obvious valley, a peak, then a lower low. An uptrend line needs an obvious peak, valley, then a higher high.",
   "Use only very obvious peaks and valleys. Small ones are momentum.",
   "A trendline must not cut through candles. Adjust the anchor point if needed.",
   "When a newer peak and valley forms, draw the updated trendline and end the old one, which is now invalid.",
   "End a trendline that has become overextended.",
   "Don't draw one massive trendline that skips the valid trendlines in between.",
   "Judge zone and trendline removals only on the same timeframe.",
   "Use the actual all-time low/high when marking it.",
   "End a removed zone at the point it was removed (shorten it only for chart cleanliness).",
   "Submit homework on the daily chart, as a proper screenshot.",
   "Watch the daily breakdowns and check his chart link before asking whether something is a zone."
  ],
  "mistakes": [
   "Trading drawable-only, poor-quality zones, or claiming afterwards you'd have taken one that worked.",
   "Forcing zones from larger-than-normal basing candles.",
   "Drawing a zone off an explosive candle that removed nothing.",
   "Drawing a trendline with no lower low (or no higher high) after the peak and valley.",
   "Using wick-only peaks or valleys as trendline structure ('too wicky').",
   "Calling momentum a trendline.",
   "Missing the updated trendline and not ending the old one.",
   "Extending a trendline forever even when it is overextended.",
   "Drawing a trendline that cuts through candles.",
   "Drawing a zone off only one basing candle, so it's too tiny.",
   "Cutting through the wick, or not attaching the zone to the highest/lowest wick.",
   "Placing the distal line at an arbitrary point.",
   "Drawing a zone where the next candle is still basing.",
   "Assuming a zone removed another when the basing actually respected it (zoom in).",
   "Marking an all-time low that isn't the real all-time low.",
   "Getting a zone right for the wrong reason (removal of an invalid trendline).",
   "Trading zones against the larger trend.",
   "Waiting on very old zones and expecting them to hold.",
   "Submitting homework on the wrong timeframe (e.g. 1H) or as sideways photos.",
   "Not watching the daily breakdowns or checking the chart link.",
   "Measuring trendline depth in pips instead of judging visually.",
   "Drawing one massive trendline that ignores the ones in between."
  ],
  "quotes": [
   "The best zones can fail, and the worst zones could work.",
   "There's trades where they're great, and I don't take them. There's trades that are bad, and I take.",
   "You think you can just spot supply and demand zones and trade that, you are certainly mistaken.",
   "We're not just gonna force a zone.",
   "If you draw your zone, and the next candle is a basin candle, that is not a zone.",
   "Peak, valley, higher high.",
   "We are not robots, we are humans.",
   "If I didn't care, I wouldn't be hard on you.",
   "A one-minute zone will not remove a monthly zone."
  ],
  "diagrams": [
   {
    "key": "qualify",
    "caption": "This week was mostly rule 3 (all-time lows), and many of them produced no zone. Making an all-time low doesn't guarantee a zone."
   },
   {
    "key": "draw",
    "caption": "Demand off two close basing candles: distal at the bottom wick, proximal against the start of the explosive move. Include both candles."
   },
   {
    "key": "trendline",
    "caption": "Peak, valley, then lower low (downtrend) or higher high (uptrend). No break of the low or high means no trendline."
   },
   {
    "key": "trend-momentum",
    "caption": "Small 'boo-boo' peaks and valleys = momentum. Only very obvious peaks and valleys make a trendline."
   },
   {
    "key": "quality",
    "caption": "Drawable vs tradable: the poor carried-over supply worked, but he still wouldn't take it."
   }
  ],
  "checklist": [
   "Did this zone remove an opposing zone, remove a trendline, or make a real all-time high/low?",
   "Is the move away truly explosive compared with real explosive moves, and not just a larger basing candle?",
   "Is the next candle after my zone a move-away candle, not another basing candle?",
   "Have I included all the close basing candles, with the distal at the extreme wick and the proximal against the move away?",
   "Does my trendline have an obvious peak and valley AND a higher high or lower low?",
   "Does the trendline avoid cutting through candles?",
   "Is there a newer peak and valley that means I should update the line and end the old one?",
   "Has the trendline become overextended and needs ending?",
   "Am I judging every removal on the same timeframe?",
   "Is the zone against the larger trend, or very old?",
   "Have I checked the daily breakdown or chart link for this zone?"
  ],
  "journalTags": [
   "zone not qualified",
   "forced zone",
   "basing mistaken for move away",
   "no lower low trendline",
   "no higher high trendline",
   "momentum not trendline",
   "trendline not updated",
   "overextended trendline",
   "trendline cuts candles",
   "zone missing basing candle",
   "wick cut off",
   "random distal",
   "against trend",
   "old zone",
   "wrong timeframe removal",
   "drawable not tradable"
  ],
  "newVsPdfs": [
   "Quick zone test: if the candle right after your drawn zone is a basing candle, it is not a zone. Relocate it to where the explosive move begins.",
   "A larger-than-normal basing candle is still a basing candle. 'Explosive' is judged against real explosive moves, by feel, not measurement.",
   "Explicit two reasons to end a trendline: an updated trendline (makes the old one invalid) or overextension. Both should be shown on the homework.",
   "An adjusted trendline anchor can sit where there's no peak or valley, because it was moved to avoid cutting candles.",
   "Wick-only peaks or valleys are 'too wicky' for trendline structure. As bodies they'd count, and borderline wick cases get grace.",
   "No pip-depth rule for trendlines because pip values differ between pairs. Don't draw a massive trendline that skips the ones in between.",
   "Grading policy: the chain is graded as if your (wrong) trendline were right, so you can get a zone right for a wrong reason. Grace on subjective calls, none on the missing lower low/higher high.",
   "Removal check by zooming in: a zone only removes an earlier one if the basing actually wicked past it.",
   "Removals (zone or trendline) only count on the exact same timeframe. A 1-minute zone never removes a monthly zone.",
   "An oversized zone that qualifies is still drawn big and accepted as massive.",
   "Homework logistics: daily chart only, proper screenshots, use the daily breakdowns and chart link.",
   "Homework weeks vary in focus (many zones / trendlines / not forcing zones). This week was 'don't force zones'."
  ],
  "examples": [
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Carried-over very poor-quality supply",
    "reasoning": "Drawable, not tradable: poor quality.",
    "outcome": "Worked out fantastically, but he would still not take it. The best zones can fail and the worst can work."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Supply that removed a demand zone and made an all-time low (rules 1 and 3)",
    "reasoning": "Nice basing, good move away, price stayed away for a while. Better than the prior poor supply, which price came straight back to.",
    "outcome": "Drawn as a valid zone; it removed the demand and made an all-time low."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Demand off two basing candles with a great explosive move away, removing two supplies",
    "reasoning": "Use both close basing candles: distal at the bottom wick (magnet tool), proximal against the start of the move away.",
    "outcome": "Failed, most likely because it was against the larger downtrend."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Downtrend line: peak, valley, lower low; then updated to a newer peak/valley",
    "reasoning": "An updated line invalidates the old one. The extended line became overextended, so it was ended.",
    "outcome": "Both lines expected on homework; old one ended."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Larger basing candles and a drop-base-drop among many all-time lows",
    "reasoning": "Bigger-than-normal basing candles aren't explosive moves. One explosive candle removed nothing. The DBD's move-away candle had a wick and wasn't a full red body.",
    "outcome": "No zones drawn: don't force zones."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Uptrend line: peak, valley, higher high, then updated after another higher high",
    "reasoning": "The straight update would have cut through candles, so the anchor was adjusted.",
    "outcome": "Old line ended; updated line drawn from an adjusted point."
   },
   {
    "market": "Not named (homework chart)",
    "timeframe": "Daily",
    "setup": "Demand that removed a trendline (rule 2)",
    "reasoning": "Extremely obvious demand, but it became very old with no pullback entry.",
    "outcome": "At most a tiny reaction when finally retested, then failed. That is the issue with old zones."
   }
  ],
  "qa": [
   {
    "q": "Can an opposite zone be removed by a zone on a different timeframe?",
    "a": "No. Everything is on the exact same timeframe. A one-minute zone will not remove a monthly zone, technically speaking or not, because they don't switch timeframes. Zone removed, trendline removed, it's all on the same chart and timeframe. If you trade the 5-minute chart and look for removed zones, look only on the 5-minute."
   },
   {
    "q": "(A student asked for a dedicated lesson on trendlines.)",
    "a": "He can, but recommends watching previous meetings, where trendlines come up all the time; that's better than a little video lesson. It's simple: you need a good enough peak and valley, and you attach it like that. There are some more details, but he thinks trendlines are easier than identifying a zone."
   },
   {
    "q": "(A student whose homework slipped asked how to get back on track.)",
    "a": "Do what you did last week. He's hard on you because he cares."
   }
  ],
  "newDiagrams": [
   {
    "id": "next-candle-basing",
    "title": "Next candle is basing = not a zone",
    "caption": "Draw the zone at the last basing before the explosive candle. If the candle after your zone is still a basing candle, the zone is in the wrong place.",
    "svg": "<rect x='30' y='70' width='10' height='14' fill='#94a3b8'/><line x1='35' y1='64' x2='35' y2='90' stroke='#94a3b8'/><rect x='50' y='68' width='10' height='16' fill='#94a3b8'/><line x1='55' y1='62' x2='55' y2='90' stroke='#94a3b8'/><rect x='70' y='72' width='10' height='12' fill='#94a3b8'/><line x1='75' y1='66' x2='75' y2='88' stroke='#94a3b8'/><rect x='90' y='70' width='10' height='14' fill='#94a3b8'/><line x1='95' y1='64' x2='95' y2='90' stroke='#94a3b8'/><rect x='110' y='92' width='10' height='70' fill='#f87171'/><line x1='115' y1='88' x2='115' y2='166' stroke='#f87171'/><rect x='26' y='60' width='38' height='30' fill='#f87171' fill-opacity='0.15' stroke='#f87171' stroke-dasharray='3 2'/><text x='20' y='52' font-size='9' fill='#f87171'>wrong: next candle is basing</text><rect x='176' y='70' width='10' height='14' fill='#94a3b8'/><line x1='181' y1='64' x2='181' y2='90' stroke='#94a3b8'/><rect x='196' y='68' width='10' height='16' fill='#94a3b8'/><line x1='201' y1='62' x2='201' y2='90' stroke='#94a3b8'/><rect x='216' y='88' width='10' height='72' fill='#f87171'/><line x1='221' y1='84' x2='221' y2='164' stroke='#f87171'/><rect x='172' y='60' width='40' height='30' fill='#34d399' fill-opacity='0.12' stroke='#34d399'/><text x='172' y='52' font-size='9' fill='#34d399'>right: zone at basing before explosive move</text><text x='20' y='176' font-size='9' fill='#94a3b8'>explosive red candle = move away</text>"
   },
   {
    "id": "trendline-ended",
    "title": "Ending a trendline: updated or overextended",
    "caption": "Line A ends when the updated line B forms from a newer peak/valley. A line that price leaves far behind is ended as overextended, not extended forever.",
    "svg": "<polyline points='20,30 50,90 75,55 105,120 130,95 160,150 190,130 230,170' fill='none' stroke='#94a3b8' stroke-width='1.5'/><line x1='20' y1='30' x2='140' y2='86' stroke='#a78bfa' stroke-width='1.5'/><line x1='140' y1='86' x2='300' y2='160' stroke='#a78bfa' stroke-dasharray='3 3' stroke-opacity='0.5'/><text x='70' y='40' font-size='9' fill='#a78bfa'>A (ended)</text><line x1='75' y1='55' x2='260' y2='145' stroke='#f87171' stroke-width='1.5'/><text x='200' y='118' font-size='9' fill='#f87171'>B (updated)</text><circle cx='75' cy='55' r='3' fill='#f87171'/><text x='80' y='50' font-size='9' fill='#94a3b8'>new peak</text><text x='150' y='166' font-size='9' fill='#94a3b8'>lower low</text><text x='20' y='176' font-size='9' fill='#94a3b8'>valley, peak, lower low = downtrend line</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Qualify a zone only if it removed an opposing zone, removed a trendline, or made an all-time high/low",
    "detail": "any one of the three is enough; a qualifying event does not guarantee a zone",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject zone if the candle immediately after the drawn basing is itself a basing candle",
    "detail": "the zone must sit directly before the explosive move-away candle",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject move-away candles that are only larger basing candles",
    "detail": "discretionary: compared with real explosive moves, judged by feel, not measured",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject move-away candle with a significant wick instead of a full body",
    "detail": "discretionary (DBD example: would be a zone if the candle were a full red body without the wick)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Include all adjacent basing candles in the zone when they are close in size",
    "detail": "distal = extreme wick of the basing (magnet); proximal = edge where the explosive move starts; tighten only if the basing is extreme",
    "plannerStep": "Zone"
   },
   {
    "rule": "Count a removal of an earlier zone only if the new zone's basing went past it",
    "detail": "zoom in; if the basing fully respected the earlier zone, it was not removed",
    "plannerStep": "Zone"
   },
   {
    "rule": "Evaluate zone/trendline removals only on the same timeframe as the zone",
    "detail": "e.g. 5m trading -> removals checked only on 5m; a 1m zone never removes a monthly zone",
    "plannerStep": "Context"
   },
   {
    "rule": "Downtrend line valid only after starting point, obvious valley, peak, then a break below the valley (lower low)",
    "detail": "uptrend mirror: peak, valley, then break above the peak (higher high); no break = no trendline",
    "plannerStep": "Context"
   },
   {
    "rule": "Reject trendline structure built on wick-only peaks/valleys or small swings",
    "detail": "discretionary; no pip threshold because pip values differ between pairs",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline must not cut through any candle; shift the anchor to avoid it",
    "detail": "rare extreme exceptions not specified",
    "plannerStep": "Context"
   },
   {
    "rule": "When a newer peak/valley + higher high/lower low forms, replace the trendline and mark the old one invalid",
    "detail": "don't skip valid intermediate trendlines with one massive line",
    "plannerStep": "Context"
   },
   {
    "rule": "End a trendline once price is far overextended from it",
    "detail": "discretionary",
    "plannerStep": "Context"
   },
   {
    "rule": "Flag zones against the larger trend and very old zones as lower odds",
    "detail": "discretionary: failed demand against the downtrend; old trendline-removal demand only got a tiny reaction",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Skip drawable-only, poor-quality zones even if they might work",
    "detail": "discretionary: poor basing/move away, quick return",
    "plannerStep": "Verdict"
   }
  ]
 },
 {
  "n": 10,
  "title": "Chain-analysis homework review: higher-high trendlines, borderline zones, emotional wicks and the channel tool",
  "kind": "zoom",
  "date": "2026-09-27",
  "summary": "Kevin opened with the learning path (free S&D course, then private video lessons, then Sunday sessions) and walked through this week's daily chain-analysis homework, where the only zones drawn are ones that remove an opposing zone, remove a trendline, or make an all-time high/low. He hammered the trendline anatomy (peak, valley, then a higher high / lower low), drawing from the lowest/highest point possible without cutting candles, avoiding overly large trendlines when smaller ones exist in between, and 'ending' a trendline once price overextends. He measured borderline moves away in pips to separate drawable from tradable zones, then marked every student's chart, correcting momentum mistaken for trendlines, zones that accomplished nothing, zones drawn too small, and normal wicks mistaken for emotional wicks. He then explained the parallel channel tool (50% line = golden zone vs overextended zone and how it affects trade management and counter-trend odds) and answered questions on watchlists, day-trading timeframes, trading after losses, win rate vs R:R, and how to get market direction (higher timeframe plus one).",
  "sections": [
   {
    "heading": "Opening: learning path and attendance",
    "points": [
     "Attendance has dropped (maybe school is back); sessions are recorded, but he deletes ones older than about 2 months because of storage limits, so the last ~5 are available.",
     "Recommended path for new traders: (1) watch the full free S&D course on YouTube, (2) watch the private video lessons, (3) watch and participate in the Sunday sessions, and watch old ones too.",
     "If you already understand what a zone is (and that 'little basing candles' are not the zones we want) you can skip the free course, but he still recommends it.",
     "The Sunday sessions are the most important factor, but you cannot really understand them without the full course and the private lessons first."
    ]
   },
   {
    "heading": "Homework walkthrough part 1: trendline anatomy and large trendlines",
    "points": [
     "Task: mark all zones that remove opposing zones, trendlines (and all-time highs/lows) on the daily homework chart, continuing from last week's demand and upward trendline.",
     "He saw a large trendline but did not draw it because a smaller trendline exists in between; draw larger trendlines only if there are no trendlines in between, which is often not the case.",
     "A trendline needs a blatantly obvious peak and valley followed by a higher high (uptrend). If price fails to break the high, there is no trendline.",
     "Upward trendline: draw from the lowest point possible to the next lowest point in the valley. If a wick would be cut through, attach the line to a different point instead; we never cut through candles.",
     "Example of what is NOT a trendline: a valley and peak with no lower low after it (some students drew this last week). Remove the missing lower low and you would have the trendline.",
     "Only one trendline at a time is really kept; drawing too many/too large ones makes you miss the relevant one."
    ]
   },
   {
    "heading": "Homework walkthrough part 2: basing candles, measuring borderline moves away",
    "points": [
     "He pointed out an obvious small basing candle, then bigger basing candles, then a candle that is neither a basing candle nor a good enough explosive move away; that is not what we want.",
     "What we want is a very clear explosive move away; zones like that are 'never a question'.",
     "For a close supply call (a student asked) he measured: the reference move was 112 pips and he looked for at least 112 pips on the candidate; it qualified, so he drew it, but called it 'not a great zone' - drawable, not tradable.",
     "On his real trading charts, if a zone is that close and needs measuring, he usually just does not draw it; he only measures for the homework's sake.",
     "Chart zoom changes perception: zoomed out, only extremely obvious moves look explosive; zoomed in, zones look beautiful everywhere. It is nuanced and somewhat subjective.",
     "Key distinction: for a tricky zone the question is 'is it drawable?'; for an obvious zone the question is 'is it tradable?'. Tricky-to-draw zones are never really tradable - if you do not know if it is a good move away, avoid it.",
     "Nothing wrong with measuring and comparing to your older zones when it is questionable.",
     "Second borderline supply after a supply was removed: body measured 82, from bottom of body to wick top 102; the wick at the top made him nervous. Comparison measures were 108 and 115. He drew it but felt he was 'forcing zones'; definitely not a trade he would take, and price blasted right through it."
    ]
   },
   {
    "heading": "Homework walkthrough part 3: overextended trendlines, removal, drawing the zone",
    "points": [
     "New uptrend trendline with obvious peak, valley and higher high, but price became very overextended above it, making the trendline essentially irrelevant.",
     "He wants students to have that trendline but end it around that point (no specific point) - not extend it, because extending it says it is still relevant. If price had stayed around the trendline it would stay relevant.",
     "Extending the overextended trendline would also make you miss the next trendline.",
     "He started a trendline from the actual low, but it would have cut through candles, so he started it at another point; that is why his trendline start points sometimes look random but are not.",
     "A trendline is not removed until a candle has a full close, body AND wick, below an upward trendline (or above a downward trendline). The explosive move candles that still touched the line did not remove it.",
     "When drawing the resulting demand zone, include all of the basing candles.",
     "Would he take that trade? Probably yes: pretty good zone, not his favourite, better than the earlier two borderline zones; what he really wants is the zone with a very nice move away. It produced a nice trade."
    ]
   },
   {
    "heading": "Homework walkthrough part 4: downtrend lines and the end of the chart",
    "points": [
     "Downtrend line: blatant peak, valley and lower low; draw from the highest point possible to the peak.",
     "That trendline was removed not by the first candle poking through but by the candle that fully closed above it, full body and wick.",
     "Rule 2 (trendline removed) gives a zone 'not always': if everything is just basing candles with no qualifying move, there is no zone and the analysis just ends.",
     "Out of the borderline zones, if you traded all of them: loss, loss, winner, and you could be in profit depending on target - but he personally would only have traded the one good zone.",
     "A later candidate had a decent move away candle, but when drawn similar in size to the other zones there was no stay-away candle, so no zone.",
     "A final borderline peak/valley trendline: he would not draw it but gives grace if students did.",
     "He admitted he completely forgot to draw an obvious zone that a student found - 'just one that I simply forgot to draw'."
    ]
   },
   {
    "heading": "Purpose of chain analysis and next week's homework",
    "points": [
     "Chain analysis: only draw zones that (1) remove an opposing zone, (2) remove a trendline, or (3) make an all-time high or low. If you draw a zone that removed nothing, ask: what did it remove? Nothing.",
     "Zones are kept on the chart to see what removes them, so every zone shows its work: this demand removed this trendline, this supply removed this demand, etc. This is what he does on his chart link.",
     "Next week's homework: from January 2000 to January 2001 (at the very end he said '1999 to 2000', likely a slip). You must have the existing zone and the all-time low on your chart because of rule 3.",
     "He expects next week's chart to have few zones.",
     "New members overwhelmed by needing previous zones: put a vertical line at the start and end dates, copy his zones from his chart link in Discord, add the all-time low, then draw all trendlines. You will struggle at first and that is fine."
    ]
   },
   {
    "heading": "Student homework reviews: recurring corrections",
    "points": [
     "Zones should usually be drawn a bit larger, including all the basing candles when they are close together.",
     "Pick the more blatant peak and valley when two candidates are close.",
     "Trendlines with a wrong start point can create a zone that should not exist; start from the correct lowest/highest point.",
     "A student on the 1-minute chart: homework must be on the daily chart.",
     "Wicks: a supply with a big wick is worse, especially when a better supply exists above - choose the better one.",
     "Too-small moves away, forced zones: delete them.",
     "'Too horizontal to be a trendline.'",
     "A student kept drawing random zones that followed none of the 3 rules and mapping every single high and low; 'we do not map out every single high and low'. He will be hard on repeat mistakes to hold students accountable, but first-timers get leniency.",
     "A zone should be removed when price peaks above it (supply) - one student did not remove it.",
     "Momentum is not a trendline: a move up with tiny peaks and valleys is just momentum; the peak and valley we look for are the obvious swings.",
     "Distal line: do not randomly end the zone; include the wick (end the distal at the wick).",
     "Homework must be submitted as a chart link (so he can zoom in), not a screenshot; screenshots are only for the video-lesson homework. Watch the welcome video on how to submit.",
     "Very thick distal/proximal lines make charts hard to mark; messy dots/indicators should be removed.",
     "Liked when students 'ended' overextended trendlines - shows they recognise it got overextended.",
     "If one candidate barely qualifies, a smaller one next to it certainly does not.",
     "The higher high concept is 'very, very simple': the peak and valley can look identical, but you need the higher high.",
     "Big-mistake student summary: trendlines too large, wrong start points, zones that accomplished nothing, moves away not good enough - needs a complete reset."
    ]
   },
   {
    "heading": "Emotional wick vs normal wick; drawing zones too small",
    "points": [
     "A student kept a zone alive because of what they thought was an emotional wick. It was just a normal-sized wick: larger than nearby wicks but the overall candle and wick were normal, so it is a normal break and the zone is removed.",
     "An emotional wick would be a much larger, exaggerated wick (he sketched it); then it would be a different story.",
     "Drawing a zone too small makes the move away look good enough; drawn at proper size, the move away becomes much worse. Do not shrink zones to justify the stay-away candle.",
     "When you draw zones super tiny, a lot of zones become zones that aren't."
    ]
   },
   {
    "heading": "Channel tool (parallel channel on a trendline)",
    "points": [
     "First draw the trendline normally; the channel tool is not used to draw the trendline.",
     "Place the channel on the trendline, then drag the opposite side to the valley after the peak (downtrend) - roughly, it does not have to be perfect.",
     "Downward trendline: anything below the 50% mark of the channel is overextended - you can still trade there but he does not love it. Between the downward trendline and the 50% mark is the optimal area to trade.",
     "Upward trendline example (S&P 500): between the trendline and the 50% line is the 'golden area'; once price breaks above the 50% mark it is the 'danger zone' - price can still go up, but it is less likely.",
     "Trading in the golden area: less aggressive trade management. Trading in the overextended area: allowed, but be more aggressive with trade management.",
     "Counter-trend: an entry-timeframe supply zone in the overextended area (especially way above the channel) is more likely to work than an entry-timeframe supply inside the golden area where we want longs."
    ]
   },
   {
    "heading": "Q&A: watchlists and pairs",
    "points": [
     "No pairs strictly to avoid, but cross pairs are generally junk and whippy, especially yen crosses.",
     "As a swing trader he has a large watchlist; silver is on it only because a zone is near.",
     "Day traders: stick to 4-5 instruments max, e.g. gold, S&P, the euro, the yen, maybe GBP/USD and the Aussie; definitely the euro.",
     "If one instrument (e.g. USD/JPY) has nothing for a couple of weeks, swap another in.",
     "Good idea: a larger general basket plus a weekly watchlist picked from it based on trends, opportunities and his forecast, in separate columns."
    ]
   },
   {
    "heading": "Q&A: chart questions, trading after losses, win rate",
    "points": [
     "A student asked why he did not mark a recent rally-base-rally zone: that zone did not remove anything; the zone he has is the one that removed the supply.",
     "After a losing trade: if the next setup follows the rules, take it. But if you know two losses in a row will make you do stupid things, step away - and work on yourself so you can take the next setup. Two losses (down 2%) should not affect you.",
     "Win rate: risk-to-reward and win rate are correlated; larger R:R targets mean a lower win rate. To raise win rate, target lower R:R and trade good zones.",
     "Be specific when asking: which supply, which chart, which timeframe.",
     "BTC 15-minute supply: some supply there but he does not love zones that just peak up and drop like that."
    ]
   },
   {
    "heading": "Q&A: use his chart link, day-trading timeframes, direction",
    "points": [
     "Many members never use his chart link or daily breakdown video - that is the core of the membership; even day traders should use his zones.",
     "Day-trading example (USD/CAD): no zones or trendlines on the lower timeframe means nothing to trade; wait until price hits his H4 zone, then go to your 15-minute for day-trading longs.",
     "He swing trades entering on H4 and H1. New traders should stick to ONE entry timeframe.",
     "Stay off the 1-minute (its higher timeframe would be the 15-minute, which he does not analyse). Use the 5-minute with his H1 charts as the guide, or the 15-minute with his H4 as the guide. Pick one, not both.",
     "A student using daily, 1H and 5M: fine. Avoid the 15-minute unless a 15M zone sits right next to your 5M zone - then take the 15M zone because it is that close.",
     "His own early mistake 6-7 years ago: trying to day trade and swing trade while entering on 5M, 15M, H4 and H1 at once - extremely confusing and overwhelming.",
     "You really need a computer to trade; he dislikes trading on a phone.",
     "Direction depends on your entry timeframe: entering on 5M, direction comes from H1; once mastered add the daily ('higher timeframe plus one' / multiple sequence analysis). Example: H1 uptrend line means look for 5M longs, but at a daily supply expect the H1 trendline to break.",
     "A 1-minute trader does not need the daily; he, entering on H4/H1, uses daily, weekly and monthly."
    ]
   }
  ],
  "rules": [
   "Only draw zones that remove an opposing zone, remove a trendline, or make an all-time high/low.",
   "Draw a trendline only after a clear peak, valley and a higher high (uptrend) or lower low (downtrend).",
   "Draw uptrend lines from the lowest point possible to the valley; downtrend lines from the highest point possible to the peak.",
   "Never cut through candles with a trendline; move the anchor point instead.",
   "Do not draw large trendlines when smaller valid trendlines exist in between; keep one trendline at a time.",
   "End (stop extending) a trendline once price becomes heavily overextended from it.",
   "Consider a trendline removed only when a candle fully closes (body and wick) beyond it.",
   "Include all basing candles in the zone when they are close together.",
   "End the distal line at the wick; do not end the zone randomly.",
   "Do not trade a zone that is tricky to draw; if you have to ask whether the move away is good enough, avoid it.",
   "Measure and compare to older zones when a move away is questionable.",
   "A zone needs a stay-away candle when drawn at normal size.",
   "Do not shrink a zone to make its move away look valid.",
   "Treat a normal-sized wick through a zone as a removal; only a clearly exaggerated wick is emotional.",
   "Remove a supply zone when price peaks above it.",
   "Do not map out every high and low.",
   "Submit homework as a chart link, on the daily chart.",
   "Draw the trendline first, then apply the channel tool to the next valley/peak.",
   "Prefer trades between the trendline and the channel's 50% line; trade beyond 50% only with more aggressive management.",
   "Day traders: keep 4-5 instruments max and use one entry timeframe.",
   "Take the next valid setup after a loss unless you know your emotions are compromised; then step away.",
   "Get direction from the timeframe above your entry, then add one more (higher timeframe plus one)."
  ],
  "mistakes": [
   "Drawing a trendline from a peak and valley without a higher high / lower low.",
   "Calling momentum (small zigzags) a trendline.",
   "Drawing overly large trendlines and missing the ones in between.",
   "Drawing too many trendlines at once.",
   "Starting a trendline from the wrong point, creating zones that should not exist.",
   "Extending an overextended trendline as if still relevant.",
   "Treating a trendline as removed before a full body-and-wick close beyond it.",
   "Drawing zones that accomplished nothing (random zones).",
   "Mapping out every single high and low.",
   "Forcing zones with too-small moves away.",
   "Drawing zones too small to justify the move away / stay-away candle.",
   "Drawing zones too small in general instead of including all basing candles.",
   "Ending the distal line before the wick.",
   "Mistaking a normal wick for an emotional wick and keeping a removed zone.",
   "Not removing a zone after price peaks above it.",
   "Picking the zone with a big wick when a better one exists above.",
   "Trading borderline, drawable-only zones.",
   "Doing homework on the wrong timeframe (1-minute instead of daily).",
   "Submitting homework as a screenshot; thick lines and cluttered dots.",
   "Repeating the same mistakes week after week.",
   "Trading several entry timeframes and both day and swing trading at once.",
   "Trading on the 1-minute as a beginner.",
   "Large watchlists for day trading; trading whippy yen cross pairs.",
   "Asking vague questions without chart, timeframe and location.",
   "Not using his chart link and daily breakdown video.",
   "Trading after losses when emotionally compromised."
  ],
  "quotes": [
   "If it's tricky to draw, if you don't really know if it's a good move away, I would avoid it.",
   "We're not trying to cut through candles.",
   "We need the higher high.",
   "We do not map out every single high and low.",
   "When you draw it that small, a lot of zones become zones that aren't.",
   "Why is this a zone? Oh, trend line was removed.",
   "You're down 2%, big deal.",
   "Pick one, don't do both.",
   "I kind of feel like I'm forcing zones at this point."
  ],
  "diagrams": [
   {
    "key": "trendline",
    "caption": "Peak, valley, then the higher high (or lower low) that confirms the line; anchor at the extreme without cutting candles; skip large lines with smaller ones inside."
   },
   {
    "key": "sequence",
    "caption": "Chain analysis: each zone exists because it removed a zone, a trendline, or made an all-time high/low."
   },
   {
    "key": "qualify",
    "caption": "Measuring a borderline move away (e.g. 112 pips needed) - if you have to measure it, it is drawable, not tradable."
   },
   {
    "key": "zone-removed",
    "caption": "Normal wick through a zone = removed; only an exaggerated emotional wick keeps it."
   },
   {
    "key": "trend-momentum",
    "caption": "Small zigzags are momentum, not the obvious peak and valley a trendline needs."
   },
   {
    "key": "mtf",
    "caption": "Higher timeframe plus one: 5M entry, H1 direction, daily context."
   }
  ],
  "checklist": [
   "Does this zone remove an opposing zone, a trendline, or make an all-time high/low?",
   "Is the move away clearly explosive, or would I need to measure it? If measuring, treat it as drawable only.",
   "Is there a stay-away candle with the zone drawn at proper size, including all basing candles and the wick?",
   "Is the trendline built on peak, valley and a higher high / lower low, from the extreme point, not cutting candles?",
   "Is there a smaller trendline in between that makes a large one invalid?",
   "Has the trendline been removed by a full body-and-wick close?",
   "Is price overextended from the trendline (beyond the channel's 50%)? If so, manage more aggressively.",
   "Was any wick through the zone truly emotional or just normal?",
   "Is the instrument on my small watchlist and am I on my one entry timeframe?",
   "What does the timeframe above my entry (plus one more) say about direction?",
   "Am I emotionally fit to take this after recent losses?"
  ],
  "journalTags": [
   "zone removed nothing",
   "no higher high",
   "momentum not trend",
   "trendline too large",
   "trendline wrong anchor",
   "trendline cuts candles",
   "trendline not ended",
   "premature trendline removal",
   "zone drawn too small",
   "forced zone",
   "borderline zone traded",
   "normal wick as emotional",
   "zone not removed",
   "distal not at wick",
   "overextended entry",
   "too many timeframes",
   "watchlist too big",
   "tilt after losses"
  ],
  "newVsPdfs": [
   "Channel tool explained: draw trendline first, project channel to the next swing; between trendline and 50% = golden/optimal area, beyond 50% = overextended/danger zone.",
   "Trade management tied to the channel: less aggressive inside the golden area, more aggressive when trading in the overextended area; counter-trend entry-TF zones more likely to work when overextended beyond the channel.",
   "Concrete pip measuring of borderline moves away (112 pips reference; 82/102 vs 108/115) and the rule that zones needing measurement are drawable, not tradable; on real charts he simply skips them.",
   "Emotional wick vs normal wick distinction: a proportionally normal wick through a zone removes it.",
   "Do not shrink zones to justify the move away/stay-away candle.",
   "Chart zoom/price action scale makes moves away look different; explosiveness is relative.",
   "Learning path: free course, private lessons, then Sunday sessions.",
   "Day-trading setup: 4-5 instruments (gold, S&P, euro, yen, GBP/USD, Aussie), large basket plus weekly watchlist, yen crosses whippy.",
   "Timeframe pairings for using his charts: 5M entry with his H1, or 15M entry with his H4; avoid 1M; use 15M zone only if right next to the 5M zone.",
   "Direction = timeframe above entry plus one; 1M traders do not need the daily.",
   "Win rate vs R:R correlation; trading after two losses only if emotionally in control.",
   "Next homework: January 2000 to January 2001 with the all-time low marked."
  ],
  "examples": [
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Large trendline vs smaller trendline in between",
    "reasoning": "A smaller valid trendline (peak, valley, higher high) exists inside the large one, so the large one is not drawn.",
    "outcome": "Only the smaller trendline kept; drawing the large one makes you miss zones."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Borderline supply zone (student asked)",
    "reasoning": "Reference move measured 112 pips; needed at least 112 pips; it qualified.",
    "outcome": "Drawn as drawable but not tradable; on real charts he would skip such a zone."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Borderline supply after a supply was removed, with a top wick",
    "reasoning": "Body 82, body-bottom to wick 102 vs comparisons 108/115; wick made him nervous; felt like forcing.",
    "outcome": "Drawn for chain analysis only, not a trade; price blasted right through it."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Uptrend line that became overextended",
    "reasoning": "Valid peak/valley/higher high, but price ran far from it, making it irrelevant.",
    "outcome": "Keep the line but end it; extending would also hide the next trendline."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Demand zone from a trendline removal",
    "reasoning": "Trendline removed only when a candle fully closed (body and wick) beyond it; zone includes all basing candles.",
    "outcome": "Pretty good zone he would probably take; produced a nice trade."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Downtrend line removal followed by basing only",
    "reasoning": "Rule 2 does not always give a zone; only basing candles, no explosive move.",
    "outcome": "No zone; analysis ends there."
   },
   {
    "market": "Homework pair",
    "timeframe": "Daily",
    "setup": "Candidate zone with decent move away but no stay-away candle",
    "reasoning": "Drawn at a size similar to the other zones, there is no stay-away candle.",
    "outcome": "Not a zone."
   },
   {
    "market": "Student chart",
    "timeframe": "Daily",
    "setup": "Zone kept because of a supposed emotional wick",
    "reasoning": "The wick was normal-sized relative to the candle; an emotional wick is much larger.",
    "outcome": "Zone should be removed."
   },
   {
    "market": "Student chart",
    "timeframe": "Daily",
    "setup": "Zone drawn very small to make the move away look good",
    "reasoning": "At proper size the move away is much weaker.",
    "outcome": "Not a valid zone; do not shrink zones."
   },
   {
    "market": "S&P 500",
    "timeframe": "Not specified",
    "setup": "Channel tool on an upward trendline",
    "reasoning": "Price between trendline and 50% line = golden area for longs; above 50% = danger/overextended.",
    "outcome": "Trade in the golden area with normal management; overextended area allowed with more aggressive management; counter-trend supply more likely to work when overextended."
   },
   {
    "market": "USD/CAD",
    "timeframe": "Lower TF (5M/15M) with his H4",
    "setup": "Day-trading plan",
    "reasoning": "No zones or trendlines on the lower timeframe; wait for price to reach his H4 zone.",
    "outcome": "Then drop to the 15-minute and look for day-trading longs."
   },
   {
    "market": "BTC",
    "timeframe": "15-minute",
    "setup": "Student-identified supply",
    "reasoning": "There is some supply, but he dislikes zones that just peak up and drop.",
    "outcome": "Not bad, not loved."
   },
   {
    "market": "Generic",
    "timeframe": "H1 / 5M / Daily",
    "setup": "Direction for 5M entries",
    "reasoning": "H1 uptrend line means look for 5M longs; but price at a daily supply means the H1 trendline may break.",
    "outcome": "Higher timeframe plus one."
   }
  ],
  "qa": [
   {
    "q": "Are the old Sunday sessions available?",
    "a": "Yes, but he deletes ones older than about 2 months because he refuses to pay for unlimited storage; the last ~5 are always available."
   },
   {
    "q": "Is this close supply zone valid?",
    "a": "It is close; on real charts he would just not draw it. For homework he measured: 112 pips reference, needed at least 112; it qualified, so draw it, but it is not a great zone - drawable not tradable."
   },
   {
    "q": "As a new member I'm overwhelmed since zones depend on removing previous zones.",
    "a": "Put vertical lines at Jan 2000 and Jan 2001, copy his zones from his chart link in Discord (you just need the existing zone and the all-time low), then draw all the trendlines. You will struggle at first, that is fine and why the meetings exist."
   },
   {
    "q": "Should I make a new account just for this community / trading?",
    "a": "Yes, just open a blank chart; the welcome video explains how to submit homework properly."
   },
   {
    "q": "No candle closed yet beyond the trendline (student note)?",
    "a": "Exactly - great observation; the trendline is removed only by a full close."
   },
   {
    "q": "How do you use the channel tool?",
    "a": "Draw your trendline first. Put the channel on the trendline and drag the other side to the valley after the peak (roughly). For a downtrend, below the 50% mark is overextended (tradable but not loved); between trendline and 50% is optimal. For an uptrend, between trendline and 50% is the golden area; above 50% is the danger zone - trade it with more aggressive management. Counter-trend zones are more likely to work in the overextended area than in the golden area."
   },
   {
    "q": "Can we all speak with each other on mic?",
    "a": "Yes if you have a question; he does not want to talk for no reason."
   },
   {
    "q": "How do I know which pairs to trade and avoid?",
    "a": "No pairs to strictly avoid, but cross pairs (especially yen crosses) are whippy junk. Swing traders can have a big watchlist; day traders 4-5 max (gold, S&P, euro, yen, maybe GBP/USD, Aussie). Keep a large general basket and pick a weekly watchlist from it based on trends and opportunities."
   },
   {
    "q": "Why didn't you mark the recent zone that blew off that rally-base-rally?",
    "a": "Because that zone did not remove anything; the zone he has is the one that removed the supply."
   },
   {
    "q": "If you have a losing trade, would you still take the next setup?",
    "a": "If it follows the rules, yes, 100%. But if you know two losses in a row will make you do stupid things, step away, and work on your emotional control so you can take it. Two losses is only down 2%."
   },
   {
    "q": "How can I improve my win rate?",
    "a": "Vague question; R:R and win rate are correlated. Larger R:R means lower win rate, so look for lower R:R and trade good zones."
   },
   {
    "q": "BTC, there's supply?",
    "a": "Be specific (which chart, timeframe, where). On the 15-minute there is some supply but he does not love zones that just peak up and drop."
   },
   {
    "q": "As a day trader, what timeframes should I use?",
    "a": "He enters on H4 and H1 as a swing trader, but a newer trader should stick to one. Avoid the 1-minute. Use the 5-minute with his H1 charts as the guide, or the 15-minute with his H4 as the guide. Pick one."
   },
   {
    "q": "It's difficult to track on the phone.",
    "a": "If you are going to be a trader you need a computer; he generally does not like trading on his phone."
   },
   {
    "q": "As a day trader I use daily, 1H and 5M - OK?",
    "a": "Yes. Avoid the 15-minute, unless a 15M zone is right next to your 5M zone; then take the 15M zone. Stick to one entry timeframe - his own early mistake was trading many timeframes and styles at once."
   },
   {
    "q": "What timeframe gives a clear market direction?",
    "a": "Depends on your entry timeframe. Entering on 5M, direction is from H1; once mastered, add the daily (higher timeframe plus one / multiple sequence analysis). If you trade the 1-minute you do not need the daily; he uses daily, weekly and monthly because he enters on H4/H1."
   }
  ],
  "newDiagrams": [
   {
    "id": "trendline-channel-50",
    "title": "Channel tool: golden area vs overextended",
    "caption": "Draw the uptrend line first, project the channel to the opposite swing. Between the trendline and the 50% line is the golden area; above 50% is overextended - tradable with more aggressive management, and counter-trend supply there is more likely to work.",
    "svg": "<line x1='20' y1='160' x2='300' y2='70' stroke='#34d399' stroke-width='2'/><line x1='20' y1='110' x2='300' y2='20' stroke='#94a3b8' stroke-width='1.5'/><line x1='20' y1='135' x2='300' y2='45' stroke='#a78bfa' stroke-width='1' stroke-dasharray='4 3'/><polygon points='20,160 300,70 300,45 20,135' fill='#34d399' fill-opacity='0.12'/><polygon points='20,135 300,45 300,20 20,110' fill='#f87171' fill-opacity='0.12'/><text x='200' y='88' fill='#34d399' font-size='9'>golden area (normal mgmt)</text><text x='150' y='58' fill='#f87171' font-size='9'>overextended (aggressive mgmt)</text><text x='250' y='42' fill='#a78bfa' font-size='9'>50%</text><text x='24' y='174' fill='#94a3b8' font-size='9'>trendline drawn first, channel to next swing</text>"
   },
   {
    "id": "higher-high-required",
    "title": "Trendline needs the higher high",
    "caption": "Left: peak, valley, then a higher high = valid uptrend line. Right: peak and valley with no higher high = no trendline, even if it looks identical.",
    "svg": "<polyline points='15,150 55,90 80,120 125,60' fill='none' stroke='#94a3b8' stroke-width='1.5'/><line x1='15' y1='150' x2='150' y2='108' stroke='#34d399' stroke-width='2'/><line x1='55' y1='90' x2='150' y2='90' stroke='#94a3b8' stroke-dasharray='3 3'/><text x='112' y='54' fill='#34d399' font-size='9'>higher high</text><text x='20' y='170' fill='#34d399' font-size='10'>valid trendline</text><polyline points='175,150 215,90 240,120 280,98' fill='none' stroke='#94a3b8' stroke-width='1.5'/><line x1='215' y1='90' x2='310' y2='90' stroke='#94a3b8' stroke-dasharray='3 3'/><line x1='175' y1='150' x2='300' y2='112' stroke='#f87171' stroke-width='2' stroke-dasharray='5 3'/><text x='255' y='84' fill='#f87171' font-size='9'>no higher high</text><text x='185' y='170' fill='#f87171' font-size='10'>not a trendline</text>"
   },
   {
    "id": "wick-normal-vs-emotional",
    "title": "Normal wick vs emotional wick",
    "caption": "A wick proportional to its candle that breaks the zone is a normal break - remove the zone. Only an exaggerated wick, far larger than the candle body, counts as emotional.",
    "svg": "<rect x='20' y='60' width='280' height='22' fill='#f87171' fill-opacity='0.18' stroke='#f87171'/><text x='24' y='55' fill='#f87171' font-size='9'>supply zone</text><line x1='90' y1='50' x2='90' y2='130' stroke='#94a3b8'/><rect x='82' y='95' width='16' height='30' fill='#34d399'/><text x='50' y='150' fill='#94a3b8' font-size='9'>normal wick = removed</text><line x1='230' y1='20' x2='230' y2='140' stroke='#a78bfa'/><rect x='222' y='115' width='16' height='20' fill='#34d399'/><text x='180' y='160' fill='#a78bfa' font-size='9'>emotional wick = exaggerated</text>"
   }
  ],
  "botRules": [
   {
    "rule": "Zone qualifies for chain analysis only if it removed an opposing zone, removed a trendline, or made an all-time high/low",
    "detail": "Three rules; otherwise discard",
    "plannerStep": "Zone"
   },
   {
    "rule": "Validate uptrend line only after peak, valley, then a close above the peak (higher high); mirror for downtrend",
    "detail": "Fail to break the high = no trendline",
    "plannerStep": "Context"
   },
   {
    "rule": "Anchor trendline at the lowest low (uptrend) / highest high (downtrend); if the line intersects any candle between anchors, shift the anchor",
    "detail": "No candle may be cut through",
    "plannerStep": "Context"
   },
   {
    "rule": "Prefer the most recent smaller trendline; discard a larger trendline if a valid smaller one exists within its span",
    "detail": "One active trendline at a time",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removed only when a candle closes with full body and wick beyond the line",
    "detail": "Touching candles do not remove it",
    "plannerStep": "Context"
   },
   {
    "rule": "Mark trendline irrelevant (ended) when price is heavily overextended from it",
    "detail": "discretionary (no specific point)",
    "plannerStep": "Context"
   },
   {
    "rule": "If the move away has to be measured to qualify, flag the zone as drawable-only and do not trade",
    "detail": "Measure candidate vs prior qualifying move, e.g. needs >= 112 pips when reference was 112",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Zone width must include all adjacent basing candles and extend distal to the wick before testing move away and stay-away candle",
    "detail": "No stay-away candle at normal width = no zone",
    "plannerStep": "Zone"
   },
   {
    "rule": "Treat a wick through the zone as removal unless the wick is exaggerated relative to the candle",
    "detail": "discretionary (normal-sized wick = removed)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Channel position: compute channel from trendline to the next opposite swing; price between line and 50% = golden, beyond 50% = overextended",
    "detail": "Overextended: allowed with more aggressive management; counter-trend zones there get higher odds",
    "plannerStep": "Levels"
   },
   {
    "rule": "Direction from the timeframe above entry, context from one more above",
    "detail": "5M entry -> H1 direction -> daily context; H4/H1 entry -> daily/weekly/monthly",
    "plannerStep": "Context"
   },
   {
    "rule": "Single entry timeframe per trader profile; 5M paired with H1 zones or 15M with H4 zones",
    "detail": "Avoid 1M; use a 15M zone on a 5M plan only if it sits right next to the 5M zone",
    "plannerStep": "Setup"
   },
   {
    "rule": "Day-trading watchlist limit",
    "detail": "4-5 instruments max; avoid whippy yen crosses",
    "plannerStep": "Setup"
   },
   {
    "rule": "Lower-timeframe trade only when price reaches a higher-timeframe zone when the entry timeframe has no zones/trendlines",
    "detail": "e.g. wait for H4 zone, then look for 15M longs",
    "plannerStep": "Setup"
   },
   {
    "rule": "Block trading after consecutive losses if the trader flags emotional tilt",
    "detail": "discretionary (example: two losses = -2% should not matter)",
    "plannerStep": "Verdict"
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
  "n": 12,
  "title": "Space between stay-away grades the zone; homework chain and first trade reviews",
  "kind": "zoom",
  "date": "2026-10-11",
  "summary": "Kevin re-explained the zone recipe for new members and stressed that the space between the stay-away candle and the proximal line is what tells him whether a zone is good or poor. He then walked the homework chain from January 01 to January 02 (an all-time low with no valid demand, trendline drawing and removal on a full candle close, a supply widened on its proximal side, and a trendline break with no zone). He marked every student's homework, pointing out common faults: distal lines not attached to the wick, zones drawn too small, and momentum lines drawn as trendlines. For the first time he went through the Discord trade-review channel. He set the rules for posting reviews (show the zone and the reaction, no dollar amounts) and judged each trade on zone quality, the trendline, how old the zone was, the stop width and the trend.",
  "sections": [
   {
    "heading": "Opening and new format for Sunday sessions",
    "points": [
     "Some homework weeks have lots of zones and some, like last week, are mostly about not forcing zones. Learning when NOT to draw a zone matters just as much.",
     "He wants new things in these sessions, so from now on he will go through the Discord trade-review channel every Sunday.",
     "Keep the trade-review channel simple, clean and clear so it can be reviewed live. Questions belong in the questions channel, not in trade review.",
     "A student asked about a EURUSD H1 'green candle that failed'. His answer: he does not see a candle as failing. A candle is just a candle."
    ]
   },
   {
    "heading": "Zone recipe recap for new members",
    "points": [
     "A zone has four required parts, but parts 3 and 4 are linked, so you really only need three. Get those three and you have all four.",
     "1) Basing candles: small candles, found everywhere on a chart. You need 1 to 3, and they can be any colour (a basing candle in a demand zone can be green).",
     "2) Move-away candle: it must be explosive. He gives no measurement on purpose, because when price gets very overextended the moves away start to look smaller. You learn to judge it over time, and there is some subjectivity.",
     "The move away must be one explosive candle that covers the distance. If price got there through a series of little basing candles, it does not count.",
     "3) Stay-away candle: it stays away from the proximal line.",
     "4) Space between the stay-away candle and the proximal line. A stay-away candle automatically gives you this space."
    ]
   },
   {
    "heading": "The space between the stay-away candle is the quality grade",
    "points": [
     "How he judges a zone as good or bad: by the space between the stay-away candle and the proximal line.",
     "EURUSD H1 example: single-candle basing ('my favorite'), a very obvious explosive move away, a stay-away candle and a large space. It is a very good zone and the trade worked.",
     "On the same chart, a second zone had very little space. It was not the best zone, so that trade was 'completely avoidable'. It failed completely.",
     "A third zone had decent space and was a pretty good zone. It gave about a 1:1, or break-even, depending on the R:R target.",
     "So the three examples were a great, a poor and a pretty good zone, and the results matched the space: 'it's no coincidence'.",
     "Poor-space zones are still drawn (drawable versus tradable) so you can follow what removes them in the chain analysis. They are just not traded.",
     "Stops: don't use a very tight stop, in these market conditions or in general. Even a sensible stop can be taken out by the spread; that happened to him on EURUSD a couple of weeks ago."
    ]
   },
   {
    "heading": "Trendline recap and the three Sunday-analysis rules",
    "points": [
     "A trendline needs an obvious peak and valley, not small ones, and then a higher high (or a lower low for a downward line).",
     "In the Sunday analysis, only draw zones that do one of three things: remove an opposing zone, remove a trendline, or make an all-time high or low. It must be an ALL-TIME high or low, not just any high or low.",
     "He is being a little more lenient on moves away this time. In some market conditions moves away are huge, and then people only look for moves that big, when smaller explosive ones are fine too."
    ]
   },
   {
    "heading": "Homework walkthrough, January 01 to January 02 (chain analysis)",
    "points": [
     "An earlier zone was valid because it removed the downward trendline. Price reacted nicely (maybe a 1:1) and then removed that zone.",
     "He spotted a single-candle-basing supply right away and kept it a similar size to the previous zones (by eye, not measured). He would not have liked trading it: price took so long to come back that the zone was old, and old zones are usually not the best to trade.",
     "All-time low: under rule 3 this suggests a zone, but not every time ('this is a tricky one'). He looked for explosive candles and started with the one closest to the all-time low. When the trigger is an all-time low, a removed zone or a removed trendline, the candidate is always the closest one to it.",
     "Drawn at a similar size to the other zones, the nearest candidate had almost no space and no stay-away candle, so it is not a zone. The next candidate was the same, so they left the zone above as it was and did not force a demand.",
     "A student suggested drawing it very small to create space. His answer: 'we're not gonna make zones smaller just to fit.'",
     "He marked the all-time low with a horizontal ray. There was an obvious peak and valley there, but no high was broken afterwards, so there is no trendline. If a high had been broken, there would definitely be one.",
     "Upper trendline: peak, valley, and then the high above the valley was broken, so it is valid. Draw it from the lowest point of the valley. If that cuts through candles, adjust it to the next point.",
     "Downward trendline: obvious peak, valley and a lower low, drawn from the highest point. It is borderline 'almost too horizontal', but he kept it. Any more push down would have made it irrelevant."
    ]
   },
   {
    "heading": "When the trendline was removed, and the zone that removed it",
    "points": [
     "A trendline is NOT removed when candles merely touch it. Here a red candle and even the green explosive candle were still touching the line.",
     "It is removed only when the first candle closes fully above it (body and wick) for a downward line, or fully below it for an upward line. If a wick still touches the line, it is not removed until a candle closes clear of it.",
     "Then you find the zone that removed it. Here it was a zone that 'just barely' qualified.",
     "Later, a supply zone 'very obviously' removed the zone and the upper trendline, and it gave a beautiful little trade."
    ]
   },
   {
    "heading": "Drawing a supply larger on the proximal side",
    "points": [
     "Drawn wick to wick, that supply was only about half the size of the earlier zone (he cloned the zone to compare them).",
     "He did not stretch it over all of the earlier basing, because there were two different sections of basing.",
     "Instead he made it 'just a little bit bigger' on the proximal side so it matches the size of nearby zones. That is why you sometimes see him widen a zone; there are examples in the Weekly Forex Forecast.",
     "He would trade that supply on appearance alone: the space under the stay-away candle was good. Price reacted and removed it, and right away there was a demand below with an explosive move away."
    ]
   },
   {
    "heading": "A trendline break with no zone",
    "points": [
     "There was a peak and valley, so there was a trendline, and it broke. But no supply removed it.",
     "'Just because a trend line breaks or a zone breaks doesn't mean we just automatically have a zone.' In that case the chain ends there."
    ]
   },
   {
    "heading": "Homework marking: borderline calls and subjectivity",
    "points": [
     "'Nothing is personal in this homework.' If he is hard on someone, it is because he cares.",
     "Zones and trendlines that were close got a 'borderline'. Borderline means it could go either way, so it is not marked wrong. 'Nothing is going to be 100%' and trading will be a little subjective.",
     "What made him nervous about one borderline zone was the wick. If that part had been bodies (more basing candles) it would have been obvious. A wick there makes it less certain.",
     "What he does not want to see is lines nowhere near a trendline being called trendlines. That is 'way wrong'.",
     "Missing one trendline can cascade and make you miss the zones and trendlines that follow in the chain.",
     "He admitted he had missed an obvious trendline himself because he was too focused on another part of the chart. 'I'm not perfect.' A student had caught it, and everyone should add it to their charts.",
     "He found one homework zone drawn over an extra candle. The zone must be drawn on the single basing candle only."
    ]
   },
   {
    "heading": "Homework marking: common faults",
    "points": [
     "Distal line not attached to the candle (a 'random distal line'). The distal line must sit on the wick. Getting this wrong made one student miss the next zone in the chain.",
     "Zones drawn too small. Make them bigger so they match the size of nearby zones.",
     "Basing that is too big means it is not a zone.",
     "Trendlines drawn with no lower low (or higher high). 'If you draw trend lines like this, they're literally everywhere on the chart.' After the peak and valley, a new high (or low) must form.",
     "Momentum drawn as trendlines. 'This is momentum.' Focus on the larger peaks and valleys.",
     "A basing candle labelled as a zone ('that's a basing candle, not a zone').",
     "Two zones drawn at one all-time low with no reason, and zones not extended until the candle that actually removes them.",
     "Moves away that are not explosive enough.",
     "In a multiple-timeframe homework (EURUSD daily demand plus H1 zones), the daily demand was good. One H1 zone was rejected because the move away was not explosive. The other H1 zone, with nice single-candle basing, was fine.",
     "Submission problems: wrong chart, wrong timeframe, links that would not open, and no visible timeframe or symbol all mean he cannot mark the work. He will not chase anyone for homework.",
     "He praised a student who marked peaks, valleys and higher highs, because it shows they are applying the rules. He called it a good tip for new traders."
    ]
   },
   {
    "heading": "Homework for next week",
    "points": [
     "Chain from January 2002 to January 2003.",
     "Make sure the supply zone from this session is on your chart and drawn properly (proximal widened as shown). That is the first thing he will check.",
     "New members can start with the lesson homework; doing both is better."
    ]
   },
   {
    "heading": "Trade review: how to post",
    "points": [
     "Show both the zone and the trade. If the zone is far from the reaction, post two screenshots, one of the zone and one of the reaction.",
     "A screenshot of only the result, a 5-minute entry with no context, or a risk-reward tool covering the zone cannot be judged.",
     "A student pointed out that people mostly post wins. He agreed and asked everyone to show the full analysis.",
     "Don't tag him with a chart and no question; he won't answer it.",
     "Never post dollar amounts, even on a demo account. Post percentages. Dollar amounts can make people feel bad: the same trade might make $30 for one person and $300 for another. Percentage is what matters, and it is in the rules."
    ]
   },
   {
    "heading": "Trade review: verdicts",
    "points": [
     "A trade after a trendline removal, with nice basing and a very explosive move away, was a great trade. It was entered halfway into the zone, which happened to work.",
     "Entering halfway through the zone is not banned. It gives a higher R:R when it works, but you get filled less often and miss trades. 'There's no free lunch.'",
     "A break-even on a good zone is fine.",
     "A EURGBP quick 1:1 had a pullback too quick for his liking, but it worked. The trade was with the trend, so a bigger R:R was technically possible. With price that overextended, he liked the aggressive management.",
     "A full take-profit trade had the zone on a basing candle. The proper zone was lower, and that would still have been a trade.",
     "For a set & forget zone, he would have drawn only the single basing candle instead of the whole large area.",
     "A confirmation trade had a good upper trendline but large basing. When the basing is almost the size of the move-away candle, 'it's kind of our sign to kind of stay away'. It removed the trendline, and if you are convinced by the higher timeframe it was a nice confirmation trade.",
     "USDCHF 3:1 was a great trade. The box the student called 'liquidity' was not obvious liquidity, just a random box.",
     "AUDUSD liquidity trap: a decent zone that he liked.",
     "Natural gas gap zone: a decent trade, but not his favourite setup.",
     "A 15-minute set & forget loss: the trendline was really horizontal price action with no real peak (first mistake). The supply only just qualified, and it was old. The zone 'move away' was two green candles that look like one move but are not, so it was not explosive. Looking at the overall move instead of the single candle is a mistake he makes too.",
     "Several trades won from zones with no explosive move away, or from basing candles. He was glad they worked but said they were not zones, and he 'wouldn't be doing my job' if he didn't say so.",
     "A 1:2 trade was too zoomed in and had no explosive move away. It also did not remove any demand, so it was not supply.",
     "Lost trade: the trendline was way overextended and basically irrelevant, so the supply it depended on was not valid either. The zone itself was not terrible, but the loss was avoidable.",
     "Rally-base-rally confirmation zone with beautiful basing and move away, and price staying far away: 'as good as it's gonna get'.",
     "A break-even on EUR and a 1:6 (1.26) on EURJPY with a wider stop were a great example of why wider stops are often better, especially in these market conditions.",
     "US100 H1 zone: he did not love one wick, but it was a pretty good trade and a fine loss for that market. On another trade the only thing against it was the higher timeframes.",
     "A wicked-out trade was counter-trend against very strong USDCAD momentum, which is why he preferred the long. 'Break-even, win, loss' over a week is completely reasonable."
    ]
   },
   {
    "heading": "Closing Q&A and mindset",
    "points": [
     "Being stopped out again and again by a tight stop: use a wider stop loss.",
     "A student said that cutting 75% of their pairs, keeping swing trading in the background and checking charts at most once a day had improved their results. He agreed it is not stupid at all.",
     "You can backtest on any timeframe you like.",
     "Gold had a nice confirmation-trading setup for the week ahead.",
     "'If you lose, don't let it frustrate you. It's the reality of trading.'"
    ]
   }
  ],
  "rules": [
   "Grade every zone by the space between the stay-away candle and the proximal line. Large space = good zone, minimal space = poor zone.",
   "Draw poor-space zones for the chain analysis, but do not trade them.",
   "Count the move away only if it is a single explosive candle, not a run of small candles or two candles that look like one.",
   "Use 1 to 3 basing candles, of any colour.",
   "Only draw zones in the Sunday analysis that remove an opposing zone, remove a trendline, or make an all-time high or low.",
   "After an all-time low or high, a removed zone or a removed trendline, check the closest explosive candle first.",
   "Never shrink a zone to create space. Draw it at a similar size to nearby zones and then judge it.",
   "Draw a trendline only after an obvious peak, an obvious valley and a broken high (or a lower low).",
   "Treat a trendline as removed only when the first candle closes fully beyond it (body and wick). Touching does not count.",
   "If a zone drawn wick to wick is much smaller than nearby zones and it has two basing sections, widen only the proximal side a little. Don't swallow the other basing.",
   "A trendline or zone break without a qualifying zone produces no zone. End the chain there.",
   "Attach the distal line to the wick of the basing candle.",
   "Draw the zone on the single basing candle when the base is one candle; don't include the neighbouring candle.",
   "Remove trendlines that are overextended and irrelevant, and do not trade zones that depend on them.",
   "Avoid very tight stops; use wider stops in these market conditions.",
   "Post trade reviews showing the zone and the reaction (two screenshots if needed), with no dollar amounts, only percentages.",
   "Put questions in the questions channel, not in trade review.",
   "Submit homework with the right chart and timeframe visible."
  ],
  "mistakes": [
   "Trading zones with minimal space under the stay-away candle.",
   "Treating a run of small candles, or two consecutive candles, as one explosive move away.",
   "Calling a basing candle a zone.",
   "Shrinking a zone so that it appears to have space.",
   "Drawing trendlines with no higher high or lower low. They end up everywhere on the chart.",
   "Drawing momentum as a trendline.",
   "Treating horizontal price action as a trendline.",
   "Removing a trendline when a candle only touches it or a wick crosses it.",
   "Distal lines not attached to the wick.",
   "Zones drawn too small compared with nearby zones.",
   "Assuming every trendline or zone break gives a zone.",
   "Trading old zones that price took a long time to return to.",
   "Keeping an overextended trendline and trading the supply that depends on it.",
   "Taking a zone whose basing is almost the size of the move away.",
   "Stops that are too tight and get taken out by the spread.",
   "Counter-trend trades against very strong momentum.",
   "Hyper-zooming into lower timeframes and calling random structures zones.",
   "Labelling random boxes as liquidity.",
   "Posting only wins, only results, or screenshots where the R:R tool hides the zone.",
   "Posting dollar amounts.",
   "Submitting homework with the wrong chart or timeframe, or a link that won't open.",
   "Missing one trendline, which makes you miss the zones that follow in the chain."
  ],
  "quotes": [
   "We have to learn when to not draw a zone as well.",
   "A candle is just a candle.",
   "The space between the stay-away candle and the zone is what really tells me if it's a good zone or not.",
   "It's still drawable versus tradable.",
   "We're not gonna make zones smaller just to fit.",
   "Just because a trend line breaks or a zone breaks doesn't mean we just automatically have a zone.",
   "Nothing is going to be 100%.",
   "There's no free lunch.",
   "I wouldn't be doing my job if I didn't say that.",
   "If you lose, don't let it frustrate you. It's the reality of trading."
  ],
  "diagrams": [
   {
    "key": "zone-anatomy",
    "caption": "Basing, explosive move away, stay-away candle and the space under it. Today he graded quality by the size of that space."
   },
   {
    "key": "quality",
    "caption": "Great, poor and pretty-good EURUSD H1 zones: results matched the space under the stay-away candle."
   },
   {
    "key": "draw",
    "caption": "Distal line on the wick, similar zone size, single basing candle only. Widen the proximal side when the zone is undersized."
   },
   {
    "key": "trendline",
    "caption": "Obvious peak and valley plus a broken high or lower low. Anchor at the extreme point without cutting candles."
   },
   {
    "key": "trend-momentum",
    "caption": "Several homework 'trendlines' were momentum; focus on the larger peaks and valleys."
   },
   {
    "key": "zone-removed",
    "caption": "Trendline removed only by the first full body-and-wick close beyond it; touching candles don't count."
   },
   {
    "key": "sequence",
    "caption": "Chain analysis: each zone must remove a zone, remove a trendline or make an all-time high or low. A break with no zone ends the chain."
   }
  ],
  "checklist": [
   "Are there 1 to 3 small basing candles?",
   "Is the move away a single explosive candle?",
   "Is there a stay-away candle, and how big is the space under it?",
   "Is the zone drawn at a similar size to nearby zones, with the distal line on the wick?",
   "Did it remove an opposing zone, remove a trendline, or make an all-time high or low?",
   "Is it the closest explosive candle to that event?",
   "Was the trendline really removed by a full body-and-wick close?",
   "Is the trendline built from an obvious peak and valley plus a higher high or lower low? Is it too horizontal or overextended?",
   "Is the basing small compared with the move away?",
   "How old is the zone?",
   "Is the trade with the trend, not against strong momentum?",
   "Is the stop wide enough to survive the spread and current conditions?"
  ],
  "journalTags": [
   "no space under stay-away",
   "not explosive move away",
   "basing candle as zone",
   "zone too small",
   "distal not on wick",
   "momentum as trendline",
   "no higher high or lower low",
   "trendline too horizontal",
   "overextended trendline",
   "premature trendline removal",
   "old zone",
   "basing too large",
   "tight stop",
   "counter-trend momentum",
   "forced zone",
   "entered mid-zone"
  ],
  "newVsPdfs": [
   "The size of the space between the stay-away candle and the proximal line is the main quality grade (great, poor or pretty good, with live EURUSD H1 results), not just a yes/no requirement.",
   "After an all-time low or high, a removed zone or a removed trendline, check the closest explosive candle first.",
   "Widen a zone slightly on the proximal side when wick to wick is about half the size of nearby zones and there are two separate basing sections.",
   "Old zones that price takes a long time to return to are usually not the best to trade.",
   "A basing almost the size of the move away is a sign to stay away.",
   "Two consecutive candles that look like one move are not an explosive move away; judge the single candle, not the overall move.",
   "A wick, rather than bodies, in the basing area makes a borderline zone less certain.",
   "Borderline calls on zones and trendlines are explicitly not marked wrong; some subjectivity is accepted.",
   "Entering halfway through the zone gives a higher R:R but fewer fills.",
   "Wider stops are often better in current conditions; very tight stops get taken out by the spread.",
   "New Sunday format: trade-review rules (zone plus reaction screenshots, no dollar amounts, questions elsewhere).",
   "Homework chain continues from January 2002 to January 2003."
  ],
  "examples": [
   {
    "market": "EURUSD",
    "timeframe": "H1",
    "setup": "Demand with single-candle basing, a very explosive move away and a large space under the stay-away candle",
    "reasoning": "Big space between the stay-away candle and the proximal line = great zone",
    "outcome": "Good trade"
   },
   {
    "market": "EURUSD",
    "timeframe": "H1",
    "setup": "Zone with very little space between the stay-away candle and the proximal line",
    "reasoning": "Poor quality. Drawable, not tradable",
    "outcome": "Failed completely; he called it avoidable"
   },
   {
    "market": "EURUSD",
    "timeframe": "H1",
    "setup": "Zone with moderate space",
    "reasoning": "Pretty good zone",
    "outcome": "About 1:1 or break-even depending on the R:R target"
   },
   {
    "market": "Homework chart (Jan 01 to Jan 02)",
    "timeframe": "homework timeframe",
    "setup": "Candidate demands at an all-time low",
    "reasoning": "Drawn at a similar size, they had no stay-away candle and no space. Shrinking them to create space is not allowed",
    "outcome": "No zone. The zone above stays"
   },
   {
    "market": "Homework chart (Jan 01 to Jan 02)",
    "timeframe": "homework timeframe",
    "setup": "Downward trendline (borderline flat) removed by the first full close above it, and the zone that removed it",
    "reasoning": "Candles touching the line did not remove it; only the full body-and-wick close did. The zone just barely qualified",
    "outcome": "Valid chain link"
   },
   {
    "market": "Homework chart (Jan 01 to Jan 02)",
    "timeframe": "homework timeframe",
    "setup": "Supply that removed the zone and the upper trendline, widened on the proximal side",
    "reasoning": "Wick to wick it was half the size of the other zones. It had two basing sections, so he widened it only a little. It had good space",
    "outcome": "Beautiful little trade, later removed by a demand"
   },
   {
    "market": "Homework chart (Jan 01 to Jan 02)",
    "timeframe": "homework timeframe",
    "setup": "Trendline break",
    "reasoning": "No supply removed it",
    "outcome": "No zone; the chain stops"
   },
   {
    "market": "EURUSD daily / H1 (student MTA homework)",
    "timeframe": "D / H1",
    "setup": "Daily demand with H1 zones",
    "reasoning": "The daily move away is obvious. One H1 move away was not explosive; the other had single-candle basing",
    "outcome": "One H1 zone rejected, one accepted"
   },
   {
    "market": "EURGBP",
    "timeframe": "not stated",
    "setup": "With-trend zone, quick pullback",
    "reasoning": "Pullback too quick for him; price overextended so aggressive management was fine",
    "outcome": "Quick 1:1 win"
   },
   {
    "market": "Not stated (student)",
    "timeframe": "not stated",
    "setup": "Confirmation trade after upper trendline removal, large basing",
    "reasoning": "Basing almost the size of the move away is a sign to stay away; acceptable if the higher timeframe is convincing",
    "outcome": "Win; 'pretty good job'"
   },
   {
    "market": "USDCHF",
    "timeframe": "not stated",
    "setup": "Good zone with a 'liquidity' box",
    "reasoning": "Good trade; the liquidity box was not obvious",
    "outcome": "3:1 win"
   },
   {
    "market": "AUDUSD",
    "timeframe": "not stated",
    "setup": "Liquidity trap zone",
    "reasoning": "Decent zone",
    "outcome": "Win"
   },
   {
    "market": "Natural gas",
    "timeframe": "not stated",
    "setup": "Gap zone",
    "reasoning": "Decent but not his favourite setup",
    "outcome": "Win"
   },
   {
    "market": "Not stated (student)",
    "timeframe": "15m set & forget",
    "setup": "Supply off a flat 'trendline'",
    "reasoning": "The trendline was horizontal with no peak. The zone barely qualified and was old. The move away was two candles, not one explosive candle",
    "outcome": "Loss; not a great setup"
   },
   {
    "market": "Not stated (student)",
    "timeframe": "not stated",
    "setup": "Supply depending on an overextended trendline",
    "reasoning": "The trendline was irrelevant, so the supply was not valid, even though the zone looked fine",
    "outcome": "Loss; avoidable"
   },
   {
    "market": "Not stated (student)",
    "timeframe": "not stated",
    "setup": "Rally-base-rally confirmation zone",
    "reasoning": "Beautiful basing and move away, and price went further away",
    "outcome": "1:1 win; 'as good as it's gonna get'"
   },
   {
    "market": "EUR / EURJPY",
    "timeframe": "not stated",
    "setup": "Two trades, one with a wider stop",
    "reasoning": "Wider stops survive these market conditions",
    "outcome": "Break-even and a 1:6"
   },
   {
    "market": "US100",
    "timeframe": "H1",
    "setup": "H1 zone with one wick he didn't love",
    "reasoning": "Pretty good trade for that market",
    "outcome": "Loss; 'a fine loss'"
   },
   {
    "market": "USDCAD",
    "timeframe": "H1",
    "setup": "Counter-trend short against strong momentum",
    "reasoning": "Counter-trend; he preferred the long",
    "outcome": "Wicked out"
   }
  ],
  "qa": [
   {
    "q": "Can you share tips on the EURUSD H1 green candle that failed?",
    "a": "He does not see a candle as failing; a candle is just a candle. The zone involved was not a good zone, because the stay-away candle left very little space."
   },
   {
    "q": "Why not draw the all-time-low demand very small so it has space?",
    "a": "We do not make zones smaller just to fit. Drawn at a similar size, it has no space and no stay-away candle, so it is not a zone."
   },
   {
    "q": "Isn't that downward trendline too horizontal?",
    "a": "It is close and borderline. Any more push down would make it irrelevant, but in his opinion it still qualifies."
   },
   {
    "q": "My chain this week is totally wrong.",
    "a": "That's okay."
   },
   {
    "q": "Can you check a specific pair at the end?",
    "a": "He doesn't like turning the session into a forecast, but said to remind him at the end."
   },
   {
    "q": "Why do you not recommend entering halfway through the zone?",
    "a": "He is not really against it. There are pros and cons and no free lunch: your R:R is higher when the zone works, but you get filled less, so you win fewer trades and miss some."
   },
   {
    "q": "My base is only one candle; is that allowed?",
    "a": "A base is not limited to one candle. It can be one to as many as you want; he prefers one to three, up to five."
   },
   {
    "q": "A student summarised the strategy: good basing, an explosive move away, a stay-away candle, a trendline needs an obvious peak and valley, and a zone must remove an opposing zone.",
    "a": "A pretty good, accurate representation."
   },
   {
    "q": "Do we have to do the homework on the AUD pair, or can we start with the lessons?",
    "a": "Start with the lessons; doing both is better."
   },
   {
    "q": "What should I do if I keep getting knocked out by a tight stop loss?",
    "a": "Use a wider stop loss."
   },
   {
    "q": "If I backtest on the daily timeframe, is it good for all timeframes?",
    "a": "He wasn't sure what was meant, but you can backtest on any timeframe you like. Send follow-ups in text on Discord."
   },
   {
    "q": "When are the Sunday meetings?",
    "a": "Around 9:30 a.m. Eastern Time."
   }
  ],
  "newDiagrams": [
   {
    "id": "stay-away-space-grade",
    "title": "Grading by stay-away space",
    "caption": "Same recipe, different quality: a big gap between the stay-away candle and the proximal line is a great zone; almost no gap is drawable but not tradable.",
    "svg": "<text x=\"8\" y=\"14\" fill=\"#94a3b8\" font-size=\"10\">Grade a zone by the space under the stay-away candle</text><rect x=\"20\" y=\"130\" width=\"120\" height=\"16\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"1\"/><text x=\"22\" y=\"158\" fill=\"#34d399\" font-size=\"9\">demand zone</text><rect x=\"30\" y=\"132\" width=\"8\" height=\"10\" fill=\"#f87171\"/><line x1=\"34\" y1=\"128\" x2=\"34\" y2=\"146\" stroke=\"#f87171\"/><rect x=\"44\" y=\"70\" width=\"10\" height=\"62\" fill=\"#34d399\"/><line x1=\"49\" y1=\"64\" x2=\"49\" y2=\"134\" stroke=\"#34d399\"/><rect x=\"60\" y=\"56\" width=\"9\" height=\"16\" fill=\"#34d399\"/><line x1=\"64\" y1=\"50\" x2=\"64\" y2=\"80\" stroke=\"#34d399\"/><rect x=\"64\" y=\"80\" width=\"70\" height=\"50\" fill=\"#a78bfa\" fill-opacity=\"0.18\" stroke=\"#a78bfa\" stroke-dasharray=\"3 2\"/><text x=\"70\" y=\"108\" fill=\"#a78bfa\" font-size=\"9\">big space</text><text x=\"30\" y=\"174\" fill=\"#34d399\" font-size=\"10\">GREAT zone</text><rect x=\"180\" y=\"130\" width=\"120\" height=\"16\" fill=\"#34d399\" fill-opacity=\"0.18\" stroke=\"#34d399\" stroke-width=\"1\"/><text x=\"182\" y=\"158\" fill=\"#34d399\" font-size=\"9\">demand zone</text><rect x=\"190\" y=\"132\" width=\"8\" height=\"10\" fill=\"#f87171\"/><line x1=\"194\" y1=\"128\" x2=\"194\" y2=\"146\" stroke=\"#f87171\"/><rect x=\"204\" y=\"80\" width=\"10\" height=\"52\" fill=\"#34d399\"/><line x1=\"209\" y1=\"74\" x2=\"209\" y2=\"134\" stroke=\"#34d399\"/><rect x=\"220\" y=\"104\" width=\"9\" height=\"20\" fill=\"#f87171\"/><line x1=\"224\" y1=\"98\" x2=\"224\" y2=\"127\" stroke=\"#f87171\"/><rect x=\"224\" y=\"127\" width=\"70\" height=\"3\" fill=\"#a78bfa\" fill-opacity=\"0.5\"/><text x=\"232\" y=\"120\" fill=\"#a78bfa\" font-size=\"9\">almost no space</text><text x=\"186\" y=\"174\" fill=\"#f87171\" font-size=\"10\">POOR zone - drawable, not tradable</text>"
   },
   {
    "id": "widen-proximal-two-bases",
    "title": "Widening an undersized zone",
    "caption": "When wick to wick is about half the size of nearby zones and there are two basing sections, keep the distal line on the wick and push the proximal line slightly. Don't swallow the older basing.",
    "svg": "<text x=\"8\" y=\"14\" fill=\"#94a3b8\" font-size=\"10\">Two basing sections: widen proximal a little, not the whole base</text><rect x=\"40\" y=\"40\" width=\"10\" height=\"16\" fill=\"#34d399\"/><line x1=\"45\" y1=\"34\" x2=\"45\" y2=\"60\" stroke=\"#34d399\"/><rect x=\"56\" y=\"44\" width=\"10\" height=\"14\" fill=\"#f87171\"/><line x1=\"61\" y1=\"38\" x2=\"61\" y2=\"62\" stroke=\"#f87171\"/><text x=\"30\" y=\"30\" fill=\"#94a3b8\" font-size=\"9\">older basing (ignore)</text><rect x=\"80\" y=\"70\" width=\"10\" height=\"12\" fill=\"#34d399\"/><line x1=\"85\" y1=\"64\" x2=\"85\" y2=\"86\" stroke=\"#34d399\"/><line x1=\"85\" y1=\"86\" x2=\"85\" y2=\"92\" stroke=\"#34d399\"/><rect x=\"96\" y=\"80\" width=\"11\" height=\"80\" fill=\"#f87171\"/><line x1=\"101\" y1=\"76\" x2=\"101\" y2=\"164\" stroke=\"#f87171\"/><text x=\"104\" y=\"174\" fill=\"#f87171\" font-size=\"9\">explosive move away</text><rect x=\"70\" y=\"64\" width=\"240\" height=\"11\" fill=\"none\" stroke=\"#94a3b8\" stroke-dasharray=\"3 2\"/><text x=\"200\" y=\"60\" fill=\"#94a3b8\" font-size=\"9\">wick-to-wick: half size</text><rect x=\"70\" y=\"64\" width=\"240\" height=\"22\" fill=\"#f87171\" fill-opacity=\"0.16\" stroke=\"#f87171\"/><text x=\"200\" y=\"100\" fill=\"#f87171\" font-size=\"9\">supply: distal at wick,</text><text x=\"200\" y=\"111\" fill=\"#f87171\" font-size=\"9\">proximal pushed down to</text><text x=\"200\" y=\"122\" fill=\"#f87171\" font-size=\"9\">match similar zone size</text>"
   },
   {
    "id": "basing-vs-move-away",
    "title": "Basing size vs move away",
    "caption": "When the basing is almost as big as the move-away candle, take it as a sign to stay away, even if the move away itself is good.",
    "svg": "<text x=\"8\" y=\"14\" fill=\"#94a3b8\" font-size=\"10\">Basing vs move away: compare their sizes</text><rect x=\"30\" y=\"120\" width=\"12\" height=\"20\" fill=\"#f87171\"/><rect x=\"46\" y=\"118\" width=\"12\" height=\"22\" fill=\"#34d399\"/><rect x=\"62\" y=\"40\" width=\"12\" height=\"80\" fill=\"#34d399\"/><text x=\"20\" y=\"160\" fill=\"#34d399\" font-size=\"9\">small basing, big move: OK</text><rect x=\"190\" y=\"70\" width=\"14\" height=\"60\" fill=\"#f87171\"/><rect x=\"208\" y=\"72\" width=\"14\" height=\"56\" fill=\"#34d399\"/><rect x=\"226\" y=\"50\" width=\"12\" height=\"72\" fill=\"#34d399\"/><text x=\"170\" y=\"150\" fill=\"#f87171\" font-size=\"9\">basing ~ size of move away:</text><text x=\"170\" y=\"161\" fill=\"#f87171\" font-size=\"9\">sign to stay away</text><line x1=\"160\" y1=\"24\" x2=\"160\" y2=\"170\" stroke=\"#94a3b8\" stroke-dasharray=\"2 3\"/>"
   }
  ],
  "botRules": [
   {
    "rule": "Require a stay-away candle and a measurable gap between it and the proximal line",
    "detail": "Gap size grades the zone. Large gap = tradable; minimal gap = drawable only. No numeric threshold given (discretionary)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Move away must be one explosive candle",
    "detail": "No measurement given. Multiple small candles, or two candles that only look like one move, do not qualify. Be somewhat lenient when the market is overextended (discretionary)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Basing count",
    "detail": "1 to 3 candles of any colour (prefers 1 to 3, up to 5)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Reject if basing size is close to move-away size",
    "detail": "Basing 'almost the size of the move-away candle' means stay away (discretionary ratio)",
    "plannerStep": "Zone"
   },
   {
    "rule": "Zone must have a trigger",
    "detail": "It removed an opposing zone, OR removed a trendline (first full body-and-wick close beyond it), OR made an all-time high or low",
    "plannerStep": "Setup"
   },
   {
    "rule": "Pick the candidate zone closest to the trigger",
    "detail": "Use the explosive candle nearest the all-time low or high, removed zone or removed trendline. If it fails the space check, try the next; if none qualify, there is no zone",
    "plannerStep": "Zone"
   },
   {
    "rule": "Normalise zone height",
    "detail": "Similar size to recent zones on the same timeframe. Never shrink to create space. If undersized with two basing sections, extend the proximal side slightly",
    "plannerStep": "Zone"
   },
   {
    "rule": "Trendline validity",
    "detail": "Obvious peak + obvious valley + a broken high (up) or lower low (down). Reject near-horizontal or overextended lines",
    "plannerStep": "Context"
   },
   {
    "rule": "Trendline removal",
    "detail": "Removed only by the first candle whose body AND wick close fully beyond the line; a candle touching it does not count",
    "plannerStep": "Context"
   },
   {
    "rule": "Downgrade old zones",
    "detail": "Zones that price took a long time to return to are usually not the best (no number given)",
    "plannerStep": "Verdict"
   },
   {
    "rule": "Avoid counter-trend trades against strong momentum",
    "detail": "discretionary",
    "plannerStep": "Context"
   },
   {
    "rule": "Entry at the proximal line by default",
    "detail": "A mid-zone entry is allowed but gets filled less often in exchange for a higher R:R",
    "plannerStep": "Levels"
   },
   {
    "rule": "Stop not too tight",
    "detail": "Leave room beyond the distal line for the spread; prefer wider stops in current conditions (no number given)",
    "plannerStep": "Levels"
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
