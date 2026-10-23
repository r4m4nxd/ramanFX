import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: the higher-high requirement (his 00:30–00:42 drawing on SPX500 1h).
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km14_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker>
<marker id="km14_arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#22c55e"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">No higher high, no trendline</text>
<line x1="320" y1="40" x2="320" y2="340" stroke="#94a3b8" stroke-opacity="0.35"/>
<text x="30" y="52" font-size="12" font-weight="700" fill="#22c55e">VALID</text>
<text x="340" y="52" font-size="12" font-weight="700" fill="#ef4444">NOT VALID</text>
<rect x="40" y="276" width="270" height="22" fill="#22c55e22" stroke="#22c55e" stroke-width="1.2"/>
<text x="200" y="314" font-size="10" fill="#22c55e">demand</text>
<line x1="140" y1="110" x2="305" y2="110" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="5 4"/>
<text x="210" y="104" font-size="10" fill="#94a3b8">previous high</text>
<polyline points="40,300 70,290 80,250 140,110 165,150 200,212 230,180 262,130 290,78" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
<line x1="40" y1="300" x2="300" y2="154" stroke="#a78bfa" stroke-width="1.8"/>
<circle cx="40" cy="300" r="4" fill="#a78bfa"/><circle cx="200" cy="210" r="4" fill="#a78bfa"/>
<text x="206" y="230" font-size="10.5" fill="#a78bfa">obvious valley</text>
<text x="96" y="104" font-size="10.5" fill="#94a3b8">obvious peak</text>
<path d="M262,98 L286,80" stroke="#22c55e" stroke-width="1.6" marker-end="url(#km14_arr2)"/>
<text x="196" y="66" font-size="10.5" fill="#22c55e">high broken → draw it</text>
<rect x="350" y="276" width="270" height="22" fill="#22c55e22" stroke="#22c55e" stroke-width="1.2"/>
<line x1="450" y1="110" x2="615" y2="110" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="5 4"/>
<polyline points="350,300 380,290 390,250 450,110 475,150 510,212 540,180 570,120" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
<path d="M570,120 L610,272" fill="none" stroke="#ef4444" stroke-width="1.8" marker-end="url(#km14_arr1)"/>
<line x1="350" y1="300" x2="610" y2="154" stroke="#a78bfa" stroke-width="1.4" stroke-dasharray="4 4" stroke-opacity="0.7"/>
<path d="M455,170 L485,200 M485,170 L455,200" stroke="#ef4444" stroke-width="2"/>
<text x="520" y="100" font-size="10.5" fill="#ef4444">just misses the high</text>
<text x="360" y="336" font-size="10.5" fill="#94a3b8">Rallies from the valley, misses the high, drops back</text>
<text x="360" y="350" font-size="10.5" fill="#94a3b8">to demand: no trendline can be drawn.</text>
</svg>`;

// Figure 2: adjusting the line after it cuts candles (SPX500USD 1h, 22–28 Aug 2025, his 01:36–03:48 walk-through).
// Price → y: y = 330 - (p - 6340) * 1.75
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km14_arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">SPX500 1h: re-anchor when the line cuts candles</text>
<rect x="110" y="227" width="510" height="27" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="470" y="245" font-size="10.5" fill="#22c55e">1h demand 6383.4–6399.2</text>
<line x1="120" y1="85" x2="440" y2="85" stroke="#94a3b8" stroke-width="1.2"/>
<text x="150" y="79" font-size="10.5" fill="#94a3b8">high ≈6480, broken 27 Aug = higher high</text>
<polyline points="30,250 55,290 80,314 100,262 112,240 118,85 150,96 180,110 210,130 240,150 270,170 300,190 330,150 360,120 390,100 420,92 440,78" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/>
<line x1="450" y1="72" x2="450" y2="134" stroke="#ef4444" stroke-width="1.6"/>
<rect x="445" y="76" width="10" height="26" fill="#ef4444"/>
<polyline points="455,104 475,112 500,92 525,70 550,66 575,74" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/>
<line x1="80" y1="314" x2="600" y2="21" stroke="#a78bfa" stroke-width="1.4" stroke-dasharray="6 4"/>
<line x1="80" y1="314" x2="610" y2="56" stroke="#a78bfa" stroke-width="2"/>
<circle cx="80" cy="314" r="4.5" fill="#a78bfa"/>
<circle cx="300" cy="190" r="4.5" fill="none" stroke="#a78bfa" stroke-width="1.6"/>
<circle cx="450" cy="134" r="4.5" fill="#a78bfa"/>
<text x="88" y="334" font-size="10.5" fill="#a78bfa">valley 22 Aug ≈6349</text>
<text x="230" y="178" font-size="10.5" fill="#a78bfa">first 2nd touch:</text>
<text x="230" y="191" font-size="10.5" fill="#a78bfa">26 Aug valley ≈6420</text>
<path d="M520,170 L462,124" stroke="#f59e0b" stroke-width="1.5" marker-end="url(#km14_arr3)"/>
<text x="470" y="186" font-size="10.5" fill="#f59e0b">27 Aug wick ≈6452</text>
<text x="470" y="199" font-size="10.5" fill="#f59e0b">cuts the first line</text>
<text x="470" y="212" font-size="10.5" fill="#f59e0b">→ re-anchor to its tip</text>
<text x="530" y="28" font-size="10" fill="#a78bfa">first line (dashed)</text>
<text x="548" y="98" font-size="10" fill="#a78bfa">adjusted line</text>
<text x="20" y="352" font-size="10.5" fill="#94a3b8">A lone wick is not a new valley: adjust the existing line, don't start a new one.</text>
</svg>`;

// Figure 3: obvious peak/valley vs a momentum line of shallow step-ups.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Trendline vs momentum line</text>
<line x1="320" y1="40" x2="320" y2="340" stroke="#94a3b8" stroke-opacity="0.35"/>
<text x="30" y="52" font-size="12" font-weight="700" fill="#22c55e">TRENDLINE</text>
<text x="340" y="52" font-size="12" font-weight="700" fill="#ef4444">MOMENTUM LINE</text>
<polyline points="40,310 110,150 150,210 185,250 230,130 260,175 280,200 305,80" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
<line x1="40" y1="310" x2="310" y2="208" stroke="#a78bfa" stroke-width="1.8"/>
<circle cx="40" cy="310" r="4" fill="#a78bfa"/><circle cx="185" cy="252" r="4" fill="#a78bfa"/>
<text x="112" y="142" font-size="10.5" fill="#94a3b8">obvious peak</text>
<text x="150" y="276" font-size="10.5" fill="#a78bfa">obvious valley</text>
<line x1="185" y1="150" x2="185" y2="250" stroke="#f59e0b" stroke-width="1" stroke-dasharray="3 3"/>
<text x="192" y="200" font-size="10" fill="#f59e0b">real depth</text>
<polyline points="350,300 380,270 390,280 420,240 430,250 460,210 470,220 500,180 510,190 540,150 550,160 580,120 610,90" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/>
<line x1="350" y1="308" x2="610" y2="140" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="5 4"/>
<text x="400" y="320" font-size="10.5" fill="#ef4444">shallow dips, no obvious valley</text>
<text x="400" y="334" font-size="10.5" fill="#ef4444">→ momentum line, not a trendline</text>
<text x="30" y="334" font-size="10.5" fill="#94a3b8">Anchor to an obvious valley; peak broken after it.</text>
</svg>`;

export const KM_14: KevinMedia = {
  n: 14,
  images: [
    {
      src: '/lessons/kevin/14/f-000_t00m00s.jpg',
      caption: '[00:00] SPX500USD 1h (OANDA, 28 Aug 2025). 1h demand 6383.4–6399.2 at the base of a vertical 22 Aug rally. Supply ≈6475–6482 at the top with a green up-arrow (removed). An old falling trendline on the left.',
      notes: ['The whole lesson is on this one S&P 500 1h chart, with an earlier stretch of the same chart.'],
    },
    {
      src: '/lessons/kevin/14/f-003_t00m30s.jpg',
      caption: '[00:30] Same chart: he draws a horizontal line at the previous high (≈6480, top of the 22–23 Aug impulse) and an arrow to where price later broke above it.',
      notes: ['First requirement: a higher high. The peak has to be broken after the valley.'],
    },
    {
      src: '/lessons/kevin/14/f-004_t00m36s.jpg',
      caption: '[00:36] A V drawn from the ≈6480 peak down to the 26 Aug valley (≈6418) and back up to the high.',
      notes: ['Obvious peak, obvious valley, clear distance between them.'],
    },
    {
      src: '/lessons/kevin/14/f-005_t00m42s.jpg',
      caption: '[00:42] He extends the V: price rallies back to just under the high and then an arrow runs straight down into the 1h demand 6383.4–6399.2.',
      notes: ['If price misses the previous high and drops, there is no higher high, so no trendline can be drawn.'],
    },
    {
      src: '/lessons/kevin/14/f-006_t00m54s.jpg',
      caption: '[00:54] Line from the 22 Aug low (≈6355) straight up to the ≈6480 peak: the impulse that created the demand.',
      notes: ['The valley at the start of the impulse is the first anchor.'],
    },
    {
      src: '/lessons/kevin/14/f-007_t01m00s.jpg',
      caption: '[01:00] Earlier on the same chart (7–20 Aug): a long rising trendline from the 7 Aug low, a falling trendline from the 15 Aug peak (≈6485), and price later breaking below the rising line.',
      notes: ['A second example of a clean uptrend line with obvious valleys.'],
    },
    {
      src: '/lessons/kevin/14/f-010_t01m18s.jpg',
      caption: '[01:18] Zoomed: a leg drawn from the 7 Aug valley (≈6315) to the 11 Aug peak (≈6410).',
      notes: ['Obvious valley → obvious peak.'],
    },
    {
      src: '/lessons/kevin/14/f-011_t01m24s.jpg',
      caption: '[01:24] Arrow up to the 12 Aug valley (≈6372) sitting on the rising trendline. The next rally takes out the ≈6410 peak.',
      notes: ['The second anchor is the next obvious valley, and it only counts once the peak is broken (higher high).'],
    },
    {
      src: '/lessons/kevin/14/f-014_t01m42s.jpg',
      caption: '[01:42] Back on 22–28 Aug: first trendline from the 22 Aug low (≈6349) through the 26 Aug valley (≈6420), extended up to 27 Aug.',
      notes: ['First line: valley-to-valley once the ≈6480 high broke.'],
    },
    {
      src: '/lessons/kevin/14/f-017_t02m12s.jpg',
      caption: '[02:12] Arrows: one points to where the 27 Aug candles cut through the first line, one back to the 26 Aug valley touch.',
      notes: ['After a new high, a line that cuts through candles is no longer valid as drawn.'],
    },
    {
      src: '/lessons/kevin/14/f-020_t02m30s.jpg',
      caption: '[02:30] A second line projected from below to the 27 Aug dip (≈6455) shows where the drop pierced the first trendline.',
      notes: ['The 27 Aug sell-off goes through the line, so the line has to change.'],
    },
    {
      src: '/lessons/kevin/14/f-022_t03m12s.jpg',
      caption: '[03:12] He highlights the long lower wick on 27 Aug (to ≈6452). It is a single wick, with no cluster of candles forming a new valley.',
      notes: ['A "weird wick" like this is not a new valley.'],
    },
    {
      src: '/lessons/kevin/14/f-023_t03m30s.jpg',
      caption: '[03:30] Adjusted trendline: still anchored at the 22 Aug low (≈6349), now re-anchored to the tip of the 27 Aug wick and extended into September.',
      notes: [
        'He adjusts the existing line to the wick rather than starting a new trendline from it.',
        'The 26 Aug valley no longer touches the line, which is why his lines can look "wrong" to members.',
      ],
    },
    {
      src: '/lessons/kevin/14/f-026_t03m48s.jpg',
      caption: '[03:48] Final view: the adjusted line runs under every candle from 22 Aug to now (≈6487), clear of the 26 Aug valley and touching only the 27 Aug wick.',
      notes: ['If price cuts through this line again, the trendline is removed and has to be redrawn.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'Higher-high requirement (00:30–00:42). The line from the valley is valid only once price breaks the previous high. A rally that just misses it and drops to demand gives no trendline.' },
    { svg: fig2, caption: 'SPX500USD 1h, 22–28 Aug 2025. First line: 22 Aug low → 26 Aug valley. The 27 Aug wick cuts through it after the new high, so he re-anchors to the wick tip. The 26 Aug valley is now off the line.' },
    { svg: fig3, caption: 'A trendline needs an obvious peak and an obvious valley with real depth. Shallow step-ups make a momentum line, not a trendline.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 SPX500USD 1h (OANDA, 28 Aug 2025): 1h demand 6383.4–6399.2 under a vertical 22 Aug rally; the supply at ≈6475–6482 is marked removed (green up-arrow).',
        '00:30 Horizontal line at the previous high (≈6480) to show the higher-high requirement.',
        '00:36–00:42 He draws a V from the peak to the 26 Aug valley and back, then the case where price misses the high and drops straight into the 1h demand: no trendline.',
        '00:54 The 22 Aug valley (≈6349–6355) to ≈6480 impulse: the first anchor is the valley that started the move.',
        '01:00–01:30 He scrolls back to 7–20 Aug: rising trendline from the 7 Aug valley through the 12 Aug valley after the ≈6410 peak broke, later broken to the downside; a falling trendline from the 15 Aug peak.',
        '01:42 First 22–28 Aug trendline: 22 Aug low → 26 Aug valley.',
        '02:06–02:30 Arrows show the 27 Aug candles cutting through that line after the new high.',
        '03:12 He highlights the 27 Aug lower wick (≈6452): a lone wick, not a new valley.',
        '03:30–03:48 He re-anchors the line from the 22 Aug low to the tip of that wick and extends it. The 26 Aug valley is no longer a touch point.',
      ],
    },
  ],
  corrections: [
    'The chart is SPX500USD (S&P 500 CFD) 1h on OANDA, 28 Aug 2025, built around a 1h demand 6383.4–6399.2. The notes give no instrument or levels.',
    'The adjusted trendline is anchored at the 22 Aug valley (≈6349) and the tip of the 27 Aug wick (≈6452). The original second touch, the 26 Aug valley (≈6420), is no longer on the line. This is the concrete case behind "the two touch points are the adjusted ones".',
    'In this case, "adjust instead of drawing a new line from the wick" means pivoting the existing line down to the wick tip from the same first valley. The first anchor does not change.',
    'The "missed the high" example is drawn as price rallying back from the 26 Aug valley to just below the ≈6480 high, then dropping straight into the 1h demand. A horizontal line at the previous high is his reference for the higher-high test.',
  ],
};
