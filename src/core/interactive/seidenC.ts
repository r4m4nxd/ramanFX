// Interactive teaching layer for mentor "seiden" (Sam Seiden articles), lessons in part321.ts and part401.ts.
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Seiden's drawing rule: wrap the basing
// candles - demand top (proximal) = highest basing body, bottom (distal) = lowest basing wick; supply mirrored
// (bottom = lowest basing body, top = highest basing wick).
import type { InteractiveLesson } from './types';

export const IL_SEIDENC: InteractiveLesson[] = [
  {
    mentor: "seiden",
    n: 321,
    eli5: {
      oneLiner: "Two supply levels stacked together make a stronger wall than one.",
      story: "Imagine a bank with one steel door, and another bank with two steel doors. A robber with a plastic hammer will not get through either, but two doors make it even harder. On a chart, a supply level with another supply level just above it is that two-door bank. The crowd buys after a rally right into it and bounces off. You sell to them, with your stop above both doors.",
      analogy: "It is like a goalkeeper with a second goalkeeper standing right behind him. If the ball gets past the first, the second one stops it, so never stand between them."
    },
    bigIdeas: [
      "Supply with more supply just above (or demand with more demand just below) is stronger than one lonely level.",
      "Scale in at both levels, or enter all at the outer level. One stop beyond the outer level.",
      "We do not look for certainty. We look for better odds."
    ],
    steps: [
      {
        title: "The first vault door",
        narration: "Price rallied, paused for two small candles and then dropped. Price could not stay there, so supply was bigger than demand. Wrap the pause: bottom line on the lowest body, top line on the highest wick. That is Supply 2.",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          zones: [
            {
              from: 7,
              top: 160.5,
              bottom: 159.15,
              kind: "supply",
              label: "Supply 2 (upper door)"
            }
          ],
          highlight: {
            from: 7,
            to: 8,
            label: "base"
          },
          reveal: 11
        }
      },
      {
        title: "A second door just below",
        narration: "On the way down price paused again for two candles and fell hard. Now there is a second supply sitting just under the first one. Two steel doors instead of one: levels on top of levels.",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          zones: [
            {
              from: 7,
              top: 160.5,
              bottom: 159.15,
              kind: "supply",
              label: "Supply 2 (upper door)"
            },
            {
              from: 11,
              top: 157.22,
              bottom: 155.78,
              kind: "supply",
              label: "Supply 1 (lower door)"
            }
          ],
          highlight: {
            from: 11,
            to: 12,
            label: "second base"
          },
          reveal: 17
        }
      },
      {
        title: "Plan before price comes back",
        narration: "Price fell far, to the prior low. The plan is made now, not later: sell part at the bottom line of Supply 1, sell the rest at the bottom line of Supply 2, and put ONE stop above the top of Supply 2. The target is the prior low.",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          zones: [
            {
              from: 7,
              top: 160.5,
              bottom: 159.15,
              kind: "supply",
              label: "Supply 2 (upper door)"
            },
            {
              from: 11,
              top: 157.22,
              bottom: 155.78,
              kind: "supply",
              label: "Supply 1 (lower door)"
            }
          ],
          lines: [
            {
              y: 155.78,
              label: "Entry 1 (part)",
              kind: "entry"
            },
            {
              y: 159.15,
              label: "Entry 2 (rest)",
              kind: "entry"
            },
            {
              y: 160.9,
              label: "Stop above both",
              kind: "sl"
            },
            {
              y: 141.63,
              label: "Target: prior low",
              kind: "tp"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Novice buyers run in",
        narration: "A steady rally climbs back up. The crowd sees a buy signal and buys after a rally, straight into thick supply. That is a plastic hammer against two vault doors. Entry 1 fills.",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          zones: [
            {
              from: 7,
              top: 160.5,
              bottom: 159.15,
              kind: "supply",
              label: "Supply 2 (upper door)"
            },
            {
              from: 11,
              top: 157.22,
              bottom: 155.78,
              kind: "supply",
              label: "Supply 1 (lower door)"
            }
          ],
          lines: [
            {
              y: 155.78,
              label: "Entry 1 (part)",
              kind: "entry"
            },
            {
              y: 159.15,
              label: "Entry 2 (rest)",
              kind: "entry"
            },
            {
              y: 160.9,
              label: "Stop above both",
              kind: "sl"
            },
            {
              y: 141.63,
              label: "Target: prior low",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 24,
              y: 151.78,
              text: "buy signal crowd"
            }
          ],
          highlight: {
            from: 21,
            to: 27,
            label: "novice buyers"
          },
          reveal: 28
        }
      },
      {
        title: "The spike fills entry 2, the stop holds",
        narration: "Price spikes up into Supply 2. A trader with a stop between the doors would be stopped out right here. Our stop sits above both doors, entry 2 fills, and price falls to the target.",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          zones: [
            {
              from: 7,
              top: 160.5,
              bottom: 159.15,
              kind: "supply",
              label: "Supply 2 (upper door)"
            },
            {
              from: 11,
              top: 157.22,
              bottom: 155.78,
              kind: "supply",
              label: "Supply 1 (lower door)"
            }
          ],
          lines: [
            {
              y: 155.78,
              label: "Entry 1 (part)",
              kind: "entry"
            },
            {
              y: 159.15,
              label: "Entry 2 (rest)",
              kind: "entry"
            },
            {
              y: 160.9,
              label: "Stop above both",
              kind: "sl"
            },
            {
              y: 141.63,
              label: "Target: prior low",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 24,
              y: 151.78,
              text: "buy signal crowd"
            }
          ],
          highlight: {
            from: 28,
            to: 33,
            label: "spike, then the fall"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "You have two supply levels stacked. Where does the protective stop go?",
        options: [
          "Just above the lower level",
          "Between the two levels",
          "Just above the upper level",
          "No stop is needed with two levels"
        ],
        answer: 2,
        explain: "One stop above the upper (outer) level. A stop just above the lower level sits inside the upper level, which is exactly where you should be selling more."
      },
      {
        type: "tf",
        q: "Putting your full short at the lower level with a stop just above it is a good way to trade stacked supply.",
        answer: false,
        explain: "Seiden says never do this. Your stop would sit right where the next level tells you to add, so a spike into the upper level takes you out before the fall."
      },
      {
        type: "spot",
        q: "Click the base of the UPPER supply level (the second vault door).",
        scene: {
          candles: [
            { o: 134, h: 138.1, l: 133.8, c: 137.71 },
            { o: 137.71, h: 141.59, l: 137.53, c: 141.43 },
            { o: 141.43, h: 145.23, l: 141.38, c: 145.14 },
            { o: 145.14, h: 149.14, l: 145.06, c: 148.86 },
            { o: 148.86, h: 152.86, l: 148.8, c: 152.57 },
            { o: 152.57, h: 156.76, l: 152.43, c: 156.29 },
            { o: 156.29, h: 160.12, l: 156.07, c: 160 },
            { o: 160, h: 160.29, l: 158.86, c: 159.15 },
            { o: 159.15, h: 160.5, l: 158.88, c: 160.22 },
            { o: 160.22, h: 160.35, l: 158.04, c: 158.11 },
            { o: 158.11, h: 158.15, l: 155.69, c: 156 },
            { o: 156, h: 156.9, l: 155.61, c: 156.76 },
            { o: 156.76, h: 157.22, l: 155.61, c: 155.78 },
            { o: 155.78, h: 155.94, l: 152.22, c: 152.34 },
            { o: 152.34, h: 152.43, l: 148.43, c: 148.89 },
            { o: 148.89, h: 148.99, l: 145.26, c: 145.45 },
            { o: 145.45, h: 145.55, l: 141.61, c: 142 },
            { o: 142, h: 143.33, l: 141.91, c: 143.25 },
            { o: 143.25, h: 144.79, l: 143.13, c: 144.5 },
            { o: 144.5, h: 144.56, l: 143.01, c: 143.05 },
            { o: 143.05, h: 143.09, l: 141.33, c: 141.6 },
            { o: 141.6, h: 144.25, l: 141.52, c: 143.85 },
            { o: 143.85, h: 146.19, l: 143.8, c: 146.09 },
            { o: 146.09, h: 148.56, l: 145.92, c: 148.34 },
            { o: 148.34, h: 150.88, l: 148.23, c: 150.59 },
            { o: 150.59, h: 152.89, l: 150.45, c: 152.83 },
            { o: 152.83, h: 155.31, l: 152.73, c: 155.08 },
            { o: 155.08, h: 156.23, l: 154.98, c: 156.08 },
            { o: 156.08, h: 159.5, l: 155.08, c: 155.18 },
            { o: 155.18, h: 155.28, l: 152.19, c: 152.33 },
            { o: 152.33, h: 152.41, l: 149.12, c: 149.48 },
            { o: 149.48, h: 149.64, l: 146.23, c: 146.63 },
            { o: 146.63, h: 146.72, l: 143.35, c: 143.78 },
            { o: 143.78, h: 143.83, l: 140.74, c: 140.93 }
          ],
          reveal: 17
        },
        answer: {
          from: 7,
          to: 8
        },
        explain: "The two small candles at the top of the rally, before the first drop. That pause is Supply 2; the lower pause is Supply 1."
      },
      {
        type: "mcq",
        q: "Who is on the other side of your short at stacked supply?",
        options: [
          "A professional who knows the level",
          "A buyer who bought after a strong rally into thick supply",
          "Nobody, the order fills by itself",
          "A seller covering a short at demand"
        ],
        answer: 1,
        explain: "The novice buyer bought after a rally and into supply. Seiden calls it a plastic hammer against two vault doors."
      },
      {
        type: "order",
        q: "Put the scale-in plan for stacked supply in order.",
        items: [
          "Spot supply with more supply just above",
          "Sell part at the lower level",
          "Sell the rest at the upper level",
          "Keep one stop above the upper level",
          "Cover at the prior low"
        ],
        explain: "Scale in across both doors and protect the whole trade with one stop beyond the outer door."
      },
      {
        type: "tf",
        q: "Levels on top of levels guarantee the trade will win.",
        answer: false,
        explain: "Certainty does not exist. Stacked levels only raise the odds a lot."
      }
    ],
    practice: [
      {
        prompt: "Two demand levels sit one just above the other. Price has rallied far and now falls back to the upper demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 176, h: 176.07, l: 171.8, c: 172.29 },
            { o: 172.29, h: 172.49, l: 168.36, c: 168.57 },
            { o: 168.57, h: 168.63, l: 164.81, c: 164.86 },
            { o: 164.86, h: 164.96, l: 160.57, c: 161.14 },
            { o: 161.14, h: 161.2, l: 157.3, c: 157.43 },
            { o: 157.43, h: 157.51, l: 153.46, c: 153.71 },
            { o: 153.71, h: 153.82, l: 149.64, c: 150 },
            { o: 150, h: 150.71, l: 149.55, c: 150.47 },
            { o: 150.47, h: 150.67, l: 149.52, c: 149.78 },
            { o: 149.78, h: 152.03, l: 149.64, c: 151.89 },
            { o: 151.89, h: 154.34, l: 151.83, c: 154 },
            { o: 154, h: 154.79, l: 153.54, c: 154.5 },
            { o: 154.5, h: 154.61, l: 153.61, c: 153.78 },
            { o: 153.78, h: 157.4, l: 153.65, c: 157.34 },
            { o: 157.34, h: 161, l: 157.22, c: 160.89 },
            { o: 160.89, h: 164.84, l: 160.75, c: 164.45 },
            { o: 164.45, h: 168.24, l: 164.37, c: 168 },
            { o: 168, h: 168.09, l: 166.64, c: 166.75 },
            { o: 166.75, h: 166.88, l: 165.36, c: 165.5 },
            { o: 165.5, h: 167.09, l: 165.4, c: 166.95 },
            { o: 166.95, h: 168.59, l: 166.81, c: 168.4 },
            { o: 168.4, h: 168.51, l: 166.13, c: 166.2 },
            { o: 166.2, h: 166.3, l: 163.96, c: 164 },
            { o: 164, h: 164.07, l: 161.57, c: 161.8 },
            { o: 161.8, h: 161.95, l: 159.21, c: 159.6 },
            { o: 159.6, h: 159.67, l: 157.14, c: 157.4 },
            { o: 157.4, h: 157.44, l: 154.79, c: 155.2 },
            { o: 155.2, h: 155.3, l: 154.05, c: 154.2 },
            { o: 154.2, h: 155.1, l: 150.17, c: 155 },
            { o: 155, h: 158.07, l: 154.85, c: 157.8 },
            { o: 157.8, h: 160.67, l: 157.63, c: 160.6 },
            { o: 160.6, h: 163.82, l: 160.43, c: 163.4 },
            { o: 163.4, h: 166.32, l: 163.27, c: 166.2 },
            { o: 166.2, h: 169.23, l: 166.06, c: 169 }
          ],
          zones: [
            {
              from: 7,
              top: 150.47,
              bottom: 149.52,
              kind: "demand",
              label: "Demand 2 (lower)"
            },
            {
              from: 11,
              top: 154.5,
              bottom: 153.54,
              kind: "demand",
              label: "Demand 1 (upper)"
            }
          ],
          reveal: 28
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Demand with more demand just below is the stronger, two-door level. Buy part at the upper level and the rest at the lower one, stop below the lower level. The dip into Demand 2 filled the second buy, and price rallied back to the prior high."
      },
      {
        prompt: "You will put the WHOLE short on at once. Pick the entry, the stop and the target.",
        scene: {
          candles: [
            { o: 130, h: 134.73, l: 129.78, c: 134.67 },
            { o: 134.67, h: 139.83, l: 134.6, c: 139.33 },
            { o: 139.33, h: 144.14, l: 139.17, c: 144 },
            { o: 144, h: 148.7, l: 143.77, c: 148.67 },
            { o: 148.67, h: 153.53, l: 148.56, c: 153.33 },
            { o: 153.33, h: 158.22, l: 153.19, c: 158 },
            { o: 158, h: 158.91, l: 157.65, c: 158.55 },
            { o: 158.55, h: 158.82, l: 157.45, c: 157.81 },
            { o: 157.81, h: 157.86, l: 155.83, c: 156.15 },
            { o: 156.15, h: 156.22, l: 154.33, c: 154.5 },
            { o: 154.5, h: 155.03, l: 154.39, c: 154.94 },
            { o: 154.94, h: 155.31, l: 153.58, c: 153.97 },
            { o: 153.97, h: 155.02, l: 153.64, c: 154.69 },
            { o: 154.69, h: 154.8, l: 151.33, c: 151.75 },
            { o: 151.75, h: 151.88, l: 148.62, c: 148.82 },
            { o: 148.82, h: 148.95, l: 145.8, c: 145.88 },
            { o: 145.88, h: 146.08, l: 142.79, c: 142.94 },
            { o: 142.94, h: 143.06, l: 139.68, c: 140 },
            { o: 140, h: 141.23, l: 139.9, c: 141 },
            { o: 141, h: 142.15, l: 140.94, c: 142 },
            { o: 142, h: 142.04, l: 140.72, c: 140.75 },
            { o: 140.75, h: 140.84, l: 139.34, c: 139.5 },
            { o: 139.5, h: 141.61, l: 139.46, c: 141.5 },
            { o: 141.5, h: 143.57, l: 141.33, c: 143.49 },
            { o: 143.49, h: 145.67, l: 143.39, c: 145.49 },
            { o: 145.49, h: 147.81, l: 145.43, c: 147.48 },
            { o: 147.48, h: 149.61, l: 147.38, c: 149.48 },
            { o: 149.48, h: 151.69, l: 149.44, c: 151.47 },
            { o: 151.47, h: 153.69, l: 151.3, c: 153.47 },
            { o: 153.47, h: 155.51, l: 153.37, c: 155.31 },
            { o: 155.31, h: 158.21, l: 155.21, c: 158.01 },
            { o: 158.01, h: 158.14, l: 154.66, c: 154.93 },
            { o: 154.93, h: 155, l: 151.66, c: 151.85 },
            { o: 151.85, h: 151.98, l: 148.47, c: 148.77 },
            { o: 148.77, h: 148.94, l: 145.19, c: 145.7 },
            { o: 145.7, h: 145.91, l: 142.25, c: 142.62 },
            { o: 142.62, h: 142.71, l: 139.12, c: 139.54 }
          ],
          zones: [
            {
              from: 6,
              top: 158.91,
              bottom: 157.81,
              kind: "supply",
              label: "Supply 2"
            },
            {
              from: 10,
              top: 155.31,
              bottom: 153.97,
              kind: "supply",
              label: "Supply 1"
            }
          ],
          reveal: 29
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 157.81,
          sl: 159.31,
          tp: 139.64
        },
        explain: "Option 2 from the lesson: enter everything at the upper level, stop above its top line, target the prior low. Price poked into Supply 1, then rose into Supply 2 and turned down without touching the stop."
      }
    ],
    cards: [
      {
        front: "Supply with supply just above it is...?",
        back: "Typically stronger than a lone supply level."
      },
      {
        front: "Demand with demand just below it is...?",
        back: "Typically stronger than a lone demand level."
      },
      {
        front: "Stacked levels: option 1 entry?",
        back: "Scale in: part at the inner level, the rest at the outer level."
      },
      {
        front: "Stacked levels: option 2 entry?",
        back: "Enter the whole position at the outer level."
      },
      {
        front: "Where is the stop with stacked supply?",
        back: "Above the upper (outer) level, never between the two."
      },
      {
        front: "What do we search for instead of certainty?",
        back: "Better odds."
      }
    ],
    mnemonic: "Two doors, one stop: sell both doors, stop above the top door."
  },
  {
    mentor: "seiden",
    n: 324,
    eli5: {
      oneLiner: "Buy at wholesale on bad news, sell at retail on good news.",
      story: "A shop owner buys toys cheap from the factory and sells them dear in the store. The factory price is demand, the store price is supply. In 2009 the news was the worst in decades, and the S&P fell all the way back to its old factory price. Seiden bought there while everyone else sold. A year later price was near the store price, so he expected it to stop.",
      analogy: "It is like buying winter coats in summer when nobody wants them, then selling them when the first snow falls and everyone panics for a coat."
    },
    bigIdeas: [
      "Profit margin = distance from fresh demand to the next fresh supply.",
      "Zoom into a big higher timeframe level to find the exact levels inside it.",
      "Bad news at demand means look to buy; good news at supply means look to sell."
    ],
    steps: [
      {
        title: "Wholesale: the base that launched the rally",
        narration: "Long ago price paused for two candles and then rallied hard for years. Demand was much bigger than supply at that pause. That is wholesale demand on the monthly chart.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          highlight: {
            from: 6,
            to: 7,
            label: "wholesale base"
          },
          reveal: 17
        }
      },
      {
        title: "Retail: where the collapse began",
        narration: "At the top price paused and fell, paused again and fell harder. Those pauses are retail supply. Zoom in like a doctor taking more x-rays of one elbow: the big monthly area holds two supply levels, one on top of the other.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 17,
              top: 186.91,
              bottom: 185.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 21,
              top: 180.34,
              bottom: 179.34,
              kind: "supply",
              label: "Supply (retail, lower)"
            }
          ],
          highlight: {
            from: 17,
            to: 22,
            label: "origin of the collapse"
          },
          reveal: 26
        }
      },
      {
        title: "Terrible news, wholesale price",
        narration: "Price falls all the way back to wholesale demand while the news is the worst in decades. The crowd sells. The rule: bad news plus price at demand means a turn higher. Buy here.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 17,
              top: 186.91,
              bottom: 185.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 21,
              top: 180.34,
              bottom: 179.34,
              kind: "supply",
              label: "Supply (retail, lower)"
            }
          ],
          lines: [
            {
              y: 113.52,
              label: "Buy at demand",
              kind: "entry"
            }
          ],
          notes: [
            {
              x: 28,
              y: 135.52,
              text: "bad news: crowd sells"
            }
          ],
          highlight: {
            from: 26,
            to: 31,
            label: "worst news"
          },
          reveal: 33
        }
      },
      {
        title: "Measure the profit margin",
        narration: "The profit margin is the distance from fresh demand up to the next fresh supply. Here it is huge, so the reward is many times the risk. That is why this was the ideal long-term buy.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 17,
              top: 186.91,
              bottom: 185.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 21,
              top: 180.34,
              bottom: 179.34,
              kind: "supply",
              label: "Supply (retail, lower)"
            }
          ],
          lines: [
            {
              y: 113.52,
              label: "Buy at demand",
              kind: "entry"
            },
            {
              y: 179.34,
              label: "Target: lower supply",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 28,
              y: 135.52,
              text: "bad news: crowd sells"
            },
            {
              x: 33,
              y: 146.43,
              text: "huge profit margin"
            }
          ],
          reveal: 33
        }
      },
      {
        title: "The rally meets retail supply",
        narration: "Price rallies for months and reaches the lower of the two stacked supply levels as the news turns good. Good news plus price at supply means a turn lower. If it breaks through, simply buy pullbacks to the new demand.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 17,
              top: 186.91,
              bottom: 185.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 21,
              top: 180.34,
              bottom: 179.34,
              kind: "supply",
              label: "Supply (retail, lower)"
            }
          ],
          lines: [
            {
              y: 113.52,
              label: "Buy at demand",
              kind: "entry"
            },
            {
              y: 179.34,
              label: "Target: lower supply",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 28,
              y: 135.52,
              text: "bad news: crowd sells"
            },
            {
              x: 33,
              y: 146.43,
              text: "huge profit margin"
            }
          ],
          highlight: {
            from: 41,
            to: 44,
            label: "stall at supply"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How does Seiden measure the profit margin of a buy?",
        options: [
          "From entry to the moving average",
          "From the fresh demand to the next fresh supply",
          "Ten percent above entry",
          "From the stop to the entry"
        ],
        answer: 1,
        explain: "The room between fresh demand and the opposing fresh supply is the profit margin. In March 2009 it was enormous."
      },
      {
        type: "tf",
        q: "Seiden agrees with Wall Street that the market cannot be timed.",
        answer: false,
        explain: "He disagrees. Real supply and demand analysis lets you time turns in advance with good odds."
      },
      {
        type: "spot",
        q: "Click the wholesale demand base that the 2009-style collapse returned to.",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          reveal: 33
        },
        answer: {
          from: 6,
          to: 7
        },
        explain: "The small pause at the bottom left launched the long rally. Price came back to it on terrible news: wholesale price."
      },
      {
        type: "mcq",
        q: "The news is awful and price has dropped into fresh monthly demand. What does the rule say?",
        options: [
          "Sell, the news is bad",
          "Wait for good news first",
          "Look to buy: bad news plus demand means a turn higher",
          "Do nothing ever on monthly charts"
        ],
        answer: 2,
        explain: "Bad news pushes the crowd to sell at wholesale prices. Price at demand means a turn higher is likely."
      },
      {
        type: "order",
        q: "Order Seiden's steps for a big higher timeframe level.",
        items: [
          "Spot the large monthly level",
          "Zoom into a smaller timeframe",
          "Find the exact proximal and distal levels inside it",
          "Plan the trade at the inner level",
          "If it fails, buy pullbacks to new demand"
        ],
        explain: "Like several x-rays of one elbow: look at the same big area from smaller timeframes to find the levels inside."
      },
      {
        type: "tf",
        q: "If price breaks up through the monthly supply, Seiden says to give up on the market.",
        answer: false,
        explain: "If he is wrong, he simply buys pullbacks to the new demand levels that form."
      }
    ],
    practice: [
      {
        prompt: "Price fell back to the old base that launched a huge rally. Headlines say things have never been worse. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 143.71, c: 143.83 },
            { o: 143.83, h: 143.92, l: 137.25, c: 137.67 },
            { o: 137.67, h: 137.9, l: 131.25, c: 131.5 },
            { o: 131.5, h: 131.56, l: 125.22, c: 125.33 },
            { o: 125.33, h: 125.52, l: 118.74, c: 119.17 },
            { o: 119.17, h: 119.33, l: 112.74, c: 113 },
            { o: 113, h: 113.96, l: 112.68, c: 113.52 },
            { o: 113.52, h: 113.75, l: 112.52, c: 112.81 },
            { o: 112.81, h: 125.37, l: 112.55, c: 125.21 },
            { o: 125.21, h: 137.88, l: 124.96, c: 137.6 },
            { o: 137.6, h: 150.6, l: 137.57, c: 150 },
            { o: 150, h: 156.47, l: 149.9, c: 156.13 },
            { o: 156.13, h: 162.91, l: 155.96, c: 162.29 },
            { o: 162.29, h: 168.4, l: 162.23, c: 168.19 },
            { o: 168.19, h: 174.08, l: 167.97, c: 174.02 },
            { o: 174.02, h: 179.98, l: 173.81, c: 179.77 },
            { o: 179.77, h: 186.56, l: 179.7, c: 186 },
            { o: 186, h: 186.91, l: 185.67, c: 186.44 },
            { o: 186.44, h: 186.67, l: 185.52, c: 185.81 },
            { o: 185.81, h: 185.84, l: 182.68, c: 182.9 },
            { o: 182.9, h: 183.08, l: 179.85, c: 180 },
            { o: 180, h: 180.29, l: 179.03, c: 179.34 },
            { o: 179.34, h: 180.34, l: 179.04, c: 180.19 },
            { o: 180.19, h: 180.45, l: 174.03, c: 174.13 },
            { o: 174.13, h: 174.25, l: 168.03, c: 168.06 },
            { o: 168.06, h: 168.2, l: 161.41, c: 162 },
            { o: 162, h: 162.13, l: 154.35, c: 154.61 },
            { o: 154.61, h: 154.67, l: 146.87, c: 147.09 },
            { o: 147.09, h: 147.29, l: 138.11, c: 138.63 },
            { o: 138.63, h: 138.76, l: 130.12, c: 130.59 },
            { o: 130.59, h: 130.78, l: 121.97, c: 122.3 },
            { o: 122.3, h: 122.43, l: 113.93, c: 114.52 },
            { o: 114.52, h: 114.62, l: 112.62, c: 113.12 },
            { o: 113.12, h: 122.02, l: 112.91, c: 121.93 },
            { o: 121.93, h: 129.2, l: 121.75, c: 129.16 },
            { o: 129.16, h: 138.15, l: 128.97, c: 137.74 },
            { o: 137.74, h: 145.87, l: 137.68, c: 145.84 },
            { o: 145.84, h: 154.84, l: 145.77, c: 154.4 },
            { o: 154.4, h: 161.49, l: 154.28, c: 161.07 },
            { o: 161.07, h: 169.91, l: 160.85, c: 169.31 },
            { o: 169.31, h: 178.22, l: 169.15, c: 178.14 },
            { o: 178.14, h: 180.04, l: 178.04, c: 179.64 },
            { o: 179.64, h: 179.83, l: 176.03, c: 176.54 },
            { o: 176.54, h: 176.65, l: 173.39, c: 173.44 },
            { o: 173.44, h: 173.65, l: 170.21, c: 170.34 }
          ],
          zones: [
            {
              from: 6,
              top: 113.52,
              bottom: 112.52,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 17,
              top: 186.91,
              bottom: 185.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 21,
              top: 180.34,
              bottom: 179.34,
              kind: "supply",
              label: "Supply (retail, lower)"
            }
          ],
          reveal: 33
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Bad news plus price at fresh wholesale demand, with a huge margin up to supply. Buy. Price turned higher and rallied for months."
      },
      {
        prompt: "After a long rally price has reached the retail supply where the last collapse began. The news is now good. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 132.77, l: 119.95, c: 132.4 },
            { o: 132.4, h: 145.21, l: 132.33, c: 144.8 },
            { o: 144.8, h: 157.62, l: 144.54, c: 157.2 },
            { o: 157.2, h: 170.11, l: 157.08, c: 169.6 },
            { o: 169.6, h: 182.05, l: 169.41, c: 182 },
            { o: 182, h: 182.69, l: 181.86, c: 182.54 },
            { o: 182.54, h: 182.78, l: 181.48, c: 181.83 },
            { o: 181.83, h: 181.9, l: 170.75, c: 171.37 },
            { o: 171.37, h: 171.44, l: 160.86, c: 160.92 },
            { o: 160.92, h: 160.98, l: 150.37, c: 150.46 },
            { o: 150.46, h: 150.51, l: 139.41, c: 140 },
            { o: 140, h: 143.81, l: 139.89, c: 143.33 },
            { o: 143.33, h: 147.07, l: 143.25, c: 146.67 },
            { o: 146.67, h: 150.11, l: 146.59, c: 150 },
            { o: 150, h: 150.58, l: 149.79, c: 150.46 },
            { o: 150.46, h: 150.73, l: 149.48, c: 149.83 },
            { o: 149.83, h: 156.21, l: 149.77, c: 155.86 },
            { o: 155.86, h: 161.21, l: 155.73, c: 160.69 },
            { o: 160.69, h: 166.35, l: 160.48, c: 166.18 },
            { o: 166.18, h: 172.23, l: 166, c: 172 },
            { o: 172, h: 175.13, l: 171.88, c: 174.94 },
            { o: 174.94, h: 178.05, l: 174.88, c: 177.89 },
            { o: 177.89, h: 181.12, l: 177.78, c: 180.83 },
            { o: 180.83, h: 182.63, l: 180.73, c: 182.23 },
            { o: 182.23, h: 182.38, l: 176.09, c: 176.67 },
            { o: 176.67, h: 176.84, l: 170.91, c: 171.12 },
            { o: 171.12, h: 171.17, l: 165.39, c: 165.56 },
            { o: 165.56, h: 165.7, l: 159.63, c: 160 }
          ],
          zones: [
            {
              from: 5,
              top: 182.78,
              bottom: 181.83,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 14,
              top: 150.46,
              bottom: 149.48,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Good news plus price at fresh supply means a turn lower. The buyers here are buying after a long rally into retail prices. Price turned down."
      }
    ],
    cards: [
      {
        front: "Profit margin (Seiden)?",
        back: "The distance from fresh demand to the next fresh opposing supply (or the reverse)."
      },
      {
        front: "Bad news + price at demand =",
        back: "A likely turn higher."
      },
      {
        front: "Good news + price at supply =",
        back: "A likely turn lower."
      },
      {
        front: "Why zoom into a big monthly zone?",
        back: "To find the exact levels inside it, like several x-rays of the same elbow."
      },
      {
        front: "What if the forecast level fails?",
        back: "Buy pullbacks to the new demand levels."
      },
      {
        front: "Wholesale and retail mean?",
        back: "Wholesale = demand (buy), retail = supply (sell)."
      }
    ],
    mnemonic: "Bad news, buy shoes; good news, sell shoes: wholesale on fear, retail on cheer."
  },
  {
    mentor: "seiden",
    n: 328,
    eli5: {
      oneLiner: "Strong level plus a band poke plus room to run makes an All Star.",
      story: "Think of a rubber band stretched way out. Let go and it snaps back. When price races back into a strong supply level and pokes outside the upper Bollinger Band, it is stretched AND it hit a wall of sellers. Seiden sells there and buys back just before the demand level below. Great news on the way up does not change it.",
      analogy: "A ball thrown hard at a wall far from where you stand: it hits the wall (supply), it is going too fast to stay (band), and it rolls all the way back to you (margin)."
    },
    bigIdeas: [
      "All Star = strong level + outer band pierce + big profit margin, all together.",
      "Place the target just before the opposing level, not at it.",
      "Good news does not beat a level where supply is bigger than demand."
    ],
    steps: [
      {
        title: "1. A strong supply level",
        narration: "Price paused for two candles and fell hard and far. A sharp, fast drop means a big imbalance: much more supply than demand. That is the first tool.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 12,
            to: 13,
            label: "base"
          },
          reveal: 17
        }
      },
      {
        title: "2. The opposing demand and the margin",
        narration: "Price based low and launched a fast spike up. That base is the demand below. The space between supply and demand is the profit margin, and it is big.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 20,
              top: 142.28,
              bottom: 140.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          highlight: {
            from: 20,
            to: 22,
            label: "demand"
          },
          reveal: 24
        }
      },
      {
        title: "3. The band pierce",
        narration: "Price spikes back into supply and pokes outside the upper Bollinger Band. Now price is at excess supply AND at a statistical extreme likely to snap back to the mean. Both tools agree: short at the bottom line of supply.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 20,
              top: 142.28,
              bottom: 140.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 159.55,
              label: "Short (proximal)",
              kind: "entry"
            },
            {
              y: 161.04,
              label: "Stop above supply",
              kind: "sl"
            }
          ],
          trendlines: [
            {
              x1: 12,
              y1: 161.24,
              x2: 13,
              y2: 162.94,
              label: "upper band"
            },
            {
              x1: 13,
              y1: 162.94,
              x2: 14,
              y2: 162.98
            },
            {
              x1: 14,
              y1: 162.98,
              x2: 15,
              y2: 163.22
            },
            {
              x1: 15,
              y1: 163.22,
              x2: 16,
              y2: 164.71
            },
            {
              x1: 16,
              y1: 164.71,
              x2: 17,
              y2: 165.73
            },
            {
              x1: 17,
              y1: 165.73,
              x2: 18,
              y2: 166.52
            },
            {
              x1: 18,
              y1: 166.52,
              x2: 19,
              y2: 166.46
            },
            {
              x1: 19,
              y1: 166.46,
              x2: 20,
              y2: 165.12
            },
            {
              x1: 20,
              y1: 165.12,
              x2: 21,
              y2: 162.21
            },
            {
              x1: 21,
              y1: 162.21,
              x2: 22,
              y2: 158.33
            },
            {
              x1: 22,
              y1: 158.33,
              x2: 23,
              y2: 157.52
            },
            {
              x1: 23,
              y1: 157.52,
              x2: 24,
              y2: 160
            },
            {
              x1: 24,
              y1: 160,
              x2: 25,
              y2: 162.1
            },
            {
              x1: 25,
              y1: 162.1,
              x2: 26,
              y2: 163.3
            },
            {
              x1: 26,
              y1: 163.3,
              x2: 27,
              y2: 163.64
            },
            {
              x1: 27,
              y1: 163.64,
              x2: 28,
              y2: 163.49
            },
            {
              x1: 28,
              y1: 163.49,
              x2: 29,
              y2: 163.34
            },
            {
              x1: 29,
              y1: 163.34,
              x2: 30,
              y2: 163.22
            },
            {
              x1: 30,
              y1: 163.22,
              x2: 31,
              y2: 162.87
            }
          ],
          highlight: {
            from: 24,
            to: 24,
            label: "outside the band"
          },
          reveal: 25
        }
      },
      {
        title: "The target goes just before demand",
        narration: "Put the buy-back order just ABOVE the demand, not at it. At demand many traders compete to buy, so you want to be filled in front of them.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 20,
              top: 142.28,
              bottom: 140.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 159.55,
              label: "Short (proximal)",
              kind: "entry"
            },
            {
              y: 161.04,
              label: "Stop above supply",
              kind: "sl"
            },
            {
              y: 142.88,
              label: "Target: just above demand",
              kind: "tp"
            }
          ],
          trendlines: [
            {
              x1: 12,
              y1: 161.24,
              x2: 13,
              y2: 162.94,
              label: "upper band"
            },
            {
              x1: 13,
              y1: 162.94,
              x2: 14,
              y2: 162.98
            },
            {
              x1: 14,
              y1: 162.98,
              x2: 15,
              y2: 163.22
            },
            {
              x1: 15,
              y1: 163.22,
              x2: 16,
              y2: 164.71
            },
            {
              x1: 16,
              y1: 164.71,
              x2: 17,
              y2: 165.73
            },
            {
              x1: 17,
              y1: 165.73,
              x2: 18,
              y2: 166.52
            },
            {
              x1: 18,
              y1: 166.52,
              x2: 19,
              y2: 166.46
            },
            {
              x1: 19,
              y1: 166.46,
              x2: 20,
              y2: 165.12
            },
            {
              x1: 20,
              y1: 165.12,
              x2: 21,
              y2: 162.21
            },
            {
              x1: 21,
              y1: 162.21,
              x2: 22,
              y2: 158.33
            },
            {
              x1: 22,
              y1: 158.33,
              x2: 23,
              y2: 157.52
            },
            {
              x1: 23,
              y1: 157.52,
              x2: 24,
              y2: 160
            },
            {
              x1: 24,
              y1: 160,
              x2: 25,
              y2: 162.1
            },
            {
              x1: 25,
              y1: 162.1,
              x2: 26,
              y2: 163.3
            },
            {
              x1: 26,
              y1: 163.3,
              x2: 27,
              y2: 163.64
            },
            {
              x1: 27,
              y1: 163.64,
              x2: 28,
              y2: 163.49
            },
            {
              x1: 28,
              y1: 163.49,
              x2: 29,
              y2: 163.34
            },
            {
              x1: 29,
              y1: 163.34,
              x2: 30,
              y2: 163.22
            },
            {
              x1: 30,
              y1: 163.22,
              x2: 31,
              y2: 162.87
            }
          ],
          reveal: 25
        }
      },
      {
        title: "Mean reversion",
        narration: "Price falls back quickly to the target. However good the news was on that spike, price fell because it reached a level where supply was bigger than demand.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 20,
              top: 142.28,
              bottom: 140.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 159.55,
              label: "Short (proximal)",
              kind: "entry"
            },
            {
              y: 161.04,
              label: "Stop above supply",
              kind: "sl"
            },
            {
              y: 142.88,
              label: "Target: just above demand",
              kind: "tp"
            }
          ],
          trendlines: [
            {
              x1: 12,
              y1: 161.24,
              x2: 13,
              y2: 162.94,
              label: "upper band"
            },
            {
              x1: 13,
              y1: 162.94,
              x2: 14,
              y2: 162.98
            },
            {
              x1: 14,
              y1: 162.98,
              x2: 15,
              y2: 163.22
            },
            {
              x1: 15,
              y1: 163.22,
              x2: 16,
              y2: 164.71
            },
            {
              x1: 16,
              y1: 164.71,
              x2: 17,
              y2: 165.73
            },
            {
              x1: 17,
              y1: 165.73,
              x2: 18,
              y2: 166.52
            },
            {
              x1: 18,
              y1: 166.52,
              x2: 19,
              y2: 166.46
            },
            {
              x1: 19,
              y1: 166.46,
              x2: 20,
              y2: 165.12
            },
            {
              x1: 20,
              y1: 165.12,
              x2: 21,
              y2: 162.21
            },
            {
              x1: 21,
              y1: 162.21,
              x2: 22,
              y2: 158.33
            },
            {
              x1: 22,
              y1: 158.33,
              x2: 23,
              y2: 157.52
            },
            {
              x1: 23,
              y1: 157.52,
              x2: 24,
              y2: 160
            },
            {
              x1: 24,
              y1: 160,
              x2: 25,
              y2: 162.1
            },
            {
              x1: 25,
              y1: 162.1,
              x2: 26,
              y2: 163.3
            },
            {
              x1: 26,
              y1: 163.3,
              x2: 27,
              y2: 163.64
            },
            {
              x1: 27,
              y1: 163.64,
              x2: 28,
              y2: 163.49
            },
            {
              x1: 28,
              y1: 163.49,
              x2: 29,
              y2: 163.34
            },
            {
              x1: 29,
              y1: 163.34,
              x2: 30,
              y2: 163.22
            },
            {
              x1: 30,
              y1: 163.22,
              x2: 31,
              y2: 162.87
            },
            {
              x1: 12,
              y1: 153.52,
              x2: 13,
              y2: 154.35,
              label: "band midline"
            },
            {
              x1: 13,
              y1: 154.35,
              x2: 14,
              y2: 154.72
            },
            {
              x1: 14,
              y1: 154.72,
              x2: 15,
              y2: 154.53
            },
            {
              x1: 15,
              y1: 154.53,
              x2: 16,
              y2: 153.85
            },
            {
              x1: 16,
              y1: 153.85,
              x2: 17,
              y2: 153.22
            },
            {
              x1: 17,
              y1: 153.22,
              x2: 18,
              y2: 152.22
            },
            {
              x1: 18,
              y1: 152.22,
              x2: 19,
              y2: 150.92
            },
            {
              x1: 19,
              y1: 150.92,
              x2: 20,
              y2: 149.42
            },
            {
              x1: 20,
              y1: 149.42,
              x2: 21,
              y2: 147.52
            },
            {
              x1: 21,
              y1: 147.52,
              x2: 22,
              y2: 145.74
            },
            {
              x1: 22,
              y1: 145.74,
              x2: 23,
              y2: 145.59
            },
            {
              x1: 23,
              y1: 145.59,
              x2: 24,
              y2: 146.14
            },
            {
              x1: 24,
              y1: 146.14,
              x2: 25,
              y2: 146.92
            },
            {
              x1: 25,
              y1: 146.92,
              x2: 26,
              y2: 147.94
            },
            {
              x1: 26,
              y1: 147.94,
              x2: 27,
              y2: 148.65
            },
            {
              x1: 27,
              y1: 148.65,
              x2: 28,
              y2: 149.12
            },
            {
              x1: 28,
              y1: 149.12,
              x2: 29,
              y2: 149.28
            },
            {
              x1: 29,
              y1: 149.28,
              x2: 30,
              y2: 149.42
            },
            {
              x1: 30,
              y1: 149.42,
              x2: 31,
              y2: 149.75
            }
          ],
          highlight: {
            from: 25,
            to: 29,
            label: "snap back"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which three things make an All Star short?",
        options: [
          "Rising MA, good news, new high",
          "Strong supply, price piercing the upper band, big profit margin",
          "Many candles at the level, high volume, upper band",
          "Price under the midline, red candle, gap"
        ],
        answer: 1,
        explain: "Strong supply level, outside the upper band on arrival, and significant profit margin down to demand."
      },
      {
        type: "mcq",
        q: "Where does the cover (buy-back) order for an All Star short go?",
        options: [
          "Right at the demand level",
          "Below the demand level",
          "Just above the demand level",
          "At the entry price"
        ],
        answer: 2,
        explain: "Just in front of demand, because at demand there is competition to buy and you may not get filled."
      },
      {
        type: "tf",
        q: "If the company just posted great earnings, the All Star short at supply is cancelled.",
        answer: false,
        explain: "Seiden's INTC example: great earnings carried price into supply and outside the band, and it fell anyway."
      },
      {
        type: "spot",
        q: "Click the candle that gives the All Star short.",
        scene: {
          candles: [
            { o: 150, h: 150.33, l: 149.9, c: 150.14 },
            { o: 150.14, h: 151.01, l: 150.07, c: 150.87 },
            { o: 150.87, h: 151.81, l: 150.78, c: 151.68 },
            { o: 151.68, h: 152.16, l: 151.64, c: 152 },
            { o: 152, h: 152.1, l: 150.67, c: 150.78 },
            { o: 150.78, h: 150.88, l: 150.49, c: 150.58 },
            { o: 150.58, h: 150.62, l: 149.63, c: 149.82 },
            { o: 149.82, h: 149.91, l: 148.94, c: 149 },
            { o: 149, h: 151.79, l: 148.83, c: 151.75 },
            { o: 151.75, h: 154.7, l: 151.62, c: 154.5 },
            { o: 154.5, h: 157.41, l: 154.43, c: 157.25 },
            { o: 157.25, h: 160.16, l: 157.08, c: 160 },
            { o: 160, h: 160.18, l: 159.15, c: 159.55 },
            { o: 159.55, h: 160.64, l: 159.2, c: 160.22 },
            { o: 160.22, h: 160.44, l: 154.11, c: 154.48 },
            { o: 154.48, h: 154.57, l: 148.33, c: 148.74 },
            { o: 148.74, h: 148.96, l: 142.73, c: 143 },
            { o: 143, h: 143.06, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.82, l: 141.68, c: 141.72 },
            { o: 141.72, h: 141.8, l: 141.36, c: 141.5 },
            { o: 141.5, h: 142.42, l: 141.02, c: 142.28 },
            { o: 142.28, h: 142.61, l: 140.53, c: 140.97 },
            { o: 140.97, h: 141.97, l: 140.61, c: 141.72 },
            { o: 141.72, h: 159.06, l: 141.64, c: 158.75 },
            { o: 158.75, h: 160.59, l: 158.65, c: 159.95 },
            { o: 159.95, h: 160.13, l: 156.54, c: 156.58 },
            { o: 156.58, h: 156.7, l: 152.92, c: 153.2 },
            { o: 153.2, h: 153.39, l: 149.31, c: 149.83 },
            { o: 149.83, h: 149.9, l: 146.12, c: 146.45 },
            { o: 146.45, h: 146.53, l: 142.62, c: 143.08 },
            { o: 143.08, h: 143.72, l: 142.99, c: 143.68 },
            { o: 143.68, h: 144.45, l: 143.62, c: 144.28 }
          ],
          zones: [
            {
              from: 12,
              top: 160.64,
              bottom: 159.55,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 20,
              top: 142.28,
              bottom: 140.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          trendlines: [
            {
              x1: 12,
              y1: 161.24,
              x2: 13,
              y2: 162.94,
              label: "upper band"
            },
            {
              x1: 13,
              y1: 162.94,
              x2: 14,
              y2: 162.98
            },
            {
              x1: 14,
              y1: 162.98,
              x2: 15,
              y2: 163.22
            },
            {
              x1: 15,
              y1: 163.22,
              x2: 16,
              y2: 164.71
            },
            {
              x1: 16,
              y1: 164.71,
              x2: 17,
              y2: 165.73
            },
            {
              x1: 17,
              y1: 165.73,
              x2: 18,
              y2: 166.52
            },
            {
              x1: 18,
              y1: 166.52,
              x2: 19,
              y2: 166.46
            },
            {
              x1: 19,
              y1: 166.46,
              x2: 20,
              y2: 165.12
            },
            {
              x1: 20,
              y1: 165.12,
              x2: 21,
              y2: 162.21
            },
            {
              x1: 21,
              y1: 162.21,
              x2: 22,
              y2: 158.33
            },
            {
              x1: 22,
              y1: 158.33,
              x2: 23,
              y2: 157.52
            },
            {
              x1: 23,
              y1: 157.52,
              x2: 24,
              y2: 160
            },
            {
              x1: 24,
              y1: 160,
              x2: 25,
              y2: 162.1
            },
            {
              x1: 25,
              y1: 162.1,
              x2: 26,
              y2: 163.3
            },
            {
              x1: 26,
              y1: 163.3,
              x2: 27,
              y2: 163.64
            },
            {
              x1: 27,
              y1: 163.64,
              x2: 28,
              y2: 163.49
            },
            {
              x1: 28,
              y1: 163.49,
              x2: 29,
              y2: 163.34
            },
            {
              x1: 29,
              y1: 163.34,
              x2: 30,
              y2: 163.22
            },
            {
              x1: 30,
              y1: 163.22,
              x2: 31,
              y2: 162.87
            }
          ],
          reveal: 25
        },
        answer: {
          from: 24,
          to: 24
        },
        explain: "The spike candle that reaches supply while poking outside the upper band. Strong level, statistical extreme and a big margin below."
      },
      {
        type: "tf",
        q: "For an All Star buy, price should be at strong demand and pierce the LOWER band.",
        answer: true,
        explain: "The buy rules are the mirror: strong demand, lower band pierced, big margin up to supply."
      },
      {
        type: "order",
        q: "Order the All Star short plan.",
        items: [
          "Find supply with a sharp, far drop",
          "Check the profit margin down to demand",
          "Wait for price to return and pierce the upper band",
          "Sell short at supply, stop above it",
          "Cover just above demand"
        ],
        explain: "Level first, margin second, band pierce as the trigger, then exits placed before the competition."
      }
    ],
    practice: [
      {
        prompt: "Price has crashed into a strong demand and is poking below the lower band. There is a lot of room up to supply. What do you do?",
        scene: {
          candles: [
            { o: 150, h: 150.1, l: 149.67, c: 149.86 },
            { o: 149.86, h: 149.93, l: 148.99, c: 149.13 },
            { o: 149.13, h: 149.22, l: 148.19, c: 148.32 },
            { o: 148.32, h: 148.36, l: 147.84, c: 148 },
            { o: 148, h: 149.33, l: 147.9, c: 149.22 },
            { o: 149.22, h: 149.51, l: 149.12, c: 149.42 },
            { o: 149.42, h: 150.37, l: 149.38, c: 150.18 },
            { o: 150.18, h: 151.06, l: 150.09, c: 151 },
            { o: 151, h: 151.17, l: 148.21, c: 148.25 },
            { o: 148.25, h: 148.38, l: 145.3, c: 145.5 },
            { o: 145.5, h: 145.57, l: 142.59, c: 142.75 },
            { o: 142.75, h: 142.92, l: 139.84, c: 140 },
            { o: 140, h: 140.85, l: 139.82, c: 140.45 },
            { o: 140.45, h: 140.8, l: 139.36, c: 139.78 },
            { o: 139.78, h: 145.89, l: 139.56, c: 145.52 },
            { o: 145.52, h: 151.67, l: 145.43, c: 151.26 },
            { o: 151.26, h: 157.27, l: 151.04, c: 157 },
            { o: 157, h: 157.41, l: 156.94, c: 157.25 },
            { o: 157.25, h: 158.32, l: 157.18, c: 158.28 },
            { o: 158.28, h: 158.64, l: 158.2, c: 158.5 },
            { o: 158.5, h: 158.98, l: 157.58, c: 157.72 },
            { o: 157.72, h: 159.47, l: 157.39, c: 159.03 },
            { o: 159.03, h: 159.39, l: 158.03, c: 158.28 },
            { o: 158.28, h: 158.36, l: 140.94, c: 141.25 },
            { o: 141.25, h: 141.35, l: 139.41, c: 140.05 },
            { o: 140.05, h: 143.46, l: 139.87, c: 143.42 },
            { o: 143.42, h: 147.08, l: 143.3, c: 146.8 },
            { o: 146.8, h: 150.69, l: 146.61, c: 150.17 },
            { o: 150.17, h: 153.88, l: 150.1, c: 153.55 },
            { o: 153.55, h: 157.38, l: 153.47, c: 156.92 },
            { o: 156.92, h: 157.01, l: 156.28, c: 156.32 },
            { o: 156.32, h: 156.38, l: 155.55, c: 155.72 }
          ],
          zones: [
            {
              from: 12,
              top: 140.45,
              bottom: 139.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 20,
              top: 159.47,
              bottom: 157.72,
              kind: "supply",
              label: "Supply"
            }
          ],
          trendlines: [
            {
              x1: 12,
              y1: 138.76,
              x2: 13,
              y2: 137.06,
              label: "lower band"
            },
            {
              x1: 13,
              y1: 137.06,
              x2: 14,
              y2: 137.02
            },
            {
              x1: 14,
              y1: 137.02,
              x2: 15,
              y2: 136.78
            },
            {
              x1: 15,
              y1: 136.78,
              x2: 16,
              y2: 135.29
            },
            {
              x1: 16,
              y1: 135.29,
              x2: 17,
              y2: 134.27
            },
            {
              x1: 17,
              y1: 134.27,
              x2: 18,
              y2: 133.48
            },
            {
              x1: 18,
              y1: 133.48,
              x2: 19,
              y2: 133.54
            },
            {
              x1: 19,
              y1: 133.54,
              x2: 20,
              y2: 134.88
            },
            {
              x1: 20,
              y1: 134.88,
              x2: 21,
              y2: 137.79
            },
            {
              x1: 21,
              y1: 137.79,
              x2: 22,
              y2: 141.67
            },
            {
              x1: 22,
              y1: 141.67,
              x2: 23,
              y2: 142.48
            },
            {
              x1: 23,
              y1: 142.48,
              x2: 24,
              y2: 140
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "All Star buy: strong demand, lower band pierced, big margin. Price snapped back up to just under supply."
      }
    ],
    cards: [
      {
        front: "The two tools of the All Star?",
        back: "Supply/demand levels and Bollinger Bands."
      },
      {
        front: "All Star short trigger?",
        back: "Price returns to strong supply and pierces the upper band."
      },
      {
        front: "Where to put the profit target?",
        back: "Just before the opposing level, not at it."
      },
      {
        front: "Why not at the opposing level?",
        back: "Competition to buy there; your order may not fill."
      },
      {
        front: "Why is it called \"Lite\"?",
        back: "Two more rules are kept for XLT members."
      }
    ],
    mnemonic: "Level, Poke, Room: strong level, band poke, room to the next level."
  },
  {
    mentor: "seiden",
    n: 331,
    eli5: {
      oneLiner: "Ask four questions about every level before you trust it.",
      story: "A good detective asks the same questions at every scene. Seiden asks four about every level: how did price leave, how long did it stay, is there another level on top, and how far did it go before coming back. A quiet spot with only a couple of candles is where one side was missing. If the answers are weak, it is not a level at all.",
      analogy: "It is like checking a used car: how it drives away, how long it sat in the lot, whether it has a spare, and how far it can go on a tank."
    },
    bigIdeas: [
      "Four questions: how it left, time at the level, levels on top, distance before return.",
      "Few candles at a level means a big imbalance. Many candles means balance.",
      "Old supply becomes demand only with a strong break, big margin and good higher timeframe location."
    ],
    steps: [
      {
        title: "Q1: How did price leave?",
        narration: "From this little pause price fell with two big red candles. A strong move away shows supply was far bigger than demand.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          highlight: {
            from: 20,
            to: 21,
            label: "strong exit"
          },
          reveal: 22
        }
      },
      {
        title: "Q2: How much time was spent there?",
        narration: "Only two candles. Where supply and demand are badly out of balance, very few trades happen, so there are few candles. The busy area on the left had many candles: buyers and sellers agreed there, so it is not a level.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          zones: [
            {
              from: 18,
              top: 160.97,
              bottom: 159.78,
              kind: "supply",
              label: "Supply: few candles"
            },
            {
              from: 4,
              top: 151.5,
              bottom: 148.91,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          highlight: {
            from: 18,
            to: 19,
            label: "2 candles"
          },
          reveal: 22
        }
      },
      {
        title: "Q3 and Q4: stacked levels and distance",
        narration: "Check for another level on top. Then ask how far price went before coming back: here it fell a long way. That long fall shows where buyers were absorbed, and it is the profit margin.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          zones: [
            {
              from: 18,
              top: 160.97,
              bottom: 159.78,
              kind: "supply",
              label: "Supply: few candles"
            },
            {
              from: 4,
              top: 151.5,
              bottom: 148.91,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          notes: [
            {
              x: 26,
              y: 149.78,
              text: "far run = big margin"
            }
          ],
          highlight: {
            from: 22,
            to: 26,
            label: "distance"
          },
          reveal: 27
        }
      },
      {
        title: "Shop for a sale, not a rising average",
        narration: "Waiting for a rising moving average means buying after price is already expensive. Seiden finds where the trend begins with the levels themselves. Here the return to supply is the sell.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          zones: [
            {
              from: 18,
              top: 160.97,
              bottom: 159.78,
              kind: "supply",
              label: "Supply: few candles"
            },
            {
              from: 4,
              top: 151.5,
              bottom: 148.91,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          lines: [
            {
              y: 159.78,
              label: "Sell at supply",
              kind: "entry"
            },
            {
              y: 161.37,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 26,
              y: 149.78,
              text: "far run = big margin"
            }
          ],
          reveal: 34
        }
      },
      {
        title: "The answer on the chart",
        narration: "Price touched the quiet two-candle supply and turned down. All four questions said yes, which is why this level was taken and the busy one ignored.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          zones: [
            {
              from: 18,
              top: 160.97,
              bottom: 159.78,
              kind: "supply",
              label: "Supply: few candles"
            },
            {
              from: 4,
              top: 151.5,
              bottom: 148.91,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          lines: [
            {
              y: 159.78,
              label: "Sell at supply",
              kind: "entry"
            },
            {
              y: 161.37,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 26,
              y: 149.78,
              text: "far run = big margin"
            }
          ],
          highlight: {
            from: 34,
            to: 37,
            label: "turn"
          }
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put Seiden's four questions in the order he lists them.",
        items: [
          "How did price leave the level?",
          "How much time did price spend at the level?",
          "Are there levels on top of levels?",
          "How far did price move before returning?"
        ],
        explain: "These four questions decide which levels he takes and which he ignores."
      },
      {
        type: "tf",
        q: "The best turns come from areas with heavy, climactic volume and many candles.",
        answer: false,
        explain: "Seiden says the opposite: a big imbalance means one side is mostly missing, so there are few trades and few candles."
      },
      {
        type: "spot",
        q: "Click the base that Seiden would treat as a real supply level.",
        scene: {
          candles: [
            { o: 140, h: 143.16, l: 139.87, c: 142.74 },
            { o: 142.74, h: 145.6, l: 142.68, c: 145.22 },
            { o: 145.22, h: 147.98, l: 145.12, c: 147.73 },
            { o: 147.73, h: 150.18, l: 147.64, c: 150 },
            { o: 150, h: 150.22, l: 149.09, c: 149.25 },
            { o: 149.25, h: 151.31, l: 149.1, c: 150.65 },
            { o: 150.65, h: 151.27, l: 148.89, c: 149.02 },
            { o: 149.02, h: 150.76, l: 148.65, c: 150.54 },
            { o: 150.54, h: 150.63, l: 148.57, c: 149.17 },
            { o: 149.17, h: 151.28, l: 148.82, c: 150.87 },
            { o: 150.87, h: 151.5, l: 148.79, c: 148.91 },
            { o: 148.91, h: 150.93, l: 148.54, c: 150.26 },
            { o: 150.26, h: 151.58, l: 150.16, c: 151.51 },
            { o: 151.51, h: 152.9, l: 151.42, c: 152.75 },
            { o: 152.75, h: 154.28, l: 152.64, c: 154 },
            { o: 154, h: 156.27, l: 153.83, c: 156 },
            { o: 156, h: 158.24, l: 155.83, c: 158 },
            { o: 158, h: 160.06, l: 157.87, c: 160 },
            { o: 160, h: 160.97, l: 159.67, c: 160.57 },
            { o: 160.57, h: 160.71, l: 159.48, c: 159.78 },
            { o: 159.78, h: 159.86, l: 155.83, c: 155.89 },
            { o: 155.89, h: 155.95, l: 151.66, c: 152 },
            { o: 152, h: 152.19, l: 148.78, c: 149.07 },
            { o: 149.07, h: 149.26, l: 146.1, c: 146.19 },
            { o: 146.19, h: 146.36, l: 142.9, c: 143.25 },
            { o: 143.25, h: 143.34, l: 140.35, c: 140.63 },
            { o: 140.63, h: 140.73, l: 137.97, c: 138 },
            { o: 138, h: 141.78, l: 137.95, c: 141.36 },
            { o: 141.36, h: 145.28, l: 141.28, c: 144.89 },
            { o: 144.89, h: 148.75, l: 144.81, c: 148.18 },
            { o: 148.18, h: 152, l: 148.03, c: 151.82 },
            { o: 151.82, h: 156.05, l: 151.6, c: 155.87 },
            { o: 155.87, h: 159.75, l: 155.65, c: 159.18 },
            { o: 159.18, h: 160.38, l: 159.08, c: 160.08 },
            { o: 160.08, h: 160.16, l: 156.34, c: 156.81 },
            { o: 156.81, h: 156.92, l: 153.23, c: 153.54 },
            { o: 153.54, h: 153.67, l: 149.74, c: 150.27 },
            { o: 150.27, h: 150.48, l: 146.48, c: 147 }
          ],
          reveal: 27
        },
        answer: {
          from: 18,
          to: 19
        },
        explain: "The two-candle pause at the top, left with big red candles. The busy many-candle area on the left is balance."
      },
      {
        type: "mcq",
        q: "An old supply was broken. When can it become demand?",
        options: [
          "Always, every broken level flips",
          "Only with a strong breakout, big profit margin and good higher timeframe location",
          "Only if it was touched three times",
          "Only if a moving average is nearby"
        ],
        answer: 1,
        explain: "Missing any of the three makes the new level weak."
      },
      {
        type: "mcq",
        q: "Ray is brand new. What does Seiden say to do first?",
        options: [
          "Trade small stocks with big size",
          "Use a simulator to learn the platform and prove the rules, then start small",
          "Start with options",
          "Copy a good trader's calls"
        ],
        answer: 1,
        explain: "Simulator first: platform comfort, executing the plan, and proving the rules are profitable. Then something liquid like the QQQQ, with small size."
      },
      {
        type: "tf",
        q: "The farther price moved away before coming back, the bigger the profit margin.",
        answer: true,
        explain: "Distance before the return measures the margin and shows where the other side was absorbed."
      }
    ],
    practice: [
      {
        prompt: "A two-candle demand launched a strong rally that ran far. Price is back for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.13, l: 156.84, c: 157.26 },
            { o: 157.26, h: 157.32, l: 154.4, c: 154.78 },
            { o: 154.78, h: 154.88, l: 152.02, c: 152.27 },
            { o: 152.27, h: 152.36, l: 149.82, c: 150 },
            { o: 150, h: 150.91, l: 149.78, c: 150.75 },
            { o: 150.75, h: 150.9, l: 148.69, c: 149.35 },
            { o: 149.35, h: 151.11, l: 148.73, c: 150.98 },
            { o: 150.98, h: 151.35, l: 149.24, c: 149.46 },
            { o: 149.46, h: 151.43, l: 149.37, c: 150.83 },
            { o: 150.83, h: 151.18, l: 148.72, c: 149.13 },
            { o: 149.13, h: 151.21, l: 148.5, c: 151.09 },
            { o: 151.09, h: 151.46, l: 149.07, c: 149.74 },
            { o: 149.74, h: 149.84, l: 148.42, c: 148.49 },
            { o: 148.49, h: 148.58, l: 147.1, c: 147.25 },
            { o: 147.25, h: 147.36, l: 145.72, c: 146 },
            { o: 146, h: 146.17, l: 143.73, c: 144 },
            { o: 144, h: 144.17, l: 141.76, c: 142 },
            { o: 142, h: 142.13, l: 139.94, c: 140 },
            { o: 140, h: 140.33, l: 139.03, c: 139.43 },
            { o: 139.43, h: 140.52, l: 139.29, c: 140.22 },
            { o: 140.22, h: 144.17, l: 140.14, c: 144.11 },
            { o: 144.11, h: 148.34, l: 144.05, c: 148 },
            { o: 148, h: 151.22, l: 147.81, c: 150.93 },
            { o: 150.93, h: 153.9, l: 150.74, c: 153.81 },
            { o: 153.81, h: 157.1, l: 153.64, c: 156.75 },
            { o: 156.75, h: 159.65, l: 156.66, c: 159.37 },
            { o: 159.37, h: 162.03, l: 159.27, c: 162 },
            { o: 162, h: 162.05, l: 158.22, c: 158.64 },
            { o: 158.64, h: 158.72, l: 154.72, c: 155.11 },
            { o: 155.11, h: 155.19, l: 151.25, c: 151.82 },
            { o: 151.82, h: 151.97, l: 148, c: 148.18 },
            { o: 148.18, h: 148.4, l: 143.95, c: 144.13 },
            { o: 144.13, h: 144.35, l: 140.25, c: 140.82 },
            { o: 140.82, h: 140.92, l: 139.62, c: 139.92 },
            { o: 139.92, h: 143.66, l: 139.84, c: 143.19 },
            { o: 143.19, h: 146.77, l: 143.08, c: 146.46 },
            { o: 146.46, h: 150.26, l: 146.33, c: 149.73 },
            { o: 149.73, h: 153.52, l: 149.52, c: 153 }
          ],
          zones: [
            {
              from: 18,
              top: 140.22,
              bottom: 139.03,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 34
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Strong exit, little time, far distance, first return: all yes. Price bounced from demand."
      },
      {
        prompt: "Price slowly ground up through an old supply in small overlapping candles and now dips back to it. Is the old supply now demand you can buy?",
        scene: {
          candles: [
            { o: 130, h: 133.22, l: 129.9, c: 133 },
            { o: 133, h: 136.11, l: 132.81, c: 136 },
            { o: 136, h: 139.12, l: 135.97, c: 139 },
            { o: 139, h: 142.45, l: 138.88, c: 142 },
            { o: 142, h: 142.24, l: 141.16, c: 141.45 },
            { o: 141.45, h: 142.64, l: 141.15, c: 142.48 },
            { o: 142.48, h: 142.74, l: 141.57, c: 141.81 },
            { o: 141.81, h: 141.85, l: 139.55, c: 139.86 },
            { o: 139.86, h: 140.02, l: 137.64, c: 137.9 },
            { o: 137.9, h: 137.94, l: 135.79, c: 135.95 },
            { o: 135.95, h: 136.01, l: 133.86, c: 134 },
            { o: 134, h: 135.36, l: 133.95, c: 135.22 },
            { o: 135.22, h: 137.35, l: 135.09, c: 137.19 },
            { o: 137.19, h: 138.46, l: 137.12, c: 138.18 },
            { o: 138.18, h: 139.55, l: 138.14, c: 139.34 },
            { o: 139.34, h: 141.22, l: 139.28, c: 141 },
            { o: 141, h: 141.6, l: 140.88, c: 141.51 },
            { o: 141.51, h: 143.06, l: 141.45, c: 143.03 },
            { o: 143.03, h: 143.73, l: 142.94, c: 143.54 },
            { o: 143.54, h: 145.6, l: 143.44, c: 145.34 },
            { o: 145.34, h: 146.07, l: 145.24, c: 145.91 },
            { o: 145.91, h: 146.74, l: 145.83, c: 146.5 },
            { o: 146.5, h: 147.37, l: 146.42, c: 147.17 },
            { o: 147.17, h: 147.87, l: 147.08, c: 147.83 },
            { o: 147.83, h: 148.56, l: 147.8, c: 148.5 },
            { o: 148.5, h: 148.6, l: 147, c: 147.16 },
            { o: 147.16, h: 147.19, l: 145.6, c: 145.82 },
            { o: 145.82, h: 145.96, l: 144.35, c: 144.48 },
            { o: 144.48, h: 144.52, l: 143.1, c: 143.14 },
            { o: 143.14, h: 143.24, l: 142.24, c: 142.54 },
            { o: 142.54, h: 142.64, l: 140.63, c: 140.91 },
            { o: 140.91, h: 140.97, l: 139.23, c: 139.27 },
            { o: 139.27, h: 139.32, l: 137.51, c: 137.64 },
            { o: 137.64, h: 137.69, l: 135.93, c: 136 }
          ],
          zones: [
            {
              from: 4,
              top: 142.74,
              bottom: 141.45,
              kind: "supply",
              label: "Old supply, broken slowly",
              to: 16
            }
          ],
          reveal: 30
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The breakout was slow and weak and there is little margin. A broken level only flips with a strong break, big margin and good location. Price fell right through."
      }
    ],
    cards: [
      {
        front: "Strong level: few or many candles?",
        back: "Few candles."
      },
      {
        front: "Why few candles?",
        back: "A big imbalance means one side is missing, so few trades happen."
      },
      {
        front: "What does distance before return measure?",
        back: "The profit margin."
      },
      {
        front: "Three needs for old supply to become demand?",
        back: "Strong breakout, big profit margin, good higher timeframe location."
      },
      {
        front: "Role of moving averages?",
        back: "At most a background guide, never the main trend tool."
      },
      {
        front: "First step for a newbie?",
        back: "Simulator, then small size on a liquid market like QQQQ."
      }
    ],
    mnemonic: "Leave, Linger, Layers, Length: the four questions for every level."
  },
  {
    mentor: "seiden",
    n: 335,
    eli5: {
      oneLiner: "Good entry is everything: buy right where price turns.",
      story: "If you buy a toy right at the cheapest moment, you can buy more of them and still risk little money. Seiden says the entry decides your stop, your size and your target. So he checks three things to find where price will turn. Did price leave fast or with a gap, did it stay only a moment, and did it go far before coming back?",
      analogy: "A trampoline jump: the harder you bounced off, the shorter you touched the mat, and the higher you flew, the better the trampoline."
    },
    bigIdeas: [
      "Entry location decides stop, size and target, so enter as close to the turn as possible.",
      "Gap away beats big candles, which beat a gradual move.",
      "Few candles and a far run before the return mean a strong level and a big target."
    ],
    steps: [
      {
        title: "Check 1: how did price leave?",
        narration: "Three ways to leave a level: a gradual drift, big candles, or a gap. Here price GAPPED away. A gap is the strongest exit and shows the biggest imbalance.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          highlight: {
            from: 8,
            to: 9,
            label: "gap away"
          },
          reveal: 10
        }
      },
      {
        title: "Check 2: how long was it there?",
        narration: "Only two candles. The less time price spends at a level, the more out of balance it is. Draw the zone: top on the highest body, bottom on the lowest wick.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          zones: [
            {
              from: 6,
              top: 142.49,
              bottom: 141.43,
              kind: "demand",
              label: "Demand"
            }
          ],
          highlight: {
            from: 6,
            to: 7,
            label: "2 candles"
          },
          reveal: 10
        }
      },
      {
        title: "Check 3: how far before returning?",
        narration: "Price ran far up before coming back. The level sits far from balance, like a stretched rubber band. The distance from the level to that high is a profit target.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          zones: [
            {
              from: 6,
              top: 142.49,
              bottom: 141.43,
              kind: "demand",
              label: "Demand"
            }
          ],
          notes: [
            {
              x: 13,
              y: 169.42,
              text: "prior high = target"
            }
          ],
          highlight: {
            from: 10,
            to: 13,
            label: "far run"
          },
          reveal: 14
        }
      },
      {
        title: "Enter as close to the turn as you can",
        narration: "Buy at the top line, stop just under the bottom line. Entering at the turn gives the most size for the least risk and puts you farthest from the target.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          zones: [
            {
              from: 6,
              top: 142.49,
              bottom: 141.43,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 142.49,
              label: "Buy (proximal)",
              kind: "entry"
            },
            {
              y: 141.03,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 167.92,
              label: "Target: prior high",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 13,
              y: 169.42,
              text: "prior high = target"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Result",
        narration: "Price turned at demand and ran back to the prior high. Gap, few candles, far distance: all three checks passed.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          zones: [
            {
              from: 6,
              top: 142.49,
              bottom: 141.43,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 142.49,
              label: "Buy (proximal)",
              kind: "entry"
            },
            {
              y: 141.03,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 167.92,
              label: "Target: prior high",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 13,
              y: 169.42,
              text: "prior high = target"
            }
          ],
          highlight: {
            from: 21,
            to: 25,
            label: "turn"
          }
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Rank the ways to leave a level, weakest first.",
        items: [
          "Gradual move",
          "Strong move with big candles",
          "Gap away"
        ],
        explain: "A gap shows the biggest imbalance: no one was willing to trade in between."
      },
      {
        type: "tf",
        q: "A level with lots of activity and heavy volume is the strongest kind.",
        answer: false,
        explain: "Big imbalance means fewer transactions and lower volume. Do not believe everything you read."
      },
      {
        type: "spot",
        q: "Click the candles that show HOW price left this level.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          reveal: 14
        },
        answer: {
          from: 8,
          to: 9
        },
        explain: "The gap and big candles right after the base. That is the strongest kind of departure."
      },
      {
        type: "mcq",
        q: "How does Seiden set a profit target from check 3?",
        options: [
          "A fixed 2:1",
          "The distance from the level to the extreme before the return",
          "The moving average",
          "Half the size of the zone"
        ],
        answer: 1,
        explain: "Measure from the level to the farthest point price reached before coming back. That becomes one of the targets."
      },
      {
        type: "mcq",
        q: "Why enter as close to the turn as possible?",
        options: [
          "It feels safer",
          "Largest position for the least risk and the biggest reward",
          "Because brokers charge less",
          "It does not matter"
        ],
        answer: 1,
        explain: "Close to the turn means a small stop and the most room to the target."
      }
    ],
    practice: [
      {
        prompt: "Pick entry, stop and target on the first return to this gap-away demand.",
        scene: {
          candles: [
            { o: 170, h: 170.17, l: 164.89, c: 165.5 },
            { o: 165.5, h: 165.59, l: 160.29, c: 160.44 },
            { o: 160.44, h: 160.52, l: 156.28, c: 156.41 },
            { o: 156.41, h: 156.68, l: 151.14, c: 151.74 },
            { o: 151.74, h: 151.84, l: 146.46, c: 146.83 },
            { o: 146.83, h: 147.07, l: 141.52, c: 142 },
            { o: 142, h: 142.67, l: 141.77, c: 142.49 },
            { o: 142.49, h: 142.67, l: 141.43, c: 141.78 },
            { o: 145.78, h: 151.42, l: 145.65, c: 150.89 },
            { o: 150.89, h: 156.31, l: 150.63, c: 156 },
            { o: 156, h: 159, l: 155.91, c: 158.62 },
            { o: 158.62, h: 161.85, l: 158.46, c: 161.66 },
            { o: 161.66, h: 165.18, l: 161.5, c: 165.03 },
            { o: 165.03, h: 168.42, l: 165, c: 168 },
            { o: 168, h: 168.25, l: 163.64, c: 163.83 },
            { o: 163.83, h: 164.04, l: 159.29, c: 159.75 },
            { o: 159.75, h: 160, l: 155.48, c: 155.78 },
            { o: 155.78, h: 156.04, l: 150.99, c: 151.07 },
            { o: 151.07, h: 151.25, l: 147.4, c: 147.72 },
            { o: 147.72, h: 147.85, l: 142.89, c: 143.09 },
            { o: 143.09, h: 143.19, l: 141.99, c: 142.19 },
            { o: 142.19, h: 147.64, l: 142, c: 147.34 },
            { o: 147.34, h: 152.71, l: 147.1, c: 152.48 },
            { o: 152.48, h: 157.98, l: 152.31, c: 157.63 },
            { o: 157.63, h: 162.99, l: 157.52, c: 162.77 },
            { o: 162.77, h: 168.33, l: 162.54, c: 167.92 }
          ],
          zones: [
            {
              from: 6,
              top: 142.49,
              bottom: 141.43,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 21
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 142.49,
          sl: 141.03,
          tp: 167.92
        },
        explain: "Buy the top line (as close to the turn as possible), stop under the lowest basing wick, target the high price reached before the return. Price went straight there."
      },
      {
        prompt: "This demand had seven overlapping candles and price drifted away slowly. Price is back. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 165, h: 165.22, l: 160.58, c: 161 },
            { o: 161, h: 161.23, l: 156.91, c: 157 },
            { o: 157, h: 157.22, l: 152.55, c: 153 },
            { o: 153, h: 153.1, l: 148.67, c: 149 },
            { o: 149, h: 149.2, l: 144.61, c: 145 },
            { o: 145, h: 145.32, l: 143.99, c: 144.55 },
            { o: 144.55, h: 145.82, l: 144.07, c: 145.62 },
            { o: 145.62, h: 146, l: 144.2, c: 144.61 },
            { o: 144.61, h: 146.03, l: 144.35, c: 145.6 },
            { o: 145.6, h: 146.08, l: 144.03, c: 144.53 },
            { o: 144.53, h: 145.8, l: 144.04, c: 145.35 },
            { o: 145.35, h: 145.73, l: 144.46, c: 144.81 },
            { o: 144.81, h: 145.71, l: 144.75, c: 145.6 },
            { o: 145.6, h: 146.7, l: 145.55, c: 146.55 },
            { o: 146.55, h: 148.42, l: 146.43, c: 148.31 },
            { o: 148.31, h: 149.15, l: 148.21, c: 148.92 },
            { o: 148.92, h: 150.17, l: 148.81, c: 150 },
            { o: 150, h: 150.04, l: 148.81, c: 149.01 },
            { o: 149.01, h: 149.04, l: 147.74, c: 148.01 },
            { o: 148.01, h: 148.12, l: 146.85, c: 147.02 },
            { o: 147.02, h: 147.08, l: 145.95, c: 146.02 },
            { o: 146.02, h: 146.12, l: 144.92, c: 145.22 },
            { o: 145.22, h: 145.32, l: 143.86, c: 143.91 },
            { o: 143.91, h: 143.96, l: 142.5, c: 142.61 },
            { o: 142.61, h: 142.66, l: 141.23, c: 141.3 },
            { o: 141.3, h: 141.43, l: 139.74, c: 139.99 }
          ],
          zones: [
            {
              from: 5,
              top: 145.62,
              bottom: 143.99,
              kind: "demand",
              label: "Demand?"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Gradual exit, lots of time at the level, very little distance. All three checks fail. Price broke through."
      }
    ],
    cards: [
      {
        front: "Strongest way to leave a level?",
        back: "A gap."
      },
      {
        front: "Less time at a level means?",
        back: "A bigger imbalance."
      },
      {
        front: "Far run before return means?",
        back: "Bigger profit margin and higher probability (stretched rubber band)."
      },
      {
        front: "Target from check 3?",
        back: "Level to the extreme reached before the return."
      },
      {
        front: "Why does entry matter most?",
        back: "It decides stop, size and reward."
      }
    ],
    mnemonic: "Gap, Brief, Far: gap away, brief stay, far run."
  },
  {
    mentor: "seiden",
    n: 338,
    eli5: {
      oneLiner: "Supply and demand work all night, so check the night chart.",
      story: "A shop that is open 24 hours still sells things at 3 a.m. The market is the same: if it is open, buyers and sellers are at work. Seiden includes after-hours levels, and before a stock trade he checks the S&P futures overnight. If the futures already went far past their level in the night, the stock level may be used up.",
      analogy: "Checking the night chart is like checking whether the cookie jar was raided while you slept before you promise cookies to a friend."
    },
    bigIdeas: [
      "Include after-hours levels; most line up with the day levels anyway.",
      "Skip a stock level if index futures already traded well beyond theirs overnight.",
      "Supply and demand work in every market. Say supply and demand, not support and resistance."
    ],
    steps: [
      {
        title: "Look at the night session too",
        narration: "The shaded candles traded after hours. While the market is open, supply and demand are at work, whatever the clock says. Many traders only watch the day session and miss this.",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          highlight: {
            from: 5,
            to: 12,
            label: "after hours"
          },
          reveal: 13
        }
      },
      {
        title: "A level formed overnight",
        narration: "Overnight price paused for two candles and rallied hard. It passes the check list: strong exit, little time. Draw it like any other demand.",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          zones: [
            {
              from: 8,
              top: 145.22,
              bottom: 143.77,
              kind: "demand",
              label: "Demand (formed overnight)"
            }
          ],
          highlight: {
            from: 8,
            to: 9,
            label: "overnight base"
          },
          reveal: 17
        }
      },
      {
        title: "The day session returns",
        narration: "In the day session price falls back to the overnight demand for the first time. Day-only traders do not even see the level. Buy at the top line.",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          zones: [
            {
              from: 8,
              top: 145.22,
              bottom: 143.77,
              kind: "demand",
              label: "Demand (formed overnight)"
            }
          ],
          lines: [
            {
              y: 145.22,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 143.37,
              label: "Stop",
              kind: "sl"
            }
          ],
          reveal: 23
        }
      },
      {
        title: "Same equation everywhere",
        narration: "Price turns up. Stocks, futures, Asian markets: behind every market are just people pushing buttons. Call it what it is, supply and demand, not fuzzy support and resistance.",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          zones: [
            {
              from: 8,
              top: 145.22,
              bottom: 143.77,
              kind: "demand",
              label: "Demand (formed overnight)"
            }
          ],
          lines: [
            {
              y: 145.22,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 143.37,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 23,
            to: 27,
            label: "turn"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Levels that form after hours do not count because volume is low.",
        answer: false,
        explain: "If the market is open, supply and demand are at work. Every level must still meet the check list standards."
      },
      {
        type: "mcq",
        q: "Before trading a stock level, what does Seiden check in the overnight session?",
        options: [
          "The VIX",
          "Whether S&P futures already moved well beyond their corresponding level",
          "The news calendar only",
          "Nothing, overnight does not matter"
        ],
        answer: 1,
        explain: "A stock level can look good but be invalid if the S&P futures already went far beyond their level overnight."
      },
      {
        type: "mcq",
        q: "Why does Seiden avoid the words support and resistance?",
        options: [
          "They are too old",
          "People define them in many different ways, like pivots, Fibs and moving averages",
          "They only work on stocks",
          "They are the same as supply and demand"
        ],
        answer: 1,
        explain: "Calling it what it is, demand and supply, avoids muddled definitions."
      },
      {
        type: "spot",
        q: "Click the overnight base that became demand.",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          reveal: 17
        },
        answer: {
          from: 8,
          to: 9
        },
        explain: "The two-candle pause in the after-hours session, left by a strong rally."
      },
      {
        type: "tf",
        q: "Supply and demand work in Asian markets the same way as in US markets.",
        answer: true,
        explain: "A solid yes. Behind every market are people pushing buttons, so the equation is the same."
      }
    ],
    practice: [
      {
        prompt: "This demand formed overnight. The day session drops back to it for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.04, l: 158.05, c: 158.21 },
            { o: 158.21, h: 158.25, l: 155.69, c: 155.97 },
            { o: 155.97, h: 156, l: 153.56, c: 153.8 },
            { o: 153.8, h: 153.94, l: 151.53, c: 151.87 },
            { o: 151.87, h: 151.99, l: 149.93, c: 150 },
            { o: 150, h: 150.11, l: 148.16, c: 148.33 },
            { o: 148.33, h: 148.44, l: 146.52, c: 146.67 },
            { o: 146.67, h: 146.76, l: 144.85, c: 145 },
            { o: 145, h: 145.19, l: 144.12, c: 144.22 },
            { o: 144.22, h: 145.65, l: 143.77, c: 145.22 },
            { o: 145.22, h: 148.38, l: 145.15, c: 148.14 },
            { o: 148.14, h: 151.24, l: 147.96, c: 151.07 },
            { o: 151.07, h: 154.05, l: 150.97, c: 154 },
            { o: 154, h: 155.45, l: 153.9, c: 155.21 },
            { o: 155.21, h: 155.9, l: 155.16, c: 155.73 },
            { o: 155.73, h: 157.12, l: 155.68, c: 157.03 },
            { o: 157.03, h: 158.17, l: 156.97, c: 158 },
            { o: 158, h: 158.03, l: 155.08, c: 155.12 },
            { o: 155.12, h: 155.23, l: 153.03, c: 153.12 },
            { o: 153.12, h: 153.3, l: 150.26, c: 150.29 },
            { o: 150.29, h: 150.39, l: 147.71, c: 147.96 },
            { o: 147.96, h: 148.09, l: 145.39, c: 145.72 },
            { o: 145.72, h: 145.82, l: 144.72, c: 144.92 },
            { o: 144.92, h: 147.39, l: 144.83, c: 147.34 },
            { o: 147.34, h: 149.92, l: 147.27, c: 149.75 },
            { o: 149.75, h: 152.52, l: 149.66, c: 152.17 },
            { o: 152.17, h: 155, l: 152.11, c: 154.58 },
            { o: 154.58, h: 157.07, l: 154.45, c: 157 }
          ],
          zones: [
            {
              from: 8,
              top: 145.22,
              bottom: 143.77,
              kind: "demand",
              label: "Demand (formed overnight)"
            }
          ],
          highlight: {
            from: 5,
            to: 12,
            label: "after hours"
          },
          reveal: 23
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "An after-hours level is a real level if it passes the check list. First return, strong exit: buy. Price turned up."
      },
      {
        prompt: "Your stock demand looks fresh on the day chart, but overnight (shaded) price already traded far below it and back. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.62, c: 147.75 },
            { o: 147.75, h: 147.85, l: 145.44, c: 145.5 },
            { o: 145.5, h: 145.66, l: 142.88, c: 143.25 },
            { o: 143.25, h: 143.41, l: 140.81, c: 141 },
            { o: 141, h: 142.05, l: 140.89, c: 141.57 },
            { o: 141.57, h: 141.93, l: 140.53, c: 140.78 },
            { o: 140.78, h: 144.25, l: 140.7, c: 143.86 },
            { o: 143.86, h: 147.43, l: 143.79, c: 146.93 },
            { o: 146.93, h: 150.5, l: 146.89, c: 150 },
            { o: 150, h: 150.44, l: 149.95, c: 150.27 },
            { o: 150.27, h: 151.79, l: 150.19, c: 151.72 },
            { o: 151.72, h: 152.04, l: 151.63, c: 152 },
            { o: 152, h: 152.08, l: 146.3, c: 146.84 },
            { o: 146.84, h: 146.91, l: 141.48, c: 141.69 },
            { o: 141.69, h: 141.88, l: 135.99, c: 136.53 },
            { o: 136.53, h: 139.33, l: 136.44, c: 139.21 },
            { o: 139.21, h: 142.32, l: 139.09, c: 141.89 },
            { o: 141.89, h: 144.96, l: 141.76, c: 144.57 },
            { o: 144.57, h: 144.67, l: 143.21, c: 143.32 },
            { o: 143.32, h: 143.37, l: 141.78, c: 142.07 },
            { o: 142.07, h: 142.17, l: 141.07, c: 141.27 },
            { o: 141.27, h: 141.33, l: 139.78, c: 139.83 },
            { o: 139.83, h: 139.89, l: 138.1, c: 138.4 },
            { o: 138.4, h: 138.54, l: 136.79, c: 136.97 },
            { o: 136.97, h: 137.11, l: 135.42, c: 135.53 }
          ],
          zones: [
            {
              from: 4,
              top: 141.57,
              bottom: 140.53,
              kind: "demand",
              label: "Demand on the chart"
            }
          ],
          highlight: {
            from: 12,
            to: 17,
            label: "overnight"
          },
          reveal: 21
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The overnight session already went well beyond the level, so the orders there were used up. It is not a valid level. Price fell through."
      }
    ],
    cards: [
      {
        front: "Do after-hours levels count?",
        back: "Yes, if they meet the check list standards."
      },
      {
        front: "Trading a stock: which overnight chart to check?",
        back: "The S&P futures."
      },
      {
        front: "When is a stock level invalid?",
        back: "When index futures already traded well beyond their level overnight."
      },
      {
        front: "Does supply and demand work in all markets?",
        back: "Yes. People push the buttons everywhere."
      },
      {
        front: "Why not say support and resistance?",
        back: "Too many different definitions (pivots, Fib, MAs)."
      }
    ],
    mnemonic: "Open shop, open eyes: if the market is open, the levels are real."
  },
  {
    mentor: "seiden",
    n: 340,
    eli5: {
      oneLiner: "When you hear \"intervention\", look for supply to sell.",
      story: "Imagine a kid holding a beach ball under the water. He can push it down for a while, but his arms get tired and the ball shoots back up. Governments and central banks pushing on prices are that kid. Seiden saw the Bank of Japan push the Yen down, and then it came right back and went much further. So when news says \"intervention\" lifts the market, he finds the supply it leaves and sells the retest.",
      analogy: "A sandcastle wall against the tide: it holds for a moment, then the sea goes where it was always going."
    },
    bigIdeas: [
      "Intervention in free markets never works for long; expect the opposite big move.",
      "Sell the first return to the supply that the news rally leaves, not the news itself.",
      "There is no demand inside a gap, so a gap below is profit margin."
    ],
    steps: [
      {
        title: "Intervention news",
        narration: "The headline says the government intervened. The market gaps up hard at the open. Seiden learned on the floor that intervention in free markets never works for long; it often brings the opposite move.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          notes: [
            {
              x: 9,
              y: 156.5,
              text: "intervention!"
            }
          ],
          highlight: {
            from: 9,
            to: 10,
            label: "news gap"
          },
          reveal: 11
        }
      },
      {
        title: "Price cannot stay up there",
        narration: "At the high price based for three small candles and then slipped. Supply is bigger than demand there. Draw the supply around that base: retail prices.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          zones: [
            {
              from: 11,
              top: 155.1,
              bottom: 153.18,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          notes: [
            {
              x: 9,
              y: 156.5,
              text: "intervention!"
            }
          ],
          highlight: {
            from: 11,
            to: 13,
            label: "base at the high"
          },
          reveal: 16
        }
      },
      {
        title: "Sell the retest, not the news",
        narration: "Do not trade into the release. Wait for the first return to the base and sell there. Novices buy because of the news, at a level where supply exceeds demand.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          zones: [
            {
              from: 11,
              top: 155.1,
              bottom: 153.18,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 153.18,
              label: "Short at retest",
              kind: "entry"
            },
            {
              y: 155.5,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 9,
              y: 156.5,
              text: "intervention!"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "The gap is the profit margin",
        narration: "Inside a gap there was no trading, so there is no demand inside it. That empty space below is a big profit margin, all the way back to where the gap began.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          zones: [
            {
              from: 11,
              top: 155.1,
              bottom: 153.18,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 153.18,
              label: "Short at retest",
              kind: "entry"
            },
            {
              y: 155.5,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 146.36,
              label: "Target: gap origin",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 9,
              y: 156.5,
              text: "intervention!"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "The invisible hand",
        narration: "Price slides back down through the gap. Initial move one way on the news, the big move the other way.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          zones: [
            {
              from: 11,
              top: 155.1,
              bottom: 153.18,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 153.18,
              label: "Short at retest",
              kind: "entry"
            },
            {
              y: 155.5,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 146.36,
              label: "Target: gap origin",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 9,
              y: 156.5,
              text: "intervention!"
            }
          ],
          highlight: {
            from: 21,
            to: 27,
            label: "big move back"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The news says a bailout lifted stocks and the S&P rallies. What does the XLT bailout rule say?",
        options: [
          "Buy the breakout",
          "Find a supply level in the S&P and prepare to short",
          "Wait a week",
          "Buy calls"
        ],
        answer: 1,
        explain: "Every bailout rally: find supply, prepare to short. The market rallies on the news, reaches supply and declines."
      },
      {
        type: "tf",
        q: "A gap below your short entry means there is little demand in that space.",
        answer: true,
        explain: "No trading happened in the gap, so no demand sits there. That is a large profit margin."
      },
      {
        type: "spot",
        q: "Click the base that became the retail supply after the news gap.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          reveal: 16
        },
        answer: {
          from: 11,
          to: 13
        },
        explain: "The three small candles at the high after the gap. Price could not stay there."
      },
      {
        type: "mcq",
        q: "When does Seiden sell in the intervention example?",
        options: [
          "Into the news release",
          "At the first retest of the base at the high",
          "After price fills the whole gap",
          "At the open"
        ],
        answer: 1,
        explain: "Do not trade into the release. Sell the first return to the supply the news created."
      },
      {
        type: "order",
        q: "Order what happened in the Yen story Seiden saw on the floor.",
        items: [
          "The central bank sells huge amounts of Yen",
          "The Yen falls to their target",
          "The Yen rallies back to pre-intervention levels",
          "The Yen goes much further"
        ],
        explain: "Intervention gives an initial move one way; the invisible hand brings the bigger move the other way."
      }
    ],
    practice: [
      {
        prompt: "Price crashed, then intervention news gapped it DOWN further. A small base formed at the low and price is now dipping back to it. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 154, h: 155.05, l: 153.94, c: 154.89 },
            { o: 154.89, h: 156.47, l: 154.77, c: 156.4 },
            { o: 156.4, h: 157.41, l: 156.36, c: 157.16 },
            { o: 157.16, h: 158.4, l: 157.04, c: 158.35 },
            { o: 158.35, h: 159.48, l: 158.25, c: 159.23 },
            { o: 159.23, h: 160.25, l: 159.17, c: 160 },
            { o: 160, h: 160.05, l: 159.54, c: 159.7 },
            { o: 159.7, h: 159.79, l: 158.71, c: 158.81 },
            { o: 158.81, h: 158.88, l: 158.43, c: 158.5 },
            { o: 148.5, h: 148.62, l: 147.09, c: 147.25 },
            { o: 147.25, h: 147.36, l: 145.79, c: 146 },
            { o: 146, h: 146.48, l: 144.9, c: 145.29 },
            { o: 145.29, h: 146.93, l: 145.07, c: 146.82 },
            { o: 146.82, h: 147.26, l: 145.55, c: 145.78 },
            { o: 145.78, h: 147.75, l: 145.65, c: 147.64 },
            { o: 147.64, h: 149.66, l: 147.52, c: 149.5 },
            { o: 149.5, h: 149.56, l: 148.89, c: 148.93 },
            { o: 148.93, h: 148.96, l: 148.32, c: 148.36 },
            { o: 148.36, h: 148.4, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.87, l: 147.12, c: 147.22 },
            { o: 147.22, h: 147.32, l: 146.22, c: 146.52 },
            { o: 146.52, h: 148.75, l: 146.39, c: 148.51 },
            { o: 148.51, h: 149.63, l: 148.39, c: 149.56 },
            { o: 149.56, h: 151.25, l: 149.51, c: 151.02 },
            { o: 151.02, h: 153.05, l: 150.87, c: 152.77 },
            { o: 152.77, h: 154.41, l: 152.71, c: 154.27 },
            { o: 154.27, h: 155.8, l: 154.22, c: 155.55 },
            { o: 155.55, h: 157.6, l: 155.47, c: 157.5 }
          ],
          zones: [
            {
              from: 11,
              top: 146.82,
              bottom: 144.9,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The mirror of the rule: the news move gives a small demand base, and the gap above has no supply in it. Buy the retest. Price rallied back through the gap."
      },
      {
        prompt: "After the intervention gap up, price is back at the base at the high. Plan the trade.",
        scene: {
          candles: [
            { o: 146, h: 146.06, l: 144.95, c: 145.11 },
            { o: 145.11, h: 145.23, l: 143.53, c: 143.6 },
            { o: 143.6, h: 143.64, l: 142.59, c: 142.84 },
            { o: 142.84, h: 142.96, l: 141.6, c: 141.65 },
            { o: 141.65, h: 141.75, l: 140.52, c: 140.77 },
            { o: 140.77, h: 140.83, l: 139.75, c: 140 },
            { o: 140, h: 140.46, l: 139.95, c: 140.3 },
            { o: 140.3, h: 141.29, l: 140.21, c: 141.19 },
            { o: 141.19, h: 141.57, l: 141.12, c: 141.5 },
            { o: 151.5, h: 152.91, l: 151.38, c: 152.75 },
            { o: 152.75, h: 154.21, l: 152.64, c: 154 },
            { o: 154, h: 155.1, l: 153.52, c: 154.71 },
            { o: 154.71, h: 154.93, l: 153.07, c: 153.18 },
            { o: 153.18, h: 154.45, l: 152.74, c: 154.22 },
            { o: 154.22, h: 154.35, l: 152.25, c: 152.36 },
            { o: 152.36, h: 152.48, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.11, l: 150.44, c: 151.07 },
            { o: 151.07, h: 151.68, l: 151.04, c: 151.64 },
            { o: 151.64, h: 152.41, l: 151.6, c: 152.21 },
            { o: 152.21, h: 152.88, l: 152.13, c: 152.78 },
            { o: 152.78, h: 153.78, l: 152.68, c: 153.48 },
            { o: 153.48, h: 153.61, l: 151.25, c: 151.49 },
            { o: 151.49, h: 151.61, l: 150.37, c: 150.44 },
            { o: 150.44, h: 150.49, l: 148.75, c: 148.98 },
            { o: 148.98, h: 149.13, l: 146.95, c: 147.23 },
            { o: 147.23, h: 147.29, l: 145.59, c: 145.73 },
            { o: 145.73, h: 145.78, l: 144.2, c: 144.45 },
            { o: 144.45, h: 144.53, l: 142.4, c: 142.5 }
          ],
          zones: [
            {
              from: 11,
              top: 155.1,
              bottom: 153.18,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          reveal: 21
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 153.18,
          sl: 155.5,
          tp: 146.36
        },
        explain: "Short at the bottom line of the supply, stop above its top, target the origin of the gap where demand begins. There was no demand inside the gap, and price fell back into it."
      }
    ],
    cards: [
      {
        front: "Does intervention in free markets work?",
        back: "Never for more than a short time."
      },
      {
        front: "The word \"intervention\" means to Seiden?",
        back: "A sell signal: find supply to short."
      },
      {
        front: "What is inside a gap?",
        back: "No demand (or no supply): empty space = profit margin."
      },
      {
        front: "Trade into the news release?",
        back: "No. Sell the first return to the supply after it."
      },
      {
        front: "Intervention pattern?",
        back: "Initial move one way, big move the other way."
      }
    ],
    mnemonic: "Beach ball rule: what is pushed away pops back."
  },
  {
    mentor: "seiden",
    n: 345,
    eli5: {
      oneLiner: "Demand alone is not enough; you need room to the next supply.",
      story: "Imagine a great parking spot, but a wall is right in front of it so you cannot drive out. A demand level with supply just above is that spot: good level, no room to go. Seiden also notes that the biggest candle comes at the end of a move, when the bandwagon jumps on. He gets in before the bandwagon, and a big profit margin can even make up for a weak exit.",
      analogy: "Party crowd: the most people pile onto the dance floor just before the music stops. Be there early, and leave when they rush in."
    },
    bigIdeas: [
      "Only buy a demand origin if there is room up to the next supply.",
      "The biggest candle at the end of a move is the bandwagon arriving late.",
      "A big profit margin, a news-stretched move and stacked levels can make up for a weak exit."
    ],
    steps: [
      {
        title: "The gap-up origin is demand",
        narration: "Price paused, then gapped up with long green candles. The origin of a strong move up is where demand exceeds supply. The area of interest is the pause, not the big green candles themselves.",
        scene: {
          candles: [
            { o: 150, h: 156.04, l: 149.95, c: 156 },
            { o: 156, h: 162.35, l: 155.93, c: 162 },
            { o: 162, h: 168.54, l: 161.75, c: 168 },
            { o: 168, h: 168.1, l: 167.39, c: 167.54 },
            { o: 167.54, h: 168.55, l: 167.41, c: 168.22 },
            { o: 168.22, h: 168.41, l: 165.4, c: 165.61 },
            { o: 165.61, h: 165.66, l: 162.8, c: 163 },
            { o: 163, h: 163.12, l: 162.13, c: 162.39 },
            { o: 162.39, h: 163.31, l: 162.15, c: 163.22 },
            { o: 163.22, h: 163.26, l: 158.83, c: 158.91 },
            { o: 158.91, h: 159.11, l: 154.39, c: 154.61 },
            { o: 154.61, h: 154.78, l: 150.23, c: 150.3 },
            { o: 150.3, h: 150.42, l: 145.59, c: 146 },
            { o: 146, h: 146.99, l: 145.9, c: 146.81 },
            { o: 146.81, h: 147.09, l: 145.5, c: 145.78 },
            { o: 149.78, h: 153.33, l: 149.65, c: 153.19 },
            { o: 153.19, h: 156.84, l: 153, c: 156.59 },
            { o: 156.59, h: 160.1, l: 156.37, c: 160 },
            { o: 160, h: 160.68, l: 159.91, c: 160.63 },
            { o: 160.63, h: 161.35, l: 160.53, c: 161.26 },
            { o: 161.26, h: 162.04, l: 161.16, c: 161.89 },
            { o: 161.89, h: 162.59, l: 161.09, c: 161.19 },
            { o: 161.19, h: 161.26, l: 158.11, c: 158.41 },
            { o: 158.41, h: 158.59, l: 155.57, c: 155.64 },
            { o: 155.64, h: 155.75, l: 152.39, c: 152.86 },
            { o: 152.86, h: 153, l: 149.76, c: 150.09 },
            { o: 150.09, h: 150.13, l: 147.11, c: 147.31 },
            { o: 147.31, h: 147.41, l: 146.41, c: 146.51 },
            { o: 146.51, h: 146.67, l: 144.42, c: 144.76 },
            { o: 144.76, h: 144.91, l: 142.72, c: 143.01 },
            { o: 143.01, h: 143.07, l: 141.12, c: 141.25 },
            { o: 141.25, h: 141.39, l: 139.16, c: 139.5 }
          ],
          zones: [
            {
              from: 13,
              top: 146.81,
              bottom: 145.5,
              kind: "demand",
              label: "Demand: gap origin"
            }
          ],
          highlight: {
            from: 13,
            to: 14,
            label: "origin"
          },
          reveal: 18
        }
      },
      {
        title: "But look what sits above",
        narration: "Right above the gap there is supply level after supply level. Those are the places where price fell before. If you buy at the gap origin, where will price go? Into supply almost at once.",
        scene: {
          candles: [
            { o: 150, h: 156.04, l: 149.95, c: 156 },
            { o: 156, h: 162.35, l: 155.93, c: 162 },
            { o: 162, h: 168.54, l: 161.75, c: 168 },
            { o: 168, h: 168.1, l: 167.39, c: 167.54 },
            { o: 167.54, h: 168.55, l: 167.41, c: 168.22 },
            { o: 168.22, h: 168.41, l: 165.4, c: 165.61 },
            { o: 165.61, h: 165.66, l: 162.8, c: 163 },
            { o: 163, h: 163.12, l: 162.13, c: 162.39 },
            { o: 162.39, h: 163.31, l: 162.15, c: 163.22 },
            { o: 163.22, h: 163.26, l: 158.83, c: 158.91 },
            { o: 158.91, h: 159.11, l: 154.39, c: 154.61 },
            { o: 154.61, h: 154.78, l: 150.23, c: 150.3 },
            { o: 150.3, h: 150.42, l: 145.59, c: 146 },
            { o: 146, h: 146.99, l: 145.9, c: 146.81 },
            { o: 146.81, h: 147.09, l: 145.5, c: 145.78 },
            { o: 149.78, h: 153.33, l: 149.65, c: 153.19 },
            { o: 153.19, h: 156.84, l: 153, c: 156.59 },
            { o: 156.59, h: 160.1, l: 156.37, c: 160 },
            { o: 160, h: 160.68, l: 159.91, c: 160.63 },
            { o: 160.63, h: 161.35, l: 160.53, c: 161.26 },
            { o: 161.26, h: 162.04, l: 161.16, c: 161.89 },
            { o: 161.89, h: 162.59, l: 161.09, c: 161.19 },
            { o: 161.19, h: 161.26, l: 158.11, c: 158.41 },
            { o: 158.41, h: 158.59, l: 155.57, c: 155.64 },
            { o: 155.64, h: 155.75, l: 152.39, c: 152.86 },
            { o: 152.86, h: 153, l: 149.76, c: 150.09 },
            { o: 150.09, h: 150.13, l: 147.11, c: 147.31 },
            { o: 147.31, h: 147.41, l: 146.41, c: 146.51 },
            { o: 146.51, h: 146.67, l: 144.42, c: 144.76 },
            { o: 144.76, h: 144.91, l: 142.72, c: 143.01 },
            { o: 143.01, h: 143.07, l: 141.12, c: 141.25 },
            { o: 141.25, h: 141.39, l: 139.16, c: 139.5 }
          ],
          zones: [
            {
              from: 13,
              top: 146.81,
              bottom: 145.5,
              kind: "demand",
              label: "Demand: gap origin"
            },
            {
              from: 3,
              top: 168.55,
              bottom: 167.54,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 7,
              top: 163.31,
              bottom: 162.39,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 3,
            to: 8,
            label: "supply after supply"
          },
          reveal: 18
        }
      },
      {
        title: "No margin, no buy",
        narration: "Price touched the lower supply and fell back to the gap origin. Demand is there, but the profit margin up to the supply is small. Small reward for the risk: it is not a buy.",
        scene: {
          candles: [
            { o: 150, h: 156.04, l: 149.95, c: 156 },
            { o: 156, h: 162.35, l: 155.93, c: 162 },
            { o: 162, h: 168.54, l: 161.75, c: 168 },
            { o: 168, h: 168.1, l: 167.39, c: 167.54 },
            { o: 167.54, h: 168.55, l: 167.41, c: 168.22 },
            { o: 168.22, h: 168.41, l: 165.4, c: 165.61 },
            { o: 165.61, h: 165.66, l: 162.8, c: 163 },
            { o: 163, h: 163.12, l: 162.13, c: 162.39 },
            { o: 162.39, h: 163.31, l: 162.15, c: 163.22 },
            { o: 163.22, h: 163.26, l: 158.83, c: 158.91 },
            { o: 158.91, h: 159.11, l: 154.39, c: 154.61 },
            { o: 154.61, h: 154.78, l: 150.23, c: 150.3 },
            { o: 150.3, h: 150.42, l: 145.59, c: 146 },
            { o: 146, h: 146.99, l: 145.9, c: 146.81 },
            { o: 146.81, h: 147.09, l: 145.5, c: 145.78 },
            { o: 149.78, h: 153.33, l: 149.65, c: 153.19 },
            { o: 153.19, h: 156.84, l: 153, c: 156.59 },
            { o: 156.59, h: 160.1, l: 156.37, c: 160 },
            { o: 160, h: 160.68, l: 159.91, c: 160.63 },
            { o: 160.63, h: 161.35, l: 160.53, c: 161.26 },
            { o: 161.26, h: 162.04, l: 161.16, c: 161.89 },
            { o: 161.89, h: 162.59, l: 161.09, c: 161.19 },
            { o: 161.19, h: 161.26, l: 158.11, c: 158.41 },
            { o: 158.41, h: 158.59, l: 155.57, c: 155.64 },
            { o: 155.64, h: 155.75, l: 152.39, c: 152.86 },
            { o: 152.86, h: 153, l: 149.76, c: 150.09 },
            { o: 150.09, h: 150.13, l: 147.11, c: 147.31 },
            { o: 147.31, h: 147.41, l: 146.41, c: 146.51 },
            { o: 146.51, h: 146.67, l: 144.42, c: 144.76 },
            { o: 144.76, h: 144.91, l: 142.72, c: 143.01 },
            { o: 143.01, h: 143.07, l: 141.12, c: 141.25 },
            { o: 141.25, h: 141.39, l: 139.16, c: 139.5 }
          ],
          zones: [
            {
              from: 13,
              top: 146.81,
              bottom: 145.5,
              kind: "demand",
              label: "Demand: gap origin"
            },
            {
              from: 3,
              top: 168.55,
              bottom: 167.54,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 7,
              top: 163.31,
              bottom: 162.39,
              kind: "supply",
              label: "Supply"
            }
          ],
          notes: [
            {
              x: 26,
              y: 154.6,
              text: "small margin"
            }
          ],
          reveal: 28
        }
      },
      {
        title: "Price keeps falling",
        narration: "The origin did not hold. With heavy supply overhead, buyers had nothing to gain, and price fell through. The margin decides.",
        scene: {
          candles: [
            { o: 150, h: 156.04, l: 149.95, c: 156 },
            { o: 156, h: 162.35, l: 155.93, c: 162 },
            { o: 162, h: 168.54, l: 161.75, c: 168 },
            { o: 168, h: 168.1, l: 167.39, c: 167.54 },
            { o: 167.54, h: 168.55, l: 167.41, c: 168.22 },
            { o: 168.22, h: 168.41, l: 165.4, c: 165.61 },
            { o: 165.61, h: 165.66, l: 162.8, c: 163 },
            { o: 163, h: 163.12, l: 162.13, c: 162.39 },
            { o: 162.39, h: 163.31, l: 162.15, c: 163.22 },
            { o: 163.22, h: 163.26, l: 158.83, c: 158.91 },
            { o: 158.91, h: 159.11, l: 154.39, c: 154.61 },
            { o: 154.61, h: 154.78, l: 150.23, c: 150.3 },
            { o: 150.3, h: 150.42, l: 145.59, c: 146 },
            { o: 146, h: 146.99, l: 145.9, c: 146.81 },
            { o: 146.81, h: 147.09, l: 145.5, c: 145.78 },
            { o: 149.78, h: 153.33, l: 149.65, c: 153.19 },
            { o: 153.19, h: 156.84, l: 153, c: 156.59 },
            { o: 156.59, h: 160.1, l: 156.37, c: 160 },
            { o: 160, h: 160.68, l: 159.91, c: 160.63 },
            { o: 160.63, h: 161.35, l: 160.53, c: 161.26 },
            { o: 161.26, h: 162.04, l: 161.16, c: 161.89 },
            { o: 161.89, h: 162.59, l: 161.09, c: 161.19 },
            { o: 161.19, h: 161.26, l: 158.11, c: 158.41 },
            { o: 158.41, h: 158.59, l: 155.57, c: 155.64 },
            { o: 155.64, h: 155.75, l: 152.39, c: 152.86 },
            { o: 152.86, h: 153, l: 149.76, c: 150.09 },
            { o: 150.09, h: 150.13, l: 147.11, c: 147.31 },
            { o: 147.31, h: 147.41, l: 146.41, c: 146.51 },
            { o: 146.51, h: 146.67, l: 144.42, c: 144.76 },
            { o: 144.76, h: 144.91, l: 142.72, c: 143.01 },
            { o: 143.01, h: 143.07, l: 141.12, c: 141.25 },
            { o: 141.25, h: 141.39, l: 139.16, c: 139.5 }
          ],
          zones: [
            {
              from: 13,
              top: 146.81,
              bottom: 145.5,
              kind: "demand",
              label: "Demand: gap origin"
            },
            {
              from: 3,
              top: 168.55,
              bottom: 167.54,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 7,
              top: 163.31,
              bottom: 162.39,
              kind: "supply",
              label: "Supply"
            }
          ],
          notes: [
            {
              x: 26,
              y: 154.6,
              text: "small margin"
            }
          ],
          highlight: {
            from: 28,
            to: 31,
            label: "through"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "The origin of a strong gap up is always a buy when price returns.",
        answer: false,
        explain: "Only if there is upside profit margin. With supply after supply above, there is no room, so it is not a buy."
      },
      {
        type: "spot",
        q: "Click the bandwagon candle in this chart.",
        scene: {
          candles: [
            { o: 130, h: 132.14, l: 129.88, c: 132 },
            { o: 132, h: 134.34, l: 131.95, c: 134 },
            { o: 134, h: 136.25, l: 133.91, c: 136 },
            { o: 136, h: 136.9, l: 135.68, c: 136.73 },
            { o: 136.73, h: 136.9, l: 135.38, c: 135.78 },
            { o: 135.78, h: 138.27, l: 135.7, c: 137.87 },
            { o: 137.87, h: 140.98, l: 137.82, c: 140.78 },
            { o: 140.78, h: 142.8, l: 140.7, c: 142.42 },
            { o: 142.42, h: 145.47, l: 142.27, c: 145.17 },
            { o: 145.17, h: 147.97, l: 145.09, c: 147.87 },
            { o: 147.87, h: 150.23, l: 147.74, c: 150 },
            { o: 150, h: 160.6, l: 149.8, c: 160 },
            { o: 160, h: 160.46, l: 159.18, c: 159.32 },
            { o: 159.32, h: 160.38, l: 158.98, c: 160.22 },
            { o: 160.22, h: 160.42, l: 156.28, c: 156.66 },
            { o: 156.66, h: 156.75, l: 152.97, c: 153.11 },
            { o: 153.11, h: 153.29, l: 149.11, c: 149.55 },
            { o: 149.55, h: 149.61, l: 145.78, c: 146 }
          ],
          zones: [
            {
              from: 3,
              top: 136.73,
              bottom: 135.38,
              kind: "demand",
              label: "XLT bought here"
            }
          ]
        },
        answer: {
          from: 11,
          to: 11
        },
        explain: "The largest green candle prints at the end of the rally, right into supply. That is where the late crowd buys aggressively."
      },
      {
        type: "mcq",
        q: "The move away from a supply was weak. What can still make it worth shorting?",
        options: [
          "A rising moving average",
          "A big profit margin, a news-driven stretch up the curve and levels on top of levels",
          "Three touches",
          "A big bid on Level II"
        ],
        answer: 1,
        explain: "Seiden shorted a weak-departure supply because the big margin below (mainly) plus stacked levels and the news stretch made up for it."
      },
      {
        type: "mcq",
        q: "Which question did Seiden ask himself when he had no mentor?",
        options: [
          "What do the experts say?",
          "Where is buying low?",
          "Which indicator is best?",
          "What is the trend on TV?"
        ],
        answer: 1,
        explain: "He asked simple questions like \"where is buying low?\" and answered them from the chart: a demand level."
      },
      {
        type: "order",
        q: "Order the bandwagon story from first to last.",
        items: [
          "XLT buys at demand before the crowd",
          "Price rallies",
          "The biggest candle prints as the crowd chases",
          "Price reaches supply",
          "XLT sells to the crowd"
        ],
        explain: "Enter early when risk is low; the late crowd provides your exit."
      }
    ],
    practice: [
      {
        prompt: "Price is back at the origin of a strong gap up, but two supply levels sit just above. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 156.04, l: 149.95, c: 156 },
            { o: 156, h: 162.35, l: 155.93, c: 162 },
            { o: 162, h: 168.54, l: 161.75, c: 168 },
            { o: 168, h: 168.1, l: 167.39, c: 167.54 },
            { o: 167.54, h: 168.55, l: 167.41, c: 168.22 },
            { o: 168.22, h: 168.41, l: 165.4, c: 165.61 },
            { o: 165.61, h: 165.66, l: 162.8, c: 163 },
            { o: 163, h: 163.12, l: 162.13, c: 162.39 },
            { o: 162.39, h: 163.31, l: 162.15, c: 163.22 },
            { o: 163.22, h: 163.26, l: 158.83, c: 158.91 },
            { o: 158.91, h: 159.11, l: 154.39, c: 154.61 },
            { o: 154.61, h: 154.78, l: 150.23, c: 150.3 },
            { o: 150.3, h: 150.42, l: 145.59, c: 146 },
            { o: 146, h: 146.99, l: 145.9, c: 146.81 },
            { o: 146.81, h: 147.09, l: 145.5, c: 145.78 },
            { o: 149.78, h: 153.33, l: 149.65, c: 153.19 },
            { o: 153.19, h: 156.84, l: 153, c: 156.59 },
            { o: 156.59, h: 160.1, l: 156.37, c: 160 },
            { o: 160, h: 160.68, l: 159.91, c: 160.63 },
            { o: 160.63, h: 161.35, l: 160.53, c: 161.26 },
            { o: 161.26, h: 162.04, l: 161.16, c: 161.89 },
            { o: 161.89, h: 162.59, l: 161.09, c: 161.19 },
            { o: 161.19, h: 161.26, l: 158.11, c: 158.41 },
            { o: 158.41, h: 158.59, l: 155.57, c: 155.64 },
            { o: 155.64, h: 155.75, l: 152.39, c: 152.86 },
            { o: 152.86, h: 153, l: 149.76, c: 150.09 },
            { o: 150.09, h: 150.13, l: 147.11, c: 147.31 },
            { o: 147.31, h: 147.41, l: 146.41, c: 146.51 },
            { o: 146.51, h: 146.67, l: 144.42, c: 144.76 },
            { o: 144.76, h: 144.91, l: 142.72, c: 143.01 },
            { o: 143.01, h: 143.07, l: 141.12, c: 141.25 },
            { o: 141.25, h: 141.39, l: 139.16, c: 139.5 }
          ],
          zones: [
            {
              from: 13,
              top: 146.81,
              bottom: 145.5,
              kind: "demand",
              label: "Demand: gap origin"
            },
            {
              from: 3,
              top: 168.55,
              bottom: 167.54,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 7,
              top: 163.31,
              bottom: 162.39,
              kind: "supply",
              label: "Supply"
            }
          ],
          reveal: 28
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Demand with supply right above means little reward for the risk. Not a buy. Price kept falling."
      },
      {
        prompt: "News drove a big rally. Two small supply levels formed side by side; the drop from them was weak. Below is a big empty space. Price is back at the supply. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 128, h: 129.26, l: 127.96, c: 129 },
            { o: 129, h: 130.24, l: 128.88, c: 130 },
            { o: 130, h: 131.24, l: 129.91, c: 131 },
            { o: 131, h: 132.17, l: 130.89, c: 132 },
            { o: 132, h: 132.42, l: 131.46, c: 131.64 },
            { o: 131.64, h: 132.47, l: 131.34, c: 132.19 },
            { o: 137.19, h: 141.6, l: 137.05, c: 141.41 },
            { o: 141.41, h: 146.84, l: 141.2, c: 146.4 },
            { o: 146.4, h: 150.87, l: 146.31, c: 150.62 },
            { o: 150.62, h: 155.45, l: 150.39, c: 155.32 },
            { o: 155.32, h: 160.16, l: 155.28, c: 160 },
            { o: 160, h: 160.14, l: 159.07, c: 159.21 },
            { o: 159.21, h: 160.45, l: 159.09, c: 160.22 },
            { o: 160.22, h: 160.26, l: 159.53, c: 159.61 },
            { o: 159.61, h: 159.68, l: 158.79, c: 159 },
            { o: 159, h: 159.86, l: 158.82, c: 159.64 },
            { o: 159.64, h: 159.82, l: 158.6, c: 158.78 },
            { o: 158.78, h: 158.85, l: 157.47, c: 157.6 },
            { o: 157.6, h: 157.65, l: 156.72, c: 156.76 },
            { o: 156.76, h: 156.88, l: 155.06, c: 155.19 },
            { o: 155.19, h: 155.28, l: 153.95, c: 154 },
            { o: 154, h: 155.56, l: 153.91, c: 155.46 },
            { o: 155.46, h: 157.16, l: 155.42, c: 156.92 },
            { o: 156.92, h: 158.62, l: 156.86, c: 158.38 },
            { o: 158.38, h: 159.38, l: 158.28, c: 159.08 },
            { o: 159.08, h: 159.24, l: 156.31, c: 156.75 },
            { o: 156.75, h: 156.83, l: 153.61, c: 154.07 },
            { o: 154.07, h: 154.11, l: 150.76, c: 151.06 },
            { o: 151.06, h: 151.16, l: 148.29, c: 148.38 },
            { o: 148.38, h: 148.55, l: 145.26, c: 145.64 },
            { o: 145.64, h: 145.77, l: 142.4, c: 142.79 },
            { o: 142.79, h: 142.92, l: 139.67, c: 140 }
          ],
          zones: [
            {
              from: 11,
              top: 160.45,
              bottom: 159.21,
              kind: "supply",
              label: "Supply level"
            },
            {
              from: 15,
              top: 159.86,
              bottom: 158.78,
              kind: "supply",
              label: "Supply level"
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Weak exit, but the big profit margin below, the stacked levels and the news-stretched rally make up for it. Sell. Price fell a long way."
      }
    ],
    cards: [
      {
        front: "Demand origin with supply right above?",
        back: "Not a buy: no profit margin."
      },
      {
        front: "Area of interest in a strong move up?",
        back: "The origin (the base), not the big green candles."
      },
      {
        front: "Big candle at the end of a move shows?",
        back: "The bandwagon: the late crowd chasing."
      },
      {
        front: "Main thing that offset a weak departure?",
        back: "A big profit margin."
      },
      {
        front: "Two account killers?",
        back: "Complicating things and following others."
      }
    ],
    mnemonic: "No room, no boom: demand needs space above it."
  },
  {
    mentor: "seiden",
    n: 349,
    eli5: {
      oneLiner: "Great news can deliver price to a terrible buying price.",
      story: "When you buy a car, you haggle to pay less. When you buy a stock, you are taught to wait until everything looks perfect, which is exactly when the price is high. That is paying $50,000 for a $30,000 car. When Intel posted amazing earnings, price gapped straight into the spot where a huge fall had started. The smart move was to sell, not buy.",
      analogy: "Buying an umbrella for ten dollars during a rainstorm when it cost two dollars on a sunny day."
    },
    bigIdeas: [
      "When every \"good stock\" box is ticked, price is probably high. Check for supply.",
      "A good-news gap into the origin of a big decline is a sell.",
      "Ask: if I buy here, will someone buy it from me higher?"
    ],
    steps: [
      {
        title: "Where did the big decline start?",
        narration: "Price paused for two candles at the top and then collapsed. Supply was far greater than demand right there. Mark it before anything else happens.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          highlight: {
            from: 4,
            to: 5,
            label: "origin"
          },
          reveal: 13
        }
      },
      {
        title: "Everything looks great",
        narration: "Price grinds back up for months. Good company, rising trend, rising averages. This is when most people are taught to buy, and it is exactly when price is high.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          highlight: {
            from: 13,
            to: 22,
            label: "looks healthy"
          },
          reveal: 23
        }
      },
      {
        title: "Great earnings gap price into supply",
        narration: "Earnings quadruple and price gaps up straight into the origin of the big decline. Ask one question: if I buy here, will someone buy it from me higher? With fresh supply right here, probably not.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          notes: [
            {
              x: 23,
              y: 180.78,
              text: "great earnings!"
            }
          ],
          highlight: {
            from: 23,
            to: 23,
            label: "gap into supply"
          },
          reveal: 24
        }
      },
      {
        title: "Be the seller",
        narration: "The buyers make two mistakes: buying after a rally and buying into supply. Sell to them at supply, stop above it, with targets at prior swing areas below.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          lines: [
            {
              y: 177.78,
              label: "Short",
              kind: "entry"
            },
            {
              y: 179.28,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 168.78,
              label: "T1",
              kind: "tp"
            },
            {
              y: 159.78,
              label: "T2",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 23,
              y: 180.78,
              text: "great earnings!"
            }
          ],
          reveal: 24
        }
      },
      {
        title: "Good news, wrong price",
        narration: "Price fell to both targets. The news was real, but the price was retail.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          lines: [
            {
              y: 177.78,
              label: "Short",
              kind: "entry"
            },
            {
              y: 179.28,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 168.78,
              label: "T1",
              kind: "tp"
            },
            {
              y: 159.78,
              label: "T2",
              kind: "tp"
            }
          ],
          notes: [
            {
              x: 23,
              y: 180.78,
              text: "great earnings!"
            }
          ],
          highlight: {
            from: 24,
            to: 29,
            label: "fall"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Earnings quadrupled and price gapped up into the origin of a huge prior decline. Buyer or seller?",
        options: [
          "Buyer, earnings are great",
          "Seller, price is at supply",
          "Neither, wait for the next report",
          "Buyer, the trend is up"
        ],
        answer: 1,
        explain: "The gap delivered price to where supply exceeds demand. Seiden was a seller."
      },
      {
        type: "tf",
        q: "Seiden says to buy stocks when the company is good, earnings are strong and the moving averages rise.",
        answer: false,
        explain: "When all of those are true, price is usually high. That is like paying $50,000 for a $30,000 car."
      },
      {
        type: "spot",
        q: "Click the base that makes the earnings gap a sell.",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          reveal: 24
        },
        answer: {
          from: 4,
          to: 5
        },
        explain: "The pause at the top left where the big decline began. The gap ran right into it."
      },
      {
        type: "mcq",
        q: "Which two mistakes did the buyers at the earnings gap make?",
        options: [
          "Using stops and targets",
          "Buying after a rally and buying into supply",
          "Selling too early and too small",
          "Using a daily chart"
        ],
        answer: 1,
        explain: "Buying after a rally into supply: the two classic losing moves."
      },
      {
        type: "tf",
        q: "The only question that matters is whether you should be the buyer or the seller at this price.",
        answer: true,
        explain: "Seiden keeps it to buy low, sell high, rather than getting lost in pattern recognition."
      }
    ],
    practice: [
      {
        prompt: "Great earnings just gapped the stock up into this level. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 164.65, l: 159.94, c: 164.5 },
            { o: 164.5, h: 169.46, l: 164.31, c: 169 },
            { o: 169, h: 173.81, l: 168.97, c: 173.5 },
            { o: 173.5, h: 178.4, l: 173.33, c: 178 },
            { o: 178, h: 178.78, l: 177.89, c: 178.47 },
            { o: 178.47, h: 178.61, l: 177.32, c: 177.78 },
            { o: 177.78, h: 177.99, l: 171.09, c: 171.19 },
            { o: 171.19, h: 171.24, l: 164.3, c: 164.59 },
            { o: 164.59, h: 164.8, l: 157.58, c: 158 },
            { o: 158, h: 158.12, l: 149.33, c: 149.61 },
            { o: 149.61, h: 149.66, l: 141.52, c: 141.62 },
            { o: 141.62, h: 141.87, l: 133.71, c: 134.1 },
            { o: 134.1, h: 134.36, l: 125.74, c: 126 },
            { o: 126, h: 130.47, l: 125.87, c: 130.29 },
            { o: 130.29, h: 135.04, l: 130.02, c: 134.84 },
            { o: 134.84, h: 138.49, l: 134.57, c: 137.94 },
            { o: 137.94, h: 141.38, l: 137.88, c: 141.23 },
            { o: 141.23, h: 145.44, l: 141.03, c: 145.2 },
            { o: 145.2, h: 150.54, l: 144.97, c: 150.45 },
            { o: 150.45, h: 154.02, l: 150.23, c: 153.63 },
            { o: 153.63, h: 157.91, l: 153.43, c: 157.77 },
            { o: 157.77, h: 162.99, l: 157.56, c: 162.69 },
            { o: 162.69, h: 166.52, l: 162.58, c: 166 },
            { o: 176.58, h: 178.78, l: 176.48, c: 178.38 },
            { o: 178.38, h: 178.58, l: 174.35, c: 174.85 },
            { o: 174.85, h: 174.96, l: 170.74, c: 171.31 },
            { o: 171.31, h: 171.4, l: 167.58, c: 167.78 },
            { o: 167.78, h: 167.94, l: 164.61, c: 164.66 },
            { o: 164.66, h: 164.77, l: 161.4, c: 161.48 },
            { o: 161.48, h: 161.64, l: 158.57, c: 158.98 }
          ],
          zones: [
            {
              from: 4,
              top: 178.78,
              bottom: 177.78,
              kind: "supply",
              label: "Supply: origin of a huge decline"
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Good news delivered price to the origin of a big decline: retail supply. Sell. Price dropped to both targets."
      },
      {
        prompt: "Terrible earnings gapped the stock down into the base where a huge rally began. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 140.06, l: 135.35, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.54, c: 131 },
            { o: 131, h: 131.03, l: 126.19, c: 126.5 },
            { o: 126.5, h: 126.67, l: 121.6, c: 122 },
            { o: 122, h: 122.11, l: 121.22, c: 121.53 },
            { o: 121.53, h: 122.68, l: 121.39, c: 122.22 },
            { o: 122.22, h: 128.91, l: 122.01, c: 128.81 },
            { o: 128.81, h: 135.7, l: 128.76, c: 135.41 },
            { o: 135.41, h: 142.42, l: 135.2, c: 142 },
            { o: 142, h: 150.67, l: 141.88, c: 150.39 },
            { o: 150.39, h: 158.48, l: 150.34, c: 158.38 },
            { o: 158.38, h: 166.29, l: 158.13, c: 165.9 },
            { o: 165.9, h: 174.26, l: 165.64, c: 174 },
            { o: 174, h: 174.13, l: 169.53, c: 169.71 },
            { o: 169.71, h: 169.98, l: 164.96, c: 165.16 },
            { o: 165.16, h: 165.43, l: 161.51, c: 162.06 },
            { o: 162.06, h: 162.12, l: 158.62, c: 158.77 },
            { o: 158.77, h: 158.97, l: 154.56, c: 154.8 },
            { o: 154.8, h: 155.03, l: 149.46, c: 149.55 },
            { o: 149.55, h: 149.77, l: 145.98, c: 146.37 },
            { o: 146.37, h: 146.57, l: 142.09, c: 142.23 },
            { o: 142.23, h: 142.44, l: 137.01, c: 137.31 },
            { o: 137.31, h: 137.42, l: 133.48, c: 134 },
            { o: 123.42, h: 123.52, l: 121.22, c: 121.62 },
            { o: 121.62, h: 125.65, l: 121.42, c: 125.15 },
            { o: 125.15, h: 129.26, l: 125.04, c: 128.69 },
            { o: 128.69, h: 132.42, l: 128.6, c: 132.22 },
            { o: 132.22, h: 135.39, l: 132.06, c: 135.34 },
            { o: 135.34, h: 138.6, l: 135.23, c: 138.52 },
            { o: 138.52, h: 141.43, l: 138.36, c: 141.02 }
          ],
          zones: [
            {
              from: 4,
              top: 122.22,
              bottom: 121.22,
              kind: "demand",
              label: "Demand: origin of a huge rally"
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The mirror case: bad news delivered price to wholesale demand. Ask who will pay you more later: buyers from here up. Price rallied."
      }
    ],
    cards: [
      {
        front: "All \"good stock\" boxes ticked usually means?",
        back: "Price is high."
      },
      {
        front: "Positive news gap into the origin of a strong decline?",
        back: "A sell, not a buy."
      },
      {
        front: "The question to ask before buying?",
        back: "Will someone buy it from me higher?"
      },
      {
        front: "Car analogy?",
        back: "Waiting for perfect news is paying $50,000 for a $30,000 car."
      },
      {
        front: "The only question that matters?",
        back: "Should I be the buyer or the seller here?"
      }
    ],
    mnemonic: "Good news, check the roof: is supply right above?"
  },
  {
    mentor: "seiden",
    n: 352,
    eli5: {
      oneLiner: "Buy only at fresh demand far down the curve, even on awful news.",
      story: "Imagine a bakery where the cookie tray was emptied at lunch, and another tray in the back nobody has touched. If you want a cookie, go to the full tray. A fresh demand level is the full tray: its buy orders have never been used. When BP collapsed on the oil-spill news, Seiden skipped the closer, already-emptied area and bought the fresh level far below.",
      analogy: "Fishing in a pond nobody has fished, instead of the one where everyone has been fishing all week."
    },
    bigIdeas: [
      "The lowest-risk buys are far down the supply/demand curve.",
      "Only buy FRESH demand; skip areas price has traded through again and again.",
      "Price usually gets that low on very bad news. Act on the level, not the feeling."
    ],
    steps: [
      {
        title: "The fresh base far below",
        narration: "Years ago price paused for two candles and rallied strongly. Price has never been back. That is fresh demand, far down the curve.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            }
          ],
          highlight: {
            from: 3,
            to: 4,
            label: "fresh base"
          },
          reveal: 8
        }
      },
      {
        title: "The grey area is not fresh",
        narration: "Higher up there is an area price traded through again and again. It looks like support, but the buy orders there were used up long ago. A key rule: demand must be fresh. Skip it.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          highlight: {
            from: 8,
            to: 20,
            label: "traded through"
          },
          reveal: 25
        }
      },
      {
        title: "Very bad news",
        narration: "A disaster hits and price collapses. The worse the news, the lower the price. Price drops into the grey area, and it does not hold.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          notes: [
            {
              x: 25,
              y: 178,
              text: "disaster news"
            }
          ],
          highlight: {
            from: 25,
            to: 27,
            label: "collapse"
          },
          reveal: 34
        }
      },
      {
        title: "Buy at fresh, wholesale demand",
        narration: "Price reaches the fresh base far down the curve. Demand greatly exceeds supply here, so price does not stay long. The logic is simple; acting is hard because the news is awful. Buy.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          lines: [
            {
              y: 112.22,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 110.52,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 25,
              y: 178,
              text: "disaster news"
            }
          ],
          reveal: 35
        }
      },
      {
        title: "The bounce",
        narration: "Price rallies strongly from the fresh level, as the XLT member who sold at 38.47 for an $11 gain saw.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          lines: [
            {
              y: 112.22,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 110.52,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 25,
              y: 178,
              text: "disaster news"
            }
          ],
          highlight: {
            from: 35,
            to: 39,
            label: "rally"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Why did XLT skip the grey area above the fresh demand?",
        options: [
          "It was too close to the price",
          "It was not fresh: price had traded through it many times",
          "The moving average was below it",
          "The news was too bad"
        ],
        answer: 1,
        explain: "A key rule requires fresh demand. The grey area had been traded through repeatedly."
      },
      {
        type: "spot",
        q: "Click the FRESH demand base.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          reveal: 31
        },
        answer: {
          from: 3,
          to: 4
        },
        explain: "The two-candle base far down at the left that launched a strong rally and was never revisited."
      },
      {
        type: "tf",
        q: "The worse the news, the lower the price usually goes.",
        answer: true,
        explain: "Stocks usually reach the deepest demand on very bad news. That is where the lowest risk buys are."
      },
      {
        type: "mcq",
        q: "Why does price not stay long at deep fresh demand?",
        options: [
          "Brokers close early",
          "Demand greatly exceeds supply there",
          "Volume is too high",
          "The news changes"
        ],
        answer: 1,
        explain: "At a level far down the curve, demand swamps supply, so price leaves quickly."
      },
      {
        type: "tf",
        q: "Seiden says the average person cannot time turning points.",
        answer: false,
        explain: "He says the average person can time them with high odds using rules: not always right, but high odds."
      }
    ],
    practice: [
      {
        prompt: "Disaster news. Price has dropped into the grey area that it has traded through many times. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The grey area is not fresh, so the buy orders are used up. No trade. Price fell straight through toward the fresh level."
      },
      {
        prompt: "Price has now fallen all the way to the fresh base far below. The news is still awful. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 122.18, c: 122.67 },
            { o: 122.67, h: 122.88, l: 116.95, c: 117.33 },
            { o: 117.33, h: 117.56, l: 111.41, c: 112 },
            { o: 112, h: 112.29, l: 111.02, c: 111.46 },
            { o: 111.46, h: 112.45, l: 111.1, c: 112.22 },
            { o: 112.22, h: 119.29, l: 112.06, c: 118.81 },
            { o: 118.81, h: 125.52, l: 118.77, c: 125.41 },
            { o: 125.41, h: 132.48, l: 125.31, c: 132 },
            { o: 132, h: 134.31, l: 131.27, c: 133.55 },
            { o: 133.55, h: 133.74, l: 130.54, c: 130.9 },
            { o: 130.9, h: 133.91, l: 130.76, c: 133.17 },
            { o: 133.17, h: 133.64, l: 129.8, c: 130.36 },
            { o: 130.36, h: 134.54, l: 129.91, c: 133.66 },
            { o: 133.66, h: 133.82, l: 131.15, c: 131.52 },
            { o: 131.52, h: 136.11, l: 131.3, c: 135.76 },
            { o: 135.76, h: 140.23, l: 135.6, c: 140 },
            { o: 140, h: 140.06, l: 134.9, c: 135.5 },
            { o: 135.5, h: 135.69, l: 130.6, c: 131 },
            { o: 131, h: 132.87, l: 130.85, c: 132.7 },
            { o: 132.7, h: 133.95, l: 132.63, c: 133.87 },
            { o: 133.87, h: 136.07, l: 133.77, c: 136 },
            { o: 136, h: 147.13, l: 135.92, c: 146.9 },
            { o: 146.9, h: 155.55, l: 146.68, c: 155.43 },
            { o: 155.43, h: 165.67, l: 155.21, c: 165.52 },
            { o: 165.52, h: 176.62, l: 165.3, c: 176 },
            { o: 176, h: 176.14, l: 166.76, c: 167.33 },
            { o: 167.33, h: 167.42, l: 158.13, c: 158.67 },
            { o: 158.67, h: 158.77, l: 149.71, c: 150 },
            { o: 150, h: 150.13, l: 141.73, c: 142.08 },
            { o: 142.08, h: 142.25, l: 133.66, c: 134.16 },
            { o: 134.16, h: 134.26, l: 132.06, c: 132.66 },
            { o: 132.66, h: 132.83, l: 125.59, c: 126.18 },
            { o: 126.18, h: 126.24, l: 119.62, c: 119.7 },
            { o: 119.7, h: 119.8, l: 113.11, c: 113.22 },
            { o: 113.22, h: 113.32, l: 111.42, c: 111.82 },
            { o: 111.82, h: 118.1, l: 111.75, c: 117.54 },
            { o: 117.54, h: 123.03, l: 117.37, c: 122.98 },
            { o: 122.98, h: 128.9, l: 122.74, c: 128.49 },
            { o: 128.49, h: 135.07, l: 128.46, c: 134.73 },
            { o: 134.73, h: 140.36, l: 134.51, c: 140 }
          ],
          zones: [
            {
              from: 3,
              top: 112.22,
              bottom: 111.02,
              kind: "demand",
              label: "Fresh demand"
            },
            {
              from: 8,
              top: 133.66,
              bottom: 129.8,
              kind: "demand",
              label: "Grey area: not fresh",
              faded: true
            }
          ],
          reveal: 35
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Fresh demand far down the curve with huge upside margin. Buy. Price rallied hard."
      }
    ],
    cards: [
      {
        front: "Lowest-risk buys sit where?",
        back: "Far down the supply/demand curve, at fresh demand."
      },
      {
        front: "A level traded through many times is?",
        back: "Not fresh: skip it."
      },
      {
        front: "How does price usually reach deep demand?",
        back: "On very bad news."
      },
      {
        front: "Why is acting hard at these levels?",
        back: "The news is so bad that emotion says sell."
      },
      {
        front: "BP: which level did XLT buy?",
        back: "Fresh monthly demand around $26-28."
      }
    ],
    mnemonic: "Fresh tray, full cookies: buy the untouched level."
  },
  {
    mentor: "seiden",
    n: 356,
    eli5: {
      oneLiner: "News is an invitation; the level decides whether you accept it.",
      story: "Every day the market sends you party invitations: earnings, news, tips, upgrades, indicators. A wise kid does not go to every party; she checks who is really there first. Seiden checks where price sits: at fresh demand, at fresh supply, or in the middle. Bad news at demand is a buy invitation, and good news at supply is a sell invitation. Everything else, he stays home.",
      analogy: "A coupon cutter does not buy because the ad is loud; she buys because the price is low. She already has the right belief system."
    },
    bigIdeas: [
      "Your belief system IS your strategy.",
      "News, earnings, upgrades and indicators are only invitations. Filter them through supply and demand.",
      "Negative news into fresh demand = buy; positive news into fresh supply = sell."
    ],
    steps: [
      {
        title: "Reality: where are the levels?",
        narration: "Before any news, read price. This base launched a rally: demand. At the top price based sideways and could not stay: more willing supply than demand.",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          zones: [
            {
              from: 4,
              top: 136.19,
              bottom: 135.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 13,
              top: 164.92,
              bottom: 163.3,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          highlight: {
            from: 13,
            to: 15,
            label: "could not stay"
          },
          reveal: 18
        }
      },
      {
        title: "The invitation arrives",
        narration: "Good news hits and price rallies back toward the top. The news invites you to buy. That is only an invitation, and it passes through your beliefs before it becomes an action.",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          zones: [
            {
              from: 4,
              top: 136.19,
              bottom: 135.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 13,
              top: 164.92,
              bottom: 163.3,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          notes: [
            {
              x: 18,
              y: 166.92,
              text: "good news: buy?"
            }
          ],
          highlight: {
            from: 18,
            to: 20,
            label: "news rally"
          },
          reveal: 22
        }
      },
      {
        title: "Apply the filter",
        narration: "Ask two questions. What does the news suggest I do? Buy. What would a consistently profitable buyer of anything do at this price? Not buy: price is at fresh supply after a big advance. Positive news into fresh supply is a selling opportunity.",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          zones: [
            {
              from: 4,
              top: 136.19,
              bottom: 135.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 13,
              top: 164.92,
              bottom: 163.3,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 163.3,
              label: "Sell",
              kind: "entry"
            },
            {
              y: 165.42,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 18,
              y: 166.92,
              text: "good news: buy?"
            }
          ],
          reveal: 22
        }
      },
      {
        title: "The filter wins",
        narration: "Price turns down. The buyers bought after a significant advance and at supply, the two novice mistakes.",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          zones: [
            {
              from: 4,
              top: 136.19,
              bottom: 135.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 13,
              top: 164.92,
              bottom: 163.3,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 163.3,
              label: "Sell",
              kind: "entry"
            },
            {
              y: 165.42,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 18,
              y: 166.92,
              text: "good news: buy?"
            }
          ],
          highlight: {
            from: 22,
            to: 27,
            label: "turn"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which is a \"market invitation based on reality\" in Seiden's view?",
        options: [
          "A broker upgrade",
          "A strong earnings report",
          "Price reaching fresh supply or demand",
          "A moving average cross"
        ],
        answer: 2,
        explain: "Only supply and demand in price is reality. News, upgrades and indicators are the other kind of invitation."
      },
      {
        type: "tf",
        q: "Failing to follow your rules is usually just a lack of discipline.",
        answer: false,
        explain: "Seiden says it is usually a conflict between your rules and your beliefs."
      },
      {
        type: "order",
        q: "Order the path from input to action.",
        items: [
          "News or indicator arrives",
          "Thoughts and perceptions (beliefs)",
          "Filter: where is price on the supply/demand curve?",
          "Action: buy at demand, sell at supply, or nothing"
        ],
        explain: "The profitable trader adds the objective filter before forming a perception and acting."
      },
      {
        type: "spot",
        q: "Click the base where price \"could not stay\" near the top.",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          reveal: 22
        },
        answer: {
          from: 13,
          to: 15
        },
        explain: "The sideways base at the top after the advance: more willing supply than demand."
      },
      {
        type: "tf",
        q: "A downgrade can be a low-risk buy.",
        answer: true,
        explain: "If the downgrade pushes price into fresh demand, it is a buy invitation, not a sell."
      },
      {
        type: "mcq",
        q: "To reach fresh demand, what must price do first?",
        options: [
          "Rise on good news",
          "Decline",
          "Go sideways for weeks",
          "Cross a moving average"
        ],
        answer: 1,
        explain: "Price must decline to reach fresh demand, which is why most people, who buy after rising prices, miss it."
      }
    ],
    practice: [
      {
        prompt: "Good news just lifted price back up after a big advance. Use the filter. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 130, h: 131.59, l: 129.92, c: 131.42 },
            { o: 131.42, h: 132.84, l: 131.38, c: 132.73 },
            { o: 132.73, h: 135.01, l: 132.58, c: 134.78 },
            { o: 134.78, h: 136.03, l: 134.74, c: 136 },
            { o: 136, h: 136.34, l: 135.48, c: 135.57 },
            { o: 135.57, h: 136.48, l: 135.36, c: 136.19 },
            { o: 136.19, h: 140.2, l: 136.12, c: 139.79 },
            { o: 139.79, h: 144.13, l: 139.67, c: 143.95 },
            { o: 143.95, h: 149.05, l: 143.69, c: 148.76 },
            { o: 148.76, h: 153.05, l: 148.66, c: 152.71 },
            { o: 152.71, h: 156.54, l: 152.55, c: 156.18 },
            { o: 156.18, h: 159.96, l: 156.11, c: 159.56 },
            { o: 159.56, h: 164.43, l: 159.52, c: 164 },
            { o: 164, h: 164.92, l: 163.63, c: 164.54 },
            { o: 164.54, h: 164.64, l: 162.98, c: 163.3 },
            { o: 163.3, h: 164.55, l: 163.18, c: 164.19 },
            { o: 164.19, h: 164.27, l: 161.42, c: 161.6 },
            { o: 161.6, h: 161.79, l: 158.71, c: 159 },
            { o: 159, h: 160.41, l: 158.87, c: 160.27 },
            { o: 160.27, h: 161.74, l: 160.18, c: 161.53 },
            { o: 161.53, h: 162.88, l: 161.5, c: 162.8 },
            { o: 162.8, h: 164.1, l: 162.7, c: 163.7 },
            { o: 163.7, h: 163.89, l: 160.45, c: 160.83 },
            { o: 160.83, h: 160.88, l: 157.28, c: 157.42 },
            { o: 157.42, h: 157.56, l: 154.78, c: 155.16 },
            { o: 155.16, h: 155.33, l: 151.01, c: 151.42 },
            { o: 151.42, h: 151.48, l: 149.09, c: 149.35 },
            { o: 149.35, h: 149.56, l: 145.91, c: 146 }
          ],
          zones: [
            {
              from: 4,
              top: 136.19,
              bottom: 135.36,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 13,
              top: 164.92,
              bottom: 163.3,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Positive news into fresh supply is a sell invitation. The news buyers bought after an advance and at supply. Price fell."
      },
      {
        prompt: "Terrible news just dropped price into a fresh demand base. Use the filter. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.08, l: 168.41, c: 168.58 },
            { o: 168.58, h: 168.62, l: 167.16, c: 167.27 },
            { o: 167.27, h: 167.42, l: 164.99, c: 165.22 },
            { o: 165.22, h: 165.26, l: 163.97, c: 164 },
            { o: 164, h: 164.52, l: 163.66, c: 164.43 },
            { o: 164.43, h: 164.64, l: 163.52, c: 163.81 },
            { o: 163.81, h: 163.88, l: 159.8, c: 160.21 },
            { o: 160.21, h: 160.33, l: 155.87, c: 156.05 },
            { o: 156.05, h: 156.31, l: 150.95, c: 151.24 },
            { o: 151.24, h: 151.34, l: 146.95, c: 147.29 },
            { o: 147.29, h: 147.45, l: 143.46, c: 143.82 },
            { o: 143.82, h: 143.89, l: 140.04, c: 140.44 },
            { o: 140.44, h: 140.48, l: 135.57, c: 136 },
            { o: 136, h: 136.37, l: 135.08, c: 135.46 },
            { o: 135.46, h: 137.02, l: 135.36, c: 136.7 },
            { o: 136.7, h: 136.82, l: 135.45, c: 135.81 },
            { o: 135.81, h: 138.58, l: 135.73, c: 138.4 },
            { o: 138.4, h: 141.29, l: 138.21, c: 141 },
            { o: 141, h: 141.13, l: 139.59, c: 139.73 },
            { o: 139.73, h: 139.82, l: 138.26, c: 138.47 },
            { o: 138.47, h: 138.5, l: 137.12, c: 137.2 },
            { o: 137.2, h: 137.3, l: 135.9, c: 136.3 },
            { o: 136.3, h: 139.55, l: 136.11, c: 139.17 },
            { o: 139.17, h: 142.72, l: 139.12, c: 142.58 },
            { o: 142.58, h: 145.22, l: 142.44, c: 144.84 },
            { o: 144.84, h: 148.99, l: 144.67, c: 148.58 },
            { o: 148.58, h: 150.91, l: 148.52, c: 150.65 },
            { o: 150.65, h: 154.09, l: 150.44, c: 154 }
          ],
          zones: [
            {
              from: 13,
              top: 136.7,
              bottom: 135.08,
              kind: "demand",
              label: "Fresh demand"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Negative news into fresh demand is a buy invitation. Price turned up."
      }
    ],
    cards: [
      {
        front: "Your strategy is a function of?",
        back: "Your belief system."
      },
      {
        front: "News, tips, upgrades, indicators are?",
        back: "Invitations (illusion), not signals."
      },
      {
        front: "Negative news into fresh demand?",
        back: "Typically a buying opportunity."
      },
      {
        front: "Positive news into fresh supply?",
        back: "Typically a selling opportunity."
      },
      {
        front: "Not following rules is usually?",
        back: "A conflict between rules and beliefs."
      },
      {
        front: "Clusters of activity are?",
        back: "Not necessarily true supply/demand."
      }
    ],
    mnemonic: "Invite, filter, act: check the level before you RSVP."
  },
  {
    mentor: "seiden",
    n: 366,
    eli5: {
      oneLiner: "Buy the first visit to a fresh level; each visit uses up orders.",
      story: "A demand level is a pile of buy orders, like a pile of sandbags. Each time price comes back, it knocks some bags off. The first visit meets the most bags, the second fewer, and after that the wall is mostly gone. So Seiden trades the first (sometimes second) return. He prefers levels with no busy trading to their left, lower on the curve, with a strong first rally.",
      analogy: "An all-you-can-eat buffet: arrive first and the trays are full; arrive third and only crumbs are left."
    },
    bigIdeas: [
      "Fresh = first or sometimes second return. After that, odds fall fast.",
      "A level with lots of recent price action to its left is likely not fresh.",
      "We seek better odds and big margins, not perfection."
    ],
    steps: [
      {
        title: "Two demand levels",
        narration: "Two places look like demand. The lower base was left with a strong rally. The higher one has lots of price action around it.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          reveal: 22
        }
      },
      {
        title: "Not fresh: busy to its left",
        narration: "The higher level has plenty of recent trading to its left. Buy orders there have already been used. Likely not fresh, weaker.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          highlight: {
            from: 11,
            to: 18,
            label: "recent action"
          },
          reveal: 22
        }
      },
      {
        title: "Lower on the curve, stronger rally",
        narration: "The lower level is further down the curve (bigger margin, higher probability) and its first rally was stronger. Plan the buy there.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          lines: [
            {
              y: 140.7,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 139.14,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 6,
            to: 7,
            label: "strong exit"
          },
          reveal: 22
        }
      },
      {
        title: "The busy level breaks",
        narration: "Price comes down, pauses at the busy level and breaks through it.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          lines: [
            {
              y: 140.7,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 139.14,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 26,
            to: 28,
            label: "breaks"
          },
          reveal: 29
        }
      },
      {
        title: "The fresh level holds",
        narration: "Price reaches the lower, fresh demand on its first return and rallies. Not perfect, just better odds and a big margin.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          lines: [
            {
              y: 140.7,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 139.14,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 32,
            to: 37,
            label: "first return"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What does \"fresh\" mean for Seiden?",
        options: [
          "Formed today",
          "Price is returning for the first, or sometimes second, time",
          "It has been touched three times",
          "It is near a moving average"
        ],
        answer: 1,
        explain: "Each return fills some buy orders. Enter the first (at most second) time price revisits."
      },
      {
        type: "spot",
        q: "Click the base of the stronger, fresher demand.",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          reveal: 22
        },
        answer: {
          from: 4,
          to: 5
        },
        explain: "The lower base: further down the curve, a strong first rally, and no busy trading to its left."
      },
      {
        type: "tf",
        q: "More candles and more activity at a level make it stronger.",
        answer: false,
        explain: "The opposite. A big imbalance means few transactions, few candles and low volume."
      },
      {
        type: "mcq",
        q: "Sell orders at 1070 and an even larger stack at 1071. How does that feel to a short seller?",
        options: [
          "Worse, too much competition",
          "More comfortable: levels on top of levels",
          "No different",
          "A reason to buy"
        ],
        answer: 1,
        explain: "Levels on top of levels is another odds enhancer."
      },
      {
        type: "tf",
        q: "Trading both a weaker and a better level robotically with stops and targets can still net a profit.",
        answer: true,
        explain: "Seiden notes it: trading is about better odds and large margins, not perfect levels."
      }
    ],
    practice: [
      {
        prompt: "Price is coming back to this demand for the THIRD time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 165, h: 165.06, l: 160.03, c: 160.25 },
            { o: 160.25, h: 160.41, l: 155.07, c: 155.5 },
            { o: 155.5, h: 155.74, l: 150.27, c: 150.75 },
            { o: 150.75, h: 150.87, l: 145.45, c: 146 },
            { o: 146, h: 146.37, l: 145.21, c: 145.39 },
            { o: 145.39, h: 146.43, l: 145.22, c: 146.19 },
            { o: 146.19, h: 150.27, l: 145.97, c: 150.13 },
            { o: 150.13, h: 154.54, l: 149.96, c: 154.06 },
            { o: 154.06, h: 158.37, l: 153.9, c: 158 },
            { o: 158, h: 158.18, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.44, l: 146.16, c: 146.59 },
            { o: 146.59, h: 146.69, l: 145.59, c: 145.79 },
            { o: 145.79, h: 148.9, l: 145.63, c: 148.49 },
            { o: 148.49, h: 151.39, l: 148.32, c: 151.19 },
            { o: 151.19, h: 151.32, l: 148.72, c: 148.89 },
            { o: 148.89, h: 148.94, l: 146.25, c: 146.59 },
            { o: 146.59, h: 146.69, l: 145.59, c: 145.79 },
            { o: 145.79, h: 148.13, l: 145.73, c: 147.99 },
            { o: 147.99, h: 150.49, l: 147.85, c: 150.19 },
            { o: 150.19, h: 150.23, l: 148.23, c: 148.39 },
            { o: 148.39, h: 148.48, l: 146.24, c: 146.59 },
            { o: 146.59, h: 146.69, l: 145.49, c: 145.69 },
            { o: 145.69, h: 145.78, l: 143.72, c: 143.86 },
            { o: 143.86, h: 143.9, l: 141.74, c: 142.04 },
            { o: 142.04, h: 142.14, l: 140.04, c: 140.21 }
          ],
          zones: [
            {
              from: 4,
              top: 146.19,
              bottom: 145.21,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "By the third visit most buy orders have been filled. The level is no longer fresh. Price broke down."
      },
      {
        prompt: "Price broke the busy demand and is now at the lower, fresh demand for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.05, l: 161.91, c: 162.5 },
            { o: 162.5, h: 162.71, l: 154.69, c: 155 },
            { o: 155, h: 155.08, l: 147.22, c: 147.5 },
            { o: 147.5, h: 147.76, l: 139.74, c: 140 },
            { o: 140, h: 141.13, l: 139.71, c: 140.7 },
            { o: 140.7, h: 141.15, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.17, l: 139.69, c: 145.9 },
            { o: 145.9, h: 152.44, l: 145.65, c: 152 },
            { o: 152, h: 153.85, l: 151.95, c: 153.61 },
            { o: 153.61, h: 156.1, l: 153.57, c: 155.91 },
            { o: 155.91, h: 158.36, l: 155.78, c: 158 },
            { o: 158, h: 158.14, l: 154.86, c: 155.04 },
            { o: 155.04, h: 155.23, l: 153.71, c: 153.76 },
            { o: 153.76, h: 153.9, l: 150.93, c: 151 },
            { o: 151, h: 151.43, l: 150, c: 150.29 },
            { o: 150.29, h: 152.66, l: 149.87, c: 152.38 },
            { o: 152.38, h: 152.62, l: 149.26, c: 149.62 },
            { o: 149.62, h: 152.49, l: 149.03, c: 151.94 },
            { o: 151.94, h: 152.17, l: 150.38, c: 150.64 },
            { o: 150.64, h: 155.49, l: 150.46, c: 155.43 },
            { o: 155.43, h: 160.78, l: 155.27, c: 160.21 },
            { o: 160.21, h: 165.06, l: 160.17, c: 165 },
            { o: 165, h: 165.19, l: 161.56, c: 161.97 },
            { o: 161.97, h: 162.08, l: 158.58, c: 158.94 },
            { o: 158.94, h: 158.97, l: 155.72, c: 155.91 },
            { o: 155.91, h: 156.11, l: 152.8, c: 152.88 },
            { o: 152.88, h: 152.98, l: 150.88, c: 151.38 },
            { o: 151.38, h: 151.51, l: 149.33, c: 149.45 },
            { o: 149.45, h: 149.62, l: 147.43, c: 147.53 },
            { o: 147.53, h: 147.6, l: 145.08, c: 145.45 },
            { o: 145.45, h: 145.54, l: 143.16, c: 143.38 },
            { o: 143.38, h: 143.43, l: 141.2, c: 141.3 },
            { o: 141.3, h: 141.4, l: 139.9, c: 140.3 },
            { o: 140.3, h: 143.1, l: 140.12, c: 142.84 },
            { o: 142.84, h: 145.83, l: 142.78, c: 145.38 },
            { o: 145.38, h: 148.23, l: 145.27, c: 147.92 },
            { o: 147.92, h: 150.68, l: 147.85, c: 150.46 },
            { o: 150.46, h: 153.44, l: 150.37, c: 153 }
          ],
          zones: [
            {
              from: 4,
              top: 140.7,
              bottom: 139.64,
              kind: "demand",
              label: "Lower demand (fresh, strong)"
            },
            {
              from: 14,
              top: 152.38,
              bottom: 149.03,
              kind: "demand",
              label: "Higher demand (busy, not fresh)"
            }
          ],
          reveal: 33
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Fresh, lower on the curve, strong first rally. Buy. Price rallied well off the level."
      }
    ],
    cards: [
      {
        front: "Demand is a stack of?",
        back: "Buy orders. Each return fills some of them."
      },
      {
        front: "Best time to trade a level?",
        back: "The first time price revisits it (at most the second)."
      },
      {
        front: "Recent price action to the left of a level means?",
        back: "Likely not fresh."
      },
      {
        front: "Lower on the curve means?",
        back: "Higher probability and bigger profit margin."
      },
      {
        front: "Seiden seeks perfection?",
        back: "No: better odds and large profit margins."
      }
    ],
    mnemonic: "First is full, third is empty."
  },
  {
    mentor: "seiden",
    n: 369,
    eli5: {
      oneLiner: "The order book can bluff. Price cannot. Trust price.",
      story: "Imagine a poker player who pushes a huge pile of fake chips into the middle to scare you. Level II and bid/offer screens can be like those fake chips: anyone can post a big order and pull it a millisecond later. Seiden once saw 1,600 bid against 200 offered right at supply. The book said buy, the chart said sell, and seconds later price collapsed.",
      analogy: "A shop window that says \"Huge crowd inside!\" while the store is empty. Look at what people actually paid, not the sign."
    },
    bigIdeas: [
      "Displayed bids and offers are not the real willing buyers and sellers.",
      "A big bid under fresh supply can be a lure for novice buyers.",
      "Check that the index is also at an aligned level to raise the odds."
    ],
    steps: [
      {
        title: "Supply on the chart",
        narration: "Price rallied, could not stay at this level for more than two candles and fell. Supply is bigger than demand there.",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "could not stay"
          },
          reveal: 10
        }
      },
      {
        title: "The rally back",
        narration: "Price rallies back toward the supply. This is the place to short.",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 159.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 161.33,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 14,
            to: 18,
            label: "rally"
          },
          reveal: 19
        }
      },
      {
        title: "The ladder says buy",
        narration: "At the touch the order book shows 1,600 bid and only 200 offered. Books say that means buy. But bids and offers can be posted and pulled in a millisecond, and real sellers do not show their size.",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 159.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 161.33,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 19,
              y: 162.33,
              text: "Bid 1600 / Offer 200"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "Trust price",
        narration: "Seconds later price falls rapidly. A big displayed bid is often a lure: institutions with too much to sell need novice buyers.",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 159.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 161.33,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 19,
              y: 162.33,
              text: "Bid 1600 / Offer 200"
            }
          ],
          highlight: {
            from: 20,
            to: 22,
            label: "price falls rapidly"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "If the bid size is much bigger than the offer, price will go up.",
        answer: false,
        explain: "In the AAPL example, 1,600 bid vs 200 offered sat right at supply and price collapsed seconds later."
      },
      {
        type: "mcq",
        q: "Why are Level II and the Matrix not reliable?",
        options: [
          "They are too slow",
          "Market makers can post and pull bids and offers freely",
          "They only show stocks",
          "They are always accurate"
        ],
        answer: 1,
        explain: "Orders can be pulled in a millisecond, and real institutional size is not shown."
      },
      {
        type: "spot",
        q: "Click the candle where the order book showed \"bid much bigger than offer\".",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          reveal: 20
        },
        answer: {
          from: 19,
          to: 19
        },
        explain: "At the touch of supply. That is where the bluff invites buyers, and where Seiden sells."
      },
      {
        type: "mcq",
        q: "XLNX rallies toward daily supply. What raises the odds of the short?",
        options: [
          "A big bid on Level II",
          "The NASDAQ (QQQQ) also approaching weekly supply",
          "Good earnings",
          "A rising moving average"
        ],
        answer: 1,
        explain: "An aligned index at higher timeframe supply makes the single-stock short stronger."
      },
      {
        type: "order",
        q: "Order the XLNX educational plan.",
        items: [
          "Spot daily supply in the stock",
          "Check that the index is also nearing supply",
          "Set entry at supply, stop above, target below",
          "Choose: short stock, puts or a credit spread"
        ],
        explain: "Levels and the plan come first; the vehicle comes last."
      }
    ],
    practice: [
      {
        prompt: "The stock rallied back to daily supply and its index is also at weekly supply. Plan the short.",
        scene: {
          candles: [
            { o: 132, h: 138.55, l: 131.73, c: 138.5 },
            { o: 138.5, h: 145.63, l: 138.29, c: 145 },
            { o: 145, h: 151.57, l: 144.83, c: 151.5 },
            { o: 151.5, h: 158.12, l: 151.36, c: 158 },
            { o: 158, h: 158.46, l: 157.18, c: 157.27 },
            { o: 157.27, h: 158.33, l: 157.05, c: 158.19 },
            { o: 158.19, h: 158.43, l: 152.99, c: 153.46 },
            { o: 153.46, h: 153.53, l: 148.11, c: 148.73 },
            { o: 148.73, h: 148.92, l: 143.45, c: 144 },
            { o: 144, h: 144.04, l: 142.24, c: 142.36 },
            { o: 142.36, h: 142.48, l: 141.09, c: 141.13 },
            { o: 141.13, h: 141.19, l: 139.84, c: 140 },
            { o: 140, h: 142.71, l: 139.91, c: 142.57 },
            { o: 142.57, h: 146.37, l: 142.39, c: 145.9 },
            { o: 145.9, h: 149.01, l: 145.7, c: 148.68 },
            { o: 148.68, h: 151.47, l: 148.51, c: 151.09 },
            { o: 151.09, h: 153.74, l: 150.89, c: 153.56 },
            { o: 153.56, h: 157.1, l: 153.44, c: 156.77 },
            { o: 156.77, h: 157.87, l: 156.67, c: 157.57 },
            { o: 157.57, h: 157.8, l: 153.73, c: 154.12 },
            { o: 154.12, h: 154.36, l: 150.12, c: 150.68 },
            { o: 150.68, h: 150.88, l: 147.05, c: 147.23 },
            { o: 147.23, h: 147.31, l: 143.75, c: 143.79 },
            { o: 143.79, h: 143.83, l: 140.21, c: 140.34 }
          ],
          zones: [
            {
              from: 4,
              top: 158.46,
              bottom: 157.27,
              kind: "supply",
              label: "Daily supply"
            }
          ],
          reveal: 19
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 157.27,
          sl: 158.96,
          tp: 140.64
        },
        explain: "Entry at the bottom line of supply, stop just above it, target near the low the drop made. Price fell to the target."
      },
      {
        prompt: "Price is at supply and the order book shows 1,600 bid versus 200 offered. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 144.08, l: 139.84, c: 143.94 },
            { o: 143.94, h: 148.23, l: 143.9, c: 148.2 },
            { o: 148.2, h: 152.56, l: 148.09, c: 152.33 },
            { o: 152.33, h: 156.51, l: 152.21, c: 156.1 },
            { o: 156.1, h: 160.07, l: 155.88, c: 160 },
            { o: 160, h: 160.68, l: 159.52, c: 160.53 },
            { o: 160.53, h: 160.83, l: 159.33, c: 159.81 },
            { o: 159.81, h: 160.05, l: 155.2, c: 155.54 },
            { o: 155.54, h: 155.61, l: 150.65, c: 151.27 },
            { o: 151.27, h: 151.52, l: 146.43, c: 147 },
            { o: 147, h: 148.19, l: 146.95, c: 148 },
            { o: 148, h: 149.21, l: 147.92, c: 149 },
            { o: 149, h: 149.04, l: 147.15, c: 147.25 },
            { o: 147.25, h: 147.38, l: 145.25, c: 145.5 },
            { o: 145.5, h: 148.49, l: 145.31, c: 148.26 },
            { o: 148.26, h: 151.42, l: 148.09, c: 151.02 },
            { o: 151.02, h: 154.23, l: 150.93, c: 153.79 },
            { o: 153.79, h: 156.66, l: 153.59, c: 156.55 },
            { o: 156.55, h: 159.7, l: 156.52, c: 159.31 },
            { o: 159.31, h: 160.61, l: 159.21, c: 160.21 },
            { o: 160.21, h: 160.34, l: 155.16, c: 155.47 },
            { o: 155.47, h: 155.62, l: 150.65, c: 150.74 },
            { o: 150.74, h: 151, l: 145.42, c: 146 }
          ],
          zones: [
            {
              from: 5,
              top: 160.83,
              bottom: 159.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          notes: [
            {
              x: 19,
              y: 162.33,
              text: "Bid 1600 / Offer 200"
            }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Trust price, not the ladder. The big bid is a lure under fresh supply. Price fell rapidly."
      }
    ],
    cards: [
      {
        front: "Who can you trust?",
        back: "Price."
      },
      {
        front: "Are Level II bids and offers real?",
        back: "Not exactly: they can be posted and pulled at will."
      },
      {
        front: "Why show a big bid at supply?",
        back: "To lure novice buyers for sellers with size."
      },
      {
        front: "Extra odds for a stock short?",
        back: "The index also at aligned higher timeframe supply."
      },
      {
        front: "XLNX vehicles named?",
        back: "Short stock, buy puts, or a credit spread."
      }
    ],
    mnemonic: "Chips can bluff, charts can't."
  },
  {
    mentor: "seiden",
    n: 373,
    eli5: {
      oneLiner: "Fewer candles at a level means a stronger level.",
      story: "At a busy playground swing, kids line up and take turns for an hour: that is balance. But if the ice cream truck pulls up, every kid drops everything and runs at once, and the swing is empty in seconds. A level where price stayed only a few candles is that moment: everyone was on one side. Textbooks say lots of candles and volume make a strong level. Seiden says the opposite.",
      analogy: "A hot stove: you touch it for half a second and leap away. The shorter the touch, the hotter the stove."
    },
    bigIdeas: [
      "The more out of balance, the less trading happens: few candles, low volume.",
      "Long busy areas are balance, not strong turning points.",
      "A thin, little-traded area below supply means little demand to stop a fall."
    ],
    steps: [
      {
        title: "A busy morning",
        narration: "Price traded sideways for a long time with many candles. Textbooks call that strong support and resistance. Seiden calls it balance: buyers and sellers agreed.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          highlight: {
            from: 0,
            to: 8,
            label: "many candles"
          },
          reveal: 9
        }
      },
      {
        title: "Four little candles",
        narration: "Then a small base of only four candles, and price gapped and dropped hard. Price could not stay. Hardly noticeable, and that is exactly why it is strong.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            },
            {
              from: 11,
              top: 156.18,
              bottom: 154.32,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          highlight: {
            from: 11,
            to: 14,
            label: "4 candles"
          },
          reveal: 18
        }
      },
      {
        title: "Why so few candles?",
        narration: "Where supply and demand are most out of balance, all the potential is on one side. Few trades happen, so few candles and low volume.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            },
            {
              from: 11,
              top: 156.18,
              bottom: 154.32,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          reveal: 18
        }
      },
      {
        title: "Amateur buying, professional selling",
        narration: "Price rallies back to just under the little level. The buyer probably ignored the level because it had so little activity. Short the first retrace.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            },
            {
              from: 11,
              top: 156.18,
              bottom: 154.32,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 154.32,
              label: "Short",
              kind: "entry"
            },
            {
              y: 156.58,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 18,
            to: 23,
            label: "amateur buying"
          },
          reveal: 25
        }
      },
      {
        title: "The collapse",
        narration: "Price collapses. Lack of activity is what made it such a strong supply level.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            },
            {
              from: 11,
              top: 156.18,
              bottom: 154.32,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          lines: [
            {
              y: 154.32,
              label: "Short",
              kind: "entry"
            },
            {
              y: 156.58,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 25,
            to: 29,
            label: "collapse"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Conventional TA says strong levels have many candles and heavy volume; Seiden agrees.",
        answer: false,
        explain: "He argues the opposite. The most out-of-balance levels have very few candles and low volume."
      },
      {
        type: "spot",
        q: "Click the small base that became the strong supply.",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          reveal: 18
        },
        answer: {
          from: 11,
          to: 14
        },
        explain: "The four little candles just before the drop, not the long busy area on the left."
      },
      {
        type: "mcq",
        q: "Why did the buyer at the retrace probably ignore the supply?",
        options: [
          "It was too far away",
          "It had so little activity that it was hardly noticeable",
          "The volume was huge",
          "It was on a weekly chart"
        ],
        answer: 1,
        explain: "Books teach that low-activity levels are weak, so the buyer ignored it. That is what made it strong."
      },
      {
        type: "mcq",
        q: "Price nears supply and the area below shows hardly any trading. What does that mean?",
        options: [
          "Strong demand below",
          "No demand below: price can fall through easily",
          "Nothing",
          "Buy the breakout"
        ],
        answer: 1,
        explain: "Thin trading means little time spent there, so no strong demand to stop a decline."
      },
      {
        type: "order",
        q: "Order the ES trade story.",
        items: [
          "A flat, busy morning",
          "A four-candle base forms",
          "Price drops hard",
          "Amateurs buy the rally back",
          "Short at the base and price collapses"
        ],
        explain: "The quiet level, not the busy one, held the imbalance."
      }
    ],
    practice: [
      {
        prompt: "Price rallied back to the four-candle level. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 161.24, l: 159.9, c: 160.71 },
            { o: 160.71, h: 160.8, l: 158.89, c: 159.19 },
            { o: 159.19, h: 161.08, l: 158.81, c: 160.95 },
            { o: 160.95, h: 161.37, l: 158.8, c: 159.2 },
            { o: 159.2, h: 160.9, l: 158.68, c: 160.6 },
            { o: 160.6, h: 160.88, l: 158.91, c: 159.04 },
            { o: 159.04, h: 161, l: 158.68, c: 160.77 },
            { o: 160.77, h: 161.24, l: 158.84, c: 159.17 },
            { o: 159.17, h: 160.77, l: 158.64, c: 160.29 },
            { o: 160.29, h: 160.39, l: 157.4, c: 157.64 },
            { o: 157.64, h: 157.83, l: 154.54, c: 155 },
            { o: 155, h: 155.42, l: 153.93, c: 154.32 },
            { o: 154.32, h: 155.99, l: 153.98, c: 155.74 },
            { o: 155.74, h: 156.18, l: 154.01, c: 154.39 },
            { o: 154.39, h: 155.39, l: 154.08, c: 155.19 },
            { o: 153.19, h: 153.46, l: 148.26, c: 148.79 },
            { o: 148.79, h: 148.96, l: 144.33, c: 144.4 },
            { o: 144.4, h: 144.46, l: 139.53, c: 140 },
            { o: 140, h: 142.04, l: 139.91, c: 141.99 },
            { o: 141.99, h: 145.11, l: 141.86, c: 144.86 },
            { o: 144.86, h: 147.53, l: 144.81, c: 147.41 },
            { o: 147.41, h: 149.56, l: 147.33, c: 149.4 },
            { o: 149.4, h: 152.22, l: 149.26, c: 152.02 },
            { o: 152.02, h: 154.25, l: 151.88, c: 153.92 },
            { o: 153.92, h: 154.92, l: 153.82, c: 154.62 },
            { o: 154.62, h: 154.73, l: 150.62, c: 150.9 },
            { o: 150.9, h: 151.08, l: 146.61, c: 147.17 },
            { o: 147.17, h: 147.37, l: 143.13, c: 143.45 },
            { o: 143.45, h: 143.53, l: 139.31, c: 139.72 },
            { o: 139.72, h: 139.94, l: 135.54, c: 136 }
          ],
          zones: [
            {
              from: 11,
              top: 156.18,
              bottom: 154.32,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 0,
              top: 161.37,
              bottom: 159.04,
              kind: "supply",
              label: "Busy area",
              faded: true
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Few candles, strong gap-drop, first retrace: short it. Price collapsed."
      },
      {
        prompt: "Price is back at supply. Below, the rally that brought price up had almost no trading. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 130, h: 134.43, l: 129.79, c: 134 },
            { o: 134, h: 138.61, l: 133.79, c: 138 },
            { o: 138, h: 142.14, l: 137.89, c: 142 },
            { o: 142, h: 142.46, l: 141.23, c: 141.43 },
            { o: 141.43, h: 142.42, l: 141.32, c: 142.19 },
            { o: 142.19, h: 149.35, l: 142.05, c: 149.1 },
            { o: 149.1, h: 156.23, l: 148.85, c: 156 },
            { o: 156, h: 161.81, l: 155.76, c: 161.34 },
            { o: 161.34, h: 166.34, l: 161.1, c: 166.28 },
            { o: 166.28, h: 172.61, l: 166.1, c: 172 },
            { o: 172, h: 172.18, l: 171.37, c: 171.63 },
            { o: 171.63, h: 172.55, l: 171.28, c: 172.19 },
            { o: 172.19, h: 172.26, l: 166.98, c: 167.46 },
            { o: 167.46, h: 167.54, l: 162.57, c: 162.73 },
            { o: 162.73, h: 162.93, l: 157.43, c: 158 },
            { o: 158, h: 158.09, l: 153.59, c: 154 },
            { o: 154, h: 154.15, l: 149.54, c: 150 },
            { o: 150, h: 154.51, l: 149.86, c: 153.97 },
            { o: 153.97, h: 157.87, l: 153.91, c: 157.38 },
            { o: 157.38, h: 161.11, l: 157.29, c: 160.8 },
            { o: 160.8, h: 164.31, l: 160.69, c: 163.98 },
            { o: 163.98, h: 168.2, l: 163.95, c: 167.78 },
            { o: 167.78, h: 171.53, l: 167.73, c: 171.23 },
            { o: 171.23, h: 172.23, l: 171.13, c: 171.93 },
            { o: 171.93, h: 172.19, l: 167.11, c: 167.61 },
            { o: 167.61, h: 167.77, l: 162.8, c: 163.29 },
            { o: 163.29, h: 163.34, l: 158.68, c: 158.97 },
            { o: 158.97, h: 159.07, l: 154.11, c: 154.64 },
            { o: 154.64, h: 154.71, l: 150.26, c: 150.32 },
            { o: 150.32, h: 150.45, l: 145.86, c: 146 }
          ],
          zones: [
            {
              from: 10,
              top: 172.55,
              bottom: 171.63,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "thin: no demand"
          },
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Overhead supply plus no solid demand below. The short side has room. Price fell."
      }
    ],
    cards: [
      {
        front: "Strong level: many or few candles?",
        back: "Few."
      },
      {
        front: "Strong level: high or low volume?",
        back: "Usually low volume."
      },
      {
        front: "Long busy sideways area means?",
        back: "Balance, not a strong level."
      },
      {
        front: "Thin trading below supply means?",
        back: "Little demand to stop a decline."
      },
      {
        front: "What makes a tiny level strong?",
        back: "Its lack of activity: a big imbalance."
      }
    ],
    mnemonic: "Quiet means strong: the hot stove is touched for a blink."
  },
  {
    mentor: "seiden",
    n: 377,
    eli5: {
      oneLiner: "Deep, liquid markets draw clean boxes. Sell the first return.",
      story: "In a huge, busy lake the water is calm and you can see the bottom clearly. The 10-year Treasury note is one of the biggest markets on Earth, so its supply and demand levels are clean and easy to see. Seiden saw price pause sideways in a fall, then drop again. When it rallied back to that box, he sold and took a quick $750 before catching his plane.",
      analogy: "Reading a sign in bright daylight versus fog: big liquid markets are the daylight."
    },
    bigIdeas: [
      "Liquid markets give clean, objective levels.",
      "A sideways pause in a decline, then a drop, is supply; sell the first rally back.",
      "Know the contract specs, but they never tell you where to buy and sell."
    ],
    steps: [
      {
        title: "Drop, base, drop",
        narration: "In a decline, price traded sideways for a few candles. It looks balanced, but it never is; the imbalance just takes time to show.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          highlight: {
            from: 5,
            to: 8,
            label: "sideways pause"
          },
          reveal: 9
        }
      },
      {
        title: "The drop proves supply",
        narration: "Price fell from the area. That proves supply exceeded demand there: retail prices. In a deep, liquid market like the 10-year note, you can almost draw a box around it.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          zones: [
            {
              from: 5,
              top: 161.25,
              bottom: 159.54,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 9,
            to: 11,
            label: "drop"
          },
          reveal: 16
        }
      },
      {
        title: "Sell the first rally back",
        narration: "Price rallies back up to the box. Short at the bottom line, stop just above the top line. Know your tick value so you can size the stop, but the contract specs never tell you where to trade.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          zones: [
            {
              from: 5,
              top: 161.25,
              bottom: 159.54,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 159.54,
              label: "Short",
              kind: "entry"
            },
            {
              y: 161.65,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 147.42,
              label: "Target",
              kind: "tp"
            }
          ],
          reveal: 23
        }
      },
      {
        title: "Bond down, rates up",
        narration: "Price falls. Bond prices and interest rates move opposite, so supply on the note means rates were about to rise.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          zones: [
            {
              from: 5,
              top: 161.25,
              bottom: 159.54,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 159.54,
              label: "Short",
              kind: "entry"
            },
            {
              y: 161.65,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 147.42,
              label: "Target",
              kind: "tp"
            }
          ],
          highlight: {
            from: 23,
            to: 27,
            label: "fall"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A sideways area means supply and demand are truly balanced.",
        answer: false,
        explain: "It is never a balanced equation. It simply takes time for the imbalance to play out."
      },
      {
        type: "mcq",
        q: "Bond prices rise. What usually happens to interest rates?",
        options: [
          "They rise",
          "They fall",
          "They stay the same",
          "They double"
        ],
        answer: 1,
        explain: "Bond prices and rates move opposite. Supply on the T-note means rates are about to rise."
      },
      {
        type: "spot",
        q: "Click the sideways pause that became supply.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          reveal: 16
        },
        answer: {
          from: 5,
          to: 8
        },
        explain: "The small sideways area inside the decline: drop, base, drop."
      },
      {
        type: "mcq",
        q: "What do the CME contract specs tell you?",
        options: [
          "Where to buy and sell",
          "Tick value, months, hours and symbols",
          "The next turning point",
          "The trend"
        ],
        answer: 1,
        explain: "Specs help size your stop and position, but never where to trade."
      },
      {
        type: "tf",
        q: "Seiden likes the 10-year note because its huge liquidity makes levels clean.",
        answer: true,
        explain: "Very liquid market, solid levels, easy to identify."
      }
    ],
    practice: [
      {
        prompt: "Price is back at the sideways box from the decline. Plan the trade.",
        scene: {
          candles: [
            { o: 176, h: 176.09, l: 172.22, c: 172.69 },
            { o: 172.69, h: 172.86, l: 169.52, c: 169.94 },
            { o: 169.94, h: 170.07, l: 166.26, c: 166.58 },
            { o: 166.58, h: 166.62, l: 163.12, c: 163.3 },
            { o: 163.3, h: 163.46, l: 159.77, c: 160 },
            { o: 160, h: 161.25, l: 159.59, c: 160.79 },
            { o: 160.79, h: 161.19, l: 159.24, c: 159.54 },
            { o: 159.54, h: 160.78, l: 159.15, c: 160.4 },
            { o: 160.4, h: 160.61, l: 159.36, c: 159.81 },
            { o: 159.81, h: 159.9, l: 155.73, c: 155.87 },
            { o: 155.87, h: 156.13, l: 151.71, c: 151.94 },
            { o: 151.94, h: 151.99, l: 147.73, c: 148 },
            { o: 148, h: 149.18, l: 147.93, c: 149 },
            { o: 149, h: 150.22, l: 148.94, c: 150 },
            { o: 150, h: 150.07, l: 148.02, c: 148.25 },
            { o: 148.25, h: 148.33, l: 146.22, c: 146.5 },
            { o: 146.5, h: 149.25, l: 146.45, c: 148.96 },
            { o: 148.96, h: 150.83, l: 148.93, c: 150.63 },
            { o: 150.63, h: 153.08, l: 150.5, c: 152.88 },
            { o: 152.88, h: 154.83, l: 152.82, c: 154.53 },
            { o: 154.53, h: 157.56, l: 154.4, c: 157.36 },
            { o: 157.36, h: 159.31, l: 157.27, c: 159.14 },
            { o: 159.14, h: 160.14, l: 159.04, c: 159.84 },
            { o: 159.84, h: 159.87, l: 157.12, c: 157.32 },
            { o: 157.32, h: 157.43, l: 154.58, c: 154.79 },
            { o: 154.79, h: 154.88, l: 151.94, c: 152.27 },
            { o: 152.27, h: 152.46, l: 149.56, c: 149.74 },
            { o: 149.74, h: 149.83, l: 147, c: 147.22 }
          ],
          zones: [
            {
              from: 5,
              top: 161.25,
              bottom: 159.54,
              kind: "supply",
              label: "Supply"
            }
          ],
          reveal: 23
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 159.54,
          sl: 161.65,
          tp: 147.42
        },
        explain: "Short the bottom of the box, stop just above, target near the low. Price fell to it."
      }
    ],
    cards: [
      {
        front: "Why trade the 10-year note?",
        back: "Huge volume and liquidity: clean, easy levels."
      },
      {
        front: "Is a sideways area balanced?",
        back: "Never; the imbalance just takes time to show."
      },
      {
        front: "Bond prices up means rates?",
        back: "Down (and the reverse)."
      },
      {
        front: "Contract specs tell you?",
        back: "Tick value, months, hours, symbols, not where to trade."
      },
      {
        front: "TY tick value?",
        back: "Half of 1/32, about $15.625."
      }
    ],
    mnemonic: "Big lake, clear bottom: liquid market, clean box."
  },
  {
    mentor: "seiden",
    n: 381,
    eli5: {
      oneLiner: "A breakout into fresh supply is a trap; be the hunter.",
      story: "A polar bear does not chase seals across the ice. It waits at the breathing hole where the seal must come up. Professionals do the same with traders: they wait where novices must act. When price breaks above an obvious high, like the overnight high, breakout buyers rush in. If fresh supply sits right above that high, those buyers just walked into the trap, and Seiden sells to them.",
      analogy: "A crocodile at the waterhole: the animals come for a drink because they are thirsty, and that is exactly where it waits."
    },
    bigIdeas: [
      "Bull trap: short when price breaks an obvious high into fresh supply just above.",
      "Bear trap: buy when price breaks an obvious low into fresh demand just below.",
      "Carry level lines forward so you know where price will likely turn."
    ],
    steps: [
      {
        title: "Supply above",
        narration: "Price paused at the top and fell sharply. Wrap two lines around that base and carry them forward. Now you know where price will likely turn.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          highlight: {
            from: 4,
            to: 5,
            label: "origin of sharp drop"
          },
          reveal: 9
        }
      },
      {
        title: "The obvious high",
        narration: "Overnight (Globex) price made a high just below the supply. Most traders watch that high. A break of it will look like strength.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            }
          ],
          highlight: {
            from: 9,
            to: 15,
            label: "overnight"
          },
          reveal: 16
        }
      },
      {
        title: "Breakout buyers rush in",
        narration: "In the session price rallies above the Globex high. Breakout buyers jump in, straight into fresh supply. When fresh supply sits just above, that bullish thinking is a trap.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            }
          ],
          highlight: {
            from: 16,
            to: 19,
            label: "breakout"
          },
          reveal: 20
        }
      },
      {
        title: "Spring the trap",
        narration: "Short at supply with a small stop just above it, targets below. The breakout buyers provide the liquidity for the short.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            },
            {
              y: 159.38,
              label: "Short",
              kind: "entry"
            },
            {
              y: 160.95,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 155.38,
              label: "T1",
              kind: "tp"
            },
            {
              y: 150.38,
              label: "T2",
              kind: "tp"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "Hunter and hunted",
        narration: "The entry became the high of the day and both targets filled. Trading is a transfer from those who fall for traps to those who set them.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            },
            {
              y: 159.38,
              label: "Short",
              kind: "entry"
            },
            {
              y: 160.95,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 155.38,
              label: "T1",
              kind: "tp"
            },
            {
              y: 150.38,
              label: "T2",
              kind: "tp"
            }
          ],
          highlight: {
            from: 20,
            to: 24,
            label: "both targets"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What makes a breakout above the Globex high a bull trap?",
        options: [
          "High volume",
          "Fresh supply sitting just above that high",
          "A rising moving average",
          "Good news"
        ],
        answer: 1,
        explain: "When fresh supply is right above, the breakout buyers are buying straight into it."
      },
      {
        type: "spot",
        q: "Click the candle where the bull trap springs.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            }
          ],
          reveal: 20
        },
        answer: {
          from: 19,
          to: 19
        },
        explain: "The candle that pushes above the Globex high into supply. Breakout buyers there are your liquidity."
      },
      {
        type: "tf",
        q: "Seiden is trained to buy a new high of the day.",
        answer: false,
        explain: "Most are trained to buy the new high at supply; he is trained to sell there."
      },
      {
        type: "mcq",
        q: "In the Pro Picks ES trade: entry 1182, stop 1184.25, T1 1179, T2 1175. Why is this lopsided?",
        options: [
          "A small stop above supply against two targets well below",
          "Because the stop is far away",
          "Because there is no stop",
          "It is not lopsided"
        ],
        answer: 0,
        explain: "About 2 points of risk against 3 and 7 points to the targets."
      },
      {
        type: "order",
        q: "Order the bull trap trade.",
        items: [
          "Mark fresh supply and carry it forward",
          "Note the obvious high just below it",
          "Price breaks the high: breakout buyers rush in",
          "Short at supply with a small stop",
          "Cover at T1 and T2"
        ],
        explain: "Plan the trap first, then let the novices walk into it."
      }
    ],
    practice: [
      {
        prompt: "Overnight low sits just above fresh demand. In the session price breaks below the overnight low, into the demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 154, h: 154.23, l: 150.26, c: 150.5 },
            { o: 150.5, h: 150.69, l: 146.85, c: 147 },
            { o: 147, h: 147.19, l: 143.47, c: 143.5 },
            { o: 143.5, h: 143.57, l: 139.93, c: 140 },
            { o: 140, h: 141.05, l: 139.9, c: 140.62 },
            { o: 140.62, h: 141.08, l: 139.45, c: 139.81 },
            { o: 139.81, h: 145.16, l: 139.6, c: 144.54 },
            { o: 144.54, h: 149.72, l: 144.42, c: 149.27 },
            { o: 149.27, h: 154.22, l: 149, c: 154 },
            { o: 154, h: 154.2, l: 150.74, c: 150.93 },
            { o: 150.93, h: 151.1, l: 147.75, c: 148.01 },
            { o: 148.01, h: 148.15, l: 145.38, c: 145.86 },
            { o: 145.86, h: 145.97, l: 142.56, c: 142.62 },
            { o: 142.62, h: 144.05, l: 142.48, c: 143.93 },
            { o: 143.93, h: 145.49, l: 143.89, c: 145.25 },
            { o: 145.25, h: 146.84, l: 145.16, c: 146.56 },
            { o: 146.56, h: 146.66, l: 145.17, c: 145.32 },
            { o: 145.32, h: 145.37, l: 144.12, c: 144.34 },
            { o: 144.34, h: 144.43, l: 143.31, c: 143.56 },
            { o: 143.56, h: 143.66, l: 139.92, c: 140.22 },
            { o: 140.22, h: 142.1, l: 140.12, c: 141.85 },
            { o: 141.85, h: 143.62, l: 141.73, c: 143.49 },
            { o: 143.49, h: 145.19, l: 143.41, c: 145.12 },
            { o: 145.12, h: 147.91, l: 145.05, c: 147.62 },
            { o: 147.62, h: 150.17, l: 147.47, c: 150.12 }
          ],
          zones: [
            {
              from: 4,
              top: 140.62,
              bottom: 139.45,
              kind: "demand",
              label: "Fresh demand"
            }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The bear trap: breakdown sellers sell into fresh demand. Buy. Price rallied to both targets."
      },
      {
        prompt: "Price just broke above the Globex high into fresh supply. Plan the trade.",
        scene: {
          candles: [
            { o: 146, h: 149.74, l: 145.77, c: 149.5 },
            { o: 149.5, h: 153.15, l: 149.31, c: 153 },
            { o: 153, h: 156.53, l: 152.81, c: 156.5 },
            { o: 156.5, h: 160.07, l: 156.43, c: 160 },
            { o: 160, h: 160.1, l: 158.95, c: 159.38 },
            { o: 159.38, h: 160.55, l: 158.92, c: 160.19 },
            { o: 160.19, h: 160.4, l: 154.84, c: 155.46 },
            { o: 155.46, h: 155.58, l: 150.28, c: 150.73 },
            { o: 150.73, h: 151, l: 145.78, c: 146 },
            { o: 146, h: 149.26, l: 145.8, c: 149.07 },
            { o: 149.07, h: 152.25, l: 148.9, c: 151.99 },
            { o: 151.99, h: 154.62, l: 151.85, c: 154.14 },
            { o: 154.14, h: 157.44, l: 154.03, c: 157.38 },
            { o: 157.38, h: 157.52, l: 155.95, c: 156.07 },
            { o: 156.07, h: 156.11, l: 154.51, c: 154.75 },
            { o: 154.75, h: 154.84, l: 153.16, c: 153.44 },
            { o: 153.44, h: 154.83, l: 153.34, c: 154.68 },
            { o: 154.68, h: 155.88, l: 154.63, c: 155.66 },
            { o: 155.66, h: 156.69, l: 155.57, c: 156.44 },
            { o: 156.44, h: 160.08, l: 156.34, c: 159.78 },
            { o: 159.78, h: 159.88, l: 157.9, c: 158.15 },
            { o: 158.15, h: 158.27, l: 156.38, c: 156.51 },
            { o: 156.51, h: 156.59, l: 154.81, c: 154.88 },
            { o: 154.88, h: 154.95, l: 152.09, c: 152.38 },
            { o: 152.38, h: 152.53, l: 149.83, c: 149.88 }
          ],
          zones: [
            {
              from: 4,
              top: 160.55,
              bottom: 159.38,
              kind: "supply",
              label: "Fresh supply"
            }
          ],
          lines: [
            {
              y: 157.44,
              label: "Globex high",
              kind: "level",
              from: 9
            }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 159.38,
          sl: 160.95,
          tp: 150.38
        },
        explain: "Short at the supply, stop just above it, final target well below. The breakout high became the high of the day."
      }
    ],
    cards: [
      {
        front: "Bull trap?",
        back: "Price breaks an obvious high into fresh supply just above: short."
      },
      {
        front: "Bear trap?",
        back: "Price breaks an obvious low into fresh demand just below: buy."
      },
      {
        front: "Who provides the liquidity for a bull trap short?",
        back: "The breakout buyers."
      },
      {
        front: "Why carry lines forward?",
        back: "To know in advance where price will likely turn."
      },
      {
        front: "Trading is a transfer from...?",
        back: "Those who fall for traps to those who set them."
      }
    ],
    mnemonic: "Wait at the waterhole: break of the obvious high, into supply, is the hunt."
  },
  {
    mentor: "seiden",
    n: 385,
    eli5: {
      oneLiner: "If it quacks like a duck, it is a duck: buy wholesale.",
      story: "A gas station buys a pack of gum for 25 cents and sells it for a dollar. That is the whole business, and trading is the same. Supply and demand have never changed, just like gravity. When the Euro fell for days into fresh demand, Seiden bought, even though both trends were down. At the same moment the US Dollar was hitting fresh supply, the mirror image.",
      analogy: "A seesaw: when one side (the Dollar) is at the very top, the other side (the Euro) is at the very bottom."
    },
    bigIdeas: [
      "Buy at fresh demand (wholesale), sell at fresh supply (retail). It never changes.",
      "An inverse market at the opposite level at the same time raises the odds.",
      "One swing level can give several shorter-term trades."
    ],
    steps: [
      {
        title: "Wholesale on the Euro",
        narration: "Price paused for two candles and rallied strongly: fresh demand. This is the wholesale price, like a gas station buying gum at 25 cents.",
        scene: {
          candles: [
            { o: 176, h: 176.12, l: 167.31, c: 167.5 },
            { o: 167.5, h: 167.53, l: 158.74, c: 159 },
            { o: 159, h: 159.1, l: 150.08, c: 150.5 },
            { o: 150.5, h: 150.55, l: 141.39, c: 142 },
            { o: 142, h: 142.93, l: 141.9, c: 142.67 },
            { o: 142.67, h: 142.86, l: 141.61, c: 141.81 },
            { o: 141.81, h: 147.24, l: 141.71, c: 147.21 },
            { o: 147.21, h: 153.07, l: 147.15, c: 152.6 },
            { o: 152.6, h: 158.15, l: 152.46, c: 158 },
            { o: 158, h: 162.48, l: 157.83, c: 161.97 },
            { o: 161.97, h: 165.37, l: 161.73, c: 164.8 },
            { o: 164.8, h: 169.33, l: 164.6, c: 169.22 },
            { o: 169.22, h: 172.21, l: 169.08, c: 172 },
            { o: 172, h: 172.22, l: 168.25, c: 168.44 },
            { o: 168.44, h: 168.56, l: 164.31, c: 164.73 },
            { o: 164.73, h: 164.85, l: 161.39, c: 161.81 },
            { o: 161.81, h: 162.01, l: 157.44, c: 157.98 },
            { o: 157.98, h: 158.16, l: 153.91, c: 154.35 },
            { o: 154.35, h: 154.39, l: 150.25, c: 150.64 },
            { o: 150.64, h: 150.87, l: 147.02, c: 147.44 },
            { o: 147.44, h: 147.52, l: 143, c: 143.17 },
            { o: 143.17, h: 143.27, l: 141.87, c: 142.27 },
            { o: 142.27, h: 144.95, l: 142.23, c: 144.85 },
            { o: 144.85, h: 147.72, l: 144.75, c: 147.42 },
            { o: 147.42, h: 150.19, l: 147.33, c: 150 },
            { o: 150, h: 150.12, l: 148.28, c: 148.5 },
            { o: 148.5, h: 148.65, l: 146.93, c: 147 },
            { o: 147, h: 150.27, l: 146.84, c: 150 },
            { o: 150, h: 153.41, l: 149.79, c: 153 },
            { o: 153, h: 156.14, l: 152.84, c: 156 }
          ],
          zones: [
            {
              from: 4,
              top: 142.67,
              bottom: 141.61,
              kind: "demand",
              label: "Fresh demand (Euro)"
            }
          ],
          highlight: {
            from: 4,
            to: 5,
            label: "base"
          },
          reveal: 9
        }
      },
      {
        title: "Days of decline into it",
        narration: "Both trends point down and the Euro falls for days toward the demand. Selling here because the trend is down would be selling at wholesale.",
        scene: {
          candles: [
            { o: 176, h: 176.12, l: 167.31, c: 167.5 },
            { o: 167.5, h: 167.53, l: 158.74, c: 159 },
            { o: 159, h: 159.1, l: 150.08, c: 150.5 },
            { o: 150.5, h: 150.55, l: 141.39, c: 142 },
            { o: 142, h: 142.93, l: 141.9, c: 142.67 },
            { o: 142.67, h: 142.86, l: 141.61, c: 141.81 },
            { o: 141.81, h: 147.24, l: 141.71, c: 147.21 },
            { o: 147.21, h: 153.07, l: 147.15, c: 152.6 },
            { o: 152.6, h: 158.15, l: 152.46, c: 158 },
            { o: 158, h: 162.48, l: 157.83, c: 161.97 },
            { o: 161.97, h: 165.37, l: 161.73, c: 164.8 },
            { o: 164.8, h: 169.33, l: 164.6, c: 169.22 },
            { o: 169.22, h: 172.21, l: 169.08, c: 172 },
            { o: 172, h: 172.22, l: 168.25, c: 168.44 },
            { o: 168.44, h: 168.56, l: 164.31, c: 164.73 },
            { o: 164.73, h: 164.85, l: 161.39, c: 161.81 },
            { o: 161.81, h: 162.01, l: 157.44, c: 157.98 },
            { o: 157.98, h: 158.16, l: 153.91, c: 154.35 },
            { o: 154.35, h: 154.39, l: 150.25, c: 150.64 },
            { o: 150.64, h: 150.87, l: 147.02, c: 147.44 },
            { o: 147.44, h: 147.52, l: 143, c: 143.17 },
            { o: 143.17, h: 143.27, l: 141.87, c: 142.27 },
            { o: 142.27, h: 144.95, l: 142.23, c: 144.85 },
            { o: 144.85, h: 147.72, l: 144.75, c: 147.42 },
            { o: 147.42, h: 150.19, l: 147.33, c: 150 },
            { o: 150, h: 150.12, l: 148.28, c: 148.5 },
            { o: 148.5, h: 148.65, l: 146.93, c: 147 },
            { o: 147, h: 150.27, l: 146.84, c: 150 },
            { o: 150, h: 153.41, l: 149.79, c: 153 },
            { o: 153, h: 156.14, l: 152.84, c: 156 }
          ],
          zones: [
            {
              from: 4,
              top: 142.67,
              bottom: 141.61,
              kind: "demand",
              label: "Fresh demand (Euro)"
            }
          ],
          highlight: {
            from: 13,
            to: 20,
            label: "decline"
          },
          reveal: 21
        }
      },
      {
        title: "The mirror market agrees",
        narration: "At the same time the US Dollar index is rallying into fresh supply. When the inverse market sits at the opposite level, the odds of both turns rise. Buy the Euro at demand.",
        scene: {
          candles: [
            { o: 176, h: 176.12, l: 167.31, c: 167.5 },
            { o: 167.5, h: 167.53, l: 158.74, c: 159 },
            { o: 159, h: 159.1, l: 150.08, c: 150.5 },
            { o: 150.5, h: 150.55, l: 141.39, c: 142 },
            { o: 142, h: 142.93, l: 141.9, c: 142.67 },
            { o: 142.67, h: 142.86, l: 141.61, c: 141.81 },
            { o: 141.81, h: 147.24, l: 141.71, c: 147.21 },
            { o: 147.21, h: 153.07, l: 147.15, c: 152.6 },
            { o: 152.6, h: 158.15, l: 152.46, c: 158 },
            { o: 158, h: 162.48, l: 157.83, c: 161.97 },
            { o: 161.97, h: 165.37, l: 161.73, c: 164.8 },
            { o: 164.8, h: 169.33, l: 164.6, c: 169.22 },
            { o: 169.22, h: 172.21, l: 169.08, c: 172 },
            { o: 172, h: 172.22, l: 168.25, c: 168.44 },
            { o: 168.44, h: 168.56, l: 164.31, c: 164.73 },
            { o: 164.73, h: 164.85, l: 161.39, c: 161.81 },
            { o: 161.81, h: 162.01, l: 157.44, c: 157.98 },
            { o: 157.98, h: 158.16, l: 153.91, c: 154.35 },
            { o: 154.35, h: 154.39, l: 150.25, c: 150.64 },
            { o: 150.64, h: 150.87, l: 147.02, c: 147.44 },
            { o: 147.44, h: 147.52, l: 143, c: 143.17 },
            { o: 143.17, h: 143.27, l: 141.87, c: 142.27 },
            { o: 142.27, h: 144.95, l: 142.23, c: 144.85 },
            { o: 144.85, h: 147.72, l: 144.75, c: 147.42 },
            { o: 147.42, h: 150.19, l: 147.33, c: 150 },
            { o: 150, h: 150.12, l: 148.28, c: 148.5 },
            { o: 148.5, h: 148.65, l: 146.93, c: 147 },
            { o: 147, h: 150.27, l: 146.84, c: 150 },
            { o: 150, h: 153.41, l: 149.79, c: 153 },
            { o: 153, h: 156.14, l: 152.84, c: 156 }
          ],
          zones: [
            {
              from: 4,
              top: 142.67,
              bottom: 141.61,
              kind: "demand",
              label: "Fresh demand (Euro)"
            }
          ],
          lines: [
            {
              y: 142.67,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 141.11,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 20,
              y: 154.67,
              text: "Dollar at fresh supply"
            }
          ],
          reveal: 22
        }
      },
      {
        title: "Many trades from one level",
        narration: "Price turns up. One swing level can be used for several shorter-term trades, as Seiden did for about $4,400.",
        scene: {
          candles: [
            { o: 176, h: 176.12, l: 167.31, c: 167.5 },
            { o: 167.5, h: 167.53, l: 158.74, c: 159 },
            { o: 159, h: 159.1, l: 150.08, c: 150.5 },
            { o: 150.5, h: 150.55, l: 141.39, c: 142 },
            { o: 142, h: 142.93, l: 141.9, c: 142.67 },
            { o: 142.67, h: 142.86, l: 141.61, c: 141.81 },
            { o: 141.81, h: 147.24, l: 141.71, c: 147.21 },
            { o: 147.21, h: 153.07, l: 147.15, c: 152.6 },
            { o: 152.6, h: 158.15, l: 152.46, c: 158 },
            { o: 158, h: 162.48, l: 157.83, c: 161.97 },
            { o: 161.97, h: 165.37, l: 161.73, c: 164.8 },
            { o: 164.8, h: 169.33, l: 164.6, c: 169.22 },
            { o: 169.22, h: 172.21, l: 169.08, c: 172 },
            { o: 172, h: 172.22, l: 168.25, c: 168.44 },
            { o: 168.44, h: 168.56, l: 164.31, c: 164.73 },
            { o: 164.73, h: 164.85, l: 161.39, c: 161.81 },
            { o: 161.81, h: 162.01, l: 157.44, c: 157.98 },
            { o: 157.98, h: 158.16, l: 153.91, c: 154.35 },
            { o: 154.35, h: 154.39, l: 150.25, c: 150.64 },
            { o: 150.64, h: 150.87, l: 147.02, c: 147.44 },
            { o: 147.44, h: 147.52, l: 143, c: 143.17 },
            { o: 143.17, h: 143.27, l: 141.87, c: 142.27 },
            { o: 142.27, h: 144.95, l: 142.23, c: 144.85 },
            { o: 144.85, h: 147.72, l: 144.75, c: 147.42 },
            { o: 147.42, h: 150.19, l: 147.33, c: 150 },
            { o: 150, h: 150.12, l: 148.28, c: 148.5 },
            { o: 148.5, h: 148.65, l: 146.93, c: 147 },
            { o: 147, h: 150.27, l: 146.84, c: 150 },
            { o: 150, h: 153.41, l: 149.79, c: 153 },
            { o: 153, h: 156.14, l: 152.84, c: 156 }
          ],
          zones: [
            {
              from: 4,
              top: 142.67,
              bottom: 141.61,
              kind: "demand",
              label: "Fresh demand (Euro)"
            }
          ],
          lines: [
            {
              y: 142.67,
              label: "Buy",
              kind: "entry"
            },
            {
              y: 141.11,
              label: "Stop",
              kind: "sl"
            }
          ],
          notes: [
            {
              x: 20,
              y: 154.67,
              text: "Dollar at fresh supply"
            }
          ],
          highlight: {
            from: 22,
            to: 29,
            label: "turn"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The Euro falls into fresh demand. What would raise the odds of the long?",
        options: [
          "The Dollar index reaching fresh supply at the same time",
          "Both trends pointing down",
          "A pundit calling for lower prices",
          "A big candle down"
        ],
        answer: 0,
        explain: "The inverse market at the opposite level is a mirror-image confirmation."
      },
      {
        type: "tf",
        q: "Since both trends are down, the Euro should be sold at the demand level.",
        answer: false,
        explain: "Selling at wholesale because the trend is down is a mistake. The fresh demand plus margin justified the long."
      },
      {
        type: "spot",
        q: "This is the US Dollar index. Click the base of its fresh supply.",
        scene: {
          candles: [
            { o: 124, h: 132.69, l: 123.88, c: 132.5 },
            { o: 132.5, h: 141.26, l: 132.47, c: 141 },
            { o: 141, h: 149.92, l: 140.9, c: 149.5 },
            { o: 149.5, h: 158.61, l: 149.45, c: 158 },
            { o: 158, h: 158.1, l: 157.07, c: 157.33 },
            { o: 157.33, h: 158.39, l: 157.14, c: 158.19 },
            { o: 158.19, h: 158.29, l: 152.76, c: 152.79 },
            { o: 152.79, h: 152.85, l: 146.93, c: 147.4 },
            { o: 147.4, h: 147.54, l: 141.85, c: 142 },
            { o: 142, h: 142.17, l: 137.52, c: 138.03 },
            { o: 138.03, h: 138.27, l: 134.63, c: 135.2 },
            { o: 135.2, h: 135.4, l: 130.67, c: 130.78 },
            { o: 130.78, h: 130.92, l: 127.79, c: 128 },
            { o: 128, h: 131.75, l: 127.78, c: 131.56 },
            { o: 131.56, h: 135.69, l: 131.44, c: 135.27 },
            { o: 135.27, h: 138.61, l: 135.15, c: 138.19 },
            { o: 138.19, h: 142.56, l: 137.99, c: 142.02 },
            { o: 142.02, h: 146.09, l: 141.84, c: 145.65 },
            { o: 145.65, h: 149.75, l: 145.61, c: 149.36 },
            { o: 149.36, h: 152.98, l: 149.13, c: 152.56 },
            { o: 152.56, h: 157, l: 152.48, c: 156.83 },
            { o: 156.83, h: 158.13, l: 156.73, c: 157.73 },
            { o: 157.73, h: 157.77, l: 155.05, c: 155.15 },
            { o: 155.15, h: 155.25, l: 152.28, c: 152.58 },
            { o: 152.58, h: 152.67, l: 149.81, c: 150 },
            { o: 150, h: 151.72, l: 149.88, c: 151.5 },
            { o: 151.5, h: 153.07, l: 151.35, c: 153 },
            { o: 153, h: 153.16, l: 149.73, c: 150 },
            { o: 150, h: 150.21, l: 146.59, c: 147 },
            { o: 147, h: 147.16, l: 143.86, c: 144 }
          ],
          reveal: 22
        },
        answer: {
          from: 4,
          to: 5
        },
        explain: "The base before the sharp drop. The Dollar rallied back into it while the Euro hit demand."
      },
      {
        type: "mcq",
        q: "Seiden's gas station example teaches what?",
        options: [
          "Buy gum",
          "Buy at wholesale, sell at retail",
          "Avoid small profits",
          "Trade only stocks"
        ],
        answer: 1,
        explain: "Buy for 25 cents, sell for a dollar. Traders must do the same."
      },
      {
        type: "tf",
        q: "Supply and demand change with new markets and new math.",
        answer: false,
        explain: "Gravity is always gravity. Adam Smith described it, and it has never changed."
      }
    ],
    practice: [
      {
        prompt: "The Euro has fallen for days into fresh daily demand, and the Dollar index is at fresh daily supply. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 176, h: 176.12, l: 167.31, c: 167.5 },
            { o: 167.5, h: 167.53, l: 158.74, c: 159 },
            { o: 159, h: 159.1, l: 150.08, c: 150.5 },
            { o: 150.5, h: 150.55, l: 141.39, c: 142 },
            { o: 142, h: 142.93, l: 141.9, c: 142.67 },
            { o: 142.67, h: 142.86, l: 141.61, c: 141.81 },
            { o: 141.81, h: 147.24, l: 141.71, c: 147.21 },
            { o: 147.21, h: 153.07, l: 147.15, c: 152.6 },
            { o: 152.6, h: 158.15, l: 152.46, c: 158 },
            { o: 158, h: 162.48, l: 157.83, c: 161.97 },
            { o: 161.97, h: 165.37, l: 161.73, c: 164.8 },
            { o: 164.8, h: 169.33, l: 164.6, c: 169.22 },
            { o: 169.22, h: 172.21, l: 169.08, c: 172 },
            { o: 172, h: 172.22, l: 168.25, c: 168.44 },
            { o: 168.44, h: 168.56, l: 164.31, c: 164.73 },
            { o: 164.73, h: 164.85, l: 161.39, c: 161.81 },
            { o: 161.81, h: 162.01, l: 157.44, c: 157.98 },
            { o: 157.98, h: 158.16, l: 153.91, c: 154.35 },
            { o: 154.35, h: 154.39, l: 150.25, c: 150.64 },
            { o: 150.64, h: 150.87, l: 147.02, c: 147.44 },
            { o: 147.44, h: 147.52, l: 143, c: 143.17 },
            { o: 143.17, h: 143.27, l: 141.87, c: 142.27 },
            { o: 142.27, h: 144.95, l: 142.23, c: 144.85 },
            { o: 144.85, h: 147.72, l: 144.75, c: 147.42 },
            { o: 147.42, h: 150.19, l: 147.33, c: 150 },
            { o: 150, h: 150.12, l: 148.28, c: 148.5 },
            { o: 148.5, h: 148.65, l: 146.93, c: 147 },
            { o: 147, h: 150.27, l: 146.84, c: 150 },
            { o: 150, h: 153.41, l: 149.79, c: 153 },
            { o: 153, h: 156.14, l: 152.84, c: 156 }
          ],
          zones: [
            {
              from: 4,
              top: 142.67,
              bottom: 141.61,
              kind: "demand",
              label: "Fresh demand (Euro)"
            }
          ],
          notes: [
            {
              x: 20,
              y: 154.67,
              text: "Dollar at fresh supply"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Fresh demand plus the mirror market at supply. Buy. The Euro turned up."
      },
      {
        prompt: "This is the Dollar index rallying back into its fresh supply at the same moment. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 124, h: 132.69, l: 123.88, c: 132.5 },
            { o: 132.5, h: 141.26, l: 132.47, c: 141 },
            { o: 141, h: 149.92, l: 140.9, c: 149.5 },
            { o: 149.5, h: 158.61, l: 149.45, c: 158 },
            { o: 158, h: 158.1, l: 157.07, c: 157.33 },
            { o: 157.33, h: 158.39, l: 157.14, c: 158.19 },
            { o: 158.19, h: 158.29, l: 152.76, c: 152.79 },
            { o: 152.79, h: 152.85, l: 146.93, c: 147.4 },
            { o: 147.4, h: 147.54, l: 141.85, c: 142 },
            { o: 142, h: 142.17, l: 137.52, c: 138.03 },
            { o: 138.03, h: 138.27, l: 134.63, c: 135.2 },
            { o: 135.2, h: 135.4, l: 130.67, c: 130.78 },
            { o: 130.78, h: 130.92, l: 127.79, c: 128 },
            { o: 128, h: 131.75, l: 127.78, c: 131.56 },
            { o: 131.56, h: 135.69, l: 131.44, c: 135.27 },
            { o: 135.27, h: 138.61, l: 135.15, c: 138.19 },
            { o: 138.19, h: 142.56, l: 137.99, c: 142.02 },
            { o: 142.02, h: 146.09, l: 141.84, c: 145.65 },
            { o: 145.65, h: 149.75, l: 145.61, c: 149.36 },
            { o: 149.36, h: 152.98, l: 149.13, c: 152.56 },
            { o: 152.56, h: 157, l: 152.48, c: 156.83 },
            { o: 156.83, h: 158.13, l: 156.73, c: 157.73 },
            { o: 157.73, h: 157.77, l: 155.05, c: 155.15 },
            { o: 155.15, h: 155.25, l: 152.28, c: 152.58 },
            { o: 152.58, h: 152.67, l: 149.81, c: 150 },
            { o: 150, h: 151.72, l: 149.88, c: 151.5 },
            { o: 151.5, h: 153.07, l: 151.35, c: 153 },
            { o: 153, h: 153.16, l: 149.73, c: 150 },
            { o: 150, h: 150.21, l: 146.59, c: 147 },
            { o: 147, h: 147.16, l: 143.86, c: 144 }
          ],
          zones: [
            {
              from: 4,
              top: 158.39,
              bottom: 157.33,
              kind: "supply",
              label: "Fresh supply (Dollar)"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "The other side of the seesaw: fresh supply on the Dollar. Price turned down."
      }
    ],
    cards: [
      {
        front: "Gas station lesson?",
        back: "Buy gum at $0.25, sell at $1.00: wholesale to retail."
      },
      {
        front: "Does supply and demand change?",
        back: "Never. Gravity is always gravity."
      },
      {
        front: "EUR at demand while USD index at...?",
        back: "Supply: a confirming mirror image."
      },
      {
        front: "Can one swing level give several trades?",
        back: "Yes, shorter-term trades off the same level."
      },
      {
        front: "Duck rule?",
        back: "If it looks, walks and quacks like a duck, it is a duck. Keep it simple."
      }
    ],
    mnemonic: "Seesaw check: Euro down, Dollar up, buy the bottom seat."
  },
  {
    mentor: "seiden",
    n: 388,
    eli5: {
      oneLiner: "Sell to the buyer who pays too much: supply, band pierce, downtrend, margin.",
      story: "The best salesmen make big money selling to people who do not know what things are really worth. Seiden's All Star does the same. In a downtrend, when price spikes back into strong supply and pokes outside the upper Bollinger Band, a novice is paying retail after a rally. Seiden sells to him, takes the first profit at the band's middle line and the second at the demand below.",
      analogy: "A tourist buying a souvenir at triple price at the airport: you are the shop, not the tourist."
    },
    bigIdeas: [
      "Short at key supply when price pierces the upper band, in a downtrend, with margin below.",
      "Stop just above supply. T1 = band midline, T2 = opposing demand.",
      "Mirror everything for longs."
    ],
    steps: [
      {
        title: "Context: a downtrend",
        narration: "Price is falling. In a downtrend we look to sell, so we look for supply.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          highlight: {
            from: 0,
            to: 4,
            label: "downtrend"
          },
          reveal: 8
        }
      },
      {
        title: "Key supply and the demand below",
        narration: "Price paused and dropped strongly: supply. Lower down, a base launched a strong spike up: demand. The space between them is the profit margin.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          zones: [
            {
              from: 8,
              top: 165.46,
              bottom: 164.32,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 15,
              top: 146.26,
              bottom: 144.56,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "The novice buys outside the band",
        narration: "The spike reaches supply and pierces the upper Bollinger Band. The buyer makes two mistakes: buying after a rally outside the upper band, and buying at retail prices. Sell short at supply, buy stop just above it.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          zones: [
            {
              from: 8,
              top: 165.46,
              bottom: 164.32,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 15,
              top: 146.26,
              bottom: 144.56,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 164.32,
              label: "Short",
              kind: "entry"
            },
            {
              y: 165.86,
              label: "Buy stop",
              kind: "sl"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 183.64,
              x2: 10,
              y2: 180.75,
              label: "upper band"
            },
            {
              x1: 10,
              y1: 180.75,
              x2: 11,
              y2: 178.98
            },
            {
              x1: 11,
              y1: 178.98,
              x2: 12,
              y2: 178.38
            },
            {
              x1: 12,
              y1: 178.38,
              x2: 13,
              y2: 177.1
            },
            {
              x1: 13,
              y1: 177.1,
              x2: 14,
              y2: 175.52
            },
            {
              x1: 14,
              y1: 175.52,
              x2: 15,
              y2: 173.18
            },
            {
              x1: 15,
              y1: 173.18,
              x2: 16,
              y2: 170.44
            },
            {
              x1: 16,
              y1: 170.44,
              x2: 17,
              y2: 167.21
            },
            {
              x1: 17,
              y1: 167.21,
              x2: 18,
              y2: 163.19
            },
            {
              x1: 18,
              y1: 163.19,
              x2: 19,
              y2: 162.27
            },
            {
              x1: 19,
              y1: 162.27,
              x2: 20,
              y2: 164.8
            },
            {
              x1: 20,
              y1: 164.8,
              x2: 21,
              y2: 166.44
            },
            {
              x1: 21,
              y1: 166.44,
              x2: 22,
              y2: 167.08
            },
            {
              x1: 22,
              y1: 167.08,
              x2: 23,
              y2: 167.06
            },
            {
              x1: 23,
              y1: 167.06,
              x2: 24,
              y2: 166.95
            },
            {
              x1: 24,
              y1: 166.95,
              x2: 25,
              y2: 166.91
            },
            {
              x1: 25,
              y1: 166.91,
              x2: 26,
              y2: 167.01
            },
            {
              x1: 26,
              y1: 167.01,
              x2: 27,
              y2: 167.52
            }
          ],
          highlight: {
            from: 20,
            to: 20,
            label: "pierce"
          },
          reveal: 21
        }
      },
      {
        title: "T1 the midline, T2 the demand",
        narration: "First target is the band midline, the mean that price tends to return to. Second target is the opposing demand level.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          zones: [
            {
              from: 8,
              top: 165.46,
              bottom: 164.32,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 15,
              top: 146.26,
              bottom: 144.56,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 164.32,
              label: "Short",
              kind: "entry"
            },
            {
              y: 165.86,
              label: "Buy stop",
              kind: "sl"
            },
            {
              y: 150.26,
              label: "T1: midline",
              kind: "tp"
            },
            {
              y: 146.66,
              label: "T2: demand",
              kind: "tp"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 183.64,
              x2: 10,
              y2: 180.75,
              label: "upper band"
            },
            {
              x1: 10,
              y1: 180.75,
              x2: 11,
              y2: 178.98
            },
            {
              x1: 11,
              y1: 178.98,
              x2: 12,
              y2: 178.38
            },
            {
              x1: 12,
              y1: 178.38,
              x2: 13,
              y2: 177.1
            },
            {
              x1: 13,
              y1: 177.1,
              x2: 14,
              y2: 175.52
            },
            {
              x1: 14,
              y1: 175.52,
              x2: 15,
              y2: 173.18
            },
            {
              x1: 15,
              y1: 173.18,
              x2: 16,
              y2: 170.44
            },
            {
              x1: 16,
              y1: 170.44,
              x2: 17,
              y2: 167.21
            },
            {
              x1: 17,
              y1: 167.21,
              x2: 18,
              y2: 163.19
            },
            {
              x1: 18,
              y1: 163.19,
              x2: 19,
              y2: 162.27
            },
            {
              x1: 19,
              y1: 162.27,
              x2: 20,
              y2: 164.8
            },
            {
              x1: 20,
              y1: 164.8,
              x2: 21,
              y2: 166.44
            },
            {
              x1: 21,
              y1: 166.44,
              x2: 22,
              y2: 167.08
            },
            {
              x1: 22,
              y1: 167.08,
              x2: 23,
              y2: 167.06
            },
            {
              x1: 23,
              y1: 167.06,
              x2: 24,
              y2: 166.95
            },
            {
              x1: 24,
              y1: 166.95,
              x2: 25,
              y2: 166.91
            },
            {
              x1: 25,
              y1: 166.91,
              x2: 26,
              y2: 167.01
            },
            {
              x1: 26,
              y1: 167.01,
              x2: 27,
              y2: 167.52
            },
            {
              x1: 9,
              y1: 171.18,
              x2: 10,
              y2: 168.86,
              label: "band midline"
            },
            {
              x1: 10,
              y1: 168.86,
              x2: 11,
              y2: 166.18
            },
            {
              x1: 11,
              y1: 166.18,
              x2: 12,
              y2: 163.2
            },
            {
              x1: 12,
              y1: 163.2,
              x2: 13,
              y2: 160.49
            },
            {
              x1: 13,
              y1: 160.49,
              x2: 14,
              y2: 158.05
            },
            {
              x1: 14,
              y1: 158.05,
              x2: 15,
              y2: 155.8
            },
            {
              x1: 15,
              y1: 155.8,
              x2: 16,
              y2: 153.64
            },
            {
              x1: 16,
              y1: 153.64,
              x2: 17,
              y2: 151.77
            },
            {
              x1: 17,
              y1: 151.77,
              x2: 18,
              y2: 149.86
            },
            {
              x1: 18,
              y1: 149.86,
              x2: 19,
              y2: 149.7
            },
            {
              x1: 19,
              y1: 149.7,
              x2: 20,
              y2: 150.26
            },
            {
              x1: 20,
              y1: 150.26,
              x2: 21,
              y2: 150.91
            },
            {
              x1: 21,
              y1: 150.91,
              x2: 22,
              y2: 151.65
            },
            {
              x1: 22,
              y1: 151.65,
              x2: 23,
              y2: 151.95
            },
            {
              x1: 23,
              y1: 151.95,
              x2: 24,
              y2: 152.2
            },
            {
              x1: 24,
              y1: 152.2,
              x2: 25,
              y2: 152.27
            },
            {
              x1: 25,
              y1: 152.27,
              x2: 26,
              y2: 152.18
            },
            {
              x1: 26,
              y1: 152.18,
              x2: 27,
              y2: 151.71
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Both targets",
        narration: "Price falls to the midline, then to the demand, and keeps going. Profits come from selling to buyers who do not know real value.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          zones: [
            {
              from: 8,
              top: 165.46,
              bottom: 164.32,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 15,
              top: 146.26,
              bottom: 144.56,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 164.32,
              label: "Short",
              kind: "entry"
            },
            {
              y: 165.86,
              label: "Buy stop",
              kind: "sl"
            },
            {
              y: 150.26,
              label: "T1: midline",
              kind: "tp"
            },
            {
              y: 146.66,
              label: "T2: demand",
              kind: "tp"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 183.64,
              x2: 10,
              y2: 180.75,
              label: "upper band"
            },
            {
              x1: 10,
              y1: 180.75,
              x2: 11,
              y2: 178.98
            },
            {
              x1: 11,
              y1: 178.98,
              x2: 12,
              y2: 178.38
            },
            {
              x1: 12,
              y1: 178.38,
              x2: 13,
              y2: 177.1
            },
            {
              x1: 13,
              y1: 177.1,
              x2: 14,
              y2: 175.52
            },
            {
              x1: 14,
              y1: 175.52,
              x2: 15,
              y2: 173.18
            },
            {
              x1: 15,
              y1: 173.18,
              x2: 16,
              y2: 170.44
            },
            {
              x1: 16,
              y1: 170.44,
              x2: 17,
              y2: 167.21
            },
            {
              x1: 17,
              y1: 167.21,
              x2: 18,
              y2: 163.19
            },
            {
              x1: 18,
              y1: 163.19,
              x2: 19,
              y2: 162.27
            },
            {
              x1: 19,
              y1: 162.27,
              x2: 20,
              y2: 164.8
            },
            {
              x1: 20,
              y1: 164.8,
              x2: 21,
              y2: 166.44
            },
            {
              x1: 21,
              y1: 166.44,
              x2: 22,
              y2: 167.08
            },
            {
              x1: 22,
              y1: 167.08,
              x2: 23,
              y2: 167.06
            },
            {
              x1: 23,
              y1: 167.06,
              x2: 24,
              y2: 166.95
            },
            {
              x1: 24,
              y1: 166.95,
              x2: 25,
              y2: 166.91
            },
            {
              x1: 25,
              y1: 166.91,
              x2: 26,
              y2: 167.01
            },
            {
              x1: 26,
              y1: 167.01,
              x2: 27,
              y2: 167.52
            },
            {
              x1: 9,
              y1: 171.18,
              x2: 10,
              y2: 168.86,
              label: "band midline"
            },
            {
              x1: 10,
              y1: 168.86,
              x2: 11,
              y2: 166.18
            },
            {
              x1: 11,
              y1: 166.18,
              x2: 12,
              y2: 163.2
            },
            {
              x1: 12,
              y1: 163.2,
              x2: 13,
              y2: 160.49
            },
            {
              x1: 13,
              y1: 160.49,
              x2: 14,
              y2: 158.05
            },
            {
              x1: 14,
              y1: 158.05,
              x2: 15,
              y2: 155.8
            },
            {
              x1: 15,
              y1: 155.8,
              x2: 16,
              y2: 153.64
            },
            {
              x1: 16,
              y1: 153.64,
              x2: 17,
              y2: 151.77
            },
            {
              x1: 17,
              y1: 151.77,
              x2: 18,
              y2: 149.86
            },
            {
              x1: 18,
              y1: 149.86,
              x2: 19,
              y2: 149.7
            },
            {
              x1: 19,
              y1: 149.7,
              x2: 20,
              y2: 150.26
            },
            {
              x1: 20,
              y1: 150.26,
              x2: 21,
              y2: 150.91
            },
            {
              x1: 21,
              y1: 150.91,
              x2: 22,
              y2: 151.65
            },
            {
              x1: 22,
              y1: 151.65,
              x2: 23,
              y2: 151.95
            },
            {
              x1: 23,
              y1: 151.95,
              x2: 24,
              y2: 152.2
            },
            {
              x1: 24,
              y1: 152.2,
              x2: 25,
              y2: 152.27
            },
            {
              x1: 25,
              y1: 152.27,
              x2: 26,
              y2: 152.18
            },
            {
              x1: 26,
              y1: 152.18,
              x2: 27,
              y2: 151.71
            }
          ],
          highlight: {
            from: 21,
            to: 27,
            label: "fall"
          }
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order the All Star short checklist.",
        items: [
          "Downtrend context",
          "Key supply with a strong drop",
          "Profit margin down to demand",
          "Price returns and pierces the upper band",
          "Short with stop above supply; T1 midline, T2 demand"
        ],
        explain: "All the pieces must be there before the sell."
      },
      {
        type: "mcq",
        q: "Where is T1 in the All Star?",
        options: [
          "The upper band",
          "The band midline",
          "The demand level",
          "Twice the risk"
        ],
        answer: 1,
        explain: "T1 is the Bollinger midline (the mean). T2 is the opposing demand."
      },
      {
        type: "spot",
        q: "Click the candle where the novice buyer makes both mistakes.",
        scene: {
          candles: [
            { o: 186, h: 186.21, l: 182.31, c: 182.39 },
            { o: 182.39, h: 182.43, l: 179.71, c: 179.86 },
            { o: 179.86, h: 180.08, l: 176.27, c: 176.8 },
            { o: 176.8, h: 176.97, l: 172.79, c: 173.26 },
            { o: 173.26, h: 173.46, l: 169.91, c: 170 },
            { o: 170, h: 170.04, l: 168.18, c: 168.33 },
            { o: 168.33, h: 168.43, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.75, l: 164.84, c: 165 },
            { o: 165, h: 165.43, l: 164.07, c: 164.32 },
            { o: 164.32, h: 165.46, l: 163.92, c: 165.19 },
            { o: 165.19, h: 165.3, l: 158.87, c: 159.13 },
            { o: 159.13, h: 159.17, l: 152.56, c: 153.06 },
            { o: 153.06, h: 153.26, l: 146.48, c: 147 },
            { o: 147, h: 147.06, l: 146.06, c: 146.25 },
            { o: 146.25, h: 146.33, l: 145.41, c: 145.5 },
            { o: 145.5, h: 146.31, l: 145.34, c: 145.92 },
            { o: 145.92, h: 146.06, l: 144.65, c: 145.03 },
            { o: 145.03, h: 146.5, l: 144.56, c: 146.26 },
            { o: 146.26, h: 146.69, l: 145.01, c: 145.31 },
            { o: 145.31, h: 163.75, l: 145.25, c: 163.52 },
            { o: 163.52, h: 165.41, l: 163.42, c: 164.72 },
            { o: 164.72, h: 164.96, l: 159.15, c: 159.57 },
            { o: 159.57, h: 159.65, l: 154.33, c: 154.41 },
            { o: 154.41, h: 154.56, l: 148.64, c: 149.26 },
            { o: 149.26, h: 149.39, l: 147.93, c: 147.96 },
            { o: 147.96, h: 148.04, l: 146.52, c: 146.66 },
            { o: 146.66, h: 146.78, l: 143.95, c: 144.11 },
            { o: 144.11, h: 144.27, l: 141.4, c: 141.56 }
          ],
          zones: [
            {
              from: 8,
              top: 165.46,
              bottom: 164.32,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 15,
              top: 146.26,
              bottom: 144.56,
              kind: "demand",
              label: "Demand"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 183.64,
              x2: 10,
              y2: 180.75,
              label: "upper band"
            },
            {
              x1: 10,
              y1: 180.75,
              x2: 11,
              y2: 178.98
            },
            {
              x1: 11,
              y1: 178.98,
              x2: 12,
              y2: 178.38
            },
            {
              x1: 12,
              y1: 178.38,
              x2: 13,
              y2: 177.1
            },
            {
              x1: 13,
              y1: 177.1,
              x2: 14,
              y2: 175.52
            },
            {
              x1: 14,
              y1: 175.52,
              x2: 15,
              y2: 173.18
            },
            {
              x1: 15,
              y1: 173.18,
              x2: 16,
              y2: 170.44
            },
            {
              x1: 16,
              y1: 170.44,
              x2: 17,
              y2: 167.21
            },
            {
              x1: 17,
              y1: 167.21,
              x2: 18,
              y2: 163.19
            },
            {
              x1: 18,
              y1: 163.19,
              x2: 19,
              y2: 162.27
            },
            {
              x1: 19,
              y1: 162.27,
              x2: 20,
              y2: 164.8
            },
            {
              x1: 20,
              y1: 164.8,
              x2: 21,
              y2: 166.44
            },
            {
              x1: 21,
              y1: 166.44,
              x2: 22,
              y2: 167.08
            },
            {
              x1: 22,
              y1: 167.08,
              x2: 23,
              y2: 167.06
            },
            {
              x1: 23,
              y1: 167.06,
              x2: 24,
              y2: 166.95
            },
            {
              x1: 24,
              y1: 166.95,
              x2: 25,
              y2: 166.91
            },
            {
              x1: 25,
              y1: 166.91,
              x2: 26,
              y2: 167.01
            },
            {
              x1: 26,
              y1: 167.01,
              x2: 27,
              y2: 167.52
            }
          ],
          reveal: 21
        },
        answer: {
          from: 20,
          to: 20
        },
        explain: "The spike candle into supply, outside the upper band: buying after a rally outside the band, and at retail."
      },
      {
        type: "tf",
        q: "The All Star short rules require a downtrend context.",
        answer: true,
        explain: "At key supply, piercing the upper band, in the context of a downtrend, with significant profit margin."
      },
      {
        type: "mcq",
        q: "Which setup is NOT an All Star short?",
        options: [
          "Downtrend, supply, band pierce, big margin",
          "Downtrend, supply, band pierce, demand just below",
          "Downtrend, strong supply, band pierce, demand far below",
          "All of these are"
        ],
        answer: 1,
        explain: "Without profit margin to the opposing level, the setup fails the rules."
      }
    ],
    practice: [
      {
        prompt: "Uptrend. Price has dropped into strong demand and pierces the lower band, with supply far above. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 114, h: 117.69, l: 113.79, c: 117.61 },
            { o: 117.61, h: 120.29, l: 117.57, c: 120.14 },
            { o: 120.14, h: 123.73, l: 119.92, c: 123.2 },
            { o: 123.2, h: 127.21, l: 123.03, c: 126.74 },
            { o: 126.74, h: 130.09, l: 126.54, c: 130 },
            { o: 130, h: 131.82, l: 129.96, c: 131.67 },
            { o: 131.67, h: 133.68, l: 131.57, c: 133.33 },
            { o: 133.33, h: 135.16, l: 133.25, c: 135 },
            { o: 135, h: 135.93, l: 134.57, c: 135.68 },
            { o: 135.68, h: 136.08, l: 134.54, c: 134.81 },
            { o: 134.81, h: 141.13, l: 134.7, c: 140.87 },
            { o: 140.87, h: 147.44, l: 140.83, c: 146.94 },
            { o: 146.94, h: 153.52, l: 146.74, c: 153 },
            { o: 153, h: 153.94, l: 152.94, c: 153.75 },
            { o: 153.75, h: 154.59, l: 153.67, c: 154.5 },
            { o: 154.5, h: 154.66, l: 153.69, c: 154.08 },
            { o: 154.08, h: 155.35, l: 153.94, c: 154.97 },
            { o: 154.97, h: 155.44, l: 153.5, c: 153.74 },
            { o: 153.74, h: 154.99, l: 153.31, c: 154.69 },
            { o: 154.69, h: 154.75, l: 136.25, c: 136.48 },
            { o: 136.48, h: 136.58, l: 134.59, c: 135.28 },
            { o: 135.28, h: 140.85, l: 135.04, c: 140.43 },
            { o: 140.43, h: 145.67, l: 140.35, c: 145.59 },
            { o: 145.59, h: 151.36, l: 145.44, c: 150.74 },
            { o: 150.74, h: 152.07, l: 150.61, c: 152.04 },
            { o: 152.04, h: 153.48, l: 151.96, c: 153.34 },
            { o: 153.34, h: 156.05, l: 153.22, c: 155.89 },
            { o: 155.89, h: 158.6, l: 155.73, c: 158.44 }
          ],
          zones: [
            {
              from: 8,
              top: 135.68,
              bottom: 134.54,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 15,
              top: 155.44,
              bottom: 153.74,
              kind: "supply",
              label: "Supply"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 116.36,
              x2: 10,
              y2: 119.25,
              label: "lower band"
            },
            {
              x1: 10,
              y1: 119.25,
              x2: 11,
              y2: 121.02
            },
            {
              x1: 11,
              y1: 121.02,
              x2: 12,
              y2: 121.62
            },
            {
              x1: 12,
              y1: 121.62,
              x2: 13,
              y2: 122.9
            },
            {
              x1: 13,
              y1: 122.9,
              x2: 14,
              y2: 124.48
            },
            {
              x1: 14,
              y1: 124.48,
              x2: 15,
              y2: 126.82
            },
            {
              x1: 15,
              y1: 126.82,
              x2: 16,
              y2: 129.56
            },
            {
              x1: 16,
              y1: 129.56,
              x2: 17,
              y2: 132.79
            },
            {
              x1: 17,
              y1: 132.79,
              x2: 18,
              y2: 136.81
            },
            {
              x1: 18,
              y1: 136.81,
              x2: 19,
              y2: 137.73
            },
            {
              x1: 19,
              y1: 137.73,
              x2: 20,
              y2: 135.2
            }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The mirror All Star: demand, lower band pierced, uptrend, big margin. Buy with T1 at the midline and T2 at supply. Price ran to both."
      },
      {
        prompt: "Strong UPTREND. Price rallies straight back into a supply level. Is this an All Star short?",
        scene: {
          candles: [
            { o: 120, h: 124.75, l: 119.82, c: 124.71 },
            { o: 124.71, h: 130.06, l: 124.56, c: 129.88 },
            { o: 129.88, h: 136.26, l: 129.68, c: 135.66 },
            { o: 135.66, h: 140.38, l: 135.54, c: 140.15 },
            { o: 140.15, h: 145.95, l: 139.9, c: 145.63 },
            { o: 145.63, h: 150.3, l: 145.52, c: 150 },
            { o: 150, h: 154.1, l: 149.85, c: 154 },
            { o: 154, h: 158.05, l: 153.74, c: 158 },
            { o: 158, h: 159.09, l: 157.67, c: 158.63 },
            { o: 158.63, h: 158.86, l: 157.47, c: 157.81 },
            { o: 157.81, h: 157.9, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.02, l: 149.66, c: 150 },
            { o: 150, h: 150.82, l: 149.7, c: 150.54 },
            { o: 150.54, h: 151.01, l: 149.26, c: 149.56 },
            { o: 149.56, h: 150.3, l: 149.27, c: 150.19 },
            { o: 150.19, h: 157.21, l: 150.06, c: 157.01 },
            { o: 157.01, h: 158.61, l: 156.91, c: 158.21 },
            { o: 158.21, h: 160.42, l: 158.05, c: 160.18 },
            { o: 160.18, h: 162.33, l: 160.1, c: 162.15 },
            { o: 162.15, h: 164.33, l: 162.11, c: 164.12 },
            { o: 164.12, h: 166.13, l: 164, c: 166.09 }
          ],
          zones: [
            {
              from: 8,
              top: 159.09,
              bottom: 157.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 168.89,
              x2: 10,
              y2: 167.66,
              label: "upper band"
            },
            {
              x1: 10,
              y1: 167.66,
              x2: 11,
              y2: 165.22
            },
            {
              x1: 11,
              y1: 165.22,
              x2: 12,
              y2: 163.04
            },
            {
              x1: 12,
              y1: 163.04,
              x2: 13,
              y2: 161.09
            },
            {
              x1: 13,
              y1: 161.09,
              x2: 14,
              y2: 160.33
            },
            {
              x1: 14,
              y1: 160.33,
              x2: 15,
              y2: 160.98
            },
            {
              x1: 15,
              y1: 160.98,
              x2: 16,
              y2: 161.85
            }
          ],
          highlight: {
            from: 0,
            to: 5,
            label: "uptrend"
          },
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The trend context is up and price did not even pierce the upper band, so the All Star short rules are not met. Price pushed through the supply."
      }
    ],
    cards: [
      {
        front: "All Star short: four conditions?",
        back: "Key supply, upper band pierce, downtrend context, profit margin below."
      },
      {
        front: "All Star stop?",
        back: "A buy stop just above the supply."
      },
      {
        front: "T1 and T2?",
        back: "T1 = band midline; T2 = opposing demand."
      },
      {
        front: "Two novice mistakes at the spike?",
        back: "Buying after a rally outside the upper band, and buying at retail."
      },
      {
        front: "All Star long?",
        back: "Mirror: demand, lower band pierce, uptrend, margin above."
      }
    ],
    mnemonic: "Trend, Level, Poke, Room; then Mid, then Level."
  },
  {
    mentor: "seiden",
    n: 391,
    eli5: {
      oneLiner: "The quiet two-candle level beats the big busy one.",
      story: "Two doors: one is a giant, colorful door that everybody notices, and one is a tiny plain door. Behind the giant door people have been coming and going all day, so it barely holds. Behind the tiny door, nobody has been in, and it is locked tight. On the chart, the long sideways base got broken, while the little two-candle level held and sent price down.",
      analogy: "A trail that hundreds of hikers walked is worn flat; the untouched path still has its fence."
    },
    bigIdeas: [
      "The more out of balance, the quicker and stronger the turn.",
      "Ignore levels where price spent a lot of time.",
      "Favour small, few-candle levels and trade the first retrace."
    ],
    steps: [
      {
        title: "Supply 1: hardly noticeable",
        narration: "At the top, only two candles before price fell. Most traders do not even notice it.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            }
          ],
          highlight: {
            from: 3,
            to: 4,
            label: "2 candles"
          },
          reveal: 8
        }
      },
      {
        title: "Supply 2: the textbook favourite",
        narration: "Lower down, price spent a long time going sideways, then fell sharply. Conventional TA loves this big obvious zone. XLT ignores it: too much time was spent there.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base",
              to: 34
            }
          ],
          highlight: {
            from: 8,
            to: 21,
            label: "many candles"
          },
          reveal: 26
        }
      },
      {
        title: "The busy level breaks",
        narration: "Price rallies back, chops sideways at Supply 2 and breaks up through it. Many candles meant balance, not a big imbalance.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base",
              to: 34
            }
          ],
          highlight: {
            from: 30,
            to: 36,
            label: "chop and break"
          },
          reveal: 37
        }
      },
      {
        title: "The quiet level holds",
        narration: "Price spikes into Supply 1. Little time there means a big imbalance. Short the first retrace, stop just above.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base",
              to: 34
            }
          ],
          lines: [
            {
              y: 161.36,
              label: "Short",
              kind: "entry"
            },
            {
              y: 162.87,
              label: "Stop",
              kind: "sl"
            }
          ],
          reveal: 40
        }
      },
      {
        title: "Simple logic, truth",
        narration: "Price drops hard. The buyer probably followed the books that dismiss low-activity levels.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base",
              to: 34
            }
          ],
          lines: [
            {
              y: 161.36,
              label: "Short",
              kind: "entry"
            },
            {
              y: 162.87,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 40,
            to: 43,
            label: "drop"
          }
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the level XLT would IGNORE because too much time was spent there.",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          reveal: 26
        },
        answer: {
          from: 8,
          to: 21
        },
        explain: "The long sideways base. Many candles mean balance, and on the return it broke."
      },
      {
        type: "tf",
        q: "A barely noticeable two-candle level is too small to matter.",
        answer: false,
        explain: "Lack of activity is what makes it strong. Supply 1 held and price dropped hard."
      },
      {
        type: "mcq",
        q: "Why did Supply 2 break on the return?",
        options: [
          "Bad luck",
          "Too much time was spent there: it was balance, not a big imbalance",
          "It was too fresh",
          "The news changed"
        ],
        answer: 1,
        explain: "Many candles at a level mean many trades on both sides, so there was little imbalance left."
      },
      {
        type: "order",
        q: "Order what happened on the chart.",
        items: [
          "Two-candle Supply 1 forms",
          "Long sideways Supply 2 forms",
          "Price chops and breaks through Supply 2",
          "Price spikes into Supply 1",
          "Price drops hard"
        ],
        explain: "The quiet level held; the busy one failed."
      },
      {
        type: "tf",
        q: "Time at a level is one of several odds enhancers for level quality.",
        answer: true,
        explain: "Time is one of them, along with how price left and how far it went."
      }
    ],
    practice: [
      {
        prompt: "Price is back at the long, busy Supply 2. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base"
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Too much time was spent at Supply 2, so XLT ignores it. Price chopped and broke up through it."
      },
      {
        prompt: "Price has broken Supply 2 and spiked into the two-candle Supply 1. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 154.17, l: 149.97, c: 154 },
            { o: 154, h: 158.25, l: 153.9, c: 158 },
            { o: 158, h: 162.29, l: 157.74, c: 162 },
            { o: 162, h: 162.44, l: 161, c: 161.36 },
            { o: 161.36, h: 162.47, l: 161.13, c: 162.19 },
            { o: 162.19, h: 162.4, l: 157.51, c: 158.13 },
            { o: 158.13, h: 158.29, l: 153.93, c: 154.06 },
            { o: 154.06, h: 154.23, l: 149.62, c: 150 },
            { o: 150, h: 150.4, l: 148.72, c: 148.98 },
            { o: 148.98, h: 150.9, l: 148.88, c: 150.64 },
            { o: 150.64, h: 150.85, l: 148.93, c: 149.06 },
            { o: 149.06, h: 151.24, l: 148.77, c: 150.86 },
            { o: 150.86, h: 150.99, l: 148.57, c: 149.05 },
            { o: 149.05, h: 150.97, l: 148.71, c: 150.68 },
            { o: 150.68, h: 151.03, l: 149.18, c: 149.34 },
            { o: 149.34, h: 151.22, l: 149, c: 150.83 },
            { o: 150.83, h: 151.41, l: 148.82, c: 148.96 },
            { o: 148.96, h: 151.34, l: 148.84, c: 150.84 },
            { o: 150.84, h: 151.37, l: 149.03, c: 149.4 },
            { o: 149.4, h: 151.13, l: 149.18, c: 150.71 },
            { o: 150.71, h: 150.8, l: 148.59, c: 149.15 },
            { o: 149.15, h: 150.68, l: 148.88, c: 150.26 },
            { o: 150.26, h: 150.42, l: 146.61, c: 146.95 },
            { o: 146.95, h: 147.16, l: 143.34, c: 143.63 },
            { o: 143.63, h: 143.83, l: 140.15, c: 140.32 },
            { o: 140.32, h: 140.36, l: 136.53, c: 137 },
            { o: 137, h: 140.14, l: 136.84, c: 139.92 },
            { o: 139.92, h: 143.26, l: 139.75, c: 142.83 },
            { o: 142.83, h: 145.93, l: 142.65, c: 145.75 },
            { o: 145.75, h: 148.82, l: 145.62, c: 148.66 },
            { o: 148.66, h: 149.51, l: 148.42, c: 149.07 },
            { o: 149.07, h: 149.34, l: 147.94, c: 148.18 },
            { o: 148.18, h: 149.81, l: 148.07, c: 149.45 },
            { o: 149.45, h: 149.92, l: 148.21, c: 148.47 },
            { o: 148.47, h: 150.55, l: 148.37, c: 150.45 },
            { o: 150.45, h: 152.52, l: 150.32, c: 152.43 },
            { o: 152.43, h: 154.69, l: 152.27, c: 154.41 },
            { o: 154.41, h: 157.84, l: 154.26, c: 157.69 },
            { o: 157.69, h: 161.3, l: 157.54, c: 160.96 },
            { o: 160.96, h: 162.16, l: 160.86, c: 161.76 },
            { o: 161.76, h: 161.83, l: 158.65, c: 158.82 },
            { o: 158.82, h: 158.97, l: 155.38, c: 155.88 },
            { o: 155.88, h: 155.93, l: 152.61, c: 152.94 },
            { o: 152.94, h: 153.14, l: 149.75, c: 150 }
          ],
          zones: [
            {
              from: 3,
              top: 162.47,
              bottom: 161.36,
              kind: "supply",
              label: "Supply 1: two candles"
            },
            {
              from: 8,
              top: 151.41,
              bottom: 148.96,
              kind: "supply",
              label: "Supply 2: long base",
              to: 34
            }
          ],
          reveal: 40
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Little time at the level = big imbalance. Short the first retrace. Price dropped hard."
      }
    ],
    cards: [
      {
        front: "Big imbalance means activity is?",
        back: "Low: few candles, usually low volume."
      },
      {
        front: "Long many-candle base?",
        back: "Ignore it: balance, likely to break."
      },
      {
        front: "Few-candle level?",
        back: "Favour it; trade the first retrace."
      },
      {
        front: "What decides how quick the turn is?",
        back: "How out of balance supply and demand are."
      }
    ],
    mnemonic: "Tiny door, tight lock."
  },
  {
    mentor: "seiden",
    n: 394,
    eli5: {
      oneLiner: "Moving averages lag; the demand level is the real information.",
      story: "Imagine steering a car by looking in the rear-view mirror. You would always turn too late. A moving average is that mirror: it only shows where price has been. At the best buy of all, the first return to a base that launched a rally, the moving average still pointed down. People who trust it skip the buy and pay higher later.",
      analogy: "Hearing thunder after the lightning: by the time the indicator speaks, the event already happened."
    },
    bigIdeas: [
      "Do not use moving averages as support, resistance or trend filters for entries.",
      "Buy the first return (B) to a base that launched a dramatic rally (A).",
      "Strong news into a fresh level often marks an exhaustion turn."
    ],
    steps: [
      {
        title: "A: base plus dramatic rally",
        narration: "Price went sideways for three candles and then rallied dramatically. That is demand, the objective information on the chart.",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          highlight: {
            from: 4,
            to: 6,
            label: "A"
          },
          reveal: 11
        }
      },
      {
        title: "The moving average turns down",
        narration: "Price pulls back. The moving average now slopes down, so MA traders call it a downtrend and will not buy.",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 147.21,
              x2: 10,
              y2: 149.22,
              label: "moving average"
            },
            {
              x1: 10,
              y1: 149.22,
              x2: 11,
              y2: 151.53
            },
            {
              x1: 11,
              y1: 151.53,
              x2: 12,
              y2: 154.17
            },
            {
              x1: 12,
              y1: 154.17,
              x2: 13,
              y2: 157.17
            },
            {
              x1: 13,
              y1: 157.17,
              x2: 14,
              y2: 159.73
            },
            {
              x1: 14,
              y1: 159.73,
              x2: 15,
              y2: 162.05
            },
            {
              x1: 15,
              y1: 162.05,
              x2: 16,
              y2: 164.03
            },
            {
              x1: 16,
              y1: 164.03,
              x2: 17,
              y2: 164.98
            },
            {
              x1: 17,
              y1: 164.98,
              x2: 18,
              y2: 164.87
            },
            {
              x1: 18,
              y1: 164.87,
              x2: 19,
              y2: 163.81
            },
            {
              x1: 19,
              y1: 163.81,
              x2: 20,
              y2: 161.73
            },
            {
              x1: 20,
              y1: 161.73,
              x2: 21,
              y2: 159.1
            },
            {
              x1: 21,
              y1: 159.1,
              x2: 22,
              y2: 156.28
            },
            {
              x1: 22,
              y1: 156.28,
              x2: 23,
              y2: 153.84
            },
            {
              x1: 23,
              y1: 153.84,
              x2: 24,
              y2: 152.3
            },
            {
              x1: 24,
              y1: 152.3,
              x2: 25,
              y2: 151.65
            },
            {
              x1: 25,
              y1: 151.65,
              x2: 26,
              y2: 151.81
            },
            {
              x1: 26,
              y1: 151.81,
              x2: 27,
              y2: 152.86
            },
            {
              x1: 27,
              y1: 152.86,
              x2: 28,
              y2: 154.86
            }
          ],
          highlight: {
            from: 14,
            to: 19,
            label: "MA says downtrend"
          },
          reveal: 20
        }
      },
      {
        title: "B: the first return",
        narration: "Price returns to A for the first time. This is the low-risk buy: small stop, maximum profit potential and the highest probability. The MA says no at exactly the best buy.",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          lines: [
            {
              y: 142.75,
              label: "Buy at B",
              kind: "entry"
            },
            {
              y: 140.46,
              label: "Stop",
              kind: "sl"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 147.21,
              x2: 10,
              y2: 149.22,
              label: "moving average"
            },
            {
              x1: 10,
              y1: 149.22,
              x2: 11,
              y2: 151.53
            },
            {
              x1: 11,
              y1: 151.53,
              x2: 12,
              y2: 154.17
            },
            {
              x1: 12,
              y1: 154.17,
              x2: 13,
              y2: 157.17
            },
            {
              x1: 13,
              y1: 157.17,
              x2: 14,
              y2: 159.73
            },
            {
              x1: 14,
              y1: 159.73,
              x2: 15,
              y2: 162.05
            },
            {
              x1: 15,
              y1: 162.05,
              x2: 16,
              y2: 164.03
            },
            {
              x1: 16,
              y1: 164.03,
              x2: 17,
              y2: 164.98
            },
            {
              x1: 17,
              y1: 164.98,
              x2: 18,
              y2: 164.87
            },
            {
              x1: 18,
              y1: 164.87,
              x2: 19,
              y2: 163.81
            },
            {
              x1: 19,
              y1: 163.81,
              x2: 20,
              y2: 161.73
            },
            {
              x1: 20,
              y1: 161.73,
              x2: 21,
              y2: 159.1
            },
            {
              x1: 21,
              y1: 159.1,
              x2: 22,
              y2: 156.28
            },
            {
              x1: 22,
              y1: 156.28,
              x2: 23,
              y2: 153.84
            },
            {
              x1: 23,
              y1: 153.84,
              x2: 24,
              y2: 152.3
            },
            {
              x1: 24,
              y1: 152.3,
              x2: 25,
              y2: 151.65
            },
            {
              x1: 25,
              y1: 151.65,
              x2: 26,
              y2: 151.81
            },
            {
              x1: 26,
              y1: 151.81,
              x2: 27,
              y2: 152.86
            },
            {
              x1: 27,
              y1: 152.86,
              x2: 28,
              y2: 154.86
            }
          ],
          reveal: 23
        }
      },
      {
        title: "MAs lag price",
        narration: "Price rallies strongly. Those who wait for the MA to turn up again buy higher, with more risk and less profit, and they pay those who bought at B.",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          lines: [
            {
              y: 142.75,
              label: "Buy at B",
              kind: "entry"
            },
            {
              y: 140.46,
              label: "Stop",
              kind: "sl"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 147.21,
              x2: 10,
              y2: 149.22,
              label: "moving average"
            },
            {
              x1: 10,
              y1: 149.22,
              x2: 11,
              y2: 151.53
            },
            {
              x1: 11,
              y1: 151.53,
              x2: 12,
              y2: 154.17
            },
            {
              x1: 12,
              y1: 154.17,
              x2: 13,
              y2: 157.17
            },
            {
              x1: 13,
              y1: 157.17,
              x2: 14,
              y2: 159.73
            },
            {
              x1: 14,
              y1: 159.73,
              x2: 15,
              y2: 162.05
            },
            {
              x1: 15,
              y1: 162.05,
              x2: 16,
              y2: 164.03
            },
            {
              x1: 16,
              y1: 164.03,
              x2: 17,
              y2: 164.98
            },
            {
              x1: 17,
              y1: 164.98,
              x2: 18,
              y2: 164.87
            },
            {
              x1: 18,
              y1: 164.87,
              x2: 19,
              y2: 163.81
            },
            {
              x1: 19,
              y1: 163.81,
              x2: 20,
              y2: 161.73
            },
            {
              x1: 20,
              y1: 161.73,
              x2: 21,
              y2: 159.1
            },
            {
              x1: 21,
              y1: 159.1,
              x2: 22,
              y2: 156.28
            },
            {
              x1: 22,
              y1: 156.28,
              x2: 23,
              y2: 153.84
            },
            {
              x1: 23,
              y1: 153.84,
              x2: 24,
              y2: 152.3
            },
            {
              x1: 24,
              y1: 152.3,
              x2: 25,
              y2: 151.65
            },
            {
              x1: 25,
              y1: 151.65,
              x2: 26,
              y2: 151.81
            },
            {
              x1: 26,
              y1: 151.81,
              x2: 27,
              y2: 152.86
            },
            {
              x1: 27,
              y1: 152.86,
              x2: 28,
              y2: 154.86
            }
          ],
          highlight: {
            from: 23,
            to: 28,
            label: "rally"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "If the 20 MA slopes down at a demand level, you should skip the buy.",
        answer: false,
        explain: "At B the MA sloped down exactly when the low-risk buy appeared. MAs lag; the level is the information."
      },
      {
        type: "spot",
        q: "Click point B, the low-risk buy.",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 147.21,
              x2: 10,
              y2: 149.22,
              label: "moving average"
            },
            {
              x1: 10,
              y1: 149.22,
              x2: 11,
              y2: 151.53
            },
            {
              x1: 11,
              y1: 151.53,
              x2: 12,
              y2: 154.17
            },
            {
              x1: 12,
              y1: 154.17,
              x2: 13,
              y2: 157.17
            },
            {
              x1: 13,
              y1: 157.17,
              x2: 14,
              y2: 159.73
            },
            {
              x1: 14,
              y1: 159.73,
              x2: 15,
              y2: 162.05
            },
            {
              x1: 15,
              y1: 162.05,
              x2: 16,
              y2: 164.03
            },
            {
              x1: 16,
              y1: 164.03,
              x2: 17,
              y2: 164.98
            },
            {
              x1: 17,
              y1: 164.98,
              x2: 18,
              y2: 164.87
            },
            {
              x1: 18,
              y1: 164.87,
              x2: 19,
              y2: 163.81
            },
            {
              x1: 19,
              y1: 163.81,
              x2: 20,
              y2: 161.73
            },
            {
              x1: 20,
              y1: 161.73,
              x2: 21,
              y2: 159.1
            },
            {
              x1: 21,
              y1: 159.1,
              x2: 22,
              y2: 156.28
            },
            {
              x1: 22,
              y1: 156.28,
              x2: 23,
              y2: 153.84
            },
            {
              x1: 23,
              y1: 153.84,
              x2: 24,
              y2: 152.3
            },
            {
              x1: 24,
              y1: 152.3,
              x2: 25,
              y2: 151.65
            },
            {
              x1: 25,
              y1: 151.65,
              x2: 26,
              y2: 151.81
            },
            {
              x1: 26,
              y1: 151.81,
              x2: 27,
              y2: 152.86
            },
            {
              x1: 27,
              y1: 152.86,
              x2: 28,
              y2: 154.86
            }
          ]
        },
        answer: {
          from: 22,
          to: 22
        },
        explain: "The first return to the A base. Small stop, biggest profit potential, highest probability."
      },
      {
        type: "mcq",
        q: "What are indicators and oscillators, according to Seiden?",
        options: [
          "Leading signals",
          "Derivatives of price and volume",
          "Institutional order flow",
          "Supply and demand levels"
        ],
        answer: 1,
        explain: "They are just derived from price and volume. Price is all you need."
      },
      {
        type: "mcq",
        q: "BP collapses on oil-spill news into $27 demand. Why does price then rise?",
        options: [
          "The news improves",
          "When the last seller sells at a level where demand exceeds supply, price rises",
          "The moving average turns up",
          "The government steps in"
        ],
        answer: 1,
        explain: "One side exhausts itself into an imbalance level, so the turn comes opposite to what the majority expects."
      },
      {
        type: "order",
        q: "Order the chain Seiden describes.",
        items: [
          "Beliefs",
          "Behaviour patterns",
          "Actions"
        ],
        explain: "Change the beliefs, not only the actions."
      }
    ],
    practice: [
      {
        prompt: "Price returns for the first time to a base that launched a dramatic rally. The moving average points down. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.12, l: 147.82, c: 147.9 },
            { o: 147.9, h: 147.97, l: 146.41, c: 146.47 },
            { o: 146.47, h: 146.58, l: 144.02, c: 144.12 },
            { o: 144.12, h: 144.23, l: 141.89, c: 142 },
            { o: 142, h: 143.09, l: 141.72, c: 142.75 },
            { o: 142.75, h: 143.15, l: 141.18, c: 141.41 },
            { o: 141.41, h: 142.27, l: 140.96, c: 142.19 },
            { o: 142.19, h: 149.19, l: 141.93, c: 148.64 },
            { o: 148.64, h: 155.46, l: 148.58, c: 155.1 },
            { o: 155.1, h: 162.04, l: 154.95, c: 161.55 },
            { o: 161.55, h: 168.27, l: 161.44, c: 168 },
            { o: 168, h: 169.84, l: 167.88, c: 169.54 },
            { o: 169.54, h: 170.79, l: 169.41, c: 170.54 },
            { o: 170.54, h: 172.13, l: 170.41, c: 172 },
            { o: 172, h: 172.18, l: 167.83, c: 168.31 },
            { o: 168.31, h: 168.35, l: 164.34, c: 164.65 },
            { o: 164.65, h: 164.7, l: 161.71, c: 161.92 },
            { o: 161.92, h: 162, l: 157.75, c: 158.15 },
            { o: 158.15, h: 158.27, l: 153.51, c: 154.02 },
            { o: 154.02, h: 154.13, l: 150.46, c: 151 },
            { o: 151, h: 151.05, l: 147, c: 147.13 },
            { o: 147.13, h: 147.39, l: 142.92, c: 143.25 },
            { o: 143.25, h: 143.35, l: 141.95, c: 142.35 },
            { o: 142.35, h: 147.84, l: 142.19, c: 147.63 },
            { o: 147.63, h: 153.18, l: 147.59, c: 152.9 },
            { o: 152.9, h: 158.61, l: 152.84, c: 158.18 },
            { o: 158.18, h: 163.57, l: 158.1, c: 163.45 },
            { o: 163.45, h: 169.31, l: 163.25, c: 168.73 },
            { o: 168.73, h: 174.59, l: 168.66, c: 174 }
          ],
          zones: [
            {
              from: 4,
              top: 142.75,
              bottom: 140.96,
              kind: "demand",
              label: "A: demand"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 147.21,
              x2: 10,
              y2: 149.22,
              label: "moving average"
            },
            {
              x1: 10,
              y1: 149.22,
              x2: 11,
              y2: 151.53
            },
            {
              x1: 11,
              y1: 151.53,
              x2: 12,
              y2: 154.17
            },
            {
              x1: 12,
              y1: 154.17,
              x2: 13,
              y2: 157.17
            },
            {
              x1: 13,
              y1: 157.17,
              x2: 14,
              y2: 159.73
            },
            {
              x1: 14,
              y1: 159.73,
              x2: 15,
              y2: 162.05
            },
            {
              x1: 15,
              y1: 162.05,
              x2: 16,
              y2: 164.03
            },
            {
              x1: 16,
              y1: 164.03,
              x2: 17,
              y2: 164.98
            },
            {
              x1: 17,
              y1: 164.98,
              x2: 18,
              y2: 164.87
            },
            {
              x1: 18,
              y1: 164.87,
              x2: 19,
              y2: 163.81
            },
            {
              x1: 19,
              y1: 163.81,
              x2: 20,
              y2: 161.73
            },
            {
              x1: 20,
              y1: 161.73,
              x2: 21,
              y2: 159.1
            },
            {
              x1: 21,
              y1: 159.1,
              x2: 22,
              y2: 156.28
            },
            {
              x1: 22,
              y1: 156.28,
              x2: 23,
              y2: 153.84
            },
            {
              x1: 23,
              y1: 153.84,
              x2: 24,
              y2: 152.3
            },
            {
              x1: 24,
              y1: 152.3,
              x2: 25,
              y2: 151.65
            },
            {
              x1: 25,
              y1: 151.65,
              x2: 26,
              y2: 151.81
            },
            {
              x1: 26,
              y1: 151.81,
              x2: 27,
              y2: 152.86
            },
            {
              x1: 27,
              y1: 152.86,
              x2: 28,
              y2: 154.86
            }
          ],
          reveal: 23
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "This is B: the first return to A. Ignore the lagging MA. Price rallied."
      },
      {
        prompt: "Forex chart: price rallies back to a supply level that launched a strong drop. A novice is buying the strength. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 147.44, l: 139.87, c: 147.33 },
            { o: 147.33, h: 155.06, l: 147.2, c: 154.67 },
            { o: 154.67, h: 162.53, l: 154.43, c: 162 },
            { o: 162, h: 162.19, l: 161.16, c: 161.35 },
            { o: 161.35, h: 162.41, l: 161, c: 162.19 },
            { o: 162.19, h: 162.29, l: 157.44, c: 157.89 },
            { o: 157.89, h: 158.14, l: 153.22, c: 153.6 },
            { o: 153.6, h: 153.73, l: 149.24, c: 149.3 },
            { o: 149.3, h: 149.41, l: 144.81, c: 145 },
            { o: 145, h: 146.8, l: 144.93, c: 146.5 },
            { o: 146.5, h: 148.2, l: 146.43, c: 148 },
            { o: 148, h: 148.16, l: 145.9, c: 146 },
            { o: 146, h: 146.17, l: 143.65, c: 144 },
            { o: 144, h: 147.32, l: 143.81, c: 147.04 },
            { o: 147.04, h: 149.93, l: 146.96, c: 149.46 },
            { o: 149.46, h: 152.11, l: 149.37, c: 152.07 },
            { o: 152.07, h: 155.21, l: 151.89, c: 154.91 },
            { o: 154.91, h: 158.38, l: 154.87, c: 158.04 },
            { o: 158.04, h: 161.36, l: 157.99, c: 160.95 },
            { o: 160.95, h: 161.95, l: 160.85, c: 161.65 },
            { o: 161.65, h: 161.75, l: 159.37, c: 159.52 },
            { o: 159.52, h: 159.67, l: 157.22, c: 157.39 },
            { o: 157.39, h: 157.47, l: 155.21, c: 155.26 },
            { o: 155.26, h: 155.43, l: 153.1, c: 153.13 },
            { o: 153.13, h: 153.17, l: 150.8, c: 151 }
          ],
          zones: [
            {
              from: 3,
              top: 162.41,
              bottom: 161.35,
              kind: "supply",
              label: "Supply level"
            }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "The novice buys strength into supply; you sell to him. Supply and demand work the same in forex. Price fell."
      }
    ],
    cards: [
      {
        front: "Do MAs act as support and resistance?",
        back: "No; they only seem to when they line up with real supply/demand."
      },
      {
        front: "A and B in the S&P example?",
        back: "A = base + dramatic rally (demand); B = first return = low-risk buy."
      },
      {
        front: "Indicators are?",
        back: "Derivatives of price and volume."
      },
      {
        front: "Most powerful illusion?",
        back: "The news, because it creates strong emotion."
      },
      {
        front: "Bad news + collapse into demand?",
        back: "Low risk, high reward buy."
      }
    ],
    mnemonic: "Mirror lags, window shows: read the level, not the average."
  },
  {
    mentor: "seiden",
    n: 403,
    eli5: {
      oneLiner: "Don't copy the crowd; sell where they buy, buy where they sell.",
      story: "A friend in Dubai saw the same American chain stores on every corner and called it a \"copy - paste\" city. Many traders have copy - paste minds too: they copy what others do and what the books say, and they lose. Seiden thinks differently. He marked supply after price fell from it, planned a short in advance, and when the crowd bought the rally back up, an XLT member sold them 2,500 shares.",
      analogy: "In musical chairs, the kid who watches the music, not the other kids, gets the seat."
    },
    bigIdeas: [
      "Think differently from the crowd; price moves only through supply and demand.",
      "Draw the zone only after price leaves it, extend it right, and plan the trade before the return.",
      "Your profit comes from the trader making the two mistakes on the other side."
    ],
    steps: [
      {
        title: "Price leaves the level by falling",
        narration: "After a run up, price paused for two candles. It looked balanced. Then it dropped hard in long red candles, which revealed supply was greater than demand.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          highlight: {
            from: 7,
            to: 9,
            label: "drop"
          },
          reveal: 10
        }
      },
      {
        title: "Wrap two lines and extend them",
        narration: "Only after the decline do we draw it: wrap two lines around the base and extend them to the right. This is the supply zone, a future turning point.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            }
          ],
          reveal: 10
        }
      },
      {
        title: "Plan in advance",
        narration: "The plan is made before price returns: sell short at the bottom line, buy stop just above the top line. The demand below is the final target, with Target 1 halfway.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 18,
              top: 146.69,
              bottom: 145.29,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 167.25,
              label: "Short entry",
              kind: "entry"
            },
            {
              y: 168.82,
              label: "Buy stop above distal",
              kind: "sl"
            },
            {
              y: 157.17,
              label: "Target 1",
              kind: "tp"
            },
            {
              y: 147.09,
              label: "Target 2: just above demand",
              kind: "tp"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "The copy-paste buyer arrives",
        narration: "Price gaps up and rallies straight back to supply. The buyer is buying after a rally and into supply: the two classic losing mistakes. The pre-set short fills.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 18,
              top: 146.69,
              bottom: 145.29,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 167.25,
              label: "Short entry",
              kind: "entry"
            },
            {
              y: 168.82,
              label: "Buy stop above distal",
              kind: "sl"
            },
            {
              y: 157.17,
              label: "Target 1",
              kind: "tp"
            },
            {
              y: 147.09,
              label: "Target 2: just above demand",
              kind: "tp"
            }
          ],
          highlight: {
            from: 20,
            to: 22,
            label: "buying after a rally"
          },
          reveal: 24
        }
      },
      {
        title: "Cover at demand",
        narration: "Price falls through Target 1 to Target 2, just above demand. You cover by buying from copy-paste sellers who sell after a decline into demand. About 6 to 1.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 18,
              top: 146.69,
              bottom: 145.29,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 167.25,
              label: "Short entry",
              kind: "entry"
            },
            {
              y: 168.82,
              label: "Buy stop above distal",
              kind: "sl"
            },
            {
              y: 157.17,
              label: "Target 1",
              kind: "tp"
            },
            {
              y: 147.09,
              label: "Target 2: just above demand",
              kind: "tp"
            }
          ],
          highlight: {
            from: 24,
            to: 28,
            label: "to demand"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "When does Seiden draw the supply zone?",
        options: [
          "While price is still basing",
          "After price has declined from the level",
          "Only after price returns",
          "When the news comes out"
        ],
        answer: 1,
        explain: "The decline is what reveals supply was greater than demand. Then wrap two lines and extend them."
      },
      {
        type: "spot",
        q: "Click the candles where the copy-paste buyer is buying after a rally into supply.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 18,
              top: 146.69,
              bottom: 145.29,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 24
        },
        answer: {
          from: 20,
          to: 23
        },
        explain: "The gap-up rally straight back into supply. Buying after a rally and into supply: two mistakes."
      },
      {
        type: "tf",
        q: "The protective buy stop goes just above the upper (distal) line of the supply.",
        answer: true,
        explain: "Entry at proximal, stop just beyond distal: about 9 cents of risk in the QQQ trade."
      },
      {
        type: "mcq",
        q: "Where is the final target for the QQQ short?",
        options: [
          "At the entry",
          "Just above the opposing demand zone",
          "Below the demand zone",
          "At the prior high"
        ],
        answer: 1,
        explain: "Target 2 just above demand, where you buy from sellers selling after a decline."
      },
      {
        type: "order",
        q: "Order the pre-planned short.",
        items: [
          "Price bases, then declines",
          "Wrap two lines around the base and extend them",
          "Set entry, stop and targets in advance",
          "Price rallies back and the short fills",
          "Cover at demand"
        ],
        explain: "The plan exists before price gets there; the member simply executed it."
      }
    ],
    practice: [
      {
        prompt: "Price has gapped up and rallied straight back to the supply. Pick entry, stop and final target.",
        scene: {
          candles: [
            { o: 150, h: 153.82, l: 149.78, c: 153.6 },
            { o: 153.6, h: 157.3, l: 153.49, c: 157.2 },
            { o: 157.2, h: 161.06, l: 157.06, c: 160.8 },
            { o: 160.8, h: 164.91, l: 160.7, c: 164.4 },
            { o: 164.4, h: 168.39, l: 164.31, c: 168 },
            { o: 168, h: 168.12, l: 167.14, c: 167.25 },
            { o: 167.25, h: 168.52, l: 167.13, c: 168.19 },
            { o: 168.19, h: 168.41, l: 162.51, c: 162.79 },
            { o: 162.79, h: 162.84, l: 156.99, c: 157.4 },
            { o: 157.4, h: 157.48, l: 151.4, c: 152 },
            { o: 152, h: 152.12, l: 150.13, c: 150.2 },
            { o: 150.2, h: 150.31, l: 149, c: 149.08 },
            { o: 149.08, h: 149.21, l: 147.72, c: 148 },
            { o: 148, h: 150.64, l: 147.82, c: 150.5 },
            { o: 150.5, h: 153.42, l: 150.43, c: 153 },
            { o: 153, h: 153.12, l: 150.47, c: 150.83 },
            { o: 150.83, h: 150.88, l: 148.53, c: 148.67 },
            { o: 148.67, h: 148.76, l: 146.16, c: 146.5 },
            { o: 146.5, h: 146.65, l: 145.43, c: 145.74 },
            { o: 145.74, h: 147.02, l: 145.29, c: 146.69 },
            { o: 149.69, h: 155.72, l: 149.57, c: 155.38 },
            { o: 155.38, h: 161.17, l: 155.15, c: 161.06 },
            { o: 161.06, h: 167.03, l: 160.98, c: 166.75 },
            { o: 166.75, h: 167.85, l: 166.65, c: 167.55 },
            { o: 167.55, h: 167.74, l: 161.99, c: 162.49 },
            { o: 162.49, h: 162.52, l: 157.25, c: 157.42 },
            { o: 157.42, h: 157.58, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.51, l: 146.77, c: 147.29 },
            { o: 147.29, h: 147.39, l: 146.39, c: 146.89 }
          ],
          zones: [
            {
              from: 5,
              top: 168.52,
              bottom: 167.25,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 18,
              top: 146.69,
              bottom: 145.29,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 24
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 167.25,
          sl: 168.82,
          tp: 147.09
        },
        explain: "Short at the proximal line, buy stop just above distal, final target just above demand. Risk was small next to the reward, about 6:1."
      },
      {
        prompt: "Price has fallen after a decline into demand. The crowd is selling. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 162.08, l: 159.89, c: 162 },
            { o: 162, h: 164.21, l: 161.94, c: 164 },
            { o: 164, h: 166.08, l: 163.93, c: 166 },
            { o: 166, h: 166.99, l: 165.79, c: 166.77 },
            { o: 166.77, h: 167.04, l: 165.38, c: 165.81 },
            { o: 165.81, h: 166.06, l: 161.07, c: 161.21 },
            { o: 161.21, h: 161.24, l: 156.42, c: 156.6 },
            { o: 156.6, h: 156.67, l: 151.4, c: 152 },
            { o: 152, h: 153.78, l: 151.91, c: 153.5 },
            { o: 153.5, h: 155.3, l: 153.4, c: 155 },
            { o: 155, h: 155.11, l: 150.64, c: 151 },
            { o: 151, h: 151.17, l: 146.77, c: 147 },
            { o: 147, h: 147.27, l: 146.07, c: 146.25 },
            { o: 146.25, h: 147.6, l: 145.91, c: 147.19 },
            { o: 147.19, h: 151.58, l: 147.09, c: 151.46 },
            { o: 151.46, h: 156.36, l: 151.36, c: 155.73 },
            { o: 155.73, h: 160.37, l: 155.49, c: 160 },
            { o: 160, h: 160.04, l: 157.4, c: 157.54 },
            { o: 157.54, h: 157.63, l: 154.95, c: 155.08 },
            { o: 155.08, h: 155.14, l: 152.35, c: 152.61 },
            { o: 152.61, h: 152.72, l: 149.71, c: 150.15 },
            { o: 150.15, h: 150.34, l: 147.52, c: 147.69 },
            { o: 147.69, h: 147.79, l: 146.69, c: 146.89 },
            { o: 146.89, h: 149.87, l: 146.83, c: 149.67 },
            { o: 149.67, h: 152.87, l: 149.63, c: 152.45 },
            { o: 152.45, h: 155.54, l: 152.39, c: 155.22 },
            { o: 155.22, h: 158.31, l: 155.12, c: 158 }
          ],
          zones: [
            {
              from: 12,
              top: 147.19,
              bottom: 145.91,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 23
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Sellers here sell after a decline into demand, the mirror mistakes. Take the other side and buy. Price rose."
      }
    ],
    cards: [
      {
        front: "Copy-paste mind?",
        back: "Copying the crowd and conventional books into your own beliefs."
      },
      {
        front: "First step to trading success?",
        back: "Think differently from most people."
      },
      {
        front: "When is supply revealed?",
        back: "When price declines from the level."
      },
      {
        front: "The two buyer mistakes?",
        back: "Buying after a rally, and buying into supply."
      },
      {
        front: "QQQ short reward to risk?",
        back: "About 9 cents risk for 58 cents: roughly 6:1."
      },
      {
        front: "Who pays those who know?",
        back: "Those who do not."
      }
    ],
    mnemonic: "Draw after the drop, plan before the pop."
  },
  {
    mentor: "seiden",
    n: 408,
    eli5: {
      oneLiner: "Find turning points in advance with three odds enhancers.",
      story: "Stretch a rubber band a little and let go: it barely moves. Stretch it far and it snaps back hard. Seiden finds levels where price ran far away, left fast (best of all with a gap), and spent almost no time. Those levels are the most out of balance, so price turns there. He enters right at the turn, so his stop is small and his target is far.",
      analogy: "A dog that bolts out of the yard the moment the gate opens: it really did not want to stay there."
    },
    bigIdeas: [
      "The entry decides everything else: get as close to the turn as possible.",
      "Departure grades: gradual < big candles < gap away.",
      "Little time and a far run mean a bigger imbalance and a bigger target."
    ],
    steps: [
      {
        title: "Odds Enhancer 1: how did price leave?",
        narration: "Gradual move is weakest, big candles are strong, a gap away is strongest. Here price gapped down from the level. The stronger the move away, the more out of balance the level.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          highlight: {
            from: 7,
            to: 8,
            label: "gap away"
          },
          reveal: 9
        }
      },
      {
        title: "Odds Enhancer 2: how much time?",
        narration: "Only two candles. If price could have spent a long time there, supply and demand could not have been very out of balance. Little activity, low volume: strong.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          zones: [
            {
              from: 5,
              top: 162.75,
              bottom: 161.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "2 candles"
          },
          reveal: 9
        }
      },
      {
        title: "Odds Enhancer 3: how far before returning?",
        narration: "Price ran far down before coming back. The level is far from equilibrium, a stretched rubber band. The distance to the lowest low before the return becomes a target.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          zones: [
            {
              from: 5,
              top: 162.75,
              bottom: 161.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 138.24,
              label: "Target: lowest low before return",
              kind: "tp"
            }
          ],
          highlight: {
            from: 9,
            to: 12,
            label: "run = target"
          },
          reveal: 13
        }
      },
      {
        title: "Enter at the turn",
        narration: "Short right at the level, stop just above. The buyer here is buying after a very large rally. Entering at the turn gives the biggest size for the least risk and the most room to the target.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          zones: [
            {
              from: 5,
              top: 162.75,
              bottom: 161.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 138.24,
              label: "Target: lowest low before return",
              kind: "tp"
            },
            {
              y: 161.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 163.15,
              label: "Stop",
              kind: "sl"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Snap back",
        narration: "The rubber band snaps back to the target. All three odds enhancers were strong.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          zones: [
            {
              from: 5,
              top: 162.75,
              bottom: 161.81,
              kind: "supply",
              label: "Supply"
            }
          ],
          lines: [
            {
              y: 138.24,
              label: "Target: lowest low before return",
              kind: "tp"
            },
            {
              y: 161.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 163.15,
              label: "Stop",
              kind: "sl"
            }
          ],
          highlight: {
            from: 21,
            to: 26,
            label: "snap back"
          }
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Rank departures from weakest to strongest.",
        items: [
          "Gradual move",
          "Big red or green candles",
          "Gap away"
        ],
        explain: "A gap away shows the biggest imbalance."
      },
      {
        type: "mcq",
        q: "For a supply short, where does the distance target come from?",
        options: [
          "The highest high",
          "The lowest low price made before rallying back",
          "The moving average",
          "A fixed 50 cents"
        ],
        answer: 1,
        explain: "Measure from the supply to the lowest low before the return; that distance is a profit target."
      },
      {
        type: "spot",
        q: "Click the candles that show the strongest kind of departure.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          reveal: 13
        },
        answer: {
          from: 7,
          to: 8
        },
        explain: "The gap down and big candles right after the base."
      },
      {
        type: "tf",
        q: "Busy, high-volume levels are the strongest, as most books say.",
        answer: false,
        explain: "Strong imbalance means few transactions and lower volume. Do not believe something just because most people do."
      },
      {
        type: "tf",
        q: "Entering right at the turn lets you trade the largest position for the least money at risk.",
        answer: true,
        explain: "And it puts you farthest from your target, so the reward is as large as possible."
      }
    ],
    practice: [
      {
        prompt: "Draw the supply zone on this base using Seiden's rule.",
        scene: {
          candles: [
            { o: 140, h: 144.45, l: 139.94, c: 144.06 },
            { o: 144.06, h: 148.65, l: 143.8, c: 148.36 },
            { o: 148.36, h: 153.74, l: 148.11, c: 153.19 },
            { o: 153.19, h: 158.35, l: 153.08, c: 157.92 },
            { o: 157.92, h: 162.25, l: 157.86, c: 162 },
            { o: 162, h: 162.57, l: 161.66, c: 162.47 },
            { o: 162.47, h: 162.75, l: 161.5, c: 161.81 },
            { o: 157.81, h: 157.93, l: 153.33, c: 153.9 },
            { o: 153.9, h: 153.99, l: 149.93, c: 150 },
            { o: 150, h: 150.13, l: 147.14, c: 147.21 },
            { o: 147.21, h: 147.43, l: 143.91, c: 144.01 },
            { o: 144.01, h: 144.14, l: 140.17, c: 140.62 },
            { o: 140.62, h: 140.75, l: 137.64, c: 138 },
            { o: 138, h: 141.59, l: 137.8, c: 141.17 },
            { o: 141.17, h: 144.89, l: 141.04, c: 144.35 },
            { o: 144.35, h: 148.01, l: 144.19, c: 147.69 },
            { o: 147.69, h: 151.63, l: 147.65, c: 151.42 },
            { o: 151.42, h: 154.59, l: 151.23, c: 154.52 },
            { o: 154.52, h: 158.32, l: 154.41, c: 158.16 },
            { o: 158.16, h: 161.73, l: 158.1, c: 161.31 },
            { o: 161.31, h: 162.41, l: 161.21, c: 162.11 },
            { o: 162.11, h: 162.26, l: 157.86, c: 158.13 },
            { o: 158.13, h: 158.26, l: 154.02, c: 154.15 },
            { o: 154.15, h: 154.2, l: 150.02, c: 150.18 },
            { o: 150.18, h: 150.36, l: 145.79, c: 146.2 },
            { o: 146.2, h: 146.38, l: 141.65, c: 142.22 },
            { o: 142.22, h: 142.31, l: 137.74, c: 138.24 }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "base"
          },
          reveal: 21
        },
        task: "draw-zone",
        answer: {
          side: "sell",
          top: 162.75,
          bottom: 161.81
        },
        explain: "Bottom (proximal) on the lowest body of the base, top (distal) on the highest wick. Price came back to it and fell to the target."
      },
      {
        prompt: "Price drifted slowly away from a seven-candle base and has barely moved before returning. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 165, h: 165.17, l: 161.11, c: 161.25 },
            { o: 161.25, h: 161.32, l: 157.44, c: 157.5 },
            { o: 157.5, h: 157.65, l: 153.68, c: 153.75 },
            { o: 153.75, h: 153.92, l: 149.95, c: 150 },
            { o: 150, h: 150.54, l: 148.48, c: 149.02 },
            { o: 149.02, h: 150.63, l: 148.74, c: 150.53 },
            { o: 150.53, h: 151.08, l: 148.95, c: 149.43 },
            { o: 149.43, h: 150.97, l: 149.23, c: 150.58 },
            { o: 150.58, h: 151.06, l: 148.49, c: 149.03 },
            { o: 149.03, h: 150.99, l: 148.5, c: 150.59 },
            { o: 150.59, h: 150.84, l: 149.44, c: 149.76 },
            { o: 149.76, h: 150.41, l: 149.73, c: 150.37 },
            { o: 150.37, h: 151.31, l: 150.29, c: 151.25 },
            { o: 151.25, h: 152.33, l: 151.21, c: 152.18 },
            { o: 152.18, h: 153.36, l: 152.11, c: 153.24 },
            { o: 153.24, h: 154.23, l: 153.14, c: 154 },
            { o: 154, h: 154.05, l: 152.93, c: 153 },
            { o: 153, h: 153.09, l: 151.76, c: 151.99 },
            { o: 151.99, h: 152.03, l: 150.81, c: 150.99 },
            { o: 150.99, h: 151.09, l: 149.79, c: 150.09 },
            { o: 150.09, h: 150.17, l: 148.19, c: 148.44 },
            { o: 148.44, h: 148.54, l: 146.67, c: 146.79 },
            { o: 146.79, h: 146.88, l: 145.08, c: 145.13 },
            { o: 145.13, h: 145.18, l: 143.17, c: 143.48 }
          ],
          zones: [
            {
              from: 4,
              top: 150.59,
              bottom: 148.48,
              kind: "demand",
              label: "Demand?"
            }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Gradual departure, lots of time, tiny distance: all three odds enhancers are weak. Price fell through."
      }
    ],
    cards: [
      {
        front: "Odds Enhancer 1?",
        back: "How did price leave the level?"
      },
      {
        front: "Odds Enhancer 2?",
        back: "How much time did price spend at the level?"
      },
      {
        front: "Odds Enhancer 3?",
        back: "How far did price move away before returning?"
      },
      {
        front: "Strongest departure?",
        back: "A gap away."
      },
      {
        front: "Rubber band idea?",
        back: "The more it is stretched, the more likely it snaps back."
      },
      {
        front: "Why the entry matters most?",
        back: "Stops, targets, size and risk all depend on it."
      }
    ],
    mnemonic: "Leave fast, stay short, run far."
  },
  {
    mentor: "seiden",
    n: 410,
    eli5: {
      oneLiner: "In a downtrend, only sell, and only at the one supply that qualifies.",
      story: "Swimming in a river is easy if you swim with the current and very hard against it. In a downtrend the current flows down, so Seiden only looks for supply levels to sell. A chart may show many supply levels, but he picks only the one that passes the odds enhancers. Price rallied to it, turned and fell more than 100 ticks while he risked only 25.",
      analogy: "Riding a bike down a hill: you pick the smooth path, and you do not try to ride back up."
    },
    bigIdeas: [
      "Downtrend: only short at supply. Uptrend: only buy at demand.",
      "Pick only the level that meets the odds enhancers, not every level.",
      "Need: quality level + profit margin + good reward to risk + trend in your favour."
    ],
    steps: [
      {
        title: "Trend down: only shorts",
        narration: "The trend is down on this timeframe and above. So we only look for supply levels to sell. Demand levels are ignored.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          highlight: {
            from: 0,
            to: 26,
            label: "downtrend"
          },
          reveal: 27
        }
      },
      {
        title: "Many supplies, one qualifies",
        narration: "Supply B spent many candles and left slowly: ignore it. Supply A is a short base, a fast drop, and a long run away before returning. Only A meets the odds enhancers.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          zones: [
            {
              from: 5,
              top: 181.11,
              bottom: 179.23,
              kind: "supply",
              label: "Supply B: ignored",
              faded: true
            },
            {
              from: 18,
              top: 169.86,
              bottom: 168.81,
              kind: "supply",
              label: "Supply A: qualifies"
            }
          ],
          highlight: {
            from: 18,
            to: 19,
            label: "A"
          },
          reveal: 27
        }
      },
      {
        title: "Plan with small risk",
        narration: "Short at A's bottom line, stop just above its top. The risk is small next to the room down to the low: about 25 ticks for 100+. If a big announcement like the FOMC is due, cancel and wait until the market settles.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          zones: [
            {
              from: 5,
              top: 181.11,
              bottom: 179.23,
              kind: "supply",
              label: "Supply B: ignored",
              faded: true
            },
            {
              from: 18,
              top: 169.86,
              bottom: 168.81,
              kind: "supply",
              label: "Supply A: qualifies"
            }
          ],
          lines: [
            {
              y: 168.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 170.26,
              label: "Stop (25 ticks)",
              kind: "sl"
            },
            {
              y: 148.52,
              label: "Target (100+ ticks)",
              kind: "tp"
            }
          ],
          reveal: 27
        }
      },
      {
        title: "The buyer's three mistakes",
        narration: "Price climbs back up. The buyer buys after a rally, buys where supply exceeds demand, and buys in a downtrend.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          zones: [
            {
              from: 5,
              top: 181.11,
              bottom: 179.23,
              kind: "supply",
              label: "Supply B: ignored",
              faded: true
            },
            {
              from: 18,
              top: 169.86,
              bottom: 168.81,
              kind: "supply",
              label: "Supply A: qualifies"
            }
          ],
          lines: [
            {
              y: 168.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 170.26,
              label: "Stop (25 ticks)",
              kind: "sl"
            },
            {
              y: 148.52,
              label: "Target (100+ ticks)",
              kind: "tp"
            }
          ],
          highlight: {
            from: 27,
            to: 34,
            label: "3 mistakes"
          },
          reveal: 36
        }
      },
      {
        title: "With the trend",
        narration: "Price turns at A and falls to the target. Those who trade against the trend tend to pay those who trade with it.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          zones: [
            {
              from: 5,
              top: 181.11,
              bottom: 179.23,
              kind: "supply",
              label: "Supply B: ignored",
              faded: true
            },
            {
              from: 18,
              top: 169.86,
              bottom: 168.81,
              kind: "supply",
              label: "Supply A: qualifies"
            }
          ],
          lines: [
            {
              y: 168.81,
              label: "Short",
              kind: "entry"
            },
            {
              y: 170.26,
              label: "Stop (25 ticks)",
              kind: "sl"
            },
            {
              y: 148.52,
              label: "Target (100+ ticks)",
              kind: "tp"
            }
          ],
          highlight: {
            from: 36,
            to: 40,
            label: "fall"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The trend is down. Which levels do you look at?",
        options: [
          "Demand to buy",
          "Supply to sell",
          "Both equally",
          "Neither"
        ],
        answer: 1,
        explain: "Trend down means you only want to sell short, so you only look for supply."
      },
      {
        type: "spot",
        q: "Click the one supply base that qualifies.",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          reveal: 27
        },
        answer: {
          from: 18,
          to: 19
        },
        explain: "Supply A: short base, fast drop, long run before returning. Supply B spent too long and left slowly."
      },
      {
        type: "order",
        q: "Order the buyer's three mistakes from Seiden's list.",
        items: [
          "Buying after a rally",
          "Buying where supply exceeds demand",
          "Buying in a downtrend"
        ],
        explain: "The second is worse than the first, and the third adds to both."
      },
      {
        type: "tf",
        q: "If the FOMC announcement is coming, the Pro Pick note says cancel and wait until the market settles.",
        answer: true,
        explain: "Stand aside going into a major announcement."
      },
      {
        type: "mcq",
        q: "In the USDCHF trade, what was the risk against the move?",
        options: [
          "100 ticks risk for 25",
          "25 ticks risk for 100+",
          "50 for 50",
          "No stop"
        ],
        answer: 1,
        explain: "About 25 ticks of risk against well over 100 ticks: roughly 4:1 or better."
      }
    ],
    practice: [
      {
        prompt: "Strong downtrend. Price dips into a demand level. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 184, h: 184.16, l: 179.31, c: 179.59 },
            { o: 179.59, h: 179.7, l: 174.86, c: 174.99 },
            { o: 174.99, h: 175.09, l: 169.4, c: 169.78 },
            { o: 169.78, h: 169.98, l: 163.95, c: 164.26 },
            { o: 164.26, h: 164.49, l: 159.76, c: 160 },
            { o: 160, h: 160.17, l: 159.01, c: 159.4 },
            { o: 159.4, h: 160.37, l: 159.27, c: 160.19 },
            { o: 160.19, h: 163.13, l: 159.98, c: 163.1 },
            { o: 163.1, h: 166.18, l: 162.91, c: 166 },
            { o: 166, h: 166.04, l: 164.25, c: 164.5 },
            { o: 164.5, h: 164.65, l: 162.87, c: 163 },
            { o: 163, h: 163.04, l: 162.01, c: 162.2 },
            { o: 162.2, h: 162.27, l: 161.25, c: 161.39 },
            { o: 161.39, h: 161.48, l: 160.37, c: 160.59 },
            { o: 160.59, h: 160.69, l: 159.59, c: 159.79 },
            { o: 159.79, h: 159.9, l: 157.98, c: 158.2 },
            { o: 158.2, h: 158.37, l: 155.54, c: 155.79 },
            { o: 155.79, h: 155.85, l: 153.46, c: 153.73 },
            { o: 153.73, h: 153.83, l: 151.93, c: 152.05 },
            { o: 152.05, h: 152.2, l: 149.8, c: 150.01 }
          ],
          zones: [
            {
              from: 5,
              top: 160.19,
              bottom: 159.01,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "In a downtrend we only short at supply. Buying here is trading against the trend. Price kept falling."
      },
      {
        prompt: "Downtrend. Price climbs back to the qualifying Supply A. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 186, h: 186.04, l: 183.02, c: 183.33 },
            { o: 183.33, h: 183.39, l: 180.59, c: 180.67 },
            { o: 180.67, h: 180.84, l: 177.89, c: 178 },
            { o: 178, h: 179.2, l: 177.94, c: 179 },
            { o: 179, h: 180.06, l: 178.92, c: 180 },
            { o: 180, h: 180.76, l: 179.88, c: 180.61 },
            { o: 180.61, h: 181.11, l: 179.17, c: 179.31 },
            { o: 179.31, h: 181.08, l: 179.21, c: 180.84 },
            { o: 180.84, h: 180.95, l: 178.93, c: 179.23 },
            { o: 179.23, h: 180.85, l: 178.77, c: 180.46 },
            { o: 180.46, h: 180.98, l: 179.58, c: 179.76 },
            { o: 179.76, h: 179.79, l: 177.4, c: 177.5 },
            { o: 177.5, h: 177.57, l: 174.44, c: 174.7 },
            { o: 174.7, h: 174.82, l: 171.63, c: 172 },
            { o: 172, h: 172.15, l: 169.66, c: 170 },
            { o: 170, h: 170.13, l: 167.71, c: 168 },
            { o: 168, h: 168.11, l: 165.9, c: 166 },
            { o: 166, h: 169.12, l: 165.81, c: 169 },
            { o: 169, h: 169.86, l: 168.72, c: 169.41 },
            { o: 169.41, h: 169.58, l: 168.58, c: 168.81 },
            { o: 168.81, h: 168.98, l: 163.29, c: 163.4 },
            { o: 163.4, h: 163.47, l: 157.61, c: 158 },
            { o: 158, h: 159.22, l: 157.92, c: 159 },
            { o: 159, h: 160.27, l: 158.93, c: 160 },
            { o: 160, h: 160.15, l: 155.59, c: 155.67 },
            { o: 155.67, h: 155.9, l: 151.21, c: 151.33 },
            { o: 151.33, h: 151.53, l: 146.52, c: 147 },
            { o: 147, h: 149.35, l: 146.92, c: 149.26 },
            { o: 149.26, h: 152.6, l: 149.14, c: 152.52 },
            { o: 152.52, h: 155.49, l: 152.41, c: 155.15 },
            { o: 155.15, h: 157.73, l: 154.96, c: 157.56 },
            { o: 157.56, h: 160.53, l: 157.37, c: 160.41 },
            { o: 160.41, h: 163.07, l: 160.21, c: 162.91 },
            { o: 162.91, h: 165.62, l: 162.72, c: 165.52 },
            { o: 165.52, h: 168.86, l: 165.44, c: 168.41 },
            { o: 168.41, h: 169.41, l: 168.31, c: 169.11 },
            { o: 169.11, h: 169.22, l: 164.45, c: 164.99 },
            { o: 164.99, h: 165.19, l: 160.64, c: 160.87 },
            { o: 160.87, h: 161.13, l: 156.6, c: 156.76 },
            { o: 156.76, h: 156.84, l: 152.19, c: 152.64 },
            { o: 152.64, h: 152.86, l: 148.12, c: 148.52 }
          ],
          zones: [
            {
              from: 5,
              top: 181.11,
              bottom: 179.23,
              kind: "supply",
              label: "Supply B: ignored",
              faded: true
            },
            {
              from: 18,
              top: 169.86,
              bottom: 168.81,
              kind: "supply",
              label: "Supply A: qualifies"
            }
          ],
          reveal: 36
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Quality level, big margin, small risk, trend down: all four reasons. Price fell to the target."
      }
    ],
    cards: [
      {
        front: "Trade with the trend means?",
        back: "Downtrend: only short supply. Uptrend: only buy demand."
      },
      {
        front: "Four reasons to sell the USDCHF supply?",
        back: "Quality level, profit margin, ideal risk/reward, strong downtrend."
      },
      {
        front: "Many supply levels on the chart?",
        back: "Take only the one that meets the odds enhancers."
      },
      {
        front: "Before FOMC?",
        back: "Cancel pending entries until the market settles."
      },
      {
        front: "Who pays whom?",
        back: "Those against the trend pay those with the trend."
      }
    ],
    mnemonic: "Swim with the current, at the one good rock."
  },
  {
    mentor: "seiden",
    n: 414,
    eli5: {
      oneLiner: "Only two things matter: where price turns and where it goes.",
      story: "Another speaker used six factors for one trade. Seiden needs only two. First, the quality of the level, which tells him where price will turn. Second, the profit margin, which tells him where price will go. If a rally shot up with no pauses, there are no buyers waiting in that space, so price can fall right back through it.",
      analogy: "Before you jump off a diving board, check two things: is the board springy (quality) and is the pool deep enough (margin)?"
    },
    bigIdeas: [
      "Part 1: level quality, judged mainly by how fast price left. It tells you where price turns.",
      "Part 2: profit margin, judged by the price action between entry and target. It tells you where price goes.",
      "With both present, buy even against bad news and a short-term downtrend."
    ],
    steps: [
      {
        title: "Part 1: quality of the level",
        narration: "Price left this supply very quickly. Willing supply was far greater than willing demand. Quality tells you where price will turn.",
        scene: {
          candles: [
            { o: 148, h: 148.1, l: 144.97, c: 145.33 },
            { o: 145.33, h: 145.46, l: 142.38, c: 142.67 },
            { o: 142.67, h: 142.83, l: 139.86, c: 140 },
            { o: 140, h: 140.97, l: 139.62, c: 140.76 },
            { o: 140.76, h: 141.19, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.44, l: 139.61, c: 145.87 },
            { o: 145.87, h: 152.12, l: 145.79, c: 151.94 },
            { o: 151.94, h: 158.43, l: 151.74, c: 158 },
            { o: 158, h: 161.17, l: 157.94, c: 161 },
            { o: 161, h: 161.71, l: 160.88, c: 161.51 },
            { o: 161.51, h: 161.87, l: 160.33, c: 160.81 },
            { o: 160.81, h: 160.99, l: 157.3, c: 157.4 },
            { o: 157.4, h: 157.49, l: 153.59, c: 154 },
            { o: 154, h: 155.13, l: 153.94, c: 155 },
            { o: 155, h: 156.09, l: 154.96, c: 156 },
            { o: 156, h: 157.64, l: 155.94, c: 157.47 },
            { o: 157.47, h: 159.2, l: 157.4, c: 158.94 },
            { o: 158.94, h: 160.52, l: 158.9, c: 160.41 },
            { o: 160.41, h: 161.41, l: 160.31, c: 161.11 },
            { o: 161.11, h: 161.25, l: 155.9, c: 156.27 },
            { o: 156.27, h: 156.36, l: 151.35, c: 151.44 },
            { o: 151.44, h: 151.61, l: 146.51, c: 146.6 },
            { o: 146.6, h: 146.67, l: 141.7, c: 141.76 },
            { o: 141.76, h: 143.1, l: 141.65, c: 142.86 },
            { o: 142.86, h: 144.14, l: 142.82, c: 143.96 }
          ],
          zones: [
            {
              from: 9,
              top: 161.87,
              bottom: 160.81,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          highlight: {
            from: 11,
            to: 12,
            label: "fast drop"
          },
          reveal: 13
        }
      },
      {
        title: "Part 2: the profit margin",
        narration: "Look below. The rally up to here had no basing at all, so there are no buy orders in that range. As fast as price rallied through it, expect it to fall back through it. The margin tells you where price will go.",
        scene: {
          candles: [
            { o: 148, h: 148.1, l: 144.97, c: 145.33 },
            { o: 145.33, h: 145.46, l: 142.38, c: 142.67 },
            { o: 142.67, h: 142.83, l: 139.86, c: 140 },
            { o: 140, h: 140.97, l: 139.62, c: 140.76 },
            { o: 140.76, h: 141.19, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.44, l: 139.61, c: 145.87 },
            { o: 145.87, h: 152.12, l: 145.79, c: 151.94 },
            { o: 151.94, h: 158.43, l: 151.74, c: 158 },
            { o: 158, h: 161.17, l: 157.94, c: 161 },
            { o: 161, h: 161.71, l: 160.88, c: 161.51 },
            { o: 161.51, h: 161.87, l: 160.33, c: 160.81 },
            { o: 160.81, h: 160.99, l: 157.3, c: 157.4 },
            { o: 157.4, h: 157.49, l: 153.59, c: 154 },
            { o: 154, h: 155.13, l: 153.94, c: 155 },
            { o: 155, h: 156.09, l: 154.96, c: 156 },
            { o: 156, h: 157.64, l: 155.94, c: 157.47 },
            { o: 157.47, h: 159.2, l: 157.4, c: 158.94 },
            { o: 158.94, h: 160.52, l: 158.9, c: 160.41 },
            { o: 160.41, h: 161.41, l: 160.31, c: 161.11 },
            { o: 161.11, h: 161.25, l: 155.9, c: 156.27 },
            { o: 156.27, h: 156.36, l: 151.35, c: 151.44 },
            { o: 151.44, h: 151.61, l: 146.51, c: 146.6 },
            { o: 146.6, h: 146.67, l: 141.7, c: 141.76 },
            { o: 141.76, h: 143.1, l: 141.65, c: 142.86 },
            { o: 142.86, h: 144.14, l: 142.82, c: 143.96 }
          ],
          zones: [
            {
              from: 9,
              top: 161.87,
              bottom: 160.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 3,
              top: 140.76,
              bottom: 139.62,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "rally with no basing"
          },
          reveal: 13
        }
      },
      {
        title: "Both present: take it",
        narration: "Short at supply with the stop above. Take profit just above the demand that launched the rally. Risk about $400 to make $1,200. Nothing else needs checking.",
        scene: {
          candles: [
            { o: 148, h: 148.1, l: 144.97, c: 145.33 },
            { o: 145.33, h: 145.46, l: 142.38, c: 142.67 },
            { o: 142.67, h: 142.83, l: 139.86, c: 140 },
            { o: 140, h: 140.97, l: 139.62, c: 140.76 },
            { o: 140.76, h: 141.19, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.44, l: 139.61, c: 145.87 },
            { o: 145.87, h: 152.12, l: 145.79, c: 151.94 },
            { o: 151.94, h: 158.43, l: 151.74, c: 158 },
            { o: 158, h: 161.17, l: 157.94, c: 161 },
            { o: 161, h: 161.71, l: 160.88, c: 161.51 },
            { o: 161.51, h: 161.87, l: 160.33, c: 160.81 },
            { o: 160.81, h: 160.99, l: 157.3, c: 157.4 },
            { o: 157.4, h: 157.49, l: 153.59, c: 154 },
            { o: 154, h: 155.13, l: 153.94, c: 155 },
            { o: 155, h: 156.09, l: 154.96, c: 156 },
            { o: 156, h: 157.64, l: 155.94, c: 157.47 },
            { o: 157.47, h: 159.2, l: 157.4, c: 158.94 },
            { o: 158.94, h: 160.52, l: 158.9, c: 160.41 },
            { o: 160.41, h: 161.41, l: 160.31, c: 161.11 },
            { o: 161.11, h: 161.25, l: 155.9, c: 156.27 },
            { o: 156.27, h: 156.36, l: 151.35, c: 151.44 },
            { o: 151.44, h: 151.61, l: 146.51, c: 146.6 },
            { o: 146.6, h: 146.67, l: 141.7, c: 141.76 },
            { o: 141.76, h: 143.1, l: 141.65, c: 142.86 },
            { o: 142.86, h: 144.14, l: 142.82, c: 143.96 }
          ],
          zones: [
            {
              from: 9,
              top: 161.87,
              bottom: 160.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 3,
              top: 140.76,
              bottom: 139.62,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          lines: [
            {
              y: 160.81,
              label: "Sold short",
              kind: "entry"
            },
            {
              y: 162.27,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 141.96,
              label: "Take profit above demand",
              kind: "tp"
            }
          ],
          reveal: 19
        }
      },
      {
        title: "Through the empty space",
        narration: "Price falls straight through the empty range to the target. On a trading desk this is a big stack of sell orders at supply and no real buy orders until much lower.",
        scene: {
          candles: [
            { o: 148, h: 148.1, l: 144.97, c: 145.33 },
            { o: 145.33, h: 145.46, l: 142.38, c: 142.67 },
            { o: 142.67, h: 142.83, l: 139.86, c: 140 },
            { o: 140, h: 140.97, l: 139.62, c: 140.76 },
            { o: 140.76, h: 141.19, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.44, l: 139.61, c: 145.87 },
            { o: 145.87, h: 152.12, l: 145.79, c: 151.94 },
            { o: 151.94, h: 158.43, l: 151.74, c: 158 },
            { o: 158, h: 161.17, l: 157.94, c: 161 },
            { o: 161, h: 161.71, l: 160.88, c: 161.51 },
            { o: 161.51, h: 161.87, l: 160.33, c: 160.81 },
            { o: 160.81, h: 160.99, l: 157.3, c: 157.4 },
            { o: 157.4, h: 157.49, l: 153.59, c: 154 },
            { o: 154, h: 155.13, l: 153.94, c: 155 },
            { o: 155, h: 156.09, l: 154.96, c: 156 },
            { o: 156, h: 157.64, l: 155.94, c: 157.47 },
            { o: 157.47, h: 159.2, l: 157.4, c: 158.94 },
            { o: 158.94, h: 160.52, l: 158.9, c: 160.41 },
            { o: 160.41, h: 161.41, l: 160.31, c: 161.11 },
            { o: 161.11, h: 161.25, l: 155.9, c: 156.27 },
            { o: 156.27, h: 156.36, l: 151.35, c: 151.44 },
            { o: 151.44, h: 151.61, l: 146.51, c: 146.6 },
            { o: 146.6, h: 146.67, l: 141.7, c: 141.76 },
            { o: 141.76, h: 143.1, l: 141.65, c: 142.86 },
            { o: 142.86, h: 144.14, l: 142.82, c: 143.96 }
          ],
          zones: [
            {
              from: 9,
              top: 161.87,
              bottom: 160.81,
              kind: "supply",
              label: "Supply (retail)"
            },
            {
              from: 3,
              top: 140.76,
              bottom: 139.62,
              kind: "demand",
              label: "Demand (wholesale)"
            }
          ],
          lines: [
            {
              y: 160.81,
              label: "Sold short",
              kind: "entry"
            },
            {
              y: 162.27,
              label: "Stop",
              kind: "sl"
            },
            {
              y: 141.96,
              label: "Take profit above demand",
              kind: "tp"
            }
          ],
          highlight: {
            from: 19,
            to: 22,
            label: "open space"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What does the profit margin tell you?",
        options: [
          "Where price will turn",
          "Where price will go",
          "How big your account is",
          "The trend"
        ],
        answer: 1,
        explain: "Level quality says where price turns; the margin says where it goes."
      },
      {
        type: "spot",
        q: "Click the rally that had no basing (the open space).",
        scene: {
          candles: [
            { o: 148, h: 148.1, l: 144.97, c: 145.33 },
            { o: 145.33, h: 145.46, l: 142.38, c: 142.67 },
            { o: 142.67, h: 142.83, l: 139.86, c: 140 },
            { o: 140, h: 140.97, l: 139.62, c: 140.76 },
            { o: 140.76, h: 141.19, l: 139.64, c: 139.81 },
            { o: 139.81, h: 146.44, l: 139.61, c: 145.87 },
            { o: 145.87, h: 152.12, l: 145.79, c: 151.94 },
            { o: 151.94, h: 158.43, l: 151.74, c: 158 },
            { o: 158, h: 161.17, l: 157.94, c: 161 },
            { o: 161, h: 161.71, l: 160.88, c: 161.51 },
            { o: 161.51, h: 161.87, l: 160.33, c: 160.81 },
            { o: 160.81, h: 160.99, l: 157.3, c: 157.4 },
            { o: 157.4, h: 157.49, l: 153.59, c: 154 },
            { o: 154, h: 155.13, l: 153.94, c: 155 },
            { o: 155, h: 156.09, l: 154.96, c: 156 },
            { o: 156, h: 157.64, l: 155.94, c: 157.47 },
            { o: 157.47, h: 159.2, l: 157.4, c: 158.94 },
            { o: 158.94, h: 160.52, l: 158.9, c: 160.41 },
            { o: 160.41, h: 161.41, l: 160.31, c: 161.11 },
            { o: 161.11, h: 161.25, l: 155.9, c: 156.27 },
            { o: 156.27, h: 156.36, l: 151.35, c: 151.44 },
            { o: 151.44, h: 151.61, l: 146.51, c: 146.6 },
            { o: 146.6, h: 146.67, l: 141.7, c: 141.76 },
            { o: 141.76, h: 143.1, l: 141.65, c: 142.86 },
            { o: 142.86, h: 144.14, l: 142.82, c: 143.96 }
          ],
          zones: [
            {
              from: 3,
              top: 140.76,
              bottom: 139.62,
              kind: "demand",
              label: "Demand (wholesale)"
            },
            {
              from: 9,
              top: 161.87,
              bottom: 160.81,
              kind: "supply",
              label: "Supply (retail)"
            }
          ],
          reveal: 19
        },
        answer: {
          from: 5,
          to: 7
        },
        explain: "Tall green candles with no pause: no buy orders left in that range, so it is the profit margin."
      },
      {
        type: "tf",
        q: "Seiden checks six factors before a trade.",
        answer: false,
        explain: "Two: level quality and profit margin. Everything else is secondary."
      },
      {
        type: "mcq",
        q: "March 2011: awful news, short-term downtrend, pundits say lower. Price is at quality daily demand with clear margin above. What did Seiden say?",
        options: [
          "Sell with the news",
          "Stay out",
          "A very good buying opportunity",
          "Wait for the trend to turn up"
        ],
        answer: 2,
        explain: "Both factors were present, so he called it a buy. The Dow then rallied over 800 points."
      },
      {
        type: "tf",
        q: "Bases between your entry and target reduce the profit margin.",
        answer: true,
        explain: "Each base holds opposing orders that can stop price before your target."
      }
    ],
    practice: [
      {
        prompt: "Quality supply, but below it the rally stepped up with base after base. Is there a clear profit margin? Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 132, h: 134.83, l: 131.95, c: 134.67 },
            { o: 134.67, h: 137.37, l: 134.48, c: 137.33 },
            { o: 137.33, h: 140.28, l: 137.22, c: 140 },
            { o: 140, h: 140.93, l: 139.73, c: 140.65 },
            { o: 140.65, h: 140.75, l: 139.02, c: 139.43 },
            { o: 139.43, h: 140.65, l: 139.01, c: 140.19 },
            { o: 140.19, h: 143.48, l: 140.13, c: 143.1 },
            { o: 143.1, h: 146.37, l: 143.05, c: 146 },
            { o: 146, h: 146.59, l: 145.52, c: 146.39 },
            { o: 146.39, h: 146.86, l: 145.39, c: 145.57 },
            { o: 145.57, h: 146.29, l: 145.4, c: 146.19 },
            { o: 146.19, h: 149.18, l: 146.05, c: 149.1 },
            { o: 149.1, h: 152.44, l: 148.96, c: 152 },
            { o: 152, h: 152.16, l: 150.96, c: 151.38 },
            { o: 151.38, h: 153.08, l: 151.17, c: 152.65 },
            { o: 152.65, h: 152.77, l: 151.52, c: 151.81 },
            { o: 151.81, h: 155.28, l: 151.74, c: 154.9 },
            { o: 154.9, h: 158.44, l: 154.87, c: 158 },
            { o: 158, h: 158.82, l: 157.55, c: 158.42 },
            { o: 158.42, h: 158.54, l: 157.51, c: 157.81 },
            { o: 157.81, h: 157.88, l: 155.53, c: 155.65 },
            { o: 155.65, h: 155.79, l: 153.18, c: 153.5 },
            { o: 153.5, h: 155.6, l: 153.41, c: 155.45 },
            { o: 155.45, h: 157.74, l: 155.33, c: 157.41 },
            { o: 157.41, h: 158.41, l: 157.31, c: 158.11 },
            { o: 158.11, h: 158.17, l: 155.28, c: 155.53 },
            { o: 155.53, h: 155.59, l: 152.76, c: 152.95 },
            { o: 152.95, h: 154.25, l: 152.35, c: 154.15 },
            { o: 154.15, h: 156.51, l: 154.11, c: 156.37 },
            { o: 156.37, h: 158.83, l: 156.21, c: 158.6 },
            { o: 158.6, h: 161.17, l: 158.5, c: 160.82 }
          ],
          zones: [
            {
              from: 18,
              top: 158.82,
              bottom: 157.81,
              kind: "supply",
              label: "Supply"
            },
            {
              from: 13,
              top: 152.65,
              bottom: 150.96,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 8,
              top: 146.39,
              bottom: 145.39,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The bases below hold buy orders, so there is no open space: no margin. Price stalled at the first demand and pushed back up."
      },
      {
        prompt: "Very bad news, a sharp drop, and price is at fresh daily demand with open space up to the prior high. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 124, h: 128.24, l: 123.89, c: 128 },
            { o: 128, h: 132.27, l: 127.91, c: 132 },
            { o: 132, h: 136.58, l: 131.77, c: 136 },
            { o: 136, h: 136.36, l: 135.17, c: 135.39 },
            { o: 135.39, h: 136.4, l: 135.13, c: 136.19 },
            { o: 136.19, h: 140.92, l: 136.02, c: 140.79 },
            { o: 140.79, h: 145.64, l: 140.71, c: 145.4 },
            { o: 145.4, h: 150.63, l: 145.25, c: 150 },
            { o: 150, h: 154.73, l: 149.78, c: 154.1 },
            { o: 154.1, h: 159.52, l: 153.96, c: 159.45 },
            { o: 159.45, h: 163.63, l: 159.35, c: 163.49 },
            { o: 163.49, h: 168.33, l: 163.31, c: 167.97 },
            { o: 167.97, h: 172.35, l: 167.93, c: 172 },
            { o: 172, h: 172.06, l: 164.71, c: 164.94 },
            { o: 164.94, h: 165.19, l: 157.45, c: 157.88 },
            { o: 157.88, h: 158.08, l: 150.37, c: 150.81 },
            { o: 150.81, h: 150.99, l: 143.51, c: 143.75 },
            { o: 143.75, h: 143.79, l: 136.39, c: 136.69 },
            { o: 136.69, h: 136.79, l: 135.39, c: 135.79 },
            { o: 135.79, h: 142.21, l: 135.74, c: 142.12 },
            { o: 142.12, h: 147.69, l: 142.07, c: 147.57 },
            { o: 147.57, h: 154.34, l: 147.47, c: 153.77 },
            { o: 153.77, h: 159.51, l: 153.6, c: 159.4 },
            { o: 159.4, h: 165.29, l: 159.35, c: 165.05 },
            { o: 165.05, h: 171.66, l: 164.82, c: 171.35 }
          ],
          zones: [
            {
              from: 3,
              top: 136.19,
              bottom: 135.13,
              kind: "demand",
              label: "Daily demand (fresh)"
            }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Quality level and a clear margin: buy, even against the news and the short-term trend. Price rallied back toward the prior high."
      }
    ],
    cards: [
      {
        front: "The two most important parts of a setup?",
        back: "Level quality and profit margin."
      },
      {
        front: "Level quality tells you?",
        back: "Where price will turn."
      },
      {
        front: "Profit margin tells you?",
        back: "Where price will go."
      },
      {
        front: "A rally with no basing means?",
        back: "No opposing orders in that range: open space."
      },
      {
        front: "Gold trade risk and reward?",
        back: "Risk $400 to make $1,200 (3:1)."
      }
    ],
    mnemonic: "Turn and Room: where it turns, how much room."
  },
  {
    mentor: "seiden",
    n: 418,
    eli5: {
      oneLiner: "Big chart picks the direction; watch how deep price digs into a level.",
      story: "Think of a stack of pancakes on a plate. Each time a hungry kid visits, he eats a few. If he only nibbles the top, there are plenty left for next time. If he digs a quarter of the way in, the stack is nearly gone and the next visit finds an empty plate. Seiden ignores how many visits; he watches how deep each visit goes, and he lets the bigger chart decide whether he is buying or selling.",
      analogy: "A map and a magnifying glass: the map (bigger timeframe) tells you which way to go; the glass (small timeframe) finds the exact step."
    },
    bigIdeas: [
      "Larger timeframe location decides direction; smaller timeframe gives the entry. HTF trumps LTF.",
      "Ignore touch count; stop trading a level once price goes 25% or more into it.",
      "Counter-trend only at fresh HTF levels. No Fibs, pivots or candle patterns."
    ],
    steps: [
      {
        title: "A stack of buy orders",
        narration: "Picture a big stack of buy orders at this level. The first time price comes down, it bounces higher.",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          highlight: {
            from: 12,
            to: 12,
            label: "return 1: touch"
          },
          reveal: 16
        }
      },
      {
        title: "Depth, not touch count",
        narration: "Draw a line 25% into the zone. Return 2 only touches and leaves strongly: the imbalance is still big, so trade it again. Ignore the \"3 taps\" rule.",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 151.19,
              label: "Proximal (0%)",
              kind: "proximal"
            },
            {
              y: 150.74,
              label: "25% into the zone",
              kind: "level"
            },
            {
              y: 149.38,
              label: "Distal (100%)",
              kind: "distal"
            }
          ],
          highlight: {
            from: 19,
            to: 19,
            label: "return 2: shallow"
          },
          reveal: 23
        }
      },
      {
        title: "25% or more: no more trades",
        narration: "Return 3 trades deep into the zone, past the 25% line. Many orders are filled; the layers of the floor are being removed. No more trades at this level.",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 151.19,
              label: "Proximal (0%)",
              kind: "proximal"
            },
            {
              y: 150.74,
              label: "25% into the zone",
              kind: "level"
            },
            {
              y: 149.38,
              label: "Distal (100%)",
              kind: "distal"
            }
          ],
          highlight: {
            from: 25,
            to: 25,
            label: "return 3: 25%+"
          },
          reveal: 28
        }
      },
      {
        title: "Orders used up",
        narration: "Once the orders are all filled, price falls quickly to the next demand level.",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 151.19,
              label: "Proximal (0%)",
              kind: "proximal"
            },
            {
              y: 150.74,
              label: "25% into the zone",
              kind: "level"
            },
            {
              y: 149.38,
              label: "Distal (100%)",
              kind: "distal"
            }
          ],
          highlight: {
            from: 30,
            to: 34,
            label: "falls through"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A day trader wants entries on the 5-minute chart. Which chart decides buy or sell?",
        options: [
          "The 1-minute",
          "The hourly or daily",
          "A Fibonacci grid",
          "The news"
        ],
        answer: 1,
        explain: "Pair a larger timeframe (hourly or daily) with the 5-minute. Swing traders use weekly and daily."
      },
      {
        type: "spot",
        q: "Click the return that went 25% or more into the zone.",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 150.74,
              label: "25% into the zone",
              kind: "level"
            }
          ],
          reveal: 30
        },
        answer: {
          from: 25,
          to: 25
        },
        explain: "Return 3 traded deep past the 25% line. After that, no more trades at this level."
      },
      {
        type: "tf",
        q: "Seiden uses the \"3 taps\" touch-count rule.",
        answer: false,
        explain: "He rejects it. He watches penetration depth instead."
      },
      {
        type: "mcq",
        q: "A 5-minute demand sits right under hourly supply. What are the odds of the buy?",
        options: [
          "Very high",
          "Very low",
          "The same as anywhere",
          "It depends on Fibonacci"
        ],
        answer: 1,
        explain: "Larger timeframe levels trump smaller ones. A small buy at or near HTF supply is very low odds."
      },
      {
        type: "mcq",
        q: "When may you trade against the trend?",
        options: [
          "Whenever a candle pattern appears",
          "When the trend reaches a fresh larger timeframe supply or demand level",
          "After three taps",
          "Never"
        ],
        answer: 1,
        explain: "Trends end and begin at fresh HTF levels; that is the only place to trade counter-trend."
      },
      {
        type: "tf",
        q: "Fib lines are useful because one of them always lines up with real supply or demand.",
        answer: false,
        explain: "Then why use the Fib? You are always taking the one that lines up with real supply/demand anyway."
      }
    ],
    practice: [
      {
        prompt: "This demand already had a return that went 25%+ into it. Price is back again. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 176, h: 176.25, l: 168.96, c: 169.5 },
            { o: 169.5, h: 169.64, l: 162.83, c: 163 },
            { o: 163, h: 163.1, l: 156, c: 156.5 },
            { o: 156.5, h: 156.57, l: 149.48, c: 150 },
            { o: 150, h: 151.61, l: 149.75, c: 151.19 },
            { o: 151.19, h: 151.47, l: 149.38, c: 149.52 },
            { o: 149.52, h: 154.07, l: 149.27, c: 153.68 },
            { o: 153.68, h: 157.96, l: 153.52, c: 157.84 },
            { o: 157.84, h: 162.62, l: 157.73, c: 162 },
            { o: 162, h: 162.2, l: 158.38, c: 158.53 },
            { o: 158.53, h: 158.65, l: 154.57, c: 155.06 },
            { o: 155.06, h: 155.11, l: 151.38, c: 151.59 },
            { o: 151.59, h: 151.89, l: 151.09, c: 151.79 },
            { o: 151.79, h: 154.99, l: 151.69, c: 154.53 },
            { o: 154.53, h: 157.66, l: 154.44, c: 157.26 },
            { o: 157.26, h: 160.36, l: 157.21, c: 160 },
            { o: 160, h: 160.08, l: 156.72, c: 157.2 },
            { o: 157.2, h: 157.24, l: 153.96, c: 154.39 },
            { o: 154.39, h: 154.49, l: 151.19, c: 151.59 },
            { o: 151.59, h: 151.79, l: 150.99, c: 151.69 },
            { o: 151.69, h: 154.09, l: 151.61, c: 153.79 },
            { o: 153.79, h: 156.25, l: 153.71, c: 155.9 },
            { o: 155.9, h: 158.12, l: 155.84, c: 158 },
            { o: 158, h: 158.07, l: 154.55, c: 154.7 },
            { o: 154.7, h: 154.74, l: 151.08, c: 151.39 },
            { o: 151.39, h: 151.49, l: 150.19, c: 151.09 },
            { o: 151.09, h: 153.37, l: 151.02, c: 153.05 },
            { o: 153.05, h: 155.15, l: 152.91, c: 155 },
            { o: 155, h: 155.12, l: 153.09, c: 153.25 },
            { o: 153.25, h: 153.37, l: 151.44, c: 151.49 },
            { o: 151.49, h: 151.59, l: 150.79, c: 150.89 },
            { o: 150.89, h: 150.95, l: 148.14, c: 148.51 },
            { o: 148.51, h: 148.61, l: 145.82, c: 146.14 },
            { o: 146.14, h: 146.18, l: 143.35, c: 143.76 },
            { o: 143.76, h: 143.8, l: 141.12, c: 141.38 }
          ],
          zones: [
            {
              from: 4,
              top: 151.19,
              bottom: 149.38,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 150.74,
              label: "25% into the zone",
              kind: "level"
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "After a 25%+ penetration the imbalance is not strong enough. No more trades. Price fell quickly to the next level."
      },
      {
        prompt: "The hourly chart shows price at hourly supply. On the 5-minute, price rallies into a quality supply with room below. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 145.31, l: 139.81, c: 144.77 },
            { o: 144.77, h: 149.24, l: 144.62, c: 148.88 },
            { o: 148.88, h: 154.04, l: 148.66, c: 153.69 },
            { o: 153.69, h: 158.47, l: 153.51, c: 158 },
            { o: 158, h: 159.05, l: 157.55, c: 158.72 },
            { o: 158.72, h: 158.98, l: 157.61, c: 157.81 },
            { o: 157.81, h: 157.86, l: 153.79, c: 154.21 },
            { o: 154.21, h: 154.38, l: 150.02, c: 150.6 },
            { o: 150.6, h: 150.67, l: 146.54, c: 147 },
            { o: 147, h: 148.05, l: 146.9, c: 148 },
            { o: 148, h: 149.15, l: 147.89, c: 149 },
            { o: 149, h: 149.11, l: 147.46, c: 147.5 },
            { o: 147.5, h: 147.57, l: 145.89, c: 146 },
            { o: 146, h: 148.06, l: 145.91, c: 147.79 },
            { o: 147.79, h: 151.2, l: 147.64, c: 150.83 },
            { o: 150.83, h: 153.09, l: 150.73, c: 152.8 },
            { o: 152.8, h: 155.52, l: 152.61, c: 155.45 },
            { o: 155.45, h: 157.71, l: 155.36, c: 157.41 },
            { o: 157.41, h: 158.41, l: 157.31, c: 158.11 },
            { o: 158.11, h: 158.29, l: 155.18, c: 155.49 },
            { o: 155.49, h: 155.62, l: 152.83, c: 152.87 },
            { o: 152.87, h: 152.98, l: 150.07, c: 150.24 },
            { o: 150.24, h: 150.37, l: 147.54, c: 147.62 },
            { o: 147.62, h: 147.73, l: 144.71, c: 145 }
          ],
          zones: [
            {
              from: 4,
              top: 159.05,
              bottom: 157.81,
              kind: "supply",
              label: "5-min supply"
            }
          ],
          notes: [
            {
              x: 2,
              y: 162.05,
              text: "Hourly: at supply"
            }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "HTF location says sell only; the LTF supply with margin below gives the entry. Price fell."
      }
    ],
    cards: [
      {
        front: "Day trading timeframe pair?",
        back: "Hourly or daily for direction, 5-minute for entries."
      },
      {
        front: "Swing trading timeframe pair?",
        back: "Weekly and daily."
      },
      {
        front: "When to stop trading a level?",
        back: "Once price penetrates 25% or more into it."
      },
      {
        front: "Touch count or depth?",
        back: "Depth. Ignore \"3 taps\"."
      },
      {
        front: "HTF vs LTF?",
        back: "Larger timeframe levels trump smaller ones."
      },
      {
        front: "Fib, pivots, candle patterns?",
        back: "Not used."
      },
      {
        front: "Where do trends end and begin?",
        back: "At fresh larger timeframe supply and demand levels."
      }
    ],
    mnemonic: "Map first, then dig: under a quarter, still tradable."
  }
];
