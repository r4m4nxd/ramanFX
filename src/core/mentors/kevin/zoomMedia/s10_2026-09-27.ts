import type { KevinZoomMedia } from './types';

// Sunday live, 27 Sep 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM). Channel-tool examples on
// XAUUSD 1h and SPX500USD 1W (OANDA); closing direction example on a DXY 4-pane (TVC).

const F = '/lessons/kevin_zoom/2026-09-27/';

export const KZ_2026_09_27: KevinZoomMedia = {
  date: '2026-09-27',
  images: [
    {
      src: F + 'f-002_t01m51s.jpg',
      caption: '[01:51] AUDUSD 1D with his learning-path note on the chart: "1. Watch my full S&D course on YT, 2. Watch my video lessons (private), 3. Watch/participate in the Sunday sessions (watch old ones as well)".',
      notes: [
        'The Sunday sessions matter most, but they only make sense after the course and the private lessons.',
      ],
    },
    {
      src: F + 'f-004_t03m42s.jpg',
      caption: '[03:42] Small marks on the peak and the valley, with a line at the high that has to be broken.',
      notes: [
        'An uptrend line needs a blatant peak and valley and then a higher high. "If we fail to break this high, then we do not have a trend line."',
      ],
    },
    {
      src: F + 'f-006_t05m34s.jpg',
      caption: '[05:34] Marks on a valley and a peak with no lower low after them: his example of what is not a trendline.',
      notes: [
        'Several students drew this last week. Without the lower low there is no downtrend line.',
      ],
    },
    {
      src: F + 'f-010_t09m16s.jpg',
      caption: '[09:16] Two borderline supplies drawn (orange) after he measured their moves away against his older zones.',
      notes: [
        'He drew them, but "I kind of feel like I\'m forcing zones": drawable, definitely not tradable. On his real charts a zone that needs measuring usually is not drawn.',
      ],
    },
    {
      src: F + 'f-019_t17m38s.jpg',
      caption: '[17:38] A student\'s chart: his sketch of the more blatant peak and valley for the trendline.',
      notes: [
        'When two candidates are close, use the more obvious peak and valley. Include all the basing candles and draw zones a bit larger.',
      ],
    },
    {
      src: F + 'f-025_t23m12s.jpg',
      caption: '[23:12] A student\'s chart with a big loop around a cluster of small zones.',
      notes: [
        '"It just seems like you\'re kind of forcing some zones here ... These are all just a little too small."',
      ],
    },
    {
      src: F + 'f-029_t26m54s.jpg',
      caption: '[26:54] A student\'s chart: a circle at a missed trendline and his line showing where it should run.',
      notes: [
        'The missed trendline made the student miss the supply. Two other zones followed none of the three rules.',
      ],
    },
    {
      src: F + 'f-038_t35m16s.jpg',
      caption: '[35:16] A student\'s note "Emotional wick, can we ignore it?" with the wick circled at the red supply.',
      notes: [
        'Not emotional: bigger than the nearby wicks, but a normal-sized candle and wick, so it is a normal break and the zone is removed.',
        'Do not shrink a zone to make the move away or the stay-away gap look good.',
      ],
    },
    {
      src: F + 'f-046_t42m41s.jpg',
      caption: '[42:41] His sketch over a student chart: the large trendline vs the smaller swings with their own trendline in between.',
      notes: [
        'Draw a large trendline only if there are none in between. "Absolutely no trend line here. Did not make a higher high."',
      ],
    },
    {
      src: F + 'f-053_t49m11s.jpg',
      caption: '[49:11] Channel tool on a downward trendline (XAUUSD 1h, OANDA): the channel is placed on the trendline and its other side dragged to the valley.',
      notes: [
        'Draw the trendline first; the channel does not draw it. Below the 50% mark is overextended: tradable, but he does not love it.',
      ],
    },
    {
      src: F + 'f-055_t51m02s.jpg',
      caption: '[51:02] SPX500USD 1W (OANDA): an upward channel on the trendline, with his marks near the upper half.',
      notes: [
        'Between the trendline and the 50% line is the "golden area" (less aggressive management). Above 50% is the danger zone: price can still rise but less likely, so manage more aggressively.',
        'Counter-trend, a supply far above the channel is more likely to work than one inside the golden area.',
      ],
    },
    {
      src: F + 'f-068_t63m06s.jpg',
      caption: '[63:06] DXY 4-pane (1W, 4h, 1D, 1h): he circles the 1h trend while answering which timeframe gives direction.',
      notes: [
        'Direction comes from the timeframe above your entry (5m entry, 1h direction); add the daily once that is mastered ("higher timeframe plus one").',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-16:00] Homework on AUDUSD 1D (FXCM): learning-path note, higher-high and lower-low trendline checks, two measured borderline supplies, an overextended uptrend line ended, and the zone from the trendline removal.',
        '[16:30-45:00] Student homework, including the "Emotional wick, can we ignore it?" question and oversized trendlines.',
        '[48:30-51:30] Channel tool: XAUUSD 1h downtrend channel and SPX500USD 1W uptrend channel with the 50% line.',
        '[55:00-63:30] Watchlist and direction Q&A on BTCUSD, USDCAD and DXY multi-timeframe layouts.',
      ],
    },
  ],
  corrections: [
    'The homework pair is AUDUSD 1D from FXCM (shown in the chart header), not an unnamed "homework pair". The S&P 500 channel example is on the weekly chart (SPX500USD 1W, OANDA), and the downtrend channel example is gold on the 1h.',
  ],
};
