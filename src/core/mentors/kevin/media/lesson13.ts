import type { KevinMedia } from './types';

const F = 'font-family="Inter, system-ui, sans-serif"';

// Figure 1: the look of a zone is graded good / bad / never (his 00:43 sketch and the circled AUDJPY base at 20:24).
const fig1 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">The look of a zone: good, bad, or never (no score out of 10)</text>
<g font-size="12" font-weight="700">
<text x="30" y="56" fill="#22c55e">GOOD</text><text x="236" y="56" fill="#f59e0b">BAD</text><text x="440" y="56" fill="#ef4444">NEVER</text>
</g>
<line x1="218" y1="44" x2="218" y2="320" stroke="#94a3b8" stroke-opacity="0.35"/>
<line x1="422" y1="44" x2="422" y2="320" stroke="#94a3b8" stroke-opacity="0.35"/>
<rect x="58" y="226" width="150" height="26" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<g stroke-width="1.2">
<line x1="40" y1="140" x2="40" y2="240" stroke="#ef4444"/><rect x="33" y="150" width="14" height="80" fill="#ef4444"/>
<line x1="68" y1="224" x2="68" y2="252" stroke="#ef4444"/><rect x="61" y="230" width="14" height="12" fill="#ef4444"/>
<line x1="88" y1="226" x2="88" y2="250" stroke="#22c55e"/><rect x="81" y="230" width="14" height="10" fill="#22c55e"/>
<line x1="110" y1="88" x2="110" y2="240" stroke="#22c55e"/><rect x="103" y="92" width="14" height="144" fill="#22c55e"/>
<line x1="132" y1="64" x2="132" y2="100" stroke="#22c55e"/><rect x="125" y="70" width="14" height="26" fill="#22c55e"/>
</g>
<text x="30" y="276" font-size="10.5" fill="#94a3b8">1–2 candle base,</text>
<text x="30" y="291" font-size="10.5" fill="#94a3b8">large move away.</text>
<text x="30" y="306" font-size="10.5" fill="#94a3b8">A small wick: "whoopty do".</text>
<rect x="262" y="226" width="150" height="26" fill="#f59e0b22" stroke="#f59e0b" stroke-width="1.4"/>
<g stroke-width="1.2">
<line x1="244" y1="140" x2="244" y2="240" stroke="#ef4444"/><rect x="237" y="150" width="14" height="80" fill="#ef4444"/>
<line x1="272" y1="224" x2="272" y2="252" stroke="#ef4444"/><rect x="265" y="230" width="14" height="12" fill="#ef4444"/>
<line x1="294" y1="176" x2="294" y2="240" stroke="#22c55e"/><rect x="287" y="180" width="14" height="56" fill="#22c55e"/>
<line x1="316" y1="140" x2="316" y2="200" stroke="#ef4444"/><rect x="309" y="164" width="14" height="14" fill="#ef4444"/>
<line x1="338" y1="80" x2="338" y2="176" stroke="#22c55e"/><rect x="331" y="86" width="14" height="86" fill="#22c55e"/>
</g>
<circle cx="316" cy="170" r="22" fill="none" stroke="#f59e0b" stroke-width="1.6"/>
<text x="234" y="276" font-size="10.5" fill="#94a3b8">Base and first push fine, but a</text>
<text x="234" y="291" font-size="10.5" fill="#94a3b8">≤50% indecision candle in the</text>
<text x="234" y="306" font-size="10.5" fill="#94a3b8">move away → bad.</text>
<rect x="458" y="190" width="152" height="62" fill="#ef444414" stroke="#ef4444" stroke-width="1.4" stroke-dasharray="5 3"/>
<g stroke-width="1.2">
<line x1="446" y1="150" x2="446" y2="246" stroke="#ef4444"/><rect x="440" y="158" width="12" height="80" fill="#ef4444"/>
<line x1="464" y1="214" x2="464" y2="252" stroke="#22c55e"/><rect x="458" y="222" width="12" height="22" fill="#22c55e"/>
<line x1="480" y1="196" x2="480" y2="244" stroke="#ef4444"/><rect x="474" y="212" width="12" height="20" fill="#ef4444"/>
<line x1="496" y1="190" x2="496" y2="240" stroke="#22c55e"/><rect x="490" y="204" width="12" height="26" fill="#22c55e"/>
<line x1="512" y1="180" x2="512" y2="236" stroke="#22c55e"/><rect x="506" y="190" width="12" height="20" fill="#22c55e"/>
<line x1="528" y1="174" x2="528" y2="230" stroke="#ef4444"/><rect x="522" y="186" width="12" height="22" fill="#ef4444"/>
<line x1="544" y1="120" x2="544" y2="196" stroke="#22c55e"/><rect x="538" y="128" width="12" height="60" fill="#22c55e"/>
<line x1="560" y1="104" x2="560" y2="214" stroke="#ef4444"/><rect x="554" y="116" width="12" height="34" fill="#ef4444"/>
<line x1="576" y1="80" x2="576" y2="160" stroke="#22c55e"/><rect x="570" y="86" width="12" height="62" fill="#22c55e"/>
</g>
<ellipse cx="496" cy="214" rx="46" ry="40" fill="none" stroke="#f59e0b" stroke-width="1.6"/>
<text x="436" y="276" font-size="10.5" fill="#94a3b8">Stair-step base, lots of wicks,</text>
<text x="436" y="291" font-size="10.5" fill="#94a3b8">a wick back into the zone:</text>
<text x="436" y="306" font-size="10.5" fill="#ef4444">"barely even a zone"</text>
<text x="20" y="344" font-size="11" fill="#f59e0b">The look only says good or bad. High or low QUALITY is decided by the HTF zones, the trend and the tests.</text>
</svg>`;

// Figure 2: depth and number of tests (DXY weekly demand 99.571–101.118 at 09:19–11:23).
const fig2 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">Tests: how deep and how many (DXY weekly demand)</text>
<rect x="150" y="190" width="400" height="100" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<g stroke="#22c55e" stroke-opacity="0.6" stroke-dasharray="3 4">
<line x1="150" y1="215" x2="550" y2="215"/><line x1="150" y1="240" x2="550" y2="240"/><line x1="150" y1="265" x2="550" y2="265"/>
</g>
<g font-size="10" fill="#22c55e">
<text x="556" y="194">0% · 101.118</text><text x="556" y="219">25%</text><text x="556" y="244">50%</text><text x="556" y="269">75%</text><text x="556" y="294">100% · 99.571</text>
</g>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,320 70,300 100,312 130,276 152,272 168,200 190,120 220,80 250,110 280,150 300,196 312,206 330,150 360,110 380,160 404,198 418,210 432,170 456,140 474,184 490,204 506,212 516,186"/>
<g fill="#f59e0b" font-size="11" font-weight="700" text-anchor="middle">
<circle cx="312" cy="206" r="4"/><text x="312" y="228">1</text>
<circle cx="418" cy="210" r="4"/><text x="418" y="232">2</text>
<circle cx="506" cy="212" r="4"/><text x="506" y="234">3</text>
</g>
<line x1="536" y1="140" x2="536" y2="150" stroke="#ef4444" stroke-width="1.6"/><rect x="531" y="150" width="10" height="26" fill="#ef4444"/><line x1="536" y1="176" x2="536" y2="278" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="4 3"/>
<text x="150" y="310" font-size="10.5" fill="#ef4444">Red: if a wick tests past 75% → "everything I just said goes out the window".</text>
<g font-size="11" fill="#94a3b8">
<text x="20" y="56">First test: nice rally-base-rally, strong move away → good zone.</text>
<text x="20" y="74">Reacted 1, 2, 3 (almost 4) times → same look, now LOW quality.</text>
<text x="20" y="92">Only ~25% deep each time → a "mid" zone; a deeper pull with a decent LTF zone can still set up.</text>
</g>
<text x="20" y="344" font-size="11" fill="#f59e0b">Weigh: how many tests, how deep, is it fresh, is it just a reaction off a previous zone.</text>
</svg>`;

// Figure 3: GBPJPY overextended - five 1h CP demands in a row (28:04) inside/above the 4h demands (29:37).
const fig3 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">GBPJPY overextended: 5 continuation zones in a row</text>
<g fill="#22c55e22" stroke="#22c55e" stroke-width="1.3">
<rect x="150" y="229" width="300" height="6"/>
<rect x="200" y="190" width="250" height="18"/>
<rect x="250" y="143" width="200" height="20"/>
<rect x="300" y="114" width="150" height="15"/>
<rect x="350" y="84" width="100" height="15"/>
</g>
<g font-size="9" fill="#22c55e" text-anchor="end">
<text x="446" y="226">177.267–177.430</text>
<text x="446" y="203">177.974–178.474</text>
<text x="446" y="158">179.196–179.719</text>
<text x="446" y="126">180.104–180.479</text>
<text x="446" y="97">180.890–181.296</text>
</g>
<g font-size="10" font-weight="700" fill="#f59e0b" text-anchor="middle">
<text x="164" y="247">1</text><text x="214" y="221">2</text><text x="264" y="176">3</text><text x="314" y="142">4</text><text x="364" y="112">5</text>
</g>
<rect x="470" y="155" width="150" height="48" fill="#22c55e14" stroke="#22c55e" stroke-dasharray="6 4"/>
<text x="476" y="172" font-size="10" fill="#22c55e">4h demand</text>
<text x="476" y="186" font-size="10" fill="#22c55e">178.133–179.404</text>
<rect x="470" y="300" width="150" height="17" fill="#22c55e33" stroke="#22c55e" stroke-width="1.4"/>
<text x="476" y="294" font-size="10" fill="#22c55e">4h 175.102–175.545</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,316 70,306 110,312 140,290 152,232 172,236 198,210 204,192 226,196 248,166 254,148 276,150 296,130 304,116 326,120 346,100 356,86 380,90 400,62 420,58 436,64"/>
<path d="M436,64 C470,70 470,180 486,196" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 4"/>
<path d="M486,196 C500,240 520,300 540,304" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5 4"/>
<text x="20" y="40" font-size="10" fill="#22c55e">Green boxes: 1h CP demands</text>
<text x="20" y="56" font-size="11" fill="#94a3b8">W, D, 4h and 1h all up → longs only, but:</text>
<text x="20" y="72" font-size="11" fill="#94a3b8">after 2–3 CPs, usually one final push, then a roll over to a deeper zone.</text>
<g font-size="10.5">
<text x="20" y="276" fill="#22c55e">1h zone embedded in 4h demand → tradable,</text>
<text x="20" y="290" fill="#22c55e">risk a bit less.</text>
<text x="20" y="344" fill="#f59e0b">Full 1–2% only on the deeper pullback with the trend. "I would rather wait for that than chase price and lose."</text>
</g>
</svg>`;

// Figure 4: EURUSD macro confirmation (35:42–38:47): 3M supply → daily supply inside it → 1h confirmation.
const fig4 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" ${F}>
<defs><marker id="km13_arr4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#ef4444"/></marker></defs>
<text x="20" y="24" font-size="14" font-weight="700" fill="#94a3b8">EURUSD: a daily supply inside 3M supply is itself confirmation</text>
<rect x="20" y="44" width="600" height="208" fill="#a78bfa14" stroke="#a78bfa" stroke-dasharray="6 4"/>
<text x="612" y="60" font-size="10.5" text-anchor="end" fill="#a78bfa">3M supply 1.09353–1.14950 (3M downtrend)</text>
<rect x="220" y="164" width="400" height="80" fill="#ef444422" stroke="#ef4444" stroke-width="1.4"/>
<text x="612" y="178" font-size="10.5" text-anchor="end" fill="#ef4444">daily supply 1.09416–1.10070</text>
<rect x="430" y="194" width="190" height="13" fill="#ef444433" stroke="#ef4444" stroke-width="1.4"/>
<text x="426" y="204" font-size="9.5" text-anchor="end" fill="#ef4444">1h supply 1.09724–1.09824</text>
<rect x="330" y="277" width="290" height="20" fill="#22c55e22" stroke="#22c55e" stroke-width="1.4"/>
<text x="612" y="312" font-size="10.5" text-anchor="end" fill="#22c55e">1h demand 1.08991–1.09151 → must be removed</text>
<polyline fill="none" stroke="#94a3b8" stroke-width="1.8" points="30,330 70,322 100,326 130,300 150,312 180,290 210,296 240,270 270,250 290,236 300,224 318,232 336,226 352,238 370,230 388,244 400,236"/>
<path d="M400,236 L420,262 L440,300" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="5 3"/>
<path d="M440,300 L470,206" fill="none" stroke="#ef4444" stroke-width="1.6" stroke-dasharray="5 3"/>
<path d="M470,206 L520,330" fill="none" stroke="#ef4444" stroke-width="1.6" marker-end="url(#km13_arr4)"/>
<g font-size="10.5" fill="#94a3b8">
<text x="30" y="90">Shorts only, if anything: 3M supply in control.</text>
<text x="30" y="106">Set &amp; forget at the 1h supply = "very risky".</text>
<text x="30" y="122">Confirmation: 1h demand removed, then short the 1h supply.</text>
<text x="30" y="138">Longs off the 4h demand = low odds against 3M + daily supply.</text>
</g>
<text x="20" y="352" font-size="11" fill="#f59e0b">If the daily supply breaks instead, fine: then look for longs.</text>
</svg>`;

export const KM_13: KevinMedia = {
  n: 13,
  images: [
    {
      src: '/lessons/kevin/13/f-000.jpg',
      caption: '[00:00] DXY (TVC) "Patreon - June" four-pane. Weekly: supply 110.668–113.148, demand stack from 101.118 down to 95.677. 4h: supply 103.157–103.375, red down-arrow, downtrend line. Daily: demand 101.215–101.789. 1h: supply 103.062–103.272, down-arrow.',
      notes: ['The chart he opens the session on. He uses the DXY weekly demand later as his example of a zone losing quality through repeated tests.'],
    },
    {
      src: '/lessons/kevin/13/f-001.jpg',
      caption: '[00:43] Hand-drawn on a blank DXY 4h: two small base candles and one huge candle away, boxed in green as demand.',
      notes: [
        'The "classic" high-quality zone: tight basing and a large move away.',
        'He agrees only to an extent. You always want the large move away, but the look of the zone is not what makes it high quality.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-006.jpg',
      caption: '[04:16] DXY 4h: supply 103.190–103.375 under a falling trendline, red down-arrow. Price has dropped from it to about 102.25.',
      notes: [
        'With the trend: a supply in a 4h downtrend is higher odds.',
        'A demand in this downtrend is counter-trend and lower odds, however good it looks, unless a weekly demand sits under it.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-011.jpg',
      caption: '[11:23] DXY weekly demand 99.571–101.118 (with 97.685–98.807 and 95.677–97.133 below). Price has wicked into the top of the zone three or four times since late 2022.',
      notes: [
        'Same zone, same look, but every reaction lowers its quality.',
        'The tests only went about 25% in, which makes it a "mid" zone. A wick past 75% would make it worthless.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-013.jpg',
      caption: '[13:50] EURUSD 4h (OANDA): dotted "3m Proximal" at the top, 4h supply 1.10137–1.10538, purple supply 1.09777–1.09982, green up-arrow. 4h demands at 1.08146–1.08475, 1.07450–1.07615 and 1.06960–1.07156.',
      notes: ['The 4h is in an uptrend, but it is rallying straight into higher-timeframe supply (purple and the 3-month proximal).'],
    },
    {
      src: '/lessons/kevin/13/f-016.jpg',
      caption: '[20:24] AUDJPY 4h: he circles a messy stair-step basing area by hand under the purple zone 93.092–93.360.',
      notes: [
        'This is the "never take" look: lots of candles and wicks, stepping up instead of one clean base.',
        'Stair-step basing stays lower quality however many HTF zones stack up behind it.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-017.jpg',
      caption: '[21:01] AUDJPY 4h uptrend (green arrow, rising trendline). Demands 89.090–89.386 and 91.146–91.373, purple 93.092–93.360, then 95.026–95.115 and 96.340–96.622 stacked on a near-vertical run.',
      notes: ['A run of continuation zones one after another: the overextended picture he warns about.'],
    },
    {
      src: '/lessons/kevin/13/f-020.jpg',
      caption: '[24:16] GBPJPY "MACRO" layout (12M, 6M, 3M, 1M), each labelled "<50% Body Candle". 12M has a red X on a zone. 3M: supply 197.707–215.886, demand 120.836–128.836. 6M demand 117.285–129.978. 1M: demand 150.983–155.734, green up-arrow.',
      notes: ['GBPJPY context before the overextension Q&A: the 1M trend is up, and the next major supply is far above.'],
    },
    {
      src: '/lessons/kevin/13/f-026.jpg',
      caption: '[28:04] GBPJPY 1h: five stacked continuation demands (177.267–177.430, 177.974–178.474, 179.196–179.719, 180.104–180.479, 180.890–181.296) with price at 181.9 and a green up-arrow.',
      notes: [
        'W, D, 4h and 1h are all up, so look for longs. But 5 CPs in a row is overextended.',
        'Usually, after 2–3 CPs, price makes one final move and then rolls over to a deeper zone.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-028.jpg',
      caption: '[29:37] GBPJPY 4h demands 178.133–179.404 (two stacked), 176.762–177.148, 175.102–175.545 and 174.306–174.632, with a dotted line at 175.751. Green up-arrow and rising trendline.',
      notes: [
        'Prefer 1h zones embedded inside the 4h demand.',
        'The deeper 4h zone around 175.5 is where he was waiting for full risk.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-031.jpg',
      caption: '[30:48] GBPJPY daily: demands 176.447–177.413 and 174.306–175.769 under a vertical rally. Daily supplies 182.986–184.228 and 187.882–188.816 overhead. Green up-arrow.',
      notes: ['Full 1–2% risk belongs at the daily/deeper demand, the bigger pullback with the trend.'],
    },
    {
      src: '/lessons/kevin/13/f-035.jpg',
      caption: '[32:48] USDJPY four-pane. Weekly supply 146.680–151.946. 4h supply 141.468–142.484, green up-arrow, demands 138.130–138.690 and 136.838–137.204. Daily supply 140.825–142.255. 1h demand 140.470–140.717 on a rising trendline.',
      notes: [
        'This is his "biggest trades that month" example: an H1 zone embedded inside fresh 4h demand after an overextended run, 5:1 with no drawdown.',
        'Price has now reached daily and 4h supply.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-041.jpg',
      caption: '[35:42] EURUSD 3M (MACRO layout): supplies 1.54170–1.60388, 1.35030–1.39936, 1.22503–1.28878 and a purple 3M supply 1.09353–1.14950 under a long falling trendline. Price is pushing into the purple zone.',
      notes: ['Three-month supply in control and a three-month downtrend: shorts only, if anything.'],
    },
    {
      src: '/lessons/kevin/13/f-042.jpg',
      caption: '[35:55] EURUSD macro four-pane. 12M: a callout "12m Demand in control", with "LONG TARGET" and "SHORT TARGET" lines. 6M demand 0.96635–1.04150 with a red down-arrow. 3M purple supply 1.09353–1.14950. 1M purple supply from 1.10626 up, 1M demand 0.96315–0.99947.',
      notes: ['This is the "tricky" picture: 3M and 1M supply on top, while 12M and 6M demand are also in play.'],
    },
    {
      src: '/lessons/kevin/13/f-046.jpg',
      caption: '[38:24] EURUSD four-pane. Weekly: dotted "3m Distal" and "3m Proximal" (1.10657), demand 1.04833–1.07023, "TARGET" at 1.00084. 4h: purple 1.09777–1.09982, supply 1.10137–1.10538. Daily: purple supply 1.09416–1.10070. 1h: purple supply 1.09724, demands 1.08991–1.09151 and 1.08146–1.08434, rising trendline.',
      notes: [
        'The daily supply under the 3-month supply is itself a confirmation zone.',
        'Ways in: set & forget at the 1h supply ("very risky"), or wait for the 1h demand to be removed and short the 1h supply.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-050.jpg',
      caption: '[40:01] XAGUSD (silver) 4h: demand 23.10120–23.21137 and a steep rising trendline. Price is now back up near 24.19.',
      notes: ['The silver demand price did not quite reach. He contrasts it with a nearby zone he "would never have taken, very poor quality".'],
    },
    {
      src: '/lessons/kevin/13/f-061.jpg',
      caption: '[48:12] NATGASUSD four-pane. Weekly: supply 3.028–3.520, demand 1.780–2.114, dotted "6m Proximal" around 2.54 and "6m Distal" at 1.414. 4h demands 2.246–2.289 and 2.030–2.070, purple 1.989–2.039. Daily supply 2.498–2.619. 1h demand 2.424–2.448, up-arrow.',
      notes: [
        'Price is inside the 6-month zone and pushing into daily supply.',
        'His plan: wait for the daily supply to be removed, then look for 1h confirmation.',
      ],
    },
    {
      src: '/lessons/kevin/13/f-065.jpg',
      caption: '[52:45] USDCHF four-pane. Weekly demand 0.87035–0.88158. 4h: stacked supplies 0.90112–0.90736, down-arrow, demand 0.88344–0.88588. Daily supplies 0.90136–0.90604 and 0.91272–0.91968. 1h supply 0.90051–0.90258 under a falling trendline.',
      notes: ['No weekly or daily zone is in control at the current price, so he is not trading it.'],
    },
    {
      src: '/lessons/kevin/13/f-066.jpg',
      caption: '[56:47] AUDUSD daily: purple demand 0.66419–0.66856 above a hollow purple outline (an old level), grey zone 0.64583–0.65172, a broken daily downtrend line, and a strong rally to about 0.688.',
      notes: ['The purple daily demand that S/R traders saw as "support" held with barely any drawdown. S/R sellers were stopped out into the banks\' buys.'],
    },
    {
      src: '/lessons/kevin/13/f-069.jpg',
      caption: '[58:08] USDCAD daily: supply 1.33019–1.33549, red down-arrow, demands 1.31391–1.31992 and 1.29539–1.30194. A hollow purple box marks the obvious "support" range above the demand.',
      notes: ['The obvious support level has fresh demand below it. He expects at least 1.33 from there and doesn\'t mind being wrong, because of his 3:1–5:1 R:R.'],
    },
  ],
  figures: [
    { svg: fig1, caption: 'How he grades the look of a zone: good (1–2 candle base plus a large move away, as in his 00:43 sketch), bad (an indecision candle in the move away), never (stair-step, wicky basing like the circled AUDJPY base). Quality then comes from the higher timeframes.' },
    { svg: fig2, caption: 'The DXY weekly demand 99.571–101.118 split into 0/25/50/75/100% lines. Three to four shallow (~25%) tests leave the look unchanged but turn the zone low quality. A wick past 75% puts it out.' },
    { svg: fig3, caption: 'GBPJPY 1h: five continuation demands stacked on an overextended run. Take 1h zones embedded in the 4h demand (178.133–179.404) at reduced risk, and keep full risk for the deeper 4h/daily pullback (about 175.1–175.5).' },
    { svg: fig4, caption: 'EURUSD macro confirmation: the daily supply 1.09416–1.10070 sits inside the 3M supply 1.09353–1.14950. Short the 1h supply after the 1h demand 1.08991–1.09151 is removed. If the daily supply breaks, switch to longs.' },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '00:00 DXY four-pane: weekly supply 110.668–113.148 and a demand stack from 101.118 down, 4h supply 103.157–103.375 in a downtrend, daily demand 101.215–101.789, 1h supply 103.062–103.272.',
        '00:43 Hand sketch on a blank DXY 4h: two small base candles and one huge candle away, boxed green. This is the "classic" quality zone he only partly agrees with.',
        '03:24–06:46 DXY 4h: supply 103.190–103.375 under the trendline and demands 101.304–101.485 and 100.473–100.685. Used to explain trend: supply with the downtrend is higher odds, demand is counter-trend.',
        '09:19–11:23 DXY weekly demand 99.571–101.118, wicked into three to four times: the "same look, lower quality" test example.',
        '13:50 EURUSD 4h uptrend rallying into purple supply 1.09777–1.09982 and 4h supply 1.10137–1.10538, under a dotted 3-month proximal.',
        '14:44–18:35 NATGAS four-pane: daily supply 2.458–2.619 with the 6-month proximal running through it, 4h demand 2.246–2.284, 1h demand 2.424–2.448.',
        '20:24–23:26 AUDJPY 4h: a circled stair-step base (the "never" look) and a run of stacked continuation demands up to 96.340–96.622.',
        '24:16–25:55 GBPJPY MACRO layout (12M/6M/3M/1M, "<50% Body Candle"): 3M supply 197.707–215.886, 1M demand 150.983–155.734 with an up-arrow.',
        '27:37–27:46 EURGBP: a clean four-pane, then the daily supply 0.86011–0.86361 in a downtrend. This is the pair of his "dead demand zone" mistake.',
        '28:04–34:50 GBPJPY 1h: five stacked CP demands (177.267 up to 181.296). 4h demands 178.133–179.404 down to 174.306–174.632. Daily demands 176.447–177.413 and 174.306–175.769 under supply 182.986–184.228.',
        '31:19–32:48 USDJPY: 1h demand 140.470–140.717 on a rising trendline (his embedded-zone winner), 4h supply 141.468–142.484, daily supply 140.825–142.255, weekly supply 146.680–151.946.',
        '35:15–39:30 EURUSD: 1h purple supply 1.09724–1.09824 under a falling trendline, 3M supply 1.09353–1.14950, the macro four-pane ("12m Demand in control", LONG/SHORT TARGET lines), and daily purple supply 1.09416–1.10070 under the 3m proximal 1.10657.',
        '40:01 XAGUSD 4h demand 23.10120–23.21137 with a steep trendline.',
        '40:14–48:12 NATGAS: daily supply 2.498–2.619 at the 6m proximal, 1h demands 2.424–2.448 down to 2.194–2.201, 4h purple 1.989–2.039 above demand 1.904–1.971, and the weekly with "6m Proximal"/"6m Distal 1.414".',
        '51:22–52:45 USDCHF: stacked 4h supplies 0.90112–0.90736, weekly demand 0.87035–0.88158 far below. No zone in control, so skip.',
        '56:47–57:43 AUDUSD daily: purple demand 0.66419–0.66856 that held, and the rally away from it.',
        '57:53–58:08 USDCAD daily: supply 1.33019–1.33549, demand 1.31391–1.31992 under a hollow purple "support" box.',
      ],
    },
  ],
  corrections: [
    'The tests example is the DXY (TVC) weekly demand at 99.571–101.118, with further weekly demands at 97.685–98.807 and 95.677–97.133. Price had wicked into its top three to four times.',
    'His "classic good zone" is drawn by hand at 00:43: two small base candles and one huge candle away, inside a green box.',
    'The "stair-step / never take" basing is circled by hand on an AUDJPY 4h chart, under a purple zone at 93.092–93.360.',
    'The GBPJPY overextension is visible on screen: five 1h CP demands (177.267–177.430, 177.974–178.474, 179.196–179.719, 180.104–180.479, 180.890–181.296) and 4h demands 178.133–179.404 and 175.102–175.545. This matches the notes on "179.719" and "175.545".',
    'The USDJPY embedded-zone winner is the 1h demand 140.470–140.717 on a rising trendline. On screen, the 4h demands are 138.130–138.690 and 136.838–137.204, and price has since reached 4h supply 141.468–142.484 and daily supply 140.825–142.255.',
    'EURUSD macro: his 3M chart shows the purple 3M supply as 1.09353–1.14950 under a long 3M downtrend line. The daily confirmation supply is 1.09416–1.10070, the 1h supply 1.09724–1.09824 and the 1h demand to be removed 1.08991–1.09151. His 12M panel is annotated "12m Demand in control".',
    'Natural gas: on the weekly the 6-month zone is shown as two dotted lines, "6m Proximal" (about 2.54) and "6m Distal" (1.414). The daily supply he wants removed is 2.498–2.619.',
    'He marks trend direction with green up-arrows and red down-arrows on each pane, uses purple for the key zone he is focused on, and puts "<50% Body Candle" on the macro charts to help spot basing candles.',
  ],
};
