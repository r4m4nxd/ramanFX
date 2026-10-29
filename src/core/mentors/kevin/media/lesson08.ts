import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: GBPJPY H1 stack of demand zones, the nearest zone, and which deeper zone is still valid (inside the H4 zone).
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km8_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">GBPJPY H1 — buy the NEAREST zone until it is removed</text>
<rect x="300" y="200" width="320" height="96" fill="#f59e0b14" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="6 4"/>
<text x="612" y="290" font-size="10" text-anchor="end" fill="#f59e0b">H4 demand 178.13–179.40 (ITF)</text>
<rect x="250" y="78" width="370" height="26" fill="#22c55e33" stroke="#22c55e" stroke-width="1.8"/>
<text x="612" y="95" font-size="10" text-anchor="end" fill="#22c55e">nearest H1 demand 180.89–181.30</text>
<rect x="215" y="128" width="405" height="24" fill="#22c55e1a" stroke="#22c55e" stroke-width="1.2"/>
<text x="612" y="144" font-size="10" text-anchor="end" fill="#94a3b8">180.10–180.48 — NOT inside H4 zone</text>
<rect x="180" y="180" width="440" height="32" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="200" font-size="10" text-anchor="end" fill="#22c55e">179.20–179.72 — overlaps H4 zone</text>
<rect x="130" y="250" width="490" height="30" fill="#22c55e1a" stroke="#22c55e" stroke-width="1.2"/>
<text x="612" y="270" font-size="10" text-anchor="end" fill="#94a3b8">177.97–178.47</text>
<line x1="60" y1="340" x2="620" y2="232" stroke="#a78bfa" stroke-width="1.6"/>
<text x="470" y="330" font-size="10" fill="#a78bfa">H1 trend line</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.6" points="40,330 80,300 110,270 130,280 150,236 170,220 180,212 195,165 210,175 220,150 240,110 250,104 262,60 280,66 300,74 320,62 345,78 370,70"/>
<path d="M380,74 L420,140 L450,128 L480,186" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#km8_arr1)"/>
<text x="430" y="70" font-size="11" fill="#ef4444">if 181.30 zone breaks:</text>
<text x="150" y="50" font-size="11" fill="#94a3b8">skip 180.10 (no ITF zone), wait for the zone in the H4 demand</text>
</svg>`;

// Figure 2: the three-CP overextension rule.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Continuation patterns in a row: risk by count</text>
<line x1="40" y1="330" x2="600" y2="70" stroke="#a78bfa" stroke-width="1.6"/>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="40,320 90,260 110,276 130,282 170,212 190,228 210,232 250,160 270,176 290,180 330,112 350,128 370,132 410,66 430,80 450,84 500,30"/>
<rect x="100" y="270" width="170" height="16" fill="#22c55e33" stroke="#22c55e"/><text x="110" y="304" font-size="11" fill="#22c55e">CP1 — 1%</text>
<rect x="180" y="222" width="170" height="14" fill="#22c55e33" stroke="#22c55e"/><text x="190" y="254" font-size="11" fill="#22c55e">CP2 — 1%, aim 5:1</text>
<rect x="260" y="170" width="170" height="14" fill="#f59e0b33" stroke="#f59e0b"/><text x="270" y="204" font-size="11" fill="#f59e0b">CP3 — half risk, BE at 1:1</text>
<rect x="340" y="122" width="170" height="14" fill="#ef444422" stroke="#ef4444"/><text x="350" y="156" font-size="11" fill="#ef4444">CP4+ — overextended, skip</text>
<text x="420" y="60" font-size="11" fill="#94a3b8">do not chase</text>
<text x="20" y="350" font-size="11" fill="#94a3b8">Not exact: one run went to CP5 and still worked, but after 3 CPs you wait for a pullback.</text>
</svg>`;

// Figure 3: the four-pane top-down layout he uses (W, H4, D, H1) and the trend check.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="22" font-size="14" font-weight="700" fill="#94a3b8">His 4-pane layout: every timeframe trending up</text>
<g fill="none" stroke="#94a3b8" stroke-width="1"><rect x="20" y="34" width="296" height="150"/><rect x="324" y="34" width="296" height="150"/><rect x="20" y="194" width="296" height="150"/><rect x="324" y="194" width="296" height="150"/></g>
<g font-size="11" font-weight="700" fill="#94a3b8"><text x="28" y="50">1W — HTF trend</text><text x="332" y="50">4h — ITF</text><text x="28" y="210">1D</text><text x="332" y="210">1h — entry TF</text></g>
<rect x="20" y="40" width="296" height="10" fill="#ef444422" stroke="#ef4444"/>
<rect x="150" y="130" width="166" height="16" fill="#22c55e33" stroke="#22c55e"/><text x="160" y="160" font-size="10" fill="#22c55e">162.78–164.91</text>
<line x1="40" y1="176" x2="300" y2="122" stroke="#a78bfa" stroke-width="1.4"/>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.4" points="40,170 80,150 110,160 150,128 180,140 210,120 240,100 260,90 280,60"/>
<path d="M90,100 l8,-14 l8,14 z" fill="#22c55e"/>
<rect x="430" y="110" width="190" height="14" fill="#22c55e33" stroke="#22c55e"/><rect x="430" y="124" width="190" height="14" fill="#22c55e33" stroke="#22c55e"/>
<text x="436" y="152" font-size="10" fill="#22c55e">178.13–179.40</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.4" points="340,176 380,170 410,150 430,128 450,90 470,70 490,76 510,72"/>
<path d="M394,100 l8,-14 l8,14 z" fill="#22c55e"/>
<rect x="160" y="250" width="156" height="14" fill="#22c55e33" stroke="#22c55e"/><rect x="160" y="270" width="156" height="14" fill="#22c55e33" stroke="#22c55e"/>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.4" points="40,330 90,320 140,300 200,290 240,286 260,250 270,230 280,224"/>
<path d="M110,260 l8,-14 l8,14 z" fill="#22c55e"/>
<rect x="440" y="240" width="180" height="12" fill="#22c55e44" stroke="#22c55e" stroke-width="1.6"/>
<rect x="420" y="262" width="200" height="12" fill="#22c55e22" stroke="#22c55e"/>
<rect x="400" y="284" width="220" height="14" fill="#22c55e22" stroke="#22c55e"/>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.4" points="340,336 370,320 390,300 410,280 430,262 450,236 470,228 500,236 530,232 560,238 590,226"/>
<line x1="340" y1="344" x2="620" y2="290" stroke="#a78bfa" stroke-width="1.2"/>
<path d="M470,262 l8,-14 l8,14 z" fill="#22c55e"/>
<text x="452" y="234" font-size="10" fill="#f59e0b">nearest</text>
</svg>`;

export const KM_08: KevinMedia = {
  n: 8,
  images: [
    {
      src: '/lessons/kevin/08/f-000.jpg',
      caption: '[00:00] GBPJPY four-pane layout (OANDA): weekly, 4h, daily, 1h, each with a green up-arrow. The weekly has a rising trend line and demand at 162.78–164.91. The 1h has stacked demands from 181.30 down to 179.20.',
      notes: [
        'The example pair is GBPJPY. Every timeframe is marked as an uptrend with a green arrow.',
        'HTF trending AND entry TF trending is the precondition for trend trading.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-001.jpg',
      caption: '[00:25] GBPJPY 1h: stacked demand zones 180.89–181.30, 180.10–180.48, 179.20–179.72, 177.97–178.47, and a purple zone at 177.27–177.43. The 1h trend line rises beneath them.',
      notes: [
        'Each green box is an H1 demand left by the rally. The nearest one (180.89–181.30) is the only one you buy.',
        'Price is consolidating just above the nearest zone.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-004.jpg',
      caption: '[02:09] GBPJPY 1h, zoomed out: the full staircase of demands from about 173.7 up to 181.3, purple zones at 177.27–177.43 and 175.10–175.39, and the 1h trend line drawn from the 12–13 June lows.',
      notes: ['The rally left a demand at every step. A respected trend line underneath means the H1 uptrend is intact.'],
    },
    {
      src: '/lessons/kevin/08/f-005.jpg',
      caption: '[02:44] GBPJPY 1h with his drawing: an X through the nearest zone (180.89–181.30), a scribbled path down through 180.10–180.48, and a horizontal line at about 179.20 on the 179.20–179.72 zone.',
      notes: [
        'If the nearest zone is removed you lose the H1 uptrend, so you do not just buy the next zone (180.10).',
        'The next zone to consider is the one sitting on the H4 demand (H4 top at 179.40), around 179.2–179.7.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-006.jpg',
      caption: '[03:39] GBPJPY 1h, lower part: the 177.97–178.47 demand overlapping the trend line, the purple 177.27–177.43 zone, and the purple 175.10–175.39 zone over an older peach range.',
      notes: ['Lower zones only come back into play if they are inside a higher-timeframe zone or the trend line still holds.'],
    },
    {
      src: '/lessons/kevin/08/f-008.jpg',
      caption: '[04:49] GBPJPY 1h: he underlines the proximal (181.30) of the nearest demand with a black line. Price has pulled back to it twice.',
      notes: ['"We simply buy or sell the nearest zone": the order sits at the nearest zone\'s proximal line.'],
    },
    {
      src: '/lessons/kevin/08/f-009.jpg',
      caption: '[05:19] GBPJPY weekly 2020–2023: rising weekly trend line, weekly demands at 162.78–164.91 and 149.03–151.81, weekly supply at 184.27+ above, and peach boxes on the old ranges.',
      notes: ['The HTF trend is objective: higher highs and higher lows along the trend line, with a 90-degree weekly candle into 181.8.'],
    },
    {
      src: '/lessons/kevin/08/f-012.jpg',
      caption: '[05:24] GBPJPY weekly, closer: the vertical rally from the 162.78–164.91 demand to about 181.8, still below the weekly supply at 184.27–186.35.',
      notes: [
        'This is the "price went straight up" situation: you will miss trades, and you must not chase.',
        'The weekly supply above limits the move.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-015.jpg',
      caption: '[06:45] GBPJPY four-pane, zoomed: the daily shows stacked green demands (one dotted) below a vertical daily rally, with the 4h and 1h zones beneath price.',
      notes: [
        'Daily, H4 and H1 all show continuation demands stacked one after another.',
        'Several CPs in a row means the move is getting overextended.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-016.jpg',
      caption: '[06:47] GBPJPY 4h: demands at 178.89–179.40 and 178.13–178.89 (stacked), purple zones at 176.76–177.15 and 175.10–175.54, a green demand at 174.30–174.63, and the 4h trend line.',
      notes: [
        'The H4 demand (top 179.40) is the ITF zone that decides whether a deeper H1 zone is still a buy.',
        'Above it there are no H4 zones, so the 180.10 H1 zone has no ITF support.',
      ],
    },
    {
      src: '/lessons/kevin/08/f-017.jpg',
      caption: '[06:52] GBPJPY four-pane recap: weekly up from demand, 4h zones 178.13–179.40 under price, daily stacked demands, 1h nearest demand under consolidation.',
      notes: ['Homework template: one screenshot for the HTF trend and one for the nearest-zone setup on the entry TF.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'GBPJPY H1: buy only the nearest demand (180.89–181.30). If it breaks, skip 180.10–180.48 (no H4 zone under it) and look for the H1 zone that overlaps the H4 demand at 178.13–179.40.' },
    { svg: fig2, caption: 'The three-CP rule: full risk on early continuation patterns, reduced risk and break-even by 1:1 on the third, and stand aside after that.' },
    { svg: fig3, caption: 'His four-pane layout for GBPJPY: weekly, 4h, daily and 1h all trending up (green arrows), with the nearest 1h demand as the entry.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 GBPJPY four-pane (W, 4h, D, 1h), all marked with green up-arrows. Weekly demand 162.78–164.91 on a rising trend line; weekly supply from 184.27.',
        '00:25 1h: stacked demands 180.89–181.30, 180.10–180.48, 179.20–179.72, 177.97–178.47, plus a purple 177.27–177.43 zone and the H1 trend line.',
        '02:06–02:09 He zooms the 1h out to show the full staircase of demands back to about 173.7 and the trend line from the 12–13 June lows.',
        '02:44 He draws an X through the nearest zone and a path down to a line at about 179.20: once the nearest zone breaks, the next zone is only worth buying where it sits on the H4 demand (178.13–179.40).',
        '03:39 The lower 1h zones and purple zones (177.27–177.43, 175.10–175.39) under the trend line.',
        '04:49 He underlines the 181.30 proximal of the nearest zone, where price has already pulled back twice.',
        '05:19–05:27 Weekly: an objective uptrend with a near-vertical candle into about 181.8, below weekly supply at 184.27–186.35.',
        '06:45–06:52 4h: demands 178.13–179.40, purple zones 176.76–177.15 and 175.10–175.54, demand 174.30–174.63. Daily: stacked continuation demands under a vertical rally.',
      ],
    },
  ],
  corrections: [
    'The trend-trading example pair is GBPJPY (OANDA), shown on a four-pane layout: weekly, 4h, daily and 1h. The notes do not name the pair and only mention the daily as the HTF; the weekly is also shown trending up with a rising trend line.',
    'The "H4 zone around 179.5" is the H4 demand at 178.13–179.40 (two stacked boxes, 178.13–178.89 and 178.89–179.40).',
    'Exact H1 zones in the example: the nearest demand is 180.89–181.30, then 180.10–180.48, 179.20–179.72 and 177.97–178.47. He drew the path to 179.20, so the zone that overlaps the H4 demand is 179.20–179.72; 180.10–180.48 has no H4 zone under it.',
    'He marks the trend on every pane with a green up-arrow and draws thin black trend lines on the weekly, 4h and 1h.',
    'Some zones are shaded purple instead of green (1h 177.27–177.43 and 175.10–175.39; 4h 176.76–177.15 and 175.10–175.54). The frames do not say what purple means.',
  ],
};
