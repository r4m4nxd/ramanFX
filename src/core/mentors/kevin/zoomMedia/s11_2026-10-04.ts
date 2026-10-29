import type { KevinZoomMedia } from './types';

// Sunday live, 4 Oct 2026: frames from his recording. The recording has two parts; the first is a 57-second
// false start, so all timestamps here are from the main part. Homework chart is AUDUSD 1D (FXCM), the year 2000.

const F = '/lessons/kevin_zoom/2026-10-04/';

export const KZ_2026_10_04: KevinZoomMedia = {
  date: '2026-10-04',
  images: [
    {
      src: F + 'f-005_t03m23s.jpg',
      caption: '[03:23] AUDUSD 1D: the large demand ended with the remove tool where it broke (circle), and an arrow up to the supply that removed it (red box).',
      notes: [
        'The supply is a weird one to draw and very close to not being a zone. Drawable, not tradable.',
        '"This zone removed that zone": every zone on his chart traces back to what it removed.',
      ],
    },
    {
      src: F + 'f-006_t04m04s.jpg',
      caption: '[04:04] Horizontal marks at the obvious peak and at the lower low under the valley, before he draws the large downtrend line.',
      notes: [
        'A very good peak, a very obvious valley "and more importantly, the lower low". The steeper line many students drew is too momentum-like.',
      ],
    },
    {
      src: F + 'f-007_t04m45s.jpg',
      caption: '[04:45] The large downtrend line, anchored from the highest point to the next peak after sliding it so it does not cut through candles.',
      notes: [
        'Usually do not draw very large lines, but here the ones in between were too borderline, so the large one is required.',
      ],
    },
    {
      src: F + 'f-008_t05m25s.jpg',
      caption: '[05:25] Two arrows: one at the explosive candle, one at the later candle that closed fully above the line.',
      notes: [
        'The line is removed by the first full close (body and wick) beyond it, not by the explosive candle. End the line there.',
      ],
    },
    {
      src: F + 'f-013_t08m49s.jpg',
      caption: '[08:49] A circle at the end of the homework: the downtrend line removed by a candle close, with the demand below.',
      notes: [
        'The move away is "not the best, but it is what it is". The recent charts are poor, so he will be more lenient on moves away.',
      ],
    },
    {
      src: F + 'f-022_t14m56s.jpg',
      caption: '[14:56] A student\'s chart: his curve over a steep line the student drew.',
      notes: [
        '"A little too more like momentum." The student also missed the large trendline and did not mark the all-time low.',
      ],
    },
    {
      src: F + 'f-024_t16m17s.jpg',
      caption: '[16:17] El Chapo\'s chart (AUDUSD 1D, 2000) with his notes: "I\'d consider the zone drawable but not tradable because of the wick in the explosive move away" and "barely qualifies as a zone".',
      notes: [
        'Kevin circles the big wick: with a wick that size it is a very large basing candle. "If the wick was just half the size" he would accept it.',
      ],
    },
    {
      src: F + 'f-025_t16m58s.jpg',
      caption: '[16:58] Same student, zoomed in on the lower supply labelled "barely qualifies as a zone" where it meets the downtrend line.',
      notes: [
        'A borderline call; he gives grace on close zones and trendlines when they are not out of left field.',
      ],
    },
    {
      src: F + 'f-028_t19m00s.jpg',
      caption: '[19:00] A student\'s chart: circles on a wicky supply candle at the top.',
      notes: [
        '"Not really a zone that big, wick is not great." Missed the large trendline, but everything this week was very close.',
      ],
    },
    {
      src: F + 'f-034_t23m05s.jpg',
      caption: '[23:05] Dark-theme student chart with the student\'s labels, including "Looks more like momentum" and "Not explosive enough".',
      notes: [
        'He agrees on the momentum call, and that the zone shown is the one that removed the earlier zone.',
      ],
    },
    {
      src: F + 'f-052_t35m18s.jpg',
      caption: '[35:18] His EURUSD 4-pane layout (1W, 4h, 1D, 1h, OANDA) used to answer the timeframe question.',
      notes: [
        'He enters on H1 (with the daily as its higher timeframe) and H4 (with the weekly). New traders should stick to one entry timeframe.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[02:20-09:10] Homework on AUDUSD 1D (FXCM), 2000: the removed demand and the supply that removed it, the large downtrend line (peak, valley, lower low; slid off the candles), the candle that actually removed it, and the last demand.',
        '[10:30-26:00] Student homework, including El Chapo\'s own "drawable but not tradable" and "barely qualifies" notes.',
        '[34:50-35:30] EURUSD 4-pane layout for his H1 / H4 entries.',
        '[42:00-47:00] Discord feedback on the homework format and the first trade-review screenshots.',
      ],
    },
  ],
  corrections: [],
};
