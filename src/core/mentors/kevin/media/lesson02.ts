import type { KevinMedia } from './types';

// Lesson 2 (Qualifying Zones): enrichment from the key frames of his video.
// The frames jump from 00:00 to 06:36, so the hypothetical sketch is not on screen; figure 3 redraws it from the notes.

export const KM_02: KevinMedia = {
  n: 2,
  images: [
    {
      src: '/lessons/kevin/02/f-000.jpg',
      caption: '[00:00] WTICOUSD daily (OANDA), the same chart as lesson 1: supply at about 116–119 and 103–106, demand at about 91.5–94.5, and a smaller supply/demand pair (about 88–90.5 and 79.5–82.5) in late 2022.',
      notes: [
        'Starting point for "what removed what": the 91.5–94.5 demand was later broken by the drop out of the 103–106 supply.',
        'Every zone is a tight box around a basing, never a broad band.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-002.jpg',
      caption: '[06:36] His chart link: WTICOUSD in four panes (1W, 4h, 1D, 1h). Zones have price tags (weekly 115.693/105.951, 94.117/87.257; daily 83.734/80.631, 76.930/74.519, 70.211/66.605; 4h 73.497/72.765, 70.781/70.066). Removed zones are shaded tan. Dashed "3m Proximal" and "3m Distal" lines sit on the weekly. Trendlines are drawn on the weekly, daily, 4h and 1h.',
      notes: [
        'The tan boxes are zones that have been removed. He keeps them on the chart to track what removed what.',
        'A three-month zone is projected onto the weekly as two lines (its proximal and distal), a preview of multiple sequence analysis.',
        'Trendlines appear here because removing a trendline is the other way a zone qualifies.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-004.jpg',
      caption: '[09:36] DailyFX "Supply and Demand Trading: A Forex Trader\'s Guide": the USD/JPY weekly example. One wide "Supply Zone" and one wide "Demand Zone" run across about ten years, with arrows at every touch.',
      notes: [
        'This is the article he criticises: the boxes are support and resistance, started at a random price and drawn straight across.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-009.jpg',
      caption: '[10:30] The same USD/JPY chart zoomed in, with his black pen trace showing price chopping in and out of the "supply zone" and then falling into the "demand zone".',
      notes: [
        'Price trades back and forth through the box, so nothing is being removed and there is no basing + move-away structure.',
        'His point: these zones "work" as S/R (break, retest), but there is no structure to them.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-015.jpg',
      caption: '[12:11] The article\'s tip 3 on screen: "Use indicators for confirmation of support and demand zones" (daily or weekly pivot points).',
      notes: [
        'He rejects this. Supply and demand is traded on pure price action, with no indicators.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-017.jpg',
      caption: '[12:37] DailyFX "Sharp moves off supply and demand zones" (GBP/USD): a long red supply box and a blue demand box spanning the whole chart. On the right price has already pushed below the demand box.',
      notes: [
        'This is the second "not S&D" example: a broad, randomly placed box that price has already broken through.',
        'A broken zone is violated. A real S&D trader would not keep drawing it.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-018.jpg',
      caption: '[13:07] DailyFX USD/SGD "stops for short/long positions" chart. His arrows point at the left ends where the supply and demand boxes start.',
      notes: [
        'The boxes begin at arbitrary earlier prices rather than at a basing that caused a move away. He calls this out explicitly.',
        'Real zones start at the basing candles and are drawn tight around them, so they can shape the entry and stop.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-026.jpg',
      caption: '[14:47] The article\'s USD/JPY example again, now with a stochastic oscillator underneath (circled overbought/oversold points).',
      notes: [
        'The indicator-confirmation idea he dismisses. None of this is part of his method.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-030.jpg',
      caption: '[14:54] Google Images for "supply and demand trading zones": a grid of generic examples, with one opened ("SUPPLY ZONE" from Colibri Trader).',
      notes: [
        'His warning: most of what Google and social media call supply and demand is not the original methodology he follows.',
      ],
    },
    {
      src: '/lessons/kevin/02/f-032.jpg',
      caption: '[14:59] Back on his four-pane WTICOUSD layout (1W, 4h, 1D, 1h) with tan removed zones, live green/red zones and trendlines.',
      notes: [
        'His contrast: tight, consistently sized zones, each one wrapped around a basing.',
      ],
    },
  ],
  figures: [
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km2_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km2_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Highest quality: the zone that removed an opposing zone</text><rect x=\"126\" y=\"100\" width=\"494\" height=\"24\" fill=\"#f59e0b22\" stroke=\"#f59e0b\" stroke-width=\"1.2\" stroke-dasharray=\"5 4\"/><rect x=\"250\" y=\"222\" width=\"370\" height=\"40\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"164\" x2=\"60\" y2=\"206\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"170\" width=\"10\" height=\"30\" fill=\"#22c55e\"/><line x1=\"88\" y1=\"134\" x2=\"88\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"83.0\" y=\"140\" width=\"10\" height=\"30\" fill=\"#22c55e\"/><line x1=\"116\" y1=\"106\" x2=\"116\" y2=\"146\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"111.0\" y=\"112\" width=\"10\" height=\"28\" fill=\"#22c55e\"/><line x1=\"144\" y1=\"100\" x2=\"144\" y2=\"124\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"139.0\" y=\"112\" width=\"10\" height=\"6\" fill=\"#ef4444\"/><line x1=\"172\" y1=\"102\" x2=\"172\" y2=\"122\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"167.0\" y=\"110\" width=\"10\" height=\"8\" fill=\"#22c55e\"/><line x1=\"200\" y1=\"104\" x2=\"200\" y2=\"176\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"195.0\" y=\"110\" width=\"10\" height=\"60\" fill=\"#ef4444\"/><line x1=\"228\" y1=\"164\" x2=\"228\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"223.0\" y=\"170\" width=\"10\" height=\"35\" fill=\"#ef4444\"/><line x1=\"256\" y1=\"198\" x2=\"256\" y2=\"234\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"251.0\" y=\"205\" width=\"10\" height=\"23\" fill=\"#ef4444\"/><line x1=\"284\" y1=\"222\" x2=\"284\" y2=\"262\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"279.0\" y=\"228\" width=\"10\" height=\"12\" fill=\"#ef4444\"/><line x1=\"312\" y1=\"226\" x2=\"312\" y2=\"258\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"307.0\" y=\"232\" width=\"10\" height=\"8\" fill=\"#22c55e\"/><line x1=\"340\" y1=\"154\" x2=\"340\" y2=\"240\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"335.0\" y=\"160\" width=\"10\" height=\"74\" fill=\"#22c55e\"/><line x1=\"368\" y1=\"90\" x2=\"368\" y2=\"166\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"363.0\" y=\"96\" width=\"10\" height=\"64\" fill=\"#22c55e\"/><line x1=\"396\" y1=\"62\" x2=\"396\" y2=\"102\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"391.0\" y=\"70\" width=\"10\" height=\"26\" fill=\"#22c55e\"/><line x1=\"424\" y1=\"48\" x2=\"424\" y2=\"78\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"419.0\" y=\"56\" width=\"10\" height=\"14\" fill=\"#22c55e\"/><line x1=\"452\" y1=\"50\" x2=\"452\" y2=\"86\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"447.0\" y=\"56\" width=\"10\" height=\"24\" fill=\"#ef4444\"/><line x1=\"480\" y1=\"74\" x2=\"480\" y2=\"128\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"475.0\" y=\"80\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"508\" y1=\"114\" x2=\"508\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"503.0\" y=\"120\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"536\" y1=\"104\" x2=\"536\" y2=\"166\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"531.0\" y=\"110\" width=\"10\" height=\"40\" fill=\"#22c55e\"/><line x1=\"564\" y1=\"74\" x2=\"564\" y2=\"114\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"559.0\" y=\"80\" width=\"10\" height=\"30\" fill=\"#22c55e\"/><text x=\"124\" y=\"92\" font-size=\"11\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"400\">supply, later broken → removed (tan)</text><text x=\"624\" y=\"278\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"end\" font-weight=\"600\">demand at the origin = qualified</text><line x1=\"410\" y1=\"190\" x2=\"348\" y2=\"140\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km2_ah)\"/><text x=\"414\" y=\"196\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">the rally that broke the supply</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Something had to remove that supply: the demand at the start of the move.</text></svg>",
      caption: 'Highest-quality qualification: a supply zone is broken by a rally and turns tan (removed). The demand at the origin of that rally is what removed it, so it qualifies.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km2_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km2_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Support/resistance box vs a supply &amp; demand zone</text><line x1=\"320\" y1=\"40\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><rect x=\"24\" y=\"168\" width=\"282\" height=\"26\" fill=\"#60a5fa22\" stroke=\"#60a5fa\" stroke-width=\"1.2\"/><rect x=\"24\" y=\"112\" width=\"282\" height=\"22\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><polyline points=\"30,200 55,150 80,190 105,120 130,175 155,125 180,190 205,140 230,185 255,130 280,180 300,150\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><text x=\"165\" y=\"236\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">Boxes started at a random price,</text><text x=\"165\" y=\"252\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">drawn across many touches</text><text x=\"165\" y=\"276\" font-size=\"12\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"600\">= S/R, no structure (not S&amp;D)</text><rect x=\"434\" y=\"198\" width=\"196\" height=\"34\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"350\" y1=\"104\" x2=\"350\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"345.5\" y=\"110\" width=\"9\" height=\"30\" fill=\"#ef4444\"/><line x1=\"371\" y1=\"134\" x2=\"371\" y2=\"182\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"366.5\" y=\"140\" width=\"9\" height=\"36\" fill=\"#ef4444\"/><line x1=\"392\" y1=\"170\" x2=\"392\" y2=\"212\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"387.5\" y=\"176\" width=\"9\" height=\"28\" fill=\"#ef4444\"/><line x1=\"413\" y1=\"198\" x2=\"413\" y2=\"232\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"408.5\" y=\"204\" width=\"9\" height=\"10\" fill=\"#ef4444\"/><line x1=\"434\" y1=\"200\" x2=\"434\" y2=\"228\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"429.5\" y=\"206\" width=\"9\" height=\"8\" fill=\"#22c55e\"/><line x1=\"455\" y1=\"114\" x2=\"455\" y2=\"212\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"450.5\" y=\"120\" width=\"9\" height=\"88\" fill=\"#22c55e\"/><line x1=\"476\" y1=\"86\" x2=\"476\" y2=\"126\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"471.5\" y=\"92\" width=\"9\" height=\"28\" fill=\"#22c55e\"/><line x1=\"497\" y1=\"70\" x2=\"497\" y2=\"98\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"492.5\" y=\"76\" width=\"9\" height=\"16\" fill=\"#22c55e\"/><line x1=\"518\" y1=\"70\" x2=\"518\" y2=\"100\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"513.5\" y=\"76\" width=\"9\" height=\"20\" fill=\"#ef4444\"/><line x1=\"539\" y1=\"90\" x2=\"539\" y2=\"130\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"534.5\" y=\"96\" width=\"9\" height=\"28\" fill=\"#ef4444\"/><line x1=\"560\" y1=\"118\" x2=\"560\" y2=\"156\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"555.5\" y=\"124\" width=\"9\" height=\"26\" fill=\"#ef4444\"/><line x1=\"581\" y1=\"144\" x2=\"581\" y2=\"208\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"576.5\" y=\"150\" width=\"9\" height=\"50\" fill=\"#ef4444\"/><line x1=\"602\" y1=\"144\" x2=\"602\" y2=\"212\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"597.5\" y=\"150\" width=\"9\" height=\"50\" fill=\"#22c55e\"/><line x1=\"623\" y1=\"104\" x2=\"623\" y2=\"156\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"618.5\" y=\"110\" width=\"9\" height=\"40\" fill=\"#22c55e\"/><text x=\"480\" y=\"262\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">Tight lines wrapped around</text><text x=\"480\" y=\"278\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">the basing that caused the move</text><text x=\"480\" y=\"302\" font-size=\"12\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"600\">= supply &amp; demand</text></svg>",
      caption: 'The DailyFX-style boxes he criticises (wide, started at a random price, drawn across many touches) next to a real zone wrapped tightly around the basing that caused the move.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km2_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km2_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">His hypothetical: a 1H zone that removed nothing</text><rect x=\"40\" y=\"180\" width=\"580\" height=\"140\" fill=\"#f59e0b22\" stroke=\"#f59e0b\" stroke-width=\"1.2\"/><text x=\"612\" y=\"312\" font-size=\"12\" fill=\"#f59e0b\" text-anchor=\"end\" font-weight=\"600\">DAILY demand (higher timeframe)</text><rect x=\"150\" y=\"60\" width=\"470\" height=\"30\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"612\" y=\"82\" font-size=\"11\" fill=\"#ef4444\" text-anchor=\"end\" font-weight=\"400\">1H supply above, NOT removed</text><rect x=\"150\" y=\"214\" width=\"370\" height=\"36\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"70\" y1=\"104\" x2=\"70\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"65.0\" y=\"110\" width=\"10\" height=\"20\" fill=\"#ef4444\"/><line x1=\"98\" y1=\"126\" x2=\"98\" y2=\"166\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"93.0\" y=\"130\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"126\" y1=\"154\" x2=\"126\" y2=\"226\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"121.0\" y=\"160\" width=\"10\" height=\"60\" fill=\"#ef4444\"/><line x1=\"154\" y1=\"214\" x2=\"154\" y2=\"250\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"149.0\" y=\"220\" width=\"10\" height=\"12\" fill=\"#ef4444\"/><line x1=\"182\" y1=\"218\" x2=\"182\" y2=\"246\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"177.0\" y=\"224\" width=\"10\" height=\"8\" fill=\"#22c55e\"/><line x1=\"210\" y1=\"134\" x2=\"210\" y2=\"232\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"205.0\" y=\"140\" width=\"10\" height=\"86\" fill=\"#22c55e\"/><line x1=\"238\" y1=\"112\" x2=\"238\" y2=\"146\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"233.0\" y=\"118\" width=\"10\" height=\"22\" fill=\"#22c55e\"/><line x1=\"266\" y1=\"98\" x2=\"266\" y2=\"124\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"261.0\" y=\"104\" width=\"10\" height=\"14\" fill=\"#22c55e\"/><line x1=\"294\" y1=\"98\" x2=\"294\" y2=\"122\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"289.0\" y=\"104\" width=\"10\" height=\"12\" fill=\"#ef4444\"/><line x1=\"322\" y1=\"110\" x2=\"322\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"317.0\" y=\"116\" width=\"10\" height=\"24\" fill=\"#ef4444\"/><line x1=\"350\" y1=\"134\" x2=\"350\" y2=\"176\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"345.0\" y=\"140\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"378\" y1=\"164\" x2=\"378\" y2=\"224\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"373.0\" y=\"170\" width=\"10\" height=\"44\" fill=\"#ef4444\"/><line x1=\"406\" y1=\"164\" x2=\"406\" y2=\"228\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"401.0\" y=\"170\" width=\"10\" height=\"44\" fill=\"#22c55e\"/><line x1=\"434\" y1=\"124\" x2=\"434\" y2=\"174\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"429.0\" y=\"130\" width=\"10\" height=\"40\" fill=\"#22c55e\"/><text x=\"330\" y=\"272\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"600\">1H demand: clean basing + decent move away</text><text x=\"330\" y=\"288\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">located inside daily demand → still a candidate</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">With MTF/MSA the higher timeframe is the edge; what the zone removed matters less.</text></svg>",
      caption: 'His worked hypothetical: a 1H demand that did not remove the supply above it. With a clean base and a decent move away inside a daily demand zone, it is still a candidate.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00] He starts on the WTI daily from lesson 1, with tight supply and demand boxes on the 2022 swings.',
        '[00:00–06:36] There are no key frames in this stretch, where he explains removal, drawable vs tradable and the 1H-inside-daily hypothetical.',
        '[06:36] He opens his shared chart link: WTICOUSD in four panes (1W/4h/1D/1h). Tan zones were removed, green/red zones are live and carry price tags, a three-month zone shows as "3m Proximal/3m Distal" lines on the weekly, and trendlines are drawn on each pane.',
        '[09:36–10:30] He opens the DailyFX article and its USD/JPY weekly example with two huge boxes. He draws over it to show price chopping through, which makes it S/R and not S&D.',
        '[12:10–12:37] On the GBP/USD "sharp moves" chart and the article\'s indicator tip he repeats the point: broad boxes, already broken, plus pivot-point indicators. None of it is his method.',
        '[13:07] On the USD/SGD stops chart he arrows the left ends of the boxes to show they start at random prices.',
        '[14:47–14:54] The USD/JPY stochastic example and a Google Images page full of generic "supply zones": the junk he warns about.',
        '[14:59] He returns to his four-pane WTI layout as the reference for how zones should look.',
      ],
    },
  ],
  corrections: [
    'The article is DailyFX "Supply and Demand Trading: A Forex Trader\'s Guide" (its byline, Richard Snow, is visible in lesson 1 at 02:18). Its charts are USD/JPY weekly, GBP/USD ("Sharp moves off supply and demand zones") and USD/SGD (stop placement), and he criticises all three.',
    'The "second article chart, a zone price had already broken through" is the GBP/USD "sharp moves" chart, where price closes below the blue demand box on the right. The "boxes started randomly far back" point is made on the USD/SGD chart, where he arrows the boxes\' left ends.',
    'The article\'s tip 3 literally says "Use indicators for confirmation of support and demand zones" (pivot points). A stochastic example follows. This is exactly what his "no indicators" rule rejects.',
    'His chart link is WTICOUSD in four panes (1W/4h/1D/1h), not a single chart. Removed zones are tan, live zones carry proximal/distal price tags, and a three-month zone is projected onto the weekly as "3m Proximal" and "3m Distal" lines.',
    'Trendlines are drawn on all four panes of his layout, which fits removing a trendline as the other way a zone qualifies.',
  ],
};
