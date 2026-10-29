import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: the three day-trading sequences as he lays them out (entry / higher / curve), from his two-chart layouts.
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km12_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs>
<text x="20" y="26" font-size="14" font-weight="700" fill="#94a3b8">Day-trading sequences: curve → higher → entry</text>
<text x="150" y="58" font-size="11" font-weight="700" fill="#a78bfa" text-anchor="middle">CURVE (HTF+1)</text>
<text x="300" y="58" font-size="11" font-weight="700" fill="#f59e0b" text-anchor="middle">HIGHER TF (zone)</text>
<text x="450" y="58" font-size="11" font-weight="700" fill="#22c55e" text-anchor="middle">ENTRY TF</text>
<g font-size="13" font-weight="700" text-anchor="middle">
<rect x="105" y="72" width="90" height="34" rx="6" fill="#a78bfa22" stroke="#a78bfa"/><text x="150" y="94" fill="#a78bfa">1W</text>
<rect x="255" y="72" width="90" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="300" y="94" fill="#f59e0b">H4</text>
<rect x="405" y="72" width="90" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="450" y="94" fill="#22c55e">15m</text>
<rect x="105" y="138" width="90" height="34" rx="6" fill="#a78bfa22" stroke="#a78bfa"/><text x="150" y="160" fill="#a78bfa">1D</text>
<rect x="255" y="138" width="90" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="300" y="160" fill="#f59e0b">H1</text>
<rect x="405" y="138" width="90" height="34" rx="6" fill="#22c55e22" stroke="#22c55e" stroke-width="2"/><text x="450" y="160" fill="#22c55e">5m</text>
<rect x="105" y="204" width="90" height="34" rx="6" fill="#a78bfa22" stroke="#a78bfa"/><text x="150" y="226" fill="#a78bfa">H4</text>
<rect x="255" y="204" width="90" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="300" y="226" fill="#f59e0b">15m</text>
<rect x="405" y="204" width="90" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="450" y="226" fill="#22c55e">1m</text>
</g>
<g stroke="#94a3b8" stroke-width="1.4" marker-end="url(#km12_arr1)">
<line x1="197" y1="89" x2="251" y2="89"/><line x1="347" y1="89" x2="401" y2="89"/>
<line x1="197" y1="155" x2="251" y2="155"/><line x1="347" y1="155" x2="401" y2="155"/>
<line x1="197" y1="221" x2="251" y2="221"/><line x1="347" y1="221" x2="401" y2="221"/>
</g>
<g font-size="10.5" fill="#94a3b8">
<text x="505" y="86">check every 15–20 min</text><text x="505" y="100">may hold overnight</text>
<text x="505" y="152" fill="#22c55e">his pick: every 5–10 min</text><text x="505" y="166">"good middle ground"</text>
<text x="505" y="218">must watch constantly</text><text x="505" y="232">out in ~10–15 min</text>
</g>
<line x1="20" y1="262" x2="620" y2="262" stroke="#94a3b8" stroke-opacity="0.4"/>
<text x="20" y="284" font-size="11" fill="#94a3b8">Entry above 15m = intraday swing.  1m = borderline scalping.  Seconds charts (1s–30s) = extreme scalping: stay away.</text>
<text x="20" y="304" font-size="11" fill="#94a3b8">On screen: two charts side by side, the higher timeframe on the left and the entry timeframe on the right</text>
<text x="20" y="320" font-size="11" fill="#94a3b8">(EURUSD D|5m, 4h|15m, 1h|5m, 15m|1m).</text>
<text x="20" y="344" font-size="11" fill="#f59e0b">Price is fractal: only the number of trades and the reaction speed change.</text>
</svg>`;

// Figure 2: EURUSD 15m top-down plan with the zones he drew (prices from the chart at 19:32 and the H4 at 29:51).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">EURUSD 15m plan under H4 supply</text>
<rect x="20" y="40" width="600" height="98" fill="#ef444414" stroke="#ef4444" stroke-dasharray="6 4"/>
<text x="612" y="56" font-size="10.5" text-anchor="end" fill="#ef4444">H4 supply 1.07774–1.08014 (in control)</text>
<rect x="200" y="152" width="420" height="18" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="148" font-size="10.5" text-anchor="end" fill="#ef4444">15m supply 1.07692–1.07738</text>
<rect x="232" y="200" width="388" height="14" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="196" font-size="10.5" text-anchor="end" fill="#ef4444">15m supply 1.07567–1.07604</text>
<rect x="20" y="280" width="600" height="20" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="316" font-size="10.5" text-anchor="end" fill="#22c55e">15m demand 1.07334–1.07385 (counter-trend)</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,190 60,150 90,118 115,170 135,206 160,170 180,112 192,150 200,165 212,158 222,206 232,210 244,250 262,238 280,262 300,244 318,266 336,250 352,244"/>
<g font-size="10" fill="#a78bfa">
<circle cx="90" cy="118" r="3.5" fill="#a78bfa"/><text x="70" y="108">high</text>
<circle cx="135" cy="206" r="3.5" fill="#a78bfa"/><text x="104" y="222">low</text>
<circle cx="180" cy="112" r="3.5" fill="#a78bfa"/><text x="152" y="102">higher high</text>
<line x1="125" y1="206" x2="300" y2="206" stroke="#a78bfa" stroke-dasharray="3 3"/>
<text x="24" y="250">low broken → downtrend</text>
</g>
<g font-size="11">
<text x="400" y="232" fill="#ef4444" font-weight="700">Shorts: with H4 → e.g. 1%</text>
<text x="400" y="262" fill="#22c55e" font-weight="700">Longs: no real reason → 0.25–0.75%</text>
</g>
<text x="20" y="344" font-size="11" fill="#94a3b8">1) trend on 15m  2) draw 15m zones  3) check the H4 (15m's HTF)  4) drop to 1m inside the 15m supply</text>
</svg>`;

// Figure 3: the 1m supply embedded in the 15m supply (19:51 / 21:02) and the two ways in.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km12_arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">1m entry inside the 15m supply (1.07567–1.07604)</text>
<text x="20" y="50" font-size="12" font-weight="700" fill="#f59e0b">A · Set &amp; forget</text>
<rect x="20" y="70" width="290" height="70" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<rect x="60" y="88" width="250" height="24" fill="#a78bfa33" stroke="#a78bfa" stroke-width="1.4"/>
<text x="66" y="104" font-size="10" fill="#a78bfa">1m supply 1.07574–1.07586</text>
<text x="302" y="66" font-size="10" text-anchor="end" fill="#ef4444">15m distal 1.07604</text>
<text x="302" y="154" font-size="10" text-anchor="end" fill="#ef4444">15m proximal 1.07567</text>
<line x1="60" y1="112" x2="310" y2="112" stroke="#22c55e" stroke-width="1.4" stroke-dasharray="5 3"/>
<text x="24" y="132" font-size="10" fill="#22c55e">sell limit on 1m proximal</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,300 70,250 100,270 140,200 170,220 200,130 214,104 230,170 260,250 290,300"/>
<text x="20" y="330" font-size="10.5" fill="#94a3b8">Order sits before price arrives.</text>
<text x="20" y="346" font-size="10.5" fill="#94a3b8">Bigger R:R, no confirmation.</text>
<line x1="320" y1="44" x2="320" y2="350" stroke="#94a3b8" stroke-opacity="0.35"/>
<text x="340" y="50" font-size="12" font-weight="700" fill="#f59e0b">B · Confirmation</text>
<rect x="340" y="70" width="280" height="70" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="66" font-size="10" text-anchor="end" fill="#ef4444">15m supply</text>
<rect x="430" y="228" width="190" height="18" fill="#22c55e22" stroke="#22c55e" stroke-dasharray="5 3"/>
<text x="438" y="266" font-size="10" fill="#22c55e">1m demand removed</text>
<line x1="350" y1="300" x2="500" y2="160" stroke="#a78bfa" stroke-width="1.4"/>
<text x="352" y="318" font-size="10" fill="#a78bfa">1m up-trendline → broken</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="350,296 380,250 400,262 430,226 450,236 480,150 492,100 500,120 510,116 520,190 536,262 552,272"/>
<rect x="496" y="112" width="124" height="14" fill="#ef444444" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="106" font-size="9.5" text-anchor="end" fill="#ef4444">new 1m supply</text>
<path d="M552,272 L572,190 L588,128" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="5 3"/>
<path d="M588,128 L606,300" fill="none" stroke="#ef4444" stroke-width="1.6" marker-end="url(#km12_arr3)"/>
<text x="340" y="346" font-size="10.5" fill="#94a3b8">Wait for contact, then the removal, then sell the pullback.</text>
</svg>`;

export const KM_12: KevinMedia = {
  n: 12,
  images: [
    {
      src: '/lessons/kevin/12/f-001.jpg',
      caption: '[00:01] EURUSD (OANDA) two-chart layout: daily on the left, 5m on the right. No drawings yet. His macro and watchlist panel is on the right side.',
      notes: [
        'This is the day-trader layout he recommends: higher timeframe on one side, entry timeframe on the other.',
        'He changes the pair of timeframes on this same layout for each sequence.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-002.jpg',
      caption: '[08:55] TradingView interval menu open on the seconds group (1s, 5s, 10s, 15s, 30s). The 5m chart behind has a small supply drawn at 1.07491–1.07505.',
      notes: [
        'Seconds charts are what he calls extreme scalping. Stay away from them.',
        'Even 1m is borderline scalping. His favourites are starred: 5m, 15m, 1h, 4h, 1D, 1W.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-009.jpg',
      caption: '[09:57] Sequence 1, H4 → 15m: EURUSD 4h on the left, EURUSD 15m on the right, with the symbol watermark switched on.',
      notes: [
        'This is for traders who can check the chart every 15–20 minutes.',
        'A 15m entry is the highest day-trading entry. Trades can run overnight, so it is really intraday swing.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-011.jpg',
      caption: '[10:54] Sequence 2, H1 → 5m: EURUSD 1h on the left, EURUSD 5m on the right.',
      notes: [
        'His choice if he started day trading tomorrow. You check every 5–10 minutes.',
        'If you are away 30 minutes, that is 6 candles on the 5m against 30 on the 1m.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-015.jpg',
      caption: '[12:03] Sequence 3, 15m → 1m: EURUSD 15m on the left, EURUSD 1m on the right.',
      notes: [
        'Most trades, but you have to be on the charts all the time.',
        'A 1m zone can form, pull back and hit TP in minutes.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-017.jpg',
      caption: '[14:20] EURUSD 15m and 1m. A green 1m demand is drawn at 1.07479–1.07484 under the latest push up.',
      notes: [
        'This shows how small and fast 1m zones are. The whole zone is about half a pip.',
        'If you miss a 1m zone, never chase it because the candle is about to close.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-019.jpg',
      caption: '[19:32] EURUSD 15m top-down example: two 15m supplies at 1.07692–1.07738 and 1.07567–1.07604, and a 15m demand at 1.07334–1.07385. Price is chopping near 1.0749 after the drop.',
      notes: [
        'Step 1, trend: high, low, higher high, then the low broke. He calls it a downtrend, though not a clean one.',
        'Step 2: draw the significant 15m zones, two supplies above and one demand below.',
        'With the downtrend, the supplies are the higher-odds side and the demand is counter-trend.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-020.jpg',
      caption: '[19:51] EURUSD 1m inside the 15m supply (peach, 1.07567–1.07604). A purple 1m supply at 1.07574–1.07586 sits inside it.',
      notes: [
        'Step 4: drop to the entry timeframe inside the HTF zone.',
        'Option A: set & forget a sell at the 1m supply embedded in the 15m supply.',
        'He draws the embedded lower-timeframe zone in purple inside the peach HTF zone.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-022.jpg',
      caption: '[21:02] Side by side: the 15m with both supplies and the demand on the left, and the 1m zoomed in on the 15m supply and its purple 1m zone on the right.',
      notes: [
        'Option B: wait for price to contact the 15m supply, then look for 1m confirmation (1m demand and trendlines removed) before shorting.',
        'He calls it "15m confirmation coming off H4 supply".',
      ],
    },
    {
      src: '/lessons/kevin/12/f-023.jpg',
      caption: '[21:03] Same layout with the 1m zoomed out. Price is still below both 15m supplies, and the 1m is making higher lows into them.',
      notes: [
        'The 1m rally runs straight into the 15m supply: the exact spot where you either have a set & forget order or start watching for confirmation.',
      ],
    },
    {
      src: '/lessons/kevin/12/f-025.jpg',
      caption: '[29:51] His own "Patreon - June" four-chart layout for EURUSD (W, 4h, D, 1h). Weekly: "<50% Body Candle" label, dotted "3m Proximal" at 1.10657, weekly demand 1.04833–1.07023. 4h: supply 1.07774–1.08014, green up-arrow and rising trendline. Daily: purple supply 1.09416–1.10070, demand 1.04833–1.06044. 1h: up-arrow, demands 1.06901–1.06978, 1.06618–1.06684, 1.06352–1.06528.',
      notes: [
        'This is the chart link members keep open to avoid day trading against his HTF zones.',
        'The 15m supplies in the day-trading example sit just under this 4h supply (1.07774–1.08014): the HTF zone in control for the short idea.',
        'Price is also inside the weekly demand, which is why he sizes the trade by multiple sequence analysis rather than going all in.',
      ],
    },
  ],
  figures: [
    { svg: fig1, caption: 'The three day-trading sequences with the third, "curve" timeframe above each: H4 → 15m, H1 → 5m (his pick) and 15m → 1m. Each is shown on screen as a two-chart layout, HTF left and entry right.' },
    { svg: fig2, caption: 'The EURUSD 15m plan as drawn: a downtrend (high, low, higher high, low broken), two 15m supplies and one 15m demand, all under the H4 supply 1.07774–1.08014. Shorts get normal risk; counter-trend longs get 0.25–0.75%.' },
    { svg: fig3, caption: 'Two ways into the 15m supply on the 1m: A, a set & forget sell at the purple 1m supply (1.07574–1.07586) embedded in it; B, wait for contact, let the 1m demand and up-trendline break, then sell the pullback to the new 1m supply.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:01 EURUSD two-chart layout (daily | 5m), the day-trader setup: higher timeframe on one side, entry timeframe on the other.',
        '08:55 The interval menu on the seconds charts (1s–30s), his "extreme scalping" warning. The 5m behind shows a small supply at 1.07491–1.07505.',
        '09:04–09:57 The layout switched to 4h | 15m for the H4 → 15m sequence, with the symbol watermark turned on so viewers can see which timeframe is which.',
        '10:54–11:58 1h | 5m for the H1 → 5m sequence, his recommended middle ground.',
        '12:03–14:20 15m | 1m for the 15m → 1m sequence. A 1m demand at 1.07479–1.07484 shows how tiny and fast 1m zones are.',
        '19:32 EURUSD 15m: two supplies (1.07692–1.07738, 1.07567–1.07604) above price near 1.0749 and a demand (1.07334–1.07385) below. The trend is read as a downtrend.',
        '19:51–21:03 EURUSD 1m: a purple 1m supply at 1.07574–1.07586 embedded inside the peach 15m supply 1.07567–1.07604, shown side by side with the 15m.',
        '29:51 His own Patreon four-chart layout (W, 4h, D, 1h): 4h supply 1.07774–1.08014 above the 15m zones, weekly demand 1.04833–1.07023 with a dotted "3m Proximal" at 1.10657, and a daily purple supply at 1.09416–1.10070.',
      ],
    },
  ],
  corrections: [
    'The pair used for every sequence and the top-down example is EURUSD (OANDA). The layouts on screen are D | 5m, 4h | 15m, 1h | 5m and 15m | 1m, always with the higher timeframe on the left.',
    'The zones from the 15m example: supplies at 1.07692–1.07738 and 1.07567–1.07604, demand at 1.07334–1.07385. The 1m supply for the set & forget option, at 1.07574–1.07586, is drawn in purple inside the 15m supply.',
    'The H4 supply that puts the 15m supplies in control is 1.07774–1.08014 on his own four-chart layout. That H4 chart still has a green up-arrow and a rising trendline, so the short idea comes from the H4 supply, not from an H4 downtrend.',
    'His own layout is labelled "Patreon - June". The order is weekly top-left, 4h top-right, daily bottom-left, 1h bottom-right. The weekly carries a "<50% Body Candle" label and a dotted "3m Proximal" line.',
  ],
};
