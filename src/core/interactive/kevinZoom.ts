// Interactive teaching layer for kevin-zoom (Kevin's 13 Sunday Zoom sessions, see zoomSessions.ts).
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Zones wrap the basing candles
// (demand: top = highest basing body = proximal, bottom = lowest basing wick = distal; supply mirrored).
// Trendlines start at the extreme point and slide to the next point if they would cut a candle; a line is
// removed by the first candle fully beyond it. Practice outcomes after scene.reveal are consistent with the answer.
import type { InteractiveLesson } from './types';

export const IL_KEVINZOOM: InteractiveLesson[] = [
  {
    mentor: "kevin-zoom",
    n: 1,
    eli5: {
      oneLiner: "Draw a zone only if it broke a zone, a line, or a record.",
      story: "Imagine a tug of war. One team pulls the rope past a line on the ground. That pull was strong, so we remember where it started. A soft little tug that moved nothing? We forget it. On a chart we only mark the spots where a strong pull broke something.",
      analogy: "A zone is like a player who scored a goal. We only write down players who scored: they beat the other team (opposing zone), broke the fence (trendline), or set a new record (all-time high or low)."
    },
    bigIdeas: [
      "Draw a zone only if it removed an opposing zone, removed a trendline, or made an all-time high or low.",
      "Trendlines start at the most recent peak or valley and never cut through candles. Only a full candle beyond the line removes it.",
      "The best zone: basing, an explosive candle, then another explosive candle. The stop goes a little beyond the zone, wider when a bigger zone sits behind it."
    ],
    steps: [
      {
        title: "A zone must do a job",
        narration: "In chain analysis we only draw a zone if it did one job: it removed an opposing zone, it removed a trendline, or it made an all-time high or low. One job is enough. If nothing did a job, we draw nothing.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" }
          ]
        }
      },
      {
        title: "Valley, peak, lower low",
        narration: "Price fell to a valley, bounced to a lower peak, then broke below the valley. That lower low is the signal: now there is a downtrend line to draw.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" },
            { x: 6, y: 153.87, text: "valley" },
            { x: 9, y: 162.8, text: "peak" },
            { x: 14, y: 147.78, text: "lower low" }
          ]
        }
      },
      {
        title: "Anchor at the top, touch the peak",
        narration: "Draw from the highest point to the most recent peak, never from a random spot. If the line would cut through candles, slide it to the next highest point that cuts nothing.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 16, y2: 155.9, label: "downtrend line" }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" },
            { x: 6, y: 153.87, text: "valley" },
            { x: 9, y: 162.8, text: "peak" },
            { x: 14, y: 147.78, text: "lower low" }
          ]
        }
      },
      {
        title: "A wick touch is not a removal",
        narration: "The explosive candle pokes the line, but part of it still touches. The line is only removed by the first candle that sits fully above it, body and wick.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 },
            { o: 148.91, h: 156.58, l: 148.69, c: 156.41 },
            { o: 156.41, h: 162.01, l: 156.16, c: 161.91 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.16, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" },
            { x: 6, y: 153.87, text: "valley" },
            { x: 9, y: 162.8, text: "peak" },
            { x: 14, y: 147.78, text: "lower low" },
            { x: 17, y: 157.38, text: "still touching" },
            { x: 18, y: 162.81, text: "fully above = removed" }
          ]
        }
      },
      {
        title: "The demand that removed the line",
        narration: "Go to where the move started: the little basing candles. Box them. The first candle out must be explosive, and here a second explosive candle follows. Kevin loves that: it shows a lot of demand.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 },
            { o: 148.91, h: 156.58, l: 148.69, c: 156.41 },
            { o: 156.41, h: 162.01, l: 156.16, c: 161.91 },
            { o: 161.91, h: 164.28, l: 161.23, c: 163.74 },
            { o: 163.74, h: 165.8, l: 163.19, c: 165.14 },
            { o: 165.14, h: 167.07, l: 164.52, c: 166.41 }
          ],
          zones: [
            { from: 15, to: 21, top: 149.1, bottom: 148.53, kind: "demand", label: "demand: removed the trendline" }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.16, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" },
            { x: 6, y: 153.87, text: "valley" },
            { x: 9, y: 162.8, text: "peak" },
            { x: 14, y: 147.78, text: "lower low" },
            { x: 17, y: 157.38, text: "still touching" },
            { x: 18, y: 162.81, text: "fully above = removed" },
            { x: 17, y: 147.89, text: "explosive" },
            { x: 18, y: 155.36, text: "explosive again" }
          ],
          highlight: { from: 15, to: 16, label: "basing" }
        }
      },
      {
        title: "Stop a little beyond the zone",
        narration: "When price comes back, the stop goes a little beyond the zone, placed by eye. Give the trade wiggle room. Wider on gold, oil and news-heavy weeks.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 },
            { o: 148.91, h: 156.58, l: 148.69, c: 156.41 },
            { o: 156.41, h: 162.01, l: 156.16, c: 161.91 },
            { o: 161.91, h: 164.28, l: 161.23, c: 163.74 },
            { o: 163.74, h: 165.8, l: 163.19, c: 165.14 },
            { o: 165.14, h: 167.07, l: 164.52, c: 166.41 },
            { o: 166.41, h: 167.05, l: 162.05, c: 162.51 },
            { o: 162.51, h: 163.18, l: 159.55, c: 160.1 },
            { o: 160.1, h: 160.38, l: 157.28, c: 157.82 },
            { o: 157.82, h: 158.49, l: 153.77, c: 154.04 },
            { o: 154.04, h: 154.73, l: 151.02, c: 151.3 },
            { o: 151.3, h: 151.48, l: 148.8, c: 149.7 },
            { o: 149.7, h: 151.27, l: 149.1, c: 151.03 },
            { o: 151.03, h: 153.46, l: 150.69, c: 152.83 },
            { o: 152.83, h: 154.78, l: 152.48, c: 154.5 },
            { o: 154.5, h: 157.37, l: 154.16, c: 156.72 },
            { o: 156.72, h: 158.96, l: 156.19, c: 158.69 },
            { o: 158.69, h: 161.17, l: 158.33, c: 160.7 }
          ],
          zones: [
            { from: 15, to: 33, top: 149.1, bottom: 148.53, kind: "demand", label: "demand: removed the trendline" }
          ],
          lines: [
            { y: 149.1, label: "entry", kind: "entry", from: 15 },
            { y: 147.93, label: "stop a little beyond", kind: "sl", from: 15 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.16, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 168.9, text: "start high" },
            { x: 6, y: 153.87, text: "valley" },
            { x: 9, y: 162.8, text: "peak" },
            { x: 14, y: 147.78, text: "lower low" },
            { x: 17, y: 157.38, text: "still touching" },
            { x: 18, y: 162.81, text: "fully above = removed" },
            { x: 17, y: 147.89, text: "explosive" },
            { x: 18, y: 155.36, text: "explosive again" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which of these lets a zone go on the chain-analysis chart?",
        options: [
          "It removed an opposing zone, a trendline, or made an all-time high/low",
          "It has three basing candles",
          "Price bounced from it twice",
          "It sits on a round number"
        ],
        answer: 0,
        explain: "The zone must accomplish something. Those three jobs are the only reasons to draw it, and one of them is enough."
      },
      {
        type: "tf",
        q: "A zone must do all three jobs (remove a zone, remove a trendline and make an all-time high) to count.",
        answer: false,
        explain: "Only ONE of the three is needed. A zone that does two is a \"double whammy\", but one is enough."
      },
      {
        type: "spot",
        q: "Click the candle that REMOVED the downtrend line.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 },
            { o: 148.91, h: 156.58, l: 148.69, c: 156.41 },
            { o: 156.41, h: 162.01, l: 156.16, c: 161.91 },
            { o: 161.91, h: 164.28, l: 161.23, c: 163.74 },
            { o: 163.74, h: 165.8, l: 163.19, c: 165.14 },
            { o: 165.14, h: 167.07, l: 164.52, c: 166.41 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 21, y2: 151.54, label: "downtrend line" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "Earlier candles still touch the line with a wick or body. The removal is the first candle that sits fully above the line."
      },
      {
        type: "mcq",
        q: "Your trendline from the highest point cuts through a couple of candles. What do you do?",
        options: [
          "Move it to the next highest point that cuts nothing",
          "Keep it, a few cuts are fine",
          "Start it from any point that looks nice",
          "Skip trendlines on this chart"
        ],
        answer: 0,
        explain: "Trendlines never cut through candles. Slide the anchor to the next highest point, still touching the peak."
      },
      {
        type: "order",
        q: "Put the downtrend line steps in order.",
        items: [
          "Price makes a high",
          "It falls to a valley",
          "It bounces to a lower peak",
          "It breaks below the valley (lower low)",
          "Draw the line from the high to the peak"
        ],
        explain: "No lower low, no trendline. The line goes from the high to the most recent peak."
      },
      {
        type: "mcq",
        q: "Two zones both have an explosive first candle. Zone A has another explosive candle right after. Zone B bases again before moving. Which does Kevin prefer?",
        options: [
          "Zone A",
          "Zone B",
          "They are exactly the same",
          "Neither qualifies"
        ],
        answer: 0,
        explain: "Both qualify, but an explosive move followed by another explosive move tells him there is a lot of demand. Zone B \"kind of based out\"."
      },
      {
        type: "tf",
        q: "A zone that was already tested before it removed anything is still drawn, but it is not a trading setup.",
        answer: true,
        explain: "It still belongs on the chart so you can see what removes it later, but a zone tested before it qualified is not a trade."
      },
      {
        type: "mcq",
        q: "Your 4H demand sits at the proximal line of a daily demand. Where does the stop go?",
        options: [
          "About halfway into the daily zone",
          "Just under the 4H zone, as normal",
          "Under the whole daily zone",
          "No stop needed"
        ],
        answer: 0,
        explain: "A normal stop gives the daily no room. Below the whole daily, you might as well trade the daily. Halfway is the middle ground."
      }
    ],
    practice: [
      {
        prompt: "This demand removed the downtrend line, and the first candle out was explosive (twice!). Price is drifting back. Pick your entry, stop and target.",
        scene: {
          candles: [
            { o: 164, h: 166.06, l: 163.31, c: 165.6 },
            { o: 165.6, h: 167.18, l: 165.26, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.33, l: 162.9, c: 163.34 },
            { o: 163.34, h: 163.61, l: 160.11, c: 160.51 },
            { o: 160.51, h: 160.83, l: 158.13, c: 158.41 },
            { o: 158.41, h: 158.85, l: 154.67, c: 154.9 },
            { o: 154.9, h: 157.2, l: 154.68, c: 156.9 },
            { o: 156.9, h: 160.03, l: 156.4, c: 159.62 },
            { o: 159.62, h: 162, l: 159.27, c: 161.4 },
            { o: 161.4, h: 161.96, l: 159.07, c: 159.5 },
            { o: 159.5, h: 160.09, l: 155.88, c: 156.58 },
            { o: 156.58, h: 156.9, l: 153.33, c: 153.91 },
            { o: 153.91, h: 154.19, l: 150.41, c: 150.77 },
            { o: 150.77, h: 151.18, l: 148.58, c: 148.9 },
            { o: 148.9, h: 149.52, l: 148.53, c: 149.1 },
            { o: 149.1, h: 149.38, l: 148.7, c: 148.91 },
            { o: 148.91, h: 156.58, l: 148.69, c: 156.41 },
            { o: 156.41, h: 162.01, l: 156.16, c: 161.91 },
            { o: 161.91, h: 164.28, l: 161.23, c: 163.74 },
            { o: 163.74, h: 165.8, l: 163.19, c: 165.14 },
            { o: 165.14, h: 167.07, l: 164.52, c: 166.41 },
            { o: 166.41, h: 167.05, l: 162.05, c: 162.51 },
            { o: 162.51, h: 163.18, l: 159.55, c: 160.1 },
            { o: 160.1, h: 160.38, l: 157.28, c: 157.82 },
            { o: 157.82, h: 158.49, l: 153.77, c: 154.04 },
            { o: 154.04, h: 154.73, l: 151.02, c: 151.3 },
            { o: 151.3, h: 151.48, l: 148.8, c: 149.7 },
            { o: 149.7, h: 151.27, l: 149.1, c: 151.03 },
            { o: 151.03, h: 153.46, l: 150.69, c: 152.83 },
            { o: 152.83, h: 154.78, l: 152.48, c: 154.5 },
            { o: 154.5, h: 157.37, l: 154.16, c: 156.72 },
            { o: 156.72, h: 158.96, l: 156.19, c: 158.69 },
            { o: 158.69, h: 161.17, l: 158.33, c: 160.7 }
          ],
          zones: [
            { from: 15, to: 21, top: 149.1, bottom: 148.53, kind: "demand", label: "demand" }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.16, label: "downtrend line", broken: true }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 149.25, sl: 147.93, tp: 153.21 },
        explain: "Buy just before the proximal line (149.25), stop a little beyond the zone (147.93). The zone did a job (removed the trendline) and had an explosive move then another explosive move. Price came back and pushed up to the 3:1 target."
      },
      {
        prompt: "The small 4-hour demand sits right on top of a bigger daily demand. Where does the stop go?",
        scene: {
          candles: [
            { o: 150, h: 150.63, l: 147.38, c: 147.85 },
            { o: 147.85, h: 148.09, l: 145.19, c: 145.66 },
            { o: 145.66, h: 146.16, l: 142.88, c: 143.31 },
            { o: 143.31, h: 143.75, l: 140.38, c: 141 },
            { o: 141, h: 142.27, l: 140.6, c: 141.87 },
            { o: 141.87, h: 142.12, l: 140.95, c: 141.23 },
            { o: 141.23, h: 142.39, l: 140.86, c: 142.08 },
            { o: 142.08, h: 149.16, l: 141.91, c: 149.08 },
            { o: 149.08, h: 152.25, l: 148.95, c: 152.08 },
            { o: 152.08, h: 153.47, l: 151.57, c: 153.11 },
            { o: 153.11, h: 154.44, l: 152.88, c: 154.11 },
            { o: 154.11, h: 155.65, l: 153.42, c: 155.08 },
            { o: 155.08, h: 155.57, l: 152.22, c: 152.84 },
            { o: 152.84, h: 153.11, l: 150.19, c: 150.81 },
            { o: 150.81, h: 151.42, l: 147.53, c: 147.92 },
            { o: 147.92, h: 148.13, l: 145.36, c: 145.6 },
            { o: 145.6, h: 146.22, l: 142.53, c: 142.98 },
            { o: 142.98, h: 143.47, l: 142.63, c: 143.19 },
            { o: 143.19, h: 147.89, l: 143.12, c: 147.69 },
            { o: 147.69, h: 150.07, l: 147.63, c: 149.89 },
            { o: 149.89, h: 151.49, l: 149.48, c: 150.8 },
            { o: 150.8, h: 152.32, l: 150.42, c: 151.89 },
            { o: 151.89, h: 152.24, l: 149.96, c: 150.44 },
            { o: 150.44, h: 150.81, l: 147.56, c: 148.18 },
            { o: 148.18, h: 148.46, l: 146.03, c: 146.29 },
            { o: 146.29, h: 146.81, l: 143.49, c: 144 },
            { o: 144, h: 144.2, l: 141.59, c: 142.43 },
            { o: 142.43, h: 143.97, l: 141.77, c: 143.56 },
            { o: 143.56, h: 145.59, l: 143.14, c: 145.1 },
            { o: 145.1, h: 147, l: 144.64, c: 146.65 },
            { o: 146.65, h: 149.32, l: 146.01, c: 149.12 },
            { o: 149.12, h: 151.81, l: 148.72, c: 151.46 },
            { o: 151.46, h: 153.69, l: 151.22, c: 153.43 }
          ],
          zones: [
            { from: 4, to: 21, top: 142.08, bottom: 140.6, kind: "demand", label: "daily demand" },
            { from: 17, to: 21, top: 143.19, bottom: 142.63, kind: "demand", label: "4H demand" }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 143.29, sl: 141.34, tp: 149.14 },
        explain: "Put the stop about halfway into the daily zone (141.34). A normal stop just under the 4H zone was wicked out, and a stop under the whole daily zone means you might as well trade the daily. Halfway gives the daily zone room to work."
      }
    ],
    cards: [
      { front: "What are the 3 jobs that let you draw a zone?", back: "Remove an opposing zone, remove a trendline, or make an all-time high/low. One is enough." },
      { front: "What does a downtrend line need before you draw it?", back: "A valley, a peak and then a lower low." },
      { front: "Where does a new trendline start?", back: "At the most recent peak (downtrend) or valley (uptrend), never a random point." },
      { front: "The line cuts through candles. Now what?", back: "Move to the next highest (or lowest) point that cuts nothing." },
      { front: "When is a trendline removed?", back: "When a candle sits fully beyond it, body and wick. A wick touch does not count." },
      { front: "What must the first candle after the basing be?", back: "Explosive. Every time." },
      { front: "What is the best-quality zone shape?", back: "Basing, an explosive candle, then another explosive candle." },
      { front: "Where does the stop go when a higher-timeframe zone sits under your zone?", back: "About halfway into the higher-timeframe zone." },
      { front: "One missed trendline costs what?", back: "Often one, two, three missed zones further down the chain." }
    ],
    mnemonic: "Zone, Line, or Record: no job, no zone."
  },
  {
    mentor: "kevin-zoom",
    n: 2,
    eli5: {
      oneLiner: "A zone counts only if its pause came before the break.",
      story: "Picture a fence in a yard. A dog sits quietly by the fence, then leaps over it. That dog broke the fence. Now picture a dog that was already on the other side and sat down there. It did not break anything. On a chart, the basing must happen while the fence still stands.",
      analogy: "Basing is the runner crouching at the start line. If the runner crouched after the race was already won, that crouch did not win anything."
    },
    bigIdeas: [
      "A removed zone or trendline does not automatically give a zone: there must be an explosive move away from basing.",
      "For a demand that removes a supply, the basing must form below the supply while it is still respected.",
      "End overextended trendlines and removed zones. Never stretch them across the chart."
    ],
    steps: [
      {
        title: "A supply is holding",
        narration: "Here is a supply zone. Sellers pushed price down hard from it. It stays on the chart until something removes it.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 }
          ],
          zones: [
            { from: 3, to: 8, top: 146.72, bottom: 146, kind: "supply", label: "supply" }
          ],
          highlight: { from: 3, to: 4, label: "basing" }
        }
      },
      {
        title: "Basing forms UNDER the supply",
        narration: "Price comes back, gets pushed away once, and sits in small basing candles below the supply. The supply is still being respected. This order matters.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 },
            { o: 134.99, h: 135.39, l: 133.39, c: 133.62 },
            { o: 133.62, h: 136.09, l: 133.28, c: 135.58 },
            { o: 135.58, h: 138.04, l: 135.21, c: 137.57 },
            { o: 137.57, h: 139.91, l: 137.17, c: 139.59 },
            { o: 139.59, h: 142.01, l: 139.3, c: 141.43 },
            { o: 141.43, h: 144.01, l: 140.94, c: 143.8 },
            { o: 143.8, h: 145.7, l: 143.2, c: 143.4 },
            { o: 143.4, h: 143.88, l: 143.17, c: 143.64 },
            { o: 143.64, h: 143.95, l: 143.12, c: 143.36 }
          ],
          zones: [
            { from: 3, to: 17, top: 146.72, bottom: 146, kind: "supply", label: "supply" }
          ],
          notes: [
            { x: 15, y: 146.6, text: "respected" }
          ],
          highlight: { from: 16, to: 17, label: "basing under supply" }
        }
      },
      {
        title: "Explosive move removes the supply",
        narration: "Then one big candle shoots up through the supply. Because the basing formed while the supply still held, this demand is the one that removed it. Rule 1: it removed an opposing zone.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 },
            { o: 134.99, h: 135.39, l: 133.39, c: 133.62 },
            { o: 133.62, h: 136.09, l: 133.28, c: 135.58 },
            { o: 135.58, h: 138.04, l: 135.21, c: 137.57 },
            { o: 137.57, h: 139.91, l: 137.17, c: 139.59 },
            { o: 139.59, h: 142.01, l: 139.3, c: 141.43 },
            { o: 141.43, h: 144.01, l: 140.94, c: 143.8 },
            { o: 143.8, h: 145.7, l: 143.2, c: 143.4 },
            { o: 143.4, h: 143.88, l: 143.17, c: 143.64 },
            { o: 143.64, h: 143.95, l: 143.12, c: 143.36 },
            { o: 143.36, h: 149.05, l: 143.23, c: 148.92 },
            { o: 148.92, h: 151.64, l: 148.86, c: 151.42 }
          ],
          zones: [
            { from: 3, to: 18, top: 146.72, bottom: 146, kind: "supply", label: "supply" },
            { from: 16, to: 19, top: 143.64, bottom: 143.12, kind: "demand", label: "demand: removed supply" }
          ],
          notes: [
            { x: 15, y: 146.6, text: "respected" },
            { x: 18, y: 142.33, text: "explosive" }
          ]
        }
      },
      {
        title: "If the basing sat above, no zone",
        narration: "If the basing (even a wick) had formed above the supply, the supply was already broken before the basing. Then that basing did not remove anything, and there is no zone.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 },
            { o: 134.99, h: 135.39, l: 133.39, c: 133.62 },
            { o: 133.62, h: 136.09, l: 133.28, c: 135.58 },
            { o: 135.58, h: 138.04, l: 135.21, c: 137.57 },
            { o: 137.57, h: 139.91, l: 137.17, c: 139.59 },
            { o: 139.59, h: 142.01, l: 139.3, c: 141.43 },
            { o: 141.43, h: 144.01, l: 140.94, c: 143.8 },
            { o: 143.8, h: 145.7, l: 143.2, c: 143.4 },
            { o: 143.4, h: 143.88, l: 143.17, c: 143.64 },
            { o: 143.64, h: 143.95, l: 143.12, c: 143.36 },
            { o: 143.36, h: 149.05, l: 143.23, c: 148.92 },
            { o: 148.92, h: 151.64, l: 148.86, c: 151.42 }
          ],
          zones: [
            { from: 3, to: 18, top: 146.72, bottom: 146, kind: "supply", label: "supply" },
            { from: 16, to: 19, top: 143.64, bottom: 143.12, kind: "demand", label: "demand: removed supply" }
          ],
          notes: [
            { x: 15, y: 146.6, text: "respected" },
            { x: 18, y: 142.33, text: "explosive" }
          ]
        }
      },
      {
        title: "Big candle, big wicks = basing",
        narration: "Size alone is not a move away. A full-bodied candle with tiny wicks is explosive. A large candle with big wicks on top and bottom is just a large basing candle. Some cases are gray: rules decide the obvious yes and no.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 },
            { o: 134.99, h: 135.39, l: 133.39, c: 133.62 },
            { o: 133.62, h: 136.09, l: 133.28, c: 135.58 },
            { o: 135.58, h: 138.04, l: 135.21, c: 137.57 },
            { o: 137.57, h: 139.91, l: 137.17, c: 139.59 },
            { o: 139.59, h: 142.01, l: 139.3, c: 141.43 },
            { o: 141.43, h: 144.01, l: 140.94, c: 143.8 },
            { o: 143.8, h: 145.7, l: 143.2, c: 143.4 },
            { o: 143.4, h: 143.88, l: 143.17, c: 143.64 },
            { o: 143.64, h: 143.95, l: 143.12, c: 143.36 },
            { o: 143.36, h: 149.05, l: 143.23, c: 148.92 },
            { o: 148.92, h: 151.64, l: 148.86, c: 151.42 },
            { o: 151.42, h: 153.09, l: 151.19, c: 152.68 },
            { o: 152.68, h: 154.2, l: 152.48, c: 153.62 },
            { o: 153.62, h: 154.63, l: 153.12, c: 154.42 },
            { o: 154.42, h: 154.89, l: 152.02, c: 152.5 },
            { o: 152.5, h: 153.18, l: 150.07, c: 150.65 },
            { o: 150.65, h: 150.98, l: 148.34, c: 148.84 },
            { o: 148.84, h: 149.44, l: 146.93, c: 147.27 },
            { o: 147.27, h: 147.95, l: 145.54, c: 145.84 },
            { o: 145.84, h: 146.12, l: 143.34, c: 144.24 },
            { o: 144.24, h: 145.93, l: 143.89, c: 145.48 },
            { o: 145.48, h: 148.3, l: 145.08, c: 147.84 },
            { o: 147.84, h: 149.54, l: 147.58, c: 148.97 },
            { o: 148.97, h: 151.06, l: 148.5, c: 150.38 },
            { o: 150.38, h: 153.51, l: 149.7, c: 152.86 },
            { o: 152.86, h: 154.49, l: 152.42, c: 154.24 }
          ],
          zones: [
            { from: 3, to: 18, top: 146.72, bottom: 146, kind: "supply", label: "supply" },
            { from: 16, to: 34, top: 143.64, bottom: 143.12, kind: "demand", label: "demand: removed supply" }
          ],
          notes: [
            { x: 15, y: 146.6, text: "respected" },
            { x: 18, y: 142.33, text: "explosive" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "If a trendline or zone is removed, there is always a new zone.",
        answer: false,
        explain: "Only if an explosive move away from basing did the removing. Breaks through little \"boo-boo\" basing candles give no zone."
      },
      {
        type: "mcq",
        q: "A demand removed a supply. Where must its basing be?",
        options: [
          "Below the supply, while the supply was still respected",
          "Above the supply",
          "Anywhere nearby",
          "Inside a different timeframe"
        ],
        answer: 0,
        explain: "If the basing or even a wick sat above the supply, the supply was already gone before the basing, so that basing removed nothing."
      },
      {
        type: "mcq",
        q: "A large candle has big wicks on both top and bottom. What is it?",
        options: [
          "A large basing candle",
          "An explosive move away",
          "A trendline",
          "A stay-away candle"
        ],
        answer: 0,
        explain: "Explosive means a full body with small wicks. Big wicks top and bottom mean it is still a basing candle, just a big one."
      },
      {
        type: "spot",
        q: "Price shot far above this uptrend line with no pullback. Click a candle where you would END the line.",
        scene: {
          candles: [
            { o: 128, h: 128.53, l: 126.46, c: 126.76 },
            { o: 126.76, h: 127.23, l: 125.76, c: 126 },
            { o: 126, h: 128, l: 125.61, c: 127.33 },
            { o: 127.33, h: 130.93, l: 127.1, c: 130.72 },
            { o: 130.72, h: 134.65, l: 130.13, c: 134.22 },
            { o: 134.22, h: 136.53, l: 133.78, c: 136.01 },
            { o: 136.01, h: 136.68, l: 134.05, c: 134.38 },
            { o: 134.38, h: 135.05, l: 132.46, c: 133.09 },
            { o: 133.09, h: 133.78, l: 129.95, c: 130.5 },
            { o: 130.5, h: 133.59, l: 130.2, c: 133.11 },
            { o: 133.11, h: 136.1, l: 132.8, c: 135.75 },
            { o: 135.75, h: 138.98, l: 135.35, c: 138.36 },
            { o: 138.36, h: 139.99, l: 137.87, c: 139.5 },
            { o: 139.5, h: 145.73, l: 139.34, c: 145.5 },
            { o: 145.5, h: 150.73, l: 145.31, c: 150.5 },
            { o: 150.5, h: 152.46, l: 150.09, c: 152.16 },
            { o: 152.16, h: 153.73, l: 151.63, c: 153.35 },
            { o: 153.35, h: 155.66, l: 152.98, c: 155.45 },
            { o: 155.45, h: 157.84, l: 155.12, c: 157.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.61, x2: 18, y2: 137.18, label: "uptrend line" }
          ]
        },
        answer: { from: 13, to: 17 },
        explain: "Once price overextends with no pullback, end the trendline roughly partway into that run. Ending it shows you know it no longer matters."
      },
      {
        type: "order",
        q: "Order the trendline recipe for an uptrend.",
        items: [
          "A peak",
          "A valley",
          "A higher high above the peak",
          "Draw from the lowest point to the valley"
        ],
        explain: "Peak, valley and a higher high. No higher high, no trendline."
      },
      {
        type: "tf",
        q: "A nearly horizontal line through a valley, peak and lower low still counts as a trendline.",
        answer: false,
        explain: "A trendline needs a visible angle. Nearly flat is closer to momentum: mark the trend with an arrow but no line."
      },
      {
        type: "mcq",
        q: "Your homework is on the 1-hour chart instead of the daily. What happens?",
        options: [
          "It cannot be marked",
          "It is marked the same",
          "He switches the timeframe for you",
          "It gets bonus points"
        ],
        answer: 0,
        explain: "He can change the broker but not the timeframe. Follow the instructions: daily chart, clear layout, old zones copied."
      }
    ],
    practice: [
      {
        prompt: "This demand formed under a respected supply, then removed it with an explosive candle. Price is pulling back. Plan the trade.",
        scene: {
          candles: [
            { o: 140, h: 142.62, l: 139.72, c: 141.95 },
            { o: 141.95, h: 143.73, l: 141.4, c: 143.52 },
            { o: 143.52, h: 146.52, l: 143.04, c: 146 },
            { o: 146, h: 146.58, l: 145.52, c: 146.37 },
            { o: 146.37, h: 146.72, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.3, l: 138.96, c: 139.12 },
            { o: 139.12, h: 139.33, l: 136.37, c: 136.62 },
            { o: 136.62, h: 137.01, l: 135.42, c: 135.83 },
            { o: 135.83, h: 136.15, l: 134.72, c: 134.99 },
            { o: 134.99, h: 135.39, l: 133.39, c: 133.62 },
            { o: 133.62, h: 136.09, l: 133.28, c: 135.58 },
            { o: 135.58, h: 138.04, l: 135.21, c: 137.57 },
            { o: 137.57, h: 139.91, l: 137.17, c: 139.59 },
            { o: 139.59, h: 142.01, l: 139.3, c: 141.43 },
            { o: 141.43, h: 144.01, l: 140.94, c: 143.8 },
            { o: 143.8, h: 145.7, l: 143.2, c: 143.4 },
            { o: 143.4, h: 143.88, l: 143.17, c: 143.64 },
            { o: 143.64, h: 143.95, l: 143.12, c: 143.36 },
            { o: 143.36, h: 149.05, l: 143.23, c: 148.92 },
            { o: 148.92, h: 151.64, l: 148.86, c: 151.42 },
            { o: 151.42, h: 153.09, l: 151.19, c: 152.68 },
            { o: 152.68, h: 154.2, l: 152.48, c: 153.62 },
            { o: 153.62, h: 154.63, l: 153.12, c: 154.42 },
            { o: 154.42, h: 154.89, l: 152.02, c: 152.5 },
            { o: 152.5, h: 153.18, l: 150.07, c: 150.65 },
            { o: 150.65, h: 150.98, l: 148.34, c: 148.84 },
            { o: 148.84, h: 149.44, l: 146.93, c: 147.27 },
            { o: 147.27, h: 147.95, l: 145.54, c: 145.84 },
            { o: 145.84, h: 146.12, l: 143.34, c: 144.24 },
            { o: 144.24, h: 145.93, l: 143.89, c: 145.48 },
            { o: 145.48, h: 148.3, l: 145.08, c: 147.84 },
            { o: 147.84, h: 149.54, l: 147.58, c: 148.97 },
            { o: 148.97, h: 151.06, l: 148.5, c: 150.38 },
            { o: 150.38, h: 153.51, l: 149.7, c: 152.86 },
            { o: 152.86, h: 154.49, l: 152.42, c: 154.24 }
          ],
          zones: [
            { from: 3, to: 18, top: 146.72, bottom: 146, kind: "supply", label: "supply (removed)", faded: true },
            { from: 16, to: 22, top: 143.64, bottom: 143.12, kind: "demand", label: "demand" }
          ],
          reveal: 23
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 143.79, sl: 142.52, tp: 147.6 },
        explain: "Valid demand: the basing formed while the supply was respected, and the move away removed it. Entry 143.79 at the proximal, stop 142.52 a little beyond. Price reacted to the 3:1 target."
      },
      {
        prompt: "A supply formed at the top, then its explosive drop removed the demand below. Price is rallying back up. Buy, sell, or stay out?",
        scene: {
          candles: [
            { o: 142, h: 142.3, l: 139.15, c: 139.53 },
            { o: 139.53, h: 140.18, l: 137.33, c: 137.75 },
            { o: 137.75, h: 138.29, l: 135.42, c: 135.99 },
            { o: 135.99, h: 136.38, l: 135.75, c: 136.15 },
            { o: 136.15, h: 136.5, l: 135.69, c: 135.94 },
            { o: 135.94, h: 142.6, l: 135.85, c: 142.44 },
            { o: 142.44, h: 145.14, l: 142.24, c: 144.84 },
            { o: 144.84, h: 147.07, l: 144.31, c: 146.82 },
            { o: 146.82, h: 149.65, l: 146.62, c: 149.24 },
            { o: 149.24, h: 151.65, l: 148.73, c: 151.43 },
            { o: 151.43, h: 154.27, l: 151.14, c: 153.84 },
            { o: 153.84, h: 154.51, l: 153.61, c: 154.07 },
            { o: 154.07, h: 154.28, l: 153.54, c: 153.83 },
            { o: 153.83, h: 153.94, l: 146.25, c: 146.33 },
            { o: 146.33, h: 146.53, l: 143.63, c: 143.93 },
            { o: 143.93, h: 144.35, l: 140.94, c: 141.17 },
            { o: 141.17, h: 141.77, l: 137.78, c: 138.29 },
            { o: 138.29, h: 138.51, l: 135.72, c: 135.98 },
            { o: 135.98, h: 136.44, l: 133.61, c: 133.94 },
            { o: 133.94, h: 134.35, l: 132.45, c: 132.98 },
            { o: 132.98, h: 133.41, l: 131.79, c: 132.44 },
            { o: 132.44, h: 136.12, l: 131.8, c: 135.62 },
            { o: 135.62, h: 138.63, l: 135.24, c: 138.37 },
            { o: 138.37, h: 141.85, l: 138.11, c: 141.27 },
            { o: 141.27, h: 144.69, l: 140.9, c: 144.47 },
            { o: 144.47, h: 148.82, l: 144.03, c: 148.23 },
            { o: 148.23, h: 152.25, l: 147.83, c: 151.61 },
            { o: 151.61, h: 154.13, l: 151.49, c: 153.23 },
            { o: 153.23, h: 153.5, l: 151.28, c: 151.89 },
            { o: 151.89, h: 152.18, l: 149.01, c: 149.45 },
            { o: 149.45, h: 149.72, l: 146.43, c: 147.11 },
            { o: 147.11, h: 147.49, l: 144.65, c: 145.13 },
            { o: 145.13, h: 145.78, l: 142.74, c: 143.09 },
            { o: 143.09, h: 143.64, l: 140.83, c: 141.23 }
          ],
          zones: [
            { from: 3, to: 18, top: 136.15, bottom: 135.69, kind: "demand", label: "demand (removed)", faded: true },
            { from: 11, to: 20, top: 154.51, bottom: 153.83, kind: "supply", label: "supply" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "sell", entry: 153.68, sl: 155.11, tp: 149.39 },
        explain: "Sell. This supply did a job: it removed the opposing demand (rule 1). It had basing, an explosive candle and a stay-away candle. Price came back and dropped again."
      }
    ],
    cards: [
      { front: "Does a removed zone always give a new zone?", back: "No. Only if an explosive move away from basing removed it." },
      { front: "Demand removing a supply: where must its basing be?", back: "Below the supply, formed while the supply was still respected." },
      { front: "Big candle with big wicks on both ends?", back: "A large basing candle, not an explosive move." },
      { front: "What makes a candle explosive?", back: "A full body with almost no wicks, much bigger than the basing." },
      { front: "Price rockets away from a trendline with no pullback?", back: "End the trendline (roughly halfway). Do not extend it." },
      { front: "What is a \"double whammy\" zone?", back: "A zone that removed two things at once, like a trendline and a demand." },
      { front: "What are gray areas?", back: "Borderline 50-50 cases between the obvious yes and obvious no. They exist with any rules." },
      { front: "Can't manage a trade (no internet)?", back: "Do not take it. Staying out is a decision." }
    ],
    mnemonic: "Crouch BEFORE the jump: basing under the fence, then the leap."
  },
  {
    mentor: "kevin-zoom",
    n: 3,
    eli5: {
      oneLiner: "A line breaks only when a whole candle steps fully off it.",
      story: "Think of a balance beam. If your toe still touches the beam, you have not fallen off. You only fell when your whole body is on the floor. A trendline is the beam: a candle that still touches it has not broken it yet.",
      analogy: "Breaking a trendline is like leaving a swimming pool. One foot on the ladder is still in the pool. Only when both feet are on the ground are you out."
    },
    bigIdeas: [
      "A trendline is removed only by a full candle beyond it, with no body or wick touching.",
      "A removed trendline or zone does not guarantee a zone. If nothing explosive did it, draw nothing.",
      "Re-anchor updated lines on the most recent valleys. A lone wick is not a valley."
    ],
    steps: [
      {
        title: "Draw from the lowest point",
        narration: "Uptrend line: start at the lowest point and run to the valley. If it cuts through a candle, move the anchor until it does not. A blatant valley, not a tiny wiggle.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 10, y2: 144.12, label: "uptrend line" }
          ],
          notes: [
            { x: 2, y: 137.8, text: "lowest point" },
            { x: 10, y: 143.32, text: "valley" }
          ]
        }
      },
      {
        title: "Touching is not breaking",
        narration: "Candles start leaning on the line. As long as any body or wick still touches it, the line is still alive.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 19, y2: 150.33, label: "uptrend line" }
          ],
          notes: [
            { x: 2, y: 137.8, text: "lowest point" },
            { x: 10, y: 143.32, text: "valley" },
            { x: 19, y: 151.42, text: "still touching" }
          ]
        }
      },
      {
        title: "Full candle below = removed",
        narration: "This candle closed fully below the line without touching it. That is the exact moment the line is removed. For a downtrend line it is the mirror: fully above.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 },
            { o: 149.73, h: 150.23, l: 148.11, c: 148.67 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 20, y2: 151.02, label: "uptrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 137.8, text: "lowest point" },
            { x: 10, y: 143.32, text: "valley" },
            { x: 19, y: 151.42, text: "still touching" },
            { x: 20, y: 147.31, text: "removed here" }
          ]
        }
      },
      {
        title: "No explosive move = no zone",
        narration: "Look at what broke it: tiny drifting candles, no explosive move. So there is no zone. A removed trendline does not mean we must have a zone. If nothing qualifies, leave it.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 },
            { o: 149.73, h: 150.23, l: 148.11, c: 148.67 },
            { o: 148.67, h: 149.19, l: 147.6, c: 148.18 },
            { o: 148.18, h: 148.62, l: 147.17, c: 147.44 },
            { o: 147.44, h: 147.88, l: 146.47, c: 146.84 },
            { o: 146.84, h: 147.28, l: 146.23, c: 146.64 },
            { o: 146.64, h: 147.15, l: 145.75, c: 146.14 },
            { o: 146.14, h: 146.62, l: 145.32, c: 145.9 },
            { o: 145.9, h: 146.17, l: 144.82, c: 145.34 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 20, y2: 151.02, label: "uptrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 137.8, text: "lowest point" },
            { x: 10, y: 143.32, text: "valley" },
            { x: 19, y: 151.42, text: "still touching" },
            { x: 20, y: 147.31, text: "removed here" }
          ],
          highlight: { from: 12, to: 27, label: "only boo-boo candles" }
        }
      },
      {
        title: "Ask: what did it accomplish?",
        narration: "For every zone ask \"what did this remove?\" A new low is not a zone. A choppy area is not the reason a zone fails; weak moves are. Do not force zones on a chart that has none.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 },
            { o: 149.73, h: 150.23, l: 148.11, c: 148.67 },
            { o: 148.67, h: 149.19, l: 147.6, c: 148.18 },
            { o: 148.18, h: 148.62, l: 147.17, c: 147.44 },
            { o: 147.44, h: 147.88, l: 146.47, c: 146.84 },
            { o: 146.84, h: 147.28, l: 146.23, c: 146.64 },
            { o: 146.64, h: 147.15, l: 145.75, c: 146.14 },
            { o: 146.14, h: 146.62, l: 145.32, c: 145.9 },
            { o: 145.9, h: 146.17, l: 144.82, c: 145.34 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 20, y2: 151.02, label: "uptrend line", broken: true }
          ],
          notes: [
            { x: 2, y: 137.8, text: "lowest point" },
            { x: 10, y: 143.32, text: "valley" },
            { x: 19, y: 151.42, text: "still touching" },
            { x: 20, y: 147.31, text: "removed here" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle that removed this uptrend line.",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 },
            { o: 149.73, h: 150.23, l: 148.11, c: 148.67 },
            { o: 148.67, h: 149.19, l: 147.6, c: 148.18 },
            { o: 148.18, h: 148.62, l: 147.17, c: 147.44 },
            { o: 147.44, h: 147.88, l: 146.47, c: 146.84 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 23, y2: 153.09, label: "uptrend line" }
          ]
        },
        answer: { from: 20, to: 20 },
        explain: "Every candle before it still touched the line. The first candle fully below, body and wick, is the removal."
      },
      {
        type: "tf",
        q: "After a trendline breaks you must find a zone, even a small one.",
        answer: false,
        explain: "Just because a trendline is removed does not mean there is a zone. Kevin measured one candidate and it was \"not even close\": no zone."
      },
      {
        type: "mcq",
        q: "Price makes only steady momentum moves, and one long wick sticks out. Is that wick a valley?",
        options: [
          "No, a lone wick is not a valley",
          "Yes, any wick is a valley",
          "Only on Fridays",
          "Only if it is red"
        ],
        answer: 0,
        explain: "He only attaches to a wick when a valley built from proper candles already exists there and the wick is its extreme."
      },
      {
        type: "mcq",
        q: "After a new peak, valley and higher high, where does the updated line usually go?",
        options: [
          "Previous valley to the new valley",
          "Always from the very first bottom",
          "Across the tops",
          "Nowhere, keep the old one"
        ],
        answer: 0,
        explain: "Connect the most recent valleys. Go back to the very bottom only if the recent valley would make the line too horizontal."
      },
      {
        type: "tf",
        q: "A small dip below the channel that quickly comes back keeps the trendline alive.",
        answer: true,
        explain: "Channel lenience: only when price falls \"way, way out\" of the channel does the line stop applying."
      },
      {
        type: "mcq",
        q: "A basing candle is almost the same size as the \"move away\" candle. What does that tell you?",
        options: [
          "It is not explosive: the dead giveaway",
          "It is a great zone",
          "It is a trendline",
          "Draw it bigger"
        ],
        answer: 0,
        explain: "Explosive is relative to the basing. Near-equal size is \"the dead giveaway\" that it is not a move away."
      },
      {
        type: "order",
        q: "Order these timeframes for a 1-hour entry (top-down).",
        items: [
          "1-month (sequence)",
          "Daily (higher timeframe)",
          "1-hour (entry)"
        ],
        explain: "For a 1H entry the HTF is the daily and the sequence above is the 1-month. Never jump from 3-month straight to 1H."
      }
    ],
    practice: [
      {
        prompt: "The uptrend line just broke. Is there a supply zone to sell from?",
        scene: {
          candles: [
            { o: 142, h: 142.24, l: 140.26, c: 140.69 },
            { o: 140.69, h: 141.13, l: 139.42, c: 140 },
            { o: 140, h: 140.8, l: 138.6, c: 140.5 },
            { o: 140.5, h: 143.51, l: 140.2, c: 143.27 },
            { o: 143.27, h: 145.75, l: 142.71, c: 145.31 },
            { o: 145.31, h: 148.22, l: 144.71, c: 147.58 },
            { o: 147.58, h: 151.05, l: 147.22, c: 150.5 },
            { o: 150.5, h: 150.97, l: 148.26, c: 148.88 },
            { o: 148.88, h: 149.52, l: 146.35, c: 146.56 },
            { o: 146.56, h: 147.23, l: 144.14, c: 144.5 },
            { o: 144.5, h: 148.13, l: 144.12, c: 147.57 },
            { o: 147.57, h: 150.06, l: 147.37, c: 149.86 },
            { o: 149.86, h: 153.44, l: 149.42, c: 152.81 },
            { o: 152.81, h: 155.04, l: 152.31, c: 154.5 },
            { o: 154.5, h: 154.95, l: 153.05, c: 153.5 },
            { o: 153.5, h: 153.94, l: 152.42, c: 152.8 },
            { o: 152.8, h: 153.21, l: 151.39, c: 151.78 },
            { o: 151.78, h: 152.3, l: 150.78, c: 151.23 },
            { o: 151.23, h: 151.61, l: 149.73, c: 150.21 },
            { o: 150.21, h: 150.62, l: 149.24, c: 149.73 },
            { o: 149.73, h: 150.23, l: 148.11, c: 148.67 },
            { o: 148.67, h: 149.19, l: 147.6, c: 148.18 },
            { o: 148.18, h: 148.62, l: 147.17, c: 147.44 },
            { o: 147.44, h: 147.88, l: 146.47, c: 146.84 },
            { o: 146.84, h: 147.28, l: 146.23, c: 146.64 },
            { o: 146.64, h: 147.15, l: 145.75, c: 146.14 },
            { o: 146.14, h: 146.62, l: 145.32, c: 145.9 },
            { o: 145.9, h: 146.17, l: 144.82, c: 145.34 }
          ],
          trendlines: [
            { x1: 2, y1: 138.6, x2: 20, y2: 151.02, label: "uptrend line", broken: true }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No trade. The line was removed by small drifting candles with no explosive move away, so no zone formed. A removed trendline does not guarantee a zone."
      },
      {
        prompt: "This demand removed the downtrend line with a big move away. Draw the zone: proximal tight to the basing bodies, distal at the lowest wick.",
        scene: {
          candles: [
            { o: 160, h: 162.06, l: 159.76, c: 161.63 },
            { o: 161.63, h: 163.08, l: 161.19, c: 162.5 },
            { o: 162.5, h: 164.1, l: 161.6, c: 161.9 },
            { o: 161.9, h: 162.2, l: 158.61, c: 158.85 },
            { o: 158.85, h: 159.41, l: 156.17, c: 156.61 },
            { o: 156.61, h: 157.21, l: 153.47, c: 154.11 },
            { o: 154.11, h: 154.47, l: 150.35, c: 150.9 },
            { o: 150.9, h: 153.28, l: 150.43, c: 152.66 },
            { o: 152.66, h: 155.38, l: 152.02, c: 155.17 },
            { o: 155.17, h: 157.76, l: 154.5, c: 157.4 },
            { o: 157.4, h: 157.96, l: 154.06, c: 154.26 },
            { o: 154.26, h: 154.46, l: 151.47, c: 151.91 },
            { o: 151.91, h: 152.54, l: 148.39, c: 148.89 },
            { o: 148.89, h: 149.43, l: 146.54, c: 147.13 },
            { o: 147.13, h: 147.62, l: 144.4, c: 144.89 },
            { o: 144.89, h: 145.38, l: 144.53, c: 145.07 },
            { o: 145.07, h: 145.39, l: 144.33, c: 144.67 },
            { o: 144.67, h: 152.32, l: 144.51, c: 152.17 },
            { o: 152.17, h: 157.88, l: 151.95, c: 157.67 },
            { o: 157.67, h: 159.84, l: 157.24, c: 159.29 },
            { o: 159.29, h: 161.21, l: 158.65, c: 160.52 },
            { o: 160.52, h: 162.73, l: 159.98, c: 162.17 },
            { o: 162.17, h: 162.8, l: 157.97, c: 158.34 },
            { o: 158.34, h: 158.81, l: 154.5, c: 154.84 },
            { o: 154.84, h: 155.27, l: 152.13, c: 152.61 },
            { o: 152.61, h: 153.1, l: 149.96, c: 150.36 },
            { o: 150.36, h: 150.94, l: 146.98, c: 147.27 },
            { o: 147.27, h: 147.56, l: 144.77, c: 145.67 },
            { o: 145.67, h: 148.35, l: 145.08, c: 147.8 },
            { o: 147.8, h: 150.61, l: 147.11, c: 150.1 },
            { o: 150.1, h: 153.14, l: 149.41, c: 152.44 },
            { o: 152.44, h: 154.1, l: 151.8, c: 153.61 },
            { o: 153.61, h: 156.04, l: 153, c: 155.36 },
            { o: 155.36, h: 157.04, l: 154.85, c: 156.68 }
          ],
          trendlines: [
            { x1: 2, y1: 164.1, x2: 18, y2: 149.61, label: "downtrend line", broken: true }
          ],
          reveal: 22
        },
        task: "draw-zone",
        answer: { side: "buy", top: 145.07, bottom: 144.33, entry: 145.22, sl: 143.73, tp: 149.69 },
        explain: "Top (proximal) 145.07 at the highest basing body, bottom (distal) 144.33 at the lowest basing wick. Include the wicks of the basing. Price came back and respected it."
      }
    ],
    cards: [
      { front: "When is a downtrend line removed?", back: "A candle sits fully above it, body and wick not touching." },
      { front: "When is an uptrend line removed?", back: "A candle sits fully below it, body and wick not touching." },
      { front: "Trendline removed but only small candles broke it?", back: "No zone. Leave it." },
      { front: "Is a lone long wick a valley?", back: "No. Only use a wick when real candles already form a valley there." },
      { front: "Updated uptrend line connects what?", back: "The most recent valleys (previous valley to new valley)." },
      { front: "Do we trade tested zones?", back: "No. \"We don't trade at tested zones.\"" },
      { front: "Higher-timeframe zone broke. Is your entry still a confirmation trade?", back: "No. You can trade the zone, but not as confirmation." },
      { front: "Always take 1:1?", back: "No. Spot bigger risk-reward chances: they are your account boosters." }
    ],
    mnemonic: "Toe on the beam? Not off yet. Whole candle off = line gone."
  },
  {
    mentor: "kevin-zoom",
    n: 4,
    eli5: {
      oneLiner: "Pause, jump, stay away: the bigger the gap, the better the zone.",
      story: "A frog sits still on a lily pad. Then it jumps far. Then it lands well away and does not hop back right away. The far landing leaves a big gap. A frog that jumps and plops back next to its pad did not really go anywhere.",
      analogy: "The basing is the frog sitting, the explosive candle is the jump, and the stay-away candle is where it lands. The water between is the space that tells you how strong the jump was."
    },
    bigIdeas: [
      "Basing can be one candle. If there are two basing sections, use only the most recent one.",
      "Grade the zone by the space between the stay-away candle and the proximal line.",
      "Keep a zone until it is removed, not when it is tested. Every high price breaks is an all-time high."
    ],
    steps: [
      {
        title: "Basing can be just one candle",
        narration: "A zone starts with basing: small pause candles. It does not need three. One candle is enough. Here is a first little group of basing.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 }
          ],
          highlight: { from: 5, to: 6, label: "basing section 1" }
        }
      },
      {
        title: "A second basing section",
        narration: "Price nudges up a bit and pauses again. Now there are two basing sections. Do not glue them together: the zone would be too big.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 }
          ],
          highlight: { from: 9, to: 10, label: "basing section 2 (most recent)" }
        }
      },
      {
        title: "The explosive move",
        narration: "One big full-bodied candle blasts away. This is the bank footprint. Use only the MOST RECENT basing section, right next to the explosive candle, and include all its wicks.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 },
            { o: 149.13, h: 156.28, l: 149.07, c: 156.13 }
          ],
          zones: [
            { from: 5, to: 11, top: 149.37, bottom: 146.57, kind: "demand", label: "too big: both sections", faded: true },
            { from: 9, to: 11, top: 149.37, bottom: 148.67, kind: "demand", label: "zone: most recent basing" }
          ],
          notes: [
            { x: 11, y: 148.27, text: "explosive" }
          ]
        }
      },
      {
        title: "Stay-away candle and the space",
        narration: "Next, a stay-away candle keeps price away from the proximal line. The space between them is how Kevin grades a zone: bigger space, better zone. Tiny space means drawable but not tradable.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 },
            { o: 149.13, h: 156.28, l: 149.07, c: 156.13 },
            { o: 156.13, h: 159.28, l: 156.07, c: 159.13 },
            { o: 159.13, h: 160.62, l: 158.86, c: 160.38 }
          ],
          zones: [
            { from: 9, to: 13, top: 149.37, bottom: 148.67, kind: "demand", label: "zone" }
          ],
          notes: [
            { x: 11, y: 148.27, text: "explosive" },
            { x: 12, y: 155.27, text: "stay-away" },
            { x: 12, y: 152.72, text: "space" }
          ]
        }
      },
      {
        title: "Tested is not removed",
        narration: "When price comes back and touches the zone, it is tested, not removed. Keep extending the zone until it is actually removed. Ending it early makes it look random.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 },
            { o: 149.13, h: 156.28, l: 149.07, c: 156.13 },
            { o: 156.13, h: 159.28, l: 156.07, c: 159.13 },
            { o: 159.13, h: 160.62, l: 158.86, c: 160.38 },
            { o: 160.38, h: 162.37, l: 159.94, c: 161.79 },
            { o: 161.79, h: 163.54, l: 161.28, c: 163.13 },
            { o: 163.13, h: 163.72, l: 159.88, c: 160.42 },
            { o: 160.42, h: 160.69, l: 158.1, c: 158.6 },
            { o: 158.6, h: 159.24, l: 155.88, c: 156.38 },
            { o: 156.38, h: 156.59, l: 152.93, c: 153.5 },
            { o: 153.5, h: 154.06, l: 151.06, c: 151.57 },
            { o: 151.57, h: 151.83, l: 149.07, c: 149.97 },
            { o: 149.97, h: 152.15, l: 149.74, c: 151.84 },
            { o: 151.84, h: 154.1, l: 151.42, c: 153.46 },
            { o: 153.46, h: 155.39, l: 153.18, c: 154.97 },
            { o: 154.97, h: 157.77, l: 154.56, c: 157.13 },
            { o: 157.13, h: 158.98, l: 156.46, c: 158.35 },
            { o: 158.35, h: 160.2, l: 158.07, c: 159.97 }
          ],
          zones: [
            { from: 9, to: 27, top: 149.37, bottom: 148.67, kind: "demand", label: "zone" }
          ],
          notes: [
            { x: 11, y: 148.27, text: "explosive" },
            { x: 12, y: 155.27, text: "stay-away" },
            { x: 12, y: 152.72, text: "space" },
            { x: 21, y: 148.27, text: "tested: keep extending" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the stay-away candle.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 },
            { o: 149.13, h: 156.28, l: 149.07, c: 156.13 },
            { o: 156.13, h: 159.28, l: 156.07, c: 159.13 },
            { o: 159.13, h: 160.62, l: 158.86, c: 160.38 },
            { o: 160.38, h: 162.37, l: 159.94, c: 161.79 },
            { o: 161.79, h: 163.54, l: 161.28, c: 163.13 }
          ],
          zones: [
            { from: 9, to: 15, top: 149.37, bottom: 148.67, kind: "demand", label: "zone" }
          ]
        },
        answer: { from: 12, to: 12 },
        explain: "It is the candle after the explosive move that stays away from the proximal line, leaving the space."
      },
      {
        type: "mcq",
        q: "How does Kevin judge how good a zone is?",
        options: [
          "The space between the stay-away candle and the proximal line",
          "How many basing candles it has",
          "The colour of the basing",
          "How round the price is"
        ],
        answer: 0,
        explain: "\"That space is pretty much how I judge how good a zone is. The bigger the space, the better.\""
      },
      {
        type: "tf",
        q: "When price tests a zone, you end the zone there.",
        answer: false,
        explain: "\"Just because it's used doesn't mean we end it.\" Extend it until it is removed."
      },
      {
        type: "tf",
        q: "On a fresh chart, the first visible high counts as the all-time high.",
        answer: true,
        explain: "Like an axiom: you have to start somewhere. And every high price breaks above is a new all-time high, not only obvious peaks."
      },
      {
        type: "mcq",
        q: "Your zone is drawn much smaller than your other zones. Why is that a problem?",
        options: [
          "It gets \"removed\" too early and corrupts the chain",
          "Small zones always win",
          "It changes the timeframe",
          "No problem at all"
        ],
        answer: 0,
        explain: "Too small means zones everywhere and false early removals. Keep sizes similar; a bit bigger is fine, never really tiny."
      },
      {
        type: "mcq",
        q: "Price went far above an uptrend line with no pullback. What do you do with the line?",
        options: [
          "End it",
          "Extend it forever",
          "Redraw it across the top",
          "Delete the zone"
        ],
        answer: 0,
        explain: "Ending it says \"I recognise there was a trendline, and price got too overextended.\""
      },
      {
        type: "order",
        q: "Order the parts of a zone as they print.",
        items: [
          "Basing",
          "Explosive move away",
          "Stay-away candle",
          "Space to the proximal line"
        ],
        explain: "Basing, explosive move, stay-away candle, and the space it leaves."
      }
    ],
    practice: [
      {
        prompt: "There are two basing sections before the explosive candle. Draw the demand zone the way Kevin does.",
        scene: {
          candles: [
            { o: 158, h: 158.42, l: 155.84, c: 156.14 },
            { o: 156.14, h: 156.38, l: 153.24, c: 153.46 },
            { o: 153.46, h: 154.16, l: 150.57, c: 151.23 },
            { o: 151.23, h: 151.49, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.17, l: 146.59, c: 147.01 },
            { o: 147.01, h: 147.73, l: 146.57, c: 147.44 },
            { o: 147.44, h: 147.69, l: 146.69, c: 147.01 },
            { o: 147.01, h: 148.41, l: 146.81, c: 148.11 },
            { o: 148.11, h: 149.31, l: 147.91, c: 149.01 },
            { o: 149.01, h: 149.73, l: 148.67, c: 149.37 },
            { o: 149.37, h: 149.67, l: 148.81, c: 149.13 },
            { o: 149.13, h: 156.28, l: 149.07, c: 156.13 },
            { o: 156.13, h: 159.28, l: 156.07, c: 159.13 },
            { o: 159.13, h: 160.62, l: 158.86, c: 160.38 },
            { o: 160.38, h: 162.37, l: 159.94, c: 161.79 },
            { o: 161.79, h: 163.54, l: 161.28, c: 163.13 },
            { o: 163.13, h: 163.72, l: 159.88, c: 160.42 },
            { o: 160.42, h: 160.69, l: 158.1, c: 158.6 },
            { o: 158.6, h: 159.24, l: 155.88, c: 156.38 },
            { o: 156.38, h: 156.59, l: 152.93, c: 153.5 },
            { o: 153.5, h: 154.06, l: 151.06, c: 151.57 },
            { o: 151.57, h: 151.83, l: 149.07, c: 149.97 },
            { o: 149.97, h: 152.15, l: 149.74, c: 151.84 },
            { o: 151.84, h: 154.1, l: 151.42, c: 153.46 },
            { o: 153.46, h: 155.39, l: 153.18, c: 154.97 },
            { o: 154.97, h: 157.77, l: 154.56, c: 157.13 },
            { o: 157.13, h: 158.98, l: 156.46, c: 158.35 },
            { o: 158.35, h: 160.2, l: 158.07, c: 159.97 }
          ],
          reveal: 16
        },
        task: "draw-zone",
        answer: { top: 149.37, bottom: 148.67 },
        explain: "Only the most recent section: top 149.37 (highest basing body), bottom 148.67 (lowest basing wick). Combining both sections makes the zone far too big."
      },
      {
        prompt: "A massive red candle, then straight away a massive green candle. No basing in between. Is there a demand zone? Plan the trade if yes.",
        scene: {
          candles: [
            { o: 150, h: 150.61, l: 147.8, c: 148.36 },
            { o: 148.36, h: 148.9, l: 145.21, c: 145.54 },
            { o: 145.54, h: 146.2, l: 143.73, c: 144 },
            { o: 144, h: 144.75, l: 143.62, c: 144.34 },
            { o: 144.34, h: 144.82, l: 143.81, c: 144.1 },
            { o: 144.1, h: 150.8, l: 143.92, c: 150.6 },
            { o: 150.6, h: 153.22, l: 150.44, c: 153.1 },
            { o: 153.1, h: 155.06, l: 152.56, c: 154.77 },
            { o: 154.77, h: 156.76, l: 154.55, c: 156.39 },
            { o: 156.39, h: 158.1, l: 156.09, c: 157.46 },
            { o: 157.46, h: 159.56, l: 157.01, c: 159.1 },
            { o: 159.1, h: 159.4, l: 158.48, c: 158.71 },
            { o: 158.71, h: 159.15, l: 157.52, c: 157.87 },
            { o: 157.87, h: 158.4, l: 156.75, c: 157.1 },
            { o: 157.1, h: 157.26, l: 147.86, c: 148.1 },
            { o: 148.1, h: 157.76, l: 148.02, c: 157.6 },
            { o: 157.6, h: 160.75, l: 157.48, c: 160.6 },
            { o: 160.6, h: 162.02, l: 160.13, c: 161.51 },
            { o: 161.51, h: 163.19, l: 161.06, c: 162.66 },
            { o: 162.66, h: 163.9, l: 162, c: 163.61 },
            { o: 163.61, h: 163.82, l: 161.07, c: 161.64 },
            { o: 161.64, h: 161.89, l: 159.08, c: 159.61 },
            { o: 159.61, h: 160.13, l: 157, c: 157.69 },
            { o: 157.69, h: 158.26, l: 154.99, c: 155.64 },
            { o: 155.64, h: 156.24, l: 152.85, c: 153.17 },
            { o: 153.17, h: 153.71, l: 150.1, c: 150.78 },
            { o: 150.78, h: 150.9, l: 148.28, c: 149.18 },
            { o: 149.18, h: 152.07, l: 148.55, c: 151.51 },
            { o: 151.51, h: 153.64, l: 151.02, c: 153.41 },
            { o: 153.41, h: 155.97, l: 153.05, c: 155.49 },
            { o: 155.49, h: 157.3, l: 155.15, c: 156.83 },
            { o: 156.83, h: 159.31, l: 156.54, c: 158.87 },
            { o: 158.87, h: 160.78, l: 158.32, c: 160.17 }
          ],
          zones: [
            { from: 3, to: 19, top: 144.34, bottom: 143.62, kind: "demand", label: "earlier zone (size guide)", faded: true }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 148.73, sl: 147.26, tp: 153.14 },
        explain: "Yes. In this rare case act as if there is basing at the turn and draw the zone a similar size to your previous zones (bottom 147.86, top 148.58). Entry 148.73, stop 147.26."
      }
    ],
    cards: [
      { front: "Minimum basing candles?", back: "One. Basing can be a single candle." },
      { front: "Two basing sections before the move?", back: "Use only the most recent one. Do not combine." },
      { front: "What grades a zone?", back: "The space between the stay-away candle and the proximal line." },
      { front: "Small space zone?", back: "Drawable, not tradable. Keep it to see what removes it." },
      { front: "Massive drop then massive rally, no basing?", back: "Act as if basing is there; draw a zone similar in size to your others." },
      { front: "Tested vs removed?", back: "Tested: keep extending. Removed: end it with the remove tool." },
      { front: "Which highs are all-time highs?", back: "Every high that price breaks above, not just obvious peaks." },
      { front: "Which line matters most when copying his zones?", back: "The distal line: it decides exactly when the zone is removed." }
    ],
    mnemonic: "Sit, Jump, Land far: the wider the water, the stronger the frog."
  },
  {
    mentor: "kevin-zoom",
    n: 5,
    eli5: {
      oneLiner: "A zone has four parts: sit, jump, stay away, and a gap.",
      story: "Think of a rocket. First it sits on the pad. Then whoosh, it blasts off. Then it keeps flying and does not fall back down. The empty sky between the rocket and the pad shows how strong the launch was. We only say \"launch!\" once the rocket has really left.",
      analogy: "Basing is the rocket on the pad, the explosive candle is the blast-off, the stay-away candle is the rocket still climbing, and the space is the sky under it."
    },
    bigIdeas: [
      "A zone needs basing, an explosive move away, a stay-away candle and space. It does not exist until the stay-away candle closes.",
      "Only a full candle close beyond a trendline removes it. Use the most recent trendline, not a huge one.",
      "Enter at or just before the zone; keep a normal stop beyond it. A broken zone is not always a loss."
    ],
    steps: [
      {
        title: "1. Basing",
        narration: "Thing 1: basing. Usually 1 to 3 small candles. Kevin's favourite is a single basing candle, like this one.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 }
          ],
          highlight: { from: 5, to: 5, label: "basing" }
        }
      },
      {
        title: "2. The explosive move away",
        narration: "Thing 2: one explosive candle straight out of the basing. A run of little \"boo-boo\" candles covering the same distance does not count.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 },
            { o: 150.25, h: 156.95, l: 150.06, c: 156.75 }
          ],
          notes: [
            { x: 6, y: 149.26, text: "explosive" }
          ]
        }
      },
      {
        title: "3. Stay-away candle",
        narration: "Thing 3: the stay-away candle. It stays away from where the zone will be. While it is still forming, we do NOT have a zone yet.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 },
            { o: 150.25, h: 156.95, l: 150.06, c: 156.75 },
            { o: 156.75, h: 160.35, l: 156.7, c: 160.25 }
          ],
          notes: [
            { x: 6, y: 149.26, text: "explosive" },
            { x: 7, y: 161.15, text: "stay-away (forming)" }
          ]
        }
      },
      {
        title: "4. The space: now the zone exists",
        narration: "Thing 4: the space between the stay-away candle and the proximal line. Once the stay-away candle has closed and the next candle starts, the zone exists. More space means a stronger zone.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 },
            { o: 150.25, h: 156.95, l: 150.06, c: 156.75 },
            { o: 156.75, h: 160.35, l: 156.7, c: 160.25 },
            { o: 160.25, h: 162.44, l: 159.55, c: 162 }
          ],
          zones: [
            { from: 5, to: 8, top: 150.25, bottom: 149.71, kind: "demand", label: "demand" }
          ],
          notes: [
            { x: 6, y: 149.26, text: "explosive" },
            { x: 7, y: 161.15, text: "stay-away (forming)" },
            { x: 7, y: 153.48, text: "space" }
          ]
        }
      },
      {
        title: "Entry and a normal stop",
        narration: "Enter at the zone or just a little before it. Keep the stop at least a normal visible distance beyond the zone; wider when the news is wild. A zone broken by a few pips is not always a losing trade.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 },
            { o: 150.25, h: 156.95, l: 150.06, c: 156.75 },
            { o: 156.75, h: 160.35, l: 156.7, c: 160.25 },
            { o: 160.25, h: 162.44, l: 159.55, c: 162 },
            { o: 162, h: 163.41, l: 161.76, c: 163.09 },
            { o: 163.09, h: 164.87, l: 162.73, c: 164.25 },
            { o: 164.25, h: 165.65, l: 163.56, c: 165.25 },
            { o: 165.25, h: 165.89, l: 162.57, c: 163.03 },
            { o: 163.03, h: 163.63, l: 160.11, c: 160.63 },
            { o: 160.63, h: 160.9, l: 157.97, c: 158.49 },
            { o: 158.49, h: 158.98, l: 154.99, c: 155.35 },
            { o: 155.35, h: 155.94, l: 151.94, c: 152.44 },
            { o: 152.44, h: 152.54, l: 149.95, c: 150.85 },
            { o: 150.85, h: 153.8, l: 150.51, c: 153.18 },
            { o: 153.18, h: 155.33, l: 152.97, c: 154.63 },
            { o: 154.63, h: 156.47, l: 154.05, c: 156.09 },
            { o: 156.09, h: 158.7, l: 155.56, c: 158.34 },
            { o: 158.34, h: 159.89, l: 158.1, c: 159.65 },
            { o: 159.65, h: 161.42, l: 159.19, c: 160.85 }
          ],
          zones: [
            { from: 5, to: 23, top: 150.25, bottom: 149.71, kind: "demand", label: "demand" }
          ],
          lines: [
            { y: 150.4, label: "entry", kind: "entry", from: 5 },
            { y: 149.11, label: "stop", kind: "sl", from: 5 }
          ],
          notes: [
            { x: 6, y: 149.26, text: "explosive" },
            { x: 7, y: 161.15, text: "stay-away (forming)" },
            { x: 7, y: 153.48, text: "space" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put the four things a zone needs in order.",
        items: [
          "Basing",
          "Explosive move-away candle",
          "Stay-away candle",
          "Space to the proximal line"
        ],
        explain: "You get the space automatically once the stay-away candle closes."
      },
      {
        type: "tf",
        q: "You can draw the zone as soon as the explosive candle closes.",
        answer: false,
        explain: "Not yet. He waits until the stay-away candle has closed and the next candle has started forming."
      },
      {
        type: "spot",
        q: "Click the candle that removed the downtrend line (a full close beyond it).",
        scene: {
          candles: [
            { o: 164, h: 165.51, l: 163.49, c: 165.2 },
            { o: 165.2, h: 166.74, l: 164.7, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.49, l: 162.23, c: 162.8 },
            { o: 162.8, h: 163.33, l: 160.14, c: 160.35 },
            { o: 160.35, h: 160.78, l: 156.44, c: 156.79 },
            { o: 156.79, h: 157.44, l: 154.56, c: 154.9 },
            { o: 154.9, h: 157.62, l: 154.3, c: 157.41 },
            { o: 157.41, h: 160.16, l: 157.07, c: 159.86 },
            { o: 159.86, h: 161.66, l: 159.42, c: 161.4 },
            { o: 161.4, h: 161.8, l: 157.1, c: 157.79 },
            { o: 157.79, h: 158.13, l: 155.47, c: 155.86 },
            { o: 155.86, h: 156.17, l: 153.67, c: 154.3 },
            { o: 154.3, h: 154.86, l: 150.37, c: 151.01 },
            { o: 151.01, h: 151.47, l: 148.31, c: 148.91 },
            { o: 148.91, h: 149.5, l: 148.52, c: 149.26 },
            { o: 149.26, h: 149.55, l: 148.5, c: 148.93 },
            { o: 148.93, h: 156.6, l: 148.88, c: 156.43 },
            { o: 156.43, h: 158.33, l: 156.23, c: 158.03 },
            { o: 158.03, h: 159.36, l: 157.39, c: 158.98 },
            { o: 158.98, h: 159.85, l: 158.69, c: 159.53 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 20, y2: 151.54, label: "downtrend line" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "A candle poking through does not count. The first candle fully above the line, nothing touching, removes it."
      },
      {
        type: "mcq",
        q: "The move-away candle has a long wick. Does it still qualify?",
        options: [
          "Yes, if the body is still big enough overall",
          "Never",
          "Only if it is green",
          "Only on gold"
        ],
        answer: 0,
        explain: "\"Just because it's a large move away doesn't make it an explosive move away\", but a big enough body still qualifies."
      },
      {
        type: "mcq",
        q: "Students drew one huge trendline across months of price. What did they miss?",
        options: [
          "The recent peaks and valleys, and the zones they lead to",
          "Nothing",
          "The all-time high",
          "The news"
        ],
        answer: 0,
        explain: "A huge line on the daily is really a weekly line. \"We're only really trying to draw the most recent one.\""
      },
      {
        type: "tf",
        q: "If a zone breaks by a few pips, the trade was always a loss.",
        answer: false,
        explain: "With his normal stop distance beyond the zone, a small break often is not a loss unless the spread blows out."
      },
      {
        type: "mcq",
        q: "Where does Kevin enter?",
        options: [
          "At the zone or just a little before it",
          "Halfway through the zone",
          "Far above the zone",
          "Only after the zone breaks"
        ],
        answer: 0,
        explain: "He says he enters \"most always\" just a little before the zone."
      }
    ],
    practice: [
      {
        prompt: "All four parts are here: basing, explosive candle, stay-away candle and a big space. Plan the trade.",
        scene: {
          candles: [
            { o: 162, h: 162.5, l: 158.58, c: 159.14 },
            { o: 159.14, h: 159.57, l: 155.45, c: 156.1 },
            { o: 156.1, h: 156.41, l: 153.67, c: 154.26 },
            { o: 154.26, h: 154.83, l: 151.02, c: 151.55 },
            { o: 151.55, h: 151.76, l: 149.57, c: 150 },
            { o: 150, h: 150.72, l: 149.71, c: 150.25 },
            { o: 150.25, h: 156.95, l: 150.06, c: 156.75 },
            { o: 156.75, h: 160.35, l: 156.7, c: 160.25 },
            { o: 160.25, h: 162.44, l: 159.55, c: 162 },
            { o: 162, h: 163.41, l: 161.76, c: 163.09 },
            { o: 163.09, h: 164.87, l: 162.73, c: 164.25 },
            { o: 164.25, h: 165.65, l: 163.56, c: 165.25 },
            { o: 165.25, h: 165.89, l: 162.57, c: 163.03 },
            { o: 163.03, h: 163.63, l: 160.11, c: 160.63 },
            { o: 160.63, h: 160.9, l: 157.97, c: 158.49 },
            { o: 158.49, h: 158.98, l: 154.99, c: 155.35 },
            { o: 155.35, h: 155.94, l: 151.94, c: 152.44 },
            { o: 152.44, h: 152.54, l: 149.95, c: 150.85 },
            { o: 150.85, h: 153.8, l: 150.51, c: 153.18 },
            { o: 153.18, h: 155.33, l: 152.97, c: 154.63 },
            { o: 154.63, h: 156.47, l: 154.05, c: 156.09 },
            { o: 156.09, h: 158.7, l: 155.56, c: 158.34 },
            { o: 158.34, h: 159.89, l: 158.1, c: 159.65 },
            { o: 159.65, h: 161.42, l: 159.19, c: 160.85 }
          ],
          zones: [
            { from: 5, to: 11, top: 150.25, bottom: 149.71, kind: "demand", label: "demand" }
          ],
          reveal: 12
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 150.4, sl: 149.11, tp: 154.27 },
        explain: "Entry just before the proximal (150.4), stop a normal distance beyond (149.11). The big space under the stay-away candle made this a strong zone, and price reached the 3:1 target."
      },
      {
        prompt: "Basing and an explosive candle, but the next candle's wick reaches almost back to the zone. Do you buy the pullback?",
        scene: {
          candles: [
            { o: 162, h: 162.25, l: 159.2, c: 159.61 },
            { o: 159.61, h: 160.04, l: 156.35, c: 156.72 },
            { o: 156.72, h: 157.05, l: 154.06, c: 154.38 },
            { o: 154.38, h: 154.6, l: 151.22, c: 151.68 },
            { o: 151.68, h: 151.97, l: 149.42, c: 149.99 },
            { o: 149.99, h: 150.5, l: 149.67, c: 150.23 },
            { o: 150.23, h: 156.87, l: 150, c: 156.73 },
            { o: 156.73, h: 157.03, l: 150.58, c: 155.83 },
            { o: 155.83, h: 157.19, l: 155.55, c: 156.96 },
            { o: 156.96, h: 158.47, l: 156.48, c: 158.13 },
            { o: 158.13, h: 159.44, l: 157.83, c: 159.18 },
            { o: 159.18, h: 160.87, l: 158.93, c: 160.34 },
            { o: 160.34, h: 160.72, l: 157.73, c: 158.38 },
            { o: 158.38, h: 158.67, l: 156.55, c: 156.98 },
            { o: 156.98, h: 157.46, l: 154.57, c: 155.15 },
            { o: 155.15, h: 155.79, l: 153.35, c: 153.71 },
            { o: 153.71, h: 154.38, l: 151.92, c: 152.43 },
            { o: 152.43, h: 152.65, l: 149.93, c: 150.83 },
            { o: 150.83, h: 151.36, l: 149.46, c: 149.83 },
            { o: 149.83, h: 150.04, l: 147.07, c: 147.17 },
            { o: 147.17, h: 147.41, l: 146.03, c: 146.33 },
            { o: 146.33, h: 146.82, l: 144.4, c: 144.95 },
            { o: 144.95, h: 145.53, l: 143.93, c: 144.17 }
          ],
          zones: [
            { from: 5, to: 11, top: 150.23, bottom: 149.67, kind: "demand", label: "demand" }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Stay out. The space between the stay-away candle and the proximal line is tiny, so this zone is drawable but not tradable. Draw it to see what removes it, but do not trade it. Here it failed."
      }
    ],
    cards: [
      { front: "The 4 things a zone needs?", back: "Basing, explosive move away, stay-away candle, space to the proximal line." },
      { front: "When does the zone exist?", back: "After the stay-away candle closes and the next candle starts." },
      { front: "Kevin's favourite basing?", back: "A single basing candle." },
      { front: "Tiny space under the stay-away candle?", back: "Drawable, not tradable." },
      { front: "No basing but an aggressive reversal?", back: "Draw the basing in yourself." },
      { front: "Where does Kevin enter?", back: "At the zone or just a little before it." },
      { front: "Huge trendline on the daily?", back: "Probably a weekly line. Draw the most recent one." },
      { front: "Zoom in very close to find zones?", back: "No. Zoomed in too much, every move looks explosive." }
    ],
    mnemonic: "Pad, Blast, Climb, Sky: no sky, no launch."
  },
  {
    mentor: "kevin-zoom",
    n: 6,
    eli5: {
      oneLiner: "The jump must start below the fence to break it.",
      story: "A kid jumps over a fence and knocks it down. We say that kid broke the fence. But if another kid was already standing on the far side and jumped, that jump did not break anything. The fence was already down.",
      analogy: "The downtrend line is a fence. The basing candles are the kid crouching. The crouch must be at or below the fence for the jump to be the one that broke it."
    },
    bigIdeas: [
      "A demand removes a downtrend line only if its basing is at or below the line (supply mirror for uptrend lines).",
      "Touching the line is respect. Only a full close beyond it is removal. After a new lower low, update the line from the recent peak.",
      "When candidates are close, the first one that qualifies goes in the chain. Wider stop when a higher-timeframe zone is in control."
    ],
    steps: [
      {
        title: "Obvious peak, valley, lower low",
        narration: "You need an OBVIOUS peak and valley, not tiny ones, plus a break of the low. Draw from the highest point possible to the peak. If it cuts wicks, move to the next highest point.",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 14, y2: 157.78, label: "downtrend line" }
          ],
          notes: [
            { x: 6, y: 153.65, text: "valley" },
            { x: 9, y: 162.88, text: "peak" },
            { x: 14, y: 147.45, text: "lower low" }
          ]
        }
      },
      {
        title: "Basing at or below the line",
        narration: "Price pauses in basing candles. They sit at or below the downtrend line. That is the key check: for this zone to be the one that removed the line, its basing must be at or below it.",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 },
            { o: 148.89, h: 149.63, l: 148.61, c: 149.26 },
            { o: 149.26, h: 149.7, l: 148.59, c: 148.85 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 16, y2: 156.06, label: "downtrend line" }
          ],
          notes: [
            { x: 6, y: 153.65, text: "valley" },
            { x: 9, y: 162.88, text: "peak" },
            { x: 14, y: 147.45, text: "lower low" }
          ],
          highlight: { from: 15, to: 16, label: "basing below the line" }
        }
      },
      {
        title: "Touch = respect, full close = removal",
        narration: "A candle touching the line is respecting it, so keep extending. The line is removed only by a candle that closes fully above, with nothing touching.",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 },
            { o: 148.89, h: 149.63, l: 148.61, c: 149.26 },
            { o: 149.26, h: 149.7, l: 148.59, c: 148.85 },
            { o: 148.85, h: 156.48, l: 148.73, c: 156.35 },
            { o: 156.35, h: 158.25, l: 156.15, c: 157.95 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.34, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 6, y: 153.65, text: "valley" },
            { x: 9, y: 162.88, text: "peak" },
            { x: 14, y: 147.45, text: "lower low" },
            { x: 18, y: 159.05, text: "removed" }
          ]
        }
      },
      {
        title: "So this demand removed the line",
        narration: "The explosive move came from basing at the line, and it removed the trendline. Rule 2: this demand goes in the chain. Trim it to a size similar to your other zones.",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 },
            { o: 148.89, h: 149.63, l: 148.61, c: 149.26 },
            { o: 149.26, h: 149.7, l: 148.59, c: 148.85 },
            { o: 148.85, h: 156.48, l: 148.73, c: 156.35 },
            { o: 156.35, h: 158.25, l: 156.15, c: 157.95 },
            { o: 157.95, h: 159.28, l: 157.6, c: 158.91 },
            { o: 158.91, h: 159.78, l: 158.56, c: 159.45 }
          ],
          zones: [
            { from: 15, to: 20, top: 149.26, bottom: 148.59, kind: "demand", label: "demand: removed the trendline" }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.34, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 6, y: 153.65, text: "valley" },
            { x: 9, y: 162.88, text: "peak" },
            { x: 14, y: 147.45, text: "lower low" },
            { x: 18, y: 159.05, text: "removed" }
          ]
        }
      },
      {
        title: "If the basing were fully above...",
        narration: "If the whole basing sat above the line, the line was already broken. That basing and move away did not remove it. Always ask: what did it remove?",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 },
            { o: 148.89, h: 149.63, l: 148.61, c: 149.26 },
            { o: 149.26, h: 149.7, l: 148.59, c: 148.85 },
            { o: 148.85, h: 156.48, l: 148.73, c: 156.35 },
            { o: 156.35, h: 158.25, l: 156.15, c: 157.95 },
            { o: 157.95, h: 159.28, l: 157.6, c: 158.91 },
            { o: 158.91, h: 159.78, l: 158.56, c: 159.45 },
            { o: 159.45, h: 161.36, l: 159.21, c: 160.98 },
            { o: 160.98, h: 163.32, l: 160.53, c: 162.66 },
            { o: 162.66, h: 164.21, l: 162.22, c: 163.95 },
            { o: 163.95, h: 164.29, l: 160.66, c: 161.32 },
            { o: 161.32, h: 161.58, l: 159.04, c: 159.32 },
            { o: 159.32, h: 159.81, l: 156.19, c: 156.74 },
            { o: 156.74, h: 157.31, l: 153.17, c: 153.82 },
            { o: 153.82, h: 154.1, l: 150.96, c: 151.46 },
            { o: 151.46, h: 151.64, l: 148.96, c: 149.86 },
            { o: 149.86, h: 152.81, l: 149.51, c: 152.32 },
            { o: 152.32, h: 154.4, l: 151.87, c: 153.83 },
            { o: 153.83, h: 156.04, l: 153.24, c: 155.4 },
            { o: 155.4, h: 158.34, l: 155.06, c: 158.04 },
            { o: 158.04, h: 159.89, l: 157.67, c: 159.43 },
            { o: 159.43, h: 161.33, l: 159.15, c: 160.86 }
          ],
          zones: [
            { from: 15, to: 35, top: 149.26, bottom: 148.59, kind: "demand", label: "demand: removed the trendline" }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.34, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 6, y: 153.65, text: "valley" },
            { x: 9, y: 162.88, text: "peak" },
            { x: 14, y: 147.45, text: "lower low" },
            { x: 18, y: 159.05, text: "removed" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "For a demand to count as removing a DOWNWARD trendline, where must its basing be?",
        options: [
          "At or below the trendline",
          "Fully above the trendline",
          "Anywhere",
          "On a higher timeframe"
        ],
        answer: 0,
        explain: "Even if the line only touches the basing wick, it counts. If the basing is fully above, that move did not remove the line."
      },
      {
        type: "tf",
        q: "A candle that touches the trendline and closes back is a removal.",
        answer: false,
        explain: "A touch that does not close beyond is a RESPECT of the line. Extend it."
      },
      {
        type: "spot",
        q: "This old downtrend line has a new peak and a new lower low after it. Click the recent peak the UPDATED line should start from.",
        scene: {
          candles: [
            { o: 170, h: 171.61, l: 169.42, c: 171.22 },
            { o: 171.22, h: 172.21, l: 170.85, c: 172 },
            { o: 172, h: 172.2, l: 168.72, c: 169.15 },
            { o: 169.15, h: 169.56, l: 166.82, c: 167.16 },
            { o: 167.16, h: 167.78, l: 165.34, c: 165.83 },
            { o: 165.83, h: 166.24, l: 162.62, c: 162.99 },
            { o: 162.99, h: 165.6, l: 162.63, c: 165.07 },
            { o: 165.07, h: 166.56, l: 164.49, c: 166.12 },
            { o: 166.12, h: 168.59, l: 165.67, c: 167.98 },
            { o: 167.98, h: 168.64, l: 165.11, c: 165.38 },
            { o: 165.38, h: 165.94, l: 163.41, c: 163.92 },
            { o: 163.92, h: 164.39, l: 162.27, c: 162.71 },
            { o: 162.71, h: 163.3, l: 159.45, c: 159.98 },
            { o: 159.98, h: 161.51, l: 159.42, c: 161.05 },
            { o: 161.05, h: 163.14, l: 160.75, c: 162.83 },
            { o: 162.83, h: 165.12, l: 162.22, c: 164.48 },
            { o: 164.48, h: 164.78, l: 162.18, c: 162.73 },
            { o: 162.73, h: 162.96, l: 160.18, c: 160.66 },
            { o: 160.66, h: 161.11, l: 158.28, c: 158.63 },
            { o: 158.63, h: 159.14, l: 156.13, c: 156.48 },
            { o: 156.48, h: 158.22, l: 156.1, c: 157.94 },
            { o: 157.94, h: 159.12, l: 157.37, c: 158.72 },
            { o: 158.72, h: 160.14, l: 158.3, c: 159.48 }
          ],
          trendlines: [
            { x1: 2, y1: 172.2, x2: 15, y2: 165.59, label: "old line" }
          ]
        },
        answer: { from: 9, to: 9 },
        explain: "After peak, valley, peak, lower low, draw the updated line from the most recent peak. The updated line is the one he wants on your chart."
      },
      {
        type: "mcq",
        q: "Two supply candidates both qualify. The upper one qualified first; the lower one looks better. Which goes in the chain?",
        options: [
          "The first one that qualified",
          "The better-looking one",
          "Both",
          "Neither"
        ],
        answer: 0,
        explain: "For the chain, only the zone that qualified first counts. In real trading you could trade the better one."
      },
      {
        type: "mcq",
        q: "Why was the stop wider on the Euro trade?",
        options: [
          "A daily demand was in control, so the trade needed wiggle room",
          "Because of NFP",
          "Because it was Monday",
          "Wider stops are always best"
        ],
        answer: 0,
        explain: "It was not about NFP. A higher-timeframe zone was in control. For a momentum trade a wide stop makes less sense."
      },
      {
        type: "tf",
        q: "An explosive move that removed nothing still goes in the chain analysis.",
        answer: false,
        explain: "Even a very explosive move that removed nothing is not in the chain. Kevin is only debating a future rule (move away 4-5x the basing); it is not a rule yet."
      },
      {
        type: "order",
        q: "Order Kevin's check when a zone is removed.",
        items: [
          "A zone is respected, then removed",
          "Look for the opposing zone that removed it",
          "Measure close candidates if needed",
          "Put the first qualifying one in the chain"
        ],
        explain: "There usually is one, but not always."
      }
    ],
    practice: [
      {
        prompt: "Plan the trade on the demand that removed the downtrend line.",
        scene: {
          candles: [
            { o: 164, h: 166.07, l: 163.7, c: 165.54 },
            { o: 165.54, h: 166.97, l: 165.3, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 166.57, l: 164.05, c: 164.44 },
            { o: 164.44, h: 164.65, l: 160.48, c: 160.71 },
            { o: 160.71, h: 161.14, l: 156.27, c: 156.86 },
            { o: 156.86, h: 157.38, l: 154.45, c: 154.89 },
            { o: 154.89, h: 157.48, l: 154.56, c: 156.81 },
            { o: 156.81, h: 159, l: 156.18, c: 158.33 },
            { o: 158.33, h: 162.08, l: 157.78, c: 161.39 },
            { o: 161.39, h: 161.69, l: 158.04, c: 158.39 },
            { o: 158.39, h: 158.7, l: 154.74, c: 155.36 },
            { o: 155.36, h: 155.76, l: 151.87, c: 152.36 },
            { o: 152.36, h: 152.85, l: 150.36, c: 151 },
            { o: 151, h: 151.49, l: 148.25, c: 148.89 },
            { o: 148.89, h: 149.63, l: 148.61, c: 149.26 },
            { o: 149.26, h: 149.7, l: 148.59, c: 148.85 },
            { o: 148.85, h: 156.48, l: 148.73, c: 156.35 },
            { o: 156.35, h: 158.25, l: 156.15, c: 157.95 },
            { o: 157.95, h: 159.28, l: 157.6, c: 158.91 },
            { o: 158.91, h: 159.78, l: 158.56, c: 159.45 },
            { o: 159.45, h: 161.36, l: 159.21, c: 160.98 },
            { o: 160.98, h: 163.32, l: 160.53, c: 162.66 },
            { o: 162.66, h: 164.21, l: 162.22, c: 163.95 },
            { o: 163.95, h: 164.29, l: 160.66, c: 161.32 },
            { o: 161.32, h: 161.58, l: 159.04, c: 159.32 },
            { o: 159.32, h: 159.81, l: 156.19, c: 156.74 },
            { o: 156.74, h: 157.31, l: 153.17, c: 153.82 },
            { o: 153.82, h: 154.1, l: 150.96, c: 151.46 },
            { o: 151.46, h: 151.64, l: 148.96, c: 149.86 },
            { o: 149.86, h: 152.81, l: 149.51, c: 152.32 },
            { o: 152.32, h: 154.4, l: 151.87, c: 153.83 },
            { o: 153.83, h: 156.04, l: 153.24, c: 155.4 },
            { o: 155.4, h: 158.34, l: 155.06, c: 158.04 },
            { o: 158.04, h: 159.89, l: 157.67, c: 159.43 },
            { o: 159.43, h: 161.33, l: 159.15, c: 160.86 }
          ],
          zones: [
            { from: 15, to: 23, top: 149.26, bottom: 148.59, kind: "demand", label: "demand" }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 18, y2: 154.34, label: "downtrend line", broken: true }
          ],
          reveal: 24
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 149.41, sl: 147.99, tp: 153.67 },
        explain: "Its basing sat at/below the line, so it removed it. Entry 149.41, stop 147.99, target 153.67."
      },
      {
        prompt: "The downtrend line broke through small candles. Later, basing ABOVE the line and an explosive candle. Is this a chain zone to buy?",
        scene: {
          candles: [
            { o: 168, h: 169.77, l: 167.7, c: 169.24 },
            { o: 169.24, h: 170.47, l: 169, c: 170 },
            { o: 170, h: 171.4, l: 169.2, c: 169.5 },
            { o: 169.5, h: 170.17, l: 167.78, c: 168.17 },
            { o: 168.17, h: 168.38, l: 164.55, c: 164.78 },
            { o: 164.78, h: 165.21, l: 160.69, c: 161.28 },
            { o: 161.28, h: 161.8, l: 159.05, c: 159.49 },
            { o: 159.49, h: 161.94, l: 159.16, c: 161.27 },
            { o: 161.27, h: 163.34, l: 160.64, c: 162.67 },
            { o: 162.67, h: 166.18, l: 162.12, c: 165.49 },
            { o: 165.49, h: 165.97, l: 162.29, c: 162.59 },
            { o: 162.59, h: 162.94, l: 159.34, c: 159.65 },
            { o: 159.65, h: 160.27, l: 156.35, c: 156.75 },
            { o: 156.75, h: 157.24, l: 155, c: 155.49 },
            { o: 155.49, h: 156.97, l: 154.93, c: 156.52 },
            { o: 156.52, h: 157.44, l: 156.17, c: 156.99 },
            { o: 156.99, h: 158.54, l: 156.67, c: 158.01 },
            { o: 158.01, h: 158.97, l: 157.53, c: 158.59 },
            { o: 158.59, h: 159.69, l: 158.24, c: 159.32 },
            { o: 159.32, h: 160.31, l: 158.98, c: 159.95 },
            { o: 159.95, h: 161.08, l: 159.57, c: 160.8 },
            { o: 160.8, h: 162.07, l: 160.37, c: 161.49 },
            { o: 161.49, h: 162.67, l: 161.07, c: 162.25 },
            { o: 162.25, h: 162.75, l: 161.85, c: 162.42 },
            { o: 162.42, h: 162.71, l: 161.7, c: 162.18 },
            { o: 162.18, h: 168.75, l: 162.1, c: 168.68 },
            { o: 168.68, h: 171.35, l: 168.49, c: 171.18 },
            { o: 171.18, h: 172.8, l: 170.77, c: 172.3 },
            { o: 172.3, h: 174.13, l: 172.03, c: 173.57 },
            { o: 173.57, h: 174.48, l: 172.95, c: 174.18 },
            { o: 174.18, h: 174.75, l: 171.61, c: 172.06 },
            { o: 172.06, h: 172.7, l: 169.31, c: 169.9 },
            { o: 169.9, h: 170.2, l: 166.72, c: 167.06 },
            { o: 167.06, h: 167.52, l: 164.25, c: 164.62 },
            { o: 164.62, h: 164.83, l: 162.12, c: 163.02 },
            { o: 163.02, h: 163.1, l: 159.23, c: 159.3 },
            { o: 159.3, h: 159.87, l: 157.79, c: 158.35 },
            { o: 158.35, h: 158.55, l: 156.69, c: 157.2 },
            { o: 157.2, h: 157.43, l: 155.64, c: 156.29 }
          ],
          zones: [
            { from: 23, to: 29, top: 162.42, bottom: 161.7, kind: "demand", label: "demand?" }
          ],
          trendlines: [
            { x1: 2, y1: 171.4, x2: 19, y2: 158.72, label: "downtrend line", broken: true }
          ],
          reveal: 30
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No. The basing sat fully above the line, so this move did not remove the trendline. It removed nothing, so it is not in the chain. Here it failed."
      }
    ],
    cards: [
      { front: "Basing vs downtrend line: where must it be to count?", back: "At or below the line (a wick touch counts)." },
      { front: "Touch without a close beyond?", back: "Respect. Keep extending the line." },
      { front: "New lower low after a downtrend line?", back: "Draw the updated line from the most recent peak." },
      { front: "Can a trendline cut candles while you wait?", back: "Yes, until price breaks it or makes a new high/low. Then update it." },
      { front: "Close call between two zones?", back: "Measure; the first that qualifies goes in the chain." },
      { front: "Higher-timeframe zone in control?", back: "Use a wider stop." },
      { front: "Do 1:1 to 3:1 swing trades depend on economic data?", back: "Hardly. Fundamentals matter more for big targets on higher timeframes." },
      { front: "Question for every zone?", back: "\"What did it remove?\"" }
    ],
    mnemonic: "Crouch under the fence to break the fence."
  },
  {
    mentor: "kevin-zoom",
    n: 7,
    eli5: {
      oneLiner: "A scary spike that pops back does not break the zone.",
      story: "You poke a balloon with your finger. It dents in deep, then pops back to its shape. It did not burst. But if the balloon pops, it is gone. A zone is the balloon: a wick that dents it and springs back is just a scare. A body that closes through it pops it.",
      analogy: "An emotional wick is like a sneeze in class: very loud, very quick, and then everything goes back to normal."
    },
    bigIdeas: [
      "Emotional wick: only the wick pierces, so the zone stays (but your stop is still hit). A body close beyond removes it.",
      "The stay-away candle must not touch the zone. A trendline-removal zone needs the line to touch its basing.",
      "Start trendlines from the most recent peak and valley, keep them daily-sized, and map all-time highs first."
    ],
    steps: [
      {
        title: "A 10 out of 10 demand",
        narration: "Single-candle basing, an amazing explosive move and a stay-away candle far from the zone. Kevin would take this \"all day, every day\".",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 }
          ],
          zones: [
            { from: 4, to: 7, top: 150.38, bottom: 149.74, kind: "demand", label: "demand 10/10" }
          ],
          highlight: { from: 4, to: 4, label: "single basing candle" }
        }
      },
      {
        title: "Price comes back",
        narration: "Price drifts back toward the zone. News is coming out: inflation data on the dollar.",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 },
            { o: 162.08, h: 163.31, l: 161.61, c: 162.96 },
            { o: 162.96, h: 165.13, l: 162.72, c: 164.55 },
            { o: 164.55, h: 166.03, l: 164.07, c: 165.37 },
            { o: 165.37, h: 165.98, l: 162.74, c: 162.96 },
            { o: 162.96, h: 163.25, l: 160.07, c: 160.45 },
            { o: 160.45, h: 160.86, l: 157.28, c: 157.49 },
            { o: 157.49, h: 157.73, l: 154.49, c: 155.07 },
            { o: 155.07, h: 155.45, l: 151.77, c: 152.18 }
          ],
          zones: [
            { from: 4, to: 15, top: 150.38, bottom: 149.74, kind: "demand", label: "demand 10/10" }
          ]
        }
      },
      {
        title: "An emotional wick",
        narration: "A giant wick spikes straight through the zone, then the candle body closes back up. That huge, news-driven wick is an emotional wick. Your stop would be hit, 100%.",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 },
            { o: 162.08, h: 163.31, l: 161.61, c: 162.96 },
            { o: 162.96, h: 165.13, l: 162.72, c: 164.55 },
            { o: 164.55, h: 166.03, l: 164.07, c: 165.37 },
            { o: 165.37, h: 165.98, l: 162.74, c: 162.96 },
            { o: 162.96, h: 163.25, l: 160.07, c: 160.45 },
            { o: 160.45, h: 160.86, l: 157.28, c: 157.49 },
            { o: 157.49, h: 157.73, l: 154.49, c: 155.07 },
            { o: 155.07, h: 155.45, l: 151.77, c: 152.18 },
            { o: 152.18, h: 152.48, l: 143.24, c: 150.78 }
          ],
          zones: [
            { from: 4, to: 16, top: 150.38, bottom: 149.74, kind: "demand", label: "demand 10/10" }
          ],
          notes: [
            { x: 16, y: 142.44, text: "emotional wick" }
          ]
        }
      },
      {
        title: "Only the wick? Keep the zone",
        narration: "Because ONLY the wick went through, the zone is not removed. Extend it. If the body had closed beyond the zone, even barely, it would be removed.",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 },
            { o: 162.08, h: 163.31, l: 161.61, c: 162.96 },
            { o: 162.96, h: 165.13, l: 162.72, c: 164.55 },
            { o: 164.55, h: 166.03, l: 164.07, c: 165.37 },
            { o: 165.37, h: 165.98, l: 162.74, c: 162.96 },
            { o: 162.96, h: 163.25, l: 160.07, c: 160.45 },
            { o: 160.45, h: 160.86, l: 157.28, c: 157.49 },
            { o: 157.49, h: 157.73, l: 154.49, c: 155.07 },
            { o: 155.07, h: 155.45, l: 151.77, c: 152.18 },
            { o: 152.18, h: 152.48, l: 143.24, c: 150.78 }
          ],
          zones: [
            { from: 4, to: 16, top: 150.38, bottom: 149.74, kind: "demand", label: "demand 10/10" }
          ],
          notes: [
            { x: 16, y: 142.44, text: "emotional wick" }
          ],
          highlight: { from: 16, to: 16, label: "body stayed in" }
        }
      },
      {
        title: "Respected afterwards",
        narration: "Price respects the zone and pushes up. That pattern is why Kevin extends zones through emotional wicks. On a daily swing chart this is out of your control; on a 1-minute chart into known news, it is your fault.",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 },
            { o: 162.08, h: 163.31, l: 161.61, c: 162.96 },
            { o: 162.96, h: 165.13, l: 162.72, c: 164.55 },
            { o: 164.55, h: 166.03, l: 164.07, c: 165.37 },
            { o: 165.37, h: 165.98, l: 162.74, c: 162.96 },
            { o: 162.96, h: 163.25, l: 160.07, c: 160.45 },
            { o: 160.45, h: 160.86, l: 157.28, c: 157.49 },
            { o: 157.49, h: 157.73, l: 154.49, c: 155.07 },
            { o: 155.07, h: 155.45, l: 151.77, c: 152.18 },
            { o: 152.18, h: 152.48, l: 143.24, c: 150.78 },
            { o: 150.78, h: 152.7, l: 150.51, c: 152.43 },
            { o: 152.43, h: 155.52, l: 152.07, c: 154.86 },
            { o: 154.86, h: 157.19, l: 154.34, c: 156.89 },
            { o: 156.89, h: 159.27, l: 156.67, c: 158.9 },
            { o: 158.9, h: 160.86, l: 158.24, c: 160.32 },
            { o: 160.32, h: 162.25, l: 159.71, c: 161.78 }
          ],
          zones: [
            { from: 4, to: 22, top: 150.38, bottom: 149.74, kind: "demand", label: "demand 10/10" }
          ],
          notes: [
            { x: 16, y: 142.44, text: "emotional wick" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle that REMOVED this demand zone.",
        scene: {
          candles: [
            { o: 160, h: 160.62, l: 156.62, c: 156.94 },
            { o: 156.94, h: 157.28, l: 154.48, c: 154.73 },
            { o: 154.73, h: 155.17, l: 152.07, c: 152.53 },
            { o: 152.53, h: 152.93, l: 149.54, c: 150 },
            { o: 150, h: 150.59, l: 149.74, c: 150.29 },
            { o: 150.29, h: 157.34, l: 150.12, c: 157.29 },
            { o: 157.29, h: 160.41, l: 157.09, c: 160.29 },
            { o: 160.29, h: 162.1, l: 159.66, c: 161.77 },
            { o: 161.77, h: 163.24, l: 161.4, c: 162.95 },
            { o: 162.95, h: 164.19, l: 162.65, c: 163.9 },
            { o: 163.9, h: 165.56, l: 163.39, c: 165.29 },
            { o: 165.29, h: 165.82, l: 162.16, c: 162.52 },
            { o: 162.52, h: 162.95, l: 159.76, c: 160.28 },
            { o: 160.28, h: 160.67, l: 156.81, c: 157.12 },
            { o: 157.12, h: 157.36, l: 154.59, c: 155.15 },
            { o: 155.15, h: 155.72, l: 151.76, c: 152.1 },
            { o: 152.1, h: 152.4, l: 148.74, c: 149.14 },
            { o: 149.14, h: 149.46, l: 147.1, c: 147.65 },
            { o: 147.65, h: 147.86, l: 145.29, c: 145.92 },
            { o: 145.92, h: 146.27, l: 144.39, c: 144.77 },
            { o: 144.77, h: 145.29, l: 142.89, c: 143.19 },
            { o: 143.19, h: 143.46, l: 141.8, c: 142.14 }
          ],
          zones: [
            { from: 4, to: 21, top: 150.29, bottom: 149.74, kind: "demand", label: "demand" }
          ]
        },
        answer: { from: 16, to: 16 },
        explain: "Its body closed below the zone. An emotional wick only saves a zone when it is just the wick."
      },
      {
        type: "tf",
        q: "A huge wick through a zone always removes it.",
        answer: false,
        explain: "Only the body closing beyond removes it. A huge wick alone is emotional: extend the zone. But a normal-sized wick through the zone is a normal break."
      },
      {
        type: "mcq",
        q: "What is a stay-away candle NOT allowed to do?",
        options: [
          "Touch the zone",
          "Be red",
          "Be small",
          "Be followed by another candle"
        ],
        answer: 0,
        explain: "\"The stay-away candle cannot touch the zone, or it is not a stay-away candle.\""
      },
      {
        type: "mcq",
        q: "Two valleys look alike: one is only a wick, one is made of candle bodies. Which makes the better valley?",
        options: [
          "The one built from bodies",
          "The wick one",
          "Both equal",
          "Neither"
        ],
        answer: 0,
        explain: "A valley formed by actual candles is better than one formed only by a wick."
      },
      {
        type: "mcq",
        q: "Why do students miss zones in the chain most often this week?",
        options: [
          "They did not map the all-time highs first",
          "They used the wrong colour",
          "They zoomed in",
          "They took too many trades"
        ],
        answer: 0,
        explain: "\"Map out the all-time highs, and then the chain will most likely be correct.\""
      },
      {
        type: "tf",
        q: "A candle with a massive wick (about half the candle) is a fine supply zone candle.",
        answer: false,
        explain: "That is a 50% candle. He does not really draw 50% candles as zones."
      },
      {
        type: "order",
        q: "Order: you got wicked out by news on a day-trading chart.",
        items: [
          "News time was known",
          "You left an order at the zone anyway",
          "An emotional wick stopped you",
          "That is your fault: check data times first"
        ],
        explain: "On a daily swing chart it is out of your control. On a day-trading chart into known news, check the data times before placing orders."
      }
    ],
    practice: [
      {
        prompt: "A news spike just pierced the demand with a huge wick, but the body closed back above. Is the zone still alive on your chart?",
        scene: {
          candles: [
            { o: 160, h: 160.46, l: 158.06, c: 158.46 },
            { o: 158.46, h: 158.89, l: 156.48, c: 156.8 },
            { o: 156.8, h: 157.28, l: 152.53, c: 153.09 },
            { o: 153.09, h: 153.42, l: 149.72, c: 150 },
            { o: 150, h: 150.74, l: 149.74, c: 150.38 },
            { o: 150.38, h: 157.5, l: 150.27, c: 157.38 },
            { o: 157.38, h: 160.54, l: 157.27, c: 160.38 },
            { o: 160.38, h: 162.35, l: 160.1, c: 162.08 },
            { o: 162.08, h: 163.31, l: 161.61, c: 162.96 },
            { o: 162.96, h: 165.13, l: 162.72, c: 164.55 },
            { o: 164.55, h: 166.03, l: 164.07, c: 165.37 },
            { o: 165.37, h: 165.98, l: 162.74, c: 162.96 },
            { o: 162.96, h: 163.25, l: 160.07, c: 160.45 },
            { o: 160.45, h: 160.86, l: 157.28, c: 157.49 },
            { o: 157.49, h: 157.73, l: 154.49, c: 155.07 },
            { o: 155.07, h: 155.45, l: 151.77, c: 152.18 },
            { o: 152.18, h: 152.48, l: 143.24, c: 150.78 },
            { o: 150.78, h: 152.7, l: 150.51, c: 152.43 },
            { o: 152.43, h: 155.52, l: 152.07, c: 154.86 },
            { o: 154.86, h: 157.19, l: 154.34, c: 156.89 },
            { o: 156.89, h: 159.27, l: 156.67, c: 158.9 },
            { o: 158.9, h: 160.86, l: 158.24, c: 160.32 },
            { o: 160.32, h: 162.25, l: 159.71, c: 161.78 }
          ],
          zones: [
            { from: 4, to: 16, top: 150.38, bottom: 149.74, kind: "demand", label: "demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Yes, keep it (buy side). Only the wick pierced: that is an emotional wick, so extend the zone. It was respected and price pushed up."
      },
      {
        prompt: "Basing and an explosive candle. Drawn at a normal size, the very next candle dips back into the zone. Do you buy the return?",
        scene: {
          candles: [
            { o: 162, h: 162.58, l: 158.51, c: 158.85 },
            { o: 158.85, h: 159.32, l: 156.42, c: 156.75 },
            { o: 156.75, h: 157.29, l: 153.32, c: 153.92 },
            { o: 153.92, h: 154.27, l: 151.56, c: 151.88 },
            { o: 151.88, h: 152.18, l: 149.49, c: 150.01 },
            { o: 150.01, h: 150.67, l: 149.66, c: 150.38 },
            { o: 150.38, h: 157.07, l: 150.2, c: 156.88 },
            { o: 156.88, h: 157.18, l: 150.18, c: 155.28 },
            { o: 155.28, h: 156.66, l: 155.05, c: 156.43 },
            { o: 156.43, h: 158.27, l: 156.07, c: 157.63 },
            { o: 157.63, h: 159.2, l: 157.11, c: 158.79 },
            { o: 158.79, h: 160.29, l: 158.57, c: 159.79 },
            { o: 159.79, h: 160.04, l: 158.01, c: 158.57 },
            { o: 158.57, h: 158.87, l: 156.45, c: 156.85 },
            { o: 156.85, h: 157.41, l: 155.5, c: 155.74 },
            { o: 155.74, h: 156.32, l: 153.57, c: 153.89 },
            { o: 153.89, h: 154.5, l: 151.93, c: 152.59 },
            { o: 152.59, h: 152.76, l: 150.08, c: 150.98 },
            { o: 150.98, h: 151.29, l: 149.38, c: 149.98 },
            { o: 149.98, h: 150.14, l: 146.97, c: 147.16 },
            { o: 147.16, h: 147.65, l: 145.88, c: 146.5 },
            { o: 146.5, h: 146.74, l: 144.94, c: 145.53 },
            { o: 145.53, h: 146.21, l: 143.82, c: 144.16 }
          ],
          zones: [
            { from: 5, to: 11, top: 150.38, bottom: 149.66, kind: "demand", label: "demand?" }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No zone. The stay-away candle cannot touch the zone, or it is not a stay-away candle. With no stay-away candle there is no space, so there is nothing to trade."
      }
    ],
    cards: [
      { front: "What is an emotional wick?", back: "An obvious, massive (usually news) wick through a zone where the body stays out." },
      { front: "Emotional wick: zone removed?", back: "No. Extend it. But your stop is still hit." },
      { front: "Body closes beyond the zone, even barely?", back: "Removed." },
      { front: "Can the stay-away candle touch the zone?", back: "No. Then it is not a stay-away candle." },
      { front: "Trendline-removal zone check?", back: "The line must touch the basing candles before the explosive move." },
      { front: "Trendline start point?", back: "The most recent peak and valley. Use two points, not three." },
      { front: "Weekly-sized line on the daily?", back: "Leave it on the weekly. It hides the lines in between." },
      { front: "Draw a flat all-time-high line in TradingView?", back: "Hold Shift while drawing." }
    ],
    mnemonic: "Dent, not pop: wick in and back = zone stays; body through = zone gone."
  },
  {
    mentor: "kevin-zoom",
    n: 8,
    eli5: {
      oneLiner: "No pause? Draw the zone at the tip, same size as the others.",
      story: "A ball is thrown hard at a wall and bounces right back. It never stopped, but we know exactly where it hit: the very tip. We mark the wall there, and we make the mark the same size as our other marks.",
      analogy: "Like a cookie cutter: every zone uses the same size cutter. When there is no basing, you press the cutter right at the tip of the move."
    },
    bigIdeas: [
      "No basing: distal at the extreme of the move, height copied from your other zones.",
      "Uptrend lines go on the lows, downtrend lines on the highs. End overextended lines; daily lines that are huge are really weekly.",
      "Every new low is an all-time low. A normal wick through a zone removes it; only an emotional wick does not."
    ],
    steps: [
      {
        title: "A normal supply for size",
        narration: "Here is a normal supply zone: basing, explosive drop, stay-away candle. Remember its size. We will copy it.",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 }
          ],
          zones: [
            { from: 3, to: 7, top: 156.39, bottom: 155.82, kind: "supply", label: "normal supply (size guide)" }
          ]
        }
      },
      {
        title: "A huge rally...",
        narration: "Later, price rallies with one huge candle.",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 },
            { o: 146.19, h: 146.57, l: 144.11, c: 144.54 },
            { o: 144.54, h: 144.9, l: 142.6, c: 143.05 },
            { o: 143.05, h: 143.31, l: 140.68, c: 141.14 },
            { o: 141.14, h: 142.4, l: 140.49, c: 141.94 },
            { o: 141.94, h: 143, l: 141.4, c: 142.42 },
            { o: 142.42, h: 143.49, l: 141.9, c: 143.14 },
            { o: 143.14, h: 152.21, l: 143.03, c: 152.14 }
          ],
          zones: [
            { from: 3, to: 14, top: 156.39, bottom: 155.82, kind: "supply", label: "normal supply (size guide)" }
          ],
          notes: [
            { x: 14, y: 142.23, text: "huge rally" }
          ]
        }
      },
      {
        title: "...then a huge drop, no basing",
        narration: "Straight away a huge drop. There is no basing candle between them. Rare, but you still want a zone here.",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 },
            { o: 146.19, h: 146.57, l: 144.11, c: 144.54 },
            { o: 144.54, h: 144.9, l: 142.6, c: 143.05 },
            { o: 143.05, h: 143.31, l: 140.68, c: 141.14 },
            { o: 141.14, h: 142.4, l: 140.49, c: 141.94 },
            { o: 141.94, h: 143, l: 141.4, c: 142.42 },
            { o: 142.42, h: 143.49, l: 141.9, c: 143.14 },
            { o: 143.14, h: 152.21, l: 143.03, c: 152.14 },
            { o: 152.14, h: 152.39, l: 142.53, c: 142.64 }
          ],
          zones: [
            { from: 3, to: 15, top: 156.39, bottom: 155.82, kind: "supply", label: "normal supply (size guide)" }
          ],
          notes: [
            { x: 14, y: 142.23, text: "huge rally" },
            { x: 15, y: 153.19, text: "huge drop" }
          ]
        }
      },
      {
        title: "Distal at the very top, copy the size",
        narration: "Put the distal line at the very top (the extreme). Then make the zone a similar size to your other zones. Do not shrink zones to fake a gap to the stay-away candle.",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 },
            { o: 146.19, h: 146.57, l: 144.11, c: 144.54 },
            { o: 144.54, h: 144.9, l: 142.6, c: 143.05 },
            { o: 143.05, h: 143.31, l: 140.68, c: 141.14 },
            { o: 141.14, h: 142.4, l: 140.49, c: 141.94 },
            { o: 141.94, h: 143, l: 141.4, c: 142.42 },
            { o: 142.42, h: 143.49, l: 141.9, c: 143.14 },
            { o: 143.14, h: 152.21, l: 143.03, c: 152.14 },
            { o: 152.14, h: 152.39, l: 142.53, c: 142.64 },
            { o: 142.64, h: 142.77, l: 139.48, c: 139.64 },
            { o: 139.64, h: 139.96, l: 138.28, c: 138.98 }
          ],
          zones: [
            { from: 3, to: 17, top: 156.39, bottom: 155.82, kind: "supply", label: "normal supply (size guide)" },
            { from: 14, to: 17, top: 152.39, bottom: 151.82, kind: "supply", label: "supply: no basing" }
          ],
          notes: [
            { x: 14, y: 142.23, text: "huge rally" },
            { x: 15, y: 153.19, text: "huge drop" }
          ],
          highlight: { from: 14, to: 15, label: "the turn" }
        }
      },
      {
        title: "Every new high or low counts",
        narration: "Every candle that makes a new low is an all-time low, not only obvious valleys. So when price breaks the all-time low and keeps going drop-base-drop, each one is a zone (rule 3).",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 },
            { o: 146.19, h: 146.57, l: 144.11, c: 144.54 },
            { o: 144.54, h: 144.9, l: 142.6, c: 143.05 },
            { o: 143.05, h: 143.31, l: 140.68, c: 141.14 },
            { o: 141.14, h: 142.4, l: 140.49, c: 141.94 },
            { o: 141.94, h: 143, l: 141.4, c: 142.42 },
            { o: 142.42, h: 143.49, l: 141.9, c: 143.14 },
            { o: 143.14, h: 152.21, l: 143.03, c: 152.14 },
            { o: 152.14, h: 152.39, l: 142.53, c: 142.64 },
            { o: 142.64, h: 142.77, l: 139.48, c: 139.64 },
            { o: 139.64, h: 139.96, l: 138.28, c: 138.98 },
            { o: 138.98, h: 139.22, l: 137.34, c: 137.97 },
            { o: 137.97, h: 138.44, l: 136.17, c: 136.64 },
            { o: 136.64, h: 138.67, l: 136.34, c: 138.46 },
            { o: 138.46, h: 141.08, l: 137.78, c: 140.58 },
            { o: 140.58, h: 142.72, l: 139.98, c: 142.32 },
            { o: 142.32, h: 144.27, l: 141.9, c: 144.05 },
            { o: 144.05, h: 147.28, l: 143.64, c: 146.93 },
            { o: 146.93, h: 149.81, l: 146.38, c: 149.61 },
            { o: 149.61, h: 152.12, l: 149.36, c: 151.22 },
            { o: 151.22, h: 151.9, l: 149.31, c: 149.85 },
            { o: 149.85, h: 150.1, l: 148.31, c: 148.67 },
            { o: 148.67, h: 149.07, l: 145.81, c: 146.3 },
            { o: 146.3, h: 146.95, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.55, l: 141.58, c: 141.94 },
            { o: 141.94, h: 142.5, l: 139.88, c: 140.22 }
          ],
          zones: [
            { from: 3, to: 32, top: 156.39, bottom: 155.82, kind: "supply", label: "normal supply (size guide)" },
            { from: 14, to: 32, top: 152.39, bottom: 151.82, kind: "supply", label: "supply: no basing" }
          ],
          notes: [
            { x: 14, y: 142.23, text: "huge rally" },
            { x: 15, y: 153.19, text: "huge drop" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Price broke the old all-time low. Click the basing candle of the SECOND drop-base-drop below it.",
        scene: {
          candles: [
            { o: 150, h: 150.22, l: 147.25, c: 147.45 },
            { o: 147.45, h: 147.7, l: 144.89, c: 145.27 },
            { o: 145.27, h: 145.75, l: 142.97, c: 143.61 },
            { o: 143.61, h: 144.14, l: 141.41, c: 141.99 },
            { o: 141.99, h: 143.65, l: 141.5, c: 143.27 },
            { o: 143.27, h: 144.91, l: 143.01, c: 144.4 },
            { o: 144.4, h: 146.52, l: 143.98, c: 146 },
            { o: 146, h: 146.57, l: 143.71, c: 144.11 },
            { o: 144.11, h: 144.35, l: 142.29, c: 142.65 },
            { o: 142.65, h: 142.87, l: 141.27, c: 141.5 },
            { o: 141.5, h: 142.19, l: 141.19, c: 141.72 },
            { o: 141.72, h: 141.91, l: 136.13, c: 136.22 },
            { o: 136.22, h: 136.34, l: 134.11, c: 134.22 },
            { o: 134.22, h: 135.23, l: 133.76, c: 135.02 },
            { o: 135.02, h: 135.44, l: 134.7, c: 135.18 },
            { o: 135.18, h: 135.25, l: 129.6, c: 129.68 },
            { o: 129.68, h: 129.78, l: 127.45, c: 127.68 },
            { o: 127.68, h: 128.76, l: 127.1, c: 128.48 },
            { o: 128.48, h: 128.89, l: 128.2, c: 128.66 },
            { o: 128.66, h: 128.89, l: 122.91, c: 123.16 },
            { o: 123.16, h: 123.36, l: 121.08, c: 121.16 },
            { o: 121.16, h: 122.18, l: 120.57, c: 121.96 },
            { o: 121.96, h: 122.23, l: 120.93, c: 121.48 },
            { o: 121.48, h: 122.1, l: 120.28, c: 120.96 }
          ],
          lines: [
            { y: 141.41, label: "old all-time low", kind: "level", from: 3 }
          ]
        },
        answer: { from: 14, to: 14 },
        explain: "Every candle making a new low is an all-time low, so each drop-base-drop below it forms a zone under rule 3."
      },
      {
        type: "mcq",
        q: "Where do you draw an uptrend line?",
        options: [
          "On the lows",
          "Across the tops",
          "Through the middle",
          "Anywhere it touches 3 times"
        ],
        answer: 0,
        explain: "Uptrend lines go on the bottom, downtrend lines on the top. A line across the top of an uptrend is a momentum line."
      },
      {
        type: "tf",
        q: "You may shrink a zone so there is a gap to the stay-away candle.",
        answer: false,
        explain: "Copy the size of a properly drawn zone. If at that size the candle touches, there is no zone."
      },
      {
        type: "mcq",
        q: "A big basing group has one candle with a huge wick. What does Kevin do?",
        options: [
          "Leave that candle out and use the other basing candles",
          "Include it and make a giant zone",
          "Skip the zone",
          "Use only the wick"
        ],
        answer: 0,
        explain: "He excluded the big-wick candle and used the other 3. If that wick were smaller he would include all of them."
      },
      {
        type: "tf",
        q: "A trendline touching your basing: wait until the stay-away candle closes fully beyond the line before drawing the zone.",
        answer: true,
        explain: "When the line touches the basing or explosive candle, he waits for the stay-away candle to close fully beyond the line."
      },
      {
        type: "mcq",
        q: "Drawing the WHOLE big basing area instead of the relevant group gives you...",
        options: [
          "Worse risk-reward but fewer stop-outs",
          "Better everything",
          "A new timeframe",
          "A trendline"
        ],
        answer: 0,
        explain: "\"There's no free lunch.\" For chain analysis we do not draw it that big."
      },
      {
        type: "order",
        q: "Order: drawing a zone with no basing.",
        items: [
          "Spot the huge move in, huge move out",
          "Put the distal at the extreme",
          "Copy the height of your other zones",
          "Wait for the stay-away candle"
        ],
        explain: "Distal at the very top (or bottom), then size it like your other zones."
      }
    ],
    practice: [
      {
        prompt: "A huge rally then a huge drop, with no basing between. Draw the supply zone the way Kevin does.",
        scene: {
          candles: [
            { o: 150, h: 152.12, l: 149.45, c: 151.63 },
            { o: 151.63, h: 154.72, l: 151.21, c: 154.11 },
            { o: 154.11, h: 156.45, l: 153.79, c: 156 },
            { o: 156, h: 156.22, l: 155.47, c: 155.82 },
            { o: 155.82, h: 156.39, l: 155.55, c: 156.14 },
            { o: 156.14, h: 156.33, l: 149.4, c: 149.64 },
            { o: 149.64, h: 149.72, l: 147.07, c: 147.14 },
            { o: 147.14, h: 147.36, l: 145.6, c: 146.19 },
            { o: 146.19, h: 146.57, l: 144.11, c: 144.54 },
            { o: 144.54, h: 144.9, l: 142.6, c: 143.05 },
            { o: 143.05, h: 143.31, l: 140.68, c: 141.14 },
            { o: 141.14, h: 142.4, l: 140.49, c: 141.94 },
            { o: 141.94, h: 143, l: 141.4, c: 142.42 },
            { o: 142.42, h: 143.49, l: 141.9, c: 143.14 },
            { o: 143.14, h: 152.21, l: 143.03, c: 152.14 },
            { o: 152.14, h: 152.39, l: 142.53, c: 142.64 },
            { o: 142.64, h: 142.77, l: 139.48, c: 139.64 },
            { o: 139.64, h: 139.96, l: 138.28, c: 138.98 },
            { o: 138.98, h: 139.22, l: 137.34, c: 137.97 },
            { o: 137.97, h: 138.44, l: 136.17, c: 136.64 },
            { o: 136.64, h: 138.67, l: 136.34, c: 138.46 },
            { o: 138.46, h: 141.08, l: 137.78, c: 140.58 },
            { o: 140.58, h: 142.72, l: 139.98, c: 142.32 },
            { o: 142.32, h: 144.27, l: 141.9, c: 144.05 },
            { o: 144.05, h: 147.28, l: 143.64, c: 146.93 },
            { o: 146.93, h: 149.81, l: 146.38, c: 149.61 },
            { o: 149.61, h: 152.12, l: 149.36, c: 151.22 },
            { o: 151.22, h: 151.9, l: 149.31, c: 149.85 },
            { o: 149.85, h: 150.1, l: 148.31, c: 148.67 },
            { o: 148.67, h: 149.07, l: 145.81, c: 146.3 },
            { o: 146.3, h: 146.95, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.55, l: 141.58, c: 141.94 },
            { o: 141.94, h: 142.5, l: 139.88, c: 140.22 }
          ],
          zones: [
            { from: 3, to: 19, top: 156.39, bottom: 155.82, kind: "supply", label: "size guide", faded: true }
          ],
          reveal: 20
        },
        task: "draw-zone",
        answer: { top: 152.39, bottom: 151.82 },
        explain: "Distal at the very top of the move (152.39), and copy the height of your other zones, so the proximal is 151.82."
      },
      {
        prompt: "A normal-sized candle's wick just broke below this demand, closing right at the bottom edge. Is the zone still valid for a buy?",
        scene: {
          candles: [
            { o: 160, h: 160.6, l: 157.11, c: 157.58 },
            { o: 157.58, h: 158.14, l: 154.39, c: 154.69 },
            { o: 154.69, h: 154.96, l: 151.51, c: 151.98 },
            { o: 151.98, h: 152.38, l: 149.55, c: 150 },
            { o: 150, h: 150.56, l: 149.61, c: 150.22 },
            { o: 150.22, h: 157.29, l: 149.98, c: 157.22 },
            { o: 157.22, h: 160.41, l: 156.99, c: 160.22 },
            { o: 160.22, h: 162.22, l: 159.92, c: 161.57 },
            { o: 161.57, h: 162.99, l: 161.27, c: 162.49 },
            { o: 162.49, h: 164.45, l: 161.89, c: 164.15 },
            { o: 164.15, h: 165.57, l: 163.8, c: 165.23 },
            { o: 165.23, h: 165.73, l: 162.34, c: 162.99 },
            { o: 162.99, h: 163.37, l: 159.24, c: 159.87 },
            { o: 159.87, h: 160.33, l: 157.63, c: 157.88 },
            { o: 157.88, h: 158.33, l: 154.38, c: 154.96 },
            { o: 154.96, h: 155.43, l: 151.62, c: 152.02 },
            { o: 152.02, h: 152.32, l: 148.71, c: 149.76 },
            { o: 149.76, h: 150.28, l: 148.38, c: 148.78 },
            { o: 148.78, h: 149.1, l: 146.79, c: 147.09 },
            { o: 147.09, h: 147.35, l: 144.75, c: 145.3 },
            { o: 145.3, h: 145.65, l: 144.31, c: 144.55 },
            { o: 144.55, h: 145.1, l: 142.38, c: 142.76 }
          ],
          zones: [
            { from: 4, to: 16, top: 150.22, bottom: 149.61, kind: "demand", label: "demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Removed. A body close is not always required: a normal-sized wick (not an emotional one) breaking the zone also removes it. Price kept falling."
      }
    ],
    cards: [
      { front: "Zone with no basing: where is the distal?", back: "At the extreme of the move (the very top or bottom)." },
      { front: "Zone with no basing: how tall?", back: "Similar to your other zones." },
      { front: "Which side does an uptrend line go?", back: "The lows. Downtrend lines go on the highs." },
      { front: "Normal wick through a zone?", back: "Removes it. Only an emotional wick does not." },
      { front: "Which lows are all-time lows?", back: "Every candle that makes a new low." },
      { front: "Big-wick candle in a big basing group?", back: "Leave it out; use the other basing candles." },
      { front: "Two zones drawn for one removal?", back: "Add a note saying which one is the qualifying zone." },
      { front: "Winning streak (4 for 4)?", back: "Expect a drawdown." }
    ],
    mnemonic: "Same cookie cutter, pressed at the tip."
  },
  {
    mentor: "kevin-zoom",
    n: 9,
    eli5: {
      oneLiner: "No big jump? No zone. Waiting is part of the game.",
      story: "You are fishing. Little fish nibble all day, but you wait for the big one. If you pull up every nibble, you catch nothing worth keeping. On the chart, small candles are the nibbles. We wait for the big explosive jump.",
      analogy: "A bigger nibble is still a nibble. Only the big tug on the line is the fish."
    },
    bigIdeas: [
      "Do not force zones. A bigger-than-usual basing candle is still a basing candle, and an explosive candle that removed nothing is not a zone.",
      "Include all close basing candles: distal at the extreme wick, proximal where the explosive move starts.",
      "End a trendline when an updated one forms or when price overextends. Judge all removals on the same timeframe."
    ],
    steps: [
      {
        title: "Lots of lows, few zones",
        narration: "Price keeps making new lows. Many candles here are just basing candles, some a bit bigger than their neighbours. A bigger basing candle is still a basing candle. Be patient: do not force zones.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 }
          ],
          notes: [
            { x: 14, y: 149.42, text: "new low" }
          ]
        }
      },
      {
        title: "Downtrend line: valley, peak, lower low",
        narration: "Starting point, an obvious valley, a peak, then a lower low. No lower low, no trendline. Draw it so it does not cut through candles.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 },
            { o: 150.9, h: 151.47, l: 150.54, c: 151.22 },
            { o: 151.22, h: 151.58, l: 150.53, c: 150.97 }
          ],
          trendlines: [
            { x1: 2, y1: 170.1, x2: 16, y2: 157.44, label: "downtrend line" }
          ],
          notes: [
            { x: 14, y: 149.42, text: "new low" }
          ]
        }
      },
      {
        title: "The trendline is removed",
        narration: "A candle closes fully above the line. Rule 2: a trendline was removed, so now look for the zone that did it.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 },
            { o: 150.9, h: 151.47, l: 150.54, c: 151.22 },
            { o: 151.22, h: 151.58, l: 150.53, c: 150.97 },
            { o: 150.97, h: 158.64, l: 150.8, c: 158.47 },
            { o: 158.47, h: 164.13, l: 158.29, c: 163.97 }
          ],
          trendlines: [
            { x1: 2, y1: 170.1, x2: 18, y2: 155.63, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 14, y: 149.42, text: "new low" },
            { x: 18, y: 164.93, text: "removed" }
          ]
        }
      },
      {
        title: "Use BOTH close basing candles",
        narration: "Two basing candles sit close together. Using both does not make the zone massive or tiny, so use both. Distal at the bottom wick (magnet tool). Proximal right where the explosive move starts.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 },
            { o: 150.9, h: 151.47, l: 150.54, c: 151.22 },
            { o: 151.22, h: 151.58, l: 150.53, c: 150.97 },
            { o: 150.97, h: 158.64, l: 150.8, c: 158.47 },
            { o: 158.47, h: 164.13, l: 158.29, c: 163.97 },
            { o: 163.97, h: 165.92, l: 163.45, c: 165.42 },
            { o: 165.42, h: 166.92, l: 164.89, c: 166.44 }
          ],
          zones: [
            { from: 15, to: 20, top: 151.22, bottom: 150.53, kind: "demand", label: "demand (both basing candles)" }
          ],
          lines: [
            { y: 151.22, label: "proximal", kind: "proximal", from: 15 },
            { y: 150.53, label: "distal", kind: "distal", from: 15 }
          ],
          trendlines: [
            { x1: 2, y1: 170.1, x2: 18, y2: 155.63, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 14, y: 149.42, text: "new low" },
            { x: 18, y: 164.93, text: "removed" }
          ],
          highlight: { from: 15, to: 16, label: "basing" }
        }
      },
      {
        title: "Next candle basing? Wrong place",
        narration: "Big tip: if the candle right after your zone is another basing candle, it is not the zone. The zone sits directly before the explosive candle. And judge every removal on the same timeframe.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 },
            { o: 150.9, h: 151.47, l: 150.54, c: 151.22 },
            { o: 151.22, h: 151.58, l: 150.53, c: 150.97 },
            { o: 150.97, h: 158.64, l: 150.8, c: 158.47 },
            { o: 158.47, h: 164.13, l: 158.29, c: 163.97 },
            { o: 163.97, h: 165.92, l: 163.45, c: 165.42 },
            { o: 165.42, h: 166.92, l: 164.89, c: 166.44 },
            { o: 166.44, h: 169.16, l: 165.78, c: 168.47 },
            { o: 168.47, h: 169.16, l: 165.63, c: 166.2 },
            { o: 166.2, h: 166.85, l: 162.05, c: 162.65 },
            { o: 162.65, h: 162.97, l: 159.71, c: 160.25 },
            { o: 160.25, h: 160.93, l: 156.56, c: 156.82 },
            { o: 156.82, h: 157.49, l: 152.89, c: 153.43 },
            { o: 153.43, h: 153.69, l: 150.92, c: 151.82 },
            { o: 151.82, h: 153.87, l: 151.34, c: 153.38 },
            { o: 153.38, h: 156, l: 152.91, c: 155.64 },
            { o: 155.64, h: 157.5, l: 155.2, c: 157.16 },
            { o: 157.16, h: 159.62, l: 156.55, c: 159.33 },
            { o: 159.33, h: 162.28, l: 158.84, c: 161.73 },
            { o: 161.73, h: 163.5, l: 161.11, c: 162.83 }
          ],
          zones: [
            { from: 15, to: 33, top: 151.22, bottom: 150.53, kind: "demand", label: "demand (both basing candles)" }
          ],
          lines: [
            { y: 151.22, label: "proximal", kind: "proximal", from: 15 },
            { y: 150.53, label: "distal", kind: "distal", from: 15 }
          ],
          trendlines: [
            { x1: 2, y1: 170.1, x2: 18, y2: 155.63, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 14, y: 149.42, text: "new low" },
            { x: 18, y: 164.93, text: "removed" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "A new valley and a higher high formed, so there is an updated line. Click where the OLD line should end.",
        scene: {
          candles: [
            { o: 120, h: 120.27, l: 118.68, c: 119.29 },
            { o: 119.29, h: 119.85, l: 117.46, c: 118 },
            { o: 118, h: 120.35, l: 117.51, c: 119.8 },
            { o: 119.8, h: 123.27, l: 119.13, c: 122.93 },
            { o: 122.93, h: 124.8, l: 122.36, c: 124.46 },
            { o: 124.46, h: 127.53, l: 124.08, c: 127.01 },
            { o: 127.01, h: 127.44, l: 125.05, c: 125.69 },
            { o: 125.69, h: 125.98, l: 123.29, c: 123.83 },
            { o: 123.83, h: 124.2, l: 121.79, c: 122.01 },
            { o: 122.01, h: 124.88, l: 121.39, c: 124.64 },
            { o: 124.64, h: 126.61, l: 124.34, c: 126.06 },
            { o: 126.06, h: 128.29, l: 125.62, c: 128.06 },
            { o: 128.06, h: 130.35, l: 127.53, c: 130 },
            { o: 130, h: 130.48, l: 128.64, c: 128.92 },
            { o: 128.92, h: 129.38, l: 127.12, c: 127.48 },
            { o: 127.48, h: 127.95, l: 124.9, c: 125.5 },
            { o: 125.5, h: 127.92, l: 125.21, c: 127.47 },
            { o: 127.47, h: 130.16, l: 126.97, c: 129.5 },
            { o: 129.5, h: 131.91, l: 129.02, c: 131.39 },
            { o: 131.39, h: 134.03, l: 130.7, c: 133.5 },
            { o: 133.5, h: 133.75, l: 131.65, c: 132.18 },
            { o: 132.18, h: 132.7, l: 130.97, c: 131.66 },
            { o: 131.66, h: 132.23, l: 129.85, c: 130.5 }
          ],
          trendlines: [
            { x1: 2, y1: 117.51, x2: 15, y2: 124.72, label: "old line" },
            { x1: 9, y1: 121.39, x2: 22, y2: 129, label: "updated line" }
          ]
        },
        answer: { from: 15, to: 18 },
        explain: "Once the updated line forms (new valley, then the higher high), the old one is invalid: end it around there. Homework expects both lines: the old one ended, the new one drawn."
      },
      {
        type: "tf",
        q: "A 1-minute zone can remove a monthly zone.",
        answer: false,
        explain: "Everything is on the exact same timeframe. If you trade the 5-minute, look for removals only on the 5-minute."
      },
      {
        type: "mcq",
        q: "A candle is clearly bigger than the tiny ones around it. Is it an explosive move away?",
        options: [
          "Not necessarily: it can just be a bigger basing candle",
          "Always yes",
          "Only if red",
          "Only on the daily"
        ],
        answer: 0,
        explain: "Compare it with real explosive moves, not with its tiny neighbours. A bigger basing candle is still basing."
      },
      {
        type: "mcq",
        q: "What is the recipe for a downtrend line?",
        options: [
          "Starting point, valley, peak, then a lower low",
          "Any two highs",
          "Three touches",
          "A valley and a peak only"
        ],
        answer: 0,
        explain: "No lower low means no trendline. Uptrend: peak, valley, then a higher high."
      },
      {
        type: "tf",
        q: "The demand failed, most likely because it was against the bigger downtrend.",
        answer: true,
        explain: "\"Trends and trendlines are vital.\" Spotting zones alone is not enough."
      },
      {
        type: "mcq",
        q: "Where must your distal line be?",
        options: [
          "At a reason, like the lowest wick of the basing",
          "At a random level",
          "At the round number",
          "Halfway up the basing"
        ],
        answer: 0,
        explain: "A distal placed at a random point makes no sense. Use the magnet tool on the extreme wick."
      },
      {
        type: "order",
        q: "Order the two reasons a trendline ends here.",
        items: [
          "An updated trendline replaces it",
          "Or price gets far overextended from it"
        ],
        explain: "Either reason ends the old line; you do not extend it forever."
      }
    ],
    practice: [
      {
        prompt: "Draw the demand that removed the downtrend line. There are two basing candles close together.",
        scene: {
          candles: [
            { o: 166, h: 167.15, l: 165.39, c: 166.88 },
            { o: 166.88, h: 169.06, l: 166.34, c: 168.5 },
            { o: 168.5, h: 170.1, l: 167.6, c: 167.9 },
            { o: 167.9, h: 168.45, l: 165.21, c: 165.7 },
            { o: 165.7, h: 166.04, l: 161.21, c: 161.88 },
            { o: 161.88, h: 162.22, l: 159.44, c: 160.01 },
            { o: 160.01, h: 160.53, l: 156.52, c: 156.9 },
            { o: 156.9, h: 159.05, l: 156.26, c: 158.62 },
            { o: 158.62, h: 161.33, l: 158.08, c: 161.04 },
            { o: 161.04, h: 163.77, l: 160.82, c: 163.4 },
            { o: 163.4, h: 164.02, l: 159.36, c: 159.91 },
            { o: 159.91, h: 160.21, l: 157.7, c: 157.93 },
            { o: 157.93, h: 158.37, l: 154.87, c: 155.22 },
            { o: 155.22, h: 155.75, l: 152.24, c: 152.59 },
            { o: 152.59, h: 153.07, l: 150.22, c: 150.9 },
            { o: 150.9, h: 151.47, l: 150.54, c: 151.22 },
            { o: 151.22, h: 151.58, l: 150.53, c: 150.97 },
            { o: 150.97, h: 158.64, l: 150.8, c: 158.47 },
            { o: 158.47, h: 164.13, l: 158.29, c: 163.97 },
            { o: 163.97, h: 165.92, l: 163.45, c: 165.42 },
            { o: 165.42, h: 166.92, l: 164.89, c: 166.44 },
            { o: 166.44, h: 169.16, l: 165.78, c: 168.47 },
            { o: 168.47, h: 169.16, l: 165.63, c: 166.2 },
            { o: 166.2, h: 166.85, l: 162.05, c: 162.65 },
            { o: 162.65, h: 162.97, l: 159.71, c: 160.25 },
            { o: 160.25, h: 160.93, l: 156.56, c: 156.82 },
            { o: 156.82, h: 157.49, l: 152.89, c: 153.43 },
            { o: 153.43, h: 153.69, l: 150.92, c: 151.82 },
            { o: 151.82, h: 153.87, l: 151.34, c: 153.38 },
            { o: 153.38, h: 156, l: 152.91, c: 155.64 },
            { o: 155.64, h: 157.5, l: 155.2, c: 157.16 },
            { o: 157.16, h: 159.62, l: 156.55, c: 159.33 },
            { o: 159.33, h: 162.28, l: 158.84, c: 161.73 },
            { o: 161.73, h: 163.5, l: 161.11, c: 162.83 }
          ],
          trendlines: [
            { x1: 2, y1: 170.1, x2: 18, y2: 155.63, label: "downtrend line", broken: true }
          ],
          reveal: 22
        },
        task: "draw-zone",
        answer: { top: 151.22, bottom: 150.53 },
        explain: "Use both basing candles: top 151.22 where the explosive move starts (highest basing body), bottom 150.53 at the lowest wick. One candle only would be too tiny."
      },
      {
        prompt: "Price is making new lows and the downtrend line broke. Any zone to buy here?",
        scene: {
          candles: [
            { o: 168, h: 169.31, l: 167.42, c: 168.88 },
            { o: 168.88, h: 170.69, l: 168.52, c: 170 },
            { o: 170, h: 171.4, l: 169.2, c: 169.5 },
            { o: 169.5, h: 169.76, l: 166.52, c: 166.96 },
            { o: 166.96, h: 167.45, l: 164.29, c: 164.69 },
            { o: 164.69, h: 165.18, l: 162.19, c: 162.43 },
            { o: 162.43, h: 162.68, l: 159.06, c: 159.51 },
            { o: 159.51, h: 161.89, l: 159.27, c: 161.59 },
            { o: 161.59, h: 164.15, l: 161.09, c: 163.88 },
            { o: 163.88, h: 165.85, l: 163.6, c: 165.51 },
            { o: 165.51, h: 165.95, l: 162.47, c: 162.75 },
            { o: 162.75, h: 163.08, l: 160.7, c: 161.36 },
            { o: 161.36, h: 161.99, l: 158.21, c: 158.41 },
            { o: 158.41, h: 158.76, l: 154.84, c: 155.51 },
            { o: 155.51, h: 156.98, l: 155.12, c: 156.56 },
            { o: 156.56, h: 157.56, l: 156.01, c: 157.21 },
            { o: 157.21, h: 158.33, l: 156.78, c: 157.95 },
            { o: 157.95, h: 159.07, l: 157.52, c: 158.49 },
            { o: 158.49, h: 159.58, l: 158, c: 159.29 },
            { o: 159.29, h: 160.32, l: 158.73, c: 159.8 },
            { o: 159.8, h: 160.88, l: 159.39, c: 160.52 },
            { o: 160.52, h: 161.57, l: 159.99, c: 161.19 },
            { o: 161.19, h: 162.43, l: 160.93, c: 161.98 },
            { o: 161.98, h: 162.64, l: 161.5, c: 162.29 },
            { o: 162.29, h: 162.59, l: 161.83, c: 162.3 },
            { o: 162.3, h: 163.23, l: 161.84, c: 162.83 },
            { o: 162.83, h: 163.33, l: 162.58, c: 163.04 },
            { o: 163.04, h: 164.21, l: 162.63, c: 163.63 }
          ],
          trendlines: [
            { x1: 2, y1: 171.4, x2: 20, y2: 159.14, label: "downtrend line", broken: true }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No. Everything that broke the line was small basing-like candles with no explosive move away. Be patient and do not force a zone."
      }
    ],
    cards: [
      { front: "Week with almost no zones?", back: "The test is to not force zones. Draw nothing if nothing qualifies." },
      { front: "Bigger basing candle among tiny ones?", back: "Still a basing candle." },
      { front: "Two basing candles close together?", back: "Use both. Tighten only if the basing gets crazy." },
      { front: "Next candle after your zone is basing?", back: "Wrong place. Move the zone to right before the explosive candle." },
      { front: "Can a lower timeframe zone remove a higher timeframe zone?", back: "No. Removals are judged on the same timeframe." },
      { front: "When does a trendline end?", back: "When an updated line forms, or when price overextends." },
      { front: "Did a zone remove an earlier zone?", back: "Only if its basing actually went past it. Zoom in to check." },
      { front: "\"The best zones can fail, and...\"", back: "\"...the worst zones could work.\" That is why psychology matters." }
    ],
    mnemonic: "Nibbles are not fish: wait for the big tug."
  },
  {
    mentor: "kevin-zoom",
    n: 10,
    eli5: {
      oneLiner: "Trade near the road; far from it is the danger zone.",
      story: "A road has a white line down the middle and a ditch on the side. Driving near the line is safe and easy. Driving way out by the ditch, you can still move, but you must be very careful. A trendline is the road. The channel shows where the safe half ends.",
      analogy: "The 50% line is like the edge of the playground. Inside, play normally. Outside, a grown-up keeps a closer eye on you."
    },
    bigIdeas: [
      "Draw the trendline first, then the channel to the peak: line to 50% is the golden area, beyond 50% is overextended.",
      "If you must measure a move away to accept it, it is drawable only, not tradable.",
      "A normal-sized wick through a zone removes it; only an exaggerated wick is emotional. Never shrink a zone to fit."
    ],
    steps: [
      {
        title: "Draw the trendline first",
        narration: "Peak, valley, then a higher high: a valid uptrend line, from the lowest point possible to the valley without cutting candles.",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 11, y2: 132.3, label: "uptrend line" }
          ],
          notes: [
            { x: 6, y: 137.35, text: "peak" },
            { x: 8, y: 129.31, text: "valley" },
            { x: 11, y: 138.8, text: "higher high" }
          ]
        }
      },
      {
        title: "Add the channel",
        narration: "Put the channel tool on the trendline and drag the other side to the peak. It does not have to be perfect.",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 },
            { o: 137.73, h: 139.93, l: 137.32, c: 139.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 11, y2: 132.3, label: "uptrend line" },
            { x1: 2, y1: 133.64, x2: 12, y2: 140.92, label: "channel" }
          ],
          notes: [
            { x: 6, y: 137.35, text: "peak" },
            { x: 8, y: 129.31, text: "valley" },
            { x: 11, y: 138.8, text: "higher high" }
          ]
        }
      },
      {
        title: "Golden area vs danger zone",
        narration: "Between the trendline and the 50% line is the golden area: the best place to trade with the trend. Above 50% is the danger zone: price can still go up, but it is less likely.",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 },
            { o: 137.73, h: 139.93, l: 137.32, c: 139.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 11, y2: 132.3, label: "uptrend line" },
            { x1: 2, y1: 133.64, x2: 12, y2: 140.92, label: "channel" },
            { x1: 2, y1: 129.69, x2: 12, y2: 136.97, label: "50% line" }
          ],
          notes: [
            { x: 6, y: 137.35, text: "peak" },
            { x: 8, y: 129.31, text: "valley" },
            { x: 11, y: 138.8, text: "higher high" }
          ]
        }
      },
      {
        title: "Overextended: end the line",
        narration: "Price blasts far above the channel. The trendline is now basically irrelevant. End it around there; extending it says it still matters, and you would miss the next trendline.",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 },
            { o: 137.73, h: 139.93, l: 137.32, c: 139.49 },
            { o: 139.49, h: 145.67, l: 139.28, c: 145.49 },
            { o: 145.49, h: 150.57, l: 145.35, c: 150.49 },
            { o: 150.49, h: 152.92, l: 149.99, c: 152.65 },
            { o: 152.65, h: 154.38, l: 152.15, c: 153.74 },
            { o: 153.74, h: 155.91, l: 153.17, c: 155.7 },
            { o: 155.7, h: 158.05, l: 155.19, c: 157.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 14, y2: 134.48, label: "uptrend line (ended)" },
            { x1: 2, y1: 133.64, x2: 18, y2: 145.29 },
            { x1: 2, y1: 129.69, x2: 18, y2: 141.34, label: "50% line" }
          ],
          notes: [
            { x: 6, y: 137.35, text: "peak" },
            { x: 8, y: 129.31, text: "valley" },
            { x: 11, y: 138.8, text: "higher high" }
          ],
          highlight: { from: 13, to: 18, label: "overextended" }
        }
      },
      {
        title: "Manage harder up here",
        narration: "Trading in the golden area: normal management. Trading in the overextended area: allowed, but manage more aggressively. A counter-trend supply up here is more likely to work than one inside the golden area.",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 },
            { o: 137.73, h: 139.93, l: 137.32, c: 139.49 },
            { o: 139.49, h: 145.67, l: 139.28, c: 145.49 },
            { o: 145.49, h: 150.57, l: 145.35, c: 150.49 },
            { o: 150.49, h: 152.92, l: 149.99, c: 152.65 },
            { o: 152.65, h: 154.38, l: 152.15, c: 153.74 },
            { o: 153.74, h: 155.91, l: 153.17, c: 155.7 },
            { o: 155.7, h: 158.05, l: 155.19, c: 157.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 14, y2: 134.48, label: "uptrend line (ended)" },
            { x1: 2, y1: 133.64, x2: 18, y2: 145.29 },
            { x1: 2, y1: 129.69, x2: 18, y2: 141.34, label: "50% line" }
          ],
          notes: [
            { x: 6, y: 137.35, text: "peak" },
            { x: 8, y: 129.31, text: "valley" },
            { x: 11, y: 138.8, text: "higher high" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click a candle trading in the OVEREXTENDED area (above the 50% line).",
        scene: {
          candles: [
            { o: 128, h: 128.55, l: 126.59, c: 127.19 },
            { o: 127.19, h: 127.62, l: 125.58, c: 126 },
            { o: 126, h: 128.87, l: 125.74, c: 128.21 },
            { o: 128.21, h: 130.56, l: 127.82, c: 130.16 },
            { o: 130.16, h: 132.42, l: 129.5, c: 132 },
            { o: 132, h: 136.35, l: 131.4, c: 136 },
            { o: 136, h: 136.55, l: 132.98, c: 133.44 },
            { o: 133.44, h: 133.88, l: 131.81, c: 132.16 },
            { o: 132.16, h: 132.53, l: 130.11, c: 130.5 },
            { o: 130.5, h: 133.47, l: 130.2, c: 133.23 },
            { o: 133.23, h: 135.28, l: 132.99, c: 135.01 },
            { o: 135.01, h: 138, l: 134.43, c: 137.73 },
            { o: 137.73, h: 139.93, l: 137.32, c: 139.49 },
            { o: 139.49, h: 145.67, l: 139.28, c: 145.49 },
            { o: 145.49, h: 150.57, l: 145.35, c: 150.49 },
            { o: 150.49, h: 152.92, l: 149.99, c: 152.65 },
            { o: 152.65, h: 154.38, l: 152.15, c: 153.74 },
            { o: 153.74, h: 155.91, l: 153.17, c: 155.7 },
            { o: 155.7, h: 158.05, l: 155.19, c: 157.49 }
          ],
          trendlines: [
            { x1: 2, y1: 125.74, x2: 18, y2: 137.39, label: "uptrend line" },
            { x1: 2, y1: 133.64, x2: 18, y2: 145.29 },
            { x1: 2, y1: 129.69, x2: 18, y2: 141.34, label: "50% line" }
          ]
        },
        answer: { from: 12, to: 18 },
        explain: "Once price is above the channel's 50% line it is overextended: tradable, but manage more aggressively."
      },
      {
        type: "mcq",
        q: "You had to measure a borderline move away to say it qualifies. Should you trade it?",
        options: [
          "No: tricky to draw means not tradable",
          "Yes, it qualified",
          "Only with a bigger lot",
          "Only on Monday"
        ],
        answer: 0,
        explain: "\"For a tricky zone the question is: is it drawable? For an obvious zone: is it tradable?\" If you don't know, avoid it."
      },
      {
        type: "tf",
        q: "Drawing a zone smaller can make a weak move away look good enough.",
        answer: true,
        explain: "That is why you never shrink zones to justify the move away or stay-away candle. Drawn at proper size, the move away is much worse."
      },
      {
        type: "mcq",
        q: "A large trendline exists, but a smaller valid trendline sits inside it. Which do you draw?",
        options: [
          "The smaller, more recent one",
          "The large one",
          "Both forever",
          "Neither"
        ],
        answer: 0,
        explain: "Draw larger trendlines only if there are no trendlines in between. Keep one trendline at a time."
      },
      {
        type: "mcq",
        q: "You enter on the 5-minute. Where does your direction come from?",
        options: [
          "The 1-hour, then add the daily (\"higher timeframe plus one\")",
          "The 1-minute",
          "The news",
          "A coin flip"
        ],
        answer: 0,
        explain: "Entry 5M, direction H1, context daily. He enters H4/H1 and uses daily, weekly and monthly."
      },
      {
        type: "tf",
        q: "New day traders should use several entry timeframes at once.",
        answer: false,
        explain: "Stick to ONE entry timeframe. His own early mistake was trading 5M, 15M, H4 and H1 at once."
      },
      {
        type: "order",
        q: "Order: using the channel tool.",
        items: [
          "Draw the trendline normally",
          "Place the channel on the trendline",
          "Drag the other side to the peak (uptrend)",
          "Read the 50% line: golden area vs overextended"
        ],
        explain: "The channel is not used to draw the trendline. It only checks how far price has run."
      }
    ],
    practice: [
      {
        prompt: "This demand made a new all-time high with a very clear explosive move. \"Never a question.\" Plan the trade.",
        scene: {
          candles: [
            { o: 148, h: 150.22, l: 147.58, c: 149.79 },
            { o: 149.79, h: 152.72, l: 149.55, c: 152.42 },
            { o: 152.42, h: 154.82, l: 151.72, c: 154.6 },
            { o: 154.6, h: 157.66, l: 154.34, c: 157 },
            { o: 157, h: 157.6, l: 153.95, c: 154.62 },
            { o: 154.62, h: 154.9, l: 151.86, c: 152.25 },
            { o: 152.25, h: 152.8, l: 149.29, c: 149.75 },
            { o: 149.75, h: 150.19, l: 145.78, c: 146.13 },
            { o: 146.13, h: 146.5, l: 143.6, c: 143.99 },
            { o: 143.99, h: 144.51, l: 143.64, c: 144.3 },
            { o: 144.3, h: 152.36, l: 144.24, c: 152.3 },
            { o: 152.3, h: 155.59, l: 152.22, c: 155.5 },
            { o: 155.5, h: 156.98, l: 155.09, c: 156.54 },
            { o: 156.54, h: 158.16, l: 155.94, c: 157.65 },
            { o: 157.65, h: 159.79, l: 157.23, c: 159.51 },
            { o: 159.51, h: 160.15, l: 156.38, c: 156.88 },
            { o: 156.88, h: 157.09, l: 154.56, c: 155.13 },
            { o: 155.13, h: 155.69, l: 152.15, c: 152.66 },
            { o: 152.66, h: 153.26, l: 149.85, c: 150.33 },
            { o: 150.33, h: 150.72, l: 148.36, c: 148.72 },
            { o: 148.72, h: 149.3, l: 146.24, c: 146.5 },
            { o: 146.5, h: 146.68, l: 144, c: 144.9 },
            { o: 144.9, h: 147.28, l: 144.49, c: 146.64 },
            { o: 146.64, h: 148.71, l: 145.97, c: 148.08 },
            { o: 148.08, h: 151.23, l: 147.8, c: 151 },
            { o: 151, h: 153.48, l: 150.31, c: 153.13 },
            { o: 153.13, h: 155.95, l: 152.65, c: 155.27 },
            { o: 155.27, h: 157.1, l: 154.97, c: 156.9 }
          ],
          zones: [
            { from: 9, to: 14, top: 144.3, bottom: 143.64, kind: "demand", label: "demand" }
          ],
          lines: [
            { y: 157.66, label: "old all-time high", kind: "level", from: 3 }
          ],
          reveal: 15
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 144.45, sl: 143.04, tp: 148.68 },
        explain: "Obvious zone: rule 3 (all-time high), single basing, explosive move, big space. Entry 144.45, stop 143.04, target 148.68."
      },
      {
        prompt: "This wick through the demand is bigger than the nearby wicks. A student says \"emotional wick, keep the zone\". Buy the next touch?",
        scene: {
          candles: [
            { o: 160, h: 160.28, l: 156.46, c: 156.88 },
            { o: 156.88, h: 157.51, l: 153.32, c: 153.74 },
            { o: 153.74, h: 154.4, l: 151.21, c: 151.59 },
            { o: 151.59, h: 152.2, l: 149.58, c: 150 },
            { o: 150, h: 150.83, l: 149.56, c: 150.41 },
            { o: 150.41, h: 157.61, l: 150.23, c: 157.41 },
            { o: 157.41, h: 160.56, l: 157.24, c: 160.41 },
            { o: 160.41, h: 162.12, l: 160.03, c: 161.48 },
            { o: 161.48, h: 163.02, l: 160.98, c: 162.67 },
            { o: 162.67, h: 165.2, l: 162.23, c: 164.56 },
            { o: 164.56, h: 165.7, l: 163.9, c: 165.41 },
            { o: 165.41, h: 165.83, l: 162.21, c: 162.84 },
            { o: 162.84, h: 163.31, l: 159.53, c: 159.81 },
            { o: 159.81, h: 160.44, l: 156.47, c: 156.7 },
            { o: 156.7, h: 156.91, l: 153.75, c: 154.09 },
            { o: 154.09, h: 154.57, l: 151.89, c: 152.2 },
            { o: 152.2, h: 152.5, l: 148.66, c: 149.71 },
            { o: 149.71, h: 150.28, l: 147.35, c: 147.97 },
            { o: 147.97, h: 148.66, l: 146.62, c: 147.08 },
            { o: 147.08, h: 147.45, l: 145.22, c: 145.62 },
            { o: 145.62, h: 145.87, l: 144.14, c: 144.74 },
            { o: 144.74, h: 145.06, l: 142.14, c: 142.71 }
          ],
          zones: [
            { from: 4, to: 16, top: 150.41, bottom: 149.56, kind: "demand", label: "demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No. The wick is normal-sized for that candle, so this is a normal break: the zone is removed. An emotional wick is far larger, exaggerated compared with the body."
      }
    ],
    cards: [
      { front: "Golden area?", back: "Between the trendline and the channel's 50% line." },
      { front: "Above the 50% line (uptrend)?", back: "Overextended / danger zone: manage more aggressively." },
      { front: "Counter-trend zone odds?", back: "Better in the overextended area than in the golden area." },
      { front: "Had to measure the move away?", back: "Drawable, not tradable." },
      { front: "Normal wick vs emotional wick?", back: "Normal-sized wick = removal. Only an exaggerated wick is emotional." },
      { front: "Learning path?", back: "Free S&D course, then private lessons, then Sunday sessions." },
      { front: "How many instruments for day trading?", back: "4-5 max. Avoid whippy yen crosses." },
      { front: "Win rate vs risk-reward?", back: "Linked: bigger targets mean a lower win rate." }
    ],
    mnemonic: "Line to half = golden path; past half = hold on tight."
  },
  {
    mentor: "kevin-zoom",
    n: 11,
    eli5: {
      oneLiner: "Start the line at the top, slide it down until it cuts nothing.",
      story: "Imagine laying a ruler across the tops of some blocks. If the ruler pokes into a block, it is not lying right. You lower one end until it only touches the tops. Then the ruler is right.",
      analogy: "A trendline is a rope over the tops of hills. The rope can touch the hilltops, but it can never go through a hill."
    },
    bigIdeas: [
      "Anchor from the highest point possible; if the line cuts candles, lower it to the next highest point.",
      "A trendline is removed by the first full wick-and-body close beyond it, not by the explosive candle.",
      "An all-time low is only a potential zone. A wick almost the size of its candle means a large basing candle."
    ],
    steps: [
      {
        title: "Peak, valley, LOWER LOW",
        narration: "A downtrend line needs a starting point, a valley, a peak and, most importantly, a lower low. No lower low, no trendline, however you draw it.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 }
          ],
          notes: [
            { x: 6, y: 152.66, text: "valley" },
            { x: 9, y: 161.8, text: "peak" },
            { x: 14, y: 146.72, text: "lower low" }
          ]
        }
      },
      {
        title: "Try the highest point...",
        narration: "Start from the highest point possible to the next peak. But look: this line cuts through a candle. We never cut through candles.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 }
          ],
          trendlines: [
            { x1: 2, y1: 168.1, x2: 9, y2: 161, label: "cuts a candle", broken: true }
          ],
          notes: [
            { x: 6, y: 152.66, text: "valley" },
            { x: 9, y: 161.8, text: "peak" },
            { x: 14, y: 146.72, text: "lower low" }
          ]
        }
      },
      {
        title: "...then lower it",
        narration: "Lower the anchor to the next highest point that cuts nothing. That is why his start points sometimes look random. They are not.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 },
            { o: 148, h: 148.78, l: 147.76, c: 148.33 },
            { o: 148.33, h: 148.78, l: 147.6, c: 147.92 }
          ],
          trendlines: [
            { x1: 3, y1: 167.75, x2: 16, y2: 153.13, label: "downtrend line" }
          ],
          notes: [
            { x: 6, y: 152.66, text: "valley" },
            { x: 9, y: 161.8, text: "peak" },
            { x: 14, y: 146.72, text: "lower low" },
            { x: 3, y: 168.55, text: "next highest point" }
          ]
        }
      },
      {
        title: "Not the explosive candle",
        narration: "The explosive candle pierces the line, but it still touches. The removal is the first candle whose wick AND body sit fully above. End the line there.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 },
            { o: 148, h: 148.78, l: 147.76, c: 148.33 },
            { o: 148.33, h: 148.78, l: 147.6, c: 147.92 },
            { o: 147.92, h: 155.48, l: 147.85, c: 155.42 },
            { o: 155.42, h: 161.14, l: 155.27, c: 160.92 }
          ],
          trendlines: [
            { x1: 3, y1: 167.75, x2: 18, y2: 150.88, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 6, y: 152.66, text: "valley" },
            { x: 9, y: 161.8, text: "peak" },
            { x: 14, y: 146.72, text: "lower low" },
            { x: 3, y: 168.55, text: "next highest point" },
            { x: 17, y: 156.28, text: "pierces, still touching" },
            { x: 18, y: 161.94, text: "removal" }
          ]
        }
      },
      {
        title: "Distal at the basing",
        narration: "The demand that removed the line: distal line at the basing wick, never at a random level. Every zone must have a name for what it removed.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 },
            { o: 148, h: 148.78, l: 147.76, c: 148.33 },
            { o: 148.33, h: 148.78, l: 147.6, c: 147.92 },
            { o: 147.92, h: 155.48, l: 147.85, c: 155.42 },
            { o: 155.42, h: 161.14, l: 155.27, c: 160.92 },
            { o: 160.92, h: 163.12, l: 160.68, c: 162.55 },
            { o: 162.55, h: 164.35, l: 162.33, c: 163.83 }
          ],
          zones: [
            { from: 15, to: 20, top: 148.33, bottom: 147.6, kind: "demand", label: "demand: removed the line" }
          ],
          trendlines: [
            { x1: 3, y1: 167.75, x2: 18, y2: 150.88, label: "downtrend line", broken: true }
          ],
          notes: [
            { x: 6, y: 152.66, text: "valley" },
            { x: 9, y: 161.8, text: "peak" },
            { x: 14, y: 146.72, text: "lower low" },
            { x: 3, y: 168.55, text: "next highest point" },
            { x: 17, y: 156.28, text: "pierces, still touching" },
            { x: 18, y: 161.94, text: "removal" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle that removed the line (careful: not the explosive one).",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 },
            { o: 148, h: 148.78, l: 147.76, c: 148.33 },
            { o: 148.33, h: 148.78, l: 147.6, c: 147.92 },
            { o: 147.92, h: 155.48, l: 147.85, c: 155.42 },
            { o: 155.42, h: 161.14, l: 155.27, c: 160.92 },
            { o: 160.92, h: 163.12, l: 160.68, c: 162.55 },
            { o: 162.55, h: 164.35, l: 162.33, c: 163.83 },
            { o: 163.83, h: 165.84, l: 163.31, c: 165.42 }
          ],
          trendlines: [
            { x1: 3, y1: 167.75, x2: 21, y2: 147.5, label: "downtrend line" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "The explosive candle still touches the line. The first candle fully above, wick and body, removes it."
      },
      {
        type: "tf",
        q: "If the line from the highest point cuts candles, keep it anyway.",
        answer: false,
        explain: "\"We never cut through candles for a trendline.\" Lower it to the next highest point."
      },
      {
        type: "mcq",
        q: "A candle's wick is almost the size of the whole candle. Is it a zone?",
        options: [
          "Close to not a zone: it is a large basing candle",
          "A perfect zone",
          "A trendline",
          "An all-time high"
        ],
        answer: 0,
        explain: "If the wick were about half the size he would accept it."
      },
      {
        type: "mcq",
        q: "Price fell below the channel briefly but pushed straight back into the line and respected it. What happens to the line?",
        options: [
          "Keep extending it",
          "End it immediately",
          "Delete everything",
          "Redraw from the top"
        ],
        answer: 0,
        explain: "If price had really fallen off he would end it. Here it came straight back, so it stays (a close call)."
      },
      {
        type: "tf",
        q: "Trendlines and zones are drawn the same way on every timeframe.",
        answer: true,
        explain: "\"Price is fractal.\" He draws them identically on the 1 minute or the 1 month."
      },
      {
        type: "mcq",
        q: "Kevin's trading layout?",
        options: [
          "H1 with daily as HTF; H4 with weekly as HTF",
          "Only 1-minute",
          "Monthly entries",
          "Random"
        ],
        answer: 0,
        explain: "New traders should stick to one entry timeframe. He handles two after 7 years."
      },
      {
        type: "order",
        q: "Order the uptrend line structure.",
        items: [
          "Starting point",
          "Peak",
          "Valley",
          "Higher high"
        ],
        explain: "Downtrend is the inverse: starting point, valley, peak, lower low."
      }
    ],
    practice: [
      {
        prompt: "The line was removed (by the full close, not the explosive candle). Plan the trade on the demand that removed it.",
        scene: {
          candles: [
            { o: 164, h: 165.74, l: 163.5, c: 165.24 },
            { o: 165.24, h: 167.13, l: 164.77, c: 166.5 },
            { o: 166.5, h: 168.1, l: 165.6, c: 165.9 },
            { o: 165.9, h: 167.75, l: 164.7, c: 165 },
            { o: 165, h: 165.43, l: 161.97, c: 162.41 },
            { o: 162.41, h: 163.03, l: 157.92, c: 158.33 },
            { o: 158.33, h: 158.87, l: 153.46, c: 154 },
            { o: 154, h: 156.48, l: 153.61, c: 156.08 },
            { o: 156.08, h: 158.68, l: 155.82, c: 158.19 },
            { o: 158.19, h: 161, l: 157.7, c: 160.5 },
            { o: 160.5, h: 161.01, l: 158.15, c: 158.48 },
            { o: 158.48, h: 158.71, l: 154.93, c: 155.5 },
            { o: 155.5, h: 156.19, l: 152.26, c: 152.61 },
            { o: 152.61, h: 152.88, l: 149.23, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.52, c: 148 },
            { o: 148, h: 148.78, l: 147.76, c: 148.33 },
            { o: 148.33, h: 148.78, l: 147.6, c: 147.92 },
            { o: 147.92, h: 155.48, l: 147.85, c: 155.42 },
            { o: 155.42, h: 161.14, l: 155.27, c: 160.92 },
            { o: 160.92, h: 163.12, l: 160.68, c: 162.55 },
            { o: 162.55, h: 164.35, l: 162.33, c: 163.83 },
            { o: 163.83, h: 165.84, l: 163.31, c: 165.42 },
            { o: 165.42, h: 165.99, l: 161.09, c: 161.5 },
            { o: 161.5, h: 162.08, l: 158.22, c: 158.57 },
            { o: 158.57, h: 159.05, l: 155.2, c: 155.57 },
            { o: 155.57, h: 156.19, l: 152.5, c: 152.78 },
            { o: 152.78, h: 153.04, l: 150.01, c: 150.53 },
            { o: 150.53, h: 150.75, l: 148.03, c: 148.93 },
            { o: 148.93, h: 150.47, l: 148.27, c: 150.06 },
            { o: 150.06, h: 152.09, l: 149.64, c: 151.6 },
            { o: 151.6, h: 153.5, l: 151.14, c: 153.15 },
            { o: 153.15, h: 155.82, l: 152.51, c: 155.62 },
            { o: 155.62, h: 158.31, l: 155.22, c: 157.96 },
            { o: 157.96, h: 160.19, l: 157.72, c: 159.93 }
          ],
          zones: [
            { from: 15, to: 21, top: 148.33, bottom: 147.6, kind: "demand", label: "demand" }
          ],
          trendlines: [
            { x1: 3, y1: 167.75, x2: 18, y2: 150.88, label: "downtrend line", broken: true }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: { side: "buy", entry: 148.48, sl: 147, tp: 152.92 },
        explain: "Entry 148.48 at the proximal, stop 147 beyond the distal (placed at the basing wick). Target 152.92 was reached."
      },
      {
        prompt: "Price broke the uptrend line, drifting lower in small candles to fresh lows. Every new wick is an all-time low. Sell here?",
        scene: {
          candles: [
            { o: 144, h: 144.39, l: 142.67, c: 143.01 },
            { o: 143.01, h: 143.66, l: 141.56, c: 142 },
            { o: 142, h: 142.8, l: 140.6, c: 142.5 },
            { o: 142.5, h: 145.96, l: 142.21, c: 145.59 },
            { o: 145.59, h: 147.87, l: 145.08, c: 147.5 },
            { o: 147.5, h: 150.29, l: 147.25, c: 149.63 },
            { o: 149.63, h: 152.99, l: 149.33, c: 152.51 },
            { o: 152.51, h: 152.98, l: 149.53, c: 149.85 },
            { o: 149.85, h: 150.1, l: 148.15, c: 148.58 },
            { o: 148.58, h: 149.18, l: 145.99, c: 146.52 },
            { o: 146.52, h: 150.13, l: 146.15, c: 149.74 },
            { o: 149.74, h: 152.92, l: 149.38, c: 152.4 },
            { o: 152.4, h: 155.31, l: 151.99, c: 154.92 },
            { o: 154.92, h: 157.02, l: 154.26, c: 156.53 },
            { o: 156.53, h: 157.08, l: 155.18, c: 155.54 },
            { o: 155.54, h: 156.01, l: 154.61, c: 155.14 },
            { o: 155.14, h: 155.41, l: 153.96, c: 154.37 },
            { o: 154.37, h: 154.76, l: 153.18, c: 153.68 },
            { o: 153.68, h: 154.01, l: 152.33, c: 152.68 },
            { o: 152.68, h: 152.94, l: 151.65, c: 152.19 },
            { o: 152.19, h: 152.51, l: 151.17, c: 151.46 },
            { o: 151.46, h: 151.81, l: 150.44, c: 150.95 },
            { o: 150.95, h: 151.52, l: 149.56, c: 149.89 },
            { o: 149.89, h: 150.23, l: 148.91, c: 149.25 },
            { o: 149.25, h: 149.77, l: 148.67, c: 148.95 },
            { o: 148.95, h: 149.34, l: 147.86, c: 148.36 },
            { o: 148.36, h: 148.77, l: 147.84, c: 148.17 },
            { o: 148.17, h: 148.55, l: 147.25, c: 147.59 }
          ],
          trendlines: [
            { x1: 2, y1: 140.6, x2: 19, y2: 153.69, label: "uptrend line", broken: true }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "No. An all-time low means a POTENTIAL zone, not a guaranteed one. The price action is terrible: no explosive move away, so no zone."
      }
    ],
    cards: [
      { front: "Line from the highest point cuts candles?", back: "Lower the anchor to the next highest point." },
      { front: "Does the explosive candle remove the line?", back: "Not if it still touches. The first full wick-and-body close beyond does." },
      { front: "After removal, do you continue the line?", back: "No. End it where it was removed." },
      { front: "Brief overextension that is reclaimed at once?", back: "Keep extending the line." },
      { front: "Wick nearly the size of the candle?", back: "A large basing candle, not a zone." },
      { front: "Every new wick below the all-time low?", back: "A new all-time low: a potential zone, not a guaranteed one." },
      { front: "Where does the distal line go?", back: "At the basing, never at a random level." },
      { front: "Momentum-like steep line?", back: "Not the trendline. Look for the obvious peak, valley and lower low." }
    ],
    mnemonic: "Rope over hills, never through: start high, slide down till clean."
  },
  {
    mentor: "kevin-zoom",
    n: 12,
    eli5: {
      oneLiner: "The bigger the gap under the stay-away candle, the better the zone.",
      story: "Three kids jump off a step. The first lands far away: great jump. The second lands right next to the step: hardly a jump. The third lands at a good distance: pretty good. You can tell how good each jump was just by the gap.",
      analogy: "The space is like the score on a test. Big space, top marks. Tiny space, you still write it down, but you do not bet on it."
    },
    bigIdeas: [
      "Grade every zone by the space between the stay-away candle and the proximal line.",
      "Never shrink a zone to make space. If it is too small next to other zones, widen the proximal side a little.",
      "After an all-time low, a removed zone or a removed trendline, check the closest explosive candle first."
    ],
    steps: [
      {
        title: "Zone 1: big space",
        narration: "Single-candle basing, a very obvious explosive move and a stay-away candle far away. Big space between them.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 }
          ],
          zones: [
            { from: 4, to: 7, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" }
          ]
        }
      },
      {
        title: "Zone 1 works",
        narration: "Price comes back and launches. A great zone, a good trade.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 }
          ],
          zones: [
            { from: 4, to: 17, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" }
          ]
        }
      },
      {
        title: "Zone 2: almost no space",
        narration: "Same recipe, but the stay-away candle's wick reaches almost back to the proximal line. Very little space. Drawable, not tradable.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 },
            { o: 152.98, h: 153.22, l: 150.5, c: 150.88 },
            { o: 150.88, h: 151.32, l: 149.32, c: 149.69 },
            { o: 149.69, h: 150.29, l: 147.26, c: 147.91 },
            { o: 147.91, h: 148.31, l: 145.5, c: 145.97 },
            { o: 145.97, h: 146.67, l: 145.55, c: 146.31 },
            { o: 146.31, h: 151.91, l: 146.18, c: 151.81 },
            { o: 151.81, h: 152.11, l: 146.61, c: 151.01 },
            { o: 151.01, h: 152.22, l: 150.77, c: 151.74 }
          ],
          zones: [
            { from: 4, to: 25, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" },
            { from: 22, to: 25, top: 146.31, bottom: 145.55, kind: "demand", label: "tiny space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" },
            { x: 24, y: 152.91, text: "tiny space" }
          ]
        }
      },
      {
        title: "Zone 2 fails",
        narration: "Price comes back and breaks straight through. That trade was \"completely avoidable\".",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 },
            { o: 152.98, h: 153.22, l: 150.5, c: 150.88 },
            { o: 150.88, h: 151.32, l: 149.32, c: 149.69 },
            { o: 149.69, h: 150.29, l: 147.26, c: 147.91 },
            { o: 147.91, h: 148.31, l: 145.5, c: 145.97 },
            { o: 145.97, h: 146.67, l: 145.55, c: 146.31 },
            { o: 146.31, h: 151.91, l: 146.18, c: 151.81 },
            { o: 151.81, h: 152.11, l: 146.61, c: 151.01 },
            { o: 151.01, h: 152.22, l: 150.77, c: 151.74 },
            { o: 151.74, h: 153.31, l: 151.27, c: 153.01 },
            { o: 153.01, h: 155.01, l: 152.34, c: 154.51 },
            { o: 154.51, h: 154.97, l: 152.02, c: 152.46 },
            { o: 152.46, h: 153.14, l: 150.7, c: 151.05 },
            { o: 151.05, h: 151.49, l: 147.86, c: 148.51 },
            { o: 148.51, h: 148.78, l: 146.01, c: 146.91 },
            { o: 146.91, h: 147.09, l: 143.46, c: 143.55 },
            { o: 143.55, h: 144.18, l: 142.35, c: 142.88 },
            { o: 142.88, h: 143.26, l: 141.56, c: 142.05 },
            { o: 142.05, h: 142.63, l: 139.64, c: 140.21 },
            { o: 140.21, h: 140.46, l: 138.65, c: 138.85 },
            { o: 138.85, h: 139.38, l: 136.44, c: 137.08 }
          ],
          zones: [
            { from: 4, to: 37, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" },
            { from: 22, to: 37, top: 146.31, bottom: 145.55, kind: "demand", label: "tiny space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" },
            { x: 24, y: 152.91, text: "tiny space" }
          ]
        }
      },
      {
        title: "Zone 3: decent space",
        narration: "Decent space between the stay-away candle and the zone. A pretty good zone.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 },
            { o: 152.98, h: 153.22, l: 150.5, c: 150.88 },
            { o: 150.88, h: 151.32, l: 149.32, c: 149.69 },
            { o: 149.69, h: 150.29, l: 147.26, c: 147.91 },
            { o: 147.91, h: 148.31, l: 145.5, c: 145.97 },
            { o: 145.97, h: 146.67, l: 145.55, c: 146.31 },
            { o: 146.31, h: 151.91, l: 146.18, c: 151.81 },
            { o: 151.81, h: 152.11, l: 146.61, c: 151.01 },
            { o: 151.01, h: 152.22, l: 150.77, c: 151.74 },
            { o: 151.74, h: 153.31, l: 151.27, c: 153.01 },
            { o: 153.01, h: 155.01, l: 152.34, c: 154.51 },
            { o: 154.51, h: 154.97, l: 152.02, c: 152.46 },
            { o: 152.46, h: 153.14, l: 150.7, c: 151.05 },
            { o: 151.05, h: 151.49, l: 147.86, c: 148.51 },
            { o: 148.51, h: 148.78, l: 146.01, c: 146.91 },
            { o: 146.91, h: 147.09, l: 143.46, c: 143.55 },
            { o: 143.55, h: 144.18, l: 142.35, c: 142.88 },
            { o: 142.88, h: 143.26, l: 141.56, c: 142.05 },
            { o: 142.05, h: 142.63, l: 139.64, c: 140.21 },
            { o: 140.21, h: 140.46, l: 138.65, c: 138.85 },
            { o: 138.85, h: 139.38, l: 136.44, c: 137.08 },
            { o: 137.08, h: 137.67, l: 134.68, c: 135.05 },
            { o: 135.05, h: 135.86, l: 134.69, c: 135.5 },
            { o: 135.5, h: 141.22, l: 135.41, c: 141 },
            { o: 141, h: 142, l: 138.7, c: 141.8 },
            { o: 141.8, h: 143.37, l: 141.26, c: 142.67 }
          ],
          zones: [
            { from: 4, to: 42, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" },
            { from: 22, to: 42, top: 146.31, bottom: 145.55, kind: "demand", label: "tiny space" },
            { from: 39, to: 42, top: 135.5, bottom: 134.69, kind: "demand", label: "decent space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" },
            { x: 24, y: 152.91, text: "tiny space" }
          ]
        }
      },
      {
        title: "It is no coincidence",
        narration: "Great, poor and pretty good, and the results matched the space. That space is how Kevin grades a zone. Poor-space zones are still drawn to see what removes them, just not traded.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 },
            { o: 152.98, h: 153.22, l: 150.5, c: 150.88 },
            { o: 150.88, h: 151.32, l: 149.32, c: 149.69 },
            { o: 149.69, h: 150.29, l: 147.26, c: 147.91 },
            { o: 147.91, h: 148.31, l: 145.5, c: 145.97 },
            { o: 145.97, h: 146.67, l: 145.55, c: 146.31 },
            { o: 146.31, h: 151.91, l: 146.18, c: 151.81 },
            { o: 151.81, h: 152.11, l: 146.61, c: 151.01 },
            { o: 151.01, h: 152.22, l: 150.77, c: 151.74 },
            { o: 151.74, h: 153.31, l: 151.27, c: 153.01 },
            { o: 153.01, h: 155.01, l: 152.34, c: 154.51 },
            { o: 154.51, h: 154.97, l: 152.02, c: 152.46 },
            { o: 152.46, h: 153.14, l: 150.7, c: 151.05 },
            { o: 151.05, h: 151.49, l: 147.86, c: 148.51 },
            { o: 148.51, h: 148.78, l: 146.01, c: 146.91 },
            { o: 146.91, h: 147.09, l: 143.46, c: 143.55 },
            { o: 143.55, h: 144.18, l: 142.35, c: 142.88 },
            { o: 142.88, h: 143.26, l: 141.56, c: 142.05 },
            { o: 142.05, h: 142.63, l: 139.64, c: 140.21 },
            { o: 140.21, h: 140.46, l: 138.65, c: 138.85 },
            { o: 138.85, h: 139.38, l: 136.44, c: 137.08 },
            { o: 137.08, h: 137.67, l: 134.68, c: 135.05 },
            { o: 135.05, h: 135.86, l: 134.69, c: 135.5 },
            { o: 135.5, h: 141.22, l: 135.41, c: 141 },
            { o: 141, h: 142, l: 138.7, c: 141.8 },
            { o: 141.8, h: 143.37, l: 141.26, c: 142.67 },
            { o: 142.67, h: 144.4, l: 142.38, c: 144.18 },
            { o: 144.18, h: 145.85, l: 143.55, c: 145.3 },
            { o: 145.3, h: 145.71, l: 141.8, c: 142.22 },
            { o: 142.22, h: 142.7, l: 139.38, c: 139.58 },
            { o: 139.58, h: 140.23, l: 137.28, c: 137.7 },
            { o: 137.7, h: 137.94, l: 135.2, c: 136.1 },
            { o: 136.1, h: 137.52, l: 135.67, c: 137.2 },
            { o: 137.2, h: 138.88, l: 136.58, c: 138.38 },
            { o: 138.38, h: 139.56, l: 138.09, c: 138.89 },
            { o: 138.89, h: 139.49, l: 137.92, c: 138.15 },
            { o: 138.15, h: 138.45, l: 136.83, c: 137.39 }
          ],
          zones: [
            { from: 4, to: 53, top: 143.38, bottom: 142.75, kind: "demand", label: "big space" },
            { from: 22, to: 53, top: 146.31, bottom: 145.55, kind: "demand", label: "tiny space" },
            { from: 39, to: 53, top: 135.5, bottom: 134.69, kind: "demand", label: "decent space" }
          ],
          notes: [
            { x: 6, y: 146.85, text: "big space" },
            { x: 24, y: 152.91, text: "tiny space" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the basing candle of the zone with the BEST space.",
        scene: {
          candles: [
            { o: 150, h: 150.3, l: 147.82, c: 148.23 },
            { o: 148.23, h: 148.77, l: 146.28, c: 146.49 },
            { o: 146.49, h: 147.16, l: 143.98, c: 144.62 },
            { o: 144.62, h: 145, l: 142.77, c: 143 },
            { o: 143, h: 143.58, l: 142.75, c: 143.38 },
            { o: 143.38, h: 150.5, l: 143.24, c: 150.38 },
            { o: 150.38, h: 153.62, l: 150.32, c: 153.38 },
            { o: 153.38, h: 155.04, l: 152.7, c: 154.64 },
            { o: 154.64, h: 156.02, l: 153.98, c: 155.49 },
            { o: 155.49, h: 157.21, l: 155.18, c: 156.88 },
            { o: 156.88, h: 157.16, l: 153.21, c: 153.7 },
            { o: 153.7, h: 154.05, l: 148.94, c: 149.17 },
            { o: 149.17, h: 149.84, l: 145.1, c: 145.58 },
            { o: 145.58, h: 145.84, l: 143.08, c: 143.98 },
            { o: 143.98, h: 147.18, l: 143.78, c: 146.68 },
            { o: 146.68, h: 149.55, l: 146.11, c: 149.15 },
            { o: 149.15, h: 151.47, l: 148.84, c: 150.88 },
            { o: 150.88, h: 153.38, l: 150.63, c: 152.98 },
            { o: 152.98, h: 153.22, l: 150.5, c: 150.88 },
            { o: 150.88, h: 151.32, l: 149.32, c: 149.69 },
            { o: 149.69, h: 150.29, l: 147.26, c: 147.91 },
            { o: 147.91, h: 148.31, l: 145.5, c: 145.97 },
            { o: 145.97, h: 146.67, l: 145.55, c: 146.31 },
            { o: 146.31, h: 151.91, l: 146.18, c: 151.81 },
            { o: 151.81, h: 152.11, l: 146.61, c: 151.01 },
            { o: 151.01, h: 152.22, l: 150.77, c: 151.74 },
            { o: 151.74, h: 153.31, l: 151.27, c: 153.01 },
            { o: 153.01, h: 155.01, l: 152.34, c: 154.51 },
            { o: 154.51, h: 154.97, l: 152.02, c: 152.46 },
            { o: 152.46, h: 153.14, l: 150.7, c: 151.05 },
            { o: 151.05, h: 151.49, l: 147.86, c: 148.51 },
            { o: 148.51, h: 148.78, l: 146.01, c: 146.91 },
            { o: 146.91, h: 147.09, l: 143.46, c: 143.55 },
            { o: 143.55, h: 144.18, l: 142.35, c: 142.88 },
            { o: 142.88, h: 143.26, l: 141.56, c: 142.05 },
            { o: 142.05, h: 142.63, l: 139.64, c: 140.21 },
            { o: 140.21, h: 140.46, l: 138.65, c: 138.85 },
            { o: 138.85, h: 139.38, l: 136.44, c: 137.08 },
            { o: 137.08, h: 137.67, l: 134.68, c: 135.05 },
            { o: 135.05, h: 135.86, l: 134.69, c: 135.5 },
            { o: 135.5, h: 141.22, l: 135.41, c: 141 },
            { o: 141, h: 142, l: 138.7, c: 141.8 },
            { o: 141.8, h: 143.37, l: 141.26, c: 142.67 },
            { o: 142.67, h: 144.4, l: 142.38, c: 144.18 }
          ],
          zones: [
            { from: 4, to: 43, top: 143.38, bottom: 142.75, kind: "demand" },
            { from: 22, to: 43, top: 146.31, bottom: 145.55, kind: "demand" },
            { from: 39, to: 43, top: 135.5, bottom: 134.69, kind: "demand" }
          ]
        },
        answer: { from: 4, to: 4 },
        explain: "Zone 1 has a stay-away candle far from the proximal line: the biggest space, the best zone."
      },
      {
        type: "tf",
        q: "To create space, draw the zone very small.",
        answer: false,
        explain: "\"We're not gonna make zones smaller just to fit.\" Draw it at a similar size to nearby zones, then judge it."
      },
      {
        type: "mcq",
        q: "Wick to wick, a supply is only half the size of nearby zones, and there are two basing sections. What does Kevin do?",
        options: [
          "Widen just the proximal side a little",
          "Swallow both basing sections",
          "Leave it tiny",
          "Delete it"
        ],
        answer: 0,
        explain: "Keep the distal on the wick and push the proximal slightly. Do not stretch over the other basing."
      },
      {
        type: "mcq",
        q: "An all-time low formed. Which candidate do you check first?",
        options: [
          "The explosive candle closest to it",
          "The biggest candle on the chart",
          "The oldest zone",
          "Any candle"
        ],
        answer: 0,
        explain: "The candidate is always the closest one to the trigger. If it fails the space check, try the next; if none qualify, no zone."
      },
      {
        type: "mcq",
        q: "Your basing is almost the size of the move-away candle. What is that telling you?",
        options: [
          "A sign to stay away",
          "A perfect zone",
          "Enter halfway",
          "Double your risk"
        ],
        answer: 0,
        explain: "\"It's kind of our sign to kind of stay away\", unless the higher timeframe is very convincing."
      },
      {
        type: "tf",
        q: "In trade reviews, post your results as dollar amounts.",
        answer: false,
        explain: "Never post dollar amounts, even on demo. Post percentages. Show the zone and the reaction."
      },
      {
        type: "mcq",
        q: "Entering halfway into the zone gives...",
        options: [
          "Higher R:R when it works, but fewer fills",
          "Only benefits",
          "Only losses",
          "A new zone"
        ],
        answer: 0,
        explain: "\"There's no free lunch.\" You get filled less often and miss some trades."
      }
    ],
    practice: [
      {
        prompt: "Supply with single-candle basing and a big space under the stay-away candle. Plan the trade.",
        scene: {
          candles: [
            { o: 140, h: 142.69, l: 139.79, c: 142.14 },
            { o: 142.14, h: 144.3, l: 141.62, c: 143.82 },
            { o: 143.82, h: 146.81, l: 143.25, c: 146.59 },
            { o: 146.59, h: 150.5, l: 145.93, c: 150.14 },
            { o: 150.14, h: 152.56, l: 149.68, c: 151.99 },
            { o: 151.99, h: 152.43, l: 151.28, c: 151.64 },
            { o: 151.64, h: 151.74, l: 144.89, c: 145.14 },
            { o: 145.14, h: 145.37, l: 141.53, c: 141.64 },
            { o: 141.64, h: 141.87, l: 139.89, c: 140.29 },
            { o: 140.29, h: 140.64, l: 138.55, c: 138.89 },
            { o: 138.89, h: 139.18, l: 137.35, c: 137.71 },
            { o: 137.71, h: 138.22, l: 136.14, c: 136.64 },
            { o: 136.64, h: 139.37, l: 136.06, c: 139.08 },
            { o: 139.08, h: 142.39, l: 138.87, c: 141.9 },
            { o: 141.9, h: 144.71, l: 141.44, c: 144.44 },
            { o: 144.44, h: 147.37, l: 144.19, c: 146.82 },
            { o: 146.82, h: 149.71, l: 146.43, c: 149.44 },
            { o: 149.44, h: 151.94, l: 149.26, c: 151.04 },
            { o: 151.04, h: 151.27, l: 149.02, c: 149.43 },
            { o: 149.43, h: 149.63, l: 146.57, c: 147.15 },
            { o: 147.15, h: 147.65, l: 145.84, c: 146.05 },
            { o: 146.05, h: 146.48, l: 143.48, c: 143.94 },
            { o: 143.94, h: 144.23, l: 141.95, c: 142.36 },
            { o: 142.36, h: 142.83, l: 140.81, c: 141.03 }
          ],
          zones: [
            { from: 5, to: 11, top: 152.43, bottom: 151.64, kind: "supply", label: "supply" }
          ],
          reveal: 12
        },
        task: "pick-entry",
        answer: { side: "sell", entry: 151.49, sl: 153.03, tp: 146.87 },
        explain: "Big space = good zone. Sell just before the proximal (151.49), stop beyond (153.03), and do not make it too tight: the spread can take out a tight stop."
      },
      {
        prompt: "Supply, but the stay-away candle's wick almost touches the zone. Sell the pullback?",
        scene: {
          candles: [
            { o: 140, h: 142.2, l: 139.57, c: 142 },
            { o: 142, h: 145.47, l: 141.52, c: 144.88 },
            { o: 144.88, h: 146.94, l: 144.25, c: 146.6 },
            { o: 146.6, h: 149.94, l: 146.35, c: 149.63 },
            { o: 149.63, h: 152.46, l: 149.08, c: 152 },
            { o: 152, h: 152.28, l: 151.47, c: 151.75 },
            { o: 151.75, h: 151.92, l: 145.07, c: 145.25 },
            { o: 145.25, h: 151.4, l: 144.95, c: 146.15 },
            { o: 146.15, h: 146.47, l: 144.52, c: 145.15 },
            { o: 145.15, h: 145.59, l: 143.67, c: 144 },
            { o: 144, h: 144.58, l: 142.5, c: 143.19 },
            { o: 143.19, h: 143.45, l: 141.04, c: 141.65 },
            { o: 141.65, h: 143.17, l: 141.07, c: 142.94 },
            { o: 142.94, h: 144.98, l: 142.72, c: 144.67 },
            { o: 144.67, h: 146.97, l: 144.24, c: 146.4 },
            { o: 146.4, h: 148.13, l: 145.87, c: 147.89 },
            { o: 147.89, h: 150.1, l: 147.34, c: 149.54 },
            { o: 149.54, h: 152.05, l: 149.26, c: 151.15 },
            { o: 151.15, h: 152.61, l: 150.61, c: 152.15 },
            { o: 152.15, h: 154.94, l: 152.05, c: 154.78 },
            { o: 154.78, h: 156.2, l: 154.48, c: 155.82 },
            { o: 155.82, h: 157.73, l: 155.56, c: 157.11 },
            { o: 157.11, h: 158.08, l: 156.53, c: 157.78 }
          ],
          zones: [
            { from: 5, to: 11, top: 152.28, bottom: 151.75, kind: "supply", label: "supply" }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Stay out. Minimal space under the stay-away candle = poor zone. Draw it for the chain; do not trade it. And do not shrink it to \"create\" space."
      }
    ],
    cards: [
      { front: "What grades a zone?", back: "The space between the stay-away candle and the proximal line." },
      { front: "Minimal space?", back: "Poor zone: draw it, don't trade it." },
      { front: "How many basing candles, what colour?", back: "1 to 3 (up to 5), any colour." },
      { front: "Two candles that look like one move?", back: "Not an explosive move away. It must be one explosive candle." },
      { front: "Zone too small vs neighbours, two basing sections?", back: "Widen the proximal side slightly." },
      { front: "Trigger happened (ATL, removal)?", back: "Check the closest explosive candle first." },
      { front: "Trade review rules?", back: "Show zone and reaction, percentages only, questions in the questions channel." },
      { front: "Keep getting stopped by a tight stop?", back: "Use a wider stop." }
    ],
    mnemonic: "Mind the gap: big gap, good zone."
  },
  {
    mentor: "kevin-zoom",
    n: 13,
    eli5: {
      oneLiner: "When a new step forms, move the handrail up to it.",
      story: "You climb stairs holding a handrail. When you reach a new landing, you grab the next rail that starts there. You do not walk back to the bottom to grab the first rail again. Trendlines work the same way: each new valley starts the new line.",
      analogy: "The old line's second touch is like the landing between two staircases: the end of one rail and the start of the next."
    },
    bigIdeas: [
      "A trendline needs an obvious peak and valley AND a break of the pivot before it. Small steps are momentum.",
      "Updated line: start from the most recent valley (the old second touch) and end the old line.",
      "Only two exceptions to the drawing rules: confirmation off a very convincing HTF zone, and macro charts (1 month and up)."
    ],
    steps: [
      {
        title: "Obvious valley is not enough",
        narration: "A steep move with small peaks and valleys is momentum. A trendline needs an obvious, deep peak and valley.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 }
          ],
          notes: [
            { x: 6, y: 128.33, text: "peak" },
            { x: 9, y: 120.82, text: "valley" }
          ]
        }
      },
      {
        title: "Break the pivot high",
        narration: "After the obvious valley, price must break the pivot high before it. Now it is a trendline: from the lowest point to the valley, not cutting candles.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 },
            { o: 124.25, h: 126.56, l: 123.94, c: 126 },
            { o: 126, h: 128.17, l: 125.65, c: 127.79 }
          ],
          trendlines: [
            { x1: 2, y1: 117.42, x2: 11, y2: 122.82, label: "trendline 1" }
          ],
          notes: [
            { x: 6, y: 128.33, text: "peak" },
            { x: 9, y: 120.82, text: "valley" },
            { x: 11, y: 128.97, text: "pivot broken" }
          ]
        }
      },
      {
        title: "A new valley forms",
        narration: "Price pulls back to a new, higher valley. Keep the line for now.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 },
            { o: 124.25, h: 126.56, l: 123.94, c: 126 },
            { o: 126, h: 128.17, l: 125.65, c: 127.79 },
            { o: 127.79, h: 130.54, l: 127.58, c: 129.99 },
            { o: 129.99, h: 130.4, l: 127.88, c: 128.14 },
            { o: 128.14, h: 128.43, l: 126.56, c: 126.89 },
            { o: 126.89, h: 127.55, l: 125.23, c: 125.49 },
            { o: 125.49, h: 127.59, l: 124.84, c: 127.26 }
          ],
          trendlines: [
            { x1: 2, y1: 117.42, x2: 16, y2: 125.82, label: "trendline 1" }
          ],
          notes: [
            { x: 6, y: 128.33, text: "peak" },
            { x: 9, y: 120.82, text: "valley" },
            { x: 11, y: 128.97, text: "pivot broken" }
          ]
        }
      },
      {
        title: "Updated trendline",
        narration: "The high breaks again, so there is an updated trendline. Do not start from the bottom again: the old line's second touch (the most recent valley before) becomes the first point of the new line. End the old one.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 },
            { o: 124.25, h: 126.56, l: 123.94, c: 126 },
            { o: 126, h: 128.17, l: 125.65, c: 127.79 },
            { o: 127.79, h: 130.54, l: 127.58, c: 129.99 },
            { o: 129.99, h: 130.4, l: 127.88, c: 128.14 },
            { o: 128.14, h: 128.43, l: 126.56, c: 126.89 },
            { o: 126.89, h: 127.55, l: 125.23, c: 125.49 },
            { o: 125.49, h: 127.59, l: 124.84, c: 127.26 },
            { o: 127.26, h: 130.79, l: 126.68, c: 130.09 }
          ],
          trendlines: [
            { x1: 2, y1: 117.42, x2: 16, y2: 125.82, label: "old (ended)" },
            { x1: 9, y1: 121.62, x2: 17, y2: 125.3, label: "updated line" }
          ],
          notes: [
            { x: 6, y: 128.33, text: "peak" },
            { x: 9, y: 120.82, text: "valley" },
            { x: 11, y: 128.97, text: "pivot broken" }
          ]
        }
      },
      {
        title: "Only end a line when there is a new one",
        narration: "About 95% of the time, when an updated line forms, end or delete the old one. Do not end a trendline unless there is a new one, or price overextends far from it.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 },
            { o: 124.25, h: 126.56, l: 123.94, c: 126 },
            { o: 126, h: 128.17, l: 125.65, c: 127.79 },
            { o: 127.79, h: 130.54, l: 127.58, c: 129.99 },
            { o: 129.99, h: 130.4, l: 127.88, c: 128.14 },
            { o: 128.14, h: 128.43, l: 126.56, c: 126.89 },
            { o: 126.89, h: 127.55, l: 125.23, c: 125.49 },
            { o: 125.49, h: 127.59, l: 124.84, c: 127.26 },
            { o: 127.26, h: 130.79, l: 126.68, c: 130.09 },
            { o: 130.09, h: 132.1, l: 129.7, c: 131.84 },
            { o: 131.84, h: 133.71, l: 131.25, c: 133.49 },
            { o: 133.49, h: 134.04, l: 131.9, c: 132.52 },
            { o: 132.52, h: 133.2, l: 131.08, c: 131.46 },
            { o: 131.46, h: 131.86, l: 129.94, c: 130.49 }
          ],
          trendlines: [
            { x1: 2, y1: 117.42, x2: 16, y2: 125.82, label: "old (ended)" },
            { x1: 9, y1: 121.62, x2: 22, y2: 127.6, label: "updated line" }
          ],
          notes: [
            { x: 6, y: 128.33, text: "peak" },
            { x: 9, y: 120.82, text: "valley" },
            { x: 11, y: 128.97, text: "pivot broken" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "An updated trendline just formed. Click the valley it should START from.",
        scene: {
          candles: [
            { o: 120, h: 120.24, l: 118.69, c: 118.91 },
            { o: 118.91, h: 119.13, l: 117.8, c: 118 },
            { o: 118, h: 120.02, l: 117.42, c: 119.49 },
            { o: 119.49, h: 121.86, l: 119.21, c: 121.51 },
            { o: 121.51, h: 124.42, l: 121.13, c: 123.94 },
            { o: 123.94, h: 127.49, l: 123.43, c: 127 },
            { o: 127, h: 127.53, l: 125.38, c: 125.75 },
            { o: 125.75, h: 126, l: 123.15, c: 123.72 },
            { o: 123.72, h: 124.12, l: 121.76, c: 122 },
            { o: 122, h: 124.91, l: 121.62, c: 124.25 },
            { o: 124.25, h: 126.56, l: 123.94, c: 126 },
            { o: 126, h: 128.17, l: 125.65, c: 127.79 },
            { o: 127.79, h: 130.54, l: 127.58, c: 129.99 },
            { o: 129.99, h: 130.4, l: 127.88, c: 128.14 },
            { o: 128.14, h: 128.43, l: 126.56, c: 126.89 },
            { o: 126.89, h: 127.55, l: 125.23, c: 125.49 },
            { o: 125.49, h: 127.59, l: 124.84, c: 127.26 },
            { o: 127.26, h: 130.79, l: 126.68, c: 130.09 }
          ],
          trendlines: [
            { x1: 2, y1: 117.42, x2: 17, y2: 126.42, label: "old line" }
          ]
        },
        answer: { from: 9, to: 9 },
        explain: "Start from the most recent valley before the new one: the old line's second touchpoint becomes the first point of the new line."
      },
      {
        type: "mcq",
        q: "Which are the ONLY two exceptions to \"zone must remove something\"?",
        options: [
          "Confirmation off a very convincing HTF zone, and macro charts (1M and up)",
          "Fridays and news days",
          "Gold and oil",
          "Any big candle"
        ],
        answer: 0,
        explain: "Even then he much prefers following the rules."
      },
      {
        type: "tf",
        q: "End an old trendline even when no new trendline has formed and price is still trading near it.",
        answer: false,
        explain: "\"Don't end a trendline unless there is a new one\" (or it gets overextended)."
      },
      {
        type: "mcq",
        q: "In tight ranging price, two zones were removed in a row. The third zone...",
        options: [
          "More often than not fails",
          "Always works",
          "Is a 10/10",
          "Must be traded with a bigger lot"
        ],
        answer: 0,
        explain: "That is how he avoided a loss on a 1H supply in a bearish daily."
      },
      {
        type: "tf",
        q: "A 10 out of 10 zone can still fail.",
        answer: true,
        explain: "The NASDAQ all-time-high zone had everything and failed. Don't get frustrated; it happens."
      },
      {
        type: "mcq",
        q: "A 5M zone that needs every basing candle is really sized like a 15M or 1H zone. What is wrong?",
        options: [
          "It is drawn for the wrong timeframe",
          "Nothing",
          "It is a trendline",
          "It is an emotional wick"
        ],
        answer: 0,
        explain: "Draw zones to fit the timeframe you are trading. A smaller single-candle zone on the 5M was its own trade."
      },
      {
        type: "order",
        q: "Order the uptrend recipe.",
        items: [
          "Obvious peak",
          "Obvious valley",
          "Break of the pivot high",
          "Draw from the valley to the next touch"
        ],
        explain: "Obvious valley alone is not enough: the pivot high must break."
      }
    ],
    practice: [
      {
        prompt: "Tight, choppy price. Demand 1 got removed, then supply 2 got removed. Now price returns to demand 3. Buy it?",
        scene: {
          candles: [
            { o: 156, h: 156.4, l: 154.19, c: 154.61 },
            { o: 154.61, h: 154.92, l: 152.47, c: 153 },
            { o: 153, h: 153.72, l: 152.78, c: 153.43 },
            { o: 153.43, h: 157.76, l: 153.31, c: 157.63 },
            { o: 157.63, h: 159.23, l: 157.43, c: 159.03 },
            { o: 159.03, h: 160.27, l: 158.71, c: 159.71 },
            { o: 159.71, h: 160.57, l: 159.46, c: 160.23 },
            { o: 160.23, h: 161.16, l: 159.77, c: 160.67 },
            { o: 160.67, h: 160.79, l: 156.01, c: 156.07 },
            { o: 156.07, h: 156.27, l: 154.57, c: 154.77 },
            { o: 154.77, h: 155.17, l: 152.97, c: 153.25 },
            { o: 153.25, h: 153.83, l: 151.73, c: 151.98 },
            { o: 151.98, h: 152.62, l: 151.59, c: 152.31 },
            { o: 152.31, h: 156.88, l: 152.25, c: 156.71 },
            { o: 156.71, h: 158.21, l: 156.51, c: 158.01 },
            { o: 158.01, h: 160.27, l: 157.74, c: 159.99 },
            { o: 159.99, h: 162.21, l: 159.34, c: 161.96 },
            { o: 161.96, h: 162.49, l: 160.53, c: 161.17 },
            { o: 161.17, h: 161.38, l: 159.86, c: 160.46 },
            { o: 160.46, h: 161.01, l: 158.07, c: 158.38 },
            { o: 158.38, h: 158.98, l: 155.84, c: 156.42 },
            { o: 156.42, h: 156.8, l: 153.57, c: 153.9 },
            { o: 153.9, h: 155.16, l: 153.55, c: 154.51 },
            { o: 154.51, h: 154.61, l: 152.01, c: 152.91 },
            { o: 152.91, h: 153.14, l: 149.24, c: 149.39 },
            { o: 149.39, h: 150.08, l: 148.19, c: 148.67 },
            { o: 148.67, h: 148.97, l: 147.31, c: 147.86 },
            { o: 147.86, h: 148.19, l: 145.75, c: 146.39 }
          ],
          zones: [
            { from: 2, to: 11, top: 153.43, bottom: 152.78, kind: "demand", label: "zone 1 (removed)", faded: true },
            { from: 7, to: 16, top: 161.16, bottom: 160.23, kind: "supply", label: "zone 2 (removed)", faded: true },
            { from: 12, to: 18, top: 152.31, bottom: 151.59, kind: "demand", label: "zone 3" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Kevin would avoid it. In tight ranging price where one zone is removed and then another, the third zone more often than not fails. It did."
      },
      {
        prompt: "This supply removed the uptrend line. Place the entry the way Kevin likes it.",
        scene: {
          candles: [
            { o: 152, h: 152.35, l: 150.22, c: 150.74 },
            { o: 150.74, h: 151.05, l: 149.14, c: 149.5 },
            { o: 149.5, h: 150.4, l: 147.9, c: 150.1 },
            { o: 150.1, h: 152.99, l: 149.55, c: 152.69 },
            { o: 152.69, h: 157.07, l: 152.45, c: 156.38 },
            { o: 156.38, h: 160.19, l: 155.76, c: 159.75 },
            { o: 159.75, h: 161.33, l: 159.18, c: 161.1 },
            { o: 161.1, h: 161.72, l: 159.1, c: 159.41 },
            { o: 159.41, h: 159.71, l: 157.01, c: 157.33 },
            { o: 157.33, h: 157.61, l: 154.01, c: 154.6 },
            { o: 154.6, h: 157.88, l: 153.95, c: 157.22 },
            { o: 157.22, h: 159.68, l: 156.7, c: 159.07 },
            { o: 159.07, h: 161.54, l: 158.52, c: 161.23 },
            { o: 161.23, h: 164.83, l: 160.87, c: 164.37 },
            { o: 164.37, h: 167.78, l: 163.72, c: 167.1 },
            { o: 167.1, h: 167.4, l: 166.32, c: 166.71 },
            { o: 166.71, h: 167.45, l: 166.45, c: 167.13 },
            { o: 167.13, h: 167.21, l: 159.42, c: 159.63 },
            { o: 159.63, h: 159.86, l: 153.94, c: 154.13 },
            { o: 154.13, h: 154.71, l: 151.73, c: 152.2 },
            { o: 152.2, h: 152.55, l: 150.93, c: 151.31 },
            { o: 151.31, h: 151.52, l: 149.41, c: 149.64 },
            { o: 149.64, h: 152.39, l: 149.09, c: 152.1 },
            { o: 152.1, h: 155.93, l: 151.81, c: 155.36 },
            { o: 155.36, h: 157.96, l: 154.88, c: 157.61 },
            { o: 157.61, h: 161.36, l: 157.38, c: 160.74 },
            { o: 160.74, h: 165.13, l: 160.17, c: 164.51 },
            { o: 164.51, h: 167.01, l: 164.27, c: 166.11 },
            { o: 166.11, h: 166.43, l: 164.5, c: 164.82 },
            { o: 164.82, h: 165.52, l: 162.81, c: 163.29 },
            { o: 163.29, h: 163.84, l: 160.74, c: 160.95 },
            { o: 160.95, h: 161.21, l: 158.21, c: 158.66 },
            { o: 158.66, h: 159.15, l: 156.37, c: 157.05 },
            { o: 157.05, h: 157.74, l: 154.57, c: 155.11 }
          ],
          zones: [
            { from: 15, to: 21, top: 167.45, bottom: 166.71, kind: "supply", label: "supply" }
          ],
          trendlines: [
            { x1: 2, y1: 147.9, x2: 18, y2: 161.87, label: "uptrend line", broken: true }
          ],
          reveal: 22
        },
        task: "pick-entry",
        answer: { side: "sell", entry: 166.56, sl: 168.05, tp: 162.09 },
        explain: "Just a little before the proximal (166.56), not far away from it, so there is wiggle room. Stop 168.05, target 162.09."
      }
    ],
    cards: [
      { front: "Momentum vs trendline?", back: "Small steps = momentum. Obvious deep peak and valley + pivot break = trendline." },
      { front: "Updated line starts where?", back: "The most recent valley (the old line's second touch)." },
      { front: "When do you end the old line?", back: "When an updated line forms (about 95% of the time), or when it overextends." },
      { front: "Exception 1 to the drawing rules?", back: "Confirmation off a very convincing higher-timeframe zone." },
      { front: "Exception 2?", back: "Macro charts (1M, 3M, 6M, 12M): any explosive move counts." },
      { front: "Third zone in a tight range?", back: "More often than not fails." },
      { front: "Entering in an overextended market?", back: "Manage aggressively; a far target is chasing." },
      { front: "Where to place the entry?", back: "Just a little before the proximal line." }
    ],
    mnemonic: "New landing, new rail: grab it at the last step, let go of the old."
  }
];
