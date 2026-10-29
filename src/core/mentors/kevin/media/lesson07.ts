import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: the natural gas stack exactly as he overlays it on the H4 chart (6M zone > weekly zone > H4 zones).
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km7_arr1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">NATGASUSD H4 — three timeframes on one chart</text>
<rect x="20" y="96" width="600" height="230" fill="#f59e0b1a" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="6 4"/>
<text x="600" y="112" font-size="11" text-anchor="end" fill="#f59e0b">6M (MSA) demand — widest box</text>
<rect x="20" y="132" width="600" height="160" fill="#22c55e14" stroke="#22c55e" stroke-width="1.2"/>
<text x="600" y="148" font-size="11" text-anchor="end" fill="#22c55e">Weekly (HTF) demand</text>
<rect x="206" y="200" width="150" height="16" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<text x="210" y="230" font-size="10" fill="#94a3b8">Rally Base Rally Demand (CP demand)</text>
<rect x="196" y="262" width="250" height="22" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<text x="200" y="300" font-size="10" fill="#94a3b8">Drop Base Rally Demand (PV demand)</text>
<rect x="178" y="190" width="10" height="26" fill="#f59e0b55" stroke="#f59e0b"/>
<text x="140" y="186" font-size="10" fill="#f59e0b">basing candle</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.6" points="40,120 70,160 95,150 120,210 150,230 172,250 190,284 205,200 230,150 260,172 290,160 320,205 350,195 380,250 405,280 425,268 450,210 480,190 510,120 540,62 560,80 585,110 600,125"/>
<circle cx="190" cy="284" r="4" fill="#22c55e"/>
<circle cx="405" cy="280" r="4" fill="#22c55e"/>
<text x="400" y="340" font-size="10" fill="#94a3b8">price returns to the H4 PV demand and rallies</text>
<path d="M545,250 L545,130" stroke="#f59e0b" stroke-width="1.6" marker-end="url(#km7_arr1)"/>
<text x="470" y="270" font-size="11" fill="#f59e0b">3-TF confluence = full risk</text>
</svg>`;

// Figure 2: the MSA ladder he describes (each HTF treated as an entry timeframe, then its HTF).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km7_arr2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#a78bfa"/></marker></defs>
<text x="20" y="26" font-size="14" font-weight="700" fill="#94a3b8">Building the sequence: ETF → HTF → MSA</text>
<g font-size="12" text-anchor="middle">
<text x="120" y="64" fill="#94a3b8" font-weight="700">Entry TF</text><text x="320" y="64" fill="#94a3b8" font-weight="700">HTF (MTA)</text><text x="520" y="64" fill="#94a3b8" font-weight="700">MSA TF</text>
</g>
<g font-size="13" text-anchor="middle" font-weight="600">
<rect x="70" y="80" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="120" y="102" fill="#22c55e">1m</text>
<rect x="270" y="80" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="320" y="102" fill="#22c55e">15m</text>
<rect x="470" y="80" width="100" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="520" y="102" fill="#f59e0b">H4</text>
<rect x="70" y="130" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="120" y="152" fill="#22c55e">5m</text>
<rect x="270" y="130" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="320" y="152" fill="#22c55e">H1</text>
<rect x="470" y="130" width="100" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="520" y="152" fill="#f59e0b">Daily</text>
<rect x="70" y="180" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="120" y="202" fill="#22c55e">15m</text>
<rect x="270" y="180" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="320" y="202" fill="#22c55e">H4</text>
<rect x="470" y="180" width="100" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="520" y="202" fill="#f59e0b">Weekly</text>
<rect x="70" y="230" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="120" y="252" fill="#22c55e">H1</text>
<rect x="270" y="230" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="320" y="252" fill="#22c55e">Daily</text>
<rect x="470" y="230" width="100" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="520" y="252" fill="#f59e0b">Monthly</text>
<rect x="70" y="280" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="120" y="302" fill="#22c55e">H4</text>
<rect x="270" y="280" width="100" height="34" rx="6" fill="#22c55e22" stroke="#22c55e"/><text x="320" y="302" fill="#22c55e">Weekly</text>
<rect x="470" y="280" width="100" height="34" rx="6" fill="#f59e0b22" stroke="#f59e0b"/><text x="520" y="302" fill="#f59e0b">6M (NG example)</text>
</g>
<g stroke="#a78bfa" stroke-width="1.5">
<line x1="172" y1="97" x2="266" y2="97" marker-end="url(#km7_arr2)"/><line x1="372" y1="97" x2="466" y2="97" marker-end="url(#km7_arr2)"/>
<line x1="172" y1="147" x2="266" y2="147" marker-end="url(#km7_arr2)"/><line x1="372" y1="147" x2="466" y2="147" marker-end="url(#km7_arr2)"/>
<line x1="172" y1="197" x2="266" y2="197" marker-end="url(#km7_arr2)"/><line x1="372" y1="197" x2="466" y2="197" marker-end="url(#km7_arr2)"/>
<line x1="172" y1="247" x2="266" y2="247" marker-end="url(#km7_arr2)"/><line x1="372" y1="247" x2="466" y2="247" marker-end="url(#km7_arr2)"/>
<line x1="172" y1="297" x2="266" y2="297" marker-end="url(#km7_arr2)"/><line x1="372" y1="297" x2="466" y2="297" marker-end="url(#km7_arr2)"/>
</g>
<text x="320" y="342" font-size="11" text-anchor="middle" fill="#94a3b8">Zone on all three = most risk. Missing the MSA zone = 0.25–0.5% only.</text>
</svg>`;

// Figure 3: EURUSD low-quality example (H1 demand with no daily demand under it) and the daily-to-5m hold plan.
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km7_arr3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#f59e0b"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">EURUSD daily — where is the H1 demand?</text>
<rect x="300" y="52" width="320" height="38" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="66" font-size="10" text-anchor="end" fill="#ef4444">Daily supply ≈1.0948–1.1007</text>
<rect x="190" y="262" width="430" height="44" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="300" font-size="10" text-anchor="end" fill="#22c55e">Daily demand ≈1.055–1.062</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.6" points="20,330 60,250 90,200 120,130 150,170 175,240 195,300 220,250 250,150 280,90 300,60 320,80 345,140 370,170 390,185"/>
<rect x="372" y="180" width="248" height="10" fill="#22c55e33" stroke="#22c55e" stroke-width="1.2"/>
<text x="400" y="176" font-size="10" fill="#22c55e">H1 demand 1.0702–1.0714</text>
<text x="400" y="212" font-size="11" fill="#ef4444">No daily demand here → no MSA confluence</text>
<text x="400" y="228" font-size="11" fill="#ef4444">→ 5m entry at very low risk only</text>
<path d="M230,262 L250,240 L262,250 L285,215 L298,225 L320,180 L335,190 L360,130 L380,110" fill="none" stroke="#f59e0b" stroke-width="1.6" stroke-dasharray="5 4" marker-end="url(#km7_arr3)"/>
<text x="40" y="96" font-size="11" fill="#f59e0b">Plan he describes: long at daily demand,</text>
<text x="40" y="112" font-size="11" fill="#f59e0b">H1 demand inside it, 5m entries,</text>
<text x="40" y="128" font-size="11" fill="#f59e0b">re-enter on 5m all the way to daily supply</text>
</svg>`;

export const KM_07: KevinMedia = {
  n: 7,
  images: [
    {
      src: '/lessons/kevin/07/f-000.jpg',
      caption: '[00:00] NATGASUSD H4 (OANDA): the weekly demand is the yellow band, with three green H4 demand zones inside it — a Rally Base Rally (CP demand) and the lower Drop Base Rally (PV demand). The orange box marks the basing candle.',
      notes: [
        'Opening setup: H4 zones drawn inside a higher-timeframe (weekly) demand.',
        'He labels every zone by its formation and its role: "CP" (continuation pattern) or "PV" demand.',
        'The lowest H4 DBR zone was hit again in early May and price rallied from it.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-002.jpg',
      caption: '[02:56] NATGASUSD weekly: after the 2022 collapse from about 10, a yellow weekly demand at about 1.9–2.2. A Rally Base Drop supply (PV supply) is labelled just above it.',
      notes: [
        'This is the HTF zone in the MTA step. Next he asks why it should hold.',
        'Labels on the weekly: Rally Base Drop Supply (PV SUPPLY), Rally Base Rally Demand (CP demand), Drop Base Rally Demand (PV demand).',
      ],
    },
    {
      src: '/lessons/kevin/07/f-004.jpg',
      caption: '[03:27] NATGASUSD 6-month chart, zoomed out: the 2005–2008 spikes up to about 15, and current price back near the lows around 2.',
      notes: ['He goes ABOVE the weekly to the 6M ("macro") chart: this is the MSA step.'],
    },
    {
      src: '/lessons/kevin/07/f-006.jpg',
      caption: '[03:35] NATGASUSD 6M, zoomed in: the yellow 6M demand at about 1.9–2.2 sits under the last big red 6M candle. The labels mirror the weekly ones (RBR CP demand, DBR PV demand, RBD PV supply).',
      notes: [
        'Basing candle plus big stay-away candles on the 6M give the macro demand.',
        'The weekly demand sits inside this 6M demand, so the weekly zone has a reason to hold.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-008.jpg',
      caption: '[04:20] NATGASUSD H4 with all three timeframes overlaid: a peach 6M zone (widest, about 1.9–2.25), the weekly zone inside it, and the green H4 demands inside both.',
      notes: [
        'This is what three-timeframe confluence looks like on the entry chart.',
        'H4 demand inside weekly demand inside 6M demand. This is where he applies the most risk and holds through repeated H4 losses for one large win.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-013.jpg',
      caption: '[06:15] EURUSD H4 (FXCM): a weekly demand drawn as two nested green boxes (about 1.0223–1.0385, inner band 1.0290–1.0339). A blue curved arrow traces price back down to it.',
      notes: [
        'The low-quality example: an H4 zone inside this weekly demand is fine but low quality.',
        'There is no reason shown for the weekly demand to hold (no 3-month zone checked), so the risk is 0.25–0.5%.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-015.jpg',
      caption: '[06:39] EURUSD weekly 2017–2023: the weekly demand (about 1.022–1.038) formed in Nov 2022 after the rally off the 0.95 low.',
      notes: ['He shows the weekly zone as a single isolated HTF zone, with nothing above it in the sequence.'],
    },
    {
      src: '/lessons/kevin/07/f-019.jpg',
      caption: '[07:14] NATGASUSD weekly with the 6M zone (peach band, about 1.45–2.3) behind the weekly yellow demand. The RBD PV supply is about 3.0.',
      notes: ['Back to the good example: the weekly zone is clearly inside the 6M zone, unlike EURUSD.'],
    },
    {
      src: '/lessons/kevin/07/f-021.jpg',
      caption: '[07:26] EURUSD H1 (OANDA): a clean H1 downtrend from about 1.10 to 1.07 in May 2023.',
      notes: ['He sets up the 5m day-trade example here: 5m entry, H1 HTF, daily MSA.'],
    },
    {
      src: '/lessons/kevin/07/f-023.jpg',
      caption: '[08:23] EURUSD daily: the only zone where price is now is the thin green H1 demand (about 1.0702–1.0714). No daily demand is drawn under current price.',
      notes: [
        'No daily (MSA) demand where price is means no MSA confluence for a 5m long.',
        'If he took it, the risk would be very low.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-024.jpg',
      caption: '[08:41] EURUSD H1: the H1 demand at 1.0702–1.0714 is near price, while the daily demand (about 1.0551–1.0636) sits far below it.',
      notes: [
        'The daily zone exists, but not where the H1 zone is.',
        'If the H1 demand were inside the daily demand it would be higher odds.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-025.jpg',
      caption: '[08:42] EURUSD H1, zoomed out: the green H1 demand at the bottom of the downtrend (1.07018–1.07139).',
      notes: ['An H1 demand formed in a downtrend with no daily support under it: a low-risk-only setup.'],
    },
    {
      src: '/lessons/kevin/07/f-027.jpg',
      caption: '[11:50] EURUSD daily: daily supply about 1.0948–1.1007 (red) above and daily demand about 1.0551–1.0616 (green) below, with price falling between them.',
      notes: [
        'The "hold" idea: get long at the daily demand, find an H1 demand inside it, enter on the 5m.',
        'Keep finding 5m entries to hold the whole move toward the daily supply. Big R:R, modest win rate.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-028.jpg',
      caption: '[12:41] NATGASUSD 6M, homework recap: the 6M demand is drawn as a wide peach box (about 1.45–2.25) from the 2020 low. The yellow weekly zone and its labels sit inside it.',
      notes: [
        'Screenshot 3 of the homework: the MSA-timeframe zone, labelled.',
        'The 6M box is drawn much wider than the weekly box, and the weekly sits in its upper part.',
      ],
    },
    {
      src: '/lessons/kevin/07/f-031.jpg',
      caption: '[12:59] NATGASUSD H4, recap: the H4 entry zones inside the weekly band inside the 6M band. The same overlay as 04:20.',
      notes: ['Homework screenshots 1 and 2: the entry-timeframe zone and the HTF zone, each labelled with its timeframe.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'How he shows MSA on the entry chart: the 6M zone (dashed, widest) contains the weekly zone, which contains the H4 RBR (CP) and DBR (PV) demands. Price returned to the H4 PV demand and rallied.' },
    { svg: fig2, caption: 'The sequences he lists. Each HTF is treated as an entry timeframe, and its own HTF becomes the MSA timeframe. For the H4/weekly natural gas trade he used the 6M chart.' },
    { svg: fig3, caption: 'EURUSD daily: the H1 demand at 1.0702–1.0714 has no daily demand under it, so it is low risk only. His preferred plan is to buy at the daily demand and re-enter on the 5m toward the daily supply.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 NATGASUSD H4 (OANDA): three green H4 demands inside a yellow weekly band, labelled "Rally Base Rally Demand (CP Demand)" and "Drop Base Rally Demand (PV Demand)", with the basing candle boxed in orange.',
        '02:56 Weekly: the 2022 fall from about 10 into the weekly demand at about 1.9–2.2, with a Rally Base Drop "PV SUPPLY" labelled just above at about 3.0.',
        '03:27–03:35 6M chart: he zooms out to the 2005–2008 highs, then in on the last 6M candles. The 6M demand sits at the same price as the weekly zone.',
        '04:20 Back on H4 he overlays all three: a peach 6M band, a yellow weekly band inside it, and the green H4 zones inside both.',
        '05:44–06:52 EURUSD H4 then weekly (FXCM): a weekly demand about 1.022–1.038 from Nov 2022 drawn as two nested boxes. He draws a curved arrow for price returning to it. There is no zone above it, so this is low quality.',
        '07:14 NATGAS weekly again with the 6M band behind it, as a contrast to EURUSD.',
        '07:26–08:42 EURUSD H1 downtrend with an H1 demand at 1.0702–1.0714. The daily chart shows no demand there; the nearest daily demand is far below at about 1.055–1.063. That means no MSA confluence and very low risk.',
        '11:50 EURUSD daily: demand about 1.055–1.062 and supply about 1.095–1.101. The plan is to buy the daily demand via H1 and 5m entries and hold toward the daily supply.',
        '12:41–12:59 NATGAS 6M and H4 recap for the homework: three labelled screenshots, one per timeframe.',
      ],
    },
  ],
  corrections: [
    'The natural gas weekly chart labels BOTH a Drop Base Rally demand (PV demand) and a Rally Base Rally demand (CP demand) at the zone, plus a Rally Base Drop supply (PV supply) above. The notes only call the weekly zone a drop-base-rally.',
    'The H4 entry zones in the natural gas example are a Rally Base Rally (CP demand) and a lower Drop Base Rally (PV demand), plus a third, higher green H4 zone. Price returned to the lower PV demand in early May and rallied.',
    'The 6M (MSA) zone is drawn as a much wider box (about 1.45–2.25) than the weekly zone (about 1.9–2.2). On the H4 chart he overlays it as a separate peach band behind the yellow weekly band.',
    'EURUSD 5m example: the H1 demand was at 1.0702–1.0714, and the nearest daily demand was about 1.055–1.063, well below price. That is why there was no MSA confluence.',
    'The EURUSD daily hold idea uses a daily demand at about 1.055–1.062 and a daily supply at about 1.095–1.101.',
    'The EURUSD weekly zone for the low-quality example is about 1.022–1.038 (drawn as two nested boxes, inner 1.029–1.034), formed in Nov 2022.',
  ],
};
