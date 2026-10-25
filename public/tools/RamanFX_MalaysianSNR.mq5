//+------------------------------------------------------------------+
//| RamanFX_MalaysianSNR.mq5  v1.00  (MT5 indicator, never trades)   |
//| Malaysian SNR Strategy 2.0 (Pitchou.FX) as a chart engine.       |
//| Spec: docs/books/notes/snr1.md, snr2.md and the guide            |
//| docs/books/Bystra_and_Malaysian_SNR_Guide.md. Rule-to-code map:  |
//| docs/books/MSNR_Indicator.md. Standalone: no include files.      |
//|                                                                  |
//| What it does (book pages in brackets):                           |
//|  1 Levels: A-shape (bull then bear candle), V-shape (bear then   |
//|    bull), Gap (2 same-colour candles) at the body junction =     |
//|    line-chart turn [p17-22]. Fresh until a wick touches; a body  |
//|    close through it makes it fresh again [p23-25, p200]. CC      |
//|    candle and uses [p96, p139]. Per TF: MN, W1, D1, H4, H1 and   |
//|    the chart TF (M30 / M15).                                     |
//|  2 Trendlines through 2+ A or V points on closes, touch count,   |
//|    3rd strongest, dead after the 5th [p28-30, p139].             |
//|  3 Breakouts: strong body close beyond + QM (H, L, HH, LL);      |
//|    on SNR levels only EXTERNAL (last A/V before the touch)       |
//|    [p34-44, p72-79]; on trendlines a QM after the touch is fine  |
//|    [p74-75]. Level TF -> breakout TF map [p99, p114] (input).    |
//|    Rejection close rule per TF [p93].                            |
//|  4 Storylines: Classic (fresh level + rejection + BO) and        |
//|    Advanced (trendline + BO), Start / Middle / End parts,        |
//|    continuation, MTF alignment D -> W -> M [p202-372].           |
//|  5 QMS setups: RBS/SBR, LS, GAP, APEX, ERS, Double Apex, QM-CC,  |
//|    QMC, QM-to-QM, continuation C.APEX / C-GAP / C-RBS; the       |
//|    discretionary ones are listed as "manual" [p374-412, p489+].  |
//|  6 Entry confirmations on the entry TF whatever the chart TF:    |
//|    candle rejection, breaking gap, micro trendline break, mini   |
//|    QM and the 5M EMA(9, close) engulfing break [p413-434].       |
//|  7 Risk plan per signal (display only): SL >= 30 pips or beyond  |
//|    the confirmation extreme, TP = next fresh level / trendline   |
//|    or fixed R for continuation, lot size from a CORRECT formula. |
//|    NOTE: the book's own risk examples are wrong; its personal    |
//|    account examples risk 5-30% per trade (p611-617). This        |
//|    indicator uses risk% x balance / (SL distance in ticks x tick |
//|    value per lot), default 1%.                                   |
//|  8 Panel, hover tooltips on every object, click detail card.     |
//|  9 Research mode: CSV of every touch / breakout / setup / entry  |
//|    with no look-ahead + forward outcome columns.                 |
//|                                                                  |
//| Research CSV: Terminal\Common\Files\RFX_MSNR_<sym>_<from>_<to>.csv|
//| One row per event. S = snapshot (known at event_time),           |
//| O = outcome (computed forward, after event_time).                |
//|  row            S running row number                             |
//|  type           S touch | breakout | setup | entry               |
//|  symbol         S chart symbol                                   |
//|  event_time     S when the row's event is known (server time)    |
//|  level_tf       S TF of the level / trendline (story TF)         |
//|  level_kind     S A | V | GAP+ | GAP- | TL+ (rising) | TL- (falling)|
//|  level_price    S level price (TL: line value at the touch bar)  |
//|  level_formed   S open time of the 1st candle of the pair / TL P1|
//|  level_age_bars S level TF bars from formation to the touch      |
//|  cc             S 1 = confirmation candle present (p96)          |
//|  uses_before    S uses counted before this touch (CC + touches)  |
//|  breaks_before  S body breaks before this touch (refreshes)      |
//|  tl_touch_no    S trendline touch number (3 = strongest), 0 level|
//|  dir            S +1 bullish idea (support), -1 bearish          |
//|  touch_tf       S breakout TF used for the touch / breakout      |
//|  touch_time     S first breakout-TF bar that reached the level   |
//|  bo_status      O for touch rows: what happened next (valid,     |
//|                   expired, broken, rejfail, noqm, ...);          |
//|                   S for breakout+ rows (always valid / noqm)     |
//|  ref_price      O/S the A/V the breakout must close beyond       |
//|  external       O/S 1 = reference formed before the touch        |
//|  bo_time        O/S close time of the breakout candle            |
//|  body_ratio     O/S breakout candle body / range                 |
//|  qm             O/S 1 = QM formed (L > LL or H < HH)             |
//|  ls / apex      O/S left shoulder and apex (wick extreme) price  |
//|  rej_rule       S rejection rule of the level TF (none, own, H4) |
//|  rej_ok         O/S 1 ok, 0 not needed, -1 failed, 2 pending     |
//|  signal_time    O/S storyline start time (BO and rejection done) |
//|  early          O/S 1 = breakout on the next higher TF (p121)    |
//|  story_type     S classic | advanced | classic+advanced          |
//|  story_cont     S 1 = continuation storyline (same dir active)   |
//|  story_part     S 1 start, 2 middle, 3 end (at event_time)       |
//|  dir_mn..dir_h1 S active storyline direction per TF at the time  |
//|  aligned        S 1 = D, W and MN storylines share one direction |
//|  lead_ok        S 1 = start order D <= W <= MN (p313-323)        |
//|  setup_kind     S RBS/SBR, LS, GAP, APEX, ERS, C-RBS, C.APEX ... |
//|  setup_flags    S DBLAPEX, QMCC, QMC, QM2QM, GAPNOALIGN          |
//|  conf / conf_tf S confirmation (REJ, GAP, TL, QM, EMA) and its TF|
//|  entry,sl,tp    S the plan (price units); market or limit price  |
//|  tp_src         S level TF+kind, TL, or FIXED                    |
//|  sl_pips        S stop distance in pips (symbol-aware pip)       |
//|  rr             S planned reward : risk                          |
//|  lots           S lot size for InpRiskPct (current tick value)   |
//|  spread_pts     S spread of the fill bar (points)                |
//|  res_wick       O tp | sl | open | nodata (both by wick; same bar |
//|                   = sl first, conservative)                      |
//|  r_wick         O result in R (spread included)                  |
//|  bars_wick      O eval-TF bars to the wick outcome               |
//|  res_close      O SL only on a CLOSE beyond, TP by wick (limit)  |
//|  r_close        O result in R for res_close (a close stop can    |
//|                   lose more than 1R)                             |
//|  bars_close     O eval-TF bars to the close outcome              |
//|  mfe_r / mae_r  O max favourable / adverse excursion in R until  |
//|                   the wick outcome (or the horizon)              |
//|  same_bar       O 1 = SL and TP in the same eval bar             |
//|  end_time       O time of the wick outcome                       |
//| Spread: buys fill at price + spread and exit on bid; sells fill  |
//| on bid and exit at ask (= bid + bar spread).                     |
//+------------------------------------------------------------------+
#property copyright   "RamanFX"
#property version     "1.00"
#property description "Malaysian SNR 2.0 (Pitchou.FX): fresh A/V/Gap levels, trendlines, external QM breakouts, storylines, QMS setups, entry confirmations and a display-only risk plan. Never trades."
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots   0

//--- modes -------------------------------------------------------------
enum ENUM_MSNR_JUNC
  {
   MSNR_JUNC_CLOSE1 = 0,   // Close of the 1st candle (line-chart turn, notes canonical)
   MSNR_JUNC_OPEN2  = 1,   // Open of the 2nd candle
   MSNR_JUNC_MID    = 2    // Average of both
  };
enum ENUM_MSNR_BREAK
  {
   MSNR_BRK_CLOSE    = 0,  // Body closes beyond the level (notes canonical)
   MSNR_BRK_FULLBODY = 1   // Whole body beyond the level (guide 7.1 literal)
  };
enum ENUM_MSNR_CONTTP
  {
   MSNR_CTP_FIXED = 0,     // Fixed R (1:2 / 1:3, p549)
   MSNR_CTP_LEVEL = 1      // Next fresh level / trendline, fixed R as fallback
  };

//--- inputs ------------------------------------------------------------
input group "1. Levels (SNR p17-25, p96, p139)"
input bool   InpLvlMN          = true;   // Monthly levels
input bool   InpLvlW1          = true;   // Weekly levels
input bool   InpLvlD1          = true;   // Daily levels
input bool   InpLvlH4          = true;   // 4H levels (mini storylines)
input bool   InpLvlH1          = true;   // 1H levels (mini storylines)
input bool   InpLvlChart       = true;   // Chart TF levels too when the chart is M30 or M15
input bool   InpUseA           = true;   // A-shape: bull candle then bear candle (peak, resistance)
input bool   InpUseV           = true;   // V-shape: bear candle then bull candle (trough, support)
input bool   InpUseGap         = true;   // Gap: two candles of the same colour (bull = support, bear = resistance)
input ENUM_MSNR_JUNC  InpJunction  = MSNR_JUNC_CLOSE1; // Level price at the body junction
input ENUM_MSNR_BREAK InpBreakMode = MSNR_BRK_CLOSE;   // Body break that makes a level fresh again
input int    InpFreshSkip      = 1;      // Bars after the pattern that cannot unfresh it (guide 7.1: scan j > i+1)
input int    InpCCBar          = 2;      // Confirmation candle = bar i+N after the 2nd candle (notes: 2; alternative 1)
input bool   InpCCKeeps        = true;   // A CC whose wick touches does not unfresh the level (p96)
input int    InpMaxUses        = 2;      // Uses per level: CC + touch (p139); a body break restarts the count
input int    InpLevelMaxAge    = 300;    // Max level age in bars of its own TF (older = ignored)
input int    InpMaxLevelsPerTF = 3;      // Levels drawn per TF on each side of price (nearest first)
input bool   InpShowLevels     = true;   // Draw the levels
input bool   InpShowUnfresh    = false;  // Also draw unfresh levels (dotted)
input double InpMergePips      = 5;      // Drawing: skip a level within N pips of a nearer one of the same TF
input bool   InpShowLineChart  = false;  // Draw the line chart (closes) of the chart TF: levels sit at its turns
input int    InpLineChartBars  = 300;    // Line chart: bars drawn

input group "2. Trendlines (SNR p28-30, p114-160)"
input bool   InpUseTL          = true;   // Trendlines (Advanced storyline)
input bool   InpTLMN           = true;   // Monthly trendlines
input bool   InpTLW1           = true;   // Weekly trendlines
input bool   InpTLD1           = true;   // Daily trendlines
input bool   InpTLH4           = false;  // 4H trendlines (the book uses M / W / D only)
input int    InpTLPivot        = 2;      // A / V points for trendlines: line-chart pivot with N closes each side
input int    InpTLMinBars      = 3;      // Min bars between the two anchor points
input int    InpTLMaxTouches   = 5;      // Touches allowed (3rd strongest, dead after the 5th, p139)
input double InpTLTolATR       = 0.10;   // Touch / break tolerance in ATR(14) of the trendline TF
input int    InpTLMaxAge       = 300;    // Trendline life in bars of its TF after the 2nd anchor
input int    InpTLShow         = 2;      // Trendlines drawn per TF and direction (newest alive)

input group "3. Breakout engine (SNR p31-79, p93, p99, p121-127)"
input string InpBoMap          = "MN1:D1,W1:H4,D1:H1,H4:H1|M30|M15,H1:M30|M15,M30:M5,M15:M1"; // Level TF -> breakout TF(s) (p99), '|' = alternatives
input int    InpSwingStrength  = 0;      // A / V points on the breakout TF: 0 = book (2-candle colour pair), N = pivot with N closes each side
input double InpStrongBody     = 0.50;   // Strong body: body / range >= this (the book gives no number)
input double InpBodyATR        = 0.0;    // Also body >= x ATR(14) of the breakout TF (0 = off)
input bool   InpRequireQM      = true;   // Breakout must form a QM (p34); without QM only as continuation (p179)
input bool   InpRejGate        = true;   // Rejection close per TF: MN/W none, D/H4/M30/M15 own close, H1 = 4H close (p93)
input bool   InpLtfInternal    = false;  // Rare case p126: on H4 / H1 / M30 / M15 levels an internal break may count
input bool   InpEarlyBO        = false;  // Rare case p121: also accept a breakout on the next higher TF (M -> W, W -> D, D -> H4)
input int    InpBoMaxBars      = 120;    // Breakout must come within N breakout-TF bars after the touch

input group "4. Storylines (SNR p202-372)"
input bool   InpUseClassic     = true;   // Classic: fresh level + rejection + breakout ("1+2+3")
input bool   InpUseAdvanced    = true;   // Advanced: trendline + breakout ("1+2")
input double InpMidFrom        = 0.33;   // Part 2 (middle) from this fraction of the way to the target
input double InpEndFrom        = 0.75;   // Part 3 (end) from this fraction of the way to the target
input int    InpMergeBars      = 12;     // Same-TF same-direction starts within N breakout bars = one storyline (Classic + Advanced)
input int    InpMaxCont        = 6;      // Continuation breakouts tracked per storyline (C.APEX / C-GAP / C-RBS levels)
input int    InpStoryMaxBars   = 400;    // Storyline followed for at most N breakout-TF bars
input bool   InpShowStoryMarks = true;   // Mark storyline starts (breakout arrows + reference line)
input int    InpMaxMarks       = 12;     // Storyline marks drawn (newest)
input bool   InpShowLadder     = true;   // Draw the QM levels of active storylines (RBS/SBR, LS, GAP, APEX, ERS, C.*)

input group "5. QMS setups (SNR p374-412, p489-550)"
input bool   InpSetRBS         = true;   // RBS (bullish) / SBR (bearish): retest of the broken A / V
input bool   InpSetLS          = true;   // LS: left shoulder
input bool   InpSetGap         = true;   // GAP inside the QM (needs LTF alignment, p409)
input bool   InpSetApex        = true;   // APEX: wick extreme of the QM
input bool   InpSetERS         = true;   // ERS: last mini V / A before the breakout (p371, p401)
input bool   InpSetCont        = true;   // Continuation setups at C-RBS / C.APEX / C-GAP (parts 2-3)
input bool   InpGapNeedsAlign  = true;   // GAP QMS: 4H gap needs 1H gap + 1H A/V + 30M A/V; 1H gap needs 30M + 15M A/V (p409)
input int    InpSetupMaxBars   = 60;     // A QM level waits for price at most N breakout-TF bars
input double InpProxPips       = 10;     // Proximity: price within N pips of the level = at the level (p432)
input double InpSetupBreakPips = 20;     // Setup dead when the entry TF closes N pips through its level
input double InpEqualTolPips   = 5;      // Double Apex: two lows / highs within N pips
input double InpSpikeWick      = 0.60;   // QM-CC: apex candle wick >= this x its range (single spike)

input group "6. Entry confirmations (SNR p413-434)"
input ENUM_TIMEFRAMES InpEntryTF = PERIOD_M5;  // Entry TF: EMA, breaking gap, micro trendline
input ENUM_TIMEFRAMES InpRejTF   = PERIOD_M15; // Candle rejection TF
input ENUM_TIMEFRAMES InpQMTF    = PERIOD_M5;  // Mini QM confirmation TF
input bool   InpConfEMA        = true;   // EMA: engulfing candle breaks the EMA (main trigger, p413-421)
input bool   InpConfRej        = true;   // Candle rejection: wick through the level, close back (diagram p418)
input bool   InpConfGap        = true;   // Breaking gap: engulfing breaks a gap, entry on the pullback to it
input bool   InpConfTL         = true;   // Micro trendline break by an engulfing candle
input bool   InpConfQM         = true;   // Mini QM, entry on the pullback to its LS
input int    InpEmaLen         = 9;      // EMA length (source close, p420)
input bool   InpRejOppColour   = true;   // Rejection candle: a buy needs a bearish candle, a sell a bullish one (p414-417)
input int    InpConfMaxBars    = 48;     // Confirmation must come within N entry-TF bars after price reached the level
input int    InpPullbackBars   = 12;     // Gap / mini QM: pullback to the entry within N bars
input int    InpSwingLook      = 10;     // EMA / TL stop: last swing = extreme of the last N entry-TF bars
input int    InpMicroLook      = 36;     // Micro trendline: anchors within the last N entry-TF bars

input group "7. Risk plan, display only (SNR p435-441, p547-550, p611-617)"
input double InpRiskPct        = 1.0;    // Risk per trade in % (the book: NEVER exceed 1%)
input bool   InpRiskOnEquity   = false;  // Risk % of equity (false = balance)
input double InpMinStopPips    = 30;     // Min stop in pips (gold 30 pips = 3.00, JPY = 0.30)
input double InpIndexMinStop   = 50;     // Min stop on indices / CFDs in points (US30 example: 50)
input double InpIndexPoint     = 1.0;    // Index / CFD "pip" in price units (1 point = 1.0)
input double InpPipOverride    = 0;      // Pip size override in price units (0 = auto)
input double InpSLBufferPips   = 1;      // Buffer beyond the confirmation extreme (pips)
input bool   InpRiskAddSpread  = true;   // Lot size includes the current spread in the stop distance
input bool   InpTPLadder       = true;   // TP ladder (p436): D story aligned with W -> weekly level; W with M -> monthly
input ENUM_MSNR_CONTTP InpContTP = MSNR_CTP_FIXED; // Continuation setups TP
input double InpContRR         = 3.0;    // Continuation fixed R (1:2 - 1:3)
input double InpFallbackRR     = 3.0;    // TP when no fresh level / trendline lies ahead: fixed R
input double InpTPMinR         = 1.0;    // Ignore targets nearer than N x the stop distance
input bool   InpShowPlan       = true;   // Draw entry / SL / TP of the newest entry signal

input group "8. Panel, tooltips, click card"
input bool   InpShowPanel      = true;   // Panel (top-right, no background, click the header to fold)
input int    InpPanelX         = 10;     // Panel distance from the right edge (px)
input int    InpPanelY         = 18;     // Panel distance from the top (px)
input int    InpFontSize       = 8;      // Panel / card font size
input string InpCardFont       = "Segoe UI Symbol"; // Panel / card font (needs the check-mark glyphs)
input bool   InpUnicodeMarks   = true;   // Use check / cross marks (false = [+] / [-])
input int    InpTipMax         = 600;    // Tooltip max characters (cut with "... click for more")
input int    InpCardWidth      = 400;    // Click card width (px), top-left corner
input int    InpHighlightSec   = 10;     // Clicked object: mark its source candles for N seconds
input color  InpColMN          = clrMediumPurple; // Monthly colour
input color  InpColW1          = clrCrimson;      // Weekly colour
input color  InpColD1          = clrSeaGreen;     // Daily colour
input color  InpColH4          = clrDarkOrange;   // 4H colour
input color  InpColH1          = clrDodgerBlue;   // 1H colour
input color  InpColLTF         = clrSlateGray;    // 30M / 15M colour
input color  InpColBull        = clrForestGreen;  // Bullish marks
input color  InpColBear        = clrFireBrick;    // Bearish marks

input group "9. Alerts (once per signal, never on load)"
input bool   InpAlertStory     = true;   // Storyline started (valid breakout)
input bool   InpAlertSetup     = false;  // Price reached a QM level (setup armed)
input bool   InpAlertEntry     = true;   // Entry confirmation fired (with the plan)
input bool   InpAlertMini      = false;  // Also alert H4 / H1 / chart-TF mini storylines
input bool   InpAlertPopup     = true;   // Popup alert
input bool   InpAlertPush      = false;  // Push notification (Tools > Options > Notifications)
input bool   InpAlertSound     = false;  // Sound
input string InpSoundFile      = "alert.wav"; // Sound file (terminal Sounds folder)

input group "10. Research (CSV, no look-ahead)"
input bool     InpResearch     = false;  // Run research once at load and write the CSV
input datetime InpRsFrom       = D'2024.01.01 00:00'; // Research from (event time)
input datetime InpRsTo         = D'2024.12.31 23:59'; // Research to (event time)
input ENUM_TIMEFRAMES InpRsEvalTF = PERIOD_M5;        // Outcome TF (SL / TP walk)
input int      InpRsHorizon    = 4000;   // Outcome horizon in eval-TF bars (then "open")
input bool     InpRsSpread     = true;   // Include the bar spread in fills and exits
input bool     InpRsTouches    = true;   // Log level / trendline touches
input bool     InpRsSetups     = true;   // Log setups (price at a QM level)
input int      InpRsMaxBars    = 400000; // Max bars loaded per TF in research

input group "11. Data (bars loaded per TF, live)"
input int    InpBarsMN         = 300;    // MN1 bars
input int    InpBarsW1         = 600;    // W1 bars
input int    InpBarsD1         = 1200;   // D1 bars
input int    InpBarsH4         = 2500;   // H4 bars
input int    InpBarsH1         = 3000;   // H1 bars
input int    InpBarsM30        = 3000;   // M30 bars
input int    InpBarsM15        = 3000;   // M15 bars
input int    InpBarsM5         = 3000;   // M5 bars
input int    InpBarsM1         = 3000;   // M1 bars

//--- constants -----------------------------------------------------------
#define NSLOT        9
#define PFX          "MSNR_"
#define PFX_DRAW     "MSNR_D"
#define PFX_PANEL    "MSNR_P"
#define PFX_CARD     "MSNR_C"
#define PFX_HL       "MSNR_H"
// slots: 0 MN1, 1 W1, 2 D1, 3 H4, 4 H1, 5 M30, 6 M15, 7 M5, 8 M1
#define LK_A         1     // A-shape
#define LK_V         2     // V-shape
#define LK_GB        3     // bullish gap (support)
#define LK_GS        4     // bearish gap (resistance)
// breakout status
#define ST_VALID     1
#define ST_WAIT_BO   2
#define ST_WAIT_REJ  3
#define ST_EXPIRED   4
#define ST_BROKEN    5
#define ST_REJFAIL   6
#define ST_NOQM      7
#define ST_NODATA    8
#define ST_NOREF     9
#define ST_NOTOUCH   10
// QM ladder kinds
#define LD_RBS       1     // RBS (bullish) / SBR (bearish)
#define LD_LS        2
#define LD_GAP       3
#define LD_APEX      4
#define LD_ERS       5
#define LD_CRBS      11
#define LD_CAPEX     12
#define LD_CGAP      13
// confirmations
#define CF_REJ       1
#define CF_GAP       2
#define CF_TL        3
#define CF_QM        4
#define CF_EMA       5

//--- records (simple structs only: no strings, no dynamic arrays) --------
struct Lvl
  {
   int      slot;
   int      j;          // bar index of the 1st candle of the pair (slot bars, oldest = 0)
   datetime t1;         // open time of the 1st candle (identity)
   datetime known;      // close time of the 2nd candle
   int      kind;       // LK_*
   double   px;
   int      side0;      // +1 price above at formation (support), -1 below (resistance)
   bool     cc;
   bool     fresh;      // state after the last closed bar (or the max age)
   int      touches;    // wick-touch episodes since formation / last body break
   int      uses;
   int      breaks;
   datetime touchT;     // last wick touch that made it unfresh
   datetime breakT;     // last body break (fresh again)
   int      side;       // side of price after the last scanned bar
   int      ch0;        // first state change in gChT / gChK
   int      chN;        // number of state changes
   int      nEv;        // touch events produced
  };
struct TLn
  {
   int      slot;
   int      dir;        // -1 falling line through A points (resistance), +1 rising through V points (support)
   int      b1;
   int      b2;
   double   p1;
   double   p2;
   double   k;          // slope per bar
   datetime t1;
   datetime t2;
   datetime known;      // anchor 2 confirmed
   int      touches;    // including the 2 anchors
   int      dead;       // 0 alive, 1 broken by a close, 2 max touches used, 3 too old
   int      deadB;
   datetime deadT;
   int      t3B;
   int      t4B;
   int      t5B;
  };
struct TEv
  {
   int      kind;       // 0 level, 1 trendline
   int      slot;
   int      idx;        // level or trendline index
   int      hb;         // bar of the level TF that reached the line
   datetime ht;         // its open time
   int      dir;        // +1 bullish idea (price above = support), -1 bearish
   double   px;         // level price / line value at hb
   double   tol;        // reach tolerance (0 for levels)
   int      age;
   int      usesB;
   int      breaksB;
   int      tlNo;
   int      bo;         // breakout record
  };
struct BOut
  {
   int      ev;
   int      kind;
   int      lslot;
   int      bslot;
   int      dir;
   bool     early;
   int      tb;         // touch bar (breakout TF)
   datetime tt;
   double   tpx;
   int      refB;
   double   ref;
   bool     external;
   int      boB;
   double   boC;
   double   body;
   bool     qm;
   double   ls;
   int      lsB;
   double   apex;
   int      apexB;
   double   ers;
   int      ersB;
   double   gap;
   int      gapB;
   bool     gapAl;
   int      rejSlot;
   int      rejB;
   int      rejState;   // 0 not needed, 1 ok, 2 pending, 3 failed
   datetime rejT;
   datetime sigT;
   double   sigPx;
   int      sigB;
   datetime failT;
   int      status;
   int      story;
  };
struct Story
  {
   int      bo;
   int      slot;
   int      bslot;
   int      dir;
   int      type0;      // 1 classic, 2 advanced (at the start)
   int      type;       // bits after merges: 1 classic, 2 advanced
   datetime mergeT;
   bool     cont;
   bool     noQM;
   datetime startT;
   double   startPx;
   double   lvPx;
   double   apex;
   double   target;
   int      tgtKind;    // 0 none, 1 level, 2 trendline
   int      tgtSlot;
   int      tgtRef;
   datetime endT;       // 0 = still active
   int      endWhy;     // 1 target, 2 opposite storyline, 3 QM failed, 4 max bars, 5 continuation storyline
   int      lad0;
   int      ladN;
   int      nCont;
   bool     dblApex;
   bool     qmcc;
  };
struct Lad
  {
   int      st;
   int      kind;
   int      contNo;
   int      dir;
   int      bslot;
   double   px;
   datetime known;
   int      srcB;
   double   inval;
   bool     cont;
   bool     gapAl;
   int      setup;
  };
struct Setp
  {
   int      lad;
   int      st;
   datetime armT;
   int      armB;       // entry TF bar
   datetime endT;
   int      status;     // 1 open, 2 entered, 3 level failed, 4 expired, 5 storyline ended
   bool     qmc;
   int      ent;
  };
struct Ent
  {
   int      setup;
   int      st;
   int      conf;
   int      cslot;
   int      bar;
   datetime t;
   int      dir;
   double   entry;
   double   sl;
   double   tp;
   double   slDist;
   double   rr;
   double   lots;
   double   extreme;
   int      tpKind;     // 0 fixed, 1 level, 2 trendline
   int      tpSlot;
   int      tpRef;
   bool     qm2qm;
  };
struct ORes
  {
   int      resW;       // 1 tp, -1 sl, 0 open, -9 nodata
   double   rW;
   int      barsW;
   int      resC;
   double   rC;
   int      barsC;
   double   mfe;
   double   mae;
   bool     same;
   int      spr;
   datetime endW;
  };

//--- per-TF price cache --------------------------------------------------
class CSlot
  {
public:
   ENUM_TIMEFRAMES   tf;
   bool              need;
   bool              ready;
   bool              partial;
   datetime          last0;     // open time of the newest bar at the last load
   int               n;
   MqlRates          r[];       // oldest first (not series)
   double            aP[];      // A point price at its turning bar (0 = none)
   double            vP[];      // V point price at its turning bar (0 = none)
   int               pA[];      // newest A turning bar confirmed at or before bar b (-1 none)
   int               pV[];
   int               tA[];      // newest A turning bar index <= b
   int               tV[];
   double            ema[];
   double            atr[];
                     CSlot(void) { tf = PERIOD_CURRENT; need = false; ready = false; partial = false; last0 = 0; n = 0; }
   int               LoadCount(int cnt)
     {
      ArraySetAsSeries(r, false);
      ResetLastError();
      int got = CopyRates(_Symbol, tf, 0, cnt, r);
      return got;
     }
   void              Alloc(void)
     {
      ArrayResize(aP, n); ArrayResize(vP, n); ArrayResize(pA, n); ArrayResize(pV, n);
      ArrayResize(tA, n); ArrayResize(tV, n); ArrayResize(ema, n); ArrayResize(atr, n);
      if(n > 0) { ArrayInitialize(aP, 0.0); ArrayInitialize(vP, 0.0); }
     }
   int               LoadRange(datetime from, datetime to)
     {
      ArraySetAsSeries(r, false);
      ResetLastError();
      int got = CopyRates(_Symbol, tf, from, to, r);
      return got;
     }
  };

//--- globals ---------------------------------------------------------------
CSlot    S[NSLOT];
int      gMap[NSLOT][3];
int      gMapN[NSLOT];
bool     gLvlOn[NSLOT];
bool     gTLOn[NSLOT];
int      gEntrySlot = 7, gRejSlot = 6, gQMSlot = 7, gEvalSlot = 7, gChartSlot = -1;
double   gPip = 0, gMinStop = 0, gProx = 0, gBreakDist = 0, gBuf = 0, gEqTol = 0, gMergeTol = 0;
bool     gIndex = false, gGold = false;

Lvl      gLv[];
int      gLv0[NSLOT];
int      gLvN[NSLOT];
datetime gChT[];
int      gChK[];
TLn      gTL[];
TEv      gEv[];
BOut     gBO[];
Story    gSt[];
Lad      gLad[];
Setp     gSu[];
Ent      gEn[];
int      gLastStory[NSLOT];

bool     gComputed = false;
int      gTries = 0;
datetime gPanelAt = 0;
datetime gTimerAt = 0;
bool     gAlertArmed = false;
string   gSeen[];
string   gLastAlert = "";
bool     gPanelOpen = true;
bool     gManOpen = false;
bool     gDark = false;
color    cTxt = clrDimGray, cHead = clrGoldenrod, cCardBg = clrWhite, cCardFg = clrBlack, cCardBorder = clrGray;
string   gCardObj = "";
uint     gCardAt = 0;
int      gCardX = 0, gCardY = 0, gCardW = 0, gCardH = 0;
uint     gHlAt = 0;
bool     gRsMode = false;
bool     gRsDone = false;
int      gRsTries = 0;
string   gRsMsg = "";
string   gDataMsg = "";
string   gCardRows[];
datetime gPartTry[NSLOT];
datetime gFirstTry = 0;
datetime gRsAt = 0;

//--- small helpers ---------------------------------------------------------
int      IMax(int a, int b) { return a > b ? a : b; }
int      IMin(int a, int b) { return a < b ? a : b; }
int      Sgn(double v) { return v > 0.0 ? 1 : (v < 0.0 ? -1 : 0); }
string   D2S(double v) { return DoubleToString(v, _Digits); }
string   TStr(datetime t) { return t > 0 ? TimeToString(t, TIME_DATE | TIME_MINUTES) : "-"; }
string   TShort(datetime t) { if(t <= 0) return "-"; string s = TimeToString(t, TIME_DATE | TIME_MINUTES); return StringSubstr(s, 5); }
string   PipTxt(double d) { if(gPip <= 0) return D2S(d); return DoubleToString(d / gPip, 1) + "p"; }
string   Mk(bool ok) { if(!InpUnicodeMarks) return ok ? "[+]" : "[-]"; return ShortToString((ushort)(ok ? 0x2713 : 0x2717)); }
string   DirTxt(int d) { return d > 0 ? "bullish" : (d < 0 ? "bearish" : "none"); }
string   DirShort(int d) { return d > 0 ? "bull" : (d < 0 ? "bear" : "-"); }
string   Arrow(int d) { return d > 0 ? "^" : (d < 0 ? "v" : "-"); }
datetime AddSec(datetime t, long sec) { return (datetime)((long)t + sec); }

ENUM_TIMEFRAMES SlotTf(int s)
  {
   switch(s)
     {
      case 0: return PERIOD_MN1;
      case 1: return PERIOD_W1;
      case 2: return PERIOD_D1;
      case 3: return PERIOD_H4;
      case 4: return PERIOD_H1;
      case 5: return PERIOD_M30;
      case 6: return PERIOD_M15;
      case 7: return PERIOD_M5;
      case 8: return PERIOD_M1;
     }
   return PERIOD_CURRENT;
  }
string SlotName(int s)
  {
   switch(s)
     {
      case 0: return "MN";
      case 1: return "W1";
      case 2: return "D1";
      case 3: return "H4";
      case 4: return "H1";
      case 5: return "M30";
      case 6: return "M15";
      case 7: return "M5";
      case 8: return "M1";
     }
   return "?";
  }
string SlotShort(int s)
  {
   switch(s)
     {
      case 0: return "M";
      case 1: return "W";
      case 2: return "D";
     }
   return SlotName(s);
  }
string SlotLong(int s)
  {
   switch(s)
     {
      case 0: return "Monthly";
      case 1: return "Weekly";
      case 2: return "Daily";
      case 3: return "4H";
      case 4: return "1H";
      case 5: return "30M";
      case 6: return "15M";
      case 7: return "5M";
      case 8: return "1M";
     }
   return "?";
  }
int SlotOfTf(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES t = tf;
   if(t == PERIOD_CURRENT) t = (ENUM_TIMEFRAMES)Period();
   for(int s = 0; s < NSLOT; s++) if(SlotTf(s) == t) return s;
   return -1;
  }
int SlotFromName(string nm)
  {
   string u = nm;
   StringTrimLeft(u);
   StringTrimRight(u);
   StringToUpper(u);
   if(u == "MN1" || u == "MN" || u == "M") return 0;
   if(u == "W1" || u == "W") return 1;
   if(u == "D1" || u == "D") return 2;
   if(u == "H4" || u == "4H") return 3;
   if(u == "H1" || u == "1H") return 4;
   if(u == "M30" || u == "30M") return 5;
   if(u == "M15" || u == "15M") return 6;
   if(u == "M5" || u == "5M") return 7;
   if(u == "M1" || u == "1M") return 8;
   return -1;
  }
color SlotColor(int s)
  {
   switch(s)
     {
      case 0: return InpColMN;
      case 1: return InpColW1;
      case 2: return InpColD1;
      case 3: return InpColH4;
      case 4: return InpColH1;
     }
   return InpColLTF;
  }
int SlotWidth(int s) { return s == 0 ? 3 : (s <= 2 ? 2 : 1); }
int BarsFor(int s)
  {
   int v = 3000;
   switch(s)
     {
      case 0: v = InpBarsMN; break;
      case 1: v = InpBarsW1; break;
      case 2: v = InpBarsD1; break;
      case 3: v = InpBarsH4; break;
      case 4: v = InpBarsH1; break;
      case 5: v = InpBarsM30; break;
      case 6: v = InpBarsM15; break;
      case 7: v = InpBarsM5; break;
      case 8: v = InpBarsM1; break;
     }
   if(v < 100) v = 100;
   int mx = (int)TerminalInfoInteger(TERMINAL_MAXBARS);
   if(mx > 100 && v > mx) v = mx;
   return v;
  }

//--- bar access (slot arrays are oldest first) -----------------------------
double   Op(int s, int i) { return S[s].r[i].open; }
double   Hi(int s, int i) { return S[s].r[i].high; }
double   Lo(int s, int i) { return S[s].r[i].low; }
double   Cl(int s, int i) { return S[s].r[i].close; }
datetime Tm(int s, int i) { return S[s].r[i].time; }
bool     Bull(int s, int i) { return S[s].r[i].close > S[s].r[i].open; }
bool     Bear(int s, int i) { return S[s].r[i].close < S[s].r[i].open; }
double   BodyAbs(int s, int i) { return MathAbs(S[s].r[i].close - S[s].r[i].open); }
double   BodyRatio(int s, int i) { double rg = S[s].r[i].high - S[s].r[i].low; if(rg <= 0.0) return 0.0; return BodyAbs(s, i) / rg; }
int      LastClosed(int s) { return S[s].n - 2; }   // the newest bar is still forming

// close time of bar i (MN: next bar open; others: min(next open, open + period))
datetime BarEnd(int s, int i)
  {
   int ps = PeriodSeconds(S[s].tf);
   if(i + 1 < S[s].n)
     {
      datetime nx = S[s].r[i + 1].time;
      if(S[s].tf == PERIOD_MN1) return nx;
      datetime pe = S[s].r[i].time + ps;
      return nx < pe ? nx : pe;
     }
   if(S[s].tf == PERIOD_MN1) return S[s].r[i].time + 31 * 86400;
   return S[s].r[i].time + ps;
  }
// largest i with time <= t (-1 if t is before the first bar)
int BarAt(int s, datetime t)
  {
   int n = S[s].n;
   if(n <= 0) return -1;
   if(t < S[s].r[0].time) return -1;
   int lo = 0, hi = n - 1;
   while(lo < hi)
     {
      int mid = (lo + hi + 1) / 2;
      if(S[s].r[mid].time <= t) lo = mid; else hi = mid - 1;
     }
   return lo;
  }
// smallest i with time >= t (n if none)
int FirstAt(int s, datetime t)
  {
   int n = S[s].n;
   if(n <= 0) return 0;
   int lo = 0, hi = n;
   while(lo < hi)
     {
      int mid = (lo + hi) / 2;
      if(S[s].r[mid].time < t) lo = mid + 1; else hi = mid;
     }
   return lo;
  }
// newest bar whose close time is <= t (-1 none)
int LastEndBy(int s, datetime t)
  {
   int i = BarAt(s, t);
   while(i >= 0 && BarEnd(s, i) > t) i--;
   return i;
  }
double Junc(int s, int j)
  {
   if(InpJunction == MSNR_JUNC_OPEN2 && j + 1 < S[s].n) return S[s].r[j + 1].open;
   if(InpJunction == MSNR_JUNC_MID && j + 1 < S[s].n) return (S[s].r[j].close + S[s].r[j + 1].open) / 2.0;
   return S[s].r[j].close;
  }
int PairKind(int s, int j)
  {
   bool b1 = Bull(s, j), r1 = Bear(s, j), b2 = Bull(s, j + 1), r2 = Bear(s, j + 1);
   if(b1 && r2) return LK_A;
   if(r1 && b2) return LK_V;
   if(b1 && b2) return LK_GB;
   if(r1 && r2) return LK_GS;
   return 0;
  }
bool KindOn(int k)
  {
   if(k == LK_A) return InpUseA;
   if(k == LK_V) return InpUseV;
   if(k == LK_GB || k == LK_GS) return InpUseGap;
   return false;
  }
string KindName(int k)
  {
   switch(k)
     {
      case LK_A:  return "A-shape";
      case LK_V:  return "V-shape";
      case LK_GB: return "bullish Gap";
      case LK_GS: return "bearish Gap";
     }
   return "?";
  }
string KindShort(int k)
  {
   switch(k)
     {
      case LK_A:  return "A";
      case LK_V:  return "V";
      case LK_GB: return "Gap";
      case LK_GS: return "Gap";
     }
   return "?";
  }
string KindCsv(int k)
  {
   switch(k)
     {
      case LK_A:  return "A";
      case LK_V:  return "V";
      case LK_GB: return "GAP+";
      case LK_GS: return "GAP-";
     }
   return "?";
  }
string RoleTxt(int side) { return side > 0 ? "support" : "resistance"; }
double Atr(int s, int i) { if(i < 0 || i >= ArraySize(S[s].atr)) return 0.0; return S[s].atr[i]; }

//--- symbol units ----------------------------------------------------------
void SetupUnits()
  {
   string u = _Symbol;
   StringToUpper(u);
   double pt = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   int dg = (int)SymbolInfoInteger(_Symbol, SYMBOL_DIGITS);
   ENUM_SYMBOL_CALC_MODE cm = (ENUM_SYMBOL_CALC_MODE)SymbolInfoInteger(_Symbol, SYMBOL_TRADE_CALC_MODE);
   bool fx = (cm == SYMBOL_CALC_MODE_FOREX || cm == SYMBOL_CALC_MODE_FOREX_NO_LEVERAGE);
   gGold = (StringFind(u, "XAU") >= 0 || StringFind(u, "GOLD") >= 0);
   bool silver = (StringFind(u, "XAG") >= 0 || StringFind(u, "SILVER") >= 0);
   gIndex = false;
   if(InpPipOverride > 0) gPip = InpPipOverride;
   else if(gGold) gPip = 0.10;
   else if(silver) gPip = 0.01;
   else if(fx)
     {
      if(StringFind(u, "JPY") >= 0) gPip = 0.01;
      else gPip = (dg == 3 || dg == 5) ? pt * 10.0 : pt;
     }
   else { gIndex = true; gPip = InpIndexPoint > 0 ? InpIndexPoint : 1.0; }
   if(gPip <= 0) gPip = pt > 0 ? pt * 10.0 : 0.0001;
   gMinStop   = gIndex ? InpIndexMinStop * gPip : InpMinStopPips * gPip;
   gProx      = InpProxPips * gPip;
   gBreakDist = InpSetupBreakPips * gPip;
   gBuf       = InpSLBufferPips * gPip;
   gEqTol     = InpEqualTolPips * gPip;
   gMergeTol  = InpMergePips * gPip;
  }

//--- timeframe map (p99): "MN1:D1,W1:H4,D1:H1,H4:H1|M30|M15,..." ---------
void ParseMap()
  {
   for(int s = 0; s < NSLOT; s++) { gMapN[s] = 0; gMap[s][0] = -1; gMap[s][1] = -1; gMap[s][2] = -1; }
   string items[];
   int n = StringSplit(InpBoMap, (ushort)',', items);
   for(int i = 0; i < n; i++)
     {
      string kv[];
      int m = StringSplit(items[i], (ushort)':', kv);
      if(m != 2) continue;
      int ls = SlotFromName(kv[0]);
      if(ls < 0) continue;
      string alts[];
      int a = StringSplit(kv[1], (ushort)'|', alts);
      for(int k = 0; k < a && gMapN[ls] < 3; k++)
        {
         int bs = SlotFromName(alts[k]);
         if(bs <= ls) continue;                 // breakout TF must be lower than the level TF
         gMap[ls][gMapN[ls]] = bs;
         gMapN[ls]++;
        }
     }
  }
string MapTxt(int ls)
  {
   if(gMapN[ls] <= 0) return "no breakout TF mapped";
   string t = "";
   for(int k = 0; k < gMapN[ls]; k++) t += (k > 0 ? " / " : "") + SlotName(gMap[ls][k]);
   return t;
  }
// rejection rule (p93): MN / W none, H1 needs the 4H close, others their own close
int RejSlot(int ls)
  {
   if(ls <= 1) return -1;
   if(ls == 4) return 3;
   return ls;
  }
string RejTxt(int ls)
  {
   int rs = RejSlot(ls);
   if(rs < 0) return "no candle close needed on " + SlotLong(ls) + " (p93)";
   if(ls == 4) return "the 4H candle must close back on the origin side (1H rule, p93)";
   return "the " + SlotLong(rs) + " candle must close back on the origin side (p93)";
  }
string RejCsv(int ls) { int rs = RejSlot(ls); if(rs < 0) return "none"; return SlotName(rs); }

//--- which TFs are needed --------------------------------------------------
void ComputeNeeds()
  {
   for(int s = 0; s < NSLOT; s++) { S[s].tf = SlotTf(s); S[s].need = false; gLvlOn[s] = false; gTLOn[s] = false; }
   gLvlOn[0] = InpLvlMN; gLvlOn[1] = InpLvlW1; gLvlOn[2] = InpLvlD1; gLvlOn[3] = InpLvlH4; gLvlOn[4] = InpLvlH1;
   gChartSlot = SlotOfTf((ENUM_TIMEFRAMES)Period());
   if(InpLvlChart && (gChartSlot == 5 || gChartSlot == 6)) gLvlOn[gChartSlot] = true;
   if(InpUseTL) { gTLOn[0] = InpTLMN; gTLOn[1] = InpTLW1; gTLOn[2] = InpTLD1; gTLOn[3] = InpTLH4; }
   for(int s = 0; s < NSLOT; s++)
     {
      if(!gLvlOn[s] && !gTLOn[s]) continue;
      S[s].need = true;
      for(int k = 0; k < gMapN[s]; k++)
        {
         int bs = gMap[s][k];
         S[bs].need = true;
         if((bs == 3 || bs == 4) && InpSetGap && InpGapNeedsAlign)    // GAP QMS alignment TFs (p409)
           { S[4].need = true; S[5].need = true; S[6].need = true; }
        }
      if(InpEarlyBO && gMapN[s] > 0) { int es = gMap[s][0] - 1; if(es > s) S[es].need = true; }
      int rs = RejSlot(s);
      if(rs >= 0) S[rs].need = true;
     }
   gEntrySlot = SlotOfTf(InpEntryTF); if(gEntrySlot < 0) gEntrySlot = 7;
   gRejSlot   = SlotOfTf(InpRejTF);   if(gRejSlot < 0) gRejSlot = 6;
   gQMSlot    = SlotOfTf(InpQMTF);    if(gQMSlot < 0) gQMSlot = 7;
   gEvalSlot  = SlotOfTf(InpRsEvalTF); if(gEvalSlot < 0) gEvalSlot = 7;
   S[gEntrySlot].need = true;
   if(InpConfRej) S[gRejSlot].need = true;
   if(InpConfQM) S[gQMSlot].need = true;
   if(InpResearch) S[gEvalSlot].need = true;
   if(InpShowLineChart && gChartSlot >= 0) S[gChartSlot].need = true;
  }

//--- derived series: A / V points, EMA, ATR --------------------------------
void DeriveSlot(int s)
  {
   S[s].n = ArraySize(S[s].r);
   int n = S[s].n;
   S[s].Alloc();
   if(n <= 0) return;
   int N = InpSwingStrength;
   int lastC = n - 2;                                   // newest closed bar
   if(N <= 0)
     {
      for(int j = 0; j + 1 <= lastC; j++)
        {
         if(Bull(s, j) && Bear(s, j + 1)) S[s].aP[j] = Junc(s, j);
         else if(Bear(s, j) && Bull(s, j + 1)) S[s].vP[j] = Junc(s, j);
        }
     }
   else
     {
      for(int j = N; j + N <= lastC; j++)
        {
         bool isA = true, isV = true;
         double c = Cl(s, j);
         for(int q = 1; q <= N; q++)
           {
            if(!(c > Cl(s, j - q) && c >= Cl(s, j + q))) isA = false;
            if(!(c < Cl(s, j - q) && c <= Cl(s, j + q))) isV = false;
           }
         if(isA) S[s].aP[j] = c;
         else if(isV) S[s].vP[j] = c;
        }
     }
   int cfm = N <= 0 ? 1 : N;
   int la = -1, lv = -1, ta = -1, tv = -1;
   for(int b = 0; b < n; b++)
     {
      int j = b - cfm;
      if(j >= 0) { if(S[s].aP[j] > 0.0) la = j; if(S[s].vP[j] > 0.0) lv = j; }
      if(S[s].aP[b] > 0.0) ta = b;
      if(S[s].vP[b] > 0.0) tv = b;
      S[s].pA[b] = la; S[s].pV[b] = lv; S[s].tA[b] = ta; S[s].tV[b] = tv;
     }
   // EMA (close), seeded with the first close; treat the first 3 x length bars as warm-up
   double al = 2.0 / (MathMax(1, InpEmaLen) + 1.0);
   S[s].ema[0] = Cl(s, 0);
   for(int i = 1; i < n; i++) S[s].ema[i] = al * Cl(s, i) + (1.0 - al) * S[s].ema[i - 1];
   // ATR(14), simple average of the true range
   double sum = 0.0;
   for(int i = 0; i < n; i++)
     {
      double tr = Hi(s, i) - Lo(s, i);
      if(i > 0) { tr = MathMax(tr, MathAbs(Hi(s, i) - Cl(s, i - 1))); tr = MathMax(tr, MathAbs(Lo(s, i) - Cl(s, i - 1))); }
      sum += tr;
      if(i >= 14)
        {
         double o = Hi(s, i - 14) - Lo(s, i - 14);
         if(i - 14 > 0) { o = MathMax(o, MathAbs(Hi(s, i - 14) - Cl(s, i - 15))); o = MathMax(o, MathAbs(Lo(s, i - 14) - Cl(s, i - 15))); }
         sum -= o;
        }
      S[s].atr[i] = sum / (double)IMin(i + 1, 14);
     }
  }

//--- loading ---------------------------------------------------------------
// live: reload a TF only when its newest bar changed. Returns true when data changed.
bool LoadLive(int s)
  {
   datetime t0 = iTime(_Symbol, S[s].tf, 0);
   if(t0 == 0) { S[s].ready = false; gDataMsg = "loading " + SlotName(s) + " history"; return false; }
   if(S[s].ready && t0 == S[s].last0 && (!S[s].partial || TimeLocal() - gPartTry[s] < 10)) return false;
   gPartTry[s] = TimeLocal();
   int want = BarsFor(s);
   int oldN = S[s].n;
   datetime oldLast = S[s].last0;
   bool wasReady = S[s].ready;
   int got = S[s].LoadCount(want);
   if(got <= 0)
     {
      int err = GetLastError();
      S[s].ready = false;
      S[s].last0 = 0;
      gDataMsg = "loading " + SlotName(s) + (err == ERR_HISTORY_NOT_FOUND ? " (history not found yet)" : " (error " + IntegerToString(err) + ")");
      if(ArraySize(S[s].r) != oldN) { DeriveSlot(s); return true; }   // keep n and the derived arrays in step with r
      return false;
     }
   DeriveSlot(s);                                                   // n = got, derived arrays rebuilt
   if(S[s].r[got - 1].time != t0) { S[s].ready = false; S[s].last0 = 0; gDataMsg = "syncing " + SlotName(s); return true; }
   bool synced = (bool)SeriesInfoInteger(_Symbol, S[s].tf, SERIES_SYNCHRONIZED);
   bool same = (wasReady && oldN == got && oldLast == t0);          // a partial-history retry that brought nothing new
   S[s].partial = (got < want && !synced);
   S[s].last0 = t0;
   S[s].ready = true;
   return !same;
  }
bool RefreshLive()
  {
   bool changed = false;
   gDataMsg = "";
   for(int s = 0; s < NSLOT; s++)
     {
      if(!S[s].need) continue;
      if(LoadLive(s)) changed = true;
     }
   return changed;
  }
bool AllReady()
  {
   for(int s = 0; s < NSLOT; s++) if(S[s].need && !S[s].ready) return false;
   return true;
  }

//+------------------------------------------------------------------+
//| Levels (p17-25, p96, p139)                                       |
//+------------------------------------------------------------------+
void AddChange(datetime t, int kind)
  {
   int n = ArraySize(gChT);
   ArrayResize(gChT, n + 1, 4096);
   ArrayResize(gChK, n + 1, 4096);
   gChT[n] = t;
   gChK[n] = kind;
  }
void AddEvent(int kind, int s, int idx, int k, int dir, double px, double tol, int age, int usesB, int breaksB, int tlNo)
  {
   int n = ArraySize(gEv);
   ArrayResize(gEv, n + 1, 4096);
   gEv[n].kind = kind; gEv[n].slot = s; gEv[n].idx = idx; gEv[n].hb = k; gEv[n].ht = Tm(s, k);
   gEv[n].dir = dir; gEv[n].px = px; gEv[n].tol = tol; gEv[n].age = age; gEv[n].usesB = usesB;
   gEv[n].breaksB = breaksB; gEv[n].tlNo = tlNo; gEv[n].bo = -1;
  }
// one level per candle pair; state walked forward bar by bar (closed bars only)
void BuildLevels(int s)
  {
   gLv0[s] = ArraySize(gLv);
   gLvN[s] = 0;
   int last = LastClosed(s);
   if(last < 3) return;
   int maxAge = IMax(10, InpLevelMaxAge);
   for(int j = 0; j + 1 <= last; j++)
     {
      int kind = PairKind(s, j);
      if(kind == 0 || !KindOn(kind)) continue;
      double L = Junc(s, j);
      int i = j + 1;
      int side = Sgn(Cl(s, i) - L);
      if(side == 0) side = (kind == LK_A || kind == LK_GS) ? -1 : 1;
      int li = ArraySize(gLv);
      ArrayResize(gLv, li + 1, 4096);
      gLv[li].slot = s; gLv[li].j = j; gLv[li].t1 = Tm(s, j); gLv[li].known = BarEnd(s, i);
      gLv[li].kind = kind; gLv[li].px = L; gLv[li].side0 = side;
      int cb = i + IMax(1, InpCCBar);
      bool cc = false;
      if(cb <= last) cc = (side > 0) ? Bull(s, cb) : Bear(s, cb);    // green at support, red at resistance (p96)
      gLv[li].cc = cc;
      bool fresh = true;
      int touches = 0, breaks = 0;
      int uses = (cc && InpCCKeeps) ? 1 : 0;                           // the CC is the first use (p139)
      datetime tT = 0, bT = 0;
      int sideNow = side;
      bool prevContact = false;
      int ch0 = ArraySize(gChT);
      int nEv = 0;
      int kStart = i + 1 + IMax(0, InpFreshSkip);
      int kEnd = IMin(last, i + maxAge);
      for(int k = kStart; k <= kEnd; k++)
        {
         double o = Op(s, k), c = Cl(s, k), h = Hi(s, k), l = Lo(s, k);
         bool reach = (l <= L && h >= L);
         int cs = Sgn(c - L);
         bool brk = false;
         if(InpBreakMode == MSNR_BRK_CLOSE) brk = (cs != 0 && cs != sideNow);
         else brk = (sideNow > 0) ? (MathMax(o, c) < L) : (MathMin(o, c) > L);
         if(!reach && !brk) { prevContact = false; continue; }
         bool ccBar = (k == cb);
         // the CC bar: its colour is only known at its close, so it never produces an event;
         // with the right colour its wick does not unfresh the level (p96)
         if(!ccBar && fresh && uses < IMax(1, InpMaxUses))
           {
            AddEvent(0, s, li, k, sideNow, L, 0.0, k - i, uses, breaks, 0);
            nEv++;
           }
         if(brk)
           {
            breaks++;
            fresh = true; touches = 0; uses = 0;
            sideNow = (InpBreakMode == MSNR_BRK_CLOSE) ? cs : -sideNow;
            bT = Tm(s, k);
            AddChange(BarEnd(s, k), 2);
           }
         else if(!(ccBar && cc && InpCCKeeps))
           {
            if(!prevContact) { touches++; uses++; }
            if(fresh) { fresh = false; tT = Tm(s, k); AddChange(BarEnd(s, k), 1); }
           }
         prevContact = true;
        }
      gLv[li].fresh = fresh; gLv[li].touches = touches; gLv[li].uses = uses; gLv[li].breaks = breaks;
      gLv[li].touchT = tT; gLv[li].breakT = bT; gLv[li].side = sideNow;
      gLv[li].ch0 = ch0; gLv[li].chN = ArraySize(gChT) - ch0; gLv[li].nEv = nEv;
      gLvN[s]++;
     }
  }
// state of a level at time t, using only bars closed by t
bool LvlFreshAt(int li, datetime t)
  {
   if(gLv[li].known > t) return false;
   int s = gLv[li].slot;
   long age = (long)(t - gLv[li].known) / IMax(60, PeriodSeconds(S[s].tf));
   if(age > InpLevelMaxAge) return false;
   bool fr = true;
   int e = gLv[li].ch0 + gLv[li].chN;
   for(int c = gLv[li].ch0; c < e; c++)
     {
      if(gChT[c] > t) break;
      fr = (gChK[c] == 2);
     }
   return fr;
  }
int LvlAgeNow(int li) { int s = gLv[li].slot; return LastClosed(s) - (gLv[li].j + 1); }
int FindLevel(int s, datetime t1, int kind)
  {
   for(int li = gLv0[s]; li < gLv0[s] + gLvN[s]; li++)
      if(gLv[li].t1 == t1 && gLv[li].kind == kind) return li;
   return -1;
  }

//+------------------------------------------------------------------+
//| Trendlines (p28-30, p139): 2 pivots on closes, touches 3..5      |
//+------------------------------------------------------------------+
double TLVal(int ti, int bar) { return gTL[ti].p1 + gTL[ti].k * (double)(bar - gTL[ti].b1); }
bool TLAliveAt(int ti, datetime t) { return gTL[ti].known <= t && (gTL[ti].deadT == 0 || gTL[ti].deadT > t); }
double TLValAt(int ti, datetime t)
  {
   int s = gTL[ti].slot;
   int b = BarAt(s, t);
   if(b < 0) return 0.0;
   return TLVal(ti, b);
  }
bool IsPivot(int s, int j, int N, int dir)
  {
   double c = Cl(s, j);
   for(int q = 1; q <= N; q++)
     {
      if(dir < 0) { if(!(c > Cl(s, j - q) && c >= Cl(s, j + q))) return false; }   // A point (high)
      else        { if(!(c < Cl(s, j - q) && c <= Cl(s, j + q))) return false; }   // V point (low)
     }
   return true;
  }
void BuildTLsDir(int s, int dir)
  {
   int last = LastClosed(s);
   int N = IMax(1, InpTLPivot);
   int piv[];
   int np = 0;
   for(int j = N; j + N <= last; j++)
      if(IsPivot(s, j, N, dir)) { ArrayResize(piv, np + 1, 256); piv[np] = j; np++; }
   for(int m = 1; m < np; m++)
     {
      int j2 = piv[m];
      double c2 = Cl(s, j2);
      int j1 = -1;
      for(int back = m - 1; back >= 0 && back >= m - 8; back--)
        {
         int c1i = piv[back];
         double c1 = Cl(s, c1i);
         if(dir < 0 && c1 <= c2) continue;            // falling line: 1st A higher
         if(dir > 0 && c1 >= c2) continue;            // rising line: 1st V lower
         if(j2 - c1i < IMax(1, InpTLMinBars)) continue;
         double kk = (c2 - c1) / (double)(j2 - c1i);
         bool cut = false;
         for(int x = c1i + 1; x < j2; x++)
           {
            double v = c1 + kk * (double)(x - c1i);
            double tol = InpTLTolATR * Atr(s, x);
            if(dir < 0 && Cl(s, x) > v + tol) { cut = true; break; }
            if(dir > 0 && Cl(s, x) < v - tol) { cut = true; break; }
           }
         if(cut) continue;
         j1 = c1i;
         break;
        }
      if(j1 < 0) continue;
      int ti = ArraySize(gTL);
      ArrayResize(gTL, ti + 1, 512);
      gTL[ti].slot = s; gTL[ti].dir = dir; gTL[ti].b1 = j1; gTL[ti].b2 = j2;
      gTL[ti].p1 = Cl(s, j1); gTL[ti].p2 = c2; gTL[ti].k = (c2 - Cl(s, j1)) / (double)(j2 - j1);
      gTL[ti].t1 = Tm(s, j1); gTL[ti].t2 = Tm(s, j2);
      int kc = IMin(j2 + N, last);
      gTL[ti].known = BarEnd(s, kc);
      gTL[ti].touches = 2; gTL[ti].dead = 0; gTL[ti].deadB = -1; gTL[ti].deadT = 0;
      gTL[ti].t3B = -1; gTL[ti].t4B = -1; gTL[ti].t5B = -1;
      bool prev = false;
      for(int x = kc + 1; x <= last; x++)
        {
         if(x - j2 > InpTLMaxAge) { gTL[ti].dead = 3; gTL[ti].deadB = x; gTL[ti].deadT = Tm(s, x); break; }
         double v = TLVal(ti, x);
         double tol = InpTLTolATR * Atr(s, x);
         double c = Cl(s, x);
         if((dir < 0 && c > v + tol) || (dir > 0 && c < v - tol))
           { gTL[ti].dead = 1; gTL[ti].deadB = x; gTL[ti].deadT = BarEnd(s, x); break; }
         bool touch = (dir < 0) ? (Hi(s, x) >= v - tol) : (Lo(s, x) <= v + tol);
         if(touch && !prev)
           {
            gTL[ti].touches++;
            int tn = gTL[ti].touches;
            if(tn == 3) gTL[ti].t3B = x;
            if(tn == 4) gTL[ti].t4B = x;
            if(tn == 5) gTL[ti].t5B = x;
            if(tn <= InpTLMaxTouches)
               AddEvent(1, s, ti, x, dir, v, tol, x - j2, tn - 1, 0, tn);   // falling line = resistance (bearish idea), rising = support
            if(tn >= InpTLMaxTouches) { gTL[ti].dead = 2; gTL[ti].deadB = x; gTL[ti].deadT = BarEnd(s, x); break; }
           }
         prev = touch;
        }
     }
  }
void BuildTLs(int s)
  {
   if(LastClosed(s) < 20) return;
   BuildTLsDir(s, -1);
   BuildTLsDir(s, 1);
  }
int FindTL(int s, datetime t1, int dir)
  {
   for(int i = 0; i < ArraySize(gTL); i++) if(gTL[i].slot == s && gTL[i].t1 == t1 && gTL[i].dir == dir) return i;
   return -1;
  }
double EvLineAt(int e, int k)
  {
   if(gEv[e].kind == 1) return TLVal(gEv[e].idx, k);
   return gEv[e].px;
  }

//+------------------------------------------------------------------+
//| Breakout engine (p31-79, p93, p99, p121-127)                     |
//+------------------------------------------------------------------+
// newest same-colour pair (bull-bull for d > 0) inside [a, b]; returns the first candle index or -1
int LastGapPair(int s, int d, int a, int b)
  {
   for(int x = b - 1; x >= a && x >= 0; x--)
     {
      if(d > 0 && Bull(s, x) && Bull(s, x + 1)) return x;
      if(d < 0 && Bear(s, x) && Bear(s, x + 1)) return x;
     }
   return -1;
  }
// any pair of the kinds in mask near px on slot s with both candles inside [tFrom, tTo]
bool HasPairNear(int s, int mask, double px, double tol, datetime tFrom, datetime tTo)
  {
   if(!S[s].ready || S[s].n < 3) return false;
   int a = FirstAt(s, tFrom);
   int z = LastEndBy(s, tTo);
   if(z > LastClosed(s)) z = LastClosed(s);
   for(int j = a; j + 1 <= z; j++)
     {
      int k = PairKind(s, j);
      if(k == 0) continue;
      if((mask & (1 << k)) == 0) continue;
      if(MathAbs(Junc(s, j) - px) <= tol) return true;
     }
   return false;
  }
// GAP QMS alignment (p409-412)
bool GapAligned(int bs, int d, double px, datetime tFrom, datetime tTo)
  {
   int gapMask = (d > 0) ? (1 << LK_GB) : (1 << LK_GS);
   int avMask = (1 << LK_A) | (1 << LK_V);
   double tol = gProx;
   if(bs == 3) return HasPairNear(4, gapMask, px, tol, tFrom, tTo) && HasPairNear(4, avMask, px, tol, tFrom, tTo) && HasPairNear(5, avMask, px, tol, tFrom, tTo);
   if(bs == 4) return HasPairNear(5, avMask, px, tol, tFrom, tTo) && HasPairNear(6, avMask, px, tol, tFrom, tTo);
   return true;
  }
// QM parts for a breakout at bar b of reference jr (H for bullish, L for bearish)
void QMParts(int bs, int d, int jr, int b, BOut &o)
  {
   int jl = -1;
   if(jr - 1 >= 0) jl = (d > 0) ? S[bs].tV[jr - 1] : S[bs].tA[jr - 1];
   double lpx = 0.0;
   if(jl >= 0) lpx = (d > 0) ? S[bs].vP[jl] : S[bs].aP[jl];
   double extC = Cl(bs, jr);
   double apex = (d > 0) ? Lo(bs, jr) : Hi(bs, jr);
   int apexB = jr;
   for(int x = jr; x <= b; x++)
     {
      if(d > 0) { if(Cl(bs, x) < extC) extC = Cl(bs, x); if(Lo(bs, x) < apex) { apex = Lo(bs, x); apexB = x; } }
      else      { if(Cl(bs, x) > extC) extC = Cl(bs, x); if(Hi(bs, x) > apex) { apex = Hi(bs, x); apexB = x; } }
     }
   o.qm = (jl >= 0 && lpx > 0.0 && ((d > 0 && extC < lpx) || (d < 0 && extC > lpx)));
   o.ls = lpx; o.lsB = jl; o.apex = apex; o.apexB = apexB;
   o.ers = 0.0; o.ersB = -1;
   int je = (b - 1 >= 0) ? ((d > 0) ? S[bs].pV[b - 1] : S[bs].pA[b - 1]) : -1;
   if(je > apexB)
     {
      double ep = (d > 0) ? S[bs].vP[je] : S[bs].aP[je];
      if((ep - apex) * d > 0.0) { o.ers = ep; o.ersB = je; }
     }
   o.gap = 0.0; o.gapB = -1; o.gapAl = false;
   int g = LastGapPair(bs, d, apexB, b);
   if(g >= 0)
     {
      o.gap = Junc(bs, g); o.gapB = g;
      o.gapAl = InpGapNeedsAlign ? GapAligned(bs, d, o.gap, Tm(bs, apexB), BarEnd(bs, b)) : true;
     }
  }
void FindBO(int e, int bs, bool early, BOut &o)
  {
   ZeroMemory(o);
   o.ev = e; o.kind = gEv[e].kind; o.lslot = gEv[e].slot; o.bslot = bs; o.dir = gEv[e].dir; o.early = early;
   o.tb = -1; o.refB = -1; o.boB = -1; o.lsB = -1; o.apexB = -1; o.ersB = -1; o.gapB = -1; o.rejSlot = -1; o.rejB = -1;
   o.sigB = -1; o.story = -1; o.status = ST_NODATA;
   int d = o.dir;
   int ls = o.lslot;
   int hb = gEv[e].hb;
   double L = gEv[e].px;
   double tol = gEv[e].tol;
   o.tpx = L;
   if(!S[bs].ready || S[bs].n < 20) return;
   int last = LastClosed(bs);
   datetime hOpen = gEv[e].ht;
   datetime hEnd = BarEnd(ls, hb);
   if(Tm(bs, 0) > hOpen) return;                                  // breakout TF history starts later
   int i0 = FirstAt(bs, hOpen);
   if(i0 > last) { o.status = ST_WAIT_BO; return; }
   int tb = -1;
   for(int i = i0; i <= last && Tm(bs, i) < hEnd; i++)
     {
      if((d > 0 && Lo(bs, i) <= L + tol) || (d < 0 && Hi(bs, i) >= L - tol)) { tb = i; break; }
     }
   if(tb < 1) { o.status = ST_NOTOUCH; return; }
   o.tb = tb; o.tt = Tm(bs, tb);
   // the level fails when its own TF closes through it (body break)
   o.failT = 0;
   datetime deadline = AddSec(o.tt, (long)IMax(1, InpBoMaxBars) * PeriodSeconds(S[bs].tf));
   for(int k = hb; k <= LastClosed(ls); k++)
     {
      if(Tm(ls, k) > deadline) break;
      double lk = EvLineAt(e, k);
      double c = Cl(ls, k);
      if((d > 0 && c < lk - tol) || (d < 0 && c > lk + tol)) { o.failT = BarEnd(ls, k); break; }
     }
   // rejection gate (classic levels only, p93)
   o.rejState = 0;
   if(o.kind == 0 && InpRejGate)
     {
      int rs = RejSlot(ls);
      if(rs >= 0 && S[rs].ready)
        {
         int rb = BarAt(rs, o.tt);
         o.rejSlot = rs; o.rejB = rb;
         if(rb < 0) { o.status = ST_NODATA; return; }
         o.rejT = BarEnd(rs, rb);
         if(rb > LastClosed(rs)) o.rejState = 2;
         else
           {
            double rc = Cl(rs, rb);
            bool ok = (d > 0) ? (rc > L) : (rc < L);
            o.rejState = ok ? 1 : 3;
           }
         if(o.rejState == 3) { o.status = ST_REJFAIL; return; }
        }
     }
   // external reference: last A (bullish) / V (bearish) formed BEFORE the touch
   int jRef = (d > 0) ? S[bs].pA[tb - 1] : S[bs].pV[tb - 1];
   double ref = 0.0;
   if(jRef >= 0) ref = (d > 0) ? S[bs].aP[jRef] : S[bs].vP[jRef];
   bool allowInternal = (o.kind == 1) || (InpLtfInternal && ls >= 3);
   if(o.kind == 0 && (jRef < 0 || (ref - L) * d <= 0.0)) { o.status = ST_NOREF; return; }
   int maxB = IMin(last, tb + IMax(1, InpBoMaxBars));
   for(int b = tb; b <= maxB; b++)
     {
      datetime bEnd = BarEnd(bs, b);
      if(o.failT > 0 && bEnd >= o.failT) { o.status = ST_BROKEN; return; }
      int jr = jRef;
      double rf = ref;
      if(allowInternal && b >= 1)
        {
         int jj = (d > 0) ? S[bs].pA[b - 1] : S[bs].pV[b - 1];
         if(jj >= 0)
           {
            double pj = (d > 0) ? S[bs].aP[jj] : S[bs].vP[jj];
            if(o.kind == 1 || jj >= tb) { jr = jj; rf = pj; }
           }
        }
      if(jr < 0 || rf <= 0.0) continue;
      if(o.kind == 1 && (rf - EvLineAt(e, IMin(hb, LastClosed(ls)))) * d <= 0.0) continue;
      double c = Cl(bs, b);
      if((c - rf) * d <= 0.0) continue;
      if(d > 0 && !Bull(bs, b)) continue;
      if(d < 0 && !Bear(bs, b)) continue;
      double br = BodyRatio(bs, b);
      if(br < InpStrongBody) continue;
      if(InpBodyATR > 0.0 && BodyAbs(bs, b) < InpBodyATR * Atr(bs, b)) continue;
      // breakout candle found
      o.refB = jr; o.ref = rf; o.external = (jr < tb); o.boB = b; o.boC = c; o.body = br;
      QMParts(bs, d, jr, b, o);
      datetime sig = bEnd;
      o.sigB = b; o.sigPx = c;
      if(o.rejState == 2) { o.status = ST_WAIT_REJ; return; }
      if(o.rejState == 1 && o.rejT > sig)
        {
         int q = LastEndBy(bs, o.rejT);                        // the bar closing with the rejection candle
         if(q < b) q = b;
         if(q > last) { o.status = ST_WAIT_REJ; return; }
         if((Cl(bs, q) - rf) * d <= 0.0) { b = q; continue; }   // breakout faded before the rejection close
         sig = BarEnd(bs, q); o.sigB = q; o.sigPx = Cl(bs, q);
        }
      if(o.failT > 0 && sig >= o.failT) { o.status = ST_BROKEN; return; }
      o.sigT = sig;
      o.status = ST_VALID;
      return;
     }
   o.status = (tb + InpBoMaxBars > last) ? ST_WAIT_BO : ST_EXPIRED;
  }
void ProcessEvents()
  {
   int ne = ArraySize(gEv);
   for(int e = 0; e < ne; e++)
     {
      int ls = gEv[e].slot;
      if(gEv[e].kind == 0 && !InpUseClassic) continue;
      if(gEv[e].kind == 1 && !InpUseAdvanced) continue;
      BOut best, first, o;
      bool have = false, haveFirst = false;
      for(int m = 0; m < gMapN[ls]; m++)
        {
         int bs = gMap[ls][m];
         FindBO(e, bs, false, o);
         if(!haveFirst) { first = o; haveFirst = true; }
         if(o.status == ST_VALID && (!have || o.sigT < best.sigT)) { best = o; have = true; }
        }
      if(InpEarlyBO && gMapN[ls] > 0)
        {
         int es = gMap[ls][0] - 1;
         if(es > ls)
           {
            FindBO(e, es, true, o);
            if(o.status == ST_VALID && (!have || o.sigT < best.sigT)) { best = o; have = true; }
           }
        }
      if(!have && !haveFirst) continue;
      int bi = ArraySize(gBO);
      ArrayResize(gBO, bi + 1, 2048);
      if(have) gBO[bi] = best; else gBO[bi] = first;
      gEv[e].bo = bi;
     }
  }
string StatusTxt(int st)
  {
   switch(st)
     {
      case ST_VALID:    return "valid";
      case ST_WAIT_BO:  return "waiting for the breakout";
      case ST_WAIT_REJ: return "waiting for the rejection close";
      case ST_EXPIRED:  return "no breakout in time";
      case ST_BROKEN:   return "level broken by a body close";
      case ST_REJFAIL:  return "no rejection: closed through";
      case ST_NOQM:     return "breakout without QM";
      case ST_NODATA:   return "no breakout-TF data";
      case ST_NOREF:    return "no A/V before the touch";
      case ST_NOTOUCH:  return "touch not found on the breakout TF";
     }
   return "?";
  }
string StatusCsv(int st)
  {
   switch(st)
     {
      case ST_VALID:    return "valid";
      case ST_WAIT_BO:  return "wait_bo";
      case ST_WAIT_REJ: return "wait_rej";
      case ST_EXPIRED:  return "expired";
      case ST_BROKEN:   return "broken";
      case ST_REJFAIL:  return "rejfail";
      case ST_NOQM:     return "noqm";
      case ST_NODATA:   return "nodata";
      case ST_NOREF:    return "noref";
      case ST_NOTOUCH:  return "notouch";
     }
   return "";
  }

//+------------------------------------------------------------------+
//| Targets: next fresh level / alive trendline in direction (p436)  |
//+------------------------------------------------------------------+
// nearest fresh level of slot s at least minDist beyond from (in direction d), known at t
double NextFreshLevel(int s, int d, double from, datetime t, double minDist, int &ref)
  {
   ref = -1;
   double best = 0.0, bestD = 0.0;
   for(int li = gLv0[s]; li < gLv0[s] + gLvN[s]; li++)
     {
      if(gLv[li].known > t) break;                       // levels are stored in formation order
      double dd = (gLv[li].px - from) * d;
      if(dd < minDist) continue;
      if(ref >= 0 && dd >= bestD) continue;
      if(!LvlFreshAt(li, t)) continue;
      best = gLv[li].px; bestD = dd; ref = li;
     }
   return best;
  }
double NextTL(int s, int d, double from, datetime t, double minDist, int &ref)
  {
   ref = -1;
   double best = 0.0, bestD = 0.0;
   for(int ti = 0; ti < ArraySize(gTL); ti++)
     {
      if(gTL[ti].slot != s) continue;
      if(!TLAliveAt(ti, t)) continue;
      double v = TLValAt(ti, t);
      double dd = (v - from) * d;
      if(dd < minDist) continue;
      if(ref >= 0 && dd >= bestD) continue;
      best = v; bestD = dd; ref = ti;
     }
   return best;
  }
// target on slot s: nearer of the next fresh level and the next trendline. kind 1 level, 2 TL, 0 none
double TargetOn(int s, int d, double from, datetime t, double minDist, int &kind, int &ref)
  {
   kind = 0; ref = -1;
   int rl = -1, rt = -1;
   double pl = 0.0, pt = 0.0;
   if(gLvlOn[s]) pl = NextFreshLevel(s, d, from, t, minDist, rl);
   if(gTLOn[s]) pt = NextTL(s, d, from, t, minDist, rt);
   if(rl >= 0 && (rt < 0 || (pl - from) * d <= (pt - from) * d)) { kind = 1; ref = rl; return pl; }
   if(rt >= 0) { kind = 2; ref = rt; return pt; }
   return 0.0;
  }
string TargetTxt(int kind, int s, int ref)
  {
   if(kind == 1 && ref >= 0) return SlotShort(s) + " " + KindShort(gLv[ref].kind) + " level " + D2S(gLv[ref].px);
   if(kind == 2 && ref >= 0) return SlotShort(s) + " trendline";
   return "fixed R";
  }
string TargetCsv(int kind, int s, int ref)
  {
   if(kind == 1 && ref >= 0) return SlotName(s) + "_" + KindCsv(gLv[ref].kind);
   if(kind == 2 && ref >= 0) return SlotName(s) + "_TL";
   return "FIXED";
  }

//+------------------------------------------------------------------+
//| Storylines (p202-372)                                            |
//+------------------------------------------------------------------+
// newest storyline of slot s started at or before t and still running at t (-1 none)
int StoryAt(int s, datetime t)
  {
   for(int i = ArraySize(gSt) - 1; i >= 0; i--)
     {
      if(gSt[i].slot != s) continue;
      if(gSt[i].startT > t) continue;
      if(gSt[i].endT > 0 && gSt[i].endT <= t) return -1;
      return i;
     }
   return -1;
  }
int StoryTypeAt(int st, datetime t) { if(gSt[st].mergeT > 0 && gSt[st].mergeT <= t) return gSt[st].type; return gSt[st].type0; }
string StoryTypeTxt(int type)
  {
   if(type == 3) return "Classic+Advanced";
   if(type == 2) return "Advanced";
   return "Classic";
  }
string StoryTypeCsv(int type) { if(type == 3) return "classic+advanced"; if(type == 2) return "advanced"; return "classic"; }
int ContBefore(int st, datetime t)
  {
   int c = 0;
   for(int k = gSt[st].lad0; k < gSt[st].lad0 + gSt[st].ladN; k++)
      if(gLad[k].kind == LD_CRBS && gLad[k].known <= t) c++;
   return c;
  }
// 1 start, 2 middle, 3 end (p334-337)
int StoryPart(int st, datetime t, double price)
  {
   double span = (gSt[st].target - gSt[st].startPx) * gSt[st].dir;
   if(gSt[st].target > 0.0 && span > 0.0)
     {
      double p = (price - gSt[st].startPx) * gSt[st].dir / span;
      if(p >= InpEndFrom) return 3;
      if(p >= InpMidFrom) return 2;
      return 1;
     }
   return ContBefore(st, t) > 0 ? 2 : 1;
  }
string PartTxt(int p) { return p == 3 ? "End" : (p == 2 ? "Middle" : "Start"); }
// price at time t from the finest loaded slot (close of the newest bar closed by t)
double PriceAt(datetime t)
  {
   int order[4] = {7, 4, 3, 2};
   for(int q = 0; q < 4; q++)
     {
      int s = order[q];
      if(!S[s].ready || S[s].n < 3) continue;
      int i = LastEndBy(s, t);
      if(i >= 0 && i <= LastClosed(s)) return Cl(s, i);
     }
   return 0.0;
  }
void StoryEnd(int st)
  {
   int bs = gSt[st].bslot;
   int b0 = gBO[gSt[st].bo].sigB;
   int last = LastClosed(bs);
   int d = gSt[st].dir;
   gSt[st].endT = 0; gSt[st].endWhy = 0;
   int lim = IMin(last, b0 + IMax(10, InpStoryMaxBars));
   for(int x = b0 + 1; x <= lim; x++)
     {
      if(gSt[st].target > 0.0 && ((d > 0 && Hi(bs, x) >= gSt[st].target) || (d < 0 && Lo(bs, x) <= gSt[st].target)))
        { gSt[st].endT = BarEnd(bs, x); gSt[st].endWhy = 1; return; }
      if((d > 0 && Cl(bs, x) < gSt[st].apex) || (d < 0 && Cl(bs, x) > gSt[st].apex))
        { gSt[st].endT = BarEnd(bs, x); gSt[st].endWhy = 3; return; }
     }
   if(lim < last) { gSt[st].endT = BarEnd(bs, lim); gSt[st].endWhy = 4; }
  }
void BuildStories()
  {
   for(int s = 0; s < NSLOT; s++) gLastStory[s] = -1;
   int nb = ArraySize(gBO);
   int idx[];
   int nv = 0;
   for(int i = 0; i < nb; i++)
     {
      if(gBO[i].status != ST_VALID) continue;
      ArrayResize(idx, nv + 1, 512);
      idx[nv] = i; nv++;
     }
   // insertion sort by signal time
   for(int a = 1; a < nv; a++)
     {
      int v = idx[a];
      int b = a - 1;
      while(b >= 0 && gBO[idx[b]].sigT > gBO[v].sigT) { idx[b + 1] = idx[b]; b--; }
      idx[b + 1] = v;
     }
   for(int q = 0; q < nv; q++)
     {
      int i = idx[q];
      int s = gBO[i].lslot;
      int d = gBO[i].dir;
      datetime t = gBO[i].sigT;
      int cur = gLastStory[s];
      bool curActive = (cur >= 0 && (gSt[cur].endT == 0 || gSt[cur].endT > t));
      bool sameDir = curActive && gSt[cur].dir == d;
      if(!gBO[i].qm && InpRequireQM && !sameDir) { gBO[i].status = ST_NOQM; continue; }
      int kindBit = (gBO[i].kind == 1) ? 2 : 1;
      long win = (long)IMax(1, InpMergeBars) * PeriodSeconds(S[gBO[i].bslot].tf);
      if(sameDir && (long)(t - gSt[cur].startT) <= win)
        {
         if((gSt[cur].type & kindBit) == 0) { gSt[cur].type |= kindBit; gSt[cur].mergeT = t; }
         gBO[i].story = cur;
         continue;
        }
      if(curActive) { gSt[cur].endT = t; gSt[cur].endWhy = sameDir ? 5 : 2; }
      int n = ArraySize(gSt);
      ArrayResize(gSt, n + 1, 256);
      Story z;
      ZeroMemory(z);
      gSt[n] = z;
      gSt[n].bo = i; gSt[n].slot = s; gSt[n].bslot = gBO[i].bslot; gSt[n].dir = d;
      gSt[n].type0 = kindBit; gSt[n].type = kindBit; gSt[n].mergeT = 0;
      gSt[n].cont = sameDir; gSt[n].noQM = !gBO[i].qm;
      gSt[n].startT = t; gSt[n].startPx = gBO[i].sigPx; gSt[n].lvPx = gBO[i].tpx; gSt[n].apex = gBO[i].apex;
      int tk = 0, tr = -1;
      double tg = TargetOn(s, d, gBO[i].sigPx, t, gMinStop, tk, tr);
      gSt[n].target = tg; gSt[n].tgtKind = tk; gSt[n].tgtSlot = s; gSt[n].tgtRef = tr;
      gSt[n].lad0 = 0; gSt[n].ladN = 0; gSt[n].nCont = 0;
      StoryEnd(n);
      // Double Apex (p381-388): another swing extreme within tolerance of the apex inside the QM
      int bs = gBO[i].bslot;
      int ax = gBO[i].apexB;
      bool dbl = false;
      int from = IMax(1, gBO[i].lsB >= 0 ? gBO[i].lsB : gBO[i].refB);
      for(int x = from; x < gBO[i].boB && x + 1 < S[bs].n; x++)
        {
         if(MathAbs(x - ax) < 2) continue;
         double ex = (d > 0) ? Lo(bs, x) : Hi(bs, x);
         bool sw = (d > 0) ? (Lo(bs, x) <= Lo(bs, x - 1) && Lo(bs, x) <= Lo(bs, x + 1)) : (Hi(bs, x) >= Hi(bs, x - 1) && Hi(bs, x) >= Hi(bs, x + 1));
         if(sw && MathAbs(ex - gBO[i].apex) <= gEqTol) { dbl = true; break; }
        }
      gSt[n].dblApex = dbl;
      // QM-CC: the apex is a single spike candle
      bool cc = false;
      if(ax >= 1 && ax + 1 < S[bs].n)
        {
         double rg = Hi(bs, ax) - Lo(bs, ax);
         double wk = (d > 0) ? (MathMin(Op(bs, ax), Cl(bs, ax)) - Lo(bs, ax)) : (Hi(bs, ax) - MathMax(Op(bs, ax), Cl(bs, ax)));
         if(rg > 0.0 && wk >= InpSpikeWick * rg)
           {
            double nb1 = (d > 0) ? MathMin(Lo(bs, ax - 1), Lo(bs, ax + 1)) : MathMax(Hi(bs, ax - 1), Hi(bs, ax + 1));
            if((nb1 - gBO[i].apex) * d >= 0.5 * wk) cc = true;
           }
        }
      gSt[n].qmcc = cc;
      gBO[i].story = n;
      gLastStory[s] = n;
     }
  }

//+------------------------------------------------------------------+
//| QM ladder: part 1 (p368-372) and continuation levels (p489-550)  |
//+------------------------------------------------------------------+
void AddLad(int st, int kind, int contNo, double px, datetime known, int srcB, double inval, bool cont, bool gapAl)
  {
   if(px <= 0.0) return;
   int n = ArraySize(gLad);
   ArrayResize(gLad, n + 1, 1024);
   gLad[n].st = st; gLad[n].kind = kind; gLad[n].contNo = contNo; gLad[n].dir = gSt[st].dir; gLad[n].bslot = gSt[st].bslot;
   gLad[n].px = px; gLad[n].known = known; gLad[n].srcB = srcB; gLad[n].inval = inval; gLad[n].cont = cont;
   gLad[n].gapAl = gapAl; gLad[n].setup = -1;
   gSt[st].ladN++;
  }
string LadName(int kind, int d)
  {
   switch(kind)
     {
      case LD_RBS:   return d > 0 ? "RBS" : "SBR";
      case LD_LS:    return "LS";
      case LD_GAP:   return "GAP";
      case LD_APEX:  return "APEX";
      case LD_ERS:   return "ERS";
      case LD_CRBS:  return d > 0 ? "C-RBS" : "C-SBR";
      case LD_CAPEX: return "C.APEX";
      case LD_CGAP:  return "C-GAP";
     }
   return "?";
  }
bool LadOn(int kind)
  {
   switch(kind)
     {
      case LD_RBS:  return InpSetRBS;
      case LD_LS:   return InpSetLS;
      case LD_GAP:  return InpSetGap;
      case LD_APEX: return InpSetApex;
      case LD_ERS:  return InpSetERS;
     }
   return InpSetCont;
  }
void BuildLadders()
  {
   for(int st = 0; st < ArraySize(gSt); st++)
     {
      int i = gSt[st].bo;
      int d = gSt[st].dir;
      int bs = gSt[st].bslot;
      gSt[st].lad0 = ArraySize(gLad);
      gSt[st].ladN = 0;
      datetime k0 = gBO[i].sigT;
      double apex = gBO[i].apex;
      AddLad(st, LD_RBS, 0, gBO[i].ref, k0, gBO[i].refB, apex, false, true);
      if(gBO[i].lsB >= 0 && (gBO[i].ls - apex) * d > 0.0 && (gBO[i].ref - gBO[i].ls) * d > 0.0)
         AddLad(st, LD_LS, 0, gBO[i].ls, k0, gBO[i].lsB, apex, false, true);
      if(gBO[i].gapB >= 0 && bs < 5)                                   // no GAP setups for 30M QM and below (p514)
         AddLad(st, LD_GAP, 0, gBO[i].gap, k0, gBO[i].gapB, apex, false, gBO[i].gapAl);
      AddLad(st, LD_APEX, 0, apex, k0, gBO[i].apexB, apex - d * gMinStop, false, true);
      if(gBO[i].ersB >= 0) AddLad(st, LD_ERS, 0, gBO[i].ers, k0, gBO[i].ersB, apex, false, true);
      // continuation breakouts on the breakout TF inside the storyline
      int last = LastClosed(bs);
      int lastBO = gBO[i].boB;
      int lim = IMin(last, gBO[i].sigB + IMax(10, InpStoryMaxBars));
      for(int x = gBO[i].sigB + 1; x <= lim && gSt[st].nCont < InpMaxCont; x++)
        {
         if(gSt[st].endT > 0 && BarEnd(bs, x) > gSt[st].endT) break;
         int ja = (d > 0) ? S[bs].pA[x - 1] : S[bs].pV[x - 1];
         if(ja < 0 || ja <= lastBO) continue;                          // a new A / V after the last breakout = pullback
         double rp = (d > 0) ? S[bs].aP[ja] : S[bs].vP[ja];
         if((Cl(bs, x) - rp) * d <= 0.0) continue;
         if(d > 0 && !Bull(bs, x)) continue;
         if(d < 0 && !Bear(bs, x)) continue;
         if(BodyRatio(bs, x) < InpStrongBody) continue;
         double cap = (d > 0) ? Lo(bs, lastBO + 1) : Hi(bs, lastBO + 1);
         int capB = lastBO + 1;
         for(int y = lastBO + 1; y <= x; y++)
           {
            if(d > 0 && Lo(bs, y) < cap) { cap = Lo(bs, y); capB = y; }
            if(d < 0 && Hi(bs, y) > cap) { cap = Hi(bs, y); capB = y; }
           }
         gSt[st].nCont++;
         int cn = gSt[st].nCont;
         datetime kx = BarEnd(bs, x);
         AddLad(st, LD_CRBS, cn, rp, kx, ja, cap, true, true);
         AddLad(st, LD_CAPEX, cn, cap, kx, capB, cap - d * gMinStop, true, true);
         int g = LastGapPair(bs, d, capB, x);
         if(g >= 0 && bs < 5) AddLad(st, LD_CGAP, cn, Junc(bs, g), kx, g, cap, true, true);
         lastBO = x;
        }
     }
  }

//+------------------------------------------------------------------+
//| Entry confirmations (p413-434)                                   |
//+------------------------------------------------------------------+
bool Engulf(int s, int k, int d)
  {
   if(k < 1) return false;
   if(d > 0) return Bull(s, k) && Bear(s, k - 1) && Cl(s, k) >= Op(s, k - 1) && Op(s, k) <= Cl(s, k - 1);
   return Bear(s, k) && Bull(s, k - 1) && Cl(s, k) <= Op(s, k - 1) && Op(s, k) >= Cl(s, k - 1);
  }
double ExtremeBack(int s, int k, int nBars, int d)
  {
   double e = (d > 0) ? Lo(s, k) : Hi(s, k);
   for(int x = IMax(0, k - nBars + 1); x <= k; x++)
     {
      if(d > 0 && Lo(s, x) < e) e = Lo(s, x);
      if(d < 0 && Hi(s, x) > e) e = Hi(s, x);
     }
   return e;
  }
bool NearLevel(double ext, double px, int d) { return (d > 0) ? (ext <= px + gProx) : (ext >= px - gProx); }
// window of slot cs bars for [tA, tZ): first bar containing tA .. last closed bar opening before tZ
bool ConfWindow(int cs, datetime tA, datetime tZ, int &a, int &z)
  {
   if(!S[cs].ready || S[cs].n < 30) return false;
   a = BarAt(cs, tA);
   if(a < 1) a = 1;
   z = LastClosed(cs);
   int zz = FirstAt(cs, tZ) - 1;
   if(zz < z) z = zz;
   return z >= a;
  }
// 5M EMA(9, close) engulfing break (main trigger)
bool ConfEMA(int cs, int d, double px, datetime tA, datetime tZ, int &bar, double &entry, double &ext)
  {
   int a = 0, z = 0;
   if(!ConfWindow(cs, tA, tZ, a, z)) return false;
   for(int k = a; k <= z; k++)
     {
      if(k < 3 * InpEmaLen) continue;
      if(!Engulf(cs, k, d)) continue;
      double e0 = S[cs].ema[k], e1 = S[cs].ema[k - 1];
      bool cross = (d > 0) ? (Cl(cs, k) > e0 && (Cl(cs, k - 1) <= e1 || Op(cs, k) < e0)) : (Cl(cs, k) < e0 && (Cl(cs, k - 1) >= e1 || Op(cs, k) > e0));
      if(!cross) continue;
      double nr = (d > 0) ? MathMin(Lo(cs, k), Lo(cs, k - 1)) : MathMax(Hi(cs, k), Hi(cs, k - 1));
      if(!NearLevel(nr, px, d)) continue;
      bar = k; entry = Cl(cs, k); ext = ExtremeBack(cs, k, InpSwingLook, d);
      return true;
     }
   return false;
  }
// candle rejection: wick through the level, close back; buy = bearish candle (p414-418)
bool ConfRej(int cs, int d, double px, datetime tA, datetime tZ, int &bar, double &entry, double &ext)
  {
   int a = 0, z = 0;
   if(!ConfWindow(cs, tA, tZ, a, z)) return false;
   for(int k = a; k <= z; k++)
     {
      bool wick = (d > 0) ? (Lo(cs, k) <= px + gProx && Lo(cs, k) >= px - gBreakDist && Cl(cs, k) > px)
                          : (Hi(cs, k) >= px - gProx && Hi(cs, k) <= px + gBreakDist && Cl(cs, k) < px);
      if(!wick) continue;
      if(InpRejOppColour && ((d > 0 && !Bear(cs, k)) || (d < 0 && !Bull(cs, k)))) continue;
      bar = k; entry = Cl(cs, k); ext = (d > 0) ? Lo(cs, k) : Hi(cs, k);
      return true;
     }
   return false;
  }
// breaking gap: engulfing candle breaks the newest opposite gap, entry on the pullback to it
bool ConfGap(int cs, int d, double px, datetime tA, datetime tZ, int &bar, double &entry, double &ext)
  {
   int a = 0, z = 0;
   if(!ConfWindow(cs, tA, tZ, a, z)) return false;
   int lastC = LastClosed(cs);
   for(int k = a + 1; k <= z; k++)
     {
      if(!Engulf(cs, k, d)) continue;
      int g = LastGapPair(cs, -d, IMax(0, a - 6), k - 1);          // bearish gap for a buy
      if(g < 0) continue;
      double gp = Junc(cs, g);
      if((gp - px) * d < 0.0 || (gp - px) * d > 3.0 * gProx) continue;
      if(!((Cl(cs, k) - gp) * d > 0.0 && (Cl(cs, k - 1) - gp) * d <= 0.0)) continue;
      for(int m = k + 1; m <= IMin(lastC, k + InpPullbackBars); m++)
        {
         bool back = (d > 0) ? (Lo(cs, m) <= gp) : (Hi(cs, m) >= gp);
         if(!back) continue;
         bar = m; entry = gp; ext = ExtremeBack(cs, m, m - a + 1, d);
         return true;
        }
     }
   return false;
  }
// micro trendline break by an engulfing candle (last two A points for a buy)
bool ConfTL(int cs, int d, double px, datetime tA, datetime tZ, int &bar, double &entry, double &ext)
  {
   int a = 0, z = 0;
   if(!ConfWindow(cs, tA, tZ, a, z)) return false;
   for(int k = a + 1; k <= z; k++)
     {
      if(!Engulf(cs, k, d)) continue;
      int j2 = (d > 0) ? S[cs].pA[k - 1] : S[cs].pV[k - 1];
      if(j2 < 1) continue;
      int j1 = (d > 0) ? S[cs].pA[j2 - 1] : S[cs].pV[j2 - 1];
      if(j1 < 0 || j1 < k - InpMicroLook || j1 >= j2) continue;
      double p1 = (d > 0) ? S[cs].aP[j1] : S[cs].vP[j1];
      double p2 = (d > 0) ? S[cs].aP[j2] : S[cs].vP[j2];
      if((p1 - p2) * d <= 0.0) continue;                              // falling line for a buy
      double kk = (p2 - p1) / (double)(j2 - j1);
      double v = p2 + kk * (double)(k - j2), v1 = p2 + kk * (double)(k - 1 - j2);
      if(!((Cl(cs, k) - v) * d > 0.0 && (Cl(cs, k - 1) - v1) * d <= 0.0)) continue;
      double ex = ExtremeBack(cs, k, k - j1 + 1, d);
      if(!NearLevel(ex, px, d)) continue;
      bar = k; entry = Cl(cs, k); ext = ex;
      return true;
     }
   return false;
  }
// mini QM on the QM TF, entry on the pullback to its LS
bool ConfQM(int cs, int d, double px, datetime tA, datetime tZ, int &bar, double &entry, double &ext)
  {
   int a = 0, z = 0;
   if(!ConfWindow(cs, tA, tZ, a, z)) return false;
   int lastC = LastClosed(cs);
   for(int k = a + 1; k <= z; k++)
     {
      int jr = (d > 0) ? S[cs].pA[k - 1] : S[cs].pV[k - 1];
      if(jr < 1) continue;
      double rp = (d > 0) ? S[cs].aP[jr] : S[cs].vP[jr];
      if(!((Cl(cs, k) - rp) * d > 0.0 && (Cl(cs, k - 1) - rp) * d <= 0.0)) continue;
      if((d > 0 && !Bull(cs, k)) || (d < 0 && !Bear(cs, k)) || BodyRatio(cs, k) < InpStrongBody) continue;
      int jl = (d > 0) ? S[cs].tV[jr - 1] : S[cs].tA[jr - 1];
      if(jl < 0) continue;
      double lsp = (d > 0) ? S[cs].vP[jl] : S[cs].aP[jl];
      double extC = Cl(cs, jr), ap = (d > 0) ? Lo(cs, jr) : Hi(cs, jr);
      for(int x = jr; x <= k; x++)
        {
         if(d > 0) { extC = MathMin(extC, Cl(cs, x)); ap = MathMin(ap, Lo(cs, x)); }
         else      { extC = MathMax(extC, Cl(cs, x)); ap = MathMax(ap, Hi(cs, x)); }
        }
      bool qm = (d > 0) ? (extC < lsp) : (extC > lsp);
      if(!qm || !NearLevel(ap, px, d)) continue;
      if((lsp - ap) * d <= 0.0) continue;
      for(int m = k + 1; m <= IMin(lastC, k + InpPullbackBars); m++)
        {
         if((d > 0 && Cl(cs, m) < ap) || (d < 0 && Cl(cs, m) > ap)) break;   // mini QM failed
         bool back = (d > 0) ? (Lo(cs, m) <= lsp) : (Hi(cs, m) >= lsp);
         if(!back) continue;
         bar = m; entry = lsp; ext = ap;
         return true;
        }
     }
   return false;
  }
string ConfName(int c)
  {
   switch(c)
     {
      case CF_REJ: return "candle rejection";
      case CF_GAP: return "breaking gap";
      case CF_TL:  return "micro trendline break";
      case CF_QM:  return "mini QM";
      case CF_EMA: return "EMA engulf";
     }
   return "?";
  }
string ConfCsv(int c)
  {
   switch(c)
     {
      case CF_REJ: return "REJ";
      case CF_GAP: return "GAP";
      case CF_TL:  return "TL";
      case CF_QM:  return "QM";
      case CF_EMA: return "EMA";
     }
   return "";
  }

//+------------------------------------------------------------------+
//| Risk plan (display only, p435-441, p547-550)                     |
//+------------------------------------------------------------------+
// lot size for a stop distance in price units: risk money / loss per lot. A correct formula;
// the book's own worked lot examples are wrong (its personal-account phases risk 5-30% per trade).
double LotsFor(double slDist)
  {
   double tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE_LOSS);
   if(tv <= 0.0) tv = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_VALUE);
   double ts = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);
   if(tv <= 0.0 || ts <= 0.0 || slDist <= 0.0) return 0.0;
   double dist = slDist;
   if(InpRiskAddSpread) dist += (double)SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) * SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   double lossPerLot = dist / ts * tv;
   if(lossPerLot <= 0.0) return 0.0;
   double base = InpRiskOnEquity ? AccountInfoDouble(ACCOUNT_EQUITY) : AccountInfoDouble(ACCOUNT_BALANCE);
   double risk = base * InpRiskPct / 100.0;
   double lots = risk / lossPerLot;
   double step = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_STEP);
   double vmax = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MAX);
   if(step > 0.0) lots = MathFloor(lots / step + 1e-9) * step;
   if(vmax > 0.0 && lots > vmax) lots = vmax;
   return lots;
  }
string LotsTxt(double lots)
  {
   double vmin = SymbolInfoDouble(_Symbol, SYMBOL_VOLUME_MIN);
   if(lots <= 0.0 || lots < vmin) return "below min lot (" + DoubleToString(vmin, 2) + ") at " + DoubleToString(InpRiskPct, 2) + "%";
   return DoubleToString(lots, 2) + " lot";
  }
// QMS TP: next fresh level / TL of the storyline TF; ladder up while the higher storyline agrees (p436-437)
double PlanTP(int st, int d, double entry, datetime t, double slDist, bool cont, int &kind, int &tslot, int &ref)
  {
   kind = 0; ref = -1; tslot = gSt[st].slot;
   double minD = MathMax(InpTPMinR * slDist, gMinStop * 0.5);
   if(cont && InpContTP == MSNR_CTP_FIXED) return entry + d * InpContRR * slDist;
   int s = gSt[st].slot;
   if(!cont && InpTPLadder && s <= 2)
     {
      while(s > 0)
        {
         int hs = s - 1;
         int hst = StoryAt(hs, t);
         if(hst < 0 || gSt[hst].dir != d) break;
         s = hs;
        }
     }
   int k = 0, r = -1;
   double tp = TargetOn(s, d, entry, t, minD, k, r);
   if(k == 0 && s != gSt[st].slot) { s = gSt[st].slot; tp = TargetOn(s, d, entry, t, minD, k, r); }
   if(k > 0) { kind = k; ref = r; tslot = s; return tp; }
   return entry + d * (cont ? InpContRR : InpFallbackRR) * slDist;
  }

//+------------------------------------------------------------------+
//| Setups (price returns to a QM level) and entries                 |
//+------------------------------------------------------------------+
bool QMCNear(int d, double px, datetime t)
  {
   for(int ti = 0; ti < ArraySize(gTL); ti++)
     {
      if(gTL[ti].dir != d) continue;                      // rising line for a bullish QMC
      if(!TLAliveAt(ti, t)) continue;
      if(MathAbs(TLValAt(ti, t) - px) <= gProx) return true;
     }
   return false;
  }
void BuildSetups()
  {
   int es = gEntrySlot;
   if(!S[es].ready || S[es].n < 30) return;
   int lastE = LastClosed(es);
   for(int li = 0; li < ArraySize(gLad); li++)
     {
      if(!LadOn(gLad[li].kind)) continue;
      if((gLad[li].kind == LD_GAP || gLad[li].kind == LD_CGAP) && !gLad[li].gapAl) continue;
      int st = gLad[li].st;
      int d = gLad[li].dir;
      double px = gLad[li].px;
      datetime t0 = gLad[li].known;
      datetime tLim = AddSec(t0, (long)IMax(1, InpSetupMaxBars) * PeriodSeconds(S[gLad[li].bslot].tf));
      if(gSt[st].endT > 0 && gSt[st].endT < tLim) tLim = gSt[st].endT;
      int a = FirstAt(es, t0);
      if(a < 1 || a > lastE) continue;
      int arm = -1;
      for(int x = a; x <= lastE && Tm(es, x) < tLim; x++)
        {
         if((d > 0 && Cl(es, x) < gLad[li].inval) || (d < 0 && Cl(es, x) > gLad[li].inval)) break;   // QM / pullback failed first
         if((d > 0 && Lo(es, x) <= px + gProx) || (d < 0 && Hi(es, x) >= px - gProx)) { arm = x; break; }
        }
      if(arm < 0) continue;
      int n = ArraySize(gSu);
      ArrayResize(gSu, n + 1, 512);
      gSu[n].lad = li; gSu[n].st = st; gSu[n].armT = Tm(es, arm); gSu[n].armB = arm; gSu[n].ent = -1;
      gSu[n].qmc = (gLad[li].kind == LD_LS) ? QMCNear(d, px, Tm(es, arm)) : false;
      gLad[li].setup = n;
      // the setup lives until a close through the level, the confirmation window or the storyline end
      datetime tZ = AddSec(Tm(es, arm), (long)IMax(1, InpConfMaxBars) * PeriodSeconds(S[es].tf));
      int why = 4;
      if(gSt[st].endT > 0 && gSt[st].endT < tZ) { tZ = gSt[st].endT; why = 5; }
      for(int x = arm; x <= lastE && Tm(es, x) < tZ; x++)
        {
         if((d > 0 && Cl(es, x) < px - gBreakDist) || (d < 0 && Cl(es, x) > px + gBreakDist)) { tZ = BarEnd(es, x); why = 3; break; }
        }
      gSu[n].endT = tZ;
      // earliest confirmation (ties: EMA first, the book's main trigger)
      int bc = 0, bb = -1, bsl = -1;
      double be = 0.0, bx = 0.0;
      datetime bt = 0;
      datetime tA = Tm(es, arm);
      int cb = -1; double ce = 0.0, cx = 0.0;
      if(InpConfEMA && ConfEMA(es, d, px, tA, tZ, cb, ce, cx)) { datetime ct = BarEnd(es, cb); if(bc == 0 || ct < bt) { bc = CF_EMA; bb = cb; bsl = es; be = ce; bx = cx; bt = ct; } }
      if(InpConfRej && ConfRej(gRejSlot, d, px, tA, tZ, cb, ce, cx)) { datetime ct = BarEnd(gRejSlot, cb); if(bc == 0 || ct < bt) { bc = CF_REJ; bb = cb; bsl = gRejSlot; be = ce; bx = cx; bt = ct; } }
      if(InpConfTL && ConfTL(es, d, px, tA, tZ, cb, ce, cx)) { datetime ct = BarEnd(es, cb); if(bc == 0 || ct < bt) { bc = CF_TL; bb = cb; bsl = es; be = ce; bx = cx; bt = ct; } }
      if(InpConfGap && ConfGap(es, d, px, tA, tZ, cb, ce, cx)) { datetime ct = BarEnd(es, cb); if(bc == 0 || ct < bt) { bc = CF_GAP; bb = cb; bsl = es; be = ce; bx = cx; bt = ct; } }
      if(InpConfQM && ConfQM(gQMSlot, d, px, tA, tZ, cb, ce, cx)) { datetime ct = BarEnd(gQMSlot, cb); if(bc == 0 || ct < bt) { bc = CF_QM; bb = cb; bsl = gQMSlot; be = ce; bx = cx; bt = ct; } }
      if(bc == 0)
        {
         gSu[n].status = (BarEnd(es, lastE) < tZ && why != 3) ? 1 : why;
         continue;
        }
      gSu[n].status = 2;
      int m = ArraySize(gEn);
      ArrayResize(gEn, m + 1, 512);
      Ent ze;
      ZeroMemory(ze);
      gEn[m] = ze;
      gEn[m].setup = n; gEn[m].st = st; gEn[m].conf = bc; gEn[m].cslot = bsl; gEn[m].bar = bb; gEn[m].t = bt; gEn[m].dir = d;
      gEn[m].entry = be; gEn[m].extreme = bx;
      double sd = (be - (bx - d * gBuf)) * d;
      if(sd < gMinStop) sd = gMinStop;                                   // at least 30 pips (p435)
      if(sd <= 0.0) sd = gPip;
      gEn[m].slDist = sd;
      gEn[m].sl = be - d * sd;
      int tk = 0, tsl = gSt[st].slot, tr = -1;
      gEn[m].tp = PlanTP(st, d, be, bt, sd, gLad[li].cont, tk, tsl, tr);
      gEn[m].tpKind = tk; gEn[m].tpSlot = tsl; gEn[m].tpRef = tr;
      gEn[m].rr = (gEn[m].tp - be) * d / sd;
      gEn[m].lots = LotsFor(sd);
      gEn[m].qm2qm = (bc == CF_QM && gLad[li].kind == LD_LS);
      gSu[n].ent = m;
     }
  }
string SetupFlags(int su, bool csv)
  {
   int li = gSu[su].lad;
   int st = gSu[su].st;
   string f = "";
   string sp = csv ? " " : ", ";
   if(gLad[li].kind == LD_LS || gLad[li].kind == LD_APEX)
     {
      if(gSt[st].dblApex) f += (f == "" ? "" : sp) + (csv ? "DBLAPEX" : "Double Apex");
      if(gSt[st].qmcc) f += (f == "" ? "" : sp) + (csv ? "QMCC" : "QM-CC");
     }
   if(gSu[su].qmc) f += (f == "" ? "" : sp) + "QMC";
   if(gSu[su].ent >= 0 && gEn[gSu[su].ent].qm2qm) f += (f == "" ? "" : sp) + (csv ? "QM2QM" : "QM-to-QM");
   return f;
  }
string SetupName(int su)
  {
   int li = gSu[su].lad;
   string nm = LadName(gLad[li].kind, gLad[li].dir);
   string f = SetupFlags(su, false);
   if(f != "") nm += " (" + f + ")";
   return nm;
  }
string SuStatusTxt(int stt)
  {
   switch(stt)
     {
      case 1: return "armed, waiting for a confirmation";
      case 2: return "entered";
      case 3: return "failed: closed through the level";
      case 4: return "expired: no confirmation in time";
      case 5: return "storyline ended";
     }
   return "?";
  }

//+------------------------------------------------------------------+
//| Full computation                                                 |
//+------------------------------------------------------------------+
void Compute()
  {
   ArrayResize(gLv, 0); ArrayResize(gChT, 0); ArrayResize(gChK, 0); ArrayResize(gTL, 0); ArrayResize(gEv, 0);
   ArrayResize(gBO, 0); ArrayResize(gSt, 0); ArrayResize(gLad, 0); ArrayResize(gSu, 0); ArrayResize(gEn, 0);
   for(int s = 0; s < NSLOT; s++) { gLv0[s] = 0; gLvN[s] = 0; gLastStory[s] = -1; }
   for(int s = 0; s < NSLOT; s++) if(gLvlOn[s] && S[s].ready) BuildLevels(s);
   for(int s = 0; s < NSLOT; s++) if(gTLOn[s] && S[s].ready) BuildTLs(s);
   ProcessEvents();
   BuildStories();
   BuildLadders();
   BuildSetups();
  }

//+------------------------------------------------------------------+
//| Object helpers                                                   |
//+------------------------------------------------------------------+
string Nm(string kc, int s, long key, int sub, string piece)
  {
   return PFX_DRAW + kc + "_" + IntegerToString(s) + "_" + IntegerToString(key) + "_" + IntegerToString(sub) + "_" + piece;
  }
string Tip(string full)
  {
   int mx = IMax(120, InpTipMax);
   if(StringLen(full) <= mx) return full;
   string cut = StringSubstr(full, 0, mx);
   int p = -1, q = 0;
   while(true) { int f = StringFind(cut, "\n", q); if(f < 0) break; p = f; q = f + 1; }
   if(p > 40) cut = StringSubstr(cut, 0, p);
   return cut + "\n... click for the full card";
  }
void ObjCommon(string nm, string tip)
  {
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_SELECTED, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
  }
void ObjTrend(string nm, datetime t1, double p1, datetime t2, double p2, color c, int style, int width, bool ray, string tip)
  {
   if(ObjectFind(0, nm) >= 0) ObjectDelete(0, nm);
   if(!ObjectCreate(0, nm, OBJ_TREND, 0, t1, p1, t2, p2)) return;
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_STYLE, style);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, width);
   ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, ray);
   ObjectSetInteger(0, nm, OBJPROP_RAY_LEFT, false);
   ObjCommon(nm, tip);
  }
void ObjText(string nm, datetime t, double p, string txt, color c, int size, ENUM_ANCHOR_POINT anc, string tip)
  {
   if(ObjectFind(0, nm) >= 0) ObjectDelete(0, nm);
   if(!ObjectCreate(0, nm, OBJ_TEXT, 0, t, p)) return;
   ObjectSetString(0, nm, OBJPROP_TEXT, txt);
   ObjectSetString(0, nm, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anc);
   ObjCommon(nm, tip);
  }
void ObjArrow(string nm, datetime t, double p, int code, color c, bool below, int width, string tip)
  {
   if(ObjectFind(0, nm) >= 0) ObjectDelete(0, nm);
   if(!ObjectCreate(0, nm, OBJ_ARROW, 0, t, p)) return;
   ObjectSetInteger(0, nm, OBJPROP_ARROWCODE, code);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, width);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, below ? ANCHOR_TOP : ANCHOR_BOTTOM);
   ObjCommon(nm, tip);
  }
void Lbl(string nm, int x, int y, string txt, color c, int size, string font, ENUM_BASE_CORNER corner, ENUM_ANCHOR_POINT anc, string tip)
  {
   if(ObjectFind(0, nm) < 0) ObjectCreate(0, nm, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, nm, OBJPROP_CORNER, corner);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anc);
   ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, y);
   ObjectSetString(0, nm, OBJPROP_TEXT, txt);
   ObjectSetString(0, nm, OBJPROP_FONT, font);
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetInteger(0, nm, OBJPROP_ZORDER, 10);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip == "" ? "\n" : tip);
  }
void Box(string nm, int x, int y, int w, int h, color bg, color border)
  {
   if(ObjectFind(0, nm) < 0) ObjectCreate(0, nm, OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, nm, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, x);
   ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, nm, OBJPROP_XSIZE, w);
   ObjectSetInteger(0, nm, OBJPROP_YSIZE, h);
   ObjectSetInteger(0, nm, OBJPROP_BGCOLOR, bg);
   ObjectSetInteger(0, nm, OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, border);
   ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetInteger(0, nm, OBJPROP_ZORDER, 9);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, "\n");
  }

//+------------------------------------------------------------------+
//| Explanation texts (tooltip = short, card = full)                 |
//+------------------------------------------------------------------+
string CandleTxt(int s, int i)
  {
   if(i < 0 || i >= S[s].n) return "?";
   string c = Bull(s, i) ? "bull" : (Bear(s, i) ? "bear" : "doji");
   return c + " " + TShort(Tm(s, i)) + " O " + D2S(Op(s, i)) + " H " + D2S(Hi(s, i)) + " L " + D2S(Lo(s, i)) + " C " + D2S(Cl(s, i));
  }
string JuncTxt()
  {
   if(InpJunction == MSNR_JUNC_OPEN2) return "open of the 2nd candle";
   if(InpJunction == MSNR_JUNC_MID) return "average of close 1 and open 2";
   return "close of the 1st candle";
  }
double NowPx() { return SymbolInfoDouble(_Symbol, SYMBOL_BID); }
string AlignTxt(datetime t)
  {
   int sD = StoryAt(2, t), sW = StoryAt(1, t), sM = StoryAt(0, t);
   int dD = sD >= 0 ? gSt[sD].dir : 0, dW = sW >= 0 ? gSt[sW].dir : 0, dM = sM >= 0 ? gSt[sM].dir : 0;
   string tx = "D " + DirShort(dD) + ", W " + DirShort(dW) + ", M " + DirShort(dM);
   if(dD != 0 && dD == dW && dW == dM)
     {
      bool lead = gSt[sD].startT <= gSt[sW].startT && gSt[sW].startT <= gSt[sM].startT;
      return Mk(true) + " aligned " + DirTxt(dD) + " (" + tx + ")" + (lead ? ", D led W led M (p313-323)" : "");
     }
   if(dD != 0 && dD == dW) return Mk(true) + " D and W agree, M " + DirShort(dM) + " (" + tx + ")";
   if(dD == 0 && dW == 0 && dM == 0) return Mk(false) + " no active D / W / M storyline";
   return Mk(false) + " mixed (" + tx + "): wait, never trade against alignment (p305, p317)";
  }
bool AlignedAt(datetime t, int &dir, bool &lead)
  {
   int sD = StoryAt(2, t), sW = StoryAt(1, t), sM = StoryAt(0, t);
   dir = 0; lead = false;
   if(sD < 0 || sW < 0 || sM < 0) return false;
   if(gSt[sD].dir != gSt[sW].dir || gSt[sW].dir != gSt[sM].dir) return false;
   dir = gSt[sD].dir;
   lead = gSt[sD].startT <= gSt[sW].startT && gSt[sW].startT <= gSt[sM].startT;
   return true;
  }
string StoryLine(int s, datetime t, double price)
  {
   int st = StoryAt(s, t);
   if(st < 0) return SlotName(s) + ": no active storyline";
   string tg = gSt[st].target > 0 ? " -> " + D2S(gSt[st].target) : " (no fresh level ahead)";
   return SlotName(s) + ": " + DirTxt(gSt[st].dir) + " " + StoryTypeTxt(StoryTypeAt(st, t)) + (gSt[st].cont ? " continuation" : "") + ", " + PartTxt(StoryPart(st, t, price)) + ", since " + TShort(gSt[st].startT) + tg;
  }
int NewestOpenSetup()
  {
   for(int i = ArraySize(gSu) - 1; i >= 0; i--) if(gSu[i].status == 1) return i;
   return -1;
  }
string PlanTxt(int m)
  {
   if(m < 0 || m >= ArraySize(gEn)) return "";
   string t = (gEn[m].dir > 0 ? "BUY" : "SELL") + " " + D2S(gEn[m].entry) + "  SL " + D2S(gEn[m].sl) + " (" + PipTxt(gEn[m].slDist) + ")  TP " + D2S(gEn[m].tp) + "  RR " + DoubleToString(gEn[m].rr, 1);
   return t + "\nTP from " + TargetTxt(gEn[m].tpKind, gEn[m].tpSlot, gEn[m].tpRef) + "; size " + LotsTxt(gEn[m].lots) + " at " + DoubleToString(InpRiskPct, 2) + "% risk (display only)";
  }
string StoryContext(int s, double lvPx)
  {
   datetime now = TimeCurrent();
   double px = NowPx();
   string t = "\n--- Story so far ---";
   for(int q = 0; q < NSLOT; q++) if(gLvlOn[q] || gTLOn[q]) t += "\n" + StoryLine(q, now, px);
   t += "\n" + AlignTxt(now);
   int ra = -1, rb = -1;
   double up = NextFreshLevel(s, 1, px, now, 0.0, ra);
   double dn = NextFreshLevel(s, -1, px, now, 0.0, rb);
   t += "\nNearest fresh " + SlotName(s) + " levels: above " + (ra >= 0 ? D2S(up) + " (" + PipTxt(up - px) + ")" : "none") + ", below " + (rb >= 0 ? D2S(dn) + " (" + PipTxt(px - dn) + ")" : "none");
   int su = NewestOpenSetup();
   if(su >= 0) t += "\nOpen setup: " + SlotName(gSt[gSu[su].st].slot) + " " + SetupName(su) + " at " + D2S(gLad[gSu[su].lad].px) + " since " + TShort(gSu[su].armT);
   int m = ArraySize(gEn) - 1;
   if(m >= 0) t += "\nLast signal " + TShort(gEn[m].t) + ": " + PlanTxt(m);
   return t;
  }
string LevelText(int li, bool full)
  {
   int s = gLv[li].slot, j = gLv[li].j;
   int sd = Sgn(NowPx() - gLv[li].px);
   if(sd == 0) sd = gLv[li].side;
   string t = SlotLong(s) + " " + KindName(gLv[li].kind) + " level (" + RoleTxt(sd) + ") " + D2S(gLv[li].px);
   t += "\nWhy: " + CandleTxt(s, j) + "\n then " + CandleTxt(s, j + 1);
   t += "\nPrice = body junction (" + JuncTxt() + ") = line-chart turn (p17-22)";
   string st;
   if(gLv[li].fresh)
     {
      if(gLv[li].breaks > 0) st = "FRESH again: a body broke through at " + TShort(gLv[li].breakT) + " (p200)";
      else st = "FRESH: no wick has touched it (p23)";
     }
   else
     {
      st = "UNFRESH: wick touched at " + TShort(gLv[li].touchT) + " (p23)";
      if(gLv[li].breaks > 0) st += "; last body break " + TShort(gLv[li].breakT);
     }
   t += "\nState: " + st;
   t += "\nCC: " + (gLv[li].cc ? "yes (candle i+" + IntegerToString(InpCCBar) + " points the level's way)" : "no") + "; uses " + IntegerToString(gLv[li].uses) + " of " + IntegerToString(InpMaxUses) + "; age " + IntegerToString(LvlAgeNow(li)) + " bars (p96, p139)";
   t += "\nMap: " + SlotLong(s) + " level -> watch " + MapTxt(s) + " for an EXTERNAL QM breakout (break of the last " + (sd > 0 ? "A" : "V") + " before the touch, p37-44, p99)";
   t += "\nRejection: " + RejTxt(s);
   if(gLv[li].fresh) t += "\nNext: wait for a wick touch, the rejection, then the breakout. Target = next fresh level beyond.";
   else t += "\nNext: unfresh = not tradable until a body break makes it fresh again.";
   t += "\nInvalid: a " + SlotLong(s) + " body closes through it (it turns fresh again with the role flipped).";
   t += "\nBook: Malaysian SNR p17-25, p93, p96, p99, p139";
   if(full) t += StoryContext(s, gLv[li].px);
   return t;
  }
string TLText(int ti, bool full)
  {
   int s = gTL[ti].slot, d = gTL[ti].dir;
   string t = SlotLong(s) + (d < 0 ? " falling trendline (resistance)" : " rising trendline (support)");
   t += "\nWhy: through 2 " + (d < 0 ? "A" : "V") + " points on closes: " + TShort(gTL[ti].t1) + " " + D2S(gTL[ti].p1) + " and " + TShort(gTL[ti].t2) + " " + D2S(gTL[ti].p2) + " (p28, line chart)";
   t += "\nTouches: " + IntegerToString(gTL[ti].touches) + " of " + IntegerToString(InpTLMaxTouches) + " (anchors count; the 3rd is the strongest, the 4th and 5th need a confirmed breakout, p139)";
   string st = "alive";
   if(gTL[ti].dead == 1) st = "broken by a close at " + TShort(gTL[ti].deadT);
   if(gTL[ti].dead == 2) st = "used up (touch " + IntegerToString(InpTLMaxTouches) + " at " + TShort(gTL[ti].deadT) + ")";
   if(gTL[ti].dead == 3) st = "too old";
   t += "\nState: " + st;
   t += "\nMap: " + SlotLong(s) + " trendline -> breakout on " + MapTxt(s) + "; a QM formed after the touch is valid on trendlines (p74-75, p114)";
   t += "\nNext: at the next touch wait for a " + (d < 0 ? "bearish" : "bullish") + " QM breakout = Advanced storyline (p237-266)";
   t += "\nInvalid: a close beyond the line, or after touch " + IntegerToString(InpTLMaxTouches);
   t += "\nBook: Malaysian SNR p28-30, p74-75, p114-160, p237-266";
   if(full) t += StoryContext(s, TLVal(ti, IMax(0, LastClosed(s))));
   return t;
  }
string LevelDesc(int bi)
  {
   int e = gBO[bi].ev;
   if(e < 0) return "?";
   if(gEv[e].kind == 1) return SlotLong(gEv[e].slot) + " trendline touch #" + IntegerToString(gEv[e].tlNo) + " at " + D2S(gEv[e].px);
   int li = gEv[e].idx;
   return SlotLong(gEv[e].slot) + " " + KindName(gLv[li].kind) + " " + D2S(gLv[li].px) + " (formed " + TShort(gLv[li].t1) + ")";
  }
string BOText(int bi, bool full)
  {
   int d = gBO[bi].dir, ls = gBO[bi].lslot, bs = gBO[bi].bslot;
   int st = gBO[bi].story;
   string t = SlotLong(ls) + " " + DirTxt(d) + " " + (gBO[bi].kind == 0 ? (ls >= 3 ? "Mini Classic" : "Classic") : "Advanced") + " storyline start" + (gBO[bi].early ? " (early breakout, p121)" : "");
   t += "\nAt: " + LevelDesc(bi);
   t += "\nTouch: " + SlotName(bs) + " " + TShort(gBO[bi].tt) + " reached " + D2S(gBO[bi].tpx);
   int e = gBO[bi].ev;
   if(gBO[bi].kind == 0) t += "\n" + Mk(true) + " level fresh before the touch (uses before: " + IntegerToString(e >= 0 ? gEv[e].usesB : 0) + ")";
   else t += "\n" + Mk(true) + " trendline touch #" + IntegerToString(e >= 0 ? gEv[e].tlNo : 0) + (e >= 0 && gEv[e].tlNo == 3 ? " (strongest)" : "");
   if(gBO[bi].rejState == 1) t += "\n" + Mk(true) + " rejection: " + SlotName(gBO[bi].rejSlot) + " closed back at " + TShort(gBO[bi].rejT) + " (p93)";
   else if(gBO[bi].kind == 0 && InpRejGate) t += "\n" + Mk(true) + " rejection: no close needed on " + SlotLong(ls) + " (p93)";
   else if(gBO[bi].kind == 1) t += "\n" + Mk(true) + " Advanced: no rejection step (\"1+2\", p239)";
   else t += "\n" + Mk(false) + " rejection gate off (input)";
   string rn = d > 0 ? "A" : "V";
   if(gBO[bi].refB >= 0)
      t += "\n" + Mk(gBO[bi].external || gBO[bi].kind == 1) + " " + (gBO[bi].external ? "external" : "internal") + ": last " + rn + " " + D2S(gBO[bi].ref) + " of " + TShort(Tm(bs, gBO[bi].refB)) + (gBO[bi].external ? " formed before the touch (p37-44)" : (gBO[bi].kind == 1 ? " after the touch: allowed on trendlines (p74)" : " after the touch: p126 rare case"));
   t += "\n" + Mk(gBO[bi].body >= InpStrongBody) + " strong body close beyond: body " + DoubleToString(gBO[bi].body, 2) + " of range (min " + DoubleToString(InpStrongBody, 2) + "), close " + D2S(gBO[bi].boC);
   if(gBO[bi].lsB >= 0) t += "\n" + Mk(gBO[bi].qm) + " QM: " + (d > 0 ? "L " : "H ") + D2S(gBO[bi].ls) + (gBO[bi].qm ? (d > 0 ? " > LL" : " < HH") : (d > 0 ? " not taken by a lower close" : " not taken by a higher close")) + (gBO[bi].qm ? "" : (st >= 0 ? " -> continuation breakout (p179)" : ""));
   else t += "\n" + Mk(false) + " QM: no left shoulder found";
   t += "\n" + AlignTxt(gBO[bi].sigT);
   t += "\nSignal: " + TStr(gBO[bi].sigT) + " at " + D2S(gBO[bi].sigPx);
   if(st >= 0)
     {
      t += "\nStoryline: " + StoryTypeTxt(gSt[st].type) + (gSt[st].cont ? " continuation" : "") + ", target " + (gSt[st].target > 0 ? TargetTxt(gSt[st].tgtKind, gSt[st].tgtSlot, gSt[st].tgtRef) : "none (no fresh level ahead)");
      if(gSt[st].endT > 0) t += "\nEnded " + TShort(gSt[st].endT) + ": " + (gSt[st].endWhy == 1 ? "target reached" : (gSt[st].endWhy == 2 ? "opposite storyline" : (gSt[st].endWhy == 3 ? "QM failed (close beyond the apex)" : (gSt[st].endWhy == 5 ? "continuation storyline took over" : "followed long enough"))));
      else t += "\nNow: part " + PartTxt(StoryPart(st, TimeCurrent(), NowPx()));
     }
   t += "\nQM levels: " + (d > 0 ? "RBS " : "SBR ") + D2S(gBO[bi].ref) + (gBO[bi].lsB >= 0 ? ", LS " + D2S(gBO[bi].ls) : "") + (gBO[bi].gapB >= 0 ? ", GAP " + D2S(gBO[bi].gap) + (gBO[bi].gapAl ? "" : " (not aligned)") : "") + ", APEX " + D2S(gBO[bi].apex) + (gBO[bi].ersB >= 0 ? ", ERS " + D2S(gBO[bi].ers) : "");
   t += "\nNext: wait for price to come back to a QM level, then a confirmation on " + SlotName(gEntrySlot) + " (EMA engulf first, p413-421)";
   t += "\nInvalid: a close beyond the APEX " + D2S(gBO[bi].apex) + " (QM failed, p405)";
   t += "\nBook: Malaysian SNR p34-44, p72-79, p93, p99, p202-237, p334-337";
   if(full) t += StoryContext(ls, gBO[bi].tpx);
   return t;
  }
string LadText(int li, bool full)
  {
   int st = gLad[li].st, d = gLad[li].dir, bs = gLad[li].bslot;
   string nm = LadName(gLad[li].kind, d);
   string t = SlotLong(gSt[st].slot) + " storyline " + (gLad[li].cont ? "continuation level " : "QM level ") + nm + " " + D2S(gLad[li].px) + " (" + SlotName(bs) + ")";
   string why = "";
   switch(gLad[li].kind)
     {
      case LD_RBS:   why = d > 0 ? "the broken A (resistance becomes support)" : "the broken V (support becomes resistance)"; break;
      case LD_LS:    why = "the left shoulder: the last " + (d > 0 ? "V" : "A") + " before the broken one"; break;
      case LD_GAP:   why = "same-colour candle junction inside the shift"; break;
      case LD_APEX:  why = "the wick extreme of the QM"; break;
      case LD_ERS:   why = "early right shoulder: the last mini " + (d > 0 ? "V" : "A") + " before the breakout (p371, p401)"; break;
      case LD_CRBS:  why = "broken " + (d > 0 ? "A" : "V") + " of continuation breakout #" + IntegerToString(gLad[li].contNo); break;
      case LD_CAPEX: why = "pullback extreme before continuation breakout #" + IntegerToString(gLad[li].contNo); break;
      case LD_CGAP:  why = "gap inside continuation breakout #" + IntegerToString(gLad[li].contNo); break;
     }
   t += "\nWhy: " + why + "; source candle " + CandleTxt(bs, gLad[li].srcB);
   if(gLad[li].kind == LD_GAP || gLad[li].kind == LD_CGAP)
      t += "\n" + Mk(gLad[li].gapAl) + " GAP alignment " + (bs == 3 ? "(1H gap + 1H A/V + 30M A/V, p409)" : (bs == 4 ? "(30M + 15M A/V, p409)" : "(no rule on this TF)"));
   int su = gLad[li].setup;
   if(su >= 0) t += "\nSetup: price came back at " + TShort(gSu[su].armT) + ": " + SuStatusTxt(gSu[su].status);
   else t += "\nSetup: price has not come back yet (within " + IntegerToString(InpSetupMaxBars) + " " + SlotName(bs) + " bars)";
   t += "\nNext: within " + DoubleToString(InpProxPips, 0) + " pips wait for a confirmation on " + SlotName(gEntrySlot) + " / " + SlotName(gRejSlot) + "; SL >= " + PipTxt(gMinStop) + ", TP " + (gLad[li].cont ? (InpContTP == MSNR_CTP_FIXED ? "fixed 1:" + DoubleToString(InpContRR, 1) : "next fresh level") : "next fresh level / trendline");
   t += "\nInvalid: a close beyond " + D2S(gLad[li].inval);
   t += "\nBook: Malaysian SNR p368-372, p396-402" + (gLad[li].cont ? ", p489-550" : "");
   if(full) t += StoryContext(gSt[st].slot, gLad[li].px);
   return t;
  }
string ConfChecklist(int su)
  {
   int li = gSu[su].lad;
   int m = gSu[su].ent;
   int fired = m >= 0 ? gEn[m].conf : 0;
   string t = "";
   if(InpConfEMA) t += "\n" + Mk(fired == CF_EMA) + " " + SlotName(gEntrySlot) + " EMA(" + IntegerToString(InpEmaLen) + ") engulfing break (main)";
   if(InpConfRej) t += "\n" + Mk(fired == CF_REJ) + " " + SlotName(gRejSlot) + " candle rejection (" + (InpRejOppColour ? (gLad[li].dir > 0 ? "bearish candle, " : "bullish candle, ") : "") + "wick through, close back)";
   if(InpConfTL) t += "\n" + Mk(fired == CF_TL) + " " + SlotName(gEntrySlot) + " micro trendline break";
   if(InpConfGap) t += "\n" + Mk(fired == CF_GAP) + " " + SlotName(gEntrySlot) + " breaking gap + pullback";
   if(InpConfQM) t += "\n" + Mk(fired == CF_QM) + " " + SlotName(gQMSlot) + " mini QM + pullback to its LS";
   return t;
  }
string SetupText(int su, bool full)
  {
   int li = gSu[su].lad, st = gSu[su].st, d = gLad[li].dir;
   string t = SlotLong(gSt[st].slot) + " " + DirTxt(d) + " setup: " + SetupName(su) + " at " + D2S(gLad[li].px);
   t += "\n" + Mk(true) + " storyline " + StoryTypeTxt(gSt[st].type) + " started " + TShort(gSt[st].startT);
   t += "\n" + Mk(true) + " price back at the level " + TShort(gSu[su].armT) + " (within " + DoubleToString(InpProxPips, 0) + " pips)";
   string f = SetupFlags(su, false);
   if(f != "") t += "\n" + Mk(true) + " pattern: " + f + (gSt[st].dblApex ? " (two equal extremes)" : "") + (gSt[st].qmcc ? " (single spike apex)" : "") + (gSu[su].qmc ? " (trendline through the LS)" : "");
   t += "\nStatus: " + SuStatusTxt(gSu[su].status);
   t += ConfChecklist(su);
   if(gSu[su].ent >= 0) t += "\nPlan: " + PlanTxt(gSu[su].ent);
   t += "\nBook: Malaysian SNR p374-412, p413-434";
   if(full) t += StoryContext(gSt[st].slot, gLad[li].px);
   return t;
  }
string EntText(int m, bool full)
  {
   int su = gEn[m].setup, st = gEn[m].st, li = gSu[su].lad, d = gEn[m].dir;
   string t = (d > 0 ? "BUY" : "SELL") + " signal: " + ConfName(gEn[m].conf) + " on " + SlotName(gEn[m].cslot) + " at " + TStr(gEn[m].t);
   t += "\n" + Mk(true) + " " + SlotLong(gSt[st].slot) + " " + DirTxt(d) + " " + StoryTypeTxt(gSt[st].type) + " storyline (since " + TShort(gSt[st].startT) + ")";
   t += "\n" + Mk(true) + " setup " + SetupName(su) + " " + D2S(gLad[li].px) + " reached " + TShort(gSu[su].armT);
   t += "\n" + Mk(true) + " confirmation within " + DoubleToString(InpProxPips, 0) + " pips of the level (proximity, p432)";
   int ad = 0; bool lead = false;
   bool al = AlignedAt(gEn[m].t, ad, lead);
   int hs = gSt[st].slot > 0 ? StoryAt(gSt[st].slot - 1, gEn[m].t) : -1;
   bool htfOk = (gSt[st].slot == 0) || (hs >= 0 && gSt[hs].dir == d);
   t += "\n" + Mk(htfOk) + " higher TF storyline " + (gSt[st].slot == 0 ? "(monthly = top)" : (hs >= 0 ? DirTxt(gSt[hs].dir) : "none"));
   t += "\n" + Mk(al && ad == d) + " D / W / M aligned " + (al ? DirTxt(ad) : "no") + (lead ? " (D led)" : "");
   t += ConfChecklist(su);
   t += "\nEntry " + D2S(gEn[m].entry) + (gEn[m].conf == CF_GAP || gEn[m].conf == CF_QM ? " (limit on the pullback)" : " (at the close)");
   t += "\nSL " + D2S(gEn[m].sl) + " = max(" + PipTxt(gMinStop) + " min, beyond the confirmation extreme " + D2S(gEn[m].extreme) + " + " + PipTxt(gBuf) + ") (p435)";
   t += "\nTP " + D2S(gEn[m].tp) + " from " + TargetTxt(gEn[m].tpKind, gEn[m].tpSlot, gEn[m].tpRef) + (gLad[li].cont ? " (continuation, p549)" : " (p436-437)") + "; RR " + DoubleToString(gEn[m].rr, 2);
   t += "\nSize: " + LotsTxt(gEn[m].lots) + " for " + DoubleToString(InpRiskPct, 2) + "% (tick value formula; the book's own lot examples are wrong)";
   t += "\nInvalid: price closes beyond the SL zone before entry; never trades (display only)";
   t += "\nBook: Malaysian SNR p413-441, p547-550, p611-617";
   if(full) t += StoryContext(gSt[st].slot, gLad[li].px);
   return t;
  }

//+------------------------------------------------------------------+
//| Drawing                                                          |
//+------------------------------------------------------------------+
datetime gTNow = 0, gTLbl = 0;
int      gPs = 60;
void DrawLevels()
  {
   if(!InpShowLevels) return;
   double px = NowPx();
   for(int s = 0; s < NSLOT; s++)
     {
      if(!gLvlOn[s] || !S[s].ready) continue;
      int a = gLv0[s], z = gLv0[s] + gLvN[s];
      for(int side = 1; side >= -1; side -= 2)
        {
         double chosen[];
         int nc = 0;
         for(int pass = 0; pass < IMax(0, InpMaxLevelsPerTF); pass++)
           {
            int best = -1;
            double bd = 0.0;
            for(int li = a; li < z; li++)
              {
               if(!gLv[li].fresh && !InpShowUnfresh) continue;
               if(LvlAgeNow(li) > InpLevelMaxAge) continue;
               double dd = (gLv[li].px - px) * side;
               if(dd <= 0.0) continue;
               if(best >= 0 && dd >= bd) continue;
               bool skip = false;
               for(int c = 0; c < nc; c++) if(MathAbs(chosen[c] - gLv[li].px) <= gMergeTol) { skip = true; break; }
               if(skip) continue;
               best = li; bd = dd;
              }
            if(best < 0) break;
            ArrayResize(chosen, nc + 1);
            chosen[nc] = gLv[best].px; nc++;
            string tip = Tip(LevelText(best, false));
            string base = "L";
            string n1 = Nm(base, s, (long)gLv[best].t1, gLv[best].kind, "l");
            string n2 = Nm(base, s, (long)gLv[best].t1, gLv[best].kind, "t");
            color c = SlotColor(s);
            ObjTrend(n1, gLv[best].t1, gLv[best].px, gTNow, gLv[best].px, c, gLv[best].fresh ? STYLE_SOLID : STYLE_DOT, SlotWidth(s), true, tip);
            string lab = SlotShort(s) + " " + KindShort(gLv[best].kind) + "-" + (gLv[best].fresh ? "fresh" : "unfresh") + (gLv[best].cc ? " CC" : "");
            ObjText(n2, gTLbl, gLv[best].px, lab, c, 7, ANCHOR_LEFT_LOWER, tip);
           }
        }
     }
  }
void DrawTLs()
  {
   for(int s = 0; s < NSLOT; s++)
     {
      if(!gTLOn[s] || !S[s].ready) continue;
      int last = LastClosed(s);
      for(int d = -1; d <= 1; d += 2)
        {
         int shown = 0;
         for(int ti = ArraySize(gTL) - 1; ti >= 0 && shown < InpTLShow; ti--)
           {
            if(gTL[ti].slot != s || gTL[ti].dir != d || gTL[ti].dead != 0) continue;
            string tip = Tip(TLText(ti, false));
            string n1 = Nm("T", s, (long)gTL[ti].t1, d + 1, "l");
            string n2 = Nm("T", s, (long)gTL[ti].t1, d + 1, "t");
            double v = TLVal(ti, last + 1);
            ObjTrend(n1, gTL[ti].t1, gTL[ti].p1, gTNow, v, SlotColor(s), STYLE_DASH, 1, false, tip);
            ObjText(n2, gTNow, v, SlotShort(s) + " TL " + (d < 0 ? "dn " : "up ") + IntegerToString(gTL[ti].touches) + "/" + IntegerToString(InpTLMaxTouches), SlotColor(s), 7, ANCHOR_LEFT_UPPER, tip);
            shown++;
           }
        }
     }
  }
void DrawStories()
  {
   if(!InpShowStoryMarks) return;
   int shown = 0;
   for(int st = ArraySize(gSt) - 1; st >= 0 && shown < InpMaxMarks; st--)
     {
      int bi = gSt[st].bo;
      int bs = gBO[bi].bslot, d = gBO[bi].dir, s = gBO[bi].lslot;
      if(gBO[bi].boB < 0 || gBO[bi].boB >= S[bs].n) continue;
      string tip = Tip(BOText(bi, false));
      long key = (long)gBO[bi].sigT;
      datetime tb = Tm(bs, gBO[bi].boB);
      double ap = d > 0 ? Lo(bs, gBO[bi].boB) : Hi(bs, gBO[bi].boB);
      color c = d > 0 ? InpColBull : InpColBear;
      ObjArrow(Nm("B", s, key, d + 1, "a"), tb, ap, d > 0 ? 233 : 234, c, d > 0, 2, tip);
      string lab = SlotShort(s) + " " + StoryTypeTxt(gSt[st].type) + (gSt[st].cont ? " cont" : "") + " " + Arrow(d);
      ObjText(Nm("B", s, key, d + 1, "t"), tb, ap, lab, c, 7, d > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER, tip);
      if(gBO[bi].refB >= 0)
         ObjTrend(Nm("B", s, key, d + 1, "r"), Tm(bs, gBO[bi].refB), gBO[bi].ref, tb, gBO[bi].ref, c, STYLE_DOT, 1, false, tip);
      if(gBO[bi].tb >= 0)
         ObjArrow(Nm("B", s, key, d + 1, "x"), Tm(bs, gBO[bi].tb), gBO[bi].tpx, 159, SlotColor(s), d > 0, 1, tip);
      shown++;
     }
  }
void DrawLadders()
  {
   if(!InpShowLadder) return;
   for(int st = 0; st < ArraySize(gSt); st++)
     {
      if(gSt[st].endT != 0) continue;
      for(int li = gSt[st].lad0; li < gSt[st].lad0 + gSt[st].ladN; li++)
        {
         int bs = gLad[li].bslot;
         if(gLad[li].srcB < 0 || gLad[li].srcB >= S[bs].n) continue;
         if(gLad[li].setup >= 0 && gSu[gLad[li].setup].status >= 3) continue;      // failed / expired levels are not drawn
         string tip = Tip(LadText(li, false));
         int sub = gLad[li].kind * 10 + gLad[li].contNo;
         long key = (long)gSt[st].startT;
         color c = gLad[li].dir > 0 ? InpColBull : InpColBear;
         bool weak = ((gLad[li].kind == LD_GAP || gLad[li].kind == LD_CGAP) && !gLad[li].gapAl);
         ObjTrend(Nm("Q", gSt[st].slot, key, sub, "l"), Tm(bs, gLad[li].srcB), gLad[li].px, gTNow, gLad[li].px, c, weak ? STYLE_DOT : STYLE_DASHDOT, 1, false, tip);
         ObjText(Nm("Q", gSt[st].slot, key, sub, "t"), gTNow, gLad[li].px, SlotShort(gSt[st].slot) + " " + LadName(gLad[li].kind, gLad[li].dir), c, 7, ANCHOR_LEFT, tip);
        }
     }
  }
void DrawSetups()
  {
   int shown = 0;
   for(int su = ArraySize(gSu) - 1; su >= 0 && shown < InpMaxMarks; su--)
     {
      int li = gSu[su].lad;
      string tip = Tip(SetupText(su, false));
      int sub = gLad[li].kind * 10 + gLad[li].contNo;
      color c = gLad[li].dir > 0 ? InpColBull : InpColBear;
      string lab = "o " + LadName(gLad[li].kind, gLad[li].dir) + (gSu[su].status == 1 ? " armed" : "");
      ObjText(Nm("S", gSt[gSu[su].st].slot, (long)gSu[su].armT, sub, "t"), gSu[su].armT, gLad[li].px, lab, c, 7, gLad[li].dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER, tip);
      shown++;
     }
  }
void DrawEntries()
  {
   int shown = 0;
   int n = ArraySize(gEn);
   for(int m = n - 1; m >= 0 && shown < InpMaxMarks; m--)
     {
      int d = gEn[m].dir, cs = gEn[m].cslot;
      if(gEn[m].bar < 0 || gEn[m].bar >= S[cs].n) continue;
      string tip = Tip(EntText(m, false));
      int s = gSt[gEn[m].st].slot;
      long key = (long)gEn[m].t;
      datetime tb = Tm(cs, gEn[m].bar);
      color c = d > 0 ? InpColBull : InpColBear;
      double ap = d > 0 ? Lo(cs, gEn[m].bar) : Hi(cs, gEn[m].bar);
      ObjArrow(Nm("E", s, key, gEn[m].conf, "a"), tb, ap, d > 0 ? 241 : 242, c, d > 0, 2, tip);
      ObjText(Nm("E", s, key, gEn[m].conf, "t"), tb, ap, (d > 0 ? "BUY " : "SELL ") + ConfCsv(gEn[m].conf), c, 7, d > 0 ? ANCHOR_RIGHT_UPPER : ANCHOR_RIGHT_LOWER, tip);
      if(m == n - 1 && InpShowPlan)
        {
         datetime t2 = AddSec(tb, (long)30 * gPs);
         ObjTrend(Nm("X", s, key, gEn[m].conf, "e"), tb, gEn[m].entry, t2, gEn[m].entry, cTxt, STYLE_SOLID, 1, false, tip);
         ObjTrend(Nm("X", s, key, gEn[m].conf, "s"), tb, gEn[m].sl, t2, gEn[m].sl, InpColBear, STYLE_DASH, 1, false, tip);
         ObjTrend(Nm("X", s, key, gEn[m].conf, "p"), tb, gEn[m].tp, t2, gEn[m].tp, InpColBull, STYLE_DASH, 1, false, tip);
         ObjText(Nm("X", s, key, gEn[m].conf, "1"), t2, gEn[m].sl, "SL " + D2S(gEn[m].sl) + " (" + PipTxt(gEn[m].slDist) + ")", InpColBear, 7, ANCHOR_LEFT, tip);
         ObjText(Nm("X", s, key, gEn[m].conf, "2"), t2, gEn[m].tp, "TP " + D2S(gEn[m].tp) + " RR " + DoubleToString(gEn[m].rr, 1), InpColBull, 7, ANCHOR_LEFT, tip);
         ObjText(Nm("X", s, key, gEn[m].conf, "3"), t2, gEn[m].entry, "Entry " + D2S(gEn[m].entry) + " " + LotsTxt(gEn[m].lots), cTxt, 7, ANCHOR_LEFT, tip);
        }
      shown++;
     }
  }
void DrawLineChart()
  {
   if(!InpShowLineChart) return;
   MqlRates rr[];
   ArraySetAsSeries(rr, false);
   int want = IMax(10, InpLineChartBars) + 1;
   int got = CopyRates(_Symbol, PERIOD_CURRENT, 0, want, rr);
   if(got < 3) return;
   string tip = "Line chart (closes) of this TF: SNR levels sit at its turning points (p20-22)";
   for(int i = 1; i < got; i++)
      ObjTrend(Nm("C", 0, (long)rr[i].time, 0, "l"), rr[i - 1].time, rr[i - 1].close, rr[i].time, rr[i].close, clrSteelBlue, STYLE_SOLID, 1, false, tip);
  }

//+------------------------------------------------------------------+
//| Panel (top-right, no background, foldable)                       |
//+------------------------------------------------------------------+
int gPanelRows = 0;
void PRow(int &y, int &k, string txt, color c, string tip)
  {
   string t = txt;
   if(StringLen(t) > 63) t = StringSubstr(t, 0, 62) + "~";
   Lbl(PFX_PANEL + "r" + IntegerToString(k), InpPanelX, y, t, c, InpFontSize, InpCardFont, CORNER_RIGHT_UPPER, ANCHOR_RIGHT_UPPER, tip == "" ? "" : Tip(tip));
   y += InpFontSize + 7;
   k++;
  }
string ManualHint(int i)
  {
   switch(i)
     {
      case 0: return "MISS: SBR where a falling TL from the apex meets it";
      case 1: return "Double TL-SBR: two trendlines meet at the SBR";
      case 2: return "SNRC1: small candle at the SBR (not Bystra's)";
      case 3: return "SNRC2: 3 candles form it, enter on the 4th (p486)";
      case 4: return "Reversal TL QM Failed: QM fails at TL, enter LS";
      case 5: return "QM Failed QM: QM without fresh level / TL (p406)";
      case 6: return "Dual-side rejection: follow the HTF side (p392)";
      case 7: return "Refinement: long-wick apex -> LTF fresh level";
      case 8: return "Stacked entries: rejections 15M>30M>1H>4H (p423)";
     }
   return "";
  }
string StoryShort(int s, datetime t, double px)
  {
   int st = StoryAt(s, t);
   if(st < 0) return SlotName(s) + ": no storyline";
   int ty = StoryTypeAt(st, t);
   string tys = ty == 3 ? "C+A" : (ty == 2 ? "Adv" : "Cls");
   return SlotName(s) + ": " + DirShort(gSt[st].dir) + " " + tys + (gSt[st].cont ? " cont" : "") + " " + PartTxt(StoryPart(st, t, px)) + (gSt[st].target > 0 ? " > " + D2S(gSt[st].target) : "") + " " + TShort(gSt[st].startT);
  }
void DrawPanel()
  {
   if(!InpShowPanel) { ObjectsDeleteAll(0, PFX_PANEL); gPanelRows = 0; return; }
   int y = InpPanelY, k = 0;
   string hdr = "Malaysian SNR 1.00  " + _Symbol + "  [" + (gPanelOpen ? "-" : "+") + "]";
   Lbl(PFX_PANEL + "h", InpPanelX, y, hdr, cHead, InpFontSize + 1, "Arial Bold", CORNER_RIGHT_UPPER, ANCHOR_RIGHT_UPPER, "Click to fold / unfold the panel. Hover or click any MSNR object on the chart for its explanation.");
   y += InpFontSize + 9;
   if(gPanelOpen)
     {
      datetime now = TimeCurrent();
      double px = NowPx();
      if(gDataMsg != "") PRow(y, k, "Data: " + gDataMsg, cTxt, "Other timeframes are still loading; the engine waits (or runs with what it has after 20 tries).");
      if(!gComputed) PRow(y, k, "Waiting for history ...", cTxt, "");
      else
        {
         for(int s = 0; s < NSLOT; s++)
           {
            if(!gLvlOn[s] && !gTLOn[s]) continue;
            int st = StoryAt(s, now);
            color c = st < 0 ? cTxt : (gSt[st].dir > 0 ? InpColBull : InpColBear);
            PRow(y, k, StoryShort(s, now, px), c, StoryLine(s, now, px) + "\nStoryline = fresh level / trendline + breakout on " + MapTxt(s) + " (p202-372)");
           }
         string al = AlignTxt(now);
         PRow(y, k, "Align " + al, cTxt, "MTF alignment: the daily storyline leads the weekly, which leads the monthly (p313-323). Mixed = wait (p305).");
         for(int s = 0; s <= 4; s++)
           {
            if(!gLvlOn[s] || !S[s].ready) continue;
            int ra = -1, rb = -1;
            double up = NextFreshLevel(s, 1, px, now, 0.0, ra);
            double dn = NextFreshLevel(s, -1, px, now, 0.0, rb);
            string t = "Fresh " + SlotName(s) + ": ^ " + (ra >= 0 ? D2S(up) + " (" + PipTxt(up - px) + ")" : "-") + "  v " + (rb >= 0 ? D2S(dn) + " (" + PipTxt(px - dn) + ")" : "-");
            string tip = "Nearest fresh " + SlotLong(s) + " levels above and below price";
            if(ra >= 0) tip += "\nAbove: " + KindName(gLv[ra].kind) + " formed " + TShort(gLv[ra].t1);
            if(rb >= 0) tip += "\nBelow: " + KindName(gLv[rb].kind) + " formed " + TShort(gLv[rb].t1);
            PRow(y, k, t, SlotColor(s), tip);
           }
         // pending breakouts (what to watch next)
         int shown = 0;
         for(int bi = ArraySize(gBO) - 1; bi >= 0 && shown < 3; bi--)
           {
            if(gBO[bi].status != ST_WAIT_BO && gBO[bi].status != ST_WAIT_REJ) continue;
            if(gBO[bi].tb < 0) continue;
            int d = gBO[bi].dir;
            string w;
            if(gBO[bi].status == ST_WAIT_REJ) w = "wait " + SlotName(gBO[bi].rejSlot) + " close " + (d > 0 ? "> " : "< ") + D2S(gBO[bi].tpx);
            else if(gBO[bi].kind == 0) { int jr = d > 0 ? S[gBO[bi].bslot].pA[IMax(0, gBO[bi].tb - 1)] : S[gBO[bi].bslot].pV[IMax(0, gBO[bi].tb - 1)]; double rp = jr >= 0 ? (d > 0 ? S[gBO[bi].bslot].aP[jr] : S[gBO[bi].bslot].vP[jr]) : 0.0; w = SlotName(gBO[bi].bslot) + " close " + (d > 0 ? "> " : "< ") + D2S(rp) + " (ext " + (d > 0 ? "A)" : "V)"); }
            else w = SlotName(gBO[bi].bslot) + " QM breakout " + (d > 0 ? "up" : "down");
            string lv = SlotShort(gBO[bi].lslot) + (gBO[bi].kind == 0 ? " " + KindShort(gLv[gEv[gBO[bi].ev].idx].kind) : " TL") + " " + D2S(gBO[bi].tpx);
            PRow(y, k, "Watch " + lv + ": " + w, d > 0 ? InpColBull : InpColBear, "Touched " + TShort(gBO[bi].tt) + ". " + StatusTxt(gBO[bi].status) + ".\nOn SNR levels only an EXTERNAL breakout counts (last A/V before the touch, p37-44).");
            shown++;
           }
         shown = 0;
         for(int su = ArraySize(gSu) - 1; su >= 0 && shown < 3; su--)
           {
            if(gSu[su].status != 1) continue;
            int li = gSu[su].lad;
            PRow(y, k, "Setup " + SlotShort(gSt[gSu[su].st].slot) + " " + SetupName(su) + " " + D2S(gLad[li].px) + " armed " + TShort(gSu[su].armT), gLad[li].dir > 0 ? InpColBull : InpColBear, SetupText(su, false));
            shown++;
           }
         int m = ArraySize(gEn) - 1;
         if(m >= 0)
           {
            color c = gEn[m].dir > 0 ? InpColBull : InpColBear;
            PRow(y, k, "Last " + (gEn[m].dir > 0 ? "BUY " : "SELL ") + ConfCsv(gEn[m].conf) + " " + TShort(gEn[m].t) + " @" + D2S(gEn[m].entry) + " RR " + DoubleToString(gEn[m].rr, 1), c, EntText(m, false));
            PRow(y, k, "SL " + D2S(gEn[m].sl) + "  TP " + D2S(gEn[m].tp) + "  " + LotsTxt(gEn[m].lots), c, PlanTxt(m));
           }
         else PRow(y, k, "No entry signal yet", cTxt, "");
        }
      PRow(y, k, "Manual setups [" + (gManOpen ? "-" : "+") + "]", cHead, "Setups the book defines only by drawings: shown as hints, not detected (click to fold).");
      if(gManOpen) for(int i = 0; i < 9; i++) PRow(y, k, ManualHint(i), cTxt, "Manual check (discretionary in the book, p381-412)");
      if(gRsMsg != "") PRow(y, k, gRsMsg, cHead, gRsMsg);
     }
   for(int i = k; i < gPanelRows; i++) ObjectDelete(0, PFX_PANEL + "r" + IntegerToString(i));
   gPanelRows = k;
  }

//+------------------------------------------------------------------+
//| Click card + source-candle highlight                             |
//+------------------------------------------------------------------+
int FindStoryByBO(int s, long key, int d)
  {
   for(int st = 0; st < ArraySize(gSt); st++)
      if(gSt[st].slot == s && (long)gBO[gSt[st].bo].sigT == key && gSt[st].dir == d) return st;
   return -1;
  }
int FindLad(int s, long key, int sub)
  {
   for(int st = 0; st < ArraySize(gSt); st++)
     {
      if(gSt[st].slot != s || (long)gSt[st].startT != key) continue;
      for(int li = gSt[st].lad0; li < gSt[st].lad0 + gSt[st].ladN; li++) if(gLad[li].kind * 10 + gLad[li].contNo == sub) return li;
     }
   return -1;
  }
int FindSetup(int s, long key, int sub)
  {
   for(int su = 0; su < ArraySize(gSu); su++)
     {
      int li = gSu[su].lad;
      if(gSt[gSu[su].st].slot == s && (long)gSu[su].armT == key && gLad[li].kind * 10 + gLad[li].contNo == sub) return su;
     }
   return -1;
  }
int FindEnt(int s, long key, int conf)
  {
   for(int m = 0; m < ArraySize(gEn); m++) if(gSt[gEn[m].st].slot == s && (long)gEn[m].t == key && gEn[m].conf == conf) return m;
   return -1;
  }
void HlRect(int k, datetime t1, datetime t2, double p1, double p2)
  {
   string nm = PFX_HL + IntegerToString(k);
   if(ObjectFind(0, nm) >= 0) ObjectDelete(0, nm);
   if(!ObjectCreate(0, nm, OBJ_RECTANGLE, 0, t1, p1, t2, p2)) return;
   ObjectSetInteger(0, nm, OBJPROP_COLOR, clrGold);
   ObjectSetInteger(0, nm, OBJPROP_WIDTH, 2);
   ObjectSetInteger(0, nm, OBJPROP_FILL, false);
   ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, "Source candles of the clicked object");
  }
void HlBars(int k, int s, int a, int b)
  {
   if(a < 0 || b < 0 || a >= S[s].n || b >= S[s].n) return;
   if(b < a) { int x = a; a = b; b = x; }
   double hi = Hi(s, a), lo = Lo(s, a);
   for(int i = a; i <= b; i++) { hi = MathMax(hi, Hi(s, i)); lo = MathMin(lo, Lo(s, i)); }
   HlRect(k, Tm(s, a), BarEnd(s, b), hi, lo);
  }
// identity is encoded in the object name: MSNR_D<kind>_<slot>_<key>_<sub>_<piece>
string CardText(string obj, bool hl)
  {
   string parts[];
   int np = StringSplit(obj, (ushort)'_', parts);
   if(np < 6) return "";
   string kc = StringSubstr(parts[1], 1);
   int s = (int)StringToInteger(parts[2]);
   long key = StringToInteger(parts[3]);
   int sub = (int)StringToInteger(parts[4]);
   if(s < 0 || s >= NSLOT) return "";
   if(hl) ObjectsDeleteAll(0, PFX_HL);
   if(kc == "L")
     {
      int li = FindLevel(s, (datetime)key, sub);
      if(li < 0) return "";
      if(hl) HlBars(0, s, gLv[li].j, gLv[li].j + 1);
      return LevelText(li, true);
     }
   if(kc == "T")
     {
      int ti = FindTL(s, (datetime)key, sub - 1);
      if(ti < 0) return "";
      if(hl) { HlBars(0, s, gTL[ti].b1, gTL[ti].b1); HlBars(1, s, gTL[ti].b2, gTL[ti].b2); }
      return TLText(ti, true);
     }
   if(kc == "B")
     {
      int st = FindStoryByBO(s, key, sub - 1);
      if(st < 0) return "";
      int bi = gSt[st].bo;
      if(hl) { int bs = gBO[bi].bslot; HlBars(0, bs, gBO[bi].tb, gBO[bi].tb); HlBars(1, bs, gBO[bi].refB, gBO[bi].refB); HlBars(2, bs, gBO[bi].boB, gBO[bi].sigB); }
      return BOText(bi, true);
     }
   if(kc == "Q")
     {
      int li = FindLad(s, key, sub);
      if(li < 0) return "";
      if(hl) HlBars(0, gLad[li].bslot, gLad[li].srcB, gLad[li].srcB);
      return LadText(li, true);
     }
   if(kc == "S")
     {
      int su = FindSetup(s, key, sub);
      if(su < 0) return "";
      if(hl) HlBars(0, gEntrySlot, gSu[su].armB, gSu[su].armB);
      return SetupText(su, true);
     }
   if(kc == "E" || kc == "X")
     {
      int m = FindEnt(s, key, sub);
      if(m < 0) return "";
      if(hl) HlBars(0, gEn[m].cslot, gEn[m].bar, gEn[m].bar);
      return EntText(m, true);
     }
   if(kc == "C") return "Line chart (closes) of this TF.\nSNR levels sit at its turning points: A = peak, V = trough, Gap = a step in one direction (p20-22).";
   return "";
  }
void WrapRows(string txt, int maxc)
  {
   ArrayResize(gCardRows, 0);
   string ln[];
   int n = StringSplit(txt, (ushort)'\n', ln);
   for(int i = 0; i < n; i++)
     {
      string rest = ln[i];
      bool firstPiece = true;
      while(true)
        {
         string piece = rest;
         if(StringLen(rest) > maxc)
           {
            int cut = -1;
            for(int c = maxc; c > maxc / 2; c--) if(StringGetCharacter(rest, c) == ' ') { cut = c; break; }
            if(cut < 0) cut = maxc;
            piece = StringSubstr(rest, 0, cut);
            rest = StringSubstr(rest, cut);
            StringTrimLeft(rest);
           }
         else rest = "";
         int k = ArraySize(gCardRows);
         ArrayResize(gCardRows, k + 1, 64);
         gCardRows[k] = firstPiece ? piece : "   " + piece;
         firstPiece = false;
         if(rest == "") break;
        }
     }
  }
void HideCard()
  {
   ObjectsDeleteAll(0, PFX_CARD);
   ObjectsDeleteAll(0, PFX_HL);
   gCardObj = ""; gCardW = 0; gCardH = 0; gHlAt = 0;
  }
void RenderCard(string txt)
  {
   ObjectsDeleteAll(0, PFX_CARD);
   int lh = InpFontSize + 7;
   int w = IMax(260, InpCardWidth);
   int maxc = IMin(63, IMax(30, (int)((w - 20) / (IMax(6, InpFontSize) * 0.78))));
   WrapRows(txt, maxc);
   int ch = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS);
   int maxRows = IMax(5, (ch - 50) / lh);
   int n = ArraySize(gCardRows);
   bool cutRows = n > maxRows;
   if(cutRows) n = maxRows;
   int x = 8, y = 22;
   int h = n * lh + 14;
   Box(PFX_CARD + "bg", x, y, w, h, cCardBg, cCardBorder);
   for(int i = 0; i < n; i++)
     {
      string r = gCardRows[i];
      if(cutRows && i == n - 1) r = "... (more rows: make the chart taller)";
      color c = cCardFg;
      if(i == 0) c = cHead;
      else if(StringFind(r, Mk(true)) == 0) c = InpColBull;
      else if(StringFind(r, Mk(false)) == 0) c = InpColBear;
      else if(StringFind(r, "---") == 0) c = cHead;
      Lbl(PFX_CARD + "r" + IntegerToString(i), x + 8, y + 6 + i * lh, r, c, InpFontSize, InpCardFont, CORNER_LEFT_UPPER, ANCHOR_LEFT_UPPER, "");
     }
   Lbl(PFX_CARD + "x", x + w - 26, y + 4, "[x]", cHead, InpFontSize + 1, "Arial Bold", CORNER_LEFT_UPPER, ANCHOR_LEFT_UPPER, "Close");
   gCardX = x; gCardY = y; gCardW = w; gCardH = h;
  }
void ShowCard(string obj)
  {
   string txt = CardText(obj, true);
   if(txt == "") { HideCard(); return; }
   gCardObj = obj;
   gCardAt = GetTickCount();
   gHlAt = GetTickCount();
   RenderCard(txt);
   ChartRedraw();
  }
bool Inside(int x, int y, int bx, int by, int bw, int bh) { return bw > 0 && bh > 0 && x >= bx && x <= bx + bw && y >= by && y <= by + bh; }

//+------------------------------------------------------------------+
//| Alerts: once per signal, never on load                           |
//+------------------------------------------------------------------+
bool IsSeen(string key) { for(int i = ArraySize(gSeen) - 1; i >= 0; i--) if(gSeen[i] == key) return true; return false; }
void MarkSeen(string key)
  {
   int n = ArraySize(gSeen);
   if(n > 4000)
     {
      for(int i = 0; i < 2000; i++) gSeen[i] = gSeen[n - 2000 + i];
      n = 2000;
     }
   ArrayResize(gSeen, n + 1, 512);
   gSeen[n] = key;
  }
void Notify(string msg)
  {
   gLastAlert = msg;
   if(InpAlertPopup) Alert(msg); else Print(msg);
   if(InpAlertPush) SendNotification(StringLen(msg) > 250 ? StringSubstr(msg, 0, 250) : msg);
   if(InpAlertSound) PlaySound(InpSoundFile);
  }
void DoAlerts()
  {
   datetime now = TimeCurrent();
   for(int st = 0; st < ArraySize(gSt); st++)
     {
      string key = "S" + IntegerToString(gSt[st].slot) + "_" + IntegerToString((long)gSt[st].startT) + "_" + IntegerToString(gSt[st].dir);
      if(IsSeen(key)) continue;
      MarkSeen(key);
      if(!gAlertArmed || !InpAlertStory) continue;
      if(gSt[st].slot >= 3 && !InpAlertMini) continue;
      if((long)(now - gSt[st].startT) > 3L * PeriodSeconds(S[gSt[st].bslot].tf)) continue;
      int bi = gSt[st].bo;
      Notify("MSNR " + _Symbol + ": " + SlotLong(gSt[st].slot) + " " + DirTxt(gSt[st].dir) + " " + StoryTypeTxt(gSt[st].type) + (gSt[st].cont ? " continuation" : "") + " storyline started (" + SlotName(gSt[st].bslot) + " " + (gBO[bi].external ? "external" : "internal") + " QM breakout @" + D2S(gBO[bi].sigPx) + ")");
     }
   for(int su = 0; su < ArraySize(gSu); su++)
     {
      int li = gSu[su].lad;
      string key = "U" + IntegerToString(gSt[gSu[su].st].slot) + "_" + IntegerToString((long)gSu[su].armT) + "_" + IntegerToString(gLad[li].kind * 10 + gLad[li].contNo);
      if(IsSeen(key)) continue;
      MarkSeen(key);
      if(!gAlertArmed || !InpAlertSetup) continue;
      if(gSt[gSu[su].st].slot >= 3 && !InpAlertMini) continue;
      if((long)(now - gSu[su].armT) > 3L * PeriodSeconds(S[gEntrySlot].tf)) continue;
      Notify("MSNR " + _Symbol + ": price at " + SlotName(gSt[gSu[su].st].slot) + " " + SetupName(su) + " " + D2S(gLad[li].px) + " - wait for a confirmation");
     }
   for(int m = 0; m < ArraySize(gEn); m++)
     {
      string key = "E" + IntegerToString(gSt[gEn[m].st].slot) + "_" + IntegerToString((long)gEn[m].t) + "_" + IntegerToString(gEn[m].conf);
      if(IsSeen(key)) continue;
      MarkSeen(key);
      if(!gAlertArmed || !InpAlertEntry) continue;
      if(gSt[gEn[m].st].slot >= 3 && !InpAlertMini) continue;
      if((long)(now - gEn[m].t) > 3L * PeriodSeconds(S[gEn[m].cslot].tf)) continue;
      Notify("MSNR " + _Symbol + " " + (gEn[m].dir > 0 ? "BUY" : "SELL") + " (" + SlotName(gSt[gEn[m].st].slot) + " storyline, " + SetupName(gEn[m].setup) + ", " + ConfName(gEn[m].conf) + ") entry " + D2S(gEn[m].entry) + " SL " + D2S(gEn[m].sl) + " TP " + D2S(gEn[m].tp) + " RR " + DoubleToString(gEn[m].rr, 1) + " " + LotsTxt(gEn[m].lots));
     }
   gAlertArmed = true;
  }

//+------------------------------------------------------------------+
//| Research CSV (no look-ahead snapshot + forward outcome)          |
//+------------------------------------------------------------------+
string RsSym() { string u = _Symbol; StringReplace(u, "/", "_"); StringReplace(u, "\\", "_"); StringReplace(u, ":", "_"); StringReplace(u, "*", "_"); StringReplace(u, "?", "_"); return u; }
string RsDay(datetime t) { MqlDateTime md; TimeToStruct(t, md); return StringFormat("%04d%02d%02d", md.year, md.mon, md.day); }
string RsT(datetime t) { return t > 0 ? TimeToString(t, TIME_DATE | TIME_MINUTES) : ""; }
string RsD(double v) { return DoubleToString(v, _Digits); }
string RsR(double v) { return DoubleToString(v, 3); }
string RsI(long v) { return IntegerToString(v); }
string RsB(bool v) { return v ? "1" : "0"; }
void   RsC(string &row, string v) { row += (row == "" ? "" : ",") + v; }
string RsHeader()
  {
   return "row,type,symbol,event_time,level_tf,level_kind,level_price,level_formed,level_age_bars,cc,uses_before,breaks_before,tl_touch_no,dir,"
          + "touch_tf,touch_time,bo_status,ref_price,external,bo_time,body_ratio,qm,ls,apex,rej_rule,rej_ok,signal_time,early,"
          + "story_type,story_cont,story_part,dir_mn,dir_w1,dir_d1,dir_h4,dir_h1,aligned,lead_ok,"
          + "setup_kind,setup_flags,conf,conf_tf,entry,sl,tp,tp_src,sl_pips,rr,lots,spread_pts,"
          + "res_wick,r_wick,bars_wick,res_close,r_close,bars_close,mfe_r,mae_r,same_bar,end_time";
  }
void RsEvCols(string &row, int e)
  {
   if(e < 0) { for(int i = 0; i < 10; i++) RsC(row, ""); return; }
   int s = gEv[e].slot;
   RsC(row, SlotName(s));
   if(gEv[e].kind == 1)
     {
      int ti = gEv[e].idx;
      RsC(row, gTL[ti].dir > 0 ? "TL+" : "TL-"); RsC(row, RsD(gEv[e].px)); RsC(row, RsT(gTL[ti].t1)); RsC(row, RsI(gEv[e].age));
      RsC(row, "0"); RsC(row, RsI(gEv[e].usesB)); RsC(row, "0"); RsC(row, RsI(gEv[e].tlNo));
     }
   else
     {
      int li = gEv[e].idx;
      RsC(row, KindCsv(gLv[li].kind)); RsC(row, RsD(gLv[li].px)); RsC(row, RsT(gLv[li].t1)); RsC(row, RsI(gEv[e].age));
      RsC(row, RsB(gLv[li].cc)); RsC(row, RsI(gEv[e].usesB)); RsC(row, RsI(gEv[e].breaksB)); RsC(row, "0");
     }
   RsC(row, RsI(gEv[e].dir));
  }
void RsBoCols(string &row, int bi)
  {
   if(bi < 0) { for(int i = 0; i < 14; i++) RsC(row, ""); return; }
   bool found = gBO[bi].boB >= 0;
   RsC(row, SlotName(gBO[bi].bslot)); RsC(row, RsT(gBO[bi].tt)); RsC(row, StatusCsv(gBO[bi].status));
   RsC(row, found ? RsD(gBO[bi].ref) : ""); RsC(row, found ? RsB(gBO[bi].external) : "");
   RsC(row, found ? RsT(BarEnd(gBO[bi].bslot, gBO[bi].boB)) : ""); RsC(row, found ? RsR(gBO[bi].body) : "");
   RsC(row, found ? RsB(gBO[bi].qm) : ""); RsC(row, found && gBO[bi].lsB >= 0 ? RsD(gBO[bi].ls) : ""); RsC(row, found ? RsD(gBO[bi].apex) : "");
   RsC(row, RejCsv(gBO[bi].lslot));
   int ro = gBO[bi].rejState == 1 ? 1 : (gBO[bi].rejState == 3 ? -1 : (gBO[bi].rejState == 2 ? 2 : 0));
   RsC(row, RsI(ro)); RsC(row, RsT(gBO[bi].sigT)); RsC(row, RsB(gBO[bi].early));
  }
void RsCtxCols(string &row, int st, datetime t)
  {
   if(st >= 0) { RsC(row, StoryTypeCsv(StoryTypeAt(st, t))); RsC(row, RsB(gSt[st].cont)); RsC(row, RsI(StoryPart(st, t, PriceAt(t)))); }
   else { RsC(row, ""); RsC(row, ""); RsC(row, ""); }
   for(int s = 0; s <= 4; s++) { int q = StoryAt(s, t); RsC(row, RsI(q >= 0 ? gSt[q].dir : 0)); }
   int ad = 0; bool lead = false;
   bool al = AlignedAt(t, ad, lead);
   RsC(row, RsB(al)); RsC(row, RsB(al && lead));
  }
void Outcome(int d, double entry, double sl, double tp, int startBar, ORes &o)
  {
   ZeroMemory(o);
   o.resW = -9; o.resC = -9;
   int es = gEvalSlot;
   if(!S[es].ready || startBar < 1 || startBar > LastClosed(es)) return;
   double pt = SymbolInfoDouble(_Symbol, SYMBOL_POINT);
   int sp0 = InpRsSpread ? S[es].r[startBar].spread : 0;
   o.spr = sp0;
   double fill = d > 0 ? entry + sp0 * pt : entry;
   double R = d > 0 ? fill - sl : sl - fill;
   if(R <= 0.0) R = gMinStop;
   o.resW = 0; o.resC = 0;
   bool doneW = false, doneC = false;
   int lim = IMin(LastClosed(es), startBar + IMax(10, InpRsHorizon));
   for(int i = startBar; i <= lim; i++)
     {
      double spi = InpRsSpread ? S[es].r[i].spread * pt : 0.0;
      double hiX = d > 0 ? Hi(es, i) : Hi(es, i) + spi;     // exit side: bid for buys, ask for sells
      double loX = d > 0 ? Lo(es, i) : Lo(es, i) + spi;
      double clX = d > 0 ? Cl(es, i) : Cl(es, i) + spi;
      bool hitSL = d > 0 ? (loX <= sl) : (hiX >= sl);
      bool hitTP = d > 0 ? (hiX >= tp) : (loX <= tp);
      if(!doneW)
        {
         double fav = d > 0 ? (hiX - fill) : (fill - loX);
         double adv = d > 0 ? (fill - loX) : (hiX - fill);
         if(fav / R > o.mfe) o.mfe = fav / R;
         if(adv / R > o.mae) o.mae = adv / R;
         if(hitSL || hitTP)
           {
            doneW = true;
            o.barsW = i - startBar + 1;
            o.endW = Tm(es, i);
            o.same = hitSL && hitTP;
            if(hitSL) { o.resW = -1; o.rW = -1.0 * (d > 0 ? fill - sl : sl - fill) / R; }
            else { o.resW = 1; o.rW = (d > 0 ? tp - fill : fill - tp) / R; }
           }
        }
      if(!doneC)
        {
         bool clSL = d > 0 ? (clX <= sl) : (clX >= sl);
         if(clSL) { doneC = true; o.resC = -1; o.barsC = i - startBar + 1; o.rC = (d > 0 ? clX - fill : fill - clX) / R; }
         else if(hitTP) { doneC = true; o.resC = 1; o.barsC = i - startBar + 1; o.rC = (d > 0 ? tp - fill : fill - tp) / R; }
        }
      if(doneW && doneC) break;
     }
   double lastC = d > 0 ? Cl(es, lim) : Cl(es, lim) + (InpRsSpread ? S[es].r[lim].spread * pt : 0.0);
   if(!doneW) { o.rW = (d > 0 ? lastC - fill : fill - lastC) / R; o.barsW = lim - startBar + 1; }
   if(!doneC) { o.rC = (d > 0 ? lastC - fill : fill - lastC) / R; o.barsC = lim - startBar + 1; }
  }
string ResCsv(int r) { return r == 1 ? "tp" : (r == -1 ? "sl" : (r == 0 ? "open" : "nodata")); }
void RsPlanCols(string &row, int d, double entry, double sl, double tp, string tpSrc, int startBar)
  {
   ORes o;
   Outcome(d, entry, sl, tp, startBar, o);
   double sd = MathAbs(entry - sl);
   RsC(row, RsD(entry)); RsC(row, RsD(sl)); RsC(row, RsD(tp)); RsC(row, tpSrc);
   RsC(row, DoubleToString(gPip > 0 ? sd / gPip : 0.0, 1)); RsC(row, RsR(sd > 0 ? (tp - entry) * d / sd : 0.0));
   RsC(row, DoubleToString(LotsFor(sd), 2)); RsC(row, RsI(o.spr));
   RsC(row, ResCsv(o.resW)); RsC(row, o.resW == -9 ? "" : RsR(o.rW)); RsC(row, o.resW == -9 ? "" : RsI(o.barsW));
   RsC(row, ResCsv(o.resC)); RsC(row, o.resC == -9 ? "" : RsR(o.rC)); RsC(row, o.resC == -9 ? "" : RsI(o.barsC));
   RsC(row, o.resW == -9 ? "" : RsR(o.mfe)); RsC(row, o.resW == -9 ? "" : RsR(o.mae)); RsC(row, RsB(o.same)); RsC(row, RsT(o.endW));
  }
bool InRange(datetime t) { return t >= InpRsFrom && t <= InpRsTo; }
int RsWrite()
  {
   string fn = "RFX_MSNR_" + RsSym() + "_" + RsDay(InpRsFrom) + "_" + RsDay(InpRsTo) + ".csv";
   int h = FileOpen(fn, FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_COMMON);
   if(h == INVALID_HANDLE) { gRsMsg = "Research: cannot open " + fn + " (error " + IntegerToString(GetLastError()) + ")"; Print(gRsMsg); return -1; }
   FileWriteString(h, RsHeader() + "\r\n");
   int rows = 0;
   int es = gEvalSlot;
   // touches (bo_* columns are outcomes for these rows)
   if(InpRsTouches)
      for(int e = 0; e < ArraySize(gEv); e++)
        {
         int bi = gEv[e].bo;
         datetime tt = (bi >= 0 && gBO[bi].tb >= 0) ? gBO[bi].tt : gEv[e].ht;
         if(!InRange(tt)) continue;
         int d = gEv[e].dir;
         double en = gEv[e].px;
         double sl = en - d * gMinStop;
         int tk = 0, tr = -1;
         double tp = TargetOn(gEv[e].slot, d, en, tt, InpTPMinR * gMinStop, tk, tr);
         if(tk == 0) tp = en + d * InpFallbackRR * gMinStop;
         // limit fill: first eval bar at / after the touch that reaches the level
         int fb = -1;
         int a = FirstAt(es, tt);
         datetime tEnd = (bi >= 0 && gBO[bi].tb >= 0) ? BarEnd(gBO[bi].bslot, gBO[bi].tb) : BarEnd(gEv[e].slot, gEv[e].hb);
         for(int x = a; x <= LastClosed(es) && x >= 0 && Tm(es, x) < tEnd; x++)
            if((d > 0 && Lo(es, x) <= en) || (d < 0 && Hi(es, x) >= en)) { fb = x; break; }
         rows++;
         string row = "";
         RsC(row, RsI(rows)); RsC(row, "touch"); RsC(row, _Symbol); RsC(row, RsT(tt));
         RsEvCols(row, e);
         RsBoCols(row, bi);
         RsCtxCols(row, -1, tt);
         RsC(row, ""); RsC(row, ""); RsC(row, ""); RsC(row, "");
         RsPlanCols(row, d, en, sl, tp, TargetCsv(tk, gEv[e].slot, tr), fb >= 0 ? fb + 1 : -1);
         FileWriteString(h, row + "\r\n");
        }
   // breakouts = storyline starts (valid) and breakouts rejected for a missing QM
   for(int bi = 0; bi < ArraySize(gBO); bi++)
     {
      if(gBO[bi].status != ST_VALID && gBO[bi].status != ST_NOQM) continue;
      if(gBO[bi].sigT == 0 || !InRange(gBO[bi].sigT)) continue;
      int d = gBO[bi].dir;
      double en = gBO[bi].sigPx;
      double sd = MathMax(gMinStop, (en - (gBO[bi].apex - d * gBuf)) * d);
      double sl = en - d * sd;
      int st = gBO[bi].story;
      double tp = 0.0;
      string src = "FIXED";
      if(st >= 0 && gSt[st].bo == bi && gSt[st].target > 0.0 && (gSt[st].target - en) * d >= InpTPMinR * sd) { tp = gSt[st].target; src = TargetCsv(gSt[st].tgtKind, gSt[st].tgtSlot, gSt[st].tgtRef); }
      else
        {
         int tk = 0, tr = -1;
         tp = TargetOn(gBO[bi].lslot, d, en, gBO[bi].sigT, InpTPMinR * sd, tk, tr);
         if(tk == 0) tp = en + d * InpFallbackRR * sd; else src = TargetCsv(tk, gBO[bi].lslot, tr);
        }
      rows++;
      string row = "";
      RsC(row, RsI(rows)); RsC(row, "breakout"); RsC(row, _Symbol); RsC(row, RsT(gBO[bi].sigT));
      RsEvCols(row, gBO[bi].ev);
      RsBoCols(row, bi);
      RsCtxCols(row, st, gBO[bi].sigT);
      RsC(row, ""); RsC(row, ""); RsC(row, ""); RsC(row, "");
      RsPlanCols(row, d, en, sl, tp, src, FirstAt(es, gBO[bi].sigT));
      FileWriteString(h, row + "\r\n");
     }
   // setups (limit at the QM level when price came back)
   if(InpRsSetups)
      for(int su = 0; su < ArraySize(gSu); su++)
        {
         if(!InRange(gSu[su].armT)) continue;
         int li = gSu[su].lad, st = gSu[su].st, d = gLad[li].dir;
         double en = gLad[li].px;
         double sd = MathMax(gMinStop, (en - (gLad[li].inval - d * gBuf)) * d);
         int tk = 0, tsl = gSt[st].slot, tr = -1;
         double tp = PlanTP(st, d, en, gSu[su].armT, sd, gLad[li].cont, tk, tsl, tr);
         int fb = BarAt(es, gSu[su].armT);
         rows++;
         string row = "";
         RsC(row, RsI(rows)); RsC(row, "setup"); RsC(row, _Symbol); RsC(row, RsT(gSu[su].armT));
         int bi = gSt[st].bo;
         RsEvCols(row, gBO[bi].ev);
         RsBoCols(row, bi);
         RsCtxCols(row, st, gSu[su].armT);
         RsC(row, LadName(gLad[li].kind, d)); RsC(row, (gLad[li].gapAl ? "" : "GAPNOALIGN ") + SetupFlags(su, true)); RsC(row, ""); RsC(row, "");
         RsPlanCols(row, d, en, en - d * sd, tp, TargetCsv(tk, tsl, tr), fb >= 0 ? fb + 1 : -1);
         FileWriteString(h, row + "\r\n");
        }
   // entry signals
   for(int m = 0; m < ArraySize(gEn); m++)
     {
      if(!InRange(gEn[m].t)) continue;
      int su = gEn[m].setup, st = gEn[m].st, li = gSu[su].lad;
      rows++;
      string row = "";
      RsC(row, RsI(rows)); RsC(row, "entry"); RsC(row, _Symbol); RsC(row, RsT(gEn[m].t));
      int bi = gSt[st].bo;
      RsEvCols(row, gBO[bi].ev);
      RsBoCols(row, bi);
      RsCtxCols(row, st, gEn[m].t);
      RsC(row, LadName(gLad[li].kind, gLad[li].dir)); RsC(row, SetupFlags(su, true)); RsC(row, ConfCsv(gEn[m].conf)); RsC(row, SlotName(gEn[m].cslot));
      RsPlanCols(row, gEn[m].dir, gEn[m].entry, gEn[m].sl, gEn[m].tp, TargetCsv(gEn[m].tpKind, gEn[m].tpSlot, gEn[m].tpRef), FirstAt(es, gEn[m].t));
      FileWriteString(h, row + "\r\n");
     }
   FileClose(h);
   gRsMsg = "Research: " + IntegerToString(rows) + " rows -> Common\\Files\\" + fn;
   Print(gRsMsg);
   return rows;
  }
void RsTry()
  {
   if(gRsDone) return;
   if(InpRsTo <= InpRsFrom) { gRsMsg = "Research: InpRsTo must be after InpRsFrom"; gRsDone = true; return; }
   if(gRsAt > 0 && TimeLocal() - gRsAt < 3) return;            // history still downloading: retry every 3 s
   gRsAt = TimeLocal();
   gRsMode = true;
   bool ok = true;
   int warm = IMax(InpLevelMaxAge, InpTLMaxAge) + 100;
   datetime to = AddSec(InpRsTo, (long)(IMax(10, InpRsHorizon) + 20) * PeriodSeconds(SlotTf(gEvalSlot)) + 7L * 86400L);
   for(int s = 0; s < NSLOT && ok; s++)
     {
      if(!S[s].need) continue;
      datetime from = AddSec(InpRsFrom, -(long)warm * PeriodSeconds(S[s].tf));
      int got = S[s].LoadRange(from, to);
      if(got <= 20) { ok = false; gRsMsg = "Research: loading " + SlotName(s) + " history (try " + IntegerToString(gRsTries + 1) + ", error " + IntegerToString(GetLastError()) + ")"; break; }
      if(got > InpRsMaxBars) Print("MSNR research: ", SlotName(s), " has ", got, " bars (more than InpRsMaxBars); this can be slow");
      DeriveSlot(s);
      S[s].ready = true; S[s].partial = false; S[s].last0 = 0;
     }
   if(!ok)
     {
      gRsTries++;
      for(int s = 0; s < NSLOT; s++) { S[s].ready = false; S[s].last0 = 0; if(S[s].n != ArraySize(S[s].r)) DeriveSlot(s); }
      if(gRsTries > 30) { gRsDone = true; gRsMsg = "Research failed: history not available (set Max bars in chart = Unlimited)"; Print(gRsMsg); }
      gRsMode = false;
      return;
     }
   uint t0 = GetTickCount();
   Compute();
   int rows = RsWrite();
   Print("MSNR research: ", rows, " rows in ", (GetTickCount() - t0), " ms");
   gRsDone = true;
   gRsMode = false;
   for(int s = 0; s < NSLOT; s++) { S[s].ready = false; S[s].last0 = 0; S[s].partial = false; }   // back to live data
   gComputed = false;
   gFirstTry = 0;
   gAlertArmed = false;
   ArrayResize(gSeen, 0);
  }

//+------------------------------------------------------------------+
//| Theme, main loop, events                                         |
//+------------------------------------------------------------------+
void ApplyTheme()
  {
   int bg = (int)ChartGetInteger(0, CHART_COLOR_BACKGROUND);
   int r = bg & 0xFF, g = (bg >> 8) & 0xFF, b = (bg >> 16) & 0xFF;
   gDark = (0.299 * r + 0.587 * g + 0.114 * b) < 128.0;
   cTxt        = gDark ? C'200,200,200' : C'70,70,70';
   cHead       = gDark ? C'240,200,90'  : C'150,110,20';
   cCardBg     = gDark ? C'28,30,36'    : C'252,252,248';
   cCardFg     = gDark ? C'225,225,225' : C'30,30,30';
   cCardBorder = gDark ? C'90,90,100'   : C'160,160,160';
  }
void DrawAll()
  {
   gTNow = iTime(_Symbol, PERIOD_CURRENT, 0);
   if(gTNow == 0) gTNow = TimeCurrent();
   gPs = PeriodSeconds(PERIOD_CURRENT);
   gTLbl = AddSec(gTNow, 2L * gPs);
   ObjectsDeleteAll(0, PFX_DRAW);
   DrawLineChart();
   DrawLevels();
   DrawTLs();
   DrawStories();
   DrawLadders();
   DrawSetups();
   DrawEntries();
   if(gCardObj != "")
     {
      string tx = CardText(gCardObj, false);
      if(tx == "") HideCard(); else RenderCard(tx);
     }
   DrawPanel();
   ChartRedraw();
  }
void Tick()
  {
   if(InpResearch && !gRsDone) { RsTry(); if(!gRsDone) { if(TimeLocal() - gPanelAt >= 2) { gPanelAt = TimeLocal(); DrawPanel(); ChartRedraw(); } return; } }
   bool ch = RefreshLive();
   if(ch || !gComputed)
     {
      if(gFirstTry == 0) gFirstTry = TimeLocal();
      if(gComputed || AllReady() || TimeLocal() - gFirstTry > 15)
        {
         uint t0 = GetTickCount();
         Compute();
         gComputed = true;
         gTries = 0;
         DrawAll();
         DoAlerts();
         uint dt = GetTickCount() - t0;
         if(dt > 2000) Print("MSNR: recalculation took ", dt, " ms (lower the bars per TF in group 11 if the chart lags)");
        }
      else gTries++;
     }
   if(TimeLocal() - gPanelAt >= 2) { gPanelAt = TimeLocal(); DrawPanel(); ChartRedraw(); }
  }
int OnInit()
  {
   SetupUnits();
   ParseMap();
   ComputeNeeds();
   ApplyTheme();
   for(int s = 0; s < NSLOT; s++) gPartTry[s] = 0;
   gComputed = false; gTries = 0; gAlertArmed = false; ArrayResize(gSeen, 0);
   gRsDone = !InpResearch; gRsTries = 0; gRsMsg = ""; gCardObj = "";
   IndicatorSetString(INDICATOR_SHORTNAME, "MSNR 1.00");
   EventSetTimer(1);
   string need = "";
   for(int s = 0; s < NSLOT; s++) if(S[s].need) need += SlotName(s) + " ";
   Print("MSNR 1.00 ", _Symbol, ": pip ", DoubleToString(gPip, _Digits), ", min stop ", DoubleToString(gMinStop, _Digits), ", TFs ", need);
   return(INIT_SUCCEEDED);
  }
void OnDeinit(const int reason)
  {
   EventKillTimer();
   ObjectsDeleteAll(0, PFX);
   ChartRedraw();
  }
int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[],
                const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[])
  {
   Tick();
   return(rates_total);
  }
void OnTimer()
  {
   if(gHlAt > 0 && GetTickCount() - gHlAt > (uint)(IMax(1, InpHighlightSec) * 1000)) { ObjectsDeleteAll(0, PFX_HL); gHlAt = 0; ChartRedraw(); }
   if(TimeLocal() - gTimerAt < 2) return;
   gTimerAt = TimeLocal();
   Tick();                                                   // weekends / no ticks: keep loading history
  }
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id == CHARTEVENT_OBJECT_CLICK)
     {
      if(sparam == PFX_PANEL + "h") { gPanelOpen = !gPanelOpen; DrawPanel(); ChartRedraw(); return; }
      if(StringFind(sparam, PFX_PANEL + "r") == 0)
        {
         string tx = ObjectGetString(0, sparam, OBJPROP_TEXT);
         if(StringFind(tx, "Manual setups") == 0) { gManOpen = !gManOpen; DrawPanel(); ChartRedraw(); }
         return;
        }
      if(sparam == PFX_CARD + "x") { HideCard(); ChartRedraw(); return; }
      if(StringFind(sparam, PFX_CARD) == 0) return;             // a click inside the card keeps it open
      if(StringFind(sparam, PFX_HL) == 0) return;
      if(StringFind(sparam, PFX_DRAW) == 0) { ShowCard(sparam); return; }
      return;
     }
   if(id == CHARTEVENT_CLICK)
     {
      if(gCardObj == "") return;
      if(GetTickCount() - gCardAt < 300) return;                // the click that opened the card
      if(Inside((int)lparam, (int)dparam, gCardX, gCardY, gCardW, gCardH)) return;
      HideCard();
      ChartRedraw();
      return;
     }
   if(id == CHARTEVENT_CHART_CHANGE)
     {
      bool was = gDark;
      ApplyTheme();
      if(was != gDark && gComputed) DrawAll();
     }
  }
//+------------------------------------------------------------------+
