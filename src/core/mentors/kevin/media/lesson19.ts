import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';
const G = '#22c55e';
const R = '#ef4444';
const L = '#94a3b8';
const A = '#f59e0b';
const T = '#a78bfa';

const pts = (p: number[][]) => p.map(([x, y]) => `${x},${y}`).join(' ');
const path = (p: number[][], col = L, w = 2, dash = '') =>
  `<polyline points="${pts(p)}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const dot = (x: number, y: number, col = A) => `<circle cx="${x}" cy="${y}" r="4.5" fill="${col}"/>`;

// Figure 1: the EUR/JPY 1h uptrend line he deleted (time + distance away), plus the price action he would have needed.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km19_a1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${A}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">EUR/JPY 1h: an uptrend line price left far behind for too long</text>
<rect x="40" y="290" width="580" height="30" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<text x="612" y="309" font-size="11" text-anchor="end" fill="${G}">1h demand 155.51–156.10</text>
<rect x="300" y="52" width="200" height="22" fill="${R}22" stroke="${R}" stroke-width="1.2"/>
<text x="400" y="67" font-size="10.5" text-anchor="middle" fill="${R}">4h/1h supply ~160.6–161.5</text>
<line x1="70" y1="302" x2="600" y2="132" stroke="${T}" stroke-width="2" stroke-dasharray="7 5"/>
<text x="560" y="128" font-size="11" text-anchor="end" fill="${T}">trendline (deleted at 01:54)</text>
${path([[70, 302], [100, 240], [130, 262], [150, 254], [190, 160], [230, 100], [270, 70], [300, 58], [330, 80], [360, 110], [400, 96], [440, 104], [480, 150], [520, 178], [545, 176]], L, 2.4)}
${dot(70, 302, G)}${dot(130, 262)}
<text x="138" y="282" font-size="11" fill="${A}">valley on line</text>
<text x="40" y="150" font-size="11" fill="${L}">steady run-up</text>
<text x="40" y="164" font-size="11" fill="${L}">(no test of the line)</text>
<line x1="300" y1="70" x2="300" y2="216" stroke="${A}" stroke-width="1.6" marker-start="url(#km19_a1)" marker-end="url(#km19_a1)"/>
<text x="308" y="150" font-size="11" fill="${A}">far away</text>
<line x1="230" y1="335" x2="545" y2="335" stroke="${A}" stroke-width="1.6" marker-start="url(#km19_a1)" marker-end="url(#km19_a1)"/>
<text x="388" y="352" font-size="11" text-anchor="middle" fill="${A}">Feb 12 → Feb 17: too long away from the line</text>
<text x="628" y="204" font-size="11" text-anchor="end" fill="${L}">back near the line,</text>
<text x="628" y="218" font-size="11" text-anchor="end" fill="${L}">but no price action</text>
<text x="628" y="232" font-size="11" text-anchor="end" fill="${L}">around it → remove</text>
</svg>`;

// Figure 2: the zigzag he sketched (00:30–00:36) of what would have kept the line valid.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">What he wanted to see: price action around the line</text>
<line x1="50" y1="320" x2="610" y2="140" stroke="${T}" stroke-width="2.2"/>
<text x="70" y="342" font-size="11" fill="${T}">trendline (stays valid while tested)</text>
${path([[50, 320], [110, 230], [150, 288], [230, 150], [290, 242], [340, 140], [380, 170], [420, 120], [460, 160], [520, 206], [570, 80]], L, 2.4)}
${dot(150, 288)}${dot(290, 242)}${dot(520, 206)}
<text x="150" y="312" font-size="11" text-anchor="middle" fill="${A}">test 1</text>
<text x="300" y="268" font-size="11" text-anchor="middle" fill="${A}">test 2 (hoped for)</text>
<text x="530" y="232" font-size="11" text-anchor="middle" fill="${A}">test 3 (hoped for)</text>
<text x="40" y="60" font-size="12" fill="${L}">Peak → valley on the line → higher high → back to the line → higher high…</text>
<text x="40" y="78" font-size="12" fill="${L}">Repeated, nearby tests keep a trendline relevant.</text>
<text x="40" y="96" font-size="12" fill="${L}">It stays valid until a candle actually breaks it.</text>
</svg>`;

// Figure 3: the valid downtrend line example (01:24–01:48) and the hypothetical drop away.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Valid downtrend line vs one he "would maybe" delete</text>
<rect x="40" y="226" width="580" height="22" fill="${G}22" stroke="${G}" stroke-width="1.3"/>
<text x="612" y="241" font-size="10.5" text-anchor="end" fill="${G}">1h demand 155.51–156.10</text>
<rect x="40" y="306" width="580" height="22" fill="${G}22" stroke="${G}" stroke-width="1.3"/>
<text x="612" y="321" font-size="10.5" text-anchor="end" fill="${G}">lower 1h demand 152.80–153.23</text>
<line x1="60" y1="60" x2="420" y2="210" stroke="${T}" stroke-width="2.2"/>
${path([[60, 60], [150, 150], [190, 118], [250, 226], [300, 170], [350, 190], [380, 192], [400, 196], [430, 140], [480, 70]], L, 2.4)}
${dot(150, 150)}${dot(190, 118)}${dot(250, 226)}${dot(380, 192)}
<text x="150" y="172" font-size="11" text-anchor="middle" fill="${A}">valley</text>
<text x="190" y="108" font-size="11" text-anchor="middle" fill="${A}">peak</text>
<text x="224" y="218" font-size="11" text-anchor="end" fill="${A}">lower low</text>
<text x="380" y="214" font-size="11" text-anchor="middle" fill="${A}">retests</text>
<text x="490" y="64" font-size="11" fill="${G}">broken → removed</text>
${path([[250, 226], [272, 318]], R, 2, '6 4')}
<text x="280" y="280" font-size="11" fill="${R}">hypothetical: drops away to lower demand,</text>
<text x="280" y="295" font-size="11" fill="${R}">no 2nd test for a long time → "would maybe" delete</text>
</svg>`;

// Figure 4: momentum line vs trendline (01:00–01:06).
const fig4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Momentum line vs trendline</text>
<line x1="320" y1="50" x2="320" y2="340" stroke="${L}" stroke-opacity="0.4"/>
<text x="160" y="56" font-size="12" font-weight="600" text-anchor="middle" fill="${L}">Steady leg: momentum line</text>
${path([[50, 320], [80, 290], [100, 296], [130, 250], [150, 256], [180, 200], [200, 206], [230, 150], [260, 110], [290, 90]], L, 2.4)}
<line x1="50" y1="322" x2="290" y2="92" stroke="${A}" stroke-width="2" stroke-dasharray="6 4"/>
<text x="170" y="340" font-size="11" text-anchor="middle" fill="${A}">no clear peak + valley = not a trendline</text>
<text x="480" y="56" font-size="12" font-weight="600" text-anchor="middle" fill="${L}">High, obvious valley, higher high</text>
${path([[350, 320], [420, 180], [460, 250], [530, 110], [560, 150], [610, 80]], L, 2.4)}
<line x1="350" y1="320" x2="620" y2="200" stroke="${T}" stroke-width="2.2"/>
${dot(420, 180)}${dot(460, 250)}${dot(530, 110)}
<text x="420" y="170" font-size="11" text-anchor="middle" fill="${A}">high</text>
<text x="470" y="272" font-size="11" text-anchor="middle" fill="${A}">valley</text>
<text x="530" y="100" font-size="11" text-anchor="middle" fill="${A}">higher high</text>
<text x="600" y="224" font-size="11" text-anchor="end" fill="${T}">trendline</text>
</svg>`;

export const KM_19: KevinMedia = {
  n: 19,
  images: [
    {
      src: '/lessons/kevin/19/f-000_t00m00s.jpg',
      caption: '[00:00] EUR/JPY four-pane (OANDA, 17 Feb 2025). Weekly supply 170.82–175.43. 4h supply 160.57–161.50. Daily supply from 165.17 with a daily downtrend line and a red down arrow. 1h: a rising trendline from the 1h demand 155.51–156.10, with price at 158.66.',
      notes: ['The setting: the 1h uptrend line he is about to judge, with HTF supply overhead on the 4h and daily.'],
    },
    {
      src: '/lessons/kevin/19/f-002_t00m18s.jpg',
      caption: '[00:18] EUR/JPY 1h full screen. The uptrend line starts at the 10 Feb low inside 1h demand (155.512 / 155.678 / 155.846 / 156.095). Two older downtrend lines run from the early-February high, and 1h supplies sit near 159.3–159.6 and 160.6–161.0.',
      notes: ['The line has one clean touch, the 11 Feb valley right after the downtrend line broke.'],
    },
    {
      src: '/lessons/kevin/19/f-004_t00m30s.jpg',
      caption: '[00:30] He sketches price going from the demand low to a peak, back to a valley on the line, up to a higher high, and then back to the line for another test (up arrow).',
      notes: ['This second test is what he would have needed. In reality price never came back after the first valley.'],
    },
    {
      src: '/lessons/kevin/19/f-005_t00m36s.jpg',
      caption: '[00:36] The sketch extended as a full zigzag of higher highs and valleys that keep returning to the rising line, ending with a bounce off the line near 158.4.',
      notes: ['"Price action around the trendline": repeated nearby tests are what keep a line relevant.'],
    },
    {
      src: '/lessons/kevin/19/f-006_t00m42s.jpg',
      caption: '[00:42] He traces the short downtrend line of 10–11 Feb that price broke just before the rally. The rising line is anchored at the demand low and that breakout valley.',
      notes: ['Shows where the uptrend line came from: a downtrend-line break out of 1h demand.'],
    },
    {
      src: '/lessons/kevin/19/f-008_t01m00s.jpg',
      caption: '[01:00] A steep line drawn from the 11 Feb valley up the rally to the 13 Feb high (~161.0), with a small hypothetical peak (~159.4) and valley (~158.6) sketched on it.',
      notes: ['Momentum line vs trendline: the real rally was one steady leg with no clear peak and valley, so a line along it would only be a momentum line.'],
    },
    {
      src: '/lessons/kevin/19/f-010_t01m18s.jpg',
      caption: '[01:18] Rising line selected. Its right end is at ~159.1, and he points to where it meets price on 17 Feb (~158.4) while price sits at 158.66.',
      notes: ['Price is only now drifting back to the line, four days after leaving it and about 2.5 yen above it at the top. That is too long to treat the line as relevant.'],
    },
    {
      src: '/lessons/kevin/19/f-011_t01m24s.jpg',
      caption: '[01:24] Scrolled back to the valid example: the downtrend line from the 4 Feb high (~160.2) down into the 1h demand. A thick traced line marks the first sell-off leg.',
      notes: ['Counter-example: a line with real structure under it.'],
    },
    {
      src: '/lessons/kevin/19/f-012_t01m36s.jpg',
      caption: '[01:36] Zigzag on the downtrend: high → valley ~156.9 (6 Feb) → peak ~157.9 (7 Feb) → lower low into demand. A hypothetical leg is drawn plunging toward ~153.5.',
      notes: ['Obvious valley, obvious peak, lower low = trendline. The hypothetical drop shows price leaving the line without a second test.'],
    },
    {
      src: '/lessons/kevin/19/f-013_t01m42s.jpg',
      caption: '[01:42] The hypothetical drop lands in a lower 1h demand 152.80–153.23 (another sits at 151.61–151.77).',
      notes: ['If price had gone there and only come back much later, he "would maybe" delete the downtrend line too.'],
    },
    {
      src: '/lessons/kevin/19/f-014_t01m48s.jpg',
      caption: '[01:48] Clean view: price did come back. Several candles retest the downtrend line on 10–11 Feb before breaking it upward.',
      notes: ['Valid because there is price action around it. It stays until it is actually broken.'],
    },
    {
      src: '/lessons/kevin/19/f-015_t01m54s.jpg',
      caption: '[01:54] The same 1h chart after the deletion: the rising trendline is gone. Price is at 158.66 under the 1h supplies, and the 155.51–156.10 demand is still drawn.',
      notes: ['The result: an unbroken line deleted because time and distance made it irrelevant.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'EUR/JPY 1h, Feb 2025: the uptrend line from the 155.51–156.10 demand had one valley test, then a steady run to ~161 and four days away. He deleted it even though price was drifting back toward it.' },
    { svg: fig2, caption: 'His 00:30–00:36 sketch: what would have kept the line valid, with price repeatedly returning to the line between higher highs.' },
    { svg: fig3, caption: 'The valid downtrend line (valley, peak, lower low, then retests before it broke) and his hypothetical drop to the 152.80–153.23 demand with no retest, which is when he "would maybe" delete it.' },
    { svg: fig4, caption: 'Momentum line vs trendline: a steady leg gives only a momentum line. A trendline needs a high, an obvious valley and then a higher high.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 EUR/JPY four-pane on 17 Feb 2025. Weekly supply 170.82–175.43, daily supply from 165.17 with a daily downtrend line, 4h supply 160.57–161.50. On the 1h, a rising trendline from the 155.51–156.10 demand.',
        '00:18–00:36 On the 1h he shows the line has only one test, the 11 Feb valley after a downtrend-line break. He sketches the zigzag of repeated tests he would have needed to keep it.',
        '00:42–01:06 The rally from 156.5 to ~161.0 was one steady leg. A line along it is a momentum line, and a real trendline would need a clear peak and valley.',
        '01:18 Price is only now returning to the line (~158.4 vs price 158.66), four days after the 13 Feb high. Too long and too far away, so it is irrelevant.',
        '01:24–01:48 Valid example on the same chart: a downtrend line from the 4 Feb high with valley, peak and lower low into demand, retested on 10–11 Feb and then broken. He also sketches a drop to the 152.80–153.23 demand with no retest; in that case he "would maybe" delete it.',
        '01:54–02:00 The rising trendline is deleted, and the four-pane is shown again without it.',
      ],
    },
  ],
  corrections: [
    'The removed line is the EUR/JPY 1h uptrend line anchored at the 10 Feb low in the 155.51–156.10 demand. Its only test was the 11 Feb valley right after a downtrend-line break.',
    'When he deleted it, price was not still far away. It was drifting back toward the line (~158.66 vs line ~158.4). He removed an unbroken line because price spent ~4 days and up to ~2.5 yen away from it, so "came back" does not revive a stale line.',
    'The "valid example" downtrend line is on the same 1h chart (from the 4 Feb high ~160.2). It was retested several times on 10–11 Feb and broken upward, and that break started the rally.',
    'His hypothetical "price drops away" case is drawn concretely: a plunge from ~155.6 into the lower 1h demand 152.80–153.23.',
    'The momentum-line reminder is shown on this rally. The steady 156.5→161 leg would only give a momentum line, and he sketches the peak/valley it lacked.',
  ],
};
