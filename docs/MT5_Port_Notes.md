# MT5 Port Notes

How the MT4 tools were ported to MetaTrader 5. One section per tool.

## ZoneVision

File: `public/tools/RamanFX_ZoneVision.mq5` (port of `RamanFX_ZoneVision.mq4` v1.99). Install in `MQL5\Indicators`, compile with F7.

### What stays the same

The zone, trendline and notes logic is copied line for line from the MQ4, and so are all the MQ4 inputs (same names, same defaults, same order). That covers detection, removal, tested, grades A/B/C, strong/weak notes, ARRIVAL, Trade YES/NO, the R:R plan, clear-space notes, drill lessons, HTF lavender zones, Kevin trendlines (real pivots, FitAnchor, TooFlat, Confirmed, HTF levels through StepUp up to 4, RefineOnChart, DedupeTL, TLBias, CrossNeeded, channel 50%), emotional-candle stars, the halfway alert, the click box, hover tooltips, the legend and panel text, objects that cannot be selected, and the OBJPROP_TIMEFRAMES rule (HTF lines show on their own TF and lower ones only).

### API mapping (MT4 -> MT5)

| MT4 | MT5 |
|---|---|
| `Time[i] High[i] Low[i] Open[i] Close[i]` | `cT/cH/cL/cO/cC(i)` = `iTime/iHigh/iLow/iOpen/iClose(_Symbol, CTF, i)` |
| `Bars` | `iBars(_Symbol, CTF)` |
| `Digits`, `Point` | `_Digits`, `_Point` |
| `Bid`, `Ask` | `SymbolInfoDouble(_Symbol, SYMBOL_BID / SYMBOL_ASK)` |
| `int` timeframes, `_Period`, `NULL`/`0` symbol + TF | `ENUM_TIMEFRAMES` everywhere, `CTF = Period()`, `_Symbol`; "no TF" = `PERIOD_CURRENT` (0), checked with `> 0` as before |
| `iATR(sym, tf, 14, shift)` (a value) | one `iATR(_Symbol, tf, 14)` handle per TF, made in OnInit (chart TF, HtfOf, StepUp 1..N) and released in OnDeinit; `ATR(tf, shift)` reads through `CopyBuffer` with a cache per bar. MT5 ATR is the same SMA of true range, so the values match |
| `iFractals(sym, tf, MODE_UPPER/LOWER, i)` | `FracUp/FracDn` worked out by hand with the MT4 Fractals rule (2 bars each side, plus the 6- to 9-bar patterns for equal highs/lows). No handle |
| `iHighest/iLowest(NULL, 0, MODE_HIGH, ...)` | `iHighest/iLowest(_Symbol, CTF, MODE_HIGH, ...)` |
| `iBarShift(NULL, 0, t)` | `iBarShift(_Symbol, CTF, t)`; ChartBarIn now returns -1 if a shift is -1 (MT4 would have read past the array) |
| `OrdersTotal/OrderSelect/OrderTicket` (TicketLive) | pending orders (`OrderGetTicket`) plus open positions (`PositionGetTicket`, `POSITION_IDENTIFIER`); the ticket is read as `long` |
| `MQL4\Files\RamanFX_Bot_Orders.txt` | `MQL5\Files\RamanFX_Bot_Orders.txt` (same format) |
| OBJ_RECTANGLE filled when `BACK=true` | `OBJPROP_FILL=true` set on zones and trap bands; rejected boxes keep `FILL=false` (outline, as in MT4) |
| `OBJ_PERIOD_M1..MN1` (9 TFs) | all 21 MT5 `OBJ_PERIOD_*` flags; VisUpTo keeps the rule "this TF and lower" |
| `#property strict`, globals declared after use | removed; every global moved to the top; `indicator_buffers 0`, `indicator_plots 0` |
| Redraw when `Time[0]` changes | same (`cT(0)` vs `lastDraw`, `prev_calculated`). If HTF history or ATR is still loading, OnCalculate returns 0 and tries again on the next tick (up to 30 times), so the first draw does not use empty HTF data |
| `Alert(a, b, c...)` | `Notify(string)` = `Alert` + optional `SendNotification` |

Small changes that do not affect what is drawn:
- Three input comments in the MQ4 were attached to the wrong input (InpShowHTFLines, InpHtfTLBroken, InpRefineHTF), so the MT4 dialog showed the wrong text for them. The MQ5 puts each comment on the right input. Names and defaults are unchanged.
- RefineOnChart's parameter `aH` is renamed `aH_` so it does not hide the new global ATR-handle array.

### MT5 extras (inputs under "MT5 extras", detection unchanged)

| Input | Default | What it does |
|---|---|---|
| `InpRichPopup` | on | Sectioned click box: a header in the verdict colour (STRONG green, OK blue, WEAK grey) with an `x` close button, then GRADE & TRADE, PLAN, WHY STRONG / WEAK and DRILL LESSONS. Long lines wrap. The box is wider, flips to the left of the click near the right edge and stays inside the chart vertically. Clicks inside the box keep it open. Off = the MT4 plain box |
| `InpClickPlan` | on | While a zone's box is open, that zone's entry, SL and TP are drawn as dashed lines with price labels (TP shows the R:R). They are removed when the box closes |
| `InpCompactPanel` | on | Compact top-left box instead of `Comment()`: HTF bias and its reason (TL break or HTF swings), structure, nearest STRONG demand and supply with distance in HTF ATR, zones in view (fresh count), overextended warnings, and the bot's plan line. Click the header to collapse or expand it. Hover shows the full MT4 panel text. Off = the MT4 `Comment` |
| `InpAlertStrong` | on | One alert when price reaches a fresh STRONG zone that is drawn on the chart |
| `InpAlertTL` | on | One alert when a drawn trendline (this chart or HTF) is broken by the last closed candle of its TF |
| `InpPush` | off | Also send the alerts (including the halfway alert) as push notifications. Needs a MetaQuotes ID set in Tools > Options > Notifications |
| `InpRedrawOnHTF` | on | Also redraws when a higher-timeframe candle opens. Between candles only the panel and bot notes refresh (every 5 s and 20 s) and the touch check runs, as in the MQ4 |
| `InpExtraTF` | on | MT5-only TFs work. StepUp starts from the standard TF just below (H2 -> H4, D1...; M30 behaves as in MT4) and HtfOf pairs them like that TF (M2-M4 -> M15, M6-M12 -> H1, M20 -> H4, H2/H3 -> D1, H6-H12 -> W1). M30 still has no HTF pairing, as in the MQ4 |
| `InpAutoTheme` | on | Reads `CHART_COLOR_BACKGROUND`. On a dark chart, colours still on their default switch to readable dark-theme versions (fills, lines, text, click box, panel). Your own colour choices are kept. It updates live when you change the chart colours |

Alerts are never sent for what is already there when the indicator loads: breaks and touches seen on the first draw are recorded without alerting.

### Not identical, and why

- Fractals for the HTF bias are worked out by hand with the MT4 Fractals rule. If MT4's built-in `iFractals` handles equal highs/lows differently in some edge case, the HTF bias could differ on that bar. It matches the standard MT4 Fractals indicator.
- `iATR` reads come from the MT5 ATR indicator (same formula). On the very first tick after loading, MT5 may still be calculating, so the first draw waits (see the retry above) instead of drawing with ATR = 0.
- Timeframe names for the MT5-only TFs come from `EnumToString` (for example "H2"). MT4 has no such TFs.
- `ChartRedraw()` is called after each full redraw. MT4 waited for the next tick. The result looks the same.
