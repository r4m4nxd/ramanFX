//+------------------------------------------------------------------+
//| RamanFX_ZoneBot.mq4  (v0.1 - DEMO ONLY)                           |
//| Supply & demand zone bot built from the mentor's rules:          |
//|  - zone = basing + move away + stay away + space to proximal     |
//|  - continuation zones (RBR / DBD) only, fresh only, graded A/B/C |
//|  - entry TF takes direction from its HTF (1m->15m, 5m->H1,         |
//|    15m->H4, H1->1D, H4->1W)                                         |
//|  - set & forget (limit at proximal) and/or confirmation          |
//|    (HTF zone touched + an opposing entry-TF zone removed)        |
//|  - SL beyond distal + spread, TP just before the opposing zone   |
//|  - 1% risk, always a stop, 1 order per symbol per entry TF       |
//|  - cancels limits if the zone is removed or price reaches the    |
//|    target first; news / Asian session / Friday / spread filters  |
//|  - every filled trade is replayed with every TP & break-even     |
//|    variant on M1 data so we learn which management pays best     |
//| Modes: 0 Scanner (draw + alert), 1 Approve (chart buttons),      |
//|        2 Auto.                                                   |
//| Attach to ONE chart (any symbol). Allow live trading.            |
//| Logs (MQL4\Files): RamanFX_Bot_Signals.csv,                      |
//|                    RamanFX_Bot_Variants.csv                      |
//| Strategy Tester (tester\files): RamanFX_Backtest_<sym>.csv,       |
//|   _KPIs.csv, _Statement.htm (import into RamanFX), _Exits.csv     |
//| News file (optional): MQL4\Files\RamanFX_News.csv with lines     |
//|   2026.10.17 12:30,USD   (UTC time, currency)                    |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "1.50"
#property strict

enum BotMode   { MODE_SCANNER = 0, MODE_APPROVE = 1, MODE_AUTO = 2 };
enum EntryMode { ENTRY_SF = 0, ENTRY_CONF = 1, ENTRY_BOTH = 2 };
enum LiveBE    { BE_NONE = 0, BE_AT_1R = 1, BE_AT_2R = 2 };
enum Manage    { MG_OFF = 0, MG_MENTOR = 1, MG_BE_ONLY = 2 };
enum TpMode    { TP_SWING = 0, TP_OPP_ZONE = 1, TP_NEAREST = 2 };
enum Grades    { GR_ALL = 0, GR_A = 1, GR_AB = 2, GR_B = 3, GR_C = 4 };
enum BotPreset { PRESET_CUSTOM = 0, PRESET_KEVIN_BEST = 1, PRESET_AGGRESSIVE = 2, PRESET_ZONES_3R = 3 };

input BotMode   InpMode          = MODE_APPROVE; // Mode: Approve = bot finds + alerts, you check the chart and press Place
input BotPreset InpPreset        = PRESET_KEVIN_BEST; // Preset: Kevin best = M15/H1/H4, grade A arrival zones only, ATR stop, BE at 2R only, 1 order per zone. Custom = your settings below. Aggressive = as InpAggressive
input bool      InpAggressive    = false;        // Aggressive: TFs ticked below, S&F + conf, grades A-C (C half risk), VP, 1 order/pair/TF (>=7/pair, 60 total). Zone rules, stops, R:R, risk %, news still apply
input Grades    InpGrades        = GR_ALL;       // Which planner grades to trade: All / A only / A+B / B only / C only
input bool      InpHalfRiskC     = true;         // Planner rule: low odds (grade C) risks half
input EntryMode InpEntry         = ENTRY_BOTH;   // Entry method
input string    InpSymbols       = "";           // Symbols: empty = THIS chart's pair only (drop the bot on each pair you want); ALL = every forex pair; or a comma list
input int       InpScansPerTick  = 4;            // Max symbol/timeframe scans per 2-second tick (keeps MT4 responsive)
input string    InpSuffix        = "";           // Broker symbol suffix (e.g. .a)
input bool      InpTF_M1         = true;         // Trade 1m entries (HTF 15m)
input bool      InpTF_M5         = true;         // Trade 5m entries (HTF H1)
input bool      InpTF_M15        = true;         // Trade 15m entries (HTF H4)
input bool      InpTF_H1         = true;         // Trade H1 entries (HTF 1D)
input bool      InpTF_H4         = true;         // Trade H4 entries (HTF 1W)
input bool      InpTF_D1         = true;         // Trade D1 entries (HTF 1M)
input bool      InpTF_W1         = true;         // Trade W1 entries (HTF 1M)
input double    InpRiskPct       = 1.0;          // Risk per trade (% of balance)
input double    InpMinRR         = 2.0;          // Minimum reward:risk to opposing zone
input double    InpMinLegRatio   = 1.5;          // Move-away range / largest base candle (Seiden: strong departure)
input int       InpMaxBase       = 6;            // Max basing candles
input double    InpMaxZoneATR    = 1.5;          // Max zone height in ATR(14) (similar-size rule)
input int       InpLookback      = 200;          // Bars scanned per timeframe
input int       InpMaxZoneAge    = 200;          // Ignore zones older than this many bars
input double    InpStopBufferPts = 10;           // (legacy, unused) see CP / VP stop inputs below
input double    InpStopScale     = 1.0;          // Stop buffer multiplier. Base pips beyond the zone/swing: M1 1, M5 1.5, M15 3, H1 5, H4 10, D1 20, W1 40
input int       InpVPSwingBars   = 10;           // VP: look this many entry-TF candles around the zone for the valley / peak
input TpMode    InpTpMode        = TP_NEAREST;     // Target: recent swing low/high (like your manual trades), next opposing zone, or whichever is nearer
input bool      InpTradeVP       = true;         // Also trade VP (reversal) zones, with their swing stop
input int       InpMaxPerSymbol  = 3;            // Max bot orders per symbol (one per entry timeframe)
input int       InpMaxOrders     = 40;           // Max bot orders in total (pending + open)
input double    InpMinStopPips   = 3.0;          // Minimum stop distance (pips) - tiny zones get a wider stop, smaller lots
input double    InpMinStopSpreads= 3.0;          // ...and at least this many spreads
input double    InpMaxLots       = 2.0;          // Hard cap on lots per order
input double    InpMaxMarginPct  = 10.0;         // Skip if the order needs more than this % of free margin
input double    InpMinStopATR    = 0.2;          // Minimum stop as a fraction of the entry TF's ATR(14)
input double    InpZ3RR          = 3.0;          // Zones 3R preset: fixed reward:risk (TP = entry + N x stop)
input double    InpZ3Front       = 0.05;         // Zones 3R preset: enter this fraction of the zone height before the proximal
input double    InpZ3StopBuf     = 0.10;         // Zones 3R preset: stop this fraction of the zone height beyond the distal (+ spread)
input bool      InpZ3Bias        = true;         // Zones 3R preset: skip zones against the HTF bias (trendline break / swings)
input double    InpBestStopATR   = 0.5;          // Kevin best preset: stop at least N x entry TF ATR(14) from entry (metals / oil also >= 0.35 x HTF ATR)
input double    InpMinDeparture  = 1.5;          // Departure: price must travel >= N x zone height away from the proximal line
input bool      InpRequireITF    = false;        // Skip when the intermediate TF trend points the other way (3-timeframe check)
input bool      InpCurveFilter   = false;        // Demand only in the lower third of the HTF curve (half if at an HTF demand), supply mirrored
input double    InpMaxDistATR    = 2.0;          // Zone must be within N x HTF ATR of price and in the first half of the way to target (no chasing)
input bool      InpHalfwayAlert  = true;         // Zone further than that: draw a halfway line and alert when price gets there
input bool      InpUseMyLines    = true;         // Use YOUR trendlines on this chart for the trend, and YOUR rectangles as zones to advise
input bool      InpRequireQualified = true;      // Kevin's chain rule (same as ZoneVision): the move away removed an opposing zone or a trendline, made a new high/low of the lookback, or took out the previous swing high/low
input int       InpTLSwing       = 2;            // Trendlines (same as ZoneVision): swing = N bars each side; REAL only after a new higher high / lower low
input bool      InpTLBias        = true;         // Bias from the newest HTF trendline break (a broken daily downtrend line = bullish for H4 / H1); your own lines still win
input bool      InpBlockOverext  = true;         // Kevin: no entries beyond the channel 50% (overextended); trade the golden area
input double    InpMinGap        = 0.15;         // Kevin: space between stay-away candle and proximal (x zone height); less = drawable only, not traded
input double    InpMinSizeVsMedian = 0.5;        // Kevin: a zone about half the size of the other zones is too small to trade
input double    InpMetalOilStop  = 2.0;          // Kevin: wider stops on gold and oil (x the timeframe buffer)
input bool      InpNewsIntradayOnly = true;      // Kevin: avoid news with intraday limit orders; daily swing orders don't need the filter
input double    InpMaxDailyLossPct = 4.0;        // Daily loss limit: no new orders + cancel pendings once equity is down this % today
input double    InpMgmtMaxSpreadR = 0.25;        // Don't move stops while spread > this fraction of 1R (rollover spikes)
input double    InpMaxSpreadPct  = 15;           // Max spread as % of the stop distance
input bool      InpSkipAsian     = false;        // No new orders in the Asian session
input int       InpAsianStartUTC = 22;           // Asian session start (UTC hour)
input int       InpAsianEndUTC   = 6;            // Asian session end (UTC hour)
input int       InpNewsBeforeMin = 30;           // No orders this many minutes before news
input int       InpNewsAfterMin  = 30;           // ...and after
input int       InpFridayCutUTC  = 19;           // Friday: cancel pendings, no new orders after (UTC hour)
input Manage    InpManage        = MG_MENTOR;    // Trade management while the bot runs
input LiveBE    InpLiveBE        = BE_AT_2R;     // Break-even trigger (used by both management modes)
input bool      InpHalfRiskAt1R  = true;         // Mentor: at +1R cut the risk in half (stop to -0.5R)
input bool      InpTrailZones    = true;         // Mentor: move the stop under each new zone that forms in your favour
input bool      InpPartialAt3R   = false;        // Mentor's split: close 25% at 3R, run the rest
input int       InpConfTouchBars = 60;           // Confirmation: HTF zone touched within N entry bars
input int       InpPendingBars   = 100;          // Cancel unfilled limit after N entry bars
input int       InpSimDays       = 5;            // Variant replay horizon (days)
input int       InpMagic         = 770100;       // Magic number base
input bool      InpLogSkips      = false;        // Also log skipped zones to the CSV (off = orders only)
input bool      InpAlerts        = true;         // Pop-up alert for new setups
input string    SepT             = "-- Strategy Tester (only used in the tester) --"; // -----
input int       InpTesterGMT     = 2;            // Tester: broker server time offset from GMT (most brokers 2, or 3 in summer) for Friday / Asian rules
input bool      InpTesterNews    = false;        // Tester: use RamanFX_News.csv (only if it holds the PAST news for the test period)
input bool      InpPush          = true;         // Push to the MT4 phone app (Tools > Options > Notifications, MetaQuotes ID)
input bool      InpDraw          = true;         // Draw on this chart (live): zones of this timeframe with grade / ARRIVAL, trendlines used, skip reasons, order marks, risk panel. Tester: visual mode only
input double    InpTrapATR       = 1.0;          // Liquidity trap: obvious level within N x ATR in front of the zone
input int       InpTrapSwing     = 3;            // Obvious level = swing with N bars each side
input bool      InpRequireTrap   = false;        // Only trade zones with a liquidity trap
input string    SepB             = "-- Capital protection (Kevin Best) --"; // -----
input double    InpBestRiskPct   = 0.5;          // Kevin best: risk per trade (% of balance), replaces InpRiskPct
input double    InpMaxOpenRiskPct = 1.5;         // Kevin best: total risk to stop of all open + pending bot orders must stay within this % of balance
input int       InpMaxTradesDay  = 2;            // Kevin best: max new fills per symbol per UTC day (then the symbol's pendings are cancelled for the day)
input int       InpMaxLossStreak = 2;            // Kevin best: after this many losing closes in a row, no new orders until the next UTC day
input double    InpDailyLossPctBest = 2.0;       // Kevin best: closed + floating loss vs the UTC day's start balance: stop + cancel pendings for the day
input double    InpWeeklyLossPct = 4.0;          // Kevin best: same vs the week's start balance: stop + cancel pendings for the week
input double    InpDDHalfRiskPct = 6.0;          // Kevin best: equity this % below its peak = half risk per trade until a new equity high

//--- timeframe pairs (mentor's combos)
#define NTF 7
int TF_E[NTF] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1};
int TF_H[NTF] = {PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1, PERIOD_MN1};
int TF_I[NTF] = {PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};   // intermediate TF
string TF_N[NTF] = {"M1", "M5", "M15", "H1", "H4", "D1", "W1"};

struct Zone
  {
   double   gap;        // space between the stay-away candle and the proximal line / zone height (Kevin's main quality grade)
   bool     ath;        // the move away made an all-time high/low (within the loaded history)
   bool     leg2;       // a second explosive candle followed straight away
   double   departure;  // distance travelled away / zone height
   bool     erc;        // extended-range move-away candle
   double   trap;       // liquidity trap price (0 = none)
   bool     crowded;    // zone sits on an obvious S/R level (retail crowd)
   int      trapBar;
   int      dir;        // +1 demand, -1 supply
   double   prox, dist;
   int      legBar;     // bar index of the move-away candle (at detection time)
   datetime tLeg;
   int      baseN;
   double   legRatio;
   string   grade;
   bool     cont;       // continuation (RBR/DBD)
   bool     tested;     // price returned to proximal
   double   pen;        // deepest penetration into the zone (fraction of its height)
   bool     consumed;   // closed inside, wicked beyond distal, or >= 50% penetrated: no longer tradable
   bool     removed;    // closed beyond distal
   datetime tRemoved;
   datetime tTouched;
  };

struct Sim               // one filled trade replayed with every variant
  {
   int      ticket;
   string   sym;
   string   tf;
   string   method;
   string   grade;
   int      dir;
   double   entry, R, opp;
   datetime t0;
   datetime tLast;
   bool     done;
  };

// Variants: TP x BE
string TP_N[5] = {"OppZone", "2R", "3R", "5R", "25%@3R+OppZone"};
string BE_N[4] = {"NoBE", "BE@1R", "BE@2R", "+0.5R@2R"};
#define NV 20

Sim      sims[];
string   syms[];
datetime lastBar[][NTF];
string   newsCcy[];
datetime newsTime[];
datetime lastNewsLoad = 0;
datetime lastSimBar = 0; datetime startedAt = 0;
int      knownTickets[];

// Approve mode proposals
struct Proposal { string sym; int k; int dir; double entry, sl, tp, dist, rr, prox; bool trap; string method, grade, info; datetime t, tZone; };
string placeErr = "";
string keep = "|";
int myTrend = 0; string myTrendWhy = ""; datetime lastMine = 0;
Proposal props[]; string lastPanelSig = ""; int viewK = -1; int panelBottom = 120;
string dSym[]; int dK[]; string dProx[]; datetime dTime[]; bool dMy[];   // advice you denied (expires when the zone goes or after 3 days)
bool busy = false; string lastClickNm = ""; uint lastClickMs = 0;

//+------------------------------------------------------------------+
BotMode gMode = MODE_APPROVE;                                          // the tester has no buttons: it always runs AUTO
double   gStartBal = 0; datetime gTestStart = 0;                       // tester: balance and time at the start, for the backtest report
int OnInit()
  {
   gMode = IsTesting() ? MODE_AUTO : InpMode;
   if(IsTesting()) { gStartBal = AccountBalance(); gTestStart = TimeCurrent(); }
   startedAt = TimeLocal();
   BuildSymbols();
   ArrayResize(lastBar, ArraySize(syms));
   for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < NTF; k++) lastBar[i][k] = 0;
   if(!IsTesting()) { LoadSims(); StLoad(); }                          // tester: tickets restart at 1, old state would mix in
   LoadNews();
   EnsureHeaders();
   LoadProps();
   busy = false; keep = "|"; lastClickNm = ""; lastClickMs = 0;
   vzOrdSig = ""; ArrayResize(vzSkip, 0);                              // globals survive a timeframe switch: redraw from scratch
   viewK = GlobalVariableCheck("RFX_view_" + _Symbol) ? (int)GlobalVariableGet("RFX_view_" + _Symbol) : -1;
   lastPanelSig = "-";
   if(gMode == MODE_APPROVE)
     {
      for(int o = ObjectsTotal(0, -1, -1) - 1; o >= 0; o--)            // no phantom presses left over from before the reload
        {
         string nm = ObjectName(0, o);
         if(StringFind(nm, "RFXB_") == 0) ObjectSetInteger(0, nm, OBJPROP_STATE, false);
        }
      int vi = -1;
      for(int j = 0; j < ArraySize(props); j++) if(props[j].k == viewK && props[j].sym == _Symbol) { vi = j; break; }
      if(vi >= 0) { if(ObjectFind(0, "RFXP_z") < 0) DrawView(vi); }
      else if(viewK >= 0) ClearView();
      DrawProposals();
     }
   EventSetTimer(2);
   Print("RamanFX ZoneBot started: ", ArraySize(syms), " symbols, mode ", EnumToString(gMode));
   return(INIT_SUCCEEDED);
  }

void OnDeinit(const int reason)
  {
   if(IsTesting()) BacktestReport();
   EventKillTimer();
   FlushSignals(true);
   SaveSims();
   ObjectsDeleteAll(0, "RFXZ_");
   if(reason != REASON_CHARTCHANGE) ObjectsDeleteAll(0, "RFXB_");   // timeframe switch (View): buttons stay, OnInit re-syncs them
   ObjectsDeleteAll(0, "RFXN2_");
   if(reason != REASON_CHARTCHANGE) ObjectsDeleteAll(0, "RFXP_");
   Comment("");
   ObjectsDeleteAll(0, "RFXS_");
   ObjectsDeleteAll(0, "RFXW_");
   ObjectsDeleteAll(0, "RFXT_");
   ObjectsDeleteAll(0, "RFXK_");
   ObjectsDeleteAll(0, "RFXV_");
  }

// Far zones (more than InpMaxDistATR x HTF ATR from price): price usually needs several
// HTF candles one way to get there and often turns first. Plan it, alert at halfway.
struct Watch { string sym; int k; int dir; double prox, half, atr, far; int htf; bool hit; };
Watch watches[];
int WatchIdx(string s, int k) { for(int i = 0; i < ArraySize(watches); i++) if(watches[i].sym == s && watches[i].k == k) return i; return -1; }
void ClearWatch(string s, int k)
  {
   int i = WatchIdx(s, k); if(i < 0) return;
   int n = ArraySize(watches); for(int j = i; j < n - 1; j++) watches[j] = watches[j + 1]; ArrayResize(watches, n - 1);
   if(s == _Symbol) ObjectsDeleteAll(0, "RFXW_" + IntegerToString(k));
  }
string WatchText(Watch &w, int digits)
  {
   double c = w.far / MathMax(w.atr, Point);
   return StringFormat("%s %s %s %s is %.1f x %s ATR away (%s, ATR %s): needs ~%d %s candles one way, price often turns first. Alert at halfway %s",
      w.sym, TF_N[w.k], w.dir > 0 ? "demand" : "supply", DoubleToString(w.prox, digits), c, TfName(w.htf), DoubleToString(w.far, digits), DoubleToString(w.atr, digits),
      (int)MathCeil(c), TfName(w.htf), DoubleToString(w.half, digits));
  }
void SetWatch(string s, int k, int dir, double prox, double atr, double far, int htf, int digits)
  {
   double px = MarketInfo(s, MODE_BID);
   int i = WatchIdx(s, k);
   if(i >= 0 && MathAbs(watches[i].prox - prox) < MarketInfo(s, MODE_POINT) * 2) { watches[i].atr = atr; watches[i].far = far; }
   else
     {
      if(i < 0) { i = ArraySize(watches); ArrayResize(watches, i + 1); }
      watches[i].sym = s; watches[i].k = k; watches[i].dir = dir; watches[i].prox = prox; watches[i].atr = atr; watches[i].far = far; watches[i].htf = htf;
      watches[i].half = NormalizeDouble((px + prox) / 2, digits); watches[i].hit = false;
      Print(WatchText(watches[i], digits));
     }
   if(s == _Symbol && InpHalfwayAlert)
     {
      string nm = "RFXW_" + IntegerToString(k);
      datetime t1 = Time[0], t2 = Time[0] + PeriodSeconds() * 30;
      if(ObjectFind(0, nm) < 0) ObjectCreate(0, nm, OBJ_TREND, 0, t1, watches[i].half, t2, watches[i].half);
      ObjectMove(0, nm, 0, t1, watches[i].half); ObjectMove(0, nm, 1, t2, watches[i].half);
      ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, nm, OBJPROP_STYLE, STYLE_DOT); ObjectSetInteger(0, nm, OBJPROP_COLOR, clrGoldenrod);
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false); ObjectSetString(0, nm, OBJPROP_TOOLTIP, WatchText(watches[i], digits));
      string tn = nm + "t";
      if(ObjectFind(0, tn) < 0) ObjectCreate(0, tn, OBJ_TEXT, 0, t2, watches[i].half);
      ObjectMove(0, tn, 0, t2, watches[i].half);
      ObjectSetString(0, tn, OBJPROP_TEXT, StringFormat(" halfway alert %s: %s zone %.1fx ATR away", TF_N[k], dir > 0 ? "demand" : "supply", far / MathMax(atr, Point)));
      ObjectSetInteger(0, tn, OBJPROP_COLOR, clrGoldenrod); ObjectSetInteger(0, tn, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, tn, OBJPROP_ANCHOR, ANCHOR_LEFT);
      ObjectSetInteger(0, tn, OBJPROP_SELECTABLE, false);
      NoSelect(0, "RFXW_");
     }
  }
void CheckWatches()
  {
   if(!InpHalfwayAlert) return;
   for(int i = 0; i < ArraySize(watches); i++)
     {
      if(watches[i].hit) continue;
      double px = MarketInfo(watches[i].sym, MODE_BID);
      if(px <= 0) continue;
      if((watches[i].dir < 0 && px >= watches[i].half) || (watches[i].dir > 0 && px <= watches[i].half))
        {
         watches[i].hit = true;
         int dg = (int)MarketInfo(watches[i].sym, MODE_DIGITS);
         string msg = StringFormat("%s %s: halfway to the %s %s. Check the chart: is a new lower-timeframe zone in the chain forming? If price keeps coming, the zone gets advised once it is within %.1f x ATR.",
            watches[i].sym, TF_N[watches[i].k], watches[i].dir > 0 ? "demand" : "supply", DoubleToString(watches[i].prox, dg), InpMaxDistATR);
         if(InpAlerts) Alert("RamanFX ZoneBot: ", msg);
         if(InpPush && !IsTesting()) SendNotification("RamanFX: " + msg);
         Print(msg);
        }
     }
  }

void OnTick() { if(IsTesting()) Work(); }
void OnTimer() { Work(); }

// Why nothing is trading: counts of every decision since start, shown on the chart.
string cKey[]; int cVal[]; datetime lastScanAt = 0; int scans = 0;
void Count(string why)
  {
   string k = why;
   if(StringFind(k, "R:R") == 0) k = "R:R below minimum";
   for(int i = 0; i < ArraySize(cKey); i++) if(cKey[i] == k) { cVal[i]++; return; }
   int n = ArraySize(cKey); ArrayResize(cKey, n + 1); ArrayResize(cVal, n + 1); cKey[n] = k; cVal[n] = 1;
  }
// Experts tab: one readable line per symbol/timeframe, printed only when its state changes (no spam).
string sayKey[]; string sayVal[];
void Say(string s, int k, string msg)
  {
   string key = s + TF_N[k];
   for(int i = 0; i < ArraySize(sayKey); i++)
      if(sayKey[i] == key) { if(sayVal[i] == msg) return; sayVal[i] = msg; Print(StringFormat("%-7s %-3s -> %s", s, TF_N[k], msg)); return; }
   int n = ArraySize(sayKey); ArrayResize(sayKey, n + 1); ArrayResize(sayVal, n + 1); sayKey[n] = key; sayVal[n] = msg;
   Print(StringFormat("%-7s %-3s -> %s", s, TF_N[k], msg));
  }

string lastStatus = "";
void Status()
  {
   string t = StringFormat("ZoneBot  %s | %s | %d pairs\n", gMode == MODE_AUTO ? "AUTO" : (gMode == MODE_APPROVE ? "APPROVE" : "SCANNER"), EffEntry() == ENTRY_BOTH ? "S&F + conf" : (EffEntry() == ENTRY_SF ? "set & forget" : "confirmation"), ArraySize(syms));
   if(IsAggr()) t = StringSubstr(t, 0, StringLen(t) - 1) + StringFormat(" | AGGRESSIVE (all TFs, A-C, %d/pair, %d max)\n", EffMaxPerSymbol(), EffMaxOrders());
   else if(IsBest()) t = StringSubstr(t, 0, StringLen(t) - 1) + StringFormat(" | KEVIN BEST (M15-H4, A arrival, stop >= %.2f ATR, BE at 2R)\n", InpBestStopATR);
   else if(IsZ3()) t = StringSubstr(t, 0, StringLen(t) - 1) + StringFormat(" | ZONES 3R (all zones, 1:%.1f, BE at 1R)\n", InpZ3RR);
   else t = StringSubstr(t, 0, StringLen(t) - 1) + " | CUSTOM\n";
   if(!IsTradeAllowed() || !TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) t += "! AutoTrading is OFF\n";
   string blocked = BlockedNow(ArraySize(syms) > 0 ? syms[0] : _Symbol);
   int pend = 0, open = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--) if(OrderSelect(i, SELECT_BY_POS) && OurMagic(OrderMagicNumber())) { if(OrderType() <= OP_SELL) open++; else pend++; }
   if(InpUseMyLines) t += (myTrend == 0 ? "Bias: no trendline of yours on this chart" : "Bias " + (myTrend > 0 ? "UP" : "DOWN") + ": " + myTrendWhy) + "\n";
   t += (blocked == "" ? "Trading" : "Paused: " + blocked) + StringFormat("  |  %d pending, %d open\n", pend, open);
   if(Viz()) t += VizPanelText();
   int order[]; ArrayResize(order, ArraySize(cKey)); for(int i = 0; i < ArraySize(cKey); i++) order[i] = i;
   for(int i = 0; i < ArraySize(order); i++) for(int j = i + 1; j < ArraySize(order); j++) if(cVal[order[j]] > cVal[order[i]]) { int x = order[i]; order[i] = order[j]; order[j] = x; }
   int shown = 0;
   for(int i = 0; i < ArraySize(order) && shown < 3; i++)
     {
      string key = cKey[order[i]];
      if(key == "ORDER" || key == "PROPOSE" || key == "ALERT") continue;
      t += (shown == 0 ? "Top skips: " : "") + StringFormat("%s (%d)", key, cVal[order[i]]) + (shown < 2 ? ", " : "") ; shown++;
     }
   if(t == lastStatus) return;                                         // nothing changed: no redraw
   lastStatus = t;
   string ls[]; int n = StringSplit(t, '\n', ls);
   for(int i = n; i < 16; i++) ObjectDelete(0, "RFXS_" + IntegerToString(i));
   for(int i = 0; i < n; i++) if(ls[i] != "") RightLabel(0, "RFXS_" + IntegerToString(i), ls[i], 20 + i * 15, i == 0 ? clrRoyalBlue : (StringFind(ls[i], "!") == 0 ? clrCrimson : clrDimGray), i == 0 ? 9 : 8);
  }

// Nothing the bot draws can be selected or dragged by a stray click - except the panel BUTTONS (RFXB_), which must stay clickable.
void NoSelect(long ch, string pre)
  {
   for(int o = ObjectsTotal(ch, -1, -1) - 1; o >= 0; o--)
     {
      string nm = ObjectName(ch, o);
      if(StringFind(nm, pre) != 0 || StringFind(nm, "RFXB_") == 0) continue;
      ObjectSetInteger(ch, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(ch, nm, OBJPROP_SELECTED, false);
     }
  }

// One line of text anchored to the chart's top-right corner.
void RightLabel(long ch, string nm, string text, int y, color c, int size)
  {
   if(ObjectFind(ch, nm) < 0) ObjectCreate(ch, nm, OBJ_LABEL, 0, 0, 0);
   ObjectSetInteger(ch, nm, OBJPROP_CORNER, CORNER_RIGHT_UPPER);
   ObjectSetInteger(ch, nm, OBJPROP_ANCHOR, ANCHOR_RIGHT_UPPER);
   ObjectSetInteger(ch, nm, OBJPROP_XDISTANCE, 12);
   ObjectSetInteger(ch, nm, OBJPROP_YDISTANCE, y);
   ObjectSetString(ch, nm, OBJPROP_TEXT, text);
   ObjectSetString(ch, nm, OBJPROP_FONT, "Arial");
   ObjectSetInteger(ch, nm, OBJPROP_FONTSIZE, size);
   ObjectSetInteger(ch, nm, OBJPROP_COLOR, c);
   ObjectSetInteger(ch, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(ch, nm, OBJPROP_SELECTED, false);
  }

int qPos = 0;   // round-robin position over symbol x timeframe
datetime lastSymBuild = 0;
void Work()
  {
   // after an MT4 restart the symbol list can be empty until the terminal connects: rebuild it
   if((ArraySize(syms) == 0 || TimeLocal() - lastSymBuild > 900) && IsConnected())
     {
      int before = ArraySize(syms);
      BuildSymbols(); lastSymBuild = TimeLocal();
      if(ArraySize(syms) != before) { ArrayResize(lastBar, ArraySize(syms)); for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < NTF; k++) lastBar[i][k] = 0; Print("ZoneBot watching ", ArraySize(syms), " symbols"); }
     }
   if(ArrayRange(lastBar, 0) != ArraySize(syms)) { ArrayResize(lastBar, ArraySize(syms)); for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < NTF; k++) lastBar[i][k] = 0; }
   if(TimeCurrent() - lastNewsLoad > 3600) LoadNews();
   if(InpUseMyLines && TimeLocal() - lastMine >= 5) { lastMine = TimeLocal(); myTrend = MyTrendlines(); MyZones(); }
   ProtectUpdate();
   ManageOrders();
   VizSync();
   CheckWatches();
   int total = ArraySize(syms) * NTF, done = 0;
   uint w0 = GetTickCount();
   bool warm = TimeLocal() - startedAt < 20;                         // first 20 s: 1 scan per tick while MT4 loads history
   for(int step = 0; step < total && done < (warm ? 1 : EffScansPerTick()) && GetTickCount() - w0 < 400; step++)
     {
      int idx = (qPos + step) % total, i = idx / NTF, k = idx % NTF;
      if(!TfOn(k)) continue;
      datetime t = iTime(syms[i], TF_E[k], 0);
      if(t == 0 || t == lastBar[i][k]) continue;
      lastBar[i][k] = t;
      Scan(syms[i], k); scans++; done++; lastScanAt = TimeCurrent();
      qPos = (idx + 1) % total;
     }
   if(!IsTesting()) UpdateSims();
   FlushSignals(false);
   if(gMode == MODE_APPROVE)
     {
      for(int o = ObjectsTotal(0, -1, -1) - 1; o >= 0; o--)
        {
         string nm = ObjectName(0, o);
         if(StringFind(nm, "RFXB_") == 0 && ObjectGetInteger(0, nm, OBJPROP_STATE)) { HandleClick(nm); break; }
        }
      DrawProposals();
     }
   Status();
  }

// a timeframe trades only if its toggle is on AND the preset allows it (Kevin best: M15, H1, H4)
bool TfOn(int k)
  {
   if(!TfToggle(k)) return false;
   if(IsProt()) return k >= 2 && k <= 4;
   return true;
  }
bool TfToggle(int k)
  {
   if(k == 0) return InpTF_M1;
   if(k == 1) return InpTF_M5;
   if(k == 2) return InpTF_M15;
   if(k == 3) return InpTF_H1;
   if(k == 4) return InpTF_H4;
   if(k == 5) return InpTF_D1;
   return InpTF_W1;
  }

// Effective settings: InpAggressive widens WHAT may be traded (timeframes, entry types, grades, caps),
// never the legitimacy rules (chain, gap, size, freshness, trend / trendline bias, overextension, R:R, stops, news).
// InpPreset: Custom = exactly the inputs; Aggressive = the old InpAggressive (InpAggressive = true still forces it);
// Kevin best = only the best setups (see IsBest() checks in Scan, ManageOrders and ManageOpen).
BotPreset EffPreset()      { if(InpAggressive) return PRESET_AGGRESSIVE; return InpPreset; }
bool      IsAggr()          { return EffPreset() == PRESET_AGGRESSIVE; }
bool      IsBest()          { return EffPreset() == PRESET_KEVIN_BEST; }
bool      IsZ3()            { return EffPreset() == PRESET_ZONES_3R; }   // every drawn zone, fixed 1:3, BE at 1R
bool      IsProt()          { return IsBest() || IsZ3(); }              // capital protection, one order per zone, no pending churn
string    PresetName()      { if(IsAggr()) return "AGGRESSIVE"; if(IsBest()) return "KEVIN BEST"; if(IsZ3()) return "ZONES 3R"; return "CUSTOM"; }
EntryMode EffEntry()       { return IsAggr() ? ENTRY_BOTH : InpEntry; }
int       EffMaxPerSymbol() { return IsAggr() ? MathMax(InpMaxPerSymbol, NTF) : InpMaxPerSymbol; }
int       EffMaxOrders()    { return IsAggr() ? MathMax(InpMaxOrders, 60) : InpMaxOrders; }
bool      EffTradeVP()      { return IsAggr() || InpTradeVP; }
int       EffScansPerTick() { return IsAggr() ? MathMax(InpScansPerTick, NTF) : InpScansPerTick; }
bool      EffBlockOverext() { return IsBest() || (!IsZ3() && InpBlockOverext); }
// management: Kevin best = nothing until +2R, then break-even (spread + commission); no half risk, no trailing, no partial
bool      EffManageOn()     { return IsProt() || InpManage != MG_OFF; }
bool      EffHalfRisk1R()   { return !IsProt() && InpManage == MG_MENTOR && InpHalfRiskAt1R; }
bool      EffTrailZones()   { return !IsProt() && InpManage == MG_MENTOR && InpTrailZones; }
bool      EffPartial3R()    { return !IsProt() && InpManage == MG_MENTOR && InpPartialAt3R; }
double    EffBeTrig()       { if(IsZ3()) return 1.0; if(IsBest()) return 2.0; if(InpLiveBE == BE_AT_1R) return 1.0; if(InpLiveBE == BE_AT_2R) return 2.0; return 99; }

// order counters for the backtest report
int gPlaced = 0, gCancelled = 0, gModified = 0;
// Kevin best: placements per zone (a zone is armed at most twice), and the last bar a pending was modified
string zpSym[]; int zpDir[]; double zpLo[]; double zpHi[]; int zpN[];
int modTicket[]; datetime modBar[];
// chart drawings (live with InpDraw, tester only in visual mode)
string vzSkip[]; int vzArrT[]; string vzOrdSig = "";
string gVizTrend = ""; string vzR[]; int vzC[];                        // chart TF: HTF bias explanation + skip tally of the last scan
string DirTxt(int d) { return d > 0 ? "UP" : (d < 0 ? "DOWN" : "unclear"); }
void VizTally(string r)
  {
   int p = StringFind(r, " ("); if(p > 0) r = StringSubstr(r, 0, p);
   if(StringFind(r, "best: ") == 0) r = StringSubstr(r, 6);
   for(int i = 0; i < ArraySize(vzR); i++) if(vzR[i] == r) { vzC[i]++; return; }
   int n = ArraySize(vzR); ArrayResize(vzR, n + 1); ArrayResize(vzC, n + 1); vzR[n] = r; vzC[n] = 1;
  }
// Kevin best capital protection state (UTC day / week start balances, stops, equity peak, report counters)
datetime gPDay = 0, gPWeek = 0; double gPDayBal = 0, gPWeekBal = 0; bool gPDayStop = false, gPWeekStop = false, gStreakStop = false;
double gEqPeak = 0, gMaxOpenRisk = 0; bool gDDHalf = false;
int gDaysDaily = 0, gDaysWeekly = 0, gDaysStreak = 0; datetime gLastDailyDay = 0, gLastWeeklyDay = 0, gLastStreakDay = 0;
int gStreakHist = -1, gStreakN = 0; datetime gStreakLast = 0;

//+------------------------------------------------------------------+
//| Symbols                                                          |
//+------------------------------------------------------------------+
bool ChartOnly() { return StringLen(InpSymbols) == 0; }
// per-pair files when one bot runs per chart, so instances never overwrite each other
string PairFile(string base, string ext) { return ChartOnly() ? base + "_" + _Symbol + ext : base + ext; }
void BuildSymbols()
  {
   ArrayResize(syms, 0);
   if(IsTesting() || ChartOnly()) { AddSym(_Symbol); return; }
   if(StringLen(InpSymbols) > 0 && InpSymbols != "ALL")
     {
      string parts[];
      int n = StringSplit(InpSymbols, ',', parts);
      for(int i = 0; i < n; i++)
        {
         string s = parts[i];
         StringTrimLeft(s); StringTrimRight(s);
         if(s != "") { SymbolSelect(s + InpSuffix, true); AddSym(s + InpSuffix); }
        }
      return;
     }
   for(int i = 0; i < SymbolsTotal(true); i++)
     {
      string s = SymbolName(i, true);
      if((int)MarketInfo(s, MODE_PROFITCALCMODE) == 0) AddSym(s); // 0 = Forex
     }
  }
void AddSym(string s) { int n = ArraySize(syms); ArrayResize(syms, n + 1); syms[n] = s; }
int SymIdx(string s) { for(int i = 0; i < ArraySize(syms); i++) if(syms[i] == s) return i; return -1; }

//+------------------------------------------------------------------+
//| Candle helpers                                                   |
//+------------------------------------------------------------------+
double Rng(string s, int tf, int i)  { return iHigh(s, tf, i) - iLow(s, tf, i); }
double Body(string s, int tf, int i) { return MathAbs(iClose(s, tf, i) - iOpen(s, tf, i)); }
bool   Basing(string s, int tf, int i) { double r = Rng(s, tf, i); return r > 0 && Body(s, tf, i) / r < 0.5; }   // "50% candle"
int    CDir(string s, int tf, int i) { return iClose(s, tf, i) > iOpen(s, tf, i) ? 1 : (iClose(s, tf, i) < iOpen(s, tf, i) ? -1 : 0); }

//+------------------------------------------------------------------+
//| Zone detection (mentor's 4 parts)                                |
//+------------------------------------------------------------------+
//+------------------------------------------------------------------+
//| Liquidity (lesson 16): retail traders trade support/resistance   |
//| ("old resistance becomes new support") and put stops just beyond |
//| the obvious level. The mentor prefers a zone sitting just BEYOND |
//| that obvious level, so price runs those stops first -> trap,      |
//| better odds (purple). A zone sitting ON the obvious level is a   |
//| retail trade -> crowded, lower odds.                              |
//| Obvious level = a clear swing low/high (InpTrapSwing bars each   |
//| side). In front = between price and the proximal line, within    |
//| InpTrapATR x ATR. Stops still resting = not swept since.         |
//+------------------------------------------------------------------+
bool SwingAt(string s, int tf, int i, int dir)        // dir +1 swing low, -1 swing high
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
double FindTrap(string s, int tf, int dir, double prox, double dist, int fromBar, int baseEnd, int &trapBar, bool &crowded)
  {
   trapBar = -1; crowded = false;
   double atr = iATR(s, tf, 14, 1), best = 0;
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

//+------------------------------------------------------------------+
//| Kevin's trendlines (same rules as ZoneVision)                    |
//|  two most recent real valleys (higher low) / peaks (lower high), |
//|  anchored without cutting candles, removed by a full candle      |
//|  beyond the line; channel 50% from the newest confirmed line.    |
//+------------------------------------------------------------------+
struct KLine { int dir; int a, b; double pb, sl; bool removed, conf, ov; datetime tRem; };
KLine gKE[], gKH[];                                                     // entry-TF and HTF lines of the symbol being scanned
int pzB[]; double pzP[]; int pzT[];
void PzAdd(int b, double p, int t) { int n = ArraySize(pzB); ArrayResize(pzB, n + 1); ArrayResize(pzP, n + 1); ArrayResize(pzT, n + 1); pzB[n] = b; pzP[n] = p; pzT[n] = t; }
bool ZFrL(string s, int tf, int i) { double v = iLow(s, tf, i);  for(int k = 1; k <= InpTLSwing; k++) if(i - k < 1 || v > iLow(s, tf, i + k) || v >= iLow(s, tf, i - k)) return false; return true; }
bool ZFrH(string s, int tf, int i) { double v = iHigh(s, tf, i); for(int k = 1; k <= InpTLSwing; k++) if(i - k < 1 || v < iHigh(s, tf, i + k) || v <= iHigh(s, tf, i - k)) return false; return true; }
void Zz(string s, int tf, int bars)                                     // real valley: higher high follows before it breaks; real peak: lower low follows
  {
   ArrayResize(pzB, 0); ArrayResize(pzP, 0); ArrayResize(pzT, 0);
   int fH = -1, fL = -1;
   for(int i = bars; i > InpTLSwing; i--)
     {
      bool lo = ZFrL(s, tf, i), hi = ZFrH(s, tf, i);
      if(lo && fH > 0) { double v = iLow(s, tf, i), pk = iHigh(s, tf, fH); for(int j = i - 1; j >= 1; j--) { if(iLow(s, tf, j) < v) break; if(iHigh(s, tf, j) > pk) { PzAdd(i, v, -1); break; } } }
      if(hi && fL > 0) { double v = iHigh(s, tf, i), vl = iLow(s, tf, fL); for(int j = i - 1; j >= 1; j--) { if(iHigh(s, tf, j) > v) break; if(iLow(s, tf, j) < vl) { PzAdd(i, v, 1); break; } } }
      if(lo) fL = i;
      if(hi) fH = i;
     }
  }
double KAt(KLine &k, int j) { return k.pb + k.sl * (k.b - j); }
int KFit(string s, int tf, int A, int b2, double p2, int d, double &sl)       // move the anchor when the line cuts a candle (Kevin)
  {
   int a = A; double tol = 0.05 * iATR(s, tf, 14, 1);          // Kevin: never cut a candle
   for(int it = 0; it < 50; it++)
     {
      sl = (p2 - (d > 0 ? iLow(s, tf, a) : iHigh(s, tf, a))) / (a - b2);
      int worst = -1; double ex = tol;
      for(int j = a - 1; j > b2; j--) { double lv = p2 + sl * (b2 - j), e = d > 0 ? lv - iLow(s, tf, j) : iHigh(s, tf, j) - lv; if(e > ex) { ex = e; worst = j; } }
      if(worst < 0) return a;
      a = worst;
     }
   sl = (p2 - (d > 0 ? iLow(s, tf, a) : iHigh(s, tf, a))) / (a - b2);
   return a;
  }
// Kevin: a near-horizontal line is momentum, not a trendline: needs >= 0.015 ATR per bar and >= 1.5 ATR in total
bool KFlat(string s, int tf, int a, int b2, double p2, double sl, int d)
  {
   double atr = MathMax(iATR(s, tf, 14, b2), MarketInfo(s, MODE_POINT));
   return MathAbs(sl) < 0.015 * atr || MathAbs(sl * (a - b2)) < 1.5 * atr;
  }
// confirmed only when price makes a new high above everything between the two valleys (new low below everything
// between the two peaks) before a full candle breaks the line
bool KConf(string s, int tf, int a, int b2, double p2, double sl, int d)
  {
   double ext = d > 0 ? -DBL_MAX : DBL_MAX;
   for(int j = a - 1; j > b2; j--) ext = d > 0 ? MathMax(ext, iHigh(s, tf, j)) : MathMin(ext, iLow(s, tf, j));
   if(ext == DBL_MAX || ext == -DBL_MAX) return false;
   for(int j = b2 - 1; j >= 1; j--)
     {
      double lv = p2 + sl * (b2 - j);
      if((d > 0 && iHigh(s, tf, j) < lv) || (d < 0 && iLow(s, tf, j) > lv)) return false;
      if((d > 0 && iHigh(s, tf, j) > ext) || (d < 0 && iLow(s, tf, j) < ext)) return true;
     }
   return false;
  }
void KAdd(string s, int tf, KLine &out[], int d, int a, int b2, double p2, double sl, bool ov)
  {
   KLine t; t.dir = d; t.a = a; t.b = b2; t.pb = p2; t.sl = sl; t.removed = false; t.conf = true; t.ov = ov; t.tRem = 0;
   for(int j = b2 - 1; j >= 1; j--) { double lv = KAt(t, j); if((d > 0 && iHigh(s, tf, j) < lv) || (d < 0 && iLow(s, tf, j) > lv)) { t.removed = true; t.tRem = iTime(s, tf, j); break; } }
   int n = ArraySize(out); ArrayResize(out, n + 1); out[n] = t;
  }
// same lines as ZoneVision: newest real valley (peak) back to the previous one, or to the lowest (highest) point if that
// is too flat; plus the overall line from the very bottom (top) of the window
int KLines(string s, int tf, KLine &out[])
  {
   ArrayResize(out, 0);
   int bars = MathMin(InpLookback, iBars(s, tf) - 20);                  // same window as ZoneVision (InpLookback)
   if(bars < 30) return 0;
   Zz(s, tf, bars);
   for(int d = -1; d <= 1; d += 2)
     {
      int want = d > 0 ? -1 : 1, prevB = -1, lastA = -1; double prevP = 0, sl = 0;
      for(int k = 0; k < ArraySize(pzB); k++)
        {
         if(pzT[k] != want) continue;
         int b2 = pzB[k], a = -1, pb = prevB; double p2 = pzP[k], pp = prevP;
         prevB = b2; prevP = p2;
         // top / bottom of the move first (the anchor moves to any peak it would cut = the two recent peaks),
         // then the previous real one, then the line's original start; near-flat lines are dropped
         int A = d > 0 ? iLowest(s, tf, MODE_LOW, bars - b2, b2 + 1) : iHighest(s, tf, MODE_HIGH, bars - b2, b2 + 1);
         if(A > b2 && (d > 0 ? iLow(s, tf, A) < p2 : iHigh(s, tf, A) > p2)) { a = KFit(s, tf, A, b2, p2, d, sl); if(KFlat(s, tf, a, b2, p2, sl, d)) a = -1; }
         if(a < 0 && pb > 0 && (d > 0 ? pp < p2 : pp > p2)) { a = KFit(s, tf, pb, b2, p2, d, sl); if(KFlat(s, tf, a, b2, p2, sl, d)) a = -1; }
         if(a < 0 && lastA > b2 && (d > 0 ? iLow(s, tf, lastA) < p2 : iHigh(s, tf, lastA) > p2)) { a = KFit(s, tf, lastA, b2, p2, d, sl); if(KFlat(s, tf, a, b2, p2, sl, d)) a = -1; }
         if(a < 0) continue;
         if(!KConf(s, tf, a, b2, p2, sl, d)) continue;                    // no new high / low beyond the swing between the pivots yet
         int n = ArraySize(out);
         if(n > 0 && out[n - 1].dir == d && out[n - 1].a == a) ArrayResize(out, n - 1);   // same anchor = the same line, updated
         KAdd(s, tf, out, d, a, b2, p2, sl, false);
         lastA = a;
        }
      int O = d > 0 ? iLowest(s, tf, MODE_LOW, bars, 1) : iHighest(s, tf, MODE_HIGH, bars, 1);
      if(O < 0) continue;
      double ov = d > 0 ? iLow(s, tf, O) : iHigh(s, tf, O), bs = 0; int bk = -1;
      for(int k = 0; k < ArraySize(pzB); k++)
        {
         if(pzT[k] != want || pzB[k] >= O - 1) continue;
         double s0 = (pzP[k] - ov) / (O - pzB[k]);
         if((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) continue;
         if(bk < 0 || (d > 0 ? s0 < bs : s0 > bs)) { bk = k; bs = s0; }
        }
      if(bk >= 0)
        {
         int a = KFit(s, tf, O, pzB[bk], pzP[bk], d, sl);
         bool dup = false;                                                // ZoneVision: an overall line on a pivot already used is the same line
         for(int t = 0; t < ArraySize(out); t++) if(out[t].dir == d && (out[t].a == a || out[t].b == pzB[bk])) dup = true;
         if(!dup && !KFlat(s, tf, a, pzB[bk], pzP[bk], sl, d) && KConf(s, tf, a, pzB[bk], pzP[bk], sl, d))
           {
            KAdd(s, tf, out, d, a, pzB[bk], pzP[bk], sl, true);
            if(out[ArraySize(out) - 1].removed) ArrayResize(out, ArraySize(out) - 1);   // a broken overall line is dropped (ZoneVision)
           }
        }
     }
   return ArraySize(out);
  }
// the line the bot uses in a direction, as ZoneVision: the NEWEST line (latest touch pivot) if still respected,
// else the respected overall line (-1 = none). An older respected line never stands in for a broken newest one.
int KUse(KLine &L[], int dir)
  {
   int newest = -1, use = -1;
   for(int i = 0; i < ArraySize(L); i++) if(L[i].dir == dir && !L[i].ov && (newest < 0 || L[i].b < L[newest].b)) newest = i;
   if(newest >= 0 && !L[newest].removed) return newest;
   for(int i = 0; i < ArraySize(L); i++) if(L[i].dir == dir && L[i].ov && !L[i].removed) use = i;
   return use;
  }
// the newest broken HTF line decides the bias: a downtrend line broken = bullish, an uptrend line broken = bearish
int KBias(KLine &L[])
  {
   int best = -1;
   for(int i = 0; i < ArraySize(L); i++) if(L[i].removed && (best < 0 || L[i].tRem > L[best].tRem)) best = i;
   return best < 0 ? 0 : -L[best].dir;
  }
// +1: price reaches the zone without crossing a respected trendline (the line sits beyond it);
// -1: a respected line lies between price and the zone; 0: no line
int KCross(string s, int dir, double prox)
  {
   double px = (MarketInfo(s, MODE_BID) + MarketInfo(s, MODE_ASK)) / 2; int res = 0;   // mid price, as ZoneVision
   for(int q = 0; q < 2; q++)
     {
      int i = q == 0 ? KUse(gKE, dir > 0 ? 1 : -1) : KUse(gKH, dir > 0 ? 1 : -1);
      if(i < 0) continue;
      double v = q == 0 ? KAt(gKE[i], 0) : KAt(gKH[i], 0);
      if(dir < 0) { if(v > px && v < prox) return -1; if(v >= prox) res = 1; }
      else        { if(v < px && v > prox) return -1; if(v <= prox) res = 1; }
     }
   return res;
  }
// zone within 1 entry-TF ATR of a respected trendline in its direction: "" or the timeframe name
string KNear(string s, int etf, int htf, int dir, double price)
  {
   double atr = iATR(s, etf, 14, 1);
   int i = KUse(gKE, dir); if(i >= 0 && MathAbs(price - KAt(gKE[i], 0)) <= atr) return TfName(etf);
   i = KUse(gKH, dir);     if(i >= 0 && MathAbs(price - KAt(gKH[i], 0)) <= atr) return TfName(htf);
   return "";
  }
// draw the lines on this chart: newest respected (thick) + overall (thin), entry TF grey, HTF gold
void DrawKLines(string s, int tf, KLine &L[], string tag, color c)
  {
   ObjectsDeleteAll(0, "RFXT_" + tag);
   for(int d = -1; d <= 1; d += 2)
     {
      int n = KUse(L, d), o = -1;                                       // the line the checks use + the respected overall line
      if(n >= 0 && L[n].ov) n = -1;
      for(int i = ArraySize(L) - 1; i >= 0; i--) if(L[i].dir == d && L[i].ov && !L[i].removed) { o = i; break; }
      for(int q = 0; q < 2; q++)
        {
         int i = q == 0 ? n : o;
         if(i < 0 || (q == 1 && n >= 0 && L[n].a == L[o].a && L[n].b == L[o].b)) continue;
         string nm = "RFXT_" + tag + (d > 0 ? "u" : "d") + IntegerToString(q);
         datetime t2 = iTime(s, tf, 0) + PeriodSeconds(tf) * 3;
         double p2 = L[i].pb + L[i].sl * (L[i].b + 3);
         ObjectCreate(0, nm, OBJ_TREND, 0, iTime(s, tf, L[i].a), KAt(L[i], L[i].a), t2, p2);
         ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
         ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1); ObjectSetInteger(0, nm, OBJPROP_STYLE, StringFind(tag, "H") == 0 ? STYLE_DOT : STYLE_SOLID); { int vm = 0; int pp[9] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_M30, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1}; int ff[9] = {OBJ_PERIOD_M1, OBJ_PERIOD_M5, OBJ_PERIOD_M15, OBJ_PERIOD_M30, OBJ_PERIOD_H1, OBJ_PERIOD_H4, OBJ_PERIOD_D1, OBJ_PERIOD_W1, OBJ_PERIOD_MN1}; for(int v = 0; v < 9; v++) if(pp[v] <= tf) vm |= ff[v]; ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, vm); } ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, nm, OBJPROP_BACK, true);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, TfName(tf) + (q == 1 ? " overall " : " ") + (d > 0 ? "uptrend line: lowest point to a real valley (a higher high followed)" : "downtrend line: highest point to a real peak (a lower low followed)") + " - respected so far");
        }
     }
   NoSelect(0, "RFXT_" + tag);
  }

// newest line in the trade direction: is the price beyond the channel 50%? (0 = no line / not confirmed / removed)
int ChannelState(string s, int tf, KLine &L[], int dir, double price)
  {
   int use = KUse(L, dir);
   for(int i = use; i >= 0 && i == use; i--)
     {
      double w = 0;
      for(int j = L[i].a; j >= 1; j--) w = MathMax(w, dir > 0 ? iHigh(s, tf, j) - KAt(L[i], j) : KAt(L[i], j) - iLow(s, tf, j));
      double mid = KAt(L[i], 0) + dir * w / 2;
      return (dir > 0 ? price > mid : price < mid) ? 2 : 1;            // 2 = overextended, 1 = golden area
     }
   return 0;
  }

int DetectZones(string s, int tf, Zone &out[])
  {
   ArrayResize(out, 0);
   int bars = MathMin(InpLookback, iBars(s, tf) - InpMaxBase - 3);
   for(int L = bars; L >= 2; L--)
     {
      double lr = Rng(s, tf, L);
      if(lr <= 0 || Basing(s, tf, L)) continue;                 // move-away candle must not be basing
      int dir = CDir(s, tf, L);
      if(dir == 0) continue;
      // basing candles directly before the move away
      int k = 0; double maxBase = 0;
      while(k < InpMaxBase && Basing(s, tf, L + 1 + k)) { maxBase = MathMax(maxBase, Rng(s, tf, L + 1 + k)); k++; }
      if(k == 0 || maxBase <= 0) continue;
      double ratio = lr / maxBase;
      if(ratio < InpMinLegRatio) continue;
      // leg-in direction (continuation if same as leg-out)
      int legIn = CDir(s, tf, L + 1 + k);
      bool cont = (legIn == dir);
      // proximal / distal
      double prox, dist;
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
      double atr = iATR(s, tf, 14, L);
      if(h <= 0 || (atr > 0 && h > InpMaxZoneATR * atr)) continue;          // similar-size rule
      // stay-away candle: the candle after the move away must leave space to the proximal line
      int sa = L - 1;
      if(dir > 0 && iLow(s, tf, sa) <= prox) continue;
      if(dir < 0 && iHigh(s, tf, sa) >= prox) continue;

      // departure: how far price travelled from the proximal line before coming back (up to 10 bars)
      double far = dir > 0 ? iHigh(s, tf, L) : iLow(s, tf, L);
      for(int j = L - 1; j >= MathMax(1, L - 10); j--)
        {
         if((dir > 0 && iLow(s, tf, j) <= prox) || (dir < 0 && iHigh(s, tf, j) >= prox)) break;
         far = dir > 0 ? MathMax(far, iHigh(s, tf, j)) : MathMin(far, iLow(s, tf, j));
        }
      double departure = MathAbs(far - prox) / h;
      if(departure < InpMinDeparture) continue;
      // Kevin: the stay-away candle must leave space to the proximal line; the bigger, the stronger
      double gap = dir > 0 ? (iLow(s, tf, sa) - prox) / h : (prox - iHigh(s, tf, sa)) / h;
      // Kevin's third chain trigger: the move away made a new all-time high (low) of the loaded history
      int older = MathMin(iBars(s, tf) - 1, L + 2000) - L;
      double ext = dir > 0 ? MathMax(iHigh(s, tf, L), iHigh(s, tf, sa)) : MathMin(iLow(s, tf, L), iLow(s, tf, sa));
      bool ath = false;
      if(older > 5)
        {
         int ix = dir > 0 ? iHighest(s, tf, MODE_HIGH, older, L + 1) : iLowest(s, tf, MODE_LOW, older, L + 1);
         ath = ix >= 0 && (dir > 0 ? ext > iHigh(s, tf, ix) : ext < iLow(s, tf, ix));
        }
      // preferred: a second explosive candle straight after the first (no re-basing)
      bool leg2 = sa >= 1 && !Basing(s, tf, sa) && CDir(s, tf, sa) == dir && Rng(s, tf, sa) >= maxBase * InpMinLegRatio;
      // extended-range move-away candle: big body (>= 60%) closing near its extreme (top/bottom 20%)
      double lo = iLow(s, tf, L), lh = iHigh(s, tf, L), cl = iClose(s, tf, L);
      bool erc = Body(s, tf, L) / lr >= 0.6 && (dir > 0 ? (cl - lo) / lr >= 0.8 : (lh - cl) / lr >= 0.8);

      Zone z;
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.tLeg = iTime(s, tf, L);
      z.baseN = k; z.legRatio = ratio; z.cont = cont; z.departure = departure; z.erc = erc;
      z.grade = (ratio >= 2.5 && k <= 3 && erc && departure >= 2) ? "A" : ((ratio >= 1.8 && departure >= 1.5) ? "B" : "C");
      z.gap = gap; z.ath = ath; z.leg2 = leg2;
      z.tested = false; z.removed = false; z.pen = 0; z.consumed = false; z.tRemoved = 0; z.tTouched = 0; z.trap = 0; z.trapBar = -1; z.crowded = false;
      for(int j = sa - 1; j >= 1; j--)                                       // status since the stay-away
        {
         if(dir > 0)
           {
            if(iClose(s, tf, j) < dist) { z.removed = true; z.tRemoved = iTime(s, tf, j); break; }
            if(iLow(s, tf, j) <= prox)
              {
               if(!z.tested) { z.tested = true; z.tTouched = iTime(s, tf, j); }
               z.pen = MathMax(z.pen, (prox - iLow(s, tf, j)) / h);
               if(iClose(s, tf, j) < prox || iLow(s, tf, j) < dist || z.pen >= 0.5) z.consumed = true;
              }
           }
         else
           {
            if(iClose(s, tf, j) > dist) { z.removed = true; z.tRemoved = iTime(s, tf, j); break; }
            if(iHigh(s, tf, j) >= prox)
              {
               if(!z.tested) { z.tested = true; z.tTouched = iTime(s, tf, j); }
               z.pen = MathMax(z.pen, (iHigh(s, tf, j) - prox) / h);
               if(iClose(s, tf, j) > prox || iHigh(s, tf, j) > dist || z.pen >= 0.5) z.consumed = true;
              }
           }
        }
      // liquidity trap is worked out later, only for the zone the bot is about to act on (speed)
      int n = ArraySize(out); ArrayResize(out, n + 1); out[n] = z;
     }
   return ArraySize(out);
  }

//+------------------------------------------------------------------+
//| HTF trend from fractal swings: HH+HL = up, LH+LL = down          |
//+------------------------------------------------------------------+
int HtfTrend(string s, int htf)
  {
   double hi[2] = {0, 0}, lo[2] = {0, 0}; int nh = 0, nl = 0;
   for(int i = 3; i < 300 && (nh < 2 || nl < 2); i++)
     {
      double u = iFractals(s, htf, MODE_UPPER, i), d = iFractals(s, htf, MODE_LOWER, i);
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

// Position of price in the HTF curve (0 = bottom, 100 = top of the last 100 HTF bars).
double Curve(string s, int htf, double p)
  {
   int hiI = iHighest(s, htf, MODE_HIGH, 100, 1), loI = iLowest(s, htf, MODE_LOW, 100, 1);
   if(hiI < 0 || loI < 0) return 50;
   double hi = iHigh(s, htf, hiI), lo = iLow(s, htf, loI);
   return hi > lo ? 100.0 * (p - lo) / (hi - lo) : 50;
  }

// Planner score 0-100, same points as the app's Planner (evaluatePlan): move away, base, qualified,
// fresh/age, HTF trend, at HTF zone, no opposing HTF zone near, curve, trap, ETF trend, confirmation.
// A >= 75, B >= 60, else C (low odds).

// ---- your drawings: trendlines give the bias, rectangles are zones you want advised ----
bool MineObj(string nm) { return StringFind(nm, "RFX") != 0; }       // not drawn by the bot or ZoneVision
int MyTrendlines()
  {
   double bid = MarketInfo(_Symbol, MODE_BID), best = DBL_MAX; int v = 0;
   for(int i = ObjectsTotal(0, -1, -1) - 1; i >= 0; i--)
     {
      string nm = ObjectName(0, i);
      if(!MineObj(nm) || ObjectType(nm) != OBJ_TREND) continue;
      datetime t1 = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME1), t2 = (datetime)ObjectGetInteger(0, nm, OBJPROP_TIME2);
      double p1 = ObjectGetDouble(0, nm, OBJPROP_PRICE1), p2 = ObjectGetDouble(0, nm, OBJPROP_PRICE2);
      if(t1 == t2) continue;
      if(t1 > t2) { datetime tt = t1; t1 = t2; t2 = tt; double pp = p1; p1 = p2; p2 = pp; }
      double at = p1 + (p2 - p1) * (double)(TimeCurrent() - t1) / (double)(t2 - t1);   // line value now
      if(at <= 0) continue;
      double d = MathAbs(bid - at);
      if(d >= best) continue;
      best = d;
      bool up = p2 > p1, above = bid > at;
      // rising line held = up; falling line broken upward = up; mirror for down
      v = (up && above) || (!up && above) ? 1 : -1;
      myTrendWhy = StringFormat("your %s trendline %s", up ? "rising" : "falling", above ? (up ? "holding" : "broken up") : (up ? "broken down" : "holding"));
     }
   return v;
  }
void MyZones()
  {
   if(!InpUseMyLines || gMode == MODE_SCANNER) return;
   double point = MarketInfo(_Symbol, MODE_POINT); int digits = (int)MarketInfo(_Symbol, MODE_DIGITS);
   double pip = point * ((digits == 3 || digits == 5) ? 10 : 1);
   double bid = MarketInfo(_Symbol, MODE_BID), ask = MarketInfo(_Symbol, MODE_ASK), spread = ask - bid;
   if(point <= 0 || bid <= 0 || ask <= 0) return;
   string liveMy = "|";
   for(int i = ObjectsTotal(0, -1, -1) - 1; i >= 0; i--)
     {
      string nm = ObjectName(0, i);
      if(!MineObj(nm) || ObjectType(nm) != OBJ_RECTANGLE) continue;
      double p1 = ObjectGetDouble(0, nm, OBJPROP_PRICE1), p2 = ObjectGetDouble(0, nm, OBJPROP_PRICE2);
      datetime t0 = (datetime)MathMin(ObjectGetInteger(0, nm, OBJPROP_TIME1), ObjectGetInteger(0, nm, OBJPROP_TIME2));
      double top = MathMax(p1, p2), bot = MathMin(p1, p2), h = top - bot;
      if(h <= 0) continue;
      liveMy += DoubleToString(top, 6) + "|" + DoubleToString(bot, 6) + "|";
      int dir = bid > top ? 1 : (ask < bot ? -1 : 0);
      if(dir == 0 || (myTrend != 0 && dir != myTrend)) continue;          // price inside it, or against your trendline bias
      // timeframe = the smallest one whose candles fit a zone this tall
      int k = NTF - 1;
      for(int j = 0; j < NTF; j++) { double a = iATR(_Symbol, TF_E[j], 14, 1); if(a > 0 && h <= InpMaxZoneATR * a) { k = j; break; } }
      if(HasOrder(_Symbol, k)) continue;
      int tf = TF_E[k];
      double buf = TfStopPips(tf) * InpStopScale * pip;
      double entry = dir > 0 ? top + spread : bot, sl = dir > 0 ? bot - buf : top + buf + spread;
      int sh = iBarShift(_Symbol, tf, t0); if(sh < 2) continue;
      int ix = dir > 0 ? iHighest(_Symbol, tf, MODE_HIGH, sh, 1) : iLowest(_Symbol, tf, MODE_LOW, sh, 1);
      double tp = ix < 0 ? 0 : (dir > 0 ? iHigh(_Symbol, tf, ix) - spread : iLow(_Symbol, tf, ix) + spread);   // swing since your zone
      double risk = MathAbs(entry - sl), rr = (risk > 0 && tp > 0) ? dir * (tp - entry) / risk : 0;
      if(rr < 1.5) continue;
      int sc = 50 + (myTrend == dir ? 20 : 0) + (rr >= 3 ? 10 : 0);
      string g = PlanGrade(sc);
      string info = StringFormat("%s %s YOUR %s zone (grade %s %d) | %s\n", dir > 0 ? "BUY" : "SELL", TF_N[k], dir > 0 ? "demand" : "supply", g, sc, myTrend != 0 ? myTrendWhy : "no trendline bias");
      info += StringFormat("Why: you drew it; entry at the %s line, stop beyond it +%.1f pips, target the swing %s since the zone", dir > 0 ? "top" : "bottom", buf / pip, dir > 0 ? "high" : "low");
      int before = ArraySize(props);
      AddProposal(_Symbol, k, dir, NormalizeDouble(entry, digits), NormalizeDouble(sl, digits), NormalizeDouble(tp, digits), dir > 0 ? bot : top, "MY", g, rr, false, info, dir > 0 ? top : bot, t0);
      if(ArraySize(props) > before)
        {
         string tag = StringFormat("%s %s %s your zone 1:%.1f", _Symbol, TF_N[k], dir > 0 ? "BUY" : "SELL", rr);
         if(InpAlerts) Alert("RamanFX ZoneBot: ", tag);
         if(InpPush && !IsTesting()) SendNotification("RamanFX: " + tag + " - check and approve in MT4");
        }
     }
   bool ch = ExpireDismissed();
   for(int d = ArraySize(dSym) - 1; d >= 0; d--)                       // denied rectangle you have since deleted / moved
      if(dMy[d] && dSym[d] == _Symbol && StringFind(liveMy, "|" + dProx[d] + "|") < 0) { DropDismissed(d); ch = true; }
   if(ch) SaveProps();
  }
// Kevin's chain, exactly as ZoneVision's Qualify(): the move away (the leg candle and up to 5 bars after it)
// removed an older opposing zone or a trendline, made a new high / low of the lookback before the base,
// or took out the previous swing high (demand) / low (supply).
void ChainOf(string s, int etf, Zone &z[], int i, bool &oppZ, bool &tlB, bool &newHL, bool &rmHL)
  {
   oppZ = false; tlB = false; newHL = false; rmHL = false;
   int L = z[i].legBar, dir = z[i].dir;
   datetime t0 = iTime(s, etf, L), t1 = iTime(s, etf, MathMax(L - 5, 0));
   for(int j = 0; j < ArraySize(z) && !oppZ; j++) if(z[j].dir == -dir && z[j].removed && z[j].legBar > L && z[j].tRemoved >= t0 && z[j].tRemoved <= t1) oppZ = true;
   for(int j = 0; j < ArraySize(gKE) && !tlB; j++) if(gKE[j].dir == -dir && gKE[j].removed && gKE[j].tRem >= t0 && gKE[j].tRem <= t1) tlB = true;
   int older = L + z[i].baseN + 1, nb = iBars(s, etf);
   int span = MathMin(InpLookback, nb - older - 1);
   if(span <= 5) return;
   int nx = MathMax(L - 5, 1);
   double legX = dir > 0 ? iHigh(s, etf, iHighest(s, etf, MODE_HIGH, L - nx + 1, nx)) : iLow(s, etf, iLowest(s, etf, MODE_LOW, L - nx + 1, nx));
   if(dir > 0 && legX > iHigh(s, etf, iHighest(s, etf, MODE_HIGH, span, older))) newHL = true;
   if(dir < 0 && legX < iLow(s, etf, iLowest(s, etf, MODE_LOW, span, older))) newHL = true;
   for(int j = older; j < older + span && j < nb - InpTLSwing - 1; j++)
     {
      if(dir > 0 && ZFrH(s, etf, j)) { rmHL = legX > iHigh(s, etf, j); break; }
      if(dir < 0 && ZFrL(s, etf, j)) { rmHL = legX < iLow(s, etf, j); break; }
     }
  }
bool Qualified(string s, int etf, Zone &z[], int i)
  {
   bool oppZ, tlB, newHL, rmHL;
   ChainOf(s, etf, z, i, oppZ, tlB, newHL, rmHL);
   return oppZ || tlB || newHL || rmHL;
  }
// Arrival zone (strongest), as ZoneVision: the move away broke a trendline AND removed an opposing zone,
// the previous swing high / low, or made a new high / low
bool Arrival(string s, int etf, Zone &z[], int i)
  {
   bool oppZ, tlB, newHL, rmHL;
   ChainOf(s, etf, z, i, oppZ, tlB, newHL, rmHL);
   return tlB && (oppZ || rmHL || newHL);
  }
bool AtHtfZone(Zone &zi, Zone &hz[], int hn, int want)                    // want = +dir (same side) or -dir (opposing)
  {
   for(int j = 0; j < hn; j++)
     {
      if(hz[j].removed || hz[j].dir != want) continue;
      double hh = MathAbs(hz[j].prox - hz[j].dist), top = MathMax(hz[j].prox, hz[j].dist) + hh, bot = MathMin(hz[j].prox, hz[j].dist) - hh;
      if(zi.prox <= top && zi.prox >= bot) return true;
     }
   return false;
  }
int PlanScore(string s, int etf, int htf, int trend, Zone &z[], int i, Zone &hz[], int hn, double curve, string method)
  {
   int dir = z[i].dir, sc = 0;
   double h = MathAbs(z[i].prox - z[i].dist);
   sc += (z[i].erc && z[i].legRatio >= 2.5) ? 24 : 14;                                   // A+ / decent move away
   sc += z[i].baseN <= 3 ? 14 : (z[i].baseN <= 6 ? 4 : 0);                                // time at level: 1-3 candles best
   if(z[i].baseN == 1) sc += 2;                                                          // single-candle base
   if(Qualified(s, etf, z, i)) sc += 10;                                                  // move away removed an opposing zone
   if(!z[i].tested) sc += 8;                                                              // untouched
   sc += z[i].gap >= 0.5 ? 4 : (z[i].gap >= 0.25 ? 2 : 0);                                // Kevin: space under the stay-away candle
   if(z[i].leg2) sc += 3;                                                                 // second explosive candle, no re-basing
   if(z[i].ath) sc += 3;                                                                  // made an all-time high / low
   if(!z[i].cont) sc += 4;                                                                // valley / peak: the mentor's preferred entry
   if(z[i].legBar <= 100) sc += 4;                                                        // not an old zone
   sc += trend == dir ? 14 : (trend == 0 ? 5 : 0);                                        // with the HTF trend
   bool atHtf = false, nearOpp = false;
   for(int j = 0; j < hn; j++)
     {
      if(hz[j].removed) continue;
      double hh = MathAbs(hz[j].prox - hz[j].dist), top = MathMax(hz[j].prox, hz[j].dist) + hh, bot = MathMin(hz[j].prox, hz[j].dist) - hh;
      bool near = z[i].prox <= top && z[i].prox >= bot;
      if(near && hz[j].dir == dir) atHtf = true;
      if(near && hz[j].dir != dir) nearOpp = true;
     }
   if(atHtf) sc += 8;
   if(!nearOpp) sc += 6;
   double depth = dir > 0 ? curve : 100 - curve;                                          // low in the curve for buys
   sc += (int)MathRound(MathMax(0, MathMin(1, (100 - depth) / 100)) * 6);
   if(z[i].trap > 0) sc += 3;                                                             // liquidity trap
   if(method == "CONF") sc += 4; else if(HtfTrend(s, etf) == dir) sc += 3;               // confirmation / ETF trend with you
   return MathMin(100, sc);
  }
string PlanGrade(int sc) { return sc >= 75 ? "A" : (sc >= 60 ? "B" : "C"); }
bool GradeAllowed(string g)
  {
   if(IsAggr()) return g == "A" || g == "B" || g == "C";              // aggressive preset: every grade (C keeps half risk via InpHalfRiskC)
   if(IsBest()) return g == "A" || g == "B";                          // Kevin best: A, or B when it is an Arrival zone (checked in Scan)
   if(InpGrades == GR_ALL) return true;
   if(InpGrades == GR_A) return g == "A";
   if(InpGrades == GR_AB) return g == "A" || g == "B";
   if(InpGrades == GR_B) return g == "B";
   return g == "C";
  }

//+------------------------------------------------------------------+
//| Scan one symbol / entry timeframe                                |
//+------------------------------------------------------------------+
void Scan(string s, int k)
  {
   int etf = TF_E[k], htf = TF_H[k];
   Zone z[];
   int n = DetectZones(s, etf, z);
   int trend = HtfTrend(s, htf);
   if(InpUseMyLines && s == _Symbol && myTrend != 0) trend = myTrend;     // your trendlines decide the bias
   int kTrend = trend;                                                    // Kevin best: HTF trend (or your lines) AND the trendline bias must agree
   double point = MarketInfo(s, MODE_POINT);
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double spread = MarketInfo(s, MODE_ASK) - MarketInfo(s, MODE_BID);
   double pip = point * ((digits == 3 || digits == 5) ? 10 : 1);
   if(point <= 0 || MarketInfo(s, MODE_BID) <= 0 || MarketInfo(s, MODE_ASK) <= 0) { Say(s, k, "no price yet (symbol not in Market Watch?)"); return; }
   // denied advice expires after 3 days or once its zone is removed / consumed
   bool dch = ExpireDismissed();
   if(n > 0) dch = PruneDismissed(s, k, z, n) || dch;
   if(dch) SaveProps();

   // fresh HTF zones: an opposing HTF zone in the way caps the target
   Zone hz[];
   int hn = HtfZones(s, htf, hz);
   KLines(s, etf, gKE); KLines(s, htf, gKH);
   int kBias = KBias(gKH);
   if(InpTLBias && !(InpUseMyLines && s == _Symbol && myTrend != 0)) { int tb = KBias(gKH); if(tb != 0) trend = tb; }   // newest HTF trendline break sets the bias
   if(Viz() && s == _Symbol && etf == _Period)                           // this chart's timeframe: zones considered + the trendlines used (new bar only)
     {
      VizZones(s, k, etf, z);
      gVizTrend = StringFormat("HTF %s: swings %s, TL break %s = bias %s", TfName(htf), DirTxt(kTrend), DirTxt(kBias), DirTxt(trend));
      ArrayResize(vzR, 0); ArrayResize(vzC, 0);
      DrawKLines(s, etf, gKE, "E", clrBlack);
      DrawKLines(s, htf, gKH, "H", clrGoldenrod);
     }
   // every fresh zone in the HTF direction is checked; the best one (VP > trap > grade > R:R) is acted on
   int fI = -1; double fFar = 0, fAtr = 0;                                  // nearest zone that failed only on distance
   int best = -1; double bScore = 0, bEntry = 0, bSl = 0, bTp = 0, bRr = 0; string bMethod = "", bDecision = "", bPg = ""; int bPs = 0; bool bCapped = false;
   for(int i = n - 1; i >= 0; i--)
     {
      if(z[i].removed || z[i].consumed || z[i].pen > 0.25) continue;   // a shallow wick (< 25%) keeps it tradable
      if(z[i].legBar > InpMaxZoneAge) break;
      if(!z[i].cont && !EffTradeVP()) continue;                    // VP (reversal) zones only when enabled
      if(gMode == MODE_APPROVE && IsDismissed(s, k, z[i].prox, false)) { Count("denied by you"); continue; }   // next-best zone gets advised
      int dir = z[i].dir;
      string reason = "";
      double entry = 0, sl = 0, tp = 0, rr = 0;
      // opposing fresh zone = target
      double opp = 0;
      for(int j = 0; j < n; j++)
        {
         if(z[j].dir == dir || z[j].removed || z[j].consumed) continue;
         if(dir > 0 && z[j].prox > z[i].prox && (opp == 0 || z[j].prox < opp)) opp = z[j].prox;
         if(dir < 0 && z[j].prox < z[i].prox && (opp == 0 || z[j].prox > opp)) opp = z[j].prox;
        }
      if(dir > 0)
        {
         entry = z[i].prox + spread;                              // buy limit fills on Ask
         sl = StopFor(s, etf, z[i], pip) ;
         tp = PickTarget(s, etf, z[i], opp, spread);
        }
      else
        {
         entry = z[i].prox;
         sl = StopFor(s, etf, z[i], pip) + spread;
         tp = PickTarget(s, etf, z[i], opp, spread);
        }
      // the target can't run through a fresh opposing HTF zone - cap it just before that zone
      double hOpp = 0;
      for(int j = 0; j < hn; j++)
        {
         if(hz[j].dir == dir || hz[j].removed || hz[j].consumed) continue;
         if(dir > 0 && hz[j].prox > entry && (hOpp == 0 || hz[j].prox < hOpp)) hOpp = hz[j].prox;
         if(dir < 0 && hz[j].prox < entry && (hOpp == 0 || hz[j].prox > hOpp)) hOpp = hz[j].prox;
        }
      bool cappedByHtf = false;
      if(hOpp > 0 && (tp == 0 || (dir > 0 && hOpp - spread < tp) || (dir < 0 && hOpp + spread > tp))) { tp = dir > 0 ? hOpp - spread : hOpp + spread; cappedByHtf = true; }
      // never a noise-sized stop: at least InpMinStopPips and InpMinStopSpreads x spread
      double minStop = MathMax(MathMax(InpMinStopPips * pip, InpMinStopSpreads * spread), InpMinStopATR * iATR(s, etf, 14, 1));
      if(MathAbs(entry - sl) < minStop) sl = dir > 0 ? entry - minStop : entry + minStop;
      // Kevin best: volatility stop - widen the buffer beyond the distal so the stop is >= InpBestStopATR x entry TF ATR
      // (metals / oil also >= 0.35 x HTF ATR); R:R is re-checked on the wider stop, lots follow the final stop
      double rr0 = 0; bool volWide = false;
      if(IsBest())
        {
         double volMin = InpBestStopATR * iATR(s, etf, 14, 1);
         if(MetalOrOil(s)) volMin = MathMax(volMin, 0.35 * iATR(s, htf, 14, 1));
         if(tp > 0 && MathAbs(entry - sl) > 0) rr0 = MathAbs(tp - entry) / MathAbs(entry - sl);
         if(MathAbs(entry - sl) < volMin) { sl = dir > 0 ? entry - volMin : entry + volMin; volWide = true; }
        }
      if(IsZ3())                                                       // Zones 3R: just before the proximal, stop beyond the distal, fixed 1:N target
        {
         double zh = MathAbs(z[i].prox - z[i].dist);
         if(dir > 0) { entry = z[i].prox + spread + InpZ3Front * zh; sl = z[i].dist - MathMax(spread, InpZ3StopBuf * zh); }
         else        { entry = z[i].prox - InpZ3Front * zh;          sl = z[i].dist + spread + MathMax(spread, InpZ3StopBuf * zh); }
         tp = dir > 0 ? entry + InpZ3RR * (entry - sl) : entry - InpZ3RR * (sl - entry);
         entry = NormalizeDouble(entry, digits); sl = NormalizeDouble(sl, digits); tp = NormalizeDouble(tp, digits);
         if(MathAbs(entry - sl) < InpMinStopSpreads * spread) reason = "zones3r: zone too small for the spread";
        }
      double risk = MathAbs(entry - sl);
      if(tp > 0 && risk > 0) rr = MathAbs(tp - entry) / risk;
      string method = ConfirmedBy(s, etf, dir, z, z[i], hz, hn) ? "CONF" : "SF";
      double curve = Curve(s, htf, z[i].prox);

      if(IsZ3()) { if(reason == "" && InpZ3Bias && trend == -dir) reason = "zones3r: against HTF bias"; }
      else if(trend == 0) reason = "HTF trend unclear";
      else if(trend != dir) reason = "against HTF trend";
      else if(EffEntry() == ENTRY_SF && method == "CONF") method = "SF";
      if(reason == "" && IsBest())
        {
         if(kBias == -dir) reason = "best: bias (newest HTF trendline break against)";
         else if(z[i].tested) reason = "best: not fresh";
         else if(KCross(s, dir, z[i].prox) < 0) reason = "best: tl cross";
        }
      if(reason == "" && InpRequireITF) { int it = HtfTrend(s, TF_I[k]); if(it == -dir) reason = "intermediate TF " + TfName(TF_I[k]) + " against"; }
      if(reason == "" && InpCurveFilter)
        {
         double lim = AtHtfZone(z[i], hz, hn, dir) ? 50 : 33;
         if((dir > 0 && curve > lim) || (dir < 0 && curve < 100 - lim)) reason = "zone not low/high enough in the HTF curve";
        }
      if(reason == "" && !IsZ3() && InpRequireQualified && !Qualified(s, etf, z, i)) reason = "not in the chain (removed nothing, no trendline, no all-time high/low)";
      if(reason == "" && EffBlockOverext() && (ChannelState(s, etf, gKE, dir, z[i].prox) == 2 || ChannelState(s, htf, gKH, dir, z[i].prox) == 2)) reason = "zone beyond the channel 50% (overextended) - wait for the golden area";
      if(reason == "" && !IsZ3() && z[i].gap < InpMinGap) reason = "drawable only: little space under the stay-away candle";
      if(reason == "" && !IsZ3() && InpMinSizeVsMedian > 0)
        {
         double hs[]; int m = 0; ArrayResize(hs, n);
         for(int j = 0; j < n; j++) if(!z[j].removed) hs[m++] = MathAbs(z[j].prox - z[j].dist);
         if(m >= 4) { ArrayResize(hs, m); ArraySort(hs); double med = hs[m / 2]; if(MathAbs(z[i].prox - z[i].dist) < InpMinSizeVsMedian * med) reason = "zone too small vs the others on this chart"; }
        }
      // no chasing: a confirmed swing has formed and price has pulled back toward the zone
      double now = dir > 0 ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK), far = MathAbs(now - z[i].prox);
      double maxFar = MathMin(InpMaxDistATR * iATR(s, htf, 14, 1), tp > 0 ? 0.75 * MathAbs(tp - entry) : DBL_MAX);
      if(reason == "")
        {
         int ix = dir > 0 ? iHighest(s, etf, MODE_HIGH, MathMax(1, z[i].legBar), 1) : iLowest(s, etf, MODE_LOW, MathMax(1, z[i].legBar), 1);
         if(ix >= 0 && ix < 2) reason = "no pullback yet (price still at the swing)";
         else if(far > maxFar)
           {
            reason = "zone too far from price";
            double ha = iATR(s, htf, 14, 1);
            if(far > InpMaxDistATR * ha && (fI < 0 || far < fFar)) { fI = i; fFar = far; fAtr = ha; }
           }
        }
      if(reason == "" && EffEntry() == ENTRY_CONF && method != "CONF") reason = "no confirmation";
      if(reason == "") { int tb; bool cr; z[i].trap = FindTrap(s, etf, dir, z[i].prox, z[i].dist, z[i].legBar - 1, z[i].legBar + z[i].baseN, tb, cr); z[i].trapBar = tb; z[i].crowded = cr; }
      if(reason == "" && InpRequireTrap && z[i].trap == 0) reason = "no liquidity trap";
      int ps = 0; string pg = "";
      if(reason == "") { ps = PlanScore(s, etf, htf, trend, z, i, hz, hn, curve, method); if(Arrival(s, etf, z, i)) ps = MathMin(100, ps + 8); { int cx = KCross(s, dir, z[i].prox); ps = (int)MathMax(0, MathMin(100, ps + (cx > 0 ? 3 : (cx < 0 ? -5 : 0)))); } pg = PlanGrade(ps); if(!IsZ3() && !GradeAllowed(pg)) reason = StringFormat("grade %s (%d) filtered", pg, ps); else if(IsBest() && pg == "B" && !Arrival(s, etf, z, i)) reason = "best: grade B without arrival"; }
      if(reason == "" && tp == 0) reason = "no opposing zone for target";
      if(reason == "" && rr < InpMinRR)
        {
         if(volWide && rr0 >= InpMinRR) reason = "best: rr after vol stop";
         else reason = StringFormat("R:R %.2f < %.2f", rr, InpMinRR);
        }
      if(reason == "" && spread > risk * InpMaxSpreadPct / 100.0) reason = "spread too wide";
      if(reason == "") reason = BlockedNow(s, TF_E[k]);
      if(reason == "" && IsProt())
        {
         int zt = ZoneOrder(s, dir, z[i].prox, z[i].dist);
         if(zt > 0) { BestModify(zt, s, etf, entry, sl, tp, MathAbs(z[i].prox - z[i].dist)); reason = "best: zone already traded"; }
         else if(DirOrders(s, dir) > 0) reason = "best: direction already traded";
         else if(ZonePlacements(s, dir, z[i].prox, z[i].dist) >= 2) reason = "best: zone placed twice already";
         else
           {
            string pb = BestBlocked(s, dir);
            if(pb != "") reason = pb;
            else if(far > 1.0 * iATR(s, htf, 14, 1)) reason = "best: waiting (price > 1 HTF ATR from zone)";
           }
        }
      if(reason == "" && HasOrder(s, k)) reason = "already an order on this symbol/timeframe";
      if(reason == "" && CountOrders(s) >= EffMaxPerSymbol()) reason = "max orders on symbol";
      if(reason == "" && CountOrders("") >= EffMaxOrders()) reason = "max bot orders reached";
      if(reason == "")
        {
         double ask = MarketInfo(s, MODE_ASK), bid = MarketInfo(s, MODE_BID);
         double stopLvl = MarketInfo(s, MODE_STOPLEVEL) * point;
         if(dir > 0 && ask - entry <= stopLvl) reason = "price too close to zone";
         if(dir < 0 && entry - bid <= stopLvl) reason = "price too close to zone";
        }
      string decision = reason == "" ? (gMode == MODE_AUTO ? "ORDER" : (gMode == MODE_APPROVE ? "PROPOSE" : "ALERT")) : "SKIP";
      LogSignal(s, k, z[i], entry, sl, tp, rr, trend, curve, method, spread / point, decision, reason, digits);
      Say(s, k, decision == "SKIP" ? "skip - " + reason + StringFormat(" (%s %s %s, grade %s)", TF_N[k], dir > 0 ? "demand" : "supply", DoubleToString(z[i].prox, digits), z[i].grade) : decision);
      if(reason != "" && Viz() && s == _Symbol && etf == _Period) { VizSkip(s, k, etf, z[i], reason); VizTally(reason); }
      if(reason != "") { Count(reason); if(StringFind(reason, "already an order") == 0 || StringFind(reason, "max ") == 0 || StringFind(reason, "Friday") == 0 || StringFind(reason, "weekend") == 0 || StringFind(reason, "Asian") == 0 || StringFind(reason, "news") == 0) return; continue; }

      // rank: planner score (VP bonus inside) + nearness to price
      double score = ps + 10.0 * (1.0 - MathMin(1.0, far / MathMax(maxFar, point))) - (z[i].crowded ? 4 : 0);   // nearest good zone wins; R:R is only a gate
      if(best < 0 || score > bScore) { best = i; bScore = score; bEntry = entry; bSl = sl; bTp = tp; bRr = rr; bMethod = method; bCapped = cappedByHtf; bDecision = decision; bPs = ps; bPg = pg; }
      continue;
     }
   if(best < 0)
     {
      if(fI >= 0) SetWatch(s, k, z[fI].dir, z[fI].prox, fAtr, fFar, htf, digits); else ClearWatch(s, k);
      return;
     }
   ClearWatch(s, k);
   {
      int i = best, dir = z[i].dir; double entry = bEntry, sl = bSl, tp = bTp, rr = bRr; string method = bMethod, decision = bDecision, g = bPg; bool cappedByHtf = bCapped;
      string tag = StringFormat("%s %s %s %s %s 1:%.1f grade %s%s", s, TF_N[k], dir > 0 ? "BUY" : "SELL", z[i].cont ? "CP" : "VP", method, rr, g, z[i].trap > 0 ? " + liquidity trap" : "");
      tag += StringFormat(" (score %d)", bPs);
      Count(decision);
      string info = StringFormat("%s %s %s zone (grade %s %d) | %s trend %s | %s%s\n", dir > 0 ? "BUY" : "SELL", TF_N[k], dir > 0 ? "demand" : "supply", g, bPs, TfName(htf), trend > 0 ? "up" : "down", method == "CONF" ? "confirmation" : "set & forget", z[i].trap > 0 ? " | liquidity trap" : "");
      info += StringFormat("Why: fresh %s %s with the trend, stop %s, move away %.1fx, target %s %s", z[i].cont ? "CP" : "VP", z[i].cont ? (dir > 0 ? "RBR" : "DBD") : (dir > 0 ? "DBR" : "RBD"), z[i].cont ? "beyond distal" : "beyond swing " + (dir > 0 ? "valley" : "peak"), z[i].legRatio, cappedByHtf ? "before next" : "at nearest", cappedByHtf ? TfName(htf) + (dir > 0 ? " supply" : " demand") : (dir > 0 ? "swing high / supply" : "swing low / demand"));
      { double ha = iATR(s, htf, 14, 1), fr = MathAbs((dir > 0 ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK)) - z[i].prox);
        info += StringFormat("\nDistance: %.1f x %s ATR (%s away, ATR %s) - within reach (limit %.1f)\n", fr / MathMax(ha, point), TfName(htf), DoubleToString(fr, digits), DoubleToString(ha, digits), InpMaxDistATR); }
      { int ce = ChannelState(s, etf, gKE, dir, z[i].prox), ch = ChannelState(s, htf, gKH, dir, z[i].prox);
        string nt = KNear(s, etf, htf, dir, z[i].prox);
        info += "Channel: " + (ce == 1 || ch == 1 ? "zone in the golden area (trendline to 50%)" : "no respected trendline in this direction") + (nt != "" ? " | zone at the " + nt + " trendline" : "") + "\n"; }
      if(Arrival(s, etf, z, i)) info += "ARRIVAL zone (strongest): broke the trendline AND took out the previous high / low\n";
      { int cx = KCross(s, dir, z[i].prox); if(cx != 0) info += (cx > 0 ? "Price reaches the zone without crossing a trendline\n" : "Price must break a trendline before reaching the zone\n"); }
      { bool cO, cT, cN, cR; ChainOf(s, etf, z, i, cO, cT, cN, cR);
        string cw = (cO ? "removed an opposing zone, " : "") + (cT ? "broke a trendline, " : "") + (cN ? (dir > 0 ? "made a new high, " : "made a new low, ") : "") + (cR ? (dir > 0 ? "took out the previous high, " : "took out the previous low, ") : "");
        if(cw == "") cw = "not in the chain"; else cw = StringSubstr(cw, 0, StringLen(cw) - 2);
        info += StringFormat("Chain: %s | space under stay-away %.0f%% of zone%s", cw, z[i].gap * 100, z[i].leg2 ? " | second explosive candle" : ""); }
      bool fresh = true;                                                 // approve mode: alert only for new / changed advice
      if(gMode == MODE_APPROVE) fresh = AddProposal(s, k, dir, entry, sl, tp, z[i].dist, method, g, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
      if(fresh)
        {
         if(InpAlerts) Alert("RamanFX ZoneBot: ", tag);
         if(InpPush && !IsTesting()) SendNotification("RamanFX: " + tag + (gMode == MODE_APPROVE ? " - check the chart and approve in MT4" : ""));
        }
      if(gMode == MODE_AUTO) Place(s, k, dir, entry, sl, tp, z[i].dist, method, g, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
   }
  }

// Confirmation: price touched an HTF zone in our direction within N entry bars, and an
// opposing entry-TF zone was removed after that touch; the candidate formed after the touch.
bool ConfirmedBy(string s, int etf, int dir, Zone &ez[], Zone &cand, Zone &hz[], int n)
  {
   datetime since = iTime(s, etf, InpConfTouchBars);
   datetime touch = 0;
   for(int i = 0; i < n; i++)
     {
      if(hz[i].dir != dir || hz[i].removed || !hz[i].tested) continue;
      if(hz[i].tTouched >= since && hz[i].tTouched > touch) touch = hz[i].tTouched;
     }
   if(touch == 0 || cand.tLeg < touch) return false;
   for(int j = 0; j < ArraySize(ez); j++)
      if(ez[j].dir == -dir && ez[j].removed && ez[j].tRemoved >= touch) return true;
   return false;
  }

//+------------------------------------------------------------------+
//| Filters                                                          |
//+------------------------------------------------------------------+
double dayStartEquity = 0; int dayStartDoy = -1;
bool DailyLossHit()
  {
   int doy = TimeDayOfYear(TimeCurrent());
   if(doy != dayStartDoy) { dayStartDoy = doy; dayStartEquity = AccountBalance(); }
   return dayStartEquity > 0 && (dayStartEquity - AccountEquity()) / dayStartEquity * 100.0 >= InpMaxDailyLossPct;
  }

// Higher-timeframe zones change only when a new HTF candle opens: detect once per symbol/HTF bar, reuse after.
#define HCAP 40
string hKey[]; datetime hTime[]; int hCount[]; Zone hStore[];
int HtfZones(string s, int htf, Zone &out[])
  {
   string key = s + "|" + IntegerToString(htf);
   datetime t = iTime(s, htf, 0);
   int slot = -1;
   for(int i = 0; i < ArraySize(hKey); i++) if(hKey[i] == key) { slot = i; break; }
   if(slot < 0) { slot = ArraySize(hKey); ArrayResize(hKey, slot + 1); ArrayResize(hTime, slot + 1); ArrayResize(hCount, slot + 1); ArrayResize(hStore, (slot + 1) * HCAP); hKey[slot] = key; hTime[slot] = 0; hCount[slot] = 0; }
   if(hTime[slot] != t)
     {
      Zone z[]; int n = DetectZones(s, htf, z), c = 0;
      for(int i = n - 1; i >= 0 && c < HCAP; i--) if(!z[i].removed) hStore[slot * HCAP + c++] = z[i];   // newest live zones
      hCount[slot] = c; hTime[slot] = t;
     }
   ArrayResize(out, hCount[slot]);
   for(int i = 0; i < hCount[slot]; i++) out[i] = hStore[slot * HCAP + i];
   return hCount[slot];
  }

// in the tester TimeGMT() is the PC clock, so use the test time minus the broker offset
datetime NowUTC() { return IsTesting() ? TimeCurrent() - InpTesterGMT * 3600 : TimeGMT(); }

string BlockedNow(string s, int etf = 0)
  {
   if(InpMaxDailyLossPct > 0 && DailyLossHit()) return "daily loss limit";
   datetime utc = NowUTC();
   int h = TimeHour(utc), dow = TimeDayOfWeek(utc);
   if(dow == 5 && h >= InpFridayCutUTC) return "Friday cut-off";
   if(dow == 6 || dow == 0) return "weekend";
   if(InpSkipAsian)
     {
      bool asia = InpAsianStartUTC > InpAsianEndUTC ? (h >= InpAsianStartUTC || h < InpAsianEndUTC) : (h >= InpAsianStartUTC && h < InpAsianEndUTC);
      if(asia) return "Asian session";
     }
   for(int i = 0; i < ArraySize(newsTime) && !(InpNewsIntradayOnly && etf >= PERIOD_H4); i++)
     {
      if(StringFind(s, newsCcy[i]) < 0) continue;
      if(utc >= newsTime[i] - InpNewsBeforeMin * 60 && utc <= newsTime[i] + InpNewsAfterMin * 60) return "news " + newsCcy[i];
     }
   return "";
  }

void LoadNews()
  {
   lastNewsLoad = TimeCurrent();
   ArrayResize(newsTime, 0); ArrayResize(newsCcy, 0);
   if(IsTesting() && !InpTesterNews) return;
   int f = FileOpen("RamanFX_News.csv", FILE_READ | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   while(!FileIsEnding(f))
     {
      string t = FileReadString(f);
      if(FileIsEnding(f) && t == "") break;
      string c = FileReadString(f);
      datetime dt = StringToTime(t);
      if(dt == 0 || c == "") continue;
      int n = ArraySize(newsTime); ArrayResize(newsTime, n + 1); ArrayResize(newsCcy, n + 1);
      newsTime[n] = dt; newsCcy[n] = c;
     }
   FileClose(f);
  }

//+------------------------------------------------------------------+
//| Orders                                                           |
//+------------------------------------------------------------------+
int MagicFor(int k, string method) { return InpMagic + k + (method == "CONF" ? 10 : 0); }
bool OurMagic(int m) { return m >= InpMagic && m < InpMagic + 20; }

// One bot order per symbol per entry timeframe (magic = base + k, +10 for confirmation).
bool HasOrder(string s, int k)
  {
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OrderSymbol() == s && OurMagic(OrderMagicNumber()) && (OrderMagicNumber() - InpMagic) % 10 == k) return true;
   return false;
  }
int CountOrders(string s)
  {
   int n = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OurMagic(OrderMagicNumber()) && (s == "" || OrderSymbol() == s)) n++;
   return n;
  }

// Target: the recent swing extreme of the move that left the zone (lowest low since the zone for sells,
// highest high for buys) - where you take profit manually - or the next opposing zone, per InpTpMode.
double PickTarget(string s, int tf, Zone &z, double opp, double spread)
  {
   double sw = 0;
   int n = z.legBar;                                                  // from the move away up to the last closed candle
   if(n >= 1)
     {
      int ix = z.dir > 0 ? iHighest(s, tf, MODE_HIGH, n, 1) : iLowest(s, tf, MODE_LOW, n, 1);
      if(ix >= 0) sw = z.dir > 0 ? iHigh(s, tf, ix) : iLow(s, tf, ix);
     }
   double swTp = sw > 0 ? sw - z.dir * spread : 0, opTp = opp > 0 ? opp - z.dir * spread : 0;
   if(InpTpMode == TP_SWING) return swTp > 0 ? swTp : opTp;
   if(InpTpMode == TP_OPP_ZONE) return opTp;
   if(swTp == 0) return opTp;
   if(opTp == 0) return swTp;
   return z.dir > 0 ? MathMin(swTp, opTp) : MathMax(swTp, opTp);     // nearest
  }

// Stop placement (mentor):
//  CP zone (RBR / DBD continuation): a few pips beyond the distal line.
//  VP zone (DBR / RBD reversal): a few pips beyond the swing valley (demand) / peak (supply) of the entry TF
//  around the zone - the lowest low / highest high from the drop into the base through the stay-away candle.
double TfStopPips(int tf)
  {
   switch(tf) { case PERIOD_M1: return 1; case PERIOD_M5: return 1.5; case PERIOD_M15: return 3; case PERIOD_H1: return 5; case PERIOD_H4: return 10; case PERIOD_D1: return 20; }
   return 40;
  }
bool MetalOrOil(string s) { string u = s; StringToUpper(u); return StringFind(u, "XAU") >= 0 || StringFind(u, "GOLD") >= 0 || StringFind(u, "XAG") >= 0 || StringFind(u, "OIL") >= 0 || StringFind(u, "WTI") >= 0 || StringFind(u, "BRENT") >= 0 || StringFind(u, "XTI") >= 0 || StringFind(u, "XBR") >= 0; }
double StopFor(string s, int tf, Zone &z, double pip)
  {
   double buf = TfStopPips(tf) * InpStopScale * pip * (MetalOrOil(s) ? InpMetalOilStop : 1.0);
   if(z.cont) return z.dist - z.dir * buf;
   // VP: the swing valley (peak) is the lowest low (highest high) of the whole drop (rally) into the zone:
   // walk back from the move away until price was last above the move-away high (below its low), max 150 bars
   double legX = z.dir > 0 ? iHigh(s, tf, z.legBar) : iLow(s, tf, z.legBar);
   double ext = z.dist;
   int from = MathMax(1, z.legBar - 2);
   for(int j = from; j < iBars(s, tf) && j <= z.legBar + 150; j++)
     {
      ext = z.dir > 0 ? MathMin(ext, iLow(s, tf, j)) : MathMax(ext, iHigh(s, tf, j));   // leg-in candle's wick counts
      if(j > z.legBar + z.baseN && (z.dir > 0 ? iHigh(s, tf, j) >= legX : iLow(s, tf, j) <= legX)) break;
     }
   return ext - z.dir * buf;
  }


double Lots(string s, double stopDist, double pct)
  {
   double tv = MarketInfo(s, MODE_TICKVALUE), ts = MarketInfo(s, MODE_TICKSIZE);
   if(tv <= 0 || ts <= 0 || stopDist <= 0) return 0;
   double perLot = stopDist / ts * tv;
   double lots = AccountBalance() * pct / 100.0 / perLot;
   double step = MarketInfo(s, MODE_LOTSTEP), mn = MarketInfo(s, MODE_MINLOT), mx = MarketInfo(s, MODE_MAXLOT);
   if(step <= 0) step = 0.01;
   lots = MathFloor(lots / step + 1e-9) * step;
   if(lots < mn) return 0;                                      // can't keep risk <= target
   if(mx > 0) lots = MathMin(lots, mx);
   return NormalizeDouble(lots, LotDigits(step));
  }
int LotDigits(double step) { return step >= 1 ? 0 : (step >= 0.1 ? 1 : (step >= 0.01 ? 2 : 3)); }

bool Place(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade, double rr, bool trap, string info, double prox, datetime tZone)
  {
   placeErr = "";
   if(!IsTradeAllowed() || !TerminalInfoInteger(TERMINAL_TRADE_ALLOWED))
     { placeErr = "AutoTrading is OFF - press the AutoTrading button on the MT4 toolbar (green) and tick 'Allow live trading' in the bot's settings (F7)"; Print(s, ": ", placeErr); return false; }
   double riskPctUse = (IsProt() ? BestRiskPct() : InpRiskPct) * ((InpHalfRiskC && grade == "C") ? 0.5 : 1.0);   // low odds = half risk
   RefreshRates();
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double point = MarketInfo(s, MODE_POINT), pip = point * ((digits == 3 || digits == 5) ? 10 : 1);
   double ask = MarketInfo(s, MODE_ASK), bid = MarketInfo(s, MODE_BID);
   if(point <= 0 || ask <= 0 || bid <= 0 || AccountBalance() <= 0) { placeErr = "no price for " + s + " (add it to Market Watch)"; Print(s, ": ", placeErr); return false; }
   entry = NormalizeDouble(entry, digits); sl = NormalizeDouble(sl, digits); tp = NormalizeDouble(tp, digits);
   // the broker rejects (error 130) a limit on the wrong side of price or stops inside its stop level
   double stopLvl = MarketInfo(s, MODE_STOPLEVEL) * point;
   if(dir > 0)
     {
      if(entry >= ask - stopLvl) placeErr = StringFormat("price (ask %s) is already at/through the entry %s - a buy limit must sit below price", DoubleToString(ask, digits), DoubleToString(entry, digits));
      else if(sl <= 0 || sl >= entry - stopLvl) placeErr = "stop too close to (or on the wrong side of) the entry";
      else if(tp > 0 && tp <= entry + stopLvl) placeErr = "target too close to (or on the wrong side of) the entry";
     }
   else
     {
      if(entry <= bid + stopLvl) placeErr = StringFormat("price (bid %s) is already at/through the entry %s - a sell limit must sit above price", DoubleToString(bid, digits), DoubleToString(entry, digits));
      else if(sl <= entry + stopLvl) placeErr = "stop too close to (or on the wrong side of) the entry";
      else if(tp > 0 && tp >= entry - stopLvl) placeErr = "target too close to (or on the wrong side of) the entry";
     }
   if(placeErr != "") { Print(s, ": ", placeErr); Count("prices invalid at placement"); return false; }
   double stopDist = MathAbs(entry - sl);
   double lots = Lots(s, stopDist, riskPctUse);
   if(lots <= 0) { Print(s, ": lot size below broker minimum at ", riskPctUse, "% risk - skipped"); Count("lot below broker minimum"); placeErr = "lot below broker minimum"; return false; }
   double lstep = MarketInfo(s, MODE_LOTSTEP); if(lstep <= 0) lstep = 0.01;
   if(lots > InpMaxLots) lots = NormalizeDouble(MathFloor(InpMaxLots / lstep + 1e-9) * lstep, LotDigits(lstep));
   if(lots < MarketInfo(s, MODE_MINLOT) || lots <= 0) { placeErr = "InpMaxLots is below the broker minimum lot"; Print(s, ": ", placeErr); return false; }
   // real money at risk and margin, double-checked before sending
   double tv = MarketInfo(s, MODE_TICKVALUE), ts = MarketInfo(s, MODE_TICKSIZE);
   if(tv <= 0 || ts <= 0) { placeErr = "no tick value for " + s; Print(s, ": ", placeErr); return false; }
   double riskMoney = stopDist / ts * tv * lots;
   double riskPct = 100.0 * riskMoney / AccountBalance();
   double margin = MarketInfo(s, MODE_MARGINREQUIRED) * lots;
   if(riskPct > riskPctUse * 1.05) { Print(s, StringFormat(": risk %.2f%% above %.2f%% - skipped", riskPct, riskPctUse)); Count("risk check failed"); placeErr = "risk check failed"; return false; }
   if(margin > AccountFreeMargin() * InpMaxMarginPct / 100.0) { Print(s, StringFormat(": needs margin %.2f > %.0f%% of free margin - skipped", margin, InpMaxMarginPct)); Count("margin too high"); placeErr = "margin too high"; return false; }
   ResetLastError();
   if(AccountFreeMarginCheck(s, dir > 0 ? OP_BUY : OP_SELL, lots) <= 0 || GetLastError() == ERR_NOT_ENOUGH_MONEY) { Count("not enough free margin"); placeErr = "not enough free margin"; return false; }
   info += StringFormat("\nRisk %.2f %s (%.2f%%) | %.2f lots | stop %.1f pips | R:R 1:%.1f",
                        riskMoney, AccountCurrency(), riskPct, lots, stopDist / pip, rr);
   // short human comment (MT4 allows 31 characters); full reasoning goes to the log, Experts tab and chart
   // e.g. "2 M5 demand A, H1 up, 1:4.8 trap" (MT4 keeps 31 characters)
   // Starts with a rank so the Comment column sorts 1 minute -> 1 month: 1 M1, 2 M5, 3 M15, 4 H1, 5 H4, 6 D1, 7 W1
   string cm = StringFormat("%d %s %s %s, %s %s, 1:%.1f", k + 1, TF_N[k], dir > 0 ? "demand" : "supply", grade, TfName(TF_H[k]), dir > 0 ? "up" : "down", rr);
   if(method == "CONF" && StringLen(cm) <= 26) cm += " conf";
   if(trap && StringLen(cm) <= 26) cm += " trap";
   int type = dir > 0 ? OP_BUYLIMIT : OP_SELLLIMIT;
   for(int w = 0; w < 30 && IsTradeContextBusy(); w++) Sleep(100);
   ResetLastError();
   int t = OrderSend(s, type, lots, entry, 3, sl, tp, cm, MagicFor(k, method), 0, dir > 0 ? clrLime : clrRed);
   if(t < 0) { int e = GetLastError(); Print("OrderSend failed ", s, " error ", e); placeErr = "broker rejected the order (error " + IntegerToString(e) + ")"; Count(placeErr); return false; }
   StSet(t, k, method, dist, stopDist / point, grade);
   gPlaced++;
   if(IsProt()) AddZonePlacement(s, dir, prox, dist);
   RecordInit(t, sl, tp);                                                // exact initial stop / target for the backtest report
   string lines[]; int n = StringSplit(info, '\n', lines);
   for(int i = 0; i < n; i++) Print("#", t, " ", lines[i]);
   LogOrder(t, s, info);
   Annotate(t, s, entry, lines, prox, dist, tZone, k, dir);
   if(StringFind(info, "ARRIVAL") >= 0) { int na = ArraySize(vzArrT); ArrayResize(vzArrT, na + 1); vzArrT[na] = t; }   // for the order label
   return true;
  }

//+------------------------------------------------------------------+
//| Per-order state (MT4 comments are too short to hold it)          |
//+------------------------------------------------------------------+
int stT[]; int stK[]; string stM[]; double stDist[]; double stRpts[]; string stG[];
int StIdx(int t) { for(int i = 0; i < ArraySize(stT); i++) if(stT[i] == t) return i; return -1; }
void StSet(int t, int k, string m, double dist, double rpts, string g)
  {
   int i = StIdx(t);
   if(i < 0) { i = ArraySize(stT); ArrayResize(stT, i + 1); ArrayResize(stK, i + 1); ArrayResize(stM, i + 1); ArrayResize(stDist, i + 1); ArrayResize(stRpts, i + 1); ArrayResize(stG, i + 1); }
   stT[i] = t; stK[i] = k; stM[i] = m; stDist[i] = dist; stRpts[i] = rpts; stG[i] = g;
   int f = FileOpen(PairFile("RamanFX_Bot_State", ".csv"), FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   for(int j = 0; j < ArraySize(stT); j++) FileWrite(f, stT[j], stK[j], stM[j], DoubleToString(stDist[j], 6), DoubleToString(stRpts[j], 1), stG[j]);
   FileClose(f);
  }
void StLoad()
  {
   ArrayResize(stT, 0); ArrayResize(stK, 0); ArrayResize(stM, 0); ArrayResize(stDist, 0); ArrayResize(stRpts, 0); ArrayResize(stG, 0);
   string fn = PairFile("RamanFX_Bot_State", ".csv");
   if(!FileIsExist(fn)) fn = "RamanFX_Bot_State.csv";               // first run after the update: old shared file
   int f = FileOpen(fn, FILE_READ | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   while(!FileIsEnding(f))
     {
      int t = (int)StringToInteger(FileReadString(f)); if(t == 0) break;
      int i = ArraySize(stT); ArrayResize(stT, i + 1); ArrayResize(stK, i + 1); ArrayResize(stM, i + 1); ArrayResize(stDist, i + 1); ArrayResize(stRpts, i + 1); ArrayResize(stG, i + 1);
      stT[i] = t; stK[i] = (int)StringToInteger(FileReadString(f)); stM[i] = FileReadString(f);
      stDist[i] = StringToDouble(FileReadString(f)); stRpts[i] = StringToDouble(FileReadString(f)); stG[i] = FileReadString(f);
     }
   FileClose(f);
  }
// Entry TF index from the magic number when no state exists (magic = base + k [+10 for confirmation]).
int KOf(int magic) { int k = (magic - InpMagic) % 10; return (k >= 0 && k < NTF) ? k : 1; }

// One tab-separated line per order; lines of the reasoning joined with " || " so ZoneVision can show them on any chart.
void LogOrder(int t, string s, string info)
  {
   bool fresh = !FileIsExist("RamanFX_Bot_Orders.txt");
   int f = FileOpen("RamanFX_Bot_Orders.txt", FILE_READ | FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_SHARE_READ | FILE_SHARE_WRITE);
   if(f == INVALID_HANDLE) return;
   FileSeek(f, 0, SEEK_END);
   if(fresh) FileWriteString(f, "Time\tTicket\tSymbol\tReasoning\r\n");
   string flat = info; StringReplace(flat, "\n", " || "); StringReplace(flat, "\t", " ");
   FileWriteString(f, TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES) + "\t" + IntegerToString(t) + "\t" + s + "\t" + flat + "\r\n");
   FileClose(f);
  }

// Writes the reasoning next to the order on every open chart of that symbol.
void Annotate(int t, string s, double price, string &lines[], double prox, double dist, datetime tZone, int k, int dir)
  {
   for(long ch = ChartFirst(); ch >= 0; ch = ChartNext(ch))
     {
      if(ChartSymbol(ch) != s) continue;
      ObjectsDeleteAll(ch, "RFXO_");
      // the exact zone this order came from, with its timeframe
      string zn = StringFormat("RFXO_%d_zone", t);
      ObjectCreate(ch, zn, OBJ_RECTANGLE, 0, tZone, prox, TimeCurrent() + PeriodSeconds(TF_E[k]) * 60, dist);
      ObjectSetInteger(ch, zn, OBJPROP_COLOR, dir > 0 ? C'170,215,190' : C'240,190,180');
      ObjectSetInteger(ch, zn, OBJPROP_BACK, true);
      ObjectSetString(ch, zn, OBJPROP_TOOLTIP, StringFormat("Bot order #%d - %s %s zone", t, TF_N[k], dir > 0 ? "demand" : "supply"));
      string zl = StringFormat("RFXO_%d_ztxt", t);
      ObjectCreate(ch, zl, OBJ_TEXT, 0, tZone, dist);
      ObjectSetString(ch, zl, OBJPROP_TEXT, StringFormat("%s %s zone -> order #%d", TF_N[k], dir > 0 ? "demand" : "supply", t));
      ObjectSetInteger(ch, zl, OBJPROP_FONTSIZE, 7); ObjectSetInteger(ch, zl, OBJPROP_COLOR, clrDimGray);
      ObjectSetInteger(ch, zl, OBJPROP_ANCHOR, dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
      // reasoning text is shown by ZoneVision (bottom-right) and in the Experts tab: no second copy here, so nothing overlaps
      NoSelect(ch, "RFXO_");
      ChartRedraw(ch);
     }
  }

string Field(string cm, int idx) { string p[]; int n = StringSplit(cm, '|', p); return idx < n ? p[idx] : ""; }

void ManageOrders()
  {
   datetime utc = NowUTC();
   bool fridayCut = TimeDayOfWeek(utc) == 5 && TimeHour(utc) >= InpFridayCutUTC;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS) || !OurMagic(OrderMagicNumber())) continue;
      if(ChartOnly() && OrderSymbol() != _Symbol) continue;             // each chart's bot manages its own pair
      string s = OrderSymbol(); string cm = OrderComment();
      int type = OrderType();
      int si = StIdx(OrderTicket());
      int k = si >= 0 ? stK[si] : KOf(OrderMagicNumber());
      if(k < 0 || k >= NTF) k = KOf(OrderMagicNumber());
      int etf = TF_E[k];
      double dist = si >= 0 ? stDist[si] : 0;
      double point = MarketInfo(s, MODE_POINT);
      if(type == OP_BUYLIMIT || type == OP_SELLLIMIT)
        {
         string why = "";
         double c1 = iClose(s, etf, 1);
         if(dist > 0 && type == OP_BUYLIMIT && c1 < dist) why = "zone removed";
         if(dist > 0 && type == OP_SELLLIMIT && c1 > dist) why = "zone removed";
         if(!IsProt() && OrderTakeProfit() > 0 && type == OP_BUYLIMIT && MarketInfo(s, MODE_BID) >= OrderOpenPrice() + 0.8 * (OrderTakeProfit() - OrderOpenPrice())) why = "price ran 80% to target before fill";
         if(!IsProt() && OrderTakeProfit() > 0 && type == OP_SELLLIMIT && MarketInfo(s, MODE_ASK) <= OrderOpenPrice() - 0.8 * (OrderOpenPrice() - OrderTakeProfit())) why = "price ran 80% to target before fill";
         if(IsProt() && why == "")                                      // Kevin best: price left the zone far behind (re-armed later within 1 ATR)
           {
            double hAtr = iATR(s, TF_H[k], 14, 1), pxNow = type == OP_BUYLIMIT ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK);
            if(hAtr > 0 && MathAbs(pxNow - OrderOpenPrice()) > 3.0 * hAtr) why = "price moved more than 3 x HTF ATR away from the zone";
            if(why == "" && gPWeekStop) why = "weekly loss limit (Kevin best)";
            if(why == "" && gPDayStop) why = "daily loss limit (Kevin best)";
            int pTk = OrderTicket();
            if(why == "" && InpMaxTradesDay > 0 && FillsToday(s) >= InpMaxTradesDay) why = "max trades per day reached";
            if(!OrderSelect(pTk, SELECT_BY_TICKET)) continue;              // FillsToday() moved the order selection
           }
         if(fridayCut) why = "Friday cut-off";
         if(InpMaxDailyLossPct > 0 && DailyLossHit()) why = "daily loss limit";
         if(why == "" && iBarShift(s, etf, OrderOpenTime()) > InpPendingBars) why = "expired";
         if(why == "" && !IsProt()) { string b = BlockedNow(s); if(StringFind(b, "news") == 0) why = b; }   // Kevin best: news only blocks new orders
         if(why != "" && OrderDelete(OrderTicket())) { gCancelled++; Print("Cancelled ", s, " limit: ", why); }
         continue;
        }
      // market order: never without a stop
      if(OrderStopLoss() == 0)
        {
         double cp = type == OP_BUY ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK);
         if(OrderClose(OrderTicket(), OrderLots(), cp, 5)) Print("Closed ", s, ": no stop loss");
         continue;
        }
      TrackFill(OrderTicket());
      if(EffManageOn()) ManageOpen(OrderTicket(), k, si);
     }
  }

// Mentor's management, in order (lessons 6, 8 and the Confirmation webinar):
//  1. +1R  -> stop to -0.5R (half the risk)
//  2. +2R (or +1R) -> stop to break-even + spread
//  3. each new fresh entry-TF zone that forms in our favour after the fill -> stop just beyond its distal line
//  4. optional: 25% off at 3R, the rest runs to the target
// The stop only ever moves in the trade's favour. Every change is printed with the reason.
datetime trailBar[]; int trailTicket[];
void ManageOpen(int ticket, int k, int si)
  {
   if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;
   string s = OrderSymbol(); int type = OrderType(); int dir = type == OP_BUY ? 1 : -1;
   int digits = (int)MarketInfo(s, MODE_DIGITS); double point = MarketInfo(s, MODE_POINT);
   double open = OrderOpenPrice(), sl = OrderStopLoss(), tp = OrderTakeProfit();
   double R = si >= 0 ? stRpts[si] * point : 0;
   if(R <= 0) return;
   double px = dir > 0 ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK);
   double gainR = dir * (px - open) / R;
   double spread = MarketInfo(s, MODE_ASK) - MarketInfo(s, MODE_BID);
   double stopLvl = MathMax(MarketInfo(s, MODE_STOPLEVEL), MarketInfo(s, MODE_FREEZELEVEL)) * point;
   double newSl = sl; string why = "";
   if(spread > InpMgmtMaxSpreadR * R) return;                           // wait out spread spikes (rollover / news)
   if(EffHalfRisk1R() && gainR >= 1.0)
     { double c = open - dir * 0.5 * R; if(dir * (c - newSl) > point) { newSl = c; why = "+1R reached -> risk cut to half (stop at -0.5R)"; } }
   double beTrig = EffBeTrig();
   double commPx = 0;                                                   // Kevin best: break-even also covers the commission
   if(IsProt()) { double tvx = MarketInfo(s, MODE_TICKVALUE), tsx = MarketInfo(s, MODE_TICKSIZE); if(tvx > 0 && tsx > 0 && OrderLots() > 0) commPx = MathAbs(OrderCommission()) / (OrderLots() * tvx) * tsx; }
   if(gainR >= beTrig)
     { double c = open + dir * (spread + commPx); if(dir * (c - newSl) > point) { newSl = c; why = StringFormat("+%.0fR reached -> stop to break-even", beTrig); } }
   if(EffTrailZones())
     {
      int etf = TF_E[k], ti = -1;
      for(int i = 0; i < ArraySize(trailTicket); i++) if(trailTicket[i] == ticket) ti = i;
      if(ti < 0) { ti = ArraySize(trailTicket); ArrayResize(trailTicket, ti + 1); ArrayResize(trailBar, ti + 1); trailTicket[ti] = ticket; trailBar[ti] = 0; }
      datetime b0 = iTime(s, etf, 0);
      if(trailBar[ti] != b0)                                         // once per new entry-TF candle
        {
         trailBar[ti] = b0;
         Zone z[]; int n = DetectZones(s, etf, z);
         for(int i = n - 1; i >= 0; i--)
           {
            if(z[i].dir != dir || z[i].removed || !z[i].cont) continue;
            if(z[i].tLeg <= OrderOpenTime()) break;                    // only zones formed after the fill
            double c = z[i].dist - dir * (InpStopBufferPts * point + (dir < 0 ? spread : 0));
            if(dir * (c - open) < 0) continue;                          // only trail into profit
            if(dir * (c - newSl) > point) { newSl = c; why = StringFormat("new %s %s zone formed -> stop under its distal line", TF_N[k], dir > 0 ? "demand" : "supply"); }
            break;
           }
        }
     }
   // apply: only in our favour and outside the broker's stop level
   if(why != "" && dir * (newSl - sl) > point && dir * (px - newSl) > stopLvl)
     {
      if(OrderModify(ticket, open, NormalizeDouble(newSl, digits), tp, 0)) Print("#", ticket, " ", s, " stop moved to ", DoubleToString(newSl, digits), " - ", why);
      else Print("#", ticket, " stop move failed ", GetLastError());
     }
   // 25% at 3R (once): only while the full original size is still open
   if(EffPartial3R() && gainR >= 3.0 && OrderSelect(ticket, SELECT_BY_TICKET) && StringFind(OrderComment(), "from #") < 0)
     {
      double step = MarketInfo(s, MODE_LOTSTEP), part = MathFloor(OrderLots() * 0.25 / step) * step;
      if(part >= MarketInfo(s, MODE_MINLOT) && OrderClose(ticket, part, px, 5)) Print("#", ticket, " ", s, " closed 25% at 3R");
     }
  }

//+------------------------------------------------------------------+
//| Variant replay (shadow management test on M1 data)              |
//+------------------------------------------------------------------+
void TrackFill(int ticket)
  {
   for(int i = 0; i < ArraySize(knownTickets); i++) if(knownTickets[i] == ticket) return;
   int n = ArraySize(knownTickets); ArrayResize(knownTickets, n + 1); knownTickets[n] = ticket;
   for(int i = 0; i < ArraySize(sims); i++) if(sims[i].ticket == ticket) return;
   if(!OrderSelect(ticket, SELECT_BY_TICKET)) return;
   string cm = OrderComment();
   double point = MarketInfo(OrderSymbol(), MODE_POINT);
   int si = StIdx(ticket);
   double Rp = si >= 0 ? stRpts[si] * point : 0;
   if(Rp <= 0) Rp = MathAbs(OrderOpenPrice() - OrderStopLoss());
   Sim m;
   m.ticket = ticket; m.sym = OrderSymbol(); int k = si >= 0 ? stK[si] : KOf(OrderMagicNumber()); if(k < 0 || k >= NTF) k = KOf(OrderMagicNumber()); m.tf = TF_N[k];
   m.method = OrderMagicNumber() - InpMagic >= 10 ? "CONF" : "SF"; m.grade = si >= 0 ? stG[si] : "";
   m.dir = OrderType() == OP_BUY ? 1 : -1; m.entry = OrderOpenPrice(); m.R = Rp; m.opp = OrderTakeProfit();
   m.t0 = OrderOpenTime(); m.tLast = 0; m.done = false;
   int s = ArraySize(sims); ArrayResize(sims, s + 1); sims[s] = m;
   SaveSims();
  }

// Replays every TP x BE variant over M1 bars from the fill. SL is assumed hit first when a bar touches both.
// Variant replay is incremental: each sim keeps its state and only new M1 bars are replayed,
// with a hard budget per call so MT4 never freezes (the old full replay could take many seconds).
double sRes[], sSl[]; bool sOpen[], sHalf[]; datetime sEx[]; string sWhy[]; bool sInit[]; int simPos = 0;
void UpdateSims()
  {
   int n = ArraySize(sims);
   if(n == 0 || TimeLocal() - startedAt < 120) return;              // let MT4 settle after start
   if(ArraySize(sInit) < n)
     {
      int o = ArraySize(sInit);
      ArrayResize(sInit, n); ArrayResize(sRes, n * NV); ArrayResize(sSl, n * NV); ArrayResize(sOpen, n * NV); ArrayResize(sHalf, n * NV); ArrayResize(sEx, n * NV); ArrayResize(sWhy, n * NV);
      for(int i = o; i < n; i++) sInit[i] = false;
     }
   uint t0 = GetTickCount();
   bool changed = false;
   for(int c = 0; c < n && GetTickCount() - t0 < 80; c++)
     {
      int i = (simPos + c) % n;
      if(sims[i].done) continue;
      if(!sInit[i])
        {
         for(int v = 0; v < NV; v++) { int q = i * NV + v; sRes[q] = 0; sEx[q] = 0; sWhy[q] = ""; sOpen[q] = true; sSl[q] = sims[i].entry - sims[i].dir * sims[i].R; sHalf[q] = false; }
         sims[i].tLast = 0; sInit[i] = true;
        }
      datetime horizon = sims[i].t0 + InpSimDays * 86400;
      int start = sims[i].tLast == 0 ? iBarShift(sims[i].sym, PERIOD_M1, sims[i].t0) : iBarShift(sims[i].sym, PERIOD_M1, sims[i].tLast) - 1;
      if(start < 0) continue;
      int dir = sims[i].dir; double e = sims[i].entry, R = sims[i].R;
      if(R <= 0) { sims[i].done = true; continue; }
      int stop = MathMax(1, start - 1500);                           // at most 1500 M1 bars per sim per call
      for(int sh = start; sh >= stop; sh--)
        {
         datetime tt = iTime(sims[i].sym, PERIOD_M1, sh);
         if(tt > horizon) break;
         double hi = iHigh(sims[i].sym, PERIOD_M1, sh), lo = iLow(sims[i].sym, PERIOD_M1, sh);
         double fav = dir > 0 ? (hi - e) / R : (e - lo) / R;
         double adv = dir > 0 ? (lo - e) / R : (e - hi) / R;
         for(int v = 0; v < NV; v++)
           {
            int q = i * NV + v;
            if(!sOpen[q]) continue;
            int tpv = v / 4, bev = v % 4;
            double slR = dir > 0 ? (sSl[q] - e) / R : (e - sSl[q]) / R;
            if(adv <= slR) { sRes[q] += (sHalf[q] ? 0.75 : 1.0) * slR; sOpen[q] = false; sEx[q] = tt; sWhy[q] = slR >= 0 ? "BE/locked" : "SL"; continue; }
            double tpR = tpv == 1 ? 2 : (tpv == 2 ? 3 : (tpv == 3 ? 5 : (sims[i].opp > 0 ? MathAbs(sims[i].opp - e) / R : 99)));
            if(tpv == 4 && !sHalf[q] && fav >= 3) { sRes[q] += 0.25 * 3; sHalf[q] = true; }
            if(fav >= tpR) { sRes[q] += (sHalf[q] ? 0.75 : 1.0) * tpR; sOpen[q] = false; sEx[q] = tt; sWhy[q] = "TP"; continue; }
            if(bev == 1 && fav >= 1 && slR < 0) sSl[q] = e;
            if(bev == 2 && fav >= 2 && slR < 0) sSl[q] = e;
            if(bev == 3 && fav >= 2 && slR < 0.5) sSl[q] = e + dir * 0.5 * R;
           }
         sims[i].tLast = tt;
        }
      bool all = true;
      for(int v = 0; v < NV; v++) if(sOpen[i * NV + v]) all = false;
      if(all || TimeCurrent() > horizon)
        {
         double last = dir > 0 ? MarketInfo(sims[i].sym, MODE_BID) : MarketInfo(sims[i].sym, MODE_ASK);
         for(int v = 0; v < NV; v++)
           {
            int q = i * NV + v;
            if(sOpen[q]) { sRes[q] += (sHalf[q] ? 0.75 : 1.0) * (dir > 0 ? (last - e) / R : (e - last) / R); sEx[q] = TimeCurrent(); sWhy[q] = "horizon"; }
            LogVariant(sims[i], TP_N[v / 4], BE_N[v % 4], sRes[q], sEx[q], sWhy[q]);
           }
         sims[i].done = true; changed = true;
        }
     }
   simPos = (simPos + 1) % n;
   if(changed) SaveSims();
  }

double iBid(string s) { return MarketInfo(s, MODE_BID); }
double iAsk(string s) { return MarketInfo(s, MODE_ASK); }

void SaveSims()
  {
   int f = FileOpen(PairFile("RamanFX_Bot_Sims", ".dat"), FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   for(int i = 0; i < ArraySize(sims); i++)
      if(!sims[i].done)
         FileWrite(f, sims[i].ticket, sims[i].sym, sims[i].tf, sims[i].method, sims[i].grade, sims[i].dir,
                   DoubleToString(sims[i].entry, 6), DoubleToString(sims[i].R, 6), DoubleToString(sims[i].opp, 6), (long)sims[i].t0);
   FileClose(f);
  }

void LoadSims()
  {
   ArrayResize(sims, 0); ArrayResize(sInit, 0); simPos = 0;
   int f = FileOpen(PairFile("RamanFX_Bot_Sims", ".dat"), FILE_READ | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   while(!FileIsEnding(f))
     {
      Sim m;
      m.ticket = (int)StringToInteger(FileReadString(f));
      if(m.ticket == 0) break;
      m.sym = FileReadString(f); m.tf = FileReadString(f); m.method = FileReadString(f); m.grade = FileReadString(f);
      m.dir = (int)StringToInteger(FileReadString(f));
      m.entry = StringToDouble(FileReadString(f)); m.R = StringToDouble(FileReadString(f)); m.opp = StringToDouble(FileReadString(f));
      m.t0 = (datetime)StringToInteger(FileReadString(f)); m.tLast = 0; m.done = false;
      int n = ArraySize(sims); ArrayResize(sims, n + 1); sims[n] = m;
      int t = ArraySize(knownTickets); ArrayResize(knownTickets, t + 1); knownTickets[t] = m.ticket;
     }
   FileClose(f);
  }

//+------------------------------------------------------------------+
//| Logs                                                             |
//+------------------------------------------------------------------+
void EnsureHeaders()
  {
   if(!FileIsExist("RamanFX_Bot_Signals.csv"))
     {
      int f = FileOpen("RamanFX_Bot_Signals.csv", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
      if(f != INVALID_HANDLE) { FileWrite(f, "Time", "Symbol", "EntryTF", "HTF", "Side", "Type", "Grade", "LegRatio", "BaseCandles", "Proximal", "Distal", "Entry", "SL", "TP", "RR", "HtfTrend", "CurvePct", "Method", "SpreadPts", "Decision", "Reason", "LiquidityTrap", "OnSRLevel"); FileClose(f); }
     }
   if(!FileIsExist("RamanFX_Bot_Variants.csv"))
     {
      int f = FileOpen("RamanFX_Bot_Variants.csv", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
      if(f != INVALID_HANDLE) { FileWrite(f, "Ticket", "Symbol", "EntryTF", "Method", "Grade", "Side", "OpenTime", "Entry", "R", "TPVariant", "BEVariant", "ResultR", "ExitTime", "Exit"); FileClose(f); }
     }
  }

int OpenAppend(string name)
  {
   int f = FileOpen(name, FILE_READ | FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(f != INVALID_HANDLE) FileSeek(f, 0, SEEK_END);
   return f;
  }

// Signals are kept in memory and written once a minute in one go; a zone is logged again only when its decision changes.
string sigBuf[]; string sigKey[]; string sigLast[]; datetime lastFlush = 0;
void LogSignal(string s, int k, Zone &z, double entry, double sl, double tp, double rr, int trend, double curve, string method, double spreadPts, string decision, string reason, int digits)
  {
   if(decision == "SKIP" && !InpLogSkips) return;                       // keep the log small: orders only by default
   string key = s + TF_N[k] + DoubleToString(z.prox, digits), state = decision + reason;
   int ki = -1;
   for(int i = 0; i < ArraySize(sigKey); i++) if(sigKey[i] == key) { ki = i; break; }
   if(ki >= 0 && sigLast[ki] == state) return;                           // same zone, same verdict: nothing new
   if(ki < 0) { ki = ArraySize(sigKey); ArrayResize(sigKey, ki + 1); ArrayResize(sigLast, ki + 1); sigKey[ki] = key; if(ki > 3000) { ArrayResize(sigKey, 0); ArrayResize(sigLast, 0); ki = 0; ArrayResize(sigKey, 1); ArrayResize(sigLast, 1); sigKey[0] = key; } }
   sigLast[ki] = state;
   string line = StringFormat("%s,%s,%s,%s,%s,%s,%s,%s,%d,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s",
                 TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES), s, TF_N[k], TfName(TF_H[k]), z.dir > 0 ? "BUY" : "SELL", z.dir > 0 ? "RBR" : "DBD", z.grade,
                 DoubleToString(z.legRatio, 2), z.baseN, DoubleToString(z.prox, digits), DoubleToString(z.dist, digits),
                 DoubleToString(entry, digits), DoubleToString(sl, digits), DoubleToString(tp, digits), DoubleToString(rr, 2),
                 trend > 0 ? "up" : (trend < 0 ? "down" : "side"), DoubleToString(curve, 0), method, DoubleToString(spreadPts, 0), decision, reason,
                 z.trap > 0 ? DoubleToString(z.trap, digits) : "", z.crowded ? "yes" : "");
   int n = ArraySize(sigBuf); ArrayResize(sigBuf, n + 1); sigBuf[n] = line;
  }
void FlushSignals(bool force)
  {
   if(!ArraySize(sigBuf) || (!force && TimeLocal() - lastFlush < 60)) return;
   lastFlush = TimeLocal();
   int f = FileOpen("RamanFX_Bot_Signals.csv", FILE_READ | FILE_WRITE | FILE_TXT | FILE_ANSI | FILE_SHARE_READ);
   if(f == INVALID_HANDLE) return;
   FileSeek(f, 0, SEEK_END);
   for(int i = 0; i < ArraySize(sigBuf); i++) FileWriteString(f, sigBuf[i] + "\r\n");
   FileClose(f);
   ArrayResize(sigBuf, 0);
  }

void LogVariant(Sim &m, string tpv, string bev, double r, datetime ex, string why)
  {
   int f = OpenAppend("RamanFX_Bot_Variants.csv");
   if(f == INVALID_HANDLE) return;
   FileWrite(f, m.ticket, m.sym, m.tf, m.method, m.grade, m.dir > 0 ? "BUY" : "SELL", TimeToString(m.t0, TIME_DATE | TIME_MINUTES),
             DoubleToString(m.entry, 5), DoubleToString(m.R, 6), tpv, bev, DoubleToString(r, 2), TimeToString(ex, TIME_DATE | TIME_MINUTES), why);
   FileClose(f);
  }

string TfName(int tf)
  {
   switch(tf) { case PERIOD_M1: return "M1"; case PERIOD_M5: return "M5"; case PERIOD_M15: return "M15"; case PERIOD_H1: return "H1"; case PERIOD_H4: return "H4"; case PERIOD_D1: return "D1"; case PERIOD_W1: return "W1"; case PERIOD_MN1: return "MN"; }
   return IntegerToString(tf);
  }

//+------------------------------------------------------------------+
//| Drawing (this chart's symbol and timeframe)                      |
//+------------------------------------------------------------------+
void DrawZones(Zone &z[])
  {
   ObjectsDeleteAll(0, "RFXZ_");
   for(int i = 0; i < ArraySize(z); i++)
     {
      if(z[i].removed || z[i].legBar > InpMaxZoneAge) continue;
      string nm = "RFXZ_" + IntegerToString(i);
      color c = z[i].dir > 0 ? (z[i].tested ? clrDarkGreen : clrSeaGreen) : (z[i].tested ? clrMaroon : clrIndianRed);
      ObjectCreate(0, nm, OBJ_RECTANGLE, 0, iTime(_Symbol, _Period, z[i].legBar + z[i].baseN), z[i].prox, TimeCurrent() + PeriodSeconds() * 20, z[i].dist);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
      ObjectSetInteger(0, nm, OBJPROP_BACK, true);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, StringFormat("%s %s grade %s  leg %.1fx  base %d%s", z[i].dir > 0 ? "Demand" : "Supply", z[i].cont ? (z[i].dir > 0 ? "RBR" : "DBD") : (z[i].dir > 0 ? "DBR" : "RBD"), z[i].grade, z[i].legRatio, z[i].baseN, z[i].tested ? " (tested)" : ""));
     }
   NoSelect(0, "RFXZ_");
  }

//+------------------------------------------------------------------+
//| Approve mode: one button per proposal                            |
//+------------------------------------------------------------------+
string PropFile() { return "RamanFX_Advice_" + _Symbol + ".csv"; }
// advisories survive timeframe switches and MT4 restarts (written only when the list changes)
void SaveProps()
  {
   int f = FileOpen(PropFile(), FILE_WRITE | FILE_TXT | FILE_ANSI);
   if(f == INVALID_HANDLE) return;
   for(int i = 0; i < ArraySize(props); i++)
     {
      string inf = props[i].info; StringReplace(inf, "\n", "~"); StringReplace(inf, "\t", " ");
      FileWriteString(f, StringFormat("P\t%s\t%d\t%d\t%.6f\t%.6f\t%.6f\t%.6f\t%s\t%s\t%.2f\t%d\t%.6f\t%d\t%d\t%s\r\n", props[i].sym, props[i].k, props[i].dir, props[i].entry, props[i].sl, props[i].tp, props[i].dist, props[i].method, props[i].grade, props[i].rr, props[i].trap ? 1 : 0, props[i].prox, (int)props[i].tZone, (int)props[i].t, inf));
     }
   for(int i = 0; i < ArraySize(dSym); i++) FileWriteString(f, StringFormat("D2\t%s\t%d\t%s\t%d\t%d\r\n", dSym[i], dK[i], dProx[i], (int)dTime[i], dMy[i] ? 1 : 0));
   FileClose(f);
  }
void LoadProps()
  {
   ArrayResize(props, 0);
   ArrayResize(dSym, 0); ArrayResize(dK, 0); ArrayResize(dProx, 0); ArrayResize(dTime, 0); ArrayResize(dMy, 0);
   int f = FileOpen(PropFile(), FILE_READ | FILE_TXT | FILE_ANSI);
   if(f == INVALID_HANDLE) return;
   while(!FileIsEnding(f))
     {
      string ln = FileReadString(f), c[];
      int n = StringSplit(ln, '\t', c);
      if(n >= 6 && c[0] == "D2")                                         // old "D" lines (never expired) are dropped
        {
         int dk = (int)StringToInteger(c[2]);
         if(dk < 0 || dk >= NTF || c[1] == "") continue;
         int d = ArraySize(dSym); ArrayResize(dSym, d + 1); ArrayResize(dK, d + 1); ArrayResize(dProx, d + 1); ArrayResize(dTime, d + 1); ArrayResize(dMy, d + 1);
         dSym[d] = c[1]; dK[d] = dk; dProx[d] = c[3]; dTime[d] = (datetime)StringToInteger(c[4]); dMy[d] = StringToInteger(c[5]) == 1;
         continue;
        }
      if(n < 16 || c[0] != "P") continue;
      Proposal p; p.sym = c[1]; p.k = (int)StringToInteger(c[2]); p.dir = (int)StringToInteger(c[3]);
      if(p.sym == "" || p.k < 0 || p.k >= NTF || (p.dir != 1 && p.dir != -1)) continue;
      p.entry = StringToDouble(c[4]); p.sl = StringToDouble(c[5]); p.tp = StringToDouble(c[6]); p.dist = StringToDouble(c[7]);
      p.method = c[8]; p.grade = c[9]; p.rr = StringToDouble(c[10]); p.trap = c[11] == "1"; p.prox = StringToDouble(c[12]);
      p.tZone = (datetime)StringToInteger(c[13]); p.t = (datetime)StringToInteger(c[14]); p.info = c[15]; StringReplace(p.info, "~", "\n");
      int m = ArraySize(props); ArrayResize(props, m + 1); props[m] = p;
     }
   FileClose(f);
   if(ExpireDismissed()) SaveProps();
  }

// ---- denied advice: skipped by Scan (so the next-best zone is advised), expires after 3 days or when its zone goes ----
bool IsDismissed(string s, int k, double prox, bool my)
  {
   string px = DoubleToString(prox, 6);
   for(int d = 0; d < ArraySize(dSym); d++) if(dSym[d] == s && dK[d] == k && dMy[d] == my && dProx[d] == px) return true;
   return false;
  }
void AddDismissed(string s, int k, double prox, bool my)
  {
   if(IsDismissed(s, k, prox, my)) return;
   int d = ArraySize(dSym); ArrayResize(dSym, d + 1); ArrayResize(dK, d + 1); ArrayResize(dProx, d + 1); ArrayResize(dTime, d + 1); ArrayResize(dMy, d + 1);
   dSym[d] = s; dK[d] = k; dProx[d] = DoubleToString(prox, 6); dTime[d] = TimeCurrent(); dMy[d] = my;
  }
void DropDismissed(int d)
  {
   int n = ArraySize(dSym);
   if(d < 0 || d >= n) return;
   for(int j = d; j < n - 1; j++) { dSym[j] = dSym[j + 1]; dK[j] = dK[j + 1]; dProx[j] = dProx[j + 1]; dTime[j] = dTime[j + 1]; dMy[j] = dMy[j + 1]; }
   ArrayResize(dSym, n - 1); ArrayResize(dK, n - 1); ArrayResize(dProx, n - 1); ArrayResize(dTime, n - 1); ArrayResize(dMy, n - 1);
  }
bool ExpireDismissed()
  {
   bool ch = false;
   for(int d = ArraySize(dSym) - 1; d >= 0; d--) if(TimeCurrent() - dTime[d] > 3 * 86400) { DropDismissed(d); ch = true; }
   return ch;
  }
// a denied scanner zone that is no longer live (removed / consumed / out of the lookback) is forgotten
bool PruneDismissed(string s, int k, Zone &z[], int n)
  {
   bool ch = false;
   for(int d = ArraySize(dSym) - 1; d >= 0; d--)
     {
      if(dMy[d] || dSym[d] != s || dK[d] != k) continue;
      bool live = false;
      for(int i = 0; i < n && !live; i++) if(!z[i].removed && !z[i].consumed && DoubleToString(z[i].prox, 6) == dProx[d]) live = true;
      if(!live) { DropDismissed(d); ch = true; }
     }
   return ch;
  }

// true when the advice is new or changed (caller alerts only then)
bool AddProposal(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade, double rr, bool trap, string info, double prox, datetime tZone)
  {
   if(IsDismissed(s, k, prox, method == "MY")) return false;
   for(int i = 0; i < ArraySize(props); i++) if(props[i].sym == s && props[i].k == k)
     {
      if(props[i].method == "MY" && method != "MY") return false;                 // your own zone keeps its slot
      double tol = 2 * MarketInfo(s, MODE_ASK) - 2 * MarketInfo(s, MODE_BID) + MarketInfo(s, MODE_POINT);
      if(props[i].dir == dir && MathAbs(props[i].prox - prox) <= tol && MathAbs(props[i].sl - sl) <= tol && MathAbs(props[i].tp - tp) <= tol) return false;   // same zone (spread jitter): keep it, no redraw
      props[i].dir = dir; props[i].entry = entry; props[i].sl = sl; props[i].tp = tp; props[i].rr = rr; props[i].info = info; props[i].prox = prox; props[i].dist = dist; props[i].tZone = tZone; props[i].grade = grade; props[i].method = method; props[i].trap = trap; props[i].t = TimeCurrent();
      SaveProps(); lastPanelSig = "-";
      if(k == viewK && s == _Symbol) DrawView(i);                               // the chart always shows what Approve would place
      return true;
     }
   Proposal p; p.sym = s; p.k = k; p.dir = dir; p.entry = entry; p.sl = sl; p.tp = tp; p.dist = dist; p.method = method; p.grade = grade; p.rr = rr; p.trap = trap; p.info = info; p.prox = prox; p.tZone = tZone; p.t = TimeCurrent();
   int n = ArraySize(props); ArrayResize(props, n + 1); props[n] = p;
   SaveProps();
   return true;
  }

void DropProposal(int i)
  {
   int n = ArraySize(props);
   if(i < 0 || i >= n) return;
   for(int j = i; j < n - 1; j++) props[j] = props[j + 1];
   ArrayResize(props, n - 1); SaveProps();
  }

// Advisory panel (top-right): [Refresh PAIR] then one row per timeframe advice:
// [M15 BUY VP A75 1:2.9]  [View]  [Approve]  [Deny]
// Buttons are created once and only updated afterwards (never deleted / recreated on a timer tick).
void DrawProposals()
  {
   for(int i = ArraySize(props) - 1; i >= 0; i--)
     {
      // advice ends when its zone is broken, an order exists, or price is already past the entry
      Proposal p = props[i];
      double bid = MarketInfo(p.sym, MODE_BID), ask = MarketInfo(p.sym, MODE_ASK), c1 = iClose(p.sym, TF_E[p.k], 1);
      if(bid <= 0 || ask <= 0) continue;                                 // no quote yet (start-up): keep the advice
      bool broke = c1 > 0 && (p.dir > 0 ? c1 < p.dist : c1 > p.dist);    // c1 = 0: history not loaded yet
      bool gone = HasOrder(p.sym, p.k) || broke || (p.dir > 0 && (ask <= p.entry || (p.tp > 0 && bid >= p.entry + 0.8 * (p.tp - p.entry)))) || (p.dir < 0 && (bid >= p.entry || (p.tp > 0 && ask <= p.entry - 0.8 * (p.entry - p.tp))));
      if(gone) { if(p.k == viewK && p.sym == _Symbol) ClearView(); DropProposal(i); }
     }
   int W = (int)ChartGetInteger(0, CHART_WIDTH_IN_PIXELS), x0 = MathMax(10, W - 12 - 392);
   string sig = IntegerToString(viewK) + "|" + IntegerToString(W);
   for(int i = 0; i < ArraySize(props); i++) sig += "|" + props[i].sym + TF_N[props[i].k] + IntegerToString(props[i].dir) + props[i].method + DoubleToString(props[i].prox, 6) + DoubleToString(props[i].rr, 1) + props[i].grade + (props[i].trap ? "t" : "");
   if(sig == lastPanelSig) return;
   lastPanelSig = sig;
   keep = "|";
   // right side, under the bot's status lines (max 5 lines from y 20): nothing overlaps
   int y = 112;
   Btn("RFXB_r0", "Refresh " + _Symbol + (ArraySize(props) == 0 ? "  (no advice yet)" : StringFormat("  (%d advice)", ArraySize(props))), x0, y, 392, clrDarkSlateGray);
   y += 26;
   // rows sorted by timeframe M1 .. W1; button names carry timeframe AND symbol, so a click always hits the right advice
   for(int k = 0; k < NTF; k++)
      for(int i = 0; i < ArraySize(props); i++)
        {
         if(props[i].k != k) continue;
         string sc = ""; int at = StringFind(props[i].info, "(grade ");
         int to = at >= 0 ? StringFind(props[i].info, ")", at) : -1;
         if(at >= 0 && to > at + 7) sc = StringSubstr(props[i].info, at + 7, to - at - 7);
         StringReplace(sc, " ", "");
         string txt = StringFormat("%s %s %s %s 1:%.1f%s", (props[i].sym == _Symbol ? "" : props[i].sym + " ") + TF_N[k], props[i].dir > 0 ? "BUY" : "SELL", props[i].method == "MY" ? "YOURS" : (StringFind(props[i].info, " VP ") >= 0 ? "VP" : "CP"), sc == "" ? props[i].grade : sc, props[i].rr, props[i].trap ? " trap" : "");
         bool on = viewK == k && props[i].sym == _Symbol;
         string ks = IntegerToString(k) + "_" + props[i].sym;
         Btn("RFXB_t" + ks, (on ? "> " : "") + txt, x0, y, 210, props[i].dir > 0 ? C'30,110,70' : C'150,45,45');
         Btn("RFXB_v" + ks, "View", x0 + 214, y, 50, on ? clrDarkOrange : clrDimGray);
         Btn("RFXB_p" + ks, "Approve", x0 + 268, y, 66, clrRoyalBlue);
         Btn("RFXB_x" + ks, "Deny", x0 + 338, y, 54, clrGray);
         y += 26;
        }
   panelBottom = y + 6;
   for(int o = ObjectsTotal(0, -1, -1) - 1; o >= 0; o--)               // remove buttons of advice that is gone
     {
      string nm = ObjectName(0, o);
      if(StringFind(nm, "RFXB_") == 0 && StringFind(keep, "|" + nm + "|") < 0) ObjectDelete(0, nm);
     }
   // reasoning of the advice being viewed, right under the list
   ObjectsDeleteAll(0, "RFXN2_");
   if(viewK >= 0)
      for(int i = 0; i < ArraySize(props); i++) if(props[i].k == viewK && props[i].sym == _Symbol)
        {
         string ls[]; int n = StringSplit(props[i].info, '\n', ls);
         for(int j = 0; j < n; j++) RightLabel(0, "RFXN2_" + IntegerToString(j), ls[j], panelBottom + j * 14, j == 0 ? clrRoyalBlue : clrDimGray, 8);
        }
   ChartRedraw(0);
  }
void Btn(string nm, string text, int x, int y, int w, color bg)
  {
   keep += nm + "|";
   if(ObjectFind(0, nm) < 0)
     {
      ObjectCreate(0, nm, OBJ_BUTTON, 0, 0, 0);
      ObjectSetInteger(0, nm, OBJPROP_STATE, false);
      ObjectSetInteger(0, nm, OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetString(0, nm, OBJPROP_FONT, "Arial"); ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 8);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, clrWhite);
     }
   // the press state is never touched here: only Click() resets it, so no press is swallowed by a redraw
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, nm, OBJPROP_SELECTED, false);
   ObjectSetInteger(0, nm, OBJPROP_HIDDEN, true); ObjectSetInteger(0, nm, OBJPROP_BACK, false); ObjectSetInteger(0, nm, OBJPROP_ZORDER, 100);
   ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, x); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, y);
   ObjectSetInteger(0, nm, OBJPROP_XSIZE, w); ObjectSetInteger(0, nm, OBJPROP_YSIZE, 22);
   ObjectSetString(0, nm, OBJPROP_TEXT, text);
   ObjectSetInteger(0, nm, OBJPROP_BGCOLOR, bg);
  }

void ClearView() { ObjectsDeleteAll(0, "RFXP_"); ObjectsDeleteAll(0, "RFXN2_"); viewK = -1; GlobalVariableDel("RFX_view_" + _Symbol); }
// Draws the advice (zone, entry, stop, target) on THIS chart.
void DrawView(int i)
  {
   if(i < 0 || i >= ArraySize(props)) return;
   Proposal p = props[i];
   ObjectsDeleteAll(0, "RFXP_");
   viewK = p.k;
   GlobalVariableSet("RFX_view_" + _Symbol, p.k);
   string pre = "RFXP_";
   int sec = PeriodSeconds(TF_E[p.k]);
   datetime t1 = p.tZone, t2 = TimeCurrent() + sec * 20;
   ObjectCreate(0, pre + "z", OBJ_RECTANGLE, 0, t1, p.prox, t2, p.dist);
   ObjectSetInteger(0, pre + "z", OBJPROP_COLOR, p.dir > 0 ? C'190,225,200' : C'245,205,195'); ObjectSetInteger(0, pre + "z", OBJPROP_BACK, true);
   ObjectSetInteger(0, pre + "z", OBJPROP_SELECTABLE, false);
   string nm[3] = {"e", "s", "t"}; double pr[3]; pr[0] = p.entry; pr[1] = p.sl; pr[2] = p.tp;
   color cl[3] = {clrRoyalBlue, clrCrimson, clrSeaGreen}; string lb[3] = {"entry", "stop", "target"};
   int dg = (int)MarketInfo(p.sym, MODE_DIGITS);
   for(int j = 0; j < 3; j++)
     {
      ObjectCreate(0, pre + nm[j], OBJ_TREND, 0, t1, pr[j], t2, pr[j]);
      ObjectSetInteger(0, pre + nm[j], OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, pre + nm[j], OBJPROP_COLOR, cl[j]); ObjectSetInteger(0, pre + nm[j], OBJPROP_STYLE, j == 0 ? STYLE_SOLID : STYLE_DASH);
      ObjectSetInteger(0, pre + nm[j], OBJPROP_SELECTABLE, false);
      ObjectCreate(0, pre + nm[j] + "l", OBJ_TEXT, 0, t2, pr[j]);
      ObjectSetString(0, pre + nm[j] + "l", OBJPROP_TEXT, " " + TF_N[p.k] + " " + lb[j] + " " + DoubleToString(pr[j], dg));
      ObjectSetInteger(0, pre + nm[j] + "l", OBJPROP_COLOR, cl[j]); ObjectSetInteger(0, pre + nm[j] + "l", OBJPROP_FONTSIZE, 8); ObjectSetInteger(0, pre + nm[j] + "l", OBJPROP_ANCHOR, ANCHOR_LEFT);
     }
   NoSelect(0, pre);
  }
// View: draws the advice on THIS chart and switches it to the advice's timeframe; the panel stays,
// so you check the chart and press Approve or Deny on the same screen.
void ViewProposal(int i)
  {
   if(props[i].sym != _Symbol) { Alert("RamanFX ZoneBot: open a ", props[i].sym, " chart to view this advice"); lastPanelSig = "-"; DrawProposals(); return; }
   int tf = TF_E[props[i].k];
   DrawView(i);
   lastPanelSig = "-";
   DrawProposals();
   ChartRedraw(0);
   if(_Period != tf) ChartSetSymbolPeriod(0, _Symbol, tf);   // drawings stay; the bot reloads on the new timeframe (OnInit restores the view)
  }

// Clears the advice and rescans this pair on every timeframe right away (other pairs follow on the timer).
void Refresh()
  {
   ClearView();
   ArrayResize(props, 0); SaveProps();
   if(ArrayRange(lastBar, 0) != ArraySize(syms)) ArrayResize(lastBar, ArraySize(syms));
   for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < NTF; k++) lastBar[i][k] = 0;
   lastPanelSig = "-"; lastMine = 0;
   Print("ZoneBot: refreshing ", _Symbol, " on every timeframe");
   uint w0 = GetTickCount();
   for(int i = 0; i < ArraySize(syms); i++)
     {
      if(syms[i] != _Symbol) continue;
      for(int k = 0; k < NTF && GetTickCount() - w0 < 2500; k++)
        {
         if(!TfOn(k)) continue;
         datetime t = iTime(syms[i], TF_E[k], 0);
         if(t == 0) continue;                                           // history not loaded yet: the timer retries
         lastBar[i][k] = t;
         Scan(syms[i], k); scans++; lastScanAt = TimeCurrent();
        }
     }
  }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id == CHARTEVENT_CHART_CHANGE) { if(gMode == MODE_APPROVE) DrawProposals(); return; }   // resized: the width is in the panel signature
   if(id != CHARTEVENT_OBJECT_CLICK || StringFind(sparam, "RFXB_") != 0) return;
   // the timer poll may already have handled this very press (state reset): don't run it twice
   bool pressed = ObjectGetInteger(0, sparam, OBJPROP_STATE) != 0;
   if(!pressed && sparam == lastClickNm && GetTickCount() - lastClickMs < 5000) return;
   HandleClick(sparam);
  }
void HandleClick(string sparam)
  {
   if(busy) return;
   busy = true;
   Click(sparam);
   busy = false;
   lastClickNm = sparam; lastClickMs = GetTickCount();
  }
void Click(string sparam)
  {
   string act = StringSubstr(sparam, 5, 1);
   ObjectSetInteger(0, sparam, OBJPROP_STATE, false);
   Print("ZoneBot: button ", sparam, " pressed");
   if(ObjectFind(0, sparam) >= 0) { ObjectSetString(0, sparam, OBJPROP_TEXT, act == "r" ? "Refreshing " + _Symbol + " ..." : "..."); ChartRedraw(0); }   // instant feedback
   if(act == "r") { Refresh(); Work(); lastPanelSig = "-"; DrawProposals(); return; }
   int k = (int)StringToInteger(StringSubstr(sparam, 6, 1)), i = -1;
   string sy = StringLen(sparam) > 8 ? StringSubstr(sparam, 8) : _Symbol;
   for(int j = 0; j < ArraySize(props); j++) if(props[j].k == k && props[j].sym == sy) { i = j; break; }
   if(i < 0)
     {
      if(act == "p") Alert("RamanFX ZoneBot: order NOT placed - this advice is no longer valid (zone broken, price moved or advice replaced). Press Refresh.");
      lastPanelSig = "-"; DrawProposals(); return;
     }
   if(act == "v" || act == "t") { ViewProposal(i); return; }
   if(act == "p")
     {
      string sym = props[i].sym, tfn = TF_N[props[i].k]; int dir = props[i].dir; double entry = props[i].entry;
      if(!Place(sym, props[i].k, dir, entry, props[i].sl, props[i].tp, props[i].dist, props[i].method, props[i].grade, props[i].rr, props[i].trap, props[i].info, props[i].prox, props[i].tZone))
         Alert("RamanFX ZoneBot: ", sym, " ", tfn, " order NOT placed - ", placeErr == "" ? "unknown reason (see Experts tab)" : placeErr);   // advice kept so you can try again
      else
        {
         Alert("RamanFX ZoneBot: order placed - ", sym, " ", tfn, " ", dir > 0 ? "BUY LIMIT" : "SELL LIMIT", " @ ", DoubleToString(entry, (int)MarketInfo(sym, MODE_DIGITS)));
         if(props[i].k == viewK && sym == _Symbol) ClearView();
         DropProposal(i);
        }
     }
   else if(act == "x")
     {
      string sym = props[i].sym; int kk = props[i].k;
      AddDismissed(sym, kk, props[i].prox, props[i].method == "MY");
      Print("ZoneBot: denied ", sym, " ", TF_N[kk], " zone ", DoubleToString(props[i].prox, (int)MarketInfo(sym, MODE_DIGITS)), " - looking for the next one");
      if(kk == viewK && sym == _Symbol) ClearView();
      DropProposal(i);
      int si = SymIdx(sym);                                              // rescan that timeframe now: the next-best zone is advised
      if(si >= 0 && si < ArrayRange(lastBar, 0) && TfOn(kk))
        {
         datetime t = iTime(sym, TF_E[kk], 0);
         lastBar[si][kk] = t;
         if(t > 0) Scan(sym, kk);
        }
     }
   lastPanelSig = "-";
   DrawProposals();
  }
//+------------------------------------------------------------------+

//+------------------------------------------------------------------+
//| Backtest report (Strategy Tester, called from OnDeinit)          |
//|  KPIs computed with the SAME formulas as the RamanFX journal     |
//|  (src/core/stats.ts), overall and grouped by entry timeframe,    |
//|  grade, entry type, side, session, weekday, hold time and R.     |
//|  Files (tester\files):                                           |
//|   RamanFX_Backtest_<sym>.csv           one row per trade          |
//|   RamanFX_Backtest_<sym>_KPIs.csv      overall + every group      |
//|   RamanFX_Backtest_<sym>_Statement.htm MT4 statement -> journal   |
//|   RamanFX_Backtest_<sym>_Exits.csv     initial SL/TP -> journal R |
//+------------------------------------------------------------------+
#define KNA -1.0e100                                                  // "not available" (no losses, too few days...)
struct BTrade
  {
   int      ticket, jid, dir, k, outcome;                             // outcome +1 win, -1 loss, 0 breakeven (|net| < 0.01)
   string   sym, grade, method, sess, why, rsrc;
   datetime ot, ct;
   double   op, cp, sl0, tp0, lots, profit, comm, swap, net, R, hold;  // hold in minutes
   bool     hasR;
  };
struct KStat
  {
   int      n, wins, losses, be, rN, cw, cl, days, green, red, sdays;
   double   net, gw, gl, wr, pf, avgW, avgL, payoff, beWR, ex, avgR, totR, bigW, bigL, holdW, holdL;
   double   dd, ddPct, rf, dayWR, bestDay, worstDay, avgDay, sharpe, sortino, score, sEdge, sPf, sPay, sDd, sCons;
   datetime bestD, worstD;
  };
// initial stop / target of every order the bot placed this run (exact prices for the journal's R)
int bsT[]; double bsSl[], bsTp[];
void RecordInit(int t, double sl, double tp)
  {
   int n = ArraySize(bsT); ArrayResize(bsT, n + 1); ArrayResize(bsSl, n + 1); ArrayResize(bsTp, n + 1);
   bsT[n] = t; bsSl[n] = sl; bsTp[n] = tp;
  }
int InitIdx(int t) { for(int i = 0; i < ArraySize(bsT); i++) if(bsT[i] == t) return i; return -1; }

// Kevin best: one order per zone across all timeframes. Returns the ticket of a live bot order (pending or open)
// in this direction whose entry .. distal range overlaps the zone's proximal .. distal range, or -1.
int ZoneOrder(string s, int dir, double prox, double dist)
  {
   double tol = MathMax(MarketInfo(s, MODE_ASK) - MarketInfo(s, MODE_BID), 0);   // buy entries sit one spread above the proximal
   double cLo = MathMin(prox, dist) - tol, cHi = MathMax(prox, dist) + tol;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS) || OrderSymbol() != s || !OurMagic(OrderMagicNumber())) continue;
      int od = OrderType() % 2 == 0 ? 1 : -1;                               // OP_BUY / BUYLIMIT / BUYSTOP are even
      if(od != dir) continue;
      double op = OrderOpenPrice(), oLo = op, oHi = op;
      int si = StIdx(OrderTicket());
      if(si >= 0 && stDist[si] > 0) { oLo = MathMin(op, stDist[si]); oHi = MathMax(op, stDist[si]); }
      if(oLo <= cHi && oHi >= cLo) return OrderTicket();
     }
   return -1;
  }
// live bot orders (pending + open) on this symbol in this direction
int DirOrders(string s, int dir)
  {
   int n = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS) || OrderSymbol() != s || !OurMagic(OrderMagicNumber())) continue;
      int od = OrderType() % 2 == 0 ? 1 : -1;
      if(od == dir) n++;
     }
   return n;
  }
int ZpIdx(string s, int dir, double prox, double dist)
  {
   double lo = MathMin(prox, dist), hi = MathMax(prox, dist);
   for(int i = 0; i < ArraySize(zpSym); i++) if(zpSym[i] == s && zpDir[i] == dir && zpLo[i] <= hi && zpHi[i] >= lo) return i;
   return -1;
  }
int ZonePlacements(string s, int dir, double prox, double dist) { int i = ZpIdx(s, dir, prox, dist); return i >= 0 ? zpN[i] : 0; }
void AddZonePlacement(string s, int dir, double prox, double dist)
  {
   int i = ZpIdx(s, dir, prox, dist);
   if(i < 0)
     {
      i = ArraySize(zpSym);
      ArrayResize(zpSym, i + 1); ArrayResize(zpDir, i + 1); ArrayResize(zpLo, i + 1); ArrayResize(zpHi, i + 1); ArrayResize(zpN, i + 1);
      zpSym[i] = s; zpDir[i] = dir; zpLo[i] = MathMin(prox, dist); zpHi[i] = MathMax(prox, dist); zpN[i] = 0;
     }
   zpN[i]++;
  }
// Kevin best: never cancel + re-place for recalculated levels. Modify the pending only when entry / stop / target
// moved more than 0.1 x zone height, at most once per entry-TF bar, and never to a wider stop than the lots were sized on.
void BestModify(int ticket, string s, int etf, double entry, double sl, double tp, double h)
  {
   if(!OrderSelect(ticket, SELECT_BY_TICKET) || OrderCloseTime() != 0) return;
   int type = OrderType();
   if(type != OP_BUYLIMIT && type != OP_SELLLIMIT) return;
   double tol = 0.1 * h;
   if(tol <= 0) return;
   double oOpen = OrderOpenPrice(), oSl = OrderStopLoss(), oTp = OrderTakeProfit();
   if(MathAbs(entry - oOpen) <= tol && MathAbs(sl - oSl) <= tol && MathAbs(tp - oTp) <= tol) return;
   datetime b0 = iTime(s, etf, 0);
   int mi = -1;
   for(int i = 0; i < ArraySize(modTicket); i++) if(modTicket[i] == ticket) { mi = i; break; }
   if(mi >= 0 && modBar[mi] == b0) return;
   if(MathAbs(entry - sl) > MathAbs(oOpen - oSl) * 1.05) return;           // lots were sized on the old stop: never raise the risk
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double point = MarketInfo(s, MODE_POINT), stopLvl = MarketInfo(s, MODE_STOPLEVEL) * point;
   double ask = MarketInfo(s, MODE_ASK), bid = MarketInfo(s, MODE_BID);
   if(type == OP_BUYLIMIT && (entry >= ask - stopLvl || sl >= entry - stopLvl || (tp > 0 && tp <= entry + stopLvl))) return;
   if(type == OP_SELLLIMIT && (entry <= bid + stopLvl || sl <= entry + stopLvl || (tp > 0 && tp >= entry - stopLvl))) return;
   if(mi < 0) { mi = ArraySize(modTicket); ArrayResize(modTicket, mi + 1); ArrayResize(modBar, mi + 1); modTicket[mi] = ticket; }
   modBar[mi] = b0;
   double ne = NormalizeDouble(entry, digits), ns = NormalizeDouble(sl, digits), nt = NormalizeDouble(tp, digits);
   if(!OrderModify(ticket, ne, ns, nt, 0)) { Print("#", ticket, " ", s, " pending modify failed ", GetLastError()); return; }
   gModified++;
   Print("#", ticket, " ", s, " pending updated: entry ", DoubleToString(ne, digits), " stop ", DoubleToString(ns, digits), " target ", DoubleToString(nt, digits));
   int si = StIdx(ticket);
   if(si >= 0 && point > 0) StSet(ticket, stK[si], stM[si], stDist[si], MathAbs(ne - ns) / point, stG[si]);
   int ii = InitIdx(ticket);
   if(ii >= 0) { bsSl[ii] = ns; bsTp[ii] = nt; }
  }

// ---- Kevin best capital protection ----
// risk per trade: InpBestRiskPct, halved while equity is >= InpDDHalfRiskPct below its peak (until a new equity high)
double BestRiskPct() { return InpBestRiskPct * (gDDHalf ? 0.5 : 1.0); }
// risk to stop of all open + pending bot orders, % of balance (a stop at / past break-even counts 0)
double OpenRiskPct()
  {
   double bal = AccountBalance();
   if(bal <= 0) return 0;
   double sum = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
     {
      if(!OrderSelect(i, SELECT_BY_POS) || !OurMagic(OrderMagicNumber()) || OrderStopLoss() <= 0) continue;
      double tv = MarketInfo(OrderSymbol(), MODE_TICKVALUE), ts = MarketInfo(OrderSymbol(), MODE_TICKSIZE);
      if(tv <= 0 || ts <= 0) continue;
      int od = OrderType() % 2 == 0 ? 1 : -1;
      double d = od * (OrderOpenPrice() - OrderStopLoss());
      if(d > 0) sum += d / ts * tv * OrderLots();
     }
   return 100.0 * sum / bal;
  }
// new fills on this symbol today (UTC): closed + still open bot trades opened today
int FillsToday(string s)
  {
   datetime day = DayOf(TimeCurrent());
   int n = 0;
   for(int i = OrdersHistoryTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) && OrderSymbol() == s && OurMagic(OrderMagicNumber()) && OrderType() <= OP_SELL && StringFind(OrderComment(), "from #") < 0 && DayOf(OrderOpenTime()) == day) n++;
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OrderSymbol() == s && OurMagic(OrderMagicNumber()) && OrderType() <= OP_SELL && DayOf(OrderOpenTime()) == day) n++;
   return n;
  }
// losing closes in a row (newest first by close time); recomputed only when the history grows
int LossStreak(datetime &lastClose)
  {
   int ht = OrdersHistoryTotal();
   if(ht == gStreakHist) { lastClose = gStreakLast; return gStreakN; }
   double nets[]; datetime cts[]; int m = 0;
   ArrayResize(nets, ht); ArrayResize(cts, ht);
   if(ht > 0) { ArrayInitialize(nets, 0); ArrayInitialize(cts, 0); }
   for(int i = 0; i < ht; i++)
     {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) || !OurMagic(OrderMagicNumber()) || OrderType() > OP_SELL) continue;
      double nv = OrderProfit() + OrderCommission() + OrderSwap();
      datetime cv = OrderCloseTime();
      int j = m - 1;                                                     // insertion sort, newest close first
      while(j >= 0 && cts[j] < cv) { cts[j + 1] = cts[j]; nets[j + 1] = nets[j]; j--; }
      cts[j + 1] = cv; nets[j + 1] = nv; m++;
     }
   int n = 0;
   for(int i = 0; i < m; i++) { if(nets[i] <= -0.01) n++; else break; }
   gStreakHist = ht; gStreakN = n; gStreakLast = 0;
   if(m > 0) gStreakLast = cts[0];
   lastClose = gStreakLast;
   return n;
  }
// once per tick: day / week start balances, daily / weekly / streak stops, equity peak, max open risk
void ProtectUpdate()
  {
   datetime day = DayOf(TimeCurrent());
   int dow = TimeDayOfWeek(day);
   datetime week = day - ((dow + 6) % 7) * 86400;                       // Monday 00:00 UTC
   if(day != gPDay) { gPDay = day; gPDayBal = AccountBalance(); gPDayStop = false; }
   if(week != gPWeek) { gPWeek = week; gPWeekBal = AccountBalance(); gPWeekStop = false; }
   if(!IsProt()) return;                                                // other presets: start balances only (tester panel)
   double eq = AccountEquity();
   if(!gPDayStop && InpDailyLossPctBest > 0 && gPDayBal > 0 && (gPDayBal - eq) / gPDayBal * 100.0 >= InpDailyLossPctBest)
     { gPDayStop = true; Print(StringFormat("Kevin best: daily loss %.2f%% reached - no new orders, pendings cancelled for the rest of the UTC day", InpDailyLossPctBest)); }
   if(!gPWeekStop && InpWeeklyLossPct > 0 && gPWeekBal > 0 && (gPWeekBal - eq) / gPWeekBal * 100.0 >= InpWeeklyLossPct)
     { gPWeekStop = true; Print(StringFormat("Kevin best: weekly loss %.2f%% reached - no new orders, pendings cancelled for the rest of the week", InpWeeklyLossPct)); }
   datetime lc = 0;
   int st = LossStreak(lc);
   gStreakStop = InpMaxLossStreak > 0 && st >= InpMaxLossStreak && DayOf(lc) == day;
   if(gPDayStop && gLastDailyDay != day) { gLastDailyDay = day; gDaysDaily++; }
   if(gPWeekStop && gLastWeeklyDay != day) { gLastWeeklyDay = day; gDaysWeekly++; }
   if(gStreakStop && gLastStreakDay != day) { gLastStreakDay = day; gDaysStreak++; Print(StringFormat("Kevin best: %d losses in a row - no new orders until the next UTC day", st)); }
   if(eq > gEqPeak) { gEqPeak = eq; gDDHalf = false; }
   else if(!gDDHalf && InpDDHalfRiskPct > 0 && gEqPeak > 0 && (gEqPeak - eq) / gEqPeak * 100.0 >= InpDDHalfRiskPct)
     { gDDHalf = true; Print(StringFormat("Kevin best: equity %.1f%% below its peak - risk per trade halved until a new equity high", InpDDHalfRiskPct)); }
   double orisk = OpenRiskPct();
   if(orisk > gMaxOpenRisk) gMaxOpenRisk = orisk;
  }
// Kevin best: reason this symbol may not take a new order in this direction ("" = allowed)
string BestBlocked(string s, int dir)
  {
   if(gPWeekStop) return "best: weekly loss limit";
   if(gPDayStop) return "best: daily loss limit";
   if(gStreakStop) return "best: loss streak";
   if(InpMaxTradesDay > 0 && FillsToday(s) >= InpMaxTradesDay) return "best: max trades today";
   if(DirOrders(s, -dir) > 0) return "best: opposite trade on symbol";
   if(InpMaxOpenRiskPct > 0 && OpenRiskPct() + BestRiskPct() > InpMaxOpenRiskPct + 1e-9) return "best: max open risk";
   return "";
  }

//+------------------------------------------------------------------+
//| Chart drawings (live: InpDraw; tester: visual mode only)         |
//+------------------------------------------------------------------+
bool Viz() { if(IsTesting()) return IsVisualMode(); return InpDraw; }
// the live zones of one entry TF (newest 8) with timeframe, grade and ARRIVAL label
void VizZones(string s, int k, int etf, Zone &z[])
  {
   string pre = "RFXZ_v" + IntegerToString(k) + "_";
   ObjectsDeleteAll(0, pre);
   int shown = 0;
   for(int i = ArraySize(z) - 1; i >= 0 && shown < 8; i--)
     {
      if(z[i].removed || z[i].consumed) continue;
      if(z[i].legBar > InpMaxZoneAge) break;
      shown++;
      datetime t1 = iTime(s, etf, z[i].legBar + z[i].baseN), t2 = TimeCurrent() + PeriodSeconds(etf) * 10;
      string nm = pre + IntegerToString(i);
      color c = z[i].dir > 0 ? (z[i].tested ? clrDarkGreen : clrSeaGreen) : (z[i].tested ? clrMaroon : clrIndianRed);
      ObjectCreate(0, nm, OBJ_RECTANGLE, 0, t1, z[i].prox, t2, z[i].dist);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, c); ObjectSetInteger(0, nm, OBJPROP_BACK, true);
      bool arr = Arrival(s, etf, z, i);
      string lb = StringFormat("%s %s %s%s%s", TF_N[k], z[i].dir > 0 ? "demand" : "supply", z[i].grade, arr ? " ARRIVAL" : "", z[i].tested ? " (tested)" : "");
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, lb);
      string tn = nm + "t";
      ObjectCreate(0, tn, OBJ_TEXT, 0, t1, z[i].dir > 0 ? z[i].dist : z[i].prox);
      ObjectSetString(0, tn, OBJPROP_TEXT, lb);
      ObjectSetInteger(0, tn, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, tn, OBJPROP_COLOR, arr ? clrDarkOrange : clrDimGray);
      ObjectSetInteger(0, tn, OBJPROP_ANCHOR, z[i].dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
     }
   NoSelect(0, pre);
  }
// short skip reason next to the zone; only the latest 10 stay on the chart
void VizSkip(string s, int k, int etf, Zone &zi, string reason)
  {
   datetime t1 = iTime(s, etf, zi.legBar + zi.baseN);
   string nm = "RFXK_" + IntegerToString(k) + "_" + IntegerToString((int)t1) + (zi.dir > 0 ? "b" : "s");
   string r = reason;
   if(StringFind(r, "best: ") == 0) r = StringSubstr(r, 6);
   if(StringLen(r) > 32) r = StringSubstr(r, 0, 32);
   int at = -1;
   for(int i = 0; i < ArraySize(vzSkip); i++) if(vzSkip[i] == nm) { at = i; break; }
   if(at < 0)
     {
      int n = ArraySize(vzSkip);
      if(n >= 10) { ObjectDelete(0, vzSkip[0]); for(int i = 0; i < n - 1; i++) vzSkip[i] = vzSkip[i + 1]; n--; ArrayResize(vzSkip, n); }
      ArrayResize(vzSkip, n + 1); vzSkip[n] = nm;
      ObjectCreate(0, nm, OBJ_TEXT, 0, t1, zi.prox);
     }
   ObjectMove(0, nm, 0, t1, zi.prox);
   ObjectSetString(0, nm, OBJPROP_TEXT, TF_N[k] + " skip: " + r);
   ObjectSetInteger(0, nm, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, nm, OBJPROP_COLOR, clrGray);
   ObjectSetInteger(0, nm, OBJPROP_ANCHOR, zi.dir > 0 ? ANCHOR_LEFT_LOWER : ANCHOR_LEFT_UPPER);
   ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, nm, OBJPROP_SELECTED, false);
  }
// order marks for this chart's symbol, any entry TF: redrawn only when a bot order is added, changed, filled, closed or cancelled
void VizSync()
  {
   if(!Viz()) return;
   string sig = "";
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OrderSymbol() == _Symbol && OurMagic(OrderMagicNumber()))
         sig += StringFormat("%d:%d:%.5f:%.5f:%.5f|", OrderTicket(), OrderType(), OrderOpenPrice(), OrderStopLoss(), OrderTakeProfit());
   if(sig == vzOrdSig) return;
   vzOrdSig = sig;
   ObjectsDeleteAll(0, "RFXV_");                                        // closed / cancelled orders lose their marks here
   int tk[]; int m = 0;
   ArrayResize(tk, OrdersTotal());
   if(ArraySize(tk) > 0) ArrayInitialize(tk, 0);
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OrderSymbol() == _Symbol && OurMagic(OrderMagicNumber())) tk[m++] = OrderTicket();
   for(int i = 0; i < m; i++) VizOrderMarks(tk[i]);
   ChartRedraw(0);
  }
// entry / stop / target marks + "A ARRIVAL H1 buy RR 3.1 risk 0.50%" (R:R and risk on the initial stop)
void VizOrderMarks(int t)
  {
   if(!OrderSelect(t, SELECT_BY_TICKET)) return;
   int si = StIdx(t);
   int k = KOf(OrderMagicNumber());
   if(si >= 0 && stK[si] >= 0 && stK[si] < NTF) k = stK[si];
   int dir = OrderType() % 2 == 0 ? 1 : -1;
   bool pending = OrderType() > OP_SELL;
   double entry = OrderOpenPrice(), sl = OrderStopLoss(), tp = OrderTakeProfit();
   string grade = "";
   if(si >= 0) grade = stG[si];
   bool arr = false;
   for(int j = 0; j < ArraySize(vzArrT); j++) if(vzArrT[j] == t) { arr = true; break; }
   double r0 = MathAbs(entry - sl);
   if(si >= 0 && stRpts[si] > 0) r0 = stRpts[si] * MarketInfo(_Symbol, MODE_POINT);
   double rr = 0, rp = 0;
   if(tp > 0 && r0 > 0) rr = MathAbs(tp - entry) / r0;
   double tv = MarketInfo(_Symbol, MODE_TICKVALUE), ts = MarketInfo(_Symbol, MODE_TICKSIZE);
   if(tv > 0 && ts > 0 && AccountBalance() > 0) rp = r0 / ts * tv * OrderLots() / AccountBalance() * 100.0;
   string pre = "RFXV_" + IntegerToString(t) + "_";
   datetime t1 = OrderOpenTime(), tb = TimeCurrent();
   if(t1 > tb) tb = t1;
   datetime t2 = tb + PeriodSeconds(TF_E[k]) * 20;
   double pr[3]; pr[0] = entry; pr[1] = sl; pr[2] = tp;
   color cl[3]; cl[0] = clrDodgerBlue; cl[1] = clrRed; cl[2] = clrLimeGreen;
   string sx[3]; sx[0] = "e"; sx[1] = "s"; sx[2] = "t";
   for(int q = 0; q < 3; q++)
     {
      if(pr[q] <= 0) continue;
      string nm = pre + sx[q];
      ObjectCreate(0, nm, OBJ_TREND, 0, t1, pr[q], t2, pr[q]);
      ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, nm, OBJPROP_COLOR, cl[q]);
      ObjectSetInteger(0, nm, OBJPROP_WIDTH, q == 0 ? 2 : 1); ObjectSetInteger(0, nm, OBJPROP_STYLE, q == 0 ? STYLE_SOLID : STYLE_DASH);
     }
   string tn = pre + "x";
   ObjectCreate(0, tn, OBJ_TEXT, 0, t2, entry);
   ObjectSetString(0, tn, OBJPROP_TEXT, StringFormat("%s%s %s %s RR %.1f risk %.2f%%%s", grade, arr ? " ARRIVAL" : "", TF_N[k], dir > 0 ? "buy" : "sell", rr, rp, pending ? " (pending)" : ""));
   ObjectSetInteger(0, tn, OBJPROP_FONTSIZE, 8); ObjectSetInteger(0, tn, OBJPROP_COLOR, clrDodgerBlue); ObjectSetInteger(0, tn, OBJPROP_ANCHOR, ANCHOR_LEFT);
   NoSelect(0, pre);
  }
// panel lines for the status block (top-right): preset, open risk, today P/L, loss streak, trades today, Kevin best pause + why
string VizPanelText()
  {
   datetime lc = 0;
   int st = LossStreak(lc), td = FillsToday(_Symbol);
   double orisk = OpenRiskPct(), dayPl = 0;
   if(gPDayBal > 0) dayPl = (AccountEquity() - gPDayBal) / gPDayBal * 100.0;
   string cap = "";
   if(IsProt()) cap = StringFormat(" (cap %.2f%%, risk/trade %.2f%%%s)", InpMaxOpenRiskPct, BestRiskPct(), gDDHalf ? ", halved: drawdown" : "");
   string out = StringFormat("Preset %s | open risk %.2f%%%s\n", PresetName(), orisk, cap);
   out += StringFormat("Today P/L %+.2f%% | loss streak %d | trades today %d\n", dayPl, st, td);
   string why = "";
   if(IsProt())
     {
      if(gPWeekStop) why = "weekly loss limit";
      else if(gPDayStop) why = "daily loss limit";
      else if(gStreakStop) why = "loss streak";
      else if(InpMaxTradesDay > 0 && td >= InpMaxTradesDay) why = "max trades today";
      else if(InpMaxOpenRiskPct > 0 && orisk + BestRiskPct() > InpMaxOpenRiskPct + 1e-9) why = "max open risk";
     }
   if(why != "") out += "! PAUSED (Kevin best): " + why + "\n";
   if(gVizTrend != "") out += gVizTrend + "\n";
   if(ArraySize(vzR) > 0)
     {
      string sk = "Skips: "; int used[]; ArrayResize(used, ArraySize(vzR)); ArrayInitialize(used, 0);
      for(int q = 0; q < 3; q++)
        {
         int bi = -1;
         for(int i = 0; i < ArraySize(vzR); i++) if(used[i] == 0 && (bi < 0 || vzC[i] > vzC[bi])) bi = i;
         if(bi < 0) break;
         used[bi] = 1; sk += (q > 0 ? ", " : "") + vzR[bi] + " x" + IntegerToString(vzC[bi]);
        }
      out += (StringLen(sk) > 63 ? StringSubstr(sk, 0, 63) : sk) + "\n";
     }
   return out;
  }

datetime ToUTC(datetime t) { return IsTesting() ? t - InpTesterGMT * 3600 : t - (datetime)(MathRound((TimeCurrent() - TimeGMT()) / 1800.0) * 1800); }
datetime DayOf(datetime t) { datetime u = ToUTC(t); return u - u % 86400; }
string   SessionOf(datetime t) { int h = TimeHour(ToUTC(t)); if(h >= 12 && h < 21) return "New York"; if(h >= 7 && h < 12) return "London"; if(h >= 23 || h < 7) return "Asia"; return "Off-hours"; }
string   KF(double v, int d) { return v == KNA ? "n/a" : DoubleToString(v, d); }
string   KP(double v) { return v == KNA ? "n/a" : DoubleToString(v * 100, 1) + "%"; }
string   Dur(double m) { if(m < 60) return StringFormat("%.0fm", m); if(m < 1440) return StringFormat("%dh%02dm", (int)(m / 60), (int)m % 60); return StringFormat("%dd%02dh", (int)(m / 1440), ((int)m % 1440) / 60); }
string   TStamp(datetime t) { return TimeToString(t, TIME_DATE | TIME_SECONDS); }
int      AcctSmall() { int h = 0; for(int i = 0; i < StringLen(_Symbol); i++) h = (h * 31 + StringGetCharacter(_Symbol, i)) % 997; return 1 + h; }   // stable per symbol, 1..997

// every closed bot trade of the test, sorted by close time
int CollectTrades(BTrade &T[])
  {
   ArrayResize(T, 0);
   int acc = AcctSmall();
   for(int i = 0; i < OrdersHistoryTotal(); i++)
     {
      if(!OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) || !OurMagic(OrderMagicNumber()) || OrderType() > OP_SELL) continue;
      BTrade t;
      t.ticket = OrderTicket(); t.jid = acc * 1000000 + t.ticket % 1000000; t.sym = OrderSymbol(); t.dir = OrderType() == OP_BUY ? 1 : -1;
      t.ot = OrderOpenTime(); t.ct = OrderCloseTime(); t.op = OrderOpenPrice(); t.cp = OrderClosePrice(); t.lots = OrderLots();
      t.profit = OrderProfit(); t.comm = OrderCommission(); t.swap = OrderSwap(); t.net = t.profit + t.comm + t.swap;
      string cm = OrderComment(); double curSl = OrderStopLoss(), curTp = OrderTakeProfit(); int magic = OrderMagicNumber();
      int src = t.ticket, si = StIdx(t.ticket);
      if(si < 0 && StringFind(cm, "from #") >= 0) { src = (int)StringToInteger(StringSubstr(cm, StringFind(cm, "from #") + 6)); si = StIdx(src); }   // rest of a partial close
      t.k = si >= 0 ? stK[si] : KOf(magic); if(t.k < 0 || t.k >= NTF) t.k = KOf(magic);
      t.grade = si >= 0 ? stG[si] : "?"; if(t.grade == "") t.grade = "?";
      t.method = (si >= 0 ? stM[si] == "CONF" : magic - InpMagic >= 10) ? "Confirmation" : "Set & forget";
      double point = MarketInfo(t.sym, MODE_POINT), rp = si >= 0 ? stRpts[si] * point : 0;
      int ii = InitIdx(src);
      t.sl0 = ii >= 0 ? bsSl[ii] : (rp > 0 ? t.op - t.dir * rp : curSl);
      t.tp0 = ii >= 0 ? bsTp[ii] : curTp;
      t.hasR = true; t.rsrc = "initial stop";
      if(rp <= 0 && t.sl0 > 0 && t.dir * (t.op - t.sl0) > 0) { rp = MathAbs(t.op - t.sl0); t.rsrc = "stop"; }
      if(rp > 0) t.R = t.dir * (t.cp - t.op) / rp;
      else
        {
         double rm = gStartBal * (IsProt() ? InpBestRiskPct : InpRiskPct) / 100.0;                     // no stop known: money R at the planned risk
         if(rm > 0) { t.R = t.net / rm; t.rsrc = "money"; } else { t.R = 0; t.hasR = false; t.rsrc = ""; }
        }
      t.outcome = MathAbs(t.net) < 0.01 ? 0 : (t.net > 0 ? 1 : -1);
      t.hold = MathMax(0, (double)(t.ct - t.ot) / 60.0);
      t.sess = SessionOf(t.ot);
      t.why = StringFind(cm, "[tp]") >= 0 ? "tp" : (StringFind(cm, "[sl]") >= 0 ? "sl" : (StringFind(cm, "so:") >= 0 || StringFind(cm, "[so]") >= 0 ? "so" : (StringFind(cm, "to #") >= 0 ? "ea" : "other")));
      int nn = ArraySize(T); ArrayResize(T, nn + 1); T[nn] = t;
     }
   int n = ArraySize(T);
   for(int i = 1; i < n; i++)                                           // insertion sort by close time, then ticket
     {
      BTrade x = T[i]; int j = i - 1;
      while(j >= 0 && (T[j].ct > x.ct || (T[j].ct == x.ct && T[j].ticket > x.ticket))) { T[j + 1] = T[j]; j--; }
      T[j + 1] = x;
     }
   return n;
  }

// journal formulas (stats.ts computeStats / riskAdjusted / traderScore) over the trades ix[0..m-1]
void Kpi(BTrade &T[], int &ix[], int m, bool full, KStat &s)
  {
   s.n = m; s.wins = 0; s.losses = 0; s.be = 0; s.rN = 0; s.cw = 0; s.cl = 0; s.days = 0; s.green = 0; s.red = 0; s.sdays = 0;
   s.net = 0; s.gw = 0; s.gl = 0; s.bigW = 0; s.bigL = 0; s.dd = 0; s.ddPct = KNA; s.sharpe = KNA; s.sortino = KNA; s.score = KNA;
   s.sEdge = 0; s.sPf = 0; s.sPay = 0; s.sDd = 0; s.sCons = 0; s.bestDay = 0; s.worstDay = 0; s.bestD = 0; s.worstD = 0;
   double cum = 0, peak = 0, hw = 0, hl = 0, sumR = 0; int cw = 0, cl = 0;
   datetime dD[]; double dP[]; int nd = 0;
   for(int q = 0; q < m; q++)
     {
      int i = ix[q]; double v = T[i].net;
      s.net += v;
      if(T[i].outcome > 0)      { s.wins++;   s.gw += v; hw += T[i].hold; s.bigW = s.wins == 1 ? v : MathMax(s.bigW, v); cw++; cl = 0; s.cw = MathMax(s.cw, cw); }
      else if(T[i].outcome < 0) { s.losses++; s.gl -= v; hl += T[i].hold; s.bigL = s.losses == 1 ? v : MathMin(s.bigL, v); cl++; cw = 0; s.cl = MathMax(s.cl, cl); }
      else s.be++;                                                        // breakevens neither extend nor break a streak
      if(T[i].hasR) { s.rN++; sumR += T[i].R; }
      cum += v; peak = MathMax(peak, cum); s.dd = MathMax(s.dd, peak - cum);
      datetime d = DayOf(T[i].ct);
      if(nd == 0 || dD[nd - 1] != d) { ArrayResize(dD, nd + 1); ArrayResize(dP, nd + 1); dD[nd] = d; dP[nd] = 0; nd++; }
      dP[nd - 1] += v;
     }
   int dec = s.wins + s.losses;
   s.wr = dec > 0 ? (double)s.wins / dec : 0;
   s.pf = s.gl > 0 ? s.gw / s.gl : KNA;
   s.avgW = s.wins > 0 ? s.gw / s.wins : 0;
   s.avgL = s.losses > 0 ? -s.gl / s.losses : 0;
   s.payoff = (s.wins > 0 && s.losses > 0) ? s.avgW / MathAbs(s.avgL) : KNA;
   s.beWR = s.payoff != KNA ? 1.0 / (1.0 + s.payoff) : KNA;
   s.ex = m > 0 ? s.net / m : 0;
   s.avgR = s.rN > 0 ? sumR / s.rN : KNA; s.totR = sumR;
   s.holdW = s.wins > 0 ? hw / s.wins : 0; s.holdL = s.losses > 0 ? hl / s.losses : 0;
   s.rf = s.dd > 0 ? s.net / s.dd : KNA;
   s.days = nd;
   for(int j = 0; j < nd; j++)
     {
      if(dP[j] >= 0.01) s.green++; else if(dP[j] <= -0.01) s.red++;
      if(j == 0 || dP[j] > s.bestDay)  { s.bestDay = dP[j];  s.bestD = dD[j]; }
      if(j == 0 || dP[j] < s.worstDay) { s.worstDay = dP[j]; s.worstD = dD[j]; }
     }
   s.dayWR = s.green + s.red > 0 ? (double)s.green / (s.green + s.red) : 0;
   s.avgDay = nd > 0 ? s.net / nd : 0;
   if(!full) return;
   // max drawdown as % of the running peak balance (start balance + closed P/L)
   if(gStartBal > 0)
     {
      double bal = gStartBal, pk = gStartBal, ddp = 0;
      for(int q = 0; q < m; q++) { bal += T[ix[q]].net; pk = MathMax(pk, bal); if(pk > 0) ddp = MathMax(ddp, (pk - bal) / pk); }
      s.ddPct = MathMin(1, ddp);
     }
   // Sharpe / Sortino: every weekday between the first and last trade day (no-trade days = 0), % of the day's start balance, x sqrt(252)
   if(nd > 0)
     {
      double rets[]; int nr = 0, p = 0; double run = 0;
      for(datetime d = dD[0]; d <= dD[nd - 1]; d += 86400)
        {
         int wd = TimeDayOfWeek(d); double pnl = 0; bool has = false;
         if(p < nd && dD[p] == d) { pnl = dP[p]; has = true; p++; }
         if((wd == 0 || wd == 6) && !has) continue;
         double b = gStartBal + run;
         ArrayResize(rets, nr + 1); rets[nr++] = b > 0 ? pnl / b : pnl;
         run += pnl;
        }
      s.sdays = nr;
      if(nr >= 20)
        {
         double mean = 0, sd = 0, dn = 0;
         for(int j = 0; j < nr; j++) mean += rets[j];
         mean /= nr;
         for(int j = 0; j < nr; j++) { sd += (rets[j] - mean) * (rets[j] - mean); dn += MathPow(MathMin(0, rets[j]), 2); }
         sd = MathSqrt(sd / (nr - 1)); dn = MathSqrt(dn / nr);
         s.sharpe = sd > 0 ? mean / sd * MathSqrt(252) : KNA;
         s.sortino = dn > 0 ? mean / dn * MathSqrt(252) : KNA;
        }
     }
   // trader score (needs >= 20 trades), each axis 0..100, mean of the five
   if(m >= 20)
     {
      double edge = s.beWR != KNA ? s.wr - s.beWR : s.wr - 0.5;
      double pf = s.pf != KNA ? s.pf : (s.gw > 0 ? 3 : 0);
      double best = (nd > 0 && s.net > 0) ? s.bestDay / s.net : 1;
      s.sEdge = MathMax(0, MathMin(100, 50 + edge * 250));
      s.sPf   = MathMax(0, MathMin(100, (pf - 1) / 1.5 * 100));
      s.sPay  = MathMax(0, MathMin(100, (s.payoff != KNA ? s.payoff : 3) / 3 * 100));
      s.sDd   = s.ddPct != KNA ? MathMax(0, MathMin(100, 100 - s.ddPct * 500)) : MathMax(0, MathMin(100, (s.rf != KNA ? s.rf : 0) / 3 * 100));
      s.sCons = s.net > 0 ? MathMax(0, MathMin(100, 100 - MathMax(0, best - 0.2) * 200)) : MathMax(0, MathMin(100, s.dayWR * 50));
      s.score = (s.sEdge + s.sPf + s.sPay + s.sDd + s.sCons) / 5;
     }
  }

// groups: 0 entry TF, 1 grade, 2 entry type, 3 side, 4 session (UTC entry hour), 5 weekday (UTC), 6 hold time, 7 R bin (0.5R, -3..6)
#define NDIM 8
string DimName(int d)
  {
   switch(d) { case 0: return "Entry timeframe"; case 1: return "Grade"; case 2: return "Entry type"; case 3: return "Side"; case 4: return "Session (UTC entry)";
               case 5: return "Weekday (UTC entry)"; case 6: return "Hold time"; }
   return "R multiple (0.5R bins)";
  }
int DimKeys(int d, string &keys[])
  {
   ArrayResize(keys, 0);
   if(d == 0) { ArrayResize(keys, NTF); for(int i = 0; i < NTF; i++) keys[i] = TF_N[i]; }
   if(d == 1) { ArrayResize(keys, 4); keys[0] = "A"; keys[1] = "B"; keys[2] = "C"; keys[3] = "?"; }
   if(d == 2) { ArrayResize(keys, 2); keys[0] = "Set & forget"; keys[1] = "Confirmation"; }
   if(d == 3) { ArrayResize(keys, 2); keys[0] = "Long"; keys[1] = "Short"; }
   if(d == 4) { ArrayResize(keys, 4); keys[0] = "Asia"; keys[1] = "London"; keys[2] = "New York"; keys[3] = "Off-hours"; }
   if(d == 5) { ArrayResize(keys, 7); keys[0] = "Mon"; keys[1] = "Tue"; keys[2] = "Wed"; keys[3] = "Thu"; keys[4] = "Fri"; keys[5] = "Sat"; keys[6] = "Sun"; }
   if(d == 6) { ArrayResize(keys, 6); keys[0] = "<5m"; keys[1] = "5-15m"; keys[2] = "15m-1h"; keys[3] = "1-4h"; keys[4] = "4h-1d"; keys[5] = ">1d"; }
   if(d == 7) { ArrayResize(keys, 18); for(int b = -6; b < 12; b++) keys[b + 6] = RBinName(b); }
   return ArraySize(keys);
  }
string RBinName(int b)
  {
   if(b <= -6) return "<-2.5R";
   if(b >= 11) return ">=5.5R";
   return StringFormat("%.1f to %.1fR", b * 0.5, (b + 1) * 0.5);
  }
string KeyOf(BTrade &t, int d)
  {
   if(d == 0) return TF_N[t.k];
   if(d == 1) return t.grade;
   if(d == 2) return t.method;
   if(d == 3) return t.dir > 0 ? "Long" : "Short";
   if(d == 4) return t.sess;
   if(d == 5) { string w[7] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"}; return w[TimeDayOfWeek(ToUTC(t.ot))]; }
   if(d == 6) { double h = t.hold; return h < 5 ? "<5m" : (h < 15 ? "5-15m" : (h < 60 ? "15m-1h" : (h < 240 ? "1-4h" : (h < 1440 ? "4h-1d" : ">1d")))); }
   if(!t.hasR) return "";
   double r = MathMax(-3.0, MathMin(5.999, t.R));
   return RBinName((int)MathFloor(r / 0.5));
  }
int GroupIx(BTrade &T[], int d, string key, int &ix[])
  {
   ArrayResize(ix, 0); int m = 0;
   for(int i = 0; i < ArraySize(T); i++) if(KeyOf(T[i], d) == key) { ArrayResize(ix, m + 1); ix[m++] = i; }
   return m;
  }
string GroupLine(string key, KStat &g)
  {
   return StringFormat("  %-16s %6d %5d %5d %6.1f%% %12.2f %6s %10.2f %7s %8.1fR", key, g.n, g.wins, g.losses, g.wr * 100, g.net, KF(g.pf, 2), g.ex, KF(g.avgR, 2), g.totR);
  }
void KpiRow(int f, string grp, string key, KStat &k, bool full)
  {
   FileWrite(f, grp, key, k.n, k.wins, k.losses, k.be, DoubleToString(k.wr * 100, 2), DoubleToString(k.net, 2), DoubleToString(k.gw, 2), DoubleToString(k.gl, 2),
             KF(k.pf, 3), DoubleToString(k.avgW, 2), DoubleToString(k.avgL, 2), KF(k.payoff, 3), k.beWR == KNA ? "n/a" : DoubleToString(k.beWR * 100, 2),
             DoubleToString(k.ex, 2), KF(k.avgR, 3), DoubleToString(k.totR, 2), DoubleToString(k.bigW, 2), DoubleToString(k.bigL, 2),
             DoubleToString(k.holdW, 1), DoubleToString(k.holdL, 1), k.cw, k.cl, DoubleToString(k.dd, 2), full && k.ddPct != KNA ? DoubleToString(k.ddPct * 100, 2) : "",
             KF(k.rf, 3), k.days, k.green, k.red, DoubleToString(k.dayWR * 100, 2), DoubleToString(k.bestDay, 2), DoubleToString(k.worstDay, 2), DoubleToString(k.avgDay, 2),
             full ? KF(k.sharpe, 3) : "", full ? KF(k.sortino, 3) : "", full ? KF(k.score, 1) : "");
  }

void BacktestReport()
  {
   BTrade T[]; int nT = CollectTrades(T);
   string sym = _Symbol, ccy = AccountCurrency();
   int acct = 900000 + AcctSmall();
   int all[]; ArrayResize(all, nT); for(int i = 0; i < nT; i++) all[i] = i;
   KStat S; Kpi(T, all, nT, true, S);
   double endBal = gStartBal + S.net;
   { datetime first = TimeCurrent(); for(int i = 0; i < nT; i++) if(T[i].ot < first) first = T[i].ot;
     if(gTestStart == 0 || gTestStart > first) gTestStart = first - 60; }    // the deposit row must come before the first trade

   //--- Journal block
   Print("==================== RamanFX ZoneBot backtest: ", sym, " ====================");
   Print(StringFormat("Mode: %s | tested %s - %s | start balance %.2f %s | end %.2f %s", PresetName(),
         TimeToString(gTestStart, TIME_DATE), TimeToString(TimeCurrent(), TIME_DATE), gStartBal, ccy, endBal, ccy));
   { int nFill = 0;
     for(int i = 0; i < OrdersHistoryTotal(); i++) if(OrderSelect(i, SELECT_BY_POS, MODE_HISTORY) && OurMagic(OrderMagicNumber()) && OrderType() <= OP_SELL && StringFind(OrderComment(), "from #") < 0) nFill++;
     for(int i = OrdersTotal() - 1; i >= 0; i--) if(OrderSelect(i, SELECT_BY_POS) && OurMagic(OrderMagicNumber()) && OrderType() <= OP_SELL) nFill++;
     Print(StringFormat("Orders placed %d, cancelled %d, filled %d (pending modified %d)", gPlaced, gCancelled, nFill, gModified)); }
   if(IsProt()) Print(StringFormat("Capital protection: risk/trade %.2f%%, max open risk reached %.2f%% (limit %.2f%%) | days stopped: daily limit %d, weekly limit %d, loss streak %d",
                        InpBestRiskPct, gMaxOpenRisk, InpMaxOpenRiskPct, gDaysDaily, gDaysWeekly, gDaysStreak));
   if(nT == 0) Print("No closed bot trades in this test.");
   else
     {
      Print(StringFormat("Trades %d (wins %d, losses %d, breakeven %d) | win rate %.1f%% | net %.2f %s | profit factor %s | expectancy %.2f per trade",
            S.n, S.wins, S.losses, S.be, S.wr * 100, S.net, ccy, KF(S.pf, 2), S.ex));
      Print(StringFormat("Gross win %.2f | gross loss %.2f | avg win %.2f | avg loss %.2f | payoff %s | breakeven win rate %s",
            S.gw, S.gl, S.avgW, S.avgL, KF(S.payoff, 2), KP(S.beWR)));
      Print(StringFormat("R: total %.1fR | avg %sR over %d trades | largest win %.2f | largest loss %.2f",
            S.totR, KF(S.avgR, 2), S.rN, S.bigW, S.bigL));
      Print(StringFormat("Hold: avg win %s | avg loss %s | max consecutive wins %d | max consecutive losses %d",
            Dur(S.holdW), Dur(S.holdL), S.cw, S.cl));
      Print(StringFormat("Drawdown: max %.2f %s (%s of peak balance) | recovery factor %s",
            S.dd, ccy, KP(S.ddPct), KF(S.rf, 2)));
      Print(StringFormat("Days %d: green %d, red %d, day win rate %.0f%% | best day %.2f (%s) | worst day %.2f (%s) | avg daily %.2f",
            S.days, S.green, S.red, S.dayWR * 100, S.bestDay, TimeToString(S.bestD, TIME_DATE), S.worstDay, TimeToString(S.worstD, TIME_DATE), S.avgDay));
      Print(StringFormat("Sharpe %s | Sortino %s (%d weekdays%s)", KF(S.sharpe, 2), KF(S.sortino, 2), S.sdays, S.sdays < 20 ? ", needs 20" : ""));
      if(S.score != KNA)
         Print(StringFormat("Trader score %.0f/100 (edge %.0f, profit factor %.0f, payoff %.0f, drawdown %.0f, consistency %.0f)", S.score, S.sEdge, S.sPf, S.sPay, S.sDd, S.sCons));
      else Print("Trader score: needs at least 20 trades");
     }

   //--- groups (Journal + KPI file)
   int fk = FileOpen("RamanFX_Backtest_" + sym + "_KPIs.csv", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(fk != INVALID_HANDLE)
     {
      FileWrite(fk, "group", "key", "trades", "wins", "losses", "breakeven", "win rate %", "net", "gross win", "gross loss", "profit factor", "avg win", "avg loss", "payoff",
                "breakeven win rate %", "expectancy", "avg R", "total R", "largest win", "largest loss", "avg hold win min", "avg hold loss min", "max consec wins", "max consec losses",
                "max drawdown", "max drawdown %", "recovery factor", "days", "green days", "red days", "day win rate %", "best day", "worst day", "avg daily pnl", "sharpe", "sortino", "trader score");
      KpiRow(fk, "Overall", "All trades", S, true);
     }
   KStat tfS[NTF]; int tfN[NTF];
   ArrayInitialize(tfN, 0); ZeroMemory(tfS);
   for(int d = 0; d < NDIM && nT > 0; d++)
     {
      string keys[]; int nk = DimKeys(d, keys);
      Print("--- By ", DimName(d), " ---");
      Print(StringFormat("  %-16s %6s %5s %5s %7s %12s %6s %10s %7s %9s", "group", "trades", "wins", "loss", "win%", "net", "PF", "expect.", "avgR", "totalR"));
      for(int j = 0; j < nk; j++)
        {
         int ix[]; int m = GroupIx(T, d, keys[j], ix);
         if(m == 0) continue;
         KStat g; Kpi(T, ix, m, false, g);
         Print(GroupLine(keys[j], g));
         if(fk != INVALID_HANDLE) KpiRow(fk, DimName(d), keys[j], g, false);
         if(d == 0) { tfS[j] = g; tfN[j] = m; }
        }
     }
   if(fk != INVALID_HANDLE) FileClose(fk);

   //--- best timeframe: ranked by total R and by expectancy, at least 10 trades
   if(nT > 0)
     {
      int ord[]; int no = 0;
      for(int i = 0; i < NTF; i++) if(tfN[i] >= 10) { ArrayResize(ord, no + 1); ord[no++] = i; }
      Print("--- Best timeframe (at least 10 trades) ---");
      if(no == 0) Print("  No entry timeframe has 10 trades yet - run a longer test (or InpAggressive) before trusting a ranking.");
      for(int pass = 0; pass < 2 && no > 0; pass++)
        {
         for(int a = 0; a < no; a++) for(int b = a + 1; b < no; b++)
           {
            double va = pass == 0 ? tfS[ord[a]].totR : tfS[ord[a]].ex, vb = pass == 0 ? tfS[ord[b]].totR : tfS[ord[b]].ex;
            if(vb > va) { int x = ord[a]; ord[a] = ord[b]; ord[b] = x; }
           }
         string ln = pass == 0 ? "  by total R:     " : "  by expectancy:  ";
         for(int a = 0; a < no && a < 7; a++)
            ln += StringFormat("%d) %s %s (%d tr)  ", a + 1, TF_N[ord[a]], pass == 0 ? StringFormat("%+.1fR", tfS[ord[a]].totR) : StringFormat("%+.2f/tr", tfS[ord[a]].ex), tfS[ord[a]].n);
         Print(ln);
        }
      if(no > 0)
        {
         int bt = ord[0];                                                 // ord is sorted by expectancy after the 2nd pass
         int br = -1; for(int a = 0; a < no; a++) if(br < 0 || tfS[ord[a]].totR > tfS[br].totR) br = ord[a];
         Print(StringFormat("  BEST: %s by total R (%+.1fR, win rate %.0f%%, PF %s) | %s by expectancy (%+.2f per trade)",
               TF_N[br], tfS[br].totR, tfS[br].wr * 100, KF(tfS[br].pf, 2), TF_N[bt], tfS[bt].ex));
        }
     }

   //--- why setups were skipped
   int order[]; ArrayResize(order, ArraySize(cKey)); for(int i = 0; i < ArraySize(cKey); i++) order[i] = i;
   for(int i = 0; i < ArraySize(order); i++) for(int j = i + 1; j < ArraySize(order); j++) if(cVal[order[j]] > cVal[order[i]]) { int x = order[i]; order[i] = order[j]; order[j] = x; }
   Print("--- Most common reasons a setup was skipped ---");
   for(int i = 0; i < MathMin(8, ArraySize(order)); i++) Print(StringFormat("  %-60s %d", cKey[order[i]], cVal[order[i]]));

   //--- a) one row per trade
   int fh = FileOpen("RamanFX_Backtest_" + sym + ".csv", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(fh != INVALID_HANDLE)
     {
      FileWrite(fh, "ticket", "journal id", "open time", "close time", "side", "timeframe", "grade", "entry type", "open", "close", "sl initial", "tp",
                "lots", "commission", "swap", "profit", "net", "R", "R source", "hold minutes", "session", "weekday", "exit");
      for(int i = 0; i < nT; i++)
        {
         int dg = (int)MarketInfo(T[i].sym, MODE_DIGITS);
         FileWrite(fh, T[i].ticket, T[i].jid, TStamp(T[i].ot), TStamp(T[i].ct), T[i].dir > 0 ? "BUY" : "SELL", TF_N[T[i].k], T[i].grade, T[i].method,
                   DoubleToString(T[i].op, dg), DoubleToString(T[i].cp, dg), DoubleToString(T[i].sl0, dg), DoubleToString(T[i].tp0, dg), DoubleToString(T[i].lots, 2),
                   DoubleToString(T[i].comm, 2), DoubleToString(T[i].swap, 2), DoubleToString(T[i].profit, 2), DoubleToString(T[i].net, 2),
                   T[i].hasR ? DoubleToString(T[i].R, 3) : "", T[i].rsrc, DoubleToString(T[i].hold, 1), T[i].sess, KeyOf(T[i], 5), T[i].why);
        }
      FileClose(fh);
     }

   //--- c) MT4 "Detailed Statement" for the RamanFX journal (parseMT4)
   int fs = FileOpen("RamanFX_Backtest_" + sym + "_Statement.htm", FILE_WRITE | FILE_TXT | FILE_ANSI);
   if(fs != INVALID_HANDLE)
     {
      string nm = "ZoneBot Backtest " + sym + " " + TfName(_Period);
      double sc = 0, ss = 0, sp = 0;
      for(int i = 0; i < nT; i++) { sc += T[i].comm; ss += T[i].swap; sp += T[i].profit; }
      FileWriteString(fs, "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><title>Statement: " + IntegerToString(acct) + " - " + nm + "</title>\r\n");
      FileWriteString(fs, "<style type=\"text/css\">td { font: 8pt Tahoma, Arial; }</style></head>\r\n<body topmargin=1 marginheight=1>\r\n");
      FileWriteString(fs, "<div style=\"font: 14pt Times New Roman\"><b>RamanFX ZoneBot - Strategy Tester</b></div>\r\n");
      FileWriteString(fs, "<table width=820 cellspacing=1 cellpadding=3 border=0>\r\n");
      FileWriteString(fs, "<tr align=left><td colspan=2><b>Account: " + IntegerToString(acct) + "</b></td><td colspan=5><b>Name: " + nm + "</b></td><td colspan=2><b>Currency: " + ccy
                          + "</b></td><td colspan=5 align=right><b>" + TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES) + "</b></td></tr>\r\n");
      FileWriteString(fs, "<tr align=left><td colspan=14><b>Closed Transactions:</b></td></tr>\r\n");
      FileWriteString(fs, "<tr align=center bgcolor=\"#C0C0C0\"><td>Ticket</td><td nowrap>Open Time</td><td>Type</td><td>Size</td><td>Item</td><td>Price</td><td>S / L</td><td>T / P</td>"
                          + "<td nowrap>Close Time</td><td>Price</td><td>Commission</td><td>Taxes</td><td>Swap</td><td>Profit</td></tr>\r\n");
      FileWriteString(fs, "<tr align=right><td>0</td><td class=msdate nowrap>" + TStamp(gTestStart) + "</td><td>balance</td><td colspan=10 align=left>Deposit: backtest start balance</td><td>"
                          + DoubleToString(gStartBal, 2) + "</td></tr>\r\n");
      for(int i = 0; i < nT; i++)
        {
         int dg = (int)MarketInfo(T[i].sym, MODE_DIGITS); string lo = T[i].sym; StringToLower(lo);
         FileWriteString(fs, StringFormat("<tr align=right><td>%d</td><td class=msdate nowrap>%s</td><td>%s</td><td class=mspt>%s</td><td>%s</td><td>%s</td><td>%s</td><td>%s</td>",
                             T[i].jid, TStamp(T[i].ot), T[i].dir > 0 ? "buy" : "sell", DoubleToString(T[i].lots, 2), lo,
                             DoubleToString(T[i].op, dg), DoubleToString(T[i].sl0, dg), DoubleToString(T[i].tp0, dg)));
         FileWriteString(fs, StringFormat("<td class=msdate nowrap>%s</td><td>%s</td><td>%s</td><td>0.00</td><td>%s</td><td>%s</td></tr>\r\n",
                             TStamp(T[i].ct), DoubleToString(T[i].cp, dg), DoubleToString(T[i].comm, 2), DoubleToString(T[i].swap, 2), DoubleToString(T[i].profit, 2)));
        }
      FileWriteString(fs, StringFormat("<tr align=right><td colspan=10><b>Closed P/L:</b></td><td>%.2f</td><td>0.00</td><td>%.2f</td><td>%.2f</td></tr>\r\n", sc, ss, sp));
      FileWriteString(fs, "<tr align=left><td colspan=14><b>Summary:</b></td></tr>\r\n");
      FileWriteString(fs, StringFormat("<tr align=right><td>Deposit/Withdrawal:</td><td>%.2f</td><td>Credit Facility:</td><td>0.00</td><td>Closed Trade P/L:</td><td>%.2f</td></tr>\r\n", gStartBal, S.net));
      FileWriteString(fs, StringFormat("<tr align=right><td>Balance:</td><td>%.2f</td><td>Equity:</td><td>%.2f</td><td>Free Margin:</td><td>%.2f</td></tr>\r\n", endBal, endBal, endBal));
      FileWriteString(fs, "</table></body></html>\r\n");
      FileClose(fs);
     }

   //--- d) exits in the "Advanced Trade History Exporter" layout (parseExitCSV): initial SL/TP so the journal's R is right
   int fx = FileOpen("RamanFX_Backtest_" + sym + "_Exits.csv", FILE_WRITE | FILE_TXT | FILE_ANSI);
   if(fx != INVALID_HANDLE)
     {
      FileWriteString(fx, "Position ID,Symbol,Type,Open Time,Close Time,Duration (Hrs),Profit ($),Profit (Pts),Initial SL,Initial TP,Entry,Exit,Volume,Source,Exit Reason,Entry Order,Commission,Swap,Net ($),R,Entry TF,Grade,Entry Type\r\n");
      for(int i = 0; i < nT; i++)
        {
         int dg = (int)MarketInfo(T[i].sym, MODE_DIGITS); double pt = MarketInfo(T[i].sym, MODE_POINT);
         FileWriteString(fx, StringFormat("%d,%s,%s,%s,%s,%.2f,%.2f,%.1f,%s,%s,%s,%s,%.2f,ZoneBot tester,%s,limit,%.2f,%.2f,%.2f,%s,%s,%s,%s\r\n",
                             T[i].jid, T[i].sym, T[i].dir > 0 ? "buy" : "sell", TStamp(T[i].ot), TStamp(T[i].ct), T[i].hold / 60.0, T[i].profit,
                             pt > 0 ? T[i].dir * (T[i].cp - T[i].op) / pt : 0, DoubleToString(T[i].sl0, dg), DoubleToString(T[i].tp0, dg),
                             DoubleToString(T[i].op, dg), DoubleToString(T[i].cp, dg), T[i].lots, T[i].why, T[i].comm, T[i].swap, T[i].net,
                             T[i].hasR ? DoubleToString(T[i].R, 3) : "", TF_N[T[i].k], T[i].grade, T[i].method));
        }
      FileClose(fx);
     }
   Print("--- Files (tester\\files, i.e. <MT4 data folder>\\tester\\files) ---");
   Print("  RamanFX_Backtest_", sym, ".csv (every trade) | RamanFX_Backtest_", sym, "_KPIs.csv (overall + every group)");
   Print("  Import into RamanFX: RamanFX_Backtest_", sym, "_Statement.htm (account ", acct, ") and then RamanFX_Backtest_", sym, "_Exits.csv (initial stops for R)");
  }
