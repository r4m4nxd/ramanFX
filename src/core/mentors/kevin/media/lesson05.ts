import type { KevinMedia } from './types';

// Lesson 5 (Trend vs Momentum): enrichment from the key frames of his video.
// All charts are EURUSD 4h (OANDA), Dec 2022 – May 2023, plus his 4-pane DXY / AUDUSD / EURUSD layouts.

const F = '/lessons/kevin/05/';

export const KM_05: KevinMedia = {
  n: 5,
  images: [
    {
      src: F + 'f-002_t00m24s.jpg',
      caption: '[00:24] Whiteboard on a blank EURUSD 4h: "Trend / Trendlines" (zigzag with its peaks and valleys circled, line along the valleys) next to "Momentum / Momentum Lines" (a steep near-straight leg with two tiny pullbacks). He circles the trend and crosses out the momentum label.',
      notes: [
        'The trend example has three clear peaks and three clear valleys, and each one is higher than the last. The line touches the valleys.',
        'The momentum leg has no real peaks or valleys, only small pauses. He puts a big X over it: this is what not to use.',
      ],
    },
    {
      src: F + 'f-005_t02m15s.jpg',
      caption: '[02:15] EURUSD 4h, Feb 2023: from the Feb 2 top (about 1.103) a steep RED line runs to the Feb 9 pullback high, and a shallower BLACK line runs from the same top through the Feb 14 lower high and on to the late-Feb low (about 1.053).',
      notes: [
        'His colour code on real charts: red = momentum line, black = trend line.',
        'The red line is steep and only covers the first leg. The black line covers the whole decline.',
      ],
    },
    {
      src: F + 'f-008_t03m30s.jpg',
      caption: '[03:30] Sketch above the Feb chart: up to a peak, down to a valley, up to a LOWER peak, then a line drawn from the start through the valley.',
      notes: [
        'The second push never broke the first peak, so the swing point was not broken. That line has no basis; you cannot draw a trend line yet.',
      ],
    },
    {
      src: F + 'f-009_t03m42s.jpg',
      caption: '[03:42] EURUSD 4h: he traces the Feb 9 peak → Feb 13 valley → Feb 14 rally and circles where the Feb 14 high meets the black line.',
      notes: [
        'The Feb 13–14 rally breaks the red momentum line but stops at the black trend line. The momentum-line break was false: price went on to new lows.',
        'The Feb 14 lower high is the second anchor of the black line, after price had broken the Feb 7 valley.',
      ],
    },
    {
      src: F + 'f-011_t04m19s.jpg',
      caption: '[04:19] EURUSD 4h zoomed in: a circle around Feb 21–22 where price rallies into the black trend line again and is rejected.',
      notes: [
        'The extended trend line keeps working as a ceiling, which a momentum line would not have shown.',
      ],
    },
    {
      src: F + 'f-016_t05m58s.jpg',
      caption: '[05:58] EURUSD 4h, late Dec 2022 – Jan 2023: a short black down line from the Dec 30 top, with the top and the Jan 3 valley circled. A steep red momentum line runs up from the Jan 6 low.',
      notes: [
        'A real but small trend line: one peak, one valley and a lower low, all within a few days.',
      ],
    },
    {
      src: F + 'f-020_t07m00s.jpg',
      caption: '[07:00] Same area, the whole small down-structure (late Dec – Jan 6) circled.',
      notes: [
        'Trend quality: this structure is small and formed over a short time, so the trend probably will not last. It did not: price rallied hard right after.',
      ],
    },
    {
      src: F + 'f-018_t06m35s.jpg',
      caption: '[06:35] EURUSD 4h, Mar–Apr 2023 uptrend: black lines from the Mar 15 low (about 1.052) through the Apr 3 valley, then a second line from Apr 3 through the Apr 10 valley. He circles the peaks and the Apr 3 valley and sketches how the trend formed.',
      notes: [
        'His sketch: push up, pull back to a valley, push up and break the high. Only then draw the line along the valleys.',
      ],
    },
    {
      src: F + 'f-021_t07m12s.jpg',
      caption: '[07:12] The same uptrend, clean: a steep red momentum line from the Mar 15 low, a black line Mar 15 → Apr 3 valley, and a flatter black line Apr 3 → Apr 10 valley that runs to early May.',
      notes: [
        'Re-anchoring in an uptrend: after a new higher low, the line is redrawn from the newer valley. Each redraw is flatter.',
      ],
    },
    {
      src: F + 'f-024_t07m49s.jpg',
      caption: '[07:49] Sketch: a box labelled "H4" (orange = supply) with a "15" (15m) price path rising into it as momentum, with small steps.',
      notes: [
        'His confirmation example: on the 15m, breaking the small momentum line under that climb can be a false breakout. Wait for a proper trend line to break.',
      ],
    },
    {
      src: F + 'f-025_t08m14s.jpg',
      caption: '[08:14] EURUSD 4h, May 2023: after the Apr 3 → Apr 10 line breaks, the fall from the May 4 high (about 1.109) to about 1.071 is circled in red. No trend line is drawn on it.',
      notes: [
        'Steady, repeated lower pushes with small pullbacks. At some point this momentum becomes a downtrend, but he still draws no line.',
      ],
    },
    {
      src: F + 'f-027_t08m38s.jpg',
      caption: '[08:38] His DXY layout: 1W, 4h, 1D and 1h panes with zones. Green up arrows on the 4h and 1h; the 1h also has a rising trend line.',
      notes: [
        'This is the "main chart link" he refers to. Each pane gets a trend arrow; a trend line is added only where one is valid.',
      ],
    },
    {
      src: F + 'f-033_t10m17s.jpg',
      caption: '[10:17] AUDUSD layout (1W/4h/1D/1h): the 1D and 4h each have a falling trend line and a red down arrow. The 1h has only a red down arrow, no line.',
      notes: [
        'His AUDUSD example: the 1h fall is momentum with no valid trend line, but the arrow still says downtrend because the 4h has a proper line.',
      ],
    },
    {
      src: F + 'f-037_t11m07s.jpg',
      caption: '[11:07] EURUSD layout: red down arrows on the 4h and 1h with no trend lines, while the 1D still shows a rising trend line that price is dropping through. The weekly is marked "3m Proximal" and "TARGET".',
      notes: [
        'A second "trend without a trend line" case: the arrows carry the trend call when no line can be drawn.',
      ],
    },
    {
      src: F + 'f-036_t10m54s.jpg',
      caption: '[10:54] EURUSD 4h May decline with the swings marked: the top circled, a "1" valley, a "2" bounce, and the latest low circled.',
      notes: [
        'He counts the swings to show there is no clean peak–valley–lower-peak sequence to anchor a line, even though price keeps making lower lows.',
      ],
    },
    {
      src: F + 'f-040_t11m44s.jpg',
      caption: '[11:44] Sketch over the May decline: what would have made a valid downtrend line. Drop, valley, rally to a lower peak, then a fall through the valley low.',
      notes: [
        'Only after the valley breaks can you connect the top and the lower peak. This did not happen in May, so there is no line.',
      ],
    },
    {
      src: F + 'f-046_t13m47s.jpg',
      caption: '[13:47] Back on the Mar–Apr uptrend: he circles the steep momentum leg off the Mar 15 low and, separately, the Apr 3 valley where the proper trend line is anchored.',
      notes: [
        'Same move, two lines. The momentum line (red) hugs the first leg; the trend line (black) needs a valley and is the one he uses.',
      ],
    },
  ],
  figures: [
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><defs><marker id="km5_ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs><text x="20" y="26" font-size="13" fill="#94a3b8" font-weight="600">His whiteboard: trend vs momentum</text><text x="40" y="58" font-size="13" fill="#22c55e" font-weight="700">Trend / trend line</text><polyline points="40,300 90,220 120,250 160,170 195,215 240,130 270,175 300,105" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round" marker-end="url(#km5_ah)"/><line x1="105" y1="257" x2="315" y2="152" stroke="#a78bfa" stroke-width="2"/><g fill="none" stroke="#f59e0b" stroke-width="1.6"><circle cx="90" cy="220" r="9"/><circle cx="160" cy="170" r="9"/><circle cx="240" cy="130" r="9"/><circle cx="120" cy="250" r="9"/><circle cx="195" cy="215" r="9"/><circle cx="270" cy="175" r="9"/></g><text x="40" y="330" font-size="11" fill="#94a3b8">Clear peaks and valleys anyone can see.</text><text x="40" y="346" font-size="11" fill="#94a3b8">Line along the valleys. Sustainable.</text><line x1="330" y1="44" x2="330" y2="340" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="3 4"/><text x="360" y="58" font-size="13" fill="#ef4444" font-weight="700">Momentum / momentum line</text><polyline points="370,300 450,200 462,208 520,140 528,146 590,72" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round" marker-end="url(#km5_ah)"/><line x1="365" y1="299" x2="600" y2="78" stroke="#a78bfa" stroke-width="2"/><line x1="440" y1="90" x2="560" y2="230" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/><line x1="560" y1="90" x2="440" y2="230" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/><text x="360" y="330" font-size="11" fill="#94a3b8">Steep, near-straight, tiny pullbacks.</text><text x="360" y="346" font-size="11" fill="#ef4444" font-weight="600">Not sustainable. Do not draw or trade it.</text></svg>`,
      caption: 'His opening whiteboard: the trend has clear, circled peaks and valleys with the line along the valleys. The momentum leg has only tiny pauses, and he crosses it out.',
    },
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><defs><marker id="km5_aa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs><text x="20" y="26" font-size="13" fill="#94a3b8" font-weight="600">EURUSD 4h, Feb 2023: momentum line vs trend line</text><line x1="150" y1="205" x2="300" y2="205" stroke="#94a3b8" stroke-width="1" stroke-dasharray="4 4"/><text x="152" y="222" font-size="10" fill="#94a3b8">Feb 7 valley</text><polyline points="40,110 70,90 100,55 130,120 165,205 205,150 240,218 270,140 310,210 345,195 380,235 420,215 470,290 510,250 540,270 590,230 620,240" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/><line x1="100" y1="55" x2="262" y2="202" stroke="#ef4444" stroke-width="2"/><line x1="100" y1="55" x2="505" y2="258" stroke="#a78bfa" stroke-width="2.2"/><circle cx="100" cy="55" r="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/><circle cx="270" cy="140" r="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/><circle cx="420" cy="215" r="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/><circle cx="240" cy="218" r="8" fill="none" stroke="#ef4444" stroke-width="1.5"/><text x="110" y="50" font-size="11" fill="#94a3b8">Feb 2 top ≈1.103</text><text x="282" y="122" font-size="11" fill="#a78bfa" font-weight="600">trend line: top → Feb 14 lower high</text><text x="282" y="137" font-size="10" fill="#94a3b8">(drawn once the Feb 7 valley broke)</text><text x="168" y="262" font-size="11" fill="#ef4444" font-weight="600">red = momentum line</text><text x="168" y="277" font-size="10" fill="#94a3b8">broken by the Feb 14 rally: a false break</text><line x1="440" y1="180" x2="424" y2="206" stroke="#f59e0b" stroke-width="1.3" marker-end="url(#km5_aa)"/><text x="436" y="174" font-size="10" fill="#f59e0b">Feb 21 retest rejected</text><text x="440" y="310" font-size="10" fill="#94a3b8">late-Feb low ≈1.053</text><text x="20" y="346" font-size="11" fill="#94a3b8">Black (trend) held the whole decline; the steep red (momentum) line only fit the first leg.</text></svg>`,
      caption: 'His EURUSD 4h February example: the steep red momentum line was broken by the Feb 14 rally without ending the fall, while the black trend line (Feb 2 top through the Feb 14 lower high) held, including the Feb 21 retest.',
    },
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><text x="20" y="26" font-size="13" fill="#94a3b8" font-weight="600">EURUSD 4h, Mar–May 2023: re-anchoring, then momentum becomes a trend</text><polyline points="60,310 120,190 140,240 200,150 235,215 270,150 300,190 340,95 380,140 430,110 470,126 505,80 530,140 548,122 575,185 590,170 615,235 628,250" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linejoin="round"/><line x1="60" y1="310" x2="128" y2="176" stroke="#ef4444" stroke-width="1.8"/><line x1="60" y1="310" x2="320" y2="169" stroke="#a78bfa" stroke-width="2"/><line x1="235" y1="215" x2="520" y2="105" stroke="#a78bfa" stroke-width="2"/><circle cx="235" cy="215" r="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/><circle cx="300" cy="190" r="8" fill="none" stroke="#f59e0b" stroke-width="1.5"/><ellipse cx="572" cy="165" rx="40" ry="100" transform="rotate(-25 572 165)" fill="none" stroke="#ef4444" stroke-width="1.8"/><text x="66" y="330" font-size="10" fill="#94a3b8">Mar 15 low ≈1.052</text><text x="20" y="178" font-size="10" fill="#ef4444">momentum</text><text x="150" y="268" font-size="10" fill="#a78bfa" font-weight="600">line 1: low → Apr 3 valley</text><text x="250" y="240" font-size="10" fill="#a78bfa" font-weight="600">line 2: Apr 3 → Apr 10 valley (flatter)</text><text x="388" y="70" font-size="10" fill="#94a3b8">May 4 top ≈1.109</text><text x="430" y="300" font-size="10" fill="#ef4444" font-weight="600">May: repeated lower pushes</text><text x="430" y="314" font-size="10" fill="#94a3b8">trend now down, but no line</text><text x="20" y="346" font-size="11" fill="#94a3b8">The Apr 10 dip poked under line 1, so he re-anchored. When line 2 broke, the drop became a downtrend.</text></svg>`,
      caption: 'The uptrend he walks through: a steep red momentum line and two black trend lines (Mar 15 low → Apr 3 valley, then re-anchored Apr 3 → Apr 10). After line 2 broke in May, the steady fall was circled as momentum that becomes a downtrend, with no line drawn.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00–00:49] Whiteboard on a blank EURUSD 4h. "Trend / Trendlines" is a zigzag with the peaks and valleys circled and the line along the valleys. "Momentum / Momentum Lines" is a steep leg with tiny pullbacks. He circles the trend and crosses out the momentum label.',
        '[02:15–02:40] EURUSD 4h, Feb 2023. From the Feb 2 top (about 1.103) he draws a steep red momentum line to the Feb 9 high and a black trend line through the Feb 14 lower high. The black line runs down to the late-Feb low (about 1.053).',
        '[03:30] Sketch of a line drawn before the high was broken (peak, valley, lower peak): not valid.',
        '[03:42–04:31] He traces the Feb 9 peak → Feb 13 valley → Feb 14 rally into the black line. The rally broke the red momentum line but price still made new lows. A Feb 21–22 retest of the black line is circled.',
        '[04:44–07:00] Dec 2022 – Jan 2023: a short black down line from the Dec 30 top with one valley. He circles the whole small structure as a low-quality trend that did not last. A steep red momentum line runs up from the Jan 6 low.',
        '[06:35–07:37] Mar–Apr 2023 uptrend: red momentum line off the Mar 15 low (about 1.052), black line through the Apr 3 valley, then a flatter black line from Apr 3 through the Apr 10 valley. He sketches how a trend forms: up, valley, break of the high, then draw the line.',
        '[07:49] Sketch of an H4 (orange) zone with a 15m momentum climb into it: the setup where a small momentum-line break can be a false breakout.',
        '[08:14–09:28] The May 2023 fall from about 1.109 to about 1.071 is circled in red. No line, just steady lower pushes. He shows his DXY 4-pane layout (1W/4h/1D/1h), where green arrows mark the trend.',
        '[10:05–10:42] AUDUSD 4-pane: the 1D and 4h have falling trend lines and red arrows; the 1h has only a red arrow and no line.',
        '[10:54–11:44] Back on the EURUSD May fall: he numbers the swings and sketches the missing lower peak and valley break that a valid downtrend line would need. The EURUSD 4-pane shows red arrows on the 4h and 1h without lines.',
        '[12:21–14:12] Final pass over the Mar–May chart. He circles the May top and scribbles a choppy path under it, then circles the momentum leg and the anchored valley to compare the two lines.',
      ],
    },
  ],
  corrections: [
    'Colour code on his real charts: red lines are momentum lines and black lines are trend lines. The whiteboard uses purple for both, and he puts an X over the momentum example.',
    'The re-anchor example is EURUSD 4h, Feb 2023, not an abstract case. Both lines start at the Feb 2 top (about 1.103). The steep red momentum line through the Feb 9 high was broken by the Feb 13–14 rally. The black trend line through the Feb 14 lower high held, including a Feb 21–22 retest, until the late-Feb low (about 1.053). The line that "price wicked above" was the momentum line, not the trend line.',
    'Re-anchoring also happens in uptrends: Mar 15 low → Apr 3 valley, then a new, flatter line Apr 3 → Apr 10 valley. The Apr 10 dip poked slightly under the first line but held as a higher low, so he redrew the line from the newer valley instead of calling the trend over. Each re-anchor is shallower.',
    'Trend without a trend line is shown twice, not once. AUDUSD has a red arrow on the 1h with no line (the 4h and 1D have lines). EURUSD in May 2023 has red arrows on the 4h and 1h and no line, while the 1D still shows a rising trend line.',
    'The "momentum becoming a trend" example is the EURUSD 4h fall from the May 4, 2023 high (about 1.109) to about 1.071, circled in red. It came right after the Apr 3 → Apr 10 uptrend line broke.',
    'The "small, short trend" example is the late Dec 2022 – early Jan 2023 EURUSD 4h down line: one peak and one valley over a few days. Price then rallied sharply.',
  ],
};
