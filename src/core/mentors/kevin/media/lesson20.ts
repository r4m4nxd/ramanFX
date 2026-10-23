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

// Figure 1: entry timeframe -> higher timeframe odds map.
const row = (y: number, entry: string, htf: string, now: string, col: string) => `
<rect x="30" y="${y}" width="110" height="44" rx="6" fill="${L}22" stroke="${L}"/><text x="85" y="${y + 27}" font-size="13" font-weight="600" text-anchor="middle" fill="${L}">${entry} entry</text>
<line x1="140" y1="${y + 22}" x2="196" y2="${y + 22}" stroke="${L}" stroke-width="1.6" marker-end="url(#km20_a1)"/>
<rect x="200" y="${y}" width="120" height="44" rx="6" fill="${T}22" stroke="${T}"/><text x="260" y="${y + 27}" font-size="13" font-weight="600" text-anchor="middle" fill="${T}">check ${htf}</text>
<text x="340" y="${y + 19}" font-size="11.5" fill="${col}">USD/JPY now: ${now}</text>`;
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km20_a1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${L}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Odds come from the timeframe above your entry</text>
${row(46, '5m', 'H1', 'sideways 147.0–148.15', A)}
${row(106, 'H1', 'Daily', 'sideways since Aug', A)}
${row(166, 'H4', 'Weekly', 'sideways since Aug 2024', A)}
<rect x="30" y="236" width="285" height="104" rx="8" fill="${R}22" stroke="${R}"/>
<text x="172" y="260" font-size="13" font-weight="700" text-anchor="middle" fill="${R}">Lower odds</text>
<text x="172" y="282" font-size="11.5" text-anchor="middle" fill="${L}">HTF going sideways</text>
<text x="172" y="300" font-size="11.5" text-anchor="middle" fill="${L}">zones inside a messy range</text>
<text x="172" y="318" font-size="11.5" text-anchor="middle" fill="${L}">(can trade, just with caution)</text>
<rect x="325" y="236" width="285" height="104" rx="8" fill="${G}22" stroke="${G}"/>
<text x="467" y="260" font-size="13" font-weight="700" text-anchor="middle" fill="${G}">Higher odds</text>
<text x="467" y="282" font-size="11.5" text-anchor="middle" fill="${L}">HTF trending (up or down, no bias)</text>
<text x="467" y="300" font-size="11.5" text-anchor="middle" fill="${L}">OR price at a HTF supply/demand</text>
<text x="467" y="318" font-size="11.5" text-anchor="middle" fill="${L}">(no trend needed at the zone)</text>
</svg>`;

// Figure 2: the H1 range and his two break scenarios (03:12).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">USD/JPY 1h: wait for a break of the range</text>
<rect x="40" y="40" width="580" height="22" fill="${R}22" stroke="${R}" stroke-width="1.3"/>
<text x="612" y="55" font-size="10.5" text-anchor="end" fill="${R}">1h supply from 148.585</text>
<line x1="150" y1="110" x2="460" y2="110" stroke="${L}" stroke-width="1.6"/>
<line x1="150" y1="250" x2="460" y2="250" stroke="${L}" stroke-width="1.6"/>
<text x="154" y="104" font-size="11" fill="${L}">range high ~148.15</text>
<text x="154" y="268" font-size="11" fill="${L}">range low ~147.0</text>
${path([[60, 200], [100, 180], [150, 110], [170, 240], [200, 250], [240, 200], [280, 140], [320, 180], [360, 170], [400, 210], [420, 205]], L, 2.2)}
${path([[420, 205], [450, 160], [470, 175], [495, 100], [515, 120], [550, 64]], G, 2.2, '6 4')}
<line x1="420" y1="205" x2="600" y2="110" stroke="${T}" stroke-width="1.8"/>
<text x="330" y="80" font-size="11" fill="${G}">break high: peak, valley,</text>
<text x="330" y="94" font-size="11" fill="${G}">higher high → longs ↗</text>
<text x="610" y="202" font-size="10.5" text-anchor="end" fill="${T}">trendline = when to stop longs</text>
${path([[420, 205], [445, 240], [462, 225], [490, 300], [505, 290], [530, 335]], R, 2.2, '6 4')}
<text x="540" y="300" font-size="11" fill="${R}">break low:</text>
<text x="540" y="314" font-size="11" fill="${R}">mirror → shorts</text>
<text x="60" y="330" font-size="11.5" fill="${A}">Inside the range: "no trading options until we break a low or a high on the 1h"</text>
</svg>`;

// Figure 3: H4 messy range, zones inside get blasted, quality zones outside; daily demand pullback.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Big messy range: skip the zones inside, wait for the edges</text>
<rect x="40" y="40" width="580" height="26" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
<text x="612" y="57" font-size="10.5" text-anchor="end" fill="${R}">H4 / daily supply 150.38–150.92 (daily from 149.48)</text>
<rect x="60" y="100" width="420" height="140" fill="none" stroke="${L}" stroke-dasharray="5 4"/>
<text x="66" y="116" font-size="11" fill="${L}">H4 range ~146.2–149.1 (Aug–Sep 2025)</text>
<rect x="250" y="128" width="70" height="16" fill="${R}22" stroke="${R}"/>
<rect x="170" y="196" width="80" height="16" fill="${G}22" stroke="${G}"/>
<rect x="340" y="186" width="70" height="16" fill="${G}22" stroke="${G}"/>
${path([[70, 220], [110, 140], [150, 230], [190, 205], [215, 150], [250, 120], [290, 150], [330, 110], [345, 230], [380, 175], [420, 140], [450, 190], [470, 170]], L, 2.2)}
<text x="270" y="258" font-size="11" text-anchor="middle" fill="${A}">zones inside get blasted through: "absolutely hate it"</text>
<rect x="40" y="272" width="580" height="30" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<text x="612" y="292" font-size="10.5" text-anchor="end" fill="${G}">daily demand 144.18–145.24</text>
${path([[470, 170], [510, 250], [530, 230], [560, 284], [600, 210]], G, 2.2, '6 4')}
<text x="625" y="330" font-size="11" text-anchor="end" fill="${L}">pullback into daily demand = long candidate,</text>
<text x="625" y="344" font-size="11" text-anchor="end" fill="${L}">even with no downtrend formed</text>
<text x="40" y="330" font-size="11" fill="${L}">next H4 demand far lower: 141.49–142.09</text>
</svg>`;

export const KM_20: KevinMedia = {
  n: 20,
  images: [
    {
      src: '/lessons/kevin/20/f-000_t00m00s.jpg',
      caption: '[00:00] USD/JPY four-pane (OANDA, 15 Sep 2025). Weekly: a purple range-floor box around 139.9–141.9 and a broken weekly uptrend line. 4h: supply 150.38–150.92 over a choppy range. Daily: supply 149.48–150.92, demand 144.18–145.24 and a broken uptrend line. 1h: two horizontal range lines (~148.15 / ~147.0) under 1h supply from 148.585.',
      notes: ['His "picture perfect" example: every timeframe is going sideways.'],
    },
    {
      src: '/lessons/kevin/20/f-003_t00m24s.jpg',
      caption: '[00:24] He circles the whole 4h pane: 4h price chopping sideways between ~146.2 and ~149.0 through Aug–Sep.',
      notes: ['4h entries need the weekly as the higher timeframe. The weekly is sideways, so all 4h zones are lower odds.'],
    },
    {
      src: '/lessons/kevin/20/f-005_t00m48s.jpg',
      caption: '[00:48] Weekly full screen. After the 2024 high (~161.9), price has ranged since Aug 2024: lows at the purple box ~139.9–141.9 (Aug/Sep 2024, Apr 2025), with weekly supplies above at ~148–151 and ~154–158.',
      notes: ['"Sideways since August 2024", over a year. A weekly trend can take about a year to form.'],
    },
    {
      src: '/lessons/kevin/20/f-009_t01m30s.jpg',
      caption: '[01:30] 1h full screen: the range high line at ~148.15 (11 Sep spike) and the range low line at ~147.0, with price at 147.36 in the middle. 1h supply starts at 148.585.',
      notes: ['5m entries are judged on this 1h. It is sideways, so wait for a break of one of the two lines.'],
    },
    {
      src: '/lessons/kevin/20/f-011_t02m00s.jpg',
      caption: '[02:00] The 1h range in context. The two lines came from his market breakdown, and before them the 9 Sep sell-off into a lower 1h demand (~146.3–146.7).',
      notes: ['The lines were marked in his daily breakdown or weekly forecast with the message: wait for a trend to form.'],
    },
    {
      src: '/lessons/kevin/20/f-015_t02m30s.jpg',
      caption: '[02:30] 4h zoom (Aug–Sep). A large demand ~146.4–147.0, a supply ~148.5–148.8, a purple-outlined box ~148.0–148.2 and smaller zones inside the range. He draws a black path showing price chopping through them.',
      notes: ['The messy range: a supply and a demand inside it both got blasted through. He does not count these as setups.'],
    },
    {
      src: '/lessons/kevin/20/f-016_t02m42s.jpg',
      caption: '[02:42] 4h scrolled out: the high-quality 4h supply 150.38–150.92 sits above the range, at the origin of the 1 Aug drop.',
      notes: ['Wait for price to leave the range into the higher-quality zones above.'],
    },
    {
      src: '/lessons/kevin/20/f-017_t02m48s.jpg',
      caption: '[02:48] 4h scrolled down to June–July: the next 4h demand below is far lower at 141.49–142.09.',
      notes: ['"Not really any below": nothing of quality near the range, so the next demand is a long way down.'],
    },
    {
      src: '/lessons/kevin/20/f-021_t03m12s.jpg',
      caption: '[03:12] On the 1h pane he draws both scenarios: a break above the range high running up to 1h supply 148.585, or a break below ~147.0 dropping lower.',
      notes: ['Break the high: peak, valley, higher high and a trendline, then day-trading longs. Break the low: the mirror, then shorts.'],
    },
    {
      src: '/lessons/kevin/20/f-022_t03m30s.jpg',
      caption: '[03:30] Daily full screen: supply 149.48–150.92, demand 144.18–145.24, a purple box ~147.6–148.4 from spring, and the July uptrend line broken in early August. Daily candles move sideways ~146.5–149.0 since.',
      notes: ['A pullback into the 144.18–145.24 daily demand would not make a downtrend (peak and valley not good enough), but it is still a long because it is at a daily zone.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'The rule as he applies it to USD/JPY: 5m→H1, H1→Daily, H4→Weekly. Every higher timeframe is sideways, so everything is lower odds until a trend forms or price reaches a HTF zone.' },
    { svg: fig2, caption: 'His 03:12 sketch on the 1h: no trades between ~147.0 and ~148.15. A break of the high (peak, valley, higher high and trendline) toward 1h supply 148.585 means longs, and a break of the low is the mirror for shorts.' },
    { svg: fig3, caption: 'The 4h messy range (~146.2–149.1): zones inside it got blasted through. The quality zones are outside it: 4h/daily supply 150.38–150.92 above, daily demand 144.18–145.24 below (a long even without a downtrend), and the next 4h demand far down at 141.49–142.09.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 USD/JPY four-pane on 15 Sep 2025, with weekly, 4h, daily and 1h all ranging. The 1h has two horizontal lines (~148.15 / ~147.0) under 1h supply from 148.585.',
        '00:24 He circles the 4h pane: chop between ~146.2 and ~149.0.',
        '00:42–00:48 Weekly: ranging since Aug 2024 above a purple floor box ~139.9–141.9, with a broken weekly uptrend line. So all 4h zones are lower odds.',
        '01:24–02:06 1h zoom: price at 147.36 in the middle of the 147.0–148.15 range. For 5m entries, wait for one line to break.',
        '02:30 4h zoom: small supply and demand zones inside the range were blasted through. He traces the chop and rejects these as setups.',
        '02:42–02:48 Quality zones outside the range: 4h supply 150.38–150.92 above. The next 4h demand is far below at 141.49–142.09.',
        '03:12 Both break scenarios drawn on the 1h: up to 1h supply 148.585, or down through ~147.0.',
        '03:30–03:36 Daily: supply 149.48–150.92, demand 144.18–145.24, July uptrend line broken. A pullback to the daily demand is a long candidate without a downtrend.',
      ],
    },
  ],
  corrections: [
    'Concrete levels from the frames (15 Sep 2025): 1h range ~147.0–148.15 with 1h supply from 148.585. Daily supply 149.48–150.92 and daily demand 144.18–145.24. 4h supply 150.38–150.92.',
    'The weekly "sideways since August 2024" is shown as a range whose floor is a purple box ~139.9–141.9 (tested Aug/Sep 2024 and Apr 2025), after a broken weekly uptrend line.',
    'The daily is not just sideways. Its July uptrend line was broken in early August, and price has been sideways since then between the daily supply and demand.',
    '"Not really any H4 zones below" is about distance: the frames show the next 4h demand far below at 141.49–142.09, so nothing of quality sits near the bottom of the range. The daily demand 144.18–145.24 is the nearer long area.',
    'The frames show only weekly/daily/4h/1h panes. The 5m entry against the 1h is described, not charted.',
  ],
};
