// Interactive teaching layer for kevin-course lessons 1-12 (see videoLessons.ts).
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c); zones wrap the basing candles
// (demand: top = highest basing body, bottom = lowest basing wick; supply mirrored).
import type { InteractiveLesson } from './types';

export const IL_KEVINCOURSEA: InteractiveLesson[] = [
  {
    mentor: "kevin-course",
    n: 1,
    eli5: {
      oneLiner: "Big players leave footprints: a pause, then a jump. Wait for the return.",
      story: "Imagine a toy shop. One morning a giant truck of kids arrives and buys every toy at $5, so the price shoots up. Some kids did not get a toy, and they are still waiting at $5. Later, when the price drifts back down to $5, those kids buy again and the price jumps once more. On a chart, the waiting spot is the little pause just before the big jump.",
      analogy: "A zone is like the spot where the ice-cream truck stopped and a crowd rushed in. When the truck comes back to that same corner, the crowd is still there waiting."
    },
    bigIdeas: [
      "Only a big, fast move away shows a bank was there. Small drifting moves do not count.",
      "Go to where the move started (the pause, called the basing), box it, and wait for the pullback.",
      "Sideways price is balance. We only trade imbalance."
    ],
    steps: [
      {
        title: "Spot the big, fast move",
        narration: "First look for a candle (or two) that is much bigger than the ones around it, moving fast in one direction. Only banks and big institutions can push price like this. That is their footprint.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.25, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.33, c: 154.5 },
            { o: 154.5, h: 155.04, l: 151.97, c: 152.3 },
            { o: 152.3, h: 152.68, l: 148.54, c: 148.9 },
            { o: 148.9, h: 149.26, l: 146.02, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.48, c: 160.55 },
            { o: 160.55, h: 162.86, l: 160.23, c: 162.65 },
            { o: 162.65, h: 163.06, l: 161.23, c: 161.75 },
            { o: 161.75, h: 163.77, l: 161.56, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.97, l: 161.85, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.69, c: 162.95 },
            { o: 162.95, h: 163.46, l: 159.7, c: 159.85 },
            { o: 159.85, h: 160.26, l: 156.33, c: 156.8 },
            { o: 156.8, h: 157.12, l: 153.16, c: 153.71 },
            { o: 153.71, h: 153.9, l: 150.54, c: 150.96 },
            { o: 150.96, h: 151.54, l: 147.66, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.41, l: 147.19, c: 149.85 },
            { o: 149.85, h: 153.52, l: 149.34, c: 153.05 },
            { o: 153.05, h: 156.03, l: 152.77, c: 155.45 },
            { o: 155.45, h: 155.68, l: 154.14, c: 154.65 },
            { o: 154.65, h: 158.13, l: 154.17, c: 157.55 },
            { o: 157.55, h: 160.35, l: 157.04, c: 159.75 }
          ],
          highlight: {
            from: 8,
            to: 10,
            label: "big fast move away"
          },
          notes: [
            {
              x: 8,
              y: 161.8,
              text: "Footprint of a bank"
            }
          ]
        }
      },
      {
        title: "Walk back to the pause",
        narration: "Now look at where that move came from. Just before it, price paused with small candles. That pause is the basing. It is where the big buy orders were sitting.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.25, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.33, c: 154.5 },
            { o: 154.5, h: 155.04, l: 151.97, c: 152.3 },
            { o: 152.3, h: 152.68, l: 148.54, c: 148.9 },
            { o: 148.9, h: 149.26, l: 146.02, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.48, c: 160.55 },
            { o: 160.55, h: 162.86, l: 160.23, c: 162.65 },
            { o: 162.65, h: 163.06, l: 161.23, c: 161.75 },
            { o: 161.75, h: 163.77, l: 161.56, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.97, l: 161.85, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.69, c: 162.95 },
            { o: 162.95, h: 163.46, l: 159.7, c: 159.85 },
            { o: 159.85, h: 160.26, l: 156.33, c: 156.8 },
            { o: 156.8, h: 157.12, l: 153.16, c: 153.71 },
            { o: 153.71, h: 153.9, l: 150.54, c: 150.96 },
            { o: 150.96, h: 151.54, l: 147.66, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.41, l: 147.19, c: 149.85 },
            { o: 149.85, h: 153.52, l: 149.34, c: 153.05 },
            { o: 153.05, h: 156.03, l: 152.77, c: 155.45 },
            { o: 155.45, h: 155.68, l: 154.14, c: 154.65 },
            { o: 154.65, h: 158.13, l: 154.17, c: 157.55 },
            { o: 157.55, h: 160.35, l: 157.04, c: 159.75 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing (the pause)"
          },
          notes: [
            {
              x: 5,
              y: 144.15,
              text: "Origin of the move"
            }
          ]
        }
      },
      {
        title: "Box the basing",
        narration: "Draw a box around the basing candles. Price came down (drop), paused (base) and shot up (rally), so this is a Drop-Base-Rally demand zone.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.25, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.33, c: 154.5 },
            { o: 154.5, h: 155.04, l: 151.97, c: 152.3 },
            { o: 152.3, h: 152.68, l: 148.54, c: 148.9 },
            { o: 148.9, h: 149.26, l: 146.02, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.48, c: 160.55 },
            { o: 160.55, h: 162.86, l: 160.23, c: 162.65 },
            { o: 162.65, h: 163.06, l: 161.23, c: 161.75 },
            { o: 161.75, h: 163.77, l: 161.56, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.97, l: 161.85, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.69, c: 162.95 },
            { o: 162.95, h: 163.46, l: 159.7, c: 159.85 },
            { o: 159.85, h: 160.26, l: 156.33, c: 156.8 },
            { o: 156.8, h: 157.12, l: 153.16, c: 153.71 },
            { o: 153.71, h: 153.9, l: 150.54, c: 150.96 },
            { o: 150.96, h: 151.54, l: 147.66, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.41, l: 147.19, c: 149.85 },
            { o: 149.85, h: 153.52, l: 149.34, c: 153.05 },
            { o: 153.05, h: 156.03, l: 152.77, c: 155.45 },
            { o: 155.45, h: 155.68, l: 154.14, c: 154.65 },
            { o: 154.65, h: 158.13, l: 154.17, c: 157.55 },
            { o: 157.55, h: 160.35, l: 157.04, c: 159.75 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing (the pause)"
          },
          notes: [
            {
              x: 5,
              y: 144.15,
              text: "Origin of the move"
            }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand (DBR)"
            }
          ]
        }
      },
      {
        title: "Wait for the pullback",
        narration: "We never chase the big move. We wait. When price comes back into the box, some of those big buy orders may still be there, so price can push up again.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.25, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.33, c: 154.5 },
            { o: 154.5, h: 155.04, l: 151.97, c: 152.3 },
            { o: 152.3, h: 152.68, l: 148.54, c: 148.9 },
            { o: 148.9, h: 149.26, l: 146.02, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.48, c: 160.55 },
            { o: 160.55, h: 162.86, l: 160.23, c: 162.65 },
            { o: 162.65, h: 163.06, l: 161.23, c: 161.75 },
            { o: 161.75, h: 163.77, l: 161.56, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.97, l: 161.85, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.69, c: 162.95 },
            { o: 162.95, h: 163.46, l: 159.7, c: 159.85 },
            { o: 159.85, h: 160.26, l: 156.33, c: 156.8 },
            { o: 156.8, h: 157.12, l: 153.16, c: 153.71 },
            { o: 153.71, h: 153.9, l: 150.54, c: 150.96 },
            { o: 150.96, h: 151.54, l: 147.66, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.41, l: 147.19, c: 149.85 },
            { o: 149.85, h: 153.52, l: 149.34, c: 153.05 },
            { o: 153.05, h: 156.03, l: 152.77, c: 155.45 },
            { o: 155.45, h: 155.68, l: 154.14, c: 154.65 },
            { o: 154.65, h: 158.13, l: 154.17, c: 157.55 },
            { o: 157.55, h: 160.35, l: 157.04, c: 159.75 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand (DBR)"
            }
          ],
          highlight: {
            from: 17,
            to: 22,
            label: "pullback"
          },
          notes: [
            {
              x: 22,
              y: 144.15,
              text: "Price returns - leftover buy orders"
            }
          ],
          lines: [
            {
              y: 146.65,
              label: "buy here on the return",
              kind: "entry",
              from: 8
            }
          ]
        }
      },
      {
        title: "Supply is the mirror",
        narration: "Supply is the exact opposite: price rallies, pauses, then drops hard. The box goes around that pause, and we look to sell when price comes back up into it.",
        scene: {
          candles: [
            { o: 140, h: 142.81, l: 139.85, c: 142.4 },
            { o: 142.4, h: 145.88, l: 142.22, c: 145.5 },
            { o: 145.5, h: 148.13, l: 145.17, c: 147.7 },
            { o: 147.7, h: 151.32, l: 147.3, c: 151.1 },
            { o: 151.1, h: 153.95, l: 150.88, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.3, l: 139.03, c: 139.45 },
            { o: 139.45, h: 139.79, l: 136.76, c: 137.35 },
            { o: 137.35, h: 138.56, l: 136.91, c: 138.25 },
            { o: 138.25, h: 138.44, l: 136.38, c: 136.55 },
            { o: 136.55, h: 138.26, l: 136.13, c: 137.75 },
            { o: 137.75, h: 138.01, l: 136.3, c: 136.45 },
            { o: 136.45, h: 137.27, l: 136.27, c: 137.05 },
            { o: 137.05, h: 140.42, l: 136.75, c: 140.22 },
            { o: 140.22, h: 143.21, l: 139.62, c: 142.88 },
            { o: 142.88, h: 146.06, l: 142.66, c: 145.84 },
            { o: 145.84, h: 149.59, l: 145.32, c: 149.02 },
            { o: 149.02, h: 152.23, l: 148.6, c: 152.05 },
            { o: 152.05, h: 153.8, l: 151.75, c: 152.65 },
            { o: 152.65, h: 152.97, l: 149.6, c: 150.15 },
            { o: 150.15, h: 150.66, l: 146.37, c: 146.95 },
            { o: 146.95, h: 147.12, l: 144.1, c: 144.55 },
            { o: 144.55, h: 145.89, l: 144.03, c: 145.35 },
            { o: 145.35, h: 145.78, l: 142.04, c: 142.45 },
            { o: 142.45, h: 142.71, l: 139.98, c: 140.25 }
          ],
          zones: [
            {
              from: 5,
              top: 154.35,
              bottom: 153.35,
              kind: "supply",
              label: "Supply (RBD)"
            }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          },
          notes: [
            {
              x: 10,
              y: 137.83,
              text: "Strong move down"
            }
          ]
        }
      },
      {
        title: "Sideways is not a zone",
        narration: "When price just goes side to side, buyers and sellers are in balance. A small push out of the range is not a strong move away. No zone here.",
        scene: {
          candles: [
            { o: 150, h: 150.95, l: 149.53, c: 150.8 },
            { o: 150.8, h: 151.32, l: 149.52, c: 150.1 },
            { o: 150.1, h: 151.27, l: 149.57, c: 150.7 },
            { o: 150.7, h: 151.13, l: 149.28, c: 149.8 },
            { o: 149.8, h: 151.02, l: 149.58, c: 150.5 },
            { o: 150.5, h: 151.09, l: 149.51, c: 150 },
            { o: 150, h: 151.41, l: 149.65, c: 150.9 },
            { o: 150.9, h: 151.36, l: 149.55, c: 150.1 },
            { o: 150.1, h: 150.98, l: 149.9, c: 150.5 },
            { o: 150.5, h: 151.09, l: 149.36, c: 149.9 },
            { o: 149.9, h: 150.94, l: 149.33, c: 150.6 },
            { o: 150.6, h: 151.05, l: 149.81, c: 150 },
            { o: 150, h: 151.25, l: 149.47, c: 151.1 },
            { o: 151.1, h: 152.04, l: 150.72, c: 151.8 },
            { o: 151.8, h: 152.13, l: 150.7, c: 150.9 },
            { o: 150.9, h: 151.43, l: 149.54, c: 150.1 },
            { o: 150.1, h: 150.74, l: 149.67, c: 150.4 },
            { o: 150.4, h: 150.81, l: 149.23, c: 149.5 },
            { o: 149.5, h: 149.75, l: 147.37, c: 147.9 },
            { o: 147.9, h: 148.45, l: 145.31, c: 145.8 },
            { o: 145.8, h: 146.45, l: 145.3, c: 146.2 },
            { o: 146.2, h: 146.53, l: 143.89, c: 144.4 },
            { o: 144.4, h: 144.76, l: 142.32, c: 142.9 }
          ],
          highlight: {
            from: 0,
            to: 13,
            label: "sideways = balance"
          },
          notes: [
            {
              x: 12,
              y: 153.04,
              text: "Small push - no zone"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What footprint do big banks leave on a chart?",
        options: [
          "A slow drift with tiny candles",
          "A pause, then a big fast move away",
          "A long sideways range",
          "A candle with no wicks"
        ],
        answer: 1,
        explain: "Only big players can move price that hard and that fast. The pause (basing) before the big move is where their orders sat."
      },
      {
        type: "tf",
        q: "A sideways range with a small push up is a good demand zone.",
        answer: false,
        explain: "Sideways means balance between buyers and sellers. A small push is at best borderline. We only mark big, fast moves away."
      },
      {
        type: "order",
        q: "Put the zone process in order.",
        items: [
          "Find the large move away",
          "Go to the origin of the move (the basing)",
          "Draw the zone around the basing candles",
          "Wait for the pullback into the zone"
        ],
        explain: "Move first, then its origin, then the box, then patience. We always wait for the pullback."
      },
      {
        type: "spot",
        q: "Click the basing candles that created this demand zone.",
        scene: {
          candles: [
            { o: 170, h: 170.15, l: 167.07, c: 167.6 },
            { o: 167.6, h: 168.01, l: 164.16, c: 164.5 },
            { o: 164.5, h: 164.86, l: 162.12, c: 162.3 },
            { o: 162.3, h: 162.75, l: 158.52, c: 158.9 },
            { o: 158.9, h: 159.28, l: 156.11, c: 156.3 },
            { o: 156.3, h: 157, l: 155.85, c: 156.65 },
            { o: 156.65, h: 156.95, l: 155.65, c: 156.25 },
            { o: 156.25, h: 157, l: 155.9, c: 156.55 },
            { o: 156.55, h: 163.7, l: 156.35, c: 163.35 },
            { o: 163.35, h: 169.35, l: 163.05, c: 168.95 },
            { o: 168.95, h: 170.87, l: 168.68, c: 170.55 },
            { o: 170.55, h: 173.09, l: 170.18, c: 172.65 },
            { o: 172.65, h: 173.14, l: 171.41, c: 171.75 },
            { o: 171.75, h: 173.78, l: 171.55, c: 173.45 },
            { o: 173.45, h: 173.77, l: 171.68, c: 172.25 },
            { o: 172.25, h: 174.08, l: 171.82, c: 173.55 },
            { o: 173.55, h: 173.81, l: 172.79, c: 172.95 },
            { o: 172.95, h: 173.27, l: 169.84, c: 170.12 },
            { o: 170.12, h: 170.64, l: 166.26, c: 166.78 },
            { o: 166.78, h: 167.23, l: 163.62, c: 164.07 },
            { o: 164.07, h: 164.36, l: 160.61, c: 161.03 },
            { o: 161.03, h: 161.57, l: 157.53, c: 157.95 },
            { o: 157.95, h: 158.25, l: 156.2, c: 157.35 },
            { o: 157.35, h: 160.39, l: 157.15, c: 159.85 },
            { o: 159.85, h: 163.41, l: 159.36, c: 163.05 },
            { o: 163.05, h: 165.65, l: 162.65, c: 165.45 },
            { o: 165.45, h: 165.65, l: 164.49, c: 164.65 },
            { o: 164.65, h: 168.08, l: 164.33, c: 167.55 },
            { o: 167.55, h: 170.27, l: 167.35, c: 169.75 }
          ]
        },
        answer: {
          from: 5,
          to: 7
        },
        explain: "The basing is the small pause right before the big green candles. That pause is where the buy orders sat."
      },
      {
        type: "mcq",
        q: "Which zones are the continuation type (good for trading with the trend)?",
        options: [
          "DBR and RBD",
          "RBR and DBD",
          "Only DBR",
          "None of them"
        ],
        answer: 1,
        explain: "Rally-Base-Rally and Drop-Base-Drop continue the move. He prefers them in trending markets. DBR and RBD are reversal types."
      },
      {
        type: "tf",
        q: "If you missed the big move up, you should jump in right away before it runs further.",
        answer: false,
        explain: "Never chase the move away. The whole method is to wait for price to pull back into the zone."
      },
      {
        type: "mcq",
        q: "A DBR demand zone is usually...",
        options: [
          "With the trend",
          "Counter-trend",
          "A support line",
          "Always a winner"
        ],
        answer: 1,
        explain: "Price was dropping before the base, so buying a DBR goes against that drop. He says any DBR demand is pretty much counter-trend."
      }
    ],
    practice: [
      {
        prompt: "Price rallied, paused for three small candles, then exploded up. Now it is pulling back toward that pause. What is your plan?",
        scene: {
          candles: [
            { o: 128, h: 130.35, l: 127.41, c: 130.2 },
            { o: 130.2, h: 133.3, l: 129.65, c: 133 },
            { o: 133, h: 135.6, l: 132.72, c: 135 },
            { o: 135, h: 138.07, l: 134.77, c: 137.6 },
            { o: 137.6, h: 139.64, l: 137.44, c: 139.4 },
            { o: 139.4, h: 140.1, l: 138.95, c: 139.75 },
            { o: 139.75, h: 140.05, l: 138.75, c: 139.35 },
            { o: 139.35, h: 140.1, l: 139, c: 139.65 },
            { o: 139.65, h: 146.8, l: 139.45, c: 146.45 },
            { o: 146.45, h: 152.45, l: 146.15, c: 152.05 },
            { o: 152.05, h: 154.14, l: 151.54, c: 153.65 },
            { o: 153.65, h: 156.11, l: 153.27, c: 155.75 },
            { o: 155.75, h: 156.26, l: 154.27, c: 154.85 },
            { o: 154.85, h: 156.73, l: 154.65, c: 156.55 },
            { o: 156.55, h: 157.04, l: 155.2, c: 155.35 },
            { o: 155.35, h: 156.92, l: 155.06, c: 156.65 },
            { o: 156.65, h: 157.18, l: 155.47, c: 156.05 },
            { o: 156.05, h: 156.61, l: 152.83, c: 153.15 },
            { o: 153.15, h: 153.41, l: 149.82, c: 150.2 },
            { o: 150.2, h: 150.54, l: 146.56, c: 147.13 },
            { o: 147.13, h: 147.3, l: 143.59, c: 144.16 },
            { o: 144.16, h: 144.53, l: 140.74, c: 141.05 },
            { o: 141.05, h: 141.35, l: 139.3, c: 140.45 },
            { o: 140.45, h: 143.49, l: 140.08, c: 142.95 },
            { o: 142.95, h: 146.62, l: 142.47, c: 146.15 },
            { o: 146.15, h: 149.08, l: 145.86, c: 148.55 },
            { o: 148.55, h: 149.05, l: 147.56, c: 147.75 },
            { o: 147.75, h: 151.01, l: 147.48, c: 150.65 },
            { o: 150.65, h: 153.04, l: 150.25, c: 152.85 }
          ],
          zones: [
            {
              from: 5,
              top: 139.75,
              bottom: 138.75,
              kind: "demand",
              label: "RBR demand"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Rally-Base-Rally demand: a clean pause and a strong move away. We waited for the pullback instead of chasing, and price pushed up again from the zone. Remember: not every zone works. We are only stacking the odds."
      },
      {
        prompt: "Price has gone sideways for a while and made one small push up. It is drifting back. Buy, sell, or do nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.95, l: 149.8, c: 150.8 },
            { o: 150.8, h: 150.99, l: 149.8, c: 150.1 },
            { o: 150.1, h: 151.09, l: 149.72, c: 150.7 },
            { o: 150.7, h: 151.19, l: 149.26, c: 149.8 },
            { o: 149.8, h: 151.04, l: 149.22, c: 150.5 },
            { o: 150.5, h: 150.71, l: 149.71, c: 150 },
            { o: 150, h: 151.18, l: 149.6, c: 150.9 },
            { o: 150.9, h: 151.43, l: 149.74, c: 150.1 },
            { o: 150.1, h: 150.98, l: 149.89, c: 150.5 },
            { o: 150.5, h: 150.71, l: 149.72, c: 149.9 },
            { o: 149.9, h: 151.06, l: 149.31, c: 150.6 },
            { o: 150.6, h: 150.94, l: 149.45, c: 150 },
            { o: 150, h: 151.49, l: 149.66, c: 151.1 },
            { o: 151.1, h: 152.16, l: 150.74, c: 151.8 },
            { o: 151.8, h: 152.25, l: 150.65, c: 150.9 },
            { o: 150.9, h: 151.3, l: 149.86, c: 150.1 },
            { o: 150.1, h: 150.64, l: 149.61, c: 150.4 },
            { o: 150.4, h: 150.9, l: 149.24, c: 149.5 },
            { o: 149.5, h: 149.7, l: 147.7, c: 147.9 },
            { o: 147.9, h: 148.44, l: 145.27, c: 145.8 },
            { o: 145.8, h: 146.78, l: 145.33, c: 146.2 },
            { o: 146.2, h: 146.6, l: 144.23, c: 144.4 },
            { o: 144.4, h: 144.74, l: 142.68, c: 142.9 }
          ],
          highlight: {
            from: 0,
            to: 13,
            label: "range"
          },
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Sideways price is balance, and the small push is not a strong move away, so there is no demand zone to trade. Price then slid lower. Doing nothing was right."
      }
    ],
    cards: [
      {
        front: "What does a bank footprint look like?",
        back: "A pause (basing) followed by a big, fast move away."
      },
      {
        front: "Where do you draw a zone?",
        back: "Around the basing candles at the origin of the big move."
      },
      {
        front: "Do you chase the move away?",
        back: "No. Always wait for the pullback into the zone."
      },
      {
        front: "Sideways price means...?",
        back: "Balance of buyers and sellers. No zone."
      },
      {
        front: "Two demand zone types?",
        back: "Drop-Base-Rally (reversal) and Rally-Base-Rally (continuation)."
      },
      {
        front: "Two supply zone types?",
        back: "Rally-Base-Drop (reversal) and Drop-Base-Drop (continuation)."
      },
      {
        front: "Which zone type fits a trending market best?",
        back: "Continuation zones: RBR and DBD."
      },
      {
        front: "Does every zone work?",
        back: "No. We stack the odds by trading with the big players."
      }
    ],
    mnemonic: "Pause, Pop, Pullback: find the pop, box the pause, wait for the pullback."
  },
  {
    mentor: "kevin-course",
    n: 2,
    eli5: {
      oneLiner: "Not every zone you find is good enough to trade. Qualify it first.",
      story: "Two kids arm-wrestle. The winner is the strong one, so you would bet on him next time. On a chart, when buyers smash through a sellers zone, the buyers zone below proved it is the strong one. A clean pause and a big, proud move away make a zone worth trading. A wobbly pause with a weak move is just a note in your notebook.",
      analogy: "Finding a zone is like finding a fruit. You can find fruit everywhere, but you only eat the ripe one. Ripe = clean basing, strong move away, and price stayed away a long time."
    },
    bigIdeas: [
      "Highest quality: the zone removed an opposing zone or a trend line.",
      "Tradable = clean basing + strong move away. Weak ones are drawable only (to track the chart).",
      "Real zones wrap tightly around the basing. Random wide boxes are support/resistance, not supply and demand."
    ],
    steps: [
      {
        title: "A supply zone sits above",
        narration: "Price rallied, paused, then dropped hard. That pause is a supply zone. Sellers were strong there.",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply"
            }
          ]
        }
      },
      {
        title: "Price smashes through it",
        narration: "Later, price pushes up into the supply and breaks right through it. A broken zone is violated: it is removed. Something strong must have done that.",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply removed",
              faded: true
            }
          ],
          highlight: {
            from: 13,
            to: 15,
            label: "breaks the supply"
          }
        }
      },
      {
        title: "The winner: demand at the origin",
        narration: "The strong move started from this basing. This demand zone removed the supply, so it is the highest quality kind of zone. That is our potential trade.",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply removed",
              faded: true
            },
            {
              from: 10,
              top: 143.05,
              bottom: 142.1,
              kind: "demand",
              label: "Demand that removed it"
            }
          ],
          highlight: {
            from: 10,
            to: 12,
            label: "origin"
          }
        }
      },
      {
        title: "Trade the return",
        narration: "When price pulls back into the qualified demand, that is the trade. Clean basing, strong move away, and price stayed away for a while: all good signs.",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply removed",
              faded: true
            },
            {
              from: 10,
              top: 143.05,
              bottom: 142.1,
              kind: "demand",
              label: "Demand that removed it"
            }
          ],
          lines: [
            {
              y: 143.05,
              label: "potential buy",
              kind: "entry",
              from: 10
            }
          ],
          notes: [
            {
              x: 27,
              y: 140.9,
              text: "Pullback"
            }
          ]
        }
      },
      {
        title: "Drawable but not tradable",
        narration: "Here the basing is only one candle and the move away is weak: a half-size candle with a big wick, and price came straight back. You can draw it to track the chart, but it is not a zone to trade.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.25, c: 159.8 },
            { o: 159.8, h: 160.23, l: 156.81, c: 157 },
            { o: 157, h: 157.47, l: 154.08, c: 154.6 },
            { o: 154.6, h: 154.77, l: 151.43, c: 152 },
            { o: 152, h: 152.7, l: 151.5, c: 152.3 },
            { o: 152.3, h: 156.1, l: 152.1, c: 154.5 },
            { o: 154.5, h: 155.8, l: 154.1, c: 155.3 },
            { o: 155.3, h: 155.88, l: 153.9, c: 154.3 },
            { o: 154.3, h: 154.65, l: 153.06, c: 153.4 },
            { o: 153.4, h: 153.7, l: 150.5, c: 150.9 },
            { o: 150.9, h: 151.18, l: 148.41, c: 148.9 },
            { o: 148.9, h: 149.13, l: 146.86, c: 147.3 },
            { o: 147.3, h: 148.29, l: 147.07, c: 147.8 },
            { o: 147.8, h: 148.15, l: 145.24, c: 145.6 },
            { o: 145.6, h: 145.83, l: 144, c: 144.2 },
            { o: 144.2, h: 144.78, l: 142.64, c: 143 }
          ],
          zones: [
            {
              from: 4,
              top: 152.3,
              bottom: 151.5,
              kind: "demand",
              label: "weak - drawable only",
              faded: true
            }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "weak move away"
          }
        }
      },
      {
        title: "Edge from higher timeframes",
        narration: "A zone that removed nothing can still be traded if it looks good AND it sits inside a higher-timeframe zone (for example a 1-hour demand inside a daily demand). That top-down view is where his edge comes from.",
        scene: {
          candles: [
            { o: 158, h: 158.15, l: 155.44, c: 155.6 },
            { o: 155.6, h: 155.92, l: 152.1, c: 152.5 },
            { o: 152.5, h: 152.76, l: 150.13, c: 150.3 },
            { o: 150.3, h: 150.49, l: 146.47, c: 146.9 },
            { o: 146.9, h: 147.33, l: 143.93, c: 144.3 },
            { o: 144.3, h: 145, l: 143.85, c: 144.65 },
            { o: 144.65, h: 144.95, l: 143.65, c: 144.25 },
            { o: 144.25, h: 145, l: 143.9, c: 144.55 },
            { o: 144.55, h: 151.7, l: 144.35, c: 151.35 },
            { o: 151.35, h: 157.35, l: 151.05, c: 156.95 },
            { o: 156.95, h: 159.07, l: 156.37, c: 158.55 },
            { o: 158.55, h: 160.85, l: 158.04, c: 160.65 },
            { o: 160.65, h: 160.9, l: 159.52, c: 159.75 },
            { o: 159.75, h: 161.8, l: 159.52, c: 161.45 },
            { o: 161.45, h: 161.97, l: 159.86, c: 160.25 },
            { o: 160.25, h: 161.97, l: 159.74, c: 161.55 },
            { o: 161.55, h: 161.95, l: 160.62, c: 160.95 },
            { o: 160.95, h: 161.15, l: 157.73, c: 157.93 },
            { o: 157.93, h: 158.34, l: 154.51, c: 154.72 },
            { o: 154.72, h: 155.11, l: 152, c: 152.17 },
            { o: 152.17, h: 152.74, l: 148.35, c: 148.75 },
            { o: 148.75, h: 149.15, l: 145.62, c: 145.95 },
            { o: 145.95, h: 146.25, l: 144.2, c: 145.35 },
            { o: 145.35, h: 148.36, l: 145.02, c: 147.85 },
            { o: 147.85, h: 151.51, l: 147.43, c: 151.05 },
            { o: 151.05, h: 153.88, l: 150.75, c: 153.45 },
            { o: 153.45, h: 154.04, l: 152.2, c: 152.65 },
            { o: 152.65, h: 155.94, l: 152.34, c: 155.55 },
            { o: 155.55, h: 158.02, l: 155.38, c: 157.75 }
          ],
          zones: [
            {
              from: 0,
              top: 148.65,
              bottom: 140.65,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 144.65,
              bottom: 143.65,
              kind: "demand",
              label: "1H demand"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What makes a zone the highest quality?",
        options: [
          "It is very wide",
          "It removed an opposing zone or a trend line",
          "It has many indicators agreeing",
          "It formed on a Monday"
        ],
        answer: 1,
        explain: "If a demand zone broke a supply zone (or a trend line), it proved it was stronger. That is the top-quality zone."
      },
      {
        type: "tf",
        q: "No zone on the daily chart means there is no zone on the 5-minute chart there.",
        answer: false,
        explain: "Supply and demand exists on every timeframe. A lower timeframe can have a zone where the daily has none."
      },
      {
        type: "spot",
        q: "Click the demand basing that removed the supply zone.",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply"
            }
          ]
        },
        answer: {
          from: 10,
          to: 12
        },
        explain: "The move that broke the supply started from this pause. Something had to remove the supply: this demand did."
      },
      {
        type: "mcq",
        q: "A zone with one basing candle, a move away that is only about a half-size candle, and price coming straight back is...",
        options: [
          "Highest quality",
          "Tradable",
          "Drawable only, not tradable",
          "A trend line"
        ],
        answer: 2,
        explain: "Weak move away and little time away are low-quality signs. Draw it to track the chart, but do not trade it."
      },
      {
        type: "tf",
        q: "Wide boxes drawn straight across from a random old price are supply and demand zones.",
        answer: false,
        explain: "That is support/resistance. Real zones are tightly based: lines wrapped around the basing candles."
      },
      {
        type: "tf",
        q: "Supply and demand is traded on pure price action, with no indicators.",
        answer: true,
        explain: "Right. He uses no indicators: just the candles and the zones."
      },
      {
        type: "order",
        q: "Rank from best to worst.",
        items: [
          "Clean basing, strong move away, removed a supply zone",
          "Clean basing, strong move away, inside a higher-timeframe zone",
          "One-candle base, half-size move away, price came straight back"
        ],
        explain: "Removing a zone is top quality. A good-looking zone inside a higher-timeframe zone is still tradable. The weak one is drawable only."
      }
    ],
    practice: [
      {
        prompt: "This demand zone broke the supply above it. Price is now pulling back. What do you do?",
        scene: {
          candles: [
            { o: 150, h: 151.95, l: 149.51, c: 151.8 },
            { o: 151.8, h: 154.54, l: 151.37, c: 154 },
            { o: 154, h: 155.83, l: 153.58, c: 155.6 },
            { o: 155.6, h: 156.3, l: 155.3, c: 155.9 },
            { o: 155.9, h: 156.4, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.85, l: 149.65, c: 150.05 },
            { o: 150.05, h: 150.35, l: 145.35, c: 145.85 },
            { o: 145.85, h: 146.44, l: 144.38, c: 144.65 },
            { o: 144.65, h: 144.92, l: 143.42, c: 143.85 },
            { o: 143.85, h: 144.02, l: 142.19, c: 142.75 },
            { o: 142.75, h: 143.4, l: 142.25, c: 143.05 },
            { o: 143.05, h: 143.35, l: 142.1, c: 142.7 },
            { o: 142.7, h: 143.35, l: 142.3, c: 142.95 },
            { o: 142.95, h: 147.75, l: 142.75, c: 147.45 },
            { o: 147.45, h: 151.95, l: 147.15, c: 151.65 },
            { o: 151.65, h: 155.85, l: 151.35, c: 155.45 },
            { o: 155.45, h: 157.2, l: 154.97, c: 156.85 },
            { o: 156.85, h: 157.06, l: 155.94, c: 156.15 },
            { o: 156.15, h: 157.94, l: 155.93, c: 157.75 },
            { o: 157.75, h: 158.82, l: 157.42, c: 158.65 },
            { o: 158.65, h: 159.15, l: 157.81, c: 158.15 },
            { o: 158.15, h: 158.54, l: 155.27, c: 155.77 },
            { o: 155.77, h: 156.34, l: 152.82, c: 153.3 },
            { o: 153.3, h: 153.78, l: 151.12, c: 151.32 },
            { o: 151.32, h: 151.7, l: 148.04, c: 148.64 },
            { o: 148.64, h: 149.19, l: 146.27, c: 146.55 },
            { o: 146.55, h: 147.1, l: 143.73, c: 144.25 },
            { o: 144.25, h: 144.55, l: 142.67, c: 143.65 },
            { o: 143.65, h: 146.7, l: 143.42, c: 146.25 },
            { o: 146.25, h: 149.69, l: 146.02, c: 149.25 },
            { o: 149.25, h: 151.97, l: 148.79, c: 151.45 },
            { o: 151.45, h: 154.54, l: 151.18, c: 154.15 }
          ],
          zones: [
            {
              from: 3,
              top: 156.4,
              bottom: 155.55,
              kind: "supply",
              to: 16,
              label: "Supply removed",
              faded: true
            },
            {
              from: 10,
              top: 143.05,
              bottom: 142.1,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 27
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The demand removed an opposing supply zone, has clean basing and a strong move away. That is the highest-quality zone, and price pushed up from it."
      },
      {
        prompt: "A single-candle pause, then a weak half-size move up. Price came right back. Trade it?",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.25, c: 159.8 },
            { o: 159.8, h: 160.23, l: 156.81, c: 157 },
            { o: 157, h: 157.47, l: 154.08, c: 154.6 },
            { o: 154.6, h: 154.77, l: 151.43, c: 152 },
            { o: 152, h: 152.7, l: 151.5, c: 152.3 },
            { o: 152.3, h: 156.1, l: 152.1, c: 154.5 },
            { o: 154.5, h: 155.8, l: 154.1, c: 155.3 },
            { o: 155.3, h: 155.88, l: 153.9, c: 154.3 },
            { o: 154.3, h: 154.65, l: 153.06, c: 153.4 },
            { o: 153.4, h: 153.7, l: 150.5, c: 150.9 },
            { o: 150.9, h: 151.18, l: 148.41, c: 148.9 },
            { o: 148.9, h: 149.13, l: 146.86, c: 147.3 },
            { o: 147.3, h: 148.29, l: 147.07, c: 147.8 },
            { o: 147.8, h: 148.15, l: 145.24, c: 145.6 },
            { o: 145.6, h: 145.83, l: 144, c: 144.2 },
            { o: 144.2, h: 144.78, l: 142.64, c: 143 }
          ],
          zones: [
            {
              from: 4,
              top: 152.3,
              bottom: 151.5,
              kind: "demand",
              label: "Zone?"
            }
          ],
          reveal: 9
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Weak move away and almost no time away: drawable only. Price sliced straight through. Skipping was right."
      }
    ],
    cards: [
      {
        front: "Highest-quality zone?",
        back: "One that removed an opposing zone or a trend line."
      },
      {
        front: "Tradable zone needs...?",
        back: "Clean basing + strong move away."
      },
      {
        front: "Drawable-only signs?",
        back: "Poor move away (~50% candle), huge wick, little time away."
      },
      {
        front: "What happens to a broken zone?",
        back: "It is violated and removed. It is no longer valid."
      },
      {
        front: "Does time away matter?",
        back: "Yes. The longer price stayed away before returning, the better."
      },
      {
        front: "Indicators in S&D?",
        back: "None. Pure price action."
      },
      {
        front: "Zone removed nothing - can I trade it?",
        back: "Yes, if it looks good and sits inside a higher-timeframe zone."
      }
    ],
    mnemonic: "Clean, Strong, Away: clean basing, strong move, stayed away long."
  },
  {
    mentor: "kevin-course",
    n: 3,
    eli5: {
      oneLiner: "The far line goes on the wick tip. The near line is your choice.",
      story: "Think of drawing a fence around a sleeping puppy. The back of the fence must go behind its tail, even the very tip, or the puppy is not fully inside. That is the distal line: it always includes the wick. The front gate (the proximal line) you can place a little closer or further. A close gate means a small, tight pen. A far gate means a bigger pen that is easier to walk into.",
      analogy: "Distal is the wall behind you, proximal is the door in front. The wall is fixed. The door you can move."
    },
    bigIdeas: [
      "Distal line (furthest away) = extreme wick of the basing. Always include the wick.",
      "Proximal line (near side) is subjective: smaller zone = better R:R but fewer fills; bigger zone = more fills, smaller R:R.",
      "Keep zones on one timeframe similar in size. An oversized zone can be cut in half."
    ],
    steps: [
      {
        title: "Find the basing and the move away",
        narration: "Drop, then two or three small basing candles, then the big green move away. The move away tells us there is demand. Now we wrap lines around the basing.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.42, c: 159.6 },
            { o: 159.6, h: 159.94, l: 156.25, c: 156.5 },
            { o: 156.5, h: 156.88, l: 153.8, c: 154.3 },
            { o: 154.3, h: 154.66, l: 150.73, c: 150.9 },
            { o: 150.9, h: 151.08, l: 147.71, c: 148.3 },
            { o: 148.3, h: 149, l: 147.85, c: 148.65 },
            { o: 148.65, h: 148.95, l: 146.35, c: 148.25 },
            { o: 148.25, h: 149, l: 147.9, c: 148.55 },
            { o: 148.55, h: 155.7, l: 148.35, c: 155.35 },
            { o: 155.35, h: 161.35, l: 155.05, c: 160.95 },
            { o: 160.95, h: 163.1, l: 160.75, c: 162.55 },
            { o: 162.55, h: 165.14, l: 162.37, c: 164.65 },
            { o: 164.65, h: 165.1, l: 163.41, c: 163.75 },
            { o: 163.75, h: 165.96, l: 163.49, c: 165.45 },
            { o: 165.45, h: 166, l: 164.07, c: 164.25 },
            { o: 164.25, h: 166.12, l: 163.97, c: 165.55 },
            { o: 165.55, h: 165.82, l: 164.42, c: 164.95 },
            { o: 164.95, h: 165.25, l: 161.28, c: 161.82 },
            { o: 161.82, h: 162.37, l: 158.35, c: 158.84 },
            { o: 158.84, h: 159.27, l: 155.6, c: 155.81 },
            { o: 155.81, h: 156.33, l: 152.71, c: 152.94 },
            { o: 152.94, h: 153.37, l: 149.6, c: 149.95 },
            { o: 149.95, h: 150.25, l: 147.62, c: 149.35 },
            { o: 149.35, h: 152.32, l: 149.05, c: 151.85 },
            { o: 151.85, h: 155.5, l: 151.49, c: 155.05 },
            { o: 155.05, h: 157.78, l: 154.74, c: 157.45 },
            { o: 157.45, h: 157.69, l: 156.39, c: 156.65 },
            { o: 156.65, h: 159.96, l: 156.31, c: 159.55 },
            { o: 159.55, h: 162.1, l: 159.16, c: 161.75 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          }
        }
      },
      {
        title: "Distal line: the lowest wick",
        narration: "For demand, the distal line is at the bottom: the lowest low of the basing, wick included. See that long wick? It must be inside the zone. Leaving it out is a common mistake. Use the magnet tool to snap to it exactly.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.42, c: 159.6 },
            { o: 159.6, h: 159.94, l: 156.25, c: 156.5 },
            { o: 156.5, h: 156.88, l: 153.8, c: 154.3 },
            { o: 154.3, h: 154.66, l: 150.73, c: 150.9 },
            { o: 150.9, h: 151.08, l: 147.71, c: 148.3 },
            { o: 148.3, h: 149, l: 147.85, c: 148.65 },
            { o: 148.65, h: 148.95, l: 146.35, c: 148.25 },
            { o: 148.25, h: 149, l: 147.9, c: 148.55 },
            { o: 148.55, h: 155.7, l: 148.35, c: 155.35 },
            { o: 155.35, h: 161.35, l: 155.05, c: 160.95 },
            { o: 160.95, h: 163.1, l: 160.75, c: 162.55 },
            { o: 162.55, h: 165.14, l: 162.37, c: 164.65 },
            { o: 164.65, h: 165.1, l: 163.41, c: 163.75 },
            { o: 163.75, h: 165.96, l: 163.49, c: 165.45 },
            { o: 165.45, h: 166, l: 164.07, c: 164.25 },
            { o: 164.25, h: 166.12, l: 163.97, c: 165.55 },
            { o: 165.55, h: 165.82, l: 164.42, c: 164.95 },
            { o: 164.95, h: 165.25, l: 161.28, c: 161.82 },
            { o: 161.82, h: 162.37, l: 158.35, c: 158.84 },
            { o: 158.84, h: 159.27, l: 155.6, c: 155.81 },
            { o: 155.81, h: 156.33, l: 152.71, c: 152.94 },
            { o: 152.94, h: 153.37, l: 149.6, c: 149.95 },
            { o: 149.95, h: 150.25, l: 147.62, c: 149.35 },
            { o: 149.35, h: 152.32, l: 149.05, c: 151.85 },
            { o: 151.85, h: 155.5, l: 151.49, c: 155.05 },
            { o: 155.05, h: 157.78, l: 154.74, c: 157.45 },
            { o: 157.45, h: 157.69, l: 156.39, c: 156.65 },
            { o: 156.65, h: 159.96, l: 156.31, c: 159.55 },
            { o: 159.55, h: 162.1, l: 159.16, c: 161.75 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          },
          lines: [
            {
              y: 146.35,
              label: "distal (lowest wick)",
              kind: "distal",
              from: 5
            }
          ],
          notes: [
            {
              x: 6,
              y: 145.35,
              text: "Include this wick"
            }
          ]
        }
      },
      {
        title: "Proximal line: top of the basing body",
        narration: "For demand, the proximal line is the top. Usually he puts it on the top of a basing candle body. That part is your choice.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.42, c: 159.6 },
            { o: 159.6, h: 159.94, l: 156.25, c: 156.5 },
            { o: 156.5, h: 156.88, l: 153.8, c: 154.3 },
            { o: 154.3, h: 154.66, l: 150.73, c: 150.9 },
            { o: 150.9, h: 151.08, l: 147.71, c: 148.3 },
            { o: 148.3, h: 149, l: 147.85, c: 148.65 },
            { o: 148.65, h: 148.95, l: 146.35, c: 148.25 },
            { o: 148.25, h: 149, l: 147.9, c: 148.55 },
            { o: 148.55, h: 155.7, l: 148.35, c: 155.35 },
            { o: 155.35, h: 161.35, l: 155.05, c: 160.95 },
            { o: 160.95, h: 163.1, l: 160.75, c: 162.55 },
            { o: 162.55, h: 165.14, l: 162.37, c: 164.65 },
            { o: 164.65, h: 165.1, l: 163.41, c: 163.75 },
            { o: 163.75, h: 165.96, l: 163.49, c: 165.45 },
            { o: 165.45, h: 166, l: 164.07, c: 164.25 },
            { o: 164.25, h: 166.12, l: 163.97, c: 165.55 },
            { o: 165.55, h: 165.82, l: 164.42, c: 164.95 },
            { o: 164.95, h: 165.25, l: 161.28, c: 161.82 },
            { o: 161.82, h: 162.37, l: 158.35, c: 158.84 },
            { o: 158.84, h: 159.27, l: 155.6, c: 155.81 },
            { o: 155.81, h: 156.33, l: 152.71, c: 152.94 },
            { o: 152.94, h: 153.37, l: 149.6, c: 149.95 },
            { o: 149.95, h: 150.25, l: 147.62, c: 149.35 },
            { o: 149.35, h: 152.32, l: 149.05, c: 151.85 },
            { o: 151.85, h: 155.5, l: 151.49, c: 155.05 },
            { o: 155.05, h: 157.78, l: 154.74, c: 157.45 },
            { o: 157.45, h: 157.69, l: 156.39, c: 156.65 },
            { o: 156.65, h: 159.96, l: 156.31, c: 159.55 },
            { o: 159.55, h: 162.1, l: 159.16, c: 161.75 }
          ],
          lines: [
            {
              y: 146.35,
              label: "distal",
              kind: "distal",
              from: 5
            },
            {
              y: 148.65,
              label: "proximal (body top)",
              kind: "proximal",
              from: 5
            }
          ]
        }
      },
      {
        title: "The zone",
        narration: "Now fill in between the two lines. That is the demand zone. If the body version is tiny, you can use the wick top for the proximal instead.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.42, c: 159.6 },
            { o: 159.6, h: 159.94, l: 156.25, c: 156.5 },
            { o: 156.5, h: 156.88, l: 153.8, c: 154.3 },
            { o: 154.3, h: 154.66, l: 150.73, c: 150.9 },
            { o: 150.9, h: 151.08, l: 147.71, c: 148.3 },
            { o: 148.3, h: 149, l: 147.85, c: 148.65 },
            { o: 148.65, h: 148.95, l: 146.35, c: 148.25 },
            { o: 148.25, h: 149, l: 147.9, c: 148.55 },
            { o: 148.55, h: 155.7, l: 148.35, c: 155.35 },
            { o: 155.35, h: 161.35, l: 155.05, c: 160.95 },
            { o: 160.95, h: 163.1, l: 160.75, c: 162.55 },
            { o: 162.55, h: 165.14, l: 162.37, c: 164.65 },
            { o: 164.65, h: 165.1, l: 163.41, c: 163.75 },
            { o: 163.75, h: 165.96, l: 163.49, c: 165.45 },
            { o: 165.45, h: 166, l: 164.07, c: 164.25 },
            { o: 164.25, h: 166.12, l: 163.97, c: 165.55 },
            { o: 165.55, h: 165.82, l: 164.42, c: 164.95 },
            { o: 164.95, h: 165.25, l: 161.28, c: 161.82 },
            { o: 161.82, h: 162.37, l: 158.35, c: 158.84 },
            { o: 158.84, h: 159.27, l: 155.6, c: 155.81 },
            { o: 155.81, h: 156.33, l: 152.71, c: 152.94 },
            { o: 152.94, h: 153.37, l: 149.6, c: 149.95 },
            { o: 149.95, h: 150.25, l: 147.62, c: 149.35 },
            { o: 149.35, h: 152.32, l: 149.05, c: 151.85 },
            { o: 151.85, h: 155.5, l: 151.49, c: 155.05 },
            { o: 155.05, h: 157.78, l: 154.74, c: 157.45 },
            { o: 157.45, h: 157.69, l: 156.39, c: 156.65 },
            { o: 156.65, h: 159.96, l: 156.31, c: 159.55 },
            { o: 159.55, h: 162.1, l: 159.16, c: 161.75 }
          ],
          zones: [
            {
              from: 5,
              top: 148.65,
              bottom: 146.35,
              kind: "demand",
              label: "Demand (PV / DBR)"
            }
          ],
          lines: [
            {
              y: 149,
              label: "wick option (bigger zone)",
              kind: "level",
              from: 5
            }
          ]
        }
      },
      {
        title: "Supply is the opposite",
        narration: "For supply the distal is on top (highest wick of the basing) and the proximal is at the bottom (a basing body). Same rules, flipped.",
        scene: {
          candles: [
            { o: 140, h: 142.7, l: 139.85, c: 142.4 },
            { o: 142.4, h: 145.71, l: 141.83, c: 145.5 },
            { o: 145.5, h: 147.95, l: 145.09, c: 147.7 },
            { o: 147.7, h: 151.43, l: 147.3, c: 151.1 },
            { o: 151.1, h: 154.23, l: 150.76, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.26, l: 139, c: 139.45 },
            { o: 139.45, h: 139.66, l: 137.01, c: 137.35 },
            { o: 137.35, h: 138.62, l: 136.86, c: 138.25 },
            { o: 138.25, h: 138.51, l: 136.33, c: 136.55 },
            { o: 136.55, h: 137.99, l: 136.11, c: 137.75 },
            { o: 137.75, h: 138.2, l: 135.95, c: 136.45 },
            { o: 136.45, h: 137.52, l: 136.1, c: 137.05 },
            { o: 137.05, h: 140, l: 136.73, c: 139.84 },
            { o: 139.84, h: 143.22, l: 139.36, c: 143.01 },
            { o: 143.01, h: 146.73, l: 142.79, c: 146.28 },
            { o: 146.28, h: 149.54, l: 146, c: 149.02 },
            { o: 149.02, h: 152.63, l: 148.48, c: 152.05 },
            { o: 152.05, h: 153.8, l: 151.75, c: 152.65 },
            { o: 152.65, h: 152.83, l: 149.68, c: 150.15 },
            { o: 150.15, h: 150.49, l: 146.73, c: 146.95 },
            { o: 146.95, h: 147.49, l: 144.02, c: 144.55 },
            { o: 144.55, h: 145.68, l: 144.17, c: 145.35 },
            { o: 145.35, h: 145.59, l: 141.92, c: 142.45 },
            { o: 142.45, h: 142.78, l: 139.65, c: 140.25 }
          ],
          zones: [
            {
              from: 5,
              top: 154.35,
              bottom: 153.35,
              kind: "supply",
              label: "Supply (PV / RBD)"
            }
          ],
          lines: [
            {
              y: 154.35,
              label: "distal (highest wick)",
              kind: "distal",
              from: 5
            },
            {
              y: 153.35,
              label: "proximal",
              kind: "proximal",
              from: 5
            }
          ]
        }
      },
      {
        title: "Too big? Cut it in half",
        narration: "A wide basing makes a big zone. Do not ignore the big candles: distal stays at the far low. If the zone is much larger than your others, you can cut it in half. It looks weird, but it turns about 3:1 into about 4:1 or 5:1.",
        scene: {
          candles: [
            { o: 165, h: 165.15, l: 162.24, c: 162.6 },
            { o: 162.6, h: 163.06, l: 159.08, c: 159.5 },
            { o: 159.5, h: 159.7, l: 156.95, c: 157.3 },
            { o: 157.3, h: 157.72, l: 153.71, c: 153.9 },
            { o: 153.9, h: 154.09, l: 150.8, c: 151.3 },
            { o: 151.3, h: 151.7, l: 149, c: 149.5 },
            { o: 149.5, h: 150.7, l: 148.9, c: 150.4 },
            { o: 150.4, h: 151.9, l: 150.1, c: 151.5 },
            { o: 151.5, h: 152.6, l: 151.1, c: 152.3 },
            { o: 152.3, h: 159.45, l: 152.1, c: 159.1 },
            { o: 159.1, h: 165.1, l: 158.8, c: 164.7 },
            { o: 164.7, h: 166.47, l: 164.25, c: 166.3 },
            { o: 166.3, h: 168.66, l: 166.07, c: 168.4 },
            { o: 168.4, h: 168.92, l: 167.35, c: 167.5 },
            { o: 167.5, h: 169.72, l: 167.23, c: 169.2 },
            { o: 169.2, h: 169.37, l: 167.73, c: 168 },
            { o: 168, h: 169.54, l: 167.69, c: 169.3 },
            { o: 169.3, h: 169.46, l: 168.26, c: 168.7 },
            { o: 168.7, h: 169.26, l: 165.61, c: 165.81 },
            { o: 165.81, h: 166.02, l: 162, c: 162.53 },
            { o: 162.53, h: 163.09, l: 159.3, c: 159.87 },
            { o: 159.87, h: 160.03, l: 156.45, c: 156.68 },
            { o: 156.68, h: 157.06, l: 153.13, c: 153.6 },
            { o: 153.6, h: 153.9, l: 150.77, c: 153 },
            { o: 153, h: 155.96, l: 152.66, c: 155.5 },
            { o: 155.5, h: 159.03, l: 155.17, c: 158.7 },
            { o: 158.7, h: 161.51, l: 158.27, c: 161.1 },
            { o: 161.1, h: 161.32, l: 159.94, c: 160.3 },
            { o: 160.3, h: 163.56, l: 160.11, c: 163.2 },
            { o: 163.2, h: 165.67, l: 162.67, c: 165.4 }
          ],
          zones: [
            {
              from: 5,
              top: 152.3,
              bottom: 148.9,
              kind: "demand",
              label: "full zone",
              faded: true
            },
            {
              from: 5,
              top: 150.6,
              bottom: 148.9,
              kind: "demand",
              label: "cut in half"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "For a demand zone, where does the distal line go?",
        options: [
          "Top of the basing bodies",
          "Lowest wick of the basing",
          "Middle of the big green candle",
          "Any round number"
        ],
        answer: 1,
        explain: "Distal = the line furthest away. For demand that is the bottom: the extreme low, wick included."
      },
      {
        type: "tf",
        q: "It is fine to leave a long basing wick outside the zone.",
        answer: false,
        explain: "Always include the wick on the distal side. Leaving it out is the mistake he sees most."
      },
      {
        type: "spot",
        q: "Click the candle whose wick sets the distal line.",
        scene: {
          candles: [
            { o: 162, h: 162.15, l: 159.42, c: 159.6 },
            { o: 159.6, h: 159.94, l: 156.25, c: 156.5 },
            { o: 156.5, h: 156.88, l: 153.8, c: 154.3 },
            { o: 154.3, h: 154.66, l: 150.73, c: 150.9 },
            { o: 150.9, h: 151.08, l: 147.71, c: 148.3 },
            { o: 148.3, h: 149, l: 147.85, c: 148.65 },
            { o: 148.65, h: 148.95, l: 146.35, c: 148.25 },
            { o: 148.25, h: 149, l: 147.9, c: 148.55 },
            { o: 148.55, h: 155.7, l: 148.35, c: 155.35 },
            { o: 155.35, h: 161.35, l: 155.05, c: 160.95 },
            { o: 160.95, h: 163.1, l: 160.75, c: 162.55 },
            { o: 162.55, h: 165.14, l: 162.37, c: 164.65 },
            { o: 164.65, h: 165.1, l: 163.41, c: 163.75 },
            { o: 163.75, h: 165.96, l: 163.49, c: 165.45 },
            { o: 165.45, h: 166, l: 164.07, c: 164.25 },
            { o: 164.25, h: 166.12, l: 163.97, c: 165.55 },
            { o: 165.55, h: 165.82, l: 164.42, c: 164.95 },
            { o: 164.95, h: 165.25, l: 161.28, c: 161.82 },
            { o: 161.82, h: 162.37, l: 158.35, c: 158.84 },
            { o: 158.84, h: 159.27, l: 155.6, c: 155.81 },
            { o: 155.81, h: 156.33, l: 152.71, c: 152.94 },
            { o: 152.94, h: 153.37, l: 149.6, c: 149.95 },
            { o: 149.95, h: 150.25, l: 147.62, c: 149.35 },
            { o: 149.35, h: 152.32, l: 149.05, c: 151.85 },
            { o: 151.85, h: 155.5, l: 151.49, c: 155.05 },
            { o: 155.05, h: 157.78, l: 154.74, c: 157.45 },
            { o: 157.45, h: 157.69, l: 156.39, c: 156.65 },
            { o: 156.65, h: 159.96, l: 156.31, c: 159.55 },
            { o: 159.55, h: 162.1, l: 159.16, c: 161.75 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          }
        },
        answer: {
          from: 6,
          to: 6
        },
        explain: "The distal line goes on the lowest low of the basing candles. This candle has the deepest wick."
      },
      {
        type: "mcq",
        q: "You draw a very tiny zone. What happens?",
        options: [
          "Better R:R, but fewer fills and more losses",
          "More fills and bigger R:R",
          "Nothing changes",
          "The zone becomes highest quality"
        ],
        answer: 0,
        explain: "A tiny zone makes the same move look like 13:1, but price fills it less and stops you out more. No free lunch."
      },
      {
        type: "mcq",
        q: "What does he call Rally-Base-Rally and Drop-Base-Drop zones?",
        options: [
          "PV zones",
          "CP zones",
          "S/R zones",
          "Momentum zones"
        ],
        answer: 1,
        explain: "CP = continuation pattern. DBR and RBD are PV = peaks and valleys."
      },
      {
        type: "order",
        q: "Drawing a demand zone: put it in order.",
        items: [
          "Spot the big move away",
          "Find the basing candles at its origin",
          "Snap the distal line to the lowest wick",
          "Place the proximal on a basing body (or wick)",
          "Check the size matches your other zones"
        ],
        explain: "Move away identifies demand, then wrap the lines around the basing, distal first because it is the objective one."
      },
      {
        type: "tf",
        q: "Zones on the same timeframe should look roughly the same size.",
        answer: true,
        explain: "Copy the size of a properly drawn zone. 33 and 43 pips are similar; 79 pips next to them is too big."
      }
    ],
    practice: [
      {
        prompt: "Draw this demand zone. Where are the proximal (top) and distal (bottom) lines?",
        scene: {
          candles: [
            { o: 128, h: 130.35, l: 127.76, c: 130.2 },
            { o: 130.2, h: 133.23, l: 129.75, c: 133 },
            { o: 133, h: 135.17, l: 132.85, c: 135 },
            { o: 135, h: 137.98, l: 134.52, c: 137.6 },
            { o: 137.6, h: 139.88, l: 137.04, c: 139.4 },
            { o: 139.4, h: 140.1, l: 138.95, c: 139.75 },
            { o: 139.75, h: 140.05, l: 138.75, c: 139.35 },
            { o: 139.35, h: 140.1, l: 139, c: 139.65 },
            { o: 139.65, h: 146.8, l: 139.45, c: 146.45 },
            { o: 146.45, h: 152.45, l: 146.15, c: 152.05 },
            { o: 152.05, h: 153.92, l: 151.62, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.45, c: 155.75 },
            { o: 155.75, h: 156.22, l: 154.27, c: 154.85 },
            { o: 154.85, h: 156.91, l: 154.59, c: 156.55 },
            { o: 156.55, h: 156.82, l: 155.14, c: 155.35 },
            { o: 155.35, h: 156.96, l: 154.76, c: 156.65 },
            { o: 156.65, h: 157.18, l: 155.55, c: 156.05 },
            { o: 156.05, h: 156.59, l: 152.26, c: 152.84 },
            { o: 152.84, h: 153.13, l: 149.92, c: 150.26 },
            { o: 150.26, h: 150.59, l: 146.54, c: 146.87 },
            { o: 146.87, h: 147.27, l: 143.68, c: 144.06 },
            { o: 144.06, h: 144.32, l: 140.81, c: 141.05 },
            { o: 141.05, h: 141.35, l: 139.3, c: 140.45 },
            { o: 140.45, h: 143.42, l: 139.99, c: 142.95 },
            { o: 142.95, h: 146.71, l: 142.6, c: 146.15 },
            { o: 146.15, h: 148.76, l: 145.95, c: 148.55 },
            { o: 148.55, h: 149.08, l: 147.45, c: 147.75 },
            { o: 147.75, h: 150.9, l: 147.46, c: 150.65 },
            { o: 150.65, h: 153.33, l: 150.07, c: 152.85 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          },
          reveal: 22
        },
        task: "draw-zone",
        answer: {
          top: 139.75,
          bottom: 138.75
        },
        explain: "Distal = lowest wick of the basing, wick included. Proximal = top of the highest basing body. Then price pulled back into it and pushed up."
      },
      {
        prompt: "Draw this supply zone. Remember: it is flipped.",
        scene: {
          candles: [
            { o: 140, h: 142.7, l: 139.85, c: 142.4 },
            { o: 142.4, h: 145.71, l: 141.83, c: 145.5 },
            { o: 145.5, h: 147.95, l: 145.09, c: 147.7 },
            { o: 147.7, h: 151.43, l: 147.3, c: 151.1 },
            { o: 151.1, h: 154.23, l: 150.76, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.26, l: 139, c: 139.45 },
            { o: 139.45, h: 139.66, l: 137.01, c: 137.35 },
            { o: 137.35, h: 138.62, l: 136.86, c: 138.25 },
            { o: 138.25, h: 138.51, l: 136.33, c: 136.55 },
            { o: 136.55, h: 137.99, l: 136.11, c: 137.75 },
            { o: 137.75, h: 138.2, l: 135.95, c: 136.45 },
            { o: 136.45, h: 137.52, l: 136.1, c: 137.05 },
            { o: 137.05, h: 140, l: 136.73, c: 139.84 },
            { o: 139.84, h: 143.22, l: 139.36, c: 143.01 },
            { o: 143.01, h: 146.73, l: 142.79, c: 146.28 },
            { o: 146.28, h: 149.54, l: 146, c: 149.02 },
            { o: 149.02, h: 152.63, l: 148.48, c: 152.05 },
            { o: 152.05, h: 153.8, l: 151.75, c: 152.65 },
            { o: 152.65, h: 152.83, l: 149.68, c: 150.15 },
            { o: 150.15, h: 150.49, l: 146.73, c: 146.95 },
            { o: 146.95, h: 147.49, l: 144.02, c: 144.55 },
            { o: 144.55, h: 145.68, l: 144.17, c: 145.35 },
            { o: 145.35, h: 145.59, l: 141.92, c: 142.45 },
            { o: 142.45, h: 142.78, l: 139.65, c: 140.25 }
          ],
          highlight: {
            from: 5,
            to: 7,
            label: "basing"
          },
          reveal: 22
        },
        task: "draw-zone",
        answer: {
          top: 154.35,
          bottom: 153.35
        },
        explain: "For supply the distal is the top: the highest wick of the basing. The proximal is the bottom: the lowest basing body."
      }
    ],
    cards: [
      {
        front: "Distal line?",
        back: "The line furthest away: bottom for demand, top for supply."
      },
      {
        front: "Where does the distal line go?",
        back: "On the extreme wick of the basing. Always include the wick."
      },
      {
        front: "Proximal line?",
        back: "The near line, usually a basing body top (demand). It is subjective."
      },
      {
        front: "Small zone trade-off?",
        back: "Better R:R, but fewer fills and more losses."
      },
      {
        front: "Big zone trade-off?",
        back: "More fills, but smaller R:R."
      },
      {
        front: "PV zones?",
        back: "Peaks and valleys: DBR and RBD."
      },
      {
        front: "CP zones?",
        back: "Continuation patterns: RBR and DBD."
      },
      {
        front: "Oversized zone?",
        back: "Tighten it, or cut it in half (optional)."
      },
      {
        front: "Tool to hit the exact high/low?",
        back: "The magnet tool (hold Ctrl in TradingView)."
      }
    ],
    mnemonic: "Wall and Door: the distal wall sits on the wick tip; the proximal door you may move."
  },
  {
    mentor: "kevin-course",
    n: 4,
    eli5: {
      oneLiner: "Small zone inside a big zone of the same kind = better odds.",
      story: "A small fish swims inside a big school of fish going the same way. It is much safer than a small fish swimming alone toward a shark. On charts, a small entry zone inside a big higher-timeframe zone of the same type has the big crowd behind it. We buy small demand inside big demand. We do not buy inside big supply.",
      analogy: "Russian nesting dolls: the small doll (your entry zone) sits inside the big doll (the higher-timeframe zone). Same shape, same direction."
    },
    bigIdeas: [
      "Only take entry-timeframe zones that sit inside a higher-timeframe zone of the same direction.",
      "Pairs: 1m to 15m, 5m to H1, 15m to H4, H1 to Daily, H4 to Weekly. New traders pick ONE entry timeframe.",
      "Edge: find the HTF zone, refine the entry lower, then hold as long as possible."
    ],
    steps: [
      {
        title: "Pick your entry timeframe",
        narration: "Step one of a plan: choose ONE entry timeframe (ETF). Say 5 minutes. Its higher timeframe (HTF) is the 1-hour. This chart is the 5m.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ]
        }
      },
      {
        title: "Mark the HTF zones",
        narration: "On the 1-hour, mark the demand and supply zones. Here we copy them onto the 5m chart as big shaded boxes: H1 demand below, H1 supply above.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ],
          zones: [
            {
              from: 0,
              top: 150.15,
              bottom: 142.65,
              kind: "demand",
              label: "H1 demand (HTF)",
              faded: true
            },
            {
              from: 0,
              top: 168.23,
              bottom: 164.73,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            }
          ]
        }
      },
      {
        title: "Wait for price to reach the HTF zone",
        narration: "Now we wait. Price drops into the big H1 demand. Inside HTF demand we only look to BUY.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ],
          zones: [
            {
              from: 0,
              top: 150.15,
              bottom: 142.65,
              kind: "demand",
              label: "H1 demand (HTF)",
              faded: true
            },
            {
              from: 0,
              top: 168.23,
              bottom: 164.73,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            }
          ],
          highlight: {
            from: 0,
            to: 7,
            label: "into HTF demand"
          }
        }
      },
      {
        title: "A small zone inside the big zone",
        narration: "A 5m demand forms inside the H1 demand: a zone within a zone. That is the trade. We buy the pullback into the 5m zone.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ],
          zones: [
            {
              from: 0,
              top: 150.15,
              bottom: 142.65,
              kind: "demand",
              label: "H1 demand (HTF)",
              faded: true
            },
            {
              from: 0,
              top: 168.23,
              bottom: 164.73,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "5m demand (ETF)"
            }
          ],
          lines: [
            {
              y: 146.65,
              label: "buy",
              kind: "entry",
              from: 5
            }
          ]
        }
      },
      {
        title: "Hold toward the opposing HTF zone",
        narration: "We hold as long as possible: all the way to the H1 supply. A small entry with a far target is how the big R:R happens.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ],
          zones: [
            {
              from: 0,
              top: 150.15,
              bottom: 142.65,
              kind: "demand",
              label: "H1 demand (HTF)",
              faded: true
            },
            {
              from: 0,
              top: 168.23,
              bottom: 164.73,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "5m demand (ETF)"
            }
          ],
          lines: [
            {
              y: 146.65,
              label: "buy",
              kind: "entry",
              from: 5
            },
            {
              y: 164.73,
              label: "target: HTF supply",
              kind: "tp",
              from: 5
            }
          ]
        }
      },
      {
        title: "Do not buy inside HTF supply",
        narration: "Here a 5m demand formed INSIDE H1 supply. Buying it gave a tiny bounce at best, then price fell. We buy at demand. We do not buy at supply.",
        scene: {
          candles: [
            { o: 153, h: 155.35, l: 152.61, c: 155.2 },
            { o: 155.2, h: 158.48, l: 154.93, c: 158 },
            { o: 158, h: 160.32, l: 157.76, c: 160 },
            { o: 160, h: 163.19, l: 159.62, c: 162.6 },
            { o: 162.6, h: 164.79, l: 162.33, c: 164.4 },
            { o: 164.4, h: 165.1, l: 163.95, c: 164.75 },
            { o: 164.75, h: 165.05, l: 163.75, c: 164.35 },
            { o: 164.35, h: 165.1, l: 164, c: 164.65 },
            { o: 164.65, h: 171.8, l: 164.45, c: 171.45 },
            { o: 171.45, h: 177.45, l: 171.15, c: 177.05 },
            { o: 177.05, h: 178.85, l: 176.53, c: 178.65 },
            { o: 178.65, h: 181.31, l: 178.3, c: 180.75 },
            { o: 180.75, h: 181.01, l: 179.59, c: 179.85 },
            { o: 179.85, h: 181.78, l: 179.55, c: 181.55 },
            { o: 181.55, h: 181.75, l: 179.84, c: 180.35 },
            { o: 180.35, h: 182.04, l: 179.82, c: 181.65 },
            { o: 181.65, h: 182.13, l: 180.86, c: 181.05 },
            { o: 181.05, h: 181.26, l: 177.53, c: 178.07 },
            { o: 178.07, h: 178.43, l: 174.68, c: 175.03 },
            { o: 175.03, h: 175.19, l: 171.76, c: 171.92 },
            { o: 171.92, h: 172.48, l: 168.79, c: 169.3 },
            { o: 169.3, h: 169.71, l: 165.55, c: 166.05 },
            { o: 166.05, h: 166.35, l: 164.35, c: 165.25 },
            { o: 165.25, h: 166.78, l: 164.95, c: 166.35 },
            { o: 166.35, h: 166.67, l: 164.28, c: 164.55 },
            { o: 164.55, h: 164.86, l: 161.71, c: 162.15 },
            { o: 162.15, h: 162.46, l: 159.88, c: 160.05 },
            { o: 160.05, h: 160.44, l: 158.33, c: 158.55 }
          ],
          zones: [
            {
              from: 0,
              top: 183.63,
              bottom: 161.75,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 164.75,
              bottom: 163.75,
              kind: "demand",
              label: "5m demand inside HTF supply"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Your entry timeframe is 15 minutes. What is the HTF?",
        options: [
          "1 hour",
          "4 hour",
          "Daily",
          "Weekly"
        ],
        answer: 1,
        explain: "His pairs: 1m-15m, 5m-H1, 15m-H4, H1-Daily, H4-Weekly."
      },
      {
        type: "tf",
        q: "Inside a higher-timeframe demand zone you can happily sell 5m supply zones.",
        answer: false,
        explain: "We buy at demand. We do not sell at demand. Those sells usually give only about 1:1 or 2:1."
      },
      {
        type: "spot",
        q: "Two 5m demand zones. Click the one that sits inside the HTF demand.",
        scene: {
          candles: [
            { o: 185, h: 185.15, l: 182.55, c: 183 },
            { o: 183, h: 183.37, l: 180.03, c: 180.5 },
            { o: 180.5, h: 181.1, l: 180.1, c: 180.8 },
            { o: 180.8, h: 181.1, l: 180.1, c: 180.5 },
            { o: 180.5, h: 184.3, l: 180.3, c: 184 },
            { o: 184, h: 185.76, l: 183.66, c: 185.2 },
            { o: 185.2, h: 185.36, l: 183.46, c: 183.7 },
            { o: 183.7, h: 183.94, l: 180.66, c: 180.9 },
            { o: 180.9, h: 181.27, l: 177.5, c: 177.8 },
            { o: 177.8, h: 178.28, l: 174.03, c: 174.4 },
            { o: 174.4, h: 174.68, l: 171, c: 171.5 },
            { o: 171.5, h: 172.04, l: 168, c: 168.3 },
            { o: 168.3, h: 168.67, l: 165.16, c: 165.7 },
            { o: 165.7, h: 166.3, l: 165.3, c: 166 },
            { o: 166, h: 166.3, l: 165.15, c: 165.65 },
            { o: 165.65, h: 166.25, l: 165.35, c: 165.95 },
            { o: 165.95, h: 171.45, l: 165.75, c: 171.15 },
            { o: 171.15, h: 175.95, l: 170.85, c: 175.55 },
            { o: 175.55, h: 177.53, l: 175.16, c: 176.95 },
            { o: 176.95, h: 177.25, l: 176, c: 176.15 },
            { o: 176.15, h: 177.67, l: 175.7, c: 177.35 }
          ],
          zones: [
            {
              from: 0,
              top: 169,
              bottom: 162.65,
              kind: "demand",
              label: "HTF demand",
              faded: true
            },
            {
              from: 2,
              top: 180.8,
              bottom: 180.1,
              kind: "demand",
              label: "A"
            },
            {
              from: 13,
              top: 166,
              bottom: 165.15,
              kind: "demand",
              label: "B"
            }
          ]
        },
        answer: {
          from: 13,
          to: 15
        },
        explain: "Zone B sits inside the big HTF demand box: a zone within a zone. Zone A floats alone above it."
      },
      {
        type: "mcq",
        q: "You are new. How many entry timeframes should you use?",
        options: [
          "One",
          "Two",
          "Three",
          "As many as possible"
        ],
        answer: 0,
        explain: "Pick one timeframe and stick to it. He uses H1 and H4 because he knows MTA and MSA well enough not to get confused."
      },
      {
        type: "order",
        q: "Put the MTA process in order.",
        items: [
          "Choose your entry timeframe",
          "Go to its higher timeframe and mark the zones",
          "Wait for price to reach the HTF zone",
          "Drop to the entry timeframe and trade the zone inside it",
          "Hold as long as possible"
        ],
        explain: "Find the HTF zone, refine the entry lower, then hold."
      },
      {
        type: "mcq",
        q: "Can't day trade? Which entry timeframes suit you?",
        options: [
          "1m or 5m",
          "H1 or H4",
          "Only seconds charts",
          "Only the monthly"
        ],
        answer: 1,
        explain: "If you cannot day trade, enter on H1 or H4. Day traders use 1m, 5m or 15m."
      }
    ],
    practice: [
      {
        prompt: "Price is inside H1 demand and a 5m demand just formed. Price pulls back to it. Your call?",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.27, c: 157.6 },
            { o: 157.6, h: 158.19, l: 153.99, c: 154.5 },
            { o: 154.5, h: 155.03, l: 151.71, c: 152.3 },
            { o: 152.3, h: 152.87, l: 148.37, c: 148.9 },
            { o: 148.9, h: 149.43, l: 146, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.67, c: 160.55 },
            { o: 160.55, h: 162.83, l: 160.21, c: 162.65 },
            { o: 162.65, h: 162.89, l: 161.28, c: 161.75 },
            { o: 161.75, h: 163.83, l: 161.46, c: 163.45 },
            { o: 163.45, h: 163.92, l: 161.77, c: 162.25 },
            { o: 162.25, h: 163.75, l: 162.03, c: 163.55 },
            { o: 163.55, h: 163.77, l: 162.73, c: 162.95 },
            { o: 162.95, h: 163.37, l: 159.55, c: 160.05 },
            { o: 160.05, h: 160.23, l: 156.62, c: 157.11 },
            { o: 157.11, h: 157.37, l: 153.37, c: 153.86 },
            { o: 153.86, h: 154.09, l: 150.82, c: 151.17 },
            { o: 151.17, h: 151.74, l: 147.79, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.38, l: 146.76, c: 149.95 },
            { o: 149.95, h: 153.26, l: 149.67, c: 153.05 },
            { o: 153.05, h: 156.28, l: 152.5, c: 155.85 },
            { o: 155.85, h: 156.32, l: 154.56, c: 155.15 },
            { o: 155.15, h: 158.9, l: 154.88, c: 158.35 },
            { o: 158.35, h: 161.48, l: 157.8, c: 161.25 },
            { o: 161.25, h: 163.99, l: 160.84, c: 163.65 },
            { o: 163.65, h: 164.14, l: 162.78, c: 163.05 },
            { o: 163.05, h: 166.23, l: 162.53, c: 165.75 }
          ],
          zones: [
            {
              from: 0,
              top: 150.15,
              bottom: 142.65,
              kind: "demand",
              label: "H1 demand (HTF)",
              faded: true
            },
            {
              from: 0,
              top: 168.23,
              bottom: 164.73,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "5m demand (ETF)"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "A 5m demand inside H1 demand: zone within a zone, same direction. Buy and hold toward H1 supply. Price ran all the way up."
      },
      {
        prompt: "A clean 5m demand formed, but price is inside H1 supply. Buy the pullback?",
        scene: {
          candles: [
            { o: 153, h: 155.35, l: 152.61, c: 155.2 },
            { o: 155.2, h: 158.48, l: 154.93, c: 158 },
            { o: 158, h: 160.32, l: 157.76, c: 160 },
            { o: 160, h: 163.19, l: 159.62, c: 162.6 },
            { o: 162.6, h: 164.79, l: 162.33, c: 164.4 },
            { o: 164.4, h: 165.1, l: 163.95, c: 164.75 },
            { o: 164.75, h: 165.05, l: 163.75, c: 164.35 },
            { o: 164.35, h: 165.1, l: 164, c: 164.65 },
            { o: 164.65, h: 171.8, l: 164.45, c: 171.45 },
            { o: 171.45, h: 177.45, l: 171.15, c: 177.05 },
            { o: 177.05, h: 178.85, l: 176.53, c: 178.65 },
            { o: 178.65, h: 181.31, l: 178.3, c: 180.75 },
            { o: 180.75, h: 181.01, l: 179.59, c: 179.85 },
            { o: 179.85, h: 181.78, l: 179.55, c: 181.55 },
            { o: 181.55, h: 181.75, l: 179.84, c: 180.35 },
            { o: 180.35, h: 182.04, l: 179.82, c: 181.65 },
            { o: 181.65, h: 182.13, l: 180.86, c: 181.05 },
            { o: 181.05, h: 181.26, l: 177.53, c: 178.07 },
            { o: 178.07, h: 178.43, l: 174.68, c: 175.03 },
            { o: 175.03, h: 175.19, l: 171.76, c: 171.92 },
            { o: 171.92, h: 172.48, l: 168.79, c: 169.3 },
            { o: 169.3, h: 169.71, l: 165.55, c: 166.05 },
            { o: 166.05, h: 166.35, l: 164.35, c: 165.25 },
            { o: 165.25, h: 166.78, l: 164.95, c: 166.35 },
            { o: 166.35, h: 166.67, l: 164.28, c: 164.55 },
            { o: 164.55, h: 164.86, l: 161.71, c: 162.15 },
            { o: 162.15, h: 162.46, l: 159.88, c: 160.05 },
            { o: 160.05, h: 160.44, l: 158.33, c: 158.55 }
          ],
          zones: [
            {
              from: 0,
              top: 183.63,
              bottom: 161.75,
              kind: "supply",
              label: "H1 supply (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 164.75,
              bottom: 163.75,
              kind: "demand",
              label: "5m demand"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "You do not want to be buying in a supply zone. The bounce was tiny, then price fell through. Wait for setups that match the HTF."
      }
    ],
    cards: [
      {
        front: "What is MTA?",
        back: "Taking entry-timeframe zones only inside a higher-timeframe zone of the same direction."
      },
      {
        front: "HTF for a 5m entry?",
        back: "1 hour."
      },
      {
        front: "HTF for an H1 entry?",
        back: "Daily."
      },
      {
        front: "HTF for an H4 entry?",
        back: "Weekly."
      },
      {
        front: "HTF for a 1m entry?",
        back: "15 minutes."
      },
      {
        front: "Inside HTF demand you...?",
        back: "Only buy. We do not sell at demand."
      },
      {
        front: "Where does the edge come from?",
        back: "Find the HTF zone, refine the entry lower, hold as long as possible."
      },
      {
        front: "How many entry timeframes for a new trader?",
        back: "One. Stick to it."
      }
    ],
    mnemonic: "Doll in a Doll: small zone inside a big zone, same direction, then hold."
  },
  {
    mentor: "kevin-course",
    n: 5,
    eli5: {
      oneLiner: "A trend is stairs anyone can see. Momentum is a slide that does not last.",
      story: "Walking down a staircase, you step down, rest on a landing, then step down again. You can see each step and each landing. That is a trend: clear peaks and valleys. Now picture a slippery slide: whoosh, straight down, no landings. Fun, but it ends fast. That is momentum. We follow staircases, not slides.",
      analogy: "Trend = stairs with landings (peaks and valleys). Momentum = a slide (steep, no landings). Even your mom could point at the stairs."
    },
    bigIdeas: [
      "Trade with trends and trend lines. Never use momentum lines.",
      "Draw a downtrend line only after peak, valley, lower peak AND a break below the valley. Mirror for uptrends.",
      "Bigger, longer trends are better. Confirmation = a break of a proper trend line, not a momentum line."
    ],
    steps: [
      {
        title: "A peak",
        narration: "Price climbs and turns down. The top is a peak. One peak alone tells us nothing yet.",
        scene: {
          candles: [
            { o: 164, h: 164.75, l: 163.53, c: 164.6 },
            { o: 164.6, h: 164.99, l: 163.87, c: 164.2 },
            { o: 164.2, h: 165.23, l: 163.97, c: 165 },
            { o: 165, h: 165.33, l: 164.27, c: 164.7 },
            { o: 164.7, h: 165.84, l: 164.25, c: 165.4 },
            { o: 165.4, h: 166.3, l: 165.03, c: 165.9 },
            { o: 165.9, h: 167.62, l: 165.41, c: 167.3 },
            { o: 167.3, h: 169.58, l: 167.14, c: 169.1 },
            { o: 169.1, h: 170.55, l: 168.77, c: 170.3 },
            { o: 170.3, h: 170.7, l: 167.57, c: 167.9 },
            { o: 167.9, h: 168.18, l: 164.84, c: 165 },
            { o: 165, h: 165.17, l: 162.55, c: 162.9 },
            { o: 162.9, h: 163.12, l: 160.76, c: 161.3 }
          ],
          notes: [
            {
              x: 9,
              y: 171.7,
              text: "Peak"
            }
          ]
        }
      },
      {
        title: "A valley, then a lower peak",
        narration: "Price falls to a valley, bounces, but turns down BELOW the first peak. That is a lower peak. Still no trend line yet!",
        scene: {
          candles: [
            { o: 164, h: 164.75, l: 163.53, c: 164.6 },
            { o: 164.6, h: 164.99, l: 163.87, c: 164.2 },
            { o: 164.2, h: 165.23, l: 163.97, c: 165 },
            { o: 165, h: 165.33, l: 164.27, c: 164.7 },
            { o: 164.7, h: 165.84, l: 164.25, c: 165.4 },
            { o: 165.4, h: 166.3, l: 165.03, c: 165.9 },
            { o: 165.9, h: 167.62, l: 165.41, c: 167.3 },
            { o: 167.3, h: 169.58, l: 167.14, c: 169.1 },
            { o: 169.1, h: 170.55, l: 168.77, c: 170.3 },
            { o: 170.3, h: 170.7, l: 167.57, c: 167.9 },
            { o: 167.9, h: 168.18, l: 164.84, c: 165 },
            { o: 165, h: 165.17, l: 162.55, c: 162.9 },
            { o: 162.9, h: 163.12, l: 160.76, c: 161.3 },
            { o: 161.3, h: 163.36, l: 160.99, c: 162.9 },
            { o: 162.9, h: 165.15, l: 162.41, c: 164.9 },
            { o: 164.9, h: 166.64, l: 164.36, c: 166.3 },
            { o: 166.3, h: 166.62, l: 163.76, c: 164.1 }
          ],
          notes: [
            {
              x: 9,
              y: 171.7,
              text: "Peak"
            },
            {
              x: 12,
              y: 159.76,
              text: "Valley"
            },
            {
              x: 15,
              y: 167.64,
              text: "Lower peak"
            }
          ]
        }
      },
      {
        title: "Break below the valley",
        narration: "Now price breaks below the valley low. The swing point is broken. Only now does a downtrend exist and only now can we draw the line.",
        scene: {
          candles: [
            { o: 164, h: 164.75, l: 163.53, c: 164.6 },
            { o: 164.6, h: 164.99, l: 163.87, c: 164.2 },
            { o: 164.2, h: 165.23, l: 163.97, c: 165 },
            { o: 165, h: 165.33, l: 164.27, c: 164.7 },
            { o: 164.7, h: 165.84, l: 164.25, c: 165.4 },
            { o: 165.4, h: 166.3, l: 165.03, c: 165.9 },
            { o: 165.9, h: 167.62, l: 165.41, c: 167.3 },
            { o: 167.3, h: 169.58, l: 167.14, c: 169.1 },
            { o: 169.1, h: 170.55, l: 168.77, c: 170.3 },
            { o: 170.3, h: 170.7, l: 167.57, c: 167.9 },
            { o: 167.9, h: 168.18, l: 164.84, c: 165 },
            { o: 165, h: 165.17, l: 162.55, c: 162.9 },
            { o: 162.9, h: 163.12, l: 160.76, c: 161.3 },
            { o: 161.3, h: 163.36, l: 160.99, c: 162.9 },
            { o: 162.9, h: 165.15, l: 162.41, c: 164.9 },
            { o: 164.9, h: 166.64, l: 164.36, c: 166.3 },
            { o: 166.3, h: 166.62, l: 163.76, c: 164.1 },
            { o: 164.1, h: 164.49, l: 161.02, c: 161.5 },
            { o: 161.5, h: 161.77, l: 158.69, c: 159.1 }
          ],
          notes: [
            {
              x: 9,
              y: 171.7,
              text: "Peak"
            },
            {
              x: 12,
              y: 159.76,
              text: "Valley"
            },
            {
              x: 15,
              y: 167.64,
              text: "Lower peak"
            },
            {
              x: 18,
              y: 157.69,
              text: "Valley broken"
            }
          ],
          lines: [
            {
              y: 160.76,
              label: "valley low",
              kind: "level",
              from: 12
            }
          ]
        }
      },
      {
        title: "Connect the peaks",
        narration: "Connect the peaks and extend the line. It slopes clearly: a flat line is not a trend. Price respects it as the staircase keeps going down.",
        scene: {
          candles: [
            { o: 164, h: 164.75, l: 163.53, c: 164.6 },
            { o: 164.6, h: 164.99, l: 163.87, c: 164.2 },
            { o: 164.2, h: 165.23, l: 163.97, c: 165 },
            { o: 165, h: 165.33, l: 164.27, c: 164.7 },
            { o: 164.7, h: 165.84, l: 164.25, c: 165.4 },
            { o: 165.4, h: 166.3, l: 165.03, c: 165.9 },
            { o: 165.9, h: 167.62, l: 165.41, c: 167.3 },
            { o: 167.3, h: 169.58, l: 167.14, c: 169.1 },
            { o: 169.1, h: 170.55, l: 168.77, c: 170.3 },
            { o: 170.3, h: 170.7, l: 167.57, c: 167.9 },
            { o: 167.9, h: 168.18, l: 164.84, c: 165 },
            { o: 165, h: 165.17, l: 162.55, c: 162.9 },
            { o: 162.9, h: 163.12, l: 160.76, c: 161.3 },
            { o: 161.3, h: 163.36, l: 160.99, c: 162.9 },
            { o: 162.9, h: 165.15, l: 162.41, c: 164.9 },
            { o: 164.9, h: 166.64, l: 164.36, c: 166.3 },
            { o: 166.3, h: 166.62, l: 163.76, c: 164.1 },
            { o: 164.1, h: 164.49, l: 161.02, c: 161.5 },
            { o: 161.5, h: 161.77, l: 158.69, c: 159.1 },
            { o: 159.1, h: 159.49, l: 155.87, c: 156.3 },
            { o: 156.3, h: 156.72, l: 154.2, c: 154.4 },
            { o: 154.4, h: 156.44, l: 154.06, c: 155.9 },
            { o: 155.9, h: 157.95, l: 155.43, c: 157.7 },
            { o: 157.7, h: 159.15, l: 157.5, c: 158.9 },
            { o: 158.9, h: 159.46, l: 156.23, c: 156.5 },
            { o: 156.5, h: 156.69, l: 153.49, c: 153.8 },
            { o: 153.8, h: 154.01, l: 151.44, c: 151.6 },
            { o: 151.6, h: 151.9, l: 149.23, c: 149.6 }
          ],
          notes: [
            {
              x: 9,
              y: 171.7,
              text: "Peak"
            },
            {
              x: 12,
              y: 159.76,
              text: "Valley"
            },
            {
              x: 15,
              y: 167.64,
              text: "Lower peak"
            }
          ],
          trendlines: [
            {
              x1: 9,
              y1: 170.7,
              x2: 27,
              y2: 160.26,
              label: "downtrend line"
            }
          ]
        }
      },
      {
        title: "Momentum: the slide",
        narration: "This is momentum: steep and almost straight, with tiny pullbacks and no clear peaks or valleys. He shows momentum lines only to show you what NOT to do.",
        scene: {
          candles: [
            { o: 176, h: 176.15, l: 172.97, c: 173.5 },
            { o: 173.5, h: 173.78, l: 170.17, c: 170.7 },
            { o: 170.7, h: 171.17, l: 170.08, c: 170.4 },
            { o: 170.4, h: 170.75, l: 167.51, c: 167.8 },
            { o: 167.8, h: 168.1, l: 164.48, c: 164.9 },
            { o: 164.9, h: 165.87, l: 164.75, c: 165.3 },
            { o: 165.3, h: 165.54, l: 162.09, c: 162.6 },
            { o: 162.6, h: 163.1, l: 159.21, c: 159.6 },
            { o: 159.6, h: 160.15, l: 156.77, c: 157.1 },
            { o: 157.1, h: 157.97, l: 156.74, c: 157.4 },
            { o: 157.4, h: 157.87, l: 154.13, c: 154.6 },
            { o: 154.6, h: 155.03, l: 151.68, c: 152 },
            { o: 152, h: 152.15, l: 149.27, c: 149.6 },
            { o: 149.6, h: 150.1, l: 149.25, c: 149.4 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176.15,
              x2: 13,
              y2: 153.21,
              label: "momentum line - do not use"
            }
          ],
          notes: [
            {
              x: 6,
              y: 167.54,
              text: "No clear peaks/valleys"
            }
          ]
        }
      },
      {
        title: "Why it matters",
        narration: "Breaking a small momentum line can be a false breakout. The real signal is a break of the proper trend line from further back.",
        scene: {
          candles: [
            { o: 168, h: 169.55, l: 167.41, c: 169.4 },
            { o: 169.4, h: 171.37, l: 169.11, c: 171.2 },
            { o: 171.2, h: 172.66, l: 170.78, c: 172.4 },
            { o: 172.4, h: 172.77, l: 169.41, c: 170 },
            { o: 170, h: 170.15, l: 166.71, c: 167.1 },
            { o: 167.1, h: 167.4, l: 164.61, c: 165 },
            { o: 165, h: 165.17, l: 162.88, c: 163.4 },
            { o: 163.4, h: 165.53, l: 163.22, c: 165 },
            { o: 165, h: 167.41, l: 164.67, c: 167 },
            { o: 167, h: 168.69, l: 166.61, c: 168.4 },
            { o: 168.4, h: 168.61, l: 164.87, c: 165.2 },
            { o: 165.2, h: 165.45, l: 161.51, c: 161.8 },
            { o: 161.8, h: 162.33, l: 158.13, c: 158.7 },
            { o: 158.7, h: 159.24, l: 154.95, c: 155.4 },
            { o: 155.4, h: 157.5, l: 155.2, c: 157.2 },
            { o: 157.2, h: 158.5, l: 156.9, c: 158.1 },
            { o: 158.1, h: 159.7, l: 157.8, c: 158.5 },
            { o: 158.5, h: 158.67, l: 155.68, c: 155.9 },
            { o: 155.9, h: 156.16, l: 152.67, c: 153 },
            { o: 153, h: 153.56, l: 150.42, c: 150.8 },
            { o: 150.8, h: 150.96, l: 147.97, c: 148.3 },
            { o: 148.3, h: 148.69, l: 146.31, c: 146.5 }
          ],
          trendlines: [
            {
              x1: 3,
              y1: 172.77,
              x2: 21,
              y2: 162.12,
              label: "trend line"
            },
            {
              x1: 10,
              y1: 168.81,
              x2: 15,
              y2: 153.11,
              label: "momentum line",
              broken: true
            }
          ],
          notes: [
            {
              x: 15,
              y: 159.5,
              text: "False breakout"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which is a trend?",
        options: [
          "A steep straight move with tiny pullbacks",
          "Clear, obvious peaks and valleys",
          "Any move longer than 600 pips",
          "A flat sideways range"
        ],
        answer: 1,
        explain: "A trend has peaks and valleys that anyone can see. A steep straight move is momentum. No pip distance makes a trend."
      },
      {
        type: "spot",
        q: "Click the candle that makes this downtrend line valid (breaks the valley).",
        scene: {
          candles: [
            { o: 164, h: 164.75, l: 163.53, c: 164.6 },
            { o: 164.6, h: 164.99, l: 163.87, c: 164.2 },
            { o: 164.2, h: 165.23, l: 163.97, c: 165 },
            { o: 165, h: 165.33, l: 164.27, c: 164.7 },
            { o: 164.7, h: 165.84, l: 164.25, c: 165.4 },
            { o: 165.4, h: 166.3, l: 165.03, c: 165.9 },
            { o: 165.9, h: 167.62, l: 165.41, c: 167.3 },
            { o: 167.3, h: 169.58, l: 167.14, c: 169.1 },
            { o: 169.1, h: 170.55, l: 168.77, c: 170.3 },
            { o: 170.3, h: 170.7, l: 167.57, c: 167.9 },
            { o: 167.9, h: 168.18, l: 164.84, c: 165 },
            { o: 165, h: 165.17, l: 162.55, c: 162.9 },
            { o: 162.9, h: 163.12, l: 160.76, c: 161.3 },
            { o: 161.3, h: 163.36, l: 160.99, c: 162.9 },
            { o: 162.9, h: 165.15, l: 162.41, c: 164.9 },
            { o: 164.9, h: 166.64, l: 164.36, c: 166.3 },
            { o: 166.3, h: 166.62, l: 163.76, c: 164.1 },
            { o: 164.1, h: 164.49, l: 161.02, c: 161.5 },
            { o: 161.5, h: 161.77, l: 158.69, c: 159.1 },
            { o: 159.1, h: 159.49, l: 155.87, c: 156.3 },
            { o: 156.3, h: 156.72, l: 154.2, c: 154.4 },
            { o: 154.4, h: 156.44, l: 154.06, c: 155.9 },
            { o: 155.9, h: 157.95, l: 155.43, c: 157.7 },
            { o: 157.7, h: 159.15, l: 157.5, c: 158.9 },
            { o: 158.9, h: 159.46, l: 156.23, c: 156.5 },
            { o: 156.5, h: 156.69, l: 153.49, c: 153.8 },
            { o: 153.8, h: 154.01, l: 151.44, c: 151.6 },
            { o: 151.6, h: 151.9, l: 149.23, c: 149.6 }
          ],
          notes: [
            {
              x: 9,
              y: 171.7,
              text: "Peak"
            },
            {
              x: 12,
              y: 159.76,
              text: "Valley"
            },
            {
              x: 15,
              y: 167.64,
              text: "Lower peak"
            }
          ]
        },
        answer: {
          from: 18,
          to: 18
        },
        explain: "Peak, valley, lower peak is not enough. The trend line exists only once price breaks below the valley low."
      },
      {
        type: "tf",
        q: "You can draw a downtrend line as soon as you see a lower peak.",
        answer: false,
        explain: "You must wait for the break below the valley. Drawing it before the swing point breaks does not make sense."
      },
      {
        type: "tf",
        q: "Even a weak trend is better than momentum.",
        answer: true,
        explain: "He says a trend, even a weak one, is always better than momentum, which is not sustainable."
      },
      {
        type: "mcq",
        q: "Price broke a small momentum line. Is that confirmation?",
        options: [
          "Yes, always",
          "No, it can be a false breakout; use the proper trend line",
          "Only on Fridays",
          "Only if an indicator agrees"
        ],
        answer: 1,
        explain: "Momentum-line breaks can fake out. The real signal is the break of the proper trend line from further back."
      },
      {
        type: "order",
        q: "Order the events needed to draw a downtrend line.",
        items: [
          "Peak",
          "Valley",
          "Lower peak",
          "Price breaks below the valley low",
          "Connect the peaks and extend the line"
        ],
        explain: "Only after the valley breaks do you connect the peaks."
      },
      {
        type: "tf",
        q: "A nearly flat line connecting two peaks is a good trend line.",
        answer: false,
        explain: "The line must be angled. A near-flat line is not a trend."
      }
    ],
    practice: [
      {
        prompt: "Downtrend with a proper trend line above. Price just popped above a small steep momentum line. Buy the breakout?",
        scene: {
          candles: [
            { o: 168, h: 169.55, l: 167.41, c: 169.4 },
            { o: 169.4, h: 171.37, l: 169.11, c: 171.2 },
            { o: 171.2, h: 172.66, l: 170.78, c: 172.4 },
            { o: 172.4, h: 172.77, l: 169.41, c: 170 },
            { o: 170, h: 170.15, l: 166.71, c: 167.1 },
            { o: 167.1, h: 167.4, l: 164.61, c: 165 },
            { o: 165, h: 165.17, l: 162.88, c: 163.4 },
            { o: 163.4, h: 165.53, l: 163.22, c: 165 },
            { o: 165, h: 167.41, l: 164.67, c: 167 },
            { o: 167, h: 168.69, l: 166.61, c: 168.4 },
            { o: 168.4, h: 168.61, l: 164.87, c: 165.2 },
            { o: 165.2, h: 165.45, l: 161.51, c: 161.8 },
            { o: 161.8, h: 162.33, l: 158.13, c: 158.7 },
            { o: 158.7, h: 159.24, l: 154.95, c: 155.4 },
            { o: 155.4, h: 157.5, l: 155.2, c: 157.2 },
            { o: 157.2, h: 158.5, l: 156.9, c: 158.1 },
            { o: 158.1, h: 159.7, l: 157.8, c: 158.5 },
            { o: 158.5, h: 158.67, l: 155.68, c: 155.9 },
            { o: 155.9, h: 156.16, l: 152.67, c: 153 },
            { o: 153, h: 153.56, l: 150.42, c: 150.8 },
            { o: 150.8, h: 150.96, l: 147.97, c: 148.3 },
            { o: 148.3, h: 148.69, l: 146.31, c: 146.5 }
          ],
          trendlines: [
            {
              x1: 3,
              y1: 172.77,
              x2: 21,
              y2: 162.12,
              label: "trend line"
            },
            {
              x1: 10,
              y1: 168.81,
              x2: 15,
              y2: 153.11,
              label: "momentum line",
              broken: true
            }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "That was only a momentum line. The proper downtrend line above was never broken, so there is no confirmation. Price stalled under the trend line and kept falling."
      }
    ],
    cards: [
      {
        front: "Trend?",
        back: "Clear, obvious peaks and valleys. Sustainable."
      },
      {
        front: "Momentum?",
        back: "Steep, near-straight move with tiny pullbacks. Not sustainable."
      },
      {
        front: "When can you draw a downtrend line?",
        back: "After peak, valley, lower peak, and a break below the valley."
      },
      {
        front: "Uptrend line rule?",
        back: "Mirror: price must break above the prior high first."
      },
      {
        front: "Flat line?",
        back: "Not a trend. The line must slope."
      },
      {
        front: "Which trend is better?",
        back: "A larger one, with big swings over a long time."
      },
      {
        front: "Confirmation uses...?",
        back: "A break of a proper trend line, never a momentum line."
      },
      {
        front: "Fixed number to call a trend?",
        back: "None. Use judgement."
      }
    ],
    mnemonic: "Stairs, not Slides: follow the staircase of peaks and valleys; ignore the slide."
  },
  {
    mentor: "kevin-course",
    n: 6,
    eli5: {
      oneLiner: "Enter at the front door, put the stop just behind the back wall.",
      story: "You wait for a friend at the front door of a house. You step in the moment they arrive: that is your entry, just at the near line of the zone. If a burglar breaks through the back wall, the house is not safe any more and you leave: that is your stop, just past the far line. When you win, you put a quarter of your toys in the bank early, and let the rest ride to the next big town.",
      analogy: "The zone is a house. Entry = front door (proximal). Stop = a step past the back wall (distal). Once the wall breaks, the trade is void."
    },
    bigIdeas: [
      "Entry just before the proximal line; stop a little beyond the distal line, with the spread as buffer.",
      "Once the zone breaks the trade is void, so the stop sits just past it with a little room.",
      "His method: 25% off at 3:1, 75% held toward the next HTF opposing zone. Test your own TP style."
    ],
    steps: [
      {
        title: "Start with the zone",
        narration: "Here is a clean demand zone. Size the long-position tool to it.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            }
          ]
        }
      },
      {
        title: "Entry: just above the proximal",
        narration: "Place the buy order about one spread before the proximal line (for example 1 pip on EURUSD). Entering around the proximal is usually fine; no need to go far ahead.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "entry (just above proximal)",
              kind: "entry",
              from: 5
            }
          ]
        }
      },
      {
        title: "Stop: just past the distal",
        narration: "Put the stop a little below the distal line, adding the spread and a bit of visual room, because price sometimes peeks just through a zone and then goes. If the zone breaks, the trade is void.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "entry (just above proximal)",
              kind: "entry",
              from: 5
            },
            {
              y: 145.35,
              label: "stop (just below distal)",
              kind: "sl",
              from: 5
            }
          ]
        }
      },
      {
        title: "First target: 25% at 3:1",
        narration: "His personal method uses two orders. The first is 25% of the position with take profit at 3 times the risk.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "entry (just above proximal)",
              kind: "entry",
              from: 5
            },
            {
              y: 145.35,
              label: "stop (just below distal)",
              kind: "sl",
              from: 5
            },
            {
              y: 151.35,
              label: "25% off at 3:1",
              kind: "tp",
              from: 5
            }
          ],
          notes: [
            {
              x: 24,
              y: 152.35,
              text: "3:1 hit"
            }
          ]
        }
      },
      {
        title: "Runner: 75% to the HTF supply",
        narration: "The other 75% is held toward the next higher-timeframe supply. If a supply zone is close above, take profit quicker instead.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 0,
              top: 170.06,
              bottom: 167.06,
              kind: "supply",
              label: "next HTF supply",
              faded: true
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "entry (just above proximal)",
              kind: "entry",
              from: 5
            },
            {
              y: 145.35,
              label: "stop (just below distal)",
              kind: "sl",
              from: 5
            },
            {
              y: 151.35,
              label: "25% off at 3:1",
              kind: "tp",
              from: 5
            },
            {
              y: 167.06,
              label: "runner target",
              kind: "tp",
              from: 5
            }
          ]
        }
      },
      {
        title: "Bump the stop",
        narration: "As price moves your way and fresh demand forms below, move the runner stop under it to lock in profit.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand",
              faded: true
            },
            {
              from: 0,
              top: 170.06,
              bottom: 167.06,
              kind: "supply",
              label: "next HTF supply",
              faded: true
            },
            {
              from: 25,
              top: 153.35,
              bottom: 152.65,
              kind: "demand",
              label: "new demand"
            }
          ],
          lines: [
            {
              y: 152.35,
              label: "stop bumped",
              kind: "sl",
              from: 25
            },
            {
              y: 167.06,
              label: "runner target",
              kind: "tp",
              from: 5
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Where does the stop go on a demand trade?",
        options: [
          "Exactly on the distal line",
          "A little below the distal line (spread + small room)",
          "In the middle of the zone",
          "Under the next big low far away"
        ],
        answer: 1,
        explain: "Just past the zone with the spread as buffer and a bit of room. Exactly on the edge gets clipped when price peeks through."
      },
      {
        type: "tf",
        q: "If the zone is broken, the whole trade is void.",
        answer: true,
        explain: "That is exactly why the stop sits just beyond the zone."
      },
      {
        type: "spot",
        q: "Click the candle where the 25% part hits 3:1.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.44, c: 157.6 },
            { o: 157.6, h: 157.79, l: 153.91, c: 154.5 },
            { o: 154.5, h: 154.87, l: 151.99, c: 152.3 },
            { o: 152.3, h: 152.84, l: 148.57, c: 148.9 },
            { o: 148.9, h: 149.25, l: 146.14, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.88, l: 158.49, c: 160.55 },
            { o: 160.55, h: 163.11, l: 160.35, c: 162.65 },
            { o: 162.65, h: 162.92, l: 161.46, c: 161.75 },
            { o: 161.75, h: 164.02, l: 161.39, c: 163.45 },
            { o: 163.45, h: 163.77, l: 162.07, c: 162.25 },
            { o: 162.25, h: 163.91, l: 161.7, c: 163.55 },
            { o: 163.55, h: 164.12, l: 162.46, c: 162.95 },
            { o: 162.95, h: 163.16, l: 159.58, c: 160.01 },
            { o: 160.01, h: 160.33, l: 156.65, c: 157.14 },
            { o: 157.14, h: 157.51, l: 153.81, c: 153.96 },
            { o: 153.96, h: 154.52, l: 150.99, c: 151.15 },
            { o: 151.15, h: 151.57, l: 147.74, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.3, l: 147.07, c: 149.95 },
            { o: 149.95, h: 153.23, l: 149.38, c: 153.05 },
            { o: 153.05, h: 153.65, l: 152.65, c: 153.35 },
            { o: 153.35, h: 153.65, l: 152.65, c: 153.05 },
            { o: 153.05, h: 153.6, l: 152.75, c: 153.3 },
            { o: 153.3, h: 157, l: 153.1, c: 156.7 },
            { o: 156.7, h: 159.69, l: 156.12, c: 159.5 },
            { o: 159.5, h: 162.48, l: 159.15, c: 162 },
            { o: 162, h: 162.39, l: 160.81, c: 161.4 },
            { o: 161.4, h: 164.24, l: 160.97, c: 163.8 },
            { o: 163.8, h: 166.49, l: 163.59, c: 166 },
            { o: 166, h: 166.38, l: 165, c: 165.5 },
            { o: 165.5, h: 168.06, l: 165.28, c: 167.5 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "entry (just above proximal)",
              kind: "entry",
              from: 5
            },
            {
              y: 145.35,
              label: "stop (just below distal)",
              kind: "sl",
              from: 5
            },
            {
              y: 151.35,
              label: "25% off at 3:1",
              kind: "tp",
              from: 5
            }
          ]
        },
        answer: {
          from: 24,
          to: 24
        },
        explain: "This is the first candle whose high reaches the 3:1 line. The runner keeps going toward HTF supply."
      },
      {
        type: "mcq",
        q: "What is the split entry?",
        options: [
          "50% at the proximal, 50% halfway into the zone",
          "100% at the distal",
          "Two trades in opposite directions",
          "Entering after the TP"
        ],
        answer: 0,
        explain: "It tightens the entry and raises R:R, but has cons. No free lunch. It may suit a bigger zone."
      },
      {
        type: "mcq",
        q: "A supply zone sits close above your long. What should you do?",
        options: [
          "Hold for a huge target anyway",
          "Take profits quicker",
          "Remove the stop",
          "Add more size"
        ],
        answer: 1,
        explain: "Context decides. With an opposing zone close above, take profit sooner. With room above, hold to the HTF zone."
      },
      {
        type: "tf",
        q: "There is one correct take-profit method for everyone.",
        answer: false,
        explain: "Entries and TPs are subjective. Test methods (recent high, fixed R:R, next HTF zone) and pick what fits you."
      },
      {
        type: "order",
        q: "Order his trade plan for a long.",
        items: [
          "Size the tool to the demand zone",
          "Entry just above the proximal",
          "Stop just below the distal",
          "25% off at 3:1",
          "75% held toward the next HTF supply"
        ],
        explain: "Zone, entry, stop, then the two-part exit."
      }
    ],
    practice: [
      {
        prompt: "Plan this long. Pick entry, stop and a 3:1 target.",
        scene: {
          candles: [
            { o: 136, h: 138.35, l: 135.78, c: 138.2 },
            { o: 138.2, h: 141.53, l: 137.85, c: 141 },
            { o: 141, h: 143.16, l: 140.59, c: 143 },
            { o: 143, h: 146.16, l: 142.81, c: 145.6 },
            { o: 145.6, h: 147.6, l: 145.02, c: 147.4 },
            { o: 147.4, h: 148.1, l: 146.95, c: 147.75 },
            { o: 147.75, h: 148.05, l: 146.75, c: 147.35 },
            { o: 147.35, h: 148.1, l: 147, c: 147.65 },
            { o: 147.65, h: 154.8, l: 147.45, c: 154.45 },
            { o: 154.45, h: 160.45, l: 154.15, c: 160.05 },
            { o: 160.05, h: 162.15, l: 159.81, c: 161.65 },
            { o: 161.65, h: 164.13, l: 161.44, c: 163.75 },
            { o: 163.75, h: 164.04, l: 162.32, c: 162.85 },
            { o: 162.85, h: 164.98, l: 162.49, c: 164.55 },
            { o: 164.55, h: 165.05, l: 163.14, c: 163.35 },
            { o: 163.35, h: 165.2, l: 162.94, c: 164.65 },
            { o: 164.65, h: 165.03, l: 163.59, c: 164.05 },
            { o: 164.05, h: 164.5, l: 160.57, c: 161.03 },
            { o: 161.03, h: 161.54, l: 157.71, c: 158.07 },
            { o: 158.07, h: 158.34, l: 154.75, c: 155.02 },
            { o: 155.02, h: 155.46, l: 151.96, c: 152.27 },
            { o: 152.27, h: 152.52, l: 148.5, c: 149.05 },
            { o: 149.05, h: 149.35, l: 147.3, c: 148.45 },
            { o: 148.45, h: 151.3, l: 148.01, c: 150.95 },
            { o: 150.95, h: 154.44, l: 150.39, c: 154.15 },
            { o: 154.15, h: 157.06, l: 153.68, c: 156.55 },
            { o: 156.55, h: 156.88, l: 155.37, c: 155.75 },
            { o: 155.75, h: 158.87, l: 155.22, c: 158.65 },
            { o: 158.65, h: 161.41, l: 158.47, c: 160.85 }
          ],
          zones: [
            {
              from: 5,
              top: 147.75,
              bottom: 146.75,
              kind: "demand",
              label: "Demand"
            }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 147.95,
          sl: 146.45,
          tp: 152.45
        },
        explain: "Entry just above the proximal (spread added), stop just below the distal, target = entry + 3 x risk. Price came back, filled, and reached 3:1."
      },
      {
        prompt: "Plan this short. Pick entry, stop and a 3:1 target.",
        scene: {
          candles: [
            { o: 140, h: 142.68, l: 139.85, c: 142.4 },
            { o: 142.4, h: 146.05, l: 141.98, c: 145.5 },
            { o: 145.5, h: 148.21, l: 145.1, c: 147.7 },
            { o: 147.7, h: 151.6, l: 147.12, c: 151.1 },
            { o: 151.1, h: 154.25, l: 150.59, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.53, l: 139.23, c: 139.45 },
            { o: 139.45, h: 139.68, l: 137.04, c: 137.35 },
            { o: 137.35, h: 138.57, l: 137.03, c: 138.25 },
            { o: 138.25, h: 138.62, l: 136.27, c: 136.55 },
            { o: 136.55, h: 137.99, l: 136.33, c: 137.75 },
            { o: 137.75, h: 138.02, l: 136.16, c: 136.45 },
            { o: 136.45, h: 137.48, l: 136.25, c: 137.05 },
            { o: 137.05, h: 140.65, l: 136.81, c: 140.15 },
            { o: 140.15, h: 143.43, l: 139.91, c: 143.2 },
            { o: 143.2, h: 146.52, l: 143.04, c: 146.12 },
            { o: 146.12, h: 149.26, l: 145.8, c: 148.8 },
            { o: 148.8, h: 152.49, l: 148.26, c: 152.05 },
            { o: 152.05, h: 153.8, l: 151.75, c: 152.65 },
            { o: 152.65, h: 152.81, l: 149.8, c: 150.15 },
            { o: 150.15, h: 150.71, l: 146.55, c: 146.95 },
            { o: 146.95, h: 147.31, l: 144.16, c: 144.55 },
            { o: 144.55, h: 145.76, l: 144.38, c: 145.35 },
            { o: 145.35, h: 145.83, l: 141.94, c: 142.45 },
            { o: 142.45, h: 142.82, l: 140.02, c: 140.25 }
          ],
          zones: [
            {
              from: 5,
              top: 154.35,
              bottom: 153.35,
              kind: "supply",
              label: "Supply"
            }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 153.15,
          sl: 154.65,
          tp: 148.65
        },
        explain: "Supply is the exact opposite: short just below the proximal (bottom line), stop just above the distal (top wick). Price dropped to 3:1."
      }
    ],
    cards: [
      {
        front: "Entry on a demand zone?",
        back: "Just above the proximal line (about one spread)."
      },
      {
        front: "Stop on a demand zone?",
        back: "A little below the distal line, spread + small room."
      },
      {
        front: "Why stop just past the zone?",
        back: "Once the zone breaks, the trade is void."
      },
      {
        front: "His exit split?",
        back: "25% at 3:1, 75% to the next HTF opposing zone."
      },
      {
        front: "Split entry?",
        back: "50% at proximal, 50% halfway into the zone."
      },
      {
        front: "Zone within the zone?",
        back: "Refine the entry with a lower-timeframe zone inside your zone."
      },
      {
        front: "Opposing zone close above?",
        back: "Take profit quicker."
      },
      {
        front: "Managing the runner?",
        back: "Bump the stop under new demand as it forms."
      }
    ],
    mnemonic: "Door, Wall, Quarter: enter at the door, stop past the wall, bank a quarter at 3:1."
  },
  {
    mentor: "kevin-course",
    n: 7,
    eli5: {
      oneLiner: "Ask why the big zone should hold: check one more timeframe up.",
      story: "You want to stand on a box. Is the box strong? Look under it: it is on a table. Is the table strong? Look under it: it is on the floor. Box on table on floor: safe! That is three timeframes agreeing. When all three line up, he risks the most. When the table is missing, he still might stand there, but more carefully.",
      analogy: "Three nesting dolls: entry zone inside a higher zone inside an even higher zone. Three dolls = confidence."
    },
    bigIdeas: [
      "MSA = MTA times two: entry timeframe, its HTF, and the HTF of that HTF.",
      "Three-timeframe confluence is where he risks the most. Without the MSA zone: 0.25 to 0.5% instead of 1%.",
      "Expect a big R:R and a not-amazing win rate. Hold the big move with repeated entries."
    ],
    steps: [
      {
        title: "MTA first",
        narration: "You must master MTA first. Here an H1 demand (entry) sits inside a daily demand (HTF). That is a zone within a zone.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ]
        }
      },
      {
        title: "Ask: why should the daily hold?",
        narration: "MSA asks one more question. Treat the daily as if it were your entry timeframe. What is ITS higher timeframe? For daily, it is the monthly.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ],
          notes: [
            {
              x: 5,
              y: 151.15,
              text: "Why should this hold?"
            }
          ]
        }
      },
      {
        title: "The MSA zone answers",
        narration: "The daily demand sits inside a monthly demand. H1 inside daily inside monthly: three-timeframe confluence.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 152.65,
              bottom: 139.65,
              kind: "demand",
              label: "Monthly demand (MSA)",
              faded: true
            },
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ]
        }
      },
      {
        title: "Most risk here",
        narration: "These are the trades where he applies the most risk, around 1%. Confluence is why he can accept loss after loss in the small zones and hold for one big win.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 152.65,
              bottom: 139.65,
              kind: "demand",
              label: "Monthly demand (MSA)",
              faded: true
            },
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ],
          lines: [
            {
              y: 146.85,
              label: "buy (full risk)",
              kind: "entry",
              from: 5
            }
          ]
        }
      },
      {
        title: "Hold the whole move",
        narration: "The goal: hold the whole higher-timeframe move by finding new entry zones again and again as price climbs.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 152.65,
              bottom: 139.65,
              kind: "demand",
              label: "Monthly demand (MSA)",
              faded: true
            },
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            },
            {
              from: 26,
              top: 154.45,
              bottom: 153.7,
              kind: "demand",
              label: "next H1 demand"
            }
          ],
          notes: [
            {
              x: 36,
              y: 152.5,
              text: "Re-entry"
            }
          ]
        }
      },
      {
        title: "No MSA zone? Smaller risk",
        narration: "If there is a daily zone but nothing on the monthly, you can still trade it, but risk only 0.25 to 0.5%. It is fine, just lower quality.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ],
          notes: [
            {
              x: 5,
              y: 151.15,
              text: "No monthly zone: 0.25-0.5%"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Entry on 5m. What are the HTF and MSA timeframes?",
        options: [
          "15m and H1",
          "H1 and Daily",
          "H4 and Weekly",
          "Daily and Monthly"
        ],
        answer: 1,
        explain: "Sequence: 5m ETF, H1 HTF, Daily MSA."
      },
      {
        type: "order",
        q: "Order the H1 entry sequence from small to big.",
        items: [
          "H1 (entry)",
          "Daily (HTF)",
          "Monthly (MSA)"
        ],
        explain: "Take the HTF of your entry, treat it as an entry, and take its HTF. That third one is the MSA timeframe."
      },
      {
        type: "mcq",
        q: "Entry zone inside a HTF zone, but no MSA zone. Risk?",
        options: [
          "2%",
          "1%",
          "0.25 to 0.5%",
          "Do not ever trade it"
        ],
        answer: 2,
        explain: "He still may take it, but at 0.25 to 0.5%, not 1%."
      },
      {
        type: "tf",
        q: "A big-R:R hold strategy should have a very high win rate.",
        answer: false,
        explain: "Expect a very large R:R but a not-amazing win rate. That is just his strategy."
      },
      {
        type: "spot",
        q: "Click the basing of the H1 zone that has three-timeframe confluence.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 152.65,
              bottom: 139.65,
              kind: "demand",
              label: "Monthly demand (MSA)",
              faded: true
            },
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            }
          ]
        },
        answer: {
          from: 5,
          to: 7
        },
        explain: "This basing sits inside the daily demand, which sits inside the monthly demand."
      },
      {
        type: "tf",
        q: "You can learn MSA without understanding MTA.",
        answer: false,
        explain: "\"If you do not understand multiple timeframe analysis, you will not understand multiple sequence analysis.\""
      }
    ],
    practice: [
      {
        prompt: "H1 demand inside daily demand inside monthly demand. Price pulls back to the H1 zone.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.3, c: 157.6 },
            { o: 157.6, h: 158.04, l: 154.1, c: 154.5 },
            { o: 154.5, h: 155.02, l: 151.9, c: 152.3 },
            { o: 152.3, h: 152.6, l: 148.66, c: 148.9 },
            { o: 148.9, h: 149.15, l: 145.99, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 160.8, l: 158.4, c: 160.55 },
            { o: 160.55, h: 163.25, l: 160.2, c: 162.65 },
            { o: 162.65, h: 163.16, l: 161.33, c: 161.75 },
            { o: 161.75, h: 163.89, l: 161.35, c: 163.45 },
            { o: 163.45, h: 163.7, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.99, l: 161.76, c: 163.55 },
            { o: 163.55, h: 164.07, l: 162.77, c: 162.95 },
            { o: 162.95, h: 163.29, l: 159.35, c: 159.74 },
            { o: 159.74, h: 160.13, l: 156.41, c: 156.91 },
            { o: 156.91, h: 157.11, l: 153.58, c: 154.02 },
            { o: 154.02, h: 154.29, l: 150.6, c: 150.88 },
            { o: 150.88, h: 151.44, l: 147.48, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 150.26, l: 146.78, c: 149.95 },
            { o: 149.95, h: 153.34, l: 149.46, c: 152.95 },
            { o: 152.95, h: 154.44, l: 152.58, c: 154.15 },
            { o: 154.15, h: 154.75, l: 153.75, c: 154.45 },
            { o: 154.45, h: 154.75, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.7, l: 153.8, c: 154.4 },
            { o: 154.4, h: 158.3, l: 154.2, c: 158 },
            { o: 158, h: 161.17, l: 157.78, c: 160.9 },
            { o: 160.9, h: 161.43, l: 159.68, c: 160.2 },
            { o: 160.2, h: 162.91, l: 159.61, c: 162.6 },
            { o: 162.6, h: 163.16, l: 159.63, c: 160.18 },
            { o: 160.18, h: 160.56, l: 157.32, c: 157.84 },
            { o: 157.84, h: 158.23, l: 154.97, c: 155.45 },
            { o: 155.45, h: 155.75, l: 154.15, c: 155.05 },
            { o: 155.05, h: 158.25, l: 154.76, c: 157.85 },
            { o: 157.85, h: 161.2, l: 157.33, c: 160.95 },
            { o: 160.95, h: 163.9, l: 160.51, c: 163.45 },
            { o: 163.45, h: 165.82, l: 163.27, c: 165.65 }
          ],
          zones: [
            {
              from: 0,
              top: 152.65,
              bottom: 139.65,
              kind: "demand",
              label: "Monthly demand (MSA)",
              faded: true
            },
            {
              from: 0,
              top: 149.65,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand (HTF)",
              faded: true
            },
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H1 demand (ETF)"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Three-timeframe confluence: his highest-risk kind of trade. Price pushed up, and a later H1 demand gave a second entry to keep holding the move."
      },
      {
        prompt: "Price is inside daily and monthly demand. A small H1 supply formed above. Sell it?",
        scene: {
          candles: [
            { o: 150, h: 150.15, l: 147.84, c: 148.2 },
            { o: 148.2, h: 148.53, l: 145.84, c: 146 },
            { o: 146, h: 146.31, l: 143.61, c: 144.1 },
            { o: 144.1, h: 144.7, l: 143.7, c: 144.4 },
            { o: 144.4, h: 144.8, l: 143.8, c: 144.1 },
            { o: 144.1, h: 144.3, l: 140.5, c: 140.9 },
            { o: 140.9, h: 141.22, l: 137.95, c: 138.5 },
            { o: 138.5, h: 139.06, l: 137.32, c: 137.6 },
            { o: 137.6, h: 138.2, l: 137.2, c: 137.9 },
            { o: 137.9, h: 138.2, l: 137.2, c: 137.6 },
            { o: 137.6, h: 141.2, l: 137.3, c: 141 },
            { o: 141, h: 143.03, l: 140.67, c: 142.6 },
            { o: 142.6, h: 144.02, l: 142.23, c: 143.5 },
            { o: 143.5, h: 143.79, l: 143.2, c: 143.57 },
            { o: 143.57, h: 143.97, l: 142.88, c: 143.3 },
            { o: 143.3, h: 145, l: 143, c: 144.7 },
            { o: 144.7, h: 147.42, l: 144.52, c: 146.9 },
            { o: 146.9, h: 149.85, l: 146.57, c: 149.5 },
            { o: 149.5, h: 152, l: 148.93, c: 151.4 },
            { o: 151.4, h: 154.37, l: 150.97, c: 153.8 }
          ],
          zones: [
            {
              from: 0,
              top: 147.8,
              bottom: 131.2,
              kind: "demand",
              label: "Monthly demand",
              faded: true
            },
            {
              from: 0,
              top: 145.8,
              bottom: 134.2,
              kind: "demand",
              label: "Daily demand",
              faded: true
            },
            {
              from: 3,
              top: 144.8,
              bottom: 144.1,
              kind: "supply",
              label: "H1 supply"
            }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Both higher timeframes are demand. Selling against them is counter to the sequence. Price pushed through the H1 supply."
      }
    ],
    cards: [
      {
        front: "MSA?",
        back: "Multiple sequence analysis: entry, its HTF, and the HTF of that HTF."
      },
      {
        front: "Question MSA asks?",
        back: "Why should this higher-timeframe zone hold?"
      },
      {
        front: "Sequence for 1m?",
        back: "1m, 15m, H4."
      },
      {
        front: "Sequence for 5m?",
        back: "5m, H1, Daily."
      },
      {
        front: "Sequence for 15m?",
        back: "15m, H4, Weekly."
      },
      {
        front: "Sequence for H1?",
        back: "H1, Daily, Monthly."
      },
      {
        front: "Risk without an MSA zone?",
        back: "0.25 to 0.5% instead of 1%."
      },
      {
        front: "Expect what win rate?",
        back: "Not amazing, but a very large R:R."
      }
    ],
    mnemonic: "Box, Table, Floor: three levels holding each other up before you stand on it."
  },
  {
    mentor: "kevin-course",
    n: 8,
    eli5: {
      oneLiner: "When both big and small charts go up, buy the closest step.",
      story: "Climbing a ladder, you step on the rung right below your foot, not one far down. When the big picture and the small picture both go up, we buy the nearest zone. But after climbing three rungs in a row really fast, you are out of breath and should rest. And if the rung under your foot snaps, you do not jump to a lower rung unless it has extra support.",
      analogy: "A ladder: step on the nearest rung; after three quick rungs, rest; a broken rung means the climb pauses."
    },
    bigIdeas: [
      "Trend trading = HTF trending AND entry timeframe trending. Then trade the NEAREST entry zone.",
      "Trade the nearest zone until it is removed. The next zone down counts only if it sits inside an ITF zone; otherwise wait for HTF demand.",
      "After three continuation patterns in a row, price is overextended: stop, or cut risk and manage aggressively. Never chase."
    ],
    steps: [
      {
        title: "Both timeframes up",
        narration: "The daily (HTF) is in an objective uptrend, and the H1 (entry) trend line is respected. Only now is it a trend trade.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.56,
              x2: 13,
              y2: 130.27,
              label: "H1 uptrend line"
            }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            }
          ],
          notes: [
            {
              x: 1,
              y: 124.14,
              text: "Daily: uptrend"
            }
          ]
        }
      },
      {
        title: "Buy the nearest zone",
        narration: "Each new rally-base-rally is a continuation pattern (CP). We buy the nearest H1 demand: the newest one closest to price.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.56,
              x2: 18,
              y2: 135.18,
              label: "H1 uptrend line"
            }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 133.75,
              bottom: 133.05,
              kind: "demand",
              label: "CP2"
            }
          ],
          notes: [
            {
              x: 11,
              y: 131.85000000000002,
              text: "nearest zone"
            }
          ]
        }
      },
      {
        title: "Count the CPs",
        narration: "At the second CP he might still risk the full 1% and look for 5:1. Keep counting.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 },
            { o: 143, h: 143.6, l: 142.6, c: 143.3 },
            { o: 143.3, h: 143.6, l: 142.6, c: 143 },
            { o: 143, h: 143.55, l: 142.7, c: 143.25 },
            { o: 143.25, h: 147.55, l: 143.05, c: 147.25 },
            { o: 147.25, h: 151.22, l: 146.94, c: 150.75 },
            { o: 150.75, h: 152.24, l: 150.29, c: 151.85 },
            { o: 151.85, h: 152.8, l: 151.26, c: 152.45 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.56,
              x2: 25,
              y2: 142.05,
              label: "H1 uptrend line"
            }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 133.75,
              bottom: 133.05,
              kind: "demand",
              label: "CP2"
            },
            {
              from: 19,
              top: 143.3,
              bottom: 142.6,
              kind: "demand",
              label: "CP3"
            }
          ]
        }
      },
      {
        title: "Three CPs: overextended",
        narration: "After three CPs in a row, price is overextended. Stop trading that direction, or take it with less risk and move the stop to break even by about 1:1. Price may run without you. Do not chase.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 },
            { o: 143, h: 143.6, l: 142.6, c: 143.3 },
            { o: 143.3, h: 143.6, l: 142.6, c: 143 },
            { o: 143, h: 143.55, l: 142.7, c: 143.25 },
            { o: 143.25, h: 147.55, l: 143.05, c: 147.25 },
            { o: 147.25, h: 151.22, l: 146.94, c: 150.75 },
            { o: 150.75, h: 152.24, l: 150.29, c: 151.85 },
            { o: 151.85, h: 152.8, l: 151.26, c: 152.45 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.56,
              x2: 25,
              y2: 142.05,
              label: "H1 uptrend line"
            }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 133.75,
              bottom: 133.05,
              kind: "demand",
              label: "CP2"
            },
            {
              from: 19,
              top: 143.3,
              bottom: 142.6,
              kind: "demand",
              label: "CP3"
            }
          ],
          highlight: {
            from: 3,
            to: 21,
            label: "3 CPs in a row"
          }
        }
      },
      {
        title: "Nearest zone removed",
        narration: "Price breaks the nearest zone (CP3). The H1 uptrend is lost and now looks sideways. CP2 below is only valid if it sits inside an H4 (ITF) zone. Here it does not, so we wait for the daily demand.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 },
            { o: 143, h: 143.6, l: 142.6, c: 143.3 },
            { o: 143.3, h: 143.6, l: 142.6, c: 143 },
            { o: 143, h: 143.55, l: 142.7, c: 143.25 },
            { o: 143.25, h: 147.55, l: 143.05, c: 147.25 },
            { o: 147.25, h: 151.22, l: 146.94, c: 150.75 },
            { o: 150.75, h: 152.24, l: 150.29, c: 151.85 },
            { o: 151.85, h: 152.8, l: 151.26, c: 152.45 },
            { o: 152.45, h: 152.96, l: 149.28, c: 149.76 },
            { o: 149.76, h: 150.03, l: 146.47, c: 147 },
            { o: 147, h: 147.43, l: 143.69, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.6, c: 142 },
            { o: 142, h: 142.26, l: 140.53, c: 140.8 },
            { o: 140.8, h: 141.67, l: 140.38, c: 141.4 },
            { o: 141.4, h: 141.55, l: 139.59, c: 140 },
            { o: 140, h: 140.16, l: 137.64, c: 138.13 },
            { o: 138.13, h: 138.35, l: 135.98, c: 136.43 },
            { o: 136.43, h: 136.62, l: 134.04, c: 134.35 },
            { o: 134.35, h: 134.65, l: 132.05, c: 132.35 },
            { o: 132.35, h: 132.54, l: 130.09, c: 130.55 },
            { o: 130.55, h: 130.82, l: 128.88, c: 129.15 },
            { o: 129.15, h: 129.75, l: 128.78, c: 129.55 },
            { o: 129.55, h: 129.88, l: 127.48, c: 127.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.56,
              x2: 40,
              y2: 156.78,
              label: "H1 uptrend line",
              broken: true
            }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 133.75,
              bottom: 133.05,
              kind: "demand",
              label: "CP2"
            },
            {
              from: 19,
              top: 143.3,
              bottom: 142.6,
              kind: "demand",
              label: "CP3 removed",
              faded: true
            }
          ],
          notes: [
            {
              x: 29,
              y: 141.1,
              text: "removed"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What makes it a trend trade for him?",
        options: [
          "Only the entry timeframe trending",
          "HTF trending AND entry timeframe trending",
          "Any green candle",
          "An indicator crossing"
        ],
        answer: 1,
        explain: "One timeframe is \"right to an extent\". His rule: the HTF and the ETF must both trend the same way."
      },
      {
        type: "spot",
        q: "Click the basing of the third continuation pattern.",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 },
            { o: 143, h: 143.6, l: 142.6, c: 143.3 },
            { o: 143.3, h: 143.6, l: 142.6, c: 143 },
            { o: 143, h: 143.55, l: 142.7, c: 143.25 },
            { o: 143.25, h: 147.55, l: 143.05, c: 147.25 },
            { o: 147.25, h: 151.22, l: 146.94, c: 150.75 },
            { o: 150.75, h: 152.24, l: 150.29, c: 151.85 },
            { o: 151.85, h: 152.8, l: 151.26, c: 152.45 }
          ]
        },
        answer: {
          from: 19,
          to: 21
        },
        explain: "Third rally-base-rally in a row: price is overextended here. Stop, or cut risk and manage aggressively."
      },
      {
        type: "tf",
        q: "After the nearest zone is removed, you can always buy the next zone down.",
        answer: false,
        explain: "Only if that zone sits inside an ITF zone (H4 for an H1 entry). Otherwise wait for HTF demand."
      },
      {
        type: "mcq",
        q: "You take a third-CP trade anyway. How?",
        options: [
          "Double the risk",
          "Less risk, move stop to break even by about 1:1",
          "No stop",
          "Hold to 20:1 no matter what"
        ],
        answer: 1,
        explain: "Reduced risk and aggressive management: break even (or take profit) around 1:1."
      },
      {
        type: "tf",
        q: "A trending HTF means you buy every nearest zone, whatever it looks like.",
        answer: false,
        explain: "Zone quality still matters. A poor nearest zone is not automatically a buy."
      },
      {
        type: "tf",
        q: "If price runs straight up without you, chase it.",
        answer: false,
        explain: "\"I cannot stress that enough\": do not chase. You will miss some trades."
      }
    ],
    practice: [
      {
        prompt: "Daily uptrend, H1 uptrend, only two CPs so far. Price pulls back to the nearest H1 demand.",
        scene: {
          candles: [
            { o: 120, h: 121.95, l: 119.5, c: 121.8 },
            { o: 121.8, h: 124.48, l: 121.38, c: 123.9 },
            { o: 123.9, h: 125.86, l: 123.32, c: 125.4 },
            { o: 125.4, h: 126, l: 125, c: 125.7 },
            { o: 125.7, h: 126, l: 125, c: 125.4 },
            { o: 125.4, h: 125.95, l: 125.1, c: 125.65 },
            { o: 125.65, h: 130.45, l: 125.45, c: 130.15 },
            { o: 130.15, h: 134.49, l: 129.7, c: 133.95 },
            { o: 133.95, h: 135.62, l: 133.51, c: 135.15 },
            { o: 135.15, h: 135.5, l: 133.93, c: 134.35 },
            { o: 134.35, h: 135.66, l: 133.82, c: 135.45 },
            { o: 135.45, h: 136.05, l: 135.05, c: 135.75 },
            { o: 135.75, h: 136.05, l: 135.05, c: 135.45 },
            { o: 135.45, h: 136, l: 135.15, c: 135.7 },
            { o: 135.7, h: 140.2, l: 135.5, c: 139.9 },
            { o: 139.9, h: 143.82, l: 139.55, c: 143.5 },
            { o: 143.5, h: 144.67, l: 143.07, c: 144.5 },
            { o: 144.5, h: 146.25, l: 144.13, c: 145.9 },
            { o: 145.9, h: 146.16, l: 145.01, c: 145.3 },
            { o: 145.3, h: 146.68, l: 145.02, c: 146.4 },
            { o: 146.4, h: 146.64, l: 143.54, c: 143.93 },
            { o: 143.93, h: 144.13, l: 141.26, c: 141.64 },
            { o: 141.64, h: 142.02, l: 138.85, c: 139.24 },
            { o: 139.24, h: 139.79, l: 136.44, c: 136.75 },
            { o: 136.75, h: 137.05, l: 135.47, c: 136.35 },
            { o: 136.35, h: 139.51, l: 135.81, c: 138.95 },
            { o: 138.95, h: 142.11, l: 138.68, c: 141.95 },
            { o: 141.95, h: 144.93, l: 141.68, c: 144.35 },
            { o: 144.35, h: 144.76, l: 143.48, c: 143.75 },
            { o: 143.75, h: 147.05, l: 143.41, c: 146.55 }
          ],
          zones: [
            {
              from: 0,
              top: 127.7,
              bottom: 121,
              kind: "demand",
              label: "Daily uptrend + demand",
              faded: true
            },
            {
              from: 3,
              top: 125.7,
              bottom: 125,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 135.75,
              bottom: 135.05,
              kind: "demand",
              label: "CP2 (nearest)"
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Both timeframes up, nearest zone, second CP: he might risk the full 1% here. Price bounced and continued the trend."
      },
      {
        prompt: "The nearest zone (CP3) just broke. Price is falling toward CP2, which is not inside any H4 zone. Buy CP2?",
        scene: {
          candles: [
            { o: 118, h: 119.95, l: 117.56, c: 119.8 },
            { o: 119.8, h: 122.14, l: 119.58, c: 121.9 },
            { o: 121.9, h: 123.62, l: 121.42, c: 123.4 },
            { o: 123.4, h: 124, l: 123, c: 123.7 },
            { o: 123.7, h: 124, l: 123, c: 123.4 },
            { o: 123.4, h: 123.95, l: 123.1, c: 123.65 },
            { o: 123.65, h: 128.45, l: 123.45, c: 128.15 },
            { o: 128.15, h: 132.46, l: 127.56, c: 131.95 },
            { o: 131.95, h: 133.31, l: 131.48, c: 133.15 },
            { o: 133.15, h: 133.33, l: 132.17, c: 132.35 },
            { o: 132.35, h: 133.74, l: 131.84, c: 133.45 },
            { o: 133.45, h: 134.05, l: 133.05, c: 133.75 },
            { o: 133.75, h: 134.05, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134, l: 133.15, c: 133.7 },
            { o: 133.7, h: 138.2, l: 133.5, c: 137.9 },
            { o: 137.9, h: 141.8, l: 137.34, c: 141.5 },
            { o: 141.5, h: 142.81, l: 141.07, c: 142.5 },
            { o: 142.5, h: 142.68, l: 141.46, c: 141.8 },
            { o: 141.8, h: 143.52, l: 141.37, c: 143 },
            { o: 143, h: 143.6, l: 142.6, c: 143.3 },
            { o: 143.3, h: 143.6, l: 142.6, c: 143 },
            { o: 143, h: 143.55, l: 142.7, c: 143.25 },
            { o: 143.25, h: 147.55, l: 143.05, c: 147.25 },
            { o: 147.25, h: 151.22, l: 146.94, c: 150.75 },
            { o: 150.75, h: 152.24, l: 150.29, c: 151.85 },
            { o: 151.85, h: 152.8, l: 151.26, c: 152.45 },
            { o: 152.45, h: 152.96, l: 149.28, c: 149.76 },
            { o: 149.76, h: 150.03, l: 146.47, c: 147 },
            { o: 147, h: 147.43, l: 143.69, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.6, c: 142 },
            { o: 142, h: 142.26, l: 140.53, c: 140.8 },
            { o: 140.8, h: 141.67, l: 140.38, c: 141.4 },
            { o: 141.4, h: 141.55, l: 139.59, c: 140 },
            { o: 140, h: 140.16, l: 137.64, c: 138.13 },
            { o: 138.13, h: 138.35, l: 135.98, c: 136.43 },
            { o: 136.43, h: 136.62, l: 134.04, c: 134.35 },
            { o: 134.35, h: 134.65, l: 132.05, c: 132.35 },
            { o: 132.35, h: 132.54, l: 130.09, c: 130.55 },
            { o: 130.55, h: 130.82, l: 128.88, c: 129.15 },
            { o: 129.15, h: 129.75, l: 128.78, c: 129.55 },
            { o: 129.55, h: 129.88, l: 127.48, c: 127.95 }
          ],
          zones: [
            {
              from: 3,
              top: 123.7,
              bottom: 123,
              kind: "demand",
              label: "CP1"
            },
            {
              from: 11,
              top: 133.75,
              bottom: 133.05,
              kind: "demand",
              label: "CP2"
            },
            {
              from: 19,
              top: 143.3,
              bottom: 142.6,
              kind: "demand",
              label: "CP3 removed",
              faded: true
            }
          ],
          reveal: 36
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Once the nearest zone is removed you lose the H1 uptrend. CP2 is not inside an ITF zone, so you wait for HTF demand. Price broke CP2 too."
      }
    ],
    cards: [
      {
        front: "Trend trading needs...?",
        back: "HTF trending AND entry timeframe trending, same direction."
      },
      {
        front: "Which zone do you trade?",
        back: "The NEAREST entry-timeframe zone, until it is removed."
      },
      {
        front: "Nearest zone broke. Next zone down?",
        back: "Only if inside an ITF zone. Otherwise wait for HTF demand."
      },
      {
        front: "Three-CP rule?",
        back: "After 3 CPs in a row, stop or cut risk: price is overextended."
      },
      {
        front: "Third CP management?",
        back: "Less risk, break even by about 1:1."
      },
      {
        front: "Second CP?",
        back: "Full 1% risk possible, look for 5:1."
      },
      {
        front: "Price runs without you?",
        back: "Let it go. Never chase."
      }
    ],
    mnemonic: "Nearest, Count to Three, Never Chase."
  },
  {
    mentor: "kevin-course",
    n: 9,
    eli5: {
      oneLiner: "For dividend stocks, buy zones on giant charts, and buy more the bigger the zone.",
      story: "Think of a fruit tree that gives you apples every few months. You want to own more of that tree. You buy a little when the price dips a bit, and a lot when the price dips a lot. You do not sell when it gets cheaper, because the tree still gives apples. But you never rush to buy right after the price shot up.",
      analogy: "A sale at your favourite shop: small sale = small basket, huge sale = big basket. And you do not pay full price right after a price jump."
    },
    bigIdeas: [
      "Dividend investing only: buy zones on 12M, 6M, 3M and 1M charts, with no stop loss about 99% of the time.",
      "Bigger timeframe zone = bigger pullback = bigger buy (for example $100 at 1M up to $500 at 12M).",
      "Rising market: do not chase. Wait for a base, new demand, a break of the prior high, then buy the pullback."
    ],
    steps: [
      {
        title: "Map the macro zones",
        narration: "On the 1M, 3M, 6M and 12M charts, mark the demand zones. These huge zones are where he buys.",
        scene: {
          candles: [
            { o: 192, h: 192.15, l: 188.41, c: 189 },
            { o: 189, h: 189.49, l: 186.02, c: 186.5 },
            { o: 186.5, h: 187.1, l: 186.05, c: 186.8 },
            { o: 186.8, h: 187.15, l: 186.1, c: 186.5 },
            { o: 186.5, h: 190.07, l: 185.93, c: 189.7 },
            { o: 189.7, h: 191.48, l: 189.2, c: 191.2 },
            { o: 191.2, h: 191.72, l: 188.62, c: 188.8 },
            { o: 188.8, h: 189.35, l: 185.03, c: 185.3 },
            { o: 185.3, h: 185.73, l: 181.28, c: 181.5 },
            { o: 181.5, h: 182.04, l: 178.66, c: 178.9 },
            { o: 178.9, h: 179.5, l: 178.45, c: 179.2 },
            { o: 179.2, h: 179.55, l: 178.5, c: 178.9 },
            { o: 178.9, h: 182.08, l: 178.43, c: 181.9 },
            { o: 181.9, h: 183.65, l: 181.71, c: 183.1 },
            { o: 183.1, h: 183.7, l: 179.53, c: 179.9 },
            { o: 179.9, h: 180.32, l: 175.85, c: 176.3 },
            { o: 176.3, h: 176.45, l: 172.82, c: 173.4 },
            { o: 173.4, h: 173.72, l: 170.62, c: 171 },
            { o: 171, h: 171.6, l: 170.55, c: 171.3 },
            { o: 171.3, h: 171.65, l: 170.6, c: 171 },
            { o: 171, h: 174.34, l: 170.49, c: 173.8 },
            { o: 173.8, h: 175.33, l: 173.49, c: 174.8 },
            { o: 174.8, h: 175.35, l: 171.51, c: 171.8 },
            { o: 171.8, h: 172.39, l: 167.96, c: 168.5 },
            { o: 168.5, h: 168.91, l: 165.47, c: 166 },
            { o: 166, h: 166.23, l: 164.54, c: 164.8 },
            { o: 164.8, h: 165.4, l: 164.35, c: 165.1 },
            { o: 165.1, h: 165.4, l: 164.25, c: 164.75 },
            { o: 164.75, h: 165.35, l: 164.45, c: 165 },
            { o: 165, h: 169.3, l: 164.8, c: 169 },
            { o: 169, h: 172.97, l: 168.66, c: 172.6 },
            { o: 172.6, h: 175.59, l: 172.2, c: 175.1 },
            { o: 175.1, h: 177.18, l: 174.67, c: 176.9 }
          ],
          zones: [
            {
              from: 2,
              top: 186.8,
              bottom: 186.05,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 10,
              top: 179.2,
              bottom: 178.45,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 18,
              top: 171.3,
              bottom: 170.55,
              kind: "demand",
              label: "1M demand: buy $100"
            }
          ]
        }
      },
      {
        title: "Buy the zones on the way down",
        narration: "While the stock trends down, he keeps buying 1M demand zones and collecting the dividend. No stop: this is investing, not trading.",
        scene: {
          candles: [
            { o: 192, h: 192.15, l: 188.41, c: 189 },
            { o: 189, h: 189.49, l: 186.02, c: 186.5 },
            { o: 186.5, h: 187.1, l: 186.05, c: 186.8 },
            { o: 186.8, h: 187.15, l: 186.1, c: 186.5 },
            { o: 186.5, h: 190.07, l: 185.93, c: 189.7 },
            { o: 189.7, h: 191.48, l: 189.2, c: 191.2 },
            { o: 191.2, h: 191.72, l: 188.62, c: 188.8 },
            { o: 188.8, h: 189.35, l: 185.03, c: 185.3 },
            { o: 185.3, h: 185.73, l: 181.28, c: 181.5 },
            { o: 181.5, h: 182.04, l: 178.66, c: 178.9 },
            { o: 178.9, h: 179.5, l: 178.45, c: 179.2 },
            { o: 179.2, h: 179.55, l: 178.5, c: 178.9 },
            { o: 178.9, h: 182.08, l: 178.43, c: 181.9 },
            { o: 181.9, h: 183.65, l: 181.71, c: 183.1 },
            { o: 183.1, h: 183.7, l: 179.53, c: 179.9 },
            { o: 179.9, h: 180.32, l: 175.85, c: 176.3 },
            { o: 176.3, h: 176.45, l: 172.82, c: 173.4 },
            { o: 173.4, h: 173.72, l: 170.62, c: 171 },
            { o: 171, h: 171.6, l: 170.55, c: 171.3 },
            { o: 171.3, h: 171.65, l: 170.6, c: 171 },
            { o: 171, h: 174.34, l: 170.49, c: 173.8 },
            { o: 173.8, h: 175.33, l: 173.49, c: 174.8 },
            { o: 174.8, h: 175.35, l: 171.51, c: 171.8 },
            { o: 171.8, h: 172.39, l: 167.96, c: 168.5 },
            { o: 168.5, h: 168.91, l: 165.47, c: 166 },
            { o: 166, h: 166.23, l: 164.54, c: 164.8 },
            { o: 164.8, h: 165.4, l: 164.35, c: 165.1 },
            { o: 165.1, h: 165.4, l: 164.25, c: 164.75 },
            { o: 164.75, h: 165.35, l: 164.45, c: 165 },
            { o: 165, h: 169.3, l: 164.8, c: 169 },
            { o: 169, h: 172.97, l: 168.66, c: 172.6 },
            { o: 172.6, h: 175.59, l: 172.2, c: 175.1 },
            { o: 175.1, h: 177.18, l: 174.67, c: 176.9 }
          ],
          zones: [
            {
              from: 2,
              top: 186.8,
              bottom: 186.05,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 10,
              top: 179.2,
              bottom: 178.45,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 18,
              top: 171.3,
              bottom: 170.55,
              kind: "demand",
              label: "1M demand: buy $100"
            }
          ],
          notes: [
            {
              x: 2,
              y: 184.55,
              text: "buy"
            },
            {
              x: 10,
              y: 176.95,
              text: "buy"
            },
            {
              x: 18,
              y: 169.05,
              text: "buy"
            }
          ]
        }
      },
      {
        title: "Biggest zone, biggest buy",
        narration: "Now price reaches a 12-month demand zone, about 14% down from the highs. The highest-timeframe zone gets the biggest buy.",
        scene: {
          candles: [
            { o: 192, h: 192.15, l: 188.41, c: 189 },
            { o: 189, h: 189.49, l: 186.02, c: 186.5 },
            { o: 186.5, h: 187.1, l: 186.05, c: 186.8 },
            { o: 186.8, h: 187.15, l: 186.1, c: 186.5 },
            { o: 186.5, h: 190.07, l: 185.93, c: 189.7 },
            { o: 189.7, h: 191.48, l: 189.2, c: 191.2 },
            { o: 191.2, h: 191.72, l: 188.62, c: 188.8 },
            { o: 188.8, h: 189.35, l: 185.03, c: 185.3 },
            { o: 185.3, h: 185.73, l: 181.28, c: 181.5 },
            { o: 181.5, h: 182.04, l: 178.66, c: 178.9 },
            { o: 178.9, h: 179.5, l: 178.45, c: 179.2 },
            { o: 179.2, h: 179.55, l: 178.5, c: 178.9 },
            { o: 178.9, h: 182.08, l: 178.43, c: 181.9 },
            { o: 181.9, h: 183.65, l: 181.71, c: 183.1 },
            { o: 183.1, h: 183.7, l: 179.53, c: 179.9 },
            { o: 179.9, h: 180.32, l: 175.85, c: 176.3 },
            { o: 176.3, h: 176.45, l: 172.82, c: 173.4 },
            { o: 173.4, h: 173.72, l: 170.62, c: 171 },
            { o: 171, h: 171.6, l: 170.55, c: 171.3 },
            { o: 171.3, h: 171.65, l: 170.6, c: 171 },
            { o: 171, h: 174.34, l: 170.49, c: 173.8 },
            { o: 173.8, h: 175.33, l: 173.49, c: 174.8 },
            { o: 174.8, h: 175.35, l: 171.51, c: 171.8 },
            { o: 171.8, h: 172.39, l: 167.96, c: 168.5 },
            { o: 168.5, h: 168.91, l: 165.47, c: 166 },
            { o: 166, h: 166.23, l: 164.54, c: 164.8 },
            { o: 164.8, h: 165.4, l: 164.35, c: 165.1 },
            { o: 165.1, h: 165.4, l: 164.25, c: 164.75 },
            { o: 164.75, h: 165.35, l: 164.45, c: 165 },
            { o: 165, h: 169.3, l: 164.8, c: 169 },
            { o: 169, h: 172.97, l: 168.66, c: 172.6 },
            { o: 172.6, h: 175.59, l: 172.2, c: 175.1 },
            { o: 175.1, h: 177.18, l: 174.67, c: 176.9 }
          ],
          zones: [
            {
              from: 2,
              top: 186.8,
              bottom: 186.05,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 10,
              top: 179.2,
              bottom: 178.45,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 18,
              top: 171.3,
              bottom: 170.55,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 26,
              top: 167.1,
              bottom: 162.75,
              kind: "demand",
              label: "12M demand: buy $500"
            }
          ]
        }
      },
      {
        title: "Only if...",
        narration: "Keep buying lower only if you believe in the company long term, it still pays a dividend, and your capital is consistent. If it goes sideways for years, you still collect the dividend.",
        scene: {
          candles: [
            { o: 192, h: 192.15, l: 188.41, c: 189 },
            { o: 189, h: 189.49, l: 186.02, c: 186.5 },
            { o: 186.5, h: 187.1, l: 186.05, c: 186.8 },
            { o: 186.8, h: 187.15, l: 186.1, c: 186.5 },
            { o: 186.5, h: 190.07, l: 185.93, c: 189.7 },
            { o: 189.7, h: 191.48, l: 189.2, c: 191.2 },
            { o: 191.2, h: 191.72, l: 188.62, c: 188.8 },
            { o: 188.8, h: 189.35, l: 185.03, c: 185.3 },
            { o: 185.3, h: 185.73, l: 181.28, c: 181.5 },
            { o: 181.5, h: 182.04, l: 178.66, c: 178.9 },
            { o: 178.9, h: 179.5, l: 178.45, c: 179.2 },
            { o: 179.2, h: 179.55, l: 178.5, c: 178.9 },
            { o: 178.9, h: 182.08, l: 178.43, c: 181.9 },
            { o: 181.9, h: 183.65, l: 181.71, c: 183.1 },
            { o: 183.1, h: 183.7, l: 179.53, c: 179.9 },
            { o: 179.9, h: 180.32, l: 175.85, c: 176.3 },
            { o: 176.3, h: 176.45, l: 172.82, c: 173.4 },
            { o: 173.4, h: 173.72, l: 170.62, c: 171 },
            { o: 171, h: 171.6, l: 170.55, c: 171.3 },
            { o: 171.3, h: 171.65, l: 170.6, c: 171 },
            { o: 171, h: 174.34, l: 170.49, c: 173.8 },
            { o: 173.8, h: 175.33, l: 173.49, c: 174.8 },
            { o: 174.8, h: 175.35, l: 171.51, c: 171.8 },
            { o: 171.8, h: 172.39, l: 167.96, c: 168.5 },
            { o: 168.5, h: 168.91, l: 165.47, c: 166 },
            { o: 166, h: 166.23, l: 164.54, c: 164.8 },
            { o: 164.8, h: 165.4, l: 164.35, c: 165.1 },
            { o: 165.1, h: 165.4, l: 164.25, c: 164.75 },
            { o: 164.75, h: 165.35, l: 164.45, c: 165 },
            { o: 165, h: 169.3, l: 164.8, c: 169 },
            { o: 169, h: 172.97, l: 168.66, c: 172.6 },
            { o: 172.6, h: 175.59, l: 172.2, c: 175.1 },
            { o: 175.1, h: 177.18, l: 174.67, c: 176.9 }
          ],
          zones: [
            {
              from: 2,
              top: 186.8,
              bottom: 186.05,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 10,
              top: 179.2,
              bottom: 178.45,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 18,
              top: 171.3,
              bottom: 170.55,
              kind: "demand",
              label: "1M demand: buy $100"
            },
            {
              from: 26,
              top: 167.1,
              bottom: 162.75,
              kind: "demand",
              label: "12M demand: buy $500"
            }
          ],
          highlight: {
            from: 26,
            to: 32,
            label: "heavy buying"
          }
        }
      },
      {
        title: "Rising market: do not chase",
        narration: "After a big run up, buying at the highs is not a great idea. Wait.",
        scene: {
          candles: [
            { o: 117, h: 117.65, l: 116.8, c: 117.5 },
            { o: 117.5, h: 117.88, l: 116.86, c: 117.1 },
            { o: 117.1, h: 117.96, l: 116.89, c: 117.8 },
            { o: 117.8, h: 118.1, l: 117.15, c: 117.5 },
            { o: 117.5, h: 118.47, l: 116.9, c: 118.1 },
            { o: 118.1, h: 118.78, l: 117.6, c: 118.5 },
            { o: 118.5, h: 121.45, l: 118.27, c: 121.1 },
            { o: 121.1, h: 124.76, l: 120.62, c: 124.2 },
            { o: 124.2, h: 127.09, l: 123.73, c: 126.6 },
            { o: 126.6, h: 129.77, l: 126.38, c: 129.5 },
            { o: 129.5, h: 133.13, l: 129.27, c: 132.8 },
            { o: 132.8, h: 135.73, l: 132.38, c: 135.5 }
          ],
          highlight: {
            from: 6,
            to: 11,
            label: "big run - do not chase"
          }
        }
      },
      {
        title: "Base, break the high, buy the pullback",
        narration: "Price pulls back, bases, and rallies through the prior high. That proves price can push up. The new demand below becomes a discount buy on the pullback.",
        scene: {
          candles: [
            { o: 117, h: 117.65, l: 116.8, c: 117.5 },
            { o: 117.5, h: 117.88, l: 116.86, c: 117.1 },
            { o: 117.1, h: 117.96, l: 116.89, c: 117.8 },
            { o: 117.8, h: 118.1, l: 117.15, c: 117.5 },
            { o: 117.5, h: 118.47, l: 116.9, c: 118.1 },
            { o: 118.1, h: 118.78, l: 117.6, c: 118.5 },
            { o: 118.5, h: 121.45, l: 118.27, c: 121.1 },
            { o: 121.1, h: 124.76, l: 120.62, c: 124.2 },
            { o: 124.2, h: 127.09, l: 123.73, c: 126.6 },
            { o: 126.6, h: 129.77, l: 126.38, c: 129.5 },
            { o: 129.5, h: 133.13, l: 129.27, c: 132.8 },
            { o: 132.8, h: 135.73, l: 132.38, c: 135.5 },
            { o: 135.5, h: 136.03, l: 132.74, c: 133.1 },
            { o: 133.1, h: 133.46, l: 130.08, c: 130.3 },
            { o: 130.3, h: 130.57, l: 127.82, c: 128.2 },
            { o: 128.2, h: 128.69, l: 126.6, c: 126.8 },
            { o: 126.8, h: 127.4, l: 126.35, c: 127.1 },
            { o: 127.1, h: 127.4, l: 126.25, c: 126.75 },
            { o: 126.75, h: 127.35, l: 126.45, c: 127 },
            { o: 127, h: 131.9, l: 126.8, c: 131.6 },
            { o: 131.6, h: 136.2, l: 131.3, c: 135.8 },
            { o: 135.8, h: 138.62, l: 135.48, c: 138.4 },
            { o: 138.4, h: 140.27, l: 138.16, c: 139.8 },
            { o: 139.8, h: 140.84, l: 139.38, c: 140.6 },
            { o: 140.6, h: 140.83, l: 139.57, c: 140 },
            { o: 140, h: 140.33, l: 137.8, c: 138.16 },
            { o: 138.16, h: 138.73, l: 135.55, c: 136 },
            { o: 136, h: 136.33, l: 133.77, c: 133.96 },
            { o: 133.96, h: 134.34, l: 131.45, c: 132.02 },
            { o: 132.02, h: 132.3, l: 130.26, c: 130.44 },
            { o: 130.44, h: 130.73, l: 127.81, c: 128.3 },
            { o: 128.3, h: 128.6, l: 126.76, c: 127.7 },
            { o: 127.7, h: 130.51, l: 127.26, c: 130.1 },
            { o: 130.1, h: 133.41, l: 129.85, c: 133 },
            { o: 133, h: 135.54, l: 132.63, c: 135.2 },
            { o: 135.2, h: 138.21, l: 134.7, c: 137.9 }
          ],
          zones: [
            {
              from: 16,
              top: 127.1,
              bottom: 126.25,
              kind: "demand",
              label: "new demand - buy pullback"
            }
          ],
          lines: [
            {
              y: 135.73,
              label: "prior high broken",
              kind: "level",
              from: 11
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "The no-stop approach is fine for normal trading too.",
        answer: false,
        explain: "No stop is ONLY for dividend investing. Using it for trading is a listed mistake."
      },
      {
        type: "mcq",
        q: "Which zone gets the biggest buy?",
        options: [
          "1-month",
          "3-month",
          "6-month",
          "12-month"
        ],
        answer: 3,
        explain: "The larger the timeframe, the bigger the pullback, so the bigger the buy."
      },
      {
        type: "spot",
        q: "Click the basing of the new demand that broke the prior high.",
        scene: {
          candles: [
            { o: 117, h: 117.65, l: 116.8, c: 117.5 },
            { o: 117.5, h: 117.88, l: 116.86, c: 117.1 },
            { o: 117.1, h: 117.96, l: 116.89, c: 117.8 },
            { o: 117.8, h: 118.1, l: 117.15, c: 117.5 },
            { o: 117.5, h: 118.47, l: 116.9, c: 118.1 },
            { o: 118.1, h: 118.78, l: 117.6, c: 118.5 },
            { o: 118.5, h: 121.45, l: 118.27, c: 121.1 },
            { o: 121.1, h: 124.76, l: 120.62, c: 124.2 },
            { o: 124.2, h: 127.09, l: 123.73, c: 126.6 },
            { o: 126.6, h: 129.77, l: 126.38, c: 129.5 },
            { o: 129.5, h: 133.13, l: 129.27, c: 132.8 },
            { o: 132.8, h: 135.73, l: 132.38, c: 135.5 },
            { o: 135.5, h: 136.03, l: 132.74, c: 133.1 },
            { o: 133.1, h: 133.46, l: 130.08, c: 130.3 },
            { o: 130.3, h: 130.57, l: 127.82, c: 128.2 },
            { o: 128.2, h: 128.69, l: 126.6, c: 126.8 },
            { o: 126.8, h: 127.4, l: 126.35, c: 127.1 },
            { o: 127.1, h: 127.4, l: 126.25, c: 126.75 },
            { o: 126.75, h: 127.35, l: 126.45, c: 127 },
            { o: 127, h: 131.9, l: 126.8, c: 131.6 },
            { o: 131.6, h: 136.2, l: 131.3, c: 135.8 },
            { o: 135.8, h: 138.62, l: 135.48, c: 138.4 },
            { o: 138.4, h: 140.27, l: 138.16, c: 139.8 },
            { o: 139.8, h: 140.84, l: 139.38, c: 140.6 },
            { o: 140.6, h: 140.83, l: 139.57, c: 140 },
            { o: 140, h: 140.33, l: 137.8, c: 138.16 },
            { o: 138.16, h: 138.73, l: 135.55, c: 136 },
            { o: 136, h: 136.33, l: 133.77, c: 133.96 },
            { o: 133.96, h: 134.34, l: 131.45, c: 132.02 },
            { o: 132.02, h: 132.3, l: 130.26, c: 130.44 },
            { o: 130.44, h: 130.73, l: 127.81, c: 128.3 },
            { o: 128.3, h: 128.6, l: 126.76, c: 127.7 },
            { o: 127.7, h: 130.51, l: 127.26, c: 130.1 },
            { o: 130.1, h: 133.41, l: 129.85, c: 133 },
            { o: 133, h: 135.54, l: 132.63, c: 135.2 },
            { o: 135.2, h: 138.21, l: 134.7, c: 137.9 }
          ]
        },
        answer: {
          from: 16,
          to: 18
        },
        explain: "This base launched the rally that broke the prior high. That demand is the discount buy on the pullback."
      },
      {
        type: "mcq",
        q: "The stock just ran up a lot. What do you do?",
        options: [
          "Buy now before it runs more",
          "Wait for a base, new demand and a pullback",
          "Sell short",
          "Buy with a tight stop"
        ],
        answer: 1,
        explain: "Do not chase. Wait for price to base, create demand, break the prior high, then buy the pullback."
      },
      {
        type: "order",
        q: "Order the conditions for buying a falling dividend stock.",
        items: [
          "Price is in a 1M/3M/6M/12M demand zone",
          "You believe in the company long term",
          "It still pays a dividend",
          "Your capital is consistent"
        ],
        explain: "All of these must be true before you keep buying lower."
      },
      {
        type: "tf",
        q: "Buying low gives you dividends AND capital gains.",
        answer: true,
        explain: "Buying at the highs still collects dividends but can leave you down 50%. Buying low adds capital gains."
      }
    ],
    practice: [
      {
        prompt: "This index just ran up hard for months. Buy now?",
        scene: {
          candles: [
            { o: 117, h: 117.65, l: 116.8, c: 117.5 },
            { o: 117.5, h: 117.88, l: 116.86, c: 117.1 },
            { o: 117.1, h: 117.96, l: 116.89, c: 117.8 },
            { o: 117.8, h: 118.1, l: 117.15, c: 117.5 },
            { o: 117.5, h: 118.47, l: 116.9, c: 118.1 },
            { o: 118.1, h: 118.78, l: 117.6, c: 118.5 },
            { o: 118.5, h: 121.45, l: 118.27, c: 121.1 },
            { o: 121.1, h: 124.76, l: 120.62, c: 124.2 },
            { o: 124.2, h: 127.09, l: 123.73, c: 126.6 },
            { o: 126.6, h: 129.77, l: 126.38, c: 129.5 },
            { o: 129.5, h: 133.13, l: 129.27, c: 132.8 },
            { o: 132.8, h: 135.73, l: 132.38, c: 135.5 },
            { o: 135.5, h: 136.03, l: 132.74, c: 133.1 },
            { o: 133.1, h: 133.46, l: 130.08, c: 130.3 },
            { o: 130.3, h: 130.57, l: 127.82, c: 128.2 },
            { o: 128.2, h: 128.69, l: 126.6, c: 126.8 },
            { o: 126.8, h: 127.4, l: 126.35, c: 127.1 },
            { o: 127.1, h: 127.4, l: 126.25, c: 126.75 },
            { o: 126.75, h: 127.35, l: 126.45, c: 127 },
            { o: 127, h: 131.9, l: 126.8, c: 131.6 },
            { o: 131.6, h: 136.2, l: 131.3, c: 135.8 },
            { o: 135.8, h: 138.62, l: 135.48, c: 138.4 },
            { o: 138.4, h: 140.27, l: 138.16, c: 139.8 },
            { o: 139.8, h: 140.84, l: 139.38, c: 140.6 },
            { o: 140.6, h: 140.83, l: 139.57, c: 140 },
            { o: 140, h: 140.33, l: 137.8, c: 138.16 },
            { o: 138.16, h: 138.73, l: 135.55, c: 136 },
            { o: 136, h: 136.33, l: 133.77, c: 133.96 },
            { o: 133.96, h: 134.34, l: 131.45, c: 132.02 },
            { o: 132.02, h: 132.3, l: 130.26, c: 130.44 },
            { o: 130.44, h: 130.73, l: 127.81, c: 128.3 },
            { o: 128.3, h: 128.6, l: 126.76, c: 127.7 },
            { o: 127.7, h: 130.51, l: 127.26, c: 130.1 },
            { o: 130.1, h: 133.41, l: 129.85, c: 133 },
            { o: 133, h: 135.54, l: 132.63, c: 135.2 },
            { o: 135.2, h: 138.21, l: 134.7, c: 137.9 }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Do not chase after a big run. Price pulled back next. Waiting gave a much better price."
      },
      {
        prompt: "Price based, broke the prior high, and is now pulling back to the new demand.",
        scene: {
          candles: [
            { o: 117, h: 117.65, l: 116.8, c: 117.5 },
            { o: 117.5, h: 117.88, l: 116.86, c: 117.1 },
            { o: 117.1, h: 117.96, l: 116.89, c: 117.8 },
            { o: 117.8, h: 118.1, l: 117.15, c: 117.5 },
            { o: 117.5, h: 118.47, l: 116.9, c: 118.1 },
            { o: 118.1, h: 118.78, l: 117.6, c: 118.5 },
            { o: 118.5, h: 121.45, l: 118.27, c: 121.1 },
            { o: 121.1, h: 124.76, l: 120.62, c: 124.2 },
            { o: 124.2, h: 127.09, l: 123.73, c: 126.6 },
            { o: 126.6, h: 129.77, l: 126.38, c: 129.5 },
            { o: 129.5, h: 133.13, l: 129.27, c: 132.8 },
            { o: 132.8, h: 135.73, l: 132.38, c: 135.5 },
            { o: 135.5, h: 136.03, l: 132.74, c: 133.1 },
            { o: 133.1, h: 133.46, l: 130.08, c: 130.3 },
            { o: 130.3, h: 130.57, l: 127.82, c: 128.2 },
            { o: 128.2, h: 128.69, l: 126.6, c: 126.8 },
            { o: 126.8, h: 127.4, l: 126.35, c: 127.1 },
            { o: 127.1, h: 127.4, l: 126.25, c: 126.75 },
            { o: 126.75, h: 127.35, l: 126.45, c: 127 },
            { o: 127, h: 131.9, l: 126.8, c: 131.6 },
            { o: 131.6, h: 136.2, l: 131.3, c: 135.8 },
            { o: 135.8, h: 138.62, l: 135.48, c: 138.4 },
            { o: 138.4, h: 140.27, l: 138.16, c: 139.8 },
            { o: 139.8, h: 140.84, l: 139.38, c: 140.6 },
            { o: 140.6, h: 140.83, l: 139.57, c: 140 },
            { o: 140, h: 140.33, l: 137.8, c: 138.16 },
            { o: 138.16, h: 138.73, l: 135.55, c: 136 },
            { o: 136, h: 136.33, l: 133.77, c: 133.96 },
            { o: 133.96, h: 134.34, l: 131.45, c: 132.02 },
            { o: 132.02, h: 132.3, l: 130.26, c: 130.44 },
            { o: 130.44, h: 130.73, l: 127.81, c: 128.3 },
            { o: 128.3, h: 128.6, l: 126.76, c: 127.7 },
            { o: 127.7, h: 130.51, l: 127.26, c: 130.1 },
            { o: 130.1, h: 133.41, l: 129.85, c: 133 },
            { o: 133, h: 135.54, l: 132.63, c: 135.2 },
            { o: 135.2, h: 138.21, l: 134.7, c: 137.9 }
          ],
          zones: [
            {
              from: 16,
              top: 127.1,
              bottom: 126.25,
              kind: "demand",
              label: "new demand"
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "Price proved it can push up past the prior high. The demand below is a discount buy. It pushed up again."
      }
    ],
    cards: [
      {
        front: "Charts for dividend investing?",
        back: "12M, 6M, 3M and 1M."
      },
      {
        front: "Stop loss for dividend investing?",
        back: "None, about 99% of the time. Dividend investing ONLY."
      },
      {
        front: "Sizing rule?",
        back: "Bigger timeframe zone = bigger buy (e.g. $100 at 1M to $500 at 12M)."
      },
      {
        front: "Rising market buy?",
        back: "Wait for a base, new demand, a break of the prior high, then buy the pullback."
      },
      {
        front: "Keep buying a falling stock only if...?",
        back: "You believe in it, it pays a dividend, and your capital is consistent."
      },
      {
        front: "Why buy low, not high?",
        back: "You get dividends plus capital gains."
      }
    ],
    mnemonic: "Bigger Dip, Bigger Basket - and never chase the run."
  },
  {
    mentor: "kevin-course",
    n: 10,
    eli5: {
      oneLiner: "Pull your order when the story changes, not when the clock ticks.",
      story: "You save a seat for a friend at the cinema. You do not leave after ten minutes just because time passed. You leave if the friend says they went to a different cinema, or if a closer seat opens up for them. Limit orders are the same: remove or move them when the chart story changes.",
      analogy: "A saved seat: move it when a better seat opens (nearer zone), give it up when the plan changes (opposing zone took control)."
    },
    bigIdeas: [
      "No time or candle-count rule. Remove or move an order when the context changes.",
      "A zone is officially TESTED once a candle closes fully outside it with no body or wick touching. Tested zones are lower odds.",
      "Confirmation: remove the order if price hits the opposing HTF zone first. Set & forget: move the order to a newer, nearer qualified zone."
    ],
    steps: [
      {
        title: "Price reacts from the zone",
        narration: "Price pushes into the H4 demand and reacts. Right now the zone is \"being tested\".",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.32, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.2, c: 154.5 },
            { o: 154.5, h: 155.01, l: 152.1, c: 152.3 },
            { o: 152.3, h: 152.79, l: 148.5, c: 148.9 },
            { o: 148.9, h: 149.32, l: 145.97, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.59, c: 160.55 },
            { o: 160.55, h: 163.22, l: 160.18, c: 162.65 },
            { o: 162.65, h: 162.98, l: 161.38, c: 161.75 },
            { o: 161.75, h: 163.95, l: 161.25, c: 163.45 },
            { o: 163.45, h: 163.93, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.77, l: 161.94, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.36, c: 162.95 },
            { o: 162.95, h: 163.2, l: 159.65, c: 159.93 },
            { o: 159.93, h: 160.09, l: 156.2, c: 156.72 },
            { o: 156.72, h: 157.31, l: 153.79, c: 154.17 },
            { o: 154.17, h: 154.47, l: 150.88, c: 151.1 },
            { o: 151.1, h: 151.65, l: 147.62, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H4 demand"
            }
          ]
        }
      },
      {
        title: "Not tested yet",
        narration: "This candle closed above the zone, but its wick still touches it. That does NOT count as tested.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.32, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.2, c: 154.5 },
            { o: 154.5, h: 155.01, l: 152.1, c: 152.3 },
            { o: 152.3, h: 152.79, l: 148.5, c: 148.9 },
            { o: 148.9, h: 149.32, l: 145.97, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.59, c: 160.55 },
            { o: 160.55, h: 163.22, l: 160.18, c: 162.65 },
            { o: 162.65, h: 162.98, l: 161.38, c: 161.75 },
            { o: 161.75, h: 163.95, l: 161.25, c: 163.45 },
            { o: 163.45, h: 163.93, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.77, l: 161.94, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.36, c: 162.95 },
            { o: 162.95, h: 163.2, l: 159.65, c: 159.93 },
            { o: 159.93, h: 160.09, l: 156.2, c: 156.72 },
            { o: 156.72, h: 157.31, l: 153.79, c: 154.17 },
            { o: 154.17, h: 154.47, l: 150.88, c: 151.1 },
            { o: 151.1, h: 151.65, l: 147.62, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 148.35, l: 146.45, c: 148.05 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H4 demand"
            }
          ],
          notes: [
            {
              x: 23,
              y: 144.65,
              text: "wick still touching"
            }
          ]
        }
      },
      {
        title: "Officially tested",
        narration: "This candle closes fully outside, no body or wick touching. Now the zone is officially tested. Coming back into a tested zone is lower odds, unless the trend is with you.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.32, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.2, c: 154.5 },
            { o: 154.5, h: 155.01, l: 152.1, c: 152.3 },
            { o: 152.3, h: 152.79, l: 148.5, c: 148.9 },
            { o: 148.9, h: 149.32, l: 145.97, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.59, c: 160.55 },
            { o: 160.55, h: 163.22, l: 160.18, c: 162.65 },
            { o: 162.65, h: 162.98, l: 161.38, c: 161.75 },
            { o: 161.75, h: 163.95, l: 161.25, c: 163.45 },
            { o: 163.45, h: 163.93, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.77, l: 161.94, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.36, c: 162.95 },
            { o: 162.95, h: 163.2, l: 159.65, c: 159.93 },
            { o: 159.93, h: 160.09, l: 156.2, c: 156.72 },
            { o: 156.72, h: 157.31, l: 153.79, c: 154.17 },
            { o: 154.17, h: 154.47, l: 150.88, c: 151.1 },
            { o: 151.1, h: 151.65, l: 147.62, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 148.35, l: 146.45, c: 148.05 },
            { o: 148.05, h: 149.95, l: 147.15, c: 149.65 },
            { o: 149.65, h: 152.24, l: 149.1, c: 152.05 },
            { o: 152.05, h: 154.73, l: 151.79, c: 154.15 },
            { o: 154.15, h: 154.74, l: 153.36, c: 153.55 },
            { o: 153.55, h: 155.86, l: 153.25, c: 155.35 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H4 demand"
            }
          ],
          highlight: {
            from: 24,
            to: 24,
            label: "tested"
          }
        }
      },
      {
        title: "Confirmation: who is in control?",
        narration: "Daily demand took control and an H1 demand formed from confirmation. Leave the order only if price pulls back BEFORE it hits the opposing daily supply.",
        scene: {
          candles: [
            { o: 152, h: 152.15, l: 149.56, c: 149.9 },
            { o: 149.9, h: 150.08, l: 147, c: 147.5 },
            { o: 147.5, h: 147.8, l: 145.4, c: 145.7 },
            { o: 145.7, h: 146.3, l: 145.25, c: 146 },
            { o: 146, h: 146.3, l: 145.15, c: 145.65 },
            { o: 145.65, h: 146.25, l: 145.35, c: 145.9 },
            { o: 145.9, h: 149.8, l: 145.7, c: 149.5 },
            { o: 149.5, h: 153.21, l: 149.24, c: 152.7 },
            { o: 152.7, h: 155.78, l: 152.4, c: 155.5 },
            { o: 155.5, h: 158.3, l: 154.91, c: 158.1 },
            { o: 158.1, h: 160.99, l: 157.71, c: 160.5 },
            { o: 160.5, h: 162.35, l: 160.34, c: 162 }
          ],
          zones: [
            {
              from: 0,
              top: 147.5,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand",
              faded: true
            },
            {
              from: 0,
              top: 164.85,
              bottom: 161.55,
              kind: "supply",
              label: "Daily supply (opposing)",
              faded: true
            },
            {
              from: 3,
              top: 146,
              bottom: 145.15,
              kind: "demand",
              label: "H1 demand (order)"
            }
          ]
        }
      },
      {
        title: "Opposing zone hit first: remove",
        narration: "Here price hit the daily supply first and pushed down. Daily supply is now in control. He removes the entry for sure.",
        scene: {
          candles: [
            { o: 152, h: 152.15, l: 149.56, c: 149.9 },
            { o: 149.9, h: 150.08, l: 147, c: 147.5 },
            { o: 147.5, h: 147.8, l: 145.4, c: 145.7 },
            { o: 145.7, h: 146.3, l: 145.25, c: 146 },
            { o: 146, h: 146.3, l: 145.15, c: 145.65 },
            { o: 145.65, h: 146.25, l: 145.35, c: 145.9 },
            { o: 145.9, h: 149.8, l: 145.7, c: 149.5 },
            { o: 149.5, h: 153.21, l: 149.24, c: 152.7 },
            { o: 152.7, h: 155.78, l: 152.4, c: 155.5 },
            { o: 155.5, h: 158.3, l: 154.91, c: 158.1 },
            { o: 158.1, h: 160.99, l: 157.71, c: 160.5 },
            { o: 160.5, h: 162.35, l: 160.34, c: 162 },
            { o: 162, h: 163.15, l: 160.45, c: 160.75 },
            { o: 160.75, h: 161.11, l: 157.45, c: 157.95 },
            { o: 157.95, h: 158.15, l: 154.33, c: 154.85 },
            { o: 154.85, h: 155.26, l: 152.08, c: 152.25 },
            { o: 152.25, h: 152.81, l: 149.07, c: 149.36 },
            { o: 149.36, h: 149.85, l: 146.58, c: 146.9 },
            { o: 146.9, h: 147.2, l: 144.15, c: 144.45 },
            { o: 144.45, h: 144.91, l: 142.31, c: 142.65 },
            { o: 142.65, h: 143.03, l: 140.72, c: 141.25 },
            { o: 141.25, h: 142.13, l: 140.75, c: 141.65 },
            { o: 141.65, h: 142.18, l: 139.86, c: 140.05 }
          ],
          zones: [
            {
              from: 0,
              top: 147.5,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand",
              faded: true
            },
            {
              from: 0,
              top: 164.85,
              bottom: 161.55,
              kind: "supply",
              label: "Daily supply (opposing)",
              faded: true
            },
            {
              from: 3,
              top: 146,
              bottom: 145.15,
              kind: "demand",
              label: "order removed",
              faded: true
            }
          ],
          notes: [
            {
              x: 11,
              y: 165.35,
              text: "supply in control"
            }
          ]
        }
      },
      {
        title: "Set & forget: move to the nearer zone",
        narration: "In a trend, keep the order at the NEAREST zone while the trend line holds. When a newer, nearer qualified zone forms, move the order up to it.",
        scene: {
          candles: [
            { o: 130, h: 131.95, l: 129.6, c: 131.8 },
            { o: 131.8, h: 134.52, l: 131.54, c: 134 },
            { o: 134, h: 136.14, l: 133.6, c: 135.6 },
            { o: 135.6, h: 136.2, l: 135.15, c: 135.9 },
            { o: 135.9, h: 136.2, l: 135.05, c: 135.55 },
            { o: 135.55, h: 136.15, l: 135.25, c: 135.8 },
            { o: 135.8, h: 140.5, l: 135.6, c: 140.2 },
            { o: 140.2, h: 144.33, l: 139.63, c: 143.8 },
            { o: 143.8, h: 145.59, l: 143.53, c: 145 },
            { o: 145, h: 146.28, l: 144.63, c: 145.9 },
            { o: 145.9, h: 146.32, l: 144.9, c: 145.3 },
            { o: 145.3, h: 145.9, l: 144.85, c: 145.6 },
            { o: 145.6, h: 145.9, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.85, l: 144.95, c: 145.5 },
            { o: 145.5, h: 149.8, l: 145.3, c: 149.5 },
            { o: 149.5, h: 153.28, l: 149.1, c: 152.9 },
            { o: 152.9, h: 154.11, l: 152.39, c: 153.9 },
            { o: 153.9, h: 154.27, l: 152.85, c: 153.4 },
            { o: 153.4, h: 153.88, l: 151, c: 151.45 },
            { o: 151.45, h: 151.67, l: 149.89, c: 150.17 },
            { o: 150.17, h: 150.48, l: 147.75, c: 148.29 },
            { o: 148.29, h: 148.54, l: 146.11, c: 146.6 },
            { o: 146.6, h: 146.9, l: 145.22, c: 146.2 },
            { o: 146.2, h: 149.18, l: 146.04, c: 148.8 },
            { o: 148.8, h: 152.45, l: 148.28, c: 151.9 },
            { o: 151.9, h: 154.81, l: 151.68, c: 154.3 },
            { o: 154.3, h: 157.66, l: 154.12, c: 157.1 }
          ],
          zones: [
            {
              from: 3,
              top: 135.9,
              bottom: 135.05,
              kind: "demand",
              label: "old order",
              faded: true
            },
            {
              from: 11,
              top: 145.6,
              bottom: 144.75,
              kind: "demand",
              label: "new nearest zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 129.6,
              x2: 26,
              y2: 148.01,
              label: "trend line holding"
            }
          ],
          lines: [
            {
              y: 145.8,
              label: "order moved here",
              kind: "entry",
              from: 11
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle that makes this zone officially tested.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.32, c: 157.6 },
            { o: 157.6, h: 157.89, l: 154.2, c: 154.5 },
            { o: 154.5, h: 155.01, l: 152.1, c: 152.3 },
            { o: 152.3, h: 152.79, l: 148.5, c: 148.9 },
            { o: 148.9, h: 149.32, l: 145.97, c: 146.3 },
            { o: 146.3, h: 147, l: 145.85, c: 146.65 },
            { o: 146.65, h: 146.95, l: 145.65, c: 146.25 },
            { o: 146.25, h: 147, l: 145.9, c: 146.55 },
            { o: 146.55, h: 153.7, l: 146.35, c: 153.35 },
            { o: 153.35, h: 159.35, l: 153.05, c: 158.95 },
            { o: 158.95, h: 161.03, l: 158.59, c: 160.55 },
            { o: 160.55, h: 163.22, l: 160.18, c: 162.65 },
            { o: 162.65, h: 162.98, l: 161.38, c: 161.75 },
            { o: 161.75, h: 163.95, l: 161.25, c: 163.45 },
            { o: 163.45, h: 163.93, l: 161.76, c: 162.25 },
            { o: 162.25, h: 163.77, l: 161.94, c: 163.55 },
            { o: 163.55, h: 163.92, l: 162.36, c: 162.95 },
            { o: 162.95, h: 163.2, l: 159.65, c: 159.93 },
            { o: 159.93, h: 160.09, l: 156.2, c: 156.72 },
            { o: 156.72, h: 157.31, l: 153.79, c: 154.17 },
            { o: 154.17, h: 154.47, l: 150.88, c: 151.1 },
            { o: 151.1, h: 151.65, l: 147.62, c: 147.95 },
            { o: 147.95, h: 148.25, l: 146.2, c: 147.35 },
            { o: 147.35, h: 148.35, l: 146.45, c: 148.05 },
            { o: 148.05, h: 149.95, l: 147.15, c: 149.65 },
            { o: 149.65, h: 152.24, l: 149.1, c: 152.05 },
            { o: 152.05, h: 154.73, l: 151.79, c: 154.15 },
            { o: 154.15, h: 154.74, l: 153.36, c: 153.55 },
            { o: 153.55, h: 155.86, l: 153.25, c: 155.35 }
          ],
          zones: [
            {
              from: 5,
              top: 146.65,
              bottom: 145.65,
              kind: "demand",
              label: "H4 demand"
            }
          ]
        },
        answer: {
          from: 24,
          to: 24
        },
        explain: "It is the first candle that closes fully outside with no wick or body touching. The candle before still had its wick in the zone."
      },
      {
        type: "tf",
        q: "Remove a limit order after 20 candles if it has not filled.",
        answer: false,
        explain: "There is no time limit and no candle count. Only context changes matter."
      },
      {
        type: "mcq",
        q: "Confirmation trade: price hits the opposing daily supply before pulling back to your H1 demand. What now?",
        options: [
          "Keep the order",
          "Remove the order",
          "Double the size",
          "Move the stop wider"
        ],
        answer: 1,
        explain: "Daily supply is now in control. He removes the entry for sure."
      },
      {
        type: "mcq",
        q: "Rule of thumb: how far from the HTF zone should a confirmation form?",
        options: [
          "Within about one HTF-zone height",
          "Anywhere on the chart",
          "Exactly 50 pips",
          "Only on the next day"
        ],
        answer: 0,
        explain: "Further away, other things come into control. Best case: an immediate pullback."
      },
      {
        type: "tf",
        q: "Set & forget: after the nearest 5m zone fails, keep lower 5m orders only if they sit inside a 15m zone with the 15m trend line still holding.",
        answer: true,
        explain: "Otherwise pull them. Inside an H1 zone is even better."
      },
      {
        type: "mcq",
        q: "Two 15m supply zones in a tested H4 supply. Which is higher odds?",
        options: [
          "The one embedded in an H1 supply",
          "The one with no H1 zone",
          "Both the same",
          "Neither ever works"
        ],
        answer: 0,
        explain: "The embedded one is higher odds. He would have pulled the order on the one that was not embedded."
      }
    ],
    practice: [
      {
        prompt: "Your H1 demand order is waiting. Price first ran up and hit the opposing daily supply, then dropped back toward your zone. Keep the order?",
        scene: {
          candles: [
            { o: 152, h: 152.15, l: 149.56, c: 149.9 },
            { o: 149.9, h: 150.08, l: 147, c: 147.5 },
            { o: 147.5, h: 147.8, l: 145.4, c: 145.7 },
            { o: 145.7, h: 146.3, l: 145.25, c: 146 },
            { o: 146, h: 146.3, l: 145.15, c: 145.65 },
            { o: 145.65, h: 146.25, l: 145.35, c: 145.9 },
            { o: 145.9, h: 149.8, l: 145.7, c: 149.5 },
            { o: 149.5, h: 153.21, l: 149.24, c: 152.7 },
            { o: 152.7, h: 155.78, l: 152.4, c: 155.5 },
            { o: 155.5, h: 158.3, l: 154.91, c: 158.1 },
            { o: 158.1, h: 160.99, l: 157.71, c: 160.5 },
            { o: 160.5, h: 162.35, l: 160.34, c: 162 },
            { o: 162, h: 163.15, l: 160.45, c: 160.75 },
            { o: 160.75, h: 161.11, l: 157.45, c: 157.95 },
            { o: 157.95, h: 158.15, l: 154.33, c: 154.85 },
            { o: 154.85, h: 155.26, l: 152.08, c: 152.25 },
            { o: 152.25, h: 152.81, l: 149.07, c: 149.36 },
            { o: 149.36, h: 149.85, l: 146.58, c: 146.9 },
            { o: 146.9, h: 147.2, l: 144.15, c: 144.45 },
            { o: 144.45, h: 144.91, l: 142.31, c: 142.65 },
            { o: 142.65, h: 143.03, l: 140.72, c: 141.25 },
            { o: 141.25, h: 142.13, l: 140.75, c: 141.65 },
            { o: 141.65, h: 142.18, l: 139.86, c: 140.05 }
          ],
          zones: [
            {
              from: 0,
              top: 147.5,
              bottom: 143.15,
              kind: "demand",
              label: "Daily demand",
              faded: true
            },
            {
              from: 0,
              top: 164.85,
              bottom: 161.55,
              kind: "supply",
              label: "Daily supply (opposing)",
              faded: true
            },
            {
              from: 3,
              top: 146,
              bottom: 145.15,
              kind: "demand",
              label: "H1 demand"
            }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Price hit the opposing daily supply before pulling back, so supply took control. Removing the order was right: price broke through the demand."
      },
      {
        prompt: "Uptrend, trend line holding. A new nearer zone formed above your old order. Where should the order sit now?",
        scene: {
          candles: [
            { o: 130, h: 131.95, l: 129.6, c: 131.8 },
            { o: 131.8, h: 134.52, l: 131.54, c: 134 },
            { o: 134, h: 136.14, l: 133.6, c: 135.6 },
            { o: 135.6, h: 136.2, l: 135.15, c: 135.9 },
            { o: 135.9, h: 136.2, l: 135.05, c: 135.55 },
            { o: 135.55, h: 136.15, l: 135.25, c: 135.8 },
            { o: 135.8, h: 140.5, l: 135.6, c: 140.2 },
            { o: 140.2, h: 144.33, l: 139.63, c: 143.8 },
            { o: 143.8, h: 145.59, l: 143.53, c: 145 },
            { o: 145, h: 146.28, l: 144.63, c: 145.9 },
            { o: 145.9, h: 146.32, l: 144.9, c: 145.3 },
            { o: 145.3, h: 145.9, l: 144.85, c: 145.6 },
            { o: 145.6, h: 145.9, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.85, l: 144.95, c: 145.5 },
            { o: 145.5, h: 149.8, l: 145.3, c: 149.5 },
            { o: 149.5, h: 153.28, l: 149.1, c: 152.9 },
            { o: 152.9, h: 154.11, l: 152.39, c: 153.9 },
            { o: 153.9, h: 154.27, l: 152.85, c: 153.4 },
            { o: 153.4, h: 153.88, l: 151, c: 151.45 },
            { o: 151.45, h: 151.67, l: 149.89, c: 150.17 },
            { o: 150.17, h: 150.48, l: 147.75, c: 148.29 },
            { o: 148.29, h: 148.54, l: 146.11, c: 146.6 },
            { o: 146.6, h: 146.9, l: 145.22, c: 146.2 },
            { o: 146.2, h: 149.18, l: 146.04, c: 148.8 },
            { o: 148.8, h: 152.45, l: 148.28, c: 151.9 },
            { o: 151.9, h: 154.81, l: 151.68, c: 154.3 },
            { o: 154.3, h: 157.66, l: 154.12, c: 157.1 }
          ],
          zones: [
            {
              from: 3,
              top: 135.9,
              bottom: 135.05,
              kind: "demand",
              label: "old order zone"
            },
            {
              from: 11,
              top: 145.6,
              bottom: 144.75,
              kind: "demand",
              label: "new zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 129.6,
              x2: 26,
              y2: 148.01,
              label: "trend line holding"
            }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 145.8,
          sl: 144.45,
          tp: 149.85
        },
        explain: "Set & forget keeps the order at the NEAREST qualified zone. Move it to the new zone: entry just above its proximal, stop just below its distal. It filled and worked."
      }
    ],
    cards: [
      {
        front: "Time limit on limit orders?",
        back: "None. No candle count either. Context decides."
      },
      {
        front: "When is a zone officially tested?",
        back: "When a candle closes fully outside it, no wick or body touching."
      },
      {
        front: "Tested zone odds?",
        back: "Lower, unless the trend is with you."
      },
      {
        front: "Confirmation: opposing HTF zone hit first?",
        back: "Remove the order. The other zone is in control."
      },
      {
        front: "Set & forget: new nearer zone forms?",
        back: "Move the order to it (if qualified and room to the trend line)."
      },
      {
        front: "Set & forget needs...?",
        back: "Price to be trending."
      },
      {
        front: "Confirmation distance rule of thumb?",
        back: "Within about one HTF-zone height of the HTF zone."
      }
    ],
    mnemonic: "Story, not Clock: move for a nearer zone, remove when the other side takes control."
  },
  {
    mentor: "kevin-course",
    n: 11,
    eli5: {
      oneLiner: "Care about doing it right, not about money. Doing nothing is allowed.",
      story: "Learning to ride a bike, you fall a few times before it clicks. If you quit after three falls, you never learn. Trading is the same: a few losses in a row are normal. Sometimes the best move is to wait on the bench until a good path appears. And pick one direction to ride, instead of zig-zagging everywhere.",
      analogy: "A fisherman: he does not throw the net at every ripple, he waits for the fish. Some days he catches nothing, and that is fine."
    },
    bigIdeas: [
      "Focus on the process, not the money. Being flat (no trades) is a position.",
      "Predict if you like, but do not trade predictions that go against the trends. Stick to one side: long, short or flat.",
      "Each setup is one of thousands. Judge a strategy over about two quarters, not three losses."
    ],
    steps: [
      {
        title: "Flat is a position",
        narration: "No clean zones, no trend: no setups. Having no trades open means you see no good quality setups. Preserving capital is part of the process.",
        scene: {
          candles: [
            { o: 150, h: 150.95, l: 149.46, c: 150.8 },
            { o: 150.8, h: 151.12, l: 149.58, c: 150.1 },
            { o: 150.1, h: 150.94, l: 149.62, c: 150.7 },
            { o: 150.7, h: 150.99, l: 149.33, c: 149.8 },
            { o: 149.8, h: 150.99, l: 149.37, c: 150.5 },
            { o: 150.5, h: 150.8, l: 149.54, c: 150 },
            { o: 150, h: 151.45, l: 149.44, c: 150.9 },
            { o: 150.9, h: 151.07, l: 149.56, c: 150.1 },
            { o: 150.1, h: 151.03, l: 149.56, c: 150.5 },
            { o: 150.5, h: 150.8, l: 149.5, c: 149.9 },
            { o: 149.9, h: 150.83, l: 149.48, c: 150.6 },
            { o: 150.6, h: 151, l: 149.79, c: 150 },
            { o: 150, h: 151.53, l: 149.61, c: 151.1 },
            { o: 151.1, h: 152.13, l: 150.55, c: 151.8 },
            { o: 151.8, h: 151.95, l: 150.64, c: 150.9 },
            { o: 150.9, h: 151.44, l: 149.89, c: 150.1 },
            { o: 150.1, h: 150.85, l: 149.79, c: 150.4 },
            { o: 150.4, h: 151.13, l: 150.21, c: 150.9 },
            { o: 150.9, h: 151.27, l: 149.94, c: 150.3 },
            { o: 150.3, h: 151.59, l: 150.02, c: 151 },
            { o: 151, h: 151.56, l: 150.34, c: 150.5 },
            { o: 150.5, h: 151.55, l: 150.29, c: 151.1 },
            { o: 151.1, h: 151.53, l: 150.45, c: 150.7 }
          ],
          highlight: {
            from: 0,
            to: 22,
            label: "no setup = stay flat"
          }
        }
      },
      {
        title: "Stick to one side",
        narration: "Daily uptrend pulling into daily demand means only longs. A little H1 supply on the way down tempts a short. Do not try to catch every move.",
        scene: {
          candles: [
            { o: 130, h: 132.15, l: 129.58, c: 132 },
            { o: 132, h: 134.94, l: 131.44, c: 134.4 },
            { o: 134.4, h: 136.41, l: 134.11, c: 136.2 },
            { o: 136.2, h: 136.8, l: 135.75, c: 136.5 },
            { o: 136.5, h: 136.8, l: 135.65, c: 136.15 },
            { o: 136.15, h: 136.75, l: 135.85, c: 136.4 },
            { o: 136.4, h: 140.9, l: 136.2, c: 140.6 },
            { o: 140.6, h: 144.45, l: 140.29, c: 144.2 },
            { o: 144.2, h: 146.73, l: 143.71, c: 146.4 },
            { o: 146.4, h: 147.81, l: 145.96, c: 147.4 },
            { o: 147.4, h: 147.66, l: 145.07, c: 145.6 },
            { o: 145.6, h: 146.17, l: 143.09, c: 143.6 },
            { o: 143.6, h: 144.2, l: 143.15, c: 143.9 },
            { o: 143.9, h: 144.25, l: 143.2, c: 143.6 },
            { o: 143.6, h: 143.8, l: 140.5, c: 140.8 },
            { o: 140.8, h: 141.17, l: 137.87, c: 138.4 },
            { o: 138.4, h: 138.74, l: 137.58, c: 137.88 },
            { o: 137.88, h: 138.13, l: 136.98, c: 137.3 },
            { o: 137.3, h: 137.6, l: 136.16, c: 137.1 },
            { o: 137.1, h: 139.78, l: 136.53, c: 139.5 },
            { o: 139.5, h: 142.67, l: 139.26, c: 142.3 },
            { o: 142.3, h: 144.91, l: 142.07, c: 144.5 },
            { o: 144.5, h: 147.62, l: 144.33, c: 147.1 },
            { o: 147.1, h: 149.32, l: 146.89, c: 148.9 }
          ],
          zones: [
            {
              from: 0,
              top: 139,
              bottom: 133.65,
              kind: "demand",
              label: "Daily demand (uptrend)",
              faded: true
            },
            {
              from: 12,
              top: 144.25,
              bottom: 143.6,
              kind: "supply",
              label: "small H1 supply - tempting short"
            },
            {
              from: 3,
              top: 136.5,
              bottom: 135.65,
              kind: "demand",
              label: "demand - longs only"
            }
          ]
        }
      },
      {
        title: "Predict, but do not trade it",
        narration: "Price looks overextended and you may predict a pullback. But every trend is up. He would predict it, but never trade it.",
        scene: {
          candles: [
            { o: 120, h: 122.35, l: 119.52, c: 122.2 },
            { o: 122.2, h: 125.23, l: 121.88, c: 124.8 },
            { o: 124.8, h: 125.25, l: 123.81, c: 124.2 },
            { o: 124.2, h: 126.87, l: 124.04, c: 126.6 },
            { o: 126.6, h: 129.69, l: 126.14, c: 129.5 },
            { o: 129.5, h: 130.08, l: 128.77, c: 129 },
            { o: 129, h: 131.88, l: 128.46, c: 131.7 },
            { o: 131.7, h: 135.39, l: 131.4, c: 134.8 },
            { o: 134.8, h: 137.53, l: 134.26, c: 137.3 },
            { o: 137.3, h: 137.87, l: 136.53, c: 136.9 },
            { o: 136.9, h: 140.19, l: 136.34, c: 139.7 },
            { o: 139.7, h: 143.28, l: 139.46, c: 142.7 },
            { o: 142.7, h: 145.8, l: 142.54, c: 145.3 },
            { o: 145.3, h: 147.99, l: 145.04, c: 147.7 },
            { o: 147.7, h: 148.12, l: 146.71, c: 147.1 },
            { o: 147.1, h: 150.38, l: 146.79, c: 149.8 },
            { o: 149.8, h: 152.33, l: 149.51, c: 152 },
            { o: 152, h: 154.85, l: 151.51, c: 154.5 }
          ],
          notes: [
            {
              x: 13,
              y: 147.8,
              text: "\"It must drop!\" - prediction"
            }
          ]
        }
      },
      {
        title: "Losing streaks happen",
        narration: "Each candle here is one trade at about 5:1. Six losses in a row feel terrible.",
        scene: {
          candles: [
            { o: 100, h: 100.15, l: 98.85, c: 99 },
            { o: 99, h: 104.15, l: 98.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 102.15, l: 100.85, c: 101 },
            { o: 101, h: 101.15, l: 99.85, c: 100 }
          ],
          highlight: {
            from: 6,
            to: 11,
            label: "6 losses"
          }
        }
      },
      {
        title: "One win changes it",
        narration: "One 5:1 win almost erases six losses. Keep going: lose 3, win 1, lose 5, win 2.",
        scene: {
          candles: [
            { o: 100, h: 100.15, l: 98.85, c: 99 },
            { o: 99, h: 104.15, l: 98.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 102.15, l: 100.85, c: 101 },
            { o: 101, h: 101.15, l: 99.85, c: 100 },
            { o: 100, h: 105.15, l: 99.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 }
          ],
          notes: [
            {
              x: 12,
              y: 105.95,
              text: "+5R"
            }
          ]
        }
      },
      {
        title: "Still profitable",
        narration: "With more losses than wins, the account still ended higher. Run this simulation yourself. Do not change strategy after three losses; give it about two quarters.",
        scene: {
          candles: [
            { o: 100, h: 100.15, l: 98.85, c: 99 },
            { o: 99, h: 104.15, l: 98.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 102.15, l: 100.85, c: 101 },
            { o: 101, h: 101.15, l: 99.85, c: 100 },
            { o: 100, h: 105.15, l: 99.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 112.15, l: 106.85, c: 112 }
          ],
          lines: [
            {
              y: 100,
              label: "start",
              kind: "level"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Having no trades open is a position.",
        answer: true,
        explain: "Being flat means you see no good quality setups. Not losing money is part of the process."
      },
      {
        type: "mcq",
        q: "You lost three trades in a row with a 5:1 strategy. What now?",
        options: [
          "Change strategy today",
          "Stick to the plan; judge it over about two quarters",
          "Double the risk to win it back",
          "Ask someone where price is going"
        ],
        answer: 1,
        explain: "Each setup is one of thousands. Give it a few months; change something only if it still is not working after about two quarters."
      },
      {
        type: "spot",
        q: "Each candle is one trade. Click the trade that ended the six-loss streak.",
        scene: {
          candles: [
            { o: 100, h: 100.15, l: 98.85, c: 99 },
            { o: 99, h: 104.15, l: 98.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 102.15, l: 100.85, c: 101 },
            { o: 101, h: 101.15, l: 99.85, c: 100 },
            { o: 100, h: 105.15, l: 99.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 107.15, l: 105.85, c: 106 },
            { o: 106, h: 106.15, l: 104.85, c: 105 },
            { o: 105, h: 105.15, l: 103.85, c: 104 },
            { o: 104, h: 104.15, l: 102.85, c: 103 },
            { o: 103, h: 103.15, l: 101.85, c: 102 },
            { o: 102, h: 107.15, l: 101.85, c: 107 },
            { o: 107, h: 112.15, l: 106.85, c: 112 }
          ]
        },
        answer: {
          from: 12,
          to: 12
        },
        explain: "One 5:1 win after six 1R losses nearly brings you back. That is why you do not quit after a streak."
      },
      {
        type: "mcq",
        q: "Daily uptrend into daily demand. Which side do you trade?",
        options: [
          "Longs only",
          "Shorts only",
          "Both, to catch every move",
          "Whatever a friend says"
        ],
        answer: 0,
        explain: "Pick one bias from the trends in play. Switch only if price breaks below daily demand and the uptrend is lost."
      },
      {
        type: "tf",
        q: "If you predict a pullback in a strong uptrend, you should short it.",
        answer: false,
        explain: "\"I will predict these things based on history, but I will not trade them.\" Unless HTF supply is in control."
      },
      {
        type: "order",
        q: "Order the healthy reaction to a losing streak.",
        items: [
          "Check each trade matched your exact criteria",
          "Run a win/loss simulation at your R:R",
          "Keep following the plan",
          "Review after about two quarters"
        ],
        explain: "Process first. Judge the strategy over months, not days."
      }
    ],
    practice: [
      {
        prompt: "Strong uptrend on every timeframe. You \"feel\" a pullback is coming. Short it?",
        scene: {
          candles: [
            { o: 120, h: 122.35, l: 119.52, c: 122.2 },
            { o: 122.2, h: 125.23, l: 121.88, c: 124.8 },
            { o: 124.8, h: 125.25, l: 123.81, c: 124.2 },
            { o: 124.2, h: 126.87, l: 124.04, c: 126.6 },
            { o: 126.6, h: 129.69, l: 126.14, c: 129.5 },
            { o: 129.5, h: 130.08, l: 128.77, c: 129 },
            { o: 129, h: 131.88, l: 128.46, c: 131.7 },
            { o: 131.7, h: 135.39, l: 131.4, c: 134.8 },
            { o: 134.8, h: 137.53, l: 134.26, c: 137.3 },
            { o: 137.3, h: 137.87, l: 136.53, c: 136.9 },
            { o: 136.9, h: 140.19, l: 136.34, c: 139.7 },
            { o: 139.7, h: 143.28, l: 139.46, c: 142.7 },
            { o: 142.7, h: 145.8, l: 142.54, c: 145.3 },
            { o: 145.3, h: 147.99, l: 145.04, c: 147.7 },
            { o: 147.7, h: 148.12, l: 146.71, c: 147.1 },
            { o: 147.1, h: 150.38, l: 146.79, c: 149.8 },
            { o: 149.8, h: 152.33, l: 149.51, c: 152 },
            { o: 152, h: 154.85, l: 151.51, c: 154.5 }
          ],
          reveal: 13
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Predicting is fine, trading the prediction is not. All trends were up and price kept climbing."
      },
      {
        prompt: "Daily uptrend, price pulling into daily demand. A small H1 supply formed on the way down. Short the H1 supply?",
        scene: {
          candles: [
            { o: 130, h: 132.15, l: 129.58, c: 132 },
            { o: 132, h: 134.94, l: 131.44, c: 134.4 },
            { o: 134.4, h: 136.41, l: 134.11, c: 136.2 },
            { o: 136.2, h: 136.8, l: 135.75, c: 136.5 },
            { o: 136.5, h: 136.8, l: 135.65, c: 136.15 },
            { o: 136.15, h: 136.75, l: 135.85, c: 136.4 },
            { o: 136.4, h: 140.9, l: 136.2, c: 140.6 },
            { o: 140.6, h: 144.45, l: 140.29, c: 144.2 },
            { o: 144.2, h: 146.73, l: 143.71, c: 146.4 },
            { o: 146.4, h: 147.81, l: 145.96, c: 147.4 },
            { o: 147.4, h: 147.66, l: 145.07, c: 145.6 },
            { o: 145.6, h: 146.17, l: 143.09, c: 143.6 },
            { o: 143.6, h: 144.2, l: 143.15, c: 143.9 },
            { o: 143.9, h: 144.25, l: 143.2, c: 143.6 },
            { o: 143.6, h: 143.8, l: 140.5, c: 140.8 },
            { o: 140.8, h: 141.17, l: 137.87, c: 138.4 },
            { o: 138.4, h: 138.74, l: 137.58, c: 137.88 },
            { o: 137.88, h: 138.13, l: 136.98, c: 137.3 },
            { o: 137.3, h: 137.6, l: 136.16, c: 137.1 },
            { o: 137.1, h: 139.78, l: 136.53, c: 139.5 },
            { o: 139.5, h: 142.67, l: 139.26, c: 142.3 },
            { o: 142.3, h: 144.91, l: 142.07, c: 144.5 },
            { o: 144.5, h: 147.62, l: 144.33, c: 147.1 },
            { o: 147.1, h: 149.32, l: 146.89, c: 148.9 }
          ],
          zones: [
            {
              from: 0,
              top: 139,
              bottom: 133.65,
              kind: "demand",
              label: "Daily demand (uptrend)",
              faded: true
            },
            {
              from: 12,
              top: 144.25,
              bottom: 143.6,
              kind: "supply",
              label: "small H1 supply - tempting short"
            },
            {
              from: 3,
              top: 136.5,
              bottom: 135.65,
              kind: "demand",
              label: "demand"
            }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Stick to one side. With the daily up and price at daily demand, you look for longs only. Price bounced up from demand."
      }
    ],
    cards: [
      {
        front: "Being flat?",
        back: "A position: you see no good quality setups."
      },
      {
        front: "Focus on...?",
        back: "The process, not the money."
      },
      {
        front: "Predictions?",
        back: "Predict if you like, but do not trade them against the trends."
      },
      {
        front: "One side?",
        back: "Long, short or flat, from the trends in play. Change when zones or trend change."
      },
      {
        front: "Three losses in a row?",
        back: "Normal. Do not change strategy; evaluate over about two quarters."
      },
      {
        front: "His average R:R?",
        back: "About 5:1."
      },
      {
        front: "Asking others where price goes?",
        back: "A mistake. Learn to do it yourself."
      }
    ],
    mnemonic: "Bench, Bias, Bike: sit on the bench, pick one side, and do not quit after a few falls."
  },
  {
    mentor: "kevin-course",
    n: 12,
    eli5: {
      oneLiner: "Day trading = same zones, faster clock. Check the big picture and the news first.",
      story: "A zone works the same on a tiny chart or a giant chart, like a cookie cutter that is the same shape in any size of dough. The only differences are how many cookies you get and how fast you must move. Before you play outside, you check the weather: big news is a storm. You stay inside until it passes, even if you miss a little sunshine.",
      analogy: "News is a thunderstorm: do not walk into it. Wait for it to pass, let the puddles (wide spreads) dry, then go out."
    },
    bigIdeas: [
      "Three sequences: H4 to 15m, H1 to 5m (his pick), 15m to 1m. Entry, higher, and bigger-picture timeframe.",
      "Top-down: trend on the HTF, draw zones, check one timeframe higher for the zone in control, then drop to the entry.",
      "Never predict or trade the news. Wait for the release and for spreads to calm down."
    ],
    steps: [
      {
        title: "Step 1: the 15m trend",
        narration: "A high, a low, a higher high, then the low breaks. He calls this a downtrend, though not a clean one. Shorts become higher odds.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 }
          ],
          notes: [
            {
              x: 3,
              y: 156.46,
              text: "High"
            },
            {
              x: 5,
              y: 147.87,
              text: "Low"
            },
            {
              x: 9,
              y: 155.3,
              text: "Higher high"
            },
            {
              x: 11,
              y: 145.03,
              text: "low broken"
            }
          ],
          lines: [
            {
              y: 148.87,
              label: "prior low",
              kind: "level",
              from: 5
            }
          ]
        }
      },
      {
        title: "Step 2: draw 15m zones",
        narration: "Mark the significant 15m supply zones above. Ignore areas with basing but nothing worth drawing.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 },
            { o: 146.6, h: 146.93, l: 143.81, c: 144 },
            { o: 144, h: 144.38, l: 142.61, c: 142.8 },
            { o: 142.8, h: 144.47, l: 142.39, c: 144.2 },
            { o: 144.2, h: 145.62, l: 143.71, c: 145.3 },
            { o: 145.3, h: 145.95, l: 145, c: 145.6 },
            { o: 145.6, h: 145.95, l: 145, c: 145.3 },
            { o: 145.3, h: 145.5, l: 141.6, c: 141.9 },
            { o: 141.9, h: 142.11, l: 139.09, c: 139.3 },
            { o: 139.3, h: 139.6, l: 136.97, c: 137.5 },
            { o: 137.5, h: 137.72, l: 135.85, c: 136.1 }
          ],
          zones: [
            {
              from: 8,
              top: 154.3,
              bottom: 153.6,
              kind: "supply",
              label: "15m supply"
            },
            {
              from: 16,
              top: 145.95,
              bottom: 145.3,
              kind: "supply",
              label: "15m supply"
            }
          ]
        }
      },
      {
        title: "Step 3: one timeframe higher",
        narration: "Multiple sequence analysis: for a 15m chart, go to the H4. H4 supply is in control, so the 15m supply zones are higher odds and 15m demand (counter-trend) is lower odds.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 },
            { o: 146.6, h: 146.93, l: 143.81, c: 144 },
            { o: 144, h: 144.38, l: 142.61, c: 142.8 },
            { o: 142.8, h: 144.47, l: 142.39, c: 144.2 },
            { o: 144.2, h: 145.62, l: 143.71, c: 145.3 },
            { o: 145.3, h: 145.95, l: 145, c: 145.6 },
            { o: 145.6, h: 145.95, l: 145, c: 145.3 },
            { o: 145.3, h: 145.5, l: 141.6, c: 141.9 },
            { o: 141.9, h: 142.11, l: 139.09, c: 139.3 },
            { o: 139.3, h: 139.6, l: 136.97, c: 137.5 },
            { o: 137.5, h: 137.72, l: 135.85, c: 136.1 }
          ],
          zones: [
            {
              from: 0,
              top: 156.3,
              bottom: 152.4,
              kind: "supply",
              label: "H4 supply (in control)",
              faded: true
            },
            {
              from: 8,
              top: 154.3,
              bottom: 153.6,
              kind: "supply",
              label: "15m supply"
            },
            {
              from: 16,
              top: 145.95,
              bottom: 145.3,
              kind: "supply",
              label: "15m supply"
            }
          ]
        }
      },
      {
        title: "Size by the analysis",
        narration: "You can still trade any zone, but size it: about 1% on shorts with the HTF, 0.25 to 0.75% on longs with no real reason to hold.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 },
            { o: 146.6, h: 146.93, l: 143.81, c: 144 },
            { o: 144, h: 144.38, l: 142.61, c: 142.8 },
            { o: 142.8, h: 144.47, l: 142.39, c: 144.2 },
            { o: 144.2, h: 145.62, l: 143.71, c: 145.3 },
            { o: 145.3, h: 145.95, l: 145, c: 145.6 },
            { o: 145.6, h: 145.95, l: 145, c: 145.3 },
            { o: 145.3, h: 145.5, l: 141.6, c: 141.9 },
            { o: 141.9, h: 142.11, l: 139.09, c: 139.3 },
            { o: 139.3, h: 139.6, l: 136.97, c: 137.5 },
            { o: 137.5, h: 137.72, l: 135.85, c: 136.1 }
          ],
          zones: [
            {
              from: 0,
              top: 156.3,
              bottom: 152.4,
              kind: "supply",
              label: "H4 supply (in control)",
              faded: true
            },
            {
              from: 8,
              top: 154.3,
              bottom: 153.6,
              kind: "supply",
              label: "15m supply"
            },
            {
              from: 16,
              top: 145.95,
              bottom: 145.3,
              kind: "supply",
              label: "15m supply"
            }
          ],
          notes: [
            {
              x: 16,
              y: 147.45,
              text: "shorts: ~1%"
            }
          ]
        }
      },
      {
        title: "Step 4: drop to the 1m",
        narration: "Inside the 15m supply, either set a 1m supply order embedded in it, or wait for the 15m zone to be hit and look for 1m confirmation, then short.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 },
            { o: 146.6, h: 146.93, l: 143.81, c: 144 },
            { o: 144, h: 144.38, l: 142.61, c: 142.8 },
            { o: 142.8, h: 144.47, l: 142.39, c: 144.2 },
            { o: 144.2, h: 145.62, l: 143.71, c: 145.3 },
            { o: 145.3, h: 145.95, l: 145, c: 145.6 },
            { o: 145.6, h: 145.95, l: 145, c: 145.3 },
            { o: 145.3, h: 145.5, l: 141.6, c: 141.9 },
            { o: 141.9, h: 142.11, l: 139.09, c: 139.3 },
            { o: 139.3, h: 139.6, l: 136.97, c: 137.5 },
            { o: 137.5, h: 137.72, l: 135.85, c: 136.1 }
          ],
          zones: [
            {
              from: 0,
              top: 156.3,
              bottom: 152.4,
              kind: "supply",
              label: "H4 supply (in control)",
              faded: true
            },
            {
              from: 8,
              top: 154.3,
              bottom: 153.6,
              kind: "supply",
              label: "15m supply"
            },
            {
              from: 16,
              top: 145.95,
              bottom: 145.3,
              kind: "supply",
              label: "15m supply: look for 1m entry"
            }
          ],
          lines: [
            {
              y: 145.3,
              label: "1m entry area",
              kind: "entry",
              from: 16
            }
          ]
        }
      },
      {
        title: "Check the news",
        narration: "Price is about to hit supply at 8:59 with data at 9:00? Wait. Spreads widen around news and can stop you out even if price never reached your stop.",
        scene: {
          candles: [
            { o: 140, h: 142.57, l: 139.85, c: 142.4 },
            { o: 142.4, h: 146.08, l: 142.17, c: 145.5 },
            { o: 145.5, h: 148.17, l: 144.9, c: 147.7 },
            { o: 147.7, h: 151.62, l: 147.22, c: 151.1 },
            { o: 151.1, h: 153.86, l: 150.56, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.37, l: 138.95, c: 139.45 },
            { o: 139.45, h: 139.7, l: 137.03, c: 137.35 },
            { o: 137.35, h: 138.68, l: 136.96, c: 138.25 },
            { o: 138.25, h: 138.82, l: 136, c: 136.55 },
            { o: 136.55, h: 137.97, l: 136.05, c: 137.75 },
            { o: 137.75, h: 138.25, l: 135.88, c: 136.45 },
            { o: 136.45, h: 137.43, l: 135.92, c: 137.05 },
            { o: 137.05, h: 140.43, l: 136.77, c: 140.18 },
            { o: 140.18, h: 143.31, l: 139.69, c: 142.91 },
            { o: 142.91, h: 146.43, l: 142.32, c: 146.27 },
            { o: 146.27, h: 149.07, l: 145.76, c: 148.9 },
            { o: 148.9, h: 152.33, l: 148.67, c: 152.05 },
            { o: 152.05, h: 156.15, l: 151.75, c: 152.95 },
            { o: 152.95, h: 153.36, l: 149.79, c: 150.35 },
            { o: 150.35, h: 150.89, l: 147.14, c: 147.35 },
            { o: 147.35, h: 147.91, l: 144.73, c: 144.95 },
            { o: 144.95, h: 145.49, l: 141.78, c: 142.15 }
          ],
          zones: [
            {
              from: 5,
              top: 154.35,
              bottom: 153.35,
              kind: "supply",
              label: "supply"
            }
          ],
          lines: [
            {
              y: 154.65,
              label: "stop",
              kind: "sl",
              from: 5
            }
          ],
          notes: [
            {
              x: 22,
              y: 157.15,
              text: "9:00 data spike"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is the higher timeframe for the 15m chart?",
        options: [
          "1 hour",
          "4 hour",
          "Daily",
          "5 minute"
        ],
        answer: 1,
        explain: "The H4, not the H1. That was a Q&A question in the webinar."
      },
      {
        type: "mcq",
        q: "If he started day trading tomorrow, which sequence would he pick?",
        options: [
          "15m HTF, 1m entry",
          "H1 HTF, 5m entry",
          "H4 HTF, 15m entry",
          "Seconds charts"
        ],
        answer: 1,
        explain: "H1 to 5m is a good middle ground: 30 minutes away is 6 candles on the 5m vs 30 on the 1m."
      },
      {
        type: "spot",
        q: "Click the candle that breaks the low and makes this a downtrend.",
        scene: {
          candles: [
            { o: 150, h: 151.75, l: 149.44, c: 151.6 },
            { o: 151.6, h: 153.94, l: 151.23, c: 153.6 },
            { o: 153.6, h: 155.36, l: 153.23, c: 155 },
            { o: 155, h: 155.46, l: 152.99, c: 153.2 },
            { o: 153.2, h: 153.44, l: 150.81, c: 151 },
            { o: 151, h: 151.33, l: 148.87, c: 149.4 },
            { o: 149.4, h: 151.6, l: 149.17, c: 151.2 },
            { o: 151.2, h: 153.96, l: 151.01, c: 153.6 },
            { o: 153.6, h: 154.25, l: 153.3, c: 153.9 },
            { o: 153.9, h: 154.3, l: 153.3, c: 153.6 },
            { o: 153.6, h: 153.8, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.04, l: 146.03, c: 146.6 },
            { o: 146.6, h: 146.93, l: 143.81, c: 144 },
            { o: 144, h: 144.38, l: 142.61, c: 142.8 },
            { o: 142.8, h: 144.47, l: 142.39, c: 144.2 },
            { o: 144.2, h: 145.62, l: 143.71, c: 145.3 },
            { o: 145.3, h: 145.95, l: 145, c: 145.6 },
            { o: 145.6, h: 145.95, l: 145, c: 145.3 },
            { o: 145.3, h: 145.5, l: 141.6, c: 141.9 },
            { o: 141.9, h: 142.11, l: 139.09, c: 139.3 },
            { o: 139.3, h: 139.6, l: 136.97, c: 137.5 },
            { o: 137.5, h: 137.72, l: 135.85, c: 136.1 }
          ],
          notes: [
            {
              x: 3,
              y: 156.46,
              text: "High"
            },
            {
              x: 5,
              y: 147.87,
              text: "Low"
            },
            {
              x: 9,
              y: 155.3,
              text: "Higher high"
            }
          ]
        },
        answer: {
          from: 11,
          to: 11
        },
        explain: "High, low, higher high, then the low broke. That break gives the clear valley and peak and a lower low."
      },
      {
        type: "tf",
        q: "A day trader must take a trade every day.",
        answer: false,
        explain: "Not true, and believing it messes with your emotions."
      },
      {
        type: "mcq",
        q: "Beginner day trader risk?",
        options: [
          "1-2% per trade",
          "Tiny amounts you can afford to lose",
          "10% to grow fast",
          "No stop"
        ],
        answer: 1,
        explain: "He started risking about $5 a trade. Risking 1-2% as a beginner day trader is \"not a great idea\"."
      },
      {
        type: "tf",
        q: "Spreads widening around news can stop you out even if price never reaches your stop.",
        answer: true,
        explain: "That is one reason to never enter just before a scheduled release."
      },
      {
        type: "order",
        q: "Order his top-down day-trading plan.",
        items: [
          "Assess the trend on the higher timeframe",
          "Draw the significant zones",
          "Check one timeframe higher for the zone in control",
          "Drop to the entry timeframe for the entry"
        ],
        explain: "Do not just find HTF zones and look for trades inside them. Assess the trend first."
      },
      {
        type: "mcq",
        q: "Very good news comes out, but your valid short setup is in play. What do you do?",
        options: [
          "Cancel: the news is positive",
          "Take the setup; never trade your opinion of news",
          "Go long instead",
          "Double the size"
        ],
        answer: 1,
        explain: "\"If you have your setup in play, take it.\" Zones are objective; many news releases are subjective."
      }
    ],
    practice: [
      {
        prompt: "It is 8:59. Price is about to hit your 15m supply. Unemployment data comes out at 9:00. Short now?",
        scene: {
          candles: [
            { o: 140, h: 142.57, l: 139.85, c: 142.4 },
            { o: 142.4, h: 146.08, l: 142.17, c: 145.5 },
            { o: 145.5, h: 148.17, l: 144.9, c: 147.7 },
            { o: 147.7, h: 151.62, l: 147.22, c: 151.1 },
            { o: 151.1, h: 153.86, l: 150.56, c: 153.7 },
            { o: 153.7, h: 154.15, l: 153, c: 153.35 },
            { o: 153.35, h: 154.35, l: 153.05, c: 153.75 },
            { o: 153.75, h: 154.1, l: 153, c: 153.45 },
            { o: 153.45, h: 153.65, l: 146.3, c: 146.65 },
            { o: 146.65, h: 146.95, l: 140.65, c: 141.05 },
            { o: 141.05, h: 141.37, l: 138.95, c: 139.45 },
            { o: 139.45, h: 139.7, l: 137.03, c: 137.35 },
            { o: 137.35, h: 138.68, l: 136.96, c: 138.25 },
            { o: 138.25, h: 138.82, l: 136, c: 136.55 },
            { o: 136.55, h: 137.97, l: 136.05, c: 137.75 },
            { o: 137.75, h: 138.25, l: 135.88, c: 136.45 },
            { o: 136.45, h: 137.43, l: 135.92, c: 137.05 },
            { o: 137.05, h: 140.43, l: 136.77, c: 140.18 },
            { o: 140.18, h: 143.31, l: 139.69, c: 142.91 },
            { o: 142.91, h: 146.43, l: 142.32, c: 146.27 },
            { o: 146.27, h: 149.07, l: 145.76, c: 148.9 },
            { o: 148.9, h: 152.33, l: 148.67, c: 152.05 },
            { o: 152.05, h: 156.15, l: 151.75, c: 152.95 },
            { o: 152.95, h: 153.36, l: 149.79, c: 150.35 },
            { o: 150.35, h: 150.89, l: 147.14, c: 147.35 },
            { o: 147.35, h: 147.91, l: 144.73, c: 144.95 },
            { o: 144.95, h: 145.49, l: 141.78, c: 142.15 }
          ],
          zones: [
            {
              from: 5,
              top: 154.35,
              bottom: 153.35,
              kind: "supply",
              label: "supply"
            }
          ],
          lines: [
            {
              y: 154.65,
              label: "your stop",
              kind: "sl",
              from: 5
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Do not day trade the news. The 9:00 spike ran through the zone and your stop before price dropped. Wait for the release, let spreads calm down, then place the order."
      },
      {
        prompt: "15m downtrend, H4 supply in control. Price rallies back into a 15m drop-base-drop supply. Which side?",
        scene: {
          candles: [
            { o: 162, h: 162.23, l: 159.65, c: 159.8 },
            { o: 159.8, h: 160.14, l: 156.43, c: 157 },
            { o: 157, h: 157.57, l: 154.61, c: 155 },
            { o: 155, h: 155.38, l: 151.9, c: 152.4 },
            { o: 152.4, h: 152.99, l: 150.2, c: 150.6 },
            { o: 150.6, h: 151.05, l: 149.9, c: 150.25 },
            { o: 150.25, h: 151.25, l: 149.95, c: 150.65 },
            { o: 150.65, h: 151, l: 149.9, c: 150.35 },
            { o: 150.35, h: 150.55, l: 143.2, c: 143.55 },
            { o: 143.55, h: 143.85, l: 137.55, c: 137.95 },
            { o: 137.95, h: 138.5, l: 136.12, c: 136.35 },
            { o: 136.35, h: 136.61, l: 134.01, c: 134.25 },
            { o: 134.25, h: 135.37, l: 133.84, c: 135.15 },
            { o: 135.15, h: 135.73, l: 133.05, c: 133.45 },
            { o: 133.45, h: 134.9, l: 133.23, c: 134.65 },
            { o: 134.65, h: 135.01, l: 133.04, c: 133.35 },
            { o: 133.35, h: 134.3, l: 133, c: 133.95 },
            { o: 133.95, h: 137.45, l: 133.43, c: 137.16 },
            { o: 137.16, h: 140.24, l: 136.93, c: 139.98 },
            { o: 139.98, h: 142.99, l: 139.49, c: 142.72 },
            { o: 142.72, h: 146.1, l: 142.33, c: 145.78 },
            { o: 145.78, h: 149.12, l: 145.26, c: 148.95 },
            { o: 148.95, h: 150.7, l: 148.65, c: 149.55 },
            { o: 149.55, h: 150.12, l: 146.5, c: 147.05 },
            { o: 147.05, h: 147.58, l: 143.53, c: 143.85 },
            { o: 143.85, h: 144.3, l: 140.9, c: 141.45 },
            { o: 141.45, h: 142.82, l: 141.24, c: 142.25 },
            { o: 142.25, h: 142.77, l: 138.89, c: 139.35 },
            { o: 139.35, h: 139.81, l: 136.76, c: 137.15 }
          ],
          zones: [
            {
              from: 0,
              top: 154.25,
              bottom: 148.75,
              kind: "supply",
              label: "H4 supply (in control)",
              faded: true
            },
            {
              from: 5,
              top: 151.25,
              bottom: 150.25,
              kind: "supply",
              label: "15m supply (DBD)"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "With the 15m trend down and H4 supply in control, the 15m supply is the higher-odds trade: drop to the 1m for the entry. Price fell from the zone."
      }
    ],
    cards: [
      {
        front: "HTF for the 15m?",
        back: "The H4."
      },
      {
        front: "Three day-trading sequences?",
        back: "H4-15m, H1-5m, 15m-1m."
      },
      {
        front: "His pick to start day trading?",
        back: "H1 HTF with a 5m entry."
      },
      {
        front: "Seconds charts?",
        back: "Extreme scalping. Stay away."
      },
      {
        front: "Trade the news?",
        back: "No. Wait for the release and for spreads to calm down."
      },
      {
        front: "Beginner day-trader risk?",
        back: "Tiny amounts you can afford to lose (he started at about $5)."
      },
      {
        front: "Sessions (Eastern)?",
        back: "New York: wake around 8:00 AM. London: around 1-2 AM. Pick one."
      },
      {
        front: "Must you trade every day?",
        back: "No."
      }
    ],
    mnemonic: "Trend, Zones, Up-one, Drop-down - and check the weather (news) first."
  }
];
