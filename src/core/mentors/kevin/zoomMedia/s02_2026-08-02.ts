import type { KevinZoomMedia } from './types';

// Sunday live, 2 Aug 2026: frames from his recording. Homework chart is EURUSD 1D (FXCM), early 1990s
// (the 1992 axis label is visible), with the "What qualifies as a zone?" box top right.

const F = '/lessons/kevin_zoom/2026-08-02/';

export const KZ_2026_08_02: KevinZoomMedia = {
  date: '2026-08-02',
  images: [
    {
      src: F + 'f-004_t03m21s.jpg',
      caption: '[03:21] EURUSD 1D: he circles the last supply (red box, extended right) and draws an arrow along it to the three rules.',
      notes: [
        'That supply removed a demand (rule 1), the "double whammy" zone that also took out a trendline.',
      ],
    },
    {
      src: F + 'f-005_t04m12s.jpg',
      caption: '[04:12] EURUSD 1D, spring 1992: an X where the downtrend line was broken by small, indecisive candles.',
      notes: [
        'A removed trendline does not automatically give a zone. Small "boo-boo" basing candles are not an explosive move away, so nothing is drawn.',
      ],
    },
    {
      src: F + 'f-007_t05m52s.jpg',
      caption: '[05:52] Channel tool attached to the peak of the updated uptrend line, with an arrow showing price shooting up and out of the channel.',
      notes: [
        'Price got overextended with no pullback, so the trendline is ended (roughly halfway), not extended.',
        'The channel tool is optional; it just shows the overextension visually.',
      ],
    },
    {
      src: F + 'f-008_t06m43s.jpg',
      caption: '[06:43] An arrow at the tricky demand: the older supply was respected, the basing formed at it, and the explosive move removed it.',
      notes: [
        'If the basing (or even a wick) sat above the supply, it formed after the removal and there would be no zone.',
        'It reacted twice, but it was not a trade for him: the move away barely qualified and the pullback was too aggressive.',
      ],
    },
    {
      src: F + 'f-012_t10m04s.jpg',
      caption: '[10:04] A red down arrow on the chart with no trendline: the valley, peak and lower low only gave an almost horizontal line.',
      notes: [
        'Too horizontal is closer to momentum; he wants a nice angle. On his charts a down arrow without a line means a downtrend with no usable trendline.',
      ],
    },
    {
      src: F + 'f-024_t20m09s.jpg',
      caption: '[20:09] A student\'s homework: an X over a red "supply" drawn where the move away was not explosive, a circle on the candle, and an arrow at the trendline.',
      notes: [
        '"What did this zone accomplish? Absolutely nothing." A downtrend line without a lower low is not a trendline.',
        'An extended trendline does not need to be extended; end it.',
      ],
    },
    {
      src: F + 'f-034_t28m34s.jpg',
      caption: '[28:34] A dark-theme student chart with yellow ticks on two zones and a yellow X on the borderline demand almost everyone drew.',
      notes: [
        'That candle had wicks top and bottom: a large basing candle, not a move away. He still gave credit for the zones that followed from it.',
      ],
    },
    {
      src: F + 'f-042_t35m17s.jpg',
      caption: '[35:17] A student\'s labelled chart ("Supply Zone Removed", "Demand Zone"): he traces the downtrend line the student drew without a new low.',
      notes: [
        '"There is no trend line here, did not make a new low." Also: if it was a supply, include the wick unless it is massive.',
      ],
    },
    {
      src: F + 'f-054_t45m22s.jpg',
      caption: '[45:22] Sketch on a blank chart: small basing candles and one tall explosive candle, a rally-base-rally.',
      notes: [
        'Even with a good enough explosive candle it is not drawn if it removed nothing (no opposing zone, no trendline, no all-time high).',
      ],
    },
    {
      src: F + 'f-064_t53m46s.jpg',
      caption: '[53:46] Next homework: the blacked-out section with broken data, and a horizontal ray labelled "Treating this as an ATH".',
      notes: [
        'It is not a real all-time high, but treat it as one; it comes into effect later. The demand below must also be on your chart.',
      ],
    },
    {
      src: F + 'f-068_t57m08s.jpg',
      caption: '[57:08] His rules-vs-gray-area sketch: a red box with an X (obviously not a zone), a green box with a tick (obviously a zone), and the space between them.',
      notes: [
        'Every rule-based strategy has obvious yes, obvious no, and 50-50 cases in between, for zones and for trendlines.',
      ],
    },
  ],
  figures: [],
  sections: [
    {
      heading: 'On his charts',
      points: [
        '[01:00-13:10] Homework on EURUSD 1D (FXCM), early 1990s: the double-whammy supply, a trendline broken by small candles (no zone), an overextended uptrend line shown with the channel tool and ended, the tricky demand that removed an older supply, and a down arrow with no trendline.',
        '[13:30-50:00] Student homework (light and dark themes), plus lesson-homework screenshots from Discord.',
        '[45:20] Sketch: a rally-base-rally that removed nothing is not drawn.',
        '[52:00-57:30] Next homework: blacked-out broken data, the "Treating this as an ATH" ray, and the rules vs gray-area sketch.',
      ],
    },
  ],
  corrections: [],
};
