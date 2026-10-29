import type { KevinZoomMedia } from './types';

// Sunday live, 19 Jul 2026: frames from his recording. Homework chart is EURUSD 1D (FXCM) on TradingView,
// with his "What qualifies as a zone? 1. Removes opposing zone 2. Removes a trendline 3. Makes all time high/low" box.
// The stop-loss Q&A uses XAUUSD 1h and USDCAD 4h/1D/1W (OANDA).

const F = '/lessons/kevin_zoom/2026-07-19/';

export const KZ_2026_07_19: KevinZoomMedia = {
  date: '2026-07-19',
  images: [
    {
      src: F + 'f-002_t01m12s.jpg',
      caption: '[01:12] EURUSD 1D (FXCM), where last week ended: the last supply and the trendlines, then the push to the all-time high and the fall after it. His three-rule box sits top right and a "Last Homework: GBPUSD" note bottom right.',
      notes: [
        'All three things happened (zone removed, trendline removed, all-time high) but there was no qualifying zone, so nothing is drawn.',
      ],
    },
    {
      src: F + 'f-005_t03m00s.jpg',
      caption: '[03:00] After the all-time high: the new supply (two basing candles) drawn as a thin red box, extended right, and the first downward trendline from the top.',
      notes: [
        'The supply qualifies because it removed the demand below it (rule 1).',
        'He only uses the two basing candles; from the wick across the whole area would be too big.',
        'The line first cut through candles at the top, so he slid it to the next highest point where it touches without cutting.',
      ],
    },
    {
      src: F + 'f-006_t03m36s.jpg',
      caption: '[03:36] Same chart: an arrow points at the candle whose wick only touched the downtrend line.',
      notes: [
        'A wick touch does not remove a trendline. It is removed only by the later candle that closes above it with full body and wick.',
      ],
    },
    {
      src: F + 'f-009_t05m24s.jpg',
      caption: '[05:24] Next leg: the tested demand is removed and an arrow marks the only supply candidate, one explosive move away, with the second downtrend line running through the peaks.',
      notes: [
        'This supply was already hit before it removed anything, which is why he often draws a zone "after the fact".',
      ],
    },
    {
      src: F + 'f-010_t06m00s.jpg',
      caption: '[06:00] Two arrows: one at the candle that broke the trendline (whole candle above it), one at the small drop-base-rally demand underneath that removed it.',
      notes: [
        '"Not the best zone, but what a trade." It qualified as a setup and won big.',
        'He would not have taken it: he wanted a second leg up proving more demand.',
      ],
    },
    {
      src: F + 'f-013_t07m48s.jpg',
      caption: '[07:48] Two arrows on the rally-base-rally demand (green box) that removed the supply above it.',
      notes: [
        'This is a trade. Another zone had a bigger single move away, but he prefers this one for the continued move up after it.',
      ],
    },
    {
      src: F + 'f-015_t09m00s.jpg',
      caption: '[09:00] His sketch of the two versions: left, basing + explosive candle + another explosive candle; right, basing + explosive candle + a row of small basing candles + another explosive candle.',
      notes: [
        'Both qualify (the first candle after the basing must always be explosive).',
        'He much prefers the left one: "there\'s so much demand here". The right one "kind of based out".',
      ],
    },
    {
      src: F + 'f-017_t10m12s.jpg',
      caption: '[10:12] Momentum vs trendline: from the same low he draws a steep line and a flatter line through the clear peak and valley (a short purple line marks a level at the valley).',
      notes: [
        'The steep one is momentum; the trendline is drawn from the lowest point to the valley.',
        'He then adds a second, more aggressive line from a quick peak and valley and keeps both: one overall, one temporary.',
      ],
    },
    {
      src: F + 'f-020_t12m01s.jpg',
      caption: '[12:01] End of the homework section: an arrow at the supply (red box) at the top, after the demand and the trendline were removed.',
      notes: [
        'A bit old but "actually not bad", the kind of move away he would take, even though it failed "pretty miserably".',
        'Of all the zones, he would only have considered this supply and the earlier rally-base-rally demand.',
      ],
    },
    {
      src: F + 'f-024_t14m25s.jpg',
      caption: '[14:25] Marking a student (Hans): on the EURUSD 1D he draws the new downtrend line from the most recent peak, an arrow pointing at that peak.',
      notes: [
        'After a new peak and valley, do not start the line from a random point. Attach it to the most recent peak.',
        'The student missed the earlier line, which led to the missed zones further down the chain.',
      ],
    },
    {
      src: F + 'f-029_t17m25s.jpg',
      caption: '[17:25] A student\'s EURUSD 1D (FXCM) chart with the area circled where the candles do not look like his.',
      notes: [
        'Same broker, different-looking candles: he says he is confused by it. Treat those zones as unresolved.',
      ],
    },
    {
      src: F + 'f-053_t31m51s.jpg',
      caption: '[31:51] Stefano\'s chart (red "not sure about this" note and an X on the chart): demand good, but a missed supply led to a missed demand lower down.',
      notes: [
        '"Picture perfect" apart from one missed zone; one miss costs the zones that depend on it.',
      ],
    },
    {
      src: F + 'f-059_t35m27s.jpg',
      caption: '[35:27] Stop-loss Q&A on XAUUSD 1h (OANDA): a 1h supply between about 4,029.47 and 4,043.36 with a short-position box; he circles the stop area above the zone and draws the expected drop.',
      notes: [
        'Normal conditions: stop a little beyond the zone, placed by eye, not measured.',
        'Gold and oil: wider stops, especially in headline-driven conditions.',
      ],
    },
    {
      src: F + 'f-062_t37m15s.jpg',
      caption: '[37:15] USDCAD 4h (OANDA): the 4h demand sits on the daily demand (cloned onto the 4h chart); the long-position box and his sketched path dip into the zone and then rally.',
      notes: [
        'A normal stop gives the daily zone almost no room; below the whole daily you might as well trade the daily.',
        'Middle ground: stop about halfway into the daily zone. The whole trade could still fail.',
      ],
    },
    {
      src: F + 'f-067_t40m15s.jpg',
      caption: '[40:15] Sketch on gold 1h for a student question: a zone box with the explosive candles leaving it and later candles below.',
      notes: [
        'It still counts as a zone, but it is not his favourite. He prefers price to stay away from the zone for a while; the best case is an explosive move followed by another explosive move.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-12:20] Homework walkthrough on EURUSD 1D (FXCM): supply from two basing candles after the all-time high, a downtrend line slid off the candle tops, a wick-touch that does not remove it, the tested supply drawn after the fact, the small drop-base-rally that removed the line, and the rally-base-rally demand that removed the supply.',
        '[08:00-09:10] Hand-drawn sketch of "basing + explosive + explosive" (preferred) next to "basing + explosive + basing + explosive" (qualifies).',
        '[10:00-10:45] Steep momentum line vs the trendline through the peak and valley, then a second aggressive line kept alongside the overall one.',
        '[12:30-32:30] Student homework charts: missed first trendline, new line from the recent peak, a student chart whose candles differ from his on the same broker.',
        '[33:50-37:40] Stops: XAUUSD 1h short with the stop just above the 1h supply, and the USDCAD 4h demand sitting on a daily demand with a weekly demand behind.',
      ],
    },
  ],
  corrections: [
    'The homework chart is named on screen: EURUSD 1D from FXCM (the notes only said "not named"). The stop-loss gold example is XAUUSD on the 1h (OANDA), and the USDCAD example is shown on a 4-pane 1W / 4h / 1D / 1h layout.',
    'Clarified: the "normal stop" gold example is a short from a 1h supply (lines about 4,029.47 and 4,043.36 on his chart) with the stop just above the zone and the target below.',
  ],
};
