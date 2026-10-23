import type { KevinZoomMedia } from './types';

// Sunday live, 6 Sep 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM), January 1996 to January 1997.

const F = '/lessons/kevin_zoom/2026-09-06/';

export const KZ_2026_09_06: KevinZoomMedia = {
  date: '2026-09-06',
  images: [
    {
      src: F + 'f-007_t04m41s.jpg',
      caption: '[04:41] AUDUSD 1D: circles on the two basing candles that the downtrend line still touches, and the explosive move up out of them; the demand (green) is drawn there.',
      notes: [
        'The line touches both basing candles before the move away, so this demand removed it. If the line sat a little lower and missed the basing, he would not draw the zone.',
      ],
    },
    {
      src: F + 'f-008_t05m21s.jpg',
      caption: '[05:21] A circle on the demand that removed the all-time high.',
      notes: [
        'Rule 3 zone, "somewhat decent" but not one he would trade: the move away is barely explosive and he wanted another explosive move.',
        'The very long line many would draw here is probably a weekly trendline on a daily chart, so he leaves it out.',
      ],
    },
    {
      src: F + 'f-009_t06m01s.jpg',
      caption: '[06:01] Small circles on two similar valleys: one formed only by a wick, the other by candle bodies.',
      notes: [
        'The valley made of actual candles is the better anchor, so that trendline stays.',
      ],
    },
    {
      src: F + 'f-011_t07m21s.jpg',
      caption: '[07:21] A tall loop at the candle that came straight back into the would-be demand.',
      notes: [
        'Drawn at a proper size there is basing and an explosive move but no stay-away candle. "The stay-away candle can\'t touch the zone, or else it\'s not a stay-away candle."',
      ],
    },
    {
      src: F + 'f-015_t10m02s.jpg',
      caption: '[10:02] The all-time-high line circled flat across the chart, and a loop around the single-candle basing demand below the spike that broke it.',
      notes: [
        '"A 10 out of 10 zone": it removed an all-time high, clean basing, amazing move away. He would take it all day.',
        'Tip: hold Shift in TradingView to draw a perfectly horizontal all-time-high line.',
      ],
    },
    {
      src: F + 'f-016_t10m42s.jpg',
      caption: '[10:42] Zoomed in: the massive wick that spiked straight through that demand.',
      notes: [
        'An emotional wick, likely from news on the Aussie or the US dollar. Only a wick, so the zone is not ended; it was respected afterwards.',
      ],
    },
    {
      src: F + 'f-017_t11m22s.jpg',
      caption: '[11:22] His drawn example: a red candle body extended to close just below the zone, with the wick stretched far down.',
      notes: [
        'If the body closes beyond the zone, even barely, the zone is removed, however big the wick. Emotional wicks only count when it is just the wick.',
        'You would still be stopped out by the wick; the zone just is not removed.',
      ],
    },
    {
      src: F + 'f-019_t12m42s.jpg',
      caption: '[12:42] The new supply (red) drawn after the demand was finally removed.',
      notes: [
        'Drawn tight it would be too small, so he draws it a bit bigger. It gave a nice move down.',
      ],
    },
    {
      src: F + 'f-025_t16m43s.jpg',
      caption: '[16:43] A student\'s chart (Hans, then the next student): his curve and circle at the trendline start point he questions.',
      notes: [
        'Many students started the line from the same random point. Draw it from the most recent peak and valley.',
      ],
    },
    {
      src: F + 'f-054_t36m07s.jpg',
      caption: '[36:07] A student\'s AUDUSD 1D with "ATH" and notes: "By rules, this is SZ" on the upper supply and "more preferable cause of emotional wick" on the lower one.',
      notes: [
        '"By rule, this is supply zone ... it\'s the only one that broke that supply. This is just an extra one."',
      ],
    },
    {
      src: F + 'f-061_t40m48s.jpg',
      caption: '[40:48] A student\'s chart marked up with a circle, an X and his line under the lows.',
      notes: [
        '"What did it remove? Nothing." The trendline also needs to be extended, and the missing all-time high cost the student a zone.',
      ],
    },
    {
      src: F + 'f-064_t42m49s.jpg',
      caption: '[42:49] A student\'s chart: his line showing where the trendline should run, crossing out the student\'s start point.',
      notes: [
        '"Since you didn\'t map the all-time high, you missed that demand." Map the all-time highs first and the chain will most likely be correct.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[04:00-13:00] Homework on AUDUSD 1D (FXCM), 1996: demand whose basing touches the downtrend line, the all-time-high demand, wick vs candle valleys, a missing stay-away candle, the 10/10 single-candle demand, its emotional wick, the body-close rule, and the new supply.',
        '[14:00-44:00] Student homework, including the "By rules, this is SZ" chart and repeated trendline start-point corrections.',
        '[44:00] A student\'s EURUSD sketch labelled SUPPLY / DEMAND, then the next homework instructions in Discord.',
      ],
    },
  ],
  corrections: [
    'The homework chart is AUDUSD 1D from FXCM (the notes call it "Aussie" daily); the 10/10 demand that removed the all-time high is in late 1996.',
  ],
};
