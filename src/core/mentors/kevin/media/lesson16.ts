import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';
const G = '#22c55e';
const R = '#ef4444';
const L = '#94a3b8';
const A = '#f59e0b';
const T = '#a78bfa';

/** One candle in SVG coordinates (y grows downward): open y, close y, high y, low y. */
function c(x: number, o: number, cl: number, h: number, l: number, w = 12): string {
  const col = cl < o ? G : R;
  const top = Math.min(o, cl);
  const hgt = Math.max(2, Math.abs(o - cl));
  return `<line x1="${x}" y1="${h}" x2="${x}" y2="${l}" stroke="${col}" stroke-width="1.4"/><rect x="${x - w / 2}" y="${top}" width="${w}" height="${hgt}" fill="${col}"/>`;
}

// The same rally-base-drop sequence, drawn in panel space starting at ox.
function rbd(ox: number): string {
  const k: [number, number, number, number, number][] = [
    [30, 290, 262, 256, 298], [48, 264, 228, 222, 270], [66, 230, 182, 176, 236],
    [86, 172, 180, 128, 184], [102, 180, 174, 150, 186], [118, 174, 182, 156, 186],
    [138, 182, 262, 178, 268], [156, 262, 300, 258, 308],
    [180, 300, 284, 278, 312], [198, 284, 262, 256, 290], [216, 262, 238, 196, 266],
    [234, 238, 266, 234, 272], [252, 266, 250, 244, 272], [270, 250, 232, 196, 254], [288, 232, 262, 228, 268],
  ];
  return k.map(([x, o, cl, h, l]) => c(ox + x, o, cl, h, l)).join('');
}

// Figure 1: GBPCHF daily supply, the box that cuts the wick vs the corrected box.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km16_a1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${A}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">GBPCHF daily supply: same basing, two boxes</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${R}">✗ 1.14096–1.15096 (first box)</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${G}">✓ 1.14578–1.15476 (corrected)</text>
<line x1="320" y1="40" x2="320" y2="330" stroke="${L}" stroke-opacity="0.35"/>
<rect x="80" y="146" width="225" height="50" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
<line x1="150" y1="196" x2="305" y2="196" stroke="${L}" stroke-dasharray="3 3"/>
${rbd(0)}
<path d="M40,104 L80,128" stroke="${A}" stroke-width="1.4" fill="none" marker-end="url(#km16_a1)"/>
<text x="14" y="88" font-size="10.5" fill="${A}">basing wick pokes out</text>
<text x="14" y="100" font-size="10.5" fill="${A}">above the box = cut</text>
<text x="150" y="112" font-size="10.5" fill="${L}">box bottom sits on the later</text>
<text x="150" y="124" font-size="10.5" fill="${L}">reaction highs (dotted): S/R</text>
<rect x="400" y="128" width="225" height="58" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
${rbd(320)}
<text x="622" y="122" font-size="10.5" text-anchor="end" fill="${R}">distal 1.15476 on the highest wick</text>
<text x="622" y="180" font-size="10.5" text-anchor="end" fill="${R}">proximal 1.14578 at the basing</text>
<text x="622" y="104" font-size="10.5" text-anchor="end" fill="${L}">nothing cuts through either line</text>
<line x1="20" y1="320" x2="620" y2="320" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="342" font-size="11" fill="${L}">Distal on the extreme wick of the basing, proximal on the basing. Hold Ctrl for the magnet.</text>
</svg>`;

// Figure 2: the black-out test.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Black-out test: hide price after the zone's origin</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${G}">✓ Real zone</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${R}">✗ Area drawn after the fact</text>
<line x1="320" y1="40" x2="320" y2="330" stroke="${L}" stroke-opacity="0.35"/>
${[
  [30, 200, 214, 192, 222], [46, 214, 204, 198, 220], [62, 204, 222, 200, 228], [78, 222, 236, 218, 242],
  [94, 236, 246, 232, 252], [110, 246, 240, 236, 254], [126, 240, 248, 234, 252], [142, 248, 160, 156, 252],
  [158, 160, 112, 106, 164], [174, 112, 96, 90, 118],
].map(([x, o, cl, h, l]) => c(x, o, cl, h, l)).join('')}
<rect x="88" y="232" width="100" height="22" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<rect x="190" y="70" width="120" height="240" fill="${L}" fill-opacity="0.45" stroke="${L}"/>
<text x="250" y="186" font-size="11" text-anchor="middle" fill="${L}">hidden</text>
<text x="30" y="282" font-size="10.5" fill="${G}">basing, then a large quick move away:</text>
<text x="30" y="296" font-size="10.5" fill="${G}">the reason is already on the chart</text>
${[
  [350, 180, 196, 172, 202], [366, 196, 188, 182, 204], [382, 188, 206, 184, 212], [398, 206, 194, 188, 212],
  [414, 194, 184, 150, 200], [430, 184, 198, 178, 204], [446, 198, 190, 184, 206], [462, 190, 204, 186, 210],
  [478, 204, 196, 190, 214], [494, 196, 210, 192, 216],
].map(([x, o, cl, h, l]) => c(x, o, cl, h, l)).join('')}
<rect x="408" y="148" width="100" height="18" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
<rect x="508" y="70" width="112" height="240" fill="${L}" fill-opacity="0.45" stroke="${L}"/>
<text x="564" y="186" font-size="11" text-anchor="middle" fill="${L}">hidden</text>
<text x="340" y="250" font-size="10.5" fill="${R}">the box starts at a random candle: no basing,</text>
<text x="340" y="264" font-size="10.5" fill="${R}">no move away. It only exists because price</text>
<text x="340" y="278" font-size="10.5" fill="${R}">later reacted there several times (S/R)</text>
<line x1="20" y1="320" x2="620" y2="320" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="342" font-size="11" fill="${L}">He blacked out a DailyFX example the same way: nothing at the zones' start explained them.</text>
</svg>`;

// Figure 3: EURUSD daily 2008 supply, drawn before the fact and revisited in late 2009.
const eurPath: [number, number][] = [
  [0, 1.59], [0.5, 1.57], [1, 1.5], [1.4, 1.47], [1.8, 1.495], [2.1, 1.485], [2.5, 1.42], [3, 1.36], [3.5, 1.26],
  [4, 1.29], [4.6, 1.25], [5.1, 1.33], [5.6, 1.47], [6, 1.39], [6.5, 1.3], [7, 1.27], [8, 1.25], [8.6, 1.35],
  [9, 1.31], [10, 1.38], [11, 1.41], [12, 1.4], [13, 1.43], [14, 1.46], [15, 1.47], [15.6, 1.5], [16, 1.485],
  [16.6, 1.512], [17, 1.47], [17.5, 1.43], [18, 1.39], [19, 1.36], [20, 1.35], [21, 1.33], [22, 1.24],
  [23, 1.19], [24, 1.28],
];
const ex = (m: number) => 50 + m * 22;
const ey = (p: number) => 50 + (1.62 - p) * 590;
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km16_a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${A}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">EURUSD daily: zone drawn in 2008, used in 2009</text>
<rect x="${ex(1.8)}" y="${ey(1.49801)}" width="${ex(24) - ex(1.8)}" height="${ey(1.48629) - ey(1.49801)}" fill="${R}33" stroke="${R}" stroke-width="1.4"/>
<text x="${ex(24)}" y="${ey(1.49801) - 6}" font-size="10.5" text-anchor="end" fill="${R}">supply 1.48629–1.49801</text>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="${eurPath.map(([m, p]) => `${ex(m).toFixed(1)},${ey(p).toFixed(1)}`).join(' ')}"/>
<circle cx="${ex(1.9)}" cy="${ey(1.492)}" r="12" fill="none" stroke="${A}" stroke-width="1.6"/>
<text x="${ex(2.6)}" y="${ey(1.6)}" font-size="10.5" fill="${A}">Sep 2008: basing, then the drop.</text>
<text x="${ex(2.6)}" y="${ey(1.6) + 13}" font-size="10.5" fill="${A}">Zone is on the chart from here.</text>
<circle cx="${ex(16.6)}" cy="${ey(1.505)}" r="14" fill="none" stroke="${A}" stroke-width="1.6"/>
<path d="M${ex(16.6)},84 L${ex(16.6)},102" stroke="${A}" stroke-width="1.4" fill="none" marker-end="url(#km16_a3)"/>
<text x="${ex(17.3)}" y="${ey(1.6)}" font-size="10.5" fill="${A}">Nov–Dec 2009: price returns</text>
<text x="${ex(17.3)}" y="${ey(1.6) + 13}" font-size="10.5" fill="${A}">and turns down from the zone</text>
<text x="${ex(23) - 8}" y="${ey(1.19) + 4}" font-size="10.5" text-anchor="end" fill="${L}">1.19 (Jun 2010)</text>
<g font-size="10" fill="${L}" text-anchor="middle">
<text x="${ex(0)}" y="330">Jul 08</text><text x="${ex(6)}" y="330">Jan 09</text><text x="${ex(12)}" y="330">Jul 09</text><text x="${ex(18)}" y="330">Jan 10</text><text x="${ex(24)}" y="330">Jul 10</text>
</g>
<line x1="40" y1="318" x2="610" y2="318" stroke="${L}" stroke-opacity="0.4"/>
<text x="20" y="350" font-size="11" fill="${L}">Analysis before the fact: entry, stop and target exist before price ever reacts.</text>
</svg>`;

// Figure 4: avoid the zone on the trendline / old high; prefer the zone beyond the retail stops.
const fig4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km16_a4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${L}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Where retail stops sit: trendline and old high</text>
<line x1="40" y1="320" x2="600" y2="96" stroke="${T}" stroke-width="1.8"/>
<text x="596" y="88" font-size="10.5" text-anchor="end" fill="${T}">uptrend line</text>
<line x1="150" y1="168" x2="330" y2="168" stroke="${L}" stroke-dasharray="4 3"/>
<text x="152" y="160" font-size="10.5" fill="${L}">old high</text>
<rect x="330" y="168" width="270" height="22" fill="${G}22" stroke="${G}" stroke-width="1.4" stroke-dasharray="5 3"/>
<text x="500" y="152" font-size="10.5" fill="${G}">A: on the line + old high</text>
<text x="486" y="164" font-size="10" fill="${L}">old resistance = new support</text>
<g stroke="${R}" stroke-width="1.6">
${[352, 372, 392, 412].map((x) => `<line x1="${x - 4}" y1="214" x2="${x + 4}" y2="222"/><line x1="${x + 4}" y1="214" x2="${x - 4}" y2="222"/>`).join('')}
</g>
<text x="344" y="222" font-size="10.5" text-anchor="end" fill="${R}">retail stops</text>
<rect x="330" y="250" width="270" height="24" fill="${G}33" stroke="${G}" stroke-width="1.6"/>
<text x="600" y="290" font-size="10.5" text-anchor="end" fill="${G}">B: demand below the stops (his pick)</text>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="60,300 110,250 140,262 170,172 200,210 240,226 280,150 310,120 340,150 362,184 382,174 400,222 414,262 430,252 450,200 470,170"/>
<path d="M404,300 L412,272" stroke="${L}" stroke-width="1.2" fill="none" marker-end="url(#km16_a4)"/>
<text x="330" y="314" font-size="10.5" fill="${L}">whippy stop run through A, real buying at B</text>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">With the trend and good R:R he may still take A, but he watches for the liquidity search first.</text>
</svg>`;

export const KM_16: KevinMedia = {
  n: 16,
  images: [
    {
      src: '/lessons/kevin/16/f-000.jpg',
      caption: '[00:00] GBPCHF four-pane (OANDA), Sunday 2 July 2023. Weekly with a red down arrow. 4h supplies 1.13995–1.14136 and 1.14605–1.14838, 4h demand 1.12800–1.13060. Daily supply 1.14485–1.15476 and daily demand 1.08964–1.10436. 1h supply 1.14380–1.14484 and 1h demands 1.13375–1.13516, 1.13145–1.13277 and 1.12894–1.13004.',
      notes: ['His normal layout: weekly, 4h, daily and 1h side by side, every zone labelled with its two prices.'],
    },
    {
      src: '/lessons/kevin/16/f-004.jpg',
      caption: '[04:07] GBPCHF daily: a supply box 1.14096–1.15096 drawn from the December basing. The high wick of the basing pokes out above the top line, and the bottom line lines up with the later reaction highs in January and March.',
      notes: ['A box that cuts through a wick and is anchored to later reactions is the mistake he warns about.'],
    },
    {
      src: '/lessons/kevin/16/f-008.jpg',
      caption: '[04:39] GBPCHF daily, the same supply redrawn as 1.14578–1.15476: distal on the highest wick of the basing, proximal on the basing, then the drop away.',
      notes: ['"We don\'t cut through a candle." The distal goes on the extreme wick of the basing.', 'Rally, base, drop: basing first, then a large quick move away.'],
    },
    {
      src: '/lessons/kevin/16/f-014.jpg',
      caption: '[05:40] EURUSD daily (FXCM), 2008: supply 1.48629–1.49801 at the basing between the August and September 2008 drops.',
      notes: ['An old zone with clear basing and a strong move away, marked before price returned.'],
    },
    {
      src: '/lessons/kevin/16/f-029.jpg',
      caption: '[09:06] EURUSD daily (FXCM), zoomed out: the 2009 rally returns to the 1.48629–1.49801 supply in November–December 2009 and turns down to about 1.19 by mid-2010. Daily demand 1.32528–1.34437 is also on the chart.',
      notes: ['Analysis before the fact: the zone was on the chart more than a year before price reacted to it.'],
    },
    {
      src: '/lessons/kevin/16/f-015.jpg',
      caption: '[05:48] Google image result (DailyFX): a "Supply Zone" and a "Demand Zone" with a breakout through the demand and a "retracement back towards the demand zone".',
      notes: ['If price clearly breaks a zone, it is gone. With a real zone the order, stop and target were already set, so you take the loss and move on.'],
    },
    {
      src: '/lessons/kevin/16/f-016.jpg',
      caption: '[06:18] DailyFX image with "Stops for short positions" above a supply zone and "Stops for long positions" below a demand zone, both drawn across repeated highs and lows.',
      notes: ['Boxes across areas that price touched several times are support and resistance, not supply and demand zones.'],
    },
    {
      src: '/lessons/kevin/16/f-024.jpg',
      caption: '[08:27] DailyFX "Sharp moves off supply and demand zones": he covers everything to the right of where the zones start with a black box and points at their start.',
      notes: ['Black-out test: with price to the right hidden, nothing at the start of these zones explains them, so they were drawn after the fact.'],
    },
    {
      src: '/lessons/kevin/16/f-032.jpg',
      caption: '[18:43] Vantage example of a supply (RCD): Rally, Consolidation, Drop, with the lines marked "Highest Candle Wick" and "Lowest Candle Body".',
      notes: ['A search result that does show the structure: basing at the top, then a strong drop away.'],
    },
    {
      src: '/lessons/kevin/16/f-033.jpg',
      caption: '[19:13] Colibri Trader example: "1) Large bodies", "2) small body", "3) Supply Zone Base" over a supply zone.',
      notes: ['Large-bodied candles in, a small basing candle, then the zone wrapped around that base.'],
    },
    {
      src: '/lessons/kevin/16/f-031.jpg',
      caption: '[16:41] GBPUSD 4h (OANDA): broken downtrend line, demands 1.25102–1.25341, 1.24536–1.24906 and 1.23272–1.23634 below price, with older zones shaded orange.',
      notes: ['Live chart used while answering questions about zones and trendlines.'],
    },
    {
      src: '/lessons/kevin/16/f-045.jpg',
      caption: '[20:19] GBPUSD four-pane (OANDA). Weekly demands 1.23081–1.25087 and 1.14468–1.16084. 4h supply 1.27033–1.27376 and 4h demands 1.24536–1.24906 and 1.25102–1.25341. Daily uptrend (green arrow, rising trend line), daily demands 1.24870–1.25858 and 1.21904–1.22654. 1h demand 1.26398–1.26545 under a 1h downtrend line.',
      notes: ['Stacking odds: with the daily trend and inside higher-timeframe demand.'],
    },
    {
      src: '/lessons/kevin/16/f-050.jpg',
      caption: '[26:04] XAUUSD four-pane (OANDA). Weekly demand about 1765.910–1870.245 with a red circle on it and a "3m Distal" dotted line far below. 4h supply 1949.742–1956.840 under a 4h downtrend line, with a red arrow down. Daily supplies 1970.348–1985.390 and 2035.230–2075.282 above a broken daily uptrend line. 1h demand near 1896.385 with a red arrow down.',
      notes: ['A 3-month zone carried down to the weekly as a labelled dotted line.'],
    },
    {
      src: '/lessons/kevin/16/f-052.jpg',
      caption: '[36:06] GBPUSD 1h: demand 1.26398–1.26545 under a long 1h downtrend line, with another demand at 1.25724–1.25946. Price has just pushed up into the trendline.',
      notes: ['The trendline-demand question: a decent setup with momentum, but trendlines are where retail trades and stops get run.'],
    },
    {
      src: '/lessons/kevin/16/f-054.jpg',
      caption: '[36:08] GBPUSD 1-minute chart near the same trendline: choppy, whippy price action under the line.',
      notes: ['On the 1-minute the whippy action around a trendline is even more extreme.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'GBPCHF daily supply as drawn on screen. The first box (1.14096–1.15096) cuts the basing wick and sits on later reaction highs. The corrected box (1.14578–1.15476) has the distal on the highest wick and the proximal on the basing.' },
    { svg: fig2, caption: 'Black-out test: hide everything after the zone\'s origin. A real zone already shows basing and a large quick move away. An area box that starts at a random candle has no reason there; it was drawn after the fact.' },
    { svg: fig3, caption: 'EURUSD daily: the 1.48629–1.49801 supply formed in September 2008 and was hit again in November–December 2009, followed by the fall to about 1.19. That is analysis before the fact.' },
    { svg: fig4, caption: 'Trading against retail: a demand on a trendline or an old high (A) has retail stops just below it. He prefers the zone below those stops (B), where the stop run tends to end.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 GBPCHF four-pane (OANDA, 2 July 2023): 4h supplies 1.13995–1.14136 and 1.14605–1.14838, daily supply 1.14485–1.15476, daily demand 1.08964–1.10436 and a stack of 1h demands.',
        '01:18 Google image search for "supply and demand trading", used throughout as examples of what is and is not a zone.',
        '04:07–04:39 GBPCHF daily: a supply box 1.14096–1.15096 that cuts the basing wick is redrawn as 1.14578–1.15476, with the distal on the highest wick.',
        '05:40 EURUSD daily (FXCM) 2008: supply 1.48629–1.49801 at the basing between the August and September 2008 drops.',
        '05:48–06:44 DailyFX images: a breakout through a demand, and zones drawn on repeated highs and lows with "stops for short/long positions" (S/R, not S&D).',
        '08:27 Black-out test on the DailyFX "Sharp moves off supply and demand zones" image: a black box over the price to the right of the zone starts.',
        '09:03–09:07 EURUSD daily: the 2008 supply is revisited in November–December 2009 and price falls to about 1.19. Daily demand 1.32528–1.34437 is also drawn.',
        '16:41 GBPUSD 4h: broken downtrend line and three demands below price.',
        '18:43–19:43 Vantage (Rally / Consolidation / Drop, "Highest Candle Wick", "Lowest Candle Body") and Colibri Trader ("Large bodies", "small body", "Supply Zone Base") examples.',
        '20:19–20:35 GBPUSD four-pane: daily uptrend with demands 1.24870–1.25858 and 1.21904–1.22654, weekly supply 1.29641–1.31676, 4h supply 1.27033–1.27376, 1h demand 1.26398–1.26545.',
        '26:04 XAUUSD four-pane: weekly demand with a "3m Distal" line below, 4h supply 1949.742–1956.840 under a downtrend line, daily supplies above a broken uptrend line.',
        '36:05–36:08 GBPUSD 1h demand 1.26398–1.26545 near a downtrend line, then the 1-minute chart to show the whippy action around the line.',
      ],
    },
  ],
  corrections: [
    'The session date is Sunday 2 July 2023 (Windows clock on screen).',
    'The "draw from the wicks / never cut through candles" example is GBPCHF daily (OANDA). A first box at 1.14096–1.15096 left the basing high wick sticking out above it. It was redrawn as 1.14578–1.15476, with the distal on that wick.',
    'The "before the fact" example is EURUSD daily (FXCM): supply 1.48629–1.49801 formed in September 2008 and price returned to it in November–December 2009, then fell to about 1.19 by June 2010.',
    'The black-out test was shown on a DailyFX/IG image ("Sharp moves off supply and demand zones"). He drew a black rectangle over everything right of the zone starts and arrowed their start.',
    'The S/R example he criticises is the DailyFX image with "Stops for short positions" and "Stops for long positions" drawn on repeated highs and lows.',
    'The trendline example is GBPUSD: 1h demand 1.26398–1.26545 near a 1h downtrend line, then the 1-minute chart to show the whipsaw near the line.',
  ],
};
