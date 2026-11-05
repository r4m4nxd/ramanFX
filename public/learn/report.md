# What the scanners learned

Updated 2026-11-05T17:39:12Z · mode: auto

## Currencies, metals and indices

Rules tested: 18 · results from 2026-11-03T07:32:25Z

**In use** (0)
- none

**Waiting for a second confirmation** (0)
- none

**Not better** (12)
- Skip the trade when price crawled into the zone (small candles or two or more basing pauses in the last 10 bars). · too few trades (13 older, 7 recent)
- Move the stop to the entry once the trade has been +1R in profit. · too few trades (67 older, 21 recent)
- Never trade continuation zones (rally-base-rally / drop-base-drop). · too few trades (41 older, 14 recent)
- Trade a continuation zone only when its proximal lies inside a same-side zone of the next higher timeframe. · too few trades (41 older, 14 recent)
- Move the stop to the entry once the trade has been +2R in profit. · too few trades (67 older, 21 recent)
- After +1.5R, move the stop to the lowest low (buy) / highest high (sell) since the fill, only ever tightening. · too few trades (67 older, 21 recent)
- Half the position at the proximal, half at the middle of the zone, same stop and target. · too few trades (67 older, 21 recent)
- Cancel the pending order once price has moved half way from the entry to the target without filling. · too few trades (52 older, 20 recent)
- Trade continuation zones only on the daily timeframe and higher. · too few trades (53 older, 17 recent)
- Target exactly 3R instead of the next opposite zone. · too few trades (64 older, 21 recent)
- Target just before the nearest opposite zone of the entry timeframe or higher; skip the trade if that is under 2.5R. · missing results
- A zone counts as used only after a candle body went inside it; wick-only touches keep it fresh. · too few trades (67 older, 21 recent)

## Stocks

Rules tested: 17 · results from 2026-11-03T15:25:57Z

**In use** (0)
- none

**Waiting for a second confirmation** (0)
- none

**Not better** (12)
- Stop at the wider of the current stop and the distal minus one weekly ATR14 (R recomputed; under 2R room = no trade). · too few trades (56 older, 23 recent)
- Never buy continuation (rally-base-rally) zones. · too few trades (56 older, 15 recent)
- Buy a rally-base-rally zone only when it sits inside a touched higher-timeframe demand zone. · too few trades (57 older, 15 recent)
- Take profit at exactly 3R instead of the next supply / projection. · too few trades (85 older, 37 recent)
- Buy half at the proximal and half at the middle of the zone (same stop and target). · too few trades (94 older, 40 recent)
- After +1.5R, raise the stop to the lowest daily low since the fill (it only ever tightens). · too few trades (94 older, 40 recent)
- Move the stop to the fill price once a daily high has reached +2R. · too few trades (94 older, 40 recent)
- Take profit just below the nearest not-removed supply zone above (W1, MN or 3M, tested ones too); skip the trade if that is under 2.5R. · too few trades (92 older, 32 recent)
- Half size when the daily ATR14 is in the top 10% of its last 250 values. · too few trades (94 older, 40 recent)
- No buy when the entry sits in the top third of the last 2 years' range. · too few trades (78 older, 37 recent)
- A zone counts as used only once a daily candle CLOSED inside it (wick-only touches keep it fresh). · too few trades (94 older, 40 recent)
- A zone counts as used only once price went at least 25% of the zone height inside it. · too few trades (94 older, 40 recent)

Live ideas, last 90 days: 1 · win rate 0% · -1.00R per idea
