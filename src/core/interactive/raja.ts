// Interactive teaching layer for mentor "raja" (lessons 1-9 and 50-54, see mentors/raja).
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Raja draws a zone over the whole basing
// candles, wick to wick: top = highest high, bottom = lowest low (demand proximal = top; supply proximal = bottom).
// Trendlines never cut a candle before they are crossed; a cross / removal counts only on a candle close.
// Practice outcomes after scene.reveal are consistent with the answer.
import type { InteractiveLesson } from './types';

export const IL_RAJA: InteractiveLesson[] = [
  {
    mentor: "raja",
    n: 1,
    eli5: {
      oneLiner: "Trade only the strong zones: the ones that knocked out the opposite zone.",
      story: "Two teams play tug of war over a line on the ground. Lots of kids pull for a moment and then let go, so those spots mean nothing. But one team pulled so hard that the other team fell over the line. That spot shows where the strong team stands. Raja only trades spots like that.",
      analogy: "A strong zone is the team that pulled the other team over the line. A weak zone is a team that pulled a bit and then stopped."
    },
    bigIdeas: [
      "Price leaves many zones. Raja trades only strong ones.",
      "Strong = the move away closed beyond the opposite zone. Arrival = it also crossed the trendline.",
      "Only a fresh strong or arrival zone gets set and forget (a limit order you leave alone)."
    ],
    steps: [
      {
        title: "Price leaves zones behind",
        narration: "Price rose, paused and rose again. That pause is a demand zone. Raja draws it over the whole basing candles, wick to wick. Markets leave many zones like this, and most are not worth trading.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "old demand"
            }
          ],
          reveal: 10
        }
      },
      {
        title: "A drop-base-drop: the CP level",
        narration: "Price turned down, paused for three small candles and kept dropping. A pause in the middle of a move is a CP (continuation) level. Here it is a CP supply.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "old demand"
            }
          ],
          highlight: {
            from: 13,
            to: 15,
            label: "CP base"
          },
          reveal: 16
        }
      },
      {
        title: "The leg-out removes the demand",
        narration: "Watch the drop leave the CP supply. A candle closes below the old demand. The supply has removed the opposite zone, so real sellers are sitting there. That makes it a strong zone.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            },
            {
              from: 13,
              top: 146.28,
              bottom: 145.38,
              kind: "supply",
              label: "strong CP supply"
            }
          ],
          notes: [
            {
              x: 18,
              y: 126.22,
              text: "close below = removed"
            }
          ],
          reveal: 19
        }
      },
      {
        title: "Set and forget",
        narration: "The zone is strong and fresh (not touched yet). Raja puts a sell limit at the proximal line (the bottom of a supply), a stop beyond the distal line (the top), and walks away.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            },
            {
              from: 13,
              top: 146.28,
              bottom: 145.38,
              kind: "supply",
              label: "strong CP supply"
            }
          ],
          lines: [
            {
              y: 145.38,
              label: "sell limit (proximal)",
              kind: "entry",
              from: 13
            },
            {
              y: 146.68,
              label: "stop beyond distal",
              kind: "sl",
              from: 13
            },
            {
              y: 125,
              label: "TP",
              kind: "tp",
              from: 13
            }
          ],
          reveal: 26
        }
      },
      {
        title: "First touch: price respects it",
        narration: "Price comes back for the first time, fills the sell limit and drops away. The strong zone did its job.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            },
            {
              from: 13,
              top: 146.28,
              bottom: 145.38,
              kind: "supply",
              label: "strong CP supply"
            }
          ],
          lines: [
            {
              y: 145.38,
              label: "sell limit (proximal)",
              kind: "entry",
              from: 13
            },
            {
              y: 146.68,
              label: "stop beyond distal",
              kind: "sl",
              from: 13
            },
            {
              y: 125,
              label: "TP",
              kind: "tp",
              from: 13
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What turns a CP supply into a strong zone?",
        options: [
          "It has three basing candles",
          "Its drop closes below the opposite demand",
          "It sits at a round number",
          "Price touched it twice"
        ],
        answer: 1,
        explain: "Raja's test is simple: did the move away remove (close beyond) the opposite zone? If yes, the zone is strong."
      },
      {
        type: "tf",
        q: "An arrival zone only needs its move to cross the trendline.",
        answer: false,
        explain: "Arrival = two things on one leg-out: it crosses the trendline AND it removes the opposite zone."
      },
      {
        type: "spot",
        q: "Click the basing candles of the zone that became strong.",
        scene: {
          candles: [
            { o: 118, h: 121.64, l: 117.76, c: 121.3 },
            { o: 121.3, h: 126.36, l: 120.87, c: 125.88 },
            { o: 125.88, h: 130.56, l: 125.65, c: 130 },
            { o: 130, h: 130.25, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.29, l: 129.43, c: 129.92 },
            { o: 129.92, h: 130.17, l: 129.71, c: 129.87 },
            { o: 129.87, h: 136.57, l: 129.66, c: 135.95 },
            { o: 135.95, h: 144.83, l: 135.66, c: 144.06 },
            { o: 144.06, h: 150.91, l: 143.27, c: 150.42 },
            { o: 150.42, h: 156.43, l: 149.79, c: 156 },
            { o: 156, h: 156.19, l: 151.86, c: 152.04 },
            { o: 152.04, h: 152.34, l: 148.46, c: 148.56 },
            { o: 148.56, h: 148.82, l: 145.89, c: 146 },
            { o: 146, h: 146.16, l: 145.38, c: 145.77 },
            { o: 145.77, h: 146.14, l: 145.43, c: 145.95 },
            { o: 145.95, h: 146.28, l: 145.68, c: 146.08 },
            { o: 146.08, h: 147.07, l: 138.15, c: 138.73 },
            { o: 138.73, h: 139.08, l: 133.18, c: 133.75 },
            { o: 133.75, h: 133.98, l: 127.72, c: 128.37 },
            { o: 128.37, h: 129, l: 121.41, c: 122 },
            { o: 122, h: 122.37, l: 121.72, c: 121.97 },
            { o: 121.97, h: 122.2, l: 121.59, c: 121.9 },
            { o: 121.9, h: 128.67, l: 121.19, c: 128.39 },
            { o: 128.39, h: 133.71, l: 127.93, c: 133.21 },
            { o: 133.21, h: 138.37, l: 132.74, c: 138.09 },
            { o: 138.09, h: 145.71, l: 137.35, c: 144.98 },
            { o: 144.98, h: 145.79, l: 142.98, c: 143.18 },
            { o: 143.18, h: 143.69, l: 137.56, c: 138.06 },
            { o: 138.06, h: 138.4, l: 134.16, c: 134.35 },
            { o: 134.35, h: 134.71, l: 128.67, c: 129.12 },
            { o: 129.12, h: 129.37, l: 123.54, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.29,
              bottom: 129.36,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            }
          ]
        },
        answer: {
          from: 13,
          to: 15
        },
        explain: "The three small candles in the middle of the drop are the CP supply. Its drop closed below the old demand, so it is the strong zone."
      },
      {
        type: "order",
        q: "Put Raja's strong-zone check in order.",
        items: [
          "Did the move away remove an opposite zone?",
          "Did it also cross the trendline (arrival)?",
          "Is the zone still fresh?",
          "Limit order at the proximal line, stop beyond the distal line"
        ],
        explain: "First strength, then the arrival check, then freshness. Only then does the zone get a set and forget order."
      },
      {
        type: "mcq",
        q: "What does \"set and forget\" mean to Raja?",
        options: [
          "A market order on a big candle",
          "A buy limit or sell limit order left at the zone",
          "Closing the trade after one hour",
          "Moving the stop every candle"
        ],
        answer: 1,
        explain: "He says it plainly: set and forget means a buy limit or sell limit order. You place it and leave it."
      },
      {
        type: "tf",
        q: "You may use set and forget on any fresh zone.",
        answer: false,
        explain: "Only fresh strong zones and fresh arrival zones. Weak zones need the confirmation rule."
      }
    ],
    practice: [
      {
        prompt: "A downtrend. This demand's rally crossed the trendline and then closed above the last supply. Price is back at the demand for the first time. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.27, l: 180.93, c: 181.22 },
            { o: 181.22, h: 181.55, l: 174.59, c: 175.09 },
            { o: 175.09, h: 175.23, l: 170.54, c: 171 },
            { o: 171, h: 171.16, l: 170.58, c: 170.75 },
            { o: 170.75, h: 171.25, l: 170.59, c: 171.01 },
            { o: 171.01, h: 171.38, l: 166.61, c: 167.09 },
            { o: 167.09, h: 167.53, l: 162.3, c: 162.69 },
            { o: 162.69, h: 163.15, l: 157.64, c: 158 },
            { o: 158, h: 158.18, l: 157.38, c: 157.77 },
            { o: 157.77, h: 158.37, l: 157.5, c: 158.1 },
            { o: 158.1, h: 158.29, l: 152.81, c: 153.11 },
            { o: 153.11, h: 153.36, l: 145.45, c: 146.29 },
            { o: 146.29, h: 146.94, l: 139.18, c: 140 },
            { o: 140, h: 140.32, l: 139.81, c: 140.11 },
            { o: 140.11, h: 140.32, l: 139.7, c: 139.89 },
            { o: 139.89, h: 140.37, l: 139.54, c: 140 },
            { o: 140, h: 145.89, l: 139.82, c: 145.45 },
            { o: 145.45, h: 151.67, l: 145.02, c: 151.33 },
            { o: 151.33, h: 157.87, l: 150.85, c: 157.24 },
            { o: 157.24, h: 163.87, l: 156.52, c: 163.37 },
            { o: 163.37, h: 163.63, l: 157.04, c: 157.44 },
            { o: 157.44, h: 157.69, l: 151.22, c: 151.79 },
            { o: 151.79, h: 152.27, l: 144.95, c: 145.42 },
            { o: 145.42, h: 145.88, l: 140.41, c: 140.77 },
            { o: 140.77, h: 142.77, l: 140.04, c: 142.57 },
            { o: 142.57, h: 148.9, l: 142.01, c: 148.61 },
            { o: 148.61, h: 157.15, l: 148.32, c: 156.13 },
            { o: 156.13, h: 163.4, l: 155.86, c: 162.86 },
            { o: 162.86, h: 170.87, l: 162.27, c: 170.08 }
          ],
          zones: [
            {
              from: 4,
              top: 171.25,
              bottom: 170.58,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.37,
              bottom: 157.38,
              kind: "supply",
              label: "last supply (removed)",
              to: 20,
              faded: true
            },
            {
              from: 14,
              top: 140.37,
              bottom: 139.54,
              kind: "demand",
              label: "demand"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 18,
              y2: 138.11,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "The rally crossed the trendline and removed the last supply: both rules of an arrival zone. It is fresh, so a buy limit at the top of the zone is set and forget. Price bounced and ran up toward the next supply."
      },
      {
        prompt: "This supply's drop stopped above the old demand and never closed below it. Price is now back at the supply. Sell limit, buy, or do nothing?",
        scene: {
          candles: [
            { o: 120, h: 124.39, l: 119.67, c: 124.16 },
            { o: 124.16, h: 128.41, l: 123.65, c: 128.27 },
            { o: 128.27, h: 132.32, l: 128.08, c: 132 },
            { o: 132, h: 132.39, l: 131.38, c: 131.69 },
            { o: 131.69, h: 132.47, l: 131.4, c: 132.19 },
            { o: 132.19, h: 132.58, l: 131.73, c: 131.97 },
            { o: 131.97, h: 139.16, l: 131.3, c: 138.81 },
            { o: 138.81, h: 146.73, l: 137.82, c: 145.95 },
            { o: 145.95, h: 151.15, l: 145.45, c: 150.9 },
            { o: 150.9, h: 158.96, l: 150.34, c: 158 },
            { o: 158, h: 158.33, l: 154.83, c: 155.19 },
            { o: 155.19, h: 155.62, l: 151.25, c: 151.41 },
            { o: 151.41, h: 151.55, l: 147.74, c: 148 },
            { o: 148, h: 148.19, l: 147.48, c: 147.79 },
            { o: 147.79, h: 148.48, l: 147.58, c: 148.19 },
            { o: 148.19, h: 148.49, l: 147.74, c: 148.13 },
            { o: 148.13, h: 148.33, l: 142.19, c: 142.83 },
            { o: 142.83, h: 142.95, l: 138.78, c: 139 },
            { o: 139, h: 139.17, l: 134.93, c: 135.08 },
            { o: 135.08, h: 135.23, l: 134.65, c: 135.02 },
            { o: 135.02, h: 135.56, l: 134.78, c: 135.23 },
            { o: 135.23, h: 138.42, l: 135.04, c: 138.19 },
            { o: 138.19, h: 141.4, l: 137.87, c: 141.14 },
            { o: 141.14, h: 145.02, l: 140.76, c: 144.75 },
            { o: 144.75, h: 147.34, l: 144.61, c: 147.08 },
            { o: 147.08, h: 149.62, l: 146.98, c: 149.38 },
            { o: 149.38, h: 152.16, l: 149.31, c: 152.02 },
            { o: 152.02, h: 155.18, l: 151.74, c: 155.04 },
            { o: 155.04, h: 157.65, l: 154.74, c: 157.49 }
          ],
          zones: [
            {
              from: 3,
              top: 132.58,
              bottom: 131.38,
              kind: "demand",
              label: "demand (held)"
            },
            {
              from: 13,
              top: 148.49,
              bottom: 147.48,
              kind: "supply",
              label: "supply"
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The drop failed to remove the demand, so this supply is weak. A weak zone gets no set and forget. Price ran straight through it. Doing nothing was right."
      }
    ],
    cards: [
      {
        front: "Which zones does Raja trade?",
        back: "Only strong zones. Most zones are skipped."
      },
      {
        front: "Strong zone (type 1)?",
        back: "A CP zone whose move away closed beyond the opposite zone."
      },
      {
        front: "Arrival zone (type 2)?",
        back: "Its move away crossed the trendline AND removed the opposite zone."
      },
      {
        front: "Where do arrival zones usually form?",
        back: "At the peak: the swing high or swing low."
      },
      {
        front: "Set and forget means?",
        back: "A buy limit or sell limit order left at the zone."
      },
      {
        front: "Which zones get set and forget?",
        back: "Only fresh strong zones and fresh arrival zones, on the first touch."
      },
      {
        front: "Where does the limit order go?",
        back: "At the proximal line. Stop beyond the distal line."
      }
    ],
    mnemonic: "Removed = strong. Crossed + removed = arrival. Fresh = set and forget."
  },
  {
    mentor: "raja",
    n: 2,
    eli5: {
      oneLiner: "Weak zones need proof first: line crossed, last opposite zone removed.",
      story: "A bridge held a heavy truck once. The next day it has cracks, so you do not just drive over it. You send a small car first and watch. If the small car makes it across safely, then you go. Raja does the same with a zone that has been used before.",
      analogy: "A retested zone is a cracked bridge. The confirmation rule is the small test car you send across first."
    },
    bigIdeas: [
      "First touch of a fresh strong zone: set and forget. Any retest is weak.",
      "Confirmation: on a lower timeframe, the trendline is crossed AND the last opposite zone is removed.",
      "Weak types get confirmation only: retested, inheritance, flip and overlap zones."
    ],
    steps: [
      {
        title: "Touch 1: set and forget",
        narration: "This demand made a strong move up. On the first touch a buy limit worked and price bounced. That was the zone's fresh, set and forget trade.",
        scene: {
          candles: [
            { o: 162, h: 162.6, l: 161.2, c: 162 },
            { o: 162, h: 162.26, l: 154.47, c: 154.81 },
            { o: 154.81, h: 155.37, l: 147.13, c: 147.64 },
            { o: 147.64, h: 148.24, l: 139.8, c: 140.69 },
            { o: 140.69, h: 141.82, l: 130.94, c: 132 },
            { o: 132, h: 132.69, l: 131.75, c: 132.4 },
            { o: 132.4, h: 132.63, l: 131.48, c: 131.85 },
            { o: 131.85, h: 132.43, l: 131.58, c: 131.96 },
            { o: 131.96, h: 139.6, l: 131.61, c: 139.05 },
            { o: 139.05, h: 144.26, l: 138.73, c: 143.73 },
            { o: 143.73, h: 150.86, l: 143.27, c: 150 },
            { o: 150, h: 150.27, l: 145.5, c: 145.77 },
            { o: 145.77, h: 146.02, l: 141.63, c: 142.02 },
            { o: 142.02, h: 142.24, l: 138.07, c: 138.19 },
            { o: 138.19, h: 138.39, l: 132.6, c: 133.09 },
            { o: 133.09, h: 134.89, l: 132.19, c: 134.69 },
            { o: 134.69, h: 139.52, l: 134.45, c: 138.99 },
            { o: 138.99, h: 144.16, l: 138.63, c: 143.69 },
            { o: 143.69, h: 148.43, l: 143.3, c: 148 },
            { o: 148, h: 150.6, l: 147.5, c: 147.8 },
            { o: 147.8, h: 148.02, l: 145.16, c: 145.37 },
            { o: 145.37, h: 145.71, l: 141.71, c: 142 },
            { o: 142, h: 142.32, l: 141.65, c: 141.83 },
            { o: 141.83, h: 142.29, l: 141.68, c: 142.1 },
            { o: 142.1, h: 142.47, l: 139.03, c: 139.21 },
            { o: 139.21, h: 139.45, l: 135.23, c: 135.38 },
            { o: 135.38, h: 135.66, l: 132.26, c: 132.39 },
            { o: 132.39, h: 132.7, l: 132.07, c: 132.35 },
            { o: 132.35, h: 132.61, l: 132.03, c: 132.34 },
            { o: 132.34, h: 132.66, l: 132.16, c: 132.39 },
            { o: 132.39, h: 137.26, l: 132.24, c: 136.85 },
            { o: 136.85, h: 142.16, l: 136.18, c: 141.87 },
            { o: 141.87, h: 146.81, l: 141.5, c: 146.32 },
            { o: 146.32, h: 146.92, l: 140.89, c: 141.24 },
            { o: 141.24, h: 141.59, l: 136.79, c: 137.21 },
            { o: 137.21, h: 137.77, l: 132.81, c: 133.1 },
            { o: 133.1, h: 134.9, l: 132.4, c: 134.7 },
            { o: 134.7, h: 141.99, l: 133.97, c: 141.52 },
            { o: 141.52, h: 150, l: 141.18, c: 149.17 },
            { o: 149.17, h: 155.5, l: 148.95, c: 154.79 },
            { o: 154.79, h: 162.22, l: 153.8, c: 162 }
          ],
          zones: [
            {
              from: 5,
              top: 132.69,
              bottom: 131.48,
              kind: "demand",
              label: "HTF demand"
            }
          ],
          notes: [
            {
              x: 15,
              y: 129.48,
              text: "1st touch"
            }
          ],
          reveal: 19
        }
      },
      {
        title: "Touch 2 is a retest, so it is weak",
        narration: "Price comes back a second time. Raja says a retested zone is always weak. No limit order now. On a daily or weekly zone the third touch is risky, and on a monthly zone the fourth touch usually breaks it.",
        scene: {
          candles: [
            { o: 162, h: 162.6, l: 161.2, c: 162 },
            { o: 162, h: 162.26, l: 154.47, c: 154.81 },
            { o: 154.81, h: 155.37, l: 147.13, c: 147.64 },
            { o: 147.64, h: 148.24, l: 139.8, c: 140.69 },
            { o: 140.69, h: 141.82, l: 130.94, c: 132 },
            { o: 132, h: 132.69, l: 131.75, c: 132.4 },
            { o: 132.4, h: 132.63, l: 131.48, c: 131.85 },
            { o: 131.85, h: 132.43, l: 131.58, c: 131.96 },
            { o: 131.96, h: 139.6, l: 131.61, c: 139.05 },
            { o: 139.05, h: 144.26, l: 138.73, c: 143.73 },
            { o: 143.73, h: 150.86, l: 143.27, c: 150 },
            { o: 150, h: 150.27, l: 145.5, c: 145.77 },
            { o: 145.77, h: 146.02, l: 141.63, c: 142.02 },
            { o: 142.02, h: 142.24, l: 138.07, c: 138.19 },
            { o: 138.19, h: 138.39, l: 132.6, c: 133.09 },
            { o: 133.09, h: 134.89, l: 132.19, c: 134.69 },
            { o: 134.69, h: 139.52, l: 134.45, c: 138.99 },
            { o: 138.99, h: 144.16, l: 138.63, c: 143.69 },
            { o: 143.69, h: 148.43, l: 143.3, c: 148 },
            { o: 148, h: 150.6, l: 147.5, c: 147.8 },
            { o: 147.8, h: 148.02, l: 145.16, c: 145.37 },
            { o: 145.37, h: 145.71, l: 141.71, c: 142 },
            { o: 142, h: 142.32, l: 141.65, c: 141.83 },
            { o: 141.83, h: 142.29, l: 141.68, c: 142.1 },
            { o: 142.1, h: 142.47, l: 139.03, c: 139.21 },
            { o: 139.21, h: 139.45, l: 135.23, c: 135.38 },
            { o: 135.38, h: 135.66, l: 132.26, c: 132.39 },
            { o: 132.39, h: 132.7, l: 132.07, c: 132.35 },
            { o: 132.35, h: 132.61, l: 132.03, c: 132.34 },
            { o: 132.34, h: 132.66, l: 132.16, c: 132.39 },
            { o: 132.39, h: 137.26, l: 132.24, c: 136.85 },
            { o: 136.85, h: 142.16, l: 136.18, c: 141.87 },
            { o: 141.87, h: 146.81, l: 141.5, c: 146.32 },
            { o: 146.32, h: 146.92, l: 140.89, c: 141.24 },
            { o: 141.24, h: 141.59, l: 136.79, c: 137.21 },
            { o: 137.21, h: 137.77, l: 132.81, c: 133.1 },
            { o: 133.1, h: 134.9, l: 132.4, c: 134.7 },
            { o: 134.7, h: 141.99, l: 133.97, c: 141.52 },
            { o: 141.52, h: 150, l: 141.18, c: 149.17 },
            { o: 149.17, h: 155.5, l: 148.95, c: 154.79 },
            { o: 154.79, h: 162.22, l: 153.8, c: 162 }
          ],
          zones: [
            {
              from: 5,
              top: 132.69,
              bottom: 131.48,
              kind: "demand",
              label: "HTF demand"
            }
          ],
          notes: [
            {
              x: 15,
              y: 129.48,
              text: "1st touch"
            },
            {
              x: 26,
              y: 129.48,
              text: "2nd touch: no limit"
            }
          ],
          reveal: 27
        }
      },
      {
        title: "Zoom in to the lower timeframe",
        narration: "Drop to a lower timeframe inside the zone. Price is still falling: it follows a down trendline and leaves supply levels. The last one is the zone to watch.",
        scene: {
          candles: [
            { o: 162, h: 162.6, l: 161.2, c: 162 },
            { o: 162, h: 162.26, l: 154.47, c: 154.81 },
            { o: 154.81, h: 155.37, l: 147.13, c: 147.64 },
            { o: 147.64, h: 148.24, l: 139.8, c: 140.69 },
            { o: 140.69, h: 141.82, l: 130.94, c: 132 },
            { o: 132, h: 132.69, l: 131.75, c: 132.4 },
            { o: 132.4, h: 132.63, l: 131.48, c: 131.85 },
            { o: 131.85, h: 132.43, l: 131.58, c: 131.96 },
            { o: 131.96, h: 139.6, l: 131.61, c: 139.05 },
            { o: 139.05, h: 144.26, l: 138.73, c: 143.73 },
            { o: 143.73, h: 150.86, l: 143.27, c: 150 },
            { o: 150, h: 150.27, l: 145.5, c: 145.77 },
            { o: 145.77, h: 146.02, l: 141.63, c: 142.02 },
            { o: 142.02, h: 142.24, l: 138.07, c: 138.19 },
            { o: 138.19, h: 138.39, l: 132.6, c: 133.09 },
            { o: 133.09, h: 134.89, l: 132.19, c: 134.69 },
            { o: 134.69, h: 139.52, l: 134.45, c: 138.99 },
            { o: 138.99, h: 144.16, l: 138.63, c: 143.69 },
            { o: 143.69, h: 148.43, l: 143.3, c: 148 },
            { o: 148, h: 150.6, l: 147.5, c: 147.8 },
            { o: 147.8, h: 148.02, l: 145.16, c: 145.37 },
            { o: 145.37, h: 145.71, l: 141.71, c: 142 },
            { o: 142, h: 142.32, l: 141.65, c: 141.83 },
            { o: 141.83, h: 142.29, l: 141.68, c: 142.1 },
            { o: 142.1, h: 142.47, l: 139.03, c: 139.21 },
            { o: 139.21, h: 139.45, l: 135.23, c: 135.38 },
            { o: 135.38, h: 135.66, l: 132.26, c: 132.39 },
            { o: 132.39, h: 132.7, l: 132.07, c: 132.35 },
            { o: 132.35, h: 132.61, l: 132.03, c: 132.34 },
            { o: 132.34, h: 132.66, l: 132.16, c: 132.39 },
            { o: 132.39, h: 137.26, l: 132.24, c: 136.85 },
            { o: 136.85, h: 142.16, l: 136.18, c: 141.87 },
            { o: 141.87, h: 146.81, l: 141.5, c: 146.32 },
            { o: 146.32, h: 146.92, l: 140.89, c: 141.24 },
            { o: 141.24, h: 141.59, l: 136.79, c: 137.21 },
            { o: 137.21, h: 137.77, l: 132.81, c: 133.1 },
            { o: 133.1, h: 134.9, l: 132.4, c: 134.7 },
            { o: 134.7, h: 141.99, l: 133.97, c: 141.52 },
            { o: 141.52, h: 150, l: 141.18, c: 149.17 },
            { o: 149.17, h: 155.5, l: 148.95, c: 154.79 },
            { o: 154.79, h: 162.22, l: 153.8, c: 162 }
          ],
          zones: [
            {
              from: 5,
              top: 132.69,
              bottom: 131.48,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 22,
              top: 142.32,
              bottom: 141.65,
              kind: "supply",
              label: "last LTF supply"
            },
            {
              from: 27,
              top: 132.7,
              bottom: 132.03,
              kind: "demand",
              label: "new demand (strong)"
            }
          ],
          trendlines: [
            {
              x1: 19,
              y1: 150.6,
              x2: 29,
              y2: 134.34,
              label: "LTF trendline"
            }
          ],
          reveal: 30
        }
      },
      {
        title: "Confirmation: crossed + removed",
        narration: "A rally closes above the trendline and then closes above the last supply. That is the confirmation. The new demand that did it removed the opposite zone, so it is strong.",
        scene: {
          candles: [
            { o: 162, h: 162.6, l: 161.2, c: 162 },
            { o: 162, h: 162.26, l: 154.47, c: 154.81 },
            { o: 154.81, h: 155.37, l: 147.13, c: 147.64 },
            { o: 147.64, h: 148.24, l: 139.8, c: 140.69 },
            { o: 140.69, h: 141.82, l: 130.94, c: 132 },
            { o: 132, h: 132.69, l: 131.75, c: 132.4 },
            { o: 132.4, h: 132.63, l: 131.48, c: 131.85 },
            { o: 131.85, h: 132.43, l: 131.58, c: 131.96 },
            { o: 131.96, h: 139.6, l: 131.61, c: 139.05 },
            { o: 139.05, h: 144.26, l: 138.73, c: 143.73 },
            { o: 143.73, h: 150.86, l: 143.27, c: 150 },
            { o: 150, h: 150.27, l: 145.5, c: 145.77 },
            { o: 145.77, h: 146.02, l: 141.63, c: 142.02 },
            { o: 142.02, h: 142.24, l: 138.07, c: 138.19 },
            { o: 138.19, h: 138.39, l: 132.6, c: 133.09 },
            { o: 133.09, h: 134.89, l: 132.19, c: 134.69 },
            { o: 134.69, h: 139.52, l: 134.45, c: 138.99 },
            { o: 138.99, h: 144.16, l: 138.63, c: 143.69 },
            { o: 143.69, h: 148.43, l: 143.3, c: 148 },
            { o: 148, h: 150.6, l: 147.5, c: 147.8 },
            { o: 147.8, h: 148.02, l: 145.16, c: 145.37 },
            { o: 145.37, h: 145.71, l: 141.71, c: 142 },
            { o: 142, h: 142.32, l: 141.65, c: 141.83 },
            { o: 141.83, h: 142.29, l: 141.68, c: 142.1 },
            { o: 142.1, h: 142.47, l: 139.03, c: 139.21 },
            { o: 139.21, h: 139.45, l: 135.23, c: 135.38 },
            { o: 135.38, h: 135.66, l: 132.26, c: 132.39 },
            { o: 132.39, h: 132.7, l: 132.07, c: 132.35 },
            { o: 132.35, h: 132.61, l: 132.03, c: 132.34 },
            { o: 132.34, h: 132.66, l: 132.16, c: 132.39 },
            { o: 132.39, h: 137.26, l: 132.24, c: 136.85 },
            { o: 136.85, h: 142.16, l: 136.18, c: 141.87 },
            { o: 141.87, h: 146.81, l: 141.5, c: 146.32 },
            { o: 146.32, h: 146.92, l: 140.89, c: 141.24 },
            { o: 141.24, h: 141.59, l: 136.79, c: 137.21 },
            { o: 137.21, h: 137.77, l: 132.81, c: 133.1 },
            { o: 133.1, h: 134.9, l: 132.4, c: 134.7 },
            { o: 134.7, h: 141.99, l: 133.97, c: 141.52 },
            { o: 141.52, h: 150, l: 141.18, c: 149.17 },
            { o: 149.17, h: 155.5, l: 148.95, c: 154.79 },
            { o: 154.79, h: 162.22, l: 153.8, c: 162 }
          ],
          zones: [
            {
              from: 5,
              top: 132.69,
              bottom: 131.48,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 22,
              top: 142.32,
              bottom: 141.65,
              kind: "supply",
              label: "last supply removed",
              to: 32,
              faded: true
            },
            {
              from: 27,
              top: 132.7,
              bottom: 132.03,
              kind: "demand",
              label: "new demand (strong)"
            }
          ],
          trendlines: [
            {
              x1: 19,
              y1: 150.6,
              x2: 31,
              y2: 131.09,
              label: "LTF trendline",
              broken: true
            }
          ],
          notes: [
            {
              x: 32,
              y: 148.31,
              text: "confirmation"
            }
          ],
          reveal: 33
        }
      },
      {
        title: "Trade the new zone",
        narration: "Now a buy limit goes on the new strong demand, stop under it. On the higher timeframe all of this looks like one wick into the zone.",
        scene: {
          candles: [
            { o: 162, h: 162.6, l: 161.2, c: 162 },
            { o: 162, h: 162.26, l: 154.47, c: 154.81 },
            { o: 154.81, h: 155.37, l: 147.13, c: 147.64 },
            { o: 147.64, h: 148.24, l: 139.8, c: 140.69 },
            { o: 140.69, h: 141.82, l: 130.94, c: 132 },
            { o: 132, h: 132.69, l: 131.75, c: 132.4 },
            { o: 132.4, h: 132.63, l: 131.48, c: 131.85 },
            { o: 131.85, h: 132.43, l: 131.58, c: 131.96 },
            { o: 131.96, h: 139.6, l: 131.61, c: 139.05 },
            { o: 139.05, h: 144.26, l: 138.73, c: 143.73 },
            { o: 143.73, h: 150.86, l: 143.27, c: 150 },
            { o: 150, h: 150.27, l: 145.5, c: 145.77 },
            { o: 145.77, h: 146.02, l: 141.63, c: 142.02 },
            { o: 142.02, h: 142.24, l: 138.07, c: 138.19 },
            { o: 138.19, h: 138.39, l: 132.6, c: 133.09 },
            { o: 133.09, h: 134.89, l: 132.19, c: 134.69 },
            { o: 134.69, h: 139.52, l: 134.45, c: 138.99 },
            { o: 138.99, h: 144.16, l: 138.63, c: 143.69 },
            { o: 143.69, h: 148.43, l: 143.3, c: 148 },
            { o: 148, h: 150.6, l: 147.5, c: 147.8 },
            { o: 147.8, h: 148.02, l: 145.16, c: 145.37 },
            { o: 145.37, h: 145.71, l: 141.71, c: 142 },
            { o: 142, h: 142.32, l: 141.65, c: 141.83 },
            { o: 141.83, h: 142.29, l: 141.68, c: 142.1 },
            { o: 142.1, h: 142.47, l: 139.03, c: 139.21 },
            { o: 139.21, h: 139.45, l: 135.23, c: 135.38 },
            { o: 135.38, h: 135.66, l: 132.26, c: 132.39 },
            { o: 132.39, h: 132.7, l: 132.07, c: 132.35 },
            { o: 132.35, h: 132.61, l: 132.03, c: 132.34 },
            { o: 132.34, h: 132.66, l: 132.16, c: 132.39 },
            { o: 132.39, h: 137.26, l: 132.24, c: 136.85 },
            { o: 136.85, h: 142.16, l: 136.18, c: 141.87 },
            { o: 141.87, h: 146.81, l: 141.5, c: 146.32 },
            { o: 146.32, h: 146.92, l: 140.89, c: 141.24 },
            { o: 141.24, h: 141.59, l: 136.79, c: 137.21 },
            { o: 137.21, h: 137.77, l: 132.81, c: 133.1 },
            { o: 133.1, h: 134.9, l: 132.4, c: 134.7 },
            { o: 134.7, h: 141.99, l: 133.97, c: 141.52 },
            { o: 141.52, h: 150, l: 141.18, c: 149.17 },
            { o: 149.17, h: 155.5, l: 148.95, c: 154.79 },
            { o: 154.79, h: 162.22, l: 153.8, c: 162 }
          ],
          zones: [
            {
              from: 5,
              top: 132.69,
              bottom: 131.48,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 22,
              top: 142.32,
              bottom: 141.65,
              kind: "supply",
              label: "last supply removed",
              to: 32,
              faded: true
            },
            {
              from: 27,
              top: 132.7,
              bottom: 132.03,
              kind: "demand",
              label: "new demand (strong)"
            }
          ],
          trendlines: [
            {
              x1: 19,
              y1: 150.6,
              x2: 31,
              y2: 131.09,
              label: "LTF trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 132.7,
              label: "buy limit",
              kind: "entry",
              from: 27
            },
            {
              y: 131.63,
              label: "stop",
              kind: "sl",
              from: 27
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A daily zone is touched for the second time. What does Raja do?",
        options: [
          "Set and forget again",
          "Use the confirmation rule only",
          "Sell it",
          "Double the lot size"
        ],
        answer: 1,
        explain: "First touch is set and forget. The second touch is a retest, and a retested zone is always weak, so confirmation only."
      },
      {
        type: "order",
        q: "Put the confirmation rule in order.",
        items: [
          "Go to a lower timeframe inside the HTF zone",
          "Wait for price to cross the LTF trendline",
          "Wait for the last opposite zone to be removed",
          "Trade the new zone that did the removing"
        ],
        explain: "Lower timeframe, then the line, then the removal. The new CP or valley zone that removed the opposite zone is the one you trade."
      },
      {
        type: "spot",
        q: "Supply #1 sits on the peak. Supply #2 is lower. Click the supply that is strong.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 123.88, l: 119.94, c: 123.59 },
            { o: 123.59, h: 128.57, l: 123.1, c: 128.19 },
            { o: 128.19, h: 132.47, l: 127.92, c: 132 },
            { o: 132, h: 132.39, l: 131.65, c: 131.92 },
            { o: 131.92, h: 132.28, l: 131.59, c: 131.99 },
            { o: 131.99, h: 135.61, l: 131.8, c: 135.27 },
            { o: 135.27, h: 139.16, l: 135.05, c: 138.76 },
            { o: 138.76, h: 142.1, l: 138.31, c: 142 },
            { o: 142, h: 142.24, l: 141.48, c: 141.67 },
            { o: 141.67, h: 142.01, l: 141.31, c: 141.75 },
            { o: 141.75, h: 142.13, l: 141.45, c: 141.92 },
            { o: 141.92, h: 148.06, l: 141.33, c: 147.41 },
            { o: 147.41, h: 154.12, l: 146.58, c: 153.34 },
            { o: 153.34, h: 160.28, l: 152.61, c: 159.51 },
            { o: 159.51, h: 164.36, l: 159.03, c: 164 },
            { o: 164, h: 164.36, l: 163.55, c: 163.81 },
            { o: 163.81, h: 164.24, l: 163.56, c: 163.91 },
            { o: 163.91, h: 164.44, l: 159.14, c: 159.72 },
            { o: 159.72, h: 159.99, l: 154.95, c: 155.13 },
            { o: 155.13, h: 155.7, l: 149.17, c: 149.38 },
            { o: 149.38, h: 149.74, l: 144.48, c: 144.74 },
            { o: 144.74, h: 144.96, l: 144.23, c: 144.42 },
            { o: 144.42, h: 144.96, l: 144.09, c: 144.71 },
            { o: 144.71, h: 147.35, l: 144.48, c: 147.07 },
            { o: 147.07, h: 150.99, l: 146.57, c: 150.83 },
            { o: 150.83, h: 154.4, l: 150.56, c: 154 },
            { o: 154, h: 154.29, l: 153.67, c: 154 },
            { o: 154, h: 154.37, l: 153.76, c: 153.94 },
            { o: 153.94, h: 154.51, l: 149.71, c: 149.85 },
            { o: 149.85, h: 150.44, l: 144.35, c: 144.81 },
            { o: 144.81, h: 145.09, l: 138.89, c: 139.19 },
            { o: 139.19, h: 139.43, l: 133.39, c: 134 },
            { o: 134, h: 134.18, l: 133.83, c: 133.99 },
            { o: 133.99, h: 134.32, l: 133.62, c: 134.06 },
            { o: 134.06, h: 138.76, l: 133.71, c: 138.4 },
            { o: 138.4, h: 142.75, l: 138.19, c: 142.54 },
            { o: 142.54, h: 147.53, l: 142.27, c: 147.38 },
            { o: 147.38, h: 154.07, l: 146.83, c: 153.27 },
            { o: 153.27, h: 153.98, l: 151.27, c: 151.47 },
            { o: 151.47, h: 151.95, l: 144.79, c: 145.45 },
            { o: 145.45, h: 145.87, l: 139.34, c: 139.76 },
            { o: 139.76, h: 140.23, l: 135.22, c: 135.57 },
            { o: 135.57, h: 136.04, l: 129.74, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.24,
              bottom: 141.31,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.22,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 39
        },
        answer: {
          from: 27,
          to: 28
        },
        explain: "#1 crossed the line but could not remove the demand. #2 removed it, so #2 is strong. #1 is an inheritance zone: it gave its power to #2."
      },
      {
        type: "tf",
        q: "An inheritance zone is strong because it sits on the peak.",
        answer: false,
        explain: "Where it sits does not matter. It never removed the opposite zone. Raja gives it about a 10% chance to hold."
      },
      {
        type: "tf",
        q: "A supply that formed inside an old demand area is an overlap zone and gets confirmation only.",
        answer: true,
        explain: "Overlap zones are weak areas. Never set and forget on them."
      },
      {
        type: "mcq",
        q: "Raja says most S&D traders lose because...",
        options: [
          "They use indicators",
          "They only know set and forget",
          "They trade too few pairs",
          "They use the daily chart"
        ],
        answer: 1,
        explain: "He blames using set and forget everywhere. Weak zones need the confirmation rule, which he calls safe trading."
      }
    ],
    practice: [
      {
        prompt: "A supply formed right inside the old demand area and then dropped. Price is back at the supply. Sell limit, buy, or nothing?",
        scene: {
          candles: [
            { o: 128, h: 131.95, l: 127.64, c: 131.72 },
            { o: 131.72, h: 136.43, l: 131.42, c: 135.87 },
            { o: 135.87, h: 140.56, l: 135.53, c: 140 },
            { o: 140, h: 140.78, l: 139.73, c: 140.44 },
            { o: 140.44, h: 140.94, l: 139.88, c: 140.25 },
            { o: 140.25, h: 140.47, l: 139.64, c: 140.04 },
            { o: 140.04, h: 145.16, l: 139.78, c: 144.69 },
            { o: 144.69, h: 151.24, l: 144.04, c: 150.61 },
            { o: 150.61, h: 154.89, l: 150.29, c: 154.65 },
            { o: 154.65, h: 160.73, l: 153.9, c: 160 },
            { o: 160, h: 160.23, l: 154.29, c: 154.89 },
            { o: 154.89, h: 155.47, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.13, l: 144.03, c: 144.38 },
            { o: 144.38, h: 144.82, l: 140.17, c: 140.59 },
            { o: 140.59, h: 140.88, l: 140.24, c: 140.54 },
            { o: 140.54, h: 140.71, l: 140.27, c: 140.53 },
            { o: 140.53, h: 140.72, l: 137.71, c: 137.86 },
            { o: 137.86, h: 138.18, l: 135.06, c: 135.16 },
            { o: 135.16, h: 135.34, l: 133.03, c: 133.12 },
            { o: 133.12, h: 133.24, l: 129.8, c: 130 },
            { o: 130, h: 130.44, l: 129.7, c: 130.28 },
            { o: 130.28, h: 130.57, l: 129.84, c: 130.08 },
            { o: 130.08, h: 133.08, l: 129.75, c: 132.77 },
            { o: 132.77, h: 134.96, l: 132.62, c: 134.74 },
            { o: 134.74, h: 137.68, l: 134.54, c: 137.36 },
            { o: 137.36, h: 139.94, l: 137.05, c: 139.84 },
            { o: 139.84, h: 143.15, l: 139.72, c: 142.78 },
            { o: 142.78, h: 145.31, l: 142.67, c: 145.06 },
            { o: 145.06, h: 148.81, l: 144.6, c: 148.49 },
            { o: 148.49, h: 150.97, l: 148.19, c: 150.88 }
          ],
          zones: [
            {
              from: 3,
              top: 140.94,
              bottom: 139.64,
              kind: "demand",
              label: "old demand",
              to: 16,
              faded: true
            },
            {
              from: 14,
              top: 140.88,
              bottom: 140.24,
              kind: "supply",
              label: "supply"
            }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The supply was born inside an old demand, so it is an overlap zone. Overlap is weak: confirmation only, never a blind sell limit. Price ran right through it."
      }
    ],
    cards: [
      {
        front: "Is a retested zone strong or weak?",
        back: "Always weak. Confirmation only."
      },
      {
        front: "Monthly zone touch count?",
        back: "1st set and forget, 2nd and 3rd confirmation, 4th usually breaks."
      },
      {
        front: "Daily / weekly touch count?",
        back: "1st set and forget, 2nd confirmation, 3rd risky."
      },
      {
        front: "Confirmation rule?",
        back: "On a lower timeframe: trendline crossed AND last opposite zone removed."
      },
      {
        front: "Inheritance zone?",
        back: "A peak zone that crossed the line but could not remove the opposite zone. Weak."
      },
      {
        front: "Overlap zone?",
        back: "A zone born inside an old opposite zone. Weak, confirmation only."
      },
      {
        front: "Flip zone?",
        back: "Old resistance turned support (or the reverse). Confirmation only."
      }
    ],
    mnemonic: "Touched once = trusted. Touched again = test it first."
  },
  {
    mentor: "raja",
    n: 3,
    eli5: {
      oneLiner: "A turn is real only after the line breaks and two opposite zones fall.",
      story: "A river flows downhill. One day you see a little water splash back up a rock. That is not the river turning, it is just a splash. But if the water climbs over two rocks in a row, the river really is flowing a new way. Raja waits for that second rock.",
      analogy: "One removed zone is a splash. Two removed zones is the river changing course."
    },
    bigIdeas: [
      "Direction changes on a timeframe when price crosses its trendline AND removes two opposite zones.",
      "One removed zone may only be a pullback.",
      "After the change, enter on the retest (CP or peak/valley zone) and target the HTF strong or arrival zone."
    ],
    steps: [
      {
        title: "An uptrend and its line",
        narration: "Price is rising along its trendline and leaves two demand zones on the way: #2 lower and #1 higher. Far below sits an HTF strong demand.",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2"
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1"
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 19,
              y2: 143.46,
              label: "trendline"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "The line is crossed on a close",
        narration: "A big candle closes below the trendline. That is the first condition, but it is not enough on its own.",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2"
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1"
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 22,
              y2: 149.19,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 22
        }
      },
      {
        title: "Zone #1 removed: maybe a pullback",
        narration: "Price closes below demand #1. Raja calls this good, but still not a change. Demand #2 is below, so buyers still have a chance.",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2"
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 22,
              y2: 149.19,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 23
        }
      },
      {
        title: "Zone #2 removed: direction changed",
        narration: "After a small pause (a CP supply), price closes below demand #2 too. Line crossed plus two zones removed: direction has changed on this timeframe.",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2 removed",
              to: 27,
              faded: true
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            },
            {
              from: 23,
              top: 139.42,
              bottom: 138.56,
              kind: "supply",
              label: "CP supply (retest)"
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 22,
              y2: 149.19,
              label: "trendline",
              broken: true
            }
          ],
          notes: [
            {
              x: 27,
              y: 124.67,
              text: "2nd zone gone"
            }
          ],
          reveal: 28
        }
      },
      {
        title: "Sell the retest, aim for the HTF zone",
        narration: "Price usually makes two pushes and then retests. The retest comes at the CP level. Sell there, with the target at the HTF strong demand below.",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2 removed",
              to: 27,
              faded: true
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            },
            {
              from: 23,
              top: 139.42,
              bottom: 138.56,
              kind: "supply",
              label: "CP supply (retest)"
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 22,
              y2: 149.19,
              label: "trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 138.56,
              label: "sell",
              kind: "entry",
              from: 23
            },
            {
              y: 139.82,
              label: "stop",
              kind: "sl",
              from: 23
            },
            {
              y: 119.39,
              label: "TP: HTF zone",
              kind: "tp",
              from: 23
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What does a change of direction need, in Raja's rule?",
        options: [
          "One big red candle",
          "Trendline crossed + one zone removed",
          "Trendline crossed + two opposite zones removed",
          "An indicator crossover"
        ],
        answer: 2,
        explain: "Line crossed and two opposite zones removed. With only one removed, it may just be a pullback."
      },
      {
        type: "tf",
        q: "After one demand is removed you should sell right away.",
        answer: false,
        explain: "With one demand still below, buyers still have a chance. Wait for the second zone to go."
      },
      {
        type: "spot",
        q: "Click the candle that changed the direction (the close that removes the second demand).",
        scene: {
          candles: [
            { o: 132, h: 132.6, l: 127.3, c: 127.72 },
            { o: 127.72, h: 128.18, l: 123.8, c: 123.92 },
            { o: 123.92, h: 124.55, l: 118.7, c: 119 },
            { o: 119, h: 119.28, l: 118.32, c: 118.7 },
            { o: 118.7, h: 118.88, l: 118.47, c: 118.67 },
            { o: 118.67, h: 119.39, l: 118.44, c: 118.97 },
            { o: 118.97, h: 122.26, l: 118.63, c: 122.1 },
            { o: 122.1, h: 125.97, l: 121.83, c: 125.52 },
            { o: 125.52, h: 130.51, l: 125.19, c: 130 },
            { o: 130, h: 130.21, l: 129.36, c: 129.7 },
            { o: 129.7, h: 130.37, l: 129.43, c: 130.06 },
            { o: 130.06, h: 133.98, l: 129.9, c: 133.58 },
            { o: 133.58, h: 137.57, l: 133.3, c: 137.3 },
            { o: 137.3, h: 142.15, l: 136.81, c: 142 },
            { o: 142, h: 142.18, l: 141.69, c: 141.9 },
            { o: 141.9, h: 142.12, l: 141.61, c: 141.94 },
            { o: 141.94, h: 146.42, l: 141.76, c: 146.15 },
            { o: 146.15, h: 150.89, l: 145.9, c: 150.7 },
            { o: 150.7, h: 156.63, l: 150.45, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.14, l: 149.83, c: 150.34 },
            { o: 150.34, h: 151.19, l: 143.88, c: 144.12 },
            { o: 144.12, h: 144.47, l: 138.79, c: 139.11 },
            { o: 139.11, h: 139.42, l: 138.65, c: 138.84 },
            { o: 138.84, h: 139.37, l: 138.56, c: 139.18 },
            { o: 139.18, h: 139.44, l: 133.7, c: 134.1 },
            { o: 134.1, h: 134.61, l: 129.97, c: 130.3 },
            { o: 130.3, h: 130.68, l: 126.17, c: 126.36 },
            { o: 126.36, h: 130.89, l: 126.11, c: 130.5 },
            { o: 130.5, h: 134.3, l: 130.32, c: 134.08 },
            { o: 134.08, h: 138.46, l: 133.67, c: 138.16 },
            { o: 138.16, h: 138.95, l: 136.36, c: 136.56 },
            { o: 136.56, h: 136.79, l: 132.45, c: 132.9 },
            { o: 132.9, h: 133.13, l: 127.63, c: 127.84 },
            { o: 127.84, h: 128.37, l: 123.26, c: 123.52 },
            { o: 123.52, h: 123.85, l: 119.17, c: 119.69 },
            { o: 119.69, h: 121.09, l: 118.99, c: 120.89 }
          ],
          zones: [
            {
              from: 3,
              top: 119.39,
              bottom: 118.32,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 9,
              top: 130.37,
              bottom: 129.36,
              kind: "demand",
              label: "#2"
            },
            {
              from: 14,
              top: 142.18,
              bottom: 141.61,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.72,
              x2: 22,
              y2: 149.19,
              label: "trendline",
              broken: true
            }
          ]
        },
        answer: {
          from: 27,
          to: 27
        },
        explain: "This close takes out demand #2. The line was already crossed and #1 was already gone, so now the direction has changed."
      },
      {
        type: "order",
        q: "Put the change-of-direction trade in order.",
        items: [
          "Trendline crossed on a close",
          "Opposite zone #1 removed",
          "Opposite zone #2 removed",
          "Enter on the retest at the CP or peak level",
          "Target the HTF strong or arrival zone"
        ],
        explain: "Two pushes remove the two zones, then the retest gives the entry."
      },
      {
        type: "mcq",
        q: "After the change, where does price usually go?",
        options: [
          "Back to the trendline forever",
          "To the opposite HTF strong or arrival zone",
          "Sideways",
          "Nowhere, it stops"
        ],
        answer: 1,
        explain: "The target is the HTF strong or arrival zone in the new direction."
      }
    ],
    practice: [
      {
        prompt: "The trendline is crossed and demand #1 is gone. Demand #2 is still below and price is close to it. Sell now?",
        scene: {
          candles: [
            { o: 132, h: 132.22, l: 127.2, c: 127.34 },
            { o: 127.34, h: 127.87, l: 122, c: 122.39 },
            { o: 122.39, h: 122.83, l: 118.56, c: 119 },
            { o: 119, h: 119.57, l: 118.66, c: 119.24 },
            { o: 119.24, h: 119.55, l: 118.84, c: 119.35 },
            { o: 119.35, h: 119.79, l: 118.73, c: 119.03 },
            { o: 119.03, h: 122.39, l: 118.84, c: 122.25 },
            { o: 122.25, h: 126.19, l: 122.09, c: 125.73 },
            { o: 125.73, h: 130.16, l: 125.17, c: 130 },
            { o: 130, h: 130.19, l: 129.71, c: 129.95 },
            { o: 129.95, h: 130.29, l: 129.62, c: 130.01 },
            { o: 130.01, h: 134.58, l: 129.61, c: 134.02 },
            { o: 134.02, h: 139.07, l: 133.72, c: 138.53 },
            { o: 138.53, h: 142.42, l: 138.14, c: 142 },
            { o: 142, h: 142.29, l: 141.51, c: 141.82 },
            { o: 141.82, h: 142.47, l: 141.56, c: 142.13 },
            { o: 142.13, h: 146.35, l: 141.85, c: 146.2 },
            { o: 146.2, h: 151.6, l: 145.78, c: 151.04 },
            { o: 151.04, h: 156.33, l: 150.36, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.33, l: 149.29, c: 149.95 },
            { o: 149.95, h: 150.48, l: 143.1, c: 143.7 },
            { o: 143.7, h: 144.01, l: 136.67, c: 137.11 },
            { o: 137.11, h: 137.29, l: 131.5, c: 131.89 },
            { o: 131.89, h: 132.29, l: 130.02, c: 132.09 },
            { o: 132.09, h: 136.11, l: 131.63, c: 135.93 },
            { o: 135.93, h: 141.58, l: 135.27, c: 140.99 },
            { o: 140.99, h: 147.8, l: 140.53, c: 147.05 },
            { o: 147.05, h: 152.35, l: 146.71, c: 152 }
          ],
          zones: [
            {
              from: 3,
              top: 119.79,
              bottom: 118.66,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 9,
              top: 130.29,
              bottom: 129.62,
              kind: "demand",
              label: "#2"
            },
            {
              from: 14,
              top: 142.47,
              bottom: 141.51,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 117.03,
              x2: 22,
              y2: 147.85,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Only one opposite zone was removed. That can be just a pullback, and demand #2 is right under price. Price bounced from #2 and went back up. Waiting was right."
      },
      {
        prompt: "Line crossed, demand #1 removed, demand #2 removed. Price is now retesting the CP supply. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 132, h: 132.41, l: 126.86, c: 127.2 },
            { o: 127.2, h: 127.66, l: 122.35, c: 122.65 },
            { o: 122.65, h: 122.9, l: 118.82, c: 119 },
            { o: 119, h: 119.35, l: 118.64, c: 118.97 },
            { o: 118.97, h: 119.47, l: 118.72, c: 119.14 },
            { o: 119.14, h: 119.48, l: 118.47, c: 118.83 },
            { o: 118.83, h: 122.71, l: 118.35, c: 122.42 },
            { o: 122.42, h: 126.11, l: 122.2, c: 125.9 },
            { o: 125.9, h: 130.46, l: 125.56, c: 130 },
            { o: 130, h: 130.16, l: 129.4, c: 129.68 },
            { o: 129.68, h: 130.47, l: 129.37, c: 130.07 },
            { o: 130.07, h: 134.64, l: 129.55, c: 134.1 },
            { o: 134.1, h: 137.96, l: 133.96, c: 137.79 },
            { o: 137.79, h: 142.21, l: 137.26, c: 142 },
            { o: 142, h: 142.49, l: 141.62, c: 142.23 },
            { o: 142.23, h: 142.4, l: 141.86, c: 142.14 },
            { o: 142.14, h: 146.7, l: 141.72, c: 146.31 },
            { o: 146.31, h: 151.68, l: 145.86, c: 151.06 },
            { o: 151.06, h: 156.65, l: 150.38, c: 156 },
            { o: 156, h: 158.5, l: 155.4, c: 155.7 },
            { o: 155.7, h: 156.1, l: 151, c: 151.26 },
            { o: 151.26, h: 151.93, l: 145.1, c: 145.5 },
            { o: 145.5, h: 146.22, l: 138.45, c: 139.12 },
            { o: 139.12, h: 139.55, l: 138.73, c: 139.39 },
            { o: 139.39, h: 139.62, l: 138.8, c: 139 },
            { o: 139, h: 139.61, l: 134.15, c: 134.48 },
            { o: 134.48, h: 134.72, l: 130.87, c: 131.24 },
            { o: 131.24, h: 131.53, l: 125.81, c: 126.37 },
            { o: 126.37, h: 130.71, l: 126.14, c: 130.55 },
            { o: 130.55, h: 135.5, l: 130.17, c: 134.9 },
            { o: 134.9, h: 138.81, l: 134.6, c: 138.33 },
            { o: 138.33, h: 139.13, l: 136.53, c: 136.73 },
            { o: 136.73, h: 136.95, l: 132.86, c: 133.07 },
            { o: 133.07, h: 133.56, l: 127.18, c: 127.78 },
            { o: 127.78, h: 128.18, l: 123.31, c: 123.59 },
            { o: 123.59, h: 123.86, l: 119.56, c: 119.78 },
            { o: 119.78, h: 121.18, l: 119.08, c: 120.98 }
          ],
          zones: [
            {
              from: 3,
              top: 119.48,
              bottom: 118.47,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 9,
              top: 130.47,
              bottom: 129.37,
              kind: "demand",
              label: "#2 removed",
              to: 27,
              faded: true
            },
            {
              from: 14,
              top: 142.49,
              bottom: 141.62,
              kind: "demand",
              label: "#1 removed",
              to: 22,
              faded: true
            },
            {
              from: 23,
              top: 139.62,
              bottom: 138.73,
              kind: "supply",
              label: "CP supply"
            }
          ],
          trendlines: [
            {
              x1: 5,
              y1: 116.5,
              x2: 22,
              y2: 147.9,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Both conditions are met, so direction has changed on this timeframe. The retest at the CP level is the entry. Price dropped to the HTF demand."
      }
    ],
    cards: [
      {
        front: "Direction change rule?",
        back: "Trendline crossed + TWO opposite zones removed."
      },
      {
        front: "Only one zone removed means?",
        back: "Maybe just a pullback. Not a change yet."
      },
      {
        front: "Target after a change?",
        back: "The HTF strong or arrival zone in the new direction."
      },
      {
        front: "Where is the entry after a change?",
        back: "On the retest, at the new CP level or peak/valley level."
      },
      {
        front: "Which timeframe changed?",
        back: "Only the one whose line and two zones broke."
      }
    ],
    mnemonic: "Line, one, two: then it is true."
  },
  {
    mentor: "raja",
    n: 4,
    eli5: {
      oneLiner: "Buy near the floor, sell near the ceiling, and trust only closes.",
      story: "Picture a room with a hard floor and a hard ceiling. A ball thrown near the ceiling is about to come down, and a ball near the floor is about to bounce up. So you catch balls going up only near the floor. Raja splits the room into a top quarter for sellers and a bottom quarter for buyers.",
      analogy: "The two HTF zones are the floor and the ceiling. The low curve is the trampoline at the bottom; the high curve is the low roof at the top."
    },
    bigIdeas: [
      "Between two HTF strong zones: top 0-25% is the high curve (sellers only), bottom 0-25% is the low curve (buyers only).",
      "A trendline is crossed only when a candle closes beyond it. A wick is a fake signal.",
      "Trail the stop to each new fresh zone, because price may turn before the TP."
    ],
    steps: [
      {
        title: "Two HTF zones frame the map",
        narration: "Find the two monthly or weekly strong zones above and below price. Everything happens between them.",
        scene: {
          candles: [
            { o: 172, h: 178.79, l: 171.19, c: 178.29 },
            { o: 178.29, h: 186.33, l: 177.48, c: 186 },
            { o: 186, h: 186.45, l: 185.41, c: 185.62 },
            { o: 185.62, h: 186.22, l: 185.4, c: 185.78 },
            { o: 185.78, h: 186.45, l: 185.6, c: 186.01 },
            { o: 186.01, h: 186.76, l: 173.2, c: 174.44 },
            { o: 174.44, h: 174.96, l: 163.12, c: 164.4 },
            { o: 164.4, h: 164.71, l: 155.2, c: 156 },
            { o: 156, h: 156.46, l: 144.47, c: 145.58 },
            { o: 145.58, h: 146.03, l: 135.58, c: 136.64 },
            { o: 136.64, h: 137.7, l: 126.82, c: 128 },
            { o: 128, h: 128.34, l: 127.61, c: 128.07 },
            { o: 128.07, h: 128.47, l: 127.66, c: 128.18 },
            { o: 128.18, h: 128.51, l: 127.72, c: 128.13 },
            { o: 128.13, h: 137.33, l: 126.99, c: 136.75 },
            { o: 136.75, h: 147.04, l: 135.54, c: 145.89 },
            { o: 145.89, h: 155.61, l: 145.32, c: 154.85 },
            { o: 154.85, h: 163.95, l: 154.56, c: 163.57 },
            { o: 163.57, h: 173.35, l: 163.22, c: 172.68 },
            { o: 172.68, h: 172.89, l: 172.31, c: 172.53 },
            { o: 172.53, h: 172.88, l: 172.34, c: 172.72 },
            { o: 172.72, h: 177.58, l: 172.51, c: 177.18 },
            { o: 177.18, h: 177.56, l: 170.25, c: 170.75 },
            { o: 170.75, h: 171.03, l: 163.55, c: 164.14 },
            { o: 164.14, h: 164.74, l: 155.43, c: 155.94 },
            { o: 155.94, h: 156.14, l: 148.66, c: 149.29 },
            { o: 149.29, h: 150.15, l: 139.06, c: 140.23 },
            { o: 140.23, h: 140.55, l: 139.74, c: 140.12 },
            { o: 140.12, h: 140.28, l: 139.77, c: 140.13 },
            { o: 140.13, h: 140.67, l: 139.78, c: 140.28 },
            { o: 140.28, h: 143.93, l: 140.08, c: 143.77 },
            { o: 143.77, h: 147.75, l: 143.48, c: 147.45 },
            { o: 147.45, h: 151.12, l: 147.25, c: 150.73 },
            { o: 150.73, h: 151.07, l: 150.48, c: 150.68 },
            { o: 150.68, h: 151.01, l: 150.48, c: 150.71 },
            { o: 150.71, h: 153.4, l: 150.59, c: 153.15 },
            { o: 153.15, h: 156.51, l: 152.75, c: 156.25 },
            { o: 156.25, h: 159.3, l: 155.97, c: 158.95 },
            { o: 158.95, h: 159.32, l: 158.49, c: 158.71 },
            { o: 158.71, h: 159.14, l: 158.35, c: 158.85 },
            { o: 158.85, h: 163.57, l: 158.49, c: 163.12 },
            { o: 163.12, h: 166.78, l: 162.78, c: 166.51 },
            { o: 166.51, h: 170.57, l: 166.28, c: 170.18 }
          ],
          zones: [
            {
              from: 2,
              top: 186.45,
              bottom: 185.4,
              kind: "supply",
              label: "HTF strong supply"
            },
            {
              from: 11,
              top: 128.51,
              bottom: 127.61,
              kind: "demand",
              label: "HTF strong demand"
            }
          ],
          reveal: 14
        }
      },
      {
        title: "Draw the curve",
        narration: "Mark the 50% line in the middle and a 25% band at each end. Raja draws it by hand; he does not trust indicators. Top band: high curve, sellers only. Bottom band: low curve, buyers only.",
        scene: {
          candles: [
            { o: 172, h: 178.79, l: 171.19, c: 178.29 },
            { o: 178.29, h: 186.33, l: 177.48, c: 186 },
            { o: 186, h: 186.45, l: 185.41, c: 185.62 },
            { o: 185.62, h: 186.22, l: 185.4, c: 185.78 },
            { o: 185.78, h: 186.45, l: 185.6, c: 186.01 },
            { o: 186.01, h: 186.76, l: 173.2, c: 174.44 },
            { o: 174.44, h: 174.96, l: 163.12, c: 164.4 },
            { o: 164.4, h: 164.71, l: 155.2, c: 156 },
            { o: 156, h: 156.46, l: 144.47, c: 145.58 },
            { o: 145.58, h: 146.03, l: 135.58, c: 136.64 },
            { o: 136.64, h: 137.7, l: 126.82, c: 128 },
            { o: 128, h: 128.34, l: 127.61, c: 128.07 },
            { o: 128.07, h: 128.47, l: 127.66, c: 128.18 },
            { o: 128.18, h: 128.51, l: 127.72, c: 128.13 },
            { o: 128.13, h: 137.33, l: 126.99, c: 136.75 },
            { o: 136.75, h: 147.04, l: 135.54, c: 145.89 },
            { o: 145.89, h: 155.61, l: 145.32, c: 154.85 },
            { o: 154.85, h: 163.95, l: 154.56, c: 163.57 },
            { o: 163.57, h: 173.35, l: 163.22, c: 172.68 },
            { o: 172.68, h: 172.89, l: 172.31, c: 172.53 },
            { o: 172.53, h: 172.88, l: 172.34, c: 172.72 },
            { o: 172.72, h: 177.58, l: 172.51, c: 177.18 },
            { o: 177.18, h: 177.56, l: 170.25, c: 170.75 },
            { o: 170.75, h: 171.03, l: 163.55, c: 164.14 },
            { o: 164.14, h: 164.74, l: 155.43, c: 155.94 },
            { o: 155.94, h: 156.14, l: 148.66, c: 149.29 },
            { o: 149.29, h: 150.15, l: 139.06, c: 140.23 },
            { o: 140.23, h: 140.55, l: 139.74, c: 140.12 },
            { o: 140.12, h: 140.28, l: 139.77, c: 140.13 },
            { o: 140.13, h: 140.67, l: 139.78, c: 140.28 },
            { o: 140.28, h: 143.93, l: 140.08, c: 143.77 },
            { o: 143.77, h: 147.75, l: 143.48, c: 147.45 },
            { o: 147.45, h: 151.12, l: 147.25, c: 150.73 },
            { o: 150.73, h: 151.07, l: 150.48, c: 150.68 },
            { o: 150.68, h: 151.01, l: 150.48, c: 150.71 },
            { o: 150.71, h: 153.4, l: 150.59, c: 153.15 },
            { o: 153.15, h: 156.51, l: 152.75, c: 156.25 },
            { o: 156.25, h: 159.3, l: 155.97, c: 158.95 },
            { o: 158.95, h: 159.32, l: 158.49, c: 158.71 },
            { o: 158.71, h: 159.14, l: 158.35, c: 158.85 },
            { o: 158.85, h: 163.57, l: 158.49, c: 163.12 },
            { o: 163.12, h: 166.78, l: 162.78, c: 166.51 },
            { o: 166.51, h: 170.57, l: 166.28, c: 170.18 }
          ],
          zones: [
            {
              from: 2,
              top: 186.45,
              bottom: 185.4,
              kind: "supply",
              label: "HTF strong supply"
            },
            {
              from: 11,
              top: 128.51,
              bottom: 127.61,
              kind: "demand",
              label: "HTF strong demand"
            }
          ],
          lines: [
            {
              y: 171.18,
              label: "high curve (top 25%)",
              kind: "level"
            },
            {
              y: 156.95,
              label: "50%",
              kind: "level"
            },
            {
              y: 142.73,
              label: "low curve (bottom 25%)",
              kind: "level"
            }
          ],
          reveal: 14
        }
      },
      {
        title: "Skip demand in the high curve",
        narration: "Price rallies into the high curve and leaves a small demand. Raja does not use it: sellers sit near the HTF supply. Price soon drops right through it.",
        scene: {
          candles: [
            { o: 172, h: 178.79, l: 171.19, c: 178.29 },
            { o: 178.29, h: 186.33, l: 177.48, c: 186 },
            { o: 186, h: 186.45, l: 185.41, c: 185.62 },
            { o: 185.62, h: 186.22, l: 185.4, c: 185.78 },
            { o: 185.78, h: 186.45, l: 185.6, c: 186.01 },
            { o: 186.01, h: 186.76, l: 173.2, c: 174.44 },
            { o: 174.44, h: 174.96, l: 163.12, c: 164.4 },
            { o: 164.4, h: 164.71, l: 155.2, c: 156 },
            { o: 156, h: 156.46, l: 144.47, c: 145.58 },
            { o: 145.58, h: 146.03, l: 135.58, c: 136.64 },
            { o: 136.64, h: 137.7, l: 126.82, c: 128 },
            { o: 128, h: 128.34, l: 127.61, c: 128.07 },
            { o: 128.07, h: 128.47, l: 127.66, c: 128.18 },
            { o: 128.18, h: 128.51, l: 127.72, c: 128.13 },
            { o: 128.13, h: 137.33, l: 126.99, c: 136.75 },
            { o: 136.75, h: 147.04, l: 135.54, c: 145.89 },
            { o: 145.89, h: 155.61, l: 145.32, c: 154.85 },
            { o: 154.85, h: 163.95, l: 154.56, c: 163.57 },
            { o: 163.57, h: 173.35, l: 163.22, c: 172.68 },
            { o: 172.68, h: 172.89, l: 172.31, c: 172.53 },
            { o: 172.53, h: 172.88, l: 172.34, c: 172.72 },
            { o: 172.72, h: 177.58, l: 172.51, c: 177.18 },
            { o: 177.18, h: 177.56, l: 170.25, c: 170.75 },
            { o: 170.75, h: 171.03, l: 163.55, c: 164.14 },
            { o: 164.14, h: 164.74, l: 155.43, c: 155.94 },
            { o: 155.94, h: 156.14, l: 148.66, c: 149.29 },
            { o: 149.29, h: 150.15, l: 139.06, c: 140.23 },
            { o: 140.23, h: 140.55, l: 139.74, c: 140.12 },
            { o: 140.12, h: 140.28, l: 139.77, c: 140.13 },
            { o: 140.13, h: 140.67, l: 139.78, c: 140.28 },
            { o: 140.28, h: 143.93, l: 140.08, c: 143.77 },
            { o: 143.77, h: 147.75, l: 143.48, c: 147.45 },
            { o: 147.45, h: 151.12, l: 147.25, c: 150.73 },
            { o: 150.73, h: 151.07, l: 150.48, c: 150.68 },
            { o: 150.68, h: 151.01, l: 150.48, c: 150.71 },
            { o: 150.71, h: 153.4, l: 150.59, c: 153.15 },
            { o: 153.15, h: 156.51, l: 152.75, c: 156.25 },
            { o: 156.25, h: 159.3, l: 155.97, c: 158.95 },
            { o: 158.95, h: 159.32, l: 158.49, c: 158.71 },
            { o: 158.71, h: 159.14, l: 158.35, c: 158.85 },
            { o: 158.85, h: 163.57, l: 158.49, c: 163.12 },
            { o: 163.12, h: 166.78, l: 162.78, c: 166.51 },
            { o: 166.51, h: 170.57, l: 166.28, c: 170.18 }
          ],
          zones: [
            {
              from: 2,
              top: 186.45,
              bottom: 185.4,
              kind: "supply",
              label: "HTF strong supply"
            },
            {
              from: 11,
              top: 128.51,
              bottom: 127.61,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 19,
              top: 172.89,
              bottom: 172.31,
              kind: "demand",
              label: "high-curve demand: skip",
              to: 22,
              faded: true
            }
          ],
          lines: [
            {
              y: 171.18,
              label: "high curve (top 25%)",
              kind: "level"
            },
            {
              y: 156.95,
              label: "50%",
              kind: "level"
            },
            {
              y: 142.73,
              label: "low curve (bottom 25%)",
              kind: "level"
            }
          ],
          reveal: 23
        }
      },
      {
        title: "Buy demand in the low curve",
        narration: "Price falls into the low curve and builds a fresh demand. This is the buyers' area. This is where he buys.",
        scene: {
          candles: [
            { o: 172, h: 178.79, l: 171.19, c: 178.29 },
            { o: 178.29, h: 186.33, l: 177.48, c: 186 },
            { o: 186, h: 186.45, l: 185.41, c: 185.62 },
            { o: 185.62, h: 186.22, l: 185.4, c: 185.78 },
            { o: 185.78, h: 186.45, l: 185.6, c: 186.01 },
            { o: 186.01, h: 186.76, l: 173.2, c: 174.44 },
            { o: 174.44, h: 174.96, l: 163.12, c: 164.4 },
            { o: 164.4, h: 164.71, l: 155.2, c: 156 },
            { o: 156, h: 156.46, l: 144.47, c: 145.58 },
            { o: 145.58, h: 146.03, l: 135.58, c: 136.64 },
            { o: 136.64, h: 137.7, l: 126.82, c: 128 },
            { o: 128, h: 128.34, l: 127.61, c: 128.07 },
            { o: 128.07, h: 128.47, l: 127.66, c: 128.18 },
            { o: 128.18, h: 128.51, l: 127.72, c: 128.13 },
            { o: 128.13, h: 137.33, l: 126.99, c: 136.75 },
            { o: 136.75, h: 147.04, l: 135.54, c: 145.89 },
            { o: 145.89, h: 155.61, l: 145.32, c: 154.85 },
            { o: 154.85, h: 163.95, l: 154.56, c: 163.57 },
            { o: 163.57, h: 173.35, l: 163.22, c: 172.68 },
            { o: 172.68, h: 172.89, l: 172.31, c: 172.53 },
            { o: 172.53, h: 172.88, l: 172.34, c: 172.72 },
            { o: 172.72, h: 177.58, l: 172.51, c: 177.18 },
            { o: 177.18, h: 177.56, l: 170.25, c: 170.75 },
            { o: 170.75, h: 171.03, l: 163.55, c: 164.14 },
            { o: 164.14, h: 164.74, l: 155.43, c: 155.94 },
            { o: 155.94, h: 156.14, l: 148.66, c: 149.29 },
            { o: 149.29, h: 150.15, l: 139.06, c: 140.23 },
            { o: 140.23, h: 140.55, l: 139.74, c: 140.12 },
            { o: 140.12, h: 140.28, l: 139.77, c: 140.13 },
            { o: 140.13, h: 140.67, l: 139.78, c: 140.28 },
            { o: 140.28, h: 143.93, l: 140.08, c: 143.77 },
            { o: 143.77, h: 147.75, l: 143.48, c: 147.45 },
            { o: 147.45, h: 151.12, l: 147.25, c: 150.73 },
            { o: 150.73, h: 151.07, l: 150.48, c: 150.68 },
            { o: 150.68, h: 151.01, l: 150.48, c: 150.71 },
            { o: 150.71, h: 153.4, l: 150.59, c: 153.15 },
            { o: 153.15, h: 156.51, l: 152.75, c: 156.25 },
            { o: 156.25, h: 159.3, l: 155.97, c: 158.95 },
            { o: 158.95, h: 159.32, l: 158.49, c: 158.71 },
            { o: 158.71, h: 159.14, l: 158.35, c: 158.85 },
            { o: 158.85, h: 163.57, l: 158.49, c: 163.12 },
            { o: 163.12, h: 166.78, l: 162.78, c: 166.51 },
            { o: 166.51, h: 170.57, l: 166.28, c: 170.18 }
          ],
          zones: [
            {
              from: 2,
              top: 186.45,
              bottom: 185.4,
              kind: "supply",
              label: "HTF strong supply"
            },
            {
              from: 11,
              top: 128.51,
              bottom: 127.61,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 19,
              top: 172.89,
              bottom: 172.31,
              kind: "demand",
              label: "high-curve demand: skip",
              to: 22,
              faded: true
            },
            {
              from: 27,
              top: 140.67,
              bottom: 139.74,
              kind: "demand",
              label: "low-curve demand: buy"
            }
          ],
          lines: [
            {
              y: 171.18,
              label: "high curve (top 25%)",
              kind: "level"
            },
            {
              y: 156.95,
              label: "50%",
              kind: "level"
            },
            {
              y: 142.73,
              label: "low curve (bottom 25%)",
              kind: "level"
            },
            {
              y: 140.67,
              label: "buy",
              kind: "entry",
              from: 27
            },
            {
              y: 139.34,
              label: "stop",
              kind: "sl",
              from: 27
            }
          ],
          reveal: 33
        }
      },
      {
        title: "Trail the stop to fresh zones",
        narration: "Each time a new fresh demand forms, move the stop under it. Price may not reach the far target, so the trail locks in pips. If two opposite zones get removed against you, close.",
        scene: {
          candles: [
            { o: 172, h: 178.79, l: 171.19, c: 178.29 },
            { o: 178.29, h: 186.33, l: 177.48, c: 186 },
            { o: 186, h: 186.45, l: 185.41, c: 185.62 },
            { o: 185.62, h: 186.22, l: 185.4, c: 185.78 },
            { o: 185.78, h: 186.45, l: 185.6, c: 186.01 },
            { o: 186.01, h: 186.76, l: 173.2, c: 174.44 },
            { o: 174.44, h: 174.96, l: 163.12, c: 164.4 },
            { o: 164.4, h: 164.71, l: 155.2, c: 156 },
            { o: 156, h: 156.46, l: 144.47, c: 145.58 },
            { o: 145.58, h: 146.03, l: 135.58, c: 136.64 },
            { o: 136.64, h: 137.7, l: 126.82, c: 128 },
            { o: 128, h: 128.34, l: 127.61, c: 128.07 },
            { o: 128.07, h: 128.47, l: 127.66, c: 128.18 },
            { o: 128.18, h: 128.51, l: 127.72, c: 128.13 },
            { o: 128.13, h: 137.33, l: 126.99, c: 136.75 },
            { o: 136.75, h: 147.04, l: 135.54, c: 145.89 },
            { o: 145.89, h: 155.61, l: 145.32, c: 154.85 },
            { o: 154.85, h: 163.95, l: 154.56, c: 163.57 },
            { o: 163.57, h: 173.35, l: 163.22, c: 172.68 },
            { o: 172.68, h: 172.89, l: 172.31, c: 172.53 },
            { o: 172.53, h: 172.88, l: 172.34, c: 172.72 },
            { o: 172.72, h: 177.58, l: 172.51, c: 177.18 },
            { o: 177.18, h: 177.56, l: 170.25, c: 170.75 },
            { o: 170.75, h: 171.03, l: 163.55, c: 164.14 },
            { o: 164.14, h: 164.74, l: 155.43, c: 155.94 },
            { o: 155.94, h: 156.14, l: 148.66, c: 149.29 },
            { o: 149.29, h: 150.15, l: 139.06, c: 140.23 },
            { o: 140.23, h: 140.55, l: 139.74, c: 140.12 },
            { o: 140.12, h: 140.28, l: 139.77, c: 140.13 },
            { o: 140.13, h: 140.67, l: 139.78, c: 140.28 },
            { o: 140.28, h: 143.93, l: 140.08, c: 143.77 },
            { o: 143.77, h: 147.75, l: 143.48, c: 147.45 },
            { o: 147.45, h: 151.12, l: 147.25, c: 150.73 },
            { o: 150.73, h: 151.07, l: 150.48, c: 150.68 },
            { o: 150.68, h: 151.01, l: 150.48, c: 150.71 },
            { o: 150.71, h: 153.4, l: 150.59, c: 153.15 },
            { o: 153.15, h: 156.51, l: 152.75, c: 156.25 },
            { o: 156.25, h: 159.3, l: 155.97, c: 158.95 },
            { o: 158.95, h: 159.32, l: 158.49, c: 158.71 },
            { o: 158.71, h: 159.14, l: 158.35, c: 158.85 },
            { o: 158.85, h: 163.57, l: 158.49, c: 163.12 },
            { o: 163.12, h: 166.78, l: 162.78, c: 166.51 },
            { o: 166.51, h: 170.57, l: 166.28, c: 170.18 }
          ],
          zones: [
            {
              from: 2,
              top: 186.45,
              bottom: 185.4,
              kind: "supply",
              label: "HTF strong supply"
            },
            {
              from: 11,
              top: 128.51,
              bottom: 127.61,
              kind: "demand",
              label: "HTF strong demand"
            },
            {
              from: 19,
              top: 172.89,
              bottom: 172.31,
              kind: "demand",
              label: "high-curve demand: skip",
              to: 22,
              faded: true
            },
            {
              from: 27,
              top: 140.67,
              bottom: 139.74,
              kind: "demand",
              label: "low-curve demand: buy"
            },
            {
              from: 33,
              top: 151.07,
              bottom: 150.48,
              kind: "demand",
              label: "new fresh zone"
            },
            {
              from: 38,
              top: 159.32,
              bottom: 158.35,
              kind: "demand",
              label: "new fresh zone"
            }
          ],
          lines: [
            {
              y: 171.18,
              label: "high curve (top 25%)",
              kind: "level"
            },
            {
              y: 156.95,
              label: "50%",
              kind: "level"
            },
            {
              y: 142.73,
              label: "low curve (bottom 25%)",
              kind: "level"
            },
            {
              y: 140.67,
              label: "buy",
              kind: "entry",
              from: 27
            },
            {
              y: 150.08,
              label: "stop moved",
              kind: "sl",
              from: 35
            },
            {
              y: 157.95,
              label: "stop moved again",
              kind: "sl",
              from: 40
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which zones may you buy?",
        options: [
          "Any demand",
          "Demand in the high curve",
          "Demand in the low curve",
          "Demand right under the HTF supply"
        ],
        answer: 2,
        explain: "The low curve (bottom 0-25%) is for buyers only. Demand near the HTF supply is where sellers sit."
      },
      {
        type: "spot",
        q: "Click the candle that really breaks the trendline.",
        scene: {
          candles: [
            { o: 172, h: 175.5, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.31, l: 167.58, c: 168.08 },
            { o: 168.08, h: 168.29, l: 163.06, c: 163.61 },
            { o: 163.61, h: 164.02, l: 159.51, c: 160 },
            { o: 160, h: 161.87, l: 159.6, c: 161.47 },
            { o: 161.47, h: 163.04, l: 161.1, c: 162.64 },
            { o: 162.64, h: 165.86, l: 162.22, c: 165 },
            { o: 165, h: 165.53, l: 158.55, c: 158.92 },
            { o: 158.92, h: 159.45, l: 154.08, c: 154.39 },
            { o: 154.39, h: 154.94, l: 149.71, c: 150 },
            { o: 150, h: 152.75, l: 149.58, c: 152.14 },
            { o: 152.14, h: 154.11, l: 151.81, c: 153.66 },
            { o: 153.66, h: 157.1, l: 153.22, c: 156.21 },
            { o: 156.21, h: 158.58, l: 155.58, c: 155.78 },
            { o: 155.78, h: 156.06, l: 153.55, c: 154.06 },
            { o: 154.06, h: 154.91, l: 151.07, c: 151.64 },
            { o: 151.64, h: 157.27, l: 151.01, c: 156.71 },
            { o: 156.71, h: 159.04, l: 156.61, c: 158.84 },
            { o: 158.84, h: 161.77, l: 158.75, c: 161.49 },
            { o: 161.49, h: 163.91, l: 161.36, c: 163.71 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 175.5,
              x2: 17,
              y2: 151.29,
              label: "trendline",
              broken: true
            }
          ]
        },
        answer: {
          from: 16,
          to: 16
        },
        explain: "The earlier candle only poked through with a wick and closed back below: a fake signal. This big candle closes above the line, and the next candle starts above it."
      },
      {
        type: "tf",
        q: "A wick through the trendline counts as a break.",
        answer: false,
        explain: "Only a close beyond the line counts. Wait for the close and for the next candle to start."
      },
      {
        type: "order",
        q: "Put the curve map in order.",
        items: [
          "Find the two HTF strong zones above and below",
          "Mark the 50% line",
          "Mark the 25% bands at the top and bottom",
          "Buy only in the low curve, sell only in the high curve"
        ],
        explain: "Zones first, then the middle, then the bands, then the rule for who trades where."
      },
      {
        type: "mcq",
        q: "You are long and a new fresh demand forms under price. What do you do?",
        options: [
          "Nothing",
          "Move the stop under the new zone",
          "Close the trade",
          "Add a big lot"
        ],
        answer: 1,
        explain: "Raja changes his stop to each new fresh zone. Price may turn before the TP."
      },
      {
        type: "tf",
        q: "If price removes two opposite zones against your trade, Raja closes it.",
        answer: true,
        explain: "Two zones removed means the direction has changed against you."
      }
    ],
    practice: [
      {
        prompt: "Price is in the high curve, just under the HTF supply. It is coming back to a small fresh demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 172, h: 179.72, l: 171.64, c: 179.28 },
            { o: 179.28, h: 186.66, l: 178.71, c: 186 },
            { o: 186, h: 186.28, l: 185.15, c: 185.6 },
            { o: 185.6, h: 185.93, l: 185.36, c: 185.61 },
            { o: 185.61, h: 186.47, l: 185.21, c: 186.15 },
            { o: 186.15, h: 187.08, l: 174.1, c: 175.51 },
            { o: 175.51, h: 176.12, l: 164.96, c: 165.87 },
            { o: 165.87, h: 166.83, l: 155.54, c: 156.11 },
            { o: 156.11, h: 157.21, l: 146.76, c: 147.82 },
            { o: 147.82, h: 148.9, l: 138.44, c: 138.98 },
            { o: 138.98, h: 139.88, l: 127.06, c: 128 },
            { o: 128, h: 128.65, l: 127.62, c: 128.26 },
            { o: 128.26, h: 128.68, l: 127.43, c: 127.68 },
            { o: 127.68, h: 128.48, l: 127.42, c: 128.05 },
            { o: 128.05, h: 136.85, l: 126.9, c: 136.48 },
            { o: 136.48, h: 147.71, l: 135.12, c: 146.39 },
            { o: 146.39, h: 155.24, l: 145.68, c: 154.96 },
            { o: 154.96, h: 166.16, l: 153.61, c: 164.91 },
            { o: 164.91, h: 173.02, l: 164.52, c: 172.53 },
            { o: 172.53, h: 172.85, l: 172.33, c: 172.49 },
            { o: 172.49, h: 172.81, l: 172.23, c: 172.66 },
            { o: 172.66, h: 175.44, l: 172.34, c: 175.2 },
            { o: 175.2, h: 178.21, l: 175.09, c: 178.03 },
            { o: 178.03, h: 178.09, l: 176.52, c: 176.62 },
            { o: 176.62, h: 176.73, l: 174.58, c: 174.73 },
            { o: 174.73, h: 174.9, l: 173.13, c: 173.25 },
            { o: 173.25, h: 173.96, l: 167.4, c: 167.66 },
            { o: 167.66, h: 167.93, l: 162.84, c: 163.08 },
            { o: 163.08, h: 163.68, l: 158.35, c: 158.74 },
            { o: 158.74, h: 159.44, l: 152.33, c: 152.92 }
          ],
          zones: [
            {
              from: 2,
              top: 186.47,
              bottom: 185.15,
              kind: "supply",
              label: "HTF supply"
            },
            {
              from: 11,
              top: 128.68,
              bottom: 127.42,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 19,
              top: 172.85,
              bottom: 172.23,
              kind: "demand",
              label: "LTF demand"
            }
          ],
          lines: [
            {
              y: 171.03,
              label: "high curve",
              kind: "level"
            },
            {
              y: 156.92,
              label: "50%",
              kind: "level"
            },
            {
              y: 142.8,
              label: "low curve",
              kind: "level"
            }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The high curve is for sellers only. LTF demand near HTF supply must not be used. Price broke the demand and fell toward the 50% line."
      },
      {
        prompt: "Price is back at a fresh demand inside the low curve. Pick your entry, stop and target.",
        scene: {
          candles: [
            { o: 172, h: 178.39, l: 171.71, c: 178.1 },
            { o: 178.1, h: 186.66, l: 177.33, c: 186 },
            { o: 186, h: 186.47, l: 185.74, c: 186.19 },
            { o: 186.19, h: 186.66, l: 185.63, c: 185.82 },
            { o: 185.82, h: 186.24, l: 185.41, c: 185.92 },
            { o: 185.92, h: 186.89, l: 174.89, c: 175.55 },
            { o: 175.55, h: 176.13, l: 165.36, c: 166.14 },
            { o: 166.14, h: 167.42, l: 155.06, c: 156.18 },
            { o: 156.18, h: 156.62, l: 144.55, c: 145.78 },
            { o: 145.78, h: 146.29, l: 136.44, c: 137.08 },
            { o: 137.08, h: 138, l: 127.59, c: 128 },
            { o: 128, h: 128.61, l: 127.72, c: 128.17 },
            { o: 128.17, h: 128.79, l: 127.86, c: 128.4 },
            { o: 128.4, h: 128.87, l: 127.69, c: 128.09 },
            { o: 128.09, h: 138.09, l: 127.23, c: 137.25 },
            { o: 137.25, h: 144.67, l: 136.69, c: 144.4 },
            { o: 144.4, h: 153.49, l: 143.31, c: 152.79 },
            { o: 152.79, h: 163.78, l: 152.16, c: 163 },
            { o: 163, h: 173.5, l: 161.73, c: 172.78 },
            { o: 172.78, h: 173.37, l: 172.43, c: 173.03 },
            { o: 173.03, h: 173.22, l: 172.64, c: 172.79 },
            { o: 172.79, h: 177.89, l: 172.43, c: 177.28 },
            { o: 177.28, h: 177.74, l: 170.08, c: 170.9 },
            { o: 170.9, h: 171.25, l: 161.78, c: 162.08 },
            { o: 162.08, h: 163, l: 154.76, c: 155.34 },
            { o: 155.34, h: 155.74, l: 148.36, c: 148.85 },
            { o: 148.85, h: 149.6, l: 139.45, c: 140.51 },
            { o: 140.51, h: 140.88, l: 139.91, c: 140.21 },
            { o: 140.21, h: 141.18, l: 139.88, c: 140.85 },
            { o: 140.85, h: 141.08, l: 140.22, c: 140.39 },
            { o: 140.39, h: 143.55, l: 140.13, c: 143.41 },
            { o: 143.41, h: 148.69, l: 143.09, c: 148.19 },
            { o: 148.19, h: 151.34, l: 148.08, c: 151.14 },
            { o: 151.14, h: 151.29, l: 147.37, c: 147.6 },
            { o: 147.6, h: 147.91, l: 144.75, c: 144.88 },
            { o: 144.88, h: 145.31, l: 141.22, c: 141.58 },
            { o: 141.58, h: 143.38, l: 140.66, c: 143.18 },
            { o: 143.18, h: 147.31, l: 142.77, c: 146.81 },
            { o: 146.81, h: 151.15, l: 146.31, c: 150.86 },
            { o: 150.86, h: 155.77, l: 150.28, c: 155.4 },
            { o: 155.4, h: 160.34, l: 155.21, c: 160.14 }
          ],
          zones: [
            {
              from: 2,
              top: 186.66,
              bottom: 185.41,
              kind: "supply",
              label: "HTF supply"
            },
            {
              from: 11,
              top: 128.87,
              bottom: 127.69,
              kind: "demand",
              label: "HTF demand"
            },
            {
              from: 27,
              top: 141.18,
              bottom: 139.88,
              kind: "demand",
              label: "low-curve demand"
            }
          ],
          lines: [
            {
              y: 171.28,
              label: "high curve",
              kind: "level"
            },
            {
              y: 157.14,
              label: "50%",
              kind: "level"
            },
            {
              y: 143.01,
              label: "low curve",
              kind: "level"
            }
          ],
          reveal: 36
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 141.18,
          sl: 139.38,
          tp: 157.14
        },
        explain: "A demand in the low curve is a buyers' area. Buy limit at the top of the zone, stop under it, first target the 50% line. Price bounced and reached the 50% line."
      }
    ],
    cards: [
      {
        front: "High curve?",
        back: "Top 0-25% between two HTF strong zones. Sellers only."
      },
      {
        front: "Low curve?",
        back: "Bottom 0-25% between two HTF strong zones. Buyers only."
      },
      {
        front: "Fib or by hand?",
        back: "By hand. He does not trust indicators."
      },
      {
        front: "When is a trendline crossed?",
        back: "When a candle closes beyond it and the next candle starts."
      },
      {
        front: "A wick through the line is...",
        back: "A fake signal."
      },
      {
        front: "Trailing stop rule?",
        back: "Move the stop to each new fresh zone."
      },
      {
        front: "Target zone is weak?",
        back: "Drop the fixed TP and keep trailing."
      }
    ],
    mnemonic: "Floor buys, roof sells, only closes count."
  },
  {
    mentor: "raja",
    n: 5,
    eli5: {
      oneLiner: "Ride the big fast moves; be careful with the slow ones going back.",
      story: "Think of a kid riding a bike down a hill. Going down is fast and easy: that is the impulse. Pushing the bike back up a bit is slow and tiring: that is the correction. Raja rides the downhill part. And once a zone has sent price to its goal, it is a tired helper and will not hold for long.",
      analogy: "Impulse = rolling downhill with the trendline. Correction = pushing the bike back up against it."
    },
    bigIdeas: [
      "Impulse = with the trendline, big fast candles. Correction = against it, small slow candles and fake signals.",
      "On H4 and below, trade only impulses. Corrections only on monthly, weekly or daily, and not for long.",
      "A zone's purpose is to reach its target. After that, its next test holds 1-2 candles and then breaks."
    ],
    steps: [
      {
        title: "Impulse: with the trendline",
        narration: "Price falls along a descending trendline with big, fast candles. That is the impulse. It is fast and easy to trade.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ],
          highlight: {
            from: 1,
            to: 4,
            label: "impulse"
          },
          reveal: 5
        }
      },
      {
        title: "Correction: against the line",
        narration: "Now price pushes back up with small, slow candles. The market needs buyers' power to do it. This correction is full of fake signals.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ],
          highlight: {
            from: 5,
            to: 9,
            label: "correction"
          },
          reveal: 12
        }
      },
      {
        title: "The 2.5x guide",
        narration: "The next impulse runs about 2.5 times the size of the correction before it. After about 2.5x, price usually starts to correct again.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ],
          zones: [
            {
              from: 10,
              top: 173.84,
              bottom: 173.16,
              kind: "supply",
              label: "supply"
            }
          ],
          highlight: {
            from: 12,
            to: 15,
            label: "impulse"
          },
          notes: [
            {
              x: 6,
              y: 175.76,
              text: "correction ~7.5"
            },
            {
              x: 12,
              y: 151.76,
              text: "impulse ~19.16 (about 2.5x)"
            }
          ],
          reveal: 19
        }
      },
      {
        title: "A strong demand reaches its target",
        narration: "A demand forms and its rally removes the supply, so it is strong. On a daily chart you could buy it, short term. Price reaches its target: the descending trendline. The zone's job is done.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ],
          zones: [
            {
              from: 10,
              top: 173.84,
              bottom: 173.16,
              kind: "supply",
              label: "supply removed",
              to: 22,
              faded: true
            },
            {
              from: 16,
              top: 154.5,
              bottom: 153.57,
              kind: "demand",
              label: "strong demand (counter-trend)"
            }
          ],
          notes: [
            {
              x: 22,
              y: 180.3,
              text: "target reached"
            }
          ],
          reveal: 23
        }
      },
      {
        title: "Job done: one candle, then a break",
        narration: "The impulse comes back down to the demand. It holds for one candle, then breaks. It is now a retested zone that lies against the trend.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ],
          zones: [
            {
              from: 10,
              top: 173.84,
              bottom: 173.16,
              kind: "supply",
              label: "supply removed",
              to: 22,
              faded: true
            },
            {
              from: 16,
              top: 154.5,
              bottom: 153.57,
              kind: "demand",
              label: "job done: breaks",
              to: 28,
              faded: true
            }
          ],
          notes: [
            {
              x: 27,
              y: 151.57,
              text: "holds 1 candle"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "On H4 or lower, which moves should you trade?",
        options: [
          "Only corrections",
          "Only impulses with the trend",
          "Both equally",
          "Neither"
        ],
        answer: 1,
        explain: "Raja says: try to catch impulses. Selling small corrections on low timeframes is how traders lose."
      },
      {
        type: "spot",
        q: "Click the correction candles.",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 192.18, l: 184.1, c: 184.69 },
            { o: 184.69, h: 185.34, l: 179.19, c: 179.78 },
            { o: 179.78, h: 180.16, l: 172.82, c: 173.14 },
            { o: 173.14, h: 173.5, l: 165.39, c: 166 },
            { o: 166, h: 168.81, l: 165.16, c: 168.17 },
            { o: 168.17, h: 169.81, l: 167.94, c: 169.36 },
            { o: 169.36, h: 171.34, l: 168.85, c: 170.88 },
            { o: 170.88, h: 172.3, l: 170.61, c: 172.04 },
            { o: 172.04, h: 173.76, l: 171.72, c: 173.5 },
            { o: 173.5, h: 173.75, l: 173.16, c: 173.5 },
            { o: 173.5, h: 173.84, l: 173.24, c: 173.59 },
            { o: 173.59, h: 174, l: 168.57, c: 169.06 },
            { o: 169.06, h: 169.32, l: 163.71, c: 164.05 },
            { o: 164.05, h: 164.52, l: 157.98, c: 158.21 },
            { o: 158.21, h: 158.73, l: 153.76, c: 154 },
            { o: 154, h: 154.36, l: 153.69, c: 154.13 },
            { o: 154.13, h: 154.5, l: 153.62, c: 153.93 },
            { o: 153.93, h: 154.38, l: 153.57, c: 154.07 },
            { o: 154.07, h: 160.22, l: 153.89, c: 159.87 },
            { o: 159.87, h: 165.61, l: 159.64, c: 165.13 },
            { o: 165.13, h: 172.21, l: 164.88, c: 171.61 },
            { o: 171.61, h: 178.3, l: 171.22, c: 177.3 },
            { o: 177.3, h: 177.91, l: 172.2, c: 172.65 },
            { o: 172.65, h: 172.97, l: 166.42, c: 166.8 },
            { o: 166.8, h: 167.14, l: 161.2, c: 161.55 },
            { o: 161.55, h: 161.88, l: 153.98, c: 154.9 },
            { o: 154.9, h: 155.9, l: 154, c: 155.7 },
            { o: 155.7, h: 155.92, l: 151.95, c: 152.22 },
            { o: 152.22, h: 152.73, l: 148.07, c: 148.51 },
            { o: 148.51, h: 148.92, l: 144.98, c: 145.23 },
            { o: 145.23, h: 145.42, l: 141.4, c: 141.57 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 195,
              x2: 22,
              y2: 178.5,
              label: "descending trendline"
            }
          ]
        },
        answer: {
          from: 5,
          to: 9
        },
        explain: "These small, slow candles move up against the descending trendline. That is the correction."
      },
      {
        type: "tf",
        q: "A strong demand that already reached its target will hold strongly on its next test.",
        answer: false,
        explain: "Once the target is reached, the zone's job is done. Expect one or two candles of respect and then a break."
      },
      {
        type: "mcq",
        q: "An impulse is often about how big compared to the correction before it?",
        options: [
          "The same size",
          "About 2.5x",
          "About 10x",
          "Half"
        ],
        answer: 1,
        explain: "Raja's rough guide is about 2.5x. After that, price usually corrects again."
      },
      {
        type: "tf",
        q: "A demand that removed no supply is weak, so use confirmation only.",
        answer: true,
        explain: "No removal means no strength. Use confirmation or a lower timeframe."
      },
      {
        type: "order",
        q: "Order the life of a counter-trend daily zone.",
        items: [
          "The zone removes the opposite zone (strong)",
          "Price reaches the target",
          "The zone's job is done",
          "On the next test it holds 1-2 candles, then breaks"
        ],
        explain: "A zone exists to reach its target. After that it is tired."
      }
    ],
    practice: [
      {
        prompt: "H4 chart, clear uptrend. Price is pulling back with small candles. Sell the pullback?",
        scene: {
          candles: [
            { o: 120, h: 120.8, l: 117.6, c: 120.4 },
            { o: 120.4, h: 124.46, l: 120.26, c: 124.17 },
            { o: 124.17, h: 129.79, l: 123.64, c: 129.16 },
            { o: 129.16, h: 133.14, l: 128.81, c: 132.99 },
            { o: 132.99, h: 138.45, l: 132.56, c: 138 },
            { o: 138, h: 138.21, l: 137.71, c: 137.92 },
            { o: 137.92, h: 138.2, l: 137.57, c: 138.01 },
            { o: 138.01, h: 141.61, l: 137.7, c: 141.26 },
            { o: 141.26, h: 145.23, l: 140.97, c: 145.07 },
            { o: 145.07, h: 149.2, l: 144.7, c: 148.78 },
            { o: 148.78, h: 152.15, l: 148.54, c: 152 },
            { o: 152, h: 152.45, l: 150.31, c: 150.75 },
            { o: 150.75, h: 151.55, l: 147.77, c: 148.4 },
            { o: 148.4, h: 148.77, l: 145.3, c: 146 },
            { o: 146, h: 146.66, l: 143.67, c: 144.33 },
            { o: 144.33, h: 145.06, l: 140.11, c: 141.21 },
            { o: 141.21, h: 147.65, l: 140.79, c: 146.91 },
            { o: 146.91, h: 154.25, l: 146.31, c: 153.6 },
            { o: 153.6, h: 161.98, l: 152.73, c: 161.33 },
            { o: 161.33, h: 166.36, l: 160.74, c: 166 }
          ],
          zones: [
            {
              from: 5,
              top: 138.21,
              bottom: 137.57,
              kind: "demand",
              label: "demand"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 117.6,
              x2: 13,
              y2: 145.3,
              label: "uptrend line"
            }
          ],
          highlight: {
            from: 11,
            to: 13,
            label: "correction"
          },
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "On H4 and below, catch only impulses. Do not sell a correction in an uptrend. Wait for price to reach the trendline or demand, then buy. Price turned up and the impulse continued."
      },
      {
        prompt: "This strong demand already sent price to its target. Now the with-trend drop is back at the demand. Buy limit?",
        scene: {
          candles: [
            { o: 192, h: 194.4, l: 191.2, c: 191.6 },
            { o: 191.6, h: 191.92, l: 185.36, c: 186.1 },
            { o: 186.1, h: 186.33, l: 178.21, c: 179.13 },
            { o: 179.13, h: 180.06, l: 171.29, c: 172.17 },
            { o: 172.17, h: 172.36, l: 165.45, c: 166 },
            { o: 166, h: 168.91, l: 165.67, c: 168.14 },
            { o: 168.14, h: 169.97, l: 167.78, c: 169.57 },
            { o: 169.57, h: 171.61, l: 169.18, c: 171.23 },
            { o: 171.23, h: 172.07, l: 171.05, c: 171.95 },
            { o: 171.95, h: 174.02, l: 171.46, c: 173.5 },
            { o: 173.5, h: 173.98, l: 173.3, c: 173.66 },
            { o: 173.66, h: 173.88, l: 173.2, c: 173.48 },
            { o: 173.48, h: 173.65, l: 169.3, c: 169.52 },
            { o: 169.52, h: 169.74, l: 164.1, c: 164.65 },
            { o: 164.65, h: 165.29, l: 158.71, c: 159.26 },
            { o: 159.26, h: 159.8, l: 153.29, c: 154 },
            { o: 154, h: 154.43, l: 153.81, c: 154.08 },
            { o: 154.08, h: 154.3, l: 153.5, c: 153.88 },
            { o: 153.88, h: 154.41, l: 153.63, c: 154.15 },
            { o: 154.15, h: 160.63, l: 153.79, c: 160.23 },
            { o: 160.23, h: 165.56, l: 159.68, c: 165.09 },
            { o: 165.09, h: 171.45, l: 164.74, c: 171.07 },
            { o: 171.07, h: 176.53, l: 170.92, c: 176 },
            { o: 176, h: 176.28, l: 169.2, c: 169.98 },
            { o: 169.98, h: 170.35, l: 164.72, c: 164.96 },
            { o: 164.96, h: 165.14, l: 159.5, c: 159.93 },
            { o: 159.93, h: 160.46, l: 154.27, c: 154.83 },
            { o: 154.83, h: 155.83, l: 153.93, c: 155.63 },
            { o: 155.63, h: 155.84, l: 151.07, c: 151.62 },
            { o: 151.62, h: 151.92, l: 148.51, c: 148.71 },
            { o: 148.71, h: 149.05, l: 145.49, c: 145.68 },
            { o: 145.68, h: 146.08, l: 140.98, c: 141.5 }
          ],
          zones: [
            {
              from: 10,
              top: 173.98,
              bottom: 173.2,
              kind: "supply",
              label: "supply removed",
              to: 22,
              faded: true
            },
            {
              from: 16,
              top: 154.43,
              bottom: 153.5,
              kind: "demand",
              label: "demand"
            }
          ],
          reveal: 27
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The zone already did its job, it is now a retest, and it lies against the trend. It gave one candle and then broke. Use confirmation, or wait to sell a fresh supply."
      }
    ],
    cards: [
      {
        front: "Impulse?",
        back: "A move with the trendline: big, fast departure candles."
      },
      {
        front: "Correction?",
        back: "A move against the trendline: small slow candles and fake signals."
      },
      {
        front: "H4 and below?",
        back: "Trade only impulses."
      },
      {
        front: "Where may you trade corrections?",
        back: "Monthly, weekly or daily only, and not long term."
      },
      {
        front: "Zone purpose?",
        back: "To reach its target. After that, its next test holds 1-2 candles and breaks."
      },
      {
        front: "Impulse size guide?",
        back: "About 2.5x the prior correction."
      }
    ],
    mnemonic: "Ride the hill down, not the push up. A zone that hit its goal is tired."
  },
  {
    mentor: "raja",
    n: 6,
    eli5: {
      oneLiner: "Big chart for direction, tiny zone inside it for the entry.",
      story: "If a friend says \"come to my house\", you need more than the country name. You need the city, then the town, then the street, then the house. Raja does the same with zones. The monthly zone is the country and only tells the direction. The small zone hidden inside it is the house, and that is where the stop goes.",
      analogy: "Country > city > town > street > home. The home is the location area."
    },
    bigIdeas: [
      "Use monthly or weekly for direction; enter on a nested lower-timeframe zone inside the HTF zone.",
      "The smallest fresh zone inside the big one is the location area: a small stop and a big reward.",
      "A good trader enters only where momentum (zone made, then revisited) and location meet."
    ],
    steps: [
      {
        title: "Direction from the big chart",
        narration: "A wide monthly supply sent price down hard. It tells us the direction: sell. But a stop above this wide zone would be huge.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            }
          ],
          reveal: 9
        }
      },
      {
        title: "Momentum: price left and comes back",
        narration: "Price made the zone and moved away. Now it is coming back to it. That return is what Raja calls momentum.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            }
          ],
          reveal: 17
        }
      },
      {
        title: "Find the home inside the city",
        narration: "Inside the big zone, price builds a tiny base and drops a little. That small zone, nested inside the monthly one, is the location area.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            },
            {
              from: 17,
              top: 164.05,
              bottom: 163.61,
              kind: "supply",
              label: "H4 zone inside (location)"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Compare the two stops",
        narration: "A stop above the monthly zone is far away. A stop above the nested zone is tiny. Same idea, much less risk. Raja once used a ~50-pip stop instead of ~1000.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            },
            {
              from: 17,
              top: 164.05,
              bottom: 163.61,
              kind: "supply",
              label: "H4 zone inside (location)"
            }
          ],
          lines: [
            {
              y: 163.61,
              label: "sell (location)",
              kind: "entry",
              from: 17
            },
            {
              y: 164.35,
              label: "small stop",
              kind: "sl",
              from: 17
            },
            {
              y: 167.62,
              label: "monthly stop (huge)",
              kind: "sl",
              from: 3
            }
          ],
          reveal: 24
        }
      },
      {
        title: "Momentum + location = a fast move",
        narration: "Price taps the nested zone and falls fast. When momentum and location come together, the moves are large.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            },
            {
              from: 17,
              top: 164.05,
              bottom: 163.61,
              kind: "supply",
              label: "H4 zone inside (location)"
            }
          ],
          lines: [
            {
              y: 163.61,
              label: "sell (location)",
              kind: "entry",
              from: 17
            },
            {
              y: 164.35,
              label: "small stop",
              kind: "sl",
              from: 17
            },
            {
              y: 135,
              label: "TP",
              kind: "tp",
              from: 17
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is the monthly chart used for?",
        options: [
          "Entries",
          "Direction",
          "Lot size",
          "Nothing"
        ],
        answer: 1,
        explain: "Raja checks the high timeframe for the direction and always takes the entry on a low timeframe."
      },
      {
        type: "spot",
        q: "Click the basing candles of the location zone nested inside the monthly supply.",
        scene: {
          candles: [
            { o: 150, h: 155.08, l: 149.58, c: 154.85 },
            { o: 154.85, h: 159.51, l: 154.35, c: 159.27 },
            { o: 159.27, h: 164.53, l: 159.13, c: 164 },
            { o: 164, h: 165.11, l: 163.11, c: 164.2 },
            { o: 164.2, h: 166.95, l: 163.12, c: 165.19 },
            { o: 165.19, h: 167.12, l: 162.49, c: 163.41 },
            { o: 163.41, h: 163.88, l: 158.58, c: 159.01 },
            { o: 159.01, h: 159.39, l: 152.94, c: 153.5 },
            { o: 153.5, h: 153.7, l: 148.41, c: 148.72 },
            { o: 148.72, h: 149.14, l: 142.9, c: 143.28 },
            { o: 143.28, h: 143.63, l: 137.66, c: 138 },
            { o: 138, h: 138.34, l: 137.68, c: 138.19 },
            { o: 138.19, h: 138.46, l: 137.65, c: 137.91 },
            { o: 137.91, h: 144.58, l: 137.68, c: 143.89 },
            { o: 143.89, h: 149.96, l: 143.27, c: 149.25 },
            { o: 149.25, h: 156.77, l: 148.7, c: 155.91 },
            { o: 155.91, h: 164.38, l: 155.4, c: 163.89 },
            { o: 163.89, h: 164.01, l: 163.61, c: 163.73 },
            { o: 163.73, h: 164.05, l: 163.63, c: 163.86 },
            { o: 163.86, h: 164.28, l: 160.17, c: 160.54 },
            { o: 160.54, h: 160.68, l: 157.33, c: 157.61 },
            { o: 157.61, h: 159.91, l: 157.48, c: 159.65 },
            { o: 159.65, h: 161.95, l: 159.53, c: 161.79 },
            { o: 161.79, h: 163.37, l: 161.65, c: 163.31 },
            { o: 163.31, h: 163.83, l: 161.81, c: 162.01 },
            { o: 162.01, h: 162.47, l: 156.51, c: 157.08 },
            { o: 157.08, h: 157.87, l: 150.05, c: 150.89 },
            { o: 150.89, h: 151.77, l: 144.16, c: 144.37 },
            { o: 144.37, h: 145.01, l: 139.4, c: 139.61 },
            { o: 139.61, h: 140.42, l: 132.25, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 167.12,
              bottom: 162.49,
              kind: "supply",
              label: "monthly supply (direction)"
            }
          ],
          reveal: 24
        },
        answer: {
          from: 17,
          to: 18
        },
        explain: "These two tiny candles inside the big zone are the nested zone. It gives a small stop with the same direction."
      },
      {
        type: "order",
        q: "Put the nesting in order, big to small.",
        items: [
          "Monthly zone",
          "Weekly zone inside it",
          "Daily zone inside that",
          "H4 zone inside the daily (location)"
        ],
        explain: "Like country, city, street and home. The smallest valid zone is the location."
      },
      {
        type: "tf",
        q: "Inside the HTF zone you may use a retested daily zone if it is the smallest.",
        answer: false,
        explain: "Only fresh nested zones. In his example the daily had two retested zones and one fresh one, and only the fresh one was used."
      },
      {
        type: "mcq",
        q: "Price never came back to your first zone. What now?",
        options: [
          "Wait for it forever",
          "Chase with a market order",
          "Let it go and use a new fresh zone",
          "Switch to indicators"
        ],
        answer: 2,
        explain: "Let it go. Use any new fresh zone instead."
      }
    ],
    practice: [
      {
        prompt: "Price is back inside the monthly supply and has built a small fresh zone there. Pick your entry, stop and target.",
        scene: {
          candles: [
            { o: 150, h: 154.18, l: 149.55, c: 154.03 },
            { o: 154.03, h: 160.23, l: 153.4, c: 159.67 },
            { o: 159.67, h: 164.27, l: 159.13, c: 164 },
            { o: 164, h: 165.61, l: 162.66, c: 163.49 },
            { o: 163.49, h: 166.45, l: 162.03, c: 165.24 },
            { o: 165.24, h: 166.42, l: 162.32, c: 163.39 },
            { o: 163.39, h: 164.04, l: 156.79, c: 157.57 },
            { o: 157.57, h: 157.83, l: 151.25, c: 151.69 },
            { o: 151.69, h: 152.13, l: 147.12, c: 147.45 },
            { o: 147.45, h: 147.77, l: 142.96, c: 143.37 },
            { o: 143.37, h: 143.64, l: 137.44, c: 138 },
            { o: 138, h: 138.31, l: 137.74, c: 138.03 },
            { o: 138.03, h: 138.34, l: 137.79, c: 138.07 },
            { o: 138.07, h: 146.01, l: 137.18, c: 145.66 },
            { o: 145.66, h: 152.72, l: 145.35, c: 152.32 },
            { o: 152.32, h: 158.28, l: 151.96, c: 157.65 },
            { o: 157.65, h: 163.66, l: 157.25, c: 163.43 },
            { o: 163.43, h: 163.55, l: 163.1, c: 163.27 },
            { o: 163.27, h: 163.6, l: 163.1, c: 163.43 },
            { o: 163.43, h: 163.62, l: 160.54, c: 160.68 },
            { o: 160.68, h: 161.06, l: 156.67, c: 157.1 },
            { o: 157.1, h: 159.13, l: 156.98, c: 159.01 },
            { o: 159.01, h: 160.68, l: 158.96, c: 160.62 },
            { o: 160.62, h: 163.09, l: 160.54, c: 162.8 },
            { o: 162.8, h: 163.35, l: 161.3, c: 161.5 },
            { o: 161.5, h: 161.99, l: 155.11, c: 155.35 },
            { o: 155.35, h: 156.07, l: 149.56, c: 149.86 },
            { o: 149.86, h: 150.49, l: 143.11, c: 143.72 },
            { o: 143.72, h: 144.37, l: 138.29, c: 138.46 },
            { o: 138.46, h: 138.67, l: 132.32, c: 133 }
          ],
          zones: [
            {
              from: 3,
              top: 166.45,
              bottom: 162.03,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 17,
              top: 163.6,
              bottom: 163.1,
              kind: "supply",
              label: "nested zone"
            }
          ],
          reveal: 24
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 163.1,
          sl: 163.9,
          tp: 136
        },
        explain: "Direction from the monthly is down. The nested zone is the location: sell limit at its bottom, stop just above its top, target lower down. Price tapped the zone and dropped. The stop was a small part of the move."
      }
    ],
    cards: [
      {
        front: "HTF chart is for?",
        back: "Direction only."
      },
      {
        front: "Location area?",
        back: "The smallest fresh zone nested inside the HTF zone."
      },
      {
        front: "Why nest zones?",
        back: "Small stop, big reward."
      },
      {
        front: "Raja's momentum?",
        back: "Price made a zone, then came back to it (the waves of the chart)."
      },
      {
        front: "Best entries?",
        back: "Where momentum and location come together."
      },
      {
        front: "The nesting analogy?",
        back: "Country > city > town > street > home."
      }
    ],
    mnemonic: "Map from the sky, door from the street."
  },
  {
    mentor: "raja",
    n: 7,
    eli5: {
      oneLiner: "Only play when you can win about three times what you risk.",
      story: "A game at the fair costs one sticker to play. If the prize is three stickers, it is worth a try. If the prize is one sticker, why play at all? Raja measures the room to the next zone against his stop. He also plays with a tiny bag of stickers until he has won some extra.",
      analogy: "The stop is the price of the ticket. The room to the opposite zone is the prize. Three tickets of prize is good; one is a waste."
    },
    bigIdeas: [
      "Room to the opposite zone: 3x the stop is good, 2x is OK, 1x is a sideways market, so skip.",
      "Take direction from daily or higher only. Follow pips (zone to zone), not money.",
      "Always a small lot. Start at 0.01 and only risk money you have already made."
    ],
    steps: [
      {
        title: "Find the zone and the opposite zone",
        narration: "You have a demand to buy from. Above it sits the nearest opposite zone: a supply. That supply is the end of your room.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 159.59,
              bottom: 158.87,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Measure the stop",
        narration: "Entry at the top of the demand, stop under the bottom. That distance is one unit of risk.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 159.59,
              bottom: 158.87,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 150.63,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.16,
              label: "stop",
              kind: "sl",
              from: 9
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Measure the room",
        narration: "Now measure from the entry up to the supply. Here the room is about 3.34x the stop. Raja wants about 3x.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 159.59,
              bottom: 158.87,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 150.63,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.16,
              label: "stop",
              kind: "sl",
              from: 9
            },
            {
              y: 158.87,
              label: "TP: opposite zone",
              kind: "tp",
              from: 9
            }
          ],
          notes: [
            {
              x: 13,
              y: 154.75,
              text: "room ~3.34x stop"
            }
          ],
          reveal: 21
        }
      },
      {
        title: "3x good, 2x OK, 1x skip",
        narration: "If the supply sat just one stop away, the profit would be no bigger than the risk. He calls that a sideways market and does not trade it.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 159.59,
              bottom: 158.87,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 150.63,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.16,
              label: "stop",
              kind: "sl",
              from: 9
            },
            {
              y: 158.87,
              label: "TP: opposite zone",
              kind: "tp",
              from: 9
            },
            {
              y: 153.1,
              label: "1x (too small)",
              kind: "level",
              from: 9
            }
          ],
          reveal: 21
        }
      },
      {
        title: "Follow the pips",
        narration: "Price runs from zone to zone. Those are the pips to catch. Do not chase a money amount on the 5-minute chart with big lots.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 159.59,
              bottom: 158.87,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 150.63,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.16,
              label: "stop",
              kind: "sl",
              from: 9
            },
            {
              y: 158.87,
              label: "TP: opposite zone",
              kind: "tp",
              from: 9
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The room to the opposite zone is 1x your stop. What does Raja do?",
        options: [
          "Trade with a bigger lot",
          "Skip: it is a sideways market",
          "Trade it on 5 minutes",
          "Move the stop closer"
        ],
        answer: 1,
        explain: "3x is good, 2x can still be traded, 1x cannot. He calls 1x a sideways market."
      },
      {
        type: "tf",
        q: "You may take direction from the H1 chart.",
        answer: false,
        explain: "Direction comes only from monthly, weekly or daily. He says that if you take direction from H1 you are ready to lose money."
      },
      {
        type: "spot",
        q: "Click the basing candles of the zone that is your target.",
        scene: {
          candles: [
            { o: 180, h: 182.11, l: 179.86, c: 181.88 },
            { o: 181.88, h: 184.26, l: 181.65, c: 184 },
            { o: 184, h: 184.25, l: 183.32, c: 183.77 },
            { o: 183.77, h: 184.27, l: 183.55, c: 183.88 },
            { o: 183.88, h: 184.82, l: 175.47, c: 176.23 },
            { o: 176.23, h: 176.68, l: 170.32, c: 170.52 },
            { o: 170.52, h: 170.81, l: 162.51, c: 163.19 },
            { o: 163.19, h: 163.61, l: 155.25, c: 156.19 },
            { o: 156.19, h: 156.74, l: 149.74, c: 150 },
            { o: 150, h: 150.58, l: 148.8, c: 149.18 },
            { o: 149.18, h: 150.55, l: 148.56, c: 149.76 },
            { o: 149.76, h: 150.63, l: 149.06, c: 150.04 },
            { o: 150.04, h: 153.25, l: 149.9, c: 153.02 },
            { o: 153.02, h: 156.64, l: 152.91, c: 156.43 },
            { o: 156.43, h: 159.12, l: 156.28, c: 159.04 },
            { o: 159.04, h: 159.59, l: 158.87, c: 159.29 },
            { o: 159.29, h: 159.56, l: 158.88, c: 159.09 },
            { o: 159.09, h: 159.2, l: 156.47, c: 156.76 },
            { o: 156.76, h: 157.05, l: 154.33, c: 154.5 },
            { o: 154.5, h: 154.66, l: 152.41, c: 152.61 },
            { o: 152.61, h: 152.77, l: 150.89, c: 151.03 },
            { o: 151.03, h: 152.33, l: 149.91, c: 152.13 },
            { o: 152.13, h: 153.79, l: 151.94, c: 153.74 },
            { o: 153.74, h: 155.44, l: 153.57, c: 155.39 },
            { o: 155.39, h: 157.42, l: 155.3, c: 157.18 },
            { o: 157.18, h: 159.32, l: 157.08, c: 159.17 }
          ],
          zones: [
            {
              from: 9,
              top: 150.63,
              bottom: 148.56,
              kind: "demand",
              label: "demand"
            }
          ],
          reveal: 21
        },
        answer: {
          from: 15,
          to: 16
        },
        explain: "The nearest opposite zone above your demand is the target. The room up to it is your profit margin."
      },
      {
        type: "order",
        q: "Order the small-account plan.",
        items: [
          "Start with 0.01 lots",
          "Make a profit cushion (e.g. $50 on $100)",
          "Then 0.02-0.03 lots are fine",
          "Losses now come from profit, not the deposit"
        ],
        explain: "Small lots first. Grow only after the backup money is there."
      },
      {
        type: "mcq",
        q: "\"Follow the pips, not the money\" means...",
        options: [
          "Pick a dollar goal each day",
          "Target the next zone and catch those pips",
          "Use the biggest lot",
          "Trade only gold"
        ],
        answer: 1,
        explain: "When the second zone is removed, the next zone is the target. Those pips are what you follow."
      },
      {
        type: "tf",
        q: "Big lots make you scared and you close trades early.",
        answer: true,
        explain: "Big lots bring fear and aggression: you keep opening MT4 and close early."
      }
    ],
    practice: [
      {
        prompt: "Price is back at a fresh demand. The nearest supply is about 3.38x your stop away. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 180, h: 182.07, l: 179.89, c: 181.91 },
            { o: 181.91, h: 184.29, l: 181.62, c: 184 },
            { o: 184, h: 184.62, l: 183.77, c: 184.24 },
            { o: 184.24, h: 184.62, l: 183.51, c: 183.92 },
            { o: 183.92, h: 184.89, l: 174.62, c: 175.09 },
            { o: 175.09, h: 175.84, l: 168.09, c: 168.86 },
            { o: 168.86, h: 169.32, l: 161.01, c: 161.63 },
            { o: 161.63, h: 161.94, l: 155.87, c: 156.06 },
            { o: 156.06, h: 156.25, l: 149.73, c: 150 },
            { o: 150, h: 150.54, l: 148.64, c: 149.52 },
            { o: 149.52, h: 150.85, l: 149.06, c: 150.4 },
            { o: 150.4, h: 150.85, l: 149.25, c: 149.94 },
            { o: 149.94, h: 153.59, l: 149.52, c: 153.28 },
            { o: 153.28, h: 157.35, l: 153.16, c: 157.2 },
            { o: 157.2, h: 160.37, l: 157.01, c: 160.2 },
            { o: 160.2, h: 160.44, l: 159.68, c: 159.92 },
            { o: 159.92, h: 160.4, l: 159.71, c: 160.2 },
            { o: 160.2, h: 160.46, l: 158.03, c: 158.2 },
            { o: 158.2, h: 158.54, l: 155.69, c: 155.8 },
            { o: 155.8, h: 155.91, l: 153.21, c: 153.51 },
            { o: 153.51, h: 153.58, l: 151.01, c: 151.25 },
            { o: 151.25, h: 152.55, l: 150.08, c: 152.35 },
            { o: 152.35, h: 154.7, l: 152.1, c: 154.46 },
            { o: 154.46, h: 156.84, l: 154.22, c: 156.67 },
            { o: 156.67, h: 158.39, l: 156.59, c: 158.25 },
            { o: 158.25, h: 160.08, l: 158.18, c: 159.98 }
          ],
          zones: [
            {
              from: 9,
              top: 150.85,
              bottom: 148.64,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 160.44,
              bottom: 159.68,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 150.85,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.24,
              label: "stop",
              kind: "sl",
              from: 9
            }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "About 3x room to the opposite zone is a good profit margin. Buy. Price bounced and ran up to the supply."
      },
      {
        prompt: "Price is back at a fresh demand, but the next supply is only about 1.14x your stop away. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 180, h: 182.31, l: 179.73, c: 182.04 },
            { o: 182.04, h: 184.1, l: 181.86, c: 184 },
            { o: 184, h: 184.69, l: 183.74, c: 184.24 },
            { o: 184.24, h: 184.51, l: 183.66, c: 183.99 },
            { o: 183.99, h: 184.43, l: 175.47, c: 176.02 },
            { o: 176.02, h: 176.4, l: 170.43, c: 170.66 },
            { o: 170.66, h: 171.66, l: 161.21, c: 161.92 },
            { o: 161.92, h: 162.82, l: 154.72, c: 155.37 },
            { o: 155.37, h: 156.05, l: 149.28, c: 150 },
            { o: 150, h: 150.68, l: 148.5, c: 149.17 },
            { o: 149.17, h: 151.37, l: 148.51, c: 150.6 },
            { o: 150.6, h: 151.49, l: 149.15, c: 149.78 },
            { o: 149.78, h: 151.69, l: 149.58, c: 151.61 },
            { o: 151.61, h: 153.98, l: 151.33, c: 153.69 },
            { o: 153.69, h: 155.97, l: 153.62, c: 155.88 },
            { o: 155.88, h: 156.15, l: 155.34, c: 155.62 },
            { o: 155.62, h: 156.11, l: 155.34, c: 155.89 },
            { o: 155.89, h: 155.96, l: 154.88, c: 154.92 },
            { o: 154.92, h: 155, l: 153.62, c: 153.77 },
            { o: 153.77, h: 153.85, l: 152.66, c: 152.73 },
            { o: 152.73, h: 152.78, l: 151.78, c: 151.89 },
            { o: 151.89, h: 153.19, l: 150.44, c: 152.99 },
            { o: 152.99, h: 153.19, l: 152.81, c: 152.99 },
            { o: 152.99, h: 153.18, l: 152.61, c: 152.75 },
            { o: 152.75, h: 152.98, l: 152.27, c: 152.48 },
            { o: 152.48, h: 152.58, l: 152.28, c: 152.49 }
          ],
          zones: [
            {
              from: 9,
              top: 151.49,
              bottom: 148.5,
              kind: "demand",
              label: "demand"
            },
            {
              from: 15,
              top: 156.15,
              bottom: 155.34,
              kind: "supply",
              label: "opposite supply"
            }
          ],
          lines: [
            {
              y: 151.49,
              label: "entry",
              kind: "entry",
              from: 9
            },
            {
              y: 148.1,
              label: "stop",
              kind: "sl",
              from: 9
            }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The prize is about the same size as the risk. That is a sideways market in Raja's words. Price just chopped between the two zones. Skip it."
      }
    ],
    cards: [
      {
        front: "Good profit margin?",
        back: "3x the stop. 2x is still OK."
      },
      {
        front: "1x profit margin?",
        back: "Sideways market. No trade."
      },
      {
        front: "Direction timeframe?",
        back: "Daily or higher only."
      },
      {
        front: "Entry timeframe?",
        back: "Any, even 5 minutes, but it must follow the HTF direction."
      },
      {
        front: "Pips or money?",
        back: "Follow the pips: zone to zone."
      },
      {
        front: "Starting lot size?",
        back: "0.01, until a profit cushion is built."
      }
    ],
    mnemonic: "Three to one, or the trade is done (before it starts)."
  },
  {
    mentor: "raja",
    n: 8,
    eli5: {
      oneLiner: "When the daily wanders off, wait for it to come home to the weekly.",
      story: "A puppy runs ahead of its owner on a walk. After a while the leash pulls it back to the owner's side. Then they walk on together. The daily chart is the puppy and the weekly chart is the owner. Raja buys when the puppy comes back to the owner's feet.",
      analogy: "Sequence = owner and puppy walking the same way. Realignment = the puppy coming back to the owner's feet."
    },
    bigIdeas: [
      "Sequence: monthly and weekly agree, so trade fresh daily zones in that direction.",
      "Realignment: after the daily crosses its line and removes two zones, wait for the return to where a weekly and a daily zone sit together.",
      "Never reuse the removed daily zones. Use a realignment area only once."
    ],
    steps: [
      {
        title: "Sequence: the big charts agree",
        narration: "Monthly and weekly both point up. A weekly strong demand sits below, and a daily zone sits right next to it.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 9,
              top: 127.48,
              bottom: 126.71,
              kind: "demand",
              label: "daily zone (realignment area)"
            }
          ],
          reveal: 14
        }
      },
      {
        title: "The daily runs up",
        narration: "The daily rallies along its trendline and leaves more daily demands on the way.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 9,
              top: 127.48,
              bottom: 126.71,
              kind: "demand",
              label: "daily zone (realignment area)"
            },
            {
              from: 14,
              top: 140.48,
              bottom: 139.66,
              kind: "demand",
              label: "daily demand"
            },
            {
              from: 19,
              top: 151.45,
              bottom: 150.63,
              kind: "demand",
              label: "daily demand"
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 124.78,
              x2: 24,
              y2: 154.86,
              label: "daily trendline"
            }
          ],
          reveal: 25
        }
      },
      {
        title: "Line crossed, two zones removed",
        narration: "The daily closes below its trendline and removes two daily demands. Price is now going back to check the higher timeframe.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 9,
              top: 127.48,
              bottom: 126.71,
              kind: "demand",
              label: "daily zone (realignment area)"
            },
            {
              from: 14,
              top: 140.48,
              bottom: 139.66,
              kind: "demand",
              label: "removed",
              to: 29,
              faded: true
            },
            {
              from: 19,
              top: 151.45,
              bottom: 150.63,
              kind: "demand",
              label: "removed",
              to: 27,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 124.78,
              x2: 27,
              y2: 161.3,
              label: "daily trendline",
              broken: true
            }
          ],
          notes: [
            {
              x: 26,
              y: 159.79,
              text: "line crossed"
            }
          ],
          reveal: 30
        }
      },
      {
        title: "Back to the realignment area",
        narration: "The removed daily zones are not used. Price returns to where the daily zone sits next to the weekly strong demand. That meeting point is the realignment area.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 9,
              top: 127.48,
              bottom: 126.71,
              kind: "demand",
              label: "daily zone (realignment area)"
            },
            {
              from: 14,
              top: 140.48,
              bottom: 139.66,
              kind: "demand",
              label: "removed",
              to: 29,
              faded: true
            },
            {
              from: 19,
              top: 151.45,
              bottom: 150.63,
              kind: "demand",
              label: "removed",
              to: 27,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 124.78,
              x2: 27,
              y2: 161.3,
              label: "daily trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 127.48,
              label: "buy",
              kind: "entry",
              from: 9
            },
            {
              y: 126.31,
              label: "stop",
              kind: "sl",
              from: 9
            }
          ],
          reveal: 35
        }
      },
      {
        title: "Price realigns with the big chart",
        narration: "Price bounces from the realignment area and moves with the weekly direction again. After this retest, Raja does not use this area again.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 9,
              top: 127.48,
              bottom: 126.71,
              kind: "demand",
              label: "daily zone (realignment area)"
            },
            {
              from: 14,
              top: 140.48,
              bottom: 139.66,
              kind: "demand",
              label: "removed",
              to: 29,
              faded: true
            },
            {
              from: 19,
              top: 151.45,
              bottom: 150.63,
              kind: "demand",
              label: "removed",
              to: 27,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 124.78,
              x2: 27,
              y2: 161.3,
              label: "daily trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 127.48,
              label: "buy",
              kind: "entry",
              from: 9
            },
            {
              y: 126.31,
              label: "stop",
              kind: "sl",
              from: 9
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is \"sequence\"?",
        options: [
          "Monthly and weekly point the same way, so trade the daily that way",
          "Trading every timeframe in turn",
          "Three candles of one colour",
          "A Fibonacci tool"
        ],
        answer: 0,
        explain: "Monthly down + weekly down = sell the daily with new fresh CP or peak zones. The same for buys."
      },
      {
        type: "spot",
        q: "Click the daily zone in the realignment area.",
        scene: {
          candles: [
            { o: 150, h: 150.23, l: 142.52, c: 143.01 },
            { o: 143.01, h: 143.48, l: 135.02, c: 135.5 },
            { o: 135.5, h: 136.02, l: 129.52, c: 129.87 },
            { o: 129.87, h: 130.21, l: 123.34, c: 124 },
            { o: 124, h: 124.78, l: 123.23, c: 124.15 },
            { o: 124.15, h: 124.64, l: 123.26, c: 124.11 },
            { o: 124.11, h: 124.47, l: 123.27, c: 124.11 },
            { o: 124.11, h: 125.59, l: 124, c: 125.54 },
            { o: 125.54, h: 127.23, l: 125.35, c: 127.18 },
            { o: 127.18, h: 127.32, l: 126.8, c: 126.97 },
            { o: 126.97, h: 127.48, l: 126.71, c: 127.23 },
            { o: 127.23, h: 131.41, l: 126.93, c: 130.99 },
            { o: 130.99, h: 137.16, l: 130.7, c: 136.43 },
            { o: 136.43, h: 140.16, l: 136.07, c: 140 },
            { o: 140, h: 140.48, l: 139.66, c: 140.3 },
            { o: 140.3, h: 140.47, l: 139.75, c: 139.99 },
            { o: 139.99, h: 144.7, l: 139.6, c: 144.21 },
            { o: 144.21, h: 147.78, l: 143.97, c: 147.36 },
            { o: 147.36, h: 151.27, l: 146.94, c: 151 },
            { o: 151, h: 151.45, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.39, l: 150.63, c: 150.89 },
            { o: 150.89, h: 155.07, l: 150.48, c: 154.58 },
            { o: 154.58, h: 158.8, l: 154.45, c: 158.43 },
            { o: 158.43, h: 163.27, l: 158.03, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.36, l: 156.94, c: 157.39 },
            { o: 157.39, h: 157.79, l: 151.24, c: 151.62 },
            { o: 151.62, h: 152.09, l: 146.86, c: 147.05 },
            { o: 147.05, h: 147.22, l: 141.33, c: 141.92 },
            { o: 141.92, h: 142.65, l: 136.21, c: 136.66 },
            { o: 136.66, h: 136.96, l: 136.12, c: 136.42 },
            { o: 136.42, h: 136.81, l: 136.24, c: 136.6 },
            { o: 136.6, h: 136.84, l: 132.95, c: 133.2 },
            { o: 133.2, h: 133.45, l: 129.82, c: 130.16 },
            { o: 130.16, h: 130.3, l: 127.76, c: 127.88 },
            { o: 127.88, h: 129.48, l: 127.17, c: 129.28 },
            { o: 129.28, h: 135.43, l: 128.74, c: 134.69 },
            { o: 134.69, h: 140.89, l: 134.24, c: 140.17 },
            { o: 140.17, h: 147.3, l: 139.56, c: 146.75 },
            { o: 146.75, h: 152.94, l: 146.26, c: 152.32 },
            { o: 152.32, h: 158.47, l: 151.86, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 124.78,
              bottom: 123.23,
              kind: "demand",
              label: "weekly strong demand"
            },
            {
              from: 14,
              top: 140.48,
              bottom: 139.66,
              kind: "demand",
              label: "removed",
              to: 29,
              faded: true
            },
            {
              from: 19,
              top: 151.45,
              bottom: 150.63,
              kind: "demand",
              label: "removed",
              to: 27,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 124.78,
              x2: 27,
              y2: 161.3,
              label: "daily trendline",
              broken: true
            }
          ],
          reveal: 35
        },
        answer: {
          from: 9,
          to: 10
        },
        explain: "This daily zone sits right next to the weekly strong demand. Weekly + daily together is the realignment area."
      },
      {
        type: "tf",
        q: "After the daily removes two zones, you can buy those removed zones on the way back.",
        answer: false,
        explain: "Never reuse the daily zones that were just removed. Go to the weekly + daily area."
      },
      {
        type: "order",
        q: "Order a realignment trade.",
        items: [
          "Monthly and weekly agree (sequence)",
          "Daily crosses its trendline",
          "Daily removes two opposite zones",
          "Price returns to the weekly + daily zone",
          "Enter on the daily zone"
        ],
        explain: "The daily wandered off, broke, and then comes back to realign with the weekly."
      },
      {
        type: "tf",
        q: "A realignment area can be used again and again.",
        answer: false,
        explain: "Once it has been retested, he does not use it again."
      }
    ],
    practice: [
      {
        prompt: "Price already bounced once from this realignment area. Now it is back a second time. Buy?",
        scene: {
          candles: [
            { o: 150, h: 150.75, l: 144.02, c: 144.29 },
            { o: 144.29, h: 144.78, l: 137.41, c: 138.12 },
            { o: 138.12, h: 138.97, l: 130.48, c: 130.94 },
            { o: 130.94, h: 131.22, l: 123.74, c: 124 },
            { o: 124, h: 124.96, l: 123.31, c: 124.32 },
            { o: 124.32, h: 125.15, l: 123.38, c: 124.14 },
            { o: 124.14, h: 124.74, l: 123.63, c: 124.21 },
            { o: 124.21, h: 125.72, l: 124.06, c: 125.61 },
            { o: 125.61, h: 127.74, l: 125.35, c: 127.55 },
            { o: 127.55, h: 127.81, l: 127.06, c: 127.36 },
            { o: 127.36, h: 127.9, l: 127.19, c: 127.66 },
            { o: 127.66, h: 131.25, l: 127.28, c: 130.85 },
            { o: 130.85, h: 135.89, l: 130.42, c: 135.53 },
            { o: 135.53, h: 140.41, l: 134.98, c: 140 },
            { o: 140, h: 140.29, l: 139.41, c: 139.7 },
            { o: 139.7, h: 140.21, l: 139.51, c: 139.94 },
            { o: 139.94, h: 143.67, l: 139.47, c: 143.34 },
            { o: 143.34, h: 147.01, l: 143.14, c: 146.72 },
            { o: 146.72, h: 151.59, l: 146.43, c: 151 },
            { o: 151, h: 151.37, l: 150.45, c: 150.77 },
            { o: 150.77, h: 151.29, l: 150.44, c: 151.04 },
            { o: 151.04, h: 156.63, l: 150.47, c: 156.08 },
            { o: 156.08, h: 159.68, l: 155.61, c: 159.41 },
            { o: 159.41, h: 163.28, l: 159.11, c: 163 },
            { o: 163, h: 165.4, l: 162.4, c: 162.7 },
            { o: 162.7, h: 163.32, l: 156.73, c: 157.02 },
            { o: 157.02, h: 157.54, l: 151.12, c: 151.6 },
            { o: 151.6, h: 151.8, l: 146.41, c: 146.69 },
            { o: 146.69, h: 147.1, l: 141.63, c: 141.88 },
            { o: 141.88, h: 142.41, l: 136.19, c: 136.41 },
            { o: 136.41, h: 136.92, l: 136.03, c: 136.72 },
            { o: 136.72, h: 137.01, l: 136.13, c: 136.32 },
            { o: 136.32, h: 136.42, l: 133.97, c: 134.06 },
            { o: 134.06, h: 134.43, l: 130.35, c: 130.67 },
            { o: 130.67, h: 130.78, l: 128.22, c: 128.3 },
            { o: 128.3, h: 129.9, l: 127.56, c: 129.7 },
            { o: 129.7, h: 136.11, l: 129.22, c: 135.56 },
            { o: 135.56, h: 140.77, l: 135.32, c: 140.46 },
            { o: 140.46, h: 146.26, l: 140.1, c: 146 },
            { o: 146, h: 146.36, l: 139.53, c: 139.79 },
            { o: 139.79, h: 140.36, l: 134.72, c: 134.88 },
            { o: 134.88, h: 135.25, l: 127.71, c: 128.3 },
            { o: 128.3, h: 128.67, l: 125.43, c: 125.61 },
            { o: 125.61, h: 125.73, l: 122.9, c: 123.15 },
            { o: 123.15, h: 123.31, l: 120.55, c: 120.85 },
            { o: 120.85, h: 121.07, l: 118.08, c: 118.31 }
          ],
          zones: [
            {
              from: 4,
              top: 125.15,
              bottom: 123.31,
              kind: "demand",
              label: "weekly demand"
            },
            {
              from: 9,
              top: 127.9,
              bottom: 127.06,
              kind: "demand",
              label: "daily zone"
            },
            {
              from: 14,
              top: 140.29,
              bottom: 139.41,
              kind: "demand",
              label: "removed",
              to: 29,
              faded: true
            },
            {
              from: 19,
              top: 151.37,
              bottom: 150.44,
              kind: "demand",
              label: "removed",
              to: 27,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 10,
              y1: 125.23,
              x2: 27,
              y2: 160.03,
              label: "daily trendline",
              broken: true
            }
          ],
          reveal: 42
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The realignment area was already used. After it is retested once, Raja does not use it again. Price broke through both zones."
      },
      {
        prompt: "Monthly and weekly are both falling. On the daily, a fresh CP supply removed a demand. Price is back at it for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 118, h: 122.39, l: 117.47, c: 122.13 },
            { o: 122.13, h: 126.3, l: 121.89, c: 126.16 },
            { o: 126.16, h: 130.52, l: 125.9, c: 130 },
            { o: 130, h: 130.43, l: 129.74, c: 130.1 },
            { o: 130.1, h: 130.3, l: 129.42, c: 129.69 },
            { o: 129.69, h: 130.04, l: 129.41, c: 129.87 },
            { o: 129.87, h: 138.23, l: 129.45, c: 137.41 },
            { o: 137.41, h: 145.26, l: 137, c: 144.6 },
            { o: 144.6, h: 150.73, l: 144.07, c: 150.05 },
            { o: 150.05, h: 156.65, l: 149.48, c: 156 },
            { o: 156, h: 156.4, l: 152.37, c: 152.6 },
            { o: 152.6, h: 152.74, l: 149.34, c: 149.59 },
            { o: 149.59, h: 149.92, l: 145.53, c: 146 },
            { o: 146, h: 146.41, l: 145.82, c: 146.22 },
            { o: 146.22, h: 146.59, l: 145.63, c: 145.95 },
            { o: 145.95, h: 146.52, l: 145.6, c: 146.13 },
            { o: 146.13, h: 146.76, l: 139.7, c: 140.27 },
            { o: 140.27, h: 140.97, l: 132.32, c: 132.75 },
            { o: 132.75, h: 132.96, l: 127.08, c: 127.34 },
            { o: 127.34, h: 127.93, l: 121.31, c: 122 },
            { o: 122, h: 122.29, l: 121.69, c: 122.04 },
            { o: 122.04, h: 122.33, l: 121.69, c: 122.12 },
            { o: 122.12, h: 128.36, l: 121.66, c: 127.94 },
            { o: 127.94, h: 134.86, l: 127.74, c: 134.14 },
            { o: 134.14, h: 140.8, l: 133.61, c: 140.35 },
            { o: 140.35, h: 145.84, l: 139.82, c: 145.2 },
            { o: 145.2, h: 146.05, l: 143.2, c: 143.4 },
            { o: 143.4, h: 144.12, l: 137.31, c: 137.92 },
            { o: 137.92, h: 138.26, l: 133.85, c: 134.33 },
            { o: 134.33, h: 134.69, l: 128.74, c: 129.16 },
            { o: 129.16, h: 129.76, l: 123.53, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.43,
              bottom: 129.41,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            },
            {
              from: 13,
              top: 146.59,
              bottom: 145.6,
              kind: "supply",
              label: "daily CP supply"
            }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "That is sequence: HTFs agree on down, so sell the fresh daily CP supply. Price dropped from it."
      }
    ],
    cards: [
      {
        front: "Sequence?",
        back: "Monthly and weekly agree; trade fresh daily zones that way."
      },
      {
        front: "Realignment trigger?",
        back: "Daily crosses its trendline and removes two opposite zones."
      },
      {
        front: "Realignment area?",
        back: "Where a weekly strong zone and a daily strong zone sit together."
      },
      {
        front: "Entry in the area?",
        back: "On the daily zone near the weekly zone."
      },
      {
        front: "Reuse the area?",
        back: "No. Once retested, it is done."
      }
    ],
    mnemonic: "Puppy runs, leash pulls, puppy comes home."
  },
  {
    mentor: "raja",
    n: 9,
    eli5: {
      oneLiner: "First find where price is going and how far. Then find the door.",
      story: "Before a trip, you first pick the town you are going to and check how far it is. Only then do you pick which road and which bus stop. Raja does the same. The monthly chart shows the target and the pips left. Then he walks down the timeframes until he finds a fresh, strong door to go through.",
      analogy: "The monthly is the map with the destination. The H4 or H1 zone is the bus stop where you get on."
    },
    bigIdeas: [
      "Monthly first: find the target (the opposite strong zone) and count the pips left.",
      "Step down weekly, daily, H4, H1. Skip zones inside an opposite zone or already touched.",
      "If monthly and weekly disagree, wait for the retracement and for confirmation."
    ],
    steps: [
      {
        title: "Monthly: find the target",
        narration: "The monthly supply points down. The opposite strong zone below is the target. Raja always finds the target first.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            }
          ],
          reveal: 16
        }
      },
      {
        title: "Count the pips left",
        narration: "From the supply down to the target there are about 46 points of room on this chart. Raja counts these pips before anything else. There is room, so it is worth going lower to look for an entry.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            }
          ],
          lines: [
            {
              y: 121.64,
              label: "target",
              kind: "tp",
              from: 3
            }
          ],
          notes: [
            {
              x: 15,
              y: 144.48,
              text: "~46 points left"
            }
          ],
          reveal: 16
        }
      },
      {
        title: "Daily: zone already touched",
        narration: "A daily supply removed a demand, so it was strong, but it has already been touched. Raja says: if the daily already took its entry, stop looking at it and go to H4.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            },
            {
              from: 17,
              top: 152.49,
              bottom: 151.28,
              kind: "demand",
              label: "removed",
              to: 25,
              faded: true
            },
            {
              from: 21,
              top: 160.49,
              bottom: 159.72,
              kind: "supply",
              label: "daily zone (touched)"
            }
          ],
          lines: [
            {
              y: 121.64,
              label: "target",
              kind: "tp",
              from: 3
            }
          ],
          notes: [
            {
              x: 29,
              y: 162.49,
              text: "already touched"
            }
          ],
          reveal: 32
        }
      },
      {
        title: "Go lower: a fresh H4 zone",
        narration: "On H4, price leaves a new fresh supply. That is the one to sell, with a stop just above it.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            },
            {
              from: 17,
              top: 152.49,
              bottom: 151.28,
              kind: "demand",
              label: "removed",
              to: 25,
              faded: true
            },
            {
              from: 21,
              top: 160.49,
              bottom: 159.72,
              kind: "supply",
              label: "daily zone (touched)"
            },
            {
              from: 33,
              top: 145.58,
              bottom: 144.75,
              kind: "supply",
              label: "fresh H4 zone"
            }
          ],
          lines: [
            {
              y: 121.64,
              label: "target",
              kind: "tp",
              from: 3
            },
            {
              y: 144.75,
              label: "sell",
              kind: "entry",
              from: 33
            },
            {
              y: 145.88,
              label: "stop",
              kind: "sl",
              from: 33
            }
          ],
          reveal: 41
        }
      },
      {
        title: "Ride it to the target",
        narration: "Price taps the fresh H4 zone and travels down to the monthly target. Direction from the monthly, entry from the low timeframe.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            },
            {
              from: 17,
              top: 152.49,
              bottom: 151.28,
              kind: "demand",
              label: "removed",
              to: 25,
              faded: true
            },
            {
              from: 21,
              top: 160.49,
              bottom: 159.72,
              kind: "supply",
              label: "daily zone (touched)"
            },
            {
              from: 33,
              top: 145.58,
              bottom: 144.75,
              kind: "supply",
              label: "fresh H4 zone"
            }
          ],
          lines: [
            {
              y: 121.64,
              label: "target",
              kind: "tp",
              from: 3
            },
            {
              y: 144.75,
              label: "sell",
              kind: "entry",
              from: 33
            },
            {
              y: 145.88,
              label: "stop",
              kind: "sl",
              from: 33
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What does Raja do first on the monthly?",
        options: [
          "Take the entry",
          "Find the target and count the pips",
          "Draw a Fibonacci",
          "Look at the news"
        ],
        answer: 1,
        explain: "\"First of all we identify the target and then we can trade.\""
      },
      {
        type: "tf",
        q: "If the daily zone has already been touched, look for a fresh zone on H4 or H1.",
        answer: true,
        explain: "When a timeframe already took its entry, he drops one timeframe lower for a fresh zone."
      },
      {
        type: "spot",
        q: "Click the fresh H4 zone you would sell from.",
        scene: {
          candles: [
            { o: 134, h: 134.35, l: 130.19, c: 130.54 },
            { o: 130.54, h: 130.95, l: 125.21, c: 125.65 },
            { o: 125.65, h: 126, l: 120.4, c: 121 },
            { o: 121, h: 121.48, l: 120.38, c: 120.59 },
            { o: 120.59, h: 121.64, l: 120.18, c: 121.19 },
            { o: 121.19, h: 121.49, l: 120.51, c: 120.94 },
            { o: 120.94, h: 130.12, l: 120.41, c: 129.35 },
            { o: 129.35, h: 137.08, l: 128.68, c: 136.33 },
            { o: 136.33, h: 142.54, l: 135.98, c: 142.18 },
            { o: 142.18, h: 152.04, l: 141.18, c: 150.98 },
            { o: 150.98, h: 160.33, l: 150.57, c: 159.2 },
            { o: 159.2, h: 168.75, l: 158.53, c: 168 },
            { o: 168, h: 168.46, l: 167.45, c: 167.68 },
            { o: 167.68, h: 168.34, l: 167.32, c: 167.9 },
            { o: 167.9, h: 168.68, l: 161.12, c: 161.65 },
            { o: 161.65, h: 162.27, l: 156.36, c: 156.73 },
            { o: 156.73, h: 157.22, l: 151.75, c: 152 },
            { o: 152, h: 152.24, l: 151.28, c: 151.67 },
            { o: 151.67, h: 152.49, l: 151.52, c: 152.1 },
            { o: 152.1, h: 156.37, l: 151.69, c: 156.22 },
            { o: 156.22, h: 160.12, l: 155.86, c: 160 },
            { o: 160, h: 160.16, l: 159.73, c: 160 },
            { o: 160, h: 160.49, l: 159.72, c: 160.14 },
            { o: 160.14, h: 160.41, l: 155.35, c: 155.86 },
            { o: 155.86, h: 156.31, l: 151.03, c: 151.54 },
            { o: 151.54, h: 151.83, l: 147.97, c: 148.28 },
            { o: 148.28, h: 152.06, l: 147.8, c: 151.84 },
            { o: 151.84, h: 155.26, l: 151.64, c: 154.92 },
            { o: 154.92, h: 159.83, l: 154.34, c: 159.42 },
            { o: 159.42, h: 160.11, l: 158.02, c: 158.22 },
            { o: 158.22, h: 158.41, l: 152.72, c: 152.92 },
            { o: 152.92, h: 153.21, l: 149.21, c: 149.56 },
            { o: 149.56, h: 149.78, l: 144.77, c: 145 },
            { o: 145, h: 145.49, l: 144.75, c: 145.26 },
            { o: 145.26, h: 145.58, l: 144.85, c: 145.02 },
            { o: 145.02, h: 145.21, l: 142.54, c: 142.66 },
            { o: 142.66, h: 142.93, l: 140.24, c: 140.37 },
            { o: 140.37, h: 140.49, l: 137.68, c: 138 },
            { o: 138, h: 140.02, l: 137.89, c: 139.95 },
            { o: 139.95, h: 142.19, l: 139.65, c: 142.08 },
            { o: 142.08, h: 144.75, l: 141.94, c: 144.45 },
            { o: 144.45, h: 145.17, l: 142.75, c: 142.95 },
            { o: 142.95, h: 143.4, l: 138.12, c: 138.38 },
            { o: 138.38, h: 138.5, l: 134.6, c: 134.99 },
            { o: 134.99, h: 135.26, l: 130.58, c: 130.86 },
            { o: 130.86, h: 131.16, l: 126.18, c: 126.33 },
            { o: 126.33, h: 126.9, l: 121.75, c: 121.94 }
          ],
          zones: [
            {
              from: 12,
              top: 168.46,
              bottom: 167.32,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.64,
              bottom: 120.18,
              kind: "demand",
              label: "monthly target"
            },
            {
              from: 17,
              top: 152.49,
              bottom: 151.28,
              kind: "demand",
              label: "removed",
              to: 25,
              faded: true
            },
            {
              from: 21,
              top: 160.49,
              bottom: 159.72,
              kind: "supply",
              label: "daily zone (touched)"
            }
          ],
          reveal: 41
        },
        answer: {
          from: 33,
          to: 34
        },
        explain: "The daily zone was already touched. The new small base lower down is fresh, so that is the H4 entry."
      },
      {
        type: "order",
        q: "Order Raja's top-down funnel.",
        items: [
          "Monthly: direction and target",
          "Weekly: room left and a valid zone",
          "Daily: fresh or already touched?",
          "H4 / H1: fresh strong zone for the entry"
        ],
        explain: "Big to small. The monthly gives the goal; the low timeframe gives the door."
      },
      {
        type: "mcq",
        q: "Monthly and weekly disagree. What now?",
        options: [
          "Trade the monthly",
          "Trade the weekly",
          "Wait for the retracement to finish and for confirmation",
          "Flip a coin"
        ],
        answer: 2,
        explain: "Wait for the retracement and a proper daily trendline cross. If the zone was retested, wait for confirmation."
      },
      {
        type: "tf",
        q: "A weekly zone that sits inside an opposite supply is a good zone to use.",
        answer: false,
        explain: "He skips a zone that already sits inside an opposite zone."
      }
    ],
    practice: [
      {
        prompt: "The monthly points down to a target below. The daily zone was already touched, and H4 has made a fresh supply. Pick your entry, stop and target.",
        scene: {
          candles: [
            { o: 134, h: 134.34, l: 128.71, c: 129.2 },
            { o: 129.2, h: 129.58, l: 124.82, c: 125.09 },
            { o: 125.09, h: 125.57, l: 120.52, c: 121 },
            { o: 121, h: 121.77, l: 120.66, c: 121.26 },
            { o: 121.26, h: 121.65, l: 120.66, c: 121 },
            { o: 121, h: 121.33, l: 120.57, c: 120.93 },
            { o: 120.93, h: 130.25, l: 119.77, c: 129.78 },
            { o: 129.78, h: 140.33, l: 128.74, c: 139.31 },
            { o: 139.31, h: 147.29, l: 138.45, c: 146.39 },
            { o: 146.39, h: 153, l: 146.16, c: 152.55 },
            { o: 152.55, h: 159.37, l: 152.32, c: 158.97 },
            { o: 158.97, h: 169.23, l: 158.36, c: 168 },
            { o: 168, h: 168.54, l: 167.53, c: 168.14 },
            { o: 168.14, h: 168.58, l: 167.51, c: 167.94 },
            { o: 167.94, h: 168.58, l: 162.03, c: 162.31 },
            { o: 162.31, h: 163, l: 155.45, c: 156.24 },
            { o: 156.24, h: 156.53, l: 151.84, c: 152 },
            { o: 152, h: 152.43, l: 151.76, c: 152.14 },
            { o: 152.14, h: 152.38, l: 151.58, c: 151.95 },
            { o: 151.95, h: 156.06, l: 151.59, c: 155.74 },
            { o: 155.74, h: 160.29, l: 155.39, c: 160 },
            { o: 160, h: 160.57, l: 159.62, c: 160.23 },
            { o: 160.23, h: 160.56, l: 159.61, c: 159.92 },
            { o: 159.92, h: 160.31, l: 156.74, c: 157.04 },
            { o: 157.04, h: 157.24, l: 151.93, c: 152.3 },
            { o: 152.3, h: 152.76, l: 148.44, c: 148.58 },
            { o: 148.58, h: 152.28, l: 148.22, c: 151.84 },
            { o: 151.84, h: 155.33, l: 151.67, c: 155.11 },
            { o: 155.11, h: 159.47, l: 154.64, c: 159.31 },
            { o: 159.31, h: 160.09, l: 157.91, c: 158.11 },
            { o: 158.11, h: 158.57, l: 153.77, c: 154 },
            { o: 154, h: 154.43, l: 148.96, c: 149.49 },
            { o: 149.49, h: 149.8, l: 144.69, c: 145 },
            { o: 145, h: 145.31, l: 144.77, c: 145.02 },
            { o: 145.02, h: 145.28, l: 144.79, c: 144.94 },
            { o: 144.94, h: 145.08, l: 142.1, c: 142.21 },
            { o: 142.21, h: 142.44, l: 139.54, c: 139.75 },
            { o: 139.75, h: 139.93, l: 137.84, c: 138 },
            { o: 138, h: 140.37, l: 137.79, c: 140.24 },
            { o: 140.24, h: 142.68, l: 140.17, c: 142.43 },
            { o: 142.43, h: 144.69, l: 142.28, c: 144.47 },
            { o: 144.47, h: 145.04, l: 142.77, c: 142.97 },
            { o: 142.97, h: 143.3, l: 139.29, c: 139.5 },
            { o: 139.5, h: 139.94, l: 135, c: 135.33 },
            { o: 135.33, h: 135.62, l: 130.15, c: 130.72 },
            { o: 130.72, h: 131.2, l: 126.31, c: 126.51 },
            { o: 126.51, h: 127.04, l: 121.62, c: 122.07 }
          ],
          zones: [
            {
              from: 12,
              top: 168.58,
              bottom: 167.51,
              kind: "supply",
              label: "monthly supply"
            },
            {
              from: 3,
              top: 121.77,
              bottom: 120.57,
              kind: "demand",
              label: "monthly target"
            },
            {
              from: 17,
              top: 152.43,
              bottom: 151.58,
              kind: "demand",
              label: "removed",
              to: 25,
              faded: true
            },
            {
              from: 21,
              top: 160.57,
              bottom: 159.61,
              kind: "supply",
              label: "daily (touched)"
            },
            {
              from: 33,
              top: 145.31,
              bottom: 144.77,
              kind: "supply",
              label: "fresh H4"
            }
          ],
          reveal: 41
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 144.77,
          sl: 145.61,
          tp: 121.77
        },
        explain: "Sell limit at the bottom of the fresh H4 supply, stop just above it, target at the monthly demand. Price tapped the zone and reached the target."
      }
    ],
    cards: [
      {
        front: "First job on the monthly?",
        back: "Find the target and count the pips left."
      },
      {
        front: "Monthly chart is for?",
        back: "Direction only. Never the entry."
      },
      {
        front: "Daily zone already touched?",
        back: "Go one timeframe lower for a fresh zone."
      },
      {
        front: "Zone inside an opposite zone?",
        back: "Skip it."
      },
      {
        front: "Monthly and weekly disagree?",
        back: "Wait for the retracement and for confirmation."
      },
      {
        front: "Two-zone rule on the weekly?",
        back: "If the weekly removes two opposite zones, price heads for the monthly strong zone."
      }
    ],
    mnemonic: "Target, count, step down, enter."
  },
  {
    mentor: "raja",
    n: 50,
    eli5: {
      oneLiner: "When a zone is knocked out, price rides the empty road to the next one.",
      story: "Picture a road with two gates. A truck smashes through the first gate. Now nothing stops it until the second gate further on. That empty stretch of road is free distance. Raja calls it the wow trade: good pips with nothing in the way.",
      analogy: "The wow trade area is the open road between a smashed gate and the next gate."
    },
    bigIdeas: [
      "Version 1: a zone removes the nearest opposite zone, so price heads to the next zone of that type. The gap is the wow trade area.",
      "Version 2: a big candle closes beyond the LTF trendline, so price can run to the next opposite zone.",
      "Never sell while price sits in a demand (or buy in a supply). First that zone must be removed by a close."
    ],
    steps: [
      {
        title: "Two supplies above",
        narration: "Price fell and left two supplies: #1 higher up and #2 lower down.",
        scene: {
          candles: [
            { o: 170, h: 177.6, l: 169.12, c: 177.03 },
            { o: 177.03, h: 182.44, l: 176.81, c: 182 },
            { o: 182, h: 182.21, l: 181.57, c: 181.86 },
            { o: 181.86, h: 182.29, l: 181.58, c: 181.96 },
            { o: 181.96, h: 182.71, l: 174.6, c: 175.16 },
            { o: 175.16, h: 175.45, l: 169.86, c: 170.44 },
            { o: 170.44, h: 171.2, l: 164.4, c: 164.8 },
            { o: 164.8, h: 165.2, l: 157.55, c: 158 },
            { o: 158, h: 158.27, l: 157.52, c: 157.89 },
            { o: 157.89, h: 158.28, l: 157.49, c: 158.03 },
            { o: 158.03, h: 158.53, l: 152.34, c: 152.88 },
            { o: 152.88, h: 153.06, l: 146.91, c: 147.2 },
            { o: 147.2, h: 147.46, l: 139, c: 140 },
            { o: 140, h: 140.66, l: 139.68, c: 140.27 },
            { o: 140.27, h: 140.44, l: 139.62, c: 139.9 },
            { o: 139.9, h: 140.26, l: 139.52, c: 140.06 },
            { o: 140.06, h: 146.79, l: 139.61, c: 145.99 },
            { o: 145.99, h: 153.14, l: 145.34, c: 152.27 },
            { o: 152.27, h: 157.33, l: 151.76, c: 156.96 },
            { o: 156.96, h: 161.57, l: 156.6, c: 161.28 },
            { o: 161.28, h: 161.46, l: 160.99, c: 161.19 },
            { o: 161.19, h: 161.55, l: 160.8, c: 161.25 },
            { o: 161.25, h: 164.9, l: 160.99, c: 164.47 },
            { o: 164.47, h: 168.59, l: 164.08, c: 168.22 },
            { o: 168.22, h: 172.96, l: 167.86, c: 172.56 },
            { o: 172.56, h: 176.67, l: 172.41, c: 176.54 },
            { o: 176.54, h: 181.84, l: 176.04, c: 181.37 },
            { o: 181.37, h: 181.97, l: 179.37, c: 179.57 },
            { o: 179.57, h: 179.8, l: 177.24, c: 177.46 },
            { o: 177.46, h: 177.64, l: 175.45, c: 175.57 }
          ],
          zones: [
            {
              from: 2,
              top: 182.29,
              bottom: 181.57,
              kind: "supply",
              label: "supply #1"
            },
            {
              from: 8,
              top: 158.28,
              bottom: 157.49,
              kind: "supply",
              label: "supply #2"
            }
          ],
          reveal: 13
        }
      },
      {
        title: "The demand removes supply #2",
        narration: "A demand forms at the bottom and its rally closes above supply #2. A wick would not count; this is a real close.",
        scene: {
          candles: [
            { o: 170, h: 177.6, l: 169.12, c: 177.03 },
            { o: 177.03, h: 182.44, l: 176.81, c: 182 },
            { o: 182, h: 182.21, l: 181.57, c: 181.86 },
            { o: 181.86, h: 182.29, l: 181.58, c: 181.96 },
            { o: 181.96, h: 182.71, l: 174.6, c: 175.16 },
            { o: 175.16, h: 175.45, l: 169.86, c: 170.44 },
            { o: 170.44, h: 171.2, l: 164.4, c: 164.8 },
            { o: 164.8, h: 165.2, l: 157.55, c: 158 },
            { o: 158, h: 158.27, l: 157.52, c: 157.89 },
            { o: 157.89, h: 158.28, l: 157.49, c: 158.03 },
            { o: 158.03, h: 158.53, l: 152.34, c: 152.88 },
            { o: 152.88, h: 153.06, l: 146.91, c: 147.2 },
            { o: 147.2, h: 147.46, l: 139, c: 140 },
            { o: 140, h: 140.66, l: 139.68, c: 140.27 },
            { o: 140.27, h: 140.44, l: 139.62, c: 139.9 },
            { o: 139.9, h: 140.26, l: 139.52, c: 140.06 },
            { o: 140.06, h: 146.79, l: 139.61, c: 145.99 },
            { o: 145.99, h: 153.14, l: 145.34, c: 152.27 },
            { o: 152.27, h: 157.33, l: 151.76, c: 156.96 },
            { o: 156.96, h: 161.57, l: 156.6, c: 161.28 },
            { o: 161.28, h: 161.46, l: 160.99, c: 161.19 },
            { o: 161.19, h: 161.55, l: 160.8, c: 161.25 },
            { o: 161.25, h: 164.9, l: 160.99, c: 164.47 },
            { o: 164.47, h: 168.59, l: 164.08, c: 168.22 },
            { o: 168.22, h: 172.96, l: 167.86, c: 172.56 },
            { o: 172.56, h: 176.67, l: 172.41, c: 176.54 },
            { o: 176.54, h: 181.84, l: 176.04, c: 181.37 },
            { o: 181.37, h: 181.97, l: 179.37, c: 179.57 },
            { o: 179.57, h: 179.8, l: 177.24, c: 177.46 },
            { o: 177.46, h: 177.64, l: 175.45, c: 175.57 }
          ],
          zones: [
            {
              from: 2,
              top: 182.29,
              bottom: 181.57,
              kind: "supply",
              label: "supply #1"
            },
            {
              from: 8,
              top: 158.28,
              bottom: 157.49,
              kind: "supply",
              label: "#2 removed",
              to: 19,
              faded: true
            },
            {
              from: 13,
              top: 140.66,
              bottom: 139.52,
              kind: "demand",
              label: "demand"
            }
          ],
          notes: [
            {
              x: 19,
              y: 163.07,
              text: "close above = removed"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "The wow trade area",
        narration: "Supply #2 is gone, so the next target is supply #1. The open room between them is the wow trade area, also called the extension of pips. TP at the bottom of supply #1.",
        scene: {
          candles: [
            { o: 170, h: 177.6, l: 169.12, c: 177.03 },
            { o: 177.03, h: 182.44, l: 176.81, c: 182 },
            { o: 182, h: 182.21, l: 181.57, c: 181.86 },
            { o: 181.86, h: 182.29, l: 181.58, c: 181.96 },
            { o: 181.96, h: 182.71, l: 174.6, c: 175.16 },
            { o: 175.16, h: 175.45, l: 169.86, c: 170.44 },
            { o: 170.44, h: 171.2, l: 164.4, c: 164.8 },
            { o: 164.8, h: 165.2, l: 157.55, c: 158 },
            { o: 158, h: 158.27, l: 157.52, c: 157.89 },
            { o: 157.89, h: 158.28, l: 157.49, c: 158.03 },
            { o: 158.03, h: 158.53, l: 152.34, c: 152.88 },
            { o: 152.88, h: 153.06, l: 146.91, c: 147.2 },
            { o: 147.2, h: 147.46, l: 139, c: 140 },
            { o: 140, h: 140.66, l: 139.68, c: 140.27 },
            { o: 140.27, h: 140.44, l: 139.62, c: 139.9 },
            { o: 139.9, h: 140.26, l: 139.52, c: 140.06 },
            { o: 140.06, h: 146.79, l: 139.61, c: 145.99 },
            { o: 145.99, h: 153.14, l: 145.34, c: 152.27 },
            { o: 152.27, h: 157.33, l: 151.76, c: 156.96 },
            { o: 156.96, h: 161.57, l: 156.6, c: 161.28 },
            { o: 161.28, h: 161.46, l: 160.99, c: 161.19 },
            { o: 161.19, h: 161.55, l: 160.8, c: 161.25 },
            { o: 161.25, h: 164.9, l: 160.99, c: 164.47 },
            { o: 164.47, h: 168.59, l: 164.08, c: 168.22 },
            { o: 168.22, h: 172.96, l: 167.86, c: 172.56 },
            { o: 172.56, h: 176.67, l: 172.41, c: 176.54 },
            { o: 176.54, h: 181.84, l: 176.04, c: 181.37 },
            { o: 181.37, h: 181.97, l: 179.37, c: 179.57 },
            { o: 179.57, h: 179.8, l: 177.24, c: 177.46 },
            { o: 177.46, h: 177.64, l: 175.45, c: 175.57 }
          ],
          zones: [
            {
              from: 2,
              top: 182.29,
              bottom: 181.57,
              kind: "supply",
              label: "supply #1"
            },
            {
              from: 8,
              top: 158.28,
              bottom: 157.49,
              kind: "supply",
              label: "#2 removed",
              to: 19,
              faded: true
            },
            {
              from: 13,
              top: 140.66,
              bottom: 139.52,
              kind: "demand",
              label: "demand"
            }
          ],
          lines: [
            {
              y: 181.57,
              label: "TP: supply #1",
              kind: "tp",
              from: 19
            }
          ],
          notes: [
            {
              x: 20,
              y: 169.93,
              text: "wow trade area"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "Trade it on a lower timeframe",
        narration: "Use the high timeframe to find these pips and take the entry on a lower timeframe. Price may retest first or go straight there. Here it travels up to supply #1.",
        scene: {
          candles: [
            { o: 170, h: 177.6, l: 169.12, c: 177.03 },
            { o: 177.03, h: 182.44, l: 176.81, c: 182 },
            { o: 182, h: 182.21, l: 181.57, c: 181.86 },
            { o: 181.86, h: 182.29, l: 181.58, c: 181.96 },
            { o: 181.96, h: 182.71, l: 174.6, c: 175.16 },
            { o: 175.16, h: 175.45, l: 169.86, c: 170.44 },
            { o: 170.44, h: 171.2, l: 164.4, c: 164.8 },
            { o: 164.8, h: 165.2, l: 157.55, c: 158 },
            { o: 158, h: 158.27, l: 157.52, c: 157.89 },
            { o: 157.89, h: 158.28, l: 157.49, c: 158.03 },
            { o: 158.03, h: 158.53, l: 152.34, c: 152.88 },
            { o: 152.88, h: 153.06, l: 146.91, c: 147.2 },
            { o: 147.2, h: 147.46, l: 139, c: 140 },
            { o: 140, h: 140.66, l: 139.68, c: 140.27 },
            { o: 140.27, h: 140.44, l: 139.62, c: 139.9 },
            { o: 139.9, h: 140.26, l: 139.52, c: 140.06 },
            { o: 140.06, h: 146.79, l: 139.61, c: 145.99 },
            { o: 145.99, h: 153.14, l: 145.34, c: 152.27 },
            { o: 152.27, h: 157.33, l: 151.76, c: 156.96 },
            { o: 156.96, h: 161.57, l: 156.6, c: 161.28 },
            { o: 161.28, h: 161.46, l: 160.99, c: 161.19 },
            { o: 161.19, h: 161.55, l: 160.8, c: 161.25 },
            { o: 161.25, h: 164.9, l: 160.99, c: 164.47 },
            { o: 164.47, h: 168.59, l: 164.08, c: 168.22 },
            { o: 168.22, h: 172.96, l: 167.86, c: 172.56 },
            { o: 172.56, h: 176.67, l: 172.41, c: 176.54 },
            { o: 176.54, h: 181.84, l: 176.04, c: 181.37 },
            { o: 181.37, h: 181.97, l: 179.37, c: 179.57 },
            { o: 179.57, h: 179.8, l: 177.24, c: 177.46 },
            { o: 177.46, h: 177.64, l: 175.45, c: 175.57 }
          ],
          zones: [
            {
              from: 2,
              top: 182.29,
              bottom: 181.57,
              kind: "supply",
              label: "supply #1"
            },
            {
              from: 8,
              top: 158.28,
              bottom: 157.49,
              kind: "supply",
              label: "#2 removed",
              to: 19,
              faded: true
            },
            {
              from: 13,
              top: 140.66,
              bottom: 139.52,
              kind: "demand",
              label: "demand"
            }
          ],
          lines: [
            {
              y: 181.57,
              label: "TP: supply #1",
              kind: "tp",
              from: 19
            }
          ],
          highlight: {
            from: 19,
            to: 26,
            label: "wow trade"
          }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A demand's rally removes supply #2. Where is the next target?",
        options: [
          "The demand itself",
          "Supply #1, the next supply above",
          "The trendline",
          "Nowhere"
        ],
        answer: 1,
        explain: "Once the market removes a supply, the next supply of that type is the target. The room between is the wow trade area."
      },
      {
        type: "spot",
        q: "Click the candle that removed supply #2.",
        scene: {
          candles: [
            { o: 170, h: 177.6, l: 169.12, c: 177.03 },
            { o: 177.03, h: 182.44, l: 176.81, c: 182 },
            { o: 182, h: 182.21, l: 181.57, c: 181.86 },
            { o: 181.86, h: 182.29, l: 181.58, c: 181.96 },
            { o: 181.96, h: 182.71, l: 174.6, c: 175.16 },
            { o: 175.16, h: 175.45, l: 169.86, c: 170.44 },
            { o: 170.44, h: 171.2, l: 164.4, c: 164.8 },
            { o: 164.8, h: 165.2, l: 157.55, c: 158 },
            { o: 158, h: 158.27, l: 157.52, c: 157.89 },
            { o: 157.89, h: 158.28, l: 157.49, c: 158.03 },
            { o: 158.03, h: 158.53, l: 152.34, c: 152.88 },
            { o: 152.88, h: 153.06, l: 146.91, c: 147.2 },
            { o: 147.2, h: 147.46, l: 139, c: 140 },
            { o: 140, h: 140.66, l: 139.68, c: 140.27 },
            { o: 140.27, h: 140.44, l: 139.62, c: 139.9 },
            { o: 139.9, h: 140.26, l: 139.52, c: 140.06 },
            { o: 140.06, h: 146.79, l: 139.61, c: 145.99 },
            { o: 145.99, h: 153.14, l: 145.34, c: 152.27 },
            { o: 152.27, h: 157.33, l: 151.76, c: 156.96 },
            { o: 156.96, h: 161.57, l: 156.6, c: 161.28 },
            { o: 161.28, h: 161.46, l: 160.99, c: 161.19 },
            { o: 161.19, h: 161.55, l: 160.8, c: 161.25 },
            { o: 161.25, h: 164.9, l: 160.99, c: 164.47 },
            { o: 164.47, h: 168.59, l: 164.08, c: 168.22 },
            { o: 168.22, h: 172.96, l: 167.86, c: 172.56 },
            { o: 172.56, h: 176.67, l: 172.41, c: 176.54 },
            { o: 176.54, h: 181.84, l: 176.04, c: 181.37 },
            { o: 181.37, h: 181.97, l: 179.37, c: 179.57 },
            { o: 179.57, h: 179.8, l: 177.24, c: 177.46 },
            { o: 177.46, h: 177.64, l: 175.45, c: 175.57 }
          ],
          zones: [
            {
              from: 2,
              top: 182.29,
              bottom: 181.57,
              kind: "supply",
              label: "supply #1"
            },
            {
              from: 8,
              top: 158.28,
              bottom: 157.49,
              kind: "supply",
              label: "supply #2"
            },
            {
              from: 13,
              top: 140.66,
              bottom: 139.52,
              kind: "demand",
              label: "demand"
            }
          ]
        },
        answer: {
          from: 19,
          to: 19
        },
        explain: "This is the first candle that closes above supply #2. From here the road to supply #1 is open."
      },
      {
        type: "tf",
        q: "A wick through a zone on a quiet Friday counts as a removal.",
        answer: false,
        explain: "Only a candle close beyond the zone counts. Wicks that hit stops and come back are fake signals, often on low-volume Fridays."
      },
      {
        type: "tf",
        q: "The trendline is crossed but price sits inside a demand. You should sell right away.",
        answer: false,
        explain: "Wait until that demand is removed by a close. Then sell on the lower timeframe without hesitation."
      },
      {
        type: "order",
        q: "Order a two-part wow trade.",
        items: [
          "Big candle closes below the LTF trendline",
          "Part 1: price runs to demand #1",
          "Demand #1 is removed by a close",
          "Part 2: price runs to demand #2"
        ],
        explain: "Part 2 starts only after the zone at the end of part 1 is removed."
      },
      {
        type: "mcq",
        q: "There are only about 100 pips to the next resistance. What does Raja say?",
        options: [
          "Great trade",
          "Not worth it: pick a pair with good pips",
          "Use a bigger lot",
          "Trade it on the monthly"
        ],
        answer: 1,
        explain: "Measure the pips in the wow trade area. Small room means skip and choose pairs with good pips."
      }
    ],
    practice: [
      {
        prompt: "A big candle just closed below the rising trendline. The nearest demand is far below. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 120.6, l: 116.8, c: 120.2 },
            { o: 120.2, h: 124.41, l: 120.08, c: 124.06 },
            { o: 124.06, h: 127.54, l: 123.63, c: 127.16 },
            { o: 127.16, h: 130.38, l: 126.87, c: 130 },
            { o: 130, h: 130.36, l: 129.77, c: 129.97 },
            { o: 129.97, h: 130.45, l: 129.63, c: 130.14 },
            { o: 130.14, h: 134.59, l: 129.73, c: 134.16 },
            { o: 134.16, h: 137.74, l: 133.86, c: 137.37 },
            { o: 137.37, h: 142.24, l: 136.8, c: 142 },
            { o: 142, h: 142.17, l: 141.72, c: 141.98 },
            { o: 141.98, h: 142.33, l: 141.57, c: 141.87 },
            { o: 141.87, h: 146.38, l: 141.37, c: 146.07 },
            { o: 146.07, h: 152.55, l: 145.52, c: 152.33 },
            { o: 152.33, h: 157.54, l: 151.82, c: 157.32 },
            { o: 157.32, h: 162.26, l: 156.7, c: 162 },
            { o: 162, h: 162.36, l: 161.69, c: 162.07 },
            { o: 162.07, h: 162.37, l: 161.64, c: 161.96 },
            { o: 161.96, h: 162.95, l: 148.9, c: 149.93 },
            { o: 149.93, h: 150.35, l: 148.2, c: 148.59 },
            { o: 148.59, h: 148.86, l: 148.4, c: 148.65 },
            { o: 148.65, h: 149.1, l: 147.02, c: 147.46 },
            { o: 147.46, h: 147.64, l: 145.92, c: 146.33 },
            { o: 146.33, h: 146.54, l: 144.6, c: 144.68 },
            { o: 144.68, h: 144.88, l: 142.56, c: 142.63 },
            { o: 142.63, h: 143.73, l: 141.93, c: 143.53 }
          ],
          zones: [
            {
              from: 4,
              top: 130.45,
              bottom: 129.63,
              kind: "demand",
              label: "demand #2"
            },
            {
              from: 9,
              top: 142.33,
              bottom: 141.57,
              kind: "demand",
              label: "demand #1"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116.8,
              x2: 18,
              y2: 155.59,
              label: "LTF trendline",
              broken: true
            }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "A proper cross (a full-bodied close beyond the line) and no zone in the way: that is a wow trade. Sell on the lower timeframe toward demand #1. Price had some ups and downs but travelled down to it."
      },
      {
        prompt: "A big candle just closed below the rising trendline, but price is now sitting inside demand #1. Sell now?",
        scene: {
          candles: [
            { o: 120, h: 120.6, l: 116.8, c: 120.2 },
            { o: 120.2, h: 124.29, l: 119.78, c: 124.06 },
            { o: 124.06, h: 126.99, l: 123.86, c: 126.67 },
            { o: 126.67, h: 130.37, l: 126.37, c: 130 },
            { o: 130, h: 130.56, l: 129.74, c: 130.26 },
            { o: 130.26, h: 130.44, l: 129.94, c: 130.14 },
            { o: 130.14, h: 134.61, l: 129.86, c: 134.12 },
            { o: 134.12, h: 138.33, l: 133.59, c: 137.96 },
            { o: 137.96, h: 142.48, l: 137.45, c: 142 },
            { o: 142, h: 142.4, l: 141.81, c: 142 },
            { o: 142, h: 142.52, l: 141.81, c: 142.14 },
            { o: 142.14, h: 144.56, l: 141.92, c: 144.3 },
            { o: 144.3, h: 146.69, l: 144.18, c: 146.52 },
            { o: 146.52, h: 146.82, l: 141.64, c: 142.22 },
            { o: 142.22, h: 143.32, l: 142.01, c: 143.12 },
            { o: 143.12, h: 147.73, l: 142.56, c: 147.44 },
            { o: 147.44, h: 150.77, l: 147.22, c: 150.59 },
            { o: 150.59, h: 153.59, l: 150.4, c: 153.45 },
            { o: 153.45, h: 158.55, l: 152.9, c: 158 }
          ],
          zones: [
            {
              from: 4,
              top: 130.56,
              bottom: 129.74,
              kind: "demand",
              label: "demand #2"
            },
            {
              from: 9,
              top: 142.52,
              bottom: 141.81,
              kind: "demand",
              label: "demand #1"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116.8,
              x2: 14,
              y2: 147.27,
              label: "LTF trendline",
              broken: true
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Never sell while price still sits in a demand. When a zone is near the line, the zone matters more than the line. The demand held and price went back up."
      }
    ],
    cards: [
      {
        front: "Wow trade?",
        back: "The open run of pips from a removed zone to the next zone."
      },
      {
        front: "Another name for it?",
        back: "The extension of pips."
      },
      {
        front: "Version 2 trigger?",
        back: "A big full-bodied candle closing beyond the LTF trendline."
      },
      {
        front: "When is a zone removed?",
        back: "When a candle closes beyond it. Wicks do not count."
      },
      {
        front: "Line crossed but price in a demand?",
        back: "Do not sell yet. Wait for the demand to be removed."
      },
      {
        front: "Zone near the trendline?",
        back: "The zone has priority over the line."
      },
      {
        front: "Part 2 of a wow trade starts when?",
        back: "Only after the zone at the end of part 1 is removed."
      }
    ],
    mnemonic: "Gate smashed, road open, ride to the next gate."
  },
  {
    mentor: "raja",
    n: 51,
    eli5: {
      oneLiner: "Only three kinds of fresh zone earn a pending order. Everything else is weak.",
      story: "At a school race, many kids say they are fast. The teacher only believes the ones who actually beat someone. One kid beat a rival: strong. One kid beat a rival and also jumped the fence on the way: that is the arrival kid, the best of all. A kid who only jumped the fence but beat nobody is just showing off.",
      analogy: "Strong = beat a rival. Arrival = jumped the fence AND beat a rival. Only jumped the fence = inheritance (weak)."
    },
    bigIdeas: [
      "Pending orders only on three strong types: simple strong zone, wow trade zone and arrival zone.",
      "Arrival = crossed the trendline AND removed the opposite zone. Only crossed the line = inheritance zone, weak.",
      "First touch of a strong zone = set and forget. Trade with the trendline to hold; corrections are short-term."
    ],
    steps: [
      {
        title: "A downtrend making supplies",
        narration: "Price falls along a descending trendline and leaves supplies on the way down.",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.22, l: 180.4, c: 180.88 },
            { o: 180.88, h: 181.56, l: 175.41, c: 175.6 },
            { o: 175.6, h: 175.83, l: 170.69, c: 171 },
            { o: 171, h: 171.33, l: 170.67, c: 171.11 },
            { o: 171.11, h: 171.47, l: 170.65, c: 171.02 },
            { o: 171.02, h: 171.4, l: 166.23, c: 166.57 },
            { o: 166.57, h: 166.97, l: 161.8, c: 162.33 },
            { o: 162.33, h: 162.56, l: 157.64, c: 158 },
            { o: 158, h: 158.37, l: 157.75, c: 157.95 },
            { o: 157.95, h: 158.49, l: 157.75, c: 158.14 },
            { o: 158.14, h: 158.83, l: 152.41, c: 152.77 },
            { o: 152.77, h: 153.69, l: 144.37, c: 144.99 },
            { o: 144.99, h: 145.67, l: 139.48, c: 140 },
            { o: 140, h: 140.53, l: 139.81, c: 140.19 },
            { o: 140.19, h: 140.42, l: 139.89, c: 140.13 },
            { o: 140.13, h: 140.41, l: 139.77, c: 140 },
            { o: 140, h: 147.09, l: 139.07, c: 146.68 },
            { o: 146.68, h: 153.32, l: 146.18, c: 153 },
            { o: 153, h: 159.13, l: 152.79, c: 158.77 },
            { o: 158.77, h: 163.66, l: 158.18, c: 163.49 },
            { o: 163.49, h: 163.72, l: 156.84, c: 157.53 },
            { o: 157.53, h: 158.16, l: 151.49, c: 152.04 },
            { o: 152.04, h: 152.53, l: 146.14, c: 146.68 },
            { o: 146.68, h: 146.87, l: 140.43, c: 140.93 },
            { o: 140.93, h: 142.93, l: 140.23, c: 142.73 },
            { o: 142.73, h: 150.86, l: 142.25, c: 150.06 },
            { o: 150.06, h: 158.11, l: 149.57, c: 157.29 },
            { o: 157.29, h: 165.06, l: 156.8, c: 164.28 },
            { o: 164.28, h: 170.72, l: 164.1, c: 170.15 }
          ],
          zones: [
            {
              from: 4,
              top: 171.47,
              bottom: 170.65,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.49,
              bottom: 157.75,
              kind: "supply",
              label: "last supply"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 16,
              y2: 144.66,
              label: "descending trendline"
            }
          ],
          reveal: 14
        }
      },
      {
        title: "A demand forms at the bottom",
        narration: "Price pauses at the low and builds a demand. Is it strong or weak? Its leg-out will tell us.",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.22, l: 180.4, c: 180.88 },
            { o: 180.88, h: 181.56, l: 175.41, c: 175.6 },
            { o: 175.6, h: 175.83, l: 170.69, c: 171 },
            { o: 171, h: 171.33, l: 170.67, c: 171.11 },
            { o: 171.11, h: 171.47, l: 170.65, c: 171.02 },
            { o: 171.02, h: 171.4, l: 166.23, c: 166.57 },
            { o: 166.57, h: 166.97, l: 161.8, c: 162.33 },
            { o: 162.33, h: 162.56, l: 157.64, c: 158 },
            { o: 158, h: 158.37, l: 157.75, c: 157.95 },
            { o: 157.95, h: 158.49, l: 157.75, c: 158.14 },
            { o: 158.14, h: 158.83, l: 152.41, c: 152.77 },
            { o: 152.77, h: 153.69, l: 144.37, c: 144.99 },
            { o: 144.99, h: 145.67, l: 139.48, c: 140 },
            { o: 140, h: 140.53, l: 139.81, c: 140.19 },
            { o: 140.19, h: 140.42, l: 139.89, c: 140.13 },
            { o: 140.13, h: 140.41, l: 139.77, c: 140 },
            { o: 140, h: 147.09, l: 139.07, c: 146.68 },
            { o: 146.68, h: 153.32, l: 146.18, c: 153 },
            { o: 153, h: 159.13, l: 152.79, c: 158.77 },
            { o: 158.77, h: 163.66, l: 158.18, c: 163.49 },
            { o: 163.49, h: 163.72, l: 156.84, c: 157.53 },
            { o: 157.53, h: 158.16, l: 151.49, c: 152.04 },
            { o: 152.04, h: 152.53, l: 146.14, c: 146.68 },
            { o: 146.68, h: 146.87, l: 140.43, c: 140.93 },
            { o: 140.93, h: 142.93, l: 140.23, c: 142.73 },
            { o: 142.73, h: 150.86, l: 142.25, c: 150.06 },
            { o: 150.06, h: 158.11, l: 149.57, c: 157.29 },
            { o: 157.29, h: 165.06, l: 156.8, c: 164.28 },
            { o: 164.28, h: 170.72, l: 164.1, c: 170.15 }
          ],
          zones: [
            {
              from: 4,
              top: 171.47,
              bottom: 170.65,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.49,
              bottom: 157.75,
              kind: "supply",
              label: "last supply"
            },
            {
              from: 14,
              top: 140.53,
              bottom: 139.77,
              kind: "demand",
              label: "arrival zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 16,
              y2: 144.66,
              label: "descending trendline"
            }
          ],
          highlight: {
            from: 14,
            to: 16,
            label: "base"
          },
          reveal: 17
        }
      },
      {
        title: "Rule 1: it crosses the trendline",
        narration: "The rally closes above the descending trendline. That is rule 1. With only this, the zone would be an inheritance zone.",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.22, l: 180.4, c: 180.88 },
            { o: 180.88, h: 181.56, l: 175.41, c: 175.6 },
            { o: 175.6, h: 175.83, l: 170.69, c: 171 },
            { o: 171, h: 171.33, l: 170.67, c: 171.11 },
            { o: 171.11, h: 171.47, l: 170.65, c: 171.02 },
            { o: 171.02, h: 171.4, l: 166.23, c: 166.57 },
            { o: 166.57, h: 166.97, l: 161.8, c: 162.33 },
            { o: 162.33, h: 162.56, l: 157.64, c: 158 },
            { o: 158, h: 158.37, l: 157.75, c: 157.95 },
            { o: 157.95, h: 158.49, l: 157.75, c: 158.14 },
            { o: 158.14, h: 158.83, l: 152.41, c: 152.77 },
            { o: 152.77, h: 153.69, l: 144.37, c: 144.99 },
            { o: 144.99, h: 145.67, l: 139.48, c: 140 },
            { o: 140, h: 140.53, l: 139.81, c: 140.19 },
            { o: 140.19, h: 140.42, l: 139.89, c: 140.13 },
            { o: 140.13, h: 140.41, l: 139.77, c: 140 },
            { o: 140, h: 147.09, l: 139.07, c: 146.68 },
            { o: 146.68, h: 153.32, l: 146.18, c: 153 },
            { o: 153, h: 159.13, l: 152.79, c: 158.77 },
            { o: 158.77, h: 163.66, l: 158.18, c: 163.49 },
            { o: 163.49, h: 163.72, l: 156.84, c: 157.53 },
            { o: 157.53, h: 158.16, l: 151.49, c: 152.04 },
            { o: 152.04, h: 152.53, l: 146.14, c: 146.68 },
            { o: 146.68, h: 146.87, l: 140.43, c: 140.93 },
            { o: 140.93, h: 142.93, l: 140.23, c: 142.73 },
            { o: 142.73, h: 150.86, l: 142.25, c: 150.06 },
            { o: 150.06, h: 158.11, l: 149.57, c: 157.29 },
            { o: 157.29, h: 165.06, l: 156.8, c: 164.28 },
            { o: 164.28, h: 170.72, l: 164.1, c: 170.15 }
          ],
          zones: [
            {
              from: 4,
              top: 171.47,
              bottom: 170.65,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.49,
              bottom: 157.75,
              kind: "supply",
              label: "last supply"
            },
            {
              from: 14,
              top: 140.53,
              bottom: 139.77,
              kind: "demand",
              label: "arrival zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 18,
              y2: 138.99,
              label: "descending trendline",
              broken: true
            }
          ],
          reveal: 18
        }
      },
      {
        title: "Rule 2: it removes the last supply",
        narration: "The rally also closes above the last supply. Both rules on one leg-out: this demand is an arrival zone. Raja calls these the most important zones.",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.22, l: 180.4, c: 180.88 },
            { o: 180.88, h: 181.56, l: 175.41, c: 175.6 },
            { o: 175.6, h: 175.83, l: 170.69, c: 171 },
            { o: 171, h: 171.33, l: 170.67, c: 171.11 },
            { o: 171.11, h: 171.47, l: 170.65, c: 171.02 },
            { o: 171.02, h: 171.4, l: 166.23, c: 166.57 },
            { o: 166.57, h: 166.97, l: 161.8, c: 162.33 },
            { o: 162.33, h: 162.56, l: 157.64, c: 158 },
            { o: 158, h: 158.37, l: 157.75, c: 157.95 },
            { o: 157.95, h: 158.49, l: 157.75, c: 158.14 },
            { o: 158.14, h: 158.83, l: 152.41, c: 152.77 },
            { o: 152.77, h: 153.69, l: 144.37, c: 144.99 },
            { o: 144.99, h: 145.67, l: 139.48, c: 140 },
            { o: 140, h: 140.53, l: 139.81, c: 140.19 },
            { o: 140.19, h: 140.42, l: 139.89, c: 140.13 },
            { o: 140.13, h: 140.41, l: 139.77, c: 140 },
            { o: 140, h: 147.09, l: 139.07, c: 146.68 },
            { o: 146.68, h: 153.32, l: 146.18, c: 153 },
            { o: 153, h: 159.13, l: 152.79, c: 158.77 },
            { o: 158.77, h: 163.66, l: 158.18, c: 163.49 },
            { o: 163.49, h: 163.72, l: 156.84, c: 157.53 },
            { o: 157.53, h: 158.16, l: 151.49, c: 152.04 },
            { o: 152.04, h: 152.53, l: 146.14, c: 146.68 },
            { o: 146.68, h: 146.87, l: 140.43, c: 140.93 },
            { o: 140.93, h: 142.93, l: 140.23, c: 142.73 },
            { o: 142.73, h: 150.86, l: 142.25, c: 150.06 },
            { o: 150.06, h: 158.11, l: 149.57, c: 157.29 },
            { o: 157.29, h: 165.06, l: 156.8, c: 164.28 },
            { o: 164.28, h: 170.72, l: 164.1, c: 170.15 }
          ],
          zones: [
            {
              from: 4,
              top: 171.47,
              bottom: 170.65,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.49,
              bottom: 157.75,
              kind: "supply",
              label: "last supply removed",
              to: 19,
              faded: true
            },
            {
              from: 14,
              top: 140.53,
              bottom: 139.77,
              kind: "demand",
              label: "arrival zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 18,
              y2: 138.99,
              label: "descending trendline",
              broken: true
            }
          ],
          notes: [
            {
              x: 19,
              y: 160.63,
              text: "last supply removed"
            }
          ],
          reveal: 20
        }
      },
      {
        title: "First touch: set and forget",
        narration: "On the first return, a buy limit at the top of the arrival zone, stop under it, target the next supply. Price respects it.",
        scene: {
          candles: [
            { o: 186, h: 190, l: 185.4, c: 185.7 },
            { o: 185.7, h: 186.22, l: 180.4, c: 180.88 },
            { o: 180.88, h: 181.56, l: 175.41, c: 175.6 },
            { o: 175.6, h: 175.83, l: 170.69, c: 171 },
            { o: 171, h: 171.33, l: 170.67, c: 171.11 },
            { o: 171.11, h: 171.47, l: 170.65, c: 171.02 },
            { o: 171.02, h: 171.4, l: 166.23, c: 166.57 },
            { o: 166.57, h: 166.97, l: 161.8, c: 162.33 },
            { o: 162.33, h: 162.56, l: 157.64, c: 158 },
            { o: 158, h: 158.37, l: 157.75, c: 157.95 },
            { o: 157.95, h: 158.49, l: 157.75, c: 158.14 },
            { o: 158.14, h: 158.83, l: 152.41, c: 152.77 },
            { o: 152.77, h: 153.69, l: 144.37, c: 144.99 },
            { o: 144.99, h: 145.67, l: 139.48, c: 140 },
            { o: 140, h: 140.53, l: 139.81, c: 140.19 },
            { o: 140.19, h: 140.42, l: 139.89, c: 140.13 },
            { o: 140.13, h: 140.41, l: 139.77, c: 140 },
            { o: 140, h: 147.09, l: 139.07, c: 146.68 },
            { o: 146.68, h: 153.32, l: 146.18, c: 153 },
            { o: 153, h: 159.13, l: 152.79, c: 158.77 },
            { o: 158.77, h: 163.66, l: 158.18, c: 163.49 },
            { o: 163.49, h: 163.72, l: 156.84, c: 157.53 },
            { o: 157.53, h: 158.16, l: 151.49, c: 152.04 },
            { o: 152.04, h: 152.53, l: 146.14, c: 146.68 },
            { o: 146.68, h: 146.87, l: 140.43, c: 140.93 },
            { o: 140.93, h: 142.93, l: 140.23, c: 142.73 },
            { o: 142.73, h: 150.86, l: 142.25, c: 150.06 },
            { o: 150.06, h: 158.11, l: 149.57, c: 157.29 },
            { o: 157.29, h: 165.06, l: 156.8, c: 164.28 },
            { o: 164.28, h: 170.72, l: 164.1, c: 170.15 }
          ],
          zones: [
            {
              from: 4,
              top: 171.47,
              bottom: 170.65,
              kind: "supply",
              label: "supply"
            },
            {
              from: 9,
              top: 158.49,
              bottom: 157.75,
              kind: "supply",
              label: "last supply removed",
              to: 19,
              faded: true
            },
            {
              from: 14,
              top: 140.53,
              bottom: 139.77,
              kind: "demand",
              label: "arrival zone"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 190,
              x2: 18,
              y2: 138.99,
              label: "descending trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 140.53,
              label: "buy limit",
              kind: "entry",
              from: 14
            },
            {
              y: 139.37,
              label: "stop",
              kind: "sl",
              from: 14
            },
            {
              y: 170.65,
              label: "TP",
              kind: "tp",
              from: 14
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which three zone types get pending orders?",
        options: [
          "Any fresh zone",
          "Simple strong, wow trade and arrival zones",
          "Flip, overlap and inheritance zones",
          "Only monthly zones"
        ],
        answer: 1,
        explain: "Among fresh zones only these three get a buy or sell limit. Everything else is weak."
      },
      {
        type: "spot",
        q: "Click the supply that is only an inheritance zone (it crossed the line but removed nothing).",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.28, l: 119.85, c: 124.01 },
            { o: 124.01, h: 128.26, l: 123.57, c: 128.08 },
            { o: 128.08, h: 132.45, l: 127.57, c: 132 },
            { o: 132, h: 132.35, l: 131.68, c: 132.06 },
            { o: 132.06, h: 132.43, l: 131.76, c: 132.13 },
            { o: 132.13, h: 135.3, l: 131.8, c: 135.12 },
            { o: 135.12, h: 138.5, l: 134.93, c: 138.18 },
            { o: 138.18, h: 142.19, l: 138.01, c: 142 },
            { o: 142, h: 142.28, l: 141.74, c: 141.95 },
            { o: 141.95, h: 142.16, l: 141.37, c: 141.67 },
            { o: 141.67, h: 142.4, l: 141.27, c: 142.01 },
            { o: 142.01, h: 148.01, l: 141.52, c: 147.38 },
            { o: 147.38, h: 152.94, l: 147.04, c: 152.37 },
            { o: 152.37, h: 157.99, l: 151.75, c: 157.33 },
            { o: 157.33, h: 164.44, l: 156.58, c: 164 },
            { o: 164, h: 164.42, l: 163.82, c: 164.26 },
            { o: 164.26, h: 164.55, l: 163.75, c: 163.96 },
            { o: 163.96, h: 164.32, l: 158.17, c: 158.51 },
            { o: 158.51, h: 159.09, l: 153.17, c: 153.52 },
            { o: 153.52, h: 154.1, l: 148.99, c: 149.13 },
            { o: 149.13, h: 149.42, l: 144.39, c: 144.9 },
            { o: 144.9, h: 145.19, l: 144.63, c: 144.78 },
            { o: 144.78, h: 145.27, l: 144.56, c: 144.88 },
            { o: 144.88, h: 147.59, l: 144.8, c: 147.37 },
            { o: 147.37, h: 151.35, l: 147.02, c: 150.99 },
            { o: 150.99, h: 154.18, l: 150.76, c: 154 },
            { o: 154, h: 154.74, l: 153.67, c: 154.34 },
            { o: 154.34, h: 154.66, l: 153.79, c: 154.15 },
            { o: 154.15, h: 154.36, l: 147.62, c: 148.19 },
            { o: 148.19, h: 148.44, l: 143.25, c: 143.55 },
            { o: 143.55, h: 144.02, l: 137.98, c: 138.51 },
            { o: 138.51, h: 138.71, l: 133.64, c: 134 },
            { o: 134, h: 134.18, l: 133.59, c: 133.74 },
            { o: 133.74, h: 134.28, l: 133.43, c: 134.06 },
            { o: 134.06, h: 138.75, l: 133.83, c: 138.38 },
            { o: 138.38, h: 143.39, l: 138.25, c: 142.84 },
            { o: 142.84, h: 148.3, l: 142.16, c: 147.88 },
            { o: 147.88, h: 153.46, l: 147.28, c: 153.27 },
            { o: 153.27, h: 154.15, l: 151.27, c: 151.47 },
            { o: 151.47, h: 151.97, l: 144.77, c: 145.51 },
            { o: 145.51, h: 145.75, l: 140.56, c: 140.76 },
            { o: 140.76, h: 141.31, l: 135.57, c: 135.91 },
            { o: 135.91, h: 136.3, l: 129.78, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.4,
              bottom: 141.27,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.53,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 39
        },
        answer: {
          from: 16,
          to: 17
        },
        explain: "Supply #1 at the peak crossed the rising line, but the demand held. Only rule 1, so it is an inheritance zone. The lower supply removed the demand and is the strong one."
      },
      {
        type: "tf",
        q: "A supply whose drop failed to remove the demand below is still strong if it is fresh.",
        answer: false,
        explain: "Fresh is not enough. If it failed to remove the opposite zone, it is weak, and the demand that held is the stronger zone."
      },
      {
        type: "tf",
        q: "High timeframes are for entries because the zones are bigger.",
        answer: false,
        explain: "High timeframe for direction and pips only. The stop would be too big. Small stop, maximum profit: enter on the low timeframe."
      },
      {
        type: "order",
        q: "Order the arrival-zone check for a demand.",
        items: [
          "Price is falling and making supplies",
          "A demand base forms",
          "Its rally crosses the descending trendline (rule 1)",
          "Its rally removes the last supply (rule 2)"
        ],
        explain: "Both rules on the same leg-out make an arrival zone."
      },
      {
        type: "mcq",
        q: "You bought a strong demand on the correction side (against the HTF line). How long do you hold?",
        options: [
          "Long term",
          "Short term only",
          "Until it breaks twice",
          "Forever"
        ],
        answer: 1,
        explain: "Hold long only with the trend. Correction trades are short-term."
      }
    ],
    practice: [
      {
        prompt: "This supply's drop did not reach the demand below. Price is back at the supply for the first time. Sell limit, buy, or nothing?",
        scene: {
          candles: [
            { o: 120, h: 124.03, l: 119.7, c: 123.77 },
            { o: 123.77, h: 129.12, l: 123.49, c: 128.63 },
            { o: 128.63, h: 132.47, l: 128.22, c: 132 },
            { o: 132, h: 132.27, l: 131.73, c: 131.94 },
            { o: 131.94, h: 132.1, l: 131.3, c: 131.69 },
            { o: 131.69, h: 132.36, l: 131.45, c: 132.03 },
            { o: 132.03, h: 139.55, l: 131.14, c: 139.13 },
            { o: 139.13, h: 147.78, l: 138.82, c: 147.13 },
            { o: 147.13, h: 153.24, l: 146.87, c: 152.5 },
            { o: 152.5, h: 158.7, l: 151.83, c: 158 },
            { o: 158, h: 158.35, l: 154.73, c: 154.87 },
            { o: 154.87, h: 155.16, l: 150.96, c: 151.1 },
            { o: 151.1, h: 151.32, l: 147.64, c: 148 },
            { o: 148, h: 148.29, l: 147.67, c: 147.98 },
            { o: 147.98, h: 148.29, l: 147.5, c: 147.82 },
            { o: 147.82, h: 148.17, l: 147.65, c: 147.93 },
            { o: 147.93, h: 148.43, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.63, l: 139.18, c: 139.44 },
            { o: 139.44, h: 139.87, l: 134.47, c: 134.86 },
            { o: 134.86, h: 135.21, l: 134.41, c: 134.65 },
            { o: 134.65, h: 134.96, l: 134.36, c: 134.74 },
            { o: 134.74, h: 138.08, l: 134.4, c: 137.72 },
            { o: 137.72, h: 140.8, l: 137.34, c: 140.58 },
            { o: 140.58, h: 143.77, l: 140.17, c: 143.67 },
            { o: 143.67, h: 147.3, l: 143.38, c: 147.1 },
            { o: 147.1, h: 149.57, l: 146.79, c: 149.37 },
            { o: 149.37, h: 151.93, l: 149.29, c: 151.72 },
            { o: 151.72, h: 154.58, l: 151.52, c: 154.3 },
            { o: 154.3, h: 157.38, l: 153.98, c: 157.29 }
          ],
          zones: [
            {
              from: 3,
              top: 132.36,
              bottom: 131.3,
              kind: "demand",
              label: "demand"
            },
            {
              from: 13,
              top: 148.29,
              bottom: 147.5,
              kind: "supply",
              label: "supply"
            }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "It failed to remove the opposite zone, so it is weak. No set and forget: the market can break it, and it did."
      },
      {
        prompt: "This CP supply's drop closed below the demand. Price is back at it for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 118, h: 121.72, l: 117.67, c: 121.5 },
            { o: 121.5, h: 125.93, l: 121.34, c: 125.79 },
            { o: 125.79, h: 130.34, l: 125.62, c: 130 },
            { o: 130, h: 130.47, l: 129.76, c: 130.14 },
            { o: 130.14, h: 130.3, l: 129.65, c: 129.82 },
            { o: 129.82, h: 130.12, l: 129.51, c: 129.86 },
            { o: 129.86, h: 137.68, l: 129.08, c: 137.09 },
            { o: 137.09, h: 145.75, l: 136.56, c: 144.81 },
            { o: 144.81, h: 150.53, l: 144.62, c: 150.12 },
            { o: 150.12, h: 156.38, l: 149.81, c: 156 },
            { o: 156, h: 156.15, l: 152.24, c: 152.54 },
            { o: 152.54, h: 152.93, l: 149.3, c: 149.41 },
            { o: 149.41, h: 149.69, l: 145.75, c: 146 },
            { o: 146, h: 146.2, l: 145.62, c: 145.93 },
            { o: 145.93, h: 146.14, l: 145.45, c: 145.78 },
            { o: 145.78, h: 146.35, l: 145.59, c: 145.98 },
            { o: 145.98, h: 146.19, l: 140.05, c: 140.69 },
            { o: 140.69, h: 141.33, l: 135.15, c: 135.7 },
            { o: 135.7, h: 136.35, l: 127.84, c: 128.33 },
            { o: 128.33, h: 129.06, l: 121.4, c: 122 },
            { o: 122, h: 122.26, l: 121.66, c: 121.99 },
            { o: 121.99, h: 122.33, l: 121.69, c: 122.14 },
            { o: 122.14, h: 128.99, l: 121.51, c: 128.23 },
            { o: 128.23, h: 133.1, l: 127.79, c: 132.92 },
            { o: 132.92, h: 139.93, l: 132.29, c: 139.38 },
            { o: 139.38, h: 145.64, l: 139.08, c: 145.05 },
            { o: 145.05, h: 145.85, l: 143.05, c: 143.25 },
            { o: 143.25, h: 143.5, l: 137.65, c: 138.18 },
            { o: 138.18, h: 138.49, l: 133.39, c: 133.77 },
            { o: 133.77, h: 134.01, l: 128.63, c: 128.94 },
            { o: 128.94, h: 129.17, l: 123.33, c: 124 }
          ],
          zones: [
            {
              from: 3,
              top: 130.47,
              bottom: 129.51,
              kind: "demand",
              label: "demand removed",
              to: 18,
              faded: true
            },
            {
              from: 13,
              top: 146.35,
              bottom: 145.45,
              kind: "supply",
              label: "CP supply"
            }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Whichever zone removed the opposite zone becomes strong. First touch of a strong zone is always set and forget. Price respected it and dropped."
      }
    ],
    cards: [
      {
        front: "Three strong zone types?",
        back: "Simple strong zone, wow trade zone, arrival zone."
      },
      {
        front: "Simple strong zone?",
        back: "Its move removed the opposite zone. Found mostly on CP levels."
      },
      {
        front: "Arrival zone rules?",
        back: "1: crosses the trendline. 2: removes the opposite zone."
      },
      {
        front: "Only rule 1 met?",
        back: "Inheritance zone. Weak."
      },
      {
        front: "First touch of a strong zone?",
        back: "Set and forget."
      },
      {
        front: "Indicators?",
        back: "Not used. They are slow; the market is fast."
      }
    ],
    mnemonic: "Beat a rival = strong. Jump the fence and beat a rival = arrival."
  },
  {
    mentor: "raja",
    n: 52,
    eli5: {
      oneLiner: "Every zone is strong or weak. Weak ones must prove themselves first.",
      story: "A rubber band stretches fine the first time. The second and third time you test it gently before you trust it. The fourth time it usually snaps. Zones are the same. Raja also warns about fake strong zones: some look tough but were born inside an old zone, like a band that was already frayed.",
      analogy: "Touch 1 = new rubber band. Touch 2 and 3 = test it gently. Touch 4 = it snaps."
    },
    bigIdeas: [
      "1st touch set and forget; 2nd and 3rd only with confirmation; expect the 4th to break.",
      "Confirmation = the arrival rules on a lower timeframe: line crossed AND last opposite zone removed.",
      "9 types: 3 strong (pending order) and 6 weak (inheritance, overlap, flip, out-of-trendline, tested, plain weak)."
    ],
    steps: [
      {
        title: "Supply #1 crosses the line",
        narration: "At the peak, supply #1 drops and closes below the rising trendline. Rule 1 of an arrival zone is met.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.62, l: 119.73, c: 124.47 },
            { o: 124.47, h: 128.37, l: 124.15, c: 127.98 },
            { o: 127.98, h: 132.38, l: 127.48, c: 132 },
            { o: 132, h: 132.2, l: 131.53, c: 131.78 },
            { o: 131.78, h: 132.2, l: 131.49, c: 131.91 },
            { o: 131.91, h: 135.7, l: 131.51, c: 135.29 },
            { o: 135.29, h: 138.18, l: 134.99, c: 137.85 },
            { o: 137.85, h: 142.49, l: 137.35, c: 142 },
            { o: 142, h: 142.26, l: 141.51, c: 141.75 },
            { o: 141.75, h: 142.32, l: 141.38, c: 141.94 },
            { o: 141.94, h: 142.16, l: 141.68, c: 141.98 },
            { o: 141.98, h: 147.33, l: 141.36, c: 146.68 },
            { o: 146.68, h: 152.63, l: 146.47, c: 152.13 },
            { o: 152.13, h: 158.58, l: 151.35, c: 157.96 },
            { o: 157.96, h: 164.69, l: 157.58, c: 164 },
            { o: 164, h: 164.33, l: 163.66, c: 164.14 },
            { o: 164.14, h: 164.4, l: 163.56, c: 163.93 },
            { o: 163.93, h: 164.41, l: 157.97, c: 158.65 },
            { o: 158.65, h: 159.04, l: 153.86, c: 154.24 },
            { o: 154.24, h: 154.42, l: 148.59, c: 149.07 },
            { o: 149.07, h: 149.34, l: 144.57, c: 144.82 },
            { o: 144.82, h: 145.02, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.08, l: 144.35, c: 144.86 },
            { o: 144.86, h: 148.69, l: 144.56, c: 148.29 },
            { o: 148.29, h: 151.41, l: 148.05, c: 151.23 },
            { o: 151.23, h: 154.33, l: 151.14, c: 154 },
            { o: 154, h: 154.26, l: 153.54, c: 153.81 },
            { o: 153.81, h: 154.38, l: 153.48, c: 154 },
            { o: 154, h: 154.71, l: 147.95, c: 148.23 },
            { o: 148.23, h: 148.73, l: 144.18, c: 144.5 },
            { o: 144.5, h: 144.71, l: 138.55, c: 138.82 },
            { o: 138.82, h: 139.39, l: 133.54, c: 134 },
            { o: 134, h: 134.38, l: 133.47, c: 133.67 },
            { o: 133.67, h: 134.44, l: 133.4, c: 134.12 },
            { o: 134.12, h: 139.48, l: 133.49, c: 139.08 },
            { o: 139.08, h: 144.62, l: 138.82, c: 144.28 },
            { o: 144.28, h: 148.51, l: 143.82, c: 148.1 },
            { o: 148.1, h: 153.35, l: 147.76, c: 153.08 },
            { o: 153.08, h: 153.89, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.84, l: 144.95, c: 145.56 },
            { o: 145.56, h: 145.88, l: 141.17, c: 141.51 },
            { o: 141.51, h: 142.36, l: 134.85, c: 135.24 },
            { o: 135.24, h: 135.53, l: 129.42, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.32,
              bottom: 141.38,
              kind: "demand",
              label: "demand"
            },
            {
              from: 16,
              top: 164.4,
              bottom: 163.56,
              kind: "supply",
              label: "#1"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.27,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 21
        }
      },
      {
        title: "But the demand holds",
        narration: "The drop stops above the demand. Rule 2 is not met. So #1 is not an arrival zone; it is an inheritance zone.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.62, l: 119.73, c: 124.47 },
            { o: 124.47, h: 128.37, l: 124.15, c: 127.98 },
            { o: 127.98, h: 132.38, l: 127.48, c: 132 },
            { o: 132, h: 132.2, l: 131.53, c: 131.78 },
            { o: 131.78, h: 132.2, l: 131.49, c: 131.91 },
            { o: 131.91, h: 135.7, l: 131.51, c: 135.29 },
            { o: 135.29, h: 138.18, l: 134.99, c: 137.85 },
            { o: 137.85, h: 142.49, l: 137.35, c: 142 },
            { o: 142, h: 142.26, l: 141.51, c: 141.75 },
            { o: 141.75, h: 142.32, l: 141.38, c: 141.94 },
            { o: 141.94, h: 142.16, l: 141.68, c: 141.98 },
            { o: 141.98, h: 147.33, l: 141.36, c: 146.68 },
            { o: 146.68, h: 152.63, l: 146.47, c: 152.13 },
            { o: 152.13, h: 158.58, l: 151.35, c: 157.96 },
            { o: 157.96, h: 164.69, l: 157.58, c: 164 },
            { o: 164, h: 164.33, l: 163.66, c: 164.14 },
            { o: 164.14, h: 164.4, l: 163.56, c: 163.93 },
            { o: 163.93, h: 164.41, l: 157.97, c: 158.65 },
            { o: 158.65, h: 159.04, l: 153.86, c: 154.24 },
            { o: 154.24, h: 154.42, l: 148.59, c: 149.07 },
            { o: 149.07, h: 149.34, l: 144.57, c: 144.82 },
            { o: 144.82, h: 145.02, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.08, l: 144.35, c: 144.86 },
            { o: 144.86, h: 148.69, l: 144.56, c: 148.29 },
            { o: 148.29, h: 151.41, l: 148.05, c: 151.23 },
            { o: 151.23, h: 154.33, l: 151.14, c: 154 },
            { o: 154, h: 154.26, l: 153.54, c: 153.81 },
            { o: 153.81, h: 154.38, l: 153.48, c: 154 },
            { o: 154, h: 154.71, l: 147.95, c: 148.23 },
            { o: 148.23, h: 148.73, l: 144.18, c: 144.5 },
            { o: 144.5, h: 144.71, l: 138.55, c: 138.82 },
            { o: 138.82, h: 139.39, l: 133.54, c: 134 },
            { o: 134, h: 134.38, l: 133.47, c: 133.67 },
            { o: 133.67, h: 134.44, l: 133.4, c: 134.12 },
            { o: 134.12, h: 139.48, l: 133.49, c: 139.08 },
            { o: 139.08, h: 144.62, l: 138.82, c: 144.28 },
            { o: 144.28, h: 148.51, l: 143.82, c: 148.1 },
            { o: 148.1, h: 153.35, l: 147.76, c: 153.08 },
            { o: 153.08, h: 153.89, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.84, l: 144.95, c: 145.56 },
            { o: 145.56, h: 145.88, l: 141.17, c: 141.51 },
            { o: 141.51, h: 142.36, l: 134.85, c: 135.24 },
            { o: 135.24, h: 135.53, l: 129.42, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.32,
              bottom: 141.38,
              kind: "demand",
              label: "demand"
            },
            {
              from: 16,
              top: 164.4,
              bottom: 163.56,
              kind: "supply",
              label: "#1 inheritance (weak)"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.27,
              label: "trendline",
              broken: true
            }
          ],
          notes: [
            {
              x: 17,
              y: 139.38,
              text: "demand not removed"
            }
          ],
          reveal: 27
        }
      },
      {
        title: "Supply #2 removes the demand",
        narration: "Price bounces, builds supply #2 and drops again. This time a candle closes below the demand. #2 removed the opposite zone, so #2 is strong. #1 gave its power to #2.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.62, l: 119.73, c: 124.47 },
            { o: 124.47, h: 128.37, l: 124.15, c: 127.98 },
            { o: 127.98, h: 132.38, l: 127.48, c: 132 },
            { o: 132, h: 132.2, l: 131.53, c: 131.78 },
            { o: 131.78, h: 132.2, l: 131.49, c: 131.91 },
            { o: 131.91, h: 135.7, l: 131.51, c: 135.29 },
            { o: 135.29, h: 138.18, l: 134.99, c: 137.85 },
            { o: 137.85, h: 142.49, l: 137.35, c: 142 },
            { o: 142, h: 142.26, l: 141.51, c: 141.75 },
            { o: 141.75, h: 142.32, l: 141.38, c: 141.94 },
            { o: 141.94, h: 142.16, l: 141.68, c: 141.98 },
            { o: 141.98, h: 147.33, l: 141.36, c: 146.68 },
            { o: 146.68, h: 152.63, l: 146.47, c: 152.13 },
            { o: 152.13, h: 158.58, l: 151.35, c: 157.96 },
            { o: 157.96, h: 164.69, l: 157.58, c: 164 },
            { o: 164, h: 164.33, l: 163.66, c: 164.14 },
            { o: 164.14, h: 164.4, l: 163.56, c: 163.93 },
            { o: 163.93, h: 164.41, l: 157.97, c: 158.65 },
            { o: 158.65, h: 159.04, l: 153.86, c: 154.24 },
            { o: 154.24, h: 154.42, l: 148.59, c: 149.07 },
            { o: 149.07, h: 149.34, l: 144.57, c: 144.82 },
            { o: 144.82, h: 145.02, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.08, l: 144.35, c: 144.86 },
            { o: 144.86, h: 148.69, l: 144.56, c: 148.29 },
            { o: 148.29, h: 151.41, l: 148.05, c: 151.23 },
            { o: 151.23, h: 154.33, l: 151.14, c: 154 },
            { o: 154, h: 154.26, l: 153.54, c: 153.81 },
            { o: 153.81, h: 154.38, l: 153.48, c: 154 },
            { o: 154, h: 154.71, l: 147.95, c: 148.23 },
            { o: 148.23, h: 148.73, l: 144.18, c: 144.5 },
            { o: 144.5, h: 144.71, l: 138.55, c: 138.82 },
            { o: 138.82, h: 139.39, l: 133.54, c: 134 },
            { o: 134, h: 134.38, l: 133.47, c: 133.67 },
            { o: 133.67, h: 134.44, l: 133.4, c: 134.12 },
            { o: 134.12, h: 139.48, l: 133.49, c: 139.08 },
            { o: 139.08, h: 144.62, l: 138.82, c: 144.28 },
            { o: 144.28, h: 148.51, l: 143.82, c: 148.1 },
            { o: 148.1, h: 153.35, l: 147.76, c: 153.08 },
            { o: 153.08, h: 153.89, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.84, l: 144.95, c: 145.56 },
            { o: 145.56, h: 145.88, l: 141.17, c: 141.51 },
            { o: 141.51, h: 142.36, l: 134.85, c: 135.24 },
            { o: 135.24, h: 135.53, l: 129.42, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.32,
              bottom: 141.38,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            },
            {
              from: 16,
              top: 164.4,
              bottom: 163.56,
              kind: "supply",
              label: "#1 inheritance (weak)"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.48,
              kind: "supply",
              label: "#2 strong"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.27,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 32
        }
      },
      {
        title: "Sell limit on #2, confirmation on #1",
        narration: "Put a set and forget sell limit on #2. #1 at the top gets confirmation only: market makers leave inheritance zones next to arrival zones as traps.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.62, l: 119.73, c: 124.47 },
            { o: 124.47, h: 128.37, l: 124.15, c: 127.98 },
            { o: 127.98, h: 132.38, l: 127.48, c: 132 },
            { o: 132, h: 132.2, l: 131.53, c: 131.78 },
            { o: 131.78, h: 132.2, l: 131.49, c: 131.91 },
            { o: 131.91, h: 135.7, l: 131.51, c: 135.29 },
            { o: 135.29, h: 138.18, l: 134.99, c: 137.85 },
            { o: 137.85, h: 142.49, l: 137.35, c: 142 },
            { o: 142, h: 142.26, l: 141.51, c: 141.75 },
            { o: 141.75, h: 142.32, l: 141.38, c: 141.94 },
            { o: 141.94, h: 142.16, l: 141.68, c: 141.98 },
            { o: 141.98, h: 147.33, l: 141.36, c: 146.68 },
            { o: 146.68, h: 152.63, l: 146.47, c: 152.13 },
            { o: 152.13, h: 158.58, l: 151.35, c: 157.96 },
            { o: 157.96, h: 164.69, l: 157.58, c: 164 },
            { o: 164, h: 164.33, l: 163.66, c: 164.14 },
            { o: 164.14, h: 164.4, l: 163.56, c: 163.93 },
            { o: 163.93, h: 164.41, l: 157.97, c: 158.65 },
            { o: 158.65, h: 159.04, l: 153.86, c: 154.24 },
            { o: 154.24, h: 154.42, l: 148.59, c: 149.07 },
            { o: 149.07, h: 149.34, l: 144.57, c: 144.82 },
            { o: 144.82, h: 145.02, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.08, l: 144.35, c: 144.86 },
            { o: 144.86, h: 148.69, l: 144.56, c: 148.29 },
            { o: 148.29, h: 151.41, l: 148.05, c: 151.23 },
            { o: 151.23, h: 154.33, l: 151.14, c: 154 },
            { o: 154, h: 154.26, l: 153.54, c: 153.81 },
            { o: 153.81, h: 154.38, l: 153.48, c: 154 },
            { o: 154, h: 154.71, l: 147.95, c: 148.23 },
            { o: 148.23, h: 148.73, l: 144.18, c: 144.5 },
            { o: 144.5, h: 144.71, l: 138.55, c: 138.82 },
            { o: 138.82, h: 139.39, l: 133.54, c: 134 },
            { o: 134, h: 134.38, l: 133.47, c: 133.67 },
            { o: 133.67, h: 134.44, l: 133.4, c: 134.12 },
            { o: 134.12, h: 139.48, l: 133.49, c: 139.08 },
            { o: 139.08, h: 144.62, l: 138.82, c: 144.28 },
            { o: 144.28, h: 148.51, l: 143.82, c: 148.1 },
            { o: 148.1, h: 153.35, l: 147.76, c: 153.08 },
            { o: 153.08, h: 153.89, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.84, l: 144.95, c: 145.56 },
            { o: 145.56, h: 145.88, l: 141.17, c: 141.51 },
            { o: 141.51, h: 142.36, l: 134.85, c: 135.24 },
            { o: 135.24, h: 135.53, l: 129.42, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.32,
              bottom: 141.38,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            },
            {
              from: 16,
              top: 164.4,
              bottom: 163.56,
              kind: "supply",
              label: "#1 inheritance (weak)"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.48,
              kind: "supply",
              label: "#2 strong"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.27,
              label: "trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 153.48,
              label: "sell limit #2",
              kind: "entry",
              from: 27
            },
            {
              y: 154.78,
              label: "stop",
              kind: "sl",
              from: 27
            }
          ],
          reveal: 39
        }
      },
      {
        title: "The strong zone is respected",
        narration: "Price taps #2 and drops. Same picture, two zones, two very different treatments.",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.62, l: 119.73, c: 124.47 },
            { o: 124.47, h: 128.37, l: 124.15, c: 127.98 },
            { o: 127.98, h: 132.38, l: 127.48, c: 132 },
            { o: 132, h: 132.2, l: 131.53, c: 131.78 },
            { o: 131.78, h: 132.2, l: 131.49, c: 131.91 },
            { o: 131.91, h: 135.7, l: 131.51, c: 135.29 },
            { o: 135.29, h: 138.18, l: 134.99, c: 137.85 },
            { o: 137.85, h: 142.49, l: 137.35, c: 142 },
            { o: 142, h: 142.26, l: 141.51, c: 141.75 },
            { o: 141.75, h: 142.32, l: 141.38, c: 141.94 },
            { o: 141.94, h: 142.16, l: 141.68, c: 141.98 },
            { o: 141.98, h: 147.33, l: 141.36, c: 146.68 },
            { o: 146.68, h: 152.63, l: 146.47, c: 152.13 },
            { o: 152.13, h: 158.58, l: 151.35, c: 157.96 },
            { o: 157.96, h: 164.69, l: 157.58, c: 164 },
            { o: 164, h: 164.33, l: 163.66, c: 164.14 },
            { o: 164.14, h: 164.4, l: 163.56, c: 163.93 },
            { o: 163.93, h: 164.41, l: 157.97, c: 158.65 },
            { o: 158.65, h: 159.04, l: 153.86, c: 154.24 },
            { o: 154.24, h: 154.42, l: 148.59, c: 149.07 },
            { o: 149.07, h: 149.34, l: 144.57, c: 144.82 },
            { o: 144.82, h: 145.02, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.08, l: 144.35, c: 144.86 },
            { o: 144.86, h: 148.69, l: 144.56, c: 148.29 },
            { o: 148.29, h: 151.41, l: 148.05, c: 151.23 },
            { o: 151.23, h: 154.33, l: 151.14, c: 154 },
            { o: 154, h: 154.26, l: 153.54, c: 153.81 },
            { o: 153.81, h: 154.38, l: 153.48, c: 154 },
            { o: 154, h: 154.71, l: 147.95, c: 148.23 },
            { o: 148.23, h: 148.73, l: 144.18, c: 144.5 },
            { o: 144.5, h: 144.71, l: 138.55, c: 138.82 },
            { o: 138.82, h: 139.39, l: 133.54, c: 134 },
            { o: 134, h: 134.38, l: 133.47, c: 133.67 },
            { o: 133.67, h: 134.44, l: 133.4, c: 134.12 },
            { o: 134.12, h: 139.48, l: 133.49, c: 139.08 },
            { o: 139.08, h: 144.62, l: 138.82, c: 144.28 },
            { o: 144.28, h: 148.51, l: 143.82, c: 148.1 },
            { o: 148.1, h: 153.35, l: 147.76, c: 153.08 },
            { o: 153.08, h: 153.89, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.84, l: 144.95, c: 145.56 },
            { o: 145.56, h: 145.88, l: 141.17, c: 141.51 },
            { o: 141.51, h: 142.36, l: 134.85, c: 135.24 },
            { o: 135.24, h: 135.53, l: 129.42, c: 130 }
          ],
          zones: [
            {
              from: 9,
              top: 142.32,
              bottom: 141.38,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            },
            {
              from: 16,
              top: 164.4,
              bottom: 163.56,
              kind: "supply",
              label: "#1 inheritance (weak)"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.48,
              kind: "supply",
              label: "#2 strong"
            }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 116,
              x2: 20,
              y2: 158.27,
              label: "trendline",
              broken: true
            }
          ],
          lines: [
            {
              y: 153.48,
              label: "sell limit #2",
              kind: "entry",
              from: 27
            },
            {
              y: 154.78,
              label: "stop",
              kind: "sl",
              from: 27
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order how a zone may be used.",
        items: [
          "1st touch: set and forget",
          "2nd touch: confirmation only",
          "3rd touch: confirmation only",
          "4th touch: expect a break"
        ],
        explain: "The same count applies to strong and arrival zones that have been tested."
      },
      {
        type: "spot",
        q: "Click the basing candles of the overlap zone.",
        scene: {
          candles: [
            { o: 128, h: 132.13, l: 127.82, c: 131.78 },
            { o: 131.78, h: 135.93, l: 131.46, c: 135.49 },
            { o: 135.49, h: 140.21, l: 135.13, c: 140 },
            { o: 140, h: 140.39, l: 139.5, c: 140 },
            { o: 140, h: 140.35, l: 139.06, c: 139.59 },
            { o: 139.59, h: 140.11, l: 139.07, c: 139.83 },
            { o: 139.83, h: 145.33, l: 139.25, c: 145.12 },
            { o: 145.12, h: 150.34, l: 144.93, c: 149.89 },
            { o: 149.89, h: 155.94, l: 149.43, c: 155.49 },
            { o: 155.49, h: 160.39, l: 155, c: 160 },
            { o: 160, h: 160.36, l: 154.45, c: 154.99 },
            { o: 154.99, h: 155.34, l: 149.88, c: 150.22 },
            { o: 150.22, h: 150.36, l: 145.44, c: 145.79 },
            { o: 145.79, h: 146.52, l: 139.86, c: 140.03 },
            { o: 140.03, h: 140.3, l: 139.69, c: 139.97 },
            { o: 139.97, h: 140.37, l: 139.8, c: 140.11 },
            { o: 140.11, h: 140.25, l: 137.67, c: 137.93 },
            { o: 137.93, h: 138.19, l: 135.74, c: 136.01 },
            { o: 136.01, h: 136.21, l: 132.65, c: 133.01 },
            { o: 133.01, h: 133.2, l: 129.67, c: 130 },
            { o: 130, h: 130.33, l: 129.71, c: 129.93 },
            { o: 129.93, h: 130.2, l: 129.67, c: 129.92 },
            { o: 129.92, h: 132.07, l: 129.7, c: 131.94 },
            { o: 131.94, h: 134.52, l: 131.61, c: 134.34 },
            { o: 134.34, h: 136.37, l: 134.07, c: 136.31 },
            { o: 136.31, h: 139.51, l: 136.21, c: 139.29 },
            { o: 139.29, h: 142.82, l: 139.04, c: 142.44 },
            { o: 142.44, h: 144.93, l: 142.29, c: 144.73 },
            { o: 144.73, h: 147.81, l: 144.48, c: 147.52 },
            { o: 147.52, h: 150.75, l: 147.36, c: 150.37 }
          ],
          zones: [
            {
              from: 3,
              top: 140.39,
              bottom: 139.06,
              kind: "demand",
              label: "old demand",
              to: 16,
              faded: true
            }
          ],
          reveal: 26
        },
        answer: {
          from: 14,
          to: 15
        },
        explain: "This supply was built inside the old demand area with no gap. It removed the demand, but it is still an overlap zone and weak."
      },
      {
        type: "mcq",
        q: "What is confirmation, in Raja's words?",
        options: [
          "A second indicator",
          "The arrival-zone rules on a lower timeframe",
          "Waiting one hour",
          "A bigger candle on the monthly"
        ],
        answer: 1,
        explain: "On the lower timeframe: trendline crossed and last opposite zone removed. Then trade that new strong zone."
      },
      {
        type: "mcq",
        q: "A daily trade needs confirmation. Which timeframe do you use?",
        options: [
          "Monthly",
          "Weekly",
          "H1",
          "The same daily"
        ],
        answer: 2,
        explain: "Monthly/weekly confirm on daily or H4; daily confirms on H1; H1 confirms on 15m, 5m or 1m."
      },
      {
        type: "tf",
        q: "A zone that removed something is always strong, even if it formed inside an old opposite zone.",
        answer: false,
        explain: "That is the overlap trap. Most S&D traders lose here. Born inside an old zone = weak."
      },
      {
        type: "tf",
        q: "No confirmation on the lower timeframe means no trade on that pair.",
        answer: true,
        explain: "Move on and look for the easiest pairs. Only trade when the market gives you a clear pass."
      }
    ],
    practice: [
      {
        prompt: "This demand has already held three times. Price is coming down to it a fourth time. Buy limit?",
        scene: {
          candles: [
            { o: 150, h: 150.34, l: 145.26, c: 145.5 },
            { o: 145.5, h: 145.84, l: 140.11, c: 140.28 },
            { o: 140.28, h: 141.09, l: 133.33, c: 134.15 },
            { o: 134.15, h: 134.56, l: 129.46, c: 130 },
            { o: 130, h: 130.18, l: 129.32, c: 129.73 },
            { o: 129.73, h: 130.52, l: 129.34, c: 130.19 },
            { o: 130.19, h: 130.57, l: 129.76, c: 129.98 },
            { o: 129.98, h: 135.1, l: 129.37, c: 134.69 },
            { o: 134.69, h: 138.95, l: 134.51, c: 138.72 },
            { o: 138.72, h: 144.5, l: 138.18, c: 144 },
            { o: 144, h: 144.35, l: 140.27, c: 140.41 },
            { o: 140.41, h: 140.9, l: 135.69, c: 136.07 },
            { o: 136.07, h: 136.52, l: 130.45, c: 130.87 },
            { o: 130.87, h: 132.17, l: 130.17, c: 131.97 },
            { o: 131.97, h: 136.31, l: 131.48, c: 135.82 },
            { o: 135.82, h: 141.62, l: 135.56, c: 141 },
            { o: 141, h: 141.23, l: 137.43, c: 137.79 },
            { o: 137.79, h: 137.92, l: 134.7, c: 134.9 },
            { o: 134.9, h: 135.37, l: 130.51, c: 130.87 },
            { o: 130.87, h: 132.17, l: 130.02, c: 131.97 },
            { o: 131.97, h: 135.61, l: 131.71, c: 135.2 },
            { o: 135.2, h: 139.43, l: 134.86, c: 139 },
            { o: 139, h: 139.12, l: 136.2, c: 136.51 },
            { o: 136.51, h: 136.86, l: 133.14, c: 133.46 },
            { o: 133.46, h: 133.73, l: 130.6, c: 130.87 },
            { o: 130.87, h: 132.17, l: 129.87, c: 131.97 },
            { o: 131.97, h: 135.2, l: 131.81, c: 134.97 },
            { o: 134.97, h: 138.14, l: 134.64, c: 138 },
            { o: 138, h: 138.2, l: 135.41, c: 135.5 },
            { o: 135.5, h: 135.75, l: 133.54, c: 133.7 },
            { o: 133.7, h: 133.93, l: 130.59, c: 130.87 },
            { o: 130.87, h: 131.33, l: 127.07, c: 127.53 },
            { o: 127.53, h: 127.83, l: 124.54, c: 124.77 },
            { o: 124.77, h: 125.05, l: 120.87, c: 121.32 }
          ],
          zones: [
            {
              from: 4,
              top: 130.57,
              bottom: 129.32,
              kind: "demand",
              label: "demand"
            }
          ],
          notes: [
            {
              x: 13,
              y: 127.82,
              text: "touch 1"
            },
            {
              x: 19,
              y: 127.82,
              text: "touch 2"
            },
            {
              x: 25,
              y: 127.82,
              text: "touch 3"
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Fourth time: expect the market to break the zone. It was tapped, weakened and finally broken."
      },
      {
        prompt: "Price has climbed back to supply #1 at the old peak (the inheritance zone). The lower timeframe shows no confirmation. Sell limit?",
        scene: {
          candles: [
            { o: 120, h: 120.5, l: 116, c: 120.2 },
            { o: 120.2, h: 124.82, l: 119.76, c: 124.28 },
            { o: 124.28, h: 128.86, l: 124, c: 128.48 },
            { o: 128.48, h: 132.13, l: 128.2, c: 132 },
            { o: 132, h: 132.16, l: 131.78, c: 132 },
            { o: 132, h: 132.34, l: 131.55, c: 131.92 },
            { o: 131.92, h: 135.18, l: 131.71, c: 134.84 },
            { o: 134.84, h: 138.55, l: 134.37, c: 138.32 },
            { o: 138.32, h: 142.33, l: 137.9, c: 142 },
            { o: 142, h: 142.28, l: 141.64, c: 141.89 },
            { o: 141.89, h: 142.35, l: 141.61, c: 142.15 },
            { o: 142.15, h: 142.36, l: 141.91, c: 142.11 },
            { o: 142.11, h: 146.99, l: 141.52, c: 146.42 },
            { o: 146.42, h: 152.88, l: 146.13, c: 152.23 },
            { o: 152.23, h: 158.82, l: 152.01, c: 158.6 },
            { o: 158.6, h: 164.68, l: 158.36, c: 164 },
            { o: 164, h: 164.31, l: 163.72, c: 164.15 },
            { o: 164.15, h: 164.35, l: 163.57, c: 163.89 },
            { o: 163.89, h: 164.51, l: 158.2, c: 158.69 },
            { o: 158.69, h: 159.22, l: 154.25, c: 154.61 },
            { o: 154.61, h: 155.1, l: 149.01, c: 149.53 },
            { o: 149.53, h: 149.76, l: 144.65, c: 144.86 },
            { o: 144.86, h: 145.05, l: 144.15, c: 144.51 },
            { o: 144.51, h: 145.18, l: 144.17, c: 144.99 },
            { o: 144.99, h: 148.71, l: 144.57, c: 148.32 },
            { o: 148.32, h: 151.34, l: 148, c: 151.15 },
            { o: 151.15, h: 154.13, l: 150.81, c: 154 },
            { o: 154, h: 154.21, l: 153.73, c: 154.04 },
            { o: 154.04, h: 154.3, l: 153.61, c: 153.9 },
            { o: 153.9, h: 154.27, l: 149.2, c: 149.53 },
            { o: 149.53, h: 150.25, l: 143.06, c: 143.74 },
            { o: 143.74, h: 144.12, l: 138.71, c: 138.93 },
            { o: 138.93, h: 139.19, l: 133.77, c: 134 },
            { o: 134, h: 134.37, l: 133.53, c: 133.76 },
            { o: 133.76, h: 134.1, l: 133.37, c: 133.91 },
            { o: 133.91, h: 138.94, l: 133.25, c: 138.71 },
            { o: 138.71, h: 143.93, l: 138.32, c: 143.32 },
            { o: 143.32, h: 149.35, l: 143.12, c: 148.94 },
            { o: 148.94, h: 153.46, l: 148.43, c: 153.21 },
            { o: 153.21, h: 153.92, l: 151.21, c: 151.41 },
            { o: 151.41, h: 151.96, l: 145.74, c: 146.22 },
            { o: 146.22, h: 146.59, l: 140.04, c: 140.45 },
            { o: 140.45, h: 140.64, l: 134.95, c: 135.59 },
            { o: 135.59, h: 136.33, l: 129.77, c: 130 },
            { o: 130, h: 137.44, l: 129.24, c: 136.76 },
            { o: 136.76, h: 142.22, l: 136.29, c: 141.97 },
            { o: 141.97, h: 151.23, l: 141.6, c: 150.17 },
            { o: 150.17, h: 158.14, l: 149.31, c: 157.56 },
            { o: 157.56, h: 163.51, l: 157.04, c: 163.17 },
            { o: 163.17, h: 165.52, l: 163.02, c: 165.43 },
            { o: 165.43, h: 167.72, l: 165.16, c: 167.5 },
            { o: 167.5, h: 170.48, l: 167.17, c: 170.35 }
          ],
          zones: [
            {
              from: 9,
              top: 142.36,
              bottom: 141.61,
              kind: "demand",
              label: "demand removed",
              to: 31,
              faded: true
            },
            {
              from: 16,
              top: 164.35,
              bottom: 163.57,
              kind: "supply",
              label: "#1 inheritance"
            },
            {
              from: 27,
              top: 154.3,
              bottom: 153.61,
              kind: "supply",
              label: "#2 (used)",
              faded: true
            }
          ],
          reveal: 49
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "An inheritance zone is weak: confirmation only. Raja gives it about a 10% chance to hold. Price broke right through it."
      }
    ],
    cards: [
      {
        front: "Touch rules?",
        back: "1st set and forget, 2nd and 3rd confirmation, 4th usually breaks."
      },
      {
        front: "Confirmation?",
        back: "Arrival rules on a lower timeframe: line crossed + last opposite zone removed."
      },
      {
        front: "Confirm a daily trade on?",
        back: "H1."
      },
      {
        front: "Overlap zone?",
        back: "Born inside an old opposite zone (no gap). Weak even if it removed a zone."
      },
      {
        front: "Out-of-trendline zone?",
        back: "A fresh zone after the major trendline turned against it. Confirmation only."
      },
      {
        front: "How many zone types?",
        back: "9: 3 strong, 6 weak."
      },
      {
        front: "No confirmation?",
        back: "No trade. Move to an easier pair."
      }
    ],
    mnemonic: "One, trust. Two and three, test. Four, it breaks."
  },
  {
    mentor: "raja",
    n: 53,
    eli5: {
      oneLiner: "Seven quick checks before every trade, like a pilot before take-off.",
      story: "A pilot never just jumps in and flies. She checks the fuel, the weather, the runway and the wings, one by one. Raja checks seven things on every pair. Timeframe, profit room, trend or range, account size, entry type, structure and exit plan. If one check fails, the plane stays on the ground.",
      analogy: "The seven steps are a pilot's pre-flight checklist. One red light and you do not take off."
    },
    bigIdeas: [
      "Fix your direction timeframe; demand 2-3x room to the opposite zone; hold only in a trend.",
      "Match the instrument to your equity. Pick an entry: pullback, breakout or flip area (with confirmation).",
      "No structure (meshing) = no trade. Swing exit: stop under the second-latest zone, one zone kept as a buffer."
    ],
    steps: [
      {
        title: "Steps 1-2: timeframe and margin",
        narration: "Pick the timeframe you follow for direction. Then measure: from the demand to the opposite zone there is far more than 3x the stop. Step 2 passes.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            }
          ],
          lines: [
            {
              y: 132.46,
              label: "buy limit",
              kind: "entry",
              from: 10
            },
            {
              y: 177.26,
              label: "TP",
              kind: "tp",
              from: 10
            },
            {
              y: 131.11,
              label: "stop",
              kind: "sl",
              from: 10
            }
          ],
          reveal: 16
        }
      },
      {
        title: "Steps 3-5: trend, account, entry",
        narration: "Price respects the demand and keeps rising, so it is trending: you may hold. The pair suits a small account at 0.01 lots. Entry type: a pullback buy limit on a strong zone.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            }
          ],
          lines: [
            {
              y: 132.46,
              label: "buy limit",
              kind: "entry",
              from: 10
            },
            {
              y: 177.26,
              label: "TP",
              kind: "tp",
              from: 10
            },
            {
              y: 131.11,
              label: "stop",
              kind: "sl",
              from: 10
            }
          ],
          reveal: 20
        }
      },
      {
        title: "Step 6: structure",
        narration: "Price keeps making impulses up and small pauses. That is a clear buying structure. If it started meshing, he would wait.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            },
            {
              from: 22,
              top: 146.31,
              bottom: 145.48,
              kind: "demand",
              label: "zone 1"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.71,
              kind: "demand",
              label: "zone 2"
            }
          ],
          lines: [
            {
              y: 132.46,
              label: "buy limit",
              kind: "entry",
              from: 10
            },
            {
              y: 177.26,
              label: "TP",
              kind: "tp",
              from: 10
            },
            {
              y: 131.11,
              label: "stop",
              kind: "sl",
              from: 10
            }
          ],
          reveal: 30
        }
      },
      {
        title: "Step 7: swing stop, one zone as buffer",
        narration: "Two new demands have formed. Move the stop under the second-latest one (zone 1), not the latest. A reversal needs a line cross, one zone removed, then a second, so one zone stays as a buffer.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            },
            {
              from: 22,
              top: 146.31,
              bottom: 145.48,
              kind: "demand",
              label: "zone 1"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.71,
              kind: "demand",
              label: "zone 2"
            }
          ],
          lines: [
            {
              y: 132.46,
              label: "buy limit",
              kind: "entry",
              from: 10
            },
            {
              y: 177.26,
              label: "TP",
              kind: "tp",
              from: 10
            },
            {
              y: 145.08,
              label: "stop: 2nd-latest zone",
              kind: "sl",
              from: 29
            }
          ],
          reveal: 30
        }
      },
      {
        title: "Keep stepping the stop up",
        narration: "Zone 3 forms. Now the second-latest is zone 2, so the stop moves under zone 2. Price reaches the opposite zone.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            },
            {
              from: 22,
              top: 146.31,
              bottom: 145.48,
              kind: "demand",
              label: "zone 1"
            },
            {
              from: 27,
              top: 154.38,
              bottom: 153.71,
              kind: "demand",
              label: "zone 2"
            },
            {
              from: 32,
              top: 162.34,
              bottom: 161.46,
              kind: "demand",
              label: "zone 3"
            }
          ],
          lines: [
            {
              y: 132.46,
              label: "buy limit",
              kind: "entry",
              from: 10
            },
            {
              y: 177.26,
              label: "TP",
              kind: "tp",
              from: 10
            },
            {
              y: 145.08,
              label: "stop",
              kind: "sl",
              from: 29
            },
            {
              y: 153.31,
              label: "stop moved",
              kind: "sl",
              from: 34
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put Raja's seven steps in order.",
        items: [
          "Timeframe",
          "Risk management (profit margin)",
          "Condition: ranging or trending",
          "Equity and instrument",
          "Entry type",
          "Structure",
          "Exit plan"
        ],
        explain: "Timeframe, margin, condition, equity, entry, structure, exit."
      },
      {
        type: "spot",
        q: "Zone 3 has just formed. Click the zone your swing stop goes under now.",
        scene: {
          candles: [
            { o: 168, h: 174.2, l: 167.78, c: 173.63 },
            { o: 173.63, h: 178.2, l: 173.29, c: 178 },
            { o: 178, h: 178.48, l: 177.48, c: 177.72 },
            { o: 177.72, h: 178.49, l: 177.26, c: 178.17 },
            { o: 178.17, h: 178.8, l: 170.4, c: 170.63 },
            { o: 170.63, h: 170.99, l: 159.56, c: 160.87 },
            { o: 160.87, h: 161.7, l: 153.41, c: 154.11 },
            { o: 154.11, h: 154.52, l: 147.32, c: 147.6 },
            { o: 147.6, h: 148.32, l: 138.7, c: 138.96 },
            { o: 138.96, h: 139.44, l: 131.34, c: 132 },
            { o: 132, h: 132.2, l: 131.51, c: 131.98 },
            { o: 131.98, h: 132.46, l: 131.65, c: 131.93 },
            { o: 131.93, h: 132.19, l: 131.55, c: 131.91 },
            { o: 131.91, h: 135.27, l: 131.57, c: 135.14 },
            { o: 135.14, h: 139.43, l: 134.91, c: 139.16 },
            { o: 139.16, h: 142.09, l: 138.83, c: 142 },
            { o: 142, h: 142.49, l: 138.06, c: 138.44 },
            { o: 138.44, h: 138.81, l: 134.9, c: 135.19 },
            { o: 135.19, h: 135.51, l: 132.54, c: 132.86 },
            { o: 132.86, h: 134.46, l: 132.06, c: 134.26 },
            { o: 134.26, h: 140.75, l: 133.64, c: 140.47 },
            { o: 140.47, h: 146.6, l: 140.14, c: 146 },
            { o: 146, h: 146.31, l: 145.54, c: 145.71 },
            { o: 145.71, h: 146.2, l: 145.48, c: 145.95 },
            { o: 145.95, h: 148.96, l: 145.67, c: 148.73 },
            { o: 148.73, h: 151.15, l: 148.46, c: 150.92 },
            { o: 150.92, h: 154.13, l: 150.62, c: 154 },
            { o: 154, h: 154.28, l: 153.81, c: 154.01 },
            { o: 154.01, h: 154.38, l: 153.71, c: 154.14 },
            { o: 154.14, h: 156.87, l: 153.85, c: 156.7 },
            { o: 156.7, h: 159.78, l: 156.3, c: 159.61 },
            { o: 159.61, h: 162.18, l: 159.48, c: 162 },
            { o: 162, h: 162.34, l: 161.56, c: 161.72 },
            { o: 161.72, h: 162.25, l: 161.46, c: 161.88 },
            { o: 161.88, h: 167.64, l: 161.57, c: 166.94 },
            { o: 166.94, h: 172.74, l: 166.73, c: 172.05 },
            { o: 172.05, h: 177.43, l: 171.73, c: 176.96 }
          ],
          zones: [
            {
              from: 2,
              top: 178.49,
              bottom: 177.26,
              kind: "supply",
              label: "opposite zone (target)"
            },
            {
              from: 10,
              top: 132.46,
              bottom: 131.51,
              kind: "demand",
              label: "strong demand"
            }
          ],
          reveal: 35
        },
        answer: {
          from: 27,
          to: 28
        },
        explain: "The stop goes under the second-latest zone, which is zone 2. Zone 3 is the buffer."
      },
      {
        type: "mcq",
        q: "You have a $100 account. Which should you avoid?",
        options: [
          "EURUSD at 0.01",
          "Bitcoin",
          "A small-spread coin like ADA",
          "NAS at a small size"
        ],
        answer: 1,
        explain: "Bitcoin has big moves and a big spread. Even with $1,000 he advises against it."
      },
      {
        type: "tf",
        q: "A range trade can be held long term like a trend trade.",
        answer: false,
        explain: "In a range you cannot hold long term. Only trend trades are held."
      },
      {
        type: "mcq",
        q: "Which entry is meant for holding long term?",
        options: [
          "Breakout via H1 demand",
          "Flip area with confirmation",
          "Any 1-minute zone",
          "Market order on news"
        ],
        answer: 1,
        explain: "The breakout entry is short-term. The flip area entry, with confirmation, is for holding long term."
      },
      {
        type: "tf",
        q: "If price is meshing with no structure, wait.",
        answer: true,
        explain: "No structure means you cannot know which side to take. Stay out."
      }
    ],
    practice: [
      {
        prompt: "The demand was tested once and now price chops up and down with no shape. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.28, l: 143.6, c: 144.32 },
            { o: 144.32, h: 144.99, l: 138.78, c: 139.2 },
            { o: 139.2, h: 139.75, l: 132.62, c: 133.13 },
            { o: 133.13, h: 133.75, l: 127.37, c: 128 },
            { o: 128, h: 128.82, l: 127.76, c: 128.35 },
            { o: 128.35, h: 128.71, l: 127.84, c: 128.13 },
            { o: 128.13, h: 128.49, l: 127.6, c: 128.02 },
            { o: 128.02, h: 132.16, l: 127.8, c: 131.71 },
            { o: 131.71, h: 135.98, l: 131.22, c: 135.6 },
            { o: 135.6, h: 140.47, l: 135.06, c: 140 },
            { o: 140, h: 140.28, l: 136.59, c: 137 },
            { o: 137, h: 137.45, l: 133.17, c: 133.39 },
            { o: 133.39, h: 133.89, l: 128.75, c: 129.22 },
            { o: 129.22, h: 130.52, l: 128.42, c: 130.32 },
            { o: 130.32, h: 132.81, l: 129.73, c: 132.31 },
            { o: 132.31, h: 133.07, l: 132.18, c: 132.96 },
            { o: 132.96, h: 133.29, l: 130.89, c: 131.44 },
            { o: 131.44, h: 135.68, l: 130.67, c: 135.04 },
            { o: 135.04, h: 135.52, l: 132.47, c: 133.13 },
            { o: 133.13, h: 135.53, l: 132.57, c: 135 },
            { o: 135, h: 135.15, l: 134.85, c: 134.98 },
            { o: 134.98, h: 135.14, l: 134.03, c: 134.29 },
            { o: 134.29, h: 134.41, l: 134.2, c: 134.31 },
            { o: 134.31, h: 134.48, l: 134.05, c: 134.23 },
            { o: 134.23, h: 134.46, l: 133.81, c: 134 }
          ],
          zones: [
            {
              from: 4,
              top: 128.82,
              bottom: 127.6,
              kind: "demand",
              label: "tested demand"
            }
          ],
          highlight: {
            from: 14,
            to: 19,
            label: "meshing"
          },
          reveal: 20
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Step 6 fails: there is no structure. A tested zone with price meshing above it gives no clear side. It kept chopping. Waiting was right."
      },
      {
        prompt: "A fresh strong demand with about 3.77x room to the opposite supply. Price is back at it. Pick your entry, stop and target.",
        scene: {
          candles: [
            { o: 180, h: 181.88, l: 179.94, c: 181.76 },
            { o: 181.76, h: 184.09, l: 181.55, c: 184 },
            { o: 184, h: 184.25, l: 183.57, c: 183.95 },
            { o: 183.95, h: 184.29, l: 183.47, c: 183.9 },
            { o: 183.9, h: 184.38, l: 178.14, c: 178.68 },
            { o: 178.68, h: 179.27, l: 172.52, c: 173.28 },
            { o: 173.28, h: 173.99, l: 164.82, c: 165.1 },
            { o: 165.1, h: 165.5, l: 157.13, c: 157.76 },
            { o: 157.76, h: 158.52, l: 148.93, c: 150 },
            { o: 150, h: 150.9, l: 149.03, c: 149.96 },
            { o: 149.96, h: 150.51, l: 149.17, c: 149.95 },
            { o: 149.95, h: 151.07, l: 149.19, c: 150.34 },
            { o: 150.34, h: 154.58, l: 150.14, c: 154.15 },
            { o: 154.15, h: 157.57, l: 153.97, c: 157.36 },
            { o: 157.36, h: 160.86, l: 156.91, c: 160.61 },
            { o: 160.61, h: 160.88, l: 160.39, c: 160.52 },
            { o: 160.52, h: 160.88, l: 160.28, c: 160.7 },
            { o: 160.7, h: 160.84, l: 158.47, c: 158.57 },
            { o: 158.57, h: 158.87, l: 155.85, c: 156 },
            { o: 156, h: 156.19, l: 153.92, c: 154.06 },
            { o: 154.06, h: 154.37, l: 151.22, c: 151.47 },
            { o: 151.47, h: 152.77, l: 150.36, c: 152.57 },
            { o: 152.57, h: 154.61, l: 152.32, c: 154.51 },
            { o: 154.51, h: 156.88, l: 154.36, c: 156.8 },
            { o: 156.8, h: 158.75, l: 156.72, c: 158.66 },
            { o: 158.66, h: 160.65, l: 158.53, c: 160.58 }
          ],
          zones: [
            {
              from: 9,
              top: 151.07,
              bottom: 149.03,
              kind: "demand",
              label: "strong demand"
            },
            {
              from: 15,
              top: 160.88,
              bottom: 160.28,
              kind: "supply",
              label: "opposite zone"
            }
          ],
          reveal: 21
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 151.07,
          sl: 148.63,
          tp: 160.28
        },
        explain: "Pullback entry: buy limit at the top of the demand, stop under it, fixed TP at the opposite zone. The margin is well over 2x. Price bounced and reached the supply."
      }
    ],
    cards: [
      {
        front: "Step 1?",
        back: "Pick the timeframe you follow for direction. Enter lower."
      },
      {
        front: "Step 2?",
        back: "Profit margin at least 2x, ideally 3x the stop."
      },
      {
        front: "Step 3?",
        back: "Ranging or trending? Hold only in a trend."
      },
      {
        front: "Step 5: three entries?",
        back: "Pullback limit, breakout (H1 demand above the H1 line), flip area with confirmation."
      },
      {
        front: "Step 6: meshing?",
        back: "No structure = no trade."
      },
      {
        front: "Step 7: swing stop?",
        back: "Under the second-latest zone, keeping one zone as a buffer."
      },
      {
        front: "Marry one pair?",
        back: "No. Pick whichever pair is easiest and trending."
      }
    ],
    mnemonic: "Time, Margin, Condition, Equity, Entry, Structure, Exit: \"Tiny Mice Can Eat Every Small Egg\"."
  },
  {
    mentor: "raja",
    n: 54,
    eli5: {
      oneLiner: "A real break needs one big candle closing through the line.",
      story: "A fence keeps the sheep in the field. A few lambs squeeze their heads through the gaps and pull back. That is not an escape. Then one big ram smashes right through and keeps going. That is a real break, and now the flock can follow.",
      analogy: "Small candles drifting across the line are lambs poking their heads through. The departure candle is the ram smashing the fence."
    },
    bigIdeas: [
      "Direction and target from monthly/weekly; entry on a fresh 15m zone; 5m only as confirmation.",
      "A trendline is broken only by a big departure candle closing beyond it. Small drifting candles do not count.",
      "Long, lengthy candles are not a base. Do not buy into a supply that has not been removed."
    ],
    steps: [
      {
        title: "A downtrend line",
        narration: "Price is falling along a descending trendline with lower highs.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 9,
              y2: 162.68,
              label: "trendline"
            }
          ],
          reveal: 10
        }
      },
      {
        title: "Small candles drift across: no break",
        narration: "A string of small candles creeps across the line. There is no departure candle, so Raja waits. Soon price falls back.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 146.4,
              label: "trendline",
              broken: true
            }
          ],
          highlight: {
            from: 10,
            to: 13,
            label: "small drifting candles"
          },
          reveal: 16
        }
      },
      {
        title: "The departure candle",
        narration: "Now one big, full-bodied candle closes well above the line. That is a proper departure candle. Direction can change.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 146.4,
              label: "trendline",
              broken: true
            }
          ],
          highlight: {
            from: 19,
            to: 19,
            label: "departure candle"
          },
          reveal: 20
        }
      },
      {
        title: "A fresh 15m demand above the line",
        narration: "Right after the break, price builds a small fresh demand above the line. On the 15m this is the entry zone. Use the 5m only as a backup confirmation.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 146.4,
              label: "trendline",
              broken: true
            }
          ],
          zones: [
            {
              from: 20,
              top: 153.15,
              bottom: 152.53,
              kind: "demand",
              label: "fresh 15m demand"
            }
          ],
          lines: [
            {
              y: 153.15,
              label: "buy",
              kind: "entry",
              from: 20
            },
            {
              y: 152.13,
              label: "stop",
              kind: "sl",
              from: 20
            }
          ],
          reveal: 28
        }
      },
      {
        title: "Target from the HTF, entry from the LTF",
        narration: "Price retests the fresh demand and moves up. Find the target from the high timeframe; use the low timeframe for the entry.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 146.4,
              label: "trendline",
              broken: true
            }
          ],
          zones: [
            {
              from: 20,
              top: 153.15,
              bottom: 152.53,
              kind: "demand",
              label: "fresh 15m demand"
            }
          ],
          lines: [
            {
              y: 153.15,
              label: "buy",
              kind: "entry",
              from: 20
            },
            {
              y: 152.13,
              label: "stop",
              kind: "sl",
              from: 20
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the departure candle that really breaks the trendline.",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.28, l: 167.13, c: 167.37 },
            { o: 167.37, h: 167.65, l: 163.92, c: 164.22 },
            { o: 164.22, h: 164.63, l: 159.51, c: 160 },
            { o: 160, h: 162.83, l: 159.3, c: 162.06 },
            { o: 162.06, h: 164.26, l: 161.7, c: 163.71 },
            { o: 163.71, h: 165.36, l: 163.42, c: 165 },
            { o: 165, h: 165.64, l: 159.1, c: 159.49 },
            { o: 159.49, h: 160.14, l: 154.32, c: 154.64 },
            { o: 154.64, h: 155.17, l: 149.57, c: 150 },
            { o: 150, h: 151.56, l: 149.64, c: 151.19 },
            { o: 151.19, h: 153.71, l: 150.88, c: 153.17 },
            { o: 153.17, h: 155.17, l: 152.72, c: 154.82 },
            { o: 154.82, h: 158.33, l: 154.05, c: 157.36 },
            { o: 157.36, h: 157.51, l: 152.93, c: 153.21 },
            { o: 153.21, h: 153.38, l: 148.55, c: 149 },
            { o: 149, h: 149.37, l: 148.83, c: 149.11 },
            { o: 149.11, h: 149.39, l: 148.61, c: 148.84 },
            { o: 148.84, h: 149.26, l: 148.49, c: 149.02 },
            { o: 149.02, h: 153.36, l: 148.81, c: 152.88 },
            { o: 152.88, h: 153.13, l: 152.58, c: 152.98 },
            { o: 152.98, h: 153.15, l: 152.53, c: 152.84 },
            { o: 152.84, h: 155.94, l: 152.49, c: 155.67 },
            { o: 155.67, h: 157.77, l: 155.5, c: 157.52 },
            { o: 157.52, h: 159.96, l: 157.35, c: 159.84 },
            { o: 159.84, h: 160.02, l: 157.27, c: 157.56 },
            { o: 157.56, h: 157.77, l: 155.38, c: 155.57 },
            { o: 155.57, h: 155.85, l: 153.4, c: 153.55 },
            { o: 153.55, h: 155.15, l: 152.9, c: 154.95 },
            { o: 154.95, h: 158.09, l: 154.75, c: 157.97 },
            { o: 157.97, h: 161.45, l: 157.65, c: 161.18 },
            { o: 161.18, h: 164.06, l: 161.01, c: 163.76 },
            { o: 163.76, h: 167.32, l: 163.44, c: 166.95 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 146.4,
              label: "trendline",
              broken: true
            }
          ]
        },
        answer: {
          from: 19,
          to: 19
        },
        explain: "This single big candle closes far beyond the line. The small candles earlier only drifted across."
      },
      {
        type: "tf",
        q: "Many small candles slowly crossing the trendline is a proper break.",
        answer: false,
        explain: "Without a departure candle, wait. Small candles drifting across do not count."
      },
      {
        type: "mcq",
        q: "Which chart does Raja prefer for entries in these reviews?",
        options: [
          "1 minute",
          "15 minute, with 5 minute as backup",
          "Monthly",
          "Weekly"
        ],
        answer: 1,
        explain: "15m is easy to read. 5m is a backup confirmation. 1m is risky and gives poor signals."
      },
      {
        type: "order",
        q: "Order the top-down routine.",
        items: [
          "Monthly / weekly: direction and target",
          "Daily / H4: trendline and zones",
          "15m: fresh zone for the entry",
          "5m: confirmation if needed"
        ],
        explain: "Target from the high timeframe, entry from the low timeframe."
      },
      {
        type: "tf",
        q: "A zone made of long, lengthy candles is a good basing zone.",
        answer: false,
        explain: "Long, lengthy candles are not basing. Only the real base of small candles is a zone."
      },
      {
        type: "mcq",
        q: "The supply above has just been removed. What do you look for?",
        options: [
          "Only sells",
          "Only buys",
          "Both",
          "Nothing"
        ],
        answer: 1,
        explain: "If the supply above is removed, look only for buys."
      }
    ],
    practice: [
      {
        prompt: "Small candles have drifted just above the down trendline. No big candle has closed through it. Buy now?",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.39, l: 166.92, c: 167.32 },
            { o: 167.32, h: 167.63, l: 162.91, c: 163.24 },
            { o: 163.24, h: 163.44, l: 159.63, c: 160 },
            { o: 160, h: 161.44, l: 159.75, c: 161.17 },
            { o: 161.17, h: 163.37, l: 160.78, c: 162.86 },
            { o: 162.86, h: 165.42, l: 162.52, c: 165 },
            { o: 165, h: 165.38, l: 159.7, c: 160.02 },
            { o: 160.02, h: 160.65, l: 154.01, c: 154.6 },
            { o: 154.6, h: 155.1, l: 149.46, c: 150 },
            { o: 150, h: 152.81, l: 149.16, c: 152.15 },
            { o: 152.15, h: 154.07, l: 151.56, c: 153.78 },
            { o: 153.78, h: 155.38, l: 153.41, c: 155.15 },
            { o: 155.15, h: 157.48, l: 154.55, c: 156.88 },
            { o: 156.88, h: 157.38, l: 151.95, c: 152.47 },
            { o: 152.47, h: 152.72, l: 147.83, c: 148.36 },
            { o: 148.36, h: 148.55, l: 144.3, c: 144.52 },
            { o: 144.52, h: 144.91, l: 140.77, c: 141 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 14,
              y2: 154.76,
              label: "trendline",
              broken: true
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "No departure candle, no break. The drift was just meshing around the line. Price fell again."
      },
      {
        prompt: "A big departure candle closed above the down trendline and a fresh 15m demand formed above it. Price is back at that demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 172, h: 176, l: 171.4, c: 171.8 },
            { o: 171.8, h: 172.27, l: 167.76, c: 168.15 },
            { o: 168.15, h: 168.28, l: 163.64, c: 164.04 },
            { o: 164.04, h: 164.41, l: 159.59, c: 160 },
            { o: 160, h: 162.41, l: 159.41, c: 162.07 },
            { o: 162.07, h: 163.47, l: 161.83, c: 163.28 },
            { o: 163.28, h: 165.38, l: 162.87, c: 165 },
            { o: 165, h: 165.25, l: 158.13, c: 158.93 },
            { o: 158.93, h: 159.25, l: 154.19, c: 154.5 },
            { o: 154.5, h: 154.7, l: 149.64, c: 150 },
            { o: 150, h: 152.45, l: 149.61, c: 151.97 },
            { o: 151.97, h: 154.24, l: 151.63, c: 153.71 },
            { o: 153.71, h: 155.81, l: 153.28, c: 155.48 },
            { o: 155.48, h: 156.92, l: 155.21, c: 156.64 },
            { o: 156.64, h: 156.92, l: 153.32, c: 153.42 },
            { o: 153.42, h: 153.61, l: 148.67, c: 149 },
            { o: 149, h: 149.58, l: 148.67, c: 149.34 },
            { o: 149.34, h: 149.54, l: 148.41, c: 148.78 },
            { o: 148.78, h: 149.14, l: 148.59, c: 148.97 },
            { o: 148.97, h: 152.12, l: 148.69, c: 151.82 },
            { o: 151.82, h: 152.06, l: 151.4, c: 151.61 },
            { o: 151.61, h: 152.19, l: 151.37, c: 151.92 },
            { o: 151.92, h: 154.25, l: 151.75, c: 154.04 },
            { o: 154.04, h: 156.64, l: 153.91, c: 156.51 },
            { o: 156.51, h: 159, l: 156.28, c: 158.92 },
            { o: 158.92, h: 159.08, l: 156.59, c: 156.66 },
            { o: 156.66, h: 156.8, l: 154.15, c: 154.46 },
            { o: 154.46, h: 154.65, l: 152.36, c: 152.59 },
            { o: 152.59, h: 154.19, l: 151.86, c: 153.99 },
            { o: 153.99, h: 157.48, l: 153.89, c: 157.12 },
            { o: 157.12, h: 159.88, l: 156.95, c: 159.74 },
            { o: 159.74, h: 162.86, l: 159.6, c: 162.57 },
            { o: 162.57, h: 166.18, l: 162.32, c: 165.99 }
          ],
          trendlines: [
            {
              x1: 0,
              y1: 176,
              x2: 20,
              y2: 145.29,
              label: "trendline",
              broken: true
            }
          ],
          zones: [
            {
              from: 20,
              top: 152.19,
              bottom: 151.37,
              kind: "demand",
              label: "fresh 15m demand"
            }
          ],
          reveal: 28
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "A proper departure candle broke the line and the fresh demand sits on the right side of it. Buy on the retest. Price moved up."
      }
    ],
    cards: [
      {
        front: "Departure candle?",
        back: "A big full-bodied candle that closes beyond the trendline."
      },
      {
        front: "Small candles drifting across?",
        back: "Not a break. Wait."
      },
      {
        front: "Entry chart?",
        back: "15 minute. 5 minute only as confirmation."
      },
      {
        front: "1 minute for confirmation?",
        back: "Risky. Poor signals."
      },
      {
        front: "Long, lengthy candles?",
        back: "Not a base."
      },
      {
        front: "Supply above removed?",
        back: "Look only for buys."
      }
    ],
    mnemonic: "Lambs poke, the ram breaks."
  }
];
