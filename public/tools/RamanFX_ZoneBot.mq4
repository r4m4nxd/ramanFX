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
//|  - 1% risk, always a stop, 1 trade per symbol                    |
//|  - cancels limits if the zone is removed or price reaches the    |
//|    target first; news / Asian session / Friday / spread filters  |
//|  - every filled trade is replayed with every TP & break-even     |
//|    variant on M1 data so we learn which management pays best     |
//| Modes: 0 Scanner (draw + alert), 1 Approve (chart buttons),      |
//|        2 Auto.                                                   |
//| Attach to ONE chart (any symbol). Allow live trading.            |
//| Logs (MQL4\Files): RamanFX_Bot_Signals.csv,                      |
//|                    RamanFX_Bot_Variants.csv                      |
//| News file (optional): MQL4\Files\RamanFX_News.csv with lines     |
//|   2026.10.17 12:30,USD   (UTC time, currency)                    |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "0.80"
#property strict

enum BotMode   { MODE_SCANNER = 0, MODE_APPROVE = 1, MODE_AUTO = 2 };
enum EntryMode { ENTRY_SF = 0, ENTRY_CONF = 1, ENTRY_BOTH = 2 };
enum LiveBE    { BE_NONE = 0, BE_AT_1R = 1, BE_AT_2R = 2 };
enum Manage    { MG_OFF = 0, MG_MENTOR = 1, MG_BE_ONLY = 2 };
enum TpMode    { TP_SWING = 0, TP_OPP_ZONE = 1, TP_NEAREST = 2 };
enum Grades    { GR_ALL = 0, GR_A = 1, GR_AB = 2, GR_B = 3, GR_C = 4 };

input BotMode   InpMode          = MODE_APPROVE; // Mode: Approve = bot finds + alerts, you check the chart and press Place
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
input double    InpMinDeparture  = 1.5;          // Departure: price must travel >= N x zone height away from the proximal line
input bool      InpRequireITF    = false;        // Skip when the intermediate TF trend points the other way (3-timeframe check)
input bool      InpCurveFilter   = false;        // Demand only in the lower third of the HTF curve (half if at an HTF demand), supply mirrored
input double    InpMaxDistATR    = 2.0;          // Zone must be within N x HTF ATR of price and in the first half of the way to target (no chasing)
input bool      InpUseMyLines    = true;         // Use YOUR trendlines on this chart for the trend, and YOUR rectangles as zones to advise
input bool      InpRequireQualified = false;     // Planner rule: the move away must have removed an opposing zone (set & forget)
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
input bool      InpPush          = true;         // Push to the MT4 phone app (Tools > Options > Notifications, MetaQuotes ID)
input bool      InpDraw          = false;        // Draw zones on this chart
input double    InpTrapATR       = 1.0;          // Liquidity trap: obvious level within N x ATR in front of the zone
input int       InpTrapSwing     = 3;            // Obvious level = swing with N bars each side
input bool      InpRequireTrap   = false;        // Only trade zones with a liquidity trap

//--- timeframe pairs (mentor's combos)
#define NTF 7
int TF_E[NTF] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1};
int TF_H[NTF] = {PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1, PERIOD_MN1};
int TF_I[NTF] = {PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};   // intermediate TF
string TF_N[NTF] = {"M1", "M5", "M15", "H1", "H4", "D1", "W1"};

struct Zone
  {
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
int OnInit()
  {
   startedAt = TimeLocal();
   BuildSymbols();
   ArrayResize(lastBar, ArraySize(syms));
   for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < NTF; k++) lastBar[i][k] = 0;
   LoadSims();
   StLoad();
   LoadNews();
   EnsureHeaders();
   LoadProps();
   busy = false; keep = "|"; lastClickNm = ""; lastClickMs = 0;
   viewK = GlobalVariableCheck("RFX_view_" + _Symbol) ? (int)GlobalVariableGet("RFX_view_" + _Symbol) : -1;
   lastPanelSig = "-";
   if(InpMode == MODE_APPROVE)
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
   Print("RamanFX ZoneBot started: ", ArraySize(syms), " symbols, mode ", EnumToString(InpMode));
   return(INIT_SUCCEEDED);
  }

void OnDeinit(const int reason)
  {
   EventKillTimer();
   FlushSignals(true);
   SaveSims();
   ObjectsDeleteAll(0, "RFXZ_");
   if(reason != REASON_CHARTCHANGE) ObjectsDeleteAll(0, "RFXB_");   // timeframe switch (View): buttons stay, OnInit re-syncs them
   ObjectsDeleteAll(0, "RFXN2_");
   if(reason != REASON_CHARTCHANGE) ObjectsDeleteAll(0, "RFXP_");
   Comment("");
   ObjectsDeleteAll(0, "RFXS_");
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
   string t = StringFormat("ZoneBot  %s | %s | %d pairs\n", InpMode == MODE_AUTO ? "AUTO" : (InpMode == MODE_APPROVE ? "APPROVE" : "SCANNER"), InpEntry == ENTRY_BOTH ? "S&F + conf" : (InpEntry == ENTRY_SF ? "set & forget" : "confirmation"), ArraySize(syms));
   if(!IsTradeAllowed() || !TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) t += "! AutoTrading is OFF\n";
   string blocked = BlockedNow(ArraySize(syms) > 0 ? syms[0] : _Symbol);
   int pend = 0, open = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--) if(OrderSelect(i, SELECT_BY_POS) && OurMagic(OrderMagicNumber())) { if(OrderType() <= OP_SELL) open++; else pend++; }
   if(InpUseMyLines) t += (myTrend == 0 ? "Bias: no trendline of yours on this chart" : "Bias " + (myTrend > 0 ? "UP" : "DOWN") + ": " + myTrendWhy) + "\n";
   t += (blocked == "" ? "Trading" : "Paused: " + blocked) + StringFormat("  |  %d pending, %d open\n", pend, open);
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
   for(int i = n; i < 8; i++) ObjectDelete(0, "RFXS_" + IntegerToString(i));
   for(int i = 0; i < n; i++) if(ls[i] != "") RightLabel(0, "RFXS_" + IntegerToString(i), ls[i], 20 + i * 15, i == 0 ? clrRoyalBlue : (StringFind(ls[i], "!") == 0 ? clrCrimson : clrDimGray), i == 0 ? 9 : 8);
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
   ObjectSetInteger(ch, nm, OBJPROP_SELECTABLE, false);
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
   ManageOrders();
   int total = ArraySize(syms) * NTF, done = 0;
   uint w0 = GetTickCount();
   bool warm = TimeLocal() - startedAt < 20;                         // first 20 s: 1 scan per tick while MT4 loads history
   for(int step = 0; step < total && done < (warm ? 1 : InpScansPerTick) && GetTickCount() - w0 < 400; step++)
     {
      int idx = (qPos + step) % total, i = idx / NTF, k = idx % NTF;
      if(!TfOn(k)) continue;
      datetime t = iTime(syms[i], TF_E[k], 0);
      if(t == 0 || t == lastBar[i][k]) continue;
      lastBar[i][k] = t;
      Scan(syms[i], k); scans++; done++; lastScanAt = TimeCurrent();
      qPos = (idx + 1) % total;
     }
   UpdateSims();
   FlushSignals(false);
   if(InpMode == MODE_APPROVE)
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

bool TfOn(int k)
  {
   if(k == 0) return InpTF_M1;
   if(k == 1) return InpTF_M5;
   if(k == 2) return InpTF_M15;
   if(k == 3) return InpTF_H1;
   if(k == 4) return InpTF_H4;
   if(k == 5) return InpTF_D1;
   return InpTF_W1;
  }

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
      // extended-range move-away candle: big body (>= 60%) closing near its extreme (top/bottom 20%)
      double lo = iLow(s, tf, L), lh = iHigh(s, tf, L), cl = iClose(s, tf, L);
      bool erc = Body(s, tf, L) / lr >= 0.6 && (dir > 0 ? (cl - lo) / lr >= 0.8 : (lh - cl) / lr >= 0.8);

      Zone z;
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.tLeg = iTime(s, tf, L);
      z.baseN = k; z.legRatio = ratio; z.cont = cont; z.departure = departure; z.erc = erc;
      z.grade = (ratio >= 2.5 && k <= 3 && erc && departure >= 2) ? "A" : ((ratio >= 1.8 && departure >= 1.5) ? "B" : "C");
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
   if(!InpUseMyLines || InpMode == MODE_SCANNER) return;
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
bool Qualified(string s, int etf, Zone &z[], int i)
  {
   datetime b0 = iTime(s, etf, z[i].legBar + z[i].baseN), b1 = iTime(s, etf, MathMax(z[i].legBar - 5, 0));
   for(int j = 0; j < ArraySize(z); j++) if(z[j].dir != z[i].dir && z[j].removed && z[j].tRemoved >= b0 && z[j].tRemoved <= b1) return true;
   return false;
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
   if(InpDraw && s == _Symbol && etf == _Period) DrawZones(z);
   int trend = HtfTrend(s, htf);
   if(InpUseMyLines && s == _Symbol && myTrend != 0) trend = myTrend;     // your trendlines decide the bias
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
   // every fresh zone in the HTF direction is checked; the best one (VP > trap > grade > R:R) is acted on
   int best = -1; double bScore = 0, bEntry = 0, bSl = 0, bTp = 0, bRr = 0; string bMethod = "", bDecision = "", bPg = ""; int bPs = 0; bool bCapped = false;
   for(int i = n - 1; i >= 0; i--)
     {
      if(z[i].removed || z[i].consumed || z[i].pen > 0.25) continue;   // a shallow wick (< 25%) keeps it tradable
      if(z[i].legBar > InpMaxZoneAge) break;
      if(!z[i].cont && !InpTradeVP) continue;                    // VP (reversal) zones only when enabled
      if(InpMode == MODE_APPROVE && IsDismissed(s, k, z[i].prox, false)) { Count("denied by you"); continue; }   // next-best zone gets advised
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
      double risk = MathAbs(entry - sl);
      if(tp > 0 && risk > 0) rr = MathAbs(tp - entry) / risk;
      string method = ConfirmedBy(s, etf, dir, z, z[i], hz, hn) ? "CONF" : "SF";
      double curve = Curve(s, htf, z[i].prox);

      if(trend == 0) reason = "HTF trend unclear";
      else if(trend != dir) reason = "against HTF trend";
      else if(InpEntry == ENTRY_SF && method == "CONF") method = "SF";
      if(reason == "" && InpRequireITF) { int it = HtfTrend(s, TF_I[k]); if(it == -dir) reason = "intermediate TF " + TfName(TF_I[k]) + " against"; }
      if(reason == "" && InpCurveFilter)
        {
         double lim = AtHtfZone(z[i], hz, hn, dir) ? 50 : 33;
         if((dir > 0 && curve > lim) || (dir < 0 && curve < 100 - lim)) reason = "zone not low/high enough in the HTF curve";
        }
      if(reason == "" && InpRequireQualified && method == "SF" && !Qualified(s, etf, z, i)) reason = "move away did not remove an opposing zone";
      // no chasing: a confirmed swing has formed and price has pulled back toward the zone
      double now = dir > 0 ? MarketInfo(s, MODE_BID) : MarketInfo(s, MODE_ASK), far = MathAbs(now - z[i].prox);
      double maxFar = MathMin(InpMaxDistATR * iATR(s, htf, 14, 1), tp > 0 ? 0.75 * MathAbs(tp - entry) : DBL_MAX);
      if(reason == "")
        {
         int ix = dir > 0 ? iHighest(s, etf, MODE_HIGH, MathMax(1, z[i].legBar), 1) : iLowest(s, etf, MODE_LOW, MathMax(1, z[i].legBar), 1);
         if(ix >= 0 && ix < 2) reason = "no pullback yet (price still at the swing)";
         else if(far > maxFar) reason = "zone too far from price";
        }
      if(reason == "" && InpEntry == ENTRY_CONF && method != "CONF") reason = "no confirmation";
      if(reason == "") { int tb; bool cr; z[i].trap = FindTrap(s, etf, dir, z[i].prox, z[i].dist, z[i].legBar - 1, z[i].legBar + z[i].baseN, tb, cr); z[i].trapBar = tb; z[i].crowded = cr; }
      if(reason == "" && InpRequireTrap && z[i].trap == 0) reason = "no liquidity trap";
      int ps = 0; string pg = "";
      if(reason == "") { ps = PlanScore(s, etf, htf, trend, z, i, hz, hn, curve, method); pg = PlanGrade(ps); if(!GradeAllowed(pg)) reason = StringFormat("grade %s (%d) filtered", pg, ps); }
      if(reason == "" && tp == 0) reason = "no opposing zone for target";
      if(reason == "" && rr < InpMinRR) reason = StringFormat("R:R %.2f < %.2f", rr, InpMinRR);
      if(reason == "" && spread > risk * InpMaxSpreadPct / 100.0) reason = "spread too wide";
      if(reason == "") reason = BlockedNow(s);
      if(reason == "" && HasOrder(s, k)) reason = "already an order on this symbol/timeframe";
      if(reason == "" && CountOrders(s) >= InpMaxPerSymbol) reason = "max orders on symbol";
      if(reason == "" && CountOrders("") >= InpMaxOrders) reason = "max bot orders reached";
      if(reason == "")
        {
         double ask = MarketInfo(s, MODE_ASK), bid = MarketInfo(s, MODE_BID);
         double stopLvl = MarketInfo(s, MODE_STOPLEVEL) * point;
         if(dir > 0 && ask - entry <= stopLvl) reason = "price too close to zone";
         if(dir < 0 && entry - bid <= stopLvl) reason = "price too close to zone";
        }
      string decision = reason == "" ? (InpMode == MODE_AUTO ? "ORDER" : (InpMode == MODE_APPROVE ? "PROPOSE" : "ALERT")) : "SKIP";
      LogSignal(s, k, z[i], entry, sl, tp, rr, trend, curve, method, spread / point, decision, reason, digits);
      Say(s, k, decision == "SKIP" ? "skip - " + reason + StringFormat(" (%s %s %s, grade %s)", TF_N[k], dir > 0 ? "demand" : "supply", DoubleToString(z[i].prox, digits), z[i].grade) : decision);
      if(reason != "") { Count(reason); if(StringFind(reason, "already an order") == 0 || StringFind(reason, "max ") == 0 || StringFind(reason, "Friday") == 0 || StringFind(reason, "weekend") == 0 || StringFind(reason, "Asian") == 0 || StringFind(reason, "news") == 0) return; continue; }

      // rank: planner score (VP bonus inside) + nearness to price
      double score = ps + 10.0 * (1.0 - MathMin(1.0, far / MathMax(maxFar, point))) - (z[i].crowded ? 4 : 0);   // nearest good zone wins; R:R is only a gate
      if(best < 0 || score > bScore) { best = i; bScore = score; bEntry = entry; bSl = sl; bTp = tp; bRr = rr; bMethod = method; bCapped = cappedByHtf; bDecision = decision; bPs = ps; bPg = pg; }
      continue;
     }
   if(best < 0) return;
   {
      int i = best, dir = z[i].dir; double entry = bEntry, sl = bSl, tp = bTp, rr = bRr; string method = bMethod, decision = bDecision, g = bPg; bool cappedByHtf = bCapped;
      string tag = StringFormat("%s %s %s %s %s 1:%.1f grade %s%s", s, TF_N[k], dir > 0 ? "BUY" : "SELL", z[i].cont ? "CP" : "VP", method, rr, g, z[i].trap > 0 ? " + liquidity trap" : "");
      tag += StringFormat(" (score %d)", bPs);
      Count(decision);
      string info = StringFormat("%s %s %s zone (grade %s %d) | %s trend %s | %s%s\n", dir > 0 ? "BUY" : "SELL", TF_N[k], dir > 0 ? "demand" : "supply", g, bPs, TfName(htf), trend > 0 ? "up" : "down", method == "CONF" ? "confirmation" : "set & forget", z[i].trap > 0 ? " | liquidity trap" : "");
      info += StringFormat("Why: fresh %s %s with the trend, stop %s, move away %.1fx, target %s %s", z[i].cont ? "CP" : "VP", z[i].cont ? (dir > 0 ? "RBR" : "DBD") : (dir > 0 ? "DBR" : "RBD"), z[i].cont ? "beyond distal" : "beyond swing " + (dir > 0 ? "valley" : "peak"), z[i].legRatio, cappedByHtf ? "before next" : "at nearest", cappedByHtf ? TfName(htf) + (dir > 0 ? " supply" : " demand") : (dir > 0 ? "swing high / supply" : "swing low / demand"));
      bool fresh = true;                                                 // approve mode: alert only for new / changed advice
      if(InpMode == MODE_APPROVE) fresh = AddProposal(s, k, dir, entry, sl, tp, z[i].dist, method, g, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
      if(fresh)
        {
         if(InpAlerts) Alert("RamanFX ZoneBot: ", tag);
         if(InpPush && !IsTesting()) SendNotification("RamanFX: " + tag + (InpMode == MODE_APPROVE ? " - check the chart and approve in MT4" : ""));
        }
      if(InpMode == MODE_AUTO) Place(s, k, dir, entry, sl, tp, z[i].dist, method, g, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
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

string BlockedNow(string s)
  {
   if(InpMaxDailyLossPct > 0 && DailyLossHit()) return "daily loss limit";
   datetime utc = TimeGMT();
   int h = TimeHour(utc), dow = TimeDayOfWeek(utc);
   if(dow == 5 && h >= InpFridayCutUTC) return "Friday cut-off";
   if(dow == 6 || dow == 0) return "weekend";
   if(InpSkipAsian)
     {
      bool asia = InpAsianStartUTC > InpAsianEndUTC ? (h >= InpAsianStartUTC || h < InpAsianEndUTC) : (h >= InpAsianStartUTC && h < InpAsianEndUTC);
      if(asia) return "Asian session";
     }
   for(int i = 0; i < ArraySize(newsTime); i++)
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
double StopFor(string s, int tf, Zone &z, double pip)
  {
   double buf = TfStopPips(tf) * InpStopScale * pip;
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
   double riskPctUse = InpRiskPct * ((InpHalfRiskC && grade == "C") ? 0.5 : 1.0);   // low odds = half risk
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
   string lines[]; int n = StringSplit(info, '\n', lines);
   for(int i = 0; i < n; i++) Print("#", t, " ", lines[i]);
   LogOrder(t, s, info);
   Annotate(t, s, entry, lines, prox, dist, tZone, k, dir);
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
      ChartRedraw(ch);
     }
  }

string Field(string cm, int idx) { string p[]; int n = StringSplit(cm, '|', p); return idx < n ? p[idx] : ""; }

void ManageOrders()
  {
   datetime utc = TimeGMT();
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
         if(OrderTakeProfit() > 0 && type == OP_BUYLIMIT && MarketInfo(s, MODE_BID) >= OrderOpenPrice() + 0.8 * (OrderTakeProfit() - OrderOpenPrice())) why = "price ran 80% to target before fill";
         if(OrderTakeProfit() > 0 && type == OP_SELLLIMIT && MarketInfo(s, MODE_ASK) <= OrderOpenPrice() - 0.8 * (OrderOpenPrice() - OrderTakeProfit())) why = "price ran 80% to target before fill";
         if(fridayCut) why = "Friday cut-off";
         if(InpMaxDailyLossPct > 0 && DailyLossHit()) why = "daily loss limit";
         if(why == "" && iBarShift(s, etf, OrderOpenTime()) > InpPendingBars) why = "expired";
         if(why == "") { string b = BlockedNow(s); if(StringFind(b, "news") == 0) why = b; }
         if(why != "" && OrderDelete(OrderTicket())) Print("Cancelled ", s, " limit: ", why);
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
      if(InpManage != MG_OFF) ManageOpen(OrderTicket(), k, si);
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
   if(InpManage == MG_MENTOR && InpHalfRiskAt1R && gainR >= 1.0)
     { double c = open - dir * 0.5 * R; if(dir * (c - newSl) > point) { newSl = c; why = "+1R reached -> risk cut to half (stop at -0.5R)"; } }
   double beTrig = InpLiveBE == BE_AT_1R ? 1.0 : (InpLiveBE == BE_AT_2R ? 2.0 : 99);
   if(gainR >= beTrig)
     { double c = open + dir * spread; if(dir * (c - newSl) > point) { newSl = c; why = StringFormat("+%.0fR reached -> stop to break-even", beTrig); } }
   if(InpManage == MG_MENTOR && InpTrailZones)
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
   if(InpManage == MG_MENTOR && InpPartialAt3R && gainR >= 3.0 && OrderSelect(ticket, SELECT_BY_TICKET) && StringFind(OrderComment(), "from #") < 0)
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
   if(id == CHARTEVENT_CHART_CHANGE) { if(InpMode == MODE_APPROVE) DrawProposals(); return; }   // resized: the width is in the panel signature
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
