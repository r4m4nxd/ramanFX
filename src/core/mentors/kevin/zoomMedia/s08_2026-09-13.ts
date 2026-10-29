import type { KevinZoomMedia } from './types';

// Sunday live, 13 Sep 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM) on TradingView with
// the anchored "What qualifies as a zone?" note top right and "Last Homework: EURUSD (*EURUSD only good to 1990)" bottom right.

const F = '/lessons/kevin_zoom/2026-09-13/';

export const KZ_2026_09_13: KevinZoomMedia = {
  date: '2026-09-13',
  images: [
    {
      src: F + 'f-002_t01m38s.jpg',
      caption: '[01:38] His labelled zone diagram from the learning material: basing candles inside the zone box (proximal line on top, distal line at the bottom), the move-away candle, the stay-away candle, and a red arrow for the space between the stay-away candle and the proximal line.',
      notes: [
        'The candle leaving the proximal line must be explosive, not small "boo-boo" basing candles on the way out.',
        'The smaller the space under the stay-away candle, the worse the zone.',
      ],
    },
    {
      src: F + 'f-005_t04m07s.jpg',
      caption: '[04:07] Labelled trendline diagram: "Peak", "Valley" and "Higher High" marked on an uptrend, with the line attached under the valley.',
      notes: [
        'An uptrend line needs a peak, an obvious valley, and then a higher high above that peak. Approaching the high and selling off is no trendline.',
      ],
    },
    {
      src: F + 'f-007_t05m45s.jpg',
      caption: '[05:45] AUDUSD 1D: the huge wick he circles is an emotional wick, not the removal; the supply (red box, extended right) removed the demand when a body closed below it.',
      notes: [
        'A body close is not always required: a normal-sized wick breaking a zone also removes it. A massive one-off wick does not.',
      ],
    },
    {
      src: F + 'f-010_t08m13s.jpg',
      caption: '[08:13] Arrow at the candle that officially removed the trendline: the line still touched both basing candles and the explosive candle before it.',
      notes: [
        'He does not draw that zone until the stay-away candle closes fully below the line (no body or wick touching).',
      ],
    },
    {
      src: F + 'f-015_t12m20s.jpg',
      caption: '[12:20] A long arrow along the fall away from the daily downtrend line: price got so overextended that the line became irrelevant.',
      notes: [
        'Keep that line on the chart but end it there. Extending it tells him you did not see it became irrelevant.',
        'Very old zones are removed with the remove tool; he does not expect them to hold.',
      ],
    },
    {
      src: F + 'f-016_t13m10s.jpg',
      caption: '[13:10] The supply with no basing: a box drawn from the very top of the huge explosive move (red, extended right), sized like his other zones.',
      notes: [
        'With no clear basing, put the distal line at the extreme and copy the size of your other zones.',
        'It is an older zone, tracked for much later.',
      ],
    },
    {
      src: F + 'f-018_t14m49s.jpg',
      caption: '[14:49] Sketch on the chart of a hypothetical peak and valley, with the updated downtrend line drawn from that recent peak.',
      notes: [
        'Normally the updated line starts at the recent peak. Here the real recent peak did not make sense for a line, so he used the previous peak and valley.',
      ],
    },
    {
      src: F + 'f-019_t15m38s.jpg',
      caption: '[15:38] An almost-supply (red box) with the candle that came straight back circled.',
      notes: [
        'Basing and an explosive move away, but no stay-away candle: price pushed back in and wicked it. No supply there.',
        'A removed zone does not guarantee a new zone.',
      ],
    },
    {
      src: F + 'f-020_t16m27s.jpg',
      caption: '[16:27] The recent peak circled: a new peak, valley and lower low, so this time the updated line starts from the recent peak (highest point possible).',
      notes: [
        'This line also gets overextended; he uses the channel tool to show price leaving the channel, so it is ended, not extended.',
      ],
    },
    {
      src: F + 'f-021_t17m17s.jpg',
      caption: '[17:17] A small possible supply circled near the end of the homework range, just above the green demand.',
      notes: [
        'If drawn it would be very small. "You don\'t want to draw it too small." He compares it with his other zones before deciding.',
      ],
    },
    {
      src: F + 'f-044_t36m13s.jpg',
      caption: '[36:13] A student\'s chart: a long run of basing candles, then the explosive candle, with a green demand drawn under it.',
      notes: [
        'In a trading situation he would draw the zone at the explosive move but tuck the stop under all the basing. The basing is not the move away.',
      ],
    },
    {
      src: F + 'f-049_t40m20s.jpg',
      caption: '[40:20] A student\'s AUDUSD 1D homework with his handwritten score on it: the first perfect homework.',
      notes: [
        'Two students got 100% this week, a first. 7 or 8 out of 10 is still doing well.',
      ],
    },
    {
      src: F + 'f-062_t51m02s.jpg',
      caption: '[51:02] A student\'s chart with "ATL" marked at the bottom; he circles where a downtrend line was drawn without a lower low.',
      notes: [
        '"Certainly not a trend line here, as we did not even break a lower low."',
      ],
    },
    {
      src: F + 'f-066_t54m20s.jpg',
      caption: '[54:20] Sketch on a blank chart: "ATL" with a horizontal line and price breaking below it in steps.',
      notes: [
        'Once the all-time low breaks, every drop-base-drop that makes a new low is a zone (rule 3), even without breaking an obvious valley.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:20-04:30] Recap slides: the labelled zone diagram (basing, move-away, stay-away, space to the proximal line) and the labelled peak / valley / higher-high trendline diagram.',
        '[05:30-17:40] Chain analysis on AUDUSD 1D (FXCM): emotional wick vs real removal, the trendline that touched the basing and explosive candles, an overextended daily line ended early, a supply drawn from the top with no basing, trendline updates from the previous and then the recent peak, an almost-supply with no stay-away candle, and a borderline small supply.',
        '[19:00-52:00] Student homework on the same AUDUSD 1D chart, plus a few student charts on other pairs.',
        '[53:30-55:30] All-time-low sketch, then the next homework posted in Discord.',
      ],
    },
  ],
  corrections: [
    'The homework chart in this session is AUDUSD 1D from FXCM (shown in the chart header), not an unnamed "homework chart". The note on the chart says the last homework was EURUSD, which was only good back to 1990.',
  ],
};
