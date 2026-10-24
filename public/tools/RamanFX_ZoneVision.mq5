//+------------------------------------------------------------------+
//| RamanFX_ZoneVision.mq5 v2.10 (MT5; v1 part = port of the .mq4 1.99)|
//| See the chart through the ZoneBot's eyes. Uses the SAME zone     |
//| rules and defaults as RamanFX_ZoneBot so you can spot where      |
//| the bot disagrees with you (and with the mentor).                |
//| Draws:                                                           |
//|  - every zone with its 4 parts labelled (base, move away,        |
//|    stay away, space), proximal / distal lines,                   |
//|    type (RBR/DBD/DBR/RBD), grade A/B/C, fresh / tested / removed |
//|  - qualifiers: removed an opposing zone, removed a trendline,    |
//|    made a new high/low of the lookback                           |
//|  - rejected candidates with the reason (optional)                |
//|  - trendlines by the mentor's rules: clear valley -> peak ->     |
//|    higher high; attached so it never cuts through a candle;      |
//|    removed only by a candle fully (body + wick) beyond it        |
//|  - HTF zones (entry TF -> HTF pairing) and the HTF trend         |
//|  - the setup the bot would take now: entry, SL, TP, R:R and the  |
//|    reason it would trade or skip                                 |
//| Emotional wicks: a huge candle (> EmoATR x ATR) that only wicks  |
//| into a zone does not count as a touch. Removal needs a CLOSE.    |
//| MT5 extras (all optional, see "MT5 extras" inputs): sectioned    |
//| click box with close button and plan lines, compact collapsible  |
//| panel, strong-zone / trendline-break alerts + push, extra MT5    |
//| timeframes, dark / light chart colours, ATR handle cache.        |
//| Detection of zones and trendlines is identical to the MQ4.       |
//| v2.00 (docs/ZoneVision_v2_Spec.md): shared core                  |
//| RFX_ZoneCore.mqh (keep it in the same folder), top-down Direction|
//| box, Raja curve lines, optional WOW ladder and location filters, |
//| Zone DNA + mentor lenses (Kevin / Seiden / Raja / Baker) and the |
//| consensus verdict A+ / A / B / C / X: compact tag per zone,      |
//| click-box sections, filtered alerts, optional merge overlap,     |
//| research DNA columns + RFX_Calib.csv history, and the ZoneBot    |
//| export (InpExportGV: global variables RFX2|sym|tf|k|field).      |
//| With the v2 drawing inputs at default, the v1 objects are        |
//| unchanged (golden master: InpDumpObjects).                       |
//| v2.10: Raja inputs ("Raja (v2.1 ...)" groups), all off = v2.00. |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "2.10"
#property indicator_chart_window
#property indicator_buffers 0
#property indicator_plots   0

input string Sep1             = "-- Zone rules (keep equal to ZoneBot) --"; // -----
input double InpMinLegRatio   = 1.2;    // Move-away range / largest base candle
input int    InpMaxBase       = 6;      // Max basing candles
input double InpMaxZoneATR    = 1.5;    // Max zone height in ATR(14) (similar-size rule)
input int    InpLookback      = 200;    // Bars scanned
input int    InpMaxZoneAge    = 200;    // Ignore zones older than this many bars
input double InpEmoATR        = 3.0;    // Emotional candle: range > this x ATR (wick ignored)
input double InpMinRR         = 2.0;    // Min reward:risk (for the planned setup)
input double InpStopBufferPts = 10;     // Stop buffer beyond distal (points)
input double InpTrapATR       = 1.0;    // Liquidity trap: obvious level within N x ATR in front of the zone
input int    InpTrapSwing     = 3;      // Obvious level = swing with N bars each side
input bool   InpOnlyQualified = true;   // Sunday rule: only zones in the chain (removed opp. zone / trendline / made a new high-low)
input double InpMinGap        = 0.15;   // Space under the stay-away candle (x zone height) - below = drawable only, not tradable
input double InpMinSizeVsMedian = 0.5;  // Zone smaller than this x the median zone = too small
input double InpMaxDistATR    = 2.0;    // Zone further than N x HTF ATR = far: planned, halfway alert instead of live
input bool   InpHalfwayAlert  = true;   // Alert once when price reaches halfway to a far zone
input double InpMetalOilStop  = 2.0;    // Stop buffer multiplier on gold / silver / oil
input string Sep2             = "-- What to show (clean by default) --"; // -----
input int    InpMaxZones      = 4;      // Zones drawn: the N closest to price
input bool   InpShowTested    = false;  // Also draw tested zones
input bool   InpShowRemoved   = false;  // Also draw removed zones (faded)
input bool   InpShowNames     = true;   // Zone name inside the box (e.g. Rally Base Rally Demand (CP))
input bool   InpShowTrendlines= true;   // Newest intact trendline each way (mentor rules)
input bool   InpShowBrokenTL  = false;  // Also draw broken trendlines
input int    InpTrendSwing    = 3;      // Swing strength for liquidity-trap levels (bars each side)
input int    InpTLHistory     = 3;      // Trendlines drawn each way: the newest N (broken ones end where they broke)
input bool   InpShowChannel   = false;  // Draw the channel 50% helper line (the overextension check works either way)
input bool   InpShowHTFLines  = true;   // Also draw the higher-timeframe trendlines on this chart (precision on the entry TF)
input int    InpHTFLevels     = 4;      // Higher timeframes whose trendlines are drawn here (M15 chart: H1, H4, D1, W1); top-down like your analysis
input bool   InpTLBias        = true;   // Bias from the newest HTF trendline break (a broken daily downtrend line = bullish for H4 / H1)
input color  InpHtfTL         = C'200,150,40';   // higher-timeframe lines still respected (thin dotted)
input color  InpHtfTLBroken   = C'228,205,150';  // higher-timeframe lines already broken (lighter, end where they broke)
input bool   InpRefineHTF     = true;   // Re-anchor HTF lines on this chart's candles (exact top-most / bottom-most touch, no cut candles)
input int    InpTLSwing       = 2;      // Trendlines: swing points need N bars each side; REAL only after a new higher high / lower low
input bool   InpShowHTF       = true;   // HTF zone band (closest above and below)
input bool   InpShowPlan      = true;   // Bot's planned entry / SL / TP
input bool   InpShowPanel     = true;   // Compact info panel
input bool   InpShowBotOrders = true;   // Show why the ZoneBot placed its order on this symbol (bottom-right)
input bool   InpExplain       = false;  // Explain mode: label the 4 parts on the bot's zone
input bool   InpShowEmotional = true;   // Mark emotional candles (range > InpEmoATR x ATR) with a star
input color  InpEmoColor      = clrGoldenrod;
input bool   InpShowLegend    = true;   // Short key of the abbreviations in the panel
input bool   InpShowRejected  = false;  // Debug: rejected candidates + reason
input color  InpDemandFill    = C'200,232,203';
input color  InpDemandLine    = C'46,139,87';
input color  InpSupplyFill    = C'246,212,198';
input color  InpSupplyLine    = C'200,60,60';
input color  InpTrapColor     = C'170,150,220';
input color  InpHtfFill       = C'224,216,250';   // HTF zones on this chart: lavender, so they never look like gold HTF lines or black lines
input color  InpMuted         = C'170,170,170';
input color  InpTrend         = clrBlack;   // respected trendlines (thin solid); broken ones use InpMuted, dotted
input color  InpText          = C'90,90,90';
input string Sep3             = "-- MT5 extras (detection unchanged) --"; // -----
input bool   InpRichPopup     = true;   // Click box: sectioned (grade & trade / plan / why / drills), coloured header, close x
input bool   InpClickPlan     = true;   // Click box open: draw that zone's entry / SL / TP lines (dashed) with prices
input bool   InpCompactPanel  = true;   // Panel as a compact box (click its header to collapse); false = MT4-style Comment
input bool   InpPanelRight    = true;   // Panel + Direction box in the top-RIGHT corner (false = top-left, as v1)
input bool   InpPanelSeeThru  = true;   // Panel boxes drawn behind the candles, so candles stay visible through them
input bool   InpAlertStrong   = true;   // Alert when price reaches a fresh STRONG zone (once per zone)
input bool   InpAlertTL       = true;   // Alert when a drawn trendline (this chart or HTF) breaks on the last closed candle
input bool   InpPush          = false;  // Also send alerts as push notifications (set up MetaQuotes ID in Tools > Options > Notifications)
input bool   InpRedrawOnHTF   = true;   // Also redraw when a higher-timeframe candle opens (not only this chart's)
input bool   InpExtraTF       = true;   // Support MT5-only timeframes (M2..M20, H2, H3, H6, H8, H12) via the nearest standard TF
input bool   InpAutoTheme     = true;   // Dark chart background: switch default colours to readable dark-theme ones
input group "-- Zone research (tester) --"
input bool   InpResearch        = false;              // Zone research: log every zone + what happened next (always on in the Strategy Tester)
input string InpResearchTFs     = "M15,H1,H4";        // Research timeframes (analysed whatever the chart timeframe is; v2 also 3M, 6M, 12M)
input bool   InpResearchAlt     = true;               // Also log the ALT detector (ZigZag 3/2/2 pivot zones, II_SupDem idea)
input int    InpResearchMaxBars = 200;                // Follow-up horizon in bars of the zone's timeframe
input string InpResearchFile    = "RFX_ZoneResearch"; // CSV name: Terminal\Common\Files\<name>_<symbol>_<from>_<to>.csv
input bool   InpResearchDraw    = true;               // Research on: still draw the chart (false = faster test, nothing drawn)
input int    InpResearchGMT     = 2;                  // Server time minus GMT in hours (only for the session column)
input group "-- v2 Direction (top-down, display only) --"
input bool   InpDirEngine     = true;   // Direction engine: ETF -> ITF -> HTF states + one Direction readout (draws only RFXV2_ objects)
input int    InpDirTable      = 1;      // TF stack: 0 = v1 (StepUp / HtfOf), 1 = Kevin lesson 4 (D1 -> 1M -> 3M), 2 = Kevin lesson 15 slide
input bool   InpDirPlus1      = true;   // Add the lesson-15 "Higher+1" TF as a 4th row (H1 -> MN, H4 -> 3M, D1 -> 6M)
input bool   InpDirMacro      = false;  // H4 / D1 charts: add the macro rows 1M, 3M, 6M, 12M
input int    InpBiasSource    = 0;      // Bias used by the zone notes: 0 = v1 (HTF swings + trendline), 1 = Direction engine (changes verdict texts)
input int    InpDirRemovedN   = 2;      // Opposite zones removed after a trendline break for CHANGED (Raja: 2; fewer = TURNING / PULLBACK)
input double InpDirDepartATR  = 0;      // 0 = v1 cross (a full candle beyond the line); > 0 = Raja: close beyond with body >= x ATR
input bool   InpRajaRemoval   = false;  // Direction counts a zone as removed only after a 2nd big close beyond the distal (Raja)
input double InpRajaBigBody   = 0.6;    // Raja removal: 2nd close body >= x ATR
input int    InpCurveMode     = 1;      // Curve: 0 = v1 (position in the 100-bar HTF range), 1 = Raja (proximal to proximal of the HTF strong zones)
input double InpCurveLow      = 25;     // Low curve (%): buys only
input double InpCurveHigh     = 75;     // High curve (%): sells only
input bool   InpCurveLines    = true;   // Draw Raja's 25 / 50 / 75 curve lines between the HTF strong zones (RFXV2_c)
input bool   InpCurveFilter   = false;  // Filter: hide chart zones on the wrong side of the curve (demand in the high curve, supply in the low curve)
input bool   InpLockSide      = false;  // Filter: price inside a fresh HTF / Higher+1 zone -> hide the opposite chart zones (side lock)
input bool   InpShowDirPanel  = true;   // Direction box under the compact panel (click its header to collapse)
input bool   InpAlertDir      = true;   // Alert once when the Direction or its quality changes (never on load)
input bool   InpShowWOW       = false;  // Raja WOW ladder: targets at the origin zones of the broken HTF / ITF trendlines (RFXV2_W)
input int    InpWOWLines      = 4;      // WOW ladder: lines kept each way
input double InpPipXAU        = 0.1;    // Pip size on gold (WOW labels)
input group "Raja (v2.1 A)"
input int    InpRemovalMode   = 0;      // Zone removal: 0 = close or a normal wick beyond the distal (v1, = ZoneBot), 1 = close only (Raja); drawn / removed / fresh / tested follow it
input bool   InpRjAStrongRun  = false;  // Raja strong = removed an opposite zone anywhere in the run-out (false = within 5 bars of the leg)
input bool   InpRjAArrClose   = false;  // Raja arrival = the run-out crossed the trendline by a close (departure candle with InpDirDepartATR > 0), not the v1 full-candle removal
input bool   InpRjATouchTF    = false;  // Raja touch allowance per TF (H1: 2nd tap breaks; H4 / MN: 3-4 taps; D1 / W1: 3rd risky)
input bool   InpRjAShowTested = false;  // Also draw tested zones still inside that allowance, tagged "needs confirmation"
input bool   InpRjAAdjacent   = false;  // Overlap also = formed right next to an opposite zone with no gap (L52)
input bool   InpRjAFlipTL     = false;  // Flip zone only after a trendline was crossed before its base (L106)
input bool   InpRjAOppHtfVeto = false;  // Raja lens: strong zone inside / next to an opposite HTF zone = no trade
input bool   InpRjATLTouches  = false;  // Count trendline touches (label at the line, 4th touch = likely break, 3-5 tests = weak)
input bool   InpRjANearLine   = false;  // Raja lens: prefer the zone nearest the trendline, flag zones far from it
input double InpRjFarFromLinePips = 25; // Far from the trendline: more than this many pips
input bool   InpRjALens8      = false;  // Raja lens: 3 CPs in a row = skip, P vs CP note, "zone already did its job" flag
input group "-- v2 Zone DNA + mentor lenses (display only) --"
input bool   InpDNA           = true;   // Zone DNA for every drawn zone (departure, base, chain, tests, nested, curve, room, origin ...)
input int    InpBaseMedianN   = 20;     // DNA: base_rel = base candles / median of the last N zones
input double InpGapATR        = 0.10;   // DNA: opening gap >= x ATR = gap away (departure 3)
input int    InpATHBars       = 5000;   // DNA: all-time high / low checked this many bars back
input int    InpOriginBars    = 1500;   // DNA: origin check (Baker: was this price retested before?) this many bars back
input double InpNestTolH      = 1.0;    // DNA: nested = within this x the HTF zone height of a fresh same-side HTF zone (as ZoneBot AtHtfZone)
input bool   InpIndexOpen     = false;  // DNA: New York open at 13:30 UTC (indices) instead of 12:00 UTC (FX, metals)
input bool   InpLenses        = true;   // Mentor lenses (Kevin = v1 verdict, Seiden, Raja, Baker) + consensus verdict A+ / A / B / C / X
input double InpWKevin        = 30;     // Consensus weight: Kevin
input double InpWSeiden       = 20;     // Consensus weight: Seiden
input double InpWRaja         = 40;     // Consensus weight: Raja
input double InpWBaker        = 10;     // Consensus weight: Baker
input bool   InpKevinPlus     = false;  // Kevin+ notes also gate the Kevin lens (wick > 75% = void) and move its score
input int    InpSeidenDepth   = 0;      // Seiden tests: 0 = early rule (0 / 1 / 2+ touches = 2 / 1 / 0 pts), 1 = late rule (a test 25%+ deep = 0)
input double InpConfOffsetFrac= 0.05;   // Seiden confirmation entry: x zone height outside the proximal as price leaves
input group "-- v2 Display --"
input bool   InpLensTag       = true;   // Compact tag at each drawn zone's proximal (RFXV2_t): verdict, K+/K-, Seiden, Raja type, Baker, consensus
input bool   InpAsciiTags     = true;   // Tag separators and ticks in plain ASCII (" | ", K+ / K-)
input bool   InpShowNested    = true;   // Tag: "in H4 D" when nested in a fresh HTF zone, "in W1 S!" when inside an opposite HTF zone
input bool   InpShowSize      = false;  // Tag: zone height in pips and ATR
input bool   InpShowRunOut    = false;  // Tag: move away before the first return, in zone heights
input bool   InpShowDepth     = false;  // Tag: touches and deepest touch (tested zones)
input int    InpMergeOverlap  = 0;      // Merge overlapping same-side zones: 0 = off (v1), 1 = keep the older (line inside it), 2 = keep the nearer
input double InpMergeMinPct   = 50;     // Merge when the overlap is more than this % of the smaller zone
input int    InpTheme         = 0;      // Colours: 0 = auto (v1, follows the chart background), 1 = light, 2 = dark
input group "-- v2 Alerts --"
input bool   InpAlertBreak    = false;  // Alert when a drawn fresh zone is removed (close / normal wick beyond the distal), + Raja 2nd big close
input int    InpAlertDepth    = 0;      // Alert when price is this % into a drawn zone (0 = off, 25 / 50 / 75)
input bool   InpAlertWOW      = false;  // Alert on a new WOW1 target with the guard clear (needs InpShowWOW)
input bool   InpAlertAtLimit  = false;  // Touch alert at the bot's limit price (InpZ3Front x height before the proximal) instead of at the proximal
input double InpZ3Front       = 0.05;   // Bot limit offset in front of the proximal, x zone height (keep equal to ZoneBot)
input double InpAlertMinCons  = 0;      // Zone alerts only with consensus >= this
input int    InpAlertMinVerdict = 0;    // Zone alerts only with verdict: 0 any, 1 B or better, 2 A or better, 3 A+
input bool   InpAlertNestedOnly = false; // Zone alerts only for zones nested in a fresh HTF zone
input bool   InpAlertWithDir  = false;  // Zone alerts only for zones on the Direction side
input double InpAlertMinHistE = 0;      // Zone alerts only with calibrated best E >= this R (needs RFX_Calib.csv: zones without data are blocked)
input bool   InpAlertEmail    = false;  // Also send every alert by e-mail (Tools > Options > Email)
input group "-- v2 Calibration + research --"
input string InpCalFile       = "RFX_Calib.csv"; // Calibration table (analyze.py --calibrate), read from Common\Files or MQL5\Files
input bool   InpCalCommon     = true;   // Look in Terminal\Common\Files first (false = MQL5\Files first; the other folder is the fallback)
input int    InpCalMinN       = 30;     // Calibration: a cell is used only with at least this many zones
input double InpCalPrior      = 20;     // Calibration: shrinkage toward the parent cell (a, in trades)
input int    InpCalTarget     = 3;      // Calibration: R shown in the tag and the History line (1-5; 0 = the cell's best target)
input bool   InpShowHist      = true;   // Show "Historically: ..." in the tag and the HISTORY section when a file is loaded
input bool   InpUseCalWeights = false;  // Consensus uses the fitted lens weights of the file (W rows) instead of InpWKevin ... InpWBaker
input bool   InpResearchDNA   = true;   // Research: also log DNA, lens scores, Direction, the touch-1 snapshot and extra entry models (false = v1 columns only, faster)
input group "-- v2 developer --"
input bool     InpDumpObjects = false;  // Golden master: write every v1 object (RFXV_ RFXN_ RFXS_ RFXP2_) to Common\Files\RFX_Dump_<sym>_<tf>.csv
input datetime InpDumpAt      = 0;      // Golden master: dump once at the first redraw at / after this bar time (0 = after every redraw)
input group "-- v2 ZoneBot export --"
input bool     InpExportGV    = false;  // Export the drawn zones (nearest first), Direction and history as global variables RFX2|sym|tf|k|field for ZoneBot (InpZoneSource = 2)
input int      InpExportN     = 8;      // Zones exported at most (never more than the zones drawn, InpMaxZones)

#define PFX "RFXV_"
#define MAXTF 12

struct Zone
  {
   int      baseEnd;
   double   trap;       // liquidity trap price (0 = none)
   bool     crowded;    // zone sits on an obvious S/R level (retail crowd)
   int      trapBar;
   int      dir;
   double   prox, dist;
   int      legBar, baseN, saBar;
   double   legRatio;
   string   grade;
   bool     cont, tested, removed;
   int      removedBar, testedBar;
   string   qual;
   double   gap;        // space between stay-away candle and proximal, x zone height
   bool     leg2;       // second explosive candle in the move away
   bool     chain;      // removed opposing zone / trendline / made new high-low
   bool     arrival;    // strongest: broke the trendline AND removed the previous high / low or an opposing zone
  };

struct TLine
  {
   int      dir;          // +1 up (support), -1 down (resistance)
   int      a, b;         // anchor bars (older a, newer b)
   double   pa, pb;
   bool     removed;
   int      removedBar;
   bool     conf;         // higher high / lower low made after the second turn
  };

//+------------------------------------------------------------------+
//| Globals (all declared up front)                                  |
//+------------------------------------------------------------------+
ENUM_TIMEFRAMES CTF = PERIOD_CURRENT;   // this chart's timeframe (set in OnInit)
Zone  Z[], HZ[];
int   gTrend = 0;   // HTF trend as the bot reads it
TLine TL[];
datetime lastDraw = 0;
int   gTries = 0;   // redraw retries while MT5 is still loading HTF data / ATR

// zigzag turns, oldest first; pvT +1 peak, -1 valley
int    pvBar[]; double pvP[]; int pvT[];
ENUM_TIMEFRAMES gTF = PERIOD_CURRENT;   // timeframe the trendline code reads

// latest intact lines, for the channel 50% check
bool gUpOn = false, gDnOn = false;
double gUpS = 0, gUpP = 0, gUpW = 0, gDnS = 0, gDnP = 0, gDnW = 0;
int gUpB = 0, gDnB = 0;
bool gHUpOn = false, gHDnOn = false;
double gHUpS = 0, gHUpP = 0, gHUpW = 0, gHDnS = 0, gHDnP = 0, gHDnW = 0;
int gHUpB = 0, gHDnB = 0;
ENUM_TIMEFRAMES gHTF = PERIOD_CURRENT;
int gHBias = 0; string gHBiasTxt = "";

// every drawn line: anchor time, touch time, direction, broken?, rank
string rgN[]; datetime rgA[], rgB[]; int rgD[], rgR[]; bool rgX[];

// clicked zones: object id, details text and the plan numbers (for the click box and alerts)
string zKey[], zTxt[], zVer[], zState[];
int    zDir[];
double zProx[], zDist[], zEn[], zSl[], zTp[], zRR[];
datetime zT1[];
uint   popAt = 0;
int    gPopX = 0, gPopY = 0, gPopW = 0, gPopH = 0;   // open click box rectangle (pixels), 0 size = closed
// plan of the last ZoneNotes() call
double gNEn = 0, gNSl = 0, gNTp = 0, gNRR = 0;

// popup / panel row builders
string pR[]; color pC[]; int pK[];
string sR[]; color sC[];

// compact panel
bool   gPanelOpen = true;
string gPanL = "", gPanPlan = "";
int    gPanX = 0, gPanY = 0, gPanW = 0, gPanH = 0, gChartW = 0;
// panel x: top-right (InpPanelRight) or v1 top-left
int PanelX(int bw) { int W = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS); gChartW = W; return InpPanelRight ? MathMax(8, W - bw - 8) : 8; }
void SeeThru(string nm) { if(InpPanelSeeThru) ObjectSetInteger(0, nm, OBJPROP_BACK, true); }
// v2 Direction box (under the compact panel)
bool   gDirOpen = true;
int    gDbX = 0, gDbY = 0, gDbW = 0, gDbH = 0;

// alerts
string gAl[];
bool   gArmed = false;       // false during the first redraw: breaks / touches seen at load are not alerted
bool   gTouchArmed = false;

// ATR(14) handles, one per timeframe, with a per-bar value cache
int             aN = 0;
ENUM_TIMEFRAMES aTf[MAXTF];
int             aH[MAXTF];
datetime        aSt[MAXTF];
int             aCnt[MAXTF];
datetime        aB0[MAXTF];   // bar-0 time per timeframe at the last redraw (HTF candle opened -> redraw)
int             aCap = 0;
double          aV[];

// theme colours (inputs on a light chart; readable variants on a dark chart)
bool  gDark = false;
color cDemandFill, cDemandLine, cSupplyFill, cSupplyLine, cTrap, cHtfFill, cMuted, cTrend, cText, cHtfTLBroken, cRemFill;
color cPopBg, cPopFg, cPopHead, cPopBorder, cGood, cBad, cPlanEntry, cSec;
color cTag, cConflict, cWow, cCurve, cItfLine, cP1Line, cVAplus, cVA, cVB;   // v2 colours (same theme table)

// zone research (tester data collection) - only used when gRs is true
struct RZone
  {
   string   crow;          // create columns, ready for the CSV row
   int      slot;          // research timeframe slot
   int      dir;           // +1 demand, -1 supply
   double   prox, dist, hgt, spr, risk, oppR, endR;
   int      age;           // closed bars of its timeframe since creation
   bool     broken;        // close beyond distal (or a normal wick beyond it) - the ZoneVision removal rule
   datetime brokenT;
   int      brokenAge;
   double   runout;        // move away until the first return, in zone heights
   int      nT;            // touches started (max 3)
   bool     inTr;          // a touch trade is running
   bool     away;          // a candle closed fully outside the proximal since the last touch ended
   double   mfe, dep;      // current touch: best R before the stop, depth into the zone (x height) before 1R
   bool     r1;
   double   mfeC;          // touch 1, close-stop model: best R before a CLOSE beyond the distal
   bool     cOn;
   int      cRes;          // 0 none, 1 stop, 2 target, 3 open
   double   lossC;         // touch 1, close-stop model: the stop candle's close in R (<= -1: the real loss)
   datetime tT[3];
   int      tAge[3];
   double   tDep[3], tMfe[3];
   int      tRes[3];       // 0 none, 1 stop, 2 target (5R or opposing zone), 3 open at horizon / test end
   datetime tEnd[3];
   int      tEndAge[3];
   bool     alt;           // zone from the ALT detector
   // v2 (InpResearchDNA): DNA + lens columns, the touch-1 snapshot and the extra touch-1 entry models
   string   c2row;         // v2 creation columns (each starts with a comma)
   string   s1row;         // v2 touch-1 snapshot columns ("" = no snapshot)
   bool     s1Pend;        // touch 1 started: take the snapshot in this candle's research context
   int      s1Lag;         // candles between the touch and the snapshot (0 = on the touch candle's close)
   double   s1Dep;         // depth of the touch candle into the zone, % of the height
   datetime tBase;         // base-start time (finds the zone again at the touch)
   Zone     zs;            // the zone at creation (bars counted from the creation candle)
   string   v1St;          // v1 status once v1 resolved while a v2 model still ran ("" = not yet)
   datetime v1When;
   int      v1Age;
   double   mE[3], mRisk[3], mEnd[3], mMfe[3];   // models 0 front, 1 mid, 2 Baker deep: entry, 1R, end R, best R
   int      mSt[3];        // 0 waiting, 1 in trade, 2 done, 3 never filled
   bool     mArm[3];       // front: price was fully outside the entry level since creation
   int      mRes[3];       // 1 stop, 2 target, 3 open
   int      b1R, b3R;      // candles from touch 1 to 1R / 3R (-1 = not reached)
   double   mae;           // touch 1: worst R before 1R
   double   tgWow, tgOh, tgRo;   // touch-1 targets in R: WOW1, the opposing ITF / HTF proximal, the run-out extreme (-1 = none)
   bool     rjOn, rjPrev;  // Raja removal seen; the last candle closed beyond the distal
   datetime rjT;
  };
bool            gRs = false;          // research mode on (InpResearch or Strategy Tester)
bool            gQuiet = false;       // research pass: detection only, nothing drawn, no alerts
int             aNStd = MAXTF;        // ATR slots used by the chart itself (research slots come after)
int             rsN = 0;
ENUM_TIMEFRAMES rsTF[MAXTF];
datetime        rsLast[MAXTF];
RZone           RZ[];
int             rsFile = INVALID_HANDLE;
bool            rsFailed = false;
bool            rsDirty = false;
string          rsName = "", rsFrom = "";
int             rsCount = 0;
int             rsSeenS[]; int rsSeenD[]; datetime rsSeenT[];   // ALT pivots already handled
// ZoneNotes exports (research only reads them)
string gNGrade = "", gNTags = "";
int    gNP = 0, gNM = 0, gNC = 0;
// chart context saved while a research pass borrows the detection globals
ENUM_TIMEFRAMES svCTF = PERIOD_CURRENT, svGTF = PERIOD_CURRENT, svHTF = PERIOD_CURRENT;
int    svTrend = 0, svHBias = 0, svUpB = 0, svDnB = 0, svHUpB = 0, svHDnB = 0;
bool   svUpOn = false, svDnOn = false, svHUpOn = false, svHDnOn = false;
double svUpS = 0, svUpP = 0, svUpW = 0, svDnS = 0, svDnP = 0, svDnW = 0;
double svHUpS = 0, svHUpP = 0, svHUpW = 0, svHDnS = 0, svHDnP = 0, svHDnW = 0;
double svNEn = 0, svNSl = 0, svNTp = 0, svNRR = 0;
string svHBiasTxt = "";
Zone   svZ[];
TLine  svTL[];

//+------------------------------------------------------------------+
//| v2 shared core: the v1 detection / trendline / notes functions   |
//| (moved unchanged) + series accessors + Direction engine          |
//+------------------------------------------------------------------+
#include "RFX_ZoneCore.mqh"

// v2 per drawn zone, parallel to zKey[] (filled by RegZone + V2Zones): Z index, the v1 ZoneNotes counts, DNA, lenses
int      zZi[], zNP[], zNM[], zNC[];
string   zGrade[];
ZoneDNA  zDna[];
LensOut  zLens[];
bool     gV2Ok = false;              // DNA / lenses computed for this redraw
// click box: the open zone and click point, v2 section headers (row -> key) and folded sections
int      gPopZi = -1, gPopCX = 0, gPopCY = 0;
int      gV2HdrRow[];
string   gV2HdrKey[];
string   gV2Fold = "|DNA|";          // the DNA section starts folded (the box is capped at 40 rows)
// v2 alerts: drawn fresh zones of the last redraw (break alert), zones waiting for Raja's 2nd big close
datetime gBkT[]; int gBkD[]; double gBkProx[], gBkCons[]; int gBkV[]; bool gBkNest[], gBkLens[]; string gBkTag[];
datetime gRjT[], gRjAt[]; int gRjD[];
bool     gV2TouchArmed = false;
// v2 calibration per drawn zone (parallel to zKey[]), break-alert copies of it; v2 research switches
CalOut   zCal[];
bool     gBkHOk[]; double gBkHE[];
bool     gRsDna = false;             // research: v2 columns on (InpResearchDNA)
bool     rsVirt = false;             // a research TF is a virtual 3M / 6M / 12M
string   gRsS1Empty = "";            // the snapshot columns of a zone without a touch

//+------------------------------------------------------------------+
//| Chart-series helpers (replace MT4 Time[] High[] Low[] ...)       |
//+------------------------------------------------------------------+
datetime cT(int i) { return ST(_Symbol, CTF, i); }   // v2: through the core accessors (= iTime ... for a real TF; a research pass may use 3M)
double   cH(int i) { return SH(_Symbol, CTF, i); }
double   cL(int i) { return SL(_Symbol, CTF, i); }
double   cO(int i) { return SO(_Symbol, CTF, i); }
double   cC(int i) { return SC(_Symbol, CTF, i); }
int      cBars()   { return SBars(_Symbol, CTF); }
double   SBid()    { return SymbolInfoDouble(_Symbol, SYMBOL_BID); }
double   SAsk()    { return SymbolInfoDouble(_Symbol, SYMBOL_ASK); }
double   Mid()     { return (SBid() + SAsk()) / 2; }

//+------------------------------------------------------------------+
//| ATR(14): MT5 handles + cache. Same SMA-of-true-range as MT4.     |
//+------------------------------------------------------------------+
int AtrSlot(ENUM_TIMEFRAMES tf)
  {
   for(int k = 0; k < aN; k++) if(aTf[k] == tf) return k;
   if(aN >= MAXTF) return -1;
   int h = iATR(_Symbol, tf, 14);
   if(h == INVALID_HANDLE) return -1;
   aTf[aN] = tf; aH[aN] = h; aSt[aN] = 0; aCnt[aN] = 0; aB0[aN] = 0; aN++;
   return aN - 1;
  }
void AtrReset() { for(int k = 0; k < aN; k++) { aSt[k] = 0; aCnt[k] = 0; } }
double ATR(ENUM_TIMEFRAMES tf, int shift)
  {
   if(tf == PERIOD_CURRENT) tf = CTF;
   if(VIsTF(tf)) return VAtr(tf, shift);                             // v2: Wilder ATR on the aggregated 3M / 6M / 12M series
   int k = AtrSlot(tf);
   if(k < 0 || shift < 0) return 0;
   if(shift >= 1 && shift < aCap)
     {
      datetime st = iTime(_Symbol, tf, 1);                  // closed-bar values only change when a new bar opens
      if(aCnt[k] <= 0 || aSt[k] != st)
        {
         aCnt[k] = 0; aSt[k] = 0;
         int avail = BarsCalculated(aH[k]);
         int want = MathMin(aCap - 1, avail - 1);
         if(want > 0)
           {
            double b[]; ArraySetAsSeries(b, true);
            int got = CopyBuffer(aH[k], 0, 1, want, b);
            if(got > 0) { for(int i = 0; i < got; i++) aV[k * aCap + 1 + i] = b[i]; aCnt[k] = got; aSt[k] = st; }
           }
        }
      if(shift <= aCnt[k]) return aV[k * aCap + shift];
      if(aCnt[k] > 0) return 0;                             // older than the history: 0, as MT4 iATR
     }
   double one[];
   if(CopyBuffer(aH[k], 0, shift, 1, one) == 1) return one[0];
   return 0;
  }
bool DataReady()
  {
   for(int k = 0; k < aN; k++)
     {
      if(iBars(_Symbol, aTf[k]) <= 0) return false;
      if(BarsCalculated(aH[k]) <= 0) return false;
     }
   return true;
  }
bool HtfChanged()
  {
   bool ch = false;
   for(int k = 0; k < MathMin(aN, aNStd); k++) if(aTf[k] != CTF && iTime(_Symbol, aTf[k], 0) != aB0[k]) ch = true;   // research-only timeframes never trigger a redraw
   return ch;
  }

//+------------------------------------------------------------------+
//| Theme                                                            |
//+------------------------------------------------------------------+
bool BgIsDark()
  {
   long bg = ChartGetInteger(0, CHART_COLOR_BACKGROUND);
   int r = (int)(bg & 0xFF), g = (int)((bg >> 8) & 0xFF), b = (int)((bg >> 16) & 0xFF);
   return 0.299 * r + 0.587 * g + 0.114 * b < 128;
  }
void ApplyTheme()
  {
   cDemandFill = InpDemandFill; cDemandLine = InpDemandLine; cSupplyFill = InpSupplyFill; cSupplyLine = InpSupplyLine;
   cTrap = InpTrapColor; cHtfFill = InpHtfFill; cMuted = InpMuted; cTrend = InpTrend; cText = InpText; cHtfTLBroken = InpHtfTLBroken;
   cRemFill = C'250,230,212';
   cPopBg = C'255,255,236'; cPopFg = clrDimGray; cPopHead = clrBlack; cPopBorder = clrDarkGray;
   cGood = clrSeaGreen; cBad = clrFireBrick; cPlanEntry = clrRoyalBlue; cSec = C'120,120,120';
   cTag = C'70,70,120'; cConflict = C'200,60,60'; cWow = C'0,150,170'; cCurve = C'150,150,150'; cItfLine = C'150,150,200'; cP1Line = C'230,170,90';
   cVAplus = C'0,130,60'; cVA = C'46,139,87'; cVB = C'70,110,170';
   gDark = InpTheme == 2 ? true : (InpTheme == 1 ? false : (InpAutoTheme && BgIsDark()));   // v2 InpTheme 1 / 2 force light / dark; 0 = v1
   if(!gDark) return;
   // only colours still on their default are switched; your own colour choices are kept
   if(InpDemandFill == C'200,232,203') cDemandFill = C'26,70,42';
   if(InpSupplyFill == C'246,212,198') cSupplyFill = C'86,36,30';
   if(InpHtfFill == C'224,216,250')    cHtfFill = C'58,50,96';
   if(InpDemandLine == C'46,139,87')   cDemandLine = C'80,200,120';
   if(InpSupplyLine == C'200,60,60')   cSupplyLine = C'235,95,95';
   if(InpMuted == C'170,170,170')      cMuted = C'120,120,120';
   if(InpTrend == clrBlack)            cTrend = C'225,225,225';
   if(InpText == C'90,90,90')          cText = C'200,200,200';
   if(InpTrapColor == C'170,150,220')  cTrap = C'110,90,170';
   if(InpHtfTLBroken == C'228,205,150') cHtfTLBroken = C'130,110,60';
   cRemFill = C'70,58,44';
   cPopBg = C'36,38,46'; cPopFg = C'190,190,190'; cPopHead = clrWhite; cPopBorder = C'90,90,100';
   cGood = C'90,200,130'; cBad = C'240,110,100'; cPlanEntry = C'100,150,255'; cSec = C'150,150,160';
   cTag = C'185,185,225'; cConflict = C'240,110,100'; cWow = C'90,200,220'; cCurve = C'130,130,140'; cItfLine = C'120,120,190'; cP1Line = C'200,150,80';
   cVAplus = C'60,210,110'; cVA = C'80,200,120'; cVB = C'100,150,255';
  }

//+------------------------------------------------------------------+
//| Init / deinit                                                    |
//+------------------------------------------------------------------+
int OnInit()
  {
   CTF = Period();
   // ---- Raja v2.1 (A) ---- inputs -> core switches (the core defaults = v2.00, which ZoneBot keeps)
   RjA_RmMode = InpRemovalMode; RjA_StrongRun = InpRjAStrongRun; RjA_ArrDepart = InpRjAArrClose; RjA_TouchTF = InpRjATouchTF;
   RjA_ShowTested = InpRjAShowTested; RjA_Adjacent = InpRjAAdjacent; RjA_FlipTL = InpRjAFlipTL; RjA_OppHtfVeto = InpRjAOppHtfVeto;
   RjA_TLTouch = InpRjATLTouches; RjA_NearLine = InpRjANearLine; RjA_FarPips = InpRjFarFromLinePips; RjA_Lens8 = InpRjALens8;
   ApplyTheme();
   aCap = MathMax(InpLookback, 20) + 80;
   ArrayResize(aV, MAXTF * aCap);
   ArrayInitialize(aV, 0);
   AtrSlot(CTF);
   ENUM_TIMEFRAMES h = HtfOf(CTF);
   if(h > 0) AtrSlot(h);
   for(int lv = 1; lv <= MathMin(InpHTFLevels, 7); lv++) { ENUM_TIMEFRAMES t = StepUp(CTF, lv); if(t > 0) AtrSlot(t); }
   if(InpDirEngine) { ENUM_TIMEFRAMES ds[]; int nd = DirStackTFs(ds); for(int k = 0; k < nd; k++) AtrSlot(ds[k]); }   // v2: Direction stack TFs load with the chart
   lastDraw = 0; gArmed = false; gTouchArmed = false; gTries = 0;
   gRs = InpResearch || (bool)MQLInfoInteger(MQL_TESTER);
   if(gRs) RsInit();
   CalCheck();                                                       // v2: RFX_Calib.csv (Journal note when missing)
   return(INIT_SUCCEEDED);
  }
void OnDeinit(const int r)
  {
   if(gRs) RsClose();
   ObjectsDeleteAll(0, PFX); ObjectsDeleteAll(0, "RFXN_"); ObjectsDeleteAll(0, "RFXP2_"); ObjectsDeleteAll(0, "RFXS_"); Comment("");
   ObjectsDeleteAll(0, "RFXV2_");
   if(InpExportGV) GlobalVariablesDeleteAll(RFX_GVPrefix(_Symbol, TfName(CTF)));   // v2 M10: no stale export
   for(int k = 0; k < aN; k++) if(aH[k] != INVALID_HANDLE) IndicatorRelease(aH[k]);
   aN = 0;
  }

//+------------------------------------------------------------------+
//| Alerts                                                           |
//+------------------------------------------------------------------+
bool Alerted(string key) { for(int i = 0; i < ArraySize(gAl); i++) if(gAl[i] == key) return true; return false; }
void MarkAlerted(string key) { int n = ArraySize(gAl); if(n > 300) { ArrayResize(gAl, 0); n = 0; } ArrayResize(gAl, n + 1); gAl[n] = key; }
void Notify(string m)
  {
   Alert(m);
   if(InpPush) SendNotification(StringLen(m) > 250 ? StringSubstr(m, 0, 250) : m);
   if(InpAlertEmail) SendMail("ZoneVision " + _Symbol, m);           // v2 (off by default)
  }
// price reached a fresh STRONG zone that is drawn on the chart (once per zone)
void CheckTouch()
  {
   if(!InpAlertStrong) return;
   double b = SBid();
   for(int k = 0; k < ArraySize(zKey); k++)
     {
      if(zVer[k] != "STRONG" || zState[k] != "fresh") continue;
      double lvT = InpAlertAtLimit ? zProx[k] + zDir[k] * InpZ3Front * MathAbs(zProx[k] - zDist[k]) : zProx[k];   // v2: at the bot's limit (off = v1)
      bool hit = zDir[k] > 0 ? b <= lvT : b >= lvT;
      if(!hit) continue;
      if(!V2AlertOk(k)) continue;                                    // v2 alert filters (all pass at their defaults)
      string key = "T" + DoubleToString(zProx[k], _Digits) + (zDir[k] > 0 ? "d" : "s");
      if(Alerted(key)) continue;
      MarkAlerted(key);
      if(gTouchArmed)
         Notify(StringFormat("ZoneVision %s %s: price reached the STRONG %s zone %s (entry %s, SL %s%s)", _Symbol, TfName(CTF), zDir[k] > 0 ? "demand" : "supply",
                DoubleToString(zProx[k], _Digits), DoubleToString(zEn[k], _Digits), DoubleToString(zSl[k], _Digits), zTp[k] > 0 ? ", TP " + DoubleToString(zTp[k], _Digits) : "") + V2AlertTail(k));
     }
   gTouchArmed = true;
  }

//+------------------------------------------------------------------+
//| Click box                                                        |
//+------------------------------------------------------------------+
// Click a zone (box, name or its lines) -> a details box right beside the click; click anywhere else to close it
void RegZone(string id, string txt, Zone &z, string verdict, string state, datetime t1)
  {
   int n = ArraySize(zKey);
   ArrayResize(zKey, n + 1); ArrayResize(zTxt, n + 1); ArrayResize(zVer, n + 1); ArrayResize(zState, n + 1); ArrayResize(zDir, n + 1);
   ArrayResize(zProx, n + 1); ArrayResize(zDist, n + 1); ArrayResize(zEn, n + 1); ArrayResize(zSl, n + 1); ArrayResize(zTp, n + 1); ArrayResize(zRR, n + 1); ArrayResize(zT1, n + 1);
   zKey[n] = id; zTxt[n] = txt; zVer[n] = verdict; zState[n] = state; zDir[n] = z.dir; zProx[n] = z.prox; zDist[n] = z.dist;
   zEn[n] = gNEn; zSl[n] = gNSl; zTp[n] = gNTp; zRR[n] = gNRR; zT1[n] = t1;
   // v2: the Z index (id = PFX + "Z" + index) and the ZoneNotes counts of this zone (set by the ZoneNotes call just before)
   ArrayResize(zZi, n + 1); ArrayResize(zNP, n + 1); ArrayResize(zNM, n + 1); ArrayResize(zNC, n + 1); ArrayResize(zGrade, n + 1);
   ArrayResize(zDna, n + 1); ArrayResize(zLens, n + 1);
   zZi[n] = StringFind(id, PFX + "Z") == 0 ? (int)StringToInteger(StringSubstr(id, StringLen(PFX) + 1)) : -1;
   zNP[n] = gNP; zNM[n] = gNM; zNC[n] = gNC; zGrade[n] = gNGrade;
   ZeroMemory(zDna[n]); ZeroMemory(zLens[n]);
  }
void ClearReg()
  {
   ArrayResize(zKey, 0); ArrayResize(zTxt, 0); ArrayResize(zVer, 0); ArrayResize(zState, 0); ArrayResize(zDir, 0);
   ArrayResize(zProx, 0); ArrayResize(zDist, 0); ArrayResize(zEn, 0); ArrayResize(zSl, 0); ArrayResize(zTp, 0); ArrayResize(zRR, 0); ArrayResize(zT1, 0);
   ArrayResize(zZi, 0); ArrayResize(zNP, 0); ArrayResize(zNM, 0); ArrayResize(zNC, 0); ArrayResize(zGrade, 0); ArrayResize(zDna, 0); ArrayResize(zLens, 0);
   gV2Ok = false;
  }
void HidePop() { gPopW = 0; gPopH = 0; gPopZi = -1; ObjectsDeleteAll(0, "RFXV2_P"); if(ObjectFind(0, "RFXP2_bg") >= 0) { ObjectsDeleteAll(0, "RFXP2_"); ChartRedraw(); } }
void Lbl(string nm, int x, int y, string txt, color c, string font, int size)
  {
   ObjectCreate(0, nm, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, x); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, y);
   ObjectSetString(0, nm, OBJPROP_TEXT, txt); ObjectSetString(0, nm, OBJPROP_FONT, font); ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
  }
void Box(string nm, int x, int y, int w, int h, color bg, color border)
  {
   ObjectCreate(0, nm, OBJ_RECTANGLE_LABEL, 0, 0, 0);
   ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, x); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, nm, OBJPROP_XSIZE, w); ObjectSetInteger(0, nm, OBJPROP_YSIZE, h);
   ObjectSetInteger(0, nm, OBJPROP_BGCOLOR, bg); ObjectSetInteger(0, nm, OBJPROP_BORDER_TYPE, BORDER_FLAT);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, border); ObjectSetInteger(0, nm, OBJPROP_BACK, false);
  }
// the MT4 box: plain lines
void ShowPopPlain(string txt, int x, int y)
  {
   string ln[]; int n = StringSplit(txt, '\n', ln), w = 0;
   for(int i = 0; i < n; i++) w = MathMax(w, StringLen(ln[i]));
   int bw = MathMax(240, w * 6 + 24), bh = 15 * n + 12;
   int cw = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS), ch = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS);
   int bx = x + 18 + bw > cw ? MathMax(4, x - 18 - bw) : x + 18, by = MathMax(4, MathMin(y - bh / 2, ch - bh - 4));
   Box("RFXP2_bg", bx, by, bw, bh, cPopBg, cPopBorder);
   for(int i = 0; i < n; i++)
     {
      color c = cPopFg;
      if(StringFind(ln[i], "x ") == 0) c = cBad;
      if(StringFind(ln[i], "+ ") == 0) c = cGood;
      if(i <= 1) c = cPopHead;
      Lbl("RFXP2_" + IntegerToString(i), bx + 8, by + 6 + 15 * i, ln[i], c, "Arial", 8);
     }
   gPopX = bx; gPopY = by; gPopW = bw; gPopH = bh;
  }
void PRow(string t, color c, int k) { int n = ArraySize(pR); ArrayResize(pR, n + 1); ArrayResize(pC, n + 1); ArrayResize(pK, n + 1); pR[n] = t; pC[n] = c; pK[n] = k; }
void PWrap(string t, color c, int maxc)
  {
   if(StringLen(t) <= maxc) { PRow(t, c, 0); return; }
   string w[]; int n = StringSplit(t, ' ', w);
   string cur = "";
   for(int i = 0; i < n; i++)
     {
      string add = cur == "" ? w[i] : cur + " " + w[i];
      if(StringLen(add) > maxc && cur != "") { PRow(cur, c, 0); cur = "    " + w[i]; }
      else cur = add;
     }
   if(cur != "") PRow(cur, c, 0);
  }
color VerdictColor(string v) { return v == "STRONG" ? C'46,139,87' : (v == "OK" ? C'70,110,170' : C'140,140,140'); }
// sectioned box: header (zone + verdict, coloured), grade & trade, plan, why strong / weak, drill lessons, close x
void ShowPopRich(int zi, int x, int y)
  {
   ArrayResize(pR, 0); ArrayResize(pC, 0); ArrayResize(pK, 0);
   ArrayResize(gV2HdrRow, 0); ArrayResize(gV2HdrKey, 0);
   string ln[]; int n = StringSplit(zTxt[zi], '\n', ln);
   const int WR = 66;
   string head = (n > 0 ? ln[0] : "Zone") + "  |  " + zVer[zi];
   string grade = n > 1 ? ln[1] : "";
   PRow("GRADE & TRADE", cSec, 1);
   PWrap(grade, StringFind(grade, "Trade: YES") >= 0 ? cGood : cBad, WR);
   string plan = "", drills = "";
   for(int i = 2; i < n; i++)
     {
      if(StringFind(ln[i], "Plan: ") == 0) plan = StringSubstr(ln[i], 6);
      if(StringFind(ln[i], "Drills: ") == 0) drills = StringSubstr(ln[i], 8);
     }
   PRow("PLAN", cSec, 1);
   PWrap(plan != "" ? plan : "no target: no fresh opposing zone in view", plan != "" ? cPopHead : cPopFg, WR);
   PRow("WHY STRONG / WEAK", cSec, 1);
   for(int i = 2; i < n; i++)
     {
      string s = ln[i];
      if(s == "" || StringFind(s, "Plan: ") == 0 || StringFind(s, "Drills: ") == 0) continue;
      color c = cPopFg;
      if(StringFind(s, "x ") == 0) c = cBad;
      if(StringFind(s, "+ ") == 0 || StringFind(s, "Clear space") == 0) c = cGood;
      PWrap(s, c, WR);
     }
   if(drills != "")
     {
      PRow("DRILL LESSONS", cSec, 1);
      string d[]; int m = StringSplit(drills, ';', d);
      for(int j = 0; j < m; j++) { string s = d[j]; StringTrimLeft(s); StringTrimRight(s); if(s != "") PWrap("* " + s, cPopFg, WR); }
     }
   int v1Rows = ArraySize(pR);
   if(gDirOk && InpShowDirPanel) DirPopRows(zDir[zi], zProx[zi], WR);   // v2: Direction section after the v1 sections
   if(gV2Ok && InpDNA) V2PopRows(zi, WR);                            // v2: Mentors / DNA / History / Plans sections
   if(ArraySize(pR) > MathMax(40, v1Rows))                           // v2 rows capped: at most 40 rows (v1's own rows are never cut)
     {
      int cap = MathMax(40, v1Rows);
      ArrayResize(pR, cap); ArrayResize(pC, cap); ArrayResize(pK, cap);
      pR[cap - 1] = "... more: click a section header to fold it"; pC[cap - 1] = cSec; pK[cap - 1] = 0;
     }
   int rows = ArraySize(pR), w = 0;
   for(int i = 0; i < rows; i++) w = MathMax(w, StringLen(pR[i]));
   int cw = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS), ch = (int)ChartGetInteger(0, CHART_HEIGHT_IN_PIXELS);
   int bw = MathMin(MathMax(330, MathMax(w * 6 + 30, StringLen(head) * 7 + 40)), MathMax(200, cw - 8));   // bold header ~7 px a character + room for the x
   int hh = 22, bh = hh + 6;
   for(int i = 0; i < rows; i++) bh += pK[i] == 1 ? (i > 0 ? 20 : 16) : 14;
   bh += 8;
   int bx = x + 18 + bw > cw ? MathMax(4, x - 18 - bw) : x + 18;   // flips to the left of the click near the right edge
   int by = MathMax(4, MathMin(y - bh / 2, ch - bh - 4));
   Box("RFXP2_bg", bx, by, bw, bh, cPopBg, cPopBorder);
   Box("RFXP2_hd", bx, by, bw, hh, VerdictColor(zVer[zi]), VerdictColor(zVer[zi]));
   Lbl("RFXP2_ht", bx + 8, by + 4, head, clrWhite, "Arial Bold", 9);
   Lbl("RFXP2_x", bx + bw - 16, by + 2, "x", clrWhite, "Arial Bold", 11);
   ObjectSetString(0, "RFXP2_x", OBJPROP_TOOLTIP, "close");
   ObjectSetInteger(0, "RFXP2_x", OBJPROP_ZORDER, 10);
   int yy = by + hh + 6;
   for(int i = 0; i < rows; i++)
     {
      string nm = "RFXP2_r" + IntegerToString(i);
      if(pK[i] == 1) { if(i > 0) yy += 4; Lbl(nm, bx + 8, yy, pR[i], pC[i], "Arial Bold", 7); yy += 16; }
      else { Lbl(nm, bx + 12, yy, pR[i], pC[i], "Arial", 8); yy += 14; }
     }
   gPopX = bx; gPopY = by; gPopW = bw; gPopH = bh;
  }
// the clicked zone's own plan on the chart (dashed), removed with the box
void DrawClickPlan(int zi)
  {
   if(zEn[zi] <= 0) return;
   datetime t1 = zT1[zi], t2 = cT(0) + PeriodSeconds() * 18;
   HLine("RFXP2_le", t1, t2, zEn[zi], cPlanEntry, STYLE_DASH, 1); Txt("RFXP2_let", t2, zEn[zi], " entry " + DoubleToString(zEn[zi], _Digits), cPlanEntry, 7, ANCHOR_LEFT);
   HLine("RFXP2_ls", t1, t2, zSl[zi], cSupplyLine, STYLE_DASH, 1); Txt("RFXP2_lst", t2, zSl[zi], " SL " + DoubleToString(zSl[zi], _Digits), cSupplyLine, 7, ANCHOR_LEFT);
   if(zTp[zi] > 0)
     { HLine("RFXP2_lt", t1, t2, zTp[zi], cDemandLine, STYLE_DASH, 1); Txt("RFXP2_ltt", t2, zTp[zi], StringFormat(" TP %s  (1:%.1f)", DoubleToString(zTp[zi], _Digits), zRR[zi]), cDemandLine, 7, ANCHOR_LEFT); }
  }
void ShowPop(int zi, int x, int y)
  {
   ObjectsDeleteAll(0, "RFXP2_");
   ObjectsDeleteAll(0, "RFXV2_P");
   gPopZi = zi; gPopCX = x; gPopCY = y;
   if(InpRichPopup) ShowPopRich(zi, x, y); else ShowPopPlain(zTxt[zi], x, y);
   if(InpClickPlan) DrawClickPlan(zi);
   if(InpClickPlan && InpRichPopup) V2DrawAltPlans(zi);             // v2: alternative plans (dashed, RFXV2_P*)
   NoSelect("RFXP2_");
   popAt = GetTickCount();
   ChartRedraw();
  }
// nothing this indicator draws can be selected or dragged (clicks still open the details box)
void NoSelect(string pre)
  {
   for(int o = ObjectsTotal(0, -1, -1) - 1; o >= 0; o--)
     {
      string nm = ObjectName(0, o);
      if(StringFind(nm, pre) != 0) continue;
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, nm, OBJPROP_SELECTED, false);
     }
  }
bool Inside(int x, int y, int bx, int by, int bw, int bh) { return bw > 0 && bh > 0 && x >= bx && x <= bx + bw && y >= by && y <= by + bh; }
void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id == CHARTEVENT_OBJECT_CLICK)
     {
      if(sparam == "RFXS_h") { gPanelOpen = !gPanelOpen; DrawCompact(); NoSelect("RFXS_"); DrawDirBox(); ChartRedraw(); return; }
      if(sparam == "RFXV2_dh") { gDirOpen = !gDirOpen; DrawDirBox(); ChartRedraw(); return; }
      if(StringFind(sparam, "RFXV2_d") == 0) return;                                        // a click inside the Direction box keeps the click box open
      if(sparam == "RFXP2_x") { HidePop(); return; }
      if(StringFind(sparam, "RFXP2_r") == 0 && V2PopToggle(sparam)) return;              // v2: a section header folds / unfolds it
      if(StringFind(sparam, "RFXV2_P") == 0) return;                                      // v2 alternative plan lines keep the box open
      if(StringFind(sparam, "RFXP2_") == 0 || StringFind(sparam, "RFXS_") == 0) return;   // a click inside the box / panel keeps the box open
      for(int i = 0; i < ArraySize(zKey); i++)
         if(sparam == zKey[i] || sparam == zKey[i] + "n" || sparam == zKey[i] + "p" || sparam == zKey[i] + "d" || sparam == V2TagName(i)) { ShowPop(i, (int)lparam, (int)dparam); return; }
      HidePop();
      return;
     }
   if(id == CHARTEVENT_CLICK && GetTickCount() - popAt > 300)                // a click on empty chart closes it
     {
      int x = (int)lparam, y = (int)dparam;
      if(Inside(x, y, gPopX, gPopY, gPopW, gPopH) || Inside(x, y, gPanX, gPanY, gPanW, gPanH) || Inside(x, y, gDbX, gDbY, gDbW, gDbH)) return;
      HidePop();
      return;
     }
   if(id == CHARTEVENT_CHART_CHANGE && InpCompactPanel && InpPanelRight && (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS) != gChartW)  // resized: keep the panel in the corner
     { DrawCompact(); NoSelect("RFXS_"); DrawDirBox(); ChartRedraw(); }
   if(id == CHARTEVENT_CHART_CHANGE && InpAutoTheme && InpTheme == 0 && BgIsDark() != gDark)  // chart colours changed: redraw in the new theme
     {
      ApplyTheme(); HidePop();
      if(lastDraw > 0) Redraw();
     }
  }

//+------------------------------------------------------------------+
//| OnCalculate: full redraw once per new candle (as the MQ4)        |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[],
                const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[])
  {
   static datetime lastPanel = 0;
   static datetime lastNotes = 0;
   static datetime lastCal = 0;
   if(gRs) { RsRun(); if(!InpResearchDraw) return rates_total; }   // research pass first; it restores everything the drawing uses
   if(TimeLocal() - lastCal >= 60) { lastCal = TimeLocal(); if(CalCheck() && lastDraw > 0) lastDraw = 0; }   // v2: calibration file changed -> full redraw
   bool htfNew = InpRedrawOnHTF && lastDraw > 0 && HtfChanged();
   if(cT(0) == lastDraw && prev_calculated > 0 && !htfNew)
     {
      if(TimeLocal() - lastPanel >= 5) { lastPanel = TimeLocal(); Panel(); NoSelect(PFX); NoSelect("RFXS_"); DrawDirBox(); }   // light refresh between candles
      if(InpShowBotOrders && TimeLocal() - lastNotes >= 20) { lastNotes = TimeLocal(); BotNotes(); }   // bot notes file read every 20s
      CheckTouch();
      V2CheckAlerts();
      return rates_total;
     }
   if(!DataReady() && gTries < 30) { gTries++; return 0; }    // MT5 still loading the HTF history / ATR: try again next tick
   gTries = 0;
   Redraw();
   CheckTouch();
   V2CheckAlerts();
   return rates_total;
  }
void CopyHtfLine(ENUM_TIMEFRAMES h)
  {
   gHTF = h; gHUpOn = gUpOn; gHUpS = gUpS; gHUpP = gUpP; gHUpW = gUpW; gHUpB = gUpB; gHDnOn = gDnOn; gHDnS = gDnS; gHDnP = gDnP; gHDnW = gDnW; gHDnB = gDnB;
   RjA_HUpT = RjA_UpT; RjA_HDnT = RjA_DnT;                            // Raja v2.1 (A) line touches
  }
void Redraw()
  {
   lastDraw = cT(0);
   AtrReset();
   for(int k = 0; k < aN; k++) aB0[k] = iTime(_Symbol, aTf[k], 0);
   ObjectsDeleteAll(0, PFX);
   ClearReg();
   { ENUM_TIMEFRAMES h0 = HtfOf(CTF); gTrend = h0 > 0 ? HtfTrend(_Symbol, h0) : 0; }
   Detect(_Symbol, CTF, Z, true);
   gHTF = PERIOD_CURRENT; gHUpOn = false; gHDnOn = false; gHBias = 0; gHBiasTxt = "";
   { ENUM_TIMEFRAMES h = HtfOf(CTF);                                  // HTF lines first, shown on this chart for precision
     // the higher timeframes above this chart (e.g. M15 -> H1, H4, D1): thin dotted gold, for multi-timeframe analysis
     if(InpShowHTFLines)
        for(int lv = InpHTFLevels; lv >= 1; lv--)
          {
           ENUM_TIMEFRAMES t = StepUp(CTF, lv);
           if(t <= 0) continue;
           gTF = t; Trendlines(_Symbol, t);
           if(t == h) { TLBias(); CopyHtfLine(h); }
          }
     if(h > 0 && gHTF == 0) { gTF = h; Trendlines(_Symbol, h); TLBias(); CopyHtfLine(h); } }
   if(InpTLBias && gHBias != 0) gTrend = gHBias;                    // a broken HTF trendline sets the bias (the newest break wins)
   gTF = CTF;
   Trendlines(_Symbol, CTF);                                         // this chart: chain + channel use it; drawn only if InpShowTrendlines
   DedupeTL();
   Qualify();
   DirRun();                                                         // v2 Direction engine: reads the v1 results, draws nothing itself
   if(InpBiasSource == 1 && gDirOk) gTrend = gDir;                   // off by default: v1 gTrend drives the zone notes
   if(InpShowHTF) { ENUM_TIMEFRAMES h = HtfOf(CTF); if(h > 0) { Detect(_Symbol, h, HZ, false); DrawZones(HZ, true); } }   // HTF band first, underneath
   V2MergePrepare();                                                 // v2 merge overlap (off by default: nothing hidden)
   DrawZones(Z, false);
   V2Zones();                                                        // v2: DNA + lenses for the drawn zones, compact tags (RFXV2_t / RFXV2_m only)
   if(InpShowEmotional) MarkEmotional();
   if(InpShowPanel || InpShowPlan) Panel();
   if(InpShowBotOrders) BotNotes();
   NoSelect(PFX); NoSelect("RFXN_"); NoSelect("RFXS_");
   DrawV2Lines();                                                    // v2: curve lines / WOW ladder (RFXV2_ objects only)
   DrawDirBox();
   if(gDirOk && InpAlertDir) DirAlert();
   V2BreakAlerts();
   V2WowAlert();
   if(InpExportGV) V2ExportGV();                                     // v2 M10: ZoneBot export (off by default)
   gArmed = true;
   ChartRedraw();
   if(InpDumpObjects) DumpObjects();                                 // v2 M0 golden master (off by default)
  }

// Emotional candle: range > InpEmoATR x ATR(14). Usually news or a stop run. Its wick is
// ignored for zone removal (only a body close or a normal wick removes a zone).
void MarkEmotional()
  {
   int bars = MathMin(InpLookback, cBars() - 16);
   for(int i = 1; i < bars; i++)
     {
      if(!Emotional(_Symbol, CTF, i)) continue;
      double a = ATR(CTF, i + 1), x = (cH(i) - cL(i)) / MathMax(a, _Point);
      bool up = cC(i) >= cO(i);
      string nm = PFX + "emo" + IntegerToString(i);
      ObjectCreate(0, nm, OBJ_ARROW, 0, cT(i), up ? cH(i) : cL(i));
      ObjectSetInteger(0, nm, OBJPROP_ARROWCODE, 171);
      ObjectSetInteger(0, nm, OBJPROP_ANCHOR, up ? ANCHOR_BOTTOM : ANCHOR_TOP);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, InpEmoColor);
      ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, StringFormat("Emotional candle: %.1f x ATR. Often news or a stop run. Its wick does not remove a zone - only a body close beyond the distal does.", x));
     }
  }

//+------------------------------------------------------------------+
//| Helpers                                                          |
//+------------------------------------------------------------------+
// show an object only on its own timeframe and lower ones (lower-timeframe lines never clutter higher charts)
long VisUpTo(ENUM_TIMEFRAMES tf)
  {
   ENUM_TIMEFRAMES p[21] = {PERIOD_M1, PERIOD_M2, PERIOD_M3, PERIOD_M4, PERIOD_M5, PERIOD_M6, PERIOD_M10, PERIOD_M12, PERIOD_M15, PERIOD_M20, PERIOD_M30,
                            PERIOD_H1, PERIOD_H2, PERIOD_H3, PERIOD_H4, PERIOD_H6, PERIOD_H8, PERIOD_H12, PERIOD_D1, PERIOD_W1, PERIOD_MN1};
   long f[21] = {OBJ_PERIOD_M1, OBJ_PERIOD_M2, OBJ_PERIOD_M3, OBJ_PERIOD_M4, OBJ_PERIOD_M5, OBJ_PERIOD_M6, OBJ_PERIOD_M10, OBJ_PERIOD_M12, OBJ_PERIOD_M15, OBJ_PERIOD_M20, OBJ_PERIOD_M30,
                 OBJ_PERIOD_H1, OBJ_PERIOD_H2, OBJ_PERIOD_H3, OBJ_PERIOD_H4, OBJ_PERIOD_H6, OBJ_PERIOD_H8, OBJ_PERIOD_H12, OBJ_PERIOD_D1, OBJ_PERIOD_W1, OBJ_PERIOD_MN1};
   long m = 0; for(int i = 0; i < 21; i++) if(p[i] <= tf) m |= f[i];
   return m;
  }
// StepUp, HtfOf, TfName, Rng, Body, Basing, CDir, Emotional, BarTime: moved to RFX_ZoneCore.mqh (v2 M1)

// Zone detection (Reject, SwingAt, FindTrap, Detect), trendlines (ZigZag ... Trendlines, DedupeTL, RefineOnChart),
// CrossNeeded, TLBias, NearTrendline, Overextended, StructureNow, Qualify: moved to RFX_ZoneCore.mqh (v2 M1)

//+------------------------------------------------------------------+
//| Drawing                                                          |
//+------------------------------------------------------------------+
void Txt(string nm, datetime t, double p, string txt, color c, int size, int anchor)
  {
   ObjectCreate(0, nm, OBJ_TEXT, 0, t, p);
   ObjectSetString(0, nm, OBJPROP_TEXT, txt);
   ObjectSetString(0, nm, OBJPROP_FONT, "Arial");
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, anchor);
  }
void HLine(string nm, datetime t1, datetime t2, double p, color c, int style, int width)
  {
   ObjectCreate(0, nm, OBJ_TREND, 0, t1, p, t2, p);
   ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, c); ObjectSetInteger(0, nm, OBJPROP_STYLE, style); ObjectSetInteger(0, nm, OBJPROP_WIDTH, width);
  }

// ZoneName, PriceTag, TooSmall, MetalOrOil, Push, NoteHelp, ZoneNotes, DrawZones: moved to RFX_ZoneCore.mqh (v2 M1)

// Explain mode: the 4 parts on one zone only.
void Explain(Zone &z)
  {
   string id = PFX + "ex"; color c = cText;
   double off = MathAbs(z.prox - z.dist) * 0.6;
   Txt(id + "b", cT(z.legBar + 1), z.dir > 0 ? z.dist - off : z.dist + off, StringFormat("1 base x%d", z.baseN), c, 7, z.dir > 0 ? ANCHOR_UPPER : ANCHOR_LOWER);
   Txt(id + "m", cT(z.legBar), z.dir > 0 ? cH(z.legBar) : cL(z.legBar), StringFormat("2 move away %.1fx", z.legRatio), c, 7, z.dir > 0 ? ANCHOR_LOWER : ANCHOR_UPPER);
   double saEdge = z.dir > 0 ? cL(z.saBar) : cH(z.saBar);
   Txt(id + "s", cT(z.saBar), z.dir > 0 ? cH(z.saBar) : cL(z.saBar), "3 stay away", c, 7, z.dir > 0 ? ANCHOR_LOWER : ANCHOR_UPPER);
   ObjectCreate(0, id + "g", OBJ_TREND, 0, cT(z.saBar), saEdge, cT(z.saBar), z.prox);
   ObjectSetInteger(0, id + "g", OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, id + "g", OBJPROP_COLOR, clrGoldenrod); ObjectSetInteger(0, id + "g", OBJPROP_WIDTH, 2);
   Txt(id + "gs", cT(z.saBar), (saEdge + z.prox) / 2, "  4 space", clrGoldenrod, 7, ANCHOR_LEFT);
  }

// FracUp, FracDn, HtfTrend, Curve: moved to RFX_ZoneCore.mqh (v2 M1)

//+------------------------------------------------------------------+
//| Panel + the setup the bot would take now (same logic as Scan)    |
//+------------------------------------------------------------------+
void Panel()
  {
   ENUM_TIMEFRAMES htf = HtfOf(CTF);
   int trend = gTrend;
   double spread = SAsk() - SBid();
   string L = StringFormat("ZoneVision  %s %s  ->  bias from %s\n", _Symbol, TfName(CTF), htf > 0 ? TfName(htf) : "-");
   L += "Bias: " + (trend > 0 ? "UP - buys only" : (trend < 0 ? "DOWN - sells only" : "unclear - bot waits")) + "\n";
   L += "Structure: " + StructureNow() + "\n";
   if(InpShowLegend) L += "Key: VP = valley/peak (reversal), CP = continuation, clear space = gap under the stay-away candle,\n      ATR = average candle size, HTF = higher timeframe, x = deal-breaker, - = weakness, + = strength\n";
   if(gHBiasTxt != "") L += "Trendline bias: " + (gHBias > 0 ? "UP - " : "DOWN - ") + gHBiasTxt + "\n";
   { double mid = Mid();
     if(Overextended(1, mid)) L += "Up channel: price beyond 50% = OVEREXTENDED - no buys, wait for the golden area\n";
     else if(gUpOn) L += "Up channel: price in the golden area (line to 50%)\n";
     if(Overextended(-1, mid)) L += "Down channel: price beyond 50% = OVEREXTENDED - no sells, wait for the golden area\n";
     else if(gDnOn) L += "Down channel: price in the golden area (line to 50%)\n"; }

   string plan = "Bot: no trade setup";
   for(int i = ArraySize(Z) - 1; i >= 0; i--)
     {
      if(Z[i].removed || Z[i].tested || !Z[i].cont) continue;
      if(InpOnlyQualified && !Z[i].chain) continue;
      if(Z[i].gap < InpMinGap || TooSmall(Z, i)) continue;
      if(Overextended(Z[i].dir, Z[i].prox)) continue;                // Kevin: buy only in the golden area (line to 50%)
      if(Z[i].legBar > InpMaxZoneAge) break;
      int dir = Z[i].dir;
      double opp = 0;
      for(int j = 0; j < ArraySize(Z); j++)
        {
         if(Z[j].dir == dir || Z[j].removed || Z[j].tested) continue;
         if(dir > 0 && Z[j].prox > Z[i].prox && (opp == 0 || Z[j].prox < opp)) opp = Z[j].prox;
         if(dir < 0 && Z[j].prox < Z[i].prox && (opp == 0 || Z[j].prox > opp)) opp = Z[j].prox;
        }
      double entry = dir > 0 ? Z[i].prox + spread : Z[i].prox;
      double buf = InpStopBufferPts * _Point * (MetalOrOil() ? InpMetalOilStop : 1.0);
      double sl = dir > 0 ? Z[i].dist - buf : Z[i].dist + buf + spread;
      double tp = opp > 0 ? (dir > 0 ? opp - spread : opp + spread) : 0;
      double rr = tp > 0 ? MathAbs(tp - entry) / MathMax(MathAbs(entry - sl), _Point) : 0;
      string why = "";
      if(trend == 0) why = "HTF bias unclear";
      else if(trend != dir) why = "against HTF bias";
      else if(tp == 0) why = "no opposing zone for a target";
      else if(rr < InpMinRR) why = StringFormat("R:R %.1f below %.1f", rr, InpMinRR);
      ENUM_TIMEFRAMES dtf = htf > 0 ? htf : CTF;
      double hatr = ATR(dtf, 1), far = MathAbs(Mid() - Z[i].prox), xatr = far / MathMax(hatr, _Point);
      string dline = StringFormat("Distance: %.1f x %s ATR (%s away, ATR %s)", xatr, TfName(dtf), DoubleToString(far, _Digits), DoubleToString(hatr, _Digits));
      if(why == "" && xatr > InpMaxDistATR)
        {
         static double hwProx = 0, hwHalf = 0;                         // halfway is fixed when the zone first shows as far
         if(MathAbs(hwProx - Z[i].prox) > _Point) { hwProx = Z[i].prox; hwHalf = (Mid() + Z[i].prox) / 2; }
         double half = hwHalf;
         dline += StringFormat(" - FAR: needs ~%d %s candles one way, price often turns first. Planned only; alert at halfway %s", (int)MathCeil(xatr), TfName(dtf), DoubleToString(half, _Digits));
         datetime h1 = cT(0), h2 = cT(0) + PeriodSeconds() * 18;
         HLine(PFX + "hw", h1, h2, half, clrGoldenrod, STYLE_DOT, 1); Txt(PFX + "hwt", h2, half, StringFormat(" halfway alert (zone %.1fx ATR away)", xatr), clrGoldenrod, 7, ANCHOR_LEFT);
         ObjectSetString(0, PFX + "hw", OBJPROP_TOOLTIP, dline);
         static double alertedHalf = 0;
         double bid = SBid();
         if(InpHalfwayAlert && MathAbs(alertedHalf - half) > 10 * _Point && ((dir < 0 && bid >= half) || (dir > 0 && bid <= half)) && V2HalfwayOk(i))
           { alertedHalf = half; Notify("ZoneVision " + _Symbol + " " + TfName(CTF) + ": halfway to the " + (dir > 0 ? "demand " : "supply ") + DoubleToString(Z[i].prox, _Digits) + " - check for a new lower-timeframe zone in the chain"); }
        }
      else if(why == "") dline += " - within reach";
      L += dline + "\n";
      if(why == "")
         plan = StringFormat("Bot: %s %s  SL %s  TP %s  (1:%.1f, %s %s%s)", dir > 0 ? "BUY limit" : "SELL limit", DoubleToString(entry, _Digits), DoubleToString(sl, _Digits), DoubleToString(tp, _Digits), rr, dir > 0 ? "RBR" : "DBD", Z[i].grade, Z[i].trap > 0 ? " + trap" : "");
      else
         plan = StringFormat("Bot: watching %s at %s - no trade: %s", dir > 0 ? "demand" : "supply", DoubleToString(Z[i].prox, _Digits), why);
      if(InpShowPlan && why == "")
        {
         datetime t1 = cT(0) + PeriodSeconds() * 2, t2 = cT(0) + PeriodSeconds() * 18;
         HLine(PFX + "pe", t1, t2, entry, cPlanEntry, STYLE_SOLID, 2); Txt(PFX + "pet", t2, entry, " entry", cPlanEntry, 7, ANCHOR_LEFT);
         HLine(PFX + "ps", t1, t2, sl, cSupplyLine, STYLE_DOT, 1);    Txt(PFX + "pst", t2, sl, " SL", cSupplyLine, 7, ANCHOR_LEFT);
         HLine(PFX + "pt", t1, t2, tp, cDemandLine, STYLE_DOT, 1);    Txt(PFX + "ptt", t2, tp, " TP", cDemandLine, 7, ANCHOR_LEFT);
        }
      if(InpExplain) Explain(Z[i]);
      break;
     }
   L += plan;
   // bias arrow near the latest price
   ObjectDelete(0, PFX + "bias");
   if(trend != 0)
     {
      int hi = iHighest(_Symbol, CTF, MODE_HIGH, 30, 0), lo = iLowest(_Symbol, CTF, MODE_LOW, 30, 0);
      double y = trend > 0 ? cH(hi) : cL(lo);
      ObjectCreate(0, PFX + "bias", OBJ_ARROW, 0, cT(0) + PeriodSeconds() * 8, y);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_ARROWCODE, trend > 0 ? 233 : 234);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_COLOR, trend > 0 ? cDemandLine : cSupplyLine);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_WIDTH, 3);
      ObjectSetString(0, PFX + "bias", OBJPROP_TOOLTIP, "HTF bias " + (trend > 0 ? "up" : "down"));
     }
   gPanL = L; gPanPlan = plan;
   if(InpShowPanel)
     {
      if(InpCompactPanel) { Comment(""); DrawCompact(); }
      else Comment(L + DirComment());
     }
  }

//+------------------------------------------------------------------+
//| MT5 compact panel (top-left, click the header to collapse)       |
//+------------------------------------------------------------------+
void SRow(string t, color c) { int n = ArraySize(sR); ArrayResize(sR, n + 1); ArrayResize(sC, n + 1); sR[n] = t; sC[n] = c; }
void DrawCompact()
  {
   ObjectsDeleteAll(0, "RFXS_");
   gPanW = 0; gPanH = 0;
   if(!InpShowPanel || !InpCompactPanel) return;
   ArrayResize(sR, 0); ArrayResize(sC, 0);
   ENUM_TIMEFRAMES htf = HtfOf(CTF), dtf = htf > 0 ? htf : CTF;
   double hatr = MathMax(ATR(dtf, 1), _Point), mid = Mid();
   string head = StringFormat("ZoneVision  %s %s   %s", _Symbol, TfName(CTF), gPanelOpen ? "[-]" : "[+]");
   if(gPanelOpen)
     {
      string bias = gTrend > 0 ? "UP - buys only" : (gTrend < 0 ? "DOWN - sells only" : "unclear - bot waits");
      string why = gTrend == 0 ? "no clear HTF structure" : ((InpTLBias && gHBias != 0 && gHBias == gTrend) ? gHBiasTxt : (htf > 0 ? TfName(htf) + " swing highs / lows" : "-"));
      SRow("Bias: " + bias, gTrend > 0 ? cDemandLine : (gTrend < 0 ? cSupplyLine : cPopFg));
      SRow("   why: " + why, cPopFg);
      SRow("Structure: " + StructureNow(), cPopFg);
      int bd = -1, bs = -1, act = 0, fr = 0;
      for(int k = 0; k < ArraySize(zKey); k++)
        {
         if(zState[k] == "removed") continue;
         act++; if(zState[k] == "fresh") fr++;
         if(zVer[k] != "STRONG") continue;
         if(zDir[k] > 0 && (bd < 0 || MathAbs(mid - zProx[k]) < MathAbs(mid - zProx[bd]))) bd = k;
         if(zDir[k] < 0 && (bs < 0 || MathAbs(mid - zProx[k]) < MathAbs(mid - zProx[bs]))) bs = k;
        }
      SRow(bd >= 0 ? StringFormat("Strong demand: %s  (%.1f x %s ATR)", DoubleToString(zProx[bd], _Digits), MathAbs(mid - zProx[bd]) / hatr, TfName(dtf)) : "Strong demand: none in view", bd >= 0 ? cDemandLine : cPopFg);
      SRow(bs >= 0 ? StringFormat("Strong supply: %s  (%.1f x %s ATR)", DoubleToString(zProx[bs], _Digits), MathAbs(mid - zProx[bs]) / hatr, TfName(dtf)) : "Strong supply: none in view", bs >= 0 ? cSupplyLine : cPopFg);
      SRow(StringFormat("Zones in view: %d  (fresh %d)", act, fr), cPopFg);
      if(Overextended(1, mid)) SRow("Up channel OVEREXTENDED - no buys, wait", cBad);
      if(Overextended(-1, mid)) SRow("Down channel OVEREXTENDED - no sells, wait", cBad);
      SRow(gPanPlan, StringFind(gPanPlan, "limit") >= 0 ? cPlanEntry : cPopHead);
     }
   int rows = ArraySize(sR), w = StringLen(head);
   for(int i = 0; i < rows; i++) w = MathMax(w, StringLen(sR[i]));
   int bw = MathMax(w * 6 + 22, StringLen(head) * 7 + 22), x0 = PanelX(bw), y0 = 22, bh = 22 + 14 * rows + (rows > 0 ? 6 : 0);
   string tip = gPanL; if(StringLen(tip) > 900) tip = StringSubstr(tip, 0, 895) + "...";
   Box("RFXS_bg", x0, y0, bw, bh, cPopBg, cPopBorder); SeeThru("RFXS_bg");
   ObjectSetString(0, "RFXS_bg", OBJPROP_TOOLTIP, tip);
   Lbl("RFXS_h", x0 + 8, y0 + 4, head, gTrend > 0 ? cDemandLine : (gTrend < 0 ? cSupplyLine : cPopHead), "Arial Bold", 9);
   ObjectSetString(0, "RFXS_h", OBJPROP_TOOLTIP, "Click to collapse / expand. Full panel:\n" + tip);
   ObjectSetInteger(0, "RFXS_h", OBJPROP_ZORDER, 10);
   for(int i = 0; i < rows; i++)
     {
      Lbl("RFXS_" + IntegerToString(i), x0 + 8, y0 + 22 + 14 * i, sR[i], sC[i], "Arial", 8);
      ObjectSetString(0, "RFXS_" + IntegerToString(i), OBJPROP_TOOLTIP, tip);
     }
   NoSelect("RFXS_");
   gPanX = x0; gPanY = y0; gPanW = bw; gPanH = bh;
  }

//+------------------------------------------------------------------+
//| v2 Direction display: box under the compact panel (RFXV2_d*),    |
//| Comment lines, click-box section, curve lines, WOW ladder, alert |
//+------------------------------------------------------------------+
void DAdd(string &a[], color &c[], string t, color k) { int n = ArraySize(a); ArrayResize(a, n + 1); ArrayResize(c, n + 1); a[n] = t; c[n] = k; }
color DirSideColor(int d) { return d > 0 ? cDemandLine : (d < 0 ? cSupplyLine : cPopFg); }
color WowColor() { return cWow; }
void DrawDirBox()
  {
   ObjectsDeleteAll(0, "RFXV2_d");
   gDbX = 0; gDbY = 0; gDbW = 0; gDbH = 0;
   if(!InpShowDirPanel || !gDirOk || !InpCompactPanel) return;
   string rw[]; color rc[];
   if(gDirOpen)
     {
      for(int r = 0; r < drN; r++) DAdd(rw, rc, DirRowLine(r), drRow[r].ok ? DirSideColor(DirRowSide(r)) : cMuted);
      for(int k = 0; k < 4; k++) if(gDirTxt[k] != "") DAdd(rw, rc, gDirTxt[k], cPopFg);
      for(int k = 0; k < gWowN; k++) DAdd(rw, rc, gWowTxt[k], WowColor());
     }
   int n = ArraySize(rw);
   string head = gDirHead + (gDirOpen ? "   [-]" : "   [+]");
   int bw = StringLen(head) * 7 + 22;
   for(int i = 0; i < n; i++) bw = MathMax(bw, StringLen(rw[i]) * 6 + 22);
   int x0 = PanelX(bw), y0 = gPanW > 0 ? gPanY + gPanH + 4 : 22, bh = 22 + 14 * n + (n > 0 ? 6 : 0);
   string tip = "Top-down Direction (display only; the zone notes still use the v1 bias unless InpBiasSource = 1). Click the header to collapse / expand.";
   Box("RFXV2_dbg", x0, y0, bw, bh, cPopBg, cPopBorder); SeeThru("RFXV2_dbg");
   ObjectSetString(0, "RFXV2_dbg", OBJPROP_TOOLTIP, tip);
   Lbl("RFXV2_dh", x0 + 8, y0 + 4, head, gDir > 0 ? cDemandLine : (gDir < 0 ? cSupplyLine : cPopHead), "Arial Bold", 9);
   ObjectSetString(0, "RFXV2_dh", OBJPROP_TOOLTIP, tip);
   ObjectSetInteger(0, "RFXV2_dh", OBJPROP_ZORDER, 10);
   for(int i = 0; i < n; i++)
     {
      string nm = "RFXV2_dr" + IntegerToString(i);
      Lbl(nm, x0 + 8, y0 + 22 + 14 * i, rw[i], rc[i], "Arial", 8);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
     }
   NoSelect("RFXV2_d");
   gDbX = x0; gDbY = y0; gDbW = bw; gDbH = bh;
  }
// InpCompactPanel = false: the Direction lines follow v1's Comment after a blank line
string DirComment()
  {
   if(!InpShowDirPanel || !gDirOk) return "";
   string t = "\n\n" + gDirHead + "\n";
   for(int r = 0; r < drN; r++) t += DirRowLine(r) + "\n";
   for(int k = 0; k < 4; k++) if(gDirTxt[k] != "") t += gDirTxt[k] + "\n";
   for(int k = 0; k < gWowN; k++) t += gWowTxt[k] + "\n";
   return t;
  }
// click box: DIRECTION section (states, the side this zone needs, curve at the zone, HTF-zone side lock)
void DirPopRows(int zd, double zp, int wr)
  {
   if(!V2Hdr("DIRECTION")) return;
   string st = "";
   for(int r = 0; r < drN; r++) st += (st == "" ? "" : " | ") + drRow[r].role + " " + DirTfName(drRow[r].tf) + " " + DirStateName(drRow[r].st, drRow[r].side);
   PWrap(st, cPopFg, wr);
   string v = "";
   color c = cPopFg;
   if(gDirBlocked == zd) { v = "BLOCKED (" + (zd > 0 ? "high curve: sells only" : "low curve: buys only") + ")"; c = cBad; }
   else if(gDirSide == zd)
     {
      v = gDirQ == 2 ? "with direction - FULL" : (gDirQ == 1 ? "with direction - REDUCED" : (gDirRealign ? "with direction - WAIT, ITF realigning" : "with direction - WAIT"));
      c = gDirQ > 0 ? cGood : cPopFg;
     }
   else if(gDirSide == -zd) { v = "against the direction: counter-trend (REDUCED at best, only at a fresh HTF level)"; c = cBad; }
   else v = "no direction yet: WAIT";
   PWrap("This " + (zd > 0 ? "demand" : "supply") + " needs " + (zd > 0 ? "LONG" : "SHORT") + ": " + v, c, wr);
   if(gCurveOk)
     {
      double cz = DirCurveAt(zp);
      bool wrong = (zd > 0 && cz >= InpCurveHigh) || (zd < 0 && cz <= InpCurveLow);
      PWrap(StringFormat("Curve at the zone: %.0f%% (%s)%s", cz, DirCurveWord(cz), gCurveRaja ? "" : " - v1 range curve"), wrong ? cBad : cPopFg, wr);
     }
   if(gLockSide != 0)
      PWrap(StringFormat("Price inside %s %s %s-%s: %s only", DirTfName(gLockTF), gLockSide > 0 ? "demand" : "supply", DoubleToString(gLockLo, _Digits), DoubleToString(gLockHi, _Digits), gLockSide > 0 ? "buys" : "sells"), gLockSide == zd ? cGood : cBad, wr);
  }
// Raja curve lines (25 / 50 / 75 between the HTF strong zones) and the WOW ladder
void DrawV2Lines()
  {
   ObjectsDeleteAll(0, "RFXV2_c"); ObjectsDeleteAll(0, "RFXV2_W");
   if(!gDirOk) return;
   datetime t1 = cT(MathMin(80, cBars() - 1)), t2 = cT(0) + PeriodSeconds() * 18;
   if(InpCurveLines && gCurveRaja)
     {
      color cc = cCurve;
      for(int k = 1; k <= 3; k++)
        {
         double lv = gCurvePd + (gCurvePs - gCurvePd) * k / 4.0;
         string nm = "RFXV2_c" + IntegerToString(k * 25);
         HLine(nm, t1, t2, lv, cc, STYLE_DOT, 1);
         ObjectSetInteger(0, nm, OBJPROP_BACK, true);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, StringFormat("Raja curve %d%%: %s demand proximal %s to supply proximal %s. Up to %.0f%% = low curve (buys only), from %.0f%% = high curve (sells only).",
                         k * 25, DirTfName(drRow[drH].tf), DoubleToString(gCurvePd, _Digits), DoubleToString(gCurvePs, _Digits), InpCurveLow, InpCurveHigh));
         Txt(nm + "t", t2, lv, StringFormat(" %s curve %d%%", DirTfName(drRow[drH].tf), k * 25), cc, 7, ANCHOR_LEFT);
        }
     }
   if(InpShowWOW)
      for(int k = 0; k < gWowN; k++)
        {
         if(gWowPx[k] <= 0) continue;
         string nm = "RFXV2_W" + IntegerToString(k);
         HLine(nm, cT(0), t2, gWowPx[k], WowColor(), STYLE_DASHDOT, 1);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, gWowTxt[k] + " | Raja WOW ladder: origin zone of a broken trendline");
         Txt(nm + "t", t2, gWowPx[k], " " + gWowTxt[k], WowColor(), 7, ANCHOR_LEFT);
        }
   NoSelect("RFXV2_");
  }
// one alert when the Direction or its quality changes (nothing that was true at load)
void DirAlert()
  {
   static int prevDir = -99, prevQ = -99;
   if(prevDir == -99) { prevDir = gDir; prevQ = gDirQ; return; }
   if(gDir == prevDir && gDirQ == prevQ) return;
   prevDir = gDir; prevQ = gDirQ;
   if(!gArmed) return;
   string key = "D" + IntegerToString(gDir) + "_" + IntegerToString(gDirQ) + "_" + IntegerToString((long)cT(1));
   if(Alerted(key)) return;
   MarkAlerted(key);
   Notify("ZoneVision " + _Symbol + " " + TfName(CTF) + ": " + gDirHead + (gDirTxt[0] != "" ? " | " + gDirTxt[0] : ""));
  }

//+------------------------------------------------------------------+
//| v2 zones: DNA + mentor lenses for every drawn zone (computed in  |
//| the core), the compact tag RFXV2_t<zone> at the proximal, merge  |
//| lines RFXV2_m, click-box sections (Mentors / DNA / History /     |
//| Plans, fold by clicking the header), alternative plan lines      |
//| RFXV2_P, and the v2 alerts with their filters. Only RFXV2_       |
//| objects are created; no v1 object is moved or changed.           |
//+------------------------------------------------------------------+
string V2Sep() { return InpAsciiTags ? " | " : " " + ShortToString((ushort)0x00B7) + " "; }
string V2KMark(bool pass) { if(InpAsciiTags) return pass ? "K+" : "K-"; return "K" + ShortToString((ushort)(pass ? 0x2713 : 0x2717)); }
string V2TagName(int k) { if(k < 0 || k >= ArraySize(zKey)) return ""; return "RFXV2_t" + StringSubstr(zKey[k], StringLen(PFX)); }
string V2YN(bool v) { return v ? "yes" : "no"; }
string V2Px(double p) { return DoubleToString(p, _Digits); }
string V2Room(double r) { return r >= 99 ? "open" : StringFormat("%.1fR", r); }
color  V2VerdictColor(int v) { return v == 4 ? cVAplus : (v == 3 ? cVA : (v == 2 ? cVB : cMuted)); }
// entry mode words: K / S (1 limit, 2 confirm), R (1 set&forget, 2 confirm), B (2 pullback + rejection, 3 deep entry); 0 = none
string V2Em(string lens, int em)
  {
   if(em == 0) return lens == "R" ? "skip" : "no trade";
   if(lens == "R") return em == 1 ? "set&forget" : "confirm";
   if(lens == "B") return em == 3 ? "deep entry" : "pullback + rejection candle";
   return em == 1 ? "limit" : "confirm";
  }
string V2WeakTxt(ZoneDNA &x)
  {
   string w = "";
   if(x.overlap) w += " overlap";
   if(x.inherit) w += " inherit";
   if(x.flip) w += " flip";
   if(x.outTl) w += " out-of-trendline";
   return w == "" ? "" : " (weak flags:" + w + ")";
  }
string V2DirShort()
  {
   if(!gDirOk) return "";
   if(gDir == 0) return "DIR WAIT";
   return "DIR " + (gDir > 0 ? "LONG" : "SHORT") + (gDirQ == 2 ? " FULL" : " REDUCED");
  }
// calibration part of the tag / alert text: "3R 64% n212" (cell), "C78 prior 3R +0.21R" (consensus-bin prior), "" = none
string V2CalTag(int k)
  {
   if(!InpShowHist || !gCalOk || k < 0 || k >= ArraySize(zCal) || !zCal[k].ok) return "";
   if(zCal[k].prior) return StringFormat("C%.0f prior %s %sR", k < ArraySize(zLens) && zLens[k].ok ? zLens[k].cons : 0.0, CalT(zCal[k].bestT), CalSg(zCal[k].bestE));
   int t = (InpCalTarget >= 1 && InpCalTarget <= 5) ? InpCalTarget : zCal[k].bestT;
   return StringFormat("%s %.0f%% n%d", CalT(t), 100.0 * CalP(zCal[k], t), zCal[k].n);
  }
string V2TagText(int k)
  {
   if(k < 0 || k >= ArraySize(zDna) || !zDna[k].ok) return "";
   string sep = V2Sep(), t = "", ex = "";
   if(InpLensTag && zLens[k].ok)
      t = zLens[k].verdict + sep + V2KMark(zLens[k].passK) + StringFormat(" S%d R:%s B%d", zLens[k].scoreS, zDna[k].rajaType, zLens[k].scoreB) + sep
          + (V2CalTag(k) != "" ? V2CalTag(k) : StringFormat("C%.0f", zLens[k].cons));   // with RFX_Calib.csv: "3R 64% n212" instead of the consensus
   if(InpShowNested)
     {
      if(zDna[k].nested) ex += "in " + TfName(zDna[k].nestTf) + (zDna[k].d > 0 ? " D" : " S");
      if(zDna[k].inOppHtf) ex += (ex == "" ? "" : " ") + "in " + TfName(zDna[k].oppHtfTf) + (zDna[k].d > 0 ? " S!" : " D!");
     }
   if(InpShowSize) ex += (ex == "" ? "" : " ") + StringFormat("%.1fp %.1fATR", zDna[k].heightPips, zDna[k].heightAtr);
   if(InpShowRunOut) ex += (ex == "" ? "" : " ") + StringFormat("run %.1fh", zDna[k].runoutH);
   if(InpShowDepth && zDna[k].nTests > 0) ex += (ex == "" ? "" : " ") + StringFormat("T%d %.0f%%", zDna[k].nTests, zDna[k].depthMax);
   if(InpRjAShowTested && zDna[k].nTests > 0 && !zDna[k].removed)   // Raja v2.1 (A): tested zone shown inside the touch allowance
      ex += (ex == "" ? "" : " ") + StringFormat("touch %d: needs confirmation", zDna[k].nTests + 1);
   if(InpRjALens8 && zDna[k].rjaDidJob) ex += (ex == "" ? "" : " ") + "did its job";
   if(InpRjANearLine && zDna[k].rjaLineDist > InpRjFarFromLinePips) ex += (ex == "" ? "" : " ") + StringFormat("%.0fp from TL", zDna[k].rjaLineDist);
   if(ex != "") t += (t == "" ? "" : sep) + ex;
   return t;
  }
void V2DrawTag(int k)
  {
   string t = V2TagText(k);
   if(t == "") return;
   string nm = V2TagName(k);
   bool mute = zLens[k].ok && zLens[k].vcode <= 1;                   // X or C
   Txt(nm, zT1[k], zProx[k], t, mute ? cMuted : cTag, 7, zDir[k] > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);   // proximal side, inside the zone
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
   string tip = "v2 mentor lenses";
   if(zLens[k].ok)
      tip = StringFormat("Consensus %.0f -> %s (%d of 4 lenses pass): Kevin %s/%s, Seiden %d/10, Raja %s, Baker %d/10 - click for details",
                         zLens[k].cons, zLens[k].verdict, zLens[k].nPass, zLens[k].kVer, zLens[k].kGrade, zLens[k].scoreS, zDna[k].rajaType, zLens[k].scoreB);
   if(k < ArraySize(zCal) && zCal[k].ok && InpShowHist)
      tip += zCal[k].prior ? StringFormat(" | history: prior (consensus bin %s) best %s E %sR", zCal[k].csBin, CalT(zCal[k].bestT), CalSg(zCal[k].bestE))
                           : StringFormat(" | history: level %d, n %d, best %s E %sR", zCal[k].level, zCal[k].n, CalT(zCal[k].bestT), CalSg(zCal[k].bestE));
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, tip);
  }
// merge overlap mode 1: the merged zone as a thin line inside the zone that was kept
void V2DrawMergeLines()
  {
   if(InpMergeOverlap != 1) return;
   datetime right = cT(0) + PeriodSeconds() * 18;
   for(int m = 0; m < ArraySize(gMgDrop); m++)
     {
      int di = gMgDrop[m], ki = gMgKeep[m];
      if(di < 0 || di >= ArraySize(Z) || ki < 0 || ki >= ArraySize(Z)) continue;
      bool kept = false;
      for(int k = 0; k < ArraySize(zZi); k++) if(zZi[k] == ki) kept = true;
      if(!kept) continue;
      string nm = "RFXV2_m" + IntegerToString(m);
      HLine(nm, iTime(_Symbol, CTF, Z[di].legBar + Z[di].baseN), right, Z[di].prox, Z[di].dir > 0 ? cDemandLine : cSupplyLine, STYLE_DOT, 1);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, StringFormat("Merged %s %s-%s: overlaps the older zone by more than %.0f%% (InpMergeOverlap)", Z[di].dir > 0 ? "demand" : "supply",
                      V2Px(MathMin(Z[di].prox, Z[di].dist)), V2Px(MathMax(Z[di].prox, Z[di].dist)), InpMergeMinPct));
     }
  }
// once per redraw, after DrawZones(Z): DNA + lenses for every registered (drawn) chart zone
void V2Zones()
  {
   static bool warned = false;
   ObjectsDeleteAll(0, "RFXV2_t"); ObjectsDeleteAll(0, "RFXV2_m");
   gV2Ok = false;
   ArrayResize(zCal, ArraySize(zKey));                               // v2 M6: calibrated history per drawn zone
   for(int k = 0; k < ArraySize(zCal); k++) ZeroMemory(zCal[k]);
   if(!InpDNA) return;
   DnaPrepare();
   for(int k = 0; k < ArraySize(zKey); k++)
     {
      int zi = zZi[k];
      if(zi < 0 || zi >= ArraySize(Z)) continue;
      DnaCompute(CTF, Z, zi, zDna[k]);
      if(!zDna[k].ok) continue;
      zDna[k].planRR = zRR[k];
      zDna[k].stopAtr = (zDna[k].A1 > 0 && zEn[k] > 0) ? MathAbs(zEn[k] - zSl[k]) / zDna[k].A1 : 0;
      if(InpLenses)
        {
         LensRun(zDna[k], zVer[k], zGrade[k], zNP[k], zNM[k], zNC[k], zLens[k]);
         if(zLens[k].ok && !zLens[k].kAssert && !warned)                // spec M4: the Kevin lens is the v1 verdict on every zone
           { warned = true; Print("ZoneVision v2: Kevin lens check failed - v1 verdict ", zVer[k], " does not follow the v1 rule on ", zKey[k]); }
        }
      if(gCalOk) CalLookup(zDna[k], zLens[k], zCal[k]);
      if(InpLensTag || InpShowNested || InpShowSize || InpShowRunOut || InpShowDepth) V2DrawTag(k);
     }
   V2DrawMergeLines();
   NoSelect("RFXV2_");
   gV2Ok = true;
  }

//--- click box sections (after v1's sections and DIRECTION)
// a v2 section header: remembered for the fold click; returns true when the section is open
bool V2Hdr(string nm)
  {
   bool open = StringFind(gV2Fold, "|" + nm + "|") < 0;
   int n = ArraySize(gV2HdrRow);
   ArrayResize(gV2HdrRow, n + 1); ArrayResize(gV2HdrKey, n + 1);
   gV2HdrRow[n] = ArraySize(pR); gV2HdrKey[n] = nm;
   PRow(nm + (open ? "   [-]" : "   [+]"), cSec, 1);
   return open;
  }
// click on a box row: a v2 header folds / unfolds its section and the box is rebuilt at the same place
bool V2PopToggle(string obj)
  {
   int r = (int)StringToInteger(StringSubstr(obj, 7));
   for(int i = 0; i < ArraySize(gV2HdrRow); i++)
     {
      if(gV2HdrRow[i] != r) continue;
      string key = "|" + gV2HdrKey[i] + "|";
      if(StringFind(gV2Fold, key) >= 0) StringReplace(gV2Fold, key, ""); else gV2Fold += key;
      if(gPopZi >= 0 && gPopZi < ArraySize(zKey)) ShowPop(gPopZi, gPopCX, gPopCY);
      return true;
     }
   return false;
  }
void V2PopRows(int zi, int wr)
  {
   if(zi < 0 || zi >= ArraySize(zDna) || !zDna[zi].ok) return;
   ZoneDNA x = zDna[zi];
   LensOut o = zLens[zi];
   int d = x.d;
   if(InpLenses && o.ok && V2Hdr("MENTORS"))
     {
      PWrap(StringFormat("Kevin   %s / %s   %s   %s", o.kVer, o.kGrade, o.passK ? "pass" : "fail", V2Em("K", o.emK)), o.passK ? cGood : cPopFg, wr);
      if(o.kPlus != "" || o.kMinus != "") PWrap("   Kevin+" + (InpKevinPlus ? "" : " (notes only)") + ": " + o.kPlus + o.kMinus, cPopFg, wr);
      PWrap(StringFormat("Seiden  %d/10   dep %d mar %d big %d tst %d tim %d arr %d%s   %s%s", o.scoreS, o.sDep, o.sMar, o.sBig, o.sTst, o.sTim, o.sArr,
                         o.sArrProv ? "?" : "", V2Em("S", o.emS), o.golden ? "   golden hour" : ""), o.passS ? cGood : (o.vetoS ? cBad : cPopFg), wr);
      if(o.sNote != "") PWrap("   Seiden: " + o.sNote, cPopFg, wr);
      PWrap(StringFormat("Raja    %s %s %s %s   %s", x.rajaType, o.rTouch, o.rCurve, V2Room(x.roomR), V2Em("R", o.emR)), o.passR ? cGood : cPopFg, wr);
      if(o.rNote != "") PWrap("   Raja: " + o.rNote, cPopFg, wr);
      PWrap(StringFormat("Baker   %d/10   out %d in %d fresh %d time %d   %s", o.scoreB, o.bOut, o.bIn, o.bFresh, o.bTime, V2Em("B", o.emB)), o.passB ? cGood : (o.vetoB ? cBad : cPopFg), wr);
      if(o.bNote != "") PWrap("   Baker: " + o.bNote, cPopFg, wr);
      PWrap(StringFormat("Consensus %.0f -> %s   (%d of 4 pass; weights K %.0f S %.0f R %.0f B %.0f%s)", o.cons, o.verdict, o.nPass, LensW(0), LensW(1), LensW(2), LensW(3),
                         (InpUseCalWeights && gCalWOk) ? ", calibrated" : ""), V2VerdictColor(o.vcode), wr);
      string cl[];
      int ncl = StringSplit(o.conf, '\n', cl);
      for(int i = 0; i < ncl; i++) if(cl[i] != "") PWrap(cl[i], cConflict, wr);
     }
   if(V2Hdr("DNA"))
     {
      PWrap(StringFormat("Departure %d: leg %.1fx, out %.1f ATR, body %.0f%%, %d candles %.2f ATR/bar, %.1fx the candles before%s", x.departure, x.legRatio, x.legoutAtr,
                         x.legoutBody * 100, x.legoutN, x.legoutSpd, x.legoutRel, x.gapAway ? StringFormat(", gap away (open %.2f ATR)", x.gapOpen) : ""), cPopFg, wr);
      PWrap(StringFormat("Base %d (rel %.2f, %.0f min) | leg-in %.1f ATR, %d candles %.2f ATR/bar | space under the stay-away %.0f%%", x.baseN, x.baseRel, x.baseMin,
                         x.leginAtr, x.leginN, x.leginSpd, x.gap * 100), cPopFg, wr);
      PWrap(StringFormat("Chain: opp removed %d (whole move %d) | TL %s | new H/L %s | ATH %s | arrival K %s R %s | type %s%s", x.rmOppN, x.rmOppMove, V2YN(x.rmTL),
                         V2YN(x.newHL || x.rmPrevHL), V2YN(x.ath), V2YN(x.arrival), V2YN(x.arrivalRaja), x.rajaType, V2WeakTxt(x)), cPopFg, wr);
      string nest = x.nested ? StringFormat("nested in %s %s (pos %.2f)", TfName(x.nestTf), d > 0 ? "demand" : "supply", x.nestPos) : "not nested";
      if(x.inOppHtf) nest += " | inside " + TfName(x.oppHtfTf) + (d > 0 ? " supply!" : " demand!");
      PWrap(StringFormat("Location: %s | curve %.0f%% (%s%s) | room %s (zone %s, HTF %s) | origin %s, left %s%s%s", nest, x.curveZone, x.curveBucket, x.curveRaja ? "" : ", v1 range",
                         V2Room(x.roomR), x.hasOpp ? StringFormat("%.1fR", x.oppR) : "-", x.hasOppHtf ? StringFormat("%.1fR", x.oppHtfR) : "-",
                         x.originOk < 0 ? "n/a (CP)" : (x.originOk > 0 ? "ok" : "retest"), x.leftOppR < 0 ? "none" : StringFormat("%.1fR", x.leftOppR),
                         x.trap ? " | trap" : "", x.crowded ? " | crowded" : ""), cPopFg, wr);
      PWrap(StringFormat("Tests %d, deepest %.0f%% (%s), first %.0f%%, emotional wick %.0f%%%s | run-out %.1fh (%.1f ATR, %d bars)", x.nTests, x.depthMax, x.depthGrade,
                         x.depth1, x.emoDepth, x.retNext ? ", came straight back" : "", x.runoutH, x.runoutAtr, x.runoutBars), cPopFg, wr);
      PWrap(StringFormat("Approach%s: %d bars %.2f ATR/bar, new opposite zones %d, stair %s, novice candles %d | %s, %d min after the open | CP run %d, %s side",
                         x.apprProv ? " (so far)" : "", x.apprBars, x.apprSpd, x.newOppWay, V2YN(x.stair), x.noviceN, x.session, x.minFromOpen, x.cpRun,
                         x.impulse ? "impulse" : "correction"), cPopFg, wr);
     }
   if(V2Hdr("HISTORY")) V2HistRows(zi, wr);
   if(V2Hdr("PLANS"))
     {
      double en = zEn[zi], sl = zSl[zi], tp = zTp[zi];
      double rk = MathMax(MathAbs(en - sl), _Point);
      PWrap(tp > 0 ? StringFormat("v1: %s %s  SL %s  TP %s = 1:%.1f", d > 0 ? "buy limit" : "sell limit", V2Px(en), V2Px(sl), V2Px(tp), zRR[zi])
                   : "v1: no target (no fresh opposing zone in view)", cPopHead, wr);
      if(x.wowPx > 0)
         PWrap(StringFormat("TP=WOW1 %s (%s, %.0f p) = 1:%.1f", V2Px(x.wowPx), x.wowZ ? "zone to zone" : "trendline ladder", x.wowPips, MathAbs(x.wowPx - en) / rk), cWow, wr);
      double de = o.ok ? o.bDeep : x.dist + d * 0.25 * x.h;
      double rd = MathMax(MathAbs(de - sl), _Point);
      PWrap(StringFormat("Baker deep entry %s (25%% into the zone from the distal), SL %s%s", V2Px(de), V2Px(sl), tp > 0 ? StringFormat(", TP %s = 1:%.1f", V2Px(tp), MathAbs(tp - de) / rd) : ""),
            cPopFg, wr);
      double trg = x.prox + d * InpConfOffsetFrac * x.h;
      PWrap(StringFormat("Seiden confirm: let price enter, then %s %s as it leaves; cancel if %s trades first", d > 0 ? "buy stop" : "sell stop", V2Px(trg), V2Px(sl)), cPopFg, wr);
      ENUM_TIMEFRAMES ltf = LensConfTF(CTF);
      if(ltf != PERIOD_CURRENT)
         PWrap("Raja confirm: on " + TfName(ltf) + " wait for a trendline cross + the last opposite zone removed, then enter at the new " + TfName(ltf) + " zone that did it", cPopFg, wr);
     }
  }
// HISTORY section (spec 5.2 row 5): the calibrated cell of this zone, the level used, hit rates, best target, model, tells
string V2CellTxt(ZoneDNA &x, int lv)
  {
   string t = TfName(x.tf);
   if(lv >= 2) t += " | " + CalPat(x) + " | " + (x.align > 0 ? "with-dir" : (x.align < 0 ? "against-dir" : "no-dir"));
   if(lv >= 3) t += " | " + CalRt(x.rajaCode) + " | " + (x.nested ? "nested" : "not nested");
   if(lv >= 4) t += " | " + (x.depthGrade == "F" ? "fresh" : "depth " + x.depthGrade) + " | curve " + x.curveBucket;
   if(lv >= 5) t += " | " + _Symbol;
   if(lv <= 0) t = "all zones";
   return t;
  }
void V2HistRows(int zi, int wr)
  {
   if(!gCalOk) { PRow("no calibration file loaded (" + InpCalFile + ")", cPopFg, 0); return; }
   if(!InpShowHist) { PRow("calibration loaded, hidden (InpShowHist = false)", cPopFg, 0); return; }
   if(zi < 0 || zi >= ArraySize(zCal) || !zCal[zi].ok) { PRow("no cell with enough zones and no prior row for this zone", cPopFg, 0); return; }
   CalOut c = zCal[zi];
   if(c.prior)
     {
      PWrap(StringFormat("Historically (prior: consensus bin %s, n=%d): best %s E %sR", c.csBin, c.n, CalT(c.bestT), CalSg(c.bestE)), c.bestE > 0 ? cGood : cBad, wr);
      return;
     }
   int t = (InpCalTarget >= 1 && InpCalTarget <= 5) ? InpCalTarget : c.bestT;
   PWrap(StringFormat("Historically: %.0f%% reached %s (n=%d, level %d)", 100.0 * CalP(c, t), CalT(t), c.n, c.level), cPopHead, wr);
   PWrap("Cell: " + V2CellTxt(zDna[zi], c.level) + StringFormat(" (level %d)", c.level), cPopFg, wr);
   PWrap(StringFormat("touched %.0f%% | hit 1R %.0f%% 2R %.0f%% 3R %.0f%% 5R %.0f%% | opp %.0f%% | MFE med %.1fR", 100.0 * c.touched, 100.0 * c.p[0], 100.0 * c.p[1],
                      100.0 * c.p[2], 100.0 * c.p[4], 100.0 * c.p[5], c.mfeMed), cPopFg, wr);
   PWrap(StringFormat("best target %s E %sR (95%% CI %s..%s, raw cell)", CalT(c.bestT), CalSg(c.bestE), CalSg(c.ciLo), CalSg(c.ciHi)), c.bestE > 0 ? cGood : cBad, wr);
   if(c.model) PWrap(StringFormat("Model p(3R) %.0f%%", 100.0 * c.pModel), cPopFg, wr);
   if(c.tells != "") PWrap("Tells: " + c.tells, cPopFg, wr);
  }
// alternative plan lines while the box is open (dashed, removed with the box)
void V2DrawAltPlans(int zi)
  {
   if(!gV2Ok || zi < 0 || zi >= ArraySize(zDna) || !zDna[zi].ok || zEn[zi] <= 0) return;
   datetime t1 = zT1[zi], t2 = cT(0) + PeriodSeconds() * 18;
   if(zDna[zi].wowPx > 0)
     {
      HLine("RFXV2_Pw", t1, t2, zDna[zi].wowPx, cWow, STYLE_DASH, 1);
      Txt("RFXV2_Pwt", t2, zDna[zi].wowPx, " TP=WOW1 " + V2Px(zDna[zi].wowPx), cWow, 7, ANCHOR_LEFT);
     }
   double de = zLens[zi].ok ? zLens[zi].bDeep : zDna[zi].dist + zDna[zi].d * 0.25 * zDna[zi].h;
   HLine("RFXV2_Pb", t1, t2, de, cPlanEntry, STYLE_DASHDOTDOT, 1);
   Txt("RFXV2_Pbt", t2, de, " Baker deep entry " + V2Px(de), cPlanEntry, 7, ANCHOR_LEFT);
   NoSelect("RFXV2_P");
  }

//--- v2 alerts (spec 5.5): filters, depth, break (+ Raja 2nd close), WOW
bool V2FiltersDefault() { return !InpAlertWithDir && !InpAlertNestedOnly && InpAlertMinHistE <= 0 && InpAlertMinCons <= 0 && InpAlertMinVerdict <= 0; }
bool V2AlertPass(bool lensOk, double cons, int vcode, bool nested, int d, bool histOk, double histE)
  {
   if(InpAlertWithDir && (!gDirOk || gDirSide != d)) return false;
   if(InpAlertNestedOnly && !nested) return false;
   if(InpAlertMinHistE > 0 && (!histOk || histE < InpAlertMinHistE)) return false;   // zones without calibrated history are blocked
   if(InpAlertMinCons <= 0 && InpAlertMinVerdict <= 0) return true;
   if(!lensOk) return false;
   if(cons < InpAlertMinCons) return false;
   if(InpAlertMinVerdict > 0 && vcode < InpAlertMinVerdict + 1) return false;   // 1 = B (2), 2 = A (3), 3 = A+ (4)
   return true;
  }
bool V2AlertOk(int k)
  {
   if(V2FiltersDefault()) return true;
   if(k < 0 || k >= ArraySize(zLens) || k >= ArraySize(zDna)) return false;
   bool lok = zLens[k].ok;
   double cons = 0; int vc = 0;
   if(lok) { cons = zLens[k].cons; vc = zLens[k].vcode; }
   bool cok = k < ArraySize(zCal) && zCal[k].ok;
   return V2AlertPass(lok, cons, vc, zDna[k].ok && zDna[k].nested, zDir[k], cok, cok ? zCal[k].bestE : 0);
  }
// alert text tail: " | A | K+ S9 R:ARR B8 C78 | DIR LONG FULL"
string V2AlertTail(int k)
  {
   if(k < 0 || k >= ArraySize(zLens) || !zLens[k].ok) return "";
   string t = " | " + zLens[k].verdict + " | " + (zLens[k].passK ? "K+" : "K-") + StringFormat(" S%d R:%s B%d C%.0f", zLens[k].scoreS, zDna[k].rajaType, zLens[k].scoreB, zLens[k].cons);
   string ct = V2CalTag(k);
   if(ct != "") t += " | " + ct;
   string dd = V2DirShort();
   if(dd != "") t += " | " + dd;
   return t;
  }
// lenses for any chart zone (the Panel's halfway zone may not be drawn); the v1 ZoneNotes exports are restored afterwards
void V2EvalZone(int zi, ZoneDNA &x, LensOut &o)
  {
   ZeroMemory(x); ZeroMemory(o);
   if(!InpDNA || zi < 0 || zi >= ArraySize(Z)) return;
   double keepEn = gNEn, keepSl = gNSl, keepTp = gNTp, keepRR = gNRR;
   string keepG = gNGrade, keepT = gNTags;
   int keepP = gNP, keepM = gNM, keepC = gNC;
   string ver = "", why = "";
   ZoneNotes(Z, zi, ver, why);
   string gr = gNGrade;
   int np = gNP, nm = gNM, nc = gNC;
   double rr = gNRR;
   gNEn = keepEn; gNSl = keepSl; gNTp = keepTp; gNRR = keepRR; gNGrade = keepG; gNTags = keepT; gNP = keepP; gNM = keepM; gNC = keepC;
   DnaCompute(CTF, Z, zi, x);
   if(!x.ok) return;
   x.planRR = rr;
   if(InpLenses) LensRun(x, ver, gr, np, nm, nc, o);
  }
bool V2HalfwayOk(int zi)
  {
   if(V2FiltersDefault()) return true;
   for(int k = 0; k < ArraySize(zZi); k++) if(zZi[k] == zi) return V2AlertOk(k);
   if(zi < 0 || zi >= ArraySize(Z)) return false;
   ZoneDNA x; LensOut o; CalOut c;
   ZeroMemory(x); ZeroMemory(o); ZeroMemory(c);
   V2EvalZone(zi, x, o);
   bool cok = gCalOk && x.ok && CalLookup(x, o, c);
   return V2AlertPass(o.ok, o.cons, o.vcode, x.ok && x.nested, Z[zi].dir, cok, cok ? c.bestE : 0);
  }
// every tick: price reached InpAlertDepth % into a drawn zone (once per zone; nothing on load)
void V2CheckAlerts()
  {
   if(InpAlertDepth <= 0) { gV2TouchArmed = true; return; }
   double b = SBid();
   for(int k = 0; k < ArraySize(zKey); k++)
     {
      if(zState[k] == "removed") continue;
      double hz = MathAbs(zProx[k] - zDist[k]);
      if(hz <= 0) continue;
      double lv = zProx[k] - zDir[k] * InpAlertDepth / 100.0 * hz;
      bool hit = zDir[k] > 0 ? b <= lv : b >= lv;
      if(!hit) continue;
      string key = "P" + IntegerToString(InpAlertDepth) + DoubleToString(zProx[k], _Digits) + (zDir[k] > 0 ? "d" : "s");
      if(Alerted(key)) continue;
      MarkAlerted(key);
      if(gV2TouchArmed && V2AlertOk(k))
         Notify(StringFormat("ZV %s %s %s %s: price %d%% into the zone (%s)", _Symbol, TfName(CTF), zDir[k] > 0 ? "demand" : "supply", V2Px(zProx[k]), InpAlertDepth, V2Px(lv)) + V2AlertTail(k));
     }
   gV2TouchArmed = true;
  }
int V2FindZone(datetime tb, int d)
  {
   for(int j = 0; j < ArraySize(Z); j++) if(Z[j].dir == d && iTime(_Symbol, CTF, Z[j].legBar + Z[j].baseN) == tb) return j;
   return -1;
  }
// once per redraw: zones drawn fresh last time that the last closed candle removed (v1 rule), then Raja's 2nd big close
void V2BreakAlerts()
  {
   datetime b1 = cT(1);
   for(int p = ArraySize(gRjT) - 1; p >= 0; p--)                    // Raja: the candle after the break also closes beyond, with a big body
     {
      if(b1 <= gRjAt[p]) continue;
      int j = V2FindZone(gRjT[p], gRjD[p]);
      if(j >= 0 && DirRajaRemoved(CTF, Z[j]) == 1)
        {
         string key = "R" + IntegerToString((long)gRjT[p]) + (gRjD[p] > 0 ? "d" : "s");
         if(!Alerted(key))
           {
            MarkAlerted(key);
            if(gArmed) Notify(StringFormat("ZV %s %s %s %s: Raja-confirmed break (2nd big close beyond the distal %s)", _Symbol, TfName(CTF), gRjD[p] > 0 ? "demand" : "supply",
                              V2Px(Z[j].prox), V2Px(Z[j].dist)));
           }
        }
      int last = ArraySize(gRjT) - 1;
      gRjT[p] = gRjT[last]; gRjD[p] = gRjD[last]; gRjAt[p] = gRjAt[last];
      ArrayResize(gRjT, last); ArrayResize(gRjD, last); ArrayResize(gRjAt, last);
     }
   if(InpAlertBreak)
      for(int p = 0; p < ArraySize(gBkT); p++)
        {
         int j = V2FindZone(gBkT[p], gBkD[p]);
         if(j < 0 || !Z[j].removed || Z[j].removedBar != 1) continue;
         string key = "B" + IntegerToString((long)gBkT[p]) + (gBkD[p] > 0 ? "d" : "s");
         if(Alerted(key)) continue;
         MarkAlerted(key);
         if(!gArmed || !V2AlertPass(gBkLens[p], gBkCons[p], gBkV[p], gBkNest[p], gBkD[p], gBkHOk[p], gBkHE[p])) continue;
         bool byClose = gBkD[p] > 0 ? cC(1) < Z[j].dist : cC(1) > Z[j].dist;
         Notify(StringFormat("ZV %s %s %s %s removed: %s beyond the distal %s (Raja: wait for a 2nd big close)", _Symbol, TfName(CTF), gBkD[p] > 0 ? "demand" : "supply",
                             V2Px(gBkProx[p]), byClose ? "a candle closed" : "a normal wick", V2Px(Z[j].dist)) + gBkTag[p]);
         int n = ArraySize(gRjT);
         ArrayResize(gRjT, n + 1); ArrayResize(gRjD, n + 1); ArrayResize(gRjAt, n + 1);
         gRjT[n] = gBkT[p]; gRjD[n] = gBkD[p]; gRjAt[n] = b1;
        }
   ArrayResize(gBkT, 0); ArrayResize(gBkD, 0); ArrayResize(gBkProx, 0); ArrayResize(gBkCons, 0); ArrayResize(gBkV, 0); ArrayResize(gBkNest, 0); ArrayResize(gBkLens, 0); ArrayResize(gBkTag, 0);
   ArrayResize(gBkHOk, 0); ArrayResize(gBkHE, 0);
   if(!InpAlertBreak) return;
   for(int k = 0; k < ArraySize(zKey); k++)
     {
      if(zState[k] != "fresh") continue;
      int zi = zZi[k];
      if(zi < 0 || zi >= ArraySize(Z)) continue;
      int n = ArraySize(gBkT);
      ArrayResize(gBkT, n + 1); ArrayResize(gBkD, n + 1); ArrayResize(gBkProx, n + 1); ArrayResize(gBkCons, n + 1); ArrayResize(gBkV, n + 1);
      ArrayResize(gBkNest, n + 1); ArrayResize(gBkLens, n + 1); ArrayResize(gBkTag, n + 1); ArrayResize(gBkHOk, n + 1); ArrayResize(gBkHE, n + 1);
      gBkT[n] = iTime(_Symbol, CTF, Z[zi].legBar + Z[zi].baseN); gBkD[n] = zDir[k]; gBkProx[n] = zProx[k];
      gBkLens[n] = zLens[k].ok; gBkCons[n] = zLens[k].ok ? zLens[k].cons : 0; gBkV[n] = zLens[k].ok ? zLens[k].vcode : 0;
      gBkNest[n] = zDna[k].ok && zDna[k].nested; gBkTag[n] = V2AlertTail(k);
      gBkHOk[n] = k < ArraySize(zCal) && zCal[k].ok; gBkHE[n] = gBkHOk[n] ? zCal[k].bestE : 0;
     }
  }
// a new WOW1 target with the guard clear (once per target; nothing on load)
void V2WowAlert()
  {
   if(!InpAlertWOW || !InpShowWOW || !gDirOk || gWow1 <= 0 || gWowPend) return;
   string key = "W" + DoubleToString(gWow1, _Digits);
   if(Alerted(key)) return;
   MarkAlerted(key);
   if(gArmed) Notify("ZV " + _Symbol + " " + TfName(CTF) + ": " + gWowTxt[0] + (V2DirShort() != "" ? " | " + V2DirShort() : ""));
  }

//+------------------------------------------------------------------+
//| v2 M0 golden master: object dump (InpDumpObjects, default off)   |
//| Every object of the given prefixes, sorted by name, one tab-     |
//| separated row: type, periods, 2 anchor points, colour, style,    |
//| width, back, fill, ray, anchor, font, size, arrow code, corner,  |
//| x / y / size, bg colour, border, z-order, selectable, text and   |
//| tooltip. File: Terminal\Common\Files\RFX_Dump_<sym>_<tf>.csv     |
//| (v1 prefixes) and RFX_DumpV2_<sym>_<tf>.csv (v2 objects), plus   |
//| RFX_DumpVTF_<sym>.csv (the 3M / 6M / 12M series, for the         |
//| TradingView spot check).                                         |
//+------------------------------------------------------------------+
//+------------------------------------------------------------------+
//| v2 M10: ZoneBot export (spec 7.2). Global variables              |
//| RFX2|<sym>|<tf>|<k>|<field>: header k = h (ts ver cfg n dir dirq |
//| wow1 wow2 calv), zones k = 0..n-1 in the drawn order (nearest    |
//| first). This chart is the only writer; stale zone slots are      |
//| deleted on every redraw, the whole set on deinit.                |
//+------------------------------------------------------------------+
void V2GVSet(string pre, string k, string f, double v) { GlobalVariableSet(pre + k + "|" + f, v); }
void V2ExportGV()
  {
   string pre = RFX_GVPrefix(_Symbol, TfName(CTF));
   if(StringLen(pre) + 8 > 63) return;                               // a GV name holds at most 63 characters
   int nz = MathMin(MathMax(0, MathMin(InpExportN, 32)), ArraySize(zKey));
   for(int k = 0; k < nz; k++)
     {
      string ks = IntegerToString(k);
      bool dOk = gV2Ok && k < ArraySize(zDna) && zDna[k].ok;
      bool lOk = dOk && k < ArraySize(zLens) && zLens[k].ok;
      bool cOk = dOk && k < ArraySize(zCal) && zCal[k].ok;
      V2GVSet(pre, ks, "id", (double)(long)zT1[k]);
      V2GVSet(pre, ks, "d", zDir[k]);
      V2GVSet(pre, ks, "prox", zProx[k]);
      V2GVSet(pre, ks, "dist", zDist[k]);
      V2GVSet(pre, ks, "st", zState[k] == "removed" ? 2 : (zState[k] == "tested" ? 1 : 0));
      V2GVSet(pre, ks, "ntest", dOk ? zDna[k].nTests : 0);
      V2GVSet(pre, ks, "depth", dOk ? zDna[k].depthMax : 0);
      V2GVSet(pre, ks, "kv", RFX_KvCode(zVer[k]));
      V2GVSet(pre, ks, "kg", RFX_KgCode(k < ArraySize(zGrade) ? zGrade[k] : ""));
      V2GVSet(pre, ks, "sS", lOk ? zLens[k].scoreS : 0);
      V2GVSet(pre, ks, "sR", lOk ? zLens[k].scoreR : 0);
      V2GVSet(pre, ks, "rt", dOk ? zDna[k].rajaCode : 0);
      V2GVSet(pre, ks, "sB", lOk ? zLens[k].scoreB : 0);
      V2GVSet(pre, ks, "cons", lOk ? zLens[k].cons : 0);
      V2GVSet(pre, ks, "v2v", lOk ? zLens[k].vcode : -1);
      V2GVSet(pre, ks, "em", lOk ? RFX_EmCode(zLens[k]) : 0);
      V2GVSet(pre, ks, "p3", cOk ? CalP(zCal[k], 3) : 0);
      V2GVSet(pre, ks, "pn", cOk ? zCal[k].n : 0);
      V2GVSet(pre, ks, "bt", cOk ? zCal[k].bestT : 0);
      V2GVSet(pre, ks, "be", cOk ? zCal[k].bestE : 0);
      V2GVSet(pre, ks, "lvl", cOk ? (zCal[k].prior ? -1 : zCal[k].level) : -2);
      V2GVSet(pre, ks, "en", zEn[k]);
      V2GVSet(pre, ks, "sl", zSl[k]);
      V2GVSet(pre, ks, "tp", zTp[k]);
      V2GVSet(pre, ks, "rr", zRR[k]);
      V2GVSet(pre, ks, "nest", dOk && zDna[k].nested ? 10 + RFX_TfIndex(zDna[k].nestTf) : 0);
      V2GVSet(pre, ks, "room", dOk ? zDna[k].roomR : 0);
     }
   for(int k = nz; k < 32; k++) GlobalVariablesDeleteAll(pre + IntegerToString(k) + "|");
   V2GVSet(pre, "h", "ver", RFX_CORE_VER);
   V2GVSet(pre, "h", "cfg", (double)RFX_CfgHash());
   V2GVSet(pre, "h", "n", nz);
   V2GVSet(pre, "h", "dir", gDirOk ? gDir : 0);
   V2GVSet(pre, "h", "dirq", gDirOk ? gDirQ : 0);
   V2GVSet(pre, "h", "wow1", gDirOk ? gWow1 : 0);
   V2GVSet(pre, "h", "wow2", gDirOk ? gWow2 : 0);
   V2GVSet(pre, "h", "calv", gCalOk ? (double)(gCalMod / 2) : 0);
   V2GVSet(pre, "h", "ts", (double)(long)TimeCurrent());               // written last: the set is complete
  }

string DumpEsc(string v) { string o = v; StringReplace(o, "\t", "\\t"); StringReplace(o, "\r", ""); StringReplace(o, "\n", "\\n"); return o; }
string DumpI(string o, ENUM_OBJECT_PROPERTY_INTEGER p) { return IntegerToString(ObjectGetInteger(0, o, p)); }
void DumpPrefixes(string file, string pfxList)
  {
   string pf[]; int np = StringSplit(pfxList, '|', pf);
   string nm[]; int n = 0;
   int tot = ObjectsTotal(0, -1, -1);
   for(int i = 0; i < tot; i++)
     {
      string on = ObjectName(0, i, -1, -1);
      bool hit = false;
      for(int k = 0; k < np; k++) if(StringFind(on, pf[k]) == 0) hit = true;
      if(!hit) continue;
      ArrayResize(nm, n + 1); nm[n] = on; n++;
     }
   for(int i = 1; i < n; i++)                                          // sorted by name: the creation order never matters
     {
      string v = nm[i]; int j = i - 1;
      while(j >= 0 && StringCompare(nm[j], v, true) > 0) { nm[j + 1] = nm[j]; j--; }
      nm[j + 1] = v;
     }
   string fn = file + RsSym() + "_" + TfName(CTF) + ".csv";
   int f = FileOpen(fn, FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_COMMON);
   if(f == INVALID_HANDLE) { Print("ZoneVision dump: cannot open ", fn, " error ", GetLastError()); return; }
   FileWrite(f, "#bar0\t" + IntegerToString((long)cT(0)) + "\tobjects\t" + IntegerToString(n));
   FileWrite(f, "name\ttype\tperiods\tt0\tp0\tt1\tp1\tcolor\tstyle\twidth\tback\tfill\tray_right\tanchor\tfont\tfontsize\tarrowcode\tcorner\tx\ty\txsize\tysize\tbgcolor\tborder\tzorder\tselectable\ttext\ttooltip");
   int dg = _Digits + 3;
   for(int i = 0; i < n; i++)
     {
      string o = nm[i];
      string ln = o + "\t" + DumpI(o, OBJPROP_TYPE) + "\t" + DumpI(o, OBJPROP_TIMEFRAMES)
                  + "\t" + IntegerToString(ObjectGetInteger(0, o, OBJPROP_TIME, 0)) + "\t" + DoubleToString(ObjectGetDouble(0, o, OBJPROP_PRICE, 0), dg)
                  + "\t" + IntegerToString(ObjectGetInteger(0, o, OBJPROP_TIME, 1)) + "\t" + DoubleToString(ObjectGetDouble(0, o, OBJPROP_PRICE, 1), dg)
                  + "\t" + DumpI(o, OBJPROP_COLOR) + "\t" + DumpI(o, OBJPROP_STYLE) + "\t" + DumpI(o, OBJPROP_WIDTH) + "\t" + DumpI(o, OBJPROP_BACK)
                  + "\t" + DumpI(o, OBJPROP_FILL) + "\t" + DumpI(o, OBJPROP_RAY_RIGHT) + "\t" + DumpI(o, OBJPROP_ANCHOR)
                  + "\t" + DumpEsc(ObjectGetString(0, o, OBJPROP_FONT)) + "\t" + DumpI(o, OBJPROP_FONTSIZE) + "\t" + DumpI(o, OBJPROP_ARROWCODE)
                  + "\t" + DumpI(o, OBJPROP_CORNER) + "\t" + DumpI(o, OBJPROP_XDISTANCE) + "\t" + DumpI(o, OBJPROP_YDISTANCE)
                  + "\t" + DumpI(o, OBJPROP_XSIZE) + "\t" + DumpI(o, OBJPROP_YSIZE) + "\t" + DumpI(o, OBJPROP_BGCOLOR) + "\t" + DumpI(o, OBJPROP_BORDER_TYPE)
                  + "\t" + DumpI(o, OBJPROP_ZORDER) + "\t" + DumpI(o, OBJPROP_SELECTABLE)
                  + "\t" + DumpEsc(ObjectGetString(0, o, OBJPROP_TEXT)) + "\t" + DumpEsc(ObjectGetString(0, o, OBJPROP_TOOLTIP));
      FileWrite(f, ln);
     }
   FileClose(f);
  }
void DumpVirtual()
  {
   string fn = "RFX_DumpVTF_" + RsSym() + ".csv";
   int f = FileOpen(fn, FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_COMMON);
   if(f == INVALID_HANDLE) { Print("ZoneVision dump: cannot open ", fn, " error ", GetLastError()); return; }
   FileWrite(f, "tf\tshift\ttime\topen\thigh\tlow\tclose\tatr14_wilder");
   for(int k = 0; k < 3; k++)
      for(int i = 0; i < rvCnt[k]; i++)
        {
         int x = k * VCAP + i;
         FileWrite(f, IntegerToString(rvMonths[k]) + "M\t" + IntegerToString(i) + "\t" + TimeToString(rvT[x], TIME_DATE) + "\t" + DoubleToString(rvO[x], _Digits)
                   + "\t" + DoubleToString(rvH[x], _Digits) + "\t" + DoubleToString(rvL[x], _Digits) + "\t" + DoubleToString(rvC[x], _Digits) + "\t" + DoubleToString(rvA[x], _Digits + 1));
        }
   FileClose(f);
  }
void DumpObjects()
  {
   static bool once = false;
   if(InpDumpAt > 0) { if(once || cT(0) < InpDumpAt) return; once = true; }
   DumpPrefixes("RFX_Dump_", "RFXV_|RFXN_|RFXS_|RFXP2_");
   DumpPrefixes("RFX_DumpV2_", "RFXV2_");
   VBuildAll();
   DumpVirtual();
   Print("ZoneVision dump written for bar ", TimeToString(cT(0), TIME_DATE | TIME_MINUTES), " (Terminal\\Common\\Files\\RFX_Dump_", RsSym(), "_", TfName(CTF), ".csv)");
  }

//+------------------------------------------------------------------+
//| ZoneBot order notes: reads MQL5\Files\RamanFX_Bot_Orders.txt and |
//| shows the reasoning of the bot's live order(s) on this symbol.   |
//+------------------------------------------------------------------+
// live = a pending order with that ticket, or an open position opened by it (ticket or position id)
bool TicketLive(long t)
  {
   if(t <= 0) return false;
   for(int i = OrdersTotal() - 1; i >= 0; i--) { ulong tk = OrderGetTicket(i); if(tk > 0 && (long)tk == t) return true; }
   for(int i = PositionsTotal() - 1; i >= 0; i--)
     {
      ulong tk = PositionGetTicket(i);
      if(tk == 0) continue;
      if((long)tk == t || PositionGetInteger(POSITION_IDENTIFIER) == t) return true;
     }
   return false;
  }
void BotNotes()
  {
   int f = FileOpen("RamanFX_Bot_Orders.txt", FILE_READ | FILE_TXT | FILE_ANSI | FILE_SHARE_READ | FILE_SHARE_WRITE);
   string note = ""; long ticket = 0;
   if(f != INVALID_HANDLE)
     {
      while(!FileIsEnding(f))
        {
         string line = FileReadString(f);
         string p[]; if(StringSplit(line, '\t', p) < 4) continue;
         if(p[2] != _Symbol) continue;
         long t = StringToInteger(p[1]);
         if(TicketLive(t)) { ticket = t; note = p[3]; }        // newest live order wins
        }
      FileClose(f);
     }
   ObjectsDeleteAll(0, "RFXN_");
   if(note == "") return;
   string ls[]; StringReplace(note, " || ", "\n"); int n = StringSplit(note, '\n', ls);
   for(int i = 0; i < n; i++)
     {
      string nm = "RFXN_" + IntegerToString(i);
      ObjectCreate(0, nm, OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, nm, OBJPROP_CORNER, CORNER_RIGHT_LOWER);
      ObjectSetInteger(0, nm, OBJPROP_ANCHOR, ANCHOR_RIGHT_LOWER);
      ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, 12);
      ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, 18 + (n - 1 - i) * 14);
      ObjectSetString(0, nm, OBJPROP_TEXT, (i == 0 ? "#" + IntegerToString(ticket) + "  " : "") + ls[i]);
      ObjectSetString(0, nm, OBJPROP_FONT, "Arial");
      ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 8);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, i == 0 ? cPlanEntry : cPopFg);
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
     }
  }

//+------------------------------------------------------------------+
//| Zone research (Strategy Tester data collection)                  |
//| On only when gRs (InpResearch, or always in the Strategy Tester). |
//| For every research timeframe, on each new closed candle:         |
//|  1) follow every zone already logged (closed candles only, no    |
//|     repainting): touches, depth, R reached before the stop,      |
//|     close-break, horizon;                                        |
//|  2) run the SAME Detect / Trendlines / Qualify / ZoneNotes as    |
//|     the chart, with that timeframe as the chart timeframe, and   |
//|     log every zone that just appeared (why it was made);         |
//|  3) optionally the ALT detector (II_SupDem idea, own code):      |
//|     ZigZag 3/2/2 turns, zone = turn wick to the nearest body /   |
//|     neighbour edge, judged with the same ZoneNotes.              |
//| One CSV row per zone (create + outcome columns) is written when  |
//| the zone resolves, and for every zone still open at OnDeinit.    |
//| Trade model: entry at the proximal, stop at the distal (wick),   |
//| spread added to the risk; 1R = zone height + spread.             |
//+------------------------------------------------------------------+
ENUM_TIMEFRAMES RsTfFromName(string nm)
  {
   string u = nm; StringTrimLeft(u); StringTrimRight(u); StringToUpper(u);
   if(u == "M1") return PERIOD_M1;   if(u == "M2") return PERIOD_M2;   if(u == "M3") return PERIOD_M3;   if(u == "M4") return PERIOD_M4;
   if(u == "M5") return PERIOD_M5;   if(u == "M6") return PERIOD_M6;   if(u == "M10") return PERIOD_M10; if(u == "M12") return PERIOD_M12;
   if(u == "M15") return PERIOD_M15; if(u == "M20") return PERIOD_M20; if(u == "M30") return PERIOD_M30;
   if(u == "H1") return PERIOD_H1;   if(u == "H2") return PERIOD_H2;   if(u == "H3") return PERIOD_H3;   if(u == "H4") return PERIOD_H4;
   if(u == "H6") return PERIOD_H6;   if(u == "H8") return PERIOD_H8;   if(u == "H12") return PERIOD_H12;
   if(u == "D1") return PERIOD_D1;   if(u == "W1") return PERIOD_W1;   if(u == "MN" || u == "MN1") return PERIOD_MN1;
   if(u == "3M") return (ENUM_TIMEFRAMES)TFV_3M; if(u == "6M") return (ENUM_TIMEFRAMES)TFV_6M; if(u == "12M") return (ENUM_TIMEFRAMES)TFV_12M;   // v2 virtual TFs
   return PERIOD_CURRENT;
  }
void RsInit()
  {
   aNStd = aN;                                                       // the chart's own ATR slots; research slots follow
   rsN = 0; ArrayResize(RZ, 0); rsFile = INVALID_HANDLE; rsFailed = false; rsDirty = false; rsCount = 0;
   ArrayResize(rsSeenS, 0); ArrayResize(rsSeenD, 0); ArrayResize(rsSeenT, 0);
   gRsDna = InpResearchDNA; rsVirt = false;
   if(gRsDna) { ZoneDNA ex; LensOut eo; ZeroMemory(ex); ZeroMemory(eo); gRsS1Empty = RsS1Cols(ex, eo, false, false, 0, false, 0, 0, 0); }
   string parts[];
   int np = StringSplit(InpResearchTFs, ',', parts);
   for(int i = 0; i < np && rsN < MAXTF; i++)
     {
      ENUM_TIMEFRAMES t = RsTfFromName(parts[i]);
      if(t == PERIOD_CURRENT) continue;
      bool dup = false;
      for(int k = 0; k < rsN; k++) if(rsTF[k] == t) dup = true;
      if(dup) continue;
      rsTF[rsN] = t; rsLast[rsN] = 0; rsN++;
      if(VIsTF(t)) { rsVirt = true; AtrSlot(PERIOD_MN1); }            // v2: 3M / 6M / 12M are built from MN1 (Wilder ATR, no handle)
      else AtrSlot(t);
      ENUM_TIMEFRAMES ht = HtfOf(t);
      if(ht > 0) AtrSlot(ht);
      if(gRsDna && InpDirEngine)                                     // v2: the Direction stack of this research TF loads with the test
        {
         ENUM_TIMEFRAMES keepTF = CTF;
         CTF = t;
         ENUM_TIMEFRAMES ds[];
         int nd = DirStackTFs(ds);
         CTF = keepTF;
         for(int k = 0; k < nd; k++) AtrSlot(ds[k]);
        }
     }
   if(rsN == 0) { gRs = false; Print("ZoneVision research: no valid timeframe in InpResearchTFs"); return; }
   Print("ZoneVision research mode ON: ", InpResearchTFs, InpResearchAlt ? " (+ALT detector)" : "", gRsDna ? " (+v2 DNA / lenses / touch snapshot)" : "");
  }

// small CSV helpers
string RsD(double v, int dg) { return DoubleToString(v, dg); }
string RsI(long v) { return IntegerToString(v); }
string RsB(bool v) { return v ? "1" : "0"; }
string RsTime(datetime t) { return t > 0 ? TimeToString(t, TIME_DATE | TIME_MINUTES) : ""; }
string RsStamp(datetime t) { MqlDateTime md; TimeToStruct(t, md); return StringFormat("%04d%02d%02d%02d%02d", md.year, md.mon, md.day, md.hour, md.min); }
string RsDay(datetime t) { MqlDateTime md; TimeToStruct(t, md); return StringFormat("%04d%02d%02d", md.year, md.mon, md.day); }
string RsClean(string v) { string o = v; StringReplace(o, ",", " "); StringReplace(o, "\n", " "); StringReplace(o, "\r", " "); StringReplace(o, "\"", "'"); return o; }
string RsSym() { string u = _Symbol; StringReplace(u, "/", "_"); StringReplace(u, "\\", "_"); StringReplace(u, ":", "_"); StringReplace(u, "*", "_"); StringReplace(u, "?", "_"); return u; }
void   RsC(string &row, string v) { row += (row == "" ? "" : ",") + v; }
string RsRes(int r) { return r == 1 ? "stop" : (r == 2 ? "target" : (r == 3 ? "open" : "")); }

// CSV header: create columns (why the zone was made), then outcome columns (what happened next). See docs/Zone_Research_HowTo.md.
string RsHeader()
  {
   string hd = "detector,symbol,tf,id,created,base_start,base_end,type,pattern,proximal,distal,height,height_pts,height_atr,base_n,"
               + "legin_atr,legout_atr,leg_ratio,moveaway_h_create,gap,emotional,tested_at_create,would_draw,verdict,grade,zgrade,score,"
               + "n_plus,n_minus,n_crit,tags,alt_strength,arrival,chain,rm_opp_zone,rm_trendline,new_high_low,rm_prev_high_low,leg2,"
               + "too_small,trap,crowded,htf_trend,tl_bias,bias,align,bigger_trend,bigger_align,nested,in_opp_htf,curve,opp_R,plan_rr,"
               + "session,hour,weekday,atr,spread";
   hd += ",status,resolved,age_bars,never_touched,runout_h,broken,broken_time,broken_bars,touches";
   for(int k = 1; k <= 3; k++)
     {
      string p = ",t" + IntegerToString(k) + "_";
      hd += p + "time" + p + "bars" + p + "depth" + p + "mfe" + p + "hit1" + p + "hit2" + p + "hit3" + p + "hit4" + p + "hit5"
            + p + "opp" + p + "result" + p + "end_time" + p + "end_bars";
     }
   hd += ",t1c_mfe,t1c_result,t1c_loss";
   if(gRsDna)                                                        // v2 columns are appended: old analyzers read by name
     {
      ZoneDNA ex; LensOut eo; ZeroMemory(ex); ZeroMemory(eo);
      hd += RsV2Cols(ex, eo, false, true, "", 0) + RsS1Cols(ex, eo, false, true, 0, false, 0, 0, 0) + RsV2OutHdr();
     }
   return hd;
  }

void RsOpen()
  {
   rsFrom = RsDay(TimeCurrent());
   rsName = InpResearchFile + "_" + RsSym() + "_" + rsFrom + "_running.csv";
   rsFile = FileOpen(rsName, FILE_WRITE | FILE_CSV | FILE_ANSI | FILE_COMMON | FILE_SHARE_READ, ',');
   if(rsFile == INVALID_HANDLE) { rsFailed = true; Print("ZoneVision research: cannot open ", rsName, " error ", GetLastError()); return; }
   FileWrite(rsFile, RsHeader());
   FileFlush(rsFile);
   Print("ZoneVision research: writing Terminal\\Common\\Files\\", rsName);
  }
void RsClose()
  {
   datetime now = TimeCurrent();
   for(int i = ArraySize(RZ) - 1; i >= 0; i--) RsFinish(i, "test_end", now);
   if(rsFile == INVALID_HANDLE) return;
   FileClose(rsFile);
   rsFile = INVALID_HANDLE;
   string fin = InpResearchFile + "_" + RsSym() + "_" + rsFrom + "_" + RsDay(now) + ".csv";
   if(FileMove(rsName, FILE_COMMON, fin, FILE_COMMON | FILE_REWRITE)) Print("ZoneVision research: ", rsCount, " zones saved to Terminal\\Common\\Files\\", fin);
   else Print("ZoneVision research: ", rsCount, " zones saved to Terminal\\Common\\Files\\", rsName, " (rename failed, error ", GetLastError(), ")");
  }

void RsRun()
  {
   if(rsFile == INVALID_HANDLE && !rsFailed) RsOpen();
   if(rsVirt) VBuildAll();                                           // v2: 3M / 6M / 12M research TFs
   for(int s = 0; s < rsN; s++) RsSlot(s);
   if(rsDirty && rsFile != INVALID_HANDLE) { FileFlush(rsFile); rsDirty = false; }
  }

void RsSlot(int s)
  {
   ENUM_TIMEFRAMES T = rsTF[s];
   if(SBars(_Symbol, T) < (VIsTF(T) ? 40 : InpLookback + InpMaxBase + 30)) return;   // v2: a virtual TF has fewer bars (Detect caps itself)
   datetime b1 = ST(_Symbol, T, 1);
   if(b1 <= 0 || b1 == rsLast[s]) return;
   if(ATR(T, 1) <= 0) return;                                        // ATR not ready yet: try again next tick
   datetime prev = rsLast[s];
   rsLast[s] = b1;
   if(prev > 0)
     {
      int from = SBarShift(_Symbol, T, prev);                        // the candle handled last time (normally shift 2)
      if(from < 2) from = 2;
      if(from > 60) from = 60;
      for(int sh = from - 1; sh >= 1; sh--) RsUpdate(s, sh);
     }
   Zone zv[];
   Detect(_Symbol, T, zv, false);
   int nv[]; int cnt = 0;
   if(prev > 0)                                                      // the first pass only sets the start point (no history zones)
      for(int i = 0; i < ArraySize(zv); i++)
         if(zv[i].saBar >= 1 && ST(_Symbol, T, zv[i].saBar) > prev) { ArrayResize(nv, cnt + 1); nv[cnt] = i; cnt++; }
   Zone alt[]; string altS[]; int na = 0;
   if(InpResearchAlt && !VIsTF(T)) na = RsAlt(s, T, prev == 0, alt, altS);
   bool snap = false;                                                // v2: a touch-1 snapshot is waiting for this candle's context
   if(gRsDna) for(int i = 0; i < ArraySize(RZ) && !snap; i++) if(RZ[i].slot == s && RZ[i].s1Pend) snap = true;
   if(cnt == 0 && na == 0 && !snap) return;
   RsCreate(s, T, zv, nv, alt, altS);
  }

//--- context switch: the chart's detection globals are borrowed and given back
void CopyZones(Zone &src[], Zone &dst[]) { int n = ArraySize(src); ArrayResize(dst, n); for(int i = 0; i < n; i++) dst[i] = src[i]; }
void CopyTLs(TLine &src[], TLine &dst[]) { int n = ArraySize(src); ArrayResize(dst, n); for(int i = 0; i < n; i++) dst[i] = src[i]; }
void RsSave()
  {
   svCTF = CTF; svGTF = gTF; svHTF = gHTF; svTrend = gTrend; svHBias = gHBias; svHBiasTxt = gHBiasTxt;
   svUpOn = gUpOn; svDnOn = gDnOn; svUpS = gUpS; svUpP = gUpP; svUpW = gUpW; svDnS = gDnS; svDnP = gDnP; svDnW = gDnW; svUpB = gUpB; svDnB = gDnB;
   svHUpOn = gHUpOn; svHDnOn = gHDnOn; svHUpS = gHUpS; svHUpP = gHUpP; svHUpW = gHUpW; svHDnS = gHDnS; svHDnP = gHDnP; svHDnW = gHDnW; svHUpB = gHUpB; svHDnB = gHDnB;
   svNEn = gNEn; svNSl = gNSl; svNTp = gNTp; svNRR = gNRR;
   CopyZones(Z, svZ); CopyTLs(TL, svTL);
  }
void RsRestore()
  {
   CTF = svCTF; gTF = svGTF; gHTF = svHTF; gTrend = svTrend; gHBias = svHBias; gHBiasTxt = svHBiasTxt;
   gUpOn = svUpOn; gDnOn = svDnOn; gUpS = svUpS; gUpP = svUpP; gUpW = svUpW; gDnS = svDnS; gDnP = svDnP; gDnW = svDnW; gUpB = svUpB; gDnB = svDnB;
   gHUpOn = svHUpOn; gHDnOn = svHDnOn; gHUpS = svHUpS; gHUpP = svHUpP; gHUpW = svHUpW; gHDnS = svHDnS; gHDnP = svHDnP; gHDnW = svHDnW; gHUpB = svHUpB; gHDnB = svHDnB;
   gNEn = svNEn; gNSl = svNSl; gNTp = svNTp; gNRR = svNRR;
   CopyZones(svZ, Z); CopyTLs(svTL, TL);
  }

// the same steps Redraw() takes for the chart, with T as the chart timeframe, nothing drawn
void RsCreate(int s, ENUM_TIMEFRAMES T, Zone &zv[], int &nv[], Zone &alt[], string &altS[])
  {
   RsSave();
   gQuiet = true;
   CTF = T;
   ENUM_TIMEFRAMES ht = HtfOf(T);
   gTrend = ht > 0 ? HtfTrend(_Symbol, ht) : 0;
   int swing = gTrend;
   gHTF = PERIOD_CURRENT; gHUpOn = false; gHDnOn = false; gHBias = 0; gHBiasTxt = "";
   if(ht > 0) { gTF = ht; Trendlines(_Symbol, ht); TLBias(); CopyHtfLine(ht); }
   int tlb = gHBias;
   if(InpTLBias && gHBias != 0) gTrend = gHBias;
   gTF = T;
   Trendlines(_Symbol, T);
   ENUM_TIMEFRAMES ht2 = ht > 0 ? HtfOf(ht) : PERIOD_CURRENT;
   int big = ht2 > 0 ? HtfTrend(_Symbol, ht2) : 0;                   // bigger trend = swings of the HTF's own HTF (as ZoneBot)
   Zone hz[];
   if(ht > 0) Detect(_Symbol, ht, hz, false);
   CopyZones(zv, Z);
   Qualify();
   if(gRsDna) { DirStateSave(); DirRun(); DnaPrepare(); }          // v2: Direction engine + DNA context of T (the chart's state is given back below)
   int nz = ArraySize(Z);
   for(int k = 0; k < ArraySize(nv); k++) RsLog(s, false, nv[k], "", swing, tlb, big, hz, nz);
   int na = ArraySize(alt);
   if(na > 0)
     {
      ArrayResize(Z, nz + na);
      for(int k = 0; k < na; k++) Z[nz + k] = alt[k];
      Qualify();
      for(int k = 0; k < na; k++) RsLog(s, true, nz + k, altS[k], swing, tlb, big, hz, nz);
     }
   if(gRsDna)
     {
      int nb = ArraySize(Z);
      for(int i = 0; i < ArraySize(RZ); i++) if(RZ[i].slot == s && RZ[i].s1Pend) RsSnap(i, T, nz, nb);
      DirStateRestore();
     }
   gQuiet = false;
   RsRestore();
  }

// log one new zone Z[i] (why it was made) and start following it
void RsLog(int s, bool isAlt, int i, string altStr, int swing, int tlb, int big, Zone &hz[], int nz)
  {
   ENUM_TIMEFRAMES T = rsTF[s];
   int tb = -1; bool crw = false;
   Z[i].trap = FindTrap(_Symbol, T, Z[i].dir, Z[i].prox, Z[i].dist, Z[i].saBar, Z[i].baseEnd, tb, crw);
   Z[i].trapBar = tb == -1 ? -2 : tb; Z[i].crowded = crw;
   string ver = "", why = "";
   gNTags = ""; gNGrade = ""; gNP = 0; gNM = 0; gNC = 0;
   ZoneNotes(Z, i, ver, why);
   Zone z = Z[i];
   double atr = ATR(T, 1), hg = MathAbs(z.prox - z.dist);
   if(atr <= 0 || hg <= 0) return;
   double spr = SAsk() - SBid();
   if(spr <= 0) spr = (double)SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) * _Point;
   if(spr < 0) spr = 0;
   datetime tB0 = ST(_Symbol, T, z.legBar + z.baseN), tB1 = ST(_Symbol, T, z.legBar + 1), tNow = ST(_Symbol, T, 0);
   string pat = z.dir > 0 ? (z.cont ? "RBR" : "DBR") : (z.cont ? "DBD" : "RBD");
   double legIn = Rng(_Symbol, T, z.legBar + z.baseN + 1) / atr, legOut = Rng(_Symbol, T, z.legBar) / atr;
   int cntA = MathMax(1, z.legBar);
   double mv = z.dir > 0 ? (SH(_Symbol, T, SHighest(_Symbol, T, MODE_HIGH, cntA, 1)) - z.prox) / hg
                         : (z.prox - SL(_Symbol, T, SLowest(_Symbol, T, MODE_LOW, cntA, 1))) / hg;
   bool emo = false;
   for(int b = z.legBar; b <= z.legBar + z.baseN; b++) if(Emotional(_Symbol, T, b)) emo = true;
   bool tooSm = TooSmall(Z, i);
   bool wDraw = (!InpOnlyQualified || z.chain) && !tooSm && (!z.tested || InpShowTested);
   string q = z.qual;
   bool rmOpp = StringFind(q, "removed opp. zone") >= 0, rmTL = StringFind(q, "removed trendline") >= 0;
   bool newHL = StringFind(q, "new high") >= 0 || StringFind(q, "new low") >= 0, rmPrev = StringFind(q, "removed the previous") >= 0;
   int aln = gTrend == z.dir ? 1 : (gTrend == -z.dir ? -1 : 0), baln = big == z.dir ? 1 : (big == -z.dir ? -1 : 0);
   bool nest = false, inOpp = false;
   double zlo = MathMin(z.prox, z.dist), zhi = MathMax(z.prox, z.dist);
   for(int j = 0; j < ArraySize(hz); j++)
     {
      if(hz[j].removed) continue;
      double lo2 = MathMin(hz[j].prox, hz[j].dist), hi2 = MathMax(hz[j].prox, hz[j].dist);
      if(MathMax(zlo, lo2) > MathMin(zhi, hi2)) continue;
      if(hz[j].dir == z.dir) nest = true; else inOpp = true;
     }
   ENUM_TIMEFRAMES ht = HtfOf(T);
   double cv = ht > 0 ? Curve(_Symbol, ht, z.prox) : 50;
   // nearest opposing zone of the same detector (ZV: the detected list; ALT: live ALT zones + this candle's new ones)
   double opp = 0;
   for(int j = isAlt ? nz : 0; j < (isAlt ? ArraySize(Z) : nz); j++)
     {
      if(Z[j].dir == z.dir || Z[j].removed) continue;
      if(z.dir > 0 && Z[j].prox > z.prox && (opp == 0 || Z[j].prox < opp)) opp = Z[j].prox;
      if(z.dir < 0 && Z[j].prox < z.prox && (opp == 0 || Z[j].prox > opp)) opp = Z[j].prox;
     }
   if(isAlt)
      for(int j = 0; j < ArraySize(RZ); j++)
        {
         if(RZ[j].slot != s || !RZ[j].alt || RZ[j].dir == z.dir || RZ[j].broken || RZ[j].v1St != "") continue;   // v2: a zone v1 already resolved is not live
         if(z.dir > 0 && RZ[j].prox > z.prox && (opp == 0 || RZ[j].prox < opp)) opp = RZ[j].prox;
         if(z.dir < 0 && RZ[j].prox < z.prox && (opp == 0 || RZ[j].prox > opp)) opp = RZ[j].prox;
        }
   double risk = hg + spr;
   double oppR = opp > 0 ? ((z.dir > 0 ? opp - z.prox : z.prox - opp) - spr) / risk : 0;
   if(oppR < 0) oppR = 0;
   MqlDateTime md; TimeToStruct(tNow, md);
   int hg0 = ((md.hour - InpResearchGMT) % 24 + 24) % 24;
   string ses = hg0 < 7 ? "Asia" : (hg0 < 12 ? "London" : (hg0 < 16 ? "LonNY" : (hg0 < 21 ? "NewYork" : "Late")));
   string wd[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
   string det = isAlt ? "ALT" : "ZV";
   int dg = _Digits;
   string c = "";
   RsC(c, det);                                                      // detector
   RsC(c, RsClean(_Symbol));                                         // symbol
   RsC(c, TfName(T));                                                // tf
   RsC(c, det + "-" + TfName(T) + "-" + (z.dir > 0 ? "D" : "S") + "-" + RsStamp(tB0));   // id
   RsC(c, RsTime(tNow));                                             // created
   RsC(c, RsTime(tB0));                                              // base_start
   RsC(c, RsTime(tB1));                                              // base_end
   RsC(c, z.dir > 0 ? "demand" : "supply");                          // type
   RsC(c, pat);                                                      // pattern
   RsC(c, RsD(z.prox, dg));                                          // proximal
   RsC(c, RsD(z.dist, dg));                                          // distal
   RsC(c, RsD(hg, dg));                                              // height
   RsC(c, RsD(hg / _Point, 0));                                      // height_pts
   RsC(c, RsD(hg / atr, 3));                                         // height_atr
   RsC(c, RsI(z.baseN));                                             // base_n
   RsC(c, RsD(legIn, 3));                                            // legin_atr
   RsC(c, RsD(legOut, 3));                                           // legout_atr
   RsC(c, RsD(z.legRatio, 3));                                       // leg_ratio
   RsC(c, RsD(mv, 3));                                               // moveaway_h_create
   RsC(c, RsD(z.gap, 3));                                            // gap
   RsC(c, RsB(emo));                                                 // emotional
   RsC(c, RsB(z.tested));                                            // tested_at_create
   RsC(c, RsB(wDraw));                                               // would_draw
   RsC(c, ver);                                                      // verdict
   RsC(c, gNGrade);                                                  // grade
   RsC(c, z.grade);                                                  // zgrade
   RsC(c, RsI(gNP - gNM - 2 * gNC));                                 // score
   RsC(c, RsI(gNP));                                                 // n_plus
   RsC(c, RsI(gNM));                                                 // n_minus
   RsC(c, RsI(gNC));                                                 // n_crit
   RsC(c, RsClean(gNTags));                                          // tags
   RsC(c, altStr);                                                   // alt_strength
   RsC(c, RsB(z.arrival));                                           // arrival
   RsC(c, RsB(z.chain));                                             // chain
   RsC(c, RsB(rmOpp));                                               // rm_opp_zone
   RsC(c, RsB(rmTL));                                                // rm_trendline
   RsC(c, RsB(newHL));                                               // new_high_low
   RsC(c, RsB(rmPrev));                                              // rm_prev_high_low
   RsC(c, RsB(z.leg2));                                              // leg2
   RsC(c, RsB(tooSm));                                               // too_small
   RsC(c, RsB(z.trap > 0));                                          // trap
   RsC(c, RsB(z.crowded));                                           // crowded
   RsC(c, RsI(swing));                                               // htf_trend
   RsC(c, RsI(tlb));                                                 // tl_bias
   RsC(c, RsI(gTrend));                                              // bias
   RsC(c, RsI(aln));                                                 // align
   RsC(c, RsI(big));                                                 // bigger_trend
   RsC(c, RsI(baln));                                                // bigger_align
   RsC(c, RsB(nest));                                                // nested
   RsC(c, RsB(inOpp));                                               // in_opp_htf
   RsC(c, RsD(cv, 1));                                               // curve
   RsC(c, RsD(oppR, 3));                                             // opp_R
   RsC(c, RsD(gNRR, 3));                                             // plan_rr
   RsC(c, ses);                                                      // session
   RsC(c, RsI(md.hour));                                             // hour
   RsC(c, wd[md.day_of_week % 7]);                                   // weekday
   RsC(c, RsD(atr, dg + 1));                                         // atr
   RsC(c, RsD(spr, dg + 1));                                         // spread
   ZoneDNA dx; LensOut lx; ZeroMemory(dx); ZeroMemory(lx);           // v2: DNA + lenses at creation
   if(gRsDna)
     {
      DnaCompute(T, Z, i, dx);
      if(dx.ok) { dx.planRR = gNRR; dx.stopAtr = dx.A1 > 0 ? MathAbs(gNEn - gNSl) / dx.A1 : 0; LensRun(dx, ver, gNGrade, gNP, gNM, gNC, lx); }
     }
   RZone nr; ZeroMemory(nr);
   nr.crow = c; nr.slot = s; nr.dir = z.dir; nr.alt = isAlt;
   nr.prox = z.prox; nr.dist = z.dist; nr.hgt = hg; nr.spr = spr; nr.risk = risk; nr.oppR = oppR;
   nr.endR = MathMax(5.0, (oppR > 0 && oppR <= 20) ? oppR : 0.0);   // a touch trade runs until 5R or the opposing zone, whichever is further
   nr.age = 0; nr.broken = false; nr.brokenT = 0; nr.brokenAge = 0;
   nr.runout = MathMax(0, mv); nr.nT = 0; nr.inTr = false;
   nr.away = z.dir > 0 ? SL(_Symbol, T, 1) > z.prox : SH(_Symbol, T, 1) < z.prox;
   nr.mfe = 0; nr.dep = 0; nr.r1 = false; nr.mfeC = 0; nr.cOn = false; nr.cRes = 0; nr.lossC = 0;
   for(int k = 0; k < 3; k++) { nr.tT[k] = 0; nr.tAge[k] = 0; nr.tDep[k] = 0; nr.tMfe[k] = 0; nr.tRes[k] = 0; nr.tEnd[k] = 0; nr.tEndAge[k] = 0; }
   nr.c2row = ""; nr.s1row = ""; nr.v1St = ""; nr.v1When = 0; nr.v1Age = 0; nr.s1Pend = false; nr.s1Lag = 0; nr.s1Dep = 0;
   nr.tBase = tB0; nr.zs = z; nr.b1R = -1; nr.b3R = -1; nr.mae = 0; nr.tgWow = -1; nr.tgOh = -1; nr.tgRo = -1;
   nr.rjOn = false; nr.rjPrev = false; nr.rjT = 0;
   for(int m = 0; m < 3; m++) { nr.mE[m] = 0; nr.mRisk[m] = 0; nr.mEnd[m] = 0; nr.mMfe[m] = 0; nr.mSt[m] = 3; nr.mArm[m] = false; nr.mRes[m] = 0; }
   if(gRsDna)
     {
      nr.c2row = RsV2Cols(dx, lx, dx.ok, false, "", aln);
      double ent[3] = {0, 0, 0};
      ent[0] = z.prox + z.dir * InpZ3Front * hg;                      // front: the bot's limit in front of the proximal
      ent[1] = z.prox - z.dir * 0.5 * hg;                             // mid: 50% into the zone
      ent[2] = z.dist + z.dir * 0.25 * hg;                            // Baker deep: 25% of the height inside, from the distal
      for(int m = 0; m < 3; m++)
        {
         nr.mE[m] = ent[m]; nr.mRisk[m] = MathAbs(ent[m] - z.dist) + spr; nr.mSt[m] = 0;
         double orm = opp > 0 ? (z.dir * (opp - ent[m]) - spr) / nr.mRisk[m] : 0;
         nr.mEnd[m] = MathMax(5.0, (orm > 0 && orm <= 20) ? orm : 0.0);   // the same end as v1: 5R or the opposing zone, whichever is further
        }
      nr.mArm[0] = z.dir > 0 ? SL(_Symbol, T, 1) > ent[0] : SH(_Symbol, T, 1) < ent[0];
      RsTargets(nr, dx);                                             // touch-1 targets from creation (the snapshot replaces them)
     }
   int n = ArraySize(RZ);
   ArrayResize(RZ, n + 1);
   RZ[n] = nr;
  }

//--- outcome tracking: one closed candle (shift sh) of slot s for every zone of that timeframe
void RsUpdate(int s, int sh)
  {
   ENUM_TIMEFRAMES T = rsTF[s];
   double bh = SH(_Symbol, T, sh), bl = SL(_Symbol, T, sh), bc = SC(_Symbol, T, sh);
   datetime bt = ST(_Symbol, T, sh);
   bool emo = Emotional(_Symbol, T, sh);
   double bo = SO(_Symbol, T, sh), ba = gRsDna ? ATR(T, sh) : 0;   // v2: Raja removal needs the body and the ATR
   for(int i = ArraySize(RZ) - 1; i >= 0; i--)
     {
      if(RZ[i].slot != s) continue;
      string st = RsStep(i, bh, bl, bc, emo, bt, sh, bo, ba);
      if(st != "") RsFinish(i, st, bt);
     }
  }
double RsR(int i, double price) { return RZ[i].dir > 0 ? (price - RZ[i].prox - RZ[i].spr) / RZ[i].risk : (RZ[i].prox - price - RZ[i].spr) / RZ[i].risk; }
void RsEndTouch(int i, int k, int res, datetime bt)
  {
   if(k < 0 || k > 2) return;
   RZ[i].tMfe[k] = RZ[i].mfe; RZ[i].tDep[k] = RZ[i].dep; RZ[i].tRes[k] = res; RZ[i].tEnd[k] = bt; RZ[i].tEndAge[k] = RZ[i].age;
   RZ[i].inTr = false; RZ[i].away = false;
  }
// returns "" while the zone is still followed, else the reason it resolved
string RsStep(int i, double bh, double bl, double bc, bool emo, datetime bt, int sh, double bo, double ba)
  {
   if(RZ[i].v1St != "")                                              // v2: v1 has resolved; only the v2 models / Raja check still run
     {
      RZ[i].age++;
      RsStep2(i, bh, bl, bc, bo, ba, bt, false, false, false, false);
      return (RsBusy(i) && RZ[i].age < InpResearchMaxBars) ? "" : RZ[i].v1St;
     }
   bool inTr0 = RZ[i].inTr, r10 = RZ[i].r1;                          // v2: the state before this candle
   int nT0 = RZ[i].nT;
   int d = RZ[i].dir;
   double px = RZ[i].prox, ds = RZ[i].dist, hz0 = RZ[i].hgt;
   RZ[i].age++;
   bool wick = d > 0 ? bl < ds : bh > ds;                            // stop order at the distal filled
   bool cb = d > 0 ? bc < ds : bc > ds;                              // candle closed beyond the distal
   bool touch = d > 0 ? bl <= px : bh >= px;
   double fR = RsR(i, d > 0 ? bh : bl), cR = RsR(i, bc);
   double pn = (d > 0 ? px - bl : bh - px) / hz0;                    // penetration into the zone, x height (1 = distal)
   // touch 1, close-stop model (stop only on a close beyond the distal)
   if(RZ[i].cOn)
     {
      if(cb) { RZ[i].cOn = false; RZ[i].cRes = 1; RZ[i].lossC = cR; }
      else
        {
         RZ[i].mfeC = MathMax(RZ[i].mfeC, fR);
         if(RZ[i].mfeC >= RZ[i].endR) { RZ[i].cOn = false; RZ[i].cRes = 2; }
        }
     }
   if(RZ[i].inTr)
     {
      int k = RZ[i].nT - 1;
      if(wick) { if(!RZ[i].r1) RZ[i].dep = MathMax(RZ[i].dep, pn); RsEndTouch(i, k, 1, bt); }   // a candle that hits the stop never counts its other extreme
      else
        {
         RZ[i].mfe = MathMax(RZ[i].mfe, fR);
         if(!RZ[i].r1) RZ[i].dep = MathMax(RZ[i].dep, pn);
         if(RZ[i].mfe >= 1) RZ[i].r1 = true;
         if(RZ[i].mfe >= RZ[i].endR) RsEndTouch(i, k, 2, bt);
        }
     }
   else if(!RZ[i].broken && RZ[i].nT < 3)
     {
      if(RZ[i].away && touch)
        {
         int k = RZ[i].nT;
         RZ[i].nT++;
         RZ[i].tT[k] = bt; RZ[i].tAge[k] = RZ[i].age;
         RZ[i].inTr = true; RZ[i].away = false; RZ[i].r1 = false;
         RZ[i].dep = MathMax(0, pn);
         RZ[i].mfe = 0;
         if(wick) RsEndTouch(i, k, 1, bt);
         else
           {
            RZ[i].mfe = MathMax(0, cR);                               // touch candle: only its close counts (order inside the candle unknown)
            if(RZ[i].mfe >= 1) RZ[i].r1 = true;
            if(RZ[i].mfe >= RZ[i].endR) RsEndTouch(i, k, 2, bt);
           }
         if(k == 0) { RZ[i].cOn = !cb; RZ[i].cRes = cb ? 1 : 0; RZ[i].mfeC = cb ? 0 : MathMax(0, cR); RZ[i].lossC = cb ? cR : 0; }
        }
      else if(!touch) RZ[i].away = true;
     }
   if(RZ[i].nT == 0) RZ[i].runout = MathMax(RZ[i].runout, (d > 0 ? bh - px : px - bl) / hz0);
   if(!RZ[i].broken && (cb || (wick && !emo))) { RZ[i].broken = true; RZ[i].brokenT = bt; RZ[i].brokenAge = RZ[i].age; }   // ZoneVision removal rule
   bool idle = !RZ[i].inTr && !RZ[i].cOn;
   string res = "";
   if(idle && RZ[i].broken) res = "broken";
   else if(idle && RZ[i].nT >= 3) res = "touches3";
   else if(RZ[i].age >= InpResearchMaxBars) res = "horizon";
   if(!gRsDna) return res;
   // v2: touch-1 snapshot request, extra entry models, MAE / bars to 1R / 3R, Raja removal
   bool t1Start = nT0 == 0 && RZ[i].nT == 1;
   bool t1Act = t1Start || (inTr0 && nT0 == 1);
   bool t1End = t1Act && !RZ[i].inTr;
   if(t1Start) { RZ[i].s1Pend = true; RZ[i].s1Lag = sh - 1; RZ[i].s1Dep = RZ[i].dep * 100; }
   RsStep2(i, bh, bl, bc, bo, ba, bt, t1Act, t1End, r10, inTr0);
   if((res == "broken" || res == "touches3") && RsBusy(i))            // keep following for v2 only; the v1 columns stay as they are now
     {
      RZ[i].v1St = res; RZ[i].v1When = bt; RZ[i].v1Age = RZ[i].age;
      for(int m = 0; m < 3; m++) if(RZ[i].mSt[m] == 0) RZ[i].mSt[m] = 3;
      return "";
     }
   return res;
  }
// v2 per candle: the front / mid / deep touch-1 models (same stop and end as v1), MAE and bars to 1R / 3R, Raja removal
void RsStep2(int i, double bh, double bl, double bc, double bo, double ba, datetime bt, bool t1Act, bool t1End, bool r1Before, bool inTrBefore)
  {
   int d = RZ[i].dir;
   double ds = RZ[i].dist;
   bool wick = d > 0 ? bl < ds : bh > ds;
   bool cb = d > 0 ? bc < ds : bc > ds;
   for(int m = 0; m < 3; m++)
     {
      if(RZ[i].mSt[m] == 0)
        {
         double lv = RZ[i].mE[m];
         bool fill = d > 0 ? bl <= lv : bh >= lv;
         bool can = m == 0 ? RZ[i].mArm[0] : t1Act;                   // front: after price was outside it; mid / deep: during the touch-1 trade
         if(can && fill && RZ[i].v1St == "")
           {
            RZ[i].mSt[m] = 1; RZ[i].mMfe[m] = 0;
            if(wick) { RZ[i].mSt[m] = 2; RZ[i].mRes[m] = 1; }
            else
              {
               RZ[i].mMfe[m] = MathMax(0, RsRm(i, m, bc));              // fill candle: only its close counts (as v1)
               if(RZ[i].mMfe[m] >= RZ[i].mEnd[m]) { RZ[i].mSt[m] = 2; RZ[i].mRes[m] = 2; }
              }
           }
         else if(m == 0 && !fill) RZ[i].mArm[0] = true;
         if(RZ[i].mSt[m] == 0 && ((m > 0 && t1End) || RZ[i].broken)) RZ[i].mSt[m] = 3;   // order cancelled: touch-1 trade over / zone removed
        }
      else if(RZ[i].mSt[m] == 1)
        {
         if(wick) { RZ[i].mSt[m] = 2; RZ[i].mRes[m] = 1; }             // a candle that hits the stop never counts its other extreme
         else
           {
            RZ[i].mMfe[m] = MathMax(RZ[i].mMfe[m], RsRm(i, m, d > 0 ? bh : bl));
            if(RZ[i].mMfe[m] >= RZ[i].mEnd[m]) { RZ[i].mSt[m] = 2; RZ[i].mRes[m] = 2; }
           }
        }
     }
   if(t1Act)
     {
      if(!(r1Before && inTrBefore)) RZ[i].mae = MathMin(RZ[i].mae, RsR(i, d > 0 ? bl : bh));   // worst R before 1R (the touch candle counts)
      int ag = RZ[i].age - RZ[i].tAge[0];
      if(RZ[i].mfe >= 1 && RZ[i].b1R < 0) RZ[i].b1R = ag;
      if(RZ[i].mfe >= 3 && RZ[i].b3R < 0) RZ[i].b3R = ag;
     }
   // Raja removal (RJ-B): a close beyond the distal, then the next candle also closing beyond with a body >= InpRajaBigBody x ATR
   if(!RZ[i].rjOn && RZ[i].rjPrev && cb && ba > 0 && MathAbs(bc - bo) >= InpRajaBigBody * ba) { RZ[i].rjOn = true; RZ[i].rjT = bt; }
   RZ[i].rjPrev = cb;
  }
double RsRm(int i, int m, double price) { return (RZ[i].dir * (price - RZ[i].mE[m]) - RZ[i].spr) / RZ[i].mRisk[m]; }
// still needed by v2 after v1 resolved: a snapshot to take, a model trade running, Raja's 2nd close (up to 3 candles)
bool RsBusy(int i)
  {
   if(RZ[i].s1Pend) return true;
   for(int m = 0; m < 3; m++) if(RZ[i].mSt[m] == 1) return true;
   return RZ[i].rjPrev && !RZ[i].rjOn && (RZ[i].v1St == "" || RZ[i].age - RZ[i].v1Age < 3);
  }
// write the zone's row (create + outcome) and stop following it
void RsFinish(int i, string st, datetime when)
  {
   if(RZ[i].inTr) RsEndTouch(i, RZ[i].nT - 1, 3, when);
   if(RZ[i].cOn) { RZ[i].cOn = false; RZ[i].cRes = 3; }
   string st1 = st; datetime wh1 = when; int ag1 = RZ[i].age;        // v2: a zone kept for the v2 models writes v1's own status / time / age
   if(RZ[i].v1St != "") { st1 = RZ[i].v1St; wh1 = RZ[i].v1When; ag1 = RZ[i].v1Age; }
   if(rsFile != INVALID_HANDLE)
     {
      string o = st1 + "," + RsTime(wh1) + "," + RsI(ag1) + "," + RsB(RZ[i].nT == 0) + "," + RsD(RZ[i].runout, 3) + "," + RsB(RZ[i].broken)
                 + "," + RsTime(RZ[i].brokenT) + "," + (RZ[i].broken ? RsI(RZ[i].brokenAge) : "") + "," + RsI(RZ[i].nT);
      for(int k = 0; k < 3; k++)
        {
         if(k >= RZ[i].nT) { for(int e = 0; e < 13; e++) o += ","; continue; }
         double m = RZ[i].tMfe[k];
         o += "," + RsTime(RZ[i].tT[k]) + "," + RsI(RZ[i].tAge[k]) + "," + RsD(RZ[i].tDep[k] * 100, 1) + "," + RsD(m, 3);
         for(int r = 1; r <= 5; r++) o += "," + RsB(m >= r);
         o += "," + RsB(RZ[i].oppR > 0 && m >= RZ[i].oppR) + "," + RsRes(RZ[i].tRes[k]) + "," + RsTime(RZ[i].tEnd[k]) + "," + RsI(RZ[i].tEndAge[k]);
        }
      o += "," + (RZ[i].nT > 0 ? RsD(RZ[i].mfeC, 3) : "") + "," + (RZ[i].nT > 0 ? RsRes(RZ[i].cRes) : "") + "," + (RZ[i].nT > 0 && RZ[i].cRes == 1 ? RsD(RZ[i].lossC, 3) : "");
      if(gRsDna) o += RZ[i].c2row + (RZ[i].s1row != "" ? RZ[i].s1row : gRsS1Empty) + RsV2Out(i);   // v2 columns after the v1 ones
      FileWrite(rsFile, RZ[i].crow + "," + o);
      rsDirty = true;
      rsCount++;
     }
   int n = ArraySize(RZ);
   if(i < n - 1) RZ[i] = RZ[n - 1];
   ArrayResize(RZ, n - 1);
  }

//+------------------------------------------------------------------+
//| v2 research columns (spec 6.1, InpResearchDNA). Appended after   |
//| the v1 columns: DNA + lenses at creation, the touch-1 snapshot   |
//| (s1_), then the extra entry models and outcomes. Every touch-    |
//| time value is taken on the touch candle's close (no look-ahead); |
//| the zone's own tested / removed state is the one just before the |
//| touch candle (the decision to buy at the proximal comes first).  |
//+------------------------------------------------------------------+
void   RsQ(string &r, bool hdr, bool skip, string nm, string v) { if(!skip) r += "," + (hdr ? nm : v); }
string RsKv(string v) { return v == "STRONG" ? "2" : (v == "OK" ? "1" : (v == "WEAK" ? "0" : "")); }
string RsKg(string g) { return g == "A" ? "0" : (g == "B" ? "1" : (g == "C" ? "2" : "")); }
// one DNA + lens result. pfx "" = at creation: columns v1 already writes are skipped and repeated names get "c_";
// pfx "s1_" = the touch snapshot, every column. hdr = column names. ok = false: empty values.
string RsV2Cols(ZoneDNA &x, LensOut &o, bool ok, bool hdr, string pfx, int aln)
  {
   string r = "";
   bool c = pfx == "";                                               // creation: skip v1's own columns
   string q = c ? "c_" : pfx;                                        // prefix of a name v1 uses with another meaning
   bool v = ok && !hdr, w = v && o.ok;
   RsQ(r, hdr, c, pfx + "base_n", v ? RsI(x.baseN) : "");
   RsQ(r, hdr, false, pfx + "base_rel", v ? RsD(x.baseRel, 3) : "");
   RsQ(r, hdr, false, pfx + "base_min", v ? RsD(x.baseMin, 0) : "");
   RsQ(r, hdr, c, pfx + "legin_atr", v ? RsD(x.leginAtr, 3) : "");
   RsQ(r, hdr, false, pfx + "legin_n", v ? RsI(x.leginN) : "");
   RsQ(r, hdr, false, pfx + "legin_spd", v ? RsD(x.leginSpd, 3) : "");
   RsQ(r, hdr, c, pfx + "leg_ratio", v ? RsD(x.legRatio, 3) : "");
   RsQ(r, hdr, c, pfx + "legout_atr", v ? RsD(x.legoutAtr, 3) : "");
   RsQ(r, hdr, false, pfx + "legout_body", v ? RsD(x.legoutBody, 3) : "");
   RsQ(r, hdr, false, pfx + "legout_n", v ? RsI(x.legoutN) : "");
   RsQ(r, hdr, false, pfx + "legout_spd", v ? RsD(x.legoutSpd, 3) : "");
   RsQ(r, hdr, false, pfx + "legout_rel", v ? RsD(x.legoutRel, 3) : "");
   RsQ(r, hdr, false, pfx + "gap_open", v ? RsD(x.gapOpen, 3) : "");
   RsQ(r, hdr, false, pfx + "gap_away", v ? RsB(x.gapAway) : "");
   RsQ(r, hdr, false, pfx + "departure", v ? RsI(x.departure) : "");
   RsQ(r, hdr, c, pfx + "gap", v ? RsD(x.gap, 3) : "");
   RsQ(r, hdr, false, q + "runout_h", v ? RsD(x.runoutH, 3) : "");
   RsQ(r, hdr, false, pfx + "runout_atr", v ? RsD(x.runoutAtr, 3) : "");
   RsQ(r, hdr, false, pfx + "runout_bars", v ? RsI(x.runoutBars) : "");
   RsQ(r, hdr, false, pfx + "rm_opp_n", v ? RsI(x.rmOppN) : "");
   RsQ(r, hdr, false, pfx + "rm_opp_move", v ? RsI(x.rmOppMove) : "");
   RsQ(r, hdr, c, pfx + "chain", v ? RsB(x.chain) : "");
   RsQ(r, hdr, c, pfx + "arrival", v ? RsB(x.arrival) : "");
   RsQ(r, hdr, c, pfx + "rm_opp_zone", v ? RsB(x.rmOppZone) : "");
   RsQ(r, hdr, c, pfx + "rm_trendline", v ? RsB(x.rmTL) : "");
   RsQ(r, hdr, c, pfx + "new_high_low", v ? RsB(x.newHL) : "");
   RsQ(r, hdr, c, pfx + "rm_prev_high_low", v ? RsB(x.rmPrevHL) : "");
   RsQ(r, hdr, c, pfx + "leg2", v ? RsB(x.leg2) : "");
   RsQ(r, hdr, false, pfx + "ath", v ? RsB(x.ath) : "");
   RsQ(r, hdr, false, pfx + "arrival_raja", v ? RsB(x.arrivalRaja) : "");
   RsQ(r, hdr, false, pfx + "raja_strong", v ? RsB(x.rajaStrong) : "");
   RsQ(r, hdr, false, pfx + "n_tests", v ? RsI(x.nTests) : "");
   RsQ(r, hdr, false, pfx + "depth_max", v ? RsD(x.depthMax, 1) : "");
   RsQ(r, hdr, false, pfx + "depth_1", v ? RsD(x.depth1, 1) : "");
   RsQ(r, hdr, false, pfx + "emo_depth", v ? RsD(x.emoDepth, 1) : "");
   RsQ(r, hdr, false, pfx + "depth_grade", v ? x.depthGrade : "");
   RsQ(r, hdr, false, pfx + "ret_next", v ? RsB(x.retNext) : "");
   RsQ(r, hdr, false, q + "nested", v ? RsB(x.nested) : "");
   RsQ(r, hdr, false, pfx + "nest_tf", v && x.nested ? TfName(x.nestTf) : "");
   RsQ(r, hdr, false, pfx + "nest_pos", v ? RsD(x.nested ? x.nestPos : 0, 3) : "");
   RsQ(r, hdr, c, pfx + "in_opp_htf", v ? RsB(x.inOppHtf) : "");
   RsQ(r, hdr, c, pfx + "curve", v ? RsD(x.curve, 1) : "");
   RsQ(r, hdr, false, pfx + "curve_zone", v ? RsD(x.curveZone, 1) : "");
   RsQ(r, hdr, false, pfx + "curve_bucket", v ? x.curveBucket : "");
   RsQ(r, hdr, false, pfx + "curve_raja", v ? RsB(x.curveRaja) : "");
   RsQ(r, hdr, c, pfx + "opp_R", v ? RsD(x.oppR, 3) : "");
   RsQ(r, hdr, false, pfx + "opp_htf_R", v ? RsD(x.oppHtfR, 3) : "");
   RsQ(r, hdr, false, pfx + "room_R", v ? RsD(x.roomR, 3) : "");
   RsQ(r, hdr, false, pfx + "wow_pips", v ? RsD(x.wowPips, 1) : "");
   RsQ(r, hdr, false, pfx + "origin_ok", v ? RsI(x.originOk) : "");
   RsQ(r, hdr, false, pfx + "left_opp_R", v ? RsD(x.leftOppR, 3) : "");
   RsQ(r, hdr, c, pfx + "emotional", v ? RsB(x.emotional) : "");
   RsQ(r, hdr, false, pfx + "novice_n", v ? RsI(x.noviceN) : "");
   RsQ(r, hdr, c, pfx + "height_atr", v ? RsD(x.heightAtr, 3) : "");
   RsQ(r, hdr, false, pfx + "height_pips", v ? RsD(x.heightPips, 1) : "");
   RsQ(r, hdr, false, pfx + "height_vs_med", v ? RsD(x.heightVsMed, 3) : "");
   RsQ(r, hdr, c, pfx + "too_small", v ? RsB(x.tooSmall) : "");
   RsQ(r, hdr, c, pfx + "session", v ? x.session : "");
   RsQ(r, hdr, c, pfx + "hour", v ? RsI(x.hour) : "");
   RsQ(r, hdr, c, pfx + "weekday", v ? RsI(x.weekday) : "");
   RsQ(r, hdr, false, pfx + "min_from_open", v ? RsI(x.minFromOpen) : "");
   RsQ(r, hdr, c, pfx + "trap", v ? RsB(x.trap) : "");
   RsQ(r, hdr, c, pfx + "crowded", v ? RsB(x.crowded) : "");
   RsQ(r, hdr, false, pfx + "cross_needed", v ? RsI(x.crossNeeded) : "");
   RsQ(r, hdr, false, pfx + "near_tl", v ? RsB(x.nearTl) : "");
   RsQ(r, hdr, false, pfx + "overext", v ? RsB(x.overext) : "");
   RsQ(r, hdr, false, pfx + "cp_run", v ? RsI(x.cpRun) : "");
   RsQ(r, hdr, false, pfx + "impulse", v ? RsB(x.impulse) : "");
   RsQ(r, hdr, false, pfx + "stacked", v ? RsB(x.stacked) : "");
   RsQ(r, hdr, false, pfx + "inherit", v ? RsB(x.inherit) : "");
   RsQ(r, hdr, false, pfx + "overlap", v ? RsB(x.overlap) : "");
   RsQ(r, hdr, false, pfx + "flip", v ? RsB(x.flip) : "");
   RsQ(r, hdr, false, pfx + "out_tl", v ? RsB(x.outTl) : "");
   RsQ(r, hdr, false, pfx + "raja_live", v ? RsB(x.rajaLive) : "");
   RsQ(r, hdr, false, pfx + "raja_type", v ? x.rajaType : "");
   RsQ(r, hdr, false, pfx + "appr_bars", v ? RsI(x.apprBars) : "");
   RsQ(r, hdr, false, pfx + "appr_spd", v ? RsD(x.apprSpd, 3) : "");
   RsQ(r, hdr, false, pfx + "new_opp_way", v ? RsI(x.newOppWay) : "");
   RsQ(r, hdr, false, pfx + "stair", v ? RsB(x.stair) : "");
   RsQ(r, hdr, false, pfx + "appr_prov", v ? RsB(x.apprProv) : "");
   RsQ(r, hdr, false, pfx + "dir", v ? RsI(x.dir) : "");
   RsQ(r, hdr, false, pfx + "dirq", v ? RsI(x.dirq) : "");
   RsQ(r, hdr, false, pfx + "st_etf", v ? RsI(x.stE) : "");
   RsQ(r, hdr, false, pfx + "st_itf", v ? RsI(x.stI) : "");
   RsQ(r, hdr, false, pfx + "st_htf", v ? RsI(x.stH) : "");
   RsQ(r, hdr, false, pfx + "st_p1", v ? RsI(x.stP) : "");
   RsQ(r, hdr, false, pfx + "align_dir", v ? RsI(x.align) : "");
   RsQ(r, hdr, c, pfx + "plan_rr", v ? RsD(x.planRR, 3) : "");
   RsQ(r, hdr, false, pfx + "stop_atr", v ? RsD(x.stopAtr, 3) : "");
   RsQ(r, hdr, c, pfx + "align", v ? RsI(aln) : "");
   // lenses (spec 4) and the consensus
   RsQ(r, hdr, false, pfx + "kv", w ? RsKv(o.kVer) : "");
   RsQ(r, hdr, false, pfx + "kg", w ? RsKg(o.kGrade) : "");
   RsQ(r, hdr, false, pfx + "sK", w ? RsI(o.scoreK) : "");
   RsQ(r, hdr, false, pfx + "sS", w ? RsI(o.scoreS) : "");
   RsQ(r, hdr, false, pfx + "sS_parts", w ? StringFormat("%d%d%d%d%d%d", o.sDep, o.sMar, o.sBig, o.sTst, o.sTim, o.sArr) : "");
   RsQ(r, hdr, false, pfx + "sR", w ? RsI(o.scoreR) : "");
   RsQ(r, hdr, false, pfx + "sB", w ? RsI(o.scoreB) : "");
   RsQ(r, hdr, false, pfx + "pass_k", w ? RsB(o.passK) : "");
   RsQ(r, hdr, false, pfx + "pass_s", w ? RsB(o.passS) : "");
   RsQ(r, hdr, false, pfx + "pass_r", w ? RsB(o.passR) : "");
   RsQ(r, hdr, false, pfx + "pass_b", w ? RsB(o.passB) : "");
   RsQ(r, hdr, false, pfx + "n_pass", w ? RsI(o.nPass) : "");
   RsQ(r, hdr, false, pfx + "cons", w ? RsD(o.cons, 1) : "");
   RsQ(r, hdr, false, c ? "v2verdict" : pfx + "verdict", w ? o.verdict : "");
   RsQ(r, hdr, false, pfx + "entry_modes", w ? RsI(o.emK * 1000 + o.emS * 100 + o.emR * 10 + o.emB) : "");
   return r;
  }
// the touch-1 snapshot block: s1_ok / lag / found / time / touch-candle depth, then every DNA + lens column with "s1_"
string RsS1Cols(ZoneDNA &x, LensOut &o, bool ok, bool hdr, int lag, bool found, datetime t, double tdep, int aln)
  {
   string r = "";
   RsQ(r, hdr, false, "s1_ok", RsB(ok));
   RsQ(r, hdr, false, "s1_lag", ok ? RsI(lag) : "");
   RsQ(r, hdr, false, "s1_found", ok ? RsB(found) : "");
   RsQ(r, hdr, false, "s1_time", ok ? RsTime(t) : "");
   RsQ(r, hdr, false, "s1_touch_depth", ok ? RsD(tdep, 1) : "");
   r += RsV2Cols(x, o, ok, hdr, "s1_", aln);
   return r;
  }
string RsV2OutHdr()
  {
   string r = "";
   string pf[3] = {"t1f_", "t1m_", "t1d_"};
   for(int m = 0; m < 3; m++) r += "," + pf[m] + "fill," + pf[m] + "mfe," + pf[m] + "result";
   r += ",t1_bars_to_1R,t1_bars_to_3R,t1_mae,t1_hit_wow1,t1_hit_opp_htf,t1_hit_runout_ext,broken_raja,broken_raja_time";
   return r;
  }
// a touch-1 target in R reached before the stop: 1 / 0, "" = no touch, no target, or the trade ended (5R / opposing zone) first
string RsHitT(int i, double tg)
  {
   if(RZ[i].nT < 1 || tg <= 0) return "";
   if(RZ[i].tMfe[0] >= tg) return "1";
   return RZ[i].tRes[0] == 2 ? "" : "0";
  }
string RsV2Out(int i)
  {
   string r = "";
   for(int m = 0; m < 3; m++)
     {
      bool f = RZ[i].mSt[m] == 1 || RZ[i].mSt[m] == 2;
      int res = RZ[i].mSt[m] == 1 ? 3 : RZ[i].mRes[m];                // still running at the end = open
      r += "," + RsB(f) + "," + (f ? RsD(RZ[i].mMfe[m], 3) : "") + "," + (f ? RsRes(res) : "");
     }
   bool t1 = RZ[i].nT >= 1;
   r += "," + ((t1 && RZ[i].b1R >= 0) ? RsI(RZ[i].b1R) : "") + "," + ((t1 && RZ[i].b3R >= 0) ? RsI(RZ[i].b3R) : "") + "," + (t1 ? RsD(RZ[i].mae, 3) : "");
   r += "," + RsHitT(i, RZ[i].tgWow) + "," + RsHitT(i, RZ[i].tgOh) + "," + RsHitT(i, RZ[i].tgRo);
   r += "," + RsB(RZ[i].rjOn) + "," + RsTime(RZ[i].rjT);
   return r;
  }
// touch-1 targets in R (v1 risk = height + spread): WOW1, the opposing ITF / HTF proximal, the run-out extreme
void RsTargets(RZone &r, ZoneDNA &x)
  {
   r.tgWow = -1; r.tgOh = -1; r.tgRo = -1;
   if(!x.ok || r.risk <= 0) return;
   if(x.wowPx > 0) r.tgWow = (r.dir * (x.wowPx - r.prox) - r.spr) / r.risk;
   if(x.hasOppHtf) r.tgOh = x.oppHtfR;
   if(x.runoutH > 0) r.tgRo = (x.runoutH * r.hgt - r.spr) / r.risk;
  }
// the touch-1 snapshot of RZ[ri] in the research context of its TF (called from RsCreate, Z = ZV zones [0, nz) + ALT [nz, nb))
void RsSnap(int ri, ENUM_TIMEFRAMES T, int nz, int nb)
  {
   RZ[ri].s1Pend = false;
   int d = RZ[ri].dir;
   int base = nb;
   ArrayResize(Z, base);
   int idx = -1;
   if(!RZ[ri].alt)
      for(int j = 0; j < nz && idx < 0; j++)
         if(Z[j].dir == d && ST(_Symbol, T, Z[j].legBar + Z[j].baseN) == RZ[ri].tBase) idx = j;
   bool found = idx >= 0;
   Zone keep; ZeroMemory(keep);
   if(found) keep = Z[idx];
   else                                                              // not in Detect's window (or ALT): the creation zone, moved to today's bar numbers
     {
      Zone zz = RZ[ri].zs;
      int sb = SBarShift(_Symbol, T, RZ[ri].tBase);
      int dl = sb - (zz.legBar + zz.baseN);
      if(sb < 0 || zz.legBar + dl < 2) { RZ[ri].s1row = gRsS1Empty; ArrayResize(Z, nb); return; }
      zz.legBar += dl; zz.saBar += dl; zz.baseEnd += dl;
      if(zz.trapBar >= 0) zz.trapBar += dl;
      zz.tested = false; zz.testedBar = -1; zz.removed = false; zz.removedBar = -1;
      ArrayResize(Z, base + 1);
      Z[base] = zz; idx = base;
     }
   if(Z[idx].removed && Z[idx].removedBar <= 1) { Z[idx].removed = false; Z[idx].removedBar = -1; }   // the zone as it was before the touch candle
   if(Z[idx].tested && Z[idx].testedBar <= 1) { Z[idx].tested = false; Z[idx].testedBar = -1; }
   Qualify();                                                        // chain flags re-run at the touch (spec 1.2: fixes the 5-bar under-count)
   int tb = -1; bool crw = false;
   Z[idx].trap = FindTrap(_Symbol, T, Z[idx].dir, Z[idx].prox, Z[idx].dist, Z[idx].saBar, Z[idx].baseEnd, tb, crw);
   Z[idx].trapBar = tb == -1 ? -2 : tb; Z[idx].crowded = crw;
   string ver = "", why = "";
   ZoneNotes(Z, idx, ver, why);
   ZoneDNA sx; LensOut so; ZeroMemory(sx); ZeroMemory(so);
   gDnaTestStop = 1;                                                 // the touch candle is the trade, not an earlier test
   DnaCompute(T, Z, idx, sx);
   gDnaTestStop = 0;
   if(sx.ok)
     {
      sx.planRR = gNRR; sx.stopAtr = sx.A1 > 0 ? MathAbs(gNEn - gNSl) / sx.A1 : 0;
      sx.minFromOpen = DnaMinFromOpen(ST(_Symbol, T, 1));
      LensRun(sx, ver, gNGrade, gNP, gNM, gNC, so);
      RsTargets(RZ[ri], sx);
     }
   int aln = gTrend == d ? 1 : (gTrend == -d ? -1 : 0);
   RZ[ri].s1row = RsS1Cols(sx, so, sx.ok, false, RZ[ri].s1Lag, found, RZ[ri].tT[0], RZ[ri].s1Dep, aln);
   if(found) Z[idx] = keep;
   ArrayResize(Z, nb);
  }

//--- ALT detector: the II_SupDem IDEA re-implemented (own code, nothing copied).
// Classic ZigZag(depth 3, deviation 2 pips, backstep 2) on closed candles; every confirmed turn (not the last, still moving
// one) is a candidate: peak -> supply, valley -> demand. Distal = the turn's wick; proximal = the nearest of the turn's body
// edge and the neighbours' wick / body edges. Made when a later candle trades fully beyond the proximal (departure).
// A newer turn whose wick reaches into an older live ALT zone of the same side is dropped (the older zone wins).
// Strength (look-left): 2 older candles fully on the proximal side before 2 beyond the distal = STRONG, else WEAK.
bool RsSeen(int s, int d, datetime t)
  {
   for(int i = ArraySize(rsSeenT) - 1; i >= 0; i--) if(rsSeenT[i] == t && rsSeenD[i] == d && rsSeenS[i] == s) return true;
   return false;
  }
void RsMark(int s, int d, datetime t)
  {
   int n = ArraySize(rsSeenT);
   if(n >= 600)
     {
      int keep = 400;
      for(int i = 0; i < keep; i++) { rsSeenS[i] = rsSeenS[n - keep + i]; rsSeenD[i] = rsSeenD[n - keep + i]; rsSeenT[i] = rsSeenT[n - keep + i]; }
      n = keep;
     }
   ArrayResize(rsSeenS, n + 1); ArrayResize(rsSeenD, n + 1); ArrayResize(rsSeenT, n + 1);
   rsSeenS[n] = s; rsSeenD[n] = d; rsSeenT[n] = t;
  }
bool RsAltInside(int s, int d, double wk)
  {
   for(int i = 0; i < ArraySize(RZ); i++)
     {
      if(RZ[i].slot != s || !RZ[i].alt || RZ[i].dir != d || RZ[i].broken || RZ[i].v1St != "") continue;   // v2: resolved for v1 = gone
      if(d < 0 && wk > RZ[i].prox && wk <= RZ[i].dist) return true;
      if(d > 0 && wk < RZ[i].prox && wk >= RZ[i].dist) return true;
     }
   return false;
  }
int RsAlt(int s, ENUM_TIMEFRAMES T, bool first, Zone &out[], string &str[])
  {
   ArrayResize(out, 0); ArrayResize(str, 0);
   int n = MathMin(InpLookback + 50, iBars(_Symbol, T) - 5);
   if(n < 40) return 0;
   double ah[], al[], ao[], ac[]; datetime at[];                     // oldest first: index n-1 = the last closed candle (shift 1)
   if(CopyHigh(_Symbol, T, 1, n, ah) != n || CopyLow(_Symbol, T, 1, n, al) != n || CopyOpen(_Symbol, T, 1, n, ao) != n
      || CopyClose(_Symbol, T, 1, n, ac) != n || CopyTime(_Symbol, T, 1, n, at) != n) return 0;
   double pip = (_Digits == 3 || _Digits == 5) ? 10 * _Point : _Point, dev = 2 * pip;
   const int zDepth = 3, zBack = 2;
   double hm[], lm[]; int zt[];
   ArrayResize(hm, n); ArrayResize(lm, n); ArrayResize(zt, n);
   ArrayInitialize(hm, 0); ArrayInitialize(lm, 0); ArrayInitialize(zt, 0);
   double lastLo = 0, lastHi = 0;
   for(int i = zDepth - 1; i < n; i++)
     {
      double v = al[ArrayMinimum(al, i - zDepth + 1, zDepth)];
      if(v == lastLo) v = 0;
      else
        {
         lastLo = v;
         if(al[i] - v > dev) v = 0;
         else for(int b = 1; b <= zBack && i - b >= 0; b++) if(lm[i - b] != 0 && lm[i - b] > v) lm[i - b] = 0;
        }
      lm[i] = (v != 0 && al[i] == v) ? v : 0;
      double w = ah[ArrayMaximum(ah, i - zDepth + 1, zDepth)];
      if(w == lastHi) w = 0;
      else
        {
         lastHi = w;
         if(w - ah[i] > dev) w = 0;
         else for(int b = 1; b <= zBack && i - b >= 0; b++) if(hm[i - b] != 0 && hm[i - b] < w) hm[i - b] = 0;
        }
      hm[i] = (w != 0 && ah[i] == w) ? w : 0;
     }
   // alternate peaks and valleys; a more extreme point of the same kind replaces the previous one
   int look = 0, lhP = -1, llP = -1; double lh = 0, ll = 0;
   for(int i = zDepth - 1; i < n; i++)
     {
      if(look == 0)
        {
         if(hm[i] != 0) { lh = hm[i]; lhP = i; zt[i] = 1; look = -1; }
         else if(lm[i] != 0) { ll = lm[i]; llP = i; zt[i] = -1; look = 1; }
        }
      else if(look == 1)
        {
         if(lm[i] != 0 && lm[i] < ll && hm[i] == 0) { if(llP >= 0) zt[llP] = 0; ll = lm[i]; llP = i; zt[i] = -1; }
         if(hm[i] != 0 && lm[i] == 0) { lh = hm[i]; lhP = i; zt[i] = 1; look = -1; }
        }
      else
        {
         if(hm[i] != 0 && hm[i] > lh && lm[i] == 0) { if(lhP >= 0) zt[lhP] = 0; lh = hm[i]; lhP = i; zt[i] = 1; }
         if(lm[i] != 0 && hm[i] == 0) { ll = lm[i]; llP = i; zt[i] = -1; look = 1; }
        }
     }
   int pI[]; int np = 0;
   for(int i = 0; i < n; i++) if(zt[i] != 0) { ArrayResize(pI, np + 1); pI[np] = i; np++; }
   int made = 0;
   for(int k = 0; k < np - 1; k++)                                   // the newest turn can still move: confirmed turns only
     {
      int q = pI[k];
      if(q < 1 || q > n - 2 || q < n - 150) continue;
      int d = zt[q] > 0 ? -1 : 1;                                    // peak -> supply, valley -> demand
      if(RsSeen(s, d, at[q])) continue;
      if(first) { RsMark(s, d, at[q]); continue; }                   // turns from before the start are not logged
      double px = 0, ds = 0;
      if(d < 0)
        {
         ds = ah[q];
         px = MathMax(MathMin(ao[q], ac[q]), MathMax(MathMax(al[q - 1], al[q + 1]), MathMax(MathMin(ao[q - 1], ac[q - 1]), MathMin(ao[q + 1], ac[q + 1]))));
        }
      else
        {
         ds = al[q];
         px = MathMin(MathMax(ao[q], ac[q]), MathMin(MathMin(ah[q - 1], ah[q + 1]), MathMin(MathMax(ao[q - 1], ac[q - 1]), MathMax(ao[q + 1], ac[q + 1]))));
        }
      if((d < 0 && px >= ds) || (d > 0 && px <= ds)) { RsMark(s, d, at[q]); continue; }
      int depj = -1; bool dead = false;
      for(int j = q + 1; j < n; j++)
        {
         if((d < 0 && ah[j] > ds) || (d > 0 && al[j] < ds)) { dead = true; break; }
         if((d < 0 && ah[j] < px) || (d > 0 && al[j] > px)) { depj = j; break; }
        }
      if(dead) { RsMark(s, d, at[q]); continue; }
      if(depj < 0) continue;                                         // price has not left yet: look again next candle
      bool tst = false;
      for(int j = depj + 1; j < n; j++)
        {
         if((d < 0 && ah[j] > ds) || (d > 0 && al[j] < ds)) { dead = true; break; }
         if((d < 0 && ah[j] >= px) || (d > 0 && al[j] <= px)) tst = true;
        }
      RsMark(s, d, at[q]);
      if(dead) continue;
      if(RsAltInside(s, d, ds)) continue;
      bool dupNew = false;
      for(int j = 0; j < ArraySize(out); j++) if(out[j].dir == d && ((d < 0 && ds > out[j].prox && ds <= out[j].dist) || (d > 0 && ds < out[j].prox && ds >= out[j].dist))) dupNew = true;
      if(dupNew) continue;
      int cin = 0, cout = 0;
      for(int j = q - 1; j >= 0 && cin < 2 && cout < 2; j--)
        {
         if((d < 0 && ah[j] < px) || (d > 0 && al[j] > px)) cin++;
         if((d < 0 && ah[j] > ds) || (d > 0 && al[j] < ds)) cout++;
        }
      int sp = n - q;                                                // series shift of the turn candle
      double hgt = MathAbs(px - ds);
      double rb = MathMax(Rng(_Symbol, T, sp), _Point);
      Zone z; ZeroMemory(z);
      z.dir = d; z.prox = px; z.dist = ds;
      z.legBar = sp - 1; z.baseN = 1; z.saBar = MathMax(1, sp - 2);  // base = the turn candle, leg out = the candle after it
      z.legRatio = Rng(_Symbol, T, sp - 1) / rb;
      z.cont = CDir(_Symbol, T, sp + 1) == d;
      z.grade = z.legRatio >= 2.5 ? "A" : (z.legRatio >= 1.8 ? "B" : "C");
      z.gap = d > 0 ? (iLow(_Symbol, T, z.saBar) - px) / hgt : (px - iHigh(_Symbol, T, z.saBar)) / hgt;
      z.leg2 = !Basing(_Symbol, T, z.saBar) && CDir(_Symbol, T, z.saBar) == d && Rng(_Symbol, T, z.saBar) >= rb * InpMinLegRatio;
      z.chain = false; z.arrival = false; z.tested = tst; z.removed = false; z.removedBar = -1; z.testedBar = -1;
      z.qual = ""; z.trap = 0; z.trapBar = -1; z.crowded = false; z.baseEnd = sp;
      int no = ArraySize(out);
      ArrayResize(out, no + 1); ArrayResize(str, no + 1);
      out[no] = z; str[no] = cout >= 2 ? "WEAK" : "STRONG";
      made++;
     }
   return made;
  }
//+------------------------------------------------------------------+
