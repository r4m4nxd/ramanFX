//+------------------------------------------------------------------+
//| RamanFX_ZoneVision.mq4  (v0.2 - clean, mentor-style)                                    |
//| See the chart through the ZoneBot's eyes. Uses the SAME zone     |
//| rules and defaults as RamanFX_ZoneBot.mq4 so you can spot where  |
//| the bot disagrees with you (and with the mentor).                |
//| Draws:                                                           |
//|  - every zone with its 4 parts labelled (base, move away,        |
//|    stay away, space), proximal (solid) / distal (dashed) lines,  |
//|    type (RBR/DBD/DBR/RBD), grade A/B/C, fresh / tested / removed |
//|  - qualifiers: removed an opposing zone, removed a trendline,    |
//|    made a new high/low of the lookback                           |
//|  - rejected candidates with the reason (optional)                |
//|  - trendlines by the mentor's rules: clear valley -> peak ->       |
//|    higher high; attached so it never cuts through a candle;      |
//|    removed only by a candle fully (body + wick) beyond it        |
//|  - HTF zones (entry TF -> HTF pairing) and the HTF trend          |
//|  - the setup the bot would take now: entry, SL, TP, R:R and the  |
//|    reason it would trade or skip                                 |
//| Emotional wicks: a huge candle (> EmoATR x ATR) that only wicks  |
//| into a zone does not count as a touch. Removal needs a CLOSE.    |
//+------------------------------------------------------------------+
#property copyright "RamanFX"
#property version   "0.20"
#property strict
#property indicator_chart_window

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
input string Sep2             = "-- What to show (clean by default) --"; // -----
input int    InpMaxZones      = 4;      // Zones drawn: the N closest to price
input bool   InpShowTested    = false;  // Also draw tested zones
input bool   InpShowRemoved   = false;  // Also draw removed zones (faded)
input bool   InpShowNames     = true;   // Zone name inside the box (e.g. Rally Base Rally Demand (CP))
input bool   InpShowTrendlines= true;   // Newest intact trendline each way (mentor rules)
input bool   InpShowBrokenTL  = false;  // Also draw broken trendlines
input int    InpTrendSwing    = 3;      // Swing strength for peaks / valleys (bars each side)
input bool   InpShowHTF       = true;   // HTF zone band (closest above and below)
input bool   InpShowPlan      = true;   // Bot's planned entry / SL / TP
input bool   InpShowPanel     = true;   // Compact info panel
input bool   InpShowBotOrders = true;   // Show why the ZoneBot placed its order on this symbol (bottom-right)
input bool   InpExplain       = false;  // Explain mode: label the 4 parts on the bot's zone
input bool   InpShowRejected  = false;  // Debug: rejected candidates + reason
input color  InpDemandFill    = C'200,232,203';
input color  InpDemandLine    = C'46,139,87';
input color  InpSupplyFill    = C'246,212,198';
input color  InpSupplyLine    = C'200,60,60';
input color  InpTrapColor     = C'170,150,220';
input color  InpHtfFill       = C'252,238,170';
input color  InpMuted         = C'150,150,150';
input color  InpTrend         = C'40,40,40';
input color  InpText          = C'90,90,90';

#define PFX "RFXV_"

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
  };

struct TLine
  {
   int      dir;          // +1 up (support), -1 down (resistance)
   int      a, b;         // anchor bars (older a, newer b)
   double   pa, pb;
   bool     removed;
   int      removedBar;
  };

Zone  Z[], HZ[];
int   gTrend = 0;   // HTF trend as the bot reads it
TLine TL[];
datetime lastDraw = 0;

int OnInit() { return(INIT_SUCCEEDED); }
void OnDeinit(const int r) { ObjectsDeleteAll(0, PFX); ObjectsDeleteAll(0, "RFXN_"); Comment(""); }

int OnCalculate(const int rates_total, const int prev_calculated, const datetime &time[], const double &open[], const double &high[],
                const double &low[], const double &close[], const long &tick_volume[], const long &volume[], const int &spread[])
  {
   static datetime lastPanel = 0;
   if(Time[0] == lastDraw && prev_calculated > 0)
     {
      if(TimeLocal() - lastPanel >= 5) { lastPanel = TimeLocal(); Panel(); }   // light refresh between candles
      static datetime lastNotes = 0;
      if(InpShowBotOrders && TimeLocal() - lastNotes >= 20) { lastNotes = TimeLocal(); BotNotes(); }   // bot notes file read every 20s
      return rates_total;
     }
   lastDraw = Time[0];
   ObjectsDeleteAll(0, PFX);
   { int h0 = HtfOf(_Period); gTrend = h0 > 0 ? HtfTrend(_Symbol, h0) : 0; }
   Detect(_Symbol, _Period, Z, true);
   if(InpShowTrendlines) Trendlines(_Symbol, _Period);
   Qualify();
   if(InpShowHTF) { int h = HtfOf(_Period); if(h > 0) { Detect(_Symbol, h, HZ, false); DrawZones(HZ, true); } }   // HTF band first, underneath
   DrawZones(Z, false);
   if(InpShowPanel || InpShowPlan) Panel();
   if(InpShowBotOrders) BotNotes();
   return rates_total;
  }

//+------------------------------------------------------------------+
//| Helpers                                                          |
//+------------------------------------------------------------------+
int HtfOf(int tf)
  {
   switch(tf) { case PERIOD_M1: return PERIOD_M15; case PERIOD_M5: return PERIOD_H1; case PERIOD_M15: return PERIOD_H4;
                case PERIOD_H1: return PERIOD_D1; case PERIOD_H4: return PERIOD_W1; case PERIOD_D1: return PERIOD_MN1; }
   return 0;
  }
string TfName(int tf)
  {
   switch(tf) { case PERIOD_M1: return "M1"; case PERIOD_M5: return "M5"; case PERIOD_M15: return "M15"; case PERIOD_M30: return "M30"; case PERIOD_H1: return "H1";
                case PERIOD_H4: return "H4"; case PERIOD_D1: return "D1"; case PERIOD_W1: return "W1"; case PERIOD_MN1: return "MN"; }
   return IntegerToString(tf);
  }
double Rng(string s, int tf, int i)  { return iHigh(s, tf, i) - iLow(s, tf, i); }
double Body(string s, int tf, int i) { return MathAbs(iClose(s, tf, i) - iOpen(s, tf, i)); }
bool   Basing(string s, int tf, int i) { double r = Rng(s, tf, i); return r > 0 && Body(s, tf, i) / r < 0.5; }
int    CDir(string s, int tf, int i) { return iClose(s, tf, i) > iOpen(s, tf, i) ? 1 : (iClose(s, tf, i) < iOpen(s, tf, i) ? -1 : 0); }
bool   Emotional(string s, int tf, int i) { double a = iATR(s, tf, 14, i + 1); return a > 0 && Rng(s, tf, i) > InpEmoATR * a; }
datetime BarTime(string s, int tf, int i) { return i >= 0 ? iTime(s, tf, i) : iTime(s, tf, 0) + (datetime)(-i * PeriodSeconds(tf)); }

//+------------------------------------------------------------------+
//| Zone detection - same rules as ZoneBot                           |
//+------------------------------------------------------------------+
void Reject(string s, int tf, int L, int k, string why, bool draw)
  {
   if(!draw || !InpShowRejected || tf != _Period) return;
   string nm = PFX + "rej" + IntegerToString(L);
   double hi = iHigh(s, tf, L), lo = iLow(s, tf, L);
   for(int b = L + 1; b <= L + k; b++) { hi = MathMax(hi, iHigh(s, tf, b)); lo = MathMin(lo, iLow(s, tf, b)); }
   ObjectCreate(0, nm, OBJ_RECTANGLE, 0, BarTime(s, tf, L + MathMax(k, 1)), hi, BarTime(s, tf, L - 1), lo);
   ObjectSetInteger(0, nm, OBJPROP_COLOR, InpMuted); ObjectSetInteger(0, nm, OBJPROP_STYLE, STYLE_DOT); ObjectSetInteger(0, nm, OBJPROP_BACK, false);
   ObjectSetString(0, nm, OBJPROP_TOOLTIP, "Rejected: " + why);
   Txt(PFX + "rejt" + IntegerToString(L), BarTime(s, tf, L), hi, "x " + why, InpMuted, 7, ANCHOR_LEFT_LOWER);
  }

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

int Detect(string s, int tf, Zone &out[], bool draw)
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
      if(h <= 0) continue;
      if(atr > 0 && h > InpMaxZoneATR * atr) { Reject(s, tf, L, k, StringFormat("zone %.1f ATR - too big", h / atr), draw); continue; }
      int sa = L - 1;
      if((dir > 0 && iLow(s, tf, sa) <= prox) || (dir < 0 && iHigh(s, tf, sa) >= prox)) { Reject(s, tf, L, k, "no stay-away / no space", draw); continue; }

      Zone z;
      z.dir = dir; z.prox = prox; z.dist = dist; z.legBar = L; z.baseN = k; z.saBar = sa; z.legRatio = ratio; z.cont = cont;
      z.grade = (ratio >= 2.5 && k <= 3) ? "A" : (ratio >= 1.8 ? "B" : "C");
      z.tested = false; z.removed = false; z.removedBar = -1; z.testedBar = -1; z.qual = ""; z.trap = 0; z.trapBar = -1; z.crowded = false;
      for(int j = sa - 1; j >= 1; j--)
        {
         if(dir > 0)
           {
            if(iClose(s, tf, j) < dist) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && iLow(s, tf, j) <= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
           }
         else
           {
            if(iClose(s, tf, j) > dist) { z.removed = true; z.removedBar = j; break; }
            if(!z.tested && iHigh(s, tf, j) >= prox && !Emotional(s, tf, j)) { z.tested = true; z.testedBar = j; }
           }
        }
      z.baseEnd = L + k;   // liquidity trap is worked out later, only for the zones that get drawn
      int n = ArraySize(out); ArrayResize(out, n + 1); out[n] = z;
     }
   return ArraySize(out);
  }

//+------------------------------------------------------------------+
//| Trendlines - mentor rules                                        |
//|  up: valley A -> peak -> higher high -> valley B (B > A); line A->B |
//|  is the lowest-slope line from A, so no candle low between them |
//|  is below it (never cuts through candles). Removed by the first |
//|  candle whose HIGH is below the line (full body + wick).        |
//+------------------------------------------------------------------+
bool SwingLow(int i)  { for(int j = 1; j <= InpTrendSwing; j++) if(i - j < 1 || Low[i] > Low[i - j] || Low[i] > Low[i + j]) return false; return true; }
bool SwingHigh(int i) { for(int j = 1; j <= InpTrendSwing; j++) if(i - j < 1 || High[i] < High[i - j] || High[i] < High[i + j]) return false; return true; }

void Trendlines(string s, int tf)
  {
   ArrayResize(TL, 0);
   int bars = MathMin(InpLookback, Bars - InpTrendSwing - 2);
   for(int d = -1; d <= 1; d += 2)
     {
      int found = 0;
      for(int a = InpTrendSwing + 2; a < bars && found < 4; a++)              // newest anchors first
        {
         if(d > 0 && !SwingLow(a)) continue;
         if(d < 0 && !SwingHigh(a)) continue;
         double pa = d > 0 ? Low[a] : High[a];
         // lowest-slope (support) / highest-slope (resistance) touch after a peak
         int peak = -1; double pk = d > 0 ? -DBL_MAX : DBL_MAX;
         int b = -1; double best = d > 0 ? DBL_MAX : -DBL_MAX;
         for(int j = a - 1; j >= 1; j--)
           {
            if(d > 0 && High[j] > pk) { pk = High[j]; peak = j; }
            if(d < 0 && Low[j] < pk) { pk = Low[j]; peak = j; }
            if(peak < 0 || j >= peak) continue;                                // B must come after the peak
            bool sw = d > 0 ? SwingLow(j) : SwingHigh(j);
            if(!sw) continue;
            double pj = d > 0 ? Low[j] : High[j];
            if(d > 0 && pj <= pa) break;                                       // need a higher low
            if(d < 0 && pj >= pa) break;                                       // need a lower high
            double slope = (pj - pa) / (a - j);
            if((d > 0 && slope < best) || (d < 0 && slope > best)) { best = slope; b = j; }
           }
         if(b < 0) continue;
         // need a higher high after the first peak (uptrend) / lower low (downtrend)
         bool hh = false;
         for(int j = b; j >= 1; j--) if((d > 0 && High[j] > pk) || (d < 0 && Low[j] < pk)) { hh = true; break; }
         if(!hh) continue;
         // the line must not cut any candle between the anchors
         bool cuts = false;
         for(int j = a - 1; j > b; j--)
           {
            double lv = pa + best * (a - j);
            if((d > 0 && Low[j] < lv - Point) || (d < 0 && High[j] > lv + Point)) { cuts = true; break; }
           }
         if(cuts) continue;
         TLine t; t.dir = d; t.a = a; t.b = b; t.pa = pa; t.pb = d > 0 ? Low[b] : High[b]; t.removed = false; t.removedBar = -1;
         for(int j = b - 1; j >= 1; j--)
           {
            double lv = pa + best * (a - j);
            if((d > 0 && High[j] < lv) || (d < 0 && Low[j] > lv)) { t.removed = true; t.removedBar = j; break; }
           }
         int n = ArraySize(TL); ArrayResize(TL, n + 1); TL[n] = t; found++;
         a = b;                                                                // continue past this line
        }
     }
   bool drawnUp = false, drawnDn = false;
   for(int i = 0; i < ArraySize(TL); i++)
     {
      if(TL[i].removed && !InpShowBrokenTL) continue;
      if(!TL[i].removed) { if(TL[i].dir > 0) { if(drawnUp) continue; drawnUp = true; } else { if(drawnDn) continue; drawnDn = true; } }
      string nm = PFX + "tl" + IntegerToString(i);
      int end = TL[i].removed ? TL[i].removedBar : -10;
      double slope = (TL[i].pb - TL[i].pa) / (TL[i].a - TL[i].b);
      double pe = TL[i].pa + slope * (TL[i].a - end);
      ObjectCreate(0, nm, OBJ_TREND, 0, Time[TL[i].a], TL[i].pa, BarTime(s, tf, end), pe);
      ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
      ObjectSetInteger(0, nm, OBJPROP_COLOR, TL[i].removed ? InpMuted : InpTrend);
      ObjectSetInteger(0, nm, OBJPROP_STYLE, TL[i].removed ? STYLE_DOT : STYLE_SOLID);
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
      ObjectSetString(0, nm, OBJPROP_TOOLTIP, (TL[i].dir > 0 ? "Uptrend line" : "Downtrend line") + (TL[i].removed ? " - removed by a full close" : " - intact"));
     }
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
      int span = MathMin(InpLookback, Bars - older - 1);
      if(span > 5)
        {
         int nx = MathMax(L - 5, 1);
         if(Z[i].dir > 0 && High[iHighest(NULL, 0, MODE_HIGH, L - nx + 1, nx)] > High[iHighest(NULL, 0, MODE_HIGH, span, older)]) q += "new high | ";
         if(Z[i].dir < 0 && Low[iLowest(NULL, 0, MODE_LOW, L - nx + 1, nx)] < Low[iLowest(NULL, 0, MODE_LOW, span, older)]) q += "new low | ";
        }
      Z[i].qual = q == "" ? "no qualifier" : StringSubstr(q, 0, StringLen(q) - 3);
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
   Txt(nm, t, p, "(" + DoubleToString(p, Digits) + ")", c, 7, ANCHOR_RIGHT);
  }

// The N zones closest to price, mentor style: light fill, solid border, prices at the right edge.
void DrawZones(Zone &zs[], bool htf)
  {
   int tf = htf ? HtfOf(_Period) : _Period;
   double px = (Bid + Ask) / 2;
   // pick the closest eligible zones
   int idx[]; double dst[]; int n = 0;
   for(int i = 0; i < ArraySize(zs); i++)
     {
      if(!htf && zs[i].legBar > InpMaxZoneAge) continue;
      if(zs[i].removed && (htf || !InpShowRemoved)) continue;
      if(zs[i].tested && !htf && !InpShowTested) continue;
      ArrayResize(idx, n + 1); ArrayResize(dst, n + 1);
      idx[n] = i; dst[n] = MathMin(MathAbs(zs[i].prox - px), MathAbs(zs[i].dist - px)); n++;
     }
   int want = htf ? 2 : InpMaxZones;
   datetime right = Time[0] + PeriodSeconds() * 18;
   for(int pick = 0; pick < MathMin(want, n); pick++)
     {
      int best = -1;
      for(int j = 0; j < n; j++) if(idx[j] >= 0 && (best < 0 || dst[j] < dst[best])) best = j;
      if(best < 0) break;
      if(!htf && !zs[idx[best]].removed && zs[idx[best]].trapBar == -1) { int tb; bool cr; Zone q = zs[idx[best]]; zs[idx[best]].trap = FindTrap(_Symbol, tf, q.dir, q.prox, q.dist, q.saBar, q.baseEnd, tb, cr); zs[idx[best]].trapBar = tb == -1 ? -2 : tb; zs[idx[best]].crowded = cr; }
      Zone z = zs[idx[best]]; string id = PFX + (htf ? "H" : "Z") + IntegerToString(idx[best]); idx[best] = -1;
      color fill = htf ? InpHtfFill : (z.removed ? C'250,230,212' : (z.dir > 0 ? InpDemandFill : InpSupplyFill));
      color line = z.removed ? InpMuted : (z.dir > 0 ? InpDemandLine : InpSupplyLine);
      datetime t1 = iTime(_Symbol, tf, z.legBar + z.baseN);
      datetime t2 = z.removed ? iTime(_Symbol, tf, z.removedBar) : right;
      ObjectCreate(0, id, OBJ_RECTANGLE, 0, t1, z.prox, t2, z.dist);
      ObjectSetInteger(0, id, OBJPROP_COLOR, fill); ObjectSetInteger(0, id, OBJPROP_BACK, true); ObjectSetInteger(0, id, OBJPROP_SELECTABLE, false);
      string state = z.removed ? "removed" : (z.tested ? "tested" : "fresh");
      ObjectSetString(0, id, OBJPROP_TOOLTIP, StringFormat("%s%s | grade %s | move away %.1fx | base %d | %s | %s", htf ? TfName(tf) + " " : "", ZoneName(z), z.grade, z.legRatio, z.baseN, state, htf ? "" : z.qual));
      if(!htf)
        {
         HLine(id + "p", t1, t2, z.prox, line, STYLE_SOLID, 1);
         HLine(id + "d", t1, t2, z.dist, line, STYLE_SOLID, 1);
        }
      PriceTag(id + "pp", t2, z.prox, htf ? InpText : line);
      PriceTag(id + "dp", t2, z.dist, htf ? InpText : line);
      if(!htf && z.trap > 0 && z.trapBar > 0)
        {
         double th = MathMax(MathAbs(z.prox - z.dist) * 0.12, 2 * Point);
         ObjectCreate(0, id + "lt", OBJ_RECTANGLE, 0, Time[z.trapBar], z.trap, t2, z.dir > 0 ? z.trap - th : z.trap + th);
         ObjectSetInteger(0, id + "lt", OBJPROP_COLOR, InpTrapColor); ObjectSetInteger(0, id + "lt", OBJPROP_BACK, true); ObjectSetInteger(0, id + "lt", OBJPROP_SELECTABLE, false);
         ObjectSetString(0, id + "lt", OBJPROP_TOOLTIP, "Liquidity trap " + DoubleToString(z.trap, Digits) + " - obvious level in front of the zone; retail stops rest here, price runs them into the zone (lesson 16)");
        }
      if(InpShowNames)
        {
         string nm = htf ? TfName(tf) + " " + (z.dir > 0 ? "demand" : "supply") : ZoneName(z) + (z.grade == "A" ? "" : " | " + z.grade) + (state == "fresh" ? "" : " | " + state) + (z.crowded ? " | on S/R level (crowded)" : "");
         Txt(id + "n", t1, z.dir > 0 ? z.dist : z.dist, nm, InpText, 7, z.dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
        }
     }
  }

// Explain mode: the 4 parts on one zone only.
void Explain(Zone &z)
  {
   string id = PFX + "ex"; color c = InpText;
   double off = MathAbs(z.prox - z.dist) * 0.6;
   Txt(id + "b", Time[z.legBar + 1], z.dir > 0 ? z.dist - off : z.dist + off, StringFormat("1 base x%d", z.baseN), c, 7, z.dir > 0 ? ANCHOR_UPPER : ANCHOR_LOWER);
   Txt(id + "m", Time[z.legBar], z.dir > 0 ? High[z.legBar] : Low[z.legBar], StringFormat("2 move away %.1fx", z.legRatio), c, 7, z.dir > 0 ? ANCHOR_LOWER : ANCHOR_UPPER);
   double saEdge = z.dir > 0 ? Low[z.saBar] : High[z.saBar];
   Txt(id + "s", Time[z.saBar], z.dir > 0 ? High[z.saBar] : Low[z.saBar], "3 stay away", c, 7, z.dir > 0 ? ANCHOR_LOWER : ANCHOR_UPPER);
   ObjectCreate(0, id + "g", OBJ_TREND, 0, Time[z.saBar], saEdge, Time[z.saBar], z.prox);
   ObjectSetInteger(0, id + "g", OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, id + "g", OBJPROP_COLOR, clrGoldenrod); ObjectSetInteger(0, id + "g", OBJPROP_WIDTH, 2);
   Txt(id + "gs", Time[z.saBar], (saEdge + z.prox) / 2, "  4 space", clrGoldenrod, 7, ANCHOR_LEFT);
  }

//+------------------------------------------------------------------+
//| HTF trend (same fractal method as ZoneBot) + curve               |
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
double Curve(string s, int htf, double p)
  {
   int hiI = iHighest(s, htf, MODE_HIGH, 100, 1), loI = iLowest(s, htf, MODE_LOW, 100, 1);
   if(hiI < 0 || loI < 0) return 50;
   double hi = iHigh(s, htf, hiI), lo = iLow(s, htf, loI);
   return hi > lo ? 100.0 * (p - lo) / (hi - lo) : 50;
  }

//+------------------------------------------------------------------+
//| Panel + the setup the bot would take now (same logic as Scan)   |
//+------------------------------------------------------------------+
void Panel()
  {
   int htf = HtfOf(_Period);
   int trend = gTrend;
   double spread = Ask - Bid;
   string L = StringFormat("ZoneVision  %s %s  ->  bias from %s\n", _Symbol, TfName(_Period), htf > 0 ? TfName(htf) : "-");
   L += "Bias: " + (trend > 0 ? "UP - buys only" : (trend < 0 ? "DOWN - sells only" : "unclear - bot waits")) + "\n";
   L += "Structure: " + StructureNow() + "\n";

   string plan = "Bot: no trade setup";
   for(int i = ArraySize(Z) - 1; i >= 0; i--)
     {
      if(Z[i].removed || Z[i].tested || !Z[i].cont) continue;
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
      double sl = dir > 0 ? Z[i].dist - InpStopBufferPts * Point : Z[i].dist + InpStopBufferPts * Point + spread;
      double tp = opp > 0 ? (dir > 0 ? opp - spread : opp + spread) : 0;
      double rr = tp > 0 ? MathAbs(tp - entry) / MathMax(MathAbs(entry - sl), Point) : 0;
      string why = "";
      if(trend == 0) why = "HTF bias unclear";
      else if(trend != dir) why = "against HTF bias";
      else if(tp == 0) why = "no opposing zone for a target";
      else if(rr < InpMinRR) why = StringFormat("R:R %.1f below %.1f", rr, InpMinRR);
      if(why == "")
         plan = StringFormat("Bot: %s %s  SL %s  TP %s  (1:%.1f, %s %s%s)", dir > 0 ? "BUY limit" : "SELL limit", DoubleToString(entry, Digits), DoubleToString(sl, Digits), DoubleToString(tp, Digits), rr, dir > 0 ? "RBR" : "DBD", Z[i].grade, Z[i].trap > 0 ? " + trap" : "");
      else
         plan = StringFormat("Bot: watching %s at %s - no trade: %s", dir > 0 ? "demand" : "supply", DoubleToString(Z[i].prox, Digits), why);
      if(InpShowPlan && why == "")
        {
         datetime t1 = Time[0] + PeriodSeconds() * 2, t2 = Time[0] + PeriodSeconds() * 18;
         HLine(PFX + "pe", t1, t2, entry, clrRoyalBlue, STYLE_SOLID, 2); Txt(PFX + "pet", t2, entry, " entry", clrRoyalBlue, 7, ANCHOR_LEFT);
         HLine(PFX + "ps", t1, t2, sl, InpSupplyLine, STYLE_DOT, 1);    Txt(PFX + "pst", t2, sl, " SL", InpSupplyLine, 7, ANCHOR_LEFT);
         HLine(PFX + "pt", t1, t2, tp, InpDemandLine, STYLE_DOT, 1);    Txt(PFX + "ptt", t2, tp, " TP", InpDemandLine, 7, ANCHOR_LEFT);
        }
      if(InpExplain) Explain(Z[i]);
      break;
     }
   L += plan;
   // bias arrow near the latest price
   ObjectDelete(0, PFX + "bias");
   if(trend != 0)
     {
      int hi = iHighest(NULL, 0, MODE_HIGH, 30, 0), lo = iLowest(NULL, 0, MODE_LOW, 30, 0);
      double y = trend > 0 ? High[hi] : Low[lo];
      ObjectCreate(0, PFX + "bias", OBJ_ARROW, 0, Time[0] + PeriodSeconds() * 8, y);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_ARROWCODE, trend > 0 ? 233 : 234);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_COLOR, trend > 0 ? InpDemandLine : InpSupplyLine);
      ObjectSetInteger(0, PFX + "bias", OBJPROP_WIDTH, 3);
      ObjectSetString(0, PFX + "bias", OBJPROP_TOOLTIP, "HTF bias " + (trend > 0 ? "up" : "down"));
     }
   if(InpShowPanel) Comment(L);
  }
//+------------------------------------------------------------------+

//+------------------------------------------------------------------+
//| ZoneBot order notes: reads MQL4\Files\RamanFX_Bot_Orders.txt and |
//| shows the reasoning of the bot's live order(s) on this symbol.   |
//+------------------------------------------------------------------+
bool TicketLive(int t)
  {
   for(int i = OrdersTotal() - 1; i >= 0; i--) if(OrderSelect(i, SELECT_BY_POS) && OrderTicket() == t) return true;
   return false;
  }
void BotNotes()
  {
   int f = FileOpen("RamanFX_Bot_Orders.txt", FILE_READ | FILE_TXT | FILE_ANSI | FILE_SHARE_READ | FILE_SHARE_WRITE);
   string note = ""; int ticket = 0;
   if(f != INVALID_HANDLE)
     {
      while(!FileIsEnding(f))
        {
         string line = FileReadString(f);
         string p[]; if(StringSplit(line, '\t', p) < 4) continue;
         if(p[2] != _Symbol) continue;
         int t = (int)StringToInteger(p[1]);
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
      ObjectSetInteger(0, nm, OBJPROP_COLOR, i == 0 ? clrRoyalBlue : clrDimGray);
      ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
     }
  }
