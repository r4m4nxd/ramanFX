import type { KevinZoomMedia } from './types';

// Sunday live, 30 Aug 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM), January 1995 to January 1996.

const F = '/lessons/kevin_zoom/2026-08-30/';

export const KZ_2026_08_30: KevinZoomMedia = {
  date: '2026-08-30',
  images: [
    {
      src: F + 'f-002_t01m28s.jpg',
      caption: '[01:28] AUDUSD 1D recap of last week: circles on the demand that removed a trendline, the supply that removed a trendline, and the demand that removed a supply and made an all-time high.',
      notes: [
        'Every zone on the chart answers "what did it remove?"',
      ],
    },
    {
      src: F + 'f-004_t02m56s.jpg',
      caption: '[02:56] The first downtrend line from the top, slid down to the next highest point so wicks do not poke above it.',
      notes: [
        'An obvious peak and valley plus a lower low. From the highest point it cut through candles, so it moves to the next highest point.',
        'Then price got way overextended, so the line simply ends.',
      ],
    },
    {
      src: F + 'f-007_t05m08s.jpg',
      caption: '[05:08] Measuring candidate supplies: the TradingView measure tool on a small move away near the top of the chart.',
      notes: [
        'He usually judges by eye; when it is close he measures (74, 63, 93 with the wick, 85) and takes the one with the better move away.',
      ],
    },
    {
      src: F + 'f-010_t07m20s.jpg',
      caption: '[07:20] A long arrow along the candles under the removed downtrend line.',
      notes: [
        'Rule 2 says there MIGHT be a zone. Every candle below that line is a small basing candle, so there is no demand.',
      ],
    },
    {
      src: F + 'f-011_t08m04s.jpg',
      caption: '[08:04] Channel tool on the new downtrend line; his curve shows price hovering at the bottom of the channel.',
      notes: [
        'Hovering around the channel bottom is fine. A massive sell-off away from the line is what makes it overextended.',
      ],
    },
    {
      src: F + 'f-012_t08m48s.jpg',
      caption: '[08:48] Circles on the recent peak, valley, peak and lower low used to draw the trendline peak to peak.',
      notes: [
        'Among many small swings, pick the recent obvious peak and valley that led to a lower low.',
      ],
    },
    {
      src: F + 'f-013_t09m32s.jpg',
      caption: '[09:32] A mark at a very explosive move that removed nothing.',
      notes: [
        'He is debating a future rule for moves away about 4 to 5 times the basing, followed by another explosive candle. Not a rule yet: do not add these to the chain.',
      ],
    },
    {
      src: F + 'f-017_t12m28s.jpg',
      caption: '[12:28] An arrow at the candle that finally closed above the downtrend line, above the green demand.',
      notes: [
        'The earlier candle\'s wick still touched the line, so the line goes on the next candle with nothing touching.',
        'The basing of that demand sat at the line (touching its wick counts), so this demand removed both downtrend lines.',
      ],
    },
    {
      src: F + 'f-018_t13m12s.jpg',
      caption: '[13:12] Sketch of the updated uptrend line: after a new high, draw from the next valley.',
      notes: [
        'Let the old line cut through candles until it breaks or a new high forms; then the updated line is the one he wants to see.',
      ],
    },
    {
      src: F + 'f-027_t19m48s.jpg',
      caption: '[19:48] A student\'s chart: two downtrend lines and a circle at the demand sitting right at the line.',
      notes: [
        '"That was a zone." When the basing is at the downtrend line, that demand still counts as the one that removed it.',
      ],
    },
    {
      src: F + 'f-042_t30m48s.jpg',
      caption: '[30:48] A student\'s AUDUSD 1D with "ATH" marked and the note "Did not draw this trendline because it was to Flat for a trendline"; Kevin circles the supply.',
      notes: [
        '"What do you mean, too flat? It\'s an obvious peak and valley." Flatness is not a reason to skip a line with a clear peak and valley.',
      ],
    },
    {
      src: F + 'f-045_t33m00s.jpg',
      caption: '[33:00] A student\'s chart: a question mark under a zone that did not accomplish anything, and an arrow up and away.',
      notes: [
        '"Highly recommend you having the rules, because you drew a zone that did not accomplish anything."',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-14:30] Homework on AUDUSD 1D (FXCM), 1995: recap of last week\'s zones, the downtrend line slid off the wicks and ended, measured supply candidates, no demand under the broken line, the channel check, the very explosive move that removed nothing, the demand at the line that removed both trendlines, and the updated uptrend line.',
        '[15:00-43:00] Student homework (light and dark themes), with "ATH" marked and notes such as "too flat".',
        '[44:30-50:40] Market layouts: WTI, gold and EURUSD multi-timeframe (OANDA).',
      ],
    },
  ],
  corrections: [
    'The homework chart is AUDUSD 1D from FXCM (January 1995 to January 1996), not an unnamed chart.',
  ],
};
