import type { KevinMedia } from './types';

// Lesson 1 (Intro to Supply & Demand): enrichment from the key frames of his video.
// Figures redraw what he shows on his WTI crude daily chart.

export const KM_01: KevinMedia = {
  n: 1,
  images: [
    {
      src: '/lessons/kevin/01/f-000.jpg',
      caption: '[00:00] WTICOUSD daily (OANDA). Green demand box about 62.0–64.3 from the August 2021 basing. Red supply box about 78–80 from the November 2021 basing that started a very large red candle. In early December a long wick tags the demand, then price rallies through the supply.',
      notes: [
        'His opening example: zones drawn as filled rectangles, green for demand and red for supply, each extended to the right until price comes back.',
        'The demand caught the December wick almost to the tick. That is the "$62 stack of buy orders" in his trading-floor story.',
        'The supply was later broken by the January 2022 rally. Not every zone holds.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-004.jpg',
      caption: '[01:17] YouTube search for "sam seiden": "Sam Seiden: Supply/Demand Basics" (FXStreet), plus other Sam Seiden webinars.',
      notes: [
        'This is the founder of the chart method he credits. The name on screen is Sam Seiden (the captions say "Sam Sein").',
        'He recommends these videos as starter material.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-009.jpg',
      caption: '[02:20] XAUUSD four-chart layout: 1W, 4h, 1D and 1h. Green demand zones carry proximal/distal price tags (1h 1984.515–1990.230, 4h 1978.520–1989.075, daily 1949.810–1984.385). Older zones are shaded tan. Arrows mark the bias, with a trendline on the daily.',
      notes: [
        'A quick look at his real working screen. The same zone logic runs on every timeframe at once, which previews the later MTF lessons.',
        'Each zone is labelled with the exact prices of its two lines.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-014.jpg',
      caption: '[03:55] WTI daily zoomed in: the demand box wraps the August 2021 basing (a small red candle at the low plus the start of the large green candle). Distal at the lowest wick, about 62.0. Proximal about 64.3.',
      notes: [
        'Process: find the large move away, go to its origin, and draw the box around the basing candles.',
        'The box runs right across months of chart until price finally returns in December.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-015.jpg',
      caption: '[04:25] WTI daily, March–June 2021: hand-drawn arrows at a large red candle in March and at small, steady pushes up in May/June. He draws no zone at any of them.',
      notes: [
        '"No demand here": small candles drifting up are not a large move away.',
        'S&D is technically everywhere, but he only marks the big moves away.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-016.jpg',
      caption: '[04:55] WTI daily, July 2021: an arrow at a sharp drop and recovery, with no box drawn there. The real demand (green) is further right, at the August base.',
      notes: [
        'Price moving fast is not enough. He wants a pause (basing) and then the strong move out of it.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-017.jpg',
      caption: '[05:25] WTI daily: an arrow points at the large green candle leaving the August basing. The demand box sits under it, and the December retest is visible on the right with the red supply above.',
      notes: [
        'The large green candle is the footprint of the banks: price could not stay at that level.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-018.jpg',
      caption: '[05:55] WTI daily, early 2022: a Rally-Base-Rally demand at about 91.5–94.5. A short basing just under 94 is followed by the explosive March 2022 move to about 110+. Price later comes back into the zone several times in March–May.',
      notes: [
        'Continuation zone (RBR) in a trending market. In his opinion this is the better type when the market trends.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-019.jpg',
      caption: '[06:25] WTI daily, March–December 2022: supply boxes at about 116–119 and 103–106 on the way down, the 91.5–94.5 demand that finally broke in July, and a smaller supply (about 88–90.5) and demand (about 79.5–82.5) later in the year.',
      notes: [
        'In the 2022 downtrend the drop-base-drop supplies did the work.',
        'He deliberately shows zones that failed or were never filled: "not every trade works."',
      ],
    },
    {
      src: '/lessons/kevin/01/f-033.jpg',
      caption: '[09:40] WTI daily: he hand-draws the move into the August 2021 demand (a drop from the July high, a flat base, a push up). A new demand box with price tags 81.235 / 83.183 appears top right (January 2022).',
      notes: [
        'The black sketch is the Drop-Base-Rally shape traced over the real candles: drop, base, rally.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-034.jpg',
      caption: '[09:46] WTI daily: the January 2022 Rally-Base-Rally demand, 81.235–83.183 (outlined box with price tags), formed right after price broke the November supply. The 91.5–94.5 RBR demand sits above it.',
      notes: [
        'Two continuation demands stacked in the uptrend. Each is a small base followed by a strong push higher.',
        'He draws this zone live on video, with the exact proximal/distal prices shown on the box.',
      ],
    },
    {
      src: '/lessons/kevin/01/f-040.jpg',
      caption: '[10:00] WTI daily, late 2022: price finally returns to the 81.235–83.183 demand in September. It wicks through, and a later demand at about 79.5–82.5 forms inside it before the slide into December.',
      notes: [
        'An old zone retested many months later. The zone is a level to trade the return to, not a guarantee.',
      ],
    },
  ],
  figures: [
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km1_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km1_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Drop-Base-Rally on his WTI daily: pause, then a strong fast move out</text><rect x=\"160\" y=\"206\" width=\"460\" height=\"34\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"64\" x2=\"60\" y2=\"106\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"70\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"86\" y1=\"95\" x2=\"86\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"81.0\" y=\"100\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"112\" y1=\"134\" x2=\"112\" y2=\"196\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"107.0\" y=\"140\" width=\"10\" height=\"50\" fill=\"#ef4444\"/><line x1=\"138\" y1=\"186\" x2=\"138\" y2=\"226\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"133.0\" y=\"190\" width=\"10\" height=\"24\" fill=\"#ef4444\"/><line x1=\"164\" y1=\"206\" x2=\"164\" y2=\"240\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"159.0\" y=\"214\" width=\"10\" height=\"8\" fill=\"#ef4444\"/><line x1=\"190\" y1=\"210\" x2=\"190\" y2=\"234\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"185.0\" y=\"215\" width=\"10\" height=\"7\" fill=\"#22c55e\"/><line x1=\"216\" y1=\"104\" x2=\"216\" y2=\"224\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"211.0\" y=\"110\" width=\"10\" height=\"108\" fill=\"#22c55e\"/><line x1=\"242\" y1=\"84\" x2=\"242\" y2=\"116\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"237.0\" y=\"92\" width=\"10\" height=\"18\" fill=\"#22c55e\"/><line x1=\"268\" y1=\"86\" x2=\"268\" y2=\"110\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"263.0\" y=\"92\" width=\"10\" height=\"12\" fill=\"#ef4444\"/><line x1=\"294\" y1=\"70\" x2=\"294\" y2=\"108\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"289.0\" y=\"78\" width=\"10\" height=\"26\" fill=\"#22c55e\"/><line x1=\"320\" y1=\"72\" x2=\"320\" y2=\"110\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"315.0\" y=\"78\" width=\"10\" height=\"26\" fill=\"#ef4444\"/><line x1=\"346\" y1=\"98\" x2=\"346\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"341.0\" y=\"104\" width=\"10\" height=\"36\" fill=\"#ef4444\"/><line x1=\"372\" y1=\"134\" x2=\"372\" y2=\"182\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"367.0\" y=\"140\" width=\"10\" height=\"36\" fill=\"#ef4444\"/><line x1=\"398\" y1=\"170\" x2=\"398\" y2=\"232\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"393.0\" y=\"176\" width=\"10\" height=\"36\" fill=\"#ef4444\"/><line x1=\"424\" y1=\"144\" x2=\"424\" y2=\"226\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"419.0\" y=\"150\" width=\"10\" height=\"60\" fill=\"#22c55e\"/><line x1=\"450\" y1=\"102\" x2=\"450\" y2=\"154\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"445.0\" y=\"108\" width=\"10\" height=\"42\" fill=\"#22c55e\"/><line x1=\"476\" y1=\"74\" x2=\"476\" y2=\"112\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"471.0\" y=\"80\" width=\"10\" height=\"28\" fill=\"#22c55e\"/><text x=\"624\" y=\"203\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"end\" font-weight=\"400\">proximal</text><text x=\"624\" y=\"254\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"end\" font-weight=\"400\">distal (lowest wick)</text><line x1=\"150\" y1=\"290\" x2=\"165\" y2=\"246\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"70\" y=\"304\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">basing = the pause</text><line x1=\"260\" y1=\"70\" x2=\"222\" y2=\"118\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"266\" y=\"68\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">large, fast move away = bank footprint</text><line x1=\"470\" y1=\"300\" x2=\"450\" y2=\"236\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"400\" y=\"318\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">pullback into the box = the trade</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Box wraps the basing candles; it extends right until price returns.</text></svg>",
      caption: 'Drop-Base-Rally as he shows it on WTI: drop, a short pause (basing), one large green candle away, and a box wrapped around the basing (proximal on top, distal at the lowest wick). It extends right until price pulls back into it.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km1_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km1_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Balance vs imbalance</text><line x1=\"320\" y1=\"40\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><line x1=\"40\" y1=\"160\" x2=\"40\" y2=\"200\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"35.0\" y=\"170\" width=\"10\" height=\"20\" fill=\"#ef4444\"/><line x1=\"68\" y1=\"165\" x2=\"68\" y2=\"204\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"63.0\" y=\"172\" width=\"10\" height=\"18\" fill=\"#22c55e\"/><line x1=\"96\" y1=\"162\" x2=\"96\" y2=\"196\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"91.0\" y=\"172\" width=\"10\" height=\"14\" fill=\"#ef4444\"/><line x1=\"124\" y1=\"160\" x2=\"124\" y2=\"198\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"119.0\" y=\"168\" width=\"10\" height=\"18\" fill=\"#22c55e\"/><line x1=\"152\" y1=\"158\" x2=\"152\" y2=\"194\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"147.0\" y=\"168\" width=\"10\" height=\"14\" fill=\"#ef4444\"/><line x1=\"180\" y1=\"164\" x2=\"180\" y2=\"200\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"175.0\" y=\"170\" width=\"10\" height=\"12\" fill=\"#22c55e\"/><line x1=\"208\" y1=\"162\" x2=\"208\" y2=\"198\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"203.0\" y=\"170\" width=\"10\" height=\"20\" fill=\"#ef4444\"/><line x1=\"236\" y1=\"168\" x2=\"236\" y2=\"204\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"231.0\" y=\"176\" width=\"10\" height=\"14\" fill=\"#22c55e\"/><line x1=\"264\" y1=\"150\" x2=\"264\" y2=\"184\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"259.0\" y=\"160\" width=\"10\" height=\"16\" fill=\"#22c55e\"/><rect x=\"28\" y=\"146\" width=\"262\" height=\"64\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.2\" stroke-dasharray=\"5 4\"/><text x=\"160\" y=\"240\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">Sideways = buyers ≈ sellers</text><text x=\"160\" y=\"258\" font-size=\"12\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"600\">balance → no zone</text><text x=\"160\" y=\"290\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">A small push out of a range is</text><text x=\"160\" y=\"306\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">at best \"borderline\" demand</text><rect x=\"470\" y=\"214\" width=\"160\" height=\"32\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"360\" y1=\"114\" x2=\"360\" y2=\"166\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"355.0\" y=\"120\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"388\" y1=\"154\" x2=\"388\" y2=\"206\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"383.0\" y=\"160\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"416\" y1=\"196\" x2=\"416\" y2=\"238\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"411.0\" y=\"200\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"444\" y1=\"214\" x2=\"444\" y2=\"246\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"439.0\" y=\"222\" width=\"10\" height=\"8\" fill=\"#22c55e\"/><line x1=\"472\" y1=\"216\" x2=\"472\" y2=\"244\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"467.0\" y=\"222\" width=\"10\" height=\"10\" fill=\"#ef4444\"/><line x1=\"500\" y1=\"104\" x2=\"500\" y2=\"236\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"495.0\" y=\"110\" width=\"10\" height=\"120\" fill=\"#22c55e\"/><line x1=\"528\" y1=\"76\" x2=\"528\" y2=\"116\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"523.0\" y=\"84\" width=\"10\" height=\"26\" fill=\"#22c55e\"/><line x1=\"556\" y1=\"62\" x2=\"556\" y2=\"90\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"551.0\" y=\"70\" width=\"10\" height=\"14\" fill=\"#22c55e\"/><line x1=\"584\" y1=\"50\" x2=\"584\" y2=\"76\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"579.0\" y=\"58\" width=\"10\" height=\"12\" fill=\"#22c55e\"/><text x=\"480\" y=\"270\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">price could not stay here</text><text x=\"480\" y=\"288\" font-size=\"12\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"600\">imbalance → zone</text><line x1=\"560\" y1=\"100\" x2=\"512\" y2=\"130\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"566\" y=\"98\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">shot out</text><text x=\"160\" y=\"60\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">NOT what we look for</text><text x=\"480\" y=\"60\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">what we look for</text></svg>",
      caption: 'Balance vs imbalance: sideways candles mean buyers and sellers are balanced, so no zone. A pause followed by an explosive move out is an imbalance, so a zone.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km1_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km1_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">The two zone families (supply is the exact opposite)</text><rect x=\"58\" y=\"166\" width=\"54\" height=\"28\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><polyline points=\"20,90 60,180 110,180 150,80\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><line x1=\"138\" y1=\"110.0\" x2=\"150\" y2=\"80\" stroke=\"#22c55e\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"85\" y=\"315\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">DBR</text><text x=\"85\" y=\"332\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">reversal</text><rect x=\"213\" y=\"166\" width=\"54\" height=\"28\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><polyline points=\"175,270 215,180 265,180 305,80\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><line x1=\"293\" y1=\"110.0\" x2=\"305\" y2=\"80\" stroke=\"#22c55e\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"240\" y=\"315\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">RBR</text><text x=\"240\" y=\"332\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">continuation</text><line x1=\"320\" y1=\"46\" x2=\"320\" y2=\"340\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"378\" y=\"166\" width=\"54\" height=\"28\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><polyline points=\"340,270 380,180 430,180 470,280\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><line x1=\"458\" y1=\"250.0\" x2=\"470\" y2=\"280\" stroke=\"#ef4444\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"405\" y=\"315\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">RBD</text><text x=\"405\" y=\"332\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">reversal</text><rect x=\"533\" y=\"166\" width=\"54\" height=\"28\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><polyline points=\"495,90 535,180 585,180 625,280\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\"/><line x1=\"613\" y1=\"250.0\" x2=\"625\" y2=\"280\" stroke=\"#ef4444\" stroke-width=\"1.4\" marker-end=\"url(#km1_ah)\"/><text x=\"560\" y=\"315\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">DBD</text><text x=\"560\" y=\"332\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">continuation</text><text x=\"160\" y=\"58\" font-size=\"12\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"700\">DEMAND</text><text x=\"480\" y=\"58\" font-size=\"12\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"700\">SUPPLY</text></svg>",
      caption: 'The two zone families. Demand is DBR (reversal) or RBR (continuation). Supply is the exact opposite: RBD (reversal) or DBD (continuation). The shaded base is where the zone is drawn.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00] He opens on WTI crude oil (WTICOUSD, daily, OANDA): a green demand at about 62–64 from August 2021 and a red supply at about 78–80 from November 2021. The demand caught the December 2021 wick, then price broke the supply.',
        '[01:17] He shows the YouTube results for "Sam Seiden" (FXStreet: "Supply/Demand Basics"), the founder of the method.',
        '[02:18–02:24] He briefly shows a DailyFX supply & demand article and his own XAUUSD four-chart layout (1W/4h/1D/1h), where every zone carries its proximal/distal prices and older zones are tan.',
        '[03:55–05:25] Back on WTI daily he zooms into the August 2021 demand: a box around the basing candles, distal at the lowest wick (about 62.0). He arrows several places where there is "no demand" because there is no large move away.',
        '[05:55–07:19] He scrolls into 2022: a Rally-Base-Rally demand at about 91.5–94.5 that launched the March spike, then supplies at about 116–119 and 103–106 in the decline. The 91.5–94.5 demand eventually broke.',
        '[08:49–09:47] He traces the drop-base-rally path into the 2021 demand by hand. He then draws a new RBR demand live (81.235–83.183) right after the November supply was broken.',
        '[09:58–11:01] He scrolls forward to show how each zone played out, including ones that failed and ones price never returned to.',
        'Every chart shows his "<50% Body Candle" label in the top-left corner. Many candles carry a small dot, which looks like a marker for candles whose body is under half their range (basing-type candles).',
      ],
    },
  ],
  corrections: [
    'Founder name: the YouTube search on screen reads "sam seiden" and the results are "Sam Seiden: Supply/Demand Basics" (FXStreet). It is Sam Seiden; the captions\' "Sam Sein" is a mistranscription.',
    'Instrument: every example in this lesson is WTI crude oil (WTICOUSD, OANDA daily). The "$62 stack of buy orders" example is literally his WTI demand at about 62.0–64.3 from August 2021.',
    'How he draws zones: a filled rectangle (green demand, red supply) wrapped around the basing candles, extended right until price returns. Some zones carry exact proximal/distal price tags (for example 81.235 / 83.183).',
    'The "large red candle, basing, then a large green candle" example is the August 2021 WTI base. The failed supply he shows is the November 2021 WTI supply (about 78–80), which the January 2022 rally broke.',
    'His charts show a "<50% Body Candle" label and small dots on many candles. These appear to flag small-bodied (basing) candles; the transcript notes do not mention this.',
    'His real working screen is already visible here (XAUUSD 1W/4h/1D/1h, four charts). This is the layout he later recommends in the MTF lesson.',
  ],
};
