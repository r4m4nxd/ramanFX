# Bystra and Malaysian SNR: a plain guide

Two books, explained simply, compared with Raja, and checked for what we can test.

- **PoB** = "The Property of Bystra (English Version)", signed "Nora". 212 slides. Page refs: `PoB p..`.
- **SNR** = "Malaysian SNR Strategy 2.0" by Pitchou.FX. 639 pages. Page refs: `SNR p..`.
- **Raja** = our main mentor checklist (`src/core/checklists/raja.ts`). Refs like `L55`.

Sources: the five study notes in `docs/books/notes/` (pob1, pob2, pob3 = PoB pp1-72, 73-142, 143-212; snr1, snr2 = SNR pp1-320, 321-639). Nothing here comes from outside those notes, the Raja checklist and our evidence review. When the notes are unsure, this guide says "unclear". When the notes disagree, it says so.

Words used everywhere:
- **HTF / LTF** = higher / lower timeframe.
- **BO** = breakout.
- **TL** = trendline.
- **Body** = the thick part of a candle (open to close). **Wick** = the thin line above or below.
- **"pip" on gold** = $0.10 in SNR's examples (a 3.000 stop = 30 pips, SNR p446).

---

## Contents

1. [Each book in 60 seconds](#1-each-book-in-60-seconds)
2. [Bystra step by step](#2-bystra-step-by-step)
3. [Malaysian SNR step by step](#3-malaysian-snr-step-by-step)
4. [Combined glossary](#4-combined-glossary)
5. [Side by side: Bystra vs SNR vs Raja](#5-side-by-side-bystra-vs-snr-vs-raja)
6. [Red flags](#6-red-flags)
7. [What is worth testing](#7-what-is-worth-testing)
8. [Cheat sheets](#8-cheat-sheets)

---

## 1. Each book in 60 seconds

### 1A. Bystra (PoB) in 60 seconds

**What it is.** A slide deck of 12 named setups plus 3 "confluence" add-ons (CK1, CK2, CK3). Each setup is a chart shape at a horizontal line. You wait for price to come back to the line, and you enter there.

**The core idea.**
1. Find a **setup** on the lower timeframe (a shape at a line).
2. **Confirm** it on a higher timeframe: an **engulfing candle** at the same price. "The best confirmation is in the Engulfing Candle Body" (PoB p20).
3. Never trade into the **Danger Zone**: the end of the trend, where the opposite zone sits (PoB p17-18).

**The full trade flow (as the book shows it).**
1. Look at the trend. Is it a continuation or a reversal? (PoB p10-16)
2. Mark where the trend started. That area is the **Danger Zone** for a trade against it (PoB p30).
3. On the LTF, find a setup: SNRC1/2/3, QMR/QMC/QM2P/QMM, Hybrid 1/2, Blindspot, Manipulation (PoB p27).
4. Switch to a higher TF. Look for an engulfing (best) or a strong body candle at the same line that has **not** touched the Danger Zone (PoB p19-25, p45, p59).
5. Optional extra: a trendline that meets the line (CK1), two trendlines that meet there (CK2), or CK2 plus an HTF "solid engulfing" (CK3) (PoB p176-210).
6. Enter with a limit order at the line, on the first return (PoB p75-76, p143-210).
7. **Stop, target, risk: the book never says.** Not on any of its 212 pages.

**Timeframes.** No fixed ladder. Examples: M5 setup → H1 confirm (PoB p21), M30 → H1 (PoB p22), H4 + Daily (PoB p38).

### 1B. Malaysian SNR (Pitchou) in 60 seconds

**What it is.** A top-down "storyline" method on gold. Price travels from one **fresh level** (or trendline) to the next. A trade starts when a higher-timeframe level is touched and a **lower-timeframe QM breakout** shows the new direction.

**The core idea.**
1. Levels are drawn at **candle bodies**, not wicks: A-shape (peak), V-shape (trough), Gap (SNR p17-22).
2. A level is **fresh** if no wick has touched it. A **body** break makes it fresh again (SNR p23-25).
3. A breakout counts only if a **body closes** beyond and it forms a **QM** (H, L, HH, LL) (SNR p34-37).
4. Each level timeframe has its own breakout timeframe: Monthly → Daily, Weekly → 4H, Daily → 1H (SNR p99).

**The full trade flow.**
1. **Monthly / Weekly / Daily**: mark fresh A/V/Gap levels and trendlines (SNR p17-30).
2. Price touches a fresh HTF level. On M/W no close is needed. On D/4H you need that TF's close. On 1H you need the 4H close (SNR p93).
3. Drop to the **breakout TF** from the map. Wait for an **external QM breakout**: a body close beyond the last A/V that formed **before** the touch (SNR p37-44, p74). This starts the **storyline** (SNR p210-230).
4. Inside the QM, pick the entry level: SBR/RBS (the flipped level) first, then LS / GAP, then APEX (SNR p368-370, p396-400).
5. When price returns to that level, wait for an LTF **confirmation**. The main one: a **5M engulfing candle that breaks the EMA 9** (SNR p413-420).
6. **Stop**: at least **30 pips**, or beyond the confirmation's swing (SNR p435, p547).
7. **Target**: the next fresh level or TL of the storyline's TF, or a fixed **1:2 / 1:3** for continuation trades (SNR p436-437, p549).
8. **Risk**: "NEVER exceed 1%" for funded accounts, but the personal-account examples risk 5-30% per trade (SNR p611-617). See Red flags.

---

## 2. Bystra step by step

The book is in learning order already. This follows it.

### Lesson 1. The engulfing candle (PoB p4)

An engulfing candle's body covers the previous candle. It is the book's most important tool. It is used "as an entry point or confirmation" (PoB p4).

```
 Bullish engulf        Bearish engulf
        |                 |
       [ ]               [#]
   |   [ ]  <- big      [#]  |
  [#]  [ ]   up body    [#] [ ]   <- big down body
  [#]  [ ]              [#] [ ]
   |    |                |   |
 small  big           small  big
 down   up            up     down
```
`[#]` = down candle body, `[ ]` = up candle body.

- Some drawings engulf only the body; some also engulf the wick (PoB p4). The book never gives a number (PoB p45 notes). **Unclear: body or wick.**
- In examples the line is drawn at the engulfing candle's **open** (body edge), not its wick (PoB p21-24, p52-56, p65-70).

### Lesson 2. The 4 entry points (PoB p5-9)

"Only 4 types":

```
 RBR (rally-base-rally)   DBD (drop-base-drop)
        /                 \
   _/\_/   <- base         \_/\_   <- base
  /                             \

 RBD (rally-base-drop)    DBR (drop-base-rally)
     _/\_                 \       /
    /    \                 \_/\_/   <- base
   /      \
```
- The base is one small opposite-colour candle (PoB p6-7) or a small sideways zig-zag (PoB p8-9).
- Later the book says these four "are actually Engulfing" (PoB p73).

### Lesson 3. Movement types (PoB p10-16)

- **Reversal**: the trend changes direction (PoB p11-13).
- **Continuation**: the market keeps going one way, along a trendline (PoB p14-16).
- **Sideways**: listed only. Never explained (PoB p10).

### Lesson 4. The Danger Zone (PoB p17-18, p28-30)

Split the trend into Beginning, Middle and End.

```
 SELL in a downtrend                 BUY in an uptrend
 Beginning  ----  sell here: safer   End = SUPPLY = DANGER ZONE
 Middle     ----  sell here: safer   Middle     ---- buy: safer
 End = DEMAND = DANGER ZONE          Beginning  ---- buy: safer
```
- "Sell in the beginning or in the middle of the trend is more safe" (PoB p17). "Dont be silly by selling at the demand zone area" (PoB p17).
- In the setup drawings the Danger Zone is a **box at the origin of the old trend**: for a sell after an uptrend, the low where the uptrend began (PoB p30, p37, p61).
- **Rule:** if the move has touched the Danger Zone, the setup is invalid (PoB p28-29, p61).
- **Unclear:** the book gives no size for "beginning / middle / end". It is a judgement call.

### Lesson 5. Confirmation by multi timeframe (PoB p19-26)

1. First find a setup. Then find a confirmation (PoB p19).
2. Confirmation = switch to a higher TF and look for an engulfing candle at the same price (PoB p20).
3. A plain "body candle" also works, "as long as the price does not touch the 'end of the trend'" (PoB p25).
4. "Always keep switching timeframe to look for a confirmation" (PoB p25).

```
 LTF (e.g. M5): setup at line       HTF (e.g. H1): engulf at same line
   ____                                   |
  |    |___ line ______ entry            [#]
          \    /\      /                 [#] <- bearish engulf, line at its open
           \  /  \____/  \               [#]
            \/            \
```
Examples: XAUUSD M5 → H1 (PoB p21, same chart as p65); GBPAUD M30 → H1, about 130 pips of fall (PoB p22, p66).

- **Unclear:** the size of a "body candle" is never defined.

### Lesson 6. The 12 setups (PoB p27)

| Setup | Type (book's label) | Pages |
|---|---|---|
| Hybrid 1 | Reversal | p28-34 |
| Hybrid 2 | Reversal | p35-43 |
| SNRC1 | Continuation | p44-57 |
| SNRC2 | Continuation | p58-71 |
| SNRC3 | Continuation | p72-87 |
| QMR | Reversal | p88-105 |
| QMC | Continuation | p106-118 |
| QM2P | Reversal | p119-128 |
| QMM | Reversal | p129-138 |
| Blindspot (Ch.1, Ch.2) | Reversal | p139-160 |
| Manipulation | Reversal | p161-167 |
| CLAB | Neutral | p168-175 |

Then add-ons CK1, CK2, CK3 (p176-211). The book's own view: reversals are "high risk" (PoB p28, p89). Continuations are its preferred family.

### Lesson 7. SNRC1: strong level + RBR/DBD (PoB p44-57)

"SnR Continuation 1". "Very simple". Only in a continuation trend (PoB p44).

Formula (PoB p45):
1. Entry point RBR (buy) or DBD (sell).
2. At a strong support or resistance.
3. Confirm on a higher TF: engulf or body candle that has not touched a danger zone.

```
 SNRC1 BUY = Strong Resistance + RBR at the same line (PoB p46)

          /\        RBR forms here     /
         /  \           _/\_          /
 -------/----\---------/----\--------/----- strong resistance = entry
       /      \       /      \__ entry (retest)
              \_____/
```
- "Strong Resistance must be in the same line with RBR" (PoB p48).
- **Unclear:** what makes a level "strong" is never defined (pob1 glossary).

### Lesson 8. SNRC2: break, come back, base, go (PoB p58-71)

The "sibling" of SNRC1. Entry point is RBD or DBR (PoB p58).

```
 SNRC2 SELL = Strong Support + RBD (PoB p60-61)

  ___         price breaks         RBD forms     retest = entry
 |   |___                          around line    ___
 --------\--------- strong support ---/\-----------/-\---------
          \                          /  \         /   \
           \_____/\________________/    \_______/     \
                                                       \  must NOT reach
                                                        \ the Danger Zone
```
- Price must first **break** the strong support (PoB p61).
- The RBD's drop must **not** touch the Danger Zone. If it did, "not valid anymore" (PoB p61).

### Lesson 9. SNRC3: the war of engulfings (PoB p72-87)

"Please do not headache. SNRC3 is not a setup" (PoB p72). Then p73-74 gives it a formula anyway. **Contradiction in the book.**

- A strong support becomes a **failed bullish engulfing**. Then a **bearish engulfing** forms "in the same line". Enter on the retest (sell). Buy is the mirror (PoB p74).
- For this setup, forget SnR/SnD and use "only clear engulfings" (PoB p73).

```
 SNRC3 SELL
     bull engulf here FAILS        bear engulf at SAME line
         [ ]                            [#]
 ------[#][ ]----------------------[ ][#]------------ line ---- entry on retest
          \___/\___                     \       /\  /
                   \___/^^^^^\__/        \_____/  \/ \
```

### Lesson 10. QM, the Quasimodo (PoB p88-105)

The QM shape (named after the hunchback):

```
 QMR SELL (PoB p90). The buy (PoB p91) is the same picture upside down.
              HH
     H        /\
     /\      /  \          back up to H
 ---/--\----/----\------/------- H = QM line = SELL here
   /    \  /      \    /
  /      \/        \  /
         L          \/
                    LL (below L)
```
Step by step:

```
 SELL:  H  ->  L  ->  HH (above H)  ->  LL (below L)  ->  back up to H = SELL
 BUY:   L  ->  H  ->  LL (below L)  ->  HH (above H)  ->  back down to L = BUY
```
- The line (QML) is the **left shoulder**: H for a sell, L for a buy (PoB p89-91).
- QMR "only occurs in reversal", so it is "high risk", and it is where "big traders manipulate us" (PoB p89).
- **Unclear:** body or wick of the shoulder. Most charts use the body, with the wick poking through (PoB p93, p95-96). Some are ambiguous (PoB p92, p94).
- Note: on PoB p94 the line was touched several times during the HH range and still counted. No "used up" rule.

### Lesson 11. QMC, QM2P, QMM (PoB p106-138)

**QMC (QM Continuation)** (PoB p106-118). A QM inside an existing trend, plus a trendline. Drive 1, drive 2 (= the HH or LL), drive 3 = where the trendline meets the QM line = entry (PoB p107-108).

```
 QMC SELL: falling trendline through 1 and 2; 3 = trendline meets H line
   1
    \      2 (HH)
     \  H  /\
 -----\-/\/--\-------3----- H line = entry at 3
       \/     \     /\
               \   /  \
                \_/    \
                LL
```
- "Best entry is after the occurrence of reversal (Fresh)" (PoB p106). **Unclear.** "Fresh" is never defined in PoB.

**QM2P (QM 2 Points)** (PoB p119-128). A QMR whose head has two peaks (1 and 2). The line through 1 and 2 meets the QM line at 3 = entry. Always a reversal (PoB p119).

**QMM (QM Manipulation)** (PoB p129-138). A QMR that **fails**. Price breaks back through the left shoulder. That line now works the other way. A DBD/RBD (sell) or RBR/DBR (buy) forms at the line. Trade its retest (PoB p129-131).
- "So many types of QMM" exist. The author takes it only with an HTF engulfing (PoB p129).

```
 QMM BUY (a failed sell-QMR, PoB p133)
     H     HH               price comes back UP through H = QMR failed
     /\   /\              /
 ---/--\-/--\------------/--  H line: now BUY on retest
   /    \/   \          /
         L    \        /
               \__LL__/
```

### Lesson 12. Blindspot (PoB p139-160)

"No entry point or setup". Often in reversals. Also called "swap". "Not all types of swaps can be trusted". "Price hides something in each TF" (PoB p139).

Steps (PoB p140-141):
1. A **failed engulfing** at a level.
2. One big candle (**significant break**) closes far through that line.
3. Price comes back to the line = entry.

```
 BLINDSPOT BUY
      [#]  <- bear engulf (fails)        big green "significant break"
  [ ] [#]                                     [ ]
 -[ ]-[#]---- line (top of the pair) -------[ ]-------- entry on retest
       \__                                  [ ]    /\  /
          \__/\__/                          [ ]   /  \/
```
- **Unclear:** "significant" has no size. The box spans body edge to wick tip; which edge is the order price is unclear (PoB p140-143 notes).
- **Blindspot + Confirmation** (PoB p147-150): on the HTF, the same move is one big engulfing candle. The line is at its open.
- **Blindspot 2** (PoB p152-159): add a trendline; its 3rd touch lands on the line.

### Lesson 13. Manipulation (PoB p161-167)

- A reversal setup, "more high risk than QMR". "Valid manipulation always appears in HTF" (PoB p161).
- Sell: an HTF bearish engulfing. Switch to the LTF. Find a **DBD inside the engulfing body**. Enter on the return (PoB p162). Buy: RBR inside a bullish engulfing body (PoB p163).

```
 HTF bearish engulf          LTF inside that body
   [ ][#]  <- body top          ___ DBD = entry zone
      [#]                      \_/\_
      [#]  <- DBD sits here        \
      [#]                           \
```

### Lesson 14. CLAB and the CK family (PoB p168-210)

All are **trendline add-ons**. Entry is always **point 3**.

- **CLAB** ("Confirmation Like a Boss", PoB p168-174): "not a setup". Trendline touches 1 and 2. Touch 2 is an engulfing or a DBD/RBR. Entry at 3, where the line meets the horizontal from touch 2.
- **CK1** (PoB p176-184): strong SnR + one trendline. "Any setup + CK1".
- **CK2** (PoB p186-200): two trendlines + strong SnR. Two kinds:

```
 CK2 ALIGN (triangle, PoB p188-189)     CK2 CROSS (PoB p190-191)
  1                                      1
   \  2                                   \   2         line A: two highs
    \/ \______                             \ /\  ...
        \     3 = entry                     \   \
  ______/   /                         S1 ____\___3 = entry
  1    2__/                              \  /  line B: from old support S1
                                          \/   to later resistance R2
```
- **CK3** (PoB p202-210): "Any setup + CK2 + Solid Engulfing" on the HTF. "The strongest" (PoB p202). It does **not** mean three trendlines. "Solid" is not defined. **Unclear.**

### Lesson 15. Hybrid 1 and Hybrid 2 (PoB p28-43)

Taught early in the book, but they are the hardest and the author does not like them. Learn them last.

**Hybrid 1** (PoB p29): trend ends → retest at RBR/DBD/QMR → must not touch Danger Zone.
- "Not my favorite", very high risk, "frequently used by most traders". "I always 'FAST' Hybrid 1" (PoB p33). **Unclear:** "FAST" is never defined (maybe a quick, short trade).

**Hybrid 2** (PoB p36): trend ends → new trendline through points 1 and 2; point 2 must break the old trend → HTF engulf or reversal candle → "Entry in the third trendline" (point 3).

```
 HYBRID 2 SELL (PoB p37)
          1
         /\     2 (breaks the rising line)
        /  \   /\
       /    \ /  \       3 = entry (3rd touch of line 1-2)
      /      \    \     /\
     / rising      \   /  \
    /  line         \_/    \
  [Danger Zone]   "Price x reach Danger Zone" (x = did NOT)
```

### Bystra: the book's own unclear points and contradictions

1. "SNRC3 is not a setup" (PoB p72) but it has a formula, examples and "+ Confirmation" pages like the others (PoB p73-86).
2. "Strong" support/resistance is never defined (PoB p45-70, p186).
3. Engulf: body or wick? Never fixed (PoB p4, p73).
4. "Fresh" used once (PoB p106), never defined.
5. "FAST" (PoB p33) never defined.
6. Trendlines drawn to wicks on most pages but to bodies on p170. Inconsistent (pob3).
7. The HTF confirmation line sits at the engulfing open on most pages, but inside the body on p104 and p135 (pob2).
8. Page 117 is labelled a second "Confirmation 5" (pob2).
9. "x" in labels means "not" (PoB p37, p40-42, p51).
10. **No stop, no target, no risk rule anywhere** (pob1 §3, pob2 §3, pob3 §3).
11. "Sideways" is listed as a movement type but never explained (PoB p10).

---

## 3. Malaysian SNR step by step

### Lesson 1. Three kinds of level (SNR p16-22)

All levels are drawn at the **body junction** of two candles (where one candle's close meets the next one's open). On a line chart (closes only), these are the turning points (SNR p20-22).

```
 A-shape (peak)          V-shape (trough)        Gap (same direction)
    [ ][#]  <- level         |    |                    [ ]
 ---[ ][#]--- at body    [#]      [ ]               ---[ ]--- level =
    [ ]  [#]   junction  [#]  [ ] <- level         [ ]       close of 1st
    up   down            [#][ ]  at body           [ ]       = open of 2nd
                         down up  junction         up  up
```
- **A** = up candle then down candle. Resistance. Once broken, support (SNR p17-19).
- **V** = down candle then up candle. Support. Once broken, resistance.
- **Gap** = two candles in the same direction. Level at the junction (SNR p17, p22). **Unclear:** this reads like a candle junction, not a real price gap (snr1).
- Role rule: price above a level = support. Price below = resistance (SNR p17-19).
- **Note:** the book never says "body" in words. The body reading comes from its charts and line charts (snr1 §3).

### Lesson 2. Fresh and unfresh (SNR p23-25)

```
 FRESH                 UNFRESH                FRESH AGAIN
 ------ level          ---|-- level           ----[ ]---- level
   never touched          ^ wick touched         body broke through
```
- **Fresh** = never touched since it formed, OR a candle **body** broke through it (SNR p23-25, p200).
- **Unfresh** = a **wick** touched it, but no body broke it (SNR p23, p25).
- "Always look at the end of the levels" (SNR p23).
- Example: XAUUSD daily Dec 2023-Mar 2024 (SNR p24).
- **Unclear:** does a body that touches but does not close beyond count as a touch? (snr1 §7)

**The CC (Confirmation Candle)** (SNR p96, p139): "the third candle that forms immediately after the level is created". It points the same way as the level (green at support, red at resistance). An unfresh level with a CC still counts.

**How many uses?** (SNR p139): an SNR level is good about twice (the CC, then a touch plus breakout), then it weakens. A body breakout makes it fresh again (SNR p200).

### Lesson 3. Trendlines (SNR p28-30, p139)

- Up TL through 2+ V points. Down TL through 2+ A points. "Don't force them" (SNR p28).
- Drawn on closes / the line chart in the examples (SNR p115-118, p145).
- Types (from the p29 sketch only): Reversal TL, QM TL, Outer TL, Break & Retest TL.
- Up to **5 touches**. The **3rd is strongest**. The 4th and 5th count only with a confirmed breakout (SNR p139, p192).
- **Contradiction:** p139 says the 3rd touch is best "for a breakout"; p192 says "for entries".

### Lesson 4. Breakouts and the QM (SNR p31-50)

- A breakout = a strong **body close** beyond the level. A wick-only break is invalid (SNR p35, p37, p45).
- "For any breakout to be valid… it must form a QM pattern" (SNR p34).

```
 BEARISH QM (SNR p34-35)            BULLISH QM
            HH                                     HH  <- breaks above H
     H      /\                        H      /\   /
     /\    /  \                       /\    /  \ /
 ---/--\--/----\---                  /  \  /    ...
   /    \/      \                   /    \/
         L       \                        L
                  \  LL  <- body                 LL
                   closes below L       (L, H, LL, then HH above H)
```
- **Part 1** = the old trend's last leg (up to the HH or LL). **Part 2** = the new leg that breaks part 1 = trend change (SNR p67).

### Lesson 5. External vs internal breakout (SNR p37-44, p72-79)

This is the key filter of the whole book.

```
 Bearish case at a fresh resistance level:

 ============================ fresh HTF level
            /\  <- TOUCH
     /\    /  \/\        <- small V's formed AFTER the touch: IGNORE (internal)
    /  \  /      \
   /    \/   <-- last V BEFORE the touch = the line that matters (external)
 ---------\--------------
           \  body closes below = VALID breakout
```
- **External** = breaks the last A (bullish) / V (bearish) that formed **before** the touch. Valid at SNR levels (SNR p37-44, p74).
- **Internal** = breaks an A/V that formed **after** the touch. **Invalid** at SNR levels. "FALSE SIGNALS" (SNR p39-44).
- At a **trendline** the rules are looser: a QM after the touch is fine, early breakouts are fine (SNR p74-75).
- On a trendline, the body must close beyond both the TL and the A/V shape (SNR p45).
- **Contradiction:** SNR p126 says on 4H/1H/30m/15m levels, breaking the last A/V **after** the touch "can still count". This goes against p74. The book calls it a rare exception.

### Lesson 6. Rejection by timeframe (SNR p92-96)

| Level TF | Does the rejection need a candle close? |
|---|---|
| Monthly | No |
| Weekly | No |
| Daily | Daily close |
| 4H | 4H close |
| **1H** | **4H close** (not 1H) |
| 30m | 30m close |
| 15m | 15m close |

Candle colour does not matter (SNR p96).

### Lesson 7. The timeframe map: level → breakout (SNR p97-127)

| Level / TL on | Breakout to watch on | Rare early BO on | Notes |
|---|---|---|---|
| Monthly | Daily | Weekly | SNR or TL |
| Weekly | 4H | Daily | SNR or TL |
| Daily | 1H | 4H | SNR or TL |
| 4H | 1H / 30m / 15m | - | SNR only |
| 1H | 30m / 15m | - | SNR only |
| 30m | 5m | - | SNR only |
| 15m | 1m | - | SNR only |

(SNR p99, p114, p121-125.) "Misalignment… can lead to unreliable signals" (SNR p99).

- **Early breakout** (SNR p121-123): sometimes the next-higher TF breaks first (weekly BO at a monthly level, before the daily BO). Long HTF wicks hide LTF A/V levels.
- **Drawdown** (SNR p150-151): a wick pierces an HTF trendline before the real breakout. Normal.
- **Contradiction:** the Weekly Advanced text says a daily BO confirms (SNR p250-251); Daily Advanced says daily confirmed by 4H (SNR p258-259). The diagrams and the summary (SNR p239, p252, p260, p270) say Weekly TL → 4H, Daily TL → 1H. Use the table above.

### Lesson 8. Direction and the storyline (SNR p161-320)

- **Direction**: a QM breakout on the breakout TF, at a fresh HTF level or TL, sets the HTF direction. Example: daily bullish QM BO at a monthly level = monthly direction bullish (SNR p161-163). Below 4H, only SNR levels count.
- **Storyline** = price flows from one level/TL to the next (SNR p203). Phases: Beginning → Decision (rejection or breakout) → Confirmation (SNR p205).

```
 CLASSIC STORYLINE (monthly example, SNR p210-215)
 ======== next fresh monthly level  <- target ("to another")
                 /
            /\  /
       /\  /  \/      <- daily trend up
      /  \/
 ====/=========== fresh monthly level
    ^ 1 touch + 2 rejection + 3 daily breakout = storyline starts
```
- **Classic** = fresh level + rejection + breakout ("1+2+3", SNR p213).
- **Advanced** (author says he invented it) = HTF trendline + breakout, no rejection step ("1+2"). Used when no fresh levels are left (SNR p237-266).
- **Priority**: Classic while fresh levels exist; Advanced when none; both when they line up, with the TL break as the early signal (SNR p267-271).
- **Mini Classic** on 4H/1H/30m/15m, SNR levels only (SNR p229-236).
- **Continuation storyline**: repeated same-direction breakouts after a shift (SNR p291-297).

### Lesson 9. Nested storylines and alignment (SNR p299-367)

- Inside a monthly move, price goes weekly level to weekly level. Inside a weekly move, daily to daily (SNR p306-308).
- **MTF alignment**: monthly, weekly and daily levels in one zone. The lower TF breaks first. A 1H BO starts the daily storyline, which "leads to" the weekly, which leads to the monthly (SNR p313-323).
- "Avoid Trading Against Alignment" (SNR p317). With mixed signals, wait (SNR p305).
- Three parts of a storyline (SNR p334-337): **Start** (rejection + BO), **Middle** (HH/HL or LH/LL), **End** (major opposite level: take profit).
- If the daily runs against the weekly, trade the daily parts and ignore the weekly (SNR p568).

### Lesson 10. Entry levels inside the QM (SNR p368-412)

```
 BULLISH QM: the entry ladder (SNR p370, p400)

           /\        /
     RBS  /  \  /\  /   <- RBS = old resistance, now support (try 1st)
 ------- /----\/--\/-------------
    GAP /     ERS        <- ERS = last mini V before the BO
   LS  /\    /
 -----/--\--/------------ <- LS = left shoulder (try 2nd, with GAP)
           \/
          APEX           <- APEX = the lowest point (last resort)
```
- **Part 1 levels**: Apex, LS, GAP, SBR/RBS. **Parts 2-3**: C.APEX, GAP, RBS/SBR (SNR p368-370).
- RBS = bullish, SBR = bearish (SNR p396, p399, diagrams p370, p400). **Typo:** p368 says SBR for bullish.
- **C.APEX** (continuation apex): the text says "highest point in a retracement" in a bullish trend; the diagram p370 points at the pullback **lows**. **Unclear.** The diagram is more consistent.
- **Clean QM**: enter at SBR/RBS. **Noisy QM**: if SBR/RBS reacts weakly, wait for LS or GAP, then APEX (SNR p396-400).
- **ERS** (Early Right Shoulder): a mini V/A just before the breakout. With several, use the **last** one. "No confirmation? No setup." (SNR p371-372, p401-402)
- **Refinement**: if the HTF apex has a long wick, drop to the fresh level on the next lower TF. 4H → 1H → 30M → 15M; 15M is the last stop (SNR p389-391).
- **Dual-side rejection**: bullish and bearish BOs at one level? Follow the HTF side (SNR p392-395).
- **GAP QMS**: never trade a 4H/1H gap alone. A 4H gap needs the 1H gap + 1H A/V + 30M A/V. A 1H gap needs 30M A/V + 15M A/V (SNR p409-412).
- **Which TF for the QM**: daily storyline → 1H QM (4H if clearer); weekly storyline → 4H QM. Act on the first valid QM breakout; later ones are add-ons (SNR p374-379).
- Setup catalogue (SNR p381-388): SBR, LS, APEX, QMC, Reversal TL QM Failed, QM-to-QM, Double Apex, SNRC1, ERS, MISS, Double TL-SBR, QM-CC. Mostly drawn, few words.

### Lesson 11. Confirmation and entry (SNR p413-434)

| Confirmation | TF (4H level) | TF (1H level) | When to enter |
|---|---|---|---|
| Candle rejection | 4H, 1H, 30M, 15M | 1H, 30M, 15M | When the rejecting candle closes |
| Breaking gap | 15M, 5M | 15M, 5M | On the pullback to the broken gap |
| TL breakout | 5M, 1M | 5M, 1M | Right after an engulfing close beyond the micro TL |
| QM confirmation | 1M, 5M | 1M, 5M | On the pullback to the mini QM's LS |
| **EMA** | **5M** | **5M** | Right after an engulfing candle breaks the **EMA 9 (close)** |

(SNR p413-420.) EMA settings: length 9, source close (SNR p420).

```
 5M EMA9 ENGULF (sell at a supply level)
   [ ]
   [ ][#]   <- bearish engulf closes BELOW the EMA 9
 ~~~~~~[#]~~~~~~~~ EMA 9
        [#]  -> sell at the close
```
- Rare case: a 5M QM forms already beyond the EMA → wait for a pullback to the 5M QM level (SNR p421).
- **Proximity**: the confirmation closest to the entry level is the best (SNR p432-434).
- **Stacking**: rejections in order 15M → 30M → 1H → 4H can give up to 4 entries at one level (SNR p423-426).
- **Contradiction:** candle rejection text (SNR p416) says a sell triggers when a bullish candle "closes above the entry level". The diagrams (SNR p418, p536) show the wick through and the body closing back below. Follow the diagram.
- Also: a buy needs a **bearish** rejection candle and a sell a **bullish** one (SNR p414-417). This conflicts with p96 ("colour does not matter" for HTF rejection). Different contexts, but confusing.

### Lesson 12. Stop and target (SNR p435-441, p547-550)

**Stop**
- "Always use at least 30 pips as your SL … never less" (SNR p435, p547).
- Or beyond the confirmation: 5M QM apex, 15M rejection wick, last swing before the TL break, the broken gap, the last swing at the EMA break (SNR p435, p548).
- If 30 pips do not cover the level, widen it. "Catching big RR … is not the priority" (SNR p436).

**Target**
- QMS trades: the next fresh level or TL of the storyline's TF (SNR p436-437).
- Ladder: daily vs weekly conflict → daily TP. Aligned → weekly TP. Weekly and monthly aligned → monthly TP.
- Continuation trades: next fresh level/TL, OR a **fixed 1:2 or 1:3** (SNR p549-550).

**Management** (very little): "price hit BE after 7 RR" (SNR p482); never remove the stop (SNR p594); "Set and Forget" (SNR p594); do not move the stop on hope (SNR p597).

### Lesson 13. Continuation and mini storylines (SNR p489-586)

- Part 1 of a storyline = QMS setups. Parts 2-3 = continuation setups at C.APEX / GAP / SBR-RBS (SNR p489-493).
- Mini storylines (4H, 1H, 30M, 15M) each have 3 parts. Their part 1 is a QM one or more TFs lower: 4H ← 1H/30M/15M, 1H ← 30M/15M, 30M ← 5M, 15M ← 1M (SNR p494-497).
- Inside weekly parts 2-3: 4H minis only. Inside daily: 4H or 1H (SNR p500-502).
- A 4H level needs 1H and 30M/15M A/V levels at the same price. "You shouldn't take your trade directly from the 4H level without LTF confirmation" (SNR p516-517).
- Trader types: QMS = swing/intraday. Minis and SNR-level setups = intraday/scalp with fixed 1:2-1:3 (SNR p583-586).

### Lesson 14. Psychology rules (SNR p592-600, p626)

- Max 3 losses a day, then stop (SNR p595).
- 10-minute break after each trade; a break after a big win (SNR p595-596).
- 15-minute timer before any entry; "5-second rule" for valid setups (SNR p593, p597). (These two sound opposite; the notes do not explain how they fit.)
- 2-3 trades a day max, fixed 2-hour session (SNR p626).

### SNR: the book's own unclear points and contradictions

1. External only (SNR p74) vs "after the touch can count" on LTFs (SNR p126).
2. Weekly/Daily Advanced breakout TF: text p250-251, p258-259 vs diagrams p239, p252, p260, p270.
3. 3rd TL touch best "for a breakout" (p139) vs "for entries" (p192).
4. SBR/RBS swapped on p368.
5. C.APEX: text vs diagram (p369-370).
6. Candle rejection: text p416 vs diagrams p418/p536.
7. Section "5.1" for SL/TP is misnumbered (p435).
8. "Power of Four" lists five items (p589).
9. Gap level: the definition is thin (p17, p22).
10. The EMA 9 and the "SNR Levels with Editable Port Logic" indicator are on every chart from p1, but explained only at p413-420 (EMA) or never (the SNR indicator) (snr1, snr2).
11. Risk formulas and their worked numbers disagree (see Red flags).
12. Pitchou's SNRC1/SNRC2 are **not** Bystra's SNRC1/SNRC2. See the glossary.

---

## 4. Combined glossary

PoB = Bystra. SNR = Malaysian SNR. "Both" = term appears in both, meanings compared.

| Term | Meaning | Book | Page |
|---|---|---|---|
| A-shape | Up candle then down candle; a peak. Resistance; support once broken | SNR | p17-19 |
| Advanced storyline | Storyline from an HTF trendline + breakout, no rejection step. Used when no fresh levels left | SNR | p237-266 |
| Alignment (MTF) | M/W/D levels or TLs at the same price; the lower TF breaks first and leads | SNR | p313-323 |
| APEX | The extreme point of the QM (lowest for bullish). Last-resort entry | SNR | p368-370, p398 |
| BEE / BUE | Bearish / Bullish Engulfing | PoB | p75-76 |
| Beginning / Middle / End of trend | Three parts of a trend; trade in the first two | PoB | p17-18 |
| Blindspot ("swap") | Failed engulfing + significant break + retest of the line | PoB | p139-160 |
| Body candle | A non-engulf HTF confirmation candle; size not given | PoB | p25, p45 |
| Breakout (BO) | Body close beyond a level; must form a QM (except continuation) | SNR | p31-37 |
| Breaking gap | 15M/5M gap broken by an engulfing; enter on the pullback | SNR | p413-417 |
| C.APEX | Continuation apex: the pullback extreme inside a trend (text vs diagram unclear) | SNR | p369-370 |
| CC (Confirmation Candle) | 3rd candle after a level forms, pointing the level's way; keeps an unfresh level valid | SNR | p96, p139 |
| CK1 | Any setup + strong SnR + one trendline (3rd touch) | PoB | p176-184 |
| CK2 Align / Cross | Two trendlines meeting at a strong SnR level; entry at the apex (3) | PoB | p186-200 |
| CK3 | Any setup + CK2 + HTF "solid engulfing"; "the strongest" | PoB | p202-210 |
| CLAB | "Confirmation Like a Boss": trendline 1-2-3 where 2 is an engulf or base | PoB | p168-174 |
| Classic storyline | Fresh level + rejection + breakout ("1+2+3"), level to level | SNR | p210-230 |
| Confirmation | PoB: HTF engulf/body candle at the same line (p19-25). SNR: LTF trigger at the entry level (rejection, gap, TL, QM, EMA) (p413-434). Different meanings | Both | see left |
| Continuation breakout | Breakout inside a trend without a QM | SNR | p179-191 |
| Danger Zone | The end of the trend for your trade (the opposite zone, at the old trend's origin). Touched = invalid | PoB | p17-18, p28-30, p61 |
| DBD / RBR / RBD / DBR | The 4 base patterns (drop/rally-base-drop/rally). The only "entry points" | PoB | p5-9 |
| Drawdown (TL) | A wick pierces an HTF TL before the real breakout | SNR | p150-151 |
| Drive 1/2/3 | Successive trendline touches in QMC / QM2P | PoB | p107-108 |
| Dual-side rejection | Bull and bear BOs at one level; follow the HTF side | SNR | p392-395 |
| Early breakout | Breakout on the next-higher TF than the map says | SNR | p121-125 |
| EBD | Chart label only; maybe Engulf-Base-Drop. Unclear | PoB | p134 |
| EMA confirmation | 5M engulfing candle breaks EMA 9 (close); enter at once | SNR | p413-421 |
| Engulfing | A candle whose body covers the previous candle. Body vs wick never fixed | PoB | p4, p20, p73 |
| ERS | Early Right Shoulder: mini V/A just before the QM BO; use the last one | SNR | p371-372, p401 |
| External / internal BO | Breaks the last A/V before (external, valid) / after (internal, invalid) the touch | SNR | p37-44, p74 |
| Failed engulfing | An engulf that does not follow through and is later broken | PoB | p74, p140-141 |
| FAST | "I always FAST Hybrid 1". Never defined | PoB | p33 |
| Fresh | PoB: used once, undefined (p106). SNR: never touched, or body-broken; wick touch = unfresh (p23-25) | Both | see left |
| Gap level | Junction of two same-colour candles. Bullish = support, bearish = resistance | SNR | p17-22 |
| GAP (QM level) | A body-to-body gap inside the QM shift; needs LTF alignment to trade | SNR | p368, p409-412 |
| H / L / HH / LL | Swing labels used to build the QM | Both | PoB p90-91; SNR p34-35 |
| Hybrid 1 | Reversal: trend ends, retest at RBR/DBD/QMR, no Danger Zone touch | PoB | p28-34 |
| Hybrid 2 | Hybrid 1 + new trendline 1-2 that breaks the old trend + HTF engulf; entry at 3 | PoB | p35-43 |
| LS (Left Shoulder) | The level before the apex. In PoB it is the QM line (H for sell, L for buy) | Both | PoB p89-91; SNR p368-370 |
| Manipulation | HTF engulf, LTF DBD/RBR inside its body; "more high risk than QMR" | PoB | p161-167 |
| Mini storyline | 3-part storyline on 4H/1H/30M/15M | SNR | p494-504 |
| MISS setup | SBR where a falling TL from the apex meets it (diagram only) | SNR | p381-388 |
| Proximity | The confirmation nearest the entry level is best | SNR | p432-434 |
| QM / QML | Quasimodo: H, L, HH, LL (sell) or L, H, LL, HH (buy). Line at the left shoulder | Both | PoB p88-91; SNR p34-35 |
| QM2P | QMR with a 2-point head; trendline 1-2 meets QM line at 3 | PoB | p119-128 |
| QMC | PoB: QM + trendline in a continuation trend, 3rd drive meets QM line (p106-108). SNR: QM + TL through swings, entry at LS where TL crosses (p381-388). Similar | Both | see left |
| QMM | A failed QMR; trade the left-shoulder line the other way, with a base at it | PoB | p129-138 |
| QMR | QM Reversal. "High risk" | PoB | p89-105 |
| QMS setups | QM-based setups at the start of a storyline | SNR | p374-388 |
| Refinement | Long-wick HTF apex → use the fresh level on the next lower TF; 15M last | SNR | p389-391 |
| Rejection | Touch of a fresh level and turn away; close needed per TF table | SNR | p92-96 |
| SBR / RBS | Support-becomes-resistance (bearish) / resistance-becomes-support (bullish). First entry choice in a clean QM | SNR | p368-370, p396-400 |
| Significant break | One big candle closing through the failed-engulf line; no size given | PoB | p140-159 |
| SNRC1 | **PoB**: strong resistance + RBR (buy) / strong support + DBD (sell) at the same line (p44-57). **SNR**: a small candle at the SBR (diagram p381-388). Different | Both | see left |
| SNRC2 | **PoB**: strong level broken, then RBD/DBR at the line, retest (p58-71). **SNR**: "first 3 candles gives the snrc 2 setup, our entry based on the fourth candle" (p486). Different | Both | see left |
| SNRC3 | Failed engulf of one side, then the other side's engulf at the same line. "Not a setup" yet has a formula | PoB | p72-87 |
| SOP | Standard operating procedure (same as SNRC1/2) | PoB | p73 |
| Solid engulfing | HTF engulf with a body much bigger than the prior; "solid" undefined | PoB | p203-210 |
| Storyline | Price flowing from level/TL to level/TL across TFs; 3 parts | SNR | p203-209, p334-337 |
| Strong SnR | A prior swing level. "Strong" never defined | PoB | p45-70, p186 |
| Trendline (TL) | PoB: through swing wicks (mostly). SNR: through 2+ A or V points on closes; up to 5 touches, 3rd best | Both | PoB p153-184; SNR p28-30, p139 |
| V-shape | Down candle then up candle; a trough. Support; resistance once broken | SNR | p17-19 |
| "x" | Means "not" in chart labels | PoB | p37, p40-42, p51 |

---

## 5. Side by side: Bystra vs SNR vs Raja

Legend: **=** agree, **≠** differ, **?** a book is silent or unclear.

| Topic | Bystra (PoB) | Malaysian SNR (Pitchou) | Raja | Verdict |
|---|---|---|---|---|
| **What a zone/level is** | A line at a strong S/R + a base (RBR/DBD/RBD/DBR), or an engulfing open, or a QM shoulder (PoB p5-9, p45, p89) | A single line at an A/V/Gap body junction (SNR p17-22) | A box: base of 1-6 small candles + departure at least 2x the base (L55) | ≠ PoB and SNR use **lines**; Raja uses a **box** |
| **Wick vs body** | Mostly body edge (engulf open, failed-engulf body); box sometimes to the wick tip. Unclear (PoB p21-24, p75-76, p140) | **Body** (open/close junction) (SNR p20-24) | Demand: bottom **wick** to body. Supply: top wick to body (L55) | ≠ Raja's stop side uses the wick; SNR ignores wicks |
| **Freshness** | Only "Fresh" once, undefined (PoB p106). Lines retouched many times still used (PoB p94) | Fresh = untouched or **body** broke it. **Wick** touch = unfresh. Good ~2 uses (SNR p23-25, p139) | Only the **first touch** is set-and-forget; poked in = tested; 2nd/3rd = confirmation; 4th breaks (L2, L52) | ≈ SNR and Raja agree a wick touch spends a level. ≠ SNR's body-break **resets** to fresh; Raja has no reset |
| **Direction** | Trend reading + trendlines; continuation preferred (PoB p10-16, p27) | QM breakout on the mapped LTF at a fresh HTF level. A **1H** BO starts the daily storyline (SNR p161-163, p345) | M/W/D only, **never H1**. Change = TL cross + **two** opposite zones removed (L3, L7) | ≠ SNR lets a 1H break set daily direction; Raja forbids H1 for direction and needs two zones removed |
| **Timeframe ladder** | None fixed. M5→H1, M30→H1, H4→D in examples (PoB p21-22, p38) | Strict map: M→D, W→4H, D→1H, 4H→1H/30m/15m, 30m→5m, 15m→1m (SNR p99) | M+W agree → trade fresh daily zones. Confirm one TF lower (D1→H1, H1→M15) (L8, L52) | ≈ SNR and Raja both go top-down with fixed steps; PoB is loose |
| **Where not to trade** | Danger Zone = end of trend; don't sell at demand (PoB p17) | Against alignment; mixed signals = wait (SNR p305, p317) | High curve/low curve; never sell in a demand (L4, L50) | **=** all three: don't sell into demand, don't buy into supply |
| **Confirmation** | HTF engulf/body candle at the same line (PoB p19-25). Always wanted | LTF trigger: rejection, gap, TL, mini QM, **5M EMA9 engulf**. "No confirmation? No setup." (SNR p401, p413-420) | Strong/arrival fresh zone: **no confirmation** (set and forget). Weak/tested: confirm one TF lower (L1, L52) | ≠ Both books always confirm; Raja does not on fresh strong zones. ≠ PoB confirms **upward** (HTF), SNR and Raja **downward** (LTF) |
| **Indicators** | None | EMA 9 (close) on every chart (SNR p420) | **No indicators** (L51, L101) | ≠ SNR's main trigger breaks a Raja rule |
| **Entry** | Limit at the line on the first return (PoB p75-76, p143-210) | Market at the confirmation close (EMA, TL, rejection) or limit on a pullback (gap, mini QM) (SNR p414-417) | Limit at the proximal (L55); or market after close back across proximal (L105) | ≈ PoB and Raja (limit at the line). SNR mostly market on trigger |
| **Stop** | **Not given** | ≥ 30 pips or beyond the confirmation (SNR p435, p547) | Beyond the distal by % of zone height, min 3 pips (owner rule, ZV 2.10) | ≠ SNR's fixed minimum vs Raja's zone-based stop |
| **Target** | **Not given** | Next fresh level/TL of the storyline TF; or fixed 1:2/1:3 (SNR p436-437, p549) | 7 pips before the opposite zone's proximal; LTF entry, HTF target (L7, L106) | ≈ SNR and Raja: next level / opposite zone. PoB: nothing |
| **Room / R:R filter** | None | None stated (examples show 3R to 138R) | Room ≥ 2x stop, 3x preferred (L7, L53) | ≠ only Raja filters by room |
| **Risk** | **Not given.** Screens show 5-50 lots (PoB p97-98, p132-134, p173, p197) | "NEVER exceed 1%" funded; personal examples 5-30% (SNR p611-617) | 1-2% max, start 0.01 lots (L7) | ≠ PoB silent; SNR self-contradicts; Raja is the only clean rule |
| **Flip levels** | SNRC2 = trade the broken, retested level (PoB p58-71) | SBR/RBS = the first entry choice (SNR p396-400) | **Flip area = confirmation only** (L2, L52) | ≠ Both books trade flips as main setups; Raja downgrades them |
| **Gaps** | Not used | GAP levels tradeable with LTF alignment (SNR p409-412) | Use the zone **before** the gap, not the gap (L55) | ≠ |
| **Reversals** | "High risk" (QMR, Hybrids, Manipulation) (PoB p28, p89, p161) | QM breakout at a fresh level is the core (SNR p34, p161) | V / inverted V reversal zones are **preferred** (L55) | ≠ PoB avoids reversals; Raja prefers them |
| **Touch count** | No limit (PoB p94) | SNR level ~2 uses; TL up to 5, 4th/5th with confirmed BO (SNR p139) | Never the 4th touch of a zone **or trendline** (L102, L103) | ≠ SNR allows TL touches 4-5 |
| **Breaks** | Not specified | Body close only (SNR p35, p37) | Full candle close; wick never counts (L4, L50) | **=** SNR and Raja agree |
| **Gold on LTF** | XAUUSD M5 examples (PoB p21, p50) | XAUUSD 5M/1M entries are the main examples | Never XAUUSD on low TFs; use XAUAUD (L53, L107) | ≠ both books |
| **What's unique** | HTF engulf confirms an LTF line; Danger Zone; QM family (QMR/QMC/QM2P/QMM); trendline point-3 entries | Body-only levels; fresh by wick; external-only breakouts; level→BO TF map; storyline nesting; 30-pip min stop | Strong / arrival / weak verdict; curve 25/50/75; two-zone direction change; wow pips; two positions | - |

### Rules from these books that would conflict with Raja

1. **SNR: 5M EMA 9 engulf trigger** (SNR p413-420) vs Raja "no indicators" (L51, L101).
2. **SNR: 1H breakout starts the daily storyline** (SNR p345) vs Raja "never take direction from H1" (L7).
3. **SNR: one QM breakout = trend change** (SNR p67) vs Raja "two opposite zones removed" (L3).
4. **SNR: "No confirmation? No setup."** (SNR p401) and **PoB: always confirm** (PoB p19, p26) vs Raja set-and-forget on fresh strong zones (L1, L101).
5. **SNR SBR/RBS and PoB SNRC2** (flip-level setups) vs Raja "flip area: confirmation only" and "never set and forget a flip zone" (L2, L52).
6. **SNR: TL touches 4 and 5 valid with a breakout** (SNR p139) vs Raja "never trade the 4th touch" (L102, L103).
7. **SNR: trade GAP levels** (SNR p409) vs Raja "use the zone before the gap" (L55).
8. **SNR: stop ≥ 30 pips** vs Raja's zone-height stop. Not a hard conflict, but on small zones it makes the stop far bigger than Raja's.
9. **SNR: fixed 1:2-1:3 targets** vs Raja's "target the opposite zone, room ≥ 2x".
10. **SNR personal-account risk 5-30%** vs Raja 1-2% (L7).
11. **Both books trade XAUUSD on 5M/1M** vs Raja's "never XAUUSD on low TFs" (L53, L107).
12. **PoB: reversals are high risk** vs Raja preferring V / inverted-V reversal zones (L55). A difference of view, not a rule clash.
13. **PoB: no touch limit** (PoB p94) vs Raja's 4th-touch rule.

Where they **agree** with Raja: no selling into demand / buying into supply (PoB Danger Zone, SNR alignment, Raja curve); breaks need a body/candle close (SNR, Raja); a wick touch spends a level (SNR, Raja); top-down timeframes (SNR, Raja); limit entry at the line (PoB, Raja); RBR/DBD as zones (PoB entry points = Raja's CP, L55).

---

## 6. Red flags

Blunt version.

### Bystra

1. **No stop-loss, no take-profit, no risk rule. Anywhere.** 212 slides and not one (pob1 §3-4, pob2 §3-4, pob3 §3-4). A method without a stop is not a method you can trade or test as written.
2. **Huge lot sizes, no account size.** Screens show 10 lots (PoB p49 twice, p97, p173), 50 lots (PoB p98 DE30, p197 XAUUSD), 5 lots (PoB p132, p133 twice), 20 lots (PoB p134). No balance is ever shown. You cannot tell the risk per trade.
3. **Every example is a winner.** About 40 examples in pp143-212 alone; all win (pob3 §5). No losing trade, no failed setup, no P/L, no statement in any range.
4. **Reused charts.** p21 = p65, p22 = p66, p23 = p67, p24 = p68 (pob1 §5). The same few winners count twice.
5. **Most charts have no symbol, no timeframe, no price axis** (pob3 intro). Only a handful show pair and TF.
6. **Key words never defined:** "strong", "fresh", "solid", "significant", "FAST". The setups depend on them.
7. **The few "sl" lines are odd.** On p133 the "sl" sits above buy entries; on p197 it sits below a sell entry. Both look like stops already moved into profit, or something else. Unclear. Do not read a rule from them.
8. No performance numbers at all. Only words like "more safe" and "strongest" (PoB p17, p202).

### Malaysian SNR (Pitchou)

1. **Risk math is wrong, and it contradicts itself.**
   - The book says "NEVER exceed 1% risk per trade" (SNR p611-617) and "1-2% risk per trade" (SNR p623, p627).
   - The personal-account examples risk **5%** ($25 of $500, Phase 1), **10%** ($100 of $1K, Phase 2) and **30%** ($60 of $200, Phase 3) per trade (SNR p611-617).
   - The formulas do not give the worked numbers. Phase 1 personal: (500 × 5%) ÷ 10 = $2.50, not $25. Phase 2 funded: $2,500 ÷ 20 = $125, not $250.
   - Phase 1 funded: $333 on a 30-pip gold stop is about 1.1 lots, not the 0.33 lots stated.
   - Phase 3 personal stops only at −30% drawdown.
2. **No backtest.** The exercises are "designed to replace backtesting" (SNR p5). "Tested and proven" (SNR p3) with no proof shown.
3. **Hand-picked hindsight charts.** RRs of 49.92, 26.2, 23.21, 138.42, ~46-48 (SNR p446-477) are TradingView position-tool boxes drawn after the fact. Some are "Open P&L", not closed trades. One loser (SNR p569) and one break-even (SNR p482) in the whole book.
4. **Unverifiable claims.** "From $5K to $200K funded" (SNR p611). "You'll never fall for fake breakouts again" (SNR p197). "Predicting the market's next move with precision" (SNR p318). Student "results" are a cropped screenshot collage with no dates or account check (SNR p634-635). A testimonial: $0.37 to $1,885.32 with **10% risk per trade** (SNR p638).
5. **The only real data is one student journal, and it is weak** (SNR p606-609):
   - Jan 2025: 13 trades, 3 wins, 9 losses, 1 BE, net about **−30.6** (units as logged).
   - Feb 2025: 13 trades, 6 wins, 6 losses, 1 BE, net about **+235.7**.
   - Combined win rate about 9/26 ≈ **35%**. 26 trades, mixed prop accounts, one student. It proves nothing either way. It does show the method lives on a low win rate and big winners.
6. **Undisclosed indicator.** Every chart shows "SNR Levels with Editable Port Logic". The book never explains it (snr1 intro).
7. Many small contradictions (listed at the end of section 3).

### Both books, and our evidence

- Our own evidence review (`docs/research/Evidence_Review_2026-10.md`) found **zero** verified live records for S&D zone methods, and our mechanical zone tests were **negative** after realistic close-stop losses. ESMA: 74-89% of retail CFD accounts lose.
- These two books add **no** verified evidence. Treat every rule as an idea to test, not a fact.

---

## 7. What is worth testing

Ranked by **promise** (how likely it adds something to what ZoneVision and Raja already do) and **effort** (S = small, M = medium, L = large).

How a test works here:
- **Preset** = a set of ZoneVision inputs, like the existing Raja template (`InpRj*` inputs). The presets below are **proposals**; the inputs do not exist yet.
- **Zone scorecard test** = log a new column in the research CSV (`docs/Zone_Research_HowTo.md`), then compare zones with the flag vs without in the scorecard (`src/core/zones/score.ts`): close stop, fresh touch, fixed R target, n ≥ 30 (`MIN_N`), bootstrap 95% interval.
- **Pass rule (suggested, same spirit as our evidence review):** expectancy per trade > 0 with the lower 95% bound > 0, on the in-sample **and** the out-of-sample period, on most symbols, both directions. Otherwise the rule is dropped.

| Rank | Rule | Book | Promise | Effort |
|---|---|---|---|---|
| 1 | Fresh / unfresh by wick on body-junction A/V levels | SNR | High | S |
| 2 | External QM breakout at a fresh HTF level, with the level→BO TF map | SNR | High | M |
| 3 | HTF engulf confirmation at an LTF zone | PoB | Medium-high | S |
| 4 | Next fresh HTF level as target | SNR | Medium | S |
| 5 | Danger Zone invalidation | PoB | Medium | M |
| 6 | 5M EMA9 engulf trigger + 30-pip min stop | SNR | Medium (but anti-Raja) | S-M |
| 7 | QMR / QMM / QMC | PoB (+SNR) | Medium | M |
| 8 | SNRC1 / SNRC2 / SNRC3 | PoB | Medium-low | M |
| 9 | Blindspot | PoB | Low | M |
| - | Skip for now: Hybrid 1/2, CLAB, CK1-3, MISS, Double TL-SBR, storyline 3-part split, risk phases | both | Low (too discretionary) | L |

### 7.1 Fresh / unfresh by wick (SNR p17-25). Promise high, effort S.

Why: it is a sharper freshness rule than "first touch", and it is nearly the same as Raja's "poked in = tested". Cheap to log.

Logic:
```
A-level at bar i:  close[i-1] > open[i-1]  AND  close[i] < open[i]   ; L = close[i-1]
V-level at bar i:  close[i-1] < open[i-1]  AND  close[i] > open[i]   ; L = close[i-1]
Gap level:         same colour bars i-1, i                            ; L = close[i-1]   (unclear: or open[i])
For bars j > i+1 (A-level; V is the mirror):
  if min(open[j],close[j]) > L  -> body broke above: FRESH again (reset)
  elif high[j] >= L             -> wick touched:     UNFRESH
  else                          -> still FRESH
CC: bar i+2 is red (A) / green (V) -> keep valid even if unfresh.   (unclear: count may start at i-1)
```
Scorecard test:
- New columns: `snr_level_at_proximal` (an A/V body level within 0.1×ATR of the zone's proximal), `snr_fresh_at_touch` (1/0).
- Compare touch-1 zones with `snr_fresh_at_touch = 1` vs `0`. Also compare against the current ZoneVision freshness.
- Preset idea: "SNR levels" = draw A/V/Gap lines on D1/H4, colour fresh vs unfresh.

### 7.2 External QM breakout + TF map (SNR p34-44, p74, p99). Promise high, effort M.

Why: this is the book's real filter against fake breakouts. It is close to Raja's "arrival" (crossed the line and removed the opposite zone). Testing it tells us if SNR's version adds anything.

Logic:
```
MAP = {MN:D1, W1:H4, D1:H1, H4:[H1,M30,M15], H1:[M30,M15], M30:M5, M15:M1}
1. HTF fresh level L (from 7.1) on TF T.
2. t_touch = first LTF bar (TF = MAP[T]) whose wick reaches L.
3. Rejection gate: T in {MN,W1} -> none; T = H1 -> H4 bar closes back on origin side;
   else T's own bar closes back on origin side.  (SNR p93)
4. Ref = last LTF A (bull case) / V (bear case) swing formed BEFORE t_touch.
5. Signal = first LTF bar whose BODY CLOSES beyond Ref.   (external BO; ignore swings after t_touch)
6. QM check (bear): swings H, L, HH (= the touch), then close < L.  Bull is the mirror.
7. "Strong body": body/range >= 0.5  (threshold NOT in the book; tune it)
```
Scorecard test:
- New columns: `snr_ext_bo` (an external QM BO in the zone's direction happened before the touch / at zone creation), `snr_int_bo_only` (only an internal BO).
- Compare `snr_ext_bo = 1` vs `0`, and vs Raja `arrival`. If external BO does not beat arrival, drop it.
- Preset idea: "SNR breakout" = show a marker on the mapped LTF when an external BO fires at a fresh HTF level.

### 7.3 HTF engulf confirmation of an LTF zone (PoB p19-25, p45, p59). Promise medium-high, effort S.

Why: one simple, mechanical check that the book uses on almost every setup.

Logic:
```
HTF = next TF up from the zone TF (M15->H1, M30->H1, H1->H4, H4->D1)   (PoB shows M5->H1, M30->H1, H4->D1)
Bull engulf on HTF bar k:  close[k]>open[k], close[k-1]<open[k-1],
                           close[k] >= open[k-1], open[k] <= close[k-1]        (body vs body)
Variant B (wick engulf):   also high[k] >= high[k-1], low[k] <= low[k-1]
Confirm if: the HTF engulf's body contains the zone proximal, OR |open[k] - proximal| <= 0.1*ATR(HTF)
            AND the engulf bar's range has not reached the Danger Zone (7.5)  (optional)
```
Scorecard test: column `pob_htf_engulf` (0 / body / wick). Compare 1 vs 0 on touch 1 and on tested zones. Raja only confirms weak zones, so also split by Raja verdict.

### 7.4 Next fresh HTF level as target (SNR p436-437). Promise medium, effort S.

Logic:
```
Target = proximal of the next FRESH level (7.1) of the storyline TF in trade direction
         (H1 BO -> daily level; H4 BO -> weekly level).
Ladder (optional): if D and W directions agree -> weekly level; if W and M agree -> monthly level.
```
Scorecard test: add a target mode "next SNR fresh level" next to the existing fixed R and `opp` targets. Compare with Raja's `opp` (7 pips before the opposite proximal).

### 7.5 Danger Zone invalidation (PoB p17-18, p28-30, p61). Promise medium, effort M.

Why: a filter, not a setup. It overlaps Raja's curve (no buying in the high curve), so a test tells us if it adds anything.

Logic:
```
Trade direction = SELL after an uptrend (BUY is the mirror):
O = the swing low where the last uptrend leg started (the origin); DZ = the demand zone at O
    (use the ZoneVision zone nearest O, else [low(O), low(O)+0.25*ATR])     (box size NOT in the book)
Invalid if any low between setup formation and entry <= DZ top.
"End of trend" proxy: p = (price - O) / (E - O) over the last leg O->E; end = p in the last third.
   (thirds are an ASSUMPTION; the book gives no numbers)
```
Scorecard test: column `pob_dz_touched` (1/0) and `pob_trend_third` (1/2/3). Compare against Raja `curve` (high/low curve). If they say the same thing, drop it.

### 7.6 5M EMA9 engulf trigger + 30-pip min stop (SNR p413-421, p435). Promise medium, effort S-M.

Why: the only fully mechanical entry in either book, and the one the student journal used. **It breaks Raja's "no indicators" rule**, so test it as a separate SNR preset, never as a Raja change.

Logic:
```
Armed when price is inside the entry zone (from 7.1 / 7.2 or a ZoneVision zone), on M5:
  EMA = EMA(9, close)
  SELL: bar k bearish, body engulfs bar k-1 body, close[k] < EMA[k] and close[k-1] >= EMA[k-1] (or open[k] > EMA[k])
  BUY:  the mirror
  Rare case: if the 5M QM formed already beyond the EMA -> wait for a pullback to the 5M QM level (SNR p421)
Proximity: |entry - level| <= k pips (k NOT in the book; e.g. 10)
Entry: market at close[k]
Stop:  max(30 pips, distance to the last swing beyond the EMA break + buffer)   (gold pip = 0.10)
Target: fixed 3R (continuation) or 7.4
```
Test: this is an entry model, so it fits the bot/sim side better than the zone scorecard. A research-CSV version: for each touch-1 zone, log `snr_ema_fill` (did an M5 EMA9 engulf fire inside the zone within N bars) and its R outcome with the 30-pip stop. Compare with the proximal limit entry.

### 7.7 QMR / QMM / QMC (PoB p88-138; SNR p34-35, p381-388). Promise medium, effort M.

Logic:
```
Swings: fractal pivots (n bars each side) or SNR A/V points on closes.
QMR SELL: H, L, HH > H, then close < L.  Line = H (body-top variant AND wick variant: test both).
          Limit sell at H on the first return.  Mirror for BUY.
QMM BUY:  a QMR SELL was set at H, but price closes back ABOVE H before / after entry (failure),
          and an RBR or DBR base sits at H  ->  limit BUY at H.  Require an HTF engulf (7.3) (PoB p129).
QMC:      QMR swings + a trendline through drive1 and drive2 (HH for sell / LL for buy = drive2);
          entry where TL(t) is within tol of the QM line.  Needs a trend filter (continuation only).
```
Scorecard test: tag ZoneVision zones whose proximal sits at a QM left shoulder: `qm_type` = QMR / QMM / none. Compare. QMC needs the ZoneVision `Trendlines` output; do it after QMR/QMM.

### 7.8 SNRC1 / SNRC2 / SNRC3 (PoB p44-87). Promise medium-low, effort M.

Logic:
```
Strong level S = a fractal swing high/low (n-bar) or a level touched >= 2 times   ("strong" NOT defined; proxy)
SNRC1 BUY:  later an RBR whose base overlaps S (within tol) and leg-out closes above S -> limit buy at S.
SNRC2 SELL: close below support S (break); then a rally with a high above S forming an RBD base;
            then a close back below S whose low stays above the Danger Zone -> limit sell at S.
SNRC3 SELL: bull engulf at S fails (a later close below its body bottom);
            then a bear engulf whose body straddles S -> limit sell at S on the first retest.
```
Scorecard test: `pob_snrc` = 1/2/3/none. **SNRC2 is the most useful one to test**, because it is a flip-zone trade and Raja says flip zones are "confirmation only" (L2, L52). The test directly checks a Raja rule.

### 7.9 Blindspot (PoB p139-160). Promise low, effort M.

Logic:
```
Failed engulf (BUY case): bar i-1 bullish, bar i bearish engulfing it. L = open[i] (alt: high of the pair).
Significant break: within N bars, a bar j with body >= k*ATR(14) closes > L.   (k NOT in the book; try 1.5-2)
Entry: limit buy at L on the first touch.  Expiry / invalidation: NOT in the book (our assumption).
```
The book itself warns "not all types of swaps can be trusted" (PoB p139). Test only if 7.3 and 7.7 show promise.

### 7.10 What to supply ourselves (not from the books)

Every Bystra test needs a stop and a target the book does not give. Use the ZoneVision defaults (stop beyond the distal, fixed R or `opp` target) and **label them as ours**, not Bystra's.

### Suggested order

1. 7.1 + 7.4 together (one new level detector, one new target). 
2. 7.3 (one column).
3. 7.2 (needs 7.1).
4. 7.5 and 7.8-SNRC2 (both test Raja rules: curve and flip).
5. 7.6 as a separate SNR preset in the sim.
6. 7.7, then 7.9.

---

## 8. Cheat sheets

### 8A. Bystra cheat sheet

- **Tools:** engulfing candle; RBR / DBD / RBD / DBR (PoB p4-9).
- **Read the trend:** reversal, continuation, sideways (PoB p10-16).
- **Danger Zone:** the end of the trend = the opposite zone at the old trend's start. Touched = invalid (PoB p17-18, p28, p61).
- **Trade in the beginning or middle** of a trend. "Dont be silly by selling at the demand zone area" (PoB p17).
- **Find the setup on the LTF, confirm on the HTF** with an engulf (best) or body candle at the same line (PoB p19-25).
- **Continuation setups (preferred):**
  - SNRC1 = strong level + RBR (buy) / DBD (sell) at the same line (PoB p45-46).
  - SNRC2 = level breaks, RBD/DBR forms at it, retest; drop must not reach the DZ (PoB p59-61).
  - SNRC3 = failed engulf, then opposite engulf at the same line (PoB p74).
  - QMC = QM + trendline, entry at the 3rd drive (PoB p106-108).
- **Reversal setups ("high risk"):** QMR (H, L, HH, LL → back to H), QM2P, QMM (failed QMR), Blindspot, Manipulation, Hybrid 1/2 (PoB p28-167).
- **Add-ons:** CLAB, CK1 (1 TL), CK2 (2 TLs: align or cross), CK3 (CK2 + HTF solid engulf). Entry = point 3 (PoB p168-210).
- **Entry:** limit at the line, first return.
- **Missing:** stop, target, risk, touch limit. Supply your own and say so.
- **Watch out:** "strong", "fresh", "solid", "significant", "FAST" are not defined.

### 8B. Malaysian SNR cheat sheet

- **Levels:** A (peak), V (trough), Gap. Drawn at the **body junction** (SNR p17-22).
- **Fresh:** untouched, or a body broke it. **Unfresh:** a wick touched it (SNR p23-25). ~2 uses (SNR p139).
- **Trendlines:** 2+ A or V points on closes. Max 5 touches; 3rd best (SNR p28, p139).
- **Breakout:** body close beyond, must make a QM (H, L, HH, LL) (SNR p34-37).
- **External only** at SNR levels: break the last A/V **before** the touch (SNR p37-44, p74).
- **Rejection close:** M/W none; D/4H/30m/15m own close; **1H needs the 4H close** (SNR p93).
- **TF map:** M→D, W→4H, D→1H, 4H→1H/30m/15m, 1H→30m/15m, 30m→5m, 15m→1m (SNR p99).
- **Storyline:** fresh level + rejection + breakout = Classic; TL + breakout = Advanced. Level to level (SNR p210-266).
- **Don't trade against M/W/D alignment.** Mixed = wait (SNR p305, p317).
- **Entry level ladder:** SBR/RBS first, then LS/GAP, then APEX; last ERS (SNR p396-402).
- **Trigger:** 5M engulf through EMA 9 (close); or rejection, gap, micro-TL, mini QM. Closest to the level is best (SNR p413-434).
- **Stop:** ≥ 30 pips (gold 3.00) or beyond the trigger swing (SNR p435).
- **Target:** next fresh level/TL; continuation = fixed 1:2-1:3 (SNR p436, p549).
- **Rules of the day:** max 3 losses, 2-3 trades, 10-min break after each trade (SNR p595, p626).
- **Risk:** use 1% or less. Ignore the 5-30% examples (SNR p611-617).
- **Conflicts with Raja:** EMA, H1 direction, flip and gap levels, 4th/5th TL touches, gold on 5M/1M.
