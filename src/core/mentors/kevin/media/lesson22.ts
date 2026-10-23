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
const cs = (k: number[][], w = 12) => k.map(([x, o, cl, h, l]) => c(x, o, cl, h, l, w)).join('');

// Figure 1: his Trendline.JPG (peak, valley, higher high) and the overextended line that gets ended.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Uptrend line: peak, blatant valley, then a higher high</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${G}">✓ valid trendline</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${A}">Overextended: end it</text>
<line x1="320" y1="40" x2="320" y2="318" stroke="${L}" stroke-opacity="0.35"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="30,300 70,262 96,272 130,200 156,214 180,150 196,166 214,128 236,176 256,226 272,240 288,190 304,96"/>
<line x1="30" y1="300" x2="310" y2="174" stroke="${T}" stroke-width="1.8"/>
<circle cx="214" cy="128" r="9" fill="${R}33" stroke="${R}"/>
<circle cx="272" cy="240" r="9" fill="${R}33" stroke="${R}"/>
<g font-size="10.5">
<text x="214" y="112" text-anchor="middle" fill="${L}">peak</text>
<text x="272" y="266" text-anchor="middle" fill="${L}">blatant valley</text>
<line x1="214" y1="128" x2="304" y2="128" stroke="${L}" stroke-dasharray="3 3"/>
<text x="300" y="86" text-anchor="end" fill="${G}">higher high above the peak</text>
<text x="24" y="320" fill="${T}">from the lowest point, through the valley,</text>
<text x="24" y="333" fill="${T}">cutting no candle bodies or wicks</text>
</g>
<line x1="340" y1="300" x2="520" y2="228" stroke="${T}" stroke-width="1.8"/>
<line x1="520" y1="228" x2="620" y2="188" stroke="${T}" stroke-width="1.4" stroke-dasharray="2 4" stroke-opacity="0.6"/>
<line x1="340" y1="256" x2="620" y2="144" stroke="${T}" stroke-width="1.4" stroke-dasharray="6 4"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="350,296 380,240 400,276 430,218 446,232 470,200 488,212 520,150 540,96 566,70"/>
<line x1="520" y1="216" x2="520" y2="240" stroke="${A}" stroke-width="2.2"/>
<g font-size="10.5">
<text x="344" y="80" fill="${T}">dashed: channel, parallel to the</text>
<text x="344" y="93" fill="${T}">trendline, on the first peak</text>
<text x="566" y="60" text-anchor="middle" fill="${A}">trades above the channel</text>
<text x="530" y="252" fill="${A}">END the line here:</text>
<text x="530" y="265" fill="${A}">extending it says</text>
<text x="530" y="278" fill="${A}">it is still valid</text>
</g>
<line x1="20" y1="342" x2="620" y2="342" stroke="${L}" stroke-opacity="0.2"/>
<text x="340" y="320" font-size="10.5" fill="${L}">After a reaction and a new high, redraw to the new swing.</text>
</svg>`;

// Figure 2: the demand that removed a supply must base below it (GBPUSD 1990 example).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Which demand removed the supply? Its basing must be below it</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${R}">✗ basing wicks reach the supply</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${G}">✓ basing fully below the supply</text>
<line x1="320" y1="40" x2="320" y2="318" stroke="${L}" stroke-opacity="0.35"/>
<rect x="20" y="110" width="290" height="110" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
<text x="304" y="104" font-size="10" text-anchor="end" fill="${R}">1.74700</text>
<text x="304" y="234" font-size="10" text-anchor="end" fill="${R}">1.71486</text>
${cs([[60, 300, 276, 270, 306], [80, 276, 290, 268, 300], [100, 290, 160, 156, 296], [120, 160, 156, 110, 212], [140, 156, 176, 140, 226], [160, 176, 146, 112, 196], [180, 146, 70, 66, 150]])}
<ellipse cx="120" cy="110" rx="9" ry="6" fill="none" stroke="${A}" stroke-width="1.6"/>
<ellipse cx="160" cy="112" rx="9" ry="6" fill="none" stroke="${A}" stroke-width="1.6"/>
<ellipse cx="140" cy="168" rx="38" ry="66" fill="none" stroke="${L}" stroke-width="1.2" stroke-dasharray="4 3"/>
<text x="196" y="260" font-size="10.5" fill="${A}">basing sits inside the</text>
<text x="196" y="273" font-size="10.5" fill="${A}">supply; wicks touch its</text>
<text x="196" y="286" font-size="10.5" fill="${A}">distal: not the demand</text>
<text x="196" y="299" font-size="10.5" fill="${A}">that removed it</text>
<rect x="340" y="110" width="280" height="50" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
<text x="616" y="104" font-size="10" text-anchor="end" fill="${R}">supply</text>
${cs([[370, 196, 210, 190, 216], [388, 210, 250, 206, 256], [406, 250, 268, 244, 276], [424, 268, 260, 254, 274], [442, 260, 266, 252, 272], [460, 266, 180, 176, 270], [478, 180, 100, 96, 184], [496, 100, 84, 78, 106]])}
<rect x="418" y="252" width="202" height="24" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<text x="616" y="292" font-size="10.5" text-anchor="end" fill="${G}">demand: basing below the supply,</text>
<text x="616" y="305" font-size="10.5" text-anchor="end" fill="${G}">explosive move removes it</text>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">For supply it is reversed: basing above the demand it removed. Take the qualifying zone nearest the removal.</text>
</svg>`;

// Figure 3: S/R flip vs supply removed by demand (member's AUDNZD 4h idea).
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km22_a3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="${L}"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">"Supply now acts as demand" vs supply removed by demand</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${R}">✗ old resistance becomes new support</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${G}">✓ S&amp;D: buy the demand that removed it</text>
<line x1="320" y1="40" x2="320" y2="318" stroke="${L}" stroke-opacity="0.35"/>
<rect x="120" y="120" width="190" height="20" fill="${R}22" stroke="${R}" stroke-width="1.4"/>
<line x1="30" y1="290" x2="140" y2="150" stroke="${T}" stroke-width="1.6"/>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="30,288 70,250 90,256 120,190 132,124 146,170 170,214 196,226 214,190 236,110 256,86"/>
<path d="M256,86 L282,130" fill="none" stroke="${L}" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#km22_a3)"/>
<circle cx="286" cy="132" r="9" fill="none" stroke="${R}" stroke-width="1.6"/>
<text x="24" y="320" font-size="10.5" fill="${R}">"4hr supply zone act as Demand zone now. Buy here"</text>
<text x="24" y="333" font-size="10.5" fill="${L}">a pullback to a broken supply is an S/R trade</text>
<rect x="420" y="120" width="200" height="20" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="4 3"/>
<text x="344" y="114" font-size="10" fill="${R}">supply (removed)</text>
<polyline fill="none" stroke="${L}" stroke-width="1.8" stroke-linejoin="round" points="350,288 390,250 410,256 440,190 452,124 466,170 490,214 506,224 514,222 522,226 540,110 560,86"/>
<rect x="500" y="212" width="120" height="20" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<path d="M560,86 L590,206" fill="none" stroke="${L}" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#km22_a3)"/>
<text x="616" y="252" font-size="10.5" text-anchor="end" fill="${G}">demand whose basing is below the supply</text>
<text x="616" y="265" font-size="10.5" text-anchor="end" fill="${G}">and whose move away removed it</text>
<text x="344" y="320" font-size="10.5" fill="${G}">the pullback is bought at this demand,</text>
<text x="344" y="333" font-size="10.5" fill="${G}">not at the old supply</text>
</svg>`;

// Figure 4: wrap the lines around the basing, include close wicks, proximal tight before the explosive candle.
const fig4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="${L}">Drawing the zone: around the basing, not the explosive candle</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="${R}">✗ common homework errors</text>
<text x="340" y="50" font-size="12" font-weight="700" fill="${G}">✓ how he wants it</text>
<line x1="320" y1="40" x2="320" y2="318" stroke="${L}" stroke-opacity="0.35"/>
${cs([[40, 140, 190, 136, 196], [58, 190, 236, 186, 244], [76, 236, 252, 230, 262], [94, 250, 240, 228, 272], [112, 240, 252, 234, 258], [130, 252, 120, 116, 256], [148, 120, 96, 90, 126]])}
<rect x="88" y="236" width="220" height="22" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
<rect x="124" y="150" width="184" height="40" fill="${R}22" stroke="${R}" stroke-width="1.4" stroke-dasharray="5 3"/>
<g font-size="10.5" fill="${A}">
<text x="190" y="274">wick left out: distal</text>
<text x="190" y="287">in the middle of a candle</text>
<text x="160" y="144">box around the explosive candle</text>
</g>
${cs([[360, 140, 190, 136, 196], [378, 190, 236, 186, 244], [396, 236, 252, 230, 262], [414, 250, 240, 228, 272], [432, 240, 252, 234, 258], [450, 252, 120, 116, 256], [468, 120, 96, 90, 126]])}
<rect x="404" y="228" width="216" height="44" fill="${G}22" stroke="${G}" stroke-width="1.4"/>
<g font-size="10.5">
<text x="616" y="222" text-anchor="end" fill="${G}">proximal tight on the basing</text>
<text x="616" y="288" text-anchor="end" fill="${G}">distal on the lowest basing wick</text>
<text x="616" y="301" text-anchor="end" fill="${G}">both basing candles + wicks included</text>
<text x="490" y="140" fill="${L}">explosive move away,</text>
<text x="490" y="153" fill="${L}">then a stay-away candle</text>
</g>
<line x1="20" y1="326" x2="620" y2="326" stroke="${L}" stroke-opacity="0.35"/>
<text x="20" y="346" font-size="11" fill="${L}">Explosive is relative to the candles around it. Use a visible colour (not yellow) and snap lines with the magnet.</text>
</svg>`;

export const KM_22: KevinMedia = {
  n: 22,
  images: [
    {
      src: '/lessons/kevin/22/f-001.jpg',
      caption: '[00:22] zones.JPG over his GBPUSD daily (FXCM) homework chart: Basing Candles, Move Away Candles, Stay Away Candle, and "Space between Stay away candle and proximal line". The corner note reads "What Qualifies as a Zone? 1. Removes opposing zone 2. Removes a trendline 3. Makes all time high/low".',
      notes: ['The recap diagram, with the three qualifiers on the chart all session.'],
    },
    {
      src: '/lessons/kevin/22/f-002.jpg',
      caption: '[01:58] Trendline.JPG: a "Peak" and a "Valley" circled in red, a "Higher High" above the peak, and the uptrend line drawn from the lowest point through the valley.',
      notes: ['Peak, a blatant valley, then a higher high above the peak. No higher high, no trendline.'],
    },
    {
      src: '/lessons/kevin/22/f-003.jpg',
      caption: '[13:53] GBPUSD monthly (FXCM), zoomed out: red vertical lines mark each yearly homework window from the 1980s. Daily zones are visible, including supply 1.73450–1.74700 and demand 1.62556–1.64620.',
      notes: ['When price hesitates for a long time, check the higher timeframes (weekly, monthly, 3-month) for a macro zone.'],
    },
    {
      src: '/lessons/kevin/22/f-005.jpg',
      caption: '[15:44] GBPUSD daily, 1990: supply 1.71486–1.74700. He circles the group of basing candles inside it and marks with small ovals the wicks that reach the supply\'s top line (1.74700) before the explosive candle up.',
      notes: ['Those basing wicks reach the supply, so the basing is not below it, and this is not the demand that removed it. Zoom in to see it.'],
    },
    {
      src: '/lessons/kevin/22/f-015.jpg',
      caption: '[28:01] Member Hasim\'s GBPUSD daily, from January 1990: pink supplies and a green demand drawn at the May 1990 breakout through the April supply. He makes a short black mark at the top of the basing candles.',
      notes: ['Supply removed by demand: the demand has to base below the supply it removed, with the proximal tight on the basing.'],
    },
    {
      src: '/lessons/kevin/22/f-027.jpg',
      caption: '[31:56] Member HaesSe\'s GBPUSD daily with every zone labelled "Supply" or "Demand", the "What qualifies as a zone?" list, and demands around 1.63–1.6462. He marks one area with a short black line.',
      notes: ['Homework is marked zone by zone against the three qualifiers.'],
    },
    {
      src: '/lessons/kevin/22/f-031.jpg',
      caption: '[35:24] Member Geoff\'s chart (his homework for 02/15/26, GBPUSD FXCM Jan 87–88) with Kevin\'s corrections written in: "Stay away candle is not sufficient", "Trendline needs to start here because it cuts through candles here. Note: The trendlines need to touch the obvious peaks/valleys", "Is this a demand zone based on the fact it is leading up to a new all-time high? Yes", "NOTE: Explosive candles are relative to the candles in the area", "Forced zone", "Closest zone to the removal of the opposing zone", and an "All-time high" line at 1.90565.',
      notes: ['The member who puts the zone qualifications on his chart and labels each zone with what it removed.'],
    },
    {
      src: '/lessons/kevin/22/f-032.jpg',
      caption: '[35:26] Same chart, 1989–1990: labels such as "Supply Removes Demand" and "Demand Removes Supply", "Forced zone", "Closest zone to the removal of the opposing zone", "Not really a trendline. More of a U. would\'ve created a trend line", demands 1.63630–1.65019 and 1.59500–1.60713 marked "Demand Zone - Removed Zone/Trend".',
      notes: ['Take the zone nearest the removal. A rounded U is not a trendline.'],
    },
    {
      src: '/lessons/kevin/22/f-036.jpg',
      caption: '[42:30] Member Lazar\'s GBPUSD daily, 1990: supplies 1.73482–1.74644, 1.81512–1.83043 and about 1.8841–1.8940, with demand near 1.64231.',
      notes: ['Tight zones that match his chart closely.'],
    },
    {
      src: '/lessons/kevin/22/f-038.jpg',
      caption: '[45:00] Member Stefano\'s USDCAD 4h video-lesson homework: supply and demand boxes outlined in yellow/orange.',
      notes: ['Yellow outlines are very hard to see. Use different colours.'],
    },
    {
      src: '/lessons/kevin/22/f-041.jpg',
      caption: '[45:29] USDCAD daily (OANDA), same member: "rally base drop supply" at about 1.3495–1.3565 and "drop base drop supply" below it, with dashed horizontal lines.',
      notes: ['The labels can be technically right while the move away is barely good enough to be a zone.'],
    },
    {
      src: '/lessons/kevin/22/f-043.jpg',
      caption: '[46:03] USDCAD 4h (OANDA): the member\'s "RALLY BASE RALLY DEMAND" and "DROP BASE RALLY DEMAND". He draws black boxes around the basing candles at the start of each zone.',
      notes: ['Lines go around the basing candles, right before the explosive move, not around the explosive candle.'],
    },
    {
      src: '/lessons/kevin/22/f-045.jpg',
      caption: '[46:13] Member William P.\'s lesson 3 homework: green "Drop Base Rally" and "Rally Base Rally" demands on an orange background.',
      notes: ['Check where the proximal sits relative to the basing and the explosive candle.'],
    },
    {
      src: '/lessons/kevin/22/f-049.jpg',
      caption: '[47:11] Member Mathi Raj\'s GBPUSD daily, zoomed out over the 1986–1991 homework windows (red vertical lines), with demands 1.73324–1.74726 and 1.63655–1.64427 and the qualifier list.',
      notes: ['Copy every one of his zones and trendlines, then continue the chain.'],
    },
    {
      src: '/lessons/kevin/22/f-052.jpg',
      caption: '[50:18] Member Soikot\'s GBPCAD 4h (OANDA): a "Base" circled at a peak, a "4H Supply zone", and the note "Qualified Supply zone as it broke bearish trend line" (the member says it should read bullish).',
      notes: ['A new member\'s first drawing, reviewed against the qualifiers.'],
    },
    {
      src: '/lessons/kevin/22/f-056.jpg',
      caption: '[51:37] Same member, AUDNZD 4h: "4hr supply zone act as Demand zone now", "Buy here on lower time frame confirmation", "Trend line breakthrough made it a valid supply zone".',
      notes: ['Supply turning into demand is "old resistance becomes new support". In S&D, supply is removed by demand and you buy the pullback to that demand.'],
    },
    {
      src: '/lessons/kevin/22/f-065.jpg',
      caption: '[53:34] Stefano\'s GBPUSD daily: supply 1.96973–1.99300, an all-time-high line near 1.9055, demands 1.87450–1.89820, 1.80250–1.81550 and 1.73350–1.74720.',
      notes: ['Every high that price breaks is an all-time high; zones can qualify from it.'],
    },
    {
      src: '/lessons/kevin/22/f-068.jpg',
      caption: '[59:07] Member Quantamatic\'s GBPUSD daily (late 1990) with pale yellow zones labelled SZ-RBD, SZ-DBD, DZ-DBR and DZ-RBR.',
      notes: ['DBR/RBD/RBR labels alone don\'t make a zone, and pale yellow zones are hard to read.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'Trendline.JPG redrawn: a peak, a blatant valley, then a higher high. The line starts at the lowest point and cuts no candles. Right: once price trades above the channel (a parallel line on the first peak), end the trendline.' },
    { svg: fig2, caption: 'From his GBPUSD 1990 example: the basing candles inside the 1.71486–1.74700 supply have wicks reaching its distal, so that demand did not remove the supply. A demand that removes a supply must base fully below it.' },
    { svg: fig3, caption: 'The member\'s AUDNZD idea ("4hr supply zone act as Demand zone now") is an S/R flip. The S&D way: the supply is removed by a demand that based below it, and you buy the pullback to that demand.' },
    { svg: fig4, caption: 'Homework corrections: wrap the lines around the basing, include close basing candles and their wicks, keep the proximal tight before the explosive candle, and put the distal on a wick, not mid-candle.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:22 zones.JPG over the GBPUSD daily (FXCM) homework chart, with "What Qualifies as a Zone?" in the corner. Session date 22 Feb 2026.',
        '01:58 Trendline.JPG: peak, valley, higher high, line from the lowest point.',
        '13:53–14:08 GBPUSD monthly and 3-month: the yearly homework windows, to check higher-timeframe control.',
        '15:44 GBPUSD daily 1990 supply 1.71486–1.74700: circled basing whose wicks reach the supply\'s top line.',
        '24:41–25:08 Discord #homework: "Copy all of my zones the way i drew them EXACTLY, all of my trendlines exactly. Remove all of the zones that I did not have off of your chart. This is step 1 and must be done."',
        '28:01 Hasim\'s 1990 chart: demand at the May 1990 breakout through the April supply.',
        '29:30–31:56 Member charts (1989–1990 and 1990–1991), labelled Supply/Demand.',
        '35:24–35:26 Geoff\'s chart with written corrections: stay-away not sufficient, trendline must touch obvious peaks/valleys, all-time-high demand, forced zone, closest zone to the removal.',
        '42:30 Lazar\'s 1990 GBPUSD supplies 1.73482–1.74644 and 1.81512–1.83043.',
        '45:00–46:13 Video-lesson homework on USDCAD 4h/daily: yellow outlines, RBD/DBD/RBR/DBR labels, his black boxes around the basing.',
        '47:06–47:11 Mathi Raj\'s GBPUSD daily over the 1986–1991 windows.',
        '50:18–51:37 Soikot\'s GBPCAD and AUDNZD 4h: "supply zone act as Demand zone now", the S/R flip.',
        '53:34–56:05 Stefano\'s GBPUSD daily with an all-time-high line and "TF D DZ" demands 1.73350–1.74720 and 1.59580–1.60750.',
        '59:07 Quantamatic\'s pale yellow SZ/DZ labelled zones.',
      ],
    },
  ],
  corrections: [
    'The member who puts the rules on his chart is Geoff (spelled that way on Discord), not "Jeff". His chart has a "Zone Qualifications" box and labels such as "Demand Removes Supply" on each zone.',
    'The on-screen qualifier list reads "Makes all time high/low", not only all-time high.',
    'The recap diagram (zones.JPG) labels the space as "Space between Stay away candle and proximal line". It is measured from the stay-away candle down to the proximal line, not from the explosive candle.',
    'The homework instrument is GBPUSD daily on FXCM. The session date on screen is 22 Feb 2026.',
    'The basing-wick example: GBPUSD daily 1990 supply 1.71486–1.74700, with the basing candles\' wicks reaching the 1.74700 line.',
    'His written corrections on Geoff\'s chart add rules that are not in the transcript notes: "Explosive candles are relative to the candles in the area", and "The trendlines need to touch the obvious peaks/valleys".',
    'The S/R example is a member\'s AUDNZD 4h chart: "4hr supply zone act as Demand zone now. Buy here on lower time frame confirmation".',
  ],
};
