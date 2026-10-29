import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';
const G = '#22c55e';
const R = '#ef4444';
const L = '#94a3b8';
const A = '#f59e0b';
const T = '#a78bfa';

/** One candle in SVG coordinates (y grows downward): open y, close y, high y, low y. */
function c(x: number, o: number, cl: number, h: number, l: number, w = 14): string {
  const col = cl < o ? G : R;
  const top = Math.min(o, cl);
  const hgt = Math.max(2, Math.abs(o - cl));
  return `<line x1="${x}" y1="${h}" x2="${x}" y2="${l}" stroke="${col}" stroke-width="1.4"/><rect x="${x - w / 2}" y="${top}" width="${w}" height="${hgt}" fill="${col}"/>`;
}
const cs = (k: number[][], w = 14) => k.map(([x, o, cl, h, l]) => c(x, o, cl, h, l, w)).join('');

// Figure 1: his zones.JPG redrawn, plus the "no space" counter-example.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km18_a1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${R}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">The four parts of a demand zone (all four required)</text>
<rect x="120" y="214" width="290" height="62" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<text x="400" y="208" font-size="11" font-style="italic" text-anchor="end" fill="${G}">proximal line</text>
<text x="400" y="292" font-size="11" font-style="italic" text-anchor="end" fill="${G}">distal line</text>
${cs([[136, 236, 262, 214, 276], [158, 236, 262, 214, 276], [180, 236, 262, 214, 276]])}
${c(204, 256, 92, 80, 270, 16)}
${c(230, 92, 60, 48, 120, 14)}
<line x1="230" y1="128" x2="230" y2="206" stroke="${R}" stroke-width="2" marker-start="url(#km18_a1)" marker-end="url(#km18_a1)"/>
<g font-size="10.5">
<rect x="20" y="168" width="94" height="20" rx="4" fill="${L}22" stroke="${L}"/><text x="67" y="182" text-anchor="middle" fill="${L}">1 basing candles</text>
<line x1="114" y1="182" x2="132" y2="218" stroke="${L}"/>
<rect x="60" y="92" width="114" height="20" rx="4" fill="${L}22" stroke="${L}"/><text x="117" y="106" text-anchor="middle" fill="${L}">2 move-away candle</text>
<line x1="174" y1="106" x2="198" y2="140" stroke="${L}"/>
<rect x="262" y="44" width="116" height="20" rx="4" fill="${L}22" stroke="${L}"/><text x="320" y="58" text-anchor="middle" fill="${L}">3 stay-away candle</text>
<line x1="262" y1="58" x2="238" y2="70" stroke="${L}"/>
<rect x="248" y="150" width="164" height="34" rx="4" fill="${R}22" stroke="${R}"/><text x="330" y="164" text-anchor="middle" fill="${R}">4 space between stay-away</text><text x="330" y="177" text-anchor="middle" fill="${R}">candle and proximal line</text>
</g>
<line x1="440" y1="40" x2="440" y2="318" stroke="${L}" stroke-opacity="0.35"/>
<text x="460" y="58" font-size="12" font-weight="700" fill="${R}">✗ No space = no zone</text>
<rect x="460" y="214" width="160" height="62" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
${cs([[476, 236, 262, 214, 276], [496, 236, 262, 214, 276], [516, 236, 262, 214, 276]])}
${c(540, 256, 110, 98, 270, 16)}
${c(566, 110, 150, 96, 214, 14)}
<circle cx="566" cy="214" r="9" fill="none" stroke="${A}" stroke-width="1.6"/>
<text x="460" y="304" font-size="10.5" fill="${A}">stay-away wick touches</text>
<text x="460" y="316" font-size="10.5" fill="${A}">the proximal line</text>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">The faster the move away and the more price stays away, the better the zone. Supply is the mirror image.</text>
</svg>`;

// Figure 2: when a trendline is removed.
const yl = (x: number) => 300 - (x - 40) * 0.393;
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Trendline removal: the FIRST candle fully beyond the line</text>
<line x1="40" y1="300" x2="600" y2="${yl(600)}" stroke="${T}" stroke-width="1.8"/>
<text x="64" y="316" font-size="10.5" fill="${T}">uptrend line on the lowest points, no candles cut</text>
${cs([
  [80, 262, 236, 228, 276], [100, 236, 214, 204, 244], [120, 214, 236, 208, 252], [140, 236, 200, 192, 254],
  [160, 200, 178, 170, 208], [180, 178, 206, 172, 222], [200, 206, 188, 182, 230], [220, 188, 156, 146, 196],
  [240, 156, 136, 128, 164], [260, 136, 160, 130, 176], [280, 160, 176, 152, 196], [300, 176, 150, 144, 194],
  [320, 150, 128, 120, 158], [340, 128, 150, 122, 160], [360, 150, 162, 144, 176],
], 12)}
${c(400, 150, 186, 140, 196, 12)}
${c(430, 166, 200, 140, 210, 12)}
${c(460, 176, 214, 150, 222, 12)}
${c(490, 196, 232, 184, 240, 12)}
${c(520, 232, 214, 206, 246, 12)}
<g font-size="10.5">
<circle cx="400" cy="${yl(400).toFixed(1)}" r="8" fill="none" stroke="${A}" stroke-width="1.5"/>
<text x="374" y="80" text-anchor="end" fill="${A}">1st: body closes below, wick touches: NOT removed</text>
<line x1="378" y1="78" x2="396" y2="150" stroke="${A}"/>
<circle cx="430" cy="${yl(430).toFixed(1)}" r="8" fill="none" stroke="${A}" stroke-width="1.5"/>
<text x="374" y="98" text-anchor="end" fill="${A}">2nd: still touching: NOT removed</text>
<line x1="378" y1="96" x2="424" y2="138" stroke="${A}"/>
<rect x="450" y="144" width="20" height="84" fill="none" stroke="${R}" stroke-width="1.6"/>
<text x="476" y="160" fill="${R}">first candle with body AND</text>
<text x="476" y="173" fill="${R}">wick below = REMOVED here</text>
<text x="500" y="268" fill="${L}">later full closes</text>
<text x="500" y="281" fill="${L}">don't matter</text>
</g>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">No candle count: it can be the 15th candle. A zone is removed by a close beyond its distal line.</text>
</svg>`;

// Figure 3: the GBPUSD daily homework chain, Jan 2011 to Jan 2012 (schematic, his prices).
const gx = (m: number) => 50 + m * 36;
const gy = (p: number) => 40 + (1.69 - p) * 1500;
const gbp: [number, number][] = [
  [0, 1.6], [0.25, 1.63], [0.7, 1.565], [1.1, 1.59], [1.5, 1.55], [1.95, 1.534], [2.15, 1.552], [2.45, 1.585],
  [3, 1.61], [3.5, 1.63], [4, 1.6], [4.6, 1.64], [5.2, 1.625], [5.9, 1.672], [6.4, 1.62], [6.9, 1.645],
  [7.4, 1.605], [8, 1.625], [8.6, 1.616], [9.1, 1.648], [9.6, 1.661], [9.95, 1.625], [10.1, 1.618], [10.5, 1.575],
  [11.2, 1.532], [11.7, 1.585], [12.3, 1.61], [12.8, 1.555], [13.4, 1.58], [13.9, 1.545], [14.4, 1.527],
  [14.8, 1.555], [15.1, 1.575], [15.4, 1.58],
];
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">GBPUSD daily homework: the chain, Jan 2011 → Jan 2012</text>
<rect x="${gx(1.95)}" y="${gy(1.56394)}" width="${gx(10.95) - gx(1.95)}" height="${gy(1.54749) - gy(1.56394)}" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<rect x="${gx(10.05)}" y="${gy(1.62601)}" width="${gx(15.8) - gx(10.05)}" height="${gy(1.61167) - gy(1.62601)}" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
<rect x="${gx(14.35)}" y="${gy(1.53776)}" width="${gx(15.8) - gx(14.35)}" height="${gy(1.52332) - gy(1.53776)}" fill="${G}22" stroke="${G}" stroke-width="1.4" stroke-dasharray="4 3"/>
<line x1="${gx(0.25)}" y1="${gy(1.632)}" x2="${gx(2.6)}" y2="${gy(1.548)}" stroke="${T}" stroke-width="1.6"/>
<line x1="${gx(1.95)}" y1="${gy(1.532)}" x2="${gx(10.15)}" y2="${gy(1.63)}" stroke="${T}" stroke-width="1.6"/>
<line x1="${gx(9.6)}" y1="${gy(1.663)}" x2="${gx(15)}" y2="${gy(1.5594)}" stroke="${T}" stroke-width="1.6"/>
<line x1="${gx(14.5)}" y1="44" x2="${gx(14.5)}" y2="314" stroke="${R}" stroke-width="1.2" stroke-dasharray="3 3"/>
<line x1="${gx(2)}" y1="44" x2="${gx(2)}" y2="314" stroke="${R}" stroke-width="1.2" stroke-dasharray="3 3"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="${gbp.map(([m, p]) => `${gx(m).toFixed(1)},${gy(p).toFixed(1)}`).join(' ')}"/>
<g font-size="10.5">
<text x="${gx(2.3)}" y="${gy(1.536) + 4}" fill="${G}">① demand 1.54749–1.56394: removed the downtrend line</text>
<text x="${gx(6.2)}" y="${gy(1.6) + 4}" fill="${T}">uptrend line</text>
<text x="${gx(10.3)}" y="${gy(1.664)}" fill="${R}">② supply 1.61167–1.62601:</text>
<text x="${gx(10.3)}" y="${gy(1.664) + 13}" fill="${R}">removed the uptrend line</text>
<text x="${gx(14.3)}" y="${gy(1.508)}" text-anchor="end" fill="${G}">③ Jan 2012: downtrend line removed (demand 1.52332–1.53776)</text>
</g>
<g font-size="10" fill="${L}" text-anchor="middle">
<text x="${gx(2)}" y="330">Jan 2011</text><text x="${gx(6)}" y="330">May</text><text x="${gx(10)}" y="330">Sep</text><text x="${gx(14.5)}" y="330">Jan 2012</text>
</g>
<text x="20" y="350" font-size="11" fill="${L}">Red dotted lines = the homework window (4 Jan 2011, 16 Jan 2012).</text>
</svg>`;

// Figure 4: proximal line tight against the move away (EURJPY 15m homework).
function seq(ox: number): string {
  return cs([
    [ox + 20, 120, 104, 98, 128], [ox + 38, 104, 116, 98, 122], [ox + 56, 116, 106, 100, 122], [ox + 74, 106, 118, 100, 124],
    [ox + 92, 118, 108, 102, 126], [ox + 110, 108, 120, 104, 126], [ox + 128, 120, 112, 106, 126], [ox + 146, 112, 124, 108, 130],
    [ox + 164, 124, 200, 120, 206], [ox + 182, 200, 252, 196, 260], [ox + 200, 252, 238, 230, 262], [ox + 218, 238, 262, 234, 270],
    [ox + 236, 262, 292, 258, 300], [ox + 254, 292, 280, 274, 298],
  ], 12);
}
const fig4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Proximal line: right before the sharp move away</text>
<text x="20" y="54" font-size="12" font-weight="700" fill="${R}">✗ next candle is still basing</text>
<text x="340" y="54" font-size="12" font-weight="700" fill="${G}">✓ next candle is the move away</text>
<line x1="320" y1="44" x2="320" y2="318" stroke="${L}" stroke-opacity="0.35"/>
<rect x="22" y="98" width="282" height="30" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
${seq(10)}
<circle cx="84" cy="112" r="12" fill="none" stroke="${A}" stroke-width="1.6"/>
<text x="24" y="160" font-size="10.5" fill="${A}">box on early candles:</text>
<text x="24" y="173" font-size="10.5" fill="${A}">the candle after it</text>
<text x="24" y="186" font-size="10.5" fill="${A}">is more basing</text>
<rect x="450" y="106" width="174" height="24" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
${seq(330)}
<text x="620" y="98" font-size="10.5" text-anchor="end" fill="${R}">distal on the highest basing wick</text>
<text x="620" y="146" font-size="10.5" text-anchor="end" fill="${R}">proximal: last basing</text>
<text x="352" y="230" font-size="10.5" fill="${L}">the drop starts right</text>
<text x="352" y="243" font-size="10.5" fill="${L}">at the proximal line</text>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">If the candle after your proximal line looks like basing, it is not a move away and there is no zone there.</text>
</svg>`;

export const KM_18: KevinMedia = {
  n: 18,
  images: [
    {
      src: '/lessons/kevin/18/f-001.jpg',
      caption: '[00:01] "Starting soon" slide on a GBPUSD daily (FXCM) chart: "The greatest trade is often the one not taken…". The top-right note lists what qualifies a zone: removes an opposing zone, removes a trendline, makes an all-time high/low.',
      notes: ['The psychology quote that opens the session, and the three qualifiers he keeps on the chart.'],
    },
    {
      src: '/lessons/kevin/18/f-002.jpg',
      caption: '[01:50] EURUSD four-pane (OANDA). Weekly red down arrow with a "3m Proximal" dotted line, a TARGET line and weekly demand around 0.95771–0.97301. 4h supply 1.04746–1.04944 and 4h demands 1.02870–1.03151 and 1.01632–1.02190. Daily supply 1.04795–1.05394 and daily demand 1.02583–1.03192. 1h supply 1.04824–1.04949, a purple box on the 1h downtrend line and a red down arrow.',
      notes: ['Fast scan: weekly room down to demand, daily supply in control, 4h and 1h pointing down, so day-trade shorts.'],
    },
    {
      src: '/lessons/kevin/18/f-003.jpg',
      caption: '[06:49] SPX500USD four-pane: weekly and daily green up arrows with stacked demands. 4h demands 5,947.0–5,968.0 and 5,848.4–5,881.9 sit well below price, and the 1h is empty.',
      notes: ['Trend is fine, but there is nothing to trade near price on the 4h/1h, so he moves on.'],
    },
    {
      src: '/lessons/kevin/18/f-007.jpg',
      caption: '[08:29] His "zones.JPG" diagram: Basing Candles, Move Away Candles, Stay Away Candle, and a red double arrow for "Space between Stay away candle and proximal line". The box runs from the proximal line to the distal line.',
      notes: ['All four parts are required. He tells members to make this diagram their wallpaper.'],
    },
    {
      src: '/lessons/kevin/18/f-012.jpg',
      caption: '[21:52] GBPUSD daily (FXCM) homework chart. A red vertical line marks 4 Jan 2011. Demand 1.54749–1.56394 formed where the rally removed the downtrend line from the November high. Removed zones are shaded orange.',
      notes: ['First zone of the chain: it qualifies because it removed a trendline.'],
    },
    {
      src: '/lessons/kevin/18/f-013.jpg',
      caption: '[24:38] Same chart: the uptrend line drawn from the late-December low under the 2011 rally, with the 1.54749–1.56394 demand below.',
      notes: ['Trendline attached to the lowest point without cutting any candle.'],
    },
    {
      src: '/lessons/kevin/18/f-016.jpg',
      caption: '[30:17] GBPUSD daily, May 2011 close-up of the uptrend line: several candles push through the line while their wicks or bodies still touch it.',
      notes: ['A trendline is removed only by the first candle whose body and wick close fully below it.'],
    },
    {
      src: '/lessons/kevin/18/f-024.jpg',
      caption: '[39:10] Member homework on EURJPY 15m (OANDA): a large 4h zone at the top (labelled "4h-DZ" but drawn red, as supply), four "15min-SZ" boxes on the way down, and a green 4h-DZ at the bottom.',
      notes: ['MTA homework: 4h as the higher timeframe, 15m for entries. Send both charts.'],
    },
    {
      src: '/lessons/kevin/18/f-026.jpg',
      caption: '[40:09] Zoomed into the member\'s third 15min-SZ: he circles the small candle right under the proximal line and the drop that follows.',
      notes: ['The candle right after the proximal line must be the move away. Keep the proximal line tight against the sharp move.'],
    },
    {
      src: '/lessons/kevin/18/f-028.jpg',
      caption: '[40:42] He draws black rectangles around the basing at the start of the first and the last 15min-SZ.',
      notes: ['Wrap the zone around the basing that comes right before the sharp move.'],
    },
    {
      src: '/lessons/kevin/18/f-042.jpg',
      caption: '[43:38] EURUSD four-pane with the "<50% Body Candle" indicator on the daily. Daily supply 1.04795–1.05394, daily demand 1.02583–1.03192.',
      notes: ['The 50% candle indicator only helps spot basing ("cruise control"). He can trade without it.'],
    },
    {
      src: '/lessons/kevin/18/f-050.jpg',
      caption: '[44:33] Member High Noon Randy\'s GBPUSD daily chain (dark theme): yearly vertical lines from 2006 and yellow removed zones. Supply 1.71514–1.75175, supply 1.61167–1.62540, demand 1.52332–1.53776.',
      notes: ['Chain analysis carried across many years on one chart.'],
    },
    {
      src: '/lessons/kevin/18/f-055.jpg',
      caption: '[46:33] Same member chart, 2011: labels "First zone that removed the trendline" and "2nd zone", with the red supply 1.61167–1.62540 to the right.',
      notes: ['When a trendline is removed, draw every zone that removed it.'],
    },
    {
      src: '/lessons/kevin/18/f-056.jpg',
      caption: '[47:33] He circles the September 2011 basing under the uptrend line where the red supply 1.61167–1.62540 begins, and ticks it.',
      notes: ['The supply qualifies because it removed the uptrend line.'],
    },
    {
      src: '/lessons/kevin/18/f-064.jpg',
      caption: '[51:35] Member matjoe\'s GBPUSD daily with a break-of-structure indicator (BOS/CHoCH labels). He circles candles just under the member\'s orange zone in late January 2011.',
      notes: ['Indicators that flag strong moves do not follow the chain analysis. Many of the flags are not zones.'],
    },
    {
      src: '/lessons/kevin/18/f-065.jpg',
      caption: '[53:33] USDCAD four-pane (OANDA): weekly and 4h green up arrows. Weekly demands around 1.34197–1.35766 and 1.31746. Daily demands 1.42094–1.42818 and 1.39050–1.39674. Very large-wick 4h candles at the start of February 2025.',
      notes: ['Huge news-type wicks: judge the whole candle. A one-off emotional wick through a zone is ignored.'],
    },
    {
      src: '/lessons/kevin/18/f-067.jpg',
      caption: '[54:10] XAUUSD four-pane: green up arrows on all four timeframes. 4h demands 2,758.390–2,768.121 and 2,716.615–2,727.040, daily demands 2,689.375–2,719.004 and about 2,580.170.',
      notes: ['Every timeframe aligned up: the kind of chart that passes the fast scan.'],
    },
    {
      src: '/lessons/kevin/18/f-069.jpg',
      caption: '[54:15] His GBPUSD daily homework chart at the next boundary (red line 16 Jan 2012): supplies 1.61167–1.62601 and 1.66218–1.67458, and the downtrend line from the August 2011 high ending at the January 2012 break.',
      notes: ['Next homework: January 2012 to January 2013 on the same chart.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'His zones.JPG redrawn: basing candles, move-away candle, stay-away candle, and the space between the stay-away candle and the proximal line. If the stay-away wick touches the proximal line, there is no space and no zone.' },
    { svg: fig2, caption: 'Trendline removal: candles whose wick or body still touch the line do not remove it. The first candle that is fully beyond the line (body and wick) removes it, and later closes are irrelevant.' },
    { svg: fig3, caption: 'GBPUSD daily homework chain: (1) the January 2011 demand 1.54749–1.56394 removed the downtrend line, (2) the September 2011 supply 1.61167–1.62601 removed the uptrend line, (3) the next downtrend line was removed in mid-January 2012.' },
    { svg: fig4, caption: 'From the EURJPY 15m homework: the proximal line goes on the last basing, right before the sharp move. A box whose next candle is still basing is not a zone.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:01 Starting-soon slide on GBPUSD daily (FXCM), with the quote and the three zone qualifiers in the corner.',
        '01:50 EURUSD four-pane: weekly 3m Proximal line and target, daily supply 1.04795–1.05394, 4h supply 1.04746–1.04944, 1h supply 1.04824–1.04949 under a 1h downtrend line.',
        '06:49 SPX500USD four-pane: weekly and daily uptrends, 4h demands far below price, empty 1h.',
        '08:12–17:22 zones.JPG: basing candles, move-away candles, stay-away candle, and the space to the proximal line.',
        '21:52–26:38 GBPUSD daily homework (red line 4 Jan 2011): demand 1.54749–1.56394 after the downtrend line was removed, then the 2011 uptrend line.',
        '29:49–30:30 Close-ups of the 2011 uptrend line: candles crossing it while still touching it.',
        '38:30–40:42 Discord homework: EURJPY 15m MTA with 4h zones. He circles the candle under a proximal line and boxes the true basing.',
        '43:38 EURUSD four-pane with the "<50% Body Candle" indicator.',
        '44:33–48:03 Member chain on GBPUSD daily: "First zone that removed the trendline", "2nd zone", supply 1.61167–1.62540, demand 1.52332–1.53776 in January 2012.',
        '50:43–51:35 Member chart with a BOS/CHoCH indicator. He circles candles under one of the member\'s zones.',
        '53:33 USDCAD four-pane with large-wick 4h candles. 54:10 XAUUSD all timeframes up.',
        '54:15 His GBPUSD daily at the January 2012 boundary: supplies 1.61167–1.62601 and 1.66218–1.67458, downtrend line removed.',
      ],
    },
  ],
  corrections: [
    'The homework chart is GBPUSD daily on FXCM. Red vertical lines mark the homework window boundaries (4 Jan 2011, 16 Jan 2012).',
    'Chain prices visible on screen: the January 2011 demand that removed the downtrend line is 1.54749–1.56394, and the September 2011 supply that removed the uptrend line is 1.61167–1.62601. A member\'s version shows 1.61167–1.62540.',
    'The diagram on screen labels the fourth part as "Space between Stay away candle and proximal line". The space is measured from the stay-away candle, not from the move-away candle.',
    'The indicator is labelled "<50% Body Candle" on his charts.',
    'In the S&P 500 scan the 4h is not empty: two demands (5,947.0–5,968.0 and 5,848.4–5,881.9) sit well below price. Only the 1h is empty, so "nothing on 4H/1H" means nothing to trade near price.',
    'The MTA homework shown is EURJPY 15m (OANDA) with 4h zones. The member labelled the red 4h supply at the top "4h-DZ".',
    'EURUSD scan details: weekly "3m Proximal" line and TARGET, daily supply 1.04795–1.05394 above price, 4h supply 1.04746–1.04944, 1h supply 1.04824–1.04949 with a 1h downtrend line.',
  ],
};
