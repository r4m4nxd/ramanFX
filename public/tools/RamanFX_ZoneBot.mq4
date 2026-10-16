//+------------------------------------------------------------------+
//| RamanFX_ZoneBot.mq4  (v0.1 — DEMO ONLY)                           |
//| Supply & demand zone bot built from the mentor's rules:          |
//|  - zone = basing + move away + stay away + space to proximal     |
//|  - continuation zones (RBR / DBD) only, fresh only, graded A/B/C |
//|  - entry TF takes direction from its HTF (1m→15m, 5m→H1,         |
//|    15m→H4, H1→1D, H4→1W)                                         |
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
#property version   "0.10"
#property strict

enum BotMode   { MODE_SCANNER = 0, MODE_APPROVE = 1, MODE_AUTO = 2 };
enum EntryMode { ENTRY_SF = 0, ENTRY_CONF = 1, ENTRY_BOTH = 2 };
enum LiveBE    { BE_NONE = 0, BE_AT_1R = 1, BE_AT_2R = 2 };

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
input double    InpMinLegRatio   = 1.2;          // Move-away range ÷ largest base candle (loose)
input int       InpMaxBase       = 6;            // Max basing candles
input double    InpMaxZoneATR    = 1.5;          // Max zone height in ATR(14) (similar-size rule)
input int       InpLookback      = 300;          // Bars scanned per timeframe
input int       InpMaxZoneAge    = 200;          // Ignore zones older than this many bars
input double    InpStopBufferPts = 10;           // Extra stop buffer beyond distal (points)
input double    InpMaxSpreadPct  = 15;           // Max spread as % of the stop distance
input bool      InpSkipAsian     = true;         // No new orders in the Asian session
input int       InpAsianStartUTC = 22;           // Asian session start (UTC hour)
input int       InpAsianEndUTC   = 6;            // Asian session end (UTC hour)
input int       InpNewsBeforeMin = 30;           // No orders this many minutes before news
input int       InpNewsAfterMin  = 30;           // ...and after
input int       InpFridayCutUTC  = 19;           // Friday: cancel pendings, no new orders after (UTC hour)
input LiveBE    InpLiveBE        = BE_NONE;      // Live break-even rule (all others are simulated)
input int       InpConfTouchBars = 60;           // Confirmation: HTF zone touched within N entry bars
input int       InpPendingBars   = 100;          // Cancel unfilled limit after N entry bars
input int       InpSimDays       = 10;           // Variant replay horizon (days)
input int       InpMagic         = 770100;       // Magic number base
input bool      InpAlerts        = true;         // Pop-up / push alerts for new setups
input bool      InpDraw          = true;         // Draw zones on this chart

//--- timeframe pairs (mentor's combos)
int TF_E[5] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4};
int TF_H[5] = {PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1};
string TF_N[5] = {"M1", "M5", "M15", "H1", "H4"};

struct Zone
  {
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
struct Proposal { string sym; int k; int dir; double entry, sl, tp, dist; string method, grade; datetime t; };
Proposal props[];

//+------------------------------------------------------------------+
int OnInit()
  {
   BuildSymbols();
   ArrayResize(lastBar, ArraySize(syms));
   for(int i = 0; i < ArraySize(syms); i++) for(int k = 0; k < 5; k++) lastBar[i][k] = 0;
   LoadSims();
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
  }

void OnTick() { if(IsTesting()) Work(); }
void OnTimer() { Work(); }

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
         Scan(syms[i], k);
        }
   UpdateSims();
   if(InpMode == MODE_APPROVE) DrawProposals();
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
      z.tested = false; z.removed = false; z.tRemoved = 0; z.tTouched = 0;
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
   if(hi[0] > hi[1] && lo[0] > lo[1]) return 1;
   if(hi[0] < hi[1] && lo[0] < lo[1]) return -1;
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
      double risk = MathAbs(entry - sl);
      if(tp > 0 && risk > 0) rr = MathAbs(tp - entry) / risk;
      string method = ConfirmedBy(s, etf, htf, dir, z, z[i]) ? "CONF" : "SF";

      if(trend == 0) reason = "HTF trend unclear";
      else if(trend != dir) reason = "against HTF trend";
      else if(InpEntry == ENTRY_SF && method == "CONF") method = "SF";
      if(reason == "" && InpEntry == ENTRY_CONF && method != "CONF") reason = "no confirmation";
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
      if(reason != "") return;                                   // only the newest candidate per scan

      string tag = StringFormat("%s %s %s %s 1:%.1f grade %s", s, TF_N[k], dir > 0 ? "BUY" : "SELL", method, rr, z[i].grade);
      if(InpAlerts) Alert("RamanFX ZoneBot: ", tag);
      if(InpMode == MODE_AUTO) Place(s, k, dir, entry, sl, tp, z[i].dist, method, z[i].grade);
      else if(InpMode == MODE_APPROVE) AddProposal(s, k, dir, entry, sl, tp, z[i].dist, method, z[i].grade);
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
   if(lots < mn) return 0;                                      // can't keep risk ≤ target
   return MathMin(lots, mx);
  }

void Place(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade)
  {
   int digits = (int)MarketInfo(s, MODE_DIGITS);
   double lots = Lots(s, MathAbs(entry - sl));
   if(lots <= 0) { Print(s, ": lot size below broker minimum at ", InpRiskPct, "% risk — skipped"); return; }
   double point = MarketInfo(s, MODE_POINT);
   // comment: RFX|tf|method|distal|R(points)|grade
   string cm = StringFormat("RFX|%d|%s|%s|%d|%s", k, method == "CONF" ? "C" : "S", DoubleToString(dist, digits), (int)MathRound(MathAbs(entry - sl) / point), grade);
   int type = dir > 0 ? OP_BUYLIMIT : OP_SELLLIMIT;
   int t = OrderSend(s, type, lots, NormalizeDouble(entry, digits), 3, NormalizeDouble(sl, digits), NormalizeDouble(tp, digits), cm, MagicFor(k, method), 0, dir > 0 ? clrLime : clrRed);
   if(t < 0) Print("OrderSend failed ", s, " ", GetLastError());
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
      int k = (int)StringToInteger(Field(cm, 1));
      if(k < 0 || k > 4) k = 1;
      int etf = TF_E[k];
      double dist = StringToDouble(Field(cm, 3));
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
      // live break-even rule
      double Rp = StringToDouble(Field(cm, 4)) * point;
      if(InpLiveBE != BE_NONE && Rp > 0)
        {
         double trig = InpLiveBE == BE_AT_1R ? Rp : 2 * Rp;
         double open = OrderOpenPrice();
         if(type == OP_BUY && MarketInfo(s, MODE_BID) - open >= trig && OrderStopLoss() < open)
            if(!OrderModify(OrderTicket(), open, NormalizeDouble(open, (int)MarketInfo(s, MODE_DIGITS)), OrderTakeProfit(), 0)) Print("BE modify failed ", GetLastError());
         if(type == OP_SELL && open - MarketInfo(s, MODE_ASK) >= trig && OrderStopLoss() > open)
            if(!OrderModify(OrderTicket(), open, NormalizeDouble(open, (int)MarketInfo(s, MODE_DIGITS)), OrderTakeProfit(), 0)) Print("BE modify failed ", GetLastError());
        }
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
   double Rp = StringToDouble(Field(cm, 4)) * point;
   if(Rp <= 0) Rp = MathAbs(OrderOpenPrice() - OrderStopLoss());
   Sim m;
   m.ticket = ticket; m.sym = OrderSymbol(); int k = (int)StringToInteger(Field(cm, 1)); m.tf = (k >= 0 && k <= 4) ? TF_N[k] : "?";
   m.method = Field(cm, 2) == "C" ? "CONF" : "SF"; m.grade = Field(cm, 5);
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
      if(f != INVALID_HANDLE) { FileWrite(f, "Time", "Symbol", "EntryTF", "HTF", "Side", "Type", "Grade", "LegRatio", "BaseCandles", "Proximal", "Distal", "Entry", "SL", "TP", "RR", "HtfTrend", "CurvePct", "Method", "SpreadPts", "Decision", "Reason"); FileClose(f); }
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
             trend > 0 ? "up" : (trend < 0 ? "down" : "side"), DoubleToString(curve, 0), method, DoubleToString(spreadPts, 0), decision, reason);
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
void AddProposal(string s, int k, int dir, double entry, double sl, double tp, double dist, string method, string grade)
  {
   for(int i = 0; i < ArraySize(props); i++) if(props[i].sym == s && props[i].k == k) return;
   Proposal p; p.sym = s; p.k = k; p.dir = dir; p.entry = entry; p.sl = sl; p.tp = tp; p.dist = dist; p.method = method; p.grade = grade; p.t = TimeCurrent();
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
   Place(props[i].sym, props[i].k, props[i].dir, props[i].entry, props[i].sl, props[i].tp, props[i].dist, props[i].method, props[i].grade);
   for(int j = i; j < ArraySize(props) - 1; j++) props[j] = props[j + 1];
   ArrayResize(props, ArraySize(props) - 1);
   DrawProposals();
  }
//+------------------------------------------------------------------+
