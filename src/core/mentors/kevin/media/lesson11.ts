import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: EURUSD "flat is a position" (his 05:07 Zoom sketch on the 1h chart).
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km11_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">EURUSD 1h: flat is a position (daily supply in control)</text>
<rect x="30" y="40" width="580" height="34" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="38" y="61" font-size="11" fill="#ef4444">Daily supply 1.09416–1.10070 (in control)</text>
<rect x="330" y="78" width="280" height="14" fill="#ef444422" stroke="#ef4444" stroke-width="1" stroke-dasharray="4 3"/>
<text x="470" y="89" font-size="10" fill="#ef4444">1h supply 1.09724–1.09824</text>
<rect x="120" y="196" width="490" height="28" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="128" y="243" font-size="11" fill="#22c55e">1h demand 1.08991–1.09151</text>
<line x1="60" y1="340" x2="440" y2="206" stroke="#a78bfa" stroke-width="1.6"/>
<text x="64" y="324" font-size="10.5" fill="#a78bfa">1h trendline</text>
<polyline points="40,330 80,300 110,250 120,196 128,140 150,150 170,128 190,160 210,150 235,175 260,160 280,182 300,110 312,150 330,170 350,186 370,176 395,192 420,168 432,198" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/>
<circle cx="300" cy="112" r="14" fill="none" stroke="#f59e0b" stroke-width="1.6"/>
<path d="M286,98 L314,126 M314,98 L286,126" stroke="#ef4444" stroke-width="1.6"/>
<text x="196" y="106" font-size="10.5" fill="#f59e0b">missed entry,</text>
<text x="196" y="119" font-size="10.5" fill="#f59e0b">order pulled</text>
<path d="M432,198 L470,268 L505,224 L585,320" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#km11_arr1)"/>
<text x="452" y="290" font-size="10.5" fill="#f59e0b">1) demand + trendline removed</text>
<text x="452" y="304" font-size="10.5" fill="#f59e0b">2) pull back, 1h confirmation</text>
<text x="452" y="318" font-size="10.5" fill="#f59e0b">3) then shorts</text>
<rect x="190" y="268" width="210" height="40" rx="6" fill="none" stroke="#94a3b8" stroke-opacity="0.6"/>
<text x="200" y="285" font-size="11.5" font-weight="700" fill="#94a3b8">Right now: no trade = FLAT</text>
<text x="200" y="300" font-size="10.5" fill="#94a3b8">Waiting is part of the process.</text>
</svg>`;

// Figure 2: AUDJPY "predict, don't trade" (his 06:36–08:57 drawings on the 4h, weekly and daily panes).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km11_arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker>
<marker id="km11_arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#22c55e"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">AUDJPY, overextended: predict the pullback, don't trade it</text>
<line x1="30" y1="52" x2="610" y2="52" stroke="#ef4444" stroke-width="1.4" stroke-dasharray="6 4"/>
<text x="34" y="46" font-size="10.5" fill="#ef4444">Weekly: "6m Proximal" 97.148 just tagged</text>
<rect x="300" y="58" width="310" height="24" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="470" y="74" font-size="10.5" fill="#ef4444">4h supply 97.071–97.419</text>
<rect x="200" y="196" width="410" height="22" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="470" y="211" font-size="10.5" fill="#22c55e">4h demand 95.026–95.315</text>
<rect x="120" y="290" width="490" height="22" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="400" y="305" font-size="10.5" fill="#22c55e">Daily demand 92.780–93.527</text>
<polyline points="30,330 70,300 100,310 140,250 170,262 205,196 230,205 260,140 280,150 300,70 315,90 330,62 340,92 350,150 362,170 372,180" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/>
<path d="M374,180 Q410,250 440,204 Q470,150 500,110" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#km11_arr2)"/>
<path d="M374,182 L410,240 L430,228 L470,300" fill="none" stroke="#f59e0b" stroke-width="1.4" stroke-dasharray="3 4" marker-end="url(#km11_arr2)"/>
<text x="510" y="120" font-size="10.5" fill="#f59e0b">predicted: dip to 4h</text>
<text x="510" y="133" font-size="10.5" fill="#f59e0b">demand, then up</text>
<text x="478" y="282" font-size="10.5" fill="#f59e0b">or deeper, into daily demand</text>
<g font-size="11" font-weight="700" fill="#22c55e">
<path d="M48,118 L48,92" stroke="#22c55e" stroke-width="2" marker-end="url(#km11_arr3)"/><text x="40" y="132">W</text>
<path d="M80,118 L80,92" stroke="#22c55e" stroke-width="2" marker-end="url(#km11_arr3)"/><text x="73" y="132">D</text>
<path d="M112,118 L112,92" stroke="#22c55e" stroke-width="2" marker-end="url(#km11_arr3)"/><text x="102" y="132">4h</text>
<path d="M144,118 L144,92" stroke="#22c55e" stroke-width="2" marker-end="url(#km11_arr3)"/><text x="134" y="132">1h</text>
</g>
<text x="34" y="152" font-size="10.5" fill="#94a3b8">every trend is up</text>
<text x="34" y="166" font-size="10.5" fill="#94a3b8">→ no short on a prediction</text>
</svg>`;

// Figure 3: one side at a time (long / short / flat) and what lets you switch.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km11_arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Stick to one side: long, short or flat</text>
<rect x="30" y="60" width="170" height="90" rx="8" fill="#22c55e22" stroke="#22c55e" stroke-width="1.6"/>
<text x="115" y="88" text-anchor="middle" font-size="15" font-weight="700" fill="#22c55e">LONG only</text>
<text x="115" y="108" text-anchor="middle" font-size="10.5" fill="#94a3b8">daily uptrend pulling</text>
<text x="115" y="122" text-anchor="middle" font-size="10.5" fill="#94a3b8">into daily demand</text>
<text x="115" y="138" text-anchor="middle" font-size="10.5" fill="#94a3b8">(no shorting the LTF dip)</text>
<rect x="440" y="60" width="170" height="90" rx="8" fill="#ef444422" stroke="#ef4444" stroke-width="1.6"/>
<text x="525" y="88" text-anchor="middle" font-size="15" font-weight="700" fill="#ef4444">SHORT only</text>
<text x="525" y="108" text-anchor="middle" font-size="10.5" fill="#94a3b8">HTF supply in control,</text>
<text x="525" y="122" text-anchor="middle" font-size="10.5" fill="#94a3b8">trend down or lost</text>
<rect x="235" y="220" width="170" height="90" rx="8" fill="none" stroke="#94a3b8" stroke-width="1.6"/>
<text x="320" y="248" text-anchor="middle" font-size="15" font-weight="700" fill="#94a3b8">FLAT</text>
<text x="320" y="268" text-anchor="middle" font-size="10.5" fill="#94a3b8">no setup matches the plan.</text>
<text x="320" y="282" text-anchor="middle" font-size="10.5" fill="#94a3b8">Still a position.</text>
<path d="M205,96 L432,96" stroke="#94a3b8" stroke-width="1.5" marker-end="url(#km11_arr4)"/>
<text x="318" y="78" text-anchor="middle" font-size="10.5" fill="#f59e0b">longs fail and price breaks below</text>
<text x="318" y="90" text-anchor="middle" font-size="10.5" fill="#f59e0b">daily demand: uptrend lost (sideways)</text>
<text x="318" y="116" text-anchor="middle" font-size="10" fill="#94a3b8">(check no weekly demand sits just below)</text>
<path d="M140,156 L250,226" stroke="#94a3b8" stroke-width="1.4" marker-end="url(#km11_arr4)"/>
<path d="M500,156 L392,226" stroke="#94a3b8" stroke-width="1.4" marker-end="url(#km11_arr4)"/>
<text x="40" y="200" font-size="10.5" fill="#94a3b8">nothing qualifies,</text>
<text x="40" y="214" font-size="10.5" fill="#94a3b8">order pulled</text>
<text x="470" y="200" font-size="10.5" fill="#94a3b8">waiting for a zone</text>
<text x="470" y="214" font-size="10.5" fill="#94a3b8">to be removed</text>
<text x="20" y="344" font-size="10.5" fill="#94a3b8">Fewer trades. Counter-trend only when your MSA shows HTF zones in control.</text>
</svg>`;

export const KM_11: KevinMedia = {
  n: 11,
  images: [
    {
      src: '/lessons/kevin/11/f-000_t00m00s.jpg',
      caption: '[00:00] Zoom screen share (recorded 20 Jun 2023), his "Patreon - June" TradingView four-pane on AUDJPY: weekly (top-left) at a dotted "6m Proximal" 97.148, 4h supply 97.071–97.419 with 4h demand 95.026–95.315, daily demands 94.598–95.284 and purple 92.780–93.527, 1h demands 95.484–95.731 and 95.120–95.250 on a rising trendline.',
      notes: [
        'The "mindset" talk is given over live charts, not slides: weekly / 4h / daily / 1h on one screen.',
        'AUDJPY has just dropped hard from the 4h supply after tagging a 6-month supply line on the weekly.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-004_t02m59s.jpg',
      caption: '[02:59] AUDJPY 4h full screen: near-vertical run from purple 93.092–93.360 to a top at about 97.6, base and drop from 4h supply 97.071–97.419, price falling toward 4h demand 95.026–95.315.',
      notes: [
        'This is the move people ask "where is it going?" about. His answer: learn the process so you have your own view.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-007_t04m41s.jpg',
      caption: '[04:41] EURUSD four-pane. Weekly: "3m Distal"/"3m Proximal" 1.10657, demand 1.04833–1.07023, "TARGET" 1.00084. 4h: purple 1.09777–1.09982, demand 1.08146–1.08475. Daily: purple supply 1.09416–1.10070 with price just under it. 1h: purple supply 1.09724–1.09824, demand 1.08991–1.09151 on a rising trendline.',
      notes: [
        'His "being flat" example: the daily supply is in control and the 1h demand is still in play under price.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-009_t05m07s.jpg',
      caption: '[05:07] EURUSD 1h with Zoom pen: the spike high under the 1h/daily supply is circled and crossed out, the 1h demand 1.08991–1.09151 is crossed out, and a sketch shows price breaking below the demand, pulling back up to it and dropping.',
      notes: [
        'The crossed-out spike is the entry he missed; he pulled the order rather than chase.',
        'The X on the demand means "this has to be removed first". Only after a break, a pullback and 1h confirmation would he short.',
        'Until then he has no position, and that is a position.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-012_t05m45s.jpg',
      caption: '[05:45] EURUSD four-pane again: daily price still pinned under purple supply 1.09416–1.10070; 1h price sitting on the demand 1.08991–1.09151 and the trendline.',
      notes: ['Nothing qualifies yet, so he stays out. Not losing money is part of the process.'],
    },
    {
      src: '/lessons/kevin/11/f-014_t06m24s.jpg',
      caption: '[06:24] GBPUSD four-pane while he flips the watchlist: weekly pushing into supplies 1.29643–1.31670 above a falling trendline; 4h stacked demands 1.25102–1.26701 with a circled reaction; daily demand 1.24870–1.25858 on a rising trendline; 1h dropping toward demand 1.26406–1.26673.',
      notes: ['Uptrends on the lower timeframes running into weekly supply: the kind of mixed picture where you pick one side or stay flat.'],
    },
    {
      src: '/lessons/kevin/11/f-015_t06m36s.jpg',
      caption: '[06:36] AUDJPY with Zoom pen on the 4h: a curve from the top of the run down into the 4h demand 95.026–95.315 area.',
      notes: [
        'His prediction: an overextended JPY pair should pull back.',
        'He draws the prediction but says he would not trade it.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-016_t06m49s.jpg',
      caption: '[06:49] EURJPY four-pane: weekly at supply 154.918–156.838 after a vertical run (green up-arrow), demands 142.650–145.111 and 138.830; 4h stacked demands 152.716–153.689 and 150.202–151.377; daily demands 150.924–152.028; 1h demands 154.087–154.340 and 152.266–152.552.',
      notes: ['Another overextended JPY cross. Every timeframe is still trending up.'],
    },
    {
      src: '/lessons/kevin/11/f-017_t07m02s.jpg',
      caption: '[07:02] AUDJPY 4h: hand-drawn arrow from the 4h supply 97.071–97.419 pointing down. Price has already dropped from it to about 95.8.',
      notes: ['The pullback he "called" is happening, but that does not turn a prediction into a trade.'],
    },
    {
      src: '/lessons/kevin/11/f-018_t07m28s.jpg',
      caption: '[07:28] AUDJPY 4h: he sketches the other path, a dip into the 4h demand 95.026–95.315 and then a turn back up.',
      notes: [
        'Price "could easily shoot back up": weekly momentum, daily, 4h and 1h trends are all up.',
        'With every trend up, a short on a prediction goes against everything in play.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-019_t08m32s.jpg',
      caption: '[08:32] AUDJPY: on the weekly he draws the bowl from the 2022 lows up through the weekly demands (83.812–85.893 and 90.263–92.476); on the daily a curve up through purple 92.780–93.527.',
      notes: ['Shows weekly momentum and the daily uptrend: the side you stay on.'],
    },
    {
      src: '/lessons/kevin/11/f-021_t08m57s.jpg',
      caption: '[08:57] AUDJPY daily: a hand-drawn path from the top, down through the daily demand 94.598–95.284 and into and through the purple daily zone 92.780–93.527.',
      notes: [
        'This is what would have to happen before shorts make sense: daily demand removed, so the daily uptrend is lost.',
        'Until then: longs or flat, nothing else.',
      ],
    },
    {
      src: '/lessons/kevin/11/f-024_t10m40s.jpg',
      caption: '[10:40] AUDJPY 1h: the small base under the 1h supply 97.185–97.419 is circled. That is where the sell-off began, with 1h demands 95.484–95.731 and 95.120–95.250 and the 1h trendline below.',
      notes: ['The supply that caused the drop is a 1h zone inside a 4h zone, under a weekly 6-month line.'],
    },
    {
      src: '/lessons/kevin/11/f-028_t13m52s.jpg',
      caption: '[13:52] AUDJPY 4h full screen: a hand-drawn curve under the 4h supply 97.071–97.419 where the top formed, with the drop to about 95.8 and the 4h demand 95.026–95.315 below.',
      notes: ['He closes back on this chart while talking about holding to the final target rather than closing early.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'EURUSD 1h (05:07): he missed the entry under the daily supply and pulled the order. The 1h demand and trendline must be removed, and price must pull back for 1h confirmation, before he shorts. Until then he is flat.' },
    { svg: fig2, caption: 'AUDJPY (06:36–08:57): he draws the pullback he expects into the 4h demand (or the daily zone), but weekly, daily, 4h and 1h are all trending up, so he will not short on that prediction.' },
    { svg: fig3, caption: 'One side at a time. Longs while the daily uptrend pulls into daily demand. Shorts only once that demand breaks and the trend is lost. Flat whenever nothing qualifies.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00–03:12 AUDJPY four-pane (weekly/4h/daily/1h). The weekly has just tagged a dotted "6m Proximal" (97.148) and the 4h sold off from supply 97.071–97.419 toward 4h demand 95.026–95.315. This is the move people ask "where is it going?" about.',
        '04:28–05:45 EURUSD: daily price under purple supply 1.09416–1.10070, 1h demand 1.08991–1.09151 on a rising trendline. With the Zoom pen he crosses out the missed spike entry and the 1h demand, then sketches break → pullback → drop. That is his "flat is a position" example.',
        '06:11–06:49 He flips through EURGBP, GBPUSD and EURJPY. GBPUSD has lower-timeframe uptrends running into weekly supply; EURJPY is a vertical weekly run into supply 154.918–156.838.',
        '06:36–07:28 Back on AUDJPY 4h he draws the expected pullback (down arrow from the 4h supply, a dip into 4h demand), then the bounce back up it could just as easily make.',
        '08:32 Weekly bowl and daily curve drawn up through the demands: weekly momentum and the daily trend are up.',
        '08:57 Daily path drawn down through daily demand 94.598–95.284 and the purple 92.780–93.527. Only a break like this would make shorts viable ("stick to one side").',
        '10:40 1h: he circles the base under the 1h supply 97.185–97.419 that started the drop.',
        '13:52–14:30 He ends on the AUDJPY 4h full screen with the curve under the 4h supply, and talks about holding to the final TP.',
      ],
    },
  ],
  corrections: [
    'It is not a chart-free talk: he gives it over a Zoom screen share (20 Jun 2023, recording on) of his TradingView four-pane layout (weekly/4h/daily/1h), and annotates the charts with the Zoom pen.',
    'The overextended-JPY example on screen is AUDJPY (and EURJPY). GBPJPY never appears in the frames. The pairs he flips through are AUDJPY, EURUSD, EURGBP, GBPUSD and EURJPY.',
    'The AUDJPY weekly had just tagged a dotted "6m Proximal" line (97.148), and the drop came from a 4h supply 97.071–97.419 with a 1h supply 97.185–97.419 inside it. So there was an HTF supply line in play. He still would not short, because weekly, daily, 4h and 1h were all trending up.',
    'EURUSD "flat" example, sharpened: daily purple supply 1.09416–1.10070 in control; 1h demand 1.08991–1.09151 on a rising 1h trendline; 1h supply 1.09724–1.09824. His sketch shows exactly what he waits for: the 1h demand (and trendline) broken, a pullback up into it, then a 1h confirmation short.',
    'In the "stick to one side" switch, the frames show which levels matter. Shorts become viable only after price breaks the daily demand 94.598–95.284 and runs into the purple daily zone 92.780–93.527, with weekly demands 90.263–92.476 below.',
  ],
};
