import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';
const G = '#22c55e';
const R = '#ef4444';
const L = '#94a3b8';
const A = '#f59e0b';
const T = '#a78bfa';

const band = (y1: number, y2: number, fill: string, stroke: string, x1 = 30, x2 = 610) =>
  `<rect x="${x1}" y="${Math.min(y1, y2)}" width="${x2 - x1}" height="${Math.abs(y2 - y1)}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`;

// Figure 1: the H1 chart with the daily demand synced on (01:30-01:48).
// Price -> y: 0.8680 at y=330, 0.8760 at y=50.
const y1 = (p: number) => Math.round(300 - ((p - 0.868) / 0.0082) * 250);
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">EURGBP H1 with the daily demand: Zone 1 vs Zone 2</text>
${band(y1(0.87084), y1(0.86871), '#22c55e22', G)}
<text x="604" y="${y1(0.86871) - 5}" font-size="10" text-anchor="end" fill="${G}">DAILY demand 0.86871–0.87084</text>
${band(y1(0.87027), y1(0.86986), '#22c55e33', G, 120)}
<text x="126" y="${y1(0.87027) - 4}" font-size="11" font-weight="700" fill="${G}">Zone 1  0.86986–0.87027</text>
${band(y1(0.8734), y1(0.87278), '#22c55e22', G, 410)}
<text x="416" y="${y1(0.8734) - 5}" font-size="11" font-weight="700" fill="${G}">Zone 2  0.87278–0.87340</text>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="40,${y1(0.8722)} 70,${y1(0.8695)} 95,${y1(0.8712)} 112,${y1(0.8688)} 124,${y1(0.8702)} 132,${y1(0.8748)} 160,${y1(0.8735)} 200,${y1(0.8742)} 240,${y1(0.8749)} 268,${y1(0.8740)} 300,${y1(0.8747)} 330,${y1(0.8725)} 360,${y1(0.8709)} 378,${y1(0.8718)} 395,${y1(0.87095)} 408,${y1(0.8720)} 418,${y1(0.8736)} 440,${y1(0.8747)} 470,${y1(0.8742)} 500,${y1(0.8758)}"/>
<line x1="270" y1="${y1(0.8751)}" x2="440" y2="${y1(0.8732)}" stroke="${T}" stroke-width="1.6"/>
<text x="300" y="${y1(0.8751) - 6}" font-size="10" fill="${T}">H1 downtrend line</text>
<circle cx="126" cy="${y1(0.8700)}" r="20" fill="none" stroke="${A}" stroke-width="1.6"/>
<rect x="340" y="${y1(0.87105)}" width="70" height="4" fill="${T}" fill-opacity="0.6"/>
<g font-size="10.5">
<text x="40" y="322" fill="${A}">① formed WHILE the daily zone formed</text>
<text x="40" y="336" fill="${A}">   (embedded) = set &amp; forget</text>
<text x="330" y="322" fill="${A}">② price tags the daily proximal, rallies,</text>
<text x="330" y="336" fill="${A}">   removes the H1 trendline = confirmation</text>
</g>
</svg>`;

// Figure 2: his long position tool on Zone 2 (00:18).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">The confirmation trade on Zone 2 (his position tool)</text>
<rect x="250" y="96" width="220" height="120" fill="#22c55e22"/>
<rect x="250" y="216" width="220" height="64" fill="#ef444422"/>
${band(216, 250, '#22c55e33', G, 60, 470)}
<line x1="250" y1="216" x2="470" y2="216" stroke="${L}" stroke-width="1.4"/>
<line x1="250" y1="96" x2="470" y2="96" stroke="${G}" stroke-width="1.4"/>
<line x1="250" y1="280" x2="470" y2="280" stroke="${R}" stroke-width="1.4"/>
<line x1="60" y1="170" x2="250" y2="225" stroke="${T}" stroke-width="1.6"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" points="70,300 110,320 150,300 190,318 230,240 236,208 246,120 262,150 290,90"/>
<g font-size="11">
<text x="480" y="100" fill="${G}">TP ≈ 0.8750 (+16.4 pips)</text>
<text x="480" y="114" fill="${L}">under the prior H1 highs</text>
<text x="480" y="220" fill="${L}">Entry 0.87340 (proximal)</text>
<text x="480" y="284" fill="${R}">SL ≈ 0.8725 (8.7 pips)</text>
<text x="480" y="298" fill="${L}">just below distal 0.87278</text>
<text x="360" y="160" text-anchor="middle" font-weight="700" fill="${A}">R:R 1.89</text>
<text x="64" y="162" fill="${T}">H1 trendline removed</text>
<text x="64" y="346" fill="${L}">Zone 2 sits ABOVE the daily demand, so it is the confirmation zone.</text>
</g>
</svg>`;

// Figure 3: the daily chart (01:12) - daily demand formed by removing the daily downtrend line.
const y3 = (p: number) => Math.round(330 - ((p - 0.86) / 0.022) * 280);
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">EURGBP daily: the HTF zone and where it points</text>
${band(y3(0.88018), y3(0.87785), '#ef444422', R, 150)}
<text x="606" y="${y3(0.88018) - 4}" font-size="10" text-anchor="end" fill="${R}">daily supply 0.87785–0.88018</text>
${band(y3(0.87084), y3(0.86871), '#22c55e22', G, 400)}
<text x="606" y="${y3(0.86871) + 13}" font-size="10" text-anchor="end" fill="${G}">daily demand 0.86871–0.87084</text>
${band(y3(0.86428), y3(0.86126), '#22c55e22', G, 330)}
<text x="606" y="${y3(0.86126) + 13}" font-size="10" text-anchor="end" fill="${G}">daily demand 0.86126–0.86428</text>
<line x1="170" y1="${y3(0.8795)}" x2="470" y2="${y3(0.8705)}" stroke="${T}" stroke-width="1.6"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="40,${y3(0.8745)} 90,${y3(0.877)} 150,${y3(0.8805)} 175,${y3(0.873)} 205,${y3(0.879)} 240,${y3(0.8705)} 280,${y3(0.8655)} 310,${y3(0.871)} 335,${y3(0.8615)} 360,${y3(0.8695)} 380,${y3(0.8668)} 410,${y3(0.8705)} 430,${y3(0.8690)} 450,${y3(0.8745)} 480,${y3(0.873)} 500,${y3(0.8708)} 525,${y3(0.8765)} 535,${y3(0.879)}"/>
<path d="M418 ${y3(0.8712)} l8 -10 l10 -6" fill="none" stroke="${L}" stroke-width="2"/>
<g font-size="10.5">
<text x="300" y="${y3(0.8756) - 8}" fill="${T}">daily downtrend line</text>
<text x="20" y="350" fill="${A}">broken out of the 0.8687–0.8708 basing = the daily demand</text>
<text x="540" y="${y3(0.8775) + 4}" fill="${A}">wick into supply</text>
</g>
</svg>`;

export const KM_23: KevinMedia = {
  n: 23,
  images: [
    {
      src: '/lessons/kevin/23/f-000_t00m00s.jpg',
      caption: '[00:00] EURGBP 4-pane (1W, 4h, 1D, 1h, OANDA, 27 Feb 2026). Weekly: uptrend with an uptrend line and demand 0.82422–0.83848. 4h: price has spiked into supply 0.87794–0.87875. Daily: supply 0.87785–0.88018 above, demand 0.86871–0.87084 and 0.86126–0.86428 below. 1h: demands at 0.87650–0.87717 and 0.87278–0.87340, plus the purple low line near 0.8710.',
      notes: ['The trade is a daily-HTF / H1-entry long inside a weekly uptrend.', 'Price is already up at the daily and 4h supply, so these demands have played out.'],
    },
    {
      src: '/lessons/kevin/23/f-001_t00m12s.jpg',
      caption: '[00:12] EURGBP 1h full screen. Price runs from the purple lows (~0.8710) through the H1 downtrend line and forms demand 0.87278–0.87340, then rallies to a newer demand at 0.87650–0.87717 under the 4h/daily supply band.',
      notes: ['The demand created where the trendline breaks is the one he will call the confirmation zone ("Zone 2").'],
    },
    {
      src: '/lessons/kevin/23/f-002_t00m18s.jpg',
      caption: '[00:18] Long position tool on the 0.87278–0.87340 H1 demand: entry at the proximal 0.87340, stop 0.00087 (8.7 pips, 0.100%) just below the distal, target 0.00164 (16.4 pips, ~0.8750), Risk/Reward 1.89.',
      notes: [
        'Even a "confirmation" zone is traded with an order you set (entry, SL, TP), the same way as a set & forget trade.',
        'The target is just under the earlier H1 swing highs around 0.8750, not a fixed multiple. That gives about 1.9R.',
      ],
    },
    {
      src: '/lessons/kevin/23/f-004_t00m36s.jpg',
      caption: '[00:36] 1h zoomed out to 17 Feb. Lower demand 0.86986–0.87027 at the start of the rally, with an uptrend line from its low. In the middle: the range, the downtrend line from the 22 Feb high, the purple lows, and the breakout into 0.87278–0.87340.',
      notes: ['Two H1 demands in the same leg. The question is which one counts as set & forget and which one is confirmation.'],
    },
    {
      src: '/lessons/kevin/23/f-005_t00m54s.jpg',
      caption: '[00:54] He labels them: "Zone 1" = 0.86986–0.87027 (circled where the explosive 17 Feb rally left it) and "Zone 2" = 0.87278–0.87340 (where the H1 downtrend line was removed).',
      notes: ['The circle marks where Zone 1 formed: at the bottom of the move that also built the daily zone.'],
    },
    {
      src: '/lessons/kevin/23/f-007_t01m12s.jpg',
      caption: '[01:12] EURGBP daily. Daily demand 0.86871–0.87084 formed where price broke the daily downtrend line (he marks the break with a pen stroke). The rally then wicked into daily supply 0.87785–0.88018. A lower daily demand sits at 0.86126–0.86428.',
      notes: ['The HTF zone is itself a trendline-removal zone. The daily line from the December high is broken out of this basing.'],
    },
    {
      src: '/lessons/kevin/23/f-009_t01m30s.jpg',
      caption: '[01:30] The daily demand redrawn as a box around the two basing candles (0.86871–0.87084), ready to sync down to the 1h.',
      notes: ['He draws the HTF zone on the daily first and then carries it to the entry timeframe.'],
    },
    {
      src: '/lessons/kevin/23/f-010_t01m36s.jpg',
      caption: '[01:36] 1h with the daily demand synced on as a grey box (0.86871–0.87084). Zone 1 (0.86986–0.87027) sits INSIDE it. Zone 2 (0.87278–0.87340) sits ABOVE it. The purple lows of 24–25 Feb rest right on the daily proximal 0.87084.',
      notes: [
        'Zone 1 = embedded: it formed when the daily zone was forming, so it is set & forget.',
        'Zone 2 formed after price came back and contacted the daily zone (the purple lows on its proximal) and removed the H1 trendline, so it is confirmation.',
      ],
    },
    {
      src: '/lessons/kevin/23/f-011_t01m42s.jpg',
      caption: '[01:42] Same view, scrolled. Zone 1 starts at the 17 Feb explosive candle inside the daily box. Zone 2 starts at the 26 Feb trendline break. The newer demand at 0.87650 is at the top of the screen.',
      notes: ['"This zone was formed when the daily zone was forming. This zone was formed after the daily zone was contacted."'],
    },
    {
      src: '/lessons/kevin/23/f-012_t01m48s.jpg',
      caption: '[01:48] Final view of the same layout: daily box, Zone 1 inside, Zone 2 outside and above, the H1 downtrend line from the 22 Feb high, and the rally out of Zone 2.',
      notes: ['"So they may both look like set and forget trades... but just remember this is a confirmation zone."'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'The 1h with the daily demand synced on: Zone 1 is embedded inside the daily zone (formed with it, set & forget). Zone 2 is above it and formed after price tagged the daily proximal and removed the H1 downtrend line (confirmation).' },
    { svg: fig2, caption: 'His position tool on Zone 2: entry 0.87340, stop 8.7 pips below the distal, target about 0.8750 under the prior H1 highs, R:R 1.89.' },
    { svg: fig3, caption: 'The daily picture: the demand at 0.86871–0.87084 was created by breaking the daily downtrend line, and the rally reached the daily supply at 0.87785–0.88018.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 EURGBP 1W/4h/1D/1h: weekly uptrend from demand 0.82422–0.83848. Price is already at the 4h/daily supply (0.87785–0.88018), so the setups he explains have played out.',
        '00:12–00:18 1h: demand 0.87278–0.87340 formed by the break of the H1 downtrend line. Long position tool: entry 0.87340, SL 8.7 pips, TP 16.4 pips (~0.8750), R:R 1.89.',
        '00:36–00:54 1h zoomed out: he labels Zone 1 (0.86986–0.87027, circled at the 17 Feb explosive rally) and Zone 2 (0.87278–0.87340).',
        '01:12 Daily: demand 0.86871–0.87084 formed where price broke the daily downtrend line. The rally wicked into supply 0.87785–0.88018.',
        '01:30 He redraws the daily demand around its basing candles.',
        '01:36–01:48 Daily zone synced onto the 1h: Zone 1 sits inside it (embedded, set & forget). Zone 2 sits above it, formed after the 24–25 Feb lows tagged the daily proximal and the H1 trendline was removed (confirmation).',
      ],
    },
  ],
  corrections: [
    'Exact levels from the charts: daily demand 0.86871–0.87084, Zone 1 (embedded H1) 0.86986–0.87027, Zone 2 (confirmation H1) 0.87278–0.87340, daily supply target 0.87785–0.88018.',
    'The "contact" with the daily zone before Zone 2 was shallow: the 24–25 Feb lows (purple line, ~0.8710) only tagged the daily proximal 0.87084. They did not go deep into the zone. A tag of the proximal counts as contact.',
    'Zone 2 formed by removing an H1 downtrend line drawn from the 22 Feb swing high, and it sits fully ABOVE the daily zone, outside it.',
    'He shows the confirmation trade with a position tool: entry at the Zone 2 proximal, stop just under the distal (8.7 pips), target ~0.8750 under the prior H1 highs, R:R 1.89 (not a fixed 2R+). This backs up the point that a confirmation zone is still traded with a set order.',
    'The daily HTF zone was itself formed by removing the daily downtrend line, and the move from it ran into the daily/4h supply.',
  ],
};
