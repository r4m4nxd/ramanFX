import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: when is a zone "tested"? (DXY 4h supply example)
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">DXY 4h supply — "being tested" vs "tested"</text>
<rect x="60" y="80" width="560" height="60" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="76" font-size="10" text-anchor="end" fill="#ef4444">4h supply 102.430–102.803</text>
<text x="612" y="156" font-size="10" text-anchor="end" fill="#ef4444">proximal 102.430</text>
<g stroke-width="1.2">
<line x1="80" y1="60" x2="80" y2="150" stroke="#ef4444"/><rect x="72" y="70" width="16" height="70" fill="#ef4444"/>
<line x1="110" y1="120" x2="110" y2="250" stroke="#ef4444"/><rect x="102" y="135" width="16" height="105" fill="#ef4444"/>
<line x1="140" y1="150" x2="140" y2="250" stroke="#22c55e"/><rect x="132" y="160" width="16" height="80" fill="#22c55e"/>
<line x1="170" y1="92" x2="170" y2="170" stroke="#22c55e"/><rect x="162" y="100" width="16" height="60" fill="#22c55e"/>
<line x1="200" y1="88" x2="200" y2="130" stroke="#ef4444"/><rect x="192" y="96" width="16" height="22" fill="#ef4444"/>
<line x1="230" y1="90" x2="230" y2="128" stroke="#22c55e"/><rect x="222" y="98" width="16" height="20" fill="#22c55e"/>
<line x1="260" y1="100" x2="260" y2="210" stroke="#ef4444"/><rect x="252" y="108" width="16" height="92" fill="#ef4444"/>
<line x1="300" y1="168" x2="300" y2="226" stroke="#22c55e"/><rect x="292" y="176" width="16" height="40" fill="#22c55e"/>
<line x1="330" y1="128" x2="330" y2="200" stroke="#22c55e"/><rect x="322" y="146" width="16" height="36" fill="#22c55e"/>
<line x1="360" y1="134" x2="360" y2="236" stroke="#ef4444"/><rect x="352" y="146" width="16" height="80" fill="#ef4444"/>
<line x1="400" y1="160" x2="400" y2="222" stroke="#22c55e"/><rect x="392" y="170" width="16" height="44" fill="#22c55e"/>
<line x1="430" y1="200" x2="430" y2="270" stroke="#ef4444"/><rect x="422" y="206" width="16" height="56" fill="#ef4444"/>
</g>
<circle cx="360" cy="140" r="18" fill="none" stroke="#f59e0b" stroke-width="1.6"/>
<text x="250" y="292" font-size="11" fill="#f59e0b">closes below, but its wick still touches the zone</text>
<text x="250" y="308" font-size="11" fill="#f59e0b">→ still "being tested"</text>
<circle cx="400" cy="190" r="26" fill="none" stroke="#22c55e" stroke-width="1.6"/>
<text x="440" y="190" font-size="11" fill="#22c55e">nothing touches the zone</text>
<text x="440" y="206" font-size="11" fill="#22c55e">→ officially TESTED</text>
<text x="20" y="346" font-size="11" fill="#94a3b8">Pullbacks into a tested HTF zone are lower odds, unless the trend is with you.</text>
</svg>`;

// Figure 2: confirmation — the order stays only while the zone you trade stays in control.
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km10_arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Confirmation order: valid until the opposing HTF zone is hit</text>
<rect x="20" y="50" width="600" height="40" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="66" font-size="10" text-anchor="end" fill="#ef4444">opposing daily supply</text>
<rect x="20" y="270" width="600" height="50" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="336" font-size="10" text-anchor="end" fill="#22c55e">daily demand (in control)</text>
<rect x="150" y="214" width="470" height="18" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<text x="160" y="248" font-size="10" fill="#22c55e">H1 confirmation demand ≈ one zone-height above</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,150 70,240 100,300 120,290 140,232 160,230 180,190 210,160"/>
<path d="M210,160 L250,200 L280,226" fill="none" stroke="#22c55e" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#km10_arr2)"/>
<text x="250" y="180" font-size="11" fill="#22c55e">A: pulls back first → keep order</text>
<path d="M210,160 L300,110 L350,74 L390,120 L430,200 L470,226" fill="none" stroke="#ef4444" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#km10_arr2)"/>
<text x="360" y="130" font-size="11" fill="#ef4444">B: hits daily supply first →</text>
<text x="360" y="146" font-size="11" fill="#ef4444">supply in control, REMOVE order</text>
<line x1="380" y1="210" x2="420" y2="236" stroke="#ef4444" stroke-width="2"/><line x1="420" y1="210" x2="380" y2="236" stroke="#ef4444" stroke-width="2"/>
</svg>`;

// Figure 3: set & forget — move the order to the newest nearest zone; after a loss keep lower zones only with ITF support.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km10_arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Set &amp; forget: the order follows the NEAREST zone</text>
<line x1="30" y1="340" x2="620" y2="120" stroke="#a78bfa" stroke-width="1.6"/>
<text x="540" y="128" font-size="10" fill="#a78bfa">5m trend line</text>
<rect x="120" y="248" width="500" height="20" fill="#22c55e1a" stroke="#22c55e" stroke-dasharray="4 3"/>
<text x="130" y="282" font-size="10" fill="#94a3b8">old order zone</text>
<rect x="290" y="168" width="330" height="20" fill="#22c55e33" stroke="#22c55e" stroke-width="1.6"/>
<text x="300" y="202" font-size="10" fill="#22c55e">new nearer zone → order moves here</text>
<path d="M200,246 C220,210 250,190 286,180" fill="none" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#km10_arr3)"/>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="40,320 80,280 110,290 130,260 160,230 190,250 220,200 250,190 280,150 300,170 330,120 360,100 390,115"/>
<rect x="430" y="220" width="190" height="60" fill="#22c55e14" stroke="#22c55e" stroke-width="1.2" stroke-dasharray="6 4"/>
<text x="612" y="296" font-size="10" text-anchor="end" fill="#22c55e">15m (ITF) zone</text>
<rect x="470" y="244" width="150" height="14" fill="#22c55e33" stroke="#22c55e"/>
<text x="20" y="60" font-size="11" fill="#94a3b8">No time limit, no candle count.</text>
<text x="20" y="76" font-size="11" fill="#94a3b8">If the nearest 5m zone fails: keep a lower 5m order only</text>
<text x="20" y="92" font-size="11" fill="#94a3b8">if it sits inside a 15m zone AND the 15m trend line holds.</text>
</svg>`;

export const KM_10: KevinMedia = {
  n: 10,
  images: [
    {
      src: '/lessons/kevin/10/f-000.jpg',
      caption: '[00:00] Discord, FX Telepath PRO #chat (Dec 20, 2023). Mellow asks: "How long do you usually leave your limit orders sitting? Do you remove them after a specific condition had been met or do you just wait for a certain amount of time?"',
      notes: [
        'This is the question the whole video answers.',
        'Kevin replied that it "will require a video" because it is hard to write out.',
        'An earlier sketch in the channel shows stepped demand boxes under a larger HTF box. His note there: the zone formed before the HTF zone is usually the strongest.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-004.jpg',
      caption: '[00:53] DXY (TVC) four-pane: weekly demand stack 95.677–101.118 with weekly supply 110.668–113.148. 4h supply 102.430–102.803 (red down-arrow). Daily demand 101.531–101.961 (red down-arrow). 1h supply 102.869–103.050.',
      notes: [
        'Context for the "tested" example: the US dollar is falling from the 4h supply toward daily and weekly demand.',
        'The 4h and daily are both marked as downtrends.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-008.jpg',
      caption: '[03:37] DXY four-pane with the 4h zoomed on the supply: the 4h supply (102.430–102.803) formed from a basing area at the top of the drop.',
      notes: ['He uses this 4h supply to show when a zone stops being "fresh".'],
    },
    {
      src: '/lessons/kevin/10/f-009.jpg',
      caption: '[05:26] DXY 4h: price came back into the 102.430–102.803 supply, chopped inside it, dropped, and retested the 102.430 proximal before falling again.',
      notes: [
        'A red candle closed below the zone, but part of it still touched the zone, so it is NOT tested yet.',
        'Only a candle with no wick or body touching makes the zone officially tested.',
        'Shorting back into a tested zone is lower odds, unless the H4 and daily downtrends are with you.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-019.jpg',
      caption: '[09:04] DXY 4h, the same supply after the drawing-tools detour: the 4h downtrend line from above, a red down-arrow, an older peach zone on the left, and price under 102.430.',
      notes: ['The 4h trend is down, which offsets the zone being tested when you look for shorts.'],
    },
    {
      src: '/lessons/kevin/10/f-022.jpg',
      caption: '[12:58] EURUSD 1m (FXCM): an empty rectangle drawn above current price as a hypothetical zone.',
      notes: ['He switches to a blank chart to sketch the confirmation rules instead of using a live setup.'],
    },
    {
      src: '/lessons/kevin/10/f-023.jpg',
      caption: '[12:59] DXY four-pane again: a weekly dotted line at 98.000 inside the weekly demand stack, the 4h supply 102.430–102.803, the daily demand 101.531–101.961, and the 1h supply 102.869–103.050.',
      notes: [
        'The daily demand is where a confirmation long would come from.',
        'The 4h and 1h supplies above are the opposing zones that must not be hit first.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-025.jpg',
      caption: '[13:31] EURUSD 1m sketch: he draws price stair-stepping up from below, dipping into the drawn box, then rallying straight through it.',
      notes: [
        'This illustrates the confirmation timing and distance discussion: what happens to an order when price moves sharply away from, or through, the drawn zone.',
        'An immediate pullback after confirmation is best. The further price runs before pulling back, the less it is a confirmation trade.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-026.jpg',
      caption: '[17:09] AUDUSD 1h (OANDA): green up-arrow, rising 1h trend line, a green 1h demand at about 0.6755–0.6766 sitting on the trend line, and supply above at 0.67877–0.68013.',
      notes: [
        'The set & forget example: a 1h uptrend, looking for 5m longs.',
        'The lower zone is fine because it sits inside the higher-timeframe demand and the real trend line is further back.',
      ],
    },
    {
      src: '/lessons/kevin/10/f-028.jpg',
      caption: '[21:30] WTICOUSD four-pane (OANDA). The weekly has a box drawn around price with dotted lines labelled "3m Proximal" and "3m Distal". The 4h demand is 69.658–70.818 with a red circle at its base, below a broken 4h downtrend line. Daily supplies are 73.351–75.185 and 78.125–80.075. The 1h has supply 74.429–75.075 and demand 71.966–72.510.',
      notes: [
        'He carries a higher-timeframe (3-month) zone down to the weekly as two dotted lines labelled proximal and distal.',
        'Several opposing zones are close to each other here, and each one decides whether an order stays.',
      ],
    },
  ],
  figures: [
    { svg: fig1, caption: 'His "tested" definition on the DXY 4h supply (102.430–102.803): a close below with a wick still in the zone is "being tested". A candle with nothing touching the zone makes it officially tested.' },
    { svg: fig2, caption: 'Confirmation order: keep the H1 confirmation order while price pulls back before reaching the opposing daily supply (A). If the supply is hit first, it is in control and the order is removed (B).' },
    { svg: fig3, caption: 'Set & forget: move the order to each newer, nearer qualified zone while the trend line holds. After a loss, keep lower 5m orders only inside a 15m zone with the 15m trend line intact.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 The question on Discord (FX Telepath PRO): how long to leave limit orders, and whether to remove them by condition or by time.',
        '00:53 DXY four-pane (TVC): weekly demand stack 95.677–101.118, weekly supply 110.668–113.148, 4h supply 102.430–102.803, daily demand 101.531–101.961, 1h supply 102.869–103.050. The 4h and daily have red down-arrows.',
        '03:37–05:26 DXY 4h supply: price chops inside it, closes below with part of the candle still touching (still being tested), then a candle fully outside makes it tested.',
        '08:57–09:06 DXY 4h with the 4h downtrend line: the trend can offset a tested zone for shorts.',
        '12:58–13:31 EURUSD 1m: a blank box as a hypothetical zone, and a drawing of price stair-stepping up and through it, for the confirmation distance and timing rules.',
        '12:59 DXY four-pane: the daily demand under price and the opposing 4h and 1h supplies above, the zones that decide whether a confirmation order stays.',
        '17:09 AUDUSD 1h uptrend (green arrow, rising trend line), 1h demand about 0.6755–0.6766, supply 0.67877–0.68013: the setting for the 5m set & forget example.',
        '21:30 WTICOUSD four-pane: "3m Proximal" and "3m Distal" dotted lines on the weekly, 4h demand 69.658–70.818 under a broken 4h downtrend line, and daily and 1h supplies overhead.',
      ],
    },
  ],
  corrections: [
    'The "US dollar" tested example is DXY (TVC) on the 4h, with the supply at 102.430–102.803. Context on screen: daily demand 101.531–101.961, 1h supply 102.869–103.050, weekly demand 95.677–101.118 and weekly supply 110.668–113.148.',
    'The question came from Mellow on his Discord (FX Telepath PRO, #chat, Dec 20, 2023). He recorded the video the next day.',
    'The AUDUSD set & forget example is set on an AUDUSD 1h (OANDA) uptrend with a rising trend line. The 1h demand is about 0.6755–0.6766 and the supply above is 0.67877–0.68013.',
    'He shows how he carries a higher-timeframe zone onto a lower chart: on the WTI weekly, the 3-month zone appears as two dotted horizontal lines labelled "3m Proximal" and "3m Distal".',
    'The confirmation rules (distance and timing) are drawn on a blank EURUSD 1m chart as a hypothetical box with a hand-drawn price path, not on a live setup.',
  ],
};
