// Raja (mentor) part B: lessons written from auto-transcripts of his sessions.
// Mis-transcribed terms were inferred; uncertain readings are marked (likely).
import type { VideoLesson } from '@/core/videoLessons';

export const RAJA_PARTB: VideoLesson[] = [
 {
  "n": 50,
  "title": "Wow Trade (Topic 6): trading the pips between zones",
  "kind": "video",
  "summary": "Raja's 'wow trade' is the open run of pips between one zone and the next. Two versions: (1) a zone removes the nearest opposite zone, so price is drawn to the next zone of that type; (2) price breaks a lower-timeframe trendline, so the area from the break to the next opposite zone is a wow trade area traded on the lower timeframe. A wow trade can come in two parts, from the first zone to the second. He never sells while price still sits in a demand (or buys in a supply): first that zone must be removed by a candle close.",
  "sections": [
   {
    "heading": "Version 1: zone to zone (\"extension of pips\")",
    "points": [
     "Example: two supply levels, supply #1 above and supply #2 below. A demand forms underneath and its rally removes supply #2.",
     "Because the market already removed that supply, the next target is supply #1. Price may come back and retest the demand first, or go straight to supply #1 without a retest.",
     "The room between supply #2 and supply #1 is the wow trade area; he also calls it the 'extension of pips'.",
     "The same works downwards: if price removes the first demand it will go to the second demand. From the first demand to the second is the wow trade area."
    ]
   },
   {
    "heading": "Version 2: a lower-timeframe trendline break",
    "points": [
     "Example: demands #1 and #2 below and an ascending trendline. When price crosses the ascending trendline, the area from there down to the next zone is a wow trade: there is no zone in between to stop it, so you can sell on the lower timeframe.",
     "The cross has to be proper: a big candle (he says an 'OCL' candle, likely a full-bodied open-to-close candle) closing beyond the trendline. A line that is only touched or barely crossed does not count; price is still 'meshing' (chopping) there.",
     "If price then also removes demand #1, the run from demand #1 to demand #2 is the second wow trade area. He splits it into part 1 and part 2.",
     "In the lower timeframe price still makes 'ups and downs' (retracements, fake signals) inside the wow trade area, but overall it travels to fill the area and hit the next zone.",
     "Where a different (older or steeper) trendline is involved, its cross starts a new wow trade with the next zone as target; a market that retests a line once and breaks it on the second attempt then targets the previous trendline area (likely)."
    ]
   },
   {
    "heading": "Do not trade into an opposite zone",
    "points": [
     "If the trendline is crossed but price is already sitting in a demand, do not sell yet. Wait for the market to remove that demand (or to reach a supply), then sell on the lower timeframe 'without any hesitation'.",
     "If price is still far above the demand when the trendline breaks, you can sell straight away on the lower timeframe because the demand is far.",
     "Buying works the same way: while price still follows a descending trendline you cannot buy; let it cross the trendline first.",
     "When an opposite zone sits near the trendline, the zone matters more than the trendline: focus on the zone and let it be removed first.",
     "A demand already retested once or twice is a weak area: buying there needs the confirmation rule."
    ]
   },
   {
    "heading": "When is a zone 'removed'?",
    "points": [
     "A zone is removed when a candle closes beyond it (for a demand: a candle closes below it, then the next candle confirms by continuing).",
     "A spike that only hits the stop losses with a wick and reverses back is a fake signal. He sees this mostly on Fridays because of low volume.",
     "News-driven markets (he mentions COVID headlines) also produce these fakes, so he waits for the proper removal before selling."
    ]
   },
   {
    "heading": "Timeframes and choosing pairs",
    "points": [
     "Monthly and weekly analysis is for direction, not a promise that price hits a level. It tells you in which direction to look for strong zones on the daily and lower timeframes.",
     "Daily supply and demand levels can be traded on their own; you do not have to go to the monthly every time.",
     "Inside a wow trade, H4 or H1 entries are fine if risk management is proper.",
     "Measure the pips in the wow trade area (his examples: about 370 pips for part 1 and about 1,200 pips for part 2 on EURUSD; a very large run on EURMXN). If there are only about 100 pips to the next resistance, the trade is not worth it: choose pairs that show good pips.",
     "Order of checks in his words: first the trendline, then the zone (fresh zones)."
    ]
   },
   {
    "heading": "Managing a two-part wow trade",
    "points": [
     "If you sold at the top and your target was the end of part 1, close there.",
     "If you held, move your stop loss down. If the market then removes the next zone, you can sell again for part 2; otherwise you keep the old position and close it at the first target.",
     "The take profit is the next zone along the straight line of the trend."
    ]
   }
  ],
  "rules": [
   "A zone that removes the nearest opposite zone makes the next zone of that type the target; the pips between them are the wow trade area.",
   "On the lower timeframe, a proper trendline cross (a big candle closing beyond it) starts a wow trade from the break to the next opposite zone.",
   "Never sell while price sits in a demand, or buy while it sits in a supply: wait until that zone is removed (or price reaches the opposite zone).",
   "A zone counts as removed only by a candle close beyond it; a wick through it is a fake signal.",
   "Use monthly / weekly for direction only; take entries on the daily and lower timeframes.",
   "If an opposite zone sits near the trendline, the zone has priority over the trendline.",
   "Skip setups with little room to the next zone; choose pairs with good pips.",
   "Part 2 of a wow trade starts only when the zone at the end of part 1 is removed."
  ],
  "mistakes": [
   "Selling right after a trendline break while price is already inside a demand.",
   "Treating a wick through a zone (often on a low-volume Friday) as a removal.",
   "Calling a trendline broken when price is still 'meshing' around it without a full-bodied close.",
   "Reading a monthly / weekly level as a guaranteed target instead of a direction.",
   "Buying a demand that has already been retested twice without confirmation.",
   "Taking a trade with only ~100 pips to the next resistance."
  ],
  "quotes": [
   "When market crosses the trend line, we can say the wow trade can start.",
   "Let the market remove this demand, then we can sell.",
   "Remove the demand or hit the supply."
  ],
  "diagrams": [],
  "figures": [
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r50aa' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r50ag' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Wow trade: from one zone to the next</text><rect x='52' y='52' width='568' height='20' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='614' y='66.0' fill='#ef4444' font-size='11' text-anchor='end'>Supply #1 (next target)</text><rect x='160' y='151' width='460' height='19' fill='#ef444422' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='5 4' opacity='0.6'/><text x='614' y='164.5' fill='#ef4444' font-size='11' text-anchor='end'>Supply #2 (removed)</text><rect x='286' y='278' width='334' height='18' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='291.0' fill='#22c55e' font-size='11' text-anchor='end'>Demand that removed supply #2</text><rect x='480' y='73' width='140' height='77' fill='#f59e0b1a' stroke='#f59e0b' stroke-dasharray='6 4' stroke-width='1.2'/><text x='550' y='108' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>WOW TRADE AREA</text><text x='550' y='124' fill='#f59e0b' font-size='11' text-anchor='middle'>\"extension of pips\"</text><line x1='60' y1='57' x2='60' y2='65' stroke='#ef4444' stroke-width='1.5'/><rect x='54.5' y='60' width='11' height='2' fill='#ef4444' rx='1'/><line x1='78' y1='57' x2='78' y2='69' stroke='#ef4444' stroke-width='1.5'/><rect x='72.5' y='62' width='11' height='2' fill='#ef4444' rx='1'/><line x1='96' y1='54' x2='96' y2='71' stroke='#22c55e' stroke-width='1.5'/><rect x='90.5' y='61' width='11' height='3' fill='#22c55e' rx='1'/><line x1='114' y1='58' x2='114' y2='93' stroke='#ef4444' stroke-width='1.5'/><rect x='108.5' y='61' width='11' height='29' fill='#ef4444' rx='1'/><line x1='132' y1='85' x2='132' y2='125' stroke='#ef4444' stroke-width='1.5'/><rect x='126.5' y='90' width='11' height='30' fill='#ef4444' rx='1'/><line x1='150' y1='113' x2='150' y2='152' stroke='#ef4444' stroke-width='1.5'/><rect x='144.5' y='120' width='11' height='25' fill='#ef4444' rx='1'/><line x1='168' y1='142' x2='168' y2='161' stroke='#ef4444' stroke-width='1.5'/><rect x='162.5' y='145' width='11' height='13' fill='#ef4444' rx='1'/><line x1='186' y1='153' x2='186' y2='168' stroke='#ef4444' stroke-width='1.5'/><rect x='180.5' y='158' width='11' height='5' fill='#ef4444' rx='1'/><line x1='204' y1='153' x2='204' y2='170' stroke='#22c55e' stroke-width='1.5'/><rect x='198.5' y='160' width='11' height='3' fill='#22c55e' rx='1'/><line x1='222' y1='157' x2='222' y2='193' stroke='#ef4444' stroke-width='1.5'/><rect x='216.5' y='160' width='11' height='30' fill='#ef4444' rx='1'/><line x1='240' y1='185' x2='240' y2='227' stroke='#ef4444' stroke-width='1.5'/><rect x='234.5' y='190' width='11' height='32' fill='#ef4444' rx='1'/><line x1='258' y1='215' x2='258' y2='259' stroke='#ef4444' stroke-width='1.5'/><rect x='252.5' y='222' width='11' height='30' fill='#ef4444' rx='1'/><line x1='276' y1='249' x2='276' y2='279' stroke='#ef4444' stroke-width='1.5'/><rect x='270.5' y='252' width='11' height='24' fill='#ef4444' rx='1'/><line x1='294' y1='271' x2='294' y2='289' stroke='#ef4444' stroke-width='1.5'/><rect x='288.5' y='276' width='11' height='8' fill='#ef4444' rx='1'/><line x1='312' y1='277' x2='312' y2='296' stroke='#ef4444' stroke-width='1.5'/><rect x='306.5' y='284' width='11' height='5' fill='#ef4444' rx='1'/><line x1='330' y1='282' x2='330' y2='292' stroke='#22c55e' stroke-width='1.5'/><rect x='324.5' y='285' width='11' height='4' fill='#22c55e' rx='1'/><line x1='348' y1='250' x2='348' y2='290' stroke='#22c55e' stroke-width='1.5'/><rect x='342.5' y='255' width='11' height='30' fill='#22c55e' rx='1'/><line x1='366' y1='208' x2='366' y2='262' stroke='#22c55e' stroke-width='1.5'/><rect x='360.5' y='215' width='11' height='40' fill='#22c55e' rx='1'/><line x1='384' y1='172' x2='384' y2='218' stroke='#22c55e' stroke-width='1.5'/><rect x='378.5' y='175' width='11' height='40' fill='#22c55e' rx='1'/><line x1='402' y1='135' x2='402' y2='180' stroke='#22c55e' stroke-width='1.5'/><rect x='396.5' y='140' width='11' height='35' fill='#22c55e' rx='1'/><line x1='420' y1='115' x2='420' y2='147' stroke='#22c55e' stroke-width='1.5'/><rect x='414.5' y='122' width='11' height='18' fill='#22c55e' rx='1'/><line x1='438' y1='99' x2='438' y2='125' stroke='#22c55e' stroke-width='1.5'/><rect x='432.5' y='102' width='11' height='20' fill='#22c55e' rx='1'/><line x1='456' y1='81' x2='456' y2='107' stroke='#22c55e' stroke-width='1.5'/><rect x='450.5' y='86' width='11' height='16' fill='#22c55e' rx='1'/><line x1='368' y1='136' x2='392' y2='140' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r50aa)'/><text x='364' y='126' fill='#f59e0b' font-size='11' text-anchor='end'>close above supply #2</text><text x='364' y='140' fill='#f59e0b' font-size='11' text-anchor='end'>= removed</text><text x='16' y='344' fill='#94a3b8' font-size='11' text-anchor='start'>Demand removes the nearer supply -&gt; price is drawn to the next supply. TP at its proximal.</text></svg>",
    "caption": "Version 1: the demand's rally closes above supply #2, so supply #1 becomes the target. The gap between them is the wow trade area ('extension of pips'), with the TP at supply #1's proximal line."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r50ba' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r50bg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Wow trade after a trendline break (two parts)</text><rect x='50' y='255' width='570' height='17' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='267.5' fill='#22c55e' font-size='11' text-anchor='end'>Demand #1</text><rect x='50' y='312' width='570' height='18' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='325.0' fill='#22c55e' font-size='11' text-anchor='end'>Demand #2</text><rect x='340' y='205' width='260' height='49' fill='#f59e0b1a' stroke='#f59e0b' stroke-dasharray='6 4' stroke-width='1.2'/><text x='520' y='230' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>PART 1</text><rect x='340' y='273' width='260' height='38' fill='#f59e0b1a' stroke='#f59e0b' stroke-dasharray='6 4' stroke-width='1.2'/><text x='520' y='290' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>PART 2</text><text x='520' y='246' fill='#f59e0b' font-size='10' text-anchor='middle'>sell on LTF to demand #1</text><text x='520' y='304' fill='#f59e0b' font-size='10' text-anchor='middle'>only after #1 is removed</text><line x1='110' y1='250.2' x2='470' y2='85.2' stroke='#a78bfa' stroke-width='1.8'/><text x='474' y='89.16666666666669' fill='#a78bfa' font-size='11' text-anchor='start'>ascending trendline</text><line x1='70' y1='249' x2='70' y2='265' stroke='#22c55e' stroke-width='1.5'/><rect x='64.0' y='252' width='12' height='10' fill='#22c55e' rx='1'/><line x1='90' y1='236' x2='90' y2='256' stroke='#22c55e' stroke-width='1.5'/><rect x='84.0' y='240' width='12' height='12' fill='#22c55e' rx='1'/><line x1='110' y1='223' x2='110' y2='243' stroke='#22c55e' stroke-width='1.5'/><rect x='104.0' y='226' width='12' height='14' fill='#22c55e' rx='1'/><line x1='130' y1='221' x2='130' y2='241' stroke='#ef4444' stroke-width='1.5'/><rect x='124.0' y='226' width='12' height='10' fill='#ef4444' rx='1'/><line x1='150' y1='211' x2='150' y2='239' stroke='#22c55e' stroke-width='1.5'/><rect x='144.0' y='214' width='12' height='22' fill='#22c55e' rx='1'/><line x1='170' y1='194' x2='170' y2='218' stroke='#22c55e' stroke-width='1.5'/><rect x='164.0' y='198' width='12' height='16' fill='#22c55e' rx='1'/><line x1='190' y1='194' x2='190' y2='212' stroke='#ef4444' stroke-width='1.5'/><rect x='184.0' y='198' width='12' height='10' fill='#ef4444' rx='1'/><line x1='210' y1='183' x2='210' y2='211' stroke='#22c55e' stroke-width='1.5'/><rect x='204.0' y='186' width='12' height='22' fill='#22c55e' rx='1'/><line x1='230' y1='168' x2='230' y2='190' stroke='#22c55e' stroke-width='1.5'/><rect x='224.0' y='172' width='12' height='14' fill='#22c55e' rx='1'/><line x1='250' y1='168' x2='250' y2='186' stroke='#ef4444' stroke-width='1.5'/><rect x='244.0' y='172' width='12' height='10' fill='#ef4444' rx='1'/><line x1='270' y1='159' x2='270' y2='185' stroke='#22c55e' stroke-width='1.5'/><rect x='264.0' y='162' width='12' height='20' fill='#22c55e' rx='1'/><line x1='290' y1='146' x2='290' y2='166' stroke='#22c55e' stroke-width='1.5'/><rect x='284.0' y='150' width='12' height='12' fill='#22c55e' rx='1'/><line x1='310' y1='147' x2='310' y2='159' stroke='#ef4444' stroke-width='1.5'/><rect x='304.0' y='150' width='12' height='6' fill='#ef4444' rx='1'/><line x1='330' y1='154' x2='330' y2='207' stroke='#ef4444' stroke-width='1.5'/><rect x='324.0' y='156' width='12' height='49' fill='#ef4444' rx='1'/><line x1='350' y1='201' x2='350' y2='232' stroke='#ef4444' stroke-width='1.5'/><rect x='344.0' y='205' width='12' height='23' fill='#ef4444' rx='1'/><line x1='370' y1='225' x2='370' y2='249' stroke='#ef4444' stroke-width='1.5'/><rect x='364.0' y='228' width='12' height='18' fill='#ef4444' rx='1'/><line x1='374' y1='176' x2='340' y2='176' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r50ba)'/><text x='378' y='172' fill='#f59e0b' font-size='11' text-anchor='start'>big candle closes</text><text x='378' y='186' fill='#f59e0b' font-size='11' text-anchor='start'>below the trendline</text><text x='16' y='52' fill='#94a3b8' font-size='11' text-anchor='start'>LTF trendline break = the wow trade starts</text></svg>",
    "caption": "Version 2: a big candle closes below the lower-timeframe ascending trendline. Part 1 runs to demand #1; part 2 to demand #2 only after demand #1 is removed."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r50ca' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r50cg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='320' y1='40' x2='320' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><rect x='30' y='210' width='270' height='30' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='294' y='229.0' fill='#22c55e' font-size='11' text-anchor='end'>demand</text><line x1='50' y1='117' x2='50' y2='143' stroke='#ef4444' stroke-width='1.5'/><rect x='44.0' y='120' width='12' height='20' fill='#ef4444' rx='1'/><line x1='72' y1='127' x2='72' y2='145' stroke='#22c55e' stroke-width='1.5'/><rect x='66.0' y='132' width='12' height='8' fill='#22c55e' rx='1'/><line x1='94' y1='125' x2='94' y2='167' stroke='#ef4444' stroke-width='1.5'/><rect x='88.0' y='132' width='12' height='28' fill='#ef4444' rx='1'/><line x1='116' y1='157' x2='116' y2='185' stroke='#ef4444' stroke-width='1.5'/><rect x='110.0' y='160' width='12' height='22' fill='#ef4444' rx='1'/><line x1='138' y1='177' x2='138' y2='205' stroke='#ef4444' stroke-width='1.5'/><rect x='132.0' y='182' width='12' height='18' fill='#ef4444' rx='1'/><line x1='160' y1='193' x2='160' y2='223' stroke='#ef4444' stroke-width='1.5'/><rect x='154.0' y='200' width='12' height='16' fill='#ef4444' rx='1'/><line x1='182' y1='205' x2='182' y2='219' stroke='#22c55e' stroke-width='1.5'/><rect x='176.0' y='208' width='12' height='8' fill='#22c55e' rx='1'/><line x1='204' y1='203' x2='204' y2='227' stroke='#ef4444' stroke-width='1.5'/><rect x='198.0' y='208' width='12' height='14' fill='#ef4444' rx='1'/><line x1='226' y1='207' x2='226' y2='229' stroke='#22c55e' stroke-width='1.5'/><rect x='220.0' y='214' width='12' height='8' fill='#22c55e' rx='1'/><text x='165' y='290' fill='#94a3b8' font-size='11' text-anchor='middle'>After the break, price has already</text><text x='165' y='305' fill='#94a3b8' font-size='11' text-anchor='middle'>dropped into a demand:</text><text x='165' y='322' fill='#ef4444' font-size='12' text-anchor='middle' font-weight='600'>NO sell yet</text><text x='165' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>A. In the demand</text><rect x='340' y='150' width='280' height='30' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='169.0' fill='#22c55e' font-size='11' text-anchor='end'>demand</text><line x1='360' y1='117' x2='360' y2='133' stroke='#ef4444' stroke-width='1.5'/><rect x='354.0' y='120' width='12' height='10' fill='#ef4444' rx='1'/><line x1='384' y1='127' x2='384' y2='153' stroke='#ef4444' stroke-width='1.5'/><rect x='378.0' y='130' width='12' height='20' fill='#ef4444' rx='1'/><line x1='408' y1='146' x2='408' y2='174' stroke='#ef4444' stroke-width='1.5'/><rect x='402.0' y='150' width='12' height='20' fill='#ef4444' rx='1'/><line x1='432' y1='159' x2='432' y2='173' stroke='#22c55e' stroke-width='1.5'/><rect x='426.0' y='162' width='12' height='8' fill='#22c55e' rx='1'/><line x1='456' y1='159' x2='456' y2='179' stroke='#ef4444' stroke-width='1.5'/><rect x='450.0' y='162' width='12' height='14' fill='#ef4444' rx='1'/><line x1='480' y1='165' x2='480' y2='179' stroke='#22c55e' stroke-width='1.5'/><rect x='474.0' y='168' width='12' height='8' fill='#22c55e' rx='1'/><line x1='504' y1='164' x2='504' y2='209' stroke='#ef4444' stroke-width='1.5'/><rect x='498.0' y='168' width='12' height='37' fill='#ef4444' rx='1'/><line x1='528' y1='202' x2='528' y2='235' stroke='#ef4444' stroke-width='1.5'/><rect x='522.0' y='205' width='12' height='27' fill='#ef4444' rx='1'/><line x1='552' y1='229' x2='552' y2='253' stroke='#ef4444' stroke-width='1.5'/><rect x='546.0' y='232' width='12' height='18' fill='#ef4444' rx='1'/><line x1='576' y1='247' x2='576' y2='265' stroke='#ef4444' stroke-width='1.5'/><rect x='570.0' y='250' width='12' height='12' fill='#ef4444' rx='1'/><line x1='456' y1='176' x2='456' y2='196' stroke='#ef4444' stroke-width='1.5'/><text x='450' y='214' fill='#f59e0b' font-size='10' text-anchor='middle'>wick through =</text><text x='450' y='226' fill='#f59e0b' font-size='10' text-anchor='middle'>not removed</text><line x1='544' y1='196' x2='514' y2='196' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r50ca)'/><text x='548' y='194' fill='#f59e0b' font-size='10' text-anchor='start'>closes below</text><text x='548' y='207' fill='#f59e0b' font-size='10' text-anchor='start'>= removed</text><text x='480' y='300' fill='#94a3b8' font-size='11' text-anchor='middle'>Sell only once the demand is</text><text x='480' y='315' fill='#94a3b8' font-size='11' text-anchor='middle'>removed by a candle close</text><text x='480' y='330' fill='#94a3b8' font-size='11' text-anchor='middle'>(or price reaches a supply)</text><text x='480' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>B. Demand removed</text></svg>",
    "caption": "No sell while price is still sitting in a demand. Wait for a candle close below it (a wick through, e.g. on a quiet Friday, does not count)."
   }
  ],
  "checklist": [
   "Which zone was just removed, and where is the next zone of the same type?",
   "How many pips is the wow trade area? Is it worth it?",
   "Has the lower-timeframe trendline been crossed by a big candle close?",
   "Is price currently inside an opposite zone? If yes, wait for its removal.",
   "Was the last zone removed by a close, not just a wick?",
   "Is this part 1 or part 2? Where is the stop moved if holding?",
   "Does the monthly / weekly direction agree?"
  ],
  "journalTags": [
   "wow-trade",
   "extension-of-pips",
   "trendline-break",
   "zone-removed",
   "part-1",
   "part-2",
   "fake-wick",
   "LTF-entry"
  ],
  "newVsPdfs": [
   "Kevin's course has the same chain idea (a zone that removed an opposing zone, then targeting the next level); 'wow trade' and 'extension of pips' are Raja's own names for the room between the removed zone and the next one.",
   "Raja starts a lower-timeframe sell campaign from a trendline cross alone, as long as no opposite zone is in the way. Kevin's confirmation entry needs the trendline AND an opposing zone removed.",
   "Splitting the move into part 1 / part 2 (re-entering only after the intermediate zone is removed) is not in Kevin's or Seiden's material.",
   "His removal test (a candle close beyond, not a wick, and be wary of low-volume Fridays) matches the course rulebook's 'removed = a close beyond the distal'.",
   "Seiden judges targets by profit margin to the opposing level; Raja expresses the same thing as counting the pips in the wow trade area and skipping pairs with small room."
  ]
 },
 {
  "n": 51,
  "title": "Strong Zones I: strong vs weak, wow trade and arrival zones",
  "kind": "video",
  "summary": "Not every fresh zone can be traded. Raja uses only strong zones for pending orders, and there are three kinds: the simple strong zone (its move removed the opposite zone), the wow trade zone, and the arrival zone (it crossed the trendline AND removed the opposite zone). A zone whose move failed to remove the opposite zone is weak and gets no set & forget order. He also defines impulse vs correction relative to the trendline.",
  "sections": [
   {
    "heading": "Fresh zones vs strong zones",
    "points": [
     "Among fresh zones there are three types where you can put a buy limit or sell limit order (set & forget). Everything else is weak.",
     "Simple strong zone: a supply forms, its drop removes a demand. Because it removed the opposite zone, that supply becomes strong: use a sell limit order.",
     "Weak zone: the supply's drop failed to remove the demand below. That supply is technically weak: no set & forget, because the market can break it. In that picture the demand (which held) is the stronger zone.",
     "Simple strong zones are found mostly on CP levels (continuation bases) and sometimes on valleys and peaks (reversal bases).",
     "His short rule: whichever zone removed the opposite zone becomes the strong zone, and the market mostly respects strong areas."
    ]
   },
   {
    "heading": "First touch only",
    "points": [
     "On the first return to a strong zone, always use set & forget.",
     "When the market wants to break a zone it taps it once and breaks it on a later visit.",
     "Example: monthly and weekly are dropping and you have a strong daily demand. Price may tap it with one candle and then drop through it on the next candles. It will not break on the first tap."
    ]
   },
   {
    "heading": "Strong zone #2: the wow trade",
    "points": [
     "Use the high timeframe to identify the pips (the run from the removed zone to the next zone), then take the entry on the low timeframe.",
     "The high timeframe is for direction only, never for entries: the stop would be too big. Forex rule: small stop loss, maximum profit.",
     "Example: supply #1 at the top, supply #2 lower. Price drops, forms a demand, and that demand removes supply #2. The next target is supply #1. Price may retest the demand first or jump straight there.",
     "He says if you understand wow trades you can make money even without deep supply & demand knowledge. 'Wow' just means good pips."
    ]
   },
   {
    "heading": "Strong zone #3: the arrival zone",
    "points": [
     "His 'arrival zone' (transcribed as 'arrival' / 'rival') has two rules. Rule 1: the move crosses the trendline. Rule 2: it removes the opposite zone (the last supply, for a demand).",
     "If price only crosses the trendline but does not remove the opposite zone, the zone is an inheritance zone, which is weak (covered in part II).",
     "Example: price drops from top to bottom making supplies. A demand forms; its rally first crosses the descending trendline, then removes the last supply. That demand is an arrival zone and the market will respect it when it comes back.",
     "Market makers use arrival zones for their entries, especially on the monthly and weekly. They work on every timeframe, from 1 minute to monthly.",
     "He calls arrival zones the most important zones."
    ]
   },
   {
    "heading": "Trendlines, impulse and correction",
    "points": [
     "Two trendline types: ascending (drawn along the candles going up) and descending. A descending trendline forms when price crosses an ascending one and then makes two new lower valleys and peaks (likely).",
     "Moves with the trendline are impulses (trend trading). Moves against the high-timeframe trendline are corrections (counter-trades).",
     "Trading against the HTF trendline means trading the correction side: example, the market was dropping, a demand on the correction side removed a supply and became strong. Price tapped it, ran to the TP (the supply level), and later the down-trend removed that demand.",
     "Hold long only with the trend; correction trades are short-term."
    ]
   },
   {
    "heading": "Why he trusts this",
    "points": [
     "We have no control over the market; we read the old data to predict the future.",
     "He claims supply & demand repeats with about 98% probability (his number) if the rules are followed. Other methods 'work under' supply & demand.",
     "When news comes out, the market creates new fresh supply and demand; knowing the rules tells you which ones are good or bad.",
     "He does not use indicators: they are slow, the market is fast."
    ]
   }
  ],
  "rules": [
   "Use pending (limit) orders only on strong zones: simple strong, wow trade, and arrival zones.",
   "A zone is strong when its move removed the opposite zone; if it failed to remove it, it is weak.",
   "First touch of a strong zone = set & forget.",
   "Arrival zone = crosses the trendline AND removes the opposite zone; only the trendline cross = inheritance zone (weak).",
   "High timeframe for direction and pips, low timeframe for the entry (small stop, big target).",
   "Trades with the trendline are impulse / trend trades; against it, they are short-term corrections."
  ],
  "mistakes": [
   "Putting limit orders on every fresh zone instead of only strong ones.",
   "Trading a supply whose drop failed to remove the demand below as if it were strong.",
   "Entering on the high timeframe and carrying a huge stop loss.",
   "Holding a correction-side trade as if it were a trend trade.",
   "Calling a zone an arrival zone when it only broke the trendline (that is an inheritance zone)."
  ],
  "quotes": [
   "Whichever zone removed the opposite zone, that zone becomes a strong zone.",
   "High time frame we only use for direction, not for entries.",
   "Wow means good pips."
  ],
  "diagrams": [],
  "figures": [
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r51aa' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r51ag' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='320' y1='40' x2='320' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><rect x='33' y='201' width='267' height='15' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2' stroke-dasharray='5 4' opacity='0.6'/><text x='35' y='230' fill='#22c55e' font-size='11' text-anchor='start'>demand (removed)</text><rect x='135' y='84' width='165' height='14' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='294' y='95.0' fill='#ef4444' font-size='11' text-anchor='end'>supply</text><line x1='24' y1='177' x2='24' y2='198' stroke='#ef4444' stroke-width='1.5'/><rect x='19.0' y='180' width='10' height='15' fill='#ef4444' rx='1'/><line x1='41' y1='192' x2='41' y2='211' stroke='#ef4444' stroke-width='1.5'/><rect x='36.0' y='195' width='10' height='13' fill='#ef4444' rx='1'/><line x1='58' y1='206' x2='58' y2='213' stroke='#ef4444' stroke-width='1.5'/><rect x='53.0' y='208' width='10' height='3' fill='#ef4444' rx='1'/><line x1='75' y1='204' x2='75' y2='214' stroke='#22c55e' stroke-width='1.5'/><rect x='70.0' y='207' width='10' height='4' fill='#22c55e' rx='1'/><line x1='92' y1='169' x2='92' y2='210' stroke='#22c55e' stroke-width='1.5'/><rect x='87.0' y='172' width='10' height='35' fill='#22c55e' rx='1'/><line x1='109' y1='129' x2='109' y2='175' stroke='#22c55e' stroke-width='1.5'/><rect x='104.0' y='132' width='10' height='40' fill='#22c55e' rx='1'/><line x1='126' y1='97' x2='126' y2='135' stroke='#22c55e' stroke-width='1.5'/><rect x='121.0' y='100' width='10' height='32' fill='#22c55e' rx='1'/><line x1='143' y1='87' x2='143' y2='102' stroke='#22c55e' stroke-width='1.5'/><rect x='138.0' y='89' width='10' height='11' fill='#22c55e' rx='1'/><line x1='160' y1='86' x2='160' y2='96' stroke='#ef4444' stroke-width='1.5'/><rect x='155.0' y='89' width='10' height='4' fill='#ef4444' rx='1'/><line x1='177' y1='88' x2='177' y2='95' stroke='#22c55e' stroke-width='1.5'/><rect x='172.0' y='90' width='10' height='3' fill='#22c55e' rx='1'/><line x1='194' y1='87' x2='194' y2='131' stroke='#ef4444' stroke-width='1.5'/><rect x='189.0' y='90' width='10' height='38' fill='#ef4444' rx='1'/><line x1='211' y1='125' x2='211' y2='171' stroke='#ef4444' stroke-width='1.5'/><rect x='206.0' y='128' width='10' height='40' fill='#ef4444' rx='1'/><line x1='228' y1='165' x2='228' y2='207' stroke='#ef4444' stroke-width='1.5'/><rect x='223.0' y='168' width='10' height='36' fill='#ef4444' rx='1'/><line x1='245' y1='201' x2='245' y2='237' stroke='#ef4444' stroke-width='1.5'/><rect x='240.0' y='204' width='10' height='30' fill='#ef4444' rx='1'/><line x1='262' y1='231' x2='262' y2='249' stroke='#ef4444' stroke-width='1.5'/><rect x='257.0' y='234' width='10' height='12' fill='#ef4444' rx='1'/><text x='160' y='52' fill='#ef4444' font-size='13' text-anchor='middle' font-weight='600'>STRONG supply</text><text x='160' y='280' fill='#94a3b8' font-size='11' text-anchor='middle'>Its drop removed the opposite demand</text><text x='160' y='296' fill='#f59e0b' font-size='11' text-anchor='middle'>-&gt; sell limit, set &amp; forget</text><rect x='353' y='201' width='267' height='15' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='355' y='230' fill='#22c55e' font-size='11' text-anchor='start'>demand</text><rect x='455' y='84' width='165' height='14' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='614' y='95.0' fill='#ef4444' font-size='11' text-anchor='end'>supply</text><line x1='344' y1='177' x2='344' y2='198' stroke='#ef4444' stroke-width='1.5'/><rect x='339.0' y='180' width='10' height='15' fill='#ef4444' rx='1'/><line x1='361' y1='192' x2='361' y2='211' stroke='#ef4444' stroke-width='1.5'/><rect x='356.0' y='195' width='10' height='13' fill='#ef4444' rx='1'/><line x1='378' y1='206' x2='378' y2='213' stroke='#ef4444' stroke-width='1.5'/><rect x='373.0' y='208' width='10' height='3' fill='#ef4444' rx='1'/><line x1='395' y1='204' x2='395' y2='214' stroke='#22c55e' stroke-width='1.5'/><rect x='390.0' y='207' width='10' height='4' fill='#22c55e' rx='1'/><line x1='412' y1='169' x2='412' y2='210' stroke='#22c55e' stroke-width='1.5'/><rect x='407.0' y='172' width='10' height='35' fill='#22c55e' rx='1'/><line x1='429' y1='129' x2='429' y2='175' stroke='#22c55e' stroke-width='1.5'/><rect x='424.0' y='132' width='10' height='40' fill='#22c55e' rx='1'/><line x1='446' y1='97' x2='446' y2='135' stroke='#22c55e' stroke-width='1.5'/><rect x='441.0' y='100' width='10' height='32' fill='#22c55e' rx='1'/><line x1='463' y1='87' x2='463' y2='102' stroke='#22c55e' stroke-width='1.5'/><rect x='458.0' y='89' width='10' height='11' fill='#22c55e' rx='1'/><line x1='480' y1='86' x2='480' y2='96' stroke='#ef4444' stroke-width='1.5'/><rect x='475.0' y='89' width='10' height='4' fill='#ef4444' rx='1'/><line x1='497' y1='88' x2='497' y2='95' stroke='#22c55e' stroke-width='1.5'/><rect x='492.0' y='90' width='10' height='3' fill='#22c55e' rx='1'/><line x1='514' y1='87' x2='514' y2='131' stroke='#ef4444' stroke-width='1.5'/><rect x='509.0' y='90' width='10' height='38' fill='#ef4444' rx='1'/><line x1='531' y1='125' x2='531' y2='171' stroke='#ef4444' stroke-width='1.5'/><rect x='526.0' y='128' width='10' height='40' fill='#ef4444' rx='1'/><line x1='548' y1='159' x2='548' y2='209' stroke='#ef4444' stroke-width='1.5'/><rect x='543.0' y='168' width='10' height='32' fill='#ef4444' rx='1'/><line x1='565' y1='175' x2='565' y2='203' stroke='#22c55e' stroke-width='1.5'/><rect x='560.0' y='178' width='10' height='22' fill='#22c55e' rx='1'/><line x1='582' y1='157' x2='582' y2='181' stroke='#22c55e' stroke-width='1.5'/><rect x='577.0' y='160' width='10' height='18' fill='#22c55e' rx='1'/><text x='480' y='52' fill='#94a3b8' font-size='13' text-anchor='middle' font-weight='600'>WEAK supply</text><text x='480' y='280' fill='#94a3b8' font-size='11' text-anchor='middle'>Its drop failed to remove the demand</text><text x='480' y='296' fill='#f59e0b' font-size='11' text-anchor='middle'>-&gt; no set &amp; forget; confirmation only</text><text x='480' y='312' fill='#94a3b8' font-size='11' text-anchor='middle'>(the demand is the strong one here)</text></svg>",
    "caption": "Same supply, two outcomes. Left: its drop closes below the demand, so the supply is strong (sell limit, set & forget). Right: the drop fails to remove the demand, so the supply is weak (no set & forget)."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r51ba' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r51bg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Arrival zone: two rules</text><rect x='65' y='92' width='555' height='12' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='614' y='102.0' fill='#ef4444' font-size='11' text-anchor='end'>older supply</text><rect x='161' y='148' width='459' height='14' fill='#ef444422' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='5 4' opacity='0.6'/><text x='614' y='159.0' fill='#ef4444' font-size='11' text-anchor='end'>last supply (removed)</text><rect x='289' y='236' width='331' height='15' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='247.5' fill='#22c55e' font-size='11' text-anchor='end'>ARRIVAL ZONE (strong)</text><line x1='20' y1='52.1' x2='360' y2='255.1' stroke='#a78bfa' stroke-width='1.8'/><line x1='40' y1='67' x2='40' y2='95' stroke='#ef4444' stroke-width='1.5'/><rect x='35.0' y='70' width='10' height='22' fill='#ef4444' rx='1'/><line x1='56' y1='87' x2='56' y2='115' stroke='#ef4444' stroke-width='1.5'/><rect x='51.0' y='92' width='10' height='18' fill='#ef4444' rx='1'/><line x1='72' y1='93' x2='72' y2='117' stroke='#22c55e' stroke-width='1.5'/><rect x='67.0' y='100' width='10' height='10' fill='#22c55e' rx='1'/><line x1='88' y1='93' x2='88' y2='103' stroke='#22c55e' stroke-width='1.5'/><rect x='83.0' y='96' width='10' height='4' fill='#22c55e' rx='1'/><line x1='104' y1='91' x2='104' y2='104' stroke='#ef4444' stroke-width='1.5'/><rect x='99.0' y='96' width='10' height='3' fill='#ef4444' rx='1'/><line x1='120' y1='92' x2='120' y2='132' stroke='#ef4444' stroke-width='1.5'/><rect x='115.0' y='99' width='10' height='26' fill='#ef4444' rx='1'/><line x1='136' y1='122' x2='136' y2='151' stroke='#ef4444' stroke-width='1.5'/><rect x='131.0' y='125' width='10' height='23' fill='#ef4444' rx='1'/><line x1='152' y1='143' x2='152' y2='171' stroke='#ef4444' stroke-width='1.5'/><rect x='147.0' y='148' width='10' height='18' fill='#ef4444' rx='1'/><line x1='168' y1='151' x2='168' y2='173' stroke='#22c55e' stroke-width='1.5'/><rect x='163.0' y='158' width='10' height='8' fill='#22c55e' rx='1'/><line x1='184' y1='149' x2='184' y2='161' stroke='#22c55e' stroke-width='1.5'/><rect x='179.0' y='152' width='10' height='6' fill='#22c55e' rx='1'/><line x1='200' y1='147' x2='200' y2='160' stroke='#ef4444' stroke-width='1.5'/><rect x='195.0' y='152' width='10' height='3' fill='#ef4444' rx='1'/><line x1='216' y1='148' x2='216' y2='187' stroke='#ef4444' stroke-width='1.5'/><rect x='211.0' y='155' width='10' height='25' fill='#ef4444' rx='1'/><line x1='232' y1='177' x2='232' y2='203' stroke='#ef4444' stroke-width='1.5'/><rect x='227.0' y='180' width='10' height='20' fill='#ef4444' rx='1'/><line x1='248' y1='195' x2='248' y2='220' stroke='#ef4444' stroke-width='1.5'/><rect x='243.0' y='200' width='10' height='15' fill='#ef4444' rx='1'/><line x1='264' y1='208' x2='264' y2='235' stroke='#ef4444' stroke-width='1.5'/><rect x='259.0' y='215' width='10' height='13' fill='#ef4444' rx='1'/><line x1='280' y1='225' x2='280' y2='241' stroke='#ef4444' stroke-width='1.5'/><rect x='275.0' y='228' width='10' height='10' fill='#ef4444' rx='1'/><line x1='296' y1='233' x2='296' y2='249' stroke='#ef4444' stroke-width='1.5'/><rect x='291.0' y='238' width='10' height='6' fill='#ef4444' rx='1'/><line x1='312' y1='233' x2='312' y2='251' stroke='#22c55e' stroke-width='1.5'/><rect x='307.0' y='240' width='10' height='4' fill='#22c55e' rx='1'/><line x1='328' y1='237' x2='328' y2='245' stroke='#ef4444' stroke-width='1.5'/><rect x='323.0' y='240' width='10' height='2' fill='#ef4444' rx='1'/><line x1='344' y1='210' x2='344' y2='247' stroke='#22c55e' stroke-width='1.5'/><rect x='339.0' y='215' width='10' height='27' fill='#22c55e' rx='1'/><line x1='360' y1='183' x2='360' y2='222' stroke='#22c55e' stroke-width='1.5'/><rect x='355.0' y='190' width='10' height='25' fill='#22c55e' rx='1'/><line x1='376' y1='165' x2='376' y2='193' stroke='#22c55e' stroke-width='1.5'/><rect x='371.0' y='168' width='10' height='22' fill='#22c55e' rx='1'/><line x1='392' y1='139' x2='392' y2='173' stroke='#22c55e' stroke-width='1.5'/><rect x='387.0' y='144' width='10' height='24' fill='#22c55e' rx='1'/><line x1='408' y1='123' x2='408' y2='151' stroke='#22c55e' stroke-width='1.5'/><rect x='403.0' y='130' width='10' height='14' fill='#22c55e' rx='1'/><text x='120' y='74' fill='#a78bfa' font-size='11' text-anchor='start'>descending trendline</text><circle cx='322' cy='222' r='9' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='322' y='226' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>1</text><text x='322' y='272' fill='#f59e0b' font-size='11' text-anchor='middle'>rule 1: crosses the trendline</text><circle cx='426' cy='136' r='9' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='426' y='140' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>2</text><text x='440' y='126' fill='#f59e0b' font-size='11' text-anchor='start'>rule 2: removes the</text><text x='440' y='140' fill='#f59e0b' font-size='11' text-anchor='start'>opposite (last) supply</text><text x='16' y='300' fill='#94a3b8' font-size='11' text-anchor='start'>Only rule 1 (trendline crossed, opposite zone NOT removed)</text><text x='16' y='316' fill='#f59e0b' font-size='11' text-anchor='start'>-&gt; the zone is an INHERITANCE zone: weak, confirmation only.</text><text x='16' y='340' fill='#94a3b8' font-size='11' text-anchor='start'>Market makers trade arrival zones most, especially on monthly / weekly.</text></svg>",
    "caption": "Arrival zone: the demand's rally (1) crosses the descending trendline and (2) removes the last supply. With only rule 1 it would be an inheritance zone."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r51ca' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r51cg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Impulse vs correction</text><line x1='20' y1='50.1' x2='560' y2='263.3' stroke='#a78bfa' stroke-width='1.8'/><polyline points='40,70 120,160 160,120 250,210 290,170 380,260 420,222 520,310' fill='none' stroke='#94a3b8' stroke-width='2.2' stroke-linejoin='round'/><line x1='46' y1='78' x2='114' y2='152' stroke='#ef4444' stroke-width='3'/><line x1='126' y1='154' x2='154' y2='126' stroke='#22c55e' stroke-width='3'/><line x1='166' y1='128' x2='244' y2='202' stroke='#ef4444' stroke-width='3'/><line x1='256' y1='204' x2='284' y2='176' stroke='#22c55e' stroke-width='3'/><line x1='296' y1='178' x2='374' y2='252' stroke='#ef4444' stroke-width='3'/><line x1='386' y1='254' x2='414' y2='228' stroke='#22c55e' stroke-width='3'/><line x1='426' y1='230' x2='514' y2='302' stroke='#ef4444' stroke-width='3'/><text x='80' y='130' fill='#ef4444' font-size='11' text-anchor='end'>impulse</text><text x='150' y='166' fill='#22c55e' font-size='11' text-anchor='middle'>correction</text><text x='210' y='200' fill='#ef4444' font-size='11' text-anchor='end'>impulse</text><text x='278' y='214' fill='#22c55e' font-size='11' text-anchor='middle'>correction</text><text x='470' y='100' fill='#a78bfa' font-size='11' text-anchor='middle'>descending trendline</text><text x='470' y='118' fill='#a78bfa' font-size='11' text-anchor='middle'>touches the highs (peaks)</text><text x='16' y='330' fill='#94a3b8' font-size='11' text-anchor='start'>With the trendline = impulse / trend trading. Against it = counter-trade / correction.</text><text x='16' y='346' fill='#f59e0b' font-size='11' text-anchor='start'>Hold long only with the trend; trades on the correction side are short-term.</text></svg>",
    "caption": "Moves with the trendline are impulses (trend trades); moves against it are corrections (counter-trades, short-term only)."
   }
  ],
  "checklist": [
   "Did this zone's move remove an opposite zone? (strong / weak)",
   "Is it a simple strong zone, a wow trade zone or an arrival zone?",
   "For an arrival zone: trendline crossed? Opposite (last) zone removed?",
   "Is this the first touch? (set & forget) Otherwise use confirmation.",
   "Am I trading with the trendline (impulse) or against it (correction)?",
   "Is the entry on a low timeframe with a small stop?"
  ],
  "journalTags": [
   "strong-zone",
   "weak-zone",
   "arrival-zone",
   "inheritance-zone",
   "wow-trade",
   "set-and-forget",
   "first-touch",
   "impulse",
   "correction"
  ],
  "newVsPdfs": [
   "Kevin's 'chain / qualification' rule (a zone qualifies if its move removed an opposing zone or trendline) is the core of Raja's 'strong zone'. Raja turns it into a strict gate: only strong zones get pending orders.",
   "Both mentors use 'arrival zone' for a zone that broke a trendline and took out an opposing zone. Raja adds the 'inheritance zone' (trendline broken, opposite zone not removed) as its weak twin.",
   "Seiden's freshness rule (the first return is best) matches Raja's 'first time always set & forget'.",
   "Raja's 98% figure is his claim, not a tested statistic; neither PDF course gives such a number."
  ]
 },
 {
  "n": 52,
  "title": "Strong Zones II: tested zones, confirmation, inheritance, overlap and flip zones",
  "kind": "video",
  "summary": "The second half of the strong-zones session. Raja explains how many times a zone can be used (1st touch set & forget, 2nd and 3rd only with confirmation, the 4th usually breaks), what confirmation means (apply the arrival-zone rules on a lower timeframe), and the weak zone types that need confirmation: inheritance, overlap, flip, out-of-trendline, tested and plain weak zones. Total: 3 strong + 6 weak = 9 zone types.",
  "sections": [
   {
    "heading": "How many times a zone can be used",
    "points": [
     "First touch: set & forget.",
     "Second touch: only if the market gives you confirmation. Third touch: again only with confirmation.",
     "Fourth time: expect the market to break the zone.",
     "The same count applies to strong and arrival zones that have already been tested."
    ]
   },
   {
    "heading": "What confirmation is",
    "points": [
     "Confirmation = the same rules as the arrival zone, applied on a lower timeframe.",
     "Example: a tested monthly supply. Go to the daily or H4. Price was rising there along an ascending trendline. Wait for the lower timeframe to cross the trendline AND remove the last demand. The supply that did this on the lower timeframe is now strong; put a set & forget order on it.",
     "On a high timeframe this looks like one long candle into the zone and then the next candle dropping.",
     "Timeframe pairs: monthly / weekly trades confirm on the daily or H4; daily trades confirm on H1; H1 trades confirm on 15m, 5m or 1m.",
     "If the market gives no confirmation, do not trade that pair. Move on and look for the easiest pairs, not hard ones. Traders think they will miss the entry; you only trade when the market gives you a 'safe pass' (likely: a clear signal).",
     "He calls confirmation the main key of forex trading."
    ]
   },
   {
    "heading": "Worked example (GBPJPY, likely 'GJ')",
    "points": [
     "A tested monthly arrival area. On H4: price crossed the trendline (rule 1) and removed the last supply (rule 2). The demand that did it became a strong H4 zone.",
     "Price triggered the entry and gave about 800 pips.",
     "He chose the zone that removed the opposite zone, not simply the lowest one; the lowest one was an inheritance zone.",
     "Daily example: a supply removed by a demand made that demand strong; while rising price removed another supply, giving a second entry on the new demand."
    ]
   },
   {
    "heading": "Inheritance zone",
    "points": [
     "If price crosses the trendline but cannot remove the opposite zone (because that opposite zone was removed by a CP level or another strong area), the previous top supply becomes an inheritance zone, not an arrival zone.",
     "Example A: supplies #1 (top) and #2. #2 removed the demand, so it is strong: sell limit there, set & forget. #1 at the top is an inheritance zone, technically weak: use confirmation only.",
     "Market makers create fake signals too: next to arrival zones they also leave inheritance zones. It is your job to tell them apart.",
     "Why still watch the top zone: market makers can lose power when price reaches a high-timeframe supply, so they may sell there. The technical rule is to sell from the top only if the market gives confirmation; otherwise wait for a strong zone that removes something."
    ]
   },
   {
    "heading": "Overlap zone (Example B)",
    "points": [
     "Same picture as Example A, with one difference: no gap between the supply and the demand.",
     "The supply was created inside the area of an old demand (or a demand inside an old supply). That is an overlap zone: technically weak, even though it removed a zone.",
     "Most supply & demand traders lose money here: they think the zone is strong because it removed something, but the market does not respect it.",
     "Gold example: a student wanted to sell; Raja said use confirmation. The supply sat in an old demand level, so the market ignored it and rallied through."
    ]
   },
   {
    "heading": "Flip zone",
    "points": [
     "Price moves in a zigzag. A broken resistance becomes support: other methods call it higher highs and higher lows, distribution and accumulation; in supply & demand it is the flip zone.",
     "The CP level found at the flip area is weak because it overlaps the previous supply. Zoom out and you will see it was an overlap.",
     "Bitcoin example: the area he gave for the buy had overlaps; one level only showed as a CP level on a lower timeframe.",
     "Patterns like flags, double tops / bottoms and head and shoulders are other names for the same behaviour. Just focus on strong zones (limit order) and treat tested zones with confirmation."
    ]
   },
   {
    "heading": "Out-of-trendline zone",
    "points": [
     "You trade with the trend. If a zone was missed and is still fresh, but the market has since crossed the major trendline, use confirmation there.",
     "Reason: the major trendline is no longer bullish (it is now bearish), so the zone is 'out of trendline'. Out-of-trendline zones never get set & forget."
    ]
   },
   {
    "heading": "Summary: 9 zone types",
    "points": [
     "Strong (pending order, set & forget): simple strong zone (removed the opposite zone), wow trade zone, arrival zone.",
     "Weak (confirmation only): weak zone that removed nothing, inheritance zone, flip zone, out-of-trendline zone, overlap zone, tested / retested zone.",
     "On every zone, first decide whether it is strong or weak. Weak means confirmation."
    ]
   }
  ],
  "rules": [
   "1st touch set & forget; 2nd and 3rd touch confirmation only; expect the 4th to break.",
   "Confirmation = on a lower timeframe, the trendline is crossed AND the last opposite zone is removed; then use that new strong LTF zone.",
   "Confirmation timeframes: monthly/weekly -> daily/H4; daily -> H1; H1 -> 15m/5m/1m.",
   "No confirmation = no trade; move to an easier pair.",
   "Inheritance, overlap, flip, out-of-trendline, tested and plain weak zones get confirmation only, never a blind limit order.",
   "A zone formed inside an old opposite zone (no gap) is an overlap zone and weak, even if it removed a zone."
  ],
  "mistakes": [
   "Using set & forget on a zone that has already been tested.",
   "Trading an overlap zone because it 'removed' something.",
   "Picking the lowest (inheritance) demand instead of the one that removed the opposite zone.",
   "Forcing a trade when the lower timeframe gives no confirmation.",
   "Using a set & forget order on a still-fresh zone after the major trendline has turned against it."
  ],
  "quotes": [
   "Confirmation is the main key of the Forex trading.",
   "You can only trade when the market gives you a safe pass.",
   "First check: that is a strong zone or a weak zone."
  ],
  "diagrams": [],
  "figures": [
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r52aa' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r52ag' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>How many times a zone can be used</text><rect x='40' y='240' width='570' height='30' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='604' y='259.0' fill='#22c55e' font-size='11' text-anchor='end'>strong demand (e.g. monthly)</text><polyline points='40,120 90,238 140,150 210,238 260,170 330,242 380,180 450,244 500,200 560,320' fill='none' stroke='#94a3b8' stroke-width='2.2' stroke-linejoin='round' marker-end='url(#r52ag)'/><circle cx='90' cy='212' r='9' fill='none' stroke='#22c55e' stroke-width='1.5'/><text x='90' y='216' fill='#22c55e' font-size='11' text-anchor='middle' font-weight='600'>1</text><text x='90' y='196' fill='#22c55e' font-size='11' text-anchor='middle' font-weight='600'>set &amp; forget</text><circle cx='210' cy='212' r='9' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='210' y='216' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>2</text><text x='210' y='196' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>confirmation</text><circle cx='330' cy='216' r='9' fill='none' stroke='#f59e0b' stroke-width='1.5'/><text x='330' y='220' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>3</text><text x='330' y='200' fill='#f59e0b' font-size='11' text-anchor='middle' font-weight='600'>confirmation</text><circle cx='450' cy='218' r='9' fill='none' stroke='#ef4444' stroke-width='1.5'/><text x='450' y='222' fill='#ef4444' font-size='11' text-anchor='middle' font-weight='600'>4</text><text x='450' y='202' fill='#ef4444' font-size='11' text-anchor='middle' font-weight='600'>expect a break</text><text x='16' y='312' fill='#94a3b8' font-size='11' text-anchor='start'>Each touch fills resting orders. Use the zone with S&amp;F only on</text><text x='16' y='328' fill='#94a3b8' font-size='11' text-anchor='start'>the first touch; touches 2-3 need LTF confirmation.</text><text x='16' y='346' fill='#f59e0b' font-size='11' text-anchor='start'>On a weekly/monthly push the HTF zone often taps once, then breaks the next candle.</text></svg>",
    "caption": "Touch count: 1st touch set & forget, 2nd and 3rd with confirmation, the 4th usually breaks."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r52ba' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r52bg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='320' y1='40' x2='320' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><rect x='24' y='206' width='276' height='14' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2' stroke-dasharray='5 4' opacity='0.6'/><text x='294' y='217.0' fill='#22c55e' font-size='11' text-anchor='end'>demand (removed)</text><rect x='159' y='80' width='141' height='16' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='296' y='92.0' fill='#ef4444' font-size='11' text-anchor='end'>supply #2</text><rect x='99' y='114' width='201' height='12' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='296' y='124.0' fill='#ef4444' font-size='11' text-anchor='end'>supply #1</text><line x1='30' y1='211' x2='30' y2='233' stroke='#22c55e' stroke-width='1.5'/><rect x='25.5' y='214' width='9' height='16' fill='#22c55e' rx='1'/><line x1='45' y1='205' x2='45' y2='219' stroke='#22c55e' stroke-width='1.5'/><rect x='40.5' y='210' width='9' height='4' fill='#22c55e' rx='1'/><line x1='60' y1='203' x2='60' y2='220' stroke='#ef4444' stroke-width='1.5'/><rect x='55.5' y='210' width='9' height='3' fill='#ef4444' rx='1'/><line x1='75' y1='177' x2='75' y2='216' stroke='#22c55e' stroke-width='1.5'/><rect x='70.5' y='180' width='9' height='33' fill='#22c55e' rx='1'/><line x1='90' y1='145' x2='90' y2='185' stroke='#22c55e' stroke-width='1.5'/><rect x='85.5' y='150' width='9' height='30' fill='#22c55e' rx='1'/><line x1='105' y1='121' x2='105' y2='157' stroke='#22c55e' stroke-width='1.5'/><rect x='100.5' y='128' width='9' height='22' fill='#22c55e' rx='1'/><line x1='120' y1='119' x2='120' y2='131' stroke='#22c55e' stroke-width='1.5'/><rect x='115.5' y='122' width='9' height='6' fill='#22c55e' rx='1'/><line x1='135' y1='113' x2='135' y2='127' stroke='#22c55e' stroke-width='1.5'/><rect x='130.5' y='118' width='9' height='4' fill='#22c55e' rx='1'/><line x1='150' y1='111' x2='150' y2='127' stroke='#ef4444' stroke-width='1.5'/><rect x='145.5' y='118' width='9' height='2' fill='#ef4444' rx='1'/><line x1='165' y1='89' x2='165' y2='123' stroke='#22c55e' stroke-width='1.5'/><rect x='160.5' y='92' width='9' height='28' fill='#22c55e' rx='1'/><line x1='180' y1='79' x2='180' y2='97' stroke='#22c55e' stroke-width='1.5'/><rect x='175.5' y='84' width='9' height='8' fill='#22c55e' rx='1'/><line x1='195' y1='77' x2='195' y2='95' stroke='#ef4444' stroke-width='1.5'/><rect x='190.5' y='84' width='9' height='4' fill='#ef4444' rx='1'/><line x1='210' y1='83' x2='210' y2='91' stroke='#22c55e' stroke-width='1.5'/><rect x='205.5' y='86' width='9' height='2' fill='#22c55e' rx='1'/><line x1='225' y1='81' x2='225' y2='125' stroke='#ef4444' stroke-width='1.5'/><rect x='220.5' y='86' width='9' height='34' fill='#ef4444' rx='1'/><line x1='240' y1='113' x2='240' y2='167' stroke='#ef4444' stroke-width='1.5'/><rect x='235.5' y='120' width='9' height='40' fill='#ef4444' rx='1'/><line x1='255' y1='157' x2='255' y2='203' stroke='#ef4444' stroke-width='1.5'/><rect x='250.5' y='160' width='9' height='40' fill='#ef4444' rx='1'/><line x1='270' y1='195' x2='270' y2='233' stroke='#ef4444' stroke-width='1.5'/><rect x='265.5' y='200' width='9' height='28' fill='#ef4444' rx='1'/><line x1='285' y1='221' x2='285' y2='251' stroke='#ef4444' stroke-width='1.5'/><rect x='280.5' y='228' width='9' height='16' fill='#ef4444' rx='1'/><line x1='143' y1='100' x2='143' y2='202' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r52ba)'/><line x1='143' y1='202' x2='143' y2='100' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r52ba)'/><text x='137' y='156' fill='#f59e0b' font-size='11' text-anchor='end'>gap</text><text x='160' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>Example A: gap</text><text x='160' y='300' fill='#94a3b8' font-size='11' text-anchor='middle'>Supply #2 sits clear above the demand</text><text x='160' y='316' fill='#f59e0b' font-size='11' text-anchor='middle'>it removed -&gt; strong (S&amp;F)</text><rect x='361' y='172' width='259' height='20' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='363' y='208' fill='#22c55e' font-size='11' text-anchor='start'>old demand</text><rect x='497' y='170' width='123' height='24' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='614' y='160' fill='#ef4444' font-size='11' text-anchor='end'>supply built inside it</text><line x1='350' y1='117' x2='350' y2='153' stroke='#ef4444' stroke-width='1.5'/><rect x='345.5' y='120' width='9' height='30' fill='#ef4444' rx='1'/><line x1='367' y1='145' x2='367' y2='183' stroke='#ef4444' stroke-width='1.5'/><rect x='362.5' y='150' width='9' height='28' fill='#ef4444' rx='1'/><line x1='384' y1='171' x2='384' y2='193' stroke='#ef4444' stroke-width='1.5'/><rect x='379.5' y='178' width='9' height='8' fill='#ef4444' rx='1'/><line x1='401' y1='179' x2='401' y2='189' stroke='#22c55e' stroke-width='1.5'/><rect x='396.5' y='182' width='9' height='4' fill='#22c55e' rx='1'/><line x1='418' y1='145' x2='418' y2='187' stroke='#22c55e' stroke-width='1.5'/><rect x='413.5' y='150' width='9' height='32' fill='#22c55e' rx='1'/><line x1='435' y1='113' x2='435' y2='157' stroke='#22c55e' stroke-width='1.5'/><rect x='430.5' y='120' width='9' height='30' fill='#22c55e' rx='1'/><line x1='452' y1='101' x2='452' y2='123' stroke='#22c55e' stroke-width='1.5'/><rect x='447.5' y='104' width='9' height='16' fill='#22c55e' rx='1'/><line x1='469' y1='99' x2='469' y2='125' stroke='#ef4444' stroke-width='1.5'/><rect x='464.5' y='104' width='9' height='16' fill='#ef4444' rx='1'/><line x1='486' y1='113' x2='486' y2='157' stroke='#ef4444' stroke-width='1.5'/><rect x='481.5' y='120' width='9' height='30' fill='#ef4444' rx='1'/><line x1='503' y1='147' x2='503' y2='179' stroke='#ef4444' stroke-width='1.5'/><rect x='498.5' y='150' width='9' height='26' fill='#ef4444' rx='1'/><line x1='520' y1='171' x2='520' y2='189' stroke='#ef4444' stroke-width='1.5'/><rect x='515.5' y='176' width='9' height='8' fill='#ef4444' rx='1'/><line x1='537' y1='173' x2='537' y2='191' stroke='#22c55e' stroke-width='1.5'/><rect x='532.5' y='180' width='9' height='4' fill='#22c55e' rx='1'/><line x1='554' y1='177' x2='554' y2='213' stroke='#ef4444' stroke-width='1.5'/><rect x='549.5' y='180' width='9' height='30' fill='#ef4444' rx='1'/><line x1='571' y1='205' x2='571' y2='241' stroke='#ef4444' stroke-width='1.5'/><rect x='566.5' y='210' width='9' height='26' fill='#ef4444' rx='1'/><line x1='588' y1='229' x2='588' y2='257' stroke='#ef4444' stroke-width='1.5'/><rect x='583.5' y='236' width='9' height='14' fill='#ef4444' rx='1'/><text x='480' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>Example B: no gap = overlap</text><text x='480' y='300' fill='#94a3b8' font-size='11' text-anchor='middle'>Supply formed in the area of an old</text><text x='480' y='316' fill='#94a3b8' font-size='11' text-anchor='middle'>demand -&gt; overlap zone, weak,</text><text x='480' y='332' fill='#f59e0b' font-size='11' text-anchor='middle'>even though it removed a zone</text></svg>",
    "caption": "Example A: a gap between supply #2 and the demand it removed makes it strong. Example B: the supply is built inside an old demand (no gap), so it is an overlap zone and weak."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r52ca' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r52cg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Flip zone = overlap zone</text><rect x='110' y='140' width='500' height='22' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='604' y='155.0' fill='#ef4444' font-size='11' text-anchor='end'>old resistance / supply</text><text x='604' y='182' fill='#94a3b8' font-size='11' text-anchor='end'>-&gt; support after the break</text><rect x='300' y='140' width='44' height='22' fill='#f59e0b33' stroke='#f59e0b' stroke-width='1.5'/><polyline points='40,290 130,146 190,236 270,80 320,150 420,50' fill='none' stroke='#94a3b8' stroke-width='2.2' stroke-linejoin='round' marker-end='url(#r52cg)'/><line x1='322' y1='166' x2='322' y2='226' stroke='#f59e0b' stroke-width='1.2'/><text x='330' y='244' fill='#f59e0b' font-size='11' text-anchor='middle'>CP level (base) forms on the retest</text><text x='330' y='260' fill='#f59e0b' font-size='11' text-anchor='middle'>inside the old supply = flip / overlap zone</text><text x='124' y='132' fill='#ef4444' font-size='12' text-anchor='start' font-weight='600'>R</text><text x='184' y='256' fill='#22c55e' font-size='12' text-anchor='start' font-weight='600'>S</text><text x='16' y='320' fill='#94a3b8' font-size='11' text-anchor='start'>Price moves in a zigzag: resistance broken becomes support (the flip area).</text><text x='16' y='338' fill='#94a3b8' font-size='11' text-anchor='start'>The base there overlaps an older zone -&gt; weak; trade it only with confirmation.</text></svg>",
    "caption": "Flip zone: broken resistance becomes support, but the base formed on the retest overlaps the old supply. Confirmation only."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r52da' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r52dg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>The nine zone types</text><rect x='24' y='48' width='250' height='150' rx='8' fill='#22c55e14' stroke='#22c55e' stroke-width='1.2'/><text x='149.0' y='70' fill='#22c55e' font-size='13' text-anchor='middle' font-weight='600'>STRONG (3)</text><text x='149.0' y='90' fill='#94a3b8' font-size='11' text-anchor='middle'>Simple strong zone</text><text x='149.0' y='106' fill='#94a3b8' font-size='11' text-anchor='middle'>(removed the opposite zone)</text><text x='149.0' y='122' fill='#94a3b8' font-size='11' text-anchor='middle'>Wow trade zone</text><text x='149.0' y='138' fill='#94a3b8' font-size='11' text-anchor='middle'>Arrival zone</text><text x='149' y='222' fill='#22c55e' font-size='11' text-anchor='middle'>buy limit / sell limit, set &amp; forget</text><rect x='300' y='48' width='316' height='198' rx='8' fill='#ef444414' stroke='#ef4444' stroke-width='1.2'/><text x='458.0' y='70' fill='#ef4444' font-size='13' text-anchor='middle' font-weight='600'>WEAK (6)</text><text x='458.0' y='90' fill='#94a3b8' font-size='11' text-anchor='middle'>Weak zone (failed to remove)</text><text x='458.0' y='106' fill='#94a3b8' font-size='11' text-anchor='middle'>Inheritance zone</text><text x='458.0' y='122' fill='#94a3b8' font-size='11' text-anchor='middle'>Flip zone</text><text x='458.0' y='138' fill='#94a3b8' font-size='11' text-anchor='middle'>Out-of-trendline zone</text><text x='458.0' y='154' fill='#94a3b8' font-size='11' text-anchor='middle'>Overlap zone</text><text x='458.0' y='170' fill='#94a3b8' font-size='11' text-anchor='middle'>Tested / retested zone</text><text x='458' y='270' fill='#ef4444' font-size='11' text-anchor='middle'>LTF confirmation only</text><text x='16' y='312' fill='#94a3b8' font-size='12' text-anchor='start' font-weight='600'>First question on every zone: strong or weak?</text><text x='16' y='330' fill='#f59e0b' font-size='11' text-anchor='start'>Strong -&gt; pending order. Weak -&gt; wait for confirmation, or skip the pair.</text></svg>",
    "caption": "Raja's nine zone types: three strong (pending order) and six weak (confirmation)."
   }
  ],
  "checklist": [
   "How many times has this zone been touched?",
   "Strong or weak? If weak, which kind (inheritance / overlap / flip / out of trendline / tested / plain weak)?",
   "Is there a gap between this zone and the zone it removed?",
   "For confirmation: which lower timeframe? Trendline crossed? Last opposite zone removed?",
   "Is the major trendline still on my side?",
   "No confirmation: did I move on to another pair?"
  ],
  "journalTags": [
   "tested-zone",
   "confirmation",
   "inheritance-zone",
   "overlap-zone",
   "flip-zone",
   "out-of-trendline",
   "touch-count",
   "nine-zones"
  ],
  "newVsPdfs": [
   "Raja's confirmation (lower-timeframe trendline cross + opposite zone removed) is the same as Kevin's confirmation entry. His use of it for 2nd and 3rd touches is a firmer touch-count rule than Kevin's.",
   "Seiden treats a broken zone as a possible flip only with conditions. Raja flags every flip area as weak because it overlaps an older zone, so confirmation only.",
   "'Inheritance zone' and 'overlap zone' are Raja's names; neither PDF course defines them. The overlap idea is close to the course rulebook's 'look left' check for an older zone under the base.",
   "'Out-of-trendline zone' (a fresh zone that ends up against the major trendline) has no counterpart in Kevin's or Seiden's material.",
   "Kevin voids zones after deep penetration; Raja allows up to three uses (the 2nd and 3rd with confirmation)."
  ]
 },
 {
  "n": 53,
  "title": "Risk Management: the seven-step check before a trade",
  "kind": "video",
  "summary": "In a Q&A call Raja walks through the checklist he applies to every pair: (1) pick the timeframe you follow, (2) risk management, meaning a profit margin of at least 2x and ideally 3x the stop, (3) the market condition, ranging or trending, (4) equity and instrument choice, (5) the entry type (pullback, breakout or flip area), (6) market structure, and (7) exits: fixed TP, trailing stop or swing management by moving the stop zone to zone. He finishes with quick reviews of USOIL, GBPJPY, AUDCAD, USDCAD and AUDJPY.",
  "sections": [
   {
    "heading": "1. Timeframe",
    "points": [
     "Decide which timeframe you follow (monthly, weekly, daily or H4) and be strict with it. This is for direction; entries are always on the low timeframe.",
     "Focus on that timeframe's pips: monthly trader -> monthly pips; daily / weekly trader -> daily / weekly pips.",
     "The main reason to use the high timeframe is to identify the wow trade."
    ]
   },
   {
    "heading": "2. Risk management = profit margin",
    "points": [
     "You need a profit margin of 3x the stop (he says 'three time'), or at least 2x. Then both the supply and demand levels are usable.",
     "Measure on the high timeframe how many pips are left, then trade those pips.",
     "If the supply and demand are close together and the profit margin is smaller than the stop loss, it is not a good idea to trade."
    ]
   },
   {
    "heading": "3. Condition: ranging or trending",
    "points": [
     "Ranging (correction) example: price respected a demand and moved up, now drops back towards the demand while the trendline still points up. Price is retracing to the trendline.",
     "Another range: after the entry price goes sideways (one candle up, one down) and even crosses the trendline. That is also ranging.",
     "If the market already moved up and crossed the trendline with a demand below, you can sell on the lower timeframe down to that previous demand (trading the range / pullback).",
     "Trending: price respects the demand and the demand sits above the trendline, so you trade with the trend.",
     "In a range you cannot hold long term; only trend trades are held. In a trend you can hold for very good pips."
    ]
   },
   {
    "heading": "4. Equity and what you trade",
    "points": [
     "Check your equity first. With $100 you cannot trade bonds and you should not trade Bitcoin (big moves, big spread); even with $1,000 he advises against Bitcoin.",
     "His broker (transcribed 'paper stone', likely Pepperstone) has a 0.10 minimum size on some instruments (as he describes it), which is too big for small accounts on volatile markets.",
     "Ethereum is acceptable. Smaller coins with small spreads (Solana, Dogecoin, ADA) are tradeable even on $100. AVAX moves a lot.",
     "Indices: US30 is risky for a $100 account; he names GER30 (likely) and NAS as easier.",
     "Currencies: almost any pair is fine at 0.01 lots, but be careful with pairs that move a lot (e.g. USDMXN).",
     "Do not fix yourself to one or two pairs (e.g. only gold); most traders lose that way. As an S&D trader pick whichever pair is easiest at the moment and in a trend."
    ]
   },
   {
    "heading": "5. Three entry types",
    "points": [
     "Pullback: a buy limit order on a strong zone.",
     "Breakout: when a high-timeframe supply is removed, price can run to the next one, often about 2.5x the size of the correction (his rule of thumb, 'not essential'). Do not lose those pips: go to H1 and buy H1 demands above the H1 trendline. This is for the short term.",
     "Flip area: when H1 then crosses its trendline, wait for the pullback into the flip area (on daily or H4) and buy there with confirmation. This is for holding long term.",
     "Remember: a flip area is a weak (overlap) zone; use the buy limit only when it has been broken properly. The best areas are always valleys and peaks.",
     "A wow trade can be traded several times: breakout entry, then the flip entry, each time targeting the daily CP (likely: the next continuation zone / TP)."
    ]
   },
   {
    "heading": "6. Structure",
    "points": [
     "Follow the structure of impulses and corrections. While price respects a buying structure (impulse side) you can buy on the low timeframe.",
     "When price starts 'meshing' (chopping without shape) there is no structure: wait. If the daily already moved a lot, wait for it to drop back to the trendline, or for the structure to break and a new one to form.",
     "A zone already tested with the market still meshing there: you cannot know whether to buy, so stay out."
    ]
   },
   {
    "heading": "7. Exits: fixed TP, trailing stop, swing",
    "points": [
     "Fixed TP: from a strong supply, put the TP at the opposite zone.",
     "If the opposite zone is weak but far from your entry, you can hold. When price reaches the high curve area (likely: the overbought top of the high-timeframe range, where sellers sit), move your stop loss up.",
     "Trailing stop: if you cannot watch the screen, measure the distance to the demand (e.g. 120 pips) and set a trailing stop of that size. If the market reverses 120 pips it closes; if it removes the supply above, the stop keeps following. Use it after the weak opposite zone is removed.",
     "Swing: an H1 zone you entered from becomes an H4 zone after a few candles, then a daily, then a weekly one. After two more demands form, move your stop to the second-latest zone, because a reversal needs a trendline cross, one zone removed and then a second zone removed. The first zone is left as a buffer."
    ]
   },
   {
    "heading": "Live reviews at the end",
    "points": [
     "USOIL: still in monthly / weekly demand. The first TP is the current structure; for more, wait for the supply above to break, then buy the fresh demand.",
     "GBPJPY: the high timeframe is stuck in supply and the daily is sideways. Wait for H1 to cross its trendline and for the structure to break, then sell on H1 only.",
     "AUDCAD: in a weak monthly supply. For a sell, the daily must cross the trendline and break the structure; buys only with confirmation; ranging, so wait.",
     "USDCAD: monthly demand, weekly respected; H4 is creating a fresh demand. Wait for it, then buy.",
     "AUDJPY: monthly up, daily above the trendline; no H4 zone yet and H1 meshing, so leave it. On another pair, H4 supply vs H1 buy: short-term trade only."
    ]
   }
  ],
  "rules": [
   "Fix one direction timeframe per trade and judge pips on that timeframe; enter on a lower one.",
   "Minimum profit margin 2x the stop; prefer 3x. If the margin is smaller than the stop, skip.",
   "Hold long only in trending conditions; trade ranges short-term.",
   "Match the instrument to your equity: no BTC, bonds or US30 on a $100 account.",
   "Entries: a pullback limit on a strong zone; a breakout via H1 demand above the H1 trendline (short-term); the flip area with confirmation (long-term).",
   "No structure (meshing) = no trade.",
   "Swing management: move the stop to the second-latest zone, keeping one zone as a buffer."
  ],
  "mistakes": [
   "Trading when supply and demand are so close that the reward is smaller than the stop.",
   "Trading Bitcoin or US30 with a tiny account.",
   "Marrying one instrument (e.g. only gold).",
   "Holding a range trade as if it were a trend trade.",
   "Using a buy limit on a flip / overlap area without confirmation.",
   "Trading a meshing market with no structure."
  ],
  "quotes": [
   "You need at least three time or two time reward.",
   "Don't fix with the one or two pairs.",
   "For the long term we can only trade with the trend."
  ],
  "diagrams": [],
  "figures": [
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r53aa' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r53ag' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='320' y1='40' x2='320' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><rect x='30' y='230' width='270' height='30' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='294' y='249.0' fill='#22c55e' font-size='11' text-anchor='end'>demand</text><rect x='30' y='60' width='270' height='24' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='294' y='76.0' fill='#ef4444' font-size='11' text-anchor='end'>opposite supply</text><line x1='60' y1='230' x2='230' y2='230' stroke='#22c55e' stroke-width='1.2' stroke-dasharray='4 3'/><text x='60' y='226' fill='#22c55e' font-size='11' text-anchor='start'>entry</text><line x1='60' y1='268' x2='230' y2='268' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='4 3'/><text x='60' y='280' fill='#ef4444' font-size='11' text-anchor='start'>SL</text><line x1='150' y1='192' x2='230' y2='192' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='4 3'/><text x='236' y='196' fill='#94a3b8' font-size='11' text-anchor='start'>1R</text><line x1='150' y1='154' x2='230' y2='154' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='4 3'/><text x='236' y='158' fill='#94a3b8' font-size='11' text-anchor='start'>2R</text><line x1='150' y1='116' x2='230' y2='116' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='4 3'/><text x='236' y='120' fill='#94a3b8' font-size='11' text-anchor='start'>3R</text><line x1='110' y1='226' x2='110' y2='90' stroke='#f59e0b' stroke-width='1.6' marker-end='url(#r53aa)'/><text x='160' y='52' fill='#22c55e' font-size='12' text-anchor='middle' font-weight='600'>GOOD: margin 3x the stop</text><text x='160' y='296' fill='#94a3b8' font-size='11' text-anchor='middle'>Room to the opposite zone is</text><text x='160' y='312' fill='#f59e0b' font-size='11' text-anchor='middle'>2-3x the stop -&gt; tradeable</text><rect x='340' y='230' width='280' height='30' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='614' y='249.0' fill='#22c55e' font-size='11' text-anchor='end'>demand</text><rect x='340' y='196' width='280' height='18' fill='#ef444422' stroke='#ef4444' stroke-width='1.2'/><text x='614' y='209.0' fill='#ef4444' font-size='11' text-anchor='end'>supply too close</text><line x1='370' y1='230' x2='540' y2='230' stroke='#22c55e' stroke-width='1.2' stroke-dasharray='4 3'/><text x='370' y='226' fill='#22c55e' font-size='11' text-anchor='start'>entry</text><line x1='370' y1='268' x2='540' y2='268' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='4 3'/><text x='370' y='280' fill='#ef4444' font-size='11' text-anchor='start'>SL</text><line x1='460' y1='192' x2='540' y2='192' stroke='#94a3b8' stroke-width='1.2' stroke-dasharray='4 3'/><text x='546' y='196' fill='#94a3b8' font-size='11' text-anchor='start'>1R</text><text x='480' y='52' fill='#ef4444' font-size='12' text-anchor='middle' font-weight='600'>BAD: profit &lt; stop</text><text x='480' y='296' fill='#94a3b8' font-size='11' text-anchor='middle'>Supply and demand are close together:</text><text x='480' y='312' fill='#f59e0b' font-size='11' text-anchor='middle'>margin smaller than the stop -&gt; skip</text><text x='16' y='344' fill='#94a3b8' font-size='11' text-anchor='start'>Measure the room on the higher timeframe; take the entry on the lower one.</text></svg>",
    "caption": "Step 2: room from the entry to the opposite zone must be 2-3x the stop. Zones too close together means skip."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r53ba' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r53bg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='213' y1='40' x2='213' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><line x1='426' y1='40' x2='426' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><rect x='20' y='220' width='180' height='25' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='196' y='236.5' fill='#22c55e' font-size='11' text-anchor='end'>strong zone</text><polyline points='30,200 70,90 110,150 140,222 190,80' fill='none' stroke='#94a3b8' stroke-width='2' stroke-linejoin='round' marker-end='url(#r53bg)'/><line x1='100' y1='222' x2='200' y2='222' stroke='#f59e0b' stroke-width='1.2' stroke-dasharray='4 3'/><text x='150' y='216' fill='#f59e0b' font-size='11' text-anchor='start'>buy limit</text><text x='106' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>1. Pullback</text><text x='106' y='280' fill='#94a3b8' font-size='11' text-anchor='middle'>Limit order on the</text><text x='106' y='296' fill='#94a3b8' font-size='11' text-anchor='middle'>strong zone</text><rect x='226' y='150' width='184' height='20' fill='#ef444422' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='5 4' opacity='0.6'/><text x='406' y='164.0' fill='#ef4444' font-size='11' text-anchor='end'>daily supply (removed)</text><polyline points='236,260 280,200 300,214 330,120 350,136 395,70' fill='none' stroke='#94a3b8' stroke-width='2' stroke-linejoin='round' marker-end='url(#r53bg)'/><rect x='290' y='206' width='120' height='16' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='406' y='218.0' fill='#22c55e' font-size='11' text-anchor='end'>H1 demand</text><rect x='340' y='128' width='70' height='14' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><line x1='236' y1='262' x2='400' y2='102' stroke='#a78bfa' stroke-width='1.4' stroke-dasharray='5 3'/><text x='320' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>2. Breakout</text><text x='320' y='280' fill='#94a3b8' font-size='11' text-anchor='middle'>HTF supply removed: buy H1</text><text x='320' y='296' fill='#94a3b8' font-size='11' text-anchor='middle'>demands above the H1 trendline</text><text x='320' y='312' fill='#f59e0b' font-size='11' text-anchor='middle'>(short-term)</text><rect x='440' y='168' width='180' height='20' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='446' y='204' fill='#22c55e' font-size='11' text-anchor='start'>flip area</text><polyline points='446,250 500,120 540,176 560,150 578,182 598,70' fill='none' stroke='#94a3b8' stroke-width='2' stroke-linejoin='round' marker-end='url(#r53bg)'/><line x1='470' y1='196' x2='560' y2='96' stroke='#a78bfa' stroke-width='1.4' stroke-dasharray='5 3'/><text x='533' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>3. Flip area</text><text x='533' y='280' fill='#94a3b8' font-size='11' text-anchor='middle'>After the H1 trendline break,</text><text x='533' y='296' fill='#94a3b8' font-size='11' text-anchor='middle'>buy the flip with confirmation</text><text x='533' y='312' fill='#f59e0b' font-size='11' text-anchor='middle'>(hold for the long run)</text></svg>",
    "caption": "Step 5, three entries: a pullback limit on a strong zone; a breakout (HTF supply removed, buy H1 demands above the H1 trendline); a flip area with confirmation after the H1 trendline break."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r53ca' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r53cg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Holding a swing: moving the stop</text><rect x='124' y='244' width='476' height='18' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='596' y='257.0' fill='#22c55e' font-size='11' text-anchor='end'>D1 (H1 -&gt; becomes H4)</text><rect x='234' y='186' width='366' height='18' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='596' y='199.0' fill='#22c55e' font-size='11' text-anchor='end'>D2</text><rect x='344' y='128' width='256' height='18' fill='#22c55e22' stroke='#22c55e' stroke-width='1.2'/><text x='596' y='141.0' fill='#22c55e' font-size='11' text-anchor='end'>D3</text><polyline points='40,300 110,230 140,252 220,170 250,194 330,112 360,136 450,60' fill='none' stroke='#94a3b8' stroke-width='2.2' stroke-linejoin='round' marker-end='url(#r53cg)'/><line x1='40' y1='272' x2='300' y2='272' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='4 3'/><text x='160' y='286' fill='#ef4444' font-size='11' text-anchor='start'>SL at start</text><line x1='250' y1='214' x2='520' y2='214' stroke='#ef4444' stroke-width='1.2' stroke-dasharray='4 3'/><text x='254' y='228' fill='#ef4444' font-size='11' text-anchor='start'>SL moved under D2 once D3 forms</text><text x='16' y='52' fill='#94a3b8' font-size='11' text-anchor='start'>Swing hold: one zone is left as a buffer, because a reversal needs</text><text x='16' y='68' fill='#94a3b8' font-size='11' text-anchor='start'>a trendline cross + one zone removed + a second zone removed.</text><text x='16' y='330' fill='#f59e0b' font-size='11' text-anchor='start'>Can not watch the screen? Use a trailing stop sized to the</text><text x='16' y='346' fill='#f59e0b' font-size='11' text-anchor='start'>distance to the demand (e.g. 120 pips), set once the weak opposite zone is gone.</text></svg>",
    "caption": "Step 7, swing management: an H1 entry zone grows into an H4 / daily zone. Move the stop under the second-latest demand, keeping one zone as a buffer."
   }
  ],
  "checklist": [
   "1. Which timeframe am I following for direction?",
   "2. Profit margin to the opposite zone: 3x? At least 2x?",
   "3. Is the market ranging or trending? (hold only in a trend)",
   "4. Does this instrument suit my equity and lot size?",
   "5. Which entry: pullback, breakout or flip area?",
   "6. Is there a clear structure, or is price meshing?",
   "7. Exit plan: fixed TP, trailing stop or swing stop moves?"
  ],
  "journalTags": [
   "risk-management",
   "profit-margin-2R",
   "profit-margin-3R",
   "ranging",
   "trending",
   "equity",
   "pullback-entry",
   "breakout-entry",
   "flip-entry",
   "structure",
   "trailing-stop",
   "swing"
  ],
  "newVsPdfs": [
   "Raja's 2-3x margin is close to Kevin's and Seiden's profit-margin / R-multiple filters; Seiden's run-out ≥ 3x zone height is a different measure.",
   "Picking the instrument by account size (no BTC, US30 or bonds on $100; small-spread coins OK) is new; the PDFs do not cover broker or instrument limits.",
   "His breakout entry (buy H1 demands above the H1 trendline after an HTF supply is removed) is similar to Kevin's breakout idea; Seiden prefers waiting for the return to the origin.",
   "The ~2.5x 'impulse vs correction' rule of thumb is Raja's own heuristic, not from either course.",
   "Swing stop management (move to the second-latest zone because a reversal needs a trendline cross + two zones removed) applies his reversal rule; Kevin trails behind new demand/supply in a similar way.",
   "Trailing-stop sizing by the pip distance to the demand is new."
  ]
 },
 {
  "n": 54,
  "title": "Live Pair Review: HTF direction, 15-minute entries and the departure candle",
  "kind": "video",
  "summary": "A live review across forex pairs, indices and crypto. The routine: read direction and the target on the monthly / weekly, check the daily trendline and zones, then go to the 15-minute chart for a fresh zone and use the 5-minute only as confirmation. A trendline counts as broken only when a big departure candle closes beyond it; small candles drifting across do not count. Zones built from long, lengthy candles are not basing zones.",
  "sections": [
   {
    "heading": "The top-down routine",
    "points": [
     "Monthly: is price above or below the trendline, and is it in a monthly demand or supply? This gives the direction and whether there are 'buy pips' or 'sell pips'.",
     "Weekly / daily: is there a zone? Has the daily crossed its trendline? With no supply above and the daily pushing up, the market can move up more.",
     "15 minute: use the fresh demand (for a buy) above the trendline. This is the entry chart.",
     "5 minute: confirmation, used as a backup when you found the trade on the 15m. He prefers 15m because it is easy to read; 1m is risky and gives poor signals.",
     "His summary: find the target from the high timeframe, use the low timeframe for the entry."
    ]
   },
   {
    "heading": "The departure candle",
    "points": [
     "A change of direction needs a proper departure candle: a big candle that closes below (or above) the trendline.",
     "If a lot of small candles cross the trendline without a departure candle, wait.",
     "Once the departure candle has closed beyond the line, the market can drop any time and you have a new zone for the trade.",
     "He combines three things for a stronger signal: price crosses the zone, crosses the trendline, and removes the opposite zone."
    ]
   },
   {
    "heading": "Pair notes (examples he walked through)",
    "points": [
     "A pair in monthly demand but below the monthly trendline: the weekly had no demand, the daily was crossing its trendline with no supply above, so he looked for a 15m fresh demand to buy.",
     "AUDJPY (likely): pushing up on the monthly but below the weekly trendline. Better to wait for the supply to be removed before buying; with no buy pips he would rather wait for a sell after a full departure candle on the 15m.",
     "CADJPY: the daily was heading into a supply that is still below the trendline, so sell from that fresh supply. A student who sold got stopped out because the H4 supply was an overlap zone with a demand there.",
     "Long, lengthy candles are not considered basing; only the real base is a zone.",
     "Bitcoin: the student bought the last demand; Raja told him to move the stop up and hold. Bitcoin cash was near demand; DOT was in the low curve area (likely: near the bottom of the HTF range), so wait for the demand.",
     "US30 / NAS100 / UK100 / US500 / US2000: US30 was in the high curve area with a once-tested (weak) zone. UK100 was stuck in a weak supply (confirmation only). US2000 sat in weekly demand and had crossed the trendline ('90% chance for the buy').",
     "USDJPY: up on the weekly, the daily zone weak; trade the H1 / H4 zone.",
     "EURCHF: the monthly had already dropped a lot; use a 15m demand above the trendline for a buy.",
     "A pair where the supply had been removed: only buys, no sells. A demand retested many times can break.",
     "NZDCAD on 5m: already in demand; to drop it must break that demand first, so hold the long from the only zone.",
     "USDCNH: removed one demand and respected the second; the zone was not great but it was the lower-timeframe zone that held."
    ]
   },
   {
    "heading": "Side remarks",
    "points": [
     "Pairs driven by market makers tend to go into profit after a few hours or days if the direction is right.",
     "He expects Bitcoin to reach 100k because of the halving (transcribed 'heavily'), which halves new supply (his view, not a rule of the method).",
     "Set & forget on a strong zone; confirmation on 1m is risky, so prefer 15m with 5m confirmation.",
     "Practice makes perfect: it looks simple when he explains it and harder on your own chart."
    ]
   }
  ],
  "rules": [
   "Direction and target come from monthly / weekly; never enter from them.",
   "Entry on a fresh 15m zone on the correct side of the trendline; 5m only for confirmation.",
   "A trendline break needs a big departure candle closing beyond it; small candles drifting across do not count.",
   "Do not buy into a supply that has not been removed; wait for its removal (or sell it).",
   "Long, lengthy candles are not a base.",
   "If the supply above is removed, look only for buys."
  ],
  "mistakes": [
   "Taking a trendline break on a series of small candles.",
   "Using the 1m chart for confirmation.",
   "Selling from an H4 supply that overlaps a demand (it gets run over).",
   "Not moving the stop once the trade has moved off the last demand.",
   "Buying in the high curve area from a zone already tested once."
  ],
  "quotes": [
   "You find the target from the high time frame, use the low time frame for the entry.",
   "Wait for a proper departure candle that closes below the trend line.",
   "Practice makes perfect."
  ],
  "diagrams": [],
  "figures": [
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r54aa' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r54ag' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><line x1='320' y1='40' x2='320' y2='345' stroke='#94a3b8' stroke-width='1' stroke-dasharray='3 4'/><line x1='20' y1='162.2' x2='300' y2='215.9' stroke='#a78bfa' stroke-width='1.8'/><line x1='40' y1='137' x2='40' y2='153' stroke='#ef4444' stroke-width='1.5'/><rect x='35.5' y='140' width='9' height='10' fill='#ef4444' rx='1'/><line x1='58' y1='147' x2='58' y2='165' stroke='#ef4444' stroke-width='1.5'/><rect x='53.5' y='150' width='9' height='12' fill='#ef4444' rx='1'/><line x1='76' y1='159' x2='76' y2='173' stroke='#ef4444' stroke-width='1.5'/><rect x='71.5' y='162' width='9' height='8' fill='#ef4444' rx='1'/><line x1='94' y1='167' x2='94' y2='181' stroke='#ef4444' stroke-width='1.5'/><rect x='89.5' y='170' width='9' height='8' fill='#ef4444' rx='1'/><line x1='112' y1='175' x2='112' y2='187' stroke='#ef4444' stroke-width='1.5'/><rect x='107.5' y='178' width='9' height='6' fill='#ef4444' rx='1'/><line x1='130' y1='181' x2='130' y2='195' stroke='#ef4444' stroke-width='1.5'/><rect x='125.5' y='184' width='9' height='8' fill='#ef4444' rx='1'/><line x1='148' y1='189' x2='148' y2='203' stroke='#ef4444' stroke-width='1.5'/><rect x='143.5' y='192' width='9' height='8' fill='#ef4444' rx='1'/><line x1='166' y1='197' x2='166' y2='209' stroke='#ef4444' stroke-width='1.5'/><rect x='161.5' y='200' width='9' height='6' fill='#ef4444' rx='1'/><line x1='184' y1='203' x2='184' y2='217' stroke='#ef4444' stroke-width='1.5'/><rect x='179.5' y='206' width='9' height='8' fill='#ef4444' rx='1'/><line x1='202' y1='211' x2='202' y2='223' stroke='#ef4444' stroke-width='1.5'/><rect x='197.5' y='214' width='9' height='6' fill='#ef4444' rx='1'/><line x1='220' y1='213' x2='220' y2='223' stroke='#22c55e' stroke-width='1.5'/><rect x='215.5' y='216' width='9' height='4' fill='#22c55e' rx='1'/><line x1='238' y1='213' x2='238' y2='227' stroke='#ef4444' stroke-width='1.5'/><rect x='233.5' y='216' width='9' height='8' fill='#ef4444' rx='1'/><line x1='256' y1='221' x2='256' y2='233' stroke='#ef4444' stroke-width='1.5'/><rect x='251.5' y='224' width='9' height='6' fill='#ef4444' rx='1'/><line x1='274' y1='227' x2='274' y2='239' stroke='#ef4444' stroke-width='1.5'/><rect x='269.5' y='230' width='9' height='6' fill='#ef4444' rx='1'/><text x='160' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>Small candles drifting across</text><text x='160' y='290' fill='#94a3b8' font-size='11' text-anchor='middle'>No clear departure candle:</text><text x='160' y='306' fill='#f59e0b' font-size='11' text-anchor='middle'>NOT a proper trendline break, wait</text><line x1='320' y1='105.0' x2='610' y2='177.5' stroke='#a78bfa' stroke-width='1.8'/><line x1='350' y1='125' x2='350' y2='143' stroke='#22c55e' stroke-width='1.5'/><rect x='344.5' y='128' width='11' height='12' fill='#22c55e' rx='1'/><line x1='372' y1='115' x2='372' y2='131' stroke='#22c55e' stroke-width='1.5'/><rect x='366.5' y='118' width='11' height='10' fill='#22c55e' rx='1'/><line x1='394' y1='115' x2='394' y2='129' stroke='#ef4444' stroke-width='1.5'/><rect x='388.5' y='118' width='11' height='8' fill='#ef4444' rx='1'/><line x1='416' y1='123' x2='416' y2='135' stroke='#ef4444' stroke-width='1.5'/><rect x='410.5' y='126' width='11' height='6' fill='#ef4444' rx='1'/><line x1='438' y1='125' x2='438' y2='135' stroke='#22c55e' stroke-width='1.5'/><rect x='432.5' y='128' width='11' height='4' fill='#22c55e' rx='1'/><line x1='460' y1='125' x2='460' y2='137' stroke='#ef4444' stroke-width='1.5'/><rect x='454.5' y='128' width='11' height='6' fill='#ef4444' rx='1'/><line x1='482' y1='131' x2='482' y2='143' stroke='#ef4444' stroke-width='1.5'/><rect x='476.5' y='134' width='11' height='6' fill='#ef4444' rx='1'/><line x1='504' y1='135' x2='504' y2='143' stroke='#22c55e' stroke-width='1.5'/><rect x='498.5' y='138' width='11' height='2' fill='#22c55e' rx='1'/><line x1='526' y1='134' x2='526' y2='204' stroke='#ef4444' stroke-width='1.5'/><rect x='520.5' y='138' width='11' height='62' fill='#ef4444' rx='1'/><line x1='548' y1='196' x2='548' y2='218' stroke='#ef4444' stroke-width='1.5'/><rect x='542.5' y='200' width='11' height='14' fill='#ef4444' rx='1'/><line x1='570' y1='210' x2='570' y2='230' stroke='#ef4444' stroke-width='1.5'/><rect x='564.5' y='214' width='11' height='12' fill='#ef4444' rx='1'/><line x1='476' y1='180' x2='514' y2='180' stroke='#f59e0b' stroke-width='1.2' marker-end='url(#r54aa)'/><text x='472' y='176' fill='#f59e0b' font-size='11' text-anchor='end'>departure</text><text x='472' y='190' fill='#f59e0b' font-size='11' text-anchor='end'>candle</text><text x='480' y='52' fill='#94a3b8' font-size='12' text-anchor='middle' font-weight='600'>One big candle closes below</text><text x='480' y='290' fill='#94a3b8' font-size='11' text-anchor='middle'>Full-bodied candle closes beyond the</text><text x='480' y='306' fill='#f59e0b' font-size='11' text-anchor='middle'>trendline -&gt; the break is real</text></svg>",
    "caption": "Left: small candles drift across the line, so it is not a proper break. Right: one full-bodied departure candle closes beyond the trendline, so the break is real."
   },
   {
    "svg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 360' font-family='Inter, system-ui, sans-serif'><defs><marker id='r54ba' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#f59e0b'/></marker><marker id='r54bg' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' fill='#94a3b8'/></marker></defs><text x='16' y='24' fill='#94a3b8' font-size='14' text-anchor='start' font-weight='600'>Top-down routine</text><rect x='12' y='90' width='140' height='110' rx='8' fill='#94a3b814' stroke='#94a3b8' stroke-width='1.2'/><text x='82.0' y='112' fill='#94a3b8' font-size='13' text-anchor='middle' font-weight='600'>Monthly / Weekly</text><text x='82.0' y='132' fill='#94a3b8' font-size='11' text-anchor='middle'>direction only</text><text x='82.0' y='148' fill='#94a3b8' font-size='11' text-anchor='middle'>target zone</text><text x='82.0' y='164' fill='#94a3b8' font-size='11' text-anchor='middle'>buy or sell pips?</text><rect x='170' y='90' width='140' height='110' rx='8' fill='#a78bfa14' stroke='#a78bfa' stroke-width='1.2'/><text x='240.0' y='112' fill='#a78bfa' font-size='13' text-anchor='middle' font-weight='600'>Daily / H4</text><text x='240.0' y='132' fill='#94a3b8' font-size='11' text-anchor='middle'>trendline + zones</text><text x='240.0' y='148' fill='#94a3b8' font-size='11' text-anchor='middle'>zone removed?</text><text x='240.0' y='164' fill='#94a3b8' font-size='11' text-anchor='middle'>pips left</text><rect x='328' y='90' width='140' height='110' rx='8' fill='#22c55e14' stroke='#22c55e' stroke-width='1.2'/><text x='398.0' y='112' fill='#22c55e' font-size='13' text-anchor='middle' font-weight='600'>15 minute</text><text x='398.0' y='132' fill='#94a3b8' font-size='11' text-anchor='middle'>fresh strong zone</text><text x='398.0' y='148' fill='#94a3b8' font-size='11' text-anchor='middle'>with the trendline</text><text x='398.0' y='164' fill='#94a3b8' font-size='11' text-anchor='middle'>for the entry</text><rect x='486' y='90' width='140' height='110' rx='8' fill='#f59e0b14' stroke='#f59e0b' stroke-width='1.2'/><text x='556.0' y='112' fill='#f59e0b' font-size='13' text-anchor='middle' font-weight='600'>5 minute</text><text x='556.0' y='132' fill='#94a3b8' font-size='11' text-anchor='middle'>confirmation</text><text x='556.0' y='148' fill='#94a3b8' font-size='11' text-anchor='middle'>(backup) when the</text><text x='556.0' y='164' fill='#94a3b8' font-size='11' text-anchor='middle'>15m zone is weak</text><line x1='154' y1='145' x2='168' y2='145' stroke='#f59e0b' stroke-width='1.6' marker-end='url(#r54ba)'/><line x1='312' y1='145' x2='326' y2='145' stroke='#f59e0b' stroke-width='1.6' marker-end='url(#r54ba)'/><line x1='470' y1='145' x2='484' y2='145' stroke='#f59e0b' stroke-width='1.6' marker-end='url(#r54ba)'/><text x='16' y='250' fill='#94a3b8' font-size='12' text-anchor='start' font-weight='600'>Target from the high timeframe, entry from the low timeframe.</text><text x='16' y='270' fill='#94a3b8' font-size='11' text-anchor='start'>1-minute charts are too noisy; 15m for the setup, 5m for confirmation.</text><text x='16' y='290' fill='#94a3b8' font-size='11' text-anchor='start'>A big stop is not affordable: the HTF is never used for the entry itself.</text></svg>",
    "caption": "Raja's top-down routine: monthly / weekly direction, daily / H4 trendline and zones, 15m fresh zone for the entry, 5m confirmation."
   }
  ],
  "checklist": [
   "Monthly / weekly: direction, buy pips or sell pips, which zone is the target?",
   "Daily / H4: trendline crossed? Is price sitting inside an opposite zone?",
   "Did a big departure candle close beyond the trendline?",
   "15m: is there a fresh zone on the correct side of the trendline?",
   "Need 5m confirmation? (weak or tested zone)",
   "Is the zone a real base, not long lengthy candles? Any overlap?"
  ],
  "journalTags": [
   "top-down",
   "15m-entry",
   "5m-confirmation",
   "departure-candle",
   "trendline-break",
   "fresh-zone",
   "overlap-zone",
   "high-curve",
   "low-curve"
  ],
  "newVsPdfs": [
   "Kevin's departure (leg-out) strength is about the move away from a base; Raja uses 'departure candle' for the candle that breaks the trendline. Same quality idea, applied to the trendline break.",
   "The fixed 15m entry / 5m confirmation pairing is Raja's preference; Kevin's confirmation pairs depend on the trading timeframe.",
   "'High curve / low curve area' matches the curve location (buy low, sell high in the HTF range) in Kevin's and Seiden's material.",
   "Removing a long-candle range as 'not a base' matches the course's basing-candle definition (body < 50% of range)."
  ]
 }
];
