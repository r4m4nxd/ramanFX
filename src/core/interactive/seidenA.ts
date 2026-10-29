// Interactive teaching layer for mentor "seiden" (Sam Seiden articles), lessons in part001.ts and part081.ts.
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Seiden's drawing rule: enclose the
// majority of trading in the base - demand top (proximal) = highest basing body, bottom (distal) = lowest
// basing wick; supply mirrored (bottom = lowest basing body, top = highest basing wick).
import type { InteractiveLesson } from './types';

export const IL_SEIDENA: InteractiveLesson[] = [
  {
    mentor: "seiden",
    n: 1,
    eli5: {
      oneLiner: "Give every zone a score out of ten. Only trade the high scores.",
      story: "Imagine a teacher grading a test with six questions about a zone. Did price leave fast, is there room to the next wall, and does the big chart agree? Is this the first visit, did price stay only a short time, and did it come back cleanly? Add the points: 9 or 10 means you can wait with a buy order, 8 means wait for proof, and under 7 means skip it.",
      analogy: "It is like rating a lemonade stand before you invest: busy line, good price, nobody else on the street, first day open. Six ticks and you buy in; a few ticks and you walk past."
    },
    bigIdeas: [
      "A fast exit from a level means a big imbalance. Speed is the biggest clue.",
      "Score six things: strength, reward to risk, big picture, how many returns, time at level, arrival.",
      "9-10 = limit order, 8 = confirmation entry, below that = no trade."
    ],
    steps: [
      {
        title: "Strength of the move away (0-2)",
        narration: "Price paused for two small candles, then left with two very large green candles. One or two big candles leaving a level is the strongest exit, so this scores 2 points.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ],
          notes: [
            { x: 8, y: 168.51, text: "Fast exit = big imbalance" }
          ],
          highlight: { from: 7, to: 8, label: "strength = 2" },
          reveal: 9
        }
      },
      {
        title: "Time at the level (0-1)",
        narration: "Price spent only two candles at the level before it left. Where the imbalance is greatest, price spends the least time. Few candles compared with other levels on this chart scores 1 point. Box the base: highest body on top, lowest wick on the bottom.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 150.21, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 8, y: 168.51, text: "Fast exit = big imbalance" }
          ],
          highlight: { from: 5, to: 6, label: "only 2 candles" },
          reveal: 9
        }
      },
      {
        title: "Reward to risk (0-2)",
        narration: "Look to your left for the nearest supply. Entry sits on the top line of demand, the stop goes just under the bottom line, and the first target is that supply. The room is many times the stop, well over 3:1, so 2 more points.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 150.21, kind: "demand", label: "Demand" },
            { from: 11, top: 171.56, bottom: 170.89, kind: "supply", label: "Nearest supply" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 149.91, label: "Stop beyond distal", kind: "sl" },
            { y: 170.89, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 8, y: 168.51, text: "Fast exit = big imbalance" }
          ],
          reveal: 15
        }
      },
      {
        title: "First return and a clean arrival (2 + 1)",
        narration: "Price now comes back for the first time, in a straight drop with no new support forming on the way. First visit scores 2, clean arrival scores 1. Add the big picture and the total is 9 or 10: a limit order is allowed.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 150.21, kind: "demand", label: "Demand" },
            { from: 11, top: 171.56, bottom: 170.89, kind: "supply", label: "Nearest supply" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 149.91, label: "Stop beyond distal", kind: "sl" },
            { y: 170.89, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 8, y: 168.51, text: "Fast exit = big imbalance" }
          ],
          highlight: { from: 15, to: 18, label: "first return, clean arrival" },
          reveal: 19
        }
      },
      {
        title: "The result",
        narration: "The waiting buy order fills on the first touch and price runs to the supply above. We never knew it would work; we only stacked the odds with an objective score.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 150.21, kind: "demand", label: "Demand" },
            { from: 11, top: 171.56, bottom: 170.89, kind: "supply", label: "Nearest supply" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 149.91, label: "Stop beyond distal", kind: "sl" },
            { y: 170.89, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 8, y: 168.51, text: "Fast exit = big imbalance" },
            { x: 19, y: 149.17, text: "Limit order filled" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A level scores 8 out of 10. Which entry does the score sheet allow?",
        options: ["A limit order", "A confirmation entry", "No trade at all", "Buy right now at market"],
        answer: 1,
        explain: "Score 8 means use a confirmation entry. Only 9-10 allows a limit order; below 7 is no trade."
      },
      {
        type: "tf",
        q: "The more candles price spends at a level, the stronger the level is.",
        answer: false,
        explain: "Seiden says the opposite of the textbooks: lots of time at a level means equilibrium. The strongest levels show only a few candles."
      },
      {
        type: "mcq",
        q: "Price comes back to the same demand for the third time. How many retracement points?",
        options: ["2", "1", "0", "3"],
        answer: 2,
        explain: "First return = 2, second = 1, third = 0. Each visit removes some of the waiting orders, like axe swings on a tree."
      },
      {
        type: "spot",
        q: "Click the candles that earn the \"strength of move away\" points.",
        scene: {
          candles: [
            { o: 165, h: 165.31, l: 161.72, c: 162.1 },
            { o: 162.1, h: 162.26, l: 158.51, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.02, c: 156.43 },
            { o: 156.43, h: 156.84, l: 154.29, c: 154.47 },
            { o: 154.47, h: 154.61, l: 150.85, c: 151 },
            { o: 151, h: 151.51, l: 150.21, c: 150.57 },
            { o: 150.57, h: 151.59, l: 150.25, c: 151 },
            { o: 151, h: 159.38, l: 150.78, c: 159.29 },
            { o: 159.29, h: 167.11, l: 159.22, c: 167 },
            { o: 167, h: 169.02, l: 166.64, c: 168.72 },
            { o: 168.72, h: 171.28, l: 168.53, c: 171 },
            { o: 171, h: 171.56, l: 170.33, c: 170.89 },
            { o: 170.89, h: 171.53, l: 170.5, c: 171.1 },
            { o: 171.1, h: 171.25, l: 168.47, c: 168.6 },
            { o: 168.6, h: 168.71, l: 166.04, c: 166.1 },
            { o: 166.1, h: 166.28, l: 162.49, c: 162.66 },
            { o: 162.66, h: 162.79, l: 158.26, c: 158.48 },
            { o: 158.48, h: 158.67, l: 154.94, c: 155 },
            { o: 155, h: 155.17, l: 151.35, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.57, c: 151.9 },
            { o: 151.9, h: 157.09, l: 151.55, c: 156.67 },
            { o: 156.67, h: 160.4, l: 156.26, c: 160.11 },
            { o: 160.11, h: 163.93, l: 159.96, c: 163.53 },
            { o: 163.53, h: 167.76, l: 163.35, c: 167.37 },
            { o: 167.37, h: 171.72, l: 167.08, c: 171.29 }
          ]
        },
        answer: { from: 7, to: 8 },
        explain: "The two large green candles that left the base. One or two big candles leaving a level scores the full 2 points."
      },
      {
        type: "mcq",
        q: "You risk 20 cents on a buy. How far away must the nearest supply be?",
        options: ["20 cents", "40 cents", "60 cents or more", "It does not matter"],
        answer: 2,
        explain: "Seiden wants at least 3:1 to target 1, so 20 cents of risk needs 60 cents of room to the nearest supply."
      },
      {
        type: "order",
        q: "Put the entry decisions in order, from the highest score down.",
        items: ["Score 9-10: limit order allowed", "Score 8: confirmation entry", "Below 7: no trade"],
        explain: "The score decides the entry type. High scores let you wait at the level with a resting order."
      }
    ],
    practice: [
      {
        prompt: "Supply: two big red candles left a two-candle base. This is the first return, it came back cleanly, and demand is far below. Score it, then decide.",
        scene: {
          candles: [
            { o: 134, h: 136.67, l: 133.6, c: 136.45 },
            { o: 136.45, h: 139.07, l: 136.2, c: 138.67 },
            { o: 138.67, h: 142.61, l: 138.33, c: 142.18 },
            { o: 142.18, h: 145.14, l: 141.84, c: 144.73 },
            { o: 144.73, h: 147.45, l: 144.57, c: 147 },
            { o: 147, h: 148.63, l: 146.42, c: 148.05 },
            { o: 148.05, h: 148.37, l: 146.46, c: 146.97 },
            { o: 146.97, h: 147.06, l: 140.03, c: 140.13 },
            { o: 140.13, h: 140.31, l: 131.82, c: 131.97 },
            { o: 131.97, h: 132.36, l: 129.86, c: 130.15 },
            { o: 130.15, h: 130.53, l: 127.85, c: 127.97 },
            { o: 127.97, h: 128.5, l: 127.64, c: 128.14 },
            { o: 128.14, h: 128.45, l: 127.27, c: 127.89 },
            { o: 127.89, h: 130.67, l: 127.78, c: 130.59 },
            { o: 130.59, h: 133.03, l: 130.42, c: 132.89 },
            { o: 132.89, h: 136.38, l: 132.78, c: 136.23 },
            { o: 136.23, h: 139.55, l: 136.03, c: 139.35 },
            { o: 139.35, h: 143.34, l: 139.21, c: 143.14 },
            { o: 143.14, h: 146.63, l: 142.96, c: 146.47 },
            { o: 146.47, h: 147.88, l: 145.82, c: 146.07 },
            { o: 146.07, h: 146.29, l: 142.01, c: 142.37 },
            { o: 142.37, h: 142.82, l: 139.02, c: 139.21 },
            { o: 139.21, h: 139.5, l: 135.36, c: 135.78 },
            { o: 135.78, h: 136.15, l: 130.64, c: 131 },
            { o: 131, h: 131.29, l: 127.57, c: 127.74 }
          ],
          zones: [
            { from: 5, top: 148.63, bottom: 146.97, kind: "supply", label: "Supply" },
            { from: 11, top: 128.14, bottom: 127.27, kind: "demand", label: "Demand below" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Strong exit (2), short time at level (1), more than 3:1 room (2), first return (2), clean arrival (1). That is 9-10 with the big picture: a limit sell is allowed, and price dropped from the zone."
      },
      {
        prompt: "This demand formed with five overlapping candles and a slow, choppy drift away. Price has already come back twice. Now it is stair-stepping down for a third visit. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.25, l: 157.39, c: 157.72 },
            { o: 157.72, h: 157.99, l: 156.05, c: 156.34 },
            { o: 156.34, h: 156.55, l: 153.31, c: 153.5 },
            { o: 153.5, h: 153.89, l: 151.62, c: 152.07 },
            { o: 152.07, h: 152.43, l: 149.77, c: 150 },
            { o: 150, h: 150.36, l: 148.95, c: 149.55 },
            { o: 149.55, h: 151.09, l: 148.85, c: 150.4 },
            { o: 150.4, h: 150.75, l: 149.07, c: 149.61 },
            { o: 149.61, h: 151.17, l: 149.03, c: 150.84 },
            { o: 150.84, h: 151.29, l: 149.7, c: 150.02 },
            { o: 150.02, h: 153.46, l: 149.44, c: 152.99 },
            { o: 152.99, h: 153.51, l: 151.47, c: 151.87 },
            { o: 151.87, h: 155.71, l: 151.49, c: 155.49 },
            { o: 155.49, h: 155.75, l: 154.3, c: 154.55 },
            { o: 154.55, h: 159.67, l: 154.07, c: 159.02 },
            { o: 159.02, h: 159.74, l: 158.58, c: 159.28 },
            { o: 159.28, h: 159.79, l: 159.06, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.73, c: 161.13 },
            { o: 161.13, h: 162.05, l: 160.8, c: 161.52 },
            { o: 161.52, h: 161.73, l: 157.15, c: 157.36 },
            { o: 157.36, h: 157.55, l: 154.76, c: 155.11 },
            { o: 155.11, h: 155.27, l: 151.11, c: 151.34 },
            { o: 151.34, h: 151.79, l: 149.85, c: 151.54 },
            { o: 151.54, h: 153.15, l: 151.27, c: 152.71 },
            { o: 152.71, h: 154.63, l: 152.4, c: 154.25 },
            { o: 154.25, h: 155.93, l: 153.9, c: 155.54 },
            { o: 155.54, h: 155.81, l: 153.7, c: 154.1 },
            { o: 154.1, h: 154.54, l: 152.66, c: 153.02 },
            { o: 153.02, h: 153.41, l: 151.12, c: 151.34 },
            { o: 151.34, h: 151.79, l: 149.55, c: 151.54 },
            { o: 151.54, h: 152.68, l: 151.41, c: 152.54 },
            { o: 152.54, h: 153.75, l: 152.26, c: 153.45 },
            { o: 153.45, h: 154.97, l: 153.29, c: 154.54 },
            { o: 154.54, h: 154.79, l: 153.71, c: 153.93 },
            { o: 153.93, h: 154.3, l: 153.07, c: 153.39 },
            { o: 153.39, h: 153.69, l: 153.21, c: 153.42 },
            { o: 153.42, h: 153.58, l: 152.07, c: 152.33 },
            { o: 152.33, h: 152.69, l: 151.57, c: 151.79 },
            { o: 151.79, h: 152.18, l: 151.01, c: 151.34 },
            { o: 151.34, h: 151.49, l: 145.55, c: 145.85 },
            { o: 145.85, h: 145.99, l: 144.16, c: 144.55 },
            { o: 144.55, h: 144.97, l: 142.74, c: 143.16 },
            { o: 143.16, h: 143.56, l: 141.25, c: 141.51 },
            { o: 141.51, h: 141.84, l: 139.69, c: 139.85 }
          ],
          zones: [
            { from: 5, top: 150.84, bottom: 148.85, kind: "demand", label: "Demand (3rd visit)" }
          ],
          reveal: 39
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Weak exit (0), long time at level (0), third return (0), messy arrival (0). The score is far below 7, so no trade. Price broke straight through the zone."
      }
    ],
    cards: [
      {
        front: "Strongest exit from a level scores?",
        back: "2 points: one or two very large candles leaving the level."
      },
      { front: "Retracement points for 1st, 2nd, 3rd return?", back: "2, 1, 0." },
      { front: "Score 9-10 allows which entry?", back: "A limit order at the level." },
      { front: "Score 8 means?", back: "Use a confirmation entry." },
      { front: "Minimum reward to risk to target 1?", back: "3:1 (20 cents risk needs 60 cents of room)." },
      { front: "Long time at a level means?", back: "Equilibrium, which is not where you want to trade." },
      { front: "Best time of day for short-term setups?", back: "The first 45-60 minutes of the session." }
    ],
    mnemonic: "Fast, Few, First, Far: fast exit, few candles, first visit, far target."
  },
  {
    mentor: "seiden",
    n: 5,
    eli5: {
      oneLiner: "Pick your entry type by the score, and follow a fixed confirmation rule.",
      story: "Supply is a pause between a rally and a drop; demand is a pause between a drop and a rally. Before you trade, you look from the monthly chart down to the 5-minute chart. For the very best levels you just leave a buy order waiting. For weaker levels you let price step into the zone first and only buy as it leaves. If price runs through your stop before your entry fills, you cancel and never get in.",
      analogy: "A confirmation entry is like waiting for the bus doors to open before you step forward. If the bus drives past without stopping, you simply do not get on."
    },
    bigIdeas: [
      "Supply = rally-base-drop, demand = drop-base-rally. Draw them without cutting through candles.",
      "Work top down: monthly, weekly, daily, hourly, 5-minute.",
      "Confirmation entry: price enters the zone, you buy as it leaves; if the stop trades first, cancel."
    ],
    steps: [
      {
        title: "Drop, base, rally",
        narration: "Price dropped, paused, then rallied hard. That pause is a drop-base-rally demand level. The best bases show about three to six candles on the timeframe you use.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ],
          highlight: { from: 5, to: 8, label: "base (DBR)" },
          reveal: 12
        }
      },
      {
        title: "Draw it without cutting candles",
        narration: "Wrap the base with two lines: the highest body on top and the lowest wick on the bottom. Do not slice through candles; you want the area where the buying really happened.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ],
          zones: [
            { from: 5, top: 153.62, bottom: 151.76, kind: "demand", label: "Demand" }
          ],
          reveal: 12
        }
      },
      {
        title: "Price enters the level",
        narration: "This level scored only 8, so we do not leave a limit order. We wait for price to trade into the zone and print a reaction candle.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ],
          zones: [
            { from: 5, top: 153.62, bottom: 151.76, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 20, to: 20, label: "enters and reacts" },
          reveal: 21
        }
      },
      {
        title: "Trigger above the reaction candle",
        narration: "Our fixed rule: buy 0.10 above the high of the reaction candle, stop under the bottom line. Once the trigger trades, the order is live. If the stop had traded first, we would cancel.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ],
          zones: [
            { from: 5, top: 153.62, bottom: 151.76, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 154.57, label: "Confirmation trigger", kind: "entry", from: 20 },
            { y: 151.46, label: "Stop under distal", kind: "sl", from: 20 }
          ]
        }
      },
      {
        title: "Price leaves the level",
        narration: "The next candle trades above the trigger and price rallies away. The rule did the work, not a feeling.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ],
          zones: [
            { from: 5, top: 153.62, bottom: 151.76, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 154.57, label: "Confirmation trigger", kind: "entry", from: 20 },
            { y: 151.46, label: "Stop under distal", kind: "sl", from: 20 }
          ],
          notes: [
            { x: 21, y: 157.63, text: "Entry fills as price leaves" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How does supply form?",
        options: ["Drop-base-rally", "Rally-base-drop", "Rally-base-rally", "A single big candle"],
        answer: 1,
        explain: "Supply forms as rally-base-drop; demand forms as drop-base-rally."
      },
      {
        type: "order",
        q: "Put the top-down analysis in order.",
        items: ["Monthly", "Weekly", "Daily", "Hourly", "5-minute"],
        explain: "Start with the biggest picture to know the trend and the big levels, then work down to the entry chart."
      },
      {
        type: "tf",
        q: "With a confirmation entry, if the stop price trades before your entry fills, you cancel the trade.",
        answer: true,
        explain: "That is the mechanics: entry first = you are in with your stop; stop first = cancel and never get in."
      },
      {
        type: "spot",
        q: "Click the basing candles of this drop-base-rally demand.",
        scene: {
          candles: [
            { o: 166, h: 166.2, l: 163.29, c: 163.64 },
            { o: 163.64, h: 164.07, l: 161, c: 161.12 },
            { o: 161.12, h: 161.25, l: 157.33, c: 157.74 },
            { o: 157.74, h: 158.08, l: 155.52, c: 155.92 },
            { o: 155.92, h: 156.33, l: 152.6, c: 153 },
            { o: 153, h: 153.44, l: 151.8, c: 152.3 },
            { o: 152.3, h: 154.23, l: 151.76, c: 153.62 },
            { o: 153.62, h: 153.98, l: 151.84, c: 152.4 },
            { o: 152.4, h: 153.55, l: 151.91, c: 152.91 },
            { o: 152.91, h: 157.68, l: 152.76, c: 157.54 },
            { o: 157.54, h: 162.32, l: 157.34, c: 162.23 },
            { o: 162.23, h: 167.1, l: 162.06, c: 166.91 },
            { o: 166.91, h: 168.94, l: 166.32, c: 168.67 },
            { o: 168.67, h: 168.98, l: 167.36, c: 167.93 },
            { o: 167.93, h: 169.1, l: 167.42, c: 168.75 },
            { o: 168.75, h: 169.89, l: 168.38, c: 169.41 },
            { o: 169.41, h: 169.5, l: 165.76, c: 165.96 },
            { o: 165.96, h: 166.13, l: 161.61, c: 161.8 },
            { o: 161.8, h: 161.94, l: 158.11, c: 158.22 },
            { o: 158.22, h: 158.41, l: 154, c: 154.12 },
            { o: 154.12, h: 154.47, l: 152.5, c: 154.22 },
            { o: 154.22, h: 156.23, l: 153.84, c: 155.97 },
            { o: 155.97, h: 157.9, l: 155.77, c: 157.57 },
            { o: 157.57, h: 159.38, l: 157.43, c: 159.21 },
            { o: 159.21, h: 161.75, l: 159.01, c: 161.48 },
            { o: 161.48, h: 163.41, l: 161.19, c: 163.22 }
          ]
        },
        answer: { from: 5, to: 8 },
        explain: "The small candles between the drop and the rally are the base. The zone is drawn around them."
      },
      {
        type: "mcq",
        q: "Your base is only two candles on the 240-minute chart. What do you do?",
        options: [
          "Skip the trade",
          "Drop to a smaller timeframe like 60 minutes to find the base",
          "Draw a single line",
          "Use a moving average"
        ],
        answer: 1,
        explain: "Rule of thumb in the notes: refine a two-candle 240-minute base on the 60-minute chart."
      },
      {
        type: "mcq",
        q: "In a sideways market, what does Seiden do?",
        options: [
          "Only buy breakouts",
          "Sell rallies into supply and buy pullbacks into demand",
          "Stay out forever",
          "Buy every dip"
        ],
        answer: 1,
        explain: "Uptrend: buy demand pullbacks. Downtrend: sell supply rallies. Range: do both at the edges."
      }
    ],
    practice: [
      {
        prompt: "A demand level scored 8, so you use a confirmation entry: buy above the reaction candle. Price dipped into the zone. What happens to your plan?",
        scene: {
          candles: [
            { o: 160, h: 160.25, l: 158.03, c: 158.16 },
            { o: 158.16, h: 158.56, l: 155.2, c: 155.35 },
            { o: 155.35, h: 155.57, l: 152.5, c: 152.71 },
            { o: 152.71, h: 152.88, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.62, l: 147.71, c: 148 },
            { o: 148, h: 148.62, l: 146.67, c: 147.09 },
            { o: 147.09, h: 149.27, l: 146.79, c: 148.96 },
            { o: 148.96, h: 149.42, l: 147.44, c: 148.05 },
            { o: 148.05, h: 152.7, l: 147.98, c: 152.58 },
            { o: 152.58, h: 156.75, l: 152.38, c: 156.6 },
            { o: 156.6, h: 161.14, l: 156.54, c: 161.05 },
            { o: 161.05, h: 161.32, l: 160.62, c: 160.93 },
            { o: 160.93, h: 163.67, l: 160.29, c: 163.21 },
            { o: 163.21, h: 163.87, l: 162.57, c: 163.05 },
            { o: 163.05, h: 163.22, l: 159.39, c: 159.53 },
            { o: 159.53, h: 159.74, l: 155.76, c: 155.97 },
            { o: 155.97, h: 156.1, l: 152.44, c: 152.63 },
            { o: 152.63, h: 152.74, l: 149.29, c: 149.46 },
            { o: 149.46, h: 149.71, l: 147.93, c: 149.26 },
            { o: 149.26, h: 149.41, l: 143.37, c: 143.67 },
            { o: 143.67, h: 144.11, l: 142.22, c: 142.63 },
            { o: 142.63, h: 143.04, l: 141.14, c: 141.47 },
            { o: 141.47, h: 141.78, l: 139.67, c: 139.86 },
            { o: 139.86, h: 139.98, l: 138.45, c: 138.67 }
          ],
          zones: [
            { from: 5, top: 148.96, bottom: 146.67, kind: "demand", label: "Demand (score 8)" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Price never traded above the reaction candle. Instead it fell through the bottom line, so the stop price traded first. The rule says cancel: no trade, no loss."
      }
    ],
    cards: [
      { front: "Supply forms as?", back: "Rally-base-drop." },
      { front: "Demand forms as?", back: "Drop-base-rally." },
      { front: "Three entry types?", back: "Limit, confirmation and breakout." },
      {
        front: "Confirmation entry in one line?",
        back: "Let price enter the level, buy as it leaves; cancel if the stop trades first."
      },
      { front: "Ideal base size?", back: "About 3-6 candles on the timeframe you use." },
      { front: "Real cause of most stop and target problems?", back: "A poor entry." }
    ],
    mnemonic: "Top down, Box it, Rule it: monthly to 5-minute, box the base, follow a fixed trigger."
  },
  {
    mentor: "seiden",
    n: 9,
    eli5: {
      oneLiner: "Before buying, look left: is there room to the next wall?",
      story: "A shop owner buys toys for $4 and hopes to sell them for more. If nobody will pay more than $3, he loses money no matter how good the toys are. In trading, the space from your entry to the opposing level is your profit margin. Seiden only trades when that space is at least three times his stop.",
      analogy: "It is like checking a parking spot before you drive in: if the wall is right in front of your bumper, you cannot go anywhere."
    },
    bigIdeas: [
      "Profit margin = distance from your entry level to the opposing supply or demand.",
      "Look to your left. Require at least 3:1 to the first target.",
      "Buyers who chase after a big advance into supply are the people to sell to."
    ],
    steps: [
      {
        title: "Find the level",
        narration: "Price dropped, paused for two candles, and left with two big green candles. A strong initial move away suggests a big imbalance. Box the base as demand.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 161.38, c: 161.56 },
            { o: 161.56, h: 161.93, l: 159.61, c: 159.94 },
            { o: 159.94, h: 160.16, l: 155.83, c: 155.97 },
            { o: 155.97, h: 156.3, l: 152.96, c: 153.33 },
            { o: 153.33, h: 153.62, l: 150.79, c: 151 },
            { o: 151, h: 151.31, l: 149.47, c: 150.05 },
            { o: 150.05, h: 151.59, l: 149.57, c: 150.98 },
            { o: 150.98, h: 159.08, l: 150.77, c: 158.9 },
            { o: 158.9, h: 166.15, l: 158.7, c: 165.98 },
            { o: 165.98, h: 167.87, l: 165.53, c: 167.74 },
            { o: 167.74, h: 170.18, l: 167.59, c: 169.98 },
            { o: 169.98, h: 170.32, l: 169.35, c: 169.83 },
            { o: 169.83, h: 170.32, l: 169.24, c: 169.96 },
            { o: 169.96, h: 170.13, l: 166.5, c: 166.7 },
            { o: 166.7, h: 166.83, l: 163.78, c: 163.96 },
            { o: 163.96, h: 164.01, l: 160.59, c: 160.65 },
            { o: 160.65, h: 160.83, l: 157.44, c: 157.53 },
            { o: 157.53, h: 157.63, l: 154.45, c: 154.51 },
            { o: 154.51, h: 154.63, l: 151.41, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.16, c: 151.9 },
            { o: 151.9, h: 155.49, l: 151.54, c: 155.22 },
            { o: 155.22, h: 160.09, l: 154.81, c: 159.84 },
            { o: 159.84, h: 163.23, l: 159.66, c: 163.1 },
            { o: 163.1, h: 167.76, l: 162.95, c: 167.39 },
            { o: 167.39, h: 170.48, l: 167, c: 170.23 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 149.47, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 7, to: 8, label: "strong move out" },
          reveal: 9
        }
      },
      {
        title: "Look to your left",
        narration: "Before buying, find the nearest supply above. Here it is the small base at the top, where price turned down.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 161.38, c: 161.56 },
            { o: 161.56, h: 161.93, l: 159.61, c: 159.94 },
            { o: 159.94, h: 160.16, l: 155.83, c: 155.97 },
            { o: 155.97, h: 156.3, l: 152.96, c: 153.33 },
            { o: 153.33, h: 153.62, l: 150.79, c: 151 },
            { o: 151, h: 151.31, l: 149.47, c: 150.05 },
            { o: 150.05, h: 151.59, l: 149.57, c: 150.98 },
            { o: 150.98, h: 159.08, l: 150.77, c: 158.9 },
            { o: 158.9, h: 166.15, l: 158.7, c: 165.98 },
            { o: 165.98, h: 167.87, l: 165.53, c: 167.74 },
            { o: 167.74, h: 170.18, l: 167.59, c: 169.98 },
            { o: 169.98, h: 170.32, l: 169.35, c: 169.83 },
            { o: 169.83, h: 170.32, l: 169.24, c: 169.96 },
            { o: 169.96, h: 170.13, l: 166.5, c: 166.7 },
            { o: 166.7, h: 166.83, l: 163.78, c: 163.96 },
            { o: 163.96, h: 164.01, l: 160.59, c: 160.65 },
            { o: 160.65, h: 160.83, l: 157.44, c: 157.53 },
            { o: 157.53, h: 157.63, l: 154.45, c: 154.51 },
            { o: 154.51, h: 154.63, l: 151.41, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.16, c: 151.9 },
            { o: 151.9, h: 155.49, l: 151.54, c: 155.22 },
            { o: 155.22, h: 160.09, l: 154.81, c: 159.84 },
            { o: 159.84, h: 163.23, l: 159.66, c: 163.1 },
            { o: 163.1, h: 167.76, l: 162.95, c: 167.39 },
            { o: 167.39, h: 170.48, l: 167, c: 170.23 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 149.47, kind: "demand", label: "Demand" },
            { from: 11, top: 170.32, bottom: 169.83, kind: "supply", label: "Opposing supply" }
          ],
          reveal: 15
        }
      },
      {
        title: "Measure the profit margin",
        narration: "Entry on the top demand line, stop just under the bottom line, target at the supply. The room is many times the stop, far more than 3:1, so the trade is allowed.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 161.38, c: 161.56 },
            { o: 161.56, h: 161.93, l: 159.61, c: 159.94 },
            { o: 159.94, h: 160.16, l: 155.83, c: 155.97 },
            { o: 155.97, h: 156.3, l: 152.96, c: 153.33 },
            { o: 153.33, h: 153.62, l: 150.79, c: 151 },
            { o: 151, h: 151.31, l: 149.47, c: 150.05 },
            { o: 150.05, h: 151.59, l: 149.57, c: 150.98 },
            { o: 150.98, h: 159.08, l: 150.77, c: 158.9 },
            { o: 158.9, h: 166.15, l: 158.7, c: 165.98 },
            { o: 165.98, h: 167.87, l: 165.53, c: 167.74 },
            { o: 167.74, h: 170.18, l: 167.59, c: 169.98 },
            { o: 169.98, h: 170.32, l: 169.35, c: 169.83 },
            { o: 169.83, h: 170.32, l: 169.24, c: 169.96 },
            { o: 169.96, h: 170.13, l: 166.5, c: 166.7 },
            { o: 166.7, h: 166.83, l: 163.78, c: 163.96 },
            { o: 163.96, h: 164.01, l: 160.59, c: 160.65 },
            { o: 160.65, h: 160.83, l: 157.44, c: 157.53 },
            { o: 157.53, h: 157.63, l: 154.45, c: 154.51 },
            { o: 154.51, h: 154.63, l: 151.41, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.16, c: 151.9 },
            { o: 151.9, h: 155.49, l: 151.54, c: 155.22 },
            { o: 155.22, h: 160.09, l: 154.81, c: 159.84 },
            { o: 159.84, h: 163.23, l: 159.66, c: 163.1 },
            { o: 163.1, h: 167.76, l: 162.95, c: 167.39 },
            { o: 167.39, h: 170.48, l: 167, c: 170.23 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 149.47, kind: "demand", label: "Demand" },
            { from: 11, top: 170.32, bottom: 169.83, kind: "supply", label: "Opposing supply" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 149.17, label: "Stop beyond distal", kind: "sl" },
            { y: 169.83, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 19
        }
      },
      {
        title: "Price gets there",
        narration: "On the first pullback the order fills and price climbs to the opposing supply. The 3:1 rule got the trade started in our favour.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 161.38, c: 161.56 },
            { o: 161.56, h: 161.93, l: 159.61, c: 159.94 },
            { o: 159.94, h: 160.16, l: 155.83, c: 155.97 },
            { o: 155.97, h: 156.3, l: 152.96, c: 153.33 },
            { o: 153.33, h: 153.62, l: 150.79, c: 151 },
            { o: 151, h: 151.31, l: 149.47, c: 150.05 },
            { o: 150.05, h: 151.59, l: 149.57, c: 150.98 },
            { o: 150.98, h: 159.08, l: 150.77, c: 158.9 },
            { o: 158.9, h: 166.15, l: 158.7, c: 165.98 },
            { o: 165.98, h: 167.87, l: 165.53, c: 167.74 },
            { o: 167.74, h: 170.18, l: 167.59, c: 169.98 },
            { o: 169.98, h: 170.32, l: 169.35, c: 169.83 },
            { o: 169.83, h: 170.32, l: 169.24, c: 169.96 },
            { o: 169.96, h: 170.13, l: 166.5, c: 166.7 },
            { o: 166.7, h: 166.83, l: 163.78, c: 163.96 },
            { o: 163.96, h: 164.01, l: 160.59, c: 160.65 },
            { o: 160.65, h: 160.83, l: 157.44, c: 157.53 },
            { o: 157.53, h: 157.63, l: 154.45, c: 154.51 },
            { o: 154.51, h: 154.63, l: 151.41, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.16, c: 151.9 },
            { o: 151.9, h: 155.49, l: 151.54, c: 155.22 },
            { o: 155.22, h: 160.09, l: 154.81, c: 159.84 },
            { o: 159.84, h: 163.23, l: 159.66, c: 163.1 },
            { o: 163.1, h: 167.76, l: 162.95, c: 167.39 },
            { o: 167.39, h: 170.48, l: 167, c: 170.23 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 149.47, kind: "demand", label: "Demand" },
            { from: 11, top: 170.32, bottom: 169.83, kind: "supply", label: "Opposing supply" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 149.17, label: "Stop beyond distal", kind: "sl" },
            { y: 169.83, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 24, y: 171.88, text: "Target 1 reached" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is \"profit margin\" in Seiden's method?",
        options: [
          "The money in your account",
          "The distance from your entry level to the opposing level",
          "The spread",
          "The size of the base"
        ],
        answer: 1,
        explain: "Profit margin is the objectively measured distance between your demand and the opposing supply (or the reverse for shorts)."
      },
      {
        type: "tf",
        q: "If the zone looks great, you can buy even when supply sits right above it.",
        answer: false,
        explain: "No room means no trade. The initial profit margin must be at least 3 times the stop."
      },
      {
        type: "spot",
        q: "Click the base you would look left to before buying (the opposing supply).",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 161.38, c: 161.56 },
            { o: 161.56, h: 161.93, l: 159.61, c: 159.94 },
            { o: 159.94, h: 160.16, l: 155.83, c: 155.97 },
            { o: 155.97, h: 156.3, l: 152.96, c: 153.33 },
            { o: 153.33, h: 153.62, l: 150.79, c: 151 },
            { o: 151, h: 151.31, l: 149.47, c: 150.05 },
            { o: 150.05, h: 151.59, l: 149.57, c: 150.98 },
            { o: 150.98, h: 159.08, l: 150.77, c: 158.9 },
            { o: 158.9, h: 166.15, l: 158.7, c: 165.98 },
            { o: 165.98, h: 167.87, l: 165.53, c: 167.74 },
            { o: 167.74, h: 170.18, l: 167.59, c: 169.98 },
            { o: 169.98, h: 170.32, l: 169.35, c: 169.83 },
            { o: 169.83, h: 170.32, l: 169.24, c: 169.96 },
            { o: 169.96, h: 170.13, l: 166.5, c: 166.7 },
            { o: 166.7, h: 166.83, l: 163.78, c: 163.96 },
            { o: 163.96, h: 164.01, l: 160.59, c: 160.65 },
            { o: 160.65, h: 160.83, l: 157.44, c: 157.53 },
            { o: 157.53, h: 157.63, l: 154.45, c: 154.51 },
            { o: 154.51, h: 154.63, l: 151.41, c: 151.5 },
            { o: 151.5, h: 152.15, l: 150.16, c: 151.9 },
            { o: 151.9, h: 155.49, l: 151.54, c: 155.22 },
            { o: 155.22, h: 160.09, l: 154.81, c: 159.84 },
            { o: 159.84, h: 163.23, l: 159.66, c: 163.1 },
            { o: 163.1, h: 167.76, l: 162.95, c: 167.39 },
            { o: 167.39, h: 170.48, l: 167, c: 170.23 }
          ],
          zones: [
            { from: 5, top: 151, bottom: 149.47, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 11, to: 12 },
        explain: "The small base at the top, where price turned down, is the nearest supply. It is target 1 for a buy at demand."
      },
      {
        type: "mcq",
        q: "Your stop is 0.50. What is the smallest acceptable distance to target 1?",
        options: ["0.50", "1.00", "1.50", "0.25"],
        answer: 2,
        explain: "3 x 0.50 = 1.50. Seiden needs at least 3:1 to the first target."
      },
      {
        type: "mcq",
        q: "A level has a strong move out but sits badly on the bigger picture. What is it good for?",
        options: [
          "A long swing trade",
          "A day-trade bounce only",
          "Nothing ever",
          "Adding to a losing trade"
        ],
        answer: 1,
        explain: "Like the S&P example: a strong level in a poor location is fine for a day-trade bounce, not a swing."
      },
      {
        type: "mcq",
        q: "Who is the novice in a rally into supply?",
        options: [
          "The seller at supply",
          "The buyer who buys after a big advance into supply",
          "The trader who waits",
          "Nobody"
        ],
        answer: 1,
        explain: "Buyers buying after a large advance and where supply exceeds demand are not consistent winners. Take the other side."
      }
    ],
    practice: [
      {
        prompt: "Demand below, but the opposing supply is only a little above it. Price is pulling back to demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.45, l: 148.23, c: 148.43 },
            { o: 148.43, h: 148.68, l: 145.77, c: 146.17 },
            { o: 146.17, h: 146.33, l: 144.13, c: 144.33 },
            { o: 144.33, h: 144.69, l: 141.36, c: 141.51 },
            { o: 141.51, h: 141.64, l: 139.67, c: 140 },
            { o: 140, h: 140.62, l: 138.93, c: 139.46 },
            { o: 139.46, h: 141.46, l: 139.13, c: 140.84 },
            { o: 140.84, h: 141.46, l: 139.55, c: 139.95 },
            { o: 139.95, h: 142.02, l: 139.84, c: 141.92 },
            { o: 141.92, h: 144.06, l: 141.71, c: 143.95 },
            { o: 143.95, h: 144.91, l: 143.5, c: 144.49 },
            { o: 144.49, h: 145.15, l: 144.19, c: 144.95 },
            { o: 144.95, h: 145.6, l: 143.97, c: 144.66 },
            { o: 144.66, h: 145.34, l: 144.36, c: 144.91 },
            { o: 144.91, h: 145.03, l: 143.13, c: 143.32 },
            { o: 143.32, h: 143.4, l: 141.76, c: 141.91 },
            { o: 141.91, h: 142.08, l: 141.63, c: 141.71 },
            { o: 141.71, h: 141.78, l: 141.48, c: 141.55 },
            { o: 141.55, h: 141.73, l: 141.21, c: 141.34 },
            { o: 141.34, h: 141.49, l: 135.63, c: 135.93 },
            { o: 135.93, h: 136.29, l: 134.62, c: 134.75 },
            { o: 134.75, h: 134.96, l: 133.26, c: 133.48 },
            { o: 133.48, h: 133.66, l: 132.32, c: 132.48 },
            { o: 132.48, h: 132.73, l: 130.52, c: 130.93 }
          ],
          zones: [
            { from: 5, top: 140.84, bottom: 138.93, kind: "demand", label: "Demand" },
            { from: 12, top: 145.6, bottom: 144.66, kind: "supply", label: "Supply (too close)" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Look left: the supply is so close that the room is nowhere near 3:1. No profit margin, no trade. Price then broke the demand anyway."
      },
      {
        prompt: "Supply formed with big red candles. Price is now climbing back into it in a slow, overlapping rally. Demand is far below. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 132, h: 135.69, l: 131.63, c: 135.38 },
            { o: 135.38, h: 137.56, l: 135.26, c: 137.29 },
            { o: 137.29, h: 140.76, l: 137.11, c: 140.4 },
            { o: 140.4, h: 143.9, l: 140, c: 143.47 },
            { o: 143.47, h: 146.15, l: 143.15, c: 146 },
            { o: 146, h: 147.42, l: 145.68, c: 146.84 },
            { o: 146.84, h: 147.17, l: 144.81, c: 145.28 },
            { o: 145.28, h: 146.37, l: 144.87, c: 146.01 },
            { o: 146.01, h: 146.08, l: 137.34, c: 137.45 },
            { o: 137.45, h: 137.53, l: 129.93, c: 130.01 },
            { o: 130.01, h: 130.46, l: 128.41, c: 128.73 },
            { o: 128.73, h: 129.05, l: 126.85, c: 127.01 },
            { o: 127.01, h: 127.87, l: 126.34, c: 127.24 },
            { o: 127.24, h: 127.6, l: 126.54, c: 126.98 },
            { o: 126.98, h: 129.8, l: 126.93, c: 129.73 },
            { o: 129.73, h: 132.05, l: 129.61, c: 131.98 },
            { o: 131.98, h: 133.95, l: 131.62, c: 133.75 },
            { o: 133.75, h: 136.4, l: 133.48, c: 135.99 },
            { o: 135.99, h: 138.98, l: 135.81, c: 138.61 },
            { o: 138.61, h: 141.46, l: 138.47, c: 141.03 },
            { o: 141.03, h: 143.23, l: 140.6, c: 143.07 },
            { o: 143.07, h: 145.18, l: 142.72, c: 144.78 },
            { o: 144.78, h: 146.46, l: 144.13, c: 144.38 },
            { o: 144.38, h: 144.6, l: 140.55, c: 140.96 },
            { o: 140.96, h: 141.26, l: 136.98, c: 137.25 },
            { o: 137.25, h: 137.62, l: 133.46, c: 133.62 },
            { o: 133.62, h: 133.85, l: 130.12, c: 130.56 },
            { o: 130.56, h: 130.72, l: 126.48, c: 126.84 }
          ],
          zones: [
            { from: 5, top: 147.42, bottom: 145.28, kind: "supply", label: "Supply" },
            { from: 12, top: 127.24, bottom: 126.34, kind: "demand", label: "Demand far below" }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "sell", tp: 127.24 },
        explain: "Strong exit from supply, buyers chasing after an advance, and a big profit margin down to demand. Sell at the bottom line of supply, stop above the top line. Price dropped to the target."
      }
    ],
    cards: [
      { front: "Profit margin?", back: "Distance from your entry level to the opposing level." },
      { front: "Minimum initial profit margin?", back: "3 times the stop (3:1 to target 1)." },
      { front: "Before buying, look where?", back: "To your left, for the nearest supply." },
      {
        front: "Two entry types that both need a profit margin?",
        back: "The pullback entry and the breakout entry."
      },
      { front: "Strong level in a bad big-picture spot?", back: "Day-trade bounce only, not a swing." },
      { front: "Is a very large level always good?", back: "No. A wide level means a wide stop." }
    ],
    mnemonic: "Look Left, Count Three: find the opposing level, need three times your stop."
  },
  {
    mentor: "seiden",
    n: 14,
    eli5: {
      oneLiner: "Judge a level by how fast price first ran away from it.",
      story: "Picture a quiet room that suddenly empties because someone shouts \"free ice cream outside!\" The faster everyone runs, the bigger the prize must be. When price leaves a level with one or two huge candles, a big pile of orders was there. When price just drifts away, the pile was small.",
      analogy: "A fast exit is like a rocket launch; a slow drift is like a balloon floating off. Both leave, but only the rocket shows real power."
    },
    bigIdeas: [
      "How price first left a level is one of its most important features.",
      "Strong exit = large imbalance = higher odds. Slow drift = smaller imbalance.",
      "Trade the first pullback with the stop just beyond the zone."
    ],
    steps: [
      {
        title: "The quiet pause",
        narration: "Price rallied and then paused for three small candles. It looks like balance, but we cannot know yet.",
        scene: {
          candles: [
            { o: 134, h: 136.56, l: 133.78, c: 136.31 },
            { o: 136.31, h: 138.95, l: 136.09, c: 138.7 },
            { o: 138.7, h: 141.79, l: 138.44, c: 141.59 },
            { o: 141.59, h: 144.8, l: 141.17, c: 144.58 },
            { o: 144.58, h: 147.41, l: 144.14, c: 147 },
            { o: 147, h: 148.11, l: 146.44, c: 147.65 },
            { o: 147.65, h: 148.27, l: 146.34, c: 146.67 },
            { o: 146.67, h: 147.33, l: 146.03, c: 146.9 },
            { o: 146.9, h: 147, l: 137.9, c: 138 },
            { o: 138, h: 138.17, l: 130.71, c: 130.9 },
            { o: 130.9, h: 131.23, l: 129.48, c: 129.79 },
            { o: 129.79, h: 129.93, l: 128.78, c: 128.9 },
            { o: 128.9, h: 129.44, l: 128.4, c: 129 },
            { o: 129, h: 129.43, l: 128.31, c: 128.82 },
            { o: 128.82, h: 131.48, l: 128.73, c: 131.33 },
            { o: 131.33, h: 134.03, l: 131.23, c: 133.82 },
            { o: 133.82, h: 137.08, l: 133.76, c: 136.98 },
            { o: 136.98, h: 140.4, l: 136.89, c: 140.34 },
            { o: 140.34, h: 143.29, l: 140.16, c: 143.13 },
            { o: 143.13, h: 146.29, l: 143.05, c: 146.17 },
            { o: 146.17, h: 147.55, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.08, l: 142.46, c: 142.7 },
            { o: 142.7, h: 143.04, l: 138.39, c: 138.62 },
            { o: 138.62, h: 138.95, l: 134.58, c: 134.88 },
            { o: 134.88, h: 135.15, l: 132.07, c: 132.22 },
            { o: 132.22, h: 132.46, l: 128.3, c: 128.6 }
          ],
          highlight: { from: 5, to: 7, label: "looks like balance" },
          reveal: 8
        }
      },
      {
        title: "The violent exit",
        narration: "Two tall red candles leave the pause. A strong move away from apparent balance only happens when supply hugely outweighed demand. Box the pause as supply.",
        scene: {
          candles: [
            { o: 134, h: 136.56, l: 133.78, c: 136.31 },
            { o: 136.31, h: 138.95, l: 136.09, c: 138.7 },
            { o: 138.7, h: 141.79, l: 138.44, c: 141.59 },
            { o: 141.59, h: 144.8, l: 141.17, c: 144.58 },
            { o: 144.58, h: 147.41, l: 144.14, c: 147 },
            { o: 147, h: 148.11, l: 146.44, c: 147.65 },
            { o: 147.65, h: 148.27, l: 146.34, c: 146.67 },
            { o: 146.67, h: 147.33, l: 146.03, c: 146.9 },
            { o: 146.9, h: 147, l: 137.9, c: 138 },
            { o: 138, h: 138.17, l: 130.71, c: 130.9 },
            { o: 130.9, h: 131.23, l: 129.48, c: 129.79 },
            { o: 129.79, h: 129.93, l: 128.78, c: 128.9 },
            { o: 128.9, h: 129.44, l: 128.4, c: 129 },
            { o: 129, h: 129.43, l: 128.31, c: 128.82 },
            { o: 128.82, h: 131.48, l: 128.73, c: 131.33 },
            { o: 131.33, h: 134.03, l: 131.23, c: 133.82 },
            { o: 133.82, h: 137.08, l: 133.76, c: 136.98 },
            { o: 136.98, h: 140.4, l: 136.89, c: 140.34 },
            { o: 140.34, h: 143.29, l: 140.16, c: 143.13 },
            { o: 143.13, h: 146.29, l: 143.05, c: 146.17 },
            { o: 146.17, h: 147.55, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.08, l: 142.46, c: 142.7 },
            { o: 142.7, h: 143.04, l: 138.39, c: 138.62 },
            { o: 138.62, h: 138.95, l: 134.58, c: 134.88 },
            { o: 134.88, h: 135.15, l: 132.07, c: 132.22 },
            { o: 132.22, h: 132.46, l: 128.3, c: 128.6 }
          ],
          zones: [
            { from: 5, top: 148.27, bottom: 146.67, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 8, to: 9, label: "violent exit" },
          reveal: 10
        }
      },
      {
        title: "First pullback, small stop",
        narration: "Price rallies back for the first time. Sell at the bottom line, stop just above the top line. The stop is tiny compared with the drop that left the zone.",
        scene: {
          candles: [
            { o: 134, h: 136.56, l: 133.78, c: 136.31 },
            { o: 136.31, h: 138.95, l: 136.09, c: 138.7 },
            { o: 138.7, h: 141.79, l: 138.44, c: 141.59 },
            { o: 141.59, h: 144.8, l: 141.17, c: 144.58 },
            { o: 144.58, h: 147.41, l: 144.14, c: 147 },
            { o: 147, h: 148.11, l: 146.44, c: 147.65 },
            { o: 147.65, h: 148.27, l: 146.34, c: 146.67 },
            { o: 146.67, h: 147.33, l: 146.03, c: 146.9 },
            { o: 146.9, h: 147, l: 137.9, c: 138 },
            { o: 138, h: 138.17, l: 130.71, c: 130.9 },
            { o: 130.9, h: 131.23, l: 129.48, c: 129.79 },
            { o: 129.79, h: 129.93, l: 128.78, c: 128.9 },
            { o: 128.9, h: 129.44, l: 128.4, c: 129 },
            { o: 129, h: 129.43, l: 128.31, c: 128.82 },
            { o: 128.82, h: 131.48, l: 128.73, c: 131.33 },
            { o: 131.33, h: 134.03, l: 131.23, c: 133.82 },
            { o: 133.82, h: 137.08, l: 133.76, c: 136.98 },
            { o: 136.98, h: 140.4, l: 136.89, c: 140.34 },
            { o: 140.34, h: 143.29, l: 140.16, c: 143.13 },
            { o: 143.13, h: 146.29, l: 143.05, c: 146.17 },
            { o: 146.17, h: 147.55, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.08, l: 142.46, c: 142.7 },
            { o: 142.7, h: 143.04, l: 138.39, c: 138.62 },
            { o: 138.62, h: 138.95, l: 134.58, c: 134.88 },
            { o: 134.88, h: 135.15, l: 132.07, c: 132.22 },
            { o: 132.22, h: 132.46, l: 128.3, c: 128.6 }
          ],
          zones: [
            { from: 5, top: 148.27, bottom: 146.67, kind: "supply", label: "Supply" },
            { from: 12, top: 129, bottom: 128.31, kind: "demand", label: "Demand below" }
          ],
          lines: [
            { y: 146.67, label: "Entry (proximal)", kind: "entry" },
            { y: 148.57, label: "Stop beyond distal", kind: "sl" },
            { y: 129, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 20
        }
      },
      {
        title: "About 3:1 on day one",
        narration: "The unfilled sell orders were still waiting. Price turned at the zone and fell toward the demand below, like the bond trade that paid about 3:1 on the first day.",
        scene: {
          candles: [
            { o: 134, h: 136.56, l: 133.78, c: 136.31 },
            { o: 136.31, h: 138.95, l: 136.09, c: 138.7 },
            { o: 138.7, h: 141.79, l: 138.44, c: 141.59 },
            { o: 141.59, h: 144.8, l: 141.17, c: 144.58 },
            { o: 144.58, h: 147.41, l: 144.14, c: 147 },
            { o: 147, h: 148.11, l: 146.44, c: 147.65 },
            { o: 147.65, h: 148.27, l: 146.34, c: 146.67 },
            { o: 146.67, h: 147.33, l: 146.03, c: 146.9 },
            { o: 146.9, h: 147, l: 137.9, c: 138 },
            { o: 138, h: 138.17, l: 130.71, c: 130.9 },
            { o: 130.9, h: 131.23, l: 129.48, c: 129.79 },
            { o: 129.79, h: 129.93, l: 128.78, c: 128.9 },
            { o: 128.9, h: 129.44, l: 128.4, c: 129 },
            { o: 129, h: 129.43, l: 128.31, c: 128.82 },
            { o: 128.82, h: 131.48, l: 128.73, c: 131.33 },
            { o: 131.33, h: 134.03, l: 131.23, c: 133.82 },
            { o: 133.82, h: 137.08, l: 133.76, c: 136.98 },
            { o: 136.98, h: 140.4, l: 136.89, c: 140.34 },
            { o: 140.34, h: 143.29, l: 140.16, c: 143.13 },
            { o: 143.13, h: 146.29, l: 143.05, c: 146.17 },
            { o: 146.17, h: 147.55, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.08, l: 142.46, c: 142.7 },
            { o: 142.7, h: 143.04, l: 138.39, c: 138.62 },
            { o: 138.62, h: 138.95, l: 134.58, c: 134.88 },
            { o: 134.88, h: 135.15, l: 132.07, c: 132.22 },
            { o: 132.22, h: 132.46, l: 128.3, c: 128.6 }
          ],
          zones: [
            { from: 5, top: 148.27, bottom: 146.67, kind: "supply", label: "Supply" },
            { from: 12, top: 129, bottom: 128.31, kind: "demand", label: "Demand below" }
          ],
          lines: [
            { y: 146.67, label: "Entry (proximal)", kind: "entry" },
            { y: 148.57, label: "Stop beyond distal", kind: "sl" },
            { y: 129, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 20, y: 148.95, text: "Rejected at supply" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A level that price slowly drifted away from is just as strong as one with a violent departure.",
        answer: false,
        explain: "It can still be traded, but the imbalance is smaller, so the odds are lower."
      },
      {
        type: "mcq",
        q: "Why does price leave a pause with huge candles?",
        options: [
          "Random luck",
          "A large supply/demand imbalance was there",
          "The moving average turned",
          "The news was boring"
        ],
        answer: 1,
        explain: "A strong move away from apparent equilibrium happens because of a large imbalance at that level."
      },
      {
        type: "spot",
        q: "Click the candles that prove this pause was supply.",
        scene: {
          candles: [
            { o: 134, h: 136.56, l: 133.78, c: 136.31 },
            { o: 136.31, h: 138.95, l: 136.09, c: 138.7 },
            { o: 138.7, h: 141.79, l: 138.44, c: 141.59 },
            { o: 141.59, h: 144.8, l: 141.17, c: 144.58 },
            { o: 144.58, h: 147.41, l: 144.14, c: 147 },
            { o: 147, h: 148.11, l: 146.44, c: 147.65 },
            { o: 147.65, h: 148.27, l: 146.34, c: 146.67 },
            { o: 146.67, h: 147.33, l: 146.03, c: 146.9 },
            { o: 146.9, h: 147, l: 137.9, c: 138 },
            { o: 138, h: 138.17, l: 130.71, c: 130.9 },
            { o: 130.9, h: 131.23, l: 129.48, c: 129.79 },
            { o: 129.79, h: 129.93, l: 128.78, c: 128.9 },
            { o: 128.9, h: 129.44, l: 128.4, c: 129 },
            { o: 129, h: 129.43, l: 128.31, c: 128.82 },
            { o: 128.82, h: 131.48, l: 128.73, c: 131.33 },
            { o: 131.33, h: 134.03, l: 131.23, c: 133.82 },
            { o: 133.82, h: 137.08, l: 133.76, c: 136.98 },
            { o: 136.98, h: 140.4, l: 136.89, c: 140.34 },
            { o: 140.34, h: 143.29, l: 140.16, c: 143.13 },
            { o: 143.13, h: 146.29, l: 143.05, c: 146.17 },
            { o: 146.17, h: 147.55, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.08, l: 142.46, c: 142.7 },
            { o: 142.7, h: 143.04, l: 138.39, c: 138.62 },
            { o: 138.62, h: 138.95, l: 134.58, c: 134.88 },
            { o: 134.88, h: 135.15, l: 132.07, c: 132.22 },
            { o: 132.22, h: 132.46, l: 128.3, c: 128.6 }
          ]
        },
        answer: { from: 8, to: 9 },
        explain: "The two tall red candles leaving the base show sellers hugely outnumbered buyers there."
      },
      {
        type: "mcq",
        q: "Where does the stop go on a short at supply?",
        options: [
          "Just above the top line of the zone",
          "In the middle of the zone",
          "Below the entry",
          "No stop needed"
        ],
        answer: 0,
        explain: "Short at the proximal (bottom) line and put the stop just above the distal (top) line."
      },
      {
        type: "mcq",
        q: "How can a sector ETF like SMH help?",
        options: [
          "It replaces stops",
          "Its levels guide trades in that sector's stocks",
          "It shows the news",
          "It is only for long-term investors"
        ],
        answer: 1,
        explain: "Seiden uses the ETF's supply and demand as a guide for its component stocks."
      }
    ],
    practice: [
      {
        prompt: "Silver-style setup: demand formed at a late base after a collapse, and price left it with big green candles. Price pulls back for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 162, h: 162.32, l: 158.22, c: 158.52 },
            { o: 158.52, h: 158.79, l: 156.02, c: 156.47 },
            { o: 156.47, h: 156.69, l: 152.4, c: 152.59 },
            { o: 152.59, h: 152.86, l: 150.1, c: 150.29 },
            { o: 150.29, h: 150.7, l: 146.83, c: 147 },
            { o: 147, h: 147.53, l: 145.57, c: 146.1 },
            { o: 146.1, h: 148.39, l: 145.52, c: 148 },
            { o: 148, h: 148.54, l: 146.28, c: 146.95 },
            { o: 146.95, h: 154.7, l: 146.76, c: 154.55 },
            { o: 154.55, h: 161.02, l: 154.45, c: 160.95 },
            { o: 160.95, h: 162.74, l: 160.82, c: 162.51 },
            { o: 162.51, h: 164.36, l: 162.09, c: 163.95 },
            { o: 163.95, h: 164.62, l: 163.39, c: 163.75 },
            { o: 163.75, h: 164.52, l: 163.15, c: 163.98 },
            { o: 163.98, h: 164.2, l: 161.25, c: 161.42 },
            { o: 161.42, h: 161.51, l: 158.83, c: 158.98 },
            { o: 158.98, h: 159.15, l: 156.95, c: 157.07 },
            { o: 157.07, h: 157.24, l: 154.64, c: 154.73 },
            { o: 154.73, h: 154.85, l: 152.41, c: 152.57 },
            { o: 152.57, h: 152.79, l: 150.42, c: 150.61 },
            { o: 150.61, h: 150.68, l: 148.38, c: 148.5 },
            { o: 148.5, h: 149.15, l: 146.64, c: 148.9 },
            { o: 148.9, h: 152.84, l: 148.5, c: 152.66 },
            { o: 152.66, h: 155.15, l: 152.28, c: 154.89 },
            { o: 154.89, h: 158.05, l: 154.56, c: 157.72 },
            { o: 157.72, h: 161.96, l: 157.58, c: 161.79 },
            { o: 161.79, h: 164.49, l: 161.49, c: 164.15 }
          ],
          zones: [
            { from: 5, top: 148, bottom: 145.52, kind: "demand", label: "Demand" },
            { from: 12, top: 164.62, bottom: 163.75, kind: "supply", label: "Supply above" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "buy", tp: 163.75 },
        explain: "Strong departure, first pullback, low on the curve and good room to the supply above. Buy with a protective stop just under the zone. Price rallied to the supply."
      }
    ],
    cards: [
      { front: "Most important feature of a quality level?", back: "How price originally left it." },
      { front: "Strong exit means?", back: "A large imbalance, so higher odds." },
      { front: "Slow drift away means?", back: "A smaller imbalance; tradeable but lower odds." },
      { front: "Which pullback do you trade?", back: "The first one, stop just beyond the zone." },
      {
        front: "Why check contract size?",
        back: "Fast markets with big point values (Russell $100/point) need smaller size."
      }
    ],
    mnemonic: "Rocket, not Balloon: trade levels price launched from, not ones it floated away from."
  },
  {
    mentor: "seiden",
    n: 17,
    eli5: {
      oneLiner: "Sell at the turning point, not after the drop has started.",
      story: "If you buy something, someone must later pay you more for it. The late buyer who jumps in after a long rise is the one who pays you. Seiden plans his turning points in advance and waits there. The longer you wait for proof, the further price has already moved and the less is left for you.",
      analogy: "It is like catching a ball at the top of its throw: right at the top it is easy and close. Chase it after it falls and you miss most of the catch."
    },
    bigIdeas: [
      "Turning-point traders are paid by late trend followers and breakout buyers.",
      "Entering at the level gives a tiny stop and the biggest profit margin.",
      "Use price only; indicators lag and add risk."
    ],
    steps: [
      {
        title: "Mark the turning point first",
        narration: "Price rallied, paused, then fell hard. The pause is supply. We mark it before price returns.",
        scene: {
          candles: [
            { o: 135, h: 138.36, l: 134.84, c: 138.11 },
            { o: 138.11, h: 140.62, l: 137.71, c: 140.39 },
            { o: 140.39, h: 143.09, l: 140.01, c: 142.8 },
            { o: 142.8, h: 146.06, l: 142.61, c: 145.66 },
            { o: 145.66, h: 149.18, l: 145.47, c: 149 },
            { o: 149, h: 150.45, l: 148.38, c: 149.96 },
            { o: 149.96, h: 150.31, l: 147.56, c: 148.22 },
            { o: 148.22, h: 149.72, l: 147.57, c: 149.03 },
            { o: 149.03, h: 149.14, l: 143.8, c: 143.91 },
            { o: 143.91, h: 143.99, l: 139.02, c: 139.15 },
            { o: 139.15, h: 139.2, l: 133.93, c: 134.03 },
            { o: 134.03, h: 134.17, l: 132.71, c: 132.96 },
            { o: 132.96, h: 133.27, l: 131.79, c: 132.03 },
            { o: 132.03, h: 132.69, l: 131.43, c: 132.16 },
            { o: 132.16, h: 132.55, l: 131.54, c: 132.1 },
            { o: 132.1, h: 134.08, l: 132, c: 134 },
            { o: 134, h: 136.21, l: 133.83, c: 136.1 },
            { o: 136.1, h: 138.67, l: 135.82, c: 138.29 },
            { o: 138.29, h: 140.53, l: 138.16, c: 140.26 },
            { o: 140.26, h: 142.78, l: 140, c: 142.39 },
            { o: 142.39, h: 144.64, l: 142.13, c: 144.3 },
            { o: 144.3, h: 146.15, l: 144.05, c: 145.95 },
            { o: 145.95, h: 147.98, l: 145.74, c: 147.72 },
            { o: 147.72, h: 149.45, l: 147.07, c: 147.32 },
            { o: 147.32, h: 147.46, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.5, l: 141.4, c: 141.76 },
            { o: 141.76, h: 142.01, l: 137.05, c: 137.48 },
            { o: 137.48, h: 137.68, l: 133.95, c: 134.17 },
            { o: 134.17, h: 134.58, l: 131.32, c: 131.76 }
          ],
          zones: [
            { from: 5, top: 150.45, bottom: 148.22, kind: "supply", label: "Supply" }
          ],
          reveal: 11
        }
      },
      {
        title: "Late buyers arrive",
        narration: "Price rallies back for weeks. Trend followers and breakout buyers jump in near the top, right into supply.",
        scene: {
          candles: [
            { o: 135, h: 138.36, l: 134.84, c: 138.11 },
            { o: 138.11, h: 140.62, l: 137.71, c: 140.39 },
            { o: 140.39, h: 143.09, l: 140.01, c: 142.8 },
            { o: 142.8, h: 146.06, l: 142.61, c: 145.66 },
            { o: 145.66, h: 149.18, l: 145.47, c: 149 },
            { o: 149, h: 150.45, l: 148.38, c: 149.96 },
            { o: 149.96, h: 150.31, l: 147.56, c: 148.22 },
            { o: 148.22, h: 149.72, l: 147.57, c: 149.03 },
            { o: 149.03, h: 149.14, l: 143.8, c: 143.91 },
            { o: 143.91, h: 143.99, l: 139.02, c: 139.15 },
            { o: 139.15, h: 139.2, l: 133.93, c: 134.03 },
            { o: 134.03, h: 134.17, l: 132.71, c: 132.96 },
            { o: 132.96, h: 133.27, l: 131.79, c: 132.03 },
            { o: 132.03, h: 132.69, l: 131.43, c: 132.16 },
            { o: 132.16, h: 132.55, l: 131.54, c: 132.1 },
            { o: 132.1, h: 134.08, l: 132, c: 134 },
            { o: 134, h: 136.21, l: 133.83, c: 136.1 },
            { o: 136.1, h: 138.67, l: 135.82, c: 138.29 },
            { o: 138.29, h: 140.53, l: 138.16, c: 140.26 },
            { o: 140.26, h: 142.78, l: 140, c: 142.39 },
            { o: 142.39, h: 144.64, l: 142.13, c: 144.3 },
            { o: 144.3, h: 146.15, l: 144.05, c: 145.95 },
            { o: 145.95, h: 147.98, l: 145.74, c: 147.72 },
            { o: 147.72, h: 149.45, l: 147.07, c: 147.32 },
            { o: 147.32, h: 147.46, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.5, l: 141.4, c: 141.76 },
            { o: 141.76, h: 142.01, l: 137.05, c: 137.48 },
            { o: 137.48, h: 137.68, l: 133.95, c: 134.17 },
            { o: 134.17, h: 134.58, l: 131.32, c: 131.76 }
          ],
          zones: [
            { from: 5, top: 150.45, bottom: 148.22, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 17, to: 22, label: "late buyers" },
          reveal: 23
        }
      },
      {
        title: "Short at the first touch",
        narration: "Our short sits at the bottom line, with the stop just above the top line. Stop very close, targets far away.",
        scene: {
          candles: [
            { o: 135, h: 138.36, l: 134.84, c: 138.11 },
            { o: 138.11, h: 140.62, l: 137.71, c: 140.39 },
            { o: 140.39, h: 143.09, l: 140.01, c: 142.8 },
            { o: 142.8, h: 146.06, l: 142.61, c: 145.66 },
            { o: 145.66, h: 149.18, l: 145.47, c: 149 },
            { o: 149, h: 150.45, l: 148.38, c: 149.96 },
            { o: 149.96, h: 150.31, l: 147.56, c: 148.22 },
            { o: 148.22, h: 149.72, l: 147.57, c: 149.03 },
            { o: 149.03, h: 149.14, l: 143.8, c: 143.91 },
            { o: 143.91, h: 143.99, l: 139.02, c: 139.15 },
            { o: 139.15, h: 139.2, l: 133.93, c: 134.03 },
            { o: 134.03, h: 134.17, l: 132.71, c: 132.96 },
            { o: 132.96, h: 133.27, l: 131.79, c: 132.03 },
            { o: 132.03, h: 132.69, l: 131.43, c: 132.16 },
            { o: 132.16, h: 132.55, l: 131.54, c: 132.1 },
            { o: 132.1, h: 134.08, l: 132, c: 134 },
            { o: 134, h: 136.21, l: 133.83, c: 136.1 },
            { o: 136.1, h: 138.67, l: 135.82, c: 138.29 },
            { o: 138.29, h: 140.53, l: 138.16, c: 140.26 },
            { o: 140.26, h: 142.78, l: 140, c: 142.39 },
            { o: 142.39, h: 144.64, l: 142.13, c: 144.3 },
            { o: 144.3, h: 146.15, l: 144.05, c: 145.95 },
            { o: 145.95, h: 147.98, l: 145.74, c: 147.72 },
            { o: 147.72, h: 149.45, l: 147.07, c: 147.32 },
            { o: 147.32, h: 147.46, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.5, l: 141.4, c: 141.76 },
            { o: 141.76, h: 142.01, l: 137.05, c: 137.48 },
            { o: 137.48, h: 137.68, l: 133.95, c: 134.17 },
            { o: 134.17, h: 134.58, l: 131.32, c: 131.76 }
          ],
          zones: [
            { from: 5, top: 150.45, bottom: 148.22, kind: "supply", label: "Supply" },
            { from: 13, top: 132.16, bottom: 131.43, kind: "demand", label: "Demand target" }
          ],
          lines: [
            { y: 148.22, label: "Entry (proximal)", kind: "entry" },
            { y: 150.75, label: "Stop beyond distal", kind: "sl" },
            { y: 132.16, label: "Target: opposing level", kind: "tp" }
          ]
        }
      },
      {
        title: "Why waiting costs you",
        narration: "Someone who waits for the drop to \"confirm\" sells much lower. Their stop is far away and their room to the target is small. Prefer the low-risk entry at the level.",
        scene: {
          candles: [
            { o: 135, h: 138.36, l: 134.84, c: 138.11 },
            { o: 138.11, h: 140.62, l: 137.71, c: 140.39 },
            { o: 140.39, h: 143.09, l: 140.01, c: 142.8 },
            { o: 142.8, h: 146.06, l: 142.61, c: 145.66 },
            { o: 145.66, h: 149.18, l: 145.47, c: 149 },
            { o: 149, h: 150.45, l: 148.38, c: 149.96 },
            { o: 149.96, h: 150.31, l: 147.56, c: 148.22 },
            { o: 148.22, h: 149.72, l: 147.57, c: 149.03 },
            { o: 149.03, h: 149.14, l: 143.8, c: 143.91 },
            { o: 143.91, h: 143.99, l: 139.02, c: 139.15 },
            { o: 139.15, h: 139.2, l: 133.93, c: 134.03 },
            { o: 134.03, h: 134.17, l: 132.71, c: 132.96 },
            { o: 132.96, h: 133.27, l: 131.79, c: 132.03 },
            { o: 132.03, h: 132.69, l: 131.43, c: 132.16 },
            { o: 132.16, h: 132.55, l: 131.54, c: 132.1 },
            { o: 132.1, h: 134.08, l: 132, c: 134 },
            { o: 134, h: 136.21, l: 133.83, c: 136.1 },
            { o: 136.1, h: 138.67, l: 135.82, c: 138.29 },
            { o: 138.29, h: 140.53, l: 138.16, c: 140.26 },
            { o: 140.26, h: 142.78, l: 140, c: 142.39 },
            { o: 142.39, h: 144.64, l: 142.13, c: 144.3 },
            { o: 144.3, h: 146.15, l: 144.05, c: 145.95 },
            { o: 145.95, h: 147.98, l: 145.74, c: 147.72 },
            { o: 147.72, h: 149.45, l: 147.07, c: 147.32 },
            { o: 147.32, h: 147.46, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.5, l: 141.4, c: 141.76 },
            { o: 141.76, h: 142.01, l: 137.05, c: 137.48 },
            { o: 137.48, h: 137.68, l: 133.95, c: 134.17 },
            { o: 134.17, h: 134.58, l: 131.32, c: 131.76 }
          ],
          zones: [
            { from: 5, top: 150.45, bottom: 148.22, kind: "supply", label: "Supply" },
            { from: 13, top: 132.16, bottom: 131.43, kind: "demand", label: "Demand target" }
          ],
          lines: [
            { y: 148.22, label: "Entry (proximal)", kind: "entry" },
            { y: 150.75, label: "Stop beyond distal", kind: "sl" },
            { y: 132.16, label: "Target: opposing level", kind: "tp" },
            { y: 144.22, label: "Late short (worse)", kind: "level" }
          ],
          notes: [
            { x: 28, y: 135.98, text: "Profit margin kept" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Who pays the turning-point trader?",
        options: [
          "The exchange",
          "Late trend followers and breakout buyers",
          "Other turning-point traders",
          "Nobody"
        ],
        answer: 1,
        explain: "When you short, others must sell after you lower. Late trend followers and breakout traders supply that money."
      },
      {
        type: "tf",
        q: "Waiting for lots of confirmation below supply lowers your risk.",
        answer: false,
        explain: "The longer you wait and let price drop, the more risk rises and the more profit margin shrinks."
      },
      {
        type: "spot",
        q: "Click the candle where the low-risk short fills.",
        scene: {
          candles: [
            { o: 135, h: 138.36, l: 134.84, c: 138.11 },
            { o: 138.11, h: 140.62, l: 137.71, c: 140.39 },
            { o: 140.39, h: 143.09, l: 140.01, c: 142.8 },
            { o: 142.8, h: 146.06, l: 142.61, c: 145.66 },
            { o: 145.66, h: 149.18, l: 145.47, c: 149 },
            { o: 149, h: 150.45, l: 148.38, c: 149.96 },
            { o: 149.96, h: 150.31, l: 147.56, c: 148.22 },
            { o: 148.22, h: 149.72, l: 147.57, c: 149.03 },
            { o: 149.03, h: 149.14, l: 143.8, c: 143.91 },
            { o: 143.91, h: 143.99, l: 139.02, c: 139.15 },
            { o: 139.15, h: 139.2, l: 133.93, c: 134.03 },
            { o: 134.03, h: 134.17, l: 132.71, c: 132.96 },
            { o: 132.96, h: 133.27, l: 131.79, c: 132.03 },
            { o: 132.03, h: 132.69, l: 131.43, c: 132.16 },
            { o: 132.16, h: 132.55, l: 131.54, c: 132.1 },
            { o: 132.1, h: 134.08, l: 132, c: 134 },
            { o: 134, h: 136.21, l: 133.83, c: 136.1 },
            { o: 136.1, h: 138.67, l: 135.82, c: 138.29 },
            { o: 138.29, h: 140.53, l: 138.16, c: 140.26 },
            { o: 140.26, h: 142.78, l: 140, c: 142.39 },
            { o: 142.39, h: 144.64, l: 142.13, c: 144.3 },
            { o: 144.3, h: 146.15, l: 144.05, c: 145.95 },
            { o: 145.95, h: 147.98, l: 145.74, c: 147.72 },
            { o: 147.72, h: 149.45, l: 147.07, c: 147.32 },
            { o: 147.32, h: 147.46, l: 143.71, c: 144.08 },
            { o: 144.08, h: 144.5, l: 141.4, c: 141.76 },
            { o: 141.76, h: 142.01, l: 137.05, c: 137.48 },
            { o: 137.48, h: 137.68, l: 133.95, c: 134.17 },
            { o: 134.17, h: 134.58, l: 131.32, c: 131.76 }
          ],
          zones: [
            { from: 5, top: 150.45, bottom: 148.22, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 23, to: 23 },
        explain: "The first touch of the supply zone. The stop is just above the zone, cents away, and the target is far below."
      },
      {
        type: "mcq",
        q: "Why does Seiden prefer price over indicators?",
        options: [
          "Indicators are illegal",
          "All influences are already in price; indicators lag",
          "Price is slower",
          "Indicators are too accurate"
        ],
        answer: 1,
        explain: "Any and all influences on price are reflected in price. Anything added, like a moving average, lags and adds risk."
      },
      {
        type: "mcq",
        q: "Price has never even reached a big monthly supply level. What does that suggest?",
        options: [
          "No supply there",
          "Plenty of supply waits there, a turn is likely",
          "Buy more",
          "The chart is broken"
        ],
        answer: 1,
        explain: "Like the NASDAQ monthly chart: an untouched big-picture supply still holds lots of sell orders."
      }
    ],
    practice: [
      {
        prompt: "Supply from a sharp drop is marked. Price has rallied back to just under it. Choose entry, stop and target.",
        scene: {
          candles: [
            { o: 134, h: 136.13, l: 133.71, c: 135.92 },
            { o: 135.92, h: 139.3, l: 135.49, c: 139.07 },
            { o: 139.07, h: 141.35, l: 138.64, c: 141.13 },
            { o: 141.13, h: 143.72, l: 140.9, c: 143.36 },
            { o: 143.36, h: 146.43, l: 143.2, c: 146 },
            { o: 146, h: 147.74, l: 145.31, c: 147.05 },
            { o: 147.05, h: 147.62, l: 145.34, c: 145.93 },
            { o: 145.93, h: 146.09, l: 137.06, c: 137.19 },
            { o: 137.19, h: 137.31, l: 129.87, c: 129.93 },
            { o: 129.93, h: 130.06, l: 128.52, c: 128.71 },
            { o: 128.71, h: 129.08, l: 126.54, c: 126.93 },
            { o: 126.93, h: 127.42, l: 126.62, c: 127.07 },
            { o: 127.07, h: 127.56, l: 126.27, c: 126.88 },
            { o: 126.88, h: 129.49, l: 126.67, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.11, c: 131.88 },
            { o: 131.88, h: 135.53, l: 131.58, c: 135.19 },
            { o: 135.19, h: 137.27, l: 134.78, c: 136.98 },
            { o: 136.98, h: 140.29, l: 136.71, c: 139.91 },
            { o: 139.91, h: 142.28, l: 139.72, c: 142.07 },
            { o: 142.07, h: 145.83, l: 141.83, c: 145.43 },
            { o: 145.43, h: 146.93, l: 144.78, c: 145.03 },
            { o: 145.03, h: 145.24, l: 141.9, c: 142.09 },
            { o: 142.09, h: 142.39, l: 136.52, c: 136.96 },
            { o: 136.96, h: 137.17, l: 133.13, c: 133.51 },
            { o: 133.51, h: 133.66, l: 129.97, c: 130.22 },
            { o: 130.22, h: 130.38, l: 126.22, c: 126.67 }
          ],
          zones: [
            { from: 5, top: 147.74, bottom: 145.93, kind: "supply", label: "Supply" },
            { from: 11, top: 127.07, bottom: 126.27, kind: "demand", label: "Demand" }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { entry: 145.93, sl: 148.04, tp: 127.07 },
        explain: "Sell at the bottom line of supply, stop just above the top line, target the demand below. Entering right at the turning point keeps the stop tiny and the margin large."
      }
    ],
    cards: [
      { front: "Where do you enter a short?", back: "At the pre-planned supply level, not after the drop starts." },
      { front: "What happens if you wait to short?", back: "Risk rises and the profit margin shrinks." },
      {
        front: "Why check the monthly chart?",
        back: "To see big supply and demand that frames all smaller trades."
      },
      { front: "Main input for decisions?", back: "Price. Indicators lag." },
      { front: "Two people on the wrong side at a top?", back: "The late trend follower and the breakout buyer." }
    ],
    mnemonic: "Be First in Line: plan the turn, wait at the level, let the latecomers pay."
  },
  {
    mentor: "seiden",
    n: 20,
    eli5: {
      oneLiner: "Find a supply and demand pair, short one, cover at the other.",
      story: "A student found a supply level above and a demand level below with lots of space between them. He sold at supply before the big red candle came and bought back at demand. The gain was nice, but the real lesson was the low-risk entry. Having rules is one thing; following them every time is the hard part.",
      analogy: "It is like a ball bouncing between the ceiling and the floor: you catch it at the ceiling and let go at the floor."
    },
    bigIdeas: [
      "Find the supply/demand pair first; trade only if the space between them is large.",
      "Enter at the level before the big candle; do not chase.",
      "Levels are zones. Trade the first revisit only."
    ],
    steps: [
      {
        title: "Supply above",
        narration: "A small base, then a free fall. That base is supply: resistance where sellers beat buyers.",
        scene: {
          candles: [
            { o: 134, h: 136.98, l: 133.7, c: 136.68 },
            { o: 136.68, h: 139.47, l: 136.46, c: 139.12 },
            { o: 139.12, h: 141.53, l: 138.78, c: 141.09 },
            { o: 141.09, h: 143.42, l: 140.93, c: 143.05 },
            { o: 143.05, h: 146.28, l: 142.62, c: 146 },
            { o: 146, h: 146.5, l: 145.4, c: 146.17 },
            { o: 146.17, h: 146.81, l: 144.92, c: 145.61 },
            { o: 145.61, h: 146.26, l: 145.23, c: 145.95 },
            { o: 145.95, h: 146.01, l: 139.97, c: 140.04 },
            { o: 140.04, h: 140.17, l: 134.79, c: 134.9 },
            { o: 134.9, h: 134.95, l: 128.83, c: 128.95 },
            { o: 128.95, h: 129.12, l: 127.96, c: 128.09 },
            { o: 128.09, h: 128.35, l: 126.6, c: 126.95 },
            { o: 126.95, h: 127.46, l: 126.43, c: 127.13 },
            { o: 127.13, h: 127.54, l: 126.58, c: 126.96 },
            { o: 126.96, h: 129.47, l: 126.86, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.08, c: 131.96 },
            { o: 131.96, h: 135.08, l: 131.67, c: 134.74 },
            { o: 134.74, h: 139.39, l: 134.42, c: 139.25 },
            { o: 139.25, h: 142.23, l: 139.11, c: 142.05 },
            { o: 142.05, h: 145.26, l: 141.6, c: 145.11 },
            { o: 145.11, h: 146.27, l: 144.46, c: 144.71 },
            { o: 144.71, h: 145.1, l: 141.28, c: 141.67 },
            { o: 141.67, h: 141.97, l: 136.5, c: 136.95 },
            { o: 136.95, h: 137.32, l: 133.01, c: 133.36 },
            { o: 133.36, h: 133.57, l: 129.83, c: 130.17 },
            { o: 130.17, h: 130.51, l: 126.34, c: 126.73 }
          ],
          zones: [
            { from: 5, top: 146.81, bottom: 145.61, kind: "supply", label: "Supply" }
          ],
          reveal: 11
        }
      },
      {
        title: "Demand below",
        narration: "Later a new base forms low down and price rallies. That is demand. Now we have a pair, with a big profit margin between them.",
        scene: {
          candles: [
            { o: 134, h: 136.98, l: 133.7, c: 136.68 },
            { o: 136.68, h: 139.47, l: 136.46, c: 139.12 },
            { o: 139.12, h: 141.53, l: 138.78, c: 141.09 },
            { o: 141.09, h: 143.42, l: 140.93, c: 143.05 },
            { o: 143.05, h: 146.28, l: 142.62, c: 146 },
            { o: 146, h: 146.5, l: 145.4, c: 146.17 },
            { o: 146.17, h: 146.81, l: 144.92, c: 145.61 },
            { o: 145.61, h: 146.26, l: 145.23, c: 145.95 },
            { o: 145.95, h: 146.01, l: 139.97, c: 140.04 },
            { o: 140.04, h: 140.17, l: 134.79, c: 134.9 },
            { o: 134.9, h: 134.95, l: 128.83, c: 128.95 },
            { o: 128.95, h: 129.12, l: 127.96, c: 128.09 },
            { o: 128.09, h: 128.35, l: 126.6, c: 126.95 },
            { o: 126.95, h: 127.46, l: 126.43, c: 127.13 },
            { o: 127.13, h: 127.54, l: 126.58, c: 126.96 },
            { o: 126.96, h: 129.47, l: 126.86, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.08, c: 131.96 },
            { o: 131.96, h: 135.08, l: 131.67, c: 134.74 },
            { o: 134.74, h: 139.39, l: 134.42, c: 139.25 },
            { o: 139.25, h: 142.23, l: 139.11, c: 142.05 },
            { o: 142.05, h: 145.26, l: 141.6, c: 145.11 },
            { o: 145.11, h: 146.27, l: 144.46, c: 144.71 },
            { o: 144.71, h: 145.1, l: 141.28, c: 141.67 },
            { o: 141.67, h: 141.97, l: 136.5, c: 136.95 },
            { o: 136.95, h: 137.32, l: 133.01, c: 133.36 },
            { o: 133.36, h: 133.57, l: 129.83, c: 130.17 },
            { o: 130.17, h: 130.51, l: 126.34, c: 126.73 }
          ],
          zones: [
            { from: 5, top: 146.81, bottom: 145.61, kind: "supply", label: "Supply" },
            { from: 13, top: 127.13, bottom: 126.43, kind: "demand", label: "Demand" }
          ],
          reveal: 17
        }
      },
      {
        title: "Short at supply, first in line",
        narration: "Price rallies back into supply for the first time. Sell at the bottom line, stop just above. We are first in line, before any big red candle.",
        scene: {
          candles: [
            { o: 134, h: 136.98, l: 133.7, c: 136.68 },
            { o: 136.68, h: 139.47, l: 136.46, c: 139.12 },
            { o: 139.12, h: 141.53, l: 138.78, c: 141.09 },
            { o: 141.09, h: 143.42, l: 140.93, c: 143.05 },
            { o: 143.05, h: 146.28, l: 142.62, c: 146 },
            { o: 146, h: 146.5, l: 145.4, c: 146.17 },
            { o: 146.17, h: 146.81, l: 144.92, c: 145.61 },
            { o: 145.61, h: 146.26, l: 145.23, c: 145.95 },
            { o: 145.95, h: 146.01, l: 139.97, c: 140.04 },
            { o: 140.04, h: 140.17, l: 134.79, c: 134.9 },
            { o: 134.9, h: 134.95, l: 128.83, c: 128.95 },
            { o: 128.95, h: 129.12, l: 127.96, c: 128.09 },
            { o: 128.09, h: 128.35, l: 126.6, c: 126.95 },
            { o: 126.95, h: 127.46, l: 126.43, c: 127.13 },
            { o: 127.13, h: 127.54, l: 126.58, c: 126.96 },
            { o: 126.96, h: 129.47, l: 126.86, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.08, c: 131.96 },
            { o: 131.96, h: 135.08, l: 131.67, c: 134.74 },
            { o: 134.74, h: 139.39, l: 134.42, c: 139.25 },
            { o: 139.25, h: 142.23, l: 139.11, c: 142.05 },
            { o: 142.05, h: 145.26, l: 141.6, c: 145.11 },
            { o: 145.11, h: 146.27, l: 144.46, c: 144.71 },
            { o: 144.71, h: 145.1, l: 141.28, c: 141.67 },
            { o: 141.67, h: 141.97, l: 136.5, c: 136.95 },
            { o: 136.95, h: 137.32, l: 133.01, c: 133.36 },
            { o: 133.36, h: 133.57, l: 129.83, c: 130.17 },
            { o: 130.17, h: 130.51, l: 126.34, c: 126.73 }
          ],
          zones: [
            { from: 5, top: 146.81, bottom: 145.61, kind: "supply", label: "Supply" },
            { from: 13, top: 127.13, bottom: 126.43, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 145.61, label: "Entry (proximal)", kind: "entry" },
            { y: 147.11, label: "Stop beyond distal", kind: "sl" },
            { y: 127.13, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 21
        }
      },
      {
        title: "Cover at demand",
        narration: "Price falls and we buy back at the demand line, exactly as planned before entry.",
        scene: {
          candles: [
            { o: 134, h: 136.98, l: 133.7, c: 136.68 },
            { o: 136.68, h: 139.47, l: 136.46, c: 139.12 },
            { o: 139.12, h: 141.53, l: 138.78, c: 141.09 },
            { o: 141.09, h: 143.42, l: 140.93, c: 143.05 },
            { o: 143.05, h: 146.28, l: 142.62, c: 146 },
            { o: 146, h: 146.5, l: 145.4, c: 146.17 },
            { o: 146.17, h: 146.81, l: 144.92, c: 145.61 },
            { o: 145.61, h: 146.26, l: 145.23, c: 145.95 },
            { o: 145.95, h: 146.01, l: 139.97, c: 140.04 },
            { o: 140.04, h: 140.17, l: 134.79, c: 134.9 },
            { o: 134.9, h: 134.95, l: 128.83, c: 128.95 },
            { o: 128.95, h: 129.12, l: 127.96, c: 128.09 },
            { o: 128.09, h: 128.35, l: 126.6, c: 126.95 },
            { o: 126.95, h: 127.46, l: 126.43, c: 127.13 },
            { o: 127.13, h: 127.54, l: 126.58, c: 126.96 },
            { o: 126.96, h: 129.47, l: 126.86, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.08, c: 131.96 },
            { o: 131.96, h: 135.08, l: 131.67, c: 134.74 },
            { o: 134.74, h: 139.39, l: 134.42, c: 139.25 },
            { o: 139.25, h: 142.23, l: 139.11, c: 142.05 },
            { o: 142.05, h: 145.26, l: 141.6, c: 145.11 },
            { o: 145.11, h: 146.27, l: 144.46, c: 144.71 },
            { o: 144.71, h: 145.1, l: 141.28, c: 141.67 },
            { o: 141.67, h: 141.97, l: 136.5, c: 136.95 },
            { o: 136.95, h: 137.32, l: 133.01, c: 133.36 },
            { o: 133.36, h: 133.57, l: 129.83, c: 130.17 },
            { o: 130.17, h: 130.51, l: 126.34, c: 126.73 }
          ],
          zones: [
            { from: 5, top: 146.81, bottom: 145.61, kind: "supply", label: "Supply" },
            { from: 13, top: 127.13, bottom: 126.43, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 145.61, label: "Entry (proximal)", kind: "entry" },
            { y: 147.11, label: "Stop beyond distal", kind: "sl" },
            { y: 127.13, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 26, y: 124.94, text: "Covered at demand" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "You should wait for a large red candle before shorting at supply.",
        answer: false,
        explain: "Shorting at supply before the big red candle puts you first in line, close to the stop and far from demand."
      },
      {
        type: "mcq",
        q: "What should you find first, before entering?",
        options: [
          "A news headline",
          "A supply and demand pair with an ideal profit margin",
          "A moving-average cross",
          "A tip from a friend"
        ],
        answer: 1,
        explain: "The student first found the pair, measured the room, then shorted supply and covered at demand."
      },
      {
        type: "spot",
        q: "Click the base that is the cover target (demand).",
        scene: {
          candles: [
            { o: 134, h: 136.98, l: 133.7, c: 136.68 },
            { o: 136.68, h: 139.47, l: 136.46, c: 139.12 },
            { o: 139.12, h: 141.53, l: 138.78, c: 141.09 },
            { o: 141.09, h: 143.42, l: 140.93, c: 143.05 },
            { o: 143.05, h: 146.28, l: 142.62, c: 146 },
            { o: 146, h: 146.5, l: 145.4, c: 146.17 },
            { o: 146.17, h: 146.81, l: 144.92, c: 145.61 },
            { o: 145.61, h: 146.26, l: 145.23, c: 145.95 },
            { o: 145.95, h: 146.01, l: 139.97, c: 140.04 },
            { o: 140.04, h: 140.17, l: 134.79, c: 134.9 },
            { o: 134.9, h: 134.95, l: 128.83, c: 128.95 },
            { o: 128.95, h: 129.12, l: 127.96, c: 128.09 },
            { o: 128.09, h: 128.35, l: 126.6, c: 126.95 },
            { o: 126.95, h: 127.46, l: 126.43, c: 127.13 },
            { o: 127.13, h: 127.54, l: 126.58, c: 126.96 },
            { o: 126.96, h: 129.47, l: 126.86, c: 129.29 },
            { o: 129.29, h: 132.06, l: 129.08, c: 131.96 },
            { o: 131.96, h: 135.08, l: 131.67, c: 134.74 },
            { o: 134.74, h: 139.39, l: 134.42, c: 139.25 },
            { o: 139.25, h: 142.23, l: 139.11, c: 142.05 },
            { o: 142.05, h: 145.26, l: 141.6, c: 145.11 },
            { o: 145.11, h: 146.27, l: 144.46, c: 144.71 },
            { o: 144.71, h: 145.1, l: 141.28, c: 141.67 },
            { o: 141.67, h: 141.97, l: 136.5, c: 136.95 },
            { o: 136.95, h: 137.32, l: 133.01, c: 133.36 },
            { o: 133.36, h: 133.57, l: 129.83, c: 130.17 },
            { o: 130.17, h: 130.51, l: 126.34, c: 126.73 }
          ],
          zones: [
            { from: 5, top: 146.81, bottom: 145.61, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 13, to: 14 },
        explain: "The base that price rallied from low down is demand: the cover target for the short."
      },
      {
        type: "mcq",
        q: "Price returns to the same supply for the third time. What does the rule say?",
        options: [
          "Best trade yet",
          "Skip it: trade the first revisit only",
          "Double the size",
          "Move the stop"
        ],
        answer: 1,
        explain: "Risk is lowest and reward highest on the first revisit; each extra pullback lowers the odds."
      },
      {
        type: "mcq",
        q: "What two mistakes did the buyer on the other side make?",
        options: [
          "Bought low and sold high",
          "Bought after a move up and into known supply",
          "Used a stop and a target",
          "Waited for the level"
        ],
        answer: 1,
        explain: "The novice buyer bought after a rally and right where supply exceeded demand."
      }
    ],
    practice: [
      {
        prompt: "Supply above, demand far below. Price is rallying back into supply for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 135, h: 137.45, l: 134.87, c: 137.18 },
            { o: 137.18, h: 140.15, l: 136.84, c: 139.83 },
            { o: 139.83, h: 142.96, l: 139.44, c: 142.58 },
            { o: 142.58, h: 144.49, l: 142.37, c: 144.16 },
            { o: 144.16, h: 147.15, l: 144.01, c: 147 },
            { o: 147, h: 147.78, l: 146.3, c: 147.23 },
            { o: 147.23, h: 147.63, l: 145.44, c: 145.95 },
            { o: 145.95, h: 147.51, l: 145.47, c: 146.92 },
            { o: 146.92, h: 147.06, l: 139.17, c: 139.24 },
            { o: 139.24, h: 139.44, l: 131.84, c: 131.92 },
            { o: 131.92, h: 132.26, l: 130.44, c: 130.89 },
            { o: 130.89, h: 131.21, l: 129.75, c: 129.92 },
            { o: 129.92, h: 130.61, l: 129.38, c: 130.13 },
            { o: 130.13, h: 130.76, l: 129.43, c: 129.94 },
            { o: 129.94, h: 132.3, l: 129.74, c: 132.22 },
            { o: 132.22, h: 135.05, l: 132.17, c: 134.94 },
            { o: 134.94, h: 137.72, l: 134.62, c: 137.28 },
            { o: 137.28, h: 139.07, l: 137.13, c: 138.72 },
            { o: 138.72, h: 141.95, l: 138.36, c: 141.56 },
            { o: 141.56, h: 143.82, l: 141.15, c: 143.62 },
            { o: 143.62, h: 145.85, l: 143.49, c: 145.45 },
            { o: 145.45, h: 146.96, l: 144.8, c: 145.05 },
            { o: 145.05, h: 145.24, l: 141.97, c: 142.25 },
            { o: 142.25, h: 142.66, l: 138.71, c: 139.13 },
            { o: 139.13, h: 139.33, l: 135.85, c: 135.97 },
            { o: 135.97, h: 136.23, l: 133.11, c: 133.25 },
            { o: 133.25, h: 133.68, l: 129.56, c: 129.73 }
          ],
          zones: [
            { from: 5, top: 147.78, bottom: 145.95, kind: "supply", label: "Supply" },
            { from: 12, top: 130.13, bottom: 129.38, kind: "demand", label: "Demand" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "sell", tp: 130.13 },
        explain: "First revisit of supply with a big profit margin to the demand below. Short at the bottom line, stop above, cover at demand. Price dropped to the target."
      },
      {
        prompt: "This supply has already turned price twice. Price is back again for a third visit. Sell, buy or nothing?",
        scene: {
          candles: [
            { o: 136, h: 139.08, l: 135.76, c: 138.68 },
            { o: 138.68, h: 140.49, l: 138.29, c: 140.15 },
            { o: 140.15, h: 142.42, l: 139.91, c: 142.27 },
            { o: 142.27, h: 144.78, l: 142.01, c: 144.57 },
            { o: 144.57, h: 147.28, l: 144.13, c: 147 },
            { o: 147, h: 148.49, l: 146.41, c: 148.05 },
            { o: 148.05, h: 148.75, l: 145.68, c: 146.24 },
            { o: 146.24, h: 147.68, l: 145.92, c: 147.04 },
            { o: 147.04, h: 147.21, l: 142.97, c: 143.13 },
            { o: 143.13, h: 143.3, l: 138.54, c: 138.69 },
            { o: 138.69, h: 138.88, l: 134.85, c: 135.04 },
            { o: 135.04, h: 135.29, l: 133.12, c: 133.58 },
            { o: 133.58, h: 133.85, l: 132.58, c: 132.78 },
            { o: 132.78, h: 133.15, l: 131.76, c: 132.19 },
            { o: 132.19, h: 132.92, l: 131.69, c: 132.54 },
            { o: 132.54, h: 136.53, l: 132.29, c: 136.28 },
            { o: 136.28, h: 141.2, l: 136.06, c: 140.93 },
            { o: 140.93, h: 145.9, l: 140.51, c: 145.74 },
            { o: 145.74, h: 147.49, l: 145.29, c: 145.54 },
            { o: 145.54, h: 145.85, l: 144.1, c: 144.28 },
            { o: 144.28, h: 144.57, l: 142.85, c: 143 },
            { o: 143, h: 143.43, l: 141.28, c: 141.54 },
            { o: 141.54, h: 143.09, l: 141.24, c: 142.94 },
            { o: 142.94, h: 144.41, l: 142.52, c: 144.21 },
            { o: 144.21, h: 145.87, l: 144.04, c: 145.74 },
            { o: 145.74, h: 147.87, l: 145.29, c: 145.54 },
            { o: 145.54, h: 145.67, l: 144.27, c: 144.52 },
            { o: 144.52, h: 144.79, l: 142.33, c: 142.59 },
            { o: 142.59, h: 142.72, l: 141.22, c: 141.54 },
            { o: 141.54, h: 142.76, l: 141.19, c: 142.53 },
            { o: 142.53, h: 143.9, l: 142.13, c: 143.71 },
            { o: 143.71, h: 145.25, l: 143.44, c: 144.82 },
            { o: 144.82, h: 146.14, l: 144.51, c: 145.74 },
            { o: 145.74, h: 152.05, l: 145.59, c: 151.75 },
            { o: 151.75, h: 153.88, l: 151.51, c: 153.44 },
            { o: 153.44, h: 155.15, l: 153.04, c: 154.9 },
            { o: 154.9, h: 156.91, l: 154.71, c: 156.59 },
            { o: 156.59, h: 158.15, l: 156.46, c: 157.75 }
          ],
          zones: [
            { from: 5, top: 148.75, bottom: 146.24, kind: "supply", label: "Supply (3rd visit)" }
          ],
          reveal: 33
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Only the first revisit is traded. Each visit removed sell orders, and this time price went straight through the zone."
      }
    ],
    cards: [
      {
        front: "Two reasons for Seiden's success?",
        back: "Mechanical supply/demand rules, and actually following them."
      },
      { front: "Where is the target on a short at supply?", back: "The opposing demand level." },
      { front: "Which revisit do you trade?", back: "The first one." },
      { front: "Levels are lines or zones?", back: "Zones: areas to buy and sell." },
      { front: "What matters more than the gain?", back: "The low-risk entry." }
    ],
    mnemonic: "Ceiling to Floor: sell the ceiling, cover at the floor, first visit only."
  },
  {
    mentor: "seiden",
    n: 25,
    eli5: {
      oneLiner: "Only trade at a fresh level, with room to run, planned in advance.",
      story: "Seiden's day-trading rules fit on a napkin. Only enter at supply or demand, never in the middle. Use just two entries: the first pullback or the breakout. Each day mark one supply and one demand per market on a bigger intraday chart. Pre-set your entry, stop and target, and ignore the news.",
      analogy: "It is like fishing only at the spots where you know the fish gather, with your rod set up before you leave home."
    },
    bigIdeas: [
      "Enter only at a supply or demand level. Never in the middle.",
      "Two entries: first pullback and breakout. Both need a fresh level and room to move.",
      "Pre-set entry, stop and target. Need 3:1 to target 1."
    ],
    steps: [
      {
        title: "Mark one demand",
        narration: "On a larger intraday chart, mark today's demand: the base price left with big green candles.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 162, c: 162.44 },
            { o: 162.44, h: 162.62, l: 159.09, c: 159.26 },
            { o: 159.26, h: 159.7, l: 156.54, c: 156.68 },
            { o: 156.68, h: 156.94, l: 153.78, c: 154.04 },
            { o: 154.04, h: 154.44, l: 151.81, c: 152 },
            { o: 152, h: 152.4, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.86, l: 151.21, c: 152.3 },
            { o: 152.3, h: 152.71, l: 151.37, c: 151.91 },
            { o: 151.91, h: 159.08, l: 151.85, c: 158.98 },
            { o: 158.98, h: 167.02, l: 158.83, c: 166.91 },
            { o: 166.91, h: 169.5, l: 166.68, c: 169.09 },
            { o: 169.09, h: 171.17, l: 168.68, c: 170.91 },
            { o: 170.91, h: 171.22, l: 170.08, c: 170.61 },
            { o: 170.61, h: 171.39, l: 170.19, c: 170.85 },
            { o: 170.85, h: 170.95, l: 168.19, c: 168.4 },
            { o: 168.4, h: 168.58, l: 165.64, c: 165.85 },
            { o: 165.85, h: 166.01, l: 162.75, c: 162.96 },
            { o: 162.96, h: 163.02, l: 158.76, c: 158.96 },
            { o: 158.96, h: 159.12, l: 155.81, c: 155.89 },
            { o: 155.89, h: 155.96, l: 152.64, c: 152.8 },
            { o: 152.8, h: 153.45, l: 151.61, c: 153.2 },
            { o: 153.2, h: 157.33, l: 152.83, c: 157.07 },
            { o: 157.07, h: 161.23, l: 156.75, c: 160.87 },
            { o: 160.87, h: 163.15, l: 160.58, c: 163 },
            { o: 163, h: 167.42, l: 162.76, c: 167.08 },
            { o: 167.08, h: 171.22, l: 166.83, c: 171.01 }
          ],
          zones: [
            { from: 5, top: 152.3, bottom: 151.04, kind: "demand", label: "Demand" }
          ],
          reveal: 10
        }
      },
      {
        title: "Mark one supply",
        narration: "Then mark the supply above, where price turned down. That is the target and the other edge.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 162, c: 162.44 },
            { o: 162.44, h: 162.62, l: 159.09, c: 159.26 },
            { o: 159.26, h: 159.7, l: 156.54, c: 156.68 },
            { o: 156.68, h: 156.94, l: 153.78, c: 154.04 },
            { o: 154.04, h: 154.44, l: 151.81, c: 152 },
            { o: 152, h: 152.4, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.86, l: 151.21, c: 152.3 },
            { o: 152.3, h: 152.71, l: 151.37, c: 151.91 },
            { o: 151.91, h: 159.08, l: 151.85, c: 158.98 },
            { o: 158.98, h: 167.02, l: 158.83, c: 166.91 },
            { o: 166.91, h: 169.5, l: 166.68, c: 169.09 },
            { o: 169.09, h: 171.17, l: 168.68, c: 170.91 },
            { o: 170.91, h: 171.22, l: 170.08, c: 170.61 },
            { o: 170.61, h: 171.39, l: 170.19, c: 170.85 },
            { o: 170.85, h: 170.95, l: 168.19, c: 168.4 },
            { o: 168.4, h: 168.58, l: 165.64, c: 165.85 },
            { o: 165.85, h: 166.01, l: 162.75, c: 162.96 },
            { o: 162.96, h: 163.02, l: 158.76, c: 158.96 },
            { o: 158.96, h: 159.12, l: 155.81, c: 155.89 },
            { o: 155.89, h: 155.96, l: 152.64, c: 152.8 },
            { o: 152.8, h: 153.45, l: 151.61, c: 153.2 },
            { o: 153.2, h: 157.33, l: 152.83, c: 157.07 },
            { o: 157.07, h: 161.23, l: 156.75, c: 160.87 },
            { o: 160.87, h: 163.15, l: 160.58, c: 163 },
            { o: 163, h: 167.42, l: 162.76, c: 167.08 },
            { o: 167.08, h: 171.22, l: 166.83, c: 171.01 }
          ],
          zones: [
            { from: 5, top: 152.3, bottom: 151.04, kind: "demand", label: "Demand" },
            { from: 12, top: 171.39, bottom: 170.61, kind: "supply", label: "Supply" }
          ],
          reveal: 16
        }
      },
      {
        title: "First pullback entry",
        narration: "The level is fresh: price has not been back yet. There is far more than 3:1 of room. Pre-set the buy at the top line, the stop below the zone, the target at supply.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 162, c: 162.44 },
            { o: 162.44, h: 162.62, l: 159.09, c: 159.26 },
            { o: 159.26, h: 159.7, l: 156.54, c: 156.68 },
            { o: 156.68, h: 156.94, l: 153.78, c: 154.04 },
            { o: 154.04, h: 154.44, l: 151.81, c: 152 },
            { o: 152, h: 152.4, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.86, l: 151.21, c: 152.3 },
            { o: 152.3, h: 152.71, l: 151.37, c: 151.91 },
            { o: 151.91, h: 159.08, l: 151.85, c: 158.98 },
            { o: 158.98, h: 167.02, l: 158.83, c: 166.91 },
            { o: 166.91, h: 169.5, l: 166.68, c: 169.09 },
            { o: 169.09, h: 171.17, l: 168.68, c: 170.91 },
            { o: 170.91, h: 171.22, l: 170.08, c: 170.61 },
            { o: 170.61, h: 171.39, l: 170.19, c: 170.85 },
            { o: 170.85, h: 170.95, l: 168.19, c: 168.4 },
            { o: 168.4, h: 168.58, l: 165.64, c: 165.85 },
            { o: 165.85, h: 166.01, l: 162.75, c: 162.96 },
            { o: 162.96, h: 163.02, l: 158.76, c: 158.96 },
            { o: 158.96, h: 159.12, l: 155.81, c: 155.89 },
            { o: 155.89, h: 155.96, l: 152.64, c: 152.8 },
            { o: 152.8, h: 153.45, l: 151.61, c: 153.2 },
            { o: 153.2, h: 157.33, l: 152.83, c: 157.07 },
            { o: 157.07, h: 161.23, l: 156.75, c: 160.87 },
            { o: 160.87, h: 163.15, l: 160.58, c: 163 },
            { o: 163, h: 167.42, l: 162.76, c: 167.08 },
            { o: 167.08, h: 171.22, l: 166.83, c: 171.01 }
          ],
          zones: [
            { from: 5, top: 152.3, bottom: 151.04, kind: "demand", label: "Demand" },
            { from: 12, top: 171.39, bottom: 170.61, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 152.3, label: "Entry (proximal)", kind: "entry" },
            { y: 150.74, label: "Stop beyond distal", kind: "sl" },
            { y: 170.61, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 20
        }
      },
      {
        title: "Let the plan work",
        narration: "Price returns, fills the order and runs to the target. No news, no indicator, just price at a level.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 162, c: 162.44 },
            { o: 162.44, h: 162.62, l: 159.09, c: 159.26 },
            { o: 159.26, h: 159.7, l: 156.54, c: 156.68 },
            { o: 156.68, h: 156.94, l: 153.78, c: 154.04 },
            { o: 154.04, h: 154.44, l: 151.81, c: 152 },
            { o: 152, h: 152.4, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.86, l: 151.21, c: 152.3 },
            { o: 152.3, h: 152.71, l: 151.37, c: 151.91 },
            { o: 151.91, h: 159.08, l: 151.85, c: 158.98 },
            { o: 158.98, h: 167.02, l: 158.83, c: 166.91 },
            { o: 166.91, h: 169.5, l: 166.68, c: 169.09 },
            { o: 169.09, h: 171.17, l: 168.68, c: 170.91 },
            { o: 170.91, h: 171.22, l: 170.08, c: 170.61 },
            { o: 170.61, h: 171.39, l: 170.19, c: 170.85 },
            { o: 170.85, h: 170.95, l: 168.19, c: 168.4 },
            { o: 168.4, h: 168.58, l: 165.64, c: 165.85 },
            { o: 165.85, h: 166.01, l: 162.75, c: 162.96 },
            { o: 162.96, h: 163.02, l: 158.76, c: 158.96 },
            { o: 158.96, h: 159.12, l: 155.81, c: 155.89 },
            { o: 155.89, h: 155.96, l: 152.64, c: 152.8 },
            { o: 152.8, h: 153.45, l: 151.61, c: 153.2 },
            { o: 153.2, h: 157.33, l: 152.83, c: 157.07 },
            { o: 157.07, h: 161.23, l: 156.75, c: 160.87 },
            { o: 160.87, h: 163.15, l: 160.58, c: 163 },
            { o: 163, h: 167.42, l: 162.76, c: 167.08 },
            { o: 167.08, h: 171.22, l: 166.83, c: 171.01 }
          ],
          zones: [
            { from: 5, top: 152.3, bottom: 151.04, kind: "demand", label: "Demand" },
            { from: 12, top: 171.39, bottom: 170.61, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 152.3, label: "Entry (proximal)", kind: "entry" },
            { y: 150.74, label: "Stop beyond distal", kind: "sl" },
            { y: 170.61, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 20, y: 150.21, text: "First pullback" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What are Seiden's two entry types for day trading?",
        options: [
          "Market and stop",
          "First pullback and breakout",
          "Gap and news",
          "Indicator and pattern"
        ],
        answer: 1,
        explain: "Only two: breakouts and first pullbacks. Both need a fresh level and a significant profit zone."
      },
      {
        type: "tf",
        q: "You can enter whenever price looks strong, even far from any level.",
        answer: false,
        explain: "Rule one: only enter when price is at a support (demand) or resistance (supply) level."
      },
      {
        type: "mcq",
        q: "How many levels per market do you mark each day?",
        options: [
          "As many as possible",
          "One supply and one demand, on a larger intraday timeframe",
          "None, you react live",
          "Only supply"
        ],
        answer: 1,
        explain: "Mark one demand and one supply per market each day, and know where the market sits in the bigger picture."
      },
      {
        type: "spot",
        q: "Click the base that is today's supply level.",
        scene: {
          candles: [
            { o: 165, h: 165.16, l: 162, c: 162.44 },
            { o: 162.44, h: 162.62, l: 159.09, c: 159.26 },
            { o: 159.26, h: 159.7, l: 156.54, c: 156.68 },
            { o: 156.68, h: 156.94, l: 153.78, c: 154.04 },
            { o: 154.04, h: 154.44, l: 151.81, c: 152 },
            { o: 152, h: 152.4, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.86, l: 151.21, c: 152.3 },
            { o: 152.3, h: 152.71, l: 151.37, c: 151.91 },
            { o: 151.91, h: 159.08, l: 151.85, c: 158.98 },
            { o: 158.98, h: 167.02, l: 158.83, c: 166.91 },
            { o: 166.91, h: 169.5, l: 166.68, c: 169.09 },
            { o: 169.09, h: 171.17, l: 168.68, c: 170.91 },
            { o: 170.91, h: 171.22, l: 170.08, c: 170.61 },
            { o: 170.61, h: 171.39, l: 170.19, c: 170.85 },
            { o: 170.85, h: 170.95, l: 168.19, c: 168.4 },
            { o: 168.4, h: 168.58, l: 165.64, c: 165.85 },
            { o: 165.85, h: 166.01, l: 162.75, c: 162.96 },
            { o: 162.96, h: 163.02, l: 158.76, c: 158.96 },
            { o: 158.96, h: 159.12, l: 155.81, c: 155.89 },
            { o: 155.89, h: 155.96, l: 152.64, c: 152.8 },
            { o: 152.8, h: 153.45, l: 151.61, c: 153.2 },
            { o: 153.2, h: 157.33, l: 152.83, c: 157.07 },
            { o: 157.07, h: 161.23, l: 156.75, c: 160.87 },
            { o: 160.87, h: 163.15, l: 160.58, c: 163 },
            { o: 163, h: 167.42, l: 162.76, c: 167.08 },
            { o: 167.08, h: 171.22, l: 166.83, c: 171.01 }
          ],
          zones: [
            { from: 5, top: 152.3, bottom: 151.04, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 12, to: 13 },
        explain: "The small base at the top where price turned down is the supply level and the target for the buy."
      },
      {
        type: "mcq",
        q: "A sideways cluster turns into supply when...",
        options: [
          "Price declines from it",
          "It lasts a long time",
          "A moving average crosses",
          "Volume is low"
        ],
        answer: 0,
        explain: "A cluster that looks like equilibrium becomes supply once price declines from it; the decline can only mean supply exceeded demand."
      },
      {
        type: "order",
        q: "Put the day routine in order.",
        items: [
          "Mark one supply and one demand per market",
          "Check the room is at least 3:1",
          "Pre-set entry, stop and target",
          "Let price come to you"
        ],
        explain: "Plan first, then measure, then set orders, then wait. Decisions are not made in real time."
      }
    ],
    practice: [
      {
        prompt: "Price is drifting in the middle, well above demand and nowhere near supply. A friend says \"buy now, it looks strong\". Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 158, h: 158.34, l: 156.11, c: 156.39 },
            { o: 156.39, h: 156.76, l: 153.53, c: 153.68 },
            { o: 153.68, h: 153.96, l: 151.97, c: 152.4 },
            { o: 152.4, h: 152.68, l: 149.44, c: 149.8 },
            { o: 149.8, h: 150.17, l: 147.33, c: 147.63 },
            { o: 147.63, h: 147.81, l: 145.83, c: 146 },
            { o: 146, h: 146.42, l: 145.16, c: 145.59 },
            { o: 145.59, h: 147.5, l: 144.99, c: 146.89 },
            { o: 146.89, h: 147.46, l: 145.26, c: 145.88 },
            { o: 145.88, h: 146.48, l: 145.26, c: 146 },
            { o: 146, h: 147.73, l: 145.83, c: 147.58 },
            { o: 147.58, h: 148.87, l: 147.32, c: 148.58 },
            { o: 148.58, h: 150.13, l: 148.45, c: 150 },
            { o: 150, h: 150.44, l: 149.24, c: 149.72 },
            { o: 149.72, h: 150.2, l: 148.88, c: 149.31 },
            { o: 149.31, h: 149.57, l: 147.29, c: 147.5 }
          ],
          zones: [
            { from: 6, top: 146.89, bottom: 144.99, kind: "demand", label: "Demand (far below)" }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Price is in the middle, away from any level. The rules say only enter at supply or demand, so nothing. Price faded back down toward the zone."
      }
    ],
    cards: [
      { front: "Where are you allowed to enter?", back: "Only at a supply or demand level." },
      { front: "Two entry types?", back: "First pullback and breakout." },
      {
        front: "Two conditions for either entry?",
        back: "The level is fresh, and there is a significant profit zone."
      },
      { front: "Minimum room to target 1?", back: "3:1." },
      { front: "When do you set entry, stop and target?", back: "Before price arrives." },
      { front: "News, tips and lagging indicators?", back: "Ignore them; price is all we need." }
    ],
    mnemonic: "At, Fresh, Room, Preset: at a level, fresh, room to run, orders preset."
  },
  {
    mentor: "seiden",
    n: 29,
    eli5: {
      oneLiner: "All the news ends up as buy or sell orders. Just read price.",
      story: "Earnings, the Fed, tips, upgrades and indicators all go into people's heads. Each person sees the same news through their own beliefs, so everyone reacts differently. But in the end every reaction is only one thing: a buy or a sell at a price. So the price chart already holds all the news, and that is all a consistent trader needs.",
      analogy: "Like many streams flowing into one lake: you do not need to study every stream, just look at the water level of the lake."
    },
    bigIdeas: [
      "Any and all influences on price are reflected in price.",
      "A gap away from a small base is the strongest kind of departure.",
      "Wait for price to reach the level; the middle of a fall is not a level."
    ],
    steps: [
      {
        title: "Everything becomes an order",
        narration: "News, reports and opinions turn into thoughts, then into actions: buy or sell at a price. That is why the chart is enough.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.91, c: 157.23 },
            { o: 157.23, h: 157.63, l: 155.1, c: 155.41 },
            { o: 155.41, h: 155.83, l: 152.85, c: 153.06 },
            { o: 153.06, h: 153.3, l: 150.13, c: 150.55 },
            { o: 150.55, h: 150.78, l: 147.87, c: 148 },
            { o: 148, h: 148.61, l: 146.92, c: 147.4 },
            { o: 147.4, h: 148.57, l: 146.92, c: 148.04 },
            { o: 150.54, h: 154.31, l: 150.42, c: 154.12 },
            { o: 154.12, h: 157.61, l: 153.98, c: 157.54 },
            { o: 157.54, h: 160.27, l: 157.38, c: 160.02 },
            { o: 160.02, h: 161.4, l: 159.88, c: 161.19 },
            { o: 161.19, h: 163.63, l: 160.87, c: 163.26 },
            { o: 163.26, h: 165.38, l: 163.07, c: 165.1 },
            { o: 165.1, h: 167.75, l: 164.8, c: 167.5 },
            { o: 167.5, h: 169.94, l: 167.36, c: 169.54 },
            { o: 169.54, h: 169.85, l: 167.14, c: 167.59 },
            { o: 167.59, h: 167.91, l: 164.8, c: 165.04 },
            { o: 165.04, h: 165.17, l: 163.23, c: 163.57 },
            { o: 163.57, h: 163.96, l: 161.42, c: 161.54 },
            { o: 161.54, h: 161.66, l: 158.3, c: 158.45 },
            { o: 158.45, h: 158.55, l: 154.94, c: 155.02 },
            { o: 155.02, h: 155.09, l: 151.62, c: 151.68 },
            { o: 151.68, h: 151.83, l: 148.45, c: 148.54 },
            { o: 148.54, h: 149.29, l: 147.48, c: 149.04 },
            { o: 149.04, h: 151.47, l: 148.83, c: 151.11 },
            { o: 151.11, h: 153.14, l: 150.92, c: 152.88 },
            { o: 152.88, h: 154.29, l: 152.53, c: 154.07 },
            { o: 154.07, h: 156.51, l: 153.89, c: 156.38 },
            { o: 156.38, h: 158.49, l: 156.15, c: 158.04 }
          ],
          notes: [
            { x: 0, y: 161.58, text: "News -> beliefs -> orders" }
          ],
          reveal: 7
        }
      },
      {
        title: "A gap out of the base",
        narration: "After a two-candle base, price gapped up and trended higher. A gap away from a base shows buyers swamped sellers there. Box the base as demand.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.91, c: 157.23 },
            { o: 157.23, h: 157.63, l: 155.1, c: 155.41 },
            { o: 155.41, h: 155.83, l: 152.85, c: 153.06 },
            { o: 153.06, h: 153.3, l: 150.13, c: 150.55 },
            { o: 150.55, h: 150.78, l: 147.87, c: 148 },
            { o: 148, h: 148.61, l: 146.92, c: 147.4 },
            { o: 147.4, h: 148.57, l: 146.92, c: 148.04 },
            { o: 150.54, h: 154.31, l: 150.42, c: 154.12 },
            { o: 154.12, h: 157.61, l: 153.98, c: 157.54 },
            { o: 157.54, h: 160.27, l: 157.38, c: 160.02 },
            { o: 160.02, h: 161.4, l: 159.88, c: 161.19 },
            { o: 161.19, h: 163.63, l: 160.87, c: 163.26 },
            { o: 163.26, h: 165.38, l: 163.07, c: 165.1 },
            { o: 165.1, h: 167.75, l: 164.8, c: 167.5 },
            { o: 167.5, h: 169.94, l: 167.36, c: 169.54 },
            { o: 169.54, h: 169.85, l: 167.14, c: 167.59 },
            { o: 167.59, h: 167.91, l: 164.8, c: 165.04 },
            { o: 165.04, h: 165.17, l: 163.23, c: 163.57 },
            { o: 163.57, h: 163.96, l: 161.42, c: 161.54 },
            { o: 161.54, h: 161.66, l: 158.3, c: 158.45 },
            { o: 158.45, h: 158.55, l: 154.94, c: 155.02 },
            { o: 155.02, h: 155.09, l: 151.62, c: 151.68 },
            { o: 151.68, h: 151.83, l: 148.45, c: 148.54 },
            { o: 148.54, h: 149.29, l: 147.48, c: 149.04 },
            { o: 149.04, h: 151.47, l: 148.83, c: 151.11 },
            { o: 151.11, h: 153.14, l: 150.92, c: 152.88 },
            { o: 152.88, h: 154.29, l: 152.53, c: 154.07 },
            { o: 154.07, h: 156.51, l: 153.89, c: 156.38 },
            { o: 156.38, h: 158.49, l: 156.15, c: 158.04 }
          ],
          zones: [
            { from: 5, top: 148.04, bottom: 146.92, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 0, y: 161.58, text: "News -> beliefs -> orders" }
          ],
          highlight: { from: 7, to: 8, label: "gap away = strong" },
          reveal: 15
        }
      },
      {
        title: "The fall is not a buy yet",
        narration: "Price drops, maybe on scary news and rising volume. In the middle of the fall there is no level, so we do not buy early.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.91, c: 157.23 },
            { o: 157.23, h: 157.63, l: 155.1, c: 155.41 },
            { o: 155.41, h: 155.83, l: 152.85, c: 153.06 },
            { o: 153.06, h: 153.3, l: 150.13, c: 150.55 },
            { o: 150.55, h: 150.78, l: 147.87, c: 148 },
            { o: 148, h: 148.61, l: 146.92, c: 147.4 },
            { o: 147.4, h: 148.57, l: 146.92, c: 148.04 },
            { o: 150.54, h: 154.31, l: 150.42, c: 154.12 },
            { o: 154.12, h: 157.61, l: 153.98, c: 157.54 },
            { o: 157.54, h: 160.27, l: 157.38, c: 160.02 },
            { o: 160.02, h: 161.4, l: 159.88, c: 161.19 },
            { o: 161.19, h: 163.63, l: 160.87, c: 163.26 },
            { o: 163.26, h: 165.38, l: 163.07, c: 165.1 },
            { o: 165.1, h: 167.75, l: 164.8, c: 167.5 },
            { o: 167.5, h: 169.94, l: 167.36, c: 169.54 },
            { o: 169.54, h: 169.85, l: 167.14, c: 167.59 },
            { o: 167.59, h: 167.91, l: 164.8, c: 165.04 },
            { o: 165.04, h: 165.17, l: 163.23, c: 163.57 },
            { o: 163.57, h: 163.96, l: 161.42, c: 161.54 },
            { o: 161.54, h: 161.66, l: 158.3, c: 158.45 },
            { o: 158.45, h: 158.55, l: 154.94, c: 155.02 },
            { o: 155.02, h: 155.09, l: 151.62, c: 151.68 },
            { o: 151.68, h: 151.83, l: 148.45, c: 148.54 },
            { o: 148.54, h: 149.29, l: 147.48, c: 149.04 },
            { o: 149.04, h: 151.47, l: 148.83, c: 151.11 },
            { o: 151.11, h: 153.14, l: 150.92, c: 152.88 },
            { o: 152.88, h: 154.29, l: 152.53, c: 154.07 },
            { o: 154.07, h: 156.51, l: 153.89, c: 156.38 },
            { o: 156.38, h: 158.49, l: 156.15, c: 158.04 }
          ],
          zones: [
            { from: 5, top: 148.04, bottom: 146.92, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 0, y: 161.58, text: "News -> beliefs -> orders" }
          ],
          highlight: { from: 15, to: 18, label: "middle: no level" },
          reveal: 23
        }
      },
      {
        title: "Buy at the lines",
        narration: "Only when price reaches the demand lines do we buy, with the stop below the zone. Price turns up from the level.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.91, c: 157.23 },
            { o: 157.23, h: 157.63, l: 155.1, c: 155.41 },
            { o: 155.41, h: 155.83, l: 152.85, c: 153.06 },
            { o: 153.06, h: 153.3, l: 150.13, c: 150.55 },
            { o: 150.55, h: 150.78, l: 147.87, c: 148 },
            { o: 148, h: 148.61, l: 146.92, c: 147.4 },
            { o: 147.4, h: 148.57, l: 146.92, c: 148.04 },
            { o: 150.54, h: 154.31, l: 150.42, c: 154.12 },
            { o: 154.12, h: 157.61, l: 153.98, c: 157.54 },
            { o: 157.54, h: 160.27, l: 157.38, c: 160.02 },
            { o: 160.02, h: 161.4, l: 159.88, c: 161.19 },
            { o: 161.19, h: 163.63, l: 160.87, c: 163.26 },
            { o: 163.26, h: 165.38, l: 163.07, c: 165.1 },
            { o: 165.1, h: 167.75, l: 164.8, c: 167.5 },
            { o: 167.5, h: 169.94, l: 167.36, c: 169.54 },
            { o: 169.54, h: 169.85, l: 167.14, c: 167.59 },
            { o: 167.59, h: 167.91, l: 164.8, c: 165.04 },
            { o: 165.04, h: 165.17, l: 163.23, c: 163.57 },
            { o: 163.57, h: 163.96, l: 161.42, c: 161.54 },
            { o: 161.54, h: 161.66, l: 158.3, c: 158.45 },
            { o: 158.45, h: 158.55, l: 154.94, c: 155.02 },
            { o: 155.02, h: 155.09, l: 151.62, c: 151.68 },
            { o: 151.68, h: 151.83, l: 148.45, c: 148.54 },
            { o: 148.54, h: 149.29, l: 147.48, c: 149.04 },
            { o: 149.04, h: 151.47, l: 148.83, c: 151.11 },
            { o: 151.11, h: 153.14, l: 150.92, c: 152.88 },
            { o: 152.88, h: 154.29, l: 152.53, c: 154.07 },
            { o: 154.07, h: 156.51, l: 153.89, c: 156.38 },
            { o: 156.38, h: 158.49, l: 156.15, c: 158.04 }
          ],
          zones: [
            { from: 5, top: 148.04, bottom: 146.92, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 148.04, label: "Entry (proximal)", kind: "entry" },
            { y: 146.62, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 0, y: 161.58, text: "News -> beliefs -> orders" },
            { x: 23, y: 146.08, text: "Buy at demand" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Everyone reads the same news the same way.",
        answer: false,
        explain: "Each person filters information through their own belief system, so perceptions differ. Only the resulting orders matter."
      },
      {
        type: "order",
        q: "Put the chain in order.",
        items: ["News and information", "Thoughts and perceptions", "Action: buy or sell at a price"],
        explain: "Every influence passes through beliefs and ends as an order at a price, which is why price contains it all."
      },
      {
        type: "mcq",
        q: "Which departure is the strongest sign of demand?",
        options: ["A slow drift up", "A gap up away from a small base", "A long sideways range", "A doji"],
        answer: 1,
        explain: "A gap out of a small base shows the biggest imbalance."
      },
      {
        type: "spot",
        q: "Click the candles where buying is NOT allowed yet (middle of the fall).",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.91, c: 157.23 },
            { o: 157.23, h: 157.63, l: 155.1, c: 155.41 },
            { o: 155.41, h: 155.83, l: 152.85, c: 153.06 },
            { o: 153.06, h: 153.3, l: 150.13, c: 150.55 },
            { o: 150.55, h: 150.78, l: 147.87, c: 148 },
            { o: 148, h: 148.61, l: 146.92, c: 147.4 },
            { o: 147.4, h: 148.57, l: 146.92, c: 148.04 },
            { o: 150.54, h: 154.31, l: 150.42, c: 154.12 },
            { o: 154.12, h: 157.61, l: 153.98, c: 157.54 },
            { o: 157.54, h: 160.27, l: 157.38, c: 160.02 },
            { o: 160.02, h: 161.4, l: 159.88, c: 161.19 },
            { o: 161.19, h: 163.63, l: 160.87, c: 163.26 },
            { o: 163.26, h: 165.38, l: 163.07, c: 165.1 },
            { o: 165.1, h: 167.75, l: 164.8, c: 167.5 },
            { o: 167.5, h: 169.94, l: 167.36, c: 169.54 },
            { o: 169.54, h: 169.85, l: 167.14, c: 167.59 },
            { o: 167.59, h: 167.91, l: 164.8, c: 165.04 },
            { o: 165.04, h: 165.17, l: 163.23, c: 163.57 },
            { o: 163.57, h: 163.96, l: 161.42, c: 161.54 },
            { o: 161.54, h: 161.66, l: 158.3, c: 158.45 },
            { o: 158.45, h: 158.55, l: 154.94, c: 155.02 },
            { o: 155.02, h: 155.09, l: 151.62, c: 151.68 },
            { o: 151.68, h: 151.83, l: 148.45, c: 148.54 },
            { o: 148.54, h: 149.29, l: 147.48, c: 149.04 },
            { o: 149.04, h: 151.47, l: 148.83, c: 151.11 },
            { o: 151.11, h: 153.14, l: 150.92, c: 152.88 },
            { o: 152.88, h: 154.29, l: 152.53, c: 154.07 },
            { o: 154.07, h: 156.51, l: 153.89, c: 156.38 },
            { o: 156.38, h: 158.49, l: 156.15, c: 158.04 }
          ],
          zones: [
            { from: 5, top: 148.04, bottom: 146.92, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 15, to: 18 },
        explain: "Price is falling but has not reached the demand lines. The middle of a move is not a level."
      },
      {
        type: "mcq",
        q: "Volatility is high and a supply level looks far away. What should you remember?",
        options: [
          "It can never be reached",
          "In high volatility far levels can be reached quickly",
          "Move it closer",
          "Ignore it"
        ],
        answer: 1,
        explain: "High volatility can bring a distant level into play fast; size every position to your fixed risk."
      }
    ],
    practice: [
      {
        prompt: "Demand formed when price gapped up from a two-candle base. After a big rally, price is now dropping fast toward the demand lines. Buy, sell or nothing at the lines?",
        scene: {
          candles: [
            { o: 162, h: 162.16, l: 159.03, c: 159.4 },
            { o: 159.4, h: 159.58, l: 156.49, c: 156.93 },
            { o: 156.93, h: 157.14, l: 154.83, c: 155.02 },
            { o: 155.02, h: 155.43, l: 151.6, c: 151.82 },
            { o: 151.82, h: 152.17, l: 149.66, c: 150 },
            { o: 150, h: 150.52, l: 149.4, c: 149.78 },
            { o: 149.78, h: 150.42, l: 149.19, c: 149.94 },
            { o: 152.44, h: 156.49, l: 152.32, c: 156.31 },
            { o: 156.31, h: 159.55, l: 156.25, c: 159.44 },
            { o: 159.44, h: 161.97, l: 159.22, c: 161.67 },
            { o: 161.67, h: 164.08, l: 161.32, c: 163.87 },
            { o: 163.87, h: 166.01, l: 163.55, c: 165.63 },
            { o: 165.63, h: 167.28, l: 165.41, c: 166.96 },
            { o: 166.96, h: 169.78, l: 166.69, c: 169.44 },
            { o: 169.44, h: 169.56, l: 167.7, c: 167.93 },
            { o: 167.93, h: 168.31, l: 165.44, c: 165.6 },
            { o: 165.6, h: 165.87, l: 163.97, c: 164.33 },
            { o: 164.33, h: 164.53, l: 162.25, c: 162.44 },
            { o: 162.44, h: 162.52, l: 159.05, c: 159.17 },
            { o: 159.17, h: 159.24, l: 156.27, c: 156.36 },
            { o: 156.36, h: 156.44, l: 153.16, c: 153.35 },
            { o: 153.35, h: 153.45, l: 150.31, c: 150.5 },
            { o: 150.5, h: 151.25, l: 149.6, c: 151 },
            { o: 151, h: 153.41, l: 150.59, c: 153.28 },
            { o: 153.28, h: 155.13, l: 152.88, c: 154.85 },
            { o: 154.85, h: 157.6, l: 154.47, c: 157.3 },
            { o: 157.3, h: 159.38, l: 157.13, c: 159 }
          ],
          zones: [
            { from: 5, top: 150, bottom: 149.19, kind: "demand", label: "Demand (gap origin)" }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "The sellers are selling after a decline and into demand. Buy at the top line, stop below the zone. Price turned up."
      }
    ],
    cards: [
      { front: "Where do all influences on price end up?", back: "In price, as buy or sell orders." },
      {
        front: "Why ignore news and tips?",
        back: "They distort what supply and demand show; price already has them."
      },
      { front: "Strongest departure from a base?", back: "A gap away from it." },
      { front: "Price is falling toward demand. When do you buy?", back: "Only when it reaches the demand lines." },
      { front: "Position size rule?", back: "Risk only the fixed percent of capital you are comfortable with." }
    ],
    mnemonic: "Many streams, one lake: read the lake (price), not the streams (news)."
  },
  {
    mentor: "seiden",
    n: 33,
    eli5: {
      oneLiner: "A is the pause, B the escape, C the first return to buy.",
      story: "At A price rests quietly, like a car at a red light. At B it races away, which proves the light was hiding a lot of power. At C price comes back to A for the first time, and that is where we act. A big, dramatic B usually means a strong reaction at C.",
      analogy: "Like a spring: A is the spring pressed down, B is it shooting up, and C is when you press it back to the same spot and it shoots up again."
    },
    bigIdeas: [
      "A = a pause that looks like balance. B = the strong move away that proves it was not.",
      "C = the first return to A: the low-risk, high-reward entry.",
      "A tight entry-to-stop distance lets you size up while risking little."
    ],
    steps: [
      {
        title: "A: the pause",
        narration: "Price pauses with small candles. It looks like supply and demand are in balance. We cannot tell yet.",
        scene: {
          candles: [
            { o: 164, h: 164.23, l: 160.8, c: 161.09 },
            { o: 161.09, h: 161.41, l: 158.82, c: 159.22 },
            { o: 159.22, h: 159.61, l: 156.7, c: 156.83 },
            { o: 156.83, h: 157.08, l: 153.86, c: 154.14 },
            { o: 154.14, h: 154.4, l: 151.57, c: 152 },
            { o: 152, h: 152.59, l: 150.81, c: 151.18 },
            { o: 151.18, h: 153.54, l: 150.53, c: 153.05 },
            { o: 153.05, h: 153.46, l: 151.47, c: 151.96 },
            { o: 151.96, h: 156.28, l: 151.79, c: 156.1 },
            { o: 156.1, h: 160.36, l: 155.97, c: 160.14 },
            { o: 160.14, h: 165.13, l: 159.98, c: 164.96 },
            { o: 164.96, h: 165.53, l: 164.6, c: 164.87 },
            { o: 164.87, h: 165.58, l: 164.37, c: 165.13 },
            { o: 165.13, h: 168.15, l: 164.73, c: 167.72 },
            { o: 167.72, h: 168.12, l: 166.29, c: 166.96 },
            { o: 166.96, h: 167.11, l: 162.24, c: 162.3 },
            { o: 162.3, h: 162.41, l: 158.22, c: 158.38 },
            { o: 158.38, h: 158.59, l: 153.36, c: 153.55 },
            { o: 153.55, h: 154.2, l: 151.66, c: 153.95 },
            { o: 153.95, h: 156.17, l: 153.51, c: 155.79 },
            { o: 155.79, h: 158.96, l: 155.49, c: 158.76 },
            { o: 158.76, h: 161.32, l: 158.46, c: 161.15 },
            { o: 161.15, h: 163.55, l: 160.93, c: 163.13 },
            { o: 163.13, h: 166.22, l: 162.69, c: 165.95 }
          ],
          highlight: { from: 5, to: 7, label: "A" },
          reveal: 8
        }
      },
      {
        title: "B: the move away",
        narration: "Price rallies hard away from A. That proves demand greatly exceeded supply at A. Any news that came with it adds nothing price is not already telling us.",
        scene: {
          candles: [
            { o: 164, h: 164.23, l: 160.8, c: 161.09 },
            { o: 161.09, h: 161.41, l: 158.82, c: 159.22 },
            { o: 159.22, h: 159.61, l: 156.7, c: 156.83 },
            { o: 156.83, h: 157.08, l: 153.86, c: 154.14 },
            { o: 154.14, h: 154.4, l: 151.57, c: 152 },
            { o: 152, h: 152.59, l: 150.81, c: 151.18 },
            { o: 151.18, h: 153.54, l: 150.53, c: 153.05 },
            { o: 153.05, h: 153.46, l: 151.47, c: 151.96 },
            { o: 151.96, h: 156.28, l: 151.79, c: 156.1 },
            { o: 156.1, h: 160.36, l: 155.97, c: 160.14 },
            { o: 160.14, h: 165.13, l: 159.98, c: 164.96 },
            { o: 164.96, h: 165.53, l: 164.6, c: 164.87 },
            { o: 164.87, h: 165.58, l: 164.37, c: 165.13 },
            { o: 165.13, h: 168.15, l: 164.73, c: 167.72 },
            { o: 167.72, h: 168.12, l: 166.29, c: 166.96 },
            { o: 166.96, h: 167.11, l: 162.24, c: 162.3 },
            { o: 162.3, h: 162.41, l: 158.22, c: 158.38 },
            { o: 158.38, h: 158.59, l: 153.36, c: 153.55 },
            { o: 153.55, h: 154.2, l: 151.66, c: 153.95 },
            { o: 153.95, h: 156.17, l: 153.51, c: 155.79 },
            { o: 155.79, h: 158.96, l: 155.49, c: 158.76 },
            { o: 158.76, h: 161.32, l: 158.46, c: 161.15 },
            { o: 161.15, h: 163.55, l: 160.93, c: 163.13 },
            { o: 163.13, h: 166.22, l: 162.69, c: 165.95 }
          ],
          zones: [
            { from: 5, top: 153.05, bottom: 150.53, kind: "demand", label: "A = demand" }
          ],
          highlight: { from: 8, to: 10, label: "B" },
          reveal: 15
        }
      },
      {
        title: "C: the first return",
        narration: "Price drops straight back into A for the first time. The sellers here are selling into a level of large imbalance.",
        scene: {
          candles: [
            { o: 164, h: 164.23, l: 160.8, c: 161.09 },
            { o: 161.09, h: 161.41, l: 158.82, c: 159.22 },
            { o: 159.22, h: 159.61, l: 156.7, c: 156.83 },
            { o: 156.83, h: 157.08, l: 153.86, c: 154.14 },
            { o: 154.14, h: 154.4, l: 151.57, c: 152 },
            { o: 152, h: 152.59, l: 150.81, c: 151.18 },
            { o: 151.18, h: 153.54, l: 150.53, c: 153.05 },
            { o: 153.05, h: 153.46, l: 151.47, c: 151.96 },
            { o: 151.96, h: 156.28, l: 151.79, c: 156.1 },
            { o: 156.1, h: 160.36, l: 155.97, c: 160.14 },
            { o: 160.14, h: 165.13, l: 159.98, c: 164.96 },
            { o: 164.96, h: 165.53, l: 164.6, c: 164.87 },
            { o: 164.87, h: 165.58, l: 164.37, c: 165.13 },
            { o: 165.13, h: 168.15, l: 164.73, c: 167.72 },
            { o: 167.72, h: 168.12, l: 166.29, c: 166.96 },
            { o: 166.96, h: 167.11, l: 162.24, c: 162.3 },
            { o: 162.3, h: 162.41, l: 158.22, c: 158.38 },
            { o: 158.38, h: 158.59, l: 153.36, c: 153.55 },
            { o: 153.55, h: 154.2, l: 151.66, c: 153.95 },
            { o: 153.95, h: 156.17, l: 153.51, c: 155.79 },
            { o: 155.79, h: 158.96, l: 155.49, c: 158.76 },
            { o: 158.76, h: 161.32, l: 158.46, c: 161.15 },
            { o: 161.15, h: 163.55, l: 160.93, c: 163.13 },
            { o: 163.13, h: 166.22, l: 162.69, c: 165.95 }
          ],
          zones: [
            { from: 5, top: 153.05, bottom: 150.53, kind: "demand", label: "A = demand" }
          ],
          highlight: { from: 15, to: 17, label: "into C" },
          reveal: 18
        }
      },
      {
        title: "Enter at C, stop beyond A",
        narration: "Buy at the top line of A, stop just under the bottom line. A dramatic B suggests a similar reaction at C, and price rallies.",
        scene: {
          candles: [
            { o: 164, h: 164.23, l: 160.8, c: 161.09 },
            { o: 161.09, h: 161.41, l: 158.82, c: 159.22 },
            { o: 159.22, h: 159.61, l: 156.7, c: 156.83 },
            { o: 156.83, h: 157.08, l: 153.86, c: 154.14 },
            { o: 154.14, h: 154.4, l: 151.57, c: 152 },
            { o: 152, h: 152.59, l: 150.81, c: 151.18 },
            { o: 151.18, h: 153.54, l: 150.53, c: 153.05 },
            { o: 153.05, h: 153.46, l: 151.47, c: 151.96 },
            { o: 151.96, h: 156.28, l: 151.79, c: 156.1 },
            { o: 156.1, h: 160.36, l: 155.97, c: 160.14 },
            { o: 160.14, h: 165.13, l: 159.98, c: 164.96 },
            { o: 164.96, h: 165.53, l: 164.6, c: 164.87 },
            { o: 164.87, h: 165.58, l: 164.37, c: 165.13 },
            { o: 165.13, h: 168.15, l: 164.73, c: 167.72 },
            { o: 167.72, h: 168.12, l: 166.29, c: 166.96 },
            { o: 166.96, h: 167.11, l: 162.24, c: 162.3 },
            { o: 162.3, h: 162.41, l: 158.22, c: 158.38 },
            { o: 158.38, h: 158.59, l: 153.36, c: 153.55 },
            { o: 153.55, h: 154.2, l: 151.66, c: 153.95 },
            { o: 153.95, h: 156.17, l: 153.51, c: 155.79 },
            { o: 155.79, h: 158.96, l: 155.49, c: 158.76 },
            { o: 158.76, h: 161.32, l: 158.46, c: 161.15 },
            { o: 161.15, h: 163.55, l: 160.93, c: 163.13 },
            { o: 163.13, h: 166.22, l: 162.69, c: 165.95 }
          ],
          zones: [
            { from: 5, top: 153.05, bottom: 150.53, kind: "demand", label: "A = demand" }
          ],
          lines: [
            { y: 153.05, label: "Entry (proximal)", kind: "entry" },
            { y: 150.23, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 18, y: 150.26, text: "C" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In A-B-C, what does B prove?",
        options: [
          "That A was balanced",
          "That A was a level of large imbalance",
          "That news caused the move",
          "Nothing"
        ],
        answer: 1,
        explain: "B, the strong move away, proves A really had far more demand (or supply) than the other side."
      },
      {
        type: "spot",
        q: "Click C, the first return to the level.",
        scene: {
          candles: [
            { o: 164, h: 164.23, l: 160.8, c: 161.09 },
            { o: 161.09, h: 161.41, l: 158.82, c: 159.22 },
            { o: 159.22, h: 159.61, l: 156.7, c: 156.83 },
            { o: 156.83, h: 157.08, l: 153.86, c: 154.14 },
            { o: 154.14, h: 154.4, l: 151.57, c: 152 },
            { o: 152, h: 152.59, l: 150.81, c: 151.18 },
            { o: 151.18, h: 153.54, l: 150.53, c: 153.05 },
            { o: 153.05, h: 153.46, l: 151.47, c: 151.96 },
            { o: 151.96, h: 156.28, l: 151.79, c: 156.1 },
            { o: 156.1, h: 160.36, l: 155.97, c: 160.14 },
            { o: 160.14, h: 165.13, l: 159.98, c: 164.96 },
            { o: 164.96, h: 165.53, l: 164.6, c: 164.87 },
            { o: 164.87, h: 165.58, l: 164.37, c: 165.13 },
            { o: 165.13, h: 168.15, l: 164.73, c: 167.72 },
            { o: 167.72, h: 168.12, l: 166.29, c: 166.96 },
            { o: 166.96, h: 167.11, l: 162.24, c: 162.3 },
            { o: 162.3, h: 162.41, l: 158.22, c: 158.38 },
            { o: 158.38, h: 158.59, l: 153.36, c: 153.55 },
            { o: 153.55, h: 154.2, l: 151.66, c: 153.95 },
            { o: 153.95, h: 156.17, l: 153.51, c: 155.79 },
            { o: 155.79, h: 158.96, l: 155.49, c: 158.76 },
            { o: 158.76, h: 161.32, l: 158.46, c: 161.15 },
            { o: 161.15, h: 163.55, l: 160.93, c: 163.13 },
            { o: 163.13, h: 166.22, l: 162.69, c: 165.95 }
          ],
          zones: [
            { from: 5, top: 153.05, bottom: 150.53, kind: "demand", label: "A" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "C is the first time price comes back into A. That is the low-risk, high-reward entry."
      },
      {
        type: "tf",
        q: "A dramatic B suggests a similar reaction at C.",
        answer: true,
        explain: "The bigger the escape from A, the bigger the imbalance likely still waiting at C."
      },
      {
        type: "order",
        q: "Put the A-B-C logic in order.",
        items: [
          "A: price pauses, looks balanced",
          "B: price moves strongly away",
          "C: price returns to A for the first time",
          "Enter at C with the stop beyond A"
        ],
        explain: "Pause, proof, return, entry."
      },
      {
        type: "mcq",
        q: "Why can a tight stop help you?",
        options: [
          "It guarantees a win",
          "The closer the entry to the stop, the bigger the position for the same small risk",
          "Brokers like it",
          "It removes the need for a target"
        ],
        answer: 1,
        explain: "Risk per share is small, so you can hold more size while risking very little capital."
      },
      {
        type: "mcq",
        q: "A level sits high on the big-picture curve with a huge profit margin. How do you manage it?",
        options: ["As a quick scalp", "As a swing trade", "Skip it", "Add to it on the way up"],
        answer: 1,
        explain: "Levels high (or low) on the big-picture curve have huge margins, so Seiden treats them as swing trades."
      }
    ],
    practice: [
      {
        prompt: "Futures short at supply: let price trade into the zone, then sell as it declines a few ticks under the bottom line (like 1464 under a 1465-1471.50 zone). Pick entry, stop and target.",
        scene: {
          candles: [
            { o: 135, h: 137.61, l: 134.63, c: 137.43 },
            { o: 137.43, h: 139.79, l: 137.3, c: 139.53 },
            { o: 139.53, h: 142.89, l: 139.3, c: 142.51 },
            { o: 142.51, h: 144.82, l: 142.08, c: 144.41 },
            { o: 144.41, h: 147.16, l: 144.06, c: 147 },
            { o: 147, h: 147.73, l: 146.43, c: 147.35 },
            { o: 147.35, h: 147.65, l: 145.89, c: 146.35 },
            { o: 146.35, h: 147.59, l: 145.76, c: 147.04 },
            { o: 147.04, h: 147.12, l: 139.81, c: 139.94 },
            { o: 139.94, h: 139.99, l: 132.86, c: 133.04 },
            { o: 133.04, h: 133.21, l: 131.77, c: 131.99 },
            { o: 131.99, h: 132.39, l: 130.82, c: 131.04 },
            { o: 131.04, h: 131.99, l: 130.43, c: 131.31 },
            { o: 131.31, h: 131.78, l: 130.55, c: 131.08 },
            { o: 131.08, h: 133.35, l: 130.91, c: 133.15 },
            { o: 133.15, h: 135.19, l: 133.01, c: 135.08 },
            { o: 135.08, h: 137.81, l: 134.91, c: 137.55 },
            { o: 137.55, h: 140.03, l: 137.16, c: 139.79 },
            { o: 139.79, h: 142.13, l: 139.5, c: 141.97 },
            { o: 141.97, h: 144.57, l: 141.66, c: 144.2 },
            { o: 144.2, h: 146.21, l: 144.08, c: 145.85 },
            { o: 145.85, h: 147.45, l: 144.9, c: 145.15 },
            { o: 145.15, h: 145.39, l: 141.46, c: 141.8 },
            { o: 141.8, h: 142.1, l: 139.73, c: 140.13 },
            { o: 140.13, h: 140.49, l: 136.34, c: 136.46 },
            { o: 136.46, h: 136.89, l: 133.69, c: 133.87 },
            { o: 133.87, h: 134.21, l: 130.51, c: 130.91 }
          ],
          zones: [
            { from: 5, top: 147.73, bottom: 146.35, kind: "supply", label: "Supply" },
            { from: 12, top: 131.31, bottom: 130.43, kind: "demand", label: "Demand" }
          ],
          reveal: 21
        },
        task: "pick-entry",
        answer: { entry: 146.15, sl: 148.03, tp: 131.31 },
        explain: "Sell a little under the zone (146.15) once price has traded in, stop just above the top line (148.03), target the demand below. It is a hybrid between a limit and a confirmation entry."
      }
    ],
    cards: [
      { front: "A in A-B-C?", back: "A pause that looks like balance." },
      { front: "B in A-B-C?", back: "The strong move away that proves A was out of balance." },
      { front: "C in A-B-C?", back: "The first return to A: the entry." },
      {
        front: "Where is the futures short entry?",
        back: "A few ticks under the supply zone after price trades into it."
      },
      { front: "Stop on a supply short?", back: "Just above the zone (e.g. zone to 1471.50, stop 1472)." },
      { front: "Level high on the curve?", back: "Manage it as a swing trade." }
    ],
    mnemonic: "Pause, Proof, Pounce: A pauses, B proves, C is where you pounce."
  },
  {
    mentor: "seiden",
    n: 39,
    eli5: {
      oneLiner: "Base, steep drop, first return: sell there. Moving-average crosses can point to it.",
      story: "Disney's price sat still for a while at A, then fell steeply at B. That told Seiden sellers had swamped buyers at A. He waited weeks for the first return to A and sold to the buyers who bought after the rally. The two moving averages had crossed right at that spot, which happens at the origin of many moves.",
      analogy: "Like a crossroads where two roads meet: the place they crossed is a good spot to wait for traffic to come back."
    },
    bigIdeas: [
      "Short the first revisit of a base that was followed by a steep decline.",
      "Where moving averages cross, extend a line right and wait for price to return.",
      "Odds are highest when the stock and its sector ETF reach supply together."
    ],
    steps: [
      {
        title: "A: a stable area",
        narration: "Price was stable at A. It looked like nothing was happening.",
        scene: {
          candles: [
            { o: 134, h: 137.05, l: 133.72, c: 136.78 },
            { o: 136.78, h: 138.81, l: 136.38, c: 138.66 },
            { o: 138.66, h: 141.14, l: 138.52, c: 140.96 },
            { o: 140.96, h: 143.77, l: 140.74, c: 143.44 },
            { o: 143.44, h: 146.31, l: 143.3, c: 146 },
            { o: 146, h: 146.84, l: 145.33, c: 146.31 },
            { o: 146.31, h: 146.72, l: 145.05, c: 145.66 },
            { o: 145.66, h: 146.59, l: 145.33, c: 146.02 },
            { o: 146.02, h: 146.25, l: 141.15, c: 141.59 },
            { o: 141.59, h: 142.01, l: 136.99, c: 137.39 },
            { o: 137.39, h: 137.61, l: 132.78, c: 133.02 },
            { o: 133.02, h: 133.69, l: 131.29, c: 131.89 },
            { o: 131.89, h: 132.86, l: 131.65, c: 132.46 },
            { o: 132.46, h: 132.92, l: 131.59, c: 131.94 },
            { o: 131.94, h: 132.7, l: 131.45, c: 132.13 },
            { o: 132.13, h: 132.54, l: 131.03, c: 131.52 },
            { o: 131.52, h: 134.4, l: 131.17, c: 134.02 },
            { o: 134.02, h: 136.6, l: 133.7, c: 136.46 },
            { o: 136.46, h: 139.33, l: 136.11, c: 139.08 },
            { o: 139.08, h: 143.07, l: 138.9, c: 142.79 },
            { o: 142.79, h: 145.48, l: 142.43, c: 145.16 },
            { o: 145.16, h: 146.31, l: 144.51, c: 144.76 },
            { o: 144.76, h: 144.89, l: 143.02, c: 143.37 },
            { o: 143.37, h: 143.68, l: 141.08, c: 141.43 },
            { o: 141.43, h: 141.81, l: 139.13, c: 139.3 },
            { o: 139.3, h: 139.72, l: 137.28, c: 137.59 },
            { o: 137.59, h: 137.98, l: 135.41, c: 135.76 }
          ],
          highlight: { from: 5, to: 7, label: "A" },
          reveal: 8
        }
      },
      {
        title: "B: the steep decline",
        narration: "A steep drop followed, so A had more supply than demand. The moving averages crossed right at this origin. Mark the zone and extend it to the right.",
        scene: {
          candles: [
            { o: 134, h: 137.05, l: 133.72, c: 136.78 },
            { o: 136.78, h: 138.81, l: 136.38, c: 138.66 },
            { o: 138.66, h: 141.14, l: 138.52, c: 140.96 },
            { o: 140.96, h: 143.77, l: 140.74, c: 143.44 },
            { o: 143.44, h: 146.31, l: 143.3, c: 146 },
            { o: 146, h: 146.84, l: 145.33, c: 146.31 },
            { o: 146.31, h: 146.72, l: 145.05, c: 145.66 },
            { o: 145.66, h: 146.59, l: 145.33, c: 146.02 },
            { o: 146.02, h: 146.25, l: 141.15, c: 141.59 },
            { o: 141.59, h: 142.01, l: 136.99, c: 137.39 },
            { o: 137.39, h: 137.61, l: 132.78, c: 133.02 },
            { o: 133.02, h: 133.69, l: 131.29, c: 131.89 },
            { o: 131.89, h: 132.86, l: 131.65, c: 132.46 },
            { o: 132.46, h: 132.92, l: 131.59, c: 131.94 },
            { o: 131.94, h: 132.7, l: 131.45, c: 132.13 },
            { o: 132.13, h: 132.54, l: 131.03, c: 131.52 },
            { o: 131.52, h: 134.4, l: 131.17, c: 134.02 },
            { o: 134.02, h: 136.6, l: 133.7, c: 136.46 },
            { o: 136.46, h: 139.33, l: 136.11, c: 139.08 },
            { o: 139.08, h: 143.07, l: 138.9, c: 142.79 },
            { o: 142.79, h: 145.48, l: 142.43, c: 145.16 },
            { o: 145.16, h: 146.31, l: 144.51, c: 144.76 },
            { o: 144.76, h: 144.89, l: 143.02, c: 143.37 },
            { o: 143.37, h: 143.68, l: 141.08, c: 141.43 },
            { o: 141.43, h: 141.81, l: 139.13, c: 139.3 },
            { o: 139.3, h: 139.72, l: 137.28, c: 137.59 },
            { o: 137.59, h: 137.98, l: 135.41, c: 135.76 }
          ],
          zones: [
            { from: 5, top: 146.84, bottom: 145.66, kind: "supply", label: "A = supply" }
          ],
          notes: [
            { x: 5, y: 148.24, text: "MAs cross here" }
          ],
          highlight: { from: 8, to: 10, label: "B" },
          reveal: 11
        }
      },
      {
        title: "C: wait for the first revisit",
        narration: "Price rallies back. Buyers here buy after an advance and into supply. Plan the short: entry at the bottom line, stop just above, first target the prior low.",
        scene: {
          candles: [
            { o: 134, h: 137.05, l: 133.72, c: 136.78 },
            { o: 136.78, h: 138.81, l: 136.38, c: 138.66 },
            { o: 138.66, h: 141.14, l: 138.52, c: 140.96 },
            { o: 140.96, h: 143.77, l: 140.74, c: 143.44 },
            { o: 143.44, h: 146.31, l: 143.3, c: 146 },
            { o: 146, h: 146.84, l: 145.33, c: 146.31 },
            { o: 146.31, h: 146.72, l: 145.05, c: 145.66 },
            { o: 145.66, h: 146.59, l: 145.33, c: 146.02 },
            { o: 146.02, h: 146.25, l: 141.15, c: 141.59 },
            { o: 141.59, h: 142.01, l: 136.99, c: 137.39 },
            { o: 137.39, h: 137.61, l: 132.78, c: 133.02 },
            { o: 133.02, h: 133.69, l: 131.29, c: 131.89 },
            { o: 131.89, h: 132.86, l: 131.65, c: 132.46 },
            { o: 132.46, h: 132.92, l: 131.59, c: 131.94 },
            { o: 131.94, h: 132.7, l: 131.45, c: 132.13 },
            { o: 132.13, h: 132.54, l: 131.03, c: 131.52 },
            { o: 131.52, h: 134.4, l: 131.17, c: 134.02 },
            { o: 134.02, h: 136.6, l: 133.7, c: 136.46 },
            { o: 136.46, h: 139.33, l: 136.11, c: 139.08 },
            { o: 139.08, h: 143.07, l: 138.9, c: 142.79 },
            { o: 142.79, h: 145.48, l: 142.43, c: 145.16 },
            { o: 145.16, h: 146.31, l: 144.51, c: 144.76 },
            { o: 144.76, h: 144.89, l: 143.02, c: 143.37 },
            { o: 143.37, h: 143.68, l: 141.08, c: 141.43 },
            { o: 141.43, h: 141.81, l: 139.13, c: 139.3 },
            { o: 139.3, h: 139.72, l: 137.28, c: 137.59 },
            { o: 137.59, h: 137.98, l: 135.41, c: 135.76 }
          ],
          zones: [
            { from: 5, top: 146.84, bottom: 145.66, kind: "supply", label: "A = supply" }
          ],
          lines: [
            { y: 145.66, label: "Entry (proximal)", kind: "entry" },
            { y: 147.14, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 5, y: 148.24, text: "MAs cross here" }
          ],
          reveal: 21
        }
      },
      {
        title: "The plan works",
        narration: "Price stalls at the zone and drops toward the first target. The trade only existed because the level was marked weeks earlier.",
        scene: {
          candles: [
            { o: 134, h: 137.05, l: 133.72, c: 136.78 },
            { o: 136.78, h: 138.81, l: 136.38, c: 138.66 },
            { o: 138.66, h: 141.14, l: 138.52, c: 140.96 },
            { o: 140.96, h: 143.77, l: 140.74, c: 143.44 },
            { o: 143.44, h: 146.31, l: 143.3, c: 146 },
            { o: 146, h: 146.84, l: 145.33, c: 146.31 },
            { o: 146.31, h: 146.72, l: 145.05, c: 145.66 },
            { o: 145.66, h: 146.59, l: 145.33, c: 146.02 },
            { o: 146.02, h: 146.25, l: 141.15, c: 141.59 },
            { o: 141.59, h: 142.01, l: 136.99, c: 137.39 },
            { o: 137.39, h: 137.61, l: 132.78, c: 133.02 },
            { o: 133.02, h: 133.69, l: 131.29, c: 131.89 },
            { o: 131.89, h: 132.86, l: 131.65, c: 132.46 },
            { o: 132.46, h: 132.92, l: 131.59, c: 131.94 },
            { o: 131.94, h: 132.7, l: 131.45, c: 132.13 },
            { o: 132.13, h: 132.54, l: 131.03, c: 131.52 },
            { o: 131.52, h: 134.4, l: 131.17, c: 134.02 },
            { o: 134.02, h: 136.6, l: 133.7, c: 136.46 },
            { o: 136.46, h: 139.33, l: 136.11, c: 139.08 },
            { o: 139.08, h: 143.07, l: 138.9, c: 142.79 },
            { o: 142.79, h: 145.48, l: 142.43, c: 145.16 },
            { o: 145.16, h: 146.31, l: 144.51, c: 144.76 },
            { o: 144.76, h: 144.89, l: 143.02, c: 143.37 },
            { o: 143.37, h: 143.68, l: 141.08, c: 141.43 },
            { o: 141.43, h: 141.81, l: 139.13, c: 139.3 },
            { o: 139.3, h: 139.72, l: 137.28, c: 137.59 },
            { o: 137.59, h: 137.98, l: 135.41, c: 135.76 }
          ],
          zones: [
            { from: 5, top: 146.84, bottom: 145.66, kind: "supply", label: "A = supply" }
          ],
          lines: [
            { y: 145.66, label: "Entry (proximal)", kind: "entry" },
            { y: 147.14, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 5, y: 148.24, text: "MAs cross here" },
            { x: 21, y: 147.71, text: "C: first revisit" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "When two moving averages cross, extend a line to the right and wait for price to come back to it.",
        answer: true,
        explain: "The first revisit of a moving-average cross often holds supply or demand, because averages cross at the origin of imbalances."
      },
      {
        type: "spot",
        q: "Click C, the planned short entry.",
        scene: {
          candles: [
            { o: 134, h: 137.05, l: 133.72, c: 136.78 },
            { o: 136.78, h: 138.81, l: 136.38, c: 138.66 },
            { o: 138.66, h: 141.14, l: 138.52, c: 140.96 },
            { o: 140.96, h: 143.77, l: 140.74, c: 143.44 },
            { o: 143.44, h: 146.31, l: 143.3, c: 146 },
            { o: 146, h: 146.84, l: 145.33, c: 146.31 },
            { o: 146.31, h: 146.72, l: 145.05, c: 145.66 },
            { o: 145.66, h: 146.59, l: 145.33, c: 146.02 },
            { o: 146.02, h: 146.25, l: 141.15, c: 141.59 },
            { o: 141.59, h: 142.01, l: 136.99, c: 137.39 },
            { o: 137.39, h: 137.61, l: 132.78, c: 133.02 },
            { o: 133.02, h: 133.69, l: 131.29, c: 131.89 },
            { o: 131.89, h: 132.86, l: 131.65, c: 132.46 },
            { o: 132.46, h: 132.92, l: 131.59, c: 131.94 },
            { o: 131.94, h: 132.7, l: 131.45, c: 132.13 },
            { o: 132.13, h: 132.54, l: 131.03, c: 131.52 },
            { o: 131.52, h: 134.4, l: 131.17, c: 134.02 },
            { o: 134.02, h: 136.6, l: 133.7, c: 136.46 },
            { o: 136.46, h: 139.33, l: 136.11, c: 139.08 },
            { o: 139.08, h: 143.07, l: 138.9, c: 142.79 },
            { o: 142.79, h: 145.48, l: 142.43, c: 145.16 },
            { o: 145.16, h: 146.31, l: 144.51, c: 144.76 },
            { o: 144.76, h: 144.89, l: 143.02, c: 143.37 },
            { o: 143.37, h: 143.68, l: 141.08, c: 141.43 },
            { o: 141.43, h: 141.81, l: 139.13, c: 139.3 },
            { o: 139.3, h: 139.72, l: 137.28, c: 137.59 },
            { o: 137.59, h: 137.98, l: 135.41, c: 135.76 }
          ],
          zones: [
            { from: 5, top: 146.84, bottom: 145.66, kind: "supply", label: "A" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "C is the first revisit of A after the steep decline B."
      },
      {
        type: "mcq",
        q: "When are the odds highest for a semiconductor stock short?",
        options: [
          "When the stock is at supply but the ETF is at demand",
          "When both the stock and its sector ETF are at supply",
          "When news is good",
          "Any time"
        ],
        answer: 1,
        explain: "Sector confluence: SMH supply used as a guide for its stocks."
      },
      {
        type: "mcq",
        q: "How did Seiden write each trade idea?",
        options: [
          "Just \"bullish\" or \"bearish\"",
          "Entry zone, stop just beyond, initial profit objective",
          "Only a target",
          "Only an entry"
        ],
        answer: 1,
        explain: "Example: NVLS short 31.00-31.35, stop 31.46, objective 1.50-3.00."
      },
      {
        type: "mcq",
        q: "Why sell at the first revisit of A?",
        options: [
          "Buyers there are buying after an advance and into supply",
          "It is cheap",
          "Volume is low",
          "The moving average is rising"
        ],
        answer: 0,
        explain: "The revisit brings buyers who make both novice mistakes; be the seller to them."
      }
    ],
    practice: [
      {
        prompt: "IBM-style demand: a base of small candles, then a strong rally away. Price pulls back to the base for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 155.83, c: 156.01 },
            { o: 156.01, h: 156.2, l: 153.99, c: 154.33 },
            { o: 154.33, h: 154.51, l: 152.35, c: 152.6 },
            { o: 152.6, h: 152.83, l: 150.17, c: 150.47 },
            { o: 150.47, h: 150.63, l: 148.7, c: 149 },
            { o: 149, h: 149.63, l: 148.27, c: 148.69 },
            { o: 148.69, h: 150.62, l: 148.26, c: 149.96 },
            { o: 149.96, h: 150.51, l: 148.17, c: 148.52 },
            { o: 148.52, h: 149.72, l: 148.04, c: 149.03 },
            { o: 149.03, h: 154.67, l: 148.93, c: 154.61 },
            { o: 154.61, h: 161.17, l: 154.49, c: 161.03 },
            { o: 161.03, h: 162.55, l: 160.83, c: 162.38 },
            { o: 162.38, h: 164.43, l: 162.18, c: 164.03 },
            { o: 164.03, h: 164.42, l: 163.48, c: 163.83 },
            { o: 163.83, h: 164.46, l: 163.26, c: 164.13 },
            { o: 164.13, h: 164.28, l: 162.26, c: 162.34 },
            { o: 162.34, h: 162.42, l: 159.93, c: 160.13 },
            { o: 160.13, h: 160.33, l: 157.69, c: 157.74 },
            { o: 157.74, h: 157.79, l: 155.03, c: 155.16 },
            { o: 155.16, h: 155.35, l: 152.87, c: 153.04 },
            { o: 153.04, h: 153.21, l: 150.4, c: 150.46 },
            { o: 150.46, h: 151.11, l: 148.9, c: 150.86 },
            { o: 150.86, h: 154.18, l: 150.73, c: 153.85 },
            { o: 153.85, h: 156.94, l: 153.71, c: 156.63 },
            { o: 156.63, h: 159.86, l: 156.34, c: 159.53 },
            { o: 159.53, h: 161.16, l: 159.17, c: 160.96 },
            { o: 160.96, h: 164.5, l: 160.82, c: 164.23 }
          ],
          zones: [
            { from: 5, top: 149.96, bottom: 148.04, kind: "demand", label: "Demand" },
            { from: 13, top: 164.46, bottom: 163.83, kind: "supply", label: "Supply" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "buy", tp: 163.83 },
        explain: "Strong departure, first return, and room up to supply. Buy at the top of the zone, stop just under it. Price rallied to target."
      }
    ],
    cards: [
      { front: "Disney short in three letters?", back: "A base, B steep drop, C first revisit = short." },
      {
        front: "Moving-average cross use?",
        back: "Extend a line right; the first return often holds supply or demand."
      },
      { front: "Sector confluence?", back: "Stock and its sector ETF at the same kind of level raises odds." },
      { front: "Full trade plan format?", back: "Entry range, stop just beyond, initial profit objective." },
      { front: "Textbook support or imbalance origin?", back: "Imbalance origin." }
    ],
    mnemonic: "Where lines cross, traffic returns: mark the cross, wait for the revisit."
  },
  {
    mentor: "seiden",
    n: 42,
    eli5: {
      oneLiner: "Support gets weaker every time price comes back to it, not stronger.",
      story: "Imagine a bowl of candy for buyers at one price. Each time price comes back, some buyers take their candy and leave. After a few visits the bowl is nearly empty, so price falls right through. Seiden prefers a fresh level below that nobody has touched yet. He also asks five questions before every year of trading: plan, discretion, objectivity, measuring supply and demand, and reviewing results.",
      analogy: "Like a sandcastle wall hit by waves: every wave takes a bit of sand until the wall falls."
    },
    bigIdeas: [
      "Each revisit fills more waiting buyers, so tested support weakens.",
      "The better buy is the unvisited origin below.",
      "Turn every open question in your plan into a rule; review average win, average loss and win rate."
    ],
    steps: [
      {
        title: "Two supports",
        narration: "There are two demand levels: Support 2 at the origin of the whole rally, and Support 1 higher up.",
        scene: {
          candles: [
            { o: 146, h: 146.33, l: 143.66, c: 144.06 },
            { o: 144.06, h: 144.26, l: 141.48, c: 141.89 },
            { o: 141.89, h: 142.17, l: 140.04, c: 140.27 },
            { o: 140.27, h: 140.68, l: 137.56, c: 138 },
            { o: 138, h: 138.65, l: 137.22, c: 137.57 },
            { o: 137.57, h: 139.5, l: 137.25, c: 138.8 },
            { o: 138.8, h: 139.37, l: 137.5, c: 137.99 },
            { o: 137.99, h: 142.76, l: 137.82, c: 142.66 },
            { o: 142.66, h: 148.19, l: 142.57, c: 147.99 },
            { o: 147.99, h: 148.61, l: 146.49, c: 147.15 },
            { o: 147.15, h: 149.01, l: 146.65, c: 148.33 },
            { o: 148.33, h: 148.8, l: 147.77, c: 148.08 },
            { o: 148.08, h: 152.42, l: 147.93, c: 152.26 },
            { o: 152.26, h: 157.29, l: 152.18, c: 157.08 },
            { o: 157.08, h: 157.29, l: 156.44, c: 156.87 },
            { o: 156.87, h: 158.35, l: 156.36, c: 158.08 },
            { o: 158.08, h: 158.22, l: 153.09, c: 153.33 },
            { o: 153.33, h: 153.55, l: 148.62, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.41, c: 148.93 },
            { o: 148.93, h: 150.65, l: 148.56, c: 150.47 },
            { o: 150.47, h: 153.15, l: 150.19, c: 152.93 },
            { o: 152.93, h: 153.1, l: 150.46, c: 150.63 },
            { o: 150.63, h: 150.92, l: 148.58, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.04, c: 148.93 },
            { o: 148.93, h: 151.2, l: 148.51, c: 150.8 },
            { o: 150.8, h: 152.25, l: 150.46, c: 151.93 },
            { o: 151.93, h: 152.11, l: 149.84, c: 150.23 },
            { o: 150.23, h: 150.43, l: 148.68, c: 148.83 },
            { o: 148.83, h: 149.18, l: 146.67, c: 148.93 },
            { o: 148.93, h: 150.3, l: 148.67, c: 150.02 },
            { o: 150.02, h: 151.33, l: 149.81, c: 150.93 },
            { o: 150.93, h: 151.22, l: 149.65, c: 149.91 },
            { o: 149.91, h: 150.12, l: 148.65, c: 148.83 },
            { o: 148.83, h: 148.98, l: 143.69, c: 143.99 },
            { o: 143.99, h: 144.15, l: 142.19, c: 142.37 },
            { o: 142.37, h: 142.46, l: 140.81, c: 141.03 },
            { o: 141.03, h: 141.23, l: 139.2, c: 139.3 },
            { o: 139.3, h: 140.05, l: 138.01, c: 139.8 },
            { o: 139.8, h: 142.46, l: 139.58, c: 142.22 },
            { o: 142.22, h: 144.38, l: 141.87, c: 144.04 },
            { o: 144.04, h: 145.83, l: 143.89, c: 145.57 },
            { o: 145.57, h: 148.04, l: 145.43, c: 147.8 }
          ],
          zones: [
            { from: 4, top: 138.8, bottom: 137.22, kind: "demand", label: "Support 2 (fresh)" },
            { from: 9, top: 148.33, bottom: 146.49, kind: "demand", label: "Support 1" }
          ],
          reveal: 16
        }
      },
      {
        title: "Support 1 gets tested again and again",
        narration: "Price comes back to Support 1 three times. Each bounce is smaller, because each visit filled more of the waiting buy orders.",
        scene: {
          candles: [
            { o: 146, h: 146.33, l: 143.66, c: 144.06 },
            { o: 144.06, h: 144.26, l: 141.48, c: 141.89 },
            { o: 141.89, h: 142.17, l: 140.04, c: 140.27 },
            { o: 140.27, h: 140.68, l: 137.56, c: 138 },
            { o: 138, h: 138.65, l: 137.22, c: 137.57 },
            { o: 137.57, h: 139.5, l: 137.25, c: 138.8 },
            { o: 138.8, h: 139.37, l: 137.5, c: 137.99 },
            { o: 137.99, h: 142.76, l: 137.82, c: 142.66 },
            { o: 142.66, h: 148.19, l: 142.57, c: 147.99 },
            { o: 147.99, h: 148.61, l: 146.49, c: 147.15 },
            { o: 147.15, h: 149.01, l: 146.65, c: 148.33 },
            { o: 148.33, h: 148.8, l: 147.77, c: 148.08 },
            { o: 148.08, h: 152.42, l: 147.93, c: 152.26 },
            { o: 152.26, h: 157.29, l: 152.18, c: 157.08 },
            { o: 157.08, h: 157.29, l: 156.44, c: 156.87 },
            { o: 156.87, h: 158.35, l: 156.36, c: 158.08 },
            { o: 158.08, h: 158.22, l: 153.09, c: 153.33 },
            { o: 153.33, h: 153.55, l: 148.62, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.41, c: 148.93 },
            { o: 148.93, h: 150.65, l: 148.56, c: 150.47 },
            { o: 150.47, h: 153.15, l: 150.19, c: 152.93 },
            { o: 152.93, h: 153.1, l: 150.46, c: 150.63 },
            { o: 150.63, h: 150.92, l: 148.58, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.04, c: 148.93 },
            { o: 148.93, h: 151.2, l: 148.51, c: 150.8 },
            { o: 150.8, h: 152.25, l: 150.46, c: 151.93 },
            { o: 151.93, h: 152.11, l: 149.84, c: 150.23 },
            { o: 150.23, h: 150.43, l: 148.68, c: 148.83 },
            { o: 148.83, h: 149.18, l: 146.67, c: 148.93 },
            { o: 148.93, h: 150.3, l: 148.67, c: 150.02 },
            { o: 150.02, h: 151.33, l: 149.81, c: 150.93 },
            { o: 150.93, h: 151.22, l: 149.65, c: 149.91 },
            { o: 149.91, h: 150.12, l: 148.65, c: 148.83 },
            { o: 148.83, h: 148.98, l: 143.69, c: 143.99 },
            { o: 143.99, h: 144.15, l: 142.19, c: 142.37 },
            { o: 142.37, h: 142.46, l: 140.81, c: 141.03 },
            { o: 141.03, h: 141.23, l: 139.2, c: 139.3 },
            { o: 139.3, h: 140.05, l: 138.01, c: 139.8 },
            { o: 139.8, h: 142.46, l: 139.58, c: 142.22 },
            { o: 142.22, h: 144.38, l: 141.87, c: 144.04 },
            { o: 144.04, h: 145.83, l: 143.89, c: 145.57 },
            { o: 145.57, h: 148.04, l: 145.43, c: 147.8 }
          ],
          zones: [
            { from: 4, top: 138.8, bottom: 137.22, kind: "demand", label: "Support 2 (fresh)" },
            { from: 9, top: 148.33, bottom: 146.49, kind: "demand", label: "Support 1" }
          ],
          notes: [
            { x: 18, y: 146.01, text: "1" },
            { x: 23, y: 145.64, text: "2" },
            { x: 28, y: 145.27, text: "3" }
          ],
          highlight: { from: 18, to: 18, label: "tests" },
          reveal: 31
        }
      },
      {
        title: "It gives way",
        narration: "On the next visit there are not enough buyers left and price breaks through.",
        scene: {
          candles: [
            { o: 146, h: 146.33, l: 143.66, c: 144.06 },
            { o: 144.06, h: 144.26, l: 141.48, c: 141.89 },
            { o: 141.89, h: 142.17, l: 140.04, c: 140.27 },
            { o: 140.27, h: 140.68, l: 137.56, c: 138 },
            { o: 138, h: 138.65, l: 137.22, c: 137.57 },
            { o: 137.57, h: 139.5, l: 137.25, c: 138.8 },
            { o: 138.8, h: 139.37, l: 137.5, c: 137.99 },
            { o: 137.99, h: 142.76, l: 137.82, c: 142.66 },
            { o: 142.66, h: 148.19, l: 142.57, c: 147.99 },
            { o: 147.99, h: 148.61, l: 146.49, c: 147.15 },
            { o: 147.15, h: 149.01, l: 146.65, c: 148.33 },
            { o: 148.33, h: 148.8, l: 147.77, c: 148.08 },
            { o: 148.08, h: 152.42, l: 147.93, c: 152.26 },
            { o: 152.26, h: 157.29, l: 152.18, c: 157.08 },
            { o: 157.08, h: 157.29, l: 156.44, c: 156.87 },
            { o: 156.87, h: 158.35, l: 156.36, c: 158.08 },
            { o: 158.08, h: 158.22, l: 153.09, c: 153.33 },
            { o: 153.33, h: 153.55, l: 148.62, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.41, c: 148.93 },
            { o: 148.93, h: 150.65, l: 148.56, c: 150.47 },
            { o: 150.47, h: 153.15, l: 150.19, c: 152.93 },
            { o: 152.93, h: 153.1, l: 150.46, c: 150.63 },
            { o: 150.63, h: 150.92, l: 148.58, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.04, c: 148.93 },
            { o: 148.93, h: 151.2, l: 148.51, c: 150.8 },
            { o: 150.8, h: 152.25, l: 150.46, c: 151.93 },
            { o: 151.93, h: 152.11, l: 149.84, c: 150.23 },
            { o: 150.23, h: 150.43, l: 148.68, c: 148.83 },
            { o: 148.83, h: 149.18, l: 146.67, c: 148.93 },
            { o: 148.93, h: 150.3, l: 148.67, c: 150.02 },
            { o: 150.02, h: 151.33, l: 149.81, c: 150.93 },
            { o: 150.93, h: 151.22, l: 149.65, c: 149.91 },
            { o: 149.91, h: 150.12, l: 148.65, c: 148.83 },
            { o: 148.83, h: 148.98, l: 143.69, c: 143.99 },
            { o: 143.99, h: 144.15, l: 142.19, c: 142.37 },
            { o: 142.37, h: 142.46, l: 140.81, c: 141.03 },
            { o: 141.03, h: 141.23, l: 139.2, c: 139.3 },
            { o: 139.3, h: 140.05, l: 138.01, c: 139.8 },
            { o: 139.8, h: 142.46, l: 139.58, c: 142.22 },
            { o: 142.22, h: 144.38, l: 141.87, c: 144.04 },
            { o: 144.04, h: 145.83, l: 143.89, c: 145.57 },
            { o: 145.57, h: 148.04, l: 145.43, c: 147.8 }
          ],
          zones: [
            { from: 4, top: 138.8, bottom: 137.22, kind: "demand", label: "Support 2 (fresh)" },
            { from: 9, top: 148.33, bottom: 146.49, kind: "demand", label: "Support 1" }
          ],
          notes: [
            { x: 18, y: 146.01, text: "1" },
            { x: 23, y: 145.64, text: "2" },
            { x: 28, y: 145.27, text: "3" }
          ],
          highlight: { from: 33, to: 33, label: "support used up" },
          reveal: 34
        }
      },
      {
        title: "Buy the fresh origin",
        narration: "Support 2 has never been revisited. That is the higher-quality demand. Buy at its top line with the stop below.",
        scene: {
          candles: [
            { o: 146, h: 146.33, l: 143.66, c: 144.06 },
            { o: 144.06, h: 144.26, l: 141.48, c: 141.89 },
            { o: 141.89, h: 142.17, l: 140.04, c: 140.27 },
            { o: 140.27, h: 140.68, l: 137.56, c: 138 },
            { o: 138, h: 138.65, l: 137.22, c: 137.57 },
            { o: 137.57, h: 139.5, l: 137.25, c: 138.8 },
            { o: 138.8, h: 139.37, l: 137.5, c: 137.99 },
            { o: 137.99, h: 142.76, l: 137.82, c: 142.66 },
            { o: 142.66, h: 148.19, l: 142.57, c: 147.99 },
            { o: 147.99, h: 148.61, l: 146.49, c: 147.15 },
            { o: 147.15, h: 149.01, l: 146.65, c: 148.33 },
            { o: 148.33, h: 148.8, l: 147.77, c: 148.08 },
            { o: 148.08, h: 152.42, l: 147.93, c: 152.26 },
            { o: 152.26, h: 157.29, l: 152.18, c: 157.08 },
            { o: 157.08, h: 157.29, l: 156.44, c: 156.87 },
            { o: 156.87, h: 158.35, l: 156.36, c: 158.08 },
            { o: 158.08, h: 158.22, l: 153.09, c: 153.33 },
            { o: 153.33, h: 153.55, l: 148.62, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.41, c: 148.93 },
            { o: 148.93, h: 150.65, l: 148.56, c: 150.47 },
            { o: 150.47, h: 153.15, l: 150.19, c: 152.93 },
            { o: 152.93, h: 153.1, l: 150.46, c: 150.63 },
            { o: 150.63, h: 150.92, l: 148.58, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.04, c: 148.93 },
            { o: 148.93, h: 151.2, l: 148.51, c: 150.8 },
            { o: 150.8, h: 152.25, l: 150.46, c: 151.93 },
            { o: 151.93, h: 152.11, l: 149.84, c: 150.23 },
            { o: 150.23, h: 150.43, l: 148.68, c: 148.83 },
            { o: 148.83, h: 149.18, l: 146.67, c: 148.93 },
            { o: 148.93, h: 150.3, l: 148.67, c: 150.02 },
            { o: 150.02, h: 151.33, l: 149.81, c: 150.93 },
            { o: 150.93, h: 151.22, l: 149.65, c: 149.91 },
            { o: 149.91, h: 150.12, l: 148.65, c: 148.83 },
            { o: 148.83, h: 148.98, l: 143.69, c: 143.99 },
            { o: 143.99, h: 144.15, l: 142.19, c: 142.37 },
            { o: 142.37, h: 142.46, l: 140.81, c: 141.03 },
            { o: 141.03, h: 141.23, l: 139.2, c: 139.3 },
            { o: 139.3, h: 140.05, l: 138.01, c: 139.8 },
            { o: 139.8, h: 142.46, l: 139.58, c: 142.22 },
            { o: 142.22, h: 144.38, l: 141.87, c: 144.04 },
            { o: 144.04, h: 145.83, l: 143.89, c: 145.57 },
            { o: 145.57, h: 148.04, l: 145.43, c: 147.8 }
          ],
          zones: [
            { from: 4, top: 138.8, bottom: 137.22, kind: "demand", label: "Support 2 (fresh)" },
            { from: 9, top: 148.33, bottom: 146.49, kind: "demand", label: "Support 1" }
          ],
          lines: [
            { y: 138.8, label: "Entry (proximal)", kind: "entry" },
            { y: 136.92, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 18, y: 146.01, text: "1" },
            { x: 23, y: 145.64, text: "2" },
            { x: 28, y: 145.27, text: "3" },
            { x: 37, y: 136.61, text: "Fresh demand holds" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A support level that has been tested many times is getting stronger.",
        answer: false,
        explain: "Seiden: support is getting weaker, not stronger. Each revisit lets more of the buyers fill."
      },
      {
        type: "spot",
        q: "Click the candle where the used-up support finally breaks.",
        scene: {
          candles: [
            { o: 146, h: 146.33, l: 143.66, c: 144.06 },
            { o: 144.06, h: 144.26, l: 141.48, c: 141.89 },
            { o: 141.89, h: 142.17, l: 140.04, c: 140.27 },
            { o: 140.27, h: 140.68, l: 137.56, c: 138 },
            { o: 138, h: 138.65, l: 137.22, c: 137.57 },
            { o: 137.57, h: 139.5, l: 137.25, c: 138.8 },
            { o: 138.8, h: 139.37, l: 137.5, c: 137.99 },
            { o: 137.99, h: 142.76, l: 137.82, c: 142.66 },
            { o: 142.66, h: 148.19, l: 142.57, c: 147.99 },
            { o: 147.99, h: 148.61, l: 146.49, c: 147.15 },
            { o: 147.15, h: 149.01, l: 146.65, c: 148.33 },
            { o: 148.33, h: 148.8, l: 147.77, c: 148.08 },
            { o: 148.08, h: 152.42, l: 147.93, c: 152.26 },
            { o: 152.26, h: 157.29, l: 152.18, c: 157.08 },
            { o: 157.08, h: 157.29, l: 156.44, c: 156.87 },
            { o: 156.87, h: 158.35, l: 156.36, c: 158.08 },
            { o: 158.08, h: 158.22, l: 153.09, c: 153.33 },
            { o: 153.33, h: 153.55, l: 148.62, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.41, c: 148.93 },
            { o: 148.93, h: 150.65, l: 148.56, c: 150.47 },
            { o: 150.47, h: 153.15, l: 150.19, c: 152.93 },
            { o: 152.93, h: 153.1, l: 150.46, c: 150.63 },
            { o: 150.63, h: 150.92, l: 148.58, c: 148.83 },
            { o: 148.83, h: 149.18, l: 147.04, c: 148.93 },
            { o: 148.93, h: 151.2, l: 148.51, c: 150.8 },
            { o: 150.8, h: 152.25, l: 150.46, c: 151.93 },
            { o: 151.93, h: 152.11, l: 149.84, c: 150.23 },
            { o: 150.23, h: 150.43, l: 148.68, c: 148.83 },
            { o: 148.83, h: 149.18, l: 146.67, c: 148.93 },
            { o: 148.93, h: 150.3, l: 148.67, c: 150.02 },
            { o: 150.02, h: 151.33, l: 149.81, c: 150.93 },
            { o: 150.93, h: 151.22, l: 149.65, c: 149.91 },
            { o: 149.91, h: 150.12, l: 148.65, c: 148.83 },
            { o: 148.83, h: 148.98, l: 143.69, c: 143.99 },
            { o: 143.99, h: 144.15, l: 142.19, c: 142.37 },
            { o: 142.37, h: 142.46, l: 140.81, c: 141.03 },
            { o: 141.03, h: 141.23, l: 139.2, c: 139.3 },
            { o: 139.3, h: 140.05, l: 138.01, c: 139.8 },
            { o: 139.8, h: 142.46, l: 139.58, c: 142.22 },
            { o: 142.22, h: 144.38, l: 141.87, c: 144.04 },
            { o: 144.04, h: 145.83, l: 143.89, c: 145.57 },
            { o: 145.57, h: 148.04, l: 145.43, c: 147.8 }
          ],
          zones: [
            { from: 4, top: 138.8, bottom: 137.22, kind: "demand", label: "Support 2" },
            { from: 9, top: 148.33, bottom: 146.49, kind: "demand", label: "Support 1" }
          ]
        },
        answer: { from: 33, to: 33 },
        explain: "After three tests, there are too few buyers left at Support 1 and price breaks through."
      },
      {
        type: "mcq",
        q: "Where is the better buy?",
        options: [
          "Support 1, tested three times",
          "Support 2, the unvisited origin below",
          "In the middle",
          "At the high"
        ],
        answer: 1,
        explain: "The unvisited origin of the demand still holds its orders."
      },
      {
        type: "mcq",
        q: "What does \"discretion\" in a plan really mean?",
        options: [
          "Freedom to win",
          "Unanswered questions that should become rules",
          "A secret indicator",
          "Bigger size"
        ],
        answer: 1,
        explain: "Discretion means unanswered questions; Seiden says turn them into rules."
      },
      {
        type: "order",
        q: "Order Seiden's questions before risking money.",
        items: [
          "Do I have a plan and stick to it?",
          "Is there discretion left in it?",
          "Is my analysis objective?",
          "Can I quantify supply and demand?",
          "Have I reviewed my results?"
        ],
        explain: "He says do not trade until these are handled."
      },
      {
        type: "mcq",
        q: "A down-sloping 200-day moving average tells you...",
        options: [
          "Buy every dip",
          "The trend is down, so shorting at resistance is acceptable",
          "Nothing",
          "Support is strong"
        ],
        answer: 1,
        explain: "He uses the 200 MA slope as a trend filter."
      }
    ],
    practice: [
      {
        prompt: "Support 1 has held three times. Price is coming back for a fourth visit. Buy at Support 1, sell, or nothing?",
        scene: {
          candles: [
            { o: 146, h: 146.18, l: 143.7, c: 143.84 },
            { o: 143.84, h: 144.07, l: 141.52, c: 141.66 },
            { o: 141.66, h: 141.91, l: 140.36, c: 140.5 },
            { o: 140.5, h: 140.87, l: 137.77, c: 138 },
            { o: 138, h: 138.34, l: 136.41, c: 137.02 },
            { o: 137.02, h: 138.54, l: 136.56, c: 138.23 },
            { o: 138.23, h: 138.9, l: 137.67, c: 138.08 },
            { o: 138.08, h: 143.12, l: 137.97, c: 142.97 },
            { o: 142.97, h: 148.2, l: 142.77, c: 148.08 },
            { o: 148.08, h: 148.6, l: 146.85, c: 147.3 },
            { o: 147.3, h: 148.6, l: 146.8, c: 148.24 },
            { o: 148.24, h: 148.92, l: 147.55, c: 148.08 },
            { o: 148.08, h: 152.36, l: 147.94, c: 152.17 },
            { o: 152.17, h: 157.14, l: 152, c: 157.08 },
            { o: 157.08, h: 157.96, l: 156.82, c: 157.46 },
            { o: 157.46, h: 158.78, l: 156.95, c: 158.08 },
            { o: 158.08, h: 158.33, l: 153.39, c: 153.51 },
            { o: 153.51, h: 153.65, l: 148.34, c: 148.74 },
            { o: 148.74, h: 149.09, l: 147.52, c: 148.84 },
            { o: 148.84, h: 150.75, l: 148.45, c: 150.48 },
            { o: 150.48, h: 152.97, l: 150.32, c: 152.84 },
            { o: 152.84, h: 153.25, l: 150.74, c: 150.89 },
            { o: 150.89, h: 151.19, l: 148.53, c: 148.74 },
            { o: 148.74, h: 149.09, l: 147.23, c: 148.84 },
            { o: 148.84, h: 150.32, l: 148.6, c: 150 },
            { o: 150, h: 152.22, l: 149.76, c: 151.84 },
            { o: 151.84, h: 152.01, l: 149.99, c: 150.42 },
            { o: 150.42, h: 150.61, l: 148.56, c: 148.74 },
            { o: 148.74, h: 149.09, l: 146.94, c: 148.84 },
            { o: 148.84, h: 150.01, l: 148.61, c: 149.86 },
            { o: 149.86, h: 151.24, l: 149.58, c: 150.84 },
            { o: 150.84, h: 151.25, l: 149.86, c: 150.01 },
            { o: 150.01, h: 150.38, l: 148.34, c: 148.74 },
            { o: 148.74, h: 148.89, l: 144, c: 144.3 },
            { o: 144.3, h: 144.4, l: 142.51, c: 142.62 },
            { o: 142.62, h: 142.72, l: 140.31, c: 140.37 },
            { o: 140.37, h: 140.43, l: 138.55, c: 138.73 },
            { o: 138.73, h: 139.48, l: 137.32, c: 139.23 },
            { o: 139.23, h: 141.4, l: 139.06, c: 141.26 },
            { o: 141.26, h: 143.38, l: 140.86, c: 143.19 },
            { o: 143.19, h: 145.28, l: 142.88, c: 144.98 },
            { o: 144.98, h: 147.66, l: 144.82, c: 147.23 }
          ],
          zones: [
            { from: 9, top: 148.24, bottom: 146.8, kind: "demand", label: "Support 1 (4th visit)" }
          ],
          reveal: 33
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Three tests have used up the buyers at Support 1, so skip it. Price broke through and only found buyers at the fresh Support 2 below."
      }
    ],
    cards: [
      { front: "Repeated tests make support...?", back: "Weaker: each test fills more waiting buyers." },
      { front: "Better demand to buy?", back: "The unvisited origin of the move." },
      { front: "What should discretion become?", back: "Rules." },
      { front: "Three stats to review?", back: "Average win, average loss, win percentage." },
      { front: "Who funds the consistent trader?", back: "The novice trader, almost always." }
    ],
    mnemonic: "Every knock empties the bowl: tested support weakens; buy the full bowl below."
  },
  {
    mentor: "seiden",
    n: 46,
    eli5: {
      oneLiner: "An old, untouched level is often the best level of all.",
      story: "A market can be in three moods: more buyers, more sellers, or balance. In balance nothing much happens. When price comes back to a level from years ago, it has travelled very far from balance, so the reaction can be big. It is not the same people from years ago; lower prices simply attract more buyers.",
      analogy: "Like a rubber band: the further you stretch it from the middle, the harder it snaps back."
    },
    bigIdeas: [
      "Three states: demand > supply, supply > demand, equilibrium. No opportunity at equilibrium.",
      "Old untouched levels are far from equilibrium, so they offer big profit margins.",
      "Once in profit, move the stop to breakeven and take some near the next supply."
    ],
    steps: [
      {
        title: "An old demand level",
        narration: "Long ago, price based here and rallied hard. That demand was never revisited.",
        scene: {
          candles: [
            { o: 140, h: 140.25, l: 137.79, c: 138.22 },
            { o: 138.22, h: 138.38, l: 135.14, c: 135.52 },
            { o: 135.52, h: 135.81, l: 132.78, c: 132.96 },
            { o: 132.96, h: 133.17, l: 130.8, c: 131 },
            { o: 131, h: 131.68, l: 130.02, c: 130.38 },
            { o: 130.38, h: 132.55, l: 129.82, c: 131.93 },
            { o: 131.93, h: 132.29, l: 130.34, c: 130.97 },
            { o: 130.97, h: 137.08, l: 130.8, c: 136.87 },
            { o: 136.87, h: 143.03, l: 136.77, c: 142.97 },
            { o: 142.97, h: 146.89, l: 142.7, c: 146.71 },
            { o: 146.71, h: 150.24, l: 146.47, c: 149.96 },
            { o: 149.96, h: 150.24, l: 149.61, c: 149.79 },
            { o: 149.79, h: 156.71, l: 149.44, c: 156.46 },
            { o: 156.46, h: 159.87, l: 156.21, c: 159.71 },
            { o: 159.71, h: 159.87, l: 159.37, c: 159.54 },
            { o: 159.54, h: 166.58, l: 159.15, c: 166.21 },
            { o: 166.21, h: 169.2, l: 166.03, c: 168.97 },
            { o: 168.97, h: 169.62, l: 168.3, c: 168.83 },
            { o: 168.83, h: 169.36, l: 168.47, c: 169.05 },
            { o: 169.05, h: 169.18, l: 164.26, c: 164.33 },
            { o: 164.33, h: 164.41, l: 159.58, c: 159.77 },
            { o: 159.77, h: 159.93, l: 154.94, c: 155.05 },
            { o: 155.05, h: 155.22, l: 150.61, c: 150.77 },
            { o: 150.77, h: 150.83, l: 146.23, c: 146.31 },
            { o: 146.31, h: 146.38, l: 140.92, c: 141.05 },
            { o: 141.05, h: 141.2, l: 136.98, c: 137.18 },
            { o: 137.18, h: 137.33, l: 132.32, c: 132.43 },
            { o: 132.43, h: 133.18, l: 130.88, c: 132.93 },
            { o: 132.93, h: 134.69, l: 132.74, c: 134.44 },
            { o: 134.44, h: 136.25, l: 134.07, c: 136.03 },
            { o: 136.03, h: 138.93, l: 135.77, c: 138.48 },
            { o: 138.48, h: 140.16, l: 138.2, c: 139.93 }
          ],
          zones: [
            { from: 4, top: 131.93, bottom: 129.82, kind: "demand", label: "Old demand" }
          ],
          reveal: 9
        }
      },
      {
        title: "Far from equilibrium",
        narration: "Price climbs for a long time and then crashes. By the time it returns to the old level, it is very far from where buyers and sellers balanced.",
        scene: {
          candles: [
            { o: 140, h: 140.25, l: 137.79, c: 138.22 },
            { o: 138.22, h: 138.38, l: 135.14, c: 135.52 },
            { o: 135.52, h: 135.81, l: 132.78, c: 132.96 },
            { o: 132.96, h: 133.17, l: 130.8, c: 131 },
            { o: 131, h: 131.68, l: 130.02, c: 130.38 },
            { o: 130.38, h: 132.55, l: 129.82, c: 131.93 },
            { o: 131.93, h: 132.29, l: 130.34, c: 130.97 },
            { o: 130.97, h: 137.08, l: 130.8, c: 136.87 },
            { o: 136.87, h: 143.03, l: 136.77, c: 142.97 },
            { o: 142.97, h: 146.89, l: 142.7, c: 146.71 },
            { o: 146.71, h: 150.24, l: 146.47, c: 149.96 },
            { o: 149.96, h: 150.24, l: 149.61, c: 149.79 },
            { o: 149.79, h: 156.71, l: 149.44, c: 156.46 },
            { o: 156.46, h: 159.87, l: 156.21, c: 159.71 },
            { o: 159.71, h: 159.87, l: 159.37, c: 159.54 },
            { o: 159.54, h: 166.58, l: 159.15, c: 166.21 },
            { o: 166.21, h: 169.2, l: 166.03, c: 168.97 },
            { o: 168.97, h: 169.62, l: 168.3, c: 168.83 },
            { o: 168.83, h: 169.36, l: 168.47, c: 169.05 },
            { o: 169.05, h: 169.18, l: 164.26, c: 164.33 },
            { o: 164.33, h: 164.41, l: 159.58, c: 159.77 },
            { o: 159.77, h: 159.93, l: 154.94, c: 155.05 },
            { o: 155.05, h: 155.22, l: 150.61, c: 150.77 },
            { o: 150.77, h: 150.83, l: 146.23, c: 146.31 },
            { o: 146.31, h: 146.38, l: 140.92, c: 141.05 },
            { o: 141.05, h: 141.2, l: 136.98, c: 137.18 },
            { o: 137.18, h: 137.33, l: 132.32, c: 132.43 },
            { o: 132.43, h: 133.18, l: 130.88, c: 132.93 },
            { o: 132.93, h: 134.69, l: 132.74, c: 134.44 },
            { o: 134.44, h: 136.25, l: 134.07, c: 136.03 },
            { o: 136.03, h: 138.93, l: 135.77, c: 138.48 },
            { o: 138.48, h: 140.16, l: 138.2, c: 139.93 }
          ],
          zones: [
            { from: 4, top: 131.93, bottom: 129.82, kind: "demand", label: "Old demand" }
          ],
          highlight: { from: 19, to: 21, label: "far from balance" },
          reveal: 27
        }
      },
      {
        title: "Low risk, high reward buy",
        narration: "Buy at the top of the old zone, stop under the bottom. Small risk, very large room.",
        scene: {
          candles: [
            { o: 140, h: 140.25, l: 137.79, c: 138.22 },
            { o: 138.22, h: 138.38, l: 135.14, c: 135.52 },
            { o: 135.52, h: 135.81, l: 132.78, c: 132.96 },
            { o: 132.96, h: 133.17, l: 130.8, c: 131 },
            { o: 131, h: 131.68, l: 130.02, c: 130.38 },
            { o: 130.38, h: 132.55, l: 129.82, c: 131.93 },
            { o: 131.93, h: 132.29, l: 130.34, c: 130.97 },
            { o: 130.97, h: 137.08, l: 130.8, c: 136.87 },
            { o: 136.87, h: 143.03, l: 136.77, c: 142.97 },
            { o: 142.97, h: 146.89, l: 142.7, c: 146.71 },
            { o: 146.71, h: 150.24, l: 146.47, c: 149.96 },
            { o: 149.96, h: 150.24, l: 149.61, c: 149.79 },
            { o: 149.79, h: 156.71, l: 149.44, c: 156.46 },
            { o: 156.46, h: 159.87, l: 156.21, c: 159.71 },
            { o: 159.71, h: 159.87, l: 159.37, c: 159.54 },
            { o: 159.54, h: 166.58, l: 159.15, c: 166.21 },
            { o: 166.21, h: 169.2, l: 166.03, c: 168.97 },
            { o: 168.97, h: 169.62, l: 168.3, c: 168.83 },
            { o: 168.83, h: 169.36, l: 168.47, c: 169.05 },
            { o: 169.05, h: 169.18, l: 164.26, c: 164.33 },
            { o: 164.33, h: 164.41, l: 159.58, c: 159.77 },
            { o: 159.77, h: 159.93, l: 154.94, c: 155.05 },
            { o: 155.05, h: 155.22, l: 150.61, c: 150.77 },
            { o: 150.77, h: 150.83, l: 146.23, c: 146.31 },
            { o: 146.31, h: 146.38, l: 140.92, c: 141.05 },
            { o: 141.05, h: 141.2, l: 136.98, c: 137.18 },
            { o: 137.18, h: 137.33, l: 132.32, c: 132.43 },
            { o: 132.43, h: 133.18, l: 130.88, c: 132.93 },
            { o: 132.93, h: 134.69, l: 132.74, c: 134.44 },
            { o: 134.44, h: 136.25, l: 134.07, c: 136.03 },
            { o: 136.03, h: 138.93, l: 135.77, c: 138.48 },
            { o: 138.48, h: 140.16, l: 138.2, c: 139.93 }
          ],
          zones: [
            { from: 4, top: 131.93, bottom: 129.82, kind: "demand", label: "Old demand" }
          ],
          lines: [
            { y: 131.93, label: "Entry (proximal)", kind: "entry" },
            { y: 129.52, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 27, y: 129.48, text: "Old level holds" }
          ]
        }
      },
      {
        title: "Manage the trade",
        narration: "After a solid gain, move the stop to breakeven and consider taking some or all profit near the nearby supply. Getting gains is one thing; getting them with the lowest risk is another.",
        scene: {
          candles: [
            { o: 140, h: 140.25, l: 137.79, c: 138.22 },
            { o: 138.22, h: 138.38, l: 135.14, c: 135.52 },
            { o: 135.52, h: 135.81, l: 132.78, c: 132.96 },
            { o: 132.96, h: 133.17, l: 130.8, c: 131 },
            { o: 131, h: 131.68, l: 130.02, c: 130.38 },
            { o: 130.38, h: 132.55, l: 129.82, c: 131.93 },
            { o: 131.93, h: 132.29, l: 130.34, c: 130.97 },
            { o: 130.97, h: 137.08, l: 130.8, c: 136.87 },
            { o: 136.87, h: 143.03, l: 136.77, c: 142.97 },
            { o: 142.97, h: 146.89, l: 142.7, c: 146.71 },
            { o: 146.71, h: 150.24, l: 146.47, c: 149.96 },
            { o: 149.96, h: 150.24, l: 149.61, c: 149.79 },
            { o: 149.79, h: 156.71, l: 149.44, c: 156.46 },
            { o: 156.46, h: 159.87, l: 156.21, c: 159.71 },
            { o: 159.71, h: 159.87, l: 159.37, c: 159.54 },
            { o: 159.54, h: 166.58, l: 159.15, c: 166.21 },
            { o: 166.21, h: 169.2, l: 166.03, c: 168.97 },
            { o: 168.97, h: 169.62, l: 168.3, c: 168.83 },
            { o: 168.83, h: 169.36, l: 168.47, c: 169.05 },
            { o: 169.05, h: 169.18, l: 164.26, c: 164.33 },
            { o: 164.33, h: 164.41, l: 159.58, c: 159.77 },
            { o: 159.77, h: 159.93, l: 154.94, c: 155.05 },
            { o: 155.05, h: 155.22, l: 150.61, c: 150.77 },
            { o: 150.77, h: 150.83, l: 146.23, c: 146.31 },
            { o: 146.31, h: 146.38, l: 140.92, c: 141.05 },
            { o: 141.05, h: 141.2, l: 136.98, c: 137.18 },
            { o: 137.18, h: 137.33, l: 132.32, c: 132.43 },
            { o: 132.43, h: 133.18, l: 130.88, c: 132.93 },
            { o: 132.93, h: 134.69, l: 132.74, c: 134.44 },
            { o: 134.44, h: 136.25, l: 134.07, c: 136.03 },
            { o: 136.03, h: 138.93, l: 135.77, c: 138.48 },
            { o: 138.48, h: 140.16, l: 138.2, c: 139.93 }
          ],
          zones: [
            { from: 4, top: 131.93, bottom: 129.82, kind: "demand", label: "Old demand" }
          ],
          lines: [
            { y: 131.93, label: "Entry (proximal)", kind: "entry" },
            { y: 129.52, label: "Stop beyond distal", kind: "sl" },
            { y: 131.93, label: "Stop to breakeven", kind: "sl", from: 30 }
          ],
          notes: [
            { x: 27, y: 129.48, text: "Old level holds" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "At equilibrium, how much opportunity is there?",
        options: ["The most", "Little to none", "Exactly half", "It depends on the news"],
        answer: 1,
        explain: "At equilibrium everyone can trade as much as they want; there is little to no opportunity."
      },
      {
        type: "tf",
        q: "A demand level from many years ago is less relevant than one from last week.",
        answer: false,
        explain: "Old untouched levels often produce better trades because price returning to them is far from equilibrium."
      },
      {
        type: "spot",
        q: "Click the old base that formed this demand.",
        scene: {
          candles: [
            { o: 140, h: 140.25, l: 137.79, c: 138.22 },
            { o: 138.22, h: 138.38, l: 135.14, c: 135.52 },
            { o: 135.52, h: 135.81, l: 132.78, c: 132.96 },
            { o: 132.96, h: 133.17, l: 130.8, c: 131 },
            { o: 131, h: 131.68, l: 130.02, c: 130.38 },
            { o: 130.38, h: 132.55, l: 129.82, c: 131.93 },
            { o: 131.93, h: 132.29, l: 130.34, c: 130.97 },
            { o: 130.97, h: 137.08, l: 130.8, c: 136.87 },
            { o: 136.87, h: 143.03, l: 136.77, c: 142.97 },
            { o: 142.97, h: 146.89, l: 142.7, c: 146.71 },
            { o: 146.71, h: 150.24, l: 146.47, c: 149.96 },
            { o: 149.96, h: 150.24, l: 149.61, c: 149.79 },
            { o: 149.79, h: 156.71, l: 149.44, c: 156.46 },
            { o: 156.46, h: 159.87, l: 156.21, c: 159.71 },
            { o: 159.71, h: 159.87, l: 159.37, c: 159.54 },
            { o: 159.54, h: 166.58, l: 159.15, c: 166.21 },
            { o: 166.21, h: 169.2, l: 166.03, c: 168.97 },
            { o: 168.97, h: 169.62, l: 168.3, c: 168.83 },
            { o: 168.83, h: 169.36, l: 168.47, c: 169.05 },
            { o: 169.05, h: 169.18, l: 164.26, c: 164.33 },
            { o: 164.33, h: 164.41, l: 159.58, c: 159.77 },
            { o: 159.77, h: 159.93, l: 154.94, c: 155.05 },
            { o: 155.05, h: 155.22, l: 150.61, c: 150.77 },
            { o: 150.77, h: 150.83, l: 146.23, c: 146.31 },
            { o: 146.31, h: 146.38, l: 140.92, c: 141.05 },
            { o: 141.05, h: 141.2, l: 136.98, c: 137.18 },
            { o: 137.18, h: 137.33, l: 132.32, c: 132.43 },
            { o: 132.43, h: 133.18, l: 130.88, c: 132.93 },
            { o: 132.93, h: 134.69, l: 132.74, c: 134.44 },
            { o: 134.44, h: 136.25, l: 134.07, c: 136.03 },
            { o: 136.03, h: 138.93, l: 135.77, c: 138.48 },
            { o: 138.48, h: 140.16, l: 138.2, c: 139.93 }
          ]
        },
        answer: { from: 4, to: 6 },
        explain: "The small base before the big rally, long ago. It was never revisited until now."
      },
      {
        type: "mcq",
        q: "Are the buyers at an old level the same people as years ago?",
        options: [
          "Yes, they waited",
          "No, it is pure supply and demand: lower prices attract more buyers",
          "Only banks",
          "Nobody buys there"
        ],
        answer: 1,
        explain: "Lower prices attract more buyers, higher prices attract more sellers."
      },
      {
        type: "mcq",
        q: "After a quick $2 gain, what does Seiden suggest?",
        options: [
          "Add more size",
          "Move the stop to breakeven and take some near the next supply",
          "Remove the stop",
          "Close and reverse"
        ],
        answer: 1,
        explain: "Protect the trade and use the nearby supply for profits."
      }
    ],
    practice: [
      {
        prompt: "Draw the old demand zone that price is crashing back toward. Use Seiden's rule: enclose the base, highest body on top, lowest wick at the bottom.",
        scene: {
          candles: [
            { o: 140, h: 140.39, l: 138.14, c: 138.27 },
            { o: 138.27, h: 138.56, l: 135.27, c: 135.67 },
            { o: 135.67, h: 135.83, l: 132.75, c: 132.89 },
            { o: 132.89, h: 133.28, l: 130.56, c: 131 },
            { o: 131, h: 131.36, l: 130.4, c: 130.79 },
            { o: 130.79, h: 132.08, l: 130.18, c: 131.43 },
            { o: 131.43, h: 131.86, l: 130.65, c: 131.08 },
            { o: 131.08, h: 137.31, l: 131, c: 137.18 },
            { o: 137.18, h: 143.22, l: 137.02, c: 143.08 },
            { o: 143.08, h: 147.13, l: 142.74, c: 146.82 },
            { o: 146.82, h: 150.29, l: 146.66, c: 150.07 },
            { o: 150.07, h: 150.35, l: 149.59, c: 149.91 },
            { o: 149.91, h: 156.77, l: 149.54, c: 156.57 },
            { o: 156.57, h: 160.2, l: 156.41, c: 159.82 },
            { o: 159.82, h: 160.18, l: 159.26, c: 159.66 },
            { o: 159.66, h: 166.71, l: 159.42, c: 166.32 },
            { o: 166.32, h: 169.44, l: 165.99, c: 169.08 },
            { o: 169.08, h: 169.52, l: 167.7, c: 168.12 },
            { o: 168.12, h: 169.44, l: 167.59, c: 169.04 },
            { o: 169.04, h: 169.13, l: 164.7, c: 164.8 },
            { o: 164.8, h: 165.01, l: 159.18, c: 159.23 },
            { o: 159.23, h: 159.31, l: 154.87, c: 155.04 },
            { o: 155.04, h: 155.13, l: 150.09, c: 150.19 },
            { o: 150.19, h: 150.37, l: 145.51, c: 145.71 },
            { o: 145.71, h: 145.89, l: 140.57, c: 140.78 },
            { o: 140.78, h: 140.96, l: 136.48, c: 136.57 },
            { o: 136.57, h: 136.71, l: 131.84, c: 131.93 },
            { o: 131.93, h: 132.68, l: 130.81, c: 132.43 },
            { o: 132.43, h: 134.28, l: 132.01, c: 133.96 },
            { o: 133.96, h: 136.28, l: 133.57, c: 135.85 },
            { o: 135.85, h: 137.97, l: 135.71, c: 137.64 },
            { o: 137.64, h: 139.77, l: 137.4, c: 139.43 }
          ],
          reveal: 22
        },
        task: "draw-zone",
        answer: { top: 131.43, bottom: 130.18 },
        explain: "The zone wraps the small base before the big rally: top at the highest basing body, bottom at the lowest basing wick. Price reacted from it on the return."
      }
    ],
    cards: [
      { front: "Three states of a market?", back: "Demand > supply, supply > demand, equilibrium." },
      { front: "Opportunity at equilibrium?", back: "Little to none." },
      {
        front: "Why are old levels often better?",
        back: "Price returning to them is far from equilibrium: big profit margin."
      },
      {
        front: "Supply/demand curve picture?",
        back: "A chart with time removed: willing buyers and sellers at each price."
      },
      { front: "After a solid move in your favour?", back: "Stop to breakeven, partials at the next supply." }
    ],
    mnemonic: "Stretch and Snap: the further from balance, the harder the snap back."
  },
  {
    mentor: "seiden",
    n: 49,
    eli5: {
      oneLiner: "Find the novice trader making a mistake, and take the other side.",
      story: "On the trading floor, an older trader showed young Sam a newer trader begging to buy after a long rise. The old pro sold to him, and minutes later the market fell. Novices make two mistakes: they buy after buying (late), and they buy into supply. Find that person on the chart and do the opposite.",
      analogy: "Like a game of musical chairs: the novice runs for a chair after the music has already stopped."
    },
    bigIdeas: [
      "Mistake 1: buying after a period of buying (or selling after selling).",
      "Mistake 2: buying into supply (or selling into demand).",
      "Confirmation variant: enter beyond the body of the reaction candle at the level."
    ],
    steps: [
      {
        title: "A: balance",
        narration: "Price moves sideways. Books call it a range; really supply and demand were roughly in balance.",
        scene: {
          candles: [
            { o: 158, h: 158.73, l: 157.79, c: 158.43 },
            { o: 158.43, h: 158.54, l: 156.89, c: 157.1 },
            { o: 157.1, h: 158.51, l: 156.98, c: 158.33 },
            { o: 158.33, h: 158.47, l: 157.15, c: 157.28 },
            { o: 157.28, h: 158.51, l: 157.17, c: 158.27 },
            { o: 158.27, h: 158.47, l: 156.95, c: 157.21 },
            { o: 157.21, h: 158.56, l: 156.96, c: 158.41 },
            { o: 158.41, h: 158.59, l: 157, c: 157.25 },
            { o: 157.25, h: 157.44, l: 151.74, c: 151.89 },
            { o: 151.89, h: 152.21, l: 150.98, c: 151.12 },
            { o: 151.12, h: 151.53, l: 150.18, c: 150.39 },
            { o: 150.39, h: 153.71, l: 150.19, c: 153.66 },
            { o: 153.66, h: 156.56, l: 153.5, c: 156.49 },
            { o: 156.49, h: 157.19, l: 155.09, c: 155.29 },
            { o: 155.29, h: 155.46, l: 153.58, c: 153.69 },
            { o: 153.69, h: 154.01, l: 151.66, c: 151.94 },
            { o: 151.94, h: 152.12, l: 150.53, c: 150.9 },
            { o: 150.9, h: 151.22, l: 149.02, c: 149.23 },
            { o: 149.23, h: 149.47, l: 147.52, c: 147.69 }
          ],
          highlight: { from: 0, to: 7, label: "A: range" },
          reveal: 8
        }
      },
      {
        title: "B: the break",
        narration: "A long red candle closes below the range. It can only do that because there was too much supply at A. Selling now would be late. The broken range low becomes supply.",
        scene: {
          candles: [
            { o: 158, h: 158.73, l: 157.79, c: 158.43 },
            { o: 158.43, h: 158.54, l: 156.89, c: 157.1 },
            { o: 157.1, h: 158.51, l: 156.98, c: 158.33 },
            { o: 158.33, h: 158.47, l: 157.15, c: 157.28 },
            { o: 157.28, h: 158.51, l: 157.17, c: 158.27 },
            { o: 158.27, h: 158.47, l: 156.95, c: 157.21 },
            { o: 157.21, h: 158.56, l: 156.96, c: 158.41 },
            { o: 158.41, h: 158.59, l: 157, c: 157.25 },
            { o: 157.25, h: 157.44, l: 151.74, c: 151.89 },
            { o: 151.89, h: 152.21, l: 150.98, c: 151.12 },
            { o: 151.12, h: 151.53, l: 150.18, c: 150.39 },
            { o: 150.39, h: 153.71, l: 150.19, c: 153.66 },
            { o: 153.66, h: 156.56, l: 153.5, c: 156.49 },
            { o: 156.49, h: 157.19, l: 155.09, c: 155.29 },
            { o: 155.29, h: 155.46, l: 153.58, c: 153.69 },
            { o: 153.69, h: 154.01, l: 151.66, c: 151.94 },
            { o: 151.94, h: 152.12, l: 150.53, c: 150.9 },
            { o: 150.9, h: 151.22, l: 149.02, c: 149.23 },
            { o: 149.23, h: 149.47, l: 147.52, c: 147.69 }
          ],
          lines: [
            { y: 156.89, label: "Broken range low = supply", kind: "level" }
          ],
          highlight: { from: 8, to: 8, label: "B" },
          reveal: 9
        }
      },
      {
        title: "C: the novice buyers",
        narration: "Tall green candles rally back to the line on above-average volume. These buyers buy after a rally, into supply, in a falling market. That is the novice.",
        scene: {
          candles: [
            { o: 158, h: 158.73, l: 157.79, c: 158.43 },
            { o: 158.43, h: 158.54, l: 156.89, c: 157.1 },
            { o: 157.1, h: 158.51, l: 156.98, c: 158.33 },
            { o: 158.33, h: 158.47, l: 157.15, c: 157.28 },
            { o: 157.28, h: 158.51, l: 157.17, c: 158.27 },
            { o: 158.27, h: 158.47, l: 156.95, c: 157.21 },
            { o: 157.21, h: 158.56, l: 156.96, c: 158.41 },
            { o: 158.41, h: 158.59, l: 157, c: 157.25 },
            { o: 157.25, h: 157.44, l: 151.74, c: 151.89 },
            { o: 151.89, h: 152.21, l: 150.98, c: 151.12 },
            { o: 151.12, h: 151.53, l: 150.18, c: 150.39 },
            { o: 150.39, h: 153.71, l: 150.19, c: 153.66 },
            { o: 153.66, h: 156.56, l: 153.5, c: 156.49 },
            { o: 156.49, h: 157.19, l: 155.09, c: 155.29 },
            { o: 155.29, h: 155.46, l: 153.58, c: 153.69 },
            { o: 153.69, h: 154.01, l: 151.66, c: 151.94 },
            { o: 151.94, h: 152.12, l: 150.53, c: 150.9 },
            { o: 150.9, h: 151.22, l: 149.02, c: 149.23 },
            { o: 149.23, h: 149.47, l: 147.52, c: 147.69 }
          ],
          lines: [
            { y: 156.89, label: "Broken range low = supply", kind: "level" }
          ],
          highlight: { from: 11, to: 12, label: "C: novice buying" },
          reveal: 13
        }
      },
      {
        title: "D and E: confirm and enter",
        narration: "Candle D reacts at the line and closes lower; that close is the confirmation. Enter on E, below the low of D's body, with the stop above C. Price slides away.",
        scene: {
          candles: [
            { o: 158, h: 158.73, l: 157.79, c: 158.43 },
            { o: 158.43, h: 158.54, l: 156.89, c: 157.1 },
            { o: 157.1, h: 158.51, l: 156.98, c: 158.33 },
            { o: 158.33, h: 158.47, l: 157.15, c: 157.28 },
            { o: 157.28, h: 158.51, l: 157.17, c: 158.27 },
            { o: 158.27, h: 158.47, l: 156.95, c: 157.21 },
            { o: 157.21, h: 158.56, l: 156.96, c: 158.41 },
            { o: 158.41, h: 158.59, l: 157, c: 157.25 },
            { o: 157.25, h: 157.44, l: 151.74, c: 151.89 },
            { o: 151.89, h: 152.21, l: 150.98, c: 151.12 },
            { o: 151.12, h: 151.53, l: 150.18, c: 150.39 },
            { o: 150.39, h: 153.71, l: 150.19, c: 153.66 },
            { o: 153.66, h: 156.56, l: 153.5, c: 156.49 },
            { o: 156.49, h: 157.19, l: 155.09, c: 155.29 },
            { o: 155.29, h: 155.46, l: 153.58, c: 153.69 },
            { o: 153.69, h: 154.01, l: 151.66, c: 151.94 },
            { o: 151.94, h: 152.12, l: 150.53, c: 150.9 },
            { o: 150.9, h: 151.22, l: 149.02, c: 149.23 },
            { o: 149.23, h: 149.47, l: 147.52, c: 147.69 }
          ],
          lines: [
            { y: 156.89, label: "Broken range low = supply", kind: "level" },
            { y: 155.29, label: "Short below D body", kind: "entry", from: 13 }
          ],
          notes: [
            { x: 13, y: 158.59, text: "D" },
            { x: 14, y: 152.18, text: "E" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put the A-to-E walk-through in order.",
        items: [
          "A: range (balance)",
          "B: candle closes below the range",
          "C: rally back on high volume",
          "D: reaction candle closes at the line",
          "E: short below D's body"
        ],
        explain: "Balance, break, novice rally, confirmation, entry."
      },
      {
        type: "spot",
        q: "Click the novice buyers (C).",
        scene: {
          candles: [
            { o: 158, h: 158.73, l: 157.79, c: 158.43 },
            { o: 158.43, h: 158.54, l: 156.89, c: 157.1 },
            { o: 157.1, h: 158.51, l: 156.98, c: 158.33 },
            { o: 158.33, h: 158.47, l: 157.15, c: 157.28 },
            { o: 157.28, h: 158.51, l: 157.17, c: 158.27 },
            { o: 158.27, h: 158.47, l: 156.95, c: 157.21 },
            { o: 157.21, h: 158.56, l: 156.96, c: 158.41 },
            { o: 158.41, h: 158.59, l: 157, c: 157.25 },
            { o: 157.25, h: 157.44, l: 151.74, c: 151.89 },
            { o: 151.89, h: 152.21, l: 150.98, c: 151.12 },
            { o: 151.12, h: 151.53, l: 150.18, c: 150.39 },
            { o: 150.39, h: 153.71, l: 150.19, c: 153.66 },
            { o: 153.66, h: 156.56, l: 153.5, c: 156.49 },
            { o: 156.49, h: 157.19, l: 155.09, c: 155.29 },
            { o: 155.29, h: 155.46, l: 153.58, c: 153.69 },
            { o: 153.69, h: 154.01, l: 151.66, c: 151.94 },
            { o: 151.94, h: 152.12, l: 150.53, c: 150.9 },
            { o: 150.9, h: 151.22, l: 149.02, c: 149.23 },
            { o: 149.23, h: 149.47, l: 147.52, c: 147.69 }
          ]
        },
        answer: { from: 11, to: 12 },
        explain: "C: buying after a rally, into the broken-range supply, in a falling market."
      },
      {
        type: "mcq",
        q: "Which are the two novice mistakes?",
        options: [
          "Using stops and targets",
          "Buying after buying, and buying into supply",
          "Planning and reviewing",
          "Waiting at levels"
        ],
        answer: 1,
        explain: "Late entries after a move, and entries into the opposing level."
      },
      {
        type: "tf",
        q: "Shorting during candle B, while the selling is under way, is the low-risk trade.",
        answer: false,
        explain: "Shorting after the selling is under way is late and high risk. Wait for C to rally into supply."
      },
      {
        type: "mcq",
        q: "What drives most human decisions in markets, says Seiden?",
        options: ["Intellect", "Emotion", "Indicators", "Volume"],
        answer: 1,
        explain: "Emotion, not intellect, which leads to high-risk, low-reward trades."
      }
    ],
    practice: [
      {
        prompt: "A range broke down. Price just rallied back to the broken low with big green candles, and the last candle reacted and closed lower. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 158, h: 158.69, l: 157.9, c: 158.42 },
            { o: 158.42, h: 158.59, l: 157.19, c: 157.37 },
            { o: 157.37, h: 158.86, l: 157.15, c: 158.59 },
            { o: 158.59, h: 158.8, l: 157.04, c: 157.21 },
            { o: 157.21, h: 158.49, l: 156.92, c: 158.32 },
            { o: 158.32, h: 158.56, l: 157.2, c: 157.34 },
            { o: 157.34, h: 158.77, l: 157.06, c: 158.55 },
            { o: 158.55, h: 158.72, l: 157.02, c: 157.22 },
            { o: 157.22, h: 157.29, l: 151.84, c: 151.92 },
            { o: 151.92, h: 152.33, l: 150.75, c: 151.16 },
            { o: 151.16, h: 151.43, l: 150.27, c: 150.42 },
            { o: 150.42, h: 153.74, l: 150.22, c: 153.58 },
            { o: 153.58, h: 156.62, l: 153.47, c: 156.52 },
            { o: 156.52, h: 157.22, l: 155.12, c: 155.32 },
            { o: 155.32, h: 155.4, l: 153.5, c: 153.72 },
            { o: 153.72, h: 154.03, l: 151.64, c: 151.96 },
            { o: 151.96, h: 152.2, l: 150.46, c: 150.86 },
            { o: 150.86, h: 151.24, l: 149.29, c: 149.53 },
            { o: 149.53, h: 149.85, l: 147.54, c: 147.72 }
          ],
          lines: [
            { y: 156.92, label: "Broken range low", kind: "level" }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: { side: "sell", sl: 157.52, tp: 152.92 },
        explain: "The rally buyers made both mistakes. Sell below the reaction candle's body, stop above the rally high. Price dropped."
      }
    ],
    cards: [
      { front: "Whose side do you take?", back: "The opposite side of the novice trader." },
      { front: "Novice mistake 1?", back: "Buying after a period of buying (selling after selling)." },
      { front: "Novice mistake 2?", back: "Buying into supply (selling into demand)." },
      { front: "After a range breaks down, the old low becomes?", back: "Supply." },
      { front: "Confirmation entry here?", back: "Beyond the body low of the reaction candle at the level." },
      { front: "What makes the novice even more wrong?", back: "Trading against the bigger trend." }
    ],
    mnemonic: "Late and Into: the novice is late and buys into supply. Be early and opposite."
  },
  {
    mentor: "seiden",
    n: 54,
    eli5: {
      oneLiner: "Sell to the buyer who chases a huge run into the old highs.",
      story: "A stock flew up more than $8 in one morning, straight into the highs of the days before. Anyone buying there was buying after a huge rise and right at resistance. A student bought put options to take the other side, cheap when they were about to get expensive. He sold them the next day at the old low, where a double bottom formed.",
      analogy: "It is like buying an umbrella on a sunny day when it is cheap, and selling it when it starts to rain."
    },
    bigIdeas: [
      "Sell to buyers after a large advance at resistance; buy from sellers after a decline at support.",
      "The prior days' highs and lows act as supply and demand.",
      "The low-risk entry is the lesson, not the size of the profit."
    ],
    steps: [
      {
        title: "Prior highs and lows",
        narration: "Mark the prior days' high (resistance) and low (support).",
        scene: {
          candles: [
            { o: 152, h: 154.85, l: 151.71, c: 154.45 },
            { o: 154.45, h: 158.91, l: 154.24, c: 158.49 },
            { o: 158.49, h: 161.47, l: 158.33, c: 161.32 },
            { o: 161.32, h: 164.24, l: 161, c: 164 },
            { o: 164, h: 164.3, l: 161.31, c: 161.58 },
            { o: 161.58, h: 161.78, l: 158.98, c: 159.3 },
            { o: 159.3, h: 159.48, l: 155.84, c: 156.06 },
            { o: 156.06, h: 156.26, l: 153.34, c: 153.5 },
            { o: 153.5, h: 153.8, l: 150.61, c: 151 },
            { o: 151, h: 153.55, l: 150.84, c: 153.44 },
            { o: 153.44, h: 156.27, l: 153.32, c: 156.07 },
            { o: 156.07, h: 158.89, l: 155.89, c: 158.7 },
            { o: 158.7, h: 161.55, l: 158.62, c: 161.41 },
            { o: 161.41, h: 163.84, l: 161.23, c: 163.74 },
            { o: 163.74, h: 164.29, l: 162.14, c: 162.34 },
            { o: 162.34, h: 162.77, l: 160.29, c: 160.65 },
            { o: 160.65, h: 160.9, l: 157.58, c: 157.76 },
            { o: 157.76, h: 158.1, l: 155, c: 155.37 },
            { o: 155.37, h: 155.67, l: 153.65, c: 153.95 },
            { o: 153.95, h: 154.28, l: 150.88, c: 151.21 },
            { o: 151.21, h: 153.12, l: 150.82, c: 152.8 },
            { o: 152.8, h: 154.01, l: 152.53, c: 153.74 },
            { o: 153.74, h: 155.37, l: 153.39, c: 155.21 }
          ],
          lines: [
            { y: 164.24, label: "Prior high = supply", kind: "level" },
            { y: 150.61, label: "Prior low = demand", kind: "level" }
          ],
          reveal: 9
        }
      },
      {
        title: "The big run",
        narration: "Price runs up hard into the prior highs. The buyer here is buying after a large move up and at resistance: a novice. A possible double top is forming.",
        scene: {
          candles: [
            { o: 152, h: 154.85, l: 151.71, c: 154.45 },
            { o: 154.45, h: 158.91, l: 154.24, c: 158.49 },
            { o: 158.49, h: 161.47, l: 158.33, c: 161.32 },
            { o: 161.32, h: 164.24, l: 161, c: 164 },
            { o: 164, h: 164.3, l: 161.31, c: 161.58 },
            { o: 161.58, h: 161.78, l: 158.98, c: 159.3 },
            { o: 159.3, h: 159.48, l: 155.84, c: 156.06 },
            { o: 156.06, h: 156.26, l: 153.34, c: 153.5 },
            { o: 153.5, h: 153.8, l: 150.61, c: 151 },
            { o: 151, h: 153.55, l: 150.84, c: 153.44 },
            { o: 153.44, h: 156.27, l: 153.32, c: 156.07 },
            { o: 156.07, h: 158.89, l: 155.89, c: 158.7 },
            { o: 158.7, h: 161.55, l: 158.62, c: 161.41 },
            { o: 161.41, h: 163.84, l: 161.23, c: 163.74 },
            { o: 163.74, h: 164.29, l: 162.14, c: 162.34 },
            { o: 162.34, h: 162.77, l: 160.29, c: 160.65 },
            { o: 160.65, h: 160.9, l: 157.58, c: 157.76 },
            { o: 157.76, h: 158.1, l: 155, c: 155.37 },
            { o: 155.37, h: 155.67, l: 153.65, c: 153.95 },
            { o: 153.95, h: 154.28, l: 150.88, c: 151.21 },
            { o: 151.21, h: 153.12, l: 150.82, c: 152.8 },
            { o: 152.8, h: 154.01, l: 152.53, c: 153.74 },
            { o: 153.74, h: 155.37, l: 153.39, c: 155.21 }
          ],
          lines: [
            { y: 164.24, label: "Prior high = supply", kind: "level" },
            { y: 150.61, label: "Prior low = demand", kind: "level" }
          ],
          highlight: { from: 9, to: 13, label: "buying after a big run" },
          reveal: 14
        }
      },
      {
        title: "Take the other side",
        narration: "The student bought puts at the second top. Risk stays small: if price kept going up, the loss would be limited.",
        scene: {
          candles: [
            { o: 152, h: 154.85, l: 151.71, c: 154.45 },
            { o: 154.45, h: 158.91, l: 154.24, c: 158.49 },
            { o: 158.49, h: 161.47, l: 158.33, c: 161.32 },
            { o: 161.32, h: 164.24, l: 161, c: 164 },
            { o: 164, h: 164.3, l: 161.31, c: 161.58 },
            { o: 161.58, h: 161.78, l: 158.98, c: 159.3 },
            { o: 159.3, h: 159.48, l: 155.84, c: 156.06 },
            { o: 156.06, h: 156.26, l: 153.34, c: 153.5 },
            { o: 153.5, h: 153.8, l: 150.61, c: 151 },
            { o: 151, h: 153.55, l: 150.84, c: 153.44 },
            { o: 153.44, h: 156.27, l: 153.32, c: 156.07 },
            { o: 156.07, h: 158.89, l: 155.89, c: 158.7 },
            { o: 158.7, h: 161.55, l: 158.62, c: 161.41 },
            { o: 161.41, h: 163.84, l: 161.23, c: 163.74 },
            { o: 163.74, h: 164.29, l: 162.14, c: 162.34 },
            { o: 162.34, h: 162.77, l: 160.29, c: 160.65 },
            { o: 160.65, h: 160.9, l: 157.58, c: 157.76 },
            { o: 157.76, h: 158.1, l: 155, c: 155.37 },
            { o: 155.37, h: 155.67, l: 153.65, c: 153.95 },
            { o: 153.95, h: 154.28, l: 150.88, c: 151.21 },
            { o: 151.21, h: 153.12, l: 150.82, c: 152.8 },
            { o: 152.8, h: 154.01, l: 152.53, c: 153.74 },
            { o: 153.74, h: 155.37, l: 153.39, c: 155.21 }
          ],
          lines: [
            { y: 164.24, label: "Prior high = supply", kind: "level" },
            { y: 150.61, label: "Prior low = demand", kind: "level" }
          ],
          notes: [
            { x: 14, y: 165.69, text: "Double top: sell / buy puts" }
          ],
          reveal: 15
        }
      },
      {
        title: "Exit at the opposing level",
        narration: "Price falls back to the prior low, where a double bottom forms. That was the planned target, so he takes profit.",
        scene: {
          candles: [
            { o: 152, h: 154.85, l: 151.71, c: 154.45 },
            { o: 154.45, h: 158.91, l: 154.24, c: 158.49 },
            { o: 158.49, h: 161.47, l: 158.33, c: 161.32 },
            { o: 161.32, h: 164.24, l: 161, c: 164 },
            { o: 164, h: 164.3, l: 161.31, c: 161.58 },
            { o: 161.58, h: 161.78, l: 158.98, c: 159.3 },
            { o: 159.3, h: 159.48, l: 155.84, c: 156.06 },
            { o: 156.06, h: 156.26, l: 153.34, c: 153.5 },
            { o: 153.5, h: 153.8, l: 150.61, c: 151 },
            { o: 151, h: 153.55, l: 150.84, c: 153.44 },
            { o: 153.44, h: 156.27, l: 153.32, c: 156.07 },
            { o: 156.07, h: 158.89, l: 155.89, c: 158.7 },
            { o: 158.7, h: 161.55, l: 158.62, c: 161.41 },
            { o: 161.41, h: 163.84, l: 161.23, c: 163.74 },
            { o: 163.74, h: 164.29, l: 162.14, c: 162.34 },
            { o: 162.34, h: 162.77, l: 160.29, c: 160.65 },
            { o: 160.65, h: 160.9, l: 157.58, c: 157.76 },
            { o: 157.76, h: 158.1, l: 155, c: 155.37 },
            { o: 155.37, h: 155.67, l: 153.65, c: 153.95 },
            { o: 153.95, h: 154.28, l: 150.88, c: 151.21 },
            { o: 151.21, h: 153.12, l: 150.82, c: 152.8 },
            { o: 152.8, h: 154.01, l: 152.53, c: 153.74 },
            { o: 153.74, h: 155.37, l: 153.39, c: 155.21 }
          ],
          lines: [
            { y: 164.24, label: "Prior high = supply", kind: "level" },
            { y: 150.61, label: "Prior low = demand", kind: "level" }
          ],
          notes: [
            { x: 14, y: 165.69, text: "Double top: sell / buy puts" },
            { x: 19, y: 149.48, text: "Double bottom: exit" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "The student's big gain is the main lesson of this trade.",
        answer: false,
        explain: "Seiden stresses the low-risk entry. The gain was only enjoyable because the risk was small."
      },
      {
        type: "spot",
        q: "Click the candle where the student took the other side of the novice.",
        scene: {
          candles: [
            { o: 152, h: 154.85, l: 151.71, c: 154.45 },
            { o: 154.45, h: 158.91, l: 154.24, c: 158.49 },
            { o: 158.49, h: 161.47, l: 158.33, c: 161.32 },
            { o: 161.32, h: 164.24, l: 161, c: 164 },
            { o: 164, h: 164.3, l: 161.31, c: 161.58 },
            { o: 161.58, h: 161.78, l: 158.98, c: 159.3 },
            { o: 159.3, h: 159.48, l: 155.84, c: 156.06 },
            { o: 156.06, h: 156.26, l: 153.34, c: 153.5 },
            { o: 153.5, h: 153.8, l: 150.61, c: 151 },
            { o: 151, h: 153.55, l: 150.84, c: 153.44 },
            { o: 153.44, h: 156.27, l: 153.32, c: 156.07 },
            { o: 156.07, h: 158.89, l: 155.89, c: 158.7 },
            { o: 158.7, h: 161.55, l: 158.62, c: 161.41 },
            { o: 161.41, h: 163.84, l: 161.23, c: 163.74 },
            { o: 163.74, h: 164.29, l: 162.14, c: 162.34 },
            { o: 162.34, h: 162.77, l: 160.29, c: 160.65 },
            { o: 160.65, h: 160.9, l: 157.58, c: 157.76 },
            { o: 157.76, h: 158.1, l: 155, c: 155.37 },
            { o: 155.37, h: 155.67, l: 153.65, c: 153.95 },
            { o: 153.95, h: 154.28, l: 150.88, c: 151.21 },
            { o: 151.21, h: 153.12, l: 150.82, c: 152.8 },
            { o: 152.8, h: 154.01, l: 152.53, c: 153.74 },
            { o: 153.74, h: 155.37, l: 153.39, c: 155.21 }
          ],
          lines: [
            { y: 164.24, label: "Prior high", kind: "level" }
          ]
        },
        answer: { from: 14, to: 14 },
        explain: "The second top at the prior highs, after the huge run up."
      },
      {
        type: "mcq",
        q: "On intraday charts, what can act as supply?",
        options: ["The prior days' highs", "The open price only", "A random line", "The moving average"],
        answer: 0,
        explain: "The prior days' highs act as resistance (supply) for intraday trades."
      },
      {
        type: "mcq",
        q: "Where was the target?",
        options: [
          "Anywhere he felt good",
          "The opposing level: the prior low",
          "Double the entry",
          "No target"
        ],
        answer: 1,
        explain: "He sold the puts at the prior low (demand), where a double bottom formed."
      },
      {
        type: "mcq",
        q: "Why is applying easy rules so hard?",
        options: ["The rules are secret", "Emotion", "Charts are wrong", "Brokers"],
        answer: 1,
        explain: "Learning the rules is easy; emotion makes applying them one of the hardest things you will do."
      }
    ],
    practice: [
      {
        prompt: "Price ran up a long way in one morning straight into the prior days' high, and just printed a rejection there. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 152, h: 155.78, l: 151.78, c: 155.48 },
            { o: 155.48, h: 158.82, l: 155.24, c: 158.65 },
            { o: 158.65, h: 161.96, l: 158.22, c: 161.72 },
            { o: 161.72, h: 164.21, l: 161.52, c: 164 },
            { o: 164, h: 164.14, l: 160.83, c: 160.98 },
            { o: 160.98, h: 161.31, l: 158.9, c: 159.02 },
            { o: 159.02, h: 159.25, l: 155.98, c: 156.16 },
            { o: 156.16, h: 156.4, l: 153.95, c: 154.12 },
            { o: 154.12, h: 154.44, l: 150.69, c: 151 },
            { o: 151, h: 153.53, l: 150.78, c: 153.35 },
            { o: 153.35, h: 156.19, l: 153.2, c: 155.99 },
            { o: 155.99, h: 158.82, l: 155.93, c: 158.73 },
            { o: 158.73, h: 161.28, l: 158.59, c: 161.23 },
            { o: 161.23, h: 163.85, l: 161.01, c: 163.71 },
            { o: 163.71, h: 164.26, l: 162.11, c: 162.31 },
            { o: 162.31, h: 162.64, l: 159.42, c: 159.65 },
            { o: 159.65, h: 160.05, l: 157.98, c: 158.17 },
            { o: 158.17, h: 158.51, l: 154.95, c: 155.18 },
            { o: 155.18, h: 155.53, l: 153.63, c: 153.8 },
            { o: 153.8, h: 154.13, l: 150.84, c: 151.29 },
            { o: 151.29, h: 153.1, l: 150.98, c: 152.83 },
            { o: 152.83, h: 154.17, l: 152.44, c: 153.73 },
            { o: 153.73, h: 155.61, l: 153.55, c: 155.29 }
          ],
          lines: [
            { y: 164.21, label: "Prior high", kind: "level" },
            { y: 150.69, label: "Prior low", kind: "level" }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: { side: "sell", sl: 164.71, tp: 151.69 },
        explain: "The buyer is buying after a large advance and at resistance. Sell to him with a stop above the high and target the prior low."
      }
    ],
    cards: [
      { front: "Buyer after a big run into resistance is?", back: "A novice: sell to him." },
      { front: "Seller after a decline at support is?", back: "A novice: buy from him." },
      { front: "Prior days' highs on intraday charts?", back: "Supply (resistance)." },
      { front: "Target for the RIMM puts?", back: "The prior low, where a double bottom formed." },
      {
        front: "Should you trade your account in class?",
        back: "Only when risk is low, reward high and odds in your favour."
      }
    ],
    mnemonic: "Umbrella on a sunny day: buy the put when the run is hot and puts are cheap."
  },
  {
    mentor: "seiden",
    n: 56,
    eli5: {
      oneLiner: "A chart pattern only works if there is room before the next level.",
      story: "Triangles, flags and head-and-shoulders all use a breakout entry. Whether they win depends on what waits at the prices price breaks into. If the next support is far below, the breakout has room to run. If support sits just under the break, even a perfect-looking pattern is a poor trade.",
      analogy: "Like kicking a ball toward a wall: a great kick still goes nowhere if the wall is one step away."
    },
    bigIdeas: [
      "Every common pattern uses a breakout; the outcome depends 100% on the supply and demand it breaks into.",
      "Measure the room to the next opposing level before you press the button.",
      "Do not chase a missed breakout fill. There is always another trade."
    ],
    steps: [
      {
        title: "A descending triangle",
        narration: "Price makes lower highs against a flat bottom. Classic books call this a short when the bottom line breaks.",
        scene: {
          candles: [
            { o: 141, h: 141.18, l: 140.14, c: 140.27 },
            { o: 140.27, h: 140.51, l: 139.45, c: 139.58 },
            { o: 139.58, h: 139.85, l: 138.64, c: 139 },
            { o: 139, h: 139.41, l: 138.13, c: 138.75 },
            { o: 138.75, h: 139.82, l: 138.22, c: 139.13 },
            { o: 139.13, h: 139.71, l: 138.54, c: 139.1 },
            { o: 139.1, h: 149.29, l: 138.89, c: 149.18 },
            { o: 149.18, h: 159.1, l: 149.06, c: 159 },
            { o: 159, h: 159.14, l: 155.17, c: 155.47 },
            { o: 155.47, h: 155.63, l: 150.13, c: 150.3 },
            { o: 150.3, h: 157.37, l: 149.9, c: 157 },
            { o: 157, h: 157.25, l: 154.21, c: 154.36 },
            { o: 154.36, h: 154.59, l: 150.16, c: 150.3 },
            { o: 150.3, h: 155.42, l: 149.94, c: 155 },
            { o: 155, h: 155.31, l: 153.02, c: 153.22 },
            { o: 153.22, h: 153.36, l: 150.17, c: 150.3 },
            { o: 150.3, h: 153.8, l: 150.05, c: 153.5 },
            { o: 153.5, h: 153.65, l: 151.75, c: 152.13 },
            { o: 152.13, h: 152.44, l: 150.02, c: 150.3 },
            { o: 150.3, h: 152.23, l: 149.97, c: 152 },
            { o: 152, h: 152.4, l: 150.23, c: 150.4 },
            { o: 150.4, h: 150.6, l: 148.7, c: 148.9 },
            { o: 148.9, h: 149.32, l: 147.02, c: 147.24 },
            { o: 147.24, h: 147.49, l: 144.96, c: 145.18 },
            { o: 145.18, h: 145.36, l: 143.27, c: 143.48 },
            { o: 143.48, h: 143.81, l: 141.23, c: 141.56 },
            { o: 141.56, h: 141.71, l: 139.23, c: 139.53 },
            { o: 139.53, h: 140.38, l: 138.73, c: 140.13 },
            { o: 140.13, h: 141.61, l: 139.88, c: 141.29 },
            { o: 141.29, h: 142.49, l: 141.08, c: 142.13 }
          ],
          lines: [
            { y: 150, label: "Flat bottom", kind: "level" }
          ],
          trendlines: [
            { x1: 7, y1: 159.1, x2: 19, y2: 152.23, label: "falling tops" }
          ],
          reveal: 21
        }
      },
      {
        title: "Where is the next demand?",
        narration: "Before shorting, look left for the next demand below. Here it is the base far below, where the earlier rally started.",
        scene: {
          candles: [
            { o: 141, h: 141.18, l: 140.14, c: 140.27 },
            { o: 140.27, h: 140.51, l: 139.45, c: 139.58 },
            { o: 139.58, h: 139.85, l: 138.64, c: 139 },
            { o: 139, h: 139.41, l: 138.13, c: 138.75 },
            { o: 138.75, h: 139.82, l: 138.22, c: 139.13 },
            { o: 139.13, h: 139.71, l: 138.54, c: 139.1 },
            { o: 139.1, h: 149.29, l: 138.89, c: 149.18 },
            { o: 149.18, h: 159.1, l: 149.06, c: 159 },
            { o: 159, h: 159.14, l: 155.17, c: 155.47 },
            { o: 155.47, h: 155.63, l: 150.13, c: 150.3 },
            { o: 150.3, h: 157.37, l: 149.9, c: 157 },
            { o: 157, h: 157.25, l: 154.21, c: 154.36 },
            { o: 154.36, h: 154.59, l: 150.16, c: 150.3 },
            { o: 150.3, h: 155.42, l: 149.94, c: 155 },
            { o: 155, h: 155.31, l: 153.02, c: 153.22 },
            { o: 153.22, h: 153.36, l: 150.17, c: 150.3 },
            { o: 150.3, h: 153.8, l: 150.05, c: 153.5 },
            { o: 153.5, h: 153.65, l: 151.75, c: 152.13 },
            { o: 152.13, h: 152.44, l: 150.02, c: 150.3 },
            { o: 150.3, h: 152.23, l: 149.97, c: 152 },
            { o: 152, h: 152.4, l: 150.23, c: 150.4 },
            { o: 150.4, h: 150.6, l: 148.7, c: 148.9 },
            { o: 148.9, h: 149.32, l: 147.02, c: 147.24 },
            { o: 147.24, h: 147.49, l: 144.96, c: 145.18 },
            { o: 145.18, h: 145.36, l: 143.27, c: 143.48 },
            { o: 143.48, h: 143.81, l: 141.23, c: 141.56 },
            { o: 141.56, h: 141.71, l: 139.23, c: 139.53 },
            { o: 139.53, h: 140.38, l: 138.73, c: 140.13 },
            { o: 140.13, h: 141.61, l: 139.88, c: 141.29 },
            { o: 141.29, h: 142.49, l: 141.08, c: 142.13 }
          ],
          zones: [
            { from: 3, top: 139.13, bottom: 138.13, kind: "demand", label: "Next demand (target)" }
          ],
          lines: [
            { y: 150, label: "Flat bottom", kind: "level" }
          ],
          trendlines: [
            { x1: 7, y1: 159.1, x2: 19, y2: 152.23, label: "falling tops" }
          ],
          reveal: 21
        }
      },
      {
        title: "Room = trade",
        narration: "The break comes. From the short entry to that demand is several times the risk to a stop above the last high. The pattern is just the trigger; supply and demand decide.",
        scene: {
          candles: [
            { o: 141, h: 141.18, l: 140.14, c: 140.27 },
            { o: 140.27, h: 140.51, l: 139.45, c: 139.58 },
            { o: 139.58, h: 139.85, l: 138.64, c: 139 },
            { o: 139, h: 139.41, l: 138.13, c: 138.75 },
            { o: 138.75, h: 139.82, l: 138.22, c: 139.13 },
            { o: 139.13, h: 139.71, l: 138.54, c: 139.1 },
            { o: 139.1, h: 149.29, l: 138.89, c: 149.18 },
            { o: 149.18, h: 159.1, l: 149.06, c: 159 },
            { o: 159, h: 159.14, l: 155.17, c: 155.47 },
            { o: 155.47, h: 155.63, l: 150.13, c: 150.3 },
            { o: 150.3, h: 157.37, l: 149.9, c: 157 },
            { o: 157, h: 157.25, l: 154.21, c: 154.36 },
            { o: 154.36, h: 154.59, l: 150.16, c: 150.3 },
            { o: 150.3, h: 155.42, l: 149.94, c: 155 },
            { o: 155, h: 155.31, l: 153.02, c: 153.22 },
            { o: 153.22, h: 153.36, l: 150.17, c: 150.3 },
            { o: 150.3, h: 153.8, l: 150.05, c: 153.5 },
            { o: 153.5, h: 153.65, l: 151.75, c: 152.13 },
            { o: 152.13, h: 152.44, l: 150.02, c: 150.3 },
            { o: 150.3, h: 152.23, l: 149.97, c: 152 },
            { o: 152, h: 152.4, l: 150.23, c: 150.4 },
            { o: 150.4, h: 150.6, l: 148.7, c: 148.9 },
            { o: 148.9, h: 149.32, l: 147.02, c: 147.24 },
            { o: 147.24, h: 147.49, l: 144.96, c: 145.18 },
            { o: 145.18, h: 145.36, l: 143.27, c: 143.48 },
            { o: 143.48, h: 143.81, l: 141.23, c: 141.56 },
            { o: 141.56, h: 141.71, l: 139.23, c: 139.53 },
            { o: 139.53, h: 140.38, l: 138.73, c: 140.13 },
            { o: 140.13, h: 141.61, l: 139.88, c: 141.29 },
            { o: 141.29, h: 142.49, l: 141.08, c: 142.13 }
          ],
          zones: [
            { from: 3, top: 139.13, bottom: 138.13, kind: "demand", label: "Next demand (target)" }
          ],
          lines: [
            { y: 150, label: "Flat bottom", kind: "level" }
          ],
          trendlines: [
            { x1: 7, y1: 159.1, x2: 19, y2: 152.23, label: "falling tops" }
          ],
          highlight: { from: 21, to: 21, label: "short entry" },
          reveal: 22
        }
      },
      {
        title: "Price runs to the target",
        narration: "Price falls all the way to the demand. A good profit margin made this pattern worth taking.",
        scene: {
          candles: [
            { o: 141, h: 141.18, l: 140.14, c: 140.27 },
            { o: 140.27, h: 140.51, l: 139.45, c: 139.58 },
            { o: 139.58, h: 139.85, l: 138.64, c: 139 },
            { o: 139, h: 139.41, l: 138.13, c: 138.75 },
            { o: 138.75, h: 139.82, l: 138.22, c: 139.13 },
            { o: 139.13, h: 139.71, l: 138.54, c: 139.1 },
            { o: 139.1, h: 149.29, l: 138.89, c: 149.18 },
            { o: 149.18, h: 159.1, l: 149.06, c: 159 },
            { o: 159, h: 159.14, l: 155.17, c: 155.47 },
            { o: 155.47, h: 155.63, l: 150.13, c: 150.3 },
            { o: 150.3, h: 157.37, l: 149.9, c: 157 },
            { o: 157, h: 157.25, l: 154.21, c: 154.36 },
            { o: 154.36, h: 154.59, l: 150.16, c: 150.3 },
            { o: 150.3, h: 155.42, l: 149.94, c: 155 },
            { o: 155, h: 155.31, l: 153.02, c: 153.22 },
            { o: 153.22, h: 153.36, l: 150.17, c: 150.3 },
            { o: 150.3, h: 153.8, l: 150.05, c: 153.5 },
            { o: 153.5, h: 153.65, l: 151.75, c: 152.13 },
            { o: 152.13, h: 152.44, l: 150.02, c: 150.3 },
            { o: 150.3, h: 152.23, l: 149.97, c: 152 },
            { o: 152, h: 152.4, l: 150.23, c: 150.4 },
            { o: 150.4, h: 150.6, l: 148.7, c: 148.9 },
            { o: 148.9, h: 149.32, l: 147.02, c: 147.24 },
            { o: 147.24, h: 147.49, l: 144.96, c: 145.18 },
            { o: 145.18, h: 145.36, l: 143.27, c: 143.48 },
            { o: 143.48, h: 143.81, l: 141.23, c: 141.56 },
            { o: 141.56, h: 141.71, l: 139.23, c: 139.53 },
            { o: 139.53, h: 140.38, l: 138.73, c: 140.13 },
            { o: 140.13, h: 141.61, l: 139.88, c: 141.29 },
            { o: 141.29, h: 142.49, l: 141.08, c: 142.13 }
          ],
          zones: [
            { from: 3, top: 139.13, bottom: 138.13, kind: "demand", label: "Next demand (target)" }
          ],
          lines: [
            { y: 150, label: "Flat bottom", kind: "level" }
          ],
          trendlines: [
            { x1: 7, y1: 159.1, x2: 19, y2: 152.23, label: "falling tops" }
          ],
          notes: [
            { x: 27, y: 137.33, text: "Target reached" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What decides whether a pattern breakout wins?",
        options: [
          "How pretty the pattern is",
          "The supply and demand at the price levels it breaks into",
          "The name of the pattern",
          "The time of day only"
        ],
        answer: 1,
        explain: "Seiden: the win or loss depends 100% on the supply/demand at the levels being broken into."
      },
      {
        type: "tf",
        q: "If you miss the breakout fill, chase it so you do not miss the move.",
        answer: false,
        explain: "If you miss the low-risk entry, let it go. There is always another trade."
      },
      {
        type: "spot",
        q: "Click the breakout candle (the short entry trigger).",
        scene: {
          candles: [
            { o: 141, h: 141.18, l: 140.14, c: 140.27 },
            { o: 140.27, h: 140.51, l: 139.45, c: 139.58 },
            { o: 139.58, h: 139.85, l: 138.64, c: 139 },
            { o: 139, h: 139.41, l: 138.13, c: 138.75 },
            { o: 138.75, h: 139.82, l: 138.22, c: 139.13 },
            { o: 139.13, h: 139.71, l: 138.54, c: 139.1 },
            { o: 139.1, h: 149.29, l: 138.89, c: 149.18 },
            { o: 149.18, h: 159.1, l: 149.06, c: 159 },
            { o: 159, h: 159.14, l: 155.17, c: 155.47 },
            { o: 155.47, h: 155.63, l: 150.13, c: 150.3 },
            { o: 150.3, h: 157.37, l: 149.9, c: 157 },
            { o: 157, h: 157.25, l: 154.21, c: 154.36 },
            { o: 154.36, h: 154.59, l: 150.16, c: 150.3 },
            { o: 150.3, h: 155.42, l: 149.94, c: 155 },
            { o: 155, h: 155.31, l: 153.02, c: 153.22 },
            { o: 153.22, h: 153.36, l: 150.17, c: 150.3 },
            { o: 150.3, h: 153.8, l: 150.05, c: 153.5 },
            { o: 153.5, h: 153.65, l: 151.75, c: 152.13 },
            { o: 152.13, h: 152.44, l: 150.02, c: 150.3 },
            { o: 150.3, h: 152.23, l: 149.97, c: 152 },
            { o: 152, h: 152.4, l: 150.23, c: 150.4 },
            { o: 150.4, h: 150.6, l: 148.7, c: 148.9 },
            { o: 148.9, h: 149.32, l: 147.02, c: 147.24 },
            { o: 147.24, h: 147.49, l: 144.96, c: 145.18 },
            { o: 145.18, h: 145.36, l: 143.27, c: 143.48 },
            { o: 143.48, h: 143.81, l: 141.23, c: 141.56 },
            { o: 141.56, h: 141.71, l: 139.23, c: 139.53 },
            { o: 139.53, h: 140.38, l: 138.73, c: 140.13 },
            { o: 140.13, h: 141.61, l: 139.88, c: 141.29 },
            { o: 141.29, h: 142.49, l: 141.08, c: 142.13 }
          ],
          lines: [
            { y: 150, label: "Flat bottom", kind: "level" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "The candle that closes below the flat bottom line. Only take it because there is room to the demand below."
      },
      {
        type: "mcq",
        q: "Which continuation patterns tend to work better?",
        options: [
          "Ones where price spends very little time in the pattern",
          "The longest ones",
          "Ones with the most touches",
          "Any pattern on Friday"
        ],
        answer: 0,
        explain: "The less time price spends in the pattern, typically the better the outcome."
      },
      {
        type: "mcq",
        q: "A triangle breaks down, but demand sits just below the break. What do you do?",
        options: ["Short it anyway", "Skip it: no profit margin", "Buy the breakout", "Double the size"],
        answer: 1,
        explain: "A breakout straight into a nearby opposing level has no room. Skip it."
      }
    ],
    practice: [
      {
        prompt: "A tidy descending triangle is breaking its flat bottom. But a demand zone sits just under the line. Sell, buy or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.35, l: 149.27, c: 149.46 },
            { o: 149.46, h: 149.68, l: 148.66, c: 148.96 },
            { o: 148.96, h: 149.27, l: 148.13, c: 148.5 },
            { o: 148.5, h: 148.81, l: 147.42, c: 147.9 },
            { o: 147.9, h: 149.18, l: 147.56, c: 148.73 },
            { o: 148.73, h: 149.43, l: 147.87, c: 148.46 },
            { o: 148.46, h: 154.59, l: 148.34, c: 154.46 },
            { o: 154.46, h: 159.67, l: 154.29, c: 159.53 },
            { o: 159.53, h: 159.7, l: 154.78, c: 154.98 },
            { o: 154.98, h: 155.25, l: 150.71, c: 150.83 },
            { o: 150.83, h: 157.82, l: 150.63, c: 157.53 },
            { o: 157.53, h: 157.74, l: 154.49, c: 154.84 },
            { o: 154.84, h: 155.01, l: 150.55, c: 150.83 },
            { o: 150.83, h: 155.74, l: 150.6, c: 155.53 },
            { o: 155.53, h: 155.73, l: 153.05, c: 153.31 },
            { o: 153.31, h: 153.56, l: 150.64, c: 150.83 },
            { o: 150.83, h: 154.48, l: 150.54, c: 154.03 },
            { o: 154.03, h: 154.23, l: 152.02, c: 152.32 },
            { o: 152.32, h: 152.7, l: 150.55, c: 150.83 },
            { o: 150.83, h: 152.81, l: 150.56, c: 152.53 },
            { o: 152.53, h: 152.68, l: 150.72, c: 150.93 },
            { o: 150.93, h: 151.13, l: 149.23, c: 149.43 },
            { o: 149.43, h: 149.64, l: 148.83, c: 149.03 },
            { o: 149.03, h: 150.18, l: 148.21, c: 149.93 },
            { o: 149.93, h: 151.54, l: 149.53, c: 151.25 },
            { o: 151.25, h: 153.21, l: 150.88, c: 152.92 },
            { o: 152.92, h: 154.47, l: 152.48, c: 154.33 },
            { o: 154.33, h: 156.26, l: 154.11, c: 155.93 }
          ],
          zones: [
            { from: 3, top: 148.73, bottom: 147.42, kind: "demand", label: "Demand just below" }
          ],
          lines: [
            { y: 150.53, label: "Flat bottom", kind: "level" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The next demand is right under the break, so there is no profit margin. Skip it. Price hit the demand and turned up."
      }
    ],
    cards: [
      { front: "What entry do all common chart patterns use?", back: "A breakout entry." },
      {
        front: "Before taking a pattern breakout?",
        back: "Find the next opposing level and measure the profit margin."
      },
      { front: "Missed the low-risk fill?", back: "Let it go. There is always another trade." },
      { front: "Time in a continuation pattern?", back: "Less time usually means a better outcome." },
      { front: "Pattern breaks right into support?", back: "Skip it." }
    ],
    mnemonic: "Pattern pulls the trigger, room decides the trade."
  },
  {
    mentor: "seiden",
    n: 60,
    eli5: {
      oneLiner: "When price gaps straight into a level at the open, fade the crowd.",
      story: "At the opening bell, a crowd of orders rushes in. If there are 10 buyers and only 5 sellers, price must jump as soon as the 5th seller sells, and that is a gap. A gap up after a rally that opens right inside supply means late buyers are rushing into sellers. Seiden sells to them within minutes, and buys gaps down into demand the same way.",
      analogy: "Like a crowd rushing into a shop at opening time to buy what the shop is about to put on sale."
    },
    bigIdeas: [
      "Gaps happen because orders at the open overwhelm the other side: price opens at an imbalance.",
      "Short a gap up after a rally into supply; buy a gap down after a decline into demand.",
      "If you cannot see the novice in the market, you probably are the novice."
    ],
    steps: [
      {
        title: "Mark levels before the open",
        narration: "Supply A sits at the top base; demand D sits at the base after the drop.",
        scene: {
          candles: [
            { o: 144, h: 146.57, l: 143.69, c: 146.33 },
            { o: 146.33, h: 151.02, l: 146.09, c: 150.65 },
            { o: 150.65, h: 153.1, l: 150.5, c: 152.8 },
            { o: 152.8, h: 156.23, l: 152.59, c: 156 },
            { o: 156, h: 156.59, l: 155.04, c: 155.46 },
            { o: 155.46, h: 156.71, l: 154.98, c: 156.04 },
            { o: 156.04, h: 156.19, l: 151.46, c: 151.6 },
            { o: 151.6, h: 151.77, l: 147.84, c: 148.04 },
            { o: 148.04, h: 148.43, l: 146.65, c: 147.13 },
            { o: 147.13, h: 149.35, l: 146.58, c: 148.9 },
            { o: 148.9, h: 149.25, l: 147.71, c: 148.02 },
            { o: 148.02, h: 150.11, l: 147.83, c: 149.75 },
            { o: 149.75, h: 151.39, l: 149.36, c: 151.08 },
            { o: 151.08, h: 152.88, l: 150.89, c: 152.52 },
            { o: 155.9, h: 156.2, l: 153.6, c: 153.8 },
            { o: 153.8, h: 154.02, l: 152.63, c: 152.87 },
            { o: 152.87, h: 153.19, l: 152.15, c: 152.37 },
            { o: 152.37, h: 152.75, l: 151.16, c: 151.4 },
            { o: 148.09, h: 150.39, l: 147.79, c: 150.19 },
            { o: 150.19, h: 151.2, l: 149.92, c: 151.04 },
            { o: 151.04, h: 152.36, l: 150.6, c: 152.06 },
            { o: 152.06, h: 153.33, l: 151.77, c: 152.96 },
            { o: 155.84, h: 156.14, l: 153.64, c: 153.84 },
            { o: 153.84, h: 153.99, l: 152.04, c: 152.22 },
            { o: 152.22, h: 152.5, l: 150.84, c: 151.25 },
            { o: 151.25, h: 151.7, l: 149.51, c: 149.84 }
          ],
          zones: [
            { from: 4, top: 156.71, bottom: 155.46, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.9, bottom: 146.58, kind: "demand", label: "Demand D" }
          ],
          reveal: 14
        }
      },
      {
        title: "Gap up into supply",
        narration: "After a rally, price gaps up at the open right into supply A. Only a novice buys a gap up, after a rally, into supply. Sell within minutes of the bell.",
        scene: {
          candles: [
            { o: 144, h: 146.57, l: 143.69, c: 146.33 },
            { o: 146.33, h: 151.02, l: 146.09, c: 150.65 },
            { o: 150.65, h: 153.1, l: 150.5, c: 152.8 },
            { o: 152.8, h: 156.23, l: 152.59, c: 156 },
            { o: 156, h: 156.59, l: 155.04, c: 155.46 },
            { o: 155.46, h: 156.71, l: 154.98, c: 156.04 },
            { o: 156.04, h: 156.19, l: 151.46, c: 151.6 },
            { o: 151.6, h: 151.77, l: 147.84, c: 148.04 },
            { o: 148.04, h: 148.43, l: 146.65, c: 147.13 },
            { o: 147.13, h: 149.35, l: 146.58, c: 148.9 },
            { o: 148.9, h: 149.25, l: 147.71, c: 148.02 },
            { o: 148.02, h: 150.11, l: 147.83, c: 149.75 },
            { o: 149.75, h: 151.39, l: 149.36, c: 151.08 },
            { o: 151.08, h: 152.88, l: 150.89, c: 152.52 },
            { o: 155.9, h: 156.2, l: 153.6, c: 153.8 },
            { o: 153.8, h: 154.02, l: 152.63, c: 152.87 },
            { o: 152.87, h: 153.19, l: 152.15, c: 152.37 },
            { o: 152.37, h: 152.75, l: 151.16, c: 151.4 },
            { o: 148.09, h: 150.39, l: 147.79, c: 150.19 },
            { o: 150.19, h: 151.2, l: 149.92, c: 151.04 },
            { o: 151.04, h: 152.36, l: 150.6, c: 152.06 },
            { o: 152.06, h: 153.33, l: 151.77, c: 152.96 },
            { o: 155.84, h: 156.14, l: 153.64, c: 153.84 },
            { o: 153.84, h: 153.99, l: 152.04, c: 152.22 },
            { o: 152.22, h: 152.5, l: 150.84, c: 151.25 },
            { o: 151.25, h: 151.7, l: 149.51, c: 149.84 }
          ],
          zones: [
            { from: 4, top: 156.71, bottom: 155.46, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.9, bottom: 146.58, kind: "demand", label: "Demand D" }
          ],
          highlight: { from: 14, to: 14, label: "B: gap into supply" },
          reveal: 15
        }
      },
      {
        title: "Gap down into demand",
        narration: "Next day price gaps down after a decline straight into demand D. Only a novice sells there. Buy.",
        scene: {
          candles: [
            { o: 144, h: 146.57, l: 143.69, c: 146.33 },
            { o: 146.33, h: 151.02, l: 146.09, c: 150.65 },
            { o: 150.65, h: 153.1, l: 150.5, c: 152.8 },
            { o: 152.8, h: 156.23, l: 152.59, c: 156 },
            { o: 156, h: 156.59, l: 155.04, c: 155.46 },
            { o: 155.46, h: 156.71, l: 154.98, c: 156.04 },
            { o: 156.04, h: 156.19, l: 151.46, c: 151.6 },
            { o: 151.6, h: 151.77, l: 147.84, c: 148.04 },
            { o: 148.04, h: 148.43, l: 146.65, c: 147.13 },
            { o: 147.13, h: 149.35, l: 146.58, c: 148.9 },
            { o: 148.9, h: 149.25, l: 147.71, c: 148.02 },
            { o: 148.02, h: 150.11, l: 147.83, c: 149.75 },
            { o: 149.75, h: 151.39, l: 149.36, c: 151.08 },
            { o: 151.08, h: 152.88, l: 150.89, c: 152.52 },
            { o: 155.9, h: 156.2, l: 153.6, c: 153.8 },
            { o: 153.8, h: 154.02, l: 152.63, c: 152.87 },
            { o: 152.87, h: 153.19, l: 152.15, c: 152.37 },
            { o: 152.37, h: 152.75, l: 151.16, c: 151.4 },
            { o: 148.09, h: 150.39, l: 147.79, c: 150.19 },
            { o: 150.19, h: 151.2, l: 149.92, c: 151.04 },
            { o: 151.04, h: 152.36, l: 150.6, c: 152.06 },
            { o: 152.06, h: 153.33, l: 151.77, c: 152.96 },
            { o: 155.84, h: 156.14, l: 153.64, c: 153.84 },
            { o: 153.84, h: 153.99, l: 152.04, c: 152.22 },
            { o: 152.22, h: 152.5, l: 150.84, c: 151.25 },
            { o: 151.25, h: 151.7, l: 149.51, c: 149.84 }
          ],
          zones: [
            { from: 4, top: 156.71, bottom: 155.46, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.9, bottom: 146.58, kind: "demand", label: "Demand D" }
          ],
          highlight: { from: 18, to: 18, label: "E: gap into demand" },
          reveal: 19
        }
      },
      {
        title: "And again",
        narration: "Price gaps up into supply A once more and falls. Three gap entries, all at levels marked before the open, all low risk near the open.",
        scene: {
          candles: [
            { o: 144, h: 146.57, l: 143.69, c: 146.33 },
            { o: 146.33, h: 151.02, l: 146.09, c: 150.65 },
            { o: 150.65, h: 153.1, l: 150.5, c: 152.8 },
            { o: 152.8, h: 156.23, l: 152.59, c: 156 },
            { o: 156, h: 156.59, l: 155.04, c: 155.46 },
            { o: 155.46, h: 156.71, l: 154.98, c: 156.04 },
            { o: 156.04, h: 156.19, l: 151.46, c: 151.6 },
            { o: 151.6, h: 151.77, l: 147.84, c: 148.04 },
            { o: 148.04, h: 148.43, l: 146.65, c: 147.13 },
            { o: 147.13, h: 149.35, l: 146.58, c: 148.9 },
            { o: 148.9, h: 149.25, l: 147.71, c: 148.02 },
            { o: 148.02, h: 150.11, l: 147.83, c: 149.75 },
            { o: 149.75, h: 151.39, l: 149.36, c: 151.08 },
            { o: 151.08, h: 152.88, l: 150.89, c: 152.52 },
            { o: 155.9, h: 156.2, l: 153.6, c: 153.8 },
            { o: 153.8, h: 154.02, l: 152.63, c: 152.87 },
            { o: 152.87, h: 153.19, l: 152.15, c: 152.37 },
            { o: 152.37, h: 152.75, l: 151.16, c: 151.4 },
            { o: 148.09, h: 150.39, l: 147.79, c: 150.19 },
            { o: 150.19, h: 151.2, l: 149.92, c: 151.04 },
            { o: 151.04, h: 152.36, l: 150.6, c: 152.06 },
            { o: 152.06, h: 153.33, l: 151.77, c: 152.96 },
            { o: 155.84, h: 156.14, l: 153.64, c: 153.84 },
            { o: 153.84, h: 153.99, l: 152.04, c: 152.22 },
            { o: 152.22, h: 152.5, l: 150.84, c: 151.25 },
            { o: 151.25, h: 151.7, l: 149.51, c: 149.84 }
          ],
          zones: [
            { from: 4, top: 156.71, bottom: 155.46, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.9, bottom: 146.58, kind: "demand", label: "Demand D" }
          ],
          highlight: { from: 22, to: 22, label: "C: gap into supply" }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Why do gaps happen?",
        options: [
          "Computers glitch",
          "Orders at the open overwhelm the other side",
          "Brokers set them",
          "Moving averages cross"
        ],
        answer: 1,
        explain: "Gap up = more buy orders at the open than supply at the prior close; gap down the reverse."
      },
      {
        type: "spot",
        q: "Click the gap down into demand (the buy).",
        scene: {
          candles: [
            { o: 144, h: 146.57, l: 143.69, c: 146.33 },
            { o: 146.33, h: 151.02, l: 146.09, c: 150.65 },
            { o: 150.65, h: 153.1, l: 150.5, c: 152.8 },
            { o: 152.8, h: 156.23, l: 152.59, c: 156 },
            { o: 156, h: 156.59, l: 155.04, c: 155.46 },
            { o: 155.46, h: 156.71, l: 154.98, c: 156.04 },
            { o: 156.04, h: 156.19, l: 151.46, c: 151.6 },
            { o: 151.6, h: 151.77, l: 147.84, c: 148.04 },
            { o: 148.04, h: 148.43, l: 146.65, c: 147.13 },
            { o: 147.13, h: 149.35, l: 146.58, c: 148.9 },
            { o: 148.9, h: 149.25, l: 147.71, c: 148.02 },
            { o: 148.02, h: 150.11, l: 147.83, c: 149.75 },
            { o: 149.75, h: 151.39, l: 149.36, c: 151.08 },
            { o: 151.08, h: 152.88, l: 150.89, c: 152.52 },
            { o: 155.9, h: 156.2, l: 153.6, c: 153.8 },
            { o: 153.8, h: 154.02, l: 152.63, c: 152.87 },
            { o: 152.87, h: 153.19, l: 152.15, c: 152.37 },
            { o: 152.37, h: 152.75, l: 151.16, c: 151.4 },
            { o: 148.09, h: 150.39, l: 147.79, c: 150.19 },
            { o: 150.19, h: 151.2, l: 149.92, c: 151.04 },
            { o: 151.04, h: 152.36, l: 150.6, c: 152.06 },
            { o: 152.06, h: 153.33, l: 151.77, c: 152.96 },
            { o: 155.84, h: 156.14, l: 153.64, c: 153.84 },
            { o: 153.84, h: 153.99, l: 152.04, c: 152.22 },
            { o: 152.22, h: 152.5, l: 150.84, c: 151.25 },
            { o: 151.25, h: 151.7, l: 149.51, c: 149.84 }
          ],
          zones: [
            { from: 4, top: 156.71, bottom: 155.46, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.9, bottom: 146.58, kind: "demand", label: "Demand D" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "Price gapped down after a decline straight into demand D. The seller there is the novice."
      },
      {
        type: "tf",
        q: "The open is a great time for traders who cannot yet identify levels objectively.",
        answer: false,
        explain: "The open is not for the novice. It is a great opportunity for the trader who can spot the novice."
      },
      {
        type: "mcq",
        q: "When does Seiden usually enter a gap trade?",
        options: ["At the close", "Seconds to minutes after the bell", "The next week", "After lunch"],
        answer: 1,
        explain: "Imbalances are greatest at or near the open; entries come seconds to minutes after the bell."
      },
      {
        type: "mcq",
        q: "Who is the novice in a gap down after a decline into demand?",
        options: ["The buyer", "The seller", "Both", "Neither"],
        answer: 1,
        explain: "Selling a gap down after a decline into demand is the novice action. Buy from him."
      }
    ],
    practice: [
      {
        prompt: "You marked supply A before the open. After a rally, tomorrow's open gaps right into it. Buy, sell or nothing at the open?",
        scene: {
          candles: [
            { o: 144, h: 147.11, l: 143.78, c: 146.71 },
            { o: 146.71, h: 149.69, l: 146.49, c: 149.53 },
            { o: 149.53, h: 153.21, l: 149.39, c: 152.91 },
            { o: 152.91, h: 156.27, l: 152.71, c: 156 },
            { o: 156, h: 156.46, l: 154.57, c: 155 },
            { o: 155, h: 156.3, l: 154.59, c: 155.97 },
            { o: 155.97, h: 156.15, l: 151.69, c: 151.78 },
            { o: 151.78, h: 151.85, l: 147.83, c: 147.97 },
            { o: 147.97, h: 148.66, l: 146.87, c: 147.51 },
            { o: 147.51, h: 148.59, l: 146.92, c: 148.19 },
            { o: 148.19, h: 148.64, l: 147.55, c: 147.91 },
            { o: 147.91, h: 149.75, l: 147.52, c: 149.51 },
            { o: 149.51, h: 151.63, l: 149.27, c: 151.27 },
            { o: 151.27, h: 152.55, l: 151.11, c: 152.41 },
            { o: 155.51, h: 155.81, l: 153.21, c: 153.41 },
            { o: 153.41, h: 153.68, l: 152.02, c: 152.32 },
            { o: 152.32, h: 152.49, l: 151.37, c: 151.7 },
            { o: 151.7, h: 152.08, l: 150.36, c: 150.69 },
            { o: 147.73, h: 150.03, l: 147.43, c: 149.83 },
            { o: 149.83, h: 151.08, l: 149.41, c: 150.67 },
            { o: 150.67, h: 151.78, l: 150.43, c: 151.63 },
            { o: 151.63, h: 152.73, l: 151.5, c: 152.5 },
            { o: 155.44, h: 155.74, l: 153.24, c: 153.44 },
            { o: 153.44, h: 153.86, l: 151.89, c: 152.08 },
            { o: 152.08, h: 152.47, l: 150.36, c: 150.8 },
            { o: 150.8, h: 151.25, l: 149.27, c: 149.44 }
          ],
          zones: [
            { from: 4, top: 156.46, bottom: 155, kind: "supply", label: "Supply A" },
            { from: 8, top: 148.19, bottom: 146.87, kind: "demand", label: "Demand D" }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: { side: "sell", tp: 153.51 },
        explain: "Gap up after a rally into supply: the buyers are the novices. Sell at the open with the stop above the zone. Price fell away."
      }
    ],
    cards: [
      { front: "Gap up means?", back: "More buy orders at the open than supply at the prior close." },
      { front: "Gap up after a rally into supply?", back: "Short it near the open." },
      { front: "Gap down after a decline into demand?", back: "Buy it near the open." },
      { front: "When are imbalances greatest?", back: "At or near the open (first hour)." },
      { front: "Can't see the novice?", back: "You are probably the novice." }
    ],
    mnemonic: "Gap into a wall, sell the call: gap up into supply = sell; gap down into demand = buy."
  },
  {
    mentor: "seiden",
    n: 62,
    eli5: {
      oneLiner: "The same A-B logic reads the dollar, bonds and gold.",
      story: "Seiden argues that stock indexes looked higher only because the dollar lost value, and that gold is a fairer ruler of wealth. But when he reads the dollar itself, he uses the same simple steps as any chart. A is a quiet pause, then a sharp drop proves sellers won. B is the first return to A, where price falls again. The downtrend steps lower each time.",
      analogy: "Like going down a staircase: every landing where you paused becomes a step you will not climb back past easily."
    },
    bigIdeas: [
      "A = a pause that looks like balance; a sharp drop from it proves sellers greatly exceeded buyers.",
      "B = the first revisit of A, where price is expected to fall again.",
      "Read any market objectively from price, not from media stories."
    ],
    steps: [
      {
        title: "A: the pause",
        narration: "The dollar index pauses at A, then gaps and drops. Sellers greatly exceeded buyers there.",
        scene: {
          candles: [
            { o: 160, h: 161.8, l: 159.86, c: 161.54 },
            { o: 161.54, h: 163.86, l: 161.24, c: 163.59 },
            { o: 163.59, h: 166.18, l: 163.42, c: 166 },
            { o: 166, h: 166.39, l: 165.25, c: 165.83 },
            { o: 165.83, h: 167.29, l: 165.26, c: 166.98 },
            { o: 166.98, h: 167.54, l: 165.48, c: 166.03 },
            { o: 164.03, h: 164.24, l: 160.56, c: 160.69 },
            { o: 160.69, h: 160.85, l: 157.68, c: 157.76 },
            { o: 157.76, h: 157.9, l: 154.92, c: 155.03 },
            { o: 155.03, h: 155.39, l: 152.86, c: 153.45 },
            { o: 153.45, h: 154.41, l: 152.93, c: 154.03 },
            { o: 154.03, h: 156.38, l: 153.91, c: 156.22 },
            { o: 156.22, h: 160.49, l: 156, c: 160.29 },
            { o: 160.29, h: 162.44, l: 160.05, c: 161.99 },
            { o: 161.99, h: 165.52, l: 161.64, c: 165.33 },
            { o: 165.33, h: 166.69, l: 164.58, c: 164.83 },
            { o: 164.83, h: 165.23, l: 160.46, c: 160.8 },
            { o: 160.8, h: 161.05, l: 157.35, c: 157.58 },
            { o: 157.58, h: 157.88, l: 154.44, c: 154.83 },
            { o: 154.83, h: 155.37, l: 153.57, c: 153.96 },
            { o: 153.96, h: 156.33, l: 153.44, c: 155.72 },
            { o: 155.72, h: 156.29, l: 154.44, c: 154.86 },
            { o: 154.86, h: 155.05, l: 150.21, c: 150.42 },
            { o: 150.42, h: 150.62, l: 146.81, c: 146.86 },
            { o: 146.86, h: 148.81, l: 146.57, c: 148.51 },
            { o: 148.51, h: 150.14, l: 148.24, c: 149.85 },
            { o: 149.85, h: 152.4, l: 149.71, c: 152.1 },
            { o: 152.1, h: 153.7, l: 151.72, c: 153.46 },
            { o: 153.46, h: 155.15, l: 152.71, c: 152.96 },
            { o: 152.96, h: 153.11, l: 150.76, c: 151.19 },
            { o: 151.19, h: 151.5, l: 147.8, c: 147.93 },
            { o: 147.93, h: 148.3, l: 145.84, c: 146.11 },
            { o: 146.11, h: 146.27, l: 143.78, c: 143.96 }
          ],
          zones: [
            { from: 3, top: 167.54, bottom: 165.83, kind: "supply", label: "A (supply)" }
          ],
          highlight: { from: 6, to: 8, label: "sharp drop" },
          reveal: 9
        }
      },
      {
        title: "B: the first revisit",
        narration: "Price climbs back to A for the first time and declines again. A dramatic first drop suggested a similar drop at B.",
        scene: {
          candles: [
            { o: 160, h: 161.8, l: 159.86, c: 161.54 },
            { o: 161.54, h: 163.86, l: 161.24, c: 163.59 },
            { o: 163.59, h: 166.18, l: 163.42, c: 166 },
            { o: 166, h: 166.39, l: 165.25, c: 165.83 },
            { o: 165.83, h: 167.29, l: 165.26, c: 166.98 },
            { o: 166.98, h: 167.54, l: 165.48, c: 166.03 },
            { o: 164.03, h: 164.24, l: 160.56, c: 160.69 },
            { o: 160.69, h: 160.85, l: 157.68, c: 157.76 },
            { o: 157.76, h: 157.9, l: 154.92, c: 155.03 },
            { o: 155.03, h: 155.39, l: 152.86, c: 153.45 },
            { o: 153.45, h: 154.41, l: 152.93, c: 154.03 },
            { o: 154.03, h: 156.38, l: 153.91, c: 156.22 },
            { o: 156.22, h: 160.49, l: 156, c: 160.29 },
            { o: 160.29, h: 162.44, l: 160.05, c: 161.99 },
            { o: 161.99, h: 165.52, l: 161.64, c: 165.33 },
            { o: 165.33, h: 166.69, l: 164.58, c: 164.83 },
            { o: 164.83, h: 165.23, l: 160.46, c: 160.8 },
            { o: 160.8, h: 161.05, l: 157.35, c: 157.58 },
            { o: 157.58, h: 157.88, l: 154.44, c: 154.83 },
            { o: 154.83, h: 155.37, l: 153.57, c: 153.96 },
            { o: 153.96, h: 156.33, l: 153.44, c: 155.72 },
            { o: 155.72, h: 156.29, l: 154.44, c: 154.86 },
            { o: 154.86, h: 155.05, l: 150.21, c: 150.42 },
            { o: 150.42, h: 150.62, l: 146.81, c: 146.86 },
            { o: 146.86, h: 148.81, l: 146.57, c: 148.51 },
            { o: 148.51, h: 150.14, l: 148.24, c: 149.85 },
            { o: 149.85, h: 152.4, l: 149.71, c: 152.1 },
            { o: 152.1, h: 153.7, l: 151.72, c: 153.46 },
            { o: 153.46, h: 155.15, l: 152.71, c: 152.96 },
            { o: 152.96, h: 153.11, l: 150.76, c: 151.19 },
            { o: 151.19, h: 151.5, l: 147.8, c: 147.93 },
            { o: 147.93, h: 148.3, l: 145.84, c: 146.11 },
            { o: 146.11, h: 146.27, l: 143.78, c: 143.96 }
          ],
          zones: [
            { from: 3, top: 167.54, bottom: 165.83, kind: "supply", label: "A (supply)" }
          ],
          highlight: { from: 15, to: 15, label: "B" },
          reveal: 19
        }
      },
      {
        title: "A second A",
        narration: "Lower down, a new pause forms and price drops from it. That is the next supply.",
        scene: {
          candles: [
            { o: 160, h: 161.8, l: 159.86, c: 161.54 },
            { o: 161.54, h: 163.86, l: 161.24, c: 163.59 },
            { o: 163.59, h: 166.18, l: 163.42, c: 166 },
            { o: 166, h: 166.39, l: 165.25, c: 165.83 },
            { o: 165.83, h: 167.29, l: 165.26, c: 166.98 },
            { o: 166.98, h: 167.54, l: 165.48, c: 166.03 },
            { o: 164.03, h: 164.24, l: 160.56, c: 160.69 },
            { o: 160.69, h: 160.85, l: 157.68, c: 157.76 },
            { o: 157.76, h: 157.9, l: 154.92, c: 155.03 },
            { o: 155.03, h: 155.39, l: 152.86, c: 153.45 },
            { o: 153.45, h: 154.41, l: 152.93, c: 154.03 },
            { o: 154.03, h: 156.38, l: 153.91, c: 156.22 },
            { o: 156.22, h: 160.49, l: 156, c: 160.29 },
            { o: 160.29, h: 162.44, l: 160.05, c: 161.99 },
            { o: 161.99, h: 165.52, l: 161.64, c: 165.33 },
            { o: 165.33, h: 166.69, l: 164.58, c: 164.83 },
            { o: 164.83, h: 165.23, l: 160.46, c: 160.8 },
            { o: 160.8, h: 161.05, l: 157.35, c: 157.58 },
            { o: 157.58, h: 157.88, l: 154.44, c: 154.83 },
            { o: 154.83, h: 155.37, l: 153.57, c: 153.96 },
            { o: 153.96, h: 156.33, l: 153.44, c: 155.72 },
            { o: 155.72, h: 156.29, l: 154.44, c: 154.86 },
            { o: 154.86, h: 155.05, l: 150.21, c: 150.42 },
            { o: 150.42, h: 150.62, l: 146.81, c: 146.86 },
            { o: 146.86, h: 148.81, l: 146.57, c: 148.51 },
            { o: 148.51, h: 150.14, l: 148.24, c: 149.85 },
            { o: 149.85, h: 152.4, l: 149.71, c: 152.1 },
            { o: 152.1, h: 153.7, l: 151.72, c: 153.46 },
            { o: 153.46, h: 155.15, l: 152.71, c: 152.96 },
            { o: 152.96, h: 153.11, l: 150.76, c: 151.19 },
            { o: 151.19, h: 151.5, l: 147.8, c: 147.93 },
            { o: 147.93, h: 148.3, l: 145.84, c: 146.11 },
            { o: 146.11, h: 146.27, l: 143.78, c: 143.96 }
          ],
          zones: [
            { from: 3, top: 167.54, bottom: 165.83, kind: "supply", label: "A (supply)" },
            { from: 19, top: 156.33, bottom: 153.96, kind: "supply", label: "Second A" }
          ],
          reveal: 24
        }
      },
      {
        title: "Second B, next leg down",
        narration: "The first revisit of the second A gives the next short, and the downtrend steps lower again.",
        scene: {
          candles: [
            { o: 160, h: 161.8, l: 159.86, c: 161.54 },
            { o: 161.54, h: 163.86, l: 161.24, c: 163.59 },
            { o: 163.59, h: 166.18, l: 163.42, c: 166 },
            { o: 166, h: 166.39, l: 165.25, c: 165.83 },
            { o: 165.83, h: 167.29, l: 165.26, c: 166.98 },
            { o: 166.98, h: 167.54, l: 165.48, c: 166.03 },
            { o: 164.03, h: 164.24, l: 160.56, c: 160.69 },
            { o: 160.69, h: 160.85, l: 157.68, c: 157.76 },
            { o: 157.76, h: 157.9, l: 154.92, c: 155.03 },
            { o: 155.03, h: 155.39, l: 152.86, c: 153.45 },
            { o: 153.45, h: 154.41, l: 152.93, c: 154.03 },
            { o: 154.03, h: 156.38, l: 153.91, c: 156.22 },
            { o: 156.22, h: 160.49, l: 156, c: 160.29 },
            { o: 160.29, h: 162.44, l: 160.05, c: 161.99 },
            { o: 161.99, h: 165.52, l: 161.64, c: 165.33 },
            { o: 165.33, h: 166.69, l: 164.58, c: 164.83 },
            { o: 164.83, h: 165.23, l: 160.46, c: 160.8 },
            { o: 160.8, h: 161.05, l: 157.35, c: 157.58 },
            { o: 157.58, h: 157.88, l: 154.44, c: 154.83 },
            { o: 154.83, h: 155.37, l: 153.57, c: 153.96 },
            { o: 153.96, h: 156.33, l: 153.44, c: 155.72 },
            { o: 155.72, h: 156.29, l: 154.44, c: 154.86 },
            { o: 154.86, h: 155.05, l: 150.21, c: 150.42 },
            { o: 150.42, h: 150.62, l: 146.81, c: 146.86 },
            { o: 146.86, h: 148.81, l: 146.57, c: 148.51 },
            { o: 148.51, h: 150.14, l: 148.24, c: 149.85 },
            { o: 149.85, h: 152.4, l: 149.71, c: 152.1 },
            { o: 152.1, h: 153.7, l: 151.72, c: 153.46 },
            { o: 153.46, h: 155.15, l: 152.71, c: 152.96 },
            { o: 152.96, h: 153.11, l: 150.76, c: 151.19 },
            { o: 151.19, h: 151.5, l: 147.8, c: 147.93 },
            { o: 147.93, h: 148.3, l: 145.84, c: 146.11 },
            { o: 146.11, h: 146.27, l: 143.78, c: 143.96 }
          ],
          zones: [
            { from: 3, top: 167.54, bottom: 165.83, kind: "supply", label: "A (supply)" },
            { from: 19, top: 156.33, bottom: 153.96, kind: "supply", label: "Second A" }
          ],
          lines: [
            { y: 153.96, label: "Entry (proximal)", kind: "entry" },
            { y: 156.63, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 28, y: 156.55, text: "B" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In this lesson, what is B?",
        options: ["The base", "The first revisit of A", "A bullish candle", "The news release"],
        answer: 1,
        explain: "B is the first time price comes back to area A, where a decline is expected again."
      },
      {
        type: "spot",
        q: "Click the first B (the first revisit of the top supply).",
        scene: {
          candles: [
            { o: 160, h: 161.8, l: 159.86, c: 161.54 },
            { o: 161.54, h: 163.86, l: 161.24, c: 163.59 },
            { o: 163.59, h: 166.18, l: 163.42, c: 166 },
            { o: 166, h: 166.39, l: 165.25, c: 165.83 },
            { o: 165.83, h: 167.29, l: 165.26, c: 166.98 },
            { o: 166.98, h: 167.54, l: 165.48, c: 166.03 },
            { o: 164.03, h: 164.24, l: 160.56, c: 160.69 },
            { o: 160.69, h: 160.85, l: 157.68, c: 157.76 },
            { o: 157.76, h: 157.9, l: 154.92, c: 155.03 },
            { o: 155.03, h: 155.39, l: 152.86, c: 153.45 },
            { o: 153.45, h: 154.41, l: 152.93, c: 154.03 },
            { o: 154.03, h: 156.38, l: 153.91, c: 156.22 },
            { o: 156.22, h: 160.49, l: 156, c: 160.29 },
            { o: 160.29, h: 162.44, l: 160.05, c: 161.99 },
            { o: 161.99, h: 165.52, l: 161.64, c: 165.33 },
            { o: 165.33, h: 166.69, l: 164.58, c: 164.83 },
            { o: 164.83, h: 165.23, l: 160.46, c: 160.8 },
            { o: 160.8, h: 161.05, l: 157.35, c: 157.58 },
            { o: 157.58, h: 157.88, l: 154.44, c: 154.83 },
            { o: 154.83, h: 155.37, l: 153.57, c: 153.96 },
            { o: 153.96, h: 156.33, l: 153.44, c: 155.72 },
            { o: 155.72, h: 156.29, l: 154.44, c: 154.86 },
            { o: 154.86, h: 155.05, l: 150.21, c: 150.42 },
            { o: 150.42, h: 150.62, l: 146.81, c: 146.86 },
            { o: 146.86, h: 148.81, l: 146.57, c: 148.51 },
            { o: 148.51, h: 150.14, l: 148.24, c: 149.85 },
            { o: 149.85, h: 152.4, l: 149.71, c: 152.1 },
            { o: 152.1, h: 153.7, l: 151.72, c: 153.46 },
            { o: 153.46, h: 155.15, l: 152.71, c: 152.96 },
            { o: 152.96, h: 153.11, l: 150.76, c: 151.19 },
            { o: 151.19, h: 151.5, l: 147.8, c: 147.93 },
            { o: 147.93, h: 148.3, l: 145.84, c: 146.11 },
            { o: 146.11, h: 146.27, l: 143.78, c: 143.96 }
          ],
          zones: [
            { from: 3, top: 167.54, bottom: 165.83, kind: "supply", label: "A" }
          ]
        },
        answer: { from: 15, to: 15 },
        explain: "Price climbed back into A and turned down there."
      },
      {
        type: "tf",
        q: "Seiden reads currencies and bonds with a different method from stocks.",
        answer: false,
        explain: "Any market - currencies, bonds, gold - is read with the same A/B supply and demand logic."
      },
      {
        type: "mcq",
        q: "Falling treasury prices mean...",
        options: ["Falling yields", "Rising yields", "No change", "A stronger dollar always"],
        answer: 1,
        explain: "Prices and yields move inversely."
      },
      {
        type: "mcq",
        q: "Why does Seiden use gold as a yardstick in this essay?",
        options: [
          "It pays dividends",
          "It held its value while the dollar lost purchasing power",
          "It never moves",
          "It is a stock"
        ],
        answer: 1,
        explain: "A $20 suit in 1932 vs an ounce of gold that still buys a nice suit today."
      }
    ],
    practice: [
      {
        prompt: "Dollar index: a second pause formed, then a sharp drop. Price is now climbing back to it for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 161.9, l: 159.86, c: 161.69 },
            { o: 161.69, h: 164.29, l: 161.56, c: 164.14 },
            { o: 164.14, h: 166.23, l: 163.69, c: 166 },
            { o: 166, h: 166.6, l: 164.96, c: 165.57 },
            { o: 165.57, h: 167.36, l: 164.87, c: 166.72 },
            { o: 166.72, h: 167.1, l: 165.54, c: 166.06 },
            { o: 164.06, h: 164.21, l: 160.93, c: 161.08 },
            { o: 161.08, h: 161.22, l: 158.1, c: 158.25 },
            { o: 158.25, h: 158.3, l: 154.97, c: 155.06 },
            { o: 155.06, h: 155.77, l: 154.49, c: 155.5 },
            { o: 155.5, h: 155.85, l: 153.72, c: 154.06 },
            { o: 154.06, h: 157.18, l: 153.85, c: 156.83 },
            { o: 156.83, h: 160.52, l: 156.62, c: 160.18 },
            { o: 160.18, h: 162.37, l: 159.79, c: 161.99 },
            { o: 161.99, h: 165.37, l: 161.71, c: 165.07 },
            { o: 165.07, h: 166.47, l: 164.32, c: 164.57 },
            { o: 164.57, h: 165.01, l: 161.23, c: 161.57 },
            { o: 161.57, h: 161.98, l: 158.09, c: 158.27 },
            { o: 158.27, h: 158.39, l: 154.19, c: 154.57 },
            { o: 154.57, h: 154.94, l: 153.11, c: 153.57 },
            { o: 153.57, h: 155.14, l: 153.1, c: 154.68 },
            { o: 154.68, h: 155.29, l: 153.97, c: 154.66 },
            { o: 154.66, h: 154.88, l: 150.17, c: 150.32 },
            { o: 150.32, h: 150.49, l: 146.46, c: 146.66 },
            { o: 146.66, h: 148.36, l: 146.39, c: 148.13 },
            { o: 148.13, h: 150.07, l: 147.98, c: 149.95 },
            { o: 149.95, h: 151.71, l: 149.58, c: 151.58 },
            { o: 151.58, h: 153.47, l: 151.2, c: 153.07 },
            { o: 153.07, h: 154.43, l: 152.32, c: 152.57 },
            { o: 152.57, h: 152.95, l: 150.13, c: 150.28 },
            { o: 150.28, h: 150.66, l: 147.71, c: 147.93 },
            { o: 147.93, h: 148.09, l: 145.54, c: 145.68 },
            { o: 145.68, h: 146, l: 143.15, c: 143.57 }
          ],
          zones: [
            { from: 3, top: 167.36, bottom: 165.57, kind: "supply", label: "First A" },
            { from: 19, top: 155.29, bottom: 153.57, kind: "supply", label: "Second A" }
          ],
          reveal: 28
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "First revisit (B) of a supply pause (A) that price left sharply. Sell at the zone, stop above. The downtrend stepped lower."
      }
    ],
    cards: [
      { front: "A in this lesson?", back: "A pause that looks like balance, left with a sharp drop." },
      { front: "B in this lesson?", back: "The first revisit of A." },
      {
        front: "Does the method change for currencies or bonds?",
        back: "No. Same supply and demand logic everywhere."
      },
      { front: "Treasury prices vs yields?", back: "They move in opposite directions." },
      { front: "Media narrative or chart?", back: "Read the chart objectively." }
    ],
    mnemonic: "Pause, Plunge, Pay back: A pauses, price plunges, B pays you on the first return."
  },
  {
    mentor: "seiden",
    n: 70,
    eli5: {
      oneLiner: "An upgrade gap into supply brings a crowd of buyers to sell to.",
      story: "A big bank told everyone a stock was a \"Buy\". The next morning the stock gapped up right into a price where it had crashed from before. That crash showed sellers were waiting there. Seiden's class had planned before the open to sell to anyone buying at that level, and price fell fast.",
      analogy: "Like a store announcing a celebrity visit: the crowd rushes in, and the smart shop owner sells them everything at full price."
    },
    bigIdeas: [
      "Prep about 15 minutes before the open: find stocks opening at big imbalances.",
      "Upgrade and downgrade lists are a scan source, not a reason to buy or sell.",
      "Fade an upgrade gap up into supply; fade a downgrade gap down into demand."
    ],
    steps: [
      {
        title: "Supply from a dramatic decline",
        narration: "Price rallied, paused, then fell hard. Much more supply than demand sat in that pause.",
        scene: {
          candles: [
            { o: 148, h: 151.28, l: 147.57, c: 151.13 },
            { o: 151.13, h: 153.26, l: 150.93, c: 152.83 },
            { o: 152.83, h: 156.46, l: 152.48, c: 156.11 },
            { o: 156.11, h: 159.13, l: 155.81, c: 159 },
            { o: 159, h: 159.43, l: 158.19, c: 158.55 },
            { o: 158.55, h: 160.35, l: 157.88, c: 160.02 },
            { o: 160.02, h: 160.41, l: 158.36, c: 159.04 },
            { o: 159.04, h: 159.26, l: 154.88, c: 155.06 },
            { o: 155.06, h: 155.19, l: 149.96, c: 150.04 },
            { o: 150.04, h: 150.99, l: 149.92, c: 150.7 },
            { o: 150.7, h: 150.99, l: 148.77, c: 148.89 },
            { o: 148.89, h: 151.05, l: 148.61, c: 150.89 },
            { o: 150.89, h: 151.02, l: 148.49, c: 148.75 },
            { o: 148.75, h: 151.01, l: 148.46, c: 150.9 },
            { o: 150.9, h: 151.11, l: 148.59, c: 148.82 },
            { o: 148.82, h: 151.04, l: 148.69, c: 150.89 },
            { o: 150.89, h: 151.17, l: 148.77, c: 148.93 },
            { o: 159.2, h: 159.55, l: 157.3, c: 157.5 },
            { o: 157.5, h: 157.95, l: 155.94, c: 156.1 },
            { o: 156.1, h: 156.5, l: 154.21, c: 154.41 },
            { o: 154.41, h: 154.67, l: 152.04, c: 152.43 },
            { o: 152.43, h: 152.78, l: 151.1, c: 151.29 },
            { o: 151.29, h: 151.64, l: 149.13, c: 149.5 }
          ],
          zones: [
            { from: 4, top: 160.41, bottom: 158.55, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 7, to: 8, label: "dramatic decline" },
          reveal: 9
        }
      },
      {
        title: "Weeks below",
        narration: "Price trades quietly below the zone for weeks. The level waits, untouched.",
        scene: {
          candles: [
            { o: 148, h: 151.28, l: 147.57, c: 151.13 },
            { o: 151.13, h: 153.26, l: 150.93, c: 152.83 },
            { o: 152.83, h: 156.46, l: 152.48, c: 156.11 },
            { o: 156.11, h: 159.13, l: 155.81, c: 159 },
            { o: 159, h: 159.43, l: 158.19, c: 158.55 },
            { o: 158.55, h: 160.35, l: 157.88, c: 160.02 },
            { o: 160.02, h: 160.41, l: 158.36, c: 159.04 },
            { o: 159.04, h: 159.26, l: 154.88, c: 155.06 },
            { o: 155.06, h: 155.19, l: 149.96, c: 150.04 },
            { o: 150.04, h: 150.99, l: 149.92, c: 150.7 },
            { o: 150.7, h: 150.99, l: 148.77, c: 148.89 },
            { o: 148.89, h: 151.05, l: 148.61, c: 150.89 },
            { o: 150.89, h: 151.02, l: 148.49, c: 148.75 },
            { o: 148.75, h: 151.01, l: 148.46, c: 150.9 },
            { o: 150.9, h: 151.11, l: 148.59, c: 148.82 },
            { o: 148.82, h: 151.04, l: 148.69, c: 150.89 },
            { o: 150.89, h: 151.17, l: 148.77, c: 148.93 },
            { o: 159.2, h: 159.55, l: 157.3, c: 157.5 },
            { o: 157.5, h: 157.95, l: 155.94, c: 156.1 },
            { o: 156.1, h: 156.5, l: 154.21, c: 154.41 },
            { o: 154.41, h: 154.67, l: 152.04, c: 152.43 },
            { o: 152.43, h: 152.78, l: 151.1, c: 151.29 },
            { o: 151.29, h: 151.64, l: 149.13, c: 149.5 }
          ],
          zones: [
            { from: 4, top: 160.41, bottom: 158.55, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 9, to: 16, label: "quiet weeks" },
          reveal: 17
        }
      },
      {
        title: "Upgrade gap up",
        narration: "A bank upgrades the stock and it opens right inside the supply. The pre-open plan says sell to anyone buying here.",
        scene: {
          candles: [
            { o: 148, h: 151.28, l: 147.57, c: 151.13 },
            { o: 151.13, h: 153.26, l: 150.93, c: 152.83 },
            { o: 152.83, h: 156.46, l: 152.48, c: 156.11 },
            { o: 156.11, h: 159.13, l: 155.81, c: 159 },
            { o: 159, h: 159.43, l: 158.19, c: 158.55 },
            { o: 158.55, h: 160.35, l: 157.88, c: 160.02 },
            { o: 160.02, h: 160.41, l: 158.36, c: 159.04 },
            { o: 159.04, h: 159.26, l: 154.88, c: 155.06 },
            { o: 155.06, h: 155.19, l: 149.96, c: 150.04 },
            { o: 150.04, h: 150.99, l: 149.92, c: 150.7 },
            { o: 150.7, h: 150.99, l: 148.77, c: 148.89 },
            { o: 148.89, h: 151.05, l: 148.61, c: 150.89 },
            { o: 150.89, h: 151.02, l: 148.49, c: 148.75 },
            { o: 148.75, h: 151.01, l: 148.46, c: 150.9 },
            { o: 150.9, h: 151.11, l: 148.59, c: 148.82 },
            { o: 148.82, h: 151.04, l: 148.69, c: 150.89 },
            { o: 150.89, h: 151.17, l: 148.77, c: 148.93 },
            { o: 159.2, h: 159.55, l: 157.3, c: 157.5 },
            { o: 157.5, h: 157.95, l: 155.94, c: 156.1 },
            { o: 156.1, h: 156.5, l: 154.21, c: 154.41 },
            { o: 154.41, h: 154.67, l: 152.04, c: 152.43 },
            { o: 152.43, h: 152.78, l: 151.1, c: 151.29 },
            { o: 151.29, h: 151.64, l: 149.13, c: 149.5 }
          ],
          zones: [
            { from: 4, top: 160.41, bottom: 158.55, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 158.55, label: "Entry (proximal)", kind: "entry" },
            { y: 160.71, label: "Stop beyond distal", kind: "sl" }
          ],
          highlight: { from: 17, to: 17, label: "upgrade gap" },
          reveal: 18
        }
      },
      {
        title: "Fast move away",
        narration: "Entries at strong imbalances near the open usually move fast. Price drops back toward the old range.",
        scene: {
          candles: [
            { o: 148, h: 151.28, l: 147.57, c: 151.13 },
            { o: 151.13, h: 153.26, l: 150.93, c: 152.83 },
            { o: 152.83, h: 156.46, l: 152.48, c: 156.11 },
            { o: 156.11, h: 159.13, l: 155.81, c: 159 },
            { o: 159, h: 159.43, l: 158.19, c: 158.55 },
            { o: 158.55, h: 160.35, l: 157.88, c: 160.02 },
            { o: 160.02, h: 160.41, l: 158.36, c: 159.04 },
            { o: 159.04, h: 159.26, l: 154.88, c: 155.06 },
            { o: 155.06, h: 155.19, l: 149.96, c: 150.04 },
            { o: 150.04, h: 150.99, l: 149.92, c: 150.7 },
            { o: 150.7, h: 150.99, l: 148.77, c: 148.89 },
            { o: 148.89, h: 151.05, l: 148.61, c: 150.89 },
            { o: 150.89, h: 151.02, l: 148.49, c: 148.75 },
            { o: 148.75, h: 151.01, l: 148.46, c: 150.9 },
            { o: 150.9, h: 151.11, l: 148.59, c: 148.82 },
            { o: 148.82, h: 151.04, l: 148.69, c: 150.89 },
            { o: 150.89, h: 151.17, l: 148.77, c: 148.93 },
            { o: 159.2, h: 159.55, l: 157.3, c: 157.5 },
            { o: 157.5, h: 157.95, l: 155.94, c: 156.1 },
            { o: 156.1, h: 156.5, l: 154.21, c: 154.41 },
            { o: 154.41, h: 154.67, l: 152.04, c: 152.43 },
            { o: 152.43, h: 152.78, l: 151.1, c: 151.29 },
            { o: 151.29, h: 151.64, l: 149.13, c: 149.5 }
          ],
          zones: [
            { from: 4, top: 160.41, bottom: 158.55, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 158.55, label: "Entry (proximal)", kind: "entry" },
            { y: 160.71, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 22, y: 147.73, text: "Novice buyers trapped" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How long is Seiden's morning prep?",
        options: ["Three hours", "About 15 minutes", "None", "All night"],
        answer: 1,
        explain: "About 15 minutes to find stocks opening at large imbalances."
      },
      {
        type: "tf",
        q: "A big bank upgrade is a good reason to buy a gap up into supply.",
        answer: false,
        explain: "Only a novice buys after an advance and into supply. The upgrade just delivers the crowd."
      },
      {
        type: "spot",
        q: "Click the upgrade gap candle that opened into supply.",
        scene: {
          candles: [
            { o: 148, h: 151.28, l: 147.57, c: 151.13 },
            { o: 151.13, h: 153.26, l: 150.93, c: 152.83 },
            { o: 152.83, h: 156.46, l: 152.48, c: 156.11 },
            { o: 156.11, h: 159.13, l: 155.81, c: 159 },
            { o: 159, h: 159.43, l: 158.19, c: 158.55 },
            { o: 158.55, h: 160.35, l: 157.88, c: 160.02 },
            { o: 160.02, h: 160.41, l: 158.36, c: 159.04 },
            { o: 159.04, h: 159.26, l: 154.88, c: 155.06 },
            { o: 155.06, h: 155.19, l: 149.96, c: 150.04 },
            { o: 150.04, h: 150.99, l: 149.92, c: 150.7 },
            { o: 150.7, h: 150.99, l: 148.77, c: 148.89 },
            { o: 148.89, h: 151.05, l: 148.61, c: 150.89 },
            { o: 150.89, h: 151.02, l: 148.49, c: 148.75 },
            { o: 148.75, h: 151.01, l: 148.46, c: 150.9 },
            { o: 150.9, h: 151.11, l: 148.59, c: 148.82 },
            { o: 148.82, h: 151.04, l: 148.69, c: 150.89 },
            { o: 150.89, h: 151.17, l: 148.77, c: 148.93 },
            { o: 159.2, h: 159.55, l: 157.3, c: 157.5 },
            { o: 157.5, h: 157.95, l: 155.94, c: 156.1 },
            { o: 156.1, h: 156.5, l: 154.21, c: 154.41 },
            { o: 154.41, h: 154.67, l: 152.04, c: 152.43 },
            { o: 152.43, h: 152.78, l: 151.1, c: 151.29 },
            { o: 151.29, h: 151.64, l: 149.13, c: 149.5 }
          ],
          zones: [
            { from: 4, top: 160.41, bottom: 158.55, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 17, to: 17 },
        explain: "The gap opened inside the supply that formed with a dramatic decline. That is the short."
      },
      {
        type: "mcq",
        q: "What role do upgrade/downgrade lists play?",
        options: [
          "They tell you the direction",
          "They are a scan source for stocks gapping into levels",
          "They replace charts",
          "They set your stop"
        ],
        answer: 1,
        explain: "They help find gaps into zones; the level decides the trade."
      },
      {
        type: "mcq",
        q: "How does Seiden feel about market noise?",
        options: [
          "He hates it",
          "He loves it: the more noise the better",
          "He trades it directly",
          "He avoids trading"
        ],
        answer: 1,
        explain: "Noise invites others in at the wrong time and direction. As a trader he welcomes it."
      }
    ],
    practice: [
      {
        prompt: "Pre-market: a broker upgrade means this stock will open inside the supply above, which formed with a dramatic drop. Buy, sell or nothing at the open?",
        scene: {
          candles: [
            { o: 148, h: 151.43, l: 147.74, c: 151.16 },
            { o: 151.16, h: 153.32, l: 150.93, c: 152.93 },
            { o: 152.93, h: 156.43, l: 152.66, c: 156.15 },
            { o: 156.15, h: 159.14, l: 155.89, c: 159 },
            { o: 159, h: 159.41, l: 158.33, c: 158.9 },
            { o: 158.9, h: 160.19, l: 158.46, c: 159.58 },
            { o: 159.58, h: 160.13, l: 158.33, c: 158.92 },
            { o: 158.92, h: 159.08, l: 153.67, c: 153.89 },
            { o: 153.89, h: 153.95, l: 149.82, c: 149.92 },
            { o: 149.92, h: 150.75, l: 149.72, c: 150.63 },
            { o: 150.63, h: 150.93, l: 148.3, c: 148.56 },
            { o: 148.56, h: 150.98, l: 148.42, c: 150.68 },
            { o: 150.68, h: 150.81, l: 148.56, c: 148.72 },
            { o: 148.72, h: 151.17, l: 148.51, c: 150.88 },
            { o: 150.88, h: 151, l: 148.56, c: 148.76 },
            { o: 148.76, h: 150.8, l: 148.53, c: 150.66 },
            { o: 150.66, h: 150.79, l: 148.39, c: 148.65 },
            { o: 159.35, h: 159.7, l: 157.45, c: 157.65 },
            { o: 157.65, h: 158.07, l: 155.95, c: 156.26 },
            { o: 156.26, h: 156.44, l: 154.13, c: 154.44 },
            { o: 154.44, h: 154.8, l: 152.8, c: 153.01 },
            { o: 153.01, h: 153.45, l: 151.2, c: 151.39 },
            { o: 151.39, h: 151.7, l: 149.51, c: 149.65 }
          ],
          zones: [
            { from: 4, top: 160.19, bottom: 158.9, kind: "supply", label: "Supply" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "sell", tp: 154.35 },
        explain: "An upgrade gap up into supply: the buyers are the novices. Short the open, stop above the zone. Price fell."
      }
    ],
    cards: [
      { front: "Morning prep length?", back: "About 15 minutes." },
      { front: "Upgrade gap into supply?", back: "Fade it: sell." },
      { front: "Downgrade gap into demand?", back: "Fade it: buy." },
      { front: "Upgrade lists are...?", back: "A scanning source, not a signal." },
      { front: "When are orders set?", back: "Before the open." }
    ],
    mnemonic: "The upgrade brings the crowd; the supply takes their money."
  },
  {
    mentor: "seiden",
    n: 72,
    eli5: {
      oneLiner: "News and opinions are illusions. Follow simple rules like a goose.",
      story: "A goose flies south every autumn. It does not read the news or argue with itself; it just goes. People, though, stack up opinions about earnings, upgrades and scary headlines, and then buy high and sell low. When bad news pushes price into demand, the last seller sells and price must rise. When good news pulls price into supply, the last buyer buys and price falls.",
      analogy: "Like a goose that flies south without checking the weather report: the rule works every year, so it just follows it."
    },
    bigIdeas: [
      "Only buy where there is objectively more demand than supply; otherwise there is no reason to buy.",
      "Strong news into a level often marks the turn, opposite to what the crowd expects.",
      "When perceived risk is lowest, actual risk is often highest."
    ],
    steps: [
      {
        title: "Demand at the origin of a rally",
        narration: "Price based here and rallied. This area A is demand.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.57, c: 155.94 },
            { o: 155.94, h: 156.31, l: 153.93, c: 154.32 },
            { o: 154.32, h: 154.73, l: 151.95, c: 152.36 },
            { o: 152.36, h: 152.6, l: 149.35, c: 149.54 },
            { o: 149.54, h: 149.78, l: 147.75, c: 148 },
            { o: 148, h: 148.6, l: 147.05, c: 147.57 },
            { o: 147.57, h: 148.89, l: 147.24, c: 148.48 },
            { o: 148.48, h: 148.93, l: 147.57, c: 148.08 },
            { o: 148.08, h: 152.92, l: 147.99, c: 152.81 },
            { o: 152.81, h: 157.82, l: 152.59, c: 157.67 },
            { o: 157.67, h: 162.22, l: 157.59, c: 162.08 },
            { o: 162.08, h: 164.33, l: 161.55, c: 163.84 },
            { o: 163.84, h: 164.37, l: 163.39, c: 164.12 },
            { o: 164.12, h: 164.72, l: 162.71, c: 163.03 },
            { o: 163.03, h: 164.52, l: 162.46, c: 164.08 },
            { o: 164.08, h: 164.16, l: 158.78, c: 158.86 },
            { o: 158.86, h: 158.99, l: 154.08, c: 154.15 },
            { o: 154.15, h: 154.31, l: 148.83, c: 148.98 },
            { o: 148.98, h: 149.63, l: 147.69, c: 149.38 },
            { o: 149.38, h: 152.09, l: 148.97, c: 151.73 },
            { o: 151.73, h: 153.83, l: 151.42, c: 153.44 },
            { o: 153.44, h: 155.5, l: 152.99, c: 155.07 },
            { o: 155.07, h: 157.51, l: 154.73, c: 157.18 },
            { o: 157.18, h: 159.7, l: 156.75, c: 159.38 }
          ],
          zones: [
            { from: 5, top: 148.48, bottom: 147.05, kind: "demand", label: "A = demand" }
          ],
          reveal: 15
        }
      },
      {
        title: "Bad news, big fear",
        narration: "Terrible news hits and people sell hard. Big red candles race down toward A.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.57, c: 155.94 },
            { o: 155.94, h: 156.31, l: 153.93, c: 154.32 },
            { o: 154.32, h: 154.73, l: 151.95, c: 152.36 },
            { o: 152.36, h: 152.6, l: 149.35, c: 149.54 },
            { o: 149.54, h: 149.78, l: 147.75, c: 148 },
            { o: 148, h: 148.6, l: 147.05, c: 147.57 },
            { o: 147.57, h: 148.89, l: 147.24, c: 148.48 },
            { o: 148.48, h: 148.93, l: 147.57, c: 148.08 },
            { o: 148.08, h: 152.92, l: 147.99, c: 152.81 },
            { o: 152.81, h: 157.82, l: 152.59, c: 157.67 },
            { o: 157.67, h: 162.22, l: 157.59, c: 162.08 },
            { o: 162.08, h: 164.33, l: 161.55, c: 163.84 },
            { o: 163.84, h: 164.37, l: 163.39, c: 164.12 },
            { o: 164.12, h: 164.72, l: 162.71, c: 163.03 },
            { o: 163.03, h: 164.52, l: 162.46, c: 164.08 },
            { o: 164.08, h: 164.16, l: 158.78, c: 158.86 },
            { o: 158.86, h: 158.99, l: 154.08, c: 154.15 },
            { o: 154.15, h: 154.31, l: 148.83, c: 148.98 },
            { o: 148.98, h: 149.63, l: 147.69, c: 149.38 },
            { o: 149.38, h: 152.09, l: 148.97, c: 151.73 },
            { o: 151.73, h: 153.83, l: 151.42, c: 153.44 },
            { o: 153.44, h: 155.5, l: 152.99, c: 155.07 },
            { o: 155.07, h: 157.51, l: 154.73, c: 157.18 },
            { o: 157.18, h: 159.7, l: 156.75, c: 159.38 }
          ],
          zones: [
            { from: 5, top: 148.48, bottom: 147.05, kind: "demand", label: "A = demand" }
          ],
          highlight: { from: 15, to: 17, label: "scary news drop" },
          reveal: 18
        }
      },
      {
        title: "The last seller sells",
        narration: "At A there are more willing buyers. No matter how bad the news, once the last seller sells, price rises.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.57, c: 155.94 },
            { o: 155.94, h: 156.31, l: 153.93, c: 154.32 },
            { o: 154.32, h: 154.73, l: 151.95, c: 152.36 },
            { o: 152.36, h: 152.6, l: 149.35, c: 149.54 },
            { o: 149.54, h: 149.78, l: 147.75, c: 148 },
            { o: 148, h: 148.6, l: 147.05, c: 147.57 },
            { o: 147.57, h: 148.89, l: 147.24, c: 148.48 },
            { o: 148.48, h: 148.93, l: 147.57, c: 148.08 },
            { o: 148.08, h: 152.92, l: 147.99, c: 152.81 },
            { o: 152.81, h: 157.82, l: 152.59, c: 157.67 },
            { o: 157.67, h: 162.22, l: 157.59, c: 162.08 },
            { o: 162.08, h: 164.33, l: 161.55, c: 163.84 },
            { o: 163.84, h: 164.37, l: 163.39, c: 164.12 },
            { o: 164.12, h: 164.72, l: 162.71, c: 163.03 },
            { o: 163.03, h: 164.52, l: 162.46, c: 164.08 },
            { o: 164.08, h: 164.16, l: 158.78, c: 158.86 },
            { o: 158.86, h: 158.99, l: 154.08, c: 154.15 },
            { o: 154.15, h: 154.31, l: 148.83, c: 148.98 },
            { o: 148.98, h: 149.63, l: 147.69, c: 149.38 },
            { o: 149.38, h: 152.09, l: 148.97, c: 151.73 },
            { o: 151.73, h: 153.83, l: 151.42, c: 153.44 },
            { o: 153.44, h: 155.5, l: 152.99, c: 155.07 },
            { o: 155.07, h: 157.51, l: 154.73, c: 157.18 },
            { o: 157.18, h: 159.7, l: 156.75, c: 159.38 }
          ],
          zones: [
            { from: 5, top: 148.48, bottom: 147.05, kind: "demand", label: "A = demand" }
          ],
          lines: [
            { y: 148.48, label: "Entry (proximal)", kind: "entry" },
            { y: 146.75, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 18, y: 146.29, text: "Last seller" }
          ],
          reveal: 19
        }
      },
      {
        title: "The turn the crowd did not expect",
        narration: "Price rallies away. Strong news created a turn opposite to the majority's view because one side exhausted itself into an objective level.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.57, c: 155.94 },
            { o: 155.94, h: 156.31, l: 153.93, c: 154.32 },
            { o: 154.32, h: 154.73, l: 151.95, c: 152.36 },
            { o: 152.36, h: 152.6, l: 149.35, c: 149.54 },
            { o: 149.54, h: 149.78, l: 147.75, c: 148 },
            { o: 148, h: 148.6, l: 147.05, c: 147.57 },
            { o: 147.57, h: 148.89, l: 147.24, c: 148.48 },
            { o: 148.48, h: 148.93, l: 147.57, c: 148.08 },
            { o: 148.08, h: 152.92, l: 147.99, c: 152.81 },
            { o: 152.81, h: 157.82, l: 152.59, c: 157.67 },
            { o: 157.67, h: 162.22, l: 157.59, c: 162.08 },
            { o: 162.08, h: 164.33, l: 161.55, c: 163.84 },
            { o: 163.84, h: 164.37, l: 163.39, c: 164.12 },
            { o: 164.12, h: 164.72, l: 162.71, c: 163.03 },
            { o: 163.03, h: 164.52, l: 162.46, c: 164.08 },
            { o: 164.08, h: 164.16, l: 158.78, c: 158.86 },
            { o: 158.86, h: 158.99, l: 154.08, c: 154.15 },
            { o: 154.15, h: 154.31, l: 148.83, c: 148.98 },
            { o: 148.98, h: 149.63, l: 147.69, c: 149.38 },
            { o: 149.38, h: 152.09, l: 148.97, c: 151.73 },
            { o: 151.73, h: 153.83, l: 151.42, c: 153.44 },
            { o: 153.44, h: 155.5, l: 152.99, c: 155.07 },
            { o: 155.07, h: 157.51, l: 154.73, c: 157.18 },
            { o: 157.18, h: 159.7, l: 156.75, c: 159.38 }
          ],
          zones: [
            { from: 5, top: 148.48, bottom: 147.05, kind: "demand", label: "A = demand" }
          ],
          lines: [
            { y: 148.48, label: "Entry (proximal)", kind: "entry" },
            { y: 146.75, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 18, y: 146.29, text: "Last seller" },
            { x: 23, y: 161.1, text: "Crowd was wrong" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "If the company news is great and analysts upgrade it, that is a good time to buy.",
        answer: false,
        explain: "When everything looks good, price is usually high. The only question is: is price at a level with more demand than supply?"
      },
      {
        type: "spot",
        q: "Click the candle where the last seller sells into demand.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.57, c: 155.94 },
            { o: 155.94, h: 156.31, l: 153.93, c: 154.32 },
            { o: 154.32, h: 154.73, l: 151.95, c: 152.36 },
            { o: 152.36, h: 152.6, l: 149.35, c: 149.54 },
            { o: 149.54, h: 149.78, l: 147.75, c: 148 },
            { o: 148, h: 148.6, l: 147.05, c: 147.57 },
            { o: 147.57, h: 148.89, l: 147.24, c: 148.48 },
            { o: 148.48, h: 148.93, l: 147.57, c: 148.08 },
            { o: 148.08, h: 152.92, l: 147.99, c: 152.81 },
            { o: 152.81, h: 157.82, l: 152.59, c: 157.67 },
            { o: 157.67, h: 162.22, l: 157.59, c: 162.08 },
            { o: 162.08, h: 164.33, l: 161.55, c: 163.84 },
            { o: 163.84, h: 164.37, l: 163.39, c: 164.12 },
            { o: 164.12, h: 164.72, l: 162.71, c: 163.03 },
            { o: 163.03, h: 164.52, l: 162.46, c: 164.08 },
            { o: 164.08, h: 164.16, l: 158.78, c: 158.86 },
            { o: 158.86, h: 158.99, l: 154.08, c: 154.15 },
            { o: 154.15, h: 154.31, l: 148.83, c: 148.98 },
            { o: 148.98, h: 149.63, l: 147.69, c: 149.38 },
            { o: 149.38, h: 152.09, l: 148.97, c: 151.73 },
            { o: 151.73, h: 153.83, l: 151.42, c: 153.44 },
            { o: 153.44, h: 155.5, l: 152.99, c: 155.07 },
            { o: 155.07, h: 157.51, l: 154.73, c: 157.18 },
            { o: 157.18, h: 159.7, l: 156.75, c: 159.38 }
          ],
          zones: [
            { from: 5, top: 148.48, bottom: 147.05, kind: "demand", label: "A" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "Price reaches demand A on bad news; once the last seller sells, buyers take over."
      },
      {
        type: "mcq",
        q: "What is the only question before buying?",
        options: [
          "Is the news good?",
          "Is price at a level with objectively more demand than supply?",
          "Do analysts agree?",
          "Is the trend exciting?"
        ],
        answer: 1,
        explain: "If price is not at such a level, there is no reason to buy, whatever the news."
      },
      {
        type: "mcq",
        q: "Why does a goose make a good trading model?",
        options: [
          "It flies fast",
          "It acts mechanically without debating its rule",
          "It follows the flock",
          "It reads the weather"
        ],
        answer: 1,
        explain: "Humans decide by emotion; the goose just follows its rule."
      },
      {
        type: "order",
        q: "Order how decisions are made.",
        items: ["Beliefs", "Behaviour patterns", "Actions (buy or sell)"],
        explain: "Beliefs create behaviour and actions. That is why illusions in beliefs cause bad trades."
      }
    ],
    practice: [
      {
        prompt: "Great earnings, an uptrend and broker upgrades are pushing price back up into an old supply level. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 141.71, l: 139.55, c: 141.54 },
            { o: 141.54, h: 144.41, l: 141.19, c: 144.08 },
            { o: 144.08, h: 145.97, l: 143.8, c: 145.55 },
            { o: 145.55, h: 148.85, l: 145.16, c: 148.44 },
            { o: 148.44, h: 150.17, l: 148.22, c: 150 },
            { o: 150, h: 150.57, l: 149.56, c: 150.24 },
            { o: 150.24, h: 150.82, l: 148.53, c: 149.06 },
            { o: 149.06, h: 150.59, l: 148.69, c: 150.04 },
            { o: 150.04, h: 150.22, l: 143.49, c: 143.67 },
            { o: 143.67, h: 143.8, l: 136.87, c: 137.04 },
            { o: 137.04, h: 137.25, l: 136.24, c: 136.51 },
            { o: 136.51, h: 137.83, l: 136.13, c: 137.25 },
            { o: 137.25, h: 137.76, l: 134.18, c: 134.67 },
            { o: 134.67, h: 135.76, l: 134.41, c: 135.54 },
            { o: 135.54, h: 137.95, l: 135.13, c: 137.51 },
            { o: 137.51, h: 140.86, l: 137.18, c: 140.6 },
            { o: 140.6, h: 143.01, l: 140.37, c: 142.74 },
            { o: 142.74, h: 146.65, l: 142.6, c: 146.21 },
            { o: 146.21, h: 148.78, l: 146.04, c: 148.56 },
            { o: 148.56, h: 150.03, l: 147.91, c: 148.16 },
            { o: 148.16, h: 148.6, l: 146.05, c: 146.33 },
            { o: 146.33, h: 146.67, l: 144.31, c: 144.6 },
            { o: 144.6, h: 144.95, l: 142.94, c: 143.08 },
            { o: 143.08, h: 143.39, l: 141.79, c: 142.01 },
            { o: 142.01, h: 142.25, l: 140.02, c: 140.16 }
          ],
          zones: [
            { from: 5, top: 150.82, bottom: 149.06, kind: "supply", label: "Supply" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "The good news delivers the last buyers into supply. Sell at the zone with a stop above. Willing buyers dried up and price fell fast."
      }
    ],
    cards: [
      { front: "Bad news pushes price into demand. Then?", back: "Once the last seller sells, price rises." },
      { front: "Perceived risk lowest means?", back: "Actual risk is often highest." },
      { front: "Do market conditions require a new strategy?", back: "No. Believing they do is an illusion." },
      { front: "Why trade like a goose?", back: "Follow the rule mechanically, without re-debating it." },
      { front: "Illusions are...?", back: "Risk disguised as opportunity." }
    ],
    mnemonic: "Goose, not gossip: follow the rule, not the headlines."
  },
  {
    mentor: "seiden",
    n: 78,
    eli5: {
      oneLiner: "Draw zone lines so most of the trading sits between them.",
      story: "A reader asked: do I draw zones on the candle bodies or the wicks? Seiden says there is no fixed answer, because on another timeframe some wicks become bodies and some bodies become wicks. Look at the base on two timeframes and make sure the vast majority of trading is between your two lines. If your zone ends up wide, keep it but trade a smaller size.",
      analogy: "Like drawing a fence around a herd of sheep: you fence in where nearly all of them stand, not the one sheep that wandered off."
    },
    bigIdeas: [
      "Enclose the vast majority of the trading in the base between two lines.",
      "Check the base on two timeframes: wicks and bodies swap between them.",
      "A wide zone means a wide stop: cut position size so risk stays inside your maximum."
    ],
    steps: [
      {
        title: "A cluster of trading",
        narration: "Price falls, trades in a cluster, then rises above it. Price could only leave upward because demand exceeded supply there.",
        scene: {
          candles: [
            { o: 146, h: 146.2, l: 143.09, c: 143.39 },
            { o: 143.39, h: 143.73, l: 140.91, c: 141.24 },
            { o: 141.24, h: 141.43, l: 137.75, c: 138.15 },
            { o: 138.15, h: 138.6, l: 135.61, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.49, l: 136.21, c: 139.39 },
            { o: 139.39, h: 142.89, l: 139.2, c: 142.67 },
            { o: 142.67, h: 146.46, l: 142.46, c: 146.3 },
            { o: 146.3, h: 146.91, l: 145.91, c: 146.56 },
            { o: 146.56, h: 147.58, l: 146.09, c: 147.3 },
            { o: 147.3, h: 147.49, l: 142.71, c: 143.09 },
            { o: 143.09, h: 143.3, l: 139.97, c: 140.14 },
            { o: 140.14, h: 140.52, l: 136.75, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.58, l: 136.93, c: 139.13 },
            { o: 139.13, h: 141.17, l: 138.69, c: 140.94 },
            { o: 140.94, h: 143.53, l: 140.81, c: 143.3 },
            { o: 143.3, h: 143.68, l: 141.29, c: 141.53 },
            { o: 141.53, h: 141.75, l: 138.32, c: 138.59 },
            { o: 138.59, h: 138.73, l: 136.69, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.67, l: 136.9, c: 139.43 },
            { o: 139.43, h: 141.29, l: 139.14, c: 141.05 },
            { o: 141.05, h: 143.74, l: 140.67, c: 143.3 }
          ],
          highlight: { from: 4, to: 8, label: "the cluster" },
          reveal: 12
        }
      },
      {
        title: "Around everything = very wide",
        narration: "Drawing from the highest high to the lowest low covers every tick, but it makes a very large stop.",
        scene: {
          candles: [
            { o: 146, h: 146.2, l: 143.09, c: 143.39 },
            { o: 143.39, h: 143.73, l: 140.91, c: 141.24 },
            { o: 141.24, h: 141.43, l: 137.75, c: 138.15 },
            { o: 138.15, h: 138.6, l: 135.61, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.49, l: 136.21, c: 139.39 },
            { o: 139.39, h: 142.89, l: 139.2, c: 142.67 },
            { o: 142.67, h: 146.46, l: 142.46, c: 146.3 },
            { o: 146.3, h: 146.91, l: 145.91, c: 146.56 },
            { o: 146.56, h: 147.58, l: 146.09, c: 147.3 },
            { o: 147.3, h: 147.49, l: 142.71, c: 143.09 },
            { o: 143.09, h: 143.3, l: 139.97, c: 140.14 },
            { o: 140.14, h: 140.52, l: 136.75, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.58, l: 136.93, c: 139.13 },
            { o: 139.13, h: 141.17, l: 138.69, c: 140.94 },
            { o: 140.94, h: 143.53, l: 140.81, c: 143.3 },
            { o: 143.3, h: 143.68, l: 141.29, c: 141.53 },
            { o: 141.53, h: 141.75, l: 138.32, c: 138.59 },
            { o: 138.59, h: 138.73, l: 136.69, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.67, l: 136.9, c: 139.43 },
            { o: 139.43, h: 141.29, l: 139.14, c: 141.05 },
            { o: 141.05, h: 143.74, l: 140.67, c: 143.3 }
          ],
          zones: [
            { from: 4, top: 138.4, bottom: 134.5, kind: "demand", label: "Around everything (wide)", faded: true }
          ],
          reveal: 12
        }
      },
      {
        title: "Enclose the majority",
        narration: "Instead, put the top line on the highest body and the bottom line on the lowest wick, so most of the trading is inside. Check a second timeframe to confirm where the bodies really are.",
        scene: {
          candles: [
            { o: 146, h: 146.2, l: 143.09, c: 143.39 },
            { o: 143.39, h: 143.73, l: 140.91, c: 141.24 },
            { o: 141.24, h: 141.43, l: 137.75, c: 138.15 },
            { o: 138.15, h: 138.6, l: 135.61, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.49, l: 136.21, c: 139.39 },
            { o: 139.39, h: 142.89, l: 139.2, c: 142.67 },
            { o: 142.67, h: 146.46, l: 142.46, c: 146.3 },
            { o: 146.3, h: 146.91, l: 145.91, c: 146.56 },
            { o: 146.56, h: 147.58, l: 146.09, c: 147.3 },
            { o: 147.3, h: 147.49, l: 142.71, c: 143.09 },
            { o: 143.09, h: 143.3, l: 139.97, c: 140.14 },
            { o: 140.14, h: 140.52, l: 136.75, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.58, l: 136.93, c: 139.13 },
            { o: 139.13, h: 141.17, l: 138.69, c: 140.94 },
            { o: 140.94, h: 143.53, l: 140.81, c: 143.3 },
            { o: 143.3, h: 143.68, l: 141.29, c: 141.53 },
            { o: 141.53, h: 141.75, l: 138.32, c: 138.59 },
            { o: 138.59, h: 138.73, l: 136.69, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.67, l: 136.9, c: 139.43 },
            { o: 139.43, h: 141.29, l: 139.14, c: 141.05 },
            { o: 141.05, h: 143.74, l: 140.67, c: 143.3 }
          ],
          zones: [
            { from: 4, top: 138.4, bottom: 134.5, kind: "demand", label: "Around everything (wide)", faded: true },
            { from: 4, top: 136.5, bottom: 134.5, kind: "demand", label: "Majority of trading" }
          ],
          reveal: 12
        }
      },
      {
        title: "Buy the returns",
        narration: "Sellers who sell back into this cluster are selling where demand exceeds supply. Price returns twice and bounces both times.",
        scene: {
          candles: [
            { o: 146, h: 146.2, l: 143.09, c: 143.39 },
            { o: 143.39, h: 143.73, l: 140.91, c: 141.24 },
            { o: 141.24, h: 141.43, l: 137.75, c: 138.15 },
            { o: 138.15, h: 138.6, l: 135.61, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.49, l: 136.21, c: 139.39 },
            { o: 139.39, h: 142.89, l: 139.2, c: 142.67 },
            { o: 142.67, h: 146.46, l: 142.46, c: 146.3 },
            { o: 146.3, h: 146.91, l: 145.91, c: 146.56 },
            { o: 146.56, h: 147.58, l: 146.09, c: 147.3 },
            { o: 147.3, h: 147.49, l: 142.71, c: 143.09 },
            { o: 143.09, h: 143.3, l: 139.97, c: 140.14 },
            { o: 140.14, h: 140.52, l: 136.75, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.58, l: 136.93, c: 139.13 },
            { o: 139.13, h: 141.17, l: 138.69, c: 140.94 },
            { o: 140.94, h: 143.53, l: 140.81, c: 143.3 },
            { o: 143.3, h: 143.68, l: 141.29, c: 141.53 },
            { o: 141.53, h: 141.75, l: 138.32, c: 138.59 },
            { o: 138.59, h: 138.73, l: 136.69, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.67, l: 136.9, c: 139.43 },
            { o: 139.43, h: 141.29, l: 139.14, c: 141.05 },
            { o: 141.05, h: 143.74, l: 140.67, c: 143.3 }
          ],
          zones: [
            { from: 4, top: 138.4, bottom: 134.5, kind: "demand", label: "Around everything (wide)", faded: true },
            { from: 4, top: 136.5, bottom: 134.5, kind: "demand", label: "Majority of trading" }
          ],
          lines: [
            { y: 136.5, label: "Entry (proximal)", kind: "entry" },
            { y: 134.2, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 17, y: 134.4, text: "return 1" },
            { x: 24, y: 134.4, text: "return 2" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "There is one fixed rule: always exclude wicks.",
        answer: false,
        explain: "Change the timeframe and some wicks become bodies and some bodies become wicks. Enclose the majority of trading."
      },
      {
        type: "mcq",
        q: "Your zone has to be drawn wide. What do you do?",
        options: [
          "Ignore the risk",
          "Reduce position size so the risk stays inside your maximum",
          "Move the stop inside the zone",
          "Skip all trades forever"
        ],
        answer: 1,
        explain: "Keep the zone honest and cut the size."
      },
      {
        type: "spot",
        q: "Click the cluster of candles that forms the demand.",
        scene: {
          candles: [
            { o: 146, h: 146.2, l: 143.09, c: 143.39 },
            { o: 143.39, h: 143.73, l: 140.91, c: 141.24 },
            { o: 141.24, h: 141.43, l: 137.75, c: 138.15 },
            { o: 138.15, h: 138.6, l: 135.61, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.49, l: 136.21, c: 139.39 },
            { o: 139.39, h: 142.89, l: 139.2, c: 142.67 },
            { o: 142.67, h: 146.46, l: 142.46, c: 146.3 },
            { o: 146.3, h: 146.91, l: 145.91, c: 146.56 },
            { o: 146.56, h: 147.58, l: 146.09, c: 147.3 },
            { o: 147.3, h: 147.49, l: 142.71, c: 143.09 },
            { o: 143.09, h: 143.3, l: 139.97, c: 140.14 },
            { o: 140.14, h: 140.52, l: 136.75, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.58, l: 136.93, c: 139.13 },
            { o: 139.13, h: 141.17, l: 138.69, c: 140.94 },
            { o: 140.94, h: 143.53, l: 140.81, c: 143.3 },
            { o: 143.3, h: 143.68, l: 141.29, c: 141.53 },
            { o: 141.53, h: 141.75, l: 138.32, c: 138.59 },
            { o: 138.59, h: 138.73, l: 136.69, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.67, l: 136.9, c: 139.43 },
            { o: 139.43, h: 141.29, l: 139.14, c: 141.05 },
            { o: 141.05, h: 143.74, l: 140.67, c: 143.3 }
          ]
        },
        answer: { from: 4, to: 8 },
        explain: "The group of candles price rose out of. Most of their trading goes between the two lines."
      },
      {
        type: "mcq",
        q: "How many timeframes should you check the base on?",
        options: ["One", "Two", "Ten", "None"],
        answer: 1,
        explain: "Look at the area on two different timeframes to see where most trading happened."
      },
      {
        type: "mcq",
        q: "Using the candle highs and lows for the zone is...",
        options: ["Wrong", "Fine, but often makes a very large stop", "Required", "Only for supply"],
        answer: 1,
        explain: "It works, but the stop gets big, so size down."
      }
    ],
    practice: [
      {
        prompt: "Draw this demand zone so the vast majority of trading in the base is between your lines (highest body on top, lowest wick on the bottom).",
        scene: {
          candles: [
            { o: 146, h: 146.19, l: 143.6, c: 143.82 },
            { o: 143.82, h: 144.04, l: 139.94, c: 140.39 },
            { o: 140.39, h: 140.81, l: 138.57, c: 138.99 },
            { o: 138.99, h: 139.36, l: 135.8, c: 136 },
            { o: 136, h: 138.4, l: 135.6, c: 136.5 },
            { o: 136.5, h: 136.9, l: 134.5, c: 135.4 },
            { o: 135.4, h: 136.9, l: 135, c: 136.4 },
            { o: 136.4, h: 138.2, l: 135.2, c: 135.7 },
            { o: 135.7, h: 136.7, l: 135.4, c: 136.3 },
            { o: 136.3, h: 139.7, l: 136.19, c: 139.57 },
            { o: 139.57, h: 143.04, l: 139.38, c: 142.88 },
            { o: 142.88, h: 146.43, l: 142.68, c: 146.3 },
            { o: 146.3, h: 148.69, l: 145.68, c: 148.01 },
            { o: 148.01, h: 148.54, l: 146.92, c: 147.3 },
            { o: 147.3, h: 147.65, l: 142.87, c: 143.31 },
            { o: 143.31, h: 143.69, l: 139.87, c: 140.13 },
            { o: 140.13, h: 140.25, l: 136.6, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.2, l: 137.02, c: 138.81 },
            { o: 138.81, h: 141.89, l: 138.49, c: 141.49 },
            { o: 141.49, h: 143.67, l: 141.24, c: 143.3 },
            { o: 143.3, h: 143.56, l: 140.53, c: 140.67 },
            { o: 140.67, h: 140.98, l: 138.39, c: 138.8 },
            { o: 138.8, h: 139.13, l: 136.6, c: 136.9 },
            { o: 136.9, h: 137.55, l: 135.8, c: 137.3 },
            { o: 137.3, h: 139.26, l: 136.95, c: 138.9 },
            { o: 138.9, h: 141.14, l: 138.73, c: 140.91 },
            { o: 140.91, h: 143.44, l: 140.59, c: 143.3 }
          ],
          reveal: 14
        },
        task: "draw-zone",
        answer: { top: 136.5, bottom: 134.5 },
        explain: "Top line on the highest basing body, bottom line on the lowest basing wick: most of the trading is inside. Price came back and bounced from it."
      }
    ],
    cards: [
      { front: "Zone drawing goal?", back: "The vast majority of trading in the base is between the two lines." },
      { front: "Bodies or wicks?", back: "No fixed rule: they swap between timeframes. Check two timeframes." },
      { front: "Wide zone?", back: "Keep it, but cut position size." },
      { front: "Why does price leave a cluster upward?", back: "Demand exceeded supply there." },
      { front: "Seller back into that cluster is?", back: "A novice: buy from him." }
    ],
    mnemonic: "Fence the herd, not the stray: lines around most of the trading."
  },
  {
    mentor: "seiden",
    n: 81,
    eli5: {
      oneLiner: "Wrap each level in two lines and bet price turns inside them.",
      story: "Guessing the exact tick where price turns is hard and adds little money even when you get it right. So Seiden draws two lines around each level and simply bets that price turns somewhere in that area. He buys at the upper demand line and puts his stop just under the lower line. Any entry signal is fine, as long as it fires at the level and not in the middle of nowhere.",
      analogy: "Like catching a ball with a big basket instead of two fingers: you only need it to land somewhere inside."
    },
    bigIdeas: [
      "A level is a zone with two lines, not a single price.",
      "Buy at the upper (proximal) demand line, stop just below the lower (distal) line.",
      "Any trigger is fine - reversal candle, CCI extreme - only if it fires AT a level."
    ],
    steps: [
      {
        title: "Two lines around the level",
        narration: "Wrap the base in two lines: the proximal line on top, the distal line at the bottom. We are only betting price turns in this area.",
        scene: {
          candles: [
            { o: 164, h: 164.25, l: 160.99, c: 161.13 },
            { o: 161.13, h: 161.56, l: 158.66, c: 158.94 },
            { o: 158.94, h: 159.22, l: 156.32, c: 156.48 },
            { o: 156.48, h: 156.9, l: 153.77, c: 154.2 },
            { o: 154.2, h: 154.44, l: 151.82, c: 152 },
            { o: 152, h: 152.67, l: 150.67, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.51, c: 152.37 },
            { o: 152.37, h: 153, l: 151.51, c: 151.96 },
            { o: 151.96, h: 156.22, l: 151.8, c: 156.08 },
            { o: 156.08, h: 161.82, l: 155.89, c: 161.65 },
            { o: 161.65, h: 166.06, l: 161.44, c: 165.96 },
            { o: 165.96, h: 167.84, l: 165.6, c: 167.69 },
            { o: 167.69, h: 169.21, l: 167.46, c: 168.96 },
            { o: 168.96, h: 169.6, l: 168.38, c: 168.75 },
            { o: 168.75, h: 169.53, l: 168.19, c: 168.97 },
            { o: 168.97, h: 169.06, l: 166.69, c: 166.89 },
            { o: 166.89, h: 167.06, l: 164.79, c: 164.97 },
            { o: 164.97, h: 165.03, l: 160.4, c: 160.57 },
            { o: 160.57, h: 160.65, l: 157.06, c: 157.16 },
            { o: 157.16, h: 157.22, l: 152.8, c: 152.87 },
            { o: 152.87, h: 153.52, l: 151.35, c: 153.27 },
            { o: 153.27, h: 156.91, l: 152.99, c: 156.49 },
            { o: 156.49, h: 159.3, l: 156.15, c: 158.86 },
            { o: 158.86, h: 163.62, l: 158.51, c: 163.36 },
            { o: 163.36, h: 166.3, l: 163.15, c: 166.08 },
            { o: 166.08, h: 169.47, l: 165.86, c: 169.15 }
          ],
          zones: [
            { from: 5, top: 152.37, bottom: 150.51, kind: "demand", label: "Demand zone" }
          ],
          reveal: 11
        }
      },
      {
        title: "Entry and stop",
        narration: "Buy when price reaches the upper line. Once filled, the protective stop goes just below the lower line. Size the trade so that loss is one you are comfortable with.",
        scene: {
          candles: [
            { o: 164, h: 164.25, l: 160.99, c: 161.13 },
            { o: 161.13, h: 161.56, l: 158.66, c: 158.94 },
            { o: 158.94, h: 159.22, l: 156.32, c: 156.48 },
            { o: 156.48, h: 156.9, l: 153.77, c: 154.2 },
            { o: 154.2, h: 154.44, l: 151.82, c: 152 },
            { o: 152, h: 152.67, l: 150.67, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.51, c: 152.37 },
            { o: 152.37, h: 153, l: 151.51, c: 151.96 },
            { o: 151.96, h: 156.22, l: 151.8, c: 156.08 },
            { o: 156.08, h: 161.82, l: 155.89, c: 161.65 },
            { o: 161.65, h: 166.06, l: 161.44, c: 165.96 },
            { o: 165.96, h: 167.84, l: 165.6, c: 167.69 },
            { o: 167.69, h: 169.21, l: 167.46, c: 168.96 },
            { o: 168.96, h: 169.6, l: 168.38, c: 168.75 },
            { o: 168.75, h: 169.53, l: 168.19, c: 168.97 },
            { o: 168.97, h: 169.06, l: 166.69, c: 166.89 },
            { o: 166.89, h: 167.06, l: 164.79, c: 164.97 },
            { o: 164.97, h: 165.03, l: 160.4, c: 160.57 },
            { o: 160.57, h: 160.65, l: 157.06, c: 157.16 },
            { o: 157.16, h: 157.22, l: 152.8, c: 152.87 },
            { o: 152.87, h: 153.52, l: 151.35, c: 153.27 },
            { o: 153.27, h: 156.91, l: 152.99, c: 156.49 },
            { o: 156.49, h: 159.3, l: 156.15, c: 158.86 },
            { o: 158.86, h: 163.62, l: 158.51, c: 163.36 },
            { o: 163.36, h: 166.3, l: 163.15, c: 166.08 },
            { o: 166.08, h: 169.47, l: 165.86, c: 169.15 }
          ],
          zones: [
            { from: 5, top: 152.37, bottom: 150.51, kind: "demand", label: "Demand zone" },
            { from: 13, top: 169.6, bottom: 168.75, kind: "supply", label: "Supply target" }
          ],
          lines: [
            { y: 152.37, label: "Entry (proximal)", kind: "entry" },
            { y: 150.21, label: "Stop beyond distal", kind: "sl" },
            { y: 168.75, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 17
        }
      },
      {
        title: "A signal AT the level",
        narration: "A momentum drop into the zone followed by a reversal candle is a valid signal, because it fires at a price where demand likely exceeds supply.",
        scene: {
          candles: [
            { o: 164, h: 164.25, l: 160.99, c: 161.13 },
            { o: 161.13, h: 161.56, l: 158.66, c: 158.94 },
            { o: 158.94, h: 159.22, l: 156.32, c: 156.48 },
            { o: 156.48, h: 156.9, l: 153.77, c: 154.2 },
            { o: 154.2, h: 154.44, l: 151.82, c: 152 },
            { o: 152, h: 152.67, l: 150.67, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.51, c: 152.37 },
            { o: 152.37, h: 153, l: 151.51, c: 151.96 },
            { o: 151.96, h: 156.22, l: 151.8, c: 156.08 },
            { o: 156.08, h: 161.82, l: 155.89, c: 161.65 },
            { o: 161.65, h: 166.06, l: 161.44, c: 165.96 },
            { o: 165.96, h: 167.84, l: 165.6, c: 167.69 },
            { o: 167.69, h: 169.21, l: 167.46, c: 168.96 },
            { o: 168.96, h: 169.6, l: 168.38, c: 168.75 },
            { o: 168.75, h: 169.53, l: 168.19, c: 168.97 },
            { o: 168.97, h: 169.06, l: 166.69, c: 166.89 },
            { o: 166.89, h: 167.06, l: 164.79, c: 164.97 },
            { o: 164.97, h: 165.03, l: 160.4, c: 160.57 },
            { o: 160.57, h: 160.65, l: 157.06, c: 157.16 },
            { o: 157.16, h: 157.22, l: 152.8, c: 152.87 },
            { o: 152.87, h: 153.52, l: 151.35, c: 153.27 },
            { o: 153.27, h: 156.91, l: 152.99, c: 156.49 },
            { o: 156.49, h: 159.3, l: 156.15, c: 158.86 },
            { o: 158.86, h: 163.62, l: 158.51, c: 163.36 },
            { o: 163.36, h: 166.3, l: 163.15, c: 166.08 },
            { o: 166.08, h: 169.47, l: 165.86, c: 169.15 }
          ],
          zones: [
            { from: 5, top: 152.37, bottom: 150.51, kind: "demand", label: "Demand zone" },
            { from: 13, top: 169.6, bottom: 168.75, kind: "supply", label: "Supply target" }
          ],
          lines: [
            { y: 152.37, label: "Entry (proximal)", kind: "entry" },
            { y: 150.21, label: "Stop beyond distal", kind: "sl" },
            { y: 168.75, label: "Target: opposing level", kind: "tp" }
          ],
          highlight: { from: 20, to: 20, label: "reversal at the level" },
          reveal: 21
        }
      },
      {
        title: "Footprints, not colours",
        narration: "Big players cannot hide on the price chart. Read candles as footprints of real buyers and sellers. Price rallies to the supply.",
        scene: {
          candles: [
            { o: 164, h: 164.25, l: 160.99, c: 161.13 },
            { o: 161.13, h: 161.56, l: 158.66, c: 158.94 },
            { o: 158.94, h: 159.22, l: 156.32, c: 156.48 },
            { o: 156.48, h: 156.9, l: 153.77, c: 154.2 },
            { o: 154.2, h: 154.44, l: 151.82, c: 152 },
            { o: 152, h: 152.67, l: 150.67, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.51, c: 152.37 },
            { o: 152.37, h: 153, l: 151.51, c: 151.96 },
            { o: 151.96, h: 156.22, l: 151.8, c: 156.08 },
            { o: 156.08, h: 161.82, l: 155.89, c: 161.65 },
            { o: 161.65, h: 166.06, l: 161.44, c: 165.96 },
            { o: 165.96, h: 167.84, l: 165.6, c: 167.69 },
            { o: 167.69, h: 169.21, l: 167.46, c: 168.96 },
            { o: 168.96, h: 169.6, l: 168.38, c: 168.75 },
            { o: 168.75, h: 169.53, l: 168.19, c: 168.97 },
            { o: 168.97, h: 169.06, l: 166.69, c: 166.89 },
            { o: 166.89, h: 167.06, l: 164.79, c: 164.97 },
            { o: 164.97, h: 165.03, l: 160.4, c: 160.57 },
            { o: 160.57, h: 160.65, l: 157.06, c: 157.16 },
            { o: 157.16, h: 157.22, l: 152.8, c: 152.87 },
            { o: 152.87, h: 153.52, l: 151.35, c: 153.27 },
            { o: 153.27, h: 156.91, l: 152.99, c: 156.49 },
            { o: 156.49, h: 159.3, l: 156.15, c: 158.86 },
            { o: 158.86, h: 163.62, l: 158.51, c: 163.36 },
            { o: 163.36, h: 166.3, l: 163.15, c: 166.08 },
            { o: 166.08, h: 169.47, l: 165.86, c: 169.15 }
          ],
          zones: [
            { from: 5, top: 152.37, bottom: 150.51, kind: "demand", label: "Demand zone" },
            { from: 13, top: 169.6, bottom: 168.75, kind: "supply", label: "Supply target" }
          ],
          lines: [
            { y: 152.37, label: "Entry (proximal)", kind: "entry" },
            { y: 150.21, label: "Stop beyond distal", kind: "sl" },
            { y: 168.75, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 20, y: 149.95, text: "Institutions buying" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Seiden tries to pick the exact tick where price will turn.",
        answer: false,
        explain: "He draws two lines and bets price turns in that area. The exact tick is hard to find and adds little."
      },
      {
        type: "mcq",
        q: "Where does the long entry go?",
        options: [
          "At the lower demand line",
          "At the upper (proximal) demand line",
          "In the middle of nowhere",
          "Above the supply"
        ],
        answer: 1,
        explain: "Buy at the upper line; once filled, stop just below the lower line."
      },
      {
        type: "spot",
        q: "Click the reversal candle that fires at the level.",
        scene: {
          candles: [
            { o: 164, h: 164.25, l: 160.99, c: 161.13 },
            { o: 161.13, h: 161.56, l: 158.66, c: 158.94 },
            { o: 158.94, h: 159.22, l: 156.32, c: 156.48 },
            { o: 156.48, h: 156.9, l: 153.77, c: 154.2 },
            { o: 154.2, h: 154.44, l: 151.82, c: 152 },
            { o: 152, h: 152.67, l: 150.67, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.51, c: 152.37 },
            { o: 152.37, h: 153, l: 151.51, c: 151.96 },
            { o: 151.96, h: 156.22, l: 151.8, c: 156.08 },
            { o: 156.08, h: 161.82, l: 155.89, c: 161.65 },
            { o: 161.65, h: 166.06, l: 161.44, c: 165.96 },
            { o: 165.96, h: 167.84, l: 165.6, c: 167.69 },
            { o: 167.69, h: 169.21, l: 167.46, c: 168.96 },
            { o: 168.96, h: 169.6, l: 168.38, c: 168.75 },
            { o: 168.75, h: 169.53, l: 168.19, c: 168.97 },
            { o: 168.97, h: 169.06, l: 166.69, c: 166.89 },
            { o: 166.89, h: 167.06, l: 164.79, c: 164.97 },
            { o: 164.97, h: 165.03, l: 160.4, c: 160.57 },
            { o: 160.57, h: 160.65, l: 157.06, c: 157.16 },
            { o: 157.16, h: 157.22, l: 152.8, c: 152.87 },
            { o: 152.87, h: 153.52, l: 151.35, c: 153.27 },
            { o: 153.27, h: 156.91, l: 152.99, c: 156.49 },
            { o: 156.49, h: 159.3, l: 156.15, c: 158.86 },
            { o: 158.86, h: 163.62, l: 158.51, c: 163.36 },
            { o: 163.36, h: 166.3, l: 163.15, c: 166.08 },
            { o: 166.08, h: 169.47, l: 165.86, c: 169.15 }
          ],
          zones: [
            { from: 5, top: 152.37, bottom: 150.51, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 20, to: 20 },
        explain: "The candle that dips into the zone and closes back up. A trigger only counts at a level."
      },
      {
        type: "mcq",
        q: "A CCI oversold reading appears far above any demand level. Is it a buy signal?",
        options: [
          "Yes, always",
          "No - triggers only count at a level",
          "Only on Fridays",
          "Only with news"
        ],
        answer: 1,
        explain: "Any signal is fine, but it must fire at a price where demand likely exceeds supply."
      },
      {
        type: "mcq",
        q: "Are market makers \"just manipulating\" price?",
        options: [
          "Yes, so charts are useless",
          "They push price into known supply to invite buyers, then sell - which the chart shows",
          "They never trade",
          "Only in forex"
        ],
        answer: 1,
        explain: "That is how the game is played. The one place they cannot hide is the price chart."
      }
    ],
    practice: [
      {
        prompt: "Price fell fast and printed a nice reversal candle - but it is far above the demand zone. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.21, l: 156.85, c: 157.3 },
            { o: 157.3, h: 157.68, l: 154.42, c: 154.57 },
            { o: 154.57, h: 154.92, l: 151.82, c: 151.96 },
            { o: 151.96, h: 152.28, l: 149.59, c: 150 },
            { o: 150, h: 150.5, l: 148.54, c: 149.05 },
            { o: 149.05, h: 151.64, l: 148.46, c: 151.09 },
            { o: 151.09, h: 151.42, l: 149.51, c: 149.91 },
            { o: 149.91, h: 155.24, l: 149.73, c: 155.04 },
            { o: 155.04, h: 159.29, l: 154.99, c: 159.19 },
            { o: 159.19, h: 164.06, l: 159.04, c: 163.91 },
            { o: 163.91, h: 164.46, l: 163.34, c: 164.21 },
            { o: 164.21, h: 164.57, l: 163.35, c: 163.86 },
            { o: 163.86, h: 166.14, l: 163.45, c: 165.91 },
            { o: 165.91, h: 166.11, l: 163.77, c: 163.9 },
            { o: 163.9, h: 164.1, l: 161.55, c: 161.67 },
            { o: 161.67, h: 161.87, l: 159.79, c: 159.91 },
            { o: 159.91, h: 161.01, l: 158.31, c: 160.81 },
            { o: 160.81, h: 161.02, l: 157.77, c: 157.97 },
            { o: 157.97, h: 158.1, l: 154.69, c: 154.87 },
            { o: 154.87, h: 155, l: 151.54, c: 151.59 },
            { o: 151.59, h: 152.34, l: 149.78, c: 152.09 },
            { o: 152.09, h: 153.85, l: 151.68, c: 153.59 },
            { o: 153.59, h: 155.59, l: 153.46, c: 155.27 },
            { o: 155.27, h: 157.37, l: 155.07, c: 157.15 },
            { o: 157.15, h: 159.53, l: 156.76, c: 159.09 }
          ],
          zones: [
            { from: 4, top: 151.09, bottom: 148.46, kind: "demand", label: "Demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The signal fired in the middle of nowhere, not at a level. No trade. Price kept falling to the real demand below."
      },
      {
        prompt: "Price is returning to a fresh two-line demand zone with supply far above. Pick entry, stop and target.",
        scene: {
          candles: [
            { o: 158, h: 158.16, l: 155.25, c: 155.63 },
            { o: 155.63, h: 155.82, l: 152.82, c: 153.19 },
            { o: 153.19, h: 153.46, l: 151.64, c: 151.8 },
            { o: 151.8, h: 152.21, l: 148.41, c: 148.8 },
            { o: 148.8, h: 149.1, l: 146.87, c: 147 },
            { o: 147, h: 147.37, l: 145.62, c: 145.97 },
            { o: 145.97, h: 148.36, l: 145.38, c: 147.87 },
            { o: 147.87, h: 148.23, l: 146.4, c: 147.06 },
            { o: 147.06, h: 153.33, l: 146.92, c: 153.23 },
            { o: 153.23, h: 160.18, l: 153.04, c: 160.06 },
            { o: 160.06, h: 162.21, l: 159.63, c: 161.78 },
            { o: 161.78, h: 163.25, l: 161.42, c: 163.06 },
            { o: 163.06, h: 163.66, l: 162.23, c: 162.82 },
            { o: 162.82, h: 163.62, l: 162.39, c: 163 },
            { o: 163, h: 163.22, l: 160.92, c: 161.05 },
            { o: 161.05, h: 161.13, l: 158.78, c: 159 },
            { o: 159, h: 159.14, l: 156.49, c: 156.64 },
            { o: 156.64, h: 156.84, l: 153.82, c: 154 },
            { o: 154, h: 154.13, l: 151.06, c: 151.16 },
            { o: 151.16, h: 151.36, l: 148.31, c: 148.37 },
            { o: 148.37, h: 149.02, l: 146.5, c: 148.77 },
            { o: 148.77, h: 151.47, l: 148.36, c: 151.12 },
            { o: 151.12, h: 155.62, l: 150.77, c: 155.24 },
            { o: 155.24, h: 157.48, l: 154.92, c: 157.34 },
            { o: 157.34, h: 160.41, l: 156.93, c: 160.01 },
            { o: 160.01, h: 163.61, l: 159.59, c: 163.22 }
          ],
          zones: [
            { from: 5, top: 147.87, bottom: 145.38, kind: "demand", label: "Demand" },
            { from: 12, top: 163.66, bottom: 162.82, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { entry: 147.87, sl: 145.08, tp: 162.82 },
        explain: "Entry at the upper line, stop just under the lower line, target at the opposing supply."
      }
    ],
    cards: [
      { front: "How many lines per level?", back: "Two: proximal and distal." },
      { front: "Long entry?", back: "At the upper (proximal) demand line." },
      { front: "Long stop?", back: "Just below the lower (distal) demand line." },
      { front: "Which entry signals are allowed?", back: "Any - as long as it fires at a supply or demand level." },
      { front: "Where can institutions not hide?", back: "On the price chart." },
      { front: "Whose ideas is this method?", back: "Adam Smith's supply and demand and Newton's laws of motion." }
    ],
    mnemonic: "Basket, not fingers: catch the turn anywhere between two lines."
  },
  {
    mentor: "seiden",
    n: 82,
    eli5: {
      oneLiner: "When a level is used up, price breaks through it. Buy the breakout.",
      story: "Think of chopping a tree. The first chop takes a big chunk, and every chop after removes a bit more wood. Each time price hits resistance, some sellers there get filled, so the drop gets smaller. When price stops dropping and just sits right under the line, the sellers are gone and the tree is about to fall. A broken trend line works the same way: it shows the other side has become stronger.",
      analogy: "Like a rookie card for sale: once the last card at today's price is sold, the price has to go up."
    },
    bigIdeas: [
      "Repeated tests with shrinking reactions mean the level's orders are being used up.",
      "Basing right AT the level, then the break, is the low-risk breakout buy.",
      "Trend-line break: needs two points; target the origin of the whole trend."
    ],
    steps: [
      {
        title: "Read the level left to right",
        narration: "The first visit to resistance gives the deepest drop: supply greatly exceeds demand there.",
        scene: {
          candles: [
            { o: 150, h: 153.63, l: 149.55, c: 153.42 },
            { o: 153.42, h: 157.26, l: 153.27, c: 156.88 },
            { o: 156.88, h: 159.85, l: 156.74, c: 159.5 },
            { o: 159.5, h: 160, l: 157.7, c: 158 },
            { o: 158, h: 158.32, l: 154.04, c: 154.45 },
            { o: 154.45, h: 154.74, l: 151.21, c: 151.5 },
            { o: 151.5, h: 155.1, l: 151.14, c: 154.77 },
            { o: 154.77, h: 156.85, l: 154.62, c: 156.72 },
            { o: 156.72, h: 159.82, l: 156.31, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.17, l: 155.74, c: 155.96 },
            { o: 155.96, h: 156.27, l: 154.19, c: 154.5 },
            { o: 154.5, h: 156.44, l: 154.35, c: 156.19 },
            { o: 156.19, h: 158.1, l: 155.97, c: 157.96 },
            { o: 157.96, h: 159.77, l: 157.82, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.19, l: 157.06, c: 157.47 },
            { o: 157.47, h: 157.92, l: 156.58, c: 157 },
            { o: 157, h: 158.03, l: 156.59, c: 157.77 },
            { o: 157.77, h: 158.76, l: 157.34, c: 158.58 },
            { o: 158.58, h: 159.59, l: 158.3, c: 159.4 },
            { o: 159.4, h: 159.7, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 159.8, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 162.01, l: 159.37, c: 161.8 },
            { o: 161.8, h: 163.06, l: 161.54, c: 162.87 },
            { o: 162.87, h: 165.02, l: 162.55, c: 164.86 },
            { o: 164.86, h: 165.87, l: 164.64, c: 165.66 },
            { o: 165.66, h: 167.35, l: 165.22, c: 167.21 },
            { o: 167.21, h: 169.1, l: 166.84, c: 168.8 }
          ],
          lines: [
            { y: 160, label: "Resistance", kind: "level" }
          ],
          highlight: { from: 4, to: 5, label: "deep drop" },
          reveal: 6
        }
      },
      {
        title: "Each chop removes wood",
        narration: "Each later visit fills more sell orders, so the drops get smaller and smaller. The equation is moving toward balance.",
        scene: {
          candles: [
            { o: 150, h: 153.63, l: 149.55, c: 153.42 },
            { o: 153.42, h: 157.26, l: 153.27, c: 156.88 },
            { o: 156.88, h: 159.85, l: 156.74, c: 159.5 },
            { o: 159.5, h: 160, l: 157.7, c: 158 },
            { o: 158, h: 158.32, l: 154.04, c: 154.45 },
            { o: 154.45, h: 154.74, l: 151.21, c: 151.5 },
            { o: 151.5, h: 155.1, l: 151.14, c: 154.77 },
            { o: 154.77, h: 156.85, l: 154.62, c: 156.72 },
            { o: 156.72, h: 159.82, l: 156.31, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.17, l: 155.74, c: 155.96 },
            { o: 155.96, h: 156.27, l: 154.19, c: 154.5 },
            { o: 154.5, h: 156.44, l: 154.35, c: 156.19 },
            { o: 156.19, h: 158.1, l: 155.97, c: 157.96 },
            { o: 157.96, h: 159.77, l: 157.82, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.19, l: 157.06, c: 157.47 },
            { o: 157.47, h: 157.92, l: 156.58, c: 157 },
            { o: 157, h: 158.03, l: 156.59, c: 157.77 },
            { o: 157.77, h: 158.76, l: 157.34, c: 158.58 },
            { o: 158.58, h: 159.59, l: 158.3, c: 159.4 },
            { o: 159.4, h: 159.7, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 159.8, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 162.01, l: 159.37, c: 161.8 },
            { o: 161.8, h: 163.06, l: 161.54, c: 162.87 },
            { o: 162.87, h: 165.02, l: 162.55, c: 164.86 },
            { o: 164.86, h: 165.87, l: 164.64, c: 165.66 },
            { o: 165.66, h: 167.35, l: 165.22, c: 167.21 },
            { o: 167.21, h: 169.1, l: 166.84, c: 168.8 }
          ],
          lines: [
            { y: 160, label: "Resistance", kind: "level" }
          ],
          notes: [
            { x: 3, y: 161.4, text: "1" },
            { x: 9, y: 161.4, text: "2" },
            { x: 15, y: 161.4, text: "3" }
          ],
          highlight: { from: 9, to: 9, label: "shallower" },
          reveal: 18
        }
      },
      {
        title: "Basing AT the line",
        narration: "Now price stops falling and bases sideways right under the line. There are no longer more sellers than buyers. Get ready to buy the break.",
        scene: {
          candles: [
            { o: 150, h: 153.63, l: 149.55, c: 153.42 },
            { o: 153.42, h: 157.26, l: 153.27, c: 156.88 },
            { o: 156.88, h: 159.85, l: 156.74, c: 159.5 },
            { o: 159.5, h: 160, l: 157.7, c: 158 },
            { o: 158, h: 158.32, l: 154.04, c: 154.45 },
            { o: 154.45, h: 154.74, l: 151.21, c: 151.5 },
            { o: 151.5, h: 155.1, l: 151.14, c: 154.77 },
            { o: 154.77, h: 156.85, l: 154.62, c: 156.72 },
            { o: 156.72, h: 159.82, l: 156.31, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.17, l: 155.74, c: 155.96 },
            { o: 155.96, h: 156.27, l: 154.19, c: 154.5 },
            { o: 154.5, h: 156.44, l: 154.35, c: 156.19 },
            { o: 156.19, h: 158.1, l: 155.97, c: 157.96 },
            { o: 157.96, h: 159.77, l: 157.82, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.19, l: 157.06, c: 157.47 },
            { o: 157.47, h: 157.92, l: 156.58, c: 157 },
            { o: 157, h: 158.03, l: 156.59, c: 157.77 },
            { o: 157.77, h: 158.76, l: 157.34, c: 158.58 },
            { o: 158.58, h: 159.59, l: 158.3, c: 159.4 },
            { o: 159.4, h: 159.7, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 159.8, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 162.01, l: 159.37, c: 161.8 },
            { o: 161.8, h: 163.06, l: 161.54, c: 162.87 },
            { o: 162.87, h: 165.02, l: 162.55, c: 164.86 },
            { o: 164.86, h: 165.87, l: 164.64, c: 165.66 },
            { o: 165.66, h: 167.35, l: 165.22, c: 167.21 },
            { o: 167.21, h: 169.1, l: 166.84, c: 168.8 }
          ],
          lines: [
            { y: 160, label: "Resistance", kind: "level" }
          ],
          notes: [
            { x: 3, y: 161.4, text: "1" },
            { x: 9, y: 161.4, text: "2" },
            { x: 15, y: 161.4, text: "3" }
          ],
          highlight: { from: 21, to: 24, label: "basing at the level" },
          reveal: 25
        }
      },
      {
        title: "Buy the breakout",
        narration: "Price breaks through. Enter on the break with the stop below the small base. Risk management comes first: the entry is just the start of the plan.",
        scene: {
          candles: [
            { o: 150, h: 153.63, l: 149.55, c: 153.42 },
            { o: 153.42, h: 157.26, l: 153.27, c: 156.88 },
            { o: 156.88, h: 159.85, l: 156.74, c: 159.5 },
            { o: 159.5, h: 160, l: 157.7, c: 158 },
            { o: 158, h: 158.32, l: 154.04, c: 154.45 },
            { o: 154.45, h: 154.74, l: 151.21, c: 151.5 },
            { o: 151.5, h: 155.1, l: 151.14, c: 154.77 },
            { o: 154.77, h: 156.85, l: 154.62, c: 156.72 },
            { o: 156.72, h: 159.82, l: 156.31, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.17, l: 155.74, c: 155.96 },
            { o: 155.96, h: 156.27, l: 154.19, c: 154.5 },
            { o: 154.5, h: 156.44, l: 154.35, c: 156.19 },
            { o: 156.19, h: 158.1, l: 155.97, c: 157.96 },
            { o: 157.96, h: 159.77, l: 157.82, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.19, l: 157.06, c: 157.47 },
            { o: 157.47, h: 157.92, l: 156.58, c: 157 },
            { o: 157, h: 158.03, l: 156.59, c: 157.77 },
            { o: 157.77, h: 158.76, l: 157.34, c: 158.58 },
            { o: 158.58, h: 159.59, l: 158.3, c: 159.4 },
            { o: 159.4, h: 159.7, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 159.8, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 162.01, l: 159.37, c: 161.8 },
            { o: 161.8, h: 163.06, l: 161.54, c: 162.87 },
            { o: 162.87, h: 165.02, l: 162.55, c: 164.86 },
            { o: 164.86, h: 165.87, l: 164.64, c: 165.66 },
            { o: 165.66, h: 167.35, l: 165.22, c: 167.21 },
            { o: 167.21, h: 169.1, l: 166.84, c: 168.8 }
          ],
          lines: [
            { y: 160, label: "Resistance", kind: "level" },
            { y: 158.4, label: "Stop below the base", kind: "sl", from: 25 }
          ],
          notes: [
            { x: 3, y: 161.4, text: "1" },
            { x: 9, y: 161.4, text: "2" },
            { x: 15, y: 161.4, text: "3" },
            { x: 25, y: 163.41, text: "Breakout buy" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Why do the drops from resistance get smaller on each visit?",
        options: [
          "Buyers get tired",
          "Each visit fills more of the resting sell orders",
          "Moving averages flatten",
          "Random chance"
        ],
        answer: 1,
        explain: "Like chopping a tree: each visit removes some of the mass (supply) at the level."
      },
      {
        type: "spot",
        q: "Click the candles basing right at the line - the signal sellers are used up.",
        scene: {
          candles: [
            { o: 150, h: 153.63, l: 149.55, c: 153.42 },
            { o: 153.42, h: 157.26, l: 153.27, c: 156.88 },
            { o: 156.88, h: 159.85, l: 156.74, c: 159.5 },
            { o: 159.5, h: 160, l: 157.7, c: 158 },
            { o: 158, h: 158.32, l: 154.04, c: 154.45 },
            { o: 154.45, h: 154.74, l: 151.21, c: 151.5 },
            { o: 151.5, h: 155.1, l: 151.14, c: 154.77 },
            { o: 154.77, h: 156.85, l: 154.62, c: 156.72 },
            { o: 156.72, h: 159.82, l: 156.31, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.17, l: 155.74, c: 155.96 },
            { o: 155.96, h: 156.27, l: 154.19, c: 154.5 },
            { o: 154.5, h: 156.44, l: 154.35, c: 156.19 },
            { o: 156.19, h: 158.1, l: 155.97, c: 157.96 },
            { o: 157.96, h: 159.77, l: 157.82, c: 159.4 },
            { o: 159.4, h: 160, l: 157.6, c: 157.9 },
            { o: 157.9, h: 158.19, l: 157.06, c: 157.47 },
            { o: 157.47, h: 157.92, l: 156.58, c: 157 },
            { o: 157, h: 158.03, l: 156.59, c: 157.77 },
            { o: 157.77, h: 158.76, l: 157.34, c: 158.58 },
            { o: 158.58, h: 159.59, l: 158.3, c: 159.4 },
            { o: 159.4, h: 159.7, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 159.8, l: 158.7, c: 159 },
            { o: 159, h: 159.8, l: 158.7, c: 159.5 },
            { o: 159.5, h: 162.01, l: 159.37, c: 161.8 },
            { o: 161.8, h: 163.06, l: 161.54, c: 162.87 },
            { o: 162.87, h: 165.02, l: 162.55, c: 164.86 },
            { o: 164.86, h: 165.87, l: 164.64, c: 165.66 },
            { o: 165.66, h: 167.35, l: 165.22, c: 167.21 },
            { o: 167.21, h: 169.1, l: 166.84, c: 168.8 }
          ],
          lines: [
            { y: 160, label: "Resistance", kind: "level" }
          ]
        },
        answer: { from: 21, to: 24 },
        explain: "Price stops rejecting and sits under the line. That is when you get ready to buy the breakout."
      },
      {
        type: "tf",
        q: "A trend line can be drawn from a single point.",
        answer: false,
        explain: "A trend line needs two points before it can be drawn."
      },
      {
        type: "mcq",
        q: "After a down-trend line break, what is one logical target?",
        options: [
          "The break candle high",
          "The origin of the move that started the trend",
          "Half the stop",
          "There is none"
        ],
        answer: 1,
        explain: "Target the origin of the whole move the trend line contained."
      },
      {
        type: "mcq",
        q: "In an uptrend, what does Seiden do instead of guessing where supply is?",
        options: [
          "Buy more",
          "Sell short on the break below the up-trend line",
          "Wait a week",
          "Use a CCI"
        ],
        answer: 1,
        explain: "Connect the pivot lows and short the breakdown."
      },
      {
        type: "order",
        q: "Order the consumed-level breakout.",
        items: [
          "First visit: deep rejection",
          "Later visits: smaller and smaller drops",
          "Price bases right at the level",
          "Buy the break, stop below the base"
        ],
        explain: "Read left to right, watch the orders get used up, then act on the break."
      }
    ],
    practice: [
      {
        prompt: "A down-trend line connects the pivot high and a lower high. A green candle has just broken above it. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 158, h: 162.68, l: 157.83, c: 162.31 },
            { o: 162.31, h: 165.15, l: 161.97, c: 165 },
            { o: 165, h: 166, l: 163.2, c: 163.5 },
            { o: 163.5, h: 163.9, l: 162.3, c: 162.7 },
            { o: 162.7, h: 162.8, l: 160.9, c: 161.3 },
            { o: 161.3, h: 161.4, l: 159.5, c: 159.9 },
            { o: 159.9, h: 160, l: 158.1, c: 158.5 },
            { o: 158.5, h: 158.95, l: 156.7, c: 157.1 },
            { o: 157.1, h: 157.2, l: 155.3, c: 155.7 },
            { o: 155.7, h: 155.8, l: 153.9, c: 154.3 },
            { o: 154.3, h: 154.4, l: 152.5, c: 152.9 },
            { o: 152.9, h: 153, l: 151.1, c: 151.5 },
            { o: 151.5, h: 151.6, l: 149.7, c: 150.1 },
            { o: 150.1, h: 152.2, l: 149.8, c: 151.9 },
            { o: 151.9, h: 154.54, l: 151.59, c: 154.14 },
            { o: 154.14, h: 156.39, l: 153.74, c: 156.22 },
            { o: 156.22, h: 159.28, l: 156.02, c: 159.02 },
            { o: 159.02, h: 161.45, l: 158.83, c: 161.01 },
            { o: 161.01, h: 164.28, l: 160.75, c: 163.91 },
            { o: 163.91, h: 166.64, l: 163.68, c: 166.3 }
          ],
          trendlines: [
            { x1: 2, y1: 166, x2: 13, y2: 150.6, label: "down-trend line" }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: { side: "buy", sl: 149.4, tp: 165.7 },
        explain: "The break shows price reached a level where buyers now outnumber sellers. Buy, stop under the low, target the origin of the decline. Price got there."
      },
      {
        prompt: "An up-trend line connects the rising lows. A red candle has just broken below it. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 142, h: 142.22, l: 138.44, c: 138.65 },
            { o: 138.65, h: 138.81, l: 134.7, c: 135 },
            { o: 135, h: 136.8, l: 134, c: 136.5 },
            { o: 136.5, h: 137.7, l: 136.1, c: 137.3 },
            { o: 137.3, h: 139.1, l: 137.2, c: 138.7 },
            { o: 138.7, h: 140.5, l: 138.6, c: 140.1 },
            { o: 140.1, h: 141.9, l: 140, c: 141.5 },
            { o: 141.5, h: 143.3, l: 141.05, c: 142.9 },
            { o: 142.9, h: 144.7, l: 142.8, c: 144.3 },
            { o: 144.3, h: 146.1, l: 144.2, c: 145.7 },
            { o: 145.7, h: 147.5, l: 145.6, c: 147.1 },
            { o: 147.1, h: 148.9, l: 147, c: 148.5 },
            { o: 148.5, h: 150.3, l: 148.4, c: 149.9 },
            { o: 149.9, h: 150.2, l: 147.8, c: 148.1 },
            { o: 148.1, h: 148.45, l: 146.03, c: 146.21 },
            { o: 146.21, h: 146.6, l: 142.5, c: 142.79 },
            { o: 142.79, h: 142.95, l: 140.91, c: 141.3 },
            { o: 141.3, h: 141.52, l: 138.67, c: 138.98 },
            { o: 138.98, h: 139.3, l: 135.86, c: 136.31 },
            { o: 136.31, h: 136.65, l: 133.49, c: 133.7 }
          ],
          trendlines: [
            { x1: 2, y1: 134, x2: 13, y2: 149.4, label: "up-trend line" }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: { side: "sell", sl: 150.6, tp: 134.3 },
        explain: "Mirror image: short the break of the up-trend line, target the origin of the rally. Price fell back to it."
      }
    ],
    cards: [
      { front: "Shrinking reactions at resistance mean?", back: "The sell orders there are being used up." },
      { front: "The key tell before a breakout?", back: "Price bases right at the level instead of rejecting." },
      { front: "Tree-chopping analogy?", back: "Each visit removes mass (orders) until the level gives way." },
      { front: "Points needed for a trend line?", back: "Two." },
      { front: "Target after a trend-line break?", back: "The origin of the move that started the trend." },
      { front: "Most important part of trading?", back: "Risk management; the entry is only the start." }
    ],
    mnemonic: "Chop, chop, sit, fall: shrinking bounces, basing at the line, then the break."
  },
  {
    mentor: "seiden",
    n: 87,
    eli5: {
      oneLiner: "A spot price could not stay at beats a spot where it sat around.",
      story: "Ask why price could not stay somewhere. At a pivot low, price spiked down and left at once, so buyers hugely outnumbered sellers. At a cluster, price sat around for a long time, so buyers and sellers were only a little out of balance. When a strong move comes out of the pivot, it slices through the cluster like a hot knife through butter.",
      analogy: "Like touching a hot stove versus a warm mug: you pull your hand off the stove instantly, but you can hold the mug all day."
    },
    bigIdeas: [
      "Pivot (price could not stay) = big imbalance = strong level.",
      "Cluster (price stayed a long time) = mild imbalance = weaker level.",
      "Buy the first pullback into the pivot; expect clusters to give way."
    ],
    steps: [
      {
        title: "A: pivot lows",
        narration: "Price spikes down and leaves immediately, again and again. It cannot stay here: demand is far greater than supply.",
        scene: {
          candles: [
            { o: 156, h: 156.05, l: 152.46, c: 152.67 },
            { o: 152.67, h: 152.85, l: 149.7, c: 149.75 },
            { o: 149.75, h: 149.82, l: 145.92, c: 146.01 },
            { o: 146.01, h: 146.14, l: 142.83, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.1, l: 143.7, c: 148.91 },
            { o: 148.91, h: 153.95, l: 148.75, c: 153.77 },
            { o: 153.77, h: 157.99, l: 153.62, c: 157.82 },
            { o: 157.82, h: 162.92, l: 157.74, c: 162.8 },
            { o: 162.8, h: 163.87, l: 162.32, c: 163.66 },
            { o: 163.66, h: 164.03, l: 163.03, c: 163.8 },
            { o: 163.8, h: 164.22, l: 160.52, c: 160.96 },
            { o: 160.96, h: 161.28, l: 158.16, c: 158.33 },
            { o: 158.33, h: 158.71, l: 155.37, c: 155.8 },
            { o: 155.8, h: 156.17, l: 154.88, c: 155.41 },
            { o: 155.41, h: 156.89, l: 155.01, c: 156.23 },
            { o: 156.23, h: 156.73, l: 154.32, c: 154.99 },
            { o: 154.99, h: 156.66, l: 154.59, c: 156.18 },
            { o: 156.18, h: 156.61, l: 154.64, c: 155.01 },
            { o: 155.01, h: 156.32, l: 154.47, c: 155.75 },
            { o: 155.75, h: 155.9, l: 152.52, c: 152.82 },
            { o: 152.82, h: 153.03, l: 150.25, c: 150.63 },
            { o: 150.63, h: 150.76, l: 146.98, c: 147.23 },
            { o: 147.23, h: 147.36, l: 144.31, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.25, l: 144.93, c: 148.19 },
            { o: 148.19, h: 151.84, l: 147.99, c: 151.67 },
            { o: 151.67, h: 154.74, l: 151.61, c: 154.64 },
            { o: 154.64, h: 158.36, l: 154.43, c: 158.24 },
            { o: 158.24, h: 161.24, l: 158.09, c: 161.1 }
          ],
          zones: [
            { from: 4, top: 144.1, bottom: 141.2, kind: "demand", label: "A: pivot demand" }
          ],
          highlight: { from: 4, to: 6, label: "price cannot stay" },
          reveal: 11
        }
      },
      {
        title: "B: a cluster",
        narration: "On the way down, price lingers sideways for many candles. Supply and demand were only mildly out of balance here.",
        scene: {
          candles: [
            { o: 156, h: 156.05, l: 152.46, c: 152.67 },
            { o: 152.67, h: 152.85, l: 149.7, c: 149.75 },
            { o: 149.75, h: 149.82, l: 145.92, c: 146.01 },
            { o: 146.01, h: 146.14, l: 142.83, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.1, l: 143.7, c: 148.91 },
            { o: 148.91, h: 153.95, l: 148.75, c: 153.77 },
            { o: 153.77, h: 157.99, l: 153.62, c: 157.82 },
            { o: 157.82, h: 162.92, l: 157.74, c: 162.8 },
            { o: 162.8, h: 163.87, l: 162.32, c: 163.66 },
            { o: 163.66, h: 164.03, l: 163.03, c: 163.8 },
            { o: 163.8, h: 164.22, l: 160.52, c: 160.96 },
            { o: 160.96, h: 161.28, l: 158.16, c: 158.33 },
            { o: 158.33, h: 158.71, l: 155.37, c: 155.8 },
            { o: 155.8, h: 156.17, l: 154.88, c: 155.41 },
            { o: 155.41, h: 156.89, l: 155.01, c: 156.23 },
            { o: 156.23, h: 156.73, l: 154.32, c: 154.99 },
            { o: 154.99, h: 156.66, l: 154.59, c: 156.18 },
            { o: 156.18, h: 156.61, l: 154.64, c: 155.01 },
            { o: 155.01, h: 156.32, l: 154.47, c: 155.75 },
            { o: 155.75, h: 155.9, l: 152.52, c: 152.82 },
            { o: 152.82, h: 153.03, l: 150.25, c: 150.63 },
            { o: 150.63, h: 150.76, l: 146.98, c: 147.23 },
            { o: 147.23, h: 147.36, l: 144.31, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.25, l: 144.93, c: 148.19 },
            { o: 148.19, h: 151.84, l: 147.99, c: 151.67 },
            { o: 151.67, h: 154.74, l: 151.61, c: 154.64 },
            { o: 154.64, h: 158.36, l: 154.43, c: 158.24 },
            { o: 158.24, h: 161.24, l: 158.09, c: 161.1 }
          ],
          zones: [
            { from: 4, top: 144.1, bottom: 141.2, kind: "demand", label: "A: pivot demand" },
            { from: 16, top: 156.23, bottom: 154.32, kind: "demand", label: "B: cluster (weak)", faded: true }
          ],
          highlight: { from: 16, to: 21, label: "price stayed" },
          reveal: 22
        }
      },
      {
        title: "The cluster gives way",
        narration: "Price slips through the cluster easily and falls back toward A.",
        scene: {
          candles: [
            { o: 156, h: 156.05, l: 152.46, c: 152.67 },
            { o: 152.67, h: 152.85, l: 149.7, c: 149.75 },
            { o: 149.75, h: 149.82, l: 145.92, c: 146.01 },
            { o: 146.01, h: 146.14, l: 142.83, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.1, l: 143.7, c: 148.91 },
            { o: 148.91, h: 153.95, l: 148.75, c: 153.77 },
            { o: 153.77, h: 157.99, l: 153.62, c: 157.82 },
            { o: 157.82, h: 162.92, l: 157.74, c: 162.8 },
            { o: 162.8, h: 163.87, l: 162.32, c: 163.66 },
            { o: 163.66, h: 164.03, l: 163.03, c: 163.8 },
            { o: 163.8, h: 164.22, l: 160.52, c: 160.96 },
            { o: 160.96, h: 161.28, l: 158.16, c: 158.33 },
            { o: 158.33, h: 158.71, l: 155.37, c: 155.8 },
            { o: 155.8, h: 156.17, l: 154.88, c: 155.41 },
            { o: 155.41, h: 156.89, l: 155.01, c: 156.23 },
            { o: 156.23, h: 156.73, l: 154.32, c: 154.99 },
            { o: 154.99, h: 156.66, l: 154.59, c: 156.18 },
            { o: 156.18, h: 156.61, l: 154.64, c: 155.01 },
            { o: 155.01, h: 156.32, l: 154.47, c: 155.75 },
            { o: 155.75, h: 155.9, l: 152.52, c: 152.82 },
            { o: 152.82, h: 153.03, l: 150.25, c: 150.63 },
            { o: 150.63, h: 150.76, l: 146.98, c: 147.23 },
            { o: 147.23, h: 147.36, l: 144.31, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.25, l: 144.93, c: 148.19 },
            { o: 148.19, h: 151.84, l: 147.99, c: 151.67 },
            { o: 151.67, h: 154.74, l: 151.61, c: 154.64 },
            { o: 154.64, h: 158.36, l: 154.43, c: 158.24 },
            { o: 158.24, h: 161.24, l: 158.09, c: 161.1 }
          ],
          zones: [
            { from: 4, top: 144.1, bottom: 141.2, kind: "demand", label: "A: pivot demand" },
            { from: 16, top: 156.23, bottom: 154.32, kind: "demand", label: "B: cluster (weak)", faded: true }
          ],
          highlight: { from: 22, to: 22, label: "cluster breaks" },
          reveal: 26
        }
      },
      {
        title: "C and D: buy A, slice through B",
        narration: "The first pullback into A is the low-risk buy, stop under the lower line. The rally from A cuts straight through the cluster.",
        scene: {
          candles: [
            { o: 156, h: 156.05, l: 152.46, c: 152.67 },
            { o: 152.67, h: 152.85, l: 149.7, c: 149.75 },
            { o: 149.75, h: 149.82, l: 145.92, c: 146.01 },
            { o: 146.01, h: 146.14, l: 142.83, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.1, l: 143.7, c: 148.91 },
            { o: 148.91, h: 153.95, l: 148.75, c: 153.77 },
            { o: 153.77, h: 157.99, l: 153.62, c: 157.82 },
            { o: 157.82, h: 162.92, l: 157.74, c: 162.8 },
            { o: 162.8, h: 163.87, l: 162.32, c: 163.66 },
            { o: 163.66, h: 164.03, l: 163.03, c: 163.8 },
            { o: 163.8, h: 164.22, l: 160.52, c: 160.96 },
            { o: 160.96, h: 161.28, l: 158.16, c: 158.33 },
            { o: 158.33, h: 158.71, l: 155.37, c: 155.8 },
            { o: 155.8, h: 156.17, l: 154.88, c: 155.41 },
            { o: 155.41, h: 156.89, l: 155.01, c: 156.23 },
            { o: 156.23, h: 156.73, l: 154.32, c: 154.99 },
            { o: 154.99, h: 156.66, l: 154.59, c: 156.18 },
            { o: 156.18, h: 156.61, l: 154.64, c: 155.01 },
            { o: 155.01, h: 156.32, l: 154.47, c: 155.75 },
            { o: 155.75, h: 155.9, l: 152.52, c: 152.82 },
            { o: 152.82, h: 153.03, l: 150.25, c: 150.63 },
            { o: 150.63, h: 150.76, l: 146.98, c: 147.23 },
            { o: 147.23, h: 147.36, l: 144.31, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.25, l: 144.93, c: 148.19 },
            { o: 148.19, h: 151.84, l: 147.99, c: 151.67 },
            { o: 151.67, h: 154.74, l: 151.61, c: 154.64 },
            { o: 154.64, h: 158.36, l: 154.43, c: 158.24 },
            { o: 158.24, h: 161.24, l: 158.09, c: 161.1 }
          ],
          zones: [
            { from: 4, top: 144.1, bottom: 141.2, kind: "demand", label: "A: pivot demand" },
            { from: 16, top: 156.23, bottom: 154.32, kind: "demand", label: "B: cluster (weak)", faded: true }
          ],
          lines: [
            { y: 144.1, label: "Entry (proximal)", kind: "entry" },
            { y: 140.9, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 26, y: 141.25, text: "C: buy" },
            { x: 31, y: 162.64, text: "D: through B" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which level is usually stronger?",
        options: [
          "A cluster where price sat for a long time",
          "A pivot where price could not stay",
          "They are equal",
          "Whichever is newer"
        ],
        answer: 1,
        explain: "Pivot areas are, by definition, stronger most of the time."
      },
      {
        type: "spot",
        q: "Click the pivot-low candles of area A.",
        scene: {
          candles: [
            { o: 156, h: 156.05, l: 152.46, c: 152.67 },
            { o: 152.67, h: 152.85, l: 149.7, c: 149.75 },
            { o: 149.75, h: 149.82, l: 145.92, c: 146.01 },
            { o: 146.01, h: 146.14, l: 142.83, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.1, l: 143.7, c: 148.91 },
            { o: 148.91, h: 153.95, l: 148.75, c: 153.77 },
            { o: 153.77, h: 157.99, l: 153.62, c: 157.82 },
            { o: 157.82, h: 162.92, l: 157.74, c: 162.8 },
            { o: 162.8, h: 163.87, l: 162.32, c: 163.66 },
            { o: 163.66, h: 164.03, l: 163.03, c: 163.8 },
            { o: 163.8, h: 164.22, l: 160.52, c: 160.96 },
            { o: 160.96, h: 161.28, l: 158.16, c: 158.33 },
            { o: 158.33, h: 158.71, l: 155.37, c: 155.8 },
            { o: 155.8, h: 156.17, l: 154.88, c: 155.41 },
            { o: 155.41, h: 156.89, l: 155.01, c: 156.23 },
            { o: 156.23, h: 156.73, l: 154.32, c: 154.99 },
            { o: 154.99, h: 156.66, l: 154.59, c: 156.18 },
            { o: 156.18, h: 156.61, l: 154.64, c: 155.01 },
            { o: 155.01, h: 156.32, l: 154.47, c: 155.75 },
            { o: 155.75, h: 155.9, l: 152.52, c: 152.82 },
            { o: 152.82, h: 153.03, l: 150.25, c: 150.63 },
            { o: 150.63, h: 150.76, l: 146.98, c: 147.23 },
            { o: 147.23, h: 147.36, l: 144.31, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.25, l: 144.93, c: 148.19 },
            { o: 148.19, h: 151.84, l: 147.99, c: 151.67 },
            { o: 151.67, h: 154.74, l: 151.61, c: 154.64 },
            { o: 154.64, h: 158.36, l: 154.43, c: 158.24 },
            { o: 158.24, h: 161.24, l: 158.09, c: 161.1 }
          ]
        },
        answer: { from: 4, to: 6 },
        explain: "The spikes down that left immediately. Price could not stay there."
      },
      {
        type: "tf",
        q: "Every sideways cluster is strong support.",
        answer: false,
        explain: "A cluster means supply and demand were not far out of balance; it often gives way."
      },
      {
        type: "mcq",
        q: "Where is the low-risk buy in this lesson?",
        options: [
          "Inside the cluster",
          "The first pullback into pivot area A",
          "At the top",
          "After the rally through B"
        ],
        answer: 1,
        explain: "C, the first pullback into A, with the stop under the lower line."
      },
      {
        type: "mcq",
        q: "A strong rally from A meets cluster B. What usually happens?",
        options: [
          "It stops dead",
          "It slices through like a hot knife through butter",
          "It reverses at once",
          "Nothing"
        ],
        answer: 1,
        explain: "B held little supply, so price ran straight through it."
      }
    ],
    practice: [
      {
        prompt: "Price falls back for the first time into pivot area A, where it once could not stay. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 156, h: 156.15, l: 152.69, c: 152.83 },
            { o: 152.83, h: 153.03, l: 149.56, c: 149.64 },
            { o: 149.64, h: 149.8, l: 146.36, c: 146.41 },
            { o: 146.41, h: 146.54, l: 142.92, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.15, l: 143.64, c: 149.07 },
            { o: 149.07, h: 153.92, l: 148.92, c: 153.76 },
            { o: 153.76, h: 158.05, l: 153.7, c: 157.91 },
            { o: 157.91, h: 162.91, l: 157.84, c: 162.8 },
            { o: 162.8, h: 163.83, l: 162.35, c: 163.33 },
            { o: 163.33, h: 164.42, l: 162.91, c: 163.8 },
            { o: 163.8, h: 164.02, l: 160.24, c: 160.56 },
            { o: 160.56, h: 160.98, l: 157.87, c: 158.28 },
            { o: 158.28, h: 158.51, l: 155.36, c: 155.8 },
            { o: 155.8, h: 156.11, l: 155.19, c: 155.67 },
            { o: 155.67, h: 156.77, l: 155.35, c: 156.23 },
            { o: 156.23, h: 156.62, l: 154.88, c: 155.55 },
            { o: 155.55, h: 156.71, l: 154.99, c: 156.28 },
            { o: 156.28, h: 156.65, l: 154.42, c: 155.09 },
            { o: 155.09, h: 156.34, l: 154.78, c: 155.89 },
            { o: 155.89, h: 156.04, l: 152.62, c: 152.92 },
            { o: 152.92, h: 153.09, l: 149.15, c: 149.59 },
            { o: 149.59, h: 149.82, l: 146.67, c: 146.93 },
            { o: 146.93, h: 147.09, l: 144.2, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.52, l: 144.92, c: 148.47 },
            { o: 148.47, h: 151.87, l: 148.41, c: 151.7 },
            { o: 151.7, h: 154.77, l: 151.59, c: 154.71 },
            { o: 154.71, h: 158.23, l: 154.59, c: 158.12 },
            { o: 158.12, h: 161.26, l: 157.96, c: 161.1 }
          ],
          zones: [
            { from: 4, top: 144.1, bottom: 141.2, kind: "demand", label: "A: pivot demand" }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "First pullback to a pivot-low demand: big imbalance. Buy at the top line, stop under the bottom line. Price rallied through the old cluster."
      },
      {
        prompt: "Price is resting on a long sideways cluster after a drop. Buy the cluster, sell, or nothing?",
        scene: {
          candles: [
            { o: 156, h: 156.15, l: 152.69, c: 152.83 },
            { o: 152.83, h: 153.03, l: 149.56, c: 149.64 },
            { o: 149.64, h: 149.8, l: 146.36, c: 146.41 },
            { o: 146.41, h: 146.54, l: 142.92, c: 143 },
            { o: 143, h: 143.9, l: 141.2, c: 143.6 },
            { o: 143.6, h: 144.4, l: 141.3, c: 144.1 },
            { o: 144.1, h: 144.4, l: 141.9, c: 143.8 },
            { o: 143.8, h: 149.15, l: 143.64, c: 149.07 },
            { o: 149.07, h: 153.92, l: 148.92, c: 153.76 },
            { o: 153.76, h: 158.05, l: 153.7, c: 157.91 },
            { o: 157.91, h: 162.91, l: 157.84, c: 162.8 },
            { o: 162.8, h: 163.83, l: 162.35, c: 163.33 },
            { o: 163.33, h: 164.42, l: 162.91, c: 163.8 },
            { o: 163.8, h: 164.02, l: 160.24, c: 160.56 },
            { o: 160.56, h: 160.98, l: 157.87, c: 158.28 },
            { o: 158.28, h: 158.51, l: 155.36, c: 155.8 },
            { o: 155.8, h: 156.11, l: 155.19, c: 155.67 },
            { o: 155.67, h: 156.77, l: 155.35, c: 156.23 },
            { o: 156.23, h: 156.62, l: 154.88, c: 155.55 },
            { o: 155.55, h: 156.71, l: 154.99, c: 156.28 },
            { o: 156.28, h: 156.65, l: 154.42, c: 155.09 },
            { o: 155.09, h: 156.34, l: 154.78, c: 155.89 },
            { o: 155.89, h: 156.04, l: 152.62, c: 152.92 },
            { o: 152.92, h: 153.09, l: 149.15, c: 149.59 },
            { o: 149.59, h: 149.82, l: 146.67, c: 146.93 },
            { o: 146.93, h: 147.09, l: 144.2, c: 144.6 },
            { o: 144.6, h: 145.35, l: 142.65, c: 145.1 },
            { o: 145.1, h: 148.52, l: 144.92, c: 148.47 },
            { o: 148.47, h: 151.87, l: 148.41, c: 151.7 },
            { o: 151.7, h: 154.77, l: 151.59, c: 154.71 },
            { o: 154.71, h: 158.23, l: 154.59, c: 158.12 },
            { o: 158.12, h: 161.26, l: 157.96, c: 161.1 }
          ],
          zones: [
            { from: 16, top: 156.28, bottom: 154.42, kind: "demand", label: "B: cluster" }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "A cluster is a weak level - supply and demand were only mildly out of balance. It gave way and price fell to the pivot area below."
      }
    ],
    cards: [
      { front: "Pivot level means?", back: "Price could not stay: big imbalance, strong level." },
      { front: "Cluster level means?", back: "Price stayed: mild imbalance, weaker level." },
      { front: "Which pullback to buy?", back: "The first pullback into the pivot area." },
      { front: "Strong move vs weak cluster?", back: "It slices right through it." },
      { front: "Big question to ask at any level?", back: "Why can price not stay here?" }
    ],
    mnemonic: "Hot stove, warm mug: price jumps off the stove (pivot), lingers on the mug (cluster)."
  },
  {
    mentor: "seiden",
    n: 89,
    eli5: {
      oneLiner: "Price moves when one side runs out. That is the whole game.",
      story: "At $20.50 there are 300 buyers and 200 sellers. Price looks still while they trade, but it is not balance. When the 200th seller sells, 100 buyers are left with nobody to buy from, so they must pay more and price rises. Like two earth plates pushing until one gives way, the market moves the moment one force reaches zero.",
      analogy: "Like a tug of war where one team keeps losing players: the rope stays still until the last one lets go, then it flies."
    },
    bigIdeas: [
      "Price is a function of supply and demand.",
      "All influences are reflected in price, so price is all you need.",
      "Motion starts when one of the two forces reaches zero at a price."
    ],
    steps: [
      {
        title: "Three states",
        narration: "A market is always in one of three states: more demand (prices rise), more supply (prices fall), or balance. Here sellers are winning and price falls.",
        scene: {
          candles: [
            { o: 130, h: 130.22, l: 126.6, c: 126.94 },
            { o: 126.94, h: 127.24, l: 124.58, c: 124.85 },
            { o: 124.85, h: 124.97, l: 121.8, c: 122 },
            { o: 122, h: 122.55, l: 120.76, c: 121.44 },
            { o: 121.44, h: 122.76, l: 120.75, c: 122.24 },
            { o: 122.24, h: 122.81, l: 121.44, c: 121.96 },
            { o: 121.96, h: 125.33, l: 121.71, c: 124.95 },
            { o: 124.95, h: 128.75, l: 124.72, c: 128.31 },
            { o: 128.31, h: 131.22, l: 127.99, c: 130.96 },
            { o: 130.96, h: 131.45, l: 130.36, c: 130.77 },
            { o: 130.77, h: 132.11, l: 130.48, c: 131.7 },
            { o: 131.7, h: 132.63, l: 131.3, c: 131.96 },
            { o: 131.96, h: 132.18, l: 129.28, c: 129.58 },
            { o: 129.58, h: 129.97, l: 125.03, c: 125.48 },
            { o: 125.48, h: 125.7, l: 122.47, c: 122.74 },
            { o: 122.74, h: 123.39, l: 121.42, c: 123.14 },
            { o: 123.14, h: 124.87, l: 122.87, c: 124.59 },
            { o: 124.59, h: 125.63, l: 124.38, c: 125.34 },
            { o: 125.34, h: 126.94, l: 124.94, c: 126.62 },
            { o: 126.62, h: 128.56, l: 126.42, c: 128.23 },
            { o: 128.23, h: 129.39, l: 127.87, c: 129.14 }
          ],
          highlight: { from: 0, to: 2, label: "supply > demand" },
          reveal: 3
        }
      },
      {
        title: "Looks like balance",
        narration: "Price goes quiet at the low. It looks balanced, but there are 300 buyers and 200 sellers. The sellers are slowly being filled.",
        scene: {
          candles: [
            { o: 130, h: 130.22, l: 126.6, c: 126.94 },
            { o: 126.94, h: 127.24, l: 124.58, c: 124.85 },
            { o: 124.85, h: 124.97, l: 121.8, c: 122 },
            { o: 122, h: 122.55, l: 120.76, c: 121.44 },
            { o: 121.44, h: 122.76, l: 120.75, c: 122.24 },
            { o: 122.24, h: 122.81, l: 121.44, c: 121.96 },
            { o: 121.96, h: 125.33, l: 121.71, c: 124.95 },
            { o: 124.95, h: 128.75, l: 124.72, c: 128.31 },
            { o: 128.31, h: 131.22, l: 127.99, c: 130.96 },
            { o: 130.96, h: 131.45, l: 130.36, c: 130.77 },
            { o: 130.77, h: 132.11, l: 130.48, c: 131.7 },
            { o: 131.7, h: 132.63, l: 131.3, c: 131.96 },
            { o: 131.96, h: 132.18, l: 129.28, c: 129.58 },
            { o: 129.58, h: 129.97, l: 125.03, c: 125.48 },
            { o: 125.48, h: 125.7, l: 122.47, c: 122.74 },
            { o: 122.74, h: 123.39, l: 121.42, c: 123.14 },
            { o: 123.14, h: 124.87, l: 122.87, c: 124.59 },
            { o: 124.59, h: 125.63, l: 124.38, c: 125.34 },
            { o: 125.34, h: 126.94, l: 124.94, c: 126.62 },
            { o: 126.62, h: 128.56, l: 126.42, c: 128.23 },
            { o: 128.23, h: 129.39, l: 127.87, c: 129.14 }
          ],
          notes: [
            { x: 3, y: 119.36, text: "Sellers 200 / Buyers 300" },
            { x: 5, y: 120.04, text: "Sellers 0 / Buyers 100" }
          ],
          highlight: { from: 3, to: 5, label: "sellers being filled" },
          reveal: 6
        }
      },
      {
        title: "One side hits zero",
        narration: "The last seller sells. The buyers left must pay up, and price rises. That apparent balance was an imbalance that needed time to play out.",
        scene: {
          candles: [
            { o: 130, h: 130.22, l: 126.6, c: 126.94 },
            { o: 126.94, h: 127.24, l: 124.58, c: 124.85 },
            { o: 124.85, h: 124.97, l: 121.8, c: 122 },
            { o: 122, h: 122.55, l: 120.76, c: 121.44 },
            { o: 121.44, h: 122.76, l: 120.75, c: 122.24 },
            { o: 122.24, h: 122.81, l: 121.44, c: 121.96 },
            { o: 121.96, h: 125.33, l: 121.71, c: 124.95 },
            { o: 124.95, h: 128.75, l: 124.72, c: 128.31 },
            { o: 128.31, h: 131.22, l: 127.99, c: 130.96 },
            { o: 130.96, h: 131.45, l: 130.36, c: 130.77 },
            { o: 130.77, h: 132.11, l: 130.48, c: 131.7 },
            { o: 131.7, h: 132.63, l: 131.3, c: 131.96 },
            { o: 131.96, h: 132.18, l: 129.28, c: 129.58 },
            { o: 129.58, h: 129.97, l: 125.03, c: 125.48 },
            { o: 125.48, h: 125.7, l: 122.47, c: 122.74 },
            { o: 122.74, h: 123.39, l: 121.42, c: 123.14 },
            { o: 123.14, h: 124.87, l: 122.87, c: 124.59 },
            { o: 124.59, h: 125.63, l: 124.38, c: 125.34 },
            { o: 125.34, h: 126.94, l: 124.94, c: 126.62 },
            { o: 126.62, h: 128.56, l: 126.42, c: 128.23 },
            { o: 128.23, h: 129.39, l: 127.87, c: 129.14 }
          ],
          zones: [
            { from: 3, top: 122.24, bottom: 120.75, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 3, y: 119.36, text: "Sellers 200 / Buyers 300" },
            { x: 5, y: 120.04, text: "Sellers 0 / Buyers 100" }
          ],
          highlight: { from: 6, to: 8, label: "motion starts" },
          reveal: 9
        }
      },
      {
        title: "Trade the pivot, not the balance",
        narration: "Most candles are near equilibrium, which is not where to trade. When price returns to the place where one side ran out, buy there.",
        scene: {
          candles: [
            { o: 130, h: 130.22, l: 126.6, c: 126.94 },
            { o: 126.94, h: 127.24, l: 124.58, c: 124.85 },
            { o: 124.85, h: 124.97, l: 121.8, c: 122 },
            { o: 122, h: 122.55, l: 120.76, c: 121.44 },
            { o: 121.44, h: 122.76, l: 120.75, c: 122.24 },
            { o: 122.24, h: 122.81, l: 121.44, c: 121.96 },
            { o: 121.96, h: 125.33, l: 121.71, c: 124.95 },
            { o: 124.95, h: 128.75, l: 124.72, c: 128.31 },
            { o: 128.31, h: 131.22, l: 127.99, c: 130.96 },
            { o: 130.96, h: 131.45, l: 130.36, c: 130.77 },
            { o: 130.77, h: 132.11, l: 130.48, c: 131.7 },
            { o: 131.7, h: 132.63, l: 131.3, c: 131.96 },
            { o: 131.96, h: 132.18, l: 129.28, c: 129.58 },
            { o: 129.58, h: 129.97, l: 125.03, c: 125.48 },
            { o: 125.48, h: 125.7, l: 122.47, c: 122.74 },
            { o: 122.74, h: 123.39, l: 121.42, c: 123.14 },
            { o: 123.14, h: 124.87, l: 122.87, c: 124.59 },
            { o: 124.59, h: 125.63, l: 124.38, c: 125.34 },
            { o: 125.34, h: 126.94, l: 124.94, c: 126.62 },
            { o: 126.62, h: 128.56, l: 126.42, c: 128.23 },
            { o: 128.23, h: 129.39, l: 127.87, c: 129.14 }
          ],
          zones: [
            { from: 3, top: 122.24, bottom: 120.75, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 122.24, label: "Entry (proximal)", kind: "entry" },
            { y: 120.45, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 3, y: 119.36, text: "Sellers 200 / Buyers 300" },
            { x: 5, y: 120.04, text: "Sellers 0 / Buyers 100" },
            { x: 15, y: 120.02, text: "Buy where sellers ran out" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put the 300 buyers / 200 sellers story in order.",
        items: [
          "Price looks stable at $20.50",
          "Sellers are filled one by one",
          "The 200th seller sells: sellers = 0",
          "100 buyers remain and price must rise"
        ],
        explain: "Motion starts the moment one side is exhausted."
      },
      {
        type: "spot",
        q: "Click the candle where the rally begins - the moment sellers hit zero.",
        scene: {
          candles: [
            { o: 130, h: 130.22, l: 126.6, c: 126.94 },
            { o: 126.94, h: 127.24, l: 124.58, c: 124.85 },
            { o: 124.85, h: 124.97, l: 121.8, c: 122 },
            { o: 122, h: 122.55, l: 120.76, c: 121.44 },
            { o: 121.44, h: 122.76, l: 120.75, c: 122.24 },
            { o: 122.24, h: 122.81, l: 121.44, c: 121.96 },
            { o: 121.96, h: 125.33, l: 121.71, c: 124.95 },
            { o: 124.95, h: 128.75, l: 124.72, c: 128.31 },
            { o: 128.31, h: 131.22, l: 127.99, c: 130.96 },
            { o: 130.96, h: 131.45, l: 130.36, c: 130.77 },
            { o: 130.77, h: 132.11, l: 130.48, c: 131.7 },
            { o: 131.7, h: 132.63, l: 131.3, c: 131.96 },
            { o: 131.96, h: 132.18, l: 129.28, c: 129.58 },
            { o: 129.58, h: 129.97, l: 125.03, c: 125.48 },
            { o: 125.48, h: 125.7, l: 122.47, c: 122.74 },
            { o: 122.74, h: 123.39, l: 121.42, c: 123.14 },
            { o: 123.14, h: 124.87, l: 122.87, c: 124.59 },
            { o: 124.59, h: 125.63, l: 124.38, c: 125.34 },
            { o: 125.34, h: 126.94, l: 124.94, c: 126.62 },
            { o: 126.62, h: 128.56, l: 126.42, c: 128.23 },
            { o: 128.23, h: 129.39, l: 127.87, c: 129.14 }
          ]
        },
        answer: { from: 6, to: 6 },
        explain: "The first candle out of the base. The last seller was filled and the remaining buyers had to pay up."
      },
      {
        type: "mcq",
        q: "How many states can a market be in?",
        options: ["One", "Two", "Three", "Infinite"],
        answer: 2,
        explain: "Demand exceeds supply, supply exceeds demand, or equilibrium."
      },
      {
        type: "tf",
        q: "Most candles are at equilibrium, and that is the best place to trade.",
        answer: false,
        explain: "Most candles are near equilibrium, but that is not where you want to trade. Trade the pivots where imbalance is obvious."
      },
      {
        type: "mcq",
        q: "Why do people react differently to the same news?",
        options: ["Different screens", "Different belief systems", "Different brokers", "They do not"],
        answer: 1,
        explain: "Each person filters news through their own beliefs. Only the resulting orders, which become price, matter."
      }
    ],
    practice: [
      {
        prompt: "Price returns for the first time to the quiet low where sellers ran out and buyers took over. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 128, h: 128.27, l: 125.63, c: 125.89 },
            { o: 125.89, h: 126.21, l: 122.74, c: 123.1 },
            { o: 123.1, h: 123.39, l: 120.76, c: 121 },
            { o: 121, h: 121.63, l: 119.74, c: 120.14 },
            { o: 120.14, h: 122.41, l: 119.7, c: 121.94 },
            { o: 121.94, h: 122.3, l: 120.37, c: 120.96 },
            { o: 120.96, h: 124.73, l: 120.85, c: 124.61 },
            { o: 124.61, h: 127.52, l: 124.54, c: 127.4 },
            { o: 127.4, h: 131.17, l: 127.29, c: 130.96 },
            { o: 130.96, h: 131.71, l: 130.65, c: 131.34 },
            { o: 131.34, h: 132.48, l: 130.99, c: 131.93 },
            { o: 131.93, h: 132.26, l: 131.64, c: 131.96 },
            { o: 131.96, h: 132.1, l: 129.43, c: 129.63 },
            { o: 129.63, h: 129.75, l: 127.12, c: 127.26 },
            { o: 127.26, h: 127.35, l: 124.9, c: 125.03 },
            { o: 125.03, h: 125.12, l: 122.36, c: 122.44 },
            { o: 122.44, h: 123.09, l: 120.71, c: 122.84 },
            { o: 122.84, h: 124.3, l: 122.59, c: 123.94 },
            { o: 123.94, h: 126.03, l: 123.67, c: 125.88 },
            { o: 125.88, h: 127.59, l: 125.48, c: 127.27 },
            { o: 127.27, h: 128.94, l: 127.01, c: 128.67 },
            { o: 128.67, h: 130.05, l: 128.33, c: 129.84 }
          ],
          zones: [
            { from: 3, top: 121.94, bottom: 119.7, kind: "demand", label: "Demand" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "That is the price where one force reached zero: demand exceeds supply. Buy at the top line, stop below. Price rose."
      }
    ],
    cards: [
      { front: "Principle 1?", back: "Price in a free market is a function of supply and demand." },
      { front: "Principle 2?", back: "All influences on price are reflected in price." },
      { front: "Principle 3?", back: "Motion starts when one competing force reaches zero at a price." },
      { front: "Pivot low on a chart shows?", back: "Demand exceeded supply." },
      {
        front: "Earthquake analogy?",
        back: "Plates push until one overwhelms the other, like buyers and sellers."
      }
    ],
    mnemonic: "Last one out, price moves: watch for the side that runs to zero."
  },
  {
    mentor: "seiden",
    n: 93,
    eli5: {
      oneLiner: "Buy a gap down into a quality pivot, not into a lazy mid-move range.",
      story: "\"Support\" means different things to different people. A sideways range sitting in the middle of a rally is not quality: price often slices right through it. A pivot low that price exploded away from is quality, because demand hugely beat supply there. When price later gaps down into that pivot after a decline, the person selling is the novice, so Seiden buys from him.",
      analogy: "Like a trampoline versus a pile of pillows: you bounce hard off the trampoline but sink through the pillows."
    },
    bigIdeas: [
      "A sideways range in the middle of a move is not quality support.",
      "Quality = a pivot price exploded away from.",
      "Gap down into quality demand: buy. Target 1 = gap origin, target 2 = nearest pivot high."
    ],
    steps: [
      {
        title: "A: a mid-move range",
        narration: "Price rallies, goes sideways, then rallies again. This range sits in the middle of a move. It is not quality.",
        scene: {
          candles: [
            { o: 134, h: 136.3, l: 133.87, c: 136 },
            { o: 136, h: 138.12, l: 135.56, c: 137.9 },
            { o: 137.9, h: 139.27, l: 137.5, c: 138.86 },
            { o: 138.86, h: 141.19, l: 138.63, c: 141 },
            { o: 141, h: 141.6, l: 139.76, c: 140.37 },
            { o: 140.37, h: 142.09, l: 139.78, c: 141.78 },
            { o: 141.78, h: 142.22, l: 139.98, c: 140.61 },
            { o: 140.61, h: 141.32, l: 140.02, c: 140.96 },
            { o: 140.96, h: 143.26, l: 140.73, c: 143.06 },
            { o: 143.06, h: 145.37, l: 142.61, c: 145.1 },
            { o: 145.1, h: 147.42, l: 144.65, c: 147.16 },
            { o: 147.16, h: 150.09, l: 146.92, c: 149.96 },
            { o: 149.96, h: 151, l: 149.71, c: 150.46 },
            { o: 150.46, h: 150.54, l: 147.86, c: 148.03 },
            { o: 148.03, h: 148.18, l: 144.84, c: 145.04 },
            { o: 145.04, h: 145.26, l: 142.08, c: 142.18 },
            { o: 142.18, h: 142.33, l: 135.96, c: 136.26 },
            { o: 136.26, h: 136.66, l: 134.06, c: 135.66 },
            { o: 135.66, h: 136.02, l: 135.36, c: 135.71 },
            { o: 135.71, h: 139.08, l: 135.57, c: 138.98 },
            { o: 138.98, h: 141.82, l: 138.9, c: 141.71 },
            { o: 141.71, h: 144.77, l: 141.56, c: 144.71 },
            { o: 144.71, h: 144.91, l: 143.25, c: 143.44 },
            { o: 143.44, h: 143.77, l: 142.28, c: 142.51 },
            { o: 142.51, h: 142.92, l: 141.04, c: 141.21 },
            { o: 135.6, h: 137.8, l: 135.3, c: 137.6 },
            { o: 137.6, h: 139.5, l: 137.39, c: 139.26 },
            { o: 139.26, h: 141.38, l: 139.01, c: 141.22 },
            { o: 141.22, h: 143.88, l: 141, c: 143.64 },
            { o: 143.64, h: 145.54, l: 143.47, c: 145.27 }
          ],
          zones: [
            { from: 4, top: 141.78, bottom: 139.76, kind: "demand", label: "A: mid-move range", faded: true }
          ],
          reveal: 13
        }
      },
      {
        title: "B: sliced through",
        narration: "When price returns, it falls straight through A. Weak support gives way.",
        scene: {
          candles: [
            { o: 134, h: 136.3, l: 133.87, c: 136 },
            { o: 136, h: 138.12, l: 135.56, c: 137.9 },
            { o: 137.9, h: 139.27, l: 137.5, c: 138.86 },
            { o: 138.86, h: 141.19, l: 138.63, c: 141 },
            { o: 141, h: 141.6, l: 139.76, c: 140.37 },
            { o: 140.37, h: 142.09, l: 139.78, c: 141.78 },
            { o: 141.78, h: 142.22, l: 139.98, c: 140.61 },
            { o: 140.61, h: 141.32, l: 140.02, c: 140.96 },
            { o: 140.96, h: 143.26, l: 140.73, c: 143.06 },
            { o: 143.06, h: 145.37, l: 142.61, c: 145.1 },
            { o: 145.1, h: 147.42, l: 144.65, c: 147.16 },
            { o: 147.16, h: 150.09, l: 146.92, c: 149.96 },
            { o: 149.96, h: 151, l: 149.71, c: 150.46 },
            { o: 150.46, h: 150.54, l: 147.86, c: 148.03 },
            { o: 148.03, h: 148.18, l: 144.84, c: 145.04 },
            { o: 145.04, h: 145.26, l: 142.08, c: 142.18 },
            { o: 142.18, h: 142.33, l: 135.96, c: 136.26 },
            { o: 136.26, h: 136.66, l: 134.06, c: 135.66 },
            { o: 135.66, h: 136.02, l: 135.36, c: 135.71 },
            { o: 135.71, h: 139.08, l: 135.57, c: 138.98 },
            { o: 138.98, h: 141.82, l: 138.9, c: 141.71 },
            { o: 141.71, h: 144.77, l: 141.56, c: 144.71 },
            { o: 144.71, h: 144.91, l: 143.25, c: 143.44 },
            { o: 143.44, h: 143.77, l: 142.28, c: 142.51 },
            { o: 142.51, h: 142.92, l: 141.04, c: 141.21 },
            { o: 135.6, h: 137.8, l: 135.3, c: 137.6 },
            { o: 137.6, h: 139.5, l: 137.39, c: 139.26 },
            { o: 139.26, h: 141.38, l: 139.01, c: 141.22 },
            { o: 141.22, h: 143.88, l: 141, c: 143.64 },
            { o: 143.64, h: 145.54, l: 143.47, c: 145.27 }
          ],
          zones: [
            { from: 4, top: 141.78, bottom: 139.76, kind: "demand", label: "A: mid-move range", faded: true }
          ],
          highlight: { from: 16, to: 16, label: "B: through A" },
          reveal: 17
        }
      },
      {
        title: "C: the quality pivot",
        narration: "A pivot low forms and price explodes away from it. Demand greatly exceeded supply here. That is quality.",
        scene: {
          candles: [
            { o: 134, h: 136.3, l: 133.87, c: 136 },
            { o: 136, h: 138.12, l: 135.56, c: 137.9 },
            { o: 137.9, h: 139.27, l: 137.5, c: 138.86 },
            { o: 138.86, h: 141.19, l: 138.63, c: 141 },
            { o: 141, h: 141.6, l: 139.76, c: 140.37 },
            { o: 140.37, h: 142.09, l: 139.78, c: 141.78 },
            { o: 141.78, h: 142.22, l: 139.98, c: 140.61 },
            { o: 140.61, h: 141.32, l: 140.02, c: 140.96 },
            { o: 140.96, h: 143.26, l: 140.73, c: 143.06 },
            { o: 143.06, h: 145.37, l: 142.61, c: 145.1 },
            { o: 145.1, h: 147.42, l: 144.65, c: 147.16 },
            { o: 147.16, h: 150.09, l: 146.92, c: 149.96 },
            { o: 149.96, h: 151, l: 149.71, c: 150.46 },
            { o: 150.46, h: 150.54, l: 147.86, c: 148.03 },
            { o: 148.03, h: 148.18, l: 144.84, c: 145.04 },
            { o: 145.04, h: 145.26, l: 142.08, c: 142.18 },
            { o: 142.18, h: 142.33, l: 135.96, c: 136.26 },
            { o: 136.26, h: 136.66, l: 134.06, c: 135.66 },
            { o: 135.66, h: 136.02, l: 135.36, c: 135.71 },
            { o: 135.71, h: 139.08, l: 135.57, c: 138.98 },
            { o: 138.98, h: 141.82, l: 138.9, c: 141.71 },
            { o: 141.71, h: 144.77, l: 141.56, c: 144.71 },
            { o: 144.71, h: 144.91, l: 143.25, c: 143.44 },
            { o: 143.44, h: 143.77, l: 142.28, c: 142.51 },
            { o: 142.51, h: 142.92, l: 141.04, c: 141.21 },
            { o: 135.6, h: 137.8, l: 135.3, c: 137.6 },
            { o: 137.6, h: 139.5, l: 137.39, c: 139.26 },
            { o: 139.26, h: 141.38, l: 139.01, c: 141.22 },
            { o: 141.22, h: 143.88, l: 141, c: 143.64 },
            { o: 143.64, h: 145.54, l: 143.47, c: 145.27 }
          ],
          zones: [
            { from: 4, top: 141.78, bottom: 139.76, kind: "demand", label: "A: mid-move range", faded: true },
            { from: 17, top: 136.26, bottom: 134.06, kind: "demand", label: "C: quality demand" }
          ],
          highlight: { from: 19, to: 21, label: "explosive exit" },
          reveal: 25
        }
      },
      {
        title: "D: gap down into C",
        narration: "Price gaps down into C. Who is selling? Someone selling after a decline into demand: the novice. Buy, with targets at the gap origin and then the nearest pivot high.",
        scene: {
          candles: [
            { o: 134, h: 136.3, l: 133.87, c: 136 },
            { o: 136, h: 138.12, l: 135.56, c: 137.9 },
            { o: 137.9, h: 139.27, l: 137.5, c: 138.86 },
            { o: 138.86, h: 141.19, l: 138.63, c: 141 },
            { o: 141, h: 141.6, l: 139.76, c: 140.37 },
            { o: 140.37, h: 142.09, l: 139.78, c: 141.78 },
            { o: 141.78, h: 142.22, l: 139.98, c: 140.61 },
            { o: 140.61, h: 141.32, l: 140.02, c: 140.96 },
            { o: 140.96, h: 143.26, l: 140.73, c: 143.06 },
            { o: 143.06, h: 145.37, l: 142.61, c: 145.1 },
            { o: 145.1, h: 147.42, l: 144.65, c: 147.16 },
            { o: 147.16, h: 150.09, l: 146.92, c: 149.96 },
            { o: 149.96, h: 151, l: 149.71, c: 150.46 },
            { o: 150.46, h: 150.54, l: 147.86, c: 148.03 },
            { o: 148.03, h: 148.18, l: 144.84, c: 145.04 },
            { o: 145.04, h: 145.26, l: 142.08, c: 142.18 },
            { o: 142.18, h: 142.33, l: 135.96, c: 136.26 },
            { o: 136.26, h: 136.66, l: 134.06, c: 135.66 },
            { o: 135.66, h: 136.02, l: 135.36, c: 135.71 },
            { o: 135.71, h: 139.08, l: 135.57, c: 138.98 },
            { o: 138.98, h: 141.82, l: 138.9, c: 141.71 },
            { o: 141.71, h: 144.77, l: 141.56, c: 144.71 },
            { o: 144.71, h: 144.91, l: 143.25, c: 143.44 },
            { o: 143.44, h: 143.77, l: 142.28, c: 142.51 },
            { o: 142.51, h: 142.92, l: 141.04, c: 141.21 },
            { o: 135.6, h: 137.8, l: 135.3, c: 137.6 },
            { o: 137.6, h: 139.5, l: 137.39, c: 139.26 },
            { o: 139.26, h: 141.38, l: 139.01, c: 141.22 },
            { o: 141.22, h: 143.88, l: 141, c: 143.64 },
            { o: 143.64, h: 145.54, l: 143.47, c: 145.27 }
          ],
          zones: [
            { from: 4, top: 141.78, bottom: 139.76, kind: "demand", label: "A: mid-move range", faded: true },
            { from: 17, top: 136.26, bottom: 134.06, kind: "demand", label: "C: quality demand" }
          ],
          lines: [
            { y: 136.26, label: "Entry (proximal)", kind: "entry" },
            { y: 133.76, label: "Stop beyond distal", kind: "sl" },
            { y: 141.21, label: "Target 1: gap origin", kind: "tp", from: 25 },
            { y: 144.77, label: "Target 2: pivot high", kind: "tp", from: 25 }
          ],
          highlight: { from: 25, to: 25, label: "D: gap buy" }
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which support is quality?",
        options: [
          "A sideways range in the middle of a rally",
          "A pivot low that price exploded away from",
          "Any Fibonacci level",
          "A rising moving average"
        ],
        answer: 1,
        explain: "Quality = a pivot price left explosively. Mid-move ranges often get sliced."
      },
      {
        type: "spot",
        q: "Click the candle that slices through the non-quality range.",
        scene: {
          candles: [
            { o: 134, h: 136.3, l: 133.87, c: 136 },
            { o: 136, h: 138.12, l: 135.56, c: 137.9 },
            { o: 137.9, h: 139.27, l: 137.5, c: 138.86 },
            { o: 138.86, h: 141.19, l: 138.63, c: 141 },
            { o: 141, h: 141.6, l: 139.76, c: 140.37 },
            { o: 140.37, h: 142.09, l: 139.78, c: 141.78 },
            { o: 141.78, h: 142.22, l: 139.98, c: 140.61 },
            { o: 140.61, h: 141.32, l: 140.02, c: 140.96 },
            { o: 140.96, h: 143.26, l: 140.73, c: 143.06 },
            { o: 143.06, h: 145.37, l: 142.61, c: 145.1 },
            { o: 145.1, h: 147.42, l: 144.65, c: 147.16 },
            { o: 147.16, h: 150.09, l: 146.92, c: 149.96 },
            { o: 149.96, h: 151, l: 149.71, c: 150.46 },
            { o: 150.46, h: 150.54, l: 147.86, c: 148.03 },
            { o: 148.03, h: 148.18, l: 144.84, c: 145.04 },
            { o: 145.04, h: 145.26, l: 142.08, c: 142.18 },
            { o: 142.18, h: 142.33, l: 135.96, c: 136.26 },
            { o: 136.26, h: 136.66, l: 134.06, c: 135.66 },
            { o: 135.66, h: 136.02, l: 135.36, c: 135.71 },
            { o: 135.71, h: 139.08, l: 135.57, c: 138.98 },
            { o: 138.98, h: 141.82, l: 138.9, c: 141.71 },
            { o: 141.71, h: 144.77, l: 141.56, c: 144.71 },
            { o: 144.71, h: 144.91, l: 143.25, c: 143.44 },
            { o: 143.44, h: 143.77, l: 142.28, c: 142.51 },
            { o: 142.51, h: 142.92, l: 141.04, c: 141.21 },
            { o: 135.6, h: 137.8, l: 135.3, c: 137.6 },
            { o: 137.6, h: 139.5, l: 137.39, c: 139.26 },
            { o: 139.26, h: 141.38, l: 139.01, c: 141.22 },
            { o: 141.22, h: 143.88, l: 141, c: 143.64 },
            { o: 143.64, h: 145.54, l: 143.47, c: 145.27 }
          ],
          zones: [
            { from: 4, top: 141.78, bottom: 139.76, kind: "demand", label: "A", faded: true }
          ]
        },
        answer: { from: 16, to: 16 },
        explain: "B: price falls straight through the mid-move range A."
      },
      {
        type: "mcq",
        q: "Price gaps down into quality demand after a decline. Who is the novice?",
        options: ["The buyer", "The seller", "The market maker", "Nobody"],
        answer: 1,
        explain: "The seller sells after a decline and into demand. Be the buyer."
      },
      {
        type: "order",
        q: "Order the gap-trade targets.",
        items: [
          "Entry: gap down into quality demand",
          "Target 1: origin of the gap",
          "Target 2: nearest pivot high"
        ],
        explain: "Seiden's gap trade first aims at the gap origin, then the nearest pivot high."
      },
      {
        type: "tf",
        q: "Buying a gap down is always high risk.",
        answer: false,
        explain: "Ask who is selling. Selling after a decline into demand is a novice action; buying there has small risk."
      }
    ],
    practice: [
      {
        prompt: "After a decline, price gaps down right into a pivot low that it once exploded away from. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 134, h: 136.07, l: 133.77, c: 135.91 },
            { o: 135.91, h: 138.16, l: 135.48, c: 137.78 },
            { o: 137.78, h: 140, l: 137.56, c: 139.67 },
            { o: 139.67, h: 141.41, l: 139.27, c: 141 },
            { o: 141, h: 141.47, l: 139.74, c: 140.35 },
            { o: 140.35, h: 142.19, l: 139.81, c: 141.7 },
            { o: 141.7, h: 142.21, l: 140.17, c: 140.52 },
            { o: 140.52, h: 141.58, l: 140.16, c: 141.04 },
            { o: 141.04, h: 144, l: 140.88, c: 143.6 },
            { o: 143.6, h: 145.51, l: 143.21, c: 145.11 },
            { o: 145.11, h: 147.96, l: 144.95, c: 147.68 },
            { o: 147.68, h: 150.43, l: 147.53, c: 150.04 },
            { o: 150.04, h: 151.12, l: 149.73, c: 150.54 },
            { o: 150.54, h: 150.7, l: 147.61, c: 147.71 },
            { o: 147.71, h: 147.78, l: 145.09, c: 145.24 },
            { o: 145.24, h: 145.33, l: 141.9, c: 142.1 },
            { o: 142.1, h: 142.25, l: 135.94, c: 136.24 },
            { o: 136.24, h: 136.64, l: 134.04, c: 135.64 },
            { o: 135.64, h: 136.21, l: 135.25, c: 135.69 },
            { o: 135.69, h: 138.47, l: 135.53, c: 138.38 },
            { o: 138.38, h: 142.1, l: 138.26, c: 142.04 },
            { o: 142.04, h: 144.86, l: 141.92, c: 144.69 },
            { o: 144.69, h: 145, l: 143.45, c: 143.61 },
            { o: 143.61, h: 143.83, l: 141.84, c: 142.16 },
            { o: 142.16, h: 142.44, l: 140.81, c: 141.19 },
            { o: 135.58, h: 137.78, l: 135.28, c: 137.58 },
            { o: 137.58, h: 139.71, l: 137.14, c: 139.55 },
            { o: 139.55, h: 142.31, l: 139.22, c: 141.94 },
            { o: 141.94, h: 143.47, l: 141.77, c: 143.05 },
            { o: 143.05, h: 145.72, l: 142.87, c: 145.36 }
          ],
          zones: [
            { from: 17, top: 136.24, bottom: 134.04, kind: "demand", label: "Quality demand" }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: { side: "buy", tp: 141.19 },
        explain: "Gap down into quality demand: the seller is the novice. Buy, stop under the zone, target the gap origin first. Price filled the gap and kept going."
      }
    ],
    cards: [
      { front: "Non-quality support?", back: "A sideways range in the middle of a move." },
      { front: "Quality support?", back: "A pivot low price exploded away from." },
      { front: "Gap down into quality demand?", back: "Buy from the novice seller." },
      { front: "Gap trade target 1?", back: "The origin of the gap." },
      { front: "Gap trade target 2?", back: "The nearest pivot high." }
    ],
    mnemonic: "Trampoline, not pillows: buy the pivot price bounced off, not the range it sank through."
  },
  {
    mentor: "seiden",
    n: 95,
    eli5: {
      oneLiner: "Focus on prices that price cannot go to or stay at.",
      story: "New students look at too many things at once. Seiden boils it down to one idea. A level matters because of what did NOT happen there: price touched it and could not stay. That only happens where demand beats supply. When price comes back after a decline, ask who is on the other side: a novice selling into demand. Be his buyer.",
      analogy: "Like a floor that is too hot to stand on: every time someone steps there, they jump right back off."
    },
    bigIdeas: [
      "Focus on price levels price cannot go to or stay at.",
      "Think in order flow - buyers and sellers - not red and green candles.",
      "At every entry ask: who is on the other side of my trade?"
    ],
    steps: [
      {
        title: "Price could not stay",
        narration: "After a decline, price dips into the same band again and again but is pushed right back up. It can touch it, but it cannot stay.",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.65, c: 158.96 },
            { o: 158.96, h: 159.41, l: 156.68, c: 157.05 },
            { o: 157.05, h: 157.48, l: 153.2, c: 153.43 },
            { o: 153.43, h: 153.82, l: 150.95, c: 151.12 },
            { o: 151.12, h: 151.3, l: 147.7, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 152.83, l: 149.02, c: 152.53 },
            { o: 152.53, h: 156.61, l: 152.16, c: 156.38 },
            { o: 156.38, h: 161.61, l: 155.96, c: 161.3 },
            { o: 161.3, h: 161.61, l: 160.22, c: 160.88 },
            { o: 160.88, h: 162.67, l: 160.41, c: 162.3 },
            { o: 162.3, h: 162.63, l: 159.33, c: 159.47 },
            { o: 159.47, h: 159.67, l: 156.66, c: 156.93 },
            { o: 156.93, h: 157.11, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.01, l: 152.5, c: 152.84 },
            { o: 152.84, h: 152.99, l: 149.53, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 152.52, l: 150.09, c: 152.24 },
            { o: 152.24, h: 154.83, l: 152.11, c: 154.38 },
            { o: 154.38, h: 157.62, l: 153.97, c: 157.44 },
            { o: 157.44, h: 159.66, l: 157.09, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.85, c: 161.3 }
          ],
          highlight: { from: 5, to: 8, label: "touched and left" },
          reveal: 9
        }
      },
      {
        title: "Why?",
        narration: "Price only leaves that fast where demand exceeds supply. Wrap the band in two lines.",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.65, c: 158.96 },
            { o: 158.96, h: 159.41, l: 156.68, c: 157.05 },
            { o: 157.05, h: 157.48, l: 153.2, c: 153.43 },
            { o: 153.43, h: 153.82, l: 150.95, c: 151.12 },
            { o: 151.12, h: 151.3, l: 147.7, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 152.83, l: 149.02, c: 152.53 },
            { o: 152.53, h: 156.61, l: 152.16, c: 156.38 },
            { o: 156.38, h: 161.61, l: 155.96, c: 161.3 },
            { o: 161.3, h: 161.61, l: 160.22, c: 160.88 },
            { o: 160.88, h: 162.67, l: 160.41, c: 162.3 },
            { o: 162.3, h: 162.63, l: 159.33, c: 159.47 },
            { o: 159.47, h: 159.67, l: 156.66, c: 156.93 },
            { o: 156.93, h: 157.11, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.01, l: 152.5, c: 152.84 },
            { o: 152.84, h: 152.99, l: 149.53, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 152.52, l: 150.09, c: 152.24 },
            { o: 152.24, h: 154.83, l: 152.11, c: 154.38 },
            { o: 154.38, h: 157.62, l: 153.97, c: 157.44 },
            { o: 157.44, h: 159.66, l: 157.09, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.85, c: 161.3 }
          ],
          zones: [
            { from: 5, top: 149.3, bottom: 146.5, kind: "demand", label: "Demand" }
          ],
          reveal: 12
        }
      },
      {
        title: "The revisit",
        narration: "Price rallies, then falls back to the band. The trader selling here sells after a decline and into demand.",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.65, c: 158.96 },
            { o: 158.96, h: 159.41, l: 156.68, c: 157.05 },
            { o: 157.05, h: 157.48, l: 153.2, c: 153.43 },
            { o: 153.43, h: 153.82, l: 150.95, c: 151.12 },
            { o: 151.12, h: 151.3, l: 147.7, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 152.83, l: 149.02, c: 152.53 },
            { o: 152.53, h: 156.61, l: 152.16, c: 156.38 },
            { o: 156.38, h: 161.61, l: 155.96, c: 161.3 },
            { o: 161.3, h: 161.61, l: 160.22, c: 160.88 },
            { o: 160.88, h: 162.67, l: 160.41, c: 162.3 },
            { o: 162.3, h: 162.63, l: 159.33, c: 159.47 },
            { o: 159.47, h: 159.67, l: 156.66, c: 156.93 },
            { o: 156.93, h: 157.11, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.01, l: 152.5, c: 152.84 },
            { o: 152.84, h: 152.99, l: 149.53, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 152.52, l: 150.09, c: 152.24 },
            { o: 152.24, h: 154.83, l: 152.11, c: 154.38 },
            { o: 154.38, h: 157.62, l: 153.97, c: 157.44 },
            { o: 157.44, h: 159.66, l: 157.09, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.85, c: 161.3 }
          ],
          zones: [
            { from: 5, top: 149.3, bottom: 146.5, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 14, to: 18, label: "novice sellers" },
          reveal: 19
        }
      },
      {
        title: "Be the buyer",
        narration: "Buy at the top line, stop below the bottom line, first target a few points up. Price rallies away.",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.65, c: 158.96 },
            { o: 158.96, h: 159.41, l: 156.68, c: 157.05 },
            { o: 157.05, h: 157.48, l: 153.2, c: 153.43 },
            { o: 153.43, h: 153.82, l: 150.95, c: 151.12 },
            { o: 151.12, h: 151.3, l: 147.7, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 152.83, l: 149.02, c: 152.53 },
            { o: 152.53, h: 156.61, l: 152.16, c: 156.38 },
            { o: 156.38, h: 161.61, l: 155.96, c: 161.3 },
            { o: 161.3, h: 161.61, l: 160.22, c: 160.88 },
            { o: 160.88, h: 162.67, l: 160.41, c: 162.3 },
            { o: 162.3, h: 162.63, l: 159.33, c: 159.47 },
            { o: 159.47, h: 159.67, l: 156.66, c: 156.93 },
            { o: 156.93, h: 157.11, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.01, l: 152.5, c: 152.84 },
            { o: 152.84, h: 152.99, l: 149.53, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 152.52, l: 150.09, c: 152.24 },
            { o: 152.24, h: 154.83, l: 152.11, c: 154.38 },
            { o: 154.38, h: 157.62, l: 153.97, c: 157.44 },
            { o: 157.44, h: 159.66, l: 157.09, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.85, c: 161.3 }
          ],
          zones: [
            { from: 5, top: 149.3, bottom: 146.5, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 149.3, label: "Entry (proximal)", kind: "entry" },
            { y: 146.2, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 19, y: 146.5, text: "B: buy" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What makes a level special in this lesson?",
        options: [
          "How many indicators agree",
          "What did NOT happen: price could not go to or stay at it",
          "A round number",
          "The news that day"
        ],
        answer: 1,
        explain: "Price touched the band and left fast. That is the footprint of demand."
      },
      {
        type: "spot",
        q: "Click the candles that show price could not stay at the level.",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.65, c: 158.96 },
            { o: 158.96, h: 159.41, l: 156.68, c: 157.05 },
            { o: 157.05, h: 157.48, l: 153.2, c: 153.43 },
            { o: 153.43, h: 153.82, l: 150.95, c: 151.12 },
            { o: 151.12, h: 151.3, l: 147.7, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 152.83, l: 149.02, c: 152.53 },
            { o: 152.53, h: 156.61, l: 152.16, c: 156.38 },
            { o: 156.38, h: 161.61, l: 155.96, c: 161.3 },
            { o: 161.3, h: 161.61, l: 160.22, c: 160.88 },
            { o: 160.88, h: 162.67, l: 160.41, c: 162.3 },
            { o: 162.3, h: 162.63, l: 159.33, c: 159.47 },
            { o: 159.47, h: 159.67, l: 156.66, c: 156.93 },
            { o: 156.93, h: 157.11, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.01, l: 152.5, c: 152.84 },
            { o: 152.84, h: 152.99, l: 149.53, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 152.52, l: 150.09, c: 152.24 },
            { o: 152.24, h: 154.83, l: 152.11, c: 154.38 },
            { o: 154.38, h: 157.62, l: 153.97, c: 157.44 },
            { o: 157.44, h: 159.66, l: 157.09, c: 159.3 },
            { o: 159.3, h: 161.58, l: 158.85, c: 161.3 }
          ]
        },
        answer: { from: 5, to: 8 },
        explain: "The repeated dips that were pushed straight back up."
      },
      {
        type: "tf",
        q: "You should read candles as red and green signals.",
        answer: false,
        explain: "Think of order flow: buyers and sellers behind each candle."
      },
      {
        type: "mcq",
        q: "At the revisit, who is on the other side of your buy?",
        options: ["A pro buyer", "A novice selling after a decline into demand", "Nobody", "The exchange"],
        answer: 1,
        explain: "Only a novice sells after a decline and into demand."
      },
      {
        type: "mcq",
        q: "What is the cure for looking at too many things?",
        options: [
          "More indicators",
          "Two thoughts: levels price cannot stay at, and why (order flow)",
          "More news",
          "More screens"
        ],
        answer: 1,
        explain: "Keep it simple."
      }
    ],
    practice: [
      {
        prompt: "Price is falling back to a band it once could not stay at. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 162, h: 162.35, l: 158.93, c: 159.3 },
            { o: 159.3, h: 159.43, l: 156.29, c: 156.56 },
            { o: 156.56, h: 156.73, l: 153.09, c: 153.53 },
            { o: 153.53, h: 153.9, l: 150.78, c: 151.21 },
            { o: 151.21, h: 151.59, l: 147.65, c: 148 },
            { o: 148, h: 149.2, l: 146.5, c: 148.9 },
            { o: 148.9, h: 149.2, l: 146.5, c: 148.4 },
            { o: 148.4, h: 149.3, l: 146.8, c: 149 },
            { o: 149, h: 149.6, l: 147.3, c: 149.3 },
            { o: 149.3, h: 153.45, l: 149.11, c: 153.28 },
            { o: 153.28, h: 158.09, l: 153.01, c: 157.8 },
            { o: 157.8, h: 161.71, l: 157.53, c: 161.3 },
            { o: 161.3, h: 163.59, l: 160.76, c: 162.99 },
            { o: 162.99, h: 163.67, l: 161.98, c: 162.3 },
            { o: 162.3, h: 162.7, l: 159.39, c: 159.69 },
            { o: 159.69, h: 159.88, l: 156.43, c: 156.79 },
            { o: 156.79, h: 157.21, l: 154.8, c: 155.02 },
            { o: 155.02, h: 155.35, l: 152.72, c: 152.89 },
            { o: 152.89, h: 153.25, l: 149.61, c: 149.8 },
            { o: 149.8, h: 150.55, l: 147.9, c: 150.3 },
            { o: 150.3, h: 153.05, l: 149.87, c: 152.82 },
            { o: 152.82, h: 154.9, l: 152.6, c: 154.64 },
            { o: 154.64, h: 156.54, l: 154.5, c: 156.38 },
            { o: 156.38, h: 159.04, l: 156.09, c: 158.89 },
            { o: 158.89, h: 161.53, l: 158.55, c: 161.3 }
          ],
          zones: [
            { from: 5, top: 149.3, bottom: 146.5, kind: "demand", label: "Demand band" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Demand exceeds supply where price could not stay. Buy at the top line from the novice sellers, stop below. Price rallied."
      }
    ],
    cards: [
      { front: "Thought 1?", back: "Focus on price levels price cannot go to or stay at." },
      { front: "Thought 2?", back: "Understand why: order flow, not candle colours." },
      { front: "Question at every entry?", back: "Who is on the other side of my trade?" },
      { front: "Price touches a level and leaves fast means?", back: "Demand exceeds supply there." },
      { front: "Where does the stop go on the buy?", back: "Below the bottom line of the band." }
    ],
    mnemonic: "Hot floor: where price cannot stand, buy the jump."
  },
  {
    mentor: "seiden",
    n: 97,
    eli5: {
      oneLiner: "Big timeframe levels decide whether small timeframe trades work.",
      story: "A trader who only watches the 5-minute chart is like a one-trick pony. The best small sell signal will usually fail if it sits right on top of big monthly demand. In 2008 the Dow, gold and crude all fell hard into old monthly demand and bounced. Seiden checks weekly and daily charts at least once a week so he knows where big trends are likely to start and end.",
      analogy: "Like a small wave meeting a sea wall: no matter how strong the little wave looks, the wall decides."
    },
    bigIdeas: [
      "Larger-timeframe trends begin and end at larger-timeframe supply and demand.",
      "Avoid small-timeframe sells into big demand and buys into big supply.",
      "Review weekly and daily levels at least once a week; ignore the news."
    ],
    steps: [
      {
        title: "Monthly demand",
        narration: "On the monthly chart, a base launched a long rally. That base is big-picture demand.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 125.85, c: 126.21 },
            { o: 126.21, h: 126.56, l: 123.99, c: 124.16 },
            { o: 124.16, h: 124.43, l: 121.87, c: 122 },
            { o: 122, h: 122.35, l: 121.14, c: 121.73 },
            { o: 121.73, h: 123.4, l: 121.14, c: 122.85 },
            { o: 122.85, h: 123.19, l: 121.67, c: 122.05 },
            { o: 122.05, h: 127.07, l: 121.86, c: 126.97 },
            { o: 126.97, h: 131.24, l: 126.88, c: 131.05 },
            { o: 131.05, h: 135.72, l: 130.77, c: 135.39 },
            { o: 135.39, h: 139.43, l: 135.17, c: 139.17 },
            { o: 139.17, h: 139.45, l: 138.61, c: 138.98 },
            { o: 138.98, h: 146.98, l: 138.69, c: 146.73 },
            { o: 146.73, h: 150.77, l: 146.33, c: 150.51 },
            { o: 150.51, h: 150.77, l: 150.13, c: 150.32 },
            { o: 150.32, h: 158.36, l: 149.97, c: 158.06 },
            { o: 158.06, h: 162.18, l: 157.72, c: 161.84 },
            { o: 161.84, h: 165.24, l: 161.61, c: 165.05 },
            { o: 165.05, h: 165.14, l: 160.53, c: 160.6 },
            { o: 160.6, h: 160.72, l: 155.33, c: 155.46 },
            { o: 155.46, h: 155.63, l: 149.44, c: 149.64 },
            { o: 149.64, h: 149.84, l: 144.96, c: 145.05 },
            { o: 145.05, h: 145.17, l: 138.53, c: 138.68 },
            { o: 138.68, h: 138.86, l: 130.54, c: 130.59 },
            { o: 130.59, h: 130.77, l: 123.38, c: 123.45 },
            { o: 123.45, h: 125.65, l: 121.82, c: 125.35 },
            { o: 125.35, h: 127.33, l: 125.19, c: 126.96 },
            { o: 126.96, h: 130.18, l: 126.74, c: 129.84 },
            { o: 129.84, h: 131.26, l: 129.58, c: 131.1 },
            { o: 131.1, h: 133.63, l: 130.94, c: 133.35 }
          ],
          zones: [
            { from: 3, top: 122.85, bottom: 121.14, kind: "demand", label: "Monthly demand" }
          ],
          reveal: 8
        }
      },
      {
        title: "The big trend",
        narration: "Price trends up for years, then falls hard. Small-timeframe traders sell every bounce on the way down.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 125.85, c: 126.21 },
            { o: 126.21, h: 126.56, l: 123.99, c: 124.16 },
            { o: 124.16, h: 124.43, l: 121.87, c: 122 },
            { o: 122, h: 122.35, l: 121.14, c: 121.73 },
            { o: 121.73, h: 123.4, l: 121.14, c: 122.85 },
            { o: 122.85, h: 123.19, l: 121.67, c: 122.05 },
            { o: 122.05, h: 127.07, l: 121.86, c: 126.97 },
            { o: 126.97, h: 131.24, l: 126.88, c: 131.05 },
            { o: 131.05, h: 135.72, l: 130.77, c: 135.39 },
            { o: 135.39, h: 139.43, l: 135.17, c: 139.17 },
            { o: 139.17, h: 139.45, l: 138.61, c: 138.98 },
            { o: 138.98, h: 146.98, l: 138.69, c: 146.73 },
            { o: 146.73, h: 150.77, l: 146.33, c: 150.51 },
            { o: 150.51, h: 150.77, l: 150.13, c: 150.32 },
            { o: 150.32, h: 158.36, l: 149.97, c: 158.06 },
            { o: 158.06, h: 162.18, l: 157.72, c: 161.84 },
            { o: 161.84, h: 165.24, l: 161.61, c: 165.05 },
            { o: 165.05, h: 165.14, l: 160.53, c: 160.6 },
            { o: 160.6, h: 160.72, l: 155.33, c: 155.46 },
            { o: 155.46, h: 155.63, l: 149.44, c: 149.64 },
            { o: 149.64, h: 149.84, l: 144.96, c: 145.05 },
            { o: 145.05, h: 145.17, l: 138.53, c: 138.68 },
            { o: 138.68, h: 138.86, l: 130.54, c: 130.59 },
            { o: 130.59, h: 130.77, l: 123.38, c: 123.45 },
            { o: 123.45, h: 125.65, l: 121.82, c: 125.35 },
            { o: 125.35, h: 127.33, l: 125.19, c: 126.96 },
            { o: 126.96, h: 130.18, l: 126.74, c: 129.84 },
            { o: 129.84, h: 131.26, l: 129.58, c: 131.1 },
            { o: 131.1, h: 133.63, l: 130.94, c: 133.35 }
          ],
          zones: [
            { from: 3, top: 122.85, bottom: 121.14, kind: "demand", label: "Monthly demand" }
          ],
          highlight: { from: 17, to: 20, label: "hard decline" },
          reveal: 24
        }
      },
      {
        title: "The trend ends at the level",
        narration: "One long lower wick pierces the top of the monthly zone and closes back up. Big buyers left their footprint. Short-term sells here had poor odds.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 125.85, c: 126.21 },
            { o: 126.21, h: 126.56, l: 123.99, c: 124.16 },
            { o: 124.16, h: 124.43, l: 121.87, c: 122 },
            { o: 122, h: 122.35, l: 121.14, c: 121.73 },
            { o: 121.73, h: 123.4, l: 121.14, c: 122.85 },
            { o: 122.85, h: 123.19, l: 121.67, c: 122.05 },
            { o: 122.05, h: 127.07, l: 121.86, c: 126.97 },
            { o: 126.97, h: 131.24, l: 126.88, c: 131.05 },
            { o: 131.05, h: 135.72, l: 130.77, c: 135.39 },
            { o: 135.39, h: 139.43, l: 135.17, c: 139.17 },
            { o: 139.17, h: 139.45, l: 138.61, c: 138.98 },
            { o: 138.98, h: 146.98, l: 138.69, c: 146.73 },
            { o: 146.73, h: 150.77, l: 146.33, c: 150.51 },
            { o: 150.51, h: 150.77, l: 150.13, c: 150.32 },
            { o: 150.32, h: 158.36, l: 149.97, c: 158.06 },
            { o: 158.06, h: 162.18, l: 157.72, c: 161.84 },
            { o: 161.84, h: 165.24, l: 161.61, c: 165.05 },
            { o: 165.05, h: 165.14, l: 160.53, c: 160.6 },
            { o: 160.6, h: 160.72, l: 155.33, c: 155.46 },
            { o: 155.46, h: 155.63, l: 149.44, c: 149.64 },
            { o: 149.64, h: 149.84, l: 144.96, c: 145.05 },
            { o: 145.05, h: 145.17, l: 138.53, c: 138.68 },
            { o: 138.68, h: 138.86, l: 130.54, c: 130.59 },
            { o: 130.59, h: 130.77, l: 123.38, c: 123.45 },
            { o: 123.45, h: 125.65, l: 121.82, c: 125.35 },
            { o: 125.35, h: 127.33, l: 125.19, c: 126.96 },
            { o: 126.96, h: 130.18, l: 126.74, c: 129.84 },
            { o: 129.84, h: 131.26, l: 129.58, c: 131.1 },
            { o: 131.1, h: 133.63, l: 130.94, c: 133.35 }
          ],
          zones: [
            { from: 3, top: 122.85, bottom: 121.14, kind: "demand", label: "Monthly demand" }
          ],
          highlight: { from: 24, to: 24, label: "long wick into demand" },
          reveal: 25
        }
      },
      {
        title: "The bounce",
        narration: "Price bounces from big demand. The news did not matter: without it, Seiden would have traded the same way.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 125.85, c: 126.21 },
            { o: 126.21, h: 126.56, l: 123.99, c: 124.16 },
            { o: 124.16, h: 124.43, l: 121.87, c: 122 },
            { o: 122, h: 122.35, l: 121.14, c: 121.73 },
            { o: 121.73, h: 123.4, l: 121.14, c: 122.85 },
            { o: 122.85, h: 123.19, l: 121.67, c: 122.05 },
            { o: 122.05, h: 127.07, l: 121.86, c: 126.97 },
            { o: 126.97, h: 131.24, l: 126.88, c: 131.05 },
            { o: 131.05, h: 135.72, l: 130.77, c: 135.39 },
            { o: 135.39, h: 139.43, l: 135.17, c: 139.17 },
            { o: 139.17, h: 139.45, l: 138.61, c: 138.98 },
            { o: 138.98, h: 146.98, l: 138.69, c: 146.73 },
            { o: 146.73, h: 150.77, l: 146.33, c: 150.51 },
            { o: 150.51, h: 150.77, l: 150.13, c: 150.32 },
            { o: 150.32, h: 158.36, l: 149.97, c: 158.06 },
            { o: 158.06, h: 162.18, l: 157.72, c: 161.84 },
            { o: 161.84, h: 165.24, l: 161.61, c: 165.05 },
            { o: 165.05, h: 165.14, l: 160.53, c: 160.6 },
            { o: 160.6, h: 160.72, l: 155.33, c: 155.46 },
            { o: 155.46, h: 155.63, l: 149.44, c: 149.64 },
            { o: 149.64, h: 149.84, l: 144.96, c: 145.05 },
            { o: 145.05, h: 145.17, l: 138.53, c: 138.68 },
            { o: 138.68, h: 138.86, l: 130.54, c: 130.59 },
            { o: 130.59, h: 130.77, l: 123.38, c: 123.45 },
            { o: 123.45, h: 125.65, l: 121.82, c: 125.35 },
            { o: 125.35, h: 127.33, l: 125.19, c: 126.96 },
            { o: 126.96, h: 130.18, l: 126.74, c: 129.84 },
            { o: 129.84, h: 131.26, l: 129.58, c: 131.1 },
            { o: 131.1, h: 133.63, l: 130.94, c: 133.35 }
          ],
          zones: [
            { from: 3, top: 122.85, bottom: 121.14, kind: "demand", label: "Monthly demand" }
          ],
          notes: [
            { x: 24, y: 120.42, text: "HTF demand wins" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A trader who uses only small timeframes can make consistent profits.",
        answer: false,
        explain: "Seiden has yet to see it. Small plus large timeframes is the recipe."
      },
      {
        type: "spot",
        q: "Click the candle where the big trend ended at monthly demand.",
        scene: {
          candles: [
            { o: 128, h: 128.19, l: 125.85, c: 126.21 },
            { o: 126.21, h: 126.56, l: 123.99, c: 124.16 },
            { o: 124.16, h: 124.43, l: 121.87, c: 122 },
            { o: 122, h: 122.35, l: 121.14, c: 121.73 },
            { o: 121.73, h: 123.4, l: 121.14, c: 122.85 },
            { o: 122.85, h: 123.19, l: 121.67, c: 122.05 },
            { o: 122.05, h: 127.07, l: 121.86, c: 126.97 },
            { o: 126.97, h: 131.24, l: 126.88, c: 131.05 },
            { o: 131.05, h: 135.72, l: 130.77, c: 135.39 },
            { o: 135.39, h: 139.43, l: 135.17, c: 139.17 },
            { o: 139.17, h: 139.45, l: 138.61, c: 138.98 },
            { o: 138.98, h: 146.98, l: 138.69, c: 146.73 },
            { o: 146.73, h: 150.77, l: 146.33, c: 150.51 },
            { o: 150.51, h: 150.77, l: 150.13, c: 150.32 },
            { o: 150.32, h: 158.36, l: 149.97, c: 158.06 },
            { o: 158.06, h: 162.18, l: 157.72, c: 161.84 },
            { o: 161.84, h: 165.24, l: 161.61, c: 165.05 },
            { o: 165.05, h: 165.14, l: 160.53, c: 160.6 },
            { o: 160.6, h: 160.72, l: 155.33, c: 155.46 },
            { o: 155.46, h: 155.63, l: 149.44, c: 149.64 },
            { o: 149.64, h: 149.84, l: 144.96, c: 145.05 },
            { o: 145.05, h: 145.17, l: 138.53, c: 138.68 },
            { o: 138.68, h: 138.86, l: 130.54, c: 130.59 },
            { o: 130.59, h: 130.77, l: 123.38, c: 123.45 },
            { o: 123.45, h: 125.65, l: 121.82, c: 125.35 },
            { o: 125.35, h: 127.33, l: 125.19, c: 126.96 },
            { o: 126.96, h: 130.18, l: 126.74, c: 129.84 },
            { o: 129.84, h: 131.26, l: 129.58, c: 131.1 },
            { o: 131.1, h: 133.63, l: 130.94, c: 133.35 }
          ],
          zones: [
            { from: 3, top: 122.85, bottom: 121.14, kind: "demand", label: "Monthly demand" }
          ]
        },
        answer: { from: 24, to: 24 },
        explain: "The long lower wick into the top of the monthly zone that closed back up."
      },
      {
        type: "mcq",
        q: "Your 5-minute chart gives a perfect sell, right on top of monthly demand. What are the odds?",
        options: ["Excellent", "Poor - it runs into big demand", "The same as always", "Unknown"],
        answer: 1,
        explain: "The best 15-minute sell near larger-timeframe demand is unlikely to work."
      },
      {
        type: "mcq",
        q: "How often should you review weekly and daily levels?",
        options: ["Never", "At least once a week", "Once a year", "Only after losses"],
        answer: 1,
        explain: "Weekly review: know where trends may end, which side has the odds, and find swing trades."
      },
      {
        type: "mcq",
        q: "What does Seiden do with the news?",
        options: [
          "Trades every headline",
          "Ignores it - all influences are already in price",
          "Waits for the news to stop",
          "Only reads it on Monday"
        ],
        answer: 1,
        explain: "If he never heard any of it, he would not have traded differently."
      }
    ],
    practice: [
      {
        prompt: "On your small chart, a big red candle gives a textbook sell signal. But on the monthly chart, price has just stabbed into old demand with a long lower wick. Sell, buy or nothing?",
        scene: {
          candles: [
            { o: 128, h: 128.31, l: 125.54, c: 125.84 },
            { o: 125.84, h: 126.22, l: 123.49, c: 123.73 },
            { o: 123.73, h: 124.03, l: 121.76, c: 122 },
            { o: 122, h: 122.55, l: 121.22, c: 121.9 },
            { o: 121.9, h: 123.34, l: 121.57, c: 122.67 },
            { o: 122.67, h: 123.32, l: 121.34, c: 121.99 },
            { o: 121.99, h: 126.96, l: 121.84, c: 126.86 },
            { o: 126.86, h: 131.19, l: 126.65, c: 130.99 },
            { o: 130.99, h: 135.69, l: 130.8, c: 135.33 },
            { o: 135.33, h: 139.38, l: 134.93, c: 139.11 },
            { o: 139.11, h: 139.48, l: 138.7, c: 138.92 },
            { o: 138.92, h: 146.88, l: 138.73, c: 146.67 },
            { o: 146.67, h: 150.76, l: 146.36, c: 150.45 },
            { o: 150.45, h: 150.64, l: 149.94, c: 150.26 },
            { o: 150.26, h: 158.33, l: 149.86, c: 158 },
            { o: 158, h: 161.99, l: 157.72, c: 161.78 },
            { o: 161.78, h: 165.26, l: 161.49, c: 164.99 },
            { o: 164.99, h: 165.09, l: 160.38, c: 160.45 },
            { o: 160.45, h: 160.59, l: 154.65, c: 154.86 },
            { o: 154.86, h: 154.96, l: 149.72, c: 149.82 },
            { o: 149.82, h: 149.92, l: 144.93, c: 144.99 },
            { o: 144.99, h: 145.05, l: 138.26, c: 138.45 },
            { o: 138.45, h: 138.65, l: 130.84, c: 130.89 },
            { o: 130.89, h: 130.99, l: 123.2, c: 123.27 },
            { o: 123.27, h: 125.47, l: 121.8, c: 125.17 },
            { o: 125.17, h: 127.68, l: 124.85, c: 127.32 },
            { o: 127.32, h: 129.15, l: 127.13, c: 128.99 },
            { o: 128.99, h: 131.78, l: 128.75, c: 131.45 },
            { o: 131.45, h: 133.43, l: 131.08, c: 133.17 }
          ],
          zones: [
            { from: 3, top: 122.67, bottom: 121.22, kind: "demand", label: "Monthly demand" }
          ],
          reveal: 25
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Skip the small-timeframe sell: it runs straight into big-picture demand. The higher timeframe says the odds are with the buyers. Buy with the stop under the monthly zone; price bounced hard."
      }
    ],
    cards: [
      { front: "Where do big trends begin and end?", back: "At larger-timeframe supply and demand." },
      { front: "Small-TF sell into HTF demand?", back: "Low odds - avoid it." },
      {
        front: "Weekly review: three reasons?",
        back: "Where trends end/begin, which side has the odds, find swing trades."
      },
      { front: "One-timeframe trader?", back: "A one-trick pony that cannot compete." },
      { front: "Long monthly wick into demand?", back: "Footprint of big buyers." }
    ],
    mnemonic: "Small waves, big wall: the higher timeframe decides."
  },
  {
    mentor: "seiden",
    n: 102,
    eli5: {
      oneLiner: "Trading is gambling where you see the cards first. Stack the odds.",
      story: "Poker players and traders both risk money on an unknown result. But in trading you can look at your cards and the dealer's before you bet, and you choose how much to bet. Seiden only buys a pullback to demand when the odds are stacked: uptrend, 3:1 room, a strong fresh level low on the curve, and a sharp drop into it. Like a casino, he never changes the rules after a loss.",
      analogy: "Like a casino: it loses some hands every day, but its fixed rules keep the odds on its side, so it wins over time."
    },
    bigIdeas: [
      "Buy pullbacks to demand only when the odds enhancers line up.",
      "A sharp drop into demand is a high-odds buy; a stair-step decline is low odds.",
      "Score the odds first, then size. Never change the rules after a loss."
    ],
    steps: [
      {
        title: "Uptrend and a quality level",
        narration: "The trend is up. Price left this demand with a strong rally, and the level has not been retested. Two enhancers already.",
        scene: {
          candles: [
            { o: 140, h: 140.17, l: 137.69, c: 137.85 },
            { o: 137.85, h: 138.24, l: 135.67, c: 135.96 },
            { o: 135.96, h: 136.2, l: 133.76, c: 134 },
            { o: 134, h: 134.64, l: 133.04, c: 133.48 },
            { o: 133.48, h: 134.5, l: 133.06, c: 134.09 },
            { o: 134.09, h: 140.69, l: 134.01, c: 140.52 },
            { o: 140.52, h: 148.18, l: 140.35, c: 148.09 },
            { o: 148.09, h: 149.89, l: 147.71, c: 149.65 },
            { o: 149.65, h: 152.46, l: 149.23, c: 152.09 },
            { o: 152.09, h: 152.57, l: 151.19, c: 151.76 },
            { o: 151.76, h: 152.47, l: 151.37, c: 152.03 },
            { o: 152.03, h: 152.12, l: 149.96, c: 150.09 },
            { o: 150.09, h: 150.14, l: 147.96, c: 148.03 },
            { o: 148.03, h: 148.16, l: 143.82, c: 143.95 },
            { o: 143.95, h: 144.01, l: 139.34, c: 139.48 },
            { o: 139.48, h: 139.57, l: 134.49, c: 134.59 },
            { o: 134.59, h: 135.24, l: 133.51, c: 134.99 },
            { o: 134.99, h: 138.05, l: 134.71, c: 137.61 },
            { o: 137.61, h: 141.68, l: 137.34, c: 141.37 },
            { o: 141.37, h: 145.09, l: 141.08, c: 144.93 },
            { o: 144.93, h: 149.4, l: 144.53, c: 149.24 },
            { o: 149.24, h: 152.33, l: 148.99, c: 152.16 }
          ],
          zones: [
            { from: 3, top: 134.09, bottom: 133.04, kind: "demand", label: "Fresh demand" }
          ],
          highlight: { from: 5, to: 6, label: "strong rally" },
          reveal: 7
        }
      },
      {
        title: "Profit margin 3:1",
        narration: "The supply above is far away: well over three times the risk from entry to stop.",
        scene: {
          candles: [
            { o: 140, h: 140.17, l: 137.69, c: 137.85 },
            { o: 137.85, h: 138.24, l: 135.67, c: 135.96 },
            { o: 135.96, h: 136.2, l: 133.76, c: 134 },
            { o: 134, h: 134.64, l: 133.04, c: 133.48 },
            { o: 133.48, h: 134.5, l: 133.06, c: 134.09 },
            { o: 134.09, h: 140.69, l: 134.01, c: 140.52 },
            { o: 140.52, h: 148.18, l: 140.35, c: 148.09 },
            { o: 148.09, h: 149.89, l: 147.71, c: 149.65 },
            { o: 149.65, h: 152.46, l: 149.23, c: 152.09 },
            { o: 152.09, h: 152.57, l: 151.19, c: 151.76 },
            { o: 151.76, h: 152.47, l: 151.37, c: 152.03 },
            { o: 152.03, h: 152.12, l: 149.96, c: 150.09 },
            { o: 150.09, h: 150.14, l: 147.96, c: 148.03 },
            { o: 148.03, h: 148.16, l: 143.82, c: 143.95 },
            { o: 143.95, h: 144.01, l: 139.34, c: 139.48 },
            { o: 139.48, h: 139.57, l: 134.49, c: 134.59 },
            { o: 134.59, h: 135.24, l: 133.51, c: 134.99 },
            { o: 134.99, h: 138.05, l: 134.71, c: 137.61 },
            { o: 137.61, h: 141.68, l: 137.34, c: 141.37 },
            { o: 141.37, h: 145.09, l: 141.08, c: 144.93 },
            { o: 144.93, h: 149.4, l: 144.53, c: 149.24 },
            { o: 149.24, h: 152.33, l: 148.99, c: 152.16 }
          ],
          zones: [
            { from: 3, top: 134.09, bottom: 133.04, kind: "demand", label: "Fresh demand" },
            { from: 9, top: 152.57, bottom: 151.76, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 134.09, label: "Entry (proximal)", kind: "entry" },
            { y: 132.74, label: "Stop beyond distal", kind: "sl" },
            { y: 151.76, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 13
        }
      },
      {
        title: "How price arrives",
        narration: "Price drops into demand sharply in big red candles, not in a slow stair-step. A sharp arrival is a much higher-odds buy.",
        scene: {
          candles: [
            { o: 140, h: 140.17, l: 137.69, c: 137.85 },
            { o: 137.85, h: 138.24, l: 135.67, c: 135.96 },
            { o: 135.96, h: 136.2, l: 133.76, c: 134 },
            { o: 134, h: 134.64, l: 133.04, c: 133.48 },
            { o: 133.48, h: 134.5, l: 133.06, c: 134.09 },
            { o: 134.09, h: 140.69, l: 134.01, c: 140.52 },
            { o: 140.52, h: 148.18, l: 140.35, c: 148.09 },
            { o: 148.09, h: 149.89, l: 147.71, c: 149.65 },
            { o: 149.65, h: 152.46, l: 149.23, c: 152.09 },
            { o: 152.09, h: 152.57, l: 151.19, c: 151.76 },
            { o: 151.76, h: 152.47, l: 151.37, c: 152.03 },
            { o: 152.03, h: 152.12, l: 149.96, c: 150.09 },
            { o: 150.09, h: 150.14, l: 147.96, c: 148.03 },
            { o: 148.03, h: 148.16, l: 143.82, c: 143.95 },
            { o: 143.95, h: 144.01, l: 139.34, c: 139.48 },
            { o: 139.48, h: 139.57, l: 134.49, c: 134.59 },
            { o: 134.59, h: 135.24, l: 133.51, c: 134.99 },
            { o: 134.99, h: 138.05, l: 134.71, c: 137.61 },
            { o: 137.61, h: 141.68, l: 137.34, c: 141.37 },
            { o: 141.37, h: 145.09, l: 141.08, c: 144.93 },
            { o: 144.93, h: 149.4, l: 144.53, c: 149.24 },
            { o: 149.24, h: 152.33, l: 148.99, c: 152.16 }
          ],
          zones: [
            { from: 3, top: 134.09, bottom: 133.04, kind: "demand", label: "Fresh demand" },
            { from: 9, top: 152.57, bottom: 151.76, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 134.09, label: "Entry (proximal)", kind: "entry" },
            { y: 132.74, label: "Stop beyond distal", kind: "sl" },
            { y: 151.76, label: "Target: opposing level", kind: "tp" }
          ],
          highlight: { from: 13, to: 15, label: "sharp arrival" },
          reveal: 16
        }
      },
      {
        title: "Bet, then accept the result",
        narration: "With the odds stacked we decide size and buy. This time price rallies to supply, but losses will come too, and the rules do not change.",
        scene: {
          candles: [
            { o: 140, h: 140.17, l: 137.69, c: 137.85 },
            { o: 137.85, h: 138.24, l: 135.67, c: 135.96 },
            { o: 135.96, h: 136.2, l: 133.76, c: 134 },
            { o: 134, h: 134.64, l: 133.04, c: 133.48 },
            { o: 133.48, h: 134.5, l: 133.06, c: 134.09 },
            { o: 134.09, h: 140.69, l: 134.01, c: 140.52 },
            { o: 140.52, h: 148.18, l: 140.35, c: 148.09 },
            { o: 148.09, h: 149.89, l: 147.71, c: 149.65 },
            { o: 149.65, h: 152.46, l: 149.23, c: 152.09 },
            { o: 152.09, h: 152.57, l: 151.19, c: 151.76 },
            { o: 151.76, h: 152.47, l: 151.37, c: 152.03 },
            { o: 152.03, h: 152.12, l: 149.96, c: 150.09 },
            { o: 150.09, h: 150.14, l: 147.96, c: 148.03 },
            { o: 148.03, h: 148.16, l: 143.82, c: 143.95 },
            { o: 143.95, h: 144.01, l: 139.34, c: 139.48 },
            { o: 139.48, h: 139.57, l: 134.49, c: 134.59 },
            { o: 134.59, h: 135.24, l: 133.51, c: 134.99 },
            { o: 134.99, h: 138.05, l: 134.71, c: 137.61 },
            { o: 137.61, h: 141.68, l: 137.34, c: 141.37 },
            { o: 141.37, h: 145.09, l: 141.08, c: 144.93 },
            { o: 144.93, h: 149.4, l: 144.53, c: 149.24 },
            { o: 149.24, h: 152.33, l: 148.99, c: 152.16 }
          ],
          zones: [
            { from: 3, top: 134.09, bottom: 133.04, kind: "demand", label: "Fresh demand" },
            { from: 9, top: 152.57, bottom: 151.76, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 134.09, label: "Entry (proximal)", kind: "entry" },
            { y: 132.74, label: "Stop beyond distal", kind: "sl" },
            { y: 151.76, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 16, y: 132.11, text: "Odds stacked" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which arrival into demand gives the higher-odds buy?",
        options: [
          "A slow stair-step decline",
          "A sharp drop of big red candles",
          "A sideways drift",
          "They are the same"
        ],
        answer: 1,
        explain: "Stair-step into demand = low odds; sharp drop = much higher odds."
      },
      {
        type: "order",
        q: "Order Seiden's odds enhancers for buying a pullback.",
        items: [
          "Uptrend",
          "Profit margin at least 3:1",
          "Quality level: strong rally, untested, near HTF demand, low on the curve",
          "Sharp arrival into demand"
        ],
        explain: "Trend, room, quality, arrival. Then decide how much to risk."
      },
      {
        type: "spot",
        q: "Click the candles that show the sharp arrival.",
        scene: {
          candles: [
            { o: 140, h: 140.17, l: 137.69, c: 137.85 },
            { o: 137.85, h: 138.24, l: 135.67, c: 135.96 },
            { o: 135.96, h: 136.2, l: 133.76, c: 134 },
            { o: 134, h: 134.64, l: 133.04, c: 133.48 },
            { o: 133.48, h: 134.5, l: 133.06, c: 134.09 },
            { o: 134.09, h: 140.69, l: 134.01, c: 140.52 },
            { o: 140.52, h: 148.18, l: 140.35, c: 148.09 },
            { o: 148.09, h: 149.89, l: 147.71, c: 149.65 },
            { o: 149.65, h: 152.46, l: 149.23, c: 152.09 },
            { o: 152.09, h: 152.57, l: 151.19, c: 151.76 },
            { o: 151.76, h: 152.47, l: 151.37, c: 152.03 },
            { o: 152.03, h: 152.12, l: 149.96, c: 150.09 },
            { o: 150.09, h: 150.14, l: 147.96, c: 148.03 },
            { o: 148.03, h: 148.16, l: 143.82, c: 143.95 },
            { o: 143.95, h: 144.01, l: 139.34, c: 139.48 },
            { o: 139.48, h: 139.57, l: 134.49, c: 134.59 },
            { o: 134.59, h: 135.24, l: 133.51, c: 134.99 },
            { o: 134.99, h: 138.05, l: 134.71, c: 137.61 },
            { o: 137.61, h: 141.68, l: 137.34, c: 141.37 },
            { o: 141.37, h: 145.09, l: 141.08, c: 144.93 },
            { o: 144.93, h: 149.4, l: 144.53, c: 149.24 },
            { o: 149.24, h: 152.33, l: 148.99, c: 152.16 }
          ],
          zones: [
            { from: 3, top: 134.09, bottom: 133.04, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 13, to: 15 },
        explain: "Big red candles dropping straight into fresh demand - the high-odds arrival."
      },
      {
        type: "tf",
        q: "After three losses in a row, a good trader should change the rules.",
        answer: false,
        explain: "Casinos lose every day but never change their rules after a loss."
      },
      {
        type: "mcq",
        q: "When do you decide how much capital to risk?",
        options: ["Before looking at the chart", "After assessing the odds", "Never", "After the trade"],
        answer: 1,
        explain: "Assess the odds first, then size."
      }
    ],
    practice: [
      {
        prompt: "Uptrend, a fresh demand left with a strong rally, supply far above, and price just dropped sharply into the zone. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 142, h: 142.12, l: 139.37, c: 139.56 },
            { o: 139.56, h: 139.96, l: 137.12, c: 137.56 },
            { o: 137.56, h: 137.7, l: 134.62, c: 135 },
            { o: 135, h: 135.56, l: 134.34, c: 134.71 },
            { o: 134.71, h: 136.38, l: 134.3, c: 136.05 },
            { o: 136.05, h: 136.52, l: 134.47, c: 134.94 },
            { o: 134.94, h: 141.58, l: 134.84, c: 141.38 },
            { o: 141.38, h: 148.07, l: 141.33, c: 147.94 },
            { o: 147.94, h: 150.29, l: 147.77, c: 149.93 },
            { o: 149.93, h: 152.07, l: 149.81, c: 151.94 },
            { o: 151.94, h: 152.32, l: 151.29, c: 151.79 },
            { o: 151.79, h: 152.5, l: 151.28, c: 152.02 },
            { o: 152.02, h: 152.13, l: 149.99, c: 150.09 },
            { o: 150.09, h: 150.2, l: 147.84, c: 148.02 },
            { o: 148.02, h: 148.2, l: 144.29, c: 144.36 },
            { o: 144.36, h: 144.55, l: 139.96, c: 140.15 },
            { o: 140.15, h: 140.36, l: 136.48, c: 136.55 },
            { o: 136.55, h: 137.2, l: 135.09, c: 136.95 },
            { o: 136.95, h: 140.36, l: 136.73, c: 139.94 },
            { o: 139.94, h: 143.35, l: 139.54, c: 143.21 },
            { o: 143.21, h: 145.98, l: 143.06, c: 145.73 },
            { o: 145.73, h: 150.14, l: 145.38, c: 149.77 },
            { o: 149.77, h: 152.36, l: 149.4, c: 152.19 }
          ],
          zones: [
            { from: 3, top: 136.05, bottom: 134.3, kind: "demand", label: "Demand" },
            { from: 10, top: 152.5, bottom: 151.79, kind: "supply", label: "Supply" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "buy", tp: 151.79 },
        explain: "Every enhancer lines up: trend, room, quality, sharp arrival. Buy at the top line, stop below. Price reached the supply."
      },
      {
        prompt: "Price is creeping down toward demand in a long stair-step: small legs and little bases all the way. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 142, h: 142.23, l: 139.74, c: 139.88 },
            { o: 139.88, h: 140.27, l: 136.57, c: 136.76 },
            { o: 136.76, h: 137.17, l: 134.88, c: 135 },
            { o: 135, h: 135.61, l: 133.82, c: 134.27 },
            { o: 134.27, h: 135.83, l: 133.61, c: 135.35 },
            { o: 135.35, h: 135.82, l: 134.41, c: 135.08 },
            { o: 135.08, h: 140.88, l: 134.92, c: 140.78 },
            { o: 140.78, h: 147.15, l: 140.57, c: 147.08 },
            { o: 147.08, h: 148.19, l: 146.48, c: 147.6 },
            { o: 147.6, h: 149.12, l: 147.05, c: 148.67 },
            { o: 148.67, h: 149.22, l: 147.65, c: 148.08 },
            { o: 148.08, h: 148.31, l: 146.19, c: 146.52 },
            { o: 146.52, h: 146.9, l: 144.76, c: 145.16 },
            { o: 145.16, h: 145.52, l: 144.86, c: 145.23 },
            { o: 145.23, h: 145.55, l: 142.14, c: 142.44 },
            { o: 142.44, h: 142.63, l: 140.89, c: 141.08 },
            { o: 141.08, h: 141.42, l: 140.92, c: 141.15 },
            { o: 141.15, h: 141.42, l: 138.09, c: 138.36 },
            { o: 138.36, h: 138.56, l: 136.61, c: 137.01 },
            { o: 137.01, h: 137.17, l: 135.6, c: 135.85 },
            { o: 135.85, h: 136, l: 130.31, c: 130.61 },
            { o: 130.61, h: 130.9, l: 128.74, c: 128.92 },
            { o: 128.92, h: 129.15, l: 127.63, c: 127.79 },
            { o: 127.79, h: 128.04, l: 126.15, c: 126.45 },
            { o: 126.45, h: 126.7, l: 124.18, c: 124.61 }
          ],
          zones: [
            { from: 3, top: 135.35, bottom: 133.61, kind: "demand", label: "Demand" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "A stair-step arrival is a low-odds buy. Skip it. This time price broke through the zone."
      }
    ],
    cards: [
      {
        front: "Why is trading \"gambling with stacked odds\"?",
        back: "You see the cards before betting and choose the bet size."
      },
      { front: "Minimum profit margin?", back: "3:1." },
      {
        front: "Quality demand (4 parts)?",
        back: "Strong rally out, untested, near HTF demand, pivot low well placed on the curve."
      },
      { front: "Stair-step arrival?", back: "Low-odds buy." },
      { front: "Sharp drop into demand?", back: "Higher-odds buy." },
      { front: "What never changes after a loss?", back: "The rules." }
    ],
    mnemonic: "Trend, Three, Quality, Quick: uptrend, 3:1, quality level, quick arrival."
  },
  {
    mentor: "seiden",
    n: 104,
    eli5: {
      oneLiner: "The best gap trade is where the other side makes the biggest mistake.",
      story: "Seiden crosses two questions: which way is the trend, and which way did price gap? In a downtrend, a gap up into supply is the best short, because the buyer is buying against the trend, after a rally, into sellers. In an uptrend, a gap down into demand is the best buy for the mirror reason. Gaps against the trend can still be traded, but only with low risk and a big target.",
      analogy: "Like swimming: swimming with the river current is easy; a gap with the trend into a level lets the current carry your trade."
    },
    bigIdeas: [
      "Downtrend + gap up into supply = highest-probability short.",
      "Uptrend + gap down into demand = highest-probability long.",
      "Counter-trend gap trades need low risk and a high target."
    ],
    steps: [
      {
        title: "Know the trend",
        narration: "Price is falling overall: a small rally, then a big drop. The trend is down.",
        scene: {
          candles: [
            { o: 150, h: 152.27, l: 149.85, c: 151.83 },
            { o: 151.83, h: 154.39, l: 151.55, c: 154.26 },
            { o: 154.26, h: 156.29, l: 154.05, c: 156 },
            { o: 156, h: 157.32, l: 155.59, c: 156.68 },
            { o: 156.68, h: 157.2, l: 154.69, c: 155.36 },
            { o: 155.36, h: 156.36, l: 154.93, c: 156.05 },
            { o: 156.05, h: 156.13, l: 150.64, c: 150.79 },
            { o: 150.79, h: 150.96, l: 145.41, c: 145.57 },
            { o: 145.57, h: 145.78, l: 139.87, c: 140.05 },
            { o: 140.05, h: 140.71, l: 138.73, c: 139.31 },
            { o: 139.31, h: 139.6, l: 138.58, c: 138.99 },
            { o: 138.99, h: 139.67, l: 138.39, c: 139.05 },
            { o: 139.05, h: 144.22, l: 138.75, c: 143.81 },
            { o: 143.81, h: 148.06, l: 143.4, c: 147.66 },
            { o: 147.66, h: 152.51, l: 147.33, c: 152.36 },
            { o: 155.95, h: 156.35, l: 153.86, c: 154.16 },
            { o: 154.16, h: 154.47, l: 151.59, c: 151.77 },
            { o: 151.77, h: 152.05, l: 149.29, c: 149.43 },
            { o: 149.43, h: 149.66, l: 147.66, c: 147.84 },
            { o: 147.84, h: 148.15, l: 145, c: 145.16 }
          ],
          highlight: { from: 6, to: 8, label: "downtrend" },
          reveal: 9
        }
      },
      {
        title: "Mark supply",
        narration: "The pause before the big drop is supply.",
        scene: {
          candles: [
            { o: 150, h: 152.27, l: 149.85, c: 151.83 },
            { o: 151.83, h: 154.39, l: 151.55, c: 154.26 },
            { o: 154.26, h: 156.29, l: 154.05, c: 156 },
            { o: 156, h: 157.32, l: 155.59, c: 156.68 },
            { o: 156.68, h: 157.2, l: 154.69, c: 155.36 },
            { o: 155.36, h: 156.36, l: 154.93, c: 156.05 },
            { o: 156.05, h: 156.13, l: 150.64, c: 150.79 },
            { o: 150.79, h: 150.96, l: 145.41, c: 145.57 },
            { o: 145.57, h: 145.78, l: 139.87, c: 140.05 },
            { o: 140.05, h: 140.71, l: 138.73, c: 139.31 },
            { o: 139.31, h: 139.6, l: 138.58, c: 138.99 },
            { o: 138.99, h: 139.67, l: 138.39, c: 139.05 },
            { o: 139.05, h: 144.22, l: 138.75, c: 143.81 },
            { o: 143.81, h: 148.06, l: 143.4, c: 147.66 },
            { o: 147.66, h: 152.51, l: 147.33, c: 152.36 },
            { o: 155.95, h: 156.35, l: 153.86, c: 154.16 },
            { o: 154.16, h: 154.47, l: 151.59, c: 151.77 },
            { o: 151.77, h: 152.05, l: 149.29, c: 149.43 },
            { o: 149.43, h: 149.66, l: 147.66, c: 147.84 },
            { o: 147.84, h: 148.15, l: 145, c: 145.16 }
          ],
          zones: [
            { from: 3, top: 157.32, bottom: 155.36, kind: "supply", label: "Supply" }
          ],
          reveal: 12
        }
      },
      {
        title: "Gap up into supply",
        narration: "Price gaps up at the open straight into supply. Only a novice buys a gap up into supply in a downtrend. Sell to him, stop above the zone.",
        scene: {
          candles: [
            { o: 150, h: 152.27, l: 149.85, c: 151.83 },
            { o: 151.83, h: 154.39, l: 151.55, c: 154.26 },
            { o: 154.26, h: 156.29, l: 154.05, c: 156 },
            { o: 156, h: 157.32, l: 155.59, c: 156.68 },
            { o: 156.68, h: 157.2, l: 154.69, c: 155.36 },
            { o: 155.36, h: 156.36, l: 154.93, c: 156.05 },
            { o: 156.05, h: 156.13, l: 150.64, c: 150.79 },
            { o: 150.79, h: 150.96, l: 145.41, c: 145.57 },
            { o: 145.57, h: 145.78, l: 139.87, c: 140.05 },
            { o: 140.05, h: 140.71, l: 138.73, c: 139.31 },
            { o: 139.31, h: 139.6, l: 138.58, c: 138.99 },
            { o: 138.99, h: 139.67, l: 138.39, c: 139.05 },
            { o: 139.05, h: 144.22, l: 138.75, c: 143.81 },
            { o: 143.81, h: 148.06, l: 143.4, c: 147.66 },
            { o: 147.66, h: 152.51, l: 147.33, c: 152.36 },
            { o: 155.95, h: 156.35, l: 153.86, c: 154.16 },
            { o: 154.16, h: 154.47, l: 151.59, c: 151.77 },
            { o: 151.77, h: 152.05, l: 149.29, c: 149.43 },
            { o: 149.43, h: 149.66, l: 147.66, c: 147.84 },
            { o: 147.84, h: 148.15, l: 145, c: 145.16 }
          ],
          zones: [
            { from: 3, top: 157.32, bottom: 155.36, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 155.36, label: "Entry (proximal)", kind: "entry" },
            { y: 157.62, label: "Stop beyond distal", kind: "sl" }
          ],
          highlight: { from: 15, to: 15, label: "gap up into supply" },
          reveal: 16
        }
      },
      {
        title: "Quick fill",
        narration: "This gap usually fills very quickly and price keeps falling with the trend.",
        scene: {
          candles: [
            { o: 150, h: 152.27, l: 149.85, c: 151.83 },
            { o: 151.83, h: 154.39, l: 151.55, c: 154.26 },
            { o: 154.26, h: 156.29, l: 154.05, c: 156 },
            { o: 156, h: 157.32, l: 155.59, c: 156.68 },
            { o: 156.68, h: 157.2, l: 154.69, c: 155.36 },
            { o: 155.36, h: 156.36, l: 154.93, c: 156.05 },
            { o: 156.05, h: 156.13, l: 150.64, c: 150.79 },
            { o: 150.79, h: 150.96, l: 145.41, c: 145.57 },
            { o: 145.57, h: 145.78, l: 139.87, c: 140.05 },
            { o: 140.05, h: 140.71, l: 138.73, c: 139.31 },
            { o: 139.31, h: 139.6, l: 138.58, c: 138.99 },
            { o: 138.99, h: 139.67, l: 138.39, c: 139.05 },
            { o: 139.05, h: 144.22, l: 138.75, c: 143.81 },
            { o: 143.81, h: 148.06, l: 143.4, c: 147.66 },
            { o: 147.66, h: 152.51, l: 147.33, c: 152.36 },
            { o: 155.95, h: 156.35, l: 153.86, c: 154.16 },
            { o: 154.16, h: 154.47, l: 151.59, c: 151.77 },
            { o: 151.77, h: 152.05, l: 149.29, c: 149.43 },
            { o: 149.43, h: 149.66, l: 147.66, c: 147.84 },
            { o: 147.84, h: 148.15, l: 145, c: 145.16 }
          ],
          zones: [
            { from: 3, top: 157.32, bottom: 155.36, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 155.36, label: "Entry (proximal)", kind: "entry" },
            { y: 157.62, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 19, y: 143.6, text: "With-trend gap fade" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Downtrend, and price gaps up into supply. What is it?",
        options: [
          "A low-odds buy",
          "Likely the highest-probability short",
          "No trade ever",
          "A breakout buy"
        ],
        answer: 1,
        explain: "The buyer is buying against the trend, after a rally, into supply."
      },
      {
        type: "mcq",
        q: "Uptrend, and price gaps down into demand. What is it?",
        options: ["Likely the highest-probability long", "A short", "Ignore it", "Low odds"],
        answer: 0,
        explain: "Only a novice sells a gap down into demand in an uptrend."
      },
      {
        type: "tf",
        q: "In a downtrend, a gap down into demand is the best buy of all.",
        answer: false,
        explain: "It is a lower-probability buy because it is against the trend. It usually fills, but takes longer."
      },
      {
        type: "spot",
        q: "Click the gap candle that is the highest-odds trade.",
        scene: {
          candles: [
            { o: 150, h: 152.27, l: 149.85, c: 151.83 },
            { o: 151.83, h: 154.39, l: 151.55, c: 154.26 },
            { o: 154.26, h: 156.29, l: 154.05, c: 156 },
            { o: 156, h: 157.32, l: 155.59, c: 156.68 },
            { o: 156.68, h: 157.2, l: 154.69, c: 155.36 },
            { o: 155.36, h: 156.36, l: 154.93, c: 156.05 },
            { o: 156.05, h: 156.13, l: 150.64, c: 150.79 },
            { o: 150.79, h: 150.96, l: 145.41, c: 145.57 },
            { o: 145.57, h: 145.78, l: 139.87, c: 140.05 },
            { o: 140.05, h: 140.71, l: 138.73, c: 139.31 },
            { o: 139.31, h: 139.6, l: 138.58, c: 138.99 },
            { o: 138.99, h: 139.67, l: 138.39, c: 139.05 },
            { o: 139.05, h: 144.22, l: 138.75, c: 143.81 },
            { o: 143.81, h: 148.06, l: 143.4, c: 147.66 },
            { o: 147.66, h: 152.51, l: 147.33, c: 152.36 },
            { o: 155.95, h: 156.35, l: 153.86, c: 154.16 },
            { o: 154.16, h: 154.47, l: 151.59, c: 151.77 },
            { o: 151.77, h: 152.05, l: 149.29, c: 149.43 },
            { o: 149.43, h: 149.66, l: 147.66, c: 147.84 },
            { o: 147.84, h: 148.15, l: 145, c: 145.16 }
          ],
          zones: [
            { from: 3, top: 157.32, bottom: 155.36, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 15, to: 15 },
        explain: "In this downtrend the gap up into supply is the with-trend fade."
      },
      {
        type: "mcq",
        q: "What must every gap trade have?",
        options: [
          "A news story",
          "Low risk and high reward measured on the chart",
          "A big volume bar",
          "An indicator signal"
        ],
        answer: 1,
        explain: "In every scenario risk must be low and reward high, determined objectively."
      }
    ],
    practice: [
      {
        prompt: "The trend is up. This morning price gaps down right into a fresh demand zone. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.42, l: 147.69, c: 147.9 },
            { o: 147.9, h: 148.2, l: 145.8, c: 146.16 },
            { o: 146.16, h: 146.48, l: 143.8, c: 144 },
            { o: 144, h: 144.61, l: 142.6, c: 143 },
            { o: 143, h: 145.27, l: 142.59, c: 144.72 },
            { o: 144.72, h: 145.26, l: 143.52, c: 144.06 },
            { o: 144.06, h: 149.63, l: 144.01, c: 149.52 },
            { o: 149.52, h: 154.3, l: 149.38, c: 154.23 },
            { o: 154.23, h: 160.22, l: 154.1, c: 160.06 },
            { o: 160.06, h: 160.98, l: 159.64, c: 160.58 },
            { o: 160.58, h: 161.23, l: 159.12, c: 159.7 },
            { o: 159.7, h: 161.34, l: 159.41, c: 161.06 },
            { o: 161.06, h: 161.46, l: 156.16, c: 156.32 },
            { o: 156.32, h: 156.61, l: 152.32, c: 152.57 },
            { o: 152.57, h: 152.73, l: 147.31, c: 147.72 },
            { o: 144.08, h: 146.22, l: 143.68, c: 145.92 },
            { o: 145.92, h: 148.35, l: 145.62, c: 148.21 },
            { o: 148.21, h: 150.31, l: 147.93, c: 150.05 },
            { o: 150.05, h: 152.48, l: 149.87, c: 152.31 },
            { o: 152.31, h: 155.17, l: 152.09, c: 154.92 }
          ],
          zones: [
            { from: 3, top: 144.72, bottom: 142.59, kind: "demand", label: "Demand" }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Uptrend plus a gap down into demand: the seller makes the biggest mistake. Buy, stop under the zone. The gap filled quickly."
      }
    ],
    cards: [
      { front: "Downtrend + gap up into supply?", back: "Highest-probability short." },
      { front: "Uptrend + gap down into demand?", back: "Highest-probability long." },
      { front: "Downtrend + gap down into demand?", back: "Lower-probability buy; usually fills, but slower." },
      { front: "Uptrend + gap up into supply?", back: "Short only if risk is low and target high." },
      { front: "The deciding factor for gaps?", back: "Who is making the biggest mistake." }
    ],
    mnemonic: "With the river, into the wall: with-trend gaps into a level are the best fades."
  },
  {
    mentor: "seiden",
    n: 106,
    eli5: {
      oneLiner: "Buy only the first or second return to support. Then say \"no thanks\".",
      story: "Books say wait until support has been tested a couple of times before you trust it. Seiden completely disagrees. On the trading floor he saw that a stack of buy orders is what makes demand, and each time price comes back, more of those orders get filled. After a few visits, few buyers are left and the level is likely to break.",
      analogy: "Like a pantry: every trip to it takes some food out. After enough trips, the shelf is empty."
    },
    bigIdeas: [
      "Demand is a stack of resting buy orders; each revisit fills some of them.",
      "XLT rule: do not buy a support level that has been tested more than once.",
      "Buy the first or second revisit only, with a desirable profit margin."
    ],
    steps: [
      {
        title: "Box the demand",
        narration: "Price based here and rallied: a demand area, a stack of resting buy orders.",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 157.49, c: 157.88 },
            { o: 157.88, h: 158.17, l: 154.58, c: 154.77 },
            { o: 154.77, h: 155.03, l: 152.87, c: 153.13 },
            { o: 153.13, h: 153.34, l: 150.14, c: 150.46 },
            { o: 150.46, h: 150.76, l: 147.65, c: 148 },
            { o: 148, h: 148.38, l: 146.95, c: 147.65 },
            { o: 147.65, h: 149.04, l: 147.22, c: 148.54 },
            { o: 148.54, h: 149.02, l: 146.72, c: 147.1 },
            { o: 147.1, h: 148.73, l: 146.73, c: 148.07 },
            { o: 148.07, h: 153.59, l: 147.88, c: 153.42 },
            { o: 153.42, h: 156.62, l: 153.06, c: 156.17 },
            { o: 156.17, h: 161.44, l: 155.9, c: 161.07 },
            { o: 161.07, h: 161.68, l: 160.52, c: 161.19 },
            { o: 161.19, h: 162.03, l: 160.62, c: 161.37 },
            { o: 161.37, h: 163.84, l: 160.83, c: 163.18 },
            { o: 163.18, h: 164.08, l: 162.77, c: 163.57 },
            { o: 163.57, h: 163.77, l: 159.18, c: 159.55 },
            { o: 159.55, h: 159.83, l: 153.77, c: 154.14 },
            { o: 154.14, h: 154.27, l: 148.89, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.63, c: 149.24 },
            { o: 149.24, h: 151.31, l: 149, c: 151.13 },
            { o: 151.13, h: 153.67, l: 150.96, c: 153.4 },
            { o: 153.4, h: 156.46, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.63, l: 153.96, c: 154.33 },
            { o: 154.33, h: 154.49, l: 151.2, c: 151.63 },
            { o: 151.63, h: 151.76, l: 148.85, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.36, c: 149.24 },
            { o: 149.24, h: 151.56, l: 149.02, c: 151.19 },
            { o: 151.19, h: 153.75, l: 151.04, c: 153.54 },
            { o: 153.54, h: 156.62, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.47, l: 153.4, c: 153.59 },
            { o: 153.59, h: 154.04, l: 150.6, c: 151.03 },
            { o: 151.03, h: 151.35, l: 148.82, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.08, c: 149.24 },
            { o: 149.24, h: 152.32, l: 149.05, c: 152.01 },
            { o: 152.01, h: 154.26, l: 151.6, c: 154.07 },
            { o: 154.07, h: 156.46, l: 153.68, c: 156.24 },
            { o: 156.24, h: 156.46, l: 154.07, c: 154.26 },
            { o: 154.26, h: 154.37, l: 152.36, c: 152.52 },
            { o: 152.52, h: 152.64, l: 150.64, c: 150.7 },
            { o: 150.7, h: 150.76, l: 148.95, c: 149.04 },
            { o: 149.04, h: 149.19, l: 143.42, c: 143.72 },
            { o: 143.72, h: 144.03, l: 142.23, c: 142.56 },
            { o: 142.56, h: 142.8, l: 140.47, c: 140.85 },
            { o: 140.85, h: 141.16, l: 138.64, c: 138.95 },
            { o: 138.95, h: 139.28, l: 137.43, c: 137.72 }
          ],
          zones: [
            { from: 5, top: 148.54, bottom: 146.72, kind: "demand", label: "Demand" }
          ],
          reveal: 12
        }
      },
      {
        title: "Visits 1, 2 and 3",
        narration: "Price comes back three times. Each bounce uses up more of the buyers, and each bounce is weaker.",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 157.49, c: 157.88 },
            { o: 157.88, h: 158.17, l: 154.58, c: 154.77 },
            { o: 154.77, h: 155.03, l: 152.87, c: 153.13 },
            { o: 153.13, h: 153.34, l: 150.14, c: 150.46 },
            { o: 150.46, h: 150.76, l: 147.65, c: 148 },
            { o: 148, h: 148.38, l: 146.95, c: 147.65 },
            { o: 147.65, h: 149.04, l: 147.22, c: 148.54 },
            { o: 148.54, h: 149.02, l: 146.72, c: 147.1 },
            { o: 147.1, h: 148.73, l: 146.73, c: 148.07 },
            { o: 148.07, h: 153.59, l: 147.88, c: 153.42 },
            { o: 153.42, h: 156.62, l: 153.06, c: 156.17 },
            { o: 156.17, h: 161.44, l: 155.9, c: 161.07 },
            { o: 161.07, h: 161.68, l: 160.52, c: 161.19 },
            { o: 161.19, h: 162.03, l: 160.62, c: 161.37 },
            { o: 161.37, h: 163.84, l: 160.83, c: 163.18 },
            { o: 163.18, h: 164.08, l: 162.77, c: 163.57 },
            { o: 163.57, h: 163.77, l: 159.18, c: 159.55 },
            { o: 159.55, h: 159.83, l: 153.77, c: 154.14 },
            { o: 154.14, h: 154.27, l: 148.89, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.63, c: 149.24 },
            { o: 149.24, h: 151.31, l: 149, c: 151.13 },
            { o: 151.13, h: 153.67, l: 150.96, c: 153.4 },
            { o: 153.4, h: 156.46, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.63, l: 153.96, c: 154.33 },
            { o: 154.33, h: 154.49, l: 151.2, c: 151.63 },
            { o: 151.63, h: 151.76, l: 148.85, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.36, c: 149.24 },
            { o: 149.24, h: 151.56, l: 149.02, c: 151.19 },
            { o: 151.19, h: 153.75, l: 151.04, c: 153.54 },
            { o: 153.54, h: 156.62, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.47, l: 153.4, c: 153.59 },
            { o: 153.59, h: 154.04, l: 150.6, c: 151.03 },
            { o: 151.03, h: 151.35, l: 148.82, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.08, c: 149.24 },
            { o: 149.24, h: 152.32, l: 149.05, c: 152.01 },
            { o: 152.01, h: 154.26, l: 151.6, c: 154.07 },
            { o: 154.07, h: 156.46, l: 153.68, c: 156.24 },
            { o: 156.24, h: 156.46, l: 154.07, c: 154.26 },
            { o: 154.26, h: 154.37, l: 152.36, c: 152.52 },
            { o: 152.52, h: 152.64, l: 150.64, c: 150.7 },
            { o: 150.7, h: 150.76, l: 148.95, c: 149.04 },
            { o: 149.04, h: 149.19, l: 143.42, c: 143.72 },
            { o: 143.72, h: 144.03, l: 142.23, c: 142.56 },
            { o: 142.56, h: 142.8, l: 140.47, c: 140.85 },
            { o: 140.85, h: 141.16, l: 138.64, c: 138.95 },
            { o: 138.95, h: 139.28, l: 137.43, c: 137.72 }
          ],
          zones: [
            { from: 5, top: 148.54, bottom: 146.72, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 19, y: 146.23, text: "1" },
            { x: 26, y: 145.96, text: "2" },
            { x: 33, y: 145.68, text: "3" }
          ],
          reveal: 37
        }
      },
      {
        title: "The fourth visit",
        narration: "XLT does not buy a level tested more than once. Politely say \"no thanks\".",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 157.49, c: 157.88 },
            { o: 157.88, h: 158.17, l: 154.58, c: 154.77 },
            { o: 154.77, h: 155.03, l: 152.87, c: 153.13 },
            { o: 153.13, h: 153.34, l: 150.14, c: 150.46 },
            { o: 150.46, h: 150.76, l: 147.65, c: 148 },
            { o: 148, h: 148.38, l: 146.95, c: 147.65 },
            { o: 147.65, h: 149.04, l: 147.22, c: 148.54 },
            { o: 148.54, h: 149.02, l: 146.72, c: 147.1 },
            { o: 147.1, h: 148.73, l: 146.73, c: 148.07 },
            { o: 148.07, h: 153.59, l: 147.88, c: 153.42 },
            { o: 153.42, h: 156.62, l: 153.06, c: 156.17 },
            { o: 156.17, h: 161.44, l: 155.9, c: 161.07 },
            { o: 161.07, h: 161.68, l: 160.52, c: 161.19 },
            { o: 161.19, h: 162.03, l: 160.62, c: 161.37 },
            { o: 161.37, h: 163.84, l: 160.83, c: 163.18 },
            { o: 163.18, h: 164.08, l: 162.77, c: 163.57 },
            { o: 163.57, h: 163.77, l: 159.18, c: 159.55 },
            { o: 159.55, h: 159.83, l: 153.77, c: 154.14 },
            { o: 154.14, h: 154.27, l: 148.89, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.63, c: 149.24 },
            { o: 149.24, h: 151.31, l: 149, c: 151.13 },
            { o: 151.13, h: 153.67, l: 150.96, c: 153.4 },
            { o: 153.4, h: 156.46, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.63, l: 153.96, c: 154.33 },
            { o: 154.33, h: 154.49, l: 151.2, c: 151.63 },
            { o: 151.63, h: 151.76, l: 148.85, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.36, c: 149.24 },
            { o: 149.24, h: 151.56, l: 149.02, c: 151.19 },
            { o: 151.19, h: 153.75, l: 151.04, c: 153.54 },
            { o: 153.54, h: 156.62, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.47, l: 153.4, c: 153.59 },
            { o: 153.59, h: 154.04, l: 150.6, c: 151.03 },
            { o: 151.03, h: 151.35, l: 148.82, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.08, c: 149.24 },
            { o: 149.24, h: 152.32, l: 149.05, c: 152.01 },
            { o: 152.01, h: 154.26, l: 151.6, c: 154.07 },
            { o: 154.07, h: 156.46, l: 153.68, c: 156.24 },
            { o: 156.24, h: 156.46, l: 154.07, c: 154.26 },
            { o: 154.26, h: 154.37, l: 152.36, c: 152.52 },
            { o: 152.52, h: 152.64, l: 150.64, c: 150.7 },
            { o: 150.7, h: 150.76, l: 148.95, c: 149.04 },
            { o: 149.04, h: 149.19, l: 143.42, c: 143.72 },
            { o: 143.72, h: 144.03, l: 142.23, c: 142.56 },
            { o: 142.56, h: 142.8, l: 140.47, c: 140.85 },
            { o: 140.85, h: 141.16, l: 138.64, c: 138.95 },
            { o: 138.95, h: 139.28, l: 137.43, c: 137.72 }
          ],
          zones: [
            { from: 5, top: 148.54, bottom: 146.72, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 19, y: 146.23, text: "1" },
            { x: 26, y: 145.96, text: "2" },
            { x: 33, y: 145.68, text: "3" }
          ],
          highlight: { from: 37, to: 40, label: "4th visit" },
          reveal: 41
        }
      },
      {
        title: "It breaks",
        narration: "With the buyers used up, price falls straight through. Wait for fresher demand lower down.",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 157.49, c: 157.88 },
            { o: 157.88, h: 158.17, l: 154.58, c: 154.77 },
            { o: 154.77, h: 155.03, l: 152.87, c: 153.13 },
            { o: 153.13, h: 153.34, l: 150.14, c: 150.46 },
            { o: 150.46, h: 150.76, l: 147.65, c: 148 },
            { o: 148, h: 148.38, l: 146.95, c: 147.65 },
            { o: 147.65, h: 149.04, l: 147.22, c: 148.54 },
            { o: 148.54, h: 149.02, l: 146.72, c: 147.1 },
            { o: 147.1, h: 148.73, l: 146.73, c: 148.07 },
            { o: 148.07, h: 153.59, l: 147.88, c: 153.42 },
            { o: 153.42, h: 156.62, l: 153.06, c: 156.17 },
            { o: 156.17, h: 161.44, l: 155.9, c: 161.07 },
            { o: 161.07, h: 161.68, l: 160.52, c: 161.19 },
            { o: 161.19, h: 162.03, l: 160.62, c: 161.37 },
            { o: 161.37, h: 163.84, l: 160.83, c: 163.18 },
            { o: 163.18, h: 164.08, l: 162.77, c: 163.57 },
            { o: 163.57, h: 163.77, l: 159.18, c: 159.55 },
            { o: 159.55, h: 159.83, l: 153.77, c: 154.14 },
            { o: 154.14, h: 154.27, l: 148.89, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.63, c: 149.24 },
            { o: 149.24, h: 151.31, l: 149, c: 151.13 },
            { o: 151.13, h: 153.67, l: 150.96, c: 153.4 },
            { o: 153.4, h: 156.46, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.63, l: 153.96, c: 154.33 },
            { o: 154.33, h: 154.49, l: 151.2, c: 151.63 },
            { o: 151.63, h: 151.76, l: 148.85, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.36, c: 149.24 },
            { o: 149.24, h: 151.56, l: 149.02, c: 151.19 },
            { o: 151.19, h: 153.75, l: 151.04, c: 153.54 },
            { o: 153.54, h: 156.62, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.47, l: 153.4, c: 153.59 },
            { o: 153.59, h: 154.04, l: 150.6, c: 151.03 },
            { o: 151.03, h: 151.35, l: 148.82, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.08, c: 149.24 },
            { o: 149.24, h: 152.32, l: 149.05, c: 152.01 },
            { o: 152.01, h: 154.26, l: 151.6, c: 154.07 },
            { o: 154.07, h: 156.46, l: 153.68, c: 156.24 },
            { o: 156.24, h: 156.46, l: 154.07, c: 154.26 },
            { o: 154.26, h: 154.37, l: 152.36, c: 152.52 },
            { o: 152.52, h: 152.64, l: 150.64, c: 150.7 },
            { o: 150.7, h: 150.76, l: 148.95, c: 149.04 },
            { o: 149.04, h: 149.19, l: 143.42, c: 143.72 },
            { o: 143.72, h: 144.03, l: 142.23, c: 142.56 },
            { o: 142.56, h: 142.8, l: 140.47, c: 140.85 },
            { o: 140.85, h: 141.16, l: 138.64, c: 138.95 },
            { o: 138.95, h: 139.28, l: 137.43, c: 137.72 }
          ],
          zones: [
            { from: 5, top: 148.54, bottom: 146.72, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 19, y: 146.23, text: "1" },
            { x: 26, y: 145.96, text: "2" },
            { x: 33, y: 145.68, text: "3" },
            { x: 41, y: 142.02, text: "Orders used up" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Wait for support to be tested two or three times before buying it.",
        answer: false,
        explain: "Seiden completely disagrees: each test weakens the level."
      },
      {
        type: "mcq",
        q: "Which revisits does the XLT buy?",
        options: ["Only the fourth", "The first or second only", "Any of them", "None"],
        answer: 1,
        explain: "Only the first or second revisit, with a desirable profit margin."
      },
      {
        type: "spot",
        q: "Click the candle where the over-tested demand finally breaks.",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 157.49, c: 157.88 },
            { o: 157.88, h: 158.17, l: 154.58, c: 154.77 },
            { o: 154.77, h: 155.03, l: 152.87, c: 153.13 },
            { o: 153.13, h: 153.34, l: 150.14, c: 150.46 },
            { o: 150.46, h: 150.76, l: 147.65, c: 148 },
            { o: 148, h: 148.38, l: 146.95, c: 147.65 },
            { o: 147.65, h: 149.04, l: 147.22, c: 148.54 },
            { o: 148.54, h: 149.02, l: 146.72, c: 147.1 },
            { o: 147.1, h: 148.73, l: 146.73, c: 148.07 },
            { o: 148.07, h: 153.59, l: 147.88, c: 153.42 },
            { o: 153.42, h: 156.62, l: 153.06, c: 156.17 },
            { o: 156.17, h: 161.44, l: 155.9, c: 161.07 },
            { o: 161.07, h: 161.68, l: 160.52, c: 161.19 },
            { o: 161.19, h: 162.03, l: 160.62, c: 161.37 },
            { o: 161.37, h: 163.84, l: 160.83, c: 163.18 },
            { o: 163.18, h: 164.08, l: 162.77, c: 163.57 },
            { o: 163.57, h: 163.77, l: 159.18, c: 159.55 },
            { o: 159.55, h: 159.83, l: 153.77, c: 154.14 },
            { o: 154.14, h: 154.27, l: 148.89, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.63, c: 149.24 },
            { o: 149.24, h: 151.31, l: 149, c: 151.13 },
            { o: 151.13, h: 153.67, l: 150.96, c: 153.4 },
            { o: 153.4, h: 156.46, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.63, l: 153.96, c: 154.33 },
            { o: 154.33, h: 154.49, l: 151.2, c: 151.63 },
            { o: 151.63, h: 151.76, l: 148.85, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.36, c: 149.24 },
            { o: 149.24, h: 151.56, l: 149.02, c: 151.19 },
            { o: 151.19, h: 153.75, l: 151.04, c: 153.54 },
            { o: 153.54, h: 156.62, l: 153.15, c: 156.24 },
            { o: 156.24, h: 156.47, l: 153.4, c: 153.59 },
            { o: 153.59, h: 154.04, l: 150.6, c: 151.03 },
            { o: 151.03, h: 151.35, l: 148.82, c: 149.04 },
            { o: 149.04, h: 149.49, l: 147.08, c: 149.24 },
            { o: 149.24, h: 152.32, l: 149.05, c: 152.01 },
            { o: 152.01, h: 154.26, l: 151.6, c: 154.07 },
            { o: 154.07, h: 156.46, l: 153.68, c: 156.24 },
            { o: 156.24, h: 156.46, l: 154.07, c: 154.26 },
            { o: 154.26, h: 154.37, l: 152.36, c: 152.52 },
            { o: 152.52, h: 152.64, l: 150.64, c: 150.7 },
            { o: 150.7, h: 150.76, l: 148.95, c: 149.04 },
            { o: 149.04, h: 149.19, l: 143.42, c: 143.72 },
            { o: 143.72, h: 144.03, l: 142.23, c: 142.56 },
            { o: 142.56, h: 142.8, l: 140.47, c: 140.85 },
            { o: 140.85, h: 141.16, l: 138.64, c: 138.95 },
            { o: 138.95, h: 139.28, l: 137.43, c: 137.72 }
          ],
          zones: [
            { from: 5, top: 148.54, bottom: 146.72, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 41, to: 41 },
        explain: "By the fourth visit the resting buy orders were used up."
      },
      {
        type: "mcq",
        q: "What is \"demand\" on the trading floor?",
        options: [
          "A news headline",
          "A stack of buy orders bigger than the sell orders",
          "A moving average",
          "A chart pattern"
        ],
        answer: 1,
        explain: "When buy orders exceed sell orders, price must rise once the last seller is filled."
      },
      {
        type: "order",
        q: "Order the process for a demand level.",
        items: [
          "Quantify supply and demand properly on the chart",
          "Count how many times price has come back",
          "Buy only the first or second revisit, with a good profit margin",
          "Skip heavily tested levels and wait for fresh demand"
        ],
        explain: "First find the real level, count the visits, then trade it only while it is still fresh."
      }
    ],
    practice: [
      {
        prompt: "Demand has been revisited once and held. Price is coming back for the second time, with plenty of room above. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.13, l: 157.45, c: 157.88 },
            { o: 157.88, h: 158.2, l: 155.2, c: 155.44 },
            { o: 155.44, h: 155.78, l: 153.05, c: 153.37 },
            { o: 153.37, h: 153.78, l: 150.18, c: 150.58 },
            { o: 150.58, h: 150.74, l: 147.61, c: 148 },
            { o: 148, h: 148.66, l: 146.4, c: 146.95 },
            { o: 146.95, h: 148.58, l: 146.44, c: 148.26 },
            { o: 148.26, h: 148.81, l: 147.6, c: 148.06 },
            { o: 148.06, h: 152.94, l: 147.86, c: 152.86 },
            { o: 152.86, h: 157.8, l: 152.75, c: 157.6 },
            { o: 157.6, h: 162.2, l: 157.54, c: 162.06 },
            { o: 162.06, h: 162.37, l: 161.42, c: 161.82 },
            { o: 161.82, h: 162.51, l: 161.52, c: 162.27 },
            { o: 162.27, h: 163.58, l: 162.06, c: 163.28 },
            { o: 163.28, h: 165.11, l: 163.06, c: 164.56 },
            { o: 164.56, h: 164.7, l: 157.82, c: 158.25 },
            { o: 158.25, h: 158.42, l: 154.53, c: 154.94 },
            { o: 154.94, h: 155.36, l: 148.61, c: 148.76 },
            { o: 148.76, h: 149.21, l: 147.33, c: 148.96 },
            { o: 148.96, h: 151.88, l: 148.62, c: 151.5 },
            { o: 151.5, h: 155.09, l: 151.09, c: 154.67 },
            { o: 154.67, h: 157.2, l: 154.45, c: 156.96 },
            { o: 156.96, h: 157.04, l: 154.91, c: 155.1 },
            { o: 155.1, h: 155.21, l: 152.53, c: 152.74 },
            { o: 152.74, h: 152.93, l: 150.92, c: 151.03 },
            { o: 151.03, h: 151.18, l: 148.64, c: 148.76 },
            { o: 148.76, h: 149.41, l: 147.24, c: 149.16 },
            { o: 149.16, h: 151.56, l: 148.82, c: 151.23 },
            { o: 151.23, h: 153.5, l: 150.96, c: 153.12 },
            { o: 153.12, h: 154.47, l: 152.75, c: 154.31 },
            { o: 154.31, h: 156.23, l: 154.06, c: 155.93 },
            { o: 155.93, h: 158.58, l: 155.73, c: 158.16 }
          ],
          zones: [
            { from: 5, top: 148.26, bottom: 146.4, kind: "demand", label: "Demand (2nd revisit)" }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Second revisit is still allowed in Seiden's rule, with a desirable profit margin. Buy at the top line, stop below. It held."
      }
    ],
    cards: [
      { front: "What does each revisit do to demand?", back: "Fills more resting buy orders, weakening it." },
      { front: "XLT rule on tested support?", back: "Do not buy if tested more than once." },
      { front: "Which revisits can you buy?", back: "The first or second." },
      { front: "Fourth visit to a level?", back: "Say \"no thanks\"." },
      { front: "Another factor for orders left?", back: "Depth of penetration into the level." }
    ],
    mnemonic: "Pantry trips: one, two, then the shelf is empty."
  },
  {
    mentor: "seiden",
    n: 108,
    eli5: {
      oneLiner: "A gap is the easiest place to spot the novice trader.",
      story: "In poker, if you cannot spot the losing player at the table, it is probably you. Markets work the same way. A gap is the picture of the ultimate supply and demand imbalance, so it shows the novice clearly. In a downtrend, after a rally, someone buying a gap up into supply has stacked every mistake together, and the next day is often a big down day.",
      analogy: "Like someone running into a store just as it closes, paying full price for the last thing on the shelf."
    },
    bigIdeas: [
      "Gap up in a downtrend = very high-odds short; gap down in an uptrend = very high-odds buy.",
      "Counter-trend gap trades only with a significant profit margin.",
      "Plan gap trades before the open, without emotion."
    ],
    steps: [
      {
        title: "A clear downtrend",
        narration: "Price is falling hard. Lower prices, lower highs: the trend is down.",
        scene: {
          candles: [
            { o: 168, h: 170.19, l: 167.87, c: 169.76 },
            { o: 169.76, h: 172.24, l: 169.44, c: 172 },
            { o: 172, h: 172.67, l: 171.44, c: 172.13 },
            { o: 172.13, h: 172.77, l: 170.9, c: 171.55 },
            { o: 171.55, h: 172.75, l: 170.92, c: 172.07 },
            { o: 172.07, h: 172.24, l: 166.36, c: 166.68 },
            { o: 166.68, h: 167.03, l: 163.78, c: 164.07 },
            { o: 164.07, h: 164.32, l: 157.54, c: 157.86 },
            { o: 157.86, h: 158.28, l: 153.89, c: 154.07 },
            { o: 154.07, h: 154.46, l: 152.19, c: 152.83 },
            { o: 152.83, h: 153.05, l: 152.34, c: 152.79 },
            { o: 152.79, h: 153.19, l: 151.76, c: 152.07 },
            { o: 152.07, h: 155.68, l: 151.92, c: 155.49 },
            { o: 155.49, h: 160, l: 155.31, c: 159.87 },
            { o: 159.87, h: 164.8, l: 159.52, c: 164.67 },
            { o: 164.67, h: 168.98, l: 164.53, c: 168.55 },
            { o: 171.92, h: 172.32, l: 170.05, c: 170.35 },
            { o: 170.35, h: 170.76, l: 167.7, c: 167.87 },
            { o: 167.87, h: 168.02, l: 163.51, c: 163.93 },
            { o: 163.93, h: 164.27, l: 161.12, c: 161.5 },
            { o: 161.5, h: 161.91, l: 157.93, c: 158.35 }
          ],
          highlight: { from: 5, to: 8, label: "downtrend" },
          reveal: 9
        }
      },
      {
        title: "Supply from the highs",
        narration: "The pause before the drop is supply. Demand is much lower, so the path of least resistance is down.",
        scene: {
          candles: [
            { o: 168, h: 170.19, l: 167.87, c: 169.76 },
            { o: 169.76, h: 172.24, l: 169.44, c: 172 },
            { o: 172, h: 172.67, l: 171.44, c: 172.13 },
            { o: 172.13, h: 172.77, l: 170.9, c: 171.55 },
            { o: 171.55, h: 172.75, l: 170.92, c: 172.07 },
            { o: 172.07, h: 172.24, l: 166.36, c: 166.68 },
            { o: 166.68, h: 167.03, l: 163.78, c: 164.07 },
            { o: 164.07, h: 164.32, l: 157.54, c: 157.86 },
            { o: 157.86, h: 158.28, l: 153.89, c: 154.07 },
            { o: 154.07, h: 154.46, l: 152.19, c: 152.83 },
            { o: 152.83, h: 153.05, l: 152.34, c: 152.79 },
            { o: 152.79, h: 153.19, l: 151.76, c: 152.07 },
            { o: 152.07, h: 155.68, l: 151.92, c: 155.49 },
            { o: 155.49, h: 160, l: 155.31, c: 159.87 },
            { o: 159.87, h: 164.8, l: 159.52, c: 164.67 },
            { o: 164.67, h: 168.98, l: 164.53, c: 168.55 },
            { o: 171.92, h: 172.32, l: 170.05, c: 170.35 },
            { o: 170.35, h: 170.76, l: 167.7, c: 167.87 },
            { o: 167.87, h: 168.02, l: 163.51, c: 163.93 },
            { o: 163.93, h: 164.27, l: 161.12, c: 161.5 },
            { o: 161.5, h: 161.91, l: 157.93, c: 158.35 }
          ],
          zones: [
            { from: 2, top: 172.77, bottom: 171.55, kind: "supply", label: "Supply" }
          ],
          reveal: 12
        }
      },
      {
        title: "Rally, then GAP up into supply",
        narration: "Price rallies and then gaps up straight into supply. The buyer is buying after a rally, into supply, against the trend, on a gap. That is the most potent novice signal.",
        scene: {
          candles: [
            { o: 168, h: 170.19, l: 167.87, c: 169.76 },
            { o: 169.76, h: 172.24, l: 169.44, c: 172 },
            { o: 172, h: 172.67, l: 171.44, c: 172.13 },
            { o: 172.13, h: 172.77, l: 170.9, c: 171.55 },
            { o: 171.55, h: 172.75, l: 170.92, c: 172.07 },
            { o: 172.07, h: 172.24, l: 166.36, c: 166.68 },
            { o: 166.68, h: 167.03, l: 163.78, c: 164.07 },
            { o: 164.07, h: 164.32, l: 157.54, c: 157.86 },
            { o: 157.86, h: 158.28, l: 153.89, c: 154.07 },
            { o: 154.07, h: 154.46, l: 152.19, c: 152.83 },
            { o: 152.83, h: 153.05, l: 152.34, c: 152.79 },
            { o: 152.79, h: 153.19, l: 151.76, c: 152.07 },
            { o: 152.07, h: 155.68, l: 151.92, c: 155.49 },
            { o: 155.49, h: 160, l: 155.31, c: 159.87 },
            { o: 159.87, h: 164.8, l: 159.52, c: 164.67 },
            { o: 164.67, h: 168.98, l: 164.53, c: 168.55 },
            { o: 171.92, h: 172.32, l: 170.05, c: 170.35 },
            { o: 170.35, h: 170.76, l: 167.7, c: 167.87 },
            { o: 167.87, h: 168.02, l: 163.51, c: 163.93 },
            { o: 163.93, h: 164.27, l: 161.12, c: 161.5 },
            { o: 161.5, h: 161.91, l: 157.93, c: 158.35 }
          ],
          zones: [
            { from: 2, top: 172.77, bottom: 171.55, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 171.55, label: "Entry (proximal)", kind: "entry" },
            { y: 173.07, label: "Stop beyond distal", kind: "sl" }
          ],
          highlight: { from: 16, to: 16, label: "GAP" },
          reveal: 17
        }
      },
      {
        title: "Big down day",
        narration: "The next candles fall hard. The goal was never certainty, only objectively stacked odds.",
        scene: {
          candles: [
            { o: 168, h: 170.19, l: 167.87, c: 169.76 },
            { o: 169.76, h: 172.24, l: 169.44, c: 172 },
            { o: 172, h: 172.67, l: 171.44, c: 172.13 },
            { o: 172.13, h: 172.77, l: 170.9, c: 171.55 },
            { o: 171.55, h: 172.75, l: 170.92, c: 172.07 },
            { o: 172.07, h: 172.24, l: 166.36, c: 166.68 },
            { o: 166.68, h: 167.03, l: 163.78, c: 164.07 },
            { o: 164.07, h: 164.32, l: 157.54, c: 157.86 },
            { o: 157.86, h: 158.28, l: 153.89, c: 154.07 },
            { o: 154.07, h: 154.46, l: 152.19, c: 152.83 },
            { o: 152.83, h: 153.05, l: 152.34, c: 152.79 },
            { o: 152.79, h: 153.19, l: 151.76, c: 152.07 },
            { o: 152.07, h: 155.68, l: 151.92, c: 155.49 },
            { o: 155.49, h: 160, l: 155.31, c: 159.87 },
            { o: 159.87, h: 164.8, l: 159.52, c: 164.67 },
            { o: 164.67, h: 168.98, l: 164.53, c: 168.55 },
            { o: 171.92, h: 172.32, l: 170.05, c: 170.35 },
            { o: 170.35, h: 170.76, l: 167.7, c: 167.87 },
            { o: 167.87, h: 168.02, l: 163.51, c: 163.93 },
            { o: 163.93, h: 164.27, l: 161.12, c: 161.5 },
            { o: 161.5, h: 161.91, l: 157.93, c: 158.35 }
          ],
          zones: [
            { from: 2, top: 172.77, bottom: 171.55, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 171.55, label: "Entry (proximal)", kind: "entry" },
            { y: 173.07, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 20, y: 156.53, text: "Big down day" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order the gap routine.",
        items: [
          "Before the open: mark supply, demand and the trend",
          "See which way price gaps and into which level",
          "Ask who is on the other side and what mistake they make",
          "Check the room to the opposing level, then trade"
        ],
        explain: "Analysis first, then the gap, then the person on the other side, then the profit margin."
      },
      {
        type: "mcq",
        q: "Gap down in an uptrend is...",
        options: ["A very high-odds buy", "A short", "Always ignored", "A breakout sell"],
        answer: 0,
        explain: "Rule 3: gap down in an uptrend = very high-odds buy."
      },
      {
        type: "spot",
        q: "Click the gap that stacks every novice mistake.",
        scene: {
          candles: [
            { o: 168, h: 170.19, l: 167.87, c: 169.76 },
            { o: 169.76, h: 172.24, l: 169.44, c: 172 },
            { o: 172, h: 172.67, l: 171.44, c: 172.13 },
            { o: 172.13, h: 172.77, l: 170.9, c: 171.55 },
            { o: 171.55, h: 172.75, l: 170.92, c: 172.07 },
            { o: 172.07, h: 172.24, l: 166.36, c: 166.68 },
            { o: 166.68, h: 167.03, l: 163.78, c: 164.07 },
            { o: 164.07, h: 164.32, l: 157.54, c: 157.86 },
            { o: 157.86, h: 158.28, l: 153.89, c: 154.07 },
            { o: 154.07, h: 154.46, l: 152.19, c: 152.83 },
            { o: 152.83, h: 153.05, l: 152.34, c: 152.79 },
            { o: 152.79, h: 153.19, l: 151.76, c: 152.07 },
            { o: 152.07, h: 155.68, l: 151.92, c: 155.49 },
            { o: 155.49, h: 160, l: 155.31, c: 159.87 },
            { o: 159.87, h: 164.8, l: 159.52, c: 164.67 },
            { o: 164.67, h: 168.98, l: 164.53, c: 168.55 },
            { o: 171.92, h: 172.32, l: 170.05, c: 170.35 },
            { o: 170.35, h: 170.76, l: 167.7, c: 167.87 },
            { o: 167.87, h: 168.02, l: 163.51, c: 163.93 },
            { o: 163.93, h: 164.27, l: 161.12, c: 161.5 },
            { o: 161.5, h: 161.91, l: 157.93, c: 158.35 }
          ],
          zones: [
            { from: 2, top: 172.77, bottom: 171.55, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 16, to: 16 },
        explain: "Rally, gap up, into supply, in a downtrend: every mistake at once."
      },
      {
        type: "tf",
        q: "If you cannot spot the losing trader in a market, it is probably you.",
        answer: true,
        explain: "Like poker: someone at the table is the novice."
      },
      {
        type: "mcq",
        q: "When is the gap analysis done?",
        options: ["During the gap, live", "Before the open", "After the close", "Never"],
        answer: 1,
        explain: "Planning before the open keeps decisions objective and free of emotion."
      }
    ],
    practice: [
      {
        prompt: "Downtrend. Price rallied and tomorrow will gap up into the supply drawn from the earlier highs. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 166, h: 168.08, l: 165.83, c: 167.78 },
            { o: 167.78, h: 170.44, l: 167.58, c: 170 },
            { o: 170, h: 171.16, l: 169.61, c: 170.72 },
            { o: 170.72, h: 171.24, l: 168.85, c: 169.41 },
            { o: 169.41, h: 170.46, l: 169.09, c: 170.06 },
            { o: 170.06, h: 170.29, l: 165.42, c: 165.55 },
            { o: 165.55, h: 165.95, l: 161.1, c: 161.47 },
            { o: 161.47, h: 161.88, l: 156.88, c: 157.22 },
            { o: 157.22, h: 157.5, l: 152.89, c: 153.06 },
            { o: 153.06, h: 153.98, l: 152.38, c: 153.35 },
            { o: 153.35, h: 153.71, l: 150.93, c: 151.56 },
            { o: 151.56, h: 152.2, l: 150.47, c: 151.06 },
            { o: 151.06, h: 154.43, l: 150.74, c: 154.19 },
            { o: 154.19, h: 159.44, l: 153.96, c: 159.08 },
            { o: 159.08, h: 163.08, l: 158.89, c: 162.82 },
            { o: 162.82, h: 166.62, l: 162.55, c: 166.41 },
            { o: 169.96, h: 170.36, l: 167.91, c: 168.21 },
            { o: 168.21, h: 168.52, l: 165.02, c: 165.38 },
            { o: 165.38, h: 165.59, l: 162.6, c: 163.04 },
            { o: 163.04, h: 163.24, l: 159.5, c: 159.75 },
            { o: 159.75, h: 159.99, l: 157, c: 157.21 }
          ],
          zones: [
            { from: 2, top: 171.24, bottom: 169.41, kind: "supply", label: "Supply" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Gap up in a downtrend into supply: very high-odds short. Sell, stop above the zone. Price fell hard."
      }
    ],
    cards: [
      { front: "Gap up in a downtrend?", back: "Very high-odds short." },
      { front: "Gap up in an uptrend?", back: "Lower-odds short; maybe a buy with a big profit margin." },
      { front: "Gap down in an uptrend?", back: "Very high-odds buy." },
      { front: "Gap down in a downtrend?", back: "Lower-odds buy; sometimes a short with a big margin." },
      { front: "Picture of the ultimate imbalance?", back: "A gap." }
    ],
    mnemonic: "Rally, Gap, Supply, Downtrend: four mistakes, one short."
  },
  {
    mentor: "seiden",
    n: 110,
    eli5: {
      oneLiner: "A rally with no stops on the way up can fall just as fast.",
      story: "At area A, candles left long upper wicks: the footprints of sellers. It was also the overnight high, for the same reason. Later, price rallied straight back up with big green candles and no pauses. Those pauses would have been demand; with none, there is empty space below. So when supply is hit, price can fall quickly through that space.",
      analogy: "Like an elevator shaft with no floors: once the cable is cut at the top, nothing stops the fall."
    },
    bigIdeas: [
      "Short at the lower (proximal) line of supply, stop just above the upper (distal) line.",
      "A rally into supply with no demand levels inside it leaves empty space: that is your profit margin.",
      "Volatility is simply the distance between demand and supply levels."
    ],
    steps: [
      {
        title: "A: wicks of sellers",
        narration: "Candles at A leave long upper wicks: price could not stay up there. Those wicks are sellers' footprints. It is also the overnight high.",
        scene: {
          candles: [
            { o: 150, h: 152.06, l: 149.78, c: 151.76 },
            { o: 151.76, h: 155.27, l: 151.46, c: 154.92 },
            { o: 154.92, h: 157.38, l: 154.56, c: 156.96 },
            { o: 156.96, h: 159.23, l: 156.65, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.08, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.78, l: 149.77, c: 150.19 },
            { o: 150.19, h: 150.63, l: 145.51, c: 145.9 },
            { o: 145.9, h: 146.29, l: 143.89, c: 144.11 },
            { o: 144.11, h: 145.02, l: 143.73, c: 144.49 },
            { o: 144.49, h: 144.74, l: 143.25, c: 143.9 },
            { o: 143.9, h: 147.49, l: 143.77, c: 147.44 },
            { o: 147.44, h: 150.81, l: 147.34, c: 150.76 },
            { o: 150.76, h: 154.63, l: 150.62, c: 154.42 },
            { o: 154.42, h: 158.42, l: 154.34, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.88, l: 153.65, c: 154.07 },
            { o: 154.07, h: 154.35, l: 150.6, c: 151.04 },
            { o: 151.04, h: 151.3, l: 148.34, c: 148.71 },
            { o: 148.71, h: 149.01, l: 144.82, c: 145.1 },
            { o: 145.1, h: 145.36, l: 141.49, c: 141.7 }
          ],
          zones: [
            { from: 4, top: 161.2, bottom: 158.6, kind: "supply", label: "A: supply (overnight high)" }
          ],
          highlight: { from: 4, to: 6, label: "upper wicks" },
          reveal: 10
        }
      },
      {
        title: "C: a rally with no bases",
        narration: "From C, big green candles race straight up with no pauses at all. No pauses means no demand levels were left behind.",
        scene: {
          candles: [
            { o: 150, h: 152.06, l: 149.78, c: 151.76 },
            { o: 151.76, h: 155.27, l: 151.46, c: 154.92 },
            { o: 154.92, h: 157.38, l: 154.56, c: 156.96 },
            { o: 156.96, h: 159.23, l: 156.65, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.08, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.78, l: 149.77, c: 150.19 },
            { o: 150.19, h: 150.63, l: 145.51, c: 145.9 },
            { o: 145.9, h: 146.29, l: 143.89, c: 144.11 },
            { o: 144.11, h: 145.02, l: 143.73, c: 144.49 },
            { o: 144.49, h: 144.74, l: 143.25, c: 143.9 },
            { o: 143.9, h: 147.49, l: 143.77, c: 147.44 },
            { o: 147.44, h: 150.81, l: 147.34, c: 150.76 },
            { o: 150.76, h: 154.63, l: 150.62, c: 154.42 },
            { o: 154.42, h: 158.42, l: 154.34, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.88, l: 153.65, c: 154.07 },
            { o: 154.07, h: 154.35, l: 150.6, c: 151.04 },
            { o: 151.04, h: 151.3, l: 148.34, c: 148.71 },
            { o: 148.71, h: 149.01, l: 144.82, c: 145.1 },
            { o: 145.1, h: 145.36, l: 141.49, c: 141.7 }
          ],
          zones: [
            { from: 4, top: 161.2, bottom: 158.6, kind: "supply", label: "A: supply (overnight high)" }
          ],
          highlight: { from: 13, to: 16, label: "no demand levels" },
          reveal: 17
        }
      },
      {
        title: "B: the first revisit",
        narration: "Buyers at B buy after buying and at supply. Sell at the lower line, buy stop just above the upper line.",
        scene: {
          candles: [
            { o: 150, h: 152.06, l: 149.78, c: 151.76 },
            { o: 151.76, h: 155.27, l: 151.46, c: 154.92 },
            { o: 154.92, h: 157.38, l: 154.56, c: 156.96 },
            { o: 156.96, h: 159.23, l: 156.65, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.08, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.78, l: 149.77, c: 150.19 },
            { o: 150.19, h: 150.63, l: 145.51, c: 145.9 },
            { o: 145.9, h: 146.29, l: 143.89, c: 144.11 },
            { o: 144.11, h: 145.02, l: 143.73, c: 144.49 },
            { o: 144.49, h: 144.74, l: 143.25, c: 143.9 },
            { o: 143.9, h: 147.49, l: 143.77, c: 147.44 },
            { o: 147.44, h: 150.81, l: 147.34, c: 150.76 },
            { o: 150.76, h: 154.63, l: 150.62, c: 154.42 },
            { o: 154.42, h: 158.42, l: 154.34, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.88, l: 153.65, c: 154.07 },
            { o: 154.07, h: 154.35, l: 150.6, c: 151.04 },
            { o: 151.04, h: 151.3, l: 148.34, c: 148.71 },
            { o: 148.71, h: 149.01, l: 144.82, c: 145.1 },
            { o: 145.1, h: 145.36, l: 141.49, c: 141.7 }
          ],
          zones: [
            { from: 4, top: 161.2, bottom: 158.6, kind: "supply", label: "A: supply (overnight high)" }
          ],
          lines: [
            { y: 158.6, label: "Entry (proximal)", kind: "entry" },
            { y: 161.5, label: "Stop beyond distal", kind: "sl" }
          ],
          reveal: 18
        }
      },
      {
        title: "Through the empty space",
        narration: "Nothing below holds price up, so it drops back through the space the rally left. That empty space was the profit margin.",
        scene: {
          candles: [
            { o: 150, h: 152.06, l: 149.78, c: 151.76 },
            { o: 151.76, h: 155.27, l: 151.46, c: 154.92 },
            { o: 154.92, h: 157.38, l: 154.56, c: 156.96 },
            { o: 156.96, h: 159.23, l: 156.65, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.08, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.78, l: 149.77, c: 150.19 },
            { o: 150.19, h: 150.63, l: 145.51, c: 145.9 },
            { o: 145.9, h: 146.29, l: 143.89, c: 144.11 },
            { o: 144.11, h: 145.02, l: 143.73, c: 144.49 },
            { o: 144.49, h: 144.74, l: 143.25, c: 143.9 },
            { o: 143.9, h: 147.49, l: 143.77, c: 147.44 },
            { o: 147.44, h: 150.81, l: 147.34, c: 150.76 },
            { o: 150.76, h: 154.63, l: 150.62, c: 154.42 },
            { o: 154.42, h: 158.42, l: 154.34, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.88, l: 153.65, c: 154.07 },
            { o: 154.07, h: 154.35, l: 150.6, c: 151.04 },
            { o: 151.04, h: 151.3, l: 148.34, c: 148.71 },
            { o: 148.71, h: 149.01, l: 144.82, c: 145.1 },
            { o: 145.1, h: 145.36, l: 141.49, c: 141.7 }
          ],
          zones: [
            { from: 4, top: 161.2, bottom: 158.6, kind: "supply", label: "A: supply (overnight high)" }
          ],
          lines: [
            { y: 158.6, label: "Entry (proximal)", kind: "entry" },
            { y: 161.5, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 22, y: 140.09, text: "Empty space = profit margin" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Why is a rally with no bases good for a short at supply?",
        options: [
          "It shows strong buyers",
          "It left no demand levels, so price can fall fast through the empty space",
          "It has more volume",
          "It never is"
        ],
        answer: 1,
        explain: "The XLT requires strong rallies into supply like this; the empty space is the profit margin."
      },
      {
        type: "spot",
        q: "Click the candles at A that left sellers' footprints.",
        scene: {
          candles: [
            { o: 150, h: 152.06, l: 149.78, c: 151.76 },
            { o: 151.76, h: 155.27, l: 151.46, c: 154.92 },
            { o: 154.92, h: 157.38, l: 154.56, c: 156.96 },
            { o: 156.96, h: 159.23, l: 156.65, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.08, l: 155.25, c: 155.55 },
            { o: 155.55, h: 155.78, l: 149.77, c: 150.19 },
            { o: 150.19, h: 150.63, l: 145.51, c: 145.9 },
            { o: 145.9, h: 146.29, l: 143.89, c: 144.11 },
            { o: 144.11, h: 145.02, l: 143.73, c: 144.49 },
            { o: 144.49, h: 144.74, l: 143.25, c: 143.9 },
            { o: 143.9, h: 147.49, l: 143.77, c: 147.44 },
            { o: 147.44, h: 150.81, l: 147.34, c: 150.76 },
            { o: 150.76, h: 154.63, l: 150.62, c: 154.42 },
            { o: 154.42, h: 158.42, l: 154.34, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.88, l: 153.65, c: 154.07 },
            { o: 154.07, h: 154.35, l: 150.6, c: 151.04 },
            { o: 151.04, h: 151.3, l: 148.34, c: 148.71 },
            { o: 148.71, h: 149.01, l: 144.82, c: 145.1 },
            { o: 145.1, h: 145.36, l: 141.49, c: 141.7 }
          ]
        },
        answer: { from: 4, to: 6 },
        explain: "The long upper wicks at A: price could not stay up there."
      },
      {
        type: "mcq",
        q: "Where does the short entry go?",
        options: [
          "At the upper line",
          "At the lower (proximal) line of supply",
          "Halfway down the rally",
          "After the drop"
        ],
        answer: 1,
        explain: "Short at the lower line; the protective buy stop sits just above the upper line."
      },
      {
        type: "tf",
        q: "Supply that lines up with the overnight high adds confluence.",
        answer: true,
        explain: "The overnight high was the high because that is where the supply was."
      },
      {
        type: "mcq",
        q: "How should a stock trader time trades?",
        options: [
          "Ignore the index",
          "Map S&P and NASDAQ levels first, then trade a handful of stocks with them",
          "Scan hundreds of stocks",
          "Only trade at lunch"
        ],
        answer: 1,
        explain: "Stocks ebb and flow with the broad market."
      }
    ],
    practice: [
      {
        prompt: "Supply with long upper wicks sits above. Price rallied straight into it with big green candles and no pauses. Pick entry, stop and target.",
        scene: {
          candles: [
            { o: 150, h: 152.68, l: 149.8, c: 152.3 },
            { o: 152.3, h: 154.58, l: 152.02, c: 154.31 },
            { o: 154.31, h: 157.3, l: 153.99, c: 156.89 },
            { o: 156.89, h: 159.31, l: 156.58, c: 159 },
            { o: 159, h: 160.9, l: 158.75, c: 159.3 },
            { o: 159.3, h: 161.2, l: 158.35, c: 158.6 },
            { o: 158.6, h: 160.3, l: 158.35, c: 158.9 },
            { o: 158.9, h: 159.13, l: 153.46, c: 153.83 },
            { o: 153.83, h: 154.27, l: 149.97, c: 150.14 },
            { o: 150.14, h: 150.26, l: 145.46, c: 145.9 },
            { o: 145.9, h: 146.6, l: 144.89, c: 145.56 },
            { o: 145.56, h: 145.94, l: 143.5, c: 143.82 },
            { o: 143.82, h: 144.52, l: 143.14, c: 143.9 },
            { o: 143.9, h: 147.57, l: 143.75, c: 147.4 },
            { o: 147.4, h: 151.56, l: 147.23, c: 151.45 },
            { o: 151.45, h: 154.67, l: 151.32, c: 154.47 },
            { o: 154.47, h: 158.37, l: 154.31, c: 158.2 },
            { o: 158.2, h: 160.16, l: 157.45, c: 157.7 },
            { o: 157.7, h: 157.9, l: 153.87, c: 154.27 },
            { o: 154.27, h: 154.43, l: 150.72, c: 151.12 },
            { o: 151.12, h: 151.45, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.94, l: 144.04, c: 144.33 },
            { o: 144.33, h: 144.63, l: 141.53, c: 141.7 }
          ],
          zones: [
            { from: 4, top: 161.2, bottom: 158.6, kind: "supply", label: "Supply" }
          ],
          reveal: 17
        },
        task: "pick-entry",
        answer: { entry: 158.6, sl: 161.5, tp: 144.4 },
        explain: "Sell at the lower line, stop just above the upper line, target the start of the rally (C). The empty space gave the profit margin."
      }
    ],
    cards: [
      { front: "Long upper wicks at a level?", back: "Footprints of sellers: supply." },
      { front: "Short entry and stop?", back: "Lower line of supply; buy stop just above the upper line." },
      { front: "Rally with no demand levels?", back: "Empty space below = profit margin." },
      { front: "Volatility is?", back: "The distance between demand and supply levels." },
      { front: "Where is the largest order imbalance?", back: "At or near the open." },
      { front: "Trap setter or prey?", back: "We set traps, we do not fall for them." }
    ],
    mnemonic: "No floors, fast fall: a rally without bases drops through empty space."
  },
  {
    mentor: "seiden",
    n: 114,
    eli5: {
      oneLiner: "Demand is where to buy; supply is where to sell. Big players leave the footprints.",
      story: "Support and resistance mean different things to different traders, but supply and demand have one meaning. Demand is a price where someone is willing and able to buy. Three quiet candles may look balanced, but buyers far outnumber sellers there. Only institutions have the buying power to launch the move away, and where smart money buys is where retail sells.",
      analogy: "Like a whale under a quiet sea: the surface looks calm, but when it moves, the wave is huge."
    },
    bigIdeas: [
      "Demand = where someone is willing and able to buy = where to buy. Supply = where to sell.",
      "A quiet base before a big move hides an imbalance, not balance.",
      "Buy the return to the base institutions left; that is where retail is selling."
    ],
    steps: [
      {
        title: "Supply: where to sell",
        narration: "Price paused, then dropped hard. That pause is supply: a price where someone was willing and able to sell a lot.",
        scene: {
          candles: [
            { o: 150, h: 152.89, l: 149.63, c: 152.54 },
            { o: 152.54, h: 155.06, l: 152.22, c: 154.81 },
            { o: 154.81, h: 158.27, l: 154.63, c: 158 },
            { o: 158, h: 158.55, l: 157.03, c: 157.53 },
            { o: 157.53, h: 158.59, l: 157.08, c: 157.96 },
            { o: 157.96, h: 158.05, l: 153.51, c: 153.68 },
            { o: 153.68, h: 153.89, l: 148.89, c: 149.07 },
            { o: 149.07, h: 149.23, l: 144.76, c: 144.96 },
            { o: 144.96, h: 145.46, l: 143.21, c: 143.89 },
            { o: 143.89, h: 146.27, l: 143.58, c: 145.93 },
            { o: 145.93, h: 146.56, l: 144.35, c: 144.9 },
            { o: 144.9, h: 148.6, l: 144.68, c: 148.5 },
            { o: 148.5, h: 152.12, l: 148.36, c: 151.9 },
            { o: 151.9, h: 154.44, l: 151.64, c: 154.1 },
            { o: 154.1, h: 157.36, l: 153.71, c: 157.03 },
            { o: 157.03, h: 158.06, l: 156.28, c: 156.53 },
            { o: 156.53, h: 156.66, l: 153.25, c: 153.33 },
            { o: 153.33, h: 153.51, l: 149.86, c: 149.96 },
            { o: 149.96, h: 150.12, l: 146.24, c: 146.43 },
            { o: 146.43, h: 147.18, l: 144.57, c: 146.93 },
            { o: 146.93, h: 150.36, l: 146.77, c: 150.23 },
            { o: 150.23, h: 152.81, l: 150.17, c: 152.67 },
            { o: 152.67, h: 156.08, l: 152.55, c: 155.99 },
            { o: 155.99, h: 159.04, l: 155.81, c: 158.93 }
          ],
          zones: [
            { from: 3, top: 158.59, bottom: 157.53, kind: "supply", label: "Supply" }
          ],
          reveal: 8
        }
      },
      {
        title: "A base that only looks balanced",
        narration: "Three quiet candles at the low look balanced. Underneath, buyers outnumber sellers by far: 3000 buyers to 200 sellers.",
        scene: {
          candles: [
            { o: 150, h: 152.89, l: 149.63, c: 152.54 },
            { o: 152.54, h: 155.06, l: 152.22, c: 154.81 },
            { o: 154.81, h: 158.27, l: 154.63, c: 158 },
            { o: 158, h: 158.55, l: 157.03, c: 157.53 },
            { o: 157.53, h: 158.59, l: 157.08, c: 157.96 },
            { o: 157.96, h: 158.05, l: 153.51, c: 153.68 },
            { o: 153.68, h: 153.89, l: 148.89, c: 149.07 },
            { o: 149.07, h: 149.23, l: 144.76, c: 144.96 },
            { o: 144.96, h: 145.46, l: 143.21, c: 143.89 },
            { o: 143.89, h: 146.27, l: 143.58, c: 145.93 },
            { o: 145.93, h: 146.56, l: 144.35, c: 144.9 },
            { o: 144.9, h: 148.6, l: 144.68, c: 148.5 },
            { o: 148.5, h: 152.12, l: 148.36, c: 151.9 },
            { o: 151.9, h: 154.44, l: 151.64, c: 154.1 },
            { o: 154.1, h: 157.36, l: 153.71, c: 157.03 },
            { o: 157.03, h: 158.06, l: 156.28, c: 156.53 },
            { o: 156.53, h: 156.66, l: 153.25, c: 153.33 },
            { o: 153.33, h: 153.51, l: 149.86, c: 149.96 },
            { o: 149.96, h: 150.12, l: 146.24, c: 146.43 },
            { o: 146.43, h: 147.18, l: 144.57, c: 146.93 },
            { o: 146.93, h: 150.36, l: 146.77, c: 150.23 },
            { o: 150.23, h: 152.81, l: 150.17, c: 152.67 },
            { o: 152.67, h: 156.08, l: 152.55, c: 155.99 },
            { o: 155.99, h: 159.04, l: 155.81, c: 158.93 }
          ],
          zones: [
            { from: 3, top: 158.59, bottom: 157.53, kind: "supply", label: "Supply" }
          ],
          notes: [
            { x: 8, y: 141.81, text: "Sellers 200 / Buyers 3000" },
            { x: 10, y: 142.95, text: "Sellers 0 / Buyers 1000" }
          ],
          highlight: { from: 8, to: 10, label: "hidden imbalance" },
          reveal: 11
        }
      },
      {
        title: "Whose demand is it?",
        narration: "The rally away needs huge buying power. Retail does not have it; institutions do. Mark the base as demand.",
        scene: {
          candles: [
            { o: 150, h: 152.89, l: 149.63, c: 152.54 },
            { o: 152.54, h: 155.06, l: 152.22, c: 154.81 },
            { o: 154.81, h: 158.27, l: 154.63, c: 158 },
            { o: 158, h: 158.55, l: 157.03, c: 157.53 },
            { o: 157.53, h: 158.59, l: 157.08, c: 157.96 },
            { o: 157.96, h: 158.05, l: 153.51, c: 153.68 },
            { o: 153.68, h: 153.89, l: 148.89, c: 149.07 },
            { o: 149.07, h: 149.23, l: 144.76, c: 144.96 },
            { o: 144.96, h: 145.46, l: 143.21, c: 143.89 },
            { o: 143.89, h: 146.27, l: 143.58, c: 145.93 },
            { o: 145.93, h: 146.56, l: 144.35, c: 144.9 },
            { o: 144.9, h: 148.6, l: 144.68, c: 148.5 },
            { o: 148.5, h: 152.12, l: 148.36, c: 151.9 },
            { o: 151.9, h: 154.44, l: 151.64, c: 154.1 },
            { o: 154.1, h: 157.36, l: 153.71, c: 157.03 },
            { o: 157.03, h: 158.06, l: 156.28, c: 156.53 },
            { o: 156.53, h: 156.66, l: 153.25, c: 153.33 },
            { o: 153.33, h: 153.51, l: 149.86, c: 149.96 },
            { o: 149.96, h: 150.12, l: 146.24, c: 146.43 },
            { o: 146.43, h: 147.18, l: 144.57, c: 146.93 },
            { o: 146.93, h: 150.36, l: 146.77, c: 150.23 },
            { o: 150.23, h: 152.81, l: 150.17, c: 152.67 },
            { o: 152.67, h: 156.08, l: 152.55, c: 155.99 },
            { o: 155.99, h: 159.04, l: 155.81, c: 158.93 }
          ],
          zones: [
            { from: 3, top: 158.59, bottom: 157.53, kind: "supply", label: "Supply" },
            { from: 8, top: 145.93, bottom: 143.21, kind: "demand", label: "Demand (institutions)" }
          ],
          notes: [
            { x: 8, y: 141.81, text: "Sellers 200 / Buyers 3000" },
            { x: 10, y: 142.95, text: "Sellers 0 / Buyers 1000" }
          ],
          reveal: 13
        }
      },
      {
        title: "Both edges respected",
        narration: "Price rallies back into supply and turns down, then drops back into demand and launches. Opportunity is at the edges, not in the middle.",
        scene: {
          candles: [
            { o: 150, h: 152.89, l: 149.63, c: 152.54 },
            { o: 152.54, h: 155.06, l: 152.22, c: 154.81 },
            { o: 154.81, h: 158.27, l: 154.63, c: 158 },
            { o: 158, h: 158.55, l: 157.03, c: 157.53 },
            { o: 157.53, h: 158.59, l: 157.08, c: 157.96 },
            { o: 157.96, h: 158.05, l: 153.51, c: 153.68 },
            { o: 153.68, h: 153.89, l: 148.89, c: 149.07 },
            { o: 149.07, h: 149.23, l: 144.76, c: 144.96 },
            { o: 144.96, h: 145.46, l: 143.21, c: 143.89 },
            { o: 143.89, h: 146.27, l: 143.58, c: 145.93 },
            { o: 145.93, h: 146.56, l: 144.35, c: 144.9 },
            { o: 144.9, h: 148.6, l: 144.68, c: 148.5 },
            { o: 148.5, h: 152.12, l: 148.36, c: 151.9 },
            { o: 151.9, h: 154.44, l: 151.64, c: 154.1 },
            { o: 154.1, h: 157.36, l: 153.71, c: 157.03 },
            { o: 157.03, h: 158.06, l: 156.28, c: 156.53 },
            { o: 156.53, h: 156.66, l: 153.25, c: 153.33 },
            { o: 153.33, h: 153.51, l: 149.86, c: 149.96 },
            { o: 149.96, h: 150.12, l: 146.24, c: 146.43 },
            { o: 146.43, h: 147.18, l: 144.57, c: 146.93 },
            { o: 146.93, h: 150.36, l: 146.77, c: 150.23 },
            { o: 150.23, h: 152.81, l: 150.17, c: 152.67 },
            { o: 152.67, h: 156.08, l: 152.55, c: 155.99 },
            { o: 155.99, h: 159.04, l: 155.81, c: 158.93 }
          ],
          zones: [
            { from: 3, top: 158.59, bottom: 157.53, kind: "supply", label: "Supply" },
            { from: 8, top: 145.93, bottom: 143.21, kind: "demand", label: "Demand (institutions)" }
          ],
          lines: [
            { y: 145.93, label: "Entry (proximal)", kind: "entry" },
            { y: 142.91, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 8, y: 141.81, text: "Sellers 200 / Buyers 3000" },
            { x: 10, y: 142.95, text: "Sellers 0 / Buyers 1000" },
            { x: 15, y: 159.46, text: "Sell at supply" },
            { x: 19, y: 143.17, text: "Buy at demand" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is demand, in Seiden's one definition?",
        options: [
          "A rising moving average",
          "A price where someone is willing and able to buy",
          "A Fibonacci level",
          "Any low"
        ],
        answer: 1,
        explain: "Demand = support = where to buy. Supply = resistance = where to sell."
      },
      {
        type: "tf",
        q: "Three small sideways candles before a big rally mean buyers and sellers were balanced.",
        answer: false,
        explain: "It looks balanced, but the equation was out of balance and needed time to play out."
      },
      {
        type: "spot",
        q: "Click the quiet base whose demand belongs to institutions.",
        scene: {
          candles: [
            { o: 150, h: 152.89, l: 149.63, c: 152.54 },
            { o: 152.54, h: 155.06, l: 152.22, c: 154.81 },
            { o: 154.81, h: 158.27, l: 154.63, c: 158 },
            { o: 158, h: 158.55, l: 157.03, c: 157.53 },
            { o: 157.53, h: 158.59, l: 157.08, c: 157.96 },
            { o: 157.96, h: 158.05, l: 153.51, c: 153.68 },
            { o: 153.68, h: 153.89, l: 148.89, c: 149.07 },
            { o: 149.07, h: 149.23, l: 144.76, c: 144.96 },
            { o: 144.96, h: 145.46, l: 143.21, c: 143.89 },
            { o: 143.89, h: 146.27, l: 143.58, c: 145.93 },
            { o: 145.93, h: 146.56, l: 144.35, c: 144.9 },
            { o: 144.9, h: 148.6, l: 144.68, c: 148.5 },
            { o: 148.5, h: 152.12, l: 148.36, c: 151.9 },
            { o: 151.9, h: 154.44, l: 151.64, c: 154.1 },
            { o: 154.1, h: 157.36, l: 153.71, c: 157.03 },
            { o: 157.03, h: 158.06, l: 156.28, c: 156.53 },
            { o: 156.53, h: 156.66, l: 153.25, c: 153.33 },
            { o: 153.33, h: 153.51, l: 149.86, c: 149.96 },
            { o: 149.96, h: 150.12, l: 146.24, c: 146.43 },
            { o: 146.43, h: 147.18, l: 144.57, c: 146.93 },
            { o: 146.93, h: 150.36, l: 146.77, c: 150.23 },
            { o: 150.23, h: 152.81, l: 150.17, c: 152.67 },
            { o: 152.67, h: 156.08, l: 152.55, c: 155.99 },
            { o: 155.99, h: 159.04, l: 155.81, c: 158.93 }
          ]
        },
        answer: { from: 8, to: 10 },
        explain: "The three quiet candles at the low before the big rally."
      },
      {
        type: "mcq",
        q: "Who can cause the big move away from a base?",
        options: ["Retail traders", "Institutions", "Brokers' software", "News writers"],
        answer: 1,
        explain: "Retail traders do not have the buying power; institutions do."
      },
      {
        type: "mcq",
        q: "Where smart money buys is where...",
        options: ["Retail buys too", "Retail sells", "Nobody trades", "Price stops"],
        answer: 1,
        explain: "Smart money profits from retail; they are on opposite sides."
      }
    ],
    practice: [
      {
        prompt: "Price drops back into the quiet base that launched a big rally earlier. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 152.74, l: 149.6, c: 152.38 },
            { o: 152.38, h: 155.15, l: 152.05, c: 155 },
            { o: 155, h: 158.35, l: 154.65, c: 158 },
            { o: 158, h: 158.35, l: 157.01, c: 157.31 },
            { o: 157.31, h: 158.47, l: 156.81, c: 158.07 },
            { o: 158.07, h: 158.15, l: 153.73, c: 153.82 },
            { o: 153.82, h: 153.92, l: 149.25, c: 149.33 },
            { o: 149.33, h: 149.47, l: 144.89, c: 145.07 },
            { o: 145.07, h: 145.41, l: 144.18, c: 144.73 },
            { o: 144.73, h: 146.81, l: 144.1, c: 146.11 },
            { o: 146.11, h: 146.66, l: 144.35, c: 145 },
            { o: 145, h: 148.37, l: 144.79, c: 148.31 },
            { o: 148.31, h: 152.2, l: 148.25, c: 152 },
            { o: 152, h: 154.82, l: 151.68, c: 154.58 },
            { o: 154.58, h: 157.16, l: 154.15, c: 156.81 },
            { o: 156.81, h: 157.89, l: 156.06, c: 156.31 },
            { o: 156.31, h: 156.45, l: 153.26, c: 153.46 },
            { o: 153.46, h: 153.57, l: 150.13, c: 150.19 },
            { o: 150.19, h: 150.33, l: 146.54, c: 146.61 },
            { o: 146.61, h: 147.36, l: 145.11, c: 147.11 },
            { o: 147.11, h: 150.49, l: 147.04, c: 150.42 },
            { o: 150.42, h: 153.4, l: 150.27, c: 153.32 },
            { o: 153.32, h: 156.32, l: 153.23, c: 156.2 },
            { o: 156.2, h: 159.31, l: 156.06, c: 159.11 }
          ],
          zones: [
            { from: 3, top: 158.47, bottom: 157.31, kind: "supply", label: "Supply" },
            { from: 8, top: 146.11, bottom: 144.1, kind: "demand", label: "Demand" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "That base is institutional demand. Buy the return where retail is selling, stop below the lower line. Price launched."
      }
    ],
    cards: [
      { front: "Demand =", back: "Where someone is willing and able to buy = where to buy." },
      { front: "Supply =", back: "Where someone is willing and able to sell = where to sell." },
      { front: "Quiet base before a big move?", back: "A hidden imbalance, not balance." },
      { front: "Who drives the move away?", back: "Institutions." },
      { front: "Need expensive software to see bank orders?", back: "No. Price action shows them." }
    ],
    mnemonic: "Calm sea, big whale: quiet bases hide big buyers."
  },
  {
    mentor: "seiden",
    n: 117,
    eli5: {
      oneLiner: "Turns happen when the novice enters. Find his two mistakes.",
      story: "On the trading floor Sam watched a desperate buyer chase price up after a long rise. An experienced trader sold to him, and minutes later the market fell. Candles on a screen show the same emotions. The novice buys after a period of buying, and buys into supply. Seiden runs three steps every time: trend, levels, profit margin.",
      analogy: "Like a kid buying the last ice cream at a fair for triple the price: the seller is delighted to take his money."
    },
    bigIdeas: [
      "Mistake 1: buying after buying (late). Mistake 2: buying into supply.",
      "Task: objective, anticipatory analysis and low-risk entries before others.",
      "Three steps: trend of average prices, where supply and demand are, profit margin."
    ],
    steps: [
      {
        title: "Step 1: the trend",
        narration: "Average prices are falling. The odds are with the sellers.",
        scene: {
          candles: [
            { o: 140, h: 141.72, l: 139.73, c: 141.37 },
            { o: 141.37, h: 144.42, l: 141.2, c: 144.01 },
            { o: 144.01, h: 145.48, l: 143.69, c: 145.14 },
            { o: 145.14, h: 147.77, l: 144.75, c: 147.48 },
            { o: 147.48, h: 149.35, l: 147.25, c: 149 },
            { o: 149, h: 150.29, l: 148.48, c: 149.7 },
            { o: 149.7, h: 150.17, l: 148.55, c: 148.91 },
            { o: 148.91, h: 149.11, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.44, l: 137.01, c: 137.17 },
            { o: 137.17, h: 137.37, l: 131.78, c: 131.91 },
            { o: 131.91, h: 132.54, l: 130.84, c: 131.07 },
            { o: 131.07, h: 131.46, l: 129.75, c: 130.41 },
            { o: 130.41, h: 131.51, l: 130.06, c: 130.91 },
            { o: 130.91, h: 135.73, l: 130.57, c: 135.43 },
            { o: 135.43, h: 135.85, l: 132.95, c: 133.47 },
            { o: 133.47, h: 134.73, l: 133.13, c: 134.38 },
            { o: 134.38, h: 142.05, l: 134.14, c: 141.6 },
            { o: 141.6, h: 142.05, l: 139.82, c: 140.31 },
            { o: 140.31, h: 143.45, l: 139.71, c: 142.85 },
            { o: 142.85, h: 146.38, l: 142.64, c: 145.73 },
            { o: 145.73, h: 147.32, l: 145.31, c: 146.91 },
            { o: 146.91, h: 149.67, l: 146.66, c: 148.01 },
            { o: 148.01, h: 148.34, l: 146.34, c: 146.64 },
            { o: 146.64, h: 146.86, l: 144.68, c: 145.06 },
            { o: 145.06, h: 145.32, l: 143.12, c: 143.46 },
            { o: 143.46, h: 143.79, l: 141.45, c: 141.82 },
            { o: 141.82, h: 142.25, l: 139.88, c: 140.01 }
          ],
          highlight: { from: 7, to: 9, label: "falling prices" },
          reveal: 10
        }
      },
      {
        title: "Step 2: the levels",
        narration: "A pivot high where price collapsed at once: that is supply. Wrap it in two lines.",
        scene: {
          candles: [
            { o: 140, h: 141.72, l: 139.73, c: 141.37 },
            { o: 141.37, h: 144.42, l: 141.2, c: 144.01 },
            { o: 144.01, h: 145.48, l: 143.69, c: 145.14 },
            { o: 145.14, h: 147.77, l: 144.75, c: 147.48 },
            { o: 147.48, h: 149.35, l: 147.25, c: 149 },
            { o: 149, h: 150.29, l: 148.48, c: 149.7 },
            { o: 149.7, h: 150.17, l: 148.55, c: 148.91 },
            { o: 148.91, h: 149.11, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.44, l: 137.01, c: 137.17 },
            { o: 137.17, h: 137.37, l: 131.78, c: 131.91 },
            { o: 131.91, h: 132.54, l: 130.84, c: 131.07 },
            { o: 131.07, h: 131.46, l: 129.75, c: 130.41 },
            { o: 130.41, h: 131.51, l: 130.06, c: 130.91 },
            { o: 130.91, h: 135.73, l: 130.57, c: 135.43 },
            { o: 135.43, h: 135.85, l: 132.95, c: 133.47 },
            { o: 133.47, h: 134.73, l: 133.13, c: 134.38 },
            { o: 134.38, h: 142.05, l: 134.14, c: 141.6 },
            { o: 141.6, h: 142.05, l: 139.82, c: 140.31 },
            { o: 140.31, h: 143.45, l: 139.71, c: 142.85 },
            { o: 142.85, h: 146.38, l: 142.64, c: 145.73 },
            { o: 145.73, h: 147.32, l: 145.31, c: 146.91 },
            { o: 146.91, h: 149.67, l: 146.66, c: 148.01 },
            { o: 148.01, h: 148.34, l: 146.34, c: 146.64 },
            { o: 146.64, h: 146.86, l: 144.68, c: 145.06 },
            { o: 145.06, h: 145.32, l: 143.12, c: 143.46 },
            { o: 143.46, h: 143.79, l: 141.45, c: 141.82 },
            { o: 141.82, h: 142.25, l: 139.88, c: 140.01 }
          ],
          zones: [
            { from: 5, top: 150.29, bottom: 148.91, kind: "supply", label: "A: pivot-high supply" }
          ],
          reveal: 10
        }
      },
      {
        title: "The novice arrives",
        narration: "After a choppy multi-day rally, candle B spikes into the zone. That buyer buys after an advance and into supply: both mistakes.",
        scene: {
          candles: [
            { o: 140, h: 141.72, l: 139.73, c: 141.37 },
            { o: 141.37, h: 144.42, l: 141.2, c: 144.01 },
            { o: 144.01, h: 145.48, l: 143.69, c: 145.14 },
            { o: 145.14, h: 147.77, l: 144.75, c: 147.48 },
            { o: 147.48, h: 149.35, l: 147.25, c: 149 },
            { o: 149, h: 150.29, l: 148.48, c: 149.7 },
            { o: 149.7, h: 150.17, l: 148.55, c: 148.91 },
            { o: 148.91, h: 149.11, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.44, l: 137.01, c: 137.17 },
            { o: 137.17, h: 137.37, l: 131.78, c: 131.91 },
            { o: 131.91, h: 132.54, l: 130.84, c: 131.07 },
            { o: 131.07, h: 131.46, l: 129.75, c: 130.41 },
            { o: 130.41, h: 131.51, l: 130.06, c: 130.91 },
            { o: 130.91, h: 135.73, l: 130.57, c: 135.43 },
            { o: 135.43, h: 135.85, l: 132.95, c: 133.47 },
            { o: 133.47, h: 134.73, l: 133.13, c: 134.38 },
            { o: 134.38, h: 142.05, l: 134.14, c: 141.6 },
            { o: 141.6, h: 142.05, l: 139.82, c: 140.31 },
            { o: 140.31, h: 143.45, l: 139.71, c: 142.85 },
            { o: 142.85, h: 146.38, l: 142.64, c: 145.73 },
            { o: 145.73, h: 147.32, l: 145.31, c: 146.91 },
            { o: 146.91, h: 149.67, l: 146.66, c: 148.01 },
            { o: 148.01, h: 148.34, l: 146.34, c: 146.64 },
            { o: 146.64, h: 146.86, l: 144.68, c: 145.06 },
            { o: 145.06, h: 145.32, l: 143.12, c: 143.46 },
            { o: 143.46, h: 143.79, l: 141.45, c: 141.82 },
            { o: 141.82, h: 142.25, l: 139.88, c: 140.01 }
          ],
          zones: [
            { from: 5, top: 150.29, bottom: 148.91, kind: "supply", label: "A: pivot-high supply" }
          ],
          highlight: { from: 21, to: 21, label: "B" },
          reveal: 22
        }
      },
      {
        title: "Step 3: the profit margin and the short",
        narration: "There is plenty of room below, back to the lows. Short on B with the stop above the zone. Price drifts lower.",
        scene: {
          candles: [
            { o: 140, h: 141.72, l: 139.73, c: 141.37 },
            { o: 141.37, h: 144.42, l: 141.2, c: 144.01 },
            { o: 144.01, h: 145.48, l: 143.69, c: 145.14 },
            { o: 145.14, h: 147.77, l: 144.75, c: 147.48 },
            { o: 147.48, h: 149.35, l: 147.25, c: 149 },
            { o: 149, h: 150.29, l: 148.48, c: 149.7 },
            { o: 149.7, h: 150.17, l: 148.55, c: 148.91 },
            { o: 148.91, h: 149.11, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.44, l: 137.01, c: 137.17 },
            { o: 137.17, h: 137.37, l: 131.78, c: 131.91 },
            { o: 131.91, h: 132.54, l: 130.84, c: 131.07 },
            { o: 131.07, h: 131.46, l: 129.75, c: 130.41 },
            { o: 130.41, h: 131.51, l: 130.06, c: 130.91 },
            { o: 130.91, h: 135.73, l: 130.57, c: 135.43 },
            { o: 135.43, h: 135.85, l: 132.95, c: 133.47 },
            { o: 133.47, h: 134.73, l: 133.13, c: 134.38 },
            { o: 134.38, h: 142.05, l: 134.14, c: 141.6 },
            { o: 141.6, h: 142.05, l: 139.82, c: 140.31 },
            { o: 140.31, h: 143.45, l: 139.71, c: 142.85 },
            { o: 142.85, h: 146.38, l: 142.64, c: 145.73 },
            { o: 145.73, h: 147.32, l: 145.31, c: 146.91 },
            { o: 146.91, h: 149.67, l: 146.66, c: 148.01 },
            { o: 148.01, h: 148.34, l: 146.34, c: 146.64 },
            { o: 146.64, h: 146.86, l: 144.68, c: 145.06 },
            { o: 145.06, h: 145.32, l: 143.12, c: 143.46 },
            { o: 143.46, h: 143.79, l: 141.45, c: 141.82 },
            { o: 141.82, h: 142.25, l: 139.88, c: 140.01 }
          ],
          zones: [
            { from: 5, top: 150.29, bottom: 148.91, kind: "supply", label: "A: pivot-high supply" }
          ],
          lines: [
            { y: 148.91, label: "Entry (proximal)", kind: "entry" },
            { y: 150.59, label: "Stop beyond distal", kind: "sl" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order Seiden's three-step analysis.",
        items: ["Trend of average prices", "Where are supply and demand?", "Is there a profit margin?"],
        explain: "Trend, levels, margin - every time."
      },
      {
        type: "spot",
        q: "Click candle B, the novice buyer.",
        scene: {
          candles: [
            { o: 140, h: 141.72, l: 139.73, c: 141.37 },
            { o: 141.37, h: 144.42, l: 141.2, c: 144.01 },
            { o: 144.01, h: 145.48, l: 143.69, c: 145.14 },
            { o: 145.14, h: 147.77, l: 144.75, c: 147.48 },
            { o: 147.48, h: 149.35, l: 147.25, c: 149 },
            { o: 149, h: 150.29, l: 148.48, c: 149.7 },
            { o: 149.7, h: 150.17, l: 148.55, c: 148.91 },
            { o: 148.91, h: 149.11, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.44, l: 137.01, c: 137.17 },
            { o: 137.17, h: 137.37, l: 131.78, c: 131.91 },
            { o: 131.91, h: 132.54, l: 130.84, c: 131.07 },
            { o: 131.07, h: 131.46, l: 129.75, c: 130.41 },
            { o: 130.41, h: 131.51, l: 130.06, c: 130.91 },
            { o: 130.91, h: 135.73, l: 130.57, c: 135.43 },
            { o: 135.43, h: 135.85, l: 132.95, c: 133.47 },
            { o: 133.47, h: 134.73, l: 133.13, c: 134.38 },
            { o: 134.38, h: 142.05, l: 134.14, c: 141.6 },
            { o: 141.6, h: 142.05, l: 139.82, c: 140.31 },
            { o: 140.31, h: 143.45, l: 139.71, c: 142.85 },
            { o: 142.85, h: 146.38, l: 142.64, c: 145.73 },
            { o: 145.73, h: 147.32, l: 145.31, c: 146.91 },
            { o: 146.91, h: 149.67, l: 146.66, c: 148.01 },
            { o: 148.01, h: 148.34, l: 146.34, c: 146.64 },
            { o: 146.64, h: 146.86, l: 144.68, c: 145.06 },
            { o: 145.06, h: 145.32, l: 143.12, c: 143.46 },
            { o: 143.46, h: 143.79, l: 141.45, c: 141.82 },
            { o: 141.82, h: 142.25, l: 139.88, c: 140.01 }
          ],
          zones: [
            { from: 5, top: 150.29, bottom: 148.91, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "B spikes into the pivot-high supply after a rally: both mistakes at once."
      },
      {
        type: "mcq",
        q: "What makes a buyer a novice in this lesson?",
        options: [
          "He uses a stop",
          "He buys after a period of buying and into supply",
          "He waits for levels",
          "He trades small"
        ],
        answer: 1,
        explain: "Those are the two novice mistakes."
      },
      {
        type: "tf",
        q: "Astute traders get interested in buying only after pretty green candles appear.",
        answer: false,
        explain: "They get interested well before green candles appear."
      },
      {
        type: "mcq",
        q: "Good news, according to Seiden, does what?",
        options: [
          "Brings price down to demand",
          "Does not bring price down to demand; bad news does",
          "Makes demand stronger",
          "Nothing"
        ],
        answer: 1,
        explain: "People buy on good news, but good news does not bring price to demand where buying is low risk."
      }
    ],
    practice: [
      {
        prompt: "A pivot-high supply sits above. After a choppy rally, price just spiked up toward it. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 141.92, l: 139.72, c: 141.74 },
            { o: 141.74, h: 144.45, l: 141.53, c: 144.02 },
            { o: 144.02, h: 145.43, l: 143.72, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.99, c: 147.35 },
            { o: 147.35, h: 149.19, l: 147.04, c: 149 },
            { o: 149, h: 150.38, l: 148.65, c: 149.94 },
            { o: 149.94, h: 150.43, l: 148.38, c: 149 },
            { o: 149, h: 149.21, l: 143.19, c: 143.34 },
            { o: 143.34, h: 143.45, l: 138.56, c: 138.7 },
            { o: 138.7, h: 138.92, l: 132.92, c: 133 },
            { o: 133, h: 133.51, l: 132.54, c: 132.91 },
            { o: 132.91, h: 133.56, l: 132.4, c: 133.32 },
            { o: 133.32, h: 133.53, l: 131.74, c: 132 },
            { o: 132, h: 133.72, l: 131.44, c: 133.34 },
            { o: 133.34, h: 134.27, l: 132.88, c: 133.62 },
            { o: 133.62, h: 136.77, l: 133.37, c: 136.49 },
            { o: 136.49, h: 140.98, l: 136, c: 140.62 },
            { o: 140.62, h: 143.02, l: 140.19, c: 142.34 },
            { o: 142.34, h: 143.63, l: 142.04, c: 143.06 },
            { o: 143.06, h: 147.24, l: 142.7, c: 147 },
            { o: 147, h: 149.79, l: 146.75, c: 148.1 },
            { o: 148.1, h: 148.33, l: 146.14, c: 146.4 },
            { o: 146.4, h: 146.63, l: 144.52, c: 144.81 },
            { o: 144.81, h: 145.19, l: 143.32, c: 143.57 },
            { o: 143.57, h: 143.76, l: 141.24, c: 141.56 },
            { o: 141.56, h: 141.77, l: 139.79, c: 140.1 }
          ],
          zones: [
            { from: 5, top: 150.43, bottom: 149, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Trend down, level = pivot-high supply, room below. The buyer is making both mistakes. Sell with the stop above the zone."
      }
    ],
    cards: [
      { front: "When do turns happen?", back: "When the novice trader has entered." },
      { front: "Two novice mistakes?", back: "Buying after buying; buying into supply." },
      { front: "Seiden's task?", back: "Objective, anticipatory analysis and low-risk entries." },
      { front: "Tools?", back: "Candles, proper trend analysis, proper supply and demand analysis." },
      { front: "Profit margin for a long?", back: "Resistance minus support at the time of entry." }
    ],
    mnemonic: "Trend, Level, Room: three checks before every trade."
  },
  {
    mentor: "seiden",
    n: 125,
    eli5: {
      oneLiner: "Place entry, stop and target together, then walk away.",
      story: "From birth we learn to buy when things look good, which in markets means buying high. Good buys come at the end of declines, with scary news. That feels terrible, so emotion gets in the way. Seiden's fix is one bracket order: buy at demand, stop below it, profit target at supply, all placed at once. When one exit fills, the other cancels, and he does not touch it.",
      analogy: "Like setting the oven timer: you put the cake in, set the timer, and go do something else instead of opening the door every minute."
    },
    bigIdeas: [
      "Mark demand below and supply above before the open.",
      "Good buys feel scary: sharp, bad-news declines into demand.",
      "OCO bracket: entry, stop and target placed at once. Set it and forget it."
    ],
    steps: [
      {
        title: "Before the open",
        narration: "Mark the demand below and the supply above.",
        scene: {
          candles: [
            { o: 160, h: 160.27, l: 157.48, c: 157.81 },
            { o: 157.81, h: 157.98, l: 155.33, c: 155.63 },
            { o: 155.63, h: 156.01, l: 152.99, c: 153.38 },
            { o: 153.38, h: 153.76, l: 150.66, c: 151.01 },
            { o: 151.01, h: 151.23, l: 148.55, c: 149 },
            { o: 149, h: 149.4, l: 147.5, c: 147.99 },
            { o: 147.99, h: 149.81, l: 147.33, c: 149.47 },
            { o: 149.47, h: 149.85, l: 148.43, c: 149.04 },
            { o: 149.04, h: 153.69, l: 148.9, c: 153.58 },
            { o: 153.58, h: 157.31, l: 153.37, c: 157.25 },
            { o: 157.25, h: 162.24, l: 157.2, c: 162.04 },
            { o: 162.04, h: 164.19, l: 161.7, c: 163.91 },
            { o: 163.91, h: 165.27, l: 163.56, c: 165.04 },
            { o: 165.04, h: 165.59, l: 164.09, c: 164.78 },
            { o: 164.78, h: 165.58, l: 164.46, c: 165.04 },
            { o: 165.04, h: 165.21, l: 162.64, c: 162.85 },
            { o: 162.85, h: 162.95, l: 160.87, c: 161.04 },
            { o: 161.04, h: 161.18, l: 157.62, c: 157.7 },
            { o: 157.7, h: 157.87, l: 153.61, c: 153.71 },
            { o: 153.71, h: 153.87, l: 149.83, c: 149.97 },
            { o: 149.97, h: 150.62, l: 148.29, c: 150.37 },
            { o: 150.37, h: 153.7, l: 150.2, c: 153.37 },
            { o: 153.37, h: 155.86, l: 153.03, c: 155.69 },
            { o: 155.69, h: 160.25, l: 155.56, c: 159.8 },
            { o: 159.8, h: 161.9, l: 159.52, c: 161.69 },
            { o: 161.69, h: 165.56, l: 161.39, c: 165.18 }
          ],
          zones: [
            { from: 5, top: 149.47, bottom: 147.33, kind: "demand", label: "Demand" },
            { from: 13, top: 165.59, bottom: 164.78, kind: "supply", label: "Supply = target" }
          ],
          reveal: 17
        }
      },
      {
        title: "One bracket order",
        narration: "Place the buy at the top of demand, the protective stop under it, and the profit limit at supply - all at once, as an OCO bracket.",
        scene: {
          candles: [
            { o: 160, h: 160.27, l: 157.48, c: 157.81 },
            { o: 157.81, h: 157.98, l: 155.33, c: 155.63 },
            { o: 155.63, h: 156.01, l: 152.99, c: 153.38 },
            { o: 153.38, h: 153.76, l: 150.66, c: 151.01 },
            { o: 151.01, h: 151.23, l: 148.55, c: 149 },
            { o: 149, h: 149.4, l: 147.5, c: 147.99 },
            { o: 147.99, h: 149.81, l: 147.33, c: 149.47 },
            { o: 149.47, h: 149.85, l: 148.43, c: 149.04 },
            { o: 149.04, h: 153.69, l: 148.9, c: 153.58 },
            { o: 153.58, h: 157.31, l: 153.37, c: 157.25 },
            { o: 157.25, h: 162.24, l: 157.2, c: 162.04 },
            { o: 162.04, h: 164.19, l: 161.7, c: 163.91 },
            { o: 163.91, h: 165.27, l: 163.56, c: 165.04 },
            { o: 165.04, h: 165.59, l: 164.09, c: 164.78 },
            { o: 164.78, h: 165.58, l: 164.46, c: 165.04 },
            { o: 165.04, h: 165.21, l: 162.64, c: 162.85 },
            { o: 162.85, h: 162.95, l: 160.87, c: 161.04 },
            { o: 161.04, h: 161.18, l: 157.62, c: 157.7 },
            { o: 157.7, h: 157.87, l: 153.61, c: 153.71 },
            { o: 153.71, h: 153.87, l: 149.83, c: 149.97 },
            { o: 149.97, h: 150.62, l: 148.29, c: 150.37 },
            { o: 150.37, h: 153.7, l: 150.2, c: 153.37 },
            { o: 153.37, h: 155.86, l: 153.03, c: 155.69 },
            { o: 155.69, h: 160.25, l: 155.56, c: 159.8 },
            { o: 159.8, h: 161.9, l: 159.52, c: 161.69 },
            { o: 161.69, h: 165.56, l: 161.39, c: 165.18 }
          ],
          zones: [
            { from: 5, top: 149.47, bottom: 147.33, kind: "demand", label: "Demand" },
            { from: 13, top: 165.59, bottom: 164.78, kind: "supply", label: "Supply = target" }
          ],
          lines: [
            { y: 149.47, label: "Entry (proximal)", kind: "entry", from: 16 },
            { y: 147.03, label: "Stop beyond distal", kind: "sl", from: 16 },
            { y: 164.78, label: "Target: opposing level", kind: "tp", from: 16 }
          ],
          reveal: 17
        }
      },
      {
        title: "The scary drop",
        narration: "Price plunges in big red candles, probably on bad news. This is exactly the high-odds buy, and your order is already waiting.",
        scene: {
          candles: [
            { o: 160, h: 160.27, l: 157.48, c: 157.81 },
            { o: 157.81, h: 157.98, l: 155.33, c: 155.63 },
            { o: 155.63, h: 156.01, l: 152.99, c: 153.38 },
            { o: 153.38, h: 153.76, l: 150.66, c: 151.01 },
            { o: 151.01, h: 151.23, l: 148.55, c: 149 },
            { o: 149, h: 149.4, l: 147.5, c: 147.99 },
            { o: 147.99, h: 149.81, l: 147.33, c: 149.47 },
            { o: 149.47, h: 149.85, l: 148.43, c: 149.04 },
            { o: 149.04, h: 153.69, l: 148.9, c: 153.58 },
            { o: 153.58, h: 157.31, l: 153.37, c: 157.25 },
            { o: 157.25, h: 162.24, l: 157.2, c: 162.04 },
            { o: 162.04, h: 164.19, l: 161.7, c: 163.91 },
            { o: 163.91, h: 165.27, l: 163.56, c: 165.04 },
            { o: 165.04, h: 165.59, l: 164.09, c: 164.78 },
            { o: 164.78, h: 165.58, l: 164.46, c: 165.04 },
            { o: 165.04, h: 165.21, l: 162.64, c: 162.85 },
            { o: 162.85, h: 162.95, l: 160.87, c: 161.04 },
            { o: 161.04, h: 161.18, l: 157.62, c: 157.7 },
            { o: 157.7, h: 157.87, l: 153.61, c: 153.71 },
            { o: 153.71, h: 153.87, l: 149.83, c: 149.97 },
            { o: 149.97, h: 150.62, l: 148.29, c: 150.37 },
            { o: 150.37, h: 153.7, l: 150.2, c: 153.37 },
            { o: 153.37, h: 155.86, l: 153.03, c: 155.69 },
            { o: 155.69, h: 160.25, l: 155.56, c: 159.8 },
            { o: 159.8, h: 161.9, l: 159.52, c: 161.69 },
            { o: 161.69, h: 165.56, l: 161.39, c: 165.18 }
          ],
          zones: [
            { from: 5, top: 149.47, bottom: 147.33, kind: "demand", label: "Demand" },
            { from: 13, top: 165.59, bottom: 164.78, kind: "supply", label: "Supply = target" }
          ],
          lines: [
            { y: 149.47, label: "Entry (proximal)", kind: "entry", from: 16 },
            { y: 147.03, label: "Stop beyond distal", kind: "sl", from: 16 },
            { y: 164.78, label: "Target: opposing level", kind: "tp", from: 16 }
          ],
          highlight: { from: 17, to: 19, label: "scary, but correct" },
          reveal: 20
        }
      },
      {
        title: "Hands off",
        narration: "The buy fills, price rallies and the limit at supply fills. The stop order cancels automatically. No screen-watching needed.",
        scene: {
          candles: [
            { o: 160, h: 160.27, l: 157.48, c: 157.81 },
            { o: 157.81, h: 157.98, l: 155.33, c: 155.63 },
            { o: 155.63, h: 156.01, l: 152.99, c: 153.38 },
            { o: 153.38, h: 153.76, l: 150.66, c: 151.01 },
            { o: 151.01, h: 151.23, l: 148.55, c: 149 },
            { o: 149, h: 149.4, l: 147.5, c: 147.99 },
            { o: 147.99, h: 149.81, l: 147.33, c: 149.47 },
            { o: 149.47, h: 149.85, l: 148.43, c: 149.04 },
            { o: 149.04, h: 153.69, l: 148.9, c: 153.58 },
            { o: 153.58, h: 157.31, l: 153.37, c: 157.25 },
            { o: 157.25, h: 162.24, l: 157.2, c: 162.04 },
            { o: 162.04, h: 164.19, l: 161.7, c: 163.91 },
            { o: 163.91, h: 165.27, l: 163.56, c: 165.04 },
            { o: 165.04, h: 165.59, l: 164.09, c: 164.78 },
            { o: 164.78, h: 165.58, l: 164.46, c: 165.04 },
            { o: 165.04, h: 165.21, l: 162.64, c: 162.85 },
            { o: 162.85, h: 162.95, l: 160.87, c: 161.04 },
            { o: 161.04, h: 161.18, l: 157.62, c: 157.7 },
            { o: 157.7, h: 157.87, l: 153.61, c: 153.71 },
            { o: 153.71, h: 153.87, l: 149.83, c: 149.97 },
            { o: 149.97, h: 150.62, l: 148.29, c: 150.37 },
            { o: 150.37, h: 153.7, l: 150.2, c: 153.37 },
            { o: 153.37, h: 155.86, l: 153.03, c: 155.69 },
            { o: 155.69, h: 160.25, l: 155.56, c: 159.8 },
            { o: 159.8, h: 161.9, l: 159.52, c: 161.69 },
            { o: 161.69, h: 165.56, l: 161.39, c: 165.18 }
          ],
          zones: [
            { from: 5, top: 149.47, bottom: 147.33, kind: "demand", label: "Demand" },
            { from: 13, top: 165.59, bottom: 164.78, kind: "supply", label: "Supply = target" }
          ],
          lines: [
            { y: 149.47, label: "Entry (proximal)", kind: "entry", from: 16 },
            { y: 147.03, label: "Stop beyond distal", kind: "sl", from: 16 },
            { y: 164.78, label: "Target: opposing level", kind: "tp", from: 16 }
          ],
          notes: [
            { x: 20, y: 146.89, text: "Buy filled" },
            { x: 25, y: 166.96, text: "Target filled, stop cancelled" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What does OCO mean?",
        options: ["Order closes overnight", "Order cancels order", "One contract only", "Open close open"],
        answer: 1,
        explain: "When the stop or the target fills, the other is cancelled automatically."
      },
      {
        type: "tf",
        q: "Buying when trend, indicators and news all look good is the safest buy.",
        answer: false,
        explain: "If everything looks good, price is probably high. Good buys come at the end of declines."
      },
      {
        type: "spot",
        q: "Click the scary decline that is actually the high-odds buy.",
        scene: {
          candles: [
            { o: 160, h: 160.27, l: 157.48, c: 157.81 },
            { o: 157.81, h: 157.98, l: 155.33, c: 155.63 },
            { o: 155.63, h: 156.01, l: 152.99, c: 153.38 },
            { o: 153.38, h: 153.76, l: 150.66, c: 151.01 },
            { o: 151.01, h: 151.23, l: 148.55, c: 149 },
            { o: 149, h: 149.4, l: 147.5, c: 147.99 },
            { o: 147.99, h: 149.81, l: 147.33, c: 149.47 },
            { o: 149.47, h: 149.85, l: 148.43, c: 149.04 },
            { o: 149.04, h: 153.69, l: 148.9, c: 153.58 },
            { o: 153.58, h: 157.31, l: 153.37, c: 157.25 },
            { o: 157.25, h: 162.24, l: 157.2, c: 162.04 },
            { o: 162.04, h: 164.19, l: 161.7, c: 163.91 },
            { o: 163.91, h: 165.27, l: 163.56, c: 165.04 },
            { o: 165.04, h: 165.59, l: 164.09, c: 164.78 },
            { o: 164.78, h: 165.58, l: 164.46, c: 165.04 },
            { o: 165.04, h: 165.21, l: 162.64, c: 162.85 },
            { o: 162.85, h: 162.95, l: 160.87, c: 161.04 },
            { o: 161.04, h: 161.18, l: 157.62, c: 157.7 },
            { o: 157.7, h: 157.87, l: 153.61, c: 153.71 },
            { o: 153.71, h: 153.87, l: 149.83, c: 149.97 },
            { o: 149.97, h: 150.62, l: 148.29, c: 150.37 },
            { o: 150.37, h: 153.7, l: 150.2, c: 153.37 },
            { o: 153.37, h: 155.86, l: 153.03, c: 155.69 },
            { o: 155.69, h: 160.25, l: 155.56, c: 159.8 },
            { o: 159.8, h: 161.9, l: 159.52, c: 161.69 },
            { o: 161.69, h: 165.56, l: 161.39, c: 165.18 }
          ],
          zones: [
            { from: 5, top: 149.47, bottom: 147.33, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 17, to: 19 },
        explain: "The sharp, big-red-candle drop into pre-drawn demand."
      },
      {
        type: "mcq",
        q: "Why does Seiden use bracket orders?",
        options: [
          "He has no emotions",
          "His brain is flawed for trading, so the platform keeps emotion out",
          "They are cheaper",
          "To trade more often"
        ],
        answer: 1,
        explain: "He does not claim to be emotion-free; he lets the order platform handle it."
      },
      {
        type: "mcq",
        q: "Roughly why do most traders fail, per Seiden?",
        options: [
          "Bad luck",
          "80% wrong education, and 80% of the rest poor discipline",
          "Slow internet",
          "Too few indicators"
        ],
        answer: 1,
        explain: "Two requirements: correct understanding with rules, and the discipline to follow them."
      }
    ],
    practice: [
      {
        prompt: "Demand below, supply above, both marked before the open. Set your OCO bracket: entry, stop and target.",
        scene: {
          candles: [
            { o: 158, h: 158.35, l: 155.15, c: 155.42 },
            { o: 155.42, h: 155.54, l: 153.45, c: 153.68 },
            { o: 153.68, h: 153.84, l: 151, c: 151.4 },
            { o: 151.4, h: 151.56, l: 148.72, c: 149.15 },
            { o: 149.15, h: 149.3, l: 146.7, c: 147 },
            { o: 147, h: 147.52, l: 145.62, c: 146.04 },
            { o: 146.04, h: 147.65, l: 145.42, c: 147.29 },
            { o: 147.29, h: 147.76, l: 146.33, c: 146.99 },
            { o: 146.99, h: 150.84, l: 146.87, c: 150.68 },
            { o: 150.68, h: 155.42, l: 150.52, c: 155.32 },
            { o: 155.32, h: 159.12, l: 155.23, c: 158.99 },
            { o: 158.99, h: 160.61, l: 158.76, c: 160.39 },
            { o: 160.39, h: 162.13, l: 160.07, c: 161.99 },
            { o: 161.99, h: 162.67, l: 161.48, c: 161.81 },
            { o: 161.81, h: 162.47, l: 161.19, c: 162.06 },
            { o: 162.06, h: 162.2, l: 160.05, c: 160.17 },
            { o: 160.17, h: 160.31, l: 157.96, c: 158.06 },
            { o: 158.06, h: 158.27, l: 154.56, c: 154.62 },
            { o: 154.62, h: 154.78, l: 151.54, c: 151.61 },
            { o: 151.61, h: 151.82, l: 147.58, c: 147.79 },
            { o: 147.79, h: 148.44, l: 146.26, c: 148.19 },
            { o: 148.19, h: 151.54, l: 148.05, c: 151.1 },
            { o: 151.1, h: 153.62, l: 150.68, c: 153.35 },
            { o: 153.35, h: 156.81, l: 153.02, c: 156.61 },
            { o: 156.61, h: 160.1, l: 156.37, c: 159.66 },
            { o: 159.66, h: 162.61, l: 159.39, c: 162.21 }
          ],
          zones: [
            { from: 5, top: 147.29, bottom: 145.42, kind: "demand", label: "Demand" },
            { from: 13, top: 162.67, bottom: 161.81, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { entry: 147.29, sl: 145.12, tp: 161.81 },
        explain: "Buy limit at the top of demand, stop just below it, profit limit at the bottom of supply. Placed together, then hands off."
      }
    ],
    cards: [
      { front: "When are levels marked?", back: "Before the open." },
      { front: "OCO?", back: "Order cancels order: one exit filling cancels the other." },
      { front: "Three parts of the bracket?", back: "Entry at demand, stop below, profit limit at supply." },
      { front: "How do good buys feel?", back: "Scary: sharp declines and bad news into demand." },
      { front: "Works for which trade lengths?", back: "Day, swing and position trades." }
    ],
    mnemonic: "Set the timer, leave the oven: one bracket, no peeking."
  },
  {
    mentor: "seiden",
    n: 130,
    eli5: {
      oneLiner: "Set traps like the pros; do not be the prey.",
      story: "Scam letters promise prizes and infomercials sell \"money machines\" - they hide risk inside a shiny opportunity. Markets do the same. Most traders see an obvious line through two lows and buy there. When it breaks, they panic and sell, straight into the real demand zone just below. The trap-setter waits in that zone with a tight stop and buys their panic.",
      analogy: "Like cheese on a mousetrap: the obvious line is the cheese, and the real demand underneath is the trap."
    },
    bigIdeas: [
      "The real level is the origin of the explosive move, not the obvious line above it.",
      "The obvious pivot line is bait: its break sends novices selling into real demand.",
      "Pre-place orders close to the stop; scale out at opposing levels."
    ],
    steps: [
      {
        title: "The real demand",
        narration: "Price exploded up from a small base. That base is the real demand zone: two lines, carried forward.",
        scene: {
          candles: [
            { o: 152, h: 152.19, l: 149.66, c: 149.99 },
            { o: 149.99, h: 150.29, l: 147.64, c: 147.92 },
            { o: 147.92, h: 148.13, l: 144.46, c: 144.85 },
            { o: 144.85, h: 145.11, l: 142.79, c: 143 },
            { o: 143, h: 143.51, l: 142.08, c: 142.67 },
            { o: 142.67, h: 144.34, l: 141.97, c: 143.77 },
            { o: 143.77, h: 144.24, l: 142.42, c: 142.99 },
            { o: 142.99, h: 148.37, l: 142.81, c: 148.29 },
            { o: 148.29, h: 154.11, l: 148.09, c: 153.99 },
            { o: 153.99, h: 154.41, l: 150.17, c: 150.4 },
            { o: 150.4, h: 150.56, l: 146.04, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 150, l: 147.38, c: 149.62 },
            { o: 149.62, h: 151.85, l: 149.38, c: 151.57 },
            { o: 151.57, h: 151.73, l: 148.4, c: 148.53 },
            { o: 148.53, h: 148.71, l: 145.97, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 149.95, l: 147.3, c: 149.51 },
            { o: 149.51, h: 152.25, l: 149.2, c: 151.98 },
            { o: 151.98, h: 154.01, l: 151.75, c: 153.57 },
            { o: 153.57, h: 153.89, l: 150.4, c: 150.84 },
            { o: 150.84, h: 151.15, l: 148.15, c: 148.47 },
            { o: 148.47, h: 148.68, l: 146.13, c: 146.57 },
            { o: 146.57, h: 146.69, l: 144.22, c: 144.27 },
            { o: 144.27, h: 145.02, l: 142.87, c: 144.77 },
            { o: 144.77, h: 147.13, l: 144.36, c: 146.72 },
            { o: 146.72, h: 149.43, l: 146.59, c: 149.29 },
            { o: 149.29, h: 152.13, l: 149.13, c: 151.99 },
            { o: 151.99, h: 155.19, l: 151.57, c: 154.79 },
            { o: 154.79, h: 157.16, l: 154.39, c: 156.77 }
          ],
          zones: [
            { from: 4, top: 143.77, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          reveal: 9
        }
      },
      {
        title: "The bait",
        narration: "Later, two pivot lows form a neat line just above the zone. Most traders call that line support.",
        scene: {
          candles: [
            { o: 152, h: 152.19, l: 149.66, c: 149.99 },
            { o: 149.99, h: 150.29, l: 147.64, c: 147.92 },
            { o: 147.92, h: 148.13, l: 144.46, c: 144.85 },
            { o: 144.85, h: 145.11, l: 142.79, c: 143 },
            { o: 143, h: 143.51, l: 142.08, c: 142.67 },
            { o: 142.67, h: 144.34, l: 141.97, c: 143.77 },
            { o: 143.77, h: 144.24, l: 142.42, c: 142.99 },
            { o: 142.99, h: 148.37, l: 142.81, c: 148.29 },
            { o: 148.29, h: 154.11, l: 148.09, c: 153.99 },
            { o: 153.99, h: 154.41, l: 150.17, c: 150.4 },
            { o: 150.4, h: 150.56, l: 146.04, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 150, l: 147.38, c: 149.62 },
            { o: 149.62, h: 151.85, l: 149.38, c: 151.57 },
            { o: 151.57, h: 151.73, l: 148.4, c: 148.53 },
            { o: 148.53, h: 148.71, l: 145.97, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 149.95, l: 147.3, c: 149.51 },
            { o: 149.51, h: 152.25, l: 149.2, c: 151.98 },
            { o: 151.98, h: 154.01, l: 151.75, c: 153.57 },
            { o: 153.57, h: 153.89, l: 150.4, c: 150.84 },
            { o: 150.84, h: 151.15, l: 148.15, c: 148.47 },
            { o: 148.47, h: 148.68, l: 146.13, c: 146.57 },
            { o: 146.57, h: 146.69, l: 144.22, c: 144.27 },
            { o: 144.27, h: 145.02, l: 142.87, c: 144.77 },
            { o: 144.77, h: 147.13, l: 144.36, c: 146.72 },
            { o: 146.72, h: 149.43, l: 146.59, c: 149.29 },
            { o: 149.29, h: 152.13, l: 149.13, c: 151.99 },
            { o: 151.99, h: 155.19, l: 151.57, c: 154.79 },
            { o: 154.79, h: 157.16, l: 154.39, c: 156.77 }
          ],
          zones: [
            { from: 4, top: 143.77, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          lines: [
            { y: 145.97, label: "The bait: obvious line", kind: "level" }
          ],
          notes: [
            { x: 11, y: 144.57, text: "pivot" },
            { x: 16, y: 144.57, text: "pivot" }
          ],
          reveal: 20
        }
      },
      {
        title: "The novice falls for it",
        narration: "Price drops to the line, people buy, then it breaks and they panic-sell - right into the real demand.",
        scene: {
          candles: [
            { o: 152, h: 152.19, l: 149.66, c: 149.99 },
            { o: 149.99, h: 150.29, l: 147.64, c: 147.92 },
            { o: 147.92, h: 148.13, l: 144.46, c: 144.85 },
            { o: 144.85, h: 145.11, l: 142.79, c: 143 },
            { o: 143, h: 143.51, l: 142.08, c: 142.67 },
            { o: 142.67, h: 144.34, l: 141.97, c: 143.77 },
            { o: 143.77, h: 144.24, l: 142.42, c: 142.99 },
            { o: 142.99, h: 148.37, l: 142.81, c: 148.29 },
            { o: 148.29, h: 154.11, l: 148.09, c: 153.99 },
            { o: 153.99, h: 154.41, l: 150.17, c: 150.4 },
            { o: 150.4, h: 150.56, l: 146.04, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 150, l: 147.38, c: 149.62 },
            { o: 149.62, h: 151.85, l: 149.38, c: 151.57 },
            { o: 151.57, h: 151.73, l: 148.4, c: 148.53 },
            { o: 148.53, h: 148.71, l: 145.97, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 149.95, l: 147.3, c: 149.51 },
            { o: 149.51, h: 152.25, l: 149.2, c: 151.98 },
            { o: 151.98, h: 154.01, l: 151.75, c: 153.57 },
            { o: 153.57, h: 153.89, l: 150.4, c: 150.84 },
            { o: 150.84, h: 151.15, l: 148.15, c: 148.47 },
            { o: 148.47, h: 148.68, l: 146.13, c: 146.57 },
            { o: 146.57, h: 146.69, l: 144.22, c: 144.27 },
            { o: 144.27, h: 145.02, l: 142.87, c: 144.77 },
            { o: 144.77, h: 147.13, l: 144.36, c: 146.72 },
            { o: 146.72, h: 149.43, l: 146.59, c: 149.29 },
            { o: 149.29, h: 152.13, l: 149.13, c: 151.99 },
            { o: 151.99, h: 155.19, l: 151.57, c: 154.79 },
            { o: 154.79, h: 157.16, l: 154.39, c: 156.77 }
          ],
          zones: [
            { from: 4, top: 143.77, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          lines: [
            { y: 145.97, label: "The bait: obvious line", kind: "level" }
          ],
          notes: [
            { x: 11, y: 144.57, text: "pivot" },
            { x: 16, y: 144.57, text: "pivot" }
          ],
          highlight: { from: 23, to: 23, label: "bait breaks" },
          reveal: 24
        }
      },
      {
        title: "Spring the trap",
        narration: "Buy in the zone with a tight stop below. Price reverses fast; take profits at several levels above.",
        scene: {
          candles: [
            { o: 152, h: 152.19, l: 149.66, c: 149.99 },
            { o: 149.99, h: 150.29, l: 147.64, c: 147.92 },
            { o: 147.92, h: 148.13, l: 144.46, c: 144.85 },
            { o: 144.85, h: 145.11, l: 142.79, c: 143 },
            { o: 143, h: 143.51, l: 142.08, c: 142.67 },
            { o: 142.67, h: 144.34, l: 141.97, c: 143.77 },
            { o: 143.77, h: 144.24, l: 142.42, c: 142.99 },
            { o: 142.99, h: 148.37, l: 142.81, c: 148.29 },
            { o: 148.29, h: 154.11, l: 148.09, c: 153.99 },
            { o: 153.99, h: 154.41, l: 150.17, c: 150.4 },
            { o: 150.4, h: 150.56, l: 146.04, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 150, l: 147.38, c: 149.62 },
            { o: 149.62, h: 151.85, l: 149.38, c: 151.57 },
            { o: 151.57, h: 151.73, l: 148.4, c: 148.53 },
            { o: 148.53, h: 148.71, l: 145.97, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 149.95, l: 147.3, c: 149.51 },
            { o: 149.51, h: 152.25, l: 149.2, c: 151.98 },
            { o: 151.98, h: 154.01, l: 151.75, c: 153.57 },
            { o: 153.57, h: 153.89, l: 150.4, c: 150.84 },
            { o: 150.84, h: 151.15, l: 148.15, c: 148.47 },
            { o: 148.47, h: 148.68, l: 146.13, c: 146.57 },
            { o: 146.57, h: 146.69, l: 144.22, c: 144.27 },
            { o: 144.27, h: 145.02, l: 142.87, c: 144.77 },
            { o: 144.77, h: 147.13, l: 144.36, c: 146.72 },
            { o: 146.72, h: 149.43, l: 146.59, c: 149.29 },
            { o: 149.29, h: 152.13, l: 149.13, c: 151.99 },
            { o: 151.99, h: 155.19, l: 151.57, c: 154.79 },
            { o: 154.79, h: 157.16, l: 154.39, c: 156.77 }
          ],
          zones: [
            { from: 4, top: 143.77, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          lines: [
            { y: 145.97, label: "The bait: obvious line", kind: "level" },
            { y: 143.77, label: "Entry (proximal)", kind: "entry" },
            { y: 141.67, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 11, y: 144.57, text: "pivot" },
            { x: 16, y: 144.57, text: "pivot" },
            { x: 24, y: 141.47, text: "Trap-setter buys" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In this lesson, what is \"the bait\"?",
        options: [
          "The real demand zone",
          "An obvious line through two pivot lows just above real demand",
          "A news item",
          "A moving average"
        ],
        answer: 1,
        explain: "Novices buy the line, then sell its break into the real zone."
      },
      {
        type: "spot",
        q: "Click the candle where the bait line breaks.",
        scene: {
          candles: [
            { o: 152, h: 152.19, l: 149.66, c: 149.99 },
            { o: 149.99, h: 150.29, l: 147.64, c: 147.92 },
            { o: 147.92, h: 148.13, l: 144.46, c: 144.85 },
            { o: 144.85, h: 145.11, l: 142.79, c: 143 },
            { o: 143, h: 143.51, l: 142.08, c: 142.67 },
            { o: 142.67, h: 144.34, l: 141.97, c: 143.77 },
            { o: 143.77, h: 144.24, l: 142.42, c: 142.99 },
            { o: 142.99, h: 148.37, l: 142.81, c: 148.29 },
            { o: 148.29, h: 154.11, l: 148.09, c: 153.99 },
            { o: 153.99, h: 154.41, l: 150.17, c: 150.4 },
            { o: 150.4, h: 150.56, l: 146.04, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 150, l: 147.38, c: 149.62 },
            { o: 149.62, h: 151.85, l: 149.38, c: 151.57 },
            { o: 151.57, h: 151.73, l: 148.4, c: 148.53 },
            { o: 148.53, h: 148.71, l: 145.97, c: 146.37 },
            { o: 146.37, h: 147.87, l: 145.97, c: 147.57 },
            { o: 147.57, h: 149.95, l: 147.3, c: 149.51 },
            { o: 149.51, h: 152.25, l: 149.2, c: 151.98 },
            { o: 151.98, h: 154.01, l: 151.75, c: 153.57 },
            { o: 153.57, h: 153.89, l: 150.4, c: 150.84 },
            { o: 150.84, h: 151.15, l: 148.15, c: 148.47 },
            { o: 148.47, h: 148.68, l: 146.13, c: 146.57 },
            { o: 146.57, h: 146.69, l: 144.22, c: 144.27 },
            { o: 144.27, h: 145.02, l: 142.87, c: 144.77 },
            { o: 144.77, h: 147.13, l: 144.36, c: 146.72 },
            { o: 146.72, h: 149.43, l: 146.59, c: 149.29 },
            { o: 149.29, h: 152.13, l: 149.13, c: 151.99 },
            { o: 151.99, h: 155.19, l: 151.57, c: 154.79 },
            { o: 154.79, h: 157.16, l: 154.39, c: 156.77 }
          ],
          zones: [
            { from: 4, top: 143.77, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          lines: [
            { y: 145.97, label: "Bait line", kind: "level" }
          ]
        },
        answer: { from: 23, to: 23 },
        explain: "The breakdown sellers sell straight into real demand."
      },
      {
        type: "tf",
        q: "A student short at 914 risked 3 points to make 19 by pre-placing the order at supply.",
        answer: true,
        explain: "Short 914, stop 917, target 895: small risk, large reward, order placed in advance."
      },
      {
        type: "mcq",
        q: "If you cannot see the trap clearly on a chart...",
        options: ["It is not there", "You are probably the prey", "Trade bigger", "Use an indicator"],
        answer: 1,
        explain: "Seiden: if you cannot recognise the trap, chances are you are still the prey."
      },
      {
        type: "mcq",
        q: "Why enter close to the protective stop?",
        options: [
          "It feels safe",
          "Turning points let you limit risk properly",
          "Brokers require it",
          "It guarantees a win"
        ],
        answer: 1,
        explain: "A tight stop at the turn keeps risk small (2-3 S&P points in the examples)."
      }
    ],
    practice: [
      {
        prompt: "An obvious line through two pivot lows just broke, and price dropped into the real demand zone below it. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 152, h: 152.4, l: 148.97, c: 149.31 },
            { o: 149.31, h: 149.58, l: 147.13, c: 147.54 },
            { o: 147.54, h: 147.69, l: 145.3, c: 145.56 },
            { o: 145.56, h: 145.69, l: 142.57, c: 143 },
            { o: 143, h: 143.4, l: 141.97, c: 142.61 },
            { o: 142.61, h: 144.21, l: 142.11, c: 143.61 },
            { o: 143.61, h: 143.92, l: 142.57, c: 143.06 },
            { o: 143.06, h: 148.45, l: 143, c: 148.31 },
            { o: 148.31, h: 154.12, l: 148.16, c: 154.06 },
            { o: 154.06, h: 154.48, l: 150.44, c: 150.68 },
            { o: 150.68, h: 151.1, l: 145.89, c: 146.21 },
            { o: 146.21, h: 147.71, l: 145.81, c: 147.41 },
            { o: 147.41, h: 149.63, l: 147.18, c: 149.22 },
            { o: 149.22, h: 151.54, l: 148.82, c: 151.41 },
            { o: 151.41, h: 151.71, l: 149.1, c: 149.35 },
            { o: 149.35, h: 149.58, l: 145.97, c: 146.21 },
            { o: 146.21, h: 147.71, l: 145.81, c: 147.41 },
            { o: 147.41, h: 149.63, l: 146.98, c: 149.23 },
            { o: 149.23, h: 152.13, l: 149.03, c: 151.85 },
            { o: 151.85, h: 153.76, l: 151.61, c: 153.41 },
            { o: 153.41, h: 153.53, l: 150.54, c: 150.77 },
            { o: 150.77, h: 151.19, l: 148.56, c: 148.77 },
            { o: 148.77, h: 149.02, l: 146.27, c: 146.41 },
            { o: 146.41, h: 146.5, l: 143.9, c: 144.11 },
            { o: 144.11, h: 144.86, l: 142.79, c: 144.61 },
            { o: 144.61, h: 147.68, l: 144.38, c: 147.42 },
            { o: 147.42, h: 149.53, l: 147.02, c: 149.23 },
            { o: 149.23, h: 152.38, l: 148.94, c: 151.96 },
            { o: 151.96, h: 154.83, l: 151.55, c: 154.68 },
            { o: 154.68, h: 157.03, l: 154.53, c: 156.61 }
          ],
          zones: [
            { from: 4, top: 143.61, bottom: 141.97, kind: "demand", label: "Real demand" }
          ],
          lines: [
            { y: 145.81, label: "Bait line", kind: "level" }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "The breakdown sellers sold into real demand. Buy in the zone with a tight stop below. Price reversed fast."
      },
      {
        prompt: "Mirror image: an obvious line through two pivot highs sits just under real supply, and price just broke above it into the zone. Pick entry, stop and target.",
        scene: {
          candles: [
            { o: 148, h: 150.73, l: 147.58, c: 150.58 },
            { o: 150.58, h: 152.88, l: 150.27, c: 152.7 },
            { o: 152.7, h: 155.2, l: 152.3, c: 154.94 },
            { o: 154.94, h: 157.2, l: 154.74, c: 157 },
            { o: 157, h: 158.15, l: 156.3, c: 157.75 },
            { o: 157.75, h: 158.25, l: 156.08, c: 156.57 },
            { o: 156.57, h: 157.23, l: 155.9, c: 156.93 },
            { o: 156.93, h: 157.12, l: 151.43, c: 151.54 },
            { o: 151.54, h: 151.64, l: 145.77, c: 145.93 },
            { o: 145.93, h: 150.67, l: 145.73, c: 150.32 },
            { o: 150.32, h: 154.2, l: 150.04, c: 153.97 },
            { o: 153.97, h: 154.37, l: 152.47, c: 152.77 },
            { o: 152.77, h: 152.95, l: 150.7, c: 150.95 },
            { o: 150.95, h: 151.2, l: 148.53, c: 148.77 },
            { o: 148.77, h: 152.41, l: 148.54, c: 151.98 },
            { o: 151.98, h: 154.28, l: 151.66, c: 153.97 },
            { o: 153.97, h: 154.37, l: 152.47, c: 152.77 },
            { o: 152.77, h: 153.06, l: 150.88, c: 151.04 },
            { o: 151.04, h: 151.38, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.07, l: 146.33, c: 146.77 },
            { o: 146.77, h: 149.28, l: 146.39, c: 148.87 },
            { o: 148.87, h: 152, l: 148.59, c: 151.81 },
            { o: 151.81, h: 154, l: 151.55, c: 153.77 },
            { o: 153.77, h: 156.2, l: 153.7, c: 156.07 },
            { o: 156.07, h: 157.41, l: 155.32, c: 155.57 },
            { o: 155.57, h: 155.75, l: 152.52, c: 152.97 },
            { o: 152.97, h: 153.3, l: 150.48, c: 150.7 },
            { o: 150.7, h: 150.97, l: 148.19, c: 148.54 },
            { o: 148.54, h: 148.86, l: 145.52, c: 145.77 },
            { o: 145.77, h: 146.2, l: 143.13, c: 143.57 }
          ],
          zones: [
            { from: 4, top: 158.25, bottom: 156.57, kind: "supply", label: "Real supply" }
          ],
          lines: [
            { y: 154.37, label: "Bait line", kind: "level" }
          ],
          reveal: 24
        },
        task: "pick-entry",
        answer: { entry: 156.57, sl: 158.55, tp: 156.37 },
        explain: "Breakout buyers bought into real supply. Sell at the bottom line of the zone, stop just above it, first target below the bait line."
      }
    ],
    cards: [
      {
        front: "Real level vs obvious line?",
        back: "Real = origin of the explosive move; obvious line = bait above it."
      },
      { front: "What happens when the bait line breaks?", back: "Its buyers become sellers into the real zone." },
      { front: "Student short trade?", back: "Short 914, stop 917, target 895." },
      { front: "Student long trade?", back: "Buy 814, stop 812, targets 821, 827, 834." },
      { front: "Can't see the trap?", back: "You are probably the prey." }
    ],
    mnemonic: "Cheese above, trap below: the obvious line is bait, the real zone is the trap."
  },
  {
    mentor: "seiden",
    n: 134,
    eli5: {
      oneLiner: "Time your stock trades with the S&P and NASDAQ levels.",
      story: "Stocks mostly move with the whole market, like boats on the same tide. So Seiden starts 30 minutes before the open by marking supply, demand and trend on the S&P and NASDAQ. Then he looks for stocks whose own levels line up. When the S&P rallied into supply, Google and RIMM rallied into their supply at the same time, and the shorts worked fast.",
      analogy: "Like rowing out only when the tide is going your way: the same strokes take you much further."
    },
    bigIdeas: [
      "Step 1: mark demand, supply and trend in the S&P and NASDAQ.",
      "Step 2: trade only stocks whose levels line up with the index level.",
      "Favour levels with a rapid move away and about 3:1 to the opposing level."
    ],
    steps: [
      {
        title: "Step 1: the index",
        narration: "Before the open, the S&P is rallying toward its own supply. That sets the timing.",
        scene: {
          candles: [
            { o: 135, h: 137.26, l: 134.81, c: 136.83 },
            { o: 136.83, h: 139.54, l: 136.43, c: 139.17 },
            { o: 139.17, h: 140.94, l: 139.01, c: 140.72 },
            { o: 140.72, h: 143.04, l: 140.43, c: 142.91 },
            { o: 142.91, h: 145.12, l: 142.79, c: 145 },
            { o: 145, h: 146.27, l: 144.51, c: 145.94 },
            { o: 145.94, h: 146.41, l: 144.42, c: 144.97 },
            { o: 144.97, h: 145.04, l: 138.2, c: 138.3 },
            { o: 138.3, h: 138.46, l: 130.92, c: 130.97 },
            { o: 130.97, h: 131.11, l: 129.66, c: 130.08 },
            { o: 130.08, h: 130.41, l: 128.58, c: 128.97 },
            { o: 128.97, h: 129.69, l: 128.4, c: 129.22 },
            { o: 129.22, h: 129.57, l: 128.43, c: 128.91 },
            { o: 128.91, h: 131.31, l: 128.73, c: 131.09 },
            { o: 131.09, h: 133.02, l: 131, c: 132.91 },
            { o: 132.91, h: 136.07, l: 132.73, c: 135.76 },
            { o: 135.76, h: 138.4, l: 135.44, c: 138 },
            { o: 138, h: 141.63, l: 137.67, c: 141.23 },
            { o: 141.23, h: 144.7, l: 140.9, c: 144.47 },
            { o: 144.47, h: 145.76, l: 143.82, c: 144.07 },
            { o: 144.07, h: 144.42, l: 140.46, c: 140.66 },
            { o: 140.66, h: 141.02, l: 136.88, c: 137.27 },
            { o: 137.27, h: 137.41, l: 134.46, c: 134.75 },
            { o: 134.75, h: 134.93, l: 132.23, c: 132.62 },
            { o: 132.62, h: 132.98, l: 128.56, c: 128.82 }
          ],
          notes: [
            { x: 5, y: 147.67, text: "S&P at supply too" }
          ],
          reveal: 9
        }
      },
      {
        title: "Step 2: the stock's supply",
        narration: "This stock has supply where price left with a rapid drop. Mark it, plus the demand below.",
        scene: {
          candles: [
            { o: 135, h: 137.26, l: 134.81, c: 136.83 },
            { o: 136.83, h: 139.54, l: 136.43, c: 139.17 },
            { o: 139.17, h: 140.94, l: 139.01, c: 140.72 },
            { o: 140.72, h: 143.04, l: 140.43, c: 142.91 },
            { o: 142.91, h: 145.12, l: 142.79, c: 145 },
            { o: 145, h: 146.27, l: 144.51, c: 145.94 },
            { o: 145.94, h: 146.41, l: 144.42, c: 144.97 },
            { o: 144.97, h: 145.04, l: 138.2, c: 138.3 },
            { o: 138.3, h: 138.46, l: 130.92, c: 130.97 },
            { o: 130.97, h: 131.11, l: 129.66, c: 130.08 },
            { o: 130.08, h: 130.41, l: 128.58, c: 128.97 },
            { o: 128.97, h: 129.69, l: 128.4, c: 129.22 },
            { o: 129.22, h: 129.57, l: 128.43, c: 128.91 },
            { o: 128.91, h: 131.31, l: 128.73, c: 131.09 },
            { o: 131.09, h: 133.02, l: 131, c: 132.91 },
            { o: 132.91, h: 136.07, l: 132.73, c: 135.76 },
            { o: 135.76, h: 138.4, l: 135.44, c: 138 },
            { o: 138, h: 141.63, l: 137.67, c: 141.23 },
            { o: 141.23, h: 144.7, l: 140.9, c: 144.47 },
            { o: 144.47, h: 145.76, l: 143.82, c: 144.07 },
            { o: 144.07, h: 144.42, l: 140.46, c: 140.66 },
            { o: 140.66, h: 141.02, l: 136.88, c: 137.27 },
            { o: 137.27, h: 137.41, l: 134.46, c: 134.75 },
            { o: 134.75, h: 134.93, l: 132.23, c: 132.62 },
            { o: 132.62, h: 132.98, l: 128.56, c: 128.82 }
          ],
          zones: [
            { from: 5, top: 146.41, bottom: 144.97, kind: "supply", label: "Stock supply" },
            { from: 11, top: 129.22, bottom: 128.4, kind: "demand", label: "Stock demand" }
          ],
          notes: [
            { x: 5, y: 147.67, text: "S&P at supply too" }
          ],
          reveal: 15
        }
      },
      {
        title: "Both arrive together",
        narration: "The stock rallies into its supply at the same moment the index reaches its supply. Sell, stop above the zone.",
        scene: {
          candles: [
            { o: 135, h: 137.26, l: 134.81, c: 136.83 },
            { o: 136.83, h: 139.54, l: 136.43, c: 139.17 },
            { o: 139.17, h: 140.94, l: 139.01, c: 140.72 },
            { o: 140.72, h: 143.04, l: 140.43, c: 142.91 },
            { o: 142.91, h: 145.12, l: 142.79, c: 145 },
            { o: 145, h: 146.27, l: 144.51, c: 145.94 },
            { o: 145.94, h: 146.41, l: 144.42, c: 144.97 },
            { o: 144.97, h: 145.04, l: 138.2, c: 138.3 },
            { o: 138.3, h: 138.46, l: 130.92, c: 130.97 },
            { o: 130.97, h: 131.11, l: 129.66, c: 130.08 },
            { o: 130.08, h: 130.41, l: 128.58, c: 128.97 },
            { o: 128.97, h: 129.69, l: 128.4, c: 129.22 },
            { o: 129.22, h: 129.57, l: 128.43, c: 128.91 },
            { o: 128.91, h: 131.31, l: 128.73, c: 131.09 },
            { o: 131.09, h: 133.02, l: 131, c: 132.91 },
            { o: 132.91, h: 136.07, l: 132.73, c: 135.76 },
            { o: 135.76, h: 138.4, l: 135.44, c: 138 },
            { o: 138, h: 141.63, l: 137.67, c: 141.23 },
            { o: 141.23, h: 144.7, l: 140.9, c: 144.47 },
            { o: 144.47, h: 145.76, l: 143.82, c: 144.07 },
            { o: 144.07, h: 144.42, l: 140.46, c: 140.66 },
            { o: 140.66, h: 141.02, l: 136.88, c: 137.27 },
            { o: 137.27, h: 137.41, l: 134.46, c: 134.75 },
            { o: 134.75, h: 134.93, l: 132.23, c: 132.62 },
            { o: 132.62, h: 132.98, l: 128.56, c: 128.82 }
          ],
          zones: [
            { from: 5, top: 146.41, bottom: 144.97, kind: "supply", label: "Stock supply" },
            { from: 11, top: 129.22, bottom: 128.4, kind: "demand", label: "Stock demand" }
          ],
          lines: [
            { y: 144.97, label: "Entry (proximal)", kind: "entry" },
            { y: 146.71, label: "Stop beyond distal", kind: "sl" },
            { y: 129.22, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 5, y: 147.67, text: "S&P at supply too" }
          ],
          reveal: 19
        }
      },
      {
        title: "3:1 to the demand box",
        narration: "Like RIMM: risk about $0.50 to make about $1.50. Price falls to the demand below.",
        scene: {
          candles: [
            { o: 135, h: 137.26, l: 134.81, c: 136.83 },
            { o: 136.83, h: 139.54, l: 136.43, c: 139.17 },
            { o: 139.17, h: 140.94, l: 139.01, c: 140.72 },
            { o: 140.72, h: 143.04, l: 140.43, c: 142.91 },
            { o: 142.91, h: 145.12, l: 142.79, c: 145 },
            { o: 145, h: 146.27, l: 144.51, c: 145.94 },
            { o: 145.94, h: 146.41, l: 144.42, c: 144.97 },
            { o: 144.97, h: 145.04, l: 138.2, c: 138.3 },
            { o: 138.3, h: 138.46, l: 130.92, c: 130.97 },
            { o: 130.97, h: 131.11, l: 129.66, c: 130.08 },
            { o: 130.08, h: 130.41, l: 128.58, c: 128.97 },
            { o: 128.97, h: 129.69, l: 128.4, c: 129.22 },
            { o: 129.22, h: 129.57, l: 128.43, c: 128.91 },
            { o: 128.91, h: 131.31, l: 128.73, c: 131.09 },
            { o: 131.09, h: 133.02, l: 131, c: 132.91 },
            { o: 132.91, h: 136.07, l: 132.73, c: 135.76 },
            { o: 135.76, h: 138.4, l: 135.44, c: 138 },
            { o: 138, h: 141.63, l: 137.67, c: 141.23 },
            { o: 141.23, h: 144.7, l: 140.9, c: 144.47 },
            { o: 144.47, h: 145.76, l: 143.82, c: 144.07 },
            { o: 144.07, h: 144.42, l: 140.46, c: 140.66 },
            { o: 140.66, h: 141.02, l: 136.88, c: 137.27 },
            { o: 137.27, h: 137.41, l: 134.46, c: 134.75 },
            { o: 134.75, h: 134.93, l: 132.23, c: 132.62 },
            { o: 132.62, h: 132.98, l: 128.56, c: 128.82 }
          ],
          zones: [
            { from: 5, top: 146.41, bottom: 144.97, kind: "supply", label: "Stock supply" },
            { from: 11, top: 129.22, bottom: 128.4, kind: "demand", label: "Stock demand" }
          ],
          lines: [
            { y: 144.97, label: "Entry (proximal)", kind: "entry" },
            { y: 146.71, label: "Stop beyond distal", kind: "sl" },
            { y: 129.22, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 5, y: 147.67, text: "S&P at supply too" },
            { x: 24, y: 127.16, text: "Target: demand box" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order the XLT market-timing process.",
        items: [
          "Start before the open",
          "Mark S&P and NASDAQ supply, demand and trend",
          "Find stocks whose levels line up with the index",
          "Take only trades with about 3:1"
        ],
        explain: "Index first, then stocks that match."
      },
      {
        type: "mcq",
        q: "Why check the index before a stock trade?",
        options: [
          "Stocks ebb and flow with the broad market",
          "The index has no levels",
          "It is required by law",
          "It changes the stop"
        ],
        answer: 0,
        explain: "Timing equity trades with S&P or NASDAQ supply and demand is the key to high odds."
      },
      {
        type: "spot",
        q: "Click the base where the stock left its supply with a rapid move.",
        scene: {
          candles: [
            { o: 135, h: 137.26, l: 134.81, c: 136.83 },
            { o: 136.83, h: 139.54, l: 136.43, c: 139.17 },
            { o: 139.17, h: 140.94, l: 139.01, c: 140.72 },
            { o: 140.72, h: 143.04, l: 140.43, c: 142.91 },
            { o: 142.91, h: 145.12, l: 142.79, c: 145 },
            { o: 145, h: 146.27, l: 144.51, c: 145.94 },
            { o: 145.94, h: 146.41, l: 144.42, c: 144.97 },
            { o: 144.97, h: 145.04, l: 138.2, c: 138.3 },
            { o: 138.3, h: 138.46, l: 130.92, c: 130.97 },
            { o: 130.97, h: 131.11, l: 129.66, c: 130.08 },
            { o: 130.08, h: 130.41, l: 128.58, c: 128.97 },
            { o: 128.97, h: 129.69, l: 128.4, c: 129.22 },
            { o: 129.22, h: 129.57, l: 128.43, c: 128.91 },
            { o: 128.91, h: 131.31, l: 128.73, c: 131.09 },
            { o: 131.09, h: 133.02, l: 131, c: 132.91 },
            { o: 132.91, h: 136.07, l: 132.73, c: 135.76 },
            { o: 135.76, h: 138.4, l: 135.44, c: 138 },
            { o: 138, h: 141.63, l: 137.67, c: 141.23 },
            { o: 141.23, h: 144.7, l: 140.9, c: 144.47 },
            { o: 144.47, h: 145.76, l: 143.82, c: 144.07 },
            { o: 144.07, h: 144.42, l: 140.46, c: 140.66 },
            { o: 140.66, h: 141.02, l: 136.88, c: 137.27 },
            { o: 137.27, h: 137.41, l: 134.46, c: 134.75 },
            { o: 134.75, h: 134.93, l: 132.23, c: 132.62 },
            { o: 132.62, h: 132.98, l: 128.56, c: 128.82 }
          ]
        },
        answer: { from: 5, to: 6 },
        explain: "The small base before the fast drop - the stock's supply."
      },
      {
        type: "mcq",
        q: "RIMM short: risk about $0.50. What reward made it worth it?",
        options: ["$0.25", "$0.50", "About $1.50 (3:1)", "No target"],
        answer: 2,
        explain: "Demand sat about $1.50 below the short entry."
      },
      {
        type: "tf",
        q: "Stock levels that line up with index levels raise the odds.",
        answer: true,
        explain: "Stock supply lining up with index supply at the same moment raised the odds for GOOG and RIMM."
      }
    ],
    practice: [
      {
        prompt: "Your stock is rallying into its supply, but the S&P is sitting on strong demand and bouncing hard. Sell the stock, buy, or nothing?",
        scene: {
          candles: [
            { o: 136, h: 138.01, l: 135.71, c: 137.84 },
            { o: 137.84, h: 140.49, l: 137.45, c: 140.15 },
            { o: 140.15, h: 142.4, l: 139.86, c: 142.1 },
            { o: 142.1, h: 144.27, l: 141.87, c: 144.09 },
            { o: 144.09, h: 146.32, l: 143.71, c: 146 },
            { o: 146, h: 146.91, l: 145.46, c: 146.34 },
            { o: 146.34, h: 146.65, l: 145.22, c: 145.82 },
            { o: 145.82, h: 146.6, l: 145.14, c: 146.09 },
            { o: 146.09, h: 146.24, l: 141.63, c: 141.83 },
            { o: 141.83, h: 142.12, l: 138.62, c: 138.8 },
            { o: 138.8, h: 139.14, l: 134.89, c: 135.09 },
            { o: 135.09, h: 135.57, l: 133, c: 133.68 },
            { o: 133.68, h: 135.09, l: 133.38, c: 134.77 },
            { o: 134.77, h: 135.39, l: 133.85, c: 134.09 },
            { o: 134.09, h: 137.27, l: 133.91, c: 137.06 },
            { o: 137.06, h: 139.98, l: 136.98, c: 139.77 },
            { o: 139.77, h: 142.98, l: 139.63, c: 142.79 },
            { o: 142.79, h: 145.46, l: 142.71, c: 145.32 },
            { o: 145.32, h: 150.21, l: 145.17, c: 149.91 },
            { o: 149.91, h: 151.42, l: 149.53, c: 150.97 },
            { o: 150.97, h: 152.55, l: 150.78, c: 152.4 },
            { o: 152.4, h: 154.19, l: 152.2, c: 153.76 },
            { o: 153.76, h: 155.13, l: 153.33, c: 154.91 }
          ],
          zones: [
            { from: 5, top: 146.91, bottom: 145.82, kind: "supply", label: "Stock supply" }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The stock level does not line up with the index - the index is at demand, not supply. Skip it. The market lifted the stock straight through its supply."
      }
    ],
    cards: [
      { front: "Step 1 of XLT timing?", back: "Mark S&P and NASDAQ supply, demand and trend." },
      { front: "Step 2?", back: "Find stocks whose levels line up with the index." },
      { front: "When do XLT sessions start?", back: "30 minutes before the open." },
      { front: "RIMM example ratio?", back: "Risk $0.50 to make $1.50 (3:1)." },
      { front: "Which stock levels to favour?", back: "Ones price left with a rapid move." }
    ],
    mnemonic: "Tide first, boat second: index level, then the stock."
  },
  {
    mentor: "seiden",
    n: 137,
    eli5: {
      oneLiner: "Pro gaps start moves; novice gaps end them.",
      story: "A gap happens when the orders at the open overwhelm the other side. A professional gap goes against the prior move: after a rally, price gaps down and a new move starts. A novice gap goes with the prior move: after a decline, price gaps down again into support, and the move ends. Join pro gaps on a pullback to where the gap started; fade novice gaps at the level.",
      analogy: "Like a starting gun versus a finish line: the pro gap fires the start, the novice gap crosses the finish."
    },
    bigIdeas: [
      "Pro gap = against the prior move, starts a new one. Join on a pullback to the gap origin.",
      "Novice gap = with the prior move, into a level, tends to end it. Fade it.",
      "Both only with a significant profit margin. Beginners should not trade the open."
    ],
    steps: [
      {
        title: "Support and a rally",
        narration: "A support line comes from the early low. Then price rallies in steps.",
        scene: {
          candles: [
            { o: 134, h: 134.31, l: 132.67, c: 132.84 },
            { o: 132.84, h: 132.98, l: 130.81, c: 131 },
            { o: 131, h: 134.38, l: 130.76, c: 134.16 },
            { o: 134.16, h: 137.16, l: 133.91, c: 136.91 },
            { o: 136.91, h: 137.23, l: 136.48, c: 136.78 },
            { o: 136.78, h: 142.64, l: 136.51, c: 142.41 },
            { o: 142.41, h: 145.49, l: 142.14, c: 145.16 },
            { o: 145.16, h: 145.44, l: 144.74, c: 145.03 },
            { o: 145.03, h: 150.83, l: 144.71, c: 150.66 },
            { o: 150.66, h: 153.23, l: 150.48, c: 153 },
            { o: 153, h: 153.31, l: 152.02, c: 152.4 },
            { o: 152.4, h: 154.18, l: 152.16, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.95, l: 147.98, c: 148.15 },
            { o: 148.15, h: 148.58, l: 146.24, c: 146.38 },
            { o: 146.38, h: 146.66, l: 143.88, c: 144.23 },
            { o: 144.23, h: 144.55, l: 141.74, c: 142.14 },
            { o: 142.14, h: 142.56, l: 140.37, c: 140.6 },
            { o: 140.6, h: 141.29, l: 140.25, c: 140.47 },
            { o: 140.47, h: 141.49, l: 140.07, c: 141.2 },
            { o: 131.41, h: 133.21, l: 130.96, c: 133.01 },
            { o: 133.01, h: 134.55, l: 132.71, c: 134.37 },
            { o: 134.37, h: 136.41, l: 134.24, c: 136.19 },
            { o: 136.19, h: 137.9, l: 135.9, c: 137.5 },
            { o: 137.5, h: 139.2, l: 137.08, c: 139.01 }
          ],
          lines: [
            { y: 130.81, label: "Price support", kind: "level" }
          ],
          reveal: 12
        }
      },
      {
        title: "The pro gap",
        narration: "After the rally, price gaps DOWN, against the move. That gap starts a new slide.",
        scene: {
          candles: [
            { o: 134, h: 134.31, l: 132.67, c: 132.84 },
            { o: 132.84, h: 132.98, l: 130.81, c: 131 },
            { o: 131, h: 134.38, l: 130.76, c: 134.16 },
            { o: 134.16, h: 137.16, l: 133.91, c: 136.91 },
            { o: 136.91, h: 137.23, l: 136.48, c: 136.78 },
            { o: 136.78, h: 142.64, l: 136.51, c: 142.41 },
            { o: 142.41, h: 145.49, l: 142.14, c: 145.16 },
            { o: 145.16, h: 145.44, l: 144.74, c: 145.03 },
            { o: 145.03, h: 150.83, l: 144.71, c: 150.66 },
            { o: 150.66, h: 153.23, l: 150.48, c: 153 },
            { o: 153, h: 153.31, l: 152.02, c: 152.4 },
            { o: 152.4, h: 154.18, l: 152.16, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.95, l: 147.98, c: 148.15 },
            { o: 148.15, h: 148.58, l: 146.24, c: 146.38 },
            { o: 146.38, h: 146.66, l: 143.88, c: 144.23 },
            { o: 144.23, h: 144.55, l: 141.74, c: 142.14 },
            { o: 142.14, h: 142.56, l: 140.37, c: 140.6 },
            { o: 140.6, h: 141.29, l: 140.25, c: 140.47 },
            { o: 140.47, h: 141.49, l: 140.07, c: 141.2 },
            { o: 131.41, h: 133.21, l: 130.96, c: 133.01 },
            { o: 133.01, h: 134.55, l: 132.71, c: 134.37 },
            { o: 134.37, h: 136.41, l: 134.24, c: 136.19 },
            { o: 136.19, h: 137.9, l: 135.9, c: 137.5 },
            { o: 137.5, h: 139.2, l: 137.08, c: 139.01 }
          ],
          lines: [
            { y: 130.81, label: "Price support", kind: "level" }
          ],
          highlight: { from: 12, to: 12, label: "pro gap" },
          reveal: 18
        }
      },
      {
        title: "The novice gap",
        narration: "After the decline, price gaps down AGAIN, with the move, right onto support. Someone is selling after a decline during a gap down.",
        scene: {
          candles: [
            { o: 134, h: 134.31, l: 132.67, c: 132.84 },
            { o: 132.84, h: 132.98, l: 130.81, c: 131 },
            { o: 131, h: 134.38, l: 130.76, c: 134.16 },
            { o: 134.16, h: 137.16, l: 133.91, c: 136.91 },
            { o: 136.91, h: 137.23, l: 136.48, c: 136.78 },
            { o: 136.78, h: 142.64, l: 136.51, c: 142.41 },
            { o: 142.41, h: 145.49, l: 142.14, c: 145.16 },
            { o: 145.16, h: 145.44, l: 144.74, c: 145.03 },
            { o: 145.03, h: 150.83, l: 144.71, c: 150.66 },
            { o: 150.66, h: 153.23, l: 150.48, c: 153 },
            { o: 153, h: 153.31, l: 152.02, c: 152.4 },
            { o: 152.4, h: 154.18, l: 152.16, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.95, l: 147.98, c: 148.15 },
            { o: 148.15, h: 148.58, l: 146.24, c: 146.38 },
            { o: 146.38, h: 146.66, l: 143.88, c: 144.23 },
            { o: 144.23, h: 144.55, l: 141.74, c: 142.14 },
            { o: 142.14, h: 142.56, l: 140.37, c: 140.6 },
            { o: 140.6, h: 141.29, l: 140.25, c: 140.47 },
            { o: 140.47, h: 141.49, l: 140.07, c: 141.2 },
            { o: 131.41, h: 133.21, l: 130.96, c: 133.01 },
            { o: 133.01, h: 134.55, l: 132.71, c: 134.37 },
            { o: 134.37, h: 136.41, l: 134.24, c: 136.19 },
            { o: 136.19, h: 137.9, l: 135.9, c: 137.5 },
            { o: 137.5, h: 139.2, l: 137.08, c: 139.01 }
          ],
          lines: [
            { y: 130.81, label: "Price support", kind: "level" }
          ],
          highlight: { from: 20, to: 20, label: "novice gap" },
          reveal: 21
        }
      },
      {
        title: "Fade the novice",
        narration: "The novice gap marks the end of the move. Buy at support; price rallies.",
        scene: {
          candles: [
            { o: 134, h: 134.31, l: 132.67, c: 132.84 },
            { o: 132.84, h: 132.98, l: 130.81, c: 131 },
            { o: 131, h: 134.38, l: 130.76, c: 134.16 },
            { o: 134.16, h: 137.16, l: 133.91, c: 136.91 },
            { o: 136.91, h: 137.23, l: 136.48, c: 136.78 },
            { o: 136.78, h: 142.64, l: 136.51, c: 142.41 },
            { o: 142.41, h: 145.49, l: 142.14, c: 145.16 },
            { o: 145.16, h: 145.44, l: 144.74, c: 145.03 },
            { o: 145.03, h: 150.83, l: 144.71, c: 150.66 },
            { o: 150.66, h: 153.23, l: 150.48, c: 153 },
            { o: 153, h: 153.31, l: 152.02, c: 152.4 },
            { o: 152.4, h: 154.18, l: 152.16, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.95, l: 147.98, c: 148.15 },
            { o: 148.15, h: 148.58, l: 146.24, c: 146.38 },
            { o: 146.38, h: 146.66, l: 143.88, c: 144.23 },
            { o: 144.23, h: 144.55, l: 141.74, c: 142.14 },
            { o: 142.14, h: 142.56, l: 140.37, c: 140.6 },
            { o: 140.6, h: 141.29, l: 140.25, c: 140.47 },
            { o: 140.47, h: 141.49, l: 140.07, c: 141.2 },
            { o: 131.41, h: 133.21, l: 130.96, c: 133.01 },
            { o: 133.01, h: 134.55, l: 132.71, c: 134.37 },
            { o: 134.37, h: 136.41, l: 134.24, c: 136.19 },
            { o: 136.19, h: 137.9, l: 135.9, c: 137.5 },
            { o: 137.5, h: 139.2, l: 137.08, c: 139.01 }
          ],
          lines: [
            { y: 130.81, label: "Price support", kind: "level" }
          ],
          notes: [
            { x: 20, y: 129.56, text: "Buy: fade the novice" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A gap goes AGAINST the prior move. What is it?",
        options: ["A novice gap", "A professional gap", "A breakaway error", "No gap"],
        answer: 1,
        explain: "Pro gaps come after a move, in the opposite direction, and ignite a new move."
      },
      {
        type: "mcq",
        q: "How do you trade a novice gap?",
        options: [
          "Join it",
          "Fade it at the nearest support or resistance",
          "Ignore all gaps",
          "Buy the gap up"
        ],
        answer: 1,
        explain: "Novice gaps tend to end moves. Fade them, with a significant profit margin."
      },
      {
        type: "spot",
        q: "Click the professional gap.",
        scene: {
          candles: [
            { o: 134, h: 134.31, l: 132.67, c: 132.84 },
            { o: 132.84, h: 132.98, l: 130.81, c: 131 },
            { o: 131, h: 134.38, l: 130.76, c: 134.16 },
            { o: 134.16, h: 137.16, l: 133.91, c: 136.91 },
            { o: 136.91, h: 137.23, l: 136.48, c: 136.78 },
            { o: 136.78, h: 142.64, l: 136.51, c: 142.41 },
            { o: 142.41, h: 145.49, l: 142.14, c: 145.16 },
            { o: 145.16, h: 145.44, l: 144.74, c: 145.03 },
            { o: 145.03, h: 150.83, l: 144.71, c: 150.66 },
            { o: 150.66, h: 153.23, l: 150.48, c: 153 },
            { o: 153, h: 153.31, l: 152.02, c: 152.4 },
            { o: 152.4, h: 154.18, l: 152.16, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.95, l: 147.98, c: 148.15 },
            { o: 148.15, h: 148.58, l: 146.24, c: 146.38 },
            { o: 146.38, h: 146.66, l: 143.88, c: 144.23 },
            { o: 144.23, h: 144.55, l: 141.74, c: 142.14 },
            { o: 142.14, h: 142.56, l: 140.37, c: 140.6 },
            { o: 140.6, h: 141.29, l: 140.25, c: 140.47 },
            { o: 140.47, h: 141.49, l: 140.07, c: 141.2 },
            { o: 131.41, h: 133.21, l: 130.96, c: 133.01 },
            { o: 133.01, h: 134.55, l: 132.71, c: 134.37 },
            { o: 134.37, h: 136.41, l: 134.24, c: 136.19 },
            { o: 136.19, h: 137.9, l: 135.9, c: 137.5 },
            { o: 137.5, h: 139.2, l: 137.08, c: 139.01 }
          ],
          lines: [
            { y: 130.81, label: "Support", kind: "level" }
          ]
        },
        answer: { from: 12, to: 12 },
        explain: "After the rally, the gap down against the move started the slide."
      },
      {
        type: "tf",
        q: "After a pro gap down, sell near the origin of the gap when price rallies back.",
        answer: true,
        explain: "Price often rallies to fill part of the gap, then continues lower. Sell near the gap origin."
      },
      {
        type: "mcq",
        q: "Who should not trade the open?",
        options: ["Experienced traders", "Beginners", "Nobody", "Only forex traders"],
        answer: 1,
        explain: "The open has the biggest imbalance, but it is not for beginners."
      }
    ],
    practice: [
      {
        prompt: "After a decline, price gaps down again right onto the support line from the earlier low. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 134, h: 134.2, l: 132, c: 132.16 },
            { o: 132.16, h: 132.46, l: 130.75, c: 131 },
            { o: 131, h: 134.37, l: 130.85, c: 134.16 },
            { o: 134.16, h: 137.18, l: 133.78, c: 136.91 },
            { o: 136.91, h: 137.19, l: 136.51, c: 136.78 },
            { o: 136.78, h: 142.67, l: 136.4, c: 142.41 },
            { o: 142.41, h: 145.5, l: 142.11, c: 145.16 },
            { o: 145.16, h: 145.4, l: 144.86, c: 145.03 },
            { o: 145.03, h: 151.05, l: 144.79, c: 150.66 },
            { o: 150.66, h: 153.39, l: 150.46, c: 153 },
            { o: 153, h: 153.61, l: 152.16, c: 152.62 },
            { o: 152.62, h: 153.94, l: 152.13, c: 153.5 },
            { o: 151.3, h: 151.6, l: 149.3, c: 149.6 },
            { o: 149.6, h: 149.94, l: 147.71, c: 147.91 },
            { o: 147.91, h: 148.09, l: 145.3, c: 145.65 },
            { o: 145.65, h: 145.83, l: 143.78, c: 144.07 },
            { o: 144.07, h: 144.25, l: 142.7, c: 142.83 },
            { o: 142.83, h: 143.07, l: 140.2, c: 140.6 },
            { o: 140.6, h: 142.2, l: 140.38, c: 141.52 },
            { o: 141.52, h: 141.77, l: 140.76, c: 141.2 },
            { o: 131.35, h: 133.15, l: 130.9, c: 132.95 },
            { o: 132.95, h: 134.88, l: 132.57, c: 134.49 },
            { o: 134.49, h: 136.62, l: 134.25, c: 136.24 },
            { o: 136.24, h: 138.19, l: 135.96, c: 137.75 },
            { o: 137.75, h: 139.34, l: 137.53, c: 138.95 }
          ],
          lines: [
            { y: 130.75, label: "Price support", kind: "level" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "buy", sl: 130.25, tp: 135.75 },
        explain: "A novice gap: selling after a decline, with the move, into support. Fade it: buy at support. Price rallied."
      },
      {
        prompt: "After a big rally, price gapped down (a pro gap) and slid. It has now rallied back up toward where the gap started. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 143.84, l: 139.77, c: 143.45 },
            { o: 143.45, h: 146.77, l: 143.13, c: 146.45 },
            { o: 146.45, h: 146.7, l: 145.96, c: 146.3 },
            { o: 146.3, h: 152.74, l: 146.1, c: 152.45 },
            { o: 152.45, h: 155.81, l: 152.15, c: 155.45 },
            { o: 155.45, h: 158.27, l: 155.16, c: 158 },
            { o: 155.6, h: 155.9, l: 153.4, c: 153.7 },
            { o: 153.7, h: 154.08, l: 151.63, c: 152 },
            { o: 152, h: 152.16, l: 150.29, c: 150.68 },
            { o: 150.68, h: 151.03, l: 148.49, c: 148.7 },
            { o: 148.7, h: 151.6, l: 148.57, c: 151.26 },
            { o: 151.26, h: 154.69, l: 150.85, c: 154.57 },
            { o: 154.57, h: 157.56, l: 154.21, c: 157.4 },
            { o: 157.4, h: 157.95, l: 156, c: 156.2 },
            { o: 156.2, h: 156.59, l: 154.01, c: 154.33 },
            { o: 154.33, h: 154.55, l: 151.56, c: 151.84 },
            { o: 151.84, h: 152.24, l: 148.61, c: 148.92 },
            { o: 148.92, h: 149.31, l: 146.9, c: 147.2 }
          ],
          lines: [
            { y: 158, label: "Gap origin", kind: "level" }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: { side: "sell", sl: 158.6, tp: 152 },
        explain: "Join the pro gap on the pullback to its origin. Sell near the origin with the stop above it. Price continued lower."
      }
    ],
    cards: [
      { front: "Why do gaps form?", back: "Demand or supply at the prior close is far out of balance." },
      { front: "Pro gap?", back: "After a move, against it; starts a new move." },
      { front: "Novice gap?", back: "After a move, with it, into a level; ends the move." },
      { front: "Trade a pro gap how?", back: "Join on a pullback to the gap origin." },
      { front: "Trade a novice gap how?", back: "Fade it at the nearest support or resistance." },
      { front: "Same rules in every market?", back: "Yes: stocks, futures, forex, options." }
    ],
    mnemonic: "Pro starts, novice finishes: join the starter, fade the finisher."
  },
  {
    mentor: "seiden",
    n: 140,
    eli5: {
      oneLiner: "Fade a gap up after a strong rally; demand a real profit margin.",
      story: "In an uptrend, a gap up after a strong rally straight into resistance is a novice gap: pros do not buy after a big rise, especially on a gap. A gap down after a rally at resistance is a pro gap and usually ends the uptrend. For stocks, the best time is the open to about two hours in, with levels drawn before the bell. And whatever the setup, two good levels are not enough: you need real space between them.",
      analogy: "Like two goalposts: you need a whole field between them to score, not a step."
    },
    bigIdeas: [
      "Uptrend: gap up after a strong rally into resistance = novice gap; fade it.",
      "Best equity window: the open to about two hours in, prepared pre-market.",
      "No significant profit margin = no trade."
    ],
    steps: [
      {
        title: "Resistance from the highs",
        narration: "Price based at the highs and collapsed. That base is resistance (supply).",
        scene: {
          candles: [
            { o: 144, h: 146.01, l: 143.57, c: 145.68 },
            { o: 145.68, h: 147.49, l: 145.26, c: 147.13 },
            { o: 147.13, h: 148.34, l: 146.82, c: 147.92 },
            { o: 147.92, h: 149.95, l: 147.73, c: 149.71 },
            { o: 149.71, h: 151.38, l: 149.58, c: 151 },
            { o: 151, h: 152.3, l: 150.47, c: 151.67 },
            { o: 151.67, h: 152.36, l: 150.68, c: 151.05 },
            { o: 151.05, h: 151.13, l: 145.4, c: 145.47 },
            { o: 145.47, h: 145.63, l: 138.81, c: 138.9 },
            { o: 138.9, h: 138.96, l: 132.99, c: 133.05 },
            { o: 133.05, h: 134.19, l: 132.75, c: 133.85 },
            { o: 133.85, h: 134.37, l: 131.05, c: 131.48 },
            { o: 131.48, h: 132.64, l: 130.99, c: 132.05 },
            { o: 132.05, h: 136.43, l: 131.88, c: 136.25 },
            { o: 136.25, h: 140.3, l: 135.84, c: 140.05 },
            { o: 140.05, h: 144.81, l: 139.7, c: 144.37 },
            { o: 144.37, h: 148.4, l: 144.07, c: 148 },
            { o: 151.41, h: 151.81, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.07, l: 146.33, c: 146.76 },
            { o: 146.76, h: 147.18, l: 144.36, c: 144.53 },
            { o: 144.53, h: 144.88, l: 142.58, c: 142.74 },
            { o: 142.74, h: 142.87, l: 139.6, c: 139.8 }
          ],
          zones: [
            { from: 5, top: 152.36, bottom: 151, kind: "supply", label: "Resistance" }
          ],
          reveal: 10
        }
      },
      {
        title: "An uptrend back up",
        narration: "A sharp uptrend begins from the lows and climbs toward resistance.",
        scene: {
          candles: [
            { o: 144, h: 146.01, l: 143.57, c: 145.68 },
            { o: 145.68, h: 147.49, l: 145.26, c: 147.13 },
            { o: 147.13, h: 148.34, l: 146.82, c: 147.92 },
            { o: 147.92, h: 149.95, l: 147.73, c: 149.71 },
            { o: 149.71, h: 151.38, l: 149.58, c: 151 },
            { o: 151, h: 152.3, l: 150.47, c: 151.67 },
            { o: 151.67, h: 152.36, l: 150.68, c: 151.05 },
            { o: 151.05, h: 151.13, l: 145.4, c: 145.47 },
            { o: 145.47, h: 145.63, l: 138.81, c: 138.9 },
            { o: 138.9, h: 138.96, l: 132.99, c: 133.05 },
            { o: 133.05, h: 134.19, l: 132.75, c: 133.85 },
            { o: 133.85, h: 134.37, l: 131.05, c: 131.48 },
            { o: 131.48, h: 132.64, l: 130.99, c: 132.05 },
            { o: 132.05, h: 136.43, l: 131.88, c: 136.25 },
            { o: 136.25, h: 140.3, l: 135.84, c: 140.05 },
            { o: 140.05, h: 144.81, l: 139.7, c: 144.37 },
            { o: 144.37, h: 148.4, l: 144.07, c: 148 },
            { o: 151.41, h: 151.81, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.07, l: 146.33, c: 146.76 },
            { o: 146.76, h: 147.18, l: 144.36, c: 144.53 },
            { o: 144.53, h: 144.88, l: 142.58, c: 142.74 },
            { o: 142.74, h: 142.87, l: 139.6, c: 139.8 }
          ],
          zones: [
            { from: 5, top: 152.36, bottom: 151, kind: "supply", label: "Resistance" }
          ],
          highlight: { from: 13, to: 16, label: "uptrend" },
          reveal: 17
        }
      },
      {
        title: "The novice gap",
        narration: "Price gaps UP after the strong rally, straight into resistance. Pros do not buy here. Sell, stop above the zone.",
        scene: {
          candles: [
            { o: 144, h: 146.01, l: 143.57, c: 145.68 },
            { o: 145.68, h: 147.49, l: 145.26, c: 147.13 },
            { o: 147.13, h: 148.34, l: 146.82, c: 147.92 },
            { o: 147.92, h: 149.95, l: 147.73, c: 149.71 },
            { o: 149.71, h: 151.38, l: 149.58, c: 151 },
            { o: 151, h: 152.3, l: 150.47, c: 151.67 },
            { o: 151.67, h: 152.36, l: 150.68, c: 151.05 },
            { o: 151.05, h: 151.13, l: 145.4, c: 145.47 },
            { o: 145.47, h: 145.63, l: 138.81, c: 138.9 },
            { o: 138.9, h: 138.96, l: 132.99, c: 133.05 },
            { o: 133.05, h: 134.19, l: 132.75, c: 133.85 },
            { o: 133.85, h: 134.37, l: 131.05, c: 131.48 },
            { o: 131.48, h: 132.64, l: 130.99, c: 132.05 },
            { o: 132.05, h: 136.43, l: 131.88, c: 136.25 },
            { o: 136.25, h: 140.3, l: 135.84, c: 140.05 },
            { o: 140.05, h: 144.81, l: 139.7, c: 144.37 },
            { o: 144.37, h: 148.4, l: 144.07, c: 148 },
            { o: 151.41, h: 151.81, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.07, l: 146.33, c: 146.76 },
            { o: 146.76, h: 147.18, l: 144.36, c: 144.53 },
            { o: 144.53, h: 144.88, l: 142.58, c: 142.74 },
            { o: 142.74, h: 142.87, l: 139.6, c: 139.8 }
          ],
          zones: [
            { from: 5, top: 152.36, bottom: 151, kind: "supply", label: "Resistance" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 152.66, label: "Stop beyond distal", kind: "sl" }
          ],
          highlight: { from: 17, to: 17, label: "novice gap" },
          reveal: 18
        }
      },
      {
        title: "Back down",
        narration: "Price falls back. The plan was made pre-market and executed near the open.",
        scene: {
          candles: [
            { o: 144, h: 146.01, l: 143.57, c: 145.68 },
            { o: 145.68, h: 147.49, l: 145.26, c: 147.13 },
            { o: 147.13, h: 148.34, l: 146.82, c: 147.92 },
            { o: 147.92, h: 149.95, l: 147.73, c: 149.71 },
            { o: 149.71, h: 151.38, l: 149.58, c: 151 },
            { o: 151, h: 152.3, l: 150.47, c: 151.67 },
            { o: 151.67, h: 152.36, l: 150.68, c: 151.05 },
            { o: 151.05, h: 151.13, l: 145.4, c: 145.47 },
            { o: 145.47, h: 145.63, l: 138.81, c: 138.9 },
            { o: 138.9, h: 138.96, l: 132.99, c: 133.05 },
            { o: 133.05, h: 134.19, l: 132.75, c: 133.85 },
            { o: 133.85, h: 134.37, l: 131.05, c: 131.48 },
            { o: 131.48, h: 132.64, l: 130.99, c: 132.05 },
            { o: 132.05, h: 136.43, l: 131.88, c: 136.25 },
            { o: 136.25, h: 140.3, l: 135.84, c: 140.05 },
            { o: 140.05, h: 144.81, l: 139.7, c: 144.37 },
            { o: 144.37, h: 148.4, l: 144.07, c: 148 },
            { o: 151.41, h: 151.81, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.07, l: 146.33, c: 146.76 },
            { o: 146.76, h: 147.18, l: 144.36, c: 144.53 },
            { o: 144.53, h: 144.88, l: 142.58, c: 142.74 },
            { o: 142.74, h: 142.87, l: 139.6, c: 139.8 }
          ],
          zones: [
            { from: 5, top: 152.36, bottom: 151, kind: "supply", label: "Resistance" }
          ],
          lines: [
            { y: 151, label: "Entry (proximal)", kind: "entry" },
            { y: 152.66, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 21, y: 138.2, text: "Faded" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In an uptrend, which gap is the novice gap?",
        options: [
          "A gap down after a rally at resistance",
          "A gap up after a strong rally",
          "Any gap on Monday",
          "There is none"
        ],
        answer: 1,
        explain: "Pros do not buy after a strong rise, especially on a gap up."
      },
      {
        type: "mcq",
        q: "In an uptrend, a gap down after a rally at resistance usually...",
        options: [
          "Continues the uptrend",
          "Ends the uptrend and starts a downtrend",
          "Means nothing",
          "Fills instantly"
        ],
        answer: 1,
        explain: "That is the professional gap."
      },
      {
        type: "spot",
        q: "Click the novice gap.",
        scene: {
          candles: [
            { o: 144, h: 146.01, l: 143.57, c: 145.68 },
            { o: 145.68, h: 147.49, l: 145.26, c: 147.13 },
            { o: 147.13, h: 148.34, l: 146.82, c: 147.92 },
            { o: 147.92, h: 149.95, l: 147.73, c: 149.71 },
            { o: 149.71, h: 151.38, l: 149.58, c: 151 },
            { o: 151, h: 152.3, l: 150.47, c: 151.67 },
            { o: 151.67, h: 152.36, l: 150.68, c: 151.05 },
            { o: 151.05, h: 151.13, l: 145.4, c: 145.47 },
            { o: 145.47, h: 145.63, l: 138.81, c: 138.9 },
            { o: 138.9, h: 138.96, l: 132.99, c: 133.05 },
            { o: 133.05, h: 134.19, l: 132.75, c: 133.85 },
            { o: 133.85, h: 134.37, l: 131.05, c: 131.48 },
            { o: 131.48, h: 132.64, l: 130.99, c: 132.05 },
            { o: 132.05, h: 136.43, l: 131.88, c: 136.25 },
            { o: 136.25, h: 140.3, l: 135.84, c: 140.05 },
            { o: 140.05, h: 144.81, l: 139.7, c: 144.37 },
            { o: 144.37, h: 148.4, l: 144.07, c: 148 },
            { o: 151.41, h: 151.81, l: 149.5, c: 149.8 },
            { o: 149.8, h: 150.07, l: 146.33, c: 146.76 },
            { o: 146.76, h: 147.18, l: 144.36, c: 144.53 },
            { o: 144.53, h: 144.88, l: 142.58, c: 142.74 },
            { o: 142.74, h: 142.87, l: 139.6, c: 139.8 }
          ],
          zones: [
            { from: 5, top: 152.36, bottom: 151, kind: "supply", label: "Resistance" }
          ]
        },
        answer: { from: 17, to: 17 },
        explain: "The gap up after the strong rally into resistance."
      },
      {
        type: "mcq",
        q: "Best time of day for active equity traders?",
        options: ["Lunch", "The open to about two hours in", "The last minute", "Overnight"],
        answer: 1,
        explain: "That is when supply and demand are most out of balance and direction most predictable."
      },
      {
        type: "tf",
        q: "Two good levels are enough for a trade even if they are close together.",
        answer: false,
        explain: "Without a significant profit margin, there is no trading opportunity."
      }
    ],
    practice: [
      {
        prompt: "Supply box above, demand box below, with plenty of space between. Price is rallying into the supply box. Pick entry, stop and target.",
        scene: {
          candles: [
            { o: 140, h: 141.65, l: 139.7, c: 141.5 },
            { o: 141.5, h: 144.32, l: 141.32, c: 143.96 },
            { o: 143.96, h: 145.55, l: 143.76, c: 145.41 },
            { o: 145.41, h: 147.9, l: 145.09, c: 147.64 },
            { o: 147.64, h: 149.38, l: 147.43, c: 149 },
            { o: 149, h: 149.73, l: 148.4, c: 149.31 },
            { o: 149.31, h: 149.82, l: 147.75, c: 148.37 },
            { o: 148.37, h: 149.51, l: 148.04, c: 148.9 },
            { o: 148.9, h: 149.08, l: 143.24, c: 143.42 },
            { o: 143.42, h: 143.63, l: 136.76, c: 136.9 },
            { o: 136.9, h: 137.17, l: 135.7, c: 136.11 },
            { o: 136.11, h: 136.3, l: 134.76, c: 134.9 },
            { o: 134.9, h: 135.83, l: 134.6, c: 135.16 },
            { o: 135.16, h: 135.58, l: 134.35, c: 134.91 },
            { o: 134.91, h: 137.15, l: 134.77, c: 137.09 },
            { o: 137.09, h: 139.11, l: 136.91, c: 138.91 },
            { o: 138.91, h: 140.94, l: 138.62, c: 140.81 },
            { o: 140.81, h: 143.86, l: 140.56, c: 143.48 },
            { o: 143.48, h: 145.86, l: 143.28, c: 145.7 },
            { o: 145.7, h: 148.2, l: 145.28, c: 147.87 },
            { o: 147.87, h: 149.17, l: 147.22, c: 147.47 },
            { o: 147.47, h: 147.7, l: 144.43, c: 144.59 },
            { o: 144.59, h: 144.74, l: 142.47, c: 142.75 },
            { o: 142.75, h: 143.04, l: 139.84, c: 140.18 },
            { o: 140.18, h: 140.61, l: 136.61, c: 136.99 },
            { o: 136.99, h: 137.23, l: 134.51, c: 134.76 }
          ],
          zones: [
            { from: 5, top: 149.82, bottom: 148.37, kind: "supply", label: "Supply box" },
            { from: 12, top: 135.16, bottom: 134.35, kind: "demand", label: "Demand box" }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { entry: 148.37, sl: 150.12, tp: 135.16 },
        explain: "Short at the supply box, stop just above, take profit at the demand box. The space between is the profit margin."
      }
    ],
    cards: [
      { front: "Uptrend novice gap?", back: "A gap up after a strong rally (into resistance)." },
      { front: "Uptrend pro gap?", back: "A gap down after a rally at resistance; ends the uptrend." },
      { front: "Best equity trading window?", back: "The open to about two hours in." },
      { front: "Profit margin?", back: "The space between the supply and demand levels." },
      { front: "Two levels too close?", back: "No trade." }
    ],
    mnemonic: "Field between the goals: no space, no score."
  },
  {
    mentor: "seiden",
    n: 144,
    eli5: {
      oneLiner: "Great traders are professional losers: small losses, fixed size, real stops.",
      story: "The best traders lose often, but they lose small. Seiden uses three tools. A stop-market order that always gets you out, never a stop-limit that might not fill. A position size that risks only 1% of the account. And keeping losses small, so even a 29% win rate made a student +46%. On a winning short, he drops to a smaller timeframe and moves the stop above each new supply left by a strong red candle.",
      analogy: "Like a fire exit door that always opens when you push it - not one that opens only if someone is waiting outside."
    },
    bigIdeas: [
      "Protect with stop-market orders; never stop-limit.",
      "Size = (1% of account) / stop distance.",
      "Trail on a smaller timeframe: stop just beyond each new supply (or demand) a strong candle leaves."
    ],
    steps: [
      {
        title: "Short at supply, stop-market above",
        narration: "Sell at the bottom line of supply. The protective buy stop is a stop-market order just above the top line, where price could not go.",
        scene: {
          candles: [
            { o: 140, h: 142.64, l: 139.8, c: 142.4 },
            { o: 142.4, h: 143.81, l: 142.22, c: 143.68 },
            { o: 143.68, h: 146.41, l: 143.33, c: 146 },
            { o: 146, h: 148.29, l: 145.8, c: 148 },
            { o: 148, h: 148.73, l: 147.55, c: 148.21 },
            { o: 148.21, h: 148.85, l: 147.4, c: 148.05 },
            { o: 148.05, h: 148.16, l: 143.16, c: 143.32 },
            { o: 143.32, h: 143.45, l: 138.6, c: 138.77 },
            { o: 138.77, h: 138.96, l: 133.93, c: 134.05 },
            { o: 134.05, h: 134.85, l: 133.68, c: 134.23 },
            { o: 134.23, h: 134.74, l: 133.59, c: 134.06 },
            { o: 134.06, h: 136.32, l: 133.87, c: 136.2 },
            { o: 136.2, h: 138.26, l: 136.06, c: 138.06 },
            { o: 138.06, h: 141.33, l: 137.77, c: 141.16 },
            { o: 141.16, h: 144.34, l: 140.82, c: 144.15 },
            { o: 144.15, h: 147.88, l: 143.93, c: 147.5 },
            { o: 147.5, h: 148.43, l: 146.95, c: 147.2 },
            { o: 147.2, h: 147.27, l: 144.94, c: 145.03 },
            { o: 145.03, h: 145.14, l: 142.64, c: 142.7 },
            { o: 142.7, h: 143.51, l: 142.1, c: 143.1 },
            { o: 143.1, h: 143.52, l: 142.29, c: 142.79 },
            { o: 142.79, h: 142.98, l: 140.26, c: 140.34 },
            { o: 140.34, h: 140.45, l: 138.07, c: 138.29 },
            { o: 138.29, h: 139.21, l: 137.88, c: 138.78 },
            { o: 138.78, h: 139.2, l: 137.78, c: 138.28 },
            { o: 138.28, h: 138.51, l: 135.96, c: 136.33 },
            { o: 136.33, h: 136.62, l: 133.51, c: 133.83 }
          ],
          zones: [
            { from: 4, top: 148.85, bottom: 148, kind: "supply", label: "Supply" },
            { from: 9, top: 134.23, bottom: 133.59, kind: "demand", label: "Target: demand" }
          ],
          lines: [
            { y: 148, label: "Entry (proximal)", kind: "entry" },
            { y: 149.15, label: "Stop beyond distal", kind: "sl" },
            { y: 134.23, label: "Target: opposing level", kind: "tp" }
          ],
          reveal: 17
        }
      },
      {
        title: "Strong candle, new supply",
        narration: "A strong red candle drives price down and leaves a small pause: new supply at its origin. Move the stop to just above it.",
        scene: {
          candles: [
            { o: 140, h: 142.64, l: 139.8, c: 142.4 },
            { o: 142.4, h: 143.81, l: 142.22, c: 143.68 },
            { o: 143.68, h: 146.41, l: 143.33, c: 146 },
            { o: 146, h: 148.29, l: 145.8, c: 148 },
            { o: 148, h: 148.73, l: 147.55, c: 148.21 },
            { o: 148.21, h: 148.85, l: 147.4, c: 148.05 },
            { o: 148.05, h: 148.16, l: 143.16, c: 143.32 },
            { o: 143.32, h: 143.45, l: 138.6, c: 138.77 },
            { o: 138.77, h: 138.96, l: 133.93, c: 134.05 },
            { o: 134.05, h: 134.85, l: 133.68, c: 134.23 },
            { o: 134.23, h: 134.74, l: 133.59, c: 134.06 },
            { o: 134.06, h: 136.32, l: 133.87, c: 136.2 },
            { o: 136.2, h: 138.26, l: 136.06, c: 138.06 },
            { o: 138.06, h: 141.33, l: 137.77, c: 141.16 },
            { o: 141.16, h: 144.34, l: 140.82, c: 144.15 },
            { o: 144.15, h: 147.88, l: 143.93, c: 147.5 },
            { o: 147.5, h: 148.43, l: 146.95, c: 147.2 },
            { o: 147.2, h: 147.27, l: 144.94, c: 145.03 },
            { o: 145.03, h: 145.14, l: 142.64, c: 142.7 },
            { o: 142.7, h: 143.51, l: 142.1, c: 143.1 },
            { o: 143.1, h: 143.52, l: 142.29, c: 142.79 },
            { o: 142.79, h: 142.98, l: 140.26, c: 140.34 },
            { o: 140.34, h: 140.45, l: 138.07, c: 138.29 },
            { o: 138.29, h: 139.21, l: 137.88, c: 138.78 },
            { o: 138.78, h: 139.2, l: 137.78, c: 138.28 },
            { o: 138.28, h: 138.51, l: 135.96, c: 136.33 },
            { o: 136.33, h: 136.62, l: 133.51, c: 133.83 }
          ],
          zones: [
            { from: 4, top: 148.85, bottom: 148, kind: "supply", label: "Supply" },
            { from: 9, top: 134.23, bottom: 133.59, kind: "demand", label: "Target: demand" }
          ],
          lines: [
            { y: 148, label: "Entry (proximal)", kind: "entry" },
            { y: 149.15, label: "Stop beyond distal", kind: "sl" },
            { y: 134.23, label: "Target: opposing level", kind: "tp" },
            { y: 143.82, label: "Trailed stop 1", kind: "sl", from: 20 }
          ],
          highlight: { from: 19, to: 20, label: "new supply" },
          reveal: 21
        }
      },
      {
        title: "Again",
        narration: "Another strong decline, another pause. Move the stop down again. A weak market should not rally back through these levels.",
        scene: {
          candles: [
            { o: 140, h: 142.64, l: 139.8, c: 142.4 },
            { o: 142.4, h: 143.81, l: 142.22, c: 143.68 },
            { o: 143.68, h: 146.41, l: 143.33, c: 146 },
            { o: 146, h: 148.29, l: 145.8, c: 148 },
            { o: 148, h: 148.73, l: 147.55, c: 148.21 },
            { o: 148.21, h: 148.85, l: 147.4, c: 148.05 },
            { o: 148.05, h: 148.16, l: 143.16, c: 143.32 },
            { o: 143.32, h: 143.45, l: 138.6, c: 138.77 },
            { o: 138.77, h: 138.96, l: 133.93, c: 134.05 },
            { o: 134.05, h: 134.85, l: 133.68, c: 134.23 },
            { o: 134.23, h: 134.74, l: 133.59, c: 134.06 },
            { o: 134.06, h: 136.32, l: 133.87, c: 136.2 },
            { o: 136.2, h: 138.26, l: 136.06, c: 138.06 },
            { o: 138.06, h: 141.33, l: 137.77, c: 141.16 },
            { o: 141.16, h: 144.34, l: 140.82, c: 144.15 },
            { o: 144.15, h: 147.88, l: 143.93, c: 147.5 },
            { o: 147.5, h: 148.43, l: 146.95, c: 147.2 },
            { o: 147.2, h: 147.27, l: 144.94, c: 145.03 },
            { o: 145.03, h: 145.14, l: 142.64, c: 142.7 },
            { o: 142.7, h: 143.51, l: 142.1, c: 143.1 },
            { o: 143.1, h: 143.52, l: 142.29, c: 142.79 },
            { o: 142.79, h: 142.98, l: 140.26, c: 140.34 },
            { o: 140.34, h: 140.45, l: 138.07, c: 138.29 },
            { o: 138.29, h: 139.21, l: 137.88, c: 138.78 },
            { o: 138.78, h: 139.2, l: 137.78, c: 138.28 },
            { o: 138.28, h: 138.51, l: 135.96, c: 136.33 },
            { o: 136.33, h: 136.62, l: 133.51, c: 133.83 }
          ],
          zones: [
            { from: 4, top: 148.85, bottom: 148, kind: "supply", label: "Supply" },
            { from: 9, top: 134.23, bottom: 133.59, kind: "demand", label: "Target: demand" }
          ],
          lines: [
            { y: 148, label: "Entry (proximal)", kind: "entry" },
            { y: 149.15, label: "Stop beyond distal", kind: "sl" },
            { y: 134.23, label: "Target: opposing level", kind: "tp" },
            { y: 143.82, label: "Trailed stop 1", kind: "sl", from: 20 },
            { y: 139.51, label: "Trailed stop 2", kind: "sl", from: 24 }
          ],
          highlight: { from: 23, to: 24, label: "new supply" },
          reveal: 25
        }
      },
      {
        title: "Target reached",
        narration: "Price reaches the demand target. The trailing stops protected profit without giving much back.",
        scene: {
          candles: [
            { o: 140, h: 142.64, l: 139.8, c: 142.4 },
            { o: 142.4, h: 143.81, l: 142.22, c: 143.68 },
            { o: 143.68, h: 146.41, l: 143.33, c: 146 },
            { o: 146, h: 148.29, l: 145.8, c: 148 },
            { o: 148, h: 148.73, l: 147.55, c: 148.21 },
            { o: 148.21, h: 148.85, l: 147.4, c: 148.05 },
            { o: 148.05, h: 148.16, l: 143.16, c: 143.32 },
            { o: 143.32, h: 143.45, l: 138.6, c: 138.77 },
            { o: 138.77, h: 138.96, l: 133.93, c: 134.05 },
            { o: 134.05, h: 134.85, l: 133.68, c: 134.23 },
            { o: 134.23, h: 134.74, l: 133.59, c: 134.06 },
            { o: 134.06, h: 136.32, l: 133.87, c: 136.2 },
            { o: 136.2, h: 138.26, l: 136.06, c: 138.06 },
            { o: 138.06, h: 141.33, l: 137.77, c: 141.16 },
            { o: 141.16, h: 144.34, l: 140.82, c: 144.15 },
            { o: 144.15, h: 147.88, l: 143.93, c: 147.5 },
            { o: 147.5, h: 148.43, l: 146.95, c: 147.2 },
            { o: 147.2, h: 147.27, l: 144.94, c: 145.03 },
            { o: 145.03, h: 145.14, l: 142.64, c: 142.7 },
            { o: 142.7, h: 143.51, l: 142.1, c: 143.1 },
            { o: 143.1, h: 143.52, l: 142.29, c: 142.79 },
            { o: 142.79, h: 142.98, l: 140.26, c: 140.34 },
            { o: 140.34, h: 140.45, l: 138.07, c: 138.29 },
            { o: 138.29, h: 139.21, l: 137.88, c: 138.78 },
            { o: 138.78, h: 139.2, l: 137.78, c: 138.28 },
            { o: 138.28, h: 138.51, l: 135.96, c: 136.33 },
            { o: 136.33, h: 136.62, l: 133.51, c: 133.83 }
          ],
          zones: [
            { from: 4, top: 148.85, bottom: 148, kind: "supply", label: "Supply" },
            { from: 9, top: 134.23, bottom: 133.59, kind: "demand", label: "Target: demand" }
          ],
          lines: [
            { y: 148, label: "Entry (proximal)", kind: "entry" },
            { y: 149.15, label: "Stop beyond distal", kind: "sl" },
            { y: 134.23, label: "Target: opposing level", kind: "tp" },
            { y: 143.82, label: "Trailed stop 1", kind: "sl", from: 20 },
            { y: 139.51, label: "Trailed stop 2", kind: "sl", from: 24 }
          ],
          notes: [
            { x: 26, y: 132.11, text: "Profit target" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which order does Seiden use for protection?",
        options: ["Stop-limit", "Stop-market", "No stop", "A mental stop"],
        answer: 1,
        explain: "A stop-market almost guarantees the exit (price may slip). A stop-limit may never fill."
      },
      {
        type: "mcq",
        q: "$100,000 account, risk 1%, entry $22.30, stop $21.90. How many shares?",
        options: ["1,000", "2,500", "5,000", "10,000"],
        answer: 1,
        explain: "Risk $1,000 / $0.40 stop = 2,500 shares."
      },
      {
        type: "spot",
        q: "Click the pause that becomes the first new supply for trailing the stop.",
        scene: {
          candles: [
            { o: 140, h: 142.64, l: 139.8, c: 142.4 },
            { o: 142.4, h: 143.81, l: 142.22, c: 143.68 },
            { o: 143.68, h: 146.41, l: 143.33, c: 146 },
            { o: 146, h: 148.29, l: 145.8, c: 148 },
            { o: 148, h: 148.73, l: 147.55, c: 148.21 },
            { o: 148.21, h: 148.85, l: 147.4, c: 148.05 },
            { o: 148.05, h: 148.16, l: 143.16, c: 143.32 },
            { o: 143.32, h: 143.45, l: 138.6, c: 138.77 },
            { o: 138.77, h: 138.96, l: 133.93, c: 134.05 },
            { o: 134.05, h: 134.85, l: 133.68, c: 134.23 },
            { o: 134.23, h: 134.74, l: 133.59, c: 134.06 },
            { o: 134.06, h: 136.32, l: 133.87, c: 136.2 },
            { o: 136.2, h: 138.26, l: 136.06, c: 138.06 },
            { o: 138.06, h: 141.33, l: 137.77, c: 141.16 },
            { o: 141.16, h: 144.34, l: 140.82, c: 144.15 },
            { o: 144.15, h: 147.88, l: 143.93, c: 147.5 },
            { o: 147.5, h: 148.43, l: 146.95, c: 147.2 },
            { o: 147.2, h: 147.27, l: 144.94, c: 145.03 },
            { o: 145.03, h: 145.14, l: 142.64, c: 142.7 },
            { o: 142.7, h: 143.51, l: 142.1, c: 143.1 },
            { o: 143.1, h: 143.52, l: 142.29, c: 142.79 },
            { o: 142.79, h: 142.98, l: 140.26, c: 140.34 },
            { o: 140.34, h: 140.45, l: 138.07, c: 138.29 },
            { o: 138.29, h: 139.21, l: 137.88, c: 138.78 },
            { o: 138.78, h: 139.2, l: 137.78, c: 138.28 },
            { o: 138.28, h: 138.51, l: 135.96, c: 136.33 },
            { o: 136.33, h: 136.62, l: 133.51, c: 133.83 }
          ],
          zones: [
            { from: 4, top: 148.85, bottom: 148, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 19, to: 20 },
        explain: "The small pause after the first strong red candle. The stop goes just above it."
      },
      {
        type: "tf",
        q: "A 29% win rate can still produce a big profit if losses are small.",
        answer: true,
        explain: "The student made +46.79% with a 29.17% win rate because average win was about 9.5x the average loss."
      },
      {
        type: "order",
        q: "Order the four trade outcomes from best to worst.",
        items: ["Big win", "Small win", "Small loss", "Big loss (the one to eliminate)"],
        explain: "Eliminate the big loss and you can live with the other three."
      }
    ],
    practice: [
      {
        prompt: "Long at demand, account $100,000, 1% risk. Pick entry, stop and target for the bracket.",
        scene: {
          candles: [
            { o: 156, h: 156.43, l: 153.56, c: 153.78 },
            { o: 153.78, h: 153.95, l: 151.84, c: 152.22 },
            { o: 152.22, h: 152.35, l: 150.02, c: 150.27 },
            { o: 150.27, h: 150.58, l: 148.44, c: 148.74 },
            { o: 148.74, h: 149.12, l: 146.55, c: 147 },
            { o: 147, h: 147.35, l: 145.55, c: 146 },
            { o: 146, h: 148.2, l: 145.47, c: 147.77 },
            { o: 147.77, h: 148.16, l: 146.5, c: 147.01 },
            { o: 147.01, h: 153.3, l: 146.93, c: 153.13 },
            { o: 153.13, h: 159.22, l: 153.04, c: 159.01 },
            { o: 159.01, h: 160.74, l: 158.72, c: 160.33 },
            { o: 160.33, h: 162.15, l: 160.01, c: 162.01 },
            { o: 162.01, h: 162.49, l: 161.49, c: 161.8 },
            { o: 161.8, h: 162.56, l: 161.17, c: 162.05 },
            { o: 162.05, h: 162.11, l: 159.87, c: 160.02 },
            { o: 160.02, h: 160.16, l: 157.92, c: 158.05 },
            { o: 158.05, h: 158.15, l: 155.45, c: 155.61 },
            { o: 155.61, h: 155.71, l: 153.26, c: 153.4 },
            { o: 153.4, h: 153.47, l: 150.6, c: 150.7 },
            { o: 150.7, h: 150.88, l: 148.2, c: 148.27 },
            { o: 148.27, h: 148.92, l: 146.51, c: 148.67 },
            { o: 148.67, h: 151.94, l: 148.38, c: 151.53 },
            { o: 151.53, h: 153.95, l: 151.13, c: 153.72 },
            { o: 153.72, h: 157, l: 153.58, c: 156.62 },
            { o: 156.62, h: 160.03, l: 156.4, c: 159.61 },
            { o: 159.61, h: 162.43, l: 159.25, c: 162.2 }
          ],
          zones: [
            { from: 5, top: 147.77, bottom: 145.47, kind: "demand", label: "Demand" },
            { from: 12, top: 162.56, bottom: 161.8, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "pick-entry",
        answer: { entry: 147.77, sl: 145.17, tp: 161.8 },
        explain: "Buy at the top of the zone, stop-market just below it, target the supply. Size = $1,000 / (entry - stop)."
      }
    ],
    cards: [
      {
        front: "Stop-market vs stop-limit?",
        back: "Stop-market: exit almost guaranteed. Stop-limit: price control, no guaranteed exit."
      },
      { front: "Max risk per trade?", back: "1% of the account." },
      { front: "Position size formula?", back: "Dollar risk / stop distance." },
      { front: "$1,000 risk, $0.40 stop?", back: "2,500 shares." },
      {
        front: "How to trail a short?",
        back: "Smaller timeframe; stop just above each new supply from a strong red candle."
      },
      { front: "Best traders are...?", back: "Very professional losers." }
    ],
    mnemonic: "Market stop, one percent, small losses: the three locks on your account."
  },
  {
    mentor: "seiden",
    n: 150,
    eli5: {
      oneLiner: "Bad news that pushes price into demand is a buying chance.",
      story: "New traders think bad news means price must fall. One morning a jobs report was much worse than expected, and traders rushed to sell. But they sold after a drop and straight into a demand level Seiden had drawn the day before. Once the last seller sold, price shot higher. The news was simply the invitation for sellers to make a novice move.",
      analogy: "Like a storm warning that makes everyone sell their umbrellas cheap - right before it rains."
    },
    bigIdeas: [
      "Draw levels before the news; let the news deliver price to them.",
      "Bad news into demand = buy. Only sell on bad news if price is at supply.",
      "Filter the news through the objective supply and demand picture."
    ],
    steps: [
      {
        title: "Demand drawn in advance",
        narration: "A drop-base-rally: the base is demand, drawn before any news.",
        scene: {
          candles: [
            { o: 156, h: 156.34, l: 153.22, c: 153.55 },
            { o: 153.55, h: 153.94, l: 150.9, c: 151.18 },
            { o: 151.18, h: 151.49, l: 147.87, c: 148.28 },
            { o: 148.28, h: 148.41, l: 145.83, c: 146 },
            { o: 146, h: 146.63, l: 145.31, c: 145.64 },
            { o: 145.64, h: 147.35, l: 145.17, c: 146.75 },
            { o: 146.75, h: 147.29, l: 145.52, c: 145.94 },
            { o: 145.94, h: 150.22, l: 145.82, c: 150.12 },
            { o: 150.12, h: 154.17, l: 150.05, c: 154.07 },
            { o: 154.07, h: 158.12, l: 153.87, c: 157.94 },
            { o: 157.94, h: 158.21, l: 154.92, c: 155.31 },
            { o: 155.31, h: 157.28, l: 154.8, c: 156.97 },
            { o: 156.97, h: 157.34, l: 152.53, c: 152.91 },
            { o: 152.91, h: 155, l: 152.58, c: 154.57 },
            { o: 154.57, h: 154.97, l: 151.48, c: 151.94 },
            { o: 151.94, h: 152.14, l: 149.57, c: 149.78 },
            { o: 149.78, h: 149.91, l: 147.04, c: 147.15 },
            { o: 147.15, h: 148, l: 146.12, c: 147.75 },
            { o: 147.75, h: 150.32, l: 147.5, c: 150.07 },
            { o: 150.07, h: 154.06, l: 149.68, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.4, c: 155.83 },
            { o: 155.83, h: 159.43, l: 155.68, c: 159.07 },
            { o: 159.07, h: 161.89, l: 158.7, c: 161.75 }
          ],
          zones: [
            { from: 4, top: 146.75, bottom: 145.17, kind: "demand", label: "DBR demand" }
          ],
          reveal: 10
        }
      },
      {
        title: "Drift back",
        narration: "Price drifts lower over a few days. Nothing special yet.",
        scene: {
          candles: [
            { o: 156, h: 156.34, l: 153.22, c: 153.55 },
            { o: 153.55, h: 153.94, l: 150.9, c: 151.18 },
            { o: 151.18, h: 151.49, l: 147.87, c: 148.28 },
            { o: 148.28, h: 148.41, l: 145.83, c: 146 },
            { o: 146, h: 146.63, l: 145.31, c: 145.64 },
            { o: 145.64, h: 147.35, l: 145.17, c: 146.75 },
            { o: 146.75, h: 147.29, l: 145.52, c: 145.94 },
            { o: 145.94, h: 150.22, l: 145.82, c: 150.12 },
            { o: 150.12, h: 154.17, l: 150.05, c: 154.07 },
            { o: 154.07, h: 158.12, l: 153.87, c: 157.94 },
            { o: 157.94, h: 158.21, l: 154.92, c: 155.31 },
            { o: 155.31, h: 157.28, l: 154.8, c: 156.97 },
            { o: 156.97, h: 157.34, l: 152.53, c: 152.91 },
            { o: 152.91, h: 155, l: 152.58, c: 154.57 },
            { o: 154.57, h: 154.97, l: 151.48, c: 151.94 },
            { o: 151.94, h: 152.14, l: 149.57, c: 149.78 },
            { o: 149.78, h: 149.91, l: 147.04, c: 147.15 },
            { o: 147.15, h: 148, l: 146.12, c: 147.75 },
            { o: 147.75, h: 150.32, l: 147.5, c: 150.07 },
            { o: 150.07, h: 154.06, l: 149.68, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.4, c: 155.83 },
            { o: 155.83, h: 159.43, l: 155.68, c: 159.07 },
            { o: 159.07, h: 161.89, l: 158.7, c: 161.75 }
          ],
          zones: [
            { from: 4, top: 146.75, bottom: 145.17, kind: "demand", label: "DBR demand" }
          ],
          highlight: { from: 10, to: 14, label: "drift" },
          reveal: 15
        }
      },
      {
        title: "The bad news",
        narration: "A terrible report hits. Sellers dump after a drop, straight into the top of demand.",
        scene: {
          candles: [
            { o: 156, h: 156.34, l: 153.22, c: 153.55 },
            { o: 153.55, h: 153.94, l: 150.9, c: 151.18 },
            { o: 151.18, h: 151.49, l: 147.87, c: 148.28 },
            { o: 148.28, h: 148.41, l: 145.83, c: 146 },
            { o: 146, h: 146.63, l: 145.31, c: 145.64 },
            { o: 145.64, h: 147.35, l: 145.17, c: 146.75 },
            { o: 146.75, h: 147.29, l: 145.52, c: 145.94 },
            { o: 145.94, h: 150.22, l: 145.82, c: 150.12 },
            { o: 150.12, h: 154.17, l: 150.05, c: 154.07 },
            { o: 154.07, h: 158.12, l: 153.87, c: 157.94 },
            { o: 157.94, h: 158.21, l: 154.92, c: 155.31 },
            { o: 155.31, h: 157.28, l: 154.8, c: 156.97 },
            { o: 156.97, h: 157.34, l: 152.53, c: 152.91 },
            { o: 152.91, h: 155, l: 152.58, c: 154.57 },
            { o: 154.57, h: 154.97, l: 151.48, c: 151.94 },
            { o: 151.94, h: 152.14, l: 149.57, c: 149.78 },
            { o: 149.78, h: 149.91, l: 147.04, c: 147.15 },
            { o: 147.15, h: 148, l: 146.12, c: 147.75 },
            { o: 147.75, h: 150.32, l: 147.5, c: 150.07 },
            { o: 150.07, h: 154.06, l: 149.68, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.4, c: 155.83 },
            { o: 155.83, h: 159.43, l: 155.68, c: 159.07 },
            { o: 159.07, h: 161.89, l: 158.7, c: 161.75 }
          ],
          zones: [
            { from: 4, top: 146.75, bottom: 145.17, kind: "demand", label: "DBR demand" }
          ],
          lines: [
            { y: 146.75, label: "Entry (proximal)", kind: "entry" },
            { y: 144.87, label: "Stop beyond distal", kind: "sl" }
          ],
          highlight: { from: 15, to: 16, label: "bad news" },
          reveal: 18
        }
      },
      {
        title: "The last seller sells",
        narration: "Once the last seller sells, buyers take over and price shoots higher.",
        scene: {
          candles: [
            { o: 156, h: 156.34, l: 153.22, c: 153.55 },
            { o: 153.55, h: 153.94, l: 150.9, c: 151.18 },
            { o: 151.18, h: 151.49, l: 147.87, c: 148.28 },
            { o: 148.28, h: 148.41, l: 145.83, c: 146 },
            { o: 146, h: 146.63, l: 145.31, c: 145.64 },
            { o: 145.64, h: 147.35, l: 145.17, c: 146.75 },
            { o: 146.75, h: 147.29, l: 145.52, c: 145.94 },
            { o: 145.94, h: 150.22, l: 145.82, c: 150.12 },
            { o: 150.12, h: 154.17, l: 150.05, c: 154.07 },
            { o: 154.07, h: 158.12, l: 153.87, c: 157.94 },
            { o: 157.94, h: 158.21, l: 154.92, c: 155.31 },
            { o: 155.31, h: 157.28, l: 154.8, c: 156.97 },
            { o: 156.97, h: 157.34, l: 152.53, c: 152.91 },
            { o: 152.91, h: 155, l: 152.58, c: 154.57 },
            { o: 154.57, h: 154.97, l: 151.48, c: 151.94 },
            { o: 151.94, h: 152.14, l: 149.57, c: 149.78 },
            { o: 149.78, h: 149.91, l: 147.04, c: 147.15 },
            { o: 147.15, h: 148, l: 146.12, c: 147.75 },
            { o: 147.75, h: 150.32, l: 147.5, c: 150.07 },
            { o: 150.07, h: 154.06, l: 149.68, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.4, c: 155.83 },
            { o: 155.83, h: 159.43, l: 155.68, c: 159.07 },
            { o: 159.07, h: 161.89, l: 158.7, c: 161.75 }
          ],
          zones: [
            { from: 4, top: 146.75, bottom: 145.17, kind: "demand", label: "DBR demand" }
          ],
          lines: [
            { y: 146.75, label: "Entry (proximal)", kind: "entry" },
            { y: 144.87, label: "Stop beyond distal", kind: "sl" }
          ],
          notes: [
            { x: 17, y: 144.72, text: "Buying opportunity" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Bad news means price must fall.",
        answer: false,
        explain: "Bad news that pushes price into demand often marks a turn up."
      },
      {
        type: "spot",
        q: "Click the news candle that delivers price into demand.",
        scene: {
          candles: [
            { o: 156, h: 156.34, l: 153.22, c: 153.55 },
            { o: 153.55, h: 153.94, l: 150.9, c: 151.18 },
            { o: 151.18, h: 151.49, l: 147.87, c: 148.28 },
            { o: 148.28, h: 148.41, l: 145.83, c: 146 },
            { o: 146, h: 146.63, l: 145.31, c: 145.64 },
            { o: 145.64, h: 147.35, l: 145.17, c: 146.75 },
            { o: 146.75, h: 147.29, l: 145.52, c: 145.94 },
            { o: 145.94, h: 150.22, l: 145.82, c: 150.12 },
            { o: 150.12, h: 154.17, l: 150.05, c: 154.07 },
            { o: 154.07, h: 158.12, l: 153.87, c: 157.94 },
            { o: 157.94, h: 158.21, l: 154.92, c: 155.31 },
            { o: 155.31, h: 157.28, l: 154.8, c: 156.97 },
            { o: 156.97, h: 157.34, l: 152.53, c: 152.91 },
            { o: 152.91, h: 155, l: 152.58, c: 154.57 },
            { o: 154.57, h: 154.97, l: 151.48, c: 151.94 },
            { o: 151.94, h: 152.14, l: 149.57, c: 149.78 },
            { o: 149.78, h: 149.91, l: 147.04, c: 147.15 },
            { o: 147.15, h: 148, l: 146.12, c: 147.75 },
            { o: 147.75, h: 150.32, l: 147.5, c: 150.07 },
            { o: 150.07, h: 154.06, l: 149.68, c: 153.65 },
            { o: 153.65, h: 156.17, l: 153.4, c: 155.83 },
            { o: 155.83, h: 159.43, l: 155.68, c: 159.07 },
            { o: 159.07, h: 161.89, l: 158.7, c: 161.75 }
          ],
          zones: [
            { from: 4, top: 146.75, bottom: 145.17, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 15, to: 16 },
        explain: "The bad-news selling drove price straight into the pre-drawn demand."
      },
      {
        type: "mcq",
        q: "When is selling on bad news OK in Seiden's view?",
        options: ["Always", "Only if price is at supply", "Never", "Only on Fridays"],
        answer: 1,
        explain: "Filter the news through the chart: sell at supply, buy at demand."
      },
      {
        type: "mcq",
        q: "What did the jobs-report sellers do wrong?",
        options: [
          "They used stops",
          "They sold after a drop and into demand",
          "They waited",
          "They bought"
        ],
        answer: 1,
        explain: "Both novice mistakes on the sell side."
      },
      {
        type: "order",
        q: "Order the chain.",
        items: [
          "News creates perceptions",
          "Perceptions create trades",
          "Trades become candles at a price"
        ],
        explain: "All influences are reflected in price."
      }
    ],
    practice: [
      {
        prompt: "Great news sends price racing up into a supply level drawn days ago. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 144, h: 145.95, l: 143.81, c: 145.53 },
            { o: 145.53, h: 148.57, l: 145.4, c: 148.29 },
            { o: 148.29, h: 150.35, l: 148.17, c: 150.16 },
            { o: 150.16, h: 152.36, l: 149.75, c: 152.23 },
            { o: 152.23, h: 154.32, l: 151.96, c: 154 },
            { o: 154, h: 155.42, l: 153.31, c: 155.01 },
            { o: 155.01, h: 155.54, l: 152.68, c: 153.22 },
            { o: 153.22, h: 154.34, l: 152.86, c: 153.9 },
            { o: 153.9, h: 153.98, l: 149.71, c: 149.89 },
            { o: 149.89, h: 149.97, l: 145.73, c: 145.95 },
            { o: 145.95, h: 146.04, l: 141.84, c: 141.9 },
            { o: 141.9, h: 142.26, l: 140.21, c: 140.91 },
            { o: 140.91, h: 141.23, l: 140.62, c: 140.97 },
            { o: 140.97, h: 141.94, l: 140.66, c: 141.71 },
            { o: 141.71, h: 142.11, l: 140.49, c: 140.9 },
            { o: 140.9, h: 147.54, l: 140.71, c: 147.4 },
            { o: 147.4, h: 152.88, l: 147.2, c: 152.72 },
            { o: 152.72, h: 154.5, l: 152.07, c: 152.32 },
            { o: 152.32, h: 152.64, l: 150.44, c: 150.8 },
            { o: 150.8, h: 151.11, l: 148.65, c: 148.87 },
            { o: 148.87, h: 149.29, l: 146.52, c: 146.93 },
            { o: 146.93, h: 147.36, l: 145.23, c: 145.46 },
            { o: 145.46, h: 145.61, l: 143.14, c: 143.32 }
          ],
          zones: [
            { from: 5, top: 155.54, bottom: 153.22, kind: "supply", label: "Supply" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Good news delivered buyers after a rally into supply. Sell at the zone, stop above. Price turned down."
      }
    ],
    cards: [
      { front: "Bad news into demand?", back: "A buying opportunity." },
      { front: "When are levels drawn?", back: "Before the news." },
      { front: "Sell on bad news only if...?", back: "Price is at supply." },
      { front: "What is the news, really?", back: "An invitation for novices to act." },
      { front: "Filter the news through what?", back: "The objective supply and demand equation." }
    ],
    mnemonic: "Storm sale: buy the umbrellas people dump on bad news."
  },
  {
    mentor: "seiden",
    n: 154,
    eli5: {
      oneLiner: "Look for the strong move first, then trace it back to where it started.",
      story: "Most trading problems - stops, management - are really bad entries. Many traders hunt for bases, but small pauses are everywhere, so they find lots of poor levels. Seiden flips it: first find B, the strong momentum move. Then follow it back to its origin, A. That is the key level. Buy the first revisit, C, and target the opposing level, D.",
      analogy: "Like finding a river by its rushing water, then walking upstream to the spring where it starts."
    },
    bigIdeas: [
      "Almost every trading problem is really a poor entry.",
      "Step 1: find a strong momentum move. Step 2: go to its origin.",
      "A base, B strong move, C first revisit (entry), D opposing level (target)."
    ],
    steps: [
      {
        title: "B first: the strong move",
        narration: "Do not start by hunting bases. First find the strong move - this rally of big green candles.",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.7, l: 154.11, c: 154.55 },
            { o: 154.55, h: 154.97, l: 151.84, c: 152.16 },
            { o: 152.16, h: 152.52, l: 150.02, c: 150.44 },
            { o: 150.44, h: 150.63, l: 148.71, c: 149 },
            { o: 149, h: 149.64, l: 147.4, c: 148.08 },
            { o: 148.08, h: 149.8, l: 147.78, c: 149.19 },
            { o: 149.19, h: 149.5, l: 148.08, c: 148.71 },
            { o: 148.71, h: 149.57, l: 148.23, c: 148.92 },
            { o: 148.92, h: 153.16, l: 148.8, c: 153.1 },
            { o: 153.1, h: 157.6, l: 152.97, c: 157.41 },
            { o: 157.41, h: 162.13, l: 157.34, c: 161.92 },
            { o: 161.92, h: 162.94, l: 161.67, c: 162.74 },
            { o: 162.74, h: 164.17, l: 162.55, c: 163.92 },
            { o: 163.92, h: 164.25, l: 163.36, c: 163.76 },
            { o: 163.76, h: 164.41, l: 163.09, c: 163.84 },
            { o: 163.84, h: 163.93, l: 161.39, c: 161.52 },
            { o: 161.52, h: 161.73, l: 158.65, c: 158.84 },
            { o: 158.84, h: 159.25, l: 156.33, c: 156.63 },
            { o: 156.63, h: 157.03, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.25, l: 151.31, c: 151.45 },
            { o: 151.45, h: 151.78, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.34, l: 148.21, c: 150.09 },
            { o: 150.09, h: 153.72, l: 149.89, c: 153.39 },
            { o: 153.39, h: 156.3, l: 153.2, c: 156.04 },
            { o: 156.04, h: 158.74, l: 155.66, c: 158.52 },
            { o: 158.52, h: 161.53, l: 158.15, c: 161.14 },
            { o: 161.14, h: 164.38, l: 160.88, c: 164.16 }
          ],
          highlight: { from: 9, to: 11, label: "B: strong move" },
          reveal: 12
        }
      },
      {
        title: "A: follow it back to the origin",
        narration: "Trace B back to where it started: the base. That is the key level.",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.7, l: 154.11, c: 154.55 },
            { o: 154.55, h: 154.97, l: 151.84, c: 152.16 },
            { o: 152.16, h: 152.52, l: 150.02, c: 150.44 },
            { o: 150.44, h: 150.63, l: 148.71, c: 149 },
            { o: 149, h: 149.64, l: 147.4, c: 148.08 },
            { o: 148.08, h: 149.8, l: 147.78, c: 149.19 },
            { o: 149.19, h: 149.5, l: 148.08, c: 148.71 },
            { o: 148.71, h: 149.57, l: 148.23, c: 148.92 },
            { o: 148.92, h: 153.16, l: 148.8, c: 153.1 },
            { o: 153.1, h: 157.6, l: 152.97, c: 157.41 },
            { o: 157.41, h: 162.13, l: 157.34, c: 161.92 },
            { o: 161.92, h: 162.94, l: 161.67, c: 162.74 },
            { o: 162.74, h: 164.17, l: 162.55, c: 163.92 },
            { o: 163.92, h: 164.25, l: 163.36, c: 163.76 },
            { o: 163.76, h: 164.41, l: 163.09, c: 163.84 },
            { o: 163.84, h: 163.93, l: 161.39, c: 161.52 },
            { o: 161.52, h: 161.73, l: 158.65, c: 158.84 },
            { o: 158.84, h: 159.25, l: 156.33, c: 156.63 },
            { o: 156.63, h: 157.03, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.25, l: 151.31, c: 151.45 },
            { o: 151.45, h: 151.78, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.34, l: 148.21, c: 150.09 },
            { o: 150.09, h: 153.72, l: 149.89, c: 153.39 },
            { o: 153.39, h: 156.3, l: 153.2, c: 156.04 },
            { o: 156.04, h: 158.74, l: 155.66, c: 158.52 },
            { o: 158.52, h: 161.53, l: 158.15, c: 161.14 },
            { o: 161.14, h: 164.38, l: 160.88, c: 164.16 }
          ],
          zones: [
            { from: 5, top: 149.19, bottom: 147.4, kind: "demand", label: "A: origin" }
          ],
          reveal: 12
        }
      },
      {
        title: "D: the opposing level",
        narration: "Mark the opposing supply above as the target.",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.7, l: 154.11, c: 154.55 },
            { o: 154.55, h: 154.97, l: 151.84, c: 152.16 },
            { o: 152.16, h: 152.52, l: 150.02, c: 150.44 },
            { o: 150.44, h: 150.63, l: 148.71, c: 149 },
            { o: 149, h: 149.64, l: 147.4, c: 148.08 },
            { o: 148.08, h: 149.8, l: 147.78, c: 149.19 },
            { o: 149.19, h: 149.5, l: 148.08, c: 148.71 },
            { o: 148.71, h: 149.57, l: 148.23, c: 148.92 },
            { o: 148.92, h: 153.16, l: 148.8, c: 153.1 },
            { o: 153.1, h: 157.6, l: 152.97, c: 157.41 },
            { o: 157.41, h: 162.13, l: 157.34, c: 161.92 },
            { o: 161.92, h: 162.94, l: 161.67, c: 162.74 },
            { o: 162.74, h: 164.17, l: 162.55, c: 163.92 },
            { o: 163.92, h: 164.25, l: 163.36, c: 163.76 },
            { o: 163.76, h: 164.41, l: 163.09, c: 163.84 },
            { o: 163.84, h: 163.93, l: 161.39, c: 161.52 },
            { o: 161.52, h: 161.73, l: 158.65, c: 158.84 },
            { o: 158.84, h: 159.25, l: 156.33, c: 156.63 },
            { o: 156.63, h: 157.03, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.25, l: 151.31, c: 151.45 },
            { o: 151.45, h: 151.78, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.34, l: 148.21, c: 150.09 },
            { o: 150.09, h: 153.72, l: 149.89, c: 153.39 },
            { o: 153.39, h: 156.3, l: 153.2, c: 156.04 },
            { o: 156.04, h: 158.74, l: 155.66, c: 158.52 },
            { o: 158.52, h: 161.53, l: 158.15, c: 161.14 },
            { o: 161.14, h: 164.38, l: 160.88, c: 164.16 }
          ],
          zones: [
            { from: 5, top: 149.19, bottom: 147.4, kind: "demand", label: "A: origin" },
            { from: 14, top: 164.41, bottom: 163.76, kind: "supply", label: "D: target" }
          ],
          reveal: 18
        }
      },
      {
        title: "C: the first revisit",
        narration: "Price returns to A for the first time. Buy from the seller making both mistakes; target D.",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.7, l: 154.11, c: 154.55 },
            { o: 154.55, h: 154.97, l: 151.84, c: 152.16 },
            { o: 152.16, h: 152.52, l: 150.02, c: 150.44 },
            { o: 150.44, h: 150.63, l: 148.71, c: 149 },
            { o: 149, h: 149.64, l: 147.4, c: 148.08 },
            { o: 148.08, h: 149.8, l: 147.78, c: 149.19 },
            { o: 149.19, h: 149.5, l: 148.08, c: 148.71 },
            { o: 148.71, h: 149.57, l: 148.23, c: 148.92 },
            { o: 148.92, h: 153.16, l: 148.8, c: 153.1 },
            { o: 153.1, h: 157.6, l: 152.97, c: 157.41 },
            { o: 157.41, h: 162.13, l: 157.34, c: 161.92 },
            { o: 161.92, h: 162.94, l: 161.67, c: 162.74 },
            { o: 162.74, h: 164.17, l: 162.55, c: 163.92 },
            { o: 163.92, h: 164.25, l: 163.36, c: 163.76 },
            { o: 163.76, h: 164.41, l: 163.09, c: 163.84 },
            { o: 163.84, h: 163.93, l: 161.39, c: 161.52 },
            { o: 161.52, h: 161.73, l: 158.65, c: 158.84 },
            { o: 158.84, h: 159.25, l: 156.33, c: 156.63 },
            { o: 156.63, h: 157.03, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.25, l: 151.31, c: 151.45 },
            { o: 151.45, h: 151.78, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.34, l: 148.21, c: 150.09 },
            { o: 150.09, h: 153.72, l: 149.89, c: 153.39 },
            { o: 153.39, h: 156.3, l: 153.2, c: 156.04 },
            { o: 156.04, h: 158.74, l: 155.66, c: 158.52 },
            { o: 158.52, h: 161.53, l: 158.15, c: 161.14 },
            { o: 161.14, h: 164.38, l: 160.88, c: 164.16 }
          ],
          zones: [
            { from: 5, top: 149.19, bottom: 147.4, kind: "demand", label: "A: origin" },
            { from: 14, top: 164.41, bottom: 163.76, kind: "supply", label: "D: target" }
          ],
          lines: [
            { y: 149.19, label: "Entry (proximal)", kind: "entry" },
            { y: 147.1, label: "Stop beyond distal", kind: "sl" },
            { y: 163.76, label: "Target: opposing level", kind: "tp" }
          ],
          notes: [
            { x: 22, y: 146.81, text: "C" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What should you look for FIRST?",
        options: ["A base", "B: the strong momentum move", "A news story", "An indicator cross"],
        answer: 1,
        explain: "Bases are everywhere. The strong move tells you which base matters."
      },
      {
        type: "spot",
        q: "Click B, the strong move.",
        scene: {
          candles: [
            { o: 158, h: 158.37, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.7, l: 154.11, c: 154.55 },
            { o: 154.55, h: 154.97, l: 151.84, c: 152.16 },
            { o: 152.16, h: 152.52, l: 150.02, c: 150.44 },
            { o: 150.44, h: 150.63, l: 148.71, c: 149 },
            { o: 149, h: 149.64, l: 147.4, c: 148.08 },
            { o: 148.08, h: 149.8, l: 147.78, c: 149.19 },
            { o: 149.19, h: 149.5, l: 148.08, c: 148.71 },
            { o: 148.71, h: 149.57, l: 148.23, c: 148.92 },
            { o: 148.92, h: 153.16, l: 148.8, c: 153.1 },
            { o: 153.1, h: 157.6, l: 152.97, c: 157.41 },
            { o: 157.41, h: 162.13, l: 157.34, c: 161.92 },
            { o: 161.92, h: 162.94, l: 161.67, c: 162.74 },
            { o: 162.74, h: 164.17, l: 162.55, c: 163.92 },
            { o: 163.92, h: 164.25, l: 163.36, c: 163.76 },
            { o: 163.76, h: 164.41, l: 163.09, c: 163.84 },
            { o: 163.84, h: 163.93, l: 161.39, c: 161.52 },
            { o: 161.52, h: 161.73, l: 158.65, c: 158.84 },
            { o: 158.84, h: 159.25, l: 156.33, c: 156.63 },
            { o: 156.63, h: 157.03, l: 154.67, c: 154.82 },
            { o: 154.82, h: 155.25, l: 151.31, c: 151.45 },
            { o: 151.45, h: 151.78, l: 149.33, c: 149.69 },
            { o: 149.69, h: 150.34, l: 148.21, c: 150.09 },
            { o: 150.09, h: 153.72, l: 149.89, c: 153.39 },
            { o: 153.39, h: 156.3, l: 153.2, c: 156.04 },
            { o: 156.04, h: 158.74, l: 155.66, c: 158.52 },
            { o: 158.52, h: 161.53, l: 158.15, c: 161.14 },
            { o: 161.14, h: 164.38, l: 160.88, c: 164.16 }
          ]
        },
        answer: { from: 9, to: 11 },
        explain: "The big green candles leaving the base. Find this first, then trace it back."
      },
      {
        type: "order",
        q: "Order the A-B-C-D process as you do it.",
        items: [
          "Find B, the strong move",
          "Follow it back to its origin A",
          "Wait for C, the first revisit",
          "Target D, the opposing level"
        ],
        explain: "Strong move first, then origin, revisit and target."
      },
      {
        type: "tf",
        q: "Most stop and trade-management problems are really entry problems.",
        answer: true,
        explain: "Almost every trading problem is directly a function of poor entry points."
      },
      {
        type: "mcq",
        q: "Why is scanning for bases first a mistake?",
        options: [
          "Bases are rare",
          "Basing is everywhere, which leads to many poor levels",
          "Bases are always supply",
          "It takes too long"
        ],
        answer: 1,
        explain: "Only bases that launched a strong move matter."
      }
    ],
    practice: [
      {
        prompt: "QCOM-style: a strong drop (B) left a small base (A). Demand (D) sits below. Price rallies back into A. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 140, h: 141.8, l: 139.86, c: 141.46 },
            { o: 141.46, h: 143.51, l: 141.01, c: 143.36 },
            { o: 143.36, h: 145.41, l: 143.23, c: 145.06 },
            { o: 145.06, h: 147.52, l: 144.64, c: 147.19 },
            { o: 147.19, h: 149.23, l: 146.83, c: 149 },
            { o: 149, h: 150.1, l: 148.54, c: 149.43 },
            { o: 149.43, h: 149.76, l: 148.07, c: 148.57 },
            { o: 148.57, h: 149.39, l: 147.96, c: 149.04 },
            { o: 149.04, h: 149.21, l: 143.59, c: 143.64 },
            { o: 143.64, h: 143.73, l: 136.96, c: 137.04 },
            { o: 137.04, h: 137.37, l: 135.79, c: 136.1 },
            { o: 136.1, h: 136.5, l: 134.7, c: 135.04 },
            { o: 135.04, h: 135.61, l: 134.65, c: 135.29 },
            { o: 135.29, h: 135.68, l: 134.43, c: 135.06 },
            { o: 135.06, h: 137.18, l: 134.96, c: 137.11 },
            { o: 137.11, h: 139.13, l: 137.02, c: 139.06 },
            { o: 139.06, h: 141.55, l: 138.74, c: 141.22 },
            { o: 141.22, h: 144.32, l: 141, c: 143.9 },
            { o: 143.9, h: 146.16, l: 143.51, c: 145.92 },
            { o: 145.92, h: 148.47, l: 145.65, c: 148.07 },
            { o: 148.07, h: 149.41, l: 147.42, c: 147.67 },
            { o: 147.67, h: 147.99, l: 144.36, c: 144.64 },
            { o: 144.64, h: 144.77, l: 142.59, c: 142.86 },
            { o: 142.86, h: 143.13, l: 139.32, c: 139.73 },
            { o: 139.73, h: 140.13, l: 137.2, c: 137.49 },
            { o: 137.49, h: 137.68, l: 134.61, c: 134.89 }
          ],
          zones: [
            { from: 5, top: 150.1, bottom: 148.57, kind: "supply", label: "A: supply" },
            { from: 12, top: 135.29, bottom: 134.43, kind: "demand", label: "D: demand" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell", tp: 135.29 },
        explain: "Strong move first, origin A, first revisit C: sell at the lower line, stop above, target D."
      }
    ],
    cards: [
      { front: "First thing to look for?", back: "B: the strong move." },
      { front: "Where is the key level?", back: "At the origin (A) of the strong move." },
      { front: "C?", back: "The first revisit: the entry." },
      { front: "D?", back: "The opposing level: the target." },
      { front: "Real cause of most trading problems?", back: "Poor entry points." }
    ],
    mnemonic: "River to spring: find the rush (B), walk upstream to the source (A)."
  },
  {
    mentor: "seiden",
    n: 157,
    eli5: {
      oneLiner: "Scan top down: index, then sector, then a few stocks, all at the same level.",
      story: "Seiden started on the trading floor drawing charts by hand with coloured pencils. Later he tried every automated scanner and found it turned an easy job into hours of scrolling. So he went back to the old way. First, is the S&P near demand? Then, which big sectors are near demand too? Then, which few high-volume stocks in those sectors are near demand, with the most room to supply?",
      analogy: "Like checking the weather for the country, then your city, then your street before you plan a picnic."
    },
    bigIdeas: [
      "Top-down scan: index, then a few large sectors, then a handful of stocks.",
      "All layers should be at the same kind of level (all at demand for buys).",
      "Rank candidates by the largest profit margin. An unfilled gap origin can act as demand."
    ],
    steps: [
      {
        title: "Step 1: the index",
        narration: "The S&P based, then gapped up. The origin of that unfilled gap is demand.",
        scene: {
          candles: [
            { o: 148, h: 148.32, l: 146.01, c: 146.28 },
            { o: 146.28, h: 146.48, l: 142.71, c: 143.12 },
            { o: 143.12, h: 143.29, l: 141.14, c: 141.51 },
            { o: 141.51, h: 141.78, l: 138.57, c: 139 },
            { o: 139, h: 139.69, l: 138.27, c: 138.85 },
            { o: 138.85, h: 140.21, l: 138.29, c: 139.73 },
            { o: 139.73, h: 140.43, l: 138.76, c: 139.1 },
            { o: 141.5, h: 143.72, l: 141.39, c: 143.54 },
            { o: 143.54, h: 145.72, l: 143.34, c: 145.5 },
            { o: 145.5, h: 147.33, l: 145.36, c: 147 },
            { o: 147, h: 149.39, l: 146.77, c: 149.01 },
            { o: 149.01, h: 151.17, l: 148.83, c: 150.92 },
            { o: 150.92, h: 153.56, l: 150.65, c: 153.12 },
            { o: 153.12, h: 154.63, l: 152.96, c: 154.5 },
            { o: 154.5, h: 154.71, l: 151.87, c: 152.24 },
            { o: 152.24, h: 152.59, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.42, l: 147.19, c: 147.5 },
            { o: 139.29, h: 141.89, l: 138.99, c: 141.69 },
            { o: 141.69, h: 143.73, l: 141.34, c: 143.44 },
            { o: 143.44, h: 146.94, l: 143.09, c: 146.58 },
            { o: 146.58, h: 148.36, l: 146.43, c: 148.19 },
            { o: 148.19, h: 150.9, l: 147.94, c: 150.69 }
          ],
          zones: [
            { from: 4, top: 139.73, bottom: 138.27, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 139.73, label: "Gap origin", kind: "level" }
          ],
          reveal: 9
        }
      },
      {
        title: "Rally and pullback",
        narration: "Price rallies, then drops back toward the gap origin. The index is getting close to demand - time to look for buys.",
        scene: {
          candles: [
            { o: 148, h: 148.32, l: 146.01, c: 146.28 },
            { o: 146.28, h: 146.48, l: 142.71, c: 143.12 },
            { o: 143.12, h: 143.29, l: 141.14, c: 141.51 },
            { o: 141.51, h: 141.78, l: 138.57, c: 139 },
            { o: 139, h: 139.69, l: 138.27, c: 138.85 },
            { o: 138.85, h: 140.21, l: 138.29, c: 139.73 },
            { o: 139.73, h: 140.43, l: 138.76, c: 139.1 },
            { o: 141.5, h: 143.72, l: 141.39, c: 143.54 },
            { o: 143.54, h: 145.72, l: 143.34, c: 145.5 },
            { o: 145.5, h: 147.33, l: 145.36, c: 147 },
            { o: 147, h: 149.39, l: 146.77, c: 149.01 },
            { o: 149.01, h: 151.17, l: 148.83, c: 150.92 },
            { o: 150.92, h: 153.56, l: 150.65, c: 153.12 },
            { o: 153.12, h: 154.63, l: 152.96, c: 154.5 },
            { o: 154.5, h: 154.71, l: 151.87, c: 152.24 },
            { o: 152.24, h: 152.59, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.42, l: 147.19, c: 147.5 },
            { o: 139.29, h: 141.89, l: 138.99, c: 141.69 },
            { o: 141.69, h: 143.73, l: 141.34, c: 143.44 },
            { o: 143.44, h: 146.94, l: 143.09, c: 146.58 },
            { o: 146.58, h: 148.36, l: 146.43, c: 148.19 },
            { o: 148.19, h: 150.9, l: 147.94, c: 150.69 }
          ],
          zones: [
            { from: 4, top: 139.73, bottom: 138.27, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 139.73, label: "Gap origin", kind: "level" }
          ],
          highlight: { from: 14, to: 16, label: "back toward demand" },
          reveal: 17
        }
      },
      {
        title: "Steps 2 and 3",
        narration: "Check a few large sectors that are also near demand, then a handful of high-volume stocks in them. Pick those with the largest room to supply.",
        scene: {
          candles: [
            { o: 148, h: 148.32, l: 146.01, c: 146.28 },
            { o: 146.28, h: 146.48, l: 142.71, c: 143.12 },
            { o: 143.12, h: 143.29, l: 141.14, c: 141.51 },
            { o: 141.51, h: 141.78, l: 138.57, c: 139 },
            { o: 139, h: 139.69, l: 138.27, c: 138.85 },
            { o: 138.85, h: 140.21, l: 138.29, c: 139.73 },
            { o: 139.73, h: 140.43, l: 138.76, c: 139.1 },
            { o: 141.5, h: 143.72, l: 141.39, c: 143.54 },
            { o: 143.54, h: 145.72, l: 143.34, c: 145.5 },
            { o: 145.5, h: 147.33, l: 145.36, c: 147 },
            { o: 147, h: 149.39, l: 146.77, c: 149.01 },
            { o: 149.01, h: 151.17, l: 148.83, c: 150.92 },
            { o: 150.92, h: 153.56, l: 150.65, c: 153.12 },
            { o: 153.12, h: 154.63, l: 152.96, c: 154.5 },
            { o: 154.5, h: 154.71, l: 151.87, c: 152.24 },
            { o: 152.24, h: 152.59, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.42, l: 147.19, c: 147.5 },
            { o: 139.29, h: 141.89, l: 138.99, c: 141.69 },
            { o: 141.69, h: 143.73, l: 141.34, c: 143.44 },
            { o: 143.44, h: 146.94, l: 143.09, c: 146.58 },
            { o: 146.58, h: 148.36, l: 146.43, c: 148.19 },
            { o: 148.19, h: 150.9, l: 147.94, c: 150.69 }
          ],
          zones: [
            { from: 4, top: 139.73, bottom: 138.27, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 139.73, label: "Gap origin", kind: "level" }
          ],
          notes: [
            { x: 16, y: 145.79, text: "Sector + stocks at demand too" }
          ],
          reveal: 17
        }
      },
      {
        title: "The gap fills into demand",
        narration: "Price gaps down into the gap origin and buyers waiting there push it back up strongly.",
        scene: {
          candles: [
            { o: 148, h: 148.32, l: 146.01, c: 146.28 },
            { o: 146.28, h: 146.48, l: 142.71, c: 143.12 },
            { o: 143.12, h: 143.29, l: 141.14, c: 141.51 },
            { o: 141.51, h: 141.78, l: 138.57, c: 139 },
            { o: 139, h: 139.69, l: 138.27, c: 138.85 },
            { o: 138.85, h: 140.21, l: 138.29, c: 139.73 },
            { o: 139.73, h: 140.43, l: 138.76, c: 139.1 },
            { o: 141.5, h: 143.72, l: 141.39, c: 143.54 },
            { o: 143.54, h: 145.72, l: 143.34, c: 145.5 },
            { o: 145.5, h: 147.33, l: 145.36, c: 147 },
            { o: 147, h: 149.39, l: 146.77, c: 149.01 },
            { o: 149.01, h: 151.17, l: 148.83, c: 150.92 },
            { o: 150.92, h: 153.56, l: 150.65, c: 153.12 },
            { o: 153.12, h: 154.63, l: 152.96, c: 154.5 },
            { o: 154.5, h: 154.71, l: 151.87, c: 152.24 },
            { o: 152.24, h: 152.59, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.42, l: 147.19, c: 147.5 },
            { o: 139.29, h: 141.89, l: 138.99, c: 141.69 },
            { o: 141.69, h: 143.73, l: 141.34, c: 143.44 },
            { o: 143.44, h: 146.94, l: 143.09, c: 146.58 },
            { o: 146.58, h: 148.36, l: 146.43, c: 148.19 },
            { o: 148.19, h: 150.9, l: 147.94, c: 150.69 }
          ],
          zones: [
            { from: 4, top: 139.73, bottom: 138.27, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 139.73, label: "Gap origin", kind: "level" }
          ],
          notes: [
            { x: 16, y: 145.79, text: "Sector + stocks at demand too" },
            { x: 17, y: 137.59, text: "Buyers at gap origin" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order the top-down scan.",
        items: [
          "Index (S&P, NASDAQ) at a level",
          "A few large sectors at the same kind of level",
          "A handful of high-volume stocks in those sectors",
          "Pick the ones with the largest profit margin"
        ],
        explain: "Old-fashioned, fast, and focused."
      },
      {
        type: "spot",
        q: "Click the base whose gap origin later acts as demand.",
        scene: {
          candles: [
            { o: 148, h: 148.32, l: 146.01, c: 146.28 },
            { o: 146.28, h: 146.48, l: 142.71, c: 143.12 },
            { o: 143.12, h: 143.29, l: 141.14, c: 141.51 },
            { o: 141.51, h: 141.78, l: 138.57, c: 139 },
            { o: 139, h: 139.69, l: 138.27, c: 138.85 },
            { o: 138.85, h: 140.21, l: 138.29, c: 139.73 },
            { o: 139.73, h: 140.43, l: 138.76, c: 139.1 },
            { o: 141.5, h: 143.72, l: 141.39, c: 143.54 },
            { o: 143.54, h: 145.72, l: 143.34, c: 145.5 },
            { o: 145.5, h: 147.33, l: 145.36, c: 147 },
            { o: 147, h: 149.39, l: 146.77, c: 149.01 },
            { o: 149.01, h: 151.17, l: 148.83, c: 150.92 },
            { o: 150.92, h: 153.56, l: 150.65, c: 153.12 },
            { o: 153.12, h: 154.63, l: 152.96, c: 154.5 },
            { o: 154.5, h: 154.71, l: 151.87, c: 152.24 },
            { o: 152.24, h: 152.59, l: 150.02, c: 150.2 },
            { o: 150.2, h: 150.42, l: 147.19, c: 147.5 },
            { o: 139.29, h: 141.89, l: 138.99, c: 141.69 },
            { o: 141.69, h: 143.73, l: 141.34, c: 143.44 },
            { o: 143.44, h: 146.94, l: 143.09, c: 146.58 },
            { o: 146.58, h: 148.36, l: 146.43, c: 148.19 },
            { o: 148.19, h: 150.9, l: 147.94, c: 150.69 }
          ]
        },
        answer: { from: 4, to: 6 },
        explain: "Price based here, then gapped up. The unfilled gap origin became demand."
      },
      {
        type: "mcq",
        q: "Too many stocks qualify. How do you choose?",
        options: [
          "Pick at random",
          "Choose those with the largest profit margin to supply",
          "The cheapest ones",
          "The ones in the news"
        ],
        answer: 1,
        explain: "At or near demand, and farthest from supply."
      },
      {
        type: "tf",
        q: "Seiden still relies on automated scanners scrolling hundreds of symbols.",
        answer: false,
        explain: "He dropped them; they made an easy process hard."
      },
      {
        type: "mcq",
        q: "What can an unfilled gap origin act as?",
        options: ["Nothing", "Demand (or supply)", "A moving average", "Only a target"],
        answer: 1,
        explain: "The S&P gapped down into its gap origin and rallied strongly."
      }
    ],
    practice: [
      {
        prompt: "The index closed near demand. This morning it gaps down right into the origin of an earlier unfilled gap. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 148, h: 148.36, l: 145.38, c: 145.78 },
            { o: 145.78, h: 146.21, l: 143.18, c: 143.54 },
            { o: 143.54, h: 143.84, l: 140.74, c: 140.97 },
            { o: 140.97, h: 141.31, l: 138.56, c: 139 },
            { o: 139, h: 139.62, l: 137.84, c: 138.26 },
            { o: 138.26, h: 139.67, l: 137.88, c: 139.11 },
            { o: 139.11, h: 139.74, l: 138.6, c: 139.04 },
            { o: 141.44, h: 143.68, l: 141.3, c: 143.56 },
            { o: 143.56, h: 145.58, l: 143.34, c: 145.44 },
            { o: 145.44, h: 147.26, l: 145, c: 147.08 },
            { o: 147.08, h: 149.09, l: 146.8, c: 148.83 },
            { o: 148.83, h: 151.09, l: 148.68, c: 150.75 },
            { o: 150.75, h: 153.29, l: 150.53, c: 153.07 },
            { o: 153.07, h: 154.59, l: 152.76, c: 154.44 },
            { o: 154.44, h: 154.73, l: 151.56, c: 151.95 },
            { o: 151.95, h: 152.14, l: 149.37, c: 149.73 },
            { o: 149.73, h: 150.13, l: 147.01, c: 147.44 },
            { o: 138.73, h: 141.33, l: 138.43, c: 141.13 },
            { o: 141.13, h: 143.51, l: 140.79, c: 143.17 },
            { o: 143.17, h: 145.86, l: 142.96, c: 145.57 },
            { o: 145.57, h: 148.14, l: 145.22, c: 147.72 },
            { o: 147.72, h: 150.47, l: 147.59, c: 150.13 }
          ],
          zones: [
            { from: 4, top: 139.11, bottom: 137.84, kind: "demand", label: "Gap-origin demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "The unfilled gap origin is demand, and the scan says look for buys. Buy, stop below the zone. Price rallied strongly."
      }
    ],
    cards: [
      { front: "Top-down scan order?", back: "Index, sectors, a handful of stocks." },
      { front: "What must all layers share?", back: "The same kind of level (all at demand for buys)." },
      { front: "How to rank candidates?", back: "Largest profit margin." },
      { front: "Unfilled gap origin?", back: "Can act as quality demand (or supply)." },
      { front: "Automated scanners?", back: "Dropped; old-fashioned analysis is faster and clearer." }
    ],
    mnemonic: "Country, city, street: index, sector, stock."
  }
];
