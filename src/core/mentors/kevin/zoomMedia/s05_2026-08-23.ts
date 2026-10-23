import type { KevinZoomMedia } from './types';

// Sunday live, 23 Aug 2026: frames from his recording. Homework chart is AUDUSD 1D (FXCM), around 1994.

const F = '/lessons/kevin_zoom/2026-08-23/';

export const KZ_2026_08_23: KevinZoomMedia = {
  date: '2026-08-23',
  images: [
    {
      src: F + 'f-001_t01m00s.jpg',
      caption: '[01:00] The labelled zone diagram with the no-basing case drawn beside it: a big red candle, then a big green candle, with a box drawn where the basing would be.',
      notes: [
        'About 98% of the time there is basing. In the rare case with none, the move is aggressive enough that you draw the basing in yourself.',
      ],
    },
    {
      src: F + 'f-002_t02m00s.jpg',
      caption: '[02:00] Sketch: two small basing candles, one tall explosive candle, then the next candle above.',
      notes: [
        'One aggressive candle is the move away, not a run of small "boo-boo" candles. Best case: basing, explosive, explosive again; small candles after the first explosive one are fine.',
      ],
    },
    {
      src: F + 'f-005_t05m01s.jpg',
      caption: '[05:01] The chain so far on AUDUSD 1D (FXCM): "Treating as ATH" / "Treating as ATL" lines, the earlier zones, and last week\'s trendline ended where price "just blasted off".',
      notes: [
        'End trendlines once they are too overextended. Extend each removed zone to roughly where it was removed: not short, not far past it.',
      ],
    },
    {
      src: F + 'f-007_t07m02s.jpg',
      caption: '[07:02] An arrow down to the demand that removed the supply, quite a way below the nearby candidate he rejected.',
      notes: [
        'The nearby area did not hold up against the older zones. He wraps the far demand at a similar size to the earlier zones.',
      ],
    },
    {
      src: F + 'f-009_t09m02s.jpg',
      caption: '[09:02] Horizontal marks above the demand while answering "do we care how close or far the zone is?"',
      notes: [
        'Typically the zone that removed something is fairly close. If it were all the way down, he would probably just end the analysis: a feel, not a measurement.',
      ],
    },
    {
      src: F + 'f-010_t10m03s.jpg',
      caption: '[10:03] AUDUSD 1D, April 1994: long-position tool on the single-candle demand. Stop 0.00525 (52.5 pips, 0.741%), target 0.01682 (168.2 pips), risk/reward 3.2.',
      notes: [
        'He enters at the zone or "most always" just a little before. The stop sits a visible distance beyond the zone, the minimum he uses; wider in volatile news conditions.',
        'The zone was just barely broken, but with that stop the trade would not have lost unless the spread blew out.',
      ],
    },
    {
      src: F + 'f-011_t11m03s.jpg',
      caption: '[11:03] A circle on the candle many would call a zone after that demand was removed.',
      notes: [
        '"I know a lot of you are probably thinking that\'s a zone." Compared with the other zones the move away is not good enough.',
      ],
    },
    {
      src: F + 'f-017_t17m05s.jpg',
      caption: '[17:05] A student\'s chart: his zig-zag over the recent peak and valley that the student\'s wide trendline skipped.',
      notes: [
        '"You\'re ignoring that peak and valley." Drawing too wide misses the recent peaks and valleys, and with them the zones.',
      ],
    },
    {
      src: F + 'f-018_t18m05s.jpg',
      caption: '[18:05] Same student: circles on the hard-to-spot small supply and on a candle that is not a good enough move away.',
      notes: [
        'Grace for everyone on the hidden supply. A line anchored so that price then needed a new high it never made is incorrect.',
      ],
    },
    {
      src: F + 'f-020_t20m06s.jpg',
      caption: '[20:06] El Chapo\'s chart with his note: "Good move away but I don\'t like how price quickly came back to test the zone"; Kevin circles the zone.',
      notes: [
        'He agrees it would not have been a great setup; include all the basing when drawing it. "Probably your best work yet."',
      ],
    },
    {
      src: F + 'f-024_t24m07s.jpg',
      caption: '[24:07] Multiple-sequence homework from a student: a large green box labelled "4H consequences Zone".',
      notes: [
        'Right area, but the zones are way too big. Draw the little single-candle basing before the move, and label each timeframe.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[00:40-04:30] Zone recap diagrams: no-basing case, single explosive candle vs small candles, and the peak / valley / higher-high trendline.',
        '[05:00-15:30] Homework on AUDUSD 1D (FXCM), 1994: the far-away demand, a downtrend line removed on a full close, his single-candle demand trade with the position tool, a rejected candidate, uptrend lines, the hidden small supply and the big-wick supply.',
        '[16:00-30:00] Student homework (trendlines too wide, zones too big) and lesson homework.',
        '[40:00-46:00] Forex Factory calendar (Jackson Hole) and 12-month stock zones on 4-pane stock layouts (for example ALB and MRNA).',
      ],
    },
  ],
  corrections: [
    'The homework chart is AUDUSD 1D from FXCM (around 1994), not an unnamed market.',
    'Clarified: the single-candle demand example uses TradingView\'s long-position tool, which shows a target as well as the stop: stop 0.00525 (52.5 pips, 0.741%), target 0.01682 (168.2 pips), risk/reward 3.2. He said he was showing it for the stop, not claiming that target.',
  ],
};
