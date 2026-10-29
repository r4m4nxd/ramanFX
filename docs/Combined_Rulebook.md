# RamanFX Combined Rulebook: Kevin + Seiden + Baker (+ Raja TBD)

All mentor material on supply and demand, merged into one rulebook and set against what ZoneVision / ZoneBot do now. Everything is paraphrased; the only quotes are short ones.

**Sources**

| Key | Mentor | Where it comes from |
|---|---|---|
| **Kevin** | The app's video / Zoom mentor | `src/core/videoLessons.ts` (VL), `zoomSessions.ts` (ZS), `course.ts` (CL), `coach.ts` (CO), `playbook.ts` (PB), `strategy.ts` (ST); `docs/ZoneBot_Kevin_Audit.md` |
| **Seiden** | Sam Seiden, OTA, "5 years of S&D teaching" (423 p.) | `docs/Seiden_5Years_Notes.md` (p.1-80) + `docs/seiden_parts/Seiden_p081-160 … p401-423.md` |
| **Baker** | Kevin Baker, "We Don't Need No Stinkin' Indicators" + the FXStreet / IG S&R chapter (marked **FXS**) | `docs/Mentor_PDFs_Comparison.md` |
| **Raja** | 4th mentor: **TBD**. Raja supplied the Baker and FXS PDFs, but his own rules have not been captured yet | (placeholder column) |
| **Bot now** | `public/tools/RamanFX_ZoneBot.mq5` v1.62 inputs + `.set` files; ZoneVision `RamanFX_ZoneVision.mq5` | `docs/SD_Strategy_Review.md`, `docs/ZoneBot_Kevin_Audit.md` |

**Kevin is not Kevin Baker.** "Kevin" always means the app's video mentor. "Baker" means the PDF author.

**Bot presets:** `InpPreset` 0 Custom, 1 Kevin best (the code default), 2 Aggressive, 3 Zones 3R (Z3), 4 Breakout, 5 Impulse. The set files are KevinBest, Zones3R, Breakout, Impulse and TopDown. TopDown is Z3 with `InpZ3Bias=true` and M5 switched on.

**Verdict key**

| Verdict | Meaning |
|---|---|
| **AGREE** | Every mentor who covers the rule agrees with it, and the bot already follows it (or follows it closely) |
| **CONFLICT** | The mentors disagree with each other, or the bot goes against their consensus |
| **NEW** | One or more mentors teach the rule, and the bot does not have it |

---

## 1. Core rules everyone agrees on (the one-page checklist)

Trade a zone only if **every** item below holds. Kevin, Seiden and Baker each teach all of them. FXS agrees wherever it covers the topic.

| # | Check | The rule in one line |
|---|---|---|
| 1 | **Base + explosive move away** | A zone is a short pause followed by a fast, strong move out. No strong move away, no zone. A gap away is the strongest kind of move |
| 2 | **Few candles in the base** | Fewer candles means a bigger imbalance. A long, messy base is equilibrium, so skip it |
| 3 | **Draw it with two lines** | The distal line goes on the extreme wick. The proximal line goes on the near edge of the base. Never draw a line that cuts through candles |
| 4 | **Fresh** | The first return is the best trade. Each return uses up orders, so the zone gets **weaker**, not stronger |
| 5 | **Higher TF in control** | Find the big-picture zones first (top-down). Don't buy into HTF supply or sell into HTF demand. An LTF setup at an opposing HTF zone is very low odds |
| 6 | **Profit margin** | There must be room to the nearest opposing level: about 3:1 to the first target (Kevin accepts 2:1 or more when the structure only offers that). A small margin means a smaller or skipped trade |
| 7 | **Location (curve)** | Buy demand low in the big-picture range and sell supply high in it. Avoid the middle (equilibrium) |
| 8 | **Trade with the trend by default** | Uptrend: buy pullbacks into demand. Downtrend: sell rallies into supply. Counter-trend trades only at major HTF levels, and they are lower odds (see C10) |
| 9 | **Plan the whole trade in advance** | Entry, stop and target are set before the fill (set and forget / bracket). Price has to come to you. Never chase |
| 10 | **Stop just beyond the distal** | The stop is a hard, server-side order and is never widened. If the risk is too big, cut the size or skip the trade |
| 11 | **Fixed % risk sizing** | About 1% of the account per trade (0.5-2% range). Size = risk $ / stop distance |
| 12 | **Ignore opinion, trade the chart** | News and indicators come second to the zone. Never trade your own reading of the news |
| 13 | **Probabilities** | The edge shows over hundreds of trades. Losses are part of the process. A low win rate is fine at 3:1 |

Seiden's own minimum filter (p.414) is just **level quality + profit margin**: everything else on the list raises the odds further.

---

## 2. Master table by topic

Table cells are short. Page or line refs point to the source notes.

### 2.1 Zone identification and drawing

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Zone = base + explosive move away | Yes. Four parts: basing, move away, stay-away candle, space before the proximal (VL:2711) | Yes. A-B-C logic (pause, sharp move, first return) | Yes. Price "moved away quickly" (p.10-14) | – | `DetectZones` needs all four parts | AGREE |
| Pattern names | VP: DBR / RBD. CP: RBR / DBD | DBR / RBD only | Pivot, tight range, mid-trend doji, gap | – | Draws VP + CP | CONFLICT (C6) |
| Mid-move continuation zone (RBR / DBD) | "Often the most powerful" (CO, CL) | DBD is **not** supply. A mid-move base "doesn't work well" (p.94, p.179) | Mid-trend doji zone is valid (p.12) | – | CP zones are traded | CONFLICT (C6) |
| Find the move first, then its origin | Same process (VL:43) | "Find the strong move first" (p.155) | Same | – | Leg ratio from the base | AGREE |
| Proximal line | On the base body (or wick) edge | Two lines around "where most of the trading" is; check two TFs | The pivot candle's full range, top to bottom (p.10) | – | Base body edge | CONFLICT (minor) |
| Distal line | Extreme wick of the base + leg | Just beyond the far line | Always at the extreme | – | Lowest low / highest high of base + leg | AGREE |
| Pivot beats cluster | Single-candle base is the favourite | A pivot is the strongest level. A cluster gets sliced through "like a hot knife" (p.88) | Short time in the zone is best | – | Score: base ≤ 2 = +1 | AGREE |
| Leg-out minimum ratio | First candle after the base must be explosive | Fast leave required ("or I won't look at the level") | "Dramatically shoots away" | – | `InpMinLegRatio` 1.2 (drawing); score cMove ≥ 1.8 / 2.5 | AGREE (bot threshold weak) |
| Second explosive candle | Score higher (ZS:440) | Big candles / gap = stronger | – | – | `leg2` +1 | AGREE |
| Stay-away space | A small gap means drawable but not tradable (ZS:1871) | – | – | – | `InpMinGap` 0.15 | AGREE (Kevin only) |
| Qualification (chain) | Must remove an opposing zone or a trendline, or make an all-time high / low | Not required | Not required | – | `InpRequireQualified` true; Best adds the ATH rule | CONFLICT (Kevin only; keep) |
| Similar zone size | ½ the usual size is too small. A height cap applies | – | – | – | `InpMaxZoneATR` 1.5, `InpMinSizeVsMedian` 0.5 | AGREE |
| Oversized zone | Cut it in half / zone within a zone (VL:431) | "X-ray" it on a lower TF (p.325) | Rebuild it from the hourly candle (p.11); FXS: go 3-4 TFs lower | – | **Rejected** above 1.5 ATR | NEW (refine) |
| Gap zones | "No zone there" (ZS:117) | A gap is the "ultimate imbalance". An unfilled gap origin is quality demand | Treat the gap as one big candle (p.13) | – | Not modelled | CONFLICT (C14) |
| Emotional wick | A body through the zone removes it; a big wick does not | – | – | – | `InpEmoATR` 3 | AGREE (Kevin) |
| Round numbers | – | – | FXS: 00 / 50 levels act as zones (p.28) | – | None | NEW (minor) |
| Origin freshness (look left) | – | Old fresh levels are best | The creating candle must not itself be a retest of an older zone (p.14) | – | None | NEW |
| Broken zone flips (S/R polarity) | Broken = void (VL:791) | Flips only with margin + strong break + good curve location (p.334) | Trade the flipped zone on its first pullback | – | Void | CONFLICT (C13) |

### 2.2 Zone quality, odds enhancers and scoring

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Use a score sheet? | **Rejects** score rule books: zones are tradable or not (VL:1708) | 10-point sheet: departure 2, margin 2, big picture 2, tests 2/1/0, time 1, arrival 1 | Qualitative checklist | – | `ZScore` 0-15, `InpMinScore` 0 (off) | CONFLICT (C7) |
| Score → entry type | – | 9-10 → limit. 8 → confirmation. Under 8 → no trade | – | – | None | NEW |
| Departure grades | poor / decent / A+ / gap (CL) | gradual < big candles < gap (p.408) | Fast out, ideally fast in | – | cMove 0-2 | AGREE |
| Qualifying rule: initial run-out ≥ 3 × zone height | – | A zone only counts if the first move away is at least 3 × its height (p.276) | – | – | `departure` filters Custom only (`InpMinDeparture` 1.5) | NEW |
| Distance run before the return | Time away / old | Farther = bigger margin and higher odds ("rubber band", p.409) | – | – | Score cDep (≥ 3) | AGREE (partial) |
| Time at level | 1-2 candles best, up to 4-5 | Fewer is better, relative to other bases; "3-6 is probably the best" rule of thumb | Reversal: shorter is better. Range breakout: 3-6 is OK | – | `InpMaxBase` 6; score base ≤ 2 | CONFLICT (C12, small) |
| Low volume at the base | – | Big imbalance means few trades: low volume at the turn (p.297, 409) | – | – | None | NEW (data-limited) |
| Levels on top of levels | Stacked zones feel like 50/50; take all, the extreme only, or skip the middle (VL:2008) | An odds enhancer: two vault doors (p.321) | – | – | None | CONFLICT (C8) |
| Liquidity trap in front of the zone | An odds booster (CO) | "Red line" trap; bull / bear trap past the Globex high (p.131, p.381) | Stop hunters sit at obvious levels | – | `FindTrap`, `InpTrapATR` 1, `InpRequireTrap` false | AGREE |
| Higher TF = stronger | Yes | HTF levels trump LTF levels | Yes; FXS too | – | HTF zones used | AGREE |
| Weak factor offset by others | – | Margin + curve + stacking can make up for a weak departure (p.348) | – | – | Additive score | AGREE (implicit) |
| Novice footprint (bandwagon) candles | Emotional candles | The biggest candles at the end of a run = late crowd (p.175, p.347) | – | – | Emotional-candle star only | NEW (display) |

### 2.3 Freshness and depth of return

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Fresh only? | Fresh only. Tested = lost strength | 1st = 2, 2nd = 1, 3rd = 0. "Never buy a level tested more than once" (p.107) | Fresh only; more bounces = weaker | – | Any touch of the proximal = tested → skipped | CONFLICT (C2) |
| Depth beats count | Grid 0 / 25 / 50 / 75 / 100%: ~25% = "mid", > 75% = void; count still matters (VL:1642) | Later he counts depth, not touches: ≥ 25% into the zone = no more trades (p.421) | – | – | `pen` in score: 0 → 2, < 0.25 → 1 | CONFLICT (C2) |
| Shallower reactions mean absorbed | – | Shrinking reactions + basing at the level = expect a break; trade the LTF zone the other way (p.220) | FXS: each reaction uses up orders | – | None | NEW |
| Old zones | Old zones are lower odds (ZS:306, removed ones) | **Old fresh levels are better** (far out on the curve) and may take a little more risk | Look back 5 years | – | `InpMaxZoneAge` 200 bars | CONFLICT (C18) |
| "Recent price action to the left" = not fresh | – | Yes (p.366) | – | – | Tested flag | AGREE |

### 2.4 Arrival / approach

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| How price returns | Return on the very next candle = downgrade (ZS:450) | Sharp, base-free arrival = high odds. Stair-step arrival = low odds. "Strong arrival → strong departure" | Fast into the zone is "even better". The slow BWLD approach failed (p.25) | – | No arrival test (Z3 arms on the stay-away close) | NEW |
| No new opposing zone on the way in | – | Required (score 1) | – | – | None | NEW |
| Trendline in the way | Lower odds if price must cross a respected line (Drill) | – | – | – | `KCross`: Best skips, Z3 trades | AGREE (Best) |
| Arm distance / no chasing | ATR distance; alert at halfway | Don't chase breakouts | Don't chase | – | `InpMaxDistATR` 2, halfway alert | AGREE |

### 2.5 Trend, big picture and curve

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Trend definition | Needs an obvious trendline (peak + valley + new extreme) | Trends start and end at S/D levels. MAs (20 / 50 / 200) are secondary at best | FXS: HH / HL sequence. Steep line (> 45°) breaks easily | – | Trendline break `KBias` + swings | CONFLICT (C11) |
| With-trend only by default | Yes. Counter-trend / sideways = low odds | Downtrend → only supply shorts (p.410) | With-trend, + counter-trend at strong zones (deep entry) | – | Best: skip against. Z3: `InpZ3Bias` false (trades both). TopDown: true | CONFLICT (C10) |
| Counter-trend exception | Skip / half risk | **Only** at a fresh HTF level, where trends end (p.421). Quality + margin can beat the trend (Japan 2011) | Strong zones only, no confirmation | – | None | CONFLICT (C10) |
| Bigger trend (HTF of the HTF) | Three-TF check | Weekly / monthly for the curve | – | – | `InpBigTrend` true (Best; Z3 only with Bias) | AGREE |
| Sideways HTF | No setups in a messy range | Sideways: trade both edges | – | – | Best skips "unclear" | CONFLICT (minor) |
| Curve location | Demand below the HTF 50% (best ≤ 33%) | Far from equilibrium; curve decides day trade vs swing | Don't buy into supply | – | `InpCurveFilter` false; score cCurve uses HTF zones | NEW (gate off) |
| Trend health from pivot spacing | – | Pullback pivots getting closer = trend ending (p.202, p.296) | FXS: a steep line's break ≠ reversal | – | None | NEW |
| Overextended (channel 50%) | Golden area up to the 50% line | – | – | – | `InpBlockOverext` true | AGREE (Kevin) |

### 2.6 Multi-timeframe pairs

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Entry TF → HTF | 1m→15m, 5m→H1, 15m→H4, H1→D1, H4→W1, D1→M1 (PB) | Day: H1 / D1 + 5m. Swing: D1 + W1, or HTF + 60m "no smaller". 2-3 TFs | Day: D1 zones + 5m / H1 exits. Swing: D1. Long term: W1. FXS: trend from the next bigger TF | – | `TF_H` map as Kevin | AGREE |
| ITF check | Required for full odds | – | – | – | `InpRequireITF` false | AGREE (option) |
| Confirmation TF | 15m→1m, H1→5m, H4→15m, D1→H1 | Drop a TF to find the base | Hourly refine | – | `ConfirmedBy` on the ETF | AGREE |
| Review the HTF weekly | Update zones weekly | Weekly + daily, at least once a week | – | – | Live | AGREE |

### 2.7 Entries (limit, confirmation, breakout, traps, gaps)

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Default entry | Limit just before the proximal (+ spread) | Limit at the proximal for score 9-10 | Counter-trend: limit "as close as possible" to the distal | – | Z3: `InpZ3Front` 0.05 before the proximal | CONFLICT (C5) |
| Confirmation entry | Opposing ETF zone and / or trendline removed after the HTF zone is touched. No candle patterns | Let price enter, then enter as it leaves (fixed offset). Cancel if the stop price trades first. Any trigger works **at** a level | Rejection candle closes, or a break back through the proximal | – | `ConfirmedBy` (Best). No candle trigger | CONFLICT (C15) |
| Breakout entry | Stop order beyond the opposing zone after it is removed. Higher win rate, ~1.5R | Don't buy the break: buy the return to its origin; target = the breakout high. Fade breakouts into HTF supply | FXS: wait for the pullback. Breakouts near 5 pm ET fail; after the London open they work | – | Breakout preset, `InpBoMinRR` 1.5 | CONFLICT (style) |
| Traps | Liquidity before the zone = good | Bull / bear trap: event + break of an obvious high into fresh supply → sell | Stop hunters | – | `FindTrap` score | AGREE |
| Gap into a level at the open | – | The highest-odds trade (gap × trend matrix; pro vs novice gap) | FXS: 4 gap setups by trend | – | None (FX gaps are rare) | NEW (low priority) |
| Market orders | Not advised | – | – | – | Impulse preset uses them | CONFLICT (user's own test) |
| Scale-in | 50/50 split inside one zone | Only if pre-planned; add more size near the stop; across stacked levels with one stop | Two entries: in the zone, or after the break-back | – | None | NEW |
| Re-entry after a stop-out | – | Re-short at the next supply | "Second chance" bounce | – | Two placements per zone | AGREE (partial) |

### 2.8 Stops

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Placement | Just beyond the distal. Standard / wide / very conservative: pick one by backtest | 1-2 ticks beyond the far line | 1 tick / "a few pennies" beyond the zone | – | Z3: `InpZ3StopBuf` 0.10 × h + spread | AGREE |
| Volatility floor | Wider on gold / oil; give "wiggle room" (ZS:150) | Tight; a wide zone means smaller size | Tested ATR stops and **rejected** them: if the stop is too big, skip | – | `InpZ3MinStopATR` 0.75, `InpZ3MinStopHTF` 0.25 (metals), `InpZ3MaxStopATR` 2 | CONFLICT (C3) |
| Never widen | Yes | Pre-set and walk away | Yes | – | Only moves in favour | AGREE |
| Order type | Hard stop | Stop-market, **never** stop-limit | Stop goes in with the entry | – | Server SL | AGREE |
| Cancel if the stop trades before the fill | – | Yes (confirmation entries) | – | – | None | NEW |
| Stop 50% into the HTF zone (ETF zone sits at the HTF proximal) | Yes (ZS:505) | – | – | – | Best only | AGREE (Kevin) |

### 2.9 Targets

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Methods | Fixed R:R / opposing zone / structure high-low / trail. 25% at 3:1, runner to the HTF zone | T1 ≥ 3:1 at the nearest opposing level; T2 at the next level / 5:1 | 3 exits: pivot wick, 1 tick before the next zone, 1 tick before the major zone | – | Z3 fixed 3R; `InpTpMode` nearest; `InpGlobalRR` 0 | CONFLICT (C20) |
| Target just **before** the opposing level | – | Yes (fill competition, p.329) | 1 tick before | – | At the level | NEW |
| Run-out extreme as a target | – | The low before the return is one target (p.337, p.409) | – | – | None | NEW |
| Curve decides the horizon | Inside an HTF zone: hold to the opposing HTF zone | Badly placed on the curve = day bounce only; well placed = swing | – | – | Best: `hOpp` | AGREE |
| Opposing HTF zone before the target | Take profit sooner | No margin = no trade | Don't buy into supply | – | `InpZ3NeedRoom` true (HTF only) | AGREE (ETF gap NEW) |

### 2.10 Break-even and trade management

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Break-even trigger | High odds: BE after ~2:1 (VL:2480). Low odds: 0.5-1R | After a solid run / at 3:1 / after T1 (p.165, p.227) | No fixed R: trail at pivots, or a small profit after X%. FXS: BE "out of fear" is a mistake | – | `InpBE_R` -1 → Z3 1.0, Best 2.0; .set files: Z3 / Breakout / TopDown = 1, Best = 2 | CONFLICT (C1) |
| Four management styles | Hold / BE / half risk / trail under LTF zones; pick by testing | Trail behind each new LTF S/D | Trail at each retrace (5m) | – | `InpHalfRiskAt1R` true, `InpTrailZones` true, `InpPartialAt3R` false (Custom / mentor mode) | AGREE |
| Partials | 25% at 3:1 | Scale out at T1 / T2 | Thirds over 3 exits | – | Impulse ladder; `InpPartialAt3R` | AGREE |
| Pending cancel rules | No time-based removal. Remove when the opposing HTF zone is hit first, or the move already happened | – | – | – | `KevinPendings`, `InpCancelRunFrac` 1 | AGREE |
| Keep = enter (re-check pendings) | – | – | – | – | Missing (review R9) | NEW |

### 2.11 Risk, position sizing and max positions

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Risk per trade | 1%. 0.25-0.5% without 3-TF confluence. Low odds ≤ 0.5% | 1% (students up to 2%). Losses a "tiny percentage" | 1% (0.5-2%) | – | `InpRiskPct` 1; presets `InpBestRiskPct` 0.5 | AGREE |
| Half risk on lower odds | Yes | Size follows the odds | – | – | Grade C half (Custom); DD half at 6% | AGREE |
| Max concurrent positions | One order at the nearest zone | 1-3 day trades a day | "No more than two or three" | – | `InpMaxPerSymbol` 3, `InpMaxOrders` 40, `InpMaxOpenRiskPct` 3%, hedging allowed | CONFLICT (C16) |
| Loss limits / streak | Pause only if on tilt | Fixed rules, no changes after a loss | Cut losses fast | – | Streak 2, daily 2%, weekly 4% | AGREE (user's rules) |
| Scale up slowly | Paper / tiny risk first | 10 → 100, not 1000; simulator first | – | – | – | AGREE |

### 2.12 Sessions, time of day and news

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Session | Pick one session (NY ~8:00 ET, London 1-2 ET) | First 45-60 min after the open are "golden" (up to ~2 h). Beginners skip the open | FXS: breakouts after 3 am ET work; at 5 pm ET they fail | – | `InpSkipAsian` false; `InpFridayCutUTC` 19 | CONFLICT (C19, mild) |
| News | Don't day-trade the news; wait for the spike and for spreads to settle. Never let news override a setup | News **into** a fresh level = trade it (bad news into demand = buy) | Keep stop orders in | – | Intraday pendings cancelled ±30 min; `InpTesterNews` false | CONFLICT (C9) |
| Rollover spread | Spread stop-outs around news (ZS:152) | Slippage on thin crosses | – | – | `InpMgmtMaxSpreadR` 0.25; no rollover cut | NEW |
| Seasonal | August / summer = low odds | – | – | – | None | NEW (minor) |

### 2.13 Cross-market (DXY, indices, VIX)

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| DXY | DXY zones / trendlines as context (VL:1640) | Euro at demand + DXY at supply = higher odds (p.386) | – | – | None | NEW |
| Index alignment | – | Time stock trades to S&P / NASDAQ levels; trading against them is "very low probability" | – | – | None | NEW (FX: DXY / XAU) |
| VIX | – | VIX at supply + index at demand → rally (and the reverse) | – | – | None | NEW (indices only) |
| Overnight / Globex high | – | Confluence for supply; the bull-trap trigger | – | – | None | NEW |

### 2.14 Psychology

| Rule | Kevin | Seiden | Baker (+FXS) | Raja (TBD) | Bot now | Verdict |
|---|---|---|---|---|---|---|
| Edge = many trades | Hundreds of trades, not a handful | Casino model; 50% wins at 3:1 is fine | Statistical edge (FXS) | – | `OnTester` needs N trades | AGREE |
| Who is on the other side | – | The novice's two (three) mistakes: buying after a rally, into supply, against the trend | FXS: "who is on the other side?" | – | – | AGREE (teaching) |
| Discipline | No revenge trades; patience | Rule-breaking = a belief conflict; plan, execute, walk away | Avoid emotional trading | – | Set and forget | AGREE |
| Hoping / wishing | – | – | FXS: hoping means following the herd | – | – | AGREE |
| Realistic returns / myths | 8-30% a year; "too good to be true" | 80% fail on education, then 80% of the rest on discipline | – | – | – | AGREE |

---

## 3. Conflicts, with a recommended default and an A/B plan

Each row below is a real disagreement. The recommended default is chosen to cut the losses seen in review (PF 0.37 on XAU Z3, many fast stop-outs, BE scratches counted as wins). Every option should exist as an input so it can be A/B tested.

| # | Conflict | Options (who) | Recommended bot default | A/B test |
|---|---|---|---|---|
| **C1** | **Break-even timing** | 1R (bot Z3 now) · ~2R (Kevin, high odds) · 3R or after T1 (Seiden) · trail at pivots, no fixed BE (Baker) · BE out of fear = error (FXS) | **Z3 / TopDown: 2.0R.** Breakout: keep 1R (it is a high-win, low-R:R method) | `InpBE_R` ∈ {0 off, 1, 2, 3}, plus a pivot trail. Log MFE / MAE and "touched entry after +1R" |
| **C2** | **Freshness: binary vs graded vs depth** | Any touch = void (bot, Kevin) · 1st / 2nd OK, 3rd no (Seiden early) · touches don't matter, ≥ 25% depth = void (Seiden late) · Kevin's grid: ~25% = mid, > 75% = void, count matters | Keep **fresh-only** for drawing (parity) | `InpMaxTests` = 1 together with `InpMaxPenFrac` = 0.25 (a shallow second touch is allowed) |
| **C3** | **Stop: volatility floor vs tight structural stop** | ATR floor 0.75 ETF ATR (review / bot) · wider on gold (Kevin) · 1-2 ticks beyond, skip if too big (Seiden, Baker; ATR stops rejected) | **Keep the floor on metals and oil.** On FX, test the Baker variant | `InpStopMode` 0 = widen to the floor, 1 = skip when the structural stop is below the floor or R:R to T1 < 3 |
| **C4** | **Minimum R:R** | 2 (bot `InpMinRR`, Kevin "by opportunity") · ≥ 3 to the first target (Seiden, Baker) · 5 for swing (Baker) · 1.5 for breakout (Kevin) | **`InpMinRR` = 3 for Z3 / Best**, measured to the **nearest obstacle** (ETF or HTF). Breakout stays 1.5 | 2 vs 3 vs 4 |
| **C5** | **Entry depth** | 5% in front of the proximal (bot, Kevin's "a little before") · at the proximal (Seiden) · deep, near the distal (Baker, counter-trend) | Keep 0.05 | `InpZ3Front` ∈ {0.05, 0, -0.25, -0.5}. Judge expectancy per **signal**, not per fill |
| **C6** | **Mid-move continuation zones (RBR / DBD)** | "Most powerful" (Kevin) · not quality, DBD is not supply (Seiden) · valid doji zone (Baker) | Keep CP zones on (Kevin is the primary mentor) | `InpCPMode` 0 = all, 1 = VP only, 2 = CP only. Report R by VP vs CP |
| **C7** | **Score sheet as a gate** | Rejected (Kevin) · 10-point gate + entry type (Seiden) · checklist (Baker) | Use the score to **rank and label** (ZoneVision), not to gate. Gate only in an A/B preset | `InpMinScore` ∈ {0, 8, 9, 10, 11} on 0-15 |
| **C8** | **Stacked levels** | ~50/50: take all / extreme only / skip the middle (Kevin) · an enhancer: enter at the upper level or scale in, stop above the top (Seiden) | Neutral (no score) | `InpStackBonus` +1, and `InpStackEntry` 0 = proximal zone / 1 = outer zone |
| **C9** | **News** | Don't day-trade the news; cancel and wait (Kevin) · news into a fresh level = take it (Seiden) | **Kevin**: cancel intraday pendings ±30 min. Turn `InpTesterNews` on in backtests | Keep / cancel pendings over news on H1 only |
| **C10** | **Counter-trend and sideways HTF** | Skip / half risk (Kevin; Best) · only at a fresh HTF level, quality + margin beat trend (Seiden) · strong zones, deep entry (Baker) · Z3 trades every zone now | **`InpZ3Bias` = true by default** (as TopDown) | Add `InpCTAtFreshHTF`: counter-trend allowed at half risk only when the zone sits inside a fresh opposing-trend HTF zone |
| **C11** | **Trend definition** | Trendline (Kevin) · S/D-level based, MAs secondary (Seiden) · HH / HL swings (FXS) | Keep the trendline bias (`InpTLBias`) | Optional swing-only bias. Steep-line exception `InpTLSteepATR` (FXS) |
| **C12** | **Base candle count** | 1-3, up to 5 (Kevin) · fewer is better, "3-6" rule of thumb (Seiden) · 3-6 OK for range breakouts (Baker) | Keep `InpMaxBase` 6 for drawing; score rewards ≤ 2 | 4 vs 6 (ZV + ZB together) |
| **C13** | **Broken zone flips** | Void (Kevin) · flip with 3 conditions (Seiden) · flip on the first pullback (Baker / FXS) | Off | `InpFlipZones` (Seiden's 3 conditions) |
| **C14** | **Gaps** | Not a zone (Kevin) · the strongest departure (Seiden, Baker) | Off (FX gaps are weekend-only) | `InpGapAsLeg` (count the gap in the leg-out) |
| **C15** | **Candle / offset triggers** | No candle patterns (Kevin) · any fixed trigger at the level (Seiden) · rejection candle (Baker) | Off | `InpEntryTrigger` 0 / 1 offset / 2 rejection candle |
| **C16** | **Positions and hedging** | One order at the nearest zone (Kevin) · 2-3 at a time (Baker) · bot: 40 orders, hedging | `InpMaxOpenPos` = 3, no hedging | Hedging on / off |
| **C17** | **Volume** | No volume logic (Kevin, Baker) · low volume at the base / turn, but above-average volume on the novice arrival (Seiden) | Off: FX tick volume is unreliable | ZV display-only tag first, then a score term |
| **C18** | **Old zones** | Lower odds (Kevin; removed ones) · old *fresh* levels are better (Seiden, Baker) | Keep 200 bars | `InpMaxZoneAge` 200 vs 1000 (ZV + ZB) |
| **C19** | **Time of day** | One session (Kevin) · first hour after the open (Seiden) · London breakouts yes, NY close no (FXS) | Metals: fills 07-17 UTC, rollover cut | `InpOpenBonus` (+1 score in the first 60 min) |
| **C20** | **Target method** | Fixed 3R (bot Z3) · opposing zone / runner (Kevin) · just before the nearest obstacle, three exits (Seiden, Baker) | Fixed 3R, but with the room check to the nearest obstacle | `InpTPMode` = obstacle vs fixed |

**The five conflicts that matter most:** C1 (BE at 1R), C3 (stop floor vs tight stop), C4 (min R:R 2 vs 3 to the nearest obstacle), C2 (freshness rule) and C10 (Z3 trading against the trend).

**Recommended A/B order** (one change per step, keep every report): baseline Z3 → C1 BE 2R → C4 R:R 3 + nearest-obstacle room → C10 bias on → score gate (C7) → C2 graded freshness → C5 entry depth → C3 stop mode.

---

## 4. Implementation list for ZoneVision + ZoneBot (top 15)

Every item is a **switchable input** so it can be A/B tested. Items that change which zones are *drawn* must go into ZoneVision (ZV) and ZoneBot (ZB) together (the parity rule). Everything else is a ZB trade filter plus a ZV label.

| # | Rule | Input(s) = default | Preset(s) | Expected effect | Effort |
|---|---|---|---|---|---|
| 1 | Break-even at 2R for Z3 (C1) | `InpBE_R` = 2 in Zones3R / TopDown .set (the input exists) | Z3, TopDown | Fewer BE scratches; average win toward 3R; honest win rate | S |
| 2 | Min R:R 3 to the **nearest** obstacle: an opposing ETF **or** HTF proximal between entry and target means skip | `InpMinRR` = 3; new `InpRoomETF` = true (extends `InpZ3NeedRoom`) | Z3, Best, TopDown | Removes "buying into supply" trades; fewer and better fills | M |
| 3 | Odds-enhancer gate, weighted as Seiden (departure, margin, big picture, freshness, time, arrival) | `InpMinScore` = 0 (A/B: 9); ZV shows the score on the label | Z3 A/B, Best | Ranks zones; drops the weakest third | S |
| 4 | With-trend default; counter-trend only at a fresh HTF zone at half risk (C10) | `InpZ3Bias` = true; new `InpCTAtFreshHTF` = false | Z3, TopDown | Fewer counter-trend losers; keeps Seiden's reversal trades as a test | S / M |
| 5 | Qualifying run-out: the first move away must reach ≥ N × zone height before the return | new `InpMinRunOutR` = 3 (0 = off); ZV label "run-out xR" | Z3, Best | Drops weak-imbalance zones (Seiden p.276) | S |
| 6 | Arrival quality: skip if a new opposing ETF zone formed on the way in; +1 for an impulsive arrival | new `InpArrivalClean` = true, `InpArrivalLegRatio` = 1.8 | Z3, Best | Fewer stair-step returns that slice through | M |
| 7 | Graded freshness / depth (C2) | new `InpMaxTests` = 0, `InpMaxPenFrac` = 0.25 (ZV + ZB) | Z3 A/B | More signals from shallow second touches; tests Seiden vs Kevin | M |
| 8 | Stop mode: widen to the ATR floor, or skip when the structural stop is too small (C3) | new `InpStopMode` = 0 (keep `InpZ3MinStopATR` 0.75, `InpZ3MinStopHTF` 0.25) | Z3, Best | Fewer 5-minute stop-outs on gold; tests Baker's tight stop on FX | S |
| 9 | Target just before the opposing level; obstacle targets T1 / T2 | new `InpTPMode` = TP_FIXED (A/B: TP_OBSTACLE), `InpTPFrontSpreads` = 1, `InpT1Part` = 0.5 | Z3, Best | More targets filled; structural exits | M |
| 10 | Score → entry type: top scores = limit; mid scores = leave-the-zone trigger (cancel if the stop trades first) | new `InpEntryByScore` = false, `InpLimitMinScore` = 11, `InpEntryTrigger` = 0, `InpConfOffsetFrac` = 0.05 | Seiden A/B preset | Fewer adverse-selection fills in momentum | M |
| 11 | Sessions, rollover and tester news | `InpSkipAsian` = true (metals), new `InpRolloverCut` = true (20:45-23:15 UTC), `InpTesterNews` = true | All | Backtests match live; no rollover-spread stop-outs | S |
| 12 | Origin freshness (look left): the base must not be a retest of an older zone (ZV + ZB) | new `InpOriginCheck` = false (A/B true), `InpOriginBars` = 1500 | Z3, Best | Removes "retest" zones mislabelled STRONG | M |
| 13 | Max open positions + no hedging (C16) | new `InpMaxOpenPos` = 3, `InpZ3Hedge` = false | Z3, Best, Breakout | Lower correlated drawdown; risk budget kept for the best zones | S |
| 14 | Entry depth test (C5) | `InpZ3Front` ∈ {0.05, 0, -0.25} (the input exists) | Z3 | Finds the best fill / R:R trade-off per symbol | S |
| 15 | Cross-market DXY confluence: +1 score when DXY sits at an opposing HTF zone (USD pairs, XAU) | new `InpXMarket` = false, `InpXSymbol` = "DXY" | Z3, Best | Higher-odds USD trades (Seiden p.386, Kevin's DXY context) | L |

**Also worth testing (parked):** refine oversized zones on a lower TF instead of rejecting them (`InpRefineBig`, L, ZV + ZB); flip zones (`InpFlipZones`, L); CP / VP mode (`InpCPMode`, S); stacked-level bonus (`InpStackBonus`, M); pivot-spacing trend health (M); round-number traps (`InpRoundTrap`, S); keep = enter pending re-check (`InpZ3Recheck`, S); zone age 1000 (S, parity).

**Evaluation rules** (from `SD_Strategy_Review.md`): at least 100 in-sample trades per preset per symbol; a walk-forward plateau; expectancy in R with a 95% CI; BE scratches counted apart from wins; stop-outs within 15 minutes kept under 10%.

---

## 5. Glossary

| Term | Meaning |
|---|---|
| **Proximal line** | The zone edge price reaches first: the top of demand, the bottom of supply. Usually the base body edge; the limit order sits just before it |
| **Distal line** | The far edge: the extreme wick of the base / leg. The stop goes just beyond it |
| **Base / basing** | The short pause (1-6 candles) before the move away. Candle body < 50% of its range = a basing candle (bot) |
| **Leg-in** | The move *into* the base. Fast is better (Baker) |
| **Leg-out / move away / departure** | The move *out* of the base. Its strength (`legRatio`, gap, big bodies) shows how big the imbalance was |
| **Stay-away candle** | The candle after the leg-out that does not come back to the proximal (Kevin's 3rd part) |
| **Space / gap (Kevin)** | The distance between the stay-away candle and the proximal; small = drawable only (`InpMinGap`) |
| **DBR / RBD** | Drop-Base-Rally (demand) / Rally-Base-Drop (supply): reversal zones, also called VP (valleys and peaks) |
| **RBR / DBD** | Rally-Base-Rally (demand) / Drop-Base-Drop (supply): continuation zones, also called CP |
| **Pivot vs cluster** | Seiden: a pivot (price could not stay) is a strong level; a cluster (long sideways block) is weak |
| **ETF / ITF / HTF** | Entry / intermediate / higher timeframe (e.g. 15m / H1 / H4) |
| **Curve** | Where price sits between the HTF demand and the HTF supply (0-100%). Buy low, sell high; the middle is equilibrium |
| **Equilibrium** | Balanced trading: no edge |
| **Profit margin** | Room from the entry to the nearest opposing level, in R |
| **Initial profit margin / run-out** | How far price ran from the zone before it first came back (Seiden's qualifying rule: ≥ 3 × the zone height) |
| **Fresh / tested** | Fresh = not revisited since it formed. Tested = price returned to the proximal |
| **Penetration depth** | How far a return went into the zone (0-100%). Seiden: ≥ 25% = done; Kevin: > 75% = void |
| **Motion into mass** | Seiden: each visit fills resting orders, so the level weakens until it breaks |
| **Removed** | A candle body (close) beyond the distal: the zone is void |
| **Emotional candle** | A candle with range > 3 × ATR; its wick does not test or remove a zone (bot) |
| **Chain / qualification** | Kevin: a zone counts only if its move removed an opposing zone or a trendline, or made an all-time high / low |
| **Arrival zone** | Kevin / drill: a zone that broke a trendline AND took out a high / low or a zone: the strongest |
| **Arrival (Seiden)** | How price comes back: sharp and base-free = good; stair-step = bad |
| **Liquidity trap** | An obvious S/R just before the zone, where retail stops sit and fuel the reaction |
| **Bull / bear trap** | Seiden: a breakout above an obvious high (e.g. the Globex high) into fresh supply, which is sold |
| **Levels on top of levels** | Two same-side zones stacked together (Seiden: stronger; Kevin: ~50/50) |
| **Odds enhancer** | A scored factor that raises the probability of a level (Seiden's sheet; bot `ZScore` 0-15) |
| **Set & forget** | Pending limit with stop and target placed in advance, then left alone |
| **Confirmation entry** | Wait for proof at the zone. Kevin: an opposing ETF zone / trendline removed. Seiden: a leave-the-zone trigger. Baker: a rejection candle |
| **Breakout entry** | A stop order through a level. Kevin: beyond the removed opposing zone. Seiden: prefers the return to the origin |
| **Flip / polarity** | A broken zone that switches side (old supply → new demand) |
| **Overextended / golden area** | Kevin's channel: from the trendline to its 50% line = golden; beyond 50% = overextended |
| **Look left** | Check older price for opposing levels (margin) or an older zone under the base (origin freshness) |
| **X-ray** | Seiden: inspect a big HTF zone on lower TFs to find its proximal / distal sub-levels |
| **Novice / two mistakes** | Buying after a rally AND into supply (a third mistake: against the trend). The S/D trader takes the other side |
| **All Star** | Seiden: S/D level + Bollinger Band pierce + trend context + margin; T1 = the BB midline |
| **R, BE, MFE / MAE** | R = initial risk. BE = stop moved to entry (+ costs). MFE / MAE = max favourable / adverse excursion of a trade |
| **Parity rule** | Repo rule: ZoneBot must trade exactly the zones ZoneVision draws, so drawing changes go into both |
