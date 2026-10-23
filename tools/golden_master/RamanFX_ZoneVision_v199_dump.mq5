//+------------------------------------------------------------------+
//| RamanFX_ZoneVision.mq5  (MT5 port of RamanFX_ZoneVision.mq4 1.99) |
//| GOLDEN-MASTER BASELINE: v1.99 unchanged + the v2 M0 object dump   |
//| (InpDumpObjects). Used only to record the reference dumps.        |
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
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.99"
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
input bool   InpCompactPanel  = true;   // Panel as a compact top-left box (click its header to collapse); false = MT4-style Comment
input bool   InpAlertStrong   = true;   // Alert when price reaches a fresh STRONG zone (once per zone)
input bool   InpAlertTL       = true;   // Alert when a drawn trendline (this chart or HTF) breaks on the last closed candle
input bool   InpPush          = false;  // Also send alerts as push notifications (set up MetaQuotes ID in Tools > Options > Notifications)
input bool   InpRedrawOnHTF   = true;   // Also redraw when a higher-timeframe candle opens (not only this chart's)
input bool   InpExtraTF       = true;   // Support MT5-only timeframes (M2..M20, H2, H3, H6, H8, H12) via the nearest standard TF
input bool   InpAutoTheme     = true;   // Dark chart background: switch default colours to readable dark-theme ones
input group "-- Zone research (tester) --"
input bool   InpResearch        = false;              // Zone research: log every zone + what happened next (always on in the Strategy Tester)
input string InpResearchTFs     = "M15,H1,H4";        // Research timeframes (analysed whatever the chart timeframe is)
input bool   InpResearchAlt     = true;               // Also log the ALT detector (ZigZag 3/2/2 pivot zones, II_SupDem idea)
input int    InpResearchMaxBars = 200;                // Follow-up horizon in bars of the zone's timeframe
input string InpResearchFile    = "RFX_ZoneResearch"; // CSV name: Terminal\Common\Files\<name>_<symbol>_<from>_<to>.csv
input bool   InpResearchDraw    = true;               // Research on: still draw the chart (false = faster test, nothing drawn)
input int    InpResearchGMT     = 2;                  // Server time minus GMT in hours (only for the session column)
input group "-- v2 developer --"
input bool     InpDumpObjects = false;  // Golden master: write every v1 object (RFXV_ RFXN_ RFXS_ RFXP2_) to Common\Files\RFX_Dump_<sym>_<tf>.csv
input datetime InpDumpAt      = 0;      // Golden master: dump once at the first redraw at / after this bar time (0 = after every redraw)

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
int    gPanX = 0, gPanY = 0, gPanW = 0, gPanH = 0;

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
   datetime tT[3];
   int      tAge[3];
   double   tDep[3], tMfe[3];
   int      tRes[3];       // 0 none, 1 stop, 2 target (5R or opposing zone), 3 open at horizon / test end
   datetime tEnd[3];
   int      tEndAge[3];
   bool     alt;           // zone from the ALT detector
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
//| Chart-series helpers (replace MT4 Time[] High[] Low[] ...)       |
//+------------------------------------------------------------------+
datetime cT(int i) { return iTime(_Symbol, CTF, i); }
double   cH(int i) { return iHigh(_Symbol, CTF, i); }
double   cL(int i) { return iLow(_Symbol, CTF, i); }
double   cO(int i) { return iOpen(_Symbol, CTF, i); }
double   cC(int i) { return iClose(_Symbol, CTF, i); }
int      cBars()   { return iBars(_Symbol, CTF); }
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
   gDark = InpAutoTheme && BgIsDark();
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
  }

//+------------------------------------------------------------------+
//| Init / deinit                                                    |
//+------------------------------------------------------------------+
int OnInit()
  {
   CTF = Period();
   ApplyTheme();
   aCap = MathMax(InpLookback, 20) + 80;
   ArrayResize(aV, MAXTF * aCap);
   ArrayInitialize(aV, 0);
   AtrSlot(CTF);
   ENUM_TIMEFRAMES h = HtfOf(CTF);
   if(h > 0) AtrSlot(h);
   for(int lv = 1; lv <= MathMin(InpHTFLevels, 7); lv++) { ENUM_TIMEFRAMES t = StepUp(CTF, lv); if(t > 0) AtrSlot(t); }
   lastDraw = 0; gArmed = false; gTouchArmed = false; gTries = 0;
   gRs = InpResearch || (bool)MQLInfoInteger(MQL_TESTER);
   if(gRs) RsInit();
   return(INIT_SUCCEEDED);
  }
void OnDeinit(const int r)
  {
   if(gRs) RsClose();
   ObjectsDeleteAll(0, PFX); ObjectsDeleteAll(0, "RFXN_"); ObjectsDeleteAll(0, "RFXP2_"); ObjectsDeleteAll(0, "RFXS_"); Comment("");
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
  }
// price reached a fresh STRONG zone that is drawn on the chart (once per zone)
void CheckTouch()
  {
   if(!InpAlertStrong) return;
   double b = SBid();
   for(int k = 0; k < ArraySize(zKey); k++)
     {
      if(zVer[k] != "STRONG" || zState[k] != "fresh") continue;
      bool hit = zDir[k] > 0 ? b <= zProx[k] : b >= zProx[k];
      if(!hit) continue;
      string key = "T" + DoubleToString(zProx[k], _Digits) + (zDir[k] > 0 ? "d" : "s");
      if(Alerted(key)) continue;
      MarkAlerted(key);
      if(gTouchArmed)
         Notify(StringFormat("ZoneVision %s %s: price reached the STRONG %s zone %s (entry %s, SL %s%s)", _Symbol, TfName(CTF), zDir[k] > 0 ? "demand" : "supply",
                DoubleToString(zProx[k], _Digits), DoubleToString(zEn[k], _Digits), DoubleToString(zSl[k], _Digits), zTp[k] > 0 ? ", TP " + DoubleToString(zTp[k], _Digits) : ""));
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
  }
void ClearReg()
  {
   ArrayResize(zKey, 0); ArrayResize(zTxt, 0); ArrayResize(zVer, 0); ArrayResize(zState, 0); ArrayResize(zDir, 0);
   ArrayResize(zProx, 0); ArrayResize(zDist, 0); ArrayResize(zEn, 0); ArrayResize(zSl, 0); ArrayResize(zTp, 0); ArrayResize(zRR, 0); ArrayResize(zT1, 0);
  }
void HidePop() { gPopW = 0; gPopH = 0; if(ObjectFind(0, "RFXP2_bg") >= 0) { ObjectsDeleteAll(0, "RFXP2_"); ChartRedraw(); } }
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
   if(InpRichPopup) ShowPopRich(zi, x, y); else ShowPopPlain(zTxt[zi], x, y);
   if(InpClickPlan) DrawClickPlan(zi);
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
      if(sparam == "RFXS_h") { gPanelOpen = !gPanelOpen; DrawCompact(); NoSelect("RFXS_"); ChartRedraw(); return; }
      if(sparam == "RFXP2_x") { HidePop(); return; }
      if(StringFind(sparam, "RFXP2_") == 0 || StringFind(sparam, "RFXS_") == 0) return;   // a click inside the box / panel keeps the box open
      for(int i = 0; i < ArraySize(zKey); i++)
         if(sparam == zKey[i] || sparam == zKey[i] + "n" || sparam == zKey[i] + "p" || sparam == zKey[i] + "d") { ShowPop(i, (int)lparam, (int)dparam); return; }
      HidePop();
      return;
     }
   if(id == CHARTEVENT_CLICK && GetTickCount() - popAt > 300)                // a click on empty chart closes it
     {
      int x = (int)lparam, y = (int)dparam;
      if(Inside(x, y, gPopX, gPopY, gPopW, gPopH) || Inside(x, y, gPanX, gPanY, gPanW, gPanH)) return;
      HidePop();
      return;
     }
   if(id == CHARTEVENT_CHART_CHANGE && InpAutoTheme && BgIsDark() != gDark)  // chart colours changed: redraw in the new theme
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
   if(gRs) { RsRun(); if(!InpResearchDraw) return rates_total; }   // research pass first; it restores everything the drawing uses
   bool htfNew = InpRedrawOnHTF && lastDraw > 0 && HtfChanged();
   if(cT(0) == lastDraw && prev_calculated > 0 && !htfNew)
     {
      if(TimeLocal() - lastPanel >= 5) { lastPanel = TimeLocal(); Panel(); NoSelect(PFX); NoSelect("RFXS_"); }   // light refresh between candles
      if(InpShowBotOrders && TimeLocal() - lastNotes >= 20) { lastNotes = TimeLocal(); BotNotes(); }   // bot notes file read every 20s
      CheckTouch();
      return rates_total;
     }
   if(!DataReady() && gTries < 30) { gTries++; return 0; }    // MT5 still loading the HTF history / ATR: try again next tick
   gTries = 0;
   Redraw();
   CheckTouch();
   return rates_total;
  }
void CopyHtfLine(ENUM_TIMEFRAMES h)
  {
   gHTF = h; gHUpOn = gUpOn; gHUpS = gUpS; gHUpP = gUpP; gHUpW = gUpW; gHUpB = gUpB; gHDnOn = gDnOn; gHDnS = gDnS; gHDnP = gDnP; gHDnW = gDnW; gHDnB = gDnB;
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
   if(InpShowHTF) { ENUM_TIMEFRAMES h = HtfOf(CTF); if(h > 0) { Detect(_Symbol, h, HZ, false); DrawZones(HZ, true); } }   // HTF band first, underneath
   DrawZones(Z, false);
   if(InpShowEmotional) MarkEmotional();
   if(InpShowPanel || InpShowPlan) Panel();
   if(InpShowBotOrders) BotNotes();
   NoSelect(PFX); NoSelect("RFXN_"); NoSelect("RFXS_");
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
// n steps up the timeframe ladder M1 M5 M15 H1 H4 D1 W1 MN1 (PERIOD_CURRENT = none)
ENUM_TIMEFRAMES StepUp(ENUM_TIMEFRAMES tf, int n)
  {
   ENUM_TIMEFRAMES lad[8] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};   // M30 skipped: M15 -> H1, H4, D1
   int i = -1; for(int k = 0; k < 8; k++) if(lad[k] == tf) i = k;
   if(tf == PERIOD_M30) i = 2;
   if(i < 0 && InpExtraTF) for(int k = 7; k >= 0; k--) if(lad[k] < tf) { i = k; break; }   // MT5-only TF: steps from the standard TF below it (H2 -> H4, D1 ...)
   if(i < 0) return PERIOD_CURRENT;
   return i + n < 8 ? lad[i + n] : PERIOD_CURRENT;
  }
ENUM_TIMEFRAMES HtfOf(ENUM_TIMEFRAMES tf)
  {
   switch(tf) { case PERIOD_M1: return PERIOD_M15; case PERIOD_M5: return PERIOD_H1; case PERIOD_M15: return PERIOD_H4;
                case PERIOD_H1: return PERIOD_D1; case PERIOD_H4: return PERIOD_W1; case PERIOD_D1: return PERIOD_MN1; default: break; }
   if(InpExtraTF)                                                    // MT5-only TFs pair like the standard TF just below them
      switch(tf) { case PERIOD_M2: case PERIOD_M3: case PERIOD_M4: return PERIOD_M15;
                   case PERIOD_M6: case PERIOD_M10: case PERIOD_M12: return PERIOD_H1;
                   case PERIOD_M20: return PERIOD_H4;
                   case PERIOD_H2: case PERIOD_H3: return PERIOD_D1;
                   case PERIOD_H6: case PERIOD_H8: case PERIOD_H12: return PERIOD_W1; default: break; }
   return PERIOD_CURRENT;
  }
string TfName(ENUM_TIMEFRAMES tf)
  {
   switch(tf) { case PERIOD_M1: return "M1"; case PERIOD_M5: return "M5"; case PERIOD_M15: return "M15"; case PERIOD_M30: return "M30"; case PERIOD_H1: return "H1";
                case PERIOD_H4: return "H4"; case PERIOD_D1: return "D1"; case PERIOD_W1: return "W1"; case PERIOD_MN1: return "MN"; default: break; }
   string e = EnumToString(tf);
   if(StringFind(e, "PERIOD_") == 0) return StringSubstr(e, 7);
   return IntegerToString((int)tf);
  }
double Rng(string s, ENUM_TIMEFRAMES tf, int i)  { return iHigh(s, tf, i) - iLow(s, tf, i); }
double Body(string s, ENUM_TIMEFRAMES tf, int i) { return MathAbs(iClose(s, tf, i) - iOpen(s, tf, i)); }
bool   Basing(string s, ENUM_TIMEFRAMES tf, int i) { double r = Rng(s, tf, i); return r > 0 && Body(s, tf, i) / r < 0.5; }
int    CDir(string s, ENUM_TIMEFRAMES tf, int i) { return iClose(s, tf, i) > iOpen(s, tf, i) ? 1 : (iClose(s, tf, i) < iOpen(s, tf, i) ? -1 : 0); }
bool   Emotional(string s, ENUM_TIMEFRAMES tf, int i) { double a = ATR(tf, i + 1); return a > 0 && Rng(s, tf, i) > InpEmoATR * a; }
datetime BarTime(string s, ENUM_TIMEFRAMES tf, int i) { return i >= 0 ? iTime(s, tf, i) : iTime(s, tf, 0) + (datetime)(-i * PeriodSeconds(tf)); }

//+------------------------------------------------------------------+
//| Zone detection - same rules as ZoneBot                           |
//+------------------------------------------------------------------+
void Reject(string s, ENUM_TIMEFRAMES tf, int L, int k, string why, bool draw)
  {
   if(!draw || !InpShowRejected || tf != CTF) return;
   string nm = PFX + "rej" + IntegerToString(L);
   double hi = iHigh(s, tf, L), lo = iLow(s, tf, L);
   for(int b = L + 1; b <= L + k; b++) { hi = MathMax(hi, iHigh(s, tf, b)); lo = MathMin(lo, iLow(s, tf, b)); }
   ObjectCreate(0, nm, OBJ_RECTANGLE, 0, BarTime(s, tf, L + MathMax(k, 1)), hi, BarTime(s, tf, L - 1), lo);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, cMuted); ObjectSetInteger(0, nm, OBJPROP_STYLE, STYLE_DOT); ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetInteger(0, nm, OBJPROP_FILL, false);                    // MT4: a foreground rectangle is an outline
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, "Rejected: " + why);
   Txt(PFX + "rejt" + IntegerToString(L), BarTime(s, tf, L), hi, "x " + why, cMuted, 7, ANCHOR_LEFT_LOWER);
  }

//+------------------------------------------------------------------+
//| Liquidity (lesson 16): retail traders trade support/resistance   |
//| ("old resistance becomes new support") and put stops just beyond |
//| the obvious level. The mentor prefers a zone sitting just BEYOND |
//| that obvious level, so price runs those stops first -> trap,     |
//| better odds (purple). A zone sitting ON the obvious level is a   |
//| retail trade -> crowded, lower odds.                             |
//| Obvious level = a clear swing low/high (InpTrapSwing bars each   |
//| side). In front = between price and the proximal line, within    |
//| InpTrapATR x ATR. Stops still resting = not swept since.         |
//+------------------------------------------------------------------+
bool SwingAt(string s, ENUM_TIMEFRAMES tf, int i, int dir)        // dir +1 swing low, -1 swing high
  {
   for(int j = 1; j <= InpTrapSwing; j++)
     {
      if(i - j < 1) return false;
      if(dir > 0 && (iLow(s, tf, i) > iLow(s, tf, i - j) || iLow(s, tf, i) > iLow(s, tf, i + j))) return false;
      if(dir < 0 && (iHigh(s, tf, i) < iHigh(s, tf, i - j) || iHigh(s, tf, i) < iHigh(s, tf, i + j))) return false;
     }
   return true;
  }
// Returns the trap level (0 = none). crowded = an obvious level sits inside the zone itself.
double FindTrap(string s, ENUM_TIMEFRAMES tf, int dir, double prox, double dist, int fromBar, int baseEnd, int &trapBar, bool &crowded)
  {
   trapBar = -1; crowded = false;
   double atr = ATR(tf, 1), best = 0;
   if(atr <= 0) return 0;
   int scan = MathMin(iBars(s, tf) - InpTrapSwing - 2, baseEnd + 40);
   for(int i = scan; i >= InpTrapSwing + 1; i--)
     {
      for(int kind = -1; kind <= 1; kind += 2)                   // swing highs and swing lows
        {
         if(!SwingAt(s, tf, i, kind)) continue;
         double lv = kind > 0 ? iLow(s, tf, i) : iHigh(s, tf, i);
         double lo = MathMin(prox, dist), hi = MathMax(prox, dist);
         if(lv >= lo && lv <= hi && i > baseEnd + InpTrapSwing) { crowded = true; continue; }   // zone built on an older obvious level
         if(i >= fromBar) continue;                                             // trap level forms after the zone
         double gap = dir > 0 ? lv - prox : prox - lv;
         if(gap <= 0 || gap > InpTrapATR * atr) continue;
         // stops still resting: price hasn't traded back through the level since it formed
         bool swept = false;
         for(int j = i - 1; j >= 1; j--) if((dir > 0 && iLow(s, tf, j) < lv) || (dir < 0 && iHigh(s, tf, j) > lv)) { swept = true; break; }
         if(swept) continue;
         if(best == 0 || gap < MathAbs(best - prox)) { best = lv; trapBar = i; }
        }
     }
   return best;
  }

int Detect(string s, ENUM_TIMEFRAMES tf, Zone &out[], bool draw)
  {
   ArrayResize(out, 0);
   int bars = MathMin(InpLookback, iBars(s, tf) - InpMaxBase - 3);
   for(int L = bars; L >= 2; L--)
     {
      double lr = Rng(s, tf, L);
      if(lr <= 0 || Basing(s, tf, L)) continue;
      int dir = CDir(s, tf, L);
      if(dir == 0) continue;
      int k = 0; double maxBase = 0;
      while(k < InpMaxBase && Basing(s, tf, L + 1 + k)) { maxBase = MathMax(maxBase, Rng(s, tf, L + 1 + k)); k++; }
      if(k == 0 || maxBase <= 0) continue;
      double ratio = lr / maxBase;
      if(ratio < InpMinLegRatio) { if(ratio >= 1.0) Reject(s, tf, L, k, StringFormat("move away only %.1fx base", ratio), draw); continue; }
      int legIn = CDir(s, tf, L + 1 + k);
      bool cont = (legIn == dir);
      double prox = 0, dist = 0;
      if(dir > 0)
        {
         prox = -DBL_MAX; dist = DBL_MAX;
         for(int b = L + 1; b <= L + k; b++) { prox = MathMax(prox, MathMax(iOpen(s, tf, b), iClose(s, tf, b))); dist = MathMin(dist, iLow(s, tf, b)); }
         dist = MathMin(dist, iLow(s, tf, L));
        }
      else
        {
         prox = DBL_MAX; dist = -DBL_MAX;
         for(int b = L + 1; b <= L + k; b++) { prox = MathMin(prox, MathMin(iOpen(s, tf, b), iClose(s, tf, b))); dist = MathMax(dist, iHigh(s, tf, b)); }
         dist = MathMax(dist, iHigh(s, tf, L));
        }
      double h = MathAbs(prox - dist);
      double atr = ATR(tf, L);
      if(h <= 0) continue;
      if(atr > 0 && h > InpMaxZoneATR * atr) { Reject(s, tf, L, k, StringFormat("zone %.1f ATR - too big", h / atr), draw); continue; }
      int sa = L - 1;
      if((dir > 0 && iLow(s, tf, sa) <= prox) || (dir < 0 && iHigh(s, tf, sa) >= prox)) { Reject(s, tf, L, k, "no stay-away / no space", draw); continue; }

      Zone z; ZeroMemory(z);
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.baseN = k; z.saBar = sa; z.legRatio = ratio; z.cont = cont;
      z.grade = (ratio >= 2.5 && k <= 3) ? "A" : (ratio >= 1.8 ? "B" : "C");
      z.gap = dir > 0 ? (iLow(s, tf, sa) - prox) / h : (prox - iHigh(s, tf, sa)) / h;
      z.leg2 = sa >= 1 && !Basing(s, tf, sa) && CDir(s, tf, sa) == dir && Rng(s, tf, sa) >= maxBase * InpMinLegRatio;
      z.chain = false; z.arrival = false;
      z.tested = false; z.removed = false; z.removedBar = -1; z.testedBar = -1; z.qual = ""; z.trap = 0; z.trapBar = -1; z.crowded = false;
      for(int j = sa - 1; j >= 1; j--)
        {
         if(dir > 0)
           {
            if(iClose(s, tf, j) < dist || (iLow(s, tf, j) < dist && !Emotional(s, tf, j))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && iLow(s, tf, j) <= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
           }
         else
           {
            if(iClose(s, tf, j) > dist || (iHigh(s, tf, j) > dist && !Emotional(s, tf, j))) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && iHigh(s, tf, j) >= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
           }
        }
      z.baseEnd = L + k;   // liquidity trap is worked out later, only for the zones that get drawn
      int n = ArraySize(out); ArrayResize(out, n + 1); out[n] = z;
     }
   return ArraySize(out);
  }

//+------------------------------------------------------------------+
//| Trendlines - Kevin's way                                         |
//|  Real valley = a swing low after which price makes a HIGHER HIGH |
//|  (above the last swing high) before breaking the valley. Real    |
//|  peak = a swing high followed by a LOWER LOW the same way.       |
//|  Up line: the two most recent valleys, higher low, a peak in     |
//|  between, then a higher high (else not confirmed yet).           |
//|  Anchored so no candle between the anchors is cut. Drawn only    |
//|  until a FULL candle (body and wick) closes beyond it.           |
//+------------------------------------------------------------------+
void AddPiv(int b, double p, int t) { int n = ArraySize(pvBar); ArrayResize(pvBar, n + 1); ArrayResize(pvP, n + 1); ArrayResize(pvT, n + 1); pvBar[n] = b; pvP[n] = p; pvT[n] = t; }
double Lo(int i) { return iLow(_Symbol, gTF, i); }
double Hi(int i) { return iHigh(_Symbol, gTF, i); }
bool FrLow(int i)  { for(int k = 1; k <= InpTLSwing; k++) if(i - k < 1 || Lo(i) > Lo(i + k) || Lo(i) >= Lo(i - k)) return false; return true; }
bool FrHigh(int i) { for(int k = 1; k <= InpTLSwing; k++) if(i - k < 1 || Hi(i) < Hi(i + k) || Hi(i) <= Hi(i - k)) return false; return true; }
void ZigZag(int bars)                                                // real peaks / valleys, oldest first
  {
   ArrayResize(pvBar, 0); ArrayResize(pvP, 0); ArrayResize(pvT, 0);
   int fH = -1, fL = -1;                                             // most recent swing high / low before i
   for(int i = bars; i > InpTLSwing; i--)
     {
      bool lo = FrLow(i), hi = FrHigh(i);
      if(lo && fH > 0)
         for(int j = i - 1; j >= 1; j--) { if(Lo(j) < Lo(i)) break; if(Hi(j) > Hi(fH)) { AddPiv(i, Lo(i), -1); break; } }
      if(hi && fL > 0)
         for(int j = i - 1; j >= 1; j--) { if(Hi(j) > Hi(i)) break; if(Lo(j) < Lo(fL)) { AddPiv(i, Hi(i), 1); break; } }
      if(lo) fL = i;
      if(hi) fH = i;
     }
  }

double LineAt(double p, int b, double sl, int j) { return p + sl * (b - j); }   // value at bar j of a line through (b, p), slope per bar toward newer bars

// Kevin: attach at the anchor; move it only when a candle really pokes through
int FitAnchor(int A, int b2, double p2, int d, double &sl)
  {
   int a = A; double tol = 0.05 * ATR(gTF, 1);                       // Kevin: trendlines never cut a candle (only a hair of slack)
   for(int it = 0; it < 50; it++)
     {
      sl = (p2 - (d > 0 ? Lo(a) : Hi(a))) / (a - b2);
      int worst = -1; double ex = tol;
      for(int j = a - 1; j > b2; j--) { double lv = LineAt(p2, b2, sl, j), e = d > 0 ? lv - Lo(j) : Hi(j) - lv; if(e > ex) { ex = e; worst = j; } }
      if(worst < 0) return a;
      a = worst;
     }
   sl = (p2 - (d > 0 ? Lo(a) : Hi(a))) / (a - b2);
   return a;
  }
int RemovedAt(int b2, double p2, double sl, int d) { for(int j = b2 - 1; j >= 1; j--) { double lv = LineAt(p2, b2, sl, j); if((d > 0 && Hi(j) < lv) || (d < 0 && Lo(j) > lv)) return j; } return -1; }
void AddTL(int d, int a, int b2, double p2, double sl, bool overall)
  {
   TLine t; ZeroMemory(t);
   t.dir = d; t.a = a; t.b = b2; t.pb = p2; t.pa = LineAt(p2, b2, sl, a); t.removedBar = RemovedAt(b2, p2, sl, d); t.removed = t.removedBar >= 0; t.conf = !overall;
   int n = ArraySize(TL); ArrayResize(TL, n + 1); TL[n] = t;
  }

// two drawn lines that sit on top of each other (an H1 and an H4 line on the same pivots, or a gold line on this
// chart's own line): keep one - this chart's line first, else the higher timeframe - and delete the rest
double TLPrice(string n, datetime t)
  {
   datetime t1 = (datetime)ObjectGetInteger(0, n, OBJPROP_TIME, 0), t2 = (datetime)ObjectGetInteger(0, n, OBJPROP_TIME, 1);
   double p1 = ObjectGetDouble(0, n, OBJPROP_PRICE, 0), p2 = ObjectGetDouble(0, n, OBJPROP_PRICE, 1);
   if(t2 == t1) return p1;
   return p1 + (p2 - p1) * (double)(t - t1) / (double)(t2 - t1);
  }
int TLRank(string n)                                                   // this chart = top; HTF lines by timeframe
  {
   int h = StringFind(n, "tlH");
   if(h < 0) return 1000000;
   int u = StringFind(n, "_", h);
   return (int)StringToInteger(StringSubstr(n, h + 3, u - h - 3));
  }
void RegTL(string n, datetime ta, datetime tb, int d, bool broken, int rank)
  {
   int k = ArraySize(rgN);
   ArrayResize(rgN, k + 1); ArrayResize(rgA, k + 1); ArrayResize(rgB, k + 1); ArrayResize(rgD, k + 1); ArrayResize(rgR, k + 1); ArrayResize(rgX, k + 1);
   rgN[k] = n; rgA[k] = ta; rgB[k] = tb; rgD[k] = d; rgR[k] = rank; rgX[k] = broken;
  }
// one line per pivot pair: lines from the same anchor candle to the same touch candle (or lying on top of each other)
// are the same trendline - keep the respected one, then the highest timeframe's
void DedupeTL()
  {
   int n = ArraySize(rgN);
   long near = 3 * PeriodSeconds();
   double tol = 0.3 * ATR(CTF, 1);
   datetime ta = cT(0), tb = cT(MathMin(30, cBars() - 1));
   for(int i = 0; i < n; i++)
      for(int j = i + 1; j < n; j++)
        {
         if(rgD[i] != rgD[j] || ObjectFind(0, rgN[i]) < 0 || ObjectFind(0, rgN[j]) < 0) continue;
         bool samePiv = MathAbs((long)rgA[i] - (long)rgA[j]) <= near && MathAbs((long)rgB[i] - (long)rgB[j]) <= near;
         bool onTop = !rgX[i] && !rgX[j] && MathAbs(TLPrice(rgN[i], ta) - TLPrice(rgN[j], ta)) <= tol && MathAbs(TLPrice(rgN[i], tb) - TLPrice(rgN[j], tb)) <= tol;
         if(!samePiv && !onTop) continue;
         long si = (rgX[i] ? 0 : 10000000) + rgR[i], sj = (rgX[j] ? 0 : 10000000) + rgR[j];
         string del = si >= sj ? rgN[j] : rgN[i];
         ObjectDelete(0, del); ObjectDelete(0, del + "l");
        }
   ArrayResize(rgN, 0); ArrayResize(rgA, 0); ArrayResize(rgB, 0); ArrayResize(rgD, 0); ArrayResize(rgR, 0); ArrayResize(rgX, 0);
  }
// HTF pivot bar hb -> this chart's bar holding the extreme inside it (-1 when this chart's history does not reach it)
int ChartBarIn(int d, int hb)
  {
   datetime t0 = iTime(_Symbol, gTF, hb), t1 = hb > 0 ? iTime(_Symbol, gTF, hb - 1) : TimeCurrent() + 1;
   if(t0 < cT(cBars() - 1)) return -1;
   int j0 = iBarShift(_Symbol, CTF, t0), j1 = iBarShift(_Symbol, CTF, t1);
   if(j0 < 0 || j1 < 0) return -1;
   if(cT(j1) >= t1) j1++;                                              // first chart bar of the next HTF bar is not ours
   if(hb == 0) j1 = 0;
   int cnt = j0 - j1 + 1;
   if(cnt < 1) return -1;
   return d > 0 ? iLowest(_Symbol, CTF, MODE_LOW, cnt, j1) : iHighest(_Symbol, CTF, MODE_HIGH, cnt, j1);
  }
// HTF line on this chart, the way you refine it going down the timeframes:
//  1) anchor = this chart's candle holding the extreme inside the HTF anchor bar;
//  2) touch = the candle (up to the HTF pivot) that keeps every candle between on the right side - no cut candles;
//  3) walk forward on THIS chart: a later swing that pokes beyond the line becomes the new touch; the walk stops at the
//     first full candle beyond the line (the break on this chart), so later rallies never flatten the line.
// ce = this chart's break bar (-1 = still respected here). false when the history does not reach the anchor.
bool RefineOnChart(int d, int aH_, int bH, int endH, int &ca, int &cb, double &csl, int &ce)
  {
   ca = ChartBarIn(d, aH_); int ph = ChartBarIn(d, bH); ce = -1;
   if(ca < 0 || ph < 0 || ph >= ca) return false;
   double pa = d > 0 ? cL(ca) : cH(ca);
   cb = -1; csl = 0;
   for(int j = ca - 1; j >= ph; j--)
     {
      double s0 = ((d > 0 ? cL(j) : cH(j)) - pa) / (ca - j);
      if((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) continue;
      if(cb < 0 || (d > 0 ? s0 < csl : s0 > csl)) { cb = j; csl = s0; }
     }
   if(cb < 0) return false;
   ENUM_TIMEFRAMES keep = gTF; gTF = CTF;
   int stop = endH >= 0 ? MathMax(1, iBarShift(_Symbol, CTF, iTime(_Symbol, keep, endH)) - 1) : 1;
   for(int j = ph - 1; j >= 1; j--)
     {
      double lv = (d > 0 ? cL(cb) : cH(cb)) + csl * (cb - j);
      if((d > 0 && cH(j) < lv) || (d < 0 && cL(j) > lv)) { ce = j; break; }            // a full candle beyond: broken here
      if(j < stop) break;
      if(j > InpTLSwing && (d > 0 ? FrLow(j) : FrHigh(j)) && (d > 0 ? cL(j) < lv : cH(j) > lv))
        {
         double s0 = ((d > 0 ? cL(j) : cH(j)) - pa) / (ca - j);
         if((d > 0 && s0 > 0) || (d < 0 && s0 < 0)) { cb = j; csl = s0; }                // a later swing pokes through: new touch
        }
     }
   gTF = keep;
   return true;
  }

bool Confirmed(int a, int b2, double p2, double sl, int d)
  {
   double ext = d > 0 ? -DBL_MAX : DBL_MAX;
   for(int j = a - 1; j > b2; j--) ext = d > 0 ? MathMax(ext, Hi(j)) : MathMin(ext, Lo(j));
   if(ext == DBL_MAX || ext == -DBL_MAX) return false;
   for(int j = b2 - 1; j >= 1; j--)
     {
      double lv = LineAt(p2, b2, sl, j);
      if((d > 0 && Hi(j) < lv) || (d < 0 && Lo(j) > lv)) return false;     // broken before it was confirmed
      if((d > 0 && Hi(j) > ext) || (d < 0 && Lo(j) < ext)) return true;
     }
   return false;
  }
// Kevin: a near-horizontal line is not a trendline (it is momentum). Needs a visible angle.
bool TooFlat(int a, int b2, double p2, double sl)
  {
   double atr = MathMax(ATR(gTF, b2), _Point);
   return MathAbs(sl) < 0.015 * atr || MathAbs(p2 - LineAt(p2, b2, sl, a)) < 1.5 * atr;
  }

// Kevin's lines: every real valley (peak) gets a line from the previous real one - or, if that is too flat, from the
// original starting point of the current line, else from the lowest (highest) point before it. Each line is drawn until a full candle closes beyond it, then ended there.
// Plus the overall line from the very bottom (top) of the move, when it has a real angle. Near-flat lines are dropped.
void Trendlines(string s, ENUM_TIMEFRAMES tf)
  {
   ArrayResize(TL, 0); gUpOn = false; gDnOn = false;
   int bars = MathMin(InpLookback, iBars(_Symbol, gTF) - 20);
   ZigZag(bars);
   for(int d = -1; d <= 1; d += 2)
     {
      int want = d > 0 ? -1 : 1, prevB = -1, lastA = -1; double prevP = 0;
      for(int k = 0; k < ArraySize(pvBar); k++)
        {
         if(pvT[k] != want) continue;
         int b2 = pvBar[k]; double p2 = pvP[k], sl = 0;
         int pb = prevB; double pp = prevP;
         prevB = b2; prevP = p2;
         int a = -1;
         // 1) the top / bottom of the move; if that line would cut a peak (valley) in between, the anchor moves to it,
         //    which gives the two most recent peaks (valleys). 2) too flat: the previous real one. 3) the line's original start.
         int A = d > 0 ? iLowest(_Symbol, gTF, MODE_LOW, bars - b2, b2 + 1) : iHighest(_Symbol, gTF, MODE_HIGH, bars - b2, b2 + 1);
         if(A > b2 && (d > 0 ? Lo(A) < p2 : Hi(A) > p2)) { a = FitAnchor(A, b2, p2, d, sl); if(TooFlat(a, b2, p2, sl)) a = -1; }
         if(a < 0 && pb > 0 && (d > 0 ? pp < p2 : pp > p2)) { a = FitAnchor(pb, b2, p2, d, sl); if(TooFlat(a, b2, p2, sl)) a = -1; }
         if(a < 0 && lastA > b2 && (d > 0 ? Lo(lastA) < p2 : Hi(lastA) > p2)) { a = FitAnchor(lastA, b2, p2, d, sl); if(TooFlat(a, b2, p2, sl)) a = -1; }
         if(a < 0) continue;
         // confirmed only when price makes a new high above everything between the two valleys (new low below
         // everything between the two peaks) BEFORE a full candle breaks the line; otherwise it is no trendline yet
         if(!Confirmed(a, b2, p2, sl, d)) continue;
         // the same anchor as the previous line = the same trendline, updated (Kevin: never two lines from one anchor)
         int n = ArraySize(TL);
         if(n > 0 && TL[n - 1].dir == d && TL[n - 1].a == a) ArrayResize(TL, n - 1);
         AddTL(d, a, b2, p2, sl, false);
         lastA = a;
        }
      // overall line from the very bottom / top of the window
      int O = d > 0 ? iLowest(_Symbol, gTF, MODE_LOW, bars, 1) : iHighest(_Symbol, gTF, MODE_HIGH, bars, 1);
      double ov = d > 0 ? Lo(O) : Hi(O), bs = 0; int bk = -1;
      for(int k = 0; k < ArraySize(pvBar); k++)
        {
         if(pvT[k] != want || pvBar[k] >= O - 1) continue;
         double s0 = (pvP[k] - ov) / (O - pvBar[k]);
         if((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) continue;
         if(bk < 0 || (d > 0 ? s0 < bs : s0 > bs)) { bk = k; bs = s0; }
        }
      if(bk >= 0)
        {
         double sl = 0; int a = FitAnchor(O, pvBar[bk], pvP[bk], d, sl);
         bool dup = false;
         for(int t = 0; t < ArraySize(TL); t++) if(TL[t].dir == d && (TL[t].a == a || TL[t].b == pvBar[bk])) dup = true;
         if(!dup && !TooFlat(a, pvBar[bk], pvP[bk], sl) && Confirmed(a, pvBar[bk], pvP[bk], sl, d)) { AddTL(d, a, pvBar[bk], pvP[bk], sl, true); if(TL[ArraySize(TL) - 1].removed) ArrayResize(TL, ArraySize(TL) - 1); }
        }
     }
   // draw per direction: the newest line (a refined line replaces the older ones - only one at a time), the overall line
   // when still respected, and older broken lines only from an earlier, separate leg (no overlapping clutter)
   for(int d = -1; d <= 1; d += 2)
     {
      int newest = -1, use = -1;
      for(int i = 0; i < ArraySize(TL); i++) if(TL[i].dir == d && TL[i].conf && (newest < 0 || TL[i].b < TL[newest].b)) newest = i;
      if(newest >= 0 && !TL[newest].removed) use = newest;
      if(use < 0) for(int i = 0; i < ArraySize(TL); i++) if(TL[i].dir == d && !TL[i].conf && !TL[i].removed) use = i;
      int shown = 0;
      for(int i = ArraySize(TL) - 1; i >= 0; i--)
        {
         if(gQuiet) break;                                              // research pass: lines are computed, never drawn or alerted
         if(TL[i].dir != d) continue;
         bool keep = i == newest || (!TL[i].conf && !TL[i].removed) || (TL[i].removed && newest >= 0 && TL[i].b > TL[newest].a);
         if(!keep || shown >= InpTLHistory) continue;
         shown++;
         bool up = d > 0;
         double sl = (TL[i].pb - TL[i].pa) / MathMax(1, TL[i].a - TL[i].b);
         int end = TL[i].removed ? TL[i].removedBar : 0;
         double pe = LineAt(TL[i].pb, TL[i].b, sl, end - (TL[i].removed ? 0 : 3));
         string nm = PFX + "tl" + (gTF == CTF ? "" : "H" + IntegerToString((int)gTF) + "_") + IntegerToString(i);
         color c = gTF == CTF ? (TL[i].removed ? cMuted : cTrend) : (TL[i].removed ? cHtfTLBroken : InpHtfTL);   // broken: light dotted; respected: dark
         datetime x1 = iTime(_Symbol, gTF, TL[i].a), x2 = TL[i].removed ? iTime(_Symbol, gTF, end) : iTime(_Symbol, gTF, 0) + PeriodSeconds(gTF) * 3;
         double y1 = TL[i].pa; datetime rTouch = 0;
         // higher-timeframe line on this chart: re-anchor it on this chart's own candles - the top-most (bottom-most)
         // candle inside each HTF pivot, then moved so it cuts no candle of this chart (clean, exact touch points)
         if(gTF != CTF && InpRefineHTF)
           {
            int ca = -1, cb = -1, ce = -1; double csl = 0;
            if(RefineOnChart(d, TL[i].a, TL[i].b, TL[i].removed ? TL[i].removedBar : -1, ca, cb, csl, ce))
              {
               double pcb = up ? cL(cb) : cH(cb);
               x1 = cT(ca); y1 = up ? cL(ca) : cH(ca);
               if(TL[i].removed && ce < 0) ce = iBarShift(_Symbol, CTF, iTime(_Symbol, gTF, end));
               if(ce >= 0) { x2 = cT(ce); pe = pcb + csl * (cb - ce); }
               else { x2 = cT(0) + PeriodSeconds() * 3; pe = pcb + csl * (cb + 3); }
               rTouch = cT(cb);
              }
           }
         datetime tTouch = rTouch > 0 ? rTouch : iTime(_Symbol, gTF, TL[i].b);
         if(InpShowTrendlines) { ObjectCreate(0, nm, OBJ_TREND, 0, x1, y1, x2, pe); RegTL(nm, x1, tTouch, d, TL[i].removed, gTF == CTF ? 0 : (int)gTF); }
         ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
         ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
         ObjectSetInteger(0, nm, OBJPROP_STYLE, TL[i].removed || gTF != CTF ? STYLE_DOT : STYLE_SOLID);   // HTF lines: thin dotted gold
         ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);                     // all lines thin
         ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, VisUpTo(gTF));
         ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, TfName(gTF) + (TL[i].conf ? " " : " overall ") + (up ? "uptrend line: real valley, then a higher high" : "downtrend line: real peak, then a lower low")
            + (TL[i].removed ? " | ENDED: a full candle closed " + (up ? "below" : "above") + " it on " + TimeToString(iTime(_Symbol, gTF, end), TIME_DATE | TIME_MINUTES) : " | respected so far"));
         if(gTF != CTF && InpShowTrendlines && !TL[i].removed)
           { string ln = nm + "l"; ObjectCreate(0, ln, OBJ_TEXT, 0, x2, pe); ObjectSetString(0, ln, OBJPROP_TEXT, " " + TfName(gTF) + " trendline");
             ObjectSetInteger(0, ln, OBJPROP_COLOR, InpHtfTL); ObjectSetInteger(0, ln, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, ln, OBJPROP_ANCHOR, ANCHOR_LEFT); ObjectSetInteger(0, ln, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, ln, OBJPROP_TIMEFRAMES, VisUpTo(gTF)); }
         // MT5 extra: a drawn line broken by the last closed candle of its timeframe -> one alert
         if(InpAlertTL && TL[i].removed && TL[i].removedBar == 1)
           {
            string key = "L" + TfName(gTF) + IntegerToString(d) + IntegerToString((long)iTime(_Symbol, gTF, TL[i].a)) + "_" + IntegerToString((long)iTime(_Symbol, gTF, 1));
            if(!Alerted(key))
              {
               MarkAlerted(key);
               if(gArmed) Notify(StringFormat("ZoneVision %s %s: %s %s trendline broken - a full candle closed %s it", _Symbol, TfName(CTF), TfName(gTF), up ? "uptrend" : "downtrend", up ? "below" : "above"));
              }
           }
        }
      // channel 50% (golden area / overextended) from the newest respected line: used by the checks, drawn only if asked
      if(use >= 0)
        {
         int i = use; bool up = d > 0;
         double sl = (TL[i].pb - TL[i].pa) / MathMax(1, TL[i].a - TL[i].b), w = 0;
         for(int j = TL[i].a; j >= 1; j--) w = MathMax(w, up ? Hi(j) - LineAt(TL[i].pb, TL[i].b, sl, j) : LineAt(TL[i].pb, TL[i].b, sl, j) - Lo(j));
         if(up) { gUpOn = true; gUpS = sl; gUpP = TL[i].pb; gUpB = TL[i].b; gUpW = w; } else { gDnOn = true; gDnS = sl; gDnP = TL[i].pb; gDnB = TL[i].b; gDnW = w; }
         if(!gQuiet && InpShowChannel && InpShowTrendlines && gTF == CTF)
           {
            string cn = PFX + "tlc" + (up ? "u" : "d");
            double off = up ? w / 2 : -w / 2, pe = LineAt(TL[i].pb, TL[i].b, sl, -3);
            ObjectCreate(0, cn, OBJ_TREND, 0, iTime(_Symbol, gTF, TL[i].a), TL[i].pa + off, iTime(_Symbol, gTF, 0) + PeriodSeconds(gTF) * 3, pe + off);
            ObjectSetInteger(0, cn, OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, cn, OBJPROP_COLOR, cMuted); ObjectSetInteger(0, cn, OBJPROP_STYLE, STYLE_DOT);
            ObjectSetInteger(0, cn, OBJPROP_SELECTABLE, false);
            ObjectSetString(0, cn, OBJPROP_TOOLTIP, "Channel 50%: between the trendline and this line = golden area. Beyond it = overextended, wait.");
           }
        }
     }
  }
// supply: is the active downtrend line above the zone (+1: price reaches the zone without crossing it, the line
// protects it) or between price and the zone (-1: price must break the line first)? Demand mirrored. 0 = no line.
int CrossNeeded(int dir, double prox)
  {
   double px = Mid();
   double v[2] = {0, 0}; int n = 0;
   if(dir < 0 && gDnOn) v[n++] = LineAt(gDnP, gDnB, gDnS, 0);
   if(dir > 0 && gUpOn) v[n++] = LineAt(gUpP, gUpB, gUpS, 0);
   if(gHTF > 0)
     {
      int sh = iBarShift(_Symbol, gHTF, cT(0));
      if(dir < 0 && gHDnOn) v[n++] = gHDnP + gHDnS * (gHDnB - sh);
      if(dir > 0 && gHUpOn) v[n++] = gHUpP + gHUpS * (gHUpB - sh);
     }
   int res = 0;
   for(int i = 0; i < n; i++)
     {
      if(dir < 0) { if(v[i] > px && v[i] < prox) return -1; if(v[i] >= prox) res = 1; }
      else        { if(v[i] < px && v[i] > prox) return -1; if(v[i] <= prox) res = 1; }
     }
   return res;
  }
// the newest broken line on the HTF decides: a downtrend line broken = bullish, an uptrend line broken = bearish
void TLBias()
  {
   int best = -1;
   for(int i = 0; i < ArraySize(TL); i++) if(TL[i].removed && (best < 0 || TL[i].removedBar < TL[best].removedBar)) best = i;
   if(best < 0) { gHBias = 0; gHBiasTxt = ""; return; }
   gHBias = -TL[best].dir;
   gHBiasTxt = StringFormat("%s %s trendline broken on %s", TfName(gTF), TL[best].dir > 0 ? "uptrend" : "downtrend", TimeToString(iTime(_Symbol, gTF, TL[best].removedBar), TIME_DATE));
  }
// zone sits within 1 ATR of the respected trendline in its direction (chart or HTF): "", "chart" or the HTF name
string NearTrendline(int dir, double price)
  {
   double atr = ATR(CTF, 1);
   if(dir > 0 && gUpOn && MathAbs(price - LineAt(gUpP, gUpB, gUpS, 0)) <= atr) return TfName(CTF);
   if(dir < 0 && gDnOn && MathAbs(price - LineAt(gDnP, gDnB, gDnS, 0)) <= atr) return TfName(CTF);
   if(gHTF > 0)
     {
      int sh = iBarShift(_Symbol, gHTF, cT(0));
      if(dir > 0 && gHUpOn && MathAbs(price - (gHUpP + gHUpS * (gHUpB - sh))) <= atr) return TfName(gHTF);
      if(dir < 0 && gHDnOn && MathAbs(price - (gHDnP + gHDnS * (gHDnB - sh))) <= atr) return TfName(gHTF);
     }
   return "";
  }
bool Overextended(int dir, double price)
  {
   if(gHTF > 0)
     {
      int sh = iBarShift(_Symbol, gHTF, cT(0));
      if(dir > 0 && gHUpOn && price > gHUpP + gHUpS * (gHUpB - sh) + gHUpW / 2) return true;
      if(dir < 0 && gHDnOn && price < gHDnP + gHDnS * (gHDnB - sh) - gHDnW / 2) return true;
     }
   if(dir > 0 && gUpOn) return price > LineAt(gUpP, gUpB, gUpS, 0) + gUpW / 2;
   if(dir < 0 && gDnOn) return price < LineAt(gDnP, gDnB, gDnS, 0) - gDnW / 2;
   return false;
  }

// "Momentum" = no valid trendline on the newest structure.
string StructureNow()
  {
   int up = 0, dn = 0;
   for(int i = 0; i < ArraySize(TL); i++) if(!TL[i].removed) { if(TL[i].dir > 0) up++; else dn++; }
   if(up && !dn) return "uptrend (trendline intact)";
   if(dn && !up) return "downtrend (trendline intact)";
   if(up && dn) return "mixed trendlines";
   return "momentum / no intact trendline";
  }

//+------------------------------------------------------------------+
//| Qualifiers: removed opposing zone / removed trendline / new H/L  |
//+------------------------------------------------------------------+
void Qualify()
  {
   for(int i = 0; i < ArraySize(Z); i++)
     {
      string q = "";
      // the move away (up to 5 bars after the leg) removed an older opposing zone
      for(int j = 0; j < ArraySize(Z); j++)
         if(Z[j].dir == -Z[i].dir && Z[j].removed && Z[j].legBar > Z[i].legBar && Z[j].removedBar <= Z[i].legBar && Z[j].removedBar >= Z[i].legBar - 5) { q += "removed opp. zone | "; break; }
      for(int t = 0; t < ArraySize(TL); t++)
         if(TL[t].dir == -Z[i].dir && TL[t].removed && TL[t].removedBar <= Z[i].legBar && TL[t].removedBar >= Z[i].legBar - 5) { q += "removed trendline | "; break; }
      // the move away made a new high / low versus everything before the zone
      int L = Z[i].legBar, older = L + Z[i].baseN + 1;
      int span = MathMin(InpLookback, cBars() - older - 1);
      bool rmHL = false;
      if(span > 5)
        {
         int nx = MathMax(L - 5, 1);
         double legX = Z[i].dir > 0 ? cH(iHighest(_Symbol, CTF, MODE_HIGH, L - nx + 1, nx)) : cL(iLowest(_Symbol, CTF, MODE_LOW, L - nx + 1, nx));
         if(Z[i].dir > 0 && legX > cH(iHighest(_Symbol, CTF, MODE_HIGH, span, older))) q += "new high | ";
         if(Z[i].dir < 0 && legX < cL(iLowest(_Symbol, CTF, MODE_LOW, span, older))) q += "new low | ";
         // the previous swing high (for demand) / low (for supply) before the base: did the move away take it out?
         for(int j = older; j < older + span && j < cBars() - InpTLSwing - 1; j++)
           {
            if(Z[i].dir > 0 && FrHigh(j)) { rmHL = legX > cH(j); break; }
            if(Z[i].dir < 0 && FrLow(j))  { rmHL = legX < cL(j); break; }
           }
         if(rmHL) q += (Z[i].dir > 0 ? "removed the previous high | " : "removed the previous low | ");
        }
      Z[i].chain = q != "";
      Z[i].arrival = StringFind(q, "removed trendline") >= 0 && (StringFind(q, "removed opp. zone") >= 0 || rmHL || StringFind(q, "new high") >= 0 || StringFind(q, "new low") >= 0);
      if(Z[i].arrival) q = "ARRIVAL zone | " + q;
      if(Z[i].leg2) q += "2nd explosive candle | ";
      if(Z[i].gap < InpMinGap) q += "drawable only (little space under stay-away) | ";
      Z[i].qual = q == "" ? "no qualifier (not in the chain)" : StringSubstr(q, 0, StringLen(q) - 3);
     }
  }

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

string ZoneName(Zone &z)
  {
   if(z.dir > 0) return z.cont ? "Rally Base Rally Demand (CP)" : "Drop Base Rally Demand (PV)";
   return z.cont ? "Drop Base Drop Supply (CP)" : "Rally Base Drop Supply (PV)";
  }

void PriceTag(string nm, datetime t, double p, color c)
  {
   Txt(nm, t, p, "(" + DoubleToString(p, _Digits) + ")", c, 7, ANCHOR_RIGHT);
  }

// Sunday rule: zones should be similar in size; about half the usual size is too small.
bool TooSmall(Zone &zs[], int i)
  {
   double hs[]; int n = 0;
   for(int j = 0; j < ArraySize(zs); j++) if(!zs[j].removed) { ArrayResize(hs, n + 1); hs[n++] = MathAbs(zs[j].prox - zs[j].dist); }
   if(n < 4) return false;
   ArraySort(hs);
   double med = hs[n / 2];
   return MathAbs(zs[i].prox - zs[i].dist) < InpMinSizeVsMedian * med;
  }

bool MetalOrOil()
  {
   string u = _Symbol; StringToUpper(u);
   return StringFind(u, "XAU") >= 0 || StringFind(u, "GOLD") >= 0 || StringFind(u, "XAG") >= 0 || StringFind(u, "OIL") >= 0 || StringFind(u, "WTI") >= 0 || StringFind(u, "BRENT") >= 0 || StringFind(u, "XTI") >= 0 || StringFind(u, "XBR") >= 0;
  }

void Push(string &a[], string v) { int n = ArraySize(a); ArrayResize(a, n + 1); a[n] = v; }
// one-line explanation shown under each note in the tooltip
string NoteHelp(string n)
  {
   if(StringFind(n, "clear space") >= 0) return " (stay-away candle stayed this % of the zone height away: price left fast, orders still there. <15% = drawable only)";
   if(StringFind(n, "drawable only") >= 0) return " (stay-away candle came back too close: real zone, not tradable)";
   if(StringFind(n, "explosive move away") >= 0) return " (move-away candle vs biggest base candle. 2.5x+ strong)";
   if(StringFind(n, "weak move away") >= 0) return " (move away barely bigger than the base)";
   if(StringFind(n, "2nd explosive candle") >= 0) return " (a second big push followed)";
   if(StringFind(n, "only one explosive candle") >= 0) return " (the push stopped after one candle)";
   if(StringFind(n, "base candle") >= 0) return " (short time at level = more orders left)";
   if(StringFind(n, "long base") >= 0) return " (long time at level = orders used up)";
   if(StringFind(n, "not in the chain") >= 0) return " (removed nothing: Kevin skips it)";
   if(StringFind(n, "in the chain") >= 0) return " (removed a zone / trendline or made a new high-low)";
   if(StringFind(n, "ARRIVAL") >= 0) return " (broke the trendline AND the previous high-low: strongest)";
   if(StringFind(n, "fresh") >= 0) return " (price has not come back yet)";
   if(StringFind(n, "already tested") >= 0) return " (price came back: orders partly used)";
   if(StringFind(n, "VP") >= 0) return " (reversal zone (valley / peak): Kevin's favourite)";
   if(StringFind(n, "with the") >= 0) return " (same way as the HTF trend)";
   if(StringFind(n, "against the") >= 0) return " (fights the HTF trend)";
   if(StringFind(n, "beyond channel 50%") >= 0) return " (overextended half of the channel: wait)";
   if(StringFind(n, "too small") >= 0) return " (much smaller than other zones: easily run through)";
   if(StringFind(n, "without crossing") >= 0) return " (no trendline between price and the zone)";
   if(StringFind(n, "must cross") >= 0) return " (a trendline must break first)";
   if(StringFind(n, "at the") >= 0) return " (sits on a respected trendline)";
   if(StringFind(n, "liquidity trap") >= 0) return " (obvious high-low in front: stops get taken first)";
   if(StringFind(n, "far:") >= 0) return " (more than 2x HTF ATR away: not soon)";
   if(StringFind(n, "obvious S/R") >= 0) return " (level everyone sees: crowded)";
   return "";
  }
// Strong / weak in a few words: Kevin's and Seiden's checks on one zone.
// verdict: WEAK if any deal-breaker, STRONG if 5+ strengths and at most one weakness, else OK.
string ZoneNotes(Zone &zs[], int i, string &verdict, string &shortWhy)
  {
   Zone z = zs[i];
   string pl[], mi[], cr[];
   if(z.baseN <= 3) Push(pl, IntegerToString(z.baseN) + " base candle" + (z.baseN > 1 ? "s" : "")); else if(z.baseN > 6) Push(mi, "long base (" + IntegerToString(z.baseN) + " candles)");
   if(z.legRatio >= 2.5) Push(pl, StringFormat("explosive move away %.1fx", z.legRatio)); else if(z.legRatio < 1.8) Push(mi, StringFormat("weak move away %.1fx", z.legRatio));
   if(z.leg2) Push(pl, "2nd explosive candle"); else Push(mi, "only one explosive candle");
   if(z.arrival) Push(pl, "ARRIVAL: broke the trendline + the previous high/low");
   if(z.chain) Push(pl, "in the chain"); else Push(cr, "not in the chain (removed nothing)");
   if(z.gap < InpMinGap) Push(cr, "drawable only: no space under the stay-away candle"); else if(z.gap >= 0.25) Push(pl, StringFormat("clear space %.0f%%", z.gap * 100));
   if(z.tested) Push(cr, "already tested"); else Push(pl, "fresh");
   if(TooSmall(zs, i)) Push(cr, "too small vs other zones");
   if(!z.cont) Push(pl, "VP (Kevin's favourite)");
   if(gTrend == z.dir) Push(pl, "with the HTF trend"); else if(gTrend == -z.dir) Push(cr, "against the HTF trend");
   if(Overextended(z.dir, z.prox)) Push(cr, "beyond channel 50% (overextended)");
   { string nt = NearTrendline(z.dir, z.prox); if(nt != "") Push(pl, "at the " + nt + " trendline"); }
   { int cx = CrossNeeded(z.dir, z.prox); if(cx > 0) Push(pl, "price reaches it without crossing a trendline"); else if(cx < 0) Push(mi, "price must cross a trendline to reach it"); }
   if(z.trap > 0) Push(pl, "liquidity trap in front");
   if(z.crowded) Push(mi, "on an obvious S/R level (crowded)");
   ENUM_TIMEFRAMES htf = HtfOf(CTF); if(htf <= 0) htf = CTF;
   double xa = MathAbs(Mid() - z.prox) / MathMax(ATR(htf, 1), _Point);
   if(xa > InpMaxDistATR) Push(mi, StringFormat("far: %.1f x %s ATR", xa, TfName(htf)));
   int np = ArraySize(pl), nm = ArraySize(mi), nc = ArraySize(cr);
   verdict = nc > 0 ? "WEAK" : ((np >= 5 && nm <= 1) || z.arrival ? "STRONG" : "OK");
   if(nc > 0) shortWhy = cr[0] + (nc > 1 ? ", " + cr[1] : "");
   else if(verdict == "STRONG") shortWhy = pl[0] + (np > 1 ? ", " + pl[1] : "");
   else shortWhy = (nm > 0 ? mi[0] : (np > 0 ? pl[0] : ""));
   // the plan, the way the drills taught it: entry at the proximal, stop past the distal + buffer (x2 gold / oil),
   // target just before the nearest fresh opposing zone
   double spread = SAsk() - SBid(), buf = InpStopBufferPts * _Point * (MetalOrOil() ? InpMetalOilStop : 1.0), opp = 0;
   for(int j = 0; j < ArraySize(zs); j++)
     {
      if(zs[j].dir == z.dir || zs[j].removed) continue;
      if(z.dir > 0 && zs[j].prox > z.prox && (opp == 0 || zs[j].prox < opp)) opp = zs[j].prox;
      if(z.dir < 0 && zs[j].prox < z.prox && (opp == 0 || zs[j].prox > opp)) opp = zs[j].prox;
     }
   double en = z.dir > 0 ? z.prox + spread : z.prox, sl = z.dir > 0 ? z.dist - buf : z.dist + buf + spread;
   double tp = opp > 0 ? (z.dir > 0 ? opp - spread : opp + spread) : 0, rr = tp > 0 ? MathAbs(tp - en) / MathMax(MathAbs(en - sl), _Point) : 0;
   gNEn = en; gNSl = sl; gNTp = tp; gNRR = rr;                       // MT5 extra: plan lines when the box is opened
   string grade = nc > 0 ? "C" : ((verdict == "STRONG" && (z.arrival || np >= 6) && rr >= 3) ? "A" : (rr >= InpMinRR && nm <= 2 ? "B" : "C"));
   gNGrade = grade; gNP = np; gNM = nm; gNC = nc;                    // zone research reads these (no effect on the chart)
   if(gRs)
     {
      string tg = "";
      for(int ti = 0; ti < np; ti++) tg += "+" + pl[ti] + "|";
      for(int ti = 0; ti < nm; ti++) tg += "-" + mi[ti] + "|";
      for(int ti = 0; ti < nc; ti++) tg += "x" + cr[ti] + "|";
      gNTags = tg;
     }
   string why = nc > 0 ? cr[0] : (tp == 0 ? "no opposing zone for a target" : (rr < InpMinRR ? StringFormat("R:R 1:%.1f is below 1:%.1f", rr, InpMinRR) : ""));
   string t = StringFormat("Grade %s | %s | Trade: %s\n", grade, verdict, why == "" ? "YES" : "NO - " + why);
   if(tp > 0) t += StringFormat("Plan: %s %s  SL %s  TP %s  = 1:%.1f\n", z.dir > 0 ? "buy limit" : "sell limit", DoubleToString(en, _Digits), DoubleToString(sl, _Digits), DoubleToString(tp, _Digits), rr);
   if(z.gap >= InpMinGap) t += StringFormat("Clear space %.0f%%: price left fast, orders still waiting (want 25%%+, best 50%%+)\n", z.gap * 100);
   for(int k = 0; k < nc; k++) t += "x " + cr[k] + "\n";
   for(int k = 0; k < MathMin(nm, 3); k++) t += "- " + mi[k] + "\n";
   for(int k = 0, sh = 0; k < np && sh < 5; k++) { if(StringFind(pl[k], "clear space") == 0) continue; t += "+ " + pl[k] + "\n"; sh++; }
   // what the drills showed you were missing, only the parts that apply here
   string ls = "";
   if(MetalOrOil()) ls += "wider stop on gold/oil (drill 10); ";
   if(z.tested) ls += "tested = skip (drill 10); ";
   if(Overextended(z.dir, z.prox)) ls += "overextended = wait (drill 9); ";
   ls += "TP before the next zone, not past it (drills 2, 6, 7)";
   t += "Drills: " + ls;
   if(StringLen(t) > 900) t = StringSubstr(t, 0, 895) + "...";        // keep the details text to tooltip size
   return t;
  }

// The N zones closest to price, mentor style: light fill, solid border, prices at the right edge.
void DrawZones(Zone &zs[], bool htf)
  {
   ENUM_TIMEFRAMES tf = htf ? HtfOf(CTF) : CTF;
   double px = Mid();
   // pick the closest eligible zones
   int idx[]; double dst[]; int n = 0;
   for(int i = 0; i < ArraySize(zs); i++)
     {
      if(!htf && zs[i].legBar > InpMaxZoneAge) continue;
      if(zs[i].removed && (htf || !InpShowRemoved)) continue;
      if(zs[i].tested && !htf && !InpShowTested) continue;
      if(!htf && InpOnlyQualified && !zs[i].chain && !zs[i].removed) continue;
      if(!htf && TooSmall(zs, i)) continue;
      ArrayResize(idx, n + 1); ArrayResize(dst, n + 1);
      idx[n] = i; dst[n] = MathMin(MathAbs(zs[i].prox - px), MathAbs(zs[i].dist - px)); n++;
     }
   int want = htf ? 2 : InpMaxZones;
   datetime right = cT(0) + PeriodSeconds() * 18;
   for(int pick = 0; pick < MathMin(want, n); pick++)
     {
      int best = -1;
      for(int j = 0; j < n; j++) if(idx[j] >= 0 && (best < 0 || dst[j] < dst[best])) best = j;
      if(best < 0) break;
      if(!htf && !zs[idx[best]].removed && zs[idx[best]].trapBar == -1) { int tb = -1; bool cr = false; Zone q = zs[idx[best]]; zs[idx[best]].trap = FindTrap(_Symbol, tf, q.dir, q.prox, q.dist, q.saBar, q.baseEnd, tb, cr); zs[idx[best]].trapBar = tb == -1 ? -2 : tb; zs[idx[best]].crowded = cr; }
      int zi = idx[best]; Zone z = zs[zi]; string id = PFX + (htf ? "H" : "Z") + IntegerToString(zi); idx[best] = -1;
      string verdict = "", shortWhy = "", full = htf ? "" : ZoneNotes(zs, zi, verdict, shortWhy);
      color fill = htf ? cHtfFill : (z.removed ? cRemFill : (z.dir > 0 ? cDemandFill : cSupplyFill));
      color line = z.removed ? cMuted : (z.dir > 0 ? cDemandLine : cSupplyLine);
      datetime t1 = iTime(_Symbol, tf, z.legBar + z.baseN);
      datetime t2 = z.removed ? iTime(_Symbol, tf, z.removedBar) : right;
      ObjectCreate(0, id, OBJ_RECTANGLE, 0, t1, z.prox, t2, z.dist);
      ObjectSetInteger(0, id, OBJPROP_COLOR, fill); ObjectSetInteger(0, id, OBJPROP_BACK, true); ObjectSetInteger(0, id, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, id, OBJPROP_FILL, true);                     // MT5 rectangles are outlines unless filled
      string state = z.removed ? "removed" : (z.tested ? "tested" : "fresh");
      ObjectSetString(0, id, OBJPROP_TOOLTIP, htf ? TfName(tf) + " " + ZoneName(z) : ZoneName(z) + " | " + verdict + " - click for details");
      if(!htf) RegZone(id, ZoneName(z) + "\n" + full, z, verdict, state, t1);
      if(!htf)
        {
         HLine(id + "p", t1, t2, z.prox, line, STYLE_SOLID, z.arrival ? 2 : 1);
         HLine(id + "d", t1, t2, z.dist, line, STYLE_SOLID, z.arrival ? 2 : 1);
        }
      PriceTag(id + "pp", t2, z.prox, htf ? cText : line);
      PriceTag(id + "dp", t2, z.dist, htf ? cText : line);
      if(!htf && z.trap > 0 && z.trapBar > 0)
        {
         double th = MathMax(MathAbs(z.prox - z.dist) * 0.12, 2 * _Point);
         ObjectCreate(0, id + "lt", OBJ_RECTANGLE, 0, cT(z.trapBar), z.trap, t2, z.dir > 0 ? z.trap - th : z.trap + th);
         ObjectSetInteger(0, id + "lt", OBJPROP_COLOR, cTrap); ObjectSetInteger(0, id + "lt", OBJPROP_BACK, true); ObjectSetInteger(0, id + "lt", OBJPROP_SELECTABLE, false);
         ObjectSetInteger(0, id + "lt", OBJPROP_FILL, true);
         ObjectSetString(0, id + "lt", OBJPROP_TOOLTIP, "Liquidity trap " + DoubleToString(z.trap, _Digits) + " - obvious level in front of the zone; retail stops rest here, price runs them into the zone (lesson 16)");
        }
      if(InpShowNames)
        {
         string nm = htf ? TfName(tf) + " " + (z.dir > 0 ? "demand" : "supply") : (z.arrival ? "ARRIVAL | " : "") + ZoneName(z) + " | " + verdict + (shortWhy == "" ? "" : ": " + shortWhy);
         Txt(id + "n", t1, z.dir > 0 ? z.dist : z.dist, nm, verdict == "WEAK" ? cMuted : cText, 7, z.dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
         if(!htf) ObjectSetString(0, id + "n", OBJPROP_TOOLTIP, "click for details");
        }
     }
  }

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

//+------------------------------------------------------------------+
//| HTF trend (same fractal method as ZoneBot) + curve               |
//| Fractals computed here with the MT4 Fractals rule (2 bars each   |
//| side, equal highs / lows allowed up to 9-bar patterns) - no       |
//| indicator handle needed.                                         |
//+------------------------------------------------------------------+
double FracUp(string s, ENUM_TIMEFRAMES tf, int i)
  {
   int bars = iBars(s, tf);
   if(i < 2 || i + 2 > bars - 1) return 0;
   double c = iHigh(s, tf, i);
   if(!(c > iHigh(s, tf, i - 1) && c > iHigh(s, tf, i - 2))) return 0;
   double p1 = iHigh(s, tf, i + 1), p2 = iHigh(s, tf, i + 2);
   if(c > p1 && c > p2) return c;
   if(bars - i - 1 >= 3) { double p3 = iHigh(s, tf, i + 3); if(c == p1 && c > p2 && c > p3) return c; }
   if(bars - i - 1 >= 4) { double p3 = iHigh(s, tf, i + 3), p4 = iHigh(s, tf, i + 4); if(c >= p1 && c == p2 && c > p3 && c > p4) return c; }
   if(bars - i - 1 >= 5) { double p3 = iHigh(s, tf, i + 3), p4 = iHigh(s, tf, i + 4), p5 = iHigh(s, tf, i + 5); if(c >= p1 && c == p2 && c == p3 && c > p4 && c > p5) return c; }
   if(bars - i - 1 >= 6) { double p3 = iHigh(s, tf, i + 3), p4 = iHigh(s, tf, i + 4), p5 = iHigh(s, tf, i + 5), p6 = iHigh(s, tf, i + 6); if(c >= p1 && c == p2 && c >= p3 && c == p4 && c > p5 && c > p6) return c; }
   return 0;
  }
double FracDn(string s, ENUM_TIMEFRAMES tf, int i)
  {
   int bars = iBars(s, tf);
   if(i < 2 || i + 2 > bars - 1) return 0;
   double c = iLow(s, tf, i);
   if(!(c < iLow(s, tf, i - 1) && c < iLow(s, tf, i - 2))) return 0;
   double p1 = iLow(s, tf, i + 1), p2 = iLow(s, tf, i + 2);
   if(c < p1 && c < p2) return c;
   if(bars - i - 1 >= 3) { double p3 = iLow(s, tf, i + 3); if(c == p1 && c < p2 && c < p3) return c; }
   if(bars - i - 1 >= 4) { double p3 = iLow(s, tf, i + 3), p4 = iLow(s, tf, i + 4); if(c <= p1 && c == p2 && c < p3 && c < p4) return c; }
   if(bars - i - 1 >= 5) { double p3 = iLow(s, tf, i + 3), p4 = iLow(s, tf, i + 4), p5 = iLow(s, tf, i + 5); if(c <= p1 && c == p2 && c == p3 && c < p4 && c < p5) return c; }
   if(bars - i - 1 >= 6) { double p3 = iLow(s, tf, i + 3), p4 = iLow(s, tf, i + 4), p5 = iLow(s, tf, i + 5), p6 = iLow(s, tf, i + 6); if(c <= p1 && c == p2 && c <= p3 && c == p4 && c < p5 && c < p6) return c; }
   return 0;
  }
int HtfTrend(string s, ENUM_TIMEFRAMES htf)
  {
   double hi[2] = {0, 0}, lo[2] = {0, 0}; int nh = 0, nl = 0;
   for(int i = 3; i < 300 && (nh < 2 || nl < 2); i++)
     {
      double u = FracUp(s, htf, i), d = FracDn(s, htf, i);
      if(u > 0 && nh < 2) hi[nh++] = u;
      if(d > 0 && nl < 2) lo[nl++] = d;
     }
   if(nh < 2 || nl < 2) return 0;
   if(hi[0] > hi[1] && lo[0] > lo[1]) return 1;               // higher highs + higher lows
   if(hi[0] < hi[1] && lo[0] < lo[1]) return -1;              // lower highs + lower lows
   // mixed swings: the last break of structure decides (close beyond the latest swing high / low)
   double c = iClose(s, htf, 1);
   if(c > hi[0]) return 1;
   if(c < lo[0]) return -1;
   return 0;
  }
double Curve(string s, ENUM_TIMEFRAMES htf, double p)
  {
   int hiI = iHighest(s, htf, MODE_HIGH, 100, 1), loI = iLowest(s, htf, MODE_LOW, 100, 1);
   if(hiI < 0 || loI < 0) return 50;
   double hi = iHigh(s, htf, hiI), lo = iLow(s, htf, loI);
   return hi > lo ? 100.0 * (p - lo) / (hi - lo) : 50;
  }

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
         if(InpHalfwayAlert && MathAbs(alertedHalf - half) > 10 * _Point && ((dir < 0 && bid >= half) || (dir > 0 && bid <= half)))
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
      else Comment(L);
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
   int x0 = 8, y0 = 22, bw = MathMax(w * 6 + 22, StringLen(head) * 7 + 22), bh = 22 + 14 * rows + (rows > 0 ? 6 : 0);
   string tip = gPanL; if(StringLen(tip) > 900) tip = StringSubstr(tip, 0, 895) + "...";
   Box("RFXS_bg", x0, y0, bw, bh, cPopBg, cPopBorder);
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
   return PERIOD_CURRENT;
  }
void RsInit()
  {
   aNStd = aN;                                                       // the chart's own ATR slots; research slots follow
   rsN = 0; ArrayResize(RZ, 0); rsFile = INVALID_HANDLE; rsFailed = false; rsDirty = false; rsCount = 0;
   ArrayResize(rsSeenS, 0); ArrayResize(rsSeenD, 0); ArrayResize(rsSeenT, 0);
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
      AtrSlot(t);
      ENUM_TIMEFRAMES ht = HtfOf(t);
      if(ht > 0) AtrSlot(ht);
     }
   if(rsN == 0) { gRs = false; Print("ZoneVision research: no valid timeframe in InpResearchTFs"); return; }
   Print("ZoneVision research mode ON: ", InpResearchTFs, InpResearchAlt ? " (+ALT detector)" : "");
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
   hd += ",t1c_mfe,t1c_result";
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
   for(int s = 0; s < rsN; s++) RsSlot(s);
   if(rsDirty && rsFile != INVALID_HANDLE) { FileFlush(rsFile); rsDirty = false; }
  }

void RsSlot(int s)
  {
   ENUM_TIMEFRAMES T = rsTF[s];
   if(iBars(_Symbol, T) < InpLookback + InpMaxBase + 30) return;
   datetime b1 = iTime(_Symbol, T, 1);
   if(b1 <= 0 || b1 == rsLast[s]) return;
   if(ATR(T, 1) <= 0) return;                                        // ATR not ready yet: try again next tick
   datetime prev = rsLast[s];
   rsLast[s] = b1;
   if(prev > 0)
     {
      int from = iBarShift(_Symbol, T, prev, false);                 // the candle handled last time (normally shift 2)
      if(from < 2) from = 2;
      if(from > 60) from = 60;
      for(int sh = from - 1; sh >= 1; sh--) RsUpdate(s, sh);
     }
   Zone zv[];
   Detect(_Symbol, T, zv, false);
   int nv[]; int cnt = 0;
   if(prev > 0)                                                      // the first pass only sets the start point (no history zones)
      for(int i = 0; i < ArraySize(zv); i++)
         if(zv[i].saBar >= 1 && iTime(_Symbol, T, zv[i].saBar) > prev) { ArrayResize(nv, cnt + 1); nv[cnt] = i; cnt++; }
   Zone alt[]; string altS[]; int na = 0;
   if(InpResearchAlt) na = RsAlt(s, T, prev == 0, alt, altS);
   if(cnt == 0 && na == 0) return;
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
   datetime tB0 = iTime(_Symbol, T, z.legBar + z.baseN), tB1 = iTime(_Symbol, T, z.legBar + 1), tNow = iTime(_Symbol, T, 0);
   string pat = z.dir > 0 ? (z.cont ? "RBR" : "DBR") : (z.cont ? "DBD" : "RBD");
   double legIn = Rng(_Symbol, T, z.legBar + z.baseN + 1) / atr, legOut = Rng(_Symbol, T, z.legBar) / atr;
   int cntA = MathMax(1, z.legBar);
   double mv = z.dir > 0 ? (iHigh(_Symbol, T, iHighest(_Symbol, T, MODE_HIGH, cntA, 1)) - z.prox) / hg
                         : (z.prox - iLow(_Symbol, T, iLowest(_Symbol, T, MODE_LOW, cntA, 1))) / hg;
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
         if(RZ[j].slot != s || !RZ[j].alt || RZ[j].dir == z.dir || RZ[j].broken) continue;
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
   RZone nr; ZeroMemory(nr);
   nr.crow = c; nr.slot = s; nr.dir = z.dir; nr.alt = isAlt;
   nr.prox = z.prox; nr.dist = z.dist; nr.hgt = hg; nr.spr = spr; nr.risk = risk; nr.oppR = oppR;
   nr.endR = MathMax(5.0, (oppR > 0 && oppR <= 20) ? oppR : 0.0);   // a touch trade runs until 5R or the opposing zone, whichever is further
   nr.age = 0; nr.broken = false; nr.brokenT = 0; nr.brokenAge = 0;
   nr.runout = MathMax(0, mv); nr.nT = 0; nr.inTr = false;
   nr.away = z.dir > 0 ? iLow(_Symbol, T, 1) > z.prox : iHigh(_Symbol, T, 1) < z.prox;
   nr.mfe = 0; nr.dep = 0; nr.r1 = false; nr.mfeC = 0; nr.cOn = false; nr.cRes = 0;
   for(int k = 0; k < 3; k++) { nr.tT[k] = 0; nr.tAge[k] = 0; nr.tDep[k] = 0; nr.tMfe[k] = 0; nr.tRes[k] = 0; nr.tEnd[k] = 0; nr.tEndAge[k] = 0; }
   int n = ArraySize(RZ);
   ArrayResize(RZ, n + 1);
   RZ[n] = nr;
  }

//--- outcome tracking: one closed candle (shift sh) of slot s for every zone of that timeframe
void RsUpdate(int s, int sh)
  {
   ENUM_TIMEFRAMES T = rsTF[s];
   double bh = iHigh(_Symbol, T, sh), bl = iLow(_Symbol, T, sh), bc = iClose(_Symbol, T, sh);
   datetime bt = iTime(_Symbol, T, sh);
   bool emo = Emotional(_Symbol, T, sh);
   for(int i = ArraySize(RZ) - 1; i >= 0; i--)
     {
      if(RZ[i].slot != s) continue;
      string st = RsStep(i, bh, bl, bc, emo, bt);
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
string RsStep(int i, double bh, double bl, double bc, bool emo, datetime bt)
  {
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
      if(cb) { RZ[i].cOn = false; RZ[i].cRes = 1; }
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
         if(k == 0) { RZ[i].cOn = !cb; RZ[i].cRes = cb ? 1 : 0; RZ[i].mfeC = cb ? 0 : MathMax(0, cR); }
        }
      else if(!touch) RZ[i].away = true;
     }
   if(RZ[i].nT == 0) RZ[i].runout = MathMax(RZ[i].runout, (d > 0 ? bh - px : px - bl) / hz0);
   if(!RZ[i].broken && (cb || (wick && !emo))) { RZ[i].broken = true; RZ[i].brokenT = bt; RZ[i].brokenAge = RZ[i].age; }   // ZoneVision removal rule
   bool idle = !RZ[i].inTr && !RZ[i].cOn;
   if(idle && RZ[i].broken) return "broken";
   if(idle && RZ[i].nT >= 3) return "touches3";
   if(RZ[i].age >= InpResearchMaxBars) return "horizon";
   return "";
  }
// write the zone's row (create + outcome) and stop following it
void RsFinish(int i, string st, datetime when)
  {
   if(RZ[i].inTr) RsEndTouch(i, RZ[i].nT - 1, 3, when);
   if(RZ[i].cOn) { RZ[i].cOn = false; RZ[i].cRes = 3; }
   if(rsFile != INVALID_HANDLE)
     {
      string o = st + "," + RsTime(when) + "," + RsI(RZ[i].age) + "," + RsB(RZ[i].nT == 0) + "," + RsD(RZ[i].runout, 3) + "," + RsB(RZ[i].broken)
                 + "," + RsTime(RZ[i].brokenT) + "," + (RZ[i].broken ? RsI(RZ[i].brokenAge) : "") + "," + RsI(RZ[i].nT);
      for(int k = 0; k < 3; k++)
        {
         if(k >= RZ[i].nT) { for(int e = 0; e < 13; e++) o += ","; continue; }
         double m = RZ[i].tMfe[k];
         o += "," + RsTime(RZ[i].tT[k]) + "," + RsI(RZ[i].tAge[k]) + "," + RsD(RZ[i].tDep[k] * 100, 1) + "," + RsD(m, 3);
         for(int r = 1; r <= 5; r++) o += "," + RsB(m >= r);
         o += "," + RsB(RZ[i].oppR > 0 && m >= RZ[i].oppR) + "," + RsRes(RZ[i].tRes[k]) + "," + RsTime(RZ[i].tEnd[k]) + "," + RsI(RZ[i].tEndAge[k]);
        }
      o += "," + (RZ[i].nT > 0 ? RsD(RZ[i].mfeC, 3) : "") + "," + (RZ[i].nT > 0 ? RsRes(RZ[i].cRes) : "");
      FileWrite(rsFile, RZ[i].crow + "," + o);
      rsDirty = true;
      rsCount++;
     }
   int n = ArraySize(RZ);
   if(i < n - 1) RZ[i] = RZ[n - 1];
   ArrayResize(RZ, n - 1);
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
      if(RZ[i].slot != s || !RZ[i].alt || RZ[i].dir != d || RZ[i].broken) continue;
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
void DumpObjects()
  {
   static bool once = false;
   if(InpDumpAt > 0) { if(once || cT(0) < InpDumpAt) return; once = true; }
   DumpPrefixes("RFX_Dump_", "RFXV_|RFXN_|RFXS_|RFXP2_");
   Print("ZoneVision dump written for bar ", TimeToString(cT(0), TIME_DATE | TIME_MINUTES), " (Terminal\\Common\\Files\\RFX_Dump_", RsSym(), "_", TfName(CTF), ".csv)");
  }
