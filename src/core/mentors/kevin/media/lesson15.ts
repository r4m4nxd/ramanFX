import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: his 5m sketch (06:33 / 10:44): price contacts the 1H demand, a new 5m demand removes the supplies; pullback vs breakout entry.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs>
<marker id="km15_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#22c55e"/></marker>
<marker id="km15_arr1b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker>
</defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Confirmation on the 5m inside a 1H demand</text>
<rect x="20" y="292" width="600" height="40" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="326" font-size="10.5" text-anchor="end" fill="#22c55e">HTF (1H) demand</text>
<line x1="30" y1="52" x2="470" y2="186" stroke="#a78bfa" stroke-width="1.5"/>
<text x="474" y="196" font-size="10" fill="#a78bfa">5m downtrend line</text>
<rect x="246" y="150" width="374" height="22" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<rect x="262" y="198" width="358" height="20" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="146" font-size="10" text-anchor="end" fill="#ef4444">5m supply</text>
<text x="612" y="232" font-size="10" text-anchor="end" fill="#ef4444">5m supply</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,60 80,130 120,96 170,170 210,112 230,128 244,156 256,162 270,204 280,210 296,312 306,318 316,268 326,262 340,266 352,214 364,160 378,120 392,108"/>
<rect x="316" y="258" width="304" height="12" fill="#22c55e44" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="284" font-size="10" text-anchor="end" fill="#22c55e">new 5m demand</text>
<g fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">
<circle cx="301" cy="315" r="10" fill="none" stroke="#f59e0b" stroke-width="1.4"/><text x="301" y="348">1</text>
<circle cx="370" cy="150" r="10" fill="none" stroke="#f59e0b" stroke-width="1.4"/><text x="352" y="138">2</text>
</g>
<path d="M392,108 L420,190 L436,262" fill="none" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="5 3"/>
<path d="M436,262 L470,150 L500,70" fill="none" stroke="#22c55e" stroke-width="1.6" marker-end="url(#km15_arr1)"/>
<line x1="352" y1="140" x2="460" y2="140" stroke="#f59e0b" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="464" y="137" font-size="10" fill="#f59e0b">buy stop (breakout)</text>
<text x="20" y="196" font-size="10.5" fill="#94a3b8">1) price contacts the HTF zone</text>
<text x="20" y="212" font-size="10.5" fill="#94a3b8">2) new 5m demand removes the</text>
<text x="20" y="226" font-size="10.5" fill="#94a3b8">supplies (+ the trendline) = confirmation</text>
<text x="20" y="250" font-size="10.5" fill="#22c55e">Pullback: limit at the new demand (~10R)</text>
<text x="20" y="266" font-size="10.5" fill="#f59e0b">Breakout: buy above supply, stop under</text>
<text x="20" y="280" font-size="10.5" fill="#f59e0b">the basing (~1.5R, higher win rate)</text>
<text x="500" y="62" font-size="10.5" fill="#22c55e">TP</text>
</svg>`;

// Figure 2: the "Timeframes To Trade" table he opens on screen (06:34 and again at 44:00).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="26" font-size="14" font-weight="700" fill="#94a3b8">Timeframes To Trade (his slide)</text>
<g font-size="12.5" font-weight="700" text-anchor="middle">
<rect x="60" y="44" width="520" height="34" rx="4" fill="#ef444418" stroke="#ef4444"/>
<text x="147" y="66" fill="#ef4444">Entry Timeframe</text>
<text x="320" y="66" fill="#ef4444">Higher Timeframe</text>
<text x="493" y="66" fill="#ef4444">Higher Timeframe +1</text>
</g>
<g stroke="#94a3b8" stroke-opacity="0.5">
<line x1="233" y1="44" x2="233" y2="300"/><line x1="406" y1="44" x2="406" y2="300"/>
<line x1="60" y1="120" x2="580" y2="120"/><line x1="60" y1="156" x2="580" y2="156"/><line x1="60" y1="192" x2="580" y2="192"/><line x1="60" y1="228" x2="580" y2="228"/><line x1="60" y1="264" x2="580" y2="264"/>
<rect x="60" y="78" width="520" height="222" fill="none"/>
</g>
<rect x="61" y="193" width="518" height="34" fill="#22c55e22"/>
<g font-size="13" fill="#94a3b8" text-anchor="middle">
<text x="147" y="104">1m</text><text x="320" y="104">15m</text><text x="493" y="104">4H</text>
<text x="147" y="143">5m</text><text x="320" y="143">1H</text><text x="493" y="143">1D</text>
<text x="147" y="179">15m</text><text x="320" y="179">4H</text><text x="493" y="179">1W</text>
<text x="147" y="215" fill="#22c55e" font-weight="700">1H</text><text x="320" y="215" fill="#22c55e" font-weight="700">1D</text><text x="493" y="215" fill="#22c55e" font-weight="700">1M</text>
<text x="147" y="251">4H</text><text x="320" y="251">1W</text><text x="493" y="251">3M</text>
<text x="147" y="287">1D</text><text x="320" y="287">1M</text><text x="493" y="287">6M</text>
</g>
<text x="20" y="324" font-size="11" fill="#22c55e">Highlighted: his own plan (1H entries inside daily zones, monthly curve).</text>
<text x="20" y="342" font-size="11" fill="#94a3b8">A guide, "not the Bible": refine further (1m into 1H, 5m into 4H) only with a bigger R:R target.</text>
</svg>`;

// Figure 3: the gold homework (MTA-D1 → HTF-H1 → ETF-5m) and his note on where the supply distal goes.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Homework: stacking supply (XAUUSD) and drawing the distal</text>
<rect x="20" y="50" width="330" height="240" fill="#ef444418" stroke="#ef4444" stroke-width="1.4"/>
<text x="30" y="70" font-size="12" font-weight="700" fill="#ef4444">MTA · D1 supply</text>
<text x="30" y="86" font-size="10" fill="#ef4444">1950.420–1967.920</text>
<rect x="60" y="104" width="290" height="44" fill="#ef444430" stroke="#ef4444" stroke-width="1.4"/>
<text x="70" y="122" font-size="11" font-weight="700" fill="#ef4444">HTF · H1 supply</text>
<rect x="150" y="128" width="200" height="14" fill="#a78bfa44" stroke="#a78bfa" stroke-width="1.4"/>
<text x="160" y="139" font-size="10" font-weight="700" fill="#a78bfa">ETF · 5m supply</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.6" points="30,240 60,200 90,230 120,170 140,150 150,136 158,142 170,200 190,260 210,230 230,250 260,180 280,148 300,190 330,270"/>
<text x="30" y="312" font-size="10.5" fill="#94a3b8">5m at the extreme of a 1H inside a daily: ~10:1+,</text>
<text x="30" y="328" font-size="10.5" fill="#94a3b8">but the deep refine needs a far target (opposing zone)</text>
<text x="30" y="344" font-size="10.5" fill="#94a3b8">or stops moved.</text>
<line x1="372" y1="44" x2="372" y2="350" stroke="#94a3b8" stroke-opacity="0.35"/>
<text x="390" y="50" font-size="12" font-weight="700" fill="#f59e0b">Distal on the wick</text>
<g stroke-width="1.2">
<line x1="420" y1="200" x2="420" y2="250" stroke="#22c55e"/><rect x="414" y="206" width="12" height="40" fill="#22c55e"/>
<line x1="440" y1="98" x2="440" y2="210" stroke="#22c55e"/><rect x="434" y="128" width="12" height="80" fill="#22c55e"/>
<line x1="460" y1="84" x2="460" y2="140" stroke="#ef4444"/><rect x="454" y="116" width="12" height="16" fill="#ef4444"/>
<line x1="480" y1="112" x2="480" y2="250" stroke="#ef4444"/><rect x="474" y="120" width="12" height="120" fill="#ef4444"/>
<line x1="500" y1="236" x2="500" y2="290" stroke="#ef4444"/><rect x="494" y="242" width="12" height="40" fill="#ef4444"/>
</g>
<rect x="434" y="84" width="186" height="44" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<line x1="434" y1="84" x2="620" y2="84" stroke="#f59e0b" stroke-width="1.6"/>
<text x="616" y="78" font-size="10" text-anchor="end" fill="#f59e0b">distal = top of the wick</text>
<text x="616" y="142" font-size="10" text-anchor="end" fill="#ef4444">proximal = base</text>
<text x="390" y="304" font-size="10.5" fill="#94a3b8">"Just make sure your distal line</text>
<text x="390" y="319" font-size="10.5" fill="#94a3b8">is attached to the wick on the top.</text>
<text x="390" y="334" font-size="10.5" fill="#94a3b8">Use the magnet tool."</text>
<text x="390" y="350" font-size="10" fill="#f59e0b">Leaves a little space; fast move away.</text>
</svg>`;

export const KM_15: KevinMedia = {
  n: 15,
  images: [
    {
      src: '/lessons/kevin/15/f-002.jpg',
      caption: '[00:33] EURUSD 1h (OANDA): he draws a green higher-timeframe demand box under the rally and opens the text tool to label it.',
      notes: [
        'Step one of confirmation: mark the HTF zone first. In his example it is a 1H demand.',
        'He labels zones as "HTF" for higher timeframe on his charts.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-009.jpg',
      caption: '[10:44] His hand-drawn 5m sketch on EURUSD: price falls from a peak into the green HTF demand at the bottom, turns up in a V, forms a small green 5m demand, and an arrow points up through two salmon 5m supply zones.',
      notes: [
        'Step 1: price must contact the HTF zone.',
        'Step 2: the new 5m demand removes the opposing 5m supplies above it. That removal is the confirmation.',
        'Pullback method: buy the new 5m demand with a limit. Breakout method: buy above the supply with the stop under the basing.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-005.jpg',
      caption: '[06:36] "Timeframes To Trade - Use these timeframe combinations". Entry / Higher / Higher +1: 1m/15m/4H, 5m/1H/1D, 15m/4H/1W, 1H/1D/1M, 4H/1W/3M, 1D/1M/6M.',
      notes: [
        'Pick the entry timeframe that fits your personality and schedule, then read the higher and curve timeframes across the row.',
        'His own row is 1H entries inside daily zones.',
        'He calls the chart a guide, not "the Bible".',
      ],
    },
    {
      src: '/lessons/kevin/15/f-012.jpg',
      caption: '[13:09] EURUSD four-pane (W, 1h, D, 1m). The 1h has a demand at 1.11803–1.11962 under the current consolidation near 1.1227.',
      notes: ['He uses this 1h demand as the live version of the sketch: a 1H zone with a lower timeframe for confirmation.'],
    },
    {
      src: '/lessons/kevin/15/f-013.jpg',
      caption: '[13:29] GBPUSD weekly: price is pushing into the weekly supply (1.29736), above weekly demands 1.23081–1.25087 and 1.11468–1.16084, after breaking a falling trendline.',
      notes: ['Counter-trend case: a weekly supply against a strong daily uptrend. Look for extra confirmation on the 4H rather than a set & forget.'],
    },
    {
      src: '/lessons/kevin/15/f-015.jpg',
      caption: '[35:01] EURUSD daily uptrend (green arrow, rising trendline) into daily supply 1.11926–1.12744 (1.13055 above). Daily demands 1.08336–1.08792, 1.04833–1.06044 and 1.02904–1.03733, a dotted "3m Proximal" at 1.10657, and "TARGET" at 1.00084.',
      notes: [
        'The member\'s question was about shorting this daily supply. The weekly momentum and daily trend are both up, so he is not interested without confirmation.',
        'Targets: the nearby area, about 1.11 for a big move, or a fixed 2:1–3:1 from your own testing.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-016.jpg',
      caption: '[38:30] EURUSD four-pane. Weekly: up-arrow, "3m Distal"/"3m Proximal" dotted lines, demand 1.04833–1.07023. 4h: supply 1.12399–1.12744, demand 1.11247–1.11541. Daily: supplies 1.11926–1.12744 and 1.13055–1.13909, demand 1.08336–1.08792. 1h: supply 1.12770–1.12940, demand 1.11807–1.11962, rising trendline.',
      notes: ['Price is inside the daily supply while every trend arrow points up. That is why a 1H short here would be against both the weekly momentum and the daily trend.'],
    },
    {
      src: '/lessons/kevin/15/f-017.jpg',
      caption: '[39:08] EURUSD 1h close-up: demand 1.11803–1.11962 at the base of the last leg up. Price is chopping above it near 1.122.',
      notes: ['The 1H demand has to break before any short idea off the daily supply even starts.'],
    },
    {
      src: '/lessons/kevin/15/f-019.jpg',
      caption: '[44:00] AUDUSD four-pane. Weekly: purple demand around 0.627–0.647. 4h: up-arrow, demands 0.66826–0.67243 and 0.67818–0.67992. Daily demand 0.66218–0.66950 and a grey zone 0.64583–0.65174. 1h supply 0.68838–0.68951, demand near 0.669.',
      notes: ['An example of with-trend structure: 4h demand inside the daily and weekly demand picture, which is a set & forget candidate rather than one that needs confirmation.'],
    },
    {
      src: '/lessons/kevin/15/f-022.jpg',
      caption: '[44:39] NATGASUSD 6M (MACRO layout): supply 11.109–13.601 and a purple 6-month demand 1.414–2.271 that price is sitting just above.',
      notes: ['Six-month demand in control (weekly too), so a daily zone here counts as daily confirmation and is "very likely to work".'],
    },
    {
      src: '/lessons/kevin/15/f-028.jpg',
      caption: '[48:55] NATGASUSD four-pane. Weekly: demand 1.780–2.114, dotted "6m Proximal". 4h: supply 2.580–2.614 and red down-arrow. Daily: purple demand 2.194–2.313, demand 1.904–2.062. 1h: supply about 2.53–2.558 on a falling trendline, demand 2.424–2.448, down-arrow.',
      notes: [
        'The natural gas reel example lives here: he took all three stacked zones, only the bottom one worked, and he still made a lot because of R:R.',
        'The lower timeframes are pulling back into the daily demand stack.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-031.jpg',
      caption: '[49:03] Discord #homework (FX Telepath PRO). Kevin\'s reply to a "Rally Base Drop 15 min" post: "Just make sure your distal line is attached to the wick on the top. Use the magnet tool." Below it: "Lesson 4 - Multiple timeframe analysis. HTF is H4 Demand zone" on GBPJPY 4h.',
      notes: [
        'For supply, the distal is the top of the highest wick, snapped with TradingView\'s magnet.',
        'The same channel shows members labelling their charts MTA / HTF / ETF.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-032.jpg',
      caption: '[49:04] #homework: "US30, HTF is 4H, ETF 15 min, is it valid to enter buy trade here?" Kevin: "It would be yes, as a set and forget. The H4 trending up would be the best scenario and less riskier." Then: "If the H4 is downtrending? You could still take the trade, it\'s just more risky at that point. And you should be aggressive with your trade management."',
      notes: ['A with-trend HTF makes a set & forget fine. Against the HTF trend you can still trade it, but manage it aggressively.'],
    },
    {
      src: '/lessons/kevin/15/f-033.jpg',
      caption: '[49:07] #homework: "If H4 is having uptrend but Daily and weekly are having downtrend, can we enter buy from H4 demand level?" Kevin: "I would only really say using day trading confirmation is the best thing to in that situation… extra confirmation is needed." "Aggressive" means "move your stops to breakeven soonest. And have a TP that isn\'t asking too much based on the overall downtrend."',
      notes: [
        'Counter-trend relative to the bigger picture means use confirmation, not set & forget.',
        'Aggressive management is defined on screen: breakeven sooner and a modest TP.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-044.jpg',
      caption: '[51:05] Member homework, XAUUSD 5m (Lesson 7, Multiple Sequence Analysis): the whole chart sits inside the "MTA - D1" supply (1950.420–1967.920). A green "HTF - H1" box sits near the top, with a yellow "ETF - 5m" box inside it.',
      notes: [
        'Daily supply, then a 1H supply, then a 5m supply at the extreme. Refined this far, it gives about 10:1 or more.',
        'A refine that deep needs a bigger target (the opposing zone) or moved stops.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-046.jpg',
      caption: '[51:42] The same homework\'s "MTA- D1" chart: XAUUSD daily supplies 1950.420–1967.920 (price inside), 1970.348–1985.390 and 2035.230–2075.282.',
      notes: ['The daily supply is the macro zone in control for the gold short idea.'],
    },
    {
      src: '/lessons/kevin/15/f-047.jpg',
      caption: '[51:46] The homework\'s "HTF - H1" chart: XAUUSD 1h with the H1 zone (drawn in green) near 1961–1963 at the top of a range, and price dropping away from it.',
      notes: [
        'He says the 1H zone\'s move away wasn\'t great, but the basing was identified well.',
        'He would draw it to the wick to leave a little space.',
      ],
    },
    {
      src: '/lessons/kevin/15/f-055.jpg',
      caption: '[52:34] Homework Lesson 8 (trend trading, HTF W1 / ETF H4): USDCAD weekly with supply 1.39643–1.41171, demands 1.29539–1.31746 and 1.25215–1.26240, a rising weekly trendline, and a purple box over the range lows.',
      notes: ['Weekly demand in a weekly uptrend: a 4H confirmation off it is tradable and with the trend.'],
    },
    {
      src: '/lessons/kevin/15/f-056.jpg',
      caption: '[52:38] The same homework on USDCAD 4h: supplies 1.33651–1.33870 and 1.32843–1.32997, a red down-arrow, a broken rising trendline, and a 4h demand around 1.3159–1.3174. Kevin draws a blue "V": dip into the demand, then rally.',
      notes: ['The member asked whether the zone is tradable when the 4h (the entry timeframe) is not in an uptrend. Kevin\'s blue path shows the pullback into the 4h demand he expects to work, because the weekly trend is up.'],
    },
    {
      src: '/lessons/kevin/15/f-062.jpg',
      caption: '[53:24] Homework Lesson 8, GBPUSD 1h (HTF D1, ETF H1, both in uptrend): a large demand 1.27504–1.28684 with a yellow entry zone in its lower part, a deeper demand from 1.25858 on a rising trendline, and a black box around the latest high.',
      notes: [
        'Valid with the trend only if the pullback comes before price reaches or breaks the trendline.',
        'A slow pullback that reaches the trendline is "very low odds" to even take place.',
      ],
    },
  ],
  figures: [
    { svg: fig1, caption: 'His 5m confirmation sketch: (1) price contacts the 1H demand; (2) a new 5m demand removes the opposing 5m supplies and the downtrend line. Pullback entry at the new demand (his choice, about 10R) or breakout entry above the supply with the stop under the basing (about 1.5R).' },
    { svg: fig2, caption: 'The "Timeframes To Trade" slide he shows twice: entry, higher and higher+1 timeframe for each style. His own plan is the 1H → 1D → 1M row.' },
    { svg: fig3, caption: 'The gold homework stack: a 5m supply inside a 1H supply inside the daily supply 1950.420–1967.920, plus his drawing rule from #homework: attach the supply distal to the top of the wick with the magnet tool.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00–00:33 EURUSD 1h, then the four-pane (W, 1h, D, 1m). He draws a green HTF demand box and labels it with the text tool.',
        '06:33–10:44 A hand-drawn 5m sketch: price falls into the green HTF demand, turns up in a V, makes a new 5m demand and pushes through two salmon 5m supplies (the confirmation). Arrows mark the pullback and breakout entries.',
        '06:34–10:29 The "Timeframes To Trade" slide: 1m/15m/4H, 5m/1H/1D, 15m/4H/1W, 1H/1D/1M, 4H/1W/3M, 1D/1M/6M.',
        '13:09 EURUSD four-pane with a 1h demand at 1.11803–1.11962.',
        '13:29 GBPUSD weekly pressing into weekly supply (1.29736) above demand 1.23081–1.25087: the counter-trend case for 4H confirmation.',
        '35:00–39:08 EURUSD daily supply 1.11926–1.12744 in a daily uptrend, the four-pane with every trend arrow up, and the 1h demand 1.11803–1.11962 that would have to break before any short.',
        '44:00 AUDUSD four-pane (4h demands 0.66826–0.67243 and 0.67818–0.67992, daily demand 0.66218–0.66950). The timeframe slide is shown again.',
        '44:39 NATGAS 6M demand 1.414–2.271 (purple), with supply 11.109–13.601 far above.',
        '48:17–48:55 NATGAS four-pane: weekly demand 1.780–2.114, 4h supply 2.580–2.614, daily demand 2.194–2.313, 1h demand 2.424–2.448 on a falling 1h trendline.',
        '48:59–49:07 Discord #homework replies: distal on the wick with the magnet tool, US30 4H/15m as a set & forget, and how to handle an H4 demand against a daily/weekly downtrend (confirmation, then aggressive management).',
        '49:28–51:48 Gold homework: MTA-D1 supply 1950.420–1967.920, then the HTF-H1 zone, then the ETF-5m zone.',
        '52:23–53:11 USDCAD homework: weekly supply 1.39643–1.41171 with demand 1.29539–1.31746 in a weekly uptrend, and the 4h chart with Kevin\'s blue "V" into the 4h demand.',
        '53:24 GBPUSD 1h homework: demand 1.27504–1.28684 with a yellow entry zone and a rising trendline at 1.25858.',
      ],
    },
  ],
  corrections: [
    'The timeframe chart is a slide titled "Timeframes To Trade" with three columns: Entry, Higher, and Higher Timeframe +1. The rows are 1m/15m/4H, 5m/1H/1D, 15m/4H/1W, 1H/1D/1M, 4H/1W/3M and 1D/1M/6M. His own row is 1H → 1D → 1M.',
    'The confirmation example is a hand-drawn sketch on a EURUSD 5m chart: green HTF demand at the bottom, two salmon 5m supplies above, and a new small green 5m demand after the V. It is not a live setup, which matches his remark that no daily zone was in control there.',
    'The "draw the supply to the wick" advice is on screen as a Discord reply: "Just make sure your distal line is attached to the wick on the top. Use the magnet tool." It was a reply to a 15m rally-base-drop.',
    'What "aggressive trade management" means, in his own written reply: "move your stops to breakeven soonest. And have a TP that isn\'t asking too much based on the overall downtrend." This is for an H4 demand bought against a daily and weekly downtrend, where he says day-trading confirmation is the best option.',
    'US30 homework (HTF 4H, ETF 15m): Kevin answered "yes, as a set and forget". An H4 uptrend is the best and least risky case. If the H4 is downtrending, it is still tradable but riskier, with aggressive management.',
    'The gold homework is labelled by the member as "MTA - D1", "HTF - H1" and "ETF - 5m" (multiple-timeframe analysis / higher / entry timeframe). The daily supply on it is 1950.420–1967.920.',
    'Natural gas: the 6-month demand on his 6M chart is the purple zone 1.414–2.271. Weekly demand is 1.780–2.114 and daily demand 2.194–2.313.',
  ],
};
