import type { KevinMedia } from './types';

// Lesson 4 (Multiple Timeframe Analysis): enrichment from the key frames of his video.
// Examples: NATGASUSD H4 inside a weekly demand (OANDA) and EURUSD H1 -> 5m on replay (FXCM).

export const KM_04: KevinMedia = {
  n: 4,
  images: [
    {
      src: '/lessons/kevin/04/f-000.jpg',
      caption: '[00:00] NATGASUSD 4h (OANDA): the three demand zones from lesson 3, two "Rally Base Rally Demand (CP Demand)" and one "Drop Base Rally Demand (PV Demand)", at the April 2023 low.',
      notes: [
        'His natural gas example: several H4 demand zones that all sit inside one weekly demand.',
        'The two CP zones were traded through on the May dip. The PV zone at the bottom held, and that was the one that worked.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-001.jpg',
      caption: '[01:30] NATGASUSD 4h, March 2023: "Rally Base Drop Supply (PV SUPPLY)" at the spike top and "Drop Base Drop Supply (CP Supply)" just below it, with price falling away underneath.',
      notes: [
        'The supply zones above the H4 demands. On the H4 alone these look like sells, but inside the weekly demand he ignores them.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-003.jpg',
      caption: '[01:48] NATGASUSD 4h, August 2022, much higher up the chart: a yellow box at about 9.0–9.4 under the late-August highs, after which price collapses.',
      notes: [
        'His "higher up the chart" comparison: trades taken up there, far from the weekly demand, gave only small R:R even when they worked.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-007.jpg',
      caption: '[02:51] His "TIMEFRAME COMBINATIONS" table: ETF 1m/5m/15m/H1/H4/1D, ITF 5m/15m/H1/H4/1D/1M, HTF 15m/H1/H4/1D/1W/3M. Magenta arrows point at the H1 and H4 columns.',
      notes: [
        'Read it by column. Entry timeframe on top, intermediate in the middle, higher timeframe at the bottom.',
        'The arrows mark his own entry timeframes, H1 and H4 (HTF daily and weekly).',
        'A daily entry uses the 1M as the ITF and the 3M as the HTF.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-011.jpg',
      caption: '[05:55] NATGASUSD weekly: the weekly demand is drawn from the September–October 2020 base (the basing before the rally to 2021–22), and price reaches it again in March–April 2023.',
      notes: [
        'The HTF zone for an H4 entry, drawn on the weekly chart with the same basing rules.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-014.jpg',
      caption: '[06:33] Back on NATGASUSD 4h: the weekly zone, now coloured yellow, is a wide band that contains all three H4 demand zones.',
      notes: [
        'This is the "zone within a zone". He recolours the higher-timeframe zone yellow so it stands apart from the green H4 zones.',
        'Inside the yellow (weekly demand) band he only looks for buys.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-029.jpg',
      caption: '[08:53] EURUSD 1h (FXCM): a downtrend from early May into a demand zone (green) drawn on May 19 at about 1.0800. Price comes back down to it on May 23.',
      notes: [
        'The second example: H1 is the higher timeframe for a 5m entry.',
        'The overall trend here is down, which is why he says shorts were higher odds.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-033.jpg',
      caption: '[08:58] EURUSD 1h: the H1 demand at the May 19 low, plus an H1 supply (salmon) at the May 23 breakdown, about 1.0834.',
      notes: [
        'He marks both H1 demand and supply, then waits for price to reach one of them.',
        'He admits these H1 zones "aren\'t high quality". They are there to show the process.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-040.jpg',
      caption: '[09:47] EURUSD 5m in TradingView Replay: the H1 demand shows as a wide green band. He drops a red 5m supply box at the last basing above the low.',
      notes: [
        'Step 4 of the process: drop to the entry timeframe and read the 5m structure inside the HTF zone.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-042.jpg',
      caption: '[10:01] EURUSD 5m: the 5m supply (red, one basing candle) is taken out by the rally, and a 5m demand box is drawn at the base inside the H1 band.',
      notes: [
        'The 5m demand removed the 5m supply. It has a large move away, a basing candle and a stay-away candle.',
        'The pullback into this 5m demand, inside the H1 demand, was the trade.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-047.jpg',
      caption: '[11:49] EURUSD 1h, May 10–16: an H1 supply (salmon box) at the base of the sharp May 11 drop.',
      notes: [
        'Context for the trend: H1 supplies kept producing the moves down, so the bigger picture favoured shorts.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-053.jpg',
      caption: '[12:20] NATGASUSD weekly, 2018–2023: the yellow weekly demand at the 2020 base, with the H4 zone labels (PV/CP supply and demand) crowded at the 2023 low where price sits inside it.',
      notes: [
        'The whole picture: the collapse from about 10 into a weekly demand, which is where the H4 buys came from.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-054.jpg',
      caption: '[12:50] NATGASUSD 4h with the yellow weekly band: he writes "MTA", then "MSA" underneath and circles it.',
      notes: [
        'MSA (multiple sequence analysis) is next: "basically this times two". You need to master MTA first.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-055.jpg',
      caption: '[13:20] NATGASUSD 4h: a large hand-drawn "W" inside the yellow weekly band.',
      notes: [
        'He stresses that the band is the weekly zone. The H4 entries are the weekly zone made smaller.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-059.jpg',
      caption: '[14:06] Long-position tool on the H4 PV demand at the May 4 retest, inside the weekly band. Target 0.152 (7.76%), Stop 0.054 (2.76%), Risk/Reward 2.81.',
      notes: [
        'A refined entry (H4 zone) inside the HTF zone (weekly), with the stop just under the PV distal.',
      ],
    },
    {
      src: '/lessons/kevin/04/f-061.jpg',
      caption: '[14:39] The same long with the target dragged up to the late-May high, far above the weekly band. The trade box now spans the whole rally.',
      notes: [
        'This is the "hold as long as possible" part of his edge: enter low on the lower timeframe and aim for the full higher-timeframe move.',
      ],
    },
  ],
  figures: [
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km4_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km4_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Zone within a zone: H4 demand inside weekly demand (his NATGAS chart)</text><rect x=\"20\" y=\"150\" width=\"610\" height=\"162\" fill=\"#f59e0b22\" stroke=\"#f59e0b\" stroke-width=\"1.2\"/><text x=\"28\" y=\"306\" font-size=\"11\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"600\">WEEKLY demand</text><rect x=\"250\" y=\"160\" width=\"150\" height=\"16\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"236\" y=\"198\" width=\"204\" height=\"18\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><rect x=\"226\" y=\"262\" width=\"404\" height=\"28\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><text x=\"256\" y=\"172\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"400\">CP demand</text><text x=\"242\" y=\"211\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"400\">CP demand</text><text x=\"232\" y=\"284\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"400\">PV demand (DBR)</text><rect x=\"490\" y=\"56\" width=\"125\" height=\"206\" fill=\"#22c55e22\"/><rect x=\"490\" y=\"262\" width=\"125\" height=\"34\" fill=\"#ef444422\"/><line x1=\"490\" y1=\"262\" x2=\"615\" y2=\"262\" stroke=\"#94a3b8\" stroke-width=\"1\"/><polyline points=\"30,50 80,70 120,60 160,110 190,180 210,240 222,288 234,230 250,170 270,120 300,100 330,135 360,110 390,140 420,130 440,170 455,205 470,235 490,264 505,240 525,200 545,160 570,120 595,80 615,50\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1.8\" stroke-linejoin=\"round\"/><text x=\"552\" y=\"50\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"middle\" font-weight=\"400\">target</text><text x=\"608\" y=\"284\" font-size=\"10\" fill=\"#ef4444\" text-anchor=\"end\" font-weight=\"400\">stop</text><text x=\"484\" y=\"72\" font-size=\"10\" fill=\"#94a3b8\" text-anchor=\"end\" font-weight=\"400\">long at PV proximal: R:R 2.81</text><text x=\"484\" y=\"86\" font-size=\"10\" fill=\"#94a3b8\" text-anchor=\"end\" font-weight=\"400\">he holds for the weekly move</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Inside HTF demand he only buys: \"We buy at demand. We do not sell at demand.\"</text></svg>",
      caption: 'Zone within a zone, as on his NATGAS chart: three H4 demands (two CP, one PV) inside a weekly demand band. The CP zones gave way, the PV demand held, and the long from it ran beyond the 2.81 R:R first shown.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km4_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km4_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"30\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">Timeframe combinations (the table on his screen)</text><rect x=\"25\" y=\"60\" width=\"590\" height=\"132\" fill=\"none\" stroke=\"#94a3b8\" stroke-width=\"1\"/><rect x=\"105\" y=\"60\" width=\"510\" height=\"44\" fill=\"#f59e0b22\"/><text x=\"39\" y=\"88\" font-size=\"14\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"700\">ETF</text><text x=\"147.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">1m</text><text x=\"232.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">5m</text><text x=\"317.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">15m</text><text x=\"402.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">H1</text><text x=\"487.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">H4</text><text x=\"572.5\" y=\"88\" font-size=\"15\" fill=\"#f59e0b\" text-anchor=\"middle\" font-weight=\"600\">1D</text><line x1=\"25\" y1=\"104\" x2=\"615\" y2=\"104\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><text x=\"39\" y=\"132\" font-size=\"14\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"700\">ITF</text><text x=\"147.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">5m</text><text x=\"232.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">15m</text><text x=\"317.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">H1</text><text x=\"402.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">H4</text><text x=\"487.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">1D</text><text x=\"572.5\" y=\"132\" font-size=\"15\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">1M</text><line x1=\"25\" y1=\"148\" x2=\"615\" y2=\"148\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><text x=\"39\" y=\"176\" font-size=\"14\" fill=\"#a78bfa\" text-anchor=\"start\" font-weight=\"700\">HTF</text><text x=\"147.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">15m</text><text x=\"232.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">H1</text><text x=\"317.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">H4</text><text x=\"402.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">1D</text><text x=\"487.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">1W</text><text x=\"572.5\" y=\"176\" font-size=\"15\" fill=\"#a78bfa\" text-anchor=\"middle\" font-weight=\"600\">3M</text><line x1=\"105\" y1=\"60\" x2=\"105\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"190\" y1=\"60\" x2=\"190\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"275\" y1=\"60\" x2=\"275\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"360\" y1=\"60\" x2=\"360\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"445\" y1=\"60\" x2=\"445\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"530\" y1=\"60\" x2=\"530\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><line x1=\"615\" y1=\"60\" x2=\"615\" y2=\"192\" stroke=\"#94a3b8\" stroke-width=\"0.8\"/><text x=\"40\" y=\"236\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">ETF = entry · ITF = intermediate (ignore for now) · HTF = higher timeframe</text><text x=\"40\" y=\"262\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Read a column: enter on 5m → zones from H1; enter on H4 → zones from the weekly.</text><text x=\"40\" y=\"288\" font-size=\"12\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"600\">Daily entry → monthly ITF, 3-month HTF.</text><text x=\"40\" y=\"320\" font-size=\"12\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">Beginners: pick ONE entry timeframe and stick to it.</text></svg>",
      caption: 'His timeframe-combinations table as it appears on screen. Read by column: ETF, then ITF, then HTF. Daily entries use 1M and 3M.',
    },
    {
      svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 640 360\" font-family=\"Inter, system-ui, sans-serif\"><defs><marker id=\"km4_ah\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#94a3b8\"/></marker><marker id=\"km4_aa\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"7\" markerHeight=\"7\" orient=\"auto-start-reverse\"><path d=\"M0,0 L10,5 L0,10 z\" fill=\"#f59e0b\"/></marker></defs><text x=\"20\" y=\"26\" font-size=\"13\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"600\">The process on his EURUSD replay: 5m entry off the H1 zone</text><rect x=\"20\" y=\"40\" width=\"140\" height=\"26\" rx=\"5\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\"/><text x=\"90\" y=\"57\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">1 pick ETF (5m)</text><line x1=\"161\" y1=\"53\" x2=\"174\" y2=\"53\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km4_ah)\"/><rect x=\"175\" y=\"40\" width=\"140\" height=\"26\" rx=\"5\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\"/><text x=\"245\" y=\"57\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">2 mark H1 zones</text><line x1=\"316\" y1=\"53\" x2=\"329\" y2=\"53\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km4_ah)\"/><rect x=\"330\" y=\"40\" width=\"140\" height=\"26\" rx=\"5\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\"/><text x=\"400\" y=\"57\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">3 wait for price</text><line x1=\"471\" y1=\"53\" x2=\"484\" y2=\"53\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km4_ah)\"/><rect x=\"485\" y=\"40\" width=\"140\" height=\"26\" rx=\"5\" fill=\"none\" stroke=\"#a78bfa\" stroke-width=\"1.2\"/><text x=\"555\" y=\"57\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"middle\" font-weight=\"400\">4 5m zone inside</text><rect x=\"20\" y=\"210\" width=\"610\" height=\"90\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\" stroke-dasharray=\"5 4\"/><text x=\"24\" y=\"226\" font-size=\"11\" fill=\"#22c55e\" text-anchor=\"start\" font-weight=\"600\">H1 demand (HTF)</text><rect x=\"170\" y=\"132\" width=\"178\" height=\"14\" fill=\"#f59e0b22\" stroke=\"#f59e0b\" stroke-width=\"1.2\" stroke-dasharray=\"5 4\"/><text x=\"172\" y=\"124\" font-size=\"10\" fill=\"#f59e0b\" text-anchor=\"start\" font-weight=\"400\">5m supply → removed</text><rect x=\"266\" y=\"240\" width=\"364\" height=\"22\" fill=\"#22c55e22\" stroke=\"#22c55e\" stroke-width=\"1.2\"/><line x1=\"60\" y1=\"84\" x2=\"60\" y2=\"116\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"55.5\" y=\"90\" width=\"9\" height=\"20\" fill=\"#ef4444\"/><line x1=\"84\" y1=\"104\" x2=\"84\" y2=\"146\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"79.5\" y=\"110\" width=\"9\" height=\"30\" fill=\"#ef4444\"/><line x1=\"108\" y1=\"134\" x2=\"108\" y2=\"176\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"103.5\" y=\"140\" width=\"9\" height=\"30\" fill=\"#ef4444\"/><line x1=\"132\" y1=\"144\" x2=\"132\" y2=\"176\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"127.5\" y=\"150\" width=\"9\" height=\"20\" fill=\"#22c55e\"/><line x1=\"156\" y1=\"134\" x2=\"156\" y2=\"156\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"151.5\" y=\"140\" width=\"9\" height=\"10\" fill=\"#22c55e\"/><line x1=\"180\" y1=\"132\" x2=\"180\" y2=\"150\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"175.5\" y=\"140\" width=\"9\" height=\"6\" fill=\"#ef4444\"/><line x1=\"204\" y1=\"140\" x2=\"204\" y2=\"186\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"199.5\" y=\"146\" width=\"9\" height=\"34\" fill=\"#ef4444\"/><line x1=\"228\" y1=\"175\" x2=\"228\" y2=\"222\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"223.5\" y=\"180\" width=\"9\" height=\"35\" fill=\"#ef4444\"/><line x1=\"252\" y1=\"210\" x2=\"252\" y2=\"252\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"247.5\" y=\"215\" width=\"9\" height=\"25\" fill=\"#ef4444\"/><line x1=\"276\" y1=\"234\" x2=\"276\" y2=\"262\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"271.5\" y=\"240\" width=\"9\" height=\"10\" fill=\"#ef4444\"/><line x1=\"300\" y1=\"238\" x2=\"300\" y2=\"258\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"295.5\" y=\"244\" width=\"9\" height=\"6\" fill=\"#22c55e\"/><line x1=\"324\" y1=\"184\" x2=\"324\" y2=\"250\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"319.5\" y=\"190\" width=\"9\" height=\"56\" fill=\"#22c55e\"/><line x1=\"348\" y1=\"124\" x2=\"348\" y2=\"196\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"343.5\" y=\"130\" width=\"9\" height=\"60\" fill=\"#22c55e\"/><line x1=\"372\" y1=\"112\" x2=\"372\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"367.5\" y=\"120\" width=\"9\" height=\"10\" fill=\"#22c55e\"/><line x1=\"396\" y1=\"116\" x2=\"396\" y2=\"156\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"391.5\" y=\"120\" width=\"9\" height=\"30\" fill=\"#ef4444\"/><line x1=\"420\" y1=\"144\" x2=\"420\" y2=\"196\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"415.5\" y=\"150\" width=\"9\" height=\"40\" fill=\"#ef4444\"/><line x1=\"444\" y1=\"184\" x2=\"444\" y2=\"240\" stroke=\"#ef4444\" stroke-width=\"1.5\"/><rect x=\"439.5\" y=\"190\" width=\"9\" height=\"38\" fill=\"#ef4444\"/><line x1=\"468\" y1=\"174\" x2=\"468\" y2=\"236\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"463.5\" y=\"180\" width=\"9\" height=\"48\" fill=\"#22c55e\"/><line x1=\"492\" y1=\"124\" x2=\"492\" y2=\"186\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"487.5\" y=\"130\" width=\"9\" height=\"50\" fill=\"#22c55e\"/><line x1=\"516\" y1=\"94\" x2=\"516\" y2=\"136\" stroke=\"#22c55e\" stroke-width=\"1.5\"/><rect x=\"511.5\" y=\"100\" width=\"9\" height=\"30\" fill=\"#22c55e\"/><text x=\"624\" y=\"256\" font-size=\"10\" fill=\"#22c55e\" text-anchor=\"end\" font-weight=\"600\">5m demand</text><line x1=\"470\" y1=\"322\" x2=\"446\" y2=\"246\" stroke=\"#94a3b8\" stroke-width=\"1.4\" marker-end=\"url(#km4_ah)\"/><text x=\"476\" y=\"330\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">pullback = entry</text><text x=\"20\" y=\"348\" font-size=\"11\" fill=\"#94a3b8\" text-anchor=\"start\" font-weight=\"400\">A wick through the 5m zone can stop you out: a slightly lower stop helps.</text></svg>",
      caption: 'The process on his EURUSD replay: mark the H1 zone, wait, drop to 5m. A 5m demand that removed a 5m supply, inside the H1 demand, gives the pullback entry.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00–01:30] NATGASUSD 4h (OANDA): the three April 2023 H4 demand zones (CP, CP, PV) and the March supplies (PV, CP) from lesson 3.',
        '[01:48–02:06] He scrolls back to August 2022, higher up the chart, to show a zone up there for comparison.',
        '[02:21–05:32] He shows the "TIMEFRAME COMBINATIONS" table (ETF/ITF/HTF) and arrows the H1 and H4 columns he trades.',
        '[05:46–06:03] On the NATGAS weekly he draws the demand at the September–October 2020 base and recolours it yellow.',
        '[06:33–08:22] Back on the 4h, the yellow weekly band contains all three H4 demand zones: the "zone within a zone". Price later rallies out of the band.',
        '[08:24–09:29] EURUSD (FXCM) 1h: an H1 demand at the May 19 low and an H1 supply at the May 23 breakdown, with the table shown again.',
        '[09:46–10:01] TradingView Replay on EURUSD 5m: the H1 demand is a wide band. A 5m supply (red) is removed and the 5m demand drawn at the base gives the entry.',
        '[11:49–12:07] H1 supplies on the way down confirm the downtrend context.',
        '[12:20–13:20] NATGAS weekly overview, then "MTA → MSA" written on the 4h chart, and a big "W" in the weekly band.',
        '[14:06–14:39] He places a long on the H4 PV demand inside the weekly zone (R:R 2.81 on the tool), then extends the target to the late-May high.',
      ],
    },
  ],
  corrections: [
    'The timeframe table on screen settles the unclear caption row. ETF 1D → ITF 1M → HTF 3M. So a daily entry\'s higher timeframe is the 3-month (the captions\' "daily three month"), and the monthly is only the ITF. The note\'s "HTF for daily is the monthly" (from the MSA lesson) does not match this table.',
    'Full table as shown: ETF 1m/5m/15m/H1/H4/1D, ITF 5m/15m/H1/H4/1D/1M, HTF 15m/H1/H4/1D/1W/3M.',
    'Natural gas example: three H4 demand zones are visible inside the weekly zone (two "CP Demand", one "PV Demand"). The two CP zones were traded through in early May, and the PV demand at the bottom is the one that held. That is the "couple failed, one worked" in the notes.',
    'He colours the higher-timeframe (weekly) zone yellow on the H4 chart so it stands apart from the green H4 zones.',
    'The trade box on screen first reads R:R 2.81 (Target 7.76%, Stop 2.76%) for the H4 PV demand long. He then drags the target to the late-May high. The "12:1" figure is spoken; the tool never shows it.',
    'EURUSD example details: FXCM feed, H1 demand at the May 19, 2023 low, H1 supply at the May 23 breakdown, and the 5m walk-through run in TradingView Replay mode.',
  ],
};
