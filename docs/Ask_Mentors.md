# Ask your mentors

Semantic search over every lesson, running on the device. Route: `/ask` (nav: Help → "Ask your mentors"). Background: `docs/research/HuggingFace_Opportunities.md` §5.4 / row 4.

## How it works

- **Build time** (`npm run ask:index`, script `scripts/build-ask-index.mjs`): loads every lesson module through Vite's SSR loader (so `@/` aliases and `import.meta.glob` work), cuts them into passages (`scripts/ask/collect.ts`), embeds each one with [Xenova/multilingual-e5-small](https://huggingface.co/Xenova/multilingual-e5-small) (q8 ONNX, onnxruntime-node, prefix `passage: <lesson title>. <heading>. <text>`), quantises each vector to int8 with a per-vector scale and writes `public/ask/index.bin` + `public/ask/passages.json`. Both files are generated and committed; re-run after lessons change.
- **Browser** (`src/pages/Ask.tsx`, lazy route): fetches the index (~5.3 MB), loads `@huggingface/transformers` with a dynamic import only on this page, downloads the same q8 model (~118 MB, once; the browser Cache API keeps it), embeds `query: <question>` and ranks with `src/core/ask/search.ts` (shared with the build/eval script).
- **Ranking**: cosine on the int8 vectors + a keyword boost of up to 0.06 = 0.06 × (idf-weighted share of the question's keywords that appear in the passage as word prefixes) + 0.015 per adjacent keyword pair. Rare terms (proximal, WOW, realignment) weigh most. At most 2 passages per lesson, top 8. While the model downloads (or if it fails) the page shows keyword-only matches.
- **Passages** (8,760 at the last build): every section point, rule, mistake, checklist item, quote, image note, figure caption, Sunday-session chart walk-through and student Q&A, the glossary, and the interactive layer (eli5, big ideas, step narrations, flashcards). Items under one heading are merged when shorter than 90 characters and split at sentence boundaries above 420 characters (average 179 characters).
- **Sources** are registered in `src/core/ask/sources.ts` (labels, links) and `scripts/ask/collect.ts` (loaders). A source that fails to load is skipped with a warning. Kevin daily is indexed, but its cards show no "Open lesson" link until the Learn page accepts `/learn?src=daily&l=N` (flip `linkable` in `sources.ts`).

| Source | Lessons | Passages |
|---|---:|---:|
| Kevin course | 23 | 1,917 |
| Kevin Sunday | 13 | ~1,816 |
| Kevin daily | 27 | ~600 |
| Raja | 14 | 753 |
| Seiden | 104 | 3,040 |
| Baker | 14 | 585 |
| Glossary | 38 terms | 38 |

Index size: `index.bin` 3.24 MB + `passages.json` 2.03 MB = **5.27 MB** (gzip on the wire is smaller for the JSON).

## Commands

```bash
npm run ask:index            # rebuild the index (≈10 min on a busy 4-core box; ASK_THREADS=4 on an idle one)
npm run ask:index -- --dry   # only collect and count passages
npm run ask:eval             # the 15 questions in scripts/ask/questions.json, top 3 each (--k=8, --boost=0 to compare)
```

Behind an HTTPS proxy the script re-runs itself with `NODE_USE_ENV_PROXY=1` so Node's fetch can reach huggingface.co.

## Quality check (15 questions, top 3, run in Node with the same model and ranking as the browser)

**Honest summary.** No ground-truth labels yet; I judged relevance by reading. A passage that answers the question is in the top 3 for **15/15** questions and is the top hit for **13/15**. The two weaker cases: "how does Kevin remove a zone" ranks a short, context-free step ("Kevin does not call that removed") from the right lesson (21) first, and "what is WOW" ranks a chart-frame note above the lesson summary. The keyword boost clearly helps: with `--boost=0`, "where do I put my stop loss" returns a Baker options passage first and "confirmation entry instead of a limit" a less direct Kevin passage. Weak spots to watch: short step/flashcard fragments can outrank fuller explanations; the 2-per-lesson cap hides a third good passage from a long lesson; Hindi/Urdu questions were not tested. Query embedding took 7-30 ms and ranking 20-70 ms in Node; expect a few times slower on a mid phone (WASM). The research doc's pass bar (50 user-written questions, recall@5 ≥ 80%, +15 pp over keyword search) is still to be run.

### "what is a proximal line"

<sub>embed 15 ms · rank 51 ms</sub>

1. **Glossary · Glossary** — *Proximal line* (score 0.976 = cos 0.901 + kw 0.075)  
   Proximal line: The zone edge price reaches first: the top of demand, the bottom of supply. Usually the base body edge; the limit order sits just before it
2. **Kevin course · 3. Drawing Zones** — *Step: Proximal line: top of the basing body* (score 0.964 = cos 0.889 + kw 0.075)  
   For demand, the proximal line is the top. Usually he puts it on the top of a basing candle body. That part is your choice.
3. **Kevin course · 3. Drawing Zones** — *Distal and proximal lines* (score 0.962 = cos 0.887 + kw 0.075)  
   Distal = the line furthest away. Demand: distal at the bottom; supply: distal at the top. Proximal = the near line. Demand: proximal on top; supply: proximal at the bottom. Knowing the names isn't super important, it's part of the theory.

### "when should I use a confirmation entry instead of a limit order"

<sub>embed 11 ms · rank 22 ms</sub>

1. **Kevin course · 15. Confirmation Trading** — *The two confirmation entry methods* (score 0.970 = cos 0.880 + kw 0.090)  
   Pullback method (his personal choice): after the zone(s)/trendline are removed, wait for price to pull back to the new entry-timeframe demand and buy there with a limit order.
2. **Seiden · 1. Probability Enhancer (Odds Enhancer Score Sheet)** — *Total score and entry type* (score 0.964 = cos 0.874 + kw 0.090)  
   Score 9 or 10: a limit order is acceptable. Score 8: use a confirmation entry. Below 7: no trade (the notes list 7 next to 'no trade if less than 7').
3. **Seiden · 1. Probability Enhancer (Odds Enhancer Score Sheet)** — *Flashcards* (score 0.942 = cos 0.852 + kw 0.090)  
   Strongest exit from a level scores? - 2 points: one or two very large candles leaving the level. Retracement points for 1st, 2nd, 3rd return? - 2, 1, 0. Score 9-10 allows which entry? - A limit order at the level. Score 8 means? - Use a confirmation entry. …

### "Raja high curve low curve"

<sub>embed 11 ms · rank 19 ms</sub>

1. **Raja · 4. High Curve and Low Curve, Trendline-Close Confirmation and Trailing Stops** — *Step: Draw the curve* (score 0.960 = cos 0.885 + kw 0.075)  
   Mark the 50% line in the middle and a 25% band at each end. Raja draws it by hand; he does not trust indicators. Top band: high curve, sellers only. Bottom band: low curve, buyers only.
2. **Raja · 4. High Curve and Low Curve, Trendline-Close Confirmation and Trailing Stops** — *Step: Skip demand in the high curve* (score 0.956 = cos 0.896 + kw 0.061)  
   Price rallies into the high curve and leaves a small demand. Raja does not use it: sellers sit near the HTF supply. Price soon drops right through it.
3. **Raja · 54. Live Pair Review: HTF direction, 15-minute entries and the departure candle** — *New or different* (score 0.914 = cos 0.839 + kw 0.075)  
   'High curve / low curve area' matches the curve location (buy low, sell high in the HTF range) in Kevin's and Seiden's material.

### "how does Kevin remove a zone"

<sub>embed 8 ms · rank 19 ms</sub>

1. **Kevin course · 21. When is a zone removed** — *Step: Not removed* (score 0.972 = cos 0.912 + kw 0.060)  
   Kevin does not call that removed. Treat the zone as still alive. Price rallied away again.
2. **Seiden · 198. The Straight Answers to the Most Frequently Asked Questions** — *New or different* (score 0.950 = cos 0.890 + kw 0.060)  
   Differs: Kevin keeps a zone until it is removed (closed through), not weakened by touches; Seiden lowers odds on a third return. New: requiring the S&P to be at demand for a stock long.
3. **Raja · 1. Strong Zones: CP Zones and Arrival Zones** — *New or different* (score 0.945 = cos 0.885 + kw 0.060)  
   Kevin also requires a zone to be 'qualified' (it removes an opposing zone or a trendline). Raja splits this into two named types: CP strong zone and arrival zone (trendline AND opposite zone).

### "what is WOW"

<sub>embed 11 ms · rank 28 ms</sub>

1. **Raja · 51. Strong Zones I: strong vs weak, wow trade and arrival zones** — *On his charts* (score 0.887 = cos 0.827 + kw 0.060)  
   04:33 Whiteboard '(2) WOW': supply #1 at the top, supply #2 lower (circled), demand at the bottom; the zigzag runs from the demand up through #2 into #1.
2. **Raja · 51. Strong Zones I: strong vs weak, wow trade and arrival zones** — *Strong zone #2: the wow trade* (score 0.882 = cos 0.822 + kw 0.060)  
   He says if you understand wow trades you can make money even without deep supply & demand knowledge. 'Wow' just means good pips.
3. **Raja · 50. Wow Trade (Topic 6): trading the pips between zones** — *Summary* (score 0.877 = cos 0.817 + kw 0.060)  
   Raja's 'wow trade' is the open run of pips between one zone and the next. There are two versions. (1) A zone removes the nearest opposite zone, so price is drawn to the next zone of that type. (2) Price breaks a trendline with a big candle, so the room from…

### "how many base candles can a zone have"

<sub>embed 9 ms · rank 32 ms</sub>

1. **Baker · 5. Zone Strength: Speed, Freshness and Time** — *New or different* (score 0.941 = cos 0.903 + kw 0.038)  
   Base length: Baker accepts three to six candles for a range-breakout zone. Kevin wants one to three (five at most); Seiden says fewer is better and is wary of long bases.
2. **Kevin Sunday · 9. Chain analysis: don't force zones, all-time lows, and updating/ending trendlines (2026-09-20)** — *Chart: Not named (homework chart) Daily* (score 0.938 = cos 0.878 + kw 0.060)  
   Larger basing candles and a drop-base-drop among many all-time lows Why: Bigger-than-normal basing candles aren't explosive moves. One explosive candle removed nothing. The DBD's move-away candle had a wick and wasn't a full red body. Result: No zones drawn…
3. **Kevin Sunday · 12. Space between stay-away grades the zone; homework chain and first trade reviews (2026-10-11)** — *Student question* (score 0.937 = cos 0.899 + kw 0.037)  
   Q: My base is only one candle; is that allowed? A: A base is not limited to one candle. It can be one to as many as you want; he prefers one to three, up to five.

### "flip zone"

<sub>embed 28 ms · rank 65 ms</sub>

1. **Raja · 2. Weak Zones and the Confirmation Rule (Retests, Inheritance, Flip, Overlap)** — *Flip zones* (score 0.966 = cos 0.891 + kw 0.075)  
   A broken resistance becomes support (and the reverse). In S&D he calls these flip areas or flip zones: a zigzag area where price can reverse.
2. **Raja · 52. Strong Zones II: tested zones, confirmation, inheritance, overlap and flip zones** — *Flip zone* (score 0.954 = cos 0.879 + kw 0.075)  
   The CP level found at the flip area is weak because it overlaps the previous supply. Zoom out and you will see it was an overlap.
3. **Raja · 52. Strong Zones II: tested zones, confirmation, inheritance, overlap and flip zones** — *Flip zone* (score 0.951 = cos 0.876 + kw 0.075)  
   Price moves in a zigzag. A broken resistance becomes support: other methods call it higher highs and higher lows, distribution and accumulation; in supply & demand it is the flip zone.

### "Seiden odds enhancers"

<sub>embed 12 ms · rank 68 ms</sub>

1. **Seiden · 163. Advanced Price Action Analysis: The Odds Enhancers** — *Summary* (score 0.978 = cos 0.903 + kw 0.075)  
   Seiden introduces the XLT 'Odds Enhancers', a rule-based scoring of each supply or demand level out of 10. A student's gold short scored 9 out of 10 and was entered with a limit order and all exits pre-placed. He explains three enhancers (strength of move, …
2. **Seiden · 366. Key Trading Nuggets Q&A** — *Odds enhancers (Jakob)* (score 0.968 = cos 0.893 + kw 0.075)  
   Time at level: books say more activity = stronger; Seiden says the opposite - big imbalance means few transactions, few candles and low volume.
3. **Seiden · 163. Advanced Price Action Analysis: The Odds Enhancers** — *Diagram* (score 0.946 = cos 0.871 + kw 0.075)  
   Gold 60-min short scored with the Odds Enhancers: a rally-base-drop supply left fast, reward to the first target is 3:1 and the bigger picture agrees, so the zone scores 9 of 10.

### "trendline break and zone removal"

<sub>embed 26 ms · rank 67 ms</sub>

1. **Kevin Sunday · 9. Chain analysis: don't force zones, all-time lows, and updating/ending trendlines (2026-09-20)** — *Q&A: removals across timeframes* (score 0.956 = cos 0.896 + kw 0.060)  
   A one-minute zone will not remove a monthly zone. Zone removal and trendline removal are judged on the same chart and timeframe. If you trade the 5-minute, look for removals only on the 5-minute.
2. **Kevin course · 22. Sunday Zoom Session lessons** — *Mistakes he warns about* (score 0.954 = cos 0.879 + kw 0.075)  
   Calling a zone off an explosive candle before a stay-away candle forms. Drawing momentum lines, or sideways/too-horizontal lines, as trendlines. Trendlines that cut through candles or aren't attached to the low or wick. Treating a wick touch, or a candle st…
3. **Kevin daily · 12. Daily plan for Fri, Aug 14** — *Rules and lessons* (score 0.953 = cos 0.903 + kw 0.050)  
   Trendline breaks: removing the 4H trendline makes a better zone than removing only the 1H trendline. After a big gold/oil move in your favour: break-even at minimum and take some profit off.

### "set and forget"

<sub>embed 25 ms · rank 41 ms</sub>

1. **Glossary · Glossary** — *Set & forget* (score 0.956 = cos 0.896 + kw 0.060)  
   Set & forget: Pending limit with stop and target placed in advance, then left alone
2. **Seiden · 125. Set It And Forget It** — *New or different* (score 0.956 = cos 0.896 + kw 0.060)  
   Matches Kevin's 'set and forget' idea for zone orders; the explicit OCO bracket and the 80/80 failure estimate are new.
3. **Kevin course · 23. The difference between Set & Forget and Confirmation Trading** — *Step: Zone 1: born with the daily zone* (score 0.946 = cos 0.886 + kw 0.060)  
   Inside that daily base sits an H1 demand. It formed at the same time, as part of the daily move. That is an embedded zone: set & forget.

### "where do I put my stop loss"

<sub>embed 8 ms · rank 21 ms</sub>

1. **Kevin Sunday · 1. Chain analysis homework review: trendline anchoring, second explosive leg, and realistic stop losses (2026-07-19)** — *Q&A: realistic stop loss placement* (score 0.947 = cos 0.872 + kw 0.075)  
   Do not put the stop all the way below the daily zone either: 'you might as well just take the whole daily zone'.
2. **Kevin Sunday · 1. Chain analysis homework review: trendline anchoring, second explosive leg, and realistic stop losses (2026-07-19)** — *Q&A: realistic stop loss placement* (score 0.945 = cos 0.870 + kw 0.075)  
   Middle ground: put the stop about halfway into the daily zone, so the daily gets a chance to test half of it. The whole trade could still fail.
3. **Kevin Sunday · 12. Space between stay-away grades the zone; homework chain and first trade reviews (2026-10-11)** — *Student question* (score 0.931 = cos 0.881 + kw 0.050)  
   Q: What should I do if I keep getting knocked out by a tight stop loss? A: Use a wider stop loss.

### "what is realignment"

<sub>embed 8 ms · rank 31 ms</sub>

1. **Raja · 8. Sequence and Realignment** — *Realignment* (score 0.982 = cos 0.922 + kw 0.060)  
   The alignment (realignment) area is where a weekly strong zone and a daily strong zone come together: a daily zone inside or next to the weekly zone.
2. **Raja · 8. Sequence and Realignment** — *Explained simply* (score 0.959 = cos 0.899 + kw 0.060)  
   Sequence = owner and puppy walking the same way. Realignment = the puppy coming back to the owner's feet.
3. **Seiden · 319. Patience and Probabilities, Part 2** — *Diagram* (score 0.846 = cos 0.846 + kw 0.000)  
   Inter-market alignment: when the S&P reaches supply with demand far below and a stock is also at supply, short both; exit when the index reaches its demand.

### "is a zone still valid after it has been tested once"

<sub>embed 10 ms · rank 51 ms</sub>

1. **Kevin course · 22. Sunday Zoom Session lessons** — *Q&A: proven zones, old zones, HTF control* (score 0.933 = cos 0.902 + kw 0.031)  
   Q: If a zone is respected or tested and then removed, is the zone that removed it more valid? A: Yes. Several reactions off a supply prove it was real supply, so the demand that breaks it is more powerful.
2. **Kevin daily · 1. Daily plan for Thu, Jul 9** — *Rules* (score 0.921 = cos 0.871 + kw 0.050)  
   After a big impulsive move the zone looks small when the chart rescales - it is still valid. A zone outside his chain (multi-timeframe) analysis is drawn grey and is lower grade. Demand that removes a proven supply is a very strong demand. Do not let a brea…
3. **Kevin course · 10. When to Remove a Limit Order** — *When a zone counts as tested* (score 0.920 = cos 0.876 + kw 0.044)  
   Price pushes into the HTF zone and reacts. The zone is officially TESTED once a candle CLOSES fully outside it, with no body or wick touching. Until then it is 'being tested'. Pulling back into a tested HTF zone to a lower-timeframe zone is lower odds.

### "how do I use the higher timeframe to pick direction"

<sub>embed 8 ms · rank 24 ms</sub>

1. **Kevin Sunday · 10. Chain-analysis homework review: higher-high trendlines, borderline zones, emotional wicks and the channel tool (2026-09-27)** — *Q&A: use his chart link, day-trading timeframes, direction* (score 0.963 = cos 0.888 + kw 0.075)  
   Stay off the 1-minute (its higher timeframe would be the 15-minute, which he does not analyse). Use the 5-minute with his H1 charts as the guide, or the 15-minute with his H4 as the guide. Pick one, not both.
2. **Kevin Sunday · 10. Chain-analysis homework review: higher-high trendlines, borderline zones, emotional wicks and the channel tool (2026-09-27)** — *Q&A: use his chart link, day-trading timeframes, direction* (score 0.948 = cos 0.892 + kw 0.056)  
   Direction depends on your entry timeframe: entering on 5M, direction comes from H1; once mastered add the daily ('higher timeframe plus one' / multiple sequence analysis). Example: H1 uptrend line means look for 5M longs, but at a daily supply expect the H1…
3. **Kevin course · 12. Day trading (webinar)** — *Before you trade* (score 0.930 = cos 0.874 + kw 0.056)  
   Have I checked the trend on my higher timeframe (15m / H1 / H4)? Have I checked one timeframe higher (H4 for a 15m, daily for an H1) for a zone in control? Is my trade with the higher-timeframe zone in control? If not, have I cut my risk? Is price inside a …

### "what is the difference between DBR and RBR"

<sub>embed 14 ms · rank 27 ms</sub>

1. **Glossary · Glossary** — *DBR / RBD* (score 0.910 = cos 0.894 + kw 0.016)  
   DBR / RBD: Drop-Base-Rally (demand) / Rally-Base-Drop (supply): reversal zones, also called VP (valleys and peaks)
2. **Glossary · Glossary** — *RBR / DBD* (score 0.908 = cos 0.891 + kw 0.016)  
   RBR / DBD: Rally-Base-Rally (demand) / Drop-Base-Drop (supply): continuation zones, also called CP
3. **Kevin course · 1. Intro to Supply & Demand** — *The two types of zones* (score 0.907 = cos 0.874 + kw 0.033)  
   Demand: Drop-Base-Rally (DBR) and Rally-Base-Rally (RBR). Supply is opposite: Rally-Base-Drop (RBD) and Drop-Base-Drop (DBD). DBR/RBD = reversal type; RBR/DBD = continuation pattern.
