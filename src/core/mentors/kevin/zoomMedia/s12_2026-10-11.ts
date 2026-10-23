import type { KevinZoomMedia } from './types';

// Sunday live, 11 Oct 2026: frames from his recording. Zone-quality examples on EURUSD 1h (OANDA); homework chart
// is AUDUSD 1D (FXCM), January 2001 to January 2002; trade reviews from the Discord channel.

const F = '/lessons/kevin_zoom/2026-10-11/';

export const KZ_2026_10_11: KevinZoomMedia = {
  date: '2026-10-11',
  images: [
    {
      src: F + 'f-003_t02m26s.jpg',
      caption: '[02:26] The labelled zone diagram with "3/3" and "4/4" written beside it.',
      notes: [
        'Four parts, but the stay-away candle and the space are linked: get basing, an explosive move away and a stay-away candle (3 of 3) and the space comes with it (4 of 4).',
        'Basing is 1 to 3 candles of any colour.',
      ],
    },
    {
      src: F + 'f-006_t04m52s.jpg',
      caption: '[04:52] Same diagram with the stay-away candle and the space under it circled.',
      notes: [
        'A stay-away candle automatically gives you the space. That space is how he grades a zone.',
      ],
    },
    {
      src: F + 'f-007_t05m41s.jpg',
      caption: '[05:41] EURUSD 1h (OANDA): three zones drawn as orange boxes; a blue bar marks the large space between the first zone and its stay-away candle.',
      notes: [
        'The first zone: single-candle basing, a very obvious explosive move, a big space. A very good zone, and it worked.',
      ],
    },
    {
      src: F + 'f-009_t07m19s.jpg',
      caption: '[07:19] Same chart: an arrow to the zone with very little space, which failed completely.',
      notes: [
        'Great, poor and pretty good zones, and the results matched the space: "it\'s no coincidence". Poor-space zones are drawn, not traded.',
      ],
    },
    {
      src: F + 'f-011_t08m57s.jpg',
      caption: '[08:57] AUDUSD 1D homework: a long arrow up to the all-time low area, where rule 3 means there might be a zone.',
      notes: [
        'He is more lenient on moves away now: in some conditions moves away are huge, and then smaller explosive ones look wrong when they are fine.',
      ],
    },
    {
      src: F + 'f-012_t09m45s.jpg',
      caption: '[09:45] The zone that removed the downtrend line (green) and the single-candle-basing supply above it.',
      notes: [
        'The supply is kept a similar size to the earlier zones by eye. Not his favourite trade: price took so long to return that the zone was old.',
      ],
    },
    {
      src: F + 'f-013_t10m34s.jpg',
      caption: '[10:34] Three arrows at the explosive candles below, checked in order starting with the one closest to the all-time low.',
      notes: [
        'Drawn at a similar size, the candidates had no stay-away candle and no space, so no zone. "We\'re not gonna make zones smaller just to fit."',
      ],
    },
    {
      src: F + 'f-015_t12m12s.jpg',
      caption: '[12:12] All-time low ray, with small circles on an obvious peak and valley.',
      notes: [
        'No high was broken after the valley, so no trendline. If a high had broken, there would definitely be one.',
      ],
    },
    {
      src: F + 'f-017_t13m50s.jpg',
      caption: '[13:50] The upper trendline (peak, valley, then the high broken) and a hand-drawn downtrend line across the peaks.',
      notes: [
        'Draw from the lowest point of the valley; if that cuts candles, slide to the next point. The downtrend line is "almost too horizontal" but qualifies.',
      ],
    },
    {
      src: F + 'f-021_t17m05s.jpg',
      caption: '[17:05] The supply drawn a bit bigger on the proximal side, the demand below it, and the later trendline break with no supply.',
      notes: [
        'Wick to wick the supply was about half the size of earlier zones, so he widened the proximal side rather than stretching it over separate basing.',
        '"Just because a trend line breaks ... doesn\'t mean we just automatically have a zone."',
      ],
    },
    {
      src: F + 'f-030_t24m24s.jpg',
      caption: '[24:24] A student\'s dark-theme chart with the note "I don\'t know with this fib, I think it could be both of these zones ..." and a missed demand.',
      notes: [
        'The zone had a random distal line not attached to the wicks, which made the student miss the next zone.',
      ],
    },
    {
      src: F + 'f-048_t39m03s.jpg',
      caption: '[39:03] Trade review: EURGBP 4-pane (1W, 4h, 1D, 1h, OANDA) with red down arrows on the weekly and daily.',
      notes: [
        'A quick 1:1 with the trend. The pullback was too quick for his liking, but with price that overextended he liked the aggressive management.',
      ],
    },
    {
      src: F + 'f-051_t41m30s.jpg',
      caption: '[41:30] Sketch on a blank EURGBP 1h: a zone on the left and a long path out to a reaction far to the right.',
      notes: [
        'If the zone and the reaction do not fit in one screenshot, post one of the zone and one of the reaction.',
      ],
    },
    {
      src: F + 'f-060_t48m49s.jpg',
      caption: '[48:49] A student\'s trade post with dollar amounts; he writes "30$" and "300" over it.',
      notes: [
        'Post percentages, never dollar amounts: the same trade can be $30 for one person and $300 for another.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[02:00-07:30] Zone diagram (3/3 gives 4/4, the space circled), then EURUSD 1h (OANDA) with three zones graded by the space under the stay-away candle.',
        '[08:30-17:30] Homework on AUDUSD 1D (FXCM): all-time low candidates with no space, a peak and valley with no higher high, upper and downward trendlines, the supply widened on the proximal side, and a trendline break with no zone.',
        '[18:00-34:00] Student homework (light and dark themes).',
        '[35:40-56:00] First trade-review segment from the Discord channel, then gold and USDCAD multi-timeframe layouts.',
      ],
    },
  ],
  corrections: [
    'The homework chart is AUDUSD 1D from FXCM ("Jan 01 to Jan 02" means January 2001 to January 2002), not an unnamed homework chart.',
  ],
};
