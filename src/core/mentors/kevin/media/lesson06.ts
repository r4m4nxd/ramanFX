import type { KevinMedia } from './types';

// Lesson 6 (Entry, Stop Loss & Take Profit): enrichment from the key frames of his video.
// Charts: NATGASUSD 4h/15m (OANDA, Mar–May 2023) and hypothetical zones with TradingView's Long Position tool on EURUSD 4h.

const F = '/lessons/kevin/06/';

export const KM_06: KevinMedia = {
  n: 6,
  images: [
    {
      src: F + 'f-001_t00m56s.jpg',
      caption: '[00:56] NATGASUSD 4h (OANDA): the yellow weekly demand band (about 1.90–2.165) with three H4 demands inside it: two "Rally Base Rally Demand (CP Demand)" zones and the "Drop Base Rally Demand (PV Demand)" at about 1.905–1.958.',
      notes: [
        'The same setup as lesson 4. Here he uses the bottom PV demand to show where the entry and stop go.',
      ],
    },
    {
      src: F + 'f-003_t01m34s.jpg',
      caption: '[01:34] Long Position tool on the PV demand: entry at the top (proximal) of the zone, stop just under the bottom (distal, red tag 1.899), profit box up to about 2.205.',
      notes: [
        'The tool is sized to the zone: entry on the proximal line, stop on the distal line, then a buffer added.',
      ],
    },
    {
      src: F + 'f-004_t01m43s.jpg',
      caption: '[01:43] He marks the entry line on the proximal edge and the stop line under the distal edge (also the bottom of the weekly band), then draws a big X below the zone.',
      notes: [
        'The X is the "trade is void" area: once price closes through the zone, the zone is broken and the setup is gone. So the stop sits just past it.',
      ],
    },
    {
      src: F + 'f-007_t02m11s.jpg',
      caption: '[02:11] Sketch on a hypothetical green demand: price chops inside the zone several times, one final dip pokes just below the bottom edge, then price shoots straight up.',
      notes: [
        'Why the stop gets a little extra room: price sometimes peeks just through the zone before it goes.',
      ],
    },
    {
      src: F + 'f-009_t02m49s.jpg',
      caption: '[02:49] Long Position tool dropped on a test demand (NATGAS scale): stop 0.051 (51 ticks), default Risk/Reward Ratio 2.82 before he adjusts anything.',
      notes: [
        'How he uses the tool: drag the entry to the proximal line and the stop to the distal line first, then set the target.',
      ],
    },
    {
      src: F + 'f-011_t03m17s.jpg',
      caption: '[03:17] EURUSD 4h, test demand (about 1.0580–1.0622): the tool reads "Stop: 0.00402 (0.38%) 40.2" pips with entry on the proximal and stop on the distal line.',
      notes: [
        'The 40.2 is the stop size in pips, which equals the zone height. It is not a price.',
      ],
    },
    {
      src: F + 'f-014_t04m13s.jpg',
      caption: '[04:13] After adding the spread: "Stop: 0.00416 … 41.6" pips, Risk/Reward Ratio 3, "Target: 0.01247 … 124.7" pips.',
      notes: [
        'Entry about one pip above the proximal line, stop about one pip below the distal line. With a 3:1 target the TP is 124.7 pips away.',
        'This is his 25% portion: a fixed 3:1 order.',
      ],
    },
    {
      src: F + 'f-016_t04m32s.jpg',
      caption: '[04:32] Same 41.6-pip stop with the target dragged much higher: Risk/Reward Ratio 6.71, target 279.1 pips.',
      notes: [
        'The runner idea: the other 75% is held toward a higher-timeframe opposing zone, which can be many R away.',
      ],
    },
    {
      src: F + 'f-019_t05m00s.jpg',
      caption: '[05:00] He writes "50%" next to the proximal line of the test demand.',
      notes: [
        'The split entry: half the position at the proximal line, half deeper (halfway into the zone).',
      ],
    },
    {
      src: F + 'f-021_t05m47s.jpg',
      caption: '[05:47] NATGASUSD 4h, March 2023: "Rally Base Drop Supply (PV SUPPLY)" at about 2.945–3.010 at the spike top, and a second supply at about 2.68–2.72 under it.',
      notes: [
        'The supply zones above the natural gas demand. These are the opposing zones a long runner would head toward.',
      ],
    },
    {
      src: F + 'f-024_t06m25s.jpg',
      caption: '[06:25] Dropped to the 15m inside that H4 PV supply: a thin 15m zone at about 2.993–3.004 sits at the very top (distal side) of the H4 zone.',
      notes: [
        'Zone within the zone: a lower-timeframe zone inside the HTF zone gives a much tighter entry and stop than the full H4 zone.',
      ],
    },
    {
      src: F + 'f-026_t06m53s.jpg',
      caption: '[06:53] NATGAS 4h long from the PV demand with a deeper entry (about 1.939): stop 0.038 (38 ticks) at 1.901, target 2.082, "Closed P&L 0.143", Risk/Reward Ratio 3.76.',
      notes: [
        'Entering inside the zone instead of at the proximal line shrinks the stop and raises the R:R toward the same target.',
      ],
    },
    {
      src: F + 'f-030_t07m40s.jpg',
      caption: '[07:40] He draws a double arrow over the whole height of the yellow weekly band and sketches choppy price beside it.',
      notes: [
        'Context for take profit: inside the weekly demand price can chop, and the bigger move is the run out of the band.',
      ],
    },
    {
      src: F + 'f-031_t08m09s.jpg',
      caption: '[08:09] Zoomed out NATGAS 4h: the weekly demand band at the bottom (April–May demands) and the March supplies at about 2.70 and 3.00 above. Price has already rallied to about 2.60.',
      notes: [
        'The full picture for the runner: from the PV demand the next opposing zones are the ~2.70 supply, then the ~3.00 PV supply.',
      ],
    },
    {
      src: F + 'f-036_t08m56s.jpg',
      caption: '[08:56] Same PV demand, entry at the proximal line (about 1.962): stop 0.060 (60 ticks) at about 1.902, target about 2.103, Closed P&L 0.143, Risk/Reward Ratio 2.38.',
      notes: [
        'Compare with 06:53: about the same target, but the proximal entry has a larger stop, so the R:R is 2.38 instead of 3.76.',
      ],
    },
    {
      src: F + 'f-042_t10m20s.jpg',
      caption: '[10:20] Final recap on the PV demand: a short black line just above the proximal edge (entry) and one just below the distal edge (stop).',
      notes: [
        'The basic method in one picture: enter a hair before the zone, stop a hair beyond it.',
      ],
    },
  ],
  figures: [
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><defs><marker id="km6_ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#94a3b8"/></marker></defs><text x="20" y="20" font-size="13" fill="#94a3b8" font-weight="600">His Long Position tool on a demand zone</text><rect x="180" y="32" width="440" height="20" fill="#ef444422" stroke="#ef4444" stroke-width="1.2"/><text x="186" y="46" font-size="10" fill="#ef4444" font-weight="600">next HTF supply: 75% runner target</text><rect x="40" y="230" width="380" height="40" fill="#22c55e22" stroke="#22c55e" stroke-width="1.2"/><text x="46" y="264" font-size="10" fill="#22c55e" font-weight="600">demand</text><rect x="180" y="75" width="150" height="150" fill="#22c55e22"/><rect x="180" y="225" width="150" height="50" fill="#ef444422"/><line x1="180" y1="225" x2="330" y2="225" stroke="#94a3b8" stroke-width="1.5"/><line x1="180" y1="275" x2="330" y2="275" stroke="#ef4444" stroke-width="1.5"/><line x1="180" y1="75" x2="330" y2="75" stroke="#22c55e" stroke-width="1.5"/><polyline points="20,110 60,190 80,165 110,236 125,273 140,240 160,252 178,232 200,192 220,206 250,122 270,142 300,80" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/><line x1="255" y1="72" x2="255" y2="56" stroke="#94a3b8" stroke-width="1.4" marker-end="url(#km6_ah)"/><circle cx="125" cy="273" r="6" fill="none" stroke="#f59e0b" stroke-width="1.4"/><text x="60" y="292" font-size="10" fill="#f59e0b">a peek through</text><text x="340" y="80" font-size="11" fill="#22c55e" font-weight="600">TP1 at 3:1: close 25%</text><text x="340" y="95" font-size="10" fill="#94a3b8">tool: target 124.7 pips</text><text x="430" y="222" font-size="11" fill="#94a3b8">entry ≈1 pip above proximal</text><text x="430" y="290" font-size="11" fill="#ef4444">stop ≈1 pip below distal</text><text x="430" y="250" font-size="10" fill="#94a3b8">zone only: stop 40.2 pips</text><text x="430" y="264" font-size="10" fill="#94a3b8">with spread: stop 41.6 pips</text><text x="20" y="330" font-size="11" fill="#94a3b8">Zone broken = trade void, so the stop sits just beyond the distal line, with a little extra room.</text><text x="20" y="346" font-size="11" fill="#94a3b8">On the runner he moves the stop under each new demand that forms.</text></svg>`,
      caption: 'The basic method as he sets it on the TradingView tool: entry about one pip above the proximal line, stop about one pip below the distal line (40.2 → 41.6 pips on his EURUSD example), 25% closed at 3:1 (124.7 pips) and 75% held toward the next HTF supply.',
    },
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><text x="20" y="24" font-size="13" fill="#94a3b8" font-weight="600">NATGAS 4h PV demand: same target, two entries</text><rect x="20" y="80" width="600" height="232" fill="#f59e0b22" stroke="#f59e0b" stroke-width="1"/><text x="24" y="94" font-size="10" fill="#f59e0b" font-weight="600">weekly demand ≈1.90–2.165</text><rect x="110" y="98" width="510" height="31" fill="#22c55e22" stroke="#22c55e" stroke-width="1"/><rect x="110" y="155" width="510" height="31" fill="#22c55e22" stroke="#22c55e" stroke-width="1"/><text x="114" y="182" font-size="9" fill="#22c55e">CP demand</text><text x="114" y="125" font-size="9" fill="#22c55e">CP demand</text><rect x="110" y="262" width="510" height="46" fill="#22c55e22" stroke="#22c55e" stroke-width="1.2"/><text x="114" y="304" font-size="9" fill="#22c55e" font-weight="600">PV demand ≈1.905–1.958</text><polyline points="20,120 50,170 75,148 110,235 140,212 175,283 182,295 192,262 215,215 235,175 252,190 268,140" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/><rect x="300" y="135" width="120" height="123" fill="#22c55e22"/><rect x="300" y="258" width="120" height="53" fill="#ef444422"/><line x1="300" y1="258" x2="420" y2="258" stroke="#94a3b8" stroke-width="1.5"/><line x1="300" y1="311" x2="420" y2="311" stroke="#ef4444" stroke-width="1.5"/><line x1="300" y1="135" x2="420" y2="135" stroke="#22c55e" stroke-width="1.5"/><text x="360" y="205" font-size="22" fill="#94a3b8" font-weight="700" text-anchor="middle">A</text><rect x="460" y="153" width="120" height="125" fill="#22c55e22"/><rect x="460" y="278" width="120" height="34" fill="#ef444422"/><line x1="460" y1="278" x2="580" y2="278" stroke="#94a3b8" stroke-width="1.5"/><line x1="460" y1="312" x2="580" y2="312" stroke="#ef4444" stroke-width="1.5"/><line x1="460" y1="153" x2="580" y2="153" stroke="#22c55e" stroke-width="1.5"/><text x="520" y="220" font-size="22" fill="#94a3b8" font-weight="700" text-anchor="middle">B</text><text x="20" y="332" font-size="11" fill="#94a3b8"><tspan font-weight="700">A</tspan> proximal entry 1.962 · stop 1.902 (60) · target 2.103 → R:R 2.38</text><text x="20" y="348" font-size="11" fill="#22c55e"><tspan font-weight="700">B</tspan> deeper entry 1.939 · stop 1.901 (38) · target 2.082 → R:R 3.76</text></svg>`,
      caption: 'The two natural gas trades he shows on the same PV demand: the proximal entry (A, R:R 2.38) and a deeper entry inside the zone (B, R:R 3.76). Both closed at about the same 2.08–2.10 target. A deeper entry gives a smaller stop and a better R:R, but price may not fill it.',
    },
    {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" font-family="Inter, system-ui, sans-serif"><text x="20" y="24" font-size="13" fill="#94a3b8" font-weight="600">Split entry</text><rect x="40" y="170" width="250" height="80" fill="#22c55e22" stroke="#22c55e" stroke-width="1.2"/><line x1="40" y1="170" x2="290" y2="170" stroke="#94a3b8" stroke-width="2"/><line x1="40" y1="210" x2="290" y2="210" stroke="#94a3b8" stroke-width="1.6" stroke-dasharray="6 4"/><line x1="40" y1="258" x2="290" y2="258" stroke="#ef4444" stroke-width="1.6"/><text x="44" y="160" font-size="12" fill="#94a3b8" font-weight="700">50% at proximal</text><text x="48" y="205" font-size="11" fill="#94a3b8">50% halfway into the zone</text><text x="44" y="274" font-size="11" fill="#ef4444">one stop, below distal</text><text x="40" y="300" font-size="10" fill="#94a3b8">Tighter average entry, higher R:R.</text><text x="40" y="314" font-size="10" fill="#94a3b8">If price only taps the top, half the size.</text><line x1="320" y1="40" x2="320" y2="330" stroke="#94a3b8" stroke-width="0.6" stroke-dasharray="3 4"/><text x="340" y="24" font-size="13" fill="#94a3b8" font-weight="600">Zone within the zone (NATGAS)</text><rect x="370" y="100" width="250" height="130" fill="#ef444422" stroke="#ef4444" stroke-width="1.2"/><rect x="380" y="112" width="240" height="22" fill="#f59e0b22" stroke="#f59e0b" stroke-width="1.4"/><polyline points="340,320 352,250 360,180 366,100 372,108 376,96 382,104 386,240 392,300 400,290 410,330" fill="none" stroke="#94a3b8" stroke-width="1.8" stroke-linejoin="round"/><text x="396" y="127" font-size="10" fill="#f59e0b" font-weight="600">15m zone ≈2.993–3.004</text><text x="396" y="222" font-size="10" fill="#ef4444" font-weight="600">H4 PV supply ≈2.945–3.010</text><line x1="380" y1="134" x2="620" y2="134" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="5 4"/><line x1="380" y1="94" x2="620" y2="94" stroke="#ef4444" stroke-width="1.2"/><text x="520" y="88" font-size="10" fill="#ef4444" text-anchor="middle">stop above the zone</text><text x="430" y="260" font-size="10" fill="#94a3b8">Short from the 15m zone:</text><text x="430" y="274" font-size="10" fill="#94a3b8">a fraction of the H4 stop,</text><text x="430" y="288" font-size="10" fill="#94a3b8">same downside target.</text><text x="20" y="346" font-size="11" fill="#94a3b8">Two ways to tighten the entry. Both have pros and cons, so test them.</text></svg>`,
      caption: 'Two entry refinements he shows. Left: his "50%" split, with half at the proximal line and half halfway in. Right: zone within the zone on the NATGAS H4 PV supply, where a thin 15m zone at the top of the H4 zone allows a much tighter short.',
    },
  ],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:00–01:05] NATGASUSD 4h (OANDA): the yellow weekly demand band (about 1.90–2.165) with two CP demands and the PV demand (about 1.905–1.958) from lessons 3–4.',
        '[01:34–01:52] Long Position tool on the PV demand: entry on the proximal line, stop just under the distal line (1.899). He draws the entry and stop lines and puts an X below the zone, where the trade is void.',
        '[02:11] Sketch: price chops inside a zone, peeks just below it, then rips. This is why the stop gets a little extra room.',
        '[02:39–02:49] He opens the TradingView position tools (Long/Short Position) and drops one on a test demand; the default reads R:R 2.82.',
        '[03:08–04:13] EURUSD 4h test demand: a stop of 40.2 pips on the zone alone becomes 41.6 pips after adding the spread. At R:R 3 the target is 124.7 pips.',
        '[04:32] He drags the target up to R:R 6.71 (279.1 pips) to show the runner idea.',
        '[04:51–05:00] He writes "50%" at the proximal line for the split entry.',
        '[05:38–06:25] NATGAS March 2023 supplies: the PV supply at about 2.945–3.010 and a supply at about 2.70. On the 15m, a thin zone at about 2.993–3.004 sits at the top of the H4 PV supply (zone within the zone).',
        '[06:53] PV demand long with a deeper entry (about 1.939), stop 38 ticks, target 2.082, closed at R:R 3.76.',
        '[07:12–08:46] He circles reactions at the CP and PV demands, arrows the full height of the weekly band, and zooms out to show the ~2.70 and ~3.00 supplies above as runner targets.',
        '[08:56] The same long with a proximal entry (about 1.962), stop 60 ticks, target about 2.103, closed at R:R 2.38.',
        '[10:20] Recap: entry line just above the proximal edge, stop line just below the distal edge.',
      ],
    },
  ],
  corrections: [
    'The "40.2" on his EURUSD example is the stop distance in pips shown on the TradingView Long Position tool (0.00402 = the zone height), not a price. After adding the spread to both sides the tool reads a 41.6-pip stop. The notes\' "about 41.2" is only approximate. At 3:1 the target is 124.7 pips.',
    'The R:R tool numbers on screen: the default drop reads 2.82; the 3:1 version is his 25% order; dragging the target to the higher zone shows 6.71 (279.1 pips) for the runner.',
    'The natural gas demand trade is shown twice with about the same target (2.08–2.10). With the entry at the proximal line (about 1.962, 60-tick stop) it closed at R:R 2.38. With a deeper entry inside the zone (about 1.939, 38-tick stop) it closed at R:R 3.76. This puts numbers on "a deeper or split entry raises R:R".',
    'The zone-within-zone example on screen is a SUPPLY: NATGAS 4h "Rally Base Drop Supply (PV SUPPLY)" at about 2.945–3.010, with a 15m zone at about 2.993–3.004 at its top (distal) end. It is not the H4 demand example.',
    'The opposing zones above the natural gas long are labelled on the 4h chart: a supply at about 2.70 and the PV supply at about 3.00, both from the early-March 2023 spike. The runner "toward roughly 3" passes the ~2.70 supply first.',
    'The stop on the natural gas long (1.899–1.902) sits just below both the PV demand\'s distal line and the bottom of the yellow weekly band. The X he draws below it marks where the trade is void.',
  ],
};
