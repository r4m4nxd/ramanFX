import type { KevinZoomMedia } from './types';

// Sunday live, 9 Aug 2026: frames from his recording. Homework chart is EURUSD 1D (FXCM) right after the blacked-out
// stretch, with "Treating this as an ATH" on the ray. Also DXY (TVC) for the channel example, gold (OANDA) for zoom,
// and the new AUDUSD 1D (FXCM) homework chart.

const F = '/lessons/kevin_zoom/2026-08-09/';

export const KZ_2026_08_09: KevinZoomMedia = {
  date: '2026-08-09',
  images: [
    {
      src: F + 'f-002_t01m42s.jpg',
      caption: '[01:42] EURUSD 1D: the unreadable data blacked out (top left), and a horizontal ray labelled "Treating this as an ATH" at the first high after it.',
      notes: [
        'Not normal practice ("don\'t do this" in real analysis); it is only for this homework.',
      ],
    },
    {
      src: F + 'f-004_t03m24s.jpg',
      caption: '[03:24] Zoomed in: a circle round the candles at the first downtrend line and an arrow at the red candle that removed it.',
      notes: [
        'Every candle before it, even the green one, still touched the line with body or wick. The red candle closed fully above without touching.',
      ],
    },
    {
      src: F + 'f-010_t08m30s.jpg',
      caption: '[08:30] Arrow at the candle that broke the earlier downtrend line after it had been respected several times.',
      notes: [
        'In a real trade, that close is the break. Above it, the supply he chose (the biggest move away) removed the old tested demand.',
      ],
    },
    {
      src: F + 'f-012_t10m12s.jpg',
      caption: '[10:12] Arrow at the supply that was removed, with the upward trendline under the rally.',
      notes: [
        '"There\'s no demand here" that removed that supply, so nothing is drawn. Even his one zone this week felt forced.',
      ],
    },
    {
      src: F + 'f-019_t16m09s.jpg',
      caption: '[16:09] A student\'s chart: arrow at an orange supply drawn on a good-looking move away.',
      notes: [
        '"Fair enough, that\'s an explosive move away ... but what did this remove?" If it removed nothing, do not draw it.',
      ],
    },
    {
      src: F + 'f-028_t23m49s.jpg',
      caption: '[23:49] DXY 4h (TVC) with a falling channel, and his sketch of price dipping below the lower channel line and coming back.',
      notes: [
        'A small break of the lower channel line does not remove the trendline if price comes back to test or re-enters the channel. Only a clear move far outside ends it.',
      ],
    },
    {
      src: F + 'f-033_t28m04s.jpg',
      caption: '[28:04] A student\'s labelled chart ("WILL NOT TRADE. MOVE AWAY NOT GOOD ENOUGH", "WILL NOT TRADE. MOVE AWAY CANDLE TOO CLOSE") with CHoCH / break-of-structure markings.',
      notes: [
        'The zones were all borderline, which is fair this week. Remove the CHoCH and BOS markings for this homework: "this is supply and demand".',
      ],
    },
    {
      src: F + 'f-035_t29m46s.jpg',
      caption: '[29:46] Multiple-sequence homework from a student: "Higher TF 1D" with a "Demand zone 1D" box inside a "Demand zone 3M".',
      notes: [
        'Do not jump from a 3-month chart to a 1h entry. For a 1h entry the higher timeframe is the daily, and above the daily the 1-month.',
        'The daily and 1h zones were in the right place but too big; tighter is better even if you might not get filled.',
      ],
    },
    {
      src: F + 'f-047_t39m59s.jpg',
      caption: '[39:59] His sketch on a student chart: one tall explosive candle from a zone next to a staircase of small candles.',
      notes: [
        'Going from A to B is not enough. "We need an explosive move, not little boo-boo basing candles."',
      ],
    },
    {
      src: F + 'f-048_t40m50s.jpg',
      caption: '[40:50] Blank DXY chart: sketch of a blatant peak and valley with the trendline, used to explain wicks vs valleys.',
      notes: [
        'A massive wick on its own is not a valley. He attaches to a wick only when a valley built from candles already qualifies there.',
      ],
    },
    {
      src: F + 'f-055_t46m47s.jpg',
      caption: '[46:47] Stefano\'s homework with his own notes: "Technically, the number 2 is the one that has broken the zone" and "I drew the zones in the middle, but they seem to me not so good".',
      notes: [
        '"You are absolutely right." Almost perfect apart from the missed updated trendline: this week\'s winner.',
      ],
    },
    {
      src: F + 'f-063_t53m35s.jpg',
      caption: '[53:35] The new homework chart, AUDUSD 1D (FXCM): a vertical line where normal candles start, with "Treating as ATH" and "Treating as ATL" lines.',
      notes: [
        'Early AUDUSD data is unusable, so the first high and low after the line count as all-time high and low for the homework.',
      ],
    },
    {
      src: F + 'f-065_t55m17s.jpg',
      caption: '[55:17] Gold 4-pane (OANDA, 1W / 4h / 1D / 1h): after the huge rally, the older zones look small at this zoom.',
      notes: [
        'At the zoom of that time they barely qualified. That is why he judges zone size by eye at the right zoom, not by measuring.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:20-12:30] Homework on EURUSD 1D (FXCM) after the blacked-out stretch: the "Treating this as an ATH" ray, the exact candle that removes a trendline, the supply with the biggest move away, and no demand where none qualifies.',
        '[13:00-47:00] Student homework, including a DXY 4h channel example for channel lenience and a multiple-sequence (3M / 1D) screenshot.',
        '[39:40-41:30] Sketches: explosive candle vs staircase of small candles; peak and valley vs a lone wick.',
        '[52:30-55:40] New AUDUSD 1D (FXCM) homework chart with ATH / ATL lines, then gold to show how zoom changes how zones look.',
      ],
    },
  ],
  corrections: [],
};
