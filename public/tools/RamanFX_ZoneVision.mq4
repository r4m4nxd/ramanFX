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
#property version   "1.94"
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
input bool   InpShowHTFLines  = true;
input int    InpHTFLevels     = 4;      // Higher timeframes whose trendlines are drawn here (M15 chart: H1, H4, D1, W1); top-down like your analysis
input bool   InpTLBias        = true;   // Bias from the newest HTF trendline break (a broken daily downtrend line = bullish for H4 / H1)   // Also draw the higher-timeframe trendlines on this chart (precision on the entry TF)
input color  InpHtfTL         = C'200,150,40';   // higher-timeframe lines still respected (thin dotted)
input color  InpHtfTLBroken   = C'228,205,150';
input bool   InpRefineHTF     = true;   // Re-anchor HTF lines on this chart's candles (exact top-most / bottom-most touch, no cut candles)  // higher-timeframe lines already broken (lighter, end where they broke)
input int    InpTLSwing       = 2;      // Trendlines: swing points need N bars each side; REAL only after a new higher high / lower low
input bool   InpShowHTF       = true;   // HTF zone band (closest above and below)
input bool   InpShowPlan      = true;   // Bot's planned entry / SL / TP
input bool   InpShowPanel     = true;   // Compact info panel
input bool   InpShowBotOrders = true;   // Show why the ZoneBot placed its order on this symbol (bottom-right)
input bool   InpExplain       = false;  // Explain mode: label the 4 parts on the bot's zone
input bool   InpShowEmotional = true;   // Mark emotional candles (range > InpEmoATR x ATR) with a star
input color  InpEmoColor      = clrGoldenrod;
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
   gHTF = 0; gHUpOn = false; gHDnOn = false; gHBias = 0; gHBiasTxt = "";
   { int h = HtfOf(_Period);                                          // HTF lines first, shown on this chart for precision
     // the higher timeframes above this chart (e.g. M15 -> H1, H4, D1): thin dotted gold, for multi-timeframe analysis
     if(InpShowHTFLines)
        for(int lv = InpHTFLevels; lv >= 1; lv--)
          {
           int t = StepUp(_Period, lv);
           if(t <= 0) continue;
           gTF = t; Trendlines(_Symbol, t);
           if(t == h) { TLBias(); gHTF = h; gHUpOn = gUpOn; gHUpS = gUpS; gHUpP = gUpP; gHUpW = gUpW; gHUpB = gUpB; gHDnOn = gDnOn; gHDnS = gDnS; gHDnP = gDnP; gHDnW = gDnW; gHDnB = gDnB; }
          }
     if(h > 0 && gHTF == 0) { gTF = h; Trendlines(_Symbol, h); TLBias(); gHTF = h; gHUpOn = gUpOn; gHUpS = gUpS; gHUpP = gUpP; gHUpW = gUpW; gHUpB = gUpB; gHDnOn = gDnOn; gHDnS = gDnS; gHDnP = gDnP; gHDnW = gDnW; gHDnB = gDnB; } }
   if(InpTLBias && gHBias != 0) gTrend = gHBias;                    // a broken HTF trendline sets the bias (the newest break wins)
   gTF = _Period;
   Trendlines(_Symbol, _Period);                                     // this chart: chain + channel use it; drawn only if InpShowTrendlines
   DedupeTL();
   Qualify();
   if(InpShowHTF) { int h = HtfOf(_Period); if(h > 0) { Detect(_Symbol, h, HZ, false); DrawZones(HZ, true); } }   // HTF band first, underneath
   DrawZones(Z, false);
   if(InpShowEmotional) MarkEmotional();
   if(InpShowPanel || InpShowPlan) Panel();
   if(InpShowBotOrders) BotNotes();
   return rates_total;
  }

// Emotional candle: range > InpEmoATR x ATR(14). Usually news or a stop run. Its wick is
// ignored for zone removal (only a body close or a normal wick removes a zone).
void MarkEmotional()
  {
   int bars = MathMin(InpLookback, Bars - 16);
   for(int i = 1; i < bars; i++)
     {
      if(!Emotional(_Symbol, _Period, i)) continue;
      double a = iATR(NULL, 0, 14, i + 1), x = (High[i] - Low[i]) / MathMax(a, Point);
      bool up = Close[i] >= Open[i];
      string nm = PFX + "emo" + IntegerToString(i);
      ObjectCreate(0, nm, OBJ_ARROW, 0, Time[i], up ? High[i] : Low[i]);
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
int VisUpTo(int tf)
  {
   int p[9] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_M30, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};
   int f[9] = {OBJ_PERIOD_M1, OBJ_PERIOD_M5, OBJ_PERIOD_M15, OBJ_PERIOD_M30, OBJ_PERIOD_H1, OBJ_PERIOD_H4, OBJ_PERIOD_D1, OBJ_PERIOD_W1, OBJ_PERIOD_MN1};
   int m = 0; for(int i = 0; i < 9; i++) if(p[i] <= tf) m |= f[i];
   return m;
  }
// n steps up the timeframe ladder M1 M5 M15 H1 H4 D1 W1 MN1 (0 = none)
int StepUp(int tf, int n)
  {
   int lad[8] = {PERIOD_M1, PERIOD_M5, PERIOD_M15, PERIOD_H1, PERIOD_H4, PERIOD_D1, PERIOD_W1, PERIOD_MN1};   // M30 skipped: M15 -> H1, H4, D1
   int i = -1; for(int k = 0; k < 8; k++) if(lad[k] == tf) i = k;
   if(tf == PERIOD_M30) i = 2;
   if(i < 0) return 0;
   return i + n < 8 ? lad[i + n] : 0;
  }
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
//|  (above the last swing high) before breaking the valley. Real   |
//|  peak = a swing high followed by a LOWER LOW the same way.      |
//|  Up line: the two most recent valleys, higher low, a peak in     |
//|  between, then a higher high (else dotted = not confirmed yet).  |
//|  Anchored so no candle between the anchors is cut. Drawn only    |
//|  until a FULL candle (body and wick) closes beyond it.           |
//+------------------------------------------------------------------+
int    pvBar[]; double pvP[]; int pvT[];             // zigzag turns, oldest first; pvT +1 peak, -1 valley
void AddPiv(int b, double p, int t) { int n = ArraySize(pvBar); ArrayResize(pvBar, n + 1); ArrayResize(pvP, n + 1); ArrayResize(pvT, n + 1); pvBar[n] = b; pvP[n] = p; pvT[n] = t; }
int    gTF = 0;                                                       // timeframe the trendline code reads
double Lo(int i) { return iLow(NULL, gTF, i); }
double Hi(int i) { return iHigh(NULL, gTF, i); }
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

// latest intact lines, for the channel 50% check
bool gUpOn = false, gDnOn = false; double gUpS, gUpP, gUpW, gDnS, gDnP, gDnW; int gUpB, gDnB;
double LineAt(double p, int b, double sl, int j) { return p + sl * (b - j); }   // value at bar j of a line through (b, p), slope per bar toward newer bars

// Kevin: attach at the anchor; move it only when a candle really pokes through (more than a quarter ATR)
int FitAnchor(int A, int b2, double p2, int d, double &sl)
  {
   int a = A; double tol = 0.05 * iATR(NULL, gTF, 14, 1);            // Kevin: trendlines never cut a candle (only a hair of slack)
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
   TLine t; t.dir = d; t.a = a; t.b = b2; t.pb = p2; t.pa = LineAt(p2, b2, sl, a); t.removedBar = RemovedAt(b2, p2, sl, d); t.removed = t.removedBar >= 0; t.conf = !overall;
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
// every drawn line: anchor time, touch time, direction, broken?, rank (the higher timeframe wins: it carries more weight)
string rgN[]; datetime rgA[], rgB[]; int rgD[], rgR[]; bool rgX[];
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
   double tol = 0.3 * iATR(NULL, 0, 14, 1);
   datetime ta = Time[0], tb = Time[MathMin(30, Bars - 1)];
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
// HTF pivot bars aH / bH -> this chart's bars holding the extreme inside each, then the no-cut fit on this chart.
// false when this chart's history does not reach back to the anchor (the HTF coordinates are used then).
int ChartBarIn(int d, int hb)
  {
   datetime t0 = iTime(NULL, gTF, hb), t1 = hb > 0 ? iTime(NULL, gTF, hb - 1) : TimeCurrent() + 1;
   if(t0 < Time[Bars - 1]) return -1;
   int j0 = iBarShift(NULL, 0, t0), j1 = iBarShift(NULL, 0, t1);
   if(Time[j1] >= t1) j1++;                                            // first chart bar of the next HTF bar is not ours
   if(hb == 0) j1 = 0;
   int cnt = j0 - j1 + 1;
   if(cnt < 1) return -1;
   return d > 0 ? iLowest(NULL, 0, MODE_LOW, cnt, j1) : iHighest(NULL, 0, MODE_HIGH, cnt, j1);
  }
// anchor = this chart's candle holding the extreme inside the HTF anchor bar; touch = the swing point of THIS chart
// that keeps every other swing on the right side of the line (a tangent), searched until the HTF break - the way you
// refine touch points going down the timeframes. Falls back to the candle inside the HTF pivot bar.
bool RefineOnChart(int d, int aH, int bH, int endH, int &ca, int &cb, double &csl)
  {
   ca = ChartBarIn(d, aH);
   if(ca < 0) return false;
   int stop = endH >= 0 ? iBarShift(NULL, 0, iTime(NULL, gTF, endH)) + 1 : 1;
   int keep = gTF; gTF = _Period;
   double pa = d > 0 ? Low[ca] : High[ca], best = 0; cb = -1;
   for(int j = ca - InpTLSwing - 1; j >= MathMax(stop, InpTLSwing + 1); j--)
     {
      if(!(d > 0 ? FrLow(j) : FrHigh(j))) continue;
      double s0 = ((d > 0 ? Low[j] : High[j]) - pa) / (ca - j);
      if((d > 0 && s0 <= 0) || (d < 0 && s0 >= 0)) continue;
      if(cb < 0 || (d > 0 ? s0 < best : s0 > best)) { cb = j; best = s0; }
     }
   if(cb < 0) { gTF = keep; cb = ChartBarIn(d, bH); if(cb < 0 || cb >= ca) return false; gTF = _Period; }
   // Kevin: if the line cuts a candle between the anchor and the touch, move the anchor to the next highest (lowest)
   // point that cuts nothing - on THIS chart's candles
   ca = FitAnchor(ca, cb, d > 0 ? Low[cb] : High[cb], d, csl);
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
   double atr = MathMax(iATR(NULL, gTF, 14, b2), Point);
   return MathAbs(sl) < 0.015 * atr || MathAbs(p2 - LineAt(p2, b2, sl, a)) < 1.5 * atr;
  }

// Kevin's lines: every real valley (peak) gets a line from the previous real one - or, if that is too flat, from the
// original starting point of the current line, else from the lowest (highest) point before it. Each line is drawn until a full candle closes beyond it, then ended there.
// Plus the overall line from the very bottom (top) of the move, when it has a real angle. Near-flat lines are dropped.
void Trendlines(string s, int tf)
  {
   ArrayResize(TL, 0); gUpOn = false; gDnOn = false;
   int bars = MathMin(InpLookback, iBars(NULL, gTF) - 20);
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
         int A = d > 0 ? iLowest(NULL, gTF, MODE_LOW, bars - b2, b2 + 1) : iHighest(NULL, gTF, MODE_HIGH, bars - b2, b2 + 1);
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
      int O = d > 0 ? iLowest(NULL, gTF, MODE_LOW, bars, 1) : iHighest(NULL, gTF, MODE_HIGH, bars, 1);
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
         if(TL[i].dir != d) continue;
         bool keep = i == newest || (!TL[i].conf && !TL[i].removed) || (TL[i].removed && newest >= 0 && TL[i].b > TL[newest].a);
         if(!keep || shown >= InpTLHistory) continue;
         shown++;
         bool up = d > 0;
         double sl = (TL[i].pb - TL[i].pa) / MathMax(1, TL[i].a - TL[i].b);
         int end = TL[i].removed ? TL[i].removedBar : 0;
         double pe = LineAt(TL[i].pb, TL[i].b, sl, end - (TL[i].removed ? 0 : 3));
         string nm = PFX + "tl" + (gTF == _Period ? "" : "H" + IntegerToString(gTF) + "_") + IntegerToString(i);
         color c = gTF == _Period ? (TL[i].removed ? InpMuted : InpTrend) : (TL[i].removed ? InpHtfTLBroken : InpHtfTL);   // broken: light dotted; respected: thick dark
         datetime x1 = iTime(NULL, gTF, TL[i].a), x2 = TL[i].removed ? iTime(NULL, gTF, end) : iTime(NULL, gTF, 0) + PeriodSeconds(gTF) * 3;
         double y1 = TL[i].pa;
         // higher-timeframe line on this chart: re-anchor it on this chart's own candles - the top-most (bottom-most)
         // candle inside each HTF pivot, then moved so it cuts no candle of this chart (clean, exact touch points)
         if(gTF != _Period && InpRefineHTF)
           {
            int ca, cb; double csl;
            if(RefineOnChart(d, TL[i].a, TL[i].b, TL[i].removed ? TL[i].removedBar : -1, ca, cb, csl))
              {
               double pcb = up ? Low[cb] : High[cb];
               x1 = Time[ca]; y1 = up ? Low[ca] : High[ca];
               if(TL[i].removed) { int ce = iBarShift(NULL, 0, iTime(NULL, gTF, end)); x2 = Time[ce]; pe = pcb + csl * (cb - ce); }
               else { x2 = Time[0] + PeriodSeconds() * 3; pe = pcb + csl * (cb + 3); }
              }
           }
         datetime tTouch = iTime(NULL, gTF, TL[i].b);
         if(gTF != _Period && InpRefineHTF) { int ca2, cb2; double cs2; if(RefineOnChart(d, TL[i].a, TL[i].b, TL[i].removed ? TL[i].removedBar : -1, ca2, cb2, cs2)) tTouch = Time[cb2]; }
         if(InpShowTrendlines) { ObjectCreate(0, nm, OBJ_TREND, 0, x1, y1, x2, pe); RegTL(nm, x1, tTouch, d, TL[i].removed, gTF == _Period ? 0 : gTF); }
         ObjectSetInteger(0, nm, OBJPROP_RAY_RIGHT, false);
         ObjectSetInteger(0, nm, OBJPROP_COLOR, c);
         ObjectSetInteger(0, nm, OBJPROP_STYLE, TL[i].removed || gTF != _Period ? STYLE_DOT : STYLE_SOLID);   // HTF lines: thin dotted gold
         ObjectSetInteger(0, nm, OBJPROP_WIDTH, 1);                     // all lines thin
         ObjectSetInteger(0, nm, OBJPROP_TIMEFRAMES, VisUpTo(gTF));
         ObjectSetInteger(0, nm, OBJPROP_SELECTABLE, false);
         ObjectSetString(0, nm, OBJPROP_TOOLTIP, TfName(gTF) + (TL[i].conf ? " " : " overall ") + (up ? "uptrend line: real valley, then a higher high" : "downtrend line: real peak, then a lower low")
            + (TL[i].removed ? " | ENDED: a full candle closed " + (up ? "below" : "above") + " it on " + TimeToString(iTime(NULL, gTF, end), TIME_DATE | TIME_MINUTES) : " | respected so far"));
         if(gTF != _Period && InpShowTrendlines && !TL[i].removed)
           { string ln = nm + "l"; ObjectCreate(0, ln, OBJ_TEXT, 0, x2, pe); ObjectSetString(0, ln, OBJPROP_TEXT, " " + TfName(gTF) + " trendline");
             ObjectSetInteger(0, ln, OBJPROP_COLOR, InpHtfTL); ObjectSetInteger(0, ln, OBJPROP_FONTSIZE, 7); ObjectSetInteger(0, ln, OBJPROP_ANCHOR, ANCHOR_LEFT); ObjectSetInteger(0, ln, OBJPROP_SELECTABLE, false); ObjectSetInteger(0, ln, OBJPROP_TIMEFRAMES, VisUpTo(gTF)); }
        }
      // channel 50% (golden area / overextended) from the newest respected line: used by the checks, drawn only if asked
      if(use >= 0)
        {
         int i = use; bool up = d > 0;
         double sl = (TL[i].pb - TL[i].pa) / MathMax(1, TL[i].a - TL[i].b), w = 0;
         for(int j = TL[i].a; j >= 1; j--) w = MathMax(w, up ? Hi(j) - LineAt(TL[i].pb, TL[i].b, sl, j) : LineAt(TL[i].pb, TL[i].b, sl, j) - Lo(j));
         if(up) { gUpOn = true; gUpS = sl; gUpP = TL[i].pb; gUpB = TL[i].b; gUpW = w; } else { gDnOn = true; gDnS = sl; gDnP = TL[i].pb; gDnB = TL[i].b; gDnW = w; }
         if(InpShowChannel && InpShowTrendlines && gTF == _Period)
           {
            string cn = PFX + "tlc" + (up ? "u" : "d");
            double off = up ? w / 2 : -w / 2, pe = LineAt(TL[i].pb, TL[i].b, sl, -3);
            ObjectCreate(0, cn, OBJ_TREND, 0, iTime(NULL, gTF, TL[i].a), TL[i].pa + off, iTime(NULL, gTF, 0) + PeriodSeconds(gTF) * 3, pe + off);
            ObjectSetInteger(0, cn, OBJPROP_RAY_RIGHT, false); ObjectSetInteger(0, cn, OBJPROP_COLOR, InpMuted); ObjectSetInteger(0, cn, OBJPROP_STYLE, STYLE_DOT);
            ObjectSetInteger(0, cn, OBJPROP_SELECTABLE, false);
            ObjectSetString(0, cn, OBJPROP_TOOLTIP, "Channel 50%: between the trendline and this line = golden area. Beyond it = overextended, wait.");
           }
        }
     }
  }
// price beyond 50% of the channel, in the trend direction
// supply: is the active downtrend line above the zone (+1: price reaches the zone without crossing it, the line
// protects it) or between price and the zone (-1: price must break the line first)? Demand mirrored. 0 = no line.
int CrossNeeded(int dir, double prox)
  {
   double px = (Bid + Ask) / 2, v[2]; int n = 0;
   if(dir < 0 && gDnOn) v[n++] = LineAt(gDnP, gDnB, gDnS, 0);
   if(dir > 0 && gUpOn) v[n++] = LineAt(gUpP, gUpB, gUpS, 0);
   if(gHTF > 0)
     {
      int sh = iBarShift(NULL, gHTF, Time[0]);
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
bool   gHUpOn = false, gHDnOn = false; double gHUpS, gHUpP, gHUpW, gHDnS, gHDnP, gHDnW; int gHUpB, gHDnB, gHTF = 0;
int gHBias = 0; string gHBiasTxt = "";
// the newest broken line on the HTF decides: a downtrend line broken = bullish, an uptrend line broken = bearish
void TLBias()
  {
   int best = -1;
   for(int i = 0; i < ArraySize(TL); i++) if(TL[i].removed && (best < 0 || TL[i].removedBar < TL[best].removedBar)) best = i;
   if(best < 0) { gHBias = 0; gHBiasTxt = ""; return; }
   gHBias = -TL[best].dir;
   gHBiasTxt = StringFormat("%s %s trendline broken on %s", TfName(gTF), TL[best].dir > 0 ? "uptrend" : "downtrend", TimeToString(iTime(NULL, gTF, TL[best].removedBar), TIME_DATE));
  }
// zone sits within 1 ATR of the respected trendline in its direction (chart or HTF): "", "chart" or the HTF name
string NearTrendline(int dir, double price)
  {
   double atr = iATR(NULL, 0, 14, 1);
   if(dir > 0 && gUpOn && MathAbs(price - LineAt(gUpP, gUpB, gUpS, 0)) <= atr) return TfName(_Period);
   if(dir < 0 && gDnOn && MathAbs(price - LineAt(gDnP, gDnB, gDnS, 0)) <= atr) return TfName(_Period);
   if(gHTF > 0)
     {
      int sh = iBarShift(NULL, gHTF, Time[0]);
      if(dir > 0 && gHUpOn && MathAbs(price - (gHUpP + gHUpS * (gHUpB - sh))) <= atr) return TfName(gHTF);
      if(dir < 0 && gHDnOn && MathAbs(price - (gHDnP + gHDnS * (gHDnB - sh))) <= atr) return TfName(gHTF);
     }
   return "";
  }
bool Overextended(int dir, double price)
  {
   if(gHTF > 0)
     {
      int sh = iBarShift(NULL, gHTF, Time[0]);
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
      int span = MathMin(InpLookback, Bars - older - 1);
      bool rmHL = false;
      if(span > 5)
        {
         int nx = MathMax(L - 5, 1);
         double legX = Z[i].dir > 0 ? High[iHighest(NULL, 0, MODE_HIGH, L - nx + 1, nx)] : Low[iLowest(NULL, 0, MODE_LOW, L - nx + 1, nx)];
         if(Z[i].dir > 0 && legX > High[iHighest(NULL, 0, MODE_HIGH, span, older)]) q += "new high | ";
         if(Z[i].dir < 0 && legX < Low[iLowest(NULL, 0, MODE_LOW, span, older)]) q += "new low | ";
         // the previous swing high (for demand) / low (for supply) before the base: did the move away take it out?
         for(int j = older; j < older + span && j < Bars - InpTLSwing - 1; j++)
           {
            if(Z[i].dir > 0 && FrHigh(j)) { rmHL = legX > High[j]; break; }
            if(Z[i].dir < 0 && FrLow(j))  { rmHL = legX < Low[j]; break; }
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
   Txt(nm, t, p, "(" + DoubleToString(p, Digits) + ")", c, 7, ANCHOR_RIGHT);
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
   if(z.arrival) Push(pl, "ARRIVAL zone: broke the trendline AND took out the previous high / low or a zone");
   if(z.chain) Push(pl, "in the chain: " + z.qual); else Push(cr, "not in the chain (removed nothing)");
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
   int htf = HtfOf(_Period); if(htf <= 0) htf = _Period;
   double xa = MathAbs((Bid + Ask) / 2 - z.prox) / MathMax(iATR(NULL, htf, 14, 1), Point);
   if(xa > InpMaxDistATR) Push(mi, StringFormat("far: %.1f x %s ATR", xa, TfName(htf)));
   int np = ArraySize(pl), nm = ArraySize(mi), nc = ArraySize(cr);
   verdict = nc > 0 ? "WEAK" : ((np >= 5 && nm <= 1) || z.arrival ? "STRONG" : "OK");
   if(nc > 0) shortWhy = cr[0] + (nc > 1 ? ", " + cr[1] : "");
   else if(verdict == "STRONG") shortWhy = pl[0] + (np > 1 ? ", " + pl[1] : "");
   else shortWhy = (nm > 0 ? mi[0] : (np > 0 ? pl[0] : ""));
   string t = verdict + "\n";
   for(int k = 0; k < nc; k++) t += "x " + cr[k] + NoteHelp(cr[k]) + "\n";
   for(int k = 0; k < nm; k++) t += "- " + mi[k] + NoteHelp(mi[k]) + "\n";
   for(int k = 0; k < np; k++) t += "+ " + pl[k] + NoteHelp(pl[k]) + "\n";
   if(StringLen(t) > 1000) t = StringSubstr(t, 0, 990) + "...";      // MT4 hides tooltips that are too long
   return t;
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
      if(!htf && InpOnlyQualified && !zs[i].chain && !zs[i].removed) continue;
      if(!htf && TooSmall(zs, i)) continue;
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
      int zi = idx[best]; Zone z = zs[zi]; string id = PFX + (htf ? "H" : "Z") + IntegerToString(zi); idx[best] = -1;
      string verdict = "", shortWhy = "", full = htf ? "" : ZoneNotes(zs, zi, verdict, shortWhy);
      color fill = htf ? InpHtfFill : (z.removed ? C'250,230,212' : (z.dir > 0 ? InpDemandFill : InpSupplyFill));
      color line = z.removed ? InpMuted : (z.dir > 0 ? InpDemandLine : InpSupplyLine);
      datetime t1 = iTime(_Symbol, tf, z.legBar + z.baseN);
      datetime t2 = z.removed ? iTime(_Symbol, tf, z.removedBar) : right;
      ObjectCreate(0, id, OBJ_RECTANGLE, 0, t1, z.prox, t2, z.dist);
      ObjectSetInteger(0, id, OBJPROP_COLOR, fill); ObjectSetInteger(0, id, OBJPROP_BACK, true); ObjectSetInteger(0, id, OBJPROP_SELECTABLE, false);
      string state = z.removed ? "removed" : (z.tested ? "tested" : "fresh");
      ObjectSetString(0, id, OBJPROP_TOOLTIP, htf ? TfName(tf) + " " + ZoneName(z) : ZoneName(z) + " - " + full);
      if(!htf)
        {
         HLine(id + "p", t1, t2, z.prox, line, STYLE_SOLID, z.arrival ? 2 : 1);
         HLine(id + "d", t1, t2, z.dist, line, STYLE_SOLID, z.arrival ? 2 : 1);
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
         string nm = htf ? TfName(tf) + " " + (z.dir > 0 ? "demand" : "supply") : (z.arrival ? "ARRIVAL | " : "") + ZoneName(z) + " | " + verdict + (shortWhy == "" ? "" : ": " + shortWhy);
         Txt(id + "n", t1, z.dir > 0 ? z.dist : z.dist, nm, verdict == "WEAK" ? InpMuted : InpText, 7, z.dir > 0 ? ANCHOR_LEFT_UPPER : ANCHOR_LEFT_LOWER);
         if(!htf) ObjectSetString(0, id + "n", OBJPROP_TOOLTIP, full);
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
   if(gHBiasTxt != "") L += "Trendline bias: " + (gHBias > 0 ? "UP - " : "DOWN - ") + gHBiasTxt + "\n";
   { double mid = (Bid + Ask) / 2;
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
      double buf = InpStopBufferPts * Point * (MetalOrOil() ? InpMetalOilStop : 1.0);
      double sl = dir > 0 ? Z[i].dist - buf : Z[i].dist + buf + spread;
      double tp = opp > 0 ? (dir > 0 ? opp - spread : opp + spread) : 0;
      double rr = tp > 0 ? MathAbs(tp - entry) / MathMax(MathAbs(entry - sl), Point) : 0;
      string why = "";
      if(trend == 0) why = "HTF bias unclear";
      else if(trend != dir) why = "against HTF bias";
      else if(tp == 0) why = "no opposing zone for a target";
      else if(rr < InpMinRR) why = StringFormat("R:R %.1f below %.1f", rr, InpMinRR);
      int dtf = htf > 0 ? htf : _Period;
      double hatr = iATR(NULL, dtf, 14, 1), far = MathAbs((Bid + Ask) / 2 - Z[i].prox), xatr = far / MathMax(hatr, Point);
      string dline = StringFormat("Distance: %.1f x %s ATR (%s away, ATR %s)", xatr, TfName(dtf), DoubleToString(far, Digits), DoubleToString(hatr, Digits));
      if(why == "" && xatr > InpMaxDistATR)
        {
         static double hwProx = 0, hwHalf = 0;                         // halfway is fixed when the zone first shows as far
         if(MathAbs(hwProx - Z[i].prox) > Point) { hwProx = Z[i].prox; hwHalf = ((Bid + Ask) / 2 + Z[i].prox) / 2; }
         double half = hwHalf;
         dline += StringFormat(" - FAR: needs ~%d %s candles one way, price often turns first. Planned only; alert at halfway %s", (int)MathCeil(xatr), TfName(dtf), DoubleToString(half, Digits));
         datetime h1 = Time[0], h2 = Time[0] + PeriodSeconds() * 18;
         HLine(PFX + "hw", h1, h2, half, clrGoldenrod, STYLE_DOT, 1); Txt(PFX + "hwt", h2, half, StringFormat(" halfway alert (zone %.1fx ATR away)", xatr), clrGoldenrod, 7, ANCHOR_LEFT);
         ObjectSetString(0, PFX + "hw", OBJPROP_TOOLTIP, dline);
         static double alertedHalf = 0;
         if(InpHalfwayAlert && MathAbs(alertedHalf - half) > 10 * Point && ((dir < 0 && Bid >= half) || (dir > 0 && Bid <= half)))
           { alertedHalf = half; Alert("ZoneVision ", _Symbol, " ", TfName(_Period), ": halfway to the ", dir > 0 ? "demand " : "supply ", DoubleToString(Z[i].prox, Digits), " - check for a new lower-timeframe zone in the chain"); }
        }
      else if(why == "") dline += " - within reach";
      L += dline + "\n";
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
