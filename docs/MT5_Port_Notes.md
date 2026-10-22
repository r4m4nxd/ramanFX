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

## ZoneBot

File: `public/tools/RamanFX_ZoneBot.mq5` (port of `RamanFX_ZoneBot.mq4` v1.62). Install in `MQL5\Experts`, compile with F7. Tester presets: `public/tools/MT5_ZoneBot_Zones3R.set`, `_Breakout.set`, `_Impulse.set`, `_KevinBest.set` (same overrides as the MT4 `RamanFX_ZoneBot_*.set`, MT5 format `name=value||start||step||stop||N`, enums as integers, ASCII).

### What stays the same

All MQ4 inputs keep their names, defaults and order; the zone detection, chain / arrival, ZoneVision notes and grades, trendlines, bias, every preset (CUSTOM, KEVIN_BEST, AGGRESSIVE, ZONES_3R, BREAKOUT, IMPULSE), Kevin's limit-removal rules, capital protection, the half-close ladder, Approve-mode panel and buttons (non-selectable drawings, `OnChartEvent` + timer poll), the signal / variant / order logs, and the tester report (journal KPIs, `_KPIs.csv`, per-trade CSV, MT4-format `_Statement.htm` for the journal parser, `_Exits.csv`) are line-for-line ports. Bar reads go through MT4-style accessors, so the logic text is the MQ4 text.

### API mapping (MT4 -> MT5)

| MT4 | MT5 |
|---|---|
| `iHigh/iLow/iOpen/iClose/iTime(s, tf, i)`, `iBars`, `iBarShift`, `iHighest/iLowest(.., MODE_HIGH/LOW, ..)` | `BHigh/BLow/BOpen/BClose/BTime`, `BCount`, `BShift`, `BHighest/BLowest`: a per (symbol, TF) `CopyRates` cache (series order, refreshed once per Work pass: full reload on a new bar, else bar 0 only; ~`InpLookback`+2300 bars). Past the cache they fall back to the native MQL5 `iHigh`... functions. Timeframes are stored as `int` and cast with `TfE()` |
| `Time[] High[] Low[] Bars` (chart TF, HTF line refinement) | `BTime/BHigh/BLow(_Symbol, _Period, i)`, `BCount(_Symbol, _Period)` |
| `iATR(s, tf, 14, i)` (a value) | `BATR()`: SMA of the true range of bars i..i+13, computed from the cache (= MT4 iATR = MT5 ATR indicator) |
| `iFractals(s, tf, MODE_UPPER/LOWER, i)` | `BFractal()`: the MT4 Fractals rule by hand (same as ZoneVision.mq5 FracUp/FracDn), returns 0 when none |
| `MarketInfo(MODE_BID/ASK/POINT/DIGITS)` | `SymbolInfoDouble/Integer(SYMBOL_BID/ASK/POINT/DIGITS)` |
| `MODE_STOPLEVEL / FREEZELEVEL` | `SYMBOL_TRADE_STOPS_LEVEL / SYMBOL_TRADE_FREEZE_LEVEL` |
| `MODE_TICKVALUE / TICKSIZE` | `SYMBOL_TRADE_TICK_VALUE_LOSS` (fallback `TICK_VALUE`) / `SYMBOL_TRADE_TICK_SIZE` |
| `MODE_LOTSTEP / MINLOT / MAXLOT` | `SYMBOL_VOLUME_STEP / MIN / MAX` |
| `MODE_MARGINREQUIRED`, `AccountFreeMarginCheck` | `OrderCalcMargin()` vs `ACCOUNT_MARGIN_FREE` |
| `MODE_PROFITCALCMODE == 0` (ALL = forex) | `SYMBOL_TRADE_CALC_MODE` = `SYMBOL_CALC_MODE_FOREX(_NO_LEVERAGE)` |
| `AccountBalance/Equity/FreeMargin/Currency` | `AccountInfoDouble(ACCOUNT_BALANCE/EQUITY/MARGIN_FREE)`, `AccountInfoString(ACCOUNT_CURRENCY)` |
| `IsTesting / IsVisualMode / IsTradeAllowed / IsConnected` | `MQLInfoInteger(MQL_TESTER / MQL_VISUAL_MODE / MQL_TRADE_ALLOWED)`, `TerminalInfoInteger(TERMINAL_CONNECTED)` |
| `TimeHour / TimeDayOfWeek` | `TimeToStruct` (`THour`, `TDow`) |
| live offset `TimeCurrent() - TimeGMT()` | `TimeTradeServer() - TimeGMT()`; tester: `InpTesterGMT` (+1 h in US summer time with `InpTesterDST`) |
| `OrdersTotal + OrderSelect(SELECT_BY_POS)` loops | `Snap()`: one list of open positions (`CPositionInfo`) + pending orders (`COrderInfo`, types BUY/SELL LIMIT/STOP); MT4 type numbers are kept (even = buy side) |
| `OrderSend` | `CTrade` `Buy/Sell` (Impulse market) and `OrderOpen` (limits, Breakout stops), `SetExpertMagicNumber`, `SetDeviationInPoints` (3 / 10 / 5 points as in MT4), `SetTypeFillingBySymbol` (FOK / IOC from `SYMBOL_FILLING_MODE`), one retry with IOC / RETURN on `TRADE_RETCODE_INVALID_FILL`; success = `DONE / PLACED / DONE_PARTIAL` |
| `OrderModify` pending / open | `CTrade.OrderModify` / `CTrade.PositionModify`; prices rounded to the tick size (`NormPx`) |
| `OrderDelete`, `OrderClose(full)`, `OrderClose(part)` | `CTrade.OrderDelete`, `PositionClose`, `PositionClosePartial` |
| `OrderCommission()` (round turn, open trade) | entry deals' `DEAL_COMMISSION + DEAL_FEE` x 2 (MT5 charges per deal) for the Kevin-best break-even |
| `OrdersHistoryTotal + MODE_HISTORY` | `HistorySelect` + `HistoryDealGet*` / `CHistoryOrderInfo`, read incrementally into a bot-deal cache (positions whose entry deal has our magic, so SL / TP exits count too) |
| per-order state keyed by ticket + "from #N" carry-over | keyed by the pending ticket = `POSITION_IDENTIFIER` after the fill. `PositionClosePartial` keeps the same position, so `StCarry` / `IsRemainder` / the `stO` root field are gone (the state file now holds the zone score in that column) |
| FillsToday / LossStreak / report from closed tickets | entry deals today / exit deals (net = profit + swap + commission incl. the entry-commission share); report: one trade per position id (partials summed, close price volume-weighted = the MT4 lot-weighted merge); exit reason from `DEAL_REASON` (tp / sl / so / ea) |
| `ObjectType`, `OBJPROP_TIME1/PRICE1` | `ObjectGetInteger(OBJPROP_TYPE)`, `OBJPROP_TIME/PRICE` with modifier 0 / 1 |
| filled rectangle (`BACK=true`) | plus `OBJPROP_FILL=true` |
| `ChartSetSymbolPeriod(0, s, int)` | `ChartSetSymbolPeriod(0, s, (ENUM_TIMEFRAMES)tf)` |
| MQL4\Files | MQL5\Files (same file names). `RamanFX_Bot_Orders.txt` is shared with ZoneVision.mq5 |

### Accounts

- HEDGING account (`ACCOUNT_MARGIN_MODE_RETAIL_HEDGING`): everything as in MT4, buys and sells on one symbol run together (Kevin best / Zones 3R / Breakout / Impulse).
- NETTING account: OnInit prints a warning and the status panel shows it; `NettingBlock()` refuses any entry opposite to an open position or bot pending order on that symbol (reason "netting account: ..."). Same-direction orders merge into one position; the bot then manages it with the state of the first order.

### Strategy Tester

- Multi-symbol: `InpSymbols` = comma list works in the MT5 tester (the MT4 bot forced the chart symbol). Each symbol keeps its own scan clock, HTF zones, watches and orders; capital protection is account-wide as in MT4. OnTick drives the work in the tester.
- `OnTester()` (choose "Custom max"): `avg R x sqrt(trades) - InpOptDDPenalty x max drawdown`, the drawdown being the larger of the closed-balance drawdown (journal formula) and `TesterStatistics(STAT_EQUITY_DDREL_PERCENT)`. Fewer than `InpOptMinTrades` trades returns `-100 + trades`.
- The report runs in OnDeinit for single tests (skipped in optimisation passes). Files: with `InpTesterCommon` (default) in the Common folder `%APPDATA%\MetaQuotes\Terminal\Common\Files`; otherwise in the agent sandbox `<data folder>\Tester\Agent-127.0.0.1-3000\MQL5\Files` (wiped between runs). Multi-symbol runs name the files `RamanFX_Backtest_MULTI_<chart symbol>...`. The per-trade CSV gains a `zone score` column; the KPI report gains a "Zone score (0-15)" group.
- Tester news: `RamanFX_News.csv` is read from the Common folder first (agents do not see `MQL5\Files`).
- New tester inputs: `InpTesterDST`, `InpOptMinTrades`, `InpOptDDPenalty`, `InpTesterCommon`.

### Strategy review items applied (docs/SD_Strategy_Review.md), all as inputs for A/B tests

| Review item | Input (default) | Applied as |
|---|---|---|
| R2, sec. 1 #1 / #10: pip = $0.01 on gold | `InpPipFix` (true) | `PipOf()`: 10 points on 3/5-digit FX (1 point on 2/4 digits), 0.1 gold, 0.01 silver / oil, 10 ticks on other CFDs; `InpStopBufferPts` counts tenths of that pip (`BufPoint`). Used by `InpMinStopPips`, `TfStopPips` buffers, the ZoneVision plan buffer, the zone trail and the pip figures in the order text. false = MT4 rule |
| R1, sec. 2 #1 / #2: no Zones 3R volatility floor | `InpZ3MinStopATR` (0.75), `InpZ3MinStopHTF` (0.25, metals / oil), `InpZ3MaxStopATR` (2.0) | after the 10%-beyond-distal stop: stop >= 0.75 x entry-TF ATR (metals / oil also >= 0.25 x HTF ATR), TP = `InpZ3RR` x the final stop, lots follow the final stop; skip above 2 x ATR. 0 = off |
| R3, sec. 2 #10: break-even hard-coded | `InpBE_R` (-1) | -1 = preset default (Zones 3R 1.0, Breakout `InpBoBE`, Impulse `InpImpBE`, Kevin best 2.0, Custom `InpLiveBE`); 0 = off; > 0 = that R for every preset. The .set files set it explicitly (1.0, Kevin best 2.0) |
| sec. 2 #3: profit margin | `InpZ3NeedRoom` (true) | Zones 3R skips a zone whose nearest live opposing HTF zone lies before the target |
| R10, sec. 2 #14: far pendings fill the risk cap | `InpRiskCapNearOnly` (true) | a pending order counts toward `InpMaxOpenRiskPct` only within 1 HTF ATR of price |
| sec. 2 #5 / #6: odds-enhancer score | `InpMinScore` (0 = off) | `ZScore()` 0-15: move out 0-2, 2nd leg 1, base <= 2 candles 1, freshness 0-2, departure >= 3 heights 1, with HTF bias 2, curve between HTF demand and supply (fallback: 100-bar curve) 2 / 1, room to the opposing HTF zone >= 5R 2 / >= 3R 1, confluence (trendline, same-side HTF zone, trap) max 2. Shown on zone labels / tooltips, in the order reasoning and order marks, saved per order, grouped in the report. Filters zones (Scan, Breakout basing zone) only when > 0 |
| R13, sec. 1 #7: no DST in the tester | `InpTesterDST` (true) | +1 h to `InpTesterGMT` from the 2nd Sunday of March to the 1st Sunday of November (US rule, which GMT+2/+3 brokers follow; by date, not hour) |
| R5: no OnTester | `InpOptMinTrades` (20), `InpOptDDPenalty` (20) | see Strategy Tester |
| R17: history scan per pending per tick | - | the incremental deal cache makes `FillsToday` / `LossStreak` cheap |

Not applied (left for later A/B work): departure / bars-away gate, curve filter as a Z3 gate, unclear-HTF skip, no-hedge input, session / rollover windows, minimum zone height, keep = enter recheck, R6 / R8 / R9 / R11 / R14 / R15 / R16.

### Not identical, and why

- Defaults that change Zones 3R / Kevin-best results versus MT4: `InpPipFix`, the Zones 3R stop floor / cap, `InpZ3NeedRoom`, `InpRiskCapNearOnly` and `InpTesterDST` are on by default (as requested from the review). For an MT4-identical run set `InpPipFix=false`, `InpZ3MinStopATR=0`, `InpZ3MinStopHTF=0`, `InpZ3MaxStopATR=0`, `InpZ3NeedRoom=false`, `InpRiskCapNearOnly=false`, `InpTesterDST=false`, `InpBE_R=-1`.
- Bar 0 inside the cache is refreshed once per Work pass (every tick in the tester, every 2 s timer live), not on every read. Within one pass MT4 also saw one quote.
- Risk sizing uses `SYMBOL_TRADE_TICK_VALUE_LOSS` (the MT5 value for a losing move); MT4 had one tick value.
- Prices sent to the server are rounded to the tick size as well as to digits (MT5 rejects off-tick prices on indices / metals CFDs).
- Kevin-best break-even commission: twice the entry-deal commission (MT5 books commission per deal, MT4 showed the round turn at open). Brokers that book the full round turn on entry make the BE stop sit one commission further.
- "Remainder" logic: MT4 partial closes produced a new ticket ("from #N"); MT5 keeps the position, so the ladder level is stored on the same position and the 25%-at-3R rule checks the current volume against the entry volume.
- Report rows are per position (closed volume), so a partly closed position that is still open at the end shows its closed part, as MT4's closed tickets did. Exit reason `ea` = any expert close (MT4 tagged only partial-close remainders).
- `FillsToday` counts entry deals of today; the MT4 count (history + open orders opened today, remainders excluded) gives the same number.
- MT5 has no `IsTradeContextBusy`; requests are synchronous (`SetAsyncMode(false)`).
- `OrdersTotal()` is still used, but as the MQL5 function (pending orders only).
- Not compiled here (no MetaEditor): checked for ASCII, bracket balance after stripping strings / comments, no MT4-only calls, no local hiding a global, every called function defined.
