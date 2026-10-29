// Interactive teaching layer for mentor "seiden" (Sam Seiden articles), lessons in part161.ts and part241.ts.
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Seiden's drawing rule: enclose the
// majority of trading in the base - demand top (proximal) = highest basing body, bottom (distal) = lowest
// basing wick; supply mirrored (bottom = lowest basing body, top = highest basing wick).
import type { InteractiveLesson } from './types';

export const IL_SEIDENB: InteractiveLesson[] = [
  {
    mentor: "seiden",
    n: 161,
    eli5: {
      oneLiner: "Check the market, then the sector, then the stock. Buy where all three agree.",
      story: "Picture a shopper who first checks if the whole mall is on sale, then the shoe shop, then one pair of shoes. Sam did the same thing with the S&P, the bank sector fund and Bank of America. All three had a spot where price had jumped away with a gap. He wrote his plan the day before. The next morning all three gapped down into those spots, and the buyers there risked only 15 cents a share.",
      analogy: "It is like three friends all saying the same restaurant is good. One opinion is a guess; three that agree make a much safer bet."
    },
    bigIdeas: [
      "Scan top-down: index first, then 3-4 sectors, then 3 big stocks in the best sector.",
      "A gap away from a base shows a big imbalance. The stronger the move away, the better the level.",
      "Do the work the day before, so the orders are ready when price arrives."
    ],
    steps: [
      {
        title: "A base, then a gap away",
        narration: "Price dropped, paused for three small candles, then gapped higher and ran. A gap means buyers wanted in so badly that no trading happened in between. That is a large imbalance at the base.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          highlight: { from: 8, to: 10, label: "gap away = strong" },
          reveal: 11
        }
      },
      {
        title: "Box the gap origin",
        narration: "Wrap the base with two lines: the top line on the highest basing body, the bottom line on the lowest basing wick. This is the demand zone we want price to come back to.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          zones: [
            { from: 5, top: 148.37, bottom: 147.34, kind: "demand", label: "Gap-origin demand" }
          ],
          highlight: { from: 5, to: 7, label: "base" },
          reveal: 13
        }
      },
      {
        title: "Line it up with the index and sector",
        narration: "Before trusting this stock, check that the S&P and the sector fund also sit just above their own fresh demand. When all three line up, the odds go up a lot. All of this is done the evening before.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          zones: [
            { from: 5, top: 148.37, bottom: 147.34, kind: "demand", label: "Gap-origin demand" }
          ],
          notes: [
            { x: 10, y: 154.37, text: "S&P + sector demand line up" }
          ],
          reveal: 16
        }
      },
      {
        title: "The gap down is the gift",
        narration: "Next morning price gaps down straight into the zone. The people selling here make two novice mistakes: they sell after a decline, and they sell into demand. Our resting buy at the top line is filled from them. The stop sits just under the bottom line, so the risk is tiny.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          zones: [
            { from: 5, top: 148.37, bottom: 147.34, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 148.37, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 147.09, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 168, label: "Target: opposing level", kind: "tp", from: 7 }
          ],
          highlight: { from: 16, to: 16, label: "gap into demand" },
          reveal: 17
        }
      },
      {
        title: "The result",
        narration: "Price rallies away from the zone, just like the index and the sector did that same morning. Low risk, high reward, and planned in minutes the day before.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          zones: [
            { from: 5, top: 148.37, bottom: 147.34, kind: "demand", label: "Gap-origin demand" }
          ],
          lines: [
            { y: 148.37, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 147.09, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 168, label: "Target: opposing level", kind: "tp", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put Sam's top-down scan in order.",
        items: [
          "Check the index (S&P) for a level",
          "Check 3-4 sector funds for a matching level",
          "Check 3 major stocks in the best sector",
          "Write entry and stop the day before"
        ],
        explain: "Index, sector, stock, then the written plan. Each layer must agree with the one above it."
      },
      {
        type: "mcq",
        q: "What made the BAC demand level high quality?",
        options: [
          "It had been tested many times",
          "Price left it with a strong gap away",
          "A scanner flagged it",
          "The CEO gave good news"
        ],
        answer: 1,
        explain: "The stronger the move away from a level, the bigger the imbalance at its origin. A gap is a very strong departure."
      },
      {
        type: "spot",
        q: "Click the candles that prove buyers overwhelmed sellers at the base.",
        scene: {
          candles: [
            { o: 176, h: 176.44, l: 170.77, c: 171.27 },
            { o: 171.27, h: 172.13, l: 165.25, c: 166.23 },
            { o: 166.23, h: 167.19, l: 160.24, c: 160.59 },
            { o: 160.59, h: 161.69, l: 154.01, c: 154.56 },
            { o: 154.56, h: 155.26, l: 147.39, c: 148 },
            { o: 148, h: 148.64, l: 147.79, c: 148.37 },
            { o: 148.37, h: 148.65, l: 147.43, c: 147.65 },
            { o: 147.65, h: 148.52, l: 147.34, c: 148.23 },
            { o: 152.23, h: 158.2, l: 152.03, c: 157.9 },
            { o: 157.9, h: 165.78, l: 157.45, c: 165.56 },
            { o: 165.56, h: 172.73, l: 164.91, c: 172 },
            { o: 172, h: 172.73, l: 168.41, c: 168.59 },
            { o: 168.59, h: 169.01, l: 166.13, c: 166.25 },
            { o: 166.25, h: 166.78, l: 163.31, c: 163.51 },
            { o: 163.51, h: 164.13, l: 159.84, c: 160.39 },
            { o: 160.39, h: 161.1, l: 156.42, c: 157 },
            { o: 149.6, h: 149.9, l: 147.86, c: 149.17 },
            { o: 149.17, h: 152.49, l: 148.93, c: 152.24 },
            { o: 152.24, h: 155.43, l: 151.99, c: 155.28 },
            { o: 155.28, h: 158.59, l: 154.97, c: 158.5 },
            { o: 158.5, h: 161.11, l: 158.27, c: 161.04 },
            { o: 161.04, h: 164.96, l: 160.86, c: 164.67 },
            { o: 164.67, h: 168.4, l: 164.54, c: 168 }
          ],
          zones: [
            { from: 5, top: 148.37, bottom: 147.34, kind: "demand", label: "Gap-origin demand" }
          ]
        },
        answer: { from: 8, to: 10 },
        explain: "The gap and the big green candles leaving the base are the proof. Strong exit = big imbalance."
      },
      {
        type: "tf",
        q: "The sellers who sold the gap down into the zone made a smart trade because the news was bad.",
        answer: false,
        explain: "They sold after a decline and into demand, the two novice mistakes. We want to be the buyer to that seller."
      },
      {
        type: "mcq",
        q: "Why did Sam do this scan by hand instead of with an automatic scanner?",
        options: [
          "Scanners are illegal",
          "It took only minutes and found BAC, which a scanner probably would have missed",
          "He likes paper charts",
          "Scanners only work on futures"
        ],
        answer: 1,
        explain: "A quick rule-based top-down read was faster and found the stock that lined up with the index and sector."
      }
    ],
    practice: [
      {
        prompt: "The S&P and the sector fund are both gapping down into their fresh demand this morning. This stock has a gap-origin demand zone, and price is falling toward it now. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.5, l: 162.88, c: 163.4 },
            { o: 163.4, h: 164.37, l: 153.77, c: 154.66 },
            { o: 154.66, h: 156.16, l: 146.5, c: 147.09 },
            { o: 147.09, h: 148.07, l: 136.83, c: 137.45 },
            { o: 137.45, h: 137.88, l: 130.41, c: 131 },
            { o: 131, h: 131.66, l: 130.66, c: 131.47 },
            { o: 131.47, h: 131.75, l: 130.41, c: 130.59 },
            { o: 130.59, h: 131.4, l: 130.36, c: 131.19 },
            { o: 134.69, h: 140.56, l: 134.27, c: 140.18 },
            { o: 140.18, h: 145.45, l: 139.85, c: 145 },
            { o: 145, h: 150.17, l: 144.55, c: 150 },
            { o: 150, h: 150.36, l: 147.46, c: 147.61 },
            { o: 147.61, h: 147.74, l: 144.35, c: 144.77 },
            { o: 144.77, h: 145.33, l: 141.4, c: 141.86 },
            { o: 141.86, h: 142.29, l: 138.49, c: 139 },
            { o: 132.3, h: 132.65, l: 130.92, c: 132.27 },
            { o: 132.27, h: 134.97, l: 132.18, c: 134.73 },
            { o: 134.73, h: 137.14, l: 134.55, c: 137.08 },
            { o: 137.08, h: 140.44, l: 136.94, c: 140.3 },
            { o: 140.3, h: 143.03, l: 140.08, c: 142.77 },
            { o: 142.77, h: 144.3, l: 142.69, c: 144.17 },
            { o: 144.17, h: 147.19, l: 144.09, c: 147 }
          ],
          zones: [
            { from: 5, top: 131.47, bottom: 130.36, kind: "demand", label: "Gap-origin demand" }
          ],
          notes: [
            { x: 10, y: 136.47, text: "Index + sector at demand" }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "All three layers line up and the stock level came from a gap away. Buy at the top line, stop under the bottom line. Price rallied off the zone."
      },
      {
        prompt: "This stock is coming back to its demand, but the S&P is sitting right at a big supply level above. The stock's base left slowly, with no gap. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 166, h: 166.48, l: 160.96, c: 161.6 },
            { o: 161.6, h: 162.63, l: 154.4, c: 155.54 },
            { o: 155.54, h: 156.28, l: 150.8, c: 151.16 },
            { o: 151.16, h: 151.77, l: 143, c: 143.94 },
            { o: 143.94, h: 144.17, l: 139.29, c: 140 },
            { o: 140, h: 140.45, l: 139.82, c: 140.27 },
            { o: 140.27, h: 140.45, l: 139.45, c: 139.58 },
            { o: 139.58, h: 140.57, l: 139.26, c: 140.33 },
            { o: 140.33, h: 143.9, l: 140.12, c: 143.59 },
            { o: 143.59, h: 146.54, l: 143.5, c: 146.4 },
            { o: 146.4, h: 149.2, l: 146.2, c: 148.94 },
            { o: 148.94, h: 152.23, l: 148.77, c: 152 },
            { o: 152, h: 152.39, l: 149.8, c: 150 },
            { o: 150, h: 150.39, l: 147, c: 147.51 },
            { o: 147.51, h: 147.87, l: 144.63, c: 144.96 },
            { o: 144.96, h: 145.45, l: 141.03, c: 141.73 },
            { o: 141.73, h: 142.02, l: 139.9, c: 140.13 },
            { o: 140.13, h: 140.29, l: 138.81, c: 138.89 },
            { o: 138.89, h: 139.16, l: 136.64, c: 137.03 },
            { o: 137.03, h: 137.14, l: 136, c: 136.08 },
            { o: 136.08, h: 136.31, l: 134.41, c: 134.6 },
            { o: 134.6, h: 134.75, l: 133.05, c: 133.12 },
            { o: 133.12, h: 133.43, l: 131.13, c: 131.26 }
          ],
          zones: [
            { from: 5, top: 140.33, bottom: 139.26, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 11, y: 148.33, text: "S&P at supply" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The stock does not line up with the index, and the move away was not strong. Skip it. Price fell through the zone as the market dropped."
      }
    ],
    cards: [
      {
        front: "Order of the top-down scan?",
        back: "Index, then 3-4 sectors, then 3 major stocks in the best sector."
      },
      {
        front: "What does a gap away from a base tell you?",
        back: "A large imbalance: much more demand than supply (or the reverse)."
      },
      { front: "When was the BAC trade planned?", back: "The day before; orders were ready when price gapped in." },
      { front: "BAC risk per share on 4/21/09?", back: "About $0.15." },
      {
        front: "Two novice mistakes of the gap-down sellers?",
        back: "Selling after a decline, and selling into demand."
      }
    ],
    mnemonic: "Market, Mall, Shop: index, sector, stock. Plan it the night before."
  },
  {
    mentor: "seiden",
    n: 163,
    eli5: {
      oneLiner: "Score every level out of ten before you trade it.",
      story: "A student found a supply level in gold where price had dropped away fast. Before selling, he gave the level points: 2 for the fast drop, 2 for lots of room to the next demand, 2 because the bigger chart agreed. A few more checks brought the total to 9 out of 10. So he placed a sell order, a stop and two targets ahead of time, and walked away. Risk was $1,200 and the profit was $4,100.",
      analogy: "It is like a report card for a level. You only invite the straight-A students to the party."
    },
    bigIdeas: [
      "Not every old turning point is a level. Score it: strength 2, profit margin 2, big picture 2, retracement 2, time 1, return 1.",
      "Profit margin gets full points only at 3:1 or more to the nearest opposing level.",
      "A high score earns a limit order with stop and targets placed in advance."
    ],
    steps: [
      {
        title: "Strength of move: 2 of 2",
        narration: "Price rallied, paused for two candles, then fell hard with big red candles. A fast, strong departure means a big imbalance, so this scores the full 2 points. A slow drift away would score zero.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          highlight: { from: 7, to: 9, label: "fast drop" },
          reveal: 10
        }
      },
      {
        title: "Draw the supply",
        narration: "Box the rally-base-drop: bottom line on the lowest basing body, top line on the highest basing wick. This is the zone we will score.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          zones: [
            { from: 5, top: 166.66, bottom: 165.46, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 5, to: 6, label: "base" },
          reveal: 13
        }
      },
      {
        title: "Profit margin: 2 of 2",
        narration: "Entry is the bottom line, the stop goes just above the top line. Measure that risk and compare it with the room down to the nearest demand. At least three times the risk scores 2 points.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          zones: [
            { from: 5, top: 166.66, bottom: 165.46, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 165.46, label: "Limit sell", kind: "entry", from: 6 },
            { y: 166.91, label: "Stop", kind: "sl", from: 6 },
            { y: 161.11, label: "Target 1 (3:1)", kind: "tp", from: 6 },
            { y: 158.21, label: "Target 2", kind: "tp", from: 6 }
          ],
          reveal: 15
        }
      },
      {
        title: "Big picture: 2 of 2",
        narration: "Check the larger chart. Never short close to higher-timeframe demand; it is best to short near higher-timeframe supply. Here the bigger chart has supply overhead, so 2 more points.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          zones: [
            { from: 5, top: 166.66, bottom: 165.46, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 165.46, label: "Limit sell", kind: "entry", from: 6 },
            { y: 166.91, label: "Stop", kind: "sl", from: 6 },
            { y: 161.11, label: "Target 1 (3:1)", kind: "tp", from: 6 },
            { y: 158.21, label: "Target 2", kind: "tp", from: 6 }
          ],
          notes: [
            { x: 6, y: 169.66, text: "Higher-timeframe supply above" }
          ],
          reveal: 19
        }
      },
      {
        title: "Score 9: let the order work",
        narration: "Add retracement, time at level and return and the level scores 9 out of 10. The sell, the stop and both targets were all placed before price came back. Price touched the zone and fell to both targets.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          zones: [
            { from: 5, top: 166.66, bottom: 165.46, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 165.46, label: "Limit sell", kind: "entry", from: 6 },
            { y: 166.91, label: "Stop", kind: "sl", from: 6 },
            { y: 161.11, label: "Target 1 (3:1)", kind: "tp", from: 6 },
            { y: 158.21, label: "Target 2", kind: "tp", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How many points can strength of move earn at most?",
        options: ["1", "2", "3", "10"],
        answer: 1,
        explain: "Strength of move, profit margin, big picture and retracement are worth 2 each; time at level and return are worth 1 each. Total 10."
      },
      {
        type: "mcq",
        q: "Your stop is 6 points away. How far must the nearest opposing level be for full profit-margin points?",
        options: ["6 points", "12 points", "18 points or more", "It does not matter"],
        answer: 2,
        explain: "Full points need at least 3:1, so 6 points of risk needs 18 points of room."
      },
      {
        type: "tf",
        q: "Every prior turning point on a chart is real support or resistance.",
        answer: false,
        explain: "Price turns where demand and supply are MOST out of balance. The score sheet finds those few levels and ignores the rest."
      },
      {
        type: "spot",
        q: "Click the candles that earn the strength-of-move points.",
        scene: {
          candles: [
            { o: 140, h: 144.68, l: 139.77, c: 144.41 },
            { o: 144.41, h: 151.75, l: 143.12, c: 151.38 },
            { o: 151.38, h: 156.49, l: 150.93, c: 156.24 },
            { o: 156.24, h: 161.18, l: 155.36, c: 160.37 },
            { o: 160.37, h: 166.61, l: 159.73, c: 166 },
            { o: 166, h: 166.66, l: 165.73, c: 166.25 },
            { o: 166.25, h: 166.57, l: 165.28, c: 165.46 },
            { o: 165.46, h: 166.38, l: 157.4, c: 157.72 },
            { o: 157.72, h: 158.23, l: 151.2, c: 151.88 },
            { o: 151.88, h: 152.42, l: 144.58, c: 145 },
            { o: 145, h: 146.88, l: 144.75, c: 146.73 },
            { o: 146.73, h: 148.83, l: 146.59, c: 148.66 },
            { o: 148.66, h: 150.13, l: 148.55, c: 150 },
            { o: 150, h: 152.07, l: 149.66, c: 151.78 },
            { o: 151.78, h: 154.39, l: 151.43, c: 153.94 },
            { o: 153.94, h: 157.48, l: 153.32, c: 157.29 },
            { o: 157.29, h: 158.58, l: 157.15, c: 158.45 },
            { o: 158.45, h: 161.57, l: 158.28, c: 161.2 },
            { o: 161.2, h: 163.81, l: 160.92, c: 163.4 },
            { o: 163.4, h: 165.94, l: 162.95, c: 164.46 },
            { o: 164.46, h: 164.68, l: 160.44, c: 160.66 },
            { o: 160.66, h: 160.98, l: 156.01, c: 156.31 },
            { o: 156.31, h: 156.39, l: 154.31, c: 154.39 },
            { o: 154.39, h: 154.67, l: 150.39, c: 150.72 },
            { o: 150.72, h: 151.25, l: 145.8, c: 146.01 },
            { o: 146.01, h: 146.36, l: 141.8, c: 142.2 },
            { o: 142.2, h: 142.44, l: 139.92, c: 140.11 },
            { o: 140.11, h: 140.39, l: 135.75, c: 136 }
          ],
          zones: [
            { from: 5, top: 166.66, bottom: 165.46, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 7, to: 9 },
        explain: "The big red candles leaving the base. Speed and size of the departure are what you score."
      },
      {
        type: "mcq",
        q: "You want to short a level on the hourly chart. The daily chart has fresh demand just below. What does the big-picture check say?",
        options: [
          "Full points, short it",
          "Do not short near higher-timeframe demand",
          "Buy instead immediately",
          "Ignore the daily chart"
        ],
        answer: 1,
        explain: "Never short anywhere near higher-timeframe demand. The best shorts sit close to higher-timeframe supply."
      },
      {
        type: "order",
        q: "Order the trade routine after a level scores 9.",
        items: [
          "Score the level",
          "Place the limit entry",
          "Place the stop and both targets",
          "Trail the stop as targets are hit"
        ],
        explain: "Everything is placed before price arrives. As targets are hit, the stop is moved so a retrace still leaves a profit."
      }
    ],
    practice: [
      {
        prompt: "Supply left with two huge red candles, the nearest demand is far below (well over 3:1) and the daily chart shows supply overhead. It is the first return. Score it and decide.",
        scene: {
          candles: [
            { o: 120, h: 125.93, l: 119.36, c: 125.44 },
            { o: 125.44, h: 135.27, l: 124.59, c: 134.3 },
            { o: 134.3, h: 140.48, l: 133.8, c: 139.46 },
            { o: 139.46, h: 146.6, l: 138.84, c: 145.51 },
            { o: 145.51, h: 152.66, l: 144.89, c: 152 },
            { o: 152, h: 152.71, l: 151.7, c: 152.37 },
            { o: 152.37, h: 152.55, l: 151.19, c: 151.53 },
            { o: 151.53, h: 151.92, l: 139.54, c: 140.36 },
            { o: 140.36, h: 141.38, l: 126.65, c: 128 },
            { o: 128, h: 130.84, l: 127.5, c: 130.41 },
            { o: 130.41, h: 132.12, l: 130.2, c: 132 },
            { o: 132, h: 136.42, l: 131.7, c: 136.14 },
            { o: 136.14, h: 139.19, l: 135.98, c: 139.01 },
            { o: 139.01, h: 144.15, l: 138.29, c: 143.7 },
            { o: 143.7, h: 146.58, l: 143.38, c: 146.29 },
            { o: 146.29, h: 150.34, l: 146, c: 150.13 },
            { o: 150.13, h: 152, l: 149.88, c: 150.73 },
            { o: 150.73, h: 150.86, l: 147.41, c: 147.75 },
            { o: 147.75, h: 147.91, l: 143.69, c: 143.95 },
            { o: 143.95, h: 144.32, l: 138.97, c: 139.2 },
            { o: 139.2, h: 139.33, l: 135.99, c: 136.14 },
            { o: 136.14, h: 136.27, l: 132.17, c: 132.53 },
            { o: 132.53, h: 132.77, l: 127.61, c: 127.79 },
            { o: 127.79, h: 128.09, l: 123.84, c: 124 }
          ],
          zones: [
            { from: 5, top: 152.71, bottom: 151.53, kind: "supply", label: "Supply" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Strength 2, profit margin 2, big picture 2, first return, short time at the level: a 9-10. A limit sell is allowed, and price fell away from the zone."
      },
      {
        prompt: "This demand formed over six overlapping candles and price drifted slowly away from it. Price is coming back. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.38, l: 146.38, c: 146.94 },
            { o: 146.94, h: 147.81, l: 140.86, c: 141.8 },
            { o: 141.8, h: 142.21, l: 139.11, c: 139.35 },
            { o: 139.35, h: 139.99, l: 134.74, c: 135.4 },
            { o: 135.4, h: 136.03, l: 131.73, c: 132 },
            { o: 132, h: 133.29, l: 131.8, c: 132.81 },
            { o: 132.81, h: 133.29, l: 130.85, c: 131.27 },
            { o: 131.27, h: 132.92, l: 130.78, c: 132.65 },
            { o: 132.65, h: 132.87, l: 130.88, c: 131.32 },
            { o: 131.32, h: 133.13, l: 130.85, c: 132.79 },
            { o: 132.79, h: 133.3, l: 130.99, c: 131.33 },
            { o: 131.33, h: 132.64, l: 131.2, c: 132.54 },
            { o: 132.54, h: 134.41, l: 132.34, c: 134.27 },
            { o: 134.27, h: 135.55, l: 134.14, c: 135.44 },
            { o: 135.44, h: 136.79, l: 135.37, c: 136.74 },
            { o: 136.74, h: 138.17, l: 136.58, c: 138.12 },
            { o: 138.12, h: 139.71, l: 137.96, c: 139.58 },
            { o: 139.58, h: 141.15, l: 139.51, c: 141 },
            { o: 141, h: 141.46, l: 138.06, c: 138.51 },
            { o: 138.51, h: 138.62, l: 137.03, c: 137.15 },
            { o: 137.15, h: 137.66, l: 134.05, c: 134.21 },
            { o: 134.21, h: 134.7, l: 132, c: 132.51 },
            { o: 132.51, h: 132.62, l: 130.49, c: 130.83 },
            { o: 130.83, h: 131.05, l: 128.19, c: 128.58 },
            { o: 128.58, h: 128.75, l: 126.52, c: 126.79 },
            { o: 126.79, h: 127.06, l: 125.26, c: 125.47 },
            { o: 125.47, h: 125.82, l: 123.13, c: 123.48 },
            { o: 123.48, h: 123.62, l: 121.64, c: 121.78 }
          ],
          zones: [
            { from: 5, top: 132.81, bottom: 130.78, kind: "demand", label: "Demand" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "A slow drift away scores 0 for strength, and a long stay at the level loses the time point. The score is too low to trade. Price fell through."
      }
    ],
    cards: [
      {
        front: "Odds Enhancer points (6 items)?",
        back: "Strength 2, profit margin 2, big picture 2, retracement 2, time at level 1, return 1 = 10."
      },
      { front: "Full profit-margin points need?", back: "At least 3:1 reward to the nearest opposing level." },
      {
        front: "Big-picture rule for shorts?",
        back: "Never short near higher-timeframe demand; prefer shorting near HTF supply."
      },
      {
        front: "Gold student trade: score, entry, stop?",
        back: "9 of 10; short 864, stop 870, targets about 852 and 835."
      },
      {
        front: "What gives the discipline to wait?",
        back: "A bigger purpose than the money, like more time with family."
      }
    ],
    mnemonic: "S-P-B first: Strength, Profit margin, Big picture, 2 points each."
  },
  {
    mentor: "seiden",
    n: 167,
    eli5: {
      oneLiner: "News is only an invitation. The level tells you whether to accept it.",
      story: "One morning the boss of Bank of America gave bad news, and many people sold the stock in a hurry. But the price fell right into a demand level Sam had already marked. He bought from the scared sellers. Two weeks later the stock had almost doubled. The news sellers listened to the headline; the buyers listened to price.",
      analogy: "Bad news is like a rainy day at the beach shop: people dump their umbrellas cheap. If you know umbrellas always sell again, rain is your chance to buy."
    },
    bigIdeas: [
      "There are two kinds of invitations: market invitations (supply and demand) and everything else (news, upgrades, tips).",
      "Bad news that pushes price into peak demand is usually a buy. Good news into peak supply is usually a sell.",
      "Discipline problems are belief problems. Clean your beliefs so they hold only objective facts."
    ],
    steps: [
      {
        title: "Mark the real demand",
        narration: "Price fell, paused, then gapped up and ran. That base is peak demand: the place where buyers far outnumbered sellers. Box it before any news comes out.",
        scene: {
          candles: [
            { o: 170, h: 171.57, l: 161.41, c: 162.85 },
            { o: 162.85, h: 164.21, l: 154.04, c: 154.78 },
            { o: 154.78, h: 155.38, l: 146.42, c: 147.24 },
            { o: 147.24, h: 148.73, l: 131.75, c: 134.2 },
            { o: 134.2, h: 135.2, l: 127.2, c: 128 },
            { o: 128, h: 128.58, l: 127.64, c: 128.31 },
            { o: 128.31, h: 128.58, l: 127.36, c: 127.48 },
            { o: 127.48, h: 128.76, l: 127.15, c: 128.49 },
            { o: 131.49, h: 139.66, l: 131.04, c: 138.89 },
            { o: 138.89, h: 148.24, l: 138.1, c: 147.97 },
            { o: 147.97, h: 156.53, l: 147.44, c: 156 },
            { o: 156, h: 156.37, l: 153.98, c: 154.14 },
            { o: 154.14, h: 154.37, l: 151.94, c: 152.26 },
            { o: 152.26, h: 152.71, l: 149.58, c: 150 },
            { o: 150, h: 150.23, l: 147.02, c: 147.39 },
            { o: 147.39, h: 147.77, l: 144.47, c: 144.94 },
            { o: 144.94, h: 145.15, l: 142.69, c: 143.06 },
            { o: 143.06, h: 143.47, l: 139.85, c: 140 },
            { o: 129.2, h: 129.55, l: 127.82, c: 129.29 },
            { o: 129.29, h: 133.62, l: 129.01, c: 133.16 },
            { o: 133.16, h: 137.87, l: 132.63, c: 137.57 },
            { o: 137.57, h: 142.21, l: 137.08, c: 141.87 },
            { o: 141.87, h: 146.52, l: 141.72, c: 146.11 },
            { o: 146.11, h: 150.97, l: 145.89, c: 150.53 },
            { o: 150.53, h: 152.89, l: 150.27, c: 152.79 },
            { o: 152.79, h: 158.61, l: 152.14, c: 158.24 },
            { o: 158.24, h: 162.37, l: 157.94, c: 162 }
          ],
          zones: [
            { from: 5, top: 128.49, bottom: 127.15, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 5, to: 7, label: "base" },
          reveal: 12
        }
      },
      {
        title: "The news invitation arrives",
        narration: "Bad news hits. Price gaps down hard. The headline invites you to sell. But first, filter it: where is price on the supply and demand picture?",
        scene: {
          candles: [
            { o: 170, h: 171.57, l: 161.41, c: 162.85 },
            { o: 162.85, h: 164.21, l: 154.04, c: 154.78 },
            { o: 154.78, h: 155.38, l: 146.42, c: 147.24 },
            { o: 147.24, h: 148.73, l: 131.75, c: 134.2 },
            { o: 134.2, h: 135.2, l: 127.2, c: 128 },
            { o: 128, h: 128.58, l: 127.64, c: 128.31 },
            { o: 128.31, h: 128.58, l: 127.36, c: 127.48 },
            { o: 127.48, h: 128.76, l: 127.15, c: 128.49 },
            { o: 131.49, h: 139.66, l: 131.04, c: 138.89 },
            { o: 138.89, h: 148.24, l: 138.1, c: 147.97 },
            { o: 147.97, h: 156.53, l: 147.44, c: 156 },
            { o: 156, h: 156.37, l: 153.98, c: 154.14 },
            { o: 154.14, h: 154.37, l: 151.94, c: 152.26 },
            { o: 152.26, h: 152.71, l: 149.58, c: 150 },
            { o: 150, h: 150.23, l: 147.02, c: 147.39 },
            { o: 147.39, h: 147.77, l: 144.47, c: 144.94 },
            { o: 144.94, h: 145.15, l: 142.69, c: 143.06 },
            { o: 143.06, h: 143.47, l: 139.85, c: 140 },
            { o: 129.2, h: 129.55, l: 127.82, c: 129.29 },
            { o: 129.29, h: 133.62, l: 129.01, c: 133.16 },
            { o: 133.16, h: 137.87, l: 132.63, c: 137.57 },
            { o: 137.57, h: 142.21, l: 137.08, c: 141.87 },
            { o: 141.87, h: 146.52, l: 141.72, c: 146.11 },
            { o: 146.11, h: 150.97, l: 145.89, c: 150.53 },
            { o: 150.53, h: 152.89, l: 150.27, c: 152.79 },
            { o: 152.79, h: 158.61, l: 152.14, c: 158.24 },
            { o: 158.24, h: 162.37, l: 157.94, c: 162 }
          ],
          zones: [
            { from: 5, top: 128.49, bottom: 127.15, kind: "demand", label: "Demand" }
          ],
          notes: [
            { x: 18, y: 137.49, text: "Bad news!" }
          ],
          reveal: 18
        }
      },
      {
        title: "Filter the news through the level",
        narration: "The news pushed price straight into peak demand. That turns the scary headline into a market invitation to buy. Entry on the top line, stop under the bottom line.",
        scene: {
          candles: [
            { o: 170, h: 171.57, l: 161.41, c: 162.85 },
            { o: 162.85, h: 164.21, l: 154.04, c: 154.78 },
            { o: 154.78, h: 155.38, l: 146.42, c: 147.24 },
            { o: 147.24, h: 148.73, l: 131.75, c: 134.2 },
            { o: 134.2, h: 135.2, l: 127.2, c: 128 },
            { o: 128, h: 128.58, l: 127.64, c: 128.31 },
            { o: 128.31, h: 128.58, l: 127.36, c: 127.48 },
            { o: 127.48, h: 128.76, l: 127.15, c: 128.49 },
            { o: 131.49, h: 139.66, l: 131.04, c: 138.89 },
            { o: 138.89, h: 148.24, l: 138.1, c: 147.97 },
            { o: 147.97, h: 156.53, l: 147.44, c: 156 },
            { o: 156, h: 156.37, l: 153.98, c: 154.14 },
            { o: 154.14, h: 154.37, l: 151.94, c: 152.26 },
            { o: 152.26, h: 152.71, l: 149.58, c: 150 },
            { o: 150, h: 150.23, l: 147.02, c: 147.39 },
            { o: 147.39, h: 147.77, l: 144.47, c: 144.94 },
            { o: 144.94, h: 145.15, l: 142.69, c: 143.06 },
            { o: 143.06, h: 143.47, l: 139.85, c: 140 },
            { o: 129.2, h: 129.55, l: 127.82, c: 129.29 },
            { o: 129.29, h: 133.62, l: 129.01, c: 133.16 },
            { o: 133.16, h: 137.87, l: 132.63, c: 137.57 },
            { o: 137.57, h: 142.21, l: 137.08, c: 141.87 },
            { o: 141.87, h: 146.52, l: 141.72, c: 146.11 },
            { o: 146.11, h: 150.97, l: 145.89, c: 150.53 },
            { o: 150.53, h: 152.89, l: 150.27, c: 152.79 },
            { o: 152.79, h: 158.61, l: 152.14, c: 158.24 },
            { o: 158.24, h: 162.37, l: 157.94, c: 162 }
          ],
          zones: [
            { from: 5, top: 128.49, bottom: 127.15, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 128.49, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 126.88, label: "Stop below distal", kind: "sl", from: 7 }
          ],
          highlight: { from: 18, to: 18, label: "news drop into demand" },
          reveal: 19
        }
      },
      {
        title: "Price already includes everything",
        narration: "Every input, from earnings to tips to indicators, ends as a buy or sell decision. So it is all reflected in price. The news sellers were the fuel; price rallied far away from the zone.",
        scene: {
          candles: [
            { o: 170, h: 171.57, l: 161.41, c: 162.85 },
            { o: 162.85, h: 164.21, l: 154.04, c: 154.78 },
            { o: 154.78, h: 155.38, l: 146.42, c: 147.24 },
            { o: 147.24, h: 148.73, l: 131.75, c: 134.2 },
            { o: 134.2, h: 135.2, l: 127.2, c: 128 },
            { o: 128, h: 128.58, l: 127.64, c: 128.31 },
            { o: 128.31, h: 128.58, l: 127.36, c: 127.48 },
            { o: 127.48, h: 128.76, l: 127.15, c: 128.49 },
            { o: 131.49, h: 139.66, l: 131.04, c: 138.89 },
            { o: 138.89, h: 148.24, l: 138.1, c: 147.97 },
            { o: 147.97, h: 156.53, l: 147.44, c: 156 },
            { o: 156, h: 156.37, l: 153.98, c: 154.14 },
            { o: 154.14, h: 154.37, l: 151.94, c: 152.26 },
            { o: 152.26, h: 152.71, l: 149.58, c: 150 },
            { o: 150, h: 150.23, l: 147.02, c: 147.39 },
            { o: 147.39, h: 147.77, l: 144.47, c: 144.94 },
            { o: 144.94, h: 145.15, l: 142.69, c: 143.06 },
            { o: 143.06, h: 143.47, l: 139.85, c: 140 },
            { o: 129.2, h: 129.55, l: 127.82, c: 129.29 },
            { o: 129.29, h: 133.62, l: 129.01, c: 133.16 },
            { o: 133.16, h: 137.87, l: 132.63, c: 137.57 },
            { o: 137.57, h: 142.21, l: 137.08, c: 141.87 },
            { o: 141.87, h: 146.52, l: 141.72, c: 146.11 },
            { o: 146.11, h: 150.97, l: 145.89, c: 150.53 },
            { o: 150.53, h: 152.89, l: 150.27, c: 152.79 },
            { o: 152.79, h: 158.61, l: 152.14, c: 158.24 },
            { o: 158.24, h: 162.37, l: 157.94, c: 162 }
          ],
          zones: [
            { from: 5, top: 128.49, bottom: 127.15, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 128.49, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 126.88, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A good earnings report means there is real demand for the stock.",
        answer: false,
        explain: "Good news is not demand. Only price at a demand level shows where buyers outnumber sellers."
      },
      {
        type: "mcq",
        q: "Bad news drives price down into a fresh demand level. What does Sam's rule say?",
        options: [
          "Sell, the news is bad",
          "Usually a buying opportunity",
          "Wait for the news to change",
          "Short more"
        ],
        answer: 1,
        explain: "Negative news that brings price to peak demand is usually a buy."
      },
      {
        type: "mcq",
        q: "Why do traders fail to follow their rules, according to Sam?",
        options: [
          "They lack willpower",
          "Their belief system conflicts with the rules at the moment of action",
          "The rules are too simple",
          "They have slow computers"
        ],
        answer: 1,
        explain: "An invitation that does not fit your belief system causes inner conflict. Fix the beliefs instead of punishing yourself."
      },
      {
        type: "spot",
        q: "Click the candle where the news invitation and the market invitation disagree.",
        scene: {
          candles: [
            { o: 170, h: 171.57, l: 161.41, c: 162.85 },
            { o: 162.85, h: 164.21, l: 154.04, c: 154.78 },
            { o: 154.78, h: 155.38, l: 146.42, c: 147.24 },
            { o: 147.24, h: 148.73, l: 131.75, c: 134.2 },
            { o: 134.2, h: 135.2, l: 127.2, c: 128 },
            { o: 128, h: 128.58, l: 127.64, c: 128.31 },
            { o: 128.31, h: 128.58, l: 127.36, c: 127.48 },
            { o: 127.48, h: 128.76, l: 127.15, c: 128.49 },
            { o: 131.49, h: 139.66, l: 131.04, c: 138.89 },
            { o: 138.89, h: 148.24, l: 138.1, c: 147.97 },
            { o: 147.97, h: 156.53, l: 147.44, c: 156 },
            { o: 156, h: 156.37, l: 153.98, c: 154.14 },
            { o: 154.14, h: 154.37, l: 151.94, c: 152.26 },
            { o: 152.26, h: 152.71, l: 149.58, c: 150 },
            { o: 150, h: 150.23, l: 147.02, c: 147.39 },
            { o: 147.39, h: 147.77, l: 144.47, c: 144.94 },
            { o: 144.94, h: 145.15, l: 142.69, c: 143.06 },
            { o: 143.06, h: 143.47, l: 139.85, c: 140 },
            { o: 129.2, h: 129.55, l: 127.82, c: 129.29 },
            { o: 129.29, h: 133.62, l: 129.01, c: 133.16 },
            { o: 133.16, h: 137.87, l: 132.63, c: 137.57 },
            { o: 137.57, h: 142.21, l: 137.08, c: 141.87 },
            { o: 141.87, h: 146.52, l: 141.72, c: 146.11 },
            { o: 146.11, h: 150.97, l: 145.89, c: 150.53 },
            { o: 150.53, h: 152.89, l: 150.27, c: 152.79 },
            { o: 152.79, h: 158.61, l: 152.14, c: 158.24 },
            { o: 158.24, h: 162.37, l: 157.94, c: 162 }
          ],
          zones: [
            { from: 5, top: 128.49, bottom: 127.15, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "The gap down on bad news: the headline says sell, but price is at peak demand, which says buy."
      },
      {
        type: "tf",
        q: "A cluster of trading on a chart is always true supply or demand.",
        answer: false,
        explain: "A cluster is conventional support or resistance. Peak supply and demand show a specific pattern: a base with a strong move away."
      }
    ],
    practice: [
      {
        prompt: "A broker upgrade comes out and the stock gaps up. It is heading straight into a fresh supply zone that price left with a gap down. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 120, h: 128.79, l: 119.26, c: 128.18 },
            { o: 128.18, h: 138.31, l: 126.44, c: 137.82 },
            { o: 137.82, h: 151.64, l: 136.36, c: 150.98 },
            { o: 150.98, h: 156.29, l: 150.61, c: 155.82 },
            { o: 155.82, h: 168.68, l: 153.54, c: 168 },
            { o: 168, h: 168.73, l: 167.81, c: 168.48 },
            { o: 168.48, h: 168.65, l: 167.17, c: 167.47 },
            { o: 167.47, h: 168.57, l: 167.3, c: 168.27 },
            { o: 165.27, h: 165.49, l: 157.54, c: 157.91 },
            { o: 157.91, h: 158.62, l: 148.72, c: 149.16 },
            { o: 149.16, h: 149.8, l: 141.41, c: 142 },
            { o: 142, h: 145.52, l: 141.63, c: 144.97 },
            { o: 144.97, h: 146.82, l: 144.76, c: 146.66 },
            { o: 146.66, h: 150.45, l: 146.15, c: 150 },
            { o: 150, h: 153.81, l: 149.66, c: 153.25 },
            { o: 153.25, h: 156, l: 153.13, c: 155.59 },
            { o: 155.59, h: 158.16, l: 155.41, c: 158 },
            { o: 166.8, h: 168.1, l: 166.32, c: 166.67 },
            { o: 166.67, h: 166.95, l: 163.59, c: 163.77 },
            { o: 163.77, h: 163.89, l: 159.78, c: 159.89 },
            { o: 159.89, h: 160.09, l: 155.67, c: 156.09 },
            { o: 156.09, h: 156.31, l: 150.6, c: 150.84 },
            { o: 150.84, h: 151.31, l: 146.36, c: 146.51 },
            { o: 146.51, h: 146.63, l: 144.5, c: 144.64 },
            { o: 144.64, h: 144.99, l: 139.59, c: 140 }
          ],
          zones: [
            { from: 5, top: 168.73, bottom: 167.47, kind: "supply", label: "Supply" }
          ],
          notes: [
            { x: 17, y: 158.47, text: "Upgrade!" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Good news that brings price to peak supply is usually a sell. The upgrade buyers were buying into supply, and price fell away from the zone."
      }
    ],
    cards: [
      {
        front: "Two kinds of invitations?",
        back: "Market invitations (supply and demand) and everything else (news, tips, upgrades, indicators)."
      },
      { front: "Bad news into peak demand?", back: "Usually a buy." },
      { front: "Good news into peak supply?", back: "Usually a sell." },
      { front: "Where are all influences on price reflected?", back: "In price itself." },
      { front: "Your strategy is really your...?", back: "Psychological belief system." }
    ],
    mnemonic: "Headline in, level decides: news knocks, price answers."
  },
  {
    mentor: "seiden",
    n: 171,
    eli5: {
      oneLiner: "Levels are the walls. Price is the ball bouncing between them.",
      story: "Long ago Newton noticed that a moving thing keeps moving until something big enough stops it. Adam Smith noticed that when there is more supply than demand, the price falls. Nobody invented these rules; they were always true. In the market, supply and demand levels are the heavy walls, and price moving between them is the motion. Keep it that simple and stop piling on extra tools.",
      analogy: "Think of a ball rolling between two walls in a hallway. It rolls until it hits a wall, then turns. You only need to know where the walls are."
    },
    bigIdeas: [
      "Base every decision on supply and demand. Extra tools built on top of it add risk and confusion.",
      "Supply and demand are the mass; price moving from one level to the next opposing level is the motion.",
      "You cannot change a law that never changes. Simple beats complex."
    ],
    steps: [
      {
        title: "Find the first wall: demand",
        narration: "Price dropped, paused, and rallied hard. Demand overwhelmed supply at that base. That is one wall.",
        scene: {
          candles: [
            { o: 150, h: 150.76, l: 145.59, c: 146.24 },
            { o: 146.24, h: 146.81, l: 140.14, c: 141.05 },
            { o: 141.05, h: 141.46, l: 136.79, c: 137.26 },
            { o: 137.26, h: 138.28, l: 131.58, c: 132.37 },
            { o: 132.37, h: 132.9, l: 127.48, c: 128 },
            { o: 128, h: 128.6, l: 127.76, c: 128.41 },
            { o: 128.41, h: 128.68, l: 127.46, c: 127.79 },
            { o: 127.79, h: 128.64, l: 127.53, c: 128.46 },
            { o: 128.46, h: 138.49, l: 127.36, c: 137.18 },
            { o: 137.18, h: 144.38, l: 136.4, c: 143.62 },
            { o: 143.62, h: 151.85, l: 142.52, c: 151.33 },
            { o: 151.33, h: 158.97, l: 150.89, c: 158.49 },
            { o: 158.49, h: 166.84, l: 158, c: 166 },
            { o: 166, h: 166.53, l: 165.87, c: 166.21 },
            { o: 166.21, h: 166.44, l: 165.46, c: 165.61 },
            { o: 165.61, h: 166.23, l: 160.87, c: 161.07 },
            { o: 161.07, h: 161.41, l: 155.15, c: 155.63 },
            { o: 155.63, h: 156.44, l: 149.82, c: 150 },
            { o: 150, h: 150.43, l: 144.66, c: 145 },
            { o: 145, h: 145.54, l: 140.7, c: 141.29 },
            { o: 141.29, h: 141.8, l: 137.57, c: 137.94 },
            { o: 137.94, h: 138.31, l: 134.19, c: 134.42 },
            { o: 134.42, h: 134.92, l: 129.64, c: 129.86 },
            { o: 129.86, h: 130.36, l: 128.06, c: 129.46 },
            { o: 129.46, h: 135.49, l: 128.6, c: 134.79 },
            { o: 134.79, h: 141.01, l: 134.39, c: 140.56 },
            { o: 140.56, h: 146.65, l: 139.33, c: 146.17 },
            { o: 146.17, h: 154.59, l: 144.7, c: 153.4 },
            { o: 153.4, h: 158.06, l: 152.64, c: 157.75 },
            { o: 157.75, h: 164.98, l: 156.54, c: 164.11 },
            { o: 164.11, h: 166.01, l: 163.71, c: 164.41 },
            { o: 164.41, h: 165.2, l: 158.15, c: 159.26 },
            { o: 159.26, h: 159.41, l: 156.83, c: 156.96 },
            { o: 156.96, h: 157.69, l: 151.66, c: 152 }
          ],
          zones: [
            { from: 5, top: 128.46, bottom: 127.46, kind: "demand", label: "Demand (mass)" }
          ],
          reveal: 11
        }
      },
      {
        title: "Find the second wall: supply",
        narration: "Price rallied, paused, and fell hard. Supply overwhelmed demand at that base. That is the opposing wall.",
        scene: {
          candles: [
            { o: 150, h: 150.76, l: 145.59, c: 146.24 },
            { o: 146.24, h: 146.81, l: 140.14, c: 141.05 },
            { o: 141.05, h: 141.46, l: 136.79, c: 137.26 },
            { o: 137.26, h: 138.28, l: 131.58, c: 132.37 },
            { o: 132.37, h: 132.9, l: 127.48, c: 128 },
            { o: 128, h: 128.6, l: 127.76, c: 128.41 },
            { o: 128.41, h: 128.68, l: 127.46, c: 127.79 },
            { o: 127.79, h: 128.64, l: 127.53, c: 128.46 },
            { o: 128.46, h: 138.49, l: 127.36, c: 137.18 },
            { o: 137.18, h: 144.38, l: 136.4, c: 143.62 },
            { o: 143.62, h: 151.85, l: 142.52, c: 151.33 },
            { o: 151.33, h: 158.97, l: 150.89, c: 158.49 },
            { o: 158.49, h: 166.84, l: 158, c: 166 },
            { o: 166, h: 166.53, l: 165.87, c: 166.21 },
            { o: 166.21, h: 166.44, l: 165.46, c: 165.61 },
            { o: 165.61, h: 166.23, l: 160.87, c: 161.07 },
            { o: 161.07, h: 161.41, l: 155.15, c: 155.63 },
            { o: 155.63, h: 156.44, l: 149.82, c: 150 },
            { o: 150, h: 150.43, l: 144.66, c: 145 },
            { o: 145, h: 145.54, l: 140.7, c: 141.29 },
            { o: 141.29, h: 141.8, l: 137.57, c: 137.94 },
            { o: 137.94, h: 138.31, l: 134.19, c: 134.42 },
            { o: 134.42, h: 134.92, l: 129.64, c: 129.86 },
            { o: 129.86, h: 130.36, l: 128.06, c: 129.46 },
            { o: 129.46, h: 135.49, l: 128.6, c: 134.79 },
            { o: 134.79, h: 141.01, l: 134.39, c: 140.56 },
            { o: 140.56, h: 146.65, l: 139.33, c: 146.17 },
            { o: 146.17, h: 154.59, l: 144.7, c: 153.4 },
            { o: 153.4, h: 158.06, l: 152.64, c: 157.75 },
            { o: 157.75, h: 164.98, l: 156.54, c: 164.11 },
            { o: 164.11, h: 166.01, l: 163.71, c: 164.41 },
            { o: 164.41, h: 165.2, l: 158.15, c: 159.26 },
            { o: 159.26, h: 159.41, l: 156.83, c: 156.96 },
            { o: 156.96, h: 157.69, l: 151.66, c: 152 }
          ],
          zones: [
            { from: 5, top: 128.46, bottom: 127.46, kind: "demand", label: "Demand (mass)" },
            { from: 13, top: 166.53, bottom: 165.61, kind: "supply", label: "Supply (mass)" }
          ],
          reveal: 19
        }
      },
      {
        title: "Motion between mass",
        narration: "Price falls back into demand and turns up. It then travels all the way to the next opposing level, where it stops and turns again. Like Newton's law: motion continues until it meets an equal or greater force.",
        scene: {
          candles: [
            { o: 150, h: 150.76, l: 145.59, c: 146.24 },
            { o: 146.24, h: 146.81, l: 140.14, c: 141.05 },
            { o: 141.05, h: 141.46, l: 136.79, c: 137.26 },
            { o: 137.26, h: 138.28, l: 131.58, c: 132.37 },
            { o: 132.37, h: 132.9, l: 127.48, c: 128 },
            { o: 128, h: 128.6, l: 127.76, c: 128.41 },
            { o: 128.41, h: 128.68, l: 127.46, c: 127.79 },
            { o: 127.79, h: 128.64, l: 127.53, c: 128.46 },
            { o: 128.46, h: 138.49, l: 127.36, c: 137.18 },
            { o: 137.18, h: 144.38, l: 136.4, c: 143.62 },
            { o: 143.62, h: 151.85, l: 142.52, c: 151.33 },
            { o: 151.33, h: 158.97, l: 150.89, c: 158.49 },
            { o: 158.49, h: 166.84, l: 158, c: 166 },
            { o: 166, h: 166.53, l: 165.87, c: 166.21 },
            { o: 166.21, h: 166.44, l: 165.46, c: 165.61 },
            { o: 165.61, h: 166.23, l: 160.87, c: 161.07 },
            { o: 161.07, h: 161.41, l: 155.15, c: 155.63 },
            { o: 155.63, h: 156.44, l: 149.82, c: 150 },
            { o: 150, h: 150.43, l: 144.66, c: 145 },
            { o: 145, h: 145.54, l: 140.7, c: 141.29 },
            { o: 141.29, h: 141.8, l: 137.57, c: 137.94 },
            { o: 137.94, h: 138.31, l: 134.19, c: 134.42 },
            { o: 134.42, h: 134.92, l: 129.64, c: 129.86 },
            { o: 129.86, h: 130.36, l: 128.06, c: 129.46 },
            { o: 129.46, h: 135.49, l: 128.6, c: 134.79 },
            { o: 134.79, h: 141.01, l: 134.39, c: 140.56 },
            { o: 140.56, h: 146.65, l: 139.33, c: 146.17 },
            { o: 146.17, h: 154.59, l: 144.7, c: 153.4 },
            { o: 153.4, h: 158.06, l: 152.64, c: 157.75 },
            { o: 157.75, h: 164.98, l: 156.54, c: 164.11 },
            { o: 164.11, h: 166.01, l: 163.71, c: 164.41 },
            { o: 164.41, h: 165.2, l: 158.15, c: 159.26 },
            { o: 159.26, h: 159.41, l: 156.83, c: 156.96 },
            { o: 156.96, h: 157.69, l: 151.66, c: 152 }
          ],
          zones: [
            { from: 5, top: 128.46, bottom: 127.46, kind: "demand", label: "Demand (mass)" },
            { from: 13, top: 166.53, bottom: 165.61, kind: "supply", label: "Supply (mass)" }
          ],
          highlight: { from: 23, to: 30, label: "motion" },
          reveal: 31
        }
      },
      {
        title: "Where motion stops is your target",
        narration: "If you buy at the demand wall, the next supply wall is where you take profit. No indicator is needed to know where motion ends.",
        scene: {
          candles: [
            { o: 150, h: 150.76, l: 145.59, c: 146.24 },
            { o: 146.24, h: 146.81, l: 140.14, c: 141.05 },
            { o: 141.05, h: 141.46, l: 136.79, c: 137.26 },
            { o: 137.26, h: 138.28, l: 131.58, c: 132.37 },
            { o: 132.37, h: 132.9, l: 127.48, c: 128 },
            { o: 128, h: 128.6, l: 127.76, c: 128.41 },
            { o: 128.41, h: 128.68, l: 127.46, c: 127.79 },
            { o: 127.79, h: 128.64, l: 127.53, c: 128.46 },
            { o: 128.46, h: 138.49, l: 127.36, c: 137.18 },
            { o: 137.18, h: 144.38, l: 136.4, c: 143.62 },
            { o: 143.62, h: 151.85, l: 142.52, c: 151.33 },
            { o: 151.33, h: 158.97, l: 150.89, c: 158.49 },
            { o: 158.49, h: 166.84, l: 158, c: 166 },
            { o: 166, h: 166.53, l: 165.87, c: 166.21 },
            { o: 166.21, h: 166.44, l: 165.46, c: 165.61 },
            { o: 165.61, h: 166.23, l: 160.87, c: 161.07 },
            { o: 161.07, h: 161.41, l: 155.15, c: 155.63 },
            { o: 155.63, h: 156.44, l: 149.82, c: 150 },
            { o: 150, h: 150.43, l: 144.66, c: 145 },
            { o: 145, h: 145.54, l: 140.7, c: 141.29 },
            { o: 141.29, h: 141.8, l: 137.57, c: 137.94 },
            { o: 137.94, h: 138.31, l: 134.19, c: 134.42 },
            { o: 134.42, h: 134.92, l: 129.64, c: 129.86 },
            { o: 129.86, h: 130.36, l: 128.06, c: 129.46 },
            { o: 129.46, h: 135.49, l: 128.6, c: 134.79 },
            { o: 134.79, h: 141.01, l: 134.39, c: 140.56 },
            { o: 140.56, h: 146.65, l: 139.33, c: 146.17 },
            { o: 146.17, h: 154.59, l: 144.7, c: 153.4 },
            { o: 153.4, h: 158.06, l: 152.64, c: 157.75 },
            { o: 157.75, h: 164.98, l: 156.54, c: 164.11 },
            { o: 164.11, h: 166.01, l: 163.71, c: 164.41 },
            { o: 164.41, h: 165.2, l: 158.15, c: 159.26 },
            { o: 159.26, h: 159.41, l: 156.83, c: 156.96 },
            { o: 156.96, h: 157.69, l: 151.66, c: 152 }
          ],
          zones: [
            { from: 5, top: 128.46, bottom: 127.46, kind: "demand", label: "Demand (mass)" },
            { from: 13, top: 166.53, bottom: 165.61, kind: "supply", label: "Supply (mass)" }
          ],
          lines: [
            { y: 128.46, label: "Buy at demand", kind: "entry", from: 7 },
            { y: 165.61, label: "Target: next supply", kind: "tp", from: 14 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In Sam's market version of Newton, what is the \"mass\"?",
        options: ["Volume", "Supply and demand levels", "Moving averages", "The news"],
        answer: 1,
        explain: "Supply and demand are the mass. Price moving between them is the motion."
      },
      {
        type: "tf",
        q: "Adding more indicators and strategies makes a trader more successful.",
        answer: false,
        explain: "Traders fail by complicating things. A few basic principles never change."
      },
      {
        type: "mcq",
        q: "Price buys off demand and starts to rally. Where should the motion be expected to stop?",
        options: [
          "At the next moving average",
          "At the next opposing supply level",
          "After exactly 10 candles",
          "Nowhere, it goes forever"
        ],
        answer: 1,
        explain: "Price travels from a level where demand exceeds supply to the next level where supply exceeds demand."
      },
      {
        type: "spot",
        q: "Click the candles that show motion from demand to supply.",
        scene: {
          candles: [
            { o: 150, h: 150.76, l: 145.59, c: 146.24 },
            { o: 146.24, h: 146.81, l: 140.14, c: 141.05 },
            { o: 141.05, h: 141.46, l: 136.79, c: 137.26 },
            { o: 137.26, h: 138.28, l: 131.58, c: 132.37 },
            { o: 132.37, h: 132.9, l: 127.48, c: 128 },
            { o: 128, h: 128.6, l: 127.76, c: 128.41 },
            { o: 128.41, h: 128.68, l: 127.46, c: 127.79 },
            { o: 127.79, h: 128.64, l: 127.53, c: 128.46 },
            { o: 128.46, h: 138.49, l: 127.36, c: 137.18 },
            { o: 137.18, h: 144.38, l: 136.4, c: 143.62 },
            { o: 143.62, h: 151.85, l: 142.52, c: 151.33 },
            { o: 151.33, h: 158.97, l: 150.89, c: 158.49 },
            { o: 158.49, h: 166.84, l: 158, c: 166 },
            { o: 166, h: 166.53, l: 165.87, c: 166.21 },
            { o: 166.21, h: 166.44, l: 165.46, c: 165.61 },
            { o: 165.61, h: 166.23, l: 160.87, c: 161.07 },
            { o: 161.07, h: 161.41, l: 155.15, c: 155.63 },
            { o: 155.63, h: 156.44, l: 149.82, c: 150 },
            { o: 150, h: 150.43, l: 144.66, c: 145 },
            { o: 145, h: 145.54, l: 140.7, c: 141.29 },
            { o: 141.29, h: 141.8, l: 137.57, c: 137.94 },
            { o: 137.94, h: 138.31, l: 134.19, c: 134.42 },
            { o: 134.42, h: 134.92, l: 129.64, c: 129.86 },
            { o: 129.86, h: 130.36, l: 128.06, c: 129.46 },
            { o: 129.46, h: 135.49, l: 128.6, c: 134.79 },
            { o: 134.79, h: 141.01, l: 134.39, c: 140.56 },
            { o: 140.56, h: 146.65, l: 139.33, c: 146.17 },
            { o: 146.17, h: 154.59, l: 144.7, c: 153.4 },
            { o: 153.4, h: 158.06, l: 152.64, c: 157.75 },
            { o: 157.75, h: 164.98, l: 156.54, c: 164.11 },
            { o: 164.11, h: 166.01, l: 163.71, c: 164.41 },
            { o: 164.41, h: 165.2, l: 158.15, c: 159.26 },
            { o: 159.26, h: 159.41, l: 156.83, c: 156.96 },
            { o: 156.96, h: 157.69, l: 151.66, c: 152 }
          ],
          zones: [
            { from: 5, top: 128.46, bottom: 127.46, kind: "demand", label: "Demand (mass)" },
            { from: 13, top: 166.53, bottom: 165.61, kind: "supply", label: "Supply (mass)" }
          ]
        },
        answer: { from: 23, to: 30 },
        explain: "From the touch of demand to the touch of supply: that is the motion between two masses."
      },
      {
        type: "tf",
        q: "Newton and Adam Smith invented the laws they described.",
        answer: false,
        explain: "They described realities that always existed. That is the point: trade the reality that never changes."
      }
    ],
    practice: [
      {
        prompt: "Price is falling back into fresh demand. The nearest supply wall is far above. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 165, h: 165.33, l: 159.01, c: 159.36 },
            { o: 159.36, h: 160.72, l: 150.58, c: 151.29 },
            { o: 151.29, h: 151.67, l: 145.82, c: 146.43 },
            { o: 146.43, h: 148.03, l: 137.68, c: 138.1 },
            { o: 138.1, h: 138.78, l: 131.49, c: 132 },
            { o: 132, h: 132.39, l: 131.68, c: 132.22 },
            { o: 132.22, h: 132.39, l: 131.5, c: 131.78 },
            { o: 131.78, h: 132.44, l: 131.44, c: 132.23 },
            { o: 132.23, h: 140, l: 131.57, c: 139.65 },
            { o: 139.65, h: 150.57, l: 139.03, c: 150.05 },
            { o: 150.05, h: 158.84, l: 149.49, c: 158 },
            { o: 158, h: 158.49, l: 157.76, c: 158.27 },
            { o: 158.27, h: 158.52, l: 157.68, c: 157.8 },
            { o: 157.8, h: 158.24, l: 154.52, c: 154.83 },
            { o: 154.83, h: 154.96, l: 153.17, c: 153.31 },
            { o: 153.31, h: 153.64, l: 149.8, c: 150 },
            { o: 150, h: 150.21, l: 146.29, c: 146.85 },
            { o: 146.85, h: 147.23, l: 142.43, c: 142.84 },
            { o: 142.84, h: 143.66, l: 136.03, c: 137.16 },
            { o: 137.16, h: 137.35, l: 133.22, c: 133.63 },
            { o: 133.63, h: 134.05, l: 131.91, c: 133.03 },
            { o: 133.03, h: 136.26, l: 132.75, c: 136.12 },
            { o: 136.12, h: 139.73, l: 136, c: 139.5 },
            { o: 139.5, h: 143.58, l: 139.35, c: 143.25 },
            { o: 143.25, h: 147.15, l: 143.09, c: 146.75 },
            { o: 146.75, h: 150.03, l: 146.63, c: 149.8 },
            { o: 149.8, h: 153.99, l: 149.51, c: 153.69 },
            { o: 153.69, h: 156.26, l: 153.5, c: 156 }
          ],
          zones: [
            { from: 5, top: 132.23, bottom: 131.44, kind: "demand", label: "Demand" },
            { from: 11, top: 158.52, bottom: 157.8, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Demand wall below, plenty of room to the supply wall above. Buy the demand; motion carried price up toward supply."
      }
    ],
    cards: [
      {
        front: "Newton's law in market terms?",
        back: "Price keeps moving until it meets a level with an equal or greater opposing force."
      },
      { front: "Adam Smith's rule?", back: "When supply exceeds demand at a price, price declines." },
      {
        front: "Mass and motion in markets?",
        back: "Mass = supply and demand; motion = price moving between them."
      },
      { front: "Who pays whom, in Sam's words?", back: "Those who can't keep things simple pay those who can." }
    ],
    mnemonic: "Walls and a ball: levels are walls, price is the ball."
  },
  {
    mentor: "seiden",
    n: 174,
    eli5: {
      oneLiner: "Even in an uptrend, sell when price hits a big supply wall.",
      story: "The NASDAQ had gone up for days and new students wanted to buy. The teachers looked at the daily chart and saw a supply level just above, where price had dropped before. On the small chart, the green candles grew bigger and bigger as price ran up, which is what scared, excited buyers look like. The teachers sold to those buyers at the supply. Price then fell far and fast the same day.",
      analogy: "It is like kids running faster and faster toward a closed door. The faster they run at the end, the harder they bump into it."
    },
    bigIdeas: [
      "Our job each day is to search for low risk, high reward chances, not to trade.",
      "Uptrends end at big supply. Buy in uptrends, but not when price nears major supply.",
      "Big green candles at the end of a run show emotional novice buying into the wall."
    ],
    steps: [
      {
        title: "The big chart shows the wall",
        narration: "On the daily chart price rallied, stalled, then dropped. That rally-base-drop left supply above the market. Mark it before the open.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ],
          reveal: 11
        }
      },
      {
        title: "The uptrend is still on",
        narration: "Price climbs back. The trend is up and most people only want to buy. But price is now heading toward the supply we marked.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ],
          reveal: 16
        }
      },
      {
        title: "Candles grow at the end",
        narration: "Look at the candles: each one is bigger than the last. The largest candles at the end of a run are novices chasing. They are buying after a rally and into supply: the two mistakes.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ],
          highlight: { from: 15, to: 19, label: "growing candles" },
          reveal: 21
        }
      },
      {
        title: "Sell to the late buyers",
        narration: "Price reaches the supply. We sell at the bottom line with a stop just above the top. The late buyers become the fuel for our short.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ],
          lines: [
            { y: 159.57, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 160.85, label: "Stop above distal", kind: "sl", from: 7 }
          ],
          reveal: 22
        }
      },
      {
        title: "Far and fast",
        narration: "Price falls hard and fast from the supply, even though the bigger trend was up. There is a time to short an uptrend: at a level where supply exceeds demand.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ],
          lines: [
            { y: 159.57, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 160.85, label: "Stop above distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "You should never sell short while the trend is up.",
        answer: false,
        explain: "There is a time and place to short an uptrend: when price reaches a level where supply exceeds demand."
      },
      {
        type: "spot",
        q: "Click the candles that show emotional novice buying.",
        scene: {
          candles: [
            { o: 118, h: 125.31, l: 117.09, c: 124.16 },
            { o: 124.16, h: 133.96, l: 123.37, c: 133.49 },
            { o: 133.49, h: 140.3, l: 132.66, c: 139.48 },
            { o: 139.48, h: 145.2, l: 138.8, c: 144.55 },
            { o: 144.55, h: 153.52, l: 143.01, c: 151.96 },
            { o: 151.96, h: 161.69, l: 151.54, c: 160 },
            { o: 160, h: 160.53, l: 159.7, c: 160.27 },
            { o: 160.27, h: 160.6, l: 159.39, c: 159.57 },
            { o: 159.57, h: 159.78, l: 154.27, c: 154.5 },
            { o: 154.5, h: 154.8, l: 149.22, c: 149.72 },
            { o: 149.72, h: 149.94, l: 144.1, c: 144.47 },
            { o: 144.47, h: 144.63, l: 139.74, c: 140 },
            { o: 140, h: 141.68, l: 139.73, c: 141.4 },
            { o: 141.4, h: 143.47, l: 141.17, c: 143.15 },
            { o: 143.15, h: 145.38, l: 142.95, c: 145 },
            { o: 145, h: 146.12, l: 144.88, c: 146 },
            { o: 146, h: 147.6, l: 145.94, c: 147.4 },
            { o: 147.4, h: 149.53, l: 147.17, c: 149.4 },
            { o: 149.4, h: 152.44, l: 149.28, c: 152.2 },
            { o: 152.2, h: 156.51, l: 151.81, c: 156 },
            { o: 156, h: 159.59, l: 155.9, c: 159.27 },
            { o: 159.27, h: 160.08, l: 158.2, c: 158.57 },
            { o: 158.57, h: 158.93, l: 154.03, c: 154.81 },
            { o: 154.81, h: 155.46, l: 150.89, c: 151.41 },
            { o: 151.41, h: 151.66, l: 146.75, c: 147.55 },
            { o: 147.55, h: 147.82, l: 144.9, c: 145.25 },
            { o: 145.25, h: 145.75, l: 140.7, c: 140.93 },
            { o: 140.93, h: 141.54, l: 137.72, c: 138 }
          ],
          zones: [
            { from: 6, top: 160.6, bottom: 159.57, kind: "supply", label: "Daily supply" }
          ]
        },
        answer: { from: 15, to: 19 },
        explain: "The green candles that grow larger at the end of the run. Novices jump on the bandwagon right into the wall."
      },
      {
        type: "mcq",
        q: "Which timeframe shows the turning point, and which shows the novices?",
        options: [
          "Small shows the level, large shows the novices",
          "Large shows the level, small shows the novices chasing",
          "Both show only noise",
          "Only the 1-minute chart matters"
        ],
        answer: 1,
        explain: "Larger timeframes show the turning points; smaller ones show novices jumping in at the wrong time."
      },
      {
        type: "mcq",
        q: "What is the two-fold challenge Sam describes?",
        options: [
          "Fast data and a big account",
          "Know what a low risk opportunity looks like, and have the self-control not to follow the crowd",
          "Pick a broker and an indicator",
          "Read news and earnings"
        ],
        answer: 1,
        explain: "You must know where the brick walls are and refuse to jump on the bandwagon."
      },
      {
        type: "order",
        q: "Order the plan for this short.",
        items: [
          "Mark daily supply before the open",
          "Watch price rally toward it",
          "Notice the growing green candles",
          "Sell at the zone with a stop above"
        ],
        explain: "The level is planned first. The small-timeframe emotion just confirms who is on the other side."
      }
    ],
    practice: [
      {
        prompt: "Uptrend. Price is racing up with bigger and bigger green candles toward the daily supply you marked last night. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 116, h: 122.31, l: 115.41, c: 121.87 },
            { o: 121.87, h: 128.93, l: 121.37, c: 127.91 },
            { o: 127.91, h: 136.13, l: 126.8, c: 135.54 },
            { o: 135.54, h: 142.67, l: 134.97, c: 142.05 },
            { o: 142.05, h: 149.09, l: 140.89, c: 148.03 },
            { o: 148.03, h: 157.49, l: 146.75, c: 156 },
            { o: 156, h: 156.6, l: 155.81, c: 156.29 },
            { o: 156.29, h: 156.44, l: 155.31, c: 155.66 },
            { o: 155.66, h: 156.13, l: 149.49, c: 150.14 },
            { o: 150.14, h: 150.48, l: 145.02, c: 145.18 },
            { o: 145.18, h: 145.48, l: 141.14, c: 141.27 },
            { o: 141.27, h: 141.9, l: 135.47, c: 136 },
            { o: 136, h: 137.83, l: 135.85, c: 137.59 },
            { o: 137.59, h: 138.88, l: 137.52, c: 138.75 },
            { o: 138.75, h: 140.24, l: 138.49, c: 140 },
            { o: 140, h: 141.38, l: 139.82, c: 141.2 },
            { o: 141.2, h: 142.91, l: 141.13, c: 142.8 },
            { o: 142.8, h: 145.53, l: 142.54, c: 145.2 },
            { o: 145.2, h: 148.97, l: 144.88, c: 148.6 },
            { o: 148.6, h: 153.25, l: 148.45, c: 152.8 },
            { o: 152.8, h: 155.45, l: 152.7, c: 155.36 },
            { o: 155.36, h: 156.13, l: 154.24, c: 154.66 },
            { o: 154.66, h: 154.87, l: 151.42, c: 151.65 },
            { o: 151.65, h: 152.15, l: 147.11, c: 147.45 },
            { o: 147.45, h: 147.58, l: 145.09, c: 145.38 },
            { o: 145.38, h: 145.6, l: 140.91, c: 141.44 },
            { o: 141.44, h: 141.9, l: 137.33, c: 137.94 },
            { o: 137.94, h: 138.4, l: 134.69, c: 135 }
          ],
          zones: [
            { from: 6, top: 156.6, bottom: 155.66, kind: "supply", label: "Daily supply" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "The run is ending at daily supply with emotional candles. Sell to the late buyers. Price turned down hard from the zone."
      }
    ],
    cards: [
      { front: "Our daily job, per Sam?", back: "Search for low risk, high reward opportunity, not to trade." },
      { front: "Where do uptrends end?", back: "At big supply levels." },
      { front: "Largest candles at the end of a run mean?", back: "Emotional novice buying." },
      { front: "Two mistakes of the buyers at A?", back: "Buying after a rally, and buying into supply." }
    ],
    mnemonic: "Bigger, faster, closer to the wall: time to sell, not to chase."
  },
  {
    mentor: "seiden",
    n: 178,
    eli5: {
      oneLiner: "Plan the whole trade, enter every order, then walk away.",
      story: "Sam explained a trade with six letters. A is the supply where price stalled after a rally and had to fall. B is how fast it fell. C is the steep rally back with no buying zones inside it. D is the short, E is the stop just above the zone, and F is the target three times the risk. Once all the orders were in, the trader went to do something more important.",
      analogy: "It is like setting the oven timer: put the food in, set the time, and go play. Standing and staring at the oven does not cook it faster."
    },
    bigIdeas: [
      "Supply is a rally-base-drop. Drop-base-drop bases in the middle of a move usually do not work well.",
      "The faster price left A, and the steeper it returns with no demand inside, the better.",
      "Fixed dollar risk, at least 3:1 target, all orders in, then walk away. Watching trades keeps the biggest risk (you) alive."
    ],
    steps: [
      {
        title: "A: rally-base-drop",
        narration: "Price rallied, paused for three candles, then could not stay there. This rally-base-drop is the turning point where supply beat demand.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          highlight: { from: 5, to: 7, label: "A" },
          reveal: 8
        }
      },
      {
        title: "B: the rate of decline",
        narration: "Price fell fast and far from A. The faster the drop, the bigger the imbalance at the base.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          highlight: { from: 8, to: 11, label: "B: fast drop" },
          reveal: 12
        }
      },
      {
        title: "C: the steep return",
        narration: "Price rallies steeply back toward A, with no base (no demand) forming inside the rally. A steep rally into supply tends to fall back at a similar rate.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          highlight: { from: 14, to: 18, label: "C: steep rally" },
          reveal: 19
        }
      },
      {
        title: "D, E, F: the full order set",
        narration: "D: short at the bottom line. E: protective stop just above the zone, because price could not get above it before. F: target three times the risk. Size so the dollar risk is fixed, then walk away.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          lines: [
            { y: 153.68, label: "D: short", kind: "entry", from: 7 },
            { y: 154.88, label: "E: stop", kind: "sl", from: 7 },
            { y: 150.08, label: "F: target 3:1", kind: "tp", from: 7 }
          ],
          reveal: 20
        }
      },
      {
        title: "The trade works without you",
        narration: "Price holds under the zone for a while, then drops through the target. Nobody had to watch it.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          lines: [
            { y: 153.68, label: "D: short", kind: "entry", from: 7 },
            { y: 154.88, label: "E: stop", kind: "sl", from: 7 },
            { y: 150.08, label: "F: target 3:1", kind: "tp", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put Sam's A to F walkthrough in order.",
        items: [
          "A: rally-base-drop supply",
          "B: fast decline away",
          "C: steep rally back with no demand inside",
          "D: short at the zone",
          "E: stop just above the zone",
          "F: target at 3:1"
        ],
        explain: "Level, proof of strength, the return, then entry, stop and target."
      },
      {
        type: "mcq",
        q: "Which base is a lower-quality supply level?",
        options: [
          "Rally-base-drop",
          "Drop-base-drop in the middle of a move",
          "A base followed by a gap down",
          "A base with only two candles"
        ],
        answer: 1,
        explain: "A drop-base-drop is a pause inside a move and typically does not work well."
      },
      {
        type: "mcq",
        q: "Stop is 4 points, $50 a point, 5 contracts. What is the risk?",
        options: ["$200", "$1,000", "$3,000", "$50"],
        answer: 1,
        explain: "4 points x $50 = $200 per contract; 5 contracts = $1,000. The target at 12 points makes $3,000."
      },
      {
        type: "spot",
        q: "Click the steep rally back into supply (part C).",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ]
        },
        answer: { from: 14, to: 18 },
        explain: "The steep, base-free rally back to A. No demand inside it means little to stop the fall later."
      },
      {
        type: "tf",
        q: "Sitting in front of the screen watching your open trade lowers your risk.",
        answer: false,
        explain: "Watching keeps the largest risk, you, alive. Enter the whole trade and walk away."
      }
    ],
    practice: [
      {
        prompt: "Price fell, paused for three candles, then kept falling. Now it rallies back to that pause. Is this a quality short?",
        scene: {
          candles: [
            { o: 170, h: 170.89, l: 164.77, c: 165.59 },
            { o: 165.59, h: 165.86, l: 159.9, c: 160.32 },
            { o: 160.32, h: 161.14, l: 153.27, c: 154.23 },
            { o: 154.23, h: 154.99, l: 149.13, c: 150 },
            { o: 150, h: 150.78, l: 149.79, c: 150.44 },
            { o: 150.44, h: 150.69, l: 149.24, c: 149.58 },
            { o: 149.58, h: 150.5, l: 149.37, c: 150.33 },
            { o: 150.33, h: 150.84, l: 145.14, c: 145.47 },
            { o: 145.47, h: 145.8, l: 141.89, c: 142.19 },
            { o: 142.19, h: 142.65, l: 137.26, c: 137.7 },
            { o: 137.7, h: 137.9, l: 133.78, c: 134 },
            { o: 134, h: 137.8, l: 133.49, c: 137.26 },
            { o: 137.26, h: 143.36, l: 136.92, c: 142.27 },
            { o: 142.27, h: 144.35, l: 142.11, c: 144.09 },
            { o: 144.09, h: 149.1, l: 143.88, c: 148.38 },
            { o: 148.38, h: 149.88, l: 148, c: 149.78 },
            { o: 149.78, h: 151.65, l: 149.67, c: 151.52 },
            { o: 151.52, h: 153.13, l: 151.45, c: 152.92 },
            { o: 152.92, h: 155.19, l: 152.48, c: 155.04 },
            { o: 155.04, h: 157.34, l: 154.63, c: 157.07 },
            { o: 157.07, h: 159.04, l: 156.73, c: 158.78 }
          ],
          zones: [
            { from: 4, top: 150.78, bottom: 149.58, kind: "supply", label: "Drop-base-drop" }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "This is a drop-base-drop: a pause in the middle of a move, not a turning point. Sam skips these. Price ran straight through."
      },
      {
        prompt: "Place the short on this rally-base-drop supply: entry, stop and a 3:1 target.",
        scene: {
          candles: [
            { o: 132, h: 136.54, l: 131.53, c: 135.88 },
            { o: 135.88, h: 141.1, l: 135.13, c: 140.35 },
            { o: 140.35, h: 147.15, l: 139.45, c: 146.18 },
            { o: 146.18, h: 150.13, l: 145.78, c: 149.95 },
            { o: 149.95, h: 154.58, l: 149.44, c: 154 },
            { o: 154, h: 154.52, l: 153.74, c: 154.26 },
            { o: 154.26, h: 154.52, l: 153.41, c: 153.68 },
            { o: 153.68, h: 154.63, l: 153.32, c: 154.39 },
            { o: 154.39, h: 154.7, l: 148.61, c: 149.06 },
            { o: 149.06, h: 149.24, l: 142.45, c: 143.13 },
            { o: 143.13, h: 143.32, l: 136.65, c: 136.82 },
            { o: 136.82, h: 137.29, l: 131.69, c: 132 },
            { o: 132, h: 132.48, l: 131.74, c: 132.3 },
            { o: 132.3, h: 132.65, l: 131.15, c: 131.57 },
            { o: 131.57, h: 135.88, l: 131.34, c: 135.68 },
            { o: 135.68, h: 140.62, l: 135.53, c: 140.11 },
            { o: 140.11, h: 144.55, l: 139.82, c: 144.41 },
            { o: 144.41, h: 149.54, l: 144.21, c: 149.08 },
            { o: 149.08, h: 153.58, l: 148.6, c: 153.28 },
            { o: 153.28, h: 154.16, l: 152.73, c: 153.08 },
            { o: 153.08, h: 153.62, l: 152.91, c: 153.39 },
            { o: 153.39, h: 153.52, l: 152.69, c: 152.78 },
            { o: 152.78, h: 152.85, l: 151.48, c: 151.63 },
            { o: 151.63, h: 151.68, l: 150.26, c: 150.49 },
            { o: 150.49, h: 150.55, l: 149.44, c: 149.6 },
            { o: 149.6, h: 149.78, l: 147.96, c: 148.11 },
            { o: 148.11, h: 148.25, l: 146.98, c: 147.08 }
          ],
          zones: [
            { from: 5, top: 154.63, bottom: 153.68, kind: "supply", label: "A: supply" }
          ],
          reveal: 19
        },
        task: "pick-entry",
        answer: { entry: 153.68, sl: 154.88, tp: 150.08 },
        explain: "Entry on the bottom line, stop just above the top line, target three times the risk below. Then walk away."
      }
    ],
    cards: [
      { front: "Supply pattern Sam trusts?", back: "Rally-base-drop." },
      { front: "Why skip drop-base-drop?", back: "It is a pause in the middle of a move, typically a weak level." },
      { front: "Best kind of return into supply?", back: "A steep rally with no demand forming inside it." },
      { front: "Minimum target?", back: "3:1 or more." },
      { front: "After all orders are in?", back: "Walk away and do something more important." }
    ],
    mnemonic: "A-B-C, then D-E-F: level, speed, return; entry, exit, profit."
  },
  {
    mentor: "seiden",
    n: 182,
    eli5: {
      oneLiner: "Watch what price shows you. A quiet pause, then a crash, marks supply.",
      story: "Hours before the market opened, Sam's class saw price resting quietly in a small cluster. Then one big red candle crashed out of it. That told them sellers were in charge there, so they drew two lines around the cluster. Hours later price rallied back into those lines, and they sold to the buyers. Price dropped to their target and a student made 13 points.",
      analogy: "It is like a dog that was calm and then suddenly ran out of a yard. Something in that yard scared it. If it walks back in, expect it to run again."
    },
    bigIdeas: [
      "Most big mistakes come from not paying attention to the reality in front of you.",
      "Balance (a cluster) followed by a big collapse candle = supply at the origin.",
      "Short the first rally back into it. Assess risk first, then reward."
    ],
    steps: [
      {
        title: "A quiet cluster",
        narration: "Price sits in a small cluster. Buyers and sellers are balanced here. Nothing exciting yet.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          highlight: { from: 5, to: 8, label: "balance" },
          reveal: 9
        }
      },
      {
        title: "One big red candle",
        narration: "Then price collapses with one big red candle. That candle says supply greatly exceeded demand at the origin of the decline.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          highlight: { from: 9, to: 9, label: "collapse" },
          reveal: 10
        }
      },
      {
        title: "Draw the sell zone before the open",
        narration: "Wrap the cluster with two lines. That is the supply zone, drawn in advance while price chops lower. Now we just wait.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          zones: [
            { from: 5, top: 160.51, bottom: 159.69, kind: "supply", label: "Supply" }
          ],
          reveal: 23
        }
      },
      {
        title: "Risk first, then reward",
        narration: "Price rallies into the bottom line. Entry there, stop above the top line: that is the risk. The target is the next demand below. The buyers here bought after a rally and into supply.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          zones: [
            { from: 5, top: 160.51, bottom: 159.69, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 159.69, label: "Entry (proximal)", kind: "entry", from: 8 },
            { y: 160.76, label: "Stop above distal", kind: "sl", from: 8 },
            { y: 141, label: "Target: opposing level", kind: "tp", from: 8 }
          ],
          reveal: 24
        }
      },
      {
        title: "Paid for paying attention",
        narration: "Price drops to the target and beyond. The market gave the information to anyone who listened.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          zones: [
            { from: 5, top: 160.51, bottom: 159.69, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 159.69, label: "Entry (proximal)", kind: "entry", from: 8 },
            { y: 160.76, label: "Stop above distal", kind: "sl", from: 8 },
            { y: 141, label: "Target: opposing level", kind: "tp", from: 8 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle that told the class where supply was.",
        scene: {
          candles: [
            { o: 138, h: 142.37, l: 137.65, c: 141.79 },
            { o: 141.79, h: 147.83, l: 141.37, c: 147.24 },
            { o: 147.24, h: 151.2, l: 146.68, c: 150.56 },
            { o: 150.56, h: 155.51, l: 150.21, c: 154.9 },
            { o: 154.9, h: 160.46, l: 153.79, c: 160 },
            { o: 160, h: 160.45, l: 159.88, c: 160.3 },
            { o: 160.3, h: 160.51, l: 159.49, c: 159.69 },
            { o: 159.69, h: 160.43, l: 159.45, c: 160.3 },
            { o: 160.3, h: 160.5, l: 159.72, c: 159.83 },
            { o: 159.83, h: 160.57, l: 149.06, c: 150 },
            { o: 150, h: 150.32, l: 149.73, c: 150.23 },
            { o: 150.23, h: 150.59, l: 147.83, c: 148.25 },
            { o: 148.25, h: 149.72, l: 147.81, c: 149.51 },
            { o: 149.51, h: 150.12, l: 146.93, c: 147.35 },
            { o: 147.35, h: 148.18, l: 147.26, c: 148 },
            { o: 148, h: 150.86, l: 147.85, c: 150.16 },
            { o: 150.16, h: 150.27, l: 149.68, c: 149.85 },
            { o: 149.85, h: 152.62, l: 149.18, c: 152.31 },
            { o: 152.31, h: 152.59, l: 151.67, c: 151.9 },
            { o: 151.9, h: 154.29, l: 151.21, c: 154 },
            { o: 154, h: 155.64, l: 153.72, c: 155.51 },
            { o: 155.51, h: 157.29, l: 155.41, c: 157.07 },
            { o: 157.07, h: 158.37, l: 157.01, c: 158.29 },
            { o: 158.29, h: 160.02, l: 157.81, c: 158.89 },
            { o: 158.89, h: 159.02, l: 155.37, c: 155.57 },
            { o: 155.57, h: 155.82, l: 151.64, c: 151.88 },
            { o: 151.88, h: 152.16, l: 149.15, c: 149.26 },
            { o: 149.26, h: 149.63, l: 145.13, c: 145.46 },
            { o: 145.46, h: 145.64, l: 142.74, c: 143.03 },
            { o: 143.03, h: 143.28, l: 139.67, c: 140 }
          ],
          zones: [
            { from: 5, top: 160.51, bottom: 159.69, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 9, to: 9 },
        explain: "The big red collapse candle out of the cluster. It shows supply overwhelmed demand at its origin."
      },
      {
        type: "mcq",
        q: "Where do you draw the supply zone?",
        options: [
          "Around the big red candle's low",
          "Around the cluster where price was balanced before the collapse",
          "At a round number",
          "At the day's low"
        ],
        answer: 1,
        explain: "Wrap the base, the balance just before the collapse. That is the origin of the decline."
      },
      {
        type: "tf",
        q: "Sam says to look at reward first and then decide if the risk is acceptable.",
        answer: false,
        explain: "Focus first on objectively assessing risk, then reward. Not every trade works."
      },
      {
        type: "mcq",
        q: "Zak closed his first short early because it looked close to his stop, then re-entered. What does that show?",
        options: [
          "Stops are useless",
          "Emotion can break a plan; the rules-based re-entry still paid +13.25 points",
          "He should never re-enter",
          "Targets should be tiny"
        ],
        answer: 1,
        explain: "He lost 0.75 by acting on a feeling, but the re-entry at the same level made 13.25 points. Stick to the plan."
      }
    ],
    practice: [
      {
        prompt: "A quiet cluster broke with one huge red candle. Price has chopped lower and is now rallying back to the cluster for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 126, h: 130.49, l: 125.4, c: 129.79 },
            { o: 129.79, h: 136.38, l: 128.86, c: 135.43 },
            { o: 135.43, h: 138.65, l: 134.95, c: 138.2 },
            { o: 138.2, h: 143.83, l: 137.47, c: 143.2 },
            { o: 143.2, h: 148.62, l: 142.24, c: 148 },
            { o: 148, h: 148.58, l: 147.82, c: 148.44 },
            { o: 148.44, h: 148.57, l: 147.53, c: 147.68 },
            { o: 147.68, h: 148.57, l: 147.57, c: 148.42 },
            { o: 148.42, h: 148.67, l: 147.5, c: 147.79 },
            { o: 147.79, h: 148.71, l: 137.5, c: 138 },
            { o: 138, h: 139.67, l: 137.86, c: 139.42 },
            { o: 139.42, h: 139.66, l: 137.56, c: 137.96 },
            { o: 137.96, h: 140.93, l: 137.26, c: 140.59 },
            { o: 140.59, h: 140.89, l: 138.86, c: 139.23 },
            { o: 139.23, h: 141.67, l: 139.08, c: 141.06 },
            { o: 141.06, h: 141.12, l: 140.9, c: 141 },
            { o: 141, h: 142.05, l: 140.95, c: 142 },
            { o: 142, h: 143.51, l: 141.92, c: 143.26 },
            { o: 143.26, h: 145.08, l: 143.09, c: 144.98 },
            { o: 144.98, h: 146.53, l: 144.75, c: 146.28 },
            { o: 146.28, h: 148.08, l: 145.87, c: 146.88 },
            { o: 146.88, h: 147.06, l: 143.96, c: 144.04 },
            { o: 144.04, h: 144.23, l: 139.76, c: 139.9 },
            { o: 139.9, h: 140.04, l: 137.48, c: 137.73 },
            { o: 137.73, h: 138.11, l: 133.87, c: 134.1 },
            { o: 134.1, h: 134.45, l: 130.26, c: 130.56 },
            { o: 130.56, h: 130.76, l: 127.81, c: 128 }
          ],
          zones: [
            { from: 5, top: 148.67, bottom: 147.68, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "First return to fresh supply after a collapse candle is the high-odds short. Price dropped away again."
      }
    ],
    cards: [
      { front: "Cluster + big red candle means?", back: "Supply at the origin of the decline (a sell zone)." },
      { front: "Order of assessment?", back: "Risk first, then reward." },
      { front: "When is the zone drawn?", back: "Before the open, before price comes back." },
      { front: "Who gets market information?", back: "Only those who listen (pay attention)." }
    ],
    mnemonic: "Quiet, crash, come back: sell the quiet spot."
  },
  {
    mentor: "seiden",
    n: 186,
    eli5: {
      oneLiner: "Use levels to protect your savings, not just to trade.",
      story: "Supply and demand works on anything people buy and sell, even a slow retirement fund. You can buy a fund when it drops into its demand, without knowing what it holds. But watch the money it is priced in: a fund can go up in dollars while the dollar itself falls from supply. And when the stock index comes back up to supply, you can protect your account with a hedge.",
      analogy: "It is like wearing a raincoat when you see dark clouds. You still go out, but you do not get soaked."
    },
    bigIdeas: [
      "The biggest turns happen where demand and supply are most out of balance, on any chart, even mutual funds.",
      "Watch the currency: dollar assets lose buying power when the dollar falls from supply.",
      "When the index returns to supply, hedge: short SPY or futures, or buy puts."
    ],
    steps: [
      {
        title: "A: supply on the index",
        narration: "The index rallied, paused at the top and dropped away. That base is supply: A.",
        scene: {
          candles: [
            { o: 128, h: 135.46, l: 127.56, c: 134.56 },
            { o: 134.56, h: 141.41, l: 133.51, c: 141.09 },
            { o: 141.09, h: 151.57, l: 139.24, c: 151.11 },
            { o: 151.11, h: 160.33, l: 150.64, c: 159.81 },
            { o: 159.81, h: 166.76, l: 158.99, c: 166 },
            { o: 166, h: 166.81, l: 165.73, c: 166.46 },
            { o: 166.46, h: 166.71, l: 165.37, c: 165.57 },
            { o: 165.57, h: 166.63, l: 165.36, c: 166.33 },
            { o: 166.33, h: 166.78, l: 161.03, c: 161.37 },
            { o: 161.37, h: 161.64, l: 156.97, c: 157.13 },
            { o: 157.13, h: 157.57, l: 152.69, c: 152.85 },
            { o: 152.85, h: 152.98, l: 147.62, c: 148 },
            { o: 148, h: 148.66, l: 147.66, c: 148.31 },
            { o: 148.31, h: 148.71, l: 146.84, c: 147.29 },
            { o: 147.29, h: 151.65, l: 146.73, c: 151.44 },
            { o: 151.44, h: 154.1, l: 151.29, c: 153.97 },
            { o: 153.97, h: 157.46, l: 153.64, c: 156.85 },
            { o: 156.85, h: 161.97, l: 156.34, c: 161.28 },
            { o: 161.28, h: 164.55, l: 160.86, c: 164.17 },
            { o: 164.17, h: 166.07, l: 163.87, c: 164.77 },
            { o: 164.77, h: 164.92, l: 161.28, c: 161.62 },
            { o: 161.62, h: 161.9, l: 154.9, c: 155.08 },
            { o: 155.08, h: 155.22, l: 150.76, c: 151.08 },
            { o: 151.08, h: 151.19, l: 148.32, c: 148.48 },
            { o: 148.48, h: 148.99, l: 142.09, c: 142.34 },
            { o: 142.34, h: 142.64, l: 139.05, c: 139.24 },
            { o: 139.24, h: 139.79, l: 133.57, c: 134 }
          ],
          zones: [
            { from: 5, top: 166.81, bottom: 165.57, kind: "supply", label: "A: index supply" }
          ],
          reveal: 14
        }
      },
      {
        title: "B: the first revisit",
        narration: "Price rallies back up to A for the first time. Many people feel happy as their accounts grow. But this is exactly where supply waits.",
        scene: {
          candles: [
            { o: 128, h: 135.46, l: 127.56, c: 134.56 },
            { o: 134.56, h: 141.41, l: 133.51, c: 141.09 },
            { o: 141.09, h: 151.57, l: 139.24, c: 151.11 },
            { o: 151.11, h: 160.33, l: 150.64, c: 159.81 },
            { o: 159.81, h: 166.76, l: 158.99, c: 166 },
            { o: 166, h: 166.81, l: 165.73, c: 166.46 },
            { o: 166.46, h: 166.71, l: 165.37, c: 165.57 },
            { o: 165.57, h: 166.63, l: 165.36, c: 166.33 },
            { o: 166.33, h: 166.78, l: 161.03, c: 161.37 },
            { o: 161.37, h: 161.64, l: 156.97, c: 157.13 },
            { o: 157.13, h: 157.57, l: 152.69, c: 152.85 },
            { o: 152.85, h: 152.98, l: 147.62, c: 148 },
            { o: 148, h: 148.66, l: 147.66, c: 148.31 },
            { o: 148.31, h: 148.71, l: 146.84, c: 147.29 },
            { o: 147.29, h: 151.65, l: 146.73, c: 151.44 },
            { o: 151.44, h: 154.1, l: 151.29, c: 153.97 },
            { o: 153.97, h: 157.46, l: 153.64, c: 156.85 },
            { o: 156.85, h: 161.97, l: 156.34, c: 161.28 },
            { o: 161.28, h: 164.55, l: 160.86, c: 164.17 },
            { o: 164.17, h: 166.07, l: 163.87, c: 164.77 },
            { o: 164.77, h: 164.92, l: 161.28, c: 161.62 },
            { o: 161.62, h: 161.9, l: 154.9, c: 155.08 },
            { o: 155.08, h: 155.22, l: 150.76, c: 151.08 },
            { o: 151.08, h: 151.19, l: 148.32, c: 148.48 },
            { o: 148.48, h: 148.99, l: 142.09, c: 142.34 },
            { o: 142.34, h: 142.64, l: 139.05, c: 139.24 },
            { o: 139.24, h: 139.79, l: 133.57, c: 134 }
          ],
          zones: [
            { from: 5, top: 166.81, bottom: 165.57, kind: "supply", label: "A: index supply" }
          ],
          highlight: { from: 14, to: 19, label: "rally to B" },
          reveal: 20
        }
      },
      {
        title: "Hedge at B",
        narration: "You do not have to sell your long-term holdings. At B you can short SPY, short S&P futures or buy puts, with a stop just above the zone.",
        scene: {
          candles: [
            { o: 128, h: 135.46, l: 127.56, c: 134.56 },
            { o: 134.56, h: 141.41, l: 133.51, c: 141.09 },
            { o: 141.09, h: 151.57, l: 139.24, c: 151.11 },
            { o: 151.11, h: 160.33, l: 150.64, c: 159.81 },
            { o: 159.81, h: 166.76, l: 158.99, c: 166 },
            { o: 166, h: 166.81, l: 165.73, c: 166.46 },
            { o: 166.46, h: 166.71, l: 165.37, c: 165.57 },
            { o: 165.57, h: 166.63, l: 165.36, c: 166.33 },
            { o: 166.33, h: 166.78, l: 161.03, c: 161.37 },
            { o: 161.37, h: 161.64, l: 156.97, c: 157.13 },
            { o: 157.13, h: 157.57, l: 152.69, c: 152.85 },
            { o: 152.85, h: 152.98, l: 147.62, c: 148 },
            { o: 148, h: 148.66, l: 147.66, c: 148.31 },
            { o: 148.31, h: 148.71, l: 146.84, c: 147.29 },
            { o: 147.29, h: 151.65, l: 146.73, c: 151.44 },
            { o: 151.44, h: 154.1, l: 151.29, c: 153.97 },
            { o: 153.97, h: 157.46, l: 153.64, c: 156.85 },
            { o: 156.85, h: 161.97, l: 156.34, c: 161.28 },
            { o: 161.28, h: 164.55, l: 160.86, c: 164.17 },
            { o: 164.17, h: 166.07, l: 163.87, c: 164.77 },
            { o: 164.77, h: 164.92, l: 161.28, c: 161.62 },
            { o: 161.62, h: 161.9, l: 154.9, c: 155.08 },
            { o: 155.08, h: 155.22, l: 150.76, c: 151.08 },
            { o: 151.08, h: 151.19, l: 148.32, c: 148.48 },
            { o: 148.48, h: 148.99, l: 142.09, c: 142.34 },
            { o: 142.34, h: 142.64, l: 139.05, c: 139.24 },
            { o: 139.24, h: 139.79, l: 133.57, c: 134 }
          ],
          zones: [
            { from: 5, top: 166.81, bottom: 165.57, kind: "supply", label: "A: index supply" }
          ],
          lines: [
            { y: 165.57, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 167.06, label: "Stop above distal", kind: "sl", from: 7 }
          ],
          reveal: 20
        }
      },
      {
        title: "Buying power protected",
        narration: "The index falls from B. Your hedge gains while the portfolio drops. What matters at the end of the day is your buying power.",
        scene: {
          candles: [
            { o: 128, h: 135.46, l: 127.56, c: 134.56 },
            { o: 134.56, h: 141.41, l: 133.51, c: 141.09 },
            { o: 141.09, h: 151.57, l: 139.24, c: 151.11 },
            { o: 151.11, h: 160.33, l: 150.64, c: 159.81 },
            { o: 159.81, h: 166.76, l: 158.99, c: 166 },
            { o: 166, h: 166.81, l: 165.73, c: 166.46 },
            { o: 166.46, h: 166.71, l: 165.37, c: 165.57 },
            { o: 165.57, h: 166.63, l: 165.36, c: 166.33 },
            { o: 166.33, h: 166.78, l: 161.03, c: 161.37 },
            { o: 161.37, h: 161.64, l: 156.97, c: 157.13 },
            { o: 157.13, h: 157.57, l: 152.69, c: 152.85 },
            { o: 152.85, h: 152.98, l: 147.62, c: 148 },
            { o: 148, h: 148.66, l: 147.66, c: 148.31 },
            { o: 148.31, h: 148.71, l: 146.84, c: 147.29 },
            { o: 147.29, h: 151.65, l: 146.73, c: 151.44 },
            { o: 151.44, h: 154.1, l: 151.29, c: 153.97 },
            { o: 153.97, h: 157.46, l: 153.64, c: 156.85 },
            { o: 156.85, h: 161.97, l: 156.34, c: 161.28 },
            { o: 161.28, h: 164.55, l: 160.86, c: 164.17 },
            { o: 164.17, h: 166.07, l: 163.87, c: 164.77 },
            { o: 164.77, h: 164.92, l: 161.28, c: 161.62 },
            { o: 161.62, h: 161.9, l: 154.9, c: 155.08 },
            { o: 155.08, h: 155.22, l: 150.76, c: 151.08 },
            { o: 151.08, h: 151.19, l: 148.32, c: 148.48 },
            { o: 148.48, h: 148.99, l: 142.09, c: 142.34 },
            { o: 142.34, h: 142.64, l: 139.05, c: 139.24 },
            { o: 139.24, h: 139.79, l: 133.57, c: 134 }
          ],
          zones: [
            { from: 5, top: 166.81, bottom: 165.57, kind: "supply", label: "A: index supply" }
          ],
          lines: [
            { y: 165.57, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 167.06, label: "Stop above distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "You need to know what a mutual fund holds before buying it at demand.",
        answer: false,
        explain: "Price tells you. If the fund is at demand, it is about to rise; the holdings do not matter for the timing."
      },
      {
        type: "mcq",
        q: "Your fund rises 10% in dollars, but the dollar falls 15% from supply. What happened?",
        options: ["You got richer", "You lost buying power", "Nothing changed", "The fund was mispriced"],
        answer: 1,
        explain: "A fund rising in dollars can still lose buying power if the dollar falls."
      },
      {
        type: "mcq",
        q: "The S&P revisits monthly supply. Which is a hedge Sam mentions?",
        options: [
          "Buy more stocks",
          "Short SPY or S&P futures, or buy puts",
          "Move stops further away",
          "Wait for the news"
        ],
        answer: 1,
        explain: "Short SPY, short S&P futures or buy S&P puts at the revisit of supply."
      },
      {
        type: "spot",
        q: "Click the candle where the hedge goes on.",
        scene: {
          candles: [
            { o: 128, h: 135.46, l: 127.56, c: 134.56 },
            { o: 134.56, h: 141.41, l: 133.51, c: 141.09 },
            { o: 141.09, h: 151.57, l: 139.24, c: 151.11 },
            { o: 151.11, h: 160.33, l: 150.64, c: 159.81 },
            { o: 159.81, h: 166.76, l: 158.99, c: 166 },
            { o: 166, h: 166.81, l: 165.73, c: 166.46 },
            { o: 166.46, h: 166.71, l: 165.37, c: 165.57 },
            { o: 165.57, h: 166.63, l: 165.36, c: 166.33 },
            { o: 166.33, h: 166.78, l: 161.03, c: 161.37 },
            { o: 161.37, h: 161.64, l: 156.97, c: 157.13 },
            { o: 157.13, h: 157.57, l: 152.69, c: 152.85 },
            { o: 152.85, h: 152.98, l: 147.62, c: 148 },
            { o: 148, h: 148.66, l: 147.66, c: 148.31 },
            { o: 148.31, h: 148.71, l: 146.84, c: 147.29 },
            { o: 147.29, h: 151.65, l: 146.73, c: 151.44 },
            { o: 151.44, h: 154.1, l: 151.29, c: 153.97 },
            { o: 153.97, h: 157.46, l: 153.64, c: 156.85 },
            { o: 156.85, h: 161.97, l: 156.34, c: 161.28 },
            { o: 161.28, h: 164.55, l: 160.86, c: 164.17 },
            { o: 164.17, h: 166.07, l: 163.87, c: 164.77 },
            { o: 164.77, h: 164.92, l: 161.28, c: 161.62 },
            { o: 161.62, h: 161.9, l: 154.9, c: 155.08 },
            { o: 155.08, h: 155.22, l: 150.76, c: 151.08 },
            { o: 151.08, h: 151.19, l: 148.32, c: 148.48 },
            { o: 148.48, h: 148.99, l: 142.09, c: 142.34 },
            { o: 142.34, h: 142.64, l: 139.05, c: 139.24 },
            { o: 139.24, h: 139.79, l: 133.57, c: 134 }
          ],
          zones: [
            { from: 5, top: 166.81, bottom: 165.57, kind: "supply", label: "A: index supply" }
          ]
        },
        answer: { from: 19, to: 19 },
        explain: "The first revisit of supply, B. That is where the decline is most likely to start."
      },
      {
        type: "tf",
        q: "Whoever sells a fund after a decline into its demand is making a novice mistake.",
        answer: true,
        explain: "Selling after a decline and into demand. They hand the cheap shares to the person who knows."
      }
    ],
    practice: [
      {
        prompt: "A monthly fund chart: price is pulling back into its pivot-low demand for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 168, h: 169.23, l: 159.79, c: 160.75 },
            { o: 160.75, h: 161.57, l: 152.62, c: 153.16 },
            { o: 153.16, h: 155.08, l: 141.27, c: 143.15 },
            { o: 143.15, h: 145.53, l: 130.97, c: 132.26 },
            { o: 132.26, h: 133.04, l: 125.28, c: 126 },
            { o: 126, h: 126.59, l: 125.65, c: 126.27 },
            { o: 126.27, h: 126.43, l: 125.41, c: 125.56 },
            { o: 125.56, h: 126.8, l: 125.26, c: 126.47 },
            { o: 126.47, h: 133.84, l: 126.09, c: 133.09 },
            { o: 133.09, h: 139.26, l: 132.55, c: 138.62 },
            { o: 138.62, h: 144.86, l: 138.25, c: 144.19 },
            { o: 144.19, h: 150.67, l: 143.62, c: 150 },
            { o: 150, h: 150.23, l: 147.92, c: 148.1 },
            { o: 148.1, h: 148.27, l: 146.85, c: 147 },
            { o: 147, h: 147.33, l: 143.3, c: 143.88 },
            { o: 143.88, h: 144.58, l: 138.61, c: 139.03 },
            { o: 139.03, h: 139.15, l: 136.18, c: 136.48 },
            { o: 136.48, h: 137.21, l: 130.27, c: 130.56 },
            { o: 130.56, h: 130.74, l: 127.47, c: 127.87 },
            { o: 127.87, h: 128.16, l: 125.99, c: 127.27 },
            { o: 127.27, h: 132.19, l: 127.09, c: 131.72 },
            { o: 131.72, h: 136.36, l: 131.41, c: 136.07 },
            { o: 136.07, h: 138.65, l: 135.99, c: 138.41 },
            { o: 138.41, h: 144.01, l: 138.04, c: 143.56 },
            { o: 143.56, h: 147.46, l: 143.41, c: 147.32 },
            { o: 147.32, h: 150.59, l: 147.02, c: 150.36 },
            { o: 150.36, h: 153.32, l: 150.26, c: 153.21 },
            { o: 153.21, h: 158.38, l: 152.99, c: 158 }
          ],
          zones: [
            { from: 5, top: 126.47, bottom: 125.26, kind: "demand", label: "Pivot-low demand" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Buy the fund at demand like any stock. The sellers here sell after a decline into demand. The fund climbed to new highs."
      }
    ],
    cards: [
      { front: "Can you use levels on mutual funds?", back: "Yes; almost anything bought and sold can be charted." },
      {
        front: "What is currency risk?",
        back: "Dollar assets losing buying power when the dollar falls from supply."
      },
      { front: "Hedge choices at index supply?", back: "Short SPY, short S&P futures, buy S&P puts." },
      { front: "What matters at the end of the day?", back: "Your buying power." }
    ],
    mnemonic: "Fund at demand: buy. Dollar at supply: beware. Index at supply: umbrella up."
  },
  {
    mentor: "seiden",
    n: 190,
    eli5: {
      oneLiner: "Buy low and sell high, like a lemonade stand. Simple wins.",
      story: "As a kid you bought lemons for a nickel and sold lemonade for fifty cents. That is good trading, and nobody had to teach you. A student used the same logic on Alcoa: price came back to a high where it could not stay before. He sold there, with targets three and five times his risk. The buyers paid too much, right into a wall.",
      analogy: "Buying after a big rally into supply is like offering $40,000 for a $30,000 car, then pressing the gas toward a concrete wall."
    },
    bigIdeas: [
      "Occam's Razor: the simplest answer is usually right. Peel away illusion.",
      "Supply is a rally-base-decline pivot high where price could not stay. Short its return.",
      "Set targets as multiples of risk: target 1 at 3:1, target 2 at 5:1."
    ],
    steps: [
      {
        title: "A high price could not keep",
        narration: "Price spiked up, paused for a moment and fell hard. A rally-base-decline pivot high: supply was much bigger than demand there.",
        scene: {
          candles: [
            { o: 118, h: 127.7, l: 116.13, c: 126.65 },
            { o: 126.65, h: 139.24, l: 125.91, c: 137.44 },
            { o: 137.44, h: 151.22, l: 134.87, c: 150.27 },
            { o: 150.27, h: 158.39, l: 148.84, c: 157.3 },
            { o: 157.3, h: 168.49, l: 156.79, c: 168 },
            { o: 168, h: 168.54, l: 167.81, c: 168.24 },
            { o: 168.24, h: 168.53, l: 167.24, c: 167.43 },
            { o: 167.43, h: 168.03, l: 157.29, c: 157.62 },
            { o: 157.62, h: 158.79, l: 145.56, c: 146.75 },
            { o: 146.75, h: 147.09, l: 135.81, c: 136.31 },
            { o: 136.31, h: 137.03, l: 125.07, c: 126 },
            { o: 126, h: 126.94, l: 125.64, c: 126.57 },
            { o: 126.57, h: 126.99, l: 125.5, c: 125.7 },
            { o: 125.7, h: 131.28, l: 124.95, c: 130.09 },
            { o: 130.09, h: 132.09, l: 129.94, c: 131.59 },
            { o: 131.59, h: 137.3, l: 131.12, c: 136.81 },
            { o: 136.81, h: 138.75, l: 136.52, c: 138.47 },
            { o: 138.47, h: 145.1, l: 138.09, c: 143.87 },
            { o: 143.87, h: 144.83, l: 143.79, c: 144.68 },
            { o: 144.68, h: 152.54, l: 143.43, c: 150.62 },
            { o: 150.62, h: 151.87, l: 150.41, c: 151.62 },
            { o: 151.62, h: 158.18, l: 150.96, c: 157.59 },
            { o: 157.59, h: 160.34, l: 156.91, c: 160 },
            { o: 160, h: 164.06, l: 159.65, c: 163.34 },
            { o: 163.34, h: 166.57, l: 162.78, c: 166.03 },
            { o: 166.03, h: 167.87, l: 165.51, c: 166.63 },
            { o: 166.63, h: 167.06, l: 160.34, c: 160.63 },
            { o: 160.63, h: 160.91, l: 157.92, c: 158.14 },
            { o: 158.14, h: 158.64, l: 150.89, c: 151.58 },
            { o: 151.58, h: 151.73, l: 146.9, c: 147.38 },
            { o: 147.38, h: 147.79, l: 142.23, c: 142.78 },
            { o: 142.78, h: 143.03, l: 138.7, c: 139.1 },
            { o: 139.1, h: 139.42, l: 132.98, c: 133.51 },
            { o: 133.51, h: 134.16, l: 127.46, c: 128 }
          ],
          zones: [
            { from: 5, top: 168.54, bottom: 167.43, kind: "supply", label: "Supply" }
          ],
          reveal: 13
        }
      },
      {
        title: "The long trip back",
        narration: "Months later price rallies all the way back. Buyers get excited after the rise. They are paying the sticker price and more.",
        scene: {
          candles: [
            { o: 118, h: 127.7, l: 116.13, c: 126.65 },
            { o: 126.65, h: 139.24, l: 125.91, c: 137.44 },
            { o: 137.44, h: 151.22, l: 134.87, c: 150.27 },
            { o: 150.27, h: 158.39, l: 148.84, c: 157.3 },
            { o: 157.3, h: 168.49, l: 156.79, c: 168 },
            { o: 168, h: 168.54, l: 167.81, c: 168.24 },
            { o: 168.24, h: 168.53, l: 167.24, c: 167.43 },
            { o: 167.43, h: 168.03, l: 157.29, c: 157.62 },
            { o: 157.62, h: 158.79, l: 145.56, c: 146.75 },
            { o: 146.75, h: 147.09, l: 135.81, c: 136.31 },
            { o: 136.31, h: 137.03, l: 125.07, c: 126 },
            { o: 126, h: 126.94, l: 125.64, c: 126.57 },
            { o: 126.57, h: 126.99, l: 125.5, c: 125.7 },
            { o: 125.7, h: 131.28, l: 124.95, c: 130.09 },
            { o: 130.09, h: 132.09, l: 129.94, c: 131.59 },
            { o: 131.59, h: 137.3, l: 131.12, c: 136.81 },
            { o: 136.81, h: 138.75, l: 136.52, c: 138.47 },
            { o: 138.47, h: 145.1, l: 138.09, c: 143.87 },
            { o: 143.87, h: 144.83, l: 143.79, c: 144.68 },
            { o: 144.68, h: 152.54, l: 143.43, c: 150.62 },
            { o: 150.62, h: 151.87, l: 150.41, c: 151.62 },
            { o: 151.62, h: 158.18, l: 150.96, c: 157.59 },
            { o: 157.59, h: 160.34, l: 156.91, c: 160 },
            { o: 160, h: 164.06, l: 159.65, c: 163.34 },
            { o: 163.34, h: 166.57, l: 162.78, c: 166.03 },
            { o: 166.03, h: 167.87, l: 165.51, c: 166.63 },
            { o: 166.63, h: 167.06, l: 160.34, c: 160.63 },
            { o: 160.63, h: 160.91, l: 157.92, c: 158.14 },
            { o: 158.14, h: 158.64, l: 150.89, c: 151.58 },
            { o: 151.58, h: 151.73, l: 146.9, c: 147.38 },
            { o: 147.38, h: 147.79, l: 142.23, c: 142.78 },
            { o: 142.78, h: 143.03, l: 138.7, c: 139.1 },
            { o: 139.1, h: 139.42, l: 132.98, c: 133.51 },
            { o: 133.51, h: 134.16, l: 127.46, c: 128 }
          ],
          zones: [
            { from: 5, top: 168.54, bottom: 167.43, kind: "supply", label: "Supply" }
          ],
          reveal: 25
        }
      },
      {
        title: "Sell where it is too expensive",
        narration: "Short at the bottom line, stop above the top line. Target 1 sits at three times the risk, target 2 at five times.",
        scene: {
          candles: [
            { o: 118, h: 127.7, l: 116.13, c: 126.65 },
            { o: 126.65, h: 139.24, l: 125.91, c: 137.44 },
            { o: 137.44, h: 151.22, l: 134.87, c: 150.27 },
            { o: 150.27, h: 158.39, l: 148.84, c: 157.3 },
            { o: 157.3, h: 168.49, l: 156.79, c: 168 },
            { o: 168, h: 168.54, l: 167.81, c: 168.24 },
            { o: 168.24, h: 168.53, l: 167.24, c: 167.43 },
            { o: 167.43, h: 168.03, l: 157.29, c: 157.62 },
            { o: 157.62, h: 158.79, l: 145.56, c: 146.75 },
            { o: 146.75, h: 147.09, l: 135.81, c: 136.31 },
            { o: 136.31, h: 137.03, l: 125.07, c: 126 },
            { o: 126, h: 126.94, l: 125.64, c: 126.57 },
            { o: 126.57, h: 126.99, l: 125.5, c: 125.7 },
            { o: 125.7, h: 131.28, l: 124.95, c: 130.09 },
            { o: 130.09, h: 132.09, l: 129.94, c: 131.59 },
            { o: 131.59, h: 137.3, l: 131.12, c: 136.81 },
            { o: 136.81, h: 138.75, l: 136.52, c: 138.47 },
            { o: 138.47, h: 145.1, l: 138.09, c: 143.87 },
            { o: 143.87, h: 144.83, l: 143.79, c: 144.68 },
            { o: 144.68, h: 152.54, l: 143.43, c: 150.62 },
            { o: 150.62, h: 151.87, l: 150.41, c: 151.62 },
            { o: 151.62, h: 158.18, l: 150.96, c: 157.59 },
            { o: 157.59, h: 160.34, l: 156.91, c: 160 },
            { o: 160, h: 164.06, l: 159.65, c: 163.34 },
            { o: 163.34, h: 166.57, l: 162.78, c: 166.03 },
            { o: 166.03, h: 167.87, l: 165.51, c: 166.63 },
            { o: 166.63, h: 167.06, l: 160.34, c: 160.63 },
            { o: 160.63, h: 160.91, l: 157.92, c: 158.14 },
            { o: 158.14, h: 158.64, l: 150.89, c: 151.58 },
            { o: 151.58, h: 151.73, l: 146.9, c: 147.38 },
            { o: 147.38, h: 147.79, l: 142.23, c: 142.78 },
            { o: 142.78, h: 143.03, l: 138.7, c: 139.1 },
            { o: 139.1, h: 139.42, l: 132.98, c: 133.51 },
            { o: 133.51, h: 134.16, l: 127.46, c: 128 }
          ],
          zones: [
            { from: 5, top: 168.54, bottom: 167.43, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 167.43, label: "Short", kind: "entry", from: 6 },
            { y: 168.79, label: "Stop", kind: "sl", from: 6 },
            { y: 163.35, label: "T1 3:1", kind: "tp", from: 6 },
            { y: 160.63, label: "T2 5:1", kind: "tp", from: 6 }
          ],
          reveal: 26
        }
      },
      {
        title: "Lemonade profits",
        narration: "Price turns down and reaches both targets. Simple logic beat complex illusion.",
        scene: {
          candles: [
            { o: 118, h: 127.7, l: 116.13, c: 126.65 },
            { o: 126.65, h: 139.24, l: 125.91, c: 137.44 },
            { o: 137.44, h: 151.22, l: 134.87, c: 150.27 },
            { o: 150.27, h: 158.39, l: 148.84, c: 157.3 },
            { o: 157.3, h: 168.49, l: 156.79, c: 168 },
            { o: 168, h: 168.54, l: 167.81, c: 168.24 },
            { o: 168.24, h: 168.53, l: 167.24, c: 167.43 },
            { o: 167.43, h: 168.03, l: 157.29, c: 157.62 },
            { o: 157.62, h: 158.79, l: 145.56, c: 146.75 },
            { o: 146.75, h: 147.09, l: 135.81, c: 136.31 },
            { o: 136.31, h: 137.03, l: 125.07, c: 126 },
            { o: 126, h: 126.94, l: 125.64, c: 126.57 },
            { o: 126.57, h: 126.99, l: 125.5, c: 125.7 },
            { o: 125.7, h: 131.28, l: 124.95, c: 130.09 },
            { o: 130.09, h: 132.09, l: 129.94, c: 131.59 },
            { o: 131.59, h: 137.3, l: 131.12, c: 136.81 },
            { o: 136.81, h: 138.75, l: 136.52, c: 138.47 },
            { o: 138.47, h: 145.1, l: 138.09, c: 143.87 },
            { o: 143.87, h: 144.83, l: 143.79, c: 144.68 },
            { o: 144.68, h: 152.54, l: 143.43, c: 150.62 },
            { o: 150.62, h: 151.87, l: 150.41, c: 151.62 },
            { o: 151.62, h: 158.18, l: 150.96, c: 157.59 },
            { o: 157.59, h: 160.34, l: 156.91, c: 160 },
            { o: 160, h: 164.06, l: 159.65, c: 163.34 },
            { o: 163.34, h: 166.57, l: 162.78, c: 166.03 },
            { o: 166.03, h: 167.87, l: 165.51, c: 166.63 },
            { o: 166.63, h: 167.06, l: 160.34, c: 160.63 },
            { o: 160.63, h: 160.91, l: 157.92, c: 158.14 },
            { o: 158.14, h: 158.64, l: 150.89, c: 151.58 },
            { o: 151.58, h: 151.73, l: 146.9, c: 147.38 },
            { o: 147.38, h: 147.79, l: 142.23, c: 142.78 },
            { o: 142.78, h: 143.03, l: 138.7, c: 139.1 },
            { o: 139.1, h: 139.42, l: 132.98, c: 133.51 },
            { o: 133.51, h: 134.16, l: 127.46, c: 128 }
          ],
          zones: [
            { from: 5, top: 168.54, bottom: 167.43, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 167.43, label: "Short", kind: "entry", from: 6 },
            { y: 168.79, label: "Stop", kind: "sl", from: 6 },
            { y: 163.35, label: "T1 3:1", kind: "tp", from: 6 },
            { y: 160.63, label: "T2 5:1", kind: "tp", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Risk is 0.40 on a short. Where are Sam's two targets?",
        options: [
          "0.40 and 0.80 below entry",
          "1.20 and 2.00 below entry",
          "4.00 and 5.00 below entry",
          "At the next round number"
        ],
        answer: 1,
        explain: "Target 1 at 3:1 (1.20) and target 2 at 5:1 (2.00)."
      },
      {
        type: "mcq",
        q: "Buying after a rally into supply is like...",
        options: [
          "Using a coupon",
          "Paying $40,000 for a $30,000 car and stepping on the gas toward a wall",
          "Buying cheese on sale",
          "Saving for retirement"
        ],
        answer: 1,
        explain: "Overpaying, then accelerating into a level where supply exceeds demand."
      },
      {
        type: "tf",
        q: "Occam's Razor says the most complex explanation is usually the right one.",
        answer: false,
        explain: "The simplest answer is usually right. Most people take illusion for reality."
      },
      {
        type: "spot",
        q: "Click the candles that formed the pivot-high supply.",
        scene: {
          candles: [
            { o: 118, h: 127.7, l: 116.13, c: 126.65 },
            { o: 126.65, h: 139.24, l: 125.91, c: 137.44 },
            { o: 137.44, h: 151.22, l: 134.87, c: 150.27 },
            { o: 150.27, h: 158.39, l: 148.84, c: 157.3 },
            { o: 157.3, h: 168.49, l: 156.79, c: 168 },
            { o: 168, h: 168.54, l: 167.81, c: 168.24 },
            { o: 168.24, h: 168.53, l: 167.24, c: 167.43 },
            { o: 167.43, h: 168.03, l: 157.29, c: 157.62 },
            { o: 157.62, h: 158.79, l: 145.56, c: 146.75 },
            { o: 146.75, h: 147.09, l: 135.81, c: 136.31 },
            { o: 136.31, h: 137.03, l: 125.07, c: 126 },
            { o: 126, h: 126.94, l: 125.64, c: 126.57 },
            { o: 126.57, h: 126.99, l: 125.5, c: 125.7 },
            { o: 125.7, h: 131.28, l: 124.95, c: 130.09 },
            { o: 130.09, h: 132.09, l: 129.94, c: 131.59 },
            { o: 131.59, h: 137.3, l: 131.12, c: 136.81 },
            { o: 136.81, h: 138.75, l: 136.52, c: 138.47 },
            { o: 138.47, h: 145.1, l: 138.09, c: 143.87 },
            { o: 143.87, h: 144.83, l: 143.79, c: 144.68 },
            { o: 144.68, h: 152.54, l: 143.43, c: 150.62 },
            { o: 150.62, h: 151.87, l: 150.41, c: 151.62 },
            { o: 151.62, h: 158.18, l: 150.96, c: 157.59 },
            { o: 157.59, h: 160.34, l: 156.91, c: 160 },
            { o: 160, h: 164.06, l: 159.65, c: 163.34 },
            { o: 163.34, h: 166.57, l: 162.78, c: 166.03 },
            { o: 166.03, h: 167.87, l: 165.51, c: 166.63 },
            { o: 166.63, h: 167.06, l: 160.34, c: 160.63 },
            { o: 160.63, h: 160.91, l: 157.92, c: 158.14 },
            { o: 158.14, h: 158.64, l: 150.89, c: 151.58 },
            { o: 151.58, h: 151.73, l: 146.9, c: 147.38 },
            { o: 147.38, h: 147.79, l: 142.23, c: 142.78 },
            { o: 142.78, h: 143.03, l: 138.7, c: 139.1 },
            { o: 139.1, h: 139.42, l: 132.98, c: 133.51 },
            { o: 133.51, h: 134.16, l: 127.46, c: 128 }
          ],
          zones: [
            { from: 5, top: 168.54, bottom: 167.43, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 5, to: 6 },
        explain: "The short pause at the spike top, just before the hard drop: rally-base-decline."
      }
    ],
    practice: [
      {
        prompt: "Price is rallying back to a pivot high it fell hard from. Place the short: entry, stop and a 3:1 target.",
        scene: {
          candles: [
            { o: 114, h: 122.39, l: 113.24, c: 121.27 },
            { o: 121.27, h: 131.17, l: 119.8, c: 130.7 },
            { o: 130.7, h: 140.85, l: 128.72, c: 140.41 },
            { o: 140.41, h: 148.58, l: 139.75, c: 147.59 },
            { o: 147.59, h: 156.56, l: 145.85, c: 156 },
            { o: 156, h: 156.61, l: 155.76, c: 156.37 },
            { o: 156.37, h: 156.52, l: 155.15, c: 155.5 },
            { o: 155.5, h: 156.19, l: 145.46, c: 146.07 },
            { o: 146.07, h: 146.37, l: 136.54, c: 137.4 },
            { o: 137.4, h: 138.16, l: 127.33, c: 128.3 },
            { o: 128.3, h: 129.07, l: 119.11, c: 120 },
            { o: 120, h: 126.18, l: 118.48, c: 125 },
            { o: 125, h: 125.77, l: 124.76, c: 125.56 },
            { o: 125.56, h: 133.24, l: 123.96, c: 131.88 },
            { o: 131.88, h: 132.98, l: 131.76, c: 132.75 },
            { o: 132.75, h: 139.2, l: 132.24, c: 138.36 },
            { o: 138.36, h: 139.87, l: 137.97, c: 139.51 },
            { o: 139.51, h: 148.16, l: 137.75, c: 145.99 },
            { o: 145.99, h: 148.19, l: 145.31, c: 148 },
            { o: 148, h: 152.13, l: 147.35, c: 151.4 },
            { o: 151.4, h: 154.52, l: 151.04, c: 154.1 },
            { o: 154.1, h: 155.94, l: 153.57, c: 154.7 },
            { o: 154.7, h: 155.02, l: 149.34, c: 149.51 },
            { o: 149.51, h: 149.89, l: 145.94, c: 146.04 },
            { o: 146.04, h: 146.27, l: 142.12, c: 142.51 },
            { o: 142.51, h: 142.74, l: 137.36, c: 137.88 },
            { o: 137.88, h: 138.44, l: 131.95, c: 132.48 },
            { o: 132.48, h: 132.84, l: 128.9, c: 129.1 },
            { o: 129.1, h: 129.57, l: 123.78, c: 124 }
          ],
          zones: [
            { from: 5, top: 156.61, bottom: 155.5, kind: "supply", label: "Supply" }
          ],
          reveal: 21
        },
        task: "pick-entry",
        answer: { entry: 155.5, sl: 156.86, tp: 151.42 },
        explain: "Entry on the bottom line, stop just above the top line, target 1 three times the risk below. Price fell through it."
      }
    ],
    cards: [
      { front: "Lemonade logic?", back: "Buy low (wholesale), sell high (retail)." },
      { front: "AA short: entry and targets?", back: "12.08; T1 10.85 (3:1), T2 10.03 (5:1)." },
      { front: "Supply shape in this lesson?", back: "Rally-base-decline pivot high." },
      { front: "Gas pedal or brakes at supply?", back: "Brakes: do not buy into a wall." }
    ],
    mnemonic: "Nickel lemons, fifty-cent lemonade: buy cheap, sell dear."
  },
  {
    mentor: "seiden",
    n: 193,
    eli5: {
      oneLiner: "Let the breakout go. Buy when price comes back to where it started.",
      story: "Most people buy the moment price breaks out. By then it has moved so far that the stop is miles away and the reward is small. Sam sits back and lets the breakout happen, because it shows him where the buyers are. When price comes back to the start of the jump, he buys with a tight stop. His target is the high of that first breakout.",
      analogy: "It is like a bus pulling away. Do not chase it down the street. Wait at the bus stop; it comes back on the next loop."
    },
    bigIdeas: [
      "Buying the breakout is usually the sucker bet: high risk, low reward.",
      "Setup: rising 20-period MA, drop-base-rally demand at the breakout origin, room to the breakout high.",
      "Buy the top line on the first return, stop below the bottom line, target the breakout high. Shorts are the mirror."
    ],
    steps: [
      {
        title: "Uptrend and a drop before the base",
        narration: "The 20-period average is rising, so we look for buys. Price dipped, paused, then broke out. The dip before the base makes it drop-base-rally, the higher-probability kind.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          trendlines: [
            { x1: 0, y1: 124, x2: 26, y2: 152, label: "20 MA rising" }
          ],
          highlight: { from: 8, to: 10, label: "base after a drop" },
          reveal: 11
        }
      },
      {
        title: "The breakout: do not chase",
        narration: "Big green candles break out. This is where most people buy. Their stop would have to go far below; the reward is small. We just watch and mark where it started.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          trendlines: [
            { x1: 0, y1: 124, x2: 26, y2: 152, label: "20 MA rising" }
          ],
          zones: [
            { from: 8, top: 134.47, bottom: 133.41, kind: "demand", label: "A: demand" }
          ],
          highlight: { from: 11, to: 13, label: "breakout = sucker bet" },
          reveal: 14
        }
      },
      {
        title: "Mark B: the profit margin",
        narration: "B is the highest high of the first breakout before price comes back. The distance from A to B is our profit margin.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          trendlines: [
            { x1: 0, y1: 124, x2: 26, y2: 152, label: "20 MA rising" }
          ],
          zones: [
            { from: 8, top: 134.47, bottom: 133.41, kind: "demand", label: "A: demand" }
          ],
          lines: [
            { y: 151.1, label: "B: breakout high", kind: "tp", from: 11 }
          ],
          reveal: 20
        }
      },
      {
        title: "C: buy the return",
        narration: "Price drops back to the top line of A. The seller here is selling after a decline and into demand. Buy at the top line, stop just under the bottom line.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          trendlines: [
            { x1: 0, y1: 124, x2: 26, y2: 152, label: "20 MA rising" }
          ],
          zones: [
            { from: 8, top: 134.47, bottom: 133.41, kind: "demand", label: "A: demand" }
          ],
          lines: [
            { y: 134.47, label: "C: buy", kind: "entry", from: 10 },
            { y: 133.16, label: "Stop", kind: "sl", from: 10 },
            { y: 151.1, label: "B: breakout high", kind: "tp", from: 11 }
          ],
          reveal: 21
        }
      },
      {
        title: "D: exit at B",
        narration: "Price rallies from C to B. That is the exit, D. Low risk, high reward, high probability.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          trendlines: [
            { x1: 0, y1: 124, x2: 26, y2: 152, label: "20 MA rising" }
          ],
          zones: [
            { from: 8, top: 134.47, bottom: 133.41, kind: "demand", label: "A: demand" }
          ],
          lines: [
            { y: 134.47, label: "C: buy", kind: "entry", from: 10 },
            { y: 133.16, label: "Stop", kind: "sl", from: 10 },
            { y: 151.1, label: "B: breakout high", kind: "tp", from: 11 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candles Sam calls the \"sucker bet\" entry.",
        scene: {
          candles: [
            { o: 172, h: 172.58, l: 165.4, c: 166.45 },
            { o: 166.45, h: 167.35, l: 156.87, c: 158.14 },
            { o: 158.14, h: 158.57, l: 153.1, c: 153.99 },
            { o: 153.99, h: 154.67, l: 142.99, c: 144.64 },
            { o: 144.64, h: 144.88, l: 139.36, c: 140 },
            { o: 140, h: 140.16, l: 137.87, c: 138.18 },
            { o: 138.18, h: 138.56, l: 135.24, c: 135.4 },
            { o: 135.4, h: 135.52, l: 133.93, c: 134 },
            { o: 134, h: 134.64, l: 133.87, c: 134.47 },
            { o: 134.47, h: 134.71, l: 133.41, c: 133.71 },
            { o: 133.71, h: 134.58, l: 133.45, c: 134.3 },
            { o: 134.3, h: 139.38, l: 133.87, c: 139.13 },
            { o: 139.13, h: 144.28, l: 138.68, c: 144.14 },
            { o: 144.14, h: 150.37, l: 143.6, c: 150 },
            { o: 150, h: 150.97, l: 149.57, c: 150.64 },
            { o: 150.64, h: 150.99, l: 149.22, c: 149.42 },
            { o: 149.42, h: 150.48, l: 149.01, c: 150.27 },
            { o: 150.27, h: 151.1, l: 145.31, c: 145.88 },
            { o: 145.88, h: 146.61, l: 139.94, c: 140.38 },
            { o: 140.38, h: 140.6, l: 135.47, c: 135.87 },
            { o: 135.87, h: 136.29, l: 134.15, c: 135.27 },
            { o: 135.27, h: 138.3, l: 135.18, c: 137.99 },
            { o: 137.99, h: 143.73, l: 137.82, c: 143.17 },
            { o: 143.17, h: 146.25, l: 143.01, c: 146.05 },
            { o: 146.05, h: 150.21, l: 145.92, c: 150.02 },
            { o: 150.02, h: 152.98, l: 149.94, c: 152.74 },
            { o: 152.74, h: 156.21, l: 152.61, c: 156 }
          ],
          zones: [
            { from: 8, top: 134.47, bottom: 133.41, kind: "demand", label: "A: demand" }
          ]
        },
        answer: { from: 11, to: 13 },
        explain: "The breakout candles. Buying here means a far stop and little room. Let them go."
      },
      {
        type: "mcq",
        q: "What is the target for the retracement buy?",
        options: [
          "Twice the zone height",
          "B: the high of the initial breakout",
          "The next round number",
          "Wherever the MA turns down"
        ],
        answer: 1,
        explain: "Profit margin is A to B, the highest high of the initial breakout before the return."
      },
      {
        type: "mcq",
        q: "Which trend filter does this setup use?",
        options: ["200-day MA", "20-period moving average", "RSI", "Volume"],
        answer: 1,
        explain: "Longs only when the 20-period moving average defines an uptrend."
      },
      {
        type: "tf",
        q: "For higher probability, the demand base should be preceded by a decline (drop-base-rally).",
        answer: true,
        explain: "A drop before the base shows a real turning point."
      },
      {
        type: "order",
        q: "Order the breakout-retracement trade.",
        items: [
          "Confirm the rising 20 MA",
          "Let the breakout happen",
          "Mark A (origin) and B (breakout high)",
          "Buy C at the top line",
          "Exit D at B"
        ],
        explain: "Let the breakout show you the buyers, then buy the return."
      }
    ],
    practice: [
      {
        prompt: "Rising 20 MA. Price broke out from a drop-base-rally base, made a high, and is now pulling back to the base. Place the buy: entry, stop and target.",
        scene: {
          candles: [
            { o: 172, h: 173.31, l: 161.71, c: 162.45 },
            { o: 162.45, h: 164.91, l: 146.74, c: 147.69 },
            { o: 147.69, h: 148.11, l: 140.71, c: 141.96 },
            { o: 141.96, h: 142.75, l: 127.22, c: 128 },
            { o: 128, h: 128.28, l: 126.56, c: 126.71 },
            { o: 126.71, h: 126.89, l: 124.25, c: 124.36 },
            { o: 124.36, h: 124.43, l: 122.91, c: 123 },
            { o: 123, h: 123.75, l: 122.85, c: 123.49 },
            { o: 123.49, h: 123.69, l: 122.58, c: 122.77 },
            { o: 122.77, h: 123.54, l: 122.58, c: 123.25 },
            { o: 123.25, h: 130.31, l: 122.64, c: 129.61 },
            { o: 129.61, h: 134.73, l: 129.07, c: 134.5 },
            { o: 134.5, h: 140.6, l: 133.89, c: 140 },
            { o: 140, h: 140.61, l: 139.68, c: 140.43 },
            { o: 140.43, h: 140.91, l: 139.35, c: 139.7 },
            { o: 139.7, h: 141.02, l: 139.44, c: 140.64 },
            { o: 140.64, h: 141.46, l: 136.41, c: 136.76 },
            { o: 136.76, h: 137.86, l: 127.13, c: 128.71 },
            { o: 128.71, h: 129.09, l: 124.32, c: 124.89 },
            { o: 124.89, h: 125.37, l: 123.22, c: 124.29 },
            { o: 124.29, h: 128.29, l: 124.02, c: 128.17 },
            { o: 128.17, h: 131.26, l: 127.99, c: 131.04 },
            { o: 131.04, h: 135.08, l: 130.92, c: 134.65 },
            { o: 134.65, h: 137.81, l: 134.38, c: 137.7 },
            { o: 137.7, h: 142.58, l: 137.32, c: 142.17 },
            { o: 142.17, h: 146.44, l: 142.07, c: 146 }
          ],
          zones: [
            { from: 7, top: 123.49, bottom: 122.58, kind: "demand", label: "Demand" }
          ],
          reveal: 19
        },
        task: "pick-entry",
        answer: { entry: 123.49, sl: 122.33, tp: 141.46 },
        explain: "Entry on the top line, stop just under the bottom line, target the breakout high B. Price rallied back to B."
      }
    ],
    cards: [
      { front: "The sucker bet?", back: "Buying the breakout candle: high risk, low reward." },
      { front: "Trend filter for this setup?", back: "A rising (or falling, for shorts) 20-period MA." },
      { front: "Target of the retracement buy?", back: "B, the high of the initial breakout." },
      { front: "Demand shape wanted?", back: "Drop-base-rally at the breakout origin." },
      { front: "Mirror for shorts?", back: "Short the pullback to pivot-high supply, not the breakdown." }
    ],
    mnemonic: "Let it break, wait for the take: breakout shows, return pays."
  },
  {
    mentor: "seiden",
    n: 198,
    eli5: {
      oneLiner: "Before buying demand, check the room above, the visit count and the index.",
      story: "A student bought a stock at demand and got stopped out. Sam showed him three things he missed. Supply sat close above, so there was little room to profit. It was the third visit to the level, and the last bounce from it was weak. And the S&P was not at demand. A small pocket of sellers had also formed just above his entry.",
      analogy: "It is like a cookie jar that has been raided three times already. The fourth time you reach in, there are only crumbs left."
    },
    bigIdeas: [
      "People with no experience learn fastest; bad information from books and seminars must be unlearned.",
      "Low odds: supply close above, many returns to the level, a weak latest rally, index not at a matching level.",
      "Read Economics 101 and Psychology 101. If it seems too complex or illogical, it is probably poison."
    ],
    steps: [
      {
        title: "A demand, but a short leg",
        narration: "Price dropped, based and rallied, but only a little before it paused again. That pause is supply close above. Room to profit is small.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" }
          ],
          reveal: 14
        }
      },
      {
        title: "Visit one, visit two",
        narration: "Price comes back and bounces, then comes back again. Each visit uses up buy orders at the level.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" }
          ],
          highlight: { from: 16, to: 21, label: "returns 1 and 2" },
          reveal: 22
        }
      },
      {
        title: "A weak bounce and a pocket of sellers",
        narration: "The bounce after the second visit is weak, and price pauses in a small cluster just above the zone: a pocket of sellers between the entry and the supply.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" },
            { from: 24, top: 136.44, bottom: 135.66, kind: "supply", label: "Pocket of sellers", faded: true }
          ],
          highlight: { from: 24, to: 26, label: "pocket of sellers" },
          reveal: 27
        }
      },
      {
        title: "The third visit fails",
        narration: "The student buys the third visit. The S&P is not at demand. With so many warning signs the odds were low, and price breaks right through.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" },
            { from: 24, top: 136.44, bottom: 135.66, kind: "supply", label: "Pocket of sellers", faded: true }
          ],
          lines: [
            { y: 132.41, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 131.17, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which group usually learns Sam's method fastest?",
        options: [
          "Seminar veterans",
          "People who have read many trading books",
          "Beginners with little or no experience",
          "System programmers"
        ],
        answer: 2,
        explain: "They have no bad \"decision filters\" to unlearn."
      },
      {
        type: "spot",
        q: "Click the pocket of sellers the student missed.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" }
          ]
        },
        answer: { from: 24, to: 26 },
        explain: "The small base just above the zone after the weak bounce. Sellers waited there, between the entry and the supply."
      },
      {
        type: "tf",
        q: "A third return to a demand level, after a weak rally, is a high-odds buy.",
        answer: false,
        explain: "Each return absorbs orders. A third return after a weak bounce is low odds."
      },
      {
        type: "mcq",
        q: "Which was NOT one of the three problems with the GENZ long?",
        options: [
          "Supply was close above",
          "It was the third return after a weak rally",
          "The S&P was not at demand",
          "The stop was below the zone"
        ],
        answer: 3,
        explain: "A stop below the zone is correct. The problems were room, repeated visits and index timing."
      },
      {
        type: "mcq",
        q: "Sam's \"best trading books\" are...",
        options: [
          "Pattern encyclopedias",
          "Economics 101 and Psychology 101",
          "Indicator manuals",
          "Biographies of traders"
        ],
        answer: 1,
        explain: "Economics for supply and demand, psychology for how people decide."
      }
    ],
    practice: [
      {
        prompt: "Third visit to this demand. The last bounce was weak, a small cluster formed just above, supply is close overhead and the S&P is mid-range. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 154.34, c: 155.13 },
            { o: 155.13, h: 155.38, l: 149.67, c: 149.99 },
            { o: 149.99, h: 150.88, l: 142.83, c: 143.2 },
            { o: 143.2, h: 144.15, l: 136.63, c: 137.49 },
            { o: 137.49, h: 138.52, l: 131.71, c: 132 },
            { o: 132, h: 132.75, l: 131.82, c: 132.41 },
            { o: 132.41, h: 132.65, l: 131.42, c: 131.77 },
            { o: 131.77, h: 132.51, l: 131.53, c: 132.23 },
            { o: 132.23, h: 136.25, l: 131.78, c: 136.04 },
            { o: 136.04, h: 138.97, l: 135.81, c: 138.75 },
            { o: 138.75, h: 142.42, l: 138.48, c: 142 },
            { o: 142, h: 142.67, l: 141.75, c: 142.39 },
            { o: 142.39, h: 142.55, l: 141.68, c: 141.83 },
            { o: 141.83, h: 142.33, l: 138.51, c: 138.8 },
            { o: 138.8, h: 139.35, l: 135.3, c: 135.61 },
            { o: 135.61, h: 135.77, l: 133.25, c: 133.41 },
            { o: 133.41, h: 133.88, l: 132.11, c: 133.61 },
            { o: 133.61, h: 135.25, l: 133.45, c: 135.12 },
            { o: 135.12, h: 137.76, l: 134.84, c: 137.5 },
            { o: 137.5, h: 137.57, l: 135.74, c: 135.83 },
            { o: 135.83, h: 136.35, l: 133.15, c: 133.41 },
            { o: 133.41, h: 133.72, l: 132.01, c: 133.21 },
            { o: 133.21, h: 134.92, l: 132.98, c: 134.85 },
            { o: 134.85, h: 136.14, l: 134.71, c: 136 },
            { o: 136, h: 136.26, l: 135.8, c: 136.14 },
            { o: 136.14, h: 136.25, l: 135.49, c: 135.66 },
            { o: 135.66, h: 136.44, l: 135.51, c: 136.32 },
            { o: 136.32, h: 136.61, l: 134.71, c: 134.96 },
            { o: 134.96, h: 135.23, l: 132.78, c: 133.01 },
            { o: 133.01, h: 133.33, l: 132.21, c: 132.51 },
            { o: 132.51, h: 132.92, l: 130.26, c: 130.4 },
            { o: 130.4, h: 130.46, l: 129.16, c: 129.32 },
            { o: 129.32, h: 129.5, l: 126.72, c: 127.03 },
            { o: 127.03, h: 127.29, l: 125.35, c: 125.56 },
            { o: 125.56, h: 125.8, l: 123.05, c: 123.42 }
          ],
          zones: [
            { from: 5, top: 132.41, bottom: 131.42, kind: "demand", label: "Demand" },
            { from: 11, top: 142.67, bottom: 141.83, kind: "supply", label: "Supply close above" },
            { from: 24, top: 136.44, bottom: 135.66, kind: "supply", label: "Pocket of sellers", faded: true }
          ],
          reveal: 29
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Too many odds against it: repeated returns, weak rally, a pocket of sellers, little room and no index support. Price broke down through the zone."
      }
    ],
    cards: [
      { front: "Who learns fastest?", back: "People with little or no prior experience." },
      {
        front: "Three GENZ errors?",
        back: "Supply close above, third return after a weak rally, S&P not at demand."
      },
      { front: "Pocket of sellers?", back: "A small base between your entry and the opposing level." },
      { front: "Sam's reading list?", back: "Economics 101 and Psychology 101." },
      {
        front: "Simple logic filter?",
        back: "If it seems too complex or illogical, it is probably poisonous to your account."
      }
    ],
    mnemonic: "Room, Revisits, Rally, Ruler (index): four Rs before you buy."
  },
  {
    mentor: "seiden",
    n: 201,
    eli5: {
      oneLiner: "Use common tools in an uncommon way, so you do not think like the herd.",
      story: "Schools teach everyone to use the same tools the same way, and the same crowd loses together. Sam shows two twists. First, in an uptrend measure the gaps between the dips: if dips come closer and closer together, the trend is getting tired. Second, when two moving averages cross, do not trade the cross; look a little to its left to find where the strong move started.",
      analogy: "A runner who stops to rest more and more often is about to quit the race. Count the rest stops, not just the steps."
    },
    bigIdeas: [
      "Thinking like the herd hands your account to people who think differently.",
      "Shrinking distance between pivot lows (uptrend) or pivot highs (downtrend) means the trend is weakening.",
      "A moving-average cross is never the trigger. It only points slightly left, to the origin of a strong move."
    ],
    steps: [
      {
        title: "A strong trend rarely pulls back",
        narration: "Price climbs with long runs between dips. The first gap between pivot lows is wide: the imbalance is strong.",
        scene: {
          candles: [
            { o: 110, h: 113.53, l: 109.56, c: 113.29 },
            { o: 113.29, h: 117.88, l: 112.72, c: 117.22 },
            { o: 117.22, h: 121.89, l: 116.94, c: 121.25 },
            { o: 121.25, h: 124.06, l: 120.93, c: 123.83 },
            { o: 123.83, h: 128.61, l: 123.23, c: 128 },
            { o: 128, h: 128.39, l: 124.79, c: 125.28 },
            { o: 125.28, h: 125.51, l: 123.19, c: 123.52 },
            { o: 123.52, h: 123.66, l: 120.77, c: 121 },
            { o: 121, h: 125.24, l: 120.59, c: 124.67 },
            { o: 124.67, h: 129.27, l: 124.42, c: 128.74 },
            { o: 128.74, h: 133.79, l: 128.26, c: 133.57 },
            { o: 133.57, h: 137.96, l: 132.85, c: 137.41 },
            { o: 137.41, h: 141.57, l: 136.72, c: 141.08 },
            { o: 141.08, h: 146.96, l: 140.28, c: 146 },
            { o: 146, h: 146.2, l: 143.03, c: 143.43 },
            { o: 143.43, h: 143.85, l: 140.76, c: 140.96 },
            { o: 140.96, h: 141.06, l: 138.88, c: 139 },
            { o: 139, h: 143.91, l: 138.09, c: 143.47 },
            { o: 143.47, h: 147.9, l: 142.97, c: 147.21 },
            { o: 147.21, h: 153.36, l: 146.56, c: 152.33 },
            { o: 152.33, h: 156.71, l: 151.89, c: 156 },
            { o: 156, h: 156.09, l: 153.51, c: 153.94 },
            { o: 153.94, h: 154.09, l: 150.82, c: 151 },
            { o: 151, h: 156.47, l: 150.4, c: 155.49 },
            { o: 155.49, h: 159.45, l: 154.81, c: 159 },
            { o: 159, h: 159.42, l: 155.86, c: 156 },
            { o: 156, h: 160.29, l: 155.58, c: 160 },
            { o: 160, h: 160.41, l: 156.45, c: 156.71 },
            { o: 156.71, h: 157.25, l: 153.76, c: 154.03 },
            { o: 154.03, h: 154.56, l: 148.48, c: 149.28 },
            { o: 149.28, h: 149.92, l: 145.49, c: 146.09 },
            { o: 146.09, h: 146.52, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.27, l: 139.36, c: 140 }
          ],
          notes: [
            { x: 7, y: 119.27, text: "pivot 1" },
            { x: 16, y: 137.38, text: "pivot 2" }
          ],
          trendlines: [
            { x1: 7, y1: 117.77, x2: 16, y2: 117.77, label: "9 bars" }
          ],
          reveal: 17
        }
      },
      {
        title: "Dips come sooner",
        narration: "Each new pivot low comes sooner than the last. The trend is moving toward balance.",
        scene: {
          candles: [
            { o: 110, h: 113.53, l: 109.56, c: 113.29 },
            { o: 113.29, h: 117.88, l: 112.72, c: 117.22 },
            { o: 117.22, h: 121.89, l: 116.94, c: 121.25 },
            { o: 121.25, h: 124.06, l: 120.93, c: 123.83 },
            { o: 123.83, h: 128.61, l: 123.23, c: 128 },
            { o: 128, h: 128.39, l: 124.79, c: 125.28 },
            { o: 125.28, h: 125.51, l: 123.19, c: 123.52 },
            { o: 123.52, h: 123.66, l: 120.77, c: 121 },
            { o: 121, h: 125.24, l: 120.59, c: 124.67 },
            { o: 124.67, h: 129.27, l: 124.42, c: 128.74 },
            { o: 128.74, h: 133.79, l: 128.26, c: 133.57 },
            { o: 133.57, h: 137.96, l: 132.85, c: 137.41 },
            { o: 137.41, h: 141.57, l: 136.72, c: 141.08 },
            { o: 141.08, h: 146.96, l: 140.28, c: 146 },
            { o: 146, h: 146.2, l: 143.03, c: 143.43 },
            { o: 143.43, h: 143.85, l: 140.76, c: 140.96 },
            { o: 140.96, h: 141.06, l: 138.88, c: 139 },
            { o: 139, h: 143.91, l: 138.09, c: 143.47 },
            { o: 143.47, h: 147.9, l: 142.97, c: 147.21 },
            { o: 147.21, h: 153.36, l: 146.56, c: 152.33 },
            { o: 152.33, h: 156.71, l: 151.89, c: 156 },
            { o: 156, h: 156.09, l: 153.51, c: 153.94 },
            { o: 153.94, h: 154.09, l: 150.82, c: 151 },
            { o: 151, h: 156.47, l: 150.4, c: 155.49 },
            { o: 155.49, h: 159.45, l: 154.81, c: 159 },
            { o: 159, h: 159.42, l: 155.86, c: 156 },
            { o: 156, h: 160.29, l: 155.58, c: 160 },
            { o: 160, h: 160.41, l: 156.45, c: 156.71 },
            { o: 156.71, h: 157.25, l: 153.76, c: 154.03 },
            { o: 154.03, h: 154.56, l: 148.48, c: 149.28 },
            { o: 149.28, h: 149.92, l: 145.49, c: 146.09 },
            { o: 146.09, h: 146.52, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.27, l: 139.36, c: 140 }
          ],
          notes: [
            { x: 7, y: 119.27, text: "pivot 1" },
            { x: 16, y: 137.38, text: "pivot 2" },
            { x: 22, y: 149.32, text: "pivot 3" }
          ],
          trendlines: [
            { x1: 7, y1: 117.77, x2: 16, y2: 117.77, label: "9 bars" },
            { x1: 16, y1: 135.88, x2: 22, y2: 135.88, label: "6 bars" }
          ],
          reveal: 23
        }
      },
      {
        title: "Tired trend",
        narration: "Now the dips are almost on top of each other. Risk of buying is rising and the trend is likely to end soon.",
        scene: {
          candles: [
            { o: 110, h: 113.53, l: 109.56, c: 113.29 },
            { o: 113.29, h: 117.88, l: 112.72, c: 117.22 },
            { o: 117.22, h: 121.89, l: 116.94, c: 121.25 },
            { o: 121.25, h: 124.06, l: 120.93, c: 123.83 },
            { o: 123.83, h: 128.61, l: 123.23, c: 128 },
            { o: 128, h: 128.39, l: 124.79, c: 125.28 },
            { o: 125.28, h: 125.51, l: 123.19, c: 123.52 },
            { o: 123.52, h: 123.66, l: 120.77, c: 121 },
            { o: 121, h: 125.24, l: 120.59, c: 124.67 },
            { o: 124.67, h: 129.27, l: 124.42, c: 128.74 },
            { o: 128.74, h: 133.79, l: 128.26, c: 133.57 },
            { o: 133.57, h: 137.96, l: 132.85, c: 137.41 },
            { o: 137.41, h: 141.57, l: 136.72, c: 141.08 },
            { o: 141.08, h: 146.96, l: 140.28, c: 146 },
            { o: 146, h: 146.2, l: 143.03, c: 143.43 },
            { o: 143.43, h: 143.85, l: 140.76, c: 140.96 },
            { o: 140.96, h: 141.06, l: 138.88, c: 139 },
            { o: 139, h: 143.91, l: 138.09, c: 143.47 },
            { o: 143.47, h: 147.9, l: 142.97, c: 147.21 },
            { o: 147.21, h: 153.36, l: 146.56, c: 152.33 },
            { o: 152.33, h: 156.71, l: 151.89, c: 156 },
            { o: 156, h: 156.09, l: 153.51, c: 153.94 },
            { o: 153.94, h: 154.09, l: 150.82, c: 151 },
            { o: 151, h: 156.47, l: 150.4, c: 155.49 },
            { o: 155.49, h: 159.45, l: 154.81, c: 159 },
            { o: 159, h: 159.42, l: 155.86, c: 156 },
            { o: 156, h: 160.29, l: 155.58, c: 160 },
            { o: 160, h: 160.41, l: 156.45, c: 156.71 },
            { o: 156.71, h: 157.25, l: 153.76, c: 154.03 },
            { o: 154.03, h: 154.56, l: 148.48, c: 149.28 },
            { o: 149.28, h: 149.92, l: 145.49, c: 146.09 },
            { o: 146.09, h: 146.52, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.27, l: 139.36, c: 140 }
          ],
          notes: [
            { x: 7, y: 119.27, text: "pivot 1" },
            { x: 16, y: 137.38, text: "pivot 2" },
            { x: 22, y: 149.32, text: "pivot 3" },
            { x: 25, y: 154.36, text: "pivot 4" }
          ],
          trendlines: [
            { x1: 7, y1: 117.77, x2: 16, y2: 117.77, label: "9 bars" },
            { x1: 16, y1: 135.88, x2: 22, y2: 135.88, label: "6 bars" },
            { x1: 22, y1: 147.82, x2: 25, y2: 147.82, label: "3 bars" }
          ],
          reveal: 27
        }
      },
      {
        title: "The turn",
        narration: "Price stalls and turns down. The shrinking spacing warned us before any lagging signal did.",
        scene: {
          candles: [
            { o: 110, h: 113.53, l: 109.56, c: 113.29 },
            { o: 113.29, h: 117.88, l: 112.72, c: 117.22 },
            { o: 117.22, h: 121.89, l: 116.94, c: 121.25 },
            { o: 121.25, h: 124.06, l: 120.93, c: 123.83 },
            { o: 123.83, h: 128.61, l: 123.23, c: 128 },
            { o: 128, h: 128.39, l: 124.79, c: 125.28 },
            { o: 125.28, h: 125.51, l: 123.19, c: 123.52 },
            { o: 123.52, h: 123.66, l: 120.77, c: 121 },
            { o: 121, h: 125.24, l: 120.59, c: 124.67 },
            { o: 124.67, h: 129.27, l: 124.42, c: 128.74 },
            { o: 128.74, h: 133.79, l: 128.26, c: 133.57 },
            { o: 133.57, h: 137.96, l: 132.85, c: 137.41 },
            { o: 137.41, h: 141.57, l: 136.72, c: 141.08 },
            { o: 141.08, h: 146.96, l: 140.28, c: 146 },
            { o: 146, h: 146.2, l: 143.03, c: 143.43 },
            { o: 143.43, h: 143.85, l: 140.76, c: 140.96 },
            { o: 140.96, h: 141.06, l: 138.88, c: 139 },
            { o: 139, h: 143.91, l: 138.09, c: 143.47 },
            { o: 143.47, h: 147.9, l: 142.97, c: 147.21 },
            { o: 147.21, h: 153.36, l: 146.56, c: 152.33 },
            { o: 152.33, h: 156.71, l: 151.89, c: 156 },
            { o: 156, h: 156.09, l: 153.51, c: 153.94 },
            { o: 153.94, h: 154.09, l: 150.82, c: 151 },
            { o: 151, h: 156.47, l: 150.4, c: 155.49 },
            { o: 155.49, h: 159.45, l: 154.81, c: 159 },
            { o: 159, h: 159.42, l: 155.86, c: 156 },
            { o: 156, h: 160.29, l: 155.58, c: 160 },
            { o: 160, h: 160.41, l: 156.45, c: 156.71 },
            { o: 156.71, h: 157.25, l: 153.76, c: 154.03 },
            { o: 154.03, h: 154.56, l: 148.48, c: 149.28 },
            { o: 149.28, h: 149.92, l: 145.49, c: 146.09 },
            { o: 146.09, h: 146.52, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.27, l: 139.36, c: 140 }
          ],
          notes: [
            { x: 7, y: 119.27, text: "pivot 1" },
            { x: 16, y: 137.38, text: "pivot 2" },
            { x: 22, y: 149.32, text: "pivot 3" },
            { x: 25, y: 154.36, text: "pivot 4" }
          ],
          trendlines: [
            { x1: 7, y1: 117.77, x2: 16, y2: 117.77, label: "9 bars" },
            { x1: 16, y1: 135.88, x2: 22, y2: 135.88, label: "6 bars" },
            { x1: 22, y1: 147.82, x2: 25, y2: 147.82, label: "3 bars" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "In an uptrend, the distance between pivot lows keeps shrinking. What does it mean?",
        options: [
          "The trend is getting stronger",
          "The trend is weakening and likely to end soon",
          "Nothing",
          "Buy more"
        ],
        answer: 1,
        explain: "A strong trend does not pull back often. Frequent pullbacks mean it is moving toward balance."
      },
      {
        type: "tf",
        q: "Sam uses a moving-average cross as his entry trigger.",
        answer: false,
        explain: "MAs lag. A past cross only tells you to look slightly left for the origin of the strong move."
      },
      {
        type: "mcq",
        q: "You see a past MA cross above price. Where do you look?",
        options: [
          "At the cross itself",
          "Slightly left of the cross, for the origin of the strong move",
          "At the next cross",
          "At the volume bars"
        ],
        answer: 1,
        explain: "MAs cross because of a strong move, whose origin is an imbalance: the level."
      },
      {
        type: "spot",
        q: "Click the supply level that an MA cross after this drop would point back to.",
        scene: {
          candles: [
            { o: 132, h: 138.36, l: 130.85, c: 137.76 },
            { o: 137.76, h: 145.94, l: 137.32, c: 145.56 },
            { o: 145.56, h: 153.38, l: 145.05, c: 152.48 },
            { o: 152.48, h: 157.63, l: 151.57, c: 157.3 },
            { o: 157.3, h: 165.51, l: 156.31, c: 165 },
            { o: 165, h: 165.56, l: 164.86, c: 165.31 },
            { o: 165.31, h: 165.45, l: 164.44, c: 164.7 },
            { o: 164.7, h: 165.03, l: 159.06, c: 159.46 },
            { o: 159.46, h: 159.96, l: 153.41, c: 153.56 },
            { o: 153.56, h: 154, l: 148.16, c: 148.37 },
            { o: 148.37, h: 148.7, l: 143.36, c: 143.76 },
            { o: 143.76, h: 144.17, l: 137.85, c: 138 },
            { o: 138, h: 138.92, l: 137.67, c: 138.64 },
            { o: 138.64, h: 138.95, l: 137.34, c: 137.52 },
            { o: 137.52, h: 142.74, l: 137.3, c: 142.2 },
            { o: 142.2, h: 147.54, l: 141.95, c: 146.99 },
            { o: 146.99, h: 151.71, l: 146.08, c: 151.43 },
            { o: 151.43, h: 155.6, l: 150.95, c: 154.99 },
            { o: 154.99, h: 159.78, l: 154.44, c: 159.28 },
            { o: 159.28, h: 163.69, l: 158.55, c: 163.3 },
            { o: 163.3, h: 165.04, l: 162.88, c: 163.9 },
            { o: 163.9, h: 164.11, l: 159.69, c: 159.87 },
            { o: 159.87, h: 159.95, l: 157.27, c: 157.35 },
            { o: 157.35, h: 157.83, l: 152.1, c: 152.64 },
            { o: 152.64, h: 152.74, l: 149.57, c: 149.74 },
            { o: 149.74, h: 149.99, l: 145.44, c: 145.61 },
            { o: 145.61, h: 145.97, l: 141.66, c: 142 }
          ],
          notes: [
            { x: 10, y: 150.7, text: "MAs cross here" }
          ]
        },
        answer: { from: 5, to: 6 },
        explain: "Just left of the cross sits the base where the strong decline began. That is the supply to sell on the return."
      },
      {
        type: "tf",
        q: "A trend is an imbalance moving toward a level of temporary balance.",
        answer: true,
        explain: "That is why its pullbacks get more frequent as it nears balance."
      }
    ],
    practice: [
      {
        prompt: "An old uptrend: the dips are coming closer and closer together and price is near the top of a long run. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 110, h: 113.53, l: 109.56, c: 113.29 },
            { o: 113.29, h: 117.88, l: 112.72, c: 117.22 },
            { o: 117.22, h: 121.89, l: 116.94, c: 121.25 },
            { o: 121.25, h: 124.06, l: 120.93, c: 123.83 },
            { o: 123.83, h: 128.61, l: 123.23, c: 128 },
            { o: 128, h: 128.39, l: 124.79, c: 125.28 },
            { o: 125.28, h: 125.51, l: 123.19, c: 123.52 },
            { o: 123.52, h: 123.66, l: 120.77, c: 121 },
            { o: 121, h: 125.24, l: 120.59, c: 124.67 },
            { o: 124.67, h: 129.27, l: 124.42, c: 128.74 },
            { o: 128.74, h: 133.79, l: 128.26, c: 133.57 },
            { o: 133.57, h: 137.96, l: 132.85, c: 137.41 },
            { o: 137.41, h: 141.57, l: 136.72, c: 141.08 },
            { o: 141.08, h: 146.96, l: 140.28, c: 146 },
            { o: 146, h: 146.2, l: 143.03, c: 143.43 },
            { o: 143.43, h: 143.85, l: 140.76, c: 140.96 },
            { o: 140.96, h: 141.06, l: 138.88, c: 139 },
            { o: 139, h: 143.91, l: 138.09, c: 143.47 },
            { o: 143.47, h: 147.9, l: 142.97, c: 147.21 },
            { o: 147.21, h: 153.36, l: 146.56, c: 152.33 },
            { o: 152.33, h: 156.71, l: 151.89, c: 156 },
            { o: 156, h: 156.09, l: 153.51, c: 153.94 },
            { o: 153.94, h: 154.09, l: 150.82, c: 151 },
            { o: 151, h: 156.47, l: 150.4, c: 155.49 },
            { o: 155.49, h: 159.45, l: 154.81, c: 159 },
            { o: 159, h: 159.42, l: 155.86, c: 156 },
            { o: 156, h: 160.29, l: 155.58, c: 160 },
            { o: 160, h: 160.41, l: 156.45, c: 156.71 },
            { o: 156.71, h: 157.25, l: 153.76, c: 154.03 },
            { o: 154.03, h: 154.56, l: 148.48, c: 149.28 },
            { o: 149.28, h: 149.92, l: 145.49, c: 146.09 },
            { o: 146.09, h: 146.52, l: 143.63, c: 144.02 },
            { o: 144.02, h: 144.27, l: 139.36, c: 140 }
          ],
          notes: [
            { x: 7, y: 119.27, text: "pivot 1" },
            { x: 16, y: 137.38, text: "pivot 2" },
            { x: 22, y: 149.32, text: "pivot 3" },
            { x: 25, y: 154.36, text: "pivot 4" }
          ],
          trendlines: [
            { x1: 7, y1: 117.77, x2: 16, y2: 117.77, label: "9 bars" },
            { x1: 16, y1: 135.88, x2: 22, y2: 135.88, label: "6 bars" },
            { x1: 22, y1: 147.82, x2: 25, y2: 147.82, label: "3 bars" }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Shrinking pivot spacing says the risk to buy is rising. Do not buy here. Price stalled and turned down."
      },
      {
        prompt: "Two moving averages crossed down after a strong drop. Price is now rallying back to the base just left of that cross. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 132, h: 138.36, l: 130.85, c: 137.76 },
            { o: 137.76, h: 145.94, l: 137.32, c: 145.56 },
            { o: 145.56, h: 153.38, l: 145.05, c: 152.48 },
            { o: 152.48, h: 157.63, l: 151.57, c: 157.3 },
            { o: 157.3, h: 165.51, l: 156.31, c: 165 },
            { o: 165, h: 165.56, l: 164.86, c: 165.31 },
            { o: 165.31, h: 165.45, l: 164.44, c: 164.7 },
            { o: 164.7, h: 165.03, l: 159.06, c: 159.46 },
            { o: 159.46, h: 159.96, l: 153.41, c: 153.56 },
            { o: 153.56, h: 154, l: 148.16, c: 148.37 },
            { o: 148.37, h: 148.7, l: 143.36, c: 143.76 },
            { o: 143.76, h: 144.17, l: 137.85, c: 138 },
            { o: 138, h: 138.92, l: 137.67, c: 138.64 },
            { o: 138.64, h: 138.95, l: 137.34, c: 137.52 },
            { o: 137.52, h: 142.74, l: 137.3, c: 142.2 },
            { o: 142.2, h: 147.54, l: 141.95, c: 146.99 },
            { o: 146.99, h: 151.71, l: 146.08, c: 151.43 },
            { o: 151.43, h: 155.6, l: 150.95, c: 154.99 },
            { o: 154.99, h: 159.78, l: 154.44, c: 159.28 },
            { o: 159.28, h: 163.69, l: 158.55, c: 163.3 },
            { o: 163.3, h: 165.04, l: 162.88, c: 163.9 },
            { o: 163.9, h: 164.11, l: 159.69, c: 159.87 },
            { o: 159.87, h: 159.95, l: 157.27, c: 157.35 },
            { o: 157.35, h: 157.83, l: 152.1, c: 152.64 },
            { o: 152.64, h: 152.74, l: 149.57, c: 149.74 },
            { o: 149.74, h: 149.99, l: 145.44, c: 145.61 },
            { o: 145.61, h: 145.97, l: 141.66, c: 142 }
          ],
          zones: [
            { from: 5, top: 165.56, bottom: 164.7, kind: "supply", label: "Supply" }
          ],
          notes: [
            { x: 10, y: 150.7, text: "MAs crossed" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "The cross pointed to the supply. The return to it is the sell, not the cross. Price fell away."
      }
    ],
    cards: [
      { front: "Trend health check?", back: "Measure distance between pivot lows (uptrend) or highs (downtrend)." },
      { front: "Shrinking distance means?", back: "The trend is weakening; risk to join it is rising." },
      { front: "Use of an MA cross?", back: "Only as a pointer: look slightly left for the level." },
      { front: "Why not trade the cross?", back: "It lags price and adds risk." }
    ],
    mnemonic: "Count the rest stops; look left of the cross."
  },
  {
    mentor: "seiden",
    n: 205,
    eli5: {
      oneLiner: "Shop for stocks like cheese: buy a lot when it is on sale.",
      story: "A pizza shop owner pays about $2 for a pound of cheese. At $4 he buys only what he needs, and at $1 he buys all he can store. He already knew how to trade; he just had never seen it on a chart. One morning the NASDAQ gapped down into demand on bad news, and Cisco sat at its own matching demand. Sam bought both at wholesale prices and they rallied.",
      analogy: "Waiting for a price to go up before you buy is like waiting for the sale to end before you go shopping."
    },
    bigIdeas: [
      "People lose by buying after good news and rising prices, and by dropping the logic they use when shopping.",
      "Buy wholesale (demand), sell retail (supply). Others must buy after you, higher, for you to profit.",
      "A gap down into demand is a sale, not a reason to sell. Line the stock up with the index."
    ],
    steps: [
      {
        title: "Know the wholesale price",
        narration: "Price dropped, paused and rallied strongly. That base is the wholesale price: where demand far exceeded supply.",
        scene: {
          candles: [
            { o: 168, h: 168.27, l: 162.57, c: 163.1 },
            { o: 163.1, h: 163.91, l: 155.1, c: 155.5 },
            { o: 155.5, h: 156.07, l: 152.22, c: 152.48 },
            { o: 152.48, h: 153.83, l: 144.27, c: 144.99 },
            { o: 144.99, h: 145.52, l: 139.7, c: 140 },
            { o: 140, h: 140.43, l: 139.81, c: 140.25 },
            { o: 140.25, h: 140.49, l: 139.37, c: 139.66 },
            { o: 139.66, h: 140.86, l: 139.32, c: 140.53 },
            { o: 140.53, h: 145.56, l: 140.17, c: 145.19 },
            { o: 145.19, h: 150.74, l: 144.76, c: 150.25 },
            { o: 150.25, h: 154.85, l: 149.77, c: 154.66 },
            { o: 154.66, h: 160.23, l: 154.08, c: 160 },
            { o: 160, h: 160.22, l: 159.8, c: 159.95 },
            { o: 159.95, h: 160.44, l: 157.77, c: 158.02 },
            { o: 158.02, h: 159.1, l: 157.83, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.37, c: 156.56 },
            { o: 156.56, h: 157.38, l: 156.44, c: 157.31 },
            { o: 157.31, h: 157.56, l: 155.81, c: 156 },
            { o: 156, h: 156.12, l: 153.1, c: 153.5 },
            { o: 153.5, h: 153.99, l: 149.72, c: 150.16 },
            { o: 150.16, h: 150.29, l: 147.86, c: 148 },
            { o: 141.4, h: 141.79, l: 139.93, c: 141.33 },
            { o: 141.33, h: 144.9, l: 141.22, c: 144.62 },
            { o: 144.62, h: 148.24, l: 144.51, c: 148.08 },
            { o: 148.08, h: 152.59, l: 147.86, c: 152.43 },
            { o: 152.43, h: 156.27, l: 152.18, c: 155.88 },
            { o: 155.88, h: 160.15, l: 155.44, c: 160.01 },
            { o: 160.01, h: 163.21, l: 159.69, c: 162.98 },
            { o: 162.98, h: 166.08, l: 162.71, c: 166 }
          ],
          zones: [
            { from: 5, top: 140.53, bottom: 139.32, kind: "demand", label: "Wholesale (demand)" }
          ],
          reveal: 14
        }
      },
      {
        title: "The retail zone",
        narration: "Up here price is retail. Buying after good news at these prices is like paying $4 for cheese.",
        scene: {
          candles: [
            { o: 168, h: 168.27, l: 162.57, c: 163.1 },
            { o: 163.1, h: 163.91, l: 155.1, c: 155.5 },
            { o: 155.5, h: 156.07, l: 152.22, c: 152.48 },
            { o: 152.48, h: 153.83, l: 144.27, c: 144.99 },
            { o: 144.99, h: 145.52, l: 139.7, c: 140 },
            { o: 140, h: 140.43, l: 139.81, c: 140.25 },
            { o: 140.25, h: 140.49, l: 139.37, c: 139.66 },
            { o: 139.66, h: 140.86, l: 139.32, c: 140.53 },
            { o: 140.53, h: 145.56, l: 140.17, c: 145.19 },
            { o: 145.19, h: 150.74, l: 144.76, c: 150.25 },
            { o: 150.25, h: 154.85, l: 149.77, c: 154.66 },
            { o: 154.66, h: 160.23, l: 154.08, c: 160 },
            { o: 160, h: 160.22, l: 159.8, c: 159.95 },
            { o: 159.95, h: 160.44, l: 157.77, c: 158.02 },
            { o: 158.02, h: 159.1, l: 157.83, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.37, c: 156.56 },
            { o: 156.56, h: 157.38, l: 156.44, c: 157.31 },
            { o: 157.31, h: 157.56, l: 155.81, c: 156 },
            { o: 156, h: 156.12, l: 153.1, c: 153.5 },
            { o: 153.5, h: 153.99, l: 149.72, c: 150.16 },
            { o: 150.16, h: 150.29, l: 147.86, c: 148 },
            { o: 141.4, h: 141.79, l: 139.93, c: 141.33 },
            { o: 141.33, h: 144.9, l: 141.22, c: 144.62 },
            { o: 144.62, h: 148.24, l: 144.51, c: 148.08 },
            { o: 148.08, h: 152.59, l: 147.86, c: 152.43 },
            { o: 152.43, h: 156.27, l: 152.18, c: 155.88 },
            { o: 155.88, h: 160.15, l: 155.44, c: 160.01 },
            { o: 160.01, h: 163.21, l: 159.69, c: 162.98 },
            { o: 162.98, h: 166.08, l: 162.71, c: 166 }
          ],
          zones: [
            { from: 5, top: 140.53, bottom: 139.32, kind: "demand", label: "Wholesale (demand)" }
          ],
          notes: [
            { x: 14, y: 161.94, text: "Retail" }
          ],
          reveal: 21
        }
      },
      {
        title: "The sale: a gap into demand",
        narration: "Bad news gaps price down straight into the zone. The index is at its demand too. This is the coupon. Buy at the top line, stop under the bottom line.",
        scene: {
          candles: [
            { o: 168, h: 168.27, l: 162.57, c: 163.1 },
            { o: 163.1, h: 163.91, l: 155.1, c: 155.5 },
            { o: 155.5, h: 156.07, l: 152.22, c: 152.48 },
            { o: 152.48, h: 153.83, l: 144.27, c: 144.99 },
            { o: 144.99, h: 145.52, l: 139.7, c: 140 },
            { o: 140, h: 140.43, l: 139.81, c: 140.25 },
            { o: 140.25, h: 140.49, l: 139.37, c: 139.66 },
            { o: 139.66, h: 140.86, l: 139.32, c: 140.53 },
            { o: 140.53, h: 145.56, l: 140.17, c: 145.19 },
            { o: 145.19, h: 150.74, l: 144.76, c: 150.25 },
            { o: 150.25, h: 154.85, l: 149.77, c: 154.66 },
            { o: 154.66, h: 160.23, l: 154.08, c: 160 },
            { o: 160, h: 160.22, l: 159.8, c: 159.95 },
            { o: 159.95, h: 160.44, l: 157.77, c: 158.02 },
            { o: 158.02, h: 159.1, l: 157.83, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.37, c: 156.56 },
            { o: 156.56, h: 157.38, l: 156.44, c: 157.31 },
            { o: 157.31, h: 157.56, l: 155.81, c: 156 },
            { o: 156, h: 156.12, l: 153.1, c: 153.5 },
            { o: 153.5, h: 153.99, l: 149.72, c: 150.16 },
            { o: 150.16, h: 150.29, l: 147.86, c: 148 },
            { o: 141.4, h: 141.79, l: 139.93, c: 141.33 },
            { o: 141.33, h: 144.9, l: 141.22, c: 144.62 },
            { o: 144.62, h: 148.24, l: 144.51, c: 148.08 },
            { o: 148.08, h: 152.59, l: 147.86, c: 152.43 },
            { o: 152.43, h: 156.27, l: 152.18, c: 155.88 },
            { o: 155.88, h: 160.15, l: 155.44, c: 160.01 },
            { o: 160.01, h: 163.21, l: 159.69, c: 162.98 },
            { o: 162.98, h: 166.08, l: 162.71, c: 166 }
          ],
          zones: [
            { from: 5, top: 140.53, bottom: 139.32, kind: "demand", label: "Wholesale (demand)" }
          ],
          lines: [
            { y: 140.53, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 139.07, label: "Stop below distal", kind: "sl", from: 7 }
          ],
          highlight: { from: 21, to: 21, label: "on sale" },
          reveal: 22
        }
      },
      {
        title: "Sale prices do not last",
        narration: "Price rallies back toward retail. Those who sold the gap down sold their cheese for $1.",
        scene: {
          candles: [
            { o: 168, h: 168.27, l: 162.57, c: 163.1 },
            { o: 163.1, h: 163.91, l: 155.1, c: 155.5 },
            { o: 155.5, h: 156.07, l: 152.22, c: 152.48 },
            { o: 152.48, h: 153.83, l: 144.27, c: 144.99 },
            { o: 144.99, h: 145.52, l: 139.7, c: 140 },
            { o: 140, h: 140.43, l: 139.81, c: 140.25 },
            { o: 140.25, h: 140.49, l: 139.37, c: 139.66 },
            { o: 139.66, h: 140.86, l: 139.32, c: 140.53 },
            { o: 140.53, h: 145.56, l: 140.17, c: 145.19 },
            { o: 145.19, h: 150.74, l: 144.76, c: 150.25 },
            { o: 150.25, h: 154.85, l: 149.77, c: 154.66 },
            { o: 154.66, h: 160.23, l: 154.08, c: 160 },
            { o: 160, h: 160.22, l: 159.8, c: 159.95 },
            { o: 159.95, h: 160.44, l: 157.77, c: 158.02 },
            { o: 158.02, h: 159.1, l: 157.83, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.37, c: 156.56 },
            { o: 156.56, h: 157.38, l: 156.44, c: 157.31 },
            { o: 157.31, h: 157.56, l: 155.81, c: 156 },
            { o: 156, h: 156.12, l: 153.1, c: 153.5 },
            { o: 153.5, h: 153.99, l: 149.72, c: 150.16 },
            { o: 150.16, h: 150.29, l: 147.86, c: 148 },
            { o: 141.4, h: 141.79, l: 139.93, c: 141.33 },
            { o: 141.33, h: 144.9, l: 141.22, c: 144.62 },
            { o: 144.62, h: 148.24, l: 144.51, c: 148.08 },
            { o: 148.08, h: 152.59, l: 147.86, c: 152.43 },
            { o: 152.43, h: 156.27, l: 152.18, c: 155.88 },
            { o: 155.88, h: 160.15, l: 155.44, c: 160.01 },
            { o: 160.01, h: 163.21, l: 159.69, c: 162.98 },
            { o: 162.98, h: 166.08, l: 162.71, c: 166 }
          ],
          zones: [
            { from: 5, top: 140.53, bottom: 139.32, kind: "demand", label: "Wholesale (demand)" }
          ],
          lines: [
            { y: 140.53, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 139.07, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Cheese normally costs $2. Now it is $1. What does the pizza owner do?",
        options: [
          "Buys only what he needs",
          "Buys as much as he can store",
          "Waits for $4",
          "Sells his cheese"
        ],
        answer: 1,
        explain: "Wholesale price: buy big. That is buying at demand."
      },
      {
        type: "tf",
        q: "Waiting for confirmation of higher prices before buying is good everyday logic.",
        answer: false,
        explain: "Nobody offers $30,000 for a $20,000 car. Waiting for higher prices means paying retail."
      },
      {
        type: "spot",
        q: "Click the candle where the stock went \"on sale\".",
        scene: {
          candles: [
            { o: 168, h: 168.27, l: 162.57, c: 163.1 },
            { o: 163.1, h: 163.91, l: 155.1, c: 155.5 },
            { o: 155.5, h: 156.07, l: 152.22, c: 152.48 },
            { o: 152.48, h: 153.83, l: 144.27, c: 144.99 },
            { o: 144.99, h: 145.52, l: 139.7, c: 140 },
            { o: 140, h: 140.43, l: 139.81, c: 140.25 },
            { o: 140.25, h: 140.49, l: 139.37, c: 139.66 },
            { o: 139.66, h: 140.86, l: 139.32, c: 140.53 },
            { o: 140.53, h: 145.56, l: 140.17, c: 145.19 },
            { o: 145.19, h: 150.74, l: 144.76, c: 150.25 },
            { o: 150.25, h: 154.85, l: 149.77, c: 154.66 },
            { o: 154.66, h: 160.23, l: 154.08, c: 160 },
            { o: 160, h: 160.22, l: 159.8, c: 159.95 },
            { o: 159.95, h: 160.44, l: 157.77, c: 158.02 },
            { o: 158.02, h: 159.1, l: 157.83, c: 158.9 },
            { o: 158.9, h: 159.22, l: 156.37, c: 156.56 },
            { o: 156.56, h: 157.38, l: 156.44, c: 157.31 },
            { o: 157.31, h: 157.56, l: 155.81, c: 156 },
            { o: 156, h: 156.12, l: 153.1, c: 153.5 },
            { o: 153.5, h: 153.99, l: 149.72, c: 150.16 },
            { o: 150.16, h: 150.29, l: 147.86, c: 148 },
            { o: 141.4, h: 141.79, l: 139.93, c: 141.33 },
            { o: 141.33, h: 144.9, l: 141.22, c: 144.62 },
            { o: 144.62, h: 148.24, l: 144.51, c: 148.08 },
            { o: 148.08, h: 152.59, l: 147.86, c: 152.43 },
            { o: 152.43, h: 156.27, l: 152.18, c: 155.88 },
            { o: 155.88, h: 160.15, l: 155.44, c: 160.01 },
            { o: 160.01, h: 163.21, l: 159.69, c: 162.98 },
            { o: 162.98, h: 166.08, l: 162.71, c: 166 }
          ],
          zones: [
            { from: 5, top: 140.53, bottom: 139.32, kind: "demand", label: "Wholesale (demand)" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "The gap down into demand: wholesale prices that will not last."
      },
      {
        type: "mcq",
        q: "For you to profit after buying, what must happen?",
        options: [
          "The news must be good",
          "Others must buy after you at higher prices",
          "An indicator must turn up",
          "Volume must rise"
        ],
        answer: 1,
        explain: "Profit needs later buyers at higher prices, so buy before them, at demand."
      },
      {
        type: "mcq",
        q: "Which two lined up on Aug 19, 2009?",
        options: ["Gold and oil", "NASDAQ demand and Cisco demand", "Dollar and euro", "Bonds and VIX"],
        answer: 1,
        explain: "The index gapped into demand while CSCO sat at aligned demand."
      }
    ],
    practice: [
      {
        prompt: "Bad news overnight. The index is gapping down into its demand and this stock is gapping into its own demand. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.46, l: 143.84, c: 144.75 },
            { o: 144.75, h: 146.14, l: 135.16, c: 136.34 },
            { o: 136.34, h: 137.3, l: 129.73, c: 130.26 },
            { o: 130.26, h: 131.13, l: 124.07, c: 124.93 },
            { o: 124.93, h: 125.41, l: 119.47, c: 120 },
            { o: 120, h: 120.58, l: 119.73, c: 120.42 },
            { o: 120.42, h: 120.56, l: 119.42, c: 119.65 },
            { o: 119.65, h: 120.43, l: 119.47, c: 120.31 },
            { o: 120.31, h: 125.46, l: 120, c: 124.98 },
            { o: 124.98, h: 130.18, l: 124.74, c: 129.92 },
            { o: 129.92, h: 134.46, l: 129.73, c: 134.2 },
            { o: 134.2, h: 139.17, l: 134.04, c: 139 },
            { o: 139, h: 139.29, l: 138.92, c: 139.11 },
            { o: 139.11, h: 139.62, l: 135.99, c: 136.54 },
            { o: 136.54, h: 137.75, l: 136.29, c: 137.59 },
            { o: 137.59, h: 138.07, l: 134.9, c: 135.1 },
            { o: 135.1, h: 135.35, l: 134.83, c: 135 },
            { o: 135, h: 135.2, l: 131.67, c: 132.12 },
            { o: 132.12, h: 132.2, l: 130.77, c: 130.87 },
            { o: 130.87, h: 131.2, l: 127.67, c: 128 },
            { o: 121.2, h: 121.6, l: 119.92, c: 121.22 },
            { o: 121.22, h: 123.9, l: 120.99, c: 123.67 },
            { o: 123.67, h: 127.85, l: 123.55, c: 127.48 },
            { o: 127.48, h: 130.75, l: 127.29, c: 130.43 },
            { o: 130.43, h: 132.74, l: 130.21, c: 132.56 },
            { o: 132.56, h: 135.41, l: 132.36, c: 135.27 },
            { o: 135.27, h: 139.67, l: 135.02, c: 139.39 },
            { o: 139.39, h: 142.28, l: 139.21, c: 142 }
          ],
          zones: [
            { from: 5, top: 120.42, bottom: 119.42, kind: "demand", label: "Demand" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Wholesale price plus index alignment. Buy the sale. Price rallied back up."
      },
      {
        prompt: "Great earnings news. The stock has rallied for days and is now reaching a supply zone where it dropped hard before. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 130, h: 138.23, l: 129.54, c: 137.35 },
            { o: 137.35, h: 144.8, l: 136.99, c: 144.46 },
            { o: 144.46, h: 158.54, l: 143.32, c: 156.93 },
            { o: 156.93, h: 166.96, l: 156.49, c: 165.68 },
            { o: 165.68, h: 172.57, l: 164.4, c: 172 },
            { o: 172, h: 172.36, l: 171.66, c: 172.22 },
            { o: 172.22, h: 172.5, l: 171.46, c: 171.63 },
            { o: 171.63, h: 172.6, l: 171.37, c: 172.44 },
            { o: 172.44, h: 172.59, l: 166.81, c: 167.11 },
            { o: 167.11, h: 167.68, l: 161.03, c: 161.63 },
            { o: 161.63, h: 161.99, l: 156.54, c: 156.89 },
            { o: 156.89, h: 157.03, l: 151.74, c: 152 },
            { o: 152, h: 153.91, l: 151.52, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.68, c: 152.92 },
            { o: 152.92, h: 155.32, l: 152.31, c: 155.12 },
            { o: 155.12, h: 155.32, l: 154.38, c: 154.44 },
            { o: 154.44, h: 156.4, l: 154.32, c: 156 },
            { o: 156, h: 161.62, l: 155.77, c: 160.7 },
            { o: 160.7, h: 166.91, l: 159.65, c: 166.44 },
            { o: 166.44, h: 171.05, l: 166.12, c: 170.23 },
            { o: 170.23, h: 172.02, l: 169.87, c: 170.83 },
            { o: 170.83, h: 171.01, l: 167.61, c: 167.69 },
            { o: 167.69, h: 168.2, l: 162.74, c: 162.89 },
            { o: 162.89, h: 163.15, l: 159.09, c: 159.41 },
            { o: 159.41, h: 159.49, l: 156.45, c: 156.62 },
            { o: 156.62, h: 156.86, l: 153.45, c: 153.68 },
            { o: 153.68, h: 153.91, l: 149.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 172.6, bottom: 171.63, kind: "supply", label: "Retail (supply)" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "This is retail: buying after good news and a rally into supply. Sell to those buyers. Price fell from the zone."
      }
    ],
    cards: [
      { front: "Wholesale and retail on a chart?", back: "Wholesale = demand, retail = supply." },
      {
        front: "Two reasons people lose?",
        back: "Conventional analysis teaches herd buying after good news, and they drop everyday shopping logic."
      },
      { front: "A gap down into demand is...?", back: "A sale, not a reason to sell." },
      { front: "The pizza owner at $4 cheese?", back: "Buys only what he needs." }
    ],
    mnemonic: "Coupon at demand, full price at supply."
  },
  {
    mentor: "seiden",
    n: 210,
    eli5: {
      oneLiner: "Do not trade like the town where everyone thinks the same.",
      story: "In the town of Foolsville, everyone eats the same food, drives the same car and buys when the news is good and prices are rising. Their money flows out of town to people who sell when they buy. One morning the S&P opened under a supply level where price had gapped down before. Sam waited for the rally back into it, while the bank sector and two big bank stocks sat at the same kind of supply. The Fools bought, Sam sold, and all four fell hard.",
      analogy: "You have to step outside a box to see that it is a box."
    },
    bigIdeas: [
      "To earn more, learn to do what others cannot. That needs different thinking.",
      "A gap down from a base marks strong supply. If price opens below it, wait for the rally into it.",
      "Index, sector and stocks at supply together stack the odds."
    ],
    steps: [
      {
        title: "Supply that gapped away",
        narration: "Price based and then gapped down. Price could not stay there: too much supply. Mark the base as S&P supply.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ],
          highlight: { from: 5, to: 7, label: "base" },
          reveal: 11
        }
      },
      {
        title: "Open below: wait, do not chase",
        narration: "Price opens below the level. Shorting down here would be selling low. We need a rally back into supply, with buyers buying after that rally.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ],
          reveal: 17
        }
      },
      {
        title: "The whole family agrees",
        narration: "The financial sector fund has the same supply, and two bank stocks have clear supply just above their open. Index, sector and stocks line up.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ],
          notes: [
            { x: 15, y: 165.62, text: "Sector + banks at supply too" }
          ],
          reveal: 19
        }
      },
      {
        title: "Sell to Foolsville",
        narration: "Price rallies into the bottom line. The Fools see good news, rising price and bullish indicators and buy. We sell to them with the stop above the zone.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ],
          lines: [
            { y: 161.67, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 162.87, label: "Stop above distal", kind: "sl", from: 7 }
          ],
          reveal: 20
        }
      },
      {
        title: "Money leaves Foolsville",
        narration: "Price collapses. The index, the sector and both stocks fell hard together.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ],
          lines: [
            { y: 161.67, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 162.87, label: "Stop above distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The S&P opens below the supply it gapped away from. What does Sam do?",
        options: [
          "Short at the open",
          "Wait for a rally into the zone, then short",
          "Buy the open",
          "Skip the day"
        ],
        answer: 1,
        explain: "Price opened below the level, so a rally into it was needed, with buyers buying after that rally."
      },
      {
        type: "spot",
        q: "Click the gap that showed the supply was strong.",
        scene: {
          candles: [
            { o: 140, h: 144.69, l: 139.69, c: 143.86 },
            { o: 143.86, h: 148.36, l: 143.27, c: 148.16 },
            { o: 148.16, h: 154.07, l: 147.67, c: 153.02 },
            { o: 153.02, h: 157.34, l: 152.75, c: 156.96 },
            { o: 156.96, h: 162.33, l: 156.2, c: 162 },
            { o: 162, h: 162.57, l: 161.73, c: 162.3 },
            { o: 162.3, h: 162.49, l: 161.46, c: 161.67 },
            { o: 161.67, h: 162.62, l: 161.45, c: 162.41 },
            { o: 158.41, h: 158.68, l: 155.28, c: 155.61 },
            { o: 155.61, h: 155.86, l: 151.76, c: 152 },
            { o: 152, h: 153.05, l: 151.92, c: 152.9 },
            { o: 152.9, h: 153.23, l: 151.46, c: 151.82 },
            { o: 151.82, h: 153.93, l: 151.29, c: 153.4 },
            { o: 153.4, h: 153.68, l: 151.99, c: 152.28 },
            { o: 152.28, h: 153.24, l: 152.13, c: 153 },
            { o: 153, h: 154.64, l: 152.87, c: 154.37 },
            { o: 154.37, h: 156.21, l: 154.15, c: 156.12 },
            { o: 156.12, h: 158.66, l: 155.96, c: 158.2 },
            { o: 158.2, h: 160.72, l: 157.92, c: 160.27 },
            { o: 160.27, h: 162.05, l: 159.88, c: 160.87 },
            { o: 160.87, h: 161.24, l: 156.64, c: 156.8 },
            { o: 156.8, h: 156.94, l: 152.89, c: 153.28 },
            { o: 153.28, h: 153.45, l: 149.32, c: 149.44 },
            { o: 149.44, h: 149.7, l: 145.46, c: 145.78 },
            { o: 145.78, h: 145.89, l: 144.1, c: 144.14 },
            { o: 144.14, h: 144.53, l: 139.33, c: 139.71 },
            { o: 139.71, h: 139.98, l: 135.64, c: 136 }
          ],
          zones: [
            { from: 5, top: 162.62, bottom: 161.67, kind: "supply", label: "S&P supply" }
          ]
        },
        answer: { from: 8, to: 8 },
        explain: "The first candle after the gap down from the base. A gap away marks a big imbalance."
      },
      {
        type: "tf",
        q: "Buying when the news, the price and the indicators all look bullish is the best setup.",
        answer: false,
        explain: "That is the Foolsville setup. It buys after the rise, right where Sam sells."
      },
      {
        type: "mcq",
        q: "What stacked the odds for the Sept 1 short?",
        options: [
          "A moving-average cross",
          "Index, sector and stocks all at supply together",
          "High volume",
          "Good economic news"
        ],
        answer: 1,
        explain: "S&P, XLF, GS and C all had supply just above."
      }
    ],
    practice: [
      {
        prompt: "The index opened below a gap-origin supply and is now rallying back into it. The sector and your stock are also at supply. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 124.7, l: 119.36, c: 124.39 },
            { o: 124.39, h: 130.04, l: 124.15, c: 129.49 },
            { o: 129.49, h: 135.29, l: 128.98, c: 134.38 },
            { o: 134.38, h: 140.04, l: 133.68, c: 139.61 },
            { o: 139.61, h: 145.31, l: 138.89, c: 145 },
            { o: 145, h: 145.7, l: 144.87, c: 145.43 },
            { o: 145.43, h: 145.54, l: 144.49, c: 144.66 },
            { o: 144.66, h: 145.46, l: 144.37, c: 145.23 },
            { o: 141.73, h: 141.98, l: 139.33, c: 139.56 },
            { o: 139.56, h: 139.79, l: 136.7, c: 137 },
            { o: 137, h: 137.79, l: 136.89, c: 137.6 },
            { o: 137.6, h: 137.87, l: 136.53, c: 136.64 },
            { o: 136.64, h: 138.4, l: 136.29, c: 138 },
            { o: 138, h: 138.27, l: 137.35, c: 137.5 },
            { o: 137.5, h: 139.54, l: 137.35, c: 139.36 },
            { o: 139.36, h: 140.3, l: 139.26, c: 140.13 },
            { o: 140.13, h: 141.66, l: 139.86, c: 141.41 },
            { o: 141.41, h: 143.62, l: 141.1, c: 143.26 },
            { o: 143.26, h: 145.08, l: 142.84, c: 143.86 },
            { o: 143.86, h: 144.13, l: 140.57, c: 140.66 },
            { o: 140.66, h: 140.82, l: 138.41, c: 138.48 },
            { o: 138.48, h: 138.85, l: 134.58, c: 134.74 },
            { o: 134.74, h: 134.83, l: 133.05, c: 133.1 },
            { o: 133.1, h: 133.21, l: 129.8, c: 130.15 },
            { o: 130.15, h: 130.51, l: 126.63, c: 126.89 },
            { o: 126.89, h: 127.17, l: 123.93, c: 124 }
          ],
          zones: [
            { from: 5, top: 145.7, bottom: 144.66, kind: "supply", label: "Supply" }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Everything lines up at supply and the buyers are buying after a rally. Sell. Price collapsed from the zone."
      }
    ],
    cards: [
      { front: "Foolsville buy signal?", back: "Good news, rising price and bullish indicators all together." },
      { front: "Price opens below supply: action?", back: "Wait for the rally into the zone; do not chase." },
      { front: "What stacks the odds?", back: "Index, sector and stocks at the same kind of level." },
      { front: "To command a higher income...", back: "Learn to do something others can't." }
    ],
    mnemonic: "Leave the box: sell when Foolsville buys."
  },
  {
    mentor: "seiden",
    n: 217,
    eli5: {
      oneLiner: "Every visit to a level eats its orders. Shallow bounces mean it is nearly empty.",
      story: "Price had gapped away from a supply level, so lots of sell orders were waiting there. On the first visit price fell hard. On the second visit price gapped in and fell again, but not as far. On the third and fourth visits the drops were tiny, so the class stopped selling. When price pushed deep into the zone, they knew the sellers were used up and looked for a buy on a smaller chart instead.",
      analogy: "A level is like a pile of sandbags holding back water. Each wave washes some away. When the waves start getting over the top, the wall is about to go."
    },
    bigIdeas: [
      "Mass = supply and demand; motion happens between them.",
      "The first revisit has the highest odds. Each revisit removes orders; shallower reactions mean the level is failing.",
      "When price pushes deep into the level, switch sides: look for smaller-timeframe demand below."
    ],
    steps: [
      {
        title: "Strong supply: a gap away",
        narration: "Price based and gapped down. The gap says supply greatly exceeded demand. Lots of sell orders are left there.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          highlight: { from: 5, to: 7, label: "base" },
          reveal: 11
        }
      },
      {
        title: "A: the first revisit",
        narration: "Price comes back for the first time and falls a long way. The first revisit has the highest odds.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          notes: [
            { x: 15, y: 158.59, text: "A" }
          ],
          reveal: 20
        }
      },
      {
        title: "B: a novice gap in",
        narration: "A week later price gaps into the zone: novices buying. Worth a short, but less supply is left, and the drop is smaller.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          notes: [
            { x: 15, y: 158.59, text: "A" },
            { x: 23, y: 158.59, text: "B" }
          ],
          reveal: 27
        }
      },
      {
        title: "C and D: shallow reactions",
        narration: "Now each drop from the level is shallow. The sell orders are being absorbed. Shorting here has become high risk, so the class stops.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          notes: [
            { x: 15, y: 158.59, text: "A" },
            { x: 23, y: 158.59, text: "B" },
            { x: 29, y: 158.59, text: "C" },
            { x: 34, y: 158.59, text: "D" }
          ],
          highlight: { from: 29, to: 35, label: "shallow" },
          reveal: 36
        }
      },
      {
        title: "E: deep push, switch sides",
        narration: "Price pushes deep into the zone and breaks above. The mass is gone. Now the plan is to buy fresh demand on a smaller chart, with little supply left overhead.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          notes: [
            { x: 15, y: 158.59, text: "A" },
            { x: 23, y: 158.59, text: "B" },
            { x: 29, y: 158.59, text: "C" },
            { x: 34, y: 158.59, text: "D" },
            { x: 37, y: 159.09, text: "E" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the revisit with the highest odds.",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ]
        },
        answer: { from: 15, to: 15 },
        explain: "The first revisit, A. It had the most orders waiting and the deepest decline."
      },
      {
        type: "mcq",
        q: "Reactions from a supply level get shallower on each visit. What do you do?",
        options: [
          "Short bigger",
          "Stop shorting it; it is being absorbed",
          "Add indicators",
          "Move the zone higher"
        ],
        answer: 1,
        explain: "Shallow reactions mean the orders are used up. Shorting becomes high risk."
      },
      {
        type: "tf",
        q: "A gap into a level can show novice entries and justify a trade on a later revisit.",
        answer: true,
        explain: "At B the novice gap into supply justified a short, though with less supply left."
      },
      {
        type: "mcq",
        q: "Price pushes deep into the supply at E. What was the class's next idea?",
        options: [
          "Short again with a wider stop",
          "Look for demand below on a smaller timeframe and buy",
          "Do nothing for a month",
          "Average down"
        ],
        answer: 1,
        explain: "The mass was removed, so motion higher was likely. They bought 5-minute demand."
      },
      {
        type: "order",
        q: "Order the life of this supply level.",
        items: [
          "Base and gap away",
          "First revisit: big drop",
          "Novice gap in: smaller drop",
          "Shallow touches",
          "Deep push and break"
        ],
        explain: "Each visit absorbs orders until the level breaks."
      }
    ],
    practice: [
      {
        prompt: "Fourth touch of this supply. The last two drops were tiny. Price is pushing up into the zone again. Sell, buy or nothing?",
        scene: {
          candles: [
            { o: 126, h: 132.47, l: 125.71, c: 131.4 },
            { o: 131.4, h: 139.53, l: 131.09, c: 138.38 },
            { o: 138.38, h: 145.16, l: 137.64, c: 144.72 },
            { o: 144.72, h: 152.2, l: 143.35, c: 150.99 },
            { o: 150.99, h: 156.54, l: 150.66, c: 156 },
            { o: 156, h: 156.59, l: 155.83, c: 156.38 },
            { o: 156.38, h: 156.57, l: 155.44, c: 155.62 },
            { o: 155.62, h: 156.52, l: 155.46, c: 156.39 },
            { o: 152.89, h: 153.41, l: 147.93, c: 148.22 },
            { o: 148.22, h: 148.35, l: 143.92, c: 144.33 },
            { o: 144.33, h: 144.65, l: 139.5, c: 140 },
            { o: 140, h: 145.34, l: 139.79, c: 144.74 },
            { o: 144.74, h: 148.61, l: 144.25, c: 148.34 },
            { o: 148.34, h: 151.41, l: 148.15, c: 151 },
            { o: 151, h: 154.88, l: 150.64, c: 154.62 },
            { o: 154.62, h: 155.91, l: 154.16, c: 154.62 },
            { o: 154.62, h: 155.01, l: 150.47, c: 150.66 },
            { o: 150.66, h: 151.29, l: 147.25, c: 147.53 },
            { o: 147.53, h: 147.87, l: 141.29, c: 142.09 },
            { o: 142.09, h: 142.29, l: 137.61, c: 138 },
            { o: 138, h: 141.92, l: 137.38, c: 141.31 },
            { o: 141.31, h: 143.98, l: 141.05, c: 143.77 },
            { o: 143.77, h: 147.33, l: 143.17, c: 147 },
            { o: 155.52, h: 156.11, l: 154.55, c: 154.82 },
            { o: 154.82, h: 155.11, l: 152.97, c: 153.12 },
            { o: 153.12, h: 153.38, l: 151.31, c: 151.58 },
            { o: 151.58, h: 151.71, l: 149.39, c: 149.62 },
            { o: 149.62, h: 152.85, l: 149.26, c: 152.69 },
            { o: 152.69, h: 154.97, l: 152.57, c: 154.82 },
            { o: 154.82, h: 156.2, l: 154.31, c: 155.12 },
            { o: 155.12, h: 155.24, l: 153.38, c: 153.51 },
            { o: 153.51, h: 153.64, l: 152.55, c: 152.62 },
            { o: 152.62, h: 154.16, l: 152.38, c: 153.94 },
            { o: 153.94, h: 155.1, l: 153.77, c: 155.02 },
            { o: 155.02, h: 156.3, l: 154.71, c: 155.32 },
            { o: 155.32, h: 155.55, l: 153.98, c: 154.12 },
            { o: 154.12, h: 155.63, l: 153.84, c: 155.42 },
            { o: 155.42, h: 156.54, l: 155.13, c: 156.39 },
            { o: 156.39, h: 158.22, l: 156.17, c: 158.13 },
            { o: 158.13, h: 159.6, l: 157.86, c: 159.41 },
            { o: 159.41, h: 160.8, l: 159.34, c: 160.72 },
            { o: 160.72, h: 162.91, l: 160.42, c: 162.59 }
          ],
          zones: [
            { from: 5, top: 156.59, bottom: 155.62, kind: "supply", label: "Supply (mass)" }
          ],
          notes: [
            { x: 15, y: 158.59, text: "A" },
            { x: 23, y: 158.59, text: "B" },
            { x: 29, y: 158.59, text: "C" },
            { x: 34, y: 158.59, text: "D" }
          ],
          reveal: 37
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The reactions got shallow: the supply is absorbed. Do not short it again. Price broke above the zone."
      }
    ],
    cards: [
      { front: "Mass and motion?", back: "Mass = demand and supply; motion occurs between them." },
      { front: "Highest-odds revisit?", back: "The first one." },
      { front: "Shallower reactions mean?", back: "Orders are being absorbed; the level is failing." },
      {
        front: "Price pushes deep into supply: next?",
        back: "Switch sides and look for smaller-timeframe demand to buy."
      },
      { front: "What does a gap away show?", back: "A strong level: supply greatly exceeded demand." }
    ],
    mnemonic: "Big, smaller, tiny, gone: then flip."
  },
  {
    mentor: "seiden",
    n: 223,
    eli5: {
      oneLiner: "Small losses are part of winning. Take the loss, then take the next setup.",
      story: "Sam shorted Apple at a level that looked like supply, but price rallied through it and he lost $960. He did not get upset or quit. His rules pointed to the next supply above, so he shorted there. Price fell, he moved his stop to break even at 3:1, and he made $3,020. One loss and one win still left him well ahead.",
      analogy: "A golfer who hits one bad shot does not quit the game. He lines up the next shot calmly, because one shot never decides the round."
    },
    bigIdeas: [
      "Losses belong in the winning column: they are a normal cost of a profitable plan.",
      "Keep each loss small and comfortable. If it makes you cringe, the size is too big.",
      "After a stop-out, keep following the rules. At 3:1, move the stop to break even."
    ],
    steps: [
      {
        title: "A looks like supply",
        narration: "Price rallied, paused and dropped. A looks like supply, so the rules say short the return.",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" }
          ],
          reveal: 13
        }
      },
      {
        title: "The short, then the stop",
        narration: "Price comes back and the short is taken. It works for a bit, then price rallies right through A. The stop is hit: a small, planned loss.",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" }
          ],
          lines: [
            { y: 139.49, label: "Entry (proximal)", kind: "entry", from: 6 },
            { y: 140.68, label: "Stop above distal", kind: "sl", from: 6 }
          ],
          highlight: { from: 13, to: 17, label: "stopped" },
          reveal: 18
        }
      },
      {
        title: "Next level, same rules",
        narration: "A had less supply than it looked. Price zooms up to the next supply, C. No fear, no revenge: the rules say short again.",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" },
            { from: 22, top: 156.5, bottom: 155.73, kind: "supply", label: "C: next supply" }
          ],
          lines: [
            { y: 155.73, label: "Short C", kind: "entry", from: 23 },
            { y: 156.75, label: "Stop", kind: "sl", from: 23 },
            { y: 152.67, label: "3:1", kind: "tp", from: 23 }
          ],
          reveal: 29
        }
      },
      {
        title: "Free trade, then profit",
        narration: "Price falls. At 3:1 the stop moves to break even, so the trade is now free. The winner is three times bigger than the loser.",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" },
            { from: 22, top: 156.5, bottom: 155.73, kind: "supply", label: "C: next supply" }
          ],
          lines: [
            { y: 155.73, label: "Short C", kind: "entry", from: 23 },
            { y: 155.73, label: "Stop to break even", kind: "sl", from: 31 },
            { y: 152.67, label: "3:1", kind: "tp", from: 23 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A good trader tries to eliminate all losing trades.",
        answer: false,
        explain: "Trying to eliminate losses also eliminated Sam's winning trades. Losses are part of winning."
      },
      {
        type: "mcq",
        q: "A loss makes you cringe. What does that tell you?",
        options: [
          "Your strategy is wrong",
          "The position is too big for your comfort",
          "You should double up",
          "Stop trading forever"
        ],
        answer: 1,
        explain: "A loss should be small and no big deal. If it hurts, cut the size."
      },
      {
        type: "mcq",
        q: "Ten trades, 50% win rate, losses 1R, wins 3R. Result?",
        options: ["Break even", "+10R", "-5R", "+5R"],
        answer: 1,
        explain: "5 x 3R = 15R minus 5 x 1R = 5R gives +10R. Like a casino with an edge."
      },
      {
        type: "spot",
        q: "Click the candle where the second (winning) short was entered.",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" },
            { from: 22, top: 156.5, bottom: 155.73, kind: "supply", label: "C: next supply" }
          ]
        },
        answer: { from: 28, to: 28 },
        explain: "The return to the next supply, C, after the first short was stopped."
      },
      {
        type: "mcq",
        q: "When does the stop move to break even?",
        options: ["Right after entry", "When price reaches 3:1", "Never", "At the end of the day"],
        answer: 1,
        explain: "At 3:1 the stop goes to break even: a free trade."
      }
    ],
    practice: [
      {
        prompt: "Your short at A was just stopped out for a small loss. Price has now rallied into the next supply, C. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 124.26, l: 119.27, c: 123.6 },
            { o: 123.6, h: 129.56, l: 122.91, c: 129 },
            { o: 129, h: 131.31, l: 128.72, c: 131.1 },
            { o: 131.1, h: 136.34, l: 130.2, c: 135.81 },
            { o: 135.81, h: 140.38, l: 135.15, c: 140 },
            { o: 140, h: 140.37, l: 139.66, c: 140.2 },
            { o: 140.2, h: 140.43, l: 139.3, c: 139.49 },
            { o: 139.49, h: 139.91, l: 135.97, c: 136.07 },
            { o: 136.07, h: 136.19, l: 132.78, c: 133.15 },
            { o: 133.15, h: 133.42, l: 129.61, c: 130 },
            { o: 130, h: 134.17, l: 129.32, c: 133.57 },
            { o: 133.57, h: 135.87, l: 133.45, c: 135.74 },
            { o: 135.74, h: 139.07, l: 135.42, c: 138.49 },
            { o: 138.49, h: 139.79, l: 138.21, c: 138.69 },
            { o: 138.69, h: 138.93, l: 137.08, c: 137.29 },
            { o: 137.29, h: 139.77, l: 137.11, c: 139.48 },
            { o: 139.48, h: 141.48, l: 139.31, c: 141.12 },
            { o: 141.12, h: 143.54, l: 140.62, c: 143.43 },
            { o: 143.43, h: 146.51, l: 143.27, c: 146.27 },
            { o: 146.27, h: 149.18, l: 145.9, c: 148.97 },
            { o: 148.97, h: 152.73, l: 148.3, c: 152.24 },
            { o: 152.24, h: 156.47, l: 152.06, c: 156 },
            { o: 156, h: 156.5, l: 155.74, c: 156.23 },
            { o: 156.23, h: 156.34, l: 155.63, c: 155.73 },
            { o: 155.73, h: 156.17, l: 151.99, c: 152.32 },
            { o: 152.32, h: 152.39, l: 149.79, c: 150 },
            { o: 150, h: 153.18, l: 149.37, c: 152.97 },
            { o: 152.97, h: 155.21, l: 152.86, c: 154.93 },
            { o: 154.93, h: 156.13, l: 154.24, c: 154.73 },
            { o: 154.73, h: 154.88, l: 153.45, c: 153.61 },
            { o: 153.61, h: 153.72, l: 152.77, c: 152.84 },
            { o: 152.84, h: 153.02, l: 151.76, c: 151.95 },
            { o: 151.95, h: 152.14, l: 150.48, c: 150.6 },
            { o: 150.6, h: 150.8, l: 149.57, c: 149.64 },
            { o: 149.64, h: 149.75, l: 148.55, c: 148.67 }
          ],
          zones: [
            { from: 22, top: 156.5, bottom: 155.73, kind: "supply", label: "C: next supply" },
            { from: 5, top: 140.43, bottom: 139.49, kind: "supply", label: "A: supply?" }
          ],
          reveal: 28
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "The loss is behind you; the rules point to C. Sell it. Price fell to 3:1 and beyond."
      }
    ],
    cards: [
      { front: "Which column do losses go in?", back: "The winning column: they are part of a profitable plan." },
      { front: "Winners play to...; losers play...?", back: "Winners play to win; losers play not to lose." },
      { front: "Sam's typical max loss in his lower-risk account?", back: "$1,000 or less." },
      { front: "AAPL result?", back: "-$960 on A, then +$3,020 on C." },
      { front: "Break-even rule?", back: "Move the stop to break even at 3:1." }
    ],
    mnemonic: "Lose small, next ball: one bad shot never ends the round."
  },
  {
    mentor: "seiden",
    n: 228,
    eli5: {
      oneLiner: "Plan every entry before the first one. A fresh old level can be the best.",
      story: "A reader asked whether buying more as price falls is smart or silly. Sam said it is smart only if it was in the plan before the first order: every entry, one stop and the total size. Unplanned buying more is just adding to a loser. He also said a fresh level from long ago, never visited since, can be even better than a new one, because the rubber band is stretched so far.",
      analogy: "Planned scaling is like a recipe that says add flour in three steps. Throwing in more flour because the cake looks wrong is panic, not cooking."
    },
    bigIdeas: [
      "Scaling in is smart only when all entries, the stop and total size are set before the first fill. Add larger size nearer the stop.",
      "Fresh means never revisited. A fresh level far back in time is high quality: price is far out on the curve.",
      "VIX at supply while stocks are at demand favours a rally. Position trades need large profit margins."
    ],
    steps: [
      {
        title: "A level from long ago",
        narration: "Price dropped, based and rallied strongly. Then it wandered for a long time, never coming back to this base. It is still fresh.",
        scene: {
          candles: [
            { o: 160, h: 161.06, l: 152.52, c: 153.64 },
            { o: 153.64, h: 153.99, l: 144.58, c: 146.17 },
            { o: 146.17, h: 147.07, l: 137.94, c: 139 },
            { o: 139, h: 141.04, l: 127.5, c: 129.13 },
            { o: 129.13, h: 129.74, l: 123.63, c: 124 },
            { o: 124, h: 124.63, l: 123.78, c: 124.3 },
            { o: 124.3, h: 124.52, l: 123.64, c: 123.8 },
            { o: 123.8, h: 124.62, l: 123.51, c: 124.4 },
            { o: 124.4, h: 130.56, l: 124.13, c: 130.28 },
            { o: 130.28, h: 137.59, l: 130.09, c: 137.13 },
            { o: 137.13, h: 144.96, l: 136.89, c: 144.3 },
            { o: 144.3, h: 150.54, l: 144.09, c: 150 },
            { o: 150, h: 153.89, l: 149.22, c: 153.12 },
            { o: 153.12, h: 153.75, l: 150.19, c: 150.45 },
            { o: 150.45, h: 155.91, l: 148.88, c: 155.41 },
            { o: 155.41, h: 155.8, l: 153.09, c: 153.25 },
            { o: 153.25, h: 159.23, l: 152.65, c: 157.95 },
            { o: 157.95, h: 158.74, l: 154.91, c: 155.59 },
            { o: 155.59, h: 160.69, l: 154.76, c: 159.43 },
            { o: 159.43, h: 159.52, l: 158.35, c: 158.57 },
            { o: 158.57, h: 162.64, l: 158.05, c: 162.14 },
            { o: 162.14, h: 162.41, l: 161.93, c: 162 },
            { o: 162, h: 162.18, l: 161.85, c: 162.07 },
            { o: 162.07, h: 162.83, l: 156.54, c: 157.18 },
            { o: 157.18, h: 159.65, l: 156.99, c: 159.05 },
            { o: 159.05, h: 160.18, l: 154.09, c: 154.91 },
            { o: 154.91, h: 156, l: 154.82, c: 155.88 },
            { o: 155.88, h: 157.1, l: 150.42, c: 151.67 },
            { o: 151.67, h: 153.5, l: 151.44, c: 153.3 },
            { o: 153.3, h: 154.07, l: 148.86, c: 150 },
            { o: 150, h: 151.01, l: 144.11, c: 145.16 },
            { o: 145.16, h: 145.46, l: 140.01, c: 140.86 },
            { o: 140.86, h: 141.35, l: 137.46, c: 137.67 },
            { o: 137.67, h: 137.83, l: 133.78, c: 134.15 },
            { o: 134.15, h: 134.95, l: 128.04, c: 128.86 },
            { o: 128.86, h: 129.2, l: 125.16, c: 125.8 },
            { o: 125.8, h: 126.15, l: 123.78, c: 125.2 },
            { o: 125.2, h: 130.94, l: 124.88, c: 130.38 },
            { o: 130.38, h: 134.35, l: 129.98, c: 134.1 },
            { o: 134.1, h: 140.51, l: 133.89, c: 139.9 },
            { o: 139.9, h: 142.97, l: 139.63, c: 142.69 },
            { o: 142.69, h: 149.17, l: 142.48, c: 148.48 },
            { o: 148.48, h: 154.37, l: 148.34, c: 154.22 },
            { o: 154.22, h: 158.13, l: 153.9, c: 158 }
          ],
          zones: [
            { from: 5, top: 124.4, bottom: 123.51, kind: "demand", label: "Fresh (far back)" }
          ],
          reveal: 30
        }
      },
      {
        title: "Write the scaling plan first",
        narration: "Before the first order: entry 1 at the top line (small), entry 2 deeper in the zone (larger, closer to the stop), and one stop below the zone. The total risk is known now.",
        scene: {
          candles: [
            { o: 160, h: 161.06, l: 152.52, c: 153.64 },
            { o: 153.64, h: 153.99, l: 144.58, c: 146.17 },
            { o: 146.17, h: 147.07, l: 137.94, c: 139 },
            { o: 139, h: 141.04, l: 127.5, c: 129.13 },
            { o: 129.13, h: 129.74, l: 123.63, c: 124 },
            { o: 124, h: 124.63, l: 123.78, c: 124.3 },
            { o: 124.3, h: 124.52, l: 123.64, c: 123.8 },
            { o: 123.8, h: 124.62, l: 123.51, c: 124.4 },
            { o: 124.4, h: 130.56, l: 124.13, c: 130.28 },
            { o: 130.28, h: 137.59, l: 130.09, c: 137.13 },
            { o: 137.13, h: 144.96, l: 136.89, c: 144.3 },
            { o: 144.3, h: 150.54, l: 144.09, c: 150 },
            { o: 150, h: 153.89, l: 149.22, c: 153.12 },
            { o: 153.12, h: 153.75, l: 150.19, c: 150.45 },
            { o: 150.45, h: 155.91, l: 148.88, c: 155.41 },
            { o: 155.41, h: 155.8, l: 153.09, c: 153.25 },
            { o: 153.25, h: 159.23, l: 152.65, c: 157.95 },
            { o: 157.95, h: 158.74, l: 154.91, c: 155.59 },
            { o: 155.59, h: 160.69, l: 154.76, c: 159.43 },
            { o: 159.43, h: 159.52, l: 158.35, c: 158.57 },
            { o: 158.57, h: 162.64, l: 158.05, c: 162.14 },
            { o: 162.14, h: 162.41, l: 161.93, c: 162 },
            { o: 162, h: 162.18, l: 161.85, c: 162.07 },
            { o: 162.07, h: 162.83, l: 156.54, c: 157.18 },
            { o: 157.18, h: 159.65, l: 156.99, c: 159.05 },
            { o: 159.05, h: 160.18, l: 154.09, c: 154.91 },
            { o: 154.91, h: 156, l: 154.82, c: 155.88 },
            { o: 155.88, h: 157.1, l: 150.42, c: 151.67 },
            { o: 151.67, h: 153.5, l: 151.44, c: 153.3 },
            { o: 153.3, h: 154.07, l: 148.86, c: 150 },
            { o: 150, h: 151.01, l: 144.11, c: 145.16 },
            { o: 145.16, h: 145.46, l: 140.01, c: 140.86 },
            { o: 140.86, h: 141.35, l: 137.46, c: 137.67 },
            { o: 137.67, h: 137.83, l: 133.78, c: 134.15 },
            { o: 134.15, h: 134.95, l: 128.04, c: 128.86 },
            { o: 128.86, h: 129.2, l: 125.16, c: 125.8 },
            { o: 125.8, h: 126.15, l: 123.78, c: 125.2 },
            { o: 125.2, h: 130.94, l: 124.88, c: 130.38 },
            { o: 130.38, h: 134.35, l: 129.98, c: 134.1 },
            { o: 134.1, h: 140.51, l: 133.89, c: 139.9 },
            { o: 139.9, h: 142.97, l: 139.63, c: 142.69 },
            { o: 142.69, h: 149.17, l: 142.48, c: 148.48 },
            { o: 148.48, h: 154.37, l: 148.34, c: 154.22 },
            { o: 154.22, h: 158.13, l: 153.9, c: 158 }
          ],
          zones: [
            { from: 5, top: 124.4, bottom: 123.51, kind: "demand", label: "Fresh (far back)" }
          ],
          lines: [
            { y: 124.4, label: "Entry 1 (small)", kind: "entry", from: 7 },
            { y: 123.87, label: "Entry 2 (larger)", kind: "entry", from: 7 },
            { y: 123.26, label: "One stop", kind: "sl", from: 7 }
          ],
          reveal: 33
        }
      },
      {
        title: "Both entries fill",
        narration: "Price falls deep into the zone. Both planned entries fill. This is scaling in, not adding to a loser, because it was planned.",
        scene: {
          candles: [
            { o: 160, h: 161.06, l: 152.52, c: 153.64 },
            { o: 153.64, h: 153.99, l: 144.58, c: 146.17 },
            { o: 146.17, h: 147.07, l: 137.94, c: 139 },
            { o: 139, h: 141.04, l: 127.5, c: 129.13 },
            { o: 129.13, h: 129.74, l: 123.63, c: 124 },
            { o: 124, h: 124.63, l: 123.78, c: 124.3 },
            { o: 124.3, h: 124.52, l: 123.64, c: 123.8 },
            { o: 123.8, h: 124.62, l: 123.51, c: 124.4 },
            { o: 124.4, h: 130.56, l: 124.13, c: 130.28 },
            { o: 130.28, h: 137.59, l: 130.09, c: 137.13 },
            { o: 137.13, h: 144.96, l: 136.89, c: 144.3 },
            { o: 144.3, h: 150.54, l: 144.09, c: 150 },
            { o: 150, h: 153.89, l: 149.22, c: 153.12 },
            { o: 153.12, h: 153.75, l: 150.19, c: 150.45 },
            { o: 150.45, h: 155.91, l: 148.88, c: 155.41 },
            { o: 155.41, h: 155.8, l: 153.09, c: 153.25 },
            { o: 153.25, h: 159.23, l: 152.65, c: 157.95 },
            { o: 157.95, h: 158.74, l: 154.91, c: 155.59 },
            { o: 155.59, h: 160.69, l: 154.76, c: 159.43 },
            { o: 159.43, h: 159.52, l: 158.35, c: 158.57 },
            { o: 158.57, h: 162.64, l: 158.05, c: 162.14 },
            { o: 162.14, h: 162.41, l: 161.93, c: 162 },
            { o: 162, h: 162.18, l: 161.85, c: 162.07 },
            { o: 162.07, h: 162.83, l: 156.54, c: 157.18 },
            { o: 157.18, h: 159.65, l: 156.99, c: 159.05 },
            { o: 159.05, h: 160.18, l: 154.09, c: 154.91 },
            { o: 154.91, h: 156, l: 154.82, c: 155.88 },
            { o: 155.88, h: 157.1, l: 150.42, c: 151.67 },
            { o: 151.67, h: 153.5, l: 151.44, c: 153.3 },
            { o: 153.3, h: 154.07, l: 148.86, c: 150 },
            { o: 150, h: 151.01, l: 144.11, c: 145.16 },
            { o: 145.16, h: 145.46, l: 140.01, c: 140.86 },
            { o: 140.86, h: 141.35, l: 137.46, c: 137.67 },
            { o: 137.67, h: 137.83, l: 133.78, c: 134.15 },
            { o: 134.15, h: 134.95, l: 128.04, c: 128.86 },
            { o: 128.86, h: 129.2, l: 125.16, c: 125.8 },
            { o: 125.8, h: 126.15, l: 123.78, c: 125.2 },
            { o: 125.2, h: 130.94, l: 124.88, c: 130.38 },
            { o: 130.38, h: 134.35, l: 129.98, c: 134.1 },
            { o: 134.1, h: 140.51, l: 133.89, c: 139.9 },
            { o: 139.9, h: 142.97, l: 139.63, c: 142.69 },
            { o: 142.69, h: 149.17, l: 142.48, c: 148.48 },
            { o: 148.48, h: 154.37, l: 148.34, c: 154.22 },
            { o: 154.22, h: 158.13, l: 153.9, c: 158 }
          ],
          zones: [
            { from: 5, top: 124.4, bottom: 123.51, kind: "demand", label: "Fresh (far back)" }
          ],
          lines: [
            { y: 124.4, label: "Entry 1 (small)", kind: "entry", from: 7 },
            { y: 123.87, label: "Entry 2 (larger)", kind: "entry", from: 7 },
            { y: 123.26, label: "One stop", kind: "sl", from: 7 }
          ],
          reveal: 37
        }
      },
      {
        title: "The stretched band snaps back",
        narration: "Price rallies hard. A fresh level far out on the curve gave a big profit margin.",
        scene: {
          candles: [
            { o: 160, h: 161.06, l: 152.52, c: 153.64 },
            { o: 153.64, h: 153.99, l: 144.58, c: 146.17 },
            { o: 146.17, h: 147.07, l: 137.94, c: 139 },
            { o: 139, h: 141.04, l: 127.5, c: 129.13 },
            { o: 129.13, h: 129.74, l: 123.63, c: 124 },
            { o: 124, h: 124.63, l: 123.78, c: 124.3 },
            { o: 124.3, h: 124.52, l: 123.64, c: 123.8 },
            { o: 123.8, h: 124.62, l: 123.51, c: 124.4 },
            { o: 124.4, h: 130.56, l: 124.13, c: 130.28 },
            { o: 130.28, h: 137.59, l: 130.09, c: 137.13 },
            { o: 137.13, h: 144.96, l: 136.89, c: 144.3 },
            { o: 144.3, h: 150.54, l: 144.09, c: 150 },
            { o: 150, h: 153.89, l: 149.22, c: 153.12 },
            { o: 153.12, h: 153.75, l: 150.19, c: 150.45 },
            { o: 150.45, h: 155.91, l: 148.88, c: 155.41 },
            { o: 155.41, h: 155.8, l: 153.09, c: 153.25 },
            { o: 153.25, h: 159.23, l: 152.65, c: 157.95 },
            { o: 157.95, h: 158.74, l: 154.91, c: 155.59 },
            { o: 155.59, h: 160.69, l: 154.76, c: 159.43 },
            { o: 159.43, h: 159.52, l: 158.35, c: 158.57 },
            { o: 158.57, h: 162.64, l: 158.05, c: 162.14 },
            { o: 162.14, h: 162.41, l: 161.93, c: 162 },
            { o: 162, h: 162.18, l: 161.85, c: 162.07 },
            { o: 162.07, h: 162.83, l: 156.54, c: 157.18 },
            { o: 157.18, h: 159.65, l: 156.99, c: 159.05 },
            { o: 159.05, h: 160.18, l: 154.09, c: 154.91 },
            { o: 154.91, h: 156, l: 154.82, c: 155.88 },
            { o: 155.88, h: 157.1, l: 150.42, c: 151.67 },
            { o: 151.67, h: 153.5, l: 151.44, c: 153.3 },
            { o: 153.3, h: 154.07, l: 148.86, c: 150 },
            { o: 150, h: 151.01, l: 144.11, c: 145.16 },
            { o: 145.16, h: 145.46, l: 140.01, c: 140.86 },
            { o: 140.86, h: 141.35, l: 137.46, c: 137.67 },
            { o: 137.67, h: 137.83, l: 133.78, c: 134.15 },
            { o: 134.15, h: 134.95, l: 128.04, c: 128.86 },
            { o: 128.86, h: 129.2, l: 125.16, c: 125.8 },
            { o: 125.8, h: 126.15, l: 123.78, c: 125.2 },
            { o: 125.2, h: 130.94, l: 124.88, c: 130.38 },
            { o: 130.38, h: 134.35, l: 129.98, c: 134.1 },
            { o: 134.1, h: 140.51, l: 133.89, c: 139.9 },
            { o: 139.9, h: 142.97, l: 139.63, c: 142.69 },
            { o: 142.69, h: 149.17, l: 142.48, c: 148.48 },
            { o: 148.48, h: 154.37, l: 148.34, c: 154.22 },
            { o: 154.22, h: 158.13, l: 153.9, c: 158 }
          ],
          zones: [
            { from: 5, top: 124.4, bottom: 123.51, kind: "demand", label: "Fresh (far back)" }
          ],
          lines: [
            { y: 124.4, label: "Entry 1 (small)", kind: "entry", from: 7 },
            { y: 123.87, label: "Entry 2 (larger)", kind: "entry", from: 7 },
            { y: 123.26, label: "One stop", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Buying more of a losing position is always adding to a loser.",
        answer: false,
        explain: "It is only adding to a loser if it was not planned. Planned scaling sets entries, stop and size in advance."
      },
      {
        type: "mcq",
        q: "When scaling in, where does Sam put the larger size?",
        options: [
          "At the first entry",
          "Closer to the protective stop",
          "Above the zone",
          "Equal everywhere"
        ],
        answer: 1,
        explain: "He adds larger size the closer price gets to the stop: lower average risk."
      },
      {
        type: "mcq",
        q: "What does \"fresh\" mean for a level?",
        options: [
          "Formed today",
          "Not revisited since it formed",
          "Touched many times",
          "Near a round number"
        ],
        answer: 1,
        explain: "Fresh = unvisited. Often recent, but sometimes far back."
      },
      {
        type: "mcq",
        q: "Stocks are low at demand and the VIX is high at supply. What are the odds?",
        options: ["Stocks likely fall", "Stocks likely turn up", "No information", "Sell everything"],
        answer: 1,
        explain: "The VIX at supply while stocks are at demand is a strong odds enhancer for a rally."
      },
      {
        type: "spot",
        q: "Click the candle where both planned entries filled.",
        scene: {
          candles: [
            { o: 160, h: 161.06, l: 152.52, c: 153.64 },
            { o: 153.64, h: 153.99, l: 144.58, c: 146.17 },
            { o: 146.17, h: 147.07, l: 137.94, c: 139 },
            { o: 139, h: 141.04, l: 127.5, c: 129.13 },
            { o: 129.13, h: 129.74, l: 123.63, c: 124 },
            { o: 124, h: 124.63, l: 123.78, c: 124.3 },
            { o: 124.3, h: 124.52, l: 123.64, c: 123.8 },
            { o: 123.8, h: 124.62, l: 123.51, c: 124.4 },
            { o: 124.4, h: 130.56, l: 124.13, c: 130.28 },
            { o: 130.28, h: 137.59, l: 130.09, c: 137.13 },
            { o: 137.13, h: 144.96, l: 136.89, c: 144.3 },
            { o: 144.3, h: 150.54, l: 144.09, c: 150 },
            { o: 150, h: 153.89, l: 149.22, c: 153.12 },
            { o: 153.12, h: 153.75, l: 150.19, c: 150.45 },
            { o: 150.45, h: 155.91, l: 148.88, c: 155.41 },
            { o: 155.41, h: 155.8, l: 153.09, c: 153.25 },
            { o: 153.25, h: 159.23, l: 152.65, c: 157.95 },
            { o: 157.95, h: 158.74, l: 154.91, c: 155.59 },
            { o: 155.59, h: 160.69, l: 154.76, c: 159.43 },
            { o: 159.43, h: 159.52, l: 158.35, c: 158.57 },
            { o: 158.57, h: 162.64, l: 158.05, c: 162.14 },
            { o: 162.14, h: 162.41, l: 161.93, c: 162 },
            { o: 162, h: 162.18, l: 161.85, c: 162.07 },
            { o: 162.07, h: 162.83, l: 156.54, c: 157.18 },
            { o: 157.18, h: 159.65, l: 156.99, c: 159.05 },
            { o: 159.05, h: 160.18, l: 154.09, c: 154.91 },
            { o: 154.91, h: 156, l: 154.82, c: 155.88 },
            { o: 155.88, h: 157.1, l: 150.42, c: 151.67 },
            { o: 151.67, h: 153.5, l: 151.44, c: 153.3 },
            { o: 153.3, h: 154.07, l: 148.86, c: 150 },
            { o: 150, h: 151.01, l: 144.11, c: 145.16 },
            { o: 145.16, h: 145.46, l: 140.01, c: 140.86 },
            { o: 140.86, h: 141.35, l: 137.46, c: 137.67 },
            { o: 137.67, h: 137.83, l: 133.78, c: 134.15 },
            { o: 134.15, h: 134.95, l: 128.04, c: 128.86 },
            { o: 128.86, h: 129.2, l: 125.16, c: 125.8 },
            { o: 125.8, h: 126.15, l: 123.78, c: 125.2 },
            { o: 125.2, h: 130.94, l: 124.88, c: 130.38 },
            { o: 130.38, h: 134.35, l: 129.98, c: 134.1 },
            { o: 134.1, h: 140.51, l: 133.89, c: 139.9 },
            { o: 139.9, h: 142.97, l: 139.63, c: 142.69 },
            { o: 142.69, h: 149.17, l: 142.48, c: 148.48 },
            { o: 148.48, h: 154.37, l: 148.34, c: 154.22 },
            { o: 154.22, h: 158.13, l: 153.9, c: 158 }
          ],
          zones: [
            { from: 5, top: 124.4, bottom: 123.51, kind: "demand", label: "Fresh (far back)" }
          ]
        },
        answer: { from: 36, to: 36 },
        explain: "The deep touch into the zone filled entry 1 and entry 2."
      }
    ],
    practice: [
      {
        prompt: "This demand formed long ago and price has never come back to it. Now it is falling into it for the first time. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 172, h: 173.26, l: 165.22, c: 165.63 },
            { o: 165.63, h: 166.45, l: 156.89, c: 157.85 },
            { o: 157.85, h: 158.45, l: 150.66, c: 151.59 },
            { o: 151.59, h: 152.85, l: 144.59, c: 144.95 },
            { o: 144.95, h: 145.94, l: 135.5, c: 136 },
            { o: 136, h: 136.78, l: 135.7, c: 136.46 },
            { o: 136.46, h: 136.59, l: 135.44, c: 135.79 },
            { o: 135.79, h: 136.79, l: 135.66, c: 136.54 },
            { o: 136.54, h: 142.58, l: 136.34, c: 142.18 },
            { o: 142.18, h: 149.31, l: 141.63, c: 148.55 },
            { o: 148.55, h: 153.96, l: 148.24, c: 153.43 },
            { o: 153.43, h: 160.57, l: 153.05, c: 160 },
            { o: 160, h: 163.27, l: 159.54, c: 162.71 },
            { o: 162.71, h: 163.13, l: 160, c: 160.4 },
            { o: 160.4, h: 165.51, l: 159.05, c: 164.27 },
            { o: 164.27, h: 164.73, l: 162.2, c: 162.33 },
            { o: 162.33, h: 167.31, l: 161.03, c: 166.74 },
            { o: 166.74, h: 167.08, l: 164.25, c: 164.68 },
            { o: 164.68, h: 168.84, l: 164.33, c: 168.13 },
            { o: 168.13, h: 168.29, l: 165.57, c: 166.15 },
            { o: 166.15, h: 172.02, l: 165.06, c: 170.95 },
            { o: 170.95, h: 171.04, l: 169.92, c: 170 },
            { o: 170, h: 170.25, l: 169.66, c: 169.88 },
            { o: 169.88, h: 171.35, l: 163.26, c: 164.73 },
            { o: 164.73, h: 166.05, l: 164.61, c: 165.89 },
            { o: 165.89, h: 166.37, l: 158.23, c: 160.2 },
            { o: 160.2, h: 161.64, l: 159.82, c: 161.52 },
            { o: 161.52, h: 162.11, l: 157.32, c: 158 },
            { o: 158, h: 158.77, l: 153.95, c: 154.38 },
            { o: 154.38, h: 154.86, l: 149.05, c: 149.92 },
            { o: 149.92, h: 150.34, l: 146.03, c: 146.31 },
            { o: 146.31, h: 146.68, l: 141.62, c: 142.44 },
            { o: 142.44, h: 143.23, l: 137.58, c: 137.94 },
            { o: 137.94, h: 138.26, l: 135.99, c: 137.34 },
            { o: 137.34, h: 141.68, l: 137.04, c: 141.48 },
            { o: 141.48, h: 147.61, l: 141.13, c: 147.16 },
            { o: 147.16, h: 151.86, l: 146.73, c: 151.45 },
            { o: 151.45, h: 156.34, l: 151.32, c: 156.19 },
            { o: 156.19, h: 162.81, l: 155.68, c: 162.15 },
            { o: 162.15, h: 166.39, l: 161.97, c: 166 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.44, kind: "demand", label: "Fresh old demand" }
          ],
          reveal: 33
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Fresh, far out on the curve, big margin above. Buy it. Price rallied strongly."
      }
    ],
    cards: [
      {
        front: "When is scaling in OK?",
        back: "Only if entries, the stop and total size are planned before the first fill."
      },
      { front: "Where goes the larger size?", back: "Closer to the protective stop." },
      { front: "Fresh level?", back: "One that has not been revisited since it formed." },
      {
        front: "VIX as odds enhancer?",
        back: "VIX at supply + stocks at demand = rally odds; reverse warns of a decline."
      },
      {
        front: "What changes for position trading?",
        back: "Only the timeframe, and it needs large profit margins."
      },
      { front: "FESX point value?", back: "10 euros; no overnight session, so it gaps most days." }
    ],
    mnemonic: "Plan the ladder before you climb; fresh and far is best."
  },
  {
    mentor: "seiden",
    n: 233,
    eli5: {
      oneLiner: "When the crowd's sell checklist is perfect, price is usually at the bottom.",
      story: "The people of Foolsville score a sell signal with seven checks: downtrend, red candles, big volume, bad news, bad earnings, a reversal candle, and the S&P falling. Ten points each, and 70 means \"sell now!\" But all those things are only true after price has already fallen. One morning bad trade news made the Fools shout \"sell short\" just as the NASDAQ hit Sam's pre-planned demand. He bought from them, and price rose.",
      analogy: "It is like a weather forecast that only says \"rain\" after you are already soaked."
    },
    bigIdeas: [
      "The crowd's checklist fires after the move is done, near the low (or the high).",
      "Ask: if I sell low, who sells to me even lower? If I buy high, who buys from me higher?",
      "Pre-plan the demand level before the open and buy when price drops into it while others panic."
    ],
    steps: [
      {
        title: "Plan the level early",
        narration: "Before the open, mark the demand: a base that launched a strong rally. Nothing is happening there yet.",
        scene: {
          candles: [
            { o: 156, h: 156.64, l: 151.11, c: 151.75 },
            { o: 151.75, h: 152.74, l: 144.99, c: 145.71 },
            { o: 145.71, h: 146.42, l: 140.36, c: 141.11 },
            { o: 141.11, h: 141.67, l: 136.02, c: 136.64 },
            { o: 136.64, h: 137, l: 131.57, c: 132 },
            { o: 132, h: 132.65, l: 131.65, c: 132.4 },
            { o: 132.4, h: 132.62, l: 131.62, c: 131.74 },
            { o: 131.74, h: 132.5, l: 131.52, c: 132.37 },
            { o: 132.37, h: 137.69, l: 131.94, c: 137.36 },
            { o: 137.36, h: 141.26, l: 137.22, c: 141.13 },
            { o: 141.13, h: 145.29, l: 140.8, c: 144.98 },
            { o: 144.98, h: 150.3, l: 144.76, c: 150 },
            { o: 150, h: 150.49, l: 147.33, c: 147.53 },
            { o: 147.53, h: 147.64, l: 145.78, c: 146 },
            { o: 146, h: 147.65, l: 145.93, c: 147.54 },
            { o: 147.54, h: 149.19, l: 147.44, c: 149 },
            { o: 149, h: 149.41, l: 143.25, c: 144 },
            { o: 144, h: 144.28, l: 139.63, c: 139.95 },
            { o: 139.95, h: 140.5, l: 136.87, c: 137.18 },
            { o: 137.18, h: 137.73, l: 132.51, c: 133.2 },
            { o: 133.2, h: 133.59, l: 132.05, c: 133.1 },
            { o: 133.1, h: 135.56, l: 132.9, c: 135.18 },
            { o: 135.18, h: 138.74, l: 134.65, c: 138.23 },
            { o: 138.23, h: 141.31, l: 138.04, c: 141.14 },
            { o: 141.14, h: 143.76, l: 140.99, c: 143.65 },
            { o: 143.65, h: 147.12, l: 143.4, c: 146.51 },
            { o: 146.51, h: 149.39, l: 146.29, c: 149 }
          ],
          zones: [
            { from: 5, top: 132.4, bottom: 131.52, kind: "demand", label: "Pre-planned demand" }
          ],
          reveal: 16
        }
      },
      {
        title: "The Foolsville checklist fills up",
        narration: "Price turns down. A red reversal candle, then three red candles in a row, bad news and the S&P falling. The Fools add up 70 points.",
        scene: {
          candles: [
            { o: 156, h: 156.64, l: 151.11, c: 151.75 },
            { o: 151.75, h: 152.74, l: 144.99, c: 145.71 },
            { o: 145.71, h: 146.42, l: 140.36, c: 141.11 },
            { o: 141.11, h: 141.67, l: 136.02, c: 136.64 },
            { o: 136.64, h: 137, l: 131.57, c: 132 },
            { o: 132, h: 132.65, l: 131.65, c: 132.4 },
            { o: 132.4, h: 132.62, l: 131.62, c: 131.74 },
            { o: 131.74, h: 132.5, l: 131.52, c: 132.37 },
            { o: 132.37, h: 137.69, l: 131.94, c: 137.36 },
            { o: 137.36, h: 141.26, l: 137.22, c: 141.13 },
            { o: 141.13, h: 145.29, l: 140.8, c: 144.98 },
            { o: 144.98, h: 150.3, l: 144.76, c: 150 },
            { o: 150, h: 150.49, l: 147.33, c: 147.53 },
            { o: 147.53, h: 147.64, l: 145.78, c: 146 },
            { o: 146, h: 147.65, l: 145.93, c: 147.54 },
            { o: 147.54, h: 149.19, l: 147.44, c: 149 },
            { o: 149, h: 149.41, l: 143.25, c: 144 },
            { o: 144, h: 144.28, l: 139.63, c: 139.95 },
            { o: 139.95, h: 140.5, l: 136.87, c: 137.18 },
            { o: 137.18, h: 137.73, l: 132.51, c: 133.2 },
            { o: 133.2, h: 133.59, l: 132.05, c: 133.1 },
            { o: 133.1, h: 135.56, l: 132.9, c: 135.18 },
            { o: 135.18, h: 138.74, l: 134.65, c: 138.23 },
            { o: 138.23, h: 141.31, l: 138.04, c: 141.14 },
            { o: 141.14, h: 143.76, l: 140.99, c: 143.65 },
            { o: 143.65, h: 147.12, l: 143.4, c: 146.51 },
            { o: 146.51, h: 149.39, l: 146.29, c: 149 }
          ],
          zones: [
            { from: 5, top: 132.4, bottom: 131.52, kind: "demand", label: "Pre-planned demand" }
          ],
          highlight: { from: 16, to: 19, label: "crowd sees 70/70" },
          reveal: 20
        }
      },
      {
        title: "Same candle, two signals",
        narration: "Price reaches the demand. To the Fools this is the perfect short. To us it is pre-planned demand. Buy at the top line, stop under the bottom line.",
        scene: {
          candles: [
            { o: 156, h: 156.64, l: 151.11, c: 151.75 },
            { o: 151.75, h: 152.74, l: 144.99, c: 145.71 },
            { o: 145.71, h: 146.42, l: 140.36, c: 141.11 },
            { o: 141.11, h: 141.67, l: 136.02, c: 136.64 },
            { o: 136.64, h: 137, l: 131.57, c: 132 },
            { o: 132, h: 132.65, l: 131.65, c: 132.4 },
            { o: 132.4, h: 132.62, l: 131.62, c: 131.74 },
            { o: 131.74, h: 132.5, l: 131.52, c: 132.37 },
            { o: 132.37, h: 137.69, l: 131.94, c: 137.36 },
            { o: 137.36, h: 141.26, l: 137.22, c: 141.13 },
            { o: 141.13, h: 145.29, l: 140.8, c: 144.98 },
            { o: 144.98, h: 150.3, l: 144.76, c: 150 },
            { o: 150, h: 150.49, l: 147.33, c: 147.53 },
            { o: 147.53, h: 147.64, l: 145.78, c: 146 },
            { o: 146, h: 147.65, l: 145.93, c: 147.54 },
            { o: 147.54, h: 149.19, l: 147.44, c: 149 },
            { o: 149, h: 149.41, l: 143.25, c: 144 },
            { o: 144, h: 144.28, l: 139.63, c: 139.95 },
            { o: 139.95, h: 140.5, l: 136.87, c: 137.18 },
            { o: 137.18, h: 137.73, l: 132.51, c: 133.2 },
            { o: 133.2, h: 133.59, l: 132.05, c: 133.1 },
            { o: 133.1, h: 135.56, l: 132.9, c: 135.18 },
            { o: 135.18, h: 138.74, l: 134.65, c: 138.23 },
            { o: 138.23, h: 141.31, l: 138.04, c: 141.14 },
            { o: 141.14, h: 143.76, l: 140.99, c: 143.65 },
            { o: 143.65, h: 147.12, l: 143.4, c: 146.51 },
            { o: 146.51, h: 149.39, l: 146.29, c: 149 }
          ],
          zones: [
            { from: 5, top: 132.4, bottom: 131.52, kind: "demand", label: "Pre-planned demand" }
          ],
          lines: [
            { y: 132.4, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 131.27, label: "Stop below distal", kind: "sl", from: 7 }
          ],
          highlight: { from: 20, to: 20, label: "Fool sells, we buy" },
          reveal: 21
        }
      },
      {
        title: "Who was on the other side?",
        narration: "Demand holds and price rises. The money flowed from the Fools who sold low to the buyer at demand.",
        scene: {
          candles: [
            { o: 156, h: 156.64, l: 151.11, c: 151.75 },
            { o: 151.75, h: 152.74, l: 144.99, c: 145.71 },
            { o: 145.71, h: 146.42, l: 140.36, c: 141.11 },
            { o: 141.11, h: 141.67, l: 136.02, c: 136.64 },
            { o: 136.64, h: 137, l: 131.57, c: 132 },
            { o: 132, h: 132.65, l: 131.65, c: 132.4 },
            { o: 132.4, h: 132.62, l: 131.62, c: 131.74 },
            { o: 131.74, h: 132.5, l: 131.52, c: 132.37 },
            { o: 132.37, h: 137.69, l: 131.94, c: 137.36 },
            { o: 137.36, h: 141.26, l: 137.22, c: 141.13 },
            { o: 141.13, h: 145.29, l: 140.8, c: 144.98 },
            { o: 144.98, h: 150.3, l: 144.76, c: 150 },
            { o: 150, h: 150.49, l: 147.33, c: 147.53 },
            { o: 147.53, h: 147.64, l: 145.78, c: 146 },
            { o: 146, h: 147.65, l: 145.93, c: 147.54 },
            { o: 147.54, h: 149.19, l: 147.44, c: 149 },
            { o: 149, h: 149.41, l: 143.25, c: 144 },
            { o: 144, h: 144.28, l: 139.63, c: 139.95 },
            { o: 139.95, h: 140.5, l: 136.87, c: 137.18 },
            { o: 137.18, h: 137.73, l: 132.51, c: 133.2 },
            { o: 133.2, h: 133.59, l: 132.05, c: 133.1 },
            { o: 133.1, h: 135.56, l: 132.9, c: 135.18 },
            { o: 135.18, h: 138.74, l: 134.65, c: 138.23 },
            { o: 138.23, h: 141.31, l: 138.04, c: 141.14 },
            { o: 141.14, h: 143.76, l: 140.99, c: 143.65 },
            { o: 143.65, h: 147.12, l: 143.4, c: 146.51 },
            { o: 146.51, h: 149.39, l: 146.29, c: 149 }
          ],
          zones: [
            { from: 5, top: 132.4, bottom: 131.52, kind: "demand", label: "Pre-planned demand" }
          ],
          lines: [
            { y: 132.4, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 131.27, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A sell signal that scores 70 out of 70 on the crowd's checklist is the safest time to short.",
        answer: false,
        explain: "Every item on that list is true only after the fall. It fires at the low, right into demand."
      },
      {
        type: "spot",
        q: "Click the candles that make the crowd's checklist \"perfect\".",
        scene: {
          candles: [
            { o: 156, h: 156.64, l: 151.11, c: 151.75 },
            { o: 151.75, h: 152.74, l: 144.99, c: 145.71 },
            { o: 145.71, h: 146.42, l: 140.36, c: 141.11 },
            { o: 141.11, h: 141.67, l: 136.02, c: 136.64 },
            { o: 136.64, h: 137, l: 131.57, c: 132 },
            { o: 132, h: 132.65, l: 131.65, c: 132.4 },
            { o: 132.4, h: 132.62, l: 131.62, c: 131.74 },
            { o: 131.74, h: 132.5, l: 131.52, c: 132.37 },
            { o: 132.37, h: 137.69, l: 131.94, c: 137.36 },
            { o: 137.36, h: 141.26, l: 137.22, c: 141.13 },
            { o: 141.13, h: 145.29, l: 140.8, c: 144.98 },
            { o: 144.98, h: 150.3, l: 144.76, c: 150 },
            { o: 150, h: 150.49, l: 147.33, c: 147.53 },
            { o: 147.53, h: 147.64, l: 145.78, c: 146 },
            { o: 146, h: 147.65, l: 145.93, c: 147.54 },
            { o: 147.54, h: 149.19, l: 147.44, c: 149 },
            { o: 149, h: 149.41, l: 143.25, c: 144 },
            { o: 144, h: 144.28, l: 139.63, c: 139.95 },
            { o: 139.95, h: 140.5, l: 136.87, c: 137.18 },
            { o: 137.18, h: 137.73, l: 132.51, c: 133.2 },
            { o: 133.2, h: 133.59, l: 132.05, c: 133.1 },
            { o: 133.1, h: 135.56, l: 132.9, c: 135.18 },
            { o: 135.18, h: 138.74, l: 134.65, c: 138.23 },
            { o: 138.23, h: 141.31, l: 138.04, c: 141.14 },
            { o: 141.14, h: 143.76, l: 140.99, c: 143.65 },
            { o: 143.65, h: 147.12, l: 143.4, c: 146.51 },
            { o: 146.51, h: 149.39, l: 146.29, c: 149 }
          ],
          zones: [
            { from: 5, top: 132.4, bottom: 131.52, kind: "demand", label: "Pre-planned demand" }
          ]
        },
        answer: { from: 16, to: 19 },
        explain: "The reversal candle and the string of red candles. They arrive just before price reaches demand."
      },
      {
        type: "mcq",
        q: "What is the Foolsville belief, in Sam's words?",
        options: [
          "Buy low, sell high",
          "Make decisions based upon the actions of others, after they make it",
          "Plan before the open",
          "Trust only price"
        ],
        answer: 1,
        explain: "They act after others have acted, so they are always late."
      },
      {
        type: "mcq",
        q: "Before buying high, which question should you ask?",
        options: [
          "Is the news good?",
          "Who will buy from me at an even higher price?",
          "Is volume high?",
          "Is the MA rising?"
        ],
        answer: 1,
        explain: "To profit, others must buy after you at higher prices."
      }
    ],
    practice: [
      {
        prompt: "Bad news, a downtrend, red candles and the S&P falling: the crowd is yelling \"sell short\". Price is dropping into the demand you planned last night. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 172, h: 172.84, l: 166.4, c: 167.39 },
            { o: 167.39, h: 167.7, l: 159.22, c: 160.63 },
            { o: 160.63, h: 161.17, l: 155.58, c: 156.29 },
            { o: 156.29, h: 156.9, l: 149.53, c: 150.67 },
            { o: 150.67, h: 151, l: 145.47, c: 146 },
            { o: 146, h: 146.44, l: 145.82, c: 146.21 },
            { o: 146.21, h: 146.33, l: 145.42, c: 145.73 },
            { o: 145.73, h: 146.67, l: 145.43, c: 146.51 },
            { o: 146.51, h: 152.07, l: 146.13, c: 151.62 },
            { o: 151.62, h: 159.03, l: 150.96, c: 158.44 },
            { o: 158.44, h: 164.28, l: 157.91, c: 164 },
            { o: 164, h: 164.24, l: 161.15, c: 161.45 },
            { o: 161.45, h: 161.69, l: 159.75, c: 160 },
            { o: 160, h: 162.24, l: 159.79, c: 161.89 },
            { o: 161.89, h: 163.21, l: 161.72, c: 163 },
            { o: 163, h: 163.66, l: 158.21, c: 158.59 },
            { o: 158.59, h: 159.35, l: 154.55, c: 155.14 },
            { o: 155.14, h: 155.82, l: 150.66, c: 151.39 },
            { o: 151.39, h: 151.7, l: 147.69, c: 147.91 },
            { o: 147.91, h: 148.35, l: 146.07, c: 147.31 },
            { o: 147.31, h: 149.53, l: 147.06, c: 149.47 },
            { o: 149.47, h: 152.7, l: 149.4, c: 152.5 },
            { o: 152.5, h: 153.96, l: 152.37, c: 153.92 },
            { o: 153.92, h: 156.63, l: 153.83, c: 156.46 },
            { o: 156.46, h: 159.5, l: 156.38, c: 159.28 },
            { o: 159.28, h: 162.2, l: 159.06, c: 162 }
          ],
          zones: [
            { from: 5, top: 146.51, bottom: 145.42, kind: "demand", label: "Pre-planned demand" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Trade with a Fool, not like one. Buy the pre-planned demand. Price rallied."
      }
    ],
    cards: [
      {
        front: "Foolsville sell checklist?",
        back: "Downtrend, 3+ red candles, high volume, bad news, bad earnings, reversal candle, S&P falling: 10 points each."
      },
      { front: "Where does 70/70 usually fire?", back: "Near the low, at demand." },
      { front: "Foolsville belief?", back: "Decide based on the actions of others, after they act." },
      { front: "Key question before selling low?", back: "Who will sell to me even lower?" }
    ],
    mnemonic: "Trade WITH a Fool, never LIKE a Fool."
  },
  {
    mentor: "seiden",
    n: 241,
    eli5: {
      oneLiner: "Follow the plan, take profit at the next level, and grow your size slowly.",
      story: "Barbara bought two stocks right after the open because price opened straight into demand. She sold when the sector fund got close to its 60-minute level, even though price later ran further. Sam said that was right: nobody catches the whole move. Another student froze at a good signal because he wanted to be sure; Sam said certainty does not exist. And one more wanted to jump from 10 shares to 1,000; Sam said go to 100 first.",
      analogy: "Growing your trade size is like learning to swim: go from the shallow end to the middle, not from the shallow end to the ocean."
    },
    bigIdeas: [
      "Trade the open only when price opens INTO a demand or supply level.",
      "Exit when the index or sector reaches its own level. 40% winners at 3:1 is already a great plan.",
      "The biggest turns often come on LOW volume. Grow size 10 to 100, not 10 to 1,000."
    ],
    steps: [
      {
        title: "Levels marked overnight",
        narration: "Demand below, and a 60-minute supply above that will be our exit area. All drawn while the market is closed.",
        scene: {
          candles: [
            { o: 166, h: 166.54, l: 160.93, c: 161.37 },
            { o: 161.37, h: 161.63, l: 155.03, c: 155.67 },
            { o: 155.67, h: 156.64, l: 150.16, c: 151.05 },
            { o: 151.05, h: 151.94, l: 144.01, c: 144.57 },
            { o: 144.57, h: 145.36, l: 139.36, c: 140 },
            { o: 140, h: 140.57, l: 139.87, c: 140.25 },
            { o: 140.25, h: 140.46, l: 139.33, c: 139.63 },
            { o: 139.63, h: 140.5, l: 139.31, c: 140.3 },
            { o: 140.3, h: 146.19, l: 139.92, c: 145.66 },
            { o: 145.66, h: 151.73, l: 145.34, c: 151.34 },
            { o: 151.34, h: 157.35, l: 151.03, c: 157 },
            { o: 157, h: 157.6, l: 156.83, c: 157.38 },
            { o: 157.38, h: 157.55, l: 156.43, c: 156.6 },
            { o: 156.6, h: 156.92, l: 154.01, c: 154.3 },
            { o: 154.3, h: 154.74, l: 151.55, c: 151.93 },
            { o: 151.93, h: 152.13, l: 150.16, c: 150.47 },
            { o: 150.47, h: 150.95, l: 147.46, c: 148 },
            { o: 148, h: 148.34, l: 147.76, c: 148.19 },
            { o: 148.19, h: 148.4, l: 147.5, c: 147.68 },
            { o: 147.68, h: 148.42, l: 147.57, c: 148.24 },
            { o: 140.4, h: 142.13, l: 139.81, c: 141.7 },
            { o: 141.7, h: 145.04, l: 141.22, c: 144.6 },
            { o: 144.6, h: 148.01, l: 144.32, c: 147.84 },
            { o: 147.84, h: 151.3, l: 147.35, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.78, c: 152.85 },
            { o: 152.85, h: 156.43, l: 152.37, c: 156.2 },
            { o: 156.2, h: 157.39, l: 156.08, c: 157.22 },
            { o: 157.22, h: 158.04, l: 157.08, c: 157.99 },
            { o: 157.99, h: 159.15, l: 157.83, c: 159 }
          ],
          zones: [
            { from: 5, top: 140.3, bottom: 139.31, kind: "demand", label: "Demand" },
            { from: 11, top: 157.6, bottom: 156.6, kind: "supply", label: "60-min supply (exit)" }
          ],
          reveal: 20
        }
      },
      {
        title: "Opening INTO demand",
        narration: "The new session gaps down straight into demand. This is when demand and supply are most out of balance, so trading the open is smart here. A set-and-forget buy order fills.",
        scene: {
          candles: [
            { o: 166, h: 166.54, l: 160.93, c: 161.37 },
            { o: 161.37, h: 161.63, l: 155.03, c: 155.67 },
            { o: 155.67, h: 156.64, l: 150.16, c: 151.05 },
            { o: 151.05, h: 151.94, l: 144.01, c: 144.57 },
            { o: 144.57, h: 145.36, l: 139.36, c: 140 },
            { o: 140, h: 140.57, l: 139.87, c: 140.25 },
            { o: 140.25, h: 140.46, l: 139.33, c: 139.63 },
            { o: 139.63, h: 140.5, l: 139.31, c: 140.3 },
            { o: 140.3, h: 146.19, l: 139.92, c: 145.66 },
            { o: 145.66, h: 151.73, l: 145.34, c: 151.34 },
            { o: 151.34, h: 157.35, l: 151.03, c: 157 },
            { o: 157, h: 157.6, l: 156.83, c: 157.38 },
            { o: 157.38, h: 157.55, l: 156.43, c: 156.6 },
            { o: 156.6, h: 156.92, l: 154.01, c: 154.3 },
            { o: 154.3, h: 154.74, l: 151.55, c: 151.93 },
            { o: 151.93, h: 152.13, l: 150.16, c: 150.47 },
            { o: 150.47, h: 150.95, l: 147.46, c: 148 },
            { o: 148, h: 148.34, l: 147.76, c: 148.19 },
            { o: 148.19, h: 148.4, l: 147.5, c: 147.68 },
            { o: 147.68, h: 148.42, l: 147.57, c: 148.24 },
            { o: 140.4, h: 142.13, l: 139.81, c: 141.7 },
            { o: 141.7, h: 145.04, l: 141.22, c: 144.6 },
            { o: 144.6, h: 148.01, l: 144.32, c: 147.84 },
            { o: 147.84, h: 151.3, l: 147.35, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.78, c: 152.85 },
            { o: 152.85, h: 156.43, l: 152.37, c: 156.2 },
            { o: 156.2, h: 157.39, l: 156.08, c: 157.22 },
            { o: 157.22, h: 158.04, l: 157.08, c: 157.99 },
            { o: 157.99, h: 159.15, l: 157.83, c: 159 }
          ],
          zones: [
            { from: 5, top: 140.3, bottom: 139.31, kind: "demand", label: "Demand" },
            { from: 11, top: 157.6, bottom: 156.6, kind: "supply", label: "60-min supply (exit)" }
          ],
          lines: [
            { y: 140.3, label: "Buy at the open", kind: "entry", from: 7 },
            { y: 139.06, label: "Stop", kind: "sl", from: 7 }
          ],
          highlight: { from: 20, to: 20, label: "open into demand" },
          reveal: 21
        }
      },
      {
        title: "Exit at the bigger level",
        narration: "As price nears the 60-minute level, take profit. It is the right call even if price runs further later.",
        scene: {
          candles: [
            { o: 166, h: 166.54, l: 160.93, c: 161.37 },
            { o: 161.37, h: 161.63, l: 155.03, c: 155.67 },
            { o: 155.67, h: 156.64, l: 150.16, c: 151.05 },
            { o: 151.05, h: 151.94, l: 144.01, c: 144.57 },
            { o: 144.57, h: 145.36, l: 139.36, c: 140 },
            { o: 140, h: 140.57, l: 139.87, c: 140.25 },
            { o: 140.25, h: 140.46, l: 139.33, c: 139.63 },
            { o: 139.63, h: 140.5, l: 139.31, c: 140.3 },
            { o: 140.3, h: 146.19, l: 139.92, c: 145.66 },
            { o: 145.66, h: 151.73, l: 145.34, c: 151.34 },
            { o: 151.34, h: 157.35, l: 151.03, c: 157 },
            { o: 157, h: 157.6, l: 156.83, c: 157.38 },
            { o: 157.38, h: 157.55, l: 156.43, c: 156.6 },
            { o: 156.6, h: 156.92, l: 154.01, c: 154.3 },
            { o: 154.3, h: 154.74, l: 151.55, c: 151.93 },
            { o: 151.93, h: 152.13, l: 150.16, c: 150.47 },
            { o: 150.47, h: 150.95, l: 147.46, c: 148 },
            { o: 148, h: 148.34, l: 147.76, c: 148.19 },
            { o: 148.19, h: 148.4, l: 147.5, c: 147.68 },
            { o: 147.68, h: 148.42, l: 147.57, c: 148.24 },
            { o: 140.4, h: 142.13, l: 139.81, c: 141.7 },
            { o: 141.7, h: 145.04, l: 141.22, c: 144.6 },
            { o: 144.6, h: 148.01, l: 144.32, c: 147.84 },
            { o: 147.84, h: 151.3, l: 147.35, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.78, c: 152.85 },
            { o: 152.85, h: 156.43, l: 152.37, c: 156.2 },
            { o: 156.2, h: 157.39, l: 156.08, c: 157.22 },
            { o: 157.22, h: 158.04, l: 157.08, c: 157.99 },
            { o: 157.99, h: 159.15, l: 157.83, c: 159 }
          ],
          zones: [
            { from: 5, top: 140.3, bottom: 139.31, kind: "demand", label: "Demand" },
            { from: 11, top: 157.6, bottom: 156.6, kind: "supply", label: "60-min supply (exit)" }
          ],
          lines: [
            { y: 140.3, label: "Buy at the open", kind: "entry", from: 7 },
            { y: 139.06, label: "Stop", kind: "sl", from: 7 },
            { y: 156.1, label: "Exit: index near its 60-min level", kind: "tp", from: 12 }
          ],
          highlight: { from: 21, to: 25, label: "trade" },
          reveal: 26
        }
      },
      {
        title: "Nobody gets the whole move",
        narration: "Price did go a bit higher after the exit. That is fine. Chasing every last tick invites more losses.",
        scene: {
          candles: [
            { o: 166, h: 166.54, l: 160.93, c: 161.37 },
            { o: 161.37, h: 161.63, l: 155.03, c: 155.67 },
            { o: 155.67, h: 156.64, l: 150.16, c: 151.05 },
            { o: 151.05, h: 151.94, l: 144.01, c: 144.57 },
            { o: 144.57, h: 145.36, l: 139.36, c: 140 },
            { o: 140, h: 140.57, l: 139.87, c: 140.25 },
            { o: 140.25, h: 140.46, l: 139.33, c: 139.63 },
            { o: 139.63, h: 140.5, l: 139.31, c: 140.3 },
            { o: 140.3, h: 146.19, l: 139.92, c: 145.66 },
            { o: 145.66, h: 151.73, l: 145.34, c: 151.34 },
            { o: 151.34, h: 157.35, l: 151.03, c: 157 },
            { o: 157, h: 157.6, l: 156.83, c: 157.38 },
            { o: 157.38, h: 157.55, l: 156.43, c: 156.6 },
            { o: 156.6, h: 156.92, l: 154.01, c: 154.3 },
            { o: 154.3, h: 154.74, l: 151.55, c: 151.93 },
            { o: 151.93, h: 152.13, l: 150.16, c: 150.47 },
            { o: 150.47, h: 150.95, l: 147.46, c: 148 },
            { o: 148, h: 148.34, l: 147.76, c: 148.19 },
            { o: 148.19, h: 148.4, l: 147.5, c: 147.68 },
            { o: 147.68, h: 148.42, l: 147.57, c: 148.24 },
            { o: 140.4, h: 142.13, l: 139.81, c: 141.7 },
            { o: 141.7, h: 145.04, l: 141.22, c: 144.6 },
            { o: 144.6, h: 148.01, l: 144.32, c: 147.84 },
            { o: 147.84, h: 151.3, l: 147.35, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.78, c: 152.85 },
            { o: 152.85, h: 156.43, l: 152.37, c: 156.2 },
            { o: 156.2, h: 157.39, l: 156.08, c: 157.22 },
            { o: 157.22, h: 158.04, l: 157.08, c: 157.99 },
            { o: 157.99, h: 159.15, l: 157.83, c: 159 }
          ],
          zones: [
            { from: 5, top: 140.3, bottom: 139.31, kind: "demand", label: "Demand" },
            { from: 11, top: 157.6, bottom: 156.6, kind: "supply", label: "60-min supply (exit)" }
          ],
          lines: [
            { y: 140.3, label: "Buy at the open", kind: "entry", from: 7 },
            { y: 139.06, label: "Stop", kind: "sl", from: 7 },
            { y: 156.1, label: "Exit: index near its 60-min level", kind: "tp", from: 12 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "When is buying right at the open smart?",
        options: [
          "Every morning",
          "Only when price opens into a demand level",
          "Only on Mondays",
          "When the news is good"
        ],
        answer: 1,
        explain: "An open into a level is when demand and supply are most out of balance."
      },
      {
        type: "tf",
        q: "The most significant turns usually come with very high volume.",
        answer: false,
        explain: "Sam says the opposite: the bigger the imbalance, the less time at the level, the fewer trades, the lower the volume."
      },
      {
        type: "mcq",
        q: "You trade 10 shares well. What is the next size Sam suggests?",
        options: ["1,000 shares", "100 shares", "10,000 shares", "Stay at 10 forever"],
        answer: 1,
        explain: "Go from 10 to 100 and stay rule-based. Scaling too fast causes complete failure."
      },
      {
        type: "mcq",
        q: "A plan wins 40% of the time at 3:1. What does Sam think?",
        options: ["Terrible", "Already a fantastic income", "Needs more indicators", "Only good for futures"],
        answer: 1,
        explain: "With 3:1 rewards, 40% winners is very profitable."
      },
      {
        type: "spot",
        q: "Click the opening candle that made this trade valid.",
        scene: {
          candles: [
            { o: 166, h: 166.54, l: 160.93, c: 161.37 },
            { o: 161.37, h: 161.63, l: 155.03, c: 155.67 },
            { o: 155.67, h: 156.64, l: 150.16, c: 151.05 },
            { o: 151.05, h: 151.94, l: 144.01, c: 144.57 },
            { o: 144.57, h: 145.36, l: 139.36, c: 140 },
            { o: 140, h: 140.57, l: 139.87, c: 140.25 },
            { o: 140.25, h: 140.46, l: 139.33, c: 139.63 },
            { o: 139.63, h: 140.5, l: 139.31, c: 140.3 },
            { o: 140.3, h: 146.19, l: 139.92, c: 145.66 },
            { o: 145.66, h: 151.73, l: 145.34, c: 151.34 },
            { o: 151.34, h: 157.35, l: 151.03, c: 157 },
            { o: 157, h: 157.6, l: 156.83, c: 157.38 },
            { o: 157.38, h: 157.55, l: 156.43, c: 156.6 },
            { o: 156.6, h: 156.92, l: 154.01, c: 154.3 },
            { o: 154.3, h: 154.74, l: 151.55, c: 151.93 },
            { o: 151.93, h: 152.13, l: 150.16, c: 150.47 },
            { o: 150.47, h: 150.95, l: 147.46, c: 148 },
            { o: 148, h: 148.34, l: 147.76, c: 148.19 },
            { o: 148.19, h: 148.4, l: 147.5, c: 147.68 },
            { o: 147.68, h: 148.42, l: 147.57, c: 148.24 },
            { o: 140.4, h: 142.13, l: 139.81, c: 141.7 },
            { o: 141.7, h: 145.04, l: 141.22, c: 144.6 },
            { o: 144.6, h: 148.01, l: 144.32, c: 147.84 },
            { o: 147.84, h: 151.3, l: 147.35, c: 151.07 },
            { o: 151.07, h: 153.06, l: 150.78, c: 152.85 },
            { o: 152.85, h: 156.43, l: 152.37, c: 156.2 },
            { o: 156.2, h: 157.39, l: 156.08, c: 157.22 },
            { o: 157.22, h: 158.04, l: 157.08, c: 157.99 },
            { o: 157.99, h: 159.15, l: 157.83, c: 159 }
          ],
          zones: [
            { from: 5, top: 140.3, bottom: 139.31, kind: "demand", label: "Demand" },
            { from: 11, top: 157.6, bottom: 156.6, kind: "supply", label: "60-min supply (exit)" }
          ]
        },
        answer: { from: 20, to: 20 },
        explain: "The gap open straight into demand."
      },
      {
        type: "tf",
        q: "In spot forex, slippage on market orders at real demand can happen because the broker is on the other side.",
        answer: true,
        explain: "The broker knows it is selling at a bad price and fills where it cannot lose; thin pairs make it worse."
      }
    ],
    practice: [
      {
        prompt: "The market is opening with a gap straight into a demand level you marked last night. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 165.04, c: 165.72 },
            { o: 165.72, h: 166.29, l: 159.16, c: 160.25 },
            { o: 160.25, h: 160.91, l: 155.88, c: 156.59 },
            { o: 156.59, h: 157.4, l: 148.88, c: 149.88 },
            { o: 149.88, h: 150.52, l: 145.4, c: 146 },
            { o: 146, h: 146.72, l: 145.8, c: 146.41 },
            { o: 146.41, h: 146.77, l: 145.38, c: 145.62 },
            { o: 145.62, h: 146.66, l: 145.46, c: 146.44 },
            { o: 146.44, h: 151.79, l: 146.13, c: 151.66 },
            { o: 151.66, h: 157.68, l: 151.04, c: 157.03 },
            { o: 157.03, h: 162.42, l: 156.67, c: 162 },
            { o: 162, h: 162.21, l: 160.32, c: 160.52 },
            { o: 160.52, h: 160.72, l: 157.7, c: 157.84 },
            { o: 157.84, h: 158, l: 156.01, c: 156.29 },
            { o: 156.29, h: 156.49, l: 153.67, c: 154 },
            { o: 154, h: 154.56, l: 153.76, c: 154.39 },
            { o: 154.39, h: 154.62, l: 153.36, c: 153.56 },
            { o: 153.56, h: 154.66, l: 153.44, c: 154.37 },
            { o: 146.54, h: 148.18, l: 145.91, c: 147.84 },
            { o: 147.84, h: 150.68, l: 147.37, c: 150.19 },
            { o: 150.19, h: 151.96, l: 149.9, c: 151.89 },
            { o: 151.89, h: 154.42, l: 151.44, c: 154 },
            { o: 154, h: 157.16, l: 153.58, c: 157 },
            { o: 157, h: 159.18, l: 156.89, c: 158.93 },
            { o: 158.93, h: 161.33, l: 158.48, c: 161 }
          ],
          zones: [
            { from: 5, top: 146.44, bottom: 145.38, kind: "demand", label: "Demand" }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "An open into demand is the best time to trade the open. Buy, stop under the zone. Price rallied."
      }
    ],
    cards: [
      { front: "When to trade the open?", back: "Only when price opens into a demand or supply level." },
      { front: "When did Barbara exit?", back: "When the sector ETF was 10 cents from its 60-minute zone." },
      { front: "Volume at the biggest turns?", back: "Usually LOW." },
      { front: "How to grow size?", back: "10 to 100, not 10 to 1,000." },
      {
        front: "Cure for freezing at a valid signal?",
        back: "Accept there is no certainty; stack odds and use set-and-forget orders."
      }
    ],
    mnemonic: "Open into a level, out at the next level, grow by one zero."
  },
  {
    mentor: "seiden",
    n: 246,
    eli5: {
      oneLiner: "A breakout into big supply is a trap. Sell to the people who fall in.",
      story: "Floor traders call it getting hung: buying right before a collapse. A bull trap needs two things at once. First, an exciting event, like news or a breakout above yesterday's high, pulls buyers in. Second, price is sitting at real supply with lots of room below. When the last buyer has bought, there is nobody left, so price falls and the trapped buyers sell at a loss.",
      analogy: "It is like a shop that puts a flashy \"SALE\" sign on things that cost more than anywhere else. The sign pulls people in; the price is the trap."
    },
    bigIdeas: [
      "Bull trap = an exciting event inviting buyers + price at supply + a big profit margin below. Bear trap is the mirror.",
      "Check the larger timeframe first: a weekly gap origin gives the small-chart zone its power.",
      "Short at the zone, stop above it, first target the demand below."
    ],
    steps: [
      {
        title: "The higher-timeframe gap supply",
        narration: "On the big chart price based and gapped down. The origin of that gap is strong supply. Price has now rallied back toward it.",
        scene: {
          candles: [
            { o: 124, h: 130.82, l: 123.57, c: 130.19 },
            { o: 130.19, h: 140.18, l: 128.5, c: 138.78 },
            { o: 138.78, h: 145.13, l: 137.54, c: 144.75 },
            { o: 144.75, h: 150.77, l: 144.42, c: 150.44 },
            { o: 150.44, h: 158.44, l: 149.79, c: 158 },
            { o: 158, h: 158.49, l: 157.79, c: 158.29 },
            { o: 158.29, h: 158.46, l: 157.42, c: 157.65 },
            { o: 153.65, h: 154.27, l: 147.8, c: 148.2 },
            { o: 148.2, h: 148.85, l: 141.98, c: 142.6 },
            { o: 142.6, h: 143.03, l: 135.76, c: 136 },
            { o: 136, h: 136.59, l: 135.83, c: 136.34 },
            { o: 136.34, h: 136.52, l: 135.5, c: 135.71 },
            { o: 135.71, h: 136.72, l: 135.37, c: 136.47 },
            { o: 136.47, h: 140.96, l: 135.64, c: 140.42 },
            { o: 140.42, h: 142.93, l: 140.23, c: 142.57 },
            { o: 142.57, h: 147.8, l: 141.59, c: 147.15 },
            { o: 147.15, h: 150.54, l: 146.82, c: 150 },
            { o: 150, h: 150.21, l: 148.66, c: 148.84 },
            { o: 148.84, h: 148.98, l: 146.9, c: 147 },
            { o: 147, h: 151.18, l: 146.51, c: 150.85 },
            { o: 150.85, h: 157.41, l: 150.36, c: 156.45 },
            { o: 156.45, h: 158.07, l: 156.03, c: 156.75 },
            { o: 156.75, h: 156.93, l: 153.93, c: 154.18 },
            { o: 154.18, h: 154.77, l: 150.66, c: 150.93 },
            { o: 150.93, h: 151.81, l: 145.93, c: 146.5 },
            { o: 146.5, h: 146.76, l: 143.72, c: 144.18 },
            { o: 144.18, h: 144.5, l: 139.58, c: 140.01 },
            { o: 140.01, h: 140.17, l: 136.93, c: 137.07 },
            { o: 137.07, h: 138.13, l: 136.98, c: 137.97 }
          ],
          zones: [
            { from: 5, top: 158.49, bottom: 157.65, kind: "supply", label: "Higher-timeframe gap supply" }
          ],
          reveal: 18
        }
      },
      {
        title: "The event: a breakout above yesterday's high",
        narration: "Price pushes above the prior day's high. The crowd sees a breakout and gets bullish. But the breakout runs INTO supply, not away from it.",
        scene: {
          candles: [
            { o: 124, h: 130.82, l: 123.57, c: 130.19 },
            { o: 130.19, h: 140.18, l: 128.5, c: 138.78 },
            { o: 138.78, h: 145.13, l: 137.54, c: 144.75 },
            { o: 144.75, h: 150.77, l: 144.42, c: 150.44 },
            { o: 150.44, h: 158.44, l: 149.79, c: 158 },
            { o: 158, h: 158.49, l: 157.79, c: 158.29 },
            { o: 158.29, h: 158.46, l: 157.42, c: 157.65 },
            { o: 153.65, h: 154.27, l: 147.8, c: 148.2 },
            { o: 148.2, h: 148.85, l: 141.98, c: 142.6 },
            { o: 142.6, h: 143.03, l: 135.76, c: 136 },
            { o: 136, h: 136.59, l: 135.83, c: 136.34 },
            { o: 136.34, h: 136.52, l: 135.5, c: 135.71 },
            { o: 135.71, h: 136.72, l: 135.37, c: 136.47 },
            { o: 136.47, h: 140.96, l: 135.64, c: 140.42 },
            { o: 140.42, h: 142.93, l: 140.23, c: 142.57 },
            { o: 142.57, h: 147.8, l: 141.59, c: 147.15 },
            { o: 147.15, h: 150.54, l: 146.82, c: 150 },
            { o: 150, h: 150.21, l: 148.66, c: 148.84 },
            { o: 148.84, h: 148.98, l: 146.9, c: 147 },
            { o: 147, h: 151.18, l: 146.51, c: 150.85 },
            { o: 150.85, h: 157.41, l: 150.36, c: 156.45 },
            { o: 156.45, h: 158.07, l: 156.03, c: 156.75 },
            { o: 156.75, h: 156.93, l: 153.93, c: 154.18 },
            { o: 154.18, h: 154.77, l: 150.66, c: 150.93 },
            { o: 150.93, h: 151.81, l: 145.93, c: 146.5 },
            { o: 146.5, h: 146.76, l: 143.72, c: 144.18 },
            { o: 144.18, h: 144.5, l: 139.58, c: 140.01 },
            { o: 140.01, h: 140.17, l: 136.93, c: 137.07 },
            { o: 137.07, h: 138.13, l: 136.98, c: 137.97 }
          ],
          zones: [
            { from: 5, top: 158.49, bottom: 157.65, kind: "supply", label: "Higher-timeframe gap supply" },
            { from: 10, top: 136.47, bottom: 135.37, kind: "demand", label: "Demand (target)" }
          ],
          lines: [
            { y: 150.54, label: "Prior day high", kind: "level", from: 15 }
          ],
          reveal: 21
        }
      },
      {
        title: "Spring the trap",
        narration: "At the zone we sell to the breakout buyers. Stop just above the top line. The demand below is the first target, far enough for a big margin.",
        scene: {
          candles: [
            { o: 124, h: 130.82, l: 123.57, c: 130.19 },
            { o: 130.19, h: 140.18, l: 128.5, c: 138.78 },
            { o: 138.78, h: 145.13, l: 137.54, c: 144.75 },
            { o: 144.75, h: 150.77, l: 144.42, c: 150.44 },
            { o: 150.44, h: 158.44, l: 149.79, c: 158 },
            { o: 158, h: 158.49, l: 157.79, c: 158.29 },
            { o: 158.29, h: 158.46, l: 157.42, c: 157.65 },
            { o: 153.65, h: 154.27, l: 147.8, c: 148.2 },
            { o: 148.2, h: 148.85, l: 141.98, c: 142.6 },
            { o: 142.6, h: 143.03, l: 135.76, c: 136 },
            { o: 136, h: 136.59, l: 135.83, c: 136.34 },
            { o: 136.34, h: 136.52, l: 135.5, c: 135.71 },
            { o: 135.71, h: 136.72, l: 135.37, c: 136.47 },
            { o: 136.47, h: 140.96, l: 135.64, c: 140.42 },
            { o: 140.42, h: 142.93, l: 140.23, c: 142.57 },
            { o: 142.57, h: 147.8, l: 141.59, c: 147.15 },
            { o: 147.15, h: 150.54, l: 146.82, c: 150 },
            { o: 150, h: 150.21, l: 148.66, c: 148.84 },
            { o: 148.84, h: 148.98, l: 146.9, c: 147 },
            { o: 147, h: 151.18, l: 146.51, c: 150.85 },
            { o: 150.85, h: 157.41, l: 150.36, c: 156.45 },
            { o: 156.45, h: 158.07, l: 156.03, c: 156.75 },
            { o: 156.75, h: 156.93, l: 153.93, c: 154.18 },
            { o: 154.18, h: 154.77, l: 150.66, c: 150.93 },
            { o: 150.93, h: 151.81, l: 145.93, c: 146.5 },
            { o: 146.5, h: 146.76, l: 143.72, c: 144.18 },
            { o: 144.18, h: 144.5, l: 139.58, c: 140.01 },
            { o: 140.01, h: 140.17, l: 136.93, c: 137.07 },
            { o: 137.07, h: 138.13, l: 136.98, c: 137.97 }
          ],
          zones: [
            { from: 5, top: 158.49, bottom: 157.65, kind: "supply", label: "Higher-timeframe gap supply" },
            { from: 10, top: 136.47, bottom: 135.37, kind: "demand", label: "Demand (target)" }
          ],
          lines: [
            { y: 150.54, label: "Prior day high", kind: "level", from: 15 },
            { y: 157.65, label: "Entry (proximal)", kind: "entry", from: 6 },
            { y: 158.74, label: "Stop above distal", kind: "sl", from: 6 },
            { y: 136.47, label: "Target: opposing level", kind: "tp", from: 6 }
          ],
          highlight: { from: 21, to: 21, label: "trap" },
          reveal: 22
        }
      },
      {
        title: "The last buyer has bought",
        narration: "With no buyers left, price falls. Trapped buyers sell at a loss and push it lower, down to the demand target.",
        scene: {
          candles: [
            { o: 124, h: 130.82, l: 123.57, c: 130.19 },
            { o: 130.19, h: 140.18, l: 128.5, c: 138.78 },
            { o: 138.78, h: 145.13, l: 137.54, c: 144.75 },
            { o: 144.75, h: 150.77, l: 144.42, c: 150.44 },
            { o: 150.44, h: 158.44, l: 149.79, c: 158 },
            { o: 158, h: 158.49, l: 157.79, c: 158.29 },
            { o: 158.29, h: 158.46, l: 157.42, c: 157.65 },
            { o: 153.65, h: 154.27, l: 147.8, c: 148.2 },
            { o: 148.2, h: 148.85, l: 141.98, c: 142.6 },
            { o: 142.6, h: 143.03, l: 135.76, c: 136 },
            { o: 136, h: 136.59, l: 135.83, c: 136.34 },
            { o: 136.34, h: 136.52, l: 135.5, c: 135.71 },
            { o: 135.71, h: 136.72, l: 135.37, c: 136.47 },
            { o: 136.47, h: 140.96, l: 135.64, c: 140.42 },
            { o: 140.42, h: 142.93, l: 140.23, c: 142.57 },
            { o: 142.57, h: 147.8, l: 141.59, c: 147.15 },
            { o: 147.15, h: 150.54, l: 146.82, c: 150 },
            { o: 150, h: 150.21, l: 148.66, c: 148.84 },
            { o: 148.84, h: 148.98, l: 146.9, c: 147 },
            { o: 147, h: 151.18, l: 146.51, c: 150.85 },
            { o: 150.85, h: 157.41, l: 150.36, c: 156.45 },
            { o: 156.45, h: 158.07, l: 156.03, c: 156.75 },
            { o: 156.75, h: 156.93, l: 153.93, c: 154.18 },
            { o: 154.18, h: 154.77, l: 150.66, c: 150.93 },
            { o: 150.93, h: 151.81, l: 145.93, c: 146.5 },
            { o: 146.5, h: 146.76, l: 143.72, c: 144.18 },
            { o: 144.18, h: 144.5, l: 139.58, c: 140.01 },
            { o: 140.01, h: 140.17, l: 136.93, c: 137.07 },
            { o: 137.07, h: 138.13, l: 136.98, c: 137.97 }
          ],
          zones: [
            { from: 5, top: 158.49, bottom: 157.65, kind: "supply", label: "Higher-timeframe gap supply" },
            { from: 10, top: 136.47, bottom: 135.37, kind: "demand", label: "Demand (target)" }
          ],
          lines: [
            { y: 150.54, label: "Prior day high", kind: "level", from: 15 },
            { y: 157.65, label: "Entry (proximal)", kind: "entry", from: 6 },
            { y: 158.74, label: "Stop above distal", kind: "sl", from: 6 },
            { y: 136.47, label: "Target: opposing level", kind: "tp", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which two things must happen together for a bull trap?",
        options: [
          "High volume and an MA cross",
          "An event inviting buyers, and price at supply with room below",
          "Good earnings and a rising RSI",
          "A gap up and a doji"
        ],
        answer: 1,
        explain: "An exciting event plus objective supply with a big profit margin below."
      },
      {
        type: "spot",
        q: "Click the trap candle.",
        scene: {
          candles: [
            { o: 124, h: 130.82, l: 123.57, c: 130.19 },
            { o: 130.19, h: 140.18, l: 128.5, c: 138.78 },
            { o: 138.78, h: 145.13, l: 137.54, c: 144.75 },
            { o: 144.75, h: 150.77, l: 144.42, c: 150.44 },
            { o: 150.44, h: 158.44, l: 149.79, c: 158 },
            { o: 158, h: 158.49, l: 157.79, c: 158.29 },
            { o: 158.29, h: 158.46, l: 157.42, c: 157.65 },
            { o: 153.65, h: 154.27, l: 147.8, c: 148.2 },
            { o: 148.2, h: 148.85, l: 141.98, c: 142.6 },
            { o: 142.6, h: 143.03, l: 135.76, c: 136 },
            { o: 136, h: 136.59, l: 135.83, c: 136.34 },
            { o: 136.34, h: 136.52, l: 135.5, c: 135.71 },
            { o: 135.71, h: 136.72, l: 135.37, c: 136.47 },
            { o: 136.47, h: 140.96, l: 135.64, c: 140.42 },
            { o: 140.42, h: 142.93, l: 140.23, c: 142.57 },
            { o: 142.57, h: 147.8, l: 141.59, c: 147.15 },
            { o: 147.15, h: 150.54, l: 146.82, c: 150 },
            { o: 150, h: 150.21, l: 148.66, c: 148.84 },
            { o: 148.84, h: 148.98, l: 146.9, c: 147 },
            { o: 147, h: 151.18, l: 146.51, c: 150.85 },
            { o: 150.85, h: 157.41, l: 150.36, c: 156.45 },
            { o: 156.45, h: 158.07, l: 156.03, c: 156.75 },
            { o: 156.75, h: 156.93, l: 153.93, c: 154.18 },
            { o: 154.18, h: 154.77, l: 150.66, c: 150.93 },
            { o: 150.93, h: 151.81, l: 145.93, c: 146.5 },
            { o: 146.5, h: 146.76, l: 143.72, c: 144.18 },
            { o: 144.18, h: 144.5, l: 139.58, c: 140.01 },
            { o: 140.01, h: 140.17, l: 136.93, c: 137.07 },
            { o: 137.07, h: 138.13, l: 136.98, c: 137.97 }
          ],
          zones: [
            { from: 5, top: 158.49, bottom: 157.65, kind: "supply", label: "Higher-timeframe gap supply" },
            { from: 10, top: 136.47, bottom: 135.37, kind: "demand", label: "Demand (target)" }
          ],
          lines: [
            { y: 150.54, label: "Prior day high", kind: "level", from: 15 }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "The poke above the prior day's high, right into higher-timeframe supply."
      },
      {
        type: "tf",
        q: "A breakout above yesterday's high is always a buy signal.",
        answer: false,
        explain: "Not when it runs into higher-timeframe supply. Then it is the bait of a bull trap."
      },
      {
        type: "mcq",
        q: "Where is the first target for the trap short?",
        options: ["The prior day high", "The demand level below", "Wherever volume spikes", "A 1:1 target"],
        answer: 1,
        explain: "The opposing level, the first demand below."
      },
      {
        type: "mcq",
        q: "Who does Sam want on the other side, like a car dealer?",
        options: ["Other professionals", "First-time buyers driven by emotion", "Banks", "Nobody"],
        answer: 1,
        explain: "Customers who do not know true value. Sell to them when price is too high."
      }
    ],
    practice: [
      {
        prompt: "Price just broke above yesterday's high and the crowd is excited. The breakout is running into a weekly gap-origin supply, with demand far below. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 126.19, l: 119.27, c: 125.47 },
            { o: 125.47, h: 133.62, l: 124.63, c: 133.27 },
            { o: 133.27, h: 138.87, l: 132.29, c: 137.89 },
            { o: 137.89, h: 144.93, l: 137.18, c: 143.68 },
            { o: 143.68, h: 150.67, l: 143.25, c: 150 },
            { o: 150, h: 150.62, l: 149.73, c: 150.43 },
            { o: 150.43, h: 150.72, l: 149.46, c: 149.64 },
            { o: 146.14, h: 146.32, l: 139.17, c: 139.84 },
            { o: 139.84, h: 140.07, l: 133.99, c: 134.52 },
            { o: 134.52, h: 135.07, l: 127.42, c: 128 },
            { o: 128, h: 128.51, l: 127.79, c: 128.2 },
            { o: 128.2, h: 128.37, l: 127.33, c: 127.6 },
            { o: 127.6, h: 128.61, l: 127.33, c: 128.4 },
            { o: 128.4, h: 132.11, l: 128.11, c: 131.76 },
            { o: 131.76, h: 135.78, l: 131.36, c: 135.32 },
            { o: 135.32, h: 140.04, l: 134.46, c: 139.33 },
            { o: 139.33, h: 142.41, l: 138.8, c: 142 },
            { o: 142, h: 142.22, l: 140.22, c: 140.3 },
            { o: 140.3, h: 140.56, l: 138.91, c: 139 },
            { o: 139, h: 145.6, l: 138.46, c: 144.56 },
            { o: 144.56, h: 149.29, l: 144.11, c: 148.64 },
            { o: 148.64, h: 150.18, l: 148.34, c: 148.74 },
            { o: 148.74, h: 149.11, l: 145.35, c: 145.72 },
            { o: 145.72, h: 145.89, l: 142.42, c: 142.96 },
            { o: 142.96, h: 143.3, l: 138.99, c: 139.68 },
            { o: 139.68, h: 140.42, l: 135, c: 135.37 },
            { o: 135.37, h: 136.03, l: 131.54, c: 132.07 },
            { o: 132.07, h: 132.5, l: 128.99, c: 129.2 }
          ],
          zones: [
            { from: 5, top: 150.72, bottom: 149.64, kind: "supply", label: "HTF gap supply" },
            { from: 10, top: 128.4, bottom: 127.33, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 142.41, label: "Prior day high", kind: "level", from: 15 }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Event + supply + room below = bull trap. Sell to the breakout buyers. Price fell to the demand."
      }
    ],
    cards: [
      {
        front: "Being \"hung\"?",
        back: "Buying right into supply before a collapse (or shorting into demand before a rally)."
      },
      { front: "Bull trap recipe?", back: "Event inviting buyers + price at supply + big margin below." },
      { front: "What gives a small-chart zone power here?", back: "It sits at a higher-timeframe gap origin." },
      { front: "Gaps represent?", back: "A strong supply and demand imbalance." }
    ],
    mnemonic: "Bait, wall, room: the three parts of a trap."
  },
  {
    mentor: "seiden",
    n: 248,
    eli5: {
      oneLiner: "The textbook double top sells too late, right into buyers. Sell the top instead.",
      story: "Books say a double top is only real after price breaks below the neckline, so they sell down there. Sam's student sold up at the second top, where the first top had left strong supply and gapped down. By the time the book readers sold the neckline, most of the drop was over. And the neckline was where buyers had stepped in before. The book sellers were the ones buying back the student's shares at his targets.",
      analogy: "It is like buying a ticket for a train after it has already left the station. You paid, but the ride is over."
    },
    bigIdeas: [
      "Short where price rallies into supply, not after a pattern breaks down.",
      "The neckline is demand. Selling its break means selling after a decline and into demand.",
      "Like a pattern? Wrap supply and demand rules around it and enter before the pattern traders."
    ],
    steps: [
      {
        title: "Top 1: a pivot high that gapped down",
        narration: "Price spiked to a pivot high, paused and gapped down. A gap away shows a big imbalance: strong supply.",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" }
          ],
          notes: [
            { x: 5, y: 164.55, text: "Top 1" }
          ],
          reveal: 13
        }
      },
      {
        title: "The low between the tops is demand",
        narration: "Price based and rallied from a low. That low will become the \"neckline\" in the textbook. It is really demand.",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" },
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" }
          ],
          notes: [
            { x: 5, y: 164.55, text: "Top 1" }
          ],
          reveal: 18
        }
      },
      {
        title: "Top 2: the member's short",
        narration: "Price rallies back into the first top's supply. Short at the bottom line, stop above. T1 at 3:1, T2 at 5:1.",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" },
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" }
          ],
          notes: [
            { x: 5, y: 164.55, text: "Top 1" },
            { x: 18, y: 164.55, text: "Top 2" }
          ],
          lines: [
            { y: 161.6, label: "Member short", kind: "entry", from: 6 },
            { y: 162.8, label: "Stop", kind: "sl", from: 6 },
            { y: 158, label: "T1 3:1", kind: "tp", from: 6 },
            { y: 155.6, label: "T2 5:1", kind: "tp", from: 6 }
          ],
          reveal: 19
        }
      },
      {
        title: "The textbook short is backwards",
        narration: "Price falls to the targets near the neckline. That is where books say to sell, after the decline and into demand. Price bounces from there.",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" },
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" }
          ],
          notes: [
            { x: 5, y: 164.55, text: "Top 1" },
            { x: 18, y: 164.55, text: "Top 2" },
            { x: 23, y: 137.28, text: "Textbook short here" }
          ],
          lines: [
            { y: 161.6, label: "Member short", kind: "entry", from: 6 },
            { y: 162.8, label: "Stop", kind: "sl", from: 6 },
            { y: 158, label: "T1 3:1", kind: "tp", from: 6 },
            { y: 155.6, label: "T2 5:1", kind: "tp", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle where Sam's member shorted.",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" },
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" }
          ]
        },
        answer: { from: 18, to: 18 },
        explain: "The rally back into the first top's supply, the second top."
      },
      {
        type: "mcq",
        q: "Why is selling the neckline break flawed?",
        options: [
          "The neckline is too high",
          "It sells after a decline and into demand",
          "It uses too small a stop",
          "It is too early"
        ],
        answer: 1,
        explain: "No consistently profitable trader sells after a decline into support."
      },
      {
        type: "tf",
        q: "When Shawn covered (bought back) at his targets, the traders selling to him were likely the book readers shorting the neckline break.",
        answer: true,
        explain: "A cover is a buy, so someone must sell. The textbook shorts at the neckline were that seller: late, and into demand."
      },
      {
        type: "mcq",
        q: "What made the pivot high strong supply?",
        options: [
          "It was a round number",
          "It was followed by a gap down",
          "It had high volume",
          "An analyst said so"
        ],
        answer: 1,
        explain: "A pivot high followed by a gap down shows a big imbalance."
      },
      {
        type: "order",
        q: "Order the events from first to last.",
        items: [
          "Pivot high gaps down (supply)",
          "Low forms (the \"neckline\" demand)",
          "Rally back into supply: short",
          "Price reaches targets near the neckline"
        ],
        explain: "Enter at the level, before the pattern completes."
      }
    ],
    practice: [
      {
        prompt: "Price is rallying back into the supply left by the first top, which gapped down. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" },
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" }
          ],
          notes: [
            { x: 5, y: 164.55, text: "Top 1" }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Short the second top at supply, before the pattern traders. Price fell to the targets."
      },
      {
        prompt: "Price has fallen all the way to the neckline. The book says \"sell the break now\". Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 122, h: 129.92, l: 120.41, c: 129.3 },
            { o: 129.3, h: 137.66, l: 128.51, c: 136.87 },
            { o: 136.87, h: 148.64, l: 136.36, c: 147.65 },
            { o: 147.65, h: 156.58, l: 146.04, c: 155.41 },
            { o: 155.41, h: 162.5, l: 154.24, c: 162 },
            { o: 162, h: 162.51, l: 161.88, c: 162.38 },
            { o: 162.38, h: 162.55, l: 161.4, c: 161.6 },
            { o: 158.6, h: 159.03, l: 152.77, c: 153.02 },
            { o: 153.02, h: 153.29, l: 145.21, c: 145.62 },
            { o: 145.62, h: 145.99, l: 139.43, c: 140 },
            { o: 140, h: 140.67, l: 139.86, c: 140.37 },
            { o: 140.37, h: 140.71, l: 139.28, c: 139.51 },
            { o: 139.51, h: 140.77, l: 139.28, c: 140.46 },
            { o: 140.46, h: 143.89, l: 140.11, c: 143.48 },
            { o: 143.48, h: 148.78, l: 142.58, c: 148.1 },
            { o: 148.1, h: 152.45, l: 147.29, c: 151.89 },
            { o: 151.89, h: 156.76, l: 151.11, c: 156 },
            { o: 156, h: 160.88, l: 155.55, c: 160.6 },
            { o: 160.6, h: 161.98, l: 160.18, c: 160.7 },
            { o: 160.7, h: 161.49, l: 154.85, c: 155.1 },
            { o: 155.1, h: 155.6, l: 151.34, c: 151.71 },
            { o: 151.71, h: 152.73, l: 144.11, c: 145.01 },
            { o: 145.01, h: 145.61, l: 140.26, c: 141.06 },
            { o: 141.06, h: 141.42, l: 139.96, c: 141.16 },
            { o: 141.16, h: 143.4, l: 140.96, c: 143.16 },
            { o: 143.16, h: 145.47, l: 142.76, c: 145.12 },
            { o: 145.12, h: 147.58, l: 144.71, c: 147.24 },
            { o: 147.24, h: 150.47, l: 146.64, c: 150 }
          ],
          zones: [
            { from: 10, top: 140.46, bottom: 139.28, kind: "demand", label: "Neckline = demand" },
            { from: 5, top: 162.55, bottom: 161.6, kind: "supply", label: "Supply (pivot high)" }
          ],
          reveal: 23
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "The neckline is demand, and the short from the top is being covered there. Selling here is selling after a decline into demand. Price bounced."
      }
    ],
    cards: [
      { front: "Textbook double-top entry?", back: "Sell the neckline break: after a decline, into demand." },
      { front: "Sam's double-top entry?", back: "Short the return to the first top's supply." },
      { front: "Neckline is really...?", back: "Demand (support)." },
      { front: "AA targets?", back: "T1 10.85 (3:1), T2 10.03 (5:1) from 12.08." }
    ],
    mnemonic: "Sell the top, not the drop."
  },
  {
    mentor: "seiden",
    n: 252,
    eli5: {
      oneLiner: "Decide from the level, not from what everyone else in the room does.",
      story: "At a big event Sam played a game: he showed a chart one candle at a time and people raised a hand to buy or sell. The market opened with a gap up straight into a supply level, and the first candle was a doji. Graduates mostly sold. Newcomers copied whoever moved first, and most bought. Price filled the gap lower, and the graduates did over 400% better.",
      analogy: "It is like following the person in front of you through a door marked \"wrong way\" just because they went first."
    },
    bigIdeas: [
      "An edge is a rule-based way to buy before others buy and sell before others sell.",
      "A gap open into obvious supply with a doji favours the short; the gap fill is the first target.",
      "You never have to trade the first candle. Herd behaviour, not chart reading, makes the losers."
    ],
    steps: [
      {
        title: "Small base, big drop",
        narration: "Yesterday afternoon a small base launched a hard drop. That base is clean supply.",
        scene: {
          candles: [
            { o: 124, h: 130.84, l: 122.78, c: 130.4 },
            { o: 130.4, h: 138.66, l: 128.91, c: 138.31 },
            { o: 138.31, h: 144.72, l: 137.95, c: 144.03 },
            { o: 144.03, h: 152.47, l: 143.48, c: 152 },
            { o: 152, h: 152.39, l: 151.88, c: 152.31 },
            { o: 152.31, h: 152.52, l: 151.69, c: 151.87 },
            { o: 151.87, h: 152.17, l: 146.28, c: 146.59 },
            { o: 146.59, h: 146.73, l: 142.83, c: 143.21 },
            { o: 143.21, h: 143.6, l: 137.72, c: 138 },
            { o: 138, h: 139.34, l: 137.77, c: 139.13 },
            { o: 139.13, h: 139.43, l: 137.89, c: 138.21 },
            { o: 138.21, h: 140.21, l: 137.86, c: 139.85 },
            { o: 139.85, h: 139.91, l: 138.94, c: 139.01 },
            { o: 139.01, h: 141, l: 138.49, c: 140.65 },
            { o: 140.65, h: 140.81, l: 139.71, c: 139.87 },
            { o: 139.87, h: 141.38, l: 139.59, c: 141 },
            { o: 151.97, h: 152.26, l: 151.47, c: 152.02 },
            { o: 152.02, h: 152.53, l: 148.95, c: 149.2 },
            { o: 149.2, h: 149.45, l: 147.73, c: 147.9 },
            { o: 147.9, h: 148.04, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.58, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.66, l: 140.05, c: 140.5 },
            { o: 140.5, h: 140.56, l: 139.41, c: 139.54 },
            { o: 139.54, h: 139.58, l: 138.84, c: 139 }
          ],
          zones: [
            { from: 4, top: 152.52, bottom: 151.87, kind: "supply", label: "Supply (resistance)" }
          ],
          reveal: 9
        }
      },
      {
        title: "The rest of the day",
        narration: "Price chops quietly below. We mark the close; the gap fill will be our target.",
        scene: {
          candles: [
            { o: 124, h: 130.84, l: 122.78, c: 130.4 },
            { o: 130.4, h: 138.66, l: 128.91, c: 138.31 },
            { o: 138.31, h: 144.72, l: 137.95, c: 144.03 },
            { o: 144.03, h: 152.47, l: 143.48, c: 152 },
            { o: 152, h: 152.39, l: 151.88, c: 152.31 },
            { o: 152.31, h: 152.52, l: 151.69, c: 151.87 },
            { o: 151.87, h: 152.17, l: 146.28, c: 146.59 },
            { o: 146.59, h: 146.73, l: 142.83, c: 143.21 },
            { o: 143.21, h: 143.6, l: 137.72, c: 138 },
            { o: 138, h: 139.34, l: 137.77, c: 139.13 },
            { o: 139.13, h: 139.43, l: 137.89, c: 138.21 },
            { o: 138.21, h: 140.21, l: 137.86, c: 139.85 },
            { o: 139.85, h: 139.91, l: 138.94, c: 139.01 },
            { o: 139.01, h: 141, l: 138.49, c: 140.65 },
            { o: 140.65, h: 140.81, l: 139.71, c: 139.87 },
            { o: 139.87, h: 141.38, l: 139.59, c: 141 },
            { o: 151.97, h: 152.26, l: 151.47, c: 152.02 },
            { o: 152.02, h: 152.53, l: 148.95, c: 149.2 },
            { o: 149.2, h: 149.45, l: 147.73, c: 147.9 },
            { o: 147.9, h: 148.04, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.58, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.66, l: 140.05, c: 140.5 },
            { o: 140.5, h: 140.56, l: 139.41, c: 139.54 },
            { o: 139.54, h: 139.58, l: 138.84, c: 139 }
          ],
          zones: [
            { from: 4, top: 152.52, bottom: 151.87, kind: "supply", label: "Supply (resistance)" }
          ],
          lines: [
            { y: 141, label: "Prior close (gap fill)", kind: "tp", from: 15 }
          ],
          reveal: 16
        }
      },
      {
        title: "Hard right edge: gap up doji",
        narration: "The new session gaps up straight into the supply and prints a doji. Graduates see: gap up, into supply, stalling. Newcomers see others buying and copy them.",
        scene: {
          candles: [
            { o: 124, h: 130.84, l: 122.78, c: 130.4 },
            { o: 130.4, h: 138.66, l: 128.91, c: 138.31 },
            { o: 138.31, h: 144.72, l: 137.95, c: 144.03 },
            { o: 144.03, h: 152.47, l: 143.48, c: 152 },
            { o: 152, h: 152.39, l: 151.88, c: 152.31 },
            { o: 152.31, h: 152.52, l: 151.69, c: 151.87 },
            { o: 151.87, h: 152.17, l: 146.28, c: 146.59 },
            { o: 146.59, h: 146.73, l: 142.83, c: 143.21 },
            { o: 143.21, h: 143.6, l: 137.72, c: 138 },
            { o: 138, h: 139.34, l: 137.77, c: 139.13 },
            { o: 139.13, h: 139.43, l: 137.89, c: 138.21 },
            { o: 138.21, h: 140.21, l: 137.86, c: 139.85 },
            { o: 139.85, h: 139.91, l: 138.94, c: 139.01 },
            { o: 139.01, h: 141, l: 138.49, c: 140.65 },
            { o: 140.65, h: 140.81, l: 139.71, c: 139.87 },
            { o: 139.87, h: 141.38, l: 139.59, c: 141 },
            { o: 151.97, h: 152.26, l: 151.47, c: 152.02 },
            { o: 152.02, h: 152.53, l: 148.95, c: 149.2 },
            { o: 149.2, h: 149.45, l: 147.73, c: 147.9 },
            { o: 147.9, h: 148.04, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.58, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.66, l: 140.05, c: 140.5 },
            { o: 140.5, h: 140.56, l: 139.41, c: 139.54 },
            { o: 139.54, h: 139.58, l: 138.84, c: 139 }
          ],
          zones: [
            { from: 4, top: 152.52, bottom: 151.87, kind: "supply", label: "Supply (resistance)" }
          ],
          lines: [
            { y: 141, label: "Prior close (gap fill)", kind: "tp", from: 15 }
          ],
          highlight: { from: 16, to: 16, label: "doji at supply" },
          reveal: 17
        }
      },
      {
        title: "The gap fills",
        narration: "A string of red candles drops to the prior close. Sellers of the doji made several times their risk.",
        scene: {
          candles: [
            { o: 124, h: 130.84, l: 122.78, c: 130.4 },
            { o: 130.4, h: 138.66, l: 128.91, c: 138.31 },
            { o: 138.31, h: 144.72, l: 137.95, c: 144.03 },
            { o: 144.03, h: 152.47, l: 143.48, c: 152 },
            { o: 152, h: 152.39, l: 151.88, c: 152.31 },
            { o: 152.31, h: 152.52, l: 151.69, c: 151.87 },
            { o: 151.87, h: 152.17, l: 146.28, c: 146.59 },
            { o: 146.59, h: 146.73, l: 142.83, c: 143.21 },
            { o: 143.21, h: 143.6, l: 137.72, c: 138 },
            { o: 138, h: 139.34, l: 137.77, c: 139.13 },
            { o: 139.13, h: 139.43, l: 137.89, c: 138.21 },
            { o: 138.21, h: 140.21, l: 137.86, c: 139.85 },
            { o: 139.85, h: 139.91, l: 138.94, c: 139.01 },
            { o: 139.01, h: 141, l: 138.49, c: 140.65 },
            { o: 140.65, h: 140.81, l: 139.71, c: 139.87 },
            { o: 139.87, h: 141.38, l: 139.59, c: 141 },
            { o: 151.97, h: 152.26, l: 151.47, c: 152.02 },
            { o: 152.02, h: 152.53, l: 148.95, c: 149.2 },
            { o: 149.2, h: 149.45, l: 147.73, c: 147.9 },
            { o: 147.9, h: 148.04, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.58, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.66, l: 140.05, c: 140.5 },
            { o: 140.5, h: 140.56, l: 139.41, c: 139.54 },
            { o: 139.54, h: 139.58, l: 138.84, c: 139 }
          ],
          zones: [
            { from: 4, top: 152.52, bottom: 151.87, kind: "supply", label: "Supply (resistance)" }
          ],
          lines: [
            { y: 151.87, label: "Entry (proximal)", kind: "entry", from: 5 },
            { y: 152.77, label: "Stop above distal", kind: "sl", from: 5 },
            { y: 141, label: "Prior close (gap fill)", kind: "tp", from: 15 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the candle where graduates sold.",
        scene: {
          candles: [
            { o: 124, h: 130.84, l: 122.78, c: 130.4 },
            { o: 130.4, h: 138.66, l: 128.91, c: 138.31 },
            { o: 138.31, h: 144.72, l: 137.95, c: 144.03 },
            { o: 144.03, h: 152.47, l: 143.48, c: 152 },
            { o: 152, h: 152.39, l: 151.88, c: 152.31 },
            { o: 152.31, h: 152.52, l: 151.69, c: 151.87 },
            { o: 151.87, h: 152.17, l: 146.28, c: 146.59 },
            { o: 146.59, h: 146.73, l: 142.83, c: 143.21 },
            { o: 143.21, h: 143.6, l: 137.72, c: 138 },
            { o: 138, h: 139.34, l: 137.77, c: 139.13 },
            { o: 139.13, h: 139.43, l: 137.89, c: 138.21 },
            { o: 138.21, h: 140.21, l: 137.86, c: 139.85 },
            { o: 139.85, h: 139.91, l: 138.94, c: 139.01 },
            { o: 139.01, h: 141, l: 138.49, c: 140.65 },
            { o: 140.65, h: 140.81, l: 139.71, c: 139.87 },
            { o: 139.87, h: 141.38, l: 139.59, c: 141 },
            { o: 151.97, h: 152.26, l: 151.47, c: 152.02 },
            { o: 152.02, h: 152.53, l: 148.95, c: 149.2 },
            { o: 149.2, h: 149.45, l: 147.73, c: 147.9 },
            { o: 147.9, h: 148.04, l: 144.75, c: 145.25 },
            { o: 145.25, h: 145.58, l: 143.18, c: 143.28 },
            { o: 143.28, h: 143.66, l: 140.05, c: 140.5 },
            { o: 140.5, h: 140.56, l: 139.41, c: 139.54 },
            { o: 139.54, h: 139.58, l: 138.84, c: 139 }
          ],
          zones: [
            { from: 4, top: 152.52, bottom: 151.87, kind: "supply", label: "Supply (resistance)" }
          ]
        },
        answer: { from: 16, to: 16 },
        explain: "The gap-up doji right into supply."
      },
      {
        type: "tf",
        q: "You must take a trade on the first candle of the session.",
        answer: false,
        explain: "Sam told the room they did not need to trade the first candle. Patience is allowed."
      },
      {
        type: "mcq",
        q: "Why did most newcomers buy?",
        options: [
          "They read the chart",
          "They copied the first person who moved",
          "The doji was bullish",
          "They had a system"
        ],
        answer: 1,
        explain: "Herd mentality. Afterwards they admitted they \"knew\" it was a doji into resistance."
      },
      {
        type: "mcq",
        q: "What is the natural first target after shorting a gap up into supply?",
        options: [
          "The day's high",
          "The gap fill near the prior close",
          "Ten times the risk",
          "There is none"
        ],
        answer: 1,
        explain: "The gap fill (prior close area)."
      },
      {
        type: "mcq",
        q: "How much better did graduates do than newcomers?",
        options: ["10%", "50%", "More than 400%", "The same"],
        answer: 2,
        explain: "Over 400% better, because they followed rules instead of the crowd."
      }
    ],
    practice: [
      {
        prompt: "Mirror case. The session gaps down straight into a small base that launched a big rally yesterday, and the first candle is a doji. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 176, h: 176.64, l: 169.08, c: 169.59 },
            { o: 169.59, h: 170.43, l: 160.62, c: 161.43 },
            { o: 161.43, h: 161.88, l: 156.12, c: 156.45 },
            { o: 156.45, h: 157.63, l: 147.55, c: 148 },
            { o: 148, h: 148.39, l: 147.89, c: 148.16 },
            { o: 148.16, h: 148.36, l: 147.53, c: 147.76 },
            { o: 147.76, h: 152.26, l: 147.61, c: 151.8 },
            { o: 151.8, h: 157.48, l: 151.53, c: 157.19 },
            { o: 157.19, h: 162.43, l: 156.83, c: 162 },
            { o: 162, h: 162.42, l: 161.94, c: 162.22 },
            { o: 162.22, h: 162.39, l: 160.48, c: 160.64 },
            { o: 160.64, h: 161.56, l: 160.42, c: 161.4 },
            { o: 161.4, h: 161.94, l: 159.18, c: 159.66 },
            { o: 159.66, h: 160.77, l: 159.55, c: 160.62 },
            { o: 160.62, h: 160.86, l: 158.55, c: 158.94 },
            { o: 158.94, h: 159.07, l: 158.7, c: 159 },
            { o: 148.06, h: 148.56, l: 147.78, c: 148.01 },
            { o: 148.01, h: 151.23, l: 147.53, c: 150.82 },
            { o: 150.82, h: 153.09, l: 150.43, c: 152.81 },
            { o: 152.81, h: 154.56, l: 152.63, c: 154.44 },
            { o: 154.44, h: 157.81, l: 153.81, c: 157.4 },
            { o: 157.4, h: 159.84, l: 157.2, c: 159.5 },
            { o: 159.5, h: 160.23, l: 159.38, c: 160.14 },
            { o: 160.14, h: 161.04, l: 160.07, c: 161 }
          ],
          zones: [
            { from: 4, top: 148.16, bottom: 147.53, kind: "demand", label: "Demand (support)" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "Gap down into demand with a stall: buy, target the gap fill. Price rallied back to the prior close and beyond."
      }
    ],
    cards: [
      { front: "Hard right edge game?", back: "Candles revealed one at a time; decide buy or sell once." },
      { front: "Gap up doji into supply favours?", back: "The short, target the gap fill." },
      { front: "Graduates vs newcomers?", back: "Graduates did more than 400% better." },
      { front: "What drove the losers?", back: "Herd mentality, not chart reading." }
    ],
    mnemonic: "Gap into a wall plus a doji = sell, and let the crowd buy."
  },
  {
    mentor: "seiden",
    n: 256,
    eli5: {
      oneLiner: "Day, swing or long term: the style changes, the strategy never does.",
      story: "Day traders close everything before the bell and need fast tools and fast decisions. Swing traders hold for days or weeks and can plan when the market is closed. Position traders hold for months and need the least time. Sam likes swing trading best, because there is the least competition and he can use set-and-forget orders. In every style the rule is the same: buy low at demand and sell high at supply.",
      analogy: "Walking, biking and driving are different ways to get to school. The address of the school stays the same."
    },
    bigIdeas: [
      "Same strategy in every style: buy low and sell high at quantified imbalances.",
      "Good day traders take 1-3 quality trades, usually near the open, not 10-100.",
      "Swing: plan while the market is closed and use set-and-forget orders. Setups come in bunches."
    ],
    steps: [
      {
        title: "Plan on the weekend",
        narration: "The market is closed. On the daily chart, mark the demand that launched a strong rally. No emotion, no rush.",
        scene: {
          candles: [
            { o: 168, h: 168.3, l: 161.3, c: 162.24 },
            { o: 162.24, h: 163.66, l: 152.59, c: 153.44 },
            { o: 153.44, h: 154.15, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.38, l: 143.64, c: 144.31 },
            { o: 144.31, h: 145.85, l: 135.55, c: 136 },
            { o: 136, h: 136.54, l: 135.84, c: 136.29 },
            { o: 136.29, h: 136.49, l: 135.6, c: 135.77 },
            { o: 135.77, h: 136.85, l: 135.5, c: 136.54 },
            { o: 136.54, h: 141.84, l: 136.34, c: 141.5 },
            { o: 141.5, h: 147.35, l: 140.97, c: 147.13 },
            { o: 147.13, h: 152.46, l: 146.57, c: 151.96 },
            { o: 151.96, h: 158.24, l: 151.48, c: 158 },
            { o: 158, h: 158.48, l: 157.81, c: 158.37 },
            { o: 158.37, h: 158.91, l: 155.34, c: 155.77 },
            { o: 155.77, h: 156.81, l: 155.7, c: 156.65 },
            { o: 156.65, h: 157.22, l: 153.68, c: 154.42 },
            { o: 154.42, h: 156.04, l: 154.31, c: 155.71 },
            { o: 155.71, h: 156.02, l: 153.68, c: 154 },
            { o: 154, h: 154.74, l: 148.03, c: 148.84 },
            { o: 148.84, h: 149.16, l: 146.85, c: 147.13 },
            { o: 147.13, h: 147.88, l: 142.21, c: 142.72 },
            { o: 142.72, h: 143.4, l: 137.66, c: 137.94 },
            { o: 137.94, h: 138.2, l: 136.12, c: 137.34 },
            { o: 137.34, h: 140.67, l: 137.13, c: 140.32 },
            { o: 140.32, h: 144.05, l: 140.11, c: 143.85 },
            { o: 143.85, h: 146.7, l: 143.74, c: 146.6 },
            { o: 146.6, h: 150.33, l: 146.51, c: 150.14 },
            { o: 150.14, h: 152.01, l: 149.94, c: 151.85 },
            { o: 151.85, h: 156.99, l: 151.67, c: 156.55 },
            { o: 156.55, h: 158.84, l: 156.44, c: 158.6 },
            { o: 158.6, h: 162.36, l: 158.24, c: 162 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.5, kind: "demand", label: "Daily demand" }
          ],
          reveal: 18
        }
      },
      {
        title: "Set and forget",
        narration: "Place a buy at the top line, a stop under the zone and a target. Then go live your life.",
        scene: {
          candles: [
            { o: 168, h: 168.3, l: 161.3, c: 162.24 },
            { o: 162.24, h: 163.66, l: 152.59, c: 153.44 },
            { o: 153.44, h: 154.15, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.38, l: 143.64, c: 144.31 },
            { o: 144.31, h: 145.85, l: 135.55, c: 136 },
            { o: 136, h: 136.54, l: 135.84, c: 136.29 },
            { o: 136.29, h: 136.49, l: 135.6, c: 135.77 },
            { o: 135.77, h: 136.85, l: 135.5, c: 136.54 },
            { o: 136.54, h: 141.84, l: 136.34, c: 141.5 },
            { o: 141.5, h: 147.35, l: 140.97, c: 147.13 },
            { o: 147.13, h: 152.46, l: 146.57, c: 151.96 },
            { o: 151.96, h: 158.24, l: 151.48, c: 158 },
            { o: 158, h: 158.48, l: 157.81, c: 158.37 },
            { o: 158.37, h: 158.91, l: 155.34, c: 155.77 },
            { o: 155.77, h: 156.81, l: 155.7, c: 156.65 },
            { o: 156.65, h: 157.22, l: 153.68, c: 154.42 },
            { o: 154.42, h: 156.04, l: 154.31, c: 155.71 },
            { o: 155.71, h: 156.02, l: 153.68, c: 154 },
            { o: 154, h: 154.74, l: 148.03, c: 148.84 },
            { o: 148.84, h: 149.16, l: 146.85, c: 147.13 },
            { o: 147.13, h: 147.88, l: 142.21, c: 142.72 },
            { o: 142.72, h: 143.4, l: 137.66, c: 137.94 },
            { o: 137.94, h: 138.2, l: 136.12, c: 137.34 },
            { o: 137.34, h: 140.67, l: 137.13, c: 140.32 },
            { o: 140.32, h: 144.05, l: 140.11, c: 143.85 },
            { o: 143.85, h: 146.7, l: 143.74, c: 146.6 },
            { o: 146.6, h: 150.33, l: 146.51, c: 150.14 },
            { o: 150.14, h: 152.01, l: 149.94, c: 151.85 },
            { o: 151.85, h: 156.99, l: 151.67, c: 156.55 },
            { o: 156.55, h: 158.84, l: 156.44, c: 158.6 },
            { o: 158.6, h: 162.36, l: 158.24, c: 162 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.5, kind: "demand", label: "Daily demand" }
          ],
          lines: [
            { y: 136.54, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 135.25, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 158, label: "Target: opposing level", kind: "tp", from: 7 }
          ],
          reveal: 20
        }
      },
      {
        title: "The order fills by itself",
        narration: "Days later price pulls back into the zone. The order fills while you are not watching. When the S&P pulls back to demand, many stocks set up like this at once.",
        scene: {
          candles: [
            { o: 168, h: 168.3, l: 161.3, c: 162.24 },
            { o: 162.24, h: 163.66, l: 152.59, c: 153.44 },
            { o: 153.44, h: 154.15, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.38, l: 143.64, c: 144.31 },
            { o: 144.31, h: 145.85, l: 135.55, c: 136 },
            { o: 136, h: 136.54, l: 135.84, c: 136.29 },
            { o: 136.29, h: 136.49, l: 135.6, c: 135.77 },
            { o: 135.77, h: 136.85, l: 135.5, c: 136.54 },
            { o: 136.54, h: 141.84, l: 136.34, c: 141.5 },
            { o: 141.5, h: 147.35, l: 140.97, c: 147.13 },
            { o: 147.13, h: 152.46, l: 146.57, c: 151.96 },
            { o: 151.96, h: 158.24, l: 151.48, c: 158 },
            { o: 158, h: 158.48, l: 157.81, c: 158.37 },
            { o: 158.37, h: 158.91, l: 155.34, c: 155.77 },
            { o: 155.77, h: 156.81, l: 155.7, c: 156.65 },
            { o: 156.65, h: 157.22, l: 153.68, c: 154.42 },
            { o: 154.42, h: 156.04, l: 154.31, c: 155.71 },
            { o: 155.71, h: 156.02, l: 153.68, c: 154 },
            { o: 154, h: 154.74, l: 148.03, c: 148.84 },
            { o: 148.84, h: 149.16, l: 146.85, c: 147.13 },
            { o: 147.13, h: 147.88, l: 142.21, c: 142.72 },
            { o: 142.72, h: 143.4, l: 137.66, c: 137.94 },
            { o: 137.94, h: 138.2, l: 136.12, c: 137.34 },
            { o: 137.34, h: 140.67, l: 137.13, c: 140.32 },
            { o: 140.32, h: 144.05, l: 140.11, c: 143.85 },
            { o: 143.85, h: 146.7, l: 143.74, c: 146.6 },
            { o: 146.6, h: 150.33, l: 146.51, c: 150.14 },
            { o: 150.14, h: 152.01, l: 149.94, c: 151.85 },
            { o: 151.85, h: 156.99, l: 151.67, c: 156.55 },
            { o: 156.55, h: 158.84, l: 156.44, c: 158.6 },
            { o: 158.6, h: 162.36, l: 158.24, c: 162 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.5, kind: "demand", label: "Daily demand" }
          ],
          lines: [
            { y: 136.54, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 135.25, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 158, label: "Target: opposing level", kind: "tp", from: 7 }
          ],
          reveal: 23
        }
      },
      {
        title: "Target reached",
        narration: "Price rallies to the target over the next days. A swing trade with an hour of analysis.",
        scene: {
          candles: [
            { o: 168, h: 168.3, l: 161.3, c: 162.24 },
            { o: 162.24, h: 163.66, l: 152.59, c: 153.44 },
            { o: 153.44, h: 154.15, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.38, l: 143.64, c: 144.31 },
            { o: 144.31, h: 145.85, l: 135.55, c: 136 },
            { o: 136, h: 136.54, l: 135.84, c: 136.29 },
            { o: 136.29, h: 136.49, l: 135.6, c: 135.77 },
            { o: 135.77, h: 136.85, l: 135.5, c: 136.54 },
            { o: 136.54, h: 141.84, l: 136.34, c: 141.5 },
            { o: 141.5, h: 147.35, l: 140.97, c: 147.13 },
            { o: 147.13, h: 152.46, l: 146.57, c: 151.96 },
            { o: 151.96, h: 158.24, l: 151.48, c: 158 },
            { o: 158, h: 158.48, l: 157.81, c: 158.37 },
            { o: 158.37, h: 158.91, l: 155.34, c: 155.77 },
            { o: 155.77, h: 156.81, l: 155.7, c: 156.65 },
            { o: 156.65, h: 157.22, l: 153.68, c: 154.42 },
            { o: 154.42, h: 156.04, l: 154.31, c: 155.71 },
            { o: 155.71, h: 156.02, l: 153.68, c: 154 },
            { o: 154, h: 154.74, l: 148.03, c: 148.84 },
            { o: 148.84, h: 149.16, l: 146.85, c: 147.13 },
            { o: 147.13, h: 147.88, l: 142.21, c: 142.72 },
            { o: 142.72, h: 143.4, l: 137.66, c: 137.94 },
            { o: 137.94, h: 138.2, l: 136.12, c: 137.34 },
            { o: 137.34, h: 140.67, l: 137.13, c: 140.32 },
            { o: 140.32, h: 144.05, l: 140.11, c: 143.85 },
            { o: 143.85, h: 146.7, l: 143.74, c: 146.6 },
            { o: 146.6, h: 150.33, l: 146.51, c: 150.14 },
            { o: 150.14, h: 152.01, l: 149.94, c: 151.85 },
            { o: 151.85, h: 156.99, l: 151.67, c: 156.55 },
            { o: 156.55, h: 158.84, l: 156.44, c: 158.6 },
            { o: 158.6, h: 162.36, l: 158.24, c: 162 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.5, kind: "demand", label: "Daily demand" }
          ],
          lines: [
            { y: 136.54, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 135.25, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 158, label: "Target: opposing level", kind: "tp", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How many trades a day do consistently profitable day traders tend to take?",
        options: [
          "10-100",
          "1-3 quality trades, usually near the open",
          "One per hour",
          "As many as possible"
        ],
        answer: 1,
        explain: "Quality over quantity: 1-3 trades, often near the open."
      },
      {
        type: "mcq",
        q: "When is the best time to do swing-trading analysis?",
        options: ["During the open", "When the market is closed", "At lunch", "During news releases"],
        answer: 1,
        explain: "Analysis while the market is closed removes emotion."
      },
      {
        type: "tf",
        q: "Each trading style needs a completely different strategy.",
        answer: false,
        explain: "A strategy that works in one market or timeframe should work in any."
      },
      {
        type: "mcq",
        q: "Why does Sam say swing trading has the least competition?",
        options: [
          "It is illegal for banks",
          "Too long for day traders, too short for institutions",
          "Nobody knows about it",
          "It needs no data"
        ],
        answer: 1,
        explain: "It sits between the day traders and the big institutions."
      },
      {
        type: "spot",
        q: "Click the candle where the set-and-forget order filled.",
        scene: {
          candles: [
            { o: 168, h: 168.3, l: 161.3, c: 162.24 },
            { o: 162.24, h: 163.66, l: 152.59, c: 153.44 },
            { o: 153.44, h: 154.15, l: 148.3, c: 148.67 },
            { o: 148.67, h: 149.38, l: 143.64, c: 144.31 },
            { o: 144.31, h: 145.85, l: 135.55, c: 136 },
            { o: 136, h: 136.54, l: 135.84, c: 136.29 },
            { o: 136.29, h: 136.49, l: 135.6, c: 135.77 },
            { o: 135.77, h: 136.85, l: 135.5, c: 136.54 },
            { o: 136.54, h: 141.84, l: 136.34, c: 141.5 },
            { o: 141.5, h: 147.35, l: 140.97, c: 147.13 },
            { o: 147.13, h: 152.46, l: 146.57, c: 151.96 },
            { o: 151.96, h: 158.24, l: 151.48, c: 158 },
            { o: 158, h: 158.48, l: 157.81, c: 158.37 },
            { o: 158.37, h: 158.91, l: 155.34, c: 155.77 },
            { o: 155.77, h: 156.81, l: 155.7, c: 156.65 },
            { o: 156.65, h: 157.22, l: 153.68, c: 154.42 },
            { o: 154.42, h: 156.04, l: 154.31, c: 155.71 },
            { o: 155.71, h: 156.02, l: 153.68, c: 154 },
            { o: 154, h: 154.74, l: 148.03, c: 148.84 },
            { o: 148.84, h: 149.16, l: 146.85, c: 147.13 },
            { o: 147.13, h: 147.88, l: 142.21, c: 142.72 },
            { o: 142.72, h: 143.4, l: 137.66, c: 137.94 },
            { o: 137.94, h: 138.2, l: 136.12, c: 137.34 },
            { o: 137.34, h: 140.67, l: 137.13, c: 140.32 },
            { o: 140.32, h: 144.05, l: 140.11, c: 143.85 },
            { o: 143.85, h: 146.7, l: 143.74, c: 146.6 },
            { o: 146.6, h: 150.33, l: 146.51, c: 150.14 },
            { o: 150.14, h: 152.01, l: 149.94, c: 151.85 },
            { o: 151.85, h: 156.99, l: 151.67, c: 156.55 },
            { o: 156.55, h: 158.84, l: 156.44, c: 158.6 },
            { o: 158.6, h: 162.36, l: 158.24, c: 162 }
          ],
          zones: [
            { from: 5, top: 136.54, bottom: 135.5, kind: "demand", label: "Daily demand" }
          ]
        },
        answer: { from: 22, to: 22 },
        explain: "The first pullback into daily demand."
      }
    ],
    practice: [
      {
        prompt: "Weekend analysis: price is rallying back toward daily supply that it dropped hard from. Your set-and-forget order is ready. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 126, h: 133.03, l: 125.66, c: 132.48 },
            { o: 132.48, h: 138.64, l: 131.4, c: 138.38 },
            { o: 138.38, h: 148.2, l: 137.67, c: 147.15 },
            { o: 147.15, h: 154.03, l: 145.84, c: 153.14 },
            { o: 153.14, h: 162.75, l: 151.67, c: 162 },
            { o: 162, h: 162.68, l: 161.77, c: 162.46 },
            { o: 162.46, h: 162.8, l: 161.64, c: 161.76 },
            { o: 161.76, h: 162.66, l: 161.41, c: 162.31 },
            { o: 162.31, h: 162.79, l: 157.01, c: 157.16 },
            { o: 157.16, h: 157.67, l: 151.15, c: 151.47 },
            { o: 151.47, h: 151.59, l: 146.38, c: 146.63 },
            { o: 146.63, h: 146.81, l: 140.44, c: 141 },
            { o: 141, h: 142.91, l: 140.72, c: 142.75 },
            { o: 142.75, h: 142.87, l: 141.79, c: 141.98 },
            { o: 141.98, h: 144.71, l: 141.69, c: 144.43 },
            { o: 144.43, h: 144.77, l: 143, c: 143.36 },
            { o: 143.36, h: 146.39, l: 142.67, c: 146.09 },
            { o: 146.09, h: 146.17, l: 145.77, c: 146 },
            { o: 146, h: 150.65, l: 145.68, c: 150.01 },
            { o: 150.01, h: 153.93, l: 149.5, c: 153.4 },
            { o: 153.4, h: 156.66, l: 152.9, c: 156.36 },
            { o: 156.36, h: 161.14, l: 156.04, c: 160.36 },
            { o: 160.36, h: 162.18, l: 160.1, c: 160.96 },
            { o: 160.96, h: 161.32, l: 156.06, c: 156.51 },
            { o: 156.51, h: 156.76, l: 153.82, c: 154.09 },
            { o: 154.09, h: 154.48, l: 148.38, c: 148.61 },
            { o: 148.61, h: 148.86, l: 145.42, c: 145.65 },
            { o: 145.65, h: 145.92, l: 142.26, c: 142.53 },
            { o: 142.53, h: 142.88, l: 136.42, c: 136.92 },
            { o: 136.92, h: 137.13, l: 133.86, c: 134 }
          ],
          zones: [
            { from: 5, top: 162.8, bottom: 161.76, kind: "supply", label: "Daily supply" }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Same strategy in any style: sell at supply. Price fell away over the following days."
      }
    ],
    cards: [
      { front: "Three ways to speculate?", back: "Day trading, swing trading, longer-term position trading." },
      { front: "Sam's favourite style?", back: "Swing trading." },
      { front: "Swing trading con?", back: "Can feel boring; setups come in bunches." },
      { front: "Position trading con?", back: "News-driven decisions, slow results, capital tied up." },
      { front: "What never changes?", back: "The strategy: quantify supply and demand to find turning points." }
    ],
    mnemonic: "Walk, bike or drive: same school, same address."
  },
  {
    mentor: "seiden",
    n: 260,
    eli5: {
      oneLiner: "Big chart picks the side. The 60-minute chart picks the exact spot.",
      story: "A swing trader asked how to pick timeframes. Sam said: look at the daily or weekly chart to see where price is, near demand or near supply. That tells you whether to buy or sell. Then zoom in to the 60-minute chart, but no smaller, to find where most of the trading happened inside the big zone. That smaller zone gives a much smaller stop.",
      analogy: "A map of the country shows you which city to go to. A street map shows you the exact house."
    },
    bigIdeas: [
      "The basics never die: Newton and Adam Smith described the same supply and demand reality.",
      "Swing: daily or weekly for direction, 60-minute (no smaller) to refine the entry and shrink the stop.",
      "Swing uses the same analysis as day trading, just slower and done while the market is closed."
    ],
    steps: [
      {
        title: "The weekly zone is wide",
        narration: "On the weekly chart, demand covers a wide area. The stop below it would be large.",
        scene: {
          candles: [
            { o: 170, h: 171.15, l: 163.84, c: 164.59 },
            { o: 164.59, h: 165.2, l: 157.54, c: 158.62 },
            { o: 158.62, h: 160.01, l: 150.02, c: 150.76 },
            { o: 150.76, h: 151.18, l: 145.09, c: 145.73 },
            { o: 145.73, h: 146.56, l: 139.44, c: 140 },
            { o: 140, h: 142.34, l: 139.45, c: 142.09 },
            { o: 142.09, h: 142.54, l: 138.99, c: 139.26 },
            { o: 139.26, h: 141.56, l: 138.92, c: 141 },
            { o: 141, h: 141.2, l: 138.57, c: 139 },
            { o: 139, h: 139.56, l: 138.82, c: 139.35 },
            { o: 139.35, h: 139.61, l: 138.45, c: 138.6 },
            { o: 138.6, h: 139.56, l: 138.34, c: 139.36 },
            { o: 139.36, h: 142.42, l: 138.92, c: 142 },
            { o: 142, h: 147.15, l: 141.54, c: 146.94 },
            { o: 146.94, h: 152.47, l: 146.62, c: 151.96 },
            { o: 151.96, h: 157.07, l: 151.81, c: 156.67 },
            { o: 156.67, h: 162.49, l: 156.07, c: 162 },
            { o: 162, h: 162.1, l: 161.94, c: 162.03 },
            { o: 162.03, h: 162.55, l: 158.1, c: 158.84 },
            { o: 158.84, h: 159.8, l: 158.57, c: 159.64 },
            { o: 159.64, h: 160.09, l: 156, c: 156.85 },
            { o: 156.85, h: 157.23, l: 156.6, c: 157 },
            { o: 157, h: 157.48, l: 153.9, c: 154.05 },
            { o: 154.05, h: 154.55, l: 147.17, c: 147.55 },
            { o: 147.55, h: 148.19, l: 143.31, c: 143.55 },
            { o: 143.55, h: 143.79, l: 139.96, c: 140.56 },
            { o: 140.56, h: 140.9, l: 138.95, c: 140.16 },
            { o: 140.16, h: 143.74, l: 139.68, c: 143.11 },
            { o: 143.11, h: 147.79, l: 142.55, c: 147.32 },
            { o: 147.32, h: 151.52, l: 146.59, c: 151.33 },
            { o: 151.33, h: 153.15, l: 151.09, c: 153 },
            { o: 153, h: 158.16, l: 152.23, c: 157.72 },
            { o: 157.72, h: 161.84, l: 157.55, c: 161.35 },
            { o: 161.35, h: 164.13, l: 161.05, c: 164 }
          ],
          zones: [
            { from: 5, top: 142.09, bottom: 138.34, kind: "demand", label: "Weekly demand (wide)", faded: true }
          ],
          reveal: 15
        }
      },
      {
        title: "Zoom to the 60-minute chart",
        narration: "Inside the weekly zone, find where most of the trading sat: a tight base. Draw it with the same rule: top on the highest body, bottom on the lowest wick.",
        scene: {
          candles: [
            { o: 170, h: 171.15, l: 163.84, c: 164.59 },
            { o: 164.59, h: 165.2, l: 157.54, c: 158.62 },
            { o: 158.62, h: 160.01, l: 150.02, c: 150.76 },
            { o: 150.76, h: 151.18, l: 145.09, c: 145.73 },
            { o: 145.73, h: 146.56, l: 139.44, c: 140 },
            { o: 140, h: 142.34, l: 139.45, c: 142.09 },
            { o: 142.09, h: 142.54, l: 138.99, c: 139.26 },
            { o: 139.26, h: 141.56, l: 138.92, c: 141 },
            { o: 141, h: 141.2, l: 138.57, c: 139 },
            { o: 139, h: 139.56, l: 138.82, c: 139.35 },
            { o: 139.35, h: 139.61, l: 138.45, c: 138.6 },
            { o: 138.6, h: 139.56, l: 138.34, c: 139.36 },
            { o: 139.36, h: 142.42, l: 138.92, c: 142 },
            { o: 142, h: 147.15, l: 141.54, c: 146.94 },
            { o: 146.94, h: 152.47, l: 146.62, c: 151.96 },
            { o: 151.96, h: 157.07, l: 151.81, c: 156.67 },
            { o: 156.67, h: 162.49, l: 156.07, c: 162 },
            { o: 162, h: 162.1, l: 161.94, c: 162.03 },
            { o: 162.03, h: 162.55, l: 158.1, c: 158.84 },
            { o: 158.84, h: 159.8, l: 158.57, c: 159.64 },
            { o: 159.64, h: 160.09, l: 156, c: 156.85 },
            { o: 156.85, h: 157.23, l: 156.6, c: 157 },
            { o: 157, h: 157.48, l: 153.9, c: 154.05 },
            { o: 154.05, h: 154.55, l: 147.17, c: 147.55 },
            { o: 147.55, h: 148.19, l: 143.31, c: 143.55 },
            { o: 143.55, h: 143.79, l: 139.96, c: 140.56 },
            { o: 140.56, h: 140.9, l: 138.95, c: 140.16 },
            { o: 140.16, h: 143.74, l: 139.68, c: 143.11 },
            { o: 143.11, h: 147.79, l: 142.55, c: 147.32 },
            { o: 147.32, h: 151.52, l: 146.59, c: 151.33 },
            { o: 151.33, h: 153.15, l: 151.09, c: 153 },
            { o: 153, h: 158.16, l: 152.23, c: 157.72 },
            { o: 157.72, h: 161.84, l: 157.55, c: 161.35 },
            { o: 161.35, h: 164.13, l: 161.05, c: 164 }
          ],
          zones: [
            { from: 5, top: 142.09, bottom: 138.34, kind: "demand", label: "Weekly demand (wide)", faded: true },
            { from: 9, top: 139.36, bottom: 138.34, kind: "demand", label: "60-min refined" }
          ],
          highlight: { from: 9, to: 11, label: "most activity" },
          reveal: 15
        }
      },
      {
        title: "A much smaller stop",
        narration: "Entry at the refined top line, stop under the refined bottom line. Same trade idea, a fraction of the risk.",
        scene: {
          candles: [
            { o: 170, h: 171.15, l: 163.84, c: 164.59 },
            { o: 164.59, h: 165.2, l: 157.54, c: 158.62 },
            { o: 158.62, h: 160.01, l: 150.02, c: 150.76 },
            { o: 150.76, h: 151.18, l: 145.09, c: 145.73 },
            { o: 145.73, h: 146.56, l: 139.44, c: 140 },
            { o: 140, h: 142.34, l: 139.45, c: 142.09 },
            { o: 142.09, h: 142.54, l: 138.99, c: 139.26 },
            { o: 139.26, h: 141.56, l: 138.92, c: 141 },
            { o: 141, h: 141.2, l: 138.57, c: 139 },
            { o: 139, h: 139.56, l: 138.82, c: 139.35 },
            { o: 139.35, h: 139.61, l: 138.45, c: 138.6 },
            { o: 138.6, h: 139.56, l: 138.34, c: 139.36 },
            { o: 139.36, h: 142.42, l: 138.92, c: 142 },
            { o: 142, h: 147.15, l: 141.54, c: 146.94 },
            { o: 146.94, h: 152.47, l: 146.62, c: 151.96 },
            { o: 151.96, h: 157.07, l: 151.81, c: 156.67 },
            { o: 156.67, h: 162.49, l: 156.07, c: 162 },
            { o: 162, h: 162.1, l: 161.94, c: 162.03 },
            { o: 162.03, h: 162.55, l: 158.1, c: 158.84 },
            { o: 158.84, h: 159.8, l: 158.57, c: 159.64 },
            { o: 159.64, h: 160.09, l: 156, c: 156.85 },
            { o: 156.85, h: 157.23, l: 156.6, c: 157 },
            { o: 157, h: 157.48, l: 153.9, c: 154.05 },
            { o: 154.05, h: 154.55, l: 147.17, c: 147.55 },
            { o: 147.55, h: 148.19, l: 143.31, c: 143.55 },
            { o: 143.55, h: 143.79, l: 139.96, c: 140.56 },
            { o: 140.56, h: 140.9, l: 138.95, c: 140.16 },
            { o: 140.16, h: 143.74, l: 139.68, c: 143.11 },
            { o: 143.11, h: 147.79, l: 142.55, c: 147.32 },
            { o: 147.32, h: 151.52, l: 146.59, c: 151.33 },
            { o: 151.33, h: 153.15, l: 151.09, c: 153 },
            { o: 153, h: 158.16, l: 152.23, c: 157.72 },
            { o: 157.72, h: 161.84, l: 157.55, c: 161.35 },
            { o: 161.35, h: 164.13, l: 161.05, c: 164 }
          ],
          zones: [
            { from: 5, top: 142.09, bottom: 138.34, kind: "demand", label: "Weekly demand (wide)", faded: true },
            { from: 9, top: 139.36, bottom: 138.34, kind: "demand", label: "60-min refined" }
          ],
          lines: [
            { y: 139.36, label: "Entry (proximal)", kind: "entry", from: 11 },
            { y: 138.09, label: "Stop below distal", kind: "sl", from: 11 }
          ],
          reveal: 26
        }
      },
      {
        title: "The turn happens there",
        narration: "Price returns and turns right inside the refined zone, where the activity was. No moving average was needed.",
        scene: {
          candles: [
            { o: 170, h: 171.15, l: 163.84, c: 164.59 },
            { o: 164.59, h: 165.2, l: 157.54, c: 158.62 },
            { o: 158.62, h: 160.01, l: 150.02, c: 150.76 },
            { o: 150.76, h: 151.18, l: 145.09, c: 145.73 },
            { o: 145.73, h: 146.56, l: 139.44, c: 140 },
            { o: 140, h: 142.34, l: 139.45, c: 142.09 },
            { o: 142.09, h: 142.54, l: 138.99, c: 139.26 },
            { o: 139.26, h: 141.56, l: 138.92, c: 141 },
            { o: 141, h: 141.2, l: 138.57, c: 139 },
            { o: 139, h: 139.56, l: 138.82, c: 139.35 },
            { o: 139.35, h: 139.61, l: 138.45, c: 138.6 },
            { o: 138.6, h: 139.56, l: 138.34, c: 139.36 },
            { o: 139.36, h: 142.42, l: 138.92, c: 142 },
            { o: 142, h: 147.15, l: 141.54, c: 146.94 },
            { o: 146.94, h: 152.47, l: 146.62, c: 151.96 },
            { o: 151.96, h: 157.07, l: 151.81, c: 156.67 },
            { o: 156.67, h: 162.49, l: 156.07, c: 162 },
            { o: 162, h: 162.1, l: 161.94, c: 162.03 },
            { o: 162.03, h: 162.55, l: 158.1, c: 158.84 },
            { o: 158.84, h: 159.8, l: 158.57, c: 159.64 },
            { o: 159.64, h: 160.09, l: 156, c: 156.85 },
            { o: 156.85, h: 157.23, l: 156.6, c: 157 },
            { o: 157, h: 157.48, l: 153.9, c: 154.05 },
            { o: 154.05, h: 154.55, l: 147.17, c: 147.55 },
            { o: 147.55, h: 148.19, l: 143.31, c: 143.55 },
            { o: 143.55, h: 143.79, l: 139.96, c: 140.56 },
            { o: 140.56, h: 140.9, l: 138.95, c: 140.16 },
            { o: 140.16, h: 143.74, l: 139.68, c: 143.11 },
            { o: 143.11, h: 147.79, l: 142.55, c: 147.32 },
            { o: 147.32, h: 151.52, l: 146.59, c: 151.33 },
            { o: 151.33, h: 153.15, l: 151.09, c: 153 },
            { o: 153, h: 158.16, l: 152.23, c: 157.72 },
            { o: 157.72, h: 161.84, l: 157.55, c: 161.35 },
            { o: 161.35, h: 164.13, l: 161.05, c: 164 }
          ],
          zones: [
            { from: 5, top: 142.09, bottom: 138.34, kind: "demand", label: "Weekly demand (wide)", faded: true },
            { from: 9, top: 139.36, bottom: 138.34, kind: "demand", label: "60-min refined" }
          ],
          lines: [
            { y: 139.36, label: "Entry (proximal)", kind: "entry", from: 11 },
            { y: 138.09, label: "Stop below distal", kind: "sl", from: 11 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "For swing trading, what is the smallest entry chart Sam recommends?",
        options: ["1-minute", "5-minute", "60-minute", "Daily only"],
        answer: 2,
        explain: "A 60-minute chart, but no smaller."
      },
      {
        type: "mcq",
        q: "What is the larger timeframe for?",
        options: [
          "Exact entry",
          "Seeing where price is on the curve, so which side to trade",
          "Indicators",
          "Nothing"
        ],
        answer: 1,
        explain: "Daily or weekly tells you whether you are near demand (buy) or supply (sell)."
      },
      {
        type: "spot",
        q: "Click the candles where most of the trading sat inside the weekly zone.",
        scene: {
          candles: [
            { o: 170, h: 171.15, l: 163.84, c: 164.59 },
            { o: 164.59, h: 165.2, l: 157.54, c: 158.62 },
            { o: 158.62, h: 160.01, l: 150.02, c: 150.76 },
            { o: 150.76, h: 151.18, l: 145.09, c: 145.73 },
            { o: 145.73, h: 146.56, l: 139.44, c: 140 },
            { o: 140, h: 142.34, l: 139.45, c: 142.09 },
            { o: 142.09, h: 142.54, l: 138.99, c: 139.26 },
            { o: 139.26, h: 141.56, l: 138.92, c: 141 },
            { o: 141, h: 141.2, l: 138.57, c: 139 },
            { o: 139, h: 139.56, l: 138.82, c: 139.35 },
            { o: 139.35, h: 139.61, l: 138.45, c: 138.6 },
            { o: 138.6, h: 139.56, l: 138.34, c: 139.36 },
            { o: 139.36, h: 142.42, l: 138.92, c: 142 },
            { o: 142, h: 147.15, l: 141.54, c: 146.94 },
            { o: 146.94, h: 152.47, l: 146.62, c: 151.96 },
            { o: 151.96, h: 157.07, l: 151.81, c: 156.67 },
            { o: 156.67, h: 162.49, l: 156.07, c: 162 },
            { o: 162, h: 162.1, l: 161.94, c: 162.03 },
            { o: 162.03, h: 162.55, l: 158.1, c: 158.84 },
            { o: 158.84, h: 159.8, l: 158.57, c: 159.64 },
            { o: 159.64, h: 160.09, l: 156, c: 156.85 },
            { o: 156.85, h: 157.23, l: 156.6, c: 157 },
            { o: 157, h: 157.48, l: 153.9, c: 154.05 },
            { o: 154.05, h: 154.55, l: 147.17, c: 147.55 },
            { o: 147.55, h: 148.19, l: 143.31, c: 143.55 },
            { o: 143.55, h: 143.79, l: 139.96, c: 140.56 },
            { o: 140.56, h: 140.9, l: 138.95, c: 140.16 },
            { o: 140.16, h: 143.74, l: 139.68, c: 143.11 },
            { o: 143.11, h: 147.79, l: 142.55, c: 147.32 },
            { o: 147.32, h: 151.52, l: 146.59, c: 151.33 },
            { o: 151.33, h: 153.15, l: 151.09, c: 153 },
            { o: 153, h: 158.16, l: 152.23, c: 157.72 },
            { o: 157.72, h: 161.84, l: 157.55, c: 161.35 },
            { o: 161.35, h: 164.13, l: 161.05, c: 164 }
          ],
          zones: [
            { from: 5, top: 142.09, bottom: 138.34, kind: "demand", label: "Weekly demand (wide)", faded: true }
          ]
        },
        answer: { from: 9, to: 11 },
        explain: "The tight base inside the wide zone. That is where the turn is likely."
      },
      {
        type: "tf",
        q: "Swing trading needs a totally different analysis than day trading.",
        answer: false,
        explain: "Same larger/smaller timeframe idea, only slower and done while the market is closed."
      },
      {
        type: "mcq",
        q: "What is the \"best\" moving average for swing trading, per Sam?",
        options: ["The 50", "The 200", "Moving averages are not part of his answer", "The 20"],
        answer: 2,
        explain: "The levels decide, not a moving average."
      }
    ],
    practice: [
      {
        prompt: "Draw the refined 60-minute demand inside this wide weekly zone: wrap the tight base (top = highest body, bottom = lowest wick).",
        scene: {
          candles: [
            { o: 172, h: 172.49, l: 163.32, c: 164.78 },
            { o: 164.78, h: 166.12, l: 155.7, c: 156.46 },
            { o: 156.46, h: 157.85, l: 146.09, c: 147.01 },
            { o: 147.01, h: 147.54, l: 137.56, c: 139.08 },
            { o: 139.08, h: 140.05, l: 131.42, c: 132 },
            { o: 132, h: 133.76, l: 131.45, c: 133.6 },
            { o: 133.6, h: 134.41, l: 130.31, c: 131.1 },
            { o: 131.1, h: 133.28, l: 130.67, c: 133 },
            { o: 133, h: 133.32, l: 130.87, c: 131 },
            { o: 131, h: 131.61, l: 130.78, c: 131.42 },
            { o: 131.42, h: 131.61, l: 130.55, c: 130.74 },
            { o: 130.74, h: 131.68, l: 130.5, c: 131.41 },
            { o: 131.41, h: 134.51, l: 131.07, c: 134 },
            { o: 134, h: 139.23, l: 133.72, c: 138.71 },
            { o: 138.71, h: 143.82, l: 138.18, c: 143.65 },
            { o: 143.65, h: 148.79, l: 143.45, c: 148.34 },
            { o: 148.34, h: 154.63, l: 147.7, c: 154 },
            { o: 154, h: 154.18, l: 153.7, c: 153.9 },
            { o: 153.9, h: 154.68, l: 150.58, c: 151.01 },
            { o: 151.01, h: 151.76, l: 150.84, c: 151.7 },
            { o: 151.7, h: 152.09, l: 148.03, c: 148.95 },
            { o: 148.95, h: 149.14, l: 148.86, c: 149 },
            { o: 149, h: 149.67, l: 145.16, c: 145.34 },
            { o: 145.34, h: 146.12, l: 140.81, c: 141.28 },
            { o: 141.28, h: 141.56, l: 136.26, c: 136.95 },
            { o: 136.95, h: 137.56, l: 132.25, c: 132.62 },
            { o: 132.62, h: 132.97, l: 131.05, c: 132.22 },
            { o: 132.22, h: 137.57, l: 131.83, c: 137.12 },
            { o: 137.12, h: 140.84, l: 136.85, c: 140.5 },
            { o: 140.5, h: 145.39, l: 140.09, c: 144.7 },
            { o: 144.7, h: 147.18, l: 144.28, c: 146.89 },
            { o: 146.89, h: 151.61, l: 146.55, c: 151.29 },
            { o: 151.29, h: 155.39, l: 150.65, c: 155 }
          ],
          zones: [
            { from: 5, top: 134, bottom: 130.31, kind: "demand", label: "Weekly demand", faded: true }
          ],
          reveal: 26
        },
        task: "draw-zone",
        answer: { top: 131.42, bottom: 130.5 },
        explain: "The tight base inside the weekly zone is where most activity sat. Price turned right there, and the stop was a fraction of the weekly one."
      }
    ],
    cards: [
      { front: "Swing timeframes?", back: "Daily or weekly for direction; 60-minute (no smaller) for entry." },
      { front: "Why refine on the 60-minute?", back: "To shrink the stop inside the bigger zone." },
      { front: "Where is the turn likely inside a zone?", back: "Where most of the trading activity sat." },
      { front: "The basics never...?", back: "Die." }
    ],
    mnemonic: "Country map for the side, street map for the house."
  },
  {
    mentor: "seiden",
    n: 264,
    eli5: {
      oneLiner: "Think differently from the crowd and carry strong old levels forward.",
      story: "A trading edge has two parts: a clear, calm mind, and a rule-based plan. In late 2009 the S&P kept making new highs, and each new high pushed into a supply level from October 2008, where the crash had started. Everyone was bullish on the good news, and no other advisory service was watching that level. Sam's members sold each breakout to new highs, and each one turned lower.",
      analogy: "It is like knowing about a hidden speed bump that is not on anyone's map. Everyone else drives fast; you slow down and wait on the other side."
    },
    bigIdeas: [
      "Edge = mental (reality-based thinking, self-control, focus) + strategic (a rule-based plan).",
      "Carry strong levels forward until price returns, even more than a year later.",
      "Sell breakouts to new highs inside a known supply. A bullish crowd and nobody else watching the level add odds."
    ],
    steps: [
      {
        title: "The origin of a crash",
        narration: "A rally, a small base and a collapse. Supply far exceeded demand. Draw it and carry it forward to the right.",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ],
          reveal: 11
        }
      },
      {
        title: "A long way back",
        narration: "Price spends a long time below and then climbs back. The good news grows and the crowd turns bullish.",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ],
          reveal: 24
        }
      },
      {
        title: "Breakouts into the band",
        narration: "Each push to a new high runs into the old supply. Breakout buyers buy after a rally and into supply. Sam's line: bearish and a seller on breakouts to new highs within this supply.",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ],
          notes: [
            { x: 24, y: 162.32, text: "new high 1" },
            { x: 29, y: 162.32, text: "new high 2" },
            { x: 34, y: 162.32, text: "new high 3" }
          ],
          reveal: 35
        }
      },
      {
        title: "Each poke turns lower",
        narration: "One after another, the new highs fail inside the band and price drops.",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ],
          notes: [
            { x: 24, y: 162.32, text: "new high 1" },
            { x: 29, y: 162.32, text: "new high 2" },
            { x: 34, y: 162.32, text: "new high 3" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Which are the two parts of a competitive edge?",
        options: ["Speed and size", "Mental and strategic", "News and indicators", "Luck and capital"],
        answer: 1,
        explain: "Reality-based thinking and self-control, plus a rule-based strategy."
      },
      {
        type: "tf",
        q: "A supply level from more than a year ago is too old to matter.",
        answer: false,
        explain: "If price left fast and never returned, the sell orders are still there. Carry it forward."
      },
      {
        type: "spot",
        q: "Click the first breakout to a new high inside supply.",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ]
        },
        answer: { from: 24, to: 24 },
        explain: "The first poke into the old band. A short to the breakout buyers."
      },
      {
        type: "mcq",
        q: "Why was it good that no other advisory service pointed out the level?",
        options: [
          "It was not",
          "More buyers to sell to and less competition for the fills",
          "It means the level is fake",
          "It does not matter"
        ],
        answer: 1,
        explain: "When we sell short, we want many to buy."
      },
      {
        type: "order",
        q: "Order Sam's three factors.",
        items: [
          "The level is the origin of a strong decline",
          "Breakout buyers are trapped into it",
          "Nobody else is watching it"
        ],
        explain: "Strong origin, trapped buyers, no crowding."
      }
    ],
    practice: [
      {
        prompt: "Price is making a new high, pushing into supply that started a crash long ago. News is great and everyone is bullish. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 122, h: 130.36, l: 121.23, c: 129 },
            { o: 129, h: 139.92, l: 128.21, c: 137.96 },
            { o: 137.96, h: 144.62, l: 137.36, c: 143.49 },
            { o: 143.49, h: 152.41, l: 142.73, c: 151.07 },
            { o: 151.07, h: 160.77, l: 149.38, c: 160 },
            { o: 160, h: 160.82, l: 159.83, c: 160.5 },
            { o: 160.5, h: 160.69, l: 159.31, c: 159.66 },
            { o: 159.66, h: 159.94, l: 150.21, c: 150.46 },
            { o: 150.46, h: 151.3, l: 141.41, c: 142.37 },
            { o: 142.37, h: 142.92, l: 133.8, c: 134.66 },
            { o: 134.66, h: 135.22, l: 125.31, c: 126 },
            { o: 126, h: 128.93, l: 125.34, c: 128.46 },
            { o: 128.46, h: 128.67, l: 127.85, c: 128.07 },
            { o: 128.07, h: 133.32, l: 127.43, c: 132.45 },
            { o: 132.45, h: 132.58, l: 131.22, c: 131.37 },
            { o: 131.37, h: 136.74, l: 129.99, c: 135.57 },
            { o: 135.57, h: 136.21, l: 135.4, c: 136 },
            { o: 136, h: 138.39, l: 135.81, c: 138.12 },
            { o: 138.12, h: 141.58, l: 137.84, c: 141.14 },
            { o: 141.14, h: 145.11, l: 140.32, c: 144.92 },
            { o: 144.92, h: 147.59, l: 144.69, c: 147.16 },
            { o: 147.16, h: 150.37, l: 146.91, c: 150 },
            { o: 150, h: 153.71, l: 149.61, c: 153.25 },
            { o: 153.25, h: 159.99, l: 152.77, c: 159.06 },
            { o: 159.06, h: 160.07, l: 158.13, c: 158.66 },
            { o: 158.66, h: 159.16, l: 155.89, c: 156.26 },
            { o: 156.26, h: 156.46, l: 154.36, c: 154.66 },
            { o: 154.66, h: 157.35, l: 154.41, c: 157.1 },
            { o: 157.1, h: 159.37, l: 156.98, c: 159.26 },
            { o: 159.26, h: 160.3, l: 158.4, c: 158.66 },
            { o: 158.66, h: 158.91, l: 156.01, c: 156.46 },
            { o: 156.46, h: 156.83, l: 153.11, c: 153.66 },
            { o: 153.66, h: 157.29, l: 153.37, c: 156.78 },
            { o: 156.78, h: 159.58, l: 156.4, c: 159.36 },
            { o: 159.36, h: 160.47, l: 158.18, c: 158.66 },
            { o: 158.66, h: 159.1, l: 156.17, c: 156.34 },
            { o: 156.34, h: 156.63, l: 154.82, c: 155.01 },
            { o: 155.01, h: 155.18, l: 152.28, c: 152.45 },
            { o: 152.45, h: 152.58, l: 150.41, c: 150.66 }
          ],
          zones: [
            { from: 5, top: 160.82, bottom: 159.66, kind: "supply", label: "Old supply (carried forward)" }
          ],
          notes: [
            { x: 24, y: 162.32, text: "new high 1" },
            { x: 29, y: 162.32, text: "new high 2" }
          ],
          reveal: 34
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Breakout to a new high inside a carried-forward supply: sell to the breakout buyers. Price turned lower again."
      }
    ],
    cards: [
      { front: "Mental edge?", back: "Reality-based thinking, self-control, focus." },
      { front: "Strategic edge?", back: "A rule-based plan." },
      {
        front: "Sam's stance at old supply?",
        back: "Bearish and a seller on breakouts to new highs within the level."
      },
      { front: "When we sell short, we want...?", back: "Many to buy." }
    ],
    mnemonic: "Old wall, new high, sell the sky."
  },
  {
    mentor: "seiden",
    n: 267,
    eli5: {
      oneLiner: "Levels help you trade, and also show when to buy fuel or lock loans.",
      story: "The class shorted crude oil at supply and took profit at demand far below, making over 12 points. That demand was also a good place for some members to buy. Sam said families could fill their tanks when oil reaches demand, and airlines could lock in cheap fuel there. With bond futures, a fall from supply means interest rates are about to rise, which matters if you are about to take a home loan.",
      analogy: "It is like a farmer reading the sky: the same clouds tell you when to plant and when to bring the washing in."
    },
    bigIdeas: [
      "The opposing level is both the target of one trade and the entry of the next.",
      "A novice gap into supply that sits high on the larger curve adds odds to the short.",
      "Use the same levels for life: fuel buying, hedging, timing a mortgage. Bond price and yield move opposite."
    ],
    steps: [
      {
        title: "Map the whole move first",
        narration: "Demand below, supply above. The trade is mapped before entering: short supply, target demand.",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" },
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" }
          ],
          reveal: 21
        }
      },
      {
        title: "Short at supply",
        narration: "Price rallies into supply. Sell with a stop above; the demand far below is the target. A large margin makes it worth taking.",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" },
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" }
          ],
          lines: [
            { y: 165.8, label: "Entry (proximal)", kind: "entry", from: 14 },
            { y: 166.71, label: "Stop above distal", kind: "sl", from: 14 },
            { y: 140.44, label: "Target: opposing level", kind: "tp", from: 14 }
          ],
          reveal: 22
        }
      },
      {
        title: "Target hit = new opportunity",
        narration: "Price falls to demand. The short is covered, and the same level is a fresh buy: for traders, and for anyone who needs fuel.",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" },
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" }
          ],
          lines: [
            { y: 165.8, label: "Entry (proximal)", kind: "entry", from: 14 },
            { y: 166.71, label: "Stop above distal", kind: "sl", from: 14 },
            { y: 140.44, label: "Target: opposing level", kind: "tp", from: 14 }
          ],
          highlight: { from: 29, to: 29, label: "cover + buy" },
          reveal: 30
        }
      },
      {
        title: "Real life benefits",
        narration: "Price bounces from demand. Someone who filled up or hedged there paid the low price while others paid more.",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" },
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" }
          ],
          lines: [
            { y: 140.44, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 139.04, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "In bond futures, when price falls from supply, interest rates tend to rise.",
        answer: true,
        explain: "Price and yield are inversely related."
      },
      {
        type: "mcq",
        q: "Crude reaches demand at $68. What could an airline do?",
        options: [
          "Sell its planes",
          "Buy crude futures as a hedge, locking about $68 fuel",
          "Wait for $80",
          "Nothing"
        ],
        answer: 1,
        explain: "Hedging at demand is like flying at $68 while competitors pay more."
      },
      {
        type: "spot",
        q: "Click the candle where the short is covered and a new buy begins.",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" },
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" }
          ]
        },
        answer: { from: 29, to: 29 },
        explain: "The touch of demand: target of the short, entry of the long."
      },
      {
        type: "mcq",
        q: "What adds odds to the 10-year note short?",
        options: [
          "An MA cross",
          "A novice gap up into supply high on the larger curve",
          "A rising RSI",
          "Good news"
        ],
        answer: 1,
        explain: "The gap into the level showed novice buying, and the level sat high on the curve."
      }
    ],
    practice: [
      {
        prompt: "Your short from supply has just reached the demand target. Price is touching demand now. Cover and buy, sell more, or do nothing?",
        scene: {
          candles: [
            { o: 122, h: 125.85, l: 121.73, c: 125.27 },
            { o: 125.27, h: 128.75, l: 124.75, c: 128.27 },
            { o: 128.27, h: 132.98, l: 127.72, c: 132.72 },
            { o: 132.72, h: 137.28, l: 132.41, c: 136.89 },
            { o: 136.89, h: 140.2, l: 136.89, c: 140 },
            { o: 140, h: 140.48, l: 139.7, c: 140.24 },
            { o: 140.24, h: 140.43, l: 139.29, c: 139.61 },
            { o: 139.61, h: 140.73, l: 139.31, c: 140.44 },
            { o: 140.44, h: 145.49, l: 140.05, c: 145.34 },
            { o: 145.34, h: 150.7, l: 145.17, c: 150.45 },
            { o: 150.45, h: 156.45, l: 149.88, c: 155.98 },
            { o: 155.98, h: 160.48, l: 155.55, c: 159.99 },
            { o: 159.99, h: 166.84, l: 159.59, c: 166 },
            { o: 166, h: 166.46, l: 165.7, c: 166.24 },
            { o: 166.24, h: 166.38, l: 165.48, c: 165.8 },
            { o: 165.8, h: 166.22, l: 161.13, c: 161.6 },
            { o: 161.6, h: 162.18, l: 155.77, c: 156.39 },
            { o: 156.39, h: 156.5, l: 151.82, c: 152 },
            { o: 152, h: 157.32, l: 151.7, c: 157.04 },
            { o: 157.04, h: 161.75, l: 156.36, c: 161.45 },
            { o: 161.45, h: 165.23, l: 160.74, c: 165 },
            { o: 165, h: 166.2, l: 164.32, c: 164.8 },
            { o: 164.8, h: 165.6, l: 160.44, c: 160.64 },
            { o: 160.64, h: 160.95, l: 158.57, c: 158.73 },
            { o: 158.73, h: 159.08, l: 154.15, c: 154.73 },
            { o: 154.73, h: 155.13, l: 150.57, c: 151.12 },
            { o: 151.12, h: 151.37, l: 147.65, c: 148.27 },
            { o: 148.27, h: 149.01, l: 143.1, c: 143.78 },
            { o: 143.78, h: 143.95, l: 140.87, c: 141.24 },
            { o: 141.24, h: 141.6, l: 140.04, c: 141.34 },
            { o: 141.34, h: 144.68, l: 141.14, c: 144.17 },
            { o: 144.17, h: 146.63, l: 143.71, c: 146.49 },
            { o: 146.49, h: 149.51, l: 146.13, c: 149.09 },
            { o: 149.09, h: 151.69, l: 148.61, c: 151.47 },
            { o: 151.47, h: 154.18, l: 151.12, c: 154 }
          ],
          zones: [
            { from: 5, top: 140.44, bottom: 139.29, kind: "demand", label: "Demand: target and buy" },
            { from: 13, top: 166.46, bottom: 165.8, kind: "supply", label: "Supply: short" }
          ],
          reveal: 29
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "The target of the short is also a fresh buy. Price bounced from demand."
      }
    ],
    cards: [
      { front: "Demand target of a short is also...?", back: "An entry for a long." },
      { front: "Bond price vs yield?", back: "Inverse: price falls, rates rise." },
      { front: "Everyday use of crude demand?", back: "Fill the tank (or hedge fuel) when crude reaches demand." },
      { front: "Crude short result?", back: "Over 12 points, from supply to the demand near $68." }
    ],
    mnemonic: "One map, many trips: trade it, fill up, lock your rate."
  },
  {
    mentor: "seiden",
    n: 271,
    eli5: {
      oneLiner: "Find the fast move first, then go back to where it started.",
      story: "Learn the buttons of your trading platform from books. But learn speculating from basic supply and demand: spotting wholesale and retail prices on a chart. To find a quality level, first search for momentum, a fast strong move. Then go to the origin of that move. If price left a level slowly, the imbalance there was small; if it shot away, the imbalance was big.",
      analogy: "If you see a crowd of people sprinting down a street, look where they came from. Something big happened there."
    },
    bigIdeas: [
      "Books for mechanics; Economics 101 for speculation. Learn to see wholesale vs retail on a chart.",
      "Find momentum first, then mark its origin. Grade the level by how strongly price left it.",
      "A level cannot sit in the middle of a move, and repeated tests weaken it. Moving averages are only secondary."
    ],
    steps: [
      {
        title: "A slow drift: weak",
        narration: "Price based for a long time and drifted away slowly. A gradual departure means only a small imbalance. Skip it.",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true }
          ],
          reveal: 14
        }
      },
      {
        title: "Search for momentum",
        narration: "Here price shoots up with big candles. That is momentum. Now look back to where it started.",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true }
          ],
          highlight: { from: 20, to: 22, label: "momentum" },
          reveal: 23
        }
      },
      {
        title: "Mark the origin",
        narration: "The small base before the momentum is the level. It is the origin, not the middle of a move, and it is untested.",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true },
            { from: 18, top: 136.26, bottom: 135.48, kind: "demand", label: "Momentum origin" }
          ],
          highlight: { from: 18, to: 19, label: "origin" },
          reveal: 30
        }
      },
      {
        title: "Trade only if it meets your reward minimum",
        narration: "There is plenty of room back up to the high, so it qualifies. Price returns and rallies. Trend was a distant consideration.",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true },
            { from: 18, top: 136.26, bottom: 135.48, kind: "demand", label: "Momentum origin" }
          ],
          lines: [
            { y: 136.26, label: "Entry (proximal)", kind: "entry", from: 19 },
            { y: 135.23, label: "Stop below distal", kind: "sl", from: 19 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order Sam's way to find a quality level.",
        items: [
          "Search for a period of momentum",
          "Go to the origin of that momentum",
          "Grade how strongly price left it",
          "Check it meets your reward minimum"
        ],
        explain: "Momentum first, then its origin."
      },
      {
        type: "spot",
        q: "Click the candles that show momentum.",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true },
            { from: 18, top: 136.26, bottom: 135.48, kind: "demand", label: "Momentum origin" }
          ]
        },
        answer: { from: 20, to: 22 },
        explain: "The big candles shooting away. Their origin is the level."
      },
      {
        type: "tf",
        q: "A level that price drifted away from slowly is as good as one it shot away from.",
        answer: false,
        explain: "Gradual departures mean a small imbalance."
      },
      {
        type: "mcq",
        q: "How does Sam treat a 50-day moving average?",
        options: [
          "As the main trend tool",
          "Only as a secondary tool",
          "As an entry trigger",
          "He ignores price"
        ],
        answer: 1,
        explain: "Trends start and end at larger-timeframe levels, so those matter more."
      },
      {
        type: "mcq",
        q: "Where should you learn platform mechanics?",
        options: ["From books and manuals", "From Economics 101", "From indicators", "From news"],
        answer: 0,
        explain: "Mechanics from books; speculation from basic supply and demand."
      }
    ],
    practice: [
      {
        prompt: "Price is returning to the base that launched the big momentum move. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 166, h: 166.59, l: 162.16, c: 162.36 },
            { o: 162.36, h: 162.79, l: 157.81, c: 158.14 },
            { o: 158.14, h: 158.55, l: 152.67, c: 153.34 },
            { o: 153.34, h: 153.66, l: 149.36, c: 150 },
            { o: 150, h: 150.78, l: 149.51, c: 150.28 },
            { o: 150.28, h: 150.51, l: 149.21, c: 149.49 },
            { o: 149.49, h: 150.94, l: 149.06, c: 150.67 },
            { o: 150.67, h: 150.97, l: 149.05, c: 149.39 },
            { o: 149.39, h: 150.57, l: 148.91, c: 150.33 },
            { o: 150.33, h: 152.37, l: 150.17, c: 151.9 },
            { o: 151.9, h: 152.09, l: 150.6, c: 150.74 },
            { o: 150.74, h: 154.4, l: 150.05, c: 153.55 },
            { o: 153.55, h: 153.86, l: 152.41, c: 152.58 },
            { o: 152.58, h: 154.27, l: 152.4, c: 154 },
            { o: 154, h: 154.9, l: 149.31, c: 149.82 },
            { o: 149.82, h: 150.87, l: 143.12, c: 144.25 },
            { o: 144.25, h: 144.67, l: 139.3, c: 140.18 },
            { o: 140.18, h: 140.77, l: 135.74, c: 136 },
            { o: 136, h: 136.48, l: 135.72, c: 136.26 },
            { o: 136.26, h: 136.41, l: 135.48, c: 135.63 },
            { o: 135.63, h: 144.99, l: 135.31, c: 144.18 },
            { o: 144.18, h: 152.19, l: 144.02, c: 151.78 },
            { o: 151.78, h: 160.6, l: 151, c: 160 },
            { o: 160, h: 161.04, l: 159.67, c: 160.64 },
            { o: 160.64, h: 160.91, l: 159.41, c: 159.61 },
            { o: 159.61, h: 160.6, l: 153.44, c: 154.49 },
            { o: 154.49, h: 155.14, l: 150.01, c: 150.43 },
            { o: 150.43, h: 150.68, l: 146.61, c: 147.23 },
            { o: 147.23, h: 147.97, l: 141.24, c: 141.51 },
            { o: 141.51, h: 142.01, l: 136.96, c: 137.46 },
            { o: 137.46, h: 137.86, l: 135.95, c: 137.06 },
            { o: 137.06, h: 142.07, l: 136.36, c: 141.18 },
            { o: 141.18, h: 145.18, l: 140.55, c: 144.87 },
            { o: 144.87, h: 150.2, l: 144.58, c: 149.88 },
            { o: 149.88, h: 154.01, l: 149.14, c: 153.67 },
            { o: 153.67, h: 157.25, l: 153.5, c: 156.77 },
            { o: 156.77, h: 162.49, l: 156.44, c: 162 }
          ],
          zones: [
            { from: 18, top: 136.26, bottom: 135.48, kind: "demand", label: "Momentum origin" },
            { from: 4, top: 150.67, bottom: 148.91, kind: "demand", label: "Slow drift away", faded: true }
          ],
          reveal: 30
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "A momentum origin with a strong departure and lots of room: buy. Price rallied."
      }
    ],
    cards: [
      { front: "Where to learn speculation?", back: "Economics 101 supply and demand, not pattern books." },
      { front: "First step to find a level?", back: "Search for momentum, then go to its origin." },
      { front: "Gradual departure means?", back: "A small imbalance." },
      { front: "Two old criteria for levels?", back: "Not in the middle of a move; repeated tests weaken it." }
    ],
    mnemonic: "See the sprint, find the start."
  },
  {
    mentor: "seiden",
    n: 274,
    eli5: {
      oneLiner: "Measure it: the first move away must be three times the zone.",
      story: "Many students can name drop-base-rally, but never say exactly what counts as a level. Sam's rule uses numbers. The zone height is the distance from the entry line to the stop. The first rally away from the zone must be at least three times that height, or he ignores the level. A 2-point zone needs a rally of at least 6 points.",
      analogy: "It is like a high-jump bar. If the jump does not clear three times the height, it does not count."
    },
    bigIdeas: [
      "Write numeric definitions of supply and demand into your plan; that is part of an edge.",
      "The initial move away must be at least 3x the zone height (1:3), or skip the level. You may demand 1:4.",
      "Enter at the proximal line, stop beyond the distal line. T1 does not have to be the top of that rally."
    ],
    steps: [
      {
        title: "Measure the zone",
        narration: "Box the base. The zone height, entry to stop, is about 1.2 points.",
        scene: {
          candles: [
            { o: 160, h: 160.85, l: 152.97, c: 154.17 },
            { o: 154.17, h: 155.95, l: 144.67, c: 146.01 },
            { o: 146.01, h: 146.43, l: 141.83, c: 142.39 },
            { o: 142.39, h: 143.42, l: 131.11, c: 132.96 },
            { o: 132.96, h: 133.74, l: 127.45, c: 128 },
            { o: 128, h: 128.76, l: 127.69, c: 128.44 },
            { o: 128.44, h: 128.62, l: 127.24, c: 127.5 },
            { o: 127.5, h: 128.72, l: 127.35, c: 128.38 },
            { o: 128.38, h: 133.5, l: 128.15, c: 133.22 },
            { o: 133.22, h: 137.31, l: 133.05, c: 137.03 },
            { o: 137.03, h: 142.41, l: 136.55, c: 142.18 },
            { o: 142.18, h: 146.21, l: 141.76, c: 146 },
            { o: 146, h: 146.14, l: 145.81, c: 145.96 },
            { o: 145.96, h: 146.5, l: 142.29, c: 143.04 },
            { o: 143.04, h: 144.33, l: 142.96, c: 144.02 },
            { o: 144.02, h: 144.9, l: 140.29, c: 141.19 },
            { o: 141.19, h: 142.18, l: 140.92, c: 141.95 },
            { o: 141.95, h: 142.14, l: 139.85, c: 140 },
            { o: 140, h: 140.19, l: 136.19, c: 136.75 },
            { o: 136.75, h: 136.98, l: 134.25, c: 134.68 },
            { o: 134.68, h: 135.15, l: 132.17, c: 132.52 },
            { o: 132.52, h: 133.07, l: 129.71, c: 129.84 },
            { o: 129.84, h: 130.09, l: 127.96, c: 129.24 },
            { o: 129.24, h: 130.79, l: 129.15, c: 130.72 },
            { o: 130.72, h: 132.47, l: 130.68, c: 132.31 },
            { o: 132.31, h: 134.33, l: 132.11, c: 134.13 },
            { o: 134.13, h: 136.44, l: 134.02, c: 136.28 },
            { o: 136.28, h: 138.21, l: 136.12, c: 138.01 },
            { o: 138.01, h: 140.1, l: 137.94, c: 140 }
          ],
          zones: [
            { from: 5, top: 128.44, bottom: 127.24, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 5, to: 7, label: "height 1.2" },
          reveal: 12
        }
      },
      {
        title: "Measure the initial rally",
        narration: "The first rally runs about 17.77 points above the zone top: far more than 3 x 1.2. The level qualifies.",
        scene: {
          candles: [
            { o: 160, h: 160.85, l: 152.97, c: 154.17 },
            { o: 154.17, h: 155.95, l: 144.67, c: 146.01 },
            { o: 146.01, h: 146.43, l: 141.83, c: 142.39 },
            { o: 142.39, h: 143.42, l: 131.11, c: 132.96 },
            { o: 132.96, h: 133.74, l: 127.45, c: 128 },
            { o: 128, h: 128.76, l: 127.69, c: 128.44 },
            { o: 128.44, h: 128.62, l: 127.24, c: 127.5 },
            { o: 127.5, h: 128.72, l: 127.35, c: 128.38 },
            { o: 128.38, h: 133.5, l: 128.15, c: 133.22 },
            { o: 133.22, h: 137.31, l: 133.05, c: 137.03 },
            { o: 137.03, h: 142.41, l: 136.55, c: 142.18 },
            { o: 142.18, h: 146.21, l: 141.76, c: 146 },
            { o: 146, h: 146.14, l: 145.81, c: 145.96 },
            { o: 145.96, h: 146.5, l: 142.29, c: 143.04 },
            { o: 143.04, h: 144.33, l: 142.96, c: 144.02 },
            { o: 144.02, h: 144.9, l: 140.29, c: 141.19 },
            { o: 141.19, h: 142.18, l: 140.92, c: 141.95 },
            { o: 141.95, h: 142.14, l: 139.85, c: 140 },
            { o: 140, h: 140.19, l: 136.19, c: 136.75 },
            { o: 136.75, h: 136.98, l: 134.25, c: 134.68 },
            { o: 134.68, h: 135.15, l: 132.17, c: 132.52 },
            { o: 132.52, h: 133.07, l: 129.71, c: 129.84 },
            { o: 129.84, h: 130.09, l: 127.96, c: 129.24 },
            { o: 129.24, h: 130.79, l: 129.15, c: 130.72 },
            { o: 130.72, h: 132.47, l: 130.68, c: 132.31 },
            { o: 132.31, h: 134.33, l: 132.11, c: 134.13 },
            { o: 134.13, h: 136.44, l: 134.02, c: 136.28 },
            { o: 136.28, h: 138.21, l: 136.12, c: 138.01 },
            { o: 138.01, h: 140.1, l: 137.94, c: 140 }
          ],
          zones: [
            { from: 5, top: 128.44, bottom: 127.24, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 8, to: 11, label: "rally 17.77" },
          reveal: 13
        }
      },
      {
        title: "Why it raises probability",
        narration: "The rally shows no big supply until its top, so there is a big profit margin. Price is also far from balance there.",
        scene: {
          candles: [
            { o: 160, h: 160.85, l: 152.97, c: 154.17 },
            { o: 154.17, h: 155.95, l: 144.67, c: 146.01 },
            { o: 146.01, h: 146.43, l: 141.83, c: 142.39 },
            { o: 142.39, h: 143.42, l: 131.11, c: 132.96 },
            { o: 132.96, h: 133.74, l: 127.45, c: 128 },
            { o: 128, h: 128.76, l: 127.69, c: 128.44 },
            { o: 128.44, h: 128.62, l: 127.24, c: 127.5 },
            { o: 127.5, h: 128.72, l: 127.35, c: 128.38 },
            { o: 128.38, h: 133.5, l: 128.15, c: 133.22 },
            { o: 133.22, h: 137.31, l: 133.05, c: 137.03 },
            { o: 137.03, h: 142.41, l: 136.55, c: 142.18 },
            { o: 142.18, h: 146.21, l: 141.76, c: 146 },
            { o: 146, h: 146.14, l: 145.81, c: 145.96 },
            { o: 145.96, h: 146.5, l: 142.29, c: 143.04 },
            { o: 143.04, h: 144.33, l: 142.96, c: 144.02 },
            { o: 144.02, h: 144.9, l: 140.29, c: 141.19 },
            { o: 141.19, h: 142.18, l: 140.92, c: 141.95 },
            { o: 141.95, h: 142.14, l: 139.85, c: 140 },
            { o: 140, h: 140.19, l: 136.19, c: 136.75 },
            { o: 136.75, h: 136.98, l: 134.25, c: 134.68 },
            { o: 134.68, h: 135.15, l: 132.17, c: 132.52 },
            { o: 132.52, h: 133.07, l: 129.71, c: 129.84 },
            { o: 129.84, h: 130.09, l: 127.96, c: 129.24 },
            { o: 129.24, h: 130.79, l: 129.15, c: 130.72 },
            { o: 130.72, h: 132.47, l: 130.68, c: 132.31 },
            { o: 132.31, h: 134.33, l: 132.11, c: 134.13 },
            { o: 134.13, h: 136.44, l: 134.02, c: 136.28 },
            { o: 136.28, h: 138.21, l: 136.12, c: 138.01 },
            { o: 138.01, h: 140.1, l: 137.94, c: 140 }
          ],
          zones: [
            { from: 5, top: 128.44, bottom: 127.24, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 128.44, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 126.99, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 140, label: "T1 (inside the margin)", kind: "tp", from: 7 }
          ],
          reveal: 22
        }
      },
      {
        title: "The trade",
        narration: "Price returns, the long fills at the top line, and it reaches T1. T1 was a pivot inside the margin, not the very top.",
        scene: {
          candles: [
            { o: 160, h: 160.85, l: 152.97, c: 154.17 },
            { o: 154.17, h: 155.95, l: 144.67, c: 146.01 },
            { o: 146.01, h: 146.43, l: 141.83, c: 142.39 },
            { o: 142.39, h: 143.42, l: 131.11, c: 132.96 },
            { o: 132.96, h: 133.74, l: 127.45, c: 128 },
            { o: 128, h: 128.76, l: 127.69, c: 128.44 },
            { o: 128.44, h: 128.62, l: 127.24, c: 127.5 },
            { o: 127.5, h: 128.72, l: 127.35, c: 128.38 },
            { o: 128.38, h: 133.5, l: 128.15, c: 133.22 },
            { o: 133.22, h: 137.31, l: 133.05, c: 137.03 },
            { o: 137.03, h: 142.41, l: 136.55, c: 142.18 },
            { o: 142.18, h: 146.21, l: 141.76, c: 146 },
            { o: 146, h: 146.14, l: 145.81, c: 145.96 },
            { o: 145.96, h: 146.5, l: 142.29, c: 143.04 },
            { o: 143.04, h: 144.33, l: 142.96, c: 144.02 },
            { o: 144.02, h: 144.9, l: 140.29, c: 141.19 },
            { o: 141.19, h: 142.18, l: 140.92, c: 141.95 },
            { o: 141.95, h: 142.14, l: 139.85, c: 140 },
            { o: 140, h: 140.19, l: 136.19, c: 136.75 },
            { o: 136.75, h: 136.98, l: 134.25, c: 134.68 },
            { o: 134.68, h: 135.15, l: 132.17, c: 132.52 },
            { o: 132.52, h: 133.07, l: 129.71, c: 129.84 },
            { o: 129.84, h: 130.09, l: 127.96, c: 129.24 },
            { o: 129.24, h: 130.79, l: 129.15, c: 130.72 },
            { o: 130.72, h: 132.47, l: 130.68, c: 132.31 },
            { o: 132.31, h: 134.33, l: 132.11, c: 134.13 },
            { o: 134.13, h: 136.44, l: 134.02, c: 136.28 },
            { o: 136.28, h: 138.21, l: 136.12, c: 138.01 },
            { o: 138.01, h: 140.1, l: 137.94, c: 140 }
          ],
          zones: [
            { from: 5, top: 128.44, bottom: 127.24, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 128.44, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 126.99, label: "Stop below distal", kind: "sl", from: 7 },
            { y: 140, label: "T1 (inside the margin)", kind: "tp", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "A demand zone is 2 points tall. How big must the initial rally be?",
        options: ["2 points", "4 points", "At least 6 points", "Any size"],
        answer: 2,
        explain: "1:3 rule: at least three times the zone height."
      },
      {
        type: "tf",
        q: "T1 must always be the top of the initial rally.",
        answer: false,
        explain: "T1 can sit inside that margin, for example at a prior pivot."
      },
      {
        type: "spot",
        q: "Click the initial rally you must measure.",
        scene: {
          candles: [
            { o: 160, h: 160.85, l: 152.97, c: 154.17 },
            { o: 154.17, h: 155.95, l: 144.67, c: 146.01 },
            { o: 146.01, h: 146.43, l: 141.83, c: 142.39 },
            { o: 142.39, h: 143.42, l: 131.11, c: 132.96 },
            { o: 132.96, h: 133.74, l: 127.45, c: 128 },
            { o: 128, h: 128.76, l: 127.69, c: 128.44 },
            { o: 128.44, h: 128.62, l: 127.24, c: 127.5 },
            { o: 127.5, h: 128.72, l: 127.35, c: 128.38 },
            { o: 128.38, h: 133.5, l: 128.15, c: 133.22 },
            { o: 133.22, h: 137.31, l: 133.05, c: 137.03 },
            { o: 137.03, h: 142.41, l: 136.55, c: 142.18 },
            { o: 142.18, h: 146.21, l: 141.76, c: 146 },
            { o: 146, h: 146.14, l: 145.81, c: 145.96 },
            { o: 145.96, h: 146.5, l: 142.29, c: 143.04 },
            { o: 143.04, h: 144.33, l: 142.96, c: 144.02 },
            { o: 144.02, h: 144.9, l: 140.29, c: 141.19 },
            { o: 141.19, h: 142.18, l: 140.92, c: 141.95 },
            { o: 141.95, h: 142.14, l: 139.85, c: 140 },
            { o: 140, h: 140.19, l: 136.19, c: 136.75 },
            { o: 136.75, h: 136.98, l: 134.25, c: 134.68 },
            { o: 134.68, h: 135.15, l: 132.17, c: 132.52 },
            { o: 132.52, h: 133.07, l: 129.71, c: 129.84 },
            { o: 129.84, h: 130.09, l: 127.96, c: 129.24 },
            { o: 129.24, h: 130.79, l: 129.15, c: 130.72 },
            { o: 130.72, h: 132.47, l: 130.68, c: 132.31 },
            { o: 132.31, h: 134.33, l: 132.11, c: 134.13 },
            { o: 134.13, h: 136.44, l: 134.02, c: 136.28 },
            { o: 136.28, h: 138.21, l: 136.12, c: 138.01 },
            { o: 138.01, h: 140.1, l: 137.94, c: 140 }
          ],
          zones: [
            { from: 5, top: 128.44, bottom: 127.24, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 8, to: 11 },
        explain: "The first move away from the zone. Compare it with the zone height."
      },
      {
        type: "mcq",
        q: "What is \"zone height\" in this rule?",
        options: [
          "The whole chart range",
          "Entry (proximal) to stop (distal)",
          "The rally size",
          "The candle count"
        ],
        answer: 1,
        explain: "Entry line to stop line is the risk and the zone height."
      },
      {
        type: "tf",
        q: "The same 1:3 test works for supply, using the initial decline.",
        answer: true,
        explain: "Measure the drop away versus entry-to-stop."
      }
    ],
    practice: [
      {
        prompt: "This demand zone is about 2.09 points tall. The first rally away was only about 2.92 points. Price is coming back. Buy or skip?",
        scene: {
          candles: [
            { o: 160, h: 160.65, l: 156.01, c: 156.35 },
            { o: 156.35, h: 156.88, l: 150.68, c: 151.08 },
            { o: 151.08, h: 151.43, l: 146.27, c: 146.92 },
            { o: 146.92, h: 147.3, l: 142.48, c: 142.83 },
            { o: 142.83, h: 143.25, l: 139.73, c: 140 },
            { o: 140, h: 140.91, l: 139.75, c: 140.41 },
            { o: 140.41, h: 140.95, l: 138.81, c: 139.15 },
            { o: 139.15, h: 141.09, l: 138.76, c: 140.85 },
            { o: 140.85, h: 142.49, l: 140.79, c: 142.36 },
            { o: 142.36, h: 143.59, l: 142.33, c: 143.5 },
            { o: 143.5, h: 143.77, l: 143.36, c: 143.68 },
            { o: 143.68, h: 143.85, l: 142.32, c: 142.44 },
            { o: 142.44, h: 142.9, l: 142.35, c: 142.79 },
            { o: 142.79, h: 142.9, l: 141.9, c: 142 },
            { o: 142, h: 142.17, l: 141.87, c: 142.11 },
            { o: 142.11, h: 142.25, l: 142.06, c: 142.15 },
            { o: 142.15, h: 142.41, l: 142.06, c: 142.25 },
            { o: 142.25, h: 142.57, l: 140.01, c: 140.65 },
            { o: 140.65, h: 140.9, l: 139.14, c: 139.3 },
            { o: 139.3, h: 139.41, l: 137.74, c: 137.87 },
            { o: 137.87, h: 137.94, l: 136.72, c: 136.91 },
            { o: 136.91, h: 137.14, l: 135.03, c: 135.36 },
            { o: 135.36, h: 135.43, l: 134.26, c: 134.31 },
            { o: 134.31, h: 134.52, l: 132.47, c: 132.76 }
          ],
          zones: [
            { from: 5, top: 140.85, bottom: 138.76, kind: "demand", label: "Demand" }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The initial rally is less than 3x the zone height, so it is not a level by Sam's rule. Skip it. Price fell through."
      }
    ],
    cards: [
      { front: "The key overlooked rule?", back: "Define a level with numbers." },
      { front: "Sam's demand qualifier?", back: "Initial rally at least 3x the zone height (1:3)." },
      { front: "Zone height?", back: "Entry (proximal) to stop (distal)." },
      { front: "Must T1 be the rally top?", back: "No; it can be a pivot inside the margin." },
      { front: "Crude example?", back: "About 2-point zone, about 13-point initial rally: qualifies easily." }
    ],
    mnemonic: "Three to be: the jump must clear three zones."
  },
  {
    mentor: "seiden",
    n: 278,
    eli5: {
      oneLiner: "Indicators are just different roads. The level is the place you are going.",
      story: "Sam showed the same bond short four times: with price only, then with Bollinger Bands, CCI and Stochastics. On every chart the reason for the turn was the same: price reached supply. The indicators sometimes agreed, but many of their earlier signals failed when no level was there. Price alone gave the entry, the stop and the target.",
      analogy: "You can get to Grandma's house by plane, train or car. The house is the same; only the ride changes."
    },
    bigIdeas: [
      "Price at a qualified level is the real reason for a turn. Price does not turn because CCI is overbought.",
      "Use an indicator only as comfort: act on an overbought reading only when price is also at supply (the \"All Star\").",
      "Exit at the opposing level, not on an oscillator reading."
    ],
    steps: [
      {
        title: "Price only: the supply",
        narration: "A spike, a pause and a hard drop left supply. It sits high on the daily curve.",
        scene: {
          candles: [
            { o: 124, h: 131.85, l: 122.76, c: 130.95 },
            { o: 130.95, h: 138.82, l: 130.46, c: 137.74 },
            { o: 137.74, h: 147.56, l: 136.28, c: 146.33 },
            { o: 146.33, h: 155.76, l: 145, c: 154.16 },
            { o: 154.16, h: 162.37, l: 152.57, c: 162 },
            { o: 162, h: 162.42, l: 161.8, c: 162.19 },
            { o: 162.19, h: 162.37, l: 161.58, c: 161.81 },
            { o: 161.81, h: 162.4, l: 153.69, c: 154.46 },
            { o: 154.46, h: 155.03, l: 146.12, c: 146.8 },
            { o: 146.8, h: 147.09, l: 139.35, c: 139.73 },
            { o: 139.73, h: 140, l: 131.75, c: 132 },
            { o: 132, h: 132.63, l: 131.65, c: 132.28 },
            { o: 132.28, h: 132.54, l: 131.49, c: 131.61 },
            { o: 131.61, h: 135.31, l: 131.39, c: 134.93 },
            { o: 134.93, h: 136.68, l: 134.7, c: 136.42 },
            { o: 136.42, h: 140.73, l: 135.69, c: 140 },
            { o: 140, h: 140.75, l: 139.84, c: 140.5 },
            { o: 140.5, h: 140.77, l: 139.14, c: 139.48 },
            { o: 139.48, h: 143.43, l: 138.77, c: 142.68 },
            { o: 142.68, h: 142.84, l: 142.39, c: 142.58 },
            { o: 142.58, h: 146.86, l: 142.16, c: 146.53 },
            { o: 146.53, h: 147.12, l: 146.47, c: 146.93 },
            { o: 146.93, h: 150.87, l: 146.35, c: 150 },
            { o: 150, h: 157.37, l: 149.56, c: 156.74 },
            { o: 156.74, h: 161.07, l: 156.09, c: 160.41 },
            { o: 160.41, h: 162.12, l: 159.98, c: 161.01 },
            { o: 161.01, h: 161.39, l: 157.38, c: 157.53 },
            { o: 157.53, h: 158.37, l: 149.76, c: 150.38 },
            { o: 150.38, h: 150.55, l: 147.35, c: 147.54 },
            { o: 147.54, h: 147.74, l: 140.57, c: 141.06 },
            { o: 141.06, h: 141.17, l: 138.63, c: 138.76 },
            { o: 138.76, h: 139.36, l: 131.46, c: 132.16 },
            { o: 132.16, h: 132.59, l: 127.62, c: 128 }
          ],
          zones: [
            { from: 5, top: 162.42, bottom: 161.81, kind: "supply", label: "Supply" }
          ],
          reveal: 14
        }
      },
      {
        title: "The return",
        narration: "Months later price rallies back. Indicators will flash overbought many times on the way up; without a level, those signals fail.",
        scene: {
          candles: [
            { o: 124, h: 131.85, l: 122.76, c: 130.95 },
            { o: 130.95, h: 138.82, l: 130.46, c: 137.74 },
            { o: 137.74, h: 147.56, l: 136.28, c: 146.33 },
            { o: 146.33, h: 155.76, l: 145, c: 154.16 },
            { o: 154.16, h: 162.37, l: 152.57, c: 162 },
            { o: 162, h: 162.42, l: 161.8, c: 162.19 },
            { o: 162.19, h: 162.37, l: 161.58, c: 161.81 },
            { o: 161.81, h: 162.4, l: 153.69, c: 154.46 },
            { o: 154.46, h: 155.03, l: 146.12, c: 146.8 },
            { o: 146.8, h: 147.09, l: 139.35, c: 139.73 },
            { o: 139.73, h: 140, l: 131.75, c: 132 },
            { o: 132, h: 132.63, l: 131.65, c: 132.28 },
            { o: 132.28, h: 132.54, l: 131.49, c: 131.61 },
            { o: 131.61, h: 135.31, l: 131.39, c: 134.93 },
            { o: 134.93, h: 136.68, l: 134.7, c: 136.42 },
            { o: 136.42, h: 140.73, l: 135.69, c: 140 },
            { o: 140, h: 140.75, l: 139.84, c: 140.5 },
            { o: 140.5, h: 140.77, l: 139.14, c: 139.48 },
            { o: 139.48, h: 143.43, l: 138.77, c: 142.68 },
            { o: 142.68, h: 142.84, l: 142.39, c: 142.58 },
            { o: 142.58, h: 146.86, l: 142.16, c: 146.53 },
            { o: 146.53, h: 147.12, l: 146.47, c: 146.93 },
            { o: 146.93, h: 150.87, l: 146.35, c: 150 },
            { o: 150, h: 157.37, l: 149.56, c: 156.74 },
            { o: 156.74, h: 161.07, l: 156.09, c: 160.41 },
            { o: 160.41, h: 162.12, l: 159.98, c: 161.01 },
            { o: 161.01, h: 161.39, l: 157.38, c: 157.53 },
            { o: 157.53, h: 158.37, l: 149.76, c: 150.38 },
            { o: 150.38, h: 150.55, l: 147.35, c: 147.54 },
            { o: 147.54, h: 147.74, l: 140.57, c: 141.06 },
            { o: 141.06, h: 141.17, l: 138.63, c: 138.76 },
            { o: 138.76, h: 139.36, l: 131.46, c: 132.16 },
            { o: 132.16, h: 132.59, l: 127.62, c: 128 }
          ],
          zones: [
            { from: 5, top: 162.42, bottom: 161.81, kind: "supply", label: "Supply" }
          ],
          notes: [
            { x: 20, y: 159.37, text: "overbought, no level" }
          ],
          reveal: 25
        }
      },
      {
        title: "Entry at the level",
        narration: "Price reaches supply. Short at the bottom line, stop above. Target: the nearest demand, a prior pivot low. If a band is pierced here too, fine, that is extra comfort.",
        scene: {
          candles: [
            { o: 124, h: 131.85, l: 122.76, c: 130.95 },
            { o: 130.95, h: 138.82, l: 130.46, c: 137.74 },
            { o: 137.74, h: 147.56, l: 136.28, c: 146.33 },
            { o: 146.33, h: 155.76, l: 145, c: 154.16 },
            { o: 154.16, h: 162.37, l: 152.57, c: 162 },
            { o: 162, h: 162.42, l: 161.8, c: 162.19 },
            { o: 162.19, h: 162.37, l: 161.58, c: 161.81 },
            { o: 161.81, h: 162.4, l: 153.69, c: 154.46 },
            { o: 154.46, h: 155.03, l: 146.12, c: 146.8 },
            { o: 146.8, h: 147.09, l: 139.35, c: 139.73 },
            { o: 139.73, h: 140, l: 131.75, c: 132 },
            { o: 132, h: 132.63, l: 131.65, c: 132.28 },
            { o: 132.28, h: 132.54, l: 131.49, c: 131.61 },
            { o: 131.61, h: 135.31, l: 131.39, c: 134.93 },
            { o: 134.93, h: 136.68, l: 134.7, c: 136.42 },
            { o: 136.42, h: 140.73, l: 135.69, c: 140 },
            { o: 140, h: 140.75, l: 139.84, c: 140.5 },
            { o: 140.5, h: 140.77, l: 139.14, c: 139.48 },
            { o: 139.48, h: 143.43, l: 138.77, c: 142.68 },
            { o: 142.68, h: 142.84, l: 142.39, c: 142.58 },
            { o: 142.58, h: 146.86, l: 142.16, c: 146.53 },
            { o: 146.53, h: 147.12, l: 146.47, c: 146.93 },
            { o: 146.93, h: 150.87, l: 146.35, c: 150 },
            { o: 150, h: 157.37, l: 149.56, c: 156.74 },
            { o: 156.74, h: 161.07, l: 156.09, c: 160.41 },
            { o: 160.41, h: 162.12, l: 159.98, c: 161.01 },
            { o: 161.01, h: 161.39, l: 157.38, c: 157.53 },
            { o: 157.53, h: 158.37, l: 149.76, c: 150.38 },
            { o: 150.38, h: 150.55, l: 147.35, c: 147.54 },
            { o: 147.54, h: 147.74, l: 140.57, c: 141.06 },
            { o: 141.06, h: 141.17, l: 138.63, c: 138.76 },
            { o: 138.76, h: 139.36, l: 131.46, c: 132.16 },
            { o: 132.16, h: 132.59, l: 127.62, c: 128 }
          ],
          zones: [
            { from: 5, top: 162.42, bottom: 161.81, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 161.81, label: "Entry (proximal)", kind: "entry", from: 6 },
            { y: 162.67, label: "Stop above distal", kind: "sl", from: 6 },
            { y: 132.39, label: "Target: pivot-low demand", kind: "tp", from: 6 }
          ],
          reveal: 26
        }
      },
      {
        title: "Same destination",
        narration: "Price falls to the target. Price and the level did all the work; the indicators were optional.",
        scene: {
          candles: [
            { o: 124, h: 131.85, l: 122.76, c: 130.95 },
            { o: 130.95, h: 138.82, l: 130.46, c: 137.74 },
            { o: 137.74, h: 147.56, l: 136.28, c: 146.33 },
            { o: 146.33, h: 155.76, l: 145, c: 154.16 },
            { o: 154.16, h: 162.37, l: 152.57, c: 162 },
            { o: 162, h: 162.42, l: 161.8, c: 162.19 },
            { o: 162.19, h: 162.37, l: 161.58, c: 161.81 },
            { o: 161.81, h: 162.4, l: 153.69, c: 154.46 },
            { o: 154.46, h: 155.03, l: 146.12, c: 146.8 },
            { o: 146.8, h: 147.09, l: 139.35, c: 139.73 },
            { o: 139.73, h: 140, l: 131.75, c: 132 },
            { o: 132, h: 132.63, l: 131.65, c: 132.28 },
            { o: 132.28, h: 132.54, l: 131.49, c: 131.61 },
            { o: 131.61, h: 135.31, l: 131.39, c: 134.93 },
            { o: 134.93, h: 136.68, l: 134.7, c: 136.42 },
            { o: 136.42, h: 140.73, l: 135.69, c: 140 },
            { o: 140, h: 140.75, l: 139.84, c: 140.5 },
            { o: 140.5, h: 140.77, l: 139.14, c: 139.48 },
            { o: 139.48, h: 143.43, l: 138.77, c: 142.68 },
            { o: 142.68, h: 142.84, l: 142.39, c: 142.58 },
            { o: 142.58, h: 146.86, l: 142.16, c: 146.53 },
            { o: 146.53, h: 147.12, l: 146.47, c: 146.93 },
            { o: 146.93, h: 150.87, l: 146.35, c: 150 },
            { o: 150, h: 157.37, l: 149.56, c: 156.74 },
            { o: 156.74, h: 161.07, l: 156.09, c: 160.41 },
            { o: 160.41, h: 162.12, l: 159.98, c: 161.01 },
            { o: 161.01, h: 161.39, l: 157.38, c: 157.53 },
            { o: 157.53, h: 158.37, l: 149.76, c: 150.38 },
            { o: 150.38, h: 150.55, l: 147.35, c: 147.54 },
            { o: 147.54, h: 147.74, l: 140.57, c: 141.06 },
            { o: 141.06, h: 141.17, l: 138.63, c: 138.76 },
            { o: 138.76, h: 139.36, l: 131.46, c: 132.16 },
            { o: 132.16, h: 132.59, l: 127.62, c: 128 }
          ],
          zones: [
            { from: 5, top: 162.42, bottom: 161.81, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 161.81, label: "Entry (proximal)", kind: "entry", from: 6 },
            { y: 162.67, label: "Stop above distal", kind: "sl", from: 6 },
            { y: 132.39, label: "Target: pivot-low demand", kind: "tp", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Price turns lower because CCI is overbought.",
        answer: false,
        explain: "Price turns because it reached supply. CCI is just a derivative of price."
      },
      {
        type: "mcq",
        q: "What is the \"All Star\" setup?",
        options: [
          "Any band pierce",
          "Bollinger Band pierce AT a supply level with a big margin below",
          "Three indicators agreeing",
          "An MA cross"
        ],
        answer: 1,
        explain: "Act on the band piercing AND a level together."
      },
      {
        type: "mcq",
        q: "Trading CCI alone in this example would have meant...",
        options: [
          "Perfect timing",
          "Entering early and exiting early many times",
          "No trades",
          "Bigger profits"
        ],
        answer: 1,
        explain: "Many overbought readings came with no turn."
      },
      {
        type: "spot",
        q: "Click the candle where the short belongs.",
        scene: {
          candles: [
            { o: 124, h: 131.85, l: 122.76, c: 130.95 },
            { o: 130.95, h: 138.82, l: 130.46, c: 137.74 },
            { o: 137.74, h: 147.56, l: 136.28, c: 146.33 },
            { o: 146.33, h: 155.76, l: 145, c: 154.16 },
            { o: 154.16, h: 162.37, l: 152.57, c: 162 },
            { o: 162, h: 162.42, l: 161.8, c: 162.19 },
            { o: 162.19, h: 162.37, l: 161.58, c: 161.81 },
            { o: 161.81, h: 162.4, l: 153.69, c: 154.46 },
            { o: 154.46, h: 155.03, l: 146.12, c: 146.8 },
            { o: 146.8, h: 147.09, l: 139.35, c: 139.73 },
            { o: 139.73, h: 140, l: 131.75, c: 132 },
            { o: 132, h: 132.63, l: 131.65, c: 132.28 },
            { o: 132.28, h: 132.54, l: 131.49, c: 131.61 },
            { o: 131.61, h: 135.31, l: 131.39, c: 134.93 },
            { o: 134.93, h: 136.68, l: 134.7, c: 136.42 },
            { o: 136.42, h: 140.73, l: 135.69, c: 140 },
            { o: 140, h: 140.75, l: 139.84, c: 140.5 },
            { o: 140.5, h: 140.77, l: 139.14, c: 139.48 },
            { o: 139.48, h: 143.43, l: 138.77, c: 142.68 },
            { o: 142.68, h: 142.84, l: 142.39, c: 142.58 },
            { o: 142.58, h: 146.86, l: 142.16, c: 146.53 },
            { o: 146.53, h: 147.12, l: 146.47, c: 146.93 },
            { o: 146.93, h: 150.87, l: 146.35, c: 150 },
            { o: 150, h: 157.37, l: 149.56, c: 156.74 },
            { o: 156.74, h: 161.07, l: 156.09, c: 160.41 },
            { o: 160.41, h: 162.12, l: 159.98, c: 161.01 },
            { o: 161.01, h: 161.39, l: 157.38, c: 157.53 },
            { o: 157.53, h: 158.37, l: 149.76, c: 150.38 },
            { o: 150.38, h: 150.55, l: 147.35, c: 147.54 },
            { o: 147.54, h: 147.74, l: 140.57, c: 141.06 },
            { o: 141.06, h: 141.17, l: 138.63, c: 138.76 },
            { o: 138.76, h: 139.36, l: 131.46, c: 132.16 },
            { o: 132.16, h: 132.59, l: 127.62, c: 128 }
          ],
          zones: [
            { from: 5, top: 162.42, bottom: 161.81, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 25, to: 25 },
        explain: "The return to supply. That is the destination, whichever road you take."
      },
      {
        type: "mcq",
        q: "Where should the profit be taken?",
        options: [
          "When the oscillator is oversold",
          "At the opposing demand level",
          "After 5 candles",
          "At break-even"
        ],
        answer: 1,
        explain: "Exit at the opposing level, not on an oscillator reading."
      }
    ],
    practice: [
      {
        prompt: "The oscillator is overbought AND price is reaching a fresh, high supply with a big margin below. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 120, h: 127.65, l: 119.56, c: 126.58 },
            { o: 126.58, h: 134.81, l: 125.5, c: 133.34 },
            { o: 133.34, h: 141.38, l: 132.09, c: 140.56 },
            { o: 140.56, h: 150.67, l: 140.06, c: 149.07 },
            { o: 149.07, h: 156.62, l: 147.78, c: 156 },
            { o: 156, h: 156.57, l: 155.73, c: 156.35 },
            { o: 156.35, h: 156.67, l: 155.63, c: 155.8 },
            { o: 155.8, h: 156.5, l: 147.83, c: 148.15 },
            { o: 148.15, h: 148.79, l: 140.99, c: 141.5 },
            { o: 141.5, h: 142.12, l: 134.03, c: 134.8 },
            { o: 134.8, h: 135.19, l: 127.67, c: 128 },
            { o: 128, h: 132.26, l: 127.61, c: 131.23 },
            { o: 131.23, h: 131.45, l: 131.01, c: 131.29 },
            { o: 131.29, h: 135.9, l: 130.51, c: 135.4 },
            { o: 135.4, h: 135.63, l: 135.18, c: 135.45 },
            { o: 135.45, h: 139.74, l: 134.21, c: 139.34 },
            { o: 139.34, h: 140.01, l: 139.17, c: 139.8 },
            { o: 139.8, h: 144.48, l: 139.2, c: 143.82 },
            { o: 143.82, h: 145.31, l: 143.7, c: 145 },
            { o: 145, h: 149.13, l: 144.49, c: 148.76 },
            { o: 148.76, h: 154.83, l: 147.85, c: 154.4 },
            { o: 154.4, h: 156.24, l: 154.02, c: 155 },
            { o: 155, h: 155.37, l: 150.96, c: 151.06 },
            { o: 151.06, h: 151.13, l: 148.64, c: 148.76 },
            { o: 148.76, h: 149.16, l: 143.5, c: 143.77 },
            { o: 143.77, h: 144.03, l: 141.51, c: 141.58 },
            { o: 141.58, h: 141.94, l: 136.61, c: 136.93 },
            { o: 136.93, h: 137.13, l: 134.12, c: 134.41 },
            { o: 134.41, h: 134.68, l: 129.86, c: 130 }
          ],
          zones: [
            { from: 5, top: 156.67, bottom: 155.8, kind: "supply", label: "Supply" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Overbought only matters because price is at supply. Sell. Price fell away."
      }
    ],
    cards: [
      { front: "Primary decision tool?", back: "Price at supply and demand levels." },
      { front: "When to act on overbought?", back: "Only when price is also at supply." },
      { front: "All Star setup?", back: "Bollinger pierce at a supply level with a big margin." },
      { front: "Did the trade need Stochastics?", back: "No." }
    ],
    mnemonic: "Plane, train or car: the level is the destination."
  },
  {
    mentor: "seiden",
    n: 284,
    eli5: {
      oneLiner: "Trade what price shows, not what the news or averages make you feel.",
      story: "Our beliefs drive what we do, and the biggest false beliefs hide in normal chart and company analysis. Moving averages lag, so waiting for them means skipping the best buys. Bad news often pushes price into demand, where it turns up. Good earnings and an upgrade feel safe, but they usually arrive when price is already high. Sam sums it up in three laws of price.",
      analogy: "A moving average is like driving while looking in the rear-view mirror. It shows where you were, not the wall in front of you."
    },
    bigIdeas: [
      "Three laws: price is a function of supply and demand; every influence is in price; change starts where buyers or sellers become zero at a price.",
      "Buy the first return to fresh demand even if the MA slopes down. MAs only appear to work when they sit on real levels.",
      "When perceived risk is lowest, actual risk is often highest: upgrades into supply, bad news into demand."
    ],
    steps: [
      {
        title: "Fresh demand",
        narration: "Price dropped, based and rallied hard. That base is objective demand. The moving average is still sloping down.",
        scene: {
          candles: [
            { o: 172, h: 172.83, l: 163.56, c: 164.67 },
            { o: 164.67, h: 165.56, l: 154.37, c: 155.76 },
            { o: 155.76, h: 157.26, l: 145.38, c: 147.01 },
            { o: 147.01, h: 147.59, l: 141.62, c: 142.29 },
            { o: 142.29, h: 143.08, l: 131.55, c: 132 },
            { o: 132, h: 132.44, l: 131.67, c: 132.29 },
            { o: 132.29, h: 132.47, l: 131.56, c: 131.75 },
            { o: 131.75, h: 132.48, l: 131.5, c: 132.31 },
            { o: 132.31, h: 137.81, l: 132.15, c: 137.35 },
            { o: 137.35, h: 143.53, l: 136.99, c: 142.94 },
            { o: 142.94, h: 148.85, l: 142.4, c: 148.24 },
            { o: 148.24, h: 154.47, l: 148.09, c: 154 },
            { o: 154, h: 154.37, l: 153.82, c: 154.13 },
            { o: 154.13, h: 154.54, l: 151.22, c: 151.78 },
            { o: 151.78, h: 152.62, l: 151.67, c: 152.41 },
            { o: 152.41, h: 153.24, l: 149.13, c: 149.92 },
            { o: 149.92, h: 150.17, l: 149.73, c: 150 },
            { o: 150, h: 150.38, l: 143.92, c: 144.93 },
            { o: 144.93, h: 145.07, l: 142.44, c: 142.68 },
            { o: 142.68, h: 143.41, l: 137.34, c: 137.76 },
            { o: 137.76, h: 138.44, l: 133.46, c: 133.71 },
            { o: 133.71, h: 134.13, l: 131.74, c: 133.11 },
            { o: 133.11, h: 138.86, l: 132.97, c: 138.62 },
            { o: 138.62, h: 142, l: 138.37, c: 141.73 },
            { o: 141.73, h: 147.26, l: 141.35, c: 146.93 },
            { o: 146.93, h: 151.48, l: 146.74, c: 151.22 },
            { o: 151.22, h: 156.14, l: 150.87, c: 155.67 },
            { o: 155.67, h: 161.08, l: 155.14, c: 160.82 },
            { o: 160.82, h: 165.28, l: 160.44, c: 165 }
          ],
          zones: [
            { from: 5, top: 132.31, bottom: 131.5, kind: "demand", label: "Demand" }
          ],
          trendlines: [
            { x1: 0, y1: 176, x2: 21, y2: 150, label: "MA still falling", broken: false }
          ],
          reveal: 14
        }
      },
      {
        title: "The MA filter says \"no\"",
        narration: "Price drifts back toward the base while the MA still falls. A slope filter would say do not buy. That filter is lagging history.",
        scene: {
          candles: [
            { o: 172, h: 172.83, l: 163.56, c: 164.67 },
            { o: 164.67, h: 165.56, l: 154.37, c: 155.76 },
            { o: 155.76, h: 157.26, l: 145.38, c: 147.01 },
            { o: 147.01, h: 147.59, l: 141.62, c: 142.29 },
            { o: 142.29, h: 143.08, l: 131.55, c: 132 },
            { o: 132, h: 132.44, l: 131.67, c: 132.29 },
            { o: 132.29, h: 132.47, l: 131.56, c: 131.75 },
            { o: 131.75, h: 132.48, l: 131.5, c: 132.31 },
            { o: 132.31, h: 137.81, l: 132.15, c: 137.35 },
            { o: 137.35, h: 143.53, l: 136.99, c: 142.94 },
            { o: 142.94, h: 148.85, l: 142.4, c: 148.24 },
            { o: 148.24, h: 154.47, l: 148.09, c: 154 },
            { o: 154, h: 154.37, l: 153.82, c: 154.13 },
            { o: 154.13, h: 154.54, l: 151.22, c: 151.78 },
            { o: 151.78, h: 152.62, l: 151.67, c: 152.41 },
            { o: 152.41, h: 153.24, l: 149.13, c: 149.92 },
            { o: 149.92, h: 150.17, l: 149.73, c: 150 },
            { o: 150, h: 150.38, l: 143.92, c: 144.93 },
            { o: 144.93, h: 145.07, l: 142.44, c: 142.68 },
            { o: 142.68, h: 143.41, l: 137.34, c: 137.76 },
            { o: 137.76, h: 138.44, l: 133.46, c: 133.71 },
            { o: 133.71, h: 134.13, l: 131.74, c: 133.11 },
            { o: 133.11, h: 138.86, l: 132.97, c: 138.62 },
            { o: 138.62, h: 142, l: 138.37, c: 141.73 },
            { o: 141.73, h: 147.26, l: 141.35, c: 146.93 },
            { o: 146.93, h: 151.48, l: 146.74, c: 151.22 },
            { o: 151.22, h: 156.14, l: 150.87, c: 155.67 },
            { o: 155.67, h: 161.08, l: 155.14, c: 160.82 },
            { o: 160.82, h: 165.28, l: 160.44, c: 165 }
          ],
          zones: [
            { from: 5, top: 132.31, bottom: 131.5, kind: "demand", label: "Demand" }
          ],
          trendlines: [
            { x1: 0, y1: 176, x2: 21, y2: 150, label: "MA still falling", broken: false }
          ],
          reveal: 21
        }
      },
      {
        title: "Bad news spike into demand",
        narration: "Bad news! A long lower wick dives into the zone and closes higher. The last seller has sold at a level with more willing buyers, so price must rise.",
        scene: {
          candles: [
            { o: 172, h: 172.83, l: 163.56, c: 164.67 },
            { o: 164.67, h: 165.56, l: 154.37, c: 155.76 },
            { o: 155.76, h: 157.26, l: 145.38, c: 147.01 },
            { o: 147.01, h: 147.59, l: 141.62, c: 142.29 },
            { o: 142.29, h: 143.08, l: 131.55, c: 132 },
            { o: 132, h: 132.44, l: 131.67, c: 132.29 },
            { o: 132.29, h: 132.47, l: 131.56, c: 131.75 },
            { o: 131.75, h: 132.48, l: 131.5, c: 132.31 },
            { o: 132.31, h: 137.81, l: 132.15, c: 137.35 },
            { o: 137.35, h: 143.53, l: 136.99, c: 142.94 },
            { o: 142.94, h: 148.85, l: 142.4, c: 148.24 },
            { o: 148.24, h: 154.47, l: 148.09, c: 154 },
            { o: 154, h: 154.37, l: 153.82, c: 154.13 },
            { o: 154.13, h: 154.54, l: 151.22, c: 151.78 },
            { o: 151.78, h: 152.62, l: 151.67, c: 152.41 },
            { o: 152.41, h: 153.24, l: 149.13, c: 149.92 },
            { o: 149.92, h: 150.17, l: 149.73, c: 150 },
            { o: 150, h: 150.38, l: 143.92, c: 144.93 },
            { o: 144.93, h: 145.07, l: 142.44, c: 142.68 },
            { o: 142.68, h: 143.41, l: 137.34, c: 137.76 },
            { o: 137.76, h: 138.44, l: 133.46, c: 133.71 },
            { o: 133.71, h: 134.13, l: 131.74, c: 133.11 },
            { o: 133.11, h: 138.86, l: 132.97, c: 138.62 },
            { o: 138.62, h: 142, l: 138.37, c: 141.73 },
            { o: 141.73, h: 147.26, l: 141.35, c: 146.93 },
            { o: 146.93, h: 151.48, l: 146.74, c: 151.22 },
            { o: 151.22, h: 156.14, l: 150.87, c: 155.67 },
            { o: 155.67, h: 161.08, l: 155.14, c: 160.82 },
            { o: 160.82, h: 165.28, l: 160.44, c: 165 }
          ],
          zones: [
            { from: 5, top: 132.31, bottom: 131.5, kind: "demand", label: "Demand" }
          ],
          trendlines: [
            { x1: 0, y1: 176, x2: 21, y2: 150, label: "MA still falling", broken: false }
          ],
          lines: [
            { y: 132.31, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 131.25, label: "Stop below distal", kind: "sl", from: 7 }
          ],
          highlight: { from: 21, to: 21, label: "news spike" },
          reveal: 22
        }
      },
      {
        title: "Act like a goose",
        narration: "Price rallies strongly. Follow the rules mechanically, like geese flying south, without debating the news or the average.",
        scene: {
          candles: [
            { o: 172, h: 172.83, l: 163.56, c: 164.67 },
            { o: 164.67, h: 165.56, l: 154.37, c: 155.76 },
            { o: 155.76, h: 157.26, l: 145.38, c: 147.01 },
            { o: 147.01, h: 147.59, l: 141.62, c: 142.29 },
            { o: 142.29, h: 143.08, l: 131.55, c: 132 },
            { o: 132, h: 132.44, l: 131.67, c: 132.29 },
            { o: 132.29, h: 132.47, l: 131.56, c: 131.75 },
            { o: 131.75, h: 132.48, l: 131.5, c: 132.31 },
            { o: 132.31, h: 137.81, l: 132.15, c: 137.35 },
            { o: 137.35, h: 143.53, l: 136.99, c: 142.94 },
            { o: 142.94, h: 148.85, l: 142.4, c: 148.24 },
            { o: 148.24, h: 154.47, l: 148.09, c: 154 },
            { o: 154, h: 154.37, l: 153.82, c: 154.13 },
            { o: 154.13, h: 154.54, l: 151.22, c: 151.78 },
            { o: 151.78, h: 152.62, l: 151.67, c: 152.41 },
            { o: 152.41, h: 153.24, l: 149.13, c: 149.92 },
            { o: 149.92, h: 150.17, l: 149.73, c: 150 },
            { o: 150, h: 150.38, l: 143.92, c: 144.93 },
            { o: 144.93, h: 145.07, l: 142.44, c: 142.68 },
            { o: 142.68, h: 143.41, l: 137.34, c: 137.76 },
            { o: 137.76, h: 138.44, l: 133.46, c: 133.71 },
            { o: 133.71, h: 134.13, l: 131.74, c: 133.11 },
            { o: 133.11, h: 138.86, l: 132.97, c: 138.62 },
            { o: 138.62, h: 142, l: 138.37, c: 141.73 },
            { o: 141.73, h: 147.26, l: 141.35, c: 146.93 },
            { o: 146.93, h: 151.48, l: 146.74, c: 151.22 },
            { o: 151.22, h: 156.14, l: 150.87, c: 155.67 },
            { o: 155.67, h: 161.08, l: 155.14, c: 160.82 },
            { o: 160.82, h: 165.28, l: 160.44, c: 165 }
          ],
          zones: [
            { from: 5, top: 132.31, bottom: 131.5, kind: "demand", label: "Demand" }
          ],
          trendlines: [
            { x1: 0, y1: 176, x2: 21, y2: 150, label: "MA still falling", broken: false }
          ],
          lines: [
            { y: 132.31, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 131.25, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put Sam's three laws of price movement in order.",
        items: [
          "Price is a function of an ongoing supply/demand relationship",
          "Every influence on price is reflected in price",
          "Change starts where buyers or sellers become zero at a price"
        ],
        explain: "Those three laws are all you need."
      },
      {
        type: "tf",
        q: "Waiting for price to get back above the 200-day MA lowers your risk.",
        answer: false,
        explain: "It means higher risk, lower profit potential, and paying the person who bought at demand."
      },
      {
        type: "mcq",
        q: "A brokerage upgrade gaps a stock up into supply. What is the actual risk to buy?",
        options: ["Low", "High", "Zero", "Unknown"],
        answer: 1,
        explain: "Perceived risk low, actual risk HIGH. The trained trader sells to the public there."
      },
      {
        type: "spot",
        q: "Click the bad-news candle that was a buy.",
        scene: {
          candles: [
            { o: 172, h: 172.83, l: 163.56, c: 164.67 },
            { o: 164.67, h: 165.56, l: 154.37, c: 155.76 },
            { o: 155.76, h: 157.26, l: 145.38, c: 147.01 },
            { o: 147.01, h: 147.59, l: 141.62, c: 142.29 },
            { o: 142.29, h: 143.08, l: 131.55, c: 132 },
            { o: 132, h: 132.44, l: 131.67, c: 132.29 },
            { o: 132.29, h: 132.47, l: 131.56, c: 131.75 },
            { o: 131.75, h: 132.48, l: 131.5, c: 132.31 },
            { o: 132.31, h: 137.81, l: 132.15, c: 137.35 },
            { o: 137.35, h: 143.53, l: 136.99, c: 142.94 },
            { o: 142.94, h: 148.85, l: 142.4, c: 148.24 },
            { o: 148.24, h: 154.47, l: 148.09, c: 154 },
            { o: 154, h: 154.37, l: 153.82, c: 154.13 },
            { o: 154.13, h: 154.54, l: 151.22, c: 151.78 },
            { o: 151.78, h: 152.62, l: 151.67, c: 152.41 },
            { o: 152.41, h: 153.24, l: 149.13, c: 149.92 },
            { o: 149.92, h: 150.17, l: 149.73, c: 150 },
            { o: 150, h: 150.38, l: 143.92, c: 144.93 },
            { o: 144.93, h: 145.07, l: 142.44, c: 142.68 },
            { o: 142.68, h: 143.41, l: 137.34, c: 137.76 },
            { o: 137.76, h: 138.44, l: 133.46, c: 133.71 },
            { o: 133.71, h: 134.13, l: 131.74, c: 133.11 },
            { o: 133.11, h: 138.86, l: 132.97, c: 138.62 },
            { o: 138.62, h: 142, l: 138.37, c: 141.73 },
            { o: 141.73, h: 147.26, l: 141.35, c: 146.93 },
            { o: 146.93, h: 151.48, l: 146.74, c: 151.22 },
            { o: 151.22, h: 156.14, l: 150.87, c: 155.67 },
            { o: 155.67, h: 161.08, l: 155.14, c: 160.82 },
            { o: 160.82, h: 165.28, l: 160.44, c: 165 }
          ],
          zones: [
            { from: 5, top: 132.31, bottom: 131.5, kind: "demand", label: "Demand" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "The long lower wick into demand. News moved price to the level faster."
      },
      {
        type: "mcq",
        q: "Which two mistakes do these illusions cause?",
        options: [
          "Using stops and targets",
          "Buying after rising prices, and buying where sellers outnumber buyers",
          "Trading too little",
          "Using limit orders"
        ],
        answer: 1,
        explain: "Illusion leads to buying high, into supply."
      }
    ],
    practice: [
      {
        prompt: "An analyst upgrade comes out pre-market. The stock gaps up straight into supply that it gapped down from before. The story feels safe. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 124, h: 131.56, l: 122.57, c: 130.6 },
            { o: 130.6, h: 140.26, l: 130.04, c: 138.94 },
            { o: 138.94, h: 146.89, l: 137.63, c: 145.9 },
            { o: 145.9, h: 151.8, l: 144.79, c: 151.23 },
            { o: 151.23, h: 160.6, l: 150.35, c: 160 },
            { o: 160, h: 160.59, l: 159.84, c: 160.45 },
            { o: 160.45, h: 160.77, l: 159.6, c: 159.74 },
            { o: 156.74, h: 157.08, l: 150.1, c: 150.75 },
            { o: 150.75, h: 151.32, l: 145.14, c: 145.73 },
            { o: 145.73, h: 146.18, l: 139.65, c: 140 },
            { o: 140, h: 141.6, l: 139.86, c: 141.32 },
            { o: 141.32, h: 141.49, l: 140.93, c: 141.04 },
            { o: 141.04, h: 143.6, l: 140.74, c: 143.07 },
            { o: 143.07, h: 143.17, l: 142.11, c: 142.36 },
            { o: 142.36, h: 144.49, l: 142.05, c: 144 },
            { o: 144, h: 146.77, l: 143.83, c: 146.41 },
            { o: 146.41, h: 150.29, l: 146.2, c: 149.94 },
            { o: 149.94, h: 152.27, l: 149.53, c: 152 },
            { o: 159.64, h: 160.26, l: 158.61, c: 158.94 },
            { o: 158.94, h: 159.12, l: 154.17, c: 154.65 },
            { o: 154.65, h: 154.77, l: 152.73, c: 152.81 },
            { o: 152.81, h: 153.28, l: 147.24, c: 147.78 },
            { o: 147.78, h: 147.89, l: 145.67, c: 145.73 },
            { o: 145.73, h: 145.98, l: 140.72, c: 141.22 },
            { o: 141.22, h: 141.3, l: 137.65, c: 138 }
          ],
          zones: [
            { from: 5, top: 160.77, bottom: 159.74, kind: "supply", label: "Supply" }
          ],
          reveal: 18
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Perceived risk is low, actual risk is high. Sell to the public at supply. Price collapsed within hours."
      }
    ],
    cards: [
      { front: "Law 1 of price movement?", back: "Price is a function of an ongoing supply/demand relationship." },
      { front: "Law 2?", back: "Every influence on price is reflected in price." },
      { front: "Law 3?", back: "Change starts where buyers or sellers become zero at a specific price." },
      { front: "Perceived vs actual risk?", back: "When perceived risk is lowest, actual risk is often highest." },
      { front: "\"Act like a goose\" means?", back: "Follow your rules mechanically, without debating." }
    ],
    mnemonic: "Rear-view mirror lies; the wall ahead is real."
  },
  {
    mentor: "seiden",
    n: 295,
    eli5: {
      oneLiner: "Watch how often a trend rests, and want quiet volume at your level.",
      story: "Sam has two tools you will not find in most books. First, a strong trend does not stop to rest often; when the dips in an uptrend come closer and closer, the trend is getting tired near supply. Second, books say big turns come with huge volume, but Sam says the biggest turns come on low volume. When a level is very out of balance, price spends little time there, so few trades happen.",
      analogy: "The best sale in town sells out in minutes. Few people get to shop, so the till rings only a few times."
    },
    bigIdeas: [
      "Shrinking distance between pivot lows (uptrend) or highs (downtrend) = trend weakening, risk to join rising.",
      "Big imbalance = little time at the level = few trades = low volume.",
      "Seiden often wants below-average volume as price returns to his level."
    ],
    steps: [
      {
        title: "Drop into a base",
        narration: "Red candles fall into a small base, two green and one red. Then price rallies away.",
        scene: {
          candles: [
            { o: 168, h: 168.5, l: 162.21, c: 162.86 },
            { o: 162.86, h: 164.48, l: 154.91, c: 155.39 },
            { o: 155.39, h: 155.9, l: 152.31, c: 152.82 },
            { o: 152.82, h: 154.45, l: 144.4, c: 145.27 },
            { o: 145.27, h: 146.39, l: 139.57, c: 140 },
            { o: 140, h: 140.7, l: 139.78, c: 140.39 },
            { o: 140.39, h: 140.56, l: 139.54, c: 139.7 },
            { o: 139.7, h: 140.6, l: 139.52, c: 140.28 },
            { o: 140.28, h: 146.92, l: 139.85, c: 146.28 },
            { o: 146.28, h: 150.85, l: 145.97, c: 150.54 },
            { o: 150.54, h: 156.37, l: 149.97, c: 156 },
            { o: 156, h: 156.49, l: 155.86, c: 156.31 },
            { o: 156.31, h: 156.44, l: 155.48, c: 155.63 },
            { o: 155.63, h: 156.05, l: 151.48, c: 151.7 },
            { o: 151.7, h: 152.52, l: 144.81, c: 145.9 },
            { o: 145.9, h: 146.11, l: 140.9, c: 141.79 },
            { o: 141.79, h: 142.3, l: 140.04, c: 141.19 },
            { o: 141.19, h: 144.4, l: 140.85, c: 144.32 },
            { o: 144.32, h: 148.23, l: 143.97, c: 147.88 },
            { o: 147.88, h: 150.89, l: 147.69, c: 150.78 },
            { o: 150.78, h: 154.48, l: 150.59, c: 154.11 },
            { o: 154.11, h: 156.29, l: 153.99, c: 156.23 },
            { o: 156.23, h: 160.37, l: 156.14, c: 160 }
          ],
          zones: [
            { from: 5, top: 140.39, bottom: 139.52, kind: "demand", label: "Demand" }
          ],
          reveal: 11
        }
      },
      {
        title: "The pullback",
        narration: "Price pulls back toward the base. The pullback candles are small and quiet: low volume. Few people are selling.",
        scene: {
          candles: [
            { o: 168, h: 168.5, l: 162.21, c: 162.86 },
            { o: 162.86, h: 164.48, l: 154.91, c: 155.39 },
            { o: 155.39, h: 155.9, l: 152.31, c: 152.82 },
            { o: 152.82, h: 154.45, l: 144.4, c: 145.27 },
            { o: 145.27, h: 146.39, l: 139.57, c: 140 },
            { o: 140, h: 140.7, l: 139.78, c: 140.39 },
            { o: 140.39, h: 140.56, l: 139.54, c: 139.7 },
            { o: 139.7, h: 140.6, l: 139.52, c: 140.28 },
            { o: 140.28, h: 146.92, l: 139.85, c: 146.28 },
            { o: 146.28, h: 150.85, l: 145.97, c: 150.54 },
            { o: 150.54, h: 156.37, l: 149.97, c: 156 },
            { o: 156, h: 156.49, l: 155.86, c: 156.31 },
            { o: 156.31, h: 156.44, l: 155.48, c: 155.63 },
            { o: 155.63, h: 156.05, l: 151.48, c: 151.7 },
            { o: 151.7, h: 152.52, l: 144.81, c: 145.9 },
            { o: 145.9, h: 146.11, l: 140.9, c: 141.79 },
            { o: 141.79, h: 142.3, l: 140.04, c: 141.19 },
            { o: 141.19, h: 144.4, l: 140.85, c: 144.32 },
            { o: 144.32, h: 148.23, l: 143.97, c: 147.88 },
            { o: 147.88, h: 150.89, l: 147.69, c: 150.78 },
            { o: 150.78, h: 154.48, l: 150.59, c: 154.11 },
            { o: 154.11, h: 156.29, l: 153.99, c: 156.23 },
            { o: 156.23, h: 160.37, l: 156.14, c: 160 }
          ],
          zones: [
            { from: 5, top: 140.39, bottom: 139.52, kind: "demand", label: "Demand" }
          ],
          highlight: { from: 13, to: 15, label: "quiet (low volume)" },
          reveal: 16
        }
      },
      {
        title: "Buy the pullback",
        narration: "At the zone, buy at the top line, stop below. Below-average volume here is a plus, not a warning.",
        scene: {
          candles: [
            { o: 168, h: 168.5, l: 162.21, c: 162.86 },
            { o: 162.86, h: 164.48, l: 154.91, c: 155.39 },
            { o: 155.39, h: 155.9, l: 152.31, c: 152.82 },
            { o: 152.82, h: 154.45, l: 144.4, c: 145.27 },
            { o: 145.27, h: 146.39, l: 139.57, c: 140 },
            { o: 140, h: 140.7, l: 139.78, c: 140.39 },
            { o: 140.39, h: 140.56, l: 139.54, c: 139.7 },
            { o: 139.7, h: 140.6, l: 139.52, c: 140.28 },
            { o: 140.28, h: 146.92, l: 139.85, c: 146.28 },
            { o: 146.28, h: 150.85, l: 145.97, c: 150.54 },
            { o: 150.54, h: 156.37, l: 149.97, c: 156 },
            { o: 156, h: 156.49, l: 155.86, c: 156.31 },
            { o: 156.31, h: 156.44, l: 155.48, c: 155.63 },
            { o: 155.63, h: 156.05, l: 151.48, c: 151.7 },
            { o: 151.7, h: 152.52, l: 144.81, c: 145.9 },
            { o: 145.9, h: 146.11, l: 140.9, c: 141.79 },
            { o: 141.79, h: 142.3, l: 140.04, c: 141.19 },
            { o: 141.19, h: 144.4, l: 140.85, c: 144.32 },
            { o: 144.32, h: 148.23, l: 143.97, c: 147.88 },
            { o: 147.88, h: 150.89, l: 147.69, c: 150.78 },
            { o: 150.78, h: 154.48, l: 150.59, c: 154.11 },
            { o: 154.11, h: 156.29, l: 153.99, c: 156.23 },
            { o: 156.23, h: 160.37, l: 156.14, c: 160 }
          ],
          zones: [
            { from: 5, top: 140.39, bottom: 139.52, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 140.39, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 139.27, label: "Stop below distal", kind: "sl", from: 7 }
          ],
          reveal: 17
        }
      },
      {
        title: "Volume returns with the rally",
        narration: "Price rallies away; now the activity picks up. The turn itself was quiet.",
        scene: {
          candles: [
            { o: 168, h: 168.5, l: 162.21, c: 162.86 },
            { o: 162.86, h: 164.48, l: 154.91, c: 155.39 },
            { o: 155.39, h: 155.9, l: 152.31, c: 152.82 },
            { o: 152.82, h: 154.45, l: 144.4, c: 145.27 },
            { o: 145.27, h: 146.39, l: 139.57, c: 140 },
            { o: 140, h: 140.7, l: 139.78, c: 140.39 },
            { o: 140.39, h: 140.56, l: 139.54, c: 139.7 },
            { o: 139.7, h: 140.6, l: 139.52, c: 140.28 },
            { o: 140.28, h: 146.92, l: 139.85, c: 146.28 },
            { o: 146.28, h: 150.85, l: 145.97, c: 150.54 },
            { o: 150.54, h: 156.37, l: 149.97, c: 156 },
            { o: 156, h: 156.49, l: 155.86, c: 156.31 },
            { o: 156.31, h: 156.44, l: 155.48, c: 155.63 },
            { o: 155.63, h: 156.05, l: 151.48, c: 151.7 },
            { o: 151.7, h: 152.52, l: 144.81, c: 145.9 },
            { o: 145.9, h: 146.11, l: 140.9, c: 141.79 },
            { o: 141.79, h: 142.3, l: 140.04, c: 141.19 },
            { o: 141.19, h: 144.4, l: 140.85, c: 144.32 },
            { o: 144.32, h: 148.23, l: 143.97, c: 147.88 },
            { o: 147.88, h: 150.89, l: 147.69, c: 150.78 },
            { o: 150.78, h: 154.48, l: 150.59, c: 154.11 },
            { o: 154.11, h: 156.29, l: 153.99, c: 156.23 },
            { o: 156.23, h: 160.37, l: 156.14, c: 160 }
          ],
          zones: [
            { from: 5, top: 140.39, bottom: 139.52, kind: "demand", label: "Demand" }
          ],
          lines: [
            { y: 140.39, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 139.27, label: "Stop below distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "Sam says the most important turning points need climactic, above-average volume.",
        answer: false,
        explain: "He says the opposite: the larger the imbalance, typically the lower the volume."
      },
      {
        type: "mcq",
        q: "Why is volume low at a big imbalance?",
        options: [
          "Nobody cares",
          "Price spends little time there, so few trades print",
          "Brokers hide it",
          "It is always high"
        ],
        answer: 1,
        explain: "Less time at the level = fewer transactions."
      },
      {
        type: "spot",
        q: "Click the low pivot that came soonest after the one before it.",
        scene: {
          candles: [
            { o: 108, h: 112.27, l: 107.28, c: 111.78 },
            { o: 111.78, h: 117.29, l: 111.02, c: 116.79 },
            { o: 116.79, h: 121.26, l: 116.01, c: 120.61 },
            { o: 120.61, h: 125.09, l: 119.93, c: 124.34 },
            { o: 124.34, h: 129.48, l: 124.12, c: 128.65 },
            { o: 128.65, h: 132.57, l: 128.09, c: 132 },
            { o: 132, h: 132.47, l: 128.94, c: 129.47 },
            { o: 129.47, h: 130.1, l: 126.06, c: 126.5 },
            { o: 126.5, h: 126.67, l: 123.84, c: 124 },
            { o: 124, h: 128.73, l: 123.78, c: 128.14 },
            { o: 128.14, h: 132.68, l: 127.96, c: 132.03 },
            { o: 132.03, h: 137.68, l: 131.51, c: 137.31 },
            { o: 137.31, h: 141.77, l: 136.59, c: 141.02 },
            { o: 141.02, h: 146.74, l: 140.45, c: 146.36 },
            { o: 146.36, h: 150.26, l: 145.99, c: 150 },
            { o: 150, h: 150.19, l: 147.05, c: 147.26 },
            { o: 147.26, h: 147.48, l: 144.69, c: 144.99 },
            { o: 144.99, h: 145.25, l: 142.76, c: 143 },
            { o: 143, h: 147.92, l: 142.27, c: 147.36 },
            { o: 147.36, h: 153.76, l: 146.53, c: 153.47 },
            { o: 153.47, h: 158.85, l: 152.89, c: 158 },
            { o: 158, h: 158.28, l: 154.8, c: 155.23 },
            { o: 155.23, h: 155.68, l: 152.9, c: 153 },
            { o: 153, h: 156.5, l: 152.61, c: 156.06 },
            { o: 156.06, h: 160.36, l: 155.77, c: 160 },
            { o: 160, h: 160.55, l: 156.6, c: 157 },
            { o: 157, h: 161.5, l: 156.55, c: 161 },
            { o: 161, h: 161.66, l: 157, c: 157.6 },
            { o: 157.6, h: 158.16, l: 154.62, c: 154.78 },
            { o: 154.78, h: 155.3, l: 150.92, c: 151.44 },
            { o: 151.44, h: 151.79, l: 147.15, c: 147.85 },
            { o: 147.85, h: 148.02, l: 144.28, c: 144.66 },
            { o: 144.66, h: 145.2, l: 141.79, c: 142 }
          ],
          notes: [
            { x: 8, y: 122.34, text: "low 1" },
            { x: 17, y: 141.26, text: "low 2" },
            { x: 22, y: 151.4, text: "low 3" },
            { x: 25, y: 155.1, text: "low 4" }
          ]
        },
        answer: { from: 25, to: 25 },
        explain: "The last pivot low, the shortest gap. Trend nearly over."
      },
      {
        type: "mcq",
        q: "In a downtrend, pivot highs are getting closer together. What does that warn?",
        options: [
          "Shorting risk is rising; demand is near",
          "Trend is strengthening",
          "Buy immediately",
          "Nothing"
        ],
        answer: 0,
        explain: "Mirror rule: shrinking distance between pivot highs warns the downtrend is nearly over."
      }
    ],
    practice: [
      {
        prompt: "Price is pulling back quietly (low volume) into the base it rallied from. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 168, h: 168.5, l: 162.21, c: 162.86 },
            { o: 162.86, h: 164.48, l: 154.91, c: 155.39 },
            { o: 155.39, h: 155.9, l: 152.31, c: 152.82 },
            { o: 152.82, h: 154.45, l: 144.4, c: 145.27 },
            { o: 145.27, h: 146.39, l: 139.57, c: 140 },
            { o: 140, h: 140.7, l: 139.78, c: 140.39 },
            { o: 140.39, h: 140.56, l: 139.54, c: 139.7 },
            { o: 139.7, h: 140.6, l: 139.52, c: 140.28 },
            { o: 140.28, h: 146.92, l: 139.85, c: 146.28 },
            { o: 146.28, h: 150.85, l: 145.97, c: 150.54 },
            { o: 150.54, h: 156.37, l: 149.97, c: 156 },
            { o: 156, h: 156.49, l: 155.86, c: 156.31 },
            { o: 156.31, h: 156.44, l: 155.48, c: 155.63 },
            { o: 155.63, h: 156.05, l: 151.48, c: 151.7 },
            { o: 151.7, h: 152.52, l: 144.81, c: 145.9 },
            { o: 145.9, h: 146.11, l: 140.9, c: 141.79 },
            { o: 141.79, h: 142.3, l: 140.04, c: 141.19 },
            { o: 141.19, h: 144.4, l: 140.85, c: 144.32 },
            { o: 144.32, h: 148.23, l: 143.97, c: 147.88 },
            { o: 147.88, h: 150.89, l: 147.69, c: 150.78 },
            { o: 150.78, h: 154.48, l: 150.59, c: 154.11 },
            { o: 154.11, h: 156.29, l: 153.99, c: 156.23 },
            { o: 156.23, h: 160.37, l: 156.14, c: 160 }
          ],
          zones: [
            { from: 5, top: 140.39, bottom: 139.52, kind: "demand", label: "Demand" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "buy" },
        explain: "A quiet pullback into fresh demand. Buy. Price rallied."
      },
      {
        prompt: "An old uptrend: each dip comes sooner than the last. Price is at the top of the run. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 108, h: 112.27, l: 107.28, c: 111.78 },
            { o: 111.78, h: 117.29, l: 111.02, c: 116.79 },
            { o: 116.79, h: 121.26, l: 116.01, c: 120.61 },
            { o: 120.61, h: 125.09, l: 119.93, c: 124.34 },
            { o: 124.34, h: 129.48, l: 124.12, c: 128.65 },
            { o: 128.65, h: 132.57, l: 128.09, c: 132 },
            { o: 132, h: 132.47, l: 128.94, c: 129.47 },
            { o: 129.47, h: 130.1, l: 126.06, c: 126.5 },
            { o: 126.5, h: 126.67, l: 123.84, c: 124 },
            { o: 124, h: 128.73, l: 123.78, c: 128.14 },
            { o: 128.14, h: 132.68, l: 127.96, c: 132.03 },
            { o: 132.03, h: 137.68, l: 131.51, c: 137.31 },
            { o: 137.31, h: 141.77, l: 136.59, c: 141.02 },
            { o: 141.02, h: 146.74, l: 140.45, c: 146.36 },
            { o: 146.36, h: 150.26, l: 145.99, c: 150 },
            { o: 150, h: 150.19, l: 147.05, c: 147.26 },
            { o: 147.26, h: 147.48, l: 144.69, c: 144.99 },
            { o: 144.99, h: 145.25, l: 142.76, c: 143 },
            { o: 143, h: 147.92, l: 142.27, c: 147.36 },
            { o: 147.36, h: 153.76, l: 146.53, c: 153.47 },
            { o: 153.47, h: 158.85, l: 152.89, c: 158 },
            { o: 158, h: 158.28, l: 154.8, c: 155.23 },
            { o: 155.23, h: 155.68, l: 152.9, c: 153 },
            { o: 153, h: 156.5, l: 152.61, c: 156.06 },
            { o: 156.06, h: 160.36, l: 155.77, c: 160 },
            { o: 160, h: 160.55, l: 156.6, c: 157 },
            { o: 157, h: 161.5, l: 156.55, c: 161 },
            { o: 161, h: 161.66, l: 157, c: 157.6 },
            { o: 157.6, h: 158.16, l: 154.62, c: 154.78 },
            { o: 154.78, h: 155.3, l: 150.92, c: 151.44 },
            { o: 151.44, h: 151.79, l: 147.15, c: 147.85 },
            { o: 147.85, h: 148.02, l: 144.28, c: 144.66 },
            { o: 144.66, h: 145.2, l: 141.79, c: 142 }
          ],
          notes: [
            { x: 8, y: 122.34, text: "low 1" },
            { x: 17, y: 141.26, text: "low 2" },
            { x: 22, y: 151.4, text: "low 3" },
            { x: 25, y: 155.1, text: "low 4" }
          ],
          reveal: 26
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Shrinking pivot spacing: risk to buy is rising. Stand aside. Price turned down."
      }
    ],
    cards: [
      { front: "Volume at the biggest turns?", back: "Usually low." },
      { front: "Volume Sam likes at his entry?", back: "Below average." },
      { front: "Uptrend dips getting closer?", back: "Trend weakening; it is nearing supply." },
      { front: "What is a trend?", back: "A supply/demand imbalance moving back toward balance." }
    ],
    mnemonic: "Quiet at the level, loud on the way out."
  },
  {
    mentor: "seiden",
    n: 299,
    eli5: {
      oneLiner: "Use two or three timeframes, and check the index before any stock.",
      story: "A reader day traded one stock using only 5 and 15-minute charts. Sam said even day traders need a bigger chart, like the 60-minute or daily. A perfect-looking 5-minute buy that sits right under daily supply will likely fail. For a stock, look at its index first, then find the stock levels that match the index turns. And stop hunting for the perfect trend method: trends begin and end at supply and demand levels.",
      analogy: "A small puddle can look like a lake if you only look at it up close. Step back and you see how small it is."
    },
    bigIdeas: [
      "Always use two or three timeframes: larger for direction, smaller for entry.",
      "For stocks, analyse the index first and line the stock levels up with it.",
      "Every trend begins and ends at out-of-balance levels. Get in before the conventional buyers."
    ],
    steps: [
      {
        title: "The big chart first",
        narration: "On the daily chart there is supply above, where price fell hard before.",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ],
          reveal: 15
        }
      },
      {
        title: "A pretty 5-minute buy",
        narration: "On the 5-minute chart a neat demand zone forms. It looks perfect, but it sits right under daily supply.",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 15, top: 155.22, bottom: 154.52, kind: "demand", label: "5-min demand" },
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ],
          reveal: 21
        }
      },
      {
        title: "Low odds",
        narration: "With daily supply just above, there is no room and the bigger sellers are waiting. The 5-minute buy is fighting the larger picture.",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 15, top: 155.22, bottom: 154.52, kind: "demand", label: "5-min demand" },
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ],
          lines: [
            { y: 155.22, label: "Entry (proximal)", kind: "entry", from: 16 },
            { y: 154.27, label: "Stop below distal", kind: "sl", from: 16 },
            { y: 161.52, label: "Daily supply right above", kind: "tp", from: 16 }
          ],
          reveal: 22
        }
      },
      {
        title: "It fails",
        narration: "Price breaks down through the small zone. The larger timeframe won.",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 15, top: 155.22, bottom: 154.52, kind: "demand", label: "5-min demand" },
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How many timeframes does Sam suggest?",
        options: ["One", "Two or three", "Seven", "As many as possible"],
        answer: 1,
        explain: "More than one; typically two or three is perfect."
      },
      {
        type: "tf",
        q: "A day trader can safely ignore the 60-minute and daily charts.",
        answer: false,
        explain: "A perfect 5-minute buy at daily supply will likely fail."
      },
      {
        type: "mcq",
        q: "Before trading one stock, what should you analyse?",
        options: ["Its news", "Its index (e.g. NASDAQ/QQQQ)", "Its dividend", "Nothing else"],
        answer: 1,
        explain: "Do supply and demand on the index first, then find matching turns in the stock."
      },
      {
        type: "spot",
        q: "Click the 5-minute buy that fights the daily chart.",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 15, top: 155.22, bottom: 154.52, kind: "demand", label: "5-min demand" },
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ]
        },
        answer: { from: 21, to: 21 },
        explain: "The touch of 5-minute demand right under daily supply."
      },
      {
        type: "mcq",
        q: "Sam's futures swing set?",
        options: [
          "1 and 5-minute",
          "Weekly/monthly for the curve, daily/hourly for levels",
          "Only daily",
          "Tick charts"
        ],
        answer: 1,
        explain: "Bigger charts for the curve, smaller for entries with big margins."
      }
    ],
    practice: [
      {
        prompt: "A clean 5-minute demand zone, but the daily chart has supply just above. Price is touching the 5-minute zone. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 124, h: 131.67, l: 123.31, c: 131.1 },
            { o: 131.1, h: 139.56, l: 130.02, c: 138.4 },
            { o: 138.4, h: 146.55, l: 136.72, c: 146.14 },
            { o: 146.14, h: 154.1, l: 145.51, c: 153.15 },
            { o: 153.15, h: 162.91, l: 152.05, c: 162 },
            { o: 162, h: 162.96, l: 161.54, c: 162.66 },
            { o: 162.66, h: 162.88, l: 161.35, c: 161.52 },
            { o: 161.52, h: 161.86, l: 156.09, c: 156.65 },
            { o: 156.65, h: 156.83, l: 149.74, c: 150.44 },
            { o: 150.44, h: 150.64, l: 145.22, c: 145.62 },
            { o: 145.62, h: 146.1, l: 139.48, c: 140 },
            { o: 140, h: 145.42, l: 139.68, c: 144.54 },
            { o: 144.54, h: 147.77, l: 144.05, c: 147.49 },
            { o: 147.49, h: 151.59, l: 146.98, c: 151.2 },
            { o: 151.2, h: 155.17, l: 151.2, c: 155 },
            { o: 155, h: 155.4, l: 154.92, c: 155.22 },
            { o: 155.22, h: 155.37, l: 154.52, c: 154.67 },
            { o: 154.67, h: 158.89, l: 154.3, c: 158.69 },
            { o: 158.69, h: 162.11, l: 158.58, c: 161.92 },
            { o: 161.92, h: 162.33, l: 157.39, c: 158.11 },
            { o: 158.11, h: 158.4, l: 155.56, c: 156.02 },
            { o: 156.02, h: 156.34, l: 154.92, c: 155.62 },
            { o: 155.62, h: 155.96, l: 153.59, c: 153.79 },
            { o: 153.79, h: 154.08, l: 151.19, c: 151.37 },
            { o: 151.37, h: 151.46, l: 149.74, c: 149.81 },
            { o: 149.81, h: 150.23, l: 147.27, c: 147.69 },
            { o: 147.69, h: 147.86, l: 146.25, c: 146.35 },
            { o: 146.35, h: 146.71, l: 144.13, c: 144.52 }
          ],
          zones: [
            { from: 15, top: 155.22, bottom: 154.52, kind: "demand", label: "5-min demand" },
            { from: 5, top: 162.96, bottom: 161.52, kind: "supply", label: "Daily supply" }
          ],
          reveal: 21
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "The larger timeframe says sellers are just above. Skip the buy. Price broke down."
      }
    ],
    cards: [
      { front: "How many timeframes?", back: "Two or three." },
      { front: "Larger timeframe tells you?", back: "Where price is on the curve: longs or shorts." },
      { front: "Stock day trade first step?", back: "Analyse the index, then align the stock." },
      { front: "Where do trends begin and end?", back: "At out-of-balance supply and demand levels." }
    ],
    mnemonic: "Step back before you step in."
  },
  {
    mentor: "seiden",
    n: 302,
    eli5: {
      oneLiner: "Every system needs a switch and a trigger, built on simple market logic.",
      story: "Most trading robots look great on old data and then lose fast with real money, because they were bent to fit the past. Sam's simple template has a switch and a trigger. The switch is the slope of a 50-period average: up means only buys are allowed, down means only sells. The trigger is an oscillator turning in oversold (for buys) or overbought (for sells). With supply and demand, the switch is price reaching the level and the trigger is the entry.",
      analogy: "A light switch decides if the room can be lit. Pressing the lamp button is the trigger. If the switch is off, pressing the button does nothing."
    },
    bigIdeas: [
      "Systems fail when curve-fitted. Build on how markets work: a novice must be on the other side.",
      "Switch = permission for one side only. Trigger = the actual entry. Ignore every counter-switch signal.",
      "Uptrend + oversold = buy; uptrend + overbought = ignore. Downtrend + overbought = short; downtrend + oversold = ignore."
    ],
    steps: [
      {
        title: "The switch is set to buy",
        narration: "The 50-period average slopes up. The switch says: buys only, no shorts.",
        scene: {
          candles: [
            { o: 130, h: 132.95, l: 129.8, c: 132.77 },
            { o: 132.77, h: 136.64, l: 132.57, c: 136.29 },
            { o: 136.29, h: 139.49, l: 136.13, c: 139.25 },
            { o: 139.25, h: 142.48, l: 139.1, c: 142 },
            { o: 142, h: 142.15, l: 140.61, c: 140.85 },
            { o: 140.85, h: 140.98, l: 138.88, c: 139 },
            { o: 139, h: 142.12, l: 138.79, c: 141.69 },
            { o: 141.69, h: 145.38, l: 141.48, c: 145.17 },
            { o: 145.17, h: 147.77, l: 144.98, c: 147.5 },
            { o: 147.5, h: 150.26, l: 147.24, c: 150 },
            { o: 150, h: 150.31, l: 147.84, c: 148.18 },
            { o: 148.18, h: 148.35, l: 146.85, c: 147 },
            { o: 147, h: 149.97, l: 146.65, c: 149.74 },
            { o: 149.74, h: 152.77, l: 149.28, c: 152.52 },
            { o: 152.52, h: 155.51, l: 152.27, c: 154.97 },
            { o: 154.97, h: 158.32, l: 154.83, c: 158 },
            { o: 158, h: 158.11, l: 155.58, c: 155.97 },
            { o: 155.97, h: 156.44, l: 153.07, c: 153.54 },
            { o: 153.54, h: 153.93, l: 150.52, c: 151.05 },
            { o: 151.05, h: 151.36, l: 148.62, c: 149 },
            { o: 149, h: 151.34, l: 148.85, c: 150.94 },
            { o: 150.94, h: 153.71, l: 150.41, c: 153.48 },
            { o: 153.48, h: 155.61, l: 153.09, c: 155.24 },
            { o: 155.24, h: 158.53, l: 154.94, c: 158.19 },
            { o: 158.19, h: 159.82, l: 157.94, c: 159.68 },
            { o: 159.68, h: 162.34, l: 159.33, c: 162 }
          ],
          trendlines: [
            { x1: 0, y1: 126, x2: 25, y2: 156, label: "50 MA sloping up = switch: buy only" }
          ],
          reveal: 10
        }
      },
      {
        title: "Ignore overbought signals",
        narration: "The oscillator goes overbought on the way up. In an uptrend those are sell signals we ignore. Shorting them would lose.",
        scene: {
          candles: [
            { o: 130, h: 132.95, l: 129.8, c: 132.77 },
            { o: 132.77, h: 136.64, l: 132.57, c: 136.29 },
            { o: 136.29, h: 139.49, l: 136.13, c: 139.25 },
            { o: 139.25, h: 142.48, l: 139.1, c: 142 },
            { o: 142, h: 142.15, l: 140.61, c: 140.85 },
            { o: 140.85, h: 140.98, l: 138.88, c: 139 },
            { o: 139, h: 142.12, l: 138.79, c: 141.69 },
            { o: 141.69, h: 145.38, l: 141.48, c: 145.17 },
            { o: 145.17, h: 147.77, l: 144.98, c: 147.5 },
            { o: 147.5, h: 150.26, l: 147.24, c: 150 },
            { o: 150, h: 150.31, l: 147.84, c: 148.18 },
            { o: 148.18, h: 148.35, l: 146.85, c: 147 },
            { o: 147, h: 149.97, l: 146.65, c: 149.74 },
            { o: 149.74, h: 152.77, l: 149.28, c: 152.52 },
            { o: 152.52, h: 155.51, l: 152.27, c: 154.97 },
            { o: 154.97, h: 158.32, l: 154.83, c: 158 },
            { o: 158, h: 158.11, l: 155.58, c: 155.97 },
            { o: 155.97, h: 156.44, l: 153.07, c: 153.54 },
            { o: 153.54, h: 153.93, l: 150.52, c: 151.05 },
            { o: 151.05, h: 151.36, l: 148.62, c: 149 },
            { o: 149, h: 151.34, l: 148.85, c: 150.94 },
            { o: 150.94, h: 153.71, l: 150.41, c: 153.48 },
            { o: 153.48, h: 155.61, l: 153.09, c: 155.24 },
            { o: 155.24, h: 158.53, l: 154.94, c: 158.19 },
            { o: 158.19, h: 159.82, l: 157.94, c: 159.68 },
            { o: 159.68, h: 162.34, l: 159.33, c: 162 }
          ],
          trendlines: [
            { x1: 0, y1: 126, x2: 25, y2: 156, label: "50 MA sloping up = switch: buy only" }
          ],
          notes: [
            { x: 9, y: 152.26, text: "overbought: ignore" },
            { x: 15, y: 160.32, text: "overbought: ignore" }
          ],
          reveal: 16
        }
      },
      {
        title: "The trigger: oversold in an uptrend",
        narration: "A sharp drop toward the average pushes the oscillator oversold and it crosses up. Someone is selling after a decline in an uptrend: a novice to buy from. That is the trigger.",
        scene: {
          candles: [
            { o: 130, h: 132.95, l: 129.8, c: 132.77 },
            { o: 132.77, h: 136.64, l: 132.57, c: 136.29 },
            { o: 136.29, h: 139.49, l: 136.13, c: 139.25 },
            { o: 139.25, h: 142.48, l: 139.1, c: 142 },
            { o: 142, h: 142.15, l: 140.61, c: 140.85 },
            { o: 140.85, h: 140.98, l: 138.88, c: 139 },
            { o: 139, h: 142.12, l: 138.79, c: 141.69 },
            { o: 141.69, h: 145.38, l: 141.48, c: 145.17 },
            { o: 145.17, h: 147.77, l: 144.98, c: 147.5 },
            { o: 147.5, h: 150.26, l: 147.24, c: 150 },
            { o: 150, h: 150.31, l: 147.84, c: 148.18 },
            { o: 148.18, h: 148.35, l: 146.85, c: 147 },
            { o: 147, h: 149.97, l: 146.65, c: 149.74 },
            { o: 149.74, h: 152.77, l: 149.28, c: 152.52 },
            { o: 152.52, h: 155.51, l: 152.27, c: 154.97 },
            { o: 154.97, h: 158.32, l: 154.83, c: 158 },
            { o: 158, h: 158.11, l: 155.58, c: 155.97 },
            { o: 155.97, h: 156.44, l: 153.07, c: 153.54 },
            { o: 153.54, h: 153.93, l: 150.52, c: 151.05 },
            { o: 151.05, h: 151.36, l: 148.62, c: 149 },
            { o: 149, h: 151.34, l: 148.85, c: 150.94 },
            { o: 150.94, h: 153.71, l: 150.41, c: 153.48 },
            { o: 153.48, h: 155.61, l: 153.09, c: 155.24 },
            { o: 155.24, h: 158.53, l: 154.94, c: 158.19 },
            { o: 158.19, h: 159.82, l: 157.94, c: 159.68 },
            { o: 159.68, h: 162.34, l: 159.33, c: 162 }
          ],
          trendlines: [
            { x1: 0, y1: 126, x2: 25, y2: 156, label: "50 MA sloping up = switch: buy only" }
          ],
          notes: [
            { x: 9, y: 152.26, text: "overbought: ignore" },
            { x: 15, y: 160.32, text: "overbought: ignore" },
            { x: 19, y: 146.62, text: "oversold cross: trigger" }
          ],
          highlight: { from: 16, to: 19, label: "dip" },
          reveal: 20
        }
      },
      {
        title: "Switch + trigger = trade",
        narration: "Price rallies back to new highs. In supply and demand terms: the switch is price at demand, the trigger is the entry order.",
        scene: {
          candles: [
            { o: 130, h: 132.95, l: 129.8, c: 132.77 },
            { o: 132.77, h: 136.64, l: 132.57, c: 136.29 },
            { o: 136.29, h: 139.49, l: 136.13, c: 139.25 },
            { o: 139.25, h: 142.48, l: 139.1, c: 142 },
            { o: 142, h: 142.15, l: 140.61, c: 140.85 },
            { o: 140.85, h: 140.98, l: 138.88, c: 139 },
            { o: 139, h: 142.12, l: 138.79, c: 141.69 },
            { o: 141.69, h: 145.38, l: 141.48, c: 145.17 },
            { o: 145.17, h: 147.77, l: 144.98, c: 147.5 },
            { o: 147.5, h: 150.26, l: 147.24, c: 150 },
            { o: 150, h: 150.31, l: 147.84, c: 148.18 },
            { o: 148.18, h: 148.35, l: 146.85, c: 147 },
            { o: 147, h: 149.97, l: 146.65, c: 149.74 },
            { o: 149.74, h: 152.77, l: 149.28, c: 152.52 },
            { o: 152.52, h: 155.51, l: 152.27, c: 154.97 },
            { o: 154.97, h: 158.32, l: 154.83, c: 158 },
            { o: 158, h: 158.11, l: 155.58, c: 155.97 },
            { o: 155.97, h: 156.44, l: 153.07, c: 153.54 },
            { o: 153.54, h: 153.93, l: 150.52, c: 151.05 },
            { o: 151.05, h: 151.36, l: 148.62, c: 149 },
            { o: 149, h: 151.34, l: 148.85, c: 150.94 },
            { o: 150.94, h: 153.71, l: 150.41, c: 153.48 },
            { o: 153.48, h: 155.61, l: 153.09, c: 155.24 },
            { o: 155.24, h: 158.53, l: 154.94, c: 158.19 },
            { o: 158.19, h: 159.82, l: 157.94, c: 159.68 },
            { o: 159.68, h: 162.34, l: 159.33, c: 162 }
          ],
          trendlines: [
            { x1: 0, y1: 126, x2: 25, y2: 156, label: "50 MA sloping up = switch: buy only" }
          ],
          notes: [
            { x: 9, y: 152.26, text: "overbought: ignore" },
            { x: 15, y: 160.32, text: "overbought: ignore" },
            { x: 19, y: 146.62, text: "oversold cross: trigger" }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The MA slopes up and the oscillator gives an overbought sell signal. What do you do?",
        options: ["Short it", "Ignore it", "Buy double", "Close the system"],
        answer: 1,
        explain: "Uptrend + overbought = ignore. The switch only allows buys."
      },
      {
        type: "mcq",
        q: "In a level-based system, what is the switch?",
        options: ["The MA slope", "Price reaching the supply or demand level", "Volume", "The news"],
        answer: 1,
        explain: "Switch = price at the level; trigger = arrival at the level, a reversal candle, etc."
      },
      {
        type: "tf",
        q: "When a system loses, the fix is to adjust settings and add more indicators.",
        answer: false,
        explain: "That path leads to curve-fitting and disaster. Fix the logic, not the settings."
      },
      {
        type: "spot",
        q: "Click the candles where the buy trigger appears.",
        scene: {
          candles: [
            { o: 130, h: 132.95, l: 129.8, c: 132.77 },
            { o: 132.77, h: 136.64, l: 132.57, c: 136.29 },
            { o: 136.29, h: 139.49, l: 136.13, c: 139.25 },
            { o: 139.25, h: 142.48, l: 139.1, c: 142 },
            { o: 142, h: 142.15, l: 140.61, c: 140.85 },
            { o: 140.85, h: 140.98, l: 138.88, c: 139 },
            { o: 139, h: 142.12, l: 138.79, c: 141.69 },
            { o: 141.69, h: 145.38, l: 141.48, c: 145.17 },
            { o: 145.17, h: 147.77, l: 144.98, c: 147.5 },
            { o: 147.5, h: 150.26, l: 147.24, c: 150 },
            { o: 150, h: 150.31, l: 147.84, c: 148.18 },
            { o: 148.18, h: 148.35, l: 146.85, c: 147 },
            { o: 147, h: 149.97, l: 146.65, c: 149.74 },
            { o: 149.74, h: 152.77, l: 149.28, c: 152.52 },
            { o: 152.52, h: 155.51, l: 152.27, c: 154.97 },
            { o: 154.97, h: 158.32, l: 154.83, c: 158 },
            { o: 158, h: 158.11, l: 155.58, c: 155.97 },
            { o: 155.97, h: 156.44, l: 153.07, c: 153.54 },
            { o: 153.54, h: 153.93, l: 150.52, c: 151.05 },
            { o: 151.05, h: 151.36, l: 148.62, c: 149 },
            { o: 149, h: 151.34, l: 148.85, c: 150.94 },
            { o: 150.94, h: 153.71, l: 150.41, c: 153.48 },
            { o: 153.48, h: 155.61, l: 153.09, c: 155.24 },
            { o: 155.24, h: 158.53, l: 154.94, c: 158.19 },
            { o: 158.19, h: 159.82, l: 157.94, c: 159.68 },
            { o: 159.68, h: 162.34, l: 159.33, c: 162 }
          ],
          trendlines: [
            { x1: 0, y1: 126, x2: 25, y2: 156, label: "50 MA sloping up = switch: buy only" }
          ]
        },
        answer: { from: 16, to: 19 },
        explain: "The sharp dip toward the rising average: oversold in an uptrend."
      },
      {
        type: "order",
        q: "Order the switch-and-trigger routine.",
        items: [
          "Check the switch (MA slope or price at a level)",
          "Wait for a trigger in the allowed direction",
          "Ignore counter-switch signals",
          "Enter on the trigger"
        ],
        explain: "Permission first, then the trigger."
      }
    ],
    practice: [
      {
        prompt: "The 50 MA slopes down. The oscillator has just gone oversold and crossed up, a \"buy\" signal. Buy, sell or nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.27, l: 166.85, c: 167.23 },
            { o: 167.23, h: 167.81, l: 163.05, c: 163.58 },
            { o: 163.58, h: 163.71, l: 160.85, c: 161 },
            { o: 161, h: 161.59, l: 157.36, c: 158 },
            { o: 158, h: 159.66, l: 157.71, c: 159.48 },
            { o: 159.48, h: 161.23, l: 159.4, c: 161 },
            { o: 161, h: 161.52, l: 157.22, c: 157.8 },
            { o: 157.8, h: 158.13, l: 154.99, c: 155.21 },
            { o: 155.21, h: 155.68, l: 151.53, c: 151.94 },
            { o: 151.94, h: 152.1, l: 149.73, c: 150 },
            { o: 150, h: 151.54, l: 149.93, c: 151.4 },
            { o: 151.4, h: 153.29, l: 151.11, c: 153 },
            { o: 153, h: 153.34, l: 149.89, c: 150.14 },
            { o: 150.14, h: 150.76, l: 146.96, c: 147.26 },
            { o: 147.26, h: 147.5, l: 144.19, c: 144.67 },
            { o: 144.67, h: 144.91, l: 140.76, c: 141 },
            { o: 141, h: 141.18, l: 138.69, c: 139.07 },
            { o: 139.07, h: 139.29, l: 136.7, c: 136.96 },
            { o: 136.96, h: 137.08, l: 134.08, c: 134.49 },
            { o: 134.49, h: 134.75, l: 131.64, c: 132.11 },
            { o: 132.11, h: 132.26, l: 129.5, c: 129.9 },
            { o: 129.9, h: 130.28, l: 127.84, c: 128 }
          ],
          trendlines: [
            { x1: 0, y1: 174, x2: 21, y2: 136, label: "50 MA sloping down = sell only" }
          ],
          notes: [
            { x: 15, y: 138.76, text: "oversold cross" }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Downtrend + oversold = ignore. The switch only allows shorts. Price kept falling."
      }
    ],
    cards: [
      { front: "Switch?", back: "Permission for one side only (e.g. MA slope, or price at a level)." },
      { front: "Trigger?", back: "The actual entry (e.g. oscillator cross in the allowed zone)." },
      { front: "Uptrend + overbought?", back: "Ignore." },
      { front: "Downtrend + overbought?", back: "Short." },
      { front: "Why systems fail?", back: "Curve-fitting instead of logic about who is on the other side." }
    ],
    mnemonic: "Switch on, then trigger; switch off, no trigger."
  },
  {
    mentor: "seiden",
    n: 311,
    eli5: {
      oneLiner: "For a gap mid-move, buy the real base below it, not the gap edge.",
      story: "Readers asked three things. In a sideways market, define flat with numbers and take both buy and sell signals. When a gap sits in the middle of a move, do not just buy the gap edge; find the nearest drop-base-rally at or just below where the gap started. For long-term money, you need room up to supply and some of that overhead supply used up first. And Sam built his feel for levels by drawing charts by hand.",
      analogy: "A gap is like a jump on a ski slope. The jump is not where the skier started; look back up the hill to the real starting gate."
    },
    bigIdeas: [
      "Define up, down and flat with a numeric MA slope. In flat mode take both signals.",
      "Be careful with gaps in the middle of moves: mark the nearest drop-base-rally at or just below the gap origin.",
      "Long-term buys need margin to supply and overhead supply absorbed. Hand charting builds the feel."
    ],
    steps: [
      {
        title: "A base, a push, a gap",
        narration: "Price dropped, based, pushed up a little and then gapped higher in the middle of the move.",
        scene: {
          candles: [
            { o: 170, h: 170.42, l: 159.27, c: 161.21 },
            { o: 161.21, h: 162.84, l: 152.62, c: 153.67 },
            { o: 153.67, h: 155.28, l: 137.9, c: 138.95 },
            { o: 138.95, h: 139.65, l: 131.36, c: 132 },
            { o: 132, h: 132.71, l: 131.76, c: 132.52 },
            { o: 132.52, h: 132.83, l: 131.31, c: 131.66 },
            { o: 131.66, h: 132.63, l: 131.35, c: 132.47 },
            { o: 132.47, h: 134.5, l: 132.34, c: 134.29 },
            { o: 134.29, h: 137.12, l: 134.08, c: 137 },
            { o: 141, h: 145.27, l: 140.7, c: 145.04 },
            { o: 145.04, h: 149.3, l: 144.78, c: 148.85 },
            { o: 148.85, h: 151.81, l: 148.7, c: 151.71 },
            { o: 151.71, h: 156.29, l: 151.3, c: 156 },
            { o: 156, h: 156.36, l: 155.87, c: 156.1 },
            { o: 156.1, h: 156.86, l: 152.72, c: 153.13 },
            { o: 153.13, h: 154.19, l: 153.05, c: 153.96 },
            { o: 153.96, h: 154.56, l: 151.64, c: 152 },
            { o: 152, h: 152.43, l: 149.49, c: 149.73 },
            { o: 149.73, h: 150.17, l: 146.45, c: 146.65 },
            { o: 146.65, h: 146.87, l: 143.8, c: 143.94 },
            { o: 143.94, h: 144.41, l: 141.27, c: 141.5 },
            { o: 141.5, h: 141.9, l: 137.3, c: 137.92 },
            { o: 137.92, h: 138.53, l: 132.56, c: 133.52 },
            { o: 133.52, h: 133.93, l: 132.04, c: 133.32 },
            { o: 133.32, h: 137.57, l: 132.78, c: 136.85 },
            { o: 136.85, h: 140.35, l: 136.55, c: 139.97 },
            { o: 139.97, h: 143.27, l: 139.6, c: 142.75 },
            { o: 142.75, h: 146.51, l: 142.42, c: 146.24 },
            { o: 146.24, h: 150.5, l: 145.52, c: 150.3 },
            { o: 150.3, h: 154.06, l: 150.16, c: 153.38 },
            { o: 153.38, h: 156.5, l: 153.04, c: 156 }
          ],
          reveal: 11
        }
      },
      {
        title: "Gap edge is not the level",
        narration: "Most people would buy the gap edge. But the gap is mid-move; the real imbalance began lower.",
        scene: {
          candles: [
            { o: 170, h: 170.42, l: 159.27, c: 161.21 },
            { o: 161.21, h: 162.84, l: 152.62, c: 153.67 },
            { o: 153.67, h: 155.28, l: 137.9, c: 138.95 },
            { o: 138.95, h: 139.65, l: 131.36, c: 132 },
            { o: 132, h: 132.71, l: 131.76, c: 132.52 },
            { o: 132.52, h: 132.83, l: 131.31, c: 131.66 },
            { o: 131.66, h: 132.63, l: 131.35, c: 132.47 },
            { o: 132.47, h: 134.5, l: 132.34, c: 134.29 },
            { o: 134.29, h: 137.12, l: 134.08, c: 137 },
            { o: 141, h: 145.27, l: 140.7, c: 145.04 },
            { o: 145.04, h: 149.3, l: 144.78, c: 148.85 },
            { o: 148.85, h: 151.81, l: 148.7, c: 151.71 },
            { o: 151.71, h: 156.29, l: 151.3, c: 156 },
            { o: 156, h: 156.36, l: 155.87, c: 156.1 },
            { o: 156.1, h: 156.86, l: 152.72, c: 153.13 },
            { o: 153.13, h: 154.19, l: 153.05, c: 153.96 },
            { o: 153.96, h: 154.56, l: 151.64, c: 152 },
            { o: 152, h: 152.43, l: 149.49, c: 149.73 },
            { o: 149.73, h: 150.17, l: 146.45, c: 146.65 },
            { o: 146.65, h: 146.87, l: 143.8, c: 143.94 },
            { o: 143.94, h: 144.41, l: 141.27, c: 141.5 },
            { o: 141.5, h: 141.9, l: 137.3, c: 137.92 },
            { o: 137.92, h: 138.53, l: 132.56, c: 133.52 },
            { o: 133.52, h: 133.93, l: 132.04, c: 133.32 },
            { o: 133.32, h: 137.57, l: 132.78, c: 136.85 },
            { o: 136.85, h: 140.35, l: 136.55, c: 139.97 },
            { o: 139.97, h: 143.27, l: 139.6, c: 142.75 },
            { o: 142.75, h: 146.51, l: 142.42, c: 146.24 },
            { o: 146.24, h: 150.5, l: 145.52, c: 150.3 },
            { o: 150.3, h: 154.06, l: 150.16, c: 153.38 },
            { o: 153.38, h: 156.5, l: 153.04, c: 156 }
          ],
          lines: [
            { y: 137.12, label: "Gap edge (not the level)", kind: "level", from: 6 }
          ],
          reveal: 15
        }
      },
      {
        title: "Find the nearest drop-base-rally",
        narration: "Look just below the gap origin: the base after the drop. That is the demand. Draw it with the usual rule.",
        scene: {
          candles: [
            { o: 170, h: 170.42, l: 159.27, c: 161.21 },
            { o: 161.21, h: 162.84, l: 152.62, c: 153.67 },
            { o: 153.67, h: 155.28, l: 137.9, c: 138.95 },
            { o: 138.95, h: 139.65, l: 131.36, c: 132 },
            { o: 132, h: 132.71, l: 131.76, c: 132.52 },
            { o: 132.52, h: 132.83, l: 131.31, c: 131.66 },
            { o: 131.66, h: 132.63, l: 131.35, c: 132.47 },
            { o: 132.47, h: 134.5, l: 132.34, c: 134.29 },
            { o: 134.29, h: 137.12, l: 134.08, c: 137 },
            { o: 141, h: 145.27, l: 140.7, c: 145.04 },
            { o: 145.04, h: 149.3, l: 144.78, c: 148.85 },
            { o: 148.85, h: 151.81, l: 148.7, c: 151.71 },
            { o: 151.71, h: 156.29, l: 151.3, c: 156 },
            { o: 156, h: 156.36, l: 155.87, c: 156.1 },
            { o: 156.1, h: 156.86, l: 152.72, c: 153.13 },
            { o: 153.13, h: 154.19, l: 153.05, c: 153.96 },
            { o: 153.96, h: 154.56, l: 151.64, c: 152 },
            { o: 152, h: 152.43, l: 149.49, c: 149.73 },
            { o: 149.73, h: 150.17, l: 146.45, c: 146.65 },
            { o: 146.65, h: 146.87, l: 143.8, c: 143.94 },
            { o: 143.94, h: 144.41, l: 141.27, c: 141.5 },
            { o: 141.5, h: 141.9, l: 137.3, c: 137.92 },
            { o: 137.92, h: 138.53, l: 132.56, c: 133.52 },
            { o: 133.52, h: 133.93, l: 132.04, c: 133.32 },
            { o: 133.32, h: 137.57, l: 132.78, c: 136.85 },
            { o: 136.85, h: 140.35, l: 136.55, c: 139.97 },
            { o: 139.97, h: 143.27, l: 139.6, c: 142.75 },
            { o: 142.75, h: 146.51, l: 142.42, c: 146.24 },
            { o: 146.24, h: 150.5, l: 145.52, c: 150.3 },
            { o: 150.3, h: 154.06, l: 150.16, c: 153.38 },
            { o: 153.38, h: 156.5, l: 153.04, c: 156 }
          ],
          zones: [
            { from: 4, top: 132.52, bottom: 131.31, kind: "demand", label: "Demand at the gap origin" }
          ],
          lines: [
            { y: 137.12, label: "Gap edge (not the level)", kind: "level", from: 6 }
          ],
          highlight: { from: 4, to: 6, label: "real base" },
          reveal: 23
        }
      },
      {
        title: "Low-risk entry",
        narration: "Price slices through the gap edge and turns at the real base. That is where the low-risk entry was.",
        scene: {
          candles: [
            { o: 170, h: 170.42, l: 159.27, c: 161.21 },
            { o: 161.21, h: 162.84, l: 152.62, c: 153.67 },
            { o: 153.67, h: 155.28, l: 137.9, c: 138.95 },
            { o: 138.95, h: 139.65, l: 131.36, c: 132 },
            { o: 132, h: 132.71, l: 131.76, c: 132.52 },
            { o: 132.52, h: 132.83, l: 131.31, c: 131.66 },
            { o: 131.66, h: 132.63, l: 131.35, c: 132.47 },
            { o: 132.47, h: 134.5, l: 132.34, c: 134.29 },
            { o: 134.29, h: 137.12, l: 134.08, c: 137 },
            { o: 141, h: 145.27, l: 140.7, c: 145.04 },
            { o: 145.04, h: 149.3, l: 144.78, c: 148.85 },
            { o: 148.85, h: 151.81, l: 148.7, c: 151.71 },
            { o: 151.71, h: 156.29, l: 151.3, c: 156 },
            { o: 156, h: 156.36, l: 155.87, c: 156.1 },
            { o: 156.1, h: 156.86, l: 152.72, c: 153.13 },
            { o: 153.13, h: 154.19, l: 153.05, c: 153.96 },
            { o: 153.96, h: 154.56, l: 151.64, c: 152 },
            { o: 152, h: 152.43, l: 149.49, c: 149.73 },
            { o: 149.73, h: 150.17, l: 146.45, c: 146.65 },
            { o: 146.65, h: 146.87, l: 143.8, c: 143.94 },
            { o: 143.94, h: 144.41, l: 141.27, c: 141.5 },
            { o: 141.5, h: 141.9, l: 137.3, c: 137.92 },
            { o: 137.92, h: 138.53, l: 132.56, c: 133.52 },
            { o: 133.52, h: 133.93, l: 132.04, c: 133.32 },
            { o: 133.32, h: 137.57, l: 132.78, c: 136.85 },
            { o: 136.85, h: 140.35, l: 136.55, c: 139.97 },
            { o: 139.97, h: 143.27, l: 139.6, c: 142.75 },
            { o: 142.75, h: 146.51, l: 142.42, c: 146.24 },
            { o: 146.24, h: 150.5, l: 145.52, c: 150.3 },
            { o: 150.3, h: 154.06, l: 150.16, c: 153.38 },
            { o: 153.38, h: 156.5, l: 153.04, c: 156 }
          ],
          zones: [
            { from: 4, top: 132.52, bottom: 131.31, kind: "demand", label: "Demand at the gap origin" }
          ],
          lines: [
            { y: 137.12, label: "Gap edge (not the level)", kind: "level", from: 6 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The MA slope is between your up and down thresholds. What mode are you in?",
        options: ["Uptrend", "Downtrend", "Sideways: take both signals", "No trading ever"],
        answer: 2,
        explain: "Flat mode: both oscillator buy and sell signals, until the slope returns."
      },
      {
        type: "spot",
        q: "Click the base that is the real demand for this gap.",
        scene: {
          candles: [
            { o: 170, h: 170.42, l: 159.27, c: 161.21 },
            { o: 161.21, h: 162.84, l: 152.62, c: 153.67 },
            { o: 153.67, h: 155.28, l: 137.9, c: 138.95 },
            { o: 138.95, h: 139.65, l: 131.36, c: 132 },
            { o: 132, h: 132.71, l: 131.76, c: 132.52 },
            { o: 132.52, h: 132.83, l: 131.31, c: 131.66 },
            { o: 131.66, h: 132.63, l: 131.35, c: 132.47 },
            { o: 132.47, h: 134.5, l: 132.34, c: 134.29 },
            { o: 134.29, h: 137.12, l: 134.08, c: 137 },
            { o: 141, h: 145.27, l: 140.7, c: 145.04 },
            { o: 145.04, h: 149.3, l: 144.78, c: 148.85 },
            { o: 148.85, h: 151.81, l: 148.7, c: 151.71 },
            { o: 151.71, h: 156.29, l: 151.3, c: 156 },
            { o: 156, h: 156.36, l: 155.87, c: 156.1 },
            { o: 156.1, h: 156.86, l: 152.72, c: 153.13 },
            { o: 153.13, h: 154.19, l: 153.05, c: 153.96 },
            { o: 153.96, h: 154.56, l: 151.64, c: 152 },
            { o: 152, h: 152.43, l: 149.49, c: 149.73 },
            { o: 149.73, h: 150.17, l: 146.45, c: 146.65 },
            { o: 146.65, h: 146.87, l: 143.8, c: 143.94 },
            { o: 143.94, h: 144.41, l: 141.27, c: 141.5 },
            { o: 141.5, h: 141.9, l: 137.3, c: 137.92 },
            { o: 137.92, h: 138.53, l: 132.56, c: 133.52 },
            { o: 133.52, h: 133.93, l: 132.04, c: 133.32 },
            { o: 133.32, h: 137.57, l: 132.78, c: 136.85 },
            { o: 136.85, h: 140.35, l: 136.55, c: 139.97 },
            { o: 139.97, h: 143.27, l: 139.6, c: 142.75 },
            { o: 142.75, h: 146.51, l: 142.42, c: 146.24 },
            { o: 146.24, h: 150.5, l: 145.52, c: 150.3 },
            { o: 150.3, h: 154.06, l: 150.16, c: 153.38 },
            { o: 153.38, h: 156.5, l: 153.04, c: 156 }
          ],
          lines: [
            { y: 137.12, label: "Gap edge (not the level)", kind: "level", from: 6 }
          ]
        },
        answer: { from: 4, to: 6 },
        explain: "The drop-base-rally at/just below the gap origin, not the gap edge."
      },
      {
        type: "tf",
        q: "Reaching demand means price will break the big supply above.",
        answer: false,
        explain: "For long-term buys, wait for some or all overhead supply to be absorbed."
      },
      {
        type: "mcq",
        q: "What did hand charting give Sam?",
        options: [
          "Faster orders",
          "Awareness of where demand exceeds supply",
          "Better indicators",
          "Nothing"
        ],
        answer: 1,
        explain: "Graph paper and coloured pencils build a feel for levels."
      }
    ],
    practice: [
      {
        prompt: "Price gapped up mid-move and is now falling back. Draw the demand zone you would buy: the nearest drop-base-rally at or below the gap origin.",
        scene: {
          candles: [
            { o: 166, h: 166.74, l: 155.73, c: 156.74 },
            { o: 156.74, h: 157.57, l: 147.94, c: 148.37 },
            { o: 148.37, h: 149.51, l: 133.08, c: 134.14 },
            { o: 134.14, h: 135.12, l: 125.3, c: 126 },
            { o: 126, h: 126.47, l: 125.79, c: 126.3 },
            { o: 126.3, h: 126.59, l: 125.31, c: 125.5 },
            { o: 125.5, h: 126.78, l: 125.25, c: 126.48 },
            { o: 126.48, h: 128.92, l: 126.24, c: 128.64 },
            { o: 128.64, h: 131.15, l: 128.39, c: 131 },
            { o: 135, h: 139.21, l: 134.88, c: 138.91 },
            { o: 138.91, h: 142.58, l: 138.61, c: 142.42 },
            { o: 142.42, h: 146.17, l: 142.16, c: 146.06 },
            { o: 146.06, h: 150.18, l: 145.74, c: 150 },
            { o: 150, h: 150.18, l: 149.85, c: 149.93 },
            { o: 149.93, h: 150.24, l: 146.72, c: 146.95 },
            { o: 146.95, h: 148.37, l: 146.78, c: 148.03 },
            { o: 148.03, h: 148.65, l: 145.74, c: 146 },
            { o: 146, h: 146.36, l: 142.81, c: 142.97 },
            { o: 142.97, h: 143.24, l: 139.8, c: 140.04 },
            { o: 140.04, h: 140.3, l: 138.35, c: 138.62 },
            { o: 138.62, h: 139.18, l: 135.14, c: 135.5 },
            { o: 135.5, h: 136.33, l: 130.19, c: 130.43 },
            { o: 130.43, h: 130.9, l: 126.84, c: 127.48 },
            { o: 127.48, h: 127.98, l: 125.99, c: 127.28 },
            { o: 127.28, h: 130.73, l: 127.1, c: 130.47 },
            { o: 130.47, h: 134.2, l: 129.99, c: 133.53 },
            { o: 133.53, h: 139.55, l: 133.12, c: 138.58 },
            { o: 138.58, h: 143.09, l: 138.13, c: 142.44 },
            { o: 142.44, h: 146.74, l: 141.78, c: 146.11 },
            { o: 146.11, h: 149.37, l: 145.72, c: 149 }
          ],
          reveal: 23
        },
        task: "draw-zone",
        answer: { top: 126.48, bottom: 125.25 },
        explain: "Wrap the base after the drop: top on the highest basing body, bottom on the lowest basing wick. Price turned up from there."
      }
    ],
    cards: [
      { front: "Flat market rule?", back: "Define flat by a numeric MA slope and take both signals." },
      {
        front: "Gap in the middle of a move?",
        back: "Find the nearest drop-base-rally at or just below the gap origin."
      },
      { front: "Two conditions for long-term buys?", back: "Margin to supply above, and overhead supply absorbed." },
      { front: "Hand charting tools?", back: "Graph paper and coloured pencils." }
    ],
    mnemonic: "Skip the jump, find the gate."
  },
  {
    mentor: "seiden",
    n: 315,
    eli5: {
      oneLiner: "Strong levels are rare. Wait patiently, then enter at the level, not later.",
      story: "Markets spend most of their time calm and balanced, and very little time at big imbalances. So you need patience. For a Google short, five things lined up: the S&P near supply, novices gapping up after a rally, a level that price had gapped away from, the fear index (VIX) at demand, and a big room down to demand. Sam sold at the level. Most people waited for a red candle first, and their late selling helped push price down.",
      analogy: "Fishing is mostly waiting. When the fish bites, you pull right away, not after it swims off."
    },
    bigIdeas: [
      "Low risk, high reward, high probability only exists at rare extreme imbalances. Patience and probability go together.",
      "Stack odds: index at a level, novice gap after a rally, strong (gap) departure, VIX opposite, big margin.",
      "Enter at the level. Waiting for a confirmation candle gives away much of the move."
    ],
    steps: [
      {
        title: "A base that gapped down",
        narration: "Price based and gapped down: no trading at all as it left. That is strong supply.",
        scene: {
          candles: [
            { o: 128, h: 136.07, l: 126.71, c: 134.68 },
            { o: 134.68, h: 143.12, l: 134.33, c: 141.97 },
            { o: 141.97, h: 149.46, l: 141.4, c: 148.56 },
            { o: 148.56, h: 159.17, l: 146.72, c: 158.51 },
            { o: 158.51, h: 164.27, l: 158.26, c: 164 },
            { o: 164, h: 164.55, l: 163.79, c: 164.36 },
            { o: 164.36, h: 164.49, l: 163.34, c: 163.56 },
            { o: 163.56, h: 164.6, l: 163.45, c: 164.43 },
            { o: 160.43, h: 161.32, l: 148.67, c: 149.14 },
            { o: 149.14, h: 149.65, l: 139.61, c: 140 },
            { o: 140, h: 140.09, l: 139.82, c: 139.95 },
            { o: 139.95, h: 140.72, l: 136.76, c: 137.21 },
            { o: 137.21, h: 137.98, l: 137.06, c: 137.71 },
            { o: 137.71, h: 137.89, l: 135.74, c: 136 },
            { o: 136, h: 141.16, l: 135.71, c: 140.24 },
            { o: 140.24, h: 142.69, l: 140.09, c: 142.48 },
            { o: 142.48, h: 147.59, l: 141.71, c: 147.08 },
            { o: 147.08, h: 150.54, l: 146.5, c: 150 },
            { o: 150, h: 155.09, l: 149.28, c: 154.75 },
            { o: 154.75, h: 160.14, l: 154.41, c: 159.56 },
            { o: 163.46, h: 164.08, l: 162.47, c: 162.76 },
            { o: 162.76, h: 163.48, l: 156, c: 156.39 },
            { o: 156.39, h: 157.06, l: 149.72, c: 150 },
            { o: 146, h: 146.34, l: 144.36, c: 144.45 },
            { o: 144.45, h: 144.83, l: 140.94, c: 141.52 },
            { o: 141.52, h: 141.67, l: 139.46, c: 139.54 },
            { o: 139.54, h: 139.63, l: 137.67, c: 138 }
          ],
          zones: [
            { from: 5, top: 164.6, bottom: 163.56, kind: "supply", label: "Supply" }
          ],
          highlight: { from: 8, to: 8, label: "gap" },
          reveal: 11
        }
      },
      {
        title: "Patience",
        narration: "Price spends a long time far below. Nothing to do. Most of the time the market is near balance.",
        scene: {
          candles: [
            { o: 128, h: 136.07, l: 126.71, c: 134.68 },
            { o: 134.68, h: 143.12, l: 134.33, c: 141.97 },
            { o: 141.97, h: 149.46, l: 141.4, c: 148.56 },
            { o: 148.56, h: 159.17, l: 146.72, c: 158.51 },
            { o: 158.51, h: 164.27, l: 158.26, c: 164 },
            { o: 164, h: 164.55, l: 163.79, c: 164.36 },
            { o: 164.36, h: 164.49, l: 163.34, c: 163.56 },
            { o: 163.56, h: 164.6, l: 163.45, c: 164.43 },
            { o: 160.43, h: 161.32, l: 148.67, c: 149.14 },
            { o: 149.14, h: 149.65, l: 139.61, c: 140 },
            { o: 140, h: 140.09, l: 139.82, c: 139.95 },
            { o: 139.95, h: 140.72, l: 136.76, c: 137.21 },
            { o: 137.21, h: 137.98, l: 137.06, c: 137.71 },
            { o: 137.71, h: 137.89, l: 135.74, c: 136 },
            { o: 136, h: 141.16, l: 135.71, c: 140.24 },
            { o: 140.24, h: 142.69, l: 140.09, c: 142.48 },
            { o: 142.48, h: 147.59, l: 141.71, c: 147.08 },
            { o: 147.08, h: 150.54, l: 146.5, c: 150 },
            { o: 150, h: 155.09, l: 149.28, c: 154.75 },
            { o: 154.75, h: 160.14, l: 154.41, c: 159.56 },
            { o: 163.46, h: 164.08, l: 162.47, c: 162.76 },
            { o: 162.76, h: 163.48, l: 156, c: 156.39 },
            { o: 156.39, h: 157.06, l: 149.72, c: 150 },
            { o: 146, h: 146.34, l: 144.36, c: 144.45 },
            { o: 144.45, h: 144.83, l: 140.94, c: 141.52 },
            { o: 141.52, h: 141.67, l: 139.46, c: 139.54 },
            { o: 139.54, h: 139.63, l: 137.67, c: 138 }
          ],
          zones: [
            { from: 5, top: 164.6, bottom: 163.56, kind: "supply", label: "Supply" }
          ],
          reveal: 18
        }
      },
      {
        title: "Five odds enhancers",
        narration: "Price rallies and gaps up into the zone: novice buying. The S&P is near supply, the VIX is near demand, and demand is far below. Sell at the level.",
        scene: {
          candles: [
            { o: 128, h: 136.07, l: 126.71, c: 134.68 },
            { o: 134.68, h: 143.12, l: 134.33, c: 141.97 },
            { o: 141.97, h: 149.46, l: 141.4, c: 148.56 },
            { o: 148.56, h: 159.17, l: 146.72, c: 158.51 },
            { o: 158.51, h: 164.27, l: 158.26, c: 164 },
            { o: 164, h: 164.55, l: 163.79, c: 164.36 },
            { o: 164.36, h: 164.49, l: 163.34, c: 163.56 },
            { o: 163.56, h: 164.6, l: 163.45, c: 164.43 },
            { o: 160.43, h: 161.32, l: 148.67, c: 149.14 },
            { o: 149.14, h: 149.65, l: 139.61, c: 140 },
            { o: 140, h: 140.09, l: 139.82, c: 139.95 },
            { o: 139.95, h: 140.72, l: 136.76, c: 137.21 },
            { o: 137.21, h: 137.98, l: 137.06, c: 137.71 },
            { o: 137.71, h: 137.89, l: 135.74, c: 136 },
            { o: 136, h: 141.16, l: 135.71, c: 140.24 },
            { o: 140.24, h: 142.69, l: 140.09, c: 142.48 },
            { o: 142.48, h: 147.59, l: 141.71, c: 147.08 },
            { o: 147.08, h: 150.54, l: 146.5, c: 150 },
            { o: 150, h: 155.09, l: 149.28, c: 154.75 },
            { o: 154.75, h: 160.14, l: 154.41, c: 159.56 },
            { o: 163.46, h: 164.08, l: 162.47, c: 162.76 },
            { o: 162.76, h: 163.48, l: 156, c: 156.39 },
            { o: 156.39, h: 157.06, l: 149.72, c: 150 },
            { o: 146, h: 146.34, l: 144.36, c: 144.45 },
            { o: 144.45, h: 144.83, l: 140.94, c: 141.52 },
            { o: 141.52, h: 141.67, l: 139.46, c: 139.54 },
            { o: 139.54, h: 139.63, l: 137.67, c: 138 }
          ],
          zones: [
            { from: 5, top: 164.6, bottom: 163.56, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 163.56, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 164.85, label: "Stop above distal", kind: "sl", from: 7 }
          ],
          notes: [
            { x: 18, y: 166.6, text: "S&P at supply, VIX at demand" }
          ],
          reveal: 21
        }
      },
      {
        title: "No waiting for red",
        narration: "The entry day closes red; the next day gaps down toward the target. Those who waited for the red candle sold late and helped push it lower.",
        scene: {
          candles: [
            { o: 128, h: 136.07, l: 126.71, c: 134.68 },
            { o: 134.68, h: 143.12, l: 134.33, c: 141.97 },
            { o: 141.97, h: 149.46, l: 141.4, c: 148.56 },
            { o: 148.56, h: 159.17, l: 146.72, c: 158.51 },
            { o: 158.51, h: 164.27, l: 158.26, c: 164 },
            { o: 164, h: 164.55, l: 163.79, c: 164.36 },
            { o: 164.36, h: 164.49, l: 163.34, c: 163.56 },
            { o: 163.56, h: 164.6, l: 163.45, c: 164.43 },
            { o: 160.43, h: 161.32, l: 148.67, c: 149.14 },
            { o: 149.14, h: 149.65, l: 139.61, c: 140 },
            { o: 140, h: 140.09, l: 139.82, c: 139.95 },
            { o: 139.95, h: 140.72, l: 136.76, c: 137.21 },
            { o: 137.21, h: 137.98, l: 137.06, c: 137.71 },
            { o: 137.71, h: 137.89, l: 135.74, c: 136 },
            { o: 136, h: 141.16, l: 135.71, c: 140.24 },
            { o: 140.24, h: 142.69, l: 140.09, c: 142.48 },
            { o: 142.48, h: 147.59, l: 141.71, c: 147.08 },
            { o: 147.08, h: 150.54, l: 146.5, c: 150 },
            { o: 150, h: 155.09, l: 149.28, c: 154.75 },
            { o: 154.75, h: 160.14, l: 154.41, c: 159.56 },
            { o: 163.46, h: 164.08, l: 162.47, c: 162.76 },
            { o: 162.76, h: 163.48, l: 156, c: 156.39 },
            { o: 156.39, h: 157.06, l: 149.72, c: 150 },
            { o: 146, h: 146.34, l: 144.36, c: 144.45 },
            { o: 144.45, h: 144.83, l: 140.94, c: 141.52 },
            { o: 141.52, h: 141.67, l: 139.46, c: 139.54 },
            { o: 139.54, h: 139.63, l: 137.67, c: 138 }
          ],
          zones: [
            { from: 5, top: 164.6, bottom: 163.56, kind: "supply", label: "Supply" }
          ],
          lines: [
            { y: 163.56, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 164.85, label: "Stop above distal", kind: "sl", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Put the GOOG odds enhancers in the order Sam listed them.",
        items: [
          "S&P nearing supply",
          "Novice gap up after a rally into supply",
          "Original gap down from the supply",
          "VIX near demand",
          "Large profit margin to demand"
        ],
        explain: "Not every opportunity has all five."
      },
      {
        type: "tf",
        q: "The astute speculator waits for the red confirmation candle before shorting.",
        answer: false,
        explain: "He is already short at the level; the late sellers push price his way."
      },
      {
        type: "mcq",
        q: "For a stock short, where should the S&P be?",
        options: ["At demand", "At or near supply", "Anywhere", "In a gap"],
        answer: 1,
        explain: "S&P near supply means most stocks are likely to decline."
      },
      {
        type: "spot",
        q: "Click the candle that shows the supply was strong when it formed.",
        scene: {
          candles: [
            { o: 128, h: 136.07, l: 126.71, c: 134.68 },
            { o: 134.68, h: 143.12, l: 134.33, c: 141.97 },
            { o: 141.97, h: 149.46, l: 141.4, c: 148.56 },
            { o: 148.56, h: 159.17, l: 146.72, c: 158.51 },
            { o: 158.51, h: 164.27, l: 158.26, c: 164 },
            { o: 164, h: 164.55, l: 163.79, c: 164.36 },
            { o: 164.36, h: 164.49, l: 163.34, c: 163.56 },
            { o: 163.56, h: 164.6, l: 163.45, c: 164.43 },
            { o: 160.43, h: 161.32, l: 148.67, c: 149.14 },
            { o: 149.14, h: 149.65, l: 139.61, c: 140 },
            { o: 140, h: 140.09, l: 139.82, c: 139.95 },
            { o: 139.95, h: 140.72, l: 136.76, c: 137.21 },
            { o: 137.21, h: 137.98, l: 137.06, c: 137.71 },
            { o: 137.71, h: 137.89, l: 135.74, c: 136 },
            { o: 136, h: 141.16, l: 135.71, c: 140.24 },
            { o: 140.24, h: 142.69, l: 140.09, c: 142.48 },
            { o: 142.48, h: 147.59, l: 141.71, c: 147.08 },
            { o: 147.08, h: 150.54, l: 146.5, c: 150 },
            { o: 150, h: 155.09, l: 149.28, c: 154.75 },
            { o: 154.75, h: 160.14, l: 154.41, c: 159.56 },
            { o: 163.46, h: 164.08, l: 162.47, c: 162.76 },
            { o: 162.76, h: 163.48, l: 156, c: 156.39 },
            { o: 156.39, h: 157.06, l: 149.72, c: 150 },
            { o: 146, h: 146.34, l: 144.36, c: 144.45 },
            { o: 144.45, h: 144.83, l: 140.94, c: 141.52 },
            { o: 141.52, h: 141.67, l: 139.46, c: 139.54 },
            { o: 139.54, h: 139.63, l: 137.67, c: 138 }
          ],
          zones: [
            { from: 5, top: 164.6, bottom: 163.56, kind: "supply", label: "Supply" }
          ]
        },
        answer: { from: 8, to: 8 },
        explain: "The gap down out of the base."
      },
      {
        type: "mcq",
        q: "Why do home traders over-trade?",
        options: [
          "Slow data",
          "Fast platforms tempt them, and imbalances are rare",
          "High commissions",
          "Too many rules"
        ],
        answer: 1,
        explain: "Patience is needed because extreme imbalances are rare."
      }
    ],
    practice: [
      {
        prompt: "Price gaps up into a base it once gapped down from. The S&P is near supply and the VIX near demand. It is the first candle into the level. Sell now, wait for a red candle, or buy?",
        scene: {
          candles: [
            { o: 120, h: 127.11, l: 119.45, c: 126.68 },
            { o: 126.68, h: 135.93, l: 125.65, c: 134.29 },
            { o: 134.29, h: 140.57, l: 133.78, c: 139.96 },
            { o: 139.96, h: 147.02, l: 139.46, c: 146.68 },
            { o: 146.68, h: 156.4, l: 144.77, c: 156 },
            { o: 156, h: 156.38, l: 155.73, c: 156.2 },
            { o: 156.2, h: 156.45, l: 155.37, c: 155.56 },
            { o: 155.56, h: 156.44, l: 155.38, c: 156.24 },
            { o: 152.74, h: 153.88, l: 141.07, c: 141.4 },
            { o: 141.4, h: 142.03, l: 132.21, c: 133 },
            { o: 133, h: 133.16, l: 132.83, c: 133.01 },
            { o: 133.01, h: 133.65, l: 130, c: 130.56 },
            { o: 130.56, h: 131.59, l: 130.48, c: 131.36 },
            { o: 131.36, h: 131.75, l: 129.87, c: 130 },
            { o: 130, h: 133.13, l: 129.43, c: 132.79 },
            { o: 132.79, h: 136.61, l: 132.43, c: 136.21 },
            { o: 136.21, h: 140.59, l: 135.9, c: 140.29 },
            { o: 140.29, h: 143.31, l: 139.89, c: 143 },
            { o: 143, h: 149.28, l: 142.11, c: 148.24 },
            { o: 148.24, h: 152.29, l: 147.67, c: 151.56 },
            { o: 155.46, h: 155.92, l: 154.22, c: 154.76 },
            { o: 154.76, h: 154.92, l: 148.46, c: 149.14 },
            { o: 149.14, h: 149.36, l: 142.56, c: 143 },
            { o: 139.5, h: 140.03, l: 136.79, c: 137.07 },
            { o: 137.07, h: 137.7, l: 133.32, c: 133.67 },
            { o: 133.67, h: 134.1, l: 130.89, c: 131.15 },
            { o: 131.15, h: 131.54, l: 127.31, c: 128 }
          ],
          zones: [
            { from: 5, top: 156.45, bottom: 155.56, kind: "supply", label: "Supply" }
          ],
          reveal: 20
        },
        task: "buy-sell-none",
        answer: { side: "sell" },
        explain: "Five enhancers lined up: sell at the level, no confirmation needed. Price closed red and gapped down the next day."
      }
    ],
    cards: [
      { front: "Patience goes hand in hand with?", back: "Probabilities." },
      { front: "VIX near demand means?", back: "Complacency; good for shorts." },
      { front: "Entry timing?", back: "At the level, before the confirmation candle." },
      { front: "Strongest kind of departure?", back: "A gap away from the base." }
    ],
    mnemonic: "Wait long, act fast: patience to find it, no delay at it."
  },
  {
    mentor: "seiden",
    n: 319,
    eli5: {
      oneLiner: "Short a stock only when the index is at supply too.",
      story: "On March 24 the S&P reached a supply level, the place where an earlier decline began, with demand far below. Intel was at its own supply at the same time. So Sam's class shorted both. The S&P fell to its demand target and the trades paid. Shorting Intel while the S&P was not at supply would have been very low probability.",
      analogy: "A stock is like a boat in a harbour. When the tide (the index) goes out, almost every boat goes down with it."
    },
    bigIdeas: [
      "Supply = the origin of a decline: price cannot stay there because supply exceeds demand.",
      "Time stock entries to S&P/NASDAQ levels: short stocks when the index is at supply, buy when it is at demand.",
      "Plan pre-market: index at a level, room to its opposing level, stock at a matching level."
    ],
    steps: [
      {
        title: "Pre-market plan, part 1",
        narration: "The index has supply at the origin of an earlier decline, and demand much lower. That is enough room.",
        scene: {
          candles: [
            { o: 126, h: 133.54, l: 124.95, c: 132.33 },
            { o: 132.33, h: 141.53, l: 131.22, c: 140.71 },
            { o: 140.71, h: 147.67, l: 140.1, c: 146.68 },
            { o: 146.68, h: 154.11, l: 145.67, c: 153.08 },
            { o: 153.08, h: 160.64, l: 152.13, c: 160 },
            { o: 160, h: 160.57, l: 159.89, c: 160.45 },
            { o: 160.45, h: 160.58, l: 159.62, c: 159.82 },
            { o: 159.82, h: 160.69, l: 159.57, c: 160.4 },
            { o: 160.4, h: 161.06, l: 152.9, c: 153.46 },
            { o: 153.46, h: 154.14, l: 147, c: 147.15 },
            { o: 147.15, h: 147.55, l: 139.68, c: 140 },
            { o: 140, h: 142.08, l: 139.67, c: 141.76 },
            { o: 141.76, h: 141.86, l: 141.43, c: 141.7 },
            { o: 141.7, h: 144.66, l: 141.24, c: 144.28 },
            { o: 144.28, h: 144.34, l: 143.91, c: 144.15 },
            { o: 144.15, h: 146.58, l: 143.93, c: 146 },
            { o: 146, h: 151.47, l: 145.68, c: 150.95 },
            { o: 150.95, h: 155.46, l: 150.48, c: 154.98 },
            { o: 154.98, h: 159.03, l: 154.76, c: 158.42 },
            { o: 158.42, h: 160.17, l: 158.09, c: 159.02 },
            { o: 159.02, h: 159.17, l: 155.93, c: 156.04 },
            { o: 156.04, h: 156.38, l: 150.58, c: 150.85 },
            { o: 150.85, h: 151.24, l: 146.1, c: 146.6 },
            { o: 146.6, h: 146.75, l: 142.55, c: 142.67 },
            { o: 142.67, h: 142.79, l: 139.51, c: 139.83 },
            { o: 139.83, h: 140.39, l: 134.31, c: 134.5 },
            { o: 134.5, h: 134.77, l: 130.65, c: 131 }
          ],
          zones: [
            { from: 5, top: 160.69, bottom: 159.82, kind: "supply", label: "Supply (stock and index)" }
          ],
          reveal: 16
        }
      },
      {
        title: "Part 2: the stock agrees",
        narration: "The stock also has supply at the same moment. Index at supply + room + stock at supply = short both.",
        scene: {
          candles: [
            { o: 126, h: 133.54, l: 124.95, c: 132.33 },
            { o: 132.33, h: 141.53, l: 131.22, c: 140.71 },
            { o: 140.71, h: 147.67, l: 140.1, c: 146.68 },
            { o: 146.68, h: 154.11, l: 145.67, c: 153.08 },
            { o: 153.08, h: 160.64, l: 152.13, c: 160 },
            { o: 160, h: 160.57, l: 159.89, c: 160.45 },
            { o: 160.45, h: 160.58, l: 159.62, c: 159.82 },
            { o: 159.82, h: 160.69, l: 159.57, c: 160.4 },
            { o: 160.4, h: 161.06, l: 152.9, c: 153.46 },
            { o: 153.46, h: 154.14, l: 147, c: 147.15 },
            { o: 147.15, h: 147.55, l: 139.68, c: 140 },
            { o: 140, h: 142.08, l: 139.67, c: 141.76 },
            { o: 141.76, h: 141.86, l: 141.43, c: 141.7 },
            { o: 141.7, h: 144.66, l: 141.24, c: 144.28 },
            { o: 144.28, h: 144.34, l: 143.91, c: 144.15 },
            { o: 144.15, h: 146.58, l: 143.93, c: 146 },
            { o: 146, h: 151.47, l: 145.68, c: 150.95 },
            { o: 150.95, h: 155.46, l: 150.48, c: 154.98 },
            { o: 154.98, h: 159.03, l: 154.76, c: 158.42 },
            { o: 158.42, h: 160.17, l: 158.09, c: 159.02 },
            { o: 159.02, h: 159.17, l: 155.93, c: 156.04 },
            { o: 156.04, h: 156.38, l: 150.58, c: 150.85 },
            { o: 150.85, h: 151.24, l: 146.1, c: 146.6 },
            { o: 146.6, h: 146.75, l: 142.55, c: 142.67 },
            { o: 142.67, h: 142.79, l: 139.51, c: 139.83 },
            { o: 139.83, h: 140.39, l: 134.31, c: 134.5 },
            { o: 134.5, h: 134.77, l: 130.65, c: 131 }
          ],
          zones: [
            { from: 5, top: 160.69, bottom: 159.82, kind: "supply", label: "Supply (stock and index)" }
          ],
          notes: [
            { x: 16, y: 162.69, text: "S&P at supply too" }
          ],
          reveal: 19
        }
      },
      {
        title: "Short both",
        narration: "Price rallies into the zone. Sell at the bottom line, stop above. The exit is when the index reaches its demand.",
        scene: {
          candles: [
            { o: 126, h: 133.54, l: 124.95, c: 132.33 },
            { o: 132.33, h: 141.53, l: 131.22, c: 140.71 },
            { o: 140.71, h: 147.67, l: 140.1, c: 146.68 },
            { o: 146.68, h: 154.11, l: 145.67, c: 153.08 },
            { o: 153.08, h: 160.64, l: 152.13, c: 160 },
            { o: 160, h: 160.57, l: 159.89, c: 160.45 },
            { o: 160.45, h: 160.58, l: 159.62, c: 159.82 },
            { o: 159.82, h: 160.69, l: 159.57, c: 160.4 },
            { o: 160.4, h: 161.06, l: 152.9, c: 153.46 },
            { o: 153.46, h: 154.14, l: 147, c: 147.15 },
            { o: 147.15, h: 147.55, l: 139.68, c: 140 },
            { o: 140, h: 142.08, l: 139.67, c: 141.76 },
            { o: 141.76, h: 141.86, l: 141.43, c: 141.7 },
            { o: 141.7, h: 144.66, l: 141.24, c: 144.28 },
            { o: 144.28, h: 144.34, l: 143.91, c: 144.15 },
            { o: 144.15, h: 146.58, l: 143.93, c: 146 },
            { o: 146, h: 151.47, l: 145.68, c: 150.95 },
            { o: 150.95, h: 155.46, l: 150.48, c: 154.98 },
            { o: 154.98, h: 159.03, l: 154.76, c: 158.42 },
            { o: 158.42, h: 160.17, l: 158.09, c: 159.02 },
            { o: 159.02, h: 159.17, l: 155.93, c: 156.04 },
            { o: 156.04, h: 156.38, l: 150.58, c: 150.85 },
            { o: 150.85, h: 151.24, l: 146.1, c: 146.6 },
            { o: 146.6, h: 146.75, l: 142.55, c: 142.67 },
            { o: 142.67, h: 142.79, l: 139.51, c: 139.83 },
            { o: 139.83, h: 140.39, l: 134.31, c: 134.5 },
            { o: 134.5, h: 134.77, l: 130.65, c: 131 }
          ],
          zones: [
            { from: 5, top: 160.69, bottom: 159.82, kind: "supply", label: "Supply (stock and index)" }
          ],
          lines: [
            { y: 159.82, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 160.94, label: "Stop above distal", kind: "sl", from: 7 },
            { y: 132, label: "Exit: index demand", kind: "tp", from: 7 }
          ],
          reveal: 20
        }
      },
      {
        title: "Target met",
        narration: "The index falls to its demand and the stock follows. Both trades are closed there.",
        scene: {
          candles: [
            { o: 126, h: 133.54, l: 124.95, c: 132.33 },
            { o: 132.33, h: 141.53, l: 131.22, c: 140.71 },
            { o: 140.71, h: 147.67, l: 140.1, c: 146.68 },
            { o: 146.68, h: 154.11, l: 145.67, c: 153.08 },
            { o: 153.08, h: 160.64, l: 152.13, c: 160 },
            { o: 160, h: 160.57, l: 159.89, c: 160.45 },
            { o: 160.45, h: 160.58, l: 159.62, c: 159.82 },
            { o: 159.82, h: 160.69, l: 159.57, c: 160.4 },
            { o: 160.4, h: 161.06, l: 152.9, c: 153.46 },
            { o: 153.46, h: 154.14, l: 147, c: 147.15 },
            { o: 147.15, h: 147.55, l: 139.68, c: 140 },
            { o: 140, h: 142.08, l: 139.67, c: 141.76 },
            { o: 141.76, h: 141.86, l: 141.43, c: 141.7 },
            { o: 141.7, h: 144.66, l: 141.24, c: 144.28 },
            { o: 144.28, h: 144.34, l: 143.91, c: 144.15 },
            { o: 144.15, h: 146.58, l: 143.93, c: 146 },
            { o: 146, h: 151.47, l: 145.68, c: 150.95 },
            { o: 150.95, h: 155.46, l: 150.48, c: 154.98 },
            { o: 154.98, h: 159.03, l: 154.76, c: 158.42 },
            { o: 158.42, h: 160.17, l: 158.09, c: 159.02 },
            { o: 159.02, h: 159.17, l: 155.93, c: 156.04 },
            { o: 156.04, h: 156.38, l: 150.58, c: 150.85 },
            { o: 150.85, h: 151.24, l: 146.1, c: 146.6 },
            { o: 146.6, h: 146.75, l: 142.55, c: 142.67 },
            { o: 142.67, h: 142.79, l: 139.51, c: 139.83 },
            { o: 139.83, h: 140.39, l: 134.31, c: 134.5 },
            { o: 134.5, h: 134.77, l: 130.65, c: 131 }
          ],
          zones: [
            { from: 5, top: 160.69, bottom: 159.82, kind: "supply", label: "Supply (stock and index)" }
          ],
          lines: [
            { y: 159.82, label: "Entry (proximal)", kind: "entry", from: 7 },
            { y: 160.94, label: "Stop above distal", kind: "sl", from: 7 },
            { y: 132, label: "Exit: index demand", kind: "tp", from: 7 }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "The stock is at supply but the S&P is at demand. Short the stock?",
        options: ["Yes, the stock is at supply", "No: very low probability", "Short double", "Buy the stock"],
        answer: 1,
        explain: "Shorting a stock when the index is not at supply is very low probability."
      },
      {
        type: "order",
        q: "Order the pre-market plan.",
        items: [
          "Is the S&P at supply?",
          "Is demand much lower (room)?",
          "Is the stock at supply?",
          "Short both, exit at index demand"
        ],
        explain: "Index first, then room, then the stock."
      },
      {
        type: "spot",
        q: "Click the candle where both shorts were entered.",
        scene: {
          candles: [
            { o: 126, h: 133.54, l: 124.95, c: 132.33 },
            { o: 132.33, h: 141.53, l: 131.22, c: 140.71 },
            { o: 140.71, h: 147.67, l: 140.1, c: 146.68 },
            { o: 146.68, h: 154.11, l: 145.67, c: 153.08 },
            { o: 153.08, h: 160.64, l: 152.13, c: 160 },
            { o: 160, h: 160.57, l: 159.89, c: 160.45 },
            { o: 160.45, h: 160.58, l: 159.62, c: 159.82 },
            { o: 159.82, h: 160.69, l: 159.57, c: 160.4 },
            { o: 160.4, h: 161.06, l: 152.9, c: 153.46 },
            { o: 153.46, h: 154.14, l: 147, c: 147.15 },
            { o: 147.15, h: 147.55, l: 139.68, c: 140 },
            { o: 140, h: 142.08, l: 139.67, c: 141.76 },
            { o: 141.76, h: 141.86, l: 141.43, c: 141.7 },
            { o: 141.7, h: 144.66, l: 141.24, c: 144.28 },
            { o: 144.28, h: 144.34, l: 143.91, c: 144.15 },
            { o: 144.15, h: 146.58, l: 143.93, c: 146 },
            { o: 146, h: 151.47, l: 145.68, c: 150.95 },
            { o: 150.95, h: 155.46, l: 150.48, c: 154.98 },
            { o: 154.98, h: 159.03, l: 154.76, c: 158.42 },
            { o: 158.42, h: 160.17, l: 158.09, c: 159.02 },
            { o: 159.02, h: 159.17, l: 155.93, c: 156.04 },
            { o: 156.04, h: 156.38, l: 150.58, c: 150.85 },
            { o: 150.85, h: 151.24, l: 146.1, c: 146.6 },
            { o: 146.6, h: 146.75, l: 142.55, c: 142.67 },
            { o: 142.67, h: 142.79, l: 139.51, c: 139.83 },
            { o: 139.83, h: 140.39, l: 134.31, c: 134.5 },
            { o: 134.5, h: 134.77, l: 130.65, c: 131 }
          ],
          zones: [
            { from: 5, top: 160.69, bottom: 159.82, kind: "supply", label: "Supply (stock and index)" }
          ]
        },
        answer: { from: 19, to: 19 },
        explain: "The rally into supply, at the same time as the index."
      },
      {
        type: "tf",
        q: "Supply levels are the origins of price declines.",
        answer: true,
        explain: "Price cannot stay there because supply exceeds demand."
      },
      {
        type: "mcq",
        q: "Order ticket: sell 5 at 1,167.25, buy 5 at 1,163.00. How many points?",
        options: ["3.25", "4.25", "5.25", "1.25"],
        answer: 1,
        explain: "A 4.25-point S&P futures short."
      }
    ],
    practice: [
      {
        prompt: "Your stock is rallying into its supply, but the S&P is sitting at demand and turning up. Sell, buy or nothing?",
        scene: {
          candles: [
            { o: 128, h: 133.85, l: 127.69, c: 133.58 },
            { o: 133.58, h: 142.44, l: 131.9, c: 141.24 },
            { o: 141.24, h: 146.37, l: 140.77, c: 145.75 },
            { o: 145.75, h: 153.25, l: 145.44, c: 152.3 },
            { o: 152.3, h: 158.49, l: 151.62, c: 158 },
            { o: 158, h: 158.39, l: 157.83, c: 158.29 },
            { o: 158.29, h: 158.54, l: 157.65, c: 157.81 },
            { o: 157.81, h: 158.33, l: 157.69, c: 158.21 },
            { o: 158.21, h: 158.76, l: 153.2, c: 153.53 },
            { o: 153.53, h: 153.79, l: 149.02, c: 149.37 },
            { o: 149.37, h: 149.71, l: 144.73, c: 145 },
            { o: 145, h: 146.53, l: 144.68, c: 146.32 },
            { o: 146.32, h: 146.38, l: 145.4, c: 145.61 },
            { o: 145.61, h: 148, l: 145.04, c: 147.8 },
            { o: 147.8, h: 148.18, l: 146.09, c: 146.51 },
            { o: 146.51, h: 148.51, l: 146.24, c: 148 },
            { o: 148, h: 151.58, l: 147.5, c: 151.35 },
            { o: 151.35, h: 153.54, l: 150.97, c: 153.4 },
            { o: 153.4, h: 156.79, l: 153.15, c: 156.41 },
            { o: 156.41, h: 158.1, l: 155.92, c: 158.01 },
            { o: 158.01, h: 159.47, l: 157.93, c: 159.38 },
            { o: 159.38, h: 160.74, l: 159.19, c: 160.67 },
            { o: 160.67, h: 162.4, l: 160.36, c: 162.12 },
            { o: 162.12, h: 163.6, l: 161.98, c: 163.37 },
            { o: 163.37, h: 164.52, l: 163.24, c: 164.37 },
            { o: 164.37, h: 165.6, l: 164.28, c: 165.54 }
          ],
          zones: [
            { from: 5, top: 158.54, bottom: 157.81, kind: "supply", label: "Supply" }
          ],
          notes: [
            { x: 16, y: 160.54, text: "S&P at demand" }
          ],
          reveal: 19
        },
        task: "buy-sell-none",
        answer: { side: "none" },
        explain: "Index and stock do not line up. Skip the short. The market rallied and the stock broke above its supply."
      }
    ],
    cards: [
      { front: "Key to timing stock entries?", back: "The S&P and NASDAQ supply and demand levels." },
      { front: "Stock short needs the index at?", back: "Supply." },
      {
        front: "Pre-market checklist?",
        back: "Index at a level, room to the opposing level, stock at a matching level."
      },
      { front: "Exit for both trades?", back: "When the index reaches its demand." }
    ],
    mnemonic: "When the tide goes out, every boat sinks: index first."
  }
];
