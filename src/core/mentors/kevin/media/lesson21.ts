import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';
const G = '#22c55e';
const R = '#ef4444';
const L = '#94a3b8';
const A = '#f59e0b';

/** One candle in SVG coordinates (y grows downward): open y, close y, high y, low y. */
function c(x: number, o: number, cl: number, h: number, l: number, w = 12): string {
  const col = cl < o ? G : R;
  const top = Math.min(o, cl);
  const hgt = Math.max(2, Math.abs(o - cl));
  return `<line x1="${x}" y1="${h}" x2="${x}" y2="${l}" stroke="${col}" stroke-width="1.6"/><rect x="${x - w / 2}" y="${top}" width="${w}" height="${hgt}" fill="${col}"/>`;
}
const cs = (k: number[][], w = 12) => k.map(([x, o, cl, h, l]) => c(x, o, cl, h, l, w)).join('');

// Figure 1: his whiteboard at 02:12 - one zone, "removed" (tick) on the left, "not removed" (X) on the right.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">His board: the same zone, removed vs not removed</text>
<rect x="30" y="150" width="580" height="44" fill="#22c55e22" stroke="${G}" stroke-width="1.5"/>
<text x="226" y="146" font-size="10" fill="${G}">zone</text>
<line x1="320" y1="44" x2="320" y2="330" stroke="${L}" stroke-opacity="0.5"/>
<text x="40" y="56" font-size="13" font-weight="700" fill="${R}">✓ REMOVED</text>
<text x="335" y="56" font-size="13" font-weight="700" fill="${G}">✗ NOT REMOVED</text>
${cs([[70, 176, 160, 156, 186], [110, 158, 222, 154, 228], [160, 186, 140, 134, 200], [215, 150, 76, 70, 250]])}
<line x1="30" y1="194" x2="320" y2="194" stroke="${R}" stroke-width="1.2" stroke-dasharray="4 3"/>
<circle cx="110" cy="214" r="17" fill="none" stroke="${A}" stroke-width="1.6"/>
<text x="40" y="276" font-size="11" fill="${A}">a BODY closes beyond the</text>
<text x="40" y="290" font-size="11" fill="${A}">zone's distal line = removed</text>
${cs([[360, 186, 166, 162, 318], [395, 194, 176, 172, 322], [430, 130, 106, 102, 232], [465, 190, 152, 148, 290], [520, 140, 118, 114, 300]])}
${c(570, 158, 40, 36, 300, 14)}
<text x="335" y="338" font-size="11" fill="${L}">long wicks only - bodies stay in or above the zone</text>
<text x="520" y="104" font-size="10" text-anchor="middle" fill="${L}">small body</text>
<text x="600" y="72" font-size="10" text-anchor="start" fill="${L}" transform="rotate(90 600 72)">big body</text>
</svg>`;

// Figure 2: the last two candles he drew - same emotional wick, very different body.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">"It's all about the size of the wick" - compare it with the body</text>
<rect x="30" y="170" width="580" height="40" fill="#22c55e22" stroke="${G}" stroke-width="1.5"/>
<text x="36" y="164" font-size="10" fill="${G}">proximal</text>
<text x="36" y="224" font-size="10" fill="${G}">distal</text>
${c(150, 150, 120, 116, 300, 18)}
${c(330, 176, 56, 52, 300, 18)}
${c(510, 182, 250, 176, 262, 18)}
<g font-size="11">
<line x1="178" y1="150" x2="178" y2="300" stroke="${A}" stroke-width="1.2"/>
<text x="184" y="240" fill="${A}">wick >> body</text>
<text x="150" y="326" text-anchor="middle" fill="${G}" font-weight="700">not removed</text>
<text x="150" y="342" text-anchor="middle" fill="${L}">emotional wick, small body</text>
<line x1="356" y1="56" x2="356" y2="176" stroke="${A}" stroke-width="1.2"/>
<line x1="364" y1="176" x2="364" y2="300" stroke="${L}" stroke-width="1.2"/>
<text x="370" y="110" fill="${A}">body is bigger</text>
<text x="370" y="250" fill="${L}">wick not big vs body</text>
<text x="330" y="326" text-anchor="middle" fill="${G}" font-weight="700">not removed</text>
<text x="330" y="342" text-anchor="middle" fill="${L}">he draws it on the ✗ side too</text>
<text x="510" y="326" text-anchor="middle" fill="${R}" font-weight="700">removed</text>
<text x="510" y="342" text-anchor="middle" fill="${L}">body closes below distal</text>
</g>
</svg>`;

// Figure 3: the note pinned on his whiteboard chart.
const mini = (x: number, title: string, body: string) =>
  `<rect x="${x}" y="70" width="190" height="240" rx="10" fill="none" stroke="${L}" stroke-opacity="0.5"/><text x="${x + 95}" y="94" font-size="12" font-weight="700" text-anchor="middle" fill="${A}">${title}</text>${body}`;
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="28" font-size="14" font-weight="700" fill="${L}">Note on his chart: "What qualifies as a zone?"</text>
<text x="20" y="50" font-size="11" fill="${L}">The move out of the basing has to do one of these three things</text>
${mini(20, '1. Removes opposing zone', `<rect x="40" y="130" width="150" height="26" fill="#ef444422" stroke="${R}"/><text x="46" y="124" font-size="10" fill="${R}">supply</text><rect x="40" y="250" width="70" height="24" fill="#22c55e22" stroke="${G}"/><text x="46" y="290" font-size="10" fill="${G}">new demand</text><polyline points="60,262 90,262 120,200 150,110 170,100" fill="none" stroke="${G}" stroke-width="2"/><text x="120" y="190" font-size="10" fill="${L}">closes above</text>`)}
${mini(225, '2. Removes a trendline', `<line x1="240" y1="120" x2="400" y2="250" stroke="#a78bfa" stroke-width="1.8"/><rect x="300" y="236" width="70" height="24" fill="#22c55e22" stroke="${G}"/><polyline points="320,248 350,248 370,190 395,140" fill="none" stroke="${G}" stroke-width="2"/><text x="250" y="290" font-size="10" fill="#a78bfa">downtrend line broken</text>`)}
${mini(430, '3. Makes all-time high/low', `<line x1="445" y1="140" x2="605" y2="140" stroke="${L}" stroke-dasharray="4 3"/><text x="450" y="132" font-size="10" fill="${L}">previous all-time high</text><rect x="460" y="240" width="70" height="24" fill="#22c55e22" stroke="${G}"/><polyline points="480,252 510,252 540,190 580,110" fill="none" stroke="${G}" stroke-width="2"/><text x="450" y="290" font-size="10" fill="${G}">demand that made the new ATH</text>`)}
</svg>`;

export const KM_21: KevinMedia = {
  n: 21,
  images: [
    {
      src: '/lessons/kevin/21/f-000_t00m00s.jpg',
      caption: '[00:00] EURUSD 4-pane layout from the live session (1W, 4h, 1D, 1h, OANDA). Weekly: demand 1.07783–1.09645 below price and supply near 1.2123. Daily: demand 1.16698–1.17062 sitting on a rising trendline. 4h: demand 1.15782–1.15973 at the swing low with an uptrend line. 1h: demand 1.16622–1.16762 with an uptrend line. Green arrows mark the long bias on each pane.',
      notes: [
        'This is the chart that was open when the member asked about wicks. The clip is from a session that had already been running.',
        'Every pane has the zone plus a trendline, and the zones are at the start of the trend on each timeframe.',
      ],
    },
    {
      src: '/lessons/kevin/21/f-001_t00m06s.jpg',
      caption: '[00:06] Same EURUSD layout. On the 1h pane the cursor is on the pullback to the uptrend line, above the 1.16622–1.16762 demand.',
      notes: ['He moves off this chart to a blank GBPUSD daily to draw the answer instead of looking for a live example.'],
    },
    {
      src: '/lessons/kevin/21/f-002_t00m12s.jpg',
      caption: '[00:12] A blank GBPUSD 1D (FXCM) chart used as a whiteboard. Top right is a pinned note: "What qualifies as a Zone? 1. Removes oposing zone 2. Removes a trendline 3. Makes all time high/low". A supply band sits at 1.52000 at the top.',
      notes: [
        'His three conditions for a zone are pinned on the chart. Removal is the reason a zone exists, so knowing when a zone is removed matters.',
      ],
    },
    {
      src: '/lessons/kevin/21/f-003_t00m30s.jpg',
      caption: '[00:30] He draws one zone (a rectangle), splits the board with a vertical line, and puts a tick (✓) above the left half and an X (✗) above the right half.',
      notes: ['Left (✓) = removed. Right (✗) = not removed. The same zone is used for both so only the candles differ.'],
    },
    {
      src: '/lessons/kevin/21/f-004_t01m24s.jpg',
      caption: '[01:24] Removed side: four candles in the zone. One BODY extends below the bottom (distal) line of the zone. Not-removed side: two candles with small bodies inside the zone and very long lower wicks reaching far below it.',
      notes: [
        'He draws a demand zone that price comes down into. Removal is a body closing beyond the distal (bottom) line.',
        'On the not-removed side the wicks are much longer than on the removed side. Wick length alone never removes the zone.',
      ],
    },
    {
      src: '/lessons/kevin/21/f-005_t02m12s.jpg',
      caption: '[02:12] The finished board. The ✗ side now holds six candles: bodies inside or above the zone with long lower wicks, then the final pair. One has a small body above the zone and an emotional wick. The other has a huge body running from the zone up into the 1.52 supply band, with the same wick below.',
      notes: [
        'The final pair is the "two pretty emotional wicks" comparison. BOTH are drawn on the not-removed side.',
        'The big-body candle\'s wick is small compared with its body, so "we\'re not gonna call that removed".',
        'Not one candle on the ✗ side has a body that closes below the distal line.',
      ],
    },
  ],
  figures: [
    { svg: fig1, caption: 'His board redrawn: the ✓ (removed) side has a candle body closing through the distal line. The ✗ (not removed) side has long wicks only, with every body inside or above the zone.' },
    { svg: fig2, caption: 'The final comparison: an emotional wick on a small body and the same wick on a huge body are both "not removed". A body closing through the distal is what removes the zone.' },
    { svg: fig3, caption: 'The note pinned on his whiteboard chart: a zone qualifies if its move removes an opposing zone, removes a trendline, or makes an all-time high/low.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00–00:06 EURUSD 1W/4h/1D/1h layout from the live session: each pane has a demand zone plus an uptrend line and a long bias.',
        '00:12 He switches to a blank GBPUSD daily as a whiteboard. Pinned note: what qualifies as a zone = removes an opposing zone, removes a trendline, or makes an all-time high/low.',
        '00:30 He draws one zone, splits the board, and marks ✓ (removed) on the left and ✗ (not removed) on the right.',
        '01:24 Removed side: a candle body closes below the zone\'s distal line. Not-removed side: small bodies in the zone with very long lower wicks.',
        '02:12 He adds more wick examples on the ✗ side, ending with two candles that share the same emotional wick: one with a small body, one with a huge body. Both stay on the not-removed side.',
      ],
    },
  ],
  corrections: [
    'The drawing settles the ambiguous comparison in the notes. Both "emotional wick" candles (small body and huge body) are drawn on the ✗ "not removed" side. The big-body one is not a removal because its wick is small compared with its body.',
    'Sharper rule from the board: a zone is removed when a candle BODY closes beyond its distal line. A body sitting inside the zone, or a wick of any length through it, does not remove it. The notes only say "a body closing through the zone".',
    'The board example is a demand zone with price coming down into it: the wicks pierce downward and the removal is a body below the bottom line. Mirror it for supply.',
    'The clip opens on a pinned note the notes do not mention: "What qualifies as a Zone? 1. Removes opposing zone 2. Removes a trendline 3. Makes all time high/low".',
  ],
};
