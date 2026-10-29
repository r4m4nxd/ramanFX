import type { KevinZoomMedia } from './types';

// Sunday live, 20 Sep 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM), around the all-time lows,
// with the "What qualifies as a zone?" box top right. Closing market note on a DXY 4-pane (1W / 4h / 1D / 1h, TVC).

const F = '/lessons/kevin_zoom/2026-09-20/';

export const KZ_2026_09_20: KevinZoomMedia = {
  date: '2026-09-20',
  images: [
    {
      src: F + 'f-003_t01m58s.jpg',
      caption: '[01:58] AUDUSD 1D: he circles the carried-over, very poor-quality supply that price came straight back to.',
      notes: [
        'Drawable, not tradable. It worked, but he would not have taken it: "the best zones can fail, and the worst zones could work."',
      ],
    },
    {
      src: F + 'f-006_t03m56s.jpg',
      caption: '[03:56] The new supply above (removed a demand and made an all-time low) and, below it, the demand built off two close basing candles before a great explosive move.',
      notes: [
        'Use both basing candles when they are close and the zone stays a normal size: distal at the lowest wick (magnet tool), proximal where the move away starts.',
        'This demand removed two supplies, but later failed against the bigger downtrend.',
      ],
    },
    {
      src: F + 'f-010_t06m34s.jpg',
      caption: '[06:34] The downtrend line extended out with his hand-drawn path of price falling far away from it.',
      notes: [
        'Two reasons a line ends: an updated line replaces it, or it got too overextended. Keep both lines on the homework, the old one ended.',
      ],
    },
    {
      src: F + 'f-011_t07m14s.jpg',
      caption: '[07:14] An arrow at a candle that looks big next to its tiny neighbours.',
      notes: [
        'It is still a basing candle, just a bigger one. Compared in context it looks explosive, but it is not the explosive move he means. No supply above this demand.',
      ],
    },
    {
      src: F + 'f-013_t08m32s.jpg',
      caption: '[08:32] A long loop around a steady, step-like decline into new all-time lows.',
      notes: [
        'Valley, peak and lower low exist, but with no obvious valleys this is momentum, not a trendline. Many all-time lows here and none of them show a zone: be patient.',
      ],
    },
    {
      src: F + 'f-020_t13m09s.jpg',
      caption: '[13:09] Circles on the obvious peaks and valleys of the real trendlines vs a steep straight line with no clear valleys, with the rule-2 demand (green) further right.',
      notes: [
        '"Look at the difference between this peak and valley ... compared to something like that, which is momentum."',
      ],
    },
    {
      src: F + 'f-033_t21m42s.jpg',
      caption: '[21:42] Zoomed in on a student\'s two zones: the circle shows the older zone was fully respected by the basing.',
      notes: [
        'Only one zone counts. It would remove the older one only if part of the basing wicked above it.',
      ],
    },
    {
      src: F + 'f-034_t22m21s.jpg',
      caption: '[22:21] A student\'s borderline trendline: circles on the wick-only point.',
      notes: [
        '"If that was body, that\'d be fine", but it is too wicky to call a trendline. Close, so he gives grace.',
      ],
    },
    {
      src: F + 'f-049_t32m13s.jpg',
      caption: '[32:13] Sketch: starting point, peak, a deep obvious valley, then the break of the peak (higher high).',
      notes: [
        'Uptrend line recipe. If the high is not broken, there is no trendline.',
      ],
    },
    {
      src: F + 'f-050_t32m52s.jpg',
      caption: '[32:52] On a student chart: starting point, valley, peak circled, and a horizontal line at the valley that price never broke.',
      notes: [
        'Downtrend recipe: starting point, valley, peak, lower low. "No lower low" means no trendline.',
      ],
    },
    {
      src: F + 'f-055_t36m10s.jpg',
      caption: '[36:10] Dark-theme student chart: a yellow X over a trendline and a very large purple zone.',
      notes: [
        'The zone is way too big, though if it had removed a supply he would draw it big too and accept it. The line is "not a trend line", but close.',
      ],
    },
    {
      src: F + 'f-067_t44m03s.jpg',
      caption: '[44:03] Back on AUDUSD 1D: a black line drawn down into the green demand while he explains which lines get grace and which "blatantly" break the lower-low rule.',
      notes: [
        'Grace for subjective wick-or-valley calls, not for lines that break the lower-low rule (unless it is your first time).',
      ],
    },
    {
      src: F + 'f-069_t45m22s.jpg',
      caption: '[45:22] DXY 4-pane (1W, 4h, 1D, 1h): green arrow on the 4h, supply above on the 1D.',
      notes: [
        'Market note: the dollar has been strong; the current hiccup is most likely the start of a pullback.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:30-13:10] Homework on AUDUSD 1D (FXCM) near the all-time lows: the poor supply carried over, the double-whammy supply, the two-candle demand, an overextended downtrend line ended, big basing candles that are not moves away, momentum vs trendline, an updated uptrend line, and the rule-2 demand.',
        '[14:30-44:10] Student homework on the same chart (light and dark themes), with his trendline recipes sketched at 32:00-33:10.',
        '[45:00] DXY multi-timeframe layout for the market note.',
      ],
    },
  ],
  corrections: [
    'The homework chart is AUDUSD 1D from FXCM (header on every frame), not an unnamed "homework chart". The bottom-right note on it says the last homework was EURUSD (only good back to 1990).',
  ],
};
