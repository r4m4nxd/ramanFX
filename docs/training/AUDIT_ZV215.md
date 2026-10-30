# ZoneVision 2.15 audit: why the MT5 chart does not match LEARNED.md

Scope: `public/tools/RamanFX_ZoneVision.mq5` (3651 lines) and `public/tools/RFX_ZoneCore.mqh` (4322 lines) at
`d9c90e4` (same bytes on `origin/main` `08b4dd8`), compared with the owner's rules in `docs/training/LEARNED.md`
and the canonical TS `supabase/functions/telegram-bot/zvReal.ts`. No code was changed. Every number below comes from
replaying the MQL logic (`tools/telegram_bot/parity/mql_port.py`, a line-by-line Python port of the MQL that the
conformance test `src/core/toolsStruct.test.ts` checks against zvReal.ts) on gold bars. The reproduction script is in
the appendix.

## 0. Data used, and the gaps in it

| set | what | limits |
|---|---|---|
| `origin/data:public/fx/d/metal.json` (XAUUSD) | ~80 bars per TF (MN 60, W1 52), last row still forming | MN starts 2021-10 and stops at 2026-09 (Oct missing); W1 starts 2025-10-25, stops at the 2026-10-17 week; D1 starts 2026-07-10, no 2026-10-30. The Apr-May 2025 W1 base is **not in it**. The 200-bar MT5 window cannot be reproduced. |
| `origin/data:qa/bars/XAUUSD/<TF>.json` (landed 2026-10-30 20:40Z, commit `08b4dd8`) | OANDA BID relabelled to Pepperstone server time (NY+7). MN 2006-, W1 2014-, D1 2018-, H4 2024-10-, H1 2026-04- | Not Pepperstone's own feed. Prices can differ by a few dollars, so any result that sits right on a threshold (the impulse test, the 0.38 retrace) could come out the other way on the owner's terminal. Loaded the way `RxLoad` loads bars (closed bars only, at most `RX_MAXB` = 460, phantom = the newest close). |

The owner's gold symptoms were reproduced on the qa/bars set: the STRUCTURE text, the D1 line from the top, the
missing realignment area, and the old-engine bias. The 80-bar set gives a **different** D1 line (Sep 3 -> Sep 18, the
one the owner drew), and that difference is itself defect 4.

## 1. Summary

| # | symptom | root cause | where | severity |
|---|---|---|---|---|
| D1 | `MN impulse down \| W1 impulse down` while 3M/MN are up | `zrPhase` reads each TF **on its own**, with no HTF input. Its trend is "the last two peaks and the last two valleys", so the swings inside an HTF correction flip the HTF trend. The TF stack stops after 4 TFs, so an H4 chart never sees 3M. | `RFX_ZoneCore.mqh:4289-4311`, `RamanFX_ZoneVision.mq5:767-787` | critical |
| D2 | `DIRECTION: LONG - FULL` / `Bias: UP - buys only` beside `STRUCTURE ... W1 impulse down` | Four engines write direction text, each from different pivots, lines, HTF pairings and windows. Bias and Direction read the **2.14 line engine**: its W1 down line was broken on 2026-08-01, so they read bullish. STRUCTURE reads the **2.15 engine**, which re-anchored a W1 down line that is still live, so it reads bearish. | see section 3 | critical |
| D3 | the realignment target (the HTF zone at the HTF up line, the owner's W1 purple 3250-3480) is not drawn | No code anywhere selects "the HTF zone near the HTF trend line". The arrival "realign" box is a same-TF opposite weak zone near an **old-engine** HTF line, and only appears after a current arrival. The zone engine cannot see a multi-candle sideways base. The 2.15 W1 up line (now **3274**, inside the owner's zone) is never drawn on D1 or H4. | `RFX_ZoneCore.mqh:3894-3932, 283-356, 1102-1119`; `mq5:1328-1336` | critical |
| D4 | the D1 down line starts AT the 4697 top (Aug 25) instead of Sep 3 4510 -> Sep 18 4399 | The impulse test ("the extreme is pivot 1 only if no impulse leaves it") runs only for the **window extreme**. With MT5's 200-bar window the extreme is the 2026-01-29 top at 5599.73, so the Aug 25 top enters through the branch "a peak beyond pivot 1", which has no impulse test. The acceptance test used an 80-bar window, where Aug 25 *is* the extreme. | `RFX_ZoneCore.mqh:4239` (TS `zvReal.ts:182`) | high |
| D5 | momentum lines missing, or not the owner's | Only the momentum line out of the **newest** real pivot is drawn. On gold W1 and D1 that pivot has none, so nothing is drawn, although the D1 top has one (Aug 25 -> Aug 28, broken Sep 17) and a live one exists (Oct 16 -> Oct 19). | `RFX_ZoneCore.mqh:4285`, `mq5:752` | medium |
| D6 | old 2.14 / v1 paths still active | HTF lines, bias, Direction, zone notes, the chain qualifier, arrivals, line-break alerts, the panel's `Structure:` row, ZoneBot `CoreEval` and the Telegram bot all use old pivots and lines. | section 6 | critical (structural) |
| D7 | results depend on the window | The structure state machine depends on its path and starts at "200 bars back". It was tuned and accepted on 80-bar windows, but MT5 uses 200 of 460 loaded bars. | `RFX_ZoneCore.mqh:4092, 4207` | high |
| D8 | STRUCTURE drops TFs silently; nothing is drawn on non-standard TFs | When an HTF fails to load it is skipped with no retry. On H2/H3/H6/H8/H12/M2.. charts `RxTfEnum` returns `PERIOD_CURRENT`, so nothing is drawn. | `mq5:776-777, 801`; `RFX_ZoneCore.mqh:4000-4005` | medium |
| D9 | pivots ignore zones (RBD / DBR) | partial by design, see 6 / D9 | `RFX_ZoneCore.mqh:4124-4168` | low |
| D10 | MQL issues (refresh, HTF-line mapping, labels, alerts) | see section 7 | | low to medium |

## 2. D1: structure labels are not top-down

### Evidence (qa/bars replay of RqRun, `mq5:764-787`)

```
H1 chart: STRUCTURE W1 impulse down  |  D1 impulse down  |  H4 range  |  H1 impulse down
H4 chart: STRUCTURE MN impulse down  |  W1 impulse down  |  D1 impulse down  |  H4 range      <- the owner's line
D1 chart: STRUCTURE 3M impulse up  |  MN impulse down  |  W1 impulse down  |  D1 impulse down
W1 chart: STRUCTURE 3M impulse up  |  MN impulse down  |  W1 impulse down
```

The owner's text `MN impulse down | W1 impulse down` is the H4 chart's line. Its first entry is MN because the stack
holds at most 4 TFs (`mq5:771`: `while(nt < 4 && x > 0)`). With the 80-bar set the D1 entry reads
`D1 correction (up) -> D1 down trend 4106.42`, and the line ends with the note
`correction trades only on H4 until 4106.42 (D1 trend down)`. That note points the trade the wrong way: it calls the
D1 bounce the correction to trade, while the owner's top-down rule makes the W1/D1 *fall* the correction.

Real pivots on MN (2.15 engine): `V 2024-02 1984, P 2026-01 5600, V 2026-03 4098, P 2026-04 4891, V 2026-06 3942,
P 2026-08 4697`. The engine reads LH 4697 < 4891 and LL 3942 < 4098, so `trend = -1`. The last pivot is a peak, so
`leg = -1`, which gives "impulse down". The MN impulse that started at the Feb 2024 low of 1984 has not been broken by
a close. Those swings are all **inside** the MN correction of the 1984 -> 5600 impulse: on the HTF they are the
"sideways pause" of LEARNED ("Fractal structure").

### Root causes

1. **There is no HTF input at all.** `zrPhase(RxSer &S, ZrRes &r, ZrPivot &piv[], ZrPhase &ph)`
   (`RFX_ZoneCore.mqh:4289`) sees one TF. `RqRun` calls it once per TF (`mq5:779-780`) and only joins the strings
   (`zrPhaseText`, `:4314`). LEARNED says "classify each TF's current leg as impulse / correction **relative to its
   HTF**". That rule is not implemented anywhere, in the MQL or in zvReal.ts (`zrTopDown` only joins the per-TF texts
   and notes).
2. **The trend flips on swings inside a correction.** `:4297-4302` takes the trend from the last 2 peaks and the last
   2 valleys. A correction that makes one LH and one LL turns the HTF "down". LEARNED: "The HTF keeps making HH/HL. Its
   CORRECTIONS ... on the HTF they look like a sideways pause."
3. **The correction target is the TF's own line** (`:4307-4310`, the live trend line or the last HL/LH of the same
   TF), not the HTF line or zone. LEARNED: correction trades end "at the HTF trend line or the HTF zone near the trend
   line".
4. **The stack is truncated.** It holds the chart TF plus 3 (`mq5:771`), so H4 never reaches 3M and H1 never reaches
   MN. "The biggest picture gives the direction" cannot hold on the charts the owner trades.
5. **The note comes from the own-TF phase** (`mq5:782-783`), so it inherits causes 1-3. The chart TF (i = 0) never
   gets a note.

### Fix

Prototype tried on the qa/bars set; it is not in the code:

```
3M up trend | MN correction (down) of 3M up | W1 correction (down) of MN up -> ends at the W1 up line 3274
(2023-09-30 1810 -> 2024-02-10 1984) | D1 impulse (down) of W1 down | H4 impulse (down) of D1 down
```

The W1 up line at 3274 lies inside the owner's purple W1 zone (~3250-3480). That is his realignment target.

Pseudo-diff (MQL; mirror it in zvReal.ts first, it is the canonical copy):

```diff
 // RFX_ZoneCore.mqh RFX_STRUCT
+struct ZrTrend { int trend; bool hasProt; int protBar; double protP; datetime protT; };
+// trend over the real pivots (oldest first): HH + HL -> up, LL + LH -> down. Protected pivot = the valley before the
+// newest HH (up) / the peak before the newest LL (down) = the origin of the last impulse. The trend holds through
+// every swing inside a correction until a CLOSE beyond the protected pivot (then 0 until a new HH + HL / LL + LH).
+void zrTrendState(RxSer &S, ZrPivot &piv[], ZrTrend &o)
+  {
+   o.trend = 0; o.hasProt = false; int lastConf = S.n - 1;
+   for(int k = 0; k < ArraySize(piv); k++)
+     {
+      if(o.hasProt) for(int j = MathMin(lastConf, o.protBar - 1); j >= piv[k].conf; j--)
+         if(o.trend > 0 ? S.C[j] < o.protP : S.C[j] > o.protP) { o.trend = 0; o.hasProt = false; break; }
+      // up = last 2 peaks rising and last 2 valleys rising (dn mirrored), as now
+      if((o.trend == 0 && up) || (o.trend < 0 && up && piv[k].t > 0 && piv[k].p > o.protP) || (o.trend > 0 && newHH))
+         { o.trend = 1; protect(the newest valley older than the newest HH); }
+      else if(mirrored) { o.trend = -1; protect(the newest peak older than the newest LL); }
+      lastConf = piv[k].conf;
+     }
+   if(o.hasProt) /* closes from lastConf to shift 1 */ ...;
+  }
 void zrPhase(RxSer &S, ZrRes &r, ZrPivot &piv[], ZrPhase &ph)
   {
-   int trend = 0; ... last-two-peaks / last-two-valleys ...
-   if(trend > 0 && S.C[1] < piv[vl1].p) trend = 0;
-   if(trend < 0 && S.C[1] > piv[pk1].p) trend = 0;
+   ZrTrend ts; zrTrendState(S, piv, ts); int trend = ts.trend;   // own structure, never flipped by a correction
    ... leg, own phase as now (own phase = "with / against its own trend", kept for the tooltip only)
   }
+// TOP-DOWN (new): phases[] highest TF first. The phase of a TF = its leg against the trend of the NEAREST HTF that has
+// one. The target of a correction = the live zr line in that HTF direction which belongs to the impulse being corrected
+// (its pivot 2 at / after that HTF's protected pivot), searched from the HTF down to this TF, plus the fresh HTF-side
+// zone overlapping / nearest that line now (section 4).
+void zrTopDown(ZrTf &tf[], int n) { for(i...) { h = nearest higher with tf[h].ts.trend != 0;
+     tf[i].rel = tf[i].leg == tf[h].ts.trend ? 1 : 2; if(tf[i].rel == 2) tf[i].target = zrImpulseLine(tf, h, i) ...; } }

 // RamanFX_ZoneVision.mq5 RqRun
-      int tfs[4]; int nt = 0, x = m;
-      while(nt < 4 && x > 0) { tfs[nt++] = x; x = RxHigherTf(x); }
+      int tfs[8]; int nt = 0, x = m;
+      while(nt < 8 && x > 0) { tfs[nt++] = x; x = RxHigherTf(x); }      // always up to 3M: the biggest picture decides
 ...
-         bool ok = i == 0 ? true : RxLoad(_Symbol, tfs[i], 0, H);
-         if(!ok) continue;
+         bool ok = i == 0 ? true : RxLoad(_Symbol, tfs[i], 0, H);
+         if(!ok) { gRqMissing = true; line += " | " + RxTfName(tfs[i]) + " loading"; continue; }   // RqTick retries while gRqMissing
 ...
-      line += zrPhaseText(RxTfName(tfs[i]), ph, _Digits);
-      if(ph.phase == 2 && i > 0 && note == "") note = "correction trades only on " + ...
+      // after the loop: zrTopDown, then e.g. "W1 correction (down) of MN up -> W1 up line 3274 / W1 demand 3250-3480";
+      // note for the chart: "MN/3M up: W1 is correcting. Sells only on the LTF (D1 / H4) until 3274 / 3250-3480;
+      // buys there after an LTF arrival" (LEARNED: trade with the HTF impulse, correction trades on the LTF only)
```

Tuning check before merge: run the protected-pivot trend on the owner's charts. On AUDUSD W1 the owner wrote
"sideways (no HH or LL forming)", while this rule says "up trend, protected low 0.68328 intact". Both can be true if
the output reads `W1 up - sideways pause (correction) between HL x and LH y`. An "impulse" then needs a new extreme
(or the correction's own LTF line broken), not merely "the last pivot is a valley". Score it with
`src/core/trainingFixtures.test.ts`.

## 3. D2: two (four) contradictory direction panels

### Every place that writes bias / direction / structure text

| text on chart | writer (file:line) | source of truth | pivots / lines it reads | HTF pairing |
|---|---|---|---|---|
| `Bias: UP - buys only` (Comment panel) | `Panel` `mq5:1453` | `gTrend` | `HtfTrend` 2-bar fractals (`RFX_ZoneCore.mqh:1197`), overridden by `TLBias` (`:818`, the **newest broken old-engine HTF line of any age**, `mq5:1337`) | `HtfOf`: H1->D1, H4->W1, D1->MN, W1->none (`RFX_ZoneCore.mqh:181`) |
| `Trendline bias: UP - W1 downtrend trendline broken on ...` | `Panel` `mq5:1456` | `gHBiasTxt` | old `TwoPivotLines` on `HtfOf` | `HtfOf` |
| compact `Bias:` + `why:` rows, header colour | `DrawCompact` `mq5:1568-1572, 1596` | `gTrend` | same | `HtfOf` |
| `Structure: uptrend (trendline intact)` | `Panel` `mq5:1454`, `DrawCompact` `:1572` via `StructureNow` (`RFX_ZoneCore.mqh:854`) | old chart-TF `TL[]` (hidden from the chart since 2.15 but still computed) | old ZigZag + TwoPivotLines | chart TF |
| bias arrow `RFXV_bias` | `Panel` `mq5:1534-1545` | `gTrend` | as Bias | `HtfOf` |
| zone notes `with / against the HTF trend` -> verdict STRONG/WEAK -> grade | `ZoneNotes` `RFX_ZoneCore.mqh:1012` | `gTrend` (`InpBiasSource = 0`, `mq5:161`) | as Bias | `HtfOf` |
| `Bot: watching ... no trade: against HTF bias` | `Panel` `mq5:1486-1487` | `gTrend` | as Bias | `HtfOf` |
| `DIRECTION: LONG - FULL` + rows `HTF 3M UP ...` + reasons | `DirCombine` `RFX_ZoneCore.mqh:1654-1727`, drawn by `DrawDirBox` `mq5:1615` / `DirComment` `:1648` | `gDir`, `gDirQ`, `gDirHead` | per row: `HtfTrend` (S), the newest cross of the **old** lines (T), opposite zones removed (R), `Detect` zones (L, C), Raja curve | `DirTable` with `InpDirTable = 1` (Kevin L4): H1->H4/D1(+MN), H4->D1/W1(+3M), D1->MN/3M(+6M), W1->MN/3M(+12M) (`:1344`) |
| click box DIRECTION section | `DirPopRows` `mq5:1658` | `gDir*`, curve | as Direction | DirTable |
| alert tails `DIR LONG FULL`, Direction-change alerts | `V2DirShort` `mq5:1803-1807`, `DirAlert` `:1758` | `gDir` | as Direction | DirTable |
| ZoneBot export `RFX2|sym|tf|h|dir` | `V2ExportGV` `mq5:2555` | `gDir` | as Direction | DirTable |
| `STRUCTURE 3M impulse up \| MN impulse down ...` + note | `RqRun` `mq5:785-786` | `zrPhase` | **2.15** real pivots / zr lines | `RxHigherTf`: H1->H4->D1->W1->MN->3M, at most 4 (`RFX_ZoneCore.mqh:3803`) |
| `ARRIVAL D1: ...`, `REALIGN area (W1 line ...)` | `RxaDraw` `mq5:558-653` | arrival engine | **2.14** `zvLines` / `zvPivots` | `RxHigherTf` (D1->W1) |
| ZoneBot's own reading (`CoreEval`) | `RFX_ZoneCore.mqh:3356-3440` | v1 `gTrend` + TLBias | Kevin v2.12 lines (`ZvTwoPivot = false` in ZoneBot) | `HtfOf` |
| Telegram bot / web scanner `states` / `dirs` | `arrival.ts` -> `zvTrend.zvLines`; `tools/stock_scanner/zones.py` | TS/Python ports of the old engines | 2.14 | their own |

### Why they disagree on gold (qa/bars replay)

W1 lines:

| engine | live W1 down line | last broken W1 down line |
|---|---|---|
| 2.14 (`zvLines` = TwoPivotLines rule; arrival, TLBias, Direction T) | **none** | 2026-02-28 5419 -> 2026-05-09 4773, broken by a close on **2026-08-01** |
| 2.15 (`zrLines`; the STRUCTURE label and the black lines) | **2026-02-28 5419 -> 2026-08-22 4697 (live, now ~4437)** | 2026-02-28 5419 -> 2026-04-11 4891, broken 2026-05-02 |

How each text follows from those lines:

- H4 chart, Bias: `HtfTrend(W1) = -1`, then `TLBias` takes the newest broken old W1 line. That is the down line
  broken on Aug 1, so `gHBias = +1` and the panel shows `Bias: UP - buys only` plus
  `Trendline bias: UP - W1 downtrend trendline broken on 2026.08.01`.
- D1 chart, Bias: `HtfTrend(MN) = 0`. The newest broken old MN line is the 2012 -> 2018 **down** line, broken in
  **Jan 2019**, so the panel shows `Bias: UP`. The reason is seven years old.
- W1 chart, Direction, derived by hand from the replayed inputs (DirEvalTF / DirCombine have no Python port, so the
  final string is not reproduced numerically):
  - HTF 3M: S = +1 and no old line was crossed, so TREND UP.
  - ITF MN: S = 0. The newest cross is the old MN down line, broken Jan 2019 (T = +1), and the old MN up line is live,
    so TREND UP.
  - ETF W1: S = -1 and T = +1 (Aug 1 break), so CHANGED UP or PULLBACK. Both count as the +1 side.
  - Rule 3 gives side +1. Rule 5 does not fire (the ITF is not pulling back). Rule 6 is met (the ETF is on the side).
  - Result: `DIRECTION: LONG - FULL`. The same chart prints `STRUCTURE 3M impulse up | MN impulse down |
    W1 impulse down`.

Neither text is the owner's reading. The owner says "long side (3M/MN up). W1 is **correcting**: no W1 longs until
price reaches the W1 up line / zone 3250-3480. Sells are allowed only on the LTF until then." Direction says FULL,
which means trade longs now. STRUCTURE says the MN/W1 trend is down.

### Fix

Interim, inside 2.15:

- When `InpRealPhase` is on, `DrawDirBox` and the `Bias` rows show the top-down verdict computed in section 2, and
  label the old engines `(v1)` in the tooltip only.
- `InpTLBias` defaults to false. Its bias comes from a line of any age, from the engine the owner rejected.
- `ZoneNotes` reads the top-down verdict (`InpBiasSource` is replaced by it).

Clean fix: section 9.

## 4. D3: the realignment target is never detected or drawn

The owner's target is the HTF zone nearest the HTF up trend line: for gold, the W1 purple zone ~3250-3480 (the
Apr-Sep 2025 base). The 2.15 W1 up line (2023-09-30 1810 -> 2024-02-10 1984) is at **3274** now, inside that zone.

Why it is not on the chart, in order:

1. **No code implements "the HTF zone near the HTF trend line".**
   - `zrPhase` returns a price, the TF's own line or last HL (`RFX_ZoneCore.mqh:4307-4310`). That price only reaches
     the STRUCTURE note.
   - The arrival engine's REALIGN box (`arrArrivalTf`, `:3894-3932`) is a different idea. It is the **same-TF**
     opposite "weak" zone nearest the HTF line, and it exists only when the chart TF has a current (not removed)
     arrival (`:3900-3903`) and the HTF has a live old-engine line against that arrival (`:3906-3916`). HTF zones
     (`R.hz`) are used only to extend the TP and to host the stop (`:3942-3961`).
   - Replay: no W1, D1 or H4 arrival is current (D1 has 1 arrival, already removed). The old W1 and MN lines have no
     live line in the needed direction, so `hasLN = false` and no realign area can exist on any chart.
2. **The 2.15 HTF lines are never drawn on a lower TF.** `RqRun` draws only the chart TF's lines (`mq5:745-753`). The
   gold-dotted HTF lines come from the **old** engine (`Trendlines` for `StepUp(CTF, 1..InpHTFLevels)`,
   `mq5:1328-1336`). With `ZvTwoPivot` a broken HTF line is not drawn (`RFX_ZoneCore.mqh:703`).
   - On a D1 chart the only HTF line left is the old MN 2015 -> 2018 up line (now ~1508).
   - Neither the W1 up line at 3274 nor the live W1 down line (~4437) is visible.
3. **The zone engine cannot see the base.** The W1 candles from Apr 19 to Aug 23 2025 alternate: basing 0.05, drop
   0.56, basing 0.44, drop 0.59, rally 0.88, ... (body/range ratios).
   - `Detect` (`:283-356`) and `zcDetect` (`:3725-3770`) need *consecutive* basing candles (body < 50% of range, at
     most 6) right before a leg-out whose range is at least 1.2 times the largest base candle (`:294-297`, `:3735-3740`).
   - The real leg-out (Aug 30 2025) is preceded by rally candles, so the base length is 0 and no zone forms.
     `Aug 2` has 4 basing candles before it but its range is only 0.54 times the largest one. The tiny DBR 3293-3309
     (Jun 2025) was removed on Jun 21.
   - Replay, W1 fresh demand zones below price: `1810-1847, 2471-2512, 2657-2702, 2730-2796, 2956-3093, 3626-3685`.
     **Nothing between 3093 and 3626.**
   - The whole sideways base, by bodies about 3204-3446 (wicks 3120-3500), is about 1.6 ATR tall and would also fail
     `InpMaxZoneATR = 1.5` (`:316`).
4. **The HTF zone band shows the 2 zones nearest price, of `HtfOf` only** (`DrawZones(HZ, true)`, `:1104, 1119`).
   - W1 zones appear only on an H4 chart. D1 charts show MN zones; W1 charts show none.
   - "Nearest to price" is not "nearest to the HTF line".
5. The LEARNED rule "RBR / DBD = CP levels" is not applied as a filter (`cont` only names the zone), so the base not
   being RBR is not the cause. The cause is that the base is a sideways *range*, not a short tight base.

### Fix (pseudo-diff)

```diff
+// one zone engine (zones.mqh): + RANGE BASES for HTF use. A base = the longest run of candles (any colour) before the
+// leg-out whose bodies stay inside [bLo, bHi], bHi - bLo <= RB_MaxATR (2.5) x ATR, >= 3 candles; the leg-out = the
+// first close beyond bHi (demand) by >= RB_Leg x ATR, followed by a stay-away. proximal = bHi, distal = the run's
+// lowest low (option: lowest body). Gold W1 Apr 19 - Aug 23 2025 -> ~3204-3446 (bodies) / 3120 (wick); tune the
+// trim on the owner's marked zones.
+// REALIGNMENT TARGET (top-down model, section 2): for a TF in a correction of HTF h, line = zrImpulseLine (the live
+// h-direction line whose pivot 2 is at / after h's protected pivot, from h down to this TF), value v = line now;
+// zone = the fresh h-side zone of h or of the line's TF that contains v, else the one with the smallest gap to v
+// (RxGap(v, z)), within 1 ATR of that TF.
+// draw on every LTF chart: the line (mapped by time, section 7.3) + the zone (bold gold box, "REALIGN W1 up line
+// 3274 / W1 demand 3204-3446: W1 correction ends here; LTF arrival to buy").
-   if(hasLN && P.nWeak > 0) ... P.realign = same-TF weak zone nearest the HTF line   // arrival engine
+   P.realign = topDown.target zone (the same object as above); arrivals only confirm it on the LTF
```

## 5. D4: the D1 down line starts AT the top

### Evidence (qa/bars, 460 closed D1 bars, 200-bar window from 2026-01-22)

```
2.15 live D1 down line : 2026-08-25 4696.81 -> 2026-10-16 4198.96   (pivot 1 = the top)
trace                  : dn pivot 1 <- 2026-08-25 4696.81  [new pivot 1 via "a peak beyond pivot 1" - no impulse test]
                         window extreme = 2026-01-29 5599.73
with the 80 published bars (window from 2026-07-10, extreme = Aug 25): 2026-09-03 4510.64 -> 2026-09-18 4399.48
```

Window sweep with the published D1 plus older bars synthesised from W1: the line depends on where the window starts.

| window | window top | D1 down line (2.15) |
|---|---|---|
| 79 bars | Aug 25 | 09-03 4511 -> 09-18 4399 |
| 120 bars | May 12 | 08-25 4697 -> 10-16 4199 |
| 135 bars | Apr 21 | 04-21 4833 -> 08-25 4697 |
| 139 bars | Apr 16 | 04-15 4891 -> 08-25 4697 |
| 200 bars | Jan 27 (5600) | 04-15 4891 -> 08-25 4697 |

### Root cause

`zrLines` (`RFX_ZoneCore.mqh:4220-4271`, TS `zvReal.ts:170-205`) sends a candidate pivot 1 through three doors:

| line | door | impulse test? |
|---|---|---|
| `:4224-4237` | the window extreme (`extBar`) becomes `pend`, and `zrImpulse` decides at `:4229-4233` | yes |
| `:4239` | `!hasP1 \|\| !zrOut(d, p1.p, piv[k].p)`: a peak beyond pivot 1 (a higher high than pivot 1) | **no** |
| `:4239` | `hasLast && liveIdx < 0 && zrOut(d, piv[k].p, lastB.p)`: beyond the broken line's pivot 2 | **no** |

LEARNED: "The extreme CAN be pivot 1 when the next anchor is a real pivot after a proper swing ... It is NOT used
when the move right after it is just the impulse (gold D1: top Aug 25 skipped, line from the first lower high Sep 3 ->
Sep 18)". It also says: "Down line after a higher high: starts at the first lower high right after the top".

Every top that starts a new structure is "the extreme" in the owner's sense. The code applies the test only to the
extreme of an arbitrary 200-bar window. On MT5 that window holds the Jan 2026 top (5599.73), so the Aug 25 top (a HH
over the July lower highs 4166 and 4120) enters through door 2 and becomes pivot 1, even though `zrImpulse` is true
for it.

A second, related gap: "structure ended" is tested against `lastB` (pivot 2 of the last line, which can be months
old), not against the previous real peak. In the 200-bar case the Aug 25 HH therefore merely re-anchors the April line
(`04-15 4891 -> 08-25 4697`).

The acceptance check that LEARNED cites ("keeps gold D1 ... live Sep 3 -> Sep 18") ran on the 80-bar fixture
`tools/telegram_bot/parity/xauusd_d1_2026-10-29.json`, where Aug 25 is the window extreme, so it never exercised doors
2 and 3.

### Fix (tested on a scratch copy)

```diff
 // RFX_ZoneCore.mqh zrLines (TS zvReal.ts:180-182 the same)
+      ZrPivot prevP; bool hasPrev = false;            // the previous real pivot of this kind (peak for down lines)
 ...
-            if(piv[k].bar == extBar) { pend = piv[k]; hasPend = true; continue; }
+            if(piv[k].bar == extBar) { pend = piv[k]; hasPend = true; prevP = piv[k]; hasPrev = true; continue; }
             if(!zrOut(d, extP, piv[k].p)) continue;
-            if(!hasP1 || !zrOut(d, p1.p, piv[k].p) || (hasLast && liveIdx < 0 && zrOut(d, piv[k].p, lastB.p)))
-              { kill; p1 = piv[k]; hasP1 = true; nSeen = 0; hasLast = false; continue; }
+            bool hh = hasP1 && (!zrOut(d, p1.p, piv[k].p) || (hasLast && liveIdx < 0 && zrOut(d, piv[k].p, lastB.p))
+                                || (hasPrev && zrOut(d, piv[k].p, prevP.p)));   // a higher high = a NEW structure
+            prevP = piv[k]; hasPrev = true;
+            if(hh) { kill(piv[k].bar); hasP1 = false; nSeen = 0; hasLast = false; pend = piv[k]; hasPend = true; continue; }
+            if(!hasP1) { kill(piv[k].bar); p1 = piv[k]; hasP1 = true; nSeen = 0; hasLast = false; continue; }
```

The new top waits for the same `zrImpulse` test as the window extreme (`:4229`). If an impulse leaves it, pivot 1
becomes the first lower real peak after it (the existing `!hasP1` door).

Results:

- Gold D1 is window-independent: **2026-09-03 4510.64 -> 2026-09-18 4399.48** for windows of 79, 120, 135, 136, 139,
  200 and 259 bars, and on the qa/bars MT5 window. This is the owner's drawing. The TS copy gives the same line.
- `trainingFixtures.test.ts` on the owner's AUDUSD marks:

  | measure | before | after |
  |---|---|---|
  | pivots | 78% | 78% |
  | lines | 23% | 22% (precision 30% -> 27%) |
  | per-chart overall | D1 66, H4 24, MN 54, W1 30 | unchanged |
  | regression floor | passes | passes |

- AUDUSD H4 gains one up line. Its breaks land on bars 40 and 72; the owner's breaks are on 39 and 72.

Regenerate the conformance fixtures and LEARNED's table after porting.

## 6. D5-D9: everything else that makes the drawings differ from LEARNED

### D5 momentum-line selection

`zrLines` keeps every momentum line in `hist` but returns only the one out of the **newest** real pivot
(`RFX_ZoneCore.mqh:4285`), and `RqRun` draws only `r.mom` (`mq5:752`). On gold W1 and D1 the newest pivots have no
impulse leg, so **no momentum line is drawn**. The D1 hist does contain the top's line (Aug 25 4697 -> Aug 28 4631,
broken Sep 17) and a live one (Oct 16 -> Oct 19).

LEARNED: the momentum line runs from the **extreme of a leg**, and its break ends the impulse. Fix: draw the
momentum line of the current structure's extreme (faint once broken), plus any live momentum line. Keep `hist` for the
Train page.

### D6 old code paths still active next to RFX_STRUCT (2 to 5 sources of truth)

| path | still drives | file:line |
|---|---|---|
| ZigZag (Kevin "real peak" = 2-bar swing + HH/LL) + `TwoPivotLines` (2.14 "the top is never a pivot", which contradicts LEARNED's "the extreme CAN be pivot 1") | the HTF lines drawn on every chart (`InpShowHTFLines = true`, `InpHTFLevels = 4`); `gUp*/gDn*/gH*` used by `CrossNeeded`, `NearTrendline`, `Overextended` (zone notes, channel rows); the `Qualify` "removed trendline" chain qualifier (with `InpOnlyQualified = true` it decides which zones are drawn); `StructureNow`; `TLBias` | `RFX_ZoneCore.mqh:362-377, 569-623, 638-795, 797-865, 867-902`; `mq5:1326-1340` |
| hidden old chart-TF lines still alert | `ZvBreakAlert` and the `InpAlertTL` block run for chart-TF old lines that are no longer drawn (`gRsHideOld` only skips `ObjectCreate`). The owner gets "D1 downtrend trendline broken" alerts for lines he cannot see, and **no** alert when an RFX_STRUCT line breaks. | `RFX_ZoneCore.mqh:703, 739, 765-772, 625-636` |
| `HtfTrend` fractal swings (2 bars each side, first 2 highs / lows from shift 3) | `gTrend` (Bias, zone notes), the Direction S input | `:1169-1213, 1517` |
| Direction engine | `DIRECTION:` box, alerts, export, Seiden lens D1 side (`gLensD1`, `:2263`) | `:1998-2037, 1507-1577, 1654-1727` |
| arrival engine (`zvPivots` / `zvLines` / `zvMomentum`, 2.14) | arrivals, the arrival trend line (`RXA al`, `mq5:583`), REALIGN, plan, LTF confirmation, arrival alerts | `:3553-3715, 3836-3992` |
| two zone engines | `Detect` (v1: wick removal by default, no 7-candle rule) for the drawn zones and Direction; `zcDetect` (`RxParamsFX`: close-only removal `removal_mode = 1`, `base_strict`) for arrivals. One zone can be removed in one and fresh in the other. | `:283, 3725, 3485-3486` |
| two 3M builders | `VBuild` (forming quarter = bar 0, Wilder ATR, needs 60 MN bars) for Direction; `RxLoad(RX_Q)` (closed quarters only) for STRUCTURE | `:86-137, 4027-4053` |
| ZoneBot | `CoreEval` = v1 bias + Kevin v2.12 lines (`ZvTwoPivot = false`) | `:3356-3440` |
| Telegram bot / web | `arrival.ts` imports `zvTrend.zvLines` (2.14); the zvReal.ts header says the bot is unchanged "until the owner approves this on MT5" | `supabase/functions/telegram-bot/arrival.ts:65` |
| MQ4 and Pine copies | `RamanFX_ZoneVision.mq4`, `RamanFX_ZoneVision*.pine` (not audited; they hold the old engine) | |

Pivot definitions in use: (1) ZigZag, (2) `zvPivots`, (3) `zrPivots`, (4) `FracUp`/`FracDn`, (5) `DnaFrac` /
`RjB_Sideways`, (6) `SwingAt` (traps).

HTF pairings in use: `HtfOf`, `StepUp`, `DirTable` (4 tables), `RxHigherTf`.

### D7 window dependence

| engine | window |
|---|---|
| RFX_STRUCT | 200 bars (`RS_Look`, `:4092`, no input) out of 460 loaded (`RX_MAXB`) |
| old lines | `InpLookback` 200 of all history |
| `HtfTrend` | 300 bars |
| `Curve` | 100 bars |
| v1 3M | 400 buckets |

The structure state machine depends on its path: its first extreme is "whatever is 200 bars back". MN's 200-bar window
starts in 2010, so the MN up line comes from the 2015 bottom (now ~1508), while the 60-bar set gives 1810 -> 1984
(~3374). The tests (marks, the gold D1 acceptance chart, random charts) use 50-80 bar windows, so MT5 behaviour was
never tested.

Fix: start each TF's structure at a meaningful anchor (the HTF's protected pivot, at least N bars before it) and run
conformance on qa/bars windows equal to MT5's.

### D8 coverage and loading

- `RqRun` skips an HTF whose `RxLoad` failed (`mq5:776-777`) without telling anyone. `RqTick` retries only when the
  chart TF's own label is missing (`:801`), so a 3M or MN that is still downloading disappears from STRUCTURE until
  the next chart-TF or HTF bar.
- `RxTfEnum` maps only M1/M5/M15/M30/H1/H4/D1/W1/MN (`RFX_ZoneCore.mqh:4000-4005`). On H2/H3/H6/H8/H12/M2.. charts
  `RxLoad` returns false: RFX_STRUCT draws nothing and retries 30 times per bar.
- `RxHigherTf(30) = 0`: an M30 chart gets no top-down.
- `RxLoad` refuses on any zero time / non-positive high in the 460 bars (`:4023`), so one bad bar hides everything.

### D9 zones are not used for pivots (partial by design)

LEARNED ("Pivots come from REVERSAL zones"): RBD = peak, DBR = valley; RBR/DBD = CP. `zrPivots` (`:4124-4168`)
approximates this with the 0.38 retrace or the return to the origin candle. LEARNED's "Choices" records that using
zone bases made W1/H4 worse. The pivot tooltips ("REAL peak (RBD ...)", `mq5:765`) claim an RBD without checking that
one exists.

## 7. MQL-specific checks (exhaustive pass)

1. **Series indexing: correct in RFX_STRUCT.**
   - `RxLoad` fills shift i from `iOpen/iHigh/iLow/iClose/iTime(sym, tf, i)`, i = 1..n (series order), with the
     phantom at 0 (`RFX_ZoneCore.mqh:4016-4025`).
   - `VBuild` reads `CopyRates` into a non-series array, oldest first (`:92`), and indexes it that way.
   - `RqDrawLine` bounds-checks `a`, `b` and `brokenAt` (`mq5:723`). `zrAt(t, -3)` extends 3 bars into the future,
     which is valid on an MT5 chart.
   - The Python port raises on any out-of-range index and passes 240+ charts, so no off-by-one was found in this block.
2. **Other-TF reads with unloaded history: partial.**
   - `RxLoad` checks `iBars` and each bar, but callers swallow the failure (D8).
   - `DataReady` (`mq5:884`) waits only for TFs with ATR handles (chart, `HtfOf`, `StepUp` levels, Direction stack),
     not for every TF RqRun reads.
   - `ChartBarIn` (`RFX_ZoneCore.mqh:474-490`) returns -1 when the chart history does not reach an HTF anchor. The
     HTF line then falls back to HTF bar times.
3. **HTF line drawn vs HTF line used.**
   - `OBJ_TREND` is drawn straight in *chart-bar* space.
   - `gHUp*/gHDn*` (`mq5:1311-1315`), used by `NearTrendline`, `CrossNeeded` and `Overextended`, are evaluated in
     *HTF-bar* units through `iBarShift(gTF, cT(0))` (`RFX_ZoneCore.mqh:804-809, 832-837, 842-847`).
   - A W1 or MN line on a D1 chart (weeks of 4-5 D1 bars, months of 20-23) is therefore not at the price the notes
     use.
   - The rebuild should evaluate an HTF line at chart bar j by the time of j: HTF shift = `iBarShift(htf, time(j))`
     plus the fraction of that HTF bar elapsed. Draw it from those values.
4. **Recalculation only on new bars.**
   - `Redraw` runs only when a chart bar or an `aTf` HTF bar opens (`mq5:1290-1309, 893-898`). `RqTick` and `RxaTick`
     also wait for bar opens.
   - On a W1 chart the Direction curve, the "inside HTF zone" lock and the zone verdicts can be up to a week old.
     The 5-second refresh (`:1294`) re-renders stored strings with a live `Mid()`.
   - HTF readings use `RxLoad(..., 0, H)`, so the phantom is the last close and the forming HTF candle is ignored.
     That is fine for close-based breaks, but say so in the text.
5. **Object lifecycle.**
   - `RqRun` and `RxaRun` delete their prefixes and recreate everything. That is correct.
   - The hidden old chart-TF lines still run `ObjectSet*` on missing objects (error 4202, harmless) and still alert
     (D6).
   - `LblApply` runs at the end of `Redraw` (`mq5:1363`), before `RxaTick` and `RqTick` create their texts, so
     `Labels: OFF` does not hide `RFXV2_Qmomt` or the arrival texts. `RFXV2_Qph` / `nt` are `OBJ_LABEL`, which
     `LblApply` skips.
   - Fixed prefixes with no instance id: two ZoneVision copies on one chart delete each other's objects.
6. **Name collisions across TFs.**
   - Old HTF lines carry the TF in the name (`tlH<tf>_<i>`).
   - RFX_STRUCT names (`RFXV2_Qup/dn/upx/dnx/mom/p<i>/ph/nt`) carry no TF, but only the chart TF is drawn.
   - No prefix collides with `RFXV2_d/P/c/W/jB/t/m/A`. The prefix `RFXV2_Q` is only deleted by its own block and by
     `OnDeinit`.
7. **Input defaults that keep the old engine in charge:**
   - `InpTLTwoPivot = true` (2.14 lines everywhere except the chart TF);
   - `InpShowHTFLines = true` (old HTF lines);
   - `InpTLBias = true`;
   - `InpBiasSource = 0`;
   - `InpOnlyQualified = true` (chain from old lines);
   - `InpAlertTL = true` (alerts from old lines);
   - `InpArrShow* = true` (arrival on old lines);
   - `InpDirTable = 1` (a fourth TF pairing).
   - RFX_STRUCT's window (`RS_Look`) and stack size (4) are not inputs.
8. **Re-init:** `gRqT0`, `gRqTH` and `gRqTries` are not reset in `OnInit`, while `gRxaT0` is (`mq5:1011`). Low risk,
   because indicators reload on a TF change, but reset them for symmetry.
9. **Cosmetic:** the header says `v2.10` (`mq5:2`) while `#property version` is `2.15` (`:49`).
10. **ATR implementations differ.** RFX_STRUCT uses `RxSer`'s 14-bar mean TR (Wilder only for 3M); v1 uses `iATR`
    handles; 3M in Direction uses Wilder. The ATR thresholds (`RS_MinLeg`, `RS_MomEff`, `InpMaxZoneATR`) mean
    slightly different things per engine.

## 8. Function-by-function check against LEARNED.md

LEARNED rules referred to below:

| rule | statement |
|---|---|
| B | a break is the first CLOSE beyond the line |
| M | momentum line from the extreme along the next 1-4 bars; its break ends the impulse |
| T | trend line between real pivots with a proper correction between them |
| X | the extreme is pivot 1 unless an impulse leaves it; after a HH, start at the first lower high |
| C | chaining (from pivot 2; OFF by decision) |
| A | clean anchors |
| S | HH -> HL -> LH = sideways |
| P | real pivot = the end of a real correction (~50% / back to the origin zone) |
| Z | pivots from RBD/DBR, RBR/DBD = CP |
| F | fractal / top-down: HTF HH/HL hold, the HTF correction is an LTF trend |
| D | the biggest TF gives the direction and impulse / correction |
| R | correction trades only on the LTF, until the HTF line or the HTF zone near it |

Verdict for each function: **yes** = implements its rule, **partial** = only part of it, **no** = does not, or
implements an older, different rule.

**RFX_STRUCT core (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `zrOrigin` (4106) | origin of the impulse = first osw-swing low going back | P | partial: a candle, not the zone that started the move |
| `zrPivots` (4124) | real pivots: leg >= 1.25 ATR, retrace >= 0.38 or back near the origin body | P, Z | P yes (0.38, not 0.5, tuned); Z no |
| `zrPair` (4170) | a line between 2 real pivots, FitAnchor, minSlope / minRise | T, A | yes |
| `zrImpulse` (4180) | is the leg out of a pivot an impulse (0.6 ATR per bar over 4 bars) | X, M | yes |
| `zrMomentum` (4189) | momentum line from the pivot's wick over its next 4 bars; breaks | M, B | yes for the line |
| `zrLines` (4203) | trend lines per direction, re-anchor, break by close | B, T | yes |
| | the extreme as pivot 1 | X | partial: window extreme only (D4) |
| | chaining | C | off (documented) |
| | momentum selection (4285) | M | partial: newest pivot only (D5) |
| `zrPhase` (4289) | trend from the last 2+2 pivots, leg from the last pivot, target = own line / HL | S | partial |
| | | F, D, R | **no** (D1) |
| `zrPhaseText` (4314) | words | D | no: own-TF wording only |

**RFX_STRUCT chart (`mq5`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `RqDrawLine` (721) | draws a line, faint once broken, ends at the breaking candle | B | yes |
| `RqRun` (736) | chart-TF lines, pivot dots, STRUCTURE text | D, R | **no**: each TF on its own, 4-TF cap, silent HTF drop, own-phase note |
| `RqTick` (792) | refresh on chart / HTF bar open, deletes Kevin's momentum line | | partial: retries only the chart TF |

**Old line engine (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `ZigZag` (362) | Kevin real peaks: 2-bar swing + later HH/LL | P | no: older rule |
| `FitAnchor` (381) | clean anchors | A | yes |
| `TwoPivotLines` (569) | 2.14 structure method; the top is never a pivot (590) | X, P | no: contradicts "the extreme CAN be pivot 1"; old pivots |
| `ZvBreakAlert` (625) / alert block (765) | alerts on old-line breaks | B | no: alerts on hidden lines |
| `Trendlines` (638) | v2.12 / 2.14 lines + drawing of HTF lines (716-737) | T | no: the HTF lines the owner sees are 2.14 |
| `ChartBarIn` (474) / `RefineOnChart` (492) | maps HTF anchors to chart candles | A | partial: drawn line differs from the evaluated line (7.3) |
| `TLBias` (818) | bias = the newest broken old HTF line, any age | D | no |
| `CrossNeeded` / `NearTrendline` / `Overextended` (797-853) | zone notes vs the old lines | R | no: old lines |
| `StructureNow` (854) | `Structure:` row from the old lines | D | no |
| `Qualify` (867) | chain: removed opposite zone / old trendline / new HH or LL | | partial: old trendlines |
| `DedupeTL` (454) | removes overlapping old lines | | not applied to the RFX_STRUCT lines |

**Zone engines (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `Detect` (283) | consecutive basing candles <= 6, leg ratio >= 1.2, <= 1.5 ATR | Z | partial: CP named, no range bases (D3) |
| `zcDetect` (3725) | same, with close-only removal and the 7-candle rule | Z | partial: a second zone engine |
| `DrawZones` (1102) | the 4 zones nearest price + the 2 nearest `HtfOf` zones | R | **no**: no "zone near the HTF line" |
| `ZoneNotes` (999) | verdict / plan; "with / against the HTF trend" from `gTrend` | D, R | no: v1 bias |
| `TooSmall` (916), `FindTrap` (256) | size / trap notes | | n/a (Kevin) |

**Bias / Direction (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `HtfTrend` (1197) | 2-bar fractal HH/HL | F, D | no |
| `Curve` (1215) / `DirCurve` (1579) | position in the HTF range / between strong zones | | n/a (Raja) |
| `DirTable` (1344) | ETF / ITF / HTF / +1 tables | D | partial: a fourth HTF pairing |
| `DirEvalTF` (1507) | per-row state from fractals + old lines + removed zones | F | no |
| `DirCombine` (1654) | the Direction rules; FULL when the ETF agrees | R | **no**: no correction-until-HTF-line concept |
| `DirWOW` (1750) / `DirOrigin` (1736) | WOW targets at the origin zones of old lines | | partial: old lines |
| `RjB_Realign` (1862, off) | LTF zone paired with an upper-TF zone after a cross | R | partial: a third "realign" idea, old lines, off by default |
| `RjB_Sideways` (1958, off) | sideways = overlapping fractal swings | S | partial: different pivots |
| `DirRun` (1998) | runs the stack | | |

**Arrival engine (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `zvPivots` (3553), `zvLines` (3601), `zvPair` (3584) | 2.14 lines | X, P | no (old) |
| `zvMomentum` (3679) | Kevin: the last leg with no pivot | M | partial |
| `arrArrivals` (3836) | arrival = the leg-out closes beyond the old line + opposite zones removed | B | partial: old line |
| `arrArrivalTf` (3894) | HTF ceiling, weak zones, REALIGN = same-TF weak zone nearest the HTF old line, plan, LTF confirmation | R | **no** (D3) |
| `RxLoad` (4010), `RxRead` (4056), `RxHigherTf` (3803) | loading / pairing | | partial (D8) |

**DNA / lenses / export (`RFX_ZoneCore.mqh`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `RjA_CrossBar` (2271), `RjA_TLCrossIn` (2283), `RjA_LineNow` (2295), DNA `outTl` (2614) | read old `TL` / `gUp*` / `drTL` | | no: old lines |
| `LensRun` (2717) / `gLensD1` (2263) | Seiden big picture = the Direction D1 row | D | no |
| `CoreEval` (3356) | the ZoneBot reading | | v1 |

**Host panels (`mq5`)**

| function (line) | does | rule | verdict |
|---|---|---|---|
| `Panel` (1447), `DrawCompact` (1557), `DrawDirBox` (1615), `DirComment` (1648), `DirPopRows` (1658), `V2DirShort` (1803), `DirAlert` (1758) | the texts in section 3 | D | no |
| `RxaDraw` (558), `RxaAlerts` (655), `RxaRealignTick` (690) | arrival drawing and alerts | R | no |
| `V2ExportGV` (2512) | exports `gDir` | | no |

## 9. Structural problems and the recommended architecture

### Problems

1. **New rules were bolted beside the old engine, so there are two (in practice five) sources of truth.** RFX_STRUCT
   draws the chart TF's black lines and one text line. Everything that decides, labels, filters, alerts or exports
   still runs on v1 / 2.12 / 2.14 logic.
2. **No shared structure model.** Every subsystem recomputes pivots, lines, HTF pairings and windows its own way
   (six pivot detectors, four HTF pairings, two zone engines, two 3M builders, different ATRs).
3. **Top-down exists only as string joining.** No object carries "this TF is correcting the HTF impulse, the target
   is line L / zone Z", so the Direction panel, the zone notes, arrivals and the bot cannot use it.
4. **Path-dependent state machines with arbitrary starts.** "200 bars back" decides the extreme, pivot 1 and so the
   whole line set.
5. **Tests prove the port, not the behaviour.** The conformance tests check MQL == TS on 50-80 bar windows. Nothing
   tests the MT5 glue (RqRun's TF stack, loading, top-down, drawing) or MT5-length windows.
6. **Fixed constants hide behaviour**: `RS_Look`, the 4-TF cap, the `want = 2` HTF zones.

### Target design: one top-down `StructModel`, computed once per redraw

```
Loader (one, RxLoad semantics: closed bars + phantom, time-mapped, retries per TF, reports "loading")
   |
   v
StructModel  (zvReal.ts canonical -> RFX_STRUCT MQL port -> mql_port.py conformance on qa/bars MT5 windows)
   for TF in [3M, MN, W1, D1, H4, H1, M15] (always the full ladder above the chart TF):
     pivots      = zrPivots (fixed D4 routing)                      # one pivot definition
     lines       = zrLines: trend + momentum, live + broken          # one line definition
     zones       = one zone engine (+ range bases), roles: reversal (RBD/DBR) / CP (RBR/DBD)
     trend       = protected-pivot state (HH/HL hold until a close beyond the impulse origin)
     leg, phase  = impulse / correction RELATIVE to the nearest HTF trend (+ own "sideways pause")
     target      = impulse-bound HTF line now + the HTF-side zone nearest it (= REALIGN)
   verdict = { direction (biggest TF with a trend), per-TF phase, allowed trades:
               with the HTF impulse; correction trades only on the LTF of the correcting TF, until target;
               after target: LTF arrival inside the zone = entry }
   |
   +--> chart: chart-TF lines + HTF lines (evaluated by time), pivots, REALIGN line + zone, STRUCTURE text
   +--> zone selection: zones near the targets / lines first, roles from the model
   +--> Direction box + Bias rows + zone notes ("with / against") = the verdict (DirCombine, TLBias, HtfTrend,
   |    StructureNow, ZigZag, TwoPivotLines retired)
   +--> arrivals: an arrival = a leg-out closing beyond a MODEL line; realign = model target; LTF confirm inside it
   +--> alerts: breaks of model lines, target reached, LTF arrival in the target zone
   +--> export (GV) / ZoneBot CoreEval / Telegram bot (zvReal.ts) / Pine / MQ4: the same model
```

Rules for the rebuild:

- One parameter block (`ZR` / `RS_*`); windows are explicit and anchored to the HTF's protected pivot.
- Every consumer reads the model. None recomputes structure.
- Acceptance runs on qa/bars windows equal to MT5's (460 loaded, the real window) and on the owner's marks
  (`trainingFixtures.test.ts`).
- Add a test for the RqRun glue: the TF ladder, the top-down text, the targets.

## Appendix: reproduction

From the repo root: `git fetch origin data`, then run the script below (Python 3, no packages; it reads
`origin/data:qa/bars/XAUUSD/*.json` with `git show`). Expected output: the STRUCTURE lines in section 2, the D1 line
2026-08-25 4696.81 -> 2026-10-16 4198.96 with the window extreme on 2026-01-29, the W1 up line at 3274 with no fresh
demand zone between 3093 and 3626, and the W1 down line broken in the old engine but live in the new one.

```python
import json, subprocess, sys
from datetime import datetime, timezone
sys.path.insert(0, 'tools/telegram_bot/parity')
import mql_port as M
M.TF_MIN.setdefault('3M', M.RX_Q)
def rows(tf):
    j = json.loads(subprocess.check_output(['git', 'show', f'origin/data:qa/bars/XAUUSD/{tf}.json']))
    return [b[:5] for b in (j['bars'][:-1] if j['forming'] else j['bars'])]
def quarters(r):                       # RxLoad(RX_Q): closed quarters only (needs the quarter's last month)
    q = {}
    for t, o, h, l, c in r:
        k = (int(t[:4]), (int(t[5:7]) - 1) // 3); m = (int(t[5:7]) - 1) % 3
        if k not in q: q[k] = [f'{k[0]}-{k[1] * 3 + 1:02d}-01T00:00', o, h, l, c, {m}]
        else: e = q[k]; e[2] = max(e[2], h); e[3] = min(e[3], l); e[4] = c; e[5].add(m)
    ks = sorted(q); return [q[k][:5] for i, k in enumerate(ks) if 2 in q[k][5] and (i or 0 in q[k][5])]
R = {tf: rows(tf)[-M.RX_MAXB:] for tf in ['MN', 'W1', 'D1', 'H4', 'H1']}
R['3M'] = quarters(rows('MN'))[-M.RX_MAXB:]
def run(tf):
    S = M.ser_of(R[tf], tf, None, {}); r = M.S_(); piv = []; h = []; ph = M.S_()
    M.zrLines(S, r, piv, h); M.zrPhase(S, r, piv, ph); return S, r, piv, ph
dt = lambda S, i: datetime.fromtimestamp(S.T[i], timezone.utc).strftime('%Y-%m-%d')
w = lambda x: 'up' if x > 0 else ('down' if x < 0 else 'sideways')
def txt(tf, p): return f'{tf} range' if p.phase == 0 else (f'{tf} impulse {w(p.trend)}' if p.phase == 1 else f'{tf} correction ({w(p.leg)})')
UP = {'H1': 'H4', 'H4': 'D1', 'D1': 'W1', 'W1': 'MN', 'MN': '3M'}
for c in ['H1', 'H4', 'D1', 'W1']:                       # 1. STRUCTURE as RqRun builds it
    tfs = [c]
    while len(tfs) < 4 and tfs[-1] in UP: tfs.append(UP[tfs[-1]])
    print(f'{c}: ' + '  |  '.join(txt(tf, run(tf)[3]) for tf in reversed(tfs)))
S, r, piv, ph = run('D1')                                 # 4. D1 down line + window extreme
print('D1 dn', dt(S, r.dn.a), r.dn.pa, '->', dt(S, r.dn.b), r.dn.pb, '| window top', dt(S, max(range(1, 201), key=lambda i: S.H[i])))
S, r, piv, ph = run('W1')                                 # 3. W1 up line now + fresh W1 demand zones
print('W1 up line now', round(M.zrAt(r.up, 0)))
zs = []; M.zcDetect(S, M.RxParams(True), zs)
print([(round(z.dist), round(z.prox)) for z in zs if z.dir > 0 and not z.removed and not z.tested])
o = M.S_(); op = []; M.zvLines(S, o, op)                  # 2. old vs new W1 down line
print('old W1 dn live', o.hasDn, '| old broken', dt(S, o.dnX.a), '->', dt(S, o.dnX.b), 'at', dt(S, o.dnX.brokenAt), '| new live', dt(S, r.dn.a), '->', dt(S, r.dn.b))
```

The D4 fix and the top-down prototype were tried on scratch copies only (the Python port, plus zvReal.ts in a
throw-away worktree scored with `npx vitest run src/core/trainingFixtures.test.ts`). The repository code is unchanged.

**Not reproduced numerically:**

- The exact `DIRECTION: LONG - FULL` string. `DirEvalTF` / `DirCombine` / `Curve` have no Python port; the
  derivation in section 3 is by hand from the replayed S and T inputs.
- The v1 `Detect` with wick removal (only `zcDetect` is ported; both reject the 2025 W1 base for the same reason).
- MT5 object behaviour: Labels OFF, alerts, history loading, drawing in bar space. These come from reading the code.
- Pepperstone's own prices. qa/bars is OANDA BID in Pepperstone time.

## 2.16 (2026-10-30)

The architecture of section 9 is built: one structure model (`zvModel.ts` = `RFX_MODEL`), every chart consumer rewired,
the 2.14 engines off by default. Changes, results, remaining gaps and the SPEC issues found: `docs/training/ZV216.md`.
