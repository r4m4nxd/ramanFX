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
#property version   "0.30"
#property strict

enum BotMode   { MODE_SCANNER = 0, MODE_APPROVE = 1, MODE_AUTO = 2 };
enum EntryMode { ENTRY_SF = 0, ENTRY_CONF = 1, ENTRY_BOTH = 2 };
enum LiveBE    { BE_NONE = 0, BE_AT_1R = 1, BE_AT_2R = 2 };
enum Manage    { MG_OFF = 0, MG_MENTOR = 1, MG_BE_ONLY = 2 };

input BotMode   InpMode          = MODE_AUTO;    // Mode
input EntryMode InpEntry         = ENTRY_BOTH;   // Entry method
input string    InpSymbols       = "";           // Symbols (comma list; empty = all forex in Market Watch)
input string    InpSuffix        = "";           // Broker symbol suffix (e.g. .a)
input bool      InpTF_M1         = true;         // Trade 1m entries (HTF 15m)
input bool      InpTF_M5         = true;         // Trade 5m entries (HTF H1)
input bool      InpTF_M15        = true;         // Trade 15m entries (HTF H4)
input bool      InpTF_H1         = true;         // Trade H1 entries (HTF 1D)
input bool      InpTF_H4         = true;         // Trade H4 entries (HTF 1W)
input double    InpRiskPct       = 1.0;          // Risk per trade (% of balance)
input double    InpMinRR         = 2.0;          // Minimum reward:risk to opposing zone
input double    InpMinLegRatio   = 1.2;          // Move-away range / largest base candle (loose)
input int       InpMaxBase       = 6;            // Max basing candles
input double    InpMaxZoneATR    = 1.5;          // Max zone height in ATR(14) (similar-size rule)
input int       InpLookback      = 300;          // Bars scanned per timeframe
input int       InpMaxZoneAge    = 200;          // Ignore zones older than this many bars
input double    InpStopBufferPts = 10;           // Extra stop buffer beyond distal (points)
input double    InpMinStopPips   = 3.0;          // Minimum stop distance (pips) - tiny zones get a wider stop, smaller lots
input double    InpMinStopSpreads= 3.0;          // ...and at least this many spreads
input double    InpMaxLots       = 2.0;          // Hard cap on lots per order
input double    InpMaxMarginPct  = 10.0;         // Skip if the order needs more than this % of free margin
input double    InpMaxSpreadPct  = 15;           // Max spread as % of the stop distance
input bool      InpSkipAsian     = true;         // No new orders in the Asian session
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
input int       InpSimDays       = 10;           // Variant replay horizon (days)
input int       InpMagic         = 770100;       // Magic number base
input bool      InpAlerts        = true;         // Pop-up / push alerts for new setups
input bool      InpDraw          = true;         // Draw zones on this chart
input double    InpTrapATR       = 1.0;          // Liquidity trap: obvious level within N x ATR in front of the zone
input int       InpTrapSwing     = 3;            // Obvious level = swing with N bars each side
input bool      InpRequireTrap   = false;        // Only trade zones with a liquidity trap

//--- timeframe pairs (mentor's combos)
int TF_E[5] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4};
int TF_H[5] = {PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1};
string TF_N[5] = {"M1", "M5", "M15", "H1", "H4"};

struct Zone
  {
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
datetime lastBar[][5];
string   newsCcy[];
datetime newsTime[];
datetime lastNewsLoad = 0;
datetime lastSimBar = 0;
int      knownTickets[];

// Approve mode proposals
struct Proposal { string sym; int k; int dir; double entry, sl, tp, dist, rr, prox; bool trap; string method, grade, info; datetime t, tZone; };
Proposal props[];

//+------------------------------------------------------------------+
int OnInit()
  {
   BuildSymbols();
   ArrayResize(lastBar, ArraySize(syms));
   for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < 5; k++) lastBar[i][k] = 0;
   LoadSims();
   StLoad();
   LoadNews();
   EnsureHeaders();
   EventSetTimer(2);
   Print("RamanFX ZoneBot started: ", ArraySize(syms), " symbols, mode ", EnumToString(InpMode));
   return(INIT_SUCCEEDED);
  }

void OnDeinit(const int reason)
  {
   EventKillTimer();
   SaveSims();
   ObjectsDeleteAll(0, "RFXZ_");
   ObjectsDeleteAll(0, "RFXB_");
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
void Status()
  {
   string t = StringFormat("ZoneBot  %s | %s | %d pairs\n", InpMode == MODE_AUTO ? "AUTO" : (InpMode == MODE_APPROVE ? "APPROVE" : "SCANNER"), InpEntry == ENTRY_BOTH ? "S&F + conf" : (InpEntry == ENTRY_SF ? "set & forget" : "confirmation"), ArraySize(syms));
   if(!IsTradeAllowed() || !TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)) t += "! AutoTrading is OFF\n";
   string blocked = BlockedNow(ArraySize(syms) > 0 ? syms[0] : _Symbol);
   int pend = 0, open = 0;
   for(int i = OrdersTotal() - 1; i >= 0; i--) if(OrderSelect(i, SELECT_BY_POS) && OurMagic(OrderMagicNumber())) { if(OrderType() <= OP_SELL) open++; else pend++; }
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
   string ls[]; int n = StringSplit(t, '\n', ls);
   ObjectsDeleteAll(0, "RFXS_");
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

void Work()
  {
   if(TimeCurrent() - lastNewsLoad > 3600) LoadNews();
   ManageOrders();
   for(int i = 0; i < ArraySize(syms); i++)
      for(int k = 0; k < 5; k++)
        {
         if(!TfOn(k)) continue;
         datetime t = iTime(syms[i], TF_E[k], 0);
         if(t == 0 || t == lastBar[i][k]) continue;
         lastBar[i][k] = t;
         Scan(syms[i], k); scans++; lastScanAt = TimeCurrent();
        }
   UpdateSims();
   if(InpMode == MODE_APPROVE) DrawProposals();
   Status();
  }

bool TfOn(int k)
  {
   if(k == 0) return InpTF_M1;
   if(k == 1) return InpTF_M5;
   if(k == 2) return InpTF_M15;
   if(k == 3) return InpTF_H1;
   return InpTF_H4;
  }

//+------------------------------------------------------------------+
//| Symbols                                                          |
//+------------------------------------------------------------------+
void BuildSymbols()
  {
   ArrayResize(syms, 0);
   if(IsTesting()) { AddSym(_Symbol); return; }
   if(StringLen(InpSymbols) > 0)
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
   int scan = MathMin(iBars(s, tf) - InpTrapSwing - 2, fromBar + 150);
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

      Zone z;
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.tLeg = iTime(s, tf, L);
      z.baseN = k; z.legRatio = ratio; z.cont = cont;
      z.grade = (ratio >= 2.5 && k <= 3) ? "A" : (ratio >= 1.8 ? "B" : "C");
      z.tested = false; z.removed = false; z.tRemoved = 0; z.tTouched = 0; z.trap = 0; z.trapBar = -1; z.crowded = false;
      for(int j = sa - 1; j >= 1; j--)                                       // status since the stay-away
        {
         if(dir > 0)
           {
            if(iClose(s, tf, j) < dist) { z.removed = true; z.tRemoved = iTime(s, tf, j); break; }
            if(!z.tested && iLow(s, tf, j) <= prox) { z.tested = true; z.tTouched = iTime(s, tf, j); }
           }
         else
           {
            if(iClose(s, tf, j) > dist) { z.removed = true; z.tRemoved = iTime(s, tf, j); break; }
            if(!z.tested && iHigh(s, tf, j) >= prox) { z.tested = true; z.tTouched = iTime(s, tf, j); }
           }
        }
      if(!z.removed) { int tb; bool cr; z.trap = FindTrap(s, tf, dir, prox, dist, sa, L + k, tb, cr); z.trapBar = tb; z.crowded = cr; }
      int n = ArraySize(out); ArrayResize(out, n + 1); out[n] = z;
     }
   return ArraySize(out);
  }

//+------------------------------------------------------------------+
//| HTF trend from fractal swings: HH+HL = up, LH+LL = down          |
//+------------------------------------------------------------------+
int HtfTrend(string s, int htf)
  {
   double hi[2], lo[2]; int nh = 0, nl = 0;
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
   double point = MarketInfo(s, MODE_POINT);
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double spread = MarketInfo(s, MODE_ASK) - MarketInfo(s, MODE_BID);

   // fresh HTF zones: an opposing HTF zone in the way caps the target
   Zone hz[];
   int hn = DetectZones(s, htf, hz);
   // newest fresh continuation zone in the HTF direction
   for(int i = n - 1; i >= 0; i--)
     {
      if(z[i].removed || z[i].tested) continue;
      if(z[i].legBar > InpMaxZoneAge) break;
      if(!z[i].cont) continue;                                   // RBR / DBD only
      int dir = z[i].dir;
      string reason = "";
      double entry = 0, sl = 0, tp = 0, rr = 0;
      // opposing fresh zone = target
      double opp = 0;
      for(int j = 0; j < n; j++)
        {
         if(z[j].dir == dir || z[j].removed || z[j].tested) continue;
         if(dir > 0 && z[j].prox > z[i].prox && (opp == 0 || z[j].prox < opp)) opp = z[j].prox;
         if(dir < 0 && z[j].prox < z[i].prox && (opp == 0 || z[j].prox > opp)) opp = z[j].prox;
        }
      if(dir > 0)
        {
         entry = z[i].prox + spread;                              // buy limit fills on Ask
         sl = z[i].dist - InpStopBufferPts * point;
         tp = opp > 0 ? opp - spread : 0;
        }
      else
        {
         entry = z[i].prox;
         sl = z[i].dist + InpStopBufferPts * point + spread;
         tp = opp > 0 ? opp + spread : 0;
        }
      // the target can't run through a fresh opposing HTF zone - cap it just before that zone
      double hOpp = 0;
      for(int j = 0; j < hn; j++)
        {
         if(hz[j].dir == dir || hz[j].removed || hz[j].tested) continue;
         if(dir > 0 && hz[j].prox > entry && (hOpp == 0 || hz[j].prox < hOpp)) hOpp = hz[j].prox;
         if(dir < 0 && hz[j].prox < entry && (hOpp == 0 || hz[j].prox > hOpp)) hOpp = hz[j].prox;
        }
      bool cappedByHtf = false;
      if(hOpp > 0 && (tp == 0 || (dir > 0 && hOpp - spread < tp) || (dir < 0 && hOpp + spread > tp))) { tp = dir > 0 ? hOpp - spread : hOpp + spread; cappedByHtf = true; }
      // never a noise-sized stop: at least InpMinStopPips and InpMinStopSpreads x spread
      double pip = point * ((digits == 3 || digits == 5) ? 10 : 1);
      double minStop = MathMax(InpMinStopPips * pip, InpMinStopSpreads * spread);
      if(MathAbs(entry - sl) < minStop) sl = dir > 0 ? entry - minStop : entry + minStop;
      double risk = MathAbs(entry - sl);
      if(tp > 0 && risk > 0) rr = MathAbs(tp - entry) / risk;
      string method = ConfirmedBy(s, etf, htf, dir, z, z[i]) ? "CONF" : "SF";

      if(trend == 0) reason = "HTF trend unclear";
      else if(trend != dir) reason = "against HTF trend";
      else if(InpEntry == ENTRY_SF && method == "CONF") method = "SF";
      if(reason == "" && InpEntry == ENTRY_CONF && method != "CONF") reason = "no confirmation";
      if(reason == "" && InpRequireTrap && z[i].trap == 0) reason = "no liquidity trap";
      if(reason == "" && tp == 0) reason = "no opposing zone for target";
      if(reason == "" && rr < InpMinRR) reason = StringFormat("R:R %.2f < %.2f", rr, InpMinRR);
      if(reason == "" && spread > risk * InpMaxSpreadPct / 100.0) reason = "spread too wide";
      if(reason == "") reason = BlockedNow(s);
      if(reason == "" && HasOrder(s)) reason = "already one trade on symbol";
      if(reason == "")
        {
         double ask = MarketInfo(s, MODE_ASK), bid = MarketInfo(s, MODE_BID);
         double stopLvl = MarketInfo(s, MODE_STOPLEVEL) * point;
         if(dir > 0 && ask - entry <= stopLvl) reason = "price too close to zone";
         if(dir < 0 && entry - bid <= stopLvl) reason = "price too close to zone";
        }
      double curve = Curve(s, htf, z[i].prox);
      string decision = reason == "" ? (InpMode == MODE_AUTO ? "ORDER" : (InpMode == MODE_APPROVE ? "PROPOSE" : "ALERT")) : "SKIP";
      LogSignal(s, k, z[i], entry, sl, tp, rr, trend, curve, method, spread / point, decision, reason, digits);
      if(reason != "") { Count(reason); if(StringFind(reason, "already one trade") == 0 || StringFind(reason, "Friday") == 0 || StringFind(reason, "weekend") == 0 || StringFind(reason, "Asian") == 0 || StringFind(reason, "news") == 0) return; continue; }

      string tag = StringFormat("%s %s %s %s 1:%.1f grade %s%s", s, TF_N[k], dir > 0 ? "BUY" : "SELL", method, rr, z[i].grade, z[i].trap > 0 ? " + liquidity trap" : "");
      if(InpAlerts) Alert("RamanFX ZoneBot: ", tag);
      Count(decision);
      string info = StringFormat("%s %s %s zone (grade %s) | %s trend %s | %s%s\n", dir > 0 ? "BUY" : "SELL", TF_N[k], dir > 0 ? "demand" : "supply", z[i].grade, TfName(htf), trend > 0 ? "up" : "down", method == "CONF" ? "confirmation" : "set & forget", z[i].trap > 0 ? " | liquidity trap" : "");
      info += StringFormat("Why: fresh %s with the trend, move away %.1fx, target before next %s %s zone", dir > 0 ? "RBR" : "DBD", z[i].legRatio, cappedByHtf ? TfName(htf) : TF_N[k], dir > 0 ? "supply" : "demand");
      if(InpMode == MODE_AUTO) Place(s, k, dir, entry, sl, tp, z[i].dist, method, z[i].grade, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
      else if(InpMode == MODE_APPROVE) AddProposal(s, k, dir, entry, sl, tp, z[i].dist, method, z[i].grade, rr, z[i].trap > 0, info, z[i].prox, iTime(s, etf, z[i].legBar + z[i].baseN));
      return;
     }
  }

// Confirmation: price touched an HTF zone in our direction within N entry bars, and an
// opposing entry-TF zone was removed after that touch; the candidate formed after the touch.
bool ConfirmedBy(string s, int etf, int htf, int dir, Zone &ez[], Zone &cand)
  {
   Zone hz[];
   int n = DetectZones(s, htf, hz);
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
string BlockedNow(string s)
  {
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

bool HasOrder(string s)
  {
   for(int i = OrdersTotal() - 1; i >= 0; i--)
      if(OrderSelect(i, SELECT_BY_POS) && OrderSymbol() == s && OurMagic(OrderMagicNumber())) return true;
   return false;
  }

double Lots(string s, double stopDist)
  {
   double tv = MarketInfo(s, MODE_TICKVALUE), ts = MarketInfo(s, MODE_TICKSIZE);
   if(tv <= 0 || ts <= 0 || stopDist <= 0) return 0;
   double perLot = stopDist / ts * tv;
   double lots = AccountBalance() * InpRiskPct / 100.0 / perLot;
   double step = MarketInfo(s, MODE_LOTSTEP), mn = MarketInfo(s, MODE_MINLOT), mx = MarketInfo(s, MODE_MAXLOT);
   lots = MathFloor(lots / step) * step;
   if(lots < mn) return 0;                                      // can't keep risk <= target
   return MathMin(lots, mx);
  }

void Place(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade, double rr, bool trap, string info, double prox, datetime tZone)
  {
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double point = MarketInfo(s, MODE_POINT), pip = point * ((digits == 3 || digits == 5) ? 10 : 1);
   double stopDist = MathAbs(entry - sl);
   double lots = Lots(s, stopDist);
   if(lots <= 0) { Print(s, ": lot size below broker minimum at ", InpRiskPct, "% risk - skipped"); Count("lot below broker minimum"); return; }
   if(lots > InpMaxLots) { lots = MathFloor(InpMaxLots / MarketInfo(s, MODE_LOTSTEP)) * MarketInfo(s, MODE_LOTSTEP); }
   // real money at risk and margin, double-checked before sending
   double tv = MarketInfo(s, MODE_TICKVALUE), ts = MarketInfo(s, MODE_TICKSIZE);
   double riskMoney = stopDist / ts * tv * lots;
   double riskPct = 100.0 * riskMoney / AccountBalance();
   double margin = MarketInfo(s, MODE_MARGINREQUIRED) * lots;
   if(riskPct > InpRiskPct * 1.05) { Print(s, StringFormat(": risk %.2f%% above %.2f%% - skipped", riskPct, InpRiskPct)); Count("risk check failed"); return; }
   if(margin > AccountFreeMargin() * InpMaxMarginPct / 100.0) { Print(s, StringFormat(": needs margin %.2f > %.0f%% of free margin - skipped", margin, InpMaxMarginPct)); Count("margin too high"); return; }
   if(AccountFreeMarginCheck(s, dir > 0 ? OP_BUY : OP_SELL, lots) <= 0 || GetLastError() == ERR_NOT_ENOUGH_MONEY) { Count("not enough free margin"); return; }
   info += StringFormat("\nRisk %.2f %s (%.2f%%) | %.2f lots | stop %.1f pips | R:R 1:%.1f",
                        riskMoney, AccountCurrency(), riskPct, lots, stopDist / pip, rr);
   // short human comment (MT4 allows 31 characters); full reasoning goes to the log, Experts tab and chart
   // e.g. "2 M5 demand A, H1 up, 1:4.8 trap" (MT4 keeps 31 characters)
   // Starts with a rank so the Comment column sorts 1 minute -> 1 month: 1 M1, 2 M5, 3 M15, 4 H1, 5 H4
   string cm = StringFormat("%d %s %s %s, %s %s, 1:%.1f", k + 1, TF_N[k], dir > 0 ? "demand" : "supply", grade, TfName(TF_H[k]), dir > 0 ? "up" : "down", rr);
   if(method == "CONF" && StringLen(cm) <= 26) cm += " conf";
   if(trap && StringLen(cm) <= 26) cm += " trap";
   int type = dir > 0 ? OP_BUYLIMIT : OP_SELLLIMIT;
   int t = OrderSend(s, type, lots, NormalizeDouble(entry, digits), 3, NormalizeDouble(sl, digits), NormalizeDouble(tp, digits), cm, MagicFor(k, method), 0, dir > 0 ? clrLime : clrRed);
   if(t < 0) { int e = GetLastError(); Print("OrderSend failed ", s, " error ", e); Count("order rejected by broker (error " + IntegerToString(e) + ")"); return; }
   StSet(t, k, method, dist, stopDist / point, grade);
   string lines[]; int n = StringSplit(info, '\n', lines);
   for(int i = 0; i < n; i++) Print("#", t, " ", lines[i]);
   LogOrder(t, s, info);
   Annotate(t, s, entry, lines, prox, dist, tZone, k, dir);
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
   int f = FileOpen("RamanFX_Bot_State.csv", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   for(int j = 0; j < ArraySize(stT); j++) FileWrite(f, stT[j], stK[j], stM[j], DoubleToString(stDist[j], 6), DoubleToString(stRpts[j], 1), stG[j]);
   FileClose(f);
  }
void StLoad()
  {
   int f = FileOpen("RamanFX_Bot_State.csv", FILE_READ | FILE_CSV | FILE_ANSI, ',');
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
int KOf(int magic) { int k = (magic - InpMagic) % 10; return (k >= 0 && k <= 4) ? k : 1; }

void LogOrder(int t, string s, string info)
  {
   bool fresh = !FileIsExist("RamanFX_Bot_Orders.csv");
   int f = OpenAppend("RamanFX_Bot_Orders.csv");
   if(f == INVALID_HANDLE) return;
   if(fresh) FileWrite(f, "Time", "Ticket", "Symbol", "Reasoning");
   string flat = info; StringReplace(flat, "\n", " | ");
   FileWrite(f, TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES), t, s, flat);
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
      int nL = ArraySize(lines);
      for(int i = 0; i < nL; i++)
        {
         string nm = StringFormat("RFXO_%d_%d", t, i);
         RightLabel(ch, nm, lines[i], 18 + (nL - 1 - i) * 14, i == 0 ? clrRoyalBlue : clrDimGray, 8);
         ObjectSetInteger(ch, nm, OBJPROP_CORNER, CORNER_RIGHT_LOWER);
         ObjectSetInteger(ch, nm, OBJPROP_ANCHOR, ANCHOR_RIGHT_LOWER);
        }
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
      string s = OrderSymbol(); string cm = OrderComment();
      int type = OrderType();
      int si = StIdx(OrderTicket());
      int k = si >= 0 ? stK[si] : KOf(OrderMagicNumber());
      int etf = TF_E[k];
      double dist = si >= 0 ? stDist[si] : 0;
      double point = MarketInfo(s, MODE_POINT);
      if(type == OP_BUYLIMIT || type == OP_SELLLIMIT)
        {
         string why = "";
         double c1 = iClose(s, etf, 1);
         if(dist > 0 && type == OP_BUYLIMIT && c1 < dist) why = "zone removed";
         if(dist > 0 && type == OP_SELLLIMIT && c1 > dist) why = "zone removed";
         if(OrderTakeProfit() > 0 && type == OP_BUYLIMIT && MarketInfo(s, MODE_BID) >= OrderTakeProfit()) why = "target hit before fill";
         if(OrderTakeProfit() > 0 && type == OP_SELLLIMIT && MarketInfo(s, MODE_ASK) <= OrderTakeProfit()) why = "target hit before fill";
         if(fridayCut) why = "Friday cut-off";
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
   m.ticket = ticket; m.sym = OrderSymbol(); int k = si >= 0 ? stK[si] : KOf(OrderMagicNumber()); m.tf = TF_N[k];
   m.method = OrderMagicNumber() - InpMagic >= 10 ? "CONF" : "SF"; m.grade = si >= 0 ? stG[si] : "";
   m.dir = OrderType() == OP_BUY ? 1 : -1; m.entry = OrderOpenPrice(); m.R = Rp; m.opp = OrderTakeProfit();
   m.t0 = OrderOpenTime(); m.tLast = 0; m.done = false;
   int s = ArraySize(sims); ArrayResize(sims, s + 1); sims[s] = m;
   SaveSims();
  }

// Replays every TP x BE variant over M1 bars from the fill. SL is assumed hit first when a bar touches both.
void UpdateSims()
  {
   datetime b = iTime(_Symbol, PERIOD_M1, 1);
   if(b == lastSimBar) return;
   lastSimBar = b;
   bool changed = false;
   for(int i = 0; i < ArraySize(sims); i++)
     {
      if(sims[i].done) continue;
      datetime horizon = sims[i].t0 + InpSimDays * 86400;
      bool finished = TimeCurrent() > horizon;
      int start = iBarShift(sims[i].sym, PERIOD_M1, sims[i].t0);
      if(start < 0) continue;
      // run every variant from the fill to the latest closed bar
      double res[NV]; datetime ex[NV]; string why[NV]; bool open[NV]; double sl[NV]; bool half[NV];
      for(int v = 0; v < NV; v++) { res[v] = 0; ex[v] = 0; why[v] = ""; open[v] = true; sl[v] = sims[i].entry - sims[i].dir * sims[i].R; half[v] = false; }
      int dir = sims[i].dir; double e = sims[i].entry, R = sims[i].R;
      for(int sh = start; sh >= 1; sh--)
        {
         double hi = iHigh(sims[i].sym, PERIOD_M1, sh), lo = iLow(sims[i].sym, PERIOD_M1, sh);
         datetime tt = iTime(sims[i].sym, PERIOD_M1, sh);
         if(tt > horizon) break;
         double fav = dir > 0 ? (hi - e) / R : (e - lo) / R;     // best excursion this bar (R)
         double adv = dir > 0 ? (lo - e) / R : (e - hi) / R;     // worst excursion this bar (R)
         for(int v = 0; v < NV; v++)
           {
            if(!open[v]) continue;
            int tpv = v / 4, bev = v % 4;
            double slR = dir > 0 ? (sl[v] - e) / R : (e - sl[v]) / R;
            if(adv <= slR)                                          // stop first (conservative)
              {
               res[v] += (half[v] ? 0.75 : 1.0) * slR; open[v] = false; ex[v] = tt; why[v] = slR >= 0 ? "BE/locked" : "SL";
               continue;
              }
            double tpR = tpv == 1 ? 2 : (tpv == 2 ? 3 : (tpv == 3 ? 5 : (sims[i].opp > 0 ? MathAbs(sims[i].opp - e) / R : 99)));
            if(tpv == 4 && !half[v] && fav >= 3) { res[v] += 0.25 * 3; half[v] = true; }
            if(fav >= tpR) { res[v] += (half[v] ? 0.75 : 1.0) * tpR; open[v] = false; ex[v] = tt; why[v] = "TP"; continue; }
            // break-even moves take effect from the next bar
            if(bev == 1 && fav >= 1 && slR < 0) sl[v] = e;
            if(bev == 2 && fav >= 2 && slR < 0) sl[v] = e;
            if(bev == 3 && fav >= 2 && slR < 0.5) sl[v] = e + dir * 0.5 * R;
           }
        }
      bool all = true;
      for(int v = 0; v < NV; v++) if(open[v]) all = false;
      if(all || finished)
        {
         double last = dir > 0 ? iBid(sims[i].sym) : iAsk(sims[i].sym);
         for(int v = 0; v < NV; v++)
           {
            if(open[v]) { res[v] += (half[v] ? 0.75 : 1.0) * (dir > 0 ? (last - e) / R : (e - last) / R); ex[v] = TimeCurrent(); why[v] = "horizon"; }
            LogVariant(sims[i], TP_N[v / 4], BE_N[v % 4], res[v], ex[v], why[v]);
           }
         sims[i].done = true; changed = true;
        }
     }
   if(changed) SaveSims();
  }
double iBid(string s) { return MarketInfo(s, MODE_BID); }
double iAsk(string s) { return MarketInfo(s, MODE_ASK); }

void SaveSims()
  {
   int f = FileOpen("RamanFX_Bot_Sims.dat", FILE_WRITE | FILE_CSV | FILE_ANSI, ',');
   if(f == INVALID_HANDLE) return;
   for(int i = 0; i < ArraySize(sims); i++)
      if(!sims[i].done)
         FileWrite(f, sims[i].ticket, sims[i].sym, sims[i].tf, sims[i].method, sims[i].grade, sims[i].dir,
                   DoubleToString(sims[i].entry, 6), DoubleToString(sims[i].R, 6), DoubleToString(sims[i].opp, 6), (long)sims[i].t0);
   FileClose(f);
  }

void LoadSims()
  {
   ArrayResize(sims, 0);
   int f = FileOpen("RamanFX_Bot_Sims.dat", FILE_READ | FILE_CSV | FILE_ANSI, ',');
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

void LogSignal(string s, int k, Zone &z, double entry, double sl, double tp, double rr, int trend, double curve, string method, double spreadPts, string decision, string reason, int digits)
  {
   int f = OpenAppend("RamanFX_Bot_Signals.csv");
   if(f == INVALID_HANDLE) return;
   FileWrite(f, TimeToString(TimeCurrent(), TIME_DATE | TIME_MINUTES), s, TF_N[k], TfName(TF_H[k]), z.dir > 0 ? "BUY" : "SELL", z.dir > 0 ? "RBR" : "DBD", z.grade,
             DoubleToString(z.legRatio, 2), z.baseN, DoubleToString(z.prox, digits), DoubleToString(z.dist, digits),
             DoubleToString(entry, digits), DoubleToString(sl, digits), DoubleToString(tp, digits), DoubleToString(rr, 2),
             trend > 0 ? "up" : (trend < 0 ? "down" : "side"), DoubleToString(curve, 0), method, DoubleToString(spreadPts, 0), decision, reason, z.trap > 0 ? DoubleToString(z.trap, digits) : "", z.crowded ? "yes" : "");
   FileClose(f);
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
   switch(tf) { case PERIOD_M1: return "M1"; case PERIOD_M5: return "M5"; case PERIOD_M15: return "M15"; case PERIOD_H1: return "H1"; case PERIOD_H4: return "H4"; case PERIOD_D1: return "D1"; case PERIOD_W1: return "W1"; }
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
void AddProposal(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade, double rr, bool trap, string info, double prox, datetime tZone)
  {
   for(int i = 0; i < ArraySize(props); i++) if(props[i].sym == s && props[i].k == k) return;
   Proposal p; p.sym = s; p.k = k; p.dir = dir; p.entry = entry; p.sl = sl; p.tp = tp; p.dist = dist; p.method = method; p.grade = grade; p.rr = rr; p.trap = trap; p.info = info; p.prox = prox; p.tZone = tZone; p.t = TimeCurrent();
   int n = ArraySize(props); ArrayResize(props, n + 1); props[n] = p;
  }

void DrawProposals()
  {
   ObjectsDeleteAll(0, "RFXB_");
   for(int i = ArraySize(props) - 1; i >= 0; i--)                        // drop stale proposals (>2h)
      if(TimeCurrent() - props[i].t > 7200 || HasOrder(props[i].sym)) { for(int j = i; j < ArraySize(props) - 1; j++) props[j] = props[j + 1]; ArrayResize(props, ArraySize(props) - 1); }
   for(int i = 0; i < ArraySize(props); i++)
     {
      string nm = "RFXB_" + IntegerToString(i);
      double rr = MathAbs(props[i].tp - props[i].entry) / MathMax(MathAbs(props[i].entry - props[i].sl), 1e-10);
      ObjectCreate(0, nm, OBJ_BUTTON, 0, 0, 0);
      ObjectSetInteger(0, nm, OBJPROP_XDISTANCE, 10); ObjectSetInteger(0, nm, OBJPROP_YDISTANCE, 30 + i * 28);
      ObjectSetInteger(0, nm, OBJPROP_XSIZE, 300); ObjectSetInteger(0, nm, OBJPROP_YSIZE, 24);
      ObjectSetString(0, nm, OBJPROP_TEXT, StringFormat("Approve %s %s %s %s 1:%.1f (%s)", props[i].sym, TF_N[props[i].k], props[i].dir > 0 ? "BUY" : "SELL", props[i].method, rr, props[i].grade));
      ObjectSetInteger(0, nm, OBJPROP_BGCOLOR, props[i].dir > 0 ? clrDarkGreen : clrMaroon);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, clrWhite);
     }
  }

void OnChartEvent(const int id, const long &lparam, const double &dparam, const string &sparam)
  {
   if(id != CHARTEVENT_OBJECT_CLICK || StringFind(sparam, "RFXB_") != 0) return;
   int i = (int)StringToInteger(StringSubstr(sparam, 5));
   if(i < 0 || i >= ArraySize(props)) return;
   Place(props[i].sym, props[i].k, props[i].dir, props[i].entry, props[i].sl, props[i].tp, props[i].dist, props[i].method, props[i].grade, props[i].rr, props[i].trap, props[i].info, props[i].prox, props[i].tZone);
   for(int j = i; j < ArraySize(props) - 1; j++) props[j] = props[j + 1];
   ArrayResize(props, ArraySize(props) - 1);
   DrawProposals();
  }
//+------------------------------------------------------------------+
