// Raja (mentor) - private 1:1 coaching sessions with the user, translated from Urdu/Hindi
// Whisper transcripts (English trading terms spoken in between) and checked against the screen-share frames.
// Meaning is translated, not words; uncertain readings are marked (likely). Private sessions are numbered from 101.
// 101 = Feb 2 topic session; 102-107 = the Mar-Jun analysis/review sessions in date order. The Feb 10, 18 and 25 topic
// sessions were merged into the matching course lessons in partA/partB (see tools/raja_hindi/MERGE.md).
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
 },
 {
  "n": 102,
  "title": "Private session (Mar 5, 2026): Live review - the zone nearest the trendline, two ways to use the low timeframe, brokers and a cent account",
  "kind": "zoom",
  "summary": "A 62-minute 1:1 that is mostly a live review on his MT4 charts (BTCUSD, ETHUSD, US30, XAUGBP, XAGAUD, GBPNOK) plus Q&A. The recurring idea: the real zone is the one nearest the trendline, and no trade is taken until the trendline is crossed. He gives the 1st-2nd-3rd-touch rule (the 4th is very risky), two ways to use the low timeframe (only when the HTF gives nothing, or a fixed H1-M15-M5 chain, never trading corrections), says the trendline is only a tool while supply and demand removal decides, and explains stop hunts by small brokers and why to practise on a cent account first.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "The real zone is the one nearest the trendline, not one in the middle; check how much space is left. A lower zone that broke nothing will still get touched if it sits along the trendline. Take a trade only after the trendline is crossed.",
     "On a demand buy, split into two small positions: take profit on the first early and hold the second while the LTF does not cross the trendline. For sells, go deeper, near the trendline / location area.",
     "Touches: the 1st, 2nd and 3rd are fine; the 4th is very risky because momentum is likely to break. A level touched 3-4 times is weak and will be broken.",
     "Stacked zones: prefer the one with strong imbalance; the weak one next to it will turn into a flip area. That strong zone gets set and forget, on ETH too.",
     "Once a trendline is crossed, the zone above (or below) it is automatically weak.",
     "When supply and demand are close together and both have been used, the market is sideways: trade it only on a lower timeframe, or wait for the major zone to break and a new trendline to form.",
     "Trendline cross with a close beyond it, but the opposite zone was not removed: price goes back. Supply and demand is the main thing; the trendline is only a tool for direction and safety. Choose what can give a wow trade.",
     "Low timeframe, way 1: use it only when the HTF gives nothing. If the H4 entry was taken or is tested, drop to H1 and trade its trendline zone; if H1 is tested too, go to M15/M30, and stop there once you have a zone.",
     "Low timeframe, way 2: a fixed chain H1 -> M15 -> M5 with the entry on M5. Do not trade corrections there: the LTF builds aggressive new trendlines in impulses, and a correction sell might pay 2 pips while the impulse pays 600-700. The realignment area is where the M15 and M5 zones coincide.",
     "Second method: wait for the trendline cross plus a structure break, then trade the LTF zones below (or above) the trendline as the market retests them."
    ]
   },
   {
    "heading": "Chart walk-throughs",
    "points": [
     "BTCUSD daily (00:00-03:07): technically a sell, but use confirmation here. The daily is on its 3rd touch; a drop from here goes to about 65k (likely). If the trendline is crossed it can pass 100k (likely) within a candle or two. Extend the trendline to find the TP. Long term (monthly): buy and leave it.",
     "ETHUSD weekly (05:00): a lot of space, so it fills slowly with meshing. Take the TP from the weekly trendline; lifting from the monthly, about 2,600-2,700 (likely) is easy, then meshing and later a drop to the weekly demand box around 1,400-1,500. On a buy, close at about 400-500 USD profit.",
     "US30 H4 (06:12): a sell he gave a student dropped and is filling the long wick (NAS100 sell too). It may drop more because there is no strong HTF zone to realign with; only a tested zone.",
     "BTCUSD weekly (08:25): technically BTC should come to the weekly zone (the box around 40k). Price fills, meshes, then drops. He calls a visit to about 40k (likely) a once-in-ten-years buying chance (his strong personal view, not a rule).",
     "XAUGBP H4 (09:46): no HTF zone and heading down. On the LTF it crossed the trendline; the first TP is the lower box. Not a great zone, but the new supply under the trendline can be used for shorts.",
     "XAUAUD / XAGAUD (10:30-13:56): XAUAUD is the oldest gold pair; it moves straight with few glitches and a big range. XAGAUD: the lower area is not strong because it did not close past the opposite zone; on M15 the supply under the trendline gives a sell.",
     "GBPNOK H4 (18:46-21:40): both supply and demand already used, so sideways. A strong weekly zone means no trade until it breaks; the daily still follows its trendline. Wait for the daily cross, then the sell pips come. Keep it on the watchlist with a sell bias, confirmation only."
    ]
   },
   {
    "heading": "Questions you asked",
    "points": [
     "Stops hit on the LTF when the spread widens: broker practice. Small brokers can widen spreads or print fake candles to hunt stops (sometimes not visible on TradingView). Put the stop 10-12 pips beyond the zone; if hunted, compare with TradingView and claim the money back. Use Pepperstone or IC Markets, not local brokers.",
     "COT reports: the weekly CFTC report helps medium/bank traders, more for shares than forex; he stopped using it because it comes late. Supply and demand sits above it.",
     "FOMO, entering early or late: in the coming sessions you practise and he reviews your trades on screen. A mentor's job is to fix psychology and behaviour and to discuss upcoming news.",
     "Starting live: not yet; practise on a cent account first (a 10-20 USD deposit shows as about 2,000 cents; 0.01 lot risks almost nothing; higher spread, but it feels real). Trade 0.01, build the habit, then go live small with Pepperstone or IC Markets."
    ]
   }
  ],
  "rules": [
   "The zone nearest the trendline is the real zone.",
   "No trade until the trendline is crossed.",
   "1st-3rd touch fine; the 4th touch is very risky.",
   "Use the LTF only when the HTF gives nothing; stop at M15 once you have a zone.",
   "Never trade corrections on the LTF.",
   "Supply and demand close together and used = sideways: lower timeframe only, or wait.",
   "Stop 10-12 pips beyond the zone with small brokers."
  ],
  "mistakes": [
   "Taking a zone in the middle instead of the one nearest the trendline.",
   "Trading the 4th touch of a level.",
   "Selling a correction on M5 for a few pips against the impulse.",
   "Trusting a trendline close when the opposite zone has not been removed.",
   "Going live before practising on a cent account."
  ],
  "quotes": [
   "The real zone is the one near the trendline.",
   "The trendline is only a tool; supply and demand is the main thing.",
   "Avoid corrections and you become a good trader."
  ],
  "diagrams": [],
  "checklist": [
   "Which zone is nearest the trendline?",
   "Has the trendline been crossed, and was the opposite zone removed?",
   "Which touch is this (4th = very risky)?",
   "Does the HTF give an entry? If not, which LTF way am I using?",
   "Am I trading the impulse, not a correction?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "live-review",
   "nearest-trendline",
   "low-timeframe",
   "touch-count",
   "broker",
   "cent-account"
  ],
  "newVsPdfs": [
   "Two explicit ways to use the LTF (only when the HTF gives nothing, or a fixed H1-M15-M5 chain).",
   "The trendline is a tool, not a rule: a close beyond it without an opposite zone removed goes back.",
   "Stacked zones: the weak neighbour of a strong-imbalance zone becomes a flip area."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-03-05/f-005_t03m07s.jpg",
    "caption": "[03:07] BTCUSD daily: the descending trendline and the box price is testing",
    "notes": [
     "Third touch; the 4th is very risky.",
     "A cross of the trendline opens the upside."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-05/f-008_t05m59s.jpg",
    "caption": "[05:59] ETHUSD weekly: the steep descending trendline and the weekly demand box below",
    "notes": [
     "TP from the weekly trendline; slow fill with meshing.",
     "Later drop to the weekly demand (about 1,400-1,500)."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-05/f-011_t08m43s.jpg",
    "caption": "[08:43] BTCUSD weekly: the trendline broken and the weekly zone around 40k",
    "notes": [
     "Once the trendline is crossed, the zone above is weak.",
     "Price fills, meshes, then drops toward the weekly zone."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-05/f-016_t13m56s.jpg",
    "caption": "[13:56] XAGAUD M15: the supply under the descending trendline",
    "notes": [
     "HTF entry missed: drop to the LTF and trade the trendline zone.",
     "Stop at M15 once you have a zone."
    ]
   }
  ]
 },
 {
  "n": 103,
  "title": "Private session (Mar 13, 2026): Trade review - wait for the zone, two positions, news wicks and the 4th trendline touch",
  "kind": "zoom",
  "summary": "A 49-minute review of your demo trades (0.01 lots, about 250 pips so far) and his Instagram calls on MT4. The lessons: wait for price to come to the zone, because rushed entries lose; a clean zone takes 5-7 candles to leave; on a correction trade, close or tighten once price crosses the location area's 50/25% lines; news first makes a wick that gets filled later; a trendline touched three times usually breaks on the 4th; and with two positions, close one when the H1 trendline crosses and keep the other's stop at the original zone, not at breakeven.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "Correction trades are fine, but close before the TP: take the location area and mark its 50% and 25% levels. Once price crosses that line, either move the stop up to the last LTF supply (H4 -> H1) and drop the TP, or close, because the market will now look for the other side.",
     "A clean zone with good departures takes time to leave (5-7 candles, with fake signals to shake people out). A small departure is 1-2 candles. Wait for the zone.",
     "Wait for the zone: price always retraces, it just takes time. If you rushed in, go to the LTF, close when its trendline crosses, and re-enter lower.",
     "Two small positions: close one in profit, hold the other, and re-enter if price comes back, so you never miss the entry.",
     "News rule: a fundamental event first makes a wick (imbalance) and forex investors fill it later. Old glitch wicks were filled too.",
     "A trendline touched three times usually breaks on the 4th. After the trendline cross and a zone break, sell from fresh H4/H1 zones.",
     "Direct (market) entries: the stop goes at the zone (below the demand); the risk is acceptable because you are buying near the proximal line. In MT4 you can drag the order line to create the stop or the TP.",
     "Two positions, the follow-up: close one when the H1 trendline crosses and the opposite zones break, and re-enter on the retest. Keep the held one's stop at the original HTF/daily zone, not at breakeven (breakeven gets hunted). As price forms new fresh H4 zones and CPs, move it there; near the TP move it behind the last demand.",
     "A stop-hunt wick below a zone (ETH) is not a break: no trade until a clear full break."
    ]
   },
   {
    "heading": "Pairs reviewed",
    "points": [
     "AUDJPY (likely): your sell from the daily targeting the daily demand, plus a short on the correction.",
     "GBPJPY / AUDJPY (his Instagram post): the monthly zone broke, so a wow trade started; the next HTF zone is far, so about 250 more pips are likely. The weekly may retrace first; the correction length tends to repeat (measured move).",
     "EURUSD monthly: sell. A single long-wick candle (doji / pin bar) will likely be broken; the weekly demand will likely break (big gap), then short on the daily. Once price crosses it, the next demand becomes strong and you trade it inside the trendline.",
     "GBPJPY weekly: the supply is weak (it did not break the demand); the daily one was strong. If price comes back you get a trade; otherwise let it break and buy the new fresh demand. The current demand is not strong, so confirmation only. Later: the daily zone is about to break, then the weekly becomes a very good zone.",
     "USDCNH (likely): demand weak, meshing inside the trendline; in future it should boost up sharply (his view).",
     "Crude oil: your H4 buy near the trendline. Oil must break the weak zone above (meshing now); overall bias up.",
     "GBPAUD monthly: no strong zones, all weak; the next zone below will be hard to break (tap, fresh supply, then break).",
     "EURGBP: technically should rise from the strong area; the H1 trendline crossed with a long candle, so wait for the M15/M30 cross and buy directly.",
     "UK100: sell, the demand below is weak. US30: monthly/weekly/daily zones are weak, CP levels without a zone break. AUDCAD: monthly strong area, wait for the wow trade."
    ]
   },
   {
    "heading": "Other questions",
    "points": [
     "Exness and Pepperstone show different candles; spread spikes hunt tight stops. Put the stop a few pips further and use a smaller size.",
     "Bots: he prefers manual trading. Prop firms: practise first and check the firm is trustworthy."
    ]
   }
  ],
  "rules": [
   "Wait for price to come to the zone; never rush the entry.",
   "On correction trades, tighten or close once price crosses the location area's 50/25% line.",
   "A trendline touched three times usually breaks on the 4th.",
   "News makes a wick first; expect it to be filled.",
   "Two positions: close one at the H1 trendline cross; the held one's stop stays at the zone, not breakeven."
  ],
  "mistakes": [
   "Entering before price reaches the zone (oil).",
   "Moving the held position's stop to breakeven.",
   "Treating a stop-hunt wick as a zone break.",
   "Placing the stop far too wide or the TP beyond the wick."
  ],
  "quotes": [
   "The market always retraces; it just takes time.",
   "Breakeven gets hunted."
  ],
  "diagrams": [],
  "checklist": [
   "Has price actually reached my zone?",
   "Is this a correction trade? Where are the 50% and 25% lines?",
   "How many times has the trendline been touched?",
   "Was there news? Is there a wick to be filled?",
   "Two positions: which one closes at the H1 trendline cross?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "trade-review",
   "two-positions",
   "news-wick",
   "trendline-touch",
   "patience"
  ],
  "newVsPdfs": [
   "Correction trades managed with the location area's 50%/25% lines.",
   "News wick rule: the event prints a wick that investors fill later.",
   "Held position's stop stays at the original zone instead of breakeven."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-03-13/f-003_t02m01s.jpg",
    "caption": "[02:01] AUDJPY daily: zones along the rising trendline",
    "notes": [
     "Your sell from the daily targeted the daily demand.",
     "A correction short is fine, but close before the TP."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-13/f-013_t09m55s.jpg",
    "caption": "[09:55] EURUSD daily: the drop and the levels marked below",
    "notes": [
     "Monthly sell; the weekly demand will likely break.",
     "Then the next demand becomes strong."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-13/f-018_t15m25s.jpg",
    "caption": "[15:25] SpotCrude monthly: the long spike after the news",
    "notes": [
     "A fundamental event makes a wick first.",
     "Investors fill it later."
    ]
   }
  ]
 },
 {
  "n": 104,
  "title": "Private session (Mar 27, 2026): Live review - flip zones, P vs CP, wick fills and the three blind-entry places",
  "kind": "zoom",
  "summary": "A 34-minute live review, pair by pair (gold, ETHUSD, the JPY crosses, AUDNZD, USDPLN, SGDJPY, GBPMXN, silver, NAS100). He explains flip zones (the previous higher low revisited each leg), when to prefer the P (peak/valley) over a CP next to it, keeps repeating that the market prefers the zone nearest the trendline, tells you not to place your stop near the trendline when the base is big, and lists the only three places for a blind entry: a wow trade, a fresh arrival zone, and a zone near the trendline that has not been tapped a 4th time.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "Flip zone: the market makes a higher low, and the previous higher-low area gets revisited each leg (resistance becomes support and back). On a clean chart it keeps hitting the same zone. If there is no zone at the flip, use confirmation; the LTF gives a zone at the next one.",
     "Stops: below H4/daily zones keep the stop 10-15 pips beyond the zone. Do not put it near the trendline when the base is big (your AUDJPY/CHFJPY stop was hit for that reason).",
     "P vs CP: if a CP sits right next to the P (peak/valley) with no gap, prefer the P; if the CP formed below with a gap, always use the CP.",
     "The market prefers the zone nearest the trendline; to reach a further one it must make another candle across. A new supply forming near the trendline gets hit, not the far upper one.",
     "Out of trendline: when the market goes out of the trendline, makes a demand and respects it, that demand is still a weak zone.",
     "The three blind-entry places: a wow trade, a fresh arrival zone, and a zone near the trendline that has not been tapped a 4th time. They are rare; an HTF wow trade has a high chance of being respected.",
     "A 'dusty' (congested) zone that meshes for hours is not tradable on the HTF; a sell is clear only on the LTF, with limited pips.",
     "Correlation: USD-base pairs rising while USD-quote pairs fall is correlation (he will send a sheet). Gold no longer moves inversely to JPY; it moves against the dollar index on the LTF.",
     "For a new trend, wait for the demand first; when price goes up, the zone and the new trendline form automatically."
    ]
   },
   {
    "heading": "Pairs reviewed",
    "points": [
     "Gold H4: still under the trendline, so it can drop any time and will fill the wick. It will not go straight to the upper supply: it taps the middle one, traps entries, then drops (around the 3,300 area, likely).",
     "ETHUSD (the transcript says 'Euro'; the chart is ETHUSD): structure broken and two opposite zones removed on the LTF, about 700 pips. If this weak demand breaks too, sell from the supply under the trendline.",
     "CHFJPY: monthly up, weekly demand tested again; congested and meshing, sell only on the LTF. CADJPY H4: trendline crossed, reached the weekly arrival zone (likely), try selling. GBPJPY: meshing for hours, wait for the break, then a long-term short.",
     "AUDNZD H4: structure and trendline broken; it comes down then goes up. Buy if the structure breaks up; if the demand breaks, sell. It did not touch the flip zone you expected: a new zone formed nearer the trendline.",
     "USDPLN daily: started a flip area, so direction changed on this timeframe (USD pairs up). Flip-area trades are confirmation only unless the zone is strong and clear.",
     "SGDJPY: rising while the other JPY pairs drop; monthly/weekly up, a valid daily demand already triggered, nothing on H4.",
     "GBPMXN daily: structure almost broken at the last HTF supply; on a close above it he would close his own long-term sell and expect a new trendline.",
     "Silver daily: monthly up, a great weekly trendline; let it fill down to the 59-60 area first. Once the trendline breaks there is no strong zone until about 110 (his view).",
     "NAS100: straight down; it always pulls back on the daily, so the entry will not be missed."
    ]
   }
  ],
  "rules": [
   "Prefer the P over a CP right next to it; use the CP when it formed below with a gap.",
   "The market prefers the zone nearest the trendline.",
   "Blind entries only at: a wow trade, a fresh arrival zone, a near-trendline zone not tapped a 4th time.",
   "Stops 10-15 pips beyond H4/daily zones, not at the trendline.",
   "Flip area without a clean zone = confirmation only."
  ],
  "mistakes": [
   "Stop placed near the trendline when the base was big.",
   "Expecting price to reach a far flip zone instead of the zone nearest the trendline.",
   "Trading a congested zone that has meshed for hours."
  ],
  "quotes": [
   "The market prefers the zone nearest the trendline.",
   "If there is no zone at the flip, use confirmation."
  ],
  "diagrams": [],
  "checklist": [
   "Is this one of the three blind-entry places? If not, confirmation.",
   "P or CP: is there a gap between them?",
   "Which zone is nearest the trendline?",
   "Is my stop 10-15 pips beyond the zone, away from the trendline?",
   "Is the pair meshing or congested?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "live-review",
   "flip-zone",
   "p-vs-cp",
   "nearest-trendline",
   "blind-entry",
   "wick-fill"
  ],
  "newVsPdfs": [
   "P vs CP tie-breaker (no gap: P; gap: CP).",
   "The three blind-entry places.",
   "Flip zone explained as the previous higher low revisited each leg."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-03-27/f-011_t08m30s.jpg",
    "caption": "[08:30] AUDNZD H4: structure and trendline broken, demand box below",
    "notes": [
     "Buy if the structure breaks up; if the demand breaks, sell.",
     "A new zone forms nearer the trendline instead of the far flip."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-27/f-031_t25m18s.jpg",
    "caption": "[25:18] GBPMXN daily: the last HTF supply box and the rising line from the low",
    "notes": [
     "Structure almost broken.",
     "A close above the supply would end his long-term sell."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-03-27/f-044_t31m55s.jpg",
    "caption": "[31:55] NAS100 daily: the new supply forming near the descending trendline",
    "notes": [
     "The market hits the zone near the trendline, not the far upper one.",
     "It always pulls back, so the entry will not be missed."
    ]
   }
  ]
 },
 {
  "n": 105,
  "title": "Private session (Apr 7, 2026): Analysis review - realigning timeframes, long-wick fills and two kinds of confirmation",
  "kind": "zoom",
  "summary": "A 52-minute analysis session: he starts on his MT4 (NAS100, gold, silver, USDJPY, oil) and then reviews your TradingView analysis (AUDCAD, AUDCHF, AUDJPY, EURUSD, AUDNZD, CADJPY). Main points: a new zone out of the trendline is not usable, while an M30 zone that removed the opposite zone inside the trendline is; when an H1 and an M30 zone are the same area the market is realigning; after a sharp move into an HTF zone the market leaves a long wick, retraces, then fills it, so trade the fill; and there are two kinds of confirmation, the LTF trendline cross plus removal, or price closing back across the proximal line. He also tells you to keep XAUUSD off the low timeframes for now and use XAUAUD.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "Weak zones sometimes reverse too, but prefer the zone nearest the trendline; otherwise the market makes a new zone, breaks, and you use that one.",
     "A new demand that is out of the trendline is not usable. An M30 supply that removed the opposite zone and is still inside the trendline is usable, even set and forget (better on demo first). When the H1 and M30 zones are the same area, the market is simply realigning.",
     "A full departure candle must properly cross and close beyond the trendline before you consider buys; a long wick below may form a CP and a new trendline, but that would be an overlap zone.",
     "Supply and demand close together = the market is just imbalancing back and forth; buy only after a break (gold).",
     "Long wicks get filled first, then the market decides (silver H4).",
     "Two opposite zones removed = direction change; until then only sells or trailing (USDJPY), and wait for the daily confirmation before buying.",
     "Entering early out of emotion: however strong the imbalance, when price hits an HTF zone it makes a long wick, retraces, and later fills it. Trade the fill. You can place two entries, one closed short term and one held long term.",
     "Two kinds of confirmation: (1) the LTF trendline cross plus the opposite zone removed; (2) at a daily demand, price checks the location, comes back and crosses the proximal line upward: buy directly with the stop below the zone (the LTF has already changed direction). If you can sit at the screen you will not miss the trade.",
     "No HTF zone: go to the LTF and follow the trendline the candles respect. Normally go daily -> H4 for the last demand; if H4 has nothing, go to H1. A fake trendline cross with no departure is weak.",
     "Each broker's server time shapes the candles differently: trade on your own broker's chart.",
     "Precise entries (like a student in the group): sit at the screen, wait for a zone to break (wow trade), then buy the LTF zone that forms on the pullback. On the LTF do not over-prefer CPs; use the broken higher high and buy its return (support/resistance style).",
     "Markets: S&D works on any market, including Indian stocks, but do not go below the daily on stocks. USDTRY is HTF only. XAUUSD fakes a lot on the LTF (high spread, now tied to oil and war news); use XAUAUD for LTF gold. All US indices follow Nasdaq."
    ]
   },
   {
    "heading": "Charts reviewed",
    "points": [
     "NAS100 H1: already reached the supply; it will tap, retrace a little and leave a long wick. That supply is not strong: overlap-type, still inside the demand level and under the trendline. A proper close above the trendline would bring the upper zone into play.",
     "Oil: inside supply after a news jump; the daily zone is still valid (the supply broke on the zoom-in). A good buy zone if it reverses; otherwise it makes a CP.",
     "AUDCAD 3-month/monthly (your chart): the trendline was crossed only slightly. The supply is strong because it broke the demand, and this CP removed the previous two supplies; wait for the forming supply to break before the CP/demand becomes valid. On the daily it is meshing: a break of the demand means sell, a break of the other side buy.",
     "AUDCHF H4 (the transcript says 'Swiss franc'; the chart is AUDCHF): you marked the supply nearest the trendline, which is correct; wait for an LTF trendline cross. On H1/M30 a demand with a supply above leaves buy pips; a buy limit there gives about 1:4 (likely).",
     "AUDJPY weekly: trendline crossed but the demand not broken; one zone gone, and if the second breaks it goes short; otherwise buy on the LTF.",
     "EURUSD daily: zone tested twice, so confirmation: go to H1, let the big H1 structure break and sell when it drops. Keep the set-and-forget order you already placed; it may mesh a bit first.",
     "AUDNZD H4/daily: the right buying area, now going up. H4 showed a fake trendline cross with no departure (weak); on M15 the war conditions mean stop hunts, so let a new zone form.",
     "Daily CP on a descending trendline sitting on an old demand: overlap, weak. You said that is exactly where your mistakes come from.",
     "CADJPY: realigning with demand; monthly strong zone, weekly supply. Wait for the daily confirmation under the trendline. EURGBP: in supply, no buys until it breaks."
    ]
   }
  ],
  "rules": [
   "A zone out of the trendline is not usable; one that removed the opposite zone inside the trendline is.",
   "When the H1 and M30 zones coincide, the market is realigning.",
   "After a sharp move into an HTF zone, wait for the long wick and trade the fill.",
   "Confirmation = LTF trendline cross + removal, or a close back across the proximal line.",
   "No HTF zone: go to the LTF and follow the trendline the candles respect.",
   "Trade on your own broker's chart."
  ],
  "mistakes": [
   "Entering early before the wick fill.",
   "Trading an overlap CP on a descending trendline.",
   "Trading XAUUSD on the low timeframes in news-driven conditions.",
   "Using a new zone that is out of the trendline."
  ],
  "quotes": [
   "However strong the imbalance, when it hits a high time frame zone it makes a long wick and later fills it.",
   "If there is no high time frame zone, go to the low time frame and follow the trendline."
  ],
  "diagrams": [],
  "checklist": [
   "Is the zone inside the trendline and did it remove the opposite zone?",
   "Do the H1 and M30 zones coincide (realignment)?",
   "Has the long wick formed? Am I trading the fill?",
   "Which confirmation am I using: LTF cross or proximal-line close?",
   "Is this an overlap zone?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "analysis-review",
   "realignment",
   "wick-fill",
   "confirmation",
   "overlap",
   "xauaud"
  ],
  "newVsPdfs": [
   "Second confirmation type: a close back across the proximal line, without going to a lower timeframe.",
   "H1 and M30 zones coinciding = realignment.",
   "Long-wick fill as the entry after a sharp move into an HTF zone."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-04-07-analysis/f-003_t01m30s.jpg",
    "caption": "[01:30] NAS100 H1: the supply box at the top and the demand box below the rising trendline",
    "notes": [
     "Overlap-type supply, still inside the demand level.",
     "A proper close above the trendline brings the upper zone into play."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-04-07-analysis/f-015_t10m05s.jpg",
    "caption": "[10:05] AUDCAD 3-month chart (TradingView): the long descending trendline crossed slightly, the rising line below",
    "notes": [
     "Wait for the forming supply to break.",
     "The CP that removed the previous two supplies becomes valid only then."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-04-07-analysis/f-020_t15m20s.jpg",
    "caption": "[15:20] AUDCHF H4 (TradingView): the demand zones and the trendlines you drew",
    "notes": [
     "The zone nearest the trendline is the right one.",
     "On H1/M30 a demand with a supply above leaves buy pips."
    ]
   }
  ]
 },
 {
  "n": 106,
  "title": "Private session (Apr 30, 2026): Analysis review - full-candle breaks, overlap zones, booking half and stocks",
  "kind": "zoom",
  "summary": "A 46-minute review of your TradingView charts (AUDJPY, GBPJPY, AUDCAD, SoFi, Disney, Alibaba) after a look at his MT5 (NAS100/US30, oil, BTC). A level counts as broken only when a full candle closes through it; in news the market respects valleys while CP and PCP levels get blown through; a flip zone needs a prior trendline cross; overlap zones are confirmation only; an LTF entry always targets the HTF zone, with half booked early and the rest run with the stop locked; and confirmation can be taken without a lower timeframe by waiting for price to cross back over the proximal line.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "Broken means a full candle closing through the level; a big candle closing above says it can go up. Until then, wait.",
     "Strong zones take time to break; a weekly demand can be a good buy-limit zone even if the market is not testing it, while the daily keeps building continuation CPs (NAS100/US30).",
     "During news the market mostly respects valleys; CP and PCP levels get blown through.",
     "Flip zone: only if the trendline had been crossed and price dropped first. Until then the zone is simply the one price can drop from.",
     "First exit: an LTF entry always targets the HTF zone (H1 entry, daily target). Lock the stop into profit as new zones form. Booking 50% and running the rest is right; he takes two positions per zone, one closed at the near target and one held.",
     "An overlap zone ahead: the market will likely take the liquidity and drop; overlap zones only with confirmation (an LTF trendline cross).",
     "A fresh strong zone on a correction: the first time a correction trade is fine; the second time the market tries hard to break it.",
     "Which valley to use: the one where the move restarted, with the previous demand. A zone above an ascending trendline gets respected. A zone retested 2-3 times is weak and may break even on the first drop.",
     "Direction change and targets: if support breaks, wait for the first supply and demand to break (two opposite zones = direction change), then go to H4 for the next zone; first TP there, then the daily target.",
     "Do not put the TP right at a supply; close before it, because sometimes the market makes a new valley/peak and turns. When a new CP forms, move the stop there.",
     "Confirmation without the LTF: let price come to the proximal line; when it rotates and crosses back over it, enter (for a sell: no sell limit, take the entry after it crosses back down). Slightly bigger stop, much safer.",
     "Volume profile: fine if it helps you; he only reads long wicks and long candles as low volume / fast moves. A demand inside a proper zone acts as a magnet.",
     "Keep the chart clean: with too many lines you cannot read the candles. Stock entries 10-15 points below the line, depending on the spread (likely)."
    ]
   },
   {
    "heading": "Charts reviewed",
    "points": [
     "Oil: the monthly supply broke, so it will not stop easily; the only valid zone is the daily one (H4 shows the same area). Brent is still inside supply and should come down to the demand, but strong zones take time.",
     "BTC/ETH: trendline with a zone below; if crossed, ETH could go to about 1,500 USD (likely). For now good support.",
     "AUDJPY (your trade): a correction trade from the weekly demand after confirmation, about 400 pips, and a second entry on the trendline cross. On the LTF just keep a stop above the high.",
     "GBPJPY: another student bought the H4 demand; it hit exactly that demand and then dropped on news. It tapped and left a wick, so GJ will likely fill the wick: a good second entry. Monthly and weekly are still buy (trendline not crossed); this is a correction.",
     "EURUSD / GBPUSD: still inside supply, out of trendline: let price come and take a sell confirmation; at a peak a drop is likely.",
     "AUDCAD: crossed, two zones broken; the CP there is an overlap, so not a tradable zone; confirmation on M15.",
     "SoFi (your stock): the area in the way is not strong (out of trendline, tapped once), so it will break. Disney: bounced off the monthly demand; let it drop more before buying. Your other target sits under a supply that did not remove the previous zone, so the second visit should remove it.",
     "Alibaba monthly: removed the previous zone the first time, so it looks bullish; above the trendline, a good zone; meshing now, likely up."
    ]
   }
  ],
  "rules": [
   "A level is broken only by a full candle close through it.",
   "News: valleys hold; CP/PCP levels get blown through.",
   "No flip zone without a prior trendline cross.",
   "LTF entry -> HTF target; book half, lock the stop on the rest.",
   "Overlap zones: confirmation only.",
   "TP before the supply, not at it."
  ],
  "mistakes": [
   "Calling a flip zone before the trendline has been crossed.",
   "Trading an overlap CP without confirmation.",
   "Putting the TP exactly at the supply.",
   "A chart cluttered with lines."
  ],
  "quotes": [
   "We trade zone to zone.",
   "Low time frame entry, the target is always the high time frame zone."
  ],
  "diagrams": [],
  "checklist": [
   "Did a full candle close through the level?",
   "Is news due? (valleys hold, CPs fail)",
   "Has the trendline been crossed before I call this a flip?",
   "Is the zone ahead an overlap?",
   "Where is the HTF target? Half booked, stop locked?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "analysis-review",
   "full-candle-break",
   "overlap",
   "partial-profit",
   "stocks",
   "news"
  ],
  "newVsPdfs": [
   "News behaviour: valleys hold while CP/PCP levels get blown through.",
   "A flip zone exists only after a trendline cross.",
   "Confirmation by a close back across the proximal line, with no lower timeframe."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-04-30-analysis/f-003_t01m19s.jpg",
    "caption": "[01:19] BTCUSD daily: a box at the descending trendline",
    "notes": [
     "Trendline with a zone below: good support for now.",
     "A cross of the trendline would change the picture."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-04-30-analysis/f-033_t22m53s.jpg",
    "caption": "[22:53] AUDCAD H4 (TradingView): the zones and lines on your chart",
    "notes": [
     "Crossed, two zones broken; the CP here is an overlap.",
     "Not tradable without an M15 confirmation."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-04-30-analysis/f-048_t41m24s.jpg",
    "caption": "[41:24] Alibaba weekly (TradingView): the demand area above the trendline",
    "notes": [
     "It removed the previous zone the first time: bullish.",
     "Meshing now; likely up."
    ]
   }
  ]
 },
 {
  "n": 107,
  "title": "Private session (Jun 25, 2026): Trade review - limit orders near the trendline, trailing with two positions and leaving gold",
  "kind": "zoom",
  "summary": "A 49-minute review: Raja's MT5 first (gold, GBPJPY, EURUSD), then your pending orders and swing trades (GBPAUD, EURSGD, GBPCAD, CHFSGD, Solana, NAS100, soybeans, USDCHF, the dollar index, stocks). He approves limit orders placed on strong zones near the trendline, says a zone 25-30 pips away from the trendline often breaks, a trendline tested 3-5 times is very weak, a trendline crossed only by a wick does not count unless price closes back inside the departure, and gives a missed-entry formula. On management: two positions, close one at the trendline cross, trail the other on H1 once the H1 trendline has been tested 4-5 times, and stop trading gold on the low timeframes.",
  "sections": [
   {
    "heading": "What he taught",
    "points": [
     "Use the zone near the trendline; if the market keeps meshing around a supply, trade it only on confirmation. Wait for the H4/daily confirmation, then take it on M15 once it crosses.",
     "A trendline tested 3, 4, 5 times is very weak: direction can change any time, so wait for a new valley and use it.",
     "The best zone sits just above the trendline (for a demand); a zone 25-30 pips off the trendline often gets broken when price comes to hit the trendline.",
     "Long base or wick candles: look for location at long wicks, the market tries to fill them. The market often crosses the trendline with a wick only; do not worry unless it closes inside the departure.",
     "Missed-entry formula: if price starts dropping early and breaks its LTF trendline, sell directly; the stop is close.",
     "If a strong zone's trendline gets crossed, the setup is not invalid; it becomes a confirmation trade (NAS100).",
     "Draw the new trendline only after the new low has formed. A long wick often means continuation, maybe with a retrace on the next candle.",
     "Gaps are rare on Pepperstone, but when they appear the market fills them.",
     "Holding a swing: if the target is not reached by next week, go to the LTF and trail. Big news can hit at the weekly open, so lock profit before the weekend. On H4 you give back profit; once the H1 trendline has been tested 4-5 times, move the stop to H1. Two small positions: close one at the trendline cross, keep one, re-add in the zone.",
     "With HTF swings you sometimes wait a week; watching 6-7 such pairs at a time gives 3-4 profitable trades.",
     "Do not trade only gold: XAUUSD is full of fake signals from small traders. He trades XAUAUD for cleaner moves. On the LTF about 90% of moves fake; the HTF needs big fundamental news to hunt stops.",
     "After a big candle beyond the departure, wait for a long-wick retrace and buy directly on the LTF; the market fills the wick (more next session)."
    ]
   },
   {
    "heading": "Charts reviewed",
    "points": [
     "Gold weekly: a normal retracement; the monthly zone is far below, the weekly fresh area about 3,600 (likely) at a CP level is where to close sells. The daily made a new zone near the trendline without crossing it, so he expects a fresh sell from there.",
     "GBPJPY daily: an ideal buy area near the trendline, but no realignment yet; it must break this level and that zone first. He has not given anyone a buy (too risky).",
     "A weekly demand that was strong has been tapped: if it breaks, sell (EURUSD and GBP dropping); if you are in a buy, close it there because the second attempt is the break.",
     "Your GBPAUD buy limit (likely GBPAUD): a clear, perfect buy area; he would place it there too; it may bounce, so use confirmation. Your EURSGD sell limit on the H4 strong area near the trendline: correct; SGD follows USD, so when EURUSD sells from the daily, sell this too. GBPCAD: the daily area is right. CHFSGD: placed after it broke two 'walls' (demands): good.",
     "Solana: down confirmed; the nearest supply is the next short. This demand is weak (a fake signal): its job was to remove the inheritance zone, and the overlap zone is already gone, so it likely goes lower; a CP should form on M15/M5 to drop from.",
     "NAS100: your sell limit on the H4 strong zone that removed two demands; price not there yet.",
     "Soybeans monthly: your planned daily buy had too few pips. On the HTF the demand is broken and a strong supply sits near the trendline: a sell limit there pays well if it goes into impulse.",
     "USDCHF: crossed all supplies; the lower daily demand near the trendline is more likely; confirmation on H4 or a limit on the lower one. The dollar index the same: use the lower daily zone near the trendline for the buy.",
     "Your earlier analysis with no location (impulse and correction will chop, then drop): move the zone a bit higher; even if broken, it drops from there.",
     "Stocks (OKLO, SEZL weekly): demand tested once, second tap as the retracement entry; you took TP1 at the supply, closed half, and are running the rest to TP2. Good: focus on the HTF and trade with its direction.",
     "GBPSEK: daily demand, impulse and correction; the weekly is at a higher low and correcting toward the demand. A new zone near the trendline on the daily: wait for the retracement."
    ]
   }
  ],
  "rules": [
   "Limit orders on strong zones near the trendline; a zone 25-30 pips away often breaks.",
   "A trendline tested 3-5 times is very weak; wait for a new valley.",
   "A wick-only trendline cross does not count unless price closes back inside the departure.",
   "Missed entry: on an early LTF trendline break, enter directly with a close stop.",
   "Trail on H1 once the H1 trendline has been tested 4-5 times; close one of two positions at the trendline cross.",
   "No XAUUSD on the low timeframes; use XAUAUD."
  ],
  "mistakes": [
   "Trading only gold.",
   "Rushing gold entries on the low timeframes (stops hunted).",
   "Planning a trade with too few pips when the HTF offers a bigger setup.",
   "Going into the weekend without locking profit."
  ],
  "quotes": [
   "If the trendline gets crossed it is not invalid; it becomes a confirmation trade.",
   "Trade what is clear."
  ],
  "diagrams": [],
  "checklist": [
   "Is my zone right at the trendline (not 25-30 pips away)?",
   "How many times has the trendline been tested?",
   "Did price close back inside the departure, or was it only a wick?",
   "Two positions? Which one closes at the trendline cross?",
   "Is it the weekend? Profit locked?"
  ],
  "journalTags": [
   "raja",
   "private-session",
   "trade-review",
   "limit-orders",
   "trailing-stop",
   "two-positions",
   "gold",
   "stocks"
  ],
  "newVsPdfs": [
   "Zone distance from the trendline: 25-30 pips away tends to break.",
   "A wick-only trendline cross is ignored unless price closes inside the departure.",
   "Trailing switch: move to H1 once its trendline has been tested 4-5 times."
  ],
  "images": [
   {
    "src": "/lessons/raja_hi/private/2026-06-25/f-004_t02m24s.jpg",
    "caption": "[02:24] XAUUSD weekly: the big rally and the current retracement",
    "notes": [
     "A normal weekly retracement.",
     "The weekly fresh area near a CP level is where to close sells."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-06-25/f-007_t07m05s.jpg",
    "caption": "[07:05] GBPJPY daily: the box near the rising trendline",
    "notes": [
     "Ideal buy area, but no realignment yet.",
     "It must break this level and that zone first."
    ]
   },
   {
    "src": "/lessons/raja_hi/private/2026-06-25/f-042_t29m58s.jpg",
    "caption": "[29:58] GBPUSD weekly (TradingView): the very strong supply above and the daily supply",
    "notes": [
     "Dropped after the entry, now in demand.",
     "A small USD retrace, then down."
    ]
   }
  ]
 }
];
