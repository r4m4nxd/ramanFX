import type { KevinZoomMedia } from './types';

// Sunday live, 16 Aug 2026: frames from his recording. The fresh homework chart is AUDUSD 1D (FXCM), with
// "Treating as ATH" / "Treating as ATL" lines where usable data starts.

const F = '/lessons/kevin_zoom/2026-08-16/';

export const KZ_2026_08_16: KevinZoomMedia = {
  date: '2026-08-16',
  images: [
    {
      src: F + 'f-002_t01m36s.jpg',
      caption: '[01:36] His labelled zone diagram, with a big red candle followed straight away by a big green candle drawn next to it.',
      notes: [
        'The rare no-basing case: an explosive drop then an explosive rally. Act as if there is basing there and draw the zone a similar size to your other zones.',
      ],
    },
    {
      src: F + 'f-004_t03m13s.jpg',
      caption: '[03:13] Labelled trendline diagram ("Peak", "Valley", "Higher High"), with an arrow along the steep run-up for comparison.',
      notes: [
        'A steep move with no real pullbacks is momentum. A trendline needs a significant, obvious peak and valley, then the higher high.',
      ],
    },
    {
      src: F + 'f-007_t05m39s.jpg',
      caption: '[05:39] AUDUSD 1D fresh chart: "Treating as ATH" and "Treating as ATL" lines, and a box around the first supply\'s basing.',
      notes: [
        'The starting all-time high was removed by an explosive move. The basing had two sections; he uses only the most recent one so the zone is not too big.',
      ],
    },
    {
      src: F + 'f-008_t06m27s.jpg',
      caption: '[06:27] Sketch on the chart: price stepping up through small highs to a horizontal line at the top.',
      notes: [
        'An all-time high does not have to be an obvious peak. Every wick or high that price breaks above is an all-time high.',
      ],
    },
    {
      src: F + 'f-011_t08m52s.jpg',
      caption: '[08:52] Arrow at the one candle that gets close to a move away after the next all-time high.',
      notes: [
        'Not big enough next to the real moves away; everything else is boo-boo basing. No demand removed that high, so the analysis ends there.',
      ],
    },
    {
      src: F + 'f-014_t11m18s.jpg',
      caption: '[11:18] Two small arrows at a close peak and valley that he decides is good enough for a trendline.',
      notes: [
        'Borderline: he usually does not like a line drawn off wicks, and the other candidate nearby he rejected. Both were close calls.',
      ],
    },
    {
      src: F + 'f-016_t12m54s.jpg',
      caption: '[12:54] Arrow at the move under the red supply that removed two demand zones and an all-time low.',
      notes: [
        '"Pretty strong zone", yet it later failed, most likely because it was very old with no liquidity trap before it.',
      ],
    },
    {
      src: F + 'f-017_t13m43s.jpg',
      caption: '[13:43] Long arrow to the two-candle basing behind the explosive move that removed the all-time high (rule 3).',
      notes: [
        'The zone was already removed, so he places the remove box where it was removed rather than extending it.',
      ],
    },
    {
      src: F + 'f-019_t15m20s.jpg',
      caption: '[15:20] Arrow along the downtrend line to the borderline demand (about 94 pips) he kept on the chart.',
      notes: [
        'Close, so he compared it with the other zones and kept it. That zone removed the downtrend line on a full close above it.',
      ],
    },
    {
      src: F + 'f-045_t36m19s.jpg',
      caption: '[36:19] A student\'s labelled chart: "Trend line" along the lows, a red "Momentum" line on the steep leg, and a downtrend line on the right.',
      notes: [
        'Concept right (peak, valley, higher high), but the line is not attached to anything. It must touch the valley: "take pride in our work".',
      ],
    },
    {
      src: F + 'f-054_t43m35s.jpg',
      caption: '[43:35] A student\'s chart: a long loop drawn from a zone out to the right edge.',
      notes: [
        '"Just because it\'s used doesn\'t mean we end it." Extend each zone to where it was removed. Zones drawn too small get removed too early and break the chain.',
      ],
    },
    {
      src: F + 'f-069_t55m41s.jpg',
      caption: '[55:41] Back on his AUDUSD 1D: a loop around the borderline zone many students drew and he does not have.',
      notes: [
        'Remove it and copy his supply exactly; the distal line matters because it decides when the zone was removed. Next homework: Jan 1994 to Jan 1995.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-03:30] Recap diagrams: the labelled zone (with the no-basing red/green case drawn beside it) and the labelled peak / valley / higher-high trendline.',
        '[05:00-17:30] Fresh AUDUSD 1D (FXCM) chart: ATH/ATL lines, the first supply from the latest basing section, every wick as an all-time high, a borderline trendline, the strong supply, the rule-3 zone and the 94-pip borderline demand.',
        '[19:00-55:00] Student homework (light and dark themes), then the zone to remove and the next homework.',
      ],
    },
  ],
  corrections: [
    'The fresh homework chart is AUDUSD 1D from FXCM (shown in the header), with "Treating as ATH" and "Treating as ATL" lines at the start of usable data; the notes only called it "homework chart".',
  ],
};
