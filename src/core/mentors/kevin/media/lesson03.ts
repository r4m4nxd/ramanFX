import type { KevinMedia } from './types';

// Lesson 3 (Drawing Zones): enrichment from the key frames of his video.
// Every example is NATGASUSD 4h (OANDA), March–May 2023.

export const KM_03: KevinMedia = {
  n: 3,
  images: [
    {
      src: '/lessons/kevin/03/f-000.jpg',
      caption: '[00:00] His whiteboard on a blank NATGASUSD 4h chart: four hand-drawn shapes (drop-base-rally, rally-base-rally | rally-base-drop, drop-base-drop), with a red vertical line between the demand pair and the supply pair.',
      notes: [
        'The two zone types for each side. Demand is on the left (DBR, RBR) and supply is the exact opposite on the right (RBD, DBD).',
        'Each shape is a move in, a flat base, and a move away.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-001.jpg',
      caption: '[02:30] NATGASUSD 4h, March 2023: a red box labelled "Rally Base Drop Supply (PV SUPPLY)" at the spike high, and a thinner "Drop Base Drop Supply (CP Supply)" right below it, at the first pause of the sell-off.',
      notes: [
        'The PV (peaks and valleys) supply sits at the peak. The CP (continuation pattern) supply is the base inside the drop.',
        'Each box is labelled on the chart with both the formation name and the PV/CP type.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-002.jpg',
      caption: '[03:00] NATGASUSD 4h, April 2023: three demand zones. Two are "Rally Base Rally Demand (CP Demand)", stacked in the rally. The lowest and largest is "Drop Base Rally Demand (PV Demand)". A magenta pen traces the rally-base-rally steps, and an orange box highlights the candles just before the rally.',
      notes: [
        'The example chart from the notes: two CP zones and one PV zone.',
        'The magenta trace shows the "rally, base, rally" step the CP zone is drawn around.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-003.jpg',
      caption: '[03:17] TradingView Rectangle settings, Text tab: "Rally Base Rally Demand (CP Demand)", font 10, alignment Bottom / Left.',
      notes: [
        'How he labels zones: the label is the rectangle\'s own text, placed under the bottom-left corner of the box.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-016.jpg',
      caption: '[05:04] A blank area of the chart: a green demand box with "Proximal Line" written on its top edge and "Distal Line" under its bottom edge.',
      notes: [
        'For demand, the proximal is the top line (near price) and the distal is the bottom line (further away).',
        'Supply is the mirror image: distal on top, proximal at the bottom.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-027.jpg',
      caption: '[05:58] Zoomed right in on the basing candles: he drags the zone\'s corner handle until it snaps onto the candle body/wick.',
      notes: [
        'With the magnet (hold Ctrl) the line lands on the exact high/low instead of an eyeballed price.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-039.jpg',
      caption: '[07:34] Long-position tool placed on the upper CP demand: the green target area above the zone, with the red risk area under the entry while he positions the stop.',
      notes: [
        'The zone defines the trade. Entry is at the proximal and the stop goes beyond the distal, so the zone size sets the risk.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-041.jpg',
      caption: '[08:10] The same long, finished: entry at the proximal of the upper CP demand, stop just under its distal. The tool reads Target 0.129 (5.99%), Stop 0.049 (2.28%), Risk/Reward 2.63.',
      notes: [
        'His live R:R illustration: the same move pays a different multiple depending on where the proximal sits.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-046.jpg',
      caption: '[09:17] The upper CP demand redrawn as a very thin box (proximal pulled right down to the distal).',
      notes: [
        'The tiny-zone case: a huge R:R on paper (his 13:1 example), but fewer fills and more misses.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-050.jpg',
      caption: '[09:58] The three demand zones restored to normal size, with a small hand-drawn "rally, base, rally" step between the two CP zones.',
      notes: [
        'Back to his preferred middle size: not too small, not too big.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-053.jpg',
      caption: '[10:52] The middle CP demand tightened (proximal lowered), so it matches the height of the upper CP zone.',
      notes: [
        'Keeping zones similar in size on one timeframe. On a CP zone he lets a wick on the proximal side fall outside to match sizes.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-060.jpg',
      caption: '[12:13] The lowest zone, "Drop Base Rally Demand (PV Demand)", covers a large range: a red basing candle plus several green ones. Price returns to it in early May and rallies.',
      notes: [
        'His real-trade example of a large DBR. He does not ignore the large candles: distal at the far low, proximal at the top of the basing body.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-061.jpg',
      caption: '[12:43] Long-position tool on the PV demand at the May retest: entry at its proximal, stop under the distal, and the target above the April highs. The zone is selected (handles visible) while he resizes it.',
      notes: [
        'This is where he shows cutting an oversized zone in half: the same move goes from about 3:1 to about 4–5:1.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-063.jpg',
      caption: '[13:34] Supply side: the "Rally Base Drop Supply (PV SUPPLY)" stretched from the spike high all the way down to the CP supply. It is a very tall box.',
      notes: [
        'An example of a zone that is far too large. Compare its height with the CP supply directly under it.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-064.jpg',
      caption: '[13:37] After resizing: the PV supply is back to a thin band at the top, and "Drop Base Drop Supply (CP Supply)" sits at the first base of the drop, about the same size.',
      notes: [
        'Distal at the objective high and proximal chosen to keep the two supplies a similar size.',
      ],
    },
    {
      src: '/lessons/kevin/03/f-066.jpg',
      caption: '[14:27] The final picture: two CP demands and one PV demand, all with similar heights, and the PV demand holding the May low.',
      notes: [
        'The homework target: zones of similar size, each wrapped around its basing, with the distal on the extreme wick.',
      ],
    },
  ],
  figures: [
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km3_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km3_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Where the lines go: distal objective, proximal subjective</text><line x1=\"320\" y1=\"40\" x2=\"320\" y2=\"330\" stroke=\"#94a3b8\" stroke-width=\"1\" stroke-dasharray=\"5 4\"/><line x1=\"130\" y1=\"190\" x2=\"312\" y2=\"190\" stroke=\"#f59e0b\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/><rect x=\"130\" y=\"200\" width=\"182\" height=\"46\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"84\" x2=\"60\" y2=\"136\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55.0\" y=\"90\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"86\" y1=\"124\" x2=\"86\" y2=\"176\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"81.0\" y=\"130\" width=\"10\" height=\"40\" fill=\"#ef4444\"/><line x1=\"112\" y1=\"164\" x2=\"112\" y2=\"206\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"107.0\" y=\"170\" width=\"10\" height=\"30\" fill=\"#ef4444\"/><line x1=\"138\" y1=\"194\" x2=\"138\" y2=\"246\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"133.0\" y=\"200\" width=\"10\" height=\"12\" fill=\"#ef4444\"/><line x1=\"164\" y1=\"190\" x2=\"164\" y2=\"240\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"159.0\" y=\"206\" width=\"10\" height=\"6\" fill=\"#22c55e\"/><line x1=\"190\" y1=\"104\" x2=\"190\" y2=\"214\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"185.0\" y=\"110\" width=\"10\" height=\"98\" fill=\"#22c55e\"/><line x1=\"216\" y1=\"78\" x2=\"216\" y2=\"116\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"211.0\" y=\"84\" width=\"10\" height=\"26\" fill=\"#22c55e\"/><text x=\"312\" y=\"184\" font-size=\"10\" fill=\"#f59e0b\" text-anchor=\"end\" font-weight=\"400\">alt. proximal: basing wick</text><text x=\"312\" y=\"214\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"end\" font-weight=\"400\">proximal: basing body</text><text x=\"312\" y=\"262\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"end\" font-weight=\"600\">distal: lowest wick (objective)</text><line x1=\"110\" y1=\"290\" x2=\"135\" y2=\"250\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km3_ah)\"/><text x=\"30\" y=\"304\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">always include the wick</text><text x=\"160\" y=\"60\" font-size=\"12\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"700\">DEMAND (distal at the bottom)</text><line x1=\"415\" y1=\"170\" x2=\"632\" y2=\"170\" stroke=\"#f59e0b\" stroke-width=\"1.4\" stroke-dasharray=\"5 4\"/><rect x=\"415\" y=\"114\" width=\"217\" height=\"46\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><line x1=\"345\" y1=\"224\" x2=\"345\" y2=\"276\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"340.0\" y=\"230\" width=\"10\" height=\"40\" fill=\"#22c55e\"/><line x1=\"371\" y1=\"184\" x2=\"371\" y2=\"236\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"366.0\" y=\"190\" width=\"10\" height=\"40\" fill=\"#22c55e\"/><line x1=\"397\" y1=\"154\" x2=\"397\" y2=\"196\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"392.0\" y=\"160\" width=\"10\" height=\"30\" fill=\"#22c55e\"/><line x1=\"423\" y1=\"114\" x2=\"423\" y2=\"166\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"418.0\" y=\"148\" width=\"10\" height=\"12\" fill=\"#22c55e\"/><line x1=\"449\" y1=\"120\" x2=\"449\" y2=\"170\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"444.0\" y=\"148\" width=\"10\" height=\"6\" fill=\"#ef4444\"/><line x1=\"475\" y1=\"146\" x2=\"475\" y2=\"256\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"470.0\" y=\"152\" width=\"10\" height=\"98\" fill=\"#ef4444\"/><line x1=\"501\" y1=\"244\" x2=\"501\" y2=\"282\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"496.0\" y=\"250\" width=\"10\" height=\"26\" fill=\"#ef4444\"/><text x=\"632\" y=\"108\" font-size=\"10\" fill=\"#ef4444\" text-anchor=\"end\" font-weight=\"600\">distal: highest wick (objective)</text><text x=\"632\" y=\"200\" font-size=\"10\" fill=\"#ef4444\" text-anchor=\"end\" font-weight=\"400\">proximal: basing body</text><text x=\"632\" y=\"184\" font-size=\"10\" fill=\"#f59e0b\" text-anchor=\"end\" font-weight=\"400\">alt. proximal: basing wick</text><text x=\"480\" y=\"60\" font-size=\"12\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"700\">SUPPLY (distal at the top)</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Snap each line to the exact high/low with the magnet tool (hold Ctrl).</text></svg>",
      caption: 'Where the lines go. Demand: distal at the lowest wick of the basing (objective, wick included) and proximal at the top of a basing body, or at the wick if that makes the zone too small. Supply: the mirror image.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km3_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km3_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">His whiteboard: PV and CP zones (as labelled on his chart)</text><rect x=\"60\" y=\"178\" width=\"50\" height=\"24\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><polyline points=\"20,95 60,190 110,190 150,90\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" marker-end=\"url(#km3_ah)\"/><text x=\"85\" y=\"318\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">Drop-Base-Rally</text><text x=\"85\" y=\"334\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"400\">PV demand</text><rect x=\"215\" y=\"178\" width=\"50\" height=\"24\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><polyline points=\"175,285 215,190 265,190 305,90\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" marker-end=\"url(#km3_ah)\"/><text x=\"240\" y=\"318\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">Rally-Base-Rally</text><text x=\"240\" y=\"334\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"400\">CP demand</text><line x1=\"320\" y1=\"50\" x2=\"320\" y2=\"300\" stroke=\"#ef4444\" stroke-width=\"2\"/><rect x=\"380\" y=\"178\" width=\"50\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><polyline points=\"340,285 380,190 430,190 470,290\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" marker-end=\"url(#km3_ah)\"/><text x=\"405\" y=\"318\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">Rally-Base-Drop</text><text x=\"405\" y=\"334\" font-size=\"11\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"400\">PV supply</text><rect x=\"535\" y=\"178\" width=\"50\" height=\"24\" fill=\"#ef444422\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><polyline points=\"495,95 535,190 585,190 625,290\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"2.2\" stroke-linejoin=\"round\" marker-end=\"url(#km3_ah)\"/><text x=\"560\" y=\"318\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"600\">Drop-Base-Drop</text><text x=\"560\" y=\"334\" font-size=\"11\" fill=\"#ef4444\" text-anchor=\"middle\" font-weight=\"400\">CP supply</text><text x=\"160\" y=\"62\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">PV = peaks &amp; valleys · CP = continuation pattern</text><text x=\"480\" y=\"62\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">(the PDFs call PV \"VP\")</text></svg>",
      caption: 'His whiteboard, labelled the way he labels zones on his chart: Drop-Base-Rally = PV demand, Rally-Base-Rally = CP demand, Rally-Base-Drop = PV supply, Drop-Base-Drop = CP supply.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km3_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km3_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Same move, different proximal: fill rate vs R:R</text><line x1=\"30\" y1=\"70\" x2=\"630\" y2=\"70\" stroke=\"#22c55e\" stroke-width=\"1.2\" stroke-dasharray=\"5 4\"/><text x=\"630\" y=\"64\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"end\" font-weight=\"400\">same high reached</text><line x1=\"30\" y1=\"300\" x2=\"630\" y2=\"300\" stroke=\"#ef4444\" stroke-width=\"1.2\"/><text x=\"630\" y=\"316\" font-size=\"11\" fill=\"#ef4444\" text-anchor=\"end\" font-weight=\"400\">distal = stop side (same for all)</text><rect x=\"70\" y=\"284\" width=\"120\" height=\"16\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"202\" y1=\"282\" x2=\"202\" y2=\"76\" stroke=\"#22c55e\" stroke-width=\"1.4\" marker-end=\"url(#km3_ah)\"/><text x=\"130\" y=\"274\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\"></text><text x=\"78\" y=\"94\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">tiny zone</text><text x=\"78\" y=\"112\" font-size=\"16\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"700\">≈13:1</text><text x=\"78\" y=\"130\" font-size=\"10\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">fills rarely, more misses</text><rect x=\"260\" y=\"246\" width=\"120\" height=\"54\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"392\" y1=\"244\" x2=\"392\" y2=\"76\" stroke=\"#22c55e\" stroke-width=\"1.4\" marker-end=\"url(#km3_ah)\"/><text x=\"320\" y=\"236\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\"></text><text x=\"268\" y=\"94\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">medium zone</text><text x=\"268\" y=\"112\" font-size=\"16\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"700\">≈3:1</text><text x=\"268\" y=\"130\" font-size=\"10\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">his preference</text><rect x=\"450\" y=\"200\" width=\"120\" height=\"100\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"582\" y1=\"198\" x2=\"582\" y2=\"76\" stroke=\"#22c55e\" stroke-width=\"1.4\" marker-end=\"url(#km3_ah)\"/><text x=\"510\" y=\"190\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\"></text><text x=\"458\" y=\"94\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">large zone</text><text x=\"458\" y=\"112\" font-size=\"16\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"700\">≈1.3:1</text><text x=\"458\" y=\"130\" font-size=\"10\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">fills often, small R:R</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Too large? He cuts the zone in half: a ~3:1 trade becomes ~4-5:1.</text></svg>",
      caption: 'The same distal and the same high, but three proximals. A tiny zone shows about 13:1 but rarely fills, a medium zone about 3:1, and a large zone about 1.3:1 that fills often. If a zone is too large he cuts it in half.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00] On a blank NATGASUSD 4h chart he sketches the four shapes: DBR and RBR on the left, a red divider, then RBD and DBD.',
        '[02:30] The March 2023 natural gas top: "Rally Base Drop Supply (PV SUPPLY)" at the spike and "Drop Base Drop Supply (CP Supply)" at the first pause below it.',
        '[03:00–03:19] The April 2023 low: two "Rally Base Rally Demand (CP Demand)" zones and one "Drop Base Rally Demand (PV Demand)". He shows the rectangle\'s Text tab (font 10, Bottom/Left) used to label them.',
        '[04:39–05:05] He drags a copy of a demand box into empty space and labels its top edge "Proximal Line" and its bottom edge "Distal Line".',
        '[05:44–06:30] He zooms into the basing candles and snaps the zone corners onto them (magnet), wick included at the distal.',
        '[07:25–08:10] With TradingView\'s long-position tool on the upper CP zone (entry at the proximal, stop below the distal) the reading is R:R 2.63 (+5.99% / -2.28%).',
        '[09:17–10:03] He shrinks the upper CP zone to a sliver (the fantasy-R:R case), then restores it.',
        '[10:52–11:08] He tightens the middle CP zone so it matches the others in height.',
        '[12:01–12:43] The large PV demand (red base plus green candles): price retests it in May. He puts a long on it and resizes the zone.',
        '[13:34–13:57] Supply: he first stretches the PV supply into a huge box, then trims it back, leaving the CP supply below at a similar size.',
        '[14:27–15:01] The final chart has three similar-size demand zones. He starts a new demand box on the May rally.',
      ],
    },
  ],
  corrections: [
    'Instrument: every chart in this lesson is NATGASUSD 4h (OANDA), March–May 2023. The "2.205" price in the 3:1 example is natural gas, not a currency pair.',
    'On-screen labels match the notes\' naming exactly: "Rally Base Rally Demand (CP Demand)", "Drop Base Rally Demand (PV Demand)", "Rally Base Drop Supply (PV SUPPLY)", "Drop Base Drop Supply (CP Supply)". He writes each label in the rectangle\'s Text field (size 10, Bottom/Left).',
    'Proximal/distal on screen: a demand box labelled "Proximal Line" on its top edge and "Distal Line" on its bottom edge. This confirms that for demand the distal is the bottom (the lowest wick).',
    'The R:R illustration on screen uses TradingView\'s long-position tool on the upper CP demand: Target 0.129 (5.99%), Stop 0.049 (2.28%), Risk/Reward 2.63. The 3:1 and 13:1 figures are his verbal round numbers.',
    'The "too large" example on screen is the supply side as well: he stretches the PV supply into a tall box and then trims it. The lesson is not only about the large DBR demand.',
    'His whiteboard at 00:00 separates demand (left) from supply (right) with a red vertical line, and each shape is drawn as move in, flat base, move away.',
  ],
};
