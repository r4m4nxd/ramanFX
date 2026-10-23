// Raja (mentor) - private 1:1 coaching sessions with the user, translated from Urdu/Hindi
// Whisper transcripts (English trading terms spoken in between) and checked against the screen-share frames.
// Meaning is translated, not words; uncertain readings are marked (likely). Private sessions are numbered from 101.
import type { VideoLesson } from '@/core/videoLessons';


export const RAJA_PRIVATE: VideoLesson[] = [
 {
  n: 101,
  title: 'Private session 1 (Feb 2, 2026): Which zones get limit orders - strong, wow and arrival vs the six weak zones',
  kind: 'zoom',
  summary: "Raja's first weekly 1:1 session with you (58 min). He answers one question: on which zones do you place buy/sell limit (set and forget) orders? Only on fresh strong zones (the leg-out removed the opposite zone) and arrival zones (the leg-out crossed the trendline AND removed the opposite zone), inside a wow-trade area and with the higher-timeframe trend. Everything else - tested, retested, overlap, flip, inheritance and out-of-trendline zones, plus zones that did not remove anything - is weak and is traded only with lower-timeframe confirmation, or not at all. He also adds price-action rules he uses alongside supply and demand: long wicks get filled, do not trade while price is 'meshing' between a supply and a demand, and in weak situations prefer the zone nearest the trendline.",
  sections: [
   {
    heading: 'What he taught',
    points: [
     'Trade with the trend. Supply and demand works when you trade in the direction the market is going; in an uptrend you keep buying the zones that form above the trendline, in a downtrend you sell the supplies along the trendline.',
     'Higher timeframe first. Market makers look at the high timeframes and hunt stop losses on the low ones, so read the HTF before going lower. He starts students on the HTF for that reason.',
     'Only fresh zones. A tested zone is always a weak area: the second time price comes to it, it is going there to break it, not to respect it. Tested and retested zones are both weak. You still do not skip the entry - you use confirmation there.',
     'Step 1 - strong zone: a zone whose move removed the opposite zone (a supply whose drop broke the demand below, or a demand whose rally broke the supply above). He says the market respects such a zone about 98 percent of the time.',
     'Condition on the strong zone: do not trade it against the higher timeframe. If a daily strong supply sits right next to a monthly demand, price will tap the supply and remove it rather than drop.',
     'Step 2 - wow trade (extension of pips): when a zone is removed, price is drawn to the next zone of the same type. Everything between the broken supply and the next supply is buy pips (and between a broken demand and the next demand, sell pips). Either price retests and enters from the new zone, or it goes straight; in both cases it goes to the target. Without an identified wow area you do not trade at all, because the direction is unknown.',
     'In the wow area you go to the lower timeframe and keep trading with the trendline. Pips you "lose" on one timeframe while waiting for the break are picked up by trading the lower timeframe inside the same buying area.',
     'Step 3 - arrival zone: two rules. (1) Price crosses the trendline, (2) the same move removes the opposite zone. Arrival zones are usually found at valleys and peaks (swing lows and highs). The market respects them.',
     'Trendlines: an ascending trendline joins at least two higher lows; when it is crossed, a descending trendline is drawn across at least two lower highs (peaks). Both exist on low and high timeframes.',
     'How many times can a zone be traded? First touch: set and forget (limit order). Second touch: you do not know whether the market is going to break it, so go to a lower timeframe (weekly, daily or H4, depending on the zone) and wait for confirmation. On a monthly zone that means: on the daily/H4 price crosses the trendline and removes the opposite zone; then enter, with the stop at that supply or above it (likely).',
     'Confirmation timeframe: one step below the zone. A zone seen on H1 is confirmed on M15; a zone on M15 is confirmed on M5.',
     'An arrival zone is hard to break on the first test. If the market wants to break it, it tests it twice, comes to the extreme point, and then breaks it. Multiple zones keep forming along the way and you trade them in that sequence.',
     'The nine zone types (his board at 50:27): strong side = strong zone, wow trade, arrival zone (three, of which two - strong and arrival - get limit orders). Weak side = (1) zone that did not remove the opposite zone, (2) tested, (3) retested, (4) overlap, (5) flip, (6) inheritance and out-of-trendline zones. Weak zones are the reason people fail with supply and demand.'
    ]
   },
   {
    heading: 'The weak zones, one by one',
    points: [
     'Plain weak zone: the supply could not break the demand (or the demand could not break the supply). When price returns it will try hard to remove it. Wait to see whether it breaks; do not jump in.',
     'Inheritance zone (41:44-44:18): a zone whose move crossed the trendline but did NOT remove the opposite zone; the zone below it (number 2) is the one that removed it. Zone 1 inherits from zone 2. Price taps zone 2, it becomes weak, price then breaks zone 2 and goes for zone 1 too, forming a V shape. He says market makers build these on purpose so they look like arrival zones but are fake. Rule: a zone that only crossed the trendline is weak; only trendline cross PLUS opposite zone removed is strong.',
     'Overlap zone (44:20-46:20): a demand and a supply that form right next to or inside each other (no gap between them). Such a supply is weak even if it removed the opposite zone. Most supply-and-demand losses come from people trading overlap zones. His old example (gold, from a session with another student, "Ankit", likely): the student expected a drop from a supply; Raja said price would break it because the supply formed inside a demand level - and it did.',
     'Flip zone (47:54-49:00): where a broken resistance becomes support (or support becomes resistance) as the market zig-zags in impulse and correction. Overlap zones are usually found at flip areas. Use confirmation there.',
     'Out-of-trendline zones (49:04-49:45): once the market crosses the trendline, the CP levels of the old trend automatically become weak and the market breaks them easily. If the trend has changed (price coming down), look only at fresh supplies.',
     'In weak situations, prefer the zone nearest the trendline: when price has run away and left a gap above the first CP, the next pullback will not come back to the far CP; it will respect the CP closest to the trendline. To reach the far one it would have to cross the trendline first. This is for weak scenarios only; on strong zones you simply place the order.'
    ]
   },
   {
    heading: 'Price-action rules he adds',
    points: [
     'Long wicks get filled. Whenever the market makes a long wick, it later comes back to fill it; you do not need supply and demand for that. A long wick is a signal of where the market is going next.',
     'Gold (07:51-10:13): the daily shows a long upper wick that price is filling (dropping). The weekly/monthly also show the wick above, so long term gold should go up again and hit about 6,600 USD (likely, he says "chhe-sath sau"). Before that he expects the drop to cross the trendline and reach the proper strong area lower down (about 3,600 USD said; his blue daily box sits around 3,250-3,500).',
     'Meshing: sometimes the market keeps a supply above and a demand in between and just chops between them, up and down. Do not trade during that. Gold is in this state now (stop-loss hunting on the low timeframe); if it breaks structure on the low timeframe, a new zone forms and then you buy.',
     'Three CPs, then the fourth: as discussed in an earlier session, after three CP (rally-base-rally) levels the market tries to build a fourth, and then it reverses, making a new valley/peak.',
     'Base-candle box (29:02, your question): if the next candle already covers the base candle area, it is still valid. With one very long base candle, box only its body, otherwise the zone becomes too big. With small base candles, take the whole group including wicks in one box (he adds this applies on the lower timeframes; meaning of the HTF remark unclear).',
     'Wick or close for a break (22:14, your question): a cross of the zone line by 5-10 pips counts even if it is only a wick (likely). For trendline crosses the signal sometimes comes from a wick and sometimes from the body, but wicks can give fake signals; his next session covers that rule.'
    ]
   },
   {
    heading: 'Chart walk-throughs',
    points: [
     'BNBUSD weekly (07:05): blue demand box sitting on the ascending trendline from the 2023 low; H1 shows price in the box. Used for the "trade with the trend / zone at the trendline" idea.',
     'XAUUSD daily and monthly (07:51-10:29): long upper wick on the daily at the January 2026 top (about 5,600) being filled down to about 4,400; monthly still shows the wick above. Daily blue box low down at the trendline is the safe strong area he expects before the next leg up.',
     'BTCUSD daily/H4/monthly (10:52-12:07): a demand the market has not broken yet. Rule: forget a supply or demand only once the market has crossed it. Market makers hunt the stops of other methods.',
     'Hand drawings on BTCUSD monthly (15:27-18:21): (1) strong zone - supply that broke the demand; (2) "WOW" - broken supply, buy pips to the next supply; (3) arrival zone - descending trendline crossed (T) and opposite zone removed (Opp).',
     'EURUSD monthly (19:11-21:24): the 2014 rally-drop-base-drop CP supply removed two demands below it (one a V-shaped valley), so it is a strong supply; a later fresh supply removed another demand and became strong too. A CP that formed as an overlap is weak. A later demand removed the opposite CP supply, became strong, tested, entered and rallied; a tested zone was then removed on the second visit.',
     'GBPJPY monthly (21:28-22:50): two demands broken by one CP supply = strong; price entered and dropped. Another area became strong because its move broke the opposite level, and price entered and went up.',
     'USDCNH monthly (23:01-24:10, transcript reads "USD-CNH", chart confirms USDCNH): a demand rallied and broke the supply, then the market respected that demand. Once the trendline changes, think sell, with that strong demand as the target. A second demand is not strong: price hunted stops below it and meshed - a kind of overlap zone. Use confirmation on the tested one.',
     'EURUSD/GBPJPY monthly wow (24:20-25:40): one demand broke, the next demand below is the target, everything between is sell pips; same for supplies upward. A tested supply in between will simply break, so the next supply is the target.',
     'Monthly arrival examples (30:33-33:13): GBPJPY monthly - price crossed the descending trendline and removed the opposite zone; the demand that did it is an arrival zone, tapped once, twice, and broken on the third visit (it was weak by then). USDCNH monthly demand at the bottom: trendline crossed, opposite zone removed, respected; he expects USD weakness from here.',
     'GBPJPY confirmation, March 2020 (35:12-39:40): monthly zone tested twice (recoloured as tested). On H4: descending trendline crossed, opposite strong supply removed by the demand = arrival zone; the move gave about 700-800 pips. On the daily the same pattern: trendline crossed, supply removed by the demand, about 1,000 pips, then a further supply removed = second trade. Step by step, each strong zone that removed the opposite zone is respected, even on M1, M5 or M15.',
     'Drawn examples A and B on GBPJPY monthly (41:27-42:02): two stacked zones on a rising trendline. You answered that zone 2 is strong in both (it is the one that broke the opposite zone) - correct. Zone 1 on top is the inheritance zone.'
    ]
   },
   {
    heading: 'Mistakes he corrected',
    points: [
     'You said you have been marking zones since you started supply and demand but are not yet profitable. His fix: stop treating every zone as tradable. Identify only strong zones and arrival zones for limit orders, use confirmation on weak ones, and practise this every day for the week.',
     'Buying a zone just because it crossed the trendline. That alone is an inheritance zone (weak, often a market-maker trap); it also has to remove the opposite zone.',
     'Expecting a drop from a supply that formed inside a demand (the overlap example from another student). Overlap zones break; most S&D losses come from them.',
     'Placing a limit order on a zone the second time. Second touch = confirmation on the lower timeframe, never set and forget.',
     'Trading gold now. It is meshing and stop-hunting on the low timeframe; there is no clear direction, so no trade until structure breaks and a new zone forms.',
     'Taking a trade without an identified wow area. If you do not know where price is being drawn, the trade is just a stop-loss hunt waiting to happen.',
     'Using indicators: he tells you not to; S&D zones and trendlines only.',
     'Your clarifying questions he confirmed: the same rules apply on small timeframes (yes, exactly the same); after a trend change you look only at fresh supply (yes).'
    ]
   },
   {
    heading: 'New vs his course',
    points: [
     'Most of this repeats "Strong Zones I: strong vs weak, wow trade and arrival zones" and "Strong Zones II: tested zones, confirmation, inheritance, overlap and flip zones" (same 3 strong + 6 weak scheme). New or sharper here:',
     'A higher-timeframe veto on strong zones: a daily strong supply next to a monthly demand will be removed, not respected. Not stated this explicitly in "Strong Zones: CP Zones and Arrival Zones".',
     'Explicit confirmation timeframe mapping: H1 zone -> M15 confirmation, M15 -> M5 (the "Live Pair Review" lesson used M15 entries with M5 confirmation; here it is a general one-step-down rule).',
     '"Nearest the trendline" tie-breaker for weak scenarios when several CPs are stacked with a gap - not in the course lessons.',
     'Long-wick-fill rule and the "meshing = no trade" rule are new price-action filters on top of S&D.',
     'Inheritance zones described as deliberate market-maker fakes of arrival zones, and overlap zones as the main source of S&D losses; overlap zones are said to form at flip areas.',
     'Arrival zone breaking pattern: two tests, then the extreme point, then the break on the third visit (compare the 1st/2nd/3rd/4th-touch rule in "Strong Zones II", where the 4th touch usually breaks - here a monthly arrival zone broke on the 3rd).',
     'Base-candle box rule (body-only for one long base candle, whole group with wicks for small candles) is new detail.'
    ]
   },
   {
    heading: 'Corrected from his video',
    points: [
     'Transcript symbol "USD-S-CNH" (23:01) is USDCNH on the chart (Pepperstone USDCNH monthly).',
     'At 07:04 the transcript says "weekly ... this wick, that wick"; the screen at 07:05 shows BNBUSD weekly, not gold. He switches to gold at 07:37 (XAUUSD daily at 07:51).',
     'At 31:37 he says "this is the monthly timeframe"; the chart is GBPJPY monthly for the trendline-cross arrival example, then USDCNH monthly at 32:39.',
     'At 35:27 he says "monthly area" for the confirmation example; the chart is GBPJPY, then H4 (36:52) and daily (37:54) around March 2020.',
     'Transcript "Rajer ... 1700s" and "Al-Kindi" for the origin of S&D are almost certainly ASR or a loose remark; left out of the rules.'
    ]
   }
  ],
  rules: [
   'Limit (set and forget) orders only on FRESH strong zones and arrival zones.',
   'Strong zone = its leg-out removed the opposite zone.',
   'Arrival zone = leg-out crossed the trendline AND removed the opposite zone; usually at a valley or peak.',
   'Crossed the trendline but did not remove the opposite zone = inheritance zone = weak.',
   'Tested and retested zones are weak: 1st touch set and forget, 2nd touch confirmation only.',
   'Confirmation = trendline cross + opposite zone removed, one timeframe lower (H1 -> M15, M15 -> M5).',
   'A supply formed inside or next to a demand (overlap) is weak, even if it removed something.',
   'After the trendline is crossed, the old trend CP levels are weak; trade only fresh zones in the new direction.',
   'No wow area identified = no trade.',
   'Do not trade a strong zone against an opposite higher-timeframe zone sitting next to it.',
   'Long wicks get filled.',
   'Market meshing between a supply and a demand = no trade.',
   'In weak setups with stacked CPs, the zone nearest the trendline is the one respected.'
  ],
  mistakes: [
   'Treating every zone as tradable instead of only strong and arrival zones.',
   'Taking a trendline-cross zone that did not remove the opposite zone (inheritance trap).',
   'Trading overlap zones (supply inside a demand level).',
   'Setting a limit order on a zone the second time.',
   'Trading while the market is meshing / stop-hunting (gold now).',
   'Trading without knowing the wow target.',
   'Using indicators.'
  ],
  quotes: [
   'A tested zone is always considered a weak area - the second time, the market is going there to break it, not to respect it.',
   'If you do not have the wow trade area identified, you cannot take any trade.',
   'Most of the losses people make in supply and demand come from trading overlap zones.',
   'Whether it is one minute, five minutes or fifteen minutes, a strong zone that broke the opposite zone is what the market respects.'
  ],
  diagrams: [],
  checklist: [
   'Is the trade with the HTF trend, and is there no opposite HTF zone right next to my zone?',
   'Is the zone fresh?',
   'Did its leg-out remove the opposite zone (strong)? Did it also cross the trendline (arrival)?',
   'Is it an inheritance, overlap, flip or out-of-trendline zone? Then confirmation only.',
   'Where is the wow target (next zone of the same type)?',
   'Is the market meshing between a supply and a demand? Then stand aside.',
   'For a second touch: did the lower timeframe cross the trendline and remove the opposite zone?'
  ],
  journalTags: ['raja', 'private-session', 'strong-zone', 'arrival-zone', 'wow-trade', 'weak-zone', 'confirmation', 'inheritance', 'overlap', 'long-wick'],
  newVsPdfs: [
   'HTF veto: a lower-timeframe strong zone next to an opposite higher-timeframe zone gets removed.',
   'Confirmation one timeframe lower (H1 -> M15, M15 -> M5).',
   'Nearest-the-trendline tie-breaker for weak scenarios.',
   'Long-wick-fill and meshing (no trade) price-action filters.',
   'Inheritance zones as market-maker fakes; overlap zones form at flip areas and cause most losses.',
   'Monthly arrival zone broke on the third visit (two tests, extreme point, break).'
  ],
  images: [
   { src: '/lessons/raja_hi/private/2026-02-02/f-007_t07m05s.jpg', caption: '[07:05] BNBUSD weekly: demand box on the ascending trendline', notes: ['Trade with the trend: buy the zones that form along the trendline.', 'He also points at the long weekly wicks: long wicks get filled.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-009_t07m51s.jpg', caption: '[07:51] XAUUSD daily: long upper wick at the January 2026 top being filled', notes: ['Long wick = signal of the next move; price comes back to fill it.', 'Weekly/monthly wick above points to gold going higher long term (about 6,600 USD, likely).'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-017_t15m27s.jpg', caption: '[15:27] Drawing 1 - strong zone: a supply whose drop broke the demand', notes: ['Removing the opposite zone makes it strong (respected about 98% of the time, he says).', 'Unless an opposite HTF zone sits right next to it.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-019_t17m22s.jpg', caption: '[17:22] Drawing 2 - WOW (extension of pips)', notes: ['A broken supply: everything up to the next supply is buy pips.', 'Retest-and-go or straight up, the target is the same; trade it on the lower timeframe with the trendline.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-021_t18m21s.jpg', caption: '[18:21] Drawing 3 - arrival zone: (1) trendline crossed, (2) opposite zone removed', notes: ['Both rules on the same move.', 'Usually found at valleys and peaks.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-026_t21m24s.jpg', caption: '[21:24] EURUSD monthly: the 2014 CP supply that removed the demands below', notes: ['Rally-drop-base-drop CP that broke two demands = strong supply.', 'A CP that formed as an overlap is weak.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-030_t23m41s.jpg', caption: '[23:41] USDCNH monthly: demand that broke the supply, then respected', notes: ['When the trendline changes, think sell; that strong demand is the target.', 'The other demand had a stop hunt / meshing below it: overlap-type, not strong.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-039_t31m58s.jpg', caption: '[31:58] GBPJPY monthly: arrival demand after the descending trendline cross', notes: ['Trendline crossed + opposite zone removed = arrival zone.', 'Tapped once, twice, broken on the third visit.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-045_t36m52s.jpg', caption: '[36:52] GBPJPY H4 (March 2020): confirmation for a tested monthly zone', notes: ['On H4 the descending trendline is crossed and the demand removes the opposite strong supply.', 'About 700-800 pips followed.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-046_t37m54s.jpg', caption: '[37:54] GBPJPY daily (2020): the same confirmation on the daily', notes: ['Trendline crossed, supply removed by the demand: about 1,000 pips.', 'Each further supply removed by a demand = the next trade, step by step.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-054_t41m44s.jpg', caption: '[41:44] Examples A and B: zone 1 (top) vs zone 2 (bottom) on a rising trendline', notes: ['Zone 2 removed the opposite zone = strong (your answer was right).', 'Zone 1 only crossed the trendline = inheritance zone, weak; it breaks after zone 2 is tapped and broken.'] },
   { src: '/lessons/raja_hi/private/2026-02-02/f-063_t50m27s.jpg', caption: '[50:27] His summary board: 1 = strong side (S, W, A), 2 = weak side', notes: ['Strong: strong zone, wow trade, arrival zone (strong and arrival get limit orders).', 'Weak: tested, retested, overlap, flip, inheritance, out of trendline - confirmation only.'] }
  ]
 }
];
