// Interactive teaching layer for mentor "baker" (Kevin Baker, supply & demand book), lessons 1-14.
// Generated scenes: every candle has h >= max(o,c) and l <= min(o,c). Baker draws a zone on the FULL candle(s)
// it started from: demand top = highest high (proximal), bottom = lowest low (distal); supply mirrored.
import type { InteractiveLesson } from './types';

export const IL_BAKER: InteractiveLesson[] = [
  {
    mentor: "baker",
    n: 1,
    eli5: {
      oneLiner: "Read the buyers and sellers on price itself, not on gadgets.",
      story: "You want to know if the ice-cream shop is busy. You could ask a weather machine that is right only half the time. Or you could just look at the line of kids at the door. Baker says indicators are the weather machine, and price is the line of kids. And if you hide your piggy bank where everyone hides theirs, the bully finds it first.",
      analogy: "An indicator is a weather forecast that is right about half the time. A zone is looking out the window at the real crowd."
    },
    bigIdeas: [
      "Lagging indicators get you in late. Leading indicators give false signals.",
      "Winners win because of risk rules and sticking to a plan, not because of a gadget.",
      "Put your stop beyond a zone, not where the crowd puts theirs."
    ],
    steps: [
      {
        title: "Price turns first",
        narration: "Look at the turn at the bottom. Buyers took over right there. A moving-average crossover only lights up after a big part of the rally is already gone. That is what \"lagging\" means: it tells you late.",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          highlight: {
            from: 6,
            to: 8,
            label: "the turn"
          },
          notes: [
            {
              x: 12,
              y: 160,
              text: "A moving-average cross fires about here: late"
            },
            {
              x: 6,
              y: 143.92,
              text: "Price itself shows the turn"
            }
          ]
        }
      },
      {
        title: "The zone shows entry and stop up front",
        narration: "Baker skips the gadget and boxes the candles where the turn happened. This is a demand zone: a place with more willing buyers than sellers. The near line is the proximal line, the far line is the distal line.",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          highlight: {
            from: 6,
            to: 8,
            label: "the turn"
          },
          notes: [
            {
              x: 12,
              y: 160,
              text: "A moving-average cross fires about here: late"
            },
            {
              x: 6,
              y: 143.92,
              text: "Price itself shows the turn"
            }
          ],
          zones: [
            {
              from: 6,
              top: 146.57,
              bottom: 145.42,
              kind: "demand",
              label: "Demand zone (where buyers took over)"
            }
          ],
          lines: [
            {
              y: 146.57,
              label: "Proximal (near line)",
              kind: "proximal",
              from: 6
            },
            {
              y: 145.42,
              label: "Distal (far line)",
              kind: "distal",
              from: 6
            }
          ]
        }
      },
      {
        title: "Where the crowd hides its stops",
        narration: "Most traders put their stop just under the obvious swing low. Professionals know this. A bunch of stops sitting in one obvious place is like candy on the floor.",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          notes: [
            {
              x: 14,
              y: 152.4,
              text: "Everyone sees this low"
            }
          ],
          zones: [
            {
              from: 6,
              top: 146.57,
              bottom: 145.42,
              kind: "demand",
              label: "Demand zone (where buyers took over)"
            }
          ],
          lines: [
            {
              y: 146.57,
              label: "Proximal (near line)",
              kind: "proximal",
              from: 6
            },
            {
              y: 145.42,
              label: "Distal (far line)",
              kind: "distal",
              from: 6
            },
            {
              y: 153.4,
              label: "Crowd stops under the obvious swing low",
              kind: "level",
              from: 14
            }
          ]
        }
      },
      {
        title: "The stop hunt",
        narration: "Price is pushed down through the obvious low. The crowd is stopped out, and the professionals buy their shares cheaply near the real demand zone. Then price turns up. A stop a few cents below the zone was never touched.",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          highlight: {
            from: 19,
            to: 22,
            label: "stop hunt"
          },
          notes: [
            {
              x: 22,
              y: 150.4,
              text: "Crowd stopped out here"
            },
            {
              x: 28,
              y: 170,
              text: "Zone holds, Baker stop survives"
            }
          ],
          zones: [
            {
              from: 6,
              top: 146.57,
              bottom: 145.42,
              kind: "demand",
              label: "Demand zone (where buyers took over)"
            }
          ],
          lines: [
            {
              y: 146.57,
              label: "Proximal (near line)",
              kind: "proximal",
              from: 6
            },
            {
              y: 145.42,
              label: "Distal (far line)",
              kind: "distal",
              from: 6
            },
            {
              y: 153.4,
              label: "Crowd stops under the obvious swing low",
              kind: "level",
              from: 14
            },
            {
              y: 145.39,
              label: "Baker stop: a few cents below the zone",
              kind: "sl",
              from: 6
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "What is the problem with lagging indicators like MACD or moving averages?",
        options: [
          "They get you into the trade late",
          "They give too many false signals",
          "They only work on weekly charts",
          "They cannot be used on stocks"
        ],
        answer: 0,
        explain: "Lagging tools are built from past prices, so they confirm a move after much of it has happened. False signals are the problem of the other family, the leading oscillators like RSI and Stochastic."
      },
      {
        type: "mcq",
        q: "Baker says the few indicator traders who win consistently win because of...",
        options: [
          "Risk management and sticking to their plan",
          "A secret indicator setting",
          "Using more indicators than others",
          "Trading only expensive stocks"
        ],
        answer: 0,
        explain: "Baker calls them the exception. Their edge is strict risk rules and plan discipline. A trader with the same rules who just buys pullbacks in uptrends could get similar results."
      },
      {
        type: "tf",
        q: "In craps, a new dealer changes the odds of rolling a seven.",
        answer: false,
        explain: "The odds stay one in six (16.7%) no matter who deals. Crediting the dealer is superstition, just like crediting a MACD crossover for a winning trade."
      },
      {
        type: "spot",
        q: "Click the candles where the crowd's stops under the obvious swing low got hunted.",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          zones: [
            {
              from: 6,
              top: 146.57,
              bottom: 145.42,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 153.4,
              label: "Crowd stops",
              kind: "level",
              from: 14
            }
          ]
        },
        answer: {
          from: 20,
          to: 22
        },
        explain: "Price was pushed through the obvious low into the demand zone, filling the professionals at a better price. Then it turned up. Stops under the zone survived."
      },
      {
        type: "tf",
        q: "For a long trade, Baker places the stop a few cents below the demand zone, not just under the obvious swing low.",
        answer: true,
        explain: "A stop beyond the zone is harder to hunt. Price must break the whole zone before it is hit, and if that happens the trade idea is wrong anyway."
      },
      {
        type: "order",
        q: "Put the stop hunt in order.",
        items: [
          "The crowd parks stops under the obvious swing low",
          "Professionals push price down through those stops",
          "They get filled cheaply near the demand zone",
          "Price turns up; a stop below the zone survives"
        ],
        explain: "Professionals know where the crowd's stops sit and where the nearest zone is. If the zone is far enough away, they can push price through the stops first."
      },
      {
        type: "mcq",
        q: "You are an experienced trader who likes your RSI. What does Baker say?",
        options: [
          "Keep it, but put the zone rules on top of it",
          "Throw it away today",
          "Use it instead of zones",
          "Add five more indicators"
        ],
        answer: 0,
        explain: "Baker lets seasoned traders keep favourite indicators, as long as the zone rules sit on top to raise the hit rate. The indicator never replaces the zone."
      }
    ],
    practice: [
      {
        prompt: "Price just ran through the obvious swing low and dipped into fresh demand. The indicator crowd got stopped out. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 170, h: 170.64, l: 164.99, c: 165.64 },
            { o: 165.64, h: 166.13, l: 161.77, c: 161.97 },
            { o: 161.97, h: 162.13, l: 157.24, c: 157.76 },
            { o: 157.76, h: 158.08, l: 153.99, c: 154.37 },
            { o: 154.37, h: 155.06, l: 149.76, c: 150.27 },
            { o: 150.27, h: 150.72, l: 145.42, c: 146 },
            { o: 146, h: 146.57, l: 145.76, c: 146.1 },
            { o: 146.1, h: 146.16, l: 145.42, c: 145.85 },
            { o: 145.85, h: 146.38, l: 145.76, c: 145.99 },
            { o: 145.99, h: 149.46, l: 145.86, c: 149.32 },
            { o: 149.32, h: 153.45, l: 149.25, c: 153.25 },
            { o: 153.25, h: 158.13, l: 153.17, c: 158 },
            { o: 158, h: 158.12, l: 156.12, c: 156.3 },
            { o: 156.3, h: 156.45, l: 155.15, c: 155.2 },
            { o: 155.2, h: 155.4, l: 153.6, c: 154.6 },
            { o: 154.6, h: 156.63, l: 154.31, c: 156.4 },
            { o: 156.4, h: 159.99, l: 155.98, c: 159.44 },
            { o: 159.44, h: 161.88, l: 159.19, c: 161.7 },
            { o: 161.7, h: 164.1, l: 161.6, c: 164 },
            { o: 164, h: 164.39, l: 159.82, c: 160.02 },
            { o: 160.02, h: 160.35, l: 156.2, c: 156.39 },
            { o: 156.39, h: 156.58, l: 152.12, c: 152.4 },
            { o: 152.4, h: 152.8, l: 146.12, c: 152.75 },
            { o: 152.75, h: 155.49, l: 152.58, c: 155.2 },
            { o: 155.2, h: 158.76, l: 154.66, c: 158.43 },
            { o: 158.43, h: 162.22, l: 158.28, c: 161.95 },
            { o: 161.95, h: 166.35, l: 161.68, c: 166.11 },
            { o: 166.11, h: 169.17, l: 165.57, c: 168.96 },
            { o: 168.96, h: 172.42, l: 168.52, c: 172 }
          ],
          zones: [
            {
              from: 6,
              top: 146.57,
              bottom: 145.42,
              kind: "demand"
            }
          ],
          reveal: 22
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 145.39
        },
        explain: "The drop was a stop hunt into real demand (145.42-146.57). Baker buys at the zone with the stop a few cents below it (145.39), where the hunters cannot easily reach it. Price turned up from the zone."
      }
    ],
    cards: [
      {
        front: "What are the two families of indicators?",
        back: "Leading (oscillators like RSI, Stochastic) and lagging (built from moving averages, like MACD)."
      },
      {
        front: "Lagging indicator problem?",
        back: "They get you into the trade late."
      },
      {
        front: "Leading indicator problem?",
        back: "They fire false signals."
      },
      {
        front: "What is the real edge of winning indicator traders?",
        back: "Risk management and sticking to the trading plan."
      },
      {
        front: "Odds of a seven in craps after the dealer changes?",
        back: "Still one in six (16.7%). The ritual changes nothing."
      },
      {
        front: "Where does Baker put the stop on a long?",
        back: "A few cents below the demand zone (on a short: a few cents above the supply zone)."
      },
      {
        front: "Why are obvious stops dangerous?",
        back: "Professionals know where they sit and can push price through them to get a better fill."
      }
    ],
    mnemonic: "Lagging is LATE, leading is FAKE, the zone is the real thing."
  },
  {
    mentor: "baker",
    n: 2,
    eli5: {
      oneLiner: "Only three candles matter: the doji, the hammer and the shooting star.",
      story: "Two teams play tug-of-war every hour, and each candle is one hour. If the rope ends right where it started, nobody won: that is a doji. If one team drags the rope far to its side but the other team pulls it all the way back, the second team won: that is a hammer or a shooting star. The long wick is how far the losing team got before it lost.",
      analogy: "A candle is a tug-of-war picture. The wick is how far one team pulled; the body is where the rope ended up."
    },
    bigIdeas: [
      "Doji means balance. Hammer means buyers won. Shooting star means sellers won.",
      "Body colour does not matter for these three.",
      "Every multi-candle reversal merges into a hammer or shooting star. One candle is faster, and faster is stronger."
    ],
    steps: [
      {
        title: "What one candle tells you",
        narration: "A candle shows four prices: open, high, low and close. The body runs from open to close: green if it closed higher, red if lower. The thin wicks show how far traders pushed price before it came back.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          highlight: {
            from: 5,
            to: 5,
            label: "one candle"
          },
          notes: [
            {
              x: 5,
              y: 148.1,
              text: "Body = open to close"
            },
            {
              x: 5,
              y: 140.2,
              text: "Wick = how far price was pushed"
            }
          ]
        }
      },
      {
        title: "The doji: balance",
        narration: "A small body roughly in the middle of long wicks. Price went up, went down, and closed near where it opened. For that moment, supply and demand are in balance.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          highlight: {
            from: 10,
            to: 10,
            label: "doji"
          },
          notes: [
            {
              x: 10,
              y: 155.3,
              text: "Doji: small centred body. Balance."
            }
          ]
        }
      },
      {
        title: "The hammer: buyers win",
        narration: "Long lower wick, small body at the top. Sellers were in charge down to the bottom of the wick, then buyers took over and pushed price back up to or above the open. Colour does not matter.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          highlight: {
            from: 5,
            to: 5,
            label: "hammer"
          },
          notes: [
            {
              x: 5,
              y: 140,
              text: "Hammer: sellers pushed down, buyers took over"
            }
          ]
        }
      },
      {
        title: "The shooting star: sellers win",
        narration: "Long upper wick, small body at the bottom. Buyers pushed price up to the top of the wick, then sellers took over and pushed it back down to or below the open. A small lower wick is allowed.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          highlight: {
            from: 15,
            to: 15,
            label: "shooting star"
          },
          notes: [
            {
              x: 15,
              y: 164.4,
              text: "Shooting star: buyers pushed up, sellers took over"
            }
          ]
        }
      },
      {
        title: "Merge many candles into one",
        narration: "You do not need to learn named patterns. Merge them: the open of the first candle, the close of the last, the highest high and the lowest low. A bullish engulfing merges into a hammer. A bearish engulfing merges into a shooting star.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          highlight: {
            from: 20,
            to: 21,
            label: "engulfing"
          },
          notes: [
            {
              x: 21,
              y: 146,
              text: "Merged: open 151.00, high 152.40, low 147.20, close 152.10 = a hammer"
            }
          ]
        }
      },
      {
        title: "Faster means stronger",
        narration: "A two-candle turn is just a hammer that took longer to form. Baker wants the single-candle version: the faster price moves in and out of a turning point, the stronger the imbalance of supply and demand.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ],
          notes: [
            {
              x: 5,
              y: 140,
              text: "Fast: turned in ONE candle"
            },
            {
              x: 21,
              y: 146,
              text: "Slower: turned in two candles"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "spot",
        q: "Click the hammer.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ]
        },
        answer: {
          from: 5,
          to: 5
        },
        explain: "Long lower wick and a small body near the top: sellers pushed down, then buyers took over and closed it back up near the open."
      },
      {
        type: "spot",
        q: "Click the shooting star.",
        scene: {
          candles: [
            { o: 160, h: 160.15, l: 157.35, c: 157.48 },
            { o: 157.48, h: 157.7, l: 154.87, c: 155.07 },
            { o: 155.07, h: 155.25, l: 152.07, c: 152.18 },
            { o: 152.18, h: 152.67, l: 148.44, c: 148.6 },
            { o: 148.6, h: 148.81, l: 145.72, c: 146 },
            { o: 146, h: 146.6, l: 141, c: 146.3 },
            { o: 146.3, h: 147.69, l: 146.24, c: 147.59 },
            { o: 147.59, h: 149.14, l: 147.45, c: 149.01 },
            { o: 149.01, h: 151.04, l: 148.78, c: 150.88 },
            { o: 150.88, h: 152.12, l: 150.76, c: 152 },
            { o: 152, h: 154.3, l: 149.8, c: 152.05 },
            { o: 152.05, h: 153.93, l: 151.9, c: 153.73 },
            { o: 153.73, h: 155.54, l: 153.64, c: 155.42 },
            { o: 155.42, h: 157.09, l: 155.22, c: 157.03 },
            { o: 157.03, h: 158.58, l: 156.95, c: 158.5 },
            { o: 158.5, h: 163.4, l: 158.2, c: 158.35 },
            { o: 158.35, h: 158.42, l: 156.5, c: 156.62 },
            { o: 156.62, h: 156.76, l: 154.74, c: 154.95 },
            { o: 154.95, h: 155.01, l: 153.1, c: 153.21 },
            { o: 153.21, h: 153.4, l: 150.84, c: 151 },
            { o: 151, h: 151.3, l: 148.3, c: 148.6 },
            { o: 148.4, h: 152.4, l: 147.2, c: 152.1 },
            { o: 152.1, h: 153.5, l: 152.01, c: 153.34 },
            { o: 153.34, h: 154.66, l: 153.21, c: 154.56 },
            { o: 154.56, h: 156.08, l: 154.51, c: 156 }
          ]
        },
        answer: {
          from: 15,
          to: 15
        },
        explain: "Long upper wick and a small body at the bottom: buyers pushed up, then sellers took control and pushed price back down."
      },
      {
        type: "tf",
        q: "A hammer with a red body is not a real hammer.",
        answer: false,
        explain: "For all three of Baker's candles, the colour of the body is not important. Only the shape counts."
      },
      {
        type: "mcq",
        q: "A bullish engulfing pattern merges into which single candle?",
        options: [
          "A hammer",
          "A shooting star",
          "A doji",
          "None of them"
        ],
        answer: 0,
        explain: "First open (high), lowest low, last close (back near the top). That is a long lower wick with a body at the top: a hammer."
      },
      {
        type: "order",
        q: "How do you merge several candles into one?",
        items: [
          "Take the open of the first candle",
          "Take the close of the last candle",
          "Take the highest high and the lowest low of the group",
          "Colour it red if close is below open, otherwise green"
        ],
        explain: "This is Baker's merge rule. Every multi-candle reversal turns into a hammer or a shooting star."
      },
      {
        type: "mcq",
        q: "What does a doji tell you?",
        options: [
          "Supply and demand are in balance for now",
          "Buyers won big",
          "Sellers won big",
          "The trend is guaranteed to reverse"
        ],
        answer: 0,
        explain: "Price moved above and below the open and closed near it. Nobody won that candle."
      },
      {
        type: "tf",
        q: "Baker prefers single-candle reversals because faster moves in and out of a pivot show a stronger imbalance.",
        answer: true,
        explain: "Speed is strength. A multi-candle turn is the same idea formed more slowly, so it is weaker."
      }
    ],
    practice: [
      {
        prompt: "After a long fall, this candle appears. Who won the candle, and which way do you lean?",
        scene: {
          candles: [
            { o: 165, h: 165.23, l: 162.32, c: 162.52 },
            { o: 162.52, h: 162.71, l: 160.19, c: 160.34 },
            { o: 160.34, h: 160.46, l: 157.39, c: 157.7 },
            { o: 157.7, h: 158.04, l: 154.68, c: 154.96 },
            { o: 154.96, h: 155.11, l: 152.28, c: 152.35 },
            { o: 152.35, h: 152.74, l: 148.91, c: 149.07 },
            { o: 149.07, h: 149.16, l: 146.88, c: 147 },
            { o: 147, h: 147.5, l: 142.4, c: 147.3 },
            { o: 147.3, h: 148.9, l: 147.23, c: 148.7 },
            { o: 148.7, h: 150.58, l: 148.62, c: 150.43 },
            { o: 150.43, h: 152.76, l: 150.25, c: 152.57 },
            { o: 152.57, h: 155.18, l: 152.35, c: 154.76 },
            { o: 154.76, h: 156.75, l: 154.61, c: 156.5 },
            { o: 156.5, h: 158.27, l: 156.42, c: 158 }
          ],
          reveal: 8,
          highlight: {
            from: 7,
            to: 7
          }
        },
        task: "buy-sell-none",
        answer: {
          side: "buy"
        },
        explain: "It is a hammer: sellers drove price down to the bottom of the wick, then buyers took over and closed it near the top. Buyers won the tug-of-war. In later lessons this candle becomes the pivot that defines a demand zone and the with-trend entry trigger."
      }
    ],
    cards: [
      {
        front: "The three candles Baker uses?",
        back: "Doji, hammer, shooting star."
      },
      {
        front: "Doji means?",
        back: "Small centred body: supply and demand in balance."
      },
      {
        front: "Hammer shape and meaning?",
        back: "Long lower wick, small body at the top: buyers took over from sellers."
      },
      {
        front: "Shooting star shape and meaning?",
        back: "Long upper wick, small body at the bottom: sellers took over from buyers."
      },
      {
        front: "Does body colour matter?",
        back: "No, not for these three candles."
      },
      {
        front: "How to merge candles?",
        back: "First open, last close, highest high, lowest low."
      },
      {
        front: "Bearish engulfing merges into?",
        back: "A shooting star."
      },
      {
        front: "Why only single-candle reversals?",
        back: "The faster price moves in and out of a pivot, the stronger the imbalance."
      }
    ],
    mnemonic: "D-H-S: Draw (doji, tie), Hammer (buyers hit back), Star (sellers shoot it down)."
  },
  {
    mentor: "baker",
    n: 3,
    eli5: {
      oneLiner: "Price moves because buyers and sellers are out of balance.",
      story: "Imagine a lemonade stand. If lots of kids want lemonade and there is only a little, the price goes up. If there is a giant pile of lemonade and nobody is thirsty, the price goes down. When the number of thirsty kids matches the cups, the price sits still. Every time a chart turns around, one side just got bigger than the other.",
      analogy: "A seesaw: more buyers on one side lifts price, more sellers on the other side drops it, and equal weight keeps it flat."
    },
    bigIdeas: [
      "At every swing low, demand beat supply. At every swing high, supply beat demand.",
      "Tight sideways trading means balance: nothing to trade inside it.",
      "Your edge is knowing where the zones of extra supply and demand sit."
    ],
    steps: [
      {
        title: "A swing low is a win for buyers",
        narration: "Supply means willing sellers, demand means willing buyers. When price turns up from a low, willing buyers became more than willing sellers and forced price to reverse.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ],
          highlight: {
            from: 3,
            to: 3,
            label: "swing low"
          },
          notes: [
            {
              x: 3,
              y: 128.4,
              text: "Demand became greater than supply"
            }
          ]
        }
      },
      {
        title: "A swing high is a win for sellers",
        narration: "At the top the opposite happened: willing sellers became more than willing buyers, so price turned down.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ],
          highlight: {
            from: 8,
            to: 8,
            label: "swing high"
          },
          notes: [
            {
              x: 3,
              y: 128.4,
              text: "Demand became greater than supply"
            },
            {
              x: 8,
              y: 145,
              text: "Supply became greater than demand"
            }
          ]
        }
      },
      {
        title: "Trends show who is stronger",
        narration: "An uptrend means demand is stronger than supply. You see higher lows. A downtrend is the opposite.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ],
          notes: [
            {
              x: 3,
              y: 128.4,
              text: "Demand became greater than supply"
            },
            {
              x: 8,
              y: 145,
              text: "Supply became greater than demand"
            }
          ],
          trendlines: [
            {
              x1: 3,
              y1: 129.6,
              x2: 12,
              y2: 135.2,
              label: "Higher lows: demand stronger = uptrend"
            }
          ]
        }
      },
      {
        title: "Sideways and tight means balance",
        narration: "When price trades sideways in a tight range, supply and demand are in balance. Balance does not move price, so there is no imbalance to trade inside it.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ],
          notes: [
            {
              x: 3,
              y: 128.4,
              text: "Demand became greater than supply"
            },
            {
              x: 8,
              y: 145,
              text: "Supply became greater than demand"
            },
            {
              x: 20,
              y: 150.6,
              text: "Tight sideways = supply and demand in balance"
            }
          ],
          trendlines: [
            {
              x1: 3,
              y1: 129.6,
              x2: 12,
              y2: 135.2,
              label: "Higher lows: demand stronger = uptrend"
            }
          ],
          highlight: {
            from: 17,
            to: 23,
            label: "balance"
          }
        }
      },
      {
        title: "Mark the zones",
        narration: "Baker's edge is plotting where these imbalances happened, as supply zones and demand zones, and then picking the ones most likely to give a profitable trade. Past price action predicts through these zones, not through indicators.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ],
          notes: [
            {
              x: 12,
              y: 133.7,
              text: "Mark the zones where the balance changed"
            }
          ],
          trendlines: [
            {
              x1: 3,
              y1: 129.6,
              x2: 12,
              y2: 135.2,
              label: "Higher lows: demand stronger = uptrend"
            }
          ],
          zones: [
            {
              from: 3,
              top: 132.4,
              bottom: 129.6,
              kind: "demand",
              label: "Demand"
            },
            {
              from: 8,
              top: 143.8,
              bottom: 141.2,
              kind: "supply",
              label: "Supply",
              to: 15
            },
            {
              from: 12,
              top: 137.3,
              bottom: 135.2,
              kind: "demand",
              label: "Demand"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Demand goes up and supply stays the same. What happens to price?",
        options: [
          "Shortage, price goes up",
          "Surplus, price goes down",
          "Nothing changes",
          "Price goes sideways forever"
        ],
        answer: 0,
        explain: "More buyers chasing the same amount creates a shortage, which pushes price higher. That is one of the four basic laws."
      },
      {
        type: "mcq",
        q: "Supply goes up and demand stays the same. What happens to price?",
        options: [
          "Surplus, price goes down",
          "Shortage, price goes up",
          "Price doubles",
          "Nothing changes"
        ],
        answer: 0,
        explain: "More sellers than the buyers want creates a surplus, so price falls."
      },
      {
        type: "spot",
        q: "Click the candles where supply and demand were in balance.",
        scene: {
          candles: [
            { o: 140, h: 140.36, l: 136.47, c: 136.77 },
            { o: 136.77, h: 136.92, l: 134.36, c: 134.63 },
            { o: 134.63, h: 134.85, l: 131.75, c: 132 },
            { o: 132, h: 132.4, l: 129.6, c: 132.2 },
            { o: 132.2, h: 135.24, l: 131.93, c: 134.8 },
            { o: 134.8, h: 137.73, l: 134.53, c: 137.42 },
            { o: 137.42, h: 140.34, l: 137.15, c: 140.09 },
            { o: 140.09, h: 142.3, l: 139.95, c: 142 },
            { o: 142, h: 143.8, l: 141.2, c: 141.5 },
            { o: 141.5, h: 141.72, l: 139.62, c: 139.7 },
            { o: 139.7, h: 139.75, l: 137.98, c: 138.17 },
            { o: 138.17, h: 138.22, l: 136.87, c: 137 },
            { o: 137, h: 137.3, l: 135.2, c: 137.1 },
            { o: 137.1, h: 140.03, l: 136.77, c: 139.71 },
            { o: 139.71, h: 142.81, l: 139.32, c: 142.67 },
            { o: 142.67, h: 145.76, l: 142.52, c: 145.46 },
            { o: 145.46, h: 148.09, l: 145.28, c: 148 },
            { o: 148, h: 148.64, l: 147.45, c: 148.22 },
            { o: 148.22, h: 148.8, l: 146.98, c: 147.38 },
            { o: 147.38, h: 148, l: 146.79, c: 147.46 },
            { o: 147.46, h: 148.62, l: 146.63, c: 147.82 },
            { o: 147.82, h: 148.01, l: 147.12, c: 147.3 },
            { o: 147.3, h: 147.88, l: 146.6, c: 147.55 },
            { o: 147.55, h: 149.13, l: 147.11, c: 148.69 },
            { o: 148.69, h: 151.31, l: 148.52, c: 151.21 },
            { o: 151.21, h: 153.71, l: 150.99, c: 153.59 },
            { o: 153.59, h: 155.44, l: 153.52, c: 155.4 },
            { o: 155.4, h: 158.07, l: 155.18, c: 158 }
          ]
        },
        answer: {
          from: 17,
          to: 23
        },
        explain: "Tight sideways trading means balance. Price only moves far when one side overpowers the other."
      },
      {
        type: "tf",
        q: "Baker agrees with Random Walk Theory that past prices tell you nothing.",
        answer: false,
        explain: "Baker says history does predict, but through the areas of excess supply and demand it shows, not through indicators."
      },
      {
        type: "order",
        q: "Put the story of a swing low in order.",
        items: [
          "Sellers push price down",
          "Willing buyers become more than willing sellers",
          "Price is forced to reverse up",
          "You mark that turn as a demand zone"
        ],
        explain: "Every change of direction is a change in the balance between willing sellers and willing buyers."
      },
      {
        type: "tf",
        q: "An uptrend means demand is stronger than supply.",
        answer: true,
        explain: "And a downtrend means supply is stronger than demand."
      }
    ],
    practice: [
      {
        prompt: "Price is chopping in the middle of a tight sideways range. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.05, l: 148.26, c: 148.45 },
            { o: 148.45, h: 148.62, l: 145.58, c: 145.87 },
            { o: 145.87, h: 146.03, l: 143.74, c: 143.86 },
            { o: 143.86, h: 144.01, l: 141.75, c: 141.86 },
            { o: 141.86, h: 142.01, l: 139.94, c: 140 },
            { o: 140, h: 141.11, l: 139.74, c: 140.25 },
            { o: 140.25, h: 141.38, l: 139.65, c: 140.52 },
            { o: 140.52, h: 140.78, l: 140.19, c: 140.43 },
            { o: 140.43, h: 140.76, l: 139.05, c: 139.66 },
            { o: 139.66, h: 139.92, l: 139.06, c: 139.41 },
            { o: 139.41, h: 139.8, l: 138.56, c: 139.47 },
            { o: 139.47, h: 140.39, l: 138.79, c: 139.95 },
            { o: 139.95, h: 141.14, l: 139.57, c: 140.35 },
            { o: 140.35, h: 141, l: 140.09, c: 140.32 },
            { o: 140.32, h: 140.48, l: 140.18, c: 140.29 },
            { o: 140.29, h: 141.22, l: 139.84, c: 140.51 },
            { o: 140.51, h: 140.63, l: 139.07, c: 139.81 },
            { o: 139.81, h: 140.8, l: 138.89, c: 140.34 },
            { o: 140.34, h: 140.7, l: 138.6, c: 139.52 },
            { o: 139.52, h: 140.45, l: 139.05, c: 139.93 }
          ],
          reveal: 12
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Tight sideways trading is balance. There is no imbalance to trade in the middle of it, and price kept chopping. Wait for price to reach a zone where one side clearly won before."
      },
      {
        prompt: "In an uptrend, price comes back down to the spot where buyers last overpowered sellers. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 150, h: 150.31, l: 147.83, c: 148.07 },
            { o: 148.07, h: 148.37, l: 144.5, c: 144.99 },
            { o: 144.99, h: 145.19, l: 142.91, c: 143.18 },
            { o: 143.18, h: 143.46, l: 140.09, c: 140.43 },
            { o: 140.43, h: 140.88, l: 137.56, c: 138 },
            { o: 138, h: 138.29, l: 137.69, c: 137.74 },
            { o: 137.74, h: 138.27, l: 137.3, c: 138.17 },
            { o: 138.17, h: 143.07, l: 138.08, c: 142.88 },
            { o: 142.88, h: 146, l: 142.81, c: 145.97 },
            { o: 145.97, h: 150.27, l: 145.83, c: 150.17 },
            { o: 150.17, h: 151.59, l: 150.07, c: 151.21 },
            { o: 151.21, h: 152.63, l: 151.05, c: 152.26 },
            { o: 152.26, h: 153.33, l: 151.98, c: 153.26 },
            { o: 153.26, h: 154.34, l: 152.97, c: 154.17 },
            { o: 154.17, h: 154.67, l: 148.13, c: 148.69 },
            { o: 148.69, h: 149.45, l: 143.21, c: 143.54 },
            { o: 143.54, h: 143.86, l: 139.07, c: 139.39 },
            { o: 139.39, h: 139.89, l: 137.8, c: 139.84 },
            { o: 139.84, h: 142.43, l: 139.44, c: 142.07 },
            { o: 142.07, h: 145.2, l: 141.47, c: 144.78 },
            { o: 144.78, h: 146.8, l: 144.5, c: 146.61 },
            { o: 146.61, h: 149.18, l: 146.28, c: 149.06 },
            { o: 149.06, h: 152.22, l: 148.41, c: 151.84 }
          ],
          zones: [
            {
              from: 5,
              top: 138.29,
              bottom: 137.3,
              kind: "demand"
            }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 137.27
        },
        explain: "Demand beat supply at 137.30-138.29 and the trend is up, so demand is stronger. On the return, the leftover buyers pushed price up again."
      }
    ],
    cards: [
      {
        front: "Supply means?",
        back: "Willing sellers."
      },
      {
        front: "Demand means?",
        back: "Willing buyers."
      },
      {
        front: "What happened at a swing low?",
        back: "Demand became greater than supply and forced a reversal up."
      },
      {
        front: "What does tight sideways trading mean?",
        back: "Supply and demand are in balance."
      },
      {
        front: "Demand down, supply flat?",
        back: "Surplus, lower price."
      },
      {
        front: "Supply down, demand flat?",
        back: "Shortage, higher price."
      },
      {
        front: "How does past price predict, says Baker?",
        back: "Through the areas of excess supply and demand it shows, not through indicators."
      }
    ],
    mnemonic: "Turn = tilt. Every turn on the chart is the seesaw tilting to one side."
  },
  {
    mentor: "baker",
    n: 4,
    eli5: {
      oneLiner: "Find where price jumped away, then box those candles from top to bottom.",
      story: "Picture a cat sitting very still on a box, and then, zoom, it jumps off the box. The box is the place where something big started. On a chart you draw a box around the candles where price sat before it jumped away: the turning candle, a quiet little cluster, a pause in the middle of a run, or the spot a gap jumped from. Price often comes back to that box later.",
      analogy: "Drawing a zone is like drawing a chalk box around the launch pad a rocket took off from."
    },
    bigIdeas: [
      "Four ways to find a zone: pivot candle, tight range then a dramatic move, mid-trend doji, gap.",
      "Draw lines on the extremes: the high and low of the candle or candles.",
      "Too wide? Refine on the hourly chart, but keep the distal line at the extreme."
    ],
    steps: [
      {
        title: "Method 1: the pivot candle",
        narration: "The easiest zone is an obvious change of trend. The candle that forms the pivot is the zone: one horizontal line on its high, one on its low, and shade the box. For demand the high is the proximal (near) line and the low is the distal (far) line. For supply it is the reverse.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ],
          zones: [
            {
              from: 5,
              top: 143.1,
              bottom: 136,
              kind: "demand",
              label: "Pivot zone (whole candle)"
            }
          ],
          lines: [
            {
              y: 143.1,
              label: "Line on the high",
              kind: "proximal",
              from: 5
            },
            {
              y: 136,
              label: "Line on the low",
              kind: "distal",
              from: 5
            }
          ],
          highlight: {
            from: 5,
            to: 5,
            label: "pivot candle"
          }
        }
      },
      {
        title: "Refine a zone that is too wide",
        narration: "Daily pivot candles are often too big to trade. Open the hourly chart for that day and wrap the zone around the hourly candle at the extreme. The bottom of demand (or top of supply) never moves; only the inner line comes closer. A narrower zone means less risk per share.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ],
          zones: [
            {
              from: 5,
              top: 143.1,
              bottom: 136,
              kind: "demand",
              label: "Pivot zone (whole candle)",
              faded: true
            },
            {
              from: 5,
              top: 137.6,
              bottom: 136,
              kind: "demand",
              label: "Refined on the hourly (distal kept)"
            }
          ],
          lines: [
            {
              y: 137.6,
              label: "Proximal moves closer",
              kind: "proximal",
              from: 5
            },
            {
              y: 136,
              label: "Distal stays at the extreme",
              kind: "distal",
              from: 5
            }
          ],
          notes: [
            {
              x: 6,
              y: 135,
              text: "Too wide? Rebuild from the hourly candle"
            }
          ]
        }
      },
      {
        title: "Method 3: the mid-trend doji",
        narration: "Look for indecision roughly halfway through a strong trend. A doji is the easiest sign. Box the doji candle. In an uptrend it is demand, in a downtrend it is supply.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ],
          zones: [
            {
              from: 5,
              top: 137.6,
              bottom: 136,
              kind: "demand",
              label: "Refined on the hourly (distal kept)"
            },
            {
              from: 11,
              top: 154.6,
              bottom: 151.6,
              kind: "demand",
              label: "Mid-trend doji zone"
            }
          ],
          highlight: {
            from: 11,
            to: 11,
            label: "doji"
          },
          notes: [
            {
              x: 11,
              y: 155.9,
              text: "Indecision halfway up a strong trend"
            }
          ]
        }
      },
      {
        title: "Method 2: tight range, then a dramatic move",
        narration: "Price trades sideways in a tight range for several bars, then shoots away. The zone covers the whole range, from its highest high to its lowest low. It only counts if price left dramatically.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ],
          zones: [
            {
              from: 5,
              top: 137.6,
              bottom: 136,
              kind: "demand",
              label: "Refined on the hourly (distal kept)"
            },
            {
              from: 11,
              top: 154.6,
              bottom: 151.6,
              kind: "demand",
              label: "Mid-trend doji zone"
            },
            {
              from: 15,
              top: 164.5,
              bottom: 162.52,
              kind: "supply",
              label: "Range zone (highest high to lowest low)"
            }
          ],
          highlight: {
            from: 15,
            to: 20,
            label: "tight range"
          },
          notes: [
            {
              x: 23,
              y: 160.52,
              text: "Dramatic move away"
            }
          ]
        }
      },
      {
        title: "Method 4: gaps",
        narration: "A gap is a sudden change in the balance. Draw the zone as if the gap were one big candle. The price the gap left from is likely strong support or resistance later.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ],
          zones: [
            {
              from: 5,
              top: 137.6,
              bottom: 136,
              kind: "demand",
              label: "Refined on the hourly (distal kept)"
            },
            {
              from: 11,
              top: 154.6,
              bottom: 151.6,
              kind: "demand",
              label: "Mid-trend doji zone"
            },
            {
              from: 15,
              top: 164.5,
              bottom: 162.52,
              kind: "supply",
              label: "Range zone (highest high to lowest low)"
            },
            {
              from: 24,
              top: 154.6,
              bottom: 148.7,
              kind: "supply",
              label: "Gap read as one big candle"
            }
          ],
          lines: [
            {
              y: 148.7,
              label: "Gap origin: likely resistance",
              kind: "level",
              from: 24
            }
          ],
          notes: [
            {
              x: 25,
              y: 150.2,
              text: "Read the gap as if it were one big candle"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How does Baker draw a pivot zone?",
        options: [
          "A line on the high and a line on the low of the pivot candle",
          "A line on the open and close only",
          "A line through the middle of the candle",
          "A box around the next five candles"
        ],
        answer: 0,
        explain: "The whole candle, wick included, from high to low. Leaving out the wick is a classic mistake."
      },
      {
        type: "spot",
        q: "Click the doji that formed halfway through the strong rally.",
        scene: {
          candles: [
            { o: 160, h: 160.19, l: 156.34, c: 156.43 },
            { o: 156.43, h: 156.57, l: 153.68, c: 153.82 },
            { o: 153.82, h: 154.27, l: 150.23, c: 150.36 },
            { o: 150.36, h: 150.48, l: 146.09, c: 146.34 },
            { o: 146.34, h: 146.78, l: 142.28, c: 142.5 },
            { o: 142.4, h: 143.1, l: 136, c: 142.7 },
            { o: 142.7, h: 145.28, l: 142.59, c: 145.21 },
            { o: 145.21, h: 147.74, l: 145.17, c: 147.61 },
            { o: 147.61, h: 150.06, l: 147.53, c: 150 },
            { o: 150, h: 151.19, l: 149.89, c: 151.13 },
            { o: 151.13, h: 153.16, l: 151.03, c: 153 },
            { o: 153, h: 154.6, l: 151.6, c: 153.1 },
            { o: 153.1, h: 156.1, l: 152.96, c: 156 },
            { o: 156, h: 160.49, l: 155.89, c: 160.35 },
            { o: 160.35, h: 163.06, l: 160.23, c: 163 },
            { o: 163, h: 163.55, l: 162.59, c: 162.98 },
            { o: 162.98, h: 164.41, l: 162.52, c: 163.95 },
            { o: 163.95, h: 164.08, l: 162.68, c: 163.19 },
            { o: 163.19, h: 164.35, l: 162.6, c: 163.91 },
            { o: 163.91, h: 164.5, l: 163.02, c: 163.31 },
            { o: 163.31, h: 164.29, l: 162.91, c: 163.74 },
            { o: 163.74, h: 163.81, l: 161.14, c: 161.22 },
            { o: 161.22, h: 161.38, l: 157.44, c: 157.57 },
            { o: 157.57, h: 157.71, l: 153.87, c: 154 },
            { o: 154, h: 154.6, l: 152.6, c: 153.2 },
            { o: 148.7, h: 148.87, l: 146.7, c: 146.81 },
            { o: 146.81, h: 146.96, l: 144.93, c: 145 },
            { o: 145, h: 147.24, l: 144.76, c: 147.08 },
            { o: 147.08, h: 148.72, l: 146.81, c: 148.53 },
            { o: 148.53, h: 150.11, l: 148.42, c: 150 }
          ]
        },
        answer: {
          from: 11,
          to: 11
        },
        explain: "Indecision in the middle of a strong trend is Baker's third way to find a zone."
      },
      {
        type: "tf",
        q: "When you refine a wide daily demand zone on the hourly chart, you may move the bottom line up.",
        answer: false,
        explain: "The bottom of demand and the top of supply always stay at the extreme price. Only the proximal (inner) line moves closer."
      },
      {
        type: "mcq",
        q: "For a SUPPLY zone, which line is the proximal line?",
        options: [
          "The low of the candle",
          "The high of the candle",
          "The close",
          "The open"
        ],
        answer: 0,
        explain: "Proximal means near. Price comes up into supply, so it meets the low first. The high is the distal line."
      },
      {
        type: "mcq",
        q: "How do you plot a zone at a gap?",
        options: [
          "As if the gap were one big candle",
          "You cannot plot a zone at a gap",
          "Only on the candle after the gap",
          "Use the midpoint of the gap"
        ],
        answer: 0,
        explain: "Baker: look at the chart as if the gap was one big candle, and expect the gap origin to act as support or resistance."
      },
      {
        type: "order",
        q: "Order the steps to refine a zone.",
        items: [
          "Plot the zone on the daily pivot candle",
          "See that it is too wide to trade",
          "Open the hourly chart for that day",
          "Wrap the zone around the hourly candle at the extreme",
          "Copy it back to the daily chart"
        ],
        explain: "The extreme (distal) price stays, so the zone keeps its meaning but the risk shrinks."
      },
      {
        type: "tf",
        q: "Any sideways cluster is a range zone.",
        answer: false,
        explain: "Only if price left it dramatically. No dramatic move away, no zone."
      }
    ],
    practice: [
      {
        prompt: "Draw the supply zone at the top of this rally (drag its top and bottom).",
        scene: {
          candles: [
            { o: 140, h: 143.77, l: 139.81, c: 143.46 },
            { o: 143.46, h: 145.92, l: 143.36, c: 145.81 },
            { o: 145.81, h: 149.32, l: 145.45, c: 148.97 },
            { o: 148.97, h: 154.16, l: 148.42, c: 153.55 },
            { o: 153.55, h: 156.23, l: 153.26, c: 156 },
            { o: 156, h: 158.9, l: 155.4, c: 155.7 },
            { o: 155.7, h: 155.79, l: 153.46, c: 153.53 },
            { o: 153.53, h: 153.61, l: 150.78, c: 150.89 },
            { o: 150.89, h: 150.99, l: 148.38, c: 148.43 },
            { o: 148.43, h: 148.51, l: 145.96, c: 146 },
            { o: 146, h: 147.37, l: 145.95, c: 147.17 },
            { o: 147.17, h: 149, l: 146.96, c: 148.82 },
            { o: 148.82, h: 150.43, l: 148.74, c: 150.35 },
            { o: 150.35, h: 152.33, l: 150.12, c: 152 }
          ],
          reveal: 12
        },
        task: "draw-zone",
        answer: {
          top: 158.9,
          bottom: 155.4
        },
        explain: "The shooting star is the pivot candle. Line on its high (158.90, distal for supply) and on its low (155.40, proximal)."
      },
      {
        prompt: "Price sat in a tight range and then shot up. Draw the demand zone.",
        scene: {
          candles: [
            { o: 162, h: 162.17, l: 157.98, c: 158.44 },
            { o: 158.44, h: 158.55, l: 156.03, c: 156.11 },
            { o: 156.11, h: 156.53, l: 152, c: 152.16 },
            { o: 152.16, h: 152.6, l: 148.58, c: 148.71 },
            { o: 148.71, h: 148.79, l: 145.75, c: 146 },
            { o: 146, h: 146.58, l: 145.71, c: 146.2 },
            { o: 146.2, h: 146.76, l: 145.82, c: 145.98 },
            { o: 145.98, h: 146.37, l: 145.7, c: 146.12 },
            { o: 146.12, h: 146.31, l: 145.56, c: 146.21 },
            { o: 146.21, h: 146.54, l: 145.23, c: 145.65 },
            { o: 145.65, h: 148.87, l: 145.6, c: 148.79 },
            { o: 148.79, h: 153.4, l: 148.57, c: 153.18 },
            { o: 153.18, h: 157.18, l: 153.1, c: 157 },
            { o: 157, h: 157.25, l: 155.53, c: 155.76 },
            { o: 155.76, h: 155.94, l: 154.42, c: 154.53 },
            { o: 154.53, h: 154.74, l: 153.42, c: 153.51 },
            { o: 153.51, h: 153.69, l: 151.87, c: 152 }
          ],
          reveal: 15
        },
        task: "draw-zone",
        answer: {
          top: 146.76,
          bottom: 145.23
        },
        explain: "Range method: from the highest high (146.76) to the lowest low (145.23) of the tight range that price left dramatically."
      }
    ],
    cards: [
      {
        front: "Baker's four ways to find a zone?",
        back: "Pivot candle, tight range then a dramatic move, mid-trend doji, gap."
      },
      {
        front: "Pivot zone covers?",
        back: "The full high-to-low range of the pivot candle, wick included."
      },
      {
        front: "Range zone covers?",
        back: "Highest high to lowest low of the tight range."
      },
      {
        front: "Demand: which line is proximal?",
        back: "The top (high). The bottom (low) is distal."
      },
      {
        front: "Zone too wide?",
        back: "Rebuild it from the hourly candle of that day; keep the distal line at the extreme."
      },
      {
        front: "Why refine a zone?",
        back: "Smaller risk per share and a higher reward-to-risk ratio."
      },
      {
        front: "How to read a gap?",
        back: "As if the gap were one big candle. The gap origin is likely support or resistance."
      }
    ],
    mnemonic: "P-R-D-G: Pivot, Range, Doji, Gap. Box the launch pad, wick to wick."
  },
  {
    mentor: "baker",
    n: 5,
    eli5: {
      oneLiner: "Strong zones are fast, fresh and short. Each visit eats the leftover orders.",
      story: "A bakery puts out a big tray of cookies at a low price, and kids rush in and grab them. Some cookies are still left on the tray. The first time you go back, there are cookies waiting. The second time, fewer. The third time, the tray is empty and you go home with nothing. A zone works the same way: the first return is the best one.",
      analogy: "A zone is a cookie tray. Every visit takes cookies away. A fresh tray is the fullest."
    },
    bigIdeas: [
      "Strong zone: price left fast (and ideally came in fast), it is fresh, and price spent little time there.",
      "More touches make a zone WEAKER, not stronger. Trade the first return.",
      "Do not buy into supply or sell into demand. Stop beyond the nearest zone; if that is too much risk, skip."
    ],
    steps: [
      {
        title: "Test 1: speed out",
        narration: "Look for areas price left quickly. A fast move away means one side had a big excess of orders there.",
        scene: {
          candles: [
            { o: 170, h: 171.16, l: 162.07, c: 162.8 },
            { o: 162.8, h: 163.34, l: 150.99, c: 152.53 },
            { o: 152.53, h: 153.52, l: 143.69, c: 144 },
            { o: 144, h: 144.39, l: 143.69, c: 144.05 },
            { o: 144.05, h: 144.7, l: 143.98, c: 144.23 },
            { o: 144.23, h: 151.17, l: 144.12, c: 151 },
            { o: 151, h: 160.37, l: 150.65, c: 160.23 },
            { o: 160.23, h: 161.26, l: 160.12, c: 161.17 },
            { o: 161.17, h: 162.23, l: 160.95, c: 162.01 },
            { o: 162.01, h: 163.4, l: 161.91, c: 163 },
            { o: 163, h: 164.59, l: 162.8, c: 164.23 },
            { o: 164.23, h: 164.44, l: 158.83, c: 159.02 },
            { o: 159.02, h: 159.37, l: 152.4, c: 153.29 },
            { o: 153.29, h: 153.86, l: 144.97, c: 145.8 },
            { o: 145.8, h: 146.3, l: 144.2, c: 146.25 },
            { o: 146.25, h: 149, l: 145.9, c: 148.58 },
            { o: 148.58, h: 152.12, l: 147.93, c: 151.67 },
            { o: 151.67, h: 155.28, l: 150.99, c: 154.83 },
            { o: 154.83, h: 157.54, l: 154.41, c: 157.15 },
            { o: 157.15, h: 160.65, l: 156.86, c: 160.25 }
          ],
          zones: [
            {
              from: 3,
              top: 144.7,
              bottom: 143.69,
              kind: "demand"
            }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "fast out"
          },
          notes: [
            {
              x: 6,
              y: 154.7,
              text: "Left fast: buyers overwhelmed sellers"
            }
          ]
        }
      },
      {
        title: "Speed in, too",
        narration: "If price also arrived fast, even better. A zone that price crept into slowly is weaker, even if it left fast.",
        scene: {
          candles: [
            { o: 170, h: 171.16, l: 162.07, c: 162.8 },
            { o: 162.8, h: 163.34, l: 150.99, c: 152.53 },
            { o: 152.53, h: 153.52, l: 143.69, c: 144 },
            { o: 144, h: 144.39, l: 143.69, c: 144.05 },
            { o: 144.05, h: 144.7, l: 143.98, c: 144.23 },
            { o: 144.23, h: 151.17, l: 144.12, c: 151 },
            { o: 151, h: 160.37, l: 150.65, c: 160.23 },
            { o: 160.23, h: 161.26, l: 160.12, c: 161.17 },
            { o: 161.17, h: 162.23, l: 160.95, c: 162.01 },
            { o: 162.01, h: 163.4, l: 161.91, c: 163 },
            { o: 163, h: 164.59, l: 162.8, c: 164.23 },
            { o: 164.23, h: 164.44, l: 158.83, c: 159.02 },
            { o: 159.02, h: 159.37, l: 152.4, c: 153.29 },
            { o: 153.29, h: 153.86, l: 144.97, c: 145.8 },
            { o: 145.8, h: 146.3, l: 144.2, c: 146.25 },
            { o: 146.25, h: 149, l: 145.9, c: 148.58 },
            { o: 148.58, h: 152.12, l: 147.93, c: 151.67 },
            { o: 151.67, h: 155.28, l: 150.99, c: 154.83 },
            { o: 154.83, h: 157.54, l: 154.41, c: 157.15 },
            { o: 157.15, h: 160.65, l: 156.86, c: 160.25 }
          ],
          zones: [
            {
              from: 3,
              top: 144.7,
              bottom: 143.69,
              kind: "demand"
            }
          ],
          highlight: {
            from: 0,
            to: 2,
            label: "fast in"
          },
          notes: [
            {
              x: 6,
              y: 154.7,
              text: "Left fast: buyers overwhelmed sellers"
            },
            {
              x: 0,
              y: 166.7,
              text: "Arrived fast too: even better"
            }
          ]
        }
      },
      {
        title: "Test 2: fresh",
        narration: "The highest-probability trade is the first return to a zone that has never been tested. Also scroll left (Baker looks back at least five years) to check that the candle which made the zone was not itself a return to an older zone.",
        scene: {
          candles: [
            { o: 170, h: 171.16, l: 162.07, c: 162.8 },
            { o: 162.8, h: 163.34, l: 150.99, c: 152.53 },
            { o: 152.53, h: 153.52, l: 143.69, c: 144 },
            { o: 144, h: 144.39, l: 143.69, c: 144.05 },
            { o: 144.05, h: 144.7, l: 143.98, c: 144.23 },
            { o: 144.23, h: 151.17, l: 144.12, c: 151 },
            { o: 151, h: 160.37, l: 150.65, c: 160.23 },
            { o: 160.23, h: 161.26, l: 160.12, c: 161.17 },
            { o: 161.17, h: 162.23, l: 160.95, c: 162.01 },
            { o: 162.01, h: 163.4, l: 161.91, c: 163 },
            { o: 163, h: 164.59, l: 162.8, c: 164.23 },
            { o: 164.23, h: 164.44, l: 158.83, c: 159.02 },
            { o: 159.02, h: 159.37, l: 152.4, c: 153.29 },
            { o: 153.29, h: 153.86, l: 144.97, c: 145.8 },
            { o: 145.8, h: 146.3, l: 144.2, c: 146.25 },
            { o: 146.25, h: 149, l: 145.9, c: 148.58 },
            { o: 148.58, h: 152.12, l: 147.93, c: 151.67 },
            { o: 151.67, h: 155.28, l: 150.99, c: 154.83 },
            { o: 154.83, h: 157.54, l: 154.41, c: 157.15 },
            { o: 157.15, h: 160.65, l: 156.86, c: 160.25 }
          ],
          zones: [
            {
              from: 3,
              top: 144.7,
              bottom: 143.69,
              kind: "demand"
            }
          ],
          highlight: {
            from: 14,
            to: 14,
            label: "first return"
          },
          notes: [
            {
              x: 14,
              y: 142.19,
              text: "First return to a fresh zone: best odds"
            }
          ]
        }
      },
      {
        title: "More touches = weaker",
        narration: "Classic support and resistance says more bounces make a line stronger. Baker says the opposite for zones. Each return uses up some of the leftover buyers, until none are left and price breaks through.",
        scene: {
          candles: [
            { o: 165, h: 165.29, l: 160.58, c: 160.69 },
            { o: 160.69, h: 160.89, l: 154.25, c: 154.79 },
            { o: 154.79, h: 154.94, l: 150.74, c: 151.2 },
            { o: 151.2, h: 151.67, l: 144.48, c: 145 },
            { o: 145, h: 145.21, l: 144.4, c: 144.83 },
            { o: 144.83, h: 145.11, l: 144.34, c: 145.03 },
            { o: 145.03, h: 148.42, l: 144.91, c: 148.26 },
            { o: 148.26, h: 152.45, l: 148.19, c: 152.3 },
            { o: 152.3, h: 157.18, l: 152.18, c: 157 },
            { o: 157, h: 157.21, l: 152.55, c: 152.87 },
            { o: 152.87, h: 153.39, l: 148.89, c: 149 },
            { o: 149, h: 149.35, l: 146.02, c: 146.21 },
            { o: 146.21, h: 146.61, l: 144.91, c: 146.41 },
            { o: 146.41, h: 149.26, l: 146.26, c: 149.08 },
            { o: 149.08, h: 150.63, l: 149, c: 150.47 },
            { o: 150.47, h: 153.37, l: 150.09, c: 153 },
            { o: 153, h: 153.11, l: 150.83, c: 151.03 },
            { o: 151.03, h: 151.11, l: 148.68, c: 148.92 },
            { o: 148.92, h: 149.08, l: 145.86, c: 146.01 },
            { o: 146.01, h: 146.31, l: 144.71, c: 146.11 },
            { o: 146.11, h: 148.36, l: 145.92, c: 148.2 },
            { o: 148.2, h: 150.24, l: 147.92, c: 150 },
            { o: 150, h: 150.27, l: 147.58, c: 147.72 },
            { o: 147.72, h: 147.93, l: 145.59, c: 145.81 },
            { o: 145.81, h: 146.01, l: 142.74, c: 143.04 },
            { o: 143.04, h: 143.11, l: 141.12, c: 141.19 },
            { o: 141.19, h: 141.27, l: 139.08, c: 139.2 },
            { o: 139.2, h: 139.28, l: 137.13, c: 137.34 }
          ],
          zones: [
            {
              from: 4,
              top: 145.21,
              bottom: 144.34,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 12,
              y: 143.14000000000001,
              text: "1st touch"
            },
            {
              x: 19,
              y: 143.14000000000001,
              text: "2nd: weaker"
            },
            {
              x: 24,
              y: 141.34,
              text: "3rd: buyers used up, break"
            }
          ]
        }
      },
      {
        title: "Test 3: time in the zone",
        narration: "For a reversal zone, the shorter the time inside, the better. For a zone built from a tight range and a breakout, three to six candles is acceptable.",
        scene: {
          candles: [
            { o: 170, h: 171.16, l: 162.07, c: 162.8 },
            { o: 162.8, h: 163.34, l: 150.99, c: 152.53 },
            { o: 152.53, h: 153.52, l: 143.69, c: 144 },
            { o: 144, h: 144.39, l: 143.69, c: 144.05 },
            { o: 144.05, h: 144.7, l: 143.98, c: 144.23 },
            { o: 144.23, h: 151.17, l: 144.12, c: 151 },
            { o: 151, h: 160.37, l: 150.65, c: 160.23 },
            { o: 160.23, h: 161.26, l: 160.12, c: 161.17 },
            { o: 161.17, h: 162.23, l: 160.95, c: 162.01 },
            { o: 162.01, h: 163.4, l: 161.91, c: 163 },
            { o: 163, h: 164.59, l: 162.8, c: 164.23 },
            { o: 164.23, h: 164.44, l: 158.83, c: 159.02 },
            { o: 159.02, h: 159.37, l: 152.4, c: 153.29 },
            { o: 153.29, h: 153.86, l: 144.97, c: 145.8 },
            { o: 145.8, h: 146.3, l: 144.2, c: 146.25 },
            { o: 146.25, h: 149, l: 145.9, c: 148.58 },
            { o: 148.58, h: 152.12, l: 147.93, c: 151.67 },
            { o: 151.67, h: 155.28, l: 150.99, c: 154.83 },
            { o: 154.83, h: 157.54, l: 154.41, c: 157.15 },
            { o: 157.15, h: 160.65, l: 156.86, c: 160.25 }
          ],
          zones: [
            {
              from: 3,
              top: 144.7,
              bottom: 143.69,
              kind: "demand"
            }
          ],
          highlight: {
            from: 3,
            to: 4,
            label: "time in zone"
          },
          notes: [
            {
              x: 3,
              y: 142.19,
              text: "Reversal: as few candles as possible"
            }
          ]
        }
      },
      {
        title: "Do not buy into supply",
        narration: "If a supply zone sits right above your long entry, wait for price to break through it or skip the trade. Mirror rule: do not short right above demand. And put the stop a few cents beyond the nearest zone. If that makes the risk too big, do not take the trade.",
        scene: {
          candles: [
            { o: 140, h: 144.56, l: 139.44, c: 144.29 },
            { o: 144.29, h: 149.67, l: 143.91, c: 149.53 },
            { o: 149.53, h: 154.43, l: 148.95, c: 153.86 },
            { o: 153.86, h: 158.51, l: 153.58, c: 158 },
            { o: 158, h: 158.51, l: 157.89, c: 158.22 },
            { o: 158.22, h: 158.33, l: 157.83, c: 158.07 },
            { o: 158.07, h: 158.16, l: 155.71, c: 155.79 },
            { o: 155.79, h: 155.87, l: 152.14, c: 152.24 },
            { o: 152.24, h: 152.28, l: 148.87, c: 149 },
            { o: 149, h: 149.07, l: 148.54, c: 148.81 },
            { o: 148.81, h: 149.26, l: 148.58, c: 149.15 },
            { o: 149.15, h: 151.84, l: 149.07, c: 151.76 },
            { o: 151.76, h: 154.57, l: 151.73, c: 154.5 },
            { o: 154.5, h: 154.74, l: 151.88, c: 152.02 },
            { o: 152.02, h: 152.1, l: 149.96, c: 150.16 },
            { o: 150.16, h: 150.46, l: 148.96, c: 150.41 },
            { o: 150.41, h: 154.73, l: 150.28, c: 154.48 },
            { o: 154.48, h: 158.13, l: 154.14, c: 158.03 },
            { o: 158.03, h: 158.25, l: 154.72, c: 154.82 },
            { o: 154.82, h: 155.3, l: 151.35, c: 151.82 },
            { o: 151.82, h: 152.31, l: 148.14, c: 148.57 },
            { o: 148.57, h: 148.89, l: 145.22, c: 145.54 }
          ],
          zones: [
            {
              from: 4,
              top: 158.51,
              bottom: 157.83,
              kind: "supply"
            },
            {
              from: 9,
              top: 149.26,
              bottom: 148.54,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 148.51,
              label: "Stop a few cents below nearest demand",
              kind: "sl",
              from: 9
            }
          ],
          notes: [
            {
              x: 15,
              y: 160.01,
              text: "Supply right overhead: do not buy into supply"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "A zone that has held three times is stronger than a fresh one.",
        answer: false,
        explain: "For zones it is the opposite of classic support and resistance. Every return uses up part of the excess orders. A fresh zone is always the strongest."
      },
      {
        type: "spot",
        q: "Click the touch where the zone finally failed.",
        scene: {
          candles: [
            { o: 165, h: 165.29, l: 160.58, c: 160.69 },
            { o: 160.69, h: 160.89, l: 154.25, c: 154.79 },
            { o: 154.79, h: 154.94, l: 150.74, c: 151.2 },
            { o: 151.2, h: 151.67, l: 144.48, c: 145 },
            { o: 145, h: 145.21, l: 144.4, c: 144.83 },
            { o: 144.83, h: 145.11, l: 144.34, c: 145.03 },
            { o: 145.03, h: 148.42, l: 144.91, c: 148.26 },
            { o: 148.26, h: 152.45, l: 148.19, c: 152.3 },
            { o: 152.3, h: 157.18, l: 152.18, c: 157 },
            { o: 157, h: 157.21, l: 152.55, c: 152.87 },
            { o: 152.87, h: 153.39, l: 148.89, c: 149 },
            { o: 149, h: 149.35, l: 146.02, c: 146.21 },
            { o: 146.21, h: 146.61, l: 144.91, c: 146.41 },
            { o: 146.41, h: 149.26, l: 146.26, c: 149.08 },
            { o: 149.08, h: 150.63, l: 149, c: 150.47 },
            { o: 150.47, h: 153.37, l: 150.09, c: 153 },
            { o: 153, h: 153.11, l: 150.83, c: 151.03 },
            { o: 151.03, h: 151.11, l: 148.68, c: 148.92 },
            { o: 148.92, h: 149.08, l: 145.86, c: 146.01 },
            { o: 146.01, h: 146.31, l: 144.71, c: 146.11 },
            { o: 146.11, h: 148.36, l: 145.92, c: 148.2 },
            { o: 148.2, h: 150.24, l: 147.92, c: 150 },
            { o: 150, h: 150.27, l: 147.58, c: 147.72 },
            { o: 147.72, h: 147.93, l: 145.59, c: 145.81 },
            { o: 145.81, h: 146.01, l: 142.74, c: 143.04 },
            { o: 143.04, h: 143.11, l: 141.12, c: 141.19 },
            { o: 141.19, h: 141.27, l: 139.08, c: 139.2 },
            { o: 139.2, h: 139.28, l: 137.13, c: 137.34 }
          ],
          zones: [
            {
              from: 4,
              top: 145.21,
              bottom: 144.34,
              kind: "demand"
            }
          ]
        },
        answer: {
          from: 24,
          to: 24
        },
        explain: "After two earlier touches the leftover buyers were used up, so the third visit broke through."
      },
      {
        type: "mcq",
        q: "What does \"look left\" mean in Baker's freshness test?",
        options: [
          "Check that the candle that made the zone was not itself a return to an older zone",
          "Read the chart from right to left",
          "Look at the left-hand indicator panel",
          "Only trade zones on the left side of the screen"
        ],
        answer: 0,
        explain: "Baker scrolls back at least five years. In his AKAM example a fast zone still failed because its defining bar was already the second visit to an older zone."
      },
      {
        type: "mcq",
        q: "How many candles inside a range-breakout zone does Baker accept?",
        options: [
          "Three to six",
          "One only",
          "At least ten",
          "Any number"
        ],
        answer: 0,
        explain: "Reversal zones: as few as possible. Range breakouts: three to six candles is fine."
      },
      {
        type: "tf",
        q: "If a supply zone sits right above your long entry, Baker waits for the break or skips the trade.",
        answer: true,
        explain: "Rule one of his three \"worth the price of the book\" rules: do not buy into supply."
      },
      {
        type: "order",
        q: "Order Baker's grading questions.",
        items: [
          "Did price leave the zone fast?",
          "Did it also arrive fast?",
          "Is it fresh (first return, looked left)?",
          "How little time did price spend inside?"
        ],
        explain: "Fast out, fast in, fresh, brief. A zone that passes all four is a strong zone."
      },
      {
        type: "mcq",
        q: "The stop a few cents beyond the nearest zone means too much risk. What now?",
        options: [
          "Do not take the trade",
          "Move the stop closer anyway",
          "Take a bigger position",
          "Remove the stop"
        ],
        answer: 0,
        explain: "\"If doing this creates too much risk, then do not take the trade.\" Widening or shrinking the stop to make a trade fit is a mistake."
      }
    ],
    practice: [
      {
        prompt: "Price fell fast into this zone, left it fast, and now returns for the first time. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 170, h: 171.16, l: 162.07, c: 162.8 },
            { o: 162.8, h: 163.34, l: 150.99, c: 152.53 },
            { o: 152.53, h: 153.52, l: 143.69, c: 144 },
            { o: 144, h: 144.39, l: 143.69, c: 144.05 },
            { o: 144.05, h: 144.7, l: 143.98, c: 144.23 },
            { o: 144.23, h: 151.17, l: 144.12, c: 151 },
            { o: 151, h: 160.37, l: 150.65, c: 160.23 },
            { o: 160.23, h: 161.26, l: 160.12, c: 161.17 },
            { o: 161.17, h: 162.23, l: 160.95, c: 162.01 },
            { o: 162.01, h: 163.4, l: 161.91, c: 163 },
            { o: 163, h: 164.59, l: 162.8, c: 164.23 },
            { o: 164.23, h: 164.44, l: 158.83, c: 159.02 },
            { o: 159.02, h: 159.37, l: 152.4, c: 153.29 },
            { o: 153.29, h: 153.86, l: 144.97, c: 145.8 },
            { o: 145.8, h: 146.3, l: 144.2, c: 146.25 },
            { o: 146.25, h: 149, l: 145.9, c: 148.58 },
            { o: 148.58, h: 152.12, l: 147.93, c: 151.67 },
            { o: 151.67, h: 155.28, l: 150.99, c: 154.83 },
            { o: 154.83, h: 157.54, l: 154.41, c: 157.15 },
            { o: 157.15, h: 160.65, l: 156.86, c: 160.25 }
          ],
          zones: [
            {
              from: 3,
              top: 144.7,
              bottom: 143.69,
              kind: "demand"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 143.66
        },
        explain: "Fast in, fast out, fresh, only 2 candles inside: a strong zone on its first return. Stop a few cents below at 143.66. The buyers were still there."
      },
      {
        prompt: "This demand zone is being visited for the third time. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 165, h: 165.29, l: 160.58, c: 160.69 },
            { o: 160.69, h: 160.89, l: 154.25, c: 154.79 },
            { o: 154.79, h: 154.94, l: 150.74, c: 151.2 },
            { o: 151.2, h: 151.67, l: 144.48, c: 145 },
            { o: 145, h: 145.21, l: 144.4, c: 144.83 },
            { o: 144.83, h: 145.11, l: 144.34, c: 145.03 },
            { o: 145.03, h: 148.42, l: 144.91, c: 148.26 },
            { o: 148.26, h: 152.45, l: 148.19, c: 152.3 },
            { o: 152.3, h: 157.18, l: 152.18, c: 157 },
            { o: 157, h: 157.21, l: 152.55, c: 152.87 },
            { o: 152.87, h: 153.39, l: 148.89, c: 149 },
            { o: 149, h: 149.35, l: 146.02, c: 146.21 },
            { o: 146.21, h: 146.61, l: 144.91, c: 146.41 },
            { o: 146.41, h: 149.26, l: 146.26, c: 149.08 },
            { o: 149.08, h: 150.63, l: 149, c: 150.47 },
            { o: 150.47, h: 153.37, l: 150.09, c: 153 },
            { o: 153, h: 153.11, l: 150.83, c: 151.03 },
            { o: 151.03, h: 151.11, l: 148.68, c: 148.92 },
            { o: 148.92, h: 149.08, l: 145.86, c: 146.01 },
            { o: 146.01, h: 146.31, l: 144.71, c: 146.11 },
            { o: 146.11, h: 148.36, l: 145.92, c: 148.2 },
            { o: 148.2, h: 150.24, l: 147.92, c: 150 },
            { o: 150, h: 150.27, l: 147.58, c: 147.72 },
            { o: 147.72, h: 147.93, l: 145.59, c: 145.81 },
            { o: 145.81, h: 146.01, l: 142.74, c: 143.04 },
            { o: 143.04, h: 143.11, l: 141.12, c: 141.19 },
            { o: 141.19, h: 141.27, l: 139.08, c: 139.2 },
            { o: 139.2, h: 139.28, l: 137.13, c: 137.34 }
          ],
          zones: [
            {
              from: 4,
              top: 145.21,
              bottom: 144.34,
              kind: "demand"
            }
          ],
          reveal: 24
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Each touch used up buyers. By the third visit the excess was gone and price broke through. Baker trades the first return."
      },
      {
        prompt: "Price is bouncing off fresh demand, but a supply zone sits just above. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 140, h: 144.56, l: 139.44, c: 144.29 },
            { o: 144.29, h: 149.67, l: 143.91, c: 149.53 },
            { o: 149.53, h: 154.43, l: 148.95, c: 153.86 },
            { o: 153.86, h: 158.51, l: 153.58, c: 158 },
            { o: 158, h: 158.51, l: 157.89, c: 158.22 },
            { o: 158.22, h: 158.33, l: 157.83, c: 158.07 },
            { o: 158.07, h: 158.16, l: 155.71, c: 155.79 },
            { o: 155.79, h: 155.87, l: 152.14, c: 152.24 },
            { o: 152.24, h: 152.28, l: 148.87, c: 149 },
            { o: 149, h: 149.07, l: 148.54, c: 148.81 },
            { o: 148.81, h: 149.26, l: 148.58, c: 149.15 },
            { o: 149.15, h: 151.84, l: 149.07, c: 151.76 },
            { o: 151.76, h: 154.57, l: 151.73, c: 154.5 },
            { o: 154.5, h: 154.74, l: 151.88, c: 152.02 },
            { o: 152.02, h: 152.1, l: 149.96, c: 150.16 },
            { o: 150.16, h: 150.46, l: 148.96, c: 150.41 },
            { o: 150.41, h: 154.73, l: 150.28, c: 154.48 },
            { o: 154.48, h: 158.13, l: 154.14, c: 158.03 },
            { o: 158.03, h: 158.25, l: 154.72, c: 154.82 },
            { o: 154.82, h: 155.3, l: 151.35, c: 151.82 },
            { o: 151.82, h: 152.31, l: 148.14, c: 148.57 },
            { o: 148.57, h: 148.89, l: 145.22, c: 145.54 }
          ],
          zones: [
            {
              from: 4,
              top: 158.51,
              bottom: 157.83,
              kind: "supply"
            },
            {
              from: 9,
              top: 149.26,
              bottom: 148.54,
              kind: "demand"
            }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Do not buy into supply. There was almost no room before the sellers above, and price stalled at supply and fell. Wait for a break through supply or skip."
      }
    ],
    cards: [
      {
        front: "Baker's three strength tests?",
        back: "Speed (left fast, ideally arrived fast), freshness, time in the zone."
      },
      {
        front: "More touches make a zone...?",
        back: "Weaker. Each return uses up the excess orders."
      },
      {
        front: "Best trade at a zone?",
        back: "The first return to a fresh, never-tested zone."
      },
      {
        front: "How far back does Baker look left?",
        back: "At least five years, to check the creating candle was not a retest."
      },
      {
        front: "Time in a reversal zone?",
        back: "As short as possible."
      },
      {
        front: "Time in a range-breakout zone?",
        back: "Three to six candles is acceptable."
      },
      {
        front: "Supply right above your long entry?",
        back: "Do not buy into supply: wait for the break or skip."
      },
      {
        front: "Stop too far away to be safe?",
        back: "Do not take the trade."
      }
    ],
    mnemonic: "FFF-S: Fast out, Fast in, Fresh, Short stay. Cookies run out."
  },
  {
    mentor: "baker",
    n: 6,
    eli5: {
      oneLiner: "Investors buy above big weekly demand and protect profits at big supply.",
      story: "You plant an apple tree in a good field and decide: if the field floods, you leave. When your apples reach the busy market where sellers crowd in, you either sell them, or buy insurance in case prices drop. When prices are cheap again near the good field, you buy back. And at the biggest, most crowded market of all, you sell everything.",
      analogy: "A put option is like insurance on your car: you pay a little, and you are protected if the price gets damaged."
    },
    bigIdeas: [
      "Investors use the weekly chart. Buy above strong demand; if it breaks, get out.",
      "At strong supply: sell, or hedge (a put at the top of the zone, or sell a call to pay for a put).",
      "Buy back near demand, lift hedges when fresh demand forms, close all at major supply."
    ],
    steps: [
      {
        title: "Weekly chart, big picture",
        narration: "Long-term investors trade mostly on fundamentals, but zones on the weekly chart give better entry prices and show when to protect profits. First, see the major supply overhead (H). It tells you how much room there is.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            }
          ],
          notes: [
            {
              x: 3,
              y: 186.53,
              text: "Weekly chart: major supply from history"
            }
          ]
        }
      },
      {
        title: "A: buy above strong demand",
        narration: "Strong weekly demand formed at A. Buy near it and decide your exit in advance: if price breaks below the demand zone, get out, because further losses become very likely.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            }
          ],
          notes: [
            {
              x: 15,
              y: 117.36,
              text: "Buy above strong demand: plenty of room to H"
            }
          ],
          lines: [
            {
              y: 120.26,
              label: "Exit if price breaks below A",
              kind: "sl",
              from: 12
            }
          ]
        }
      },
      {
        title: "B and C: fresh zones form",
        narration: "On the way up, price forms a fresh demand zone (B) and then a fresh supply zone (C). Mark both. They are your next decision points.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          notes: [
            {
              x: 15,
              y: 117.36,
              text: "Buy above strong demand: plenty of room to H"
            }
          ],
          lines: [
            {
              y: 120.26,
              label: "Exit if price breaks below A",
              kind: "sl",
              from: 12
            }
          ]
        }
      },
      {
        title: "D: back at strong supply",
        narration: "Price returns to C. A drop is likely. Selling locks in the gain. If selling now would mean short-term capital gains tax, hedge instead: buy a put with the strike at the top of the supply zone, which keeps the time premium low. If price breaks up through the zone, sell the put for a small loss.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          notes: [
            {
              x: 31,
              y: 155.48,
              text: "D: back at strong supply. Sell, or hedge with a put"
            }
          ],
          lines: [
            {
              y: 120.26,
              label: "Exit if price breaks below A",
              kind: "sl",
              from: 12
            },
            {
              y: 153.48,
              label: "Put strike at the top of the zone",
              kind: "level",
              from: 23
            }
          ],
          highlight: {
            from: 31,
            to: 31,
            label: "D"
          }
        }
      },
      {
        title: "At B: buy back",
        narration: "When price falls to B, exercise the put (sell at the strike, now as a long-term gain) and buy back near demand with the stop just under the zone. Another tax-only hedge: sell a call and use the money to buy a put at the same strike, a roughly free put.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          notes: [
            {
              x: 37,
              y: 131.13,
              text: "At B: exercise the put, buy back, stop under the zone"
            }
          ],
          lines: [
            {
              y: 133.53,
              label: "New stop under B demand",
              kind: "sl",
              from: 18
            }
          ],
          highlight: {
            from: 37,
            to: 37,
            label: "buy back"
          }
        }
      },
      {
        title: "H: close everything",
        narration: "H is major supply. Close all positions. Only buy again if price later breaks through the zone and the stock is still a good buy.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          notes: [
            {
              x: 47,
              y: 186.53,
              text: "H: major supply. Close everything."
            }
          ],
          lines: [
            {
              y: 133.53,
              label: "New stop under B demand",
              kind: "sl",
              from: 18
            }
          ],
          highlight: {
            from: 47,
            to: 47,
            label: "H"
          }
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "If price breaks below the weekly demand you bought above, Baker keeps holding.",
        answer: false,
        explain: "A break makes further losses very likely, so the plan is to exit below the demand zone."
      },
      {
        type: "mcq",
        q: "Why put the put's strike at the top of the supply zone?",
        options: [
          "It keeps the time premium low",
          "It makes the put worthless",
          "It doubles the gain",
          "Brokers require it"
        ],
        answer: 0,
        explain: "A strike far from the zone top pays more time premium. At the zone top you get protection cheaply."
      },
      {
        type: "mcq",
        q: "What is the \"roughly free put\" hedge?",
        options: [
          "Sell a call and use the money to buy a put at the same strike",
          "Buy two puts",
          "Sell the stock and buy it back the same day",
          "Sell a put"
        ],
        answer: 0,
        explain: "If price breaks up and stays up, the stock is eventually called away at the strike, but by then as a long-term gain."
      },
      {
        type: "spot",
        q: "Click the candle where price returned to strong supply C.",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ]
        },
        answer: {
          from: 31,
          to: 31
        },
        explain: "That is point D: sell, or hedge if a sale would be a short-term gain."
      },
      {
        type: "tf",
        q: "Keep the hedge on even after fresh demand forms below.",
        answer: false,
        explain: "Baker closes the hedge when strong new demand forms underneath (his point G)."
      },
      {
        type: "order",
        q: "Order the investor playbook.",
        items: [
          "Buy above strong weekly demand (A)",
          "At strong supply, sell or hedge (D)",
          "Near demand, buy back with the stop under it",
          "At major supply (H), close everything"
        ],
        explain: "Then re-enter only if price breaks through the major supply."
      }
    ],
    practice: [
      {
        prompt: "You bought at A. Price is back at strong fresh supply C (point D). Buy more, sell (or hedge), or do nothing?",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          reveal: 31
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "At strong supply a drop is likely: sell to lock in the gain, or hedge with a put at the top of the zone if a sale would be a short-term gain. Price fell back to B."
      },
      {
        prompt: "Price has dropped into fresh demand B. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          reveal: 37
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 133.53
        },
        explain: "Buy back near demand with the stop just under it (and exercise the put if you hedged). Price rallied from B toward H."
      },
      {
        prompt: "Price reaches H, the major weekly supply. What do you do?",
        scene: {
          candles: [
            { o: 176, h: 179.19, l: 175.66, c: 179.04 },
            { o: 179.04, h: 180.93, l: 178.99, c: 180.72 },
            { o: 180.72, h: 184.42, l: 180.44, c: 184 },
            { o: 184, h: 184.53, l: 183.64, c: 183.74 },
            { o: 183.74, h: 184.1, l: 183.28, c: 184 },
            { o: 184, h: 184.48, l: 172.96, c: 173.56 },
            { o: 173.56, h: 173.99, l: 164.14, c: 164.75 },
            { o: 164.75, h: 165.42, l: 155.46, c: 155.72 },
            { o: 155.72, h: 156.29, l: 145.99, c: 146.57 },
            { o: 146.57, h: 147.38, l: 137.67, c: 138.26 },
            { o: 138.26, h: 138.77, l: 129.28, c: 129.81 },
            { o: 129.81, h: 130.48, l: 120.36, c: 121 },
            { o: 121, h: 121.54, l: 120.36, c: 121.03 },
            { o: 121.03, h: 121.46, l: 120.45, c: 121.16 },
            { o: 121.16, h: 121.53, l: 121, c: 121.05 },
            { o: 121.05, h: 124.61, l: 120.94, c: 124.52 },
            { o: 124.52, h: 128.78, l: 124.39, c: 128.7 },
            { o: 128.7, h: 134.08, l: 128.62, c: 134 },
            { o: 134, h: 134.28, l: 133.63, c: 134.16 },
            { o: 134.16, h: 134.61, l: 133.74, c: 134.17 },
            { o: 134.17, h: 141.15, l: 133.85, c: 140.82 },
            { o: 140.82, h: 147.25, l: 140.72, c: 146.97 },
            { o: 146.97, h: 153.28, l: 146.87, c: 153 },
            { o: 153, h: 153.48, l: 152.61, c: 152.89 },
            { o: 152.89, h: 153.03, l: 152.58, c: 152.93 },
            { o: 152.93, h: 153.02, l: 149.51, c: 149.62 },
            { o: 149.62, h: 149.76, l: 146.27, c: 146.31 },
            { o: 146.31, h: 146.38, l: 141.92, c: 142 },
            { o: 142, h: 145.01, l: 141.77, c: 144.82 },
            { o: 144.82, h: 148.29, l: 144.43, c: 148.04 },
            { o: 148.04, h: 152.09, l: 147.77, c: 151.68 },
            { o: 151.68, h: 153.03, l: 151.08, c: 151.28 },
            { o: 151.28, h: 151.41, l: 148.32, c: 148.54 },
            { o: 148.54, h: 148.97, l: 143.76, c: 144.27 },
            { o: 144.27, h: 144.44, l: 142.25, c: 142.31 },
            { o: 142.31, h: 142.56, l: 137.82, c: 138.3 },
            { o: 138.3, h: 138.59, l: 135.12, c: 135.41 },
            { o: 135.41, h: 135.71, l: 134.12, c: 135.71 },
            { o: 135.71, h: 143.15, l: 135.32, c: 142.6 },
            { o: 142.6, h: 149.43, l: 141.61, c: 148.76 },
            { o: 148.76, h: 154.13, l: 147.98, c: 153.38 },
            { o: 153.38, h: 158.87, l: 152.4, c: 158.49 },
            { o: 158.49, h: 165.94, l: 157.35, c: 165.46 },
            { o: 165.46, h: 172.47, l: 164.9, c: 172 },
            { o: 172, h: 175.72, l: 171.5, c: 175.27 },
            { o: 175.27, h: 179.73, l: 174.85, c: 179.59 },
            { o: 179.59, h: 182.64, l: 179.11, c: 182.48 },
            { o: 182.48, h: 183.91, l: 181.78, c: 181.98 },
            { o: 181.98, h: 182.22, l: 177.17, c: 177.74 },
            { o: 177.74, h: 177.95, l: 174.87, c: 175.06 },
            { o: 175.06, h: 175.32, l: 170.95, c: 171.22 },
            { o: 171.22, h: 171.43, l: 167.5, c: 168 }
          ],
          zones: [
            {
              from: 3,
              top: 184.53,
              bottom: 183.28,
              kind: "supply",
              label: "H: major supply"
            },
            {
              from: 12,
              top: 121.54,
              bottom: 120.36,
              kind: "demand",
              label: "A: strong weekly demand"
            },
            {
              from: 18,
              top: 134.61,
              bottom: 133.63,
              kind: "demand",
              label: "B: fresh demand"
            },
            {
              from: 23,
              top: 153.48,
              bottom: 152.58,
              kind: "supply",
              label: "C: fresh supply"
            }
          ],
          reveal: 47
        },
        task: "buy-sell-none",
        answer: {
          side: "sell"
        },
        explain: "Baker: \"Point H is a major supply zone, and I would close all positions.\" Re-enter only if price later breaks through."
      }
    ],
    cards: [
      {
        front: "Which chart for long-term investing?",
        back: "The weekly chart."
      },
      {
        front: "When does the investment thesis end?",
        back: "When price breaks below the weekly demand zone it was bought above."
      },
      {
        front: "At strong supply, an investor can...",
        back: "Sell, or hedge with a put, or sell a call to buy a put at the same strike."
      },
      {
        front: "Best put strike for the hedge?",
        back: "At the top of the supply zone: low time premium."
      },
      {
        front: "When to remove the hedge?",
        back: "When strong fresh demand forms underneath."
      },
      {
        front: "What to do at major supply?",
        back: "Close all positions; re-enter only after a break through it."
      }
    ],
    mnemonic: "Buy the field, insure at the market, sell at the big market."
  },
  {
    mentor: "baker",
    n: 7,
    eli5: {
      oneLiner: "Ride the river with any zone; swim against it only at strong zones.",
      story: "Floating down a river is easy, so you can hop in at any little dock. Swimming against the river is hard, so you only do it from the strongest, safest dock, and you jump in right at its very edge. When a dam breaks, the water that used to be blocked now flows the other way. Swing trading is the same: with the trend any zone works, against it only strong ones.",
      analogy: "A broken zone is a broken dam: the side that used to hold water back becomes the floor that holds it up."
    },
    bigIdeas: [
      "With the trend: wait for a rejection candle with its wick in any zone, enter after the close, stop a few cents beyond.",
      "Against the trend: strong zones only, limit entry near the far edge, no confirmation.",
      "A broken supply zone becomes demand, and a broken demand zone becomes supply."
    ],
    steps: [
      {
        title: "The trend is your friend",
        narration: "Swing traders use the daily chart. With the trend, you enter on a pullback. Instead of moving averages, Baker uses zones to time the pullback. Here the zone does not have to be strong; it only has to be there.",
        scene: {
          candles: [
            { o: 176, h: 176.39, l: 172.04, c: 172.2 },
            { o: 172.2, h: 172.2, l: 167.54, c: 168 },
            { o: 168, h: 168.23, l: 167.54, c: 167.96 },
            { o: 167.96, h: 168.21, l: 167.62, c: 168.03 },
            { o: 168.03, h: 168.09, l: 164.74, c: 164.85 },
            { o: 164.85, h: 164.95, l: 159.92, c: 160.12 },
            { o: 160.12, h: 160.16, l: 156.04, c: 156.21 },
            { o: 156.21, h: 156.34, l: 151.93, c: 152 },
            { o: 152, h: 153.31, l: 151.9, c: 153.26 },
            { o: 153.26, h: 155.05, l: 153.15, c: 155 },
            { o: 155, h: 159.85, l: 154.48, c: 159.43 },
            { o: 159.43, h: 163.9, l: 159.18, c: 163.36 },
            { o: 163.36, h: 166.9, l: 162.96, c: 166.64 },
            { o: 166.64, h: 167.92, l: 166.14, c: 166.19 },
            { o: 166.19, h: 166.85, l: 160.69, c: 161.54 },
            { o: 161.54, h: 161.74, l: 156.52, c: 157.11 },
            { o: 157.11, h: 157.63, l: 152.26, c: 152.68 },
            { o: 152.68, h: 153.06, l: 149.3, c: 149.52 },
            { o: 149.52, h: 150.02, l: 144.44, c: 145.02 },
            { o: 145.02, h: 145.95, l: 139.47, c: 140 }
          ],
          zones: [
            {
              from: 2,
              top: 168.23,
              bottom: 167.54,
              kind: "supply",
              label: "Supply (any zone will do)"
            }
          ],
          notes: [
            {
              x: 7,
              y: 170.23,
              text: "Downtrend: the trend is your friend"
            }
          ]
        }
      },
      {
        title: "Wait for the rejection candle",
        narration: "For a short: a bearish candle whose upper wick pokes into the supply zone. For a long: a bullish candle whose lower wick pokes into demand. The wick shows the zone pushed price back.",
        scene: {
          candles: [
            { o: 176, h: 176.39, l: 172.04, c: 172.2 },
            { o: 172.2, h: 172.2, l: 167.54, c: 168 },
            { o: 168, h: 168.23, l: 167.54, c: 167.96 },
            { o: 167.96, h: 168.21, l: 167.62, c: 168.03 },
            { o: 168.03, h: 168.09, l: 164.74, c: 164.85 },
            { o: 164.85, h: 164.95, l: 159.92, c: 160.12 },
            { o: 160.12, h: 160.16, l: 156.04, c: 156.21 },
            { o: 156.21, h: 156.34, l: 151.93, c: 152 },
            { o: 152, h: 153.31, l: 151.9, c: 153.26 },
            { o: 153.26, h: 155.05, l: 153.15, c: 155 },
            { o: 155, h: 159.85, l: 154.48, c: 159.43 },
            { o: 159.43, h: 163.9, l: 159.18, c: 163.36 },
            { o: 163.36, h: 166.9, l: 162.96, c: 166.64 },
            { o: 166.64, h: 167.92, l: 166.14, c: 166.19 },
            { o: 166.19, h: 166.85, l: 160.69, c: 161.54 },
            { o: 161.54, h: 161.74, l: 156.52, c: 157.11 },
            { o: 157.11, h: 157.63, l: 152.26, c: 152.68 },
            { o: 152.68, h: 153.06, l: 149.3, c: 149.52 },
            { o: 149.52, h: 150.02, l: 144.44, c: 145.02 },
            { o: 145.02, h: 145.95, l: 139.47, c: 140 }
          ],
          zones: [
            {
              from: 2,
              top: 168.23,
              bottom: 167.54,
              kind: "supply",
              label: "Supply (any zone will do)"
            }
          ],
          notes: [
            {
              x: 13,
              y: 169.73,
              text: "Bearish candle, upper wick in supply"
            }
          ],
          highlight: {
            from: 13,
            to: 13,
            label: "rejection"
          }
        }
      },
      {
        title: "Enter after the close, stop beyond",
        narration: "Enter after the rejection candle closes. Put the stop a few cents above the top of supply (or below the bottom of demand). Not every pullback reaches a zone, but those that do give higher odds and a clear stop.",
        scene: {
          candles: [
            { o: 176, h: 176.39, l: 172.04, c: 172.2 },
            { o: 172.2, h: 172.2, l: 167.54, c: 168 },
            { o: 168, h: 168.23, l: 167.54, c: 167.96 },
            { o: 167.96, h: 168.21, l: 167.62, c: 168.03 },
            { o: 168.03, h: 168.09, l: 164.74, c: 164.85 },
            { o: 164.85, h: 164.95, l: 159.92, c: 160.12 },
            { o: 160.12, h: 160.16, l: 156.04, c: 156.21 },
            { o: 156.21, h: 156.34, l: 151.93, c: 152 },
            { o: 152, h: 153.31, l: 151.9, c: 153.26 },
            { o: 153.26, h: 155.05, l: 153.15, c: 155 },
            { o: 155, h: 159.85, l: 154.48, c: 159.43 },
            { o: 159.43, h: 163.9, l: 159.18, c: 163.36 },
            { o: 163.36, h: 166.9, l: 162.96, c: 166.64 },
            { o: 166.64, h: 167.92, l: 166.14, c: 166.19 },
            { o: 166.19, h: 166.85, l: 160.69, c: 161.54 },
            { o: 161.54, h: 161.74, l: 156.52, c: 157.11 },
            { o: 157.11, h: 157.63, l: 152.26, c: 152.68 },
            { o: 152.68, h: 153.06, l: 149.3, c: 149.52 },
            { o: 149.52, h: 150.02, l: 144.44, c: 145.02 },
            { o: 145.02, h: 145.95, l: 139.47, c: 140 }
          ],
          zones: [
            {
              from: 2,
              top: 168.23,
              bottom: 167.54,
              kind: "supply",
              label: "Supply (any zone will do)"
            }
          ],
          notes: [
            {
              x: 13,
              y: 169.73,
              text: "Bearish candle, upper wick in supply"
            }
          ],
          highlight: {
            from: 13,
            to: 13,
            label: "rejection"
          },
          lines: [
            {
              y: 166.19,
              label: "Enter after the candle closes",
              kind: "entry",
              from: 13
            },
            {
              y: 168.26,
              label: "Stop a few cents above the zone",
              kind: "sl",
              from: 13
            }
          ]
        }
      },
      {
        title: "Broken zones flip",
        narration: "When price breaks up through supply, that zone becomes demand. The next pullback into it is a long, with the rejection candle as the trigger. Do not ignore a freshly broken zone: it is now on the other side.",
        scene: {
          candles: [
            { o: 140, h: 143.91, l: 139.58, c: 143.68 },
            { o: 143.68, h: 148.1, l: 143.42, c: 147.67 },
            { o: 147.67, h: 152.57, l: 147.12, c: 152.09 },
            { o: 152.09, h: 155.11, l: 151.83, c: 155 },
            { o: 155, h: 155.31, l: 154.73, c: 154.93 },
            { o: 154.93, h: 155.59, l: 154.63, c: 155.15 },
            { o: 155.15, h: 155.21, l: 152.58, c: 152.62 },
            { o: 152.62, h: 152.74, l: 149.56, c: 149.62 },
            { o: 149.62, h: 149.67, l: 146.95, c: 147 },
            { o: 147, h: 151.33, l: 146.79, c: 150.87 },
            { o: 150.87, h: 154.92, l: 150.43, c: 154.52 },
            { o: 154.52, h: 158.19, l: 154.26, c: 157.77 },
            { o: 157.77, h: 161.03, l: 157.32, c: 160.59 },
            { o: 160.59, h: 160.76, l: 159.06, c: 159.2 },
            { o: 159.2, h: 159.34, l: 157.93, c: 158.02 },
            { o: 158.02, h: 158.1, l: 156.32, c: 156.39 },
            { o: 156.39, h: 156.89, l: 155.11, c: 156.84 },
            { o: 156.84, h: 159.12, l: 156.72, c: 159 },
            { o: 159, h: 160.89, l: 158.79, c: 160.81 },
            { o: 160.81, h: 163.93, l: 160.5, c: 163.57 },
            { o: 163.57, h: 165.7, l: 163.41, c: 165.61 },
            { o: 165.61, h: 167.98, l: 165.35, c: 167.59 }
          ],
          zones: [
            {
              from: 4,
              top: 155.59,
              bottom: 154.63,
              kind: "supply",
              label: "Old supply",
              faded: true
            },
            {
              from: 4,
              top: 155.59,
              bottom: 154.63,
              kind: "demand",
              label: "Broken supply = new demand"
            }
          ],
          highlight: {
            from: 16,
            to: 16,
            label: "pullback"
          },
          notes: [
            {
              x: 16,
              y: 153.13,
              text: "Supply broke, so it flipped to demand"
            }
          ]
        }
      },
      {
        title: "Against the trend: strong zones only",
        narration: "Fading a trend is harder, so only strong zones qualify: fast in, fast out, fresh, brief.",
        scene: {
          candles: [
            { o: 128, h: 135.8, l: 127.8, c: 135.42 },
            { o: 135.42, h: 143.5, l: 135.25, c: 143.18 },
            { o: 143.18, h: 150.2, l: 142.92, c: 150 },
            { o: 150, h: 150.39, l: 149.65, c: 149.9 },
            { o: 149.9, h: 149.95, l: 145.68, c: 145.74 },
            { o: 145.74, h: 145.8, l: 141.86, c: 142 },
            { o: 142, h: 143.53, l: 141.84, c: 143.42 },
            { o: 143.42, h: 145.08, l: 143.31, c: 144.9 },
            { o: 144.9, h: 146.38, l: 144.84, c: 146.28 },
            { o: 146.28, h: 148.06, l: 146.11, c: 147.82 },
            { o: 147.82, h: 149.34, l: 147.72, c: 149.25 },
            { o: 149.25, h: 150.34, l: 148.65, c: 148.85 },
            { o: 148.85, h: 149.17, l: 146.64, c: 146.74 },
            { o: 146.74, h: 147.11, l: 144.72, c: 144.85 },
            { o: 144.85, h: 145.28, l: 142.23, c: 142.58 },
            { o: 142.58, h: 142.72, l: 140.33, c: 140.51 },
            { o: 140.51, h: 140.62, l: 137.1, c: 137.63 },
            { o: 137.63, h: 137.88, l: 135.93, c: 136 }
          ],
          zones: [
            {
              from: 3,
              top: 150.39,
              bottom: 149.65,
              kind: "supply",
              label: "Strong supply (fast in, fast out)"
            }
          ],
          highlight: {
            from: 3,
            to: 3,
            label: "strong zone"
          },
          notes: [
            {
              x: 3,
              y: 151.89,
              text: "Against the trend: strong zones only"
            }
          ]
        }
      },
      {
        title: "Enter at the far edge, no confirmation",
        narration: "Place the entry as close as possible to the top of supply (or bottom of demand), right next to the stop. When price gets there, you are in. No confirmation candle. Because risk is entry minus stop, this gives a far higher reward-to-risk ratio.",
        scene: {
          candles: [
            { o: 128, h: 135.8, l: 127.8, c: 135.42 },
            { o: 135.42, h: 143.5, l: 135.25, c: 143.18 },
            { o: 143.18, h: 150.2, l: 142.92, c: 150 },
            { o: 150, h: 150.39, l: 149.65, c: 149.9 },
            { o: 149.9, h: 149.95, l: 145.68, c: 145.74 },
            { o: 145.74, h: 145.8, l: 141.86, c: 142 },
            { o: 142, h: 143.53, l: 141.84, c: 143.42 },
            { o: 143.42, h: 145.08, l: 143.31, c: 144.9 },
            { o: 144.9, h: 146.38, l: 144.84, c: 146.28 },
            { o: 146.28, h: 148.06, l: 146.11, c: 147.82 },
            { o: 147.82, h: 149.34, l: 147.72, c: 149.25 },
            { o: 149.25, h: 150.34, l: 148.65, c: 148.85 },
            { o: 148.85, h: 149.17, l: 146.64, c: 146.74 },
            { o: 146.74, h: 147.11, l: 144.72, c: 144.85 },
            { o: 144.85, h: 145.28, l: 142.23, c: 142.58 },
            { o: 142.58, h: 142.72, l: 140.33, c: 140.51 },
            { o: 140.51, h: 140.62, l: 137.1, c: 137.63 },
            { o: 137.63, h: 137.88, l: 135.93, c: 136 }
          ],
          zones: [
            {
              from: 3,
              top: 150.39,
              bottom: 149.65,
              kind: "supply",
              label: "Strong supply (fast in, fast out)"
            }
          ],
          highlight: {
            from: 11,
            to: 11,
            label: "limit fill"
          },
          notes: [
            {
              x: 11,
              y: 151.89,
              text: "No confirmation candle: tiny risk, huge ratio"
            }
          ],
          lines: [
            {
              y: 150.31,
              label: "Limit entry near the top (far edge)",
              kind: "entry",
              from: 3
            },
            {
              y: 150.42,
              label: "Stop a few cents above",
              kind: "sl",
              from: 3
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "For a with-trend swing trade, the zone must be strong.",
        answer: false,
        explain: "\"We do not necessarily care how strong the zone is, we just want to make sure a zone is there.\" Strength matters for counter-trend trades."
      },
      {
        type: "spot",
        q: "Click the with-trend short trigger candle.",
        scene: {
          candles: [
            { o: 176, h: 176.39, l: 172.04, c: 172.2 },
            { o: 172.2, h: 172.2, l: 167.54, c: 168 },
            { o: 168, h: 168.23, l: 167.54, c: 167.96 },
            { o: 167.96, h: 168.21, l: 167.62, c: 168.03 },
            { o: 168.03, h: 168.09, l: 164.74, c: 164.85 },
            { o: 164.85, h: 164.95, l: 159.92, c: 160.12 },
            { o: 160.12, h: 160.16, l: 156.04, c: 156.21 },
            { o: 156.21, h: 156.34, l: 151.93, c: 152 },
            { o: 152, h: 153.31, l: 151.9, c: 153.26 },
            { o: 153.26, h: 155.05, l: 153.15, c: 155 },
            { o: 155, h: 159.85, l: 154.48, c: 159.43 },
            { o: 159.43, h: 163.9, l: 159.18, c: 163.36 },
            { o: 163.36, h: 166.9, l: 162.96, c: 166.64 },
            { o: 166.64, h: 167.92, l: 166.14, c: 166.19 },
            { o: 166.19, h: 166.85, l: 160.69, c: 161.54 },
            { o: 161.54, h: 161.74, l: 156.52, c: 157.11 },
            { o: 157.11, h: 157.63, l: 152.26, c: 152.68 },
            { o: 152.68, h: 153.06, l: 149.3, c: 149.52 },
            { o: 149.52, h: 150.02, l: 144.44, c: 145.02 },
            { o: 145.02, h: 145.95, l: 139.47, c: 140 }
          ],
          zones: [
            {
              from: 2,
              top: 168.23,
              bottom: 167.54,
              kind: "supply",
              label: "Supply (any zone will do)"
            }
          ]
        },
        answer: {
          from: 13,
          to: 13
        },
        explain: "A bearish candle in a downtrend with its upper wick in the supply zone. Enter after it closes."
      },
      {
        type: "mcq",
        q: "Against the trend, where does Baker enter a short?",
        options: [
          "As close as possible to the top of the supply zone",
          "At the bottom of the supply zone after a confirmation candle",
          "Above the zone after a breakout",
          "Anywhere in the zone"
        ],
        answer: 0,
        explain: "Near the far edge, right by the stop, with no confirmation. That keeps risk tiny and the ratio high."
      },
      {
        type: "mcq",
        q: "Price broke up through a supply zone. What is that zone now?",
        options: [
          "Demand",
          "Still supply",
          "Nothing, delete it",
          "A doji"
        ],
        answer: 0,
        explain: "A broken supply zone becomes demand; a broken demand zone becomes supply. Trade the pullback into it."
      },
      {
        type: "order",
        q: "Order a with-trend long.",
        items: [
          "Confirm the daily trend is up",
          "Price pulls back into a demand zone",
          "A bullish candle forms with its lower wick in the zone",
          "Enter after it closes, stop a few cents below the zone"
        ],
        explain: "Any demand zone will do with the trend, as long as one is there."
      },
      {
        type: "tf",
        q: "Waiting for a confirmation candle on a counter-trend trade lowers the reward-to-risk ratio.",
        answer: true,
        explain: "Waiting moves the entry away from the stop, so the risk grows and the ratio shrinks."
      }
    ],
    practice: [
      {
        prompt: "Downtrend. Price rallied into supply and this candle just closed. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 176, h: 176.39, l: 172.04, c: 172.2 },
            { o: 172.2, h: 172.2, l: 167.54, c: 168 },
            { o: 168, h: 168.23, l: 167.54, c: 167.96 },
            { o: 167.96, h: 168.21, l: 167.62, c: 168.03 },
            { o: 168.03, h: 168.09, l: 164.74, c: 164.85 },
            { o: 164.85, h: 164.95, l: 159.92, c: 160.12 },
            { o: 160.12, h: 160.16, l: 156.04, c: 156.21 },
            { o: 156.21, h: 156.34, l: 151.93, c: 152 },
            { o: 152, h: 153.31, l: 151.9, c: 153.26 },
            { o: 153.26, h: 155.05, l: 153.15, c: 155 },
            { o: 155, h: 159.85, l: 154.48, c: 159.43 },
            { o: 159.43, h: 163.9, l: 159.18, c: 163.36 },
            { o: 163.36, h: 166.9, l: 162.96, c: 166.64 },
            { o: 166.64, h: 167.92, l: 166.14, c: 166.19 },
            { o: 166.19, h: 166.85, l: 160.69, c: 161.54 },
            { o: 161.54, h: 161.74, l: 156.52, c: 157.11 },
            { o: 157.11, h: 157.63, l: 152.26, c: 152.68 },
            { o: 152.68, h: 153.06, l: 149.3, c: 149.52 },
            { o: 149.52, h: 150.02, l: 144.44, c: 145.02 },
            { o: 145.02, h: 145.95, l: 139.47, c: 140 }
          ],
          zones: [
            {
              from: 2,
              top: 168.23,
              bottom: 167.54,
              kind: "supply",
              label: "Supply (any zone will do)"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "sell",
          entry: 166.19,
          sl: 168.26
        },
        explain: "Bearish candle with its upper wick in supply, with the trend. Sell after the close (166.19), stop a few cents above the zone (168.26). The downtrend resumed."
      },
      {
        prompt: "Uptrend, but price is coming back to a strong supply zone (fast in, fast out, fresh). Pick your counter-trend entry and stop.",
        scene: {
          candles: [
            { o: 128, h: 135.8, l: 127.8, c: 135.42 },
            { o: 135.42, h: 143.5, l: 135.25, c: 143.18 },
            { o: 143.18, h: 150.2, l: 142.92, c: 150 },
            { o: 150, h: 150.39, l: 149.65, c: 149.9 },
            { o: 149.9, h: 149.95, l: 145.68, c: 145.74 },
            { o: 145.74, h: 145.8, l: 141.86, c: 142 },
            { o: 142, h: 143.53, l: 141.84, c: 143.42 },
            { o: 143.42, h: 145.08, l: 143.31, c: 144.9 },
            { o: 144.9, h: 146.38, l: 144.84, c: 146.28 },
            { o: 146.28, h: 148.06, l: 146.11, c: 147.82 },
            { o: 147.82, h: 149.34, l: 147.72, c: 149.25 },
            { o: 149.25, h: 150.34, l: 148.65, c: 148.85 },
            { o: 148.85, h: 149.17, l: 146.64, c: 146.74 },
            { o: 146.74, h: 147.11, l: 144.72, c: 144.85 },
            { o: 144.85, h: 145.28, l: 142.23, c: 142.58 },
            { o: 142.58, h: 142.72, l: 140.33, c: 140.51 },
            { o: 140.51, h: 140.62, l: 137.1, c: 137.63 },
            { o: 137.63, h: 137.88, l: 135.93, c: 136 }
          ],
          zones: [
            {
              from: 3,
              top: 150.39,
              bottom: 149.65,
              kind: "supply",
              label: "Strong supply (fast in, fast out)"
            }
          ],
          reveal: 11
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 150.31,
          sl: 150.42
        },
        explain: "Limit short as close as possible to the top (150.31), stop a few cents above (150.42), no confirmation. Risk is only 0.11 per share, and price dropped hard."
      },
      {
        prompt: "This supply zone was broken upward. Price pulled back into it and this candle closed. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 140, h: 143.91, l: 139.58, c: 143.68 },
            { o: 143.68, h: 148.1, l: 143.42, c: 147.67 },
            { o: 147.67, h: 152.57, l: 147.12, c: 152.09 },
            { o: 152.09, h: 155.11, l: 151.83, c: 155 },
            { o: 155, h: 155.31, l: 154.73, c: 154.93 },
            { o: 154.93, h: 155.59, l: 154.63, c: 155.15 },
            { o: 155.15, h: 155.21, l: 152.58, c: 152.62 },
            { o: 152.62, h: 152.74, l: 149.56, c: 149.62 },
            { o: 149.62, h: 149.67, l: 146.95, c: 147 },
            { o: 147, h: 151.33, l: 146.79, c: 150.87 },
            { o: 150.87, h: 154.92, l: 150.43, c: 154.52 },
            { o: 154.52, h: 158.19, l: 154.26, c: 157.77 },
            { o: 157.77, h: 161.03, l: 157.32, c: 160.59 },
            { o: 160.59, h: 160.76, l: 159.06, c: 159.2 },
            { o: 159.2, h: 159.34, l: 157.93, c: 158.02 },
            { o: 158.02, h: 158.1, l: 156.32, c: 156.39 },
            { o: 156.39, h: 156.89, l: 155.11, c: 156.84 },
            { o: 156.84, h: 159.12, l: 156.72, c: 159 },
            { o: 159, h: 160.89, l: 158.79, c: 160.81 },
            { o: 160.81, h: 163.93, l: 160.5, c: 163.57 },
            { o: 163.57, h: 165.7, l: 163.41, c: 165.61 },
            { o: 165.61, h: 167.98, l: 165.35, c: 167.59 }
          ],
          zones: [
            {
              from: 4,
              top: 155.59,
              bottom: 154.63,
              kind: "supply",
              label: "Old supply",
              faded: true
            },
            {
              from: 4,
              top: 155.59,
              bottom: 154.63,
              kind: "demand",
              label: "Broken supply = new demand"
            }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 154.6
        },
        explain: "Broken supply flipped to demand. A bullish candle with its lower wick in it is a with-trend long, stop a few cents below the zone. Price rallied."
      }
    ],
    cards: [
      {
        front: "Swing trading uses which chart?",
        back: "The daily chart."
      },
      {
        front: "With-trend short trigger?",
        back: "A bearish candle whose upper wick is in a supply zone; enter after it closes."
      },
      {
        front: "With-trend: does the zone need to be strong?",
        back: "No, a zone just has to be there."
      },
      {
        front: "Counter-trend: which zones?",
        back: "Strong zones only."
      },
      {
        front: "Counter-trend entry?",
        back: "Limit as close as possible to the far edge, no confirmation, stop a few cents beyond."
      },
      {
        front: "Broken supply becomes?",
        back: "Demand. Broken demand becomes supply."
      },
      {
        front: "Why enter near the far edge?",
        back: "Risk = entry minus stop, so a near-stop entry gives a much higher reward-to-risk."
      }
    ],
    mnemonic: "With the river: any dock plus a wick. Against the river: strong dock, far edge, no wait."
  },
  {
    mentor: "baker",
    n: 8,
    eli5: {
      oneLiner: "Find the zone on the daily chart, then pull the trigger on the 5-minute.",
      story: "A goalkeeper studies where the striker always kicks (the big picture), then watches the ball closely in the last second (the small picture). Baker finds strong, fresh zones on the daily chart, then times the entry on a 5-minute chart. When price falls very fast into a strong zone, it looks scary, like catching a falling knife. But those fast drops are often the very best trades.",
      analogy: "The daily chart is the map; the 5-minute chart is the magnifying glass."
    },
    bigIdeas: [
      "Zone from the daily chart (stronger), entries and exits on the hourly or 5-minute chart.",
      "Only strong, fresh daily zones. A fast \"falling knife\" into one is often the best trade.",
      "Two or three positions at most. Trail the stop behind each new higher low. Size by 1% risk, not buying power."
    ],
    steps: [
      {
        title: "Strong, fresh daily zone",
        narration: "Baker's BBY trade: a daily demand zone at 13.65-14.50. It started life as supply and had never been tested as demand. Day trades only use strong, fresh daily zones: fast in and out, untested, not part of another zone.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            }
          ],
          notes: [
            {
              x: 1,
              y: 13.75,
              text: "Zone from the DAILY chart: strong, fresh, never tested as demand"
            }
          ]
        }
      },
      {
        title: "The falling knife",
        narration: "On the 5-minute chart, price dropped rapidly into the zone. Traders say do not catch a falling knife. Baker says these fast moves into a strong zone are actually the best trades, with the best ratios.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            }
          ],
          notes: [
            {
              x: 3,
              y: 15,
              text: "Fast drop into the zone: scary, but often the best trade"
            }
          ],
          highlight: {
            from: 3,
            to: 7,
            label: "falling knife"
          }
        }
      },
      {
        title: "Turn and second chance",
        narration: "Price hit 13.91 and reversed. Take it as it turns, or wait: most of the time price comes back and gives you a second chance near the zone.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            }
          ],
          notes: [
            {
              x: 7,
              y: 13.8,
              text: "Turns at 13.91"
            },
            {
              x: 11,
              y: 13.8,
              text: "Second chance"
            }
          ],
          highlight: {
            from: 7,
            to: 11,
            label: "second chance"
          }
        }
      },
      {
        title: "Entry, stop and exit",
        narration: "Buy at 13.91 or better. Stop at 13.62, three cents under the zone. Exit at 15.95, at the bottom of the 5-minute supply. That is about 30 cents of risk for about $2 of reward.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            },
            {
              from: 0,
              top: 16.18,
              bottom: 15.96,
              kind: "supply",
              label: "5-min supply"
            }
          ],
          notes: [
            {
              x: 7,
              y: 13.8,
              text: "Turns at 13.91"
            },
            {
              x: 11,
              y: 13.8,
              text: "Second chance"
            }
          ],
          lines: [
            {
              y: 13.91,
              label: "Entry 13.91",
              kind: "entry",
              from: 7
            },
            {
              y: 13.62,
              label: "Stop 13.62 (3 cents under zone)",
              kind: "sl",
              from: 7
            },
            {
              y: 15.95,
              label: "Exit 15.95 (5-min supply)",
              kind: "tp",
              from: 7
            }
          ]
        }
      },
      {
        title: "Trail the stop",
        narration: "As price rises, move the stop up below each new higher low on the execution chart. For shorts, move it down above each new lower high.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            },
            {
              from: 0,
              top: 16.18,
              bottom: 15.96,
              kind: "supply",
              label: "5-min supply"
            }
          ],
          notes: [
            {
              x: 7,
              y: 13.8,
              text: "Turns at 13.91"
            },
            {
              x: 11,
              y: 13.8,
              text: "Second chance"
            }
          ],
          lines: [
            {
              y: 13.91,
              label: "Entry 13.91",
              kind: "entry",
              from: 7
            },
            {
              y: 13.62,
              label: "Stop 13.62 (3 cents under zone)",
              kind: "sl",
              from: 7
            },
            {
              y: 15.95,
              label: "Exit 15.95 (5-min supply)",
              kind: "tp",
              from: 7
            },
            {
              y: 14.49,
              label: "Trail stop under higher low",
              kind: "sl",
              from: 15
            },
            {
              y: 15.04,
              label: "Trail again",
              kind: "sl",
              from: 19
            }
          ]
        }
      },
      {
        title: "Size by risk, not buying power",
        narration: "Buying power would allow 8,500 shares. With the 1% rule on a $30,000 account ($300 risk) the size is 1,000 shares: about $2,000 profit for $300 of risk. The closer your entry to the zone bottom, the bigger the size for the same risk.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            },
            {
              from: 0,
              top: 16.18,
              bottom: 15.96,
              kind: "supply",
              label: "5-min supply"
            }
          ],
          notes: [
            {
              x: 22,
              y: 13.8,
              text: "1% rule: $300 / 0.30 risk = 1,000 shares, not 8,500"
            }
          ],
          lines: [
            {
              y: 13.91,
              label: "Entry 13.91",
              kind: "entry",
              from: 7
            },
            {
              y: 13.62,
              label: "Stop 13.62 (3 cents under zone)",
              kind: "sl",
              from: 7
            },
            {
              y: 15.95,
              label: "Exit 15.95 (5-min supply)",
              kind: "tp",
              from: 7
            },
            {
              y: 14.49,
              label: "Trail stop under higher low",
              kind: "sl",
              from: 15
            },
            {
              y: 15.04,
              label: "Trail again",
              kind: "sl",
              from: 19
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "How many positions does Baker hold at once when day trading?",
        options: [
          "No more than two or three",
          "At least ten for diversification",
          "Exactly one, always",
          "As many as buying power allows"
        ],
        answer: 0,
        explain: "Many positions are hard to manage intraday. A few is fine, but no more than two or three."
      },
      {
        type: "mcq",
        q: "Which stock moves more: a $10 stock with a 20-cent ATR or a $100 stock with a $1 ATR?",
        options: [
          "The $10 stock (2% vs 1%)",
          "The $100 stock",
          "They move the same",
          "You cannot tell"
        ],
        answer: 0,
        explain: "Judge ATR as a percentage of price: 0.20/10 = 2%, 1/100 = 1%."
      },
      {
        type: "spot",
        q: "Click the falling-knife candles into the daily zone.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            }
          ]
        },
        answer: {
          from: 3,
          to: 7
        },
        explain: "A rapid drop into a strong, fresh zone. Scary, but these are often the best trades."
      },
      {
        type: "tf",
        q: "Today's day-trading profits add to your buying power today.",
        answer: false,
        explain: "Brokers give four times the start-of-day cash ($30,000 = $120,000). Today's profits only add to buying power tomorrow."
      },
      {
        type: "tf",
        q: "Baker only day trades stocks priced $20 to $100.",
        answer: false,
        explain: "1,000 shares of a $50 stock is the same as 100 shares of a $500 stock. A price filter throws away good setups."
      },
      {
        type: "order",
        q: "Order Baker's ALK short.",
        items: [
          "A fresh daily supply zone forms",
          "Six days later price rallies back into it",
          "A 5-minute candle closes near the top of the zone; short after the close",
          "Trail the stop above each new lower high until stopped out"
        ],
        explain: "Entry 67.90, stop 68.03, out at 66.11: $1.77 a share, almost 12:1."
      }
    ],
    practice: [
      {
        prompt: "Price is knifing down into a strong, fresh daily demand zone (13.65-14.50) on the 5-minute chart. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            }
          ],
          reveal: 7
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          entry: 13.91,
          sl: 13.62,
          tp: 15.95
        },
        explain: "A fast move into a strong fresh zone is one of the best trades. Buy near 13.91, stop 13.62, exit at the 5-minute supply 15.95. Price turned and ran to the exit in about an hour."
      },
      {
        prompt: "Price bounced and came back near the zone: your second chance. Pick entry, stop and exit.",
        scene: {
          candles: [
            { o: 16, h: 16.18, l: 15.96, c: 16.06 },
            { o: 16.06, h: 16.17, l: 15.98, c: 16.1 },
            { o: 16.1, h: 16.12, l: 15.82, c: 15.86 },
            { o: 15.86, h: 15.9, l: 15.4, c: 15.45 },
            { o: 15.45, h: 15.48, l: 14.98, c: 15.02 },
            { o: 15.02, h: 15.05, l: 14.58, c: 14.62 },
            { o: 14.62, h: 14.66, l: 14.3, c: 14.33 },
            { o: 14.33, h: 14.36, l: 13.91, c: 14.18 },
            { o: 14.18, h: 14.4, l: 14.15, c: 14.36 },
            { o: 14.36, h: 14.55, l: 14.3, c: 14.5 },
            { o: 14.5, h: 14.52, l: 14.2, c: 14.24 },
            { o: 14.24, h: 14.26, l: 13.9, c: 14.1 },
            { o: 14.1, h: 14.38, l: 14.06, c: 14.34 },
            { o: 14.34, h: 14.62, l: 14.3, c: 14.58 },
            { o: 14.58, h: 14.75, l: 14.52, c: 14.7 },
            { o: 14.7, h: 14.72, l: 14.5, c: 14.56 },
            { o: 14.56, h: 14.95, l: 14.54, c: 14.9 },
            { o: 14.9, h: 15.25, l: 14.88, c: 15.2 },
            { o: 15.2, h: 15.4, l: 15.15, c: 15.34 },
            { o: 15.34, h: 15.36, l: 15.05, c: 15.12 },
            { o: 15.12, h: 15.5, l: 15.1, c: 15.45 },
            { o: 15.45, h: 15.8, l: 15.4, c: 15.74 },
            { o: 15.74, h: 15.96, l: 15.7, c: 15.9 },
            { o: 15.9, h: 15.92, l: 15.72, c: 15.76 },
            { o: 15.76, h: 15.8, l: 15.55, c: 15.6 }
          ],
          zones: [
            {
              from: 0,
              top: 14.5,
              bottom: 13.65,
              kind: "demand",
              label: "Daily demand 13.65-14.50 (fresh)"
            },
            {
              from: 0,
              top: 16.18,
              bottom: 15.96,
              kind: "supply",
              label: "5-min supply"
            }
          ],
          reveal: 11
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 13.91,
          sl: 13.62,
          tp: 15.95
        },
        explain: "Buy at 13.91 or better, stop three cents under the zone at 13.62, exit one cent under the 5-minute supply at 15.95. Risk about 30 cents for about $2.02: almost 7:1."
      }
    ],
    cards: [
      {
        front: "Day trading timeframes?",
        back: "Daily chart for the zone, hourly or 5-minute for entries and exits."
      },
      {
        front: "Which zones for day trades?",
        back: "Strong, fresh daily zones: fast in and out, untested, not part of another zone."
      },
      {
        front: "Falling knife into a strong zone?",
        back: "Often the best trade with the best ratio."
      },
      {
        front: "Max positions at once?",
        back: "Two or three."
      },
      {
        front: "Judge volatility how?",
        back: "ATR as a percentage of price."
      },
      {
        front: "Minimum equity to day trade US stocks?",
        back: "$25,000; start with more so one loss does not block you."
      },
      {
        front: "How to trail a long's stop?",
        back: "Below each new higher low on the execution chart."
      },
      {
        front: "Size the trade by?",
        back: "The 1% risk rule, not buying power."
      }
    ],
    mnemonic: "Map on the daily, magnifier on the 5-minute, knife into a fresh zone = gift."
  },
  {
    mentor: "baker",
    n: 9,
    eli5: {
      oneLiner: "Gaps flip zones, and at new highs you wait for a fresh, strong zone.",
      story: "If a strong wind blows a door wide open in the night, in the morning the door is open: the old wall is now behind you. Kids rushing in at the door bump back a little first, then run inside. That is a gap and its opening pullback. On top of a brand-new mountain nobody has climbed, there are no old footprints, so you wait until someone makes the first strong footprint.",
      analogy: "An all-time high is fresh snow: no tracks yet. The first strong track is always fresh."
    },
    bigIdeas: [
      "Gap through a zone: wait for the opening pullback, enter as it resumes, stop beyond the low (or high) of the day.",
      "A zone that failed on the daily can still give an intraday trade, managed as a day trade.",
      "At all-time highs or lows: no trade until a strong new zone forms. Then trade its first return."
    ],
    steps: [
      {
        title: "Find the gap pre-market",
        narration: "A pierced supply zone becomes demand, and a pierced demand zone becomes supply. Before the open, scan for stocks that will gap up through supply or down through demand.",
        scene: {
          candles: [
            { o: 138, h: 141.13, l: 137.63, c: 140.85 },
            { o: 140.85, h: 143.59, l: 140.74, c: 143.4 },
            { o: 143.4, h: 146.16, l: 143.21, c: 146 },
            { o: 146, h: 146.39, l: 145.7, c: 146.01 },
            { o: 146.01, h: 146.25, l: 145.81, c: 145.9 },
            { o: 145.9, h: 145.94, l: 143.68, c: 143.74 },
            { o: 143.74, h: 143.79, l: 141.79, c: 141.83 },
            { o: 141.83, h: 141.92, l: 139.96, c: 140 },
            { o: 140, h: 140.54, l: 139.38, c: 139.77 },
            { o: 139.77, h: 140.42, l: 138.97, c: 139.41 },
            { o: 139.41, h: 140.51, l: 139, c: 140.13 },
            { o: 140.13, h: 141.07, l: 139.37, c: 140.5 },
            { o: 140.5, h: 140.87, l: 139.26, c: 140.03 },
            { o: 148.59, h: 149.19, l: 148.09, c: 148.89 },
            { o: 148.89, h: 148.99, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.99, l: 147.09, c: 147.49 },
            { o: 147.49, h: 148.79, l: 147.39, c: 148.69 },
            { o: 148.69, h: 149.69, l: 148.61, c: 149.64 },
            { o: 149.64, h: 151.07, l: 149.51, c: 151.03 },
            { o: 151.03, h: 152.47, l: 150.9, c: 152.31 },
            { o: 152.31, h: 153.3, l: 152.25, c: 153.25 },
            { o: 153.25, h: 154.49, l: 153.16, c: 154.39 }
          ],
          zones: [
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "supply",
              label: "Supply"
            }
          ],
          notes: [
            {
              x: 7,
              y: 148.39,
              text: "Pre-market: this stock will gap up through supply"
            }
          ]
        }
      },
      {
        title: "Wait for the opening pullback",
        narration: "At the open many limit orders trigger and push price back for a moment. Do not chase the first print. Wait for that small pullback.",
        scene: {
          candles: [
            { o: 138, h: 141.13, l: 137.63, c: 140.85 },
            { o: 140.85, h: 143.59, l: 140.74, c: 143.4 },
            { o: 143.4, h: 146.16, l: 143.21, c: 146 },
            { o: 146, h: 146.39, l: 145.7, c: 146.01 },
            { o: 146.01, h: 146.25, l: 145.81, c: 145.9 },
            { o: 145.9, h: 145.94, l: 143.68, c: 143.74 },
            { o: 143.74, h: 143.79, l: 141.79, c: 141.83 },
            { o: 141.83, h: 141.92, l: 139.96, c: 140 },
            { o: 140, h: 140.54, l: 139.38, c: 139.77 },
            { o: 139.77, h: 140.42, l: 138.97, c: 139.41 },
            { o: 139.41, h: 140.51, l: 139, c: 140.13 },
            { o: 140.13, h: 141.07, l: 139.37, c: 140.5 },
            { o: 140.5, h: 140.87, l: 139.26, c: 140.03 },
            { o: 148.59, h: 149.19, l: 148.09, c: 148.89 },
            { o: 148.89, h: 148.99, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.99, l: 147.09, c: 147.49 },
            { o: 147.49, h: 148.79, l: 147.39, c: 148.69 },
            { o: 148.69, h: 149.69, l: 148.61, c: 149.64 },
            { o: 149.64, h: 151.07, l: 149.51, c: 151.03 },
            { o: 151.03, h: 152.47, l: 150.9, c: 152.31 },
            { o: 152.31, h: 153.3, l: 152.25, c: 153.25 },
            { o: 153.25, h: 154.49, l: 153.16, c: 154.39 }
          ],
          zones: [
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "supply",
              label: "Supply",
              faded: true
            },
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "demand",
              label: "Pierced supply flips to demand"
            }
          ],
          highlight: {
            from: 13,
            to: 15,
            label: "opening pullback"
          },
          notes: [
            {
              x: 13,
              y: 150.39,
              text: "Open: limit orders push price back for a moment"
            }
          ]
        }
      },
      {
        title: "Enter as it resumes; stop under the day's low",
        narration: "When price turns and continues in the gap's direction, enter. Stop a few cents below the low of the day (above the high for a short). This is the only time Baker's stop is not set from a zone: the pullback shows where current demand is.",
        scene: {
          candles: [
            { o: 138, h: 141.13, l: 137.63, c: 140.85 },
            { o: 140.85, h: 143.59, l: 140.74, c: 143.4 },
            { o: 143.4, h: 146.16, l: 143.21, c: 146 },
            { o: 146, h: 146.39, l: 145.7, c: 146.01 },
            { o: 146.01, h: 146.25, l: 145.81, c: 145.9 },
            { o: 145.9, h: 145.94, l: 143.68, c: 143.74 },
            { o: 143.74, h: 143.79, l: 141.79, c: 141.83 },
            { o: 141.83, h: 141.92, l: 139.96, c: 140 },
            { o: 140, h: 140.54, l: 139.38, c: 139.77 },
            { o: 139.77, h: 140.42, l: 138.97, c: 139.41 },
            { o: 139.41, h: 140.51, l: 139, c: 140.13 },
            { o: 140.13, h: 141.07, l: 139.37, c: 140.5 },
            { o: 140.5, h: 140.87, l: 139.26, c: 140.03 },
            { o: 148.59, h: 149.19, l: 148.09, c: 148.89 },
            { o: 148.89, h: 148.99, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.99, l: 147.09, c: 147.49 },
            { o: 147.49, h: 148.79, l: 147.39, c: 148.69 },
            { o: 148.69, h: 149.69, l: 148.61, c: 149.64 },
            { o: 149.64, h: 151.07, l: 149.51, c: 151.03 },
            { o: 151.03, h: 152.47, l: 150.9, c: 152.31 },
            { o: 152.31, h: 153.3, l: 152.25, c: 153.25 },
            { o: 153.25, h: 154.49, l: 153.16, c: 154.39 }
          ],
          zones: [
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "supply",
              label: "Supply",
              faded: true
            },
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "demand",
              label: "Pierced supply flips to demand"
            }
          ],
          highlight: {
            from: 16,
            to: 16,
            label: "resumes"
          },
          notes: [
            {
              x: 16,
              y: 145.86,
              text: "The only stop not based on a zone"
            }
          ],
          lines: [
            {
              y: 148.69,
              label: "Enter as it turns back up",
              kind: "entry",
              from: 13
            },
            {
              y: 147.06,
              label: "Stop below the LOW OF THE DAY",
              kind: "sl",
              from: 13
            }
          ]
        }
      },
      {
        title: "All-time high: nothing overhead",
        narration: "At an all-time high there is no supply zone above to work with. Do not short just because it \"looks high\". Wait.",
        scene: {
          candles: [
            { o: 128, h: 133.68, l: 127.31, c: 133.23 },
            { o: 133.23, h: 138.22, l: 132.97, c: 137.73 },
            { o: 137.73, h: 143.65, l: 136.75, c: 143.14 },
            { o: 143.14, h: 148.36, l: 142.59, c: 147.69 },
            { o: 147.69, h: 153.75, l: 147.45, c: 152.8 },
            { o: 152.8, h: 157.83, l: 152.16, c: 157.46 },
            { o: 157.46, h: 162.32, l: 156.6, c: 161.7 },
            { o: 161.7, h: 166.74, l: 161.25, c: 166 },
            { o: 166, h: 171.13, l: 165.79, c: 171.05 },
            { o: 171.05, h: 175.04, l: 170.87, c: 175 },
            { o: 175, h: 175.29, l: 174.85, c: 175.2 },
            { o: 175.2, h: 175.25, l: 169.77, c: 169.99 },
            { o: 169.99, h: 170.12, l: 165.85, c: 166 },
            { o: 166, h: 170.87, l: 165.84, c: 170.72 },
            { o: 170.72, h: 174.46, l: 170.39, c: 174.25 },
            { o: 174.25, h: 175.07, l: 173.75, c: 173.85 },
            { o: 173.85, h: 174.13, l: 169.09, c: 169.71 },
            { o: 169.71, h: 169.82, l: 167.33, c: 167.56 },
            { o: 167.56, h: 168.22, l: 163.49, c: 163.84 },
            { o: 163.84, h: 164.43, l: 159.86, c: 160.1 },
            { o: 160.1, h: 160.52, l: 155.54, c: 156 }
          ],
          notes: [
            {
              x: 5,
              y: 172,
              text: "All-time high: no zone overhead. Wait."
            }
          ]
        }
      },
      {
        title: "A strong new zone forms",
        narration: "When price spikes in and drops out fast, a strong new supply zone is born. A new zone is always fresh because price has never been there before. Trade its first return.",
        scene: {
          candles: [
            { o: 128, h: 133.68, l: 127.31, c: 133.23 },
            { o: 133.23, h: 138.22, l: 132.97, c: 137.73 },
            { o: 137.73, h: 143.65, l: 136.75, c: 143.14 },
            { o: 143.14, h: 148.36, l: 142.59, c: 147.69 },
            { o: 147.69, h: 153.75, l: 147.45, c: 152.8 },
            { o: 152.8, h: 157.83, l: 152.16, c: 157.46 },
            { o: 157.46, h: 162.32, l: 156.6, c: 161.7 },
            { o: 161.7, h: 166.74, l: 161.25, c: 166 },
            { o: 166, h: 171.13, l: 165.79, c: 171.05 },
            { o: 171.05, h: 175.04, l: 170.87, c: 175 },
            { o: 175, h: 175.29, l: 174.85, c: 175.2 },
            { o: 175.2, h: 175.25, l: 169.77, c: 169.99 },
            { o: 169.99, h: 170.12, l: 165.85, c: 166 },
            { o: 166, h: 170.87, l: 165.84, c: 170.72 },
            { o: 170.72, h: 174.46, l: 170.39, c: 174.25 },
            { o: 174.25, h: 175.07, l: 173.75, c: 173.85 },
            { o: 173.85, h: 174.13, l: 169.09, c: 169.71 },
            { o: 169.71, h: 169.82, l: 167.33, c: 167.56 },
            { o: 167.56, h: 168.22, l: 163.49, c: 163.84 },
            { o: 163.84, h: 164.43, l: 159.86, c: 160.1 },
            { o: 160.1, h: 160.52, l: 155.54, c: 156 }
          ],
          zones: [
            {
              from: 10,
              top: 175.29,
              bottom: 174.85,
              kind: "supply",
              label: "New strong supply (always fresh)"
            }
          ],
          highlight: {
            from: 8,
            to: 12,
            label: "fast in, fast out"
          },
          notes: [
            {
              x: 15,
              y: 176.79,
              text: "First return: short"
            }
          ]
        }
      },
      {
        title: "Slow in = weak",
        narration: "Baker's BWLD lesson: price climbed into the zone slowly. Even though it left fast, the zone was weaker and price went straight through on the return. Against a trending stock, only trade strong zones: fast in AND fast out.",
        scene: {
          candles: [
            { o: 150, h: 153.56, l: 149.58, c: 152.39 },
            { o: 152.39, h: 154.91, l: 152.16, c: 154.38 },
            { o: 154.38, h: 156.64, l: 154.04, c: 156.25 },
            { o: 156.25, h: 159.38, l: 155.29, c: 158.58 },
            { o: 158.58, h: 161.08, l: 158.09, c: 160.41 },
            { o: 160.41, h: 163.08, l: 159.64, c: 162.77 },
            { o: 162.77, h: 166.5, l: 162.47, c: 165.26 },
            { o: 165.26, h: 167.21, l: 164.58, c: 166.75 },
            { o: 166.75, h: 169.13, l: 166.07, c: 169 },
            { o: 169, h: 169.13, l: 168.79, c: 168.92 },
            { o: 168.92, h: 168.97, l: 164.72, c: 164.86 },
            { o: 164.86, h: 164.93, l: 161.89, c: 162 },
            { o: 162, h: 164.47, l: 161.79, c: 164.19 },
            { o: 164.19, h: 165.95, l: 164.03, c: 165.87 },
            { o: 165.87, h: 168.4, l: 165.64, c: 168.29 },
            { o: 168.29, h: 169.09, l: 167.99, c: 168.39 },
            { o: 168.39, h: 170.65, l: 168.21, c: 170.44 },
            { o: 170.44, h: 172.04, l: 170.37, c: 171.93 },
            { o: 171.93, h: 173.49, l: 171.87, c: 173.39 },
            { o: 173.39, h: 175.4, l: 173.31, c: 175.13 }
          ],
          zones: [
            {
              from: 9,
              top: 169.13,
              bottom: 168.79,
              kind: "supply",
              label: "Supply (price crept in slowly)"
            }
          ],
          highlight: {
            from: 0,
            to: 8,
            label: "slow climb"
          },
          notes: [
            {
              x: 15,
              y: 172.13,
              text: "Left fast, but arrived slowly: weak, broke"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "tf",
        q: "On a gap-through-a-zone trade, the stop goes a few cents beyond the low (long) or high (short) of the day.",
        answer: true,
        explain: "\"This is the only time we do not set our stops based on the supply and demand zones.\""
      },
      {
        type: "mcq",
        q: "The stock gaps up through supply. What do you do at the open?",
        options: [
          "Wait for the small pullback, then enter as it resumes",
          "Buy the very first print",
          "Short it because it gapped",
          "Nothing, gaps are never traded"
        ],
        answer: 0,
        explain: "Many limit orders trigger at the open and push price back. Wait for the pullback, then trade in the gap's direction."
      },
      {
        type: "spot",
        q: "Click the candle that made the low of the day.",
        scene: {
          candles: [
            { o: 138, h: 141.13, l: 137.63, c: 140.85 },
            { o: 140.85, h: 143.59, l: 140.74, c: 143.4 },
            { o: 143.4, h: 146.16, l: 143.21, c: 146 },
            { o: 146, h: 146.39, l: 145.7, c: 146.01 },
            { o: 146.01, h: 146.25, l: 145.81, c: 145.9 },
            { o: 145.9, h: 145.94, l: 143.68, c: 143.74 },
            { o: 143.74, h: 143.79, l: 141.79, c: 141.83 },
            { o: 141.83, h: 141.92, l: 139.96, c: 140 },
            { o: 140, h: 140.54, l: 139.38, c: 139.77 },
            { o: 139.77, h: 140.42, l: 138.97, c: 139.41 },
            { o: 139.41, h: 140.51, l: 139, c: 140.13 },
            { o: 140.13, h: 141.07, l: 139.37, c: 140.5 },
            { o: 140.5, h: 140.87, l: 139.26, c: 140.03 },
            { o: 148.59, h: 149.19, l: 148.09, c: 148.89 },
            { o: 148.89, h: 148.99, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.99, l: 147.09, c: 147.49 },
            { o: 147.49, h: 148.79, l: 147.39, c: 148.69 },
            { o: 148.69, h: 149.69, l: 148.61, c: 149.64 },
            { o: 149.64, h: 151.07, l: 149.51, c: 151.03 },
            { o: 151.03, h: 152.47, l: 150.9, c: 152.31 },
            { o: 152.31, h: 153.3, l: 152.25, c: 153.25 },
            { o: 153.25, h: 154.49, l: 153.16, c: 154.39 }
          ],
          zones: [
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "supply",
              label: "Supply"
            }
          ]
        },
        answer: {
          from: 15,
          to: 15
        },
        explain: "The stop goes a few cents below this candle's low. If price breaks it, the current demand is gone: get out."
      },
      {
        type: "mcq",
        q: "Price is at an all-time high with no zone overhead. Baker...",
        options: [
          "Waits for a strong new zone and trades its first return",
          "Shorts because it looks high",
          "Buys with no stop",
          "Draws a zone at a round number"
        ],
        answer: 0,
        explain: "No zone, no trade. A new zone is always fresh because price has never been there."
      },
      {
        type: "tf",
        q: "A zone price crept into slowly but left fast is strong enough to fade a trend.",
        answer: false,
        explain: "BWLD: slow in made it weaker, and price went straight through. Against a trend you need fast in and fast out."
      },
      {
        type: "mcq",
        q: "GCI opened inside a daily supply zone; the swing short was stopped out that afternoon. What did Baker say?",
        options: [
          "As a day trade, shorting the open and covering in the morning made more than $1",
          "Never trade a zone that later fails",
          "Hold the short overnight anyway",
          "Double the position"
        ],
        answer: 0,
        explain: "A zone that fails on the daily can still pay intraday, but manage it strictly as a day trade."
      }
    ],
    practice: [
      {
        prompt: "The stock gapped up through supply, pulled back, and this candle turned back up. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 138, h: 141.13, l: 137.63, c: 140.85 },
            { o: 140.85, h: 143.59, l: 140.74, c: 143.4 },
            { o: 143.4, h: 146.16, l: 143.21, c: 146 },
            { o: 146, h: 146.39, l: 145.7, c: 146.01 },
            { o: 146.01, h: 146.25, l: 145.81, c: 145.9 },
            { o: 145.9, h: 145.94, l: 143.68, c: 143.74 },
            { o: 143.74, h: 143.79, l: 141.79, c: 141.83 },
            { o: 141.83, h: 141.92, l: 139.96, c: 140 },
            { o: 140, h: 140.54, l: 139.38, c: 139.77 },
            { o: 139.77, h: 140.42, l: 138.97, c: 139.41 },
            { o: 139.41, h: 140.51, l: 139, c: 140.13 },
            { o: 140.13, h: 141.07, l: 139.37, c: 140.5 },
            { o: 140.5, h: 140.87, l: 139.26, c: 140.03 },
            { o: 148.59, h: 149.19, l: 148.09, c: 148.89 },
            { o: 148.89, h: 148.99, l: 147.59, c: 147.79 },
            { o: 147.79, h: 147.99, l: 147.09, c: 147.49 },
            { o: 147.49, h: 148.79, l: 147.39, c: 148.69 },
            { o: 148.69, h: 149.69, l: 148.61, c: 149.64 },
            { o: 149.64, h: 151.07, l: 149.51, c: 151.03 },
            { o: 151.03, h: 152.47, l: 150.9, c: 152.31 },
            { o: 152.31, h: 153.3, l: 152.25, c: 153.25 },
            { o: 153.25, h: 154.49, l: 153.16, c: 154.39 }
          ],
          zones: [
            {
              from: 3,
              top: 146.39,
              bottom: 145.7,
              kind: "demand",
              label: "Pierced supply = demand"
            }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          entry: 148.69,
          sl: 147.06
        },
        explain: "Opening pullback done and price resumed the gap direction. Buy, stop a few cents below the low of the day (147.06). Price continued up."
      },
      {
        prompt: "All-time high. A strong new supply zone formed (fast in, fast out) and price is back for the first time. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 128, h: 133.68, l: 127.31, c: 133.23 },
            { o: 133.23, h: 138.22, l: 132.97, c: 137.73 },
            { o: 137.73, h: 143.65, l: 136.75, c: 143.14 },
            { o: 143.14, h: 148.36, l: 142.59, c: 147.69 },
            { o: 147.69, h: 153.75, l: 147.45, c: 152.8 },
            { o: 152.8, h: 157.83, l: 152.16, c: 157.46 },
            { o: 157.46, h: 162.32, l: 156.6, c: 161.7 },
            { o: 161.7, h: 166.74, l: 161.25, c: 166 },
            { o: 166, h: 171.13, l: 165.79, c: 171.05 },
            { o: 171.05, h: 175.04, l: 170.87, c: 175 },
            { o: 175, h: 175.29, l: 174.85, c: 175.2 },
            { o: 175.2, h: 175.25, l: 169.77, c: 169.99 },
            { o: 169.99, h: 170.12, l: 165.85, c: 166 },
            { o: 166, h: 170.87, l: 165.84, c: 170.72 },
            { o: 170.72, h: 174.46, l: 170.39, c: 174.25 },
            { o: 174.25, h: 175.07, l: 173.75, c: 173.85 },
            { o: 173.85, h: 174.13, l: 169.09, c: 169.71 },
            { o: 169.71, h: 169.82, l: 167.33, c: 167.56 },
            { o: 167.56, h: 168.22, l: 163.49, c: 163.84 },
            { o: 163.84, h: 164.43, l: 159.86, c: 160.1 },
            { o: 160.1, h: 160.52, l: 155.54, c: 156 }
          ],
          zones: [
            {
              from: 10,
              top: 175.29,
              bottom: 174.85,
              kind: "supply",
              label: "New strong supply (always fresh)"
            }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: {
          side: "sell",
          sl: 175.32
        },
        explain: "A new zone is always fresh, and this one is strong. Short the first return with the stop a few cents above (175.32). Like Baker's AMZN trade, price dropped."
      },
      {
        prompt: "Price crept up slowly into this zone, then left fast. Now it is back. Short it against the trend?",
        scene: {
          candles: [
            { o: 150, h: 153.56, l: 149.58, c: 152.39 },
            { o: 152.39, h: 154.91, l: 152.16, c: 154.38 },
            { o: 154.38, h: 156.64, l: 154.04, c: 156.25 },
            { o: 156.25, h: 159.38, l: 155.29, c: 158.58 },
            { o: 158.58, h: 161.08, l: 158.09, c: 160.41 },
            { o: 160.41, h: 163.08, l: 159.64, c: 162.77 },
            { o: 162.77, h: 166.5, l: 162.47, c: 165.26 },
            { o: 165.26, h: 167.21, l: 164.58, c: 166.75 },
            { o: 166.75, h: 169.13, l: 166.07, c: 169 },
            { o: 169, h: 169.13, l: 168.79, c: 168.92 },
            { o: 168.92, h: 168.97, l: 164.72, c: 164.86 },
            { o: 164.86, h: 164.93, l: 161.89, c: 162 },
            { o: 162, h: 164.47, l: 161.79, c: 164.19 },
            { o: 164.19, h: 165.95, l: 164.03, c: 165.87 },
            { o: 165.87, h: 168.4, l: 165.64, c: 168.29 },
            { o: 168.29, h: 169.09, l: 167.99, c: 168.39 },
            { o: 168.39, h: 170.65, l: 168.21, c: 170.44 },
            { o: 170.44, h: 172.04, l: 170.37, c: 171.93 },
            { o: 171.93, h: 173.49, l: 171.87, c: 173.39 },
            { o: 173.39, h: 175.4, l: 173.31, c: 175.13 }
          ],
          zones: [
            {
              from: 9,
              top: 169.13,
              bottom: 168.79,
              kind: "supply",
              label: "Supply (price crept in slowly)"
            }
          ],
          reveal: 15
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Slow in means a weaker zone (Baker's BWLD example). Against a trending stock only strong zones qualify. Price went straight through."
      }
    ],
    cards: [
      {
        front: "Gap through a zone: entry?",
        back: "Wait for the opening pullback, enter when price resumes the gap direction."
      },
      {
        front: "Gap through a zone: stop?",
        back: "A few cents beyond the low (long) or high (short) of the day. The only non-zone stop."
      },
      {
        front: "Why the opening pullback?",
        back: "Many limit orders trigger at the open and push price back temporarily."
      },
      {
        front: "Zone failed on the daily?",
        back: "It can still give a day trade; manage it strictly as a day trade."
      },
      {
        front: "At an all-time high?",
        back: "No zone overhead: wait for a strong new zone and trade its first return."
      },
      {
        front: "Why is a new zone at a high always fresh?",
        back: "Price has never been there before."
      },
      {
        front: "Against a trending stock, which zones?",
        back: "Strong ones only: fast in and fast out."
      }
    ],
    mnemonic: "Gap: pause, then go; stop under the day's low. New high: no zone, no go."
  },
  {
    mentor: "baker",
    n: 10,
    eli5: {
      oneLiner: "First ask how much you can lose. Then make sure the prize is worth it.",
      story: "Before you climb a tree, you check how far you could fall. A smart climber never climbs so high that one slip breaks a leg. Baker's poker friend went broke many times until he made one rule: never risk more than one small slice of his money in one game. In trading, you decide your small slice first, and only play when the prize is at least three times bigger than the slice.",
      analogy: "Risk management is a seatbelt: it does not stop the crash, it makes sure you walk away from it."
    },
    bigIdeas: [
      "Plan the worst case first. Risk a fixed small percentage per trade (Baker: 1% or less).",
      "Risk is not position size. Size comes from the risk.",
      "Reward-to-risk to the FIRST exit must be at least 3:1, and the stop goes in with the entry."
    ],
    steps: [
      {
        title: "Worst case first",
        narration: "Ask \"how much can I lose?\" before \"how much can I make?\". A smart business only takes risks that cannot put it out of business after several mistakes in a row. With zones, the stop goes a few cents below demand.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 141.99,
              text: "First question: how much can I lose?"
            }
          ]
        }
      },
      {
        title: "Risk per share",
        narration: "Risk per share is the distance from entry to the stop. This is what you lose if the trade goes against you.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 141.99,
              text: "Risk per share = 143.92 - 143.49 = 0.43"
            }
          ]
        }
      },
      {
        title: "A fixed percentage, not position size",
        narration: "Most traders risk 0.5% to 2% of the account per trade. Baker prefers no more than 1%. On $30,000 that is $300. You might buy $10,000 or $30,000 of stock and still only risk $300. Risk is not position size.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 141.99,
              text: "1% of $30,000 = $300 at risk, whatever the position size"
            }
          ]
        }
      },
      {
        title: "Reward-to-risk to exit 1",
        narration: "Reward-to-risk is the profit at the first exit divided by the risk. Baker wants at least 3:1, with at least a 75% chance of success. Zone trades can reach 10:1 or even 20:1.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            },
            {
              y: 153.16,
              label: "Exit 1 (used for the ratio)",
              kind: "tp",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 154.35999999999999,
              text: "Reward to exit 1 / risk = 21.5:1"
            }
          ]
        }
      },
      {
        title: "Three exits",
        narration: "Baker usually plans three exits. Only the first is used to calculate the reward. If closing at exit 1 does not meet the minimum ratio, he skips the trade.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            },
            {
              y: 153.16,
              label: "Exit 1 (used for the ratio)",
              kind: "tp",
              from: 17
            },
            {
              y: 156.16,
              label: "Exit 2",
              kind: "tp",
              from: 17
            },
            {
              y: 159.16,
              label: "Exit 3",
              kind: "tp",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 154.35999999999999,
              text: "Reward to exit 1 / risk = 21.5:1"
            }
          ]
        }
      },
      {
        title: "Stop order with the entry; no hoping",
        narration: "Enter the stop order together with the entry. A dropped internet connection can turn a small loss into a big one, especially in leveraged markets like E-mini futures or forex. And when a trade hits the stop, cut it. Hoping is how traders exit right before the turn.",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            },
            {
              y: 153.16,
              label: "Exit 1 (used for the ratio)",
              kind: "tp",
              from: 17
            },
            {
              y: 156.16,
              label: "Exit 2",
              kind: "tp",
              from: 17
            },
            {
              y: 159.16,
              label: "Exit 3",
              kind: "tp",
              from: 17
            }
          ],
          notes: [
            {
              x: 17,
              y: 141.99,
              text: "Stop order goes in WITH the entry"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "You have $30,000 and risk 1%. How much can you lose on one trade?",
        options: [
          "$300",
          "$3,000",
          "$30",
          "$1,000"
        ],
        answer: 0,
        explain: "1% of $30,000 = $300, no matter how many shares you buy."
      },
      {
        type: "tf",
        q: "Risk and position size are the same thing.",
        answer: false,
        explain: "You can hold $10,000 or $30,000 of stock and still risk only $300. Risk is what you lose if the stop is hit."
      },
      {
        type: "mcq",
        q: "Which exit does Baker use to calculate reward-to-risk?",
        options: [
          "The first exit",
          "The most optimistic exit",
          "The average of all exits",
          "Whatever the price reaches"
        ],
        answer: 0,
        explain: "Measuring to the best-case target is a mistake. Exit 1 must meet the minimum ratio, or no trade."
      },
      {
        type: "mcq",
        q: "If 50% of your trades win, which ratio is profitable?",
        options: [
          "Anything above 1:1",
          "Only 10:1",
          "Only below 1:1",
          "None"
        ],
        answer: 0,
        explain: "The acceptable ratio depends on win rate. Baker himself wants at least 3:1 with at least 75% odds."
      },
      {
        type: "spot",
        q: "Price broke the zone. Click the candle where the stop is hit and the loss is cut.",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 155.62, c: 156.13 },
            { o: 156.13, h: 156.33, l: 152.04, c: 152.34 },
            { o: 152.34, h: 152.8, l: 147.3, c: 147.6 },
            { o: 147.6, h: 147.77, l: 142.79, c: 143 },
            { o: 143, h: 143.15, l: 141.69, c: 142.46 },
            { o: 142.46, h: 144.25, l: 141.77, c: 143.25 },
            { o: 143.25, h: 146.33, l: 143.11, c: 146.26 },
            { o: 146.26, h: 150.41, l: 146.17, c: 150.25 },
            { o: 150.25, h: 150.3, l: 150.14, c: 150.24 },
            { o: 150.24, h: 150.51, l: 149.9, c: 150.16 },
            { o: 150.16, h: 150.27, l: 147.9, c: 148.04 },
            { o: 148.04, h: 148.13, l: 146.79, c: 146.86 },
            { o: 146.86, h: 147.04, l: 144.73, c: 144.85 },
            { o: 144.85, h: 145.15, l: 143.75, c: 145.05 },
            { o: 145.05, h: 147.4, l: 144.93, c: 147.3 },
            { o: 147.3, h: 149.88, l: 147.07, c: 149.7 },
            { o: 149.7, h: 150.16, l: 145.39, c: 145.98 },
            { o: 145.98, h: 146.1, l: 142.98, c: 143.27 },
            { o: 143.27, h: 143.53, l: 141.08, c: 141.34 },
            { o: 141.34, h: 141.92, l: 137.42, c: 137.69 }
          ],
          zones: [
            {
              from: 4,
              top: 144.25,
              bottom: 141.69,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 141.66,
              label: "Stop",
              kind: "sl",
              from: 13
            }
          ]
        },
        answer: {
          from: 18,
          to: 18
        },
        explain: "If price breaks the zone the trade is wrong. Take the small, planned loss. No hoping."
      },
      {
        type: "order",
        q: "Order Baker's risk steps.",
        items: [
          "Ask how much you can lose",
          "Put the stop a few cents beyond the zone",
          "Check reward to exit 1 is at least 3:1",
          "Size the position from 1% risk",
          "Enter the stop order with the entry"
        ],
        explain: "Risk first, then reward, then size, then execution with the stop in place."
      },
      {
        type: "tf",
        q: "\"Nobody can get high and make money at the same time.\"",
        answer: true,
        explain: "Trading highs and lows are the enemy. Treat each trade like surgery: serious, sober, no shortcuts."
      }
    ],
    practice: [
      {
        prompt: "Fresh demand, entry 144.05, stop 141.66. Exit 1 sits one cent under the supply overhead at 149.89. Buy or skip?",
        scene: {
          candles: [
            { o: 160, h: 160.43, l: 155.62, c: 156.13 },
            { o: 156.13, h: 156.33, l: 152.04, c: 152.34 },
            { o: 152.34, h: 152.8, l: 147.3, c: 147.6 },
            { o: 147.6, h: 147.77, l: 142.79, c: 143 },
            { o: 143, h: 143.15, l: 141.69, c: 142.46 },
            { o: 142.46, h: 144.25, l: 141.77, c: 143.25 },
            { o: 143.25, h: 146.33, l: 143.11, c: 146.26 },
            { o: 146.26, h: 150.41, l: 146.17, c: 150.25 },
            { o: 150.25, h: 150.3, l: 150.14, c: 150.24 },
            { o: 150.24, h: 150.51, l: 149.9, c: 150.16 },
            { o: 150.16, h: 150.27, l: 147.9, c: 148.04 },
            { o: 148.04, h: 148.13, l: 146.79, c: 146.86 },
            { o: 146.86, h: 147.04, l: 144.73, c: 144.85 },
            { o: 144.85, h: 145.15, l: 143.75, c: 145.05 },
            { o: 145.05, h: 147.4, l: 144.93, c: 147.3 },
            { o: 147.3, h: 149.88, l: 147.07, c: 149.7 },
            { o: 149.7, h: 150.16, l: 145.39, c: 145.98 },
            { o: 145.98, h: 146.1, l: 142.98, c: 143.27 },
            { o: 143.27, h: 143.53, l: 141.08, c: 141.34 },
            { o: 141.34, h: 141.92, l: 137.42, c: 137.69 }
          ],
          zones: [
            {
              from: 4,
              top: 144.25,
              bottom: 141.69,
              kind: "demand"
            },
            {
              from: 8,
              top: 150.51,
              bottom: 149.9,
              kind: "supply",
              label: "Supply overhead"
            }
          ],
          lines: [
            {
              y: 149.89,
              label: "Exit 1",
              kind: "tp",
              from: 13
            }
          ],
          reveal: 13
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Reward to exit 1 is only 2.4:1, below Baker's 3:1 minimum. Skip it. Price stalled at the supply overhead and then broke the zone."
      },
      {
        prompt: "Fresh demand, entry 143.92, stop 143.49, exit 1 at 153.16. Buy or skip?",
        scene: {
          candles: [
            { o: 166, h: 166.23, l: 161.78, c: 162.13 },
            { o: 162.13, h: 162.46, l: 157.67, c: 158.18 },
            { o: 158.18, h: 159.13, l: 151.94, c: 152.16 },
            { o: 152.16, h: 152.41, l: 148.28, c: 148.87 },
            { o: 148.87, h: 149.6, l: 143.52, c: 144 },
            { o: 144, h: 144.12, l: 143.52, c: 143.91 },
            { o: 143.91, h: 144.01, l: 143.57, c: 143.87 },
            { o: 143.87, h: 146.47, l: 143.81, c: 146.37 },
            { o: 146.37, h: 149.05, l: 146.29, c: 148.98 },
            { o: 148.98, h: 150.92, l: 148.94, c: 150.87 },
            { o: 150.87, h: 151.55, l: 150.7, c: 151.39 },
            { o: 151.39, h: 151.92, l: 151.26, c: 151.84 },
            { o: 151.84, h: 152.55, l: 151.68, c: 152.46 },
            { o: 152.46, h: 152.94, l: 152.37, c: 152.87 },
            { o: 152.87, h: 153.17, l: 150.11, c: 150.24 },
            { o: 150.24, h: 150.37, l: 146.98, c: 147.24 },
            { o: 147.24, h: 147.44, l: 144.97, c: 145.22 },
            { o: 145.22, h: 145.72, l: 143.82, c: 145.67 },
            { o: 145.67, h: 147.36, l: 145.36, c: 147.24 },
            { o: 147.24, h: 149.36, l: 146.92, c: 149.22 },
            { o: 149.22, h: 151.83, l: 148.78, c: 151.46 },
            { o: 151.46, h: 153.5, l: 151.11, c: 153.34 },
            { o: 153.34, h: 155.75, l: 153.02, c: 155.46 },
            { o: 155.46, h: 158.12, l: 155.04, c: 157.67 }
          ],
          zones: [
            {
              from: 5,
              top: 144.12,
              bottom: 143.52,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 143.92,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 143.49,
              label: "Stop (decided first)",
              kind: "sl",
              from: 17
            },
            {
              y: 153.16,
              label: "Exit 1",
              kind: "tp",
              from: 17
            }
          ],
          reveal: 17
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          entry: 143.92,
          sl: 143.49,
          tp: 153.16
        },
        explain: "Risk 0.43 per share, reward to exit 1 9.24: about 21:1, far above 3:1. Take it with the stop order in. Price reached exit 1."
      }
    ],
    cards: [
      {
        front: "Baker's max risk per trade?",
        back: "1% of the account (most traders: 0.5% to 2%)."
      },
      {
        front: "Is risk the same as position size?",
        back: "No. Risk is what you lose at the stop; size follows from it."
      },
      {
        front: "Baker's minimum reward-to-risk?",
        back: "At least 3:1, with at least a 75% chance of success."
      },
      {
        front: "Reward is measured to?",
        back: "The first exit."
      },
      {
        front: "How many exits does Baker plan?",
        back: "Usually three."
      },
      {
        front: "When does the stop order go in?",
        back: "Together with the entry."
      },
      {
        front: "Worst habit of emotional traders?",
        back: "Taking profits quickly and letting losses run while hoping."
      }
    ],
    mnemonic: "LOSE first, 1% slice, 3 times the prize, stop goes in with the buy."
  },
  {
    mentor: "baker",
    n: 11,
    eli5: {
      oneLiner: "The zone tells you where the stop goes, how many shares, and where to sell.",
      story: "Imagine a fence around your garden. You know exactly where the fence is, so you know exactly where trouble starts. If you are allowed to lose only 3 apples, and each step past the fence costs you 1 apple, you know how far you can go. Zones are fences: the stop sits just outside the fence, and the next fences up the hill are where you take your profit.",
      analogy: "Stops and targets are like bus stops on a map: you know before you board where you get off, both if things go well and if they go badly."
    },
    bigIdeas: [
      "Stop: one to three cents beyond the zone, decided before entry.",
      "Shares = account risk in dollars / risk per share (include fill, commission, spread).",
      "Exits: one cent before each obstacle. Reward to exit 1 must be at least 3:1."
    ],
    steps: [
      {
        title: "The setup",
        narration: "Realty Income fell steeply for two weeks into a demand zone at 43.15-43.61. That is a long setup.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            }
          ],
          highlight: {
            from: 27,
            to: 31,
            label: "steep decline"
          },
          notes: [
            {
              x: 27,
              y: 43,
              text: "Two weeks of steep decline into demand"
            }
          ]
        }
      },
      {
        title: "Stop first",
        narration: "The zone bottom is 43.15, so the stop goes at 43.12. Decided before anything else. No guesswork, no 10-day lows, no ATR.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            }
          ],
          notes: [
            {
              x: 27,
              y: 43,
              text: "Two weeks of steep decline into demand"
            }
          ],
          lines: [
            {
              y: 43.12,
              label: "Stop 43.12 (decided FIRST)",
              kind: "sl",
              from: 3
            }
          ]
        }
      },
      {
        title: "Three exits, one cent before each obstacle",
        narration: "Exit 1: five days earlier a bullish candle left a long lower wick at 45.84. That temporary demand is now potential supply, so exit 1 = 45.83. Exit 2: one cent under the supply zone at 49.39 = 49.38. Exit 3: one cent under the top supply at 54.86 = 54.85.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            },
            {
              from: 20,
              top: 50.54,
              bottom: 49.39,
              kind: "supply",
              label: "Supply 49.39-50.54"
            },
            {
              from: 13,
              top: 55.5,
              bottom: 54.7,
              kind: "supply",
              label: "Top supply 54.86-55.50"
            }
          ],
          notes: [
            {
              x: 27,
              y: 43,
              text: "Two weeks of steep decline into demand"
            }
          ],
          lines: [
            {
              y: 43.12,
              label: "Stop 43.12 (decided FIRST)",
              kind: "sl",
              from: 3
            },
            {
              y: 45.83,
              label: "Exit 1: 45.83 (1 cent under the 45.84 wick)",
              kind: "tp",
              from: 25
            },
            {
              y: 49.38,
              label: "Exit 2: 49.38",
              kind: "tp",
              from: 20
            },
            {
              y: 54.85,
              label: "Exit 3: 54.85",
              kind: "tp",
              from: 13
            }
          ],
          highlight: {
            from: 25,
            to: 25,
            label: "wick"
          }
        }
      },
      {
        title: "Option A: buy inside the zone",
        narration: "Buy at the open around 43.25. The stop at 43.12 will likely fill at 43.11: 14 cents, plus two cents of commission = 16 cents of risk per share. 1% of $30,000 is $300, and $300 / 0.16 = 1,875 shares. Reward to exit 1 is 2.58, about 16:1.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            },
            {
              from: 20,
              top: 50.54,
              bottom: 49.39,
              kind: "supply",
              label: "Supply 49.39-50.54"
            },
            {
              from: 13,
              top: 55.5,
              bottom: 54.7,
              kind: "supply",
              label: "Top supply 54.86-55.50"
            }
          ],
          notes: [
            {
              x: 32,
              y: 42.6,
              text: "Risk 0.16 / share; $300 / 0.16 = 1,875 shares; 16:1"
            }
          ],
          lines: [
            {
              y: 43.12,
              label: "Stop 43.12 (decided FIRST)",
              kind: "sl",
              from: 3
            },
            {
              y: 45.83,
              label: "Exit 1: 45.83 (1 cent under the 45.84 wick)",
              kind: "tp",
              from: 25
            },
            {
              y: 49.38,
              label: "Exit 2: 49.38",
              kind: "tp",
              from: 20
            },
            {
              y: 54.85,
              label: "Exit 3: 54.85",
              kind: "tp",
              from: 13
            },
            {
              y: 43.25,
              label: "Entry 43.25",
              kind: "entry",
              from: 30
            }
          ],
          highlight: {
            from: 32,
            to: 32,
            label: "buy 43.25"
          }
        }
      },
      {
        title: "Why not an ATR stop?",
        narration: "With an ATR of 1.59, the stop would be 41.66 and risk $1.62 a share. $300 buys only 185 shares, and the ratio to exit 1 falls under 2:1. Worse, if price breaks the zone the trade is already wrong; there is no reason to sit and lose more.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            },
            {
              from: 20,
              top: 50.54,
              bottom: 49.39,
              kind: "supply",
              label: "Supply 49.39-50.54"
            },
            {
              from: 13,
              top: 55.5,
              bottom: 54.7,
              kind: "supply",
              label: "Top supply 54.86-55.50"
            }
          ],
          notes: [
            {
              x: 32,
              y: 41.4,
              text: "If the zone breaks, the trade is wrong anyway"
            }
          ],
          lines: [
            {
              y: 43.12,
              label: "Stop 43.12 (decided FIRST)",
              kind: "sl",
              from: 3
            },
            {
              y: 45.83,
              label: "Exit 1: 45.83 (1 cent under the 45.84 wick)",
              kind: "tp",
              from: 25
            },
            {
              y: 49.38,
              label: "Exit 2: 49.38",
              kind: "tp",
              from: 20
            },
            {
              y: 54.85,
              label: "Exit 3: 54.85",
              kind: "tp",
              from: 13
            },
            {
              y: 43.25,
              label: "Entry 43.25",
              kind: "entry",
              from: 30
            },
            {
              y: 41.66,
              label: "ATR stop 41.66: only 185 shares, under 2:1",
              kind: "level",
              from: 30
            }
          ]
        }
      },
      {
        title: "Option B: wait for the break back up",
        narration: "The careful way: buy only when price breaks back above the zone top, at about 43.63. Risk becomes 54 cents with costs, so 555 shares. Still acceptable, but the closer your entry to the bottom of demand, the higher the ratio and the more shares the same risk buys.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            },
            {
              from: 20,
              top: 50.54,
              bottom: 49.39,
              kind: "supply",
              label: "Supply 49.39-50.54"
            },
            {
              from: 13,
              top: 55.5,
              bottom: 54.7,
              kind: "supply",
              label: "Top supply 54.86-55.50"
            }
          ],
          notes: [
            {
              x: 32,
              y: 42.6,
              text: "Risk 0.54 -> 555 shares. Closer to the bottom = more shares"
            }
          ],
          lines: [
            {
              y: 43.12,
              label: "Stop 43.12 (decided FIRST)",
              kind: "sl",
              from: 3
            },
            {
              y: 45.83,
              label: "Exit 1: 45.83 (1 cent under the 45.84 wick)",
              kind: "tp",
              from: 25
            },
            {
              y: 49.38,
              label: "Exit 2: 49.38",
              kind: "tp",
              from: 20
            },
            {
              y: 54.85,
              label: "Exit 3: 54.85",
              kind: "tp",
              from: 13
            },
            {
              y: 43.63,
              label: "Option B: buy 43.63 on the break back above",
              kind: "entry",
              from: 30
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Risk per share is 16 cents and you risk $300. How many shares?",
        options: [
          "1,875",
          "300",
          "16,000",
          "185"
        ],
        answer: 0,
        explain: "$300 / $0.16 = 1,875 shares. 185 is what the ATR stop would allow."
      },
      {
        type: "spot",
        q: "Click the candle whose long lower wick sets exit 1.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            }
          ]
        },
        answer: {
          from: 25,
          to: 25
        },
        explain: "Its wick low at 45.84 was temporary demand; now it is potential supply. Exit 1 goes one cent under it at 45.83."
      },
      {
        type: "tf",
        q: "Baker prefers an ATR stop because it gives the trade more room.",
        answer: false,
        explain: "The ATR stop cut the size to 185 shares and the ratio below 2:1. If the zone breaks, the trade is wrong anyway."
      },
      {
        type: "mcq",
        q: "An option is bid .45 / ask .50. What do you add to your risk per share?",
        options: [
          "5 cents",
          "Nothing",
          "50 cents",
          "95 cents"
        ],
        answer: 0,
        explain: "You buy at the ask and sell at the bid, so the spread is part of your risk."
      },
      {
        type: "mcq",
        q: "Where does exit 2 go if the next supply zone starts at 49.39?",
        options: [
          "49.38",
          "49.39",
          "49.50",
          "50.54"
        ],
        answer: 0,
        explain: "One cent before each obstacle, so you get filled before the sellers show up."
      },
      {
        type: "order",
        q: "Order how Baker builds the trade.",
        items: [
          "Find the zone",
          "Set the stop a few cents beyond it",
          "Mark three exits, one cent before each obstacle",
          "Compute risk per share with fill and commission",
          "Shares = $ risk / risk per share; check exit 1 is at least 3:1"
        ],
        explain: "Stop first, then targets, then size. Sizing first and finding the stop afterwards is a mistake."
      },
      {
        type: "tf",
        q: "When trading in-the-money options, the stop is still based on the stock price.",
        answer: true,
        explain: "If the stock hits 43.12, sell the option and take the loss. Automatic option stops become market orders with poor fills on wide spreads."
      }
    ],
    practice: [
      {
        prompt: "Realty Income is in demand 43.15-43.61. You buy at the open. Pick entry, stop and exit 1.",
        scene: {
          candles: [
            { o: 46.6, h: 46.69, l: 45.28, c: 45.37 },
            { o: 45.37, h: 45.39, l: 44.42, c: 44.5 },
            { o: 44.5, h: 44.54, l: 43.48, c: 43.5 },
            { o: 43.5, h: 43.61, l: 43.15, c: 43.3 },
            { o: 43.3, h: 43.58, l: 43.2, c: 43.52 },
            { o: 43.52, h: 45.24, l: 43.45, c: 45.18 },
            { o: 45.18, h: 46.86, l: 45.12, c: 46.79 },
            { o: 46.79, h: 48.94, l: 46.76, c: 48.91 },
            { o: 48.91, h: 50.26, l: 48.86, c: 50.2 },
            { o: 50.2, h: 51.57, l: 50.12, c: 51.49 },
            { o: 51.49, h: 52.45, l: 51.44, c: 52.41 },
            { o: 52.41, h: 53.91, l: 52.35, c: 53.85 },
            { o: 53.85, h: 54.78, l: 53.74, c: 54.7 },
            { o: 54.7, h: 55.5, l: 54.7, c: 55.1 },
            { o: 55.1, h: 55.42, l: 54.9, c: 55 },
            { o: 55, h: 55.07, l: 53.28, c: 53.36 },
            { o: 53.36, h: 53.4, l: 50.86, c: 50.89 },
            { o: 50.89, h: 50.93, l: 48.54, c: 48.6 },
            { o: 48.6, h: 49.18, l: 48.56, c: 49.14 },
            { o: 49.14, h: 49.62, l: 49.12, c: 49.6 },
            { o: 49.6, h: 50.54, l: 49.39, c: 50.1 },
            { o: 50.1, h: 50.3, l: 49.6, c: 49.75 },
            { o: 49.75, h: 49.76, l: 48.88, c: 48.9 },
            { o: 48.9, h: 48.91, l: 47.76, c: 47.77 },
            { o: 47.77, h: 47.78, l: 46.97, c: 47 },
            { o: 47, h: 47.5, l: 45.84, c: 47.3 },
            { o: 47.3, h: 47.4, l: 46.5, c: 46.6 },
            { o: 46.6, h: 46.66, l: 45.97, c: 45.99 },
            { o: 45.99, h: 46.02, l: 45.38, c: 45.41 },
            { o: 45.41, h: 45.46, l: 44.89, c: 44.92 },
            { o: 44.92, h: 44.97, l: 44.2, c: 44.27 },
            { o: 44.27, h: 44.31, l: 43.84, c: 43.85 },
            { o: 43.25, h: 43.95, l: 43.18, c: 43.88 },
            { o: 43.88, h: 44.59, l: 43.86, c: 44.53 },
            { o: 44.53, h: 45.32, l: 44.48, c: 45.3 },
            { o: 45.3, h: 45.98, l: 45.23, c: 45.95 },
            { o: 45.95, h: 45.98, l: 45.48, c: 45.5 },
            { o: 45.5, h: 45.51, l: 45.06, c: 45.1 },
            { o: 45.1, h: 46.44, l: 45.01, c: 46.35 },
            { o: 46.35, h: 47.53, l: 46.29, c: 47.51 },
            { o: 47.51, h: 48.32, l: 47.46, c: 48.27 },
            { o: 48.27, h: 49.48, l: 48.2, c: 49.45 },
            { o: 49.45, h: 49.48, l: 48.94, c: 48.97 },
            { o: 48.97, h: 48.98, l: 48.46, c: 48.5 }
          ],
          zones: [
            {
              from: 3,
              top: 43.61,
              bottom: 43.15,
              kind: "demand",
              label: "Demand 43.15-43.61"
            },
            {
              from: 20,
              top: 50.54,
              bottom: 49.39,
              kind: "supply",
              label: "Supply 49.39-50.54"
            },
            {
              from: 13,
              top: 55.5,
              bottom: 54.7,
              kind: "supply",
              label: "Top supply 54.86-55.50"
            }
          ],
          reveal: 32
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 43.25,
          sl: 43.12,
          tp: 45.83
        },
        explain: "Entry 43.25, stop 43.12 (three cents under the zone), exit 1 at 45.83 (one cent under the 45.84 wick). Risk 0.16 with costs, 1,875 shares for $300, about 16:1."
      },
      {
        prompt: "Fresh demand below, supply above. Pick entry, stop and exit 1.",
        scene: {
          candles: [
            { o: 150, h: 153.43, l: 149.8, c: 153.26 },
            { o: 153.26, h: 155.56, l: 152.99, c: 155.48 },
            { o: 155.48, h: 158.29, l: 155.15, c: 158 },
            { o: 158, h: 158.35, l: 157.7, c: 158.14 },
            { o: 158.14, h: 158.27, l: 157.88, c: 158.07 },
            { o: 158.07, h: 158.22, l: 154.56, c: 154.72 },
            { o: 154.72, h: 154.77, l: 150, c: 150.07 },
            { o: 150.07, h: 150.15, l: 146.86, c: 147 },
            { o: 147, h: 147.16, l: 146.91, c: 147.01 },
            { o: 147.01, h: 147.3, l: 146.77, c: 147.1 },
            { o: 147.1, h: 151.37, l: 146.91, c: 151.22 },
            { o: 151.22, h: 154.11, l: 151.16, c: 154 },
            { o: 154, h: 154.08, l: 152.22, c: 152.33 },
            { o: 152.33, h: 152.47, l: 150.35, c: 150.54 },
            { o: 150.54, h: 150.82, l: 147.9, c: 148.2 },
            { o: 148.2, h: 148.5, l: 147, c: 148.45 },
            { o: 148.45, h: 150.43, l: 148.37, c: 150.36 },
            { o: 150.36, h: 153.26, l: 150.06, c: 153.17 },
            { o: 153.17, h: 155.08, l: 153.1, c: 154.91 },
            { o: 154.91, h: 158.08, l: 154.55, c: 157.8 },
            { o: 157.8, h: 157.85, l: 156.39, c: 156.54 },
            { o: 156.54, h: 156.57, l: 155.66, c: 155.7 }
          ],
          zones: [
            {
              from: 3,
              top: 158.35,
              bottom: 157.7,
              kind: "supply",
              label: "Next supply"
            },
            {
              from: 8,
              top: 147.3,
              bottom: 146.77,
              kind: "demand",
              label: "Fresh demand"
            }
          ],
          reveal: 15
        },
        task: "pick-entry",
        answer: {
          side: "buy",
          entry: 147.2,
          sl: 146.74,
          tp: 157.69
        },
        explain: "Enter near the zone (147.20), stop a few cents under it (146.74), exit 1 one cent under the next supply (157.69). Ratio about 23:1. Price reached the exit and stalled at supply."
      }
    ],
    cards: [
      {
        front: "Where does the stop go?",
        back: "One to three cents beyond the zone, decided before entry."
      },
      {
        front: "Risk per share includes?",
        back: "Entry minus expected stop fill, plus commissions, slippage and (for options) the spread."
      },
      {
        front: "Share count formula?",
        back: "Account risk in dollars / risk per share."
      },
      {
        front: "Where do exits go?",
        back: "One cent before each obstacle: a recent wick, the next zone, the major zone."
      },
      {
        front: "Realty Income stop and exit 1?",
        back: "Stop 43.12, exit 1 45.83."
      },
      {
        front: "Why no ATR stop?",
        back: "Tiny size, ratio under 2:1, and a broken zone means the trade is wrong anyway."
      },
      {
        front: "Entry inside the zone vs after the break back up?",
        back: "Inside: lower risk, more shares, higher ratio. Break: more confirmation, fewer shares."
      }
    ],
    mnemonic: "Fence, then bus stops, then count: stop first, exits second, shares last."
  },
  {
    mentor: "baker",
    n: 12,
    eli5: {
      oneLiner: "Write the rules down first, then only play by the written rules.",
      story: "Before a board game, everyone reads the rule card, so nobody argues in the middle of the game. A trading plan is your rule card. It says which games you play, when you play, what counts as a good move, how much you can lose, and when you stop. After each game you check: did I follow the card?",
      analogy: "A trading plan is a recipe. If you add random things while cooking, the cake fails; follow the recipe and it comes out the same every time."
    },
    bigIdeas: [
      "A written plan keeps you from mistakes, overtrading and impulsive decisions.",
      "Write exact setups, risk per trade, minimum reward-to-risk, stop moves, exits and hours.",
      "Review every trade against the plan."
    ],
    steps: [
      {
        title: "Instruments and symbols",
        narration: "Parts 1 and 2: which instruments (stocks, currencies, futures, options), and which exact symbols. Example filters: day trade stocks with ATR above 3% of price and at least 10 million shares a day; swing trade stocks with options open interest above 10,000. Write the names down.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 1,
              y: 139.77,
              text: "Plan part 1-2: is this instrument and symbol on my written list?"
            }
          ]
        }
      },
      {
        title: "Timeframe",
        narration: "Part 3: weekly for long-term investing, daily (maybe hourly) for swing trading, daily plus intraday for day trading. One section per timeframe if you use several.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 1,
              y: 139.77,
              text: "Part 3: swing trading uses the daily chart"
            }
          ]
        }
      },
      {
        title: "Exact setups",
        narration: "Part 4: write the exact conditions that must be met before you can enter. For example: swing trades only with the trend, with a reversal candle on a pullback into a zone.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 17,
              y: 139.77,
              text: "Part 4: exact setup, e.g. with-trend rejection candle in a zone"
            }
          ],
          highlight: {
            from: 17,
            to: 17,
            label: "setup"
          }
        }
      },
      {
        title: "Risk and minimum ratio",
        narration: "Part 5: decide the risk per trade in advance so the size follows. Part 6: the minimum reward-to-risk at exit 1, for example at least 3:1 for day trades and maybe 5:1 for swing trades. The higher your win rate, the lower it can be.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 17,
              y: 139.77,
              text: "Parts 5-6: risk per trade, minimum ratio (e.g. 3:1 day, 5:1 swing)"
            }
          ],
          lines: [
            {
              y: 143.85,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 141.74,
              label: "Stop (risk planned in advance)",
              kind: "sl",
              from: 17
            }
          ]
        }
      },
      {
        title: "Monitoring and exits",
        narration: "Part 7: how you watch the trade, for example move the stop at every new pivot. Part 8: exact exit conditions (a price, a trailing stop or a time of day), so you neither leave too early nor hold too long.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 22,
              y: 144.46,
              text: "Parts 7-8: how I monitor and exactly when I exit"
            }
          ],
          lines: [
            {
              y: 143.85,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 141.74,
              label: "Stop (risk planned in advance)",
              kind: "sl",
              from: 17
            },
            {
              y: 146.43,
              label: "Move stop at new pivot",
              kind: "sl",
              from: 22
            },
            {
              y: 150.03,
              label: "And again",
              kind: "sl",
              from: 26
            }
          ]
        }
      },
      {
        title: "Hours and evaluation",
        narration: "Part 9: trading times. Forex never closes, so set a schedule; a stock day trader might work four hours from the open. Part 10: a comment box or checklist on whether you followed the plan.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 26,
              y: 148.06,
              text: "Parts 9-10: trading hours, then: did I follow the plan?"
            }
          ],
          lines: [
            {
              y: 143.85,
              label: "Entry",
              kind: "entry",
              from: 17
            },
            {
              y: 141.74,
              label: "Stop (risk planned in advance)",
              kind: "sl",
              from: 17
            },
            {
              y: 146.43,
              label: "Move stop at new pivot",
              kind: "sl",
              from: 22
            },
            {
              y: 150.03,
              label: "And again",
              kind: "sl",
              from: 26
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order these parts of Baker's plan.",
        items: [
          "Instruments",
          "Specific symbols",
          "Timeframe",
          "Setups",
          "Risk per trade",
          "Minimum reward-to-risk",
          "Monitoring",
          "Exits",
          "Trading times",
          "Evaluation"
        ],
        explain: "Ten parts, from what you trade to how you check yourself afterwards."
      },
      {
        type: "mcq",
        q: "Which is an example symbol filter from the book for day trading stocks?",
        options: [
          "ATR above 3% of price and at least 10 million shares a day",
          "Any stock that moved today",
          "Only stocks above $100",
          "Stocks with the most indicators"
        ],
        answer: 0,
        explain: "Write filters and names down so not every moving chart becomes a \"setup\"."
      },
      {
        type: "tf",
        q: "Forex never closes, so you should trade it around the clock.",
        answer: false,
        explain: "Exactly because it never closes, the plan sets a schedule."
      },
      {
        type: "mcq",
        q: "Example minimum ratios in Baker's plan chapter?",
        options: [
          "3:1 day trading, maybe 5:1 swing trading",
          "1:1 for everything",
          "10:1 day, 20:1 swing",
          "No minimum"
        ],
        answer: 0,
        explain: "A vague minimum is a plan mistake. And the higher your win rate, the lower the minimum can be."
      },
      {
        type: "spot",
        q: "Your plan says \"move the stop at every new pivot\". Click the first new pivot low after entry.",
        scene: {
          candles: [
            { o: 160, h: 160.18, l: 156.22, c: 156.4 },
            { o: 156.4, h: 156.95, l: 153.34, c: 153.59 },
            { o: 153.59, h: 154.02, l: 147.86, c: 148.81 },
            { o: 148.81, h: 149.15, l: 144.65, c: 144.79 },
            { o: 144.79, h: 145.34, l: 141.77, c: 142 },
            { o: 142, h: 142.13, l: 141.77, c: 142.04 },
            { o: 142.04, h: 142.3, l: 141.93, c: 142 },
            { o: 142, h: 145.28, l: 141.91, c: 145.14 },
            { o: 145.14, h: 149.92, l: 145, c: 149.83 },
            { o: 149.83, h: 154.19, l: 149.62, c: 154 },
            { o: 154, h: 154.9, l: 153.85, c: 154.78 },
            { o: 154.78, h: 155.61, l: 154.72, c: 155.43 },
            { o: 155.43, h: 156.57, l: 155.13, c: 156.25 },
            { o: 156.25, h: 157.21, l: 155.97, c: 157 },
            { o: 157, h: 157.64, l: 151.04, c: 151.56 },
            { o: 151.56, h: 152.07, l: 146.39, c: 147.1 },
            { o: 147.1, h: 147.46, l: 142.79, c: 143.4 },
            { o: 143.4, h: 143.9, l: 142.04, c: 143.85 },
            { o: 143.85, h: 143.95, l: 143.76, c: 143.86 },
            { o: 143.86, h: 145.43, l: 143.75, c: 145.29 },
            { o: 145.29, h: 146.44, l: 145.25, c: 146.4 },
            { o: 146.4, h: 147.94, l: 146.19, c: 147.86 },
            { o: 147.86, h: 148.16, l: 146.46, c: 146.96 },
            { o: 146.96, h: 148.16, l: 146.85, c: 148.1 },
            { o: 148.1, h: 150.2, l: 148.01, c: 149.92 },
            { o: 149.92, h: 151.55, l: 149.81, c: 151.46 },
            { o: 151.46, h: 151.76, l: 150.06, c: 150.46 },
            { o: 150.46, h: 151.91, l: 150.36, c: 151.72 },
            { o: 151.72, h: 152.92, l: 151.6, c: 152.84 },
            { o: 152.84, h: 154.65, l: 152.77, c: 154.46 }
          ],
          zones: [
            {
              from: 5,
              top: 142.3,
              bottom: 141.77,
              kind: "demand"
            }
          ]
        },
        answer: {
          from: 22,
          to: 22
        },
        explain: "The first higher low after the rally starts. Move the stop just below it, as the plan says."
      },
      {
        type: "tf",
        q: "After each trade, you check whether you followed the plan.",
        answer: true,
        explain: "Part 10, evaluation: a comment box or a checklist ticked off while trading."
      }
    ],
    practice: [
      {
        prompt: "Your written swing plan needs at least 5:1. Entry 144.47, stop 143.71, exit 1 under the next supply at 147.68. Take it?",
        scene: {
          candles: [
            { o: 160, h: 160.44, l: 155.44, c: 155.88 },
            { o: 155.88, h: 156.28, l: 152.61, c: 152.78 },
            { o: 152.78, h: 153, l: 148.22, c: 148.48 },
            { o: 148.48, h: 148.98, l: 143.77, c: 144 },
            { o: 144, h: 144.2, l: 143.76, c: 143.88 },
            { o: 143.88, h: 144.57, l: 143.74, c: 144.21 },
            { o: 144.21, h: 145.47, l: 144.18, c: 145.42 },
            { o: 145.42, h: 146.49, l: 145.38, c: 146.46 },
            { o: 146.46, h: 147.97, l: 146.44, c: 147.92 },
            { o: 147.92, h: 148, l: 147.69, c: 147.84 },
            { o: 147.84, h: 148.32, l: 147.75, c: 148.03 },
            { o: 148.03, h: 148.11, l: 147.17, c: 147.24 },
            { o: 147.24, h: 147.29, l: 146.02, c: 146.11 },
            { o: 146.11, h: 146.18, l: 145.08, c: 145.17 },
            { o: 145.17, h: 145.47, l: 144.22, c: 145.42 },
            { o: 145.42, h: 145.65, l: 145.4, c: 145.61 },
            { o: 145.61, h: 145.96, l: 145.59, c: 145.93 },
            { o: 145.93, h: 146.18, l: 145.89, c: 146.17 },
            { o: 146.17, h: 146.31, l: 144.33, c: 144.48 },
            { o: 144.48, h: 144.55, l: 143.5, c: 143.55 },
            { o: 143.55, h: 143.58, l: 142.3, c: 142.42 },
            { o: 142.42, h: 142.56, l: 140.59, c: 140.74 }
          ],
          zones: [
            {
              from: 4,
              top: 144.57,
              bottom: 143.74,
              kind: "demand"
            },
            {
              from: 9,
              top: 148.32,
              bottom: 147.69,
              kind: "supply",
              label: "Next supply"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "The ratio is only about 4.2:1, under your written 5:1. The plan says skip, no debate. Price stalled under supply and fell back through the zone."
      },
      {
        prompt: "Your day-trade plan needs at least 3:1. Entry 144.28, stop 143.53, exit 1 at 148.94. Take it?",
        scene: {
          candles: [
            { o: 160, h: 160.28, l: 155.48, c: 155.75 },
            { o: 155.75, h: 156.14, l: 152.54, c: 152.68 },
            { o: 152.68, h: 152.91, l: 146.86, c: 147.38 },
            { o: 147.38, h: 147.69, l: 143.84, c: 144 },
            { o: 144, h: 144.38, l: 143.56, c: 144.01 },
            { o: 144.01, h: 144.25, l: 143.83, c: 143.91 },
            { o: 143.91, h: 145.61, l: 143.85, c: 145.6 },
            { o: 145.6, h: 147.26, l: 145.54, c: 147.18 },
            { o: 147.18, h: 149.26, l: 147.09, c: 149.19 },
            { o: 149.19, h: 149.48, l: 148.95, c: 149.33 },
            { o: 149.33, h: 149.55, l: 149.04, c: 149.09 },
            { o: 149.09, h: 149.14, l: 147.97, c: 148.06 },
            { o: 148.06, h: 148.17, l: 146.19, c: 146.31 },
            { o: 146.31, h: 146.4, l: 144.85, c: 144.98 },
            { o: 144.98, h: 145.28, l: 144.03, c: 145.23 },
            { o: 145.23, h: 145.88, l: 145.21, c: 145.85 },
            { o: 145.85, h: 146.74, l: 145.79, c: 146.71 },
            { o: 146.71, h: 147.67, l: 146.62, c: 147.59 },
            { o: 147.59, h: 148.18, l: 147.57, c: 148.15 },
            { o: 148.15, h: 149.11, l: 148.12, c: 149.05 }
          ],
          zones: [
            {
              from: 4,
              top: 144.38,
              bottom: 143.56,
              kind: "demand"
            },
            {
              from: 9,
              top: 149.55,
              bottom: 148.95,
              kind: "supply",
              label: "Next supply"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          entry: 144.28,
          sl: 143.53,
          tp: 148.94
        },
        explain: "About 6.2:1, above your 3:1 minimum, and it is a written setup. Take it and follow the plan's exit. Price reached exit 1."
      }
    ],
    cards: [
      {
        front: "Why write a plan?",
        back: "It prevents mistakes, overtrading and impulsive decisions."
      },
      {
        front: "Plan part 4: setups?",
        back: "Write the exact conditions that must be met before entering."
      },
      {
        front: "Example minimum ratios?",
        back: "At least 3:1 for day trading, maybe 5:1 for swing trading."
      },
      {
        front: "Plan part 7: monitoring example?",
        back: "Move the stop at every new pivot, or to a small profit after a set move."
      },
      {
        front: "Plan part 8: exits?",
        back: "Exact conditions: a price, a trailing stop, or a time of day."
      },
      {
        front: "Plan part 9: trading times?",
        back: "A fixed schedule (forex never closes)."
      },
      {
        front: "Plan part 10?",
        back: "Evaluation: did I follow the plan?"
      }
    ],
    mnemonic: "What, which, when, how, how much, how good, watch, leave, hours, check."
  },
  {
    mentor: "baker",
    n: 13,
    eli5: {
      oneLiner: "An option lets you lose only a small, known amount, even overnight.",
      story: "You want to rent a house next month. You pay a small deposit to hold the price. If you change your mind, you lose only the deposit. That is a call. A put is like car insurance: you pay a little each year, and if the car gets smashed, you are covered. At night, when you are asleep, a stock can jump far past your stop, but a deposit or insurance never costs more than you paid.",
      analogy: "A call is a deposit that holds a price; a put is insurance against a falling price."
    },
    bigIdeas: [
      "An option is a right, not an obligation, usually for 100 shares, until a set date.",
      "Price = intrinsic value + time value. Only in-the-money options have intrinsic value.",
      "For overnight holds, a call (or stock plus a put) caps the loss; a stop cannot stop a gap."
    ],
    steps: [
      {
        title: "What an option is",
        narration: "An option gives the buyer the right, not the obligation, to buy or sell an asset at a set price on or before a set date. One listed option covers 100 shares. Unlike stock, it expires and has no voting or dividend rights.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 8.27,
              label: "Alcoa 8.27",
              kind: "level",
              from: 5
            }
          ],
          notes: [
            {
              x: 8,
              y: 8.5,
              text: "Option = the RIGHT, not the duty, for 100 shares"
            }
          ]
        }
      },
      {
        title: "Calls and puts",
        narration: "A call is the right to buy at the strike, like a security deposit on a rental. A put is the right to sell at the strike, like car insurance. If you never use them, you lose only the premium.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 8.27,
              label: "Alcoa 8.27",
              kind: "level",
              from: 5
            },
            {
              y: 8,
              label: "Strike 8",
              kind: "level",
              from: 5
            }
          ],
          notes: [
            {
              x: 8,
              y: 8.5,
              text: "Call = security deposit. Put = car insurance."
            }
          ]
        }
      },
      {
        title: "What the price is made of",
        narration: "Alcoa is 8.27 and the $8 call costs 34 cents: $34 for one contract. Intrinsic value is stock minus strike: 27 cents. The other 7 cents is time value, which grows with volatility and time left and melts as expiry gets close.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 8.27,
              label: "Alcoa 8.27",
              kind: "level",
              from: 5
            },
            {
              y: 8,
              label: "Strike 8",
              kind: "level",
              from: 5
            }
          ],
          notes: [
            {
              x: 8,
              y: 8.5,
              text: "Call 0.34 = 0.27 intrinsic (8.27 - 8) + 0.07 time value"
            }
          ]
        }
      },
      {
        title: "In, at and out of the money",
        narration: "A call is in the money when its strike is below the price; a put when its strike is above it. Only those have intrinsic value. At- and out-of-the-money options expire worthless. The $8 put costs 7 cents, all of it time value.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 8.27,
              label: "Alcoa 8.27",
              kind: "level",
              from: 5
            },
            {
              y: 8,
              label: "Strike 8",
              kind: "level",
              from: 5
            }
          ],
          notes: [
            {
              x: 8,
              y: 8.5,
              text: "$8 call: in the money (strike below price). $8 put: out of the money"
            }
          ]
        }
      },
      {
        title: "The gap problem",
        narration: "You own 100 shares with a stop at 7.50. Bad news comes overnight and the stock opens near 5. Your stop fills near 5, not 7.50. A stop order cannot protect you from a gap.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 7.5,
              label: "Stop 7.50",
              kind: "sl",
              from: 5
            }
          ],
          highlight: {
            from: 9,
            to: 9,
            label: "overnight gap"
          },
          notes: [
            {
              x: 9,
              y: 5.5,
              text: "Stop fills near 5, not 7.50"
            }
          ]
        }
      },
      {
        title: "Options cap the loss",
        narration: "One $8 call costs $34 and can never lose more than $34. Or own the stock and buy an $8 put for $7: below $8 the loss is capped at $27 on the stock plus $7 for the put = $34. If Alcoa hits $9, the call makes $66, only $7 less than the stock.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 7.5,
              label: "Stop 7.50",
              kind: "sl",
              from: 5
            }
          ],
          highlight: {
            from: 9,
            to: 9,
            label: "overnight gap"
          },
          notes: [
            {
              x: 9,
              y: 5.5,
              text: "Call: max loss $34. Stock + $8 put: $27 + $7 = $34"
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "mcq",
        q: "Alcoa is 8.27. What is the intrinsic value of the $8 call?",
        options: [
          "0.27",
          "0.34",
          "0.07",
          "8.00"
        ],
        answer: 0,
        explain: "Call intrinsic = stock minus strike = 8.27 - 8 = 0.27. The remaining 0.07 of the 0.34 premium is time value."
      },
      {
        type: "mcq",
        q: "A call is most like...",
        options: [
          "A security deposit on a rental",
          "Car insurance",
          "A loan",
          "A dividend"
        ],
        answer: 0,
        explain: "It secures the price. If you do not use it, you lose only the deposit. The put is the insurance."
      },
      {
        type: "tf",
        q: "Options are always riskier than stock.",
        answer: false,
        explain: "Baker: used properly, an option is always less risky than holding the same position in stock, especially overnight."
      },
      {
        type: "spot",
        q: "Click the candle where the stop at 7.50 failed to protect the stock.",
        scene: {
          candles: [
            { o: 8.45, h: 8.48, l: 8.22, c: 8.24 },
            { o: 8.24, h: 8.27, l: 7.9, c: 7.93 },
            { o: 7.93, h: 7.94, l: 7.65, c: 7.68 },
            { o: 7.68, h: 7.74, l: 7.53, c: 7.62 },
            { o: 7.62, h: 7.72, l: 7.55, c: 7.69 },
            { o: 7.69, h: 7.84, l: 7.67, c: 7.83 },
            { o: 7.83, h: 7.99, l: 7.82, c: 7.99 },
            { o: 7.99, h: 8.11, l: 7.97, c: 8.1 },
            { o: 8.1, h: 8.28, l: 8.09, c: 8.27 },
            { o: 5.1, h: 5.24, l: 4.92, c: 5.02 },
            { o: 5.02, h: 5.18, l: 4.95, c: 5.1 },
            { o: 5.1, h: 5.2, l: 5, c: 5.05 }
          ],
          zones: [
            {
              from: 3,
              top: 7.74,
              bottom: 7.53,
              kind: "demand",
              label: "Demand"
            }
          ],
          lines: [
            {
              y: 7.5,
              label: "Stop 7.50",
              kind: "sl",
              from: 5
            }
          ]
        },
        answer: {
          from: 9,
          to: 9
        },
        explain: "Price gapped overnight far below the stop, so the stop filled near 5. A call or a put would have capped the loss."
      },
      {
        type: "mcq",
        q: "An $8 call is quoted at 0.34. What does one contract cost?",
        options: [
          "$34 plus commission",
          "$0.34",
          "$3.40",
          "$340"
        ],
        answer: 0,
        explain: "Per-share price times 100 shares."
      },
      {
        type: "tf",
        q: "An out-of-the-money option has no intrinsic value and expires worthless if it stays there.",
        answer: true,
        explain: "Treat the whole premium of an out-of-the-money option as the risk."
      },
      {
        type: "order",
        q: "Order the stock-plus-put math if Alcoa falls below $8.",
        items: [
          "Own 100 shares at 8.27",
          "Buy one $8 put for $7",
          "Stock loss down to $8 is $27",
          "Put covers everything below $8",
          "Total max loss = $27 + $7 = $34"
        ],
        explain: "Same cap as simply buying the $34 call."
      }
    ],
    practice: [
      {
        prompt: "Strong, fresh demand on its first return. You expect to hold overnight. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 166, h: 166.4, l: 160.09, c: 160.4 },
            { o: 160.4, h: 161.76, l: 151.13, c: 152.28 },
            { o: 152.28, h: 153.27, l: 145.6, c: 146 },
            { o: 146, h: 146.26, l: 145.6, c: 146.16 },
            { o: 146.16, h: 146.47, l: 145.68, c: 146.18 },
            { o: 146.18, h: 153.71, l: 145.95, c: 153.42 },
            { o: 153.42, h: 160.26, l: 153.24, c: 160.18 },
            { o: 160.18, h: 161.25, l: 159.88, c: 160.97 },
            { o: 160.97, h: 162, l: 160.91, c: 161.74 },
            { o: 161.74, h: 162.78, l: 161.63, c: 162.51 },
            { o: 162.51, h: 163.42, l: 162.4, c: 163.18 },
            { o: 163.18, h: 163.78, l: 157.42, c: 158.03 },
            { o: 158.03, h: 158.87, l: 152.1, c: 152.38 },
            { o: 152.38, h: 152.78, l: 146.91, c: 147.57 },
            { o: 147.57, h: 148.07, l: 146.04, c: 148.02 },
            { o: 148.02, h: 150.21, l: 147.56, c: 150.05 },
            { o: 150.05, h: 152.92, l: 149.58, c: 152.76 },
            { o: 152.76, h: 154.79, l: 152.67, c: 154.68 },
            { o: 154.68, h: 158.6, l: 154.53, c: 158.15 },
            { o: 158.15, h: 160.13, l: 158.05, c: 160.02 }
          ],
          zones: [
            {
              from: 3,
              top: 146.47,
              bottom: 145.6,
              kind: "demand"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          sl: 145.57
        },
        explain: "It is a buy. Because you will hold overnight, Baker would rather use an in-the-money call (or stock plus a put) to cap gap risk. The stop stays on the stock: if it hits 145.57, sell the option. Price rallied."
      }
    ],
    cards: [
      {
        front: "What is an option?",
        back: "The right, not the obligation, to buy or sell at a set price on or before a set date; 100 shares per contract."
      },
      {
        front: "Call vs put?",
        back: "Call = right to buy (deposit). Put = right to sell (insurance)."
      },
      {
        front: "Option price = ?",
        back: "Intrinsic value + extrinsic (time) value."
      },
      {
        front: "When is a call in the money?",
        back: "When its strike is below the stock price."
      },
      {
        front: "Why can a stop fail overnight?",
        back: "A gap opens past the stop and it fills at the gap price."
      },
      {
        front: "Max loss on a $0.34 call?",
        back: "$34 (plus commission)."
      },
      {
        front: "Options and the stop?",
        back: "Keep the stop based on the stock price and its zone."
      },
      {
        front: "Add what to option risk?",
        back: "The bid/ask spread."
      }
    ],
    mnemonic: "Deposit to buy, insurance to sell; time value melts like ice."
  },
  {
    mentor: "baker",
    n: 14,
    eli5: {
      oneLiner: "Find it, box it, grade it, check the road, fence it, size it, review.",
      story: "Building a sandcastle has steps. Find good wet sand, draw the outline, check the sand is strong, make sure no wave is coming, build a wall, use only the bucket you can carry, and afterwards look at what worked. Baker's whole method is the same kind of routine, done the same way every time. It takes time to get good at it, and that is normal.",
      analogy: "The routine is a pilot's checklist: every flight, every step, no skipping because it \"looks fine\"."
    },
    bigIdeas: [
      "No zone, no trade. No fresh strong zone, no counter-trend trade.",
      "Stop beyond the zone, at least 3:1 to exit 1, 1% risk, no more than two or three positions.",
      "Journal every trade against the right rulebook (Baker, not Kevin or Seiden)."
    ],
    steps: [
      {
        title: "1. Find a fast move away",
        narration: "Start where price left a level fast: a pivot candle, a tight range, a mid-trend doji or a gap.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          highlight: {
            from: 5,
            to: 6,
            label: "fast move away"
          }
        }
      },
      {
        title: "2. Draw the zone",
        narration: "Box the full candle or candles the move started from, wick to wick. If a daily zone is too wide, refine it on the hourly but keep the distal line at the extreme.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          lines: [
            {
              y: 144.5,
              label: "Proximal (near line)",
              kind: "proximal",
              from: 3
            },
            {
              y: 143.41,
              label: "Distal (far line)",
              kind: "distal",
              from: 3
            }
          ],
          highlight: {
            from: 3,
            to: 4,
            label: "base"
          }
        }
      },
      {
        title: "3. Grade it",
        narration: "Did price leave fast? Did it arrive fast? Is it fresh (looked left up to five years)? Did price spend little time inside? Do not skip this because a zone \"looks obvious\".",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 0,
              y: 162.5,
              text: "Grade: fast in, fast out, fresh, brief"
            }
          ]
        }
      },
      {
        title: "4. Pick the style and timeframe",
        narration: "Weekly for investing, daily for swing trading, daily zones with 5-minute or hourly execution for day trades.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 7,
              y: 141.41,
              text: "Style: daily for swing, weekly invest, daily zone + 5-min for day trades"
            }
          ]
        }
      },
      {
        title: "5. Check the path",
        narration: "Do not buy into supply or sell into demand. If an opposing zone sits right in the way, wait for the break or skip.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 14,
              y: 164.5,
              text: "Path: no supply right overhead"
            }
          ]
        }
      },
      {
        title: "6-8. Stop, exits, ratio, size",
        narration: "Stop one to a few cents beyond the zone. Three exits, each one cent before an obstacle. Reward to exit 1 at least 3:1, or skip. Size = 1% of the account divided by risk per share, including fill, commission and spread.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 14,
              y: 141.88,
              text: "Ratio 20:1 >= 3:1. Size = 1% / risk per share"
            }
          ],
          lines: [
            {
              y: 144.35,
              label: "Entry",
              kind: "entry",
              from: 14
            },
            {
              y: 143.38,
              label: "Stop a few cents below",
              kind: "sl",
              from: 14
            },
            {
              y: 163.27,
              label: "Exit 1 (1 cent before the obstacle)",
              kind: "tp",
              from: 14
            }
          ]
        }
      },
      {
        title: "9. Manage and review",
        narration: "Trail the stop behind new pivots. After the trade, journal it: did I follow the plan? Proficiency takes time; keep plotting zones on many charts and study the first returns.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          notes: [
            {
              x: 17,
              y: 141.88,
              text: "Manage: trail behind new pivots. Then journal: did I follow the plan?"
            }
          ],
          lines: [
            {
              y: 144.35,
              label: "Entry",
              kind: "entry",
              from: 14
            },
            {
              y: 143.38,
              label: "Stop a few cents below",
              kind: "sl",
              from: 14
            },
            {
              y: 163.27,
              label: "Exit 1 (1 cent before the obstacle)",
              kind: "tp",
              from: 14
            }
          ]
        }
      }
    ],
    quiz: [
      {
        type: "order",
        q: "Order Baker's routine.",
        items: [
          "Find a fast move away",
          "Draw the zone",
          "Grade it",
          "Pick the style and timeframe",
          "Check the path for opposing zones",
          "Set stop and three exits",
          "Check 3:1 and size at 1%",
          "Manage and review"
        ],
        explain: "The same routine every time, no skipping."
      },
      {
        type: "spot",
        q: "Click the fast move away that tells you a zone exists.",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ]
        },
        answer: {
          from: 5,
          to: 6
        },
        explain: "Big, fast candles leaving the base. The zone is the base those candles started from."
      },
      {
        type: "mcq",
        q: "Which entry style uses a limit order near the far edge with no confirmation?",
        options: [
          "Counter-trend swing at a strong zone",
          "With-trend swing",
          "Gap through a zone",
          "Conservative break back through the proximal"
        ],
        answer: 0,
        explain: "With-trend uses a rejection candle; gaps wait for the opening pullback; conservative waits for the break back."
      },
      {
        type: "tf",
        q: "It is fine to use Kevin's 2:1 minimum on a Baker setup.",
        answer: false,
        explain: "Mixing rulebooks is a mistake. Baker's minimum is 3:1 to the first exit."
      },
      {
        type: "mcq",
        q: "At an all-time high, which entry style applies?",
        options: [
          "Wait for a new strong zone and trade its first return",
          "Short immediately",
          "Buy with no stop",
          "Use an indicator"
        ],
        answer: 0,
        explain: "No zone overhead means no trade until a strong new zone forms."
      },
      {
        type: "tf",
        q: "No more than two or three positions at once.",
        answer: true,
        explain: "Part of Baker's rules for managing trades well."
      }
    ],
    practice: [
      {
        prompt: "Strong fresh demand (fast in, fast out, brief), clear path up, first return. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 168, h: 168.39, l: 157.43, c: 159.04 },
            { o: 159.04, h: 159.8, l: 153.47, c: 153.73 },
            { o: 153.73, h: 155.13, l: 143.41, c: 144 },
            { o: 144, h: 144.5, l: 143.81, c: 144.21 },
            { o: 144.21, h: 144.36, l: 143.41, c: 143.84 },
            { o: 143.84, h: 153.04, l: 143.75, c: 152.59 },
            { o: 152.59, h: 159.09, l: 152.31, c: 158.84 },
            { o: 158.84, h: 160.08, l: 158.46, c: 159.84 },
            { o: 159.84, h: 161.3, l: 159.7, c: 160.89 },
            { o: 160.89, h: 161.97, l: 160.61, c: 161.82 },
            { o: 161.82, h: 163.1, l: 161.47, c: 162.84 },
            { o: 162.84, h: 163.28, l: 154.67, c: 155.78 },
            { o: 155.78, h: 156, l: 150.78, c: 151.36 },
            { o: 151.36, h: 151.66, l: 144.7, c: 145.6 },
            { o: 145.6, h: 146.1, l: 143.95, c: 146.05 },
            { o: 146.05, h: 149.53, l: 145.51, c: 149.24 },
            { o: 149.24, h: 154, l: 149, c: 153.2 },
            { o: 153.2, h: 156.3, l: 152.94, c: 155.93 },
            { o: 155.93, h: 160.85, l: 155.37, c: 160.05 },
            { o: 160.05, h: 163.9, l: 159.89, c: 163.45 },
            { o: 163.45, h: 166.56, l: 163.14, c: 166.05 }
          ],
          zones: [
            {
              from: 3,
              top: 144.5,
              bottom: 143.41,
              kind: "demand"
            }
          ],
          reveal: 14
        },
        task: "buy-sell-none",
        answer: {
          side: "buy",
          entry: 144.35,
          sl: 143.38,
          tp: 163.27
        },
        explain: "Every box ticked: zone grade strong, no supply in the way, stop 143.38, exit 1 163.27, about 20:1. Size at 1%. Price rallied."
      },
      {
        prompt: "Fresh demand is holding, but a supply zone sits right above. Buy, sell or do nothing?",
        scene: {
          candles: [
            { o: 140, h: 145.7, l: 139.59, c: 145.18 },
            { o: 145.18, h: 148.42, l: 145.1, c: 148.14 },
            { o: 148.14, h: 153.35, l: 147.88, c: 152.8 },
            { o: 152.8, h: 158.32, l: 152.5, c: 158 },
            { o: 158, h: 158.32, l: 157.63, c: 157.96 },
            { o: 157.96, h: 158.29, l: 157.46, c: 157.85 },
            { o: 157.85, h: 157.89, l: 154.66, c: 154.8 },
            { o: 154.8, h: 154.88, l: 152.08, c: 152.19 },
            { o: 152.19, h: 152.22, l: 149.37, c: 149.5 },
            { o: 149.5, h: 149.74, l: 149.3, c: 149.38 },
            { o: 149.38, h: 149.89, l: 149.05, c: 149.65 },
            { o: 149.65, h: 151.65, l: 149.6, c: 151.61 },
            { o: 151.61, h: 154.65, l: 151.46, c: 154.6 },
            { o: 154.6, h: 154.78, l: 153.04, c: 153.14 },
            { o: 153.14, h: 153.29, l: 150.49, c: 150.79 },
            { o: 150.79, h: 151.09, l: 149.59, c: 151.04 },
            { o: 151.04, h: 154.7, l: 150.71, c: 154.47 },
            { o: 154.47, h: 157.82, l: 154.39, c: 157.56 },
            { o: 157.56, h: 157.94, l: 154.94, c: 155.13 },
            { o: 155.13, h: 155.59, l: 151.53, c: 151.91 },
            { o: 151.91, h: 152.41, l: 147.93, c: 148.26 },
            { o: 148.26, h: 148.38, l: 145.94, c: 146.05 }
          ],
          zones: [
            {
              from: 4,
              top: 158.32,
              bottom: 157.46,
              kind: "supply"
            },
            {
              from: 9,
              top: 149.89,
              bottom: 149.05,
              kind: "demand"
            }
          ],
          reveal: 16
        },
        task: "buy-sell-none",
        answer: {
          side: "none"
        },
        explain: "Step 5 fails: do not buy into supply. Price stalled at supply and broke the demand."
      },
      {
        prompt: "Uptrend into a strong, fresh supply zone. Pick your counter-trend entry and stop.",
        scene: {
          candles: [
            { o: 128, h: 141.76, l: 126.8, c: 141 },
            { o: 141, h: 150.32, l: 140.42, c: 150 },
            { o: 150, h: 150.32, l: 149.5, c: 149.81 },
            { o: 149.81, h: 149.94, l: 143.29, c: 143.42 },
            { o: 143.42, h: 143.49, l: 137.6, c: 137.81 },
            { o: 137.81, h: 138.01, l: 136.55, c: 136.81 },
            { o: 136.81, h: 137.1, l: 135.5, c: 135.81 },
            { o: 135.81, h: 139.13, l: 135.66, c: 138.78 },
            { o: 138.78, h: 141.5, l: 138.41, c: 141.35 },
            { o: 141.35, h: 146.3, l: 140.64, c: 145.68 },
            { o: 145.68, h: 148.54, l: 145.43, c: 148.4 },
            { o: 148.4, h: 150.24, l: 147.9, c: 147.95 },
            { o: 147.95, h: 148.5, l: 145.08, c: 145.48 },
            { o: 145.48, h: 145.76, l: 141.85, c: 142.15 },
            { o: 142.15, h: 142.66, l: 139.35, c: 139.85 },
            { o: 139.85, h: 140.12, l: 136.39, c: 136.8 },
            { o: 136.8, h: 137.1, l: 133.6, c: 133.95 }
          ],
          zones: [
            {
              from: 2,
              top: 150.32,
              bottom: 149.5,
              kind: "supply"
            }
          ],
          reveal: 11
        },
        task: "pick-entry",
        answer: {
          side: "sell",
          entry: 150.24,
          sl: 150.35
        },
        explain: "Strong zone only, limit as close as possible to the top (150.24), stop a few cents above (150.35), no confirmation. Price dropped from the zone."
      }
    ],
    cards: [
      {
        front: "Baker's first rule of the routine?",
        back: "No zone, no trade."
      },
      {
        front: "Counter-trend needs?",
        back: "A fresh, strong zone."
      },
      {
        front: "Minimum ratio, Baker?",
        back: "At least 3:1 to the first exit."
      },
      {
        front: "Risk per trade?",
        back: "1% of the account."
      },
      {
        front: "Conservative entry style?",
        back: "Wait for price to break back through the proximal line."
      },
      {
        front: "Day-trade entry style?",
        back: "Strong fresh daily zone, execute on the 5-minute; a second chance often comes."
      },
      {
        front: "After every trade?",
        back: "Journal it against Baker's plan."
      },
      {
        front: "How long to become proficient?",
        back: "It takes time. Practise plotting zones and studying first returns."
      }
    ],
    mnemonic: "Find, Draw, Grade, Pick, Path, Protect, Profit-check, Size, Review."
  }
];
