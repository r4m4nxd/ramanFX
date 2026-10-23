import type { KevinZoomMedia } from './types';

// Sunday live, 18 Oct 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM), January 2002 to January 2003;
// trade reviews from the Discord channel.

const F = '/lessons/kevin_zoom/2026-10-18/';

export const KZ_2026_10_18: KevinZoomMedia = {
  date: '2026-10-18',
  images: [
    {
      src: F + 'f-002_t01m24s.jpg',
      caption: '[01:24] Sketch on a blank chart: left, a steep climb with tiny peaks and valleys (momentum); right, a deep obvious peak and valley, then a break above the peak.',
      notes: [
        'The left one has peaks and valleys too, just not obvious and deep. He judges this visually, not by measuring.',
        'An obvious valley is not enough: price must then break the high before it.',
      ],
    },
    {
      src: F + 'f-008_t05m39s.jpg',
      caption: '[05:39] AUDUSD 1D with his note "1. Confirmation in HTF ZONE When convinced by my HTF".',
      notes: [
        'The two times he draws zones outside the three rules: (1) confirmation inside a higher-timeframe zone he is convinced by, (2) macro charts (1 month and up). He still prefers the rules.',
      ],
    },
    {
      src: F + 'f-011_t07m47s.jpg',
      caption: '[07:47] The supply that removed the uptrend line, with his curve tracing the move up into it.',
      notes: [
        'Rule 2 zone. The line was removed by the candle that closed fully below it, body and wick. "Move away here is decent, move away here is great."',
      ],
    },
    {
      src: F + 'f-012_t08m29s.jpg',
      caption: '[08:29] The demand that removed that supply, drawn wick to wick (green).',
      notes: [
        'Wick to body would be far too small; wick to wick is a little smaller than the other zones but fine. If a zone looks too small, make it a little bigger.',
      ],
    },
    {
      src: F + 'f-015_t10m37s.jpg',
      caption: '[10:37] A circle at the valley where the uptrend line starts, and an arrow along the line.',
      notes: [
        'From the lowest point the line cut through candles, so he keeps the second point and moves to the next lowest point. The start is not random.',
      ],
    },
    {
      src: F + 'f-016_t11m19s.jpg',
      caption: '[11:19] The supply that price respected and then broke, ended with the remove tool where it was removed.',
      notes: [
        'Do not end a zone early or extend it past its removal: "I have seen many guys have sloppy-looking charts like that."',
      ],
    },
    {
      src: F + 'f-019_t13m26s.jpg',
      caption: '[13:26] His curve from the old line\'s second touch point down to the most recent valley.',
      notes: [
        'Updated trendline: do not start from the bottom again. The old line\'s second touch point becomes the new line\'s first point; end the old line there.',
      ],
    },
    {
      src: F + 'f-020_t14m09s.jpg',
      caption: '[14:09] A steep red line next to the black trendline from the recent valley.',
      notes: [
        '"That\'s momentum. It\'s completely different." The trendline has an obvious valley and a higher high.',
      ],
    },
    {
      src: F + 'f-021_t14m51s.jpg',
      caption: '[14:51] The updated uptrend line where it was removed, with the large explosive candle below.',
      notes: [
        'He first picked the wrong candle: the removal is the first candle that does not touch the line with body or wick.',
        'The big explosive candle gives a large zone; explosive move and stay-away candle are there but the space is small.',
      ],
    },
    {
      src: F + 'f-027_t19m06s.jpg',
      caption: '[19:06] Circles at the most recent valley and the next touch for yet another updated uptrend line.',
      notes: [
        'Each new peak, valley and higher high means a new line from the newest valley: "this is where the trend lines get a little bit tricky."',
      ],
    },
    {
      src: F + 'f-028_t19m49s.jpg',
      caption: '[19:49] The newest line, overextended, ended; the already-tested supply removed; the single-candle-basing demand below.',
      notes: [
        'An overextended line is ended, not continued. The demand is "single candle basing, absolutely love this zone".',
      ],
    },
    {
      src: F + 'f-057_t40m20s.jpg',
      caption: '[40:20] Trade review: a student\'s gold 1h chart (OANDA) with a 1h supply at about 4,205 to 4,225, a demand at about 4,137 to 4,146, and a diagonal line drawn across the lows.',
      notes: [
        'A good 1:3 trade off the 1h supply, but the line is not a trendline: "we didn\'t break the low after the peak."',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-05:50] Momentum vs trendline sketch and his note on the two exceptions to the drawing rules.',
        '[07:00-20:30] Homework on AUDUSD 1D (FXCM), 2002: supply that removed a trendline, the wick-to-wick demand, the slid trendline start, a zone ended where it broke, updated trendlines from the most recent valley, the removal candle, an overextended line ended, and the single-candle demand.',
        '[21:00-37:00] Student homework (light and dark themes).',
        '[37:30-48:50] Trade reviews from the Discord channel (USDCAD, gold, EURUSD, CADJPY, AUDCAD, NASDAQ).',
      ],
    },
  ],
  corrections: [],
};
