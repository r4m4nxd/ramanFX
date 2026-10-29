import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: the dotted BUY line on each macro timeframe, sized by timeframe.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Macro layout: a dotted BUY line at each zone's proximal</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,60 70,80 100,70 130,110 160,100 190,140 220,130 250,170 280,160 310,205 340,195 370,240 400,232 430,275 460,268"/>
<rect x="150" y="104" width="470" height="26" fill="#22c55e1f" stroke="#22c55e"/>
<line x1="330" y1="104" x2="620" y2="104" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="340" y="99" font-size="11" fill="#22c55e">BUY — 1M zone · $100</text>
<rect x="230" y="160" width="390" height="30" fill="#22c55e26" stroke="#22c55e"/>
<line x1="380" y1="160" x2="620" y2="160" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="390" y="155" font-size="11" fill="#22c55e">BUY — 3M zone · $200</text>
<rect x="300" y="210" width="320" height="36" fill="#22c55e2e" stroke="#22c55e"/>
<line x1="430" y1="210" x2="620" y2="210" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="440" y="205" font-size="11" fill="#22c55e">BUY — 6M zone · $300</text>
<rect x="360" y="268" width="260" height="56" fill="#22c55e3a" stroke="#22c55e" stroke-width="1.6"/>
<line x1="470" y1="268" x2="620" y2="268" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="480" y="263" font-size="11" font-weight="700" fill="#22c55e">BUY — 12M zone · $500</text>
<text x="20" y="346" font-size="11" fill="#94a3b8">No stop loss (dividend stocks only). The higher the timeframe, the deeper the pullback and the bigger the buy.</text>
<text x="40" y="200" font-size="11" fill="#f59e0b">keep collecting</text>
<text x="40" y="216" font-size="11" fill="#f59e0b">the dividend</text>
</svg>`;

// Figure 2: the S&P drawing — wait for a break of the prior high, then buy the new demand on the pullback.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km9_arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">S&amp;P 500 monthly — don't chase, buy the pullback to new demand</text>
<rect x="210" y="120" width="410" height="34" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="140" font-size="10" text-anchor="end" fill="#ef4444">monthly supply under the 2022 high</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="20,320 60,280 90,240 120,200 150,150 175,110 200,100 215,125 235,200 255,240 275,215 300,230 325,195 345,180 360,150"/>
<rect x="378" y="88" width="242" height="22" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<line x1="540" y1="88" x2="620" y2="88" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="612" y="124" font-size="10" text-anchor="end" fill="#22c55e">new demand (base after the break)</text>
<path d="M360,150 L376,96 L392,92 L408,100 L424,94 L470,40 L505,58 L540,90 L585,42" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4" marker-end="url(#km9_arr2)"/>
<circle cx="540" cy="90" r="4" fill="#22c55e"/>
<text x="548" y="80" font-size="10" fill="#22c55e">BUY</text>
<text x="260" y="270" font-size="11" fill="#ef4444">now: at the highs — not a buy</text>
<text x="20" y="346" font-size="11" fill="#94a3b8">"We prove that price can push all the way up to here": the demand left after the break becomes the discount buy.</text>
</svg>`;

// Figure 3: MMM — buying 1M zones on the way down into the 12M demand.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">MMM — falling into the 12-month demand</text>
<rect x="250" y="60" width="370" height="40" fill="#ef444422" stroke="#ef4444"/>
<text x="612" y="76" font-size="10" text-anchor="end" fill="#ef4444">12M supply 174.94–219.75</text>
<line x1="150" y1="50" x2="600" y2="230" stroke="#a78bfa" stroke-width="1.4"/>
<text x="470" y="170" font-size="10" fill="#a78bfa">3M / 1M downtrend line</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,300 70,250 100,200 130,120 150,60 175,70 200,120 220,100 245,140 270,150 290,190 310,180 330,215 350,210 370,250 390,245 410,268"/>
<g fill="#22c55e"><circle cx="245" cy="140" r="4"/><circle cx="290" cy="190" r="4"/><circle cx="330" cy="215" r="4"/><circle cx="370" cy="250" r="4"/></g>
<text x="190" y="200" font-size="10" fill="#22c55e">1M buys on the way down</text>
<rect x="380" y="262" width="240" height="56" fill="#22c55e33" stroke="#22c55e" stroke-width="1.6"/>
<line x1="380" y1="262" x2="620" y2="262" stroke="#22c55e" stroke-width="1.6" stroke-dasharray="3 4"/>
<text x="612" y="282" font-size="10" text-anchor="end" fill="#22c55e">BUY — 12M demand, proximal ≈98</text>
<text x="612" y="298" font-size="10" text-anchor="end" fill="#22c55e">3M/6M BUY ≈95.46</text>
<text x="400" y="340" font-size="11" fill="#f59e0b">heavy capital while price holds here</text>
</svg>`;

export const KM_09: KevinMedia = {
  n: 9,
  images: [
    {
      src: '/lessons/kevin/09/f-000.jpg',
      caption: '[00:00] MMM (3M Co., NYSE), four-pane "MACRO" layout: 12M, 6M, 3M, 1M. The 12M BUY dotted line is at the demand proximal (about 98–102). The 6M and 3M BUY lines are at 95.46. The 1M has a purple zone at 89.60–94.14, and the 3M and 1M have downtrend lines with red down-arrows.',
      notes: [
        'His investing layout is four macro timeframes side by side, each with its own demand and a dotted "BUY" line at the proximal.',
        'Supplies above: 12M 174.94–219.75; 3M 169.18–186.30 and 202.79–219.75; 1M 138.22–152.30 and 170.84–186.30.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-001.jpg',
      caption: '[00:57] KO (Coca-Cola) macro layout: the 12M BUY sits far below price (about 43–44). The 3M BUY is at 57.08 on a 3M demand of about 52–57. The 1M shows a demand formed after price broke a peach supply (green up-arrow).',
      notes: [
        'The 12M has no fresh zone near price; its only buy is all the way down at about 43–44.',
        'The usable zones near price are the 3M and 1M demands.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-002.jpg',
      caption: '[01:10] KO 1M, enlarged: a monthly rally breaks above a peach supply (2020 high), bases, and leaves a green 1M demand with a dotted BUY line at its proximal.',
      notes: [
        'This is the structure he wants for buying in an uptrend: break, base, demand, then buy the pullback.',
        'He admits a 1M zone is "huge" but uses it for buying.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-003.jpg',
      caption: '[01:20] KO four-pane with the 1M zoomed in: the 1M demand formed just above the old peach supply, with the BUY line at the top of the zone. The 3M BUY is at 57.08.',
      notes: ['The 1M and 3M buys line up in the same price area, the mid-50s.'],
    },
    {
      src: '/lessons/kevin/09/f-006.jpg',
      caption: '[02:05] MMM four-pane: 12M stacked demands (98.19, 67.98/61.65, 42.93, 29.25…). On the 6M, price is down to the BUY line. The 3M and 1M are in clear downtrends under trend lines.',
      notes: [
        'Price has fallen about 62% from the highs into the highest-timeframe demand.',
        'He calls it a "once in a lifetime" buying opportunity on a solid company.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-007.jpg',
      caption: '[02:13] MMM 12M, full history since the 1970s: the 2018 top, a red 12M supply, and price landing on the top 12M demand with the dotted BUY line.',
      notes: ['The 12M zone is the largest timeframe possible, so it gets the largest buy.'],
    },
    {
      src: '/lessons/kevin/09/f-008.jpg',
      caption: '[02:43] MMM 12M: he scribbles a sideways "UUU" path along the top of the 12M demand.',
      notes: [
        'If it goes sideways for years he does not mind: he keeps collecting the dividend and keeps buying while it is paid.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-010.jpg',
      caption: '[02:59] MMM four-pane: the 3M demand is 81.99–95.46 (BUY 95.46). The 1M purple zone is 89.60–94.14, and the 1M supplies are 138.22–152.30 and 170.84–186.30 under a falling trend line.',
      notes: ['The 1M, 3M and 12M buy areas stack between about 82 and 102: stacked macro demand.'],
    },
    {
      src: '/lessons/kevin/09/f-011.jpg',
      caption: '[03:37] SPX500USD 1M (OANDA): he draws price breaking up through the red monthly supply under the 2022 high, basing above it, then rallying.',
      notes: [
        'Right now, near the highs, is not a great time to buy.',
        'Wait for the break, then buy the new demand on the pullback.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-012.jpg',
      caption: '[04:58] SPX500USD macro layout: 12M BUY at about 2936 (demands 2136–2315, 1806, 1475, 1073). The 6M has a BUY line. The 3M demand is 3073.8–3588.8 with a green up-arrow. The 1M has supply just above price.',
      notes: [
        'The S&P is trending up on every macro timeframe (green arrows).',
        'The nearest buy is the 3M demand at 3073.8–3588.8, which price came back to after the -20% drop.',
      ],
    },
    {
      src: '/lessons/kevin/09/f-014.jpg',
      caption: '[05:11] SPX500USD, 1M zoomed: price is pushing into the monthly supply, with two peach zones from the 2021 rally below.',
      notes: ['Buying the dips on the way down is "not mentally easy", but you are buying after -20%, not after +20%.'],
    },
    {
      src: '/lessons/kevin/09/f-016.jpg',
      caption: '[05:23] MMM 12M, final view: price sits on the top 12M demand with the BUY line at its proximal, below the red 12M supply.',
      notes: ['He plans heavy capital while price stays in this 12M demand.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'His macro method: zones on the 1M/3M/6M/12M with a dotted BUY at each proximal and no stop. The size scales with the timeframe (his illustration: $100 / $200 / $300 / $500).' },
    { svg: fig2, caption: 'The S&P drawing at 03:37: do not buy at the highs. Wait for price to break the monthly supply and leave new demand, then buy the pullback into it.' },
    { svg: fig3, caption: 'MMM: buying 1M zones on the way down under the 3M/1M downtrend lines, then heavy buying in the 12M demand (proximal about 98; 3M/6M BUY 95.46).' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 MMM four-pane "MACRO" layout (12M, 6M, 3M, 1M), each with a dotted BUY line. The 12M demand proximal is about 98–102, the 6M/3M BUY is 95.46, and the 1M has a purple zone at 89.60–94.14. The 3M and 1M have downtrend lines and red down-arrows.',
        '00:57–01:47 KO: the 12M BUY is far below price (about 43–44), so there are no fresh 12M zones near price. The 3M BUY is 57.08 on a demand of about 52–57. The 1M demand formed after breaking a peach supply (green up-arrow), with a dotted BUY at its proximal.',
        '02:05–02:13 MMM 12M: the full chart since the 1970s. The 2018 top leaves a 12M supply at 174.94–219.75, and price drops roughly 62% into the 12M demand.',
        '02:43 He scribbles a sideways path along the 12M demand: years of chop are fine while the dividend is paid.',
        '02:59 MMM 3M demand 81.99–95.46. 1M supplies 138.22–152.30 and 170.84–186.30 under a falling trend line.',
        '03:37 SPX500USD 1M: he draws a break through the monthly supply, a base, and a rally. The new demand is the buy on the pullback.',
        '04:58–05:11 SPX macro layout: all four timeframes have green up-arrows. The 12M BUY is about 2936, the 3M demand is 3073.8–3588.8, and the 1M is pressing into supply.',
        '05:20–05:23 Back to the MMM 12M BUY line as the closing example.',
      ],
    },
  ],
  corrections: [
    'Each macro chart has its own dotted "BUY" line at the zone proximal, shown on a four-pane layout (12M, 6M, 3M, 1M) labelled "MACRO". The S&P uses OANDA SPX500USD; the stocks are NYSE.',
    'Coca-Cola: the 12M does have a demand with a BUY line, but far below price (about 43–44). "No fresh zones" means none near price. The 3M chart shows a BUY at 57.08 on a 3M demand of about 52–57, close to the 56.65 1M buy in the notes.',
    'MMM levels on screen: the 12M demand proximal is about 98 (price tag 101.81). The 6M and 3M BUY lines are at 95.46, with the 3M demand down to 81.99. The 1M zone is 89.60–94.14, shaded purple. The 12M supply is 174.94–219.75.',
    'He marks the MMM 3M and 1M with falling trend lines and red down-arrows. On the S&P, all four macro timeframes have green up-arrows.',
    'The S&P "new demand" scenario is drawn on the monthly chart: a break above the red monthly supply under the 2022 high, a base above it, then a rally.',
  ],
};
